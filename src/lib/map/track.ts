// İz kaydı (yürünen yol): gürültülü GPS noktalarını süzme, uzunluk/süre,
// geri dönüş (başlangıca kuş uçuşu ve iz boyunca) ve kalıcı saklama.
// Saf fonksiyonlar + depolama arabirimi enjekte edilebilir (testler için).
import { bearingDeg, distanceM, type LatLon } from './geo';

export interface TrackPoint extends LatLon {
  /** zaman damgası (ms) */
  t: number;
  /** GPS doğruluğu (± m) */
  acc: number;
}

export interface TrackState {
  v: 1;
  recording: boolean;
  startedAt: number | null;
  stoppedAt: number | null;
  points: TrackPoint[];
  /** süzgeçten geçmeyen nokta sayısı (bilgi) */
  rejected: number;
}

export interface TrackFilterOpts {
  /** bundan kötü doğruluklu noktalar atılır (m) */
  maxAccuracy: number;
  /** son noktaya bundan yakın noktalar atılır (m) */
  minDistance: number;
  /** olanaksız hız (m/sn, ~180 km/sa) — GPS sıçraması */
  maxSpeed: number;
}

// Telefon GPS'i açık havada tipik 3–10 m, şehir içinde 10–30 m doğruluk verir.
export const DEFAULT_FILTER: TrackFilterOpts = { maxAccuracy: 35, minDistance: 5, maxSpeed: 50 };

export type RejectReason = 'accuracy' | 'distance' | 'speed' | 'invalid';

/** Yeni nokta ize eklenmeli mi? */
export function acceptPoint(last: TrackPoint | undefined, p: TrackPoint, o: TrackFilterOpts = DEFAULT_FILTER): { ok: true } | { ok: false; reason: RejectReason } {
  if (!isFinite(p.lat) || !isFinite(p.lon) || Math.abs(p.lat) > 90 || Math.abs(p.lon) > 180) return { ok: false, reason: 'invalid' };
  if (!(p.acc >= 0) || p.acc > o.maxAccuracy) return { ok: false, reason: 'accuracy' };
  if (!last) return { ok: true };
  const d = distanceM(last, p);
  // Doğruluk kötüleştikçe titreşimi yutmak için eşik büyür
  const minD = Math.max(o.minDistance, Math.min(p.acc, last.acc) * 0.5);
  if (d < minD) return { ok: false, reason: 'distance' };
  const dt = (p.t - last.t) / 1000;
  if (dt > 0 && d / dt > o.maxSpeed && d > p.acc + last.acc) return { ok: false, reason: 'speed' };
  return { ok: true };
}

/** Ham nokta listesini süzer (test ve içe aktarma için). */
export function filterTrack(points: TrackPoint[], o: TrackFilterOpts = DEFAULT_FILTER): TrackPoint[] {
  const out: TrackPoint[] = [];
  for (const p of points) if (acceptPoint(out[out.length - 1], p, o).ok) out.push(p);
  return out;
}

/** Çoklu çizgi uzunluğu (m). */
export function pathLength(points: LatLon[]): number {
  let s = 0;
  for (let i = 1; i < points.length; i++) s += distanceM(points[i - 1], points[i]);
  return s;
}

/** Kayıt süresi (ms). Kayıt sürüyorsa şimdiye kadar. */
export function trackDurationMs(st: Pick<TrackState, 'startedAt' | 'stoppedAt' | 'recording'>, now = Date.now()): number {
  if (st.startedAt == null) return 0;
  const end = st.recording ? now : st.stoppedAt ?? now;
  return Math.max(0, end - st.startedAt);
}

/** "12:05" / "1:02:09" biçiminde süre */
export function formatClock(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

export interface Backtrack {
  /** başlangıca kuş uçuşu mesafe ve yön */
  straightM: number;
  straightBearing: number;
  /** iz üzerindeki en yakın noktanın indeksi */
  nearestIndex: number;
  /** ize olan uzaklık (m) */
  offTrackM: number;
  /** iz boyunca başlangıca kalan yol (m) */
  alongM: number;
  /** iz boyunca dönerken şu an yönelinecek ara nokta */
  next: LatLon;
  nextBearing: number;
  nextM: number;
  /** haritada çizilecek geri dönüş yolu: konum → en yakın iz noktası → … → başlangıç */
  path: LatLon[];
}

/**
 * Başlangıca dönüş: kuş uçuşu ve iz boyunca.
 * @param lookahead iz boyunca dönerken en az bu kadar ilerideki noktaya yönel (m)
 */
export function backtrack(points: LatLon[], loc: LatLon, lookahead = 25): Backtrack | null {
  if (!points.length) return null;
  const start = points[0];
  let ni = 0;
  let nd = Infinity;
  for (let i = 0; i < points.length; i++) {
    const d = distanceM(loc, points[i]);
    if (d < nd) {
      nd = d;
      ni = i;
    }
  }
  // iz boyunca: ni'den başlangıca kalan yol
  let along = nd;
  for (let i = ni; i > 0; i--) along += distanceM(points[i], points[i - 1]);
  // yönelinecek nokta: ize uzaksak en yakın iz noktası, değilsek geriye doğru lookahead kadar ileri
  let ti = ni;
  if (nd < lookahead) {
    while (ti > 0 && distanceM(loc, points[ti]) < lookahead) ti--;
  }
  const next = points[ti];
  const path: LatLon[] = [loc];
  for (let i = ni; i >= 0; i--) path.push(points[i]);
  return {
    straightM: distanceM(loc, start),
    straightBearing: bearingDeg(loc, start),
    nearestIndex: ni,
    offTrackM: nd,
    alongM: along,
    next,
    nextBearing: bearingDeg(loc, next),
    nextM: distanceM(loc, next),
    path,
  };
}

// ---------- Saklama ----------

export type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const TRACK_KEY = 'ac.map.track.v1';
/** Saklanan en fazla nokta (≈5 m aralıkla ~100 km). Aşılırsa seyreltilir. */
export const MAX_POINTS = 20000;

export function emptyTrack(): TrackState {
  return { v: 1, recording: false, startedAt: null, stoppedAt: null, points: [], rejected: 0 };
}

/** Çok uzun izi her ikinci noktayı atarak (ilk/son korunur) kısaltır. */
export function thinPoints<T>(pts: T[], max = MAX_POINTS): T[] {
  if (pts.length <= max) return pts;
  const out = pts.filter((_, i) => i % 2 === 0);
  if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
  return out;
}

const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

export function serializeTrack(st: TrackState): string {
  return JSON.stringify({
    v: 1,
    r: st.recording ? 1 : 0,
    s: st.startedAt,
    e: st.stoppedAt,
    x: st.rejected,
    p: st.points.map((p) => [r6(p.lat), r6(p.lon), p.t, Math.round(p.acc)]),
  });
}

export function parseTrack(text: string | null): TrackState {
  if (!text) return emptyTrack();
  try {
    const o = JSON.parse(text);
    if (o?.v !== 1 || !Array.isArray(o.p)) return emptyTrack();
    const points: TrackPoint[] = [];
    for (const a of o.p) {
      if (!Array.isArray(a) || a.length < 4) continue;
      const [lat, lon, t, acc] = a.map(Number);
      if (isFinite(lat) && isFinite(lon) && isFinite(t)) points.push({ lat, lon, t, acc: isFinite(acc) ? acc : 0 });
    }
    return {
      v: 1,
      recording: !!o.r,
      startedAt: typeof o.s === 'number' ? o.s : null,
      stoppedAt: typeof o.e === 'number' ? o.e : null,
      rejected: typeof o.x === 'number' ? o.x : 0,
      points,
    };
  } catch {
    return emptyTrack();
  }
}

export function loadTrack(kv: KV | null): TrackState {
  try {
    return parseTrack(kv?.getItem(TRACK_KEY) ?? null);
  } catch {
    return emptyTrack();
  }
}

export function saveTrack(kv: KV | null, st: TrackState): boolean {
  if (!kv) return false;
  try {
    if (!st.points.length && !st.recording && st.startedAt == null) kv.removeItem(TRACK_KEY);
    else kv.setItem(TRACK_KEY, serializeTrack(st));
    return true;
  } catch {
    return false; // kota dolu ya da gizli mod
  }
}

export function safeLocalStorage(): KV | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage;
  } catch {
    return null;
  }
}
