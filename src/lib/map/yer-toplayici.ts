// Yer adı dizininin hem işçide (yer-dizini.worker.ts) hem ana iş parçacığında
// (yer-dizini.ts) kullanılan parçaları: karodan yer toplama, saklama biçimi, OPFS
// önbelleği ve iş parçacıkları arasında kopyasız aktarım için sütunlu paket.
// İşçi oluşturma kodu burada durmaz ki işçi paketi kendini yeniden içermesin.
import { readLayerPoints, tilePointToLonLat } from './mvt';
import { acGzip, type KaroYeri } from './pmtiles-dizin';
import { placeAdi, placeTuru, sadelestir, type Yer, type YerTur } from './yer-arama';

/** Dizin biçimi ya da çıkarma kuralları değişince artırılır: eski önbellek yeniden kurulur */
export const DIZIN_SURUMU = 1;

const ISTENEN = new Set(['name', 'name:tr', 'kind', 'kind_detail']);

/** Karo baytlarından yer toplayan saf sınıf */
export class YerToplayici {
  yerler: Yer[] = [];
  private gorulen = new Set<string>();

  /** Sıkıştırması açılmış tek bir MVT karosu */
  karo(z: number, x: number, y: number, mvt: Uint8Array) {
    const L = readLayerPoints(mvt, 'places', ISTENEN);
    if (!L) return;
    for (const p of L.points) {
      // Karo kenarındaki tampon bölgede komşu karonun öğeleri de durur: yalnız kendi alanı
      if (p.x < 0 || p.y < 0 || p.x >= L.extent || p.y >= L.extent) continue;
      const tur = placeTuru(p.props);
      const ad = tur && placeAdi(p.props);
      if (!tur || !ad) continue;
      const [lon, lat] = tilePointToLonLat(z, x, y, p.x, p.y, L.extent);
      const k = `${tur}|${ad}|${Math.round(lat * 1000)}|${Math.round(lon * 1000)}`;
      if (this.gorulen.has(k)) continue;
      this.gorulen.add(k);
      this.yerler.push({ ad, tur, lat: Math.round(lat * 1e5) / 1e5, lon: Math.round(lon * 1e5) / 1e5 });
    }
  }

  /** Okunan bir parça: `basla` dosyadaki konumu; karolar bu parçanın içinde */
  grup(buf: Uint8Array, basla: number, karolar: KaroYeri[], sikistirma: number) {
    const acilan = new Map<number, Uint8Array | null>();
    for (const k of karolar) {
      // Aynı içerik (tekrarlanan karo) bir kez açılır
      let u = acilan.get(k.offset);
      if (u === undefined) {
        try {
          u = acGzip(buf.subarray(k.offset - basla, k.offset - basla + k.length), sikistirma);
        } catch {
          u = null; // bozuk karo: dizin yine de kurulur
        }
        acilan.set(k.offset, u);
      }
      if (u) {
        try {
          this.karo(k.z, k.x, k.y, u);
        } catch {}
      }
    }
  }
}

// ---------- Saklama biçimi (OPFS'te JSON) ----------

const TUR_KOD: YerTur[] = ['il', 'ilce', 'mahalle', 'koy', 'mezra', 'yer'];
type Kayit = [string, number, number, number, string?];
export interface DizinDosyasi {
  v: number;
  anahtar: string;
  yerler: Kayit[];
}

export function dizinYaz(anahtar: string, yerler: Yer[]): DizinDosyasi {
  return {
    v: DIZIN_SURUMU,
    anahtar,
    yerler: yerler.map((y) => {
      const r: Kayit = [y.ad, TUR_KOD.indexOf(y.tur), Math.round(y.lat * 1e5), Math.round(y.lon * 1e5)];
      if (y.ust) r.push(y.ust);
      return r;
    }),
  };
}

export function dizinOku(d: unknown, anahtar: string): Yer[] | null {
  const f = d as DizinDosyasi;
  if (!f || f.v !== DIZIN_SURUMU || f.anahtar !== anahtar || !Array.isArray(f.yerler)) return null;
  const out: Yer[] = [];
  for (const r of f.yerler) {
    if (!Array.isArray(r) || typeof r[0] !== 'string' || !TUR_KOD[r[1]]) continue;
    const y: Yer = { ad: r[0], tur: TUR_KOD[r[1]], lat: r[2] / 1e5, lon: r[3] / 1e5 };
    if (typeof r[4] === 'string') y.ust = r[4];
    out.push(y);
  }
  return out;
}

// ---------- Aramaya hazır dizin + iş parçacıkları arası paket ----------

/** Yerler ve sadeleştirilmiş adları (80 bin adın sadeleştirilmesi ana iş parçacığında yapılmasın) */
export interface HazirDizin {
  yerler: Yer[];
  adlar: string[];
}

export function hazirla(yerler: Yer[]): HazirDizin {
  return { yerler, adlar: yerler.map((y) => sadelestir(y.ad)) };
}

/** Sütunlu biçim: binlerce küçük nesne yerine birkaç dizi; tamponlar kopyasız aktarılır */
export interface Paket {
  ad: string;
  sade: string;
  ust: string;
  tur: Uint8Array;
  lat: Int32Array;
  lon: Int32Array;
}

const AYIRAC = '\n';

export function paketle(d: HazirDizin): Paket {
  const n = d.yerler.length;
  const tur = new Uint8Array(n), lat = new Int32Array(n), lon = new Int32Array(n);
  d.yerler.forEach((y, i) => {
    tur[i] = TUR_KOD.indexOf(y.tur);
    lat[i] = Math.round(y.lat * 1e5);
    lon[i] = Math.round(y.lon * 1e5);
  });
  const temiz = (s: string) => s.replace(/\n/g, ' ');
  return {
    ad: d.yerler.map((y) => temiz(y.ad)).join(AYIRAC),
    sade: d.adlar.join(AYIRAC),
    ust: d.yerler.map((y) => temiz(y.ust ?? '')).join(AYIRAC),
    tur,
    lat,
    lon,
  };
}

export function paketAc(p: Paket): HazirDizin {
  const n = p.tur.length;
  if (!n) return { yerler: [], adlar: [] };
  const ad = p.ad.split(AYIRAC), ust = p.ust.split(AYIRAC), adlar = p.sade.split(AYIRAC);
  const yerler: Yer[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const y: Yer = { ad: ad[i], tur: TUR_KOD[p.tur[i]], lat: p.lat[i] / 1e5, lon: p.lon[i] / 1e5 };
    if (ust[i]) y.ust = ust[i];
    yerler[i] = y;
  }
  return { yerler, adlar };
}

export const paketTamponlari = (p: Paket): ArrayBuffer[] => [p.tur.buffer, p.lat.buffer, p.lon.buffer] as ArrayBuffer[];

// ---------- OPFS önbelleği (işçide ve ana iş parçacığında çalışır) ----------

const OPFS_KLASOR = 'yer-dizini';

/** Dosya adı için kısa özet (FNV-1a) */
export function ozet(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

async function klasor(): Promise<FileSystemDirectoryHandle | null> {
  try {
    if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) return null;
    const root = await navigator.storage.getDirectory();
    return await root.getDirectoryHandle(OPFS_KLASOR, { create: true });
  } catch {
    return null;
  }
}

export async function opfsOku(anahtar: string): Promise<Yer[] | null> {
  const d = await klasor();
  if (!d) return null;
  try {
    const f = await (await d.getFileHandle(ozet(anahtar) + '.json')).getFile();
    return dizinOku(JSON.parse(await f.text()), anahtar);
  } catch {
    return null;
  }
}

export async function opfsYaz(anahtar: string, yerler: Yer[]): Promise<void> {
  const d = await klasor();
  if (!d) return;
  const ad = ozet(anahtar) + '.json';
  try {
    const metin = new TextEncoder().encode(JSON.stringify(dizinYaz(anahtar, yerler)));
    const fh = await d.getFileHandle(ad, { create: true });
    const w = await (fh as any).createWritable?.().catch(() => null);
    if (w) {
      await w.write(metin);
      await w.close();
    } else if (typeof (fh as any).createSyncAccessHandle === 'function') {
      // Safari'de createWritable yok; işçide eşzamanlı erişimle yazılır
      const h = await (fh as any).createSyncAccessHandle();
      try {
        h.truncate(0);
        h.write(metin, { at: 0 });
        h.flush();
      } finally {
        h.close();
      }
    } else return;
    // Eski paketlerin dizinleri birikmesin
    for await (const [n] of (d as any).entries() as AsyncIterable<[string, unknown]>) {
      if (n !== ad) await d.removeEntry(n).catch(() => {});
    }
  } catch (e) {
    console.warn('[yer-dizini] önbelleğe yazılamadı', e);
  }
}

// ---------- İşçi mesajları ----------

export type IsciGiden =
  | { t: 'yukle'; id: number; anahtar: string }
  | { t: 'grup'; id: number; buf: Uint8Array; basla: number; karolar: KaroYeri[]; s: number }
  | { t: 'bitir'; id: number; sinir: [number, number, number, number] | null; anahtar: string | null };
export type IsciGelen = { t: 'tamam'; id: number; paket?: Paket | null } | { t: 'hata'; id: number; mesaj: string };
