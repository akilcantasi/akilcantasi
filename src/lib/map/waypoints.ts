// Yer işaretleri (çadır, su, buluşma noktası, tehlike, diğer): saklama,
// paylaşım metni ve elle girilen koordinatların çözümlenmesi.
import { formatDecimal, toDMS, type LatLon } from './geo';
import { safeLocalStorage, type KV } from './track';

export type WaypointType = 'cadir' | 'su' | 'bulusma' | 'tehlike' | 'diger';

export interface Waypoint extends LatLon {
  id: string;
  name: string;
  type: WaypointType;
  /** oluşturulma zamanı (ms) */
  t: number;
}

/** Harita noktalarından (yuvarlak) ayrışsın diye yer işaretleri iğne biçiminde ve kendi harfiyle çizilir. */
export const WAYPOINT_TYPES: Record<WaypointType, { label: string; letter: string; color: string }> = {
  cadir: { label: 'Çadır', letter: 'Ç', color: '#7BD389' },
  su: { label: 'Su', letter: 'S', color: '#4DA3FF' },
  bulusma: { label: 'Buluşma noktası', letter: 'B', color: '#F5A524' },
  tehlike: { label: 'Tehlike', letter: '!', color: '#FF6B6B' },
  diger: { label: 'Diğer', letter: '•', color: '#C9D1DB' },
};
export const WAYPOINT_TYPE_ORDER: WaypointType[] = ['cadir', 'su', 'bulusma', 'tehlike', 'diger'];

const isWpType = (t: unknown): t is WaypointType => typeof t === 'string' && t in WAYPOINT_TYPES;

export const WAYPOINT_KEY = 'ac.map.waypoints.v1';
export const MAX_NAME = 60;

export function cleanName(name: string, type: WaypointType): string {
  const n = (name ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
  return n || WAYPOINT_TYPES[type].label;
}

export function parseWaypoints(text: string | null): Waypoint[] {
  if (!text) return [];
  try {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) return [];
    const out: Waypoint[] = [];
    for (const w of arr) {
      const lat = Number(w?.lat);
      const lon = Number(w?.lon);
      if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
      const type = isWpType(w.type) ? w.type : 'diger';
      out.push({ id: String(w.id ?? out.length), name: cleanName(String(w.name ?? ''), type), type, lat, lon, t: Number(w.t) || 0 });
    }
    return out;
  } catch {
    return [];
  }
}

let idSeq = 0;
const newId = () => `w${Date.now().toString(36)}${(idSeq++).toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;

/** Depolamaya bağlı yer işareti deposu. Test için farklı depolama verilebilir. */
export class WaypointStore {
  private items: Waypoint[];
  private subs = new Set<(w: Waypoint[]) => void>();
  constructor(private kv: KV | null, private key = WAYPOINT_KEY) {
    this.items = parseWaypoints(this.read());
  }
  private read(): string | null {
    try {
      return this.kv?.getItem(this.key) ?? null;
    } catch {
      return null;
    }
  }
  private write(): boolean {
    try {
      this.kv?.setItem(this.key, JSON.stringify(this.items));
      return true;
    } catch {
      return false;
    }
  }
  private emit() {
    this.subs.forEach((f) => f(this.items));
  }
  list(): Waypoint[] {
    return this.items;
  }
  get(id: string): Waypoint | undefined {
    return this.items.find((w) => w.id === id);
  }
  add(w: { name: string; type: WaypointType; lat: number; lon: number }): Waypoint {
    if (!isFinite(w.lat) || !isFinite(w.lon) || Math.abs(w.lat) > 90 || Math.abs(w.lon) > 180) throw new Error('Geçersiz koordinat');
    const type = isWpType(w.type) ? w.type : 'diger';
    const item: Waypoint = { id: newId(), name: cleanName(w.name, type), type, lat: w.lat, lon: w.lon, t: Date.now() };
    this.items = [...this.items, item];
    this.write();
    this.emit();
    return item;
  }
  update(id: string, patch: Partial<Pick<Waypoint, 'name' | 'type'>>): Waypoint | undefined {
    let out: Waypoint | undefined;
    this.items = this.items.map((w) => {
      if (w.id !== id) return w;
      const type = patch.type && isWpType(patch.type) ? patch.type : w.type;
      out = { ...w, type, name: patch.name !== undefined ? cleanName(patch.name, type) : w.name };
      return out;
    });
    if (out) {
      this.write();
      this.emit();
    }
    return out;
  }
  remove(id: string): boolean {
    const n = this.items.length;
    this.items = this.items.filter((w) => w.id !== id);
    if (this.items.length === n) return false;
    this.write();
    this.emit();
    return true;
  }
  /** başka sekmede değişince yeniden oku */
  reload() {
    this.items = parseWaypoints(this.read());
    this.emit();
  }
  subscribe(fn: (w: Waypoint[]) => void): () => void {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  }
}

let shared: WaypointStore | null = null;
/** Uygulama genelinde tek depo (harita + pusula aracı). */
export function waypointStore(): WaypointStore {
  if (!shared) {
    shared = new WaypointStore(safeLocalStorage());
    if (typeof window !== 'undefined') window.addEventListener('storage', (e) => e.key === WAYPOINT_KEY && shared?.reload());
  }
  return shared;
}

// ---------- Paylaşım ----------

export function waypointShareText(w: Pick<Waypoint, 'name' | 'type' | 'lat' | 'lon'>): string {
  const t = WAYPOINT_TYPES[w.type];
  const head = w.name && w.name !== t.label ? `${t.label}: ${w.name}` : t.label;
  return `${head}\n${formatDecimal(w.lat, w.lon)}\n${toDMS(w.lat, 'lat')} ${toDMS(w.lon, 'lon')}\n(Akıl Çantası)`;
}

/** Herhangi bir metin için sms: bağlantısı (Android + iOS'ta çalışan biçim). */
export function smsHrefText(text: string): string {
  return `sms:?&body=${encodeURIComponent(text)}`;
}

// ---------- Koordinat girişi ----------

/**
 * Elle yazılmış koordinatı çözer. Desteklenenler:
 *  "39.9208, 32.8541" · "39.9208 32.8541" · "39,9208 32,8541" · "-33.9, 151.2"
 *  "39° 55′ 15″ K 32° 51′ 15″ D" · "40 25 54 N 29 9 23 E" · "K 40°25,9′ D 29°9,4′"
 * Yarımküre harfleri: K/N kuzey, G/S güney, D/E doğu, B/W batı.
 */
export function parseCoordinates(input: string): LatLon | null {
  if (!input) return null;
  const s = input
    .toLocaleUpperCase('tr-TR')
    .replace(/[’′‘`´]/g, "'")
    .replace(/[″“”]/g, '"')
    .replace(/''/g, '"')
    .replace(/º|˚/g, '°')
    .trim();
  if (!s) return null;

  // 1) Ondalık çift (nokta ondalık): "39.92, 32.85" / "39.92 32.85" / "39.92;32.85"
  let m = s.match(/^(-?\d{1,3}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (m) return check(Number(m[1]), Number(m[2]));
  // 2) Virgüllü ondalık çift: "40,43 29,15" ya da "40,43; 29,15"
  m = s.match(/^(-?\d{1,3},\d+)\s*[;\s]\s*(-?\d{1,3},\d+)$/);
  if (m) return check(Number(m[1].replace(',', '.')), Number(m[2].replace(',', '.')));

  // 3) DMS / harfli biçim: belirteçlere ayır
  const tokRe = /(-?\d+(?:[.,]\d+)?)\s*(°|'|")?|([NSEWKGDB])(?![A-ZÇĞİÖŞÜ])/g;
  type Part = { deg: number[]; units: (string | undefined)[]; hemi?: string; neg: boolean };
  const parts: Part[] = [];
  let cur: Part = { deg: [], units: [], neg: false };
  let pendingHemi: string | undefined;
  const flush = () => {
    if (cur.deg.length) parts.push(cur);
    cur = { deg: [], units: [], neg: false };
  };
  let t: RegExpExecArray | null;
  let consumed = 0;
  while ((t = tokRe.exec(s))) {
    const gap = s.slice(consumed, t.index);
    if (/[^\s,;:/]/.test(gap)) return null; // tanınmayan karakter
    consumed = t.index + t[0].length;
    if (t[3]) {
      if (cur.deg.length && cur.hemi) {
        // önceki koordinatın harfi başta verilmişti: bu harf sıradakinin öneki
        flush();
        pendingHemi = t[3];
      } else if (cur.deg.length) {
        cur.hemi = t[3];
        flush();
      } else pendingHemi = t[3];
      continue;
    }
    const num = Number(t[1].replace(',', '.'));
    const unit = t[2];
    // yeni koordinat başlıyor mu?
    const startsNew =
      cur.deg.length > 0 && (unit === '°' || cur.deg.length >= 3 || (unit === undefined && cur.units[cur.units.length - 1] === '"'));
    if (startsNew) flush();
    if (!cur.deg.length && pendingHemi) {
      cur.hemi = pendingHemi;
      pendingHemi = undefined;
    }
    if (!cur.deg.length && num < 0) cur.neg = true;
    cur.deg.push(Math.abs(num));
    cur.units.push(unit);
  }
  if (/[^\s,;:/]/.test(s.slice(consumed))) return null;
  flush();
  if (parts.length !== 2) return null;

  const val = (p: Part): number | null => {
    let d = 0;
    let m = 0;
    let sec = 0;
    // birimlere göre yerleştir; birimsizler sırayla d, m, s
    const slots = [0, 0, 0];
    const used = [false, false, false];
    let next = 0;
    p.deg.forEach((n, i) => {
      const u = p.units[i];
      let slot = u === '°' ? 0 : u === "'" ? 1 : u === '"' ? 2 : next;
      if (slot > 2 || used[slot]) slot = -1;
      if (slot < 0) return;
      slots[slot] = n;
      used[slot] = true;
      next = slot + 1;
    });
    [d, m, sec] = slots;
    if (m >= 60 || sec >= 60) return null;
    if ((used[1] || used[2]) && d % 1 !== 0) return null;
    return d + m / 60 + sec / 3600;
  };
  const a = val(parts[0]);
  const b = val(parts[1]);
  if (a == null || b == null) return null;
  const isLatH = (h?: string) => h === 'N' || h === 'K' || h === 'S' || h === 'G';
  const isLonH = (h?: string) => h === 'E' || h === 'D' || h === 'W' || h === 'B';
  const sign = (p: Part, v: number) => (p.neg || p.hemi === 'S' || p.hemi === 'G' || p.hemi === 'W' || p.hemi === 'B' ? -v : v);
  let latP = parts[0];
  let lonP = parts[1];
  let lat = a;
  let lon = b;
  if (isLonH(parts[0].hemi) || isLatH(parts[1].hemi)) {
    latP = parts[1];
    lonP = parts[0];
    lat = b;
    lon = a;
  }
  if ((latP.hemi && !isLatH(latP.hemi)) || (lonP.hemi && !isLonH(lonP.hemi))) return null;
  return check(sign(latP, lat), sign(lonP, lon));
}

function check(lat: number, lon: number): LatLon | null {
  if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}
