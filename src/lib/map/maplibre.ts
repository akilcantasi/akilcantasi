// maplibre-gl'i tembel yükler (ana pakete ~1 MB eklemesin diye) ve worker
// dosyasını uygulamanın kendi varlıklarından gösterir — CDN yok.
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

maplibregl.setWorkerUrl(new URL(workerUrl, location.href).href);

export default maplibregl;
export type MapLibre = typeof maplibregl;
