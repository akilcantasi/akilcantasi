import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULTS,
  TEXT_SCALES,
  formatBytes,
  getSettings,
  navScale,
  normalizeSettings,
  onSettingsChange,
  parseSettings,
  rootClasses,
  setSettings,
  usagePercent,
} from '../src/lib/settings';
import { getState, setState } from '../src/lib/store';

describe('ayarlar: okuma ve doğrulama', () => {
  it('boş ya da bozuk kayıt varsayılanlara döner', () => {
    expect(parseSettings(null)).toEqual(DEFAULTS);
    expect(parseSettings('{bozuk')).toEqual(DEFAULTS);
    expect(parseSettings('42')).toEqual(DEFAULTS);
  });
  it('sistem "hareketi azalt" tercihi yalnızca kayıt yoksa kullanılır', () => {
    expect(parseSettings(null, true).reduceMotion).toBe(true);
    expect(parseSettings('{"reduceMotion":false}', true).reduceMotion).toBe(false);
  });
  it('geçersiz yazı boyutu düzeltilir', () => {
    expect(normalizeSettings({ textSize: 7 }).textSize).toBe(0);
    expect(normalizeSettings({ textSize: -1 }).textSize).toBe(0);
    expect(normalizeSettings({ textSize: 1.5 }).textSize).toBe(0);
    expect(normalizeSettings({ textSize: '2' }).textSize).toBe(2);
    expect(normalizeSettings({ textSize: 3 }).textSize).toBe(3);
  });
  it('yalnız gerçek true değerleri açar', () => {
    const s = normalizeSettings({ highContrast: 'yes', lowPower: 1 });
    expect(s.highContrast).toBe(false);
    expect(s.lowPower).toBe(false);
  });
  it('dört adım, artan ölçek', () => {
    expect(TEXT_SCALES).toHaveLength(4);
    expect(TEXT_SCALES[0]).toBe(1);
    for (let i = 1; i < 4; i++) expect(TEXT_SCALES[i]).toBeGreaterThan(TEXT_SCALES[i - 1]);
  });
});

describe('ayarlar: uygulama', () => {
  it('düşük güç hareketi de azaltır', () => {
    expect(rootClasses({ ...DEFAULTS, lowPower: true })).toEqual({ hc: false, 'reduce-motion': true, lowpower: true });
    expect(rootClasses({ ...DEFAULTS, highContrast: true })['hc']).toBe(true);
  });
  it('gezinme yazısı 6 sekme sığsın diye sınırlı büyür', () => {
    expect(navScale({ ...DEFAULTS, textSize: 0 })).toBe(1);
    expect(navScale({ ...DEFAULTS, textSize: 3 })).toBeLessThanOrEqual(1.15);
  });
  it('setSettings dinleyicileri çağırır, düşük güç pil tasarrufunu açar/kapatır', () => {
    setState({ batterySaver: false });
    const seen: boolean[] = [];
    const off = onSettingsChange((s) => seen.push(s.lowPower));
    setSettings({ lowPower: true });
    expect(getSettings().lowPower).toBe(true);
    expect(getState().batterySaver).toBe(true);
    setSettings({ lowPower: false });
    expect(getState().batterySaver).toBe(false);
    off();
    setSettings({ lowPower: true });
    expect(seen).toEqual([true, false]);
    setSettings({ lowPower: false });
  });
});

describe('ayarlar: biçimlendirme', () => {
  it('bayt biçimi Türkçe ondalık virgül kullanır', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(999)).toBe('999 B');
    expect(formatBytes(1500)).toBe('1,5 KB');
    expect(formatBytes(250_000_000)).toBe('250 MB');
    expect(formatBytes(4_200_000_000)).toBe('4,2 GB');
    expect(formatBytes(undefined)).toBe('—');
    expect(formatBytes(NaN)).toBe('—');
  });
  it('doluluk yüzdesi', () => {
    expect(usagePercent(50, 200)).toBe(25);
    expect(usagePercent(0, 200)).toBe(0);
    expect(usagePercent(500, 200)).toBe(100);
    expect(usagePercent(undefined, undefined)).toBeNull();
  });
});

// ---- WCAG AA: koyu temadaki ana yazı renkleri (src/styles/app.css) ----
function lum(hex: string) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
function vars(block: string) {
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) out[m[1]] = m[2];
  return out;
}

describe('erişilebilirlik: renk kontrastı', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../src/styles/app.css'), 'utf8');
  const root = vars(css.match(/:root\s*\{([^}]*)\}/)![1]);
  const hc = { ...root, ...vars(css.match(/html\.hc\s*\{([^}]*)\}/)![1]) };
  const lp = { ...root, ...vars(css.match(/html\.lowpower\s*\{([^}]*)\}/)![1]) };
  const texts = ['text', 'text2', 'muted', 'muted2', 'accent', 'accent2', 'danger', 'ok', 'blue'];
  const bgs = ['bg', 'bg2', 'card', 'nav-bg'];
  for (const [name, theme] of [['koyu', root], ['yüksek kontrast', hc], ['düşük güç', lp]] as const) {
    it(`${name}: yazı renkleri tüm zeminlerde ≥ 4.5:1`, () => {
      for (const t of texts)
        for (const b of bgs) {
          const r = contrast(theme[t], theme[b]);
          expect(r, `${t} (${theme[t]}) / ${b} (${theme[b]}) = ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
        }
    });
  }
  it('birincil düğme (koyu yazı / turuncu) ≥ 4.5:1', () => {
    expect(contrast(root['on-accent'], root.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(root['on-accent'], root.accent2)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#000000', hc.accent)).toBeGreaterThanOrEqual(4.5);
  });
  it('yüksek kontrastta kenarlar zemine karşı ≥ 3:1 (WCAG 1.4.11)', () => {
    for (const l of ['line', 'line2', 'line3']) expect(contrast(hc[l], hc.bg)).toBeGreaterThanOrEqual(3);
  });
  it('yüksek kontrastta yazılar saf beyaz', () => {
    for (const t of ['text', 'text2', 'muted', 'muted2']) expect(hc[t].toLowerCase()).toMatch(/^#f{3}(f{3})?$/);
  });
});
