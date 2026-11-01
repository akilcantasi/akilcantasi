// Tek parça büyük GGUF dosyasını tarayıcıda, kopyalamadan parçalara böler.
//
// Tarayıcılar tek bir ArrayBuffer'a ~2 GB'tan büyük dosya alamaz; wllama bu yüzden
// büyük modelleri llama.cpp'nin gguf-split biçiminde parçalar olarak ister. Kullanıcı
// 2 GB üstü tek dosya indirdiyse (ör. Qwen2.5-3B Q4_K_M, 2,1 GB) bilgisayarda bölme
// aracı çalıştırmasına gerek kalmasın diye aynı biçimi burada üretiriz:
//
//  - Her parça kendi başına geçerli bir GGUF dosyasıdır.
//  - 1. parça tüm meta verileri (KV) taşır; diğerleri yalnızca split.* anahtarlarını.
//  - Her parçaya split.no (u16, 0'dan başlar), split.count (u16) ve
//    split.tensors.count (i32, toplam tensör) eklenir.
//  - Tensör bilgileri parçanın kendi veri bölümüne göre yeniden ofsetlenir.
//
// Veri baytları kopyalanmaz: her parça [yeni başlık, özgün dosyanın bir dilimi] Blob'udur.
// Kaynak: ggml/docs/gguf.md, llama.cpp tools/gguf-split/gguf-split.cpp

const GGUF_MAGIC = 0x46554747; // "GGUF" (küçük uçlu)
const DEFAULT_ALIGNMENT = 32;

/** wllama önerisi: 512 MB'lık parçalar hem bellek hem hız açısından iyi */
export const DEFAULT_SHARD_BYTES = 512 * 1024 * 1024;

// GGUF değer türleri
const T = { U8: 0, I8: 1, U16: 2, I16: 3, U32: 4, I32: 5, F32: 6, BOOL: 7, STRING: 8, ARRAY: 9, U64: 10, I64: 11, F64: 12 } as const;
const FIXED: Record<number, number> = { 0: 1, 1: 1, 2: 2, 3: 2, 4: 4, 5: 4, 6: 4, 7: 1, 10: 8, 11: 8, 12: 8 };

class NeedMore extends Error {}

class Reader {
  pos = 0;
  constructor(private v: DataView) {}
  need(n: number) {
    if (this.pos + n > this.v.byteLength) throw new NeedMore();
  }
  u32() {
    this.need(4);
    const x = this.v.getUint32(this.pos, true);
    this.pos += 4;
    return x;
  }
  u64() {
    this.need(8);
    const x = this.v.getBigUint64(this.pos, true);
    this.pos += 8;
    if (x > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('GGUF: değer çok büyük');
    return Number(x);
  }
  skip(n: number) {
    this.need(n);
    this.pos += n;
  }
  str(): string {
    const n = this.u64();
    this.need(n);
    const s = new TextDecoder().decode(new Uint8Array(this.v.buffer, this.v.byteOffset + this.pos, n));
    this.pos += n;
    return s;
  }
  skipStr() {
    this.skip(this.u64());
  }
  skipValue(type: number) {
    if (type in FIXED) return this.skip(FIXED[type]);
    if (type === T.STRING) return this.skipStr();
    if (type === T.ARRAY) {
      const et = this.u32();
      const n = this.u64();
      if (et in FIXED) return this.skip(FIXED[et] * n);
      for (let i = 0; i < n; i++) this.skipValue(et);
      return;
    }
    throw new Error('GGUF: bilinmeyen değer türü ' + type);
  }
}

export interface GgufLayout {
  version: number;
  alignment: number;
  /** Ham KV kayıtları (anahtar + tür + değer baytları), split.* hariç */
  kvs: { key: string; raw: Uint8Array }[];
  /** general.alignment KV'si (varsa) — her parçaya eklenir */
  alignmentKv: Uint8Array | null;
  tensors: { name: string; info: Uint8Array; offset: number }[];
  /** Veri bölümünün dosyadaki başlangıcı */
  dataStart: number;
  /** Dosya zaten bölünmüş bir parça mı */
  isSplit: boolean;
}

function parseLayout(buf: ArrayBuffer): GgufLayout {
  const v = new DataView(buf);
  const r = new Reader(v);
  const bytes = new Uint8Array(buf);
  if (r.u32() !== GGUF_MAGIC) throw new Error('GGUF dosyası değil');
  const version = r.u32();
  if (version < 2 || version > 3) throw new Error('Desteklenmeyen GGUF sürümü: ' + version);
  const nTensors = r.u64();
  const nKv = r.u64();
  const kvs: GgufLayout['kvs'] = [];
  let alignment = DEFAULT_ALIGNMENT;
  let alignmentKv: Uint8Array | null = null;
  let isSplit = false;
  for (let i = 0; i < nKv; i++) {
    const start = r.pos;
    const key = r.str();
    const type = r.u32();
    const valPos = r.pos;
    r.skipValue(type);
    const raw = bytes.slice(start, r.pos);
    if (key === 'general.alignment' && type === T.U32) {
      alignment = v.getUint32(valPos, true) || DEFAULT_ALIGNMENT;
      alignmentKv = raw;
    }
    if (key.startsWith('split.')) {
      isSplit = true;
      continue;
    }
    kvs.push({ key, raw });
  }
  const tensors: GgufLayout['tensors'] = [];
  for (let i = 0; i < nTensors; i++) {
    const start = r.pos;
    const name = r.str();
    const nd = r.u32();
    r.skip(8 * nd);
    r.skip(4); // tür
    const info = bytes.slice(start, r.pos);
    const offset = r.u64();
    tensors.push({ name, info, offset });
  }
  const dataStart = Math.ceil(r.pos / alignment) * alignment;
  return { version, alignment, kvs, alignmentKv, tensors, dataStart, isSplit };
}

/** Başlığı okur; tokenizer dizileri büyük olabildiği için gerekirse daha çok bayt okur. */
export async function readGgufLayout(file: Blob): Promise<GgufLayout> {
  let n = 16 * 1024 * 1024;
  for (;;) {
    const buf = await file.slice(0, Math.min(n, file.size)).arrayBuffer();
    try {
      return parseLayout(buf);
    } catch (e) {
      if (!(e instanceof NeedMore) || n >= file.size) throw e instanceof NeedMore ? new Error('GGUF başlığı eksik') : e;
      n *= 4;
    }
  }
}

// --- yazma yardımcıları ---
class Writer {
  parts: Uint8Array[] = [];
  len = 0;
  push(b: Uint8Array) {
    this.parts.push(b);
    this.len += b.length;
  }
  u32(x: number) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, x, true);
    this.push(b);
  }
  u64(x: number) {
    const b = new Uint8Array(8);
    new DataView(b.buffer).setBigUint64(0, BigInt(x), true);
    this.push(b);
  }
  str(s: string) {
    const e = new TextEncoder().encode(s);
    this.u64(e.length);
    this.push(e);
  }
  kvU16(key: string, x: number) {
    this.str(key);
    this.u32(T.U16);
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, x, true);
    this.push(b);
  }
  kvI32(key: string, x: number) {
    this.str(key);
    this.u32(T.I32);
    const b = new Uint8Array(4);
    new DataView(b.buffer).setInt32(0, x, true);
    this.push(b);
  }
  padTo(align: number) {
    const pad = (align - (this.len % align)) % align;
    if (pad) this.push(new Uint8Array(pad));
  }
  bytes(): Uint8Array {
    const out = new Uint8Array(this.len);
    let o = 0;
    for (const p of this.parts) {
      out.set(p, o);
      o += p.length;
    }
    return out;
  }
}

/** Tensörleri (ofset sırasıyla) en çok `maxBytes` veri taşıyan gruplara ayırır. */
export function planShards(offsets: number[], dataLen: number, maxBytes: number): number[][] {
  const order = offsets.map((o, i) => [o, i] as const).sort((a, b) => a[0] - b[0]);
  const groups: number[][] = [];
  let cur: number[] = [];
  let curStart = 0;
  for (let k = 0; k < order.length; k++) {
    const [off, idx] = order[k];
    const end = k + 1 < order.length ? order[k + 1][0] : dataLen;
    if (cur.length && end - curStart > maxBytes) {
      groups.push(cur);
      cur = [];
    }
    if (!cur.length) curStart = off;
    cur.push(idx);
  }
  if (cur.length) groups.push(cur);
  return groups;
}

/**
 * Tek GGUF dosyasını parçalara böler (Blob listesi, sıralı). Dosya zaten bir parçaysa
 * ya da `maxBytes`'tan küçükse olduğu gibi döner.
 */
export async function splitGguf(file: Blob, maxBytes = DEFAULT_SHARD_BYTES, baseName = 'model'): Promise<Blob[]> {
  if (file.size <= maxBytes) return [file];
  const L = await readGgufLayout(file);
  if (L.isSplit || !L.tensors.length) return [file];
  const dataLen = file.size - L.dataStart;
  const offs = L.tensors.map((t) => t.offset);
  const groups = planShards(offs, dataLen, maxBytes);
  if (groups.length < 2) return [file];
  const sorted = offs.map((o, i) => [o, i] as const).sort((a, b) => a[0] - b[0]);
  const nextOff = new Map<number, number>();
  sorted.forEach(([, i], k) => nextOff.set(i, k + 1 < sorted.length ? sorted[k + 1][0] : dataLen));

  const total = groups.length;
  const out: Blob[] = [];
  for (let s = 0; s < total; s++) {
    const g = groups[s];
    const first = L.tensors[g[0]].offset;
    const last = g[g.length - 1];
    const end = nextOff.get(last)!;
    const w = new Writer();
    w.u32(GGUF_MAGIC);
    w.u32(3);
    w.u64(g.length);
    const baseKvs = s === 0 ? L.kvs : L.alignmentKv ? [{ key: 'general.alignment', raw: L.alignmentKv }] : [];
    w.u64(baseKvs.length + 3);
    for (const kv of baseKvs) w.push(kv.raw);
    w.kvU16('split.no', s);
    w.kvU16('split.count', total);
    w.kvI32('split.tensors.count', L.tensors.length);
    for (const i of g) {
      w.push(L.tensors[i].info);
      w.u64(L.tensors[i].offset - first);
    }
    w.padTo(L.alignment);
    const header = w.bytes();
    const name = `${baseName}-${String(s + 1).padStart(5, '0')}-of-${String(total).padStart(5, '0')}.gguf`;
    const parts: BlobPart[] = [header as BlobPart, file.slice(L.dataStart + first, L.dataStart + end)];
    let b: Blob;
    try {
      b = new File(parts, name);
    } catch {
      b = new Blob(parts);
    }
    out.push(b);
  }
  return out;
}
