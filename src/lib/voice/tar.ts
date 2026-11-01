// Küçük, kopyasız tar okuyucu: arşivdeki dosyaları Blob.slice ile verir.
// Ses paketi (Whisper ONNX dosyaları) tek bir .tar olarak saklanır; böylece paket
// sistemi (indirme, içe aktarma, bilgi noktası sunucusu) tek dosyayla çalışır.
// Desteklenen biçimler: ustar (prefix alanı), GNU uzun ad ('L'), pax ('x', path=).
// Windows 10+ tar.exe, GNU tar ve bsdtar çıktıları bu biçimlerdedir.

export interface TarEntry {
  path: string;
  size: number;
  /** Arşivdeki veri başlangıcı (bayt) */
  offset: number;
}

const BLOCK = 512;

function readStr(b: Uint8Array, off: number, len: number): string {
  let end = off;
  while (end < off + len && b[end] !== 0) end++;
  return new TextDecoder().decode(b.subarray(off, end));
}

function readOctal(b: Uint8Array, off: number, len: number): number {
  // GNU tar büyük dosyalarda ikili (base-256) kodlama kullanabilir
  if (b[off] & 0x80) {
    let v = 0;
    for (let i = off + 1; i < off + len; i++) v = v * 256 + b[i];
    return v;
  }
  const s = readStr(b, off, len).trim();
  return s ? parseInt(s, 8) : 0;
}

function isZeroBlock(b: Uint8Array): boolean {
  for (let i = 0; i < b.length; i++) if (b[i] !== 0) return false;
  return true;
}

function checksumOk(h: Uint8Array): boolean {
  const stored = readOctal(h, 148, 8);
  let sum = 0;
  for (let i = 0; i < BLOCK; i++) sum += i >= 148 && i < 156 ? 32 : h[i];
  return sum === stored;
}

/** "./onnx/x.onnx" → "onnx/x.onnx"; Windows ayırıcıları düzeltilir. */
export function normalizeTarPath(p: string): string {
  return p.replace(/\\/g, '/').replace(/^(\.\/)+/, '').replace(/^\/+/, '');
}

function parsePax(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  let i = 0;
  while (i < text.length) {
    const sp = text.indexOf(' ', i);
    if (sp < 0) break;
    const len = parseInt(text.slice(i, sp), 10);
    if (!(len > 0)) break;
    const rec = text.slice(sp + 1, i + len - 1);
    const eq = rec.indexOf('=');
    if (eq > 0) out[rec.slice(0, eq)] = rec.slice(eq + 1);
    i += len;
  }
  return out;
}

/** Arşiv dizinini çıkarır (yalnızca başlık blokları okunur). Dizin girdileri atlanır. */
export async function listTar(blob: Blob): Promise<TarEntry[]> {
  const out: TarEntry[] = [];
  let off = 0;
  let longName: string | null = null;
  let paxPath: string | null = null;
  while (off + BLOCK <= blob.size) {
    const h = new Uint8Array(await blob.slice(off, off + BLOCK).arrayBuffer());
    if (isZeroBlock(h)) break;
    if (!checksumOk(h)) throw new Error('Bozuk tar başlığı (bayt ' + off + ')');
    const size = readOctal(h, 124, 12);
    const type = String.fromCharCode(h[156] || 48);
    const dataOff = off + BLOCK;
    const next = dataOff + Math.ceil(size / BLOCK) * BLOCK;
    if (type === 'L') {
      longName = readStr(new Uint8Array(await blob.slice(dataOff, dataOff + size).arrayBuffer()), 0, size);
    } else if (type === 'x') {
      const pax = parsePax(new TextDecoder().decode(await blob.slice(dataOff, dataOff + size).arrayBuffer()));
      if (pax.path) paxPath = pax.path;
    } else if (type === 'g') {
      /* genel pax başlığı: yok say */
    } else {
      const magic = readStr(h, 257, 6);
      const prefix = magic.startsWith('ustar') ? readStr(h, 345, 155) : '';
      const name = paxPath ?? longName ?? (prefix ? prefix + '/' : '') + readStr(h, 0, 100);
      longName = null;
      paxPath = null;
      if (type === '0' || type === '\0' || type === '7') {
        const path = normalizeTarPath(name);
        if (path && !path.endsWith('/')) out.push({ path, size, offset: dataOff });
      }
    }
    off = next;
  }
  return out;
}

/** path → Blob eşlemesi (kopyasız dilimler). Aynı ad birden çok kez varsa sonuncusu geçerli. */
export async function readTarFiles(blob: Blob): Promise<Map<string, Blob>> {
  const m = new Map<string, Blob>();
  for (const e of await listTar(blob)) m.set(e.path, blob.slice(e.offset, e.offset + e.size));
  return m;
}

/** Test ve araçlar için: basit ustar arşivi üretir. */
export function makeTar(files: { path: string; data: Uint8Array | string }[]): Uint8Array<ArrayBuffer> {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  for (const f of files) {
    const data = typeof f.data === 'string' ? enc.encode(f.data) : f.data;
    const h = new Uint8Array(BLOCK);
    const name = enc.encode(f.path);
    if (name.length > 100) throw new Error('makeTar: ad çok uzun');
    h.set(name, 0);
    const oct = (v: number, len: number) => enc.encode(v.toString(8).padStart(len - 1, '0') + '\0');
    h.set(oct(0o644, 8), 100);
    h.set(oct(0, 8), 108);
    h.set(oct(0, 8), 116);
    h.set(oct(data.length, 12), 124);
    h.set(oct(0, 12), 136);
    h[156] = 48; // '0'
    h.set(enc.encode('ustar\0'), 257);
    h.set(enc.encode('00'), 263);
    for (let i = 148; i < 156; i++) h[i] = 32;
    let sum = 0;
    for (let i = 0; i < BLOCK; i++) sum += h[i];
    h.set(enc.encode(sum.toString(8).padStart(6, '0') + '\0 '), 148);
    chunks.push(h, data);
    const pad = (BLOCK - (data.length % BLOCK)) % BLOCK;
    if (pad) chunks.push(new Uint8Array(pad));
  }
  chunks.push(new Uint8Array(BLOCK * 2));
  const total = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}
