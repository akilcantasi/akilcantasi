// Yer adı dizini: harita paketinin (PMTiles) "places" katmanından il, ilçe, mahalle,
// köy adlarını cihazda bir kez çıkarır ve OPFS'e saklar (paket kimliği + boyutu anahtarlı).
//
// Nasıl: z12 (paket daha az ayrıntılıysa en büyük yakınlaştırması) karoları dosya sırasıyla
// ~2 MB'lık parçalar hâlinde okunur; açma, çözme, ad sadeleştirme ve önbellek okuma/yazma bir
// Web Worker'da yapılır, arayüz donmaz. Türkiye paketinde z12, z13–14'teki yer adlarının
// ~%97'sini (z10'dakilerin hepsini) içerir. İşçi açılamazsa aynı iş ana iş parçacığında
// küçük parçalarla, aralarda nefes alarak yapılır.
import type { RandomAccessSource } from '../source';
import { basligiOku, karolariListele, okumaGruplari, type KaroYeri } from './pmtiles-dizin';
import { yerleriTamamla } from './yer-arama';
import {
  DIZIN_SURUMU,
  YerToplayici,
  hazirla,
  opfsOku,
  opfsYaz,
  paketAc,
  type HazirDizin,
  type IsciGelen,
  type IsciGiden,
  type Paket,
} from './yer-toplayici';

export { DIZIN_SURUMU, YerToplayici, dizinOku, dizinYaz, type HazirDizin } from './yer-toplayici';

/** Yer adlarının okunduğu en büyük yakınlaştırma */
export const DIZIN_ZOOM = 12;

type Sinir = [number, number, number, number] | null;

export interface Cozucu {
  /** Önbellekteki dizin (yoksa null) */
  yukle(anahtar: string): Promise<HazirDizin | null>;
  grup(buf: Uint8Array, basla: number, karolar: KaroYeri[], sikistirma: number): Promise<void>;
  /** Toplananları tamamlar; `anahtar` verilirse önbelleğe yazar */
  bitir(sinir: Sinir, anahtar: string | null): Promise<HazirDizin>;
  kapat(): void;
}

/** Ana iş parçacığında çözen (testler; işçi açılamayan tarayıcılar) */
export function yerelCozucu(): Cozucu {
  let t = new YerToplayici();
  return {
    async yukle(anahtar) {
      const y = await opfsOku(anahtar);
      return y ? hazirla(y) : null;
    },
    async grup(buf, basla, karolar, s) {
      t.grup(buf, basla, karolar, s);
    },
    async bitir(sinir, anahtar) {
      const yerler = yerleriTamamla(t.yerler, sinir);
      t = new YerToplayici();
      if (anahtar) void opfsYaz(anahtar, yerler);
      return hazirla(yerler);
    },
    kapat() {},
  };
}

export interface KurmaSecenek {
  cozucu?: Cozucu;
  /** 0..1 */
  ilerleme?: (oran: number) => void;
  iptal?: () => boolean;
  /** Bir okuma parçasının en büyük boyutu (bayt) */
  parca?: number;
  /** Parçalar arasında olay döngüsüne nefes (ana iş parçacığında çözülürken) */
  nefes?: () => Promise<void>;
  /** Verilirse sonuç bu anahtarla önbelleğe yazılır */
  anahtar?: string;
}

export class IptalEdildi extends Error {
  constructor() {
    super('Yer adı dizini iptal edildi');
  }
}

/** Harita paketinden yer dizinini çıkarır (önbelleğe bakmaz) */
export async function dizinKur(src: RandomAccessSource, o: KurmaSecenek = {}): Promise<HazirDizin> {
  const coz = o.cozucu ?? yerelCozucu();
  const anahtar = o.anahtar ?? null;
  const { header, root } = await basligiOku(src);
  const sinir: Sinir = header.minLon < header.maxLon && header.minLat < header.maxLat ? [header.minLon, header.minLat, header.maxLon, header.maxLat] : null;
  if (header.tileType !== 1) return coz.bitir(sinir, anahtar); // vektör değil (raster): yalnız il listesi
  const z = Math.max(header.minZoom, Math.min(header.maxZoom, DIZIN_ZOOM));
  const liste = await karolariListele(src, header, root, z);
  const gruplar = okumaGruplari(liste, o.parca ?? 2 * 1024 * 1024);
  const toplam = liste.reduce((s, k) => s + k.length, 0) || 1;
  let biten = 0;
  o.ilerleme?.(0);
  // Okuma ile çözme üst üste: bir parça çözülürken sonraki okunur
  let bekleyen: Promise<void> | null = null;
  for (const g of gruplar) {
    if (o.iptal?.()) throw new IptalEdildi();
    const basla = g[0].offset;
    const son = g.reduce((m, k) => Math.max(m, k.offset + k.length), 0);
    const buf = await src.read(basla, son - basla);
    if (bekleyen) await bekleyen;
    const boy = g.reduce((s, k) => s + k.length, 0);
    bekleyen = coz.grup(buf, basla, g, header.tileCompression).then(() => {
      biten += boy;
      o.ilerleme?.(Math.min(0.99, biten / toplam));
    });
    if (o.nefes) await o.nefes();
  }
  if (bekleyen) await bekleyen;
  if (o.iptal?.()) throw new IptalEdildi();
  const d = await coz.bitir(sinir, anahtar);
  o.ilerleme?.(1);
  return d;
}

/** İşçi betiği yüklenemedi ya da çöktü: bu işçiye bir daha iş gönderilmez */
export class IsciOldu extends Error {
  constructor() {
    super('Yer adı işçisi çalışmadı');
  }
}

/** Web Worker'da çözen; açılamazsa null */
export function isciCozucu(): Cozucu | null {
  if (typeof Worker === 'undefined') return null;
  let w: Worker;
  try {
    w = new Worker(new URL('./yer-dizini.worker.ts', import.meta.url), { type: 'module' });
  } catch {
    return null;
  }
  let seq = 0;
  const bekleyen = new Map<number, { ok: (p?: Paket | null) => void; err: (e: Error) => void }>();
  w.onmessage = (ev: MessageEvent<IsciGelen>) => {
    const m = ev.data;
    const b = bekleyen.get(m.id);
    if (!b) return;
    bekleyen.delete(m.id);
    if (m.t === 'tamam') b.ok(m.paket);
    else b.err(new Error(m.mesaj));
  };
  let olu = false;
  w.onerror = (e) => {
    e.preventDefault?.();
    // Ölü işçiye gönderilen iş hiç yanıtlanmaz: bekleyenler ve sonrakiler hemen reddedilir
    olu = true;
    for (const b of bekleyen.values()) b.err(new IsciOldu());
    bekleyen.clear();
    try {
      w.terminate();
    } catch {}
  };
  const gonder = (m: IsciGiden, aktar?: Transferable[]) =>
    new Promise<Paket | null | undefined>((ok, err) => {
      if (olu) return err(new IsciOldu());
      bekleyen.set(m.id, { ok, err });
      try {
        w.postMessage(m, aktar ?? []);
      } catch (e) {
        bekleyen.delete(m.id);
        err(e instanceof Error ? e : new Error(String(e)));
      }
    });
  return {
    async yukle(anahtar) {
      const p = await gonder({ t: 'yukle', id: ++seq, anahtar });
      return p ? paketAc(p) : null;
    },
    async grup(buf, basla, karolar, s) {
      // Okunan tampon başka yerde kullanılmıyor: kopyasız aktarılır
      const own = buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength ? buf : buf.slice();
      await gonder({ t: 'grup', id: ++seq, buf: own, basla, karolar, s }, [own.buffer as ArrayBuffer]);
    },
    async bitir(sinir, anahtar) {
      const p = await gonder({ t: 'bitir', id: ++seq, sinir, anahtar });
      return p ? paketAc(p) : { yerler: [], adlar: [] };
    },
    kapat() {
      // Önbelleğe yazma bitsin diye biraz sonra
      setTimeout(() => w.terminate(), 30_000);
    },
  };
}

export function dizinAnahtari(src: RandomAccessSource): string {
  return `v${DIZIN_SURUMU}:${src.name}:${src.size}`;
}

// ---------- Paylaşılan durum (sekme kapanıp açılsa da kurma sürer, sonuç bellekte kalır) ----------

export type DizinDurum =
  | { durum: 'yok' }
  | { durum: 'hazirlaniyor'; oran: number }
  | { durum: 'hazir'; dizin: HazirDizin; sureMs?: number }
  | { durum: 'hata'; mesaj: string };

let aktif: { anahtar: string; durum: DizinDurum; iptal: boolean } | null = null;
const dinleyenler = new Set<(d: DizinDurum) => void>();

function bildir(anahtar: string, d: DizinDurum) {
  if (aktif?.anahtar !== anahtar) return;
  aktif.durum = d;
  for (const f of dinleyenler) f(d);
}

export function dizinDurumu(anahtar: string): DizinDurum {
  return aktif?.anahtar === anahtar ? aktif.durum : { durum: 'yok' };
}

export function dizinDinle(f: (d: DizinDurum) => void): () => void {
  dinleyenler.add(f);
  return () => {
    dinleyenler.delete(f);
  };
}

const nefes = () => new Promise<void>((r) => setTimeout(r, 0));

/**
 * Paketin dizinini hazırlar: bellekte varsa hemen, OPFS'te varsa okur, yoksa kurar ve saklar.
 * Aynı anahtar için ikinci çağrı yeni iş başlatmaz. Başka paket gelirse eski iş bırakılır.
 */
export function dizinHazirla(src: RandomAccessSource): DizinDurum {
  const anahtar = dizinAnahtari(src);
  if (aktif?.anahtar === anahtar && aktif.durum.durum !== 'hata') return aktif.durum;
  if (aktif) aktif.iptal = true;
  const is = { anahtar, durum: { durum: 'hazirlaniyor', oran: 0 } as DizinDurum, iptal: false };
  aktif = is;
  const t0 = Date.now();
  const calis = async (isci: Cozucu | null) => {
    const coz = isci ?? yerelCozucu();
    try {
      const kayitli = await coz.yukle(anahtar).catch((e) => {
        if (e instanceof IsciOldu) throw e;
        return null;
      });
      if (kayitli) {
        bildir(anahtar, { durum: 'hazir', dizin: kayitli });
        return;
      }
      const dizin = await dizinKur(src, {
        cozucu: coz,
        anahtar,
        // İşçi yoksa küçük parçalar: tek parça çözümü ana iş parçacığını uzun tutmasın
        parca: isci ? 2 * 1024 * 1024 : 256 * 1024,
        nefes: isci ? undefined : nefes,
        iptal: () => is.iptal,
        ilerleme: (oran) => !is.iptal && bildir(anahtar, { durum: 'hazirlaniyor', oran }),
      });
      const sureMs = Date.now() - t0;
      console.info(`[yer-dizini] ${dizin.yerler.length} yer adı, ${sureMs} ms${isci ? ' (işçide)' : ''}`);
      bildir(anahtar, { durum: 'hazir', dizin, sureMs });
    } finally {
      coz.kapat();
    }
  };
  (async () => {
    try {
      try {
        await calis(isciCozucuYap());
      } catch (e) {
        // İşçi betiği yüklenemedi (ör. bağlantı koptu) ya da çöktü: aynı işi ana iş parçacığında yap
        if (!(e instanceof IsciOldu) || is.iptal) throw e;
        console.warn('[yer-dizini] işçi çalışmadı; ana iş parçacığında kuruluyor');
        await calis(null);
      }
    } catch (e) {
      if (e instanceof IptalEdildi) return;
      console.warn('[yer-dizini]', e);
      bildir(anahtar, { durum: 'hata', mesaj: e instanceof Error ? e.message : String(e) });
    }
  })();
  return is.durum;
}

/** Sınama kancası: işçi üreticisi (testlerde ölü işçi taklidi için değiştirilebilir) */
let isciCozucuYap: () => Cozucu | null = isciCozucu;
export function isciUreticisiKoy(f: (() => Cozucu | null) | null) {
  isciCozucuYap = f ?? isciCozucu;
}
