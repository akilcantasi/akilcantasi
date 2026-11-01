// Saf TypeScript, salt okunur Xapian "glass" veritabanı okuyucusu.
//
// ZIM dosyaları (libzim ≥ 6) içlerinde tek dosyalık (single-file, compact) iki
// Xapian veritabanı taşır:
//   X/title/xapian     başlık dizini — başlığın her kelimesi (aksansız, küçük
//                      harf) + "Z" önekli kökler; değer 0 = başlık, 1 = hedef yol
//   X/fulltext/xapian  tam metin dizini — STEM_ALL: yalnızca kökler (önek yok);
//                      değer 0 = başlık, 1 = kelime sayısı
// Belge verisi (docdata) her iki dizinde de "C/<yol>" biçimindedir.
//
// Bu dosya Xapian 1.4 kaynağındaki biçime göre yazıldı (backends/glass/
// glass_table.h, glass_version.cc, glass_postlist.cc, glass_values.cc,
// common/pack.h). Yalnızca okuma için gereken kısım uygulanır: sürüm başlığı,
// B-ağacı gezintisi (dal/yaprak blokları, çok parçalı etiketler, zlib ham
// sıkıştırma), kayıt listeleri (posting list), belge verisi ve değer akışları.
//
// Bloklar 16 bitlik, büyük-endian (big-endian) ofsetler kullanır. Tek dosyalık
// veritabanında n. blok, veritabanının ZIM içindeki başlangıcı + n·blok_boyu
// konumundadır; 0. blok sürüm başlığını taşır.
import type { RandomAccessSource } from '../source';
import { LRU } from './cache';

const MAGIC = [0x0f, 0x0d, ...Array.from('Xapian Glass', (c) => c.charCodeAt(0))];
const FORMAT_VERSION = ((2016 - 2014) << 9) | (3 << 5) | 14; // 2016-03-14 (1.3.5+)
const DIR_START = 11;
const LEVEL_FREELIST = 254;

export const enum Table {
  POSTLIST = 0,
  DOCDATA = 1,
  TERMLIST = 2,
  POSITION = 3,
  SPELLING = 4,
  SYNONYM = 5,
}

interface RootInfo {
  root: number;
  level: number;
  fake: boolean;
  entries: number;
  blockSize: number;
  compressMin: number;
}

const be16 = (b: Uint8Array, o: number) => (b[o] << 8) | b[o + 1];
const be32 = (b: Uint8Array, o: number) => ((b[o] << 24) >>> 0) + ((b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]);

/** Bayt dizisi okuma imleci (pack.h kodlamaları). */
export class Unpacker {
  constructor(public b: Uint8Array, public p = 0, public end = b.length) {}
  get done() {
    return this.p >= this.end;
  }
  /** pack_uint: küçük-endian 7 bit gruplar, üst bit = devam. */
  uint(): number {
    let r = 0;
    let mul = 1;
    for (;;) {
      if (this.p >= this.end) throw new Error('xapian: veri bitti');
      const c = this.b[this.p++];
      r += (c & 0x7f) * mul;
      if (c < 128) return r;
      mul *= 128;
    }
  }
  /** pack_bool: '0' / '1' */
  bool(): boolean {
    const c = this.b[this.p++] - 0x30;
    if (c !== 0 && c !== 1) throw new Error('xapian: bozuk bool');
    return c === 1;
  }
  bytes(n: number): Uint8Array {
    if (this.p + n > this.end) throw new Error('xapian: veri bitti');
    const r = this.b.subarray(this.p, this.p + n);
    this.p += n;
    return r;
  }
  /** pack_string: uzunluk + baytlar */
  str(): Uint8Array {
    return this.bytes(this.uint());
  }
}

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8');

/** pack_string_preserving_sort: \0 → \0\xff, last değilse sona \0. */
export function packStringSort(s: string | Uint8Array, last: boolean): Uint8Array {
  const b = typeof s === 'string' ? enc.encode(s) : s;
  const out: number[] = [];
  for (const c of b) {
    out.push(c);
    if (c === 0) out.push(0xff);
  }
  if (!last) out.push(0);
  return Uint8Array.from(out);
}

/** pack_uint_preserving_sort (glass). */
export function packUintSort(v: number): Uint8Array {
  if (v < 0x8000) return Uint8Array.of(v >> 8, v & 0xff);
  let len = 3;
  for (let x = Math.floor(v / 2 ** 22); x; x = Math.floor(x / 128)) len++;
  const out = new Uint8Array(len);
  let x = v;
  for (let i = 1; i < len; i++) {
    out[len - i] = x & 0xff;
    x = Math.floor(x / 256);
  }
  out[0] = (x | (0xff << (10 - len))) & 0xff;
  return out;
}

export function unpackUintSort(u: Unpacker): number {
  const b = u.b;
  const lb = b[u.p++];
  if (lb < 0x80) return (lb << 8) | b[u.p++];
  if (lb === 0xff) throw new Error('xapian: bozuk sıralı sayı');
  let len = 2;
  for (let m = 0x40; lb & m; m >>= 1) len++;
  let r = lb & ~(0xff << (9 - len)) & 0xff;
  for (let i = 0; i < len; i++) r = r * 256 + b[u.p++];
  return r;
}

function concat(a: Uint8Array, b: Uint8Array) {
  const r = new Uint8Array(a.length + b.length);
  r.set(a);
  r.set(b, a.length);
  return r;
}

function cmpBytes(a: Uint8Array, b: Uint8Array): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
}

function startsWith(a: Uint8Array, p: Uint8Array) {
  if (a.length < p.length) return false;
  for (let i = 0; i < p.length; i++) if (a[i] !== p[i]) return false;
  return true;
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const DS = (globalThis as any).DecompressionStream;
  if (!DS) throw new Error('xapian: DecompressionStream yok');
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DS('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

interface Leaf {
  key: Uint8Array;
  comp: number;
  first: boolean;
  last: boolean;
  compressed: boolean;
  tag: Uint8Array;
}

function leafAt(p: Uint8Array, c: number): Leaf {
  const o = be16(p, c);
  const flags = p[o];
  const size = (be16(p, o) & 0x1fff) + 3;
  const klen = p[o + 2];
  const key = p.subarray(o + 3, o + 3 + klen);
  const first = (flags & 0x20) !== 0;
  let cd = o + 3 + klen;
  const comp = first ? 1 : be16(p, cd);
  if (!first) cd += 2;
  return { key, comp, first, last: (flags & 0x40) !== 0, compressed: (flags & 0x80) !== 0, tag: p.subarray(cd, o + size) };
}

function branchAt(p: Uint8Array, c: number) {
  const o = be16(p, c);
  const block = be32(p, o);
  const klen = p[o + 4];
  const key = p.subarray(o + 5, o + 5 + klen);
  const comp = be16(p, o + 5 + klen);
  return { block, key, comp };
}

/** Anahtar (+ bileşen) karşılaştırması; arama anahtarının bileşeni 1'dir. */
function cmpItem(key: Uint8Array, comp: number, k2: Uint8Array, c2: number) {
  return cmpBytes(key, k2) || comp - c2;
}

/** Dal bloğunda anahtardan küçük-eşit son öğe (ilk öğe her zaman "boş anahtar"). */
function findInBranch(p: Uint8Array, key: Uint8Array): number {
  let i = DIR_START;
  let j = be16(p, 9);
  while (j - i > 2) {
    const k = i + Math.floor((j - i) / 4) * 2;
    const it = branchAt(p, k);
    const r = cmpItem(key, 1, it.key, it.comp);
    if (r < 0) j = k;
    else {
      i = k;
      if (r === 0) break;
    }
  }
  return i;
}

/** Yaprak bloğunda anahtardan küçük-eşit son öğe; DIR_START-2 = hiçbiri. */
function findInLeaf(p: Uint8Array, key: Uint8Array): { c: number; exact: boolean } {
  let i = DIR_START - 2;
  let j = be16(p, 9);
  while (j - i > 2) {
    const k = i + Math.floor((j - i) / 4) * 2;
    const it = leafAt(p, k);
    const r = cmpItem(key, 1, it.key, it.comp);
    if (r < 0) j = k;
    else {
      i = k;
      if (r === 0) return { c: i, exact: true };
    }
  }
  return { c: i, exact: false };
}

export interface Posting {
  did: number;
  wdf: number;
}

export interface TermInfo {
  term: string;
  tf: number;
}

/**
 * B-ağacı imleci: kökten yaprağa yol (blok, dizin ofseti). Yalnızca ileri
 * gidilir (next); çok parçalı etiketler okunurken de kullanılır.
 */
class Cursor {
  private path: { p: Uint8Array; c: number }[] = [];
  constructor(private db: GlassDb, private t: RootInfo) {}

  /** key'e konumlanır (key'den küçük-eşit son öğe). Tam eşleşmeyse true. */
  async find(key: Uint8Array): Promise<boolean> {
    const t = this.t;
    this.path = new Array(t.level + 1);
    let n = t.root;
    for (let j = t.level; j > 0; j--) {
      const p = await this.db.block(t, n, j);
      const c = findInBranch(p, key);
      this.path[j] = { p, c };
      n = branchAt(p, c).block;
    }
    const p = await this.db.block(t, n, 0);
    const r = findInLeaf(p, key);
    this.path[0] = { p, c: r.c };
    return r.exact;
  }

  /** Sonraki yaprak öğesine geçer; ağacın sonundaysa false. */
  async next(): Promise<boolean> {
    const leaf = this.path[0];
    leaf.c += 2;
    if (leaf.c < be16(leaf.p, 9)) return true;
    // Yukarı çık, ilk ilerleyebilen dalı bul
    let j = 1;
    for (; j <= this.t.level; j++) {
      const e = this.path[j];
      e.c += 2;
      if (e.c < be16(e.p, 9)) break;
    }
    if (j > this.t.level) {
      leaf.c = be16(leaf.p, 9);
      return false;
    }
    for (; j > 0; j--) {
      const e = this.path[j];
      const p = await this.db.block(this.t, branchAt(e.p, e.c).block, j - 1);
      this.path[j - 1] = { p, c: DIR_START };
    }
    return be16(this.path[0].p, 9) > DIR_START;
  }

  /** Geçerli öğe (DIR_START-2 konumundaysa önce next çağrılmalı). */
  item(): Leaf | null {
    const e = this.path[0];
    if (!e || e.c < DIR_START || e.c >= be16(e.p, 9)) return null;
    return leafAt(e.p, e.c);
  }

  /** Geçerli öğeden başlayarak tüm etiketi okur (imleç son bileşende kalır). */
  async readTag(): Promise<Uint8Array | null> {
    let it = this.item();
    if (!it) return null;
    const compressed = it.compressed;
    let tag = it.tag.slice();
    while (!it.last) {
      if (!(await this.next())) break;
      it = this.item();
      if (!it) break;
      tag = concat(tag, it.tag);
    }
    return compressed ? inflateRaw(tag) : tag;
  }
}

export class GlassDb {
  readonly roots: RootInfo[] = [];
  readonly blockSize: number;
  docCount = 0;
  lastDocid = 0;
  totalDoclen = 0;
  /** Blok okuma sayısı (ölçüm için) */
  blockReads = 0;
  private blocks = new LRU<number, Promise<Uint8Array>>(512); // ≤ 4 MB (8 KB blok)
  private metaCache = new Map<string, Promise<string | null>>();

  private constructor(
    private src: RandomAccessSource,
    private base: number,
    readonly size: number,
    hdr: Uint8Array,
    /** Tek istekte okunan ardışık blok sayısı (ağ kaynaklarında > 1) */
    private group = 1,
  ) {
    const u = new Unpacker(hdr, 16 + 16);
    u.uint(); // revizyon
    for (let i = 0; i < 6; i++) {
      const root = u.uint();
      const val = u.uint();
      const entries = u.uint();
      const bs = u.uint() << 11;
      const compressMin = u.uint();
      u.str(); // boş liste bilgisi
      this.roots.push({ root, level: val >> 2, fake: (val & 1) === 1, entries, blockSize: bs, compressMin });
    }
    this.blockSize = this.roots[0].blockSize;
    try {
      this.docCount = u.uint();
      this.lastDocid = u.uint() + this.docCount;
      u.uint(); // doclen_lbound
      u.uint(); // wdf_ubound
      u.uint(); // doclen_ubound - wdf_ubound
      u.uint(); // oldest_changeset
      this.totalDoclen = u.uint();
    } catch {
      /* istatistik yok */
    }
  }

  /** ZIM içindeki bir blob'u (base, size) glass veritabanı olarak açar. */
  static async open(src: RandomAccessSource, base: number, size: number, group = 1): Promise<GlassDb> {
    const hdr = await src.read(base, Math.min(256, size));
    for (let i = 0; i < MAGIC.length; i++) if (hdr[i] !== MAGIC[i]) throw new Error('Xapian glass veritabanı değil');
    const v = (hdr[14] << 8) | hdr[15];
    if (v !== FORMAT_VERSION) throw new Error('Desteklenmeyen glass sürümü: ' + v);
    return new GlassDb(src, base, size, hdr.slice(), Math.max(1, group));
  }

  async block(t: RootInfo, n: number, level: number): Promise<Uint8Array> {
    const bs = t.blockSize;
    let p = this.blocks.get(n);
    if (!p) {
      if ((n + 1) * bs > this.size) throw new Error('xapian: blok aralık dışında: ' + n);
      this.blockReads++;
      // Hizalı grup okuma: aynı istekle komşu bloklar da önbelleğe girer
      const g0 = n - (n % this.group);
      const cnt = Math.max(1, Math.min(this.group, Math.floor(this.size / bs) - g0));
      const all = this.src.read(this.base + g0 * bs, cnt * bs);
      for (let i = 0; i < cnt; i++) {
        const k = g0 + i;
        if (k !== n && this.blocks.get(k)) continue;
        const bp = all.then((b) => b.slice(i * bs, (i + 1) * bs));
        bp.catch(() => this.blocks.delete(k));
        this.blocks.set(k, bp);
        if (k === n) p = bp;
      }
    }
    const b = await p!;
    if (b[4] !== level || b[4] === LEVEL_FREELIST) throw new Error(`xapian: blok ${n} seviye ${b[4]}, beklenen ${level}`);
    return b;
  }

  private table(t: Table): RootInfo | null {
    const r = this.roots[t];
    return r && !r.fake ? r : null;
  }

  cursor(t: Table): Cursor | null {
    const r = this.table(t);
    return r ? new Cursor(this, r) : null;
  }

  /** Tam anahtarla etiket. */
  async get(t: Table, key: Uint8Array): Promise<Uint8Array | null> {
    const c = this.cursor(t);
    if (!c || !(await c.find(key))) return null;
    return c.readTag();
  }

  // ------------------------------------------------------------ üstveri

  async metadata(name: string): Promise<string | null> {
    let p = this.metaCache.get(name);
    if (!p) {
      p = this.get(Table.POSTLIST, concat(Uint8Array.of(0, 0xc0), enc.encode(name)))
        .then((b) => (b ? dec.decode(b) : null))
        .catch(() => null);
      this.metaCache.set(name, p);
    }
    return p;
  }

  // ------------------------------------------------------------ terimler

  /** Terimin belge sıklığı (yoksa 0). */
  async termFreq(term: string): Promise<number> {
    const c = this.cursor(Table.POSTLIST);
    if (!c || !(await c.find(packStringSort(term, true)))) return 0;
    const it = c.item()!;
    return new Unpacker(it.tag).uint(); // ilk bileşen her zaman sıkıştırmasız (postlist)
  }

  /**
   * `prefix` ile başlayan terimler (sözlük sırasıyla), en fazla `limit` tane ve
   * en fazla `maxItems` yaprak öğesi taranarak.
   */
  async termsWithPrefix(prefix: string, limit = 50, maxItems = 4000): Promise<TermInfo[]> {
    const c = this.cursor(Table.POSTLIST);
    if (!c) return [];
    const pb = enc.encode(prefix);
    if (!pb.length) return [];
    const exact = await c.find(packStringSort(pb, true));
    const out: TermInfo[] = [];
    if (!exact && !(await c.next())) return out;
    for (let n = 0; n < maxItems && out.length < limit; n++) {
      const it = c.item();
      if (!it) break;
      if (!startsWith(it.key, pb)) break;
      // Yalnızca ilk parçalar (anahtarda \0 sonrası docid yok) ve ilk bileşen
      if (it.first && it.key.indexOf(0) < 0) {
        try {
          out.push({ term: dec.decode(it.key), tf: new Unpacker(it.tag).uint() });
        } catch {
          /* atla */
        }
      }
      if (!(await c.next())) break;
    }
    return out;
  }

  /**
   * Terimin kayıt listesi (docid artan). En fazla `max` kayıt okunur; uzun
   * listelerde ilk `max` belge döner (glass belge sırası = ZIM'e eklenme sırası).
   */
  async postings(term: string, max = 5000): Promise<{ tf: number; list: Posting[] }> {
    const c = this.cursor(Table.POSTLIST);
    if (!c || !(await c.find(packStringSort(term, true)))) return { tf: 0, list: [] };
    const tag = await c.readTag();
    if (!tag) return { tf: 0, list: [] };
    let u = new Unpacker(tag);
    const tf = u.uint();
    u.uint(); // collection freq
    let did = u.uint() + 1;
    const list: Posting[] = [];
    for (;;) {
      const isLast = u.bool();
      u.uint(); // son docid'e artış
      list.push({ did, wdf: u.uint() });
      while (!u.done && list.length < max) {
        did += u.uint() + 1;
        list.push({ did, wdf: u.uint() });
      }
      if (isLast || list.length >= max) break;
      // Sonraki parça: anahtar = terim\0 + sıralı docid
      if (!(await c.next())) break;
      const it = c.item();
      const pre = packStringSort(term, false);
      if (!it || !startsWith(it.key, pre)) break;
      const ku = new Unpacker(it.key, pre.length);
      did = unpackUintSort(ku);
      const t2 = await c.readTag();
      if (!t2) break;
      u = new Unpacker(t2);
    }
    return { tf, list };
  }

  /**
   * Belge uzunlukları (doclen listesi = boş terimin kayıt listesi, anahtar
   * "\0\xe0"). docid'ler sıralanıp aynı parçadakiler tek okumayla çözülür.
   */
  async doclens(dids: number[]): Promise<Map<number, number>> {
    const out = new Map<number, number>();
    const c = this.cursor(Table.POSTLIST);
    if (!c) return out;
    const pre = Uint8Array.of(0, 0xe0);
    const sorted = [...new Set(dids)].sort((a, b) => a - b);
    let chunk: Map<number, number> | null = null;
    let lo = 0;
    let hi = -1;
    for (const did of sorted) {
      if (!chunk || did < lo || did > hi) {
        chunk = null;
        await c.find(concat(pre, packUintSort(did)));
        let it = c.item();
        if (!it || !startsWith(it.key, pre)) {
          if (!(await c.next())) continue;
          it = c.item();
          if (!it || !startsWith(it.key, pre)) continue;
        }
        const first = it.key.length === 2;
        const tag = await c.readTag();
        if (!tag) continue;
        const u = new Unpacker(tag);
        let d: number;
        if (first) {
          u.uint();
          u.uint();
          d = u.uint() + 1;
        } else d = unpackUintSort(new Unpacker(it.key, 2));
        u.bool();
        const last = d + u.uint();
        chunk = new Map([[d, u.uint()]]);
        while (!u.done) {
          d += u.uint() + 1;
          chunk.set(d, u.uint());
        }
        lo = first ? 0 : unpackUintSort(new Unpacker(it.key, 2));
        hi = last;
      }
      const v = chunk.get(did);
      if (v !== undefined) out.set(did, v);
    }
    return out;
  }

  // ------------------------------------------------------------ belgeler

  async docData(did: number): Promise<string | null> {
    const b = await this.get(Table.DOCDATA, packUintSort(did));
    return b ? dec.decode(b) : null;
  }

  /** Değer yuvasındaki (slot) değer; glass değer akışlarından okunur. */
  async value(slot: number, did: number): Promise<string | null> {
    const c = this.cursor(Table.POSTLIST);
    if (!c) return null;
    const pre = Uint8Array.of(0, 0xd8, ...packUint(slot));
    const exact = await c.find(concat(pre, packUintSort(did)));
    let it = c.item();
    if (!exact) {
      if (!it || !startsWith(it.key, pre)) return null;
    }
    if (!it) return null;
    const first = unpackUintSort(new Unpacker(it.key, pre.length));
    const tag = await c.readTag();
    if (!tag) return null;
    const u = new Unpacker(tag);
    let cur = first;
    let v = u.str();
    while (cur < did) {
      if (u.done) return null;
      cur += u.uint() + 1;
      v = u.str();
    }
    return cur === did ? dec.decode(v) : null;
  }
}

function packUint(v: number): number[] {
  const out: number[] = [];
  while (v >= 128) {
    out.push((v & 0x7f) | 0x80);
    v = Math.floor(v / 128);
  }
  out.push(v);
  return out;
}
