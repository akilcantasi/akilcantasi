// Saf TypeScript ZIM okuyucu (openZIM biçimi v5/v6). Tarayıcıda ve node'da
// RandomAccessSource üzerinden çalışır; dosyanın tamamını belleğe almaz.
//
// Biçim özeti (https://wiki.openzim.org/wiki/ZIM_file_format):
//   başlık (80 bayt) → MIME listesi → URL işaretçi listesi (u64) →
//   başlık işaretçi listesi (u32, (ns,başlık) sıralı) → dizin girdileri →
//   küme işaretçi listesi (u64) → kümeler → MD5 sağlama.
//   Küme: 1 bayt bilgi (alt 4 bit sıkıştırma, 0x10 = 64 bit ofsetli "extended")
//   + (sıkıştırılmış olabilir) [ofset tablosu][bloblar].
//   Yeni ad alanı düzeninde (minor ≥ 1) tüm içerik 'C' ad alanındadır ve
//   ön makaleler listesi X/listing/titleOrdered/v1 içinde tutulur.
import { HttpRangeSource, QueryRangeSource, type RandomAccessSource } from '../source';
import { LRU, PagedReader, u16, u32, u64 } from './cache';
import { decompress, MAX_CLUSTER_BYTES } from './decompress';
import { caseVariants, foldTr } from './text';
import { GlassDb } from './xapian';

export { htmlToText, extractParagraphs, normalizeForSearch, decodeEntities, foldTr, foldCharwise } from './text';
export { GlassDb } from './xapian';

export interface ZimHit {
  path: string;
  title: string;
}

export interface ZimArticle {
  path: string;
  title: string;
  mime: string;
  html: string;
}

export interface ZimHeader {
  majorVersion: number;
  minorVersion: number;
  entryCount: number;
  clusterCount: number;
  urlPtrPos: number;
  titlePtrPos: number;
  clusterPtrPos: number;
  mimeListPos: number;
  mainPage: number;
  layoutPage: number;
  checksumPos: number;
}

export interface ZimDirent {
  index: number;
  mime: number; // 0xffff = yönlendirme
  ns: string;
  url: string;
  /** Boşsa url ile aynıdır */
  title: string;
  redirect?: number;
  cluster?: number;
  blob?: number;
}

const MAGIC = 72173914;
const REDIRECT = 0xffff;
const LINKTARGET = 0xfffe;
const DELETED = 0xfffd;
const NONE = 0xffffffff;
/**
 * Tek bir blob için üst sınır (bayt). Arşivdeki ofset tablosu bozuk ya da kötü niyetliyse
 * gigabaytlarca bellek ayrılıp sekme çökmesin; gerçek ZIM'lerde en büyük bloblar (video,
 * PDF) bunun çok altındadır. Xapian dizinleri blob olarak okunmaz (blobLocation).
 */
export const MAX_BLOB_BYTES = 256 * 1024 * 1024;

/** Taşmasız orta nokta: (a + b) >>> 1 2^32'yi aşan sınırlarda yanlış sonuç verip döngüyü sonsuz yapabilirdi */
const mid = (a: number, b: number) => Math.floor((a + b) / 2);

const utf8 = new TextDecoder('utf-8');

/** Kod noktası sırasıyla karşılaştırma (= libzim'in UTF-8 bayt sırası). */
function cmp(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    let x = a.charCodeAt(i);
    let y = b.charCodeAt(i);
    if (x === y) continue;
    // UTF-16 vekil çiftlerini kod noktası sırasına uydur
    if (x >= 0xd800) x = x <= 0xdfff ? x + 0x2000 : x - 0x800;
    if (y >= 0xd800) y = y <= 0xdfff ? y + 0x2000 : y - 0x800;
    return x - y;
  }
  return a.length - b.length;
}

interface TitleList {
  /** Arama yapılacak aralık [lo, hi) */
  lo: number;
  hi: number;
  /** j. sıradaki girdinin dizin numarası */
  at(j: number): Promise<number>;
}

export class ZimArchive {
  readonly header: ZimHeader;
  readonly mimeTypes: string[];
  readonly isNewNamespace: boolean;
  private reader: PagedReader;
  private dirents = new LRU<number, Promise<ZimDirent>>(4096);
  private clusters = new LRU<number, Promise<Uint8Array>>(8);
  private titleList: TitleList | null = null;
  private metaCache = new Map<string, Promise<string | null>>();

  private constructor(reader: PagedReader, header: ZimHeader, mimes: string[]) {
    this.reader = reader;
    this.header = header;
    this.mimeTypes = mimes;
    this.isNewNamespace = header.majorVersion >= 6 && header.minorVersion >= 1;
  }

  static async open(src: RandomAccessSource): Promise<ZimArchive> {
    // Ağ üzerinden (HTTP Range) her istek pahalıdır: daha büyük sayfalar, daha az istek.
    // Android paket klasörü (/_paket/?aralik=) de öyle: her okuma WebView ile Java arasında ayrı
    // bir istektir (gerçek dosyalarla Vikipedi araması ~%20 daha az istekle biter).
    const remote = src instanceof HttpRangeSource || src instanceof QueryRangeSource;
    const reader = remote ? new PagedReader(src, 32 * 1024, 192) : new PagedReader(src);
    const h = await reader.read(0, 80);
    if (h.length < 80 || u32(h, 0) !== MAGIC) throw new Error('Geçerli bir ZIM dosyası değil');
    const header: ZimHeader = {
      majorVersion: u16(h, 4),
      minorVersion: u16(h, 6),
      entryCount: u32(h, 24),
      clusterCount: u32(h, 28),
      urlPtrPos: u64(h, 32),
      titlePtrPos: u64(h, 40),
      clusterPtrPos: u64(h, 48),
      mimeListPos: u64(h, 56),
      mainPage: u32(h, 64),
      layoutPage: u32(h, 68),
      checksumPos: u64(h, 72),
    };
    if (header.majorVersion !== 5 && header.majorVersion !== 6) {
      throw new Error(`Desteklenmeyen ZIM sürümü: ${header.majorVersion}.${header.minorVersion}`);
    }
    // İşaretçi listeleri dosyanın içinde olmalı: bozuk başlık sonradan dev döngülere,
    // dosya dışı okumalara yol açmasın
    const size = reader.size;
    if (
      header.urlPtrPos + header.entryCount * 8 > size ||
      header.clusterPtrPos + header.clusterCount * 8 > size ||
      header.mimeListPos >= size
    ) {
      throw new Error('Bozuk ZIM dosyası (başlık dosya boyutuyla uyuşmuyor)');
    }
    // MIME listesi: boş dizeyle biten, null ile ayrılmış dizeler
    const mimes: string[] = [];
    let pos = header.mimeListPos;
    let buf = new Uint8Array(0);
    let start = 0;
    outer: for (let guard = 0; guard < 64; guard++) {
      const more = await reader.read(pos + buf.length, 4096);
      if (!more.length) break;
      const nb = new Uint8Array(buf.length + more.length);
      nb.set(buf);
      nb.set(more, buf.length);
      buf = nb;
      for (let i = start; i < buf.length; i++) {
        if (buf[i] === 0) {
          if (i === start) break outer;
          mimes.push(utf8.decode(buf.subarray(start, i)));
          start = i + 1;
        }
      }
    }
    const a = new ZimArchive(reader, header, mimes);
    await a.initTitleList();
    return a;
  }

  /** Toplam girdi sayısı (üstveri, görseller ve yönlendirmeler dâhil). */
  get entryCount() {
    return this.header.entryCount;
  }

  /** Aramada kullanılan makale (başlık) sayısı. */
  get articleCount() {
    return this.titleList ? this.titleList.hi - this.titleList.lo : 0;
  }

  get name() {
    return this.reader.src.name;
  }

  /** Dosya boyutu (bayt). */
  get size() {
    return this.reader.size;
  }

  // ---------------------------------------------------------------- dizin

  async direntAt(index: number): Promise<ZimDirent> {
    // NaN (dosya dışından okunan bozuk işaretçi) da reddedilir
    if (!(index >= 0 && index < this.header.entryCount)) throw new Error('Geçersiz girdi: ' + index);
    let p = this.dirents.get(index);
    if (!p) {
      p = this.readDirent(index);
      p.catch(() => this.dirents.delete(index));
      this.dirents.set(index, p);
    }
    return p;
  }

  private async readDirent(index: number): Promise<ZimDirent> {
    const ptr = u64(await this.reader.read(this.header.urlPtrPos + index * 8, 8), 0);
    let len = 512;
    for (;;) {
      const b = await this.reader.read(ptr, len);
      const mime = u16(b, 0);
      const ns = String.fromCharCode(b[3]);
      const isRedirect = mime === REDIRECT;
      const fixed = isRedirect ? 12 : mime === LINKTARGET || mime === DELETED ? 8 : 16;
      const z1 = b.indexOf(0, fixed);
      const z2 = z1 >= 0 ? b.indexOf(0, z1 + 1) : -1;
      if (z2 < 0) {
        if (b.length < len || len >= 1 << 16) throw new Error('Bozuk dizin girdisi: ' + index);
        len *= 4;
        continue;
      }
      const url = utf8.decode(b.subarray(fixed, z1));
      const title = utf8.decode(b.subarray(z1 + 1, z2)) || url;
      const d: ZimDirent = { index, mime, ns, url, title };
      if (isRedirect) d.redirect = u32(b, 8);
      else if (fixed === 16) {
        d.cluster = u32(b, 8);
        d.blob = u32(b, 12);
      }
      return d;
    }
  }

  /** (ns, url) ile girdi bulur — URL işaretçi listesinde ikili arama. */
  async findByPath(ns: string, url: string): Promise<ZimDirent | null> {
    let lo = 0;
    let hi = this.header.entryCount;
    while (lo < hi) {
      const m = mid(lo, hi);
      const d = await this.direntAt(m);
      const c = d.ns === ns ? cmp(d.url, url) : cmp(d.ns, ns);
      if (c === 0) return d;
      if (c < 0) lo = m + 1;
      else hi = m;
    }
    return null;
  }

  /** Yönlendirmeleri izler (en fazla 16 adım). */
  async resolve(d: ZimDirent): Promise<ZimDirent | null> {
    for (let i = 0; i < 16 && d.mime === REDIRECT; i++) d = await this.direntAt(d.redirect!);
    return d.mime === REDIRECT || d.cluster === undefined ? null : d;
  }

  // ---------------------------------------------------------------- kümeler

  private async clusterBounds(c: number): Promise<[number, number]> {
    const h = this.header;
    if (c < 0 || c >= h.clusterCount) throw new Error('Geçersiz küme: ' + c);
    const b = await this.reader.read(h.clusterPtrPos + c * 8, c + 1 < h.clusterCount ? 16 : 8);
    const start = u64(b, 0);
    const end = c + 1 < h.clusterCount ? u64(b, 8) : h.checksumPos || this.reader.size;
    return [start, end];
  }

  private decompressed(c: number, start: number, end: number, comp: number): Promise<Uint8Array> {
    let p = this.clusters.get(c);
    if (!p) {
      const len = end - start - 1;
      p =
        len < 0 || len > MAX_CLUSTER_BYTES
          ? Promise.reject(new Error('Bozuk küme: ' + c))
          : this.reader.readRaw(start + 1, len).then((raw) => decompress(comp, raw));
      p.catch(() => this.clusters.delete(c));
      this.clusters.set(c, p);
    }
    return p;
  }

  async getBlob(cluster: number, blob: number): Promise<Uint8Array> {
    const [start, end] = await this.clusterBounds(cluster);
    const info = (await this.reader.read(start, 1))[0];
    const comp = info & 0x0f;
    const osz = info & 0x10 ? 8 : 4;
    const rd = (b: Uint8Array, o: number) => (osz === 8 ? u64(b, o) : u32(b, o));
    if (comp === 0 || comp === 1) {
      // Sıkıştırmasız: yalnızca gereken baytları oku
      const base = start + 1;
      const first = rd(await this.reader.read(base, osz), 0);
      const n = first / osz - 1;
      if (blob >= n) throw new Error('Geçersiz blob');
      const offs = await this.reader.read(base + blob * osz, osz * 2);
      const a = rd(offs, 0);
      const b = rd(offs, osz);
      if (!(b >= a) || b - a > MAX_BLOB_BYTES) throw new Error('Bozuk blob');
      return this.reader.read(base + a, b - a);
    }
    const data = await this.decompressed(cluster, start, end, comp);
    const n = rd(data, 0) / osz - 1;
    if (blob >= n) throw new Error('Geçersiz blob');
    const a = rd(data, blob * osz);
    const b = rd(data, (blob + 1) * osz);
    return data.subarray(a, b);
  }

  async getData(d: ZimDirent): Promise<Uint8Array | null> {
    const r = await this.resolve(d);
    if (!r) return null;
    return this.getBlob(r.cluster!, r.blob!);
  }

  mimeOf(d: ZimDirent) {
    return this.mimeTypes[d.mime] ?? 'application/octet-stream';
  }

  // ---------------------------------------------------------------- yollar

  private contentNs() {
    return this.isNewNamespace ? 'C' : 'A';
  }

  /** Girdinin dışarıya verilen yolu: yeni düzende url; eskide A için url, diğerleri "ns/url". */
  publicPath(d: ZimDirent) {
    if (this.isNewNamespace || d.ns === 'A') return d.url;
    return d.ns + '/' + d.url;
  }

  private async lookup(path: string): Promise<ZimDirent | null> {
    path = path.replace(/^\/+/, '');
    if (this.isNewNamespace) return this.findByPath('C', path);
    const m = /^([A-Z\-])\/(.+)$/.exec(path);
    if (m) {
      const d = await this.findByPath(m[1], m[2]);
      if (d) return d;
    }
    return this.findByPath('A', path);
  }

  /**
   * Makale içindeki bir bağlantıyı (href/src) arşiv içi yola çevirir.
   * Dış bağlantılar ve sayfa içi çapalar için null döner.
   */
  resolveLink(fromPath: string, href: string): string | null {
    if (!href) return null;
    href = href.trim();
    if (href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return null;
    const base = this.isNewNamespace || /^[A-Z\-]\//.test(fromPath) ? fromPath : 'A/' + fromPath;
    let p: string;
    try {
      const u = new URL(href, 'http://zim.invalid/' + base.split('/').map(encodeURIComponent).join('/'));
      p = decodeURIComponent(u.pathname.slice(1));
    } catch {
      return null;
    }
    if (!this.isNewNamespace && p.startsWith('A/')) p = p.slice(2);
    return p || null;
  }

  // ---------------------------------------------------------------- genel API

  async getMetadata(name: string): Promise<string | null> {
    let p = this.metaCache.get(name);
    if (!p) {
      p = (async () => {
        const d = await this.findByPath('M', name);
        if (!d) return null;
        const data = await this.getData(d);
        return data ? utf8.decode(data) : null;
      })().catch(() => null);
      this.metaCache.set(name, p);
    }
    return p;
  }

  async getMainPage(): Promise<ZimArticle | null> {
    let idx = this.header.mainPage;
    if (idx === NONE || idx >= this.header.entryCount) {
      const w = await this.findByPath('W', 'mainPage');
      if (!w) return null;
      idx = w.index;
    }
    const d = await this.resolve(await this.direntAt(idx));
    return d ? this.articleFrom(d) : null;
  }

  private async articleFrom(d: ZimDirent): Promise<ZimArticle | null> {
    const data = await this.getData(d);
    if (!data) return null;
    return { path: this.publicPath(d), title: d.title, mime: this.mimeOf(d), html: utf8.decode(data) };
  }

  /** Yolu verilen makaleyi döndürür (yönlendirmeler izlenir). */
  async getArticle(path: string): Promise<ZimArticle | null> {
    const d0 = await this.lookup(path);
    if (!d0) return null;
    const d = await this.resolve(d0);
    return d ? this.articleFrom(d) : null;
  }

  async getResource(path: string): Promise<{ mime: string; data: Uint8Array } | null> {
    const d0 = await this.lookup(path);
    if (!d0) return null;
    const d = await this.resolve(d0);
    if (!d) return null;
    const data = await this.getBlob(d.cluster!, d.blob!);
    return { mime: this.mimeOf(d), data };
  }

  /**
   * Sıkıştırmasız bir kümedeki blob'un dosya içindeki mutlak konumu (Xapian
   * dizinleri gibi büyük ve rastgele erişilen veriler için). Sıkıştırılmışsa null.
   */
  async blobLocation(d: ZimDirent): Promise<{ offset: number; size: number } | null> {
    const r = await this.resolve(d);
    if (!r) return null;
    const [start] = await this.clusterBounds(r.cluster!);
    const info = (await this.reader.read(start, 1))[0];
    const comp = info & 0x0f;
    if (comp !== 0 && comp !== 1) return null;
    const osz = info & 0x10 ? 8 : 4;
    const rd = (b: Uint8Array, o: number) => (osz === 8 ? u64(b, o) : u32(b, o));
    const base = start + 1;
    const offs = await this.reader.read(base + r.blob! * osz, osz * 2);
    const a = rd(offs, 0);
    const size = rd(offs, osz) - a;
    if (!(size >= 0) || base + a + size > this.reader.size) return null;
    return { offset: base + a, size };
  }

  private xapianCache = new Map<string, Promise<GlassDb | null>>();

  /** Gömülü Xapian dizinini açar: 'title' (X/title/xapian) ya da 'fulltext'. Yoksa null. */
  xapian(kind: 'title' | 'fulltext'): Promise<GlassDb | null> {
    let p = this.xapianCache.get(kind);
    if (!p) {
      p = (async () => {
        const d = this.isNewNamespace
          ? await this.findByPath('X', kind + '/xapian')
          : await this.findByPath('Z', '/' + kind + 'Index/xapian');
        if (!d) return null;
        const loc = await this.blobLocation(d);
        if (!loc) return null;
        return GlassDb.open(this.reader.src, loc.offset, loc.size, this.reader.src instanceof HttpRangeSource || this.reader.src instanceof QueryRangeSource ? 2 : 1);
      })().catch((e) => {
        console.warn('Xapian dizini açılamadı', e);
        return null;
      });
      this.xapianCache.set(kind, p);
    }
    return p;
  }

  /** Arşivdeki (yeni düzende C/ önekiyle verilen) yolun girdisi. */
  async direntForIndexedPath(data: string): Promise<ZimDirent | null> {
    let path = data;
    if (this.isNewNamespace) {
      if (path.startsWith('C/')) path = path.slice(2);
      return this.findByPath('C', path);
    }
    const m = /^([A-Z\-])\/(.+)$/.exec(path);
    return m ? this.findByPath(m[1], m[2]) : this.findByPath('A', path);
  }

  /** Rastgele bir ön makale (başlık listesinden). */
  async randomArticle(rand: () => number = Math.random): Promise<ZimHit | null> {
    const tl = this.titleList;
    if (!tl || tl.hi <= tl.lo) return null;
    for (let tries = 0; tries < 12; tries++) {
      const j = tl.lo + Math.floor(rand() * (tl.hi - tl.lo));
      const d = await this.titleDirent(j);
      if (d.mime === REDIRECT) continue;
      const mime = this.mimeOf(d);
      if (!mime.startsWith('text/html')) continue;
      return { path: this.publicPath(d), title: d.title };
    }
    return null;
  }

  /** Başlık listesindeki j. girdi (0 ≤ j < articleCount) — küçük arşivlerde tam tarama için. */
  async titleEntry(j: number): Promise<(ZimHit & { redirect: boolean }) | null> {
    const tl = this.titleList;
    if (!tl || j < 0 || j >= tl.hi - tl.lo) return null;
    const d = await this.titleDirent(tl.lo + j);
    return { path: this.publicPath(d), title: d.title, redirect: d.mime === REDIRECT };
  }

  // ---------------------------------------------------------------- arama

  private async initTitleList() {
    // 1) Yeni düzen: yalnızca ön makaleleri içeren v1 listesi
    if (this.isNewNamespace) {
      try {
        const d = await this.findByPath('X', 'listing/titleOrdered/v1');
        const r = d ? await this.resolve(d) : null;
        if (r) {
          const [start] = await this.clusterBounds(r.cluster!);
          const info = (await this.reader.read(start, 1))[0];
          const comp = info & 0x0f;
          let at: (j: number) => Promise<number>;
          let count: number;
          if (comp === 0 || comp === 1) {
            // Sıkıştırmasız (normal durum): dosyadan doğrudan, sayfa önbellekli oku
            const osz = info & 0x10 ? 8 : 4;
            const rd = (b: Uint8Array, o: number) => (osz === 8 ? u64(b, o) : u32(b, o));
            const base = start + 1;
            const offs = await this.reader.read(base + r.blob! * osz, osz * 2);
            const a = rd(offs, 0);
            // Liste girdi sayısından uzun olamaz (bozuk boyut sonsuz aramaya yol açmasın)
            count = Math.max(0, Math.min(Math.floor((rd(offs, osz) - a) / 4), this.header.entryCount));
            const abs = base + a;
            at = async (j) => u32(await this.reader.read(abs + j * 4, 4), 0);
          } else {
            const data = await this.getBlob(r.cluster!, r.blob!);
            count = Math.min(Math.floor(data.length / 4), this.header.entryCount);
            at = async (j) => u32(data, j * 4);
          }
          this.titleList = { lo: 0, hi: count, at };
          return;
        }
      } catch {
        /* başlık listesine düş */
      }
    }
    // 2) Başlıktaki tam başlık listesi; içerik ad alanı aralığını bul
    const pos = this.header.titlePtrPos;
    const at = async (j: number) => u32(await this.reader.read(pos + j * 4, 4), 0);
    const ns = this.contentNs();
    const n = this.header.entryCount;
    const nsAt = async (j: number) => (await this.direntAt(await at(j))).ns;
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const m = mid(lo, hi);
      if ((await nsAt(m)) < ns) lo = m + 1;
      else hi = m;
    }
    const start = lo;
    hi = n;
    while (lo < hi) {
      const m = mid(lo, hi);
      if ((await nsAt(m)) <= ns) lo = m + 1;
      else hi = m;
    }
    this.titleList = { lo: start, hi: lo, at };
  }

  private async titleDirent(j: number) {
    return this.direntAt(await this.titleList!.at(j));
  }

  /** [lo,hi) içinde başlığı `prefix` ile başlayan aralık. */
  private async prefixRange(prefix: string, lo: number, hi: number): Promise<[number, number]> {
    let a = lo;
    let b = hi;
    while (a < b) {
      const m = mid(a, b);
      if (cmp((await this.titleDirent(m)).title, prefix) < 0) a = m + 1;
      else b = m;
    }
    const first = a;
    b = hi;
    while (a < b) {
      const m = mid(a, b);
      const t = (await this.titleDirent(m)).title;
      if (cmp(t.slice(0, prefix.length), prefix) <= 0) a = m + 1;
      else b = m;
    }
    return [first, a];
  }

  /**
   * Büyük/küçük harf ve Türkçe i/ı duyarsız başlık öneki araması. Başlık listesi
   * bayt sırasıyla (harf duyarlı) sıralı olduğundan sorgunun harf varyantları
   * dallanarak ikili aramayla daraltılır; boş dallar budanır. Ardından küçük bir
   * pencerede "içerir" araması yapılır. Hiçbir zaman tüm arşiv taranmaz.
   * `contains` = false ise "içerir" yedeği atlanır (Xapian başlık dizini varken
   * gereksizdir ve ağ üzerinden en pahalı kısımdır).
   */
  async searchTitles(query: string, limit = 20, contains = true): Promise<(ZimHit & { redirect: boolean })[]> {
    const tl = this.titleList;
    if (!tl || tl.hi <= tl.lo) return [];
    const q = query.replace(/[_\s]+/g, ' ').trim();
    const qn = foldTr(q);
    if (!qn) return [];
    const chars = [...q];
    const found = new Map<number, ZimHit & { n: string; redirect: boolean }>();
    let budget = 400; // ikili arama sayısı üst sınırı
    const SCAN = 48;
    // Toplanacak başlık sınırı. Bir harf varyantının dalı (ör. "Istanbul…")
    // sınırı tek başına doldurursa diğer varyantlar ("İstanbul") hiç
    // aranmazdı; bu yüzden sonraki her dolu varyanta küçük bir ek pay verilir.
    let cap = limit;
    const capMax = limit * 3;
    const share = Math.min(limit, 8);

    const add = (d: ZimDirent) => {
      if (found.has(d.index)) return;
      // Yönlendirme bilgisi sıralamada kullanılır: aynı katlanmış başlıktan asıl madde gösterilir
      // ("Vikipedi" araması "Vıkıpedı" yönlendirmesini değil "Vikipedi" maddesini getirsin)
      found.set(d.index, { path: this.publicPath(d), title: d.title, n: foldTr(d.title), redirect: d.mime === REDIRECT });
    };

    const scan = async (a: number, b: number, test: (n: string) => boolean, max: number) => {
      for (let j = a; j < b && found.size < max; j++) {
        const d = await this.titleDirent(j);
        if (test(foldTr(d.title))) add(d);
      }
    };

    const expand = async (p: string, i: number, lo: number, hi: number): Promise<void> => {
      if (found.size >= cap || budget <= 0) return;
      let a = lo;
      let b = hi;
      if (p) {
        budget--;
        [a, b] = await this.prefixRange(p, lo, hi);
      }
      if (a >= b) return;
      if (i >= chars.length || b - a <= SCAN) {
        await scan(a, b, (n) => n.startsWith(qn), cap);
        return;
      }
      let vs = caseVariants(chars[i]);
      // Vikipedi başlıkları çoğunlukla büyük harfle başlar, devamı küçük harftir
      const pref = i === 0 ? chars[i].toLocaleUpperCase('tr') : chars[i].toLocaleLowerCase('tr');
      vs = [pref, ...vs.filter((v) => v !== pref)];
      for (const [k, v] of vs.entries()) {
        if (k > 0 && found.size >= cap) cap = Math.min(capMax, found.size + share);
        await expand(p + v, i + 1, a, b);
        if (found.size >= capMax || budget <= 0) return;
      }
    };

    await expand('', 0, tl.lo, tl.hi);

    // "İçerir" yedeği — sınırlı pencere
    if (contains && found.size < limit) {
      const words = qn.split(' ').filter(Boolean);
      const containsAll = (n: string) => words.every((w) => n.includes(w));
      const total = tl.hi - tl.lo;
      if (total <= 3000) {
        await scan(tl.lo, tl.hi, containsAll, limit);
      } else if (words.length > 1) {
        // İlk kelimeyle başlayan başlıkların ilk ~600'ünde tüm kelimeleri ara
        const first = words[0];
        const variants = [first[0].toLocaleUpperCase('tr'), first[0], ...caseVariants(first[0])];
        const seen = new Set<string>();
        for (const v of variants) {
          if (seen.has(v) || found.size >= limit) continue;
          seen.add(v);
          const p = v + [...first].slice(1).join('');
          const [a, b] = await this.prefixRange(p, tl.lo, tl.hi);
          await scan(a, Math.min(b, a + 600), containsAll, limit);
        }
      }
    }

    return [...found.values()]
      .sort((x, y) => {
        const ex = x.n === qn ? 0 : x.n.startsWith(qn) ? 1 : 2;
        const ey = y.n === qn ? 0 : y.n.startsWith(qn) ? 1 : 2;
        return ex - ey || x.n.localeCompare(y.n, 'tr');
      })
      .slice(0, limit)
      .map(({ path, title, redirect }) => ({ path, title, redirect }));
  }
}
