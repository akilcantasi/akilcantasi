// Hava ve iklim paketi (tools/hava/hava-paketi.mjs üretir): türler ve saf yardımcılar.

export interface IlVeri {
  plaka: number;
  ad: string;
  lat: number;
  lon: number;
  normal: { t: (number | null)[]; tmax: (number | null)[]; tmin: (number | null)[]; yagis: (number | null)[] };
  aylar: { ay: string; t: number | null; tSapma: number | null; yagis: number | null; yagisOran: number | null }[];
}

export interface HavaPaketi {
  v: number;
  uretim: string;
  tahmin: { model: string; baslangic: string | null; aylar: string[] } | null;
  kaynaklar: { ad: string; lisans: string; adres: string }[];
  iller: IlVeri[];
}

export const AY_ADI = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export function isHavaPaketi(x: any): x is HavaPaketi {
  return !!x && x.v === 1 && Array.isArray(x.iller) && x.iller.length > 0 && Array.isArray(x.iller[0]?.normal?.t);
}

/** "2026-12" → "Aralık 2026" */
export function ayEtiketi(ay: string): string {
  const [y, m] = ay.split('-').map(Number);
  return `${AY_ADI[m - 1] ?? ay} ${y}`;
}

export const num = (x: number, d = 1) => x.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Sıcaklık sapması için insan dili */
export function sicaklikYorum(tSapma: number | null): { metin: string; yon: 'sicak' | 'soguk' | 'normal' } | null {
  if (tSapma == null) return null;
  if (Math.abs(tSapma) < 0.5) return { metin: 'normale yakın', yon: 'normal' };
  return tSapma > 0 ? { metin: `normalden ${num(tSapma)}° sıcak`, yon: 'sicak' } : { metin: `normalden ${num(-tSapma)}° soğuk`, yon: 'soguk' };
}

/** Yağış oranı için insan dili */
export function yagisYorum(oran: number | null): { metin: string; yon: 'kurak' | 'yagisli' | 'normal' } | null {
  if (oran == null) return null;
  const pct = Math.round(oran * 100);
  if (oran < 0.8) return { metin: `normalden kurak (~%${pct})`, yon: 'kurak' };
  if (oran > 1.2) return { metin: `normalden yağışlı (~%${pct})`, yon: 'yagisli' };
  return { metin: 'normale yakın', yon: 'normal' };
}

/** En yakın il (kuş uçuşu) */
export function enYakinIl(iller: IlVeri[], lat: number, lon: number): IlVeri {
  const rad = Math.PI / 180;
  let best = iller[0];
  let bd = Infinity;
  for (const il of iller) {
    const dLat = (il.lat - lat) * rad;
    const dLon = (il.lon - lon) * rad;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * rad) * Math.cos(il.lat * rad) * Math.sin(dLon / 2) ** 2;
    if (a < bd) {
      bd = a;
      best = il;
    }
  }
  return best;
}

/** Tahminin yaşı (gün) */
export function tahminYasi(uretim: string, now = new Date()): number {
  const t = Date.parse(uretim + 'T00:00:00Z');
  return Number.isFinite(t) ? Math.max(0, Math.floor((now.getTime() - t) / 86400000)) : 0;
}

/** Gösterilecek aylar: bugünden önceki aylar düşer (paket eskiyse) */
export function gelecekAylar(il: IlVeri, now = new Date()) {
  const cur = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return il.aylar.filter((a) => a.ay >= cur);
}
