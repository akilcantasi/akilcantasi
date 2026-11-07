// Koleksiyon dizini: giriş sayfası JavaScript ile çizilen ZIM'ler (Project Gutenberg, bazı
// zimit / tek sayfalık uygulama paketleri) için uygulamanın kendi, alfabetik sayfa listesi.
//
// Uygulama ZIM içindeki betikleri güvenlik için çalıştırmaz (sanitize.ts). Gutenberg'in giriş
// sayfası (gutenberg2zim: index.html) kitap listesini jQuery + DataTables ile bir JS dosyasından
// çizer ve yüklenirken dönen bir "loading" GIF'i gösterir: betik çalışmayınca sayfa boş kalır,
// yalnız GIF görünür. Oysa her kitap sıradan bir HTML girdisidir:
//   "<Başlık>.<no>.html"        kitabın kendisi (okunacak sayfa)
//   "<Başlık>_cover.<no>.html"  kapak (biçimler, indirme bağlantıları) — listede gösterilmez
// Liste ZIM'in başlık dizininden (zaten alfabetik) parça parça okunur; yazarlar varsa
// gutenberg2zim'in JS veri dosyasından (var json_data = [[başlık, yazar, no, …], …]) eklenir.
import { pyLiteralToJson } from './nautilus';

export interface DizinGirdisi {
  path: string;
  title: string;
  author?: string;
}

/** Dizinin kaynak türü: gutenberg özel kurallarla, öteki her şey genel kurallarla süzülür */
export type DizinTuru = 'gutenberg' | 'genel';

/** Yolun son parçası ("a/b/c.html" → "c.html"), % kodlaması çözülmüş */
function adi(path: string): string {
  const base = path.split(/[?#]/)[0].split('/').pop() || path;
  try {
    return decodeURIComponent(base);
  } catch {
    return base;
  }
}

const GUT_KAPAK = /_cover\.\d+\.html?$/i;
const GUT_KITAP = /^(.+)\.(\d+)\.html?$/i;

/** Gutenberg kitap sayfasının numarası ("Pride and Prejudice.1342.html" → "1342"); kitap değilse null */
export function gutenbergNo(path: string): string | null {
  const b = adi(path);
  if (GUT_KAPAK.test(b)) return null;
  const m = GUT_KITAP.exec(b);
  return m ? m[2] : null;
}

/** Yoldan okunur ad ("Pride and Prejudice.1342.html" → "Pride and Prejudice") */
export function yoldanAd(path: string): string {
  const b = adi(path);
  const g = GUT_KITAP.exec(b);
  if (g) return g[1].replace(/_/g, ' ');
  return b.replace(/\.(x?html?)$/i, '').replace(/_/g, ' ');
}

/** Dizinde gösterilecek girdi mi (kitap / okunacak sayfa)? */
export function dizinGirdisiMi(
  tur: DizinTuru,
  e: { path: string; redirect?: boolean; mime?: string },
  anaYol?: string | null,
): boolean {
  if (e.redirect) return false;
  if (anaYol && e.path === anaYol) return false;
  if (tur === 'gutenberg') return gutenbergNo(e.path) !== null;
  if (e.mime && !e.mime.startsWith('text/html')) return false;
  const b = adi(e.path);
  // Uygulama dosyaları, giriş/yardımcı sayfalar
  if (/^[-_]\//.test(e.path) || /^(index|home|404|search|about)\.html?$/i.test(b)) return false;
  if (/\.(js|css|json|map|xml|txt|svg|png|jpe?g|gif|webp|ico|woff2?|ttf)$/i.test(b)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// "Yükleniyor" görselleri ve betiksiz boş kabuklar
// ---------------------------------------------------------------------------

/** Kimlik/sınıf adı olarak "yükleniyor" göstergeleri (DataTables, jQuery eklentileri, SPA'lar) */
const YUKLENIYOR_AD = new Set(['spinner', 'loader', 'loading', 'throbber', 'preloader', 'ajax-loader', 'loading-spinner', 'loading-indicator', 'spinner-border', 'lds-ring', 'lds-spinner', 'dataTables_processing']);
/** Dosya adı olarak: load.gif, loading.gif, ajax-loader.gif, spinner.svg, loader_small.gif… */
const YUKLENIYOR_DOSYA = /^(ajax-)?(load|loading|loader|spinner|throbber|preloader|busy|wait)([-_.]?[a-z0-9]{0,12})?\.(gif|svg|apng|webp)$/i;
const YUKLENIYOR_ALT = /^\s*(loading|loader|spinner|please wait|yükleniyor|chargement|cargando|wird geladen)\s*[.…]*\s*$/i;

function adlar(el: Element): string[] {
  return [el.id, ...(el.getAttribute('class') || '').split(/\s+/)].filter(Boolean);
}

/** Öğe bir "yükleniyor" göstergesi mi (dönen GIF ya da onu taşıyan kutu)? */
export function yukleniyorMu(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  // Ad eşleşmesi harf duyarlı (madde başlıklarının kimlikleri "Loading" gibi büyük harfle başlar)
  // ve yalnız metni çok kısa, başlık olmayan kutularda: gerçek içerik silinmesin
  if (!/^h[1-6]$/.test(tag) && adlar(el).some((a) => YUKLENIYOR_AD.has(a)) && (el.textContent || '').trim().length < 60) return true;
  if (tag !== 'img') return false;
  // Madde görselleri (figure, küçük resim kutusu) dokunulmaz
  if (el.closest('figure, .thumb, .infobox, table')) return false;
  const src = el.getAttribute('src') || el.getAttribute('data-src') || '';
  if (src && YUKLENIYOR_DOSYA.test(adi(src))) return true;
  return YUKLENIYOR_ALT.test(el.getAttribute('alt') || '');
}

/**
 * Sayfa betik çalışmadan içeriği olmayan bir JS kabuğu mu? (Gutenberg giriş sayfası, kitap
 * listesini betikle dolduran SPA'lar.) Ölçüt: betik var, gerçek bağlantı az ve görünür metin
 * çok kısa — ya da bir "yükleniyor" göstergesi var ve metin kısa. Yalnız giriş sayfalarına
 * uygulanır: mini Vikipedi'nin tek cümlelik maddeleri de betik taşır ama okunacak içeriktir.
 */
export function sayfaKabukMu(html: string): boolean {
  if (!/<script/i.test(html)) return false;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;
  if (!body) return false;
  const betik = doc.querySelectorAll('script').length;
  if (!betik) return false;
  const gosterge = Array.from(body.querySelectorAll('*')).some(yukleniyorMu);
  body.querySelectorAll('script, style, noscript, template, select, option, button, form').forEach((e) => e.remove());
  const metin = (body.textContent || '').replace(/\s+/g, ' ').trim().length;
  const bag = Array.from(body.querySelectorAll('a[href]')).filter((a) => !a.getAttribute('href')!.startsWith('#')).length;
  if (bag >= 15) return false;
  return metin < 200 || (gosterge && metin < 1500);
}

// ---------------------------------------------------------------------------
// Gutenberg yazarları (JS veri dosyası)
// ---------------------------------------------------------------------------

/** gutenberg2zim'in sürümlerine göre kitap listesi dosyaları */
const GUT_VERI = ['full_by_popularity.js', 'full_by_title.js', 'full_by_popularity_javascript.js', 'full_by_title_javascript.js', 'js/full_by_popularity.js'];

/** "var json_data = [[başlık, yazar, no, …], …];" → no → yazar */
export function gutenbergVerisiniOku(text: string): Map<string, string> {
  const out = new Map<string, string>();
  const a = text.indexOf('[');
  const b = text.lastIndexOf(']');
  if (a < 0 || b <= a) return out;
  const src = text.slice(a, b + 1);
  let arr: unknown;
  try {
    arr = JSON.parse(src);
  } catch {
    try {
      arr = JSON.parse(pyLiteralToJson(src));
    } catch {
      return out;
    }
  }
  if (!Array.isArray(arr)) return out;
  for (const r of arr) {
    if (Array.isArray(r)) {
      // [başlık, yazar, no, …]: no ilk tam sayı (ya da rakamlardan oluşan dize)
      const no = r.find((x, i) => i >= 1 && (typeof x === 'number' || (typeof x === 'string' && /^\d+$/.test(x))));
      const yazar = typeof r[1] === 'string' ? r[1].trim() : '';
      if (no !== undefined && yazar && !/^anonymous$|^various$|^unknown$/i.test(yazar)) out.set(String(no), yazar);
    } else if (r && typeof r === 'object') {
      const o = r as Record<string, unknown>;
      const no = o.id ?? o.book_id ?? o.no;
      const yazar = typeof o.author === 'string' ? o.author : typeof o.aut === 'string' ? o.aut : '';
      if (no !== undefined && yazar.trim()) out.set(String(no), yazar.trim());
    }
  }
  return out;
}

type DizinZim = {
  articleCount: number;
  titleEntry(j: number): Promise<{ path: string; title: string; redirect: boolean; mime: string } | null>;
  titleLowerBound(prefix: string): Promise<number>;
  getResource(p: string): Promise<{ mime: string; data: Uint8Array } | null>;
};

/** Gutenberg kitap numarası → yazar (veri dosyası yoksa boş) */
export async function gutenbergYazarlari(zim: Pick<DizinZim, 'getResource'>): Promise<Map<string, string>> {
  for (const f of GUT_VERI) {
    const r = await zim.getResource(f).catch(() => null);
    if (!r) continue;
    // Dev kitaplıklarda dosya birkaç MB olabilir; 40 MB üstü okunmaz
    if (r.data.length > 40 * 1024 * 1024) break;
    const m = gutenbergVerisiniOku(new TextDecoder().decode(r.data));
    if (m.size) return m;
  }
  return new Map();
}

// ---------------------------------------------------------------------------
// Parça parça okuyucu
// ---------------------------------------------------------------------------

/**
 * Başlık dizinini sırayla okur ve dizin girdilerini süzer. Büyük koleksiyonlarda (Gutenberg:
 * on binlerce kitap) hepsi birden okunmaz: liste kaydırıldıkça `sonraki()` bir parça daha getirir.
 */
export class DizinOkuyucu {
  /** Sıradaki başlık dizini konumu */
  konum = 0;
  private yazar: Map<string, string> | null = null;

  constructor(
    private zim: DizinZim,
    readonly tur: DizinTuru,
    private anaYol: string | null,
  ) {}

  get bitti() {
    return this.konum >= this.zim.articleCount;
  }

  get toplam() {
    return this.zim.articleCount;
  }

  private async yazarlar() {
    if (this.yazar) return this.yazar;
    this.yazar = this.tur === 'gutenberg' ? await gutenbergYazarlari(this.zim) : new Map();
    return this.yazar;
  }

  /** Girdiye yazar ve okunur ad ekler */
  async tamamla(e: { path: string; title: string }): Promise<DizinGirdisi> {
    const y = await this.yazarlar();
    const no = this.tur === 'gutenberg' ? gutenbergNo(e.path) : null;
    const title = e.title && e.title !== e.path ? e.title : yoldanAd(e.path);
    const author = no ? y.get(no) : undefined;
    return author ? { path: e.path, title, author } : { path: e.path, title };
  }

  /** En çok `n` girdi; en çok `tarama` başlık okunur (kapaklar, görseller atlanırken takılmasın) */
  async sonraki(n = 60, tarama = 800): Promise<DizinGirdisi[]> {
    const out: DizinGirdisi[] = [];
    const son = Math.min(this.zim.articleCount, this.konum + tarama);
    while (this.konum < son && out.length < n) {
      // Dizin girdileri paralel okunur (bilgi noktasında her okuma bir ağ isteği olabilir)
      const parca = Math.min(son - this.konum, 32);
      const bas = this.konum;
      this.konum += parca;
      const es = await Promise.all(Array.from({ length: parca }, (_, k) => this.zim.titleEntry(bas + k).catch(() => null)));
      for (const e of es) if (e && dizinGirdisiMi(this.tur, e, this.anaYol)) out.push(await this.tamamla(e));
    }
    return out;
  }

  /** Harfe atla: başlığı `onek` ile (ya da sonrasıyla) başlayan ilk girdiden devam eder */
  async atla(onek: string) {
    this.konum = onek ? await this.zim.titleLowerBound(onek) : 0;
  }
}
