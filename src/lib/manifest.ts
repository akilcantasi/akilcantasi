// İçerik paketleri kataloğu (packs-manifest.json).
// Katalog uygulamayla birlikte gelir (public/packs-manifest.json) ve bilgi noktası
// sunucusu kendi data/ klasöründe bir packs-manifest.json bulundurursa onu sunar.
// Ağ yoksa, katalog bozuksa ya da adresler erişilemezse uygulama gömülü kopyayla
// çalışmaya devam eder — hiçbir hata kullanıcıya "uygulama çöktü" olarak yansımaz.
import type { InstalledPack, PackKind } from './packs';
import bundled from '../../public/packs-manifest.json';

export type Tier = 'temel' | 'standart' | 'tam';

export interface ManifestPack {
  id: string;
  kind: PackKind;
  name: string;
  desc: string;
  /** OPFS'e ve bilgi noktası data/ klasörüne kaydedilecek dosya adı */
  file: string;
  /** Bayt; 0 = bilinmiyor */
  size: number;
  /** true ise size yalnızca tahmindir (doğrulamada kullanılmaz) */
  sizeApprox?: boolean;
  /** Küçük harf onaltılık SHA-256; boş/yok = doğrulama yapılmaz */
  sha256?: string;
  tier: Tier;
  minRamGB?: number;
  /** Aynalar, sırayla denenir */
  urls: string[];
  license: string;
  source: string;
  /**
   * Bölünmüş (gguf-split) bir modelin parçası ise tüm parçalarda ortak model kimliği.
   * Model ancak bütün parçaları kurulunca kullanılabilir.
   */
  group?: string;
  /**
   * Arşiv paketlerinin (ör. 'ses' .tar) içindeki dosyalar ve kaynak adresleri.
   * Paket sahibi bu dosyaları indirip tek bir tar dosyasında birleştirir.
   */
  contents?: { path: string; url: string; size: number }[];
  /** Paketin nasıl hazırlanacağına dair kısa not */
  howto?: string;
  /** Kütüphane rafı (yalnız zim paketlerinde) */
  shelf?: Shelf;
  /** Kütüphane sekmesindeki "Önerilen indirmeler" listesinde gösterilir */
  featured?: boolean;
}

export type Shelf = 'ansiklopedi' | 'saglik' | 'kitap' | 'hayatta' | 'pratik' | 'dil';
export const SHELVES: Shelf[] = ['ansiklopedi', 'saglik', 'kitap', 'hayatta', 'pratik', 'dil'];
export const SHELF_LABEL: Record<Shelf, string> = {
  ansiklopedi: 'Ansiklopediler',
  saglik: 'Sağlık ve ilaç rehberleri',
  kitap: 'Telifsiz kitaplar',
  hayatta: 'Hayatta kalma ve afet',
  pratik: 'Tamir, tarım ve pratik bilgi',
  dil: 'Sözlük ve dil',
};
export const SHELF_SHORT: Record<Shelf, string> = {
  ansiklopedi: 'Ansiklopedi',
  saglik: 'Sağlık ve ilaç',
  kitap: 'Kitaplar',
  hayatta: 'Hayatta kalma',
  pratik: 'Pratik bilgi',
  dil: 'Sözlük',
};

export interface Manifest {
  version: number;
  updated: string;
  packs: ManifestPack[];
  /** Kütüphane paket setleri (Kütüphane sekmesi); yoksa uygulamadaki varsayılanlar */
  sets?: { id: string; title: string; desc: string; ids: string[] }[];
}

export const KINDS: PackKind[] = ['zim', 'model', 'map', 'poi', 'ses', 'hava'];
export const TIERS: Tier[] = ['temel', 'standart', 'tam'];
export const TIER_LABEL: Record<Tier, string> = { temel: 'Temel', standart: 'Standart', tam: 'Tam' };
export const KIND_LABEL: Record<PackKind, string> = {
  zim: 'Kütüphane',
  model: 'Fener modeli',
  map: 'Harita',
  poi: 'Harita noktaları',
  ses: 'Sesli soru (konuşma tanıma)',
  hava: 'Hava ve iklim',
};

const EXT_BY_KIND: Record<PackKind, string[]> = {
  zim: ['zim'],
  model: ['gguf'],
  map: ['pmtiles'],
  poi: ['geojson', 'json'],
  ses: ['tar'],
  hava: ['json'],
};

/** Katalog doğrulaması. Geçersiz paketler atılır; ciddi hata varsa ok=false. */
export function validateManifest(input: unknown): { ok: boolean; errors: string[]; manifest: Manifest } {
  const errors: string[] = [];
  const empty: Manifest = { version: 0, updated: '', packs: [] };
  if (!input || typeof input !== 'object') return { ok: false, errors: ['katalog nesne değil'], manifest: empty };
  const m = input as any;
  if (typeof m.version !== 'number') errors.push('version sayı olmalı');
  if (typeof m.updated !== 'string') errors.push('updated metin olmalı');
  if (!Array.isArray(m.packs)) {
    errors.push('packs dizi olmalı');
    return { ok: false, errors, manifest: empty };
  }
  const ids = new Set<string>();
  const files = new Set<string>();
  const packs: ManifestPack[] = [];
  m.packs.forEach((p: any, i: number) => {
    const where = `packs[${i}]${p && p.id ? ' (' + p.id + ')' : ''}`;
    const errs: string[] = [];
    if (!p || typeof p !== 'object') {
      errors.push(where + ': nesne değil');
      return;
    }
    if (typeof p.id !== 'string' || !/^[a-z0-9][a-z0-9._-]*$/.test(p.id)) errs.push('id geçersiz');
    else if (ids.has(p.id)) errs.push('id tekrar ediyor');
    if (!KINDS.includes(p.kind)) errs.push('kind geçersiz');
    if (typeof p.name !== 'string' || !p.name) errs.push('name yok');
    if (typeof p.desc !== 'string') errs.push('desc yok');
    if (typeof p.file !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(p.file)) errs.push('file geçersiz');
    else {
      if (files.has(p.file)) errs.push('file tekrar ediyor');
      const ext = p.file.toLowerCase().split('.').pop();
      if (KINDS.includes(p.kind) && !EXT_BY_KIND[p.kind as PackKind].includes(ext)) errs.push('file uzantısı türle uyuşmuyor');
    }
    if (typeof p.size !== 'number' || !(p.size >= 0)) errs.push('size geçersiz');
    if (p.sha256 !== undefined && p.sha256 !== '' && !/^[0-9a-f]{64}$/.test(String(p.sha256))) errs.push('sha256 geçersiz');
    if (!TIERS.includes(p.tier)) errs.push('tier geçersiz');
    if (p.minRamGB !== undefined && typeof p.minRamGB !== 'number') errs.push('minRamGB sayı olmalı');
    if (!Array.isArray(p.urls) || p.urls.length === 0) errs.push('urls boş');
    else if (!p.urls.every((u: unknown) => typeof u === 'string' && /^(https?:\/\/|\.\/|\/|osm:)/.test(u))) errs.push('urls geçersiz');
    if (typeof p.license !== 'string' || !p.license) errs.push('license yok');
    if (typeof p.source !== 'string') errs.push('source yok');
    if (p.group !== undefined && (typeof p.group !== 'string' || !/^[a-z0-9][a-z0-9._-]*$/.test(p.group))) errs.push('group geçersiz');
    if (p.howto !== undefined && typeof p.howto !== 'string') errs.push('howto metin olmalı');
    if (p.shelf !== undefined && !SHELVES.includes(p.shelf)) errs.push('shelf geçersiz');
    if (p.featured !== undefined && typeof p.featured !== 'boolean') errs.push('featured true/false olmalı');
    if (p.contents !== undefined) {
      if (
        !Array.isArray(p.contents) ||
        !p.contents.every(
          (c: any) =>
            c &&
            typeof c.path === 'string' &&
            /^[A-Za-z0-9_][A-Za-z0-9._/-]*$/.test(c.path) &&
            !c.path.includes('..') &&
            typeof c.url === 'string' &&
            /^https:\/\//.test(c.url) &&
            typeof c.size === 'number' &&
            c.size >= 0,
        )
      )
        errs.push('contents geçersiz');
    }
    if (errs.length) {
      errors.push(where + ': ' + errs.join(', '));
      return;
    }
    ids.add(p.id);
    files.add(p.file);
    packs.push({ ...p, sha256: p.sha256 ? String(p.sha256).toLowerCase() : '' });
  });
  return {
    ok: errors.length === 0,
    errors,
    manifest: { version: Number(m.version) || 0, updated: String(m.updated ?? ''), packs, ...(Array.isArray(m.sets) ? { sets: m.sets } : {}) },
  };
}

/**
 * Tarih ekini (_2026-10, _2024-05-12) atarak dosya adını eşleştirme anahtarına çevirir.
 * Böylece kullanıcının içe aktardığı farklı tarihli Kiwix dosyası da katalogla eşleşir.
 */
export function packKey(file: string): string {
  return file.toLowerCase().replace(/_\d{4}-\d{2}(-\d{2})?(?=\.[a-z0-9]+$)/, '');
}

export function matchInstalled(entry: ManifestPack, installed: InstalledPack[]): InstalledPack[] {
  const k = packKey(entry.file);
  return installed.filter((p) => p.kind === entry.kind && packKey(p.id) === k);
}

/** Cihaza göre önerilen paket düzeyi. memGB: navigator.deviceMemory (Chrome'da en çok 8). */
export function recommendTier(o: { memGB?: number | null; freeBytes?: number | null }): { tier: Tier; reason: string } {
  const mem = o.memGB ?? null;
  const free = o.freeBytes ?? null;
  const GB = 1e9;
  const parts: string[] = [];
  if (mem) parts.push(`${String(mem).replace('.', ',')} GB bellek`);
  if (free !== null) parts.push(`${(free / GB).toFixed(0)} GB boş alan`);
  const reason = parts.length ? parts.join(', ') : 'cihaz bilgisi okunamadı';
  if ((mem !== null && mem <= 2) || (free !== null && free < 3 * GB)) return { tier: 'temel', reason };
  if ((mem !== null && mem < 6) || (free !== null && free < 12 * GB) || mem === null) return { tier: 'standart', reason };
  return { tier: 'tam', reason };
}

export function tierIncludes(recommended: Tier, t: Tier) {
  return TIERS.indexOf(t) <= TIERS.indexOf(recommended);
}

/** Merkezi katalog: hf-yukle.cmd her yüklemede günceller (yeni harita/nokta sürümleri, boyutlar) */
export const REMOTE_MANIFEST_URL = 'https://huggingface.co/datasets/akilcantasi/paketler/resolve/main/packs-manifest.json';
export const BUNDLED_MANIFEST: Manifest = validateManifest(bundled).manifest;

let current: Manifest | null = null;

async function fetchJson(url: string, timeoutMs: number): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    // Bazı sunucular .json dosyasını text/plain olarak verir; içerik JSON ise kabul edilir
    const text = await res.text();
    if (!/^\s*[\[{]/.test(text)) throw new Error('json değil');
    return JSON.parse(text);
  } finally {
    clearTimeout(t);
  }
}

function newer(a: Manifest, b: Manifest) {
  return a.updated > b.updated || (a.updated === b.updated && a.version > b.version);
}

/**
 * Kataloğu yükler: önce yanında sunulan ./packs-manifest.json (bilgi noktası kendi
 * kataloğunu sunabilir), olmazsa gömülü kopya. Hiçbir zaman hata fırlatmaz.
 */
export async function loadManifest(force = false): Promise<Manifest> {
  if (current && !force) return current;
  let m = BUNDLED_MANIFEST;
  try {
    const r = validateManifest(await fetchJson('./packs-manifest.json', 4000));
    if (r.manifest.packs.length) m = r.manifest;
  } catch {
    /* gömülü kopya kullanılır */
  }
  current = m;
  return m;
}

/** İnternet varsa merkezi kataloğu dener; daha yeniyse onu döndürür. Hata fırlatmaz. */
export async function refreshRemoteManifest(): Promise<Manifest | null> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return null;
  try {
    const r = validateManifest(await fetchJson(REMOTE_MANIFEST_URL, 5000));
    const base = current ?? BUNDLED_MANIFEST;
    if (r.manifest.packs.length && newer(r.manifest, base)) {
      current = r.manifest;
      return r.manifest;
    }
  } catch {
    /* erişilemiyor — sorun değil */
  }
  return null;
}
