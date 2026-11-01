// Coğrafi yardımcılar: mesafe, yön, pusula metni, yürüme süresi ve
// koordinat biçimlendirme. Hepsi saf fonksiyon; ağ ya da DOM gerektirmez.

export interface LatLon {
  lat: number;
  lon: number;
}

const R = 6371008.8; // ortalama Dünya yarıçapı (m)
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** İki nokta arası kuş uçuşu mesafe (metre, haversine). */
export function distanceM(a: LatLon, b: LatLon): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** a'dan b'ye başlangıç yönü, derece (0 = kuzey, 90 = doğu), 0–360. */
export function bearingDeg(a: LatLon, b: LatLon): number {
  const φ1 = rad(a.lat);
  const φ2 = rad(b.lat);
  const Δλ = rad(b.lon - a.lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** 16 yönlü Türkçe pusula kısaltmaları (K = kuzey, D = doğu, G = güney, B = batı). */
export const COMPASS16 = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB'] as const;
export const COMPASS16_LONG = [
  'kuzey',
  'kuzey-kuzeydoğu',
  'kuzeydoğu',
  'doğu-kuzeydoğu',
  'doğu',
  'doğu-güneydoğu',
  'güneydoğu',
  'güney-güneydoğu',
  'güney',
  'güney-güneybatı',
  'güneybatı',
  'batı-güneybatı',
  'batı',
  'batı-kuzeybatı',
  'kuzeybatı',
  'kuzey-kuzeybatı',
] as const;

function compassIndex(bearing: number) {
  const b = ((bearing % 360) + 360) % 360;
  return Math.round(b / 22.5) % 16;
}

/** Yön açısını 16 yönlü kısaltmaya çevirir: 0 → "K", 45 → "KD", 200 → "GGB". */
export function compassText(bearing: number): string {
  return COMPASS16[compassIndex(bearing)];
}

/** Uzun ad: 45 → "kuzeydoğu". */
export function compassLong(bearing: number): string {
  return COMPASS16_LONG[compassIndex(bearing)];
}

export const WALK_KMH = 4.5;

/** Yürüme süresi (dakika, yukarı yuvarlanmış, en az 1). Kuş uçuşu mesafe üzerinden. */
export function walkMinutes(meters: number, kmh = WALK_KMH): number {
  return Math.max(1, Math.ceil(meters / ((kmh * 1000) / 60)));
}

const nf1 = (n: number) => n.toFixed(1).replace('.', ',');

/** "8 m", "350 m", "1,2 km", "12 km" */
export function formatDistance(m: number): string {
  if (!isFinite(m) || m < 0) return '—';
  if (m < 100) return `${Math.round(m)} m`;
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  if (m < 10000) return `${nf1(m / 1000)} km`;
  return `${Math.round(m / 1000)} km`;
}

/** "5 dk", "1 sa 20 dk", "2 sa" */
export function formatDuration(min: number): string {
  const m = Math.max(1, Math.round(min));
  if (m < 60) return `${m} dk`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} sa ${r} dk` : `${h} sa`;
}

/** Ondalık koordinat: "39.920800, 32.854100" (nokta ondalık ayırıcı — her uygulama okuyabilsin). */
export function formatDecimal(lat: number, lon: number, digits = 6): string {
  return `${lat.toFixed(digits)}, ${lon.toFixed(digits)}`;
}

/** Tek bir değeri derece-dakika-saniyeye çevirir: 39.92 → "39° 55′ 12,0″ K" */
export function toDMS(value: number, axis: 'lat' | 'lon', secDigits = 1): string {
  const hemi = axis === 'lat' ? (value >= 0 ? 'K' : 'G') : value >= 0 ? 'D' : 'B';
  const v = Math.abs(value);
  let d = Math.floor(v);
  let m = Math.floor((v - d) * 60);
  let s = (v - d - m / 60) * 3600;
  // Yuvarlamada 60″ çıkmasını engelle
  const p = 10 ** secDigits;
  s = Math.round(s * p) / p;
  if (s >= 60) {
    s -= 60;
    m += 1;
  }
  if (m >= 60) {
    m -= 60;
    d += 1;
  }
  return `${d}° ${String(m).padStart(2, '0')}′ ${s.toFixed(secDigits).padStart(secDigits + 3, '0').replace('.', ',')}″ ${hemi}`;
}

export function formatDMS(lat: number, lon: number): string {
  return `${toDMS(lat, 'lat')}  ${toDMS(lon, 'lon')}`;
}

/** Konum mesajı (SMS / kopyalama). */
export function locationMessage(lat: number, lon: number): string {
  return `Konumum: ${lat.toFixed(6)},${lon.toFixed(6)} (Akıl Çantası)`;
}

/** sms: bağlantısı — hem Android hem iOS'ta çalışan biçim. */
export function smsHref(lat: number, lon: number): string {
  return `sms:?&body=${encodeURIComponent(locationMessage(lat, lon))}`;
}

/** Bir nokta listesinde en yakını bulur. */
export function nearest<T extends LatLon>(from: LatLon, items: T[]): { item: T; distance: number } | null {
  let best: { item: T; distance: number } | null = null;
  for (const it of items) {
    const d = distanceM(from, it);
    if (!best || d < best.distance) best = { item: it, distance: d };
  }
  return best;
}
