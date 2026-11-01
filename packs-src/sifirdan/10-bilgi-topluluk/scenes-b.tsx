// Sıfırdan paketi sahneleri (b). Bkz. docs/agents/SIFIRDAN_CIZIM.md
// Topluluk ve doğayla uzun yaşam rehberleri (patika, köprü, topluluk … orman).
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, Bottle, Campfire, Cane, Chair, Flame, Hand, HouseExt, K, Label, No, OG, OW, Ok, Person, POSE, Pot, Rock, Timer,
  Scene2, Table, Tent, Tree, Water, Waves, Whistle, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Pose, Rig, Sh } from '../../../src/art/kit2';

/* ═══════════════════════════ yardımcılar ═══════════════════════════ */

const f1 = (n: number) => Math.round(n * 10) / 10;
const R2D = 180 / Math.PI;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a / R2D) * l, p[1] + Math.sin(a / R2D) * l];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const owOf = (s: number) => OW * (0.75 + 0.25 * s);

const G = ({ x = 0, y = 0, s = 1, a = 0, fx = false, children }: { x?: number; y?: number; s?: number; a?: number; fx?: boolean; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${fx ? -s : s} ${s})`}>{children}</g>
);

function handAt(h: Omit<HandProps, 'x' | 'y'>, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): HandProps {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

/** Paket genelinde malzeme renkleri */
const M = {
  wood: K.wood,
  log: '#9a6a43',
  logEnd: '#e2bf8a',
  bark: '#7a4f31',
  iron: '#6f7782',
  stone: K.rock,
  soil: '#a7825a',
  soilDark: '#87653f',
  paper: '#f6f0e1',
  board: '#c49a68',
  sack: '#d8c08e',
  rope: '#c9a46a',
  canvas: '#e7dcc2',
};

/** İki uçlu ölçü oku (turuncu) */
function Dim({ a, b, w = 3, c = K.action }: { a: P; b: P; w?: number; c?: string }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * R2D;
  const hl = 9;
  const head = (p: P, dir: number) => {
    const t = pol(p, dir, hl);
    return `M${f1(p[0])} ${f1(p[1])}L${f1(pol(t, dir + 90, 5)[0])} ${f1(pol(t, dir + 90, 5)[1])}L${f1(pol(t, dir - 90, 5)[0])} ${f1(pol(t, dir - 90, 5)[1])}Z`;
  };
  const a2 = pol(a, ang, hl * 0.7), b2 = pol(b, ang + 180, hl * 0.7);
  const ln = `M${f1(a2[0])} ${f1(a2[1])}L${f1(b2[0])} ${f1(b2[1])}`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={ln} stroke={K.out} stroke-width={w + 3} fill="none" />
      <path d={head(a, ang) + head(b, ang + 180)} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={ln} stroke={c} stroke-width={w} fill="none" />
      <path d={head(a, ang) + head(b, ang + 180)} fill={c} />
    </g>
  );
}

/** Kesik çizgi */
const Dash = ({ a, b, c = K.action, w = 3, dash = '7 6' }: { a: P; b: P; c?: string; w?: number; dash?: string }) => (
  <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke={c} stroke-width={w} stroke-dasharray={dash} stroke-linecap="round" fill="none" />
);

/** Küçük yazı */
const Txt = ({ x, y, t, size = 11, c = K.ink, w = 700, anchor = 'middle' }: { x: number; y: number; t: string; size?: number; c?: string; w?: number; anchor?: 'start' | 'middle' | 'end' }) => (
  <text x={x} y={y} font-size={size} font-weight={w} fill={c} text-anchor={anchor} font-family="'IBM Plex Sans', system-ui, sans-serif">{t}</text>
);

/** Kütük: a→b, yarıçap r; uç halkası b ucunda (end=true) */
function Log({ a, b, r = 8, c = M.log, end = true }: { a: P; b: P; r?: number; c?: string; end?: boolean }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * R2D;
  return (
    <g>
      <OG sh={[{ d: capsule(a, r, b, r), f: c }, { d: capsule(pol(a, ang + 90, r * 0.45), r * 0.25, pol(b, ang + 90, r * 0.45), r * 0.25), f: shade(c, 0.15), no: true }]} />
      {end && <OG sh={[{ d: ell(b, r * 0.55, r), f: M.logEnd, t: `rotate(${f1(ang)} ${f1(b[0])} ${f1(b[1])})` }]} />}
    </g>
  );
}

/** Kazık (x = taban ortası, y = zemin) */
const Stake = ({ x, y, h = 30, c = M.wood }: { x: number; y: number; h?: number; c?: string }) => (
  <OG sh={[{ d: `M${x - 3} ${y - h}H${x + 3}V${y - 4}L${x} ${y + 3}L${x - 3} ${y - 4}Z`, f: c }]} />
);

/** Pano: ahşap çerçeveli kâğıt (TL) */
function Board({ x, y, w, h, children, legs = false }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; legs?: boolean }) {
  return (
    <g>
      {legs && <OG sh={[{ d: rrect(x + 14, y + h - 4, 8, 240 - y - h + 4, 2), f: shade(M.board, 0.2) }, { d: rrect(x + w - 22, y + h - 4, 8, 240 - y - h + 4, 2), f: shade(M.board, 0.2) }]} />}
      <OG sh={[{ d: rrect(x, y, w, h, 5), f: M.board }, { d: rrect(x + 7, y + 7, w - 14, h - 14, 3), f: M.paper }]} />
      {children}
    </g>
  );
}

/** Çizgili defter (açık, TL) */
function Notebook({ x, y, w = 90, h = 60, lines = 4, children }: { x: number; y: number; w?: number; h?: number; lines?: number; children?: ComponentChildren }) {
  const ls: string[] = [];
  for (let i = 1; i <= lines; i++) {
    const yy = y + (h * i) / (lines + 1);
    ls.push(`M${x + 6} ${f1(yy)}H${x + w / 2 - 5}M${x + w / 2 + 5} ${f1(yy)}H${x + w - 6}`);
  }
  return (
    <g>
      <OG sh={[{ d: rrect(x - 3, y - 2, w + 6, h + 5, 3), f: '#8a5a3c' }, { d: rrect(x, y, w / 2, h, 2), f: M.paper }, { d: rrect(x + w / 2, y, w / 2, h, 2), f: M.paper }]} />
      <path d={ls.join('')} stroke="#9fb0c4" stroke-width={1.3} />
      {children}
    </g>
  );
}

/** Kalem (uç → arka) */
const Pencil = ({ tip, a = -120, l = 34 }: { tip: P; a?: number; l?: number }) => {
  const e = pol(tip, a, l), m = pol(tip, a, 7);
  return <OG sh={[{ d: capsule(m, 2.6, e, 2.6), f: '#f2c14e' }, { d: `M${f1(tip[0])} ${f1(tip[1])}L${f1(pol(m, a + 90, 2.6)[0])} ${f1(pol(m, a + 90, 2.6)[1])}L${f1(pol(m, a - 90, 2.6)[0])} ${f1(pol(m, a - 90, 2.6)[1])}Z`, f: '#e8c9a0' }]} />;
};

/* ── simgeler (x,y merkez, s ölçek ~ 1 = 24 birim) ── */
function Icon({ k, x, y, s = 1, c }: { k: string; x: number; y: number; s?: number; c?: string }) {
  let sh: Sh[] = [];
  switch (k) {
    case 'drop': sh = [{ d: 'M0 -11C5 -4 8 0 8 4A8 8 0 0 1 -8 4C-8 0 -5 -4 0 -11Z', f: c ?? K.water }]; break;
    case 'wheat':
      sh = [{ d: 'M0 12V-6', st: '#b5862f', sw: 2.2 },
        ...[-8, -2, 4].flatMap((yy) => [{ d: ell([-3.2, yy], 2.6, 4.2), f: '#e2b64a', t: `rotate(-25 -3.2 ${yy})` }, { d: ell([3.2, yy], 2.6, 4.2), f: '#e2b64a', t: `rotate(25 3.2 ${yy})` }]),
        { d: ell([0, -12], 2.4, 3.8), f: '#e2b64a' }];
      break;
    case 'plus': sh = [{ d: 'M-3.5 -10H3.5V-3.5H10V3.5H3.5V10H-3.5V3.5H-10V-3.5H-3.5Z', f: c ?? K.danger }]; break;
    case 'house': sh = [{ d: 'M-9 1H9V11H-9Z', f: '#f0dcc0' }, { d: 'M-12 2L0 -10L12 2Z', f: '#c2583e' }, { d: rrect(-2.5, 4, 5, 7, 1), f: '#8a5a3c' }]; break;
    case 'book': sh = [{ d: 'M-11 -8Q-5 -11 0 -7Q5 -11 11 -8V9Q5 6 0 10Q-5 6 -11 9Z', f: M.paper }, { d: 'M0 -7V10', st: K.out, sw: 1.2 }]; break;
    case 'child': sh = [{ d: circ([0, -6], 4.5), f: K.skin[1] }, { d: 'M-5 -1H5L6 11H-6Z', f: c ?? K.role.bystander3 }]; break;
    case 'person': sh = [{ d: circ([0, -7], 5), f: K.skin[1] }, { d: 'M-7 0Q0 -4 7 0L8 12H-8Z', f: c ?? K.role.helper }]; break;
    case 'hourglass': sh = [{ d: rrect(-9, -12, 18, 3, 1), f: M.wood }, { d: rrect(-9, 9, 18, 3, 1), f: M.wood }, { d: 'M-7 -9H7L1 0L7 9H-7L-1 0Z', f: '#dff1f8' }, { d: 'M-4 -6H4L0 -1Z', f: '#e2b64a', no: true }, { d: 'M-5 9L0 4L5 9Z', f: '#e2b64a', no: true }]; break;
    case 'sock': sh = [{ d: 'M-4 -11H5V2L9 5Q11 9 7 11H-3Q-6 10 -6 6Z', f: c ?? '#c6574e' }, { d: rrect(-5, -12, 11, 4, 1), f: '#f4f1ea' }]; break;
    case 'bread': sh = [{ d: 'M-11 5Q-12 -6 0 -7Q12 -6 11 5Z', f: '#d99a4e' }, { d: 'M-5 -4L-3 0M0 -5L2 -1M5 -4L7 0', st: shade('#d99a4e', 0.35), sw: 1.4 }]; break;
    case 'salt': sh = [{ d: 'M-7 -8H7L8 10H-8Z', f: '#f4f1ea' }, { d: rrect(-7, -12, 14, 5, 2), f: K.role.victim }, { d: 'M-3 -2H3M-3 3H3', st: '#9aa', sw: 1.2 }]; break;
    case 'basket': sh = [{ d: 'M-12 -2H12L9 10H-9Z', f: '#c49a52' }, { d: 'M-9 -2Q0 -16 9 -2', st: '#8a6a32', sw: 2.4 }, { d: 'M-10 3H10M-9 7H9', st: shade('#c49a52', 0.3), sw: 1.2 }]; break;
    case 'fist':
      sh = [{ d: rrect(-9, -8, 18, 15, 5), f: K.skin[1] }, { d: 'M-4 -8V-1M1 -8V-1M5.5 -8V-1', st: K.out, sw: 1.1 }, { d: rrect(-6, 6, 12, 8, 2), f: K.role.bystander4 }];
      break;
    case 'flag': sh = [{ d: 'M-6 12V-11', st: K.out, sw: 2.2 }, { d: 'M-6 -11H9L5 -5L9 1H-6Z', f: K.safe }]; break;
    case 'sun': sh = [{ d: circ([0, 0], 7), f: '#ffd64a' }]; break;
    case 'sack': sh = [{ d: 'M-8 -6Q-11 4 -9 10H9Q11 4 8 -6Z', f: M.sack }, { d: 'M-5 -6L-7 -11H7L5 -6Z', f: M.sack }, { d: 'M-6 -7H6', st: '#7a5a32', sw: 2 }]; break;
    case 'hammer': sh = [{ d: capsule([-6, 10], 2.4, [4, -6], 2.4), f: M.wood }, { d: rrect(-4, -13, 18, 8, 2), f: M.iron, t: 'rotate(32 5 -9)' }]; break;
    case 'needle': sh = [{ d: 'M-8 10L8 -10', st: '#6f7782', sw: 2.4 }, { d: 'M8 -10Q14 -4 4 2Q-6 8 0 12', st: K.danger, sw: 1.8 }]; break;
    default: break;
  }
  return <G x={x} y={y} s={s}><OG ow={OW / s} sh={sh} /></G>;
}

/** Fener (x,y = alt ortası) */
function Lantern({ x, y, s = 1, glow = true }: { x: number; y: number; s?: number; glow?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      {glow && <circle cx={0} cy={-12} r={26} fill="#ffd64a" opacity={0.22} />}
      <OG ow={OW / s} sh={[
        { d: 'M-5 -30Q0 -38 5 -30', st: K.out, sw: 1.8 },
        { d: rrect(-8, -28, 16, 4, 1.5), f: '#4c5563' },
        { d: rrect(-7, -24, 14, 19, 2), f: '#fff1b0' },
        { d: ell([0, -14], 3, 5), f: '#ffb02e', no: true },
        { d: rrect(-9, -5, 18, 5, 1.5), f: '#4c5563' },
      ]} />
    </G>
  );
}

/** Kütük bank (yan görünüş): x merkez, y zemin */
const LogBench = ({ x, y, w = 90, r = 10 }: { x: number; y: number; w?: number; r?: number }) => (
  <Log a={[x - w / 2, y - r]} b={[x + w / 2, y - r]} r={r} />
);

/** Tekerlekli sandalye (yan görünüş). r = oturan kişinin rig'i. Önce Back, sonra kişi, sonra Wheel */
const FRAME = '#4c5563';
function wcGeo(r: Rig, gy: number) {
  const s = r.s, f = r.flip ? -1 : 1;
  const X = (dx: number) => r.hip[0] + f * dx * s;
  const seatY = r.hip[1] + 7 * s;
  const R = (gy - seatY + 12 * s) / 2;
  const wc: P = [X(-6), gy - R];
  return { s, f, X, seatY, R, wc };
}
function WheelChairBack({ r, gy, color = '#2f6fb0' }: { r: Rig; gy: number; color?: string }) {
  const { s, f, X, seatY, R, wc } = wcGeo(r, gy);
  const hx = (a: number, b: number) => [Math.min(X(a), X(b)), Math.abs(X(b) - X(a))] as const;
  const [sx, sw] = hx(-18, 20);
  const topY = r.hip[1] - 44 * s;
  const ank = r.ankleF;
  const plate: P = [ank[0] + f * 3 * s, ank[1] + 6 * s];
  const far: P = [wc[0] + f * 3 * s, wc[1] - 1 * s];
  return (
    <g>
      <circle cx={far[0]} cy={far[1]} r={R} fill="none" stroke={K.out} stroke-width={6 * s} />
      <circle cx={far[0]} cy={far[1]} r={R - 5 * s} fill="none" stroke={shade(K.metal, 0.3)} stroke-width={1.6 * s} />
      <OG
        ow={owOf(s)}
        sh={[
          { d: capsule([X(-6), gy - 16 * s], 2 * s, [X(28), gy - 16 * s], 2 * s), f: FRAME },
          { d: capsule([X(24), seatY + 3 * s], 2 * s, [X(28), gy - 13 * s], 2 * s), f: FRAME },
          { d: circ([X(30), gy - 6 * s], 6 * s), f: '#30333b' },
          { d: circ([X(30), gy - 6 * s], 2 * s), f: K.metal, ln: true },
          { d: capsule([X(18), seatY + 4 * s], 2 * s, [plate[0] - f * 4 * s, plate[1]], 2 * s), f: FRAME },
          { d: rrect(Math.min(plate[0] - f * 9 * s, plate[0] + f * 9 * s), plate[1] - 1.5 * s, 18 * s, 4 * s, 1.5 * s), f: FRAME },
          { d: capsule([X(-16), seatY + 4 * s], 2.2 * s, [X(-20), topY], 2.2 * s), f: FRAME },
          { d: capsule([X(-20), topY], 2.2 * s, [X(-31), topY + 2 * s], 2.2 * s), f: FRAME },
          { d: capsule([X(-26), topY + 1 * s], 3 * s, [X(-33), topY + 2.2 * s], 3 * s), f: '#30333b' },
          { d: `M${f1(X(-15))} ${f1(seatY)}L${f1(X(-18.5))} ${f1(topY + 4 * s)}L${f1(X(-12))} ${f1(topY + 6 * s)}L${f1(X(-10))} ${f1(seatY - 4 * s)}Z`, f: color },
          { d: rrect(sx, seatY - 1 * s, sw, 6 * s, 2 * s), f: color },
        ]}
      />
    </g>
  );
}
function WheelChairWheel({ r, gy }: { r: Rig; gy: number }) {
  const { s, R, wc } = wcGeo(r, gy);
  const spokes: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = i * 30 + 15;
    const p1 = pol(wc, a, R - 3 * s), p2 = pol(wc, a + 180, R - 3 * s);
    spokes.push(`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`);
  }
  return (
    <g>
      <path d={spokes.join('')} stroke={shade(K.metal, 0.1)} stroke-width={1 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R} fill="none" stroke={K.out} stroke-width={7.5 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R} fill="none" stroke="#3a3d45" stroke-width={4.5 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R - 6 * s} fill="none" stroke={K.out} stroke-width={3.4 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R - 6 * s} fill="none" stroke={K.metal} stroke-width={1.8 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={4 * s} fill={K.metal} stroke={K.out} stroke-width={1.3} />
    </g>
  );
}
const WC_SIT: Pose = { spine: -92, armB: [80, 8], armF: [76, 4], legB: [4, 78], legF: [0, 76], footB: 0, footF: 0 };

/** Tekerlekli sandalyede kişi (tam çizim) */
function WheelChairPerson({ p, gy }: { p: PersonProps; gy: number }) {
  const r = rig(p);
  return (
    <g>
      <WheelChairBack r={r} gy={gy} />
      <Person {...p} />
      <WheelChairWheel r={r} gy={gy} />
    </g>
  );
}

/** Yan görünüş oturuş (bank/kütük üstü). Kalça = y - seat·s */
const SIT: Pose = { spine: -92, armB: [80, 10], armF: [76, 6], legB: [4, 86], legF: [0, 84], footB: 0, footF: 0 };

/** Basit yan masa (önü kapalı, bacakları gizler). x = SOL, y = zemin */
const Desk = ({ x, y, w, h = 62, c = M.wood }: { x: number; y: number; w: number; h?: number; c?: string }) => (
  <OG sh={[{ d: rrect(x, y - h, w, 9, 3), f: c }, { d: rrect(x + 6, y - h + 8, w - 12, h - 8, 2), f: shade(c, 0.12) }, { d: `M${x + 10} ${y - h + 22}H${x + w - 10}`, st: shade(c, 0.3), sw: 1.4 }]} />
);


/** Yıldız (beceri düzeyi) */
const Star = ({ x, y, r = 12, on = true }: { x: number; y: number; r?: number; on?: boolean }) => {
  const pts: P[] = [];
  for (let i = 0; i < 10; i++) pts.push(pol([x, y], -90 + i * 36, i % 2 ? r * 0.45 : r));
  return <OG sh={[{ d: 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z', f: on ? '#f2c14e' : '#e4e1da' }]} />;
};

/** Bağlama: a = sap ucu, b = gövde merkezi */
function Baglama({ a, b }: { a: P; b: P }) {
  const ang = Math.atan2(a[1] - b[1], a[0] - b[0]) * R2D;
  const neckS = pol(b, ang, 14);
  return (
    <g>
      <OG sh={[
        { d: capsule(neckS, 3, a, 2.6), f: '#8a5a3c' },
        { d: ell(b, 20, 13), f: '#b77f50', t: `rotate(${f1(ang)} ${f1(b[0])} ${f1(b[1])})` },
        { d: circ(pol(b, ang, 4), 3.4), f: '#3b2a20' },
      ]} />
      <path d={`M${f1(pol(b, ang + 180, 14)[0])} ${f1(pol(b, ang + 180, 14)[1])}L${f1(a[0])} ${f1(a[1])}`} stroke="#f4f1ea" stroke-width={0.8} />
    </g>
  );
}

/** Sırt çantası (kişinin back katmanı) */
const pack = (r: Rig) => <OG sh={[{ d: rrect(r.back[0] - (r.flip ? -4 : 20) * r.s, r.neck[1] + 4 * r.s, 18 * r.s, 34 * r.s, 5), f: '#c0603e' }, { d: rrect(r.back[0] - (r.flip ? -6 : 18) * r.s, r.neck[1] + 22 * r.s, 14 * r.s, 10 * r.s, 3), f: shade('#c0603e', 0.15) }]} />;

/** Dört ayaklı hayvan (yan görünüş, sağa bakar). x = gövde ortası, y = zemin */
function Quad({ x, y, s = 1, flip, kind }: { x: number; y: number; s?: number; flip?: boolean; kind: 'cow' | 'goat' | 'dog' }) {
  const cfg = {
    cow: { bw: 46, bh: 26, leg: 26, c: '#f4f1ea', head: '#f4f1ea', spot: '#3b3537' },
    goat: { bw: 30, bh: 18, leg: 20, c: '#e7dcc2', head: '#e7dcc2', spot: '' },
    dog: { bw: 34, bh: 17, leg: 20, c: '#d9b27a', head: '#d9b27a', spot: '' },
  }[kind];
  const { bw, bh, leg, c } = cfg;
  const by = -leg - bh / 2;
  const legs: Sh[] = [-bw / 2 + 7, -bw / 2 + 13, bw / 2 - 12, bw / 2 - 6].map((lx, i) => ({ d: rrect(lx - 3, by + 2, 6, leg + bh / 2 - 2, 2.5), f: i % 2 ? c : shade(c, 0.15) }));
  const hx = bw / 2 + (kind === 'cow' ? 6 : 4);
  const hy = by - bh / 2 + (kind === 'dog' ? -4 : kind === 'goat' ? -8 : 4);
  const sh: Sh[] = [
    ...legs,
    { d: ell([0, by], bw / 2 + 4, bh / 2 + 2), f: c },
    { d: capsule([bw / 2 - 4, by - 2], bh * 0.32, [hx, hy], 5), f: c },
  ];
  if (kind === 'cow') {
    sh.push({ d: ell([-8, by - 2], 9, 7), f: cfg.spot, no: true }, { d: ell([14, by + 4], 6, 5), f: cfg.spot, no: true });
    sh.push({ d: rrect(hx - 4, hy - 8, 20, 18, 7), f: cfg.head }, { d: rrect(hx + 8, hy + 2, 10, 9, 4), f: '#f0b8a8' }, { d: capsule([hx, hy - 8], 2, [hx - 4, hy - 16], 1.6), f: '#e7dcc2' }, { d: 'M' + (-bw / 2 - 2) + ' ' + (by - 4) + 'Q' + (-bw / 2 - 10) + ' ' + (by + 10) + ' ' + (-bw / 2 - 8) + ' ' + (by + 22), st: K.out, sw: 2 });
  } else if (kind === 'goat') {
    sh.push({ d: ell([hx + 4, hy], 9, 6.5), f: cfg.head, t: `rotate(20 ${hx + 4} ${hy})` }, { d: `M${hx - 2} ${hy - 4}Q${hx - 10} ${hy - 18} ${hx - 14} ${hy - 12}`, st: '#8a7a5a', sw: 3 }, { d: `M${hx + 8} ${hy + 5}L${hx + 6} ${hy + 13}`, st: '#8a7a5a', sw: 2 }, { d: `M${-bw / 2 - 2} ${by - 6}l-6 -6`, st: K.out, sw: 2.4 });
  } else {
    sh.push({ d: ell([hx + 4, hy], 10, 8), f: cfg.head }, { d: ell([hx + 12, hy + 3], 6, 4.5), f: '#3b3537' }, { d: ell([hx - 2, hy + 1], 4, 7), f: '#3b3537', t: `rotate(-10 ${hx - 2} ${hy + 1})` }, { d: `M${-bw / 2 - 2} ${by - 4}Q${-bw / 2 - 14} ${by - 16} ${-bw / 2 - 8} ${by - 24}`, st: c, sw: 5 });
  }
  const eye: P = kind === 'cow' ? [hx + 2, hy - 2] : [hx + 6, hy - 2];
  return (
    <G x={x} y={y} s={s} fx={flip}>
      <ellipse cx={0} cy={2} rx={bw / 2 + 6} ry={3} fill="#000" opacity={0.15} />
      <OG ow={OW / s} sh={sh} />
      <circle cx={eye[0]} cy={eye[1]} r={1.6} fill={K.ink} />
    </G>
  );
}
const Cow = (p: { x: number; y: number; s?: number; flip?: boolean }) => <Quad {...p} kind="cow" />;
const Goat = (p: { x: number; y: number; s?: number; flip?: boolean }) => <Quad {...p} kind="goat" />;
const Dog = (p: { x: number; y: number; s?: number; flip?: boolean }) => <Quad {...p} kind="dog" flip={!p.flip} />;

/** Koyun (yan görünüş): x orta, y zemin */
function Sheep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[
        { d: rrect(-12, -16, 5, 16, 2), f: '#3b3537' }, { d: rrect(8, -16, 5, 16, 2), f: '#3b3537' },
        ...[[-14, -26], [-4, -30], [6, -29], [14, -24], [0, -20], [-12, -18], [10, -18]].map(([cx, cy]) => ({ d: circ([cx, cy], 9), f: '#f4f1ea' })),
        { d: ell([22, -30], 6, 8), f: '#3b3537', t: 'rotate(20 22 -30)' },
      ]} />
    </G>
  );
}

/** Eldiven: bilek w, ön kol açısı a */
function Glove({ w, a, dark }: { w: P; a: number; dark?: boolean }) {
  const c = dark ? shade('#e0b23a', 0.15) : '#e0b23a';
  const e = pol(w, a, 13);
  return <OG sh={[{ d: capsule(pol(w, a, -6), 5.5, e, 6.5), f: c }, { d: capsule(pol(w, a, -8), 6.2, pol(w, a, -3), 6.2), f: shade(c, 0.2) }]} />;
}

/** Odun parçası (yan yatmış kütük, uç yüzü solda). x orta, y alt */
function Split({ x, y, dry }: { x: number; y: number; dry?: boolean }) {
  const body = dry ? '#7d6656' : '#a0703c';
  const end = dry ? '#b49a78' : '#f6e0a8';
  const e: P = [x - 40, y - 44];
  return (
    <g>
      <OG sh={[{ d: rrect(x - 40, y - 86, 100, 84, 8), f: body }, { d: `M${x - 30} ${y - 60}H${x + 52}M${x - 26} ${y - 30}H${x + 48}`, st: shade(body, 0.3), sw: 2 }]} />
      <OG sh={[{ d: ell(e, 24, 42), f: end }, { d: ell(e, 12, 22), f: shade(end, 0.08), no: true }]} />
      {dry ? (
        <path d={`M${e[0]} ${e[1]}l-4 -34M${e[0]} ${e[1]}l14 -24M${e[0]} ${e[1]}l-16 26M${e[0]} ${e[1]}l10 32`} stroke={K.out} stroke-width={2.2} stroke-linecap="round" />
      ) : (
        <g>{[[x + 18, y - 104], [x + 38, y - 96], [x - 2, y - 110]].map(([dx, dy], i) => <path key={i} d={`M${dx} ${dy}c3 4 5 7 5 9a5 5 0 0 1 -10 0c0 -2 2 -5 5 -9z`} fill={K.water} stroke={K.out} stroke-width={1.2} />)}</g>
      )}
    </g>
  );
}

/** Sivrisinek (x,y merkez) */
function Mosquito({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-6 2l-6 10M-2 3l-2 12M3 3l4 11M6 1l8 8M-8 -1l-10 4" stroke={K.ink} stroke-width={1} fill="none" />
      <OG ow={OW / s} sh={[{ d: ell([-4, -8], 5, 9), f: '#dff1f8', t: 'rotate(-30 -4 -8)' }, { d: ell([5, -8], 5, 9), f: '#dff1f8', t: 'rotate(30 5 -8)' }, { d: ell([0, 0], 10, 3.4), f: '#5b5f78' }, { d: circ([11, -1], 3), f: '#5b5f78' }, { d: 'M13 0L22 4', st: K.ink, sw: 1 }]} />
    </G>
  );
}

/** Baltalık kütüğü ve sürgünleri: x orta, y zemin */
function Coppice({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const shoots = [-110, -100, -92, -84, -76, -68, -122];
  return (
    <G x={x} y={y} s={s}>
      {shoots.map((a, i) => {
        const b: P = [((i - 3) * 9), -26];
        const e = pol(b, a, 70 + (i % 3) * 14);
        return <g key={i}><path d={`M${b[0]} ${b[1]}L${f1(e[0])} ${f1(e[1])}`} stroke={K.out} stroke-width={4.4 / s} /><path d={`M${b[0]} ${b[1]}L${f1(e[0])} ${f1(e[1])}`} stroke="#7a6a3a" stroke-width={2.4 / s} /><OG ow={OW / s} sh={[{ d: ell(e, 12, 9), f: i % 2 ? K.leaf : shade(K.leaf, 0.12) }, { d: ell(pol(e, a + 180, 26), 8, 6), f: K.leaf }]} /></g>;
      })}
      <OG ow={OW / s} sh={[{ d: 'M-36 0Q-34 -16 -30 -28H30Q34 -16 36 0Z', f: K.trunk }, { d: ell([0, -28], 30, 7), f: M.logEnd }, { d: ell([0, -28], 16, 3.5), f: shade(M.logEnd, 0.12), no: true }]} />
    </G>
  );
}

/** Dal örgüsü çit: x1..x2, y zemin, h yükseklik */
function Wattle({ x1, x2, y, h }: { x1: number; x2: number; y: number; h: number }) {
  const posts: number[] = [];
  for (let x = x1; x <= x2; x += 34) posts.push(x);
  return (
    <g>
      <OG sh={posts.map((x) => ({ d: rrect(x - 3.5, y - h - 6, 7, h + 8, 2), f: M.log }))} />
      {Array.from({ length: 6 }, (_, j) => {
        const yy = y - 8 - j * (h / 6.5);
        let d = `M${x1} ${f1(yy)}`;
        posts.slice(1).forEach((x, i) => { d += `Q${x - 17} ${f1(yy + ((i + j) % 2 ? 5 : -5))} ${x} ${f1(yy)}`; });
        return <g key={j}><path d={d} stroke={K.out} stroke-width={6} fill="none" /><path d={d} stroke={j % 2 ? '#a07a4c' : '#8a6a42'} stroke-width={3.6} fill="none" /></g>;
      })}
    </g>
  );
}

/** Yer seçimi kesiti: dere yatağı ve yamaç dibi yasak, sırt üstü doğru */
function Terrain({ kind }: { kind: 'tent' | 'house' }) {
  const low = 202, ridge = 112;
  const ground = `M-5 ${low}H26Q36 ${low + 22} 56 ${low + 22}H74Q90 ${low + 22} 98 ${low}H150L176 ${ridge + 12}L184 ${ridge}H330V245H-5Z`;
  const dwell = (x: number, y: number, s: number) => kind === 'tent' ? <Tent x={x} y={y} s={s} /> : <HouseExt x={x - 30 * s} y={y} w={60 * s} h={40 * s} />;
  return (
    <Scene2 bg="outdoor" gy={240}>
      <rect width={320} height={240} fill={K.sky} />
      <path d={ground} fill={K.grass} stroke={K.out} stroke-width={1.5} />
      <path d={`M150 ${low}L176 ${ridge + 12}L184 ${ridge}V245H150Z`} fill={M.soil} opacity={0.7} />
      {/* dere yatağı */}
      {kind === 'house' ? <path d={`M34 ${low + 12}Q44 ${low + 20} 56 ${low + 20}H74Q86 ${low + 20} 92 ${low + 12}Z`} fill={K.water} /> : [40, 54, 70, 84].map((x) => <ellipse key={x} cx={x} cy={low + 19} rx={5} ry={3} fill={M.stone} stroke={K.out} stroke-width={1} />)}
      {dwell(64, low + 20, kind === 'tent' ? 0.55 : 0.75)}
      <No x={64} y={low - 6} r={22} />
      {dwell(126, low, kind === 'tent' ? 0.55 : 0.75)}
      <No x={128} y={low - 26} r={22} />
      {/* sırt üstü, kenardan geride */}
      {dwell(256, ridge, kind === 'tent' ? 0.7 : 1)}
      {kind === 'tent' && <Tent x={296} y={ridge} s={0.55} color="#4f7fb0" />}
      <Ok x={256} y={ridge - 64} r={14} />
      <Dim a={[188, ridge - 10]} b={[222, ridge - 10]} />
    </Scene2>
  );
}

/* ═══════════════════════════ OYUNCULAR ═══════════════════════════ */
// Paket kadrosu: aynı kişi her sahnede aynı görünür. Rehber içinde değişmez.
type Look = Omit<PersonProps, 'x' | 'y'>;
const C = {
  elif: { who: 'woman', skin: 0, hair: 'long', hairC: K.hair.brown, role: 'helper' },
  mehmet: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, mustache: true, role: 'bystander2', bottomC: K.pants.dark },
  zeynep: { who: 'woman', skin: 3, hair: 'bun', hairC: K.hair.black, role: 'bystander', bottomC: K.pants.navy },
  hasan: { who: 'oldman', skin: 1, role: 'bystander4' },
  fatma: { who: 'oldwoman', skin: 2, top: '#6c9c5a' },
  can: { who: 'boy', skin: 2, top: '#d9a13a' },
  deniz: { who: 'girl', skin: 0, hairC: K.hair.blond, top: '#c6574e' },
  emre: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.auburn, role: 'bystander3', bottomC: K.pants.khaki },
  yusuf: { who: 'man', skin: 3, hair: 'short', hairC: K.hair.black, top: '#4f7fb0', bottomC: K.pants.grey },
  selin: { who: 'woman', skin: 1, hair: 'ponytail', hairC: K.hair.dark, top: '#8f6fc2', bottomC: K.pants.denim },
  ali: { who: 'boy', skin: 3, top: '#13a394', bottomC: K.pants.navy },
  ayse: { who: 'girl', skin: 1, hair: 'ponytail', hairC: K.hair.black, top: '#8fb8e8' },
} satisfies Record<string, Look>;
/** Yoldan gelen yabancı (nöbet ve yabancılar rehberleri) */
const TRAV: Look = { who: 'man', skin: 1, hair: 'short', hairC: K.hair.dark, top: '#7a8a5a', bottomC: K.pants.grey, sleeve: 'long' };

/* ═══════════════════════════ SAHNELER ═══════════════════════════ */

export const SCENES: Record<string, () => JSX.Element> = {
  /* ── Topluluk kurma ── */
  'sf-bt-topluluk-ilk-toplanti': () => {
    const gy = 226;
    const selin: PersonProps = { ...C.selin, x: 52, y: gy - 10 * 0.86, s: 0.86, pose: { ...WC_SIT, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={164} y={176} s={1.3} />
        {/* arka sıra */}
        <Person {...C.fatma} x={130} y={196} s={0.76} pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person {...C.mehmet} x={170} y={198} s={0.78} pose={{ ...POSE.stand, armF: [-40, -75], handF: 'flat', face: 'speak' }} />
        <Person {...C.zeynep} x={210} y={196} s={0.76} pose={{ ...POSE.stand, face: 'neutral' }} />
        {/* yanlar */}
        <WheelChairPerson p={selin} gy={gy} />
        <Person {...C.ayse} x={110} y={230} s={0.86} pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Person {...C.can} x={234} y={230} s={0.86} flip pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Cane top={[254, 168]} bottom={[250, 230]} />
        <Person {...C.hasan} x={284} y={230} s={0.9} flip pose={{ ...POSE.standSide, armF: { to: [254, 170] }, face: 'neutral' }} />
      </Scene2>
    );
  },

  'sf-bt-topluluk-kurallar': () => {
    const rows: [number, JSX.Element][] = [
      [62, <g><Icon k="person" x={70} y={62} s={1.2} c={K.role.helper} /><Icon k="person" x={100} y={62} s={1.2} c={K.role.bystander2} /><Icon k="person" x={130} y={62} s={1.2} c={K.role.bystander} /><Txt x={196} y={70} t="=" size={26} /><Ok x={250} y={62} r={11} /></g>],
      [108, <g><Icon k="fist" x={100} y={108} s={1.3} /><No x={100} y={108} r={18} /><Txt x={196} y={115} t="YOK" size={16} c={K.danger} /></g>],
      [154, <g><Icon k="bread" x={86} y={154} s={1.2} /><Icon k="drop" x={118} y={154} s={1.2} /><Txt x={196} y={161} t="HERKESE" size={14} /><Ok x={250} y={154} r={11} /></g>],
      [198, <g><Icon k="person" x={86} y={198} s={1.2} c={K.role.bystander3} /><Icon k="person" x={116} y={198} s={1.2} c={K.role.bystander4} /><path d="M93 201H109" stroke={K.out} stroke-width={4} stroke-linecap="round" /><path d="M93 201H109" stroke={K.skin[1]} stroke-width={2} stroke-linecap="round" /><Txt x={196} y={205} t="EŞİT" size={16} /></g>],
    ];
    return (
      <Scene2 bg="closeup">
        <Board x={40} y={24} w={240} h={204}>
          {rows.map(([yy, el], i) => (
            <g key={i}>
              {i > 0 && <path d={`M52 ${yy - 23}H268`} stroke="#c9bfa8" stroke-width={1.2} />}
              {el}
            </g>
          ))}
        </Board>
      </Scene2>
    );
  },

  'sf-bt-topluluk-gorev-panosu': () => {
    const cols: [string, string?][] = [['drop'], ['wheat'], ['plus'], ['house'], ['book'], ['child']];
    const cc = ['#8fb8e8', '#f2c14e', '#f4a3a3', '#c6e0a8', '#d6c4ee', '#f7c59f'];
    return (
      <Scene2 bg="closeup">
        <Board x={18} y={26} w={284} h={192}>
          {cols.map(([k], i) => {
            const cx = 46 + i * 46;
            return (
              <g key={k}>
                <OG sh={[{ d: circ([cx, 56], 15), f: '#fff' }]} />
                <Icon k={k} x={cx} y={56} s={0.95} />
                {i > 0 && <path d={`M${cx - 23} 40V206`} stroke="#c9bfa8" stroke-width={1.2} />}
                {[88, 122, 156].slice(0, i % 2 ? 2 : 3).map((yy, j) => (
                  <g key={j}>
                    <OG sh={[{ d: rrect(cx - 18, yy, 36, 24, 3), f: cc[(i + j) % 6] }]} />
                    <path d={`M${cx - 12} ${yy + 9}H${cx + 12}M${cx - 12} ${yy + 16}H${cx + 4}`} stroke={K.ink} stroke-width={1.6} opacity={0.55} />
                  </g>
                ))}
              </g>
            );
          })}
          <path d="M30 76H290" stroke="#c9bfa8" stroke-width={1.2} />
        </Board>
      </Scene2>
    );
  },

  /* ── Karar alma ── */
  'sf-bt-karar-kartlar': () => {
    const gy = 228;
    const ppl: [Look, number, string][] = [
      [C.zeynep, 40, K.safe],
      [C.hasan, 100, K.safe],
      [C.elif, 160, '#f2c14e'],
      [C.yusuf, 220, K.safe],
      [C.fatma, 280, K.danger],
    ];
    return (
      <Scene2 bg="outdoor">
        {ppl.map(([lk, x, col], i) => {
          const p: PersonProps = { ...lk, x, y: gy, s: 0.86, pose: { ...POSE.stand, armF: [-62, -88], handF: 'fist', face: 'neutral' } };
          const h = rig(p).handF;
          return (
            <g key={i}>
              <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
              <OG sh={[{ d: rrect(h[0] - 13, h[1] - 36, 26, 34, 3), f: col }]} />
              <Person {...p} only={['armF']} />
            </g>
          );
        })}
      </Scene2>
    );
  },

  'sf-bt-karar-arabulucu': () => {
    const gy = 226;
    const s = 0.95;
    const stool = (x: number) => <OG sh={[{ d: rrect(x - 20, gy - 44 * s, 40, 8, 2), f: M.wood }, { d: rrect(x - 16, gy - 44 * s + 6, 6, 44 * s - 6, 2), f: shade(M.wood, 0.2) }, { d: rrect(x + 10, gy - 44 * s + 6, 6, 44 * s - 6, 2), f: shade(M.wood, 0.2) }]} />;
    return (
      <Scene2 bg="indoor" gy={190}>
        {/* arabulucular masanın arkasında */}
        <Person {...C.elif} x={136} y={gy - 8} s={0.88} pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person {...C.hasan} x={184} y={gy - 8} s={0.88} pose={{ ...POSE.stand, face: 'neutral' }} />
        <Desk x={104} y={gy} w={112} h={70} />
        {/* taraflar */}
        {stool(58)}{stool(262)}
        <Person {...C.mehmet} x={58} y={gy - 44 * s - 2} ay="hip" s={s} pose={{ ...SIT, armF: [-20, -40], handF: 'flat', face: 'speak' }} />
        <Person {...C.yusuf} x={262} y={gy - 44 * s - 2} ay="hip" s={s} flip pose={{ ...SIT, armF: { at: 'kneeF', d: [-4, -6] }, face: 'neutral' }} />
        <Waves x={104} y={98} a={0} n={3} r={6} />
      </Scene2>
    );
  },

  'sf-bt-karar-anlasma': () => {
    const tip: P = [198, 175];
    const pa = -122;
    const pen = pol(tip, pa, 16);
    const h = handAt({ a: -40, s: 1.25, pose: 'pinch', side: 'R', view: 'back', arm: 220, sleeve: '#4f7fb0', skin: 3 }, 'pinch', pen);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={140} width={320} height={100} fill={M.wood} />
        <OG sh={[{ d: rrect(50, 18, 220, 196, 4), f: M.paper }]} />
        <path d="M72 46H248M72 64H248M72 82H236M72 100H248M72 118H206" stroke="#9fb0c4" stroke-width={2.4} />
        <path d="M70 176H146M172 176H252" stroke={K.ink} stroke-width={1.8} />
        <path d="M80 168q6 -12 11 0t11 -3t10 0t12 -4" stroke={K.ink} stroke-width={2} fill="none" />
        <path d="M176 168q5 -10 10 -2t8 1" stroke={K.ink} stroke-width={2} fill="none" />
        <Pencil tip={tip} a={pa} l={50} />
        <Hand {...h} />
      </Scene2>
    );
  },

  /* ── Nöbet ── */
  'sf-bt-nobet-iki-kisi': () => {
    const gy = 222;
    const s = 1.05;
    const hipY = gy - 22 - 4;
    const z: PersonProps = { ...C.zeynep, sleeve: 'long', x: 196, y: hipY, ay: 'hip', s, pose: { ...SIT, legB: [-4, 96], legF: [-8, 94], armF: [50, -40], handF: 'fist', face: 'neutral' } };
    const zr = rig(z);
    const e: PersonProps = { ...C.emre, sleeve: 'long', x: 104, y: hipY, ay: 'hip', s, pose: { ...SIT, legB: [-4, 96], legF: [-8, 94], face: 'neutral' } };
    const er = rig(e);
    return (
      <Scene2 bg="night">
        <HouseExt x={-20} y={170} w={70} h={46} color="#7b7a8c" roof="#5a4a5c" />
        <HouseExt x={256} y={176} w={60} h={40} color="#7b7a8c" roof="#5a4a5c" />
        <Log a={[40, gy - 12]} b={[270, gy - 12]} r={13} />
        <Person {...e} />
        <path d={`M${er.chest[0] - 8} ${er.neck[1] + 1}Q${er.chest[0] - 2} ${er.neck[1] + 22} ${er.chest[0] + 2} ${er.neck[1] + 1}`} stroke={K.out} stroke-width={1.6} fill="none" />
        <Whistle x={er.chest[0] + 1} y={er.neck[1] + 23} s={0.9} a={90} color="#f2c14e" />
        <Person {...z} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Lantern x={zr.handF[0] + 2} y={zr.handF[1] + 36} s={1.1} />
        <Person {...z} only={['armF']} />
      </Scene2>
    );
  },

  'sf-bt-nobet-yeri': () => {
    const gy = 206;
    const post = (x: number) => <OG sh={[{ d: rrect(x - 4, 92, 8, gy - 92 + 4, 2), f: M.log }]} />;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* aşağıda yerleşim ve yol */}
        <path d={`M200 ${gy}Q240 ${gy - 30} 320 ${gy - 34}V${gy}Z`} fill={K.hill} />
        <HouseExt x={236} y={gy - 26} w={44} h={28} />
        <HouseExt x={282} y={gy - 30} w={40} h={26} />
        <path d={`M196 ${gy + 34}Q250 ${gy + 6} 320 ${gy - 4}`} stroke={K.dirt} stroke-width={10} fill="none" />
        {/* nöbet yeri */}
        {post(36)}{post(170)}
        <OG sh={[{ d: `M18 98L104 70L190 98L186 106L104 80L22 106Z`, f: '#8a6a42' }]} />
        <OG sh={[{ d: rrect(34, gy - 54, 140, 8, 2), f: M.wood }, { d: rrect(42, gy - 46, 7, 46, 2), f: shade(M.wood, 0.2) }, { d: rrect(160, gy - 46, 7, 46, 2), f: shade(M.wood, 0.2) }]} />
        {/* çan */}
        <path d="M104 80V100" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: 'M92 122Q92 100 104 100Q116 100 116 122Z', f: '#d9a13a' }, { d: circ([104, 125], 3.5), f: '#8a6a32' }]} />
        {/* su kabı, battaniye, fener */}
        <OG sh={[{ d: 'M54 152Q50 136 62 132H74Q86 136 82 152Z', f: K.water }, { d: rrect(62, 124, 12, 9, 2), f: '#5a6fb0' }]} />
        <OG sh={[{ d: rrect(90, 134, 50, 18, 6), f: '#c1554b' }, { d: 'M96 140H134M96 146H134', st: shade('#c1554b', 0.3), sw: 1.4 }]} />
        <Lantern x={154} y={152} s={0.9} glow={false} />
        <Dash a={[176, 120]} b={[244, 166]} />
      </Scene2>
    );
  },

  'sf-bt-nobet-selam': () => {
    // Nöbetçi kadın yabancıyı sakin selamlıyor; öbür nöbetçi yerleşime dönüp karşılama ekibini çağırıyor.
    const gy = 224;
    const em: PersonProps = { ...C.emre, sleeve: 'long', x: 92, y: gy, s: 0.98, flip: true, pose: { ...POSE.standSide, face: 'speak' } };
    const er = rig(em);
    const em2: PersonProps = { ...em, pose: { ...POSE.standSide, armF: { to: [er.mouth[0] - 4, er.mouth[1] + 4] }, handF: 'flat', face: 'speak' } };
    return (
      <Scene2 bg="outdoor">
        <HouseExt x={-10} y={196} w={60} h={42} />
        <path d={`M120 ${gy + 2}Q220 ${gy - 14} 330 ${gy - 18}`} stroke={K.dirt} stroke-width={20} fill="none" opacity={0.7} />
        <Person {...em2} />
        <Waves x={er.mouth[0] - 14} y={er.mouth[1] + 2} a={180} n={3} r={7} />
        <Person {...C.zeynep} sleeve="long" x={150} y={gy} s={1} pose={{ ...POSE.standSide, armF: [-35, -80], handF: 'flat', face: 'calm' }} />
        <Person {...TRAV} x={258} y={gy - 6} s={0.92} flip pose={{ ...POSE.walk, face: 'neutral' }} back={pack} />
      </Scene2>
    );
  },

  /* ── Takas ── */
  'sf-bt-takas-emek-saati': () => {
    const gy = 224;
    const hands: P = [96, 150];
    const head: P = [140, gy - 26];
    const chop: PersonProps = { ...C.mehmet, x: 62, y: gy, s: 0.95, pose: { ...POSE.standSide, spine: -76, chest: -70, head: -70, legB: [100, 96], legF: [76, 86], armB: { to: [hands[0] - 6, hands[1] + 2] }, armF: { to: hands }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const sit: PersonProps = { ...C.fatma, x: 240, y: gy - 42, ay: 'hip', s: 0.95, flip: true, pose: { ...SIT, armF: { to: [204, 168] }, armB: { to: [210, 172] }, handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        {/* odun kesme */}
        <OG sh={[{ d: rrect(124, gy - 24, 34, 24, 2), f: M.log }, { d: ell([141, gy - 24], 17, 4), f: M.logEnd }]} />
        <OG sh={[{ d: capsule(hands, 2.6, pol(head, -150, 4), 2.6), f: M.wood }, { d: `M${head[0] - 10} ${head[1] - 16}L${head[0] + 6} ${head[1] - 12}L${head[0] + 2} ${head[1] + 2}L${head[0] - 14} ${head[1] - 4}Z`, f: M.iron }]} />
        <Person {...chop} />
        {/* dikiş */}
        <OG sh={[{ d: rrect(220, gy - 42, 42, 9, 2), f: M.wood }, { d: rrect(226, gy - 34, 6, 34, 2), f: shade(M.wood, 0.2) }, { d: rrect(250, gy - 34, 6, 34, 2), f: shade(M.wood, 0.2) }]} />
        <Person {...sit} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <OG sh={[{ d: rrect(190, 160, 30, 18, 4), f: '#c6574e' }]} />
        <Person {...sit} only={['armF']} />
        {/* eşit birim */}
        <Icon k="hourglass" x={96} y={34} s={1.2} />
        <Icon k="hourglass" x={230} y={34} s={1.2} />
        <Txt x={163} y={44} t="=" size={30} />
      </Scene2>
    );
  },

  'sf-bt-takas-pano': () => {
    const rows: [string, number][] = [['sock', 3], ['bread', 1], ['salt', 2], ['basket', 4]];
    return (
      <Scene2 bg="closeup">
        <Board x={50} y={20} w={220} h={204}>
          {rows.map(([k, n], i) => {
            const yy = 60 + i * 44;
            return (
              <g key={k}>
                {i > 0 && <path d={`M62 ${yy - 22}H258`} stroke="#c9bfa8" stroke-width={1.2} />}
                <Icon k={k} x={100} y={yy} s={1.35} />
                <Txt x={150} y={yy + 6} t="=" size={20} />
                <Txt x={186} y={yy + 8} t={String(n)} size={24} />
                <Icon k="hourglass" x={226} y={yy} s={0.9} />
              </g>
            );
          })}
        </Board>
      </Scene2>
    );
  },

  'sf-bt-takas-defter': () => {
    const gy = 226;
    const s = 1;
    const top = gy - 56;
    const l: PersonProps = { ...C.elif, x: 72, y: gy - 44 * s, ay: 'hip', s, pose: { ...POSE.sitChair, spine: -84, head: -76, armF: { to: [138, top - 4] }, armB: { to: [128, top - 2] }, handF: 'fist', face: 'neutral' } };
    const r: PersonProps = { ...C.hasan, x: 248, y: gy - 44 * s, ay: 'hip', s, flip: true, pose: { ...POSE.sitChair, spine: -86, head: -80, armF: { to: [186, top - 4] }, handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={198}>
        <Chair x={66} y={gy} />
        <Chair x={254} y={gy} flip />
        <Person {...l} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...r} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Table x={104} y={gy} w={112} h={56} />
        <Notebook x={128} y={top - 12} w={64} h={12} lines={0} />
        <Icon k="basket" x={126} y={top - 24} s={1.3} />
        <OG sh={[{ d: ell([120, top - 34], 4, 5), f: '#fff6e6' }, { d: ell([129, top - 35], 4, 5), f: '#f0dcc0' }]} />
        <Icon k="sock" x={198} y={top - 26} s={1.2} c="#5a8fc2" />
        <Pencil tip={[142, top - 6]} a={-130} l={22} />
        <Person {...l} only={['armF']} />
        <Pencil tip={[182, top - 6]} a={-50} l={22} />
        <Person {...r} only={['armF']} />
      </Scene2>
    );
  },

  /* ── Ortak ambar ── */
  'sf-bt-ambar-raflar': () => {
    const gy = 214;
    const wallX = 34;
    const sx = 76, sw = 170;
    const shelves = [176, 128, 80];
    return (
      <Scene2 bg="indoor" gy={gy} wall="#e2d6c0">
        {/* duvar kesiti */}
        <OG sh={[{ d: rrect(-10, 0, wallX + 10, 240, 0), f: '#cdbf9f' }]} />
        <path d={`M0 30H${wallX}M0 70H${wallX}M0 110H${wallX}M0 150H${wallX}M0 190H${wallX}`} stroke={shade('#cdbf9f', 0.2)} stroke-width={1.4} />
        {/* raf */}
        <OG sh={[
          { d: rrect(sx, 66, 8, gy - 66, 2), f: shade(M.wood, 0.2) },
          { d: rrect(sx + sw - 8, 66, 8, gy - 66, 2), f: shade(M.wood, 0.2) },
          ...shelves.map((y) => ({ d: rrect(sx - 4, y, sw + 8, 8, 2), f: M.wood })),
        ]} />
        {/* çuval ve kaplar */}
        <Icon k="sack" x={110} y={162} s={1.3} /><Icon k="sack" x={146} y={162} s={1.3} />
        <OG sh={[{ d: rrect(176, 146, 26, 30, 3), f: '#8e99a6' }, { d: rrect(174, 142, 30, 6, 2), f: shade('#8e99a6', 0.2) }, { d: rrect(210, 146, 26, 30, 3), f: '#8e99a6' }, { d: rrect(208, 142, 30, 6, 2), f: shade('#8e99a6', 0.2) }]} />
        <OG sh={[{ d: 'M98 128Q90 104 104 98H122Q136 104 128 128Z', f: '#c9774a' }, { d: rrect(102, 92, 24, 7, 2), f: '#8a5a3c' }, { d: 'M150 128Q142 104 156 98H174Q188 104 180 128Z', f: '#c9774a' }, { d: rrect(154, 92, 24, 7, 2), f: '#8a5a3c' }]} />
        <Icon k="sack" x={214} y={114} s={1.2} />
        <OG sh={[{ d: rrect(96, 58, 28, 22, 3), f: '#8e99a6' }, { d: rrect(140, 56, 28, 24, 3), f: '#8e99a6' }, { d: rrect(184, 58, 28, 22, 3), f: '#8e99a6' }]} />
        {/* boşluklar */}
        <Dim a={[wallX + 2, 44]} b={[sx - 2, 44]} />
        <Dim a={[sx + sw + 22, gy - 2]} b={[sx + sw + 22, shelves[0] + 10]} />
        <Label x={276} y={150} text="1 karış" size={13} />
      </Scene2>
    );
  },

  'sf-bt-ambar-giris': () => {
    const gy = 226;
    const hook: P = [176, 70];
    const p: PersonProps = { ...C.elif, x: 112, y: gy, s: 1.05, pose: { ...POSE.standSide, armF: { to: [hook[0] - 2, hook[1] - 8] }, handF: 'fist', armB: [100, 92], face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={198}>
        <OG sh={[{ d: rrect(222, 72, 90, 132, 2), f: '#efe9df' }, { d: rrect(230, 80, 74, 124, 1), f: '#5a4636' }]} />
        <Icon k="sack" x={262} y={186} s={1.6} />
        {/* yaylı kantar ve çuval */}
        <OG sh={[{ d: rrect(hook[0] - 8, hook[1] - 6, 16, 34, 4), f: '#c9d2da' }, { d: circ([hook[0], hook[1] + 6], 5), f: '#fff' }]} />
        <path d={`M${hook[0]} ${hook[1] + 28}V${hook[1] + 40}`} stroke={K.out} stroke-width={2.4} />
        <G x={hook[0]} y={hook[1] + 82} s={3.4}><OG ow={OW / 3.4} sh={[{ d: 'M-8 -6Q-11 4 -9 10H9Q11 4 8 -6Z', f: M.sack }, { d: 'M-5 -6L-7 -11H7L5 -6Z', f: M.sack }, { d: 'M-6 -7H6', st: '#7a5a32', sw: 2 }]} /></G>
        {/* tarihli etiket */}
        <path d={`M${hook[0] + 10} ${hook[1] + 56}L${hook[0] + 22} ${hook[1] + 66}`} stroke={K.out} stroke-width={1.4} />
        <OG sh={[{ d: rrect(hook[0] + 16, hook[1] + 64, 26, 18, 2), f: '#fff', t: `rotate(12 ${hook[0] + 29} ${hook[1] + 73})` }]} />
        <path d={`M${hook[0] + 21} ${hook[1] + 72}h14M${hook[0] + 20} ${hook[1] + 77}h10`} stroke={K.ink} stroke-width={1.4} transform={`rotate(12 ${hook[0] + 29} ${hook[1] + 73})`} />
        <Person {...p} />
        {/* defter masada */}
        <Table x={6} y={gy} w={78} h={66} />
        <Notebook x={16} y={gy - 80} w={58} h={12} lines={0} />
        <Pencil tip={[50, gy - 70]} a={-60} l={24} />
      </Scene2>
    );
  },

  'sf-bt-ambar-ilk-giren': () => {
    const gy = 222;
    const wallX = 24;
    const shelfY = 140;
    const p: PersonProps = { ...C.mehmet, x: 238, y: gy, s: 1.05, flip: true, pose: { ...POSE.standSide, spine: -84, armF: { to: [84, shelfY - 18] }, handF: 'fist', face: 'neutral' } };
    const jar = (x: number, c: string, t: string, tc: string) => (
      <g>
        <OG sh={[{ d: `M${x - 13} ${shelfY}Q${x - 18} ${shelfY - 26} ${x - 8} ${shelfY - 32}H${x + 8}Q${x + 18} ${shelfY - 26} ${x + 13} ${shelfY}Z`, f: c }, { d: rrect(x - 10, shelfY - 38, 20, 7, 2), f: '#8a5a3c' }, { d: rrect(x - 12, shelfY - 24, 24, 12, 2), f: '#fff' }]} />
        <Txt x={x} y={shelfY - 14.5} t={t} size={8} c={tc} />
      </g>
    );
    return (
      <Scene2 bg="indoor" gy={198} wall="#e2d6c0">
        <OG sh={[{ d: rrect(-10, 0, wallX + 10, 240, 0), f: '#cdbf9f' }]} />
        <OG sh={[{ d: rrect(40, shelfY, 140, 8, 2), f: M.wood }, { d: rrect(44, shelfY + 8, 8, gy - shelfY - 8, 2), f: shade(M.wood, 0.2) }, { d: rrect(168, shelfY + 8, 8, gy - shelfY - 8, 2), f: shade(M.wood, 0.2) }, { d: rrect(40, 60, 140, 8, 2), f: M.wood }]} />
        {jar(118, '#c9774a', 'ESKİ', K.danger)}
        {jar(154, '#c9774a', 'ESKİ', K.danger)}
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        {jar(82, '#d99a6a', 'YENİ', K.safe)}
        <Person {...p} only={['armF']} />
        <Arrow from={[150, 92]} to={[90, 92]} w={5} />
        <Arrow from={[160, 180]} to={[214, 206]} bend={0.25} w={5} />
        <Icon k="basket" x={234} y={214} s={1.4} />
      </Scene2>
    );
  },

  /* ── Ortak mutfak ── */
  'sf-bt-mutfak-kazan': () => {
    const gy = 214;
    const cx = 150;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Tent x={34} y={gy - 26} s={0.45} />
        <Tent x={70} y={gy - 28} s={0.4} color="#4f7fb0" />
        {/* taş ocak */}
        <Flame x={cx} y={gy + 4} s={0.9} />
        <OG sh={[[-58, 0], [-40, -4], [40, -4], [58, 0]].map(([dx, dy]) => ({ d: ell([cx + dx, gy + 8 + dy], 13, 10), f: M.stone }))} />
        <OG sh={[{ d: rrect(cx - 66, gy - 20, 22, 26, 5), f: M.stone }, { d: rrect(cx + 44, gy - 20, 22, 26, 5), f: M.stone }]} />
        {/* kazan */}
        <OG sh={[
          { d: `M${cx - 46} ${gy - 88}H${cx + 46}L${cx + 40} ${gy - 26}Q${cx} ${gy - 10} ${cx - 40} ${gy - 26}Z`, f: '#5b6370' },
          { d: `M${cx + 14} ${gy - 88}H${cx + 46}L${cx + 40} ${gy - 26}Q${cx + 30} ${gy - 20} ${cx + 16} ${gy - 18}Z`, f: shade('#5b6370', 0.15), no: true },
          { d: rrect(cx - 52, gy - 96, 104, 10, 4), f: '#6f7782' },
          { d: rrect(cx - 10, gy - 106, 20, 10, 4), f: '#3b3f4b' },
        ]} />
        <g fill="none" stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.85}>
          <path d={`M${cx - 30} ${gy - 104}c-4-6 4-9 0-16`} /><path d={`M${cx + 30} ${gy - 104}c-4-6 4-9 0-16`} />
        </g>
        {/* ıslatılmış bakliyat */}
        <OG sh={[{ d: `M222 ${gy - 30}H290L284 ${gy}H228Z`, f: '#d8c8a8' }, { d: ell([256, gy - 30], 34, 6), f: K.water }]} />
        {[234, 244, 254, 264, 274, 249, 259].map((x, i) => <ellipse key={i} cx={x} cy={gy - 30 + (i > 4 ? 2 : 0)} rx={3.6} ry={2.4} fill="#c98a4a" stroke={K.out} stroke-width={0.8} />)}
      </Scene2>
    );
  },

  'sf-bt-mutfak-kepce': () => {
    const gy = 226;
    const potX = 104;
    const bowl: P = [168, 140];
    const server: PersonProps = { ...C.zeynep, x: 50, y: gy, s: 1, pose: { ...POSE.standSide, armF: { to: [bowl[0] - 22, bowl[1] - 22] }, handF: 'fist', armB: { to: [potX - 18, 148] }, handB: 'fist', face: 'neutral' } };
    const q1: PersonProps = { ...C.can, x: 200, y: gy, s: 1, flip: true, pose: { ...POSE.standSide, armF: { to: [bowl[0] + 6, bowl[1] + 6] }, armB: { to: [bowl[0] + 8, bowl[1] + 10] }, face: 'neutral' } };
    const ladleH: P = [bowl[0] - 22, bowl[1] - 22];
    return (
      <Scene2 bg="outdoor">
        <Person {...C.hasan} x={292} y={gy - 4} s={0.94} flip pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Person {...C.elif} x={252} y={gy - 2} s={0.96} flip pose={{ ...POSE.standSide, armF: { to: [228, 160] }, face: 'neutral' }} />
        <OG sh={[{ d: ell([226, 160], 11, 4), f: '#e6e8eb' }, { d: `M215 160Q226 170 237 160Z`, f: '#e6e8eb' }]} />
        <Table x={60} y={gy} w={100} h={70} />
        <Pot x={potX} y={gy - 70} s={1.5} boil={false} />
        <Person {...server} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...q1} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        {/* kepçe */}
        <OG sh={[{ d: capsule(ladleH, 2.2, [bowl[0] - 4, bowl[1] - 8], 2.2), f: '#8e99a6' }, { d: `M${bowl[0] - 12} ${bowl[1] - 10}Q${bowl[0] - 2} ${bowl[1] + 2} ${bowl[0] + 8} ${bowl[1] - 10}Z`, f: '#8e99a6' }]} />
        <OG sh={[{ d: `M${bowl[0] - 16} ${bowl[1]}H${bowl[0] + 16}Q${bowl[0] + 14} ${bowl[1] + 16} ${bowl[0]} ${bowl[1] + 16}Q${bowl[0] - 14} ${bowl[1] + 16} ${bowl[0] - 16} ${bowl[1]}Z`, f: '#e6e8eb' }, { d: ell([bowl[0], bowl[1]], 16, 3.5), f: '#d99a4e' }]} />
        <Person {...server} only={['armF']} />
        <Person {...q1} only={['armF']} />
      </Scene2>
    );
  },

  'sf-bt-mutfak-uc-kap': () => {
    const basins: [number, string][] = [[62, '#d9eef8'], [160, K.waterLight], [258, '#9ec9e6']];
    return (
      <Scene2 bg="closeup">
        {basins.map(([x, c], i) => (
          <g key={i}>
            <OG sh={[{ d: circ([x, 140], 46), f: '#a3adb8' }, { d: circ([x, 140], 38), f: c }]} />
            {i === 0 && [[-14, -8, 8], [8, -14, 6], [12, 10, 9], [-8, 14, 7], [-20, 8, 5], [20, -2, 5]].map(([dx, dy, r], j) => <circle key={j} cx={x + dx} cy={140 + dy} r={r} fill="#fff" stroke="#b8d0e0" stroke-width={1.2} />)}
            {i === 1 && <path d={`M${x - 20} 132q5 -4 10 0t10 0t10 0M${x - 14} 150q5 -4 10 0t10 0`} stroke="#fff" stroke-width={2.4} fill="none" />}
            {i === 2 && <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round"><path d={`M${x - 14} 120c-5-7 5-11 0-20`} /><path d={`M${x} 116c-5-7 5-11 0-20`} /><path d={`M${x + 14} 120c-5-7 5-11 0-20`} /></g>}
          </g>
        ))}
        <Txt x={62} y={208} t="1" size={20} /><Txt x={160} y={208} t="2" size={20} /><Txt x={258} y={208} t="3" size={20} />
        <Arrow from={[96, 92]} to={[126, 92]} w={5} bend={0.3} />
        <Arrow from={[194, 92]} to={[224, 92]} w={5} bend={0.3} />
      </Scene2>
    );
  },

  /* ── Çocuk ── */
  'sf-bt-cocuk-alan': () => {
    // Çitle çevrili, gölgelikli, dışarıdan görünen açık oyun alanı; bir yetişkin başında.
    const gy = 206;
    const posts = (xs: number[], y: number, h: number) => <OG sh={xs.map((x) => ({ d: rrect(x - 3, y - h, 6, h + 2, 2), f: shade(M.wood, 0.1) }))} />;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* arka çit */}
        <OG sh={[{ d: rrect(10, gy - 26, 300, 5, 2), f: M.wood }, { d: rrect(10, gy - 14, 300, 5, 2), f: M.wood }]} />
        {posts([14, 56, 98, 140, 182, 224, 266, 306], gy - 4, 30)}
        {/* gölgelik */}
        <OG sh={[{ d: rrect(30, 70, 6, gy - 50, 2), f: M.log }, { d: rrect(200, 70, 6, gy - 50, 2), f: M.log }]} />
        <OG sh={[{ d: 'M18 74Q118 54 218 74L214 88Q118 70 22 88Z', f: '#f2e4c4' }]} />
        <Person {...C.deniz} x={82} y={gy + 18} s={0.92} pose={{ ...POSE.run, face: 'calm' }} />
        <OG sh={[{ d: circ([124, gy + 8], 9), f: '#e5533d' }]} />
        <Person {...C.ali} x={156} y={gy + 20} s={0.92} flip pose={{ ...POSE.walk, face: 'calm' }} />
        <Person {...C.elif} x={250} y={gy + 26} s={0.95} flip pose={{ ...POSE.standSide, face: 'calm' }} />
      </Scene2>
    );
  },

  'sf-bt-cocuk-iki-yetiskin': () => {
    const gy = 224;
    return (
      <Scene2 bg="outdoor">
        <Person {...C.elif} x={70} y={gy} s={0.98} pose={{ ...POSE.stand, face: 'calm' }} />
        <Person {...C.deniz} x={118} y={gy + 4} s={0.9} flip pose={{ ...POSE.sitFloor, face: 'calm' }} />
        <Icon k="book" x={102} y={196} s={1.1} />
        <Person {...C.yusuf} x={252} y={gy} s={0.98} pose={{ ...POSE.stand, face: 'calm' }} />
        <Person {...C.ali} x={200} y={gy + 4} s={0.9} pose={{ ...POSE.sitFloor, face: 'calm' }} />
        <OG sh={[{ d: rrect(214, 204, 14, 14, 2), f: '#e5533d' }, { d: rrect(226, 204, 14, 14, 2), f: '#3d7ad6' }, { d: rrect(220, 190, 14, 14, 2), f: '#f2c14e' }]} />
        <Label x={160} y={52} text="≥ 2" size={20} />
      </Scene2>
    );
  },

  'sf-bt-cocuk-ad-karti': () => {
    const p: PersonProps = { ...C.ali, x: 160, y: 70, ax: 'head', ay: 'head', s: 2.7, pose: { ...POSE.stand, face: 'calm' } };
    const r = rig(p);
    const c: P = [r.chest[0] + 22, r.chest[1] + 30];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <OG sh={[{ d: rrect(c[0] - 34, c[1] - 22, 68, 46, 4), f: '#fff' }]} />
        <path d={`M${c[0] - 26} ${c[1] - 6}H${c[0] + 4}M${c[0] - 26} ${c[1] + 6}H${c[0] - 2}`} stroke={K.ink} stroke-width={3} stroke-linecap="round" />
        <Icon k="flag" x={c[0] + 20} y={c[1]} s={1.15} />
      </Scene2>
    );
  },

  /* ── Yaşlı ve engelli bakımı ── */
  'sf-bt-bakim-pozisyon': () => {
    // Yatakta sırtüstü yatan yaşlı kadın; baş, dirsek ve baldır altında yastık (topuklar boşta). 2 saatte bir çevrilir.
    const top = 170;
    const fat: PersonProps = { ...C.fatma, x: 180, y: top - 2, s: 1.3, pose: { ...POSE.lieBack, legB: [-5, 1], legF: [-4, 2], face: 'neutral' } };
    const fr = rig(fat);
    return (
      <Scene2 bg="indoor" gy={190}>
        {/* yatak */}
        <OG sh={[{ d: rrect(14, 128, 12, 98, 2), f: M.wood }, { d: rrect(296, 150, 10, 76, 2), f: M.wood }, { d: rrect(18, 188, 284, 14, 2), f: shade(M.wood, 0.15) }, { d: rrect(22, top, 278, 20, 5), f: '#f4f1ea' }]} />
        {/* baş yastığı */}
        <OG sh={[{ d: rrect(fr.head[0] - 26, top - 14, 52, 16, 8), f: '#fff' }]} />
        {/* baldır altında katlanmış battaniye: topuklar boşta */}
        <OG sh={[{ d: rrect(fr.kneeF[0] + 4, top - 14, 48, 16, 7), f: '#c1554b' }]} />
        {/* dirsek altında küçük yastık */}
        <OG sh={[{ d: rrect(fr.elbowF[0] - 14, top - 9, 28, 10, 5), f: '#e9b949' }]} />
        <Person {...fat} />
        {/* çevirme oku */}
        <Arrow from={[fr.hip[0] - 70, fr.hip[1] - 50]} to={[fr.hip[0] + 40, fr.hip[1] - 54]} bend={-0.4} w={5} />
        <Timer x={42} y={44} r={16} text="2 saat" />
      </Scene2>
    );
  },

  'sf-bt-bakim-dik-oturma': () => {
    const top = 176;
    const s = 1.02;
    const hip: P = [104, top - 2];
    const mouthP = rig({ ...C.hasan, x: hip[0], y: hip[1], ay: 'hip', s, pose: { spine: -76, head: -84, legB: [-2, -2], legF: [0, 0] } }).mouth;
    const spoon: P = [mouthP[0] + 8, mouthP[1] + 4];
    const bowl: P = [hip[0] + 40, hip[1] - 36];
    const h: PersonProps = { ...C.hasan, x: hip[0], y: hip[1], ay: 'hip', s, pose: { spine: -76, head: -84, legB: [-2, -2], legF: [0, 0], footB: -80, footF: -80, armF: { to: spoon }, handF: 'fist', armB: { to: bowl }, handB: 'fist', face: 'neutral' } };
    const z: PersonProps = { ...C.zeynep, x: 272, y: 226 - 44, ay: 'hip', s: 0.98, flip: true, pose: { ...POSE.sitChair, armF: { at: 'kneeF', d: [-4, -4] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={190}>
        <OG sh={[{ d: rrect(30, 110, 12, 114, 2), f: M.wood }, { d: rrect(226, 168, 10, 56, 2), f: M.wood }, { d: rrect(34, 192, 198, 14, 2), f: shade(M.wood, 0.15) }, { d: rrect(38, top, 192, 18, 5), f: '#f4f1ea' }]} />
        <OG sh={[{ d: rrect(40, 104, 24, 40, 10), f: '#fff', t: 'rotate(12 52 124)' }, { d: rrect(44, 140, 30, 36, 10), f: '#f2e4c4', t: 'rotate(14 59 158)' }]} />
        <Person {...h} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <OG sh={[{ d: `M${hip[0] + 4} ${top - 12}Q${hip[0] + 60} ${top - 16} ${hip[0] + 116} ${top - 10}L${hip[0] + 120} ${top + 6}H${hip[0] + 2}Z`, f: '#7aa6d6' }]} />
        <OG sh={[{ d: `M${bowl[0] - 14} ${bowl[1] - 6}H${bowl[0] + 14}Q${bowl[0] + 12} ${bowl[1] + 8} ${bowl[0]} ${bowl[1] + 8}Q${bowl[0] - 12} ${bowl[1] + 8} ${bowl[0] - 14} ${bowl[1] - 6}Z`, f: '#e6e8eb' }]} />
        <OG sh={[{ d: capsule([spoon[0] + 8, spoon[1] + 16], 1.8, spoon, 1.8), f: '#a3adb8' }, { d: ell(spoon, 4, 2.6), f: '#a3adb8' }]} />
        <Person {...h} only={['armF']} />
        <Chair x={278} y={226} flip />
        <Person {...z} />
      </Scene2>
    );
  },

  'sf-bt-bakim-baston': () => {
    const gy = 222;
    const elder: PersonProps = { ...C.hasan, x: 170, y: gy, s: 1.05, pose: { spine: -84, chest: -72, head: -78, legB: [104, 104], legF: [76, 86], armB: [92, 80], armF: { to: [222, 148] }, face: 'neutral' } };
    const e = rig(elder);
    return (
      <Scene2 bg="outdoor" gy={200}>
        <path d="M0 218Q160 206 320 214V240H0Z" fill={K.dirt} />
        <Rock x={18} y={214} s={0.5} /><Rock x={46} y={210} s={0.38} /><Rock x={292} y={210} s={0.5} /><Rock x={266} y={206} s={0.34} />
        <Cane top={[224, 150]} bottom={[236, gy]} />
        <Person {...elder} />
        <Person {...C.emre} x={104} y={gy} s={1} pose={{ ...POSE.walk, armF: { to: e.elbowB }, armB: [70, 40], face: 'calm' }} />
      </Scene2>
    );
  },

  /* ── Beceri envanteri ── */
  'sf-bt-beceri-gorusme': () => {
    const gy = 226;
    const top = gy - 56;
    const l: PersonProps = { ...C.zeynep, x: 72, y: gy - 44, ay: 'hip', pose: { ...POSE.sitChair, spine: -84, head: -80, armF: { to: [142, top - 4] }, armB: { to: [130, top - 2] }, handF: 'fist', face: 'neutral' } };
    const r: PersonProps = { ...C.yusuf, x: 248, y: gy - 44, ay: 'hip', flip: true, pose: { ...POSE.sitChair, spine: -90, armF: [-10, -40], handF: 'flat', face: 'speak' } };
    return (
      <Scene2 bg="indoor" gy={198}>
        <Chair x={66} y={gy} />
        <Chair x={254} y={gy} flip />
        <Person {...l} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...r} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Table x={104} y={gy} w={112} h={56} />
        <Notebook x={124} y={top - 12} w={60} h={12} lines={0} />
        <Pencil tip={[146, top - 6]} a={-130} l={22} />
        <Person {...l} only={['armF']} />
        <Person {...r} only={['armF']} />
      </Scene2>
    );
  },

  'sf-bt-beceri-kart': () => {
    const rows: [string, number][] = [['plus', 3], ['wheat', 2], ['hammer', 1], ['needle', 2]];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(48, 20, 224, 202, 8), f: '#fff' }]} />
        <Icon k="person" x={82} y={50} s={1.3} c={K.role.helper} />
        <path d="M110 50H230" stroke={K.ink} stroke-width={3.4} stroke-linecap="round" />
        <path d="M60 76H260" stroke="#c9bfa8" stroke-width={1.4} />
        {rows.map(([k, n], i) => {
          const yy = 100 + i * 34;
          return (
            <g key={k}>
              <Icon k={k} x={82} y={yy} s={1.05} />
              {[0, 1, 2].map((j) => <Star key={j} x={140 + j * 34} y={yy} on={j < n} />)}
            </g>
          );
        })}
      </Scene2>
    );
  },

  'sf-bt-beceri-usta-cirak': () => {
    const gy = 224;
    const top = gy - 74;
    const piece: P = [160, top - 9];
    const usta: PersonProps = { ...C.hasan, x: 92, y: gy, s: 1.04, pose: { ...POSE.standSide, spine: -78, chest: -66, head: -60, armF: { to: [piece[0] - 8, piece[1] - 4] }, armB: { to: [piece[0] - 22, piece[1] + 2] }, handF: 'fist', face: 'neutral' } };
    const cirak: PersonProps = { ...C.can, x: 230, y: gy, s: 1.1, flip: true, pose: { ...POSE.standSide, spine: -80, head: -66, armF: { to: [piece[0] + 14, piece[1]] }, armB: { to: [piece[0] + 22, piece[1] + 2] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={196} wall="#ece2cf">
        <Person {...usta} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...cirak} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Table x={104} y={gy} w={112} h={74} />
        <OG sh={[{ d: rrect(piece[0] - 30, piece[1] - 8, 60, 16, 5), f: '#e2bf8a' }, { d: `M${piece[0] - 18} ${piece[1] - 2}q6 4 12 0t12 0`, st: shade('#e2bf8a', 0.35), sw: 1.4 }]} />
        {/* bıçak */}
        <OG sh={[{ d: capsule([piece[0] - 14, piece[1] - 8], 2.6, [piece[0] - 2, piece[1] - 12], 2.6), f: M.wood }, { d: `M${piece[0] - 2} ${piece[1] - 13}L${piece[0] + 12} ${piece[1] - 10}L${piece[0] - 1} ${piece[1] - 8}Z`, f: '#c9d2da' }]} />
        {[[124, top - 5], [196, top - 5], [206, top - 4]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q3 -4 6 0`} stroke="#e2bf8a" stroke-width={2} fill="none" />)}
        <Person {...usta} only={['armF']} />
        <Person {...cirak} only={['armF']} />
      </Scene2>
    );
  },

  /* ── Ruh sağlığı ── */
  'sf-bt-ruh-yoldas': () => {
    const gy = 222;
    const s = 1.04;
    const hipY = gy - 46 * s;
    const m: PersonProps = { ...C.mehmet, x: 192, y: hipY, ay: 'hip', s, pose: { ...SIT, spine: -82, chest: -70, head: -60, armF: { at: 'kneeF', d: [-2, -6] }, armB: { at: 'kneeB', d: [-6, -6] }, face: 'worried' } };
    const mr = rig(m);
    const z: PersonProps = { ...C.zeynep, x: 120, y: hipY, ay: 'hip', s, pose: { ...SIT, head: -80, armF: { to: [mr.nape[0] + 2, mr.nape[1] + 8] }, handF: 'flat', face: 'speak' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={292} y={180} s={0.9} />
        <OG sh={[{ d: rrect(70, gy - 50 * s, 180, 9, 3), f: M.wood }, { d: rrect(82, gy - 50 * s + 8, 8, 50 * s - 6, 2), f: shade(M.wood, 0.2) }, { d: rrect(230, gy - 50 * s + 8, 8, 50 * s - 6, 2), f: shade(M.wood, 0.2) }]} />
        <Person {...z} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...m} />
        <Person {...z} only={['armF']} />
      </Scene2>
    );
  },

  'sf-bt-ruh-anma-tasi': () => {
    const gy = 222;
    const st: P = [150, gy];
    const flower: P = [st[0] + 38, gy - 6];
    return (
      <Scene2 bg="outdoor">
        <Tree x={64} y={196} s={1.3} />
        <OG sh={[{ d: `M${st[0] - 34} ${gy}V${gy - 78}Q${st[0]} ${gy - 104} ${st[0] + 34} ${gy - 78}V${gy}Z`, f: '#b8b5ad' }, { d: `M${st[0] + 14} ${gy}V${gy - 90}Q${st[0] + 28} ${gy - 86} ${st[0] + 34} ${gy - 78}V${gy}Z`, f: shade('#b8b5ad', 0.15), no: true }]} />
        <path d={`M${st[0] - 20} ${gy - 76}H${st[0] + 20}M${st[0] - 20} ${gy - 62}H${st[0] + 14}M${st[0] - 20} ${gy - 48}H${st[0] + 20}M${st[0] - 20} ${gy - 34}H${st[0] + 10}`} stroke={shade('#b8b5ad', 0.4)} stroke-width={3} stroke-linecap="round" />
        {[[-20, '#e5533d'], [-8, '#f2c14e'], [6, '#e5533d']].map(([dx, c], i) => (
          <g key={i}><path d={`M${st[0] + (dx as number)} ${gy}V${gy - 12}`} stroke={K.leaf} stroke-width={2} /><circle cx={st[0] + (dx as number)} cy={gy - 14} r={4.5} fill={c as string} stroke={K.out} stroke-width={1.2} /></g>
        ))}
        <Person {...C.fatma} x={226} y={gy + 2} s={1} flip pose={{ ...POSE.kneel, spine: -70, head: -60, armF: { to: [flower[0] + 2, flower[1] - 8] }, face: 'neutral' }} />
        <path d={`M${flower[0]} ${flower[1] + 4}V${flower[1] - 10}`} stroke={K.leaf} stroke-width={2} />
        <circle cx={flower[0]} cy={flower[1] - 12} r={5} fill="#f7f1f7" stroke={K.out} stroke-width={1.2} />
        <Person {...C.elif} x={276} y={gy - 4} s={0.92} flip pose={{ ...POSE.standSide, face: 'neutral' }} />
      </Scene2>
    );
  },

  'sf-bt-ruh-dinleme-halkasi': () => {
    const gy = 222;
    const s = 0.9;
    const hipY = gy - 24;
    const sit = (lk: Look, x: number, flip: boolean, extra: Partial<Pose> = {}) => <Person {...lk} sleeve="long" x={x} y={hipY} ay="hip" s={s} flip={flip} pose={{ ...SIT, legB: [10, 96], legF: [6, 94], ...extra }} />;
    return (
      <Scene2 bg="night">
        <Log a={[10, gy - 10]} b={[106, gy - 10]} r={11} />
        <Log a={[310, gy - 10]} b={[214, gy - 10]} r={11} />
        {sit(C.fatma, 30, false, { face: 'neutral' })}
        {sit(C.yusuf, 80, false, { armF: [-10, -30], handF: 'flat', face: 'speak' })}
        {sit(C.emre, 240, true, { face: 'neutral' })}
        {sit(C.zeynep, 290, true, { face: 'neutral' })}
        <circle cx={160} cy={200} r={50} fill="#ffb02e" opacity={0.18} />
        <Campfire x={160} y={gy + 2} s={0.9} />
      </Scene2>
    );
  },

  /* ── Yabancılarla karşılaşma ── */
  'sf-bt-yabanci-eller-gorunur': () => {
    const gy = 224;
    return (
      <Scene2 bg="outdoor">
        <path d={`M0 ${gy + 2}Q160 ${gy - 12} 330 ${gy - 6}`} stroke={K.dirt} stroke-width={22} fill="none" opacity={0.7} />
        <Person {...C.mehmet} x={44} y={gy - 4} s={0.94} pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Person {...C.elif} x={112} y={gy} s={1.02} pose={{ ...POSE.standSide, armF: [40, -10], armB: [50, -6], handF: { shape: 'flat', a: 90 }, handB: { shape: 'flat', a: 90 }, face: 'calm' }} />
        <Person {...TRAV} x={238} y={gy} s={1} flip pose={{ ...POSE.standSide, spine: -86, face: 'neutral' }} back={pack} />
        <Waves x={148} y={70} a={0} n={2} r={6} />
      </Scene2>
    );
  },

  'sf-bt-yabanci-su-ikram': () => {
    const gy = 224;
    const meet: P = [170, 128];
    return (
      <Scene2 bg="outdoor">
        <Person {...C.elif} x={112} y={gy} s={1.02} pose={{ ...POSE.standSide, armF: { to: [meet[0] - 6, meet[1] - 4] }, handF: 'fist', face: 'calm' }} />
        <Bottle x={meet[0]} y={meet[1] + 10} s={1} a={0} fill={0.8} />
        <Person {...TRAV} x={232} y={gy} s={1} flip pose={{ ...POSE.standSide, spine: -84, armF: { to: [meet[0] + 8, meet[1] - 4] }, handF: 'fist', face: 'neutral' }} back={pack} />
      </Scene2>
    );
  },

  'sf-bt-yabanci-geri-adim': () => {
    const gy = 224;
    return (
      <Scene2 bg="outdoor">
        <path d={`M0 ${gy + 2}Q160 ${gy - 12} 330 ${gy - 10}`} stroke={K.dirt} stroke-width={22} fill="none" opacity={0.7} />
        <Person {...C.elif} x={84} y={gy} s={1.02} pose={{ ...POSE.standSide, spine: -96, legB: [118, 104], legF: [86, 90], armF: [70, -70], armB: [80, -60], handF: { shape: 'flat', a: 0 }, handB: { shape: 'flat', a: 0 }, face: 'neutral' }} />
        <Arrow from={[96, 46]} to={[50, 46]} w={5} />
        <Person {...TRAV} x={238} y={gy} s={1} flip pose={{ ...POSE.standSide, spine: -84, armF: [10, -20], handF: 'flat', face: 'worried' }} back={pack} />
        <Arrow from={[262, 204]} to={[310, 198]} w={5} />
      </Scene2>
    );
  },

  /* ── Ritüel ve moral ── */
  'sf-bt-ritual-ortak-aksam': () => {
    const gy = 222;
    const s = 1;
    const hipY = gy - 26;
    const m: PersonProps = { ...C.mehmet, sleeve: 'long', x: 70, y: hipY, ay: 'hip', s, pose: { ...SIT, legB: [-4, 96], legF: [-8, 94], armB: { to: [102, 150] }, armF: { to: [84, 168] }, face: 'speak' } };
    const clap = (lk: Look, x: number, y: number, ss: number): PersonProps => {
      const base: PersonProps = { ...lk, x, y, s: ss, flip: true, pose: { ...POSE.standSide, face: 'calm' } };
      const r = rig(base);
      const pt: P = [r.chest[0] - 14 * ss, r.chest[1] - 2];
      return { ...base, pose: { ...base.pose, armF: { to: pt }, armB: { to: [pt[0] + 2, pt[1] + 2] }, handF: 'flat', handB: 'flat' } };
    };
    return (
      <Scene2 bg="night">
        <Log a={[20, gy - 10]} b={[124, gy - 10]} r={11} />
        <circle cx={160} cy={204} r={50} fill="#ffb02e" opacity={0.18} />
        <Person {...m} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Baglama a={[118, 128]} b={[76, 168]} />
        <Person {...m} only={['armF']} />
        <Campfire x={160} y={gy + 2} s={0.9} />
        <Person {...clap(C.zeynep, 236, gy, 1)} />
        <Person {...clap(C.deniz, 280, gy + 4, 1)} />
        <Waves x={52} y={110} a={-140} n={2} r={7} />
      </Scene2>
    );
  },

  'sf-bt-ritual-kuyu-kutlama': () => {
    const gy = 222;
    const wx = 124;
    const bucket: P = [wx + 14, 96];
    const clap = (lk: Look, x: number, y: number, ss: number): PersonProps => {
      const base: PersonProps = { ...lk, x, y, s: ss, flip: true, pose: { ...POSE.standSide, face: 'calm' } };
      const r = rig(base);
      const pt: P = [r.chest[0] - 14 * ss, r.chest[1] - 2];
      return { ...base, pose: { ...base.pose, armF: { to: pt }, armB: { to: [pt[0] + 2, pt[1] + 2] }, handF: 'flat', handB: 'flat' } };
    };
    return (
      <Scene2 bg="outdoor">
        {/* kuyu */}
        <OG sh={[{ d: rrect(wx - 50, gy - 56, 100, 56, 4), f: '#b8b5ad' }]} />
        <path d={`M${wx - 50} ${gy - 38}H${wx + 50}M${wx - 50} ${gy - 20}H${wx + 50}M${wx - 20} ${gy - 56}V${gy - 38}M${wx + 14} ${gy - 56}V${gy - 38}M${wx - 34} ${gy - 38}V${gy - 20}M${wx + 30} ${gy - 38}V${gy - 20}M${wx - 10} ${gy - 20}V${gy}`} stroke={shade('#b8b5ad', 0.3)} stroke-width={1.6} />
        <OG sh={[{ d: rrect(wx - 46, gy - 128, 7, 74, 2), f: M.log }, { d: rrect(wx + 39, gy - 128, 7, 74, 2), f: M.log }, { d: rrect(wx - 52, gy - 134, 104, 9, 3), f: M.log }]} />
        <path d={`M${bucket[0]} ${gy - 130}V${bucket[1] - 14}`} stroke={M.rope} stroke-width={2.4} />
        <Person {...C.emre} x={64} y={gy} s={1.02} pose={{ ...POSE.standSide, armF: { to: [bucket[0] - 14, bucket[1] - 18] }, armB: { to: [bucket[0] - 20, bucket[1] - 10] }, handF: 'fist', handB: 'fist', face: 'calm' }} />
        <OG sh={[{ d: `M${bucket[0] - 14} ${bucket[1] - 12}H${bucket[0] + 14}L${bucket[0] + 11} ${bucket[1] + 12}H${bucket[0] - 11}Z`, f: '#8e99a6' }, { d: ell([bucket[0], bucket[1] - 12], 14, 3.5), f: K.water }]} />
        <path d={`M${bucket[0] - 14} ${bucket[1] - 12}Q${bucket[0]} ${bucket[1] - 30} ${bucket[0] + 14} ${bucket[1] - 12}`} stroke={K.out} stroke-width={1.8} fill="none" />
        <Person {...clap(C.fatma, 222, gy - 4, 0.96)} />
        <Person {...clap(C.can, 258, gy + 4, 1)} />
        <Person {...clap(C.elif, 296, gy - 2, 0.98)} />
      </Scene2>
    );
  },

  'sf-bt-ritual-hikaye': () => {
    const gy = 222;
    const book: P = [132, 138];
    const h: PersonProps = { ...C.hasan, x: 96, y: gy - 44, ay: 'hip', pose: { ...POSE.sitChair, head: -76, armF: { to: [book[0] + 6, book[1] + 6] }, armB: { to: [book[0] - 4, book[1] + 8] }, face: 'speak' } };
    const fl = (lk: Look, x: number, ss: number) => <Person {...lk} x={x} y={gy + 4} s={ss} flip pose={{ ...POSE.kneelSit, armF: { at: 'kneeF', d: [0, -4] }, armB: { at: 'kneeB', d: [0, -4] }, face: 'calm' }} />;
    return (
      <Scene2 bg="outdoor">
        <Tree x={40} y={190} s={1.25} />
        <Chair x={90} y={gy} />
        <Person {...h} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <OG sh={[{ d: `M${book[0] - 18} ${book[1] - 18}L${book[0]} ${book[1] - 10}L${book[0] + 18} ${book[1] - 20}L${book[0] + 18} ${book[1] + 10}L${book[0]} ${book[1] + 18}L${book[0] - 18} ${book[1] + 10}Z`, f: M.paper }, { d: `M${book[0]} ${book[1] - 10}V${book[1] + 18}`, st: K.out, sw: 1.4 }]} />
        <Person {...h} only={['armF']} />
        {fl(C.zeynep, 292, 0.95)}
        {fl(C.ayse, 200, 0.95)}
        {fl(C.ali, 246, 0.95)}
      </Scene2>
    );
  },

  /* ── Patika açma ── */
  'sf-bt-patika-yarim-kurali': () => {
    const o: P = [30, 210];
    const slope: P = [300, 210 - 270 * 0.5];
    const path: P = [300, 210 - 270 * 0.25];
    return (
      <Scene2 bg="outdoor" gy={230}>
        <path d={`M${o[0] - 40} ${o[1] + 20}L${slope[0] + 40} ${slope[1] - 20}V240H-10Z`} fill={K.grassShade} />
        <path d={`M${o[0] - 40} ${o[1] + 20}L${slope[0] + 40} ${slope[1] - 20}`} stroke={K.out} stroke-width={2} />
        <Tree x={250} y={86} s={0.5} kind="pine" />
        <Tree x={120} y={150} s={0.45} kind="pine" />
        <path d={`M${o[0]} ${o[1]}L${path[0]} ${path[1]}`} stroke={K.out} stroke-width={10} stroke-linecap="round" />
        <path d={`M${o[0]} ${o[1]}L${path[0]} ${path[1]}`} stroke={M.soil} stroke-width={7} stroke-linecap="round" />
        <path d={`M${o[0]} ${o[1]}H${path[0]}`} stroke={K.ink} stroke-width={1.6} stroke-dasharray="5 5" />
        <Txt x={196} y={110} t="%16" size={20} c={K.danger} />
        <Label x={262} y={176} text="%8" size={18} />
      </Scene2>
    );
  },

  'sf-bt-patika-dal-kesim': () => {
    const by = 110;
    const c1 = 132, c2 = 158;
    return (
      <Scene2 bg="outdoor" gy={238}>
        <OG sh={[{ d: `M20 0H74L80 240H14Z`, f: K.trunk }, { d: `M60 0H74L80 240H66Z`, f: shade(K.trunk, 0.15), no: true }]} />
        {/* dal */}
        <OG sh={[{ d: `M74 ${by - 22}Q90 ${by - 18} 120 ${by - 16}L300 ${by - 6}V${by + 8}L120 ${by + 14}Q90 ${by + 18} 76 ${by + 26}Z`, f: shade(K.trunk, 0.05) }]} />
        <OG sh={[{ d: circ([290, by - 22], 18), f: K.leaf }, { d: circ([312, by - 6], 16), f: K.leaf }]} />
        {/* 1: alttan sığ kesik, 2: üstten kesim */}
        <path d={`M${c1} ${by + 14}V${by + 4}`} stroke={K.out} stroke-width={4} />
        <path d={`M${c2} ${by - 14}V${by + 12}`} stroke={K.out} stroke-width={3} stroke-dasharray="5 4" />
        <Arrow from={[c1, by + 66]} to={[c1, by + 22]} w={5} />
        <Arrow from={[c2, by - 66]} to={[c2, by - 20]} w={5} />
        <OG sh={[{ d: circ([c1 - 26, by + 50], 13), f: '#fff' }, { d: circ([c2 + 26, by - 50], 13), f: '#fff' }]} />
        <Txt x={c1 - 26} y={by + 56} t="1" size={17} />
        <Txt x={c2 + 26} y={by - 44} t="2" size={17} />
      </Scene2>
    );
  },

  'sf-bt-patika-su-kesici': () => {
    // yukarıdan: üst taraf yokuş yukarı, alt taraf yokuş aşağı; patika yatay
    const y0 = 96, y1 = 160;
    const bar0: P = [128, y0 - 8], bar1: P = [178, y1 + 8];
    return (
      <Scene2 bg="outdoor" gy={0}>
        <rect width={320} height={240} fill={K.grass} />
        <rect width={320} height={y0} fill={shade(K.grass, 0.1)} />
        <path d="M0 30Q160 18 320 30M0 62Q160 50 320 62" stroke={K.grassShade} stroke-width={2} fill="none" />
        <rect x={-5} y={y0} width={330} height={y1 - y0} fill={M.soil} stroke={K.out} stroke-width={1.5} />
        {Array.from({ length: 7 }, (_, i) => {
          const p = lerp(bar0, bar1, i / 6);
          return <OG key={i} sh={[{ d: ell(p, 9, 7.5), f: M.stone }]} />;
        })}
        <Arrow from={[18, 128]} to={[112, 128]} color={K.water} w={6} />
        <Arrow from={[150, 120]} to={[190, 206]} color={K.water} w={6} bend={0.12} />
        <path d={`M${bar0[0] - 26} ${y0 - 2}A40 40 0 0 1 ${bar0[0] + 8} ${y0 + 4}`} stroke={K.action} stroke-width={3} fill="none" />
        <Label x={96} y={70} text="45–60°" size={14} />
      </Scene2>
    );
  },

  /* ── Basit köprü ── */
  'sf-bt-kopru-kutuk-doseme': () => {
    const gy = 176;
    const sleepers = [54, 160, 266];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={64} fill="#7d6a4a" />
        <path d={`M10 ${gy + 6}q20 -4 40 0t40 0M180 ${gy + 8}q20 -4 40 0t40 0`} stroke={K.water} stroke-width={3} fill="none" />
        <path d="M0 196q30 -6 60 0t60 0t60 0t60 0t80 0" stroke="#5d4c34" stroke-width={2} fill="none" />
        {/* enine kütükler (uçtan), üçte ikisi gömülü */}
        {sleepers.map((x) => <OG key={x} sh={[{ d: circ([x, gy + 2], 15), f: M.logEnd }, { d: circ([x, gy + 2], 7), f: shade(M.logEnd, 0.15), no: true }]} />)}
        <rect x={0} y={gy + 8} width={320} height={60} fill="#7d6a4a" opacity={0.85} />
        {/* boyuna kütükler (yandan biri görünür) */}
        <Log a={[16, gy - 24]} b={[304, gy - 24]} r={11} end={false} />
        <Dim a={[sleepers[0], gy + 34]} b={[sleepers[1], gy + 34]} />
        <Label x={107} y={gy + 54} text="1,8–3 m" size={13} />
      </Scene2>
    );
  },

  'sf-bt-kopru-ip-korkuluk': () => {
    const gy = 200;
    const top = 168;
    const rope: [P, P] = [[28, top - 66], [292, top - 66]];
    const hold: P = [176, top - 66 + 3];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d={`M0 ${gy - 30}H60L104 ${gy + 40}H216L260 ${gy - 30}H320V240H0Z`} fill={M.soilDark} />
        <Water x={100} y={gy + 6} w={120} h={40} />
        <path d={`M0 ${gy - 30}H60L104 ${gy + 40}H216L260 ${gy - 30}H320`} stroke={K.out} stroke-width={1.5} fill="none" />
        <Rock x={44} y={gy - 28} s={0.6} /><Rock x={278} y={gy - 28} s={0.6} />
        <Log a={[20, top]} b={[300, top]} r={9} />
        <OG sh={[{ d: rrect(24, top - 74, 7, 76, 2), f: M.wood }, { d: rrect(289, top - 74, 7, 76, 2), f: M.wood }]} />
        <path d={`M${rope[0][0]} ${rope[0][1]}Q160 ${rope[0][1] + 4} ${rope[1][0]} ${rope[1][1]}`} stroke={K.out} stroke-width={4} fill="none" />
        <path d={`M${rope[0][0]} ${rope[0][1]}Q160 ${rope[0][1] + 4} ${rope[1][0]} ${rope[1][1]}`} stroke={M.rope} stroke-width={2.4} fill="none" />
        <Person {...C.emre} x={150} y={top - 9} s={0.82} pose={{ ...POSE.walk, armF: { to: hold }, handF: 'fist', face: 'neutral' }} />
      </Scene2>
    );
  },

  'sf-bt-kopru-yuk-testi': () => {
    const gy = 200;
    const top = 166;
    const z: PersonProps = { ...C.zeynep, x: 196, y: top - 9, s: 0.82, pose: { ...POSE.walk, face: 'neutral' } };
    const zr = rig(z);
    const waist: P = [zr.hip[0] - 4, zr.hip[1] - 8];
    const m1: PersonProps = { ...C.mehmet, x: 30, y: gy - 30, s: 0.86, pose: { ...POSE.standSide, spine: -98, armF: { to: [64, 132] }, armB: { to: [58, 134] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const m2: PersonProps = { ...C.emre, x: 76, y: gy - 28, s: 0.86, pose: { ...POSE.standSide, spine: -98, armF: { to: [108, 136] }, armB: { to: [102, 138] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const h1 = rig(m1).handF, h2 = rig(m2).handF;
    const rope = `M${f1(h1[0] - 10)} ${f1(h1[1] + 8)}L${f1(h1[0])} ${f1(h1[1])}L${f1(h2[0])} ${f1(h2[1])}Q${f1((h2[0] + waist[0]) / 2)} ${f1(waist[1] + 18)} ${f1(waist[0])} ${f1(waist[1])}`;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d={`M0 ${gy - 30}H110L140 ${gy + 40}H260L290 ${gy - 30}H320V240H0Z`} fill={M.soilDark} />
        <Water x={136} y={gy + 6} w={130} h={40} />
        <Log a={[100, top]} b={[306, top]} r={9} />
        {/* deneme taşları */}
        <OG sh={[{ d: ell([128, top - 14], 12, 7), f: M.stone }, { d: ell([132, top - 26], 10, 6), f: shade(M.stone, 0.08) }]} />
        <Person {...m1} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...m2} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <path d={rope} stroke={K.out} stroke-width={4} fill="none" />
        <path d={rope} stroke={M.rope} stroke-width={2.4} fill="none" />
        <Person {...m1} only={['armF']} />
        <Person {...m2} only={['armF']} />
        <Person {...z} />
        <path d={`M${waist[0] - 8} ${waist[1]}H${waist[0] + 16}`} stroke={M.rope} stroke-width={3.4} />
      </Scene2>
    );
  },

  /* ── Uzun süreli kamp ── */
  'sf-bt-kamp-yer-secimi': () => <Terrain kind="tent" />,

  'sf-bt-kamp-tuvalet-mesafe': () => (
    <Scene2 bg="outdoor" gy={0}>
      <rect width={320} height={240} fill={K.grass} />
      <path d="M30 0Q60 80 34 140T50 240H86Q100 190 74 140T70 0Z" fill={K.water} stroke={K.out} stroke-width={1.5} />
      <path d="M48 40q4 -3 8 0M58 120q4 -3 8 0M60 200q4 -3 8 0" stroke={K.waterLight} stroke-width={2} fill="none" />
      {/* tuvalet kulübesi (önden, tanınır biçim: eğik çatı, kapıda ay) */}
      <OG sh={[
        { d: rrect(244, 92, 50, 62, 3), f: '#a8724a' },
        { d: 'M236 96L302 84L304 92L238 104Z', f: '#7b4e2e' },
        { d: rrect(254, 106, 30, 46, 2), f: '#8c5c3a' },
      ]} />
      <path d="M272 116a5 5 0 1 0 0 10a6.5 6.5 0 0 1 0 -10Z" fill="#f4e3a1" stroke={K.out} stroke-width={1.2} />
      <circle cx={279} cy={132} r={2} fill={K.ink} />
      <Tree x={292} y={226} s={0.4} />
      <Dim a={[86, 124]} b={[238, 124]} />
      <Label x={163} y={104} text="30 m" size={18} />
      <Icon k="drop" x={58} y={78} s={1.1} />
    </Scene2>
  ),

  'sf-bt-kamp-su-yukari-asagi': () => {
    const gy = 168;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Water x={0} y={196} w={320} h={44} />
        <rect x={0} y={gy} width={320} height={28} fill={K.grass} />
        <Arrow from={[30, 220]} to={[290, 220]} color={K.waterLight} w={5} />
        <Person {...C.elif} x={64} y={192} s={0.9} pose={{ ...POSE.kneelOne, spine: -56, chest: -44, head: -30, armF: { to: [102, 196] }, face: 'neutral' }} />
        <OG sh={[{ d: 'M92 194H114L111 214H95Z', f: '#8e99a6' }, { d: ell([103, 194], 11, 3), f: K.water }]} />
        <Icon k="drop" x={64} y={64} s={1.3} />
        <Ok x={84} y={56} r={10} />
        <Person {...C.mehmet} x={236} y={192} s={0.9} pose={{ ...POSE.kneelOne, spine: -56, chest: -44, head: -30, armF: { to: [272, 202] }, face: 'neutral' }} />
        <OG sh={[{ d: ell([276, 204], 13, 4), f: '#e6e8eb' }]} />
        <OG sh={[{ d: ell([206, 190], 14, 4), f: '#e6e8eb' }, { d: ell([206, 185], 12, 3.4), f: '#e6e8eb' }, { d: ell([206, 180], 10, 3), f: '#e6e8eb' }]} />
      </Scene2>
    );
  },

  /* ── Yabani hayvanlar ── */
  'sf-bt-yaban-yiyecek-asma': () => {
    const gy = 224;
    const bag: P = [160, 100];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: rrect(20, 20, 26, gy - 18, 6), f: K.trunk }, { d: rrect(274, 20, 26, gy - 18, 6), f: K.trunk }]} />
        <OG sh={[{ d: circ([33, 18], 40), f: K.leaf }, { d: circ([287, 18], 40), f: K.leaf }]} />
        <path d={`M46 60Q${bag[0]} 74 274 60`} stroke={K.out} stroke-width={4} fill="none" />
        <path d={`M46 60Q${bag[0]} 74 274 60`} stroke={M.rope} stroke-width={2.4} fill="none" />
        <path d={`M${bag[0]} 67V${bag[1] - 16}`} stroke={M.rope} stroke-width={2.4} />
        <G x={bag[0]} y={bag[1] + 4} s={1.8}><OG ow={OW / 1.8} sh={[{ d: 'M-8 -6Q-11 4 -9 10H9Q11 4 8 -6Z', f: '#c0603e' }, { d: 'M-5 -6L-7 -11H7L5 -6Z', f: '#c0603e' }, { d: 'M-6 -7H6', st: '#7a3a22', sw: 2 }]} /></G>
        <Dim a={[bag[0], bag[1] + 26]} b={[bag[0], gy]} />
        <Label x={bag[0] + 28} y={170} text="4 m" size={15} />
        <Dim a={[50, bag[1]]} b={[bag[0] - 20, bag[1]]} />
        <Label x={96} y={bag[1] - 16} text="3 m" size={15} />
      </Scene2>
    );
  },

  'sf-bt-yaban-agil-kopek': () => {
    const gy = 214;
    const wt = 150;
    return (
      <Scene2 bg="night" gy={gy}>
        {[52, 100, 148, 190].map((x, i) => <Sheep key={i} x={x} y={wt + 18 + (i % 2) * 4} s={1.05} />)}
        {/* taş ağıl duvarı */}
        <OG sh={[{ d: rrect(14, wt, 200, gy - wt + 2, 4), f: '#7d7a72' }]} />
        <path d={`M14 ${wt + 20}H214M14 ${wt + 42}H214M40 ${wt}V${wt + 20}M90 ${wt}V${wt + 20}M150 ${wt}V${wt + 20}M194 ${wt}V${wt + 20}M66 ${wt + 20}V${wt + 42}M120 ${wt + 20}V${wt + 42}M176 ${wt + 20}V${wt + 42}M40 ${wt + 42}V${gy}M100 ${wt + 42}V${gy}M160 ${wt + 42}V${gy}`} stroke={shade('#7d7a72', 0.3)} stroke-width={1.5} />
        {/* kapı */}
        <OG sh={[{ d: rrect(214, wt - 10, 46, gy - wt + 12, 2), f: '#8a6a42' }, { d: `M218 ${wt + 8}H256M218 ${wt + 30}H256M218 ${wt + 52}H256`, st: shade('#8a6a42', 0.35), sw: 2 }]} />
        <Dog x={276} y={gy + 14} s={1.25} />
      </Scene2>
    );
  },

  'sf-bt-yaban-eldiven': () => {
    const gy = 222;
    const p: PersonProps = { ...C.emre, x: 104, y: gy, s: 1.02, pose: { ...POSE.bend, spine: -30, chest: -20, head: -18, legB: [100, 98], legF: [70, 100], armF: { to: [168, 168] }, armB: { to: [160, 172] }, handF: 'none', handB: 'none', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <Log a={[140, gy - 10]} b={[268, gy - 10]} r={11} end={false} />
        <Log a={[160, 172]} b={[290, 210]} r={10} />
        <Person {...p} />
        <Glove w={r.wristF} a={r.foreF} />
        <Glove w={r.wristB} a={r.foreB} dark />
        {/* iç kare: çıplak elle taş altı */}
        <OG sh={[{ d: rrect(216, 16, 92, 82, 8), f: K.closeup }]} />
        <OG sh={[{ d: 'M250 84L258 62L280 54L300 62L304 76L290 80Z', f: M.stone }]} />
        <path d="M222 88H306" stroke={K.out} stroke-width={1.5} />
        <Hand x={226} y={80} a={100} s={0.4} pose="open" skin={0} arm={30} />
        <Bad x={298} y={26} r={10} />
      </Scene2>
    );
  },

  /* ── Kış hazırlığı ── */
  'sf-bt-kis-istif': () => {
    const gy = 214;
    const x0 = 64, x1 = 256;
    const rows = 5;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* yerden yükselten yassı taşlar ve üstünde kütük */}
        <OG sh={[x0 + 2, (x0 + x1) / 2 - 14, x1 - 30].map((sx) => ({ d: `M${sx} ${gy + 2}Q${sx - 2} ${gy - 14} ${sx + 6} ${gy - 15}H${sx + 22}Q${sx + 30} ${gy - 14} ${sx + 28} ${gy + 2}Z`, f: M.stone } as Sh))} />
        <OG sh={[{ d: rrect(x0 - 4, gy - 24, x1 - x0 + 8, 10, 3), f: M.log }]} />
        {Array.from({ length: rows }, (_, j) => (
          <g key={j}>
            {Array.from({ length: 9 }, (_, i) => {
              const cx = x0 + 12 + i * 21 + (j % 2) * 6;
              const cy = gy - 34 - j * 20;
              return <OG key={i} sh={[{ d: `M${cx - 10} ${cy + 9}L${cx} ${cy - 10}L${cx + 10} ${cy + 9}Z`, f: i % 3 ? M.logEnd : shade(M.logEnd, 0.08) }]} />;
            })}
          </g>
        ))}
        {/* yalnız üstü sac */}
        <OG sh={[{ d: `M${x0 - 14} ${gy - 136}L${x1 + 14} ${gy - 130}L${x1 + 14} ${gy - 122}L${x0 - 14} ${gy - 128}Z`, f: '#a3adb8' }]} />
        <path d={`M${x0} ${gy - 133}V${gy - 126}M${x0 + 40} ${gy - 132}V${gy - 125}M${x0 + 80} ${gy - 131}V${gy - 124}M${x0 + 120} ${gy - 130}V${gy - 123}M${x0 + 160} ${gy - 129}V${gy - 122}`} stroke={shade('#a3adb8', 0.3)} stroke-width={1.4} />
        <Arrow from={[8, 120]} to={[54, 120]} w={5} />
        <Arrow from={[266, 120]} to={[312, 120]} w={5} />
        <Arrow from={[8, 170]} to={[54, 170]} w={5} />
        <Arrow from={[266, 170]} to={[312, 170]} w={5} />
      </Scene2>
    );
  },

  'sf-bt-kis-kuru-odun': () => (
    <Scene2 bg="closeup">
      <Split x={92} y={196} dry />
      <Split x={232} y={196} />
      <Ok x={86} y={44} r={16} />
      <Bad x={238} y={44} r={16} />
    </Scene2>
  ),

  'sf-bt-kis-yalitim': () => {
    const gy = 200;
    return (
      <Scene2 bg="indoor" gy={gy}>
        {/* kapı ve altına bez */}
        <OG sh={[{ d: rrect(18, gy - 116, 60, 116, 2), f: '#a8724a' }]} />
        <OG sh={[{ d: rrect(14, gy - 12, 70, 14, 7), f: '#c6574e' }]} />
        {/* pencere ve kalın perde */}
        <OG sh={[{ d: rrect(226, 52, 70, 58, 2), f: '#bfe3f5' }]} />
        <OG sh={[{ d: rrect(214, 40, 96, 8, 3), f: '#6d4c35' }, { d: 'M218 46H262V128Q240 132 218 128Z', f: '#8f6fc2' }, { d: 'M262 46H306V128Q284 132 262 128Z', f: shade('#8f6fc2', 0.1) }, { d: 'M232 50V124M248 50V124M276 50V124M292 50V124', st: shade('#8f6fc2', 0.25), sw: 1.4 }]} />
        {/* zemin: saman ve halı */}
        <rect x={0} y={gy} width={320} height={40} fill="#e2c46e" />
        <path d="M10 210l8 -3M40 214l9 -2M300 212l-9 -3M270 218l8 -2" stroke="#b8963c" stroke-width={2} />
        <OG sh={[{ d: rrect(96, gy + 4, 140, 22, 3), f: '#c1554b' }, { d: rrect(104, gy + 8, 124, 14, 2), f: '#e08a5a', no: true }]} />
        {/* soba */}
        <OG sh={[{ d: rrect(144, gy - 66, 44, 66, 6), f: '#4c5563' }, { d: rrect(152, gy - 44, 28, 18, 3), f: '#ff8a1f' }, { d: rrect(160, 20, 12, gy - 86, 2), f: '#6f7782' }]} />
        <Arrow from={[200, 120]} to={[244, 168]} bend={-0.4} w={5} />
        <Arrow from={[132, 120]} to={[94, 168]} bend={0.4} w={5} />
      </Scene2>
    );
  },

  /* ── Yaz hazırlığı ── */
  'sf-bt-yaz-golgelik': () => {
    const gy = 222;
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: circ([290, 30], 18), f: '#ffd64a' }]} />
        <g stroke="#ffd64a" stroke-width={3} stroke-linecap="round">{[150, 180, 210, 240, 120].map((a) => { const p1 = pol([290, 30], a, 24), p2 = pol([290, 30], a, 36); return <path key={a} d={`M${p1[0]} ${p1[1]}L${p2[0]} ${p2[1]}`} />; })}</g>
        <path d={`M30 ${gy - 6}H230L246 ${gy + 14}H18Z`} fill={K.grassShade} opacity={0.9} />
        <OG sh={[{ d: rrect(30, 70, 7, gy - 66, 2), f: M.log }, { d: rrect(222, 70, 7, gy - 66, 2), f: M.log }, { d: rrect(20, 64, 220, 8, 2), f: M.log }]} />
        {/* dal örtü */}
        <OG sh={[30, 62, 94, 126, 158, 190, 222].map((x, i) => ({ d: ell([x + (i % 2) * 6, 58 - (i % 2) * 4], 24, 12), f: i % 2 ? K.leaf : shade(K.leaf, 0.12) }))} />
        <Table x={70} y={gy} w={120} h={60} />
        <Person {...C.elif} x={56} y={gy} s={0.98} pose={{ ...POSE.standSide, spine: -84, armF: { to: [110, gy - 64] }, face: 'neutral' }} />
        <Person {...C.yusuf} x={206} y={gy} s={0.98} flip pose={{ ...POSE.standSide, spine: -84, armF: { to: [160, gy - 64] }, face: 'neutral' }} />
        <OG sh={[{ d: rrect(118, gy - 70, 34, 8, 2), f: '#c49a52' }, { d: ell([128, gy - 72], 6, 4), f: '#e5533d' }, { d: ell([142, gy - 72], 6, 4), f: '#6c9c5a' }]} />
      </Scene2>
    );
  },

  'sf-bt-yaz-su-icme': () => {
    const gy = 224;
    const p0: PersonProps = { ...C.mehmet, x: 150, y: gy, s: 1.08, pose: { ...POSE.standSide, head: -100 } };
    const m = rig(p0).mouth;
    const cup: P = [m[0] + 8, m[1] + 4];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: [cup[0] + 2, cup[1] + 10] }, handF: 'fist', face: 'closed' } };
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: circ([292, 30], 16), f: '#ffd64a' }]} />
        <path d="M0 214H320" stroke={K.grassShade} stroke-width={2} />
        {/* çapa */}
        <OG sh={[{ d: capsule([30, 226], 2.4, [104, 220], 2.4), f: M.wood }, { d: 'M104 212L110 212L112 230L104 230Z', f: M.iron }]} />
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <OG sh={[{ d: `M${cup[0] - 7} ${cup[1] - 12}H${cup[0] + 7}L${cup[0] + 5} ${cup[1] + 8}H${cup[0] - 5}Z`, f: '#e6e8eb', t: `rotate(-30 ${cup[0]} ${cup[1]})` }]} />
        <Person {...p} only={['armF']} />
        <Timer x={40} y={44} r={15} text="15–20 dk" />
      </Scene2>
    );
  },

  'sf-bt-yaz-durgun-su': () => {
    const gy = 222;
    const tip: P = [184, 170];
    const p: PersonProps = { ...C.emre, x: 110, y: gy, s: 1.04, pose: { ...POSE.bend, spine: -40, chest: -28, head: -24, legB: [100, 98], legF: [70, 100], armF: { to: [tip[0] - 10, tip[1] - 12] }, armB: { to: [tip[0] - 4, tip[1] + 14] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        {/* devrilen kova */}
        <OG sh={[{ d: `M${tip[0] - 16} ${tip[1] - 22}L${tip[0] + 24} ${tip[1] - 8}L${tip[0] + 14} ${tip[1] + 24}L${tip[0] - 20} ${tip[1] + 14}Z`, f: '#4f7fb0' }]} />
        <path d={`M${tip[0] + 20} ${tip[1] + 10}Q${tip[0] + 34} ${tip[1] + 20} ${tip[0] + 40} ${gy - 2}`} stroke={K.water} stroke-width={8} fill="none" stroke-linecap="round" />
        <OG sh={[{ d: ell([tip[0] + 54, gy + 2], 28, 5), f: K.water }]} />
        <Person {...p} />
        {/* lastik */}
        <OG sh={[{ d: ell([60, gy - 2], 34, 12), f: '#30333b' }, { d: ell([60, gy - 4], 18, 5), f: K.grassShade }]} />
        <Mosquito x={258} y={74} s={1.6} />
        <No x={258} y={74} r={28} />
      </Scene2>
    );
  },

  /* ── Yangın mevsimi ── */
  'sf-bt-yangin-kusak-plan': () => {
    const c: P = [130, 120];
    const rings: [number, string][] = [[200, '#5f9a48'], [118, '#8fc163'], [70, '#b9d98a'], [30, '#c9c4b8']];
    const trees30 = [[0, 92], [60, 96], [120, 90], [180, 94], [240, 96], [300, 92], [30, 100], [210, 100]];
    const trees100 = Array.from({ length: 22 }, (_, i) => [i * 16.4, 150 + (i % 3) * 18]);
    return (
      <Scene2 bg="dark">
        {rings.map(([r, f], i) => <circle key={i} cx={c[0]} cy={c[1]} r={r} fill={f} stroke={K.out} stroke-width={1.5} stroke-dasharray={i ? '6 4' : undefined} />)}
        {[...trees30, ...trees100].map(([a, d], i) => {
          const p = pol(c, a as number, d as number);
          return <OG key={i} sh={[{ d: circ(p, (d as number) > 120 ? 11 : 9), f: (d as number) > 120 ? K.pine : K.leaf }]} />;
        })}
        <OG sh={[{ d: rrect(c[0] - 16, c[1] - 14, 32, 28, 2), f: '#c2583e' }, { d: `M${c[0] - 16} ${c[1]}H${c[0] + 16}`, st: shade('#c2583e', 0.3), sw: 2 }]} />
        {([[30, '1,5', 30], [70, '10', 30], [118, '30', 30], [160, '100 m', 52]] as [number, string, number][]).map(([r, t, w], i) => (
          <g key={i}><rect x={c[0] + r - w / 2} y={c[1] - 9 + (i % 2 ? 22 : 0)} width={w} height={18} rx={9} fill="#fff" stroke={K.out} stroke-width={1.2} /><Txt x={c[0] + r} y={c[1] + 4 + (i % 2 ? 22 : 0)} t={t} size={12} /></g>
        ))}
      </Scene2>
    );
  },

  'sf-bt-yangin-10m': () => {
    const gy = 206;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={34} fill="#9cc96e" />
        <path d="M0 210h320" stroke={shade('#9cc96e', 0.2)} stroke-width={1} />
        <HouseExt x={90} y={gy} w={140} h={90} />
        {/* duvara dayalı odun yığını: yasak */}
        {Array.from({ length: 3 }, (_, j) => Array.from({ length: 4 - j }, (_, i) => <OG key={`${j}-${i}`} sh={[{ d: circ([236 + i * 15 + j * 7, gy - 8 - j * 14], 8), f: M.logEnd }]} />))}
        <No x={258} y={gy - 22} r={34} />
        {/* toplanmış yaprak uzakta */}
        <OG sh={[{ d: 'M20 208Q34 190 50 208Z', f: '#b5862f' }]} />
        <OG sh={[{ d: capsule([58, 210], 2, [72, 150], 2), f: M.wood }, { d: 'M62 150L82 146M64 154L84 152M66 158L84 158', st: M.iron, sw: 2 }]} />
      </Scene2>
    );
  },

  'sf-bt-yangin-budama': () => {
    const gy = 222;
    const tx = 210;
    const cut = 124;
    const p: PersonProps = { ...C.mehmet, x: 150, y: gy, s: 1, pose: { ...POSE.standSide, armF: { to: [tx - 22, cut + 6] }, handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: `M${tx - 9} ${gy}L${tx - 6} 30H${tx + 6}L${tx + 9} ${gy}Z`, f: K.trunk }]} />
        {/* kesilmiş dal dipleri */}
        {[200, 176, 150].map((y, i) => <OG key={i} sh={[{ d: capsule([tx + (i % 2 ? 8 : -8), y], 3, [tx + (i % 2 ? 14 : -14), y - 3], 3), f: shade(K.trunk, 0.1) }, { d: circ([tx + (i % 2 ? 14 : -14), y - 3], 3), f: M.logEnd }]} />)}
        {/* üstteki yeşil taç */}
        <OG sh={[{ d: `M${tx} 10L${tx - 30} 60H${tx + 30}Z`, f: K.pine }, { d: `M${tx} 34L${tx - 46} 96H${tx + 46}Z`, f: K.pine }, { d: `M${tx} 60L${tx - 58} ${cut}H${tx + 58}Z`, f: K.pine }]} />
        {/* testere */}
        <OG sh={[{ d: capsule([tx - 26, cut + 10], 3, [tx - 40, cut + 22], 3), f: M.wood }, { d: `M${tx - 26} ${cut + 8}L${tx - 4} ${cut - 6}L${tx - 2} ${cut}L${tx - 22} ${cut + 14}Z`, f: '#c9d2da' }]} />
        <Person {...p} />
        <Dim a={[tx + 72, gy]} b={[tx + 72, cut + 2]} />
        <Label x={tx + 72} y={(gy + cut) / 2} text="2 m" size={15} />
      </Scene2>
    );
  },

  /* ── Sel ve heyelan ── */
  'sf-bt-sel-yer-secimi': () => <Terrain kind="house" />,

  'sf-bt-sel-izleri': () => {
    const line = 118;
    return (
      <Scene2 bg="outdoor" gy={226}>
        <OG sh={[{ d: 'M120 0H176L184 240H112Z', f: K.trunk }]} />
        <path d={`M114 ${line}H182L184 240H112Z`} fill="#6b5236" opacity={0.85} />
        <path d={`M113 ${line}q12 4 24 0t24 1t22 -1`} stroke="#3e2f1f" stroke-width={5} fill="none" />
        {/* dala takılı kuru ot ve plastik */}
        <OG sh={[{ d: capsule([176, line - 6], 4, [270, line - 20], 3), f: shade(K.trunk, 0.05) }]} />
        <path d={`M200 ${line - 10}l-6 14M206 ${line - 11}l2 16M214 ${line - 12}l-4 15M222 ${line - 13}l3 14M236 ${line - 15}l-3 14`} stroke="#b5862f" stroke-width={2.4} />
        <OG sh={[{ d: `M244 ${line - 18}l10 4l-4 12l-10 -6Z`, f: '#4f9fd6' }, { d: `M226 ${line - 14}l8 2l-2 10l-8 -4Z`, f: '#f4f1ea' }]} />
        <Arrow from={[40, line - 40]} to={[104, line - 4]} w={6} bend={0.2} />
      </Scene2>
    );
  },

  'sf-bt-sel-hendek': () => {
    const house: P = [160, 166];
    return (
      <Scene2 bg="outdoor" gy={0}>
        <rect width={320} height={240} fill={K.grass} />
        {/* eğim çizgileri: yukarısı yamaç */}
        <path d="M0 30Q160 14 320 30M0 60Q160 44 320 60" stroke={K.grassShade} stroke-width={2} fill="none" />
        {/* hendek */}
        <path d="M20 128Q60 92 160 90T300 128" stroke={K.out} stroke-width={13} fill="none" stroke-linecap="round" />
        <path d="M20 128Q60 92 160 90T300 128" stroke="#7d6a4a" stroke-width={10} fill="none" stroke-linecap="round" />
        {/* ev (yukarıdan) */}
        <OG sh={[{ d: rrect(house[0] - 50, house[1] - 34, 100, 68, 2), f: '#c2583e' }, { d: `M${house[0] - 50} ${house[1]}H${house[0] + 50}`, st: shade('#c2583e', 0.3), sw: 2 }]} />
        {/* oluk borusu */}
        <OG sh={[{ d: rrect(house[0] + 44, house[1] + 28, 8, 8, 2), f: '#a3adb8' }]} />
        <Arrow from={[160, 20]} to={[160, 76]} color={K.water} w={5} />
        <Arrow from={[150, 92]} to={[40, 122]} color={K.water} w={5} bend={0.1} />
        <Arrow from={[170, 92]} to={[280, 122]} color={K.water} w={5} bend={-0.1} />
        <Arrow from={[house[0] + 56, house[1] + 38]} to={[house[0] + 120, house[1] + 62]} color={K.water} w={5} />
      </Scene2>
    );
  },

  /* ── Orman ── */
  'sf-bt-orman-baltalik': () => {
    const gy = 214;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Tree x={40} y={gy - 10} s={0.9} />
        <Tree x={290} y={gy - 12} s={0.8} />
        <Coppice x={160} y={gy + 6} s={1.3} />
      </Scene2>
    );
  },

  'sf-bt-orman-cit': () => {
    const gy = 214;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Coppice x={92} y={gy - 8} s={0.8} />
        <Coppice x={168} y={gy - 4} s={0.85} />
        <Wattle x1={20} x2={226} y={gy + 16} h={56} />
        <Goat x={268} y={gy + 18} s={1.15} flip />
      </Scene2>
    );
  },

  'sf-bt-orman-yuksek-budama': () => {
    const gy = 222;
    const tx = 110, top = 70;
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: `M${tx - 14} ${gy}L${tx - 11} ${top}H${tx + 11}L${tx + 14} ${gy}Z`, f: K.trunk }, { d: ell([tx, top], 12, 4), f: M.logEnd }]} />
        {Array.from({ length: 7 }, (_, i) => {
          const a = -150 + i * 20;
          const e = pol([tx, top], a, 52);
          return <g key={i}><path d={`M${tx} ${top}Q${f1(lerp([tx, top], e, 0.5)[0])} ${f1(lerp([tx, top], e, 0.5)[1] - 6)} ${f1(e[0])} ${f1(e[1])}`} stroke={K.out} stroke-width={4} fill="none" /><path d={`M${tx} ${top}Q${f1(lerp([tx, top], e, 0.5)[0])} ${f1(lerp([tx, top], e, 0.5)[1] - 6)} ${f1(e[0])} ${f1(e[1])}`} stroke="#7a9a3a" stroke-width={2} fill="none" /><OG sh={[{ d: ell(e, 9, 6), f: K.leaf }]} /></g>;
        })}
        <Cow x={214} y={gy} s={1.1} flip />
        <Dim a={[tx - 40, gy]} b={[tx - 40, top + 2]} />
      </Scene2>
    );
  },
};
