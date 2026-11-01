// Yerel (Android/Capacitor) köprüsü. Tarayıcıda ve iPhone'da tüm işlemler
// false döner; arayüz buna göre açıklama gösterir.
//
// Android tarafında beklenen Capacitor eklentisi: adı "AkilCantasi"
// (window.Capacitor.Plugins.AkilCantasi). Yöntemler (hepsi Promise döner):
//
//   openHotspotSettings(): Promise<{ opened: boolean }>
//       Ayarlar > Ağ > Mobil erişim noktası ekranını açar
//       (Intent: android.settings.TETHER_SETTINGS, olmazsa WIRELESS_SETTINGS).
//
//   shareApk(): Promise<{ shared: boolean }>
//       Kurulu APK'yı (context.getApplicationInfo().sourceDir) FileProvider ile
//       ACTION_SEND paylaşım menüsüne verir (Bluetooth, Nearby Share, Quick Share…).
//
//   startInfoPoint(options: { port?: number }): Promise<{ running: boolean; port: number; addresses: string[] }>
//       Telefonun kendisinde bilgi noktası sunucusu başlatır (ör. NanoHTTPD):
//       uygulama varlıklarını + OPFS/uygulama dizinindeki paketleri sunar,
//       server/server.mjs ile aynı uç noktalar (/api/status, /api/packs, /data/…).
//
//   stopInfoPoint(): Promise<{ running: false }>
//
//   getInfoPointStatus(): Promise<{ running: boolean; port?: number; addresses?: string[]; clients?: number }>
//
//   setTorch(options: { on: boolean }): Promise<{ on: boolean; available: boolean; error?: string }>
//       Arka kamera flaşını el feneri olarak açar/kapatır (CameraManager.setTorchMode).
//       Flaş yoksa available: false. İzin gerektirmez (API 23+).

/** Android: uygulamanın paket klasöründeki dosyaların okunduğu yol (MainActivity.PACK_PATH) */
export const NATIVE_PACK_PATH = '/_paket/';

export type NativeJob = { file: string; status: 'checking' | 'downloading' | 'verifying' | 'paused' | 'error' | 'done'; received: number; total: number; speed: number; mirror: string | null; error: string | null };

export interface InfoPointStatus {
  running: boolean;
  port?: number;
  addresses?: string[];
  clients?: number;
}

function cap(): any {
  return typeof window !== 'undefined' ? (window as any).Capacitor : undefined;
}

function plugin(): any {
  return cap()?.Plugins?.AkilCantasi;
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

export const native = {
  isNative(): boolean {
    const c = cap();
    return !!c && (typeof c.isNativePlatform === 'function' ? !!c.isNativePlatform() : true);
  },
  isAndroid(): boolean {
    const c = cap();
    if (!c) return false;
    const pl = typeof c.getPlatform === 'function' ? c.getPlatform() : c.platform;
    return pl === 'android';
  },
  /** Eklenti yüklü mü (Android uygulamasının yeni sürümü) */
  hasPlugin(): boolean {
    return !!plugin();
  },
  async openHotspotSettings(): Promise<boolean> {
    if (!this.isAndroid()) return false;
    const r = await call<{ opened?: boolean }>('openHotspotSettings');
    return !!r?.opened;
  },
  async shareApk(): Promise<boolean> {
    if (!this.isAndroid()) return false;
    const r = await call<{ shared?: boolean }>('shareApk');
    return !!r?.shared;
  },
  async startInfoPoint(port = 8080): Promise<InfoPointStatus | null> {
    if (!this.isAndroid()) return null;
    return call<InfoPointStatus>('startInfoPoint', { port });
  },
  async stopInfoPoint(): Promise<boolean> {
    if (!this.isAndroid()) return false;
    return !!(await call('stopInfoPoint'));
  },
  async getInfoPointStatus(): Promise<InfoPointStatus | null> {
    if (!this.isAndroid()) return null;
    return call<InfoPointStatus>('getInfoPointStatus');
  },
  /** Konumu cihazdaki harita uygulamasında açar (geo: bağlantısı, uygulama seçici). */
  async openInMaps(lat: number, lon: number, label: string): Promise<boolean> {
    if (!this.isAndroid()) return false;
    const r = await call<{ opened?: boolean }>('haritadaAc', { lat, lon, label });
    return !!r?.opened;
  },
  /** Telefon flaşı (el feneri). Başarılıysa true; tarayıcıda/flaş yoksa false. */
  async setTorch(on: boolean): Promise<boolean> {
    if (!this.isAndroid()) return false;
    const r = await call<{ on?: boolean; available?: boolean }>('setTorch', { on });
    return !!r && r.available !== false && r.on === on;
  },
};

/**
 * Android paket indirici ve paket klasörü (AkilCantasiPlugin: paketDurumu, paketIndir,
 * paketDuraklat, paketIptal, paketListesi, paketSil). Eski APK'larda yöntemler yoktur;
 * o zaman available() false döner ve WebView'daki indirici kullanılır.
 */
export const nativePacks = {
  available(): boolean {
    const p = plugin();
    return native.isAndroid() && !!p && typeof p.paketDurumu === 'function';
  },
  async status(): Promise<{ jobs: NativeJob[]; free: number } | null> {
    if (!this.available()) return null;
    const r = await call<{ jobs?: NativeJob[]; free?: number }>('paketDurumu');
    return r ? { jobs: r.jobs ?? [], free: r.free ?? -1 } : null;
  },
  async start(req: { file: string; urls: string[]; size?: number; sha256?: string }): Promise<{ ok: boolean; error?: string; job?: NativeJob }> {
    const r = await call<{ ok?: boolean; error?: string; job?: NativeJob }>('paketIndir', req);
    return { ok: !!r?.ok, error: r?.error ?? (r ? undefined : 'indirici yanıt vermedi'), job: r?.job };
  },
  async pause(file: string) {
    await call('paketDuraklat', { file });
  },
  async cancel(file: string) {
    await call('paketIptal', { file });
  },
  async list(): Promise<{ name: string; size: number }[]> {
    if (!this.available()) return [];
    const r = await call<{ files?: { name: string; size: number }[] }>('paketListesi');
    return r?.files ?? [];
  },
  async remove(file: string): Promise<boolean> {
    if (!this.available()) return false;
    const r = await call<{ ok?: boolean }>('paketSil', { file });
    return !!r?.ok;
  },
  url(file: string): string {
    return NATIVE_PACK_PATH + encodeURIComponent(file);
  },
};
