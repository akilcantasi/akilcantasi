// Kurulu rehber paketleri (.rehber.json, ör. "Kendine Yetmek": uzun süre yardım gelmezse yaşamı sürdürme rehberleri).
// Paketler OPFS'ten ya da bağlı bilgi noktasından okunur, doğrulanır ve bellekte tutulur.
// Paket listesi değişince (indirme, içe aktarma, silme → packsVersion) yeniden yüklenir
// ve abonelere haber verilir. Yerleşik rehberlere (src/content/guides.ts) dokunulmaz.
import { useEffect, useState } from 'preact/hooks';
import type { CategoryMeta, Guide } from './types';
import { svgDataUri, validateRehberPack, type RehberPack, type RehberPackGuide } from './rehber-pack';
import { getState, subscribe } from '../lib/store';
import { GUIDES } from './guides';

export interface PackCategory extends CategoryMeta {
  guides: string[];
  packId: string;
}

interface Loaded {
  /** dosya adı + boyut: değişmeyen paket yeniden ayrıştırılmaz */
  key: string;
  file: string;
  pack: RehberPack;
}

let loaded: Loaded[] = [];
let guides: RehberPackGuide[] = [];
let categories: PackCategory[] = [];
let artIndex = new Map<string, string>();
const artUri = new Map<string, string>();
let version = 0;
const listeners = new Set<() => void>();
/** Paketlerdeki hatalar (Kütüphane'de gösterilebilir) */
export const packErrors: Record<string, string[]> = {};

function rebuild() {
  // Yerleşik rehber kimlikleriyle çakışan paket rehberi yok sayılır
  const seen = new Set<string>(GUIDES.map((g) => g.id));
  const catSeen = new Set<string>();
  guides = [];
  categories = [];
  artIndex = new Map();
  artUri.clear();
  for (const l of loaded) {
    for (const [k, v] of Object.entries(l.pack.art)) if (!artIndex.has(k)) artIndex.set(k, v);
    const own: RehberPackGuide[] = [];
    for (const g of l.pack.guides) {
      if (seen.has(g.id)) continue;
      seen.add(g.id);
      own.push(g);
    }
    guides.push(...own);
    for (const c of l.pack.categories) {
      if (catSeen.has(c.id)) continue;
      catSeen.add(c.id);
      const ids = [...own.filter((g) => g.category === c.id), ...own.filter((g) => g.category !== c.id && g.alsoIn?.includes(c.id))].map((g) => g.id);
      if (!ids.length) continue;
      // Kapak çizimi pakette yoksa ilk çizimli rehberin çizimi kullanılır
      const cover = artIndex.has(c.art) ? c.art : (own.find((g) => ids.includes(g.id) && g.art?.some((a) => a && artIndex.has(a)))?.art?.find((a) => a && artIndex.has(a)) ?? c.art);
      categories.push({ ...c, art: cover, guides: ids, packId: l.pack.pack.id });
    }
  }
  categories.sort((a, b) => a.order - b.order);
  version++;
  listeners.forEach((f) => f());
}

/** Ayrıştırılmış paketleri doğrudan yükler (yükleyici ve testler kullanır). */
export function setLoadedPacks(list: { file: string; pack: RehberPack; key?: string }[]) {
  loaded = list.map((x) => ({ key: x.key ?? x.file, file: x.file, pack: x.pack })).sort((a, b) => a.file.localeCompare(b.file));
  rebuild();
}

/** Kurulu paket dosyasının adı, açıklaması ve rehber sayısı (Kütüphane satırı için) */
export function packInfoForFile(file: string): { name: string; desc: string; guides: number } | null {
  const l = loaded.find((x) => x.file === file);
  return l ? { name: l.pack.pack.name, desc: l.pack.pack.desc, guides: l.pack.guides.length } : null;
}

export function getPackGuides(): RehberPackGuide[] {
  return guides;
}
export function getPackGuide(id: string | null | undefined): RehberPackGuide | undefined {
  return id ? guides.find((g) => g.id === id) : undefined;
}
export function isPackGuide(id: string): boolean {
  return guides.some((g) => g.id === id);
}
export function getPackCategories(): PackCategory[] {
  return categories;
}
export function packCategoryOf(guideId: string): PackCategory | undefined {
  return categories.find((c) => c.guides.includes(guideId));
}
/** Paket çiziminin <img> adresi (temizlenmiş SVG'den); yoksa null */
export function packArtUri(id: string): string | null {
  const svg = artIndex.get(id);
  if (!svg) return null;
  let u = artUri.get(id);
  if (!u) artUri.set(id, (u = svgDataUri(svg)));
  return u;
}
export function hasPackArt(id: string): boolean {
  return artIndex.has(id);
}
export function packGuidesVersion(): number {
  return version;
}
export function subscribePackGuides(f: () => void) {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
}
/** Bileşeni paket değişikliklerine abone eder; sürüm numarasını döndürür. */
export function usePackGuides(): number {
  const [v, set] = useState(version);
  useEffect(() => {
    set(version);
    return subscribePackGuides(() => set(version));
  }, []);
  return v;
}

/** Metni ayrıştırıp doğrular; geçersizse hata fırlatır. */
export function parseRehberPack(text: string): { pack: RehberPack; errors: string[] } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('Dosya JSON değil');
  }
  const r = validateRehberPack(json);
  if (!r.pack) throw new Error('Rehber paketi değil: ' + r.errors.join('; '));
  if (!r.pack.guides.length) throw new Error('Pakette geçerli rehber yok');
  return { pack: r.pack, errors: r.errors };
}

let loading: Promise<void> | null = null;
let again = false;

/** Kurulu rehber paketlerini (yeniden) yükler. Hata fırlatmaz. */
export function reloadPackGuides(): Promise<void> {
  if (loading) {
    again = true;
    return loading;
  }
  loading = (async () => {
    const errsBefore = JSON.stringify(packErrors);
    try {
      const { listPacks, openBlob } = await import('../lib/packs');
      const list = (await listPacks()).filter((p) => p.kind === 'rehber');
      const next: Loaded[] = [];
      for (const p of list) {
        const key = `${p.origin}:${p.id}:${p.size}`;
        const old = loaded.find((l) => l.key === key);
        if (old) {
          next.push(old);
          continue;
        }
        try {
          // openBlob: tarayıcı deposu (OPFS), Android uygulamasının paket klasörü (/_paket/)
          // ve bilgi noktası sunucusu için aynı yol
          const text = await (await openBlob(p)).text();
          const { pack, errors } = parseRehberPack(text);
          if (errors.length) packErrors[p.id] = errors;
          else delete packErrors[p.id];
          next.push({ key, file: p.id, pack });
        } catch (e) {
          packErrors[p.id] = [(e as Error).message];
        }
      }
      const changed = next.length !== loaded.length || next.some((l, i) => l !== loaded[i]);
      if (changed) setLoadedPacks(next);
      else if (JSON.stringify(packErrors) !== errsBefore) {
        // Paket açılamadı: rehber listesi değişmese de arayüz hatayı göstermeli
        // (yoksa Rehber'deki kart "rehberler açılıyor…" yazısında kalıyordu)
        version++;
        listeners.forEach((f) => f());
      }
    } catch {
      /* depolama okunamıyor — paket rehberi yok sayılır */
    }
  })().finally(() => {
    loading = null;
    if (again) {
      again = false;
      void reloadPackGuides();
    }
  });
  return loading;
}

let started = false;
/** Uygulama açılışında bir kez çağrılır: paketleri yükler, paket listesi değişince yeniler. */
export function initPackGuides() {
  if (started) return;
  started = true;
  let pv = getState().packsVersion;
  void reloadPackGuides();
  subscribe((s) => {
    if (s.packsVersion !== pv) {
      pv = s.packsVersion;
      void reloadPackGuides();
    }
  });
}

/** Rehber paketini dosyadan içe aktarır: önce içeriği doğrular, sonra cihaza kopyalar. */
export async function importRehberPack(file: File): Promise<{ name: string; guides: number; warnings: string[] }> {
  if (!file.name.toLowerCase().endsWith('.rehber.json')) throw new Error('Dosya adı ".rehber.json" ile bitmeli');
  const { pack, errors } = parseRehberPack(await file.text());
  const { importFile } = await import('../lib/packs');
  await importFile(file);
  await reloadPackGuides();
  return { name: pack.pack.name, guides: pack.guides.length, warnings: errors };
}

export type { Guide };
