// Küçük yardımcılar: LRU önbellek ve sayfa önbellekli rastgele erişim okuyucu.
import type { RandomAccessSource } from '../source';

export class LRU<K, V> {
  private map = new Map<K, V>();
  constructor(private max: number) {}
  get(k: K): V | undefined {
    const v = this.map.get(k);
    if (v !== undefined) {
      this.map.delete(k);
      this.map.set(k, v);
    }
    return v;
  }
  set(k: K, v: V) {
    if (this.map.has(k)) this.map.delete(k);
    this.map.set(k, v);
    while (this.map.size > this.max) {
      const first = this.map.keys().next().value as K;
      this.map.delete(first);
    }
  }
  delete(k: K) {
    this.map.delete(k);
  }
  clear() {
    this.map.clear();
  }
}

/**
 * Kaynağı sabit boyutlu sayfalar hâlinde okur ve önbelleğe alır. Başlık/işaretçi
 * listeleri ve dizin girdileri gibi küçük, dağınık okumalar (özellikle HTTP Range
 * üzerinden) böylece tekrar tekrar ağa gitmez.
 */
export class PagedReader {
  private pages: LRU<number, Promise<Uint8Array>>;
  constructor(readonly src: RandomAccessSource, private pageSize = 16 * 1024, maxPages = 256) {
    this.pages = new LRU(maxPages);
  }
  get size() {
    return this.src.size;
  }

  private page(n: number): Promise<Uint8Array> {
    let p = this.pages.get(n);
    if (!p) {
      const off = n * this.pageSize;
      p = this.src.read(off, Math.min(this.pageSize, this.src.size - off)).then((b) => b.slice());
      p.catch(() => this.pages.delete(n));
      this.pages.set(n, p);
    }
    return p;
  }

  /** Önbellekten okur (en fazla dosya sonuna kadar). */
  async read(offset: number, length: number): Promise<Uint8Array> {
    if (offset < 0 || offset >= this.src.size) return new Uint8Array(0);
    length = Math.min(length, this.src.size - offset);
    // Büyük okumalar doğrudan kaynağa gider
    if (length > this.pageSize * 4) return this.src.read(offset, length);
    const first = Math.floor(offset / this.pageSize);
    const last = Math.floor((offset + length - 1) / this.pageSize);
    if (first === last) {
      const pg = await this.page(first);
      const s = offset - first * this.pageSize;
      return pg.subarray(s, s + length);
    }
    const out = new Uint8Array(length);
    const pages = await Promise.all(
      Array.from({ length: last - first + 1 }, (_, i) => this.page(first + i)),
    );
    let w = 0;
    for (let i = 0; i < pages.length; i++) {
      const pg = pages[i];
      const pageStart = (first + i) * this.pageSize;
      const s = Math.max(offset, pageStart) - pageStart;
      const e = Math.min(offset + length, pageStart + pg.length) - pageStart;
      out.set(pg.subarray(s, e), w);
      w += e - s;
    }
    return out;
  }

  /** Doğrudan (önbelleksiz) okuma — büyük küme verileri için. */
  readRaw(offset: number, length: number) {
    return this.src.read(offset, Math.min(length, this.src.size - offset));
  }
}

export function u16(b: Uint8Array, o: number) {
  return b[o] | (b[o + 1] << 8);
}
export function u32(b: Uint8Array, o: number) {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)) + b[o + 3] * 0x1000000;
}
export function u64(b: Uint8Array, o: number) {
  // 2^53'e kadar güvenli (ZIM dosyaları için yeterli)
  return u32(b, o) + u32(b, o + 4) * 0x100000000;
}
