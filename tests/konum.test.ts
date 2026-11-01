import { describe, expect, it } from 'vitest';
import { bearingDeg, distanceM, toDMS } from '../src/lib/map/geo';
import {
  angleDiff,
  cardinal8,
  cardinal8Long,
  headingFromOrientation,
  isTilted,
  needsCalibration,
  normDeg,
  relativeBearing,
  smoothHeading,
  turnHint,
} from '../src/lib/map/compass';
import {
  acceptPoint,
  backtrack,
  emptyTrack,
  filterTrack,
  formatClock,
  loadTrack,
  parseTrack,
  pathLength,
  saveTrack,
  serializeTrack,
  thinPoints,
  trackDurationMs,
  TRACK_KEY,
  type KV,
  type TrackPoint,
} from '../src/lib/map/track';
import { parseCoordinates, parseWaypoints, smsHrefText, waypointShareText, WaypointStore, WAYPOINT_KEY } from '../src/lib/map/waypoints';
import { inferPoiType, parsePoiGeoJSON } from '../src/lib/map/poi';

class MemKV implements KV {
  m = new Map<string, string>();
  getItem(k: string) {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

// ~ 1 m enlem = 1/111195 derece
const M = 1 / 111195;
const O = { lat: 39.92, lon: 32.85 };
const north = (m: number, base = O) => ({ lat: base.lat + m * M, lon: base.lon });
const pt = (m: number, t: number, acc = 5): TrackPoint => ({ ...north(m), t, acc });

describe('pusula', () => {
  it('normDeg ve 8 yönlü adlar', () => {
    expect(normDeg(-90)).toBe(270);
    expect(normDeg(720)).toBe(0);
    expect(normDeg(359.9)).toBeCloseTo(359.9);
    expect(cardinal8(0)).toBe('K');
    expect(cardinal8(22)).toBe('K');
    expect(cardinal8(23)).toBe('KD');
    expect(cardinal8(90)).toBe('D');
    expect(cardinal8(135)).toBe('GD');
    expect(cardinal8(180)).toBe('G');
    expect(cardinal8(225)).toBe('GB');
    expect(cardinal8(270)).toBe('B');
    expect(cardinal8(315)).toBe('KB');
    expect(cardinal8(338)).toBe('K');
    expect(cardinal8(-45)).toBe('KB');
    expect(cardinal8Long(45)).toBe('kuzeydoğu');
    expect(cardinal8Long(200)).toBe('güney');
  });

  it('açı farkı, göreli yön, dönüş ipucu', () => {
    expect(angleDiff(350, 10)).toBe(20);
    expect(angleDiff(10, 350)).toBe(-20);
    expect(angleDiff(0, 180)).toBe(180);
    expect(relativeBearing(90, 80)).toBe(10);
    expect(relativeBearing(10, 350)).toBe(20);
    expect(relativeBearing(350, 10)).toBe(340);
    expect(turnHint(5)).toBe('Düz ilerleyin');
    expect(turnHint(355)).toBe('Düz ilerleyin');
    expect(turnHint(30)).toBe('Hafif sağa');
    expect(turnHint(330)).toBe('Hafif sola');
    expect(turnHint(90)).toBe('Sağa dönün');
    expect(turnHint(270)).toBe('Sola dönün');
    expect(turnHint(180)).toBe('Arkanıza dönün');
  });

  it('yön olayından baş açısı', () => {
    // Android mutlak: alpha saat yönünün tersine → baş = 360 − alpha
    expect(headingFromOrientation({ alpha: 90, beta: 0, gamma: 0, absolute: true })!.heading).toBe(270);
    expect(headingFromOrientation({ alpha: 0, absolute: true })!.heading).toBe(0);
    // deviceorientationabsolute olayında absolute bayrağı olmasa da mutlak say
    expect(headingFromOrientation({ alpha: 30, absolute: false }, 0, true)!.heading).toBe(330);
    // göreli alpha pusula olarak kullanılmaz
    expect(headingFromOrientation({ alpha: 30, absolute: false })).toBeNull();
    expect(headingFromOrientation({ alpha: null, absolute: true })).toBeNull();
    // iOS
    const ios = headingFromOrientation({ webkitCompassHeading: 123, webkitCompassAccuracy: 10, alpha: 5 })!;
    expect(ios.source).toBe('ios');
    expect(ios.heading).toBe(123);
    expect(ios.accuracy).toBe(10);
    expect(headingFromOrientation({ webkitCompassHeading: 10, webkitCompassAccuracy: -1 })!.accuracy).toBeNull();
    expect(headingFromOrientation({ webkitCompassHeading: 10, beta: 85 })!.tilted).toBe(false);
    expect(headingFromOrientation({ alpha: 10, beta: 85, absolute: true })!.tilted).toBe(true);
    // ekran yatay (90°): üst kenar cihazın sağ kenarı
    expect(headingFromOrientation({ alpha: 0, absolute: true }, 90)!.heading).toBe(90);
    expect(headingFromOrientation({ webkitCompassHeading: 300 }, 90)!.heading).toBe(30);
  });

  it('eğim, kalibrasyon, yumuşatma', () => {
    expect(isTilted(10, 5)).toBe(false);
    expect(isTilted(80, 0)).toBe(true);
    expect(isTilted(170, 0)).toBe(false); // ters yatık, düz sayılır
    expect(isTilted(0, -70)).toBe(true);
    expect(needsCalibration(null)).toBe(false);
    expect(needsCalibration(10)).toBe(false);
    expect(needsCalibration(40)).toBe(true);
    expect(smoothHeading(null, 370)).toBe(10);
    // 350 → 10: kısa yoldan (kuzeyden) geçer, 180'e sapmaz
    const s = smoothHeading(350, 10, 0.5);
    expect(s).toBeCloseTo(0, 5);
    expect(smoothHeading(10, 20, 1)).toBe(20);
  });
});

describe('DMS ve koordinat girişi', () => {
  it('DMS biçimi', () => {
    expect(toDMS(39.92, 'lat')).toBe('39° 55′ 12,0″ K');
    expect(toDMS(-33.5, 'lat')).toBe('33° 30′ 00,0″ G');
    expect(toDMS(32.85, 'lon')).toBe('32° 51′ 00,0″ D');
    expect(toDMS(32.15, 'lon')).toBe('32° 09′ 00,0″ D');
    expect(toDMS(-0.0001, 'lon')).toBe('0° 00′ 00,4″ B');
    expect(toDMS(40.99999999, 'lat')).toBe('41° 00′ 00,0″ K');
  });

  it('ondalık koordinatlar', () => {
    expect(parseCoordinates('39.9208, 32.8541')).toEqual({ lat: 39.9208, lon: 32.8541 });
    expect(parseCoordinates('39.9208 32.8541')).toEqual({ lat: 39.9208, lon: 32.8541 });
    expect(parseCoordinates(' 39.9208;32.8541 ')).toEqual({ lat: 39.9208, lon: 32.8541 });
    expect(parseCoordinates('39,9208 32,8541')).toEqual({ lat: 39.9208, lon: 32.8541 });
    expect(parseCoordinates('-33.9, 151.2')).toEqual({ lat: -33.9, lon: 151.2 });
    expect(parseCoordinates('95, 10')).toBeNull();
    expect(parseCoordinates('10, 200')).toBeNull();
    expect(parseCoordinates('')).toBeNull();
    expect(parseCoordinates('merhaba')).toBeNull();
    expect(parseCoordinates('39.9')).toBeNull();
  });

  it('DMS ve harfli girişler', () => {
    const near = (r: any, lat: number, lon: number) => {
      expect(r).not.toBeNull();
      expect(r.lat).toBeCloseTo(lat, 5);
      expect(r.lon).toBeCloseTo(lon, 5);
    };
    near(parseCoordinates('39° 55′ 12,0″ K  32° 51′ 00,0″ D'), 39.92, 32.85);
    near(parseCoordinates(`39°55'12"N 32°51'0"E`), 39.92, 32.85);
    near(parseCoordinates('39 55 12 N 32 9 0 E'), 39.92, 32.15);
    near(parseCoordinates('K 39°55,2′ D 32°51′'), 39.92, 32.85);
    near(parseCoordinates('39.92K 32.85D'), 39.92, 32.85);
    near(parseCoordinates('33° 30′ G 70° 15′ B'), -33.5, -70.25);
    near(parseCoordinates('33.5 s, 70.25 w'), -33.5, -70.25);
    // ters sıra: önce boylam harfiyle
    near(parseCoordinates('32.85 D 39.92 K'), 39.92, 32.85);
    // geçersiz: dakika ≥ 60, iki enlem harfi
    expect(parseCoordinates('39° 61′ K 32° D')).toBeNull();
    expect(parseCoordinates('39 K 32 K')).toBeNull();
    // ekranda gösterilen DMS biçimi geri okunabilmeli
    const dms = `${toDMS(39.920812, 'lat')} ${toDMS(32.854101, 'lon')}`;
    const r = parseCoordinates(dms)!;
    // 0,1″ ≈ 3 m çözünürlük
    expect(distanceM(r, { lat: 39.920812, lon: 32.854101 })).toBeLessThan(3);
  });
});

describe('iz kaydı', () => {
  it('doğruluğu kötü, çok yakın ve sıçrayan noktalar atılır', () => {
    expect(acceptPoint(undefined, pt(0, 0, 8)).ok).toBe(true);
    expect(acceptPoint(undefined, pt(0, 0, 80))).toEqual({ ok: false, reason: 'accuracy' });
    expect(acceptPoint(undefined, { lat: NaN, lon: 0, t: 0, acc: 5 })).toEqual({ ok: false, reason: 'invalid' });
    expect(acceptPoint(pt(0, 0), pt(3, 2000))).toEqual({ ok: false, reason: 'distance' });
    expect(acceptPoint(pt(0, 0), pt(6, 4000)).ok).toBe(true);
    // doğruluk 30 m ise eşik 15 m
    expect(acceptPoint(pt(0, 0, 30), pt(10, 8000, 30))).toEqual({ ok: false, reason: 'distance' });
    // 1 sn'de 500 m: GPS sıçraması
    expect(acceptPoint(pt(0, 0), pt(500, 1000))).toEqual({ ok: false, reason: 'speed' });
    // 100 sn'de 500 m: kabul
    expect(acceptPoint(pt(0, 0), pt(500, 100_000)).ok).toBe(true);
  });

  it('süzgeç + uzunluk + süre', () => {
    const raw: TrackPoint[] = [];
    for (let i = 0; i <= 100; i++) raw.push(pt(i * 2, i * 1500, 6)); // 2 m adım
    raw.splice(50, 0, { ...pt(1000, 50 * 1500 + 10, 5) }); // sıçrama
    raw.push(pt(200, 200_000, 120)); // kötü doğruluk
    const f = filterTrack(raw);
    expect(f.length).toBeGreaterThan(25);
    expect(f.length).toBeLessThan(45);
    const len = pathLength(f);
    expect(len).toBeGreaterThan(190);
    expect(len).toBeLessThan(205);
    expect(pathLength([])).toBe(0);
    expect(trackDurationMs({ startedAt: 1000, stoppedAt: 61_000, recording: false })).toBe(60_000);
    expect(trackDurationMs({ startedAt: 1000, stoppedAt: null, recording: true }, 11_000)).toBe(10_000);
    expect(trackDurationMs({ startedAt: null, stoppedAt: null, recording: false })).toBe(0);
    expect(formatClock(65_000)).toBe('1:05');
    expect(formatClock(3_725_000)).toBe('1:02:05');
  });

  it('başlangıca dönüş: kuş uçuşu ve iz boyunca', () => {
    // L biçimli iz: 0 → 300 m kuzey, sonra 300 m doğu
    const pts: TrackPoint[] = [];
    for (let i = 0; i <= 30; i++) pts.push(pt(i * 10, i * 1000));
    const corner = north(300);
    const dLon = 1 / (111195 * Math.cos((corner.lat * Math.PI) / 180));
    for (let i = 1; i <= 30; i++) pts.push({ lat: corner.lat, lon: corner.lon + i * 10 * dLon, t: 30_000 + i * 1000, acc: 5 });
    const end = pts[pts.length - 1];
    const b = backtrack(pts, end)!;
    expect(b.nearestIndex).toBe(pts.length - 1);
    expect(b.offTrackM).toBeCloseTo(0, 3);
    expect(b.alongM).toBeGreaterThan(595);
    expect(b.alongM).toBeLessThan(605);
    expect(b.straightM).toBeGreaterThan(420);
    expect(b.straightM).toBeLessThan(430);
    // başlangıç güneybatıda (~225°)
    expect(b.straightBearing).toBeGreaterThan(220);
    expect(b.straightBearing).toBeLessThan(230);
    // iz boyunca: önce batıya
    expect(b.nextBearing).toBeGreaterThan(265);
    expect(b.nextBearing).toBeLessThan(275);
    expect(b.nextM).toBeGreaterThanOrEqual(25);
    expect(b.path[0]).toEqual(end);
    expect(b.path[b.path.length - 1]).toEqual(pts[0]);
    // izden 100 m uzaktaysak önce ize yönel
    const off = { lat: north(150).lat, lon: O.lon + 100 * dLon };
    const b2 = backtrack(pts, off)!;
    expect(b2.offTrackM).toBeGreaterThan(95);
    expect(b2.nextBearing).toBeGreaterThan(265);
    expect(b2.nextBearing).toBeLessThan(275);
    expect(b2.alongM).toBeGreaterThan(245);
    expect(b2.alongM).toBeLessThan(255);
    expect(backtrack([], O)).toBeNull();
  });

  it('saklama: yaz, oku, bozuk veri, seyreltme', () => {
    const kv = new MemKV();
    const st = { ...emptyTrack(), recording: true, startedAt: 1000, points: [pt(0, 1000), pt(10, 5000)], rejected: 3 };
    expect(saveTrack(kv, st)).toBe(true);
    const back = loadTrack(kv);
    expect(back.recording).toBe(true);
    expect(back.startedAt).toBe(1000);
    expect(back.rejected).toBe(3);
    expect(back.points).toHaveLength(2);
    expect(back.points[1].lat).toBeCloseTo(st.points[1].lat, 6);
    expect(parseTrack('{bozuk')).toEqual(emptyTrack());
    expect(parseTrack(JSON.stringify({ v: 2, p: [] }))).toEqual(emptyTrack());
    expect(parseTrack(serializeTrack(st)).points[0].acc).toBe(5);
    saveTrack(kv, emptyTrack());
    expect(kv.getItem(TRACK_KEY)).toBeNull();
    // kota hatası yutulur
    const bad: KV = { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); }, removeItem: () => {} };
    expect(saveTrack(bad, st)).toBe(false);
    expect(saveTrack(null, st)).toBe(false);
    const many = Array.from({ length: 11 }, (_, i) => i);
    const thin = thinPoints(many, 10);
    expect(thin[0]).toBe(0);
    expect(thin[thin.length - 1]).toBe(10);
    expect(thin.length).toBeLessThanOrEqual(10);
    expect(thinPoints([1, 2], 10)).toEqual([1, 2]);
  });
});

describe('yer işaretleri', () => {
  it('ekle, güncelle, sil, kalıcı', () => {
    const kv = new MemKV();
    const s = new WaypointStore(kv);
    expect(s.list()).toEqual([]);
    let seen = 0;
    const un = s.subscribe(() => seen++);
    const a = s.add({ name: '  Çadır   alanı ', type: 'cadir', lat: 39.93, lon: 32.86 });
    const b = s.add({ name: '', type: 'su', lat: 39.94, lon: 32.87 });
    expect(a.name).toBe('Çadır alanı');
    expect(b.name).toBe('Su');
    expect(a.id).not.toBe(b.id);
    expect(seen).toBe(2);
    // ikinci depo aynı veriyi okur (yeniden yükleme)
    const s2 = new WaypointStore(kv);
    expect(s2.list().map((w) => w.name)).toEqual(['Çadır alanı', 'Su']);
    expect(s.update(b.id, { name: 'Çeşme', type: 'su' })!.name).toBe('Çeşme');
    expect(s.update('yok', { name: 'x' })).toBeUndefined();
    expect(s.remove(a.id)).toBe(true);
    expect(s.remove(a.id)).toBe(false);
    expect(new WaypointStore(kv).list().map((w) => w.name)).toEqual(['Çeşme']);
    expect(() => s.add({ name: 'x', type: 'diger', lat: 91, lon: 0 })).toThrow();
    un();
    s.add({ name: 'sessiz', type: 'tehlike', lat: 1, lon: 1 });
    expect(seen).toBe(4); // add, add, update, remove (abonelik bitti)
    expect('x'.repeat(100).length).toBe(100);
    expect(s.add({ name: 'x'.repeat(100), type: 'diger', lat: 0, lon: 0 }).name.length).toBe(60);
  });

  it('bozuk depo verisi ve bilinmeyen tür', () => {
    expect(parseWaypoints('nope')).toEqual([]);
    expect(parseWaypoints('{}')).toEqual([]);
    const w = parseWaypoints(JSON.stringify([{ id: 'a', name: 'X', type: 'uzay', lat: 1, lon: 2, t: 5 }, { lat: 'a' }]));
    expect(w).toHaveLength(1);
    expect(w[0].type).toBe('diger');
    const kv = new MemKV();
    kv.setItem(WAYPOINT_KEY, '[[[');
    expect(new WaypointStore(kv).list()).toEqual([]);
  });

  it('paylaşım metni ve SMS bağlantısı', () => {
    const t = waypointShareText({ name: 'Buluşma: okul bahçesi', type: 'bulusma', lat: 39.92, lon: 32.85 });
    expect(t).toContain('Buluşma noktası: Buluşma: okul bahçesi');
    expect(t).toContain('39.920000, 32.850000');
    expect(t).toContain('39° 55′ 12,0″ K 32° 51′ 00,0″ D');
    expect(waypointShareText({ name: 'Su', type: 'su', lat: 1, lon: 2 }).split('\n')[0]).toBe('Su');
    const href = smsHrefText(t);
    expect(href.startsWith('sms:?&body=')).toBe(true);
    expect(decodeURIComponent(href.slice('sms:?&body='.length))).toBe(t);
  });
});

describe('su noktaları (OSM etiketleri)', () => {
  it('etiketten tür çıkarımı', () => {
    expect(inferPoiType({ amenity: 'drinking_water' })).toBe('su');
    expect(inferPoiType({ natural: 'spring' })).toBe('su');
    expect(inferPoiType({ natural: 'spring', drinking_water: 'no' })).toBeNull();
    expect(inferPoiType({ amenity: 'water_point' })).toBe('su');
    expect(inferPoiType({ man_made: 'water_tap' })).toBe('su');
    expect(inferPoiType({ amenity: 'fountain' })).toBeNull();
    expect(inferPoiType({ amenity: 'fountain', drinking_water: 'yes' })).toBe('su');
    expect(inferPoiType({ tags: { amenity: 'drinking_water' } })).toBe('su');
    expect(inferPoiType({ emergency: 'assembly_point' })).toBe('toplanma');
    expect(inferPoiType({ amenity: 'shelter', shelter_type: 'public_transport' })).toBeNull();
    expect(inferPoiType({ amenity: 'bench' })).toBeNull();
  });

  it('type alanı olmayan osmtogeojson çıktısı okunur', () => {
    const pois = parsePoiGeoJSON({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', id: 'node/1', geometry: { type: 'Point', coordinates: [32.85, 39.92] }, properties: { amenity: 'drinking_water', name: 'Çeşme' } },
        { type: 'Feature', id: 'node/2', geometry: { type: 'Point', coordinates: [32.86, 39.93] }, properties: { tags: { natural: 'spring' } } },
        { type: 'Feature', id: 'node/3', geometry: { type: 'Point', coordinates: [32.87, 39.94] }, properties: { amenity: 'bench' } },
      ],
    });
    expect(pois.map((p) => [p.type, p.name])).toEqual([
      ['su', 'Çeşme'],
      ['su', 'Su'],
    ]);
  });

  it('mesafe ve yön tutarlı', () => {
    expect(distanceM(O, north(100))).toBeCloseTo(100, 0);
    expect(bearingDeg(O, north(100))).toBeCloseTo(0, 3);
  });
});
