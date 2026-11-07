// Kütüphane: küçük kalıcı durum ve saf yardımcılar (birim testleri: tests/kutuphane-veri.test.ts).
//  • Son okunanlar ("Kaldığın yerden devam et") ve okunan oran
//  • Arşiv üstverisi önbelleği: Kitaplığım ilk çizimde arşivleri açmadan ad, madde sayısı, dil gösterir
//  • Koleksiyonların insan dilindeki adı, rengi/simgesi (kategori), dil rozeti
//  • Mağaza: ihtiyaca göre bölümler ve "telefona sığar mı" ipucu
import { formatSize } from '../../lib/packs';
import type { ManifestPack, Shelf } from '../../lib/manifest';

// ---------------------------------------------------------------------------
// localStorage (erişilemezse sessizce boş)
// ---------------------------------------------------------------------------

export function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
export function lsSet(k: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* depolama yok ya da dolu */
  }
}
function lsJson<T>(k: string, def: T): T {
  try {
    const v = JSON.parse(lsGet(k) ?? 'null');
    return v ?? def;
  } catch {
    return def;
  }
}

// ---------------------------------------------------------------------------
// Son aramalar
// ---------------------------------------------------------------------------

export const LS_HISTORY = 'ac.lib.history';

export function loadHistory(): string[] {
  const v = lsJson<unknown>(LS_HISTORY, []);
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 12) : [];
}

export function pushHistory(q: string): string[] {
  q = q.trim();
  if (!q) return loadHistory();
  const low = q.toLocaleLowerCase('tr');
  const h = [q, ...loadHistory().filter((x) => x.toLocaleLowerCase('tr') !== low)].slice(0, 12);
  lsSet(LS_HISTORY, JSON.stringify(h));
  return h;
}

// ---------------------------------------------------------------------------
// Son okunanlar
// ---------------------------------------------------------------------------

export const LS_RECENT = 'ac.lib.okunan';
const RECENT_MAX = 30;

export interface Okunan {
  /** Kütüphane referansı (@kaynak/yol) */
  ref: string;
  title: string;
  /** Kaynak (paket) kimliği */
  src: string;
  /** Son açılış zamanı (ms) */
  at: number;
  /** Okunan oran 0..1 (makalede kaydırma) */
  y?: number;
  /** PDF: son okunan sayfa ve toplam */
  page?: number;
  pages?: number;
}

function gecerliOkunan(o: any): o is Okunan {
  return !!o && typeof o.ref === 'string' && typeof o.title === 'string' && typeof o.src === 'string' && typeof o.at === 'number';
}

export function okunanlar(): Okunan[] {
  const v = lsJson<unknown>(LS_RECENT, []);
  return Array.isArray(v) ? v.filter(gecerliOkunan).slice(0, RECENT_MAX) : [];
}

function yaz(list: Okunan[]) {
  lsSet(LS_RECENT, JSON.stringify(list.slice(0, RECENT_MAX)));
}

/** Açılan makaleyi listenin başına koyar (oran/sayfa korunur). */
export function okunanEkle(o: Omit<Okunan, 'at'> & { at?: number }): Okunan[] {
  const list = okunanlar();
  const old = list.find((x) => x.ref === o.ref);
  const yeni: Okunan = { ...old, ...o, at: o.at ?? Date.now() };
  if (yeni.y === undefined && old?.y !== undefined) yeni.y = old.y;
  const out = [yeni, ...list.filter((x) => x.ref !== o.ref)];
  yaz(out);
  return out;
}

/** Okuma konumunu günceller (sıra değişmez). */
export function okunanKonum(ref: string, patch: Pick<Okunan, 'y'> | Pick<Okunan, 'page' | 'pages'>) {
  const list = okunanlar();
  const i = list.findIndex((x) => x.ref === ref);
  if (i < 0) return;
  list[i] = { ...list[i], ...patch };
  yaz(list);
}

/** Silinen koleksiyonun okunanlarını kaldırır. */
export function okunanlariSil(src: string) {
  yaz(okunanlar().filter((x) => x.src !== src));
}

/** Koleksiyonun son okunma zamanı (yoksa 0). */
export function sonOkuma(list: Okunan[], src: string): number {
  let t = 0;
  for (const o of list) if (o.src === src && o.at > t) t = o.at;
  return t;
}

/** Okunan oran (yüzde) — gösterim için; bilinmiyorsa null. */
export function okunanYuzde(o: Okunan): number | null {
  if (o.pages && o.page) return Math.max(1, Math.min(100, Math.round((o.page / o.pages) * 100)));
  if (typeof o.y === 'number') return Math.max(0, Math.min(100, Math.round(o.y * 100)));
  return null;
}

/** "az önce", "5 dk önce", "3 saat önce", "dün", "4 gün önce", "12.10.2026" */
export function zamanOnce(t: number, now = Date.now()): string {
  const s = Math.max(0, (now - t) / 1000);
  if (s < 60) return 'az önce';
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`;
  if (s < 86400) return `${Math.floor(s / 3600)} saat önce`;
  const gun = Math.floor(s / 86400);
  if (gun === 1) return 'dün';
  if (gun < 7) return `${gun} gün önce`;
  const d = new Date(t);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

// ---------------------------------------------------------------------------
// Arşiv üstverisi önbelleği
// ---------------------------------------------------------------------------

export const LS_META = 'ac.lib.meta';

export interface UstVeri {
  /** Dosya boyutu: değişirse (yeni sürüm) önbellek geçersiz */
  size: number;
  title: string;
  desc: string;
  lang: string;
  count: number;
  ft: boolean;
  kind: string;
  /** Ana sayfa yolu (varsa) */
  main?: string;
}

export function ustVeriler(): Record<string, UstVeri> {
  const v = lsJson<Record<string, UstVeri>>(LS_META, {});
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
}

export function ustVeri(id: string, size?: number): UstVeri | null {
  const u = ustVeriler()[id];
  if (!u || typeof u !== 'object') return null;
  if (size && u.size && u.size !== size) return null;
  return u;
}

export function ustVeriYaz(list: { id: string; size: number; title: string; description: string; language: string; articleCount: number; hasFulltext: boolean; kind: string }[]) {
  const all = ustVeriler();
  let changed = false;
  for (const s of list) {
    const old = all[s.id];
    const nu: UstVeri = { size: s.size, title: s.title, desc: s.description.slice(0, 300), lang: s.language, count: s.articleCount, ft: s.hasFulltext, kind: s.kind, main: old?.size === s.size ? old.main : undefined };
    if (JSON.stringify(old) !== JSON.stringify(nu)) {
      all[s.id] = nu;
      changed = true;
    }
  }
  if (changed) lsSet(LS_META, JSON.stringify(all));
}

export function anaSayfaYaz(id: string, main: string) {
  const all = ustVeriler();
  if (!all[id] || all[id].main === main) return;
  all[id] = { ...all[id], main };
  lsSet(LS_META, JSON.stringify(all));
}

// ---------------------------------------------------------------------------
// Koleksiyon görünümü: ad, dil, kategori (renk + simge)
// ---------------------------------------------------------------------------

export type Kategori = Shelf | 'diger';

const DILLER: Record<string, string> = {
  tr: 'Türkçe', tur: 'Türkçe', en: 'İngilizce', eng: 'İngilizce', de: 'Almanca', deu: 'Almanca', fr: 'Fransızca', fra: 'Fransızca',
  ar: 'Arapça', ara: 'Arapça', ku: 'Kürtçe', kur: 'Kürtçe', es: 'İspanyolca', spa: 'İspanyolca', ru: 'Rusça', rus: 'Rusça',
  fa: 'Farsça', fas: 'Farsça', mul: 'Çok dilli',
};

/** "eng" / "en" / "tur,eng" → ilk dilin Türkçe adı ("" bilinmiyorsa) */
export function dilAdi(code: string | undefined): string {
  const c = (code ?? '').split(/[,;]/)[0].trim().toLowerCase();
  return DILLER[c] ?? '';
}

/** Dosya adındaki dil kodu: "nhs.uk_en_medicines_2026-09b.zim" → "en" */
export function dosyaDili(file: string): string {
  const m = /_(tr|en|de|fr|ar|ku|es|ru|fa|mul)_/i.exec(file);
  return m ? m[1].toLowerCase() : '';
}

export function turkceMi(lang: string | undefined): boolean {
  return /^(tur|tr)\b/i.test((lang ?? '').trim());
}

const DIL_ADLARI = ['türkçe', 'ingilizce', 'almanca', 'fransızca', 'arapça', 'kürtçe', 'ispanyolca', 'rusça', 'farsça', 'çok dilli'];
// "İngilizce": /i bayrağı İ/i eşleştirmez; Türkçe küçük harfe çevirip karşılaştırılır
const kucuk = (x: string) => x.trim().toLocaleLowerCase('tr');
const dilKelimesi = (x: string) => DIL_ADLARI.includes(kucuk(x));
const atilacak = (x: string) => dilKelimesi(x) || kucuk(x) === 'resimli' || kucuk(x) === 'resimsiz';

/** Katalog adından dil ve "resimli/resimsiz" ayrıntısını atar (dil ayrı rozet olarak gösterilir).
 *  "Vikipedi: Kimya (Türkçe, resimli)" → "Vikipedi: Kimya"; "WikiMed … (İngilizce, özet)" → "WikiMed … (özet)" */
export function temizAd(name: string): string {
  return name
    .replace(/\s*\(([^()]*)\)\s*$/, (_m, inner: string) => {
      const kalan = inner
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x && !atilacak(x));
      return kalan.length ? ` (${kalan.join(', ')})` : '';
    })
    .trim();
}

/** Katalog adının parantezindeki dil ("… (İngilizce, resimsiz)" → "İngilizce") */
export function adDili(name: string): string {
  const m = /\(([^()]*)\)\s*$/.exec(name);
  if (!m) return '';
  for (const p of m[1].split(',')) {
    const t = p.trim();
    if (dilKelimesi(t)) return t[0].toLocaleUpperCase('tr') + t.slice(1);
  }
  return '';
}

/** Dosya adından okunur bir ad (katalogda ve üstveride ad yoksa) */
export function dosyadanAd(file: string): string {
  const base = file.replace(/\.zim$/i, '').replace(/_\d{4}-\d{2}[a-z]?$/i, '');
  const lang = dosyaDili(file);
  if (/^wikipedia_/i.test(base)) return lang === 'tr' || !lang ? 'Vikipedi' : 'Wikipedia';
  if (/^wikibooks_/i.test(base)) return lang === 'tr' ? 'Vikikitap' : 'Wikibooks';
  if (/^wikisource_/i.test(base)) return lang === 'tr' ? 'Vikikaynak' : 'Wikisource';
  if (/^wiktionary_/i.test(base)) return lang === 'tr' ? 'Vikisözlük' : 'Wiktionary';
  if (/^wikiquote_/i.test(base)) return lang === 'tr' ? 'Vikisöz' : 'Wikiquote';
  if (/^wikivoyage_/i.test(base)) return 'Wikivoyage';
  if (/^vikidia_/i.test(base)) return 'Vikidia';
  const s = base
    .replace(/_(tr|en|de|fr|ar|ku|es|ru|fa|mul)(?=_|$)/gi, ' ')
    .replace(/_(all|maxi|mini|nopic)\b/gi, '')
    .replace(/[_-]+/g, ' ')
    .trim();
  return s ? s[0].toLocaleUpperCase('tr') + s.slice(1) : file;
}

/** Kategori (kart rengi ve simgesi): katalog rafı, yoksa dosya adından tahmin */
export function kategoriOf(file: string, shelf?: Shelf): Kategori {
  if (shelf) return shelf;
  const f = file.toLowerCase();
  if (/medic|mdwiki|nhs|wikem|medline|cdc|tip|wikivet/.test(f)) return 'saglik';
  if (/wiktionary|wikiquote|sozluk/.test(f)) return 'dil';
  if (/wikibooks|wikisource|gutenberg|libretexts/.test(f)) return 'kitap';
  if (/zimgit|ready\.gov|outdoors|water|food/.test(f)) return 'hayatta';
  if (/ifixit|appropedia|lowtech|stackexchange|cooking/.test(f)) return 'pratik';
  if (/wikipedia|vikidia|wikivoyage/.test(f)) return 'ansiklopedi';
  return 'diger';
}

export interface KoleksiyonGorunum {
  /** İnsan dilinde ad */
  ad: string;
  /** Türkçe değilse dil adı ("İngilizce"); Türkçede boş */
  dil: string;
  kategori: Kategori;
}

/** Katalog kaydı, önbellekteki üstveri ve dosya adından koleksiyonun görünen adı/dili/kategorisi */
export function gorunum(file: string, entry?: Pick<ManifestPack, 'name' | 'shelf'> | null, meta?: Pick<UstVeri, 'title' | 'lang'> | null): KoleksiyonGorunum {
  const ad = entry ? temizAd(entry.name) : meta?.title?.trim() || dosyadanAd(file);
  let dil = entry ? adDili(entry.name) : '';
  if (!dil) dil = dilAdi(meta?.lang) || dilAdi(dosyaDili(file));
  if (dil === 'Türkçe') dil = '';
  return { ad, dil, kategori: kategoriOf(file, entry?.shelf) };
}

// ---------------------------------------------------------------------------
// Mağaza: ihtiyaca göre bölümler ve sığma ipucu
// ---------------------------------------------------------------------------

export type Ihtiyac = 'saglik' | 'genel' | 'su-yemek' | 'afet' | 'onarim' | 'kitap' | 'dil';

export const IHTIYACLAR: { id: Ihtiyac; ad: string; alt: string; kategori: Kategori }[] = [
  { id: 'saglik', ad: 'Sağlık ve ilk yardım', alt: 'İlaçlar, hastalıklar, yaralanmalar', kategori: 'saglik' },
  { id: 'genel', ad: 'Genel bilgi', alt: 'Ansiklopediler: her konuda kısa ve güvenilir bilgi', kategori: 'ansiklopedi' },
  { id: 'su-yemek', ad: 'Su ve yemek', alt: 'Su arıtma, gıda saklama, basit tarifler', kategori: 'hayatta' },
  { id: 'afet', ad: 'Afet ve hayatta kalma', alt: 'Afet sonrası, barınak, doğada kalma', kategori: 'hayatta' },
  { id: 'onarim', ad: 'Kendin yap ve onarım', alt: 'Tamir kılavuzları, enerji, tarım', kategori: 'pratik' },
  { id: 'kitap', ad: 'Kitaplar', alt: 'Telifsiz kitaplar, ders kitapları, belgeler', kategori: 'kitap' },
  { id: 'dil', ad: 'Sözlük ve dil', alt: 'Sözlükler, atasözleri ve deyimler', kategori: 'dil' },
];

const SU_YEMEK = /water|food|cooking|gida|yemek/i;

export function ihtiyacOf(e: Pick<ManifestPack, 'id' | 'file' | 'shelf'>): Ihtiyac {
  if (SU_YEMEK.test(e.id) || SU_YEMEK.test(e.file)) return 'su-yemek';
  switch (e.shelf) {
    case 'saglik':
      return 'saglik';
    case 'hayatta':
      return 'afet';
    case 'pratik':
      return 'onarim';
    case 'kitap':
      return 'kitap';
    case 'dil':
      return 'dil';
    default:
      return 'genel';
  }
}

export type SigmaDuzey = 'kucuk' | 'orta' | 'buyuk' | 'yer-yok';

/** Telefona sığar mı? free: boş yer (bilinmiyorsa null) */
export function sigmaIpucu(size: number, free: number | null): { duzey: SigmaDuzey; metin: string } {
  if (free != null && free > 0 && size > free) return { duzey: 'yer-yok', metin: `Yer yetmez (${formatSize(free)} boş)` };
  if (size >= 4e9) return { duzey: 'buyuk', metin: 'Çok büyük: bilgisayar ya da bilgi noktası için' };
  if (free != null && free > 0 && size > free * 0.5) return { duzey: 'buyuk', metin: 'Boş yerinizin yarısından çoğu' };
  if (size >= 1e9) return { duzey: 'orta', metin: 'Büyük ama telefona sığar' };
  return { duzey: 'kucuk', metin: 'Telefona rahat sığar' };
}

export const fmt = (b: number) => formatSize(Math.max(0, b));

/** İndirme hızı ve kalan süre: "~3 dk kaldı" */
export function kalanSure(received: number, total: number, speed: number): string {
  if (!speed || speed < 1024 || !total || total <= received) return '';
  const sec = (total - received) / speed;
  return sec < 60 ? 'bir dakikadan az kaldı' : sec < 3600 ? `~${Math.ceil(sec / 60)} dk kaldı` : `~${(sec / 3600).toFixed(1).replace('.', ',')} saat kaldı`;
}
