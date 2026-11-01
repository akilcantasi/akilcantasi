// Çok sayıda afet noktası (Türkiye geneli on binlerce nokta) haritada ayrı DOM öğeleri olarak
// çizilirse her harita hareketinde hepsi yeniden konumlanır ve sayfa donar. Bu modül noktaları
// haritanın kendi (WebGL) katmanlarıyla, kümelenmiş olarak çizer.
// Az nokta (örnek/test paketleri, küçük bölgeler) için HaritaTab erişilebilir DOM işaretçilerini kullanmaya devam eder.
import type { GeoJSONSource, Map as MlMap, MapGeoJSONFeature } from 'maplibre-gl';
import { POI_TYPES, type Poi, type PoiType } from './poi';

/** Bu sayının üstünde noktalar DOM işaretçisi yerine harita katmanıyla çizilir */
export const POI_DOM_LIMIT = 400;

export const POI_SRC = 'ac-poi';
export const POI_LAYERS = ['ac-poi-cluster', 'ac-poi-cluster-count', 'ac-poi-point', 'ac-poi-letter', 'ac-poi-selected'] as const;

export type PoiFilter = PoiType | 'hepsi';

export function poiFeatureCollection(pois: Poi[], filter: PoiFilter) {
  return {
    type: 'FeatureCollection' as const,
    features: pois
      .filter((p) => filter === 'hepsi' || p.type === filter)
      .map((p) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
        properties: { id: p.id, type: p.type, color: POI_TYPES[p.type].color, letter: POI_TYPES[p.type].letter },
      })),
  };
}

export interface PoiLayerController {
  setFilter(f: PoiFilter): void;
  setSelected(id: string | null): void;
  remove(): void;
}

/** Noktaları kümelenmiş katmanlar olarak ekler. Stil yüklendikten sonra çağrılmalı. */
export function addPoiLayers(map: MlMap, pois: Poi[], onSelect: (id: string) => void, initial: PoiFilter = 'hepsi'): PoiLayerController {
  map.addSource(POI_SRC, {
    type: 'geojson',
    data: poiFeatureCollection(pois, initial) as any,
    cluster: true,
    clusterRadius: 42,
    clusterMaxZoom: 12,
  });
  map.addLayer({
    id: 'ac-poi-cluster',
    type: 'circle',
    source: POI_SRC,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': 'rgba(245,165,36,0.85)',
      'circle-stroke-color': '#0e1b2c',
      'circle-stroke-width': 2,
      'circle-radius': ['step', ['get', 'point_count'], 14, 50, 18, 500, 23, 5000, 29],
    },
  });
  map.addLayer({
    id: 'ac-poi-cluster-count',
    type: 'symbol',
    source: POI_SRC,
    filter: ['has', 'point_count'],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['NotoSans-Medium'], 'text-size': 12, 'text-allow-overlap': true },
    paint: { 'text-color': '#1a1206' },
  });
  map.addLayer({
    id: 'ac-poi-point',
    type: 'circle',
    source: POI_SRC,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': ['get', 'color'],
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6, 14, 11],
      'circle-stroke-color': '#0e1b2c',
      'circle-stroke-width': 2,
    },
  });
  map.addLayer({
    id: 'ac-poi-letter',
    type: 'symbol',
    source: POI_SRC,
    minzoom: 12,
    filter: ['!', ['has', 'point_count']],
    layout: { 'text-field': ['get', 'letter'], 'text-font': ['NotoSans-Medium'], 'text-size': 11, 'text-allow-overlap': true, 'text-ignore-placement': true },
    paint: { 'text-color': '#0e1b2c' },
  });
  map.addLayer({
    id: 'ac-poi-selected',
    type: 'circle',
    source: POI_SRC,
    filter: ['==', ['get', 'id'], '__yok__'],
    paint: { 'circle-color': 'rgba(0,0,0,0)', 'circle-radius': 16, 'circle-stroke-color': '#ffc861', 'circle-stroke-width': 3 },
  });

  const onPoint = (e: { features?: MapGeoJSONFeature[] }) => {
    const id = e.features?.[0]?.properties?.id;
    if (typeof id === 'string') onSelect(id);
  };
  const onCluster = async (e: { features?: MapGeoJSONFeature[] }) => {
    const f = e.features?.[0];
    if (!f) return;
    const src = map.getSource(POI_SRC) as GeoJSONSource | undefined;
    try {
      const zoom = await src!.getClusterExpansionZoom(f.properties!.cluster_id);
      map.easeTo({ center: (f.geometry as any).coordinates, zoom: Math.min(zoom, 16) });
    } catch {}
  };
  const pointer = () => (map.getCanvas().style.cursor = 'pointer');
  const plain = () => (map.getCanvas().style.cursor = '');
  map.on('click', 'ac-poi-point', onPoint);
  map.on('click', 'ac-poi-cluster', onCluster);
  for (const l of ['ac-poi-point', 'ac-poi-cluster']) {
    map.on('mouseenter', l, pointer);
    map.on('mouseleave', l, plain);
  }

  return {
    setFilter(f) {
      (map.getSource(POI_SRC) as GeoJSONSource | undefined)?.setData(poiFeatureCollection(pois, f) as any);
    },
    setSelected(id) {
      if (map.getLayer('ac-poi-selected')) map.setFilter('ac-poi-selected', ['all', ['!', ['has', 'point_count']], ['==', ['get', 'id'], id ?? '__yok__']]);
    },
    remove() {
      map.off('click', 'ac-poi-point', onPoint);
      map.off('click', 'ac-poi-cluster', onCluster);
      for (const l of POI_LAYERS) if (map.getLayer(l)) map.removeLayer(l);
      if (map.getSource(POI_SRC)) map.removeSource(POI_SRC);
    },
  };
}
