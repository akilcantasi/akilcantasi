// Tarayıcı depolaması çalışıyor mu? Uygulama paketleri (OPFS), listeleri ve
// ayarları (localStorage) tarayıcıda tutar. Bazı ortamlar buna izin vermez:
//  - iPhone Safari gizli sekmesi (OPFS reddedilir, kayıtlar sekme kapanınca silinir)
//  - "Ağda oturum açın" (captive portal) açılır penceresi: iOS'ta ve Android'de
//    kısıtlı bir tarayıcıdır; depolama ya yoktur ya da pencere kapanınca silinir
//  - çerezleri/site verilerini engelleyen tarayıcı ayarları
// Böyle bir ortam algılanınca kullanıcıya adresi normal tarayıcı sekmesinde açması söylenir.

export type StorageProblem = 'captive' | 'private' | 'blocked' | null;

export interface StorageCheck {
  local: boolean;
  opfs: boolean;
  problem: StorageProblem;
}

function localWorks(): boolean {
  try {
    const k = '__ac_test__';
    localStorage.setItem(k, '1');
    const ok = localStorage.getItem(k) === '1';
    localStorage.removeItem(k);
    return ok;
  } catch {
    return false;
  }
}

async function opfsWorks(): Promise<boolean> {
  try {
    if (!navigator.storage?.getDirectory) return false;
    const root = await navigator.storage.getDirectory();
    const name = '__ac_test__';
    await root.getFileHandle(name, { create: true });
    await root.removeEntry(name).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

/**
 * Sistem "ağda oturum açın" penceresi mi? iOS'un bu penceresi (Captive Network
 * Assistant) Safari değildir: kullanıcı aracısında "Safari/" yoktur. Uygulama içi
 * tarayıcılar da öyledir; onlarda da depolama güvenilmez, uyarı yine yerindedir.
 * Android'in giriş penceresi WebView'dir ("; wv)").
 */
export function looksLikeCaptiveWindow(ua: string): boolean {
  const ios = /iPhone|iPad|iPod/.test(ua);
  if (ios) return !/Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return /Android/.test(ua) && /; wv\)/.test(ua) && !/AkilCantasi/.test(ua);
}

function isNativeApp(): boolean {
  try {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

/** Saf karar işlevi (test edilebilir) */
export function decideProblem(o: { local: boolean; opfs: boolean; opfsApi: boolean; captiveUa: boolean; native: boolean }): StorageProblem {
  if (o.native) return null;
  if (o.captiveUa) return 'captive';
  if (!o.local) return 'blocked';
  // OPFS'i destekleyen ama kullanmaya izin vermeyen tarayıcı: Safari gizli sekme
  if (o.opfsApi && !o.opfs) return 'private';
  return null;
}

export async function checkStorage(): Promise<StorageCheck> {
  const local = localWorks();
  const opfsApi = typeof navigator !== 'undefined' && !!navigator.storage?.getDirectory;
  const opfs = await opfsWorks();
  const problem = decideProblem({
    local,
    opfs,
    opfsApi,
    captiveUa: typeof navigator !== 'undefined' && looksLikeCaptiveWindow(navigator.userAgent),
    native: isNativeApp(),
  });
  return { local, opfs, problem };
}
