// "Yol tarifi": seçili noktayı cihazdaki harita uygulamasında açar.
// Android uygulaması: geo: bağlantısı → yüklü harita uygulamaları arasından seçim (Google Haritalar,
// OsmAnd, Organic Maps…). iPhone/iPad: Apple Haritalar. Diğerleri: Google Haritalar web yol tarifi.
// Not: Dış uygulamanın yol tarifi için genellikle internet gerekir; uygulamanın kendi
// "Yön göster" ekranı internetsiz çalışır.
import { native } from '../native';

export interface Hedef {
  lat: number;
  lon: number;
  name: string;
}

const c = (n: number) => n.toFixed(6);

export function geoUri(h: Hedef): string {
  const label = h.name.replace(/[()]/g, ' ').trim();
  return `geo:${c(h.lat)},${c(h.lon)}?q=${c(h.lat)},${c(h.lon)}(${encodeURIComponent(label)})`;
}

export function isApple(ua: string): boolean {
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && /Mobile/.test(ua));
}

export function webDirectionsUrl(h: Hedef, ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''): string {
  if (isApple(ua)) return `https://maps.apple.com/?daddr=${c(h.lat)},${c(h.lon)}&q=${encodeURIComponent(h.name)}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${c(h.lat)},${c(h.lon)}`;
}

export function isAndroidBrowser(ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''): boolean {
  return /Android/.test(ua);
}

/** Harita uygulamasını açar. */
export async function openDirections(h: Hedef): Promise<void> {
  if (native.isAndroid()) {
    if (await native.openInMaps(h.lat, h.lon, h.name)) return;
    location.href = geoUri(h);
    return;
  }
  // Android tarayıcısında geo: da yüklü harita uygulamalarını açar
  if (isAndroidBrowser()) {
    location.href = geoUri(h);
    return;
  }
  window.open(webDirectionsUrl(h), '_blank', 'noopener');
}
