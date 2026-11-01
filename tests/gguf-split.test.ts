import { describe, expect, it } from 'vitest';
import { planShards, readGgufLayout, splitGguf } from '../src/lib/fener/gguf-split';

// Küçük sahte GGUF: 2 KV (biri string dizi), 4 tensör, 32 bayt hizalı veri
function makeGguf(tensorSizes: number[]): { blob: Blob; data: Uint8Array } {
  const parts: number[] = [];
  const u32 = (x: number) => parts.push(x & 255, (x >> 8) & 255, (x >> 16) & 255, (x >>> 24) & 255);
  const u64 = (x: number) => {
    u32(x);
    u32(0);
  };
  const str = (s: string) => {
    const e = new TextEncoder().encode(s);
    u64(e.length);
    parts.push(...e);
  };
  u32(0x46554747);
  u32(3);
  u64(tensorSizes.length);
  u64(2);
  str('general.architecture');
  u32(8);
  str('llama');
  str('tokenizer.ggml.tokens');
  u32(9);
  u32(8);
  u64(3);
  str('a');
  str('bb');
  str('ccc');
  let off = 0;
  const offs: number[] = [];
  tensorSizes.forEach((sz, i) => {
    str('t' + i);
    u32(1);
    u64(sz);
    u32(0); // F32
    u64(off);
    offs.push(off);
    off += Math.ceil(sz / 32) * 32;
  });
  while (parts.length % 32) parts.push(0);
  const data = new Uint8Array(off);
  for (let i = 0; i < data.length; i++) data[i] = (i * 7 + 3) & 255;
  const head = new Uint8Array(parts);
  return { blob: new Blob([head, data]), data };
}

describe('gguf-split', () => {
  it('planShards sınırı aşınca yeni parça açar', () => {
    expect(planShards([0, 100, 200, 300], 400, 250)).toEqual([[0, 1], [2, 3]]);
    expect(planShards([0, 100], 200, 1000)).toEqual([[0, 1]]);
  });

  it('küçük dosyayı bölmez', async () => {
    const { blob } = makeGguf([64, 64]);
    const out = await splitGguf(blob, 10_000);
    expect(out).toHaveLength(1);
    expect(out[0]).toBe(blob);
  });

  it('parçalar geçerli GGUF; meta yalnız 1. parçada; veri birebir', async () => {
    const { blob, data } = makeGguf([96, 96, 96, 96]);
    const out = await splitGguf(blob, 200, 'm');
    expect(out.length).toBe(2);
    expect((out[0] as File).name).toBe('m-00001-of-00002.gguf');
    const l0 = await readGgufLayout(out[0]);
    const l1 = await readGgufLayout(out[1]);
    expect(l0.isSplit).toBe(true);
    expect(l0.kvs.map((k) => k.key)).toEqual(['general.architecture', 'tokenizer.ggml.tokens']);
    expect(l1.kvs).toHaveLength(0);
    expect(l0.tensors.map((t) => t.name)).toEqual(['t0', 't1']);
    expect(l1.tensors.map((t) => [t.name, t.offset])).toEqual([
      ['t2', 0],
      ['t3', 96],
    ]);
    // Parçaların veri bölümleri birleşince özgün veri
    const d0 = new Uint8Array(await out[0].slice(l0.dataStart).arrayBuffer());
    const d1 = new Uint8Array(await out[1].slice(l1.dataStart).arrayBuffer());
    const joined = new Uint8Array(d0.length + d1.length);
    joined.set(d0);
    joined.set(d1, d0.length);
    expect(joined).toEqual(data);
    expect(l0.dataStart % 32).toBe(0);
  });
});
