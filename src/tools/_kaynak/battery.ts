// Pil kalan süre tahmini: zaman içinde ölçülen seviye örneklerinden boşalma hızı.

export interface Sample {
  /** ms */
  t: number;
  /** 0..1 */
  level: number;
  charging: boolean;
}

export const MAX_SAMPLES = 240;
/** Tahmin için gereken en az ölçüm süresi (ms) ve seviye düşüşü */
export const MIN_SPAN_MS = 4 * 60 * 1000;
export const MIN_DROP = 0.02;

/** Yeni örneği ekler; şarj durumu değişince veya seviye yükselince oturum sıfırlanır. */
export function addSample(samples: Sample[], s: Sample): Sample[] {
  const last = samples[samples.length - 1];
  if (last && (last.charging !== s.charging || (!s.charging && s.level > last.level + 0.005) || s.t < last.t)) return [s];
  if (last && last.level === s.level && last.charging === s.charging && s.t - last.t < 60000) return samples;
  const out = [...samples, s];
  return out.length > MAX_SAMPLES ? out.slice(out.length - MAX_SAMPLES) : out;
}

/** En küçük kareler eğimi: seviye / ms. */
export function slope(samples: Sample[]): number | null {
  if (samples.length < 2) return null;
  const t0 = samples[0].t;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const p of samples) {
    const x = p.t - t0;
    sx += x; sy += p.level; sxx += x * x; sxy += x * p.level;
  }
  const n = samples.length;
  const den = n * sxx - sx * sx;
  if (den === 0) return null;
  return (n * sxy - sx * sy) / den;
}

export interface Estimate {
  /** kalan dakika (boşalırken) veya dolmaya kalan dakika (şarjda) */
  minutes: number | null;
  /** saatte yüzde değişim (pozitif: boşalma) */
  ratePctPerHour: number | null;
  /** 'olcum' örneklerden, 'sistem' tarayıcının dischargingTime değerinden */
  basis: 'olcum' | 'sistem' | 'yok';
  /** tahmin için ölçüm yetersizse kalan bekleme açıklaması */
  waiting: boolean;
}

export function estimate(samples: Sample[], sys?: { dischargingTime?: number; chargingTime?: number }): Estimate {
  const last = samples[samples.length - 1];
  if (!last) return { minutes: null, ratePctPerHour: null, basis: 'yok', waiting: true };
  const span = last.t - samples[0].t;
  const drop = samples[0].level - last.level;
  if (!last.charging && span >= MIN_SPAN_MS && drop >= MIN_DROP) {
    const sl = slope(samples);
    if (sl !== null && sl < 0) {
      const perMin = -sl * 60000;
      return { minutes: Math.round(last.level / perMin), ratePctPerHour: Math.round(perMin * 60 * 1000) / 10, basis: 'olcum', waiting: false };
    }
  }
  const sysT = last.charging ? sys?.chargingTime : sys?.dischargingTime;
  if (sysT !== undefined && Number.isFinite(sysT) && sysT > 0) {
    return { minutes: Math.round(sysT / 60), ratePctPerHour: null, basis: 'sistem', waiting: !last.charging };
  }
  return { minutes: null, ratePctPerHour: null, basis: 'yok', waiting: !last.charging };
}

export function formatMinutes(m: number | null): string {
  if (m === null || !Number.isFinite(m)) return '—';
  if (m < 60) return `${m} dk`;
  const h = Math.floor(m / 60), r = m % 60;
  if (h >= 48) return `${Math.round(h / 24)} gün`;
  return r ? `${h} sa ${r} dk` : `${h} sa`;
}
