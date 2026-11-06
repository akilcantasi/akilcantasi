// Denetim 2026-11 (Rehber + Harita): düzeltilen hataların birim testleri.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { addPmtilesSource, dropPmtilesSource, pmtilesSourceCount } from '../src/lib/map/pmtilesSource';
import { parsePoiGeoJSON } from '../src/lib/map/poi';
import { BytesSource } from '../src/lib/source';
import { searchGuides } from '../src/lib/guides-search';

describe('harita kaynağı sekme değişiminde birikmez', () => {
  const bytes = new Uint8Array(readFileSync(fileURLToPath(new URL('../testdata/sample_ornek.pmtiles', import.meta.url))));
  const ml = { addProtocol: vi.fn() };
  afterEach(() => vi.useRealTimers());

  it('aynı paket (ad + boyut) yeniden açılınca aynı PMTiles ve anahtar kullanılır', async () => {
    const a = addPmtilesSource(ml, new BytesSource(bytes, 'ornek.pmtiles'));
    const n = pmtilesSourceCount();
    for (let i = 0; i < 5; i++) {
      // Harita sekmesine her girişte kaynak yeniden açılır (yeni nesne, aynı dosya)
      const b = addPmtilesSource(ml, new BytesSource(bytes, 'ornek.pmtiles'));
      expect(b.url).toBe(a.url);
      expect(b.pmtiles).toBe(a.pmtiles);
    }
    expect(pmtilesSourceCount()).toBe(n);
    expect(ml.addProtocol).toHaveBeenCalledTimes(1);
    expect((await a.pmtiles.getHeader()).specVersion).toBe(3);
  });

  it('paket değişince (boyut farklı) yeni anahtar alınır, eskisi bir süre sonra bırakılır', () => {
    vi.useFakeTimers();
    const a = addPmtilesSource(ml, new BytesSource(bytes, 'degisen.pmtiles'));
    vi.advanceTimersByTime(16_000); // önceki testin paketi bırakılsın
    const before = pmtilesSourceCount();
    const b = addPmtilesSource(ml, new BytesSource(bytes.subarray(0, bytes.length - 1), 'degisen.pmtiles'));
    expect(b.url).not.toBe(a.url);
    expect(pmtilesSourceCount()).toBe(before + 1);
    vi.advanceTimersByTime(16_000);
    expect(pmtilesSourceCount()).toBe(before);
  });

  it('okunamayan kaynak unutulur: sonraki açılış yeniden dener', () => {
    const a = addPmtilesSource(ml, new BytesSource(new Uint8Array(10), 'bozuk.pmtiles'));
    const n = pmtilesSourceCount();
    dropPmtilesSource(a.url);
    expect(pmtilesSourceCount()).toBe(n - 1);
    const b = addPmtilesSource(ml, new BytesSource(new Uint8Array(10), 'bozuk.pmtiles'));
    expect(b.pmtiles).not.toBe(a.pmtiles);
  });
});

describe('nokta paketi', () => {
  it('yinelenen kimlikler benzersizleştirilir (işaretçi ve seçim kimlikle tutulur)', () => {
    const f = (id: string | number, lon: number) => ({ type: 'Feature', id, properties: { type: 'su', name: 'Çeşme' }, geometry: { type: 'Point', coordinates: [lon, 39.92] } });
    const pois = parsePoiGeoJSON({ type: 'FeatureCollection', features: [f('a', 32.85), f('a', 32.86), f(7, 32.87)] });
    expect(pois).toHaveLength(3);
    expect(new Set(pois.map((p) => p.id)).size).toBe(3);
    expect(pois[0].id).toBe('a');
    expect(pois[2].id).toBe('7');
  });
});

describe('rehber araması', () => {
  it('3 harflik kelime başka kelimenin başı sayılmaz ("sığ" ≠ "sığınak")', () => {
    const ids = searchGuides('sığınak', 5).map((r) => r.guide.id);
    expect(ids).not.toContain('yaralanma-omurga');
    expect(ids.slice(0, 2).sort()).toEqual(['hayatta-kalma-barinak', 'nukleer-korunma-odasi']);
  });
  it('3 harflik kök ek almış hâlini yine bulur', () => {
    expect(searchGuides('kan', 3).length).toBeGreaterThan(0);
    expect(searchGuides('selde', 1)[0]?.guide.id).toMatch(/^sel/);
  });
  it('Türkçe büyük harf ve harfsiz yazım aynı sonucu verir', () => {
    const top = (q: string) => searchGuides(q, 1)[0]?.guide.id;
    expect(top('KALP MASAJI')).toBe('temel-yasam-destegi');
    expect(top('ILK YARDIM')).toBe(top('İlk yardım'));
    expect(top('BOĞULMA')).toBe(top('bogulma'));
    expect(top('ÇIĞ')).toBe('hava-cig');
    expect(top('cig')).toBe('hava-cig');
  });
});

describe('rehber paketi açılamazsa arayüz haberdar edilir', () => {
  afterEach(() => {
    vi.doUnmock('../src/lib/packs');
    vi.resetModules();
  });

  it('hata değişince aboneler çağrılır (kart "açılıyor…" yazısında kalmaz)', async () => {
    vi.resetModules();
    vi.doMock('../src/lib/packs', () => ({
      listPacks: async () => [{ id: 'kendine-yetmek.rehber.json', kind: 'rehber', size: 7, origin: 'device' }],
      openBlob: async () => new Blob(['{bozuk']),
    }));
    const pg = await import('../src/content/pack-guides');
    const seen = vi.fn();
    pg.subscribePackGuides(seen);
    await pg.reloadPackGuides();
    expect(pg.packErrors['kendine-yetmek.rehber.json']?.[0]).toMatch(/JSON/);
    expect(seen).toHaveBeenCalledTimes(1);
    // Aynı hata yeniden: gereksiz yeniden çizim yok
    await pg.reloadPackGuides();
    expect(seen).toHaveBeenCalledTimes(1);
  });
});
