// Haritaya çizilen kullanıcı katmanları: iz (yürünen yol), başlangıç noktası ve
// hedefe giden çizgi. Hepsi yerel GeoJSON; yazı/glyph gerektirmez.
import type { Map as MlMap, GeoJSONSource } from 'maplibre-gl';
import type { LatLon } from './geo';

export const TRACK_SRC = 'ac-track';
export const NAV_SRC = 'ac-nav';

// Yerel en küçük GeoJSON türleri (@types/geojson bağımlılığı olmadan)
type Geom = { type: 'LineString'; coordinates: number[][] } | { type: 'Point'; coordinates: number[] };
type Feature = { type: 'Feature'; properties: Record<string, unknown>; geometry: Geom };
type FC = { type: 'FeatureCollection'; features: Feature[] };
const EMPTY: FC = { type: 'FeatureCollection', features: [] };

export function lineString(points: LatLon[], props: Record<string, unknown> = {}): Feature {
  return { type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: points.map((p) => [p.lon, p.lat]) } };
}

export function point(p: LatLon, props: Record<string, unknown> = {}): Feature {
  return { type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: [p.lon, p.lat] } };
}

/** İz verisi: çizgi (2+ nokta) + başlangıç noktası. */
export function trackFC(points: LatLon[]): FC {
  const f: Feature[] = [];
  if (points.length >= 2) f.push(lineString(points, { kind: 'track' }));
  if (points.length) f.push(point(points[0], { kind: 'start' }));
  return { type: 'FeatureCollection', features: f };
}

/** Hedef çizgisi: kuş uçuşu (kesikli) ya da iz boyunca geri dönüş yolu. */
export function navFC(path: LatLon[] | null, mode: 'straight' | 'track' = 'straight'): FC {
  if (!path || path.length < 2) return EMPTY;
  return { type: 'FeatureCollection', features: [lineString(path, { kind: mode }), point(path[path.length - 1], { kind: 'target' })] };
}

/** Kaynakları ve katmanları bir kez ekler (stil yüklendikten sonra çağrılmalı). */
export function ensureOverlayLayers(map: MlMap): boolean {
  try {
    if (!map.getSource(TRACK_SRC)) {
      map.addSource(TRACK_SRC, { type: 'geojson', data: EMPTY });
      map.addLayer({
        id: 'ac-track-casing',
        type: 'line',
        source: TRACK_SRC,
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#0e1b2c', 'line-width': 8, 'line-opacity': 0.8 },
      });
      map.addLayer({
        id: 'ac-track-line',
        type: 'line',
        source: TRACK_SRC,
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#F5A524', 'line-width': 4 },
      });
      map.addLayer({
        id: 'ac-track-start',
        type: 'circle',
        source: TRACK_SRC,
        filter: ['==', ['get', 'kind'], 'start'],
        paint: { 'circle-radius': 7, 'circle-color': '#3DD68C', 'circle-stroke-color': '#0e1b2c', 'circle-stroke-width': 3 },
      });
    }
    if (!map.getSource(NAV_SRC)) {
      map.addSource(NAV_SRC, { type: 'geojson', data: EMPTY });
      // hedef çizgisi izin altında kalsın, başlangıç noktası en üstte görünsün
      const before = map.getLayer('ac-track-start') ? 'ac-track-start' : undefined;
      map.addLayer({
        id: 'ac-nav-line',
        type: 'line',
        source: NAV_SRC,
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ['case', ['==', ['get', 'kind'], 'track'], '#3DD68C', '#4DA3FF'],
          'line-width': 3,
          'line-dasharray': [2, 1.6],
        },
      }, before);
      map.addLayer({
        id: 'ac-nav-target',
        type: 'circle',
        source: NAV_SRC,
        filter: ['==', ['get', 'kind'], 'target'],
        paint: { 'circle-radius': 5, 'circle-color': '#4DA3FF', 'circle-stroke-color': '#0e1b2c', 'circle-stroke-width': 2 },
      }, before);
    }
    return true;
  } catch (e) {
    console.warn('[harita] katman eklenemedi', e);
    return false;
  }
}

export function setSourceData(map: MlMap, id: string, data: FC) {
  const s = map.getSource(id) as GeoJSONSource | undefined;
  s?.setData(data as any);
}

/** Kullanıcı noktası + yön konisi işaretçisi. */
export function createUserElement(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'user-wrap';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'Konumunuz');
  el.dataset.testid = 'user-marker';
  el.innerHTML =
    '<div class="user-cone" data-testid="heading-cone" aria-hidden="true">' +
    '<svg viewBox="0 0 100 100" width="100" height="100"><defs><radialGradient id="acCone" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0.12" stop-color="#4DA3FF" stop-opacity="0.75"/><stop offset="1" stop-color="#4DA3FF" stop-opacity="0"/></radialGradient></defs>' +
    '<path d="M50 50 L25.0 6.7 A50 50 0 0 1 75.0 6.7 Z" fill="url(#acCone)"/></svg></div>' +
    '<div class="user-mk"></div>';
  return el;
}

/** Koniyi telefonun baktığı yöne çevirir; yön yoksa gizler. */
export function setUserHeading(el: HTMLElement, heading: number | null, mapBearing = 0) {
  const cone = el.querySelector<HTMLElement>('.user-cone');
  if (!cone) return;
  if (heading == null) {
    cone.style.display = 'none';
    el.removeAttribute('data-heading');
    return;
  }
  cone.style.display = '';
  cone.style.transform = `rotate(${(heading - mapBearing).toFixed(1)}deg)`;
  el.dataset.heading = String(Math.round(heading));
}

/** Yer işareti için iğne biçimli işaretçi. */
export function createWaypointElement(letter: string, color: string, label: string): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'wp-mk';
  el.style.setProperty('--c', color);
  // MapLibre işaretçi öğesinin transform'unu kendisi yazar: döndürme iç öğede
  el.innerHTML = '<span class="wp-pin"><span></span></span>';
  (el.querySelector('.wp-pin > span') as HTMLElement).textContent = letter;
  el.setAttribute('aria-label', label);
  el.title = label;
  el.dataset.testid = 'wp-marker';
  return el;
}
