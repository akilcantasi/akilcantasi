// Kütüphane sekmesinin iç ekranı (Kitaplığım / koleksiyon / mağaza / yönet) ve koleksiyon listesi.
// İç ekran modül düzeyinde tutulur: başka sekmeye geçip dönünce ya da makaleden çıkınca kalınan yer korunur.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { getLibraries, getLibraryError, devZimUrls, disambiguateLabels, type LibrarySource } from '../../lib/library';
import { usePackRows, type RowModel } from '../../lib/packs-ui';
import { setState, useAppState } from '../../lib/store';
import { gorunum, okunanlar, sonOkuma, ustVeri, ustVeriYaz, type Ihtiyac, type Kategori, type Okunan, type UstVeri } from './veri';

export type Ekran =
  | { ad: 'ana' }
  | { ad: 'ara' }
  | { ad: 'koleksiyon'; id: string }
  | { ad: 'magaza'; bolum?: Ihtiyac }
  | { ad: 'yonet' };

/**
 * İç ekranlar, uygulamanın gezinme durumundaki openArticlePath alanında "kt:" önekiyle tutulur
 * (makale referansları "@kaynak/yol" biçimindedir). Böylece Android geri tuşu ve tarayıcı geçmişi
 * (src/gecmis.ts) iç ekranları da öteki ekranlar gibi kaydeder: geri tuşu koleksiyondan
 * Kitaplığım'a, makaleden geldiği ekrana döner; ayrı "katman" gerekmez.
 */
const ONEK = 'kt:';

export function ekranKodu(e: Ekran): string | null {
  switch (e.ad) {
    case 'ana':
      return null;
    case 'ara':
      return ONEK + 'ara';
    case 'koleksiyon':
      return ONEK + 'koleksiyon/' + e.id;
    case 'magaza':
      return ONEK + 'magaza' + (e.bolum ? '/' + e.bolum : '');
    case 'yonet':
      return ONEK + 'yonet';
  }
}

export function ekranOf(p: string | null): Ekran {
  if (!p || !p.startsWith(ONEK)) return { ad: 'ana' };
  const v = p.slice(ONEK.length);
  if (v === 'ara') return { ad: 'ara' };
  if (v === 'yonet') return { ad: 'yonet' };
  if (v === 'magaza' || v.startsWith('magaza/')) return { ad: 'magaza', bolum: (v.slice(7) || undefined) as Ihtiyac | undefined };
  if (v.startsWith('koleksiyon/')) return { ad: 'koleksiyon', id: v.slice(11) };
  return { ad: 'ana' };
}

/** openArticlePath bir makale mi (iç ekran ya da boş değil) */
export function makaleMi(p: string | null): p is string {
  return !!p && !p.startsWith(ONEK);
}

/** Makale açılmadan önceki iç ekranın kodu (okuyucudaki "←" oraya döner) */
let sonEkran: string | null = null;
export function sonEkranKodu() {
  return sonEkran;
}
export function sonEkranYaz(kod: string | null) {
  sonEkran = kod;
}

/** Kitaplığım'daki arama sorgusu (sekme değişiminde korunur) */
let anaSorgu = '';
export function getAnaSorgu() {
  return anaSorgu;
}
export function setAnaSorgu(q: string) {
  anaSorgu = q;
}

export function setEkran(e: Ekran) {
  setState({ tab: 'kutuphane', openArticlePath: ekranKodu(e) });
  try {
    document.getElementById('main')?.scrollTo({ top: 0 });
  } catch {
    /* test ortamı */
  }
}

export function useEkran(): Ekran {
  const s = useAppState();
  return ekranOf(makaleMi(s.openArticlePath) ? sonEkran : s.openArticlePath);
}

/** Ekranın kullanıcıya görünen adı (okuyucudaki "←" düğmesi için) */
export function ekranAdi(e: Ekran, koleksiyonAdi?: (id: string) => string | undefined): string {
  if (e.ad === 'koleksiyon') return koleksiyonAdi?.(e.id) ?? 'Koleksiyon';
  if (e.ad === 'magaza') return 'İçerik indir';
  if (e.ad === 'yonet') return 'Yer aç';
  if (e.ad === 'ara') return 'Sonuçlar';
  return 'Kitaplığım';
}

// ---------------------------------------------------------------------------
// Arşivler (arama ve okuma için): ilk istekte açılır, packsVersion değişince yeniden
// ---------------------------------------------------------------------------

/**
 * Arşivleri açar (start true olunca). Kitaplığım ilk çizimde arşivleri açmaz; arama kutusuna
 * dokununca, bir koleksiyon açılınca ya da tarayıcı boşta kalınca başlar.
 */
export function useKaynaklar(start: boolean): LibrarySource[] | undefined {
  const s = useAppState();
  const dev = devZimUrls().length > 0;
  const [sources, setSources] = useState<LibrarySource[] | undefined>(undefined);
  const [go, setGo] = useState(start || dev);
  useEffect(() => {
    if (start) setGo(true);
  }, [start]);
  // Boşta ısıt: ilk çizimden sonra, kullanıcıyı bekletmeden
  useEffect(() => {
    if (go) return;
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setGo(true), { timeout: 2500 }) : setTimeout(() => setGo(true), 1200);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
  }, [go]);
  useEffect(() => {
    if (!go) return;
    let alive = true;
    // Paket listesi değişince eski liste yenisi gelene kadar görünür kalır
    getLibraries()
      .then((l) => {
        if (!alive) return;
        setSources(l);
        ustVeriYaz(l);
      })
      .catch(() => alive && setSources([]));
    return () => {
      alive = false;
    };
  }, [go, s.packsVersion]);
  return sources;
}

// ---------------------------------------------------------------------------
// Koleksiyonlar: paket listesi + katalog + önbellekteki üstveri (+ açıldıysa arşiv)
// ---------------------------------------------------------------------------

export interface Koleksiyon {
  /** Paket kimliği (dosya adı) = LibrarySource.id */
  id: string;
  ad: string;
  /** Türkçe değilse dil adı */
  dil: string;
  kategori: Kategori;
  aciklama: string;
  boyut: number;
  /** Bilgi noktasından okunuyorsa true (telefonda değil) */
  bilgiNoktasi: boolean;
  /** Katalog satırı (indirme, güncelleme, silme) */
  row?: RowModel;
  meta: UstVeri | null;
  src?: LibrarySource;
  /** Arşivler açıldı ama bu açılamadı */
  hata?: string;
  sonOkuma: number;
}

function hataOf(id: string): string | undefined {
  const e = getLibraryError();
  if (!e) return undefined;
  const part = e.split('; ').find((x) => x.startsWith(id + ': '));
  return part ? part.slice(id.length + 2) : undefined;
}

export function useKoleksiyonlar(sources: LibrarySource[] | undefined) {
  const packs = usePackRows();
  const { rows, loaded } = packs;
  const s = useAppState();
  const [okunan, setOkunan] = useState<Okunan[]>(okunanlar);
  // Okuyucudan dönünce son okunanlar tazelensin
  useEffect(() => setOkunan(okunanlar()), [s.openArticlePath, s.packsVersion]);

  const list = useMemo(() => {
    const out: Koleksiyon[] = [];
    const seen = new Set<string>();
    const bySrc = new Map((sources ?? []).map((x) => [x.id, x]));
    for (const r of rows) {
      if (r.kind !== 'zim') continue;
      const inst = r.device ?? r.server;
      if (!inst) continue;
      const id = inst.id;
      seen.add(id);
      const meta = ustVeri(id, inst.size);
      const g = gorunum(id, r.entry, meta);
      const src = bySrc.get(id);
      out.push({
        id,
        ...g,
        aciklama: r.entry?.desc || meta?.desc || src?.description || '',
        boyut: inst.size,
        bilgiNoktasi: !r.device,
        row: r,
        meta,
        src,
        hata: sources && !src ? hataOf(id) ?? 'Açılamadı' : undefined,
        sonOkuma: sonOkuma(okunan, id),
      });
    }
    // ?devzim= (geliştirici) ya da listede olmayan kaynaklar
    for (const src of sources ?? []) {
      if (seen.has(src.id)) continue;
      const meta = ustVeri(src.id, src.size);
      const g = gorunum(src.id, null, meta ?? { title: src.title, lang: src.language });
      out.push({ id: src.id, ...g, aciklama: src.description, boyut: src.size, bilgiNoktasi: false, meta, src, sonOkuma: sonOkuma(okunan, src.id) });
    }
    // Aynı adı taşıyan koleksiyonlar (ör. iki Türkçe Vikipedi) dosya adındaki tür/tarihle ayırt edilir
    const adlar = out.map((c) => ({ id: c.id, label: c.ad }));
    disambiguateLabels(adlar);
    adlar.forEach((a, i) => (out[i].ad = a.label));
    return out;
  }, [rows, sources, okunan]);

  const dev = devZimUrls().length > 0;
  return { ...packs, koleksiyonlar: list, okunan, setOkunan, hazir: dev ? sources !== undefined : loaded };
}
