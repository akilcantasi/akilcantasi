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
  /** Kendi bilgi noktasına "yerel" kayıt yazmak için başlatmada üretilen gizli anahtar */
  anahtar?: string;
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

/** SMS giden kutusundaki bir mesaj (SmsKuyrugu.java ile aynı alanlar) */
export interface SmsKayit {
  id: string;
  to: string;
  name: string;
  body: string;
  state: 'bekliyor' | 'gonderiliyor' | 'gitti' | 'ulasti' | 'hata';
  error: string;
  created: number;
  nextTry: number;
  tried: number;
  sentAt: number;
  deliveredAt: number;
  attempts: number;
  parts: number;
}

/**
 * Android SMS giden kutusu (AkilCantasiPlugin: smsGonder, smsKutusu, smsSimdiDene, smsIptal,
 * smsTemizle; "smsDurum" olayı). Uygulama SMS'i kendisi gönderir ve şebeke gelene kadar
 * yeniden dener. Tarayıcıda, iPhone'da ve eski APK'larda available() false döner.
 */
export const nativeSms = {
  available(): boolean {
    const p = plugin();
    return native.isAndroid() && !!p && typeof p.smsGonder === 'function';
  },
  /** queued false ve izin false: kullanıcı SMS iznini vermedi */
  async send(to: string[], names: string[], body: string): Promise<{ queued: boolean; izin: boolean; ids: string[] }> {
    const r = await call<{ queued?: boolean; izin?: boolean; ids?: string[] }>('smsGonder', { to, names, body });
    return { queued: !!r?.queued, izin: r?.izin !== false, ids: r?.ids ?? [] };
  },
  async list(): Promise<{ items: SmsKayit[]; izin: boolean }> {
    const r = await call<{ items?: SmsKayit[]; izin?: boolean }>('smsKutusu');
    return { items: r?.items ?? [], izin: !!r?.izin };
  },
  async retry(id?: string) {
    await call('smsSimdiDene', id ? { id } : {});
  },
  async cancel(id: string) {
    await call('smsIptal', { id });
  },
  async clear() {
    await call('smsTemizle');
  },
  /** Değişiklik olayı; aboneliği kaldıran işlev döner */
  listen(fn: (items: SmsKayit[]) => void): () => void {
    const p = plugin();
    if (!p || typeof p.addListener !== 'function') return () => {};
    let h: any = null;
    let gone = false;
    Promise.resolve(p.addListener('smsDurum', (e: { items?: SmsKayit[] }) => fn(e?.items ?? [])))
      .then((x) => {
        h = x;
        if (gone) h?.remove?.();
      })
      .catch(() => {});
    return () => {
      gone = true;
      h?.remove?.();
    };
  },
};

export interface NativeFenerDurum {
  var: boolean;
  hata?: string;
  arkaUclar?: { devices?: string; gpu?: boolean; system?: string };
  ram: number;
  ramBos?: number;
  cores: number;
  threads: number;
  yuklu: string | null;
  gpu?: boolean;
  gpuKapali?: boolean;
  bilgi?: { desc?: string; nCtx?: number; threads?: number; gpuLayers?: number; layers?: number; devices?: string };
}

export interface NativeFenerSonuc {
  tokens?: number;
  promptTokens?: number;
  promptMs?: number;
  genMs?: number;
  aborted?: boolean;
  error?: string;
}

/**
 * Fener yerel motoru (llama.cpp, AkilCantasiPlugin: fenerDurumu, fenerYukle, fenerSohbet, fenerDurdur,
 * fenerBosalt; "fenerParca" olayı). WebView'daki WebAssembly motorundan kat kat hızlıdır ve varsa
 * GPU'yu kullanır. Yalnızca uygulamanın kendi indiricisiyle indirilmiş (paket klasöründeki) modelleri açar.
 */
export const nativeFener = {
  available(): boolean {
    const p = plugin();
    return native.isAndroid() && !!p && typeof p.fenerYukle === 'function';
  },
  async durum(): Promise<NativeFenerDurum | null> {
    if (!this.available()) return null;
    return call<NativeFenerDurum>('fenerDurumu');
  },
  async yukle(dosya: string, nCtx: number, gpu = true): Promise<{ ok: boolean; hata?: string; gpu?: boolean; bilgi?: NativeFenerDurum['bilgi'] }> {
    const r = await call<{ ok?: boolean; hata?: string; gpu?: boolean; bilgi?: NativeFenerDurum['bilgi'] }>('fenerYukle', { dosya, nCtx, gpu });
    return { ok: !!r?.ok, hata: r?.hata ?? (r ? undefined : 'yerel motor yanıt vermedi'), gpu: r?.gpu, bilgi: r?.bilgi };
  },
  /** Akışlı sohbet: onPiece her parçada çağrılır */
  async sohbet(
    messages: { role: string; content: string }[],
    opts: { maxTokens: number; temperature: number; topK: number; topP: number; repeat: number },
    onPiece: (t: string) => void,
    signal?: AbortSignal,
  ): Promise<NativeFenerSonuc> {
    const p = plugin();
    const id = Math.random().toString(36).slice(2);
    // Durdurma isteği bu sohbetin kimliğiyle gider: üretim henüz başlamamış olsa da kaybolmaz
    const onAbort = () => void call('fenerDurdur', { id });
    signal?.addEventListener('abort', onAbort);
    let h: any = null;
    try {
      h = await p.addListener('fenerParca', (e: { id?: string; text?: string }) => {
        if (e?.id === id && e.text) onPiece(e.text);
      });
    } catch {}
    try {
      return (await p.fenerSohbet({ id, messages, ...opts })) as NativeFenerSonuc;
    } catch (e: any) {
      return { error: e?.message ?? String(e) };
    } finally {
      signal?.removeEventListener('abort', onAbort);
      // Son olaylar yanıt sözünden hemen sonra gelebilir
      await new Promise((r) => setTimeout(r, 30));
      try {
        await h?.remove?.();
      } catch {}
    }
  },
  async durdur() {
    await call('fenerDurdur');
  },
  async bosalt() {
    await call('fenerBosalt');
  },
  /** Çökme sonrası kapatılan GPU'yu yeniden denemeye açar (fenerGpuSifirla) */
  gpuSifirla: () => call<{ ok?: boolean; yenidenBaslat?: boolean }>('fenerGpuSifirla'),
};

/** Görülen bir uydu (Android GnssStatus) */
export interface Uydu {
  id: number;
  tur: string;
  /** Sinyal gücü, dB-Hz (0: duyulmuyor; ~20 altı zayıf; 30+ iyi) */
  sinyal: number;
  /** Konum hesabında kullanılıyor mu */
  kullanilan: boolean;
  /** Yörünge verisi (efemeris) indi mi; Android 8 öncesinde gelmez */
  yorunge?: boolean;
  /** Pusula yönü (0 = kuzey) ve ufuktan yükseklik, derece */
  az: number;
  yukseklik: number;
}

export interface KonumDurum {
  izin: 'tam' | 'yaklasik' | 'yok';
  gpsVar: boolean;
  konumAcik: boolean;
  gpsAcik: boolean;
  agAcik: boolean;
  gecenMs: number;
  /** İlk konumun kaç ms'de bulunduğu; henüz yoksa -1 */
  ilkKonumMs: number;
  uydular: Uydu[];
  konum?: { lat: number; lon: number; dogruluk: number; zaman: number; kaynak: 'gps' | 'ag' };
}

/**
 * Android yerel konum araması (AkilCantasiPlugin: konumIzle, konumIzleDurdur, konumAyarlari,
 * uygulamaAyarlari; "konumDurum" olayı saniyede bir). Tarayıcıda ve eski APK'larda
 * available() false döner; harita o zaman tarayıcı konum arayüzünü kullanır.
 */
export const nativeKonum = {
  available(): boolean {
    const p = plugin();
    return native.isAndroid() && !!p && typeof p.konumIzle === 'function';
  },
  /** Aramayı başlatır (gerekirse izin ister). null: eklenti yanıt vermedi */
  async start(): Promise<KonumDurum['izin'] | null> {
    const r = await call<{ izin?: KonumDurum['izin'] }>('konumIzle');
    return r?.izin ?? null;
  },
  async stop() {
    await call('konumIzleDurdur');
  },
  async openLocationSettings(): Promise<boolean> {
    const r = await call<{ opened?: boolean }>('konumAyarlari');
    return !!r?.opened;
  },
  async openAppSettings(): Promise<boolean> {
    const r = await call<{ opened?: boolean }>('uygulamaAyarlari');
    return !!r?.opened;
  },
  listen(fn: (d: KonumDurum) => void): () => void {
    const p = plugin();
    if (!p || typeof p.addListener !== 'function') return () => {};
    let h: any = null;
    let gone = false;
    Promise.resolve(p.addListener('konumDurum', (e: KonumDurum) => e && fn({ ...e, uydular: Array.isArray(e.uydular) ? e.uydular : [] })))
      .then((x) => {
        h = x;
        if (gone) h?.remove?.();
      })
      .catch(() => {});
    return () => {
      gone = true;
      h?.remove?.();
    };
  },
};
