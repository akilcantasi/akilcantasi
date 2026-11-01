// Geliştirici / masaüstü sunucusu kolaylığı:
//   ?devmap=<url>  PMTiles dosyasını HTTP Range ile açar
//   ?devpoi=<url>  GeoJSON nokta dosyasını açar
// Çevrimdışı vaadini korumak için yalnızca AYNI KÖKENDEN (same-origin)
// adreslere izin verilir; dış sunucu adresleri yok sayılır.

function param(name: string): string | null {
  if (typeof location === 'undefined') return null;
  const v = new URLSearchParams(location.search).get(name);
  if (!v) return null;
  try {
    const u = new URL(v, location.href);
    if (u.origin !== location.origin) {
      console.warn(`[harita] ${name} yok sayıldı: yalnızca aynı kökenden adreslere izin verilir`);
      return null;
    }
    return u.href;
  } catch {
    return null;
  }
}

export const devMapUrl = () => param('devmap');
export const devPoiUrl = () => param('devpoi');
