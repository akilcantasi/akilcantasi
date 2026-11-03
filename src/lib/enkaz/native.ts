// Android "AkilEnkaz" eklentisi (android/.../EnkazPlugin.java). Tarayıcıda, iPhone'da ve
// eski APK'larda available() false döner; arayüz buna göre açıklama gösterir.
import { native } from '../native';

export interface EnkazIzinler {
  konum: 'tam' | 'yaklasik' | 'yok';
  arkaPlanKonum: boolean;
  bluetooth: boolean;
  bluetoothVar: boolean;
  bluetoothAcik: boolean;
  bildirim: boolean;
  pilMuaf: boolean;
  sdk: number;
}

export interface KayitliKonum {
  lat: number;
  lon: number;
  dogruluk: number;
  zaman: number;
  kaynak: string;
}

export interface EnkazDurum {
  /** Servis çalışıyor */
  aktif: boolean;
  /** Kullanıcı açtı (servis yeniden başlıyor olabilir) */
  istenen: boolean;
  otomatik: boolean;
  etiket: string;
  kat: number;
  kimlik: number;
  baslangic: number;
  pil: number;
  sesAraligiSn: number;
  bluetoothAdi: boolean;
  gorunurBitis: number;
  /** "yayiliyor" | "izin-yok" | "bluetooth-kapali" | "bluetooth-yok" | "desteklenmiyor" | "hata-N" | "baslamadi" */
  reklam?: string;
  sonSes?: number;
  sesSayisi?: number;
  sesDuraklatBitis?: number;
  sonGps?: number;
  gpsDeneniyor?: boolean;
  sonKonum?: KayitliKonum;
  /** İşaret kodu ("AK-34ABCD"); SMS'e eklenir, kurtarıcı aramada bununla bulur */
  kod?: string;
  /** Kurtarıcılardan gelen mesajlar (en yeni başta) */
  mesajlar?: { no: number; kod: number; zaman: number; rssi: number }[];
  /** Enkazdaki kişinin son yanıtı */
  yanit?: { kod: number; zaman: number };
  /** Kurtarıcı mesajlarını dinliyor mu */
  mesajDinleme?: boolean;
  // durum() çağrısında ek alanlar
  izinler?: EnkazIzinler;
  nobet?: boolean;
  sarsinti?: boolean;
  konumKaydiModu?: KonumKaydiModu;
}

/** Duyulan bir enkaz işareti */
export interface Duyulan {
  kimlik: number;
  rssi: number;
  enkaz: boolean;
  otomatik: boolean;
  lat?: number;
  lon?: number;
  /** konumun yaşı (dk), -1 bilinmiyor */
  yasDk: number;
  pil: number;
  kat?: number;
  dogruluk: number;
  guc: number;
  etiket?: string;
  /** "AK-34ABCD" */
  kod?: string;
  /** Onaylanan son kurtarıcı mesajı numarası (0 yok) */
  onay?: number;
  /** Enkazdaki kişinin hazır yanıtı (0 yok) ve sayacı */
  yanit?: number;
  yanitSayac?: number;
  /** Arama modunda: duyulduğu an; depoda: ilk/son */
  zaman?: number;
  ilk?: number;
  son?: number;
  enIyiRssi?: number;
  sayi?: number;
  duyulanYer?: KayitliKonum;
}

export type KonumKaydiModu = 'kapali' | 'saatlik' | 'hareketli';

const KAT_YOK = -128;
export { KAT_YOK };

function plugin(): any {
  return typeof window !== 'undefined' ? (window as any).Capacitor?.Plugins?.AkilEnkaz : undefined;
}

async function call<T>(method: string, args?: unknown): Promise<T | null> {
  const p = plugin();
  if (!p || typeof p[method] !== 'function') return null;
  try {
    return (await p[method](args ?? {})) as T;
  } catch {
    return null;
  }
}

function listen<T>(ev: string, fn: (e: T) => void): () => void {
  const p = plugin();
  if (!p || typeof p.addListener !== 'function') return () => {};
  let h: any = null;
  let gone = false;
  Promise.resolve(p.addListener(ev, fn))
    .then((x) => {
      h = x;
      if (gone) h?.remove?.();
    })
    .catch(() => {});
  return () => {
    gone = true;
    h?.remove?.();
  };
}

export const nativeEnkaz = {
  available(): boolean {
    return native.isAndroid() && typeof plugin()?.baslat === 'function';
  },
  durum: () => call<EnkazDurum>('durum'),
  izinIste: () => call<{ izinler: EnkazIzinler }>('izinIste'),
  arkaPlanKonumIzni: () => call<{ izinler: EnkazIzinler }>('arkaPlanKonumIzni'),
  pilMuafiyeti: () => call<{ acildi: boolean }>('pilMuafiyeti'),
  bluetoothAc: () => call<{ izinler: EnkazIzinler }>('bluetoothAc'),
  baslat: (etiket: string, kat: number | null) => call<{ izinler: EnkazIzinler }>('baslat', kat == null ? { etiket } : { etiket, kat }),
  durdur: () => call('durdur'),
  sesCal: () => call('sesCal'),
  sesDuraklat: (dk: number) => call('sesDuraklat', { dk }),
  gorunurOl: (etiket: string) => call<{ sn: number; ad?: string; hata?: string }>('gorunurOl', { etiket }),
  hazirlik: (etiket: string, kat: number | null) => call('hazirlik', kat == null ? { etiket } : { etiket, kat }),
  yanitVer: (kod: number) => call('yanitVer', { kod }),
  mesajGonder: (hedef: number, kod: number) => call<{ no?: number; hata?: string }>('mesajGonder', { hedef, kod }),
  mesajDurdur: () => call('mesajDurdur'),
  aramaBaslat: () => call<{ basladi: boolean; hata?: string; izinler?: EnkazIzinler }>('aramaBaslat'),
  aramaDurdur: () => call('aramaDurdur'),
  duyulanlar: async () => (await call<{ liste: Duyulan[] }>('duyulanlar'))?.liste ?? [],
  duyulanlariTemizle: () => call('duyulanlariTemizle'),
  nobet: (ac: boolean) => call<{ acik: boolean; hata?: string }>('nobet', { ac }),
  sarsinti: (ac: boolean) => call<{ acik: boolean; hata?: string }>('sarsinti', { ac }),
  konumKaydi: () => call<{ mod: KonumKaydiModu; liste: KayitliKonum[]; arkaPlanIzni: boolean }>('konumKaydi'),
  konumKaydiModu: (mod: KonumKaydiModu) => call<{ mod: KonumKaydiModu; liste: KayitliKonum[]; arkaPlanIzni: boolean }>('konumKaydiModu', { mod }),
  konumEkle: (k: Omit<KayitliKonum, 'kaynak'> & { kaynak?: string }) => call('konumEkle', k),
  konumKaydiTemizle: () => call('konumKaydiTemizle'),
  acilisHedefi: async () => (await call<{ arac?: string }>('acilisHedefi'))?.arac ?? null,
  onDurum: (fn: (d: EnkazDurum) => void) => listen<EnkazDurum>('enkazDurum', fn),
  onDuyuldu: (fn: (d: Duyulan) => void) => listen<Duyulan>('enkazDuyuldu', fn),
  onAcilisHedefi: (fn: (arac: string) => void) => listen<{ arac?: string }>('acilisHedefi', (e) => e?.arac && fn(e.arac)),
};
