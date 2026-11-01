// Kaynak araçlarının (çanta, hesap, stok, pil) yerel kayıt yardımcıları.
// localStorage yoksa veya hata verirse sessizce bellek içi değere düşer.

const mem = new Map<string, string>();

export const KEYS = {
  canta: 'ac.kaynak.canta.v1',
  hesap: 'ac.kaynak.hesap.v1',
  stok: 'ac.kaynak.stok.v1',
  pil: 'ac.kaynak.pil.v1',
} as const;

function ls(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function loadJSON<T>(key: string, def: T): T {
  let raw: string | null = null;
  try {
    raw = ls()?.getItem(key) ?? mem.get(key) ?? null;
  } catch {
    raw = mem.get(key) ?? null;
  }
  if (raw == null) return def;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return def;
  }
}

export function saveJSON(key: string, v: unknown): boolean {
  const raw = JSON.stringify(v);
  mem.set(key, raw);
  try {
    ls()?.setItem(key, raw);
    return true;
  } catch {
    return false;
  }
}

/** Testler için bellek içi kaydı temizler. */
export function _resetMem() {
  mem.clear();
}

let seq = 0;
export function newId(prefix = 'i'): string {
  seq = (seq + 1) % 1e6;
  return prefix + Date.now().toString(36) + seq.toString(36) + Math.floor(Math.random() * 1296).toString(36);
}
