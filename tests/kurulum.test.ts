// İlk açılış kurulumu: cihaza göre önerilen paketler
import { describe, expect, it } from 'vitest';
import raw from '../public/packs-manifest.json';
import { recommendSetup } from '../src/Kurulum';

const GB = 1024 ** 3;
const ids = new Set((raw as any).packs.map((p: any) => p.id));
const on = (o: Parameters<typeof recommendSetup>[0]) => recommendSetup(o).filter((i) => i.on).map((i) => i.id);

describe('kurulum önerileri', () => {
  it('önerilen her paket katalogda var', () => {
    for (const mem of [2, 8])
      for (const i of recommendSetup({ freeBytes: 50 * GB, memGB: mem })) expect(ids.has(i.id), i.id).toBe(true);
  });

  it('az yerde yalnız küçük ve hayati paketler seçili', () => {
    const s = on({ freeBytes: 2 * GB, memGB: 2 });
    expect(s).toEqual(expect.arrayContaining(['poi-tr-afet', 'harita-tr-genel', 'nhs-ilac', 'hava-tr']));
    expect(s).not.toContain('harita-tr-detay');
    expect(s).not.toContain('wikipedia-tr-mini');
    expect(s.some((x) => x.startsWith('fener-'))).toBe(false);
  });

  it('bol yerli güçlü cihazda sokak haritası, Vikipedi ve daha yetenekli model', () => {
    const s = on({ freeBytes: 40 * GB, memGB: 8 });
    expect(s).toEqual(expect.arrayContaining(['harita-tr-detay', 'wikipedia-tr-mini', 'fener-qwen3.5-2b']));
  });

  it('zayıf cihazda hafif model', () => {
    expect(on({ freeBytes: 40 * GB, memGB: 3 })).toContain('fener-qwen3.5-0.8b');
  });
});

describe('güncelleme algılama', async () => {
  const { isOutdated } = await import('../src/lib/packs-ui');
  it('Kiwix: farklı tarihli dosya adı → güncelleme var', () => {
    expect(isOutdated({ file: 'wikipedia_tr_all_mini_2026-09.zim', size: 10, sizeApprox: false }, { id: 'wikipedia_tr_all_mini_2026-03.zim', size: 9 })).toBe(true);
  });
  it('harita: aynı ad, farklı boyut → güncelleme var', () => {
    expect(isOutdated({ file: 'turkiye.pmtiles', size: 900, sizeApprox: false }, { id: 'turkiye.pmtiles', size: 857 })).toBe(true);
  });
  it('aynı ad ve boyut, ya da yaklaşık boyut → güncel', () => {
    expect(isOutdated({ file: 'turkiye.pmtiles', size: 857, sizeApprox: false }, { id: 'turkiye.pmtiles', size: 857 })).toBe(false);
    expect(isOutdated({ file: 'x.geojson', size: 15, sizeApprox: true }, { id: 'x.geojson', size: 10 })).toBe(false);
    expect(isOutdated({ file: 'x.zim', size: 1, sizeApprox: false }, undefined)).toBe(false);
  });
});
