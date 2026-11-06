// Harita noktaları (POI) paketi: GeoJSON FeatureCollection, Point geometrili,
// özellikler { name, type: 'toplanma'|'saglik'|'eczane'|'su'|'barinma', note? }.
// `type` yoksa ham OSM etiketlerinden (amenity, natural, emergency…) çıkarılır.
import type { InstalledPack } from '../packs';
import { openBlob } from '../packs';
import type { LatLon } from './geo';

export type PoiType = 'toplanma' | 'saglik' | 'eczane' | 'su' | 'barinma';

export interface Poi extends LatLon {
  id: string;
  name: string;
  type: PoiType;
  note?: string;
}

/** Renk + harf: renk körlüğünde de ayırt edilebilsin diye her türün harfi var. */
export const POI_TYPES: Record<PoiType, { label: string; short: string; letter: string; color: string }> = {
  toplanma: { label: 'Toplanma alanı', short: 'Toplanma', letter: 'T', color: '#3DD68C' },
  saglik: { label: 'Sağlık', short: 'Sağlık', letter: 'S', color: '#FF6B6B' },
  eczane: { label: 'Eczane', short: 'Eczane', letter: 'E', color: '#C792EA' },
  // 'S' Sağlık'ta; İngilizce 'W' yerine Türkçe "Su" yazılır
  su: { label: 'Su', short: 'Su', letter: 'Su', color: '#4DA3FF' },
  barinma: { label: 'Barınma', short: 'Barınma', letter: 'B', color: '#F5A524' },
};

export const POI_TYPE_ORDER: PoiType[] = ['toplanma', 'saglik', 'eczane', 'su', 'barinma'];

const isType = (t: unknown): t is PoiType => typeof t === 'string' && t in POI_TYPES;

/**
 * `type` alanı yoksa ham OpenStreetMap etiketlerinden tür çıkarır (osmtogeojson
 * çıktısı: etiketler doğrudan properties'te ya da properties.tags içinde).
 * Su: amenity=drinking_water | water_point, natural=spring, man_made=water_tap |
 * water_well, amenity=fountain + drinking_water=yes. drinking_water=no olanlar
 * içme suyu sayılmaz. (OSM wiki: Key:drinking_water, Tag:amenity=drinking_water,
 * Tag:natural=spring, Tag:amenity=water_point)
 */
export function inferPoiType(props: Record<string, unknown>): PoiType | null {
  const raw = props?.tags && typeof props.tags === 'object' ? { ...(props.tags as object), ...props } : props;
  const t = (k: string) => (typeof (raw as any)?.[k] === 'string' ? ((raw as any)[k] as string) : undefined);
  const dw = t('drinking_water');
  if (t('emergency') === 'assembly_point') return 'toplanma';
  if (t('amenity') === 'pharmacy' || t('healthcare') === 'pharmacy') return 'eczane';
  if (['hospital', 'clinic', 'doctors'].includes(t('amenity') ?? '') || ['hospital', 'clinic', 'doctor'].includes(t('healthcare') ?? '')) return 'saglik';
  if (dw !== 'no') {
    if (t('amenity') === 'drinking_water' || t('amenity') === 'water_point') return 'su';
    if (t('natural') === 'spring' || t('man_made') === 'water_tap') return 'su';
  }
  if (dw === 'yes' && (t('amenity') === 'fountain' || t('man_made') === 'water_well')) return 'su';
  if ((t('amenity') === 'shelter' && t('shelter_type') !== 'public_transport') || t('social_facility') === 'shelter' || t('emergency') === 'shelter') return 'barinma';
  return null;
}

/** GeoJSON metnini/nesnesini doğrular; geçersiz kayıtları sessizce atlar. */
export function parsePoiGeoJSON(input: string | unknown): Poi[] {
  const data: any = typeof input === 'string' ? JSON.parse(input) : input;
  if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error('Nokta paketi geçerli bir GeoJSON FeatureCollection değil');
  }
  const out: Poi[] = [];
  const ids = new Set<string>();
  data.features.forEach((f: any, i: number) => {
    const g = f?.geometry;
    const p = f?.properties ?? {};
    if (g?.type !== 'Point' || !Array.isArray(g.coordinates)) return;
    const [lon, lat] = g.coordinates.map(Number);
    if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return;
    const type: PoiType | null = isType(p.type) ? p.type : inferPoiType(p);
    if (!type) return;
    const nm = typeof p.name === 'string' ? p.name : typeof p['name:tr'] === 'string' ? p['name:tr'] : p.tags?.name;
    const name = typeof nm === 'string' && nm.trim() ? nm.trim() : POI_TYPES[type].label;
    // Kimlik benzersiz olmalı: harita işaretçileri ve seçim kimlikle tutulur
    let id = String(f.id ?? p.id ?? i);
    if (ids.has(id)) id = `${id}#${i}`;
    ids.add(id);
    out.push({
      id,
      name,
      type,
      note: typeof p.note === 'string' && p.note.trim() ? p.note.trim() : undefined,
      lat,
      lon,
    });
  });
  return out;
}

export async function loadPoiPack(pack: InstalledPack): Promise<Poi[]> {
  const blob = await openBlob(pack);
  return parsePoiGeoJSON(await blob.text());
}

let packCache: { key: string; pois: Poi[] } | null = null;

/**
 * Harita sekmesi her girişte yeniden kurulur; Türkiye geneli nokta paketi (~10 MB GeoJSON)
 * her seferinde yeniden okunup ayrıştırılmasın. Paket (ad, boyut, köken) değişince yenilenir.
 */
export async function loadPoiPackCached(pack: InstalledPack): Promise<Poi[]> {
  const key = `${pack.origin}:${pack.id}:${pack.size}`;
  if (packCache?.key === key) return packCache.pois;
  const pois = await loadPoiPack(pack);
  packCache = { key, pois };
  return pois;
}

export async function loadPoiUrl(url: string): Promise<Poi[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Nokta dosyası açılamadı (${res.status})`);
  return parsePoiGeoJSON(await res.text());
}

export function poiBounds(pois: LatLon[]): [[number, number], [number, number]] | null {
  if (!pois.length) return null;
  let w = 180, s = 90, e = -180, n = -90;
  for (const p of pois) {
    w = Math.min(w, p.lon);
    e = Math.max(e, p.lon);
    s = Math.min(s, p.lat);
    n = Math.max(n, p.lat);
  }
  return [[w, s], [e, n]];
}
