// Harita sekmesi: çevrimdışı PMTiles harita + toplanma/sağlık/eczane/su/barınma
// noktaları, konum (pusula konisiyle), en yakın toplanma alanı, kuş uçuşu yön,
// konum paylaşma, iz kaydı + başlangıca dönüş ve yer işaretleri.
// Hiçbir koşulda internetten karo, font ya da sprite çekilmez.
import { openDirections } from '../lib/map/yol-tarifi';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Map as MlMap, Marker as MlMarker } from 'maplibre-gl';
import { go, getState, subscribe, useAppState } from '../lib/store';
import { getSettings, onSettingsChange } from '../lib/settings';
import { findPack, openSource } from '../lib/packs';
import { HttpRangeSource, type RandomAccessSource } from '../lib/source';
import { IconLocate, IconMap } from '../icons';
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
  type LatLon,
} from '../lib/map/geo';
import { POI_TYPES, POI_TYPE_ORDER, loadPoiPack, loadPoiUrl, poiBounds, type Poi, type PoiType } from '../lib/map/poi';
import { POI_DOM_LIMIT, addPoiLayers, type PoiLayerController } from '../lib/map/poi-layer';
import { backgroundOnlyStyle, darkProtomapsStyle, registerGlyphProtocol } from '../lib/map/style';
import { devMapUrl, devPoiUrl } from '../lib/map/dev';
import { cardinal8 } from '../lib/map/compass';
import { requestCompassPermission, useCompass } from '../lib/map/useCompass';
import { recorder, useTrack } from '../lib/map/recorder';
import { backtrack, formatClock, pathLength, trackDurationMs } from '../lib/map/track';
import { setNavTarget, useNavTarget } from '../lib/map/nav';
import { WAYPOINT_TYPES, type Waypoint } from '../lib/map/waypoints';
import {
  NAV_SRC,
  TRACK_SRC,
  createUserElement,
  createWaypointElement,
  ensureOverlayLayers,
  navFC,
  setSourceData,
  setUserHeading,
  trackFC,
} from '../lib/map/layers';
import { copyText, useWaypoints } from '../lib/map/ui';
import { IzCard, NavCard, Sheet, WaypointSheet, useTicker, type AddPreset } from '../lib/map/panels';
import { KonumArama } from '../lib/map/KonumArama';
import { nativeKonum, type KonumDurum } from '../lib/native';
import { sonKonumKaydet } from '../lib/enkaz/enkaz';
import './harita.css';

type Filter = 'hepsi' | PoiType;
type UserLoc = LatLon & { accuracy: number; timestamp: number };
type LocState = 'idle' | 'waiting' | 'ok' | 'denied' | 'unavailable' | 'timeout' | 'unsupported' | 'insecure';

interface Packs {
  status: 'loading' | 'ready';
  mapSrc: RandomAccessSource | null;
  pois: Poi[];
  poiLoaded: boolean;
  errors: string[];
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'hepsi', label: 'Hepsi' },
  { id: 'toplanma', label: 'Toplanma alanı' },
  { id: 'saglik', label: 'Sağlık' },
  { id: 'eczane', label: 'Eczane' },
  { id: 'su', label: 'Su' },
  { id: 'barinma', label: 'Barınma' },
];

const LOC_MSG: Record<LocState, string> = {
  idle: '',
  waiting: 'Konum aranıyor… İnternetsiz GPS ilk seferde birkaç dakika sürebilir. Gökyüzünü gören açık bir yerde bekleyin.',
  ok: '',
  denied: 'Konum izni verilmedi. Telefon ya da tarayıcı ayarlarından bu uygulamaya konum izni verip tekrar deneyin.',
  unavailable: 'Konum alınamadı. Telefonun konum (GPS) özelliğinin açık olduğundan emin olun, açık alanda tekrar deneyin.',
  timeout: 'Konum 5 dakikada bulunamadı. Açık alana çıkıp tekrar deneyin.',
  unsupported: 'Bu cihaz ya da tarayıcı konum özelliğini desteklemiyor.',
  insecure: 'Konum yalnızca güvenli bağlantıda (https ya da uygulamanın kendisi) çalışır. Bu sayfa düz http ile açılmış.',
};

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

function fmtTime(ts: number) {
  const d = new Date(ts);
  const t = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const ago = Math.max(0, Math.round((Date.now() - ts) / 60000));
  return `${t} (${ago < 1 ? 'az önce' : ago + ' dk önce'})`;
}

function TypeBadge({ type, size = 22 }: { type: PoiType; size?: number }) {
  const t = POI_TYPES[type];
  return (
    <span class="poi-badge" style={{ background: t.color, width: size, height: size, fontSize: Math.round(size * 0.55) }} aria-hidden="true">
      {t.letter}
    </span>
  );
}

export function HaritaTab() {
  const s = useAppState();
  const [packs, setPacks] = useState<Packs>({ status: 'loading', mapSrc: null, pois: [], poiLoaded: false, errors: [] });
  const [filter, setFilter] = useState<Filter>('hepsi');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loc, setLoc] = useState<UserLoc | null>(null);
  const [locState, setLocState] = useState<LocState>('idle');
  // Android'de telefonun bildirdiği uydu durumu ve aramanın başladığı an (görselleştirme için)
  const [konumDurum, setKonumDurum] = useState<KonumDurum | null>(null);
  const [aramaBas, setAramaBas] = useState(0);
  const yerelAktif = useRef(false);
  const locRef = useRef<UserLoc | null>(null);
  locRef.current = loc;
  const [panel, setPanel] = useState<null | 'yon' | 'konum'>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [overlayReady, setOverlayReady] = useState(0);
  const [izOpen, setIzOpen] = useState(false);
  const [wpSheet, setWpSheet] = useState<null | { adding: boolean; preset: AddPreset }>(null);
  // Alt menüden Harita'ya yeniden dokunuş: açık paneller kapanır, harita ana görünümüne döner
  const homeTapRef = useRef(getState().homeTap);
  useEffect(
    () =>
      subscribe((st) => {
        if (st.homeTap === homeTapRef.current) return;
        homeTapRef.current = st.homeTap;
        if (st.tab !== 'harita') return;
        setPanel(null);
        setIzOpen(false);
        setWpSheet(null);
        setSelectedId(null);
      }),
    [],
  );
  const track = useTrack();
  const nav = useNavTarget();
  const wps = useWaypoints();
  const compass = useCompass(!!loc);
  const heading = compass.status === 'ok' ? compass.heading : null;

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const mlRef = useRef<typeof import('maplibre-gl') | null>(null);
  const markers = useRef(new Map<string, { marker: MlMarker; el: HTMLButtonElement }>());
  /** Çok noktada (POI_DOM_LIMIT üstü) DOM işaretçisi yerine harita katmanı */
  const poiLayer = useRef<PoiLayerController | null>(null);
  const wpMarkers = useRef(new Map<string, { marker: MlMarker; el: HTMLButtonElement; key: string }>());
  const userMarker = useRef<MlMarker | null>(null);
  const watchId = useRef<number | null>(null);
  const wantNearest = useRef(false);
  const centerOnFix = useRef(false);

  // Pil tasarrufu (ya da düşük güç): solma ve kayma animasyonu yok.
  // Düşük güç (Ayarlar) ayrıca: piksel oranı 1 ve sürekli takip yerine tek seferlik konum.
  const lowPower = () => getSettings().lowPower;
  const saver = () => lowPower() || getState().batterySaver;

  // ---- Paketleri yükle ----
  useEffect(() => {
    let alive = true;
    setPacks((p) => ({ ...p, status: 'loading' }));
    (async () => {
      const errors: string[] = [];
      let mapSrc: RandomAccessSource | null = null;
      let pois: Poi[] = [];
      let poiLoaded = false;
      try {
        const dm = devMapUrl();
        if (dm) mapSrc = await HttpRangeSource.open(dm);
        else {
          const p = await findPack('map');
          if (p) mapSrc = await openSource(p);
        }
      } catch (e) {
        errors.push('Harita paketi açılamadı: ' + errMsg(e));
      }
      try {
        const dp = devPoiUrl();
        if (dp) {
          pois = await loadPoiUrl(dp);
          poiLoaded = true;
        } else {
          const p = await findPack('poi');
          if (p) {
            pois = await loadPoiPack(p);
            poiLoaded = true;
          }
        }
      } catch (e) {
        errors.push('Nokta paketi okunamadı: ' + errMsg(e));
      }
      if (alive) setPacks({ status: 'ready', mapSrc, pois, poiLoaded, errors });
    })();
    return () => {
      alive = false;
    };
  }, [s.packsVersion]);

  const hasAnything = !!packs.mapSrc || packs.poiLoaded;

  // ---- Haritayı kur ----
  useEffect(() => {
    if (packs.status !== 'ready' || !hasAnything || !mapEl.current) return;
    let cancelled = false;
    let map: MlMap | null = null;
    setMapError(null);
    setMapReady(false);
    (async () => {
      let ml: typeof import('maplibre-gl');
      try {
        ml = (await import('../lib/map/maplibre')).default;
      } catch (e) {
        if (!cancelled) setMapError('Harita bileşeni yüklenemedi: ' + errMsg(e));
        return;
      }
      if (cancelled || !mapEl.current) return;
      mlRef.current = ml;
      // Harita yazıları için gömülü glyph dosyaları (public/fonts), stilden önce kaydedilmeli
      registerGlyphProtocol(ml);

      let style = backgroundOnlyStyle();
      let bounds: [[number, number], [number, number]] | null = poiBounds(packs.pois);
      let center: [number, number] = [35, 39];
      let zoom = 5;
      let minZoom = 2;
      if (packs.mapSrc) {
        try {
          const { addPmtilesSource } = await import('../lib/map/pmtilesSource');
          const { url, pmtiles } = addPmtilesSource(ml, packs.mapSrc);
          const h = await pmtiles.getHeader();
          style = darkProtomapsStyle(url);
          center = [h.centerLon, h.centerLat];
          zoom = h.centerZoom || 12;
          // Paketin en küçük yakınlaştırmasının altında karo yok: boş ekran yerine sınırla
          minZoom = Math.max(minZoom, h.minZoom);
          if (!bounds) bounds = [[h.minLon, h.minLat], [h.maxLon, h.maxLat]];
        } catch (e) {
          console.warn('[harita] PMTiles okunamadı', e);
          if (!cancelled) setToast('Harita paketi okunamadı; yalnızca noktalar gösteriliyor.');
        }
      }
      if (cancelled || !mapEl.current) return;
      try {
        map = new ml.Map({
          container: mapEl.current,
          style,
          center,
          zoom,
          minZoom,
          maxZoom: 18,
          attributionControl: false,
          fadeDuration: saver() ? 0 : 300,
          ...(lowPower() ? { pixelRatio: 1 } : {}),
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          renderWorldCopies: false,
          locale: {
            'NavigationControl.ZoomIn': 'Yakınlaştır',
            'NavigationControl.ZoomOut': 'Uzaklaştır',
          },
        } as any);
      } catch (e) {
        console.warn('[harita] WebGL', e);
        setMapError('Harita bu cihazda çizilemedi (WebGL desteklenmiyor). Noktalar aşağıda liste olarak gösteriliyor.');
        return;
      }
      map.touchZoomRotate.disableRotation();
      map.addControl(new ml.NavigationControl({ showCompass: false }), 'top-left');
      map.on('error', (ev: any) => console.warn('[harita]', ev?.error?.message ?? ev));
      if (bounds) {
        const same = bounds[0][0] === bounds[1][0] && bounds[0][1] === bounds[1][1];
        if (same) map.jumpTo({ center: bounds[0], zoom: 15 });
        else map.fitBounds(bounds, { padding: 40, animate: false, maxZoom: 15 });
      }
      mapRef.current = map;
      if (import.meta.env.DEV) (window as any).__acMap = map;
      const addOverlays = () => {
        if (cancelled || !map) return;
        if (ensureOverlayLayers(map)) setOverlayReady((n) => n + 1);
      };
      map.on('load', () => {
        if (cancelled) return;
        setMapReady(true);
        addOverlays();
      });
      // Uzun basma (dokunmatik) ve sağ tık: o noktaya yer işareti ekle
      map.on('contextmenu', (ev: any) => {
        if (cancelled) return;
        openAddAt({ lat: ev.lngLat.lat, lon: ev.lngLat.lng });
      });
      installLongPress(map, (ll) => !cancelled && openAddAt(ll));
      setMapReady(true);
    })();
    return () => {
      cancelled = true;
      markers.current.forEach((m) => m.marker.remove());
      markers.current.clear();
      poiLayer.current = null;
      wpMarkers.current.forEach((m) => m.marker.remove());
      wpMarkers.current.clear();
      userMarker.current?.remove();
      userMarker.current = null;
      map?.remove();
      mapRef.current = null;
      setOverlayReady(0);
    };
  }, [packs, hasAnything]);

  // Düşük güç ayarı değişince: piksel oranı ve konum takibi hemen uyar
  useEffect(
    () =>
      onSettingsChange(() => {
        const map = mapRef.current;
        const low = lowPower();
        try {
          map?.setPixelRatio(low ? 1 : window.devicePixelRatio || 1);
        } catch {}
        if (low && watchId.current !== null) {
          navigator.geolocation?.clearWatch(watchId.current);
          watchId.current = null;
        }
        if (low && yerelAktif.current && locRef.current) {
          yerelAktif.current = false;
          nativeKonum.stop();
        }
      }),
    [],
  );

  // ---- Nokta işaretçileri ----
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!map || !ml || !mapReady) return;
    if (markers.current.size || poiLayer.current) return;
    if (packs.pois.length > POI_DOM_LIMIT) {
      // Türkiye geneli paket: on binlerce DOM işaretçisi sayfayı dondurur → WebGL katmanı + kümeleme
      const add = () => {
        if (poiLayer.current || mapRef.current !== map) return;
        try {
          poiLayer.current = addPoiLayers(map, packs.pois, (id) => selectPoi(id), filterRef.current);
          poiLayer.current.setSelected(selectedRef.current);
        } catch (e) {
          console.warn('[harita] nokta katmanı eklenemedi', e);
        }
      };
      if (map.isStyleLoaded()) add();
      else map.once('load', add);
      return;
    }
    for (const p of packs.pois) {
      const t = POI_TYPES[p.type];
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'poi-mk';
      el.style.setProperty('--c', t.color);
      el.textContent = t.letter;
      el.setAttribute('aria-label', `${t.label}: ${p.name}`);
      el.title = `${t.label}: ${p.name}`;
      el.dataset.testid = 'poi-marker';
      el.dataset.type = p.type;
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        selectPoi(p.id);
      });
      const marker = new ml.Marker({ element: el }).setLngLat([p.lon, p.lat]).addTo(map);
      markers.current.set(p.id, { marker, el });
    }
  }, [mapReady, packs.pois]);

  // Katman modunda süzgeç ve seçim
  const filterRef = useRef(filter);
  const selectedRef = useRef(selectedId);
  filterRef.current = filter;
  selectedRef.current = selectedId;
  useEffect(() => {
    poiLayer.current?.setFilter(filter);
  }, [filter]);
  useEffect(() => {
    poiLayer.current?.setSelected(selectedId);
  }, [selectedId]);

  useEffect(() => {
    markers.current.forEach(({ el }, id) => {
      const p = poiById.get(id);
      const visible = filter === 'hepsi' || p?.type === filter || id === selectedId;
      el.classList.toggle('hidden', !visible);
      el.classList.toggle('sel', id === selectedId);
      el.setAttribute('aria-pressed', id === selectedId ? 'true' : 'false');
    });
  });

  // ---- Kullanıcı işaretçisi ----
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!map || !ml || !loc) return;
    if (!userMarker.current) {
      const el = createUserElement();
      setUserHeading(el, heading, map.getBearing());
      userMarker.current = new ml.Marker({ element: el }).setLngLat([loc.lon, loc.lat]).addTo(map);
    } else userMarker.current.setLngLat([loc.lon, loc.lat]);
    if (centerOnFix.current) {
      centerOnFix.current = false;
      moveTo([loc.lon, loc.lat], Math.max(map.getZoom(), 14));
    }
  }, [loc, mapReady]);

  // ---- Pusula konisi ----
  useEffect(() => {
    const el = userMarker.current?.getElement();
    if (el) setUserHeading(el, heading, mapRef.current?.getBearing() ?? 0);
  }, [heading, loc, mapReady]);

  // ---- İz kaydı: yenilemeden sonra devam et, kayıt konumlarını mavi noktaya ver ----
  useEffect(() => {
    recorder.resume();
    return recorder.onFix((f) => {
      setLoc({ lat: f.lat, lon: f.lon, accuracy: f.acc, timestamp: f.t });
      setLocState('ok');
    });
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !overlayReady) return;
    setSourceData(map, TRACK_SRC, trackFC(track.points));
  }, [track.points, overlayReady]);

  // ---- Hedef çizgisi ----
  const navPath = useMemo(() => {
    if (!nav || !loc) return null;
    if (nav.kind === 'start') {
      if (!track.points.length) return null;
      if (nav.mode === 'track' && track.points.length > 1) return backtrack(track.points, loc)!.path;
      return [loc, track.points[0]];
    }
    return [loc, nav];
  }, [nav, loc, track.points]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !overlayReady) return;
    setSourceData(map, NAV_SRC, navFC(navPath, nav?.kind === 'start' && nav.mode === 'track' ? 'track' : 'straight'));
  }, [navPath, overlayReady]);

  // Hedef geçersizleştiyse (yer işareti silindi, iz silindi) kaldır; konum yoksa iste
  useEffect(() => {
    if (!nav) return;
    if (nav.kind === 'wp' && !wps.some((w) => w.id === nav.id)) setNavTarget(null);
    else if (nav.kind === 'start' && !track.points.length) setNavTarget(null);
  }, [nav, wps, track.points.length]);

  useEffect(() => {
    if (nav && !loc && (locState === 'idle' || locState === 'ok')) locate(false);
  }, [nav?.lat, nav?.lon]);

  // ---- Yer işareti işaretçileri ----
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!map || !ml || !mapReady) return;
    const seen = new Set<string>();
    for (const w of wps) {
      seen.add(w.id);
      const t = WAYPOINT_TYPES[w.type];
      const key = `${w.type}|${w.name}|${w.lat}|${w.lon}`;
      const cur = wpMarkers.current.get(w.id);
      if (cur && cur.key === key) continue;
      cur?.marker.remove();
      const el = createWaypointElement(t.letter, t.color, `${t.label}: ${w.name}`);
      el.dataset.type = w.type;
      el.dataset.id = w.id;
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        setWpSheet({ adding: false, preset: { focusId: w.id } });
      });
      const marker = new ml.Marker({ element: el, anchor: 'bottom' }).setLngLat([w.lon, w.lat]).addTo(map);
      wpMarkers.current.set(w.id, { marker, el, key });
    }
    wpMarkers.current.forEach((m, id) => {
      if (!seen.has(id)) {
        m.marker.remove();
        wpMarkers.current.delete(id);
      }
    });
  }, [wps, mapReady]);

  useEffect(() => {
    wpMarkers.current.forEach(({ el }, id) => el.classList.toggle('sel', nav?.kind === 'wp' && nav.id === id));
  });

  // ---- Konum ----
  useEffect(
    () => () => {
      if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current);
      if (yerelAktif.current) nativeKonum.stop();
      yerelAktif.current = false;
    },
    [],
  );

  // Android yerel konum araması: saniyede bir uydu durumu; bulunan konum doğrudan kullanılır
  useEffect(
    () =>
      nativeKonum.listen((d) => {
        if (!yerelAktif.current) return;
        setKonumDurum(d);
        const k = d.konum;
        if (!k) return;
        const o = locRef.current;
        if (!o || o.lat !== k.lat || o.lon !== k.lon || o.accuracy !== k.dogruluk) {
          setLoc({ lat: k.lat, lon: k.lon, accuracy: k.dogruluk, timestamp: k.zaman });
        }
        setLocState('ok');
        if (lowPower()) {
          yerelAktif.current = false;
          nativeKonum.stop();
        }
      }),
    [],
  );

  async function yerelBaslat(center: boolean) {
    const izin = await nativeKonum.start();
    if (izin === null) {
      webLocate(center);
      return;
    }
    yerelAktif.current = izin !== 'yok';
    if (izin === 'yok') {
      setLocState('denied');
      if (wantNearest.current) setToast(null);
      wantNearest.current = false;
    }
  }

  // Konum geldiğinde bekleyen "en yakın" isteğini tamamla
  useEffect(() => {
    if (loc && wantNearest.current) {
      wantNearest.current = false;
      pickNearest(loc, true);
    }
  }, [loc]);

  const poiById = useMemo(() => new Map(packs.pois.map((p) => [p.id, p])), [packs.pois]);
  const selected = selectedId ? poiById.get(selectedId) ?? null : null;

  function moveTo(center: [number, number], zoom?: number) {
    const map = mapRef.current;
    if (!map) return;
    const opts = { center, zoom: zoom ?? map.getZoom() };
    if (saver()) map.jumpTo(opts);
    else map.easeTo({ ...opts, duration: 450 });
  }

  function openAddAt(ll: LatLon) {
    setWpSheet({ adding: true, preset: { picked: ll } });
  }

  function mapCenter(): LatLon | null {
    const c = mapRef.current?.getCenter();
    return c ? { lat: c.lat, lon: c.lng } : null;
  }

  function fitPoints(pts: LatLon[]) {
    const map = mapRef.current;
    if (!map || !pts.length) return;
    let w = 180, s2 = 90, e = -180, n = -90;
    for (const p of pts) {
      w = Math.min(w, p.lon);
      e = Math.max(e, p.lon);
      s2 = Math.min(s2, p.lat);
      n = Math.max(n, p.lat);
    }
    if (w === e && s2 === n) moveTo([w, s2], Math.max(map.getZoom(), 16));
    else map.fitBounds([[w, s2], [e, n]], { padding: 60, maxZoom: 17, animate: !saver(), duration: 450 });
  }

  function selectPoi(id: string | null) {
    setSelectedId(id);
    if (!id) return;
    const p = packs.pois.find((x) => x.id === id);
    if (p) moveTo([p.lon, p.lat]);
  }

  function locate(center = true) {
    centerOnFix.current = center;
    if (loc && center) moveTo([loc.lon, loc.lat], Math.max(mapRef.current?.getZoom() ?? 14, 14));
    if (!loc && locState !== 'waiting') {
      setLocState('waiting');
      setAramaBas(Date.now());
      setKonumDurum(null);
    }
    if (nativeKonum.available()) {
      if (!yerelAktif.current) yerelBaslat(center);
      return;
    }
    webLocate(center);
  }

  function webLocate(center: boolean) {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocState('unsupported');
      return;
    }
    if (typeof isSecureContext !== 'undefined' && !isSecureContext) {
      setLocState('insecure');
      return;
    }
    centerOnFix.current = center;
    if (!loc) setLocState('waiting');
    const onOk = (p: GeolocationPosition) => {
      setLoc({ lat: p.coords.latitude, lon: p.coords.longitude, accuracy: p.coords.accuracy, timestamp: p.timestamp });
      sonKonumKaydet({ lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy });
      setLocState('ok');
    };
    const onErr = (e: GeolocationPositionError) => {
      const st: LocState = e.code === 1 ? 'denied' : e.code === 3 ? 'timeout' : 'unavailable';
      setLocState(st);
      if (wantNearest.current) setToast(null); // "Konum aranıyor" artık doğru değil; hata mesajı altta
      wantNearest.current = false;
    };
    const opts: PositionOptions = { enableHighAccuracy: true, timeout: 5 * 60 * 1000, maximumAge: 30_000 };
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    // Düşük güçte tek seferlik konum; normalde sürekli takip
    if (lowPower()) navigator.geolocation.getCurrentPosition(onOk, onErr, opts);
    else watchId.current = navigator.geolocation.watchPosition(onOk, onErr, opts);
  }

  function pickNearest(from: LatLon | null, fromUser: boolean) {
    const list = packs.pois.filter((p) => p.type === 'toplanma');
    if (!list.length) {
      setToast('Nokta paketinde toplanma alanı yok.');
      return;
    }
    let ref = from;
    if (!ref) {
      const c = mapRef.current?.getCenter();
      ref = c ? { lat: c.lat, lon: c.lng } : list[0];
    }
    const n = nearest(ref, list)!;
    if (filter !== 'hepsi' && filter !== 'toplanma') setFilter('toplanma');
    setSelectedId(n.item.id);
    const map = mapRef.current;
    if (map && fromUser && from) {
      // Kullanıcıyı ve hedefi birlikte göster
      const p = n.item;
      map.fitBounds(
        [
          [Math.min(p.lon, from.lon), Math.min(p.lat, from.lat)],
          [Math.max(p.lon, from.lon), Math.max(p.lat, from.lat)],
        ],
        { padding: 70, maxZoom: 16, animate: !saver(), duration: 450 },
      );
    } else moveTo([n.item.lon, n.item.lat]);
    setToast(fromUser ? null : 'Konumun henüz bilinmiyor: harita merkezine en yakın toplanma alanı seçildi. Konum aranıyor…');
  }

  function onNearest() {
    if (loc) pickNearest(loc, true);
    else {
      wantNearest.current = true;
      pickNearest(null, false);
      locate(false);
    }
  }

  // Yeni açılan kart kayan kart alanında görünür olsun
  useEffect(() => {
    if (izOpen) document.querySelector('[data-testid="track-card"]')?.scrollIntoView({ block: 'nearest' });
  }, [izOpen]);
  useEffect(() => {
    if (nav) document.querySelector('[data-testid="nav-card"]')?.scrollIntoView({ block: 'nearest' });
  }, [nav?.kind, nav?.id]);
  useEffect(() => {
    if (selectedId) document.querySelector('[data-testid="poi-card"]')?.scrollIntoView({ block: 'nearest' });
  }, [selectedId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const rel = selected && loc ? { d: distanceM(loc, selected), b: bearingDeg(loc, selected) } : null;
  const locMsg = LOC_MSG[locState];
  const visiblePois = packs.pois.filter((p) => filter === 'hepsi' || p.type === filter);

  // ---- Görünüm ----
  if (packs.status === 'loading') {
    return (
      <div class="harita">
        <p class="empty">Harita paketleri aranıyor…</p>
      </div>
    );
  }

  return (
    <div class="harita">
      {hasAnything && (
        <div class="chips-row" role="group" aria-label="Nokta türü">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              class="chip"
              data-testid="poi-filter"
              data-filter={f.id}
              aria-pressed={filter === f.id ? 'true' : 'false'}
              onClick={() => setFilter(f.id)}
            >
              {f.id !== 'hepsi' && <TypeBadge type={f.id} size={18} />}
              {f.label}
            </button>
          ))}
        </div>
      )}

      {packs.errors.map((e) => (
        <p class="warn map-err" role="alert">
          {e}
        </p>
      ))}

      {!hasAnything ? (
        <div class="card map-empty">
          <div class="row">
            <IconMap size={22} />
            <strong>Harita ve nokta paketi yüklü değil</strong>
          </div>
          <p class="empty">
            Çevrimdışı harita (.pmtiles) ve toplanma alanı / sağlık / eczane / su / barınma noktaları (.geojson) paketlerini
            Araçlar → Paketler ve paylaşım bölümünden indirebilir ya da dosyadan içe aktarabilirsiniz. Konumunuzu paketsiz de görebilir
            ve paylaşabilirsiniz.
          </p>
          <button type="button" class="btn primary" data-testid="map-get-packs" onClick={() => go.tool('paylas')}>
            Paket ekle
          </button>
        </div>
      ) : (
        <div class="map-wrap">
          <div class="map-canvas" ref={mapEl} data-testid="map" aria-label="Harita" role="region" />
          {!packs.mapSrc && (
            <div class="map-notice" role="status">
              <span>Harita paketi yüklü değil — sadece noktalar gösteriliyor</span>
              <button type="button" class="link-btn" data-testid="map-notice-packs" onClick={() => go.tool('paylas')}>
                Paket ekle
              </button>
            </div>
          )}
          {packs.mapSrc && !packs.poiLoaded && (
            <div class="map-notice" role="status">
              <span>Nokta paketi yüklü değil — toplanma alanları gösterilemiyor</span>
              <button type="button" class="link-btn" data-testid="map-notice-packs" onClick={() => go.tool('paylas')}>
                Paket ekle
              </button>
            </div>
          )}
          <button type="button" class="map-fab" data-testid="map-locate" onClick={() => locate(true)} aria-label="Konumum">
            <IconLocate size={18} />
            <span>Konumum</span>
          </button>
          {loc && compass.status === 'needs-permission' && (
            <button type="button" class="map-fab map-fab2" data-testid="map-compass" onClick={() => requestCompassPermission()} aria-label="Pusulayı aç">
              <span>Pusulayı aç</span>
            </button>
          )}
          {track.recording && <RecBadge track={track} onClick={() => setIzOpen(true)} />}
          {toast && (
            <div class="map-toast" role="status">
              {toast}
            </div>
          )}
          <div class="map-attrib">© OpenStreetMap katkıcıları</div>
          {mapError && (
            <div class="map-fallback">
              <p class="warn">{mapError}</p>
              {visiblePois
                .map((p) => ({ p, d: loc ? distanceM(loc, p) : NaN }))
                .sort((a, b) => (isNaN(a.d) ? 0 : a.d - b.d))
                .slice(0, 50)
                .map(({ p, d }) => (
                  <button type="button" class="list-btn" key={p.id} onClick={() => selectPoi(p.id)}>
                    <span class="row">
                      <TypeBadge type={p.type} size={18} /> {p.name}
                    </span>
                    {!isNaN(d) && <span class="muted mono">{formatDistance(d)} · {compassText(bearingDeg(loc!, p))}</span>}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Kartlar (konum mesajı, nokta, hedef, iz) haritanın altında kendi içinde kayar:
          küçük ekranda birkaç kart açıkken sayfa kaymaz, harita görünür kalır. */}
      {(locMsg || selected || nav || izOpen) && (
      <div class="map-panels" data-testid="map-panels">
      {locState === 'waiting' ? (
        <KonumArama durum={konumDurum} baslangic={aramaBas} kompakt />
      ) : (
        locMsg && <KonumHata locState={locState} />
      )}

      {selected && (
        <div class="card poi-card" data-testid="poi-card" role="region" aria-label="Seçili nokta">
          <div class="row">
            <TypeBadge type={selected.type} />
            <span class="label grow">{POI_TYPES[selected.type].label}</span>
            <button type="button" class="poi-close" data-testid="poi-close" aria-label="Nokta kartını kapat" onClick={() => setSelectedId(null)}>
              ×
            </button>
          </div>
          <div class="poi-name">{selected.name}</div>
          {selected.note && <div class="muted poi-note">{selected.note}</div>}
          <div class="poi-dist mono" data-testid="poi-dist">
            {rel
              ? `${formatDistance(rel.d)} · yürüyerek ~${formatDuration(walkMinutes(rel.d))} · ${compassText(rel.b)} (kuş uçuşu)`
              : 'Konum bilinmiyor'}
          </div>
          <div class="row">
            <button type="button" class="btn primary grow" data-testid="poi-direction" onClick={() => setPanel('yon')}>
              Yön göster
            </button>
            <button
              type="button"
              class="btn grow"
              data-testid="poi-route"
              onClick={() => void openDirections({ lat: selected.lat, lon: selected.lon, name: selected.name })}
            >
              Yol tarifi
            </button>
          </div>
        </div>
      )}

      {nav && (
        <NavCard
          target={nav}
          loc={loc}
          heading={heading}
          track={track}
          locMsg={locMsg}
          onLocate={() => locate(false)}
          onFit={() => navPath && fitPoints(navPath)}
        />
      )}

      {izOpen && <IzCard track={track} loc={loc} onClose={() => setIzOpen(false)} onFit={() => fitPoints(track.points)} />}
      </div>
      )}

      <div class="row map-actions">
        {hasAnything && (
          <button type="button" class="btn primary grow" data-testid="map-nearest" onClick={onNearest} disabled={!packs.pois.some((p) => p.type === 'toplanma')}>
            En yakın toplanma alanı
          </button>
        )}
        <button type="button" class="btn grow" data-testid="map-saymyloc" onClick={() => setPanel('konum')}>
          Konumumu söyle
        </button>
      </div>
      <div class="row map-actions">
        <button
          type="button"
          class={'btn grow' + (track.recording ? ' rec' : '')}
          data-testid="map-track"
          aria-expanded={izOpen ? 'true' : 'false'}
          onClick={() => setIzOpen(!izOpen)}
        >
          {track.recording && <span class="rec-dot on" aria-hidden="true" />}
          İz kaydı
        </button>
        <button type="button" class="btn grow" data-testid="map-waypoints" onClick={() => setWpSheet({ adding: false, preset: {} })}>
          Yer işaretleri{wps.length ? ` (${wps.length})` : ''}
        </button>
      </div>
      {!hasAnything && (
        <p class="warn">Harita paketi olmadan da iz kaydı ve yer işaretleri çalışır; yön ve mesafe Pusula aracında görünür.</p>
      )}

      {wpSheet && (
        <WaypointSheet
          list={wps}
          loc={loc}
          center={mapCenter}
          preset={wpSheet.preset}
          startAdding={wpSheet.adding}
          onClose={() => setWpSheet(null)}
          onShow={(w: Waypoint) => {
            setWpSheet(null);
            moveTo([w.lon, w.lat], Math.max(mapRef.current?.getZoom() ?? 15, 15));
          }}
        />
      )}

      {panel === 'konum' && <KonumPanel loc={loc} locState={locState} durum={konumDurum} baslangic={aramaBas} onLocate={() => locate(false)} onClose={() => setPanel(null)} />}
      {panel === 'yon' && selected && (
        <YonPanel poi={selected} loc={loc} locState={locState} durum={konumDurum} baslangic={aramaBas} onLocate={() => locate(false)} onClose={() => setPanel(null)} />
      )}
    </div>
  );
}

/** Konum hatası; Android'de izin reddinde ayarlara giden düğmeyle */
function KonumHata({ locState }: { locState: LocState }) {
  return (
    <div class="col">
      <p class="loc-msg bad" role="status" data-testid="loc-msg">
        {LOC_MSG[locState]}
      </p>
      {locState === 'denied' && nativeKonum.available() && (
        <button type="button" class="btn" data-testid="loc-app-settings" onClick={() => nativeKonum.openAppSettings()}>
          Uygulama izinlerini aç
        </button>
      )}
    </div>
  );
}

function NeedLocation({ locState, onLocate, durum, baslangic }: { locState: LocState; onLocate: () => void; durum: KonumDurum | null; baslangic: number }) {
  if (locState === 'waiting') return <KonumArama durum={durum} baslangic={baslangic} testid="loc-search-panel" />;
  return (
    <div class="col">
      {locState !== 'idle' && LOC_MSG[locState] ? <KonumHata locState={locState} /> : <p class="empty">Konumunuz henüz bilinmiyor.</p>}
      {locState !== 'unsupported' && locState !== 'insecure' && (
        <button type="button" class="btn primary" onClick={onLocate}>
          {locState === 'idle' ? 'Konumumu bul' : 'Yeniden dene'}
        </button>
      )}
    </div>
  );
}

function KonumPanel({ loc, locState, onLocate, onClose, durum, baslangic }: { loc: UserLoc | null; locState: LocState; onLocate: () => void; onClose: () => void; durum: KonumDurum | null; baslangic: number }) {
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    if (!loc && locState === 'idle') onLocate();
  }, []);
  return (
    <Sheet title="Konumum" testid="map-loc-panel" onClose={onClose}>
      {!loc ? (
        <NeedLocation locState={locState} onLocate={onLocate} durum={durum} baslangic={baslangic} />
      ) : (
        <div class="col">
          <div>
            <div class="label">Ondalık</div>
            <div class="big-coord mono" data-testid="loc-decimal">
              {formatDecimal(loc.lat, loc.lon)}
            </div>
          </div>
          <div>
            <div class="label">Derece · dakika · saniye</div>
            <div class="big-coord mono" data-testid="loc-dms">
              {toDMS(loc.lat, 'lat')}
              <br />
              {toDMS(loc.lon, 'lon')}
            </div>
          </div>
          <div class="muted">
            Doğruluk: ± {formatDistance(loc.accuracy)} · Saat {fmtTime(loc.timestamp)}
          </div>
          <div class="row">
            <button
              type="button"
              class="btn grow"
              data-testid="loc-copy"
              onClick={async () => setCopied((await copyText(locationMessage(loc.lat, loc.lon))) ? 'Kopyalandı' : 'Kopyalanamadı')}
            >
              {copied ?? 'Kopyala'}
            </button>
            <a class="btn primary grow sms-btn" data-testid="loc-sms" href={smsHref(loc.lat, loc.lon)}>
              SMS ile gönder
            </a>
          </div>
          <p class="warn">SMS, internet olmasa da şebeke varsa gidebilir. Kurtarma ekiplerine ondalık koordinatı okuyun.</p>
        </div>
      )}
    </Sheet>
  );
}

function YonPanel({ poi, loc, locState, onLocate, onClose, durum, baslangic }: { poi: Poi; loc: UserLoc | null; locState: LocState; onLocate: () => void; onClose: () => void; durum: KonumDurum | null; baslangic: number }) {
  const c = useCompass(true);
  const heading = c.status === 'ok' ? c.heading : null;
  const needPerm = c.status === 'needs-permission';
  useEffect(() => {
    if (!loc && locState === 'idle') onLocate();
  }, []);
  const t = POI_TYPES[poi.type];
  return (
    <Sheet title={`Yön: ${poi.name}`} testid="map-dir-panel" onClose={onClose}>
      {!loc ? (
        <NeedLocation locState={locState} onLocate={onLocate} durum={durum} baslangic={baslangic} />
      ) : (
        (() => {
          const d = distanceM(loc, poi);
          const b = bearingDeg(loc, poi);
          const rot = heading === null ? b : (b - heading + 360) % 360;
          return (
            <div class="col center">
              <div class="row">
                <TypeBadge type={poi.type} /> <span class="label">{t.label}</span>
              </div>
              <svg class="dir-arrow" viewBox="0 0 100 100" width="180" height="180" role="img" aria-label={`Yön ${compassLong(b)}`}>
                <circle cx="50" cy="50" r="46" fill="none" stroke="#2E3643" stroke-width="2" />
                <text x="50" y="13" text-anchor="middle" fill="#9AA4B2" font-size="9" font-family="IBM Plex Mono, monospace">
                  {heading === null ? 'K' : ''}
                </text>
                <g transform={`rotate(${rot} 50 50)`}>
                  <path d="M50 14 L66 62 L50 53 L34 62 Z" fill="#F5A524" />
                </g>
              </svg>
              <div class="dir-big mono" data-testid="dir-text">
                {compassText(b)} · {Math.round(b)}°
              </div>
              <div class="dir-sub">{compassLong(b)} yönünde</div>
              <div class="dir-big mono">{formatDistance(d)}</div>
              <div class="muted">yürüyerek yaklaşık {formatDuration(walkMinutes(d))} (4,5 km/sa)</div>
              <p class="warn dir-note">
                Kuş uçuşu yön; yollar farklı olabilir. Yıkıntı, köprü ve dik yamaçlardan uzak durun.
                {heading === null
                  ? ' Ok, telefonun üst kenarı kuzeyi gösterirken doğrudur (pusula verisi yok).'
                  : ' Ok, telefonun pusulasına göre döner; metal ve mıknatıslardan uzak tutun.'}
              </p>
              {needPerm && (
                <button type="button" class="btn" data-testid="dir-compass" onClick={() => requestCompassPermission()}>
                  Pusulayı kullan
                </button>
              )}
            </div>
          );
        })()
      )}
    </Sheet>
  );
}

function RecBadge({ track, onClick }: { track: ReturnType<typeof useTrack>; onClick: () => void }) {
  useTicker(true);
  return (
    <button type="button" class="rec-badge" data-testid="track-badge" onClick={onClick} aria-label="İz kaydı sürüyor, ayrıntılar">
      <span class="rec-dot on" aria-hidden="true" />
      <span class="mono">
        {formatDistance(pathLength(track.points))} · {formatClock(trackDurationMs(track))}
      </span>
    </button>
  );
}

/** Dokunmatik uzun basma (600 ms, 10 px'ten az kayma) → harita koordinatı. */
function installLongPress(map: MlMap, cb: (ll: LatLon) => void) {
  const el = map.getCanvasContainer();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let start: { x: number; y: number } | null = null;
  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    start = null;
  };
  el.addEventListener('touchstart', (e: TouchEvent) => {
    if (e.touches.length !== 1) return cancel();
    const t = e.touches[0];
    const r = el.getBoundingClientRect();
    start = { x: t.clientX - r.left, y: t.clientY - r.top };
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (!start) return;
      const ll = map.unproject([start.x, start.y]);
      cancel();
      cb({ lat: ll.lat, lon: ll.lng });
    }, 600);
  }, { passive: true });
  el.addEventListener('touchmove', (e: TouchEvent) => {
    if (!start || !timer) return;
    const t = e.touches[0];
    const r = el.getBoundingClientRect();
    if (Math.hypot(t.clientX - r.left - start.x, t.clientY - r.top - start.y) > 10) cancel();
  }, { passive: true });
  el.addEventListener('touchend', cancel);
  el.addEventListener('touchcancel', cancel);
}
