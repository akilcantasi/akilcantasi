// Kaynak araçlarının ortak modülü. Diğer ekranlar buradan içe aktarabilir:
//   import { getExpiringSoon } from '../tools/_kaynak';
import { DEFAULT_ITEMS, PROFILES, type ProfileId } from './canta-data';
import { loadCanta, normalizeCanta, type CantaState } from './canta';
import { daysUntil } from './expiry';
import { loadStok, type StokItem } from './stok';

export interface ExpiringItem {
  /** 'canta' (afet çantası) veya 'stok' (stok listesi) */
  source: 'canta' | 'stok';
  /** çanta profili (yalnız source='canta') */
  profile?: ProfileId;
  /** profil/kaynak başlığı, ör. "Ev çantası" veya "Stok" */
  where: string;
  id: string;
  name: string;
  expiry: string;
  /** kalan gün; negatifse geçmiş */
  daysLeft: number;
  expired: boolean;
}

/**
 * Önümüzdeki `days` gün içinde süresi dolacak veya dolmuş öğeler, en acil önce.
 * Çantadaki (tüm profiller) ve stoktaki tarihli öğeleri kapsar.
 */
export function getExpiringSoon(days = 30, now: Date = new Date(), data?: { canta?: CantaState | unknown; stok?: StokItem[] }): ExpiringItem[] {
  const canta = data?.canta !== undefined ? normalizeCanta(data.canta) : loadCanta();
  const stok = data?.stok ?? loadStok();
  const out: ExpiringItem[] = [];
  for (const p of PROFILES) {
    const ps = canta.profiles[p.id];
    for (const [id, date] of Object.entries(ps.expiry)) {
      const n = daysUntil(date, now);
      if (n === null || n > days) continue;
      const name = DEFAULT_ITEMS.find((i) => i.id === id)?.name ?? ps.custom.find((c) => c.id === id)?.name;
      if (!name) continue;
      out.push({ source: 'canta', profile: p.id, where: p.title, id, name, expiry: date, daysLeft: n, expired: n < 0 });
    }
  }
  for (const i of stok) {
    const n = daysUntil(i.expiry, now);
    if (n === null || n > days || !i.expiry) continue;
    out.push({ source: 'stok', where: 'Stok', id: i.id, name: i.name, expiry: i.expiry, daysLeft: n, expired: n < 0 });
  }
  return out.sort((a, b) => a.daysLeft - b.daysLeft || a.name.localeCompare(b.name, 'tr'));
}

export * from './expiry';
export { calculate, SOURCES as HESAP_SOURCES } from './hesap';
