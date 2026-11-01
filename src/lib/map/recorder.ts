// İz kaydedici: tek bir geolocation takibi, süzgeç ve kalıcı saklama.
// Modül düzeyinde tekil; sekme değişse de kayıt sürer, sayfa yenilenince
// kaldığı yerden devam eder (resume()).
import { useEffect, useState } from 'preact/hooks';
import {
  acceptPoint,
  emptyTrack,
  loadTrack,
  safeLocalStorage,
  saveTrack,
  thinPoints,
  type TrackPoint,
  type TrackState,
} from './track';

export interface Fix extends TrackPoint {}

type Listener = (s: TrackState) => void;
type FixListener = (f: Fix) => void;
export type RecorderError = 'denied' | 'unavailable' | 'timeout' | 'unsupported' | 'insecure' | null;

const kv = safeLocalStorage();
let state: TrackState = loadTrack(kv);
let error: RecorderError = null;
let watchId: number | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
const subs = new Set<Listener>();
const fixSubs = new Set<FixListener>();

const SAVE_EVERY_MS = 3000;

function emit() {
  subs.forEach((f) => f(state));
}

function persist(now = false) {
  if (now) {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = null;
    saveTrack(kv, state);
    return;
  }
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveTrack(kv, state);
  }, SAVE_EVERY_MS);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => saveTimer && persist(true));
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && saveTimer && persist(true));
}

function onFix(p: GeolocationPosition) {
  const f: Fix = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, t: p.timestamp || Date.now() };
  error = null;
  fixSubs.forEach((fn) => fn(f));
  if (!state.recording) return;
  const last = state.points[state.points.length - 1];
  const r = acceptPoint(last, f);
  if (r.ok) state = { ...state, points: thinPoints([...state.points, f]) };
  else state = { ...state, rejected: state.rejected + 1 };
  persist();
  emit();
}

function onErr(e: GeolocationPositionError) {
  error = e.code === 1 ? 'denied' : e.code === 3 ? 'timeout' : 'unavailable';
  emit();
}

function startWatch(): boolean {
  if (watchId !== null) return true;
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    error = 'unsupported';
    return false;
  }
  if (typeof isSecureContext !== 'undefined' && !isSecureContext) {
    error = 'insecure';
    return false;
  }
  watchId = navigator.geolocation.watchPosition(onFix, onErr, { enableHighAccuracy: true, maximumAge: 0, timeout: 5 * 60 * 1000 });
  return true;
}

function stopWatch() {
  if (watchId !== null) navigator.geolocation?.clearWatch(watchId);
  watchId = null;
}

export const recorder = {
  get: () => state,
  error: () => error,
  isWatching: () => watchId !== null,
  /** Yeni iz başlatır (eski iz silinir). */
  start() {
    state = { ...emptyTrack(), recording: true, startedAt: Date.now() };
    error = null;
    startWatch();
    persist(true);
    emit();
  },
  /** Durdurulmuş izi aynı kayda devam ettirir. */
  continue() {
    if (state.startedAt == null) return recorder.start();
    state = { ...state, recording: true, stoppedAt: null };
    startWatch();
    persist(true);
    emit();
  },
  stop() {
    stopWatch();
    state = { ...state, recording: false, stoppedAt: Date.now() };
    persist(true);
    emit();
  },
  clear() {
    stopWatch();
    state = emptyTrack();
    persist(true);
    emit();
  },
  /** Yenilemeden sonra: kayıt açıktıysa takibi yeniden başlat. */
  resume() {
    if (state.recording && watchId === null) {
      startWatch();
      emit();
    }
  },
  subscribe(fn: Listener) {
    subs.add(fn);
    return () => subs.delete(fn);
  },
  /** Kayıt sırasında gelen her ham konum (harita mavi noktası için). */
  onFix(fn: FixListener) {
    fixSubs.add(fn);
    return () => fixSubs.delete(fn);
  },
};

export function useTrack(): TrackState {
  const [s, setS] = useState(state);
  useEffect(() => {
    setS(state);
    const un = recorder.subscribe(setS);
    return () => {
      un();
    };
  }, []);
  return s;
}
