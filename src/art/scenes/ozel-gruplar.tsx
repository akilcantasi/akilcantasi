// Bebek, yaşlı ve özel ihtiyaç (ozel-gruplar) sahneleri — kit v2.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Blanket, Bubble, Bottle, Cane, Chair, Cloth, Door, Drop, Flashlight, Hand, K, Label, No, OG, OW, Ok, Person, POSE,
  Scene2, Sign, Stairs, Table, Tent, Tree, Waves, Whistle, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Pose, Rig, Sh } from '../kit2';

/* ═══════════════════════════ yardımcılar ═══════════════════════════ */

const f1 = (n: number) => Math.round(n * 10) / 10;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const R2D = 180 / Math.PI;
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) * R2D;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a / R2D) * l, p[1] + Math.sin(a / R2D) * l];
const owOf = (s: number) => OW * (0.75 + 0.25 * s);

const G = ({ x = 0, y = 0, s = 1, a = 0, fx = false, children }: { x?: number; y?: number; s?: number; a?: number; fx?: boolean; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${fx ? -s : s} ${s})`}>{children}</g>
);

function handAt(h: Omit<HandProps, 'x' | 'y'>, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): HandProps {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

const MILK = '#f6ead0';
const GLOVE = '#7fb3e6';
const FRAME = '#4c5563';
const CRESCENT_BG = '#fbfaf7';

/** Hamile karnı — yan görünüş (kişinin mid katmanına) */
function BellySide({ r, c }: { r: Rig; c: string }) {
  const f = r.flip ? -1 : 1, s = r.s;
  const m = lerp(r.belly, r.chest, 0.42);
  const ctr: P = [m[0] + f * 6 * s, m[1] + 1 * s];
  const a = angOf(r.hip, r.neck) + 90;
  return (
    <OG
      ow={owOf(s)}
      sh={[
        { d: ell(ctr, 13 * s, 16.5 * s), f: c, t: `rotate(${f1(a)} ${f1(ctr[0])} ${f1(ctr[1])})` },
        { d: `M${f1(ctr[0] + f * 4 * s)} ${f1(ctr[1] - 10 * s)}Q${f1(ctr[0] + f * 10 * s)} ${f1(ctr[1] - 3 * s)} ${f1(ctr[0] + f * 8 * s)} ${f1(ctr[1] + 6 * s)}`, st: tint(c, 0.35), sw: 2 * s },
      ]}
    />
  );
}
/** Hamile karnı — ön görünüş */
function BellyFront({ r, c }: { r: Rig; c: string }) {
  const s = r.s;
  const ctr = lerp(r.hip, r.neck, 0.3);
  return (
    <OG
      ow={owOf(s)}
      sh={[
        { d: ell([ctr[0], ctr[1] + 2 * s], 15.5 * s, 14 * s), f: c },
        { d: `M${f1(ctr[0] + 8 * s)} ${f1(ctr[1] - 9 * s)}A${f1(15 * s)} ${f1(14 * s)} 0 0 1 ${f1(ctr[0] + 6 * s)} ${f1(ctr[1] + 15 * s)}A${f1(15 * s)} ${f1(14 * s)} 0 0 0 ${f1(ctr[0] + 8 * s)} ${f1(ctr[1] - 9 * s)}Z`, f: shade(c, 0.14), no: true },
      ]}
    />
  );
}

/** Örgü bere (kafanın tepesine). r: rig, c: renk */
function Beanie({ r, c = '#e0607a', R, lift = 0.24 }: { r: Rig; c?: string; R?: number; lift?: number }) {
  const H = R ?? r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)}) translate(0 ${f1(-lift * H)})`;
  const ribs: string[] = [];
  for (let i = -4; i <= 4; i++) ribs.push(`M${f1(i * 0.24 * H)} ${f1(-0.4 * H)}V${f1(-0.08 * H)}`);
  return (
    <g transform={t}>
      <OG
        ow={1.4}
        sh={[
          { d: circ([0, -1.22 * H], 0.3 * H), f: tint(c, 0.4) },
          { d: `M${f1(-1.06 * H)} ${f1(-0.25 * H)}C${f1(-1.08 * H)} ${f1(-1.4 * H)} ${f1(1.08 * H)} ${f1(-1.4 * H)} ${f1(1.06 * H)} ${f1(-0.25 * H)}Z`, f: c },
          { d: rrect(-1.14 * H, -0.44 * H, 2.28 * H, 0.42 * H, 0.18 * H), f: shade(c, 0.1) },
          { d: ribs.join(''), st: shade(c, 0.3), sw: 1.2 },
          { d: `M${f1(-0.5 * H)} ${f1(-0.95 * H)}Q0 ${f1(-1.15 * H)} ${f1(0.5 * H)} ${f1(-0.95 * H)}`, st: tint(c, 0.3), sw: 1.4 },
        ]}
      />
    </g>
  );
}

/** Gürültü önleyici kulaklık. front: önden; aksi halde yandan */
function Earmuffs({ r, front, c = '#3d4a63' }: { r: Rig; front?: boolean; c?: string }) {
  const H = r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})${r.flip ? ' scale(-1 1)' : ''}`;
  const sh: Sh[] = front
    ? [
        { d: `M${f1(-1.02 * H)} ${f1(0)}C${f1(-1.1 * H)} ${f1(-1.55 * H)} ${f1(1.1 * H)} ${f1(-1.55 * H)} ${f1(1.02 * H)} 0`, st: K.out, sw: 0.36 * H },
        { d: `M${f1(-1.02 * H)} ${f1(0)}C${f1(-1.1 * H)} ${f1(-1.55 * H)} ${f1(1.1 * H)} ${f1(-1.55 * H)} ${f1(1.02 * H)} 0`, st: c, sw: 0.22 * H },
        { d: ell([-1.0 * H, 0.08 * H], 0.3 * H, 0.46 * H), f: '#f2c14e' },
        { d: ell([1.0 * H, 0.08 * H], 0.3 * H, 0.46 * H), f: '#f2c14e' },
      ]
    : [
        { d: `M${f1(-0.5 * H)} ${f1(0.05 * H)}C${f1(-0.6 * H)} ${f1(-1.5 * H)} ${f1(0.5 * H)} ${f1(-1.5 * H)} ${f1(0.25 * H)} ${f1(-0.6 * H)}`, st: K.out, sw: 0.34 * H },
        { d: `M${f1(-0.5 * H)} ${f1(0.05 * H)}C${f1(-0.6 * H)} ${f1(-1.5 * H)} ${f1(0.5 * H)} ${f1(-1.5 * H)} ${f1(0.25 * H)} ${f1(-0.6 * H)}`, st: c, sw: 0.2 * H },
        { d: ell([-0.22 * H, 0.12 * H], 0.42 * H, 0.5 * H), f: '#f2c14e' },
        { d: ell([-0.22 * H, 0.12 * H], 0.22 * H, 0.3 * H), f: shade('#f2c14e', 0.18), ln: true },
      ];
  return (
    <g transform={t}>
      <OG ow={1.4} sh={sh} />
    </g>
  );
}

/** Baret (yandan) */
function HardHat({ r, c = '#f2c230' }: { r: Rig; c?: string }) {
  const H = r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})${r.flip ? ' scale(-1 1)' : ''}`;
  return (
    <g transform={t}>
      <OG
        ow={1.4}
        sh={[
          { d: `M${f1(-1.08 * H)} ${f1(-0.2 * H)}C${f1(-1.1 * H)} ${f1(-1.4 * H)} ${f1(1.1 * H)} ${f1(-1.4 * H)} ${f1(1.08 * H)} ${f1(-0.2 * H)}Z`, f: c },
          { d: rrect(-1.15 * H, -0.32 * H, 2.65 * H, 0.26 * H, 0.12 * H), f: shade(c, 0.12) },
          { d: `M${f1(-0.05 * H)} ${f1(-1.1 * H)}V${f1(-0.32 * H)}`, st: shade(c, 0.25), sw: 2 },
        ]}
      />
    </g>
  );
}

/** Hilal (kırmızı). bg = arka plan rengi */
function Crescent({ x, y, r, bg = CRESCENT_BG }: { x: number; y: number; r: number; bg?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={K.red} />
      <circle cx={x + r * 0.38} cy={y - r * 0.05} r={r * 0.8} fill={bg} />
    </g>
  );
}

/** Yelek — ön görünüş */
function VestFront({ r, c, stripe, emblem }: { r: Rig; c: string; stripe?: string; emblem?: 'crescent' | 'afad' }) {
  const s = r.s;
  const nk = r.neck, hp = r.hip;
  const L = r.shoulderB[0] - 2 * s, Rr = r.shoulderF[0] + 2 * s;
  const yS = r.shoulderB[1] - 3 * s, yH = hp[1] - 4 * s;
  const d = `M${f1(nk[0] - 6 * s)} ${f1(yS - 1 * s)}L${f1(L)} ${f1(yS + 2 * s)}L${f1(L + 1 * s)} ${f1(yH)}L${f1(Rr - 1 * s)} ${f1(yH)}L${f1(Rr)} ${f1(yS + 2 * s)}L${f1(nk[0] + 6 * s)} ${f1(yS - 1 * s)}L${f1(nk[0])} ${f1(yS + 20 * s)}Z`;
  const ys = lerp([0, yS], [0, yH], 0.66)[1];
  return (
    <g>
      <OG ow={owOf(s)} sh={[{ d, f: c }, ...(stripe ? [{ d: rrect(L + 1 * s, ys, Rr - L - 2 * s, 4 * s, 1), f: stripe, ln: true } as Sh] : [])]} />
      {emblem === 'crescent' && <Crescent x={nk[0] + 10 * s} y={yS + 11 * s} r={4.6 * s} bg={c} />}
      {emblem === 'afad' && (
        <text x={nk[0] + 9 * s} y={yS + 14 * s} font-size={5.4 * s} font-weight={700} fill="#fff" text-anchor="middle" font-family="'IBM Plex Sans', system-ui, sans-serif">
          AFAD
        </text>
      )}
    </g>
  );
}
/** Yelek — yan görünüş */
function VestSide({ r, c, stripe, text }: { r: Rig; c: string; stripe?: string; text?: string }) {
  const s = r.s, f = r.flip ? -1 : 1;
  const sp = angOf(r.hip, r.neck);
  const fwd = (p: P, k: number): P => pol(p, sp + 90 * -f, -k * s);
  const pts: P[] = [
    fwd(r.nape, 1.5), fwd(r.back, 1.2), fwd([r.hip[0] - f * 10 * s, r.hip[1] - 6 * s], 0),
    fwd([r.hip[0] + f * 11 * s, r.hip[1] - 6 * s], 0), fwd(r.belly, -1.2), fwd(r.chest, -1.2), fwd([r.neck[0] + f * 5 * s, r.neck[1] + 4 * s], 0),
  ];
  const ys = lerp(r.back, r.hip, 0.45);
  return (
    <g>
      <OG ow={owOf(s)} sh={[{ d: smooth(pts, true, 0.5), f: c }]} />
      {stripe && <path d={`M${f1(ys[0] - f * 2 * s)} ${f1(ys[1])}L${f1(ys[0] + f * 24 * s)} ${f1(ys[1] + 1 * s)}`} stroke={stripe} stroke-width={3.4 * s} />}
      {text && (
        <text x={lerp(r.back, r.chest, 0.5)[0]} y={lerp(r.back, r.chest, 0.5)[1] - 2 * s} font-size={5.5 * s} font-weight={700} fill="#fff" text-anchor="middle" font-family="'IBM Plex Sans', system-ui, sans-serif">
          {text}
        </text>
      )}
    </g>
  );
}

/** Kişinin eline eldiven: bilekten önkol yönünde */
function GloveOn({ r, k, a = 0, L = 10.5, w = 4.6 }: { r: Rig; k: 'B' | 'F'; a?: number; L?: number; w?: number }) {
  const s = r.s;
  const wr = k === 'B' ? r.wristB : r.wristF;
  const fa = (k === 'B' ? r.foreB : r.foreF) + a;
  const end = pol(wr, fa, L * s);
  return (
    <OG
      ow={owOf(s)}
      sh={[
        { d: capsule(pol(wr, fa, -3 * s), w * 1.12 * s, end, w * 0.9 * s), f: k === 'B' ? shade(GLOVE, 0.12) : GLOVE },
        { d: capsule(pol(wr, fa, -3 * s), w * 1.25 * s, pol(wr, fa, 1.5 * s), w * 1.2 * s), f: tint(GLOVE, 0.25) },
      ]}
    />
  );
}

/** Tekerlekli sandalye (yan görünüş): arka/çerçeve kısmı. r = oturan kişinin rig'i */
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
      {/* uzak tekerlek */}
      <circle cx={far[0]} cy={far[1]} r={R} fill="none" stroke={K.out} stroke-width={6 * s} />
      <circle cx={far[0]} cy={far[1]} r={R - 5 * s} fill="none" stroke={shade(K.metal, 0.3)} stroke-width={1.6 * s} />
      <OG
        ow={owOf(s)}
        sh={[
          // alt çerçeve + ön teker çatalı
          { d: capsule([X(-6), gy - 16 * s], 2 * s, [X(28), gy - 16 * s], 2 * s), f: FRAME },
          { d: capsule([X(24), seatY + 3 * s], 2 * s, [X(28), gy - 13 * s], 2 * s), f: FRAME },
          { d: circ([X(30), gy - 6 * s], 6 * s), f: '#30333b' },
          { d: circ([X(30), gy - 6 * s], 2 * s), f: K.metal, ln: true },
          // ayaklık
          { d: capsule([X(18), seatY + 4 * s], 2 * s, [plate[0] - f * 4 * s, plate[1]], 2 * s), f: FRAME },
          { d: rrect(Math.min(plate[0] - f * 9 * s, plate[0] + f * 9 * s), plate[1] - 1.5 * s, 18 * s, 4 * s, 1.5 * s), f: FRAME },
          // sırtlık direği + tutamak
          { d: capsule([X(-16), seatY + 4 * s], 2.2 * s, [X(-20), topY], 2.2 * s), f: FRAME },
          { d: capsule([X(-20), topY], 2.2 * s, [X(-31), topY + 2 * s], 2.2 * s), f: FRAME },
          { d: capsule([X(-26), topY + 1 * s], 3 * s, [X(-33), topY + 2.2 * s], 3 * s), f: '#30333b' },
          // sırtlık kumaşı
          { d: `M${f1(X(-15))} ${f1(seatY)}L${f1(X(-18.5))} ${f1(topY + 4 * s)}L${f1(X(-12))} ${f1(topY + 6 * s)}L${f1(X(-10))} ${f1(seatY - 4 * s)}Z`, f: color },
          // oturak
          { d: rrect(sx, seatY - 1 * s, sw, 6 * s, 2 * s), f: color },
          // kolçak
          { d: capsule([X(-14), seatY - 6 * s], 1.8 * s, [X(-13), r.hip[1] - 16 * s], 1.8 * s), f: FRAME },
          { d: capsule([X(-16), r.hip[1] - 17 * s], 2.6 * s, [X(12), r.hip[1] - 17 * s], 2.6 * s), f: '#30333b' },
        ]}
      />
    </g>
  );
}
/** Tekerlekli sandalye: yakın büyük teker (kişinin önüne çizilir) + fren */
function WheelChairWheel({ r, gy, brake = true }: { r: Rig; gy: number; brake?: boolean }) {
  const { s, f, R, wc } = wcGeo(r, gy);
  const spokes: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = i * 30 + 15;
    const p1 = pol(wc, a, R - 3 * s), p2 = pol(wc, a + 180, R - 3 * s);
    spokes.push(`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`);
  }
  const b0: P = [wc[0] + f * R * 0.62, wc[1] - R * 0.78];
  const b1: P = [b0[0] + f * 7 * s, b0[1] - 9 * s];
  return (
    <g>
      <path d={spokes.join('')} stroke={shade(K.metal, 0.1)} stroke-width={1 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R} fill="none" stroke={K.out} stroke-width={7.5 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R} fill="none" stroke="#3a3d45" stroke-width={4.5 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R - 6 * s} fill="none" stroke={K.out} stroke-width={3.4 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={R - 6 * s} fill="none" stroke={K.metal} stroke-width={1.8 * s} />
      <circle cx={wc[0]} cy={wc[1]} r={4 * s} fill={K.metal} stroke={K.out} stroke-width={1.3} />
      {brake && <OG ow={owOf(s)} sh={[{ d: capsule(b0, 2.4 * s, b1, 2.4 * s), f: FRAME }, { d: circ(b1, 4.2 * s), f: '#30333b' }, { d: circ(b0, 3 * s), f: K.metal }]} />}
    </g>
  );
}
/** Sandalyede oturuş (tekerlekli sandalye için) */
const WC_SIT: Pose = { spine: -92, armB: [80, 8], armF: [76, 4], legB: [4, 78], legF: [0, 76], footB: 0, footF: 0 };

/** Biberon. x,y taban ortası */
function BabyBottle({ x, y, s = 1, a = 0, milk = MILK, fill = 0.7 }: { x: number; y: number; s?: number; a?: number; milk?: string; fill?: number }) {
  const h = 40 * fill;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-3 -52Q0 -64 3 -52L5 -46H-5Z', f: '#e8c48c' },
          { d: rrect(-10, -40, 20, 40, 5), f: '#eef6fb' },
          { d: `M-10 ${-h}H10V-5Q10 0 5 0H-5Q-10 0 -10 -5Z`, f: milk, no: true },
          { d: rrect(-11.5, -47, 23, 8, 2), f: '#7cc4e8' },
          { d: 'M4 -32H10M6 -24H10M4 -16H10', st: '#8a9aa8', sw: 1.2 },
          { d: 'M-6 -34V-8', st: '#fff', sw: 2 },
        ]}
      />
    </G>
  );
}

/** Küçük bardak (yan görünüş). x,y taban ortası; a eğim */
function Cup({ x, y, s = 1, a = 0, fill = '#f6ead0', level = 0.6, tiltLevel = 0 }: { x: number; y: number; s?: number; a?: number; fill?: string; level?: number; tiltLevel?: number }) {
  const h = 22;
  const lv = -h * level;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={OW / s}
        sh={[
          { d: `M-9 -22L-7.5 -1Q-7.3 0 -6 0H6Q7.3 0 7.5 -1L9 -22Z`, f: '#eef6fb' },
          { d: `M${-8.9 + level * 1.5} ${f1(lv - tiltLevel)}L${8.9 - level * 1.5} ${f1(lv + tiltLevel)}L7.5 -1Q7.3 0 6 0H-6Q-7.3 0 -7.5 -1Z`, f: fill, no: true },
          { d: ell([0, -22], 9, 1.8), f: 'none', st: K.out, sw: 1.2 },
          { d: 'M-5 -18L-4 -5', st: '#fff', sw: 1.6 },
        ]}
      />
    </G>
  );
}

/** İlaç kutusu (yandan/üstten). x,y SOL ÜST */
function PillBox({ x, y, w = 34, h = 20, c = '#3d7ad6', a = 0 }: { x: number; y: number; w?: number; h?: number; c?: string; a?: number }) {
  return (
    <g transform={`rotate(${a} ${x + w / 2} ${y + h / 2})`}>
      <OG sh={[{ d: rrect(x, y, w, h, 2), f: '#fbfaf7' }, { d: rrect(x, y, w * 0.32, h, 2), f: c, ln: true }, { d: `M${x + w * 0.62} ${y + h * 0.3}V${y + h * 0.7}M${x + w * 0.62 - h * 0.2} ${y + h * 0.5}H${x + w * 0.62 + h * 0.2}`, st: c, sw: 2.4 }]} />
    </g>
  );
}
/** Yazılı kağıt (çizgili). x,y SOL ÜST */
function Paper({ x, y, w = 40, h = 52, a = 0, lines = 5, c = '#fbfaf7', lc = '#9aa3b0' }: { x: number; y: number; w?: number; h?: number; a?: number; lines?: number; c?: string; lc?: string }) {
  const ls: string[] = [];
  for (let i = 0; i < lines; i++) ls.push(`M${x + 6} ${y + 10 + i * ((h - 16) / Math.max(1, lines - 1))}h${(w - 12) * (i % 3 === 2 ? 0.6 : 1)}`);
  return (
    <g transform={`rotate(${a} ${x + w / 2} ${y + h / 2})`}>
      <OG sh={[{ d: rrect(x, y, w, h, 2), f: c }, { d: ls.join(''), st: lc, sw: 2 }]} />
    </g>
  );
}
/** İnsülin kalemi. x,y bir uç; a yön; L uzunluk */
function InsulinPen({ x, y, a = 0, s = 1, c = '#e98a2f' }: { x: number; y: number; a?: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={OW / s}
        sh={[
          { d: capsule([0, 0], 5, [58, 0], 5), f: '#e6e8eb' },
          { d: capsule([0, 0], 5.4, [20, 0], 5.4), f: c },
          { d: rrect(30, -3.4, 12, 6.8, 1.5), f: '#bfe3f5', ln: true },
          { d: rrect(56, -4, 7, 8, 1.5), f: '#5a6170' },
          { d: 'M48 -5V5M51 -5V5', st: '#9aa3b0', sw: 1.2 },
        ]}
      />
    </G>
  );
}
/** Telefon simgesi (ahize) */
function PhoneIcon({ x, y, s = 1, c = K.ink }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-5.5 -6.5c1-1 2.4-.7 2.9.3l1.2 2.4c.4.8 0 1.7-.7 2.2l-.7.5c.7 1.7 2.2 3.2 3.9 3.9l.5-.7c.5-.7 1.4-1 2.2-.7l2.4 1.2c1 .5 1.3 1.9.3 2.9-1.5 1.5-3.7 1.9-5.6.9-2.7-1.5-5.1-3.9-6.6-6.6-1-1.9-.6-4.1.9-5.6z"
      fill={c}
    />
  );
}
/** Kar tanesi */
function Flake({ x, y, r = 10, c = K.water }: { x: number; y: number; r?: number; c?: string }) {
  const d: string[] = [];
  for (let i = 0; i < 3; i++) {
    const a = i * 60 - 90;
    const p1 = pol([x, y], a, r), p2 = pol([x, y], a + 180, r);
    d.push(`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`);
    for (const p of [p1, p2]) {
      const b = angOf([x, y], p);
      const q = pol([x, y], b, r * 0.6);
      const e1 = pol(q, b + 140, r * 0.35), e2 = pol(q, b - 140, r * 0.35);
      d.push(`M${f1(e1[0])} ${f1(e1[1])}L${f1(q[0])} ${f1(q[1])}L${f1(e2[0])} ${f1(e2[1])}`);
    }
  }
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d.join('')} stroke={K.out} stroke-width={4.4} />
      <path d={d.join('')} stroke={c} stroke-width={2.2} />
    </g>
  );
}
/** Beyaz panel (köşe simgeleri için) */
const Chip = ({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ComponentChildren }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#fff" stroke={K.out} stroke-width={1.5} />
    {children}
  </g>
);
const Txt = ({ x, y, t, size = 13, c = K.ink, anchor = 'middle', w = 700 }: { x: number; y: number; t: string; size?: number; c?: string; anchor?: 'start' | 'middle' | 'end'; w?: number }) => (
  <text x={x} y={y} font-size={size} font-weight={w} fill={c} text-anchor={anchor} font-family="'IBM Plex Sans', system-ui, sans-serif">
    {t}
  </text>
);

/** Köpek (yandan, sağa bakar). x,y taban ortası */
function Dog({ x, y, s = 1, fx, pose = 'stand', c = '#b7834f', collar = '#d63b35', tag = true }: { x: number; y: number; s?: number; fx?: boolean; pose?: 'stand' | 'sit'; c?: string; collar?: string; tag?: boolean }) {
  const d = shade(c, 0.16);
  const sh: Sh[] =
    pose === 'stand'
      ? [
          { d: capsule([-15, -26], 4.2, [-18, -1], 3.4), f: d },
          { d: capsule([15, -26], 4, [18, -1], 3.2), f: d },
          { d: capsule([-22, -36], 3.2, [-32, -48], 2.2), f: c },
          { d: ell([0, -31], 25, 11.5), f: c },
          { d: capsule([-10, -26], 4.8, [-12, -1], 3.6), f: c },
          { d: capsule([20, -26], 4.6, [22, -1], 3.4), f: c },
          { d: capsule([17, -33], 8.5, [27, -46], 7), f: c },
          { d: circ([31, -51], 10), f: c },
          { d: capsule([34, -47], 6, [44, -46], 4.8), f: tint(c, 0.25) },
          { d: ell([24, -48], 4.5, 9), f: d, t: 'rotate(18 24 -48)' },
        ]
      : [
          { d: capsule([13, -30], 3.8, [15, -1], 3.2), f: d },
          { d: capsule([-14, -3], 3, [-30, -3], 2.2), f: c },
          { d: ell([-5, -15], 15, 13), f: c },
          { d: capsule([-2, -18], 12, [10, -36], 9.5), f: c },
          { d: ell([4, -2.5], 9, 3.5), f: c },
          { d: capsule([10, -28], 4.4, [12, -1], 3.4), f: c },
          { d: circ([16, -52], 10), f: c },
          { d: capsule([19, -48], 6, [29, -47], 4.8), f: tint(c, 0.25) },
          { d: ell([9, -49], 4.5, 9), f: d, t: 'rotate(18 9 -49)' },
        ];
  const neck: [P, P] = pose === 'stand' ? [[15.5, -44], [29, -36]] : [[5, -44], [19, -40]];
  const head: P = pose === 'stand' ? [31, -51] : [16, -52];
  return (
    <G x={x} y={y} s={s} fx={fx}>
      <OG ow={OW / s} sh={sh} />
      <OG ow={OW / s} sh={[{ d: capsule(neck[0], 2.8, neck[1], 2.8), f: collar }, ...(tag ? [{ d: circ([neck[1][0] - 1, neck[1][1] + 4.5], 3.2), f: '#d9c36a' } as Sh] : [])]} />
      <circle cx={head[0] + 13.5} cy={head[1] + 4.5} r={2.6} fill={K.ink} />
      <circle cx={head[0] + 3} cy={head[1] - 2} r={1.7} fill={K.ink} />
    </G>
  );
}

/** Kedi taşıma kafesi (yandan). x,y taban ortası; kapı sağda */
function Carrier({ x, y, s = 1, c = '#6f9fd0', cat = true, lock = false }: { x: number; y: number; s?: number; c?: string; cat?: boolean; lock?: boolean }) {
  const bars: string[] = [];
  for (let i = 0; i < 4; i++) bars.push(`M${16 + i * 0} ${-24 + i * 6.5}H${26}`);
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-10 -30Q-10 -42 0 -42Q10 -42 10 -30', st: K.out, sw: 4.4 },
          { d: 'M-10 -30Q-10 -42 0 -42Q10 -42 10 -30', st: '#3b3f4b', sw: 2.4 },
          { d: 'M-26 -4V-22Q-26 -30 -18 -30H18Q26 -30 26 -22V-4Q26 0 22 0H-22Q-26 0 -26 -4Z', f: c },
          { d: 'M-26 -15H26', st: shade(c, 0.3), sw: 1.4 },
          { d: rrect(14, -27, 12, 25, 2), f: '#3a3f4a' },
          ...(cat ? [{ d: ell([20, -15], 4, 6), f: '#9a9089', no: true } as Sh] : []),
          { d: bars.join('') + 'M18 -27V-2M22 -27V-2', st: '#cfd6de', sw: 1.6 },
          ...(lock ? [{ d: rrect(22, -18, 6, 7, 1.5), f: '#d9c36a' } as Sh] : []),
          { d: 'M-22 -6H10M-22 -24H10', st: tint(c, 0.3), sw: 1.4 },
        ]}
      />
    </G>
  );
}

/** Peluş ayıcık. x,y merkez */
function Teddy({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#b9895a';
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: circ([-8, -18], 4.5), f: c },
          { d: circ([8, -18], 4.5), f: c },
          { d: ell([0, 6], 11, 12), f: c },
          { d: circ([0, -10], 10), f: c },
          { d: ell([0, -6], 5, 3.6), f: tint(c, 0.4), ln: true },
          { d: ell([0, 8], 6, 6), f: tint(c, 0.3), no: true },
        ]}
      />
      <circle cx={-3.6} cy={-12} r={1.4} fill={K.ink} />
      <circle cx={3.6} cy={-12} r={1.4} fill={K.ink} />
      <circle cx={0} cy={-7} r={1.4} fill={K.ink} />
    </G>
  );
}

/** Moloz yığını */
function Rubble({ x, y, w = 80, seed = 1 }: { x: number; y: number; w?: number; seed?: number }) {
  const c = '#b9b2a6';
  const blocks: Sh[] = [];
  let k = seed;
  const rnd = () => ((k = (k * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < Math.round(w / 14); i++) {
    const bx = x + rnd() * (w - 20), bh = 8 + rnd() * 14, bw = 14 + rnd() * 16;
    const by = y - bh * (0.6 + rnd() * 0.5) * (1 - Math.abs(bx + bw / 2 - (x + w / 2)) / (w * 0.7));
    blocks.push({ d: rrect(bx, by - bh * 0.4, bw, bh, 2), f: i % 3 === 0 ? shade(c, 0.12) : i % 3 === 1 ? c : tint(c, 0.15), t: `rotate(${f1((rnd() - 0.5) * 30)} ${f1(bx + bw / 2)} ${f1(by)})` });
  }
  return (
    <g>
      <OG sh={[{ d: `M${x} ${y}Q${x + w * 0.2} ${y - 16} ${x + w * 0.5} ${y - 20}Q${x + w * 0.8} ${y - 16} ${x + w} ${y}Z`, f: shade(c, 0.08) }, ...blocks]} />
      <path d={`M${x + w * 0.3} ${y - 22}l4 -12M${x + w * 0.62} ${y - 18}l-2 -14`} stroke="#6b5a4a" stroke-width={2.2} stroke-linecap="round" />
    </g>
  );
}

/** Bulanık kalabalık (arka plan) */
function Crowd({ y, xs, s = 0.62, op = 0.5 }: { y: number; xs: number[]; s?: number; op?: number }) {
  const whos = ['man', 'woman', 'oldman', 'woman', 'man', 'girl', 'man', 'woman'] as const;
  const roles = ['bystander', 'bystander2', 'bystander3', 'bystander4', 'bystander', 'bystander3', 'bystander2', 'bystander4'] as const;
  return (
    <g opacity={op}>
      {xs.map((x, i) => (
        <Person key={i} x={x} y={y + (i % 2) * 4} s={s} who={whos[i % whos.length]} role={roles[i % roles.length]} skin={i % 4} shadow={false} pose={i % 3 === 0 ? POSE.stand : i % 3 === 1 ? { ...POSE.walk } : { ...POSE.standSide }} flip={i % 2 === 1} />
      ))}
    </g>
  );
}

/** Sağlık çadırı (beyaz, hilalli) */
const HealthTent = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g>
    <Tent x={x} y={y} s={s} color="#eeeae2" />
    <Crescent x={x + 18 * s} y={y - 22 * s} r={7 * s} bg="#d9d4cb" />
  </g>
);

/** Ultrason fotoğrafı. x,y SOL ÜST */
function Ultrasound({ x, y, w = 40, h = 32, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  return (
    <g transform={`rotate(${a} ${x + w / 2} ${y + h / 2})`}>
      <OG sh={[{ d: rrect(x, y, w, h, 2), f: '#fbfaf7' }, { d: rrect(x + 3, y + 3, w - 6, h - 6, 1), f: '#22262e', ln: true }]} />
      <path d={`M${x + w / 2} ${y + 5}L${x + w - 6} ${y + h - 6}H${x + 6}Z`} fill="#4a5160" />
      <ellipse cx={x + w / 2 + 1} cy={y + h * 0.62} rx={w * 0.14} ry={h * 0.13} fill="#c9ced6" />
    </g>
  );
}

/** Basit üstten eldiven (açık el) */
function GloveTop({ x, y, a = 0, s = 1, c = GLOVE }: { x: number; y: number; a?: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={OW / s}
        sh={[
          { d: rrect(-9, -4, 18, 18, 5), f: tint(c, 0.25) },
          { d: capsule([-7.5, -14], 2.6, [-9, -30], 2.4), f: c },
          { d: capsule([-2.5, -16], 2.7, [-3, -35], 2.5), f: c },
          { d: capsule([2.5, -16], 2.7, [3, -34], 2.5), f: c },
          { d: capsule([7.2, -14], 2.5, [8.5, -28], 2.3), f: c },
          { d: capsule([9, -6], 3, [18, -16], 2.6), f: c },
          { d: rrect(-11, -22, 22, 24, 8), f: c },
        ]}
      />
    </G>
  );
}

/** Asansör simgesi */
function ElevatorIcon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[{ d: rrect(-20, -24, 40, 48, 4), f: '#cfd6de' }, { d: rrect(-15, -8, 30, 30, 1), f: '#9aa6b4', ln: true }, { d: 'M0 -8V22', st: K.out, sw: 1.4 }]} />
      <path d="M-8 -12L-4 -19L0 -12ZM2 -19L6 -12L10 -19Z" fill={K.ink} />
    </G>
  );
}

/** Koltuk değneği. a = alt uç, b = üst (koltuk) uç */
function Crutch({ a, b, c = '#9aa6b4' }: { a: P; b: P; c?: string }) {
  const ang = angOf(a, b);
  const pad1 = pol(b, ang + 90, 8), pad2 = pol(b, ang - 90, 8);
  const g = lerp(a, b, 0.52);
  const g1 = pol(g, ang + 90, 6), g2 = pol(g, ang - 90, 6);
  const s1 = pol(lerp(a, b, 0.3), ang + 90, 0), sA = pol(b, ang + 90, 5), sB = pol(b, ang - 90, 5);
  return (
    <OG
      sh={[
        { d: capsule(s1, 2, sA, 2), f: c },
        { d: capsule(s1, 2, sB, 2), f: c },
        { d: capsule(a, 2.2, s1, 2), f: c },
        { d: capsule(g1, 2.6, g2, 2.6), f: '#3b3f4b' },
        { d: capsule(pad1, 3.4, pad2, 3.4), f: '#3b3f4b' },
        { d: circ(a, 2.8), f: '#3b3f4b' },
      ]}
    />
  );
}

/** Görme engelli kişi + rehber (yan görünüş, ikisi de sağa bakar). Kişi rehberin
 *  dirseğinin hemen ÜSTÜNDEN tutar; rehber yarım adım önde. */
function guidePair({ gx, bx, y, s, walk, look }: { gx: number; bx: number; y: number; s: number; walk?: boolean; look?: boolean }) {
  const gd: PersonProps = {
    ...GIS.helper, x: gx, y, s,
    pose: { ...(walk ? POSE.walk : POSE.standSide), armF: [97, 64], ...(look ? { headView: 'front' as const, face: 'speak' as const } : { face: 'neutral' as const }) },
  };
  const g = rig(gd);
  const grip = lerp(g.shoulderF, g.elbowF, 0.9);
  const bl0: PersonProps = { ...GIS.blind, x: bx, y: y + 2, s, pose: { ...(walk ? { ...POSE.walk, armB: [80, 60] as [number, number] } : POSE.standSide), face: 'neutral' } };
  const b0 = rig(bl0);
  const caneTip: P = [b0.hip[0] + 44 * s, y + 2];
  const caneHand: P = [b0.hip[0] + 10 * s, b0.hip[1] + 6 * s];
  const bl: PersonProps = { ...bl0, pose: { ...bl0.pose, armF: { to: [grip[0] - 7 * s, grip[1]] }, handF: 'mitten', armB: { to: caneHand } } };
  const b = rig(bl);
  const glasses = (r: Rig) => <OG sh={[{ d: capsule([r.head[0] + 1 * s, r.head[1] - 2 * s], 2.6 * s, [r.head[0] + 10 * s, r.head[1] - 2 * s], 2.6 * s), f: '#2b2d3a' }]} />;
  const cane = (
    <g>
      <path d={`M${f1(b.handB[0])} ${f1(b.handB[1])}L${f1(caneTip[0])} ${f1(caneTip[1])}`} stroke={K.out} stroke-width={6} stroke-linecap="round" />
      <path d={`M${f1(b.handB[0])} ${f1(b.handB[1])}L${f1(caneTip[0])} ${f1(caneTip[1])}`} stroke="#fbfaf7" stroke-width={3.4} stroke-linecap="round" />
      <path d={`M${f1(lerp(b.handB, caneTip, 0.8)[0])} ${f1(lerp(b.handB, caneTip, 0.8)[1])}L${f1(lerp(b.handB, caneTip, 0.95)[0])} ${f1(lerp(b.handB, caneTip, 0.95)[1])}`} stroke={K.danger} stroke-width={3.4} />
    </g>
  );
  const el = (
    <g>
      <Person {...bl} only={['armB']} />
      {cane}
      <Person {...bl} only={['legB', 'legF', 'torso', 'head']} over={glasses} />
      <Person {...gd} />
      <Person {...bl} only={['armF']} />
    </g>
  );
  return { el, grip, g, b };
}

/** Yarı oturur anne (önden) + göğsünde yüzüstü yenidoğan. Saygılı/örtülü: annenin alt gövdesi battaniyede.
 *  cover: bebeğin sırtı havluyla örtülü mü. Dönüş: çizim parçaları + önemli noktalar. */
function momNewborn({ mx, cover, towel = '#f2d06b', face = 'neutral' }: { mx: number; cover: boolean; towel?: string; face?: 'neutral' | 'calm' }) {
  const mom: PersonProps = { ...DGM.mom, x: mx, y: 46, ax: 'head', ay: 'head', s: 1.55, sleeve: 'none', shadow: false, pose: { view: 'front', head: -96, armB: [100, 40], armF: [80, 140], face } };
  const m = rig(mom);
  const bp: PersonProps = { x: m.neck[0] - 4, y: m.neck[1] + 26, ax: 'head', ay: 'head', s: 1.7, who: 'baby', skin: 2, shadow: false, hair: 'none', pose: { head: -70, face: 'closed' } };
  const bb = rig(bp);
  const SK = K.skin[2];
  const hR = bb.headR;
  const bc: P = [bb.head[0] + 8, bb.head[1] + hR + 22]; // gövde merkezi
  const body: Sh[] = [
    { d: ell([bc[0] - 22, bc[1] + 24], 11, 8), f: shade(SK, 0.08), t: `rotate(-30 ${f1(bc[0] - 22)} ${f1(bc[1] + 24)})` },
    { d: ell([bc[0] + 22, bc[1] + 26], 11, 8), f: shade(SK, 0.08), t: `rotate(30 ${f1(bc[0] + 22)} ${f1(bc[1] + 26)})` },
    { d: ell(bc, 21, 28), f: SK },
    { d: ell([bc[0], bc[1] + 24], 15, 9), f: SK, no: true },
    { d: capsule([bc[0] - 20, bc[1] - 18], 6, [bb.head[0] - hR - 4, bb.head[1] + 6], 5), f: SK },
    { d: capsule([bc[0] + 20, bc[1] - 18], 6, [bb.head[0] + hR + 4, bb.head[1] + 8], 5), f: SK },
    { d: `M${f1(bc[0])} ${f1(bc[1] - 20)}V${f1(bc[1] + 12)}`, st: shade(SK, 0.18), sw: 1.6 },
  ];
  const BL = '#c1554b';
  const blTop = bc[1] + 38;
  const blanket = `M0 240V${f1(blTop + 8)}Q60 ${f1(blTop - 6)} ${f1(bc[0] - 40)} ${f1(blTop)}Q${f1(bc[0])} ${f1(blTop + 4)} ${f1(bc[0] + 40)} ${f1(blTop)}Q260 ${f1(blTop - 6)} 320 ${f1(blTop + 8)}V240Z`;
  const towelD = smooth([[bc[0] - 26, bc[1] - 16], [bc[0], bc[1] - 26], [bc[0] + 26, bc[1] - 14], [bc[0] + 34, bc[1] + 14], [bc[0] + 30, bc[1] + 40], [bc[0], bc[1] + 44], [bc[0] - 32, bc[1] + 40], [bc[0] - 34, bc[1] + 10]], true, 0.6);
  const back = (
    <g>
      <OG sh={[{ d: rrect(mx - 92, 22, 184, 150, 30), f: '#f4f1ea' }, { d: rrect(mx - 72, 34, 144, 94, 24), f: 'none', st: '#e1dbcf', sw: 2 }]} />
      <Person {...mom} only={['torso', 'head', 'armB', 'armF']} />
    </g>
  );
  const baby = (
    <g>
      <OG sh={body} />
      {cover && <OG sh={[{ d: towelD, f: towel }, { d: `M${f1(bc[0] - 26)} ${f1(bc[1] + 6)}Q${f1(bc[0])} ${f1(bc[1] - 4)} ${f1(bc[0] + 28)} ${f1(bc[1] + 6)}`, st: shade(towel, 0.18), sw: 1.6 }]} />}
      <Person {...bp} only={['head']} />
    </g>
  );
  const cover2 = <OG sh={[{ d: blanket, f: BL }, { d: `M${f1(bc[0] - 60)} ${f1(blTop + 10)}Q${f1(bc[0] - 70)} ${f1(blTop + 40)} ${f1(bc[0] - 56)} 236`, st: shade(BL, 0.2), sw: 2 }]} />;
  return { m, bb, bc, blTop, back, baby, cover: cover2, hR };
}

/** Küçük ölçek kaşığı simgesi (köşe karşılaştırması). heap: tepeleme dolu; aksi halde silme düz dolu */
function MiniScoop({ x, y, heap }: { x: number; y: number; heap: boolean }) {
  const P = '#f3e2b0';
  const bowl = `M${x - 15} ${y - 6}H${x + 15}L${x + 12} ${y + 8}Q${x} ${y + 15} ${x - 12} ${y + 8}Z`;
  return (
    <OG sh={[
      { d: capsule([x + 13, y - 3], 2.6, [x + 28, y + 4], 2.4), f: '#f4f6f8' },
      ...(heap ? [{ d: `M${x - 14} ${y - 5}Q${x - 10} ${y - 24} ${x} ${y - 24}Q${x + 10} ${y - 24} ${x + 14} ${y - 5}Z`, f: P } as Sh] : []),
      { d: bowl, f: P },
      { d: `M${x - 13} ${y + 1}H${x + 13}L${x + 12} ${y + 8}Q${x} ${y + 15} ${x - 12} ${y + 8}Z`, f: '#f4f6f8', no: true },
      { d: `M${x - 17} ${y - 6}H${x + 17}`, st: K.out, sw: 1.6 },
    ]} />
  );
}

/** Kulak arkası işitme cihazı (BTE): kalın muz gövde + ince şeffaf boru + kulak içi uç. x,y gövde altı */
function HearingAid({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  const body = 'M0 0C6 -8 7 -22 2 -34';
  const tube = 'M2 -34C-2 -44 -16 -46 -20 -36C-23 -28 -18 -20 -12 -18';
  return (
    <G x={x} y={y} a={a} s={s}>
      <path d={body} stroke={K.out} stroke-width={13} fill="none" stroke-linecap="round" />
      <path d={body} stroke="#c9b8a6" stroke-width={10} fill="none" stroke-linecap="round" />
      <path d="M1 -4C5 -10 6 -20 3 -28" stroke={tint('#c9b8a6', 0.4)} stroke-width={2.4} fill="none" stroke-linecap="round" />
      <path d="M-3 -12h7" stroke={shade('#c9b8a6', 0.35)} stroke-width={1.4} />
      <circle cx={4} cy={-24} r={1.8} fill={shade('#c9b8a6', 0.45)} />
      <path d={tube} stroke={K.out} stroke-width={4.4} fill="none" stroke-linecap="round" />
      <path d={tube} stroke="#e8f2f7" stroke-width={2.2} fill="none" stroke-linecap="round" />
      <OG ow={OW / s} sh={[{ d: ell([-10, -17], 5, 4), f: '#f4f6f8', t: 'rotate(20 -10 -17)' }]} />
    </G>
  );
}

/* ═══════════════════════════ oyuncular (rehber başına sabit) ═══════════════════════════ */
type Cast = Omit<PersonProps, 'x' | 'y'>;
const BABY_TOP = '#f2c14e';
/** Afette bebek bakımı: anne + bebek */
const BBK = {
  mom: { who: 'woman', role: 'bystander', hair: 'bun', hairC: K.hair.black, skin: 1 } as Cast,
  baby: { who: 'baby', skin: 1, top: BABY_TOP } as Cast,
};
/** Emzirme ve bebek beslenmesi: anne + bebek */
const BSL = {
  mom: { who: 'woman', role: 'bystander', hair: 'long', hairC: K.hair.dark, skin: 2, bottom: 'pants', bottomC: '#6b4f3a' } as Cast,
  baby: { who: 'baby', skin: 1, top: BABY_TOP } as Cast,
};
/** Afette hamileler: hamile kadın + sağlık görevlisi */
const HML = {
  mom: { who: 'woman', role: 'bystander', hair: 'long', hairC: K.hair.black, skin: 2, bottom: 'pants', bottomC: '#5b5f78' } as Cast,
  belly: K.role.bystander,
};
/** Acil doğum: anne + yardımcı */
const DGM = {
  mom: { who: 'woman', role: 'bystander4', top: '#d98c8c', hair: 'long', hairC: K.hair.dark, skin: 1 } as Cast,
  helper: { who: 'man', role: 'helper', skin: 3, hairC: K.hair.black } as Cast,
};
/** Afette yaşlılar: yaşlı kadın + genç komşu */
const YSL = {
  elder: { who: 'oldwoman', role: 'bystander3', skin: 1 } as Cast,
  helper: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black } as Cast,
};
/** Tekerlekli sandalye: kullanıcı + yardımcı */
const TKS = {
  user: { who: 'woman', role: 'victim', hair: 'bun', hairC: K.hair.brown, skin: 0 } as Cast,
  helper: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black } as Cast,
};
/** Görme ve işitme: yardımcı + görme engelli + işitme engelli */
const GIS = {
  helper: { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.dark, skin: 2 } as Cast,
  blind: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.grey } as Cast,
  deaf: { who: 'man', role: 'bystander4', skin: 3, hairC: K.hair.black } as Cast,
};
/** Otizm / zihinsel: anne + çocuk */
const ZHN = {
  mom: { who: 'woman', role: 'bystander2', hair: 'long', hairC: K.hair.black, skin: 1 } as Cast,
  kid: { who: 'boy', role: 'helper', skin: 1 } as Cast,
};
/** Kronik hastalık: hasta */
const KRN = {
  patient: { who: 'woman', role: 'victim', hair: 'long', hairC: K.hair.dark, skin: 1 } as Cast,
};
/** Evcil hayvan: baba + kız */
const EVC = {
  dad: { who: 'man', role: 'bystander', skin: 1, hairC: K.hair.dark } as Cast,
  girl: { who: 'girl', role: 'bystander2', skin: 1 } as Cast,
};

/** Yandan: anne bebeği önünde, yüzü dışarı (sağa) bakacak şekilde dik tutar. Arka el bebeğin
 *  poposunun altında; ön el `nape` ise bebeğin ensesinde (iki parmak), değilse karnını sarar. */
function momUpright({ x, y, s, mom, baby, walk, nape, face = 'neutral', beanie = true, head }: { x: number; y: number; s: number; mom: Cast; baby: Cast; walk?: boolean; nape?: boolean; face?: 'neutral' | 'calm' | 'worried'; beanie?: boolean; head?: boolean }) {
  const m0: PersonProps = { ...mom, x, y, s, ...(head ? { ax: 'head' as const, ay: 'head' as const, shadow: false } : {}), pose: { ...(walk ? POSE.walk : POSE.standSide), head: -86, face } };
  const m = rig(m0);
  const bs = s * 0.95;
  const bp: PersonProps = {
    ...baby, x: m.belly[0] + 10 * s, y: m.belly[1] + 4 * s, ax: 'hip', ay: 'hip', s: bs, shadow: false,
    pose: { spine: -84, chest: -88, head: -92, legB: [-14, 78], legF: [-24, 66], armB: [70, 30], armF: [56, 10], face: nape ? 'closed' : 'neutral' },
  };
  const b = rig(bp);
  const touch: P = nape ? [b.nape[0] - 9 * s, b.nape[1] - 1 * s] : [b.back[0] - 1 * s, b.back[1] + 9 * s];
  const hold: PersonProps = {
    ...m0,
    pose: { ...m0.pose, armB: { to: [b.hip[0] + 4 * s, b.hip[1] + 7 * s], bend: 1 }, armF: { to: touch, bend: 1 }, handB: 'mitten', handF: { shape: 'flat', a: nape ? 10 : 0 } },
  };
  const el = (
    <g>
      <Person {...hold} only={['legB', 'legF', 'armB', 'torso', 'head']} />
      <Person {...bp} />
      {beanie && <Beanie r={b} c="#e0607a" />}
      <Person {...hold} only={['armF']} />
    </g>
  );
  return { el, m: rig(hold), b, touch };
}

/* ═══════════════════════════ sahneler ═══════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ───────── Bebek bakımı ───────── */
  'ozel-gruplar-bebek-kanguru': () => {
    const mom: PersonProps = { ...BBK.mom, x: 158, y: 232, s: 1.28, pose: { ...POSE.stand, face: 'calm' } };
    const m = rig(mom);
    const s = 1.28;
    const babyP: PersonProps = {
      ...BBK.baby, x: m.neck[0] + 4, y: m.neck[1] + 23, ax: 'head', ay: 'head', s: 1.3, shadow: false,
      pose: { view: 'front', headView: 'side', head: -84, armB: [150, 60], armF: [30, 120], legB: [125, 95], legF: [55, 85], face: 'closed' },
    };
    const b = rig(babyP);
    const pt: P = [b.neck[0], b.neck[1] + 4];
    const pouchTop = pt[1] + 2;
    const pouchBot = b.hip[1] + 8;
    const pouch = `M${f1(pt[0] - 20)} ${f1(pouchTop)}Q${f1(pt[0])} ${f1(pouchTop - 5)} ${f1(pt[0] + 20)} ${f1(pouchTop)}L${f1(pt[0] + 18)} ${f1(pouchBot - 6)}Q${f1(pt[0])} ${f1(pouchBot + 6)} ${f1(pt[0] - 18)} ${f1(pouchBot - 6)}Z`;
    const PC = '#5b6fb5';
    const strapW = 5 * s;
    const hold: PersonProps = { ...mom, pose: { ...mom.pose, armF: { to: [pt[0] + 14, pouchBot - 4], bend: -1 } } };
    return (
      <Scene2 bg="outdoor">
        <Tent x={42} y={192} s={0.75} color="#3f8fb8" />
        <Tent x={278} y={194} s={0.85} />
        <Tent x={236} y={188} s={0.55} color="#6c9c5a" />
        <Person
          {...hold}
          only={['legB', 'legF', 'torso', 'head', 'armB']}
          back={(r) => <OG sh={[{ d: rrect(r.shoulderB[0] - 7 * s, r.neck[1] - 6 * s, r.shoulderF[0] - r.shoulderB[0] + 14 * s, 50 * s, 6 * s), f: '#c0603e' }]} />}
          mid={(r) => (
            <g>
              <path d={`M${f1(r.shoulderB[0] + 1)} ${f1(r.shoulderB[1] - 3)}L${f1(r.shoulderB[0] + 3)} ${f1(r.hip[1] - 26 * s)}M${f1(r.shoulderF[0] - 1)} ${f1(r.shoulderF[1] - 3)}L${f1(r.shoulderF[0] - 3)} ${f1(r.hip[1] - 26 * s)}`} stroke={K.out} stroke-width={strapW + 3} stroke-linecap="round" />
              <path d={`M${f1(r.shoulderB[0] + 1)} ${f1(r.shoulderB[1] - 3)}L${f1(r.shoulderB[0] + 3)} ${f1(r.hip[1] - 26 * s)}M${f1(r.shoulderF[0] - 1)} ${f1(r.shoulderF[1] - 3)}L${f1(r.shoulderF[0] - 3)} ${f1(r.hip[1] - 26 * s)}`} stroke={shade('#c0603e', 0.2)} stroke-width={strapW} stroke-linecap="round" />
              <path d={`M${f1(r.neck[0] - 9)} ${f1(r.neck[1] - 1)}L${f1(pt[0] - 17)} ${f1(pouchTop + 2)}M${f1(r.neck[0] + 9)} ${f1(r.neck[1] - 1)}L${f1(pt[0] + 17)} ${f1(pouchTop + 2)}`} stroke={K.out} stroke-width={8} stroke-linecap="round" />
              <path d={`M${f1(r.neck[0] - 9)} ${f1(r.neck[1] - 1)}L${f1(pt[0] - 17)} ${f1(pouchTop + 2)}M${f1(r.neck[0] + 9)} ${f1(r.neck[1] - 1)}L${f1(pt[0] + 17)} ${f1(pouchTop + 2)}`} stroke={PC} stroke-width={5} stroke-linecap="round" />
              <OG sh={[{ d: rrect(r.hip[0] - 18 * s, pouchBot - 12, 36 * s, 9, 3), f: shade(PC, 0.15) }]} />
            </g>
          )}
        />
        <Person {...babyP} />
        <OG sh={[{ d: pouch, f: PC }, { d: `M${f1(pt[0] - 15)} ${f1(pouchTop + 8)}Q${f1(pt[0])} ${f1(pouchTop + 4)} ${f1(pt[0] + 15)} ${f1(pouchTop + 8)}`, st: tint(PC, 0.35), sw: 1.6 }]} />
        <Person {...hold} only={['armF']} />
        <Ok x={232} y={104} r={15} />
      </Scene2>
    );
  },

  'ozel-gruplar-bebek-bere': () => {
    const u = momUpright({ x: 112, y: 54, s: 2.5, mom: BBK.mom, baby: BBK.baby, face: 'calm', head: true });
    const hat = u.b.head;
    return (
      <Scene2 bg="indoor" wall="#e9dcc8">
        {u.el}
        <Arrow from={[hat[0] + 80, hat[1] - 40]} to={[hat[0] + 34, hat[1] - 26]} bend={-0.2} />
      </Scene2>
    );
  },

  'ozel-gruplar-bebek-ense-kontrol': () => {
    const u = momUpright({ x: 96, y: 62, s: 2.5, mom: BBK.mom, baby: BBK.baby, nape: true, head: true });
    return (
      <Scene2 bg="indoor" wall="#e9dcc8">
        {u.el}
        <Chip x={206} y={74} w={102} h={34}>
          <Drop x={226} y={92} s={1.2} />
          <Txt x={276} y={96} t="−1 kat" size={14} />
        </Chip>
        <Chip x={206} y={118} w={102} h={34}>
          <Flake x={226} y={135} r={10} />
          <Txt x={276} y={140} t="+1 kat" size={14} />
        </Chip>
      </Scene2>
    );
  },

  'ozel-gruplar-bebek-saglik-git': () => {
    const u = momUpright({ x: 96, y: 236, s: 1.42, mom: BBK.mom, baby: BBK.baby, walk: true, face: 'worried' });
    return (
      <Scene2 bg="outdoor">
        <HealthTent x={262} y={206} s={1.25} />
        {u.el}
        <Arrow from={[178, 132]} to={[222, 132]} />
      </Scene2>
    );
  },

  'ozel-gruplar-bebek-sirtustu-uyku': () => {
    const C: P = [166, 124];
    const b: PersonProps = { ...BBK.baby, x: 166, y: 146, ax: 'hip', ay: 'hip', s: 2.15, shadow: false, pose: { view: 'front', armB: [104, 86], armF: [76, 94], legB: [96, 92], legF: [84, 88], face: 'closed' } };
    const r = rig(b);
    const blTop = r.chest[1] + 2;
    const BL = '#9cc3e6';
    return (
      <Scene2 bg="floor">
        <OG sh={[{ d: rrect(62, 48, 220, 152, 10), f: '#eef1f4' }, { d: rrect(68, 54, 208, 140, 8), f: '#dfe7ee', ln: true }]} />
        <g transform={`rotate(-90 ${C[0]} ${C[1]})`}>
          <Person {...b} only={['legB', 'legF', 'torso', 'head']} />
          <OG sh={[{ d: rrect(r.hip[0] - 34, blTop, 68, 92, 6), f: BL }, { d: `M${r.hip[0] - 34} ${blTop + 7}H${r.hip[0] + 34}`, st: tint(BL, 0.4), sw: 3 }]} />
          <Person {...b} only={['armB', 'armF']} />
        </g>
        <Ok x={262} y={66} r={15} />
        <G x={36} y={38}>
          <OG sh={[{ d: 'M-22 -14Q0 -20 22 -14Q28 0 22 14Q0 20 -22 14Q-28 0 -22 -14Z', f: '#fbfaf7' }, { d: 'M-22 -14l5 5M22 -14l-5 5M-22 14l5 -5M22 14l-5 -5', st: '#b9c2cc', sw: 1.4 }]} />
        </G>
        <No x={36} y={38} r={27} />
      </Scene2>
    );
  },

  /* ───────── Beslenme ───────── */
  'ozel-gruplar-emzirme': () => {
    const s = 1.45;
    const mom: PersonProps = {
      ...BSL.mom, x: 156, y: 222, s, shoes: null,
      pose: { view: 'front', head: -100, legB: [168, 18], legF: [12, 162], footB: -20, footF: 20, face: 'calm' },
    };
    const m = rig(mom);
    const elbow: P = [m.shoulderB[0] - 8, m.shoulderB[1] + 34];
    // bebek: anneye dönük yatay kucak tutuşu; başı annenin göğsünde (ekranın sağı), gövdesi annenin karnına dönük
    const baby: PersonProps = { ...BSL.baby, x: m.neck[0] - 26, y: elbow[1] + 6, ay: 'hip', s: 1.45, flip: true, shadow: false, pose: { spine: 200, chest: 204, head: 212, legB: [-30, 20], legF: [-20, 30], armB: [-120, -60], armF: [-80, -40], face: 'closed' } };
    const bb = rig(baby);
    const hold: PersonProps = { ...mom, pose: { ...mom.pose, armB: { to: [bb.hip[0] + 2, bb.hip[1] + 7], bend: 1 }, armF: { to: [bb.neck[0] + 2, bb.neck[1] + 10], bend: -1 } } };
    const SH = '#e9a9b8';
    // örtü yalnızca annenin bebekten uzak omzunda; bebeğin başı ve yüzü açık
    const shawl = smooth([
      [m.neck[0] - 2, m.neck[1] - 2], [m.shoulderB[0] - 4, m.shoulderB[1] - 4], [m.shoulderB[0] - 12, m.shoulderB[1] + 14],
      [m.shoulderB[0] - 13, m.shoulderB[1] + 30], [m.shoulderB[0] - 4, m.shoulderB[1] + 34], [m.shoulderB[0] + 4, m.shoulderB[1] + 14], [m.neck[0] - 4, m.neck[1] + 8],
    ], true, 0.6);
    // bebeğin başı (profil, yüzü sola: annenin göğsüne dönük)
    const H = bb.head, R = bb.headR * 1.05;
    const SK = K.skin[1];
    const face = (
      <g>
        <OG sh={[
          { d: circ(H, R), f: SK },
          { d: ell([H[0] + R * 0.3, H[1] + R * 0.05], R * 0.2, R * 0.27), f: shade(SK, 0.1), ln: true },
          { d: `M${f1(H[0] - R * 0.2)} ${f1(H[1] - R * 0.95)}q${f1(R * 0.3)} ${f1(-R * 0.25)} ${f1(R * 0.5)} ${f1(R * 0.05)}`, st: K.hair.brown, sw: 2 },
        ]} />
        <path d={`M${f1(H[0] - R * 0.62)} ${f1(H[1] - R * 0.1)}q${f1(R * 0.18)} ${f1(R * 0.14)} ${f1(R * 0.34)} 0`} stroke={K.ink} stroke-width={1.5} fill="none" stroke-linecap="round" />
        <circle cx={H[0] - R * 0.35} cy={H[1] + R * 0.25} r={R * 0.16} fill="#f2a6a0" opacity={0.7} />
        <path d={`M${f1(H[0] - R * 0.96)} ${f1(H[1] + R * 0.18)}q${f1(-R * 0.14)} ${f1(R * 0.1)} 0 ${f1(R * 0.2)}`} stroke={K.out} stroke-width={1.3} fill="none" stroke-linecap="round" />
      </g>
    );
    return (
      <Scene2 bg="indoor" wall="#f3d6ae" gy={196}>
        <path d="M0 0L118 0L0 150Z" fill="#e8c393" />
        <path d="M320 0L202 0L320 150Z" fill="#e8c393" />
        <OG sh={[{ d: rrect(78, 204, 156, 28, 12), f: '#c1554b' }, { d: 'M90 214H222', st: tint('#c1554b', 0.3), sw: 2 }]} />
        <Person {...hold} only={['legB', 'legF', 'torso', 'head', 'armF']} />
        <OG sh={[{ d: shawl, f: SH }, { d: `M${f1(m.shoulderB[0] - 2)} ${f1(m.shoulderB[1] + 2)}Q${f1(m.shoulderB[0] - 8)} ${f1(m.shoulderB[1] + 16)} ${f1(m.shoulderB[0] - 6)} ${f1(m.shoulderB[1] + 28)}`, st: shade(SH, 0.25), sw: 1.6 }]} />
        <Person {...baby} only={['legB', 'legF', 'torso', 'armB', 'armF']} />
        {face}
        <Person {...hold} only={['armB']} />
        <Bottle x={270} y={226} s={1.2} fill={0.75} />
      </Scene2>
    );
  },

  'ozel-gruplar-mama-olcu': () => {
    const TIN = '#f1efe6';
    const sc: P = [150, 100];
    const gh = handAt({ a: 62, s: 0.9, pose: 'hold', side: 'R', arm: 200, sleeve: K.role.bystander, skin: 2, grip: 30 }, 'grip', [88, 134]);
    const kh = handAt({ a: -80, s: 0.85, pose: 'hold', side: 'L', arm: 200, sleeve: K.role.bystander, skin: 2, grip: 30 }, 'grip', [244, 86]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={190} width={320} height={50} fill={K.wood} />
        <rect x={0} y={190} width={320} height={4} fill={shade(K.wood, 0.2)} />
        <OG sh={[{ d: ell([46, 206], 30, 8), f: shade(TIN, 0.08) }, { d: ell([46, 203], 24, 5), f: TIN, ln: true }]} />
        <OG
          sh={[
            { d: 'M100 126V184Q100 194 150 194Q200 194 200 184V126Z', f: TIN },
            { d: 'M100 144H200V166H100Z', f: '#7fb8d8', ln: true },
            { d: ell([150, 126], 50, 11), f: shade(TIN, 0.1) },
            { d: ell([150, 126], 44, 8.5), f: '#f6ecd0', ln: true },
          ]}
        />
        <circle cx={150} cy={155} r={6} fill="#fff" />
        <circle cx={150} cy={153} r={3.4} fill="#f2c14e" />
        <OG sh={[{ d: capsule([88, 134], 3.6, [sc[0] - 22, sc[1] + 6], 3.2), f: '#f4f6f8' }, { d: `M${sc[0] - 24} ${sc[1] - 4}H${sc[0] + 24}L${sc[0] + 20} ${sc[1] + 14}Q${sc[0]} ${sc[1] + 22} ${sc[0] - 20} ${sc[1] + 14}Z`, f: '#f4f6f8' }]} />
        <OG sh={[{ d: `M${sc[0] - 23} ${sc[1] - 4}Q${sc[0] - 16} ${sc[1] - 20} ${sc[0] - 4} ${sc[1] - 16}Q${sc[0] + 2} ${sc[1] - 12} ${sc[0] + 4} ${sc[1] - 4}Z`, f: '#f6ecd0' }, { d: rrect(sc[0] + 3, sc[1] - 6, 21, 3, 1), f: '#f6ecd0', no: true }]} />
        <Hand {...gh} />
        <OG sh={[{ d: rrect(sc[0] + 2, sc[1] - 16, 84, 10, 2), f: '#cfd6de' }, { d: `M${sc[0] + 2} ${sc[1] - 6}H${sc[0] + 86}`, st: '#8a96a3', sw: 2 }, { d: rrect(sc[0] + 80, sc[1] - 20, 50, 14, 5), f: '#3b3f4b' }]} />
        <Hand {...kh} />
        <path d={`M${sc[0] - 30} ${sc[1] + 4}l-2 8M${sc[0] - 26} ${sc[1] + 12}l-1 6`} stroke="#e8dcb8" stroke-width={2.6} stroke-linecap="round" />
        <Arrow from={[sc[0] + 54, 44]} to={[sc[0] - 4, 62]} bend={0.25} />
        <Bottle x={238} y={212} s={1.1} fill={0.85} />
        <Cup x={280} y={212} s={1.2} level={0} />
        <rect x={14} y={14} width={116} height={62} rx={12} fill="#fff" stroke={K.out} stroke-width={1.5} />
        <MiniScoop x={40} y={50} heap={false} />
        <Ok x={40} y={28} r={10} />
        <MiniScoop x={96} y={54} heap />
        <Bad x={112} y={26} r={10} />
      </Scene2>
    );
  },

  'ozel-gruplar-bardakla-besleme': () => {
    const s = 1.6;
    const ad: PersonProps = { ...BSL.mom, x: 92, y: 230, s, pose: { ...POSE.sitChair, spine: -100, chest: -96, head: -72, face: 'calm' } };
    const a0 = rig(ad);
    const bh: P = lerp(a0.hip, a0.kneeF, 0.92);
    const baby: PersonProps = { ...BSL.baby, x: bh[0] + 2, y: bh[1] - 7 * s, ax: 'hip', ay: 'hip', s: 1.45, flip: true, shadow: false, pose: { spine: -74, chest: -78, head: -84, legB: [-10, 70], legF: [-18, 62], armB: [70, 30], armF: [50, 10], face: 'neutral' } };
    const b = rig(baby);
    const lip: P = [b.mouth[0] - 1, b.mouth[1] + 3];
    const cupBase: P = [lip[0] - 18, lip[1] + 13];
    const adult: PersonProps = { ...ad, pose: { ...ad.pose, armB: { to: [b.back[0] + 2, b.back[1] - 6] }, armF: { to: [cupBase[0] - 4, cupBase[1] - 4] } } };
    return (
      <Scene2 bg="indoor">
        <Chair x={92} y={230} seat={44 * s} s={s} />
        <Person {...adult} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...baby} />
        <Cup x={cupBase[0]} y={cupBase[1]} s={1.05} a={36} level={0.5} />
        <Person {...adult} only={['armF']} />
        <Ok x={b.head[0] + 34} y={b.head[1] - 20} r={14} />
        <BabyBottle x={272} y={98} s={1.0} fill={0.6} />
        <No x={272} y={72} r={32} />
      </Scene2>
    );
  },

  /* ───────── Hamile ───────── */
  'ozel-gruplar-hamile-bildir': () => {
    const s = 1.2;
    const wpose = { ...POSE.stand, headView: 'side' as const, face: 'speak' as const };
    const w0: PersonProps = { ...HML.mom, x: 104, y: 228, s, pose: wpose };
    const wr = rig(w0);
    const bc = lerp(wr.hip, wr.neck, 0.3);
    const woman: PersonProps = { ...w0, pose: { ...wpose, armF: { to: [bc[0] + 8 * s, bc[1] - 2] } } };
    const w2: PersonProps = { x: 222, y: 228, s, who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown, flip: true, pose: { ...POSE.stand, headView: 'side', head: -92, face: 'neutral' } };
    const hr = rig(w2);
    const clip: P = [hr.hip[0] - 4, hr.hip[1] - 32];
    const worker: PersonProps = { ...w2, pose: { ...w2.pose, armB: { to: [clip[0] + 12, clip[1] + 12] }, armF: { to: [clip[0] - 2, clip[1] - 2] }, handF: 'fist' } };
    return (
      <Scene2 bg="outdoor">
        <Tent x={40} y={194} s={0.7} color="#3f8fb8" />
        <HealthTent x={290} y={196} s={0.75} />
        <Tent x={168} y={186} s={0.45} />
        <Person {...woman} mid={(r) => <BellyFront r={r} c={HML.belly} />} />
        <Person {...worker} only={['legB', 'legF', 'torso', 'head']} mid={(r) => <VestFront r={r} c="#fbfaf7" emblem="crescent" />} />
        <g transform={`rotate(-14 ${clip[0]} ${clip[1]})`}>
          <OG sh={[{ d: rrect(clip[0] - 14, clip[1] - 18, 28, 36, 2), f: '#a8724a' }, { d: rrect(clip[0] - 11, clip[1] - 14, 22, 30, 1), f: '#fbfaf7' }, { d: rrect(clip[0] - 5, clip[1] - 20, 10, 5, 1.5), f: K.metal }, { d: `M${clip[0] - 7} ${clip[1] - 6}h14M${clip[0] - 7} ${clip[1]}h14M${clip[0] - 7} ${clip[1] + 6}h9`, st: '#9aa3b0', sw: 1.6 }]} />
        </g>
        <Person {...worker} only={['armB', 'armF']} />
        <path d={`M${f1(clip[0] - 4)} ${f1(clip[1] + 2)}l-7 -12`} stroke={K.out} stroke-width={3} stroke-linecap="round" />
      </Scene2>
    );
  },

  'ozel-gruplar-hamile-bebek-hareket': () => {
    const s = 1.5;
    const w0: PersonProps = { ...HML.mom, x: 96, y: 228, s, pose: { ...POSE.sitChair, spine: -98, head: -100, face: 'worried' } };
    const r0 = rig(w0);
    const bm = lerp(r0.belly, r0.chest, 0.38);
    const top: P = [bm[0] + 8 * s, bm[1] - 9 * s];
    const low: P = [bm[0] + 16 * s, bm[1] + 6 * s];
    const woman: PersonProps = { ...w0, pose: { ...w0.pose, armB: { to: top }, armF: { to: low } } };
    return (
      <Scene2 bg="outdoor">
        <HealthTent x={272} y={204} s={0.95} />
        <Chair x={96} y={228} seat={44 * s} s={s} />
        <Person {...woman} only={['legB', 'legF', 'torso', 'head']} mid={(r) => <BellySide r={r} c={HML.belly} />} />
        <Person {...woman} only={['armB']} />
        <Person {...woman} only={['armF']} />
        <Waves x={bm[0] + 22 * s} y={bm[1] - 6} a={-40} n={3} r={6} color="#7a5fb0" />
        <Label x={bm[0] + 48 * s} y={bm[1] - 40} text="?" size={20} bg="#fff" />
        <Arrow from={[200, 186]} to={[238, 186]} />
      </Scene2>
    );
  },

  'ozel-gruplar-hamile-su': () => {
    const s = 1.3;
    const w0: PersonProps = { ...HML.mom, x: 132, y: 226, s, pose: { ...POSE.sitChair, spine: -96, head: -112, face: 'closed' } };
    const r0 = rig(w0);
    const mouth = r0.mouth;
    const dir = -110;
    const bs = 1.1;
    const cap = pol(mouth, 0, 3);
    const base = pol(cap, dir + 90 + 180, 0);
    const vec: P = [Math.sin(dir / R2D), -Math.cos(dir / R2D)];
    const bb: P = [cap[0] - vec[0] * 46 * bs, cap[1] - vec[1] * 46 * bs];
    const grip = lerp(bb, cap, 0.35);
    const woman: PersonProps = { ...w0, pose: { ...w0.pose, armF: { to: [grip[0], grip[1] + 2], bend: 1 }, armB: { at: 'kneeF', d: [-10, -6] } } };
    void base;
    return (
      <Scene2 bg="outdoor">
        <Tree x={70} y={200} s={1.55} />
        <ellipse cx={130} cy={222} rx={110} ry={12} fill="#000" opacity={0.12} />
        <Chair x={132} y={226} seat={44 * s} s={s} />
        <Person {...woman} only={['legB', 'legF', 'torso', 'head', 'armB']} mid={(r) => <BellySide r={r} c={HML.belly} />} />
        <Bottle x={bb[0]} y={bb[1]} s={bs} a={dir} fill={0.5} />
        <Person {...woman} only={['armF']} />
        <Bottle x={232} y={226} s={1.1} fill={0.92} />
        <Bottle x={256} y={228} s={1.1} fill={0.92} />
        <Bottle x={280} y={225} s={1.1} fill={0.92} />
        <Ok x={bb[0] + 18} y={bb[1] - 34} r={14} />
      </Scene2>
    );
  },

  'ozel-gruplar-hamile-belgeler': () => {
    const bagX = 64, bagY = 104, bagW = 192, bagH = 122;
    const card: P = [150, 70];
    const ch = handAt({ a: 172, s: 0.9, pose: 'pinch', side: 'R', arm: 200, sleeve: HML.belly, skin: 2 }, 'pinch', [card[0] + 6, card[1] - 22]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(bagX, bagY, bagW, bagH, 6), f: '#e3f1f8' }]} />
        <Paper x={bagX + 18} y={bagY + 22} w={58} h={78} a={-6} lines={6} />
        <Ultrasound x={bagX + 100} y={bagY + 34} w={62} h={50} a={7} />
        <rect x={bagX} y={bagY} width={bagW} height={bagH} rx={6} fill="#d6ecf6" opacity={0.42} stroke={K.out} stroke-width={1.5} />
        <path d={`M${bagX + 10} ${bagY + 18}L${bagX + 24} ${bagY + 64}M${bagX + 18} ${bagY + 18}L${bagX + 26} ${bagY + 42}`} stroke="#fff" stroke-width={3} opacity={0.75} stroke-linecap="round" />
        <path d={`M${bagX + 2} ${bagY + 9}H${bagX + bagW - 2}`} stroke={K.out} stroke-width={6} />
        <path d={`M${bagX + 2} ${bagY + 9}H${bagX + bagW - 2}`} stroke="#4f8fd0" stroke-width={3} />
        <OG sh={[{ d: rrect(bagX + bagW - 22, bagY + 2, 14, 14, 3), f: '#4f8fd0' }]} />
        <g transform={`rotate(4 ${card[0]} ${card[1]})`}>
          <OG sh={[{ d: rrect(card[0] - 30, card[1] - 22, 60, 66, 4), f: '#f6c2cf' }, { d: rrect(card[0] - 30, card[1] - 22, 60, 14, 4), f: '#e0607a', ln: true }]} />
          <path d={`M${card[0]} ${card[1] + 24}c-8-6-12-10-12-15a6 6 0 0 1 12-2a6 6 0 0 1 12 2c0 5-4 9-12 15z`} fill="#e0607a" stroke={K.out} stroke-width={1.2} />
        </g>
        <Hand {...ch} />
        <Arrow from={[270, 40]} to={[228, 98]} bend={-0.2} />
      </Scene2>
    );
  },

  /* ───────── Acil doğum ───────── */
  'ozel-gruplar-dogum-hazirlik': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: rrect(24, 28, 176, 184, 4), f: '#fbfaf7' }, { d: 'M70 28V212M24 120H200', st: '#e3dfd6', sw: 1.6 }]} />
      {[0, 1, 2].map((i) => (
        <OG key={i} sh={[{ d: rrect(222, 34 - i * 6, 76, 30, 5), f: ['#f4f1ea', '#bfe3f5', '#f4f1ea'][i] }, { d: `M226 ${44 - i * 6}H294`, st: '#c9ced6', sw: 1.4 }]} />
      ))}
      <OG sh={[{ d: rrect(220, 82, 82, 50, 6), f: '#c1554b' }, { d: rrect(226, 88, 70, 38, 4), f: 'none', st: tint('#c1554b', 0.35), sw: 1.6 }]} />
      <GloveTop x={236} y={186} a={-16} s={1.05} />
      <GloveTop x={268} y={190} a={14} s={1.05} />
      <Bottle x={256} y={226} s={0.95} a={-90} fill={0.9} />
      <Ok x={112} y={120} r={20} />
    </Scene2>
  ),

  'ozel-gruplar-dogum-bas-destek': () => {
    // Saygılı yan görünüş: anne yastıklara yaslanmış yarı oturur; dizleri bükük, belden aşağısı örtülü.
    // Örtünün alt kenarından yalnızca bebeğin başı görünür; yardımcının eldivenli avucu başı alttan destekler.
    const gy = 222;
    const mom: PersonProps = { ...DGM.mom, x: 82, y: gy - 4, ay: 'hip', s: 1.2, shadow: false, pose: { spine: -122, chest: -114, head: -96, armB: { floor: -18 }, armF: { to: [104, 196] }, handF: 'flat', face: 'worried' } };
    const m = rig(mom);
    const HR = 12;
    const head: P = [142, gy - HR - 1];
    const SHEET = '#f4f1ea';
    // örtü: göğüs altından bükük dizlerin üstüne, oradan yere; alt kenarı başın hemen üstünden geçer
    const drape = smooth([
      [m.belly[0] - 6, m.belly[1] - 8], [112, 150], [140, 142], [170, 160], [194, 200], [202, gy + 2], [166, gy + 2],
      [156, head[1] - HR - 4], [136, head[1] - HR - 6], [112, gy - 14], [m.hip[0] - 4, gy - 2], [m.hip[0] - 12, m.hip[1] - 10],
    ], true, 0.45);
    const folds = 'M140 146Q150 176 172 210M120 156Q122 180 132 192M100 166Q100 190 106 206';
    const cupTo: P = [head[0] + 24, gy - 2];
    const helper: PersonProps = { ...DGM.helper, x: 262, y: gy + 2, s: 1.25, flip: true, pose: { ...POSE.kneelSit, spine: -60, chest: -52, head: -50, armB: { to: [cupTo[0] + 8, cupTo[1] - 7] }, armF: { to: cupTo }, handB: 'none', handF: 'none', face: 'neutral' } };
    const h = rig(helper);
    // eldivenli açık avuç: başın altında, parmak uçları başın arkasına kıvrık
    const w = h.wristF;
    const palm = smooth([[w[0] + 2, w[1] - 5], [head[0] + 8, gy - 3], [head[0] - 6, gy - 1], [head[0] - HR - 2, head[1] + 2], [head[0] - HR - 6, head[1] + 4], [head[0] - HR - 3, gy + 3], [head[0] - 2, gy + 6], [w[0] + 2, w[1] + 5]], true, 0.55);
    return (
      <Scene2 bg="indoor" gy={162}>
        <g transform="translate(160 240) scale(1.3) translate(-148 -240)">
        <OG sh={[{ d: rrect(-40, gy - 2, 400, 14, 4), f: '#fbfaf7' }]} />
        <OG sh={[{ d: rrect(6, m.neck[1] - 20, 54, 96, 18), f: '#bfe3f5', t: `rotate(-30 33 ${f1(m.neck[1] + 28)})` }, { d: rrect(14, m.neck[1] + 28, 50, 44, 14), f: '#9cc3e6', t: `rotate(-24 39 ${f1(m.neck[1] + 50)})` }]} />
        <Person {...mom} only={['torso', 'head', 'armB']} />
        <OG sh={[{ d: circ(head, HR), f: K.skin[1] }, { d: `M${f1(head[0] - HR)} ${f1(head[1] + 1)}A${HR} ${HR} 0 0 1 ${f1(head[0] - 1)} ${f1(head[1] - HR)}L${f1(head[0] - 3)} ${f1(head[1] - 1)}Z`, f: K.hair.dark, ln: true }]} />
        <path d={`M${f1(head[0] + 3)} ${f1(head[1] + 2)}q3 2 6 0`} stroke={K.ink} stroke-width={1.4} fill="none" stroke-linecap="round" />
        <OG sh={[{ d: drape, f: SHEET }, { d: folds, st: '#d6d0c4', sw: 1.8 }]} />
        <Person {...mom} only={['armF']} />
        <Person {...helper} />
        <GloveOn r={h} k="B" a={0} L={11} />
        <OG sh={[{ d: palm, f: GLOVE }, { d: capsule(pol(w, h.foreF, -6), 5.6, w, 5.2), f: tint(GLOVE, 0.25) }]} />
        </g>
        <Arrow from={[196, 52]} to={[256, 52]} w={6} />
        <No x={226} y={54} r={30} />
      </Scene2>
    );
  },

  'ozel-gruplar-dogum-kurulama': () => {
    const T = '#f2d06b';
    const nb = momNewborn({ mx: 120, cover: false });
    const { bc } = nb;
    // kuru havlu bebeğin sırtında; yardımcının tek eli (sağ kenardan) havluyla sırtı kuruluyor
    const rub: P = [bc[0] + 8, bc[1] + 2];
    const h1 = handAt({ a: -96, s: 0.62, pose: 'press', side: 'R', arm: 260, sleeve: K.role.helper, skin: DGM.helper.skin }, 'palm', rub);
    return (
      <Scene2 bg="indoor" wall="#efe4d2">
        {nb.back}
        {nb.baby}
        {nb.cover}
        <OG sh={[{ d: `M${f1(bc[0] - 26)} ${f1(bc[1] - 18)}Q${f1(bc[0] + 4)} ${f1(bc[1] - 28)} ${f1(bc[0] + 30)} ${f1(bc[1] - 10)}L${f1(bc[0] + 28)} ${f1(bc[1] + 22)}Q${f1(bc[0] + 2)} ${f1(bc[1] + 30)} ${f1(bc[0] - 24)} ${f1(bc[1] + 16)}Z`, f: T }, { d: `M${f1(bc[0] - 16)} ${f1(bc[1] - 4)}Q${f1(bc[0] + 4)} ${f1(bc[1] - 12)} ${f1(bc[0] + 22)} ${f1(bc[1])}`, st: shade(T, 0.18), sw: 1.6 }]} />
        <Hand {...h1} />
        <OG sh={[{ d: 'M18 222Q12 200 32 196Q44 186 62 196Q82 200 76 222Z', f: '#b9d6e4' }, { d: 'M28 210Q46 202 68 212', st: '#8fb3c8', sw: 1.6 }]} />
        <Drop x={26} y={232} s={0.7} />
        <Drop x={70} y={233} s={0.6} />
      </Scene2>
    );
  },

  'ozel-gruplar-ten-tene': () => {
    const nb = momNewborn({ mx: 150, cover: false, face: 'calm' });
    const { bb, hR, bc } = nb;
    const BL = '#c1554b';
    const top = bb.head[1] + hR + 2;
    const blanket = `M0 240V${f1(top + 34)}Q50 ${f1(top + 8)} ${f1(bc[0] - 54)} ${f1(top + 2)}Q${f1(bc[0])} ${f1(top - 6)} ${f1(bc[0] + 54)} ${f1(top + 2)}Q270 ${f1(top + 8)} 320 ${f1(top + 34)}V240Z`;
    return (
      <Scene2 bg="indoor" wall="#efe4d2">
        {nb.back}
        {nb.baby}
        <OG sh={[{ d: blanket, f: BL }, { d: `M${f1(bc[0] - 54)} ${f1(top + 12)}Q${f1(bc[0] - 64)} ${f1(top + 60)} ${f1(bc[0] - 46)} 236M${f1(bc[0] + 54)} ${f1(top + 12)}Q${f1(bc[0] + 64)} ${f1(top + 60)} ${f1(bc[0] + 48)} 236`, st: shade(BL, 0.2), sw: 2 }]} />
        <Beanie r={bb} c="#7fb8d8" lift={0.3} />
        <path d={`M262 ${f1(top - 30)}q-5 -6 0 -12t0 -12M274 ${f1(top - 26)}q-5 -6 0 -12t0 -12`} fill="none" stroke="#e8472d" stroke-width={3} stroke-linecap="round" opacity={0.85} />
        <Ok x={282} y={40} r={16} />
      </Scene2>
    );
  },

  'ozel-gruplar-dogum-kordon-kesme': () => {
    const nb = momNewborn({ mx: 112, cover: true });
    const { bc, blTop } = nb;
    // kordon: havlunun altından çıkıp gevşek bir kavisle battaniyenin altına (anneye) gider
    const c0: P = [bc[0] - 28, bc[1] + 22];
    const cEnd: P = [bc[0] - 34, blTop + 34];
    const cord = smooth([c0, [c0[0] - 14, c0[1] + 4], [c0[0] - 30, c0[1] + 18], [c0[0] - 32, blTop + 18], [c0[0] - 20, blTop + 30], cEnd]);
    const BL = '#c1554b';
    const fold = `M${f1(cEnd[0] - 46)} ${f1(cEnd[1] + 4)}Q${f1(cEnd[0] - 20)} ${f1(cEnd[1] - 12)} ${f1(cEnd[0] + 4)} ${f1(cEnd[1] - 4)}Q${f1(cEnd[0] + 26)} ${f1(cEnd[1] + 4)} ${f1(cEnd[0] + 50)} ${f1(cEnd[1] - 2)}`;
    // ağzı kapalı poşette eş (plasenta), bebeğin yanında
    const bag: P = [bc[0] + 64, blTop - 4];
    return (
      <Scene2 bg="indoor" wall="#efe4d2">
        {nb.back}
        {nb.baby}
        {nb.cover}
        <path d={cord} fill="none" stroke={K.out} stroke-width={8.5} stroke-linecap="round" />
        <path d={cord} fill="none" stroke="#d9b2c4" stroke-width={5.5} stroke-linecap="round" />
        <path d={cord} fill="none" stroke="#efd3df" stroke-width={1.4} stroke-dasharray="3 6" stroke-linecap="round" />
        <path d={`${fold}V${f1(cEnd[1] + 30)}H${f1(cEnd[0] - 46)}Z`} fill={BL} />
        <path d={fold} fill="none" stroke={K.out} stroke-width={1.6} stroke-linecap="round" />
        <g>
          <OG sh={[{ d: `M${bag[0] - 26} ${bag[1] - 22}H${bag[0] + 26}V${bag[1] + 18}Q${bag[0] + 26} ${bag[1] + 26} ${bag[0] + 18} ${bag[1] + 26}H${bag[0] - 18}Q${bag[0] - 26} ${bag[1] + 26} ${bag[0] - 26} ${bag[1] + 18}Z`, f: '#eef3f6' }]} />
          <ellipse cx={bag[0]} cy={bag[1] + 8} rx={17} ry={12} fill="#9a5a5e" opacity={0.55} />
          <rect x={bag[0] - 26} y={bag[1] - 22} width={52} height={48} rx={6} fill="#dbe9f2" opacity={0.45} />
          <path d={`M${bag[0] - 25} ${bag[1] - 14}H${bag[0] + 25}`} stroke={K.out} stroke-width={5} />
          <path d={`M${bag[0] - 25} ${bag[1] - 14}H${bag[0] + 25}`} stroke="#4f8fd0" stroke-width={2.6} />
        </g>
        <G x={266} y={60} a={-30}>
          <OG sh={[{ d: 'M0 -3L40 -1L40 1L0 3Z', f: '#cfd6de' }, { d: 'M0 3L38 9L37 11L0 -1Z', f: '#b9c2cc' }, { d: ell([-11, -6], 8, 5.5), f: 'none', st: K.out, sw: 4.4 }, { d: ell([-11, 8], 8, 5.5), f: 'none', st: K.out, sw: 4.4 }]} />
          <ellipse cx={-11} cy={-6} rx={8} ry={5.5} fill="none" stroke="#3d7ad6" stroke-width={2.4} />
          <ellipse cx={-11} cy={8} rx={8} ry={5.5} fill="none" stroke="#3d7ad6" stroke-width={2.4} />
        </G>
        <No x={272} y={58} r={30} />
        <Arrow from={[252, 136]} to={[300, 136]} w={6} />
        <No x={276} y={136} r={27} />
      </Scene2>
    );
  },

  /* ───────── Yaşlı ───────── */
  'ozel-gruplar-yasli-kapi': () => {
    const gy = 214;
    const s = 1.02;
    const elder: PersonProps = { ...YSL.elder, x: 238, y: gy + 4, s, pose: { ...POSE.stand, armF: { to: [264, 160] }, face: 'neutral' } };
    const nb0: PersonProps = { ...YSL.helper, x: 132, y: gy + 8, s };
    const offer: P = [178, 150];
    const nb: PersonProps = { ...nb0, pose: { ...POSE.standSide, armF: { to: offer }, handF: 'fist', face: 'speak' } };
    const nr = rig(nb);
    return (
      <Scene2 bg="indoor" gy={gy} wall="#e7dccb">
        <Door x={22} y={gy} w={62} h={150} />
        <Door x={200} y={gy} w={72} h={156} open />
        <Person {...elder} />
        <Cane top={[264, 160]} bottom={[270, gy + 4]} />
        <Person {...nb} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Bottle x={nr.handF[0] + 1} y={nr.handF[1] + 16} s={0.95} fill={0.85} />
        <Person {...nb} only={['armF']} />
      </Scene2>
    );
  },

  'ozel-gruplar-yasli-esyalar': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: rrect(10, 12, 300, 216, 10), f: K.wood }, { d: rrect(16, 18, 288, 204, 8), f: 'none', st: tint(K.wood, 0.2), sw: 2 }]} />
      {/* sırt çantası (üstten, ağzı açık) */}
      <OG sh={[{ d: rrect(186, 40, 104, 124, 22), f: '#c0603e' }, { d: rrect(198, 52, 80, 44, 14), f: '#5b3428' }, { d: rrect(200, 108, 76, 46, 10), f: shade('#c0603e', 0.12), ln: true }, { d: 'M204 120H272', st: '#3b3f4b', sw: 2 }]} />
      {/* gözlük */}
      <g fill="none" stroke-linecap="round">
        <path d="M40 54a12 10 0 1 0 24 0a12 10 0 1 0 -24 0M76 54a12 10 0 1 0 24 0a12 10 0 1 0 -24 0M64 52q6 -5 12 0M40 52l-12 -4M100 52l12 -4" stroke={K.out} stroke-width={4.4} />
        <path d="M40 54a12 10 0 1 0 24 0a12 10 0 1 0 -24 0M76 54a12 10 0 1 0 24 0a12 10 0 1 0 -24 0M64 52q6 -5 12 0M40 52l-12 -4M100 52l12 -4" stroke="#6b4f3a" stroke-width={2.4} />
      </g>
      {/* işitme cihazları (kulak arkası, bir çift) */}
      <HearingAid x={138} y={92} a={-8} s={1.05} />
      <HearingAid x={166} y={94} a={10} s={1.05} />
      {/* ilaç kutuları + liste */}
      <PillBox x={30} y={112} w={46} h={26} c="#3d7ad6" a={-6} />
      <PillBox x={84} y={118} w={42} h={24} c={K.safe} a={8} />
      <Paper x={130} y={106} w={44} h={58} a={-4} lines={5} />
      {/* katlanmış yürüteç + baston */}
      <OG sh={[{ d: capsule([30, 180], 3.4, [170, 180], 3.4), f: '#9aa6b4' }, { d: capsule([30, 196], 3.4, [170, 196], 3.4), f: '#9aa6b4' }, { d: capsule([40, 178], 2.6, [40, 198], 2.6), f: '#9aa6b4' }, { d: capsule([160, 178], 2.6, [160, 198], 2.6), f: '#9aa6b4' }, { d: capsule([22, 180], 4, [40, 180], 4), f: '#3b3f4b' }, { d: capsule([22, 196], 4, [40, 196], 4), f: '#3b3f4b' }, { d: circ([172, 180], 5), f: '#3b3f4b' }, { d: circ([172, 196], 5), f: '#3b3f4b' }]} />
      <Cane top={[196, 210]} bottom={[296, 206]} />
      <Arrow from={[92, 34]} to={[192, 36]} bend={-0.22} w={4.5} />
      <Arrow from={[178, 74]} to={[196, 80]} w={4.5} />
      <Arrow from={[176, 134]} to={[196, 130]} w={4.5} />
      <Arrow from={[176, 176]} to={[208, 166]} bend={0.2} w={4.5} />
    </Scene2>
  ),

  'ozel-gruplar-yasli-su': () => {
    const s = 1.2;
    const el: PersonProps = { ...YSL.elder, x: 108, y: 226, s, pose: { ...POSE.sitChair, spine: -100, chest: -84, head: -86, face: 'neutral' } };
    const glass: P = [186, 124];
    const elder: PersonProps = { ...el, pose: { ...el.pose, armF: { to: [glass[0] - 12, glass[1] - 6] } } };
    const er = rig(elder);
    const BL = '#8b6aa8';
    const blanket = smooth([[er.hip[0] - 8, er.hip[1] - 4], [er.kneeF[0] - 6, er.kneeF[1] - 8], [er.kneeF[0] + 10, er.kneeF[1] - 4], [er.kneeF[0] + 6, er.kneeF[1] + 30], [er.kneeF[0] - 10, er.kneeF[1] + 40], [er.hip[0] - 4, er.hip[1] + 14]], true, 0.6);
    const yw: PersonProps = { ...YSL.helper, x: 240, y: 228, s, flip: true, pose: { ...POSE.standSide, spine: -84, head: -80, armF: { to: [glass[0] + 6, glass[1] + 6] }, face: 'speak' } };
    return (
      <Scene2 bg="indoor">
        <Window x={22} y={42} />
        <Chair x={108} y={226} seat={44 * s} s={s} />
        <Person {...elder} mid={() => <OG sh={[{ d: blanket, f: BL }]} />} />
        <Person {...yw} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Cup x={glass[0]} y={glass[1] + 14} s={1.2} fill={K.waterLight} level={0.65} />
        <Person {...yw} only={['armF']} />
        <Arrow from={[194, 52]} to={[188, 96]} bend={0.2} />
      </Scene2>
    );
  },

  'ozel-gruplar-yasli-yuruyus': () => {
    // Akşam, temizlenmiş patika: yaşlı kadın feneri kendisi tutup yolu aydınlatıyor;
    // genç yardımcı yanında, koluna girmiş, onu kolundan tutarak yürütüyor.
    const gy = 196;
    const s = 1.08;
    const el0: PersonProps = { ...YSL.elder, x: 176, y: gy + 30, s, pose: { ...POSE.walk, spine: -82, chest: -78, head: -84, legB: [106, 112], legF: [76, 84], face: 'neutral' } };
    const e0 = rig(el0);
    const fl: P = [e0.shoulderB[0] + 30 * s, e0.hip[1] - 8 * s];
    const el: PersonProps = { ...el0, pose: { ...el0.pose, armB: { to: fl }, handB: 'fist', armF: [98, 70], handF: 'fist' } };
    const e = rig(el);
    const elbow = e.elbowF;
    const hp: PersonProps = { ...YSL.helper, x: 122, y: gy + 36, s: 1.1, pose: { ...POSE.walk, armF: { to: [elbow[0] + 2, elbow[1] + 4] }, armB: { to: [e.wristF[0] - 4, e.wristF[1] - 2] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="night" gy={gy}>
        <path d={`M0 ${gy + 8}Q160 ${gy - 2} 320 ${gy + 6}V240H0Z`} fill="#3d4a44" />
        <path d={`M${f1(fl[0] + 8)} ${f1(fl[1] + 4)}L320 ${gy + 18}L320 240L${f1(fl[0] + 70)} 240Z`} fill="#f6e27a" opacity={0.28} />
        <Rubble x={-8} y={gy + 12} w={66} seed={3} />
        <Rubble x={262} y={gy + 10} w={66} seed={8} />
        <Person {...el} only={['legB', 'armB', 'torso', 'legF', 'head']} />
        <Flashlight x={e.wristB[0] - 2} y={e.wristB[1]} s={0.85} a={28} beam={false} />
        <Person {...el} only={['armF']} />
        <Person {...hp} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...hp} only={['armF']} />
      </Scene2>
    );
  },

  'ozel-gruplar-yasli-sohbet': () => {
    const s = 1.22;
    const el: PersonProps = { ...YSL.elder, x: 98, y: 226, s, pose: { ...POSE.sitChair, spine: -96, head: -88, armF: [80, 10], face: 'calm' } };
    const hp: PersonProps = { ...YSL.helper, x: 222, y: 226, s, flip: true, pose: { ...POSE.sitChair, spine: -100, chest: -96, head: -86, armF: [70, -20], handF: { shape: 'flat', a: 0 }, face: 'speak' } };
    const h = rig(hp);
    return (
      <Scene2 bg="indoor" wall="#efe2cc">
        <Window x={132} y={40} w={60} h={56} />
        <Chair x={98} y={226} seat={44 * s} s={s} />
        <Chair x={222} y={226} seat={44 * s} s={s} flip />
        <Person {...el} />
        <Person {...hp} />
        <Bubble x={h.head[0] - 64} y={h.head[1] - 74} w={44} h={34} tail={[h.mouth[0] - 6, h.mouth[1] - 12]}>
          <path d={`M${f1(h.head[0] - 52)} ${f1(h.head[1] - 58)}h20M${f1(h.head[0] - 52)} ${f1(h.head[1] - 50)}h14`} stroke="#9aa3b0" stroke-width={3} stroke-linecap="round" />
        </Bubble>
      </Scene2>
    );
  },

  /* ───────── Hareket engeli ───────── */
  'ozel-gruplar-sandalye-kilitle': () => {
    const gy = 222;
    const s = 1.2;
    const p: PersonProps = { ...TKS.user, x: 150, y: gy - 10 * s, s, pose: { ...WC_SIT, spine: -66, chest: -42, head: -8, armF: { at: 'nape', d: [3, -3] }, armB: { at: 'nape', d: [1, -6] }, handF: 'flat', handB: 'flat', face: 'worried' } };
    const r = rig(p);
    const { wc, R } = wcGeo(r, gy);
    const br: P = [wc[0] + R * 0.62 + 8 * s, wc[1] - R * 0.78 - 10 * s];
    return (
      <Scene2 bg="indoor" gy={198}>
        <Window x={14} y={40} w={56} h={56} />
        <OG sh={[{ d: rrect(14, 116, 52, 6, 1), f: K.wood }, { d: rrect(14, 146, 52, 6, 1), f: K.wood }, { d: rrect(18, 102, 12, 14, 1), f: '#c6574e' }, { d: rrect(34, 106, 10, 10, 1), f: '#6c9c5a' }, { d: rrect(22, 132, 22, 14, 1), f: '#d9a13a' }]} />
        <WheelChairBack r={r} gy={gy} />
        <Person {...p} />
        <WheelChairWheel r={r} gy={gy} />
        <Arrow from={[br[0] - 70, br[1] + 70]} to={[br[0] - 22, br[1] + 22]} bend={0.2} />
      </Scene2>
    );
  },

  'ozel-gruplar-sandalye-duduk': () => {
    const gy = 222;
    const s = 1.2;
    const p0: PersonProps = { ...TKS.user, x: 128, y: gy - 10 * s, s, pose: { ...WC_SIT, head: -88, face: 'neutral' } };
    const r0 = rig(p0);
    const wh: P = [r0.mouth[0] + 13 * s, r0.mouth[1] + 1 * s];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: [wh[0] + 2 * s, wh[1] + 8 * s] }, handF: 'fist' } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor" gy={198}>
        <Door x={252} y={198} w={52} h={128} />
        <WheelChairBack r={r} gy={gy} />
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <WheelChairWheel r={r} gy={gy} />
        <Whistle x={wh[0]} y={wh[1]} s={0.62 * s} />
        <Person {...p} only={['armF']} />
        <Waves x={wh[0] + 26} y={wh[1] - 4} a={-10} n={3} r={9} />
      </Scene2>
    );
  },

  'ozel-gruplar-sandalye-sor': () => {
    const gy = 222;
    const s = 1.1;
    const p: PersonProps = { ...TKS.user, x: 116, y: gy - 10 * s, s, pose: { ...WC_SIT, head: -92, armF: [-28, -22], handF: 'flat', face: 'speak' } };
    const r = rig(p);
    const hp: PersonProps = { ...TKS.helper, x: 238, y: gy + 2, s, flip: true, pose: { ...POSE.kneelOne, spine: -84, head: -90, armF: { at: 'kneeF', d: [2, -4] }, face: 'speak' } };
    const h = rig(hp);
    return (
      <Scene2 bg="outdoor">
        <Sign x={290} y={200} w={52} h={40} icon="people" pole={60} />
        <Tree x={28} y={196} s={0.8} kind="pine" />
        <WheelChairBack r={r} gy={gy} />
        <Person {...p} />
        <WheelChairWheel r={r} gy={gy} brake={false} />
        <Person {...hp} />
        <Bubble x={h.head[0] - 24} y={h.head[1] - 74} w={46} h={40} tail={[h.mouth[0] - 2, h.mouth[1] - 10]} text="?" />
      </Scene2>
    );
  },

  'ozel-gruplar-sandalye-merdiven': () => {
    // Merdiven sağa doğru iner. Sandalye aşağıya bakar, arka tekerleri üzerinde ~30° geriye yatık.
    const top = 150, sw = 44, sh = 24, n = 3, edge = 118;
    const stepY = (i: number) => top + (i + 1) * sh; // i. basamağın üst yüzü
    let d = `M-4 ${top}H${edge}`;
    for (let i = 0; i < n; i++) d += `V${stepY(i)}H${i === n - 1 ? 324 : edge + (i + 1) * sw}`;
    d += `V244H-4Z`;
    const FL = '#cfc4b2';
    const s = 0.92;
    const pc: PersonProps = { ...TKS.user, x: 0, y: -10 * s, s, shadow: false, pose: { ...WC_SIT, face: 'neutral' } };
    const r = rig(pc);
    const { X, seatY, wc, R } = wcGeo(r, 0);
    const tilt = -30;
    const W: P = [edge + sw * 0.5, stepY(0) - R];
    const tp = (p: P): P => {
      const c = Math.cos(tilt / R2D), sn = Math.sin(tilt / R2D);
      const ux = p[0] - wc[0], uy = p[1] - wc[1];
      return [W[0] + ux * c - uy * sn, W[1] + ux * sn + uy * c];
    };
    const tf = `translate(${f1(W[0])} ${f1(W[1])}) rotate(${tilt}) translate(${f1(-wc[0])} ${f1(-wc[1])})`;
    const handle = tp([X(-29), r.hip[1] - 42 * s]);
    // öndeki yardımcı SABİT ÖN ÇERÇEVEYİ (oturak altından ön tekere inen dik boru) tutar; kolçak ya da ayaklık değil
    const fr0 = tp([X(24), seatY + 3 * s]), fr1 = tp([X(28), -13 * s]);
    const frame = lerp(fr0, fr1, 0.42);
    const frame2 = lerp(fr0, fr1, 0.75);
    void R;
    // arkadaki yardımcı üst basamakta, dizleri hafif bükük, iki eli de itme tutamaklarında
    const back: PersonProps = { ...TKS.helper, x: handle[0] - 28, y: top + 4, s: 0.9, pose: { spine: -66, chest: -60, head: -70, legB: [62, 124], legF: [56, 120], footB: 0, footF: 0, armB: { to: [handle[0] + 2, handle[1] + 1] }, armF: { to: handle }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const fx0 = frame[0] + 46;
    const front: PersonProps = { x: fx0, y: stepY(2) + 4, s: 0.9, who: 'man', role: 'helper2', flip: true, skin: 2, hairC: K.hair.black, pose: { spine: -70, chest: -62, head: -72, legB: [100, 96], legF: [80, 84], footB: 0, footF: 0, armB: { to: frame2 }, armF: { to: frame }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={238} wall="#e9e1d2">
        <path d={`M${edge} ${top}V244H324V${top}Z`} fill={shade('#e9e1d2', 0.08)} />
        <OG sh={[{ d, f: FL }]} />
        <path d={`M-4 ${top + 3}H${edge - 1}` + Array.from({ length: n }, (_, i) => `M${edge + i * sw + 1} ${stepY(i) + 3}H${edge + (i + 1) * sw - 1}`).join('')} stroke={shade(FL, 0.22)} stroke-width={4} />
        <Person {...back} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <g transform={tf}>
          <WheelChairBack r={r} gy={0} />
          <Person {...pc} />
          <WheelChairWheel r={r} gy={0} brake={false} />
        </g>
        <Person {...back} only={['armF']} />
        <Person {...front} />
        <circle cx={(frame[0] + frame2[0]) / 2} cy={(frame[1] + frame2[1]) / 2} r={17} fill="none" stroke={K.safe} stroke-width={3} />
        <ElevatorIcon x={282} y={48} s={0.82} />
        <No x={282} y={48} r={26} />
      </Scene2>
    );
  },

  'ozel-gruplar-sandalye-esya': () => {
    const gy = 222;
    const s = 1.05;
    const p: PersonProps = { ...TKS.user, x: 196, y: gy - 10 * s, s, pose: { ...WC_SIT, face: 'neutral' } };
    const r = rig(p);
    const hold: P = [116, 150];
    const hp: PersonProps = { ...TKS.helper, x: 74, y: gy + 4, s: 1.1, pose: { ...POSE.walk, armF: { to: hold }, armB: { to: [52, 152] }, face: 'neutral' } };
    const hr = rig(hp);
    return (
      <Scene2 bg="outdoor">
        <Sign x={292} y={196} w={50} h={38} icon="people" pole={56} />
        <WheelChairBack r={r} gy={gy} />
        <Person {...p} />
        <WheelChairWheel r={r} gy={gy} brake={false} />
        <Person {...hp} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        {/* şarj aleti */}
        <OG sh={[{ d: rrect(hr.handB[0] - 8, hr.handB[1] + 2, 16, 18, 3), f: '#fbfaf7' }, { d: 'M' + (hr.handB[0] - 3) + ' ' + (hr.handB[1] + 20) + 'v5M' + (hr.handB[0] + 3) + ' ' + (hr.handB[1] + 20) + 'v5', st: K.out, sw: 2 }]} />
        <path d={`M${hr.handB[0]} ${hr.handB[1] + 2}c-14 -6 -20 12 -8 18c10 6 2 22 -8 22`} fill="none" stroke={K.out} stroke-width={2.2} />
        <Crutch a={[hold[0] + 2, 222]} b={[hold[0] + 8, 72]} />
        <Crutch a={[hold[0] + 12, 222]} b={[hold[0] + 18, 74]} />
        <Person {...hp} only={['armF']} />
        <Ok x={156} y={76} r={14} />
      </Scene2>
    );
  },

  /* ───────── Görme ve işitme ───────── */
  'ozel-gruplar-gorme-rehberlik': () => {
    const gy = 228;
    const pair = guidePair({ gx: 204, bx: 160, y: gy, s: 1.12, walk: true });
    const gp = pair.grip;
    return (
      <Scene2 bg="outdoor" ground="pavement">
        {pair.el}
        <circle cx={gp[0] - 4} cy={gp[1]} r={15} fill="none" stroke={K.action} stroke-width={3.4} />
      </Scene2>
    );
  },

  'ozel-gruplar-gorme-basamak': () => {
    const n = 3, sw = 36, sh = 18;
    const low = 232;
    const top = low - n * sh;
    const end = 300;
    const edge = end - n * sw;
    let d = `M-4 ${top}H${edge}`;
    for (let i = 0; i < n; i++) d += `V${top + (i + 1) * sh}H${edge + (i + 1) * sw}`;
    d += `H324V244H-4Z`;
    let nos = '';
    for (let i = 0; i <= n; i++) nos += `M${i === 0 ? -4 : edge + i * sw} ${top + i * sh}H${i === n ? 324 : edge + (i + 1) * sw - (i === 0 ? sw : 0)}`;
    const pair = guidePair({ gx: edge - 26, bx: edge - 64, y: top + 4, s: 0.95, walk: false, look: true });
    const g = pair.g;
    const FL = '#cdb999';
    return (
      <Scene2 bg="indoor" gy={238} wall="#e9e1d2">
        <path d={`M${edge} ${top}V${low + 10}H324V${top}Z`} fill={shade('#e9e1d2', 0.08)} />
        <OG sh={[{ d, f: FL }]} />
        <path d={`M-4 ${top + 3}H${edge - 1}` + Array.from({ length: n }, (_, i) => `M${edge + i * sw + 1} ${top + (i + 1) * sh + 3}H${edge + (i + 1) * sw - 1}`).join('')} stroke={shade(FL, 0.22)} stroke-width={4} />
        {void nos}
        {pair.el}
        <Bubble x={edge + 6} y={22} w={112} h={48} tail={[g.mouth[0] + 6, g.mouth[1] - 4]}>
          <Txt x={edge + 62} y={42} t="3 basamak" size={14} />
          <Txt x={edge + 62} y={59} t="iniyoruz" size={14} />
        </Bubble>
        <Arrow from={[edge + 14, top - 22]} to={[end + 4, low - 22]} bend={0.2} />
      </Scene2>
    );
  },

  'ozel-gruplar-isitme-dikkat': () => {
    const dp: PersonProps = { ...GIS.deaf, x: 196, y: 226, s: 1.15, pose: { ...POSE.standSide, headView: 'front', face: 'neutral' } };
    const d = rig(dp);
    const tap: P = [d.back[0] - 2, d.shoulderB[1] + 2];
    const hp: PersonProps = { ...GIS.helper, x: 110, y: 226, s: 1.15, pose: { ...POSE.standSide, armF: { to: tap }, handF: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tent x={290} y={192} s={0.7} color="#3f8fb8" />
        <Person {...dp} />
        <Person {...hp} />
        {/* ses dalgası YOK: kişi duymuyor. Omuzdaki dokunuşu gösteren kısa vuruş çizgileri */}
        <path d={[100, 135, 170].map((a) => { const c = Math.cos((a * Math.PI) / 180), s2 = Math.sin((a * Math.PI) / 180); return `M${tap[0] - 2 + c * 11} ${tap[1] + 4 + s2 * 11}l${c * 9} ${s2 * 9}`; }).join('')} stroke={K.action} stroke-width={3} stroke-linecap="round" />
        <Arrow from={[tap[0] - 60, tap[1] - 66]} to={[tap[0] - 22, tap[1] - 12]} bend={-0.15} />
      </Scene2>
    );
  },

  'ozel-gruplar-isitme-yazma': () => {
    const a: PersonProps = { ...GIS.helper, x: 52, y: 70, ax: 'head', ay: 'head', s: 2.2, shadow: false, pose: { ...POSE.standSide, face: 'neutral' } };
    const b: PersonProps = { ...GIS.deaf, x: 272, y: 74, ax: 'head', ay: 'head', s: 2.2, flip: true, shadow: false, pose: { ...POSE.standSide, head: -102, face: 'neutral' } };
    const br = rig(b);
    const ph: P = [160, 128];
    const h = handAt({ a: 6, s: 1.1, pose: 'hold', side: 'R', arm: 200, sleeve: K.role.helper, skin: GIS.helper.skin, grip: 40 }, 'grip', [ph[0] + 2, ph[1] + 46]);
    return (
      <Scene2 bg="closeup">
        <Person {...a} only={['torso', 'head', 'armB']} />
        <Person {...b} only={['torso', 'head', 'armB']} />
        <path d={`M${br.head[0] - 34} ${br.head[1] - 18}v22M${br.head[0] - 38} ${br.head[1] - 12}l4 -6l4 6M${br.head[0] - 38} ${br.head[1] - 2}l4 6l4 -6`} fill="none" stroke={K.ink} stroke-width={2.4} stroke-linecap="round" stroke-linejoin="round" opacity={0.75} />
        <Hand {...h}>
          <G x={ph[0]} y={ph[1]} a={6}>
            <OG sh={[{ d: rrect(-40, -70, 80, 140, 10), f: '#2f3542' }, { d: rrect(-35, -62, 70, 122, 4), f: '#eaf4fb' }]} />
            <Txt x={0} y={-38} t="BİNA" size={15} />
            <Txt x={0} y={-20} t="HASARLI." size={13.5} />
            <Txt x={0} y={2} t="BENİMLE" size={13.5} c={K.danger} />
            <Txt x={0} y={20} t="GEL." size={15} c={K.danger} />
          </G>
        </Hand>
      </Scene2>
    );
  },

  'ozel-gruplar-isitme-duduk': () => {
    const p: PersonProps = { ...GIS.deaf, x: 128, y: 96, ax: 'head', ay: 'head', s: 2.5, shadow: false, pose: { ...POSE.standSide, head: -90, face: 'neutral' } };
    const r = rig(p);
    const wh: P = [r.mouth[0] + 16, r.mouth[1] + 1];
    const cord = `M${f1(r.neck[0] - 8)} ${f1(r.neck[1] + 4)}Q${f1(r.neck[0] + 20)} ${f1(r.neck[1] + 40)} ${f1(wh[0] + 8)} ${f1(wh[1] + 14)}`;
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head', 'armB']} />
        <path d={cord} fill="none" stroke={K.out} stroke-width={4.4} stroke-linecap="round" />
        <path d={cord} fill="none" stroke="#d63b35" stroke-width={2.2} stroke-linecap="round" />
        <Whistle x={wh[0]} y={wh[1]} s={1.05} />
        <Waves x={wh[0] + 34} y={wh[1] - 2} a={-10} n={3} r={12} />
      </Scene2>
    );
  },

  /* ───────── Zihinsel / otizm / demans ───────── */
  'ozel-gruplar-zihinsel-el-ele': () => {
    const hand: P = [166, 158];
    const mom: PersonProps = { ...ZHN.mom, x: 126, y: 226, s: 1.12, pose: { ...POSE.stand, armF: { to: hand }, face: 'calm' } };
    const kid: PersonProps = { ...ZHN.kid, x: 200, y: 226, s: 1.12, pose: { ...POSE.stand, armB: { to: hand }, armF: [70, 20], face: 'neutral' } };
    const k = rig(kid);
    return (
      <Scene2 bg="outdoor">
        <Crowd y={198} xs={[22, 58, 92, 236, 270, 302]} />
        <Person {...mom} />
        <Person {...kid} over={(r) => <Earmuffs r={r} front />} />
        <Teddy x={k.handF[0] + 4} y={k.handF[1] - 6} s={1.05} />
        <Arrow from={[hand[0] + 4, 82]} to={[hand[0], 140]} />
      </Scene2>
    );
  },

  'ozel-gruplar-kimlik-bileklik': () => {
    const h = { x: 150, y: 150, a: 4, s: 1.7, pose: 'open' as const, side: 'R' as const, arm: 200, sleeve: K.role.helper, skin: ZHN.kid.skin };
    const band = '#f2c14e';
    const by = 182;
    return (
      <Scene2 bg="closeup">
        <Hand {...h} />
        <g transform={`rotate(4 150 ${by})`}>
          <OG sh={[{ d: rrect(108, by - 9, 84, 18, 5), f: band }, { d: rrect(116, by - 22, 72, 44, 6), f: '#fbfaf7' }, { d: rrect(116, by - 22, 14, 44, 6), f: '#3d7ad6', ln: true }]} />
          <path d={`M138 ${by - 10}h22M138 ${by - 2}h30M138 ${by + 6}h18`} stroke="#9aa3b0" stroke-width={3} stroke-linecap="round" />
          <PhoneIcon x={176} y={by + 9} s={0.9} />
          <circle cx={178} cy={by - 10} r={6.5} fill="#3d7ad6" stroke={K.out} stroke-width={1.2} />
          <Txt x={178} y={by - 6.5} t="i" size={10} c="#fff" />
        </g>
        <Ok x={232} y={156} r={16} />
      </Scene2>
    );
  },

  'ozel-gruplar-zihinsel-sakin-kose': () => {
    const gy = 206;
    const kid: PersonProps = { ...ZHN.kid, x: 172, y: gy + 10, s: 1.15, pose: { ...POSE.sitFloor, spine: -80, armB: { at: 'kneeF', d: [2, -4] }, armF: { at: 'kneeF', d: [4, -2] }, legB: [-30, 70], legF: [-34, 66], face: 'neutral' } };
    const dad: PersonProps = { ...ZHN.mom, x: 82, y: gy + 10, s: 1.15, pose: { ...POSE.sitFloor, spine: -82, armB: { at: 'kneeF', d: [0, -4] }, armF: { at: 'kneeF', d: [4, -2] }, legB: [-36, 64], legF: [-40, 60], face: 'calm' } };
    return (
      <Scene2 bg="indoor" wall="#f1d2a8" gy={gy}>
        <path d="M0 0H130L0 130Z" fill="#e6bf8b" />
        <OG sh={[{ d: `M232 ${gy}L264 20L320 20V${gy}Z`, f: '#cfe3ee' }]} />
        <g opacity={0.42}>
          <Crowd y={gy - 2} xs={[272, 302]} s={0.75} op={1} />
        </g>
        <path d={`M232 ${gy}L264 20`} stroke={K.out} stroke-width={3} />
        <OG sh={[{ d: rrect(36, gy + 2, 188, 16, 6), f: '#8b6aa8' }, { d: `M44 ${gy + 10}H216`, st: tint('#8b6aa8', 0.3), sw: 2 }]} />
        <Person {...dad} />
        <Person {...kid} over={(r) => <Earmuffs r={r} />} />
      </Scene2>
    );
  },

  'ozel-gruplar-kayip-teslim': () => {
    const s = 1.05;
    const el: PersonProps = { x: 118, y: 226, s, who: 'oldman', role: 'bystander4', skin: 1, pose: { ...POSE.walk, spine: -84, head: -84, face: 'worried' } };
    const e = rig(el);
    const vol: PersonProps = { x: 82, y: 230, s, who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.brown, skin: 0, pose: { ...POSE.walk, armB: { to: lerp(e.shoulderB, e.elbowB, 0.8) }, armF: { to: e.elbowF }, face: 'calm' } };
    const off: PersonProps = { x: 266, y: 222, s, who: 'man', role: 'bystander', top: '#4a6fa5', skin: 2, hairC: K.hair.black, flip: true, pose: { ...POSE.standSide, armF: { to: [236, 168] }, armB: { to: [244, 170] }, face: 'calm' } };
    return (
      <Scene2 bg="outdoor">
        <Tent x={302} y={186} s={0.55} color="#3f8fb8" />
        <Person {...off} only={['legB', 'legF', 'armB', 'torso', 'head']} mid={(r) => <VestSide r={r} c="#2f3d63" stripe="#ff8a1f" text="AFAD" />} />
        <Table x={196} y={228} w={96} h={58} />
        <Paper x={214} y={162} w={34} h={8} lines={0} />
        <Person {...off} only={['armF']} />
        <Person {...vol} only={['legB', 'armB', 'torso', 'legF', 'head']} />
        <Person {...el} />
        <Person {...vol} only={['armF']} />
        <Label x={e.head[0] + 4} y={e.top - 18} text="?" size={18} bg="#fff" />
        <Arrow from={[150, 92]} to={[214, 104]} bend={-0.2} />
      </Scene2>
    );
  },

  /* ───────── Kronik hastalık ───────── */
  'ozel-gruplar-ilac-canta': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: 'M48 196Q40 128 120 120H220Q290 128 278 196Q276 212 258 212H66Q50 212 48 196Z', f: '#3b4b63' }, { d: 'M64 136Q120 126 160 128Q210 126 262 136L254 160Q160 150 72 160Z', f: '#232c3a' }, { d: 'M66 132Q160 118 258 132', st: '#c9ced6', sw: 2.4 }]} />
      <path d="M8 170C24 160 40 166 50 174M276 174C288 166 302 162 316 170" fill="none" stroke={K.out} stroke-width={9} stroke-linecap="round" />
      <path d="M8 170C24 160 40 166 50 174M276 174C288 166 302 162 316 170" fill="none" stroke="#2c3646" stroke-width={6} stroke-linecap="round" />
      <PillBox x={86} y={130} w={44} h={26} c={K.danger} a={-10} />
      <PillBox x={132} y={24} w={44} h={26} c={K.safe} a={8} />
      <G x={196} y={56} a={-4}>
        <OG sh={[{ d: rrect(-18, -26, 36, 52, 7), f: '#5a6170' }, { d: rrect(-12, -20, 24, 18, 2), f: '#bfe3f5', ln: true }, { d: circ([0, 12], 6), f: '#e6e8eb', ln: true }, { d: rrect(-4, -36, 8, 12, 1), f: '#fbfaf7' }]} />
        <Txt x={0} y={-7} t="110" size={9} />
      </G>
      <InsulinPen x={34} y={70} a={18} s={1.1} />
      <Paper x={232} y={84} w={50} h={38} a={10} lines={3} />
      <Arrow from={[160, 70]} to={[160, 128]} />
    </Scene2>
  ),

  'ozel-gruplar-saglik-karti': () => {
    const SH = '#6c9ec9';
    const card: P = [178, 112];
    const h = handAt({ a: 186, s: 1.0, pose: 'pinch', side: 'R', arm: 200, sleeve: K.role.victim, skin: KRN.patient.skin }, 'pinch', [card[0] + 6, card[1] - 40]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill={SH} />
        <path d="M120 0V240" stroke={shade(SH, 0.2)} stroke-width={2} />
        {[30, 90, 150, 210].map((yy) => <circle key={yy} cx={126} cy={yy} r={4} fill="#fbfaf7" stroke={K.out} stroke-width={1.2} />)}
        <OG sh={[{ d: rrect(140, 116, 92, 96, 4), f: shade(SH, 0.08) }]} />
        <g transform={`rotate(-5 ${card[0]} ${card[1]})`}>
          <OG sh={[{ d: rrect(card[0] - 34, card[1] - 46, 68, 92, 4), f: '#fbfaf7' }, { d: `M${card[0]} ${card[1] - 46}V${card[1] + 46}`, st: '#d6d0c4', sw: 1.4 }]} />
          <path d={`M${card[0] - 17} ${card[1] - 8}c-8-6-12-10-12-15a6 6 0 0 1 12-2a6 6 0 0 1 12 2c0 5-4 9-12 15z`} fill={K.danger} stroke={K.out} stroke-width={1.2} />
          <Drop x={card[0] + 17} y={card[1] - 20} s={1.2} color={K.blood} />
          <OG sh={[{ d: capsule([card[0] - 8, card[1] + 16], 6, [card[0] + 8, card[1] + 16], 6), f: '#fbfaf7' }, { d: `M${card[0]} ${card[1] + 10}A6 6 0 0 1 ${card[0] + 8} ${card[1] + 10}A6 6 0 0 1 ${card[0] + 8} ${card[1] + 22}H${card[0]}Z`, f: '#3d7ad6', no: true }]} />
        </g>
        <OG sh={[{ d: `M140 152H232V212H140Z`, f: SH }, { d: 'M140 152H232', st: shade(SH, 0.3), sw: 2 }]} />
        <path d="M146 160H226" stroke={tint(SH, 0.3)} stroke-width={1.4} stroke-dasharray="4 3" />
        <Hand {...h} />
        <Arrow from={[268, 70]} to={[244, 140]} bend={-0.2} />
      </Scene2>
    );
  },

  'ozel-gruplar-kurtarmaya-soyle': () => {
    const pen: P = [156, 150];
    const sit: PersonProps = { ...KRN.patient, x: 100, y: 226, s: 1.1, pose: { ...POSE.sitChair, spine: -92, armF: { to: [pen[0] - 4, pen[1] + 6] }, face: 'speak' } };
    const res: PersonProps = { x: 236, y: 228, s: 1.12, who: 'man', role: 'helper2', flip: true, skin: 0, hairC: K.hair.dark, pose: { ...POSE.kneelOne, spine: -84, head: -100, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Rubble x={-10} y={204} w={110} seed={5} />
        <Rubble x={254} y={202} w={86} seed={11} />
        <OG sh={[{ d: rrect(68, 182, 60, 44, 4), f: '#b9b2a6' }, { d: rrect(68, 182, 60, 8, 3), f: tint('#b9b2a6', 0.2), ln: true }]} />
        <Person {...sit} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <InsulinPen x={pen[0] - 8} y={pen[1] + 10} a={-62} s={1.05} />
        <Person {...sit} only={['armF']} />
        <Person {...res} over={(r) => <HardHat r={r} />} />
        <Arrow from={[124, 64]} to={[156, 104]} bend={-0.15} />
      </Scene2>
    );
  },

  'ozel-gruplar-insulin-serin': () => {
    const CL = '#f4f1ea';
    const wrap = (x: number, y: number, w: number, h: number) => (
      <g>
        <OG sh={[{ d: rrect(x, y, w, h, 8), f: CL }, { d: `M${x + 4} ${y + h * 0.3}Q${x + w / 2} ${y + h * 0.38} ${x + w - 4} ${y + h * 0.26}M${x + 4} ${y + h * 0.62}Q${x + w / 2} ${y + h * 0.7} ${x + w - 4} ${y + h * 0.58}`, st: '#cfc8ba', sw: 1.6 }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(20, 72, 184, 148, 14), f: '#3d7ad6' }, { d: rrect(32, 84, 160, 124, 8), f: '#dcecf6', ln: true }, { d: rrect(14, 60, 196, 20, 8), f: shade('#3d7ad6', 0.15) }]} />
        <path d="M60 60Q112 26 164 60" fill="none" stroke={K.out} stroke-width={7} />
        <path d="M60 60Q112 26 164 60" fill="none" stroke="#2f3d63" stroke-width={4} />
        <OG sh={[{ d: rrect(46, 134, 58, 62, 6), f: '#9dd5f6' }, { d: 'M56 150l6 6m-6 0l6 -6M84 178l6 6m-6 0l6 -6', st: '#fff', sw: 2 }]} />
        {wrap(40, 152, 70, 28)}
        <InsulinPen x={150} y={92} a={90} s={0.95} />
        {wrap(128, 112, 44, 84)}
        <path d="M118 120V200" stroke="#9cc7e0" stroke-width={2} stroke-dasharray="4 4" />
        <circle cx={268} cy={50} r={18} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
        <g stroke={K.fireCore} stroke-width={3.4} stroke-linecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const p1 = pol([268, 50], a, 24), p2 = pol([268, 50], a, 32);
            return <path key={a} d={`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`} />;
          })}
        </g>
        <InsulinPen x={236} y={170} a={-20} s={0.95} />
        <No x={266} y={160} r={34} />
      </Scene2>
    );
  },

  /* ───────── Evcil hayvan ───────── */
  'ozel-gruplar-evcil-tahliye': () => {
    const s = 1.05;
    const dad: PersonProps = { ...EVC.dad, x: 160, y: 226, s, pose: { ...POSE.walk, armF: [70, 40], face: 'neutral' } };
    const d = rig(dad);
    const girl: PersonProps = { ...EVC.girl, x: 92, y: 228, s: 1, pose: { ...POSE.walk, armF: [72, 64], face: 'neutral' } };
    const g = rig(girl);
    const pack = (c: string, k = 1) => (r: Rig) => <Backpack x={r.back[0] - 9 * r.s * k} y={r.neck[1] + 6 * r.s} s={r.s * 1.05 * k} color={c} />;
    const dogX = 236, dogY = 228;
    return (
      <Scene2 bg="outdoor">
        <Sign x={292} y={194} w={50} h={38} icon="people" pole={56} />
        <Tree x={30} y={194} kind="pine" s={0.8} />
        <Person {...girl} back={pack('#4f7fb0', 0.75)} />
        <Carrier x={g.handF[0] + 1} y={g.handF[1] + 33} s={0.78} />
        <Person {...dad} back={pack('#c0603e')} />
        <path d={`M${d.handF[0]} ${d.handF[1]}Q${(d.handF[0] + dogX + 26) / 2} ${d.handF[1] + 34} ${dogX + 26} ${dogY - 40}`} fill="none" stroke={K.out} stroke-width={3.4} />
        <path d={`M${d.handF[0]} ${d.handF[1]}Q${(d.handF[0] + dogX + 26) / 2} ${d.handF[1] + 34} ${dogX + 26} ${dogY - 40}`} fill="none" stroke="#d63b35" stroke-width={1.8} />
        <Dog x={dogX} y={dogY} s={0.95} />
      </Scene2>
    );
  },

  'ozel-gruplar-evcil-kafes': () => {
    // Kadın bir elinde kapısı kilitli kedi kafesini, öbür elinde köpeğin gezdirme kayışını tutuyor.
    const gy = 230;
    const s = 1.12;
    const own0: PersonProps = { ...EVC.dad, x: 172, y: gy, s, pose: { ...POSE.stand, face: 'neutral' } };
    const r0 = rig(own0);
    const handle: P = [r0.shoulderB[0] - 30, r0.hip[1] + 8];
    const leashHand: P = [r0.shoulderF[0] + 16, r0.hip[1] + 4];
    const own: PersonProps = { ...own0, pose: { ...own0.pose, armB: { to: [handle[0] + 1, handle[1] + 3] }, armF: { to: leashHand }, handB: 'fist', handF: 'fist' } };
    const r = rig(own);
    const dx = r0.hip[0] + 36, dy = gy + 2, ds = 1.25;
    const collar: P = [dx + 7 * ds, dy - 43 * ds];
    const leash = `M${f1(r.handF[0])} ${f1(r.handF[1] + 3)}Q${f1(r.handF[0] + 2)} ${f1(collar[1] + 6)} ${f1(collar[0])} ${f1(collar[1])}`;
    // ön görünüşlü taşıma kafesi (kapı bize dönük), kulpundan tutuluyor
    const cs = 0.62;
    const cx = handle[0], cTop = handle[1] + 10;
    return (
      <Scene2 bg="indoor" gy={196}>
        <Door x={252} y={196} w={54} h={112} open />
        <Person {...own} only={['legB', 'legF', 'torso', 'head', 'armF']} />
        <Dog x={dx} y={dy} s={ds} pose="sit" />
        <path d={leash} fill="none" stroke={K.out} stroke-width={5.4} stroke-linecap="round" />
        <path d={leash} fill="none" stroke="#3d7ad6" stroke-width={3} stroke-linecap="round" />
        <G x={cx} y={cTop + 112 * cs} s={cs}>
          <OG ow={OW / cs} sh={[{ d: 'M-46 -8V-98Q-46 -112 -32 -112H32Q46 -112 46 -98V-8Q46 0 38 0H-38Q-46 0 -46 -8Z', f: '#6f9fd0' }, { d: rrect(-34, -98, 68, 86, 6), f: '#2f3542', ln: true }, { d: 'M-18 -112Q-18 -128 0 -128Q18 -128 18 -112', st: K.out, sw: 9 }, { d: 'M-18 -112Q-18 -128 0 -128Q18 -128 18 -112', st: '#3b3f4b', sw: 5 }]} />
          <OG ow={OW / cs} sh={[{ d: 'M-17 -70L-14 -88L-5 -76Z', f: '#9a9089' }, { d: 'M17 -70L14 -88L5 -76Z', f: '#9a9089' }, { d: ell([0, -62], 18, 15), f: '#9a9089' }, { d: ell([0, -30], 21, 19), f: '#9a9089' }]} />
          <circle cx={-7} cy={-64} r={5} fill="#f6e27a" stroke={K.out} stroke-width={1.6} />
          <circle cx={7} cy={-64} r={5} fill="#f6e27a" stroke={K.out} stroke-width={1.6} />
          <circle cx={-7} cy={-64} r={2} fill={K.ink} />
          <circle cx={7} cy={-64} r={2} fill={K.ink} />
          <path d="M-2 -56h4l-2 2zM-20 -56h-10M20 -56h10" stroke={K.ink} stroke-width={1.6} fill="none" />
          <path d="M-34 -84H34M-34 -70H34M-34 -56H34M-34 -42H34M-34 -28H34M-17 -98V-12M0 -98V-12M17 -98V-12" stroke="#cfd6de" stroke-width={3} />
          <OG ow={OW / cs} sh={[{ d: rrect(28, -66, 16, 24, 3), f: '#d9c36a' }, { d: rrect(22, -61, 10, 14, 2), f: '#3b3f4b' }]} />
        </G>
        <Person {...own} only={['armB']} />
        <Ok x={cx + 40} y={cTop + 22} r={12} />
      </Scene2>
    );
  },

  'ozel-gruplar-evcil-kunye': () => {
    const C = '#b7834f';
    return (
      <Scene2 bg="closeup">
        {/* köpek başı + boyun */}
        <OG sh={[{ d: capsule([96, 236], 46, [100, 150], 40), f: C }, { d: circ([104, 92], 46), f: C }, { d: ell([146, 112], 30, 22), f: tint(C, 0.25) }, { d: ell([62, 96], 16, 34), f: shade(C, 0.16), t: 'rotate(14 62 96)' }]} />
        <circle cx={172} cy={102} r={8} fill={K.ink} />
        <circle cx={118} cy={78} r={5} fill={K.ink} />
        {/* tasma */}
        <OG sh={[{ d: 'M54 156Q100 176 146 160L148 176Q100 194 52 172Z', f: '#d63b35' }, { d: circ([112, 182], 4), f: '#cfd6de' }]} />
        <OG sh={[{ d: circ([112, 206], 22), f: '#d9c36a' }, { d: circ([112, 206], 17), f: 'none', st: shade('#d9c36a', 0.25), sw: 1.6 }]} />
        <PhoneIcon x={112} y={206} s={1.4} />
        {/* kafes üstü etiket */}
        <OG sh={[{ d: 'M200 240V150Q200 132 220 132H330V240Z', f: '#6f9fd0' }, { d: rrect(220, 160, 84, 50, 4), f: '#fbfaf7' }]} />
        <PhoneIcon x={242} y={185} s={1.3} />
        <path d="M258 176h34M258 186h26M258 196h30" stroke="#9aa3b0" stroke-width={3} stroke-linecap="round" />
        <Arrow from={[178, 236]} to={[140, 212]} bend={0.2} />
      </Scene2>
    );
  },

  'ozel-gruplar-evcil-canta': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: rrect(14, 24, 248, 200, 18), f: '#4f7f5a' }, { d: rrect(26, 36, 224, 176, 12), f: '#2f4a36', ln: true }]} />
      {/* mama paketi */}
      <OG sh={[{ d: 'M40 50H104L100 140H44Z', f: '#e0813c' }, { d: 'M40 50H104V60H40Z', f: shade('#e0813c', 0.2), ln: true }]} />
      <circle cx={72} cy={96} r={14} fill="#fbfaf7" stroke={K.out} stroke-width={1.2} />
      <path d="M66 92a3 3 0 1 0 0.1 0M78 92a3 3 0 1 0 0.1 0M72 100a5 4 0 1 0 0.1 0" fill="#b7834f" />
      {/* hayvanın fotoğrafı */}
      <g transform="rotate(-8 136 66)">
        <OG sh={[{ d: rrect(114, 40, 44, 52, 2), f: '#fbfaf7' }, { d: rrect(118, 44, 36, 36, 1), f: '#9fd0e6', ln: true }]} />
        <OG sh={[{ d: ell([126, 58], 4, 8), f: shade('#b7834f', 0.16), t: 'rotate(18 126 58)' }, { d: circ([136, 64], 10), f: '#b7834f' }, { d: ell([146, 58], 4, 8), f: shade('#b7834f', 0.16), t: 'rotate(-18 146 58)' }, { d: ell([136, 72], 7, 6), f: '#e6c49a' }, { d: ell([118 + 18, 82], 14, 4), f: '#b7834f', no: true }]} />
        <circle cx={132} cy={62} r={1.6} fill={K.ink} />
        <circle cx={140} cy={62} r={1.6} fill={K.ink} />
        <circle cx={136} cy={70} r={2} fill={K.ink} />
      </g>
      {/* su şişesi */}
      <Bottle x={140} y={152} s={1.0} fill={0.8} />
      {/* katlanır kap */}
      <OG sh={[{ d: circ([200, 74], 28), f: '#6fb3a8' }, { d: circ([200, 74], 20), f: tint('#6fb3a8', 0.2), ln: true }, { d: circ([200, 74], 12), f: tint('#6fb3a8', 0.35), ln: true }]} />
      {/* ilaç + aşı kartı */}
      <PillBox x={46} y={158} w={46} h={26} c={K.danger} a={-6} />
      <OG sh={[{ d: rrect(166, 120, 66, 44, 4), f: '#fbfaf7' }, { d: rrect(166, 120, 66, 12, 4), f: K.safe, ln: true }]} />
      <path d="M174 142h30M174 150h40M174 158h22" stroke="#9aa3b0" stroke-width={2.4} stroke-linecap="round" />
      {/* yedek tasma */}
      <path d="M110 192Q140 176 170 190Q200 204 230 186" fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" />
      <path d="M110 192Q140 176 170 190Q200 204 230 186" fill="none" stroke="#3d7ad6" stroke-width={4} stroke-linecap="round" />
      <circle cx={232} cy={185} r={6} fill="none" stroke={K.out} stroke-width={3} />
      <Label x={290} y={46} text="3 gün" size={14} bg="#fff" />
    </Scene2>
  ),
};
