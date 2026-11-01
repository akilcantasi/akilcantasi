// Çevrimdışı koyu harita stili (Protomaps basemap şeması: earth, water,
// landuse, landcover, roads, buildings, boundaries, places, pois).
//
// Yazılar (yer, mahalle, sokak, bina numarası, yer adları) uygulamaya gömülü
// Noto Sans glyph dosyalarıyla çizilir: public/fonts/<yazı tipi>/<aralık>.pbf.
// Glyph'ler "acglyph://" protokolüyle uygulamanın kendi dosyalarından okunur;
// gömülü olmayan Unicode aralıkları için boş yanıt döner (o harfler çizilmez,
// harita hata vermez). Hiçbir uzak kaynak (CDN, sprite) kullanılmaz.
// Türkçe için 0-255 (Latin-1: ç ö ü), 256-511 (Latin Genişletilmiş: ğ ı ş İ)
// ve 8192-8447 (tire, tırnak) yeterlidir.
import type { StyleSpecification } from 'maplibre-gl';

export const MAP_COLORS = {
  // Şafak teması: gece mavisi zemin, sıcak vurgulu yollar, okunaklı yazılar
  background: '#0E1B2C',
  earth: '#12233A',
  water: '#0A2A47',
  waterLine: '#1D4A72',
  park: '#143327',
  roadMinor: '#22385A',
  roadMajor: '#2F4A72',
  roadHighway: '#7A5A22',
  building: '#1A2E48',
  buildingLine: '#24406A',
  boundary: '#5E7594',
  labelCity: '#F4F7FB',
  labelPlace: '#C2CEDD',
  labelRoad: '#B9C6D6',
  labelPoi: '#A9B7C9',
  labelWater: '#86B4DA',
  labelNumber: '#8C9BB0',
  halo: '#0E1B2C',
} as const;

/** Gömülü yazı tipleri ve Unicode aralıkları (public/fonts altında) */
export const GLYPH_FONTS = ['NotoSans-Regular', 'NotoSans-Medium', 'NotoSans-Italic'] as const;
export const GLYPH_RANGES = ['0-255', '256-511', '8192-8447'] as const;
export const GLYPHS_URL = 'acglyph://{fontstack}/{range}';

let glyphRegistered = false;

/**
 * "acglyph://" protokolünü maplibre'ye bir kez kaydeder. Glyph dosyaları
 * uygulamanın kendi varlıklarından (dist/fonts) okunur; ağa çıkılmaz.
 */
export function registerGlyphProtocol(maplibre: { addProtocol: (name: string, fn: any) => void }, base: string = document.baseURI): void {
  if (glyphRegistered) return;
  glyphRegistered = true;
  maplibre.addProtocol('acglyph', async (params: { url: string }, abort?: AbortController) => {
    const m = /^acglyph:\/\/([^/]+)\/(\d+-\d+)/.exec(params.url);
    const font = m ? decodeURIComponent(m[1]).split(',')[0].trim() : '';
    const range = m ? m[2] : '';
    if (!(GLYPH_FONTS as readonly string[]).includes(font) || !(GLYPH_RANGES as readonly string[]).includes(range)) {
      return { data: new ArrayBuffer(0) };
    }
    try {
      const res = await fetch(new URL(`fonts/${font}/${range}.pbf`, base).href, { signal: abort?.signal });
      if (!res.ok) return { data: new ArrayBuffer(0) };
      return { data: await res.arrayBuffer() };
    } catch (e: any) {
      if (e?.name === 'AbortError') throw e;
      return { data: new ArrayBuffer(0) };
    }
  });
}

/** Türkçe ad varsa onu, yoksa yerel adı kullan */
const NAME = ['coalesce', ['get', 'name:tr'], ['get', 'name']] as any;
/** Protomaps her nesneye görüneceği en küçük yakınlaştırmayı (min_zoom) yazar */
const VISIBLE = ['>=', ['zoom'], ['coalesce', ['get', 'min_zoom'], 0]] as any;
const FONT_R = ['NotoSans-Regular'];
const FONT_M = ['NotoSans-Medium'];
const FONT_I = ['NotoSans-Italic'];

const PARK_KINDS = ['park', 'forest', 'wood', 'grass', 'nature_reserve', 'garden', 'golf_course', 'meadow', 'recreation_ground', 'cemetery', 'scrub', 'grassland', 'farmland', 'orchard', 'protected_area', 'national_park', 'village_green', 'playground', 'pitch'];

const width = (stops: [number, number][]) => ['interpolate', ['exponential', 1.6], ['zoom'], ...stops.flat()] as any;

/** Yalnızca arka plan (harita paketi yokken). */
export function backgroundOnlyStyle(): StyleSpecification {
  return {
    version: 8,
    name: 'akilcantasi-bos',
    // Harita paketi yokken de nokta kümelerinin sayıları yazılabilsin
    glyphs: GLYPHS_URL,
    sources: {},
    layers: [{ id: 'background', type: 'background', paint: { 'background-color': MAP_COLORS.background } }],
  };
}

/**
 * Protomaps şemalı vektör PMTiles için koyu stil.
 * @param url  "pmtiles://..." adresi (addPmtilesSource'tan)
 */
export function darkProtomapsStyle(url: string, sourceId = 'protomaps'): StyleSpecification {
  const C = MAP_COLORS;
  const src = sourceId;
  return {
    version: 8,
    name: 'akilcantasi-koyu',
    glyphs: GLYPHS_URL,
    sources: {
      [src]: { type: 'vector', url, attribution: '© OpenStreetMap katkıcıları' },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': C.background } },
      { id: 'earth', type: 'fill', source: src, 'source-layer': 'earth', paint: { 'fill-color': C.earth } },
      {
        id: 'landcover',
        type: 'fill',
        source: src,
        'source-layer': 'landcover',
        filter: ['in', ['get', 'kind'], ['literal', ['forest', 'grassland', 'scrub', 'farmland']]],
        paint: { 'fill-color': C.park, 'fill-opacity': 0.6 },
      },
      {
        id: 'landuse-park',
        type: 'fill',
        source: src,
        'source-layer': 'landuse',
        filter: ['in', ['get', 'kind'], ['literal', PARK_KINDS]],
        paint: { 'fill-color': C.park },
      },
      { id: 'water', type: 'fill', source: src, 'source-layer': 'water', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'fill-color': C.water } },
      {
        id: 'water-line',
        type: 'line',
        source: src,
        'source-layer': 'water',
        filter: ['==', ['geometry-type'], 'LineString'],
        paint: { 'line-color': C.water, 'line-width': width([[10, 0.5], [16, 3]]) },
      },
      {
        id: 'buildings',
        type: 'fill',
        source: src,
        'source-layer': 'buildings',
        minzoom: 13,
        paint: { 'fill-color': C.building, 'fill-outline-color': C.buildingLine },
      },
      {
        id: 'roads-path',
        type: 'line',
        source: src,
        'source-layer': 'roads',
        minzoom: 14,
        filter: ['in', ['get', 'kind'], ['literal', ['path', 'other']]],
        paint: { 'line-color': C.roadMinor, 'line-width': width([[14, 0.6], [18, 2.5]]), 'line-dasharray': [2, 1.5] },
      },
      {
        id: 'roads-minor',
        type: 'line',
        source: src,
        'source-layer': 'roads',
        filter: ['in', ['get', 'kind'], ['literal', ['minor_road', 'medium_road']]],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.roadMinor, 'line-width': width([[11, 0.5], [14, 2], [18, 10]]) },
      },
      {
        id: 'roads-major',
        type: 'line',
        source: src,
        'source-layer': 'roads',
        filter: ['==', ['get', 'kind'], 'major_road'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.roadMajor, 'line-width': width([[8, 0.6], [12, 1.6], [14, 3], [18, 14]]) },
      },
      {
        id: 'roads-highway',
        type: 'line',
        source: src,
        'source-layer': 'roads',
        filter: ['==', ['get', 'kind'], 'highway'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': C.roadHighway, 'line-width': width([[6, 0.6], [10, 1.4], [14, 4], [18, 18]]) },
      },
      {
        id: 'boundaries',
        type: 'line',
        source: src,
        'source-layer': 'boundaries',
        paint: { 'line-color': C.boundary, 'line-width': 1, 'line-dasharray': [3, 2], 'line-opacity': 0.7 },
      },
      ...labelLayers(src),
    ],
  };
}

const halo = (C: typeof MAP_COLORS, w = 1.4) => ({ 'text-halo-color': C.halo, 'text-halo-width': w, 'text-halo-blur': 0.3 });

/** Yazı katmanları: alttan üste su adları, sokak adları, bina numaraları, yerler (POI), mahalle, il/ilçe/köy. */
export function labelLayers(src: string): any[] {
  const C = MAP_COLORS;
  return [
    {
      id: 'label-water',
      type: 'symbol',
      source: src,
      'source-layer': 'water',
      filter: ['all', ['==', ['geometry-type'], 'Point'], ['has', 'name'], VISIBLE],
      layout: {
        'text-field': NAME,
        'text-font': FONT_I,
        'text-size': ['interpolate', ['linear'], ['zoom'], 6, 11, 14, 14],
        'text-max-width': 8,
        'text-letter-spacing': 0.05,
      },
      paint: { 'text-color': C.labelWater, ...halo(C, 1) },
    },
    {
      id: 'label-waterway',
      type: 'symbol',
      source: src,
      'source-layer': 'water',
      minzoom: 12,
      filter: ['all', ['==', ['geometry-type'], 'LineString'], ['has', 'name']],
      layout: { 'symbol-placement': 'line', 'text-field': NAME, 'text-font': FONT_I, 'text-size': 11, 'symbol-spacing': 300 },
      paint: { 'text-color': C.labelWater, ...halo(C, 1) },
    },
    {
      id: 'label-roads',
      type: 'symbol',
      source: src,
      'source-layer': 'roads',
      minzoom: 12,
      filter: ['all', ['has', 'name'], ['in', ['get', 'kind'], ['literal', ['highway', 'major_road', 'medium_road', 'minor_road', 'path']]], ['any', ['!=', ['get', 'kind'], 'path'], ['>=', ['zoom'], 16]]],
      layout: {
        'symbol-placement': 'line',
        'text-field': NAME,
        'text-font': FONT_R,
        'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 15, 12, 18, 15],
        'text-max-angle': 30,
        'symbol-spacing': 280,
        'text-padding': 2,
      },
      paint: { 'text-color': C.labelRoad, ...halo(C) },
    },
    {
      id: 'label-housenumber',
      type: 'symbol',
      source: src,
      'source-layer': 'buildings',
      minzoom: 16.5,
      filter: ['has', 'addr_housenumber'],
      layout: { 'text-field': ['get', 'addr_housenumber'], 'text-font': FONT_R, 'text-size': 10, 'text-padding': 1 },
      paint: { 'text-color': C.labelNumber, ...halo(C, 1) },
    },
    {
      id: 'label-poi',
      type: 'symbol',
      source: src,
      'source-layer': 'pois',
      minzoom: 14,
      filter: ['all', ['has', 'name'], VISIBLE, ['!', ['in', ['get', 'kind'], ['literal', ['administrative', 'residential', 'building', 'commercial', 'industrial', 'retail', 'construction', 'other', 'yes']]]]],
      layout: {
        'text-field': NAME,
        'text-font': FONT_R,
        'text-size': ['interpolate', ['linear'], ['zoom'], 14, 10, 18, 13],
        'text-max-width': 8,
        'text-optional': true,
        'text-padding': 4,
        'symbol-sort-key': ['coalesce', ['get', 'min_zoom'], 20],
      },
      paint: { 'text-color': C.labelPoi, ...halo(C) },
    },
    {
      id: 'label-neighbourhood',
      type: 'symbol',
      source: src,
      'source-layer': 'places',
      minzoom: 11,
      filter: ['all', ['in', ['get', 'kind'], ['literal', ['neighbourhood', 'macrohood', 'microhood']]], VISIBLE],
      layout: {
        'text-field': NAME,
        'text-font': FONT_M,
        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 10, 16, 13],
        'text-max-width': 7,
        'text-letter-spacing': 0.06,
        'text-padding': 4,
      },
      paint: { 'text-color': C.labelPlace, ...halo(C) },
    },
    {
      id: 'label-locality',
      type: 'symbol',
      source: src,
      'source-layer': 'places',
      filter: ['all', ['==', ['get', 'kind'], 'locality'], VISIBLE],
      layout: {
        'text-field': NAME,
        'text-font': FONT_M,
        // Nüfus sırası büyüdükçe (il merkezi > ilçe > köy) yazı büyür
        'text-size': ['interpolate', ['linear'], ['coalesce', ['get', 'population_rank'], 6], 4, 11, 8, 13, 11, 16, 14, 19],
        'text-max-width': 8,
        'text-padding': 3,
        'symbol-sort-key': ['-', 20, ['coalesce', ['get', 'population_rank'], 0]],
      },
      paint: { 'text-color': C.labelCity, ...halo(C, 1.6) },
    },
    {
      id: 'label-region',
      type: 'symbol',
      source: src,
      'source-layer': 'places',
      maxzoom: 9,
      filter: ['all', ['in', ['get', 'kind'], ['literal', ['region', 'country']]], VISIBLE],
      layout: { 'text-field': NAME, 'text-font': FONT_M, 'text-size': ['match', ['get', 'kind'], 'country', 15, 12], 'text-letter-spacing': 0.08, 'text-max-width': 7 },
      paint: { 'text-color': C.labelPlace, ...halo(C) },
    },
  ];
}
