// Uygulama geneli ayarlar: yazı boyutu, yüksek kontrast, azaltılmış hareket,
// düşük güç. localStorage'da ('ac.settings') saklanır, açılışta <html> öğesine
// sınıf ve CSS değişkeni olarak uygulanır (src/styles/app.css).
//
// Diğer modüller okuyabilir:
//   import { getSettings, onSettingsChange } from '../lib/settings';
//   if (getSettings().lowPower) { ... }        // örn. harita: daha az iş
//   const off = onSettingsChange((s) => ...);  // değişince haber al
import { getState, setState } from './store';

export type TextSize = 0 | 1 | 2 | 3;

export interface Settings {
  /** 0 = normal, 3 = en büyük */
  textSize: TextSize;
  highContrast: boolean;
  reduceMotion: boolean;
  /** Düşük güç: OLED siyahı, animasyon yok, harita daha az çalışır, pil tasarrufu açık */
  lowPower: boolean;
  /** Android: internet varken günde bir GitHub'da yeni sürüm var mı diye bak (kurulum yine düğmeyle) */
  updateCheck: boolean;
}

export const SETTINGS_KEY = 'ac.settings';

/** Yazı boyutu adımları: arayüz ölçeği (CSS zoom) */
export const TEXT_SCALES: readonly number[] = [1, 1.12, 1.25, 1.4];
export const TEXT_LABELS: readonly string[] = ['Normal', 'Büyük', 'Çok büyük', 'En büyük'];

export const DEFAULTS: Settings = { textSize: 0, highContrast: false, reduceMotion: false, lowPower: false, updateCheck: true };

type Listener = (s: Settings) => void;
const listeners = new Set<Listener>();

/** Bozuk ya da eski kayıtları güvenli değerlere çevirir. */
export function normalizeSettings(raw: unknown, systemReduceMotion = false): Settings {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const ts = Number(o.textSize);
  return {
    textSize: (Number.isInteger(ts) && ts >= 0 && ts <= 3 ? ts : 0) as TextSize,
    highContrast: o.highContrast === true,
    reduceMotion: typeof o.reduceMotion === 'boolean' ? o.reduceMotion : systemReduceMotion,
    lowPower: o.lowPower === true,
    updateCheck: o.updateCheck !== false,
  };
}

export function parseSettings(json: string | null, systemReduceMotion = false): Settings {
  if (!json) return normalizeSettings({}, systemReduceMotion);
  try {
    return normalizeSettings(JSON.parse(json), systemReduceMotion);
  } catch {
    return normalizeSettings({}, systemReduceMotion);
  }
}

/** <html> öğesine konacak sınıflar */
export function rootClasses(s: Settings): Record<string, boolean> {
  return {
    'hc': s.highContrast,
    'reduce-motion': s.reduceMotion || s.lowPower,
    'lowpower': s.lowPower,
  };
}

/** Gezinme çubuğu yazısı için ölçek: 6 sekme 390 px'e sığsın diye sınırlı */
export function navScale(s: Settings) {
  return Math.min(TEXT_SCALES[s.textSize], 1.15);
}

function systemPrefersReducedMotion() {
  try {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function load(): Settings {
  try {
    return parseSettings(localStorage.getItem(SETTINGS_KEY), systemPrefersReducedMotion());
  } catch {
    return { ...DEFAULTS, reduceMotion: systemPrefersReducedMotion() };
  }
}

let current: Settings = typeof localStorage !== 'undefined' ? load() : { ...DEFAULTS };

export function getSettings(): Settings {
  return current;
}

export function onSettingsChange(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function applySettings(s: Settings = current) {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  for (const [cls, on] of Object.entries(rootClasses(s))) el.classList.toggle(cls, on);
  el.style.setProperty('--ui-scale', String(TEXT_SCALES[s.textSize]));
  el.style.setProperty('--nav-scale', String(navScale(s)));
  el.dataset.textSize = String(s.textSize);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', s.lowPower ? '#000000' : '#0e1b2c');
}

export function setSettings(patch: Partial<Settings>) {
  const prev = current;
  current = normalizeSettings({ ...current, ...patch });
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  } catch {}
  applySettings(current);
  // Düşük güç, mevcut pil tasarrufunu da açar (Fener kapanır, harita animasyonsuz).
  if ('lowPower' in patch && prev.lowPower !== current.lowPower) {
    try {
      if (getState().batterySaver !== current.lowPower) setState({ batterySaver: current.lowPower });
    } catch {}
  }
  listeners.forEach((l) => l(current));
}

/** Açılışta bir kez: kayıtlı ayarları uygular. main.tsx bu modülü içe aktarır. */
export function initSettings() {
  applySettings(current);
  if (current.lowPower && !getState().batterySaver) setState({ batterySaver: true });
}

// ---- yardımcılar (Ayarlar aracı) ----

/** Bayt → "1,2 GB" biçimi (Türkçe ondalık virgül) */
export function formatBytes(n: number | undefined | null): string {
  if (n == null || !Number.isFinite(n) || n < 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let v = n;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  const s = i === 0 ? String(Math.round(v)) : v.toFixed(v >= 100 ? 0 : 1).replace('.', ',');
  return s + ' ' + units[i];
}

export function usagePercent(usage?: number, quota?: number): number | null {
  if (!usage || !quota || quota <= 0) return usage === 0 && quota ? 0 : null;
  return Math.min(100, Math.max(0, (usage / quota) * 100));
}

/** Uygulamanın localStorage anahtarları 'ac.' ile başlar; diğer anahtarlar da silinir. */
export async function resetData(opts: { packs: boolean }): Promise<string[]> {
  const errors: string[] = [];
  try {
    localStorage.clear();
  } catch (e) {
    errors.push('Ayarlar silinemedi');
  }
  try {
    sessionStorage.clear();
  } catch {}
  try {
    const nav: any = navigator;
    if (nav.storage?.getDirectory) {
      const root: FileSystemDirectoryHandle = await nav.storage.getDirectory();
      const names: string[] = [];
      // @ts-ignore - entries() async iterator
      for await (const [name] of (root as any).entries()) names.push(name);
      for (const name of names) {
        if (name === 'packs' && !opts.packs) continue;
        await root.removeEntry(name, { recursive: true }).catch(() => errors.push(name + ' silinemedi'));
      }
    }
  } catch {
    errors.push('Dosya deposuna erişilemedi');
  }
  try {
    if (typeof caches !== 'undefined') for (const k of await caches.keys()) await caches.delete(k);
  } catch {}
  current = { ...DEFAULTS, reduceMotion: systemPrefersReducedMotion() };
  return errors;
}

// Yan etki: tarayıcıda içe aktarılınca ayarları hemen uygula (ilk çizimden önce).
if (typeof document !== 'undefined') initSettings();
