import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PMTiles } from 'pmtiles';
import {
  bearingDeg,
  compassLong,
  compassText,
  distanceM,
  formatDecimal,
  formatDistance,
  formatDuration,
  locationMessage,
  nearest,
  smsHref,
  toDMS,
  walkMinutes,
} from '../src/lib/map/geo';
import { RandomAccessPmtilesSource } from '../src/lib/map/pmtilesSource';
import { parsePoiGeoJSON, poiBounds } from '../src/lib/map/poi';
import { darkProtomapsStyle, backgroundOnlyStyle } from '../src/lib/map/style';
import { BytesSource } from '../src/lib/source';

const KIZILAY = { lat: 39.9208, lon: 32.8541 };
const GOLBASI = { lat: 39.7883, lon: 32.8075 };

describe('geo', () => {
  it('Kızılay → Gölbaşı mesafesi 12–18 km', () => {
    const d = distanceM(KIZILAY, GOLBASI);
    expect(d).toBeGreaterThan(12_000); // ≈ 15,3 km
    expect(d).toBeLessThan(18_000);
    expect(distanceM(KIZILAY, KIZILAY)).toBe(0);
  });

  it('yön açısı', () => {
    // Gölbaşı, Kızılay'ın güney-güneybatısında (≈ 195°)
    const b = bearingDeg(KIZILAY, GOLBASI);
    expect(b).toBeGreaterThan(190);
    expect(b).toBeLessThan(205);
    expect(bearingDeg({ lat: 0, lon: 0 }, { lat: 1, lon: 0 })).toBeCloseTo(0, 5);
    expect(bearingDeg({ lat: 0, lon: 0 }, { lat: 0, lon: 1 })).toBeCloseTo(90, 5);
    expect(bearingDeg({ lat: 0, lon: 0 }, { lat: -1, lon: 0 })).toBeCloseTo(180, 5);
    expect(bearingDeg({ lat: 0, lon: 0 }, { lat: 0, lon: -1 })).toBeCloseTo(270, 5);
  });

  it('16 yönlü Türkçe pusula', () => {
    expect(compassText(0)).toBe('K');
    expect(compassText(359)).toBe('K');
    expect(compassText(22.5)).toBe('KKD');
    expect(compassText(45)).toBe('KD');
    expect(compassText(90)).toBe('D');
    expect(compassText(135)).toBe('GD');
    expect(compassText(180)).toBe('G');
    expect(compassText(200)).toBe('GGB');
    expect(compassText(225)).toBe('GB');
    expect(compassText(270)).toBe('B');
    expect(compassText(292.5)).toBe('BKB');
    expect(compassText(315)).toBe('KB');
    expect(compassText(337.5)).toBe('KKB');
    expect(compassText(-90)).toBe('B');
    expect(compassText(bearingDeg(KIZILAY, GOLBASI))).toBe('GGB');
    expect(compassLong(45)).toBe('kuzeydoğu');
  });

  it('yürüme süresi ve biçimler', () => {
    expect(walkMinutes(4500)).toBe(60);
    expect(walkMinutes(375)).toBe(5);
    expect(walkMinutes(0)).toBe(1);
    expect(formatDistance(8.4)).toBe('8 m');
    expect(formatDistance(347)).toBe('350 m');
    expect(formatDistance(1234)).toBe('1,2 km');
    expect(formatDistance(9960)).toBe('10,0 km');
    expect(formatDistance(27_400)).toBe('27 km');
    expect(formatDuration(5)).toBe('5 dk');
    expect(formatDuration(80)).toBe('1 sa 20 dk');
    expect(formatDuration(120)).toBe('2 sa');
  });

  it('koordinat biçimleri (ondalık + DMS)', () => {
    expect(formatDecimal(39.92, 32.85)).toBe('39.920000, 32.850000');
    expect(toDMS(39.92, 'lat')).toBe('39° 55′ 12,0″ K');
    expect(toDMS(32.850333, 'lon')).toBe('32° 51′ 01,2″ D');
    expect(toDMS(-33.8568, 'lat')).toBe('33° 51′ 24,5″ G');
    expect(toDMS(-0.5, 'lon')).toBe('0° 30′ 00,0″ B');
    // 59.99999″ yuvarlaması bir sonraki dakikaya taşmalı
    expect(toDMS(40.9999999, 'lat')).toBe('41° 00′ 00,0″ K');
    expect(locationMessage(39.92, 32.85)).toBe('Konumum: 39.920000,32.850000 (Akıl Çantası)');
    expect(smsHref(39.92, 32.85)).toBe('sms:?&body=' + encodeURIComponent('Konumum: 39.920000,32.850000 (Akıl Çantası)'));
  });

  it('en yakın nokta', () => {
    const n = nearest(KIZILAY, [GOLBASI, { lat: 39.92, lon: 32.85 }]);
    expect(n!.item.lon).toBe(32.85);
    expect(nearest(KIZILAY, [])).toBeNull();
  });
});

describe('POI paketi', () => {
  const path = fileURLToPath(new URL('../testdata/sample_poi_ornek.geojson', import.meta.url));
  it('örnek GeoJSON okunur, geçersiz kayıtlar atlanır', () => {
    const pois = parsePoiGeoJSON(readFileSync(path, 'utf8'));
    expect(pois.length).toBe(60);
    for (const t of ['toplanma', 'saglik', 'eczane', 'su', 'barinma']) expect(pois.filter((p) => p.type === t).length).toBe(12);
    expect(pois.every((p) => p.name.startsWith('Örnek'))).toBe(true);
    const b = poiBounds(pois)!;
    expect(b[0][0]).toBeGreaterThanOrEqual(32.64);
    expect(b[1][1]).toBeLessThanOrEqual(39.97);

    const bad = parsePoiGeoJSON({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [32.85, 39.92] }, properties: { type: 'su' } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [32.85, 39.92] }, properties: { type: 'bilinmeyen' } },
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: { type: 'su' } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [500, 39.92] }, properties: { type: 'su' } },
      ],
    });
    expect(bad.length).toBe(1);
    expect(bad[0].name).toBe('Su');
    expect(() => parsePoiGeoJSON('{"type":"Feature"}')).toThrow();
  });
});

describe('PMTiles kaynağı', () => {
  const path = fileURLToPath(new URL('../testdata/sample_ornek.pmtiles', import.meta.url));
  const bytes = new Uint8Array(readFileSync(path));

  it('BytesSource üzerinden başlık okunur', async () => {
    const pm = new PMTiles(new RandomAccessPmtilesSource(new BytesSource(bytes, 'sample_ornek.pmtiles')));
    const h = await pm.getHeader();
    expect(h.specVersion).toBe(3);
    expect(h.tileType).toBe(1); // MVT
    expect(h.minZoom).toBe(10);
    expect(h.maxZoom).toBe(15);
    expect(h.minLon).toBeCloseTo(32.64, 4);
    expect(h.maxLat).toBeCloseTo(39.97, 4);
    const meta: any = await pm.getMetadata();
    expect(meta.vector_layers.map((l: any) => l.id)).toEqual(expect.arrayContaining(['earth', 'water', 'roads', 'landuse', 'buildings']));
  });

  it('karo okunur (z12 merkez)', async () => {
    const pm = new PMTiles(new RandomAccessPmtilesSource(new BytesSource(bytes)));
    const n = 2 ** 12;
    const x = Math.floor(((32.79 + 180) / 360) * n);
    const lr = (39.91 * Math.PI) / 180;
    const y = Math.floor(((1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2) * n);
    const t = await pm.getZxy(12, x, y);
    expect(t).toBeTruthy();
    expect(t!.data.byteLength).toBeGreaterThan(20);
    expect(await pm.getZxy(9, 0, 0)).toBeUndefined();
  });

  it('alt-dizi görünümü kopyalanır (ArrayBuffer tam boy)', async () => {
    const src = new RandomAccessPmtilesSource(new BytesSource(bytes));
    const r = await src.getBytes(10, 20);
    expect(r.data.byteLength).toBe(20);
    expect(new Uint8Array(r.data)[0]).toBe(bytes[10]);
  });
});

describe('stil', () => {
  it('uzak kaynak (http/sprite) içermez; yazılar gömülü glyph protokolüyle', () => {
    for (const st of [darkProtomapsStyle('pmtiles://ac1-x'), backgroundOnlyStyle()]) {
      const j = JSON.stringify(st);
      expect(j).not.toMatch(/https?:\/\//);
      expect((st as any).sprite).toBeUndefined();
    }
    expect(backgroundOnlyStyle().layers.some((l) => l.type === 'symbol')).toBe(false);
    const withLabels = darkProtomapsStyle('pmtiles://ac1-x') as any;
    expect(withLabels.glyphs).toBe('acglyph://{fontstack}/{range}');
    const labels = withLabels.layers.filter((l: any) => l.type === 'symbol').map((l: any) => l.id);
    expect(labels).toEqual(expect.arrayContaining(['label-roads', 'label-locality', 'label-neighbourhood', 'label-water']));
    // Kullanılan bütün yazı tipleri gömülü
    for (const l of withLabels.layers.filter((x: any) => x.type === 'symbol'))
      for (const f of l.layout['text-font']) expect(['NotoSans-Regular', 'NotoSans-Medium', 'NotoSans-Italic']).toContain(f);
    const st = darkProtomapsStyle('pmtiles://ac1-x');
    expect(st.layers.map((l) => l.id)).toEqual(expect.arrayContaining(['background', 'earth', 'water', 'landuse-park', 'roads-major', 'buildings', 'boundaries']));
  });
});

describe('çok noktalı paket katmanı', () => {
  it('noktalar türe göre süzülür, renk ve harf taşınır', async () => {
    const { poiFeatureCollection, POI_DOM_LIMIT } = await import('../src/lib/map/poi-layer');
    const pois = [
      { id: 'a', type: 'eczane', name: 'A', lat: 39.9, lon: 32.8 },
      { id: 'b', type: 'su', name: 'B', lat: 39.91, lon: 32.81 },
    ] as any;
    expect(poiFeatureCollection(pois, 'hepsi').features).toHaveLength(2);
    const ecz = poiFeatureCollection(pois, 'eczane').features;
    expect(ecz).toHaveLength(1);
    expect(ecz[0].properties).toMatchObject({ id: 'a', type: 'eczane', letter: 'E' });
    expect(ecz[0].geometry.coordinates).toEqual([32.8, 39.9]);
    // Türkiye geneli paketler (on binlerce nokta) DOM işaretçisiyle çizilmez
    expect(POI_DOM_LIMIT).toBeLessThanOrEqual(1000);
  });
});
