// Akıl Çantası — çizim kiti v2: "detaylı düz illüstrasyon" (Kızılay/AFAD broşür tarzı).
//
// Tuval 320×240 (viewBox 0 0 320 240). Her sahne <Scene2 bg="..."> ile sarılır.
// İnsanlar <Person> iskeletiyle (rig) çizilir: duruş açılarla ya da hedef noktalarla
// verilir; kitin kendisi orantılı gövde, kıyafet, saç, yüz, el ve ayakkabıyı üretir.
// Tüm şekiller ince koyu bir dış hatla, düz renk + tek koyu gölge tonuyla çizilir.
// Ayrıntılı kılavuz: docs/agents/CIZIM.md
import type { ComponentChildren, JSX } from 'preact';

export type P = [number, number];

/* ════════════════════════════ RENK ════════════════════════════ */

function mix(c: string, to: string, f: number): string {
  const a = parseInt(c.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const m = (sh: number) => Math.round(((a >> sh) & 255) * (1 - f) + ((b >> sh) & 255) * f);
  return '#' + ((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1);
}
/** Gölge tonu (koyulaştırır). Yalnızca #rrggbb renklerle çalışır. */
export const shade = (c: string, f = 0.2) => mix(c, '#1c1830', f);
/** Açık ton (beyaza karıştırır). */
export const tint = (c: string, f = 0.3) => mix(c, '#ffffff', f);

/** Tek renk paleti. Anlamsal renkler: action (turuncu, yapılacak eylem/ok), danger (kırmızı,
 *  tehlike/yasak), safe (yeşil, doğru), water (mavi, su). */
export const K = {
  out: '#2b2d3a', // dış hat
  ink: '#2b2d3a', // yazı / koyu ayrıntı
  white: '#fbfaf7',
  paper: '#f3ecdc',

  action: '#ff8a1f',
  danger: '#e53935',
  safe: '#22b35e',
  water: '#3a9be0',
  waterLight: '#9dd5f6',

  /** ten renkleri: 0 açık, 1 buğday, 2 esmer, 3 koyu */
  skin: ['#f8d6be', '#eab48f', '#c98d63', '#8e5a3b'],
  hair: {
    black: '#2a2523',
    dark: '#4b3428',
    brown: '#7d5434',
    auburn: '#a2502c',
    blond: '#ddb468',
    grey: '#a9a7a2',
    white: '#e7e4dd',
  },
  /** üst giysi rolleri */
  role: {
    helper: '#13a394', // yardım eden (camgöbeği)
    helper2: '#ff8a1f', // alternatif yardımcı (turuncu yelek havası)
    victim: '#3d7ad6', // yaralı / yardım alan (mavi)
    bystander: '#8f6fc2', // çevredeki kişi (mor)
    bystander2: '#d9a13a', // hardal
    bystander3: '#6c9c5a', // yeşil
    bystander4: '#c6574e', // kiremit
  },
  pants: { denim: '#3f5684', dark: '#3b3f4b', khaki: '#a08a5c', grey: '#6d7480', brown: '#6b4f3a', navy: '#2f3d63' },
  shoe: '#3b3537',

  // ortam
  wall: '#e9e0d0',
  wallShade: '#d8ccb8',
  floor: '#c9a27a',
  floorShade: '#b48c63',
  sky: '#c2e4f4',
  skyLow: '#dff1f8',
  grass: '#8fc163',
  grassShade: '#78aa50',
  hill: '#b4d792',
  dirt: '#c9a77a',
  nightSky: '#202c4b',
  nightGround: '#2d3b36',
  dark: '#1f2631',
  closeup: '#e4e9ef',

  // nesne
  wood: '#b77f50',
  metal: '#a3adb8',
  plastic: '#e6e8eb',
  fire: '#ff7b1c',
  fireCore: '#ffd64a',
  fireRed: '#e8472d',
  smoke: '#7a818b',
  leaf: '#5aa84f',
  pine: '#2f8059',
  trunk: '#87573a',
  rock: '#a5a39c',
  blood: '#c62828',
  screen: '#1d2836',
  red: '#d63b35',
  cloth: '#f4f1ea',
  foil: '#c9d2da',
};

/* ════════════════════════════ GEOMETRİ ════════════════════════════ */

const R2D = 180 / Math.PI;
const dv = (a: number): P => [Math.cos(a / R2D), Math.sin(a / R2D)];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];
const pol = (p: P, a: number, l: number): P => add(p, mul(dv(a), l));
const angOf = (v: P) => Math.atan2(v[1], v[0]) * R2D;
const dist = (a: P, b: P) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: P) => `${f1(p[0])} ${f1(p[1])}`;

/** Noktalardan geçen yumuşak (Catmull-Rom) yol. */
export function smooth(pts: P[], closed = false, ten = 1): string {
  const n = pts.length;
  if (n < 2) return '';
  const g = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pt(pts[0])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1: P = [p1[0] + ((p2[0] - p0[0]) / 6) * ten, p1[1] + ((p2[1] - p0[1]) / 6) * ten];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) / 6) * ten, p2[1] - ((p3[1] - p1[1]) / 6) * ten];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return closed ? d + 'Z' : d;
}
/** Daire yolu */
export const circ = (c: P, r: number) => ell(c, r, r);
/** Elips yolu */
export const ell = (c: P, rx: number, ry: number) =>
  `M${f1(c[0] - rx)} ${f1(c[1])}A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(c[0] + rx)} ${f1(c[1])}A${f1(rx)} ${f1(ry)} 0 1 0 ${f1(c[0] - rx)} ${f1(c[1])}Z`;
/** Yuvarlak köşeli dikdörtgen yolu */
export const rrect = (x: number, y: number, w: number, h: number, r = 3) => {
  r = Math.min(r, w / 2, h / 2);
  return `M${f1(x + r)} ${f1(y)}H${f1(x + w - r)}A${r} ${r} 0 0 1 ${f1(x + w)} ${f1(y + r)}V${f1(y + h - r)}A${r} ${r} 0 0 1 ${f1(x + w - r)} ${f1(y + h)}H${f1(x + r)}A${r} ${r} 0 0 1 ${f1(x)} ${f1(y + h - r)}V${f1(y + r)}A${r} ${r} 0 0 1 ${f1(x + r)} ${f1(y)}Z`;
};
/** Uçları farklı yarıçaplı kapsül (uzuv parçası) yolu */
export function capsule(a: P, ra: number, b: P, rb: number): string {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const d = Math.hypot(dx, dy);
  if (d < Math.abs(ra - rb) + 0.05) return ra > rb ? circ(a, ra) : circ(b, rb);
  const th = Math.atan2(dy, dx);
  const ph = Math.acos((ra - rb) / d);
  const p1: P = [a[0] + ra * Math.cos(th + ph), a[1] + ra * Math.sin(th + ph)];
  const p2: P = [b[0] + rb * Math.cos(th + ph), b[1] + rb * Math.sin(th + ph)];
  const p3: P = [b[0] + rb * Math.cos(th - ph), b[1] + rb * Math.sin(th - ph)];
  const p4: P = [a[0] + ra * Math.cos(th - ph), a[1] + ra * Math.sin(th - ph)];
  return `M${pt(p1)}L${pt(p2)}A${f1(rb)} ${f1(rb)} 0 ${ph > Math.PI / 2 ? 1 : 0} 0 ${pt(p3)}L${pt(p4)}A${f1(ra)} ${f1(ra)} 0 ${ph < Math.PI / 2 ? 1 : 0} 0 ${pt(p1)}Z`;
}
/** Noktalar dizisi boyunca kapsül zinciri (her biri ayrı yol) */
const chain = (ps: P[], rs: number[]) => ps.slice(1).map((p, i) => capsule(ps[i], rs[i], p, rs[i + 1]));

function convexHull(points: P[]): P[] {
  const ps = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: P, a: P, b: P) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: P[] = [], up: P[] = [];
  for (const p of ps) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of ps.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

/* ════════════════════════ DIŞ HATLI ŞEKİL GRUBU ════════════════════════ */

/** Dış hat kalınlığı (dünya birimi) */
export const OW = 1.5;

/** Şekil: d yolu + dolgu. ln: kendi ince hattıyla çiz (iç ayrıntı); no: dış hat yok;
 *  st/sw: yalnızca çizgi; k: transform ölçeği (çizgi kalınlığını düzeltmek için). */
export interface Sh {
  d: string;
  f?: string;
  t?: string;
  k?: number;
  ln?: boolean;
  no?: boolean;
  op?: number;
  st?: string;
  sw?: number;
  fr?: 'evenodd';
}

/** Şekilleri ortak tek bir dış hatla çizer: önce hepsinin kalın koyu izi, sonra dolgular.
 *  Böylece aynı gruptaki parçalar (kol+el, gövde+boyun) tek siluet gibi görünür. */
export function OG({ sh, ow = OW }: { sh: Sh[]; ow?: number }) {
  return (
    <g stroke-linejoin="round" stroke-linecap="round">
      {sh.map((s, i) =>
        s.no || s.st ? null : (
          <path key={'o' + i} d={s.d} transform={s.t} fill={K.out} fill-rule={s.fr} stroke={K.out} stroke-width={(2 * ow) / (s.k ?? 1)} />
        ),
      )}
      {sh.map((s, i) => (
        <path
          key={i}
          d={s.d}
          transform={s.t}
          fill={s.st ? 'none' : s.f}
          fill-rule={s.fr}
          opacity={s.op}
          stroke={s.st ?? (s.ln ? K.out : undefined)}
          stroke-width={s.st ? (s.sw ?? 1) / (s.k ?? 1) : s.ln ? (ow * 0.85) / (s.k ?? 1) : undefined}
        />
      ))}
    </g>
  );
}

/* ════════════════════════════ GÖVDE TİPLERİ ════════════════════════════ */

export type Who = 'man' | 'woman' | 'boy' | 'girl' | 'oldman' | 'oldwoman' | 'baby';
export type Role = 'helper' | 'helper2' | 'victim' | 'bystander' | 'bystander2' | 'bystander3' | 'bystander4';
export type Expr = 'neutral' | 'calm' | 'worried' | 'pain' | 'closed' | 'speak';
export type HairStyle = 'short' | 'long' | 'bun' | 'ponytail' | 'bald' | 'scarf' | 'baby' | 'none';
export type Bottom = 'pants' | 'shorts' | 'skirt' | 'longskirt' | 'onesie';
export type Sleeve = 'short' | 'long' | 'none';

interface BodyDef {
  h: number; // baş yarıçapı
  neck: number;
  neckR: number;
  torso: number;
  side: [number, number, number][]; // [t, ön, arka] yan profil
  front: [number, number][]; // [t, yarı genişlik] ön görünüş
  shA: number; // ön görünüşte omuz eklemi uzaklığı
  hipA: number; // ön görünüşte kalça eklemi uzaklığı
  ua: number; fa: number; th: number; sn: number;
  uaR: [number, number]; faR: [number, number]; thR: [number, number]; snR: [number, number];
  hand: number; handR: number; foot: number;
  look: Look;
}

export interface Look {
  skin: number;
  hair: HairStyle;
  hairC: string;
  top?: string;
  sleeve: Sleeve;
  bottom: Bottom;
  bottomC: string;
  shoes: string | null;
  mustache?: boolean;
  glasses?: boolean;
}

const MAN_SIDE: [number, number, number][] = [[-0.08, 5, -7], [0.04, 11, -13], [0.3, 10.5, -10.5], [0.62, 13.5, -11.5], [0.86, 12, -11], [1.0, 6, -6]];
const MAN_FRONT: [number, number][] = [[-0.05, 15.5], [0.08, 16.5], [0.4, 15], [0.72, 18], [0.9, 19.5], [1.0, 12]];
const WOMAN_SIDE: [number, number, number][] = [[-0.08, 5, -8], [0.06, 10, -14], [0.32, 9, -9], [0.64, 14.5, -10], [0.88, 10.5, -10], [1.0, 5.5, -5.5]];
const WOMAN_FRONT: [number, number][] = [[-0.05, 16.5], [0.1, 17.5], [0.42, 12.5], [0.7, 15], [0.9, 16.5], [1.0, 10.5]];

const BODIES: Record<Who, BodyDef> = {
  man: {
    h: 12.5, neck: 6, neckR: 4.6, torso: 50, side: MAN_SIDE, front: MAN_FRONT, shA: 15, hipA: 8.5,
    ua: 29, fa: 26, th: 38, sn: 37, uaR: [5, 4], faR: [4, 3.2], thR: [7.4, 5.4], snR: [5.2, 3.8], hand: 11, handR: 4.4, foot: 17,
    look: { skin: 1, hair: 'short', hairC: K.hair.dark, sleeve: 'short', bottom: 'pants', bottomC: K.pants.denim, shoes: K.shoe },
  },
  woman: {
    h: 12, neck: 6, neckR: 4.1, torso: 47, side: WOMAN_SIDE, front: WOMAN_FRONT, shA: 12.5, hipA: 9.5,
    ua: 27, fa: 24.5, th: 37, sn: 35, uaR: [4.3, 3.5], faR: [3.5, 2.8], thR: [7.2, 5], snR: [4.8, 3.4], hand: 10, handR: 4, foot: 15,
    look: { skin: 1, hair: 'long', hairC: K.hair.brown, sleeve: 'short', bottom: 'pants', bottomC: K.pants.dark, shoes: K.shoe },
  },
  boy: {
    h: 11.5, neck: 4, neckR: 3.6, torso: 33,
    side: [[-0.08, 4, -6], [0.05, 8, -9.5], [0.35, 9, -8], [0.65, 9.5, -8], [0.88, 8.5, -8], [1.0, 4.5, -4.5]],
    front: [[-0.05, 11], [0.1, 11.5], [0.45, 11.5], [0.75, 12.5], [0.9, 13], [1, 8.5]], shA: 10, hipA: 6,
    ua: 18, fa: 16.5, th: 25, sn: 24, uaR: [3.6, 3], faR: [3, 2.5], thR: [5.2, 4], snR: [4, 3], hand: 8, handR: 3.3, foot: 12,
    look: { skin: 1, hair: 'short', hairC: K.hair.black, sleeve: 'short', bottom: 'shorts', bottomC: K.pants.navy, shoes: '#c6574e' },
  },
  girl: {
    h: 11.5, neck: 4, neckR: 3.4, torso: 32,
    side: [[-0.08, 4, -6], [0.05, 8, -9.5], [0.35, 8.5, -7.5], [0.65, 9, -7.5], [0.88, 8, -7.5], [1.0, 4.5, -4.5]],
    front: [[-0.05, 11], [0.1, 11.5], [0.45, 10.5], [0.75, 11.5], [0.9, 12], [1, 8]], shA: 9.5, hipA: 6,
    ua: 17.5, fa: 16, th: 25, sn: 24, uaR: [3.4, 2.8], faR: [2.8, 2.4], thR: [5, 3.8], snR: [3.8, 2.9], hand: 7.6, handR: 3.2, foot: 11.5,
    look: { skin: 1, hair: 'ponytail', hairC: K.hair.brown, sleeve: 'short', bottom: 'pants', bottomC: '#5a6fb0', shoes: '#c6574e' },
  },
  oldman: {
    h: 12.5, neck: 5, neckR: 4.4, torso: 48, side: MAN_SIDE, front: MAN_FRONT, shA: 14.5, hipA: 8.5,
    ua: 28, fa: 25, th: 37, sn: 36, uaR: [4.6, 3.8], faR: [3.8, 3], thR: [7, 5.2], snR: [5, 3.6], hand: 10.5, handR: 4.2, foot: 16.5,
    look: { skin: 1, hair: 'bald', hairC: K.hair.grey, sleeve: 'long', bottom: 'pants', bottomC: K.pants.brown, shoes: K.shoe, mustache: true, glasses: true },
  },
  oldwoman: {
    h: 12, neck: 5, neckR: 4, torso: 45, side: WOMAN_SIDE, front: WOMAN_FRONT, shA: 12.5, hipA: 9.5,
    ua: 26, fa: 23.5, th: 35, sn: 34, uaR: [4.3, 3.5], faR: [3.5, 2.8], thR: [7.2, 5], snR: [4.8, 3.4], hand: 10, handR: 4, foot: 15,
    look: { skin: 1, hair: 'scarf', hairC: '#7a6aa8', sleeve: 'long', bottom: 'longskirt', bottomC: '#5b5f78', shoes: K.shoe, glasses: true },
  },
  baby: {
    h: 10, neck: 1.5, neckR: 3.6, torso: 22,
    side: [[-0.1, 6, -7], [0.1, 8.5, -9], [0.45, 10, -8.5], [0.8, 8.5, -7.5], [1, 4, -4]],
    front: [[-0.08, 9], [0.15, 10], [0.5, 10.5], [0.85, 9.5], [1, 6]], shA: 7.5, hipA: 4.5,
    ua: 10, fa: 9, th: 11.5, sn: 11, uaR: [3.4, 3], faR: [3, 2.7], thR: [4.4, 3.6], snR: [3.6, 2.9], hand: 5.6, handR: 2.8, foot: 7,
    look: { skin: 0, hair: 'baby', hairC: K.hair.brown, sleeve: 'long', bottom: 'onesie', bottomC: '#f2c14e', top: '#f2c14e', shoes: null },
  },
};

/* ════════════════════════════ DURUŞ ════════════════════════════ */

/** Kişinin kendi eklemleri (Limb {at} hedefleri ve rig çıktısı için) */
export type Joint =
  | 'hip' | 'neck' | 'head' | 'chest' | 'back' | 'belly' | 'nape' | 'mouth'
  | 'shoulderB' | 'shoulderF' | 'elbowB' | 'elbowF' | 'wristB' | 'wristF' | 'handB' | 'handF'
  | 'hipB' | 'hipF' | 'kneeB' | 'kneeF' | 'ankleB' | 'ankleF' | 'toeB' | 'toeF';

/** Uzuv: [üst açı, alt açı] (mutlak derece; 0=sağ, 90=aşağı, 180=sol, -90=yukarı)
 *  ya da hedef: {to:[x,y]} sahne koordinatı, {floor:dx} kökün dx önünde yere,
 *  {at:'chest', d:[dx,dy]} kişinin kendi bir eklemine (+ yüze bakan yöne göre ofset). */
export type Limb = [number, number] | { to: P; bend?: 1 | -1 } | { floor: number; bend?: 1 | -1 } | { at: Joint; d?: P; bend?: 1 | -1 };
export type HandShape = 'mitten' | 'fist' | 'flat' | 'none';
export interface HandOpt { shape?: HandShape; a?: number; thumb?: 1 | -1 }

export interface Pose {
  /** 'side' = profil, sağa bakar (flip ile sola). 'front' = karşıdan. */
  view?: 'side' | 'front';
  /** kalçadan göğse omurga açısı (dik = -90) */
  spine?: number;
  /** göğüsten boyna üst omurga açısı (varsayılan = spine); kambur/eğilme için */
  chest?: number;
  /** baş ekseni açısı (boyundan tepeye; dik = -90) */
  head?: number;
  /** başın görünüşü (varsayılan = view) */
  headView?: 'side' | 'front';
  /** B = arka/uzak uzuv (ön görünüşte ekranın solu), F = ön/yakın uzuv (ön görünüşte sağ) */
  armB?: Limb; armF?: Limb; legB?: Limb; legF?: Limb;
  handB?: HandShape | HandOpt; handF?: HandShape | HandOpt;
  /** ayak açısı (0 = düz, ileri) */
  footB?: number; footF?: number;
  face?: Expr;
  /** bu kolları gövdenin ve başın ARKASINA çiz (ör. arkada kenetli eller, yerde uzanan alttaki kol) */
  behind?: Array<'armB' | 'armF'>;
}

/** Hazır duruşlar (yan görünüşte sağa bakar). Üzerine yazmak için: {...POSE.walk, face:'calm'} */
export const POSE = {
  /** karşıdan ayakta */
  stand: { view: 'front', armB: [100, 94], armF: [80, 86], legB: [92, 90], legF: [88, 90] },
  /** karşıdan ayakta, el sallıyor / işaret ediyor */
  wave: { view: 'front', armB: [100, 94], armF: [-30, -80], legB: [92, 90], legF: [88, 90], face: 'calm' },
  /** yandan ayakta */
  standSide: { armB: [96, 100], armF: [86, 76], legB: [92, 90], legF: [88, 90] },
  walk: { spine: -87, armB: [68, 45], armF: [112, 100], legB: [110, 128], legF: [70, 84], footB: 25 },
  run: { spine: -70, chest: -72, head: -78, armB: [40, -40], armF: [140, 55], legB: [122, 150], legF: [-8, 96], footB: 55, footF: 10 },
  /** sandalyede oturan (kalça ≈ yer - 44·s) */
  sitChair: { spine: -95, armB: [82, 12], armF: [78, 8], legB: [2, 92], legF: [-2, 88], footB: 0, footF: 0 },
  /** yerde bacaklar önde oturan */
  sitFloor: { spine: -72, armB: { floor: -16 }, armF: { floor: -12 }, legB: [2, 4], legF: [-3, 3] },
  /** dik diz çökmüş */
  kneel: { spine: -88, armB: [95, 92], armF: [85, 82], legB: [92, 182], legF: [88, 180] },
  /** topuklar üstüne oturur diz çökmüş */
  kneelSit: { spine: -84, armB: [80, 20], armF: [75, 15], legB: [12, 182], legF: [8, 180] },
  /** tek diz yerde */
  kneelOne: { spine: -86, armB: [92, 85], armF: [80, 40], legB: [102, 182], legF: [0, 92], footF: 0 },
  /** çömelmiş */
  crouch: { spine: -60, chest: -72, head: -80, armB: [70, 50], armF: [60, 35], legB: [-22, 106], legF: [-16, 110], footB: 0, footF: 0 },
  /** ÇÖK-KAPAN-TUTUN: dizler yerde, gövde öne kapanmış, bir kol başı/enseyi korur */
  dropCover: {
    spine: -4, chest: 12, head: 32, legB: [32, 182], legF: [28, 180],
    armF: [62, -150], armB: { floor: 26 }, face: 'worried',
  },
  /** emekleme (eller ve dizler) */
  crawl: { spine: -16, chest: -10, head: -55, legB: [98, 182], legF: [92, 180], armB: { floor: 4 }, armF: { floor: 10 } },
  /** sırtüstü yatan (baş solda) */
  lieBack: { spine: 180, chest: 180, head: 180, armB: [-2, -2], armF: [3, 2], legB: [-1, -1], legF: [1, 1], face: 'closed' },
  /** derlenme pozisyonu (karşıdan, yan yatmış, baş solda): üstteki elin sırtı yanağın altında,
   *  alttaki kol yerde öne uzanmış, üstteki bacak dizden bükülüp öne/yere konmuş */
  recovery: {
    view: 'front', spine: 181, chest: 183, head: 200, face: 'closed', behind: ['armB'],
    armB: [172, 184], armF: [128, 196], handF: { a: -10 },
    legB: [1, 1], legF: [38, -6], footF: -100, footB: -90,
  },
  /** öne eğilmiş (yerden bir şey alıyor) */
  bend: { spine: -28, chest: -12, head: -20, armB: [92, 95], armF: [84, 88], legB: [94, 92], legF: [84, 98] },
  /** önünde kutu taşıyor */
  carry: { spine: -93, armB: [78, -8], armF: [72, -12], legB: [92, 90], legF: [88, 90] },
} satisfies Record<string, Pose>;

/* ════════════════════════════ RIG ════════════════════════════ */

export interface PersonProps {
  /** konum: varsayılan olarak x = kalça, y = zemin (en alt nokta) */
  x: number;
  y: number;
  who?: Who;
  role?: Role;
  pose?: Pose;
  /** ölçek (yetişkin boyu ≈ 162·s) */
  s?: number;
  /** sola baktır */
  flip?: boolean;
  face?: Expr;
  skin?: number;
  hair?: HairStyle;
  hairC?: string;
  top?: string;
  sleeve?: Sleeve;
  bottom?: Bottom;
  bottomC?: string;
  shoes?: string | null;
  mustache?: boolean;
  glasses?: boolean;
  /** x hangi ekleme hizalanır (varsayılan 'hip') */
  ax?: Joint;
  /** y hangi ekleme hizalanır (varsayılan 'ground' = en alt nokta y'ye) */
  ay?: Joint | 'ground';
  /** {floor} hedefleri için zemin (varsayılan y) */
  gy?: number;
  shadow?: boolean;
  /** yalnızca bu parçaları çiz (katmanlama: ör. önce gövde, sonra başka kişi, sonra kollar) */
  only?: Part[];
  /** sahne katmanları (rig eklemleriyle çağrılır): under=en arkada, back=arka kol ile gövde arası,
   *  mid=gövde/baş ile ön kol arası, over=en önde */
  under?: (r: Rig) => ComponentChildren;
  back?: (r: Rig) => ComponentChildren;
  mid?: (r: Rig) => ComponentChildren;
  over?: (r: Rig) => ComponentChildren;
}
export type Part = 'legB' | 'legF' | 'armB' | 'armF' | 'torso' | 'head';

/** Rig çıktısı: sahne koordinatlarında eklemler ve açılar */
export type Rig = Record<Joint, P> & {
  s: number;
  flip: boolean;
  headR: number;
  /** ön kol (dirsek→bilek) açıları, sahne koordinatında */
  foreB: number;
  foreF: number;
  /** başın ekseni (boyun→tepe) açısı */
  headA: number;
  /** en üst nokta (y) */
  top: number;
};

interface Built {
  rig: Rig;
  T: P;
  X: number;
  groups: Record<string, JSX.Element | null>;
  front: boolean;
  shadow: JSX.Element | null;
  behind: Array<'armB' | 'armF'>;
}

const skinC = (i: number) => K.skin[Math.max(0, Math.min(K.skin.length - 1, i))];

function build(pr: PersonProps): Built {
  const who = pr.who ?? 'man';
  const B = BODIES[who];
  const s = pr.s ?? 1;
  const po: Pose = pr.pose ?? POSE.standSide;
  const front = po.view === 'front';
  const hv = po.headView ?? (front ? 'front' : 'side');
  const ow = OW * (0.75 + 0.25 * s);
  const roleTop = pr.role ? K.role[pr.role] : undefined;
  const L: Look = {
    ...B.look,
    top: pr.top ?? roleTop ?? B.look.top ?? K.role.bystander,
    ...(pr.skin !== undefined && { skin: pr.skin }),
    ...(pr.hair && { hair: pr.hair }),
    ...(pr.hairC && { hairC: pr.hairC }),
    ...(pr.sleeve && { sleeve: pr.sleeve }),
    ...(pr.bottom && { bottom: pr.bottom }),
    ...(pr.bottomC && { bottomC: pr.bottomC }),
    ...(pr.shoes !== undefined && { shoes: pr.shoes }),
    ...(pr.mustache !== undefined && { mustache: pr.mustache }),
    ...(pr.glasses !== undefined && { glasses: pr.glasses }),
  };
  if (L.bottom === 'onesie') L.bottomC = L.top!;
  const top = L.top!;
  const sk = skinC(L.skin);

  // --- omurga
  const sa = po.spine ?? -90, ca = po.chest ?? sa, ha = po.head ?? ca;
  const TL = B.torso * s;
  const H0: P = [0, 0];
  const C0 = pol(H0, sa, TL / 2);
  const N0 = pol(C0, ca, TL / 2);
  const spineAt = (t: number) => {
    const u = 1 - t;
    const p: P = [u * u * H0[0] + 2 * u * t * C0[0] + t * t * N0[0], u * u * H0[1] + 2 * u * t * C0[1] + t * t * N0[1]];
    let tg = add(mul(sub(C0, H0), 2 * u), mul(sub(N0, C0), 2 * t));
    const l = Math.hypot(tg[0], tg[1]) || 1;
    tg = [tg[0] / l, tg[1] / l];
    return { p, n: [-tg[1], tg[0]] as P };
  };
  const table: [number, number, number][] = front ? B.front.map(([t, h]) => [t, h, -h]) : B.side;
  const prof = (t: number): [number, number] => {
    if (t <= table[0][0]) return [table[0][1], table[0][2]];
    for (let i = 1; i < table.length; i++) {
      if (t <= table[i][0]) {
        const [t0, a0, b0] = table[i - 1], [t1, a1, b1] = table[i];
        const k = (t - t0) / (t1 - t0);
        return [a0 + (a1 - a0) * k, b0 + (b1 - b0) * k];
      }
    }
    const l = table[table.length - 1];
    return [l[1], l[2]];
  };
  const edge = (t: number, k: 0 | 1, f = 1) => {
    const { p, n } = spineAt(t);
    return add(p, mul(n, prof(t)[k] * s * f));
  };
  const tMin = table[0][0], tMax = table[table.length - 1][0];
  const keys = (t0: number, t1: number) => [t0, ...table.map((r) => r[0]).filter((t) => t > t0 + 0.02 && t < t1 - 0.02), t1];
  const band = (t0: number, t1: number, extra = '') => {
    const ts = keys(t0, t1);
    return smooth([...ts.map((t) => edge(t, 0)), ...ts.map((t) => edge(t, 1)).reverse()]) + extra + 'Z';
  };

  // --- eklemler (yerel; kalça 0,0; sağa bakar)
  const s86 = spineAt(0.86);
  const shB: P = front ? sub(s86.p, mul(s86.n, B.shA * s)) : add(s86.p, mul(s86.n, -1.5 * s));
  const shF: P = front ? add(s86.p, mul(s86.n, B.shA * s)) : add(s86.p, mul(s86.n, -1.0 * s));
  const s0 = spineAt(0.02);
  const hpB: P = front ? sub(s0.p, mul(s0.n, B.hipA * s)) : add(s0.p, mul(s0.n, 1 * s));
  const hpF: P = front ? add(s0.p, mul(s0.n, B.hipA * s)) : add(s0.p, mul(s0.n, 2 * s));
  const hn = dv(ha + 90);
  let hc = pol(N0, ha, (B.neck + B.h * 0.8) * s);
  if (hv === 'side') hc = add(hc, mul(hn, B.h * 0.12 * s));
  const hr = B.h * s;
  const sc = spineAt(0.62), sb = spineAt(0.25), s95 = spineAt(0.97);
  const loc: Partial<Record<Joint, P>> = {
    hip: H0, neck: N0, head: hc,
    chest: add(sc.p, mul(sc.n, prof(0.62)[0] * s)),
    back: add(sc.p, mul(sc.n, prof(0.62)[1] * s)),
    belly: add(sb.p, mul(sb.n, prof(0.25)[0] * s)),
    nape: add(s95.p, mul(s95.n, prof(0.97)[1] * s * 0.8)),
    mouth: hv === 'side' ? add(hc, add(mul(dv(ha), -0.45 * hr), mul(hn, 0.9 * hr))) : add(hc, mul(dv(ha), -0.55 * hr)),
    shoulderB: shB, shoulderF: shF, hipB: hpB, hipF: hpF,
  };

  type LimbR = { a: P; m: P; e: P; a2: number } | null;
  const isArr = (l: Limb | undefined): l is [number, number] => Array.isArray(l);
  const defArm = (f: boolean): [number, number] => (front ? (f ? [80, 86] : [100, 94]) : f ? [86, 80] : [96, 100]);
  const defLeg = (f: boolean): [number, number] => (front ? (f ? [88, 90] : [92, 90]) : [90, 90]);
  const fk = (root: P, l: [number, number], l1: number, l2: number): LimbR => {
    const m = pol(root, l[0], l1);
    const e = pol(m, l[1], l2);
    return { a: root, m, e, a2: l[1] };
  };
  const limbs: Record<'armB' | 'armF' | 'legB' | 'legF', LimbR> = { armB: null, armF: null, legB: null, legF: null };
  const spec = { armB: po.armB, armF: po.armF, legB: po.legB, legF: po.legF };
  const root = { armB: shB, armF: shF, legB: hpB, legF: hpF };
  const lens = { armB: [B.ua, B.fa], armF: [B.ua, B.fa], legB: [B.th, B.sn], legF: [B.th, B.sn] } as const;
  for (const k of ['armB', 'armF', 'legB', 'legF'] as const) {
    const l = spec[k];
    const isArm = k.startsWith('arm');
    if (l === undefined || isArr(l)) {
      const ang = (l as [number, number] | undefined) ?? (isArm ? defArm(k === 'armF') : defLeg(k === 'legF'));
      limbs[k] = fk(root[k], ang, lens[k][0] * s, lens[k][1] * s);
    }
  }
  const footAng = (k: 'legB' | 'legF', a2: number) => {
    const o = k === 'legB' ? po.footB : po.footF;
    if (o !== undefined) return o;
    if (front) return a2 - 90;
    const n = ((a2 % 360) + 360) % 360;
    if (n >= 50 && n <= 130) return 0; // ayakta / oturur: taban yerde
    if (n > 130 && n < 230) return a2 - 8; // diz çökmüş: ayak üstü yerde, taban yukarı
    return a2 - 90; // yatan / bacak önde: burun yukarı
  };
  const FS = (B.foot * s) / 17;

  // --- sınırlar (zemin hizası için)
  const pts: [P, number][] = [];
  for (const t of keys(tMin, tMax)) { pts.push([edge(t, 0), 0]); pts.push([edge(t, 1), 0]); }
  pts.push([hc, hr * 1.08]);
  const addLimb = (k: 'armB' | 'armF' | 'legB' | 'legF') => {
    const r = limbs[k];
    if (!r) return;
    const isArm = k.startsWith('arm');
    const [r0, r1, r2] = isArm ? [B.uaR[0], B.uaR[1], B.faR[1]] : [B.thR[0], B.thR[1], B.snR[1]];
    pts.push([r.a, r0 * s], [r.m, r1 * s], [r.e, r2 * s]);
    if (isArm) pts.push([pol(r.e, r.a2, B.hand * s), B.handR * s * 0.8]);
    else {
      const fa = footAng(k as 'legB' | 'legF', r.a2);
      const ft = front ? [[-6, 5.2], [6, 5.2]] : [[-6, 4.6], [16, 4.6], [-5, -4.5]];
      for (const q of ft) pts.push([add(r.e, mul(rot(q as P, fa), FS)), 0]);
    }
  };
  (['armB', 'armF', 'legB', 'legF'] as const).forEach(addLimb);
  let maxY = -1e9, minY = 1e9;
  for (const [p, r] of pts) { maxY = Math.max(maxY, p[1] + r); minY = Math.min(minY, p[1] - r); }

  // --- konumlandırma
  const X = pr.x;
  const ax = pr.ax ?? 'hip';
  const ay = pr.ay ?? 'ground';
  const lj = (j: Joint): P => {
    const v = loc[j] ?? (j === 'kneeB' ? limbs.legB?.m : j === 'kneeF' ? limbs.legF?.m : j === 'ankleB' ? limbs.legB?.e : j === 'ankleF' ? limbs.legF?.e : j === 'elbowB' ? limbs.armB?.m : j === 'elbowF' ? limbs.armF?.m : j === 'wristB' ? limbs.armB?.e : j === 'wristF' ? limbs.armF?.e : undefined);
    return v ?? H0;
  };
  const T: P = [X - lj(ax)[0], ay === 'ground' ? pr.y - maxY : pr.y - lj(ay)[1]];
  const flip = !!pr.flip;
  const toW = (p: P): P => (flip ? [2 * X - (p[0] + T[0]), p[1] + T[1]] : [p[0] + T[0], p[1] + T[1]]);
  const toL = (w: P): P => (flip ? [2 * X - w[0] - T[0], w[1] - T[1]] : [w[0] - T[0], w[1] - T[1]]);
  const gyL = (pr.gy ?? pr.y) - T[1];

  // --- hedefli uzuvlar (IK)
  for (const k of ['armB', 'armF', 'legB', 'legF'] as const) {
    const l = spec[k];
    if (l === undefined || isArr(l)) continue;
    const isArm = k.startsWith('arm');
    const [l1, l2] = [lens[k][0] * s, lens[k][1] * s];
    const defBend = isArm ? (front ? (k === 'armF' ? -1 : 1) : 1) : front ? (k === 'legF' ? -1 : 1) : -1;
    const bend = l.bend ?? defBend;
    let tgt: P;
    if ('to' in l) tgt = toL(l.to);
    else if ('floor' in l) tgt = [root[k][0] + l.floor * s, gyL - (isArm ? B.handR * s * 0.9 : 5 * FS)];
    else tgt = add(lj(l.at), mul(l.d ?? [0, 0], s));
    // el ucu hedefe değsin diye bilek hedefi biraz geri çekilir
    const hoRaw = po[k === 'armB' ? 'handB' : 'handF'];
    const hoA = typeof hoRaw === 'object' ? hoRaw.a ?? 0 : 0;
    const hoNone = hoRaw === 'none' || (typeof hoRaw === 'object' && hoRaw.shape === 'none');
    if (isArm && !hoA && !hoNone) {
      const back = B.hand * s * 0.55;
      const dd = dist(root[k], tgt) || 1;
      tgt = lerp(tgt, root[k], Math.min(0.5, back / dd));
    }
    const [m, e] = ik(root[k], tgt, l1, l2, bend);
    limbs[k] = { a: root[k], m, e, a2: angOf(sub(e, m)) };
  }

  // --- çıktı rig
  const wAng = (a: number) => (flip ? 180 - a : a);
  const jl: Record<Joint, P> = {
    ...(loc as Record<Joint, P>),
    elbowB: limbs.armB!.m, elbowF: limbs.armF!.m, wristB: limbs.armB!.e, wristF: limbs.armF!.e,
    handB: pol(limbs.armB!.e, limbs.armB!.a2, B.hand * s * 0.5), handF: pol(limbs.armF!.e, limbs.armF!.a2, B.hand * s * 0.5),
    kneeB: limbs.legB!.m, kneeF: limbs.legF!.m, ankleB: limbs.legB!.e, ankleF: limbs.legF!.e,
    toeB: add(limbs.legB!.e, mul(rot([15, 2], footAng('legB', limbs.legB!.a2)), FS)),
    toeF: add(limbs.legF!.e, mul(rot([15, 2], footAng('legF', limbs.legF!.a2)), FS)),
  };
  const rig = { s, flip, headR: hr, foreB: wAng(limbs.armB!.a2), foreF: wAng(limbs.armF!.a2), headA: wAng(ha), top: minY + T[1] } as Rig;
  for (const j of Object.keys(jl) as Joint[]) rig[j] = toW(jl[j]);

  // ════════ ŞEKİLLER ════════
  const dk = (c: string, back: boolean) => (back ? shade(c, 0.16) : c);

  // kol
  const arm = (k: 'armB' | 'armF', back: boolean): Sh[] => {
    const r = limbs[k]!;
    const skn = dk(sk, back), tp = dk(top, back);
    const out: Sh[] = [
      { d: capsule(r.a, B.uaR[0] * s, r.m, B.uaR[1] * s), f: skn },
      { d: capsule(r.m, B.faR[0] * s, r.e, B.faR[1] * s), f: skn },
    ];
    const r0 = B.uaR[0] * s * 1.18 + 0.6 * s, r1 = B.uaR[1] * s * 1.1 + 0.9 * s;
    if (L.sleeve === 'short') out.push({ d: capsule(r.a, r0, lerp(r.a, r.m, 0.66), r1), f: tp });
    if (L.sleeve === 'long') {
      out.push({ d: capsule(r.a, r0, r.m, r1), f: tp });
      out.push({ d: capsule(r.m, r1, lerp(r.m, r.e, 0.9), B.faR[1] * s + 1 * s), f: tp });
    }
    const ho = po[k === 'armB' ? 'handB' : 'handF'];
    const hopt: HandOpt = typeof ho === 'string' ? { shape: ho } : ho ?? {};
    const shape = hopt.shape ?? 'mitten';
    if (shape !== 'none') {
      const ts = hopt.thumb ?? (front && k === 'armF' ? 1 : -1);
      const ha2 = r.a2 + (hopt.a ?? 0);
      for (const d of mitten(shape, B.hand * s, B.handR * s, ts)) out.push({ d, f: skn, t: `translate(${f1(r.e[0])} ${f1(r.e[1])}) rotate(${f1(ha2)})` });
    }
    return out;
  };

  // bacak
  const leg = (k: 'legB' | 'legF', back: boolean): Sh[] => {
    const r = limbs[k]!;
    const skn = dk(sk, back), bc = dk(L.bottomC, back);
    const out: Sh[] = [];
    const thA = capsule(r.a, B.thR[0] * s, r.m, B.thR[1] * s);
    const snA = capsule(r.m, B.snR[0] * s, r.e, B.snR[1] * s);
    if (L.bottom === 'pants' || L.bottom === 'onesie') {
      out.push({ d: capsule(r.a, B.thR[0] * s + 0.5 * s, r.m, B.thR[1] * s + 0.4 * s), f: bc });
      out.push({ d: capsule(r.m, B.thR[1] * s + 0.2 * s, r.e, B.snR[1] * s + 0.7 * s), f: bc });
    } else {
      out.push({ d: thA, f: skn }, { d: snA, f: skn });
      if (L.bottom === 'shorts') out.push({ d: capsule(r.a, B.thR[0] * s + 0.8 * s, lerp(r.a, r.m, 0.62), B.thR[1] * s + 1.4 * s), f: bc });
    }
    const fa = footAng(k, r.a2);
    const tr = `translate(${f1(r.e[0])} ${f1(r.e[1])}) rotate(${f1(fa)}) scale(${f1(FS * 100) / 100})`;
    if (L.shoes) {
      const shc = dk(L.shoes, back);
      out.push({ d: front ? FSHOE : SHOE, f: shc, t: tr, k: FS });
      out.push({ d: front ? FSOLE : SOLE, f: tint(shc, 0.55), t: tr, k: FS, no: true });
    } else {
      const fc = L.bottom === 'onesie' ? bc : skn;
      out.push({ d: front ? FFOOT : FOOT, f: fc, t: tr, k: FS });
    }
    return out;
  };

  // gövde
  const torso: Sh[] = [];
  const neckA = pol(N0, ca, -3 * s);
  const neckB = pol(N0, ha, (B.neck + B.h * 0.45) * s);
  torso.push({ d: capsule(neckA, B.neckR * s, neckB, B.neckR * s * 0.95), f: shade(sk, 0.1) });
  const hem = 0.13;
  const crotch = front ? `L${pt(spineAt(0.0).p)}` : '';
  const bottomFill = L.bottom === 'skirt' || L.bottom === 'longskirt' ? L.bottomC : L.bottom === 'onesie' ? top : L.bottomC;
  torso.push({ d: band(tMin, 0.26, crotch), f: bottomFill });
  torso.push({ d: band(L.bottom === 'onesie' ? 0.05 : hem, tMax), f: top });
  // gölge şeridi: yanda sırt tarafı, önde ekranın sağ yanı
  {
    const ts = keys(L.bottom === 'onesie' ? 0.05 : hem, 0.97);
    const k: 0 | 1 = front ? 0 : 1;
    const outer = ts.map((t) => edge(t, k));
    const inner = ts.map((t) => {
      const { p, n } = spineAt(t);
      const [a, b] = prof(t);
      const o = front ? a * 0.5 : b + (a - b) * 0.3;
      return add(p, mul(n, o * s));
    });
    torso.push({ d: smooth([...outer, ...inner.reverse()]) + 'Z', f: shade(top, 0.14), no: true });
  }
  if (front) {
    // yaka
    const { p, n } = spineAt(0.985);
    const tg: P = [n[1], -n[0]];
    const a = add(p, mul(n, -B.neckR * s * 1.15)), b = add(p, mul(n, B.neckR * s * 1.15));
    const c = add(p, mul(tg, -B.neckR * s * 1.1));
    torso.push({ d: `M${pt(a)}Q${pt(c)} ${pt(b)}`, st: shade(top, 0.3), sw: 1.3 * s });
  }

  // etek
  let skirt: Sh[] = [];
  if (L.bottom === 'skirt' || L.bottom === 'longskirt') {
    const f = L.bottom === 'skirt' ? 0.85 : 1.75;
    const sp: P[] = [edge(0.24, 0), edge(0.24, 1), edge(tMin, 0), edge(tMin, 1)];
    for (const k of ['legB', 'legF'] as const) {
      const r = limbs[k]!;
      const along = (q: number): P => (q <= 1 ? lerp(r.a, r.m, q) : lerp(r.m, r.e, q - 1));
      for (const q of [0.3, 0.7, f]) {
        const c = along(q);
        const a = q <= 1 ? angOf(sub(r.m, r.a)) : r.a2;
        const w = (q <= 1 ? B.thR[0] : B.snR[0]) * s + 3 * s;
        sp.push(pol(c, a + 90, w), pol(c, a - 90, w));
      }
    }
    skirt = [{ d: smooth(convexHull(sp), true, 0.6), f: L.bottomC }];
  }

  // baş
  const kh = hr / 12;
  const htr = `translate(${f1(hc[0])} ${f1(hc[1])}) rotate(${f1(ha + 90)}) scale(${f1(kh * 1000) / 1000})`;
  const hd = headShapes(hv, L, sk);
  const expr = pr.face ?? po.face ?? 'neutral';
  const tr = (sh: Sh[]) => sh.map((x) => ({ ...x, t: htr + (x.t ? ' ' + x.t : ''), k: kh }));

  const wrap = (el: JSX.Element) => (
    <g transform={flip ? `translate(${f1(2 * X)} 0) scale(-1 1) translate(${f1(T[0])} ${f1(T[1])})` : `translate(${f1(T[0])} ${f1(T[1])})`}>{el}</g>
  );
  const groups: Record<string, JSX.Element | null> = {
    legB: wrap(<OG sh={leg('legB', !front)} ow={ow} />),
    legF: wrap(<OG sh={leg('legF', false)} ow={ow} />),
    armB: wrap(<OG sh={arm('armB', !front)} ow={ow} />),
    armF: wrap(<OG sh={arm('armF', false)} ow={ow} />),
    torso: wrap(<OG sh={torso} ow={ow} />),
    skirt: skirt.length ? wrap(<OG sh={skirt} ow={ow} />) : null,
    hairBack: hd.back.length ? wrap(<OG sh={tr(hd.back)} ow={ow} />) : null,
    head: wrap(
      <g>
        <OG sh={tr(hd.main)} ow={ow} />
        <g transform={htr}>{faceFeatures(hv, expr, L, sk)}</g>
        {hd.over.length ? <OG sh={tr(hd.over)} ow={ow} /> : null}
      </g>,
    ),
  };

  // gölge
  let shadowEl: JSX.Element | null = null;
  if (ay === 'ground' && pr.shadow !== false) {
    const near = pts.filter(([p, r]) => p[1] + r > maxY - 14 * s).map(([p]) => p[0]);
    const x0 = Math.min(...near), x1 = Math.max(...near);
    shadowEl = wrap(<ellipse cx={f1((x0 + x1) / 2)} cy={f1(maxY - 0.5)} rx={f1((x1 - x0) / 2 + 9 * s)} ry={f1(3.6 * s)} fill="#000" opacity={0.13} />);
  }
  return { rig, T, X, groups, front, shadow: shadowEl, behind: po.behind ?? [] };
}

function rot(p: P, a: number): P {
  const c = Math.cos(a / R2D), s = Math.sin(a / R2D);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c];
}

function ik(rootP: P, target: P, l1: number, l2: number, bend: number): [P, P] {
  const d0 = dist(rootP, target);
  const d = Math.max(Math.abs(l1 - l2) + 0.5, Math.min(l1 + l2 - 0.01, d0));
  const base = angOf(sub(target, rootP));
  const c = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const a1 = base + bend * Math.acos(Math.max(-1, Math.min(1, c))) * R2D;
  const m = pol(rootP, a1, l1);
  const e = pol(m, angOf(sub(target, m)), l2);
  return [m, e];
}

/** Kişinin eklem koordinatlarını hesaplar (çizmeden). Person ile AYNI prop'lar verilmelidir. */
export function rig(p: PersonProps): Rig {
  return build(p).rig;
}

/** İnsan figürü. Bkz. PersonProps ve POSE. */
export function Person(p: PersonProps) {
  const b = build(p);
  const g = b.groups;
  const on0 = (x: Part) => !p.only || p.only.includes(x);
  const bh = (x: Part) => (b.behind as string[]).includes(x);
  const on = (x: Part) => on0(x) && !bh(x);
  const early = (b.behind as Part[]).filter(on0).map((x) => g[x]);
  const r = b.rig;
  return (
    <g>
      {p.under?.(r)}
      {on('torso') && b.shadow}
      {b.front ? (
        <>
          {p.back?.(r)}
          {early}
          {on('legB') && g.legB}
          {on('legF') && g.legF}
          {on('head') && g.hairBack}
          {on('torso') && g.torso}
          {on('torso') && g.skirt}
          {on('head') && g.head}
          {p.mid?.(r)}
          {on('armB') && g.armB}
          {on('armF') && g.armF}
        </>
      ) : (
        <>
          {early}
          {on('legB') && g.legB}
          {on('armB') && g.armB}
          {p.back?.(r)}
          {on('torso') && g.torso}
          {on('legF') && g.legF}
          {on('torso') && g.skirt}
          {on('head') && g.head}
          {p.mid?.(r)}
          {on('armF') && g.armF}
        </>
      )}
      {p.over?.(r)}
    </g>
  );
}

/* ── eldiven el (tam boy sahneler için) — yerel: bilek 0,0; el +x yönünde ── */
function mitten(shape: HandShape, L: number, w: number, ts: number): string[] {
  if (shape === 'fist') return [circ([L * 0.42, 0], w * 1.12), capsule([L * 0.2, ts * w * 0.55], w * 0.42, [L * 0.55, ts * w * 0.95], w * 0.36)];
  if (shape === 'flat')
    return [
      `M0 ${f1(-w * 0.8)}L${f1(L * 0.75)} ${f1(-w * 0.85)}C${f1(L * 1.2)} ${f1(-w * 0.85)} ${f1(L * 1.2)} ${f1(w * 0.85)} ${f1(L * 0.75)} ${f1(w * 0.85)}L0 ${f1(w * 0.8)}Z`,
      capsule([L * 0.1, ts * w * 0.45], w * 0.4, [L * 0.55, ts * w * 0.85], w * 0.34),
    ];
  return [
    `M0 ${f1(-w * 0.85)}L${f1(L * 0.55)} ${f1(-w)}C${f1(L * 1.08)} ${f1(-w)} ${f1(L * 1.08)} ${f1(w)} ${f1(L * 0.55)} ${f1(w)}L0 ${f1(w * 0.85)}Z`,
    capsule([L * 0.15, ts * w * 0.5], w * 0.42, [L * 0.45, ts * w * 1.45], w * 0.36),
  ];
}

/* ── ayakkabılar (yerel: bilek 0,0; burun +x; taban +y; 17 birim ayak) ── */
const SHOE = 'M-5 -4.5C-6.6 -0.5 -6.4 3.4 -4.6 4.6L13.6 4.6C16.6 4.6 17.4 1.6 15 -0.2C12.4 -2 8 -2.6 4.4 -5.4Z';
const SOLE = 'M-6.2 2.6L17 2.6C16.8 3.9 15.6 4.6 13.6 4.6L-4.6 4.6C-5.6 4.1 -6 3.4 -6.2 2.6Z';
const FSHOE = 'M-5.6 -3C-6.8 1.6 -6 5 0 5.2C6 5 6.8 1.6 5.6 -3Z';
const FSOLE = 'M-6.5 2.8C-6.1 4.4 -4 5.2 0 5.2C4 5.2 6.1 4.4 6.5 2.8Z';
const FOOT = 'M-4 -4C-5.5 0 -5 4 -3 4.4L11 4.4C14 4.4 14.6 1.5 12 0C9 -1.4 6 -2.6 4 -5Z';
const FFOOT = 'M-4.5 -3C-5.5 1.6 -5 4.8 0 5C5 4.8 5.5 1.6 4.5 -3Z';

/* ════════════════════════════ BAŞ ════════════════════════════ */
// Baş yerel koordinatı: merkez 0,0; yarıçap ≈12; tepe -y; profilde yüz +x yönünde.

const HEAD_SIDE = 'M0 -12.8C6.5 -12.8 11 -8.8 11.2 -3.6L13.3 1.4Q13.4 2.9 11.4 3L11.6 5.6Q11.6 9.4 8.6 10.8Q5 12.2 1.5 11C-6 11.6 -12.6 6 -12.6 -0.6C-12.6 -7.8 -7.2 -12.8 0 -12.8Z';
const HEAD_FRONT = 'M0 -12.8C7.2 -12.8 11.4 -8.4 11.4 -1.5C11.4 5.5 7.2 12 0 12C-7.2 12 -11.4 5.5 -11.4 -1.5C-11.4 -8.4 -7.2 -12.8 0 -12.8Z';

const HAIR: Record<'side' | 'front', Partial<Record<HairStyle, { back?: string; main?: string; over?: string }>>> = {
  side: {
    short: { main: 'M-12.9 1C-13.8 -8 -8 -14.6 0 -14.4C7 -14.2 11.8 -10 11.9 -5.2C8.6 -7.4 4.6 -7.8 1.6 -6.8C0 -4.8 -0.6 -2.8 -1.6 -1.6C-3.8 -2 -4.6 1.6 -4.2 4C-6.2 6.5 -9 7 -11.6 6C-12.4 4.5 -12.8 2.8 -12.9 1Z' },
    long: { main: 'M-13 4C-14 -8 -8 -14.6 0 -14.4C7 -14.2 11.8 -10 11.9 -5C8 -7.8 3 -8 0.2 -6C-1.4 -3 -2.4 0 -3 4C-3.4 10 -2.6 18 -0.6 25C-4 27 -9 27 -12.4 25C-14 18 -14 10 -13 4Z' },
    bun: { main: 'M-12.9 1C-13.8 -8 -8 -14.6 0 -14.4C7 -14.2 11.8 -10 11.9 -5.2C8.4 -7.6 3.8 -8 0.6 -6.6C-1 -4 -1.6 -2 -2.4 0C-4 1 -4.6 4 -4.2 6.5C-7 8 -10 7.6 -12 6C-12.6 4.5 -12.8 2.8 -12.9 1Z', back: 'M-10.6 -13.6m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0' },
    ponytail: { main: 'M-12.9 1C-13.8 -8 -8 -14.6 0 -14.4C7 -14.2 11.8 -10 11.9 -5.2C8.4 -7.6 3.8 -8 0.6 -6.6C-1 -4 -1.6 -2 -2.4 0C-4 1 -4.6 4 -4.2 6.5C-7 8 -10 7.6 -12 6C-12.6 4.5 -12.8 2.8 -12.9 1Z', back: 'M-10 -8C-17 -10 -21 -2 -19.5 7C-19 11 -17.5 14 -16 16C-16.2 10 -14.6 4 -11 0Z' },
    bald: { main: 'M-12.6 2C-12.8 -2 -12 -5 -10.5 -7.2C-8.4 -5 -6 -3.2 -4 -1.4C-4.6 1.6 -4.2 4.4 -4 6C-7 7.6 -10 7 -11.8 5.5Z' },
    scarf: { over: 'M11.9 -6C12.2 -12 7 -15.9 0 -15.9C-8 -15.9 -14.6 -10 -14.6 -1C-14.6 8 -13.2 16 -12.4 25L11.4 25C11.4 20 10.4 16 8.8 12.6C6.2 11.2 5.2 7 5.6 2C6 -2 8 -5 11.9 -6Z' },
    baby: { main: 'M-3 -12.4Q-1 -17.5 3.5 -14.6Q1.5 -14 0.8 -12.6Z' },
  },
  front: {
    short: { main: 'M-11.8 0C-13 -9 -7.5 -14.8 0 -14.8C7.5 -14.8 13 -9 11.8 0C11 -3.5 10.4 -5.6 8.8 -7C5 -5 -1 -5.6 -5.2 -8.2C-7.2 -6.6 -9.6 -4.4 -11.8 0Z' },
    long: {
      back: 'M-12.6 -2C-14.4 8 -15 18 -13.4 25L13.4 25C15 18 14.4 8 12.6 -2Z',
      main: 'M-12 5C-13.6 -8 -7.6 -14.8 0 -14.8C7.6 -14.8 13.6 -8 12 5C11.6 -2 10 -6 7.6 -8C4.2 -6.2 1.2 -7.6 0 -10C-1.2 -7.6 -4.2 -6.2 -7.6 -8C-10 -6 -11.6 -2 -12 5Z',
    },
    bun: { back: 'M0 -15.5m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0', main: 'M-11.8 1C-13 -9 -7.5 -14.8 0 -14.8C7.5 -14.8 13 -9 11.8 1C11.2 -3 10 -6 7.6 -7.8C4 -6.6 -4 -6.6 -7.6 -7.8C-10 -6 -11.2 -3 -11.8 1Z' },
    ponytail: { back: 'M9 -10C16 -12 19 -4 17.5 5C17 9 15.5 12 14 13.5C14.2 8 13.4 3 10.5 -1Z', main: 'M-11.8 1C-13 -9 -7.5 -14.8 0 -14.8C7.5 -14.8 13 -9 11.8 1C11.2 -3 10 -6 7.6 -7.8C4 -6.6 -4 -6.6 -7.6 -7.8C-10 -6 -11.2 -3 -11.8 1Z' },
    bald: { main: 'M-11.9 3C-12.6 -2 -11.8 -5 -10 -6.8C-10 -3 -9.8 0 -9.4 3ZM11.9 3C12.6 -2 11.8 -5 10 -6.8C10 -3 9.8 0 9.4 3Z' },
    scarf: { over: 'M0 -15.8C9 -15.8 14.6 -9 14.2 0C13.8 8 11.4 13.6 7 16.8L14.5 25L-14.5 25L-7 16.8C-11.4 13.6 -13.8 8 -14.2 0C-14.6 -9 -9 -15.8 0 -15.8ZM0 -10.4C-6.4 -10.4 -9.8 -6.4 -9.8 0C-9.8 6.2 -6.2 11 0 11C6.2 11 9.8 6.2 9.8 0C9.8 -6.4 6.4 -10.4 0 -10.4Z' },
    baby: { main: 'M-2.4 -12.6Q0 -18 4 -14.4Q1.8 -14 1 -12.6Z' },
  },
};

function headShapes(view: 'side' | 'front', L: Look, sk: string): { back: Sh[]; main: Sh[]; over: Sh[] } {
  const hs = HAIR[view][L.hair] ?? {};
  const hc = L.hair === 'scarf' ? L.hairC : L.hairC;
  const back: Sh[] = [], main: Sh[] = [], over: Sh[] = [];
  const earC = shade(sk, 0.06);
  if (view === 'front') {
    if (hs.back) (L.hair === 'long' ? back : main).push({ d: hs.back, f: shade(hc, 0.12) });
    if (L.hair !== 'scarf') {
      main.push({ d: ell([-11.2, 1], 2.3, 3.3), f: earC }, { d: ell([11.2, 1], 2.3, 3.3), f: earC });
    }
    main.push({ d: HEAD_FRONT, f: sk });
    // hafif çene gölgesi
    main.push({ d: 'M-7.5 8.5Q0 14.5 7.5 8.5Q5 12 0 12Q-5 12 -7.5 8.5Z', f: shade(sk, 0.08), no: true });
    if (hs.main) main.push({ d: hs.main, f: hc });
    if (hs.over) over.push({ d: hs.over, f: hc, fr: 'evenodd' }, { d: 'M-12.4 3C-12 10 -8 14.6 -3 16.2', st: shade(hc, 0.25), sw: 1.1 });
  } else {
    if (hs.back) main.push({ d: hs.back, f: shade(hc, 0.1) });
    main.push({ d: HEAD_SIDE, f: sk });
    if (hs.main) main.push({ d: hs.main, f: hc });
    if (L.hair !== 'scarf') main.push({ d: ell([-1.4, 1.2], 2.5, 3.4), f: earC, ln: true }, { d: 'M-1 -0.8Q-2.6 1.2 -1 3', st: shade(sk, 0.25), sw: 0.9 });
    if (hs.over) over.push({ d: hs.over, f: hc }, { d: 'M5.4 2C5.6 7 7 10.6 9.4 12.6', st: shade(hc, 0.25), sw: 1.1 });
  }
  return { back, main, over };
}

function faceFeatures(view: 'side' | 'front', ex: Expr, L: Look, sk: string): JSX.Element {
  const E = K.ink;
  const browC = L.hair === 'bald' || L.hair === 'scarf' || L.hair === 'baby' ? shade(sk, 0.45) : shade(L.hairC, 0.2);
  const mouthC = shade(sk, 0.5);
  const lw = 1.35;
  const S = { fill: 'none', 'stroke-linecap': 'round' as const, 'stroke-linejoin': 'round' as const };
  const blush = '#ef8b78';
  if (view === 'side') {
    const eye =
      ex === 'closed' ? <path d="M5.4 -1.2Q7 0.6 8.6 -1.2" stroke={E} stroke-width={lw} {...S} />
      : ex === 'pain' ? <path d="M5.4 -2.4L8.4 -1.2L5.6 -0.1" stroke={E} stroke-width={lw} {...S} />
      : ex === 'calm' ? <path d="M5.6 -0.6Q7.1 -2.6 8.6 -0.6" stroke={E} stroke-width={lw} {...S} />
      : <ellipse cx={7.1} cy={-1.2} rx={1.35} ry={1.6} fill={E} />;
    const brow =
      ex === 'worried' ? 'M4.8 -4.4L9.2 -6' : ex === 'pain' ? 'M4.8 -5L9.4 -3.6' : ex === 'calm' ? 'M5 -4.8Q7 -5.8 9.2 -5' : 'M4.9 -4.7L9.3 -4.9';
    const mouth =
      ex === 'calm' ? <path d="M8.6 6.2Q10 7.8 11.4 6.2" stroke={mouthC} stroke-width={lw} {...S} />
      : ex === 'worried' ? <path d="M8.8 7.4Q10 6.2 11.3 7" stroke={mouthC} stroke-width={lw} {...S} />
      : ex === 'pain' ? <path d="M8.4 5.8L11.6 5.6L11.4 8.2L8.8 8Z" fill={E} stroke={E} stroke-width={0.8} stroke-linejoin="round" />
      : ex === 'speak' ? <path d="M9 6Q11.4 5.4 11.6 6.4Q11.4 8.8 9.6 8Z" fill={E} />
      : <path d={ex === 'closed' ? 'M9.2 7.2L11.2 7' : 'M9.2 6.9Q10.3 7.2 11.3 6.9'} stroke={mouthC} stroke-width={lw} {...S} />;
    return (
      <g>
        <circle cx={6.2} cy={4.4} r={2.1} fill={blush} opacity={0.3} />
        {eye}
        <path d={brow} stroke={browC} stroke-width={1.5} {...S} />
        {mouth}
        {L.mustache && <path d="M8.6 4.4Q11.6 3.4 12.3 4.6Q11.4 6 8.8 5.6Z" fill={L.hairC === K.hair.grey ? K.hair.grey : L.hairC} />}
        {L.glasses && (
          <g stroke={E} stroke-width={0.9} fill="none">
            <circle cx={7.6} cy={-1} r={2.8} fill="#fff" fill-opacity={0.25} />
            <path d="M4.8 -1.4L-0.5 -1.6" />
          </g>
        )}
      </g>
    );
  }
  const eyes =
    ex === 'closed' ? <path d="M-6 0Q-4.4 1.6 -2.8 0M2.8 0Q4.4 1.6 6 0" stroke={E} stroke-width={lw} {...S} />
    : ex === 'pain' ? <path d="M-6.2 -1.4L-3.2 0.2L-6.2 1.6M6.2 -1.4L3.2 0.2L6.2 1.6" stroke={E} stroke-width={lw} {...S} />
    : ex === 'calm' ? <path d="M-6 0.6Q-4.4 -1.4 -2.8 0.6M2.8 0.6Q4.4 -1.4 6 0.6" stroke={E} stroke-width={lw} {...S} />
    : (
      <g fill={E}>
        <ellipse cx={-4.4} cy={0.2} rx={1.4} ry={1.65} />
        <ellipse cx={4.4} cy={0.2} rx={1.4} ry={1.65} />
      </g>
    );
  const brows =
    ex === 'worried' ? 'M-6.6 -3.8L-2.6 -5.6M6.6 -3.8L2.6 -5.6'
    : ex === 'pain' ? 'M-6.6 -5.2L-2.6 -3.6M6.6 -5.2L2.6 -3.6'
    : 'M-6.4 -4.2Q-4.4 -5.4 -2.4 -4.5M6.4 -4.2Q4.4 -5.4 2.4 -4.5';
  const mouth =
    ex === 'calm' ? <path d="M-3.2 6.6Q0 9.6 3.2 6.6" stroke={mouthC} stroke-width={lw} {...S} />
    : ex === 'worried' ? <path d="M-2.6 8.2Q0 6.4 2.6 8.2" stroke={mouthC} stroke-width={lw} {...S} />
    : ex === 'pain' ? <path d="M-3.4 6.2Q0 5.4 3.4 6.2L3 9Q0 10 -3 9Z" fill={E} stroke={E} stroke-width={0.8} stroke-linejoin="round" />
    : ex === 'speak' ? <path d="M-2.4 6.4Q0 5.8 2.4 6.4Q2 10 0 10Q-2 10 -2.4 6.4Z" fill={E} />
    : <path d={ex === 'closed' ? 'M-2.2 7.8L2.2 7.8' : 'M-2.4 7.6Q0 8.3 2.4 7.6'} stroke={mouthC} stroke-width={lw} {...S} />;
  return (
    <g>
      <circle cx={-6.8} cy={4.4} r={2.1} fill={blush} opacity={0.3} />
      <circle cx={6.8} cy={4.4} r={2.1} fill={blush} opacity={0.3} />
      {eyes}
      <path d={brows} stroke={browC} stroke-width={1.5} {...S} />
      <path d="M-1.1 3.6Q0 4.6 1.1 3.6" stroke={shade(sk, 0.3)} stroke-width={1} {...S} />
      {mouth}
      {L.mustache && <path d="M-4.4 5.6Q-2 3.8 0 5Q2 3.8 4.4 5.6Q2.4 6.8 0 6Q-2.4 6.8 -4.4 5.6Z" fill={L.hairC} />}
      {L.glasses && (
        <g stroke={E} stroke-width={0.9} fill="#fff" fill-opacity={0.25}>
          <circle cx={-4.4} cy={0.2} r={3} />
          <circle cx={4.4} cy={0.2} r={3} />
          <path d="M-1.4 0H1.4" fill="none" />
        </g>
      )}
    </g>
  );
}

/* ════════════════════════ AYRINTILI EL (yakın plan) ════════════════════════ */

export type HandPose = 'open' | 'press' | 'fist' | 'pinch' | 'point' | 'hold';
export interface HandProps {
  /** bilek noktası */
  x: number;
  y: number;
  /** yön: 0 = parmaklar yukarı, 90 = sağa, 180 = aşağı, -90 = sola */
  a?: number;
  /** ölçek: s=1'de bilekten orta parmak ucuna ≈ 66 birim */
  s?: number;
  pose?: HandPose;
  /** 'R' sağ el, 'L' sol el (ayna) */
  side?: 'L' | 'R';
  /** 'back' el sırtı (tırnaklar görünür), 'palm' avuç içi */
  view?: 'back' | 'palm';
  skin?: number;
  /** bilekten geriye uzanan önkol uzunluğu (s=1 biriminde); 0 = yok */
  arm?: number;
  /** kol yeni rengi (verilirse önkolun bir kısmı kumaşla kaplanır) */
  sleeve?: string;
  /** 'hold' duruşunda tutulan nesnenin genişliği (yerel birim) */
  grip?: number;
  /** 'hold' duruşunda: çocuklar avuç ile parmak uçları arasında çizilir (sahne koordinatı) */
  children?: ComponentChildren;
}

interface HandGeo { back: Sh[]; front: Sh[]; details: Sh[]; pts: Record<'tip' | 'grip' | 'palm' | 'pinch', P> }

const PALM = 'M-11 0C-12 -8 -14.5 -18 -14.5 -26C-14.5 -33 -9 -37 -1 -37C7 -37 13.5 -34.5 14 -27.5C14.5 -19 12.5 -9 11 0Z';
const FISTB = 'M-11 0C-12 -9 -14 -19 -14 -27C-14 -33 -9.5 -36 -1 -36C7.5 -36 13.5 -33.5 13.8 -27C14 -19 12.5 -9 11 0Z';

function handGeo(pose: HandPose, view: 'back' | 'palm', sk: string, gw: number): HandGeo {
  const back: Sh[] = [], front: Sh[] = [], det: Sh[] = [];
  const nailC = tint(sk, 0.45);
  const line = shade(sk, 0.32);
  const fing = (ps: P[], rs: number[], into: Sh[] = back) => chain(ps, rs).forEach((d) => into.push({ d, f: sk }));
  const nail = (tip: P, from: P, into: Sh[] = det) => {
    if (view === 'palm') return;
    const a = angOf(sub(tip, from));
    const c = pol(tip, a, -3.6);
    into.push({ d: ell([0, 0], 3.1, 2.1), t: `translate(${f1(c[0])} ${f1(c[1])}) rotate(${f1(a)})`, f: nailC, no: true });
  };
  const sep = (a: P, b: P) => det.push({ d: `M${pt(a)}L${pt(b)}`, st: K.out, sw: 1 });
  let pts: HandGeo['pts'] = { tip: [-3.6, -66], grip: [0, -44], palm: [0, -20], pinch: [-20.5, -53] };

  if (pose === 'open' || pose === 'press') {
    back.push({ d: PALM, f: sk });
    const P_ = pose === 'open'
      ? [[[-9.6, -31], [-14.6, -60]], [[-3.2, -34], [-4, -66]], [[3.6, -33], [6.8, -62]], [[10, -28], [15.8, -51]]]
      : [[[-9.6, -31], [-11.6, -56]], [[-3.2, -34], [-3.6, -60]], [[3.4, -33], [4.8, -57]], [[9.6, -28], [11.8, -48]]];
    const R_ = [[3.9, 3.3], [4.1, 3.5], [3.9, 3.3], [3.4, 2.9]];
    P_.forEach((f, i) => fing(f as P[], R_[i]));
    if (pose === 'open') fing([[-11, -12], [-20, -24], [-27, -34]], [5, 4.2, 3.6]);
    else fing([[-11, -12], [-17.5, -23], [-19.6, -33]], [5, 4.3, 3.7]);
    P_.forEach((f) => nail(f[1] as P, f[0] as P));
    nail(pose === 'open' ? [-27, -34] : [-19.6, -33], pose === 'open' ? [-20, -24] : [-17.5, -23]);
    if (pose === 'press') {
      sep([-6.4, -40], [-7.6, -56]);
      sep([0.2, -40], [0.6, -57]);
      sep([6.6, -38], [8.2, -52]);
    }
    if (view === 'palm') {
      det.push({ d: 'M-10 -24Q0 -17 11 -26', st: line, sw: 1.1 }, { d: 'M-9 -9Q-6 -19 -10 -28', st: line, sw: 1.1 });
    } else {
      // eklem kıvrımları
      for (const f of P_) {
        const m = lerp(f[0] as P, f[1] as P, 0.55);
        const a = angOf(sub(f[1] as P, f[0] as P)) + 90;
        det.push({ d: `M${pt(pol(m, a, -1.6))}L${pt(pol(m, a, 1.6))}`, st: line, sw: 0.8 });
      }
    }
    pts = { tip: P_[1][1] as P, grip: [0, -44], palm: [0, -18], pinch: [-20.5, -53] };
  } else if (pose === 'fist' || pose === 'point' || pose === 'pinch') {
    back.push({ d: FISTB, f: sk });
    const humps: [P, P, number][] = [[[-9.4, -33], [-9.6, -41], 4.2], [[-3.2, -35], [-3.2, -44], 4.4], [[3.4, -34], [3.6, -42.5], 4.2], [[9.6, -30], [10, -37.5], 3.7]];
    humps.forEach(([a, b, r], i) => {
      if ((pose === 'point' || pose === 'pinch') && i === 0) return;
      back.push({ d: capsule(a, r, b, r * 0.95), f: sk });
    });
    sep([-6.3, -38], [-6.3, -44]);
    sep([0.1, -39], [0.2, -45]);
    sep([6.6, -35], [6.8, -41]);
    if (pose === 'fist') {
      fing([[-11.5, -10], [-16.5, -22], [-12, -31]], [5, 4.5, 4]);
      pts = { tip: [-3.2, -48], grip: [0, -30], palm: [0, -18], pinch: [-12, -31] };
    } else if (pose === 'point') {
      fing([[-9.4, -33], [-10.2, -50], [-10.6, -67]], [4, 3.7, 3.4]);
      nail([-10.6, -67], [-10.2, -50]);
      fing([[-11.5, -10], [-16, -22], [-9, -32]], [5, 4.5, 4]);
      pts = { tip: [-10.6, -70.5], grip: [0, -30], palm: [0, -18], pinch: [-10.6, -70] };
    } else {
      fing([[-9.4, -33], [-13.5, -50], [-22, -51]], [4, 3.6, 3.3]);
      fing([[-12, -10], [-24.5, -25], [-24.5, -45]], [5, 4.3, 3.6]);
      nail([-22, -51], [-13.5, -50]);
      nail([-24.5, -45], [-24.5, -25]);
      pts = { tip: [-24, -49], grip: [-24, -49], palm: [0, -18], pinch: [-24, -49] };
    }
  } else {
    // hold: nesne merkezi (0,-44), genişliği gw. Avuç arkada, başparmak ve parmak uçları önde.
    const hw = gw / 2;
    back.push({ d: 'M-12 0C-13 -8 -15 -18 -15 -26C-15 -32 -10 -35 0 -35C9 -35 14 -32 14 -26C14 -18 12.5 -8 11 0Z', f: sk });
    back.push({ d: capsule([-9, -9], 6.5, [-hw + 1, -22], 5.5), f: sk });
    chain([[-hw - 2, -20], [-hw - 4, -31], [-hw + 5, -43]], [5, 4.4, 3.8]).forEach((d) => front.push({ d, f: sk }));
    for (let i = 0; i < 4; i++) {
      const y = -63 + i * 10.5;
      front.push({ d: capsule([hw + 5, y + 3], 3.8 - i * 0.15, [hw - 3, y], 3.4 - i * 0.15), f: sk });
      if (view === 'back') front.push({ d: ell([hw - 1.8, y - 0.2], 2.2, 1.5), f: nailC, no: true });
    }
    front.push({ d: ell([-hw + 2.4, -44.6], 1.6, 2.4), f: nailC, no: true, t: 'rotate(-30 ' + (-hw + 2.4) + ' -44.6)' });
    pts = { tip: [hw, -60], grip: [0, -44], palm: [0, -18], pinch: [-hw + 4, -43] };
  }
  return { back, front, details: det, pts };
}

/** Yakın plan için ayrıntılı el. Bilek (x,y)'de; a ile döner; side/view ile aynalanır.
 *  'hold' duruşunda <Hand ...><Phone .../></Hand>: çocuk nesne avuç ile parmaklar arasına girer. */
export function Hand({ x, y, a = 0, s = 1, pose = 'open', side = 'R', view = 'back', skin = 1, arm = 34, sleeve, grip = 34, children }: HandProps) {
  const sk = skinC(skin);
  const m = (side === 'L') !== (view === 'palm') ? -1 : 1;
  const g = handGeo(pose, view, sk, grip);
  const t = `translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${m * s} ${s})`;
  const armSh: Sh[] = [];
  if (arm > 0) {
    armSh.push({ d: capsule([0, -4], 11.6, [0, arm], 13.2), f: sk });
    if (sleeve) armSh.push({ d: capsule([0, Math.min(arm * 0.5, 22)], 14.4, [0, arm + 16], 15.4), f: sleeve }, { d: `M-14 ${f1(Math.min(arm * 0.5, 22) + 2)}H14`, st: shade(sleeve, 0.3), sw: 1.2 });
  }
  const tf = (sh: Sh[]) => sh.map((q) => ({ ...q, t: t + (q.t ? ' ' + q.t : ''), k: s }));
  const ow = OW * (0.6 + 0.4 * s);
  return (
    <g>
      <OG sh={tf([...armSh, ...g.back])} ow={ow} />
      <OG sh={tf(pose === 'hold' ? [] : g.details)} ow={ow} />
      {children}
      {pose === 'hold' && <OG sh={tf([...g.front, ...g.details])} ow={ow} />}
    </g>
  );
}

/** Ayrıntılı elin bir noktasının sahne koordinatı: 'tip' (parmak ucu), 'grip' (tutulan nesne merkezi),
 *  'palm' (avuç), 'pinch' (çimdik noktası). Hand ile aynı x,y,a,s,side,view,pose verilmeli. */
export function handPoint(h: Pick<HandProps, 'x' | 'y' | 'a' | 's' | 'side' | 'view' | 'pose' | 'grip'>, which: 'tip' | 'grip' | 'palm' | 'pinch' = 'tip'): P {
  const g = handGeo(h.pose ?? 'open', h.view ?? 'back', '#000000', h.grip ?? 34);
  const m = (h.side === 'L') !== (h.view === 'palm') ? -1 : 1;
  const s = h.s ?? 1;
  const p = g.pts[which];
  const r = rot([p[0] * m * s, p[1] * s], h.a ?? 0);
  return [h.x + r[0], h.y + r[1]];
}

/* ════════════════════════════ SAHNE ════════════════════════════ */

export type Bg = 'indoor' | 'outdoor' | 'night' | 'dark' | 'closeup' | 'floor';
/** Varsayılan zemin çizgisi (indoor/outdoor/night) */
export const GY = 200;
let sceneUid = 0;

/** Sahne çerçevesi (320×240, yuvarlak köşeli zemin). gy = zemin çizgisi. */
export function Scene2({ children, bg = 'indoor', gy = GY, title, wall, ground }: { children?: ComponentChildren; bg?: Bg; gy?: number; title?: string; wall?: string; ground?: 'grass' | 'dirt' | 'snow' | 'pavement' }) {
  const id = 'sc2-' + ++sceneUid;
  let back: JSX.Element;
  if (bg === 'indoor') {
    const w = wall ?? K.wall;
    back = (
      <g>
        <rect width={320} height={240} fill={w} />
        <rect y={gy - 9} width={320} height={9} fill={shade(w, 0.1)} />
        <rect y={gy - 9} width={320} height={2} fill={tint(w, 0.4)} />
        <rect y={gy} width={320} height={240 - gy} fill={K.floor} />
        <rect y={gy} width={320} height={3} fill={K.floorShade} />
        {[gy + 14, gy + 30].map((yy) => (yy < 240 ? <rect key={yy} y={yy} width={320} height={1.2} fill={K.floorShade} opacity={0.5} /> : null))}
      </g>
    );
  } else if (bg === 'outdoor' || bg === 'night') {
    const night = bg === 'night';
    const g = night ? K.nightGround : ground === 'dirt' ? K.dirt : ground === 'snow' ? '#eef3f6' : ground === 'pavement' ? '#b9b7b0' : K.grass;
    back = (
      <g>
        <rect width={320} height={240} fill={night ? K.nightSky : K.sky} />
        {!night && <rect y={gy - 60} width={320} height={60} fill={K.skyLow} />}
        {night ? (
          <g>
            <circle cx={262} cy={42} r={15} fill="#f4eccb" />
            <circle cx={255} cy={37} r={14} fill={K.nightSky} />
            {[[40, 30], [90, 55], [140, 22], [200, 48], [300, 80], [20, 90], [170, 75]].map(([sx, sy], i) => (
              <circle key={i} cx={sx} cy={sy} r={i % 2 ? 1.2 : 1.7} fill="#f4eccb" opacity={0.8} />
            ))}
          </g>
        ) : (
          <g fill="#fff" opacity={0.85}>
            <path d="M40 46a10 10 0 0 1 19 -4a8 8 0 0 1 13 6h-32z" />
            <path d="M228 30a11 11 0 0 1 21 -4a8 8 0 0 1 14 7h-35z" />
          </g>
        )}
        <path d={`M0 ${gy - 18}Q60 ${gy - 42} 130 ${gy - 22}T260 ${gy - 26}T320 ${gy - 30}V${gy}H0Z`} fill={night ? '#26332f' : K.hill} />
        <rect y={gy} width={320} height={240 - gy} fill={g} />
        <rect y={gy} width={320} height={3} fill={shade(g, 0.12)} />
      </g>
    );
  } else if (bg === 'floor') {
    back = (
      <g>
        <rect width={320} height={240} fill={K.floor} />
        {[30, 70, 110, 150, 190, 230].map((yy, i) => (
          <g key={yy}>
            <rect y={yy} width={320} height={1.5} fill={K.floorShade} />
            <rect x={(i * 97) % 300 + 10} y={yy - 40} width={1.5} height={40} fill={K.floorShade} opacity={0.6} />
          </g>
        ))}
      </g>
    );
  } else if (bg === 'dark') {
    back = <rect width={320} height={240} fill={K.dark} />;
  } else {
    back = (
      <g>
        <rect width={320} height={240} fill={K.closeup} />
        <circle cx={160} cy={130} r={130} fill={tint(K.closeup, 0.35)} />
      </g>
    );
  }
  return (
    <svg viewBox="0 0 320 240" class="art" role="img" aria-label={title} aria-hidden={title ? undefined : 'true'} font-family="'IBM Plex Sans', system-ui, sans-serif">
      <defs>
        <clipPath id={id}>
          <rect width={320} height={240} rx={14} />
        </clipPath>
      </defs>
      <g clip-path={`url(#${id})`}>
        {back}
        {children}
      </g>
    </svg>
  );
}

/* ════════════════════════════ İŞARETLER ════════════════════════════ */

/** Kırmızı yasak işareti (halka + çapraz) — bir şeyin üstüne konur */
export function No({ x, y, r = 30 }: { x: number; y: number; r?: number }) {
  const d = r * 0.7071;
  const w = Math.max(4, r * 0.16);
  return (
    <g stroke-linecap="round">
      <circle cx={x} cy={y} r={r} fill="none" stroke="#fff" stroke-width={w + 3} opacity={0.9} />
      <line x1={x - d} y1={y - d} x2={x + d} y2={y + d} stroke="#fff" stroke-width={w + 3} opacity={0.9} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={K.danger} stroke-width={w} />
      <line x1={x - d} y1={y - d} x2={x + d} y2={y + d} stroke={K.danger} stroke-width={w} />
    </g>
  );
}
/** Yeşil onay rozeti */
export function Ok({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 2} fill="#fff" />
      <circle cx={x} cy={y} r={r} fill={K.safe} />
      <path d={`M${x - r * 0.45} ${y + r * 0.02}L${x - r * 0.1} ${y + r * 0.38}L${x + r * 0.5} ${y - r * 0.32}`} fill="none" stroke="#fff" stroke-width={r * 0.26} stroke-linecap="round" stroke-linejoin="round" />
    </g>
  );
}
/** Kırmızı çarpı rozeti */
export function Bad({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  const d = r * 0.38;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 2} fill="#fff" />
      <circle cx={x} cy={y} r={r} fill={K.danger} />
      <path d={`M${x - d} ${y - d}L${x + d} ${y + d}M${x + d} ${y - d}L${x - d} ${y + d}`} stroke="#fff" stroke-width={r * 0.26} stroke-linecap="round" />
    </g>
  );
}

/** Turuncu eylem oku. bend ≠ 0 ise kavisli (pozitif = gidiş yönünün soluna/yukarı doğru kavis). */
export function Arrow({ from, to, bend = 0, w = 6, color = K.action, head = 1 }: { from: P; to: P; bend?: number; w?: number; color?: string; head?: number }) {
  const mid = lerp(from, to, 0.5);
  const len = dist(from, to);
  const n = dv(angOf(sub(to, from)) - 90);
  const c = add(mid, mul(n, bend * len));
  const tang = bend ? angOf(sub(to, c)) : angOf(sub(to, from));
  const hl = (w * 2.3 + 4) * head;
  const base = pol(to, tang, -hl * 0.8);
  const end = pol(to, tang, -hl * 0.6);
  const d = bend ? `M${pt(from)}Q${pt(lerp(c, end, 0.08))} ${pt(end)}` : `M${pt(from)}L${pt(end)}`;
  const hp = `M${pt(to)}L${pt(pol(base, tang + 90, hl * 0.62))}L${pt(pol(base, tang - 90, hl * 0.62))}Z`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={w + 3} />
      <path d={hp} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} fill="none" stroke={color} stroke-width={w} />
      <path d={hp} fill={color} />
    </g>
  );
}

/** Kısa etiket (112, 20 dk…) — yuvarlak kenarlı hap içinde */
export function Label({ x, y, text, size = 16, bg = K.action, color, anchor = 'middle' }: { x: number; y: number; text: string; size?: number; bg?: string | null; color?: string; anchor?: 'start' | 'middle' | 'end' }) {
  const w = text.length * size * 0.62 + size * 0.9;
  const h = size * 1.45;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const fg = color ?? (bg === K.action || bg === K.white || bg === '#fff' || !bg ? K.ink : '#fff');
  return (
    <g>
      {bg && <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={bg} stroke={K.out} stroke-width={1.5} />}
      <text x={x0 + w / 2} y={y + size * 0.36} fill={fg} font-size={size} font-weight={700} text-anchor="middle" font-family="'IBM Plex Sans', system-ui, sans-serif">
        {text}
      </text>
    </g>
  );
}

/** Ses / sinyal / nefes dalgaları: a yönüne doğru açılan yaylar */
export function Waves({ x, y, n = 3, a = 0, r = 6, color = K.action, w = 2.6 }: { x: number; y: number; n?: number; a?: number; r?: number; color?: string; w?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`} fill="none" stroke={color} stroke-width={w} stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const rr = r * (i + 1);
        const q = rr * 0.7;
        return <path key={i} d={`M${f1(q * 0.6)} ${f1(-q)}A${f1(rr)} ${f1(rr)} 0 0 1 ${f1(q * 0.6)} ${f1(q)}`} />;
      })}
    </g>
  );
}

/** Saat simgesi + isteğe bağlı yazı ("20 dk") */
export function Timer({ x, y, r = 14, text }: { x: number; y: number; r?: number; text?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke={K.out} stroke-width={2} />
      <rect x={x - 3} y={y - r - 5} width={6} height={4} rx={1} fill={K.out} />
      <path d={`M${x} ${y - r * 0.62}V${y}L${x + r * 0.45} ${y + r * 0.25}`} fill="none" stroke={K.action} stroke-width={2.4} stroke-linecap="round" stroke-linejoin="round" />
      {text && <Label x={x + r + 6} y={y} text={text} size={13} anchor="start" />}
    </g>
  );
}

/** Sarsıntı / hareket çizgileri (bir nesnenin iki yanında) */
export function Shake({ x1, x2, y, h = 24, color = K.ink }: { x1: number; x2: number; y: number; h?: number; color?: string }) {
  const a = h / 2;
  return (
    <g fill="none" stroke={color} stroke-width={2.4} stroke-linecap="round" opacity={0.75}>
      <path d={`M${x1} ${y - a}Q${x1 - 6} ${y} ${x1} ${y + a}M${x1 - 7} ${y - a * 0.6}Q${x1 - 12} ${y} ${x1 - 7} ${y + a * 0.6}`} />
      <path d={`M${x2} ${y - a}Q${x2 + 6} ${y} ${x2} ${y + a}M${x2 + 7} ${y - a * 0.6}Q${x2 + 12} ${y} ${x2 + 7} ${y + a * 0.6}`} />
    </g>
  );
}

/* ════════════════════════════ NESNELER ════════════════════════════ */
// Ortak kural: x,y çoğunlukla nesnenin TABAN ORTASI (zemine oturan nokta); s ölçek; a dönüş.
// Aksi belirtilmişse (sol üst / merkez) açıklamada yazar.

const tr = (x: number, y: number, s = 1, a = 0) => `translate(${f1(x)} ${f1(y)})${a ? ` rotate(${a})` : ''}${s !== 1 ? ` scale(${s})` : ''}`;
const G = ({ x, y, s = 1, a = 0, children }: { x: number; y: number; s?: number; a?: number; children: ComponentChildren }) => <g transform={tr(x, y, s, a)}>{children}</g>;

/** Akıllı telefon (MERKEZ x,y). text = ekrandaki büyük yazı (ör. "112"); call: yeşil arama düğmesi */
export function Phone({ x, y, s = 1, a = 0, text, call = true, color = K.ink }: { x: number; y: number; s?: number; a?: number; text?: string; call?: boolean; color?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG sh={[{ d: rrect(-19, -36, 38, 72, 7), f: '#2f3542' }]} ow={OW / Math.max(s, 0.4)} />
      <rect x={-16} y={-31} width={32} height={58} rx={3} fill="#eaf4fb" />
      <rect x={-5} y={-34} width={10} height={1.6} rx={0.8} fill="#596273" />
      {text && (
        <text x={0} y={call ? -4 : 4} text-anchor="middle" font-size={text.length > 3 ? 10 : 13.5} font-weight={700} fill={color} font-family="'IBM Plex Sans', system-ui, sans-serif">
          {text}
        </text>
      )}
      {call && (
        <g>
          <circle cx={0} cy={14} r={7} fill={K.safe} />
          <path d="M-3.2 10.8c.6-.6 1.4-.4 1.7.2l.7 1.4c.2.5 0 1-.4 1.3l-.4.3c.4 1 1.3 1.9 2.3 2.3l.3-.4c.3-.4.9-.6 1.3-.4l1.4.7c.6.3.8 1.1.2 1.7-.9.9-2.2 1.1-3.3.5-1.6-.9-3-2.3-3.9-3.9-.6-1.1-.4-2.4.5-3.3z" fill="#fff" />
        </g>
      )}
    </G>
  );
}

/** Masa (yan görünüş). x = SOL, y = zemin. */
export function Table({ x, y, w = 130, h = 66, color = K.wood }: { x: number; y: number; w?: number; h?: number; color?: string }) {
  const sd = shade(color, 0.22);
  return (
    <OG
      sh={[
        { d: rrect(x + w - 26, y - h + 8, 9, h - 8, 2), f: sd },
        { d: rrect(x + 17, y - h + 8, 9, h - 8, 2), f: sd },
        { d: rrect(x + 6, y - h + 8, 10, h - 8, 2), f: color },
        { d: rrect(x + w - 16, y - h + 8, 10, h - 8, 2), f: color },
        { d: rrect(x + 4, y - h + 8, w - 8, 7, 1), f: sd },
        { d: rrect(x, y - h, w, 10, 3), f: color },
        { d: `M${x + 4} ${y - h + 3}H${x + w - 4}`, st: tint(color, 0.3), sw: 1.6 },
      ]}
    />
  );
}

/** Sandalye (yan görünüş, sırtlık solda). x = oturak ortası, y = zemin. seat = oturak yüksekliği */
export function Chair({ x, y, seat = 44, s = 1, flip, color = K.wood }: { x: number; y: number; seat?: number; s?: number; flip?: boolean; color?: string }) {
  const sd = shade(color, 0.22);
  const w = 34 * s;
  return (
    <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <OG
        sh={[
          { d: rrect(x - w / 2 + 2, y - seat, 5 * s, seat, 1.5), f: sd },
          { d: rrect(x + w / 2 - 7 * s, y - seat, 5 * s, seat, 1.5), f: color },
          { d: rrect(x - w / 2, y - seat - 46 * s, 6 * s, 50 * s, 2), f: color },
          { d: rrect(x - w / 2, y - seat - 46 * s, 14 * s, 7 * s, 2), f: color },
          { d: rrect(x - w / 2, y - seat - 3, w, 7 * s, 2), f: color },
        ]}
      />
    </g>
  );
}

/** Kapı (karşıdan). x = SOL, y = zemin. open: aralık kapı */
export function Door({ x, y, w = 58, h = 112, color = '#a8724a', open }: { x: number; y: number; w?: number; h?: number; color?: string; open?: boolean }) {
  const fr = '#efe9df';
  const sh: Sh[] = [{ d: rrect(x - 5, y - h - 5, w + 10, h + 5, 2), f: fr }];
  if (open) {
    sh.push({ d: rrect(x, y - h, w, h, 1), f: '#3a3530' });
    sh.push({ d: `M${x} ${y - h}L${x + w * 0.45} ${y - h + 8}L${x + w * 0.45} ${y + 4}L${x} ${y}Z`, f: color });
  } else {
    sh.push({ d: rrect(x, y - h, w, h, 1), f: color });
    sh.push({ d: rrect(x + 8, y - h + 10, w - 16, h * 0.36, 2), f: shade(color, 0.1), ln: true });
    sh.push({ d: rrect(x + 8, y - h * 0.5, w - 16, h * 0.4, 2), f: shade(color, 0.1), ln: true });
    sh.push({ d: circ([x + w - 9, y - h * 0.52], 3), f: '#e2c35a', ln: true });
  }
  return <OG sh={sh} />;
}

/** Pencere. x,y = SOL ÜST. view: dışarısı ('day' | 'night'); broken: kırık cam */
export function Window({ x, y, w = 70, h = 58, view = 'day', broken }: { x: number; y: number; w?: number; h?: number; view?: 'day' | 'night'; broken?: boolean }) {
  const glass = view === 'night' ? '#2c3a5c' : '#bfe3f5';
  return (
    <g>
      <OG
        sh={[
          { d: rrect(x, y, w, h, 2), f: '#f4f1ea' },
          { d: rrect(x + 5, y + 5, w - 10, h - 10, 1), f: glass, ln: true },
          { d: `M${x + w / 2} ${y + 5}V${y + h - 5}M${x + 5} ${y + h / 2}H${x + w - 5}`, st: '#f4f1ea', sw: 4 },
          { d: rrect(x - 5, y + h - 2, w + 10, 7, 2), f: '#f4f1ea' },
        ]}
      />
      {!broken && <path d={`M${x + 10} ${y + 18}L${x + 18} ${y + 10}M${x + 10} ${y + 25}L${x + 25} ${y + 10}`} stroke="#fff" stroke-width={2} opacity={0.7} stroke-linecap="round" />}
      {broken && <path d={`M${x + w * 0.3} ${y + h * 0.3}l6 8l-9 6l10 5M${x + w * 0.3} ${y + h * 0.3}l12 -6M${x + w * 0.3} ${y + h * 0.3}l-8 -10`} stroke={K.out} stroke-width={1.3} fill="none" stroke-linejoin="round" />}
    </g>
  );
}

/** Duvar parçası. x = SOL, y = zemin. kind: 'plain' | 'brick' | 'crack' */
export function Wall({ x, y, w = 40, h = 120, color = '#d8cdb9', kind = 'plain' }: { x: number; y: number; w?: number; h?: number; color?: string; kind?: 'plain' | 'brick' | 'crack' }) {
  const lines: JSX.Element[] = [];
  if (kind === 'brick') {
    for (let r = 0, yy = y - 12; yy > y - h; yy -= 12, r++) {
      lines.push(<path key={'h' + r} d={`M${x} ${yy}H${x + w}`} />);
      for (let xx = x + (r % 2 ? 10 : 22); xx < x + w; xx += 24) lines.push(<path key={'v' + r + xx} d={`M${xx} ${yy}V${yy + 12}`} />);
    }
  }
  return (
    <g>
      <OG sh={[{ d: rrect(x, y - h, w, h, 1), f: color }, { d: rrect(x + w - 6, y - h, 6, h, 1), f: shade(color, 0.12), no: true }]} />
      <g stroke={shade(color, 0.25)} stroke-width={1.2}>{lines}</g>
      {kind === 'crack' && <path d={`M${x + w * 0.4} ${y - h}l6 18l-8 12l9 16l-5 14l7 12`} fill="none" stroke={K.out} stroke-width={2} stroke-linejoin="round" />}
    </g>
  );
}

/** Merdiven (yan görünüş). x = alt basamağın SOL'u, y = zemin; dir=1 sağa doğru çıkar */
export function Stairs({ x, y, n = 5, sw = 24, sh = 16, dir = 1, color = '#cfc4b2' }: { x: number; y: number; n?: number; sw?: number; sh?: number; dir?: 1 | -1; color?: string }) {
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) d += `V${y - (i + 1) * sh}h${dir * sw}`;
  d += `V${y}Z`;
  const edges = Array.from({ length: n }, (_, i) => `M${x + dir * i * sw} ${y - (i + 1) * sh}h${dir * sw}`).join('');
  return (
    <g>
      <OG sh={[{ d, f: color }]} />
      <path d={edges} stroke={shade(color, 0.25)} stroke-width={3} />
    </g>
  );
}

/** Yatak (yan görünüş). x = SOL, y = zemin */
export function Bed({ x, y, w = 160, blanket = '#7aa6d6' }: { x: number; y: number; w?: number; blanket?: string }) {
  return (
    <OG
      sh={[
        { d: rrect(x, y - 62, 10, 62, 2), f: K.wood },
        { d: rrect(x + w - 8, y - 40, 8, 40, 2), f: K.wood },
        { d: rrect(x + 4, y - 30, w - 8, 14, 2), f: shade(K.wood, 0.15) },
        { d: rrect(x + 8, y - 42, w - 14, 14, 4), f: '#f4f1ea' },
        { d: rrect(x + 12, y - 52, 34, 12, 6), f: '#fff' },
        { d: `M${x + 50} ${y - 44}Q${x + 50} ${y - 50} ${x + 58} ${y - 50}H${x + w - 10}V${y - 28}H${x + 50}Z`, f: blanket },
      ]}
    />
  );
}

/** Ağaç. kind 'leaf' (yapraklı) | 'pine' (çam). x = gövde dibi, y = zemin. s=1 ≈ 110 birim boy */
export function Tree({ x, y, s = 1, kind = 'leaf', color }: { x: number; y: number; s?: number; kind?: 'leaf' | 'pine'; color?: string }) {
  if (kind === 'pine') {
    const c = color ?? K.pine;
    const sd = shade(c, 0.18);
    return (
      <G x={x} y={y} s={s}>
        <OG
          sh={[
            { d: 'M-5 0L-4 -26H4L5 0Z', f: K.trunk, k: s },
            { d: 'M0 -112L-18 -78H18Z', f: c, k: s },
            { d: 'M0 -92L-26 -52H26Z', f: c, k: s },
            { d: 'M0 -68L-34 -22H34Z', f: c, k: s },
            { d: 'M0 -68L34 -22H8Z', f: sd, no: true },
            { d: 'M0 -92L26 -52H6Z', f: sd, no: true },
            { d: 'M0 -112L18 -78H4Z', f: sd, no: true },
          ]}
          ow={OW / s}
        />
      </G>
    );
  }
  const c = color ?? K.leaf;
  return (
    <G x={x} y={y} s={s}>
      <OG
        sh={[
          { d: 'M-6 0L-4.5 -44L-14 -60L-11 -62L-3 -52L0 -66L4 -52L12 -62L14 -59L4.5 -44L6 0Z', f: K.trunk },
          { d: circ([-18, -70], 22), f: c },
          { d: circ([18, -72], 22), f: c },
          { d: circ([0, -90], 26), f: c },
          { d: 'M30 -64A22 22 0 0 1 -2 -55A26 26 0 0 0 22 -82A22 22 0 0 1 30 -64Z', f: shade(c, 0.18), no: true },
          { d: 'M-10 -98A9 9 0 0 1 4 -106', st: tint(c, 0.35), sw: 3 },
        ]}
        ow={OW / s}
      />
    </G>
  );
}

/** Kaya. x = taban ortası, y = zemin */
export function Rock({ x, y, s = 1, color = K.rock }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[{ d: 'M-22 0L-19 -12L-8 -21L6 -20L17 -12L23 0Z', f: color }, { d: 'M6 -20L17 -12L23 0H4L8 -10Z', f: shade(color, 0.15), no: true }]} />
    </G>
  );
}

/** Su (dere/göl/sel). x,y = SOL ÜST (su yüzeyi), w×h; dalgalı üst kenar ve parıltı çizgileri */
export function Water({ x, y, w, h, color = K.water }: { x: number; y: number; w: number; h: number; color?: string }) {
  let top = `M${x} ${y}`;
  for (let xx = x; xx < x + w; xx += 20) top += `q5 -3 10 0t10 0`;
  const d = `${top}V${y + h}H${x}Z`;
  return (
    <g>
      <OG sh={[{ d, f: color }]} />
      <g stroke={K.waterLight} stroke-width={2} stroke-linecap="round" opacity={0.8}>
        {Array.from({ length: Math.max(2, Math.floor(w / 50)) }, (_, i) => (
          <path key={i} d={`M${x + 14 + i * 50 + (i % 2) * 12} ${y + 8 + (i % 3) * (h / 4)}h${14}`} />
        ))}
      </g>
    </g>
  );
}

/** Alev. x,y = alevin tabanı */
export function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M0 0C-17 0-23-13-17-26C-13-35-5-37-6-50C4-43 9-34 7-25C11-28 13-32 13-37C21-27 21-12 15-5C11-1 6 0 0 0Z" fill={K.fireRed} />
      <path d="M0 0C-11 0-14-8-10-16C-7-22-2-23-2-31C4-26 7-20 5-13C8-15 9-17 9-20C13-14 13-6 9-3C6 -0.5 3 0 0 0Z" fill={K.fire} />
      <path d="M0 0C-5 0-7-4-5-8C-3-11 0-11 0-16C3-13 5-9 4-5C3-2 2 0 0 0Z" fill={K.fireCore} />
    </G>
  );
}

/** Kamp ateşi (taşlar + odunlar + alev). x,y = taban ortası */
export function Campfire({ x, y, s = 1, fire = true }: { x: number; y: number; s?: number; fire?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: capsule([-20, -2], 4, [16, -10], 4), f: K.trunk },
          { d: capsule([-16, -10], 4, [20, -2], 4), f: shade(K.trunk, 0.15) },
          ...[-26, -14, 0, 14, 26].map((sx) => ({ d: ell([sx, -1], 7, 5), f: K.rock })),
        ]}
      />
      {fire && <Flame x={0} y={-8} s={0.75} />}
    </G>
  );
}

/** Kamp ocağı (tüplü). x,y = taban ortası. Üstüne Pot konur: y - 26·s */
export function Stove({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: rrect(-13, -20, 26, 20, 4), f: K.red },
          { d: rrect(-9, -24, 18, 5, 1.5), f: K.metal },
          { d: 'M-16 -26H16', st: K.out, sw: 3 },
        ]}
      />
      <path d="M-7 -24c0-3 3-4 2-7c3 2 3 4 2 6M3 -24c0-3 3-4 2-7c3 2 3 4 2 6" fill="#5aa9ff" />
    </G>
  );
}

/** Tencere. x,y = taban ortası. boil: kabarcık ve buhar */
export function Pot({ x, y, s = 1, boil = true, color = '#8e99a6' }: { x: number; y: number; s?: number; boil?: boolean; color?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: capsule([-27, -24], 3, [-20, -24], 3), f: shade(color, 0.2) },
          { d: capsule([20, -24], 3, [27, -24], 3), f: shade(color, 0.2) },
          { d: 'M-21 -28H21L19 -3Q19 0 16 0H-16Q-19 0 -19 -3Z', f: color },
          { d: 'M10 -28H21L19 -3Q19 0 16 0H8Z', f: shade(color, 0.14), no: true },
          { d: ell([0, -28], 21, 4.5), f: K.water },
        ]}
      />
      {boil && (
        <g>
          <g fill={K.waterLight}>
            <circle cx={-8} cy={-29} r={2} />
            <circle cx={4} cy={-28} r={2.6} />
            <circle cx={12} cy={-29.5} r={1.6} />
          </g>
          <g fill="none" stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.9}>
            <path d="M-8 -36c-4-5 4-8 0-14" />
            <path d="M3 -38c-4-5 4-8 0-14" />
            <path d="M13 -36c-4-5 4-8 0-14" />
          </g>
        </g>
      )}
    </G>
  );
}

/** Duman. kind 'layer' (varsayılan): tavandan sarkan katman, x,y = SOL ÜST, w×h.
 *  kind 'cloud': havada süzülen bulut/duman topağı, x,y = SOL ÜST, w×h. */
export function Smoke({ x, y, w = 120, h = 40, op = 0.92, color = K.smoke, kind = 'layer' }: { x: number; y: number; w?: number; h?: number; op?: number; color?: string; kind?: 'layer' | 'cloud' }) {
  const n = Math.max(3, Math.round(w / 26));
  const st = w / n;
  const dk = shade(color, 0.15);
  if (kind === 'cloud') {
    const r = h / 2;
    return (
      <g opacity={op}>
        <rect x={x + r * 0.6} y={y + h * 0.35} width={w - r * 1.2} height={h * 0.55} rx={h * 0.27} fill={dk} />
        {Array.from({ length: n }, (_, i) => (
          <circle key={i} cx={x + st * (i + 0.5)} cy={y + h * 0.5 - (i % 2 ? 0 : h * 0.12)} r={Math.min(st * 0.7, r * 0.75) + (i % 2) * 2} fill={color} />
        ))}
        <rect x={x + r * 0.5} y={y + h * 0.45} width={w - r} height={h * 0.3} fill={color} />
      </g>
    );
  }
  return (
    <g opacity={op}>
      <rect x={x} y={y} width={w} height={h * 0.6} fill={color} />
      {Array.from({ length: n }, (_, i) => (
        <circle key={'a' + i} cx={x + st * (i + 0.5)} cy={y + h * 0.6} r={st * 0.62 + (i % 2) * 3} fill={dk} />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <circle key={'b' + i} cx={x + st * (i + 0.5) - 3} cy={y + h * 0.55 - 3} r={st * 0.55 + (i % 2) * 3} fill={color} />
      ))}
    </g>
  );
}

/** Çadır. x,y = taban ortası */
export function Tent({ x, y, s = 1, color = '#e0813c' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-48 0L-4 -56L48 0Z', f: color },
          { d: 'M-4 -56L48 0H20Z', f: shade(color, 0.18), no: true },
          { d: 'M-4 -56L-16 0H8Z', f: shade(color, 0.5), ln: true },
          { d: 'M-4 -56L-6 -64', st: K.out, sw: 2 },
        ]}
      />
    </G>
  );
}

/** Sırt çantası. x,y = çantanın ÜST ORTASI (sırta takılırken rig.back yakını); side görünüşte
 *  sırtın arkasına oturur. flip: sola bakan kişi için */
export function Backpack({ x, y, s = 1, color = '#c0603e', flip, a = 0 }: { x: number; y: number; s?: number; color?: string; flip?: boolean; a?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-14 4C-16 0 -12 -3 -6 -3H4C9 -3 11 0 10 4L8 40Q7 44 2 44H-12Q-17 44 -17 40Z', f: color },
          { d: 'M10 4L8 40Q7 44 2 44H-2L2 4Z', f: shade(color, 0.16), no: true },
          { d: rrect(-21, 16, 10, 22, 3), f: shade(color, 0.1) },
          { d: 'M-15 6Q-4 1 9 6', st: shade(color, 0.35), sw: 1.4 },
        ]}
      />
    </g>
  );
}

/** Su şişesi. x,y = taban ortası. fill: 0..1 doluluk */
export function Bottle({ x, y, s = 1, a = 0, fill = 0.7, color = '#d9eef8' }: { x: number; y: number; s?: number; a?: number; fill?: number; color?: string }) {
  const h = 38;
  const wl = -h * fill;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-9 -2V-30Q-9 -36 -4 -38V-42H4V-38Q9 -36 9 -30V-2Q9 0 7 0H-7Q-9 0 -9 -2Z', f: color },
          { d: `M-9 ${wl}H9V-2Q9 0 7 0H-7Q-9 0 -9 -2Z`, f: K.water, no: true },
          { d: rrect(-5, -48, 10, 7, 1.5), f: K.safe },
          { d: 'M-5 -30V-8', st: '#fff', sw: 2 },
        ]}
      />
    </G>
  );
}

/** İlk yardım çantası. x,y = taban ortası */
export function FirstAidKit({ x, y, s = 1, open }: { x: number; y: number; s?: number; open?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-9 -36V-42Q-9 -45 -6 -45H6Q9 -45 9 -42V-36', st: K.out, sw: 3.4 },
          { d: rrect(-28, -38, 56, 38, 5), f: K.red },
          { d: rrect(-28, -38, 56, 8, 4), f: shade(K.red, 0.15) },
          { d: 'M-5 -27H5V-21H11V-11H5V-5H-5V-11H-11V-21H-5Z', f: '#fff', no: true },
        ]}
      />
      {open && <rect x={-24} y={-48} width={48} height={10} rx={2} fill="#fff" stroke={K.out} />}
    </G>
  );
}

/** Sargı bezi rulosu (açılmış ucu ile). x,y = taban ortası */
export function Bandage({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M0 -4H40Q44 -4 44 0H0Z', f: K.cloth },
          { d: circ([0, -12], 12), f: K.cloth },
          { d: circ([0, -12], 4), f: shade(K.cloth, 0.15), ln: true },
        ]}
      />
    </G>
  );
}

/** Bez / gazlı bez / havlu. MERKEZ x,y; a dönüş; wet: ıslak (damla) */
export function Cloth({ x, y, w = 40, h = 26, a = 0, color = K.cloth, wet }: { x: number; y: number; w?: number; h?: number; a?: number; color?: string; wet?: boolean }) {
  const c = wet ? mix(color, K.waterLight, 0.35) : color;
  return (
    <g>
      <G x={x} y={y} a={a}>
        <OG
          sh={[
            { d: `M${-w / 2} ${-h / 2 + 2}Q${-w / 4} ${-h / 2 - 1} 0 ${-h / 2 + 1}T${w / 2} ${-h / 2}V${h / 2 - 1}Q${w / 4} ${h / 2 + 2} 0 ${h / 2}T${-w / 2} ${h / 2}Z`, f: c },
            { d: `M${-w / 2 + 4} ${-h / 6}H${w / 2 - 4}M${-w / 2 + 4} ${h / 6}H${w / 2 - 4}`, st: shade(c, 0.14), sw: 1.2 },
          ]}
        />
      </G>
      {wet && (
        <g fill={K.water}>
          <Drop x={x - w * 0.2} y={y + h / 2 + 9} s={0.7} />
          <Drop x={x + w * 0.15} y={y + h / 2 + 15} s={0.6} />
        </g>
      )}
    </g>
  );
}

/** Su damlası. x,y = damlanın merkezi */
export function Drop({ x, y, s = 1, color = K.water }: { x: number; y: number; s?: number; color?: string }) {
  return <path transform={tr(x, y, s)} d="M0 -9C3 -4 6 -1 6 3A6 6 0 0 1 -6 3C-6 -1 -3 -4 0 -9Z" fill={color} stroke={K.out} stroke-width={1.2 / s} />;
}

/** Kan (damla + leke). x,y = leke merkezi */
export function Blood({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-14 0C-14 -4 -6 -6 0 -5C8 -6 15 -3 13 1C11 5 2 4 -4 5C-10 6 -14 4 -14 0Z" fill={K.blood} />
      <path d="M18 -14C20 -10 22 -8 22 -5A4 4 0 0 1 14 -5C14 -8 16 -10 18 -14Z" fill={K.blood} />
    </G>
  );
}

/** Battaniye örtüsü (yatan birinin üstüne). x1..x2 arası, y = zemin, h = kabarıklık. foil: termal folyo */
export function Blanket({ x1, x2, y, h = 22, color = '#c1554b', foil }: { x1: number; x2: number; y: number; h?: number; color?: string; foil?: boolean }) {
  const c = foil ? K.foil : color;
  const w = x2 - x1;
  const d = `M${x1} ${y}C${x1} ${y - h * 0.9} ${x1 + w * 0.15} ${y - h} ${x1 + w * 0.3} ${y - h}C${x1 + w * 0.55} ${y - h * 1.05} ${x1 + w * 0.7} ${y - h * 0.55} ${x1 + w * 0.88} ${y - h * 0.6}C${x2 - 2} ${y - h * 0.55} ${x2} ${y - h * 0.3} ${x2} ${y}Z`;
  return (
    <g>
      <OG sh={[{ d, f: c }, { d: `M${x1 + w * 0.3} ${y - h + 3}L${x1 + w * 0.22} ${y - 2}M${x1 + w * 0.6} ${y - h * 0.8}L${x1 + w * 0.66} ${y - 2}`, st: shade(c, 0.2), sw: 1.6 }]} />
      {foil && <path d={`M${x1 + 8} ${y - h * 0.6}l8 -5l6 6l9 -7M${x1 + w * 0.5} ${y - h * 0.5}l7 5l7 -6`} stroke="#fff" stroke-width={1.5} fill="none" />}
    </g>
  );
}

/** Araba (yan görünüş, sağa bakar). x,y = taban ortası */
export function Car({ x, y, s = 1, color = '#d0473d' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-62 -12V-26Q-62 -30 -58 -31L-38 -34L-24 -50Q-21 -53 -16 -53H18Q23 -53 27 -49L40 -35L58 -32Q63 -31 63 -26V-12Q63 -8 59 -8H-58Q-62 -8 -62 -12Z', f: color },
          { d: 'M-32 -35L-20 -48H-2V-35Z', f: '#bfe3f5', ln: true },
          { d: 'M3 -35V-48H17Q21 -48 24 -45L33 -35Z', f: '#bfe3f5', ln: true },
          { d: 'M-62 -20H63V-12Q63 -8 59 -8H-58Q-62 -8 -62 -12Z', f: shade(color, 0.15), no: true },
          { d: circ([-38, -8], 11), f: '#30333b' },
          { d: circ([38, -8], 11), f: '#30333b' },
          { d: circ([-38, -8], 4.5), f: K.metal, ln: true },
          { d: circ([38, -8], 4.5), f: K.metal, ln: true },
          { d: rrect(54, -28, 8, 5, 2), f: '#ffe28a', ln: true },
        ]}
      />
    </G>
  );
}

/** Ev (dış cephe, karşıdan). x = SOL, y = zemin */
export function HouseExt({ x, y, w = 120, h = 80, color = '#f0dcc0', roof = '#c2583e' }: { x: number; y: number; w?: number; h?: number; color?: string; roof?: string }) {
  return (
    <OG
      sh={[
        { d: rrect(x, y - h, w, h, 1), f: color },
        { d: rrect(x + w * 0.72, y - h, w * 0.28, h, 1), f: shade(color, 0.1), no: true },
        { d: `M${x - 10} ${y - h + 2}L${x + w / 2} ${y - h - w * 0.36}L${x + w + 10} ${y - h + 2}Z`, f: roof },
        { d: rrect(x + w * 0.42, y - h * 0.55, w * 0.18, h * 0.55, 1), f: '#8a5a3a', ln: true },
        { d: rrect(x + w * 0.1, y - h * 0.7, w * 0.22, h * 0.28, 1), f: '#bfe3f5', ln: true },
        { d: rrect(x + w * 0.68, y - h * 0.7, w * 0.22, h * 0.28, 1), f: '#bfe3f5', ln: true },
      ]}
    />
  );
}

/** Bina kesiti (katlar görünür). x = SOL, y = zemin; floors kat, fh kat yüksekliği */
export function Building({ x, y, w = 140, floors = 3, fh = 46, color = '#e3d6c2' }: { x: number; y: number; w?: number; floors?: number; fh?: number; color?: string }) {
  const H = floors * fh;
  const sh: Sh[] = [{ d: rrect(x, y - H - 8, w, H + 8, 2), f: shade(color, 0.18) }];
  for (let i = 0; i < floors; i++) {
    const fy = y - i * fh;
    sh.push({ d: rrect(x + 6, fy - fh + 2, w - 12, fh - 8, 1), f: color, ln: true });
    sh.push({ d: rrect(x + w * 0.62, fy - fh + 10, w * 0.22, fh * 0.4, 1), f: '#bfe3f5', ln: true });
  }
  sh.push({ d: `M${x - 6} ${y - H - 8}L${x + w / 2} ${y - H - 30}L${x + w + 6} ${y - H - 8}Z`, f: '#b5563f' });
  return <OG sh={sh} />;
}

/** Pusula. MERKEZ x,y */
export function Compass({ x, y, r = 22 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#c9a24a' }, { d: circ([x, y], r * 0.8), f: '#fbfaf5', ln: true }]} />
      <path d={`M${x} ${y - r * 0.68}L${x + r * 0.16} ${y}H${x - r * 0.16}Z`} fill={K.danger} />
      <path d={`M${x} ${y + r * 0.68}L${x + r * 0.16} ${y}H${x - r * 0.16}Z`} fill="#8b93a1" />
      <circle cx={x} cy={y} r={r * 0.08} fill={K.ink} />
    </g>
  );
}

/** Katlanmış harita. x,y = SOL ÜST */
export function MapProp({ x, y, w = 90, h = 64 }: { x: number; y: number; w?: number; h?: number }) {
  const t = w / 3;
  return (
    <g>
      <OG
        sh={[
          { d: `M${x} ${y + 4}L${x + t} ${y}L${x + 2 * t} ${y + 4}L${x + w} ${y}V${y + h}L${x + 2 * t} ${y + h + 4}L${x + t} ${y + h}L${x} ${y + h + 4}Z`, f: '#f1e6c8' },
          { d: `M${x + t} ${y}L${x + 2 * t} ${y + 4}V${y + h + 4}L${x + t} ${y + h}Z`, f: '#e2d4ad', no: true },
        ]}
      />
      <path d={`M${x + 8} ${y + h - 10}C${x + 25} ${y + h - 30} ${x + 45} ${y + 30} ${x + w - 18} ${y + 18}`} fill="none" stroke={K.danger} stroke-width={2.2} stroke-dasharray="4 4" stroke-linecap="round" />
      <path d={`M${x + w - 18} ${y + 22}c-5-6-5-12 0-12s5 6 0 12z`} fill={K.danger} stroke={K.out} stroke-width={1} />
      <path d={`M${x + 4} ${y + 18}q10 6 20 0`} fill="none" stroke={K.water} stroke-width={3} />
    </g>
  );
}

/** Düdük. MERKEZ x,y */
export function Whistle({ x, y, s = 1, a = 0, color = K.action }: { x: number; y: number; s?: number; a?: number; color?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[{ d: 'M-20 -6H6A10 10 0 1 1 6 12H-6V4H-20Z', f: color }, { d: rrect(-6, -6, 6, 4, 1), f: K.ink, no: true }, { d: circ([12, 8], 3), f: 'none', st: K.out, sw: 1.6 }]} />
    </G>
  );
}

/** El feneri. x,y = arka ucu; a yön (0 = sağa). beam: ışık huzmesi */
export function Flashlight({ x, y, s = 1, a = 0, beam = true }: { x: number; y: number; s?: number; a?: number; beam?: boolean }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      {beam && <path d="M40 -9L140 -40V40L40 9Z" fill="#fff3b0" opacity={0.55} />}
      <OG ow={OW / s} sh={[{ d: rrect(0, -6, 30, 12, 3), f: '#3d4250' }, { d: 'M28 -7L40 -11V11L28 7Z', f: '#4a505f' }, { d: rrect(10, -8, 8, 3, 1), f: K.action }]} />
      <rect x={38} y={-10} width={3} height={20} fill="#fff7c2" />
    </G>
  );
}

/** Pilli/el dinamolu radyo. x,y = taban ortası. waves: yayın dalgaları */
export function Radio({ x, y, s = 1, waves = true }: { x: number; y: number; s?: number; waves?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M14 -40L34 -76', st: K.out, sw: 2.6 },
          { d: rrect(-36, -40, 72, 40, 6), f: '#3e6f8f' },
          { d: circ([-14, -20], 12), f: '#2b3946', ln: true },
          { d: rrect(6, -32, 24, 10, 2), f: '#ffe7a3', ln: true },
          { d: circ([24, -11], 5), f: K.action, ln: true },
        ]}
      />
      <g fill="#4d5d6c">
        {[-19, -14, -9].map((xx) => [-25, -20, -15].map((yy) => <circle key={xx + ',' + yy} cx={xx} cy={yy} r={1.6} />))}
      </g>
      {waves && <Waves x={36} y={-74} n={3} a={-30} r={6} />}
    </G>
  );
}

/** Baston (yaşlı yürüme sopası). top = tutamak, bottom = yere değen uç */
export function Cane({ top, bottom, color = '#7b4e2e' }: { top: P; bottom: P; color?: string }) {
  const a = angOf(sub(top, bottom));
  const hook = pol(top, a + 90, 9);
  return <OG sh={[{ d: `M${pt(bottom)}L${pt(top)}Q${pt(pol(top, a, 6))} ${pt(hook)}`, st: color, sw: 4 }, { d: `M${pt(bottom)}L${pt(top)}Q${pt(pol(top, a, 6))} ${pt(hook)}`, f: 'none', st: K.out, sw: 7 }].reverse()} />;
}

/** Konuşma balonu. x,y = SOL ÜST, w×h; tail = kuyruğun ucu (konuşanın ağzına doğru). İçine kısa yazı
 *  ya da Waves konabilir (children, sahne koordinatında). */
export function Bubble({ x, y, w = 70, h = 44, tail, text, children }: { x: number; y: number; w?: number; h?: number; tail?: P; text?: string; children?: ComponentChildren }) {
  const t = tail ?? [x + w * 0.2, y + h + 14];
  const bx = Math.max(x + 10, Math.min(x + w - 22, t[0] - 6));
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, Math.min(16, h / 2)), f: '#fff' }, { d: `M${f1(bx)} ${f1(y + h - 2)}L${pt(t)}L${f1(bx + 14)} ${f1(y + h - 2)}Z`, f: '#fff' }]} />
      <path d={`M${f1(bx + 1.5)} ${f1(y + h - 1.5)}H${f1(bx + 12.5)}`} stroke="#fff" stroke-width={3} />
      {text && (
        <text x={x + w / 2} y={y + h / 2 + 6} text-anchor="middle" font-size={16} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">
          {text}
        </text>
      )}
      {children}
    </g>
  );
}

/** Direkli tabela (ör. yeşil toplanma alanı). x = direk dibi, y = zemin. icon 'people' = insan grubu simgesi */
export function Sign({ x, y, w = 64, h = 44, color = K.safe, text, icon, pole = 52 }: { x: number; y: number; w?: number; h?: number; color?: string; text?: string; icon?: 'people' | 'arrow'; pole?: number }) {
  const top = y - pole - h;
  const cx = x, cy = top + h / 2;
  return (
    <g>
      <OG sh={[{ d: rrect(x - 3, y - pole - 2, 6, pole + 2, 1.5), f: K.metal }, { d: rrect(x - w / 2, top, w, h, 5), f: color }, { d: rrect(x - w / 2 + 4, top + 4, w - 8, h - 8, 3), f: 'none', st: '#fff', sw: 2 }]} />
      {icon === 'people' && (
        <g fill="#fff">
          {[-13, 0, 13].map((dx, i) => (
            <g key={i}>
              <circle cx={cx + dx} cy={cy - 7 + (i === 1 ? -2 : 0)} r={4} />
              <path d={`M${cx + dx - 6} ${cy + 12}V${cy + 4 + (i === 1 ? -2 : 0)}Q${cx + dx - 6} ${cy - 2 + (i === 1 ? -2 : 0)} ${cx + dx} ${cy - 2 + (i === 1 ? -2 : 0)}Q${cx + dx + 6} ${cy - 2 + (i === 1 ? -2 : 0)} ${cx + dx + 6} ${cy + 4 + (i === 1 ? -2 : 0)}V${cy + 12}Z`} />
            </g>
          ))}
        </g>
      )}
      {icon === 'arrow' && <path d={`M${cx - 16} ${cy}H${cx + 10}M${cx + 2} ${cy - 9}L${cx + 12} ${cy}L${cx + 2} ${cy + 9}`} stroke="#fff" stroke-width={5} fill="none" stroke-linecap="round" stroke-linejoin="round" />}
      {text && (
        <text x={cx} y={cy + 5} text-anchor="middle" font-size={14} font-weight={700} fill="#fff" font-family="'IBM Plex Sans', system-ui, sans-serif">
          {text}
        </text>
      )}
    </g>
  );
}
