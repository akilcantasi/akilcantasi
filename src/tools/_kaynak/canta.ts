// Afet çantası durumu: profil başına işaretler, son kullanma tarihleri, özel öğeler.
import { GROUPS, itemsFor, type GroupId, type KitItem, type OptionId, type ProfileId } from './canta-data';
import { compareExpiry, expiryStatus, type ExpiryStatus } from './expiry';
import { KEYS, loadJSON, newId, saveJSON } from './storage';

export interface CustomItem {
  id: string;
  group: GroupId;
  name: string;
}

export interface ProfileState {
  checked: Record<string, boolean>;
  expiry: Record<string, string>;
  custom: CustomItem[];
}

export interface CantaState {
  v: 1;
  profile: ProfileId;
  opts: Record<OptionId, boolean>;
  profiles: Record<ProfileId, ProfileState>;
}

const emptyProfile = (): ProfileState => ({ checked: {}, expiry: {}, custom: [] });

export function defaultCanta(): CantaState {
  return { v: 1, profile: 'ev', opts: { bebek: false, yasli: false, evcil: false }, profiles: { ev: emptyProfile(), arac: emptyProfile(), is: emptyProfile() } };
}

/** Bozuk veya eski kayıtları güvenle varsayılanla birleştirir. */
export function normalizeCanta(raw: unknown): CantaState {
  const d = defaultCanta();
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Partial<CantaState>;
  const profile: ProfileId = r.profile === 'arac' || r.profile === 'is' ? r.profile : 'ev';
  const opts = { ...d.opts };
  for (const k of Object.keys(opts) as OptionId[]) opts[k] = !!r.opts?.[k];
  const profiles = { ...d.profiles };
  for (const p of Object.keys(profiles) as ProfileId[]) {
    const s = r.profiles?.[p];
    if (s && typeof s === 'object') {
      profiles[p] = {
        checked: s.checked && typeof s.checked === 'object' ? { ...s.checked } : {},
        expiry: s.expiry && typeof s.expiry === 'object' ? { ...s.expiry } : {},
        custom: Array.isArray(s.custom) ? s.custom.filter((c) => c && typeof c.name === 'string' && typeof c.id === 'string').map((c) => ({ ...c, group: GROUPS.some((g) => g.id === c.group) ? c.group : 'aletler' })) : [],
      };
    }
  }
  return { v: 1, profile, opts, profiles };
}

export function loadCanta(): CantaState {
  return normalizeCanta(loadJSON(KEYS.canta, null));
}

export function saveCanta(s: CantaState) {
  return saveJSON(KEYS.canta, s);
}

export interface ViewItem extends KitItem {
  custom?: boolean;
  checked: boolean;
  expiry?: string;
  status: ExpiryStatus;
}

/** Profilin görünür öğeleri (varsayılan + özel), seçeneklere göre süzülmüş. */
export function viewItems(s: CantaState, profile: ProfileId = s.profile, now: Date = new Date()): ViewItem[] {
  const ps = s.profiles[profile];
  const hidden = new Set(GROUPS.filter((g) => g.option && !s.opts[g.option]).map((g) => g.id));
  const base: KitItem[] = itemsFor(profile, s.opts);
  const custom: (KitItem & { custom: true })[] = ps.custom.filter((c) => !hidden.has(c.group)).map((c) => ({ id: c.id, group: c.group, name: c.name, perishable: true, custom: true }));
  return [...base, ...custom].map((i) => ({
    ...i,
    checked: !!ps.checked[i.id],
    expiry: ps.expiry[i.id] || undefined,
    status: expiryStatus(ps.expiry[i.id], now),
  }));
}

export function progress(items: { checked: boolean }[]): { done: number; total: number; pct: number } {
  const total = items.length;
  const done = items.filter((i) => i.checked).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** Yaklaşan ve geçmiş öğeler, en acil önce. */
export function alerts(items: ViewItem[]): ViewItem[] {
  return items.filter((i) => i.status === 'soon' || i.status === 'expired').sort((a, b) => compareExpiry(a.expiry, b.expiry));
}

// ---- Değiştiriciler (yeni durum döndürür) ----

function patchProfile(s: CantaState, p: ProfileId, f: (ps: ProfileState) => ProfileState): CantaState {
  return { ...s, profiles: { ...s.profiles, [p]: f(s.profiles[p]) } };
}

export function toggleItem(s: CantaState, id: string, p: ProfileId = s.profile): CantaState {
  return patchProfile(s, p, (ps) => ({ ...ps, checked: { ...ps.checked, [id]: !ps.checked[id] } }));
}

export function setExpiry(s: CantaState, id: string, date: string, p: ProfileId = s.profile): CantaState {
  return patchProfile(s, p, (ps) => {
    const expiry = { ...ps.expiry };
    if (date) expiry[id] = date;
    else delete expiry[id];
    return { ...ps, expiry };
  });
}

export function addCustom(s: CantaState, name: string, group: GroupId, p: ProfileId = s.profile): CantaState {
  const nm = name.trim().slice(0, 80);
  if (!nm) return s;
  return patchProfile(s, p, (ps) => ({ ...ps, custom: [...ps.custom, { id: newId('c'), group, name: nm }] }));
}

export function removeCustom(s: CantaState, id: string, p: ProfileId = s.profile): CantaState {
  return patchProfile(s, p, (ps) => {
    const checked = { ...ps.checked };
    const expiry = { ...ps.expiry };
    delete checked[id];
    delete expiry[id];
    return { custom: ps.custom.filter((c) => c.id !== id), checked, expiry };
  });
}

export function resetChecks(s: CantaState, p: ProfileId = s.profile): CantaState {
  return patchProfile(s, p, (ps) => ({ ...ps, checked: {} }));
}
