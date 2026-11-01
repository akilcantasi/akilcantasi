// Yakınlar listesi: acil durumda tek dokunuşla SMS gönderilecek kişiler.
// Yalnızca bu cihazda (localStorage) saklanır; hiçbir yere gönderilmez.
import { cleanPhone, loadProfile } from './outbox';

export interface Yakin {
  id: string;
  name: string;
  phone: string;
}

export const MAX_YAKIN = 8;
const KEY = 'ac.yakinlar';

type KV = { getItem(k: string): string | null; setItem(k: string, v: string): void };
const defaultKV = (): KV | null => {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
};

/** Kayıtlı yakınlar. İlk açılışta eski "aile numarası" alanı listeye taşınır. */
export function loadYakinlar(kv: KV | null = defaultKV()): Yakin[] {
  if (!kv) return [];
  try {
    const raw = kv.getItem(KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr))
        return arr
          .filter((y) => y && typeof y.phone === 'string' && cleanPhone(y.phone))
          .slice(0, MAX_YAKIN)
          .map((y) => ({ id: String(y.id || newId()), name: String(y.name ?? '').slice(0, 30), phone: cleanPhone(y.phone) }));
    }
  } catch {}
  // Eski sürümden: profil.family
  const p = loadProfile(kv as any);
  const fam = cleanPhone(p.family);
  if (fam) {
    const list = [{ id: newId(), name: p.familyName.trim() || 'Ailem', phone: fam }];
    saveYakinlar(list, kv);
    return list;
  }
  return [];
}

export function saveYakinlar(list: Yakin[], kv: KV | null = defaultKV()) {
  if (!kv) return;
  try {
    kv.setItem(KEY, JSON.stringify(list.slice(0, MAX_YAKIN)));
  } catch {}
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

/** Baş harfler (avatar) */
export function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toLocaleUpperCase('tr-TR');
}

/**
 * Birden çok alıcıya sms: bağlantısı. Android: "sms:a,b?body=", iOS: "sms:/open?addresses=a,b&body=".
 * Tek alıcıda sms.ts smsHref ile aynı sonucu verir.
 */
export function multiSmsHref(numbers: string[], body: string, ios = false): string {
  const ns = numbers.map(cleanPhone).filter(Boolean);
  const b = encodeURIComponent(body);
  if (ios) return ns.length > 1 ? `sms:/open?addresses=${ns.join(',')}&body=${b}` : `sms:${ns[0] ?? ''}&body=${b}`;
  return `sms:${ns.join(',')}?body=${b}`;
}
