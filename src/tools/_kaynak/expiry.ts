// Son kullanma tarihi yardımcıları. Tarihler 'YYYY-AA-GG' biçiminde, yerel saatle.

export type ExpiryStatus = 'none' | 'ok' | 'soon' | 'expired';

/** Varsayılan "yaklaşan" eşiği (gün). */
export const SOON_DAYS = 30;

const DAY = 86400000;

export function parseDate(s: string | undefined | null): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

function midnight(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Bugünden son kullanma gününe kalan tam gün. Bugün = 0, dün = -1. Geçersizse null. */
export function daysUntil(date: string | undefined | null, now: Date = new Date()): number | null {
  const d = parseDate(date);
  if (!d) return null;
  return Math.round((midnight(d).getTime() - midnight(now).getTime()) / DAY);
}

/** Son kullanma günü dahil kullanılabilir sayılır; ertesi gün "geçmiş" olur. */
export function expiryStatus(date: string | undefined | null, now: Date = new Date(), soonDays = SOON_DAYS): ExpiryStatus {
  const n = daysUntil(date, now);
  if (n === null) return 'none';
  if (n < 0) return 'expired';
  if (n <= soonDays) return 'soon';
  return 'ok';
}

export function expiryText(date: string | undefined | null, now: Date = new Date()): string {
  const n = daysUntil(date, now);
  if (n === null) return '';
  if (n < -1) return `${-n} gün önce geçti`;
  if (n === -1) return 'dün geçti';
  if (n === 0) return 'bugün son gün';
  if (n === 1) return 'yarın son gün';
  return `${n} gün kaldı`;
}

export function formatDateTR(date: string | undefined | null): string {
  const d = parseDate(date);
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

/** Tarihe göre artan sıralama; tarihsizler sona. */
export function compareExpiry(a: string | undefined | null, b: string | undefined | null): number {
  const da = parseDate(a), db = parseDate(b);
  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return da.getTime() - db.getTime();
}

export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
