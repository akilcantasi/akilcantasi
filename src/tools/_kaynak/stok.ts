// Stok listesi: elinizdeki malzemeler. Saf fonksiyonlar + kayıt.
import { compareExpiry, expiryStatus, formatDateTR } from './expiry';
import { DEFAULT_INPUT, drinkPerDay, kcalPerDay, sanitizeInput, totalWaterPerDay, type HesapInput } from './hesap';
import { KEYS, loadJSON, newId, saveJSON } from './storage';

export type StokKind = 'su' | 'gida' | 'diger';
export type Unit = 'L' | 'ml' | 'kg' | 'g' | 'adet' | 'paket' | 'kutu';

export const UNITS: Unit[] = ['adet', 'paket', 'kutu', 'L', 'ml', 'kg', 'g'];
export const KINDS: { id: StokKind; title: string }[] = [
  { id: 'su', title: 'Su' },
  { id: 'gida', title: 'Gıda' },
  { id: 'diger', title: 'Diğer' },
];

/**
 * Gıdada enerji bilgisi yoksa kullanılan temkinli varsayım (kcal / 100 g).
 * Konserve hazır yemekler ~100–150, kuru gıdalar 300–600 kcal/100 g'dır; düşük
 * değer seçilerek "kaç gün yeter" tahmini abartılmaz.
 */
export const DEFAULT_KCAL100 = 150;

export interface StokItem {
  id: string;
  name: string;
  qty: number;
  unit: Unit;
  kind: StokKind;
  location?: string;
  expiry?: string;
  /** gıda: g/kg için kcal/100 g; adet/paket/kutu için kcal/adet */
  kcal?: number;
  /** su: adet/paket/kutu için adet başı litre (ör. 1,5 L şişe) */
  litrePer?: number;
}

export function normalizeItem(raw: any): StokItem | null {
  if (!raw || typeof raw !== 'object' || typeof raw.name !== 'string' || !raw.name.trim()) return null;
  const qty = Number(raw.qty);
  const kcal = Number(raw.kcal);
  const lp = Number(raw.litrePer);
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : newId('s'),
    name: raw.name.trim().slice(0, 80),
    qty: Number.isFinite(qty) && qty >= 0 ? qty : 0,
    unit: UNITS.includes(raw.unit) ? raw.unit : 'adet',
    kind: raw.kind === 'su' || raw.kind === 'gida' ? raw.kind : 'diger',
    location: typeof raw.location === 'string' && raw.location.trim() ? raw.location.trim().slice(0, 60) : undefined,
    expiry: typeof raw.expiry === 'string' && raw.expiry ? raw.expiry : undefined,
    kcal: Number.isFinite(kcal) && kcal > 0 ? kcal : undefined,
    litrePer: Number.isFinite(lp) && lp > 0 ? lp : undefined,
  };
}

export function loadStok(): StokItem[] {
  const raw = loadJSON<unknown>(KEYS.stok, []);
  return Array.isArray(raw) ? (raw.map(normalizeItem).filter(Boolean) as StokItem[]) : [];
}

export function saveStok(items: StokItem[]) {
  return saveJSON(KEYS.stok, items);
}

/** Hesap aracında kaydedilen hane bilgisi (yoksa varsayılan). */
export function loadHousehold(): { input: HesapInput; saved: boolean } {
  const raw = loadJSON<Partial<HesapInput> | null>(KEYS.hesap, null);
  return raw ? { input: sanitizeInput(raw), saved: true } : { input: { ...DEFAULT_INPUT }, saved: false };
}

export function upsert(items: StokItem[], it: StokItem): StokItem[] {
  const i = items.findIndex((x) => x.id === it.id);
  if (i < 0) return [...items, it];
  const out = items.slice();
  out[i] = it;
  return out;
}

export function remove(items: StokItem[], id: string): StokItem[] {
  return items.filter((x) => x.id !== id);
}

const fold = (s: string) => s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');

export function search(items: StokItem[], q: string): StokItem[] {
  const t = fold(q.trim());
  if (!t) return items;
  return items.filter((i) => fold(`${i.name} ${i.location ?? ''}`).includes(t));
}

export type SortKey = 'expiry' | 'name' | 'location';

export function sortItems(items: StokItem[], key: SortKey): StokItem[] {
  const out = items.slice();
  if (key === 'expiry') out.sort((a, b) => compareExpiry(a.expiry, b.expiry) || a.name.localeCompare(b.name, 'tr'));
  else if (key === 'name') out.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  else out.sort((a, b) => (a.location ?? '￿').localeCompare(b.location ?? '￿', 'tr') || a.name.localeCompare(b.name, 'tr'));
  return out;
}

/** Su öğesinin litresi; hesaplanamıyorsa null. */
export function waterLitres(i: StokItem): number | null {
  if (i.kind !== 'su') return null;
  if (i.unit === 'L') return i.qty;
  if (i.unit === 'ml') return i.qty / 1000;
  if (i.litrePer) return i.qty * i.litrePer;
  return null;
}

/** Gıda öğesinin kalorisi; hesaplanamıyorsa null. `assumed` varsayılan değer kullanıldıysa true. */
export function foodKcal(i: StokItem): { kcal: number; assumed: boolean } | null {
  if (i.kind !== 'gida') return null;
  const grams = i.unit === 'kg' ? i.qty * 1000 : i.unit === 'g' ? i.qty : null;
  if (grams !== null) {
    const k100 = i.kcal ?? DEFAULT_KCAL100;
    return { kcal: (grams * k100) / 100, assumed: i.kcal === undefined };
  }
  if (i.kcal) return { kcal: i.qty * i.kcal, assumed: false };
  return null;
}

export interface Coverage {
  waterL: number;
  /** yalnız içme suyu olarak kaç gün */
  waterDrinkDays: number | null;
  /** içme + hijyen olarak kaç gün */
  waterTotalDays: number | null;
  kcal: number;
  foodDays: number | null;
  /** hesaba katılamayan su/gıda öğeleri */
  skipped: string[];
  /** varsayılan kalori kullanılan öğe var mı */
  assumedKcal: boolean;
  /** son kullanma tarihi geçmiş olduğu için sayılmayanlar */
  expiredSkipped: string[];
}

export function coverage(items: StokItem[], household: HesapInput, now: Date = new Date()): Coverage {
  let waterL = 0, kcal = 0, assumedKcal = false;
  const skipped: string[] = [], expiredSkipped: string[] = [];
  for (const i of items) {
    if (i.kind === 'diger') continue;
    if (expiryStatus(i.expiry, now) === 'expired') {
      expiredSkipped.push(i.name);
      continue;
    }
    if (i.kind === 'su') {
      const l = waterLitres(i);
      if (l === null) skipped.push(i.name);
      else waterL += l;
    } else {
      const k = foodKcal(i);
      if (k === null) skipped.push(i.name);
      else {
        kcal += k.kcal;
        assumedKcal ||= k.assumed;
      }
    }
  }
  const inp = sanitizeInput(household);
  const d = drinkPerDay(inp), t = totalWaterPerDay(inp), k = kcalPerDay(inp);
  const days = (have: number, need: number) => (need > 0 ? Math.floor((have / need) * 10) / 10 : null);
  return {
    waterL: Math.round(waterL * 10) / 10,
    waterDrinkDays: days(waterL, d),
    waterTotalDays: days(waterL, t),
    kcal: Math.round(kcal),
    foodDays: days(kcal, k),
    skipped,
    assumedKcal,
    expiredSkipped,
  };
}

const num = (x: number) => x.toLocaleString('tr-TR', { maximumFractionDigits: 2 });

export function exportText(items: StokItem[], cov?: Coverage, now: Date = new Date()): string {
  const lines: string[] = [`Akıl Çantası — Stok listesi (${formatDateTR(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)})`];
  if (!items.length) lines.push('(liste boş)');
  for (const k of ['su', 'gida', 'diger'] as StokKind[]) {
    const g = sortItems(items.filter((i) => i.kind === k), 'expiry');
    if (!g.length) continue;
    lines.push('', k === 'su' ? 'SU' : k === 'gida' ? 'GIDA' : 'DİĞER');
    for (const i of g) {
      const parts = [`- ${i.name}: ${num(i.qty)} ${i.unit}`];
      if (i.location) parts.push(`yer: ${i.location}`);
      if (i.expiry) {
        const st = expiryStatus(i.expiry, now);
        parts.push(`SKT: ${formatDateTR(i.expiry)}${st === 'expired' ? ' (GEÇMİŞ)' : st === 'soon' ? ' (yaklaşıyor)' : ''}`);
      }
      lines.push(parts.join(' · '));
    }
  }
  if (cov && (cov.waterDrinkDays !== null || cov.foodDays !== null)) {
    lines.push('');
    if (cov.waterDrinkDays !== null) lines.push(`Su: ${num(cov.waterL)} L ≈ içme için ${num(cov.waterDrinkDays)} gün, içme+hijyen için ${num(cov.waterTotalDays ?? 0)} gün`);
    if (cov.foodDays !== null) lines.push(`Gıda: ~${cov.kcal.toLocaleString('tr-TR')} kcal ≈ ${num(cov.foodDays)} gün`);
  }
  return lines.join('\n');
}
