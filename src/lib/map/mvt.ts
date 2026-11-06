// Küçük Mapbox Vector Tile (MVT) okuyucusu: yalnızca istenen katmanın NOKTA
// geometrili öğelerini ve özelliklerini çözer. Yer adı dizini için yeterlidir;
// diğer katmanlar (bina, yol…) çözülmeden atlanır. Bağımlılıksızdır ki hem
// tarayıcıda (işçi/ana iş parçacığı) hem Node'da (testler) aynı kod çalışsın.
// Biçim: https://github.com/mapbox/vector-tile-spec (2.1)

export interface MvtPoint {
  /** Karo içi koordinat, 0..extent */
  x: number;
  y: number;
  props: Record<string, string | number | boolean>;
}

export interface MvtLayerPoints {
  extent: number;
  points: MvtPoint[];
}

class Reader {
  pos = 0;
  buf: Uint8Array;
  end: number;
  constructor(buf: Uint8Array, end = buf.length) {
    this.buf = buf;
    this.end = end;
  }
  varint(): number {
    // 2^53'e kadar güvenli; özellik değerleri ve uzunluklar için yeterli
    let r = 0, s = 1, b: number;
    do {
      if (this.pos >= this.end) throw new Error('MVT: beklenmeyen son');
      b = this.buf[this.pos++];
      r += (b & 0x7f) * s;
      s *= 128;
    } while (b & 0x80);
    return r;
  }
  svarint(): number {
    const n = this.varint();
    return n % 2 === 1 ? (n + 1) / -2 : n / 2;
  }
  skip(wire: number) {
    if (wire === 0) this.varint();
    else if (wire === 1) this.pos += 8;
    else if (wire === 2) this.pos += this.varint();
    else if (wire === 5) this.pos += 4;
    else throw new Error('MVT: bilinmeyen alan türü ' + wire);
  }
  bytes(): [number, number] {
    const len = this.varint();
    const s = this.pos;
    this.pos += len;
    return [s, this.pos];
  }
}

const dec = new TextDecoder();

function readValue(r: Reader, end: number): string | number | boolean | null {
  let v: string | number | boolean | null = null;
  while (r.pos < end) {
    const tag = r.varint();
    const f = tag >> 3, w = tag & 7;
    if (f === 1 && w === 2) {
      const [s, e] = r.bytes();
      v = dec.decode(r.buf.subarray(s, e));
    } else if (f === 2 && w === 5) {
      v = new DataView(r.buf.buffer, r.buf.byteOffset + r.pos, 4).getFloat32(0, true);
      r.pos += 4;
    } else if (f === 3 && w === 1) {
      v = new DataView(r.buf.buffer, r.buf.byteOffset + r.pos, 8).getFloat64(0, true);
      r.pos += 8;
    } else if ((f === 4 || f === 5) && w === 0) v = r.varint();
    else if (f === 6 && w === 0) v = r.svarint();
    else if (f === 7 && w === 0) v = r.varint() !== 0;
    else r.skip(w);
  }
  return v;
}

/**
 * Sıkıştırılmamış MVT baytlarından `layerName` katmanındaki nokta öğelerini döndürür.
 * Katman yoksa null. `want` verilirse yalnızca o anahtarlar özelliklere yazılır (bellek).
 */
export function readLayerPoints(buf: Uint8Array, layerName: string, want?: Set<string>): MvtLayerPoints | null {
  const r = new Reader(buf);
  while (r.pos < r.end) {
    const tag = r.varint();
    if (tag >> 3 !== 3 || (tag & 7) !== 2) {
      r.skip(tag & 7);
      continue;
    }
    const [ls, le] = r.bytes();
    // Önce katman adı: istenen katman değilse geri kalanını hiç çözmeden geç
    const lr = new Reader(buf, le);
    lr.pos = ls;
    let name: string | null = null;
    let extent = 4096;
    const keys: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    const feats: [number, number][] = [];
    while (lr.pos < le) {
      const t = lr.varint();
      const f = t >> 3, w = t & 7;
      if (f === 1 && w === 2) {
        const [s, e] = lr.bytes();
        name = dec.decode(buf.subarray(s, e));
        if (name !== layerName) break;
      } else if (f === 2 && w === 2) feats.push(lr.bytes());
      else if (f === 3 && w === 2) {
        const [s, e] = lr.bytes();
        keys.push(dec.decode(buf.subarray(s, e)));
      } else if (f === 4 && w === 2) {
        const [s, e] = lr.bytes();
        const vr = new Reader(buf, e);
        vr.pos = s;
        values.push(readValue(vr, e));
      } else if (f === 5 && w === 0) extent = lr.varint();
      else lr.skip(w);
    }
    if (name !== layerName) continue;
    // Bozuk katman: extent 0 (ya da saçma) koordinatları NaN/sonsuz yapar
    if (!(extent > 0) || !Number.isFinite(extent)) return null;
    const points: MvtPoint[] = [];
    for (const [fs, fe] of feats) {
      const fr = new Reader(buf, fe);
      fr.pos = fs;
      let type = 0;
      let tags: [number, number] | null = null;
      let geom: [number, number] | null = null;
      while (fr.pos < fe) {
        const t = fr.varint();
        const f = t >> 3, w = t & 7;
        if (f === 2 && w === 2) tags = fr.bytes();
        else if (f === 3 && w === 0) type = fr.varint();
        else if (f === 4 && w === 2) geom = fr.bytes();
        else fr.skip(w);
      }
      if (type !== 1 || !geom) continue; // yalnızca POINT
      const gr = new Reader(buf, geom[1]);
      gr.pos = geom[0];
      const cmd = gr.varint();
      if ((cmd & 7) !== 1 || cmd >> 3 < 1) continue; // MoveTo
      const x = gr.svarint();
      const y = gr.svarint();
      const props: Record<string, string | number | boolean> = {};
      if (tags) {
        const tr = new Reader(buf, tags[1]);
        tr.pos = tags[0];
        while (tr.pos < tr.end) {
          const k = keys[tr.varint()];
          const v = values[tr.varint()];
          if (k === undefined || v === null || v === undefined) continue;
          if (want && !want.has(k)) continue;
          props[k] = v;
        }
      }
      points.push({ x, y, props });
    }
    return { extent, points };
  }
  return null;
}

/** Karo içi noktayı coğrafi koordinata çevirir (Web Mercator, XYZ şeması) */
export function tilePointToLonLat(z: number, x: number, y: number, px: number, py: number, extent: number): [number, number] {
  const n = 2 ** z;
  const lon = ((x + px / extent) / n) * 360 - 180;
  const yy = (y + py / extent) / n;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - 2 * yy))) * 180) / Math.PI;
  return [lon, lat];
}
