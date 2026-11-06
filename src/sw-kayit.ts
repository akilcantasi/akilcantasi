// Service worker kaydı (yalnız tarayıcıdan açılan üretim derlemesi: bilgi noktası, masaüstü).
// SW dosyası derlemede üretilir (tools/sw/sw-eklentisi.ts → dist/sw.js).
//
// Android uygulamasında (Capacitor) KAYDEDİLMEZ: orada sayfa https://localhost'tan uygulamanın
// kendi yerel sunucusuyla gelir (COOP/COEP başlıkları ve paket klasörü ona ait); araya bir SW
// girmesi bu düzeni bozabilir. Eski bir sürümden kalmış kayıt varsa da silinir.
//
// Güncelleme akışı (güvenli olan): yeni SW kurulur ama bekler; açık sayfa eski parçalarla
// karışmaz. Sayfada küçük bir "Yeni sürüm hazır" notu çıkar; "Yenile"ye basılınca yeni sürüme
// geçilir ve sayfa yenilenir. Basılmazsa sekme kapanıp yeniden açılınca kendiliğinden geçilir.
//
// Not: tarayıcılar SW'yi yalnız güvenli bağlamda (https ya da localhost) çalıştırır. Bilgi
// noktasına telefondan http://192.168.x.x ile girilince SW yoktur; orada main.tsx'teki önceden
// yükleme (modül önbelleği) devrededir.
import { native } from './lib/native';

function yerelUygulama(): boolean {
  try {
    const w = window as any;
    return native.isNative() || !!w.androidBridge || /^capacitor:|^_capacitor/.test(location.protocol);
  } catch {
    return false;
  }
}

export function swDesteklenir(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    !!window.isSecureContext &&
    /^https?:$/.test(location.protocol)
  );
}

let notGosterildi = false;

/** Ekranın altında küçük, sakin not: "Yeni sürüm hazır — Yenile / Sonra" */
function yeniSurumNotu(reg: ServiceWorkerRegistration) {
  if (notGosterildi || !reg.waiting) return;
  notGosterildi = true;
  const kutu = document.createElement('div');
  kutu.className = 'sw-not';
  kutu.setAttribute('role', 'status');
  kutu.setAttribute('data-testid', 'sw-update');
  const yazi = document.createElement('span');
  yazi.textContent = 'Yeni sürüm hazır.';
  const yenile = document.createElement('button');
  yenile.type = 'button';
  yenile.className = 'btn primary';
  yenile.textContent = 'Yenile';
  yenile.setAttribute('data-testid', 'sw-update-reload');
  const sonra = document.createElement('button');
  sonra.type = 'button';
  sonra.className = 'btn';
  sonra.textContent = 'Sonra';
  sonra.setAttribute('data-testid', 'sw-update-later');
  const stil = document.createElement('style');
  stil.textContent =
    '.sw-not{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(96px + var(--sa-bottom, 0px));z-index:60;' +
    'display:flex;align-items:center;gap:8px;max-width:calc(100vw - 24px);padding:6px 6px 6px 14px;border-radius:16px;' +
    'background:var(--card, #15263b);border:1px solid var(--accent, #f5a524);color:var(--text, #f4f7fb);font-size:14px;' +
    'box-shadow:0 8px 24px rgba(3,9,18,.45)}.sw-not span{flex:1;min-width:0;white-space:nowrap}.sw-not .btn{min-height:44px;padding:0 14px;flex-shrink:0}';
  kutu.append(stil, yazi, yenile, sonra);
  yenile.onclick = () => {
    yenile.disabled = true;
    let yenilendi = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (yenilendi) return;
      yenilendi = true;
      location.reload();
    });
    reg.waiting?.postMessage({ tip: 'SKIP_WAITING' });
    // Bekleyen SW kaybolduysa (başka sekme geçirdi) yine de yenile
    setTimeout(() => !yenilendi && location.reload(), 3000);
  };
  sonra.onclick = () => kutu.remove();
  document.body.appendChild(kutu);
}

/** Bekleyen yeni sürüm varsa (ve sayfa zaten bir SW tarafından yönetiliyorsa) not göster */
function izle(reg: ServiceWorkerRegistration) {
  if (reg.waiting && navigator.serviceWorker.controller) yeniSurumNotu(reg);
  reg.addEventListener('updatefound', () => {
    const sw = reg.installing;
    sw?.addEventListener('statechange', () => {
      // İlk kurulumda (controller yok) not gerekmez: sayfa zaten güncel
      if (sw.state === 'installed' && navigator.serviceWorker.controller) yeniSurumNotu(reg);
    });
  });
}

export function swKaydet(): void {
  if (!import.meta.env.PROD || typeof window === 'undefined') return;
  if (yerelUygulama()) {
    // Android uygulaması: kayıt yok; varsa kalıntı silinir
    try {
      navigator.serviceWorker?.getRegistrations?.().then((rs) => rs.forEach((r) => void r.unregister())).catch(() => {});
    } catch {}
    return;
  }
  if (!swDesteklenir()) return;
  const kaydet = () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then((reg) => {
        izle(reg);
        // Uzun açık kalan bilgi noktası ekranında saatte bir yeni sürüm denetlenir
        setInterval(() => void reg.update().catch(() => {}), 60 * 60 * 1000);
      })
      .catch((e) => console.warn('[sw] kaydedilemedi:', e?.message ?? e));
  };
  if (document.readyState === 'complete') kaydet();
  else window.addEventListener('load', kaydet, { once: true });
}
