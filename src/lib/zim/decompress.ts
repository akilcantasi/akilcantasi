// ZIM küme sıkıştırma çözücüleri. Kütüphaneler ilk ihtiyaçta yüklenir.
//  1 (ve 0): sıkıştırmasız   4: xz (lzma2)   5: zstd
//  2 (zlib) ve 3 (bzip2) eski ve pratikte kullanılmayan türlerdir; desteklenmez.

export const COMP_NONE = 1;
export const COMP_XZ = 4;
export const COMP_ZSTD = 5;

/**
 * Bir kümenin açılmış hâli için üst sınır. libzim kümeleri ~2 MiB'dir; sınır, bozuk ya da
 * kötü niyetli bir arşivin "sıkıştırma bombası" ile sekmeyi belleksiz bırakmasını önler.
 */
export const MAX_CLUSTER_BYTES = 128 * 1024 * 1024;

let zstdMod: Promise<typeof import('fzstd')> | null = null;
let xzMod: Promise<typeof import('xz-decompress')> | null = null;

/**
 * zstd verisinin açılmış boyutu için, açmadan, üst sınır (RFC 8878 çerçeve ve blok başlıkları).
 * `alloc`: fzstd'nin baştan ayıracağı bellek (çerçeve içerik boyutu ya da pencere boyutu).
 * Biçim bozuksa hata fırlatır.
 */
export function zstdBound(d: Uint8Array): { out: number; alloc: number } {
  let p = 0;
  let out = 0;
  let alloc = 0;
  const need = (n: number) => {
    if (p + n > d.length) throw new Error('zstd: veri eksik');
  };
  const le = (o: number, n: number) => {
    let v = 0;
    for (let i = n - 1; i >= 0; i--) v = v * 256 + d[o + i];
    return v;
  };
  while (p < d.length) {
    need(4);
    const magic = le(p, 4);
    p += 4;
    if (magic >>> 4 === 0x184d2a5) {
      // Atlanabilir çerçeve
      need(4);
      p += 4 + le(p, 4);
      if (p > d.length) throw new Error('zstd: veri eksik');
      continue;
    }
    if (magic !== 0xfd2fb528) throw new Error('zstd: geçersiz çerçeve');
    need(1);
    const flg = d[p++];
    const fcf = flg >> 6;
    const ss = (flg >> 5) & 1;
    const cc = (flg >> 2) & 1;
    const did = flg & 3;
    if (flg & 8) throw new Error('zstd: ayrılmış bit');
    let ws = 0;
    if (!ss) {
      need(1);
      const wd = d[p++];
      const base = 2 ** (10 + (wd >> 3));
      ws = base + (base / 8) * (wd & 7);
    }
    p += did === 3 ? 4 : did;
    const fsb = fcf ? 1 << fcf : ss;
    need(fsb);
    const fcs = fsb ? le(p, fsb) + (fcf === 1 ? 256 : 0) : 0;
    p += fsb;
    if (ss) ws = fcs;
    alloc = Math.max(alloc, fcs || ws);
    const blockMax = Math.min(ws || 131072, 131072);
    for (;;) {
      need(3);
      const bh = le(p, 3);
      p += 3;
      const last = bh & 1;
      const type = (bh >> 1) & 3;
      const size = bh >>> 3;
      if (type === 0) {
        out += size;
        p += size;
      } else if (type === 1) {
        out += size;
        p += 1;
      } else if (type === 2) {
        out += blockMax;
        p += size;
      } else throw new Error('zstd: ayrılmış blok türü');
      if (p > d.length) throw new Error('zstd: veri eksik');
      if (last) break;
    }
    if (cc) p += 4;
    if (fcs) out = Math.max(out, fcs);
  }
  return { out, alloc };
}

export async function decompressZstd(data: Uint8Array, max = MAX_CLUSTER_BYTES): Promise<Uint8Array> {
  const b = zstdBound(data);
  if (b.out > max || b.alloc > max) throw new Error('zstd: açılmış küme çok büyük');
  zstdMod ??= import('fzstd');
  const { decompress } = await zstdMod;
  return decompress(data);
}

export async function decompressXz(data: Uint8Array, max = MAX_CLUSTER_BYTES): Promise<Uint8Array> {
  xzMod ??= import('xz-decompress');
  const { XzReadableStream } = await xzMod;
  const input = new ReadableStream<Uint8Array>({
    start(c) {
      c.enqueue(data);
      c.close();
    },
  });
  const out = new XzReadableStream(input);
  const reader = out.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
    if (total > max) {
      reader.cancel().catch(() => {});
      throw new Error('xz: açılmış küme çok büyük');
    }
  }
  if (chunks.length === 1) return chunks[0];
  const res = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) {
    res.set(c, o);
    o += c.length;
  }
  return res;
}

export async function decompress(type: number, data: Uint8Array): Promise<Uint8Array> {
  switch (type) {
    case 0:
    case COMP_NONE:
      return data;
    case COMP_XZ:
      return decompressXz(data);
    case COMP_ZSTD:
      return decompressZstd(data);
    default:
      throw new Error(`Desteklenmeyen ZIM sıkıştırma türü: ${type}`);
  }
}
