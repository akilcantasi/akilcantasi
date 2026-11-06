// PMTiles v3 dizinini doğrudan okur: bir yakınlaştırma düzeyindeki TÜM karoların
// yerini (konum + uzunluk) listeler. Yer adı dizini, karoları tek tek getZxy ile
// istemek yerine bunları dosyadaki sırayla, büyük parçalar hâlinde okur (bilgi
// noktası sunucusunda binlerce küçük HTTP isteği yerine birkaç yüz istek).
// Biçim: https://github.com/protomaps/PMTiles/blob/main/spec/v3/spec.md
import { gunzipSync } from 'fflate';
import { bytesToHeader, tileIdToZxy, zxyToTileId, type Header } from 'pmtiles';
import type { RandomAccessSource } from '../source';

export interface DizinGirdisi {
  tileId: number;
  offset: number;
  length: number;
  runLength: number;
}

export interface KaroYeri {
  z: number;
  x: number;
  y: number;
  /** Karo verisinin dosyadaki mutlak konumu */
  offset: number;
  length: number;
}

function varint(buf: Uint8Array, p: { pos: number }): number {
  let r = 0, s = 1, b: number;
  do {
    // Bozuk dosya: tampon biterse sonsuz döngü / NaN yerine hata
    if (p.pos >= buf.length) throw new Error('PMTiles dizini bozuk (beklenmedik son)');
    b = buf[p.pos++];
    r += (b & 0x7f) * s;
    s *= 128;
    if (s > 2 ** 63) throw new Error('PMTiles dizini bozuk (çok uzun sayı)');
  } while (b & 0x80);
  return r;
}

/** Sıkıştırması açılmış dizin baytlarını girdilere çevirir (pmtiles deserializeIndex ile aynı) */
export function dizinCoz(buf: Uint8Array): DizinGirdisi[] {
  const p = { pos: 0 };
  const n = varint(buf, p);
  // Her girdi en az 4 bayt tutar: dosyanın söylediği sayıya körü körüne bellek ayrılmaz
  if (n > buf.length) throw new Error('PMTiles dizini bozuk (girdi sayısı)');
  const out: DizinGirdisi[] = [];
  let last = 0;
  for (let i = 0; i < n; i++) {
    last += varint(buf, p);
    out.push({ tileId: last, offset: 0, length: 0, runLength: 1 });
  }
  for (let i = 0; i < n; i++) out[i].runLength = varint(buf, p);
  for (let i = 0; i < n; i++) out[i].length = varint(buf, p);
  for (let i = 0; i < n; i++) {
    const v = varint(buf, p);
    out[i].offset = v === 0 && i > 0 ? out[i - 1].offset + out[i - 1].length : v - 1;
  }
  return out;
}

export function acGzip(u8: Uint8Array, compression: number): Uint8Array {
  if (compression === 0 || compression === 1) return u8;
  if (compression === 2) return gunzipSync(u8);
  throw new Error('Desteklenmeyen sıkıştırma: ' + compression);
}

export async function basligiOku(src: RandomAccessSource): Promise<{ header: Header; root: DizinGirdisi[] }> {
  const head = await src.read(0, Math.min(16384, src.size));
  if (head[0] !== 0x50 || head[1] !== 0x4d) throw new Error('PMTiles dosyası değil');
  const ab = head.slice(0, 127).buffer as ArrayBuffer;
  const header = bytesToHeader(ab);
  const rootRaw =
    header.rootDirectoryOffset + header.rootDirectoryLength <= head.length
      ? head.subarray(header.rootDirectoryOffset, header.rootDirectoryOffset + header.rootDirectoryLength)
      : await src.read(header.rootDirectoryOffset, header.rootDirectoryLength);
  return { header, root: dizinCoz(acGzip(rootRaw, header.internalCompression)) };
}

/**
 * `z` düzeyindeki karoların dosyadaki yerleri, dosya sırasına göre. Aynı içerik
 * (tekrarlanan deniz karosu gibi) birden çok karoya denk gelebilir: her karo ayrı listelenir.
 * `bbox` verilirse yalnızca o kutuyla kesişen karolar.
 */
export async function karolariListele(
  src: RandomAccessSource,
  header: Header,
  root: DizinGirdisi[],
  z: number,
  bbox?: [number, number, number, number],
): Promise<KaroYeri[]> {
  const lo = zxyToTileId(z, 0, 0);
  const hi = z >= 26 ? Number.MAX_SAFE_INTEGER : zxyToTileId(z + 1, 0, 0);
  const out: KaroYeri[] = [];
  let xr: [number, number] | null = null;
  let yr: [number, number] | null = null;
  if (bbox) {
    const n = 2 ** z;
    const tx = (lon: number) => Math.max(0, Math.min(n - 1, Math.floor(((lon + 180) / 360) * n)));
    const ty = (lat: number) => {
      const r = (Math.max(-85, Math.min(85, lat)) * Math.PI) / 180;
      return Math.max(0, Math.min(n - 1, Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n)));
    };
    xr = [tx(bbox[0]), tx(bbox[2])];
    yr = [ty(bbox[3]), ty(bbox[1])];
  }
  const push = (id: number, offset: number, length: number) => {
    const [zz, x, y] = tileIdToZxy(id);
    if (zz !== z) return;
    if (xr && (x < xr[0] || x > xr[1])) return;
    if (yr && (y < yr[0] || y > yr[1])) return;
    out.push({ z, x, y, offset: header.tileDataOffset + offset, length });
  };
  const walk = async (dir: DizinGirdisi[], depth: number) => {
    for (let i = 0; i < dir.length; i++) {
      const e = dir[i];
      if (e.runLength > 0) {
        const end = e.tileId + e.runLength;
        if (end <= lo || e.tileId >= hi) continue;
        for (let id = Math.max(lo, e.tileId); id < Math.min(hi, end); id++) push(id, e.offset, e.length);
      } else {
        // Yaprak dizin: bir sonraki girdinin kimliğine kadar olan karoları kapsar
        const next = i + 1 < dir.length ? dir[i + 1].tileId : Number.MAX_SAFE_INTEGER;
        if (next <= lo || e.tileId >= hi) continue;
        if (depth >= 3) throw new Error('PMTiles dizini çok derin');
        const raw = await src.read(header.leafDirectoryOffset + e.offset, e.length);
        await walk(dizinCoz(acGzip(raw, header.internalCompression)), depth + 1);
      }
    }
  };
  await walk(root, 0);
  out.sort((a, b) => a.offset - b.offset || a.x - b.x || a.y - b.y);
  return out;
}

/** Dosyada art arda duran karoları en çok `maxBytes` büyüklüğünde okuma gruplarına ayırır */
export function okumaGruplari(list: KaroYeri[], maxBytes = 2 * 1024 * 1024, maxGap = 64 * 1024): KaroYeri[][] {
  const groups: KaroYeri[][] = [];
  let cur: KaroYeri[] = [];
  let start = 0, end = 0;
  for (const k of list) {
    if (cur.length && (k.offset > end + maxGap || Math.max(end, k.offset + k.length) - start > maxBytes)) {
      groups.push(cur);
      cur = [];
    }
    if (!cur.length) {
      start = k.offset;
      end = k.offset + k.length;
    } else end = Math.max(end, k.offset + k.length);
    cur.push(k);
  }
  if (cur.length) groups.push(cur);
  return groups;
}
