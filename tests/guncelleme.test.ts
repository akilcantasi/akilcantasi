import { describe, expect, it } from 'vitest';
import { DENETIM_ARASI_MS, denetimZamani } from '../src/lib/guncelleme';
import { normalizeSettings } from '../src/lib/settings';

describe('uygulama güncellemesi', () => {
  it('denetim varsayılan açık, kapatılabilir', () => {
    expect(normalizeSettings({}).updateCheck).toBe(true);
    expect(normalizeSettings({ updateCheck: false }).updateCheck).toBe(false);
  });
  it('günde en çok bir kez, yalnız çevrimiçi ve ayar açıkken', () => {
    const t = 10 * DENETIM_ARASI_MS;
    expect(denetimZamani({ sonDenetim: 0 }, t, true, true)).toBe(true);
    expect(denetimZamani({ sonDenetim: t - 1000 }, t, true, true)).toBe(false);
    expect(denetimZamani({ sonDenetim: t - DENETIM_ARASI_MS }, t, true, true)).toBe(true);
    expect(denetimZamani({ sonDenetim: 0 }, t, false, true)).toBe(false);
    expect(denetimZamani({ sonDenetim: 0 }, t, true, false)).toBe(false);
    expect(denetimZamani(null, t, true, true)).toBe(false);
  });
});
