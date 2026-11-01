// Pusula matematiği: cihaz yön sensöründen (DeviceOrientationEvent) baş açısı,
// 8 yönlü Türkçe adlar, göreli yön ve dönüş ipucu. Saf fonksiyonlar; DOM yok.
//
// Kaynaklar:
//  - W3C DeviceOrientation Event spesifikasyonu: alpha, z ekseni etrafında
//    saat yönünün TERSİNE dönüştür; "absolute" olayında 0 = kuzey. Bu yüzden
//    telefonun üst kenarının baktığı yön = 360 − alpha.
//  - Apple WebKit: iOS Safari "webkitCompassHeading" (0 = manyetik kuzey, saat
//    yönünde) ve "webkitCompassAccuracy" (± derece; negatif = geçersiz) verir.
//    iOS 13+ izin için DeviceOrientationEvent.requestPermission() gerekir.
//  - Ekran yatay çevrildiğinde screen.orientation.angle kadar düzeltilir.

export const CARDINAL8 = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'] as const;
export const CARDINAL8_LONG = ['kuzey', 'kuzeydoğu', 'doğu', 'güneydoğu', 'güney', 'güneybatı', 'batı', 'kuzeybatı'] as const;

/** Açıyı 0–360 aralığına getirir. */
export function normDeg(d: number): number {
  const r = d % 360;
  return r < 0 ? r + 360 : r === 360 ? 0 : r;
}

/** 8 yönlü kısaltma: 0 → "K", 44 → "KD", 270 → "B", 350 → "K". */
export function cardinal8(d: number): (typeof CARDINAL8)[number] {
  return CARDINAL8[Math.round(normDeg(d) / 45) % 8];
}

export function cardinal8Long(d: number): (typeof CARDINAL8_LONG)[number] {
  return CARDINAL8_LONG[Math.round(normDeg(d) / 45) % 8];
}

/** b − a, −180…180 aralığında (en kısa dönüş; pozitif = saat yönünde/sağa). */
export function angleDiff(a: number, b: number): number {
  let d = normDeg(b) - normDeg(a);
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

/** Hedef yönünün telefonun baktığı yöne göre açısı (0 = tam önde, 90 = sağda). */
export function relativeBearing(targetBearing: number, heading: number): number {
  return normDeg(targetBearing - heading);
}

/** Göreli açıya göre kısa dönüş ipucu. */
export function turnHint(rel: number): string {
  const d = angleDiff(0, rel);
  const a = Math.abs(d);
  if (a <= 15) return 'Düz ilerleyin';
  if (a >= 150) return 'Arkanıza dönün';
  if (a <= 45) return d > 0 ? 'Hafif sağa' : 'Hafif sola';
  return d > 0 ? 'Sağa dönün' : 'Sola dönün';
}

export interface OrientationLike {
  alpha?: number | null;
  beta?: number | null;
  gamma?: number | null;
  absolute?: boolean;
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
}

export interface HeadingReading {
  /** telefonun (ekranın) üst kenarının baktığı yön, manyetik kuzeye göre derece */
  heading: number;
  source: 'ios' | 'absolute';
  /** ± derece; bilinmiyorsa null */
  accuracy: number | null;
  /** telefon çok eğik: yatay tutulmalı (yalnızca Android alpha yöntemi için) */
  tilted: boolean;
}

/**
 * Bir yön olayından baş açısı çıkarır. Mutlak (kuzeye bağlı) veri yoksa null döner;
 * göreli alpha (sayfa açıldığı andaki yöne göre) pusula için kullanılamaz.
 * @param screenAngle screen.orientation.angle (0, 90, 180, 270)
 */
export function headingFromOrientation(e: OrientationLike, screenAngle = 0, forceAbsolute = false): HeadingReading | null {
  const tilted = isTilted(e.beta ?? null, e.gamma ?? null);
  if (typeof e.webkitCompassHeading === 'number' && isFinite(e.webkitCompassHeading) && e.webkitCompassHeading >= 0) {
    const acc = typeof e.webkitCompassAccuracy === 'number' && e.webkitCompassAccuracy >= 0 ? e.webkitCompassAccuracy : null;
    // iOS başlığı eğim düzeltmelidir (dik tutulunca arka kameranın yönü): uyarıya gerek yok
    return { heading: normDeg(e.webkitCompassHeading + screenAngle), source: 'ios', accuracy: acc, tilted: false };
  }
  if ((e.absolute || forceAbsolute) && typeof e.alpha === 'number' && isFinite(e.alpha)) {
    return { heading: normDeg(360 - e.alpha + screenAngle), source: 'absolute', accuracy: null, tilted };
  }
  return null;
}

/** Telefon yere paralel değilse (eğim > 50°) basit alpha yönü güvenilmez. */
export function isTilted(beta: number | null, gamma: number | null): boolean {
  return (beta != null && Math.abs(beta) > 50 && Math.abs(beta) < 130) || (gamma != null && Math.abs(gamma) > 50);
}

/**
 * Dairesel alçak geçiren süzgeç: 359° → 1° geçişinde ibre ters dönmesin.
 * k: 0…1, yeni değerin ağırlığı.
 */
export function smoothHeading(prev: number | null, next: number, k = 0.25): number {
  if (prev == null) return normDeg(next);
  return normDeg(prev + angleDiff(prev, next) * k);
}

/** Kalibrasyon gerekiyor mu? (iOS doğruluğu ± 25°'den kötüyse) */
export function needsCalibration(accuracy: number | null): boolean {
  return accuracy != null && accuracy > 25;
}
