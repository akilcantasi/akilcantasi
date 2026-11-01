// Ortak pusula dinleyicisi (harita + pusula aracı aynı sensörü paylaşır).
// Abone kalmayınca dinleme durur (pil).
import { useEffect, useState } from 'preact/hooks';
import { headingFromOrientation, smoothHeading } from './compass';

export type CompassStatus = 'idle' | 'pending' | 'ok' | 'needs-permission' | 'denied' | 'no-sensor' | 'unsupported';

export interface CompassState {
  status: CompassStatus;
  heading: number | null;
  accuracy: number | null;
  tilted: boolean;
  source: 'ios' | 'absolute' | null;
}

const IDLE: CompassState = { status: 'idle', heading: null, accuracy: null, tilted: false, source: null };
let state: CompassState = IDLE;
const subs = new Set<(s: CompassState) => void>();
let listening = false;
let noDataTimer: ReturnType<typeof setTimeout> | null = null;
let lastEmit = 0;
let gotData = false;

const NO_DATA_MS = 3000;

let emitted: CompassState = IDLE;

function set(patch: Partial<CompassState>, force = false) {
  state = { ...state, ...patch };
  const a = emitted;
  const b = state;
  // Son GÖNDERİLEN duruma göre karşılaştır: kısıtlama yüzünden atlanan değişiklik kaybolmasın
  const changed =
    b.status !== a.status ||
    b.tilted !== a.tilted ||
    b.accuracy !== a.accuracy ||
    (b.heading == null) !== (a.heading == null) ||
    (b.heading != null && a.heading != null && Math.abs(b.heading - a.heading) >= 0.5);
  if (!changed && !force) return;
  const now = Date.now();
  // ekranı en fazla ~15 kez/sn güncelle (durum değişimleri hemen)
  if (!force && b.status === a.status && now - lastEmit < 66) return;
  lastEmit = now;
  emitted = state;
  subs.forEach((f) => f(state));
}

function screenAngle(): number {
  try {
    const a = (screen as any)?.orientation?.angle;
    if (typeof a === 'number') return a;
    const w = (window as any).orientation;
    return typeof w === 'number' ? w : 0;
  } catch {
    return 0;
  }
}

const hasPermissionApi = () => typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function';

/** iPhone/iPad (iPadOS kendini Mac olarak tanıtır): izin dokunuşla istenmeli. */
const isIOSLike = () => {
  try {
    return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  } catch {
    return false;
  }
};

function onEvent(e: Event, forceAbsolute: boolean) {
  const r = headingFromOrientation(e as any, screenAngle(), forceAbsolute);
  if (!r) return;
  gotData = true;
  if (noDataTimer) {
    clearTimeout(noDataTimer);
    noDataTimer = null;
  }
  set({
    status: 'ok',
    heading: smoothHeading(state.heading, r.heading, 0.35),
    accuracy: r.accuracy,
    tilted: r.tilted,
    source: r.source,
  });
}

const onAbs = (e: Event) => onEvent(e, true);
const onRel = (e: Event) => onEvent(e, false); // iOS (webkitCompassHeading) ve Firefox (absolute=true)

function start() {
  if (listening || typeof window === 'undefined') return;
  if (!('DeviceOrientationEvent' in window)) {
    set({ status: 'unsupported' }, true);
    return;
  }
  listening = true;
  gotData = false;
  window.addEventListener('deviceorientationabsolute' as any, onAbs);
  window.addEventListener('deviceorientation', onRel);
  if (state.status !== 'denied') {
    set({ status: hasPermissionApi() && isIOSLike() ? 'needs-permission' : 'pending' }, true);
  }
  // iOS dışındaki tarayıcılar (masaüstü Chrome da requestPermission sunar ama
  // izin istemeden olay gönderir) veri gelmezse "sensör yok" der; iOS'ta
  // "Pusulayı başlat" düğmesi kalır (izin yalnızca dokunuşla istenebilir).
  if (!(hasPermissionApi() && isIOSLike())) armNoDataTimer();
}

function armNoDataTimer() {
  if (noDataTimer) clearTimeout(noDataTimer);
  noDataTimer = setTimeout(() => {
    noDataTimer = null;
    if (!gotData) set({ status: 'no-sensor', heading: null }, true);
  }, NO_DATA_MS);
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener('deviceorientationabsolute' as any, onAbs);
  window.removeEventListener('deviceorientation', onRel);
  if (noDataTimer) clearTimeout(noDataTimer);
  noDataTimer = null;
  state = { ...IDLE, status: state.status === 'denied' ? 'denied' : 'idle' };
}

/** iOS 13+: kullanıcı dokunuşuyla çağrılmalı. */
export async function requestCompassPermission(): Promise<boolean> {
  const api = (window as any).DeviceOrientationEvent;
  if (typeof api?.requestPermission !== 'function') {
    start();
    return true;
  }
  try {
    const r = await api.requestPermission();
    if (r === 'granted') {
      set({ status: 'pending' }, true);
      armNoDataTimer();
      return true;
    }
    set({ status: 'denied' }, true);
    return false;
  } catch {
    set({ status: 'denied' }, true);
    return false;
  }
}

export function getCompass(): CompassState {
  return state;
}

export function useCompass(enabled = true): CompassState {
  const [s, setS] = useState<CompassState>(state);
  useEffect(() => {
    if (!enabled) return;
    subs.add(setS);
    start();
    setS(state);
    return () => {
      subs.delete(setS);
      if (!subs.size) stop();
    };
  }, [enabled]);
  return s;
}
