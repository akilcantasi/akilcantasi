// ZIM küme sıkıştırma çözücüleri. Kütüphaneler ilk ihtiyaçta yüklenir.
//  1 (ve 0): sıkıştırmasız   4: xz (lzma2)   5: zstd
//  2 (zlib) ve 3 (bzip2) eski ve pratikte kullanılmayan türlerdir; desteklenmez.

export const COMP_NONE = 1;
export const COMP_XZ = 4;
export const COMP_ZSTD = 5;

let zstdMod: Promise<typeof import('fzstd')> | null = null;
let xzMod: Promise<typeof import('xz-decompress')> | null = null;

export async function decompressZstd(data: Uint8Array): Promise<Uint8Array> {
  zstdMod ??= import('fzstd');
  const { decompress } = await zstdMod;
  return decompress(data);
}

export async function decompressXz(data: Uint8Array): Promise<Uint8Array> {
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
