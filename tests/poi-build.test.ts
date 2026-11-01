import { describe, expect, it } from 'vitest';
import { overpassQuery, tileBbox, toFeatures, TURKIYE_BBOX } from '../src/lib/map/poi-build';
import { parsePoiGeoJSON } from '../src/lib/map/poi';

describe('poi-build', () => {
  it('Türkiye kutusu bölgelere eksiksiz bölünür', () => {
    const t = tileBbox(TURKIYE_BBOX, 3, 5);
    expect(t).toHaveLength(15);
    expect(t[0][0]).toBe(35.8);
    expect(t[14][2]).toBe(42.15);
    expect(t[14][3]).toBe(44.85);
  });
  it('sorgu toplanma, sağlık, eczane, su ve barınma etiketlerini içerir', () => {
    const q = overpassQuery([36, 26, 37, 27]);
    for (const k of ['assembly_point', 'pharmacy', 'hospital', 'drinking_water', 'spring', 'shelter', 'out center']) expect(q).toContain(k);
  });
  it('Overpass öğeleri paket biçimine çevrilir, tekrarlar atlanır', () => {
    const els = [
      { type: 'node', id: 1, lat: 39.91, lon: 32.84, tags: { emergency: 'assembly_point', name: 'Park toplanma alanı' } },
      { type: 'way', id: 2, center: { lat: 39.92, lon: 32.85 }, tags: { amenity: 'hospital', name: 'Devlet Hastanesi', phone: '112' } },
      { type: 'node', id: 3, lat: 39.93, lon: 32.86, tags: { amenity: 'drinking_water', drinking_water: 'no' } },
      { type: 'node', id: 1, lat: 39.91, lon: 32.84, tags: { emergency: 'assembly_point' } },
      { type: 'node', id: 4, lat: 39.94, lon: 32.87, tags: { natural: 'spring' } },
    ];
    const f = toFeatures(els as any);
    expect(f.map((x) => x.properties.type)).toEqual(['toplanma', 'saglik', 'su']);
    const pois = parsePoiGeoJSON({ type: 'FeatureCollection', features: f });
    expect(pois).toHaveLength(3);
    expect(pois[1].note).toContain('112');
    expect(pois[2].name).toBe('Su');
  });
});

import { buildPoiGeoJSON } from '../src/lib/map/poi-build';
import { vi } from 'vitest';

describe('buildPoiGeoJSON (sahte sunucu)', () => {
  it('meşgul sunucuda başka aynaya geçer, tüm bölgeleri birleştirir', async () => {
    let n = 0;
    const fetchMock = vi.fn(async (url: string) => {
      n++;
      if (n === 1) return new Response('busy', { status: 504 });
      return new Response(JSON.stringify({ elements: [{ type: 'node', id: n, lat: 39, lon: 32, tags: { amenity: 'pharmacy' } }] }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.useFakeTimers({ shouldAdvanceTime: true, advanceTimeDelta: 50 });
    const notes: string[] = [];
    const text = await buildPoiGeoJSON((p) => p.note && notes.push(p.note));
    vi.useRealTimers();
    vi.unstubAllGlobals();
    const fc = JSON.parse(text);
    expect(fc.features.length).toBe(24);
    expect(notes.some((x) => /504/.test(x))).toBe(true);
    const urls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(urls.some((u) => u.includes('private.coffee'))).toBe(true);
  }, 60000);
});

describe('buildPoiGeoJSON sürdürme', () => {
  it('ara kayıttaki bölgeleri yeniden sorgulamaz', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ elements: [{ type: 'node', id: Math.random() * 1e9 | 0, lat: 39, lon: 32, tags: { amenity: 'pharmacy' } }] }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    let saved: any = null;
    const cp = {
      load: async () => ({ done: Array.from({ length: 20 }, (_, i) => i), features: [{ type: 'Feature', id: 'n1', geometry: { type: 'Point', coordinates: [32, 39] }, properties: { type: 'eczane' } }] }),
      save: async (c: any) => {
        saved = c;
      },
    };
    const fc = JSON.parse(await buildPoiGeoJSON(() => {}, undefined, cp));
    vi.unstubAllGlobals();
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fc.features.length).toBe(5);
    expect(saved.done.length).toBe(24);
  });
});

describe('buildPoiGeoJSON alınamayan bölge', () => {
  it('bir bölge hiç alınamazsa diğerleri biter, hata eksikleri söyler; "Devam" yalnızca eksiği dener', async () => {
    const { POI_BUILD_TUNING, tileBbox: tb, TURKIYE_BBOX: box, overpassQuery: q } = await import('../src/lib/map/poi-build');
    const saved = { ...POI_BUILD_TUNING };
    POI_BUILD_TUNING.retryPauseMs = 5;
    POI_BUILD_TUNING.backoffMs = 1;
    const badBody = 'data=' + encodeURIComponent(q(tb(box, 4, 6)[5]));
    let broken = true;
    let id = 1;
    const fetchMock = vi.fn(async (_u: string, init: any) => {
      if (broken && init?.body === badBody) return new Response('', { status: 503 });
      return new Response(JSON.stringify({ elements: [{ type: 'node', id: id++, lat: 39, lon: 32, tags: { amenity: 'pharmacy' } }] }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    let cpData: any = null;
    const cp = { load: async () => cpData, save: async (c: any) => void (cpData = c) };
    try {
      await expect(buildPoiGeoJSON(() => {}, undefined, cp)).rejects.toThrow(/1 bölge alınamadı/);
      expect(cpData.done.length).toBe(23);
      expect(cpData.done).not.toContain(5);
      const callsBefore = fetchMock.mock.calls.length;
      broken = false;
      const fc = JSON.parse(await buildPoiGeoJSON(() => {}, undefined, cp));
      expect(fetchMock.mock.calls.length - callsBefore).toBe(1);
      expect(fc.features.length).toBe(24);
    } finally {
      Object.assign(POI_BUILD_TUNING, saved);
      vi.unstubAllGlobals();
    }
  }, 30000);
});
