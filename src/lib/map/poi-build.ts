// Afet noktaları paketini internet varken doğrudan OpenStreetMap'ten (Overpass API)
// oluşturur ve cihaza kaydeder. Hazır bir indirme sunucusu gerekmez.
//
// Türkiye sınır kutusu 24 parçaya bölünür (tek sorgu Overpass'ın zaman/bellek sınırını
// aşar); her parça sırayla, aynalar arasında geçerek ve yeniden deneyerek sorgulanır.
// Çıktı: Point GeoJSON, özellikler { name, type, note? } (poi.ts biçimi).
import { inferPoiType } from './poi';

export const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

// Node'da (bilgisayar/Pi betiği) kendimizi tanıtırız; tarayıcıda User-Agent eklemek
// CORS ön isteğine yol açacağı için yalnızca içerik türü gönderilir.
const NODE_HEADERS: Record<string, string> =
  typeof window === 'undefined'
    ? { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'AkilCantasi/0.1 (cevrimdisi afet uygulamasi)' }
    : { 'Content-Type': 'application/x-www-form-urlencoded' };

/** Ayarlar (testlerde kısaltılır). retryPauseMs: tüm sunucularda başarısız olan bölgeler sonda yeniden denenmeden önce beklenir */
export const POI_BUILD_TUNING = { retryPauseMs: 30_000, backoffMs: 1500 };

/** Tek sorgu bu süreyi aşarsa bırakılır ve başka sunucu denenir */
const REQUEST_TIMEOUT_MS = 150_000;

/** Türkiye'yi kapsayan kutu (güney, batı, kuzey, doğu) */
export const TURKIYE_BBOX: [number, number, number, number] = [35.8, 25.6, 42.15, 44.85];

export function tileBbox(b: [number, number, number, number], rows: number, cols: number): [number, number, number, number][] {
  const [s, w, n, e] = b;
  const out: [number, number, number, number][] = [];
  const dy = (n - s) / rows;
  const dx = (e - w) / cols;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) out.push([+(s + r * dy).toFixed(4), +(w + c * dx).toFixed(4), +(s + (r + 1) * dy).toFixed(4), +(w + (c + 1) * dx).toFixed(4)]);
  return out;
}

export function overpassQuery(bb: [number, number, number, number]): string {
  const b = bb.join(',');
  return `[out:json][timeout:180];
(
  nwr["emergency"="assembly_point"](${b});
  nwr["emergency"="shelter"](${b});
  nwr["amenity"~"^(hospital|clinic|doctors|pharmacy|drinking_water|water_point|shelter)$"](${b});
  nwr["healthcare"~"^(hospital|clinic|doctor|pharmacy)$"](${b});
  nwr["social_facility"="shelter"](${b});
  nwr["natural"="spring"](${b});
  nwr["man_made"="water_tap"](${b});
  nwr["amenity"="fountain"]["drinking_water"="yes"](${b});
  nwr["man_made"="water_well"]["drinking_water"="yes"](${b});
);
out center tags qt;`;
}

interface OsmEl {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Overpass öğelerini paket özelliklerine çevirir (türü çıkarılamayanlar atlanır). */
export function toFeatures(els: OsmEl[], seen = new Set<string>()): any[] {
  const out: any[] = [];
  for (const el of els) {
    const key = el.type[0] + el.id;
    if (seen.has(key)) continue;
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    const tags = el.tags ?? {};
    const type = inferPoiType(tags);
    if (!type) continue;
    seen.add(key);
    const props: Record<string, string> = { type };
    const name = tags['name:tr'] || tags.name;
    if (name) props.name = name;
    const note = [tags['addr:street'] && [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' '), tags['addr:district'] || tags['addr:city'], tags.phone, tags.opening_hours]
      .filter(Boolean)
      .join(' · ');
    if (note) props.note = note;
    out.push({ type: 'Feature', id: key, geometry: { type: 'Point', coordinates: [+lon.toFixed(6), +lat.toFixed(6)] }, properties: props });
  }
  return out;
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((res, rej) => {
    const t = setTimeout(res, ms);
    signal?.addEventListener('abort', () => (clearTimeout(t), rej(new DOMException('İptal', 'AbortError'))), { once: true });
  });

async function fetchTile(
  bb: [number, number, number, number],
  signal: AbortSignal | undefined,
  onRetry: (msg: string) => void,
  startMirror = 0,
): Promise<OsmEl[]> {
  let lastErr: unknown = null;
  // Tüm sunucular yalnızca "meşgul" dediyse bölgeyi bölmek işe yaramaz (sorgu ağır değil, sıra dolu)
  let allBusy = true;
  const attempts = OVERPASS_MIRRORS.length;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const url = OVERPASS_MIRRORS[(startMirror + attempt) % OVERPASS_MIRRORS.length];
    const host = new URL(url).host;
    const ctrl = new AbortController();
    const onAbort = () => ctrl.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(overpassQuery(bb)),
        headers: NODE_HEADERS,
        signal: ctrl.signal,
      });
      if (res.status === 429 || res.status === 503 || res.status === 502) throw Object.assign(new Error('sunucu meşgul (' + res.status + ')'), { busy: true });
      if (res.status >= 500) throw new Error('sunucu meşgul (' + res.status + ')');
      if (!res.ok) throw new Error('sorgu reddedildi (' + res.status + ')');
      const j = await res.json();
      if (j.remark && /runtime error|timed out|out of memory/i.test(j.remark)) throw new Error('sunucu sorguyu bitiremedi');
      return j.elements ?? [];
    } catch (e: any) {
      if (signal?.aborted) throw new DOMException('İptal', 'AbortError');
      lastErr = e?.name === 'AbortError' ? new Error('sunucu yanıt vermedi') : e;
      if (!(lastErr as any)?.busy) allBusy = false;
      onRetry(`${host}: ${(lastErr as Error).message || 'bağlantı hatası'} — başka sunucu deneniyor`);
      await sleep(POI_BUILD_TUNING.backoffMs * (attempt + 1), signal);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  }
  const err = lastErr instanceof Error ? lastErr : new Error('bağlantı kurulamadı');
  if (allBusy) (err as any).busy = true;
  throw err;
}

export interface BuildProgress {
  done: number;
  total: number;
  points: number;
  /** Yeniden deneme bilgisi */
  note?: string;
}

/** Yarıda kalan oluşturmayı sürdürmek için ara kayıt (biten bölgeler + noktaları) */
export interface BuildCheckpoint {
  load(): Promise<{ done: number[]; features: any[] } | null>;
  save(c: { done: number[]; features: any[] }): Promise<void>;
}

/** Türkiye geneli afet noktalarını indirir; GeoJSON metnini döndürür. */
export async function buildPoiGeoJSON(onProgress: (p: BuildProgress) => void, signal?: AbortSignal, checkpoint?: BuildCheckpoint): Promise<string> {
  const tiles = tileBbox(TURKIYE_BBOX, 4, 6);
  const seen = new Set<string>();
  const feats: any[] = [];
  const finished = new Set<number>();
  const prev = await checkpoint?.load().catch(() => null);
  if (prev && Array.isArray(prev.done) && Array.isArray(prev.features)) {
    prev.done.forEach((i) => finished.add(i));
    for (const f of prev.features) {
      if (f?.id && !seen.has(f.id)) {
        seen.add(f.id);
        feats.push(f);
      }
    }
  }
  let saving = Promise.resolve();
  const persist = () => {
    if (!checkpoint) return;
    const snap = { done: [...finished], features: feats.slice() };
    saving = saving.then(() => checkpoint.save(snap)).catch(() => {});
  };
  onProgress({ done: finished.size, total: tiles.length, points: feats.length });
  // Yoğun bölge hiçbir sunucuda bitmezse dörde bölünüp yeniden denenir (en çok 2 kez)
  let done = finished.size;
  const report = (note?: string) => onProgress({ done, total: tiles.length, points: feats.length, note });
  // Bölgenin öğeleri bölge tamamen alınınca eklenir: yarım kalan bölge yeniden denendiğinde
  // noktalar ne kaybolur ne de çift sayılır.
  const fetchArea = async (bb: [number, number, number, number], lane: number, depth: number): Promise<OsmEl[]> => {
    try {
      return await fetchTile(bb, signal, (note) => report(note), lane);
    } catch (e: any) {
      if (e?.name === 'AbortError' || e?.busy || depth >= 2) throw e;
      report('yoğun bölge, küçük parçalara bölünüyor');
      const all: OsmEl[] = [];
      for (const sub of tileBbox(bb, 2, 2)) all.push(...(await fetchArea(sub, lane, depth + 1)));
      return all;
    }
  };
  // İki kanal: her biri farklı sunucudan başlar (sunucular IP başına ~2 eşzamanlı sorguya izin verir).
  // Bir bölge alınamazsa iş durmaz: diğer bölgeler sürer, alınamayanlar sonda yeniden denenir.
  const runQueue = async (queue: number[], lanes: number) => {
    const failed: number[] = [];
    const lane = async (id: number) => {
      while (queue.length) {
        if (signal?.aborted) throw new DOMException('İptal', 'AbortError');
        const i = queue.shift()!;
        try {
          const els = await fetchArea(tiles[i], id, 0);
          feats.push(...toFeatures(els, seen));
        } catch (e: any) {
          if (e?.name === 'AbortError') throw e;
          failed.push(i);
          report(`bölge ${i + 1} alınamadı, sonra yeniden denenecek`);
          continue;
        }
        finished.add(i);
        done++;
        report();
        persist();
      }
    };
    await Promise.all(Array.from({ length: lanes }, (_, id) => lane(id)));
    return failed;
  };
  let failed = await runQueue(tiles.map((_, i) => i).filter((i) => !finished.has(i)), 2);
  for (let pass = 1; failed.length && pass <= 2; pass++) {
    const pause = POI_BUILD_TUNING.retryPauseMs * pass;
    report(`${failed.length} bölge için sunucuların rahatlaması bekleniyor (${Math.round(pause / 1000)} sn)`);
    await sleep(pause, signal);
    failed = await runQueue(failed, 1);
  }
  await saving;
  if (failed.length) {
    throw new Error(`${failed.length} bölge alınamadı (sunucular meşgul). "Devam" yalnızca eksik bölgeleri dener; ${feats.length} nokta saklandı.`);
  }
  if (!feats.length) throw new Error('Hiç nokta bulunamadı');
  const fc = {
    type: 'FeatureCollection',
    generated: new Date().toISOString(),
    source: 'OpenStreetMap katkıcıları (ODbL 1.0), Overpass API',
    features: feats,
  };
  return JSON.stringify(fc);
}
