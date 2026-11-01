// Barınma — sahneler: çadır yeri, toplanma planı, acil tuvalet, güvenli ısıtma, kış, hijyen, sıcak kalma.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bottle, Building, Car, Door, Drop, Flame, Flashlight, Hand, K, Label, No, OG, Ok, Person, POSE, Rock, Scene2,
  Sign, Smoke, Tent, Tree, Water, Waves, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Rig, Sh } from '../kit2';

/* ════════════════════════════ yardımcılar ════════════════════════════ */

const RAD = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * RAD) * l, p[1] + Math.sin(a * RAD) * l];
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / RAD;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, fx = false, children }: { x?: number; y?: number; s?: number; a?: number; fx?: boolean; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)})${a ? ` rotate(${f1(a)})` : ''} scale(${fx ? -s : s} ${s})`}>{children}</g>
);
/** El bileğini, verilen el noktası hedefe gelecek şekilde konumlar. */
function handAt(h: Omit<HandProps, 'x' | 'y'>, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): HandProps {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

const TENT = '#e0813c';
/** Barınma rehberlerinin tek ailesi: bütün barınma sahnelerinde aynı baba, anne, oğul, kız. */
type Cast = Partial<PersonProps>;
const AILE = {
  dad: { who: 'man', skin: 1, hairC: K.hair.black, mustache: true, top: '#6c9c5a' } as Cast,
  mom: { who: 'woman', skin: 1, hair: 'long', hairC: K.hair.dark, top: '#8f6fc2' } as Cast,
  boy: { who: 'boy', skin: 1, top: '#d9a13a' } as Cast,
  girl: { who: 'girl', skin: 1, top: '#3d7ad6' } as Cast,
};
const TENT2 = '#3f8fb8';
const SNOW = '#f4f8fb';
const SOIL = '#a87c52';
const SOILD = '#7d5a3a';
const BAG = '#2c2f36';
const GLOVE = 'hue-rotate(185deg) saturate(1.25) brightness(1.02)';

/** Kesikli çizgi */
function Dash({ pts, c = K.ink, w = 2.6, dash = '7 6', curve }: { pts: P[]; c?: string; w?: number; dash?: string; curve?: boolean }) {
  const d = curve ? smooth(pts) : 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
  return <path d={d} fill="none" stroke={c} stroke-width={w} stroke-dasharray={dash} stroke-linecap="round" />;
}

/** Ölçü çizgisi: iki uçlu ok + uç çizgileri + etiket */
function Dim({ a, b, text, c = K.ink, lab, size = 14, ticks = true, bg = K.white }: { a: P; b: P; text?: string; c?: string; lab?: P; size?: number; ticks?: boolean; bg?: string }) {
  const an = angOf(a, b);
  const hl = 8;
  const head = (p: P, dir: number) => {
    const t = pol(p, dir, hl);
    return `M${f1(p[0])} ${f1(p[1])}L${f1(pol(t, dir + 90, 4.5)[0])} ${f1(pol(t, dir + 90, 4.5)[1])}L${f1(pol(t, dir - 90, 4.5)[0])} ${f1(pol(t, dir - 90, 4.5)[1])}Z`;
  };
  const tk = (p: P) => {
    const p1 = pol(p, an + 90, 8), p2 = pol(p, an - 90, 8);
    return `M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`;
  };
  const m = lab ?? lerp(a, b, 0.5);
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke="#fff" stroke-width={5.5} opacity={0.7} />
      <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke={c} stroke-width={2.4} />
      {ticks && <path d={tk(a) + tk(b)} stroke={c} stroke-width={2.4} />}
      <path d={head(a, an) + head(b, an + 180)} fill={c} stroke={c} stroke-width={1} />
      {text && <Label x={m[0]} y={m[1]} text={text} size={size} bg={bg} />}
    </g>
  );
}

let clipN = 0;
/** Çerçeveli ek kare (kendi arka planıyla, kırpılmış) */
function Panel({ x, y, w, h, bg = K.sky, children, r = 10 }: { x: number; y: number; w: number; h: number; bg?: string; children?: ComponentChildren; r?: number }) {
  const id = 'brn-p' + ++clipN;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={r} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={bg} />
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Elektrik direği + çapraz kol. x = dip, y = zemin */
function Pole({ x, y, h = 130 }: { x: number; y: number; h?: number }) {
  return (
    <OG
      sh={[
        { d: rrect(x - 3.5, y - h, 7, h, 2), f: '#8b6a4c' },
        { d: rrect(x - 22, y - h + 12, 44, 5, 1.5), f: '#6d5039' },
        { d: circ([x - 18, y - h + 10], 2.4), f: '#d7dde3' },
        { d: circ([x + 18, y - h + 10], 2.4), f: '#d7dde3' },
      ]}
    />
  );
}

/** Kar tanesi / yağan kar noktaları */
function SnowFall({ seed = 1, n = 26, y0 = 6, y1 = 196 }: { seed?: number; n?: number; y0?: number; y1?: number }) {
  const pts: P[] = [];
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) pts.push([10 + rnd() * 300, y0 + rnd() * (y1 - y0)]);
  return (
    <g fill="#fff" stroke="#c7d6e2" stroke-width={0.8}>
      {pts.map((p, i) => <circle key={i} cx={f1(p[0])} cy={f1(p[1])} r={i % 3 ? 2.2 : 3} />)}
    </g>
  );
}

/** Mavi kıvrık hava oku (temiz hava) */
function AirArrow({ from, to, bend = 0.25, w = 4.5, c = K.water }: { from: P; to: P; bend?: number; w?: number; c?: string }) {
  return <Arrow from={from} to={to} bend={bend} w={w} color={c} />;
}

/** Buhar / nem tütmesi (dalgalı çizgiler) */
function Steam({ x, y, n = 3, h = 18, gap = 8, c = '#fff', w = 2.4, op = 0.9 }: { x: number; y: number; n?: number; h?: number; gap?: number; c?: string; w?: number; op?: number }) {
  return (
    <g fill="none" stroke={c} stroke-width={w} stroke-linecap="round" opacity={op}>
      {Array.from({ length: n }, (_, i) => {
        const xx = x + (i - (n - 1) / 2) * gap;
        return <path key={i} d={`M${f1(xx)} ${f1(y)}c-${h * 0.22} -${h * 0.25} ${h * 0.22} -${h * 0.45} 0 -${h * 0.7}s${h * 0.22} -${h * 0.3} 0 -${h * 0.3}`} />;
      })}
    </g>
  );
}

/** Sıcaklık dalgaları (kırmızı/turuncu, yukarı) */
function Heat({ x, y, n = 3, h = 22, gap = 9, c = K.danger }: { x: number; y: number; n?: number; h?: number; gap?: number; c?: string }) {
  return (
    <g fill="none" stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const xx = x + (i - (n - 1) / 2) * gap;
        const d = `M${f1(xx)} ${f1(y)}q-4 -${h / 4} 0 -${h / 2}t0 -${h / 2}`;
        return (
          <g key={i}>
            <path d={d} stroke="#fff" stroke-width={5} opacity={0.6} />
            <path d={d} stroke={c} stroke-width={2.6} />
          </g>
        );
      })}
    </g>
  );
}

/** Küçük numara rozeti */
function Num({ x, y, n, r = 10, c = K.action }: { x: number; y: number; n: number | string; r?: number; c?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1.5} fill="#fff" />
      <circle cx={x} cy={y} r={r} fill={c} stroke={K.out} stroke-width={1.5} />
      <text x={x} y={y + r * 0.38} text-anchor="middle" font-size={r * 1.15} font-weight={700} fill={c === K.action ? K.ink : '#fff'} font-family="'IBM Plex Sans', system-ui, sans-serif">
        {n}
      </text>
    </g>
  );
}

/** Kamp lambası (LED, pilli). x,y = taban ortası */
function CampLamp({ x, y, s = 1, glow = true }: { x: number; y: number; s?: number; glow?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      {glow && <circle cx={0} cy={-22} r={46} fill="#ffe680" opacity={0.16} />}
      {glow && <circle cx={0} cy={-22} r={28} fill="#ffe680" opacity={0.22} />}
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-8 -44Q0 -56 8 -44', st: K.out, sw: 2.6 },
          { d: rrect(-13, -8, 26, 8, 2.5), f: '#3e4a5a' },
          { d: rrect(-10, -38, 20, 31, 5), f: '#fff6c4' },
          { d: rrect(-12, -44, 24, 8, 3), f: '#3e4a5a' },
          { d: rrect(-4, -5, 8, 3, 1), f: K.safe, no: true },
        ]}
      />
      <rect x={-5} y={-33} width={10} height={20} rx={3} fill="#fff" opacity={0.9} />
    </G>
  );
}

/** Mum (yanan). x,y = taban ortası */
function Candle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <circle cx={0} cy={-46} r={22} fill="#ffd64a" opacity={0.2} />
      <OG ow={1.5 / s} sh={[{ d: rrect(-8, -34, 16, 34, 2), f: '#f6efe0' }, { d: rrect(3, -34, 5, 34, 1), f: '#e2d8c4', no: true }, { d: ell([0, -2], 13, 3.5), f: '#c9cfd6' }]} />
      <path d="M0 -34V-39" stroke={K.out} stroke-width={1.6} />
      <Flame x={0} y={-37} s={0.42} />
    </G>
  );
}

/** Gaz lambası (gazyağı). x,y = taban ortası */
function OilLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <circle cx={0} cy={-36} r={26} fill="#ffd64a" opacity={0.2} />
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-14 0Q-18 -12 -10 -18H10Q18 -12 14 0Z', f: '#b5503c' },
          { d: rrect(-6, -22, 12, 5, 1), f: '#8d949c' },
          { d: 'M-6 -22Q-12 -32 -7 -46H7Q12 -32 6 -22Z', f: '#e8f2f7', op: 0.85 },
          { d: rrect(-8, -50, 16, 5, 1.5), f: '#8d949c' },
          { d: 'M-8 -50Q0 -62 8 -50', st: K.out, sw: 2 },
        ]}
      />
      <Flame x={0} y={-25} s={0.36} />
    </G>
  );
}

/** Kovası kapaklı (yan görünüş). x,y = taban ortası */
function Bucket({ x, y, s = 1, color = '#e9e3d4', lid = true, bag, a = 0 }: { x: number; y: number; s?: number; color?: string; lid?: boolean; bag?: boolean; a?: number }) {
  const sd = shade(color, 0.14);
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-30 -62Q0 -92 30 -62', st: K.out, sw: 2.6 },
          { d: 'M-26 0L-31 -60H31L26 0Z', f: color },
          { d: 'M12 0L16 -60H31L26 0Z', f: sd, no: true },
          { d: 'M-29 -40H29', st: sd, sw: 1.6 },
          ...(bag ? [{ d: 'M-35 -60Q-34 -52 -28 -50H28Q34 -52 35 -60Z', f: BAG } as Sh] : []),
          { d: rrect(-34, -66, 68, 8, 3), f: lid ? shade(color, 0.05) : color },
        ]}
      />
    </G>
  );
}

/** Klozet (yan görünüş, sağa bakar; rezervuar solda). x = taban ortası, y = zemin */
function Toilet({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#f6f7f9', sd = '#d9dee4';
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-46, -122, 32, 64, 4), f: c },
          { d: rrect(-49, -128, 38, 8, 3), f: sd },
          { d: 'M-16 0L-14 -26Q-30 -34 -30 -48H40Q40 -30 18 -24L20 0Z', f: c },
          { d: 'M8 -26Q30 -30 40 -48H22Q18 -34 4 -28Z', f: sd, no: true },
          { d: rrect(-34, -54, 78, 7, 3), f: '#eceff2' },
          { d: rrect(-36, -60, 30, 6, 2), f: sd },
        ]}
      />
      <OG ow={1.5 / s} sh={[{ d: rrect(-36, -133, 12, 5, 2), f: '#bfc7d0' }]} />
    </G>
  );
}


/** Kar tanesi simgesi */
function Flake({ x, y, r = 12, c = '#5b7fa8' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g stroke={c} stroke-width={2.4} stroke-linecap="round">
      {[0, 60, 120].map((a) => {
        const p1 = pol([x, y], a, r), p2 = pol([x, y], a + 180, r);
        return <path key={a} d={`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`} />;
      })}
    </g>
  );
}

/** Tek battaniye altında birbirine sokulmuş aile (önden). x = orta, y = taban */
function Huddle({ x, y, s = 1, n = 4, color = '#c1554b' }: { x: number; y: number; s?: number; n?: 3 | 4; color?: string }) {
  type M = { who: PersonProps['who']; dx: number; dy: number; skin: number; extra?: Partial<PersonProps> };
  const ms: M[] = n === 4
    ? [
        { who: 'man', dx: -58, dy: -112, skin: 1, extra: AILE.dad },
        { who: 'woman', dx: 58, dy: -106, skin: 1, extra: AILE.mom },
        { who: 'boy', dx: -18, dy: -78, skin: 1, extra: AILE.boy },
        { who: 'girl', dx: 22, dy: -76, skin: 1, extra: AILE.girl },
      ]
    : [
        { who: 'man', dx: -44, dy: -108, skin: 1, extra: AILE.dad },
        { who: 'woman', dx: 44, dy: -102, skin: 1, extra: AILE.mom },
        { who: 'girl', dx: 0, dy: -74, skin: 1, extra: AILE.girl },
      ];
  const heads = ms.map((m) => [x + m.dx * s, y + m.dy * s] as P);
  const byX = heads.map((h, i) => [h, i] as const).sort((a, b) => a[0][0] - b[0][0]);
  const topPts: P[] = [];
  byX.forEach(([h]) => {
    topPts.push([h[0] - 18 * s, h[1] + 24 * s], [h[0], h[1] + 19 * s], [h[0] + 18 * s, h[1] + 24 * s]);
  });
  const L = x - 98 * s, Rx = x + 98 * s;
  const front: P[] = [[L, y], [L + 4 * s, y - 50 * s], [heads[byX[0][1]][0] - 36 * s, heads[byX[0][1]][1] + 30 * s], ...topPts, [heads[byX[byX.length - 1][1]][0] + 36 * s, heads[byX[byX.length - 1][1]][1] + 30 * s], [Rx - 4 * s, y - 50 * s], [Rx, y]];
  const backPts: P[] = [[L + 6 * s, y], [L + 6 * s, y - 80 * s], [x - 60 * s, y - 120 * s], [x, y - 116 * s], [x + 60 * s, y - 116 * s], [Rx - 6 * s, y - 76 * s], [Rx - 6 * s, y]];
  const sd = shade(color, 0.2);
  return (
    <g>
      <OG sh={[{ d: smooth(backPts, false, 0.9) + 'Z', f: sd }]} />
      {ms.map((m, i) => (
        <Person key={i} x={heads[i][0]} y={heads[i][1]} ax="head" ay="head" s={(m.who === 'man' || m.who === 'woman' ? 0.95 : 0.95) * s} who={m.who} skin={m.skin} {...m.extra} pose={{ ...POSE.stand, face: 'calm' }} only={['torso', 'head']} shadow={false} />
      ))}
      <OG sh={[
        { d: smooth(front, false, 0.8) + 'Z', f: color },
        ...byX.slice(0, -1).map(([h], i) => ({ d: `M${f1(h[0] + 22 * s)} ${f1(h[1] + 34 * s)}Q${f1(h[0] + 26 * s)} ${f1(y - 30 * s)} ${f1(h[0] + 16 * s)} ${f1(y - 4)}`, st: sd, sw: 1.8 } as Sh)),
        { d: `M${f1(L + 10 * s)} ${f1(y - 14 * s)}H${f1(Rx - 10 * s)}`, st: tint(color, 0.35), sw: 3 },
      ]} />
    </g>
  );
}

/* ════════════════════════════ SAHNELER ════════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ─────────── çadır yeri ─────────── */
  'barinma-cadir-guvenli-yer': () => (
    <Scene2 bg="outdoor" gy={186}>
      {/* hasarlı bina */}
      <Building x={8} y={190} w={78} floors={3} fh={40} color="#d9cdb8" />
      <path d="M44 72l-7 14l9 10l-8 14l6 12l-5 12M60 112l8 10l-4 10l9 8" fill="none" stroke={K.out} stroke-width={2.2} stroke-linejoin="round" />
      <path d="M14 190l8 -10l10 6l9 -8l12 8l14 -6l14 10Z" fill="#b9ab94" stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
      {/* direk ve teller */}
      <Pole x={112} y={192} h={132} />
      <path d="M94 70Q60 84 0 74M130 70Q90 86 0 84" fill="none" stroke={K.out} stroke-width={1.6} />
      {/* çadır */}
      <Tent x={258} y={206} s={1.15} color={TENT} />
      <Tree x={304} y={190} kind="leaf" s={0.6} />
      {/* uzaklık */}
      <Dash pts={[[96, 216], [200, 216]]} c={K.ink} w={2.6} />
      <path d="M88 216l10 -6v12zM208 216l-10 -6v12z" fill={K.ink} />
      <Ok x={258} y={118} r={15} />
    </Scene2>
  ),

  'barinma-cadir-yasak-yer': () => {
    const PY = 54, PH = 168, PW = 96;
    const xs = [8, 112, 216];
    return (
      <Scene2 bg="dark">
        {/* 1: dere yatağı */}
        <Panel x={xs[0]} y={PY} w={PW} h={PH} bg={K.sky}>
          <rect x={xs[0]} y={PY + 90} width={PW} height={PH} fill={K.grass} />
          <path d={`M${xs[0]} ${PY + 128}Q${xs[0] + 50} ${PY + 118} ${xs[0] + PW} ${PY + 126}V${PY + PH}H${xs[0]}Z`} fill={K.dirt} />
          <Water x={xs[0] - 4} y={PY + 132} w={PW + 10} h={40} />
          <Tent x={xs[0] + 48} y={PY + 124} s={0.7} color={TENT} />
        </Panel>
        {/* 2: çukur + su birikintisi */}
        <Panel x={xs[1]} y={PY} w={PW} h={PH} bg={K.sky}>
          <path d={`M${xs[1]} ${PY + 100}H${xs[1] + 12}Q${xs[1] + 48} ${PY + 160} ${xs[1] + 84} ${PY + 100}H${xs[1] + PW}V${PY + PH}H${xs[1]}Z`} fill={K.grass} stroke={K.out} stroke-width={1.4} />
          <path d={`M${xs[1] + 26} ${PY + 122}Q${xs[1] + 48} ${PY + 146} ${xs[1] + 70} ${PY + 122}Z`} fill={K.water} stroke={K.out} stroke-width={1.4} />
          <path d={`M${xs[1] + 38} ${PY + 128}h12`} stroke={K.waterLight} stroke-width={2} stroke-linecap="round" />
          <Tent x={xs[1] + 48} y={PY + 124} s={0.62} color={TENT} />
          <Drop x={xs[1] + 22} y={PY + 30} s={0.8} />
          <Drop x={xs[1] + 50} y={PY + 20} s={0.8} />
          <Drop x={xs[1] + 76} y={PY + 34} s={0.8} />
        </Panel>
        {/* 3: dik yamaç eteği */}
        <Panel x={xs[2]} y={PY} w={PW} h={PH} bg={K.sky}>
          <path d={`M${xs[2] - 2} ${PY + 4}L${xs[2] + 52} ${PY + 124}H${xs[2] - 2}Z`} fill="#b08a5c" stroke={K.out} stroke-width={1.4} />
          <path d={`M${xs[2] + 4} ${PY + 30}l10 22M${xs[2] + 14} ${PY + 70}l12 20`} stroke={SOILD} stroke-width={2} stroke-linecap="round" />
          <rect x={xs[2]} y={PY + 124} width={PW} height={60} fill={K.grass} />
          <Rock x={xs[2] + 20} y={PY + 76} s={0.45} />
          <Rock x={xs[2] + 34} y={PY + 104} s={0.4} />
          <Tent x={xs[2] + 64} y={PY + 140} s={0.62} color={TENT} />
        </Panel>
        {xs.map((x) => <No key={x} x={x + PW / 2} y={PY - 1} r={22} />)}
      </Scene2>
    );
  },

  'barinma-cadir-mesafe': () => {
    // yukarıdan çadır: kare zemin + çatı mahyası
    const TopTent = ({ x, y, w = 56, c = TENT }: { x: number; y: number; w?: number; c?: string }) => (
      <OG
        sh={[
          { d: rrect(x, y, w, w, 3), f: c },
          { d: `M${x} ${y}L${x + w / 2} ${y + w / 2}L${x} ${y + w}Z`, f: shade(c, 0.16), no: true },
          { d: `M${x + w} ${y}L${x + w / 2} ${y + w / 2}L${x + w} ${y + w}Z`, f: shade(c, 0.08), no: true },
          { d: `M${x} ${y}L${x + w} ${y + w}M${x + w} ${y}L${x} ${y + w}`, st: shade(c, 0.35), sw: 1.4 },
        ]}
      />
    );
    const TopCar = ({ x, y }: { x: number; y: number }) => (
      <OG
        sh={[
          { d: rrect(x, y, 44, 82, 12), f: '#d0473d' },
          { d: rrect(x + 6, y + 18, 32, 14, 4), f: '#bfe3f5', ln: true },
          { d: rrect(x + 6, y + 50, 32, 12, 4), f: '#bfe3f5', ln: true },
          { d: rrect(x + 6, y + 32, 32, 18, 3), f: shade('#d0473d', 0.12), ln: true },
        ]}
      />
    );
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill={K.grass} />
        {[[30, 30], [140, 40], [90, 210], [200, 200], [180, 30]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y}l3 -6l3 6M${x + 8} ${y + 2}l3 -6l3 6`} stroke={K.grassShade} stroke-width={1.6} fill="none" stroke-linecap="round" />
        ))}
        {/* bina (yukarıdan çatı) */}
        <OG sh={[{ d: rrect(246, 14, 66, 92, 2), f: '#c2583e' }, { d: 'M246 60H312', st: shade('#c2583e', 0.3), sw: 2 }, { d: rrect(246, 14, 66, 46, 2), f: shade('#c2583e', 0.1), no: true }]} />
        <TopCar x={258} y={140} />
        <TopTent x={14} y={110} />
        <TopTent x={100} y={110} c={TENT2} />
        {/* güvenlik sınırı */}
        <Dash pts={[[236, 8], [236, 232]]} c={K.danger} w={2.4} dash="6 6" />
        <Dim a={[72, 138]} b={[98, 138]} text="2 m" lab={[85, 92]} size={14} />
        <path d="M85 102V128" stroke={K.ink} stroke-width={1.5} stroke-dasharray="3 3" />
        <Dim a={[158, 150]} b={[234, 150]} text="6 m" lab={[196, 196]} size={15} />
        <path d="M196 160V184" stroke={K.ink} stroke-width={1.5} stroke-dasharray="3 3" />
        <Dim a={[158, 76]} b={[234, 76]} />
      </Scene2>
    );
  },

  'barinma-zemin-yalitim': () => {
    const gy = 206;
    const layers: [number, number, string, string][] = [
      // y, h, renk, ad
      [gy - 18, 18, '#c58f58', 'palet'],
      [gy - 26, 8, '#b98b5a', 'karton'],
      [gy - 40, 14, '#4f9fd6', 'köpük'],
    ];
    const top = gy - 40;
    const sleeper: PersonProps = { ...AILE.mom, x: 166, y: top - 2, s: 0.96, pose: { ...POSE.lieBack } };
    const sr = rig(sleeper);
    return (
      <Scene2 bg="night" gy={gy}>
        {/* toprak altı */}
        <rect y={gy} width={320} height={40} fill="#5b4a3b" />
        {/* çadır kesiti */}
        <path d={`M10 ${gy}C14 120 60 40 160 34C260 40 306 120 310 ${gy}`} fill="#f2c79a" stroke={K.out} stroke-width={2} />
        <path d={`M22 ${gy}C26 128 70 50 160 46C250 50 294 128 298 ${gy}`} fill="#fbe4c7" />
        <path d={`M10 ${gy}C14 120 60 40 160 34C260 40 306 120 310 ${gy}`} fill="none" stroke={TENT} stroke-width={10} />
        <path d={`M10 ${gy}C14 120 60 40 160 34C260 40 306 120 310 ${gy}`} fill="none" stroke={K.out} stroke-width={1.6} />
        {/* palet */}
        <OG sh={[
          { d: rrect(40, gy - 7, 240, 7, 1), f: '#a8733f' },
          ...[44, 100, 156, 212, 266].map((x) => ({ d: rrect(x, gy - 13, 12, 7, 1), f: shade('#a8733f', 0.15) } as Sh)),
          { d: rrect(38, gy - 19, 244, 7, 1), f: '#c58f58' },
        ]} />
        {/* karton */}
        <OG sh={[{ d: rrect(40, gy - 26, 240, 7, 1), f: '#c9a06e' }, { d: `M44 ${gy - 22.5}H276`, st: shade('#c9a06e', 0.2), sw: 1, }]} />
        {/* köpük minder */}
        <OG sh={[{ d: rrect(44, gy - 40, 232, 14, 6), f: '#4f9fd6' }, { d: `M60 ${gy - 33}H260`, st: tint('#4f9fd6', 0.35), sw: 1.4 }]} />
        {/* uyuyan kişi + battaniye */}
        <Person {...sleeper} />
        <path d={`M${sr.neck[0] + 8} ${top}C${sr.neck[0] + 4} ${top - 30} ${sr.neck[0] + 30} ${top - 28} ${sr.neck[0] + 60} ${top - 26}C${sr.neck[0] + 110} ${top - 24} ${sr.neck[0] + 150} ${top - 18} ${sr.neck[0] + 158} ${top}Z`} fill="#c1554b" stroke={K.out} stroke-width={1.6} />
        <path d={`M${sr.neck[0] + 50} ${top - 24}L${sr.neck[0] + 44} ${top - 2}M${sr.neck[0] + 110} ${top - 20}L${sr.neck[0] + 114} ${top - 2}`} stroke={shade('#c1554b', 0.25)} stroke-width={1.6} />
        {/* katman şeritleri (sağda renk kodu) */}
        {layers.map(([y, h, c], i) => (
          <rect key={i} x={286} y={y + 1} width={10} height={h - 2} rx={2} fill={c} stroke={K.out} stroke-width={1.2} />
        ))}
        {/* yerden yükselen soğuk: palete çarpıp duruyor */}
        {[70, 130, 190, 250].map((x) => (
          <g key={x}>
            <Arrow from={[x, 238]} to={[x, gy + 4]} w={3.6} color={K.waterLight} />
          </g>
        ))}
        <path d={`M40 ${gy + 1}H280`} stroke={K.water} stroke-width={3} stroke-dasharray="2 5" stroke-linecap="round" />
      </Scene2>
    );
  },

  'barinma-cadir-havalandirma': () => {
    const cx = 160, gy = 204;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <circle cx={278} cy={34} r={16} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
        <Tree x={26} y={196} kind="pine" s={0.85} />
        <Tree x={300} y={198} kind="leaf" s={0.7} />
        {/* çadır önden */}
        <OG
          sh={[
            { d: `M${cx - 112} ${gy + 6}L${cx} ${gy - 150}L${cx + 112} ${gy + 6}Z`, f: TENT },
            { d: `M${cx} ${gy - 150}L${cx + 112} ${gy + 6}H${cx + 60}Z`, f: shade(TENT, 0.14), no: true },
            // açık kapı (içerisi koyu)
            { d: `M${cx - 34} ${gy + 6}L${cx} ${gy - 104}L${cx + 34} ${gy + 6}Z`, f: '#5a3826' },
            // yan pencereler (file)
            { d: rrect(cx - 82, gy - 52, 30, 26, 3), f: '#5a3826' },
            { d: rrect(cx + 52, gy - 52, 30, 26, 3), f: '#5a3826' },
          ]}
        />
        {/* sarılıp bağlanmış kapı kanatları ve pencere kapakları */}
        <OG sh={[
          { d: capsule([cx - 38, gy - 92], 7, [cx - 30, gy - 4], 6), f: tint(TENT, 0.15) },
          { d: capsule([cx + 38, gy - 92], 7, [cx + 30, gy - 4], 6), f: tint(TENT, 0.15) },
          { d: capsule([cx - 84, gy - 56], 5, [cx - 50, gy - 56], 5), f: tint(TENT, 0.15) },
          { d: capsule([cx + 50, gy - 56], 5, [cx + 84, gy - 56], 5), f: tint(TENT, 0.15) },
        ]} />
        <path d={`M${cx - 41} ${gy - 50}h12M${cx + 29} ${gy - 50}h12M${cx - 67} ${gy - 61}v10M${cx + 67} ${gy - 61}v10`} stroke={K.out} stroke-width={2.4} stroke-linecap="round" />
        <path d={`M${cx - 82} ${gy - 42}h30M${cx - 82} ${gy - 34}h30M${cx + 52} ${gy - 42}h30M${cx + 52} ${gy - 34}h30`} stroke="#7a5640" stroke-width={1} />
        {/* içeri giren temiz hava */}
        <AirArrow from={[18, 150]} to={[cx - 70, gy - 38]} bend={-0.2} />
        <AirArrow from={[302, 150]} to={[cx + 70, gy - 38]} bend={0.2} />
        <AirArrow from={[cx - 70, 232]} to={[cx - 10, gy - 30]} bend={-0.25} />
        {/* dışarı çıkan nem: açık mavi buhar kıvrımları + su damlacıkları (duman değil) */}
        {([[cx - 67, gy - 58, -1], [cx + 67, gy - 58, 1], [cx, gy - 108, 0]] as [number, number, number][]).map(([x0, y0, d], i) => {
          const x1 = x0 + d * 26, y1 = y0 - 40;
          const path = `M${x0} ${y0}C${x0 + d * 4 - 8} ${y0 - 14} ${x0 + d * 14 + 8} ${y0 - 22} ${x0 + d * 14} ${y0 - 30}S${x1 - 6} ${y1 + 2} ${x1} ${y1}`;
          return (
            <g key={i}>
              <path d={path} fill="none" stroke="#fff" stroke-width={6} stroke-linecap="round" opacity={0.7} />
              <path d={path} fill="none" stroke="#8fcdf0" stroke-width={3} stroke-linecap="round" stroke-dasharray="9 5" />
              <Drop x={x0 + d * 6 + 9} y={y0 - 14} s={0.55} color="#8fcdf0" />
              <Drop x={x1 + d * 4 - 8} y={y1 - 2} s={0.5} color="#8fcdf0" />
            </g>
          );
        })}
      </Scene2>
    );
  },

  'barinma-fener-mum-yasak': () => {
    const IN = '#4a3a3a';
    const sitter: PersonProps = { ...AILE.dad, x: 76, y: 210, s: 1.05, pose: { ...POSE.sitFloor, spine: -80, legF: [-30, 40], armF: { to: [128, 178] }, armB: { floor: -16 }, handF: 'fist', face: 'calm' } };
    return (
      <Scene2 bg="dark">
        {/* sol: doğru — pilli fener */}
        <Panel x={8} y={10} w={190} h={220} bg={IN}>
          <path d="M8 230L103 30L198 230Z" fill="#6b4b3a" />
          <circle cx={103} cy={90} r={90} fill="#ffe680" opacity={0.12} />
          <rect x={8} y={206} width={190} height={30} fill="#3c3533" />
          <path d="M103 30V64" stroke={K.out} stroke-width={2.4} />
          <CampLamp x={103} y={110} s={1.05} />
          <Person {...sitter} />
          <Flashlight x={124} y={180} a={-8} s={0.8} beam={false} />
          <Ok x={170} y={36} r={14} />
        </Panel>
        {/* sağ: yasak — mum ve gaz lambası */}
        <Panel x={206} y={10} w={106} h={220} bg={IN}>
          <path d="M206 230L259 50L312 230Z" fill="#6b4b3a" />
          <rect x={206} y={196} width={106} height={40} fill="#3c3533" />
          <Candle x={234} y={200} s={0.9} />
          <OilLamp x={282} y={200} s={0.95} />
          <No x={259} y={160} r={44} />
        </Panel>
      </Scene2>
    );
  },

  /* ─────────── toplanma ve aile planı ─────────── */
  'barinma-toplanma-sorgu': () => {
    const px = 160, py = 118, pw = 132, ph = 212;
    const x0 = px - pw / 2, y0 = py - ph / 2;
    const sx = x0 + 9, sy = y0 + 16, sw = pw - 18, sh2 = ph - 30;
    return (
      <Scene2 bg="closeup">
        {/* eller arkada */}
        <Hand x={64} y={250} a={28} s={1.2} pose="open" side="L" view="palm" skin={1} arm={80} sleeve={K.role.bystander} />
        <Hand x={256} y={250} a={-28} s={1.2} pose="open" side="R" view="palm" skin={1} arm={80} sleeve={K.role.bystander} />
        {/* telefon */}
        <OG sh={[{ d: rrect(x0, y0, pw, ph, 16), f: '#2f3542' }]} />
        <rect x={sx} y={sy} width={sw} height={sh2} rx={6} fill="#f3f6f8" />
        {/* üst çubuk */}
        <rect x={sx} y={sy} width={sw} height={22} rx={6} fill="#d33a32" />
        <rect x={sx} y={sy + 14} width={sw} height={8} fill="#d33a32" />
        <text x={sx + 10} y={sy + 15.5} font-size={11} font-weight={700} fill="#fff" font-family="'IBM Plex Sans', system-ui, sans-serif">e-Devlet</text>
        {/* harita */}
        <g>
          <rect x={sx + 6} y={sy + 30} width={sw - 12} height={sh2 - 40} rx={4} fill="#e6eadf" />
          <path d={`M${sx + 6} ${sy + 80}H${sx + sw - 6}M${sx + 6} ${sy + 140}H${sx + sw - 6}M${sx + 40} ${sy + 30}V${sy + sh2 - 10}M${sx + 84} ${sy + 30}V${sy + sh2 - 10}`} stroke="#fff" stroke-width={7} />
          <path d={`M${sx + 6} ${sy + 120}L${sx + sw - 6} ${sy + 60}`} stroke="#ffd98a" stroke-width={6} />
          {[[sx + 12, sy + 36], [sx + 48, sy + 88], [sx + 92, sy + 148], [sx + 12, sy + 148], [sx + 92, sy + 36]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={22} height={18} rx={2} fill="#cfd5dc" />
          ))}
          {/* toplanma alanı */}
          <rect x={sx + 50} y={sy + 34} width={28} height={40} rx={3} fill="#bfe0a8" />
          <rect x={sx + 52} y={sy + 96} width={0} height={0} />
          <g>
            <rect x={sx + 46} y={sy + 98} width={34} height={34} rx={4} fill={K.safe} stroke={K.out} stroke-width={1.5} />
            {[-9, 0, 9].map((dx, i) => {
              const cx = sx + 63 + dx, cy = sy + 112 + (i === 1 ? -2 : 0);
              return (
                <g key={i} fill="#fff">
                  <circle cx={cx} cy={cy - 4} r={3} />
                  <path d={`M${cx - 4} ${cy + 11}V${cy + 3}Q${cx - 4} ${cy - 0.5} ${cx} ${cy - 0.5}Q${cx + 4} ${cy - 0.5} ${cx + 4} ${cy + 3}V${cy + 11}Z`} />
                </g>
              );
            })}
          </g>
          {/* konum iğnesi */}
          <g transform={`translate(${sx + 30} ${sy + 168})`}>
            <ellipse cx={0} cy={2} rx={6} ry={2} fill="#000" opacity={0.2} />
            <path d="M0 0C-4 -8 -11 -13 -11 -21A11 11 0 0 1 11 -21C11 -13 4 -8 0 0Z" fill="#3d7ad6" stroke={K.out} stroke-width={1.5} />
            <circle cx={0} cy={-21} r={4} fill="#fff" />
          </g>
          <Dash pts={[[sx + 30, sy + 146], [sx + 30, sy + 140], [sx + 52, sy + 140], [sx + 56, sy + 134]]} c={K.water} w={2.4} dash="3 4" />
        </g>
        {/* başparmaklar ön yüzde */}
        <OG sh={[
          { d: capsule([x0 - 6, py + 70], 9, [x0 + 14, py + 50], 7.5), f: K.skin[1] },
          { d: capsule([x0 + pw + 6, py + 70], 9, [x0 + pw - 14, py + 50], 7.5), f: K.skin[1] },
        ]} />
      </Scene2>
    );
  },

  'barinma-aile-iki-bulusma': () => {
    const mx = 10, my = 14, mw = 180, mh = 180;
    const home: P = [56, 146], park: P = [104, 110], school: P = [150, 46];
    const dad: PersonProps = { ...AILE.dad, x: 290, y: 230, s: 0.92, flip: true, pose: { ...POSE.standSide, head: -96, face: 'calm' } };
    const mom: PersonProps = { ...AILE.mom, x: 244, y: 230, s: 0.9, flip: true, pose: { ...POSE.standSide, head: -96, armF: { to: [186, 112] }, handF: { shape: 'flat', a: 0 }, face: 'speak' } };
    const kid: PersonProps = { ...AILE.boy, x: 214, y: 232, s: 0.92, flip: true, pose: { ...POSE.standSide, head: -100, face: 'calm' } };
    return (
      <Scene2 bg="indoor">
        {/* pano */}
        <OG sh={[{ d: rrect(mx - 4, my - 4, mw + 8, mh + 8, 6), f: '#9a6b44' }, { d: rrect(mx, my, mw, mh, 3), f: '#eef0e6' }]} />
        {/* mahalle sınırı */}
        <path d={`M${mx + 8} ${my + 70}Q${mx + 70} ${my + 60} ${mx + 132} ${my + 70}V${mh + my - 8}H${mx + 8}Z`} fill="#f7f1df" stroke={K.ink} stroke-width={1.4} stroke-dasharray="5 4" />
        {/* yollar */}
        <path d={`M${mx} ${my + 128}H${mx + mw}M${mx + 90} ${my}V${my + mh}M${mx} ${my + 40}H${mx + mw}`} stroke="#fff" stroke-width={9} />
        <path d={`M${mx} ${my + 128}H${mx + mw}M${mx + 90} ${my}V${my + mh}M${mx} ${my + 40}H${mx + mw}`} stroke="#d4d6cc" stroke-width={9} opacity={0.5} />
        {/* ev */}
        <OG sh={[{ d: rrect(home[0] - 14, home[1] - 8, 28, 22, 1), f: '#f0dcc0' }, { d: `M${home[0] - 18} ${home[1] - 7}L${home[0]} ${home[1] - 24}L${home[0] + 18} ${home[1] - 7}Z`, f: '#c2583e' }, { d: rrect(home[0] - 4, home[1] + 2, 8, 12, 1), f: '#8a5a3a', ln: true }]} />
        {/* 1: park */}
        <OG sh={[{ d: rrect(park[0] - 12, park[1] - 26, 50, 40, 6), f: '#a9d58a' }, { d: circ([park[0] - 2, park[1] - 14], 7), f: K.leaf }, { d: circ([park[0] + 26, park[1] - 2], 7), f: K.leaf }]} />
        {/* 2: okul */}
        <OG sh={[{ d: rrect(school[0] - 24, school[1] - 18, 48, 36, 2), f: '#e3d6c2' }, { d: rrect(school[0] - 20, school[1] + 2, 40, 12, 2), f: '#c7dfa9', ln: true }, { d: rrect(school[0] - 16, school[1] - 14, 10, 8, 1), f: '#bfe3f5', ln: true }, { d: rrect(school[0] + 6, school[1] - 14, 10, 8, 1), f: '#bfe3f5', ln: true }]} />
        {/* kesikli yollar */}
        <Dash pts={[[home[0] + 10, home[1] - 12], [home[0] + 30, home[1] - 26], [park[0] - 6, park[1] + 2]]} c={K.action} w={3.4} dash="5 5" curve />
        <Dash pts={[[home[0] - 6, home[1] - 22], [home[0] + 4, my + 44], [school[0] - 46, school[1] + 6], [school[0] - 28, school[1]]]} c={K.action} w={3.4} dash="5 5" curve />
        <Num x={park[0] + 22} y={park[1] - 30} n={1} r={11} />
        <Num x={school[0] + 18} y={school[1] - 26} n={2} r={11} />
        {/* aile */}
        <Person {...dad} />
        <Person {...mom} />
        <Person {...kid} />
      </Scene2>
    );
  },

  'barinma-haber-kisisi': () => {
    const caller: PersonProps = { ...AILE.mom, x: 66, y: 222, s: 0.95, pose: { ...POSE.stand, armF: { at: 'head', d: [15, 6], bend: 1 }, handF: 'fist', face: 'speak' } };
    const cr = rig(caller);
    const elder: PersonProps = { x: 250, y: 222, s: 0.92, who: 'oldwoman', role: 'bystander2', pose: { ...POSE.stand, armB: { at: 'head', d: [-15, 6], bend: -1 }, handB: 'fist', face: 'calm' } };
    const er = rig(elder);
    const ph1: P = [cr.handF[0] + 1, cr.handF[1] - 2];
    const ph2: P = [er.handB[0] - 1, er.handB[1] - 2];
    const City = ({ x, c }: { x: number; c: string }) => (
      <path d={`M${x} 200V172h12v-10h10v14h8v-26h14v20h10v-8h12v16h10v-22h10v30h12v14Z`} fill={c} />
    );
    return (
      <Scene2 bg="dark">
        <Panel x={8} y={48} w={146} h={184} bg="#d8c7b0">
          <City x={8} c="#b7a58e" />
          <rect x={8} y={200} width={146} height={40} fill="#b9b2a4" />
          {/* yıkıntı */}
          <path d="M100 200l6 -18l12 -6l8 10l10 -14l12 8l6 20Z" fill="#a39886" stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
          <Rock x={126} y={206} s={0.5} />
          <path d="M108 150l4 10l-6 8l7 10" fill="none" stroke={K.out} stroke-width={1.6} />
          <Person {...caller} over={() => <OG sh={[{ d: rrect(ph1[0] - 4, ph1[1] - 9, 8, 16, 2), f: '#2f3542', t: `rotate(10 ${ph1[0]} ${ph1[1]})` }]} />} />
        </Panel>
        <Panel x={166} y={48} w={146} h={184} bg={K.wall}>
          <rect x={166} y={204} width={146} height={30} fill={K.floor} />
          <Window x={180} y={74} w={56} h={46} />
          <City x={172} c="#9bc1d6" />
          <rect x={166} y={200} width={146} height={6} fill={K.wallShade} />
          <Person {...elder} over={() => <OG sh={[{ d: rrect(ph2[0] - 4, ph2[1] - 9, 8, 16, 2), f: '#2f3542', t: `rotate(-10 ${ph2[0]} ${ph2[1]})` }]} />} />
        </Panel>
        {/* bağlantı */}
        <Dash pts={[[ph1[0] + 6, ph1[1] - 14], [100, 22], [160, 12], [220, 22], [ph2[0] - 6, ph2[1] - 14]]} c={K.action} w={3.6} dash="7 6" curve />
        <Waves x={ph1[0] + 8} y={ph1[1] - 10} a={-50} n={2} r={6} />
        <Waves x={ph2[0] - 8} y={ph2[1] - 10} a={-130} n={2} r={6} />
        <circle cx={160} cy={12} r={0} />
      </Scene2>
    );
  },

  'barinma-numara-kagidi': () => {
    // kâğıt (sol), yazan el; sağda cüzdan ve okul çantası cebi
    const pen = { a: -30, s: 0.95, pose: 'pinch' as const, side: 'R' as const, skin: 2, arm: 120, sleeve: K.role.helper };
    const tip: P = [118, 132];
    const ph = handAt(pen, 'pinch', [tip[0] + 14, tip[1] - 22]);
    return (
      <Scene2 bg="closeup">
        {/* kâğıt */}
        <OG sh={[{ d: 'M18 52L150 42L158 196L26 206Z', f: '#fffdf4' }, { d: 'M86 47L94 201', st: '#d8d2c0', sw: 1.4 }]} />
        <g font-family="'Caveat', 'Comic Sans MS', cursive" font-size={17} font-weight={700} fill="#24407a" transform="rotate(-4 88 120)">
          <text x={30} y={80}>112</text>
          <text x={30} y={108}>0532 ...</text>
          <text x={30} y={136}>0216 ...</text>
          <text x={30} y={164} opacity={0.6}>05</text>
        </g>
        {/* kalem + el */}
        <path d={`M${tip[0]} ${tip[1]}L${tip[0] + 44} ${tip[1] - 76}`} stroke="#2f5fae" stroke-width={7} stroke-linecap="round" />
        <path d={`M${tip[0]} ${tip[1]}L${tip[0] + 5} ${tip[1] - 9}`} stroke={K.ink} stroke-width={4} stroke-linecap="round" />
        <Hand {...ph} />
        {/* cüzdan */}
        <OG sh={[{ d: rrect(186, 150, 112, 66, 8), f: '#7b4e2e' }, { d: rrect(186, 150, 112, 22, 8), f: shade('#7b4e2e', 0.15) }, { d: 'M196 162H288', st: tint('#7b4e2e', 0.3), sw: 1.4 }]} />
        <OG sh={[{ d: 'M206 168L244 132L262 148L226 182Z', f: '#fffdf4' }]} />
        <OG sh={[{ d: rrect(186, 170, 112, 46, 8), f: '#8a5a36' }, { d: circ([284, 192], 4), f: '#d6b25c', ln: true }]} />
        {/* okul çantası ön cebi */}
        <OG sh={[
          { d: 'M196 18H292Q300 18 300 26V118H188V26Q188 18 196 18Z', f: '#4f7fb0' },
          { d: rrect(204, 64, 80, 50, 8), f: shade('#4f7fb0', 0.12) },
          { d: 'M204 72Q244 64 284 72', st: K.out, sw: 1.6 },
        ]} />
        <OG sh={[{ d: 'M226 76L236 40L262 46L254 80Z', f: '#fffdf4' }]} />
        <OG sh={[{ d: rrect(204, 72, 80, 42, 8), f: shade('#4f7fb0', 0.12) }]} />
        <Arrow from={[160, 92]} to={[218, 54]} bend={-0.15} w={5} />
        <Arrow from={[160, 172]} to={[204, 160]} bend={0.15} w={5} />
      </Scene2>
    );
  },

  'barinma-kapiya-not': () => {
    const nx = 112, ny = 64, nw = 96, nh = 84;
    const hand = handAt({ a: -20, s: 0.95, pose: 'press', side: 'R', skin: 0, arm: 200, sleeve: K.role.bystander3 }, 'tip', [nx + nw - 4, ny + nh - 6]);
    return (
      <Scene2 bg="indoor" gy={226}>
        <Door x={70} y={226} w={180} h={232} />
        {/* not kâğıdı */}
        <OG sh={[{ d: `M${nx} ${ny}L${nx + nw} ${ny - 4}L${nx + nw + 3} ${ny + nh}L${nx + 3} ${ny + nh + 3}Z`, f: '#fff6b5' }]} />
        {/* toplanma alanı simgesi */}
        <g>
          <rect x={nx + 10} y={ny + 18} width={42} height={42} rx={5} fill={K.safe} stroke={K.out} stroke-width={1.5} />
          {[-11, 0, 11].map((dx, i) => {
            const cx = nx + 31 + dx, cy = ny + 36 + (i === 1 ? -2 : 0);
            return (
              <g key={i} fill="#fff">
                <circle cx={cx} cy={cy - 5} r={3.6} />
                <path d={`M${cx - 5} ${cy + 14}V${cy + 4}Q${cx - 5} ${cy - 1} ${cx} ${cy - 1}Q${cx + 5} ${cy - 1} ${cx + 5} ${cy + 4}V${cy + 14}Z`} />
              </g>
            );
          })}
          <path d={`M${nx + 88} ${ny + 40}H${nx + 60}M${nx + 70} ${ny + 30}L${nx + 59} ${ny + 40}L${nx + 70} ${ny + 50}`} fill="none" stroke={K.ink} stroke-width={4} stroke-linecap="round" stroke-linejoin="round" />
        </g>
        {/* bantlar */}
        {[[nx - 4, ny - 2, -35], [nx + nw - 2, ny - 6, 35], [nx, ny + nh + 2, 35]].map(([x, y, a], i) => (
          <rect key={i} x={x - 14} y={y - 5} width={28} height={10} fill="#e9e2c8" opacity={0.85} stroke={K.out} stroke-width={1} transform={`rotate(${a} ${x} ${y})`} />
        ))}
        <rect x={nx + nw - 12} y={ny + nh - 4} width={28} height={10} fill="#e9e2c8" opacity={0.85} stroke={K.out} stroke-width={1} transform={`rotate(-35 ${nx + nw} ${ny + nh})`} />
        <Hand {...hand} />
      </Scene2>
    );
  },

  'barinma-sifon-yasak': () => {
    const tx = 196, gy = 210;
    const flush: P = [tx - 30 * 1.1, gy - 133 * 1.1];
    const fh = handAt({ a: -150, s: 0.8, pose: 'point', side: 'L', skin: 1, arm: 200, sleeve: K.role.bystander }, 'tip', [flush[0] + 2, flush[1] - 1]);
    return (
      <Scene2 bg="indoor" gy={gy} wall="#dfe9ee">
        {/* fayans */}
        <g stroke="#c9d6dd" stroke-width={1.2}>
          {[40, 80, 120, 160].map((y) => <path key={y} d={`M96 ${y}H320`} />)}
          {[130, 170, 210, 250, 290].map((x) => <path key={x} d={`M${x} 0V${gy - 9}`} />)}
        </g>
        {/* duvar kesiti + kırık boru */}
        <rect x={0} y={0} width={92} height={240} fill="#c9bba6" />
        <path d="M0 0H92V240H0Z" fill="url(#none)" />
        {[20, 46, 72, 98, 124, 150, 176, 202, 228].map((y, i) => <path key={y} d={`M0 ${y}H92M${i % 2 ? 30 : 60} ${y}V${y + 26}`} stroke={shade('#c9bba6', 0.2)} stroke-width={1.2} />)}
        <rect x={86} y={0} width={10} height={240} fill="#e8e0d2" stroke={K.out} stroke-width={1.5} />
        <OG sh={[
          { d: rrect(34, 20, 26, 220, 4), f: '#8c96a1' },
          { d: rrect(30, 112, 34, 12, 2), f: shade('#8c96a1', 0.15) },
          { d: `M60 ${gy - 16}H${tx - 20}V${gy - 2}H60Z`, f: '#8c96a1' },
        ]} />
        <path d="M36 88l10 6l-6 8l14 4l-4 8" fill="none" stroke={K.out} stroke-width={2.2} stroke-linejoin="round" />
        <path d="M30 96q-6 10 -2 20M26 104q-4 6 0 12" fill="none" stroke="#7d6a3c" stroke-width={2.4} stroke-linecap="round" />
        <circle cx={24} cy={124} r={3} fill="#7d6a3c" />
        <Toilet x={tx} y={gy + 6} s={1.1} />
        {/* sifon basan el */}
        <Hand {...fh} />
        <No x={flush[0] + 4} y={flush[1] + 2} r={30} />
      </Scene2>
    );
  },
  /* ─────────── acil tuvalet ─────────── */
  'barinma-kova-poset': () => {
    const c = '#e9e3d4';
    const top = 98, bot = 228, xl = 74, xr = 246;
    const wav = (y: number, amp: number) => {
      let d = `M${xl - 6} ${y}`;
      for (let x = xl - 6; x < xr + 6; x += 16) d += `q4 ${amp} 8 0t8 0`;
      return d;
    };
    const lh = handAt({ a: 168, s: 0.95, pose: 'press', side: 'L', skin: 1, arm: 200, sleeve: K.role.helper }, 'tip', [xl + 4, top + 26]);
    const rh = handAt({ a: 192, s: 0.95, pose: 'press', side: 'R', skin: 1, arm: 200, sleeve: K.role.helper }, 'tip', [xr - 4, top + 26]);
    return (
      <Scene2 bg="closeup">
        {/* kapak yanda */}
        <OG sh={[{ d: ell([282, 214], 30, 9), f: shade(c, 0.08) }, { d: ell([282, 208], 30, 9), f: c }, { d: rrect(270, 196, 24, 8, 3), f: shade(c, 0.12) }]} />
        {/* kova gövdesi */}
        <OG sh={[
          { d: `M${xl} ${top}L${xl + 16} ${bot}H${xr - 16}L${xr} ${top}Z`, f: c },
          { d: `M${xr - 46} ${top}L${xr - 54} ${bot}H${xr - 16}L${xr} ${top}Z`, f: shade(c, 0.1), no: true },
          { d: `M${xl + 8} ${top + 56}H${xr - 8}`, st: shade(c, 0.18), sw: 2 },
          { d: ell([160, top], (xr - xl) / 2, 20), f: c },
        ]} />
        {/* poşet içi */}
        <path d={ell([160, top], (xr - xl) / 2 - 6, 15)} fill="#14161b" />
        {/* 1. poşet (içte, aşağı sarkıyor) */}
        <path d={`M${xl - 4} ${top - 4}L${xr + 4} ${top - 4}L${xr + 3} ${top + 34}Q${160} ${top + 44} ${xl - 3} ${top + 34}Z`} fill={BAG} stroke={K.out} stroke-width={1.5} />
        {/* 2. poşet (dışta, üstte) */}
        <path d={`M${xl - 7} ${top - 8}L${xr + 7} ${top - 8}L${xr + 6} ${top + 18}Q${160} ${top + 28} ${xl - 6} ${top + 18}Z`} fill="#4a4f5b" stroke={K.out} stroke-width={1.5} />
        <path d={`M${xl + 30} ${top + 6}q6 8 4 18M${xr - 40} ${top + 4}q-4 10 0 18`} stroke="#6b7180" stroke-width={2} fill="none" stroke-linecap="round" />
        <path d={ell([160, top - 8], (xr - xl) / 2 + 6, 17)} fill="#4a4f5b" stroke={K.out} stroke-width={1.5} />
        <path d={ell([160, top - 6], (xr - xl) / 2 - 4, 12)} fill="#0f1115" />
        <Hand {...lh} />
        <Hand {...rh} />
        <Arrow from={[200, 186]} to={[176, top + 26]} w={6} bend={-0.2} />
        <Label x={214} y={196} text="2 kat" size={15} />
      </Scene2>
    );
  },

  'barinma-toprak-serp': () => {
    const cx = 150, cy = 158, rx = 96, ry = 56;
    const scoop = { a: -70, s: 1, pose: 'hold' as const, side: 'R' as const, skin: 0, arm: 200, sleeve: K.role.bystander2, grip: 28 };
    const g: P = [212, 62];
    const sh = handAt(scoop, 'grip', g);
    const grains: P[] = [[178, 84], [172, 98], [184, 104], [166, 112], [176, 122], [160, 128], [170, 136], [186, 118], [158, 104]];
    return (
      <Scene2 bg="closeup">
        {/* yukarıdan kova */}
        <OG sh={[{ d: ell([cx, cy], rx + 10, ry + 8), f: '#e9e3d4' }, { d: ell([cx, cy], rx, ry), f: BAG }]} />
        <path d={ell([cx, cy + 4], rx - 12, ry - 12)} fill="#14161b" />
        {/* toprak birikmiş */}
        <path d={`M${cx - 52} ${cy + 18}Q${cx - 20} ${cy - 4} ${cx + 10} ${cy + 6}Q${cx + 40} ${cy - 2} ${cx + 56} ${cy + 20}Q${cx} ${cy + 44} ${cx - 52} ${cy + 18}Z`} fill={SOIL} stroke={K.out} stroke-width={1.4} />
        {[[-30, 14], [-6, 10], [20, 12], [36, 18], [-16, 22], [6, 26]].map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={2.2} fill={SOILD} />)}
        {/* düşen toprak */}
        {grains.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 2.6 : 3.4} fill={SOIL} stroke={K.out} stroke-width={1} />)}
        {/* toprak kabı (sol üst) */}
        <OG sh={[{ d: ell([52, 58], 42, 30), f: '#7a8a9a' }, { d: ell([52, 58], 34, 22), f: SOIL }]} />
        {[[40, 52], [58, 60], [46, 66], [66, 50], [30, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} fill={SOILD} />)}
        {/* kapak (sağ alt) */}
        <OG sh={[{ d: ell([282, 200], 36, 26), f: '#ded6c4' }, { d: ell([282, 200], 26, 18), f: '#e9e3d4', ln: true }, { d: rrect(270, 196, 24, 8, 3), f: '#cfc6b2' }]} />
        {/* el + kepçe */}
        <Hand {...sh}>
          <G x={g[0]} y={g[1]} a={-70}>
            <OG sh={[{ d: rrect(-6, -20, 12, 40, 4), f: '#e0663c' }]} />
          </G>
        </Hand>
        <G x={186} y={70} a={40}>
          <OG sh={[{ d: 'M-22 -12Q-24 10 0 12Q24 10 22 -12Z', f: '#e0663c' }, { d: ell([0, -12], 22, 6), f: SOIL }]} />
        </G>
        <Arrow from={[230, 120]} to={[196, 146]} w={5} bend={-0.3} />
      </Scene2>
    );
  },

  'barinma-poset-bagla': () => {
    const outer: P = [96, 150];
    const knotBag = (x: number, y: number) => (
      <OG sh={[
        { d: `M${x - 30} ${y + 10}Q${x - 34} ${y + 52} ${x} ${y + 56}Q${x + 34} ${y + 52} ${x + 30} ${y + 10}Q${x + 16} ${y - 4} ${x + 4} ${y - 6}H${x - 4}Q${x - 16} ${y - 4} ${x - 30} ${y + 10}Z`, f: BAG },
        { d: `M${x - 4} ${y - 6}L${x - 12} ${y - 22}L${x - 2} ${y - 14}L${x + 2} ${y - 14}L${x + 12} ${y - 22}L${x + 4} ${y - 6}Z`, f: BAG },
        { d: ell([x, y - 9], 6, 5), f: '#3c4049' },
        { d: `M${x - 16} ${y + 16}q-4 16 2 28`, st: '#4d5361', sw: 2 },
      ]} />
    );
    const hold = handAt({ a: 172, s: 0.85, pose: 'pinch', side: 'R', skin: 1, arm: 200, sleeve: K.role.bystander4 }, 'pinch', [outer[0] + 4, 58]);
    const grabL = handAt({ a: 150, s: 0.8, pose: 'press', side: 'L', skin: 1, arm: 200, sleeve: K.role.bystander4 }, 'tip', [outer[0] - 50, outer[1] + 6]);
    return (
      <Scene2 bg="closeup">
        {/* dış poşet (açık ağızlı) */}
        <OG sh={[{ d: `M${outer[0] - 56} ${outer[1]}Q${outer[0] - 64} ${outer[1] + 80} ${outer[0]} ${outer[1] + 86}Q${outer[0] + 64} ${outer[1] + 80} ${outer[0] + 56} ${outer[1]}Z`, f: '#3a3e48' }]} />
        <path d={ell(outer, 56, 14)} fill="#121418" stroke={K.out} stroke-width={1.5} />
        {/* iç poşet, düğümlü, içeri iniyor */}
        {knotBag(outer[0] + 4, 76)}
        <path d={`M${outer[0] - 56} ${outer[1]}A56 14 0 0 0 ${outer[0] + 56} ${outer[1]}Q${outer[0] + 60} ${outer[1] + 12} ${outer[0] + 54} ${outer[1] + 20}Q${outer[0]} ${outer[1] + 32} ${outer[0] - 54} ${outer[1] + 20}Q${outer[0] - 60} ${outer[1] + 12} ${outer[0] - 56} ${outer[1]}Z`} fill="#3a3e48" stroke={K.out} stroke-width={1.5} />
        <g style={{ filter: GLOVE }}>
          <Hand {...hold} />
          <Hand {...grabL} />
        </g>
        <Arrow from={[outer[0] + 44, 70]} to={[outer[0] + 44, 128]} w={5} />
        {/* kapaklı konteyner */}
        <OG sh={[
          { d: 'M206 112L214 222H302L310 112Z', f: '#4f8a5b' },
          { d: 'M270 112L274 222H302L310 112Z', f: shade('#4f8a5b', 0.14), no: true },
          { d: rrect(198, 98, 120, 16, 4), f: shade('#4f8a5b', 0.2) },
          { d: 'M230 140V200M258 140V200M286 140V200', st: shade('#4f8a5b', 0.3), sw: 2 },
          { d: circ([222, 226], 7), f: '#30333b' },
          { d: circ([294, 226], 7), f: '#30333b' },
        ]} />
        <Arrow from={[166, 186]} to={[214, 140]} w={6} bend={0.2} />
      </Scene2>
    );
  },

  'barinma-dis-cukur': () => {
    const gy = 186;
    const hole: P = [190, 216];
    const digger: PersonProps = { ...AILE.dad, x: 238, y: 224, s: 1, flip: true, pose: { ...POSE.kneelOne, spine: -50, chest: -40, head: -20, legF: [0, 92], armF: { to: [hole[0] + 14, hole[1] - 20] }, armB: { at: 'kneeF', d: [-6, -4] }, handF: 'fist', face: 'calm' } };
    const r = rig(digger);
    const h = r.handF;
    const tip: P = [hole[0] + 4, hole[1] + 2];
    const an = angOf(h, tip);
    const bl = pol(tip, an, 0);
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* sağda yüksek zemin: çadırlar dereden uzakta */}
        <path d={`M200 ${gy + 2}Q236 120 320 112V${gy + 2}Z`} fill="#8fc46a" stroke={K.out} stroke-width={1.5} />
        <Tent x={262} y={128} s={0.42} color={TENT} />
        <Tent x={302} y={122} s={0.36} color={TENT2} />
        {/* solda dere (alçakta) */}
        <path d={`M0 ${gy + 4}H58Q50 ${gy + 30} 44 240H0Z`} fill="#8a6a48" stroke={K.out} stroke-width={1.5} />
        <Water x={0} y={gy + 12} w={48} h={50} />
        <Tree x={84} y={gy - 4} kind="leaf" s={0.6} />
        {/* çukur ve toprak yığını */}
        <path d={ell(hole, 22, 7)} fill="#5c4330" stroke={K.out} stroke-width={1.5} />
        <path d={`M${hole[0] - 46} ${hole[1] + 2}q14 -18 28 0Z`} fill={SOIL} stroke={K.out} stroke-width={1.4} />
        <Person {...digger} />
        {/* küçük kürek: sap elde, ağız çukurda */}
        <path d={`M${f1(h[0])} ${f1(h[1])}L${f1(bl[0])} ${f1(bl[1])}`} stroke="#7b4e2e" stroke-width={4} stroke-linecap="round" />
        <G x={tip[0]} y={tip[1]} a={an - 90}>
          <path d="M-7 -2L7 -2L5 12L0 16L-5 12Z" fill={K.metal} stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
        </G>
        {/* dere ile çukur arası: 30 m */}
        <Dash pts={[[54, gy + 4], [54, 234]]} c={K.ink} w={1.5} dash="3 3" />
        <Dim a={[54, 232]} b={[hole[0] - 22, 232]} />
        <Label x={(54 + hole[0] - 22) / 2} y={214} text="30 m" size={15} />
      </Scene2>
    );
  },

  /* ─────────── ısıtma ─────────── */
  'barinma-elektrikli-isitici': () => {
    const gy = 200;
    const hx = 206; // ısıtıcı ortası
    const sock: P = [272, 168];
    const bedR = 104;
    return (
      <Scene2 bg="indoor" gy={gy} wall="#e7ebee">
        {/* konteyner oluklu duvar */}
        {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 20 + 6} y={0} width={8} height={gy - 9} fill="#dde3e8" />)}
        {/* perde (pencere kapalı) — solda, yatağın üstünde, ısıtıcıdan uzakta */}
        <OG sh={[
          { d: rrect(18, 26, 80, 6, 2), f: '#8d949c' },
          { d: 'M22 32H56V118Q40 124 22 118Z', f: '#9fc4a8' },
          { d: 'M60 32H94V118Q78 124 60 118Z', f: '#9fc4a8' },
          { d: 'M34 34V116M46 34V116M72 34V116M84 34V116', st: shade('#9fc4a8', 0.18), sw: 1.4 },
        ]} />
        {/* yatak + uyku tulumu (solda) */}
        <OG sh={[
          { d: rrect(10, gy - 28, bedR - 10, 30, 5), f: '#c9a77c' },
          { d: rrect(12, gy - 44, bedR - 14, 20, 8), f: '#3d7ad6' },
          { d: rrect(14, gy - 50, 30, 16, 7), f: '#fff' },
          { d: `M50 ${gy - 40}H${bedR - 8}`, st: tint('#3d7ad6', 0.35), sw: 2 },
        ]} />
        {/* duvar prizi ve doğrudan takılı fiş */}
        <OG sh={[{ d: rrect(sock[0] - 14, sock[1] - 14, 28, 28, 5), f: '#fbfaf7' }, { d: circ(sock, 9), f: '#eceae4', ln: true }]} />
        <OG sh={[{ d: rrect(sock[0] - 6, sock[1] - 7, 12, 15, 3), f: '#3b3f4b' }]} />
        <path d={`M${sock[0]} ${sock[1] + 8}Q${sock[0] + 2} ${gy - 4} ${hx + 40} ${gy - 8}`} fill="none" stroke="#3b3f4b" stroke-width={3} stroke-linecap="round" />
        {/* küçük yağlı radyatör tipi ısıtıcı, yere düz */}
        <OG sh={[
          ...Array.from({ length: 5 }, (_, i) => ({ d: rrect(hx - 36 + i * 14, gy - 70, 12, 62, 5), f: i % 2 ? '#f2f2ee' : '#e7e7e2' } as Sh)),
          { d: rrect(hx - 40, gy - 9, 80, 6, 2), f: '#9aa3ad' },
          { d: circ([hx - 34, gy - 3], 4), f: '#30333b' },
          { d: circ([hx + 34, gy - 3], 4), f: '#30333b' },
          { d: rrect(hx - 34, gy - 78, 22, 10, 3), f: '#c9cfd6' },
          { d: circ([hx - 23, gy - 73], 2.5), f: K.danger, ln: true },
        ]} />
        <Heat x={hx} y={gy - 86} n={3} h={24} gap={16} c={K.action} />
        {/* yataktan ısıtıcıya ölçü: 1 m */}
        <Dash pts={[[bedR, gy - 46], [bedR, gy + 18]]} c={K.ink} w={1.5} dash="3 3" />
        <Dash pts={[[hx - 40, gy - 4], [hx - 40, gy + 18]]} c={K.ink} w={1.5} dash="3 3" />
        <Dim a={[bedR, gy + 18]} b={[hx - 40, gy + 18]} />
        <Label x={(bedR + hx - 40) / 2} y={gy - 14} text="1 m" size={16} />
        <Ok x={290} y={44} r={16} />
      </Scene2>
    );
  },

  'barinma-uzatma-yasak': () => {
    const gy = 200;
    const sx = 112, sy = 196;
    const hx = 54;
    const cord = (d: string, c = '#e8e6e0') => (
      <g fill="none" stroke-linecap="round">
        <path d={d} stroke={K.out} stroke-width={7.5} />
        <path d={d} stroke={c} stroke-width={4.5} />
      </g>
    );
    return (
      <Scene2 bg="indoor" gy={gy} wall="#e7ebee">
        {/* duvar prizi (sağda) */}
        <OG sh={[{ d: rrect(282, 128, 26, 26, 5), f: '#fbfaf7' }, { d: circ([295, 141], 8), f: '#eceae4', ln: true }, { d: rrect(289, 134, 12, 14, 3), f: '#f4f3ef' }]} />
        {/* ısıtıcı (solda) */}
        <OG sh={[
          ...Array.from({ length: 5 }, (_, i) => ({ d: rrect(hx - 36 + i * 14, gy - 74, 12, 70, 5), f: i % 2 ? '#f2f2ee' : '#e7e7e2' } as Sh)),
          { d: rrect(hx - 40, gy - 8, 80, 6, 2), f: '#9aa3ad' },
        ]} />
        {/* kablolar: ısıtıcı → çoklu priz → uzatma makarası → duvar */}
        {cord(`M${hx + 30} ${gy - 6}Q${hx + 46} ${gy + 14} ${sx + 18} ${sy + 4}`, '#3b3f4b')}
        {cord(`M${sx + 98} ${sy + 8}Q${sx + 110} ${sy + 22} 214 ${sy + 18}`)}
        {[0, 1, 2].map((i) => <path key={i} d={ell([236, 214 - i * 3], 32 - i * 6, 12 - i * 2.5)} fill="none" stroke={K.out} stroke-width={7.5} />)}
        {[0, 1, 2].map((i) => <path key={'c' + i} d={ell([236, 214 - i * 3], 32 - i * 6, 12 - i * 2.5)} fill="none" stroke="#e8e6e0" stroke-width={4.5} />)}
        {cord(`M262 206Q290 196 295 150`)}
        {/* çoklu priz */}
        <OG sh={[
          { d: rrect(sx, sy - 6, 104, 20, 6), f: '#f4f3ef' },
          ...[0, 1, 2].map((i) => ({ d: rrect(sx + 10 + i * 28, sy - 3, 18, 14, 4), f: i === 0 ? '#3b3f4b' : '#f4f3ef' } as Sh)),
          { d: rrect(sx + 90, sy - 1, 8, 9, 2), f: K.danger },
        ]} />
        {cord(`M${sx + 47} ${sy - 4}Q${sx + 44} ${sy - 30} ${sx + 26} ${sy - 44}`)}
        {cord(`M${sx + 75} ${sy - 4}Q${sx + 80} ${sy - 30} ${sx + 96} ${sy - 46}`, '#3b3f4b')}
        {/* ısınma + yanık izi */}
        <path d={ell([sx + 52, sy + 12], 40, 5)} fill="#5a4636" opacity={0.35} />
        <Heat x={sx + 52} y={sy - 12} n={3} h={26} gap={20} c={K.danger} />
        <Heat x={236} y={198} n={2} h={20} gap={20} c={K.danger} />
        <No x={176} y={166} r={58} />
      </Scene2>
    );
  },

  'barinma-soba-baca-disari': () => {
    const gy = 206;
    const apex: P = [150, 44];
    const right: P = [300, gy];
    const px = 210;
    const roofY = apex[1] + ((px - apex[0]) / (right[0] - apex[0])) * (right[1] - apex[1]);
    return (
      <Scene2 bg="outdoor" gy={gy} ground="snow">
        <Smoke x={px - 20} y={-6} w={74} h={34} kind="cloud" op={0.85} color="#9aa2ab" />
        <Smoke x={px - 4} y={14} w={44} h={22} kind="cloud" op={0.8} color="#a7aeb6" />
        {/* çadır kesiti */}
        <path d={`M20 ${gy}L${apex[0]} ${apex[1]}L${right[0]} ${right[1]}Z`} fill="#fbe8cf" />
        <path d={`M20 ${gy}L${apex[0]} ${apex[1]}L${right[0]} ${right[1]}`} fill="none" stroke={K.out} stroke-width={11} stroke-linejoin="round" />
        <path d={`M20 ${gy}L${apex[0]} ${apex[1]}L${right[0]} ${right[1]}`} fill="none" stroke={TENT2} stroke-width={8} stroke-linejoin="round" />
        {/* yanmaz levha + soba */}
        <OG sh={[{ d: rrect(px - 46, gy - 6, 92, 8, 2), f: '#b5bec8' }]} />
        <OG sh={[
          { d: rrect(px - 30, gy - 62, 60, 48, 4), f: '#3e4450' },
          { d: rrect(px - 26, gy - 16, 6, 12, 1), f: '#30333b' },
          { d: rrect(px + 20, gy - 16, 6, 12, 1), f: '#30333b' },
          { d: rrect(px - 20, gy - 50, 30, 26, 3), f: '#ffb347', ln: true },
          { d: rrect(px - 34, gy - 66, 68, 7, 2), f: '#30333b' },
        ]} />
        <Flame x={px - 5} y={gy - 26} s={0.38} />
        {/* boru */}
        <OG sh={[{ d: rrect(px + 8, 14, 14, gy - 66 - 14, 2), f: '#6d7480' }, { d: rrect(px + 6, 10, 18, 8, 2), f: '#4f555f' }]} />
        {/* metal koruma (çatıda) */}
        <G x={px + 15} y={roofY} a={47}>
          <OG sh={[{ d: rrect(-22, -5, 44, 10, 3), f: '#c9d2da' }, { d: circ([0, 0], 3), f: '#9aa3ad', no: true }]} />
        </G>
        <OG sh={[{ d: rrect(px + 8, roofY - 30, 14, 26, 2), f: '#6d7480' }]} />
        {/* yatak (bağlam) */}
        <OG sh={[{ d: rrect(52, gy - 18, 74, 16, 4), f: '#7aa6d6' }, { d: rrect(56, gy - 26, 24, 10, 4), f: '#fff' }]} />
        <Arrow from={[284, 40]} to={[px + 30, roofY - 8]} w={6} bend={0.2} />
      </Scene2>
    );
  },

  'barinma-soba-mesafe': () => {
    const c: P = [160, 124];
    const R = 64;
    return (
      <Scene2 bg="closeup">
        {/* çadır tabanı (yukarıdan) */}
        <OG sh={[{ d: rrect(10, 10, 300, 220, 10), f: TENT2 }, { d: rrect(20, 20, 280, 200, 6), f: '#e9dcc4' }]} />
        <path d="M10 10L20 20M310 10L300 20M10 230L20 220M310 230L300 220" stroke={K.out} stroke-width={1.5} />
        {/* güvenli çember */}
        <circle cx={c[0]} cy={c[1]} r={R} fill={tint(K.safe, 0.75)} opacity={0.6} />
        <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={K.action} stroke-width={3} stroke-dasharray="8 6" />
        {/* soba yukarıdan */}
        <OG sh={[{ d: rrect(c[0] - 34, c[1] - 30, 68, 60, 4), f: '#b5bec8' }, { d: rrect(c[0] - 24, c[1] - 20, 48, 40, 4), f: '#3e4450' }, { d: circ([c[0] + 10, c[1] - 6], 8), f: '#6d7480' }, { d: circ([c[0] + 10, c[1] - 6], 4), f: '#2a2d33', no: true }]} />
        <Dim a={[c[0] - 24, c[1] + 6]} b={[c[0] - R, c[1] + 6]} ticks={false} />
        <Label x={c[0] - 42} y={c[1] + 24} text="1 m" size={14} bg={K.white} />
        {/* yatak */}
        <OG sh={[{ d: rrect(26, 150, 62, 64, 6), f: '#7aa6d6' }, { d: rrect(30, 154, 54, 16, 6), f: '#fff' }, { d: rrect(26, 176, 62, 38, 6), f: '#c1554b' }]} />
        {/* giysiler */}
        <OG sh={[{ d: 'M236 34L252 28H268L284 34L280 46L272 44V72H248V44L240 46Z', f: '#d9a13a' }]} />
        <OG sh={[{ d: rrect(244, 172, 52, 40, 4), f: '#6c9c5a' }, { d: 'M244 186H296M244 198H296', st: shade('#6c9c5a', 0.25), sw: 1.6 }]} />
        <Backpack x={52} y={34} s={0.9} color="#c0603e" />
      </Scene2>
    );
  },

  'barinma-havalandirma-acik': () => {
    const cx = 160, gy = 206;
    const top: P = [cx, 50];
    return (
      <Scene2 bg="outdoor" gy={gy} ground="snow">
        <SnowFall seed={3} n={22} y1={150} />
        <Tree x={28} y={196} kind="pine" s={0.8} color="#3d7a63" />
        {/* çadır önden (kubbe) */}
        <path d={`M${cx - 120} ${gy + 4}C${cx - 116} ${top[1] + 40} ${cx - 60} ${top[1]} ${cx} ${top[1]}C${cx + 60} ${top[1]} ${cx + 116} ${top[1] + 40} ${cx + 120} ${gy + 4}Z`} fill={TENT2} stroke={K.out} stroke-width={1.6} />
        <path d={`M${cx} ${top[1]}C${cx + 60} ${top[1]} ${cx + 116} ${top[1] + 40} ${cx + 120} ${gy + 4}H${cx + 70}C${cx + 70} ${top[1] + 60} ${cx + 30} ${top[1] + 6} ${cx} ${top[1]}Z`} fill={shade(TENT2, 0.14)} />
        {/* çatıdaki kar */}
        <path d={`M${cx - 88} ${top[1] + 34}C${cx - 60} ${top[1] - 6} ${cx + 60} ${top[1] - 6} ${cx + 88} ${top[1] + 34}C${cx + 60} ${top[1] + 14} ${cx - 60} ${top[1] + 14} ${cx - 88} ${top[1] + 34}Z`} fill={SNOW} stroke={K.out} stroke-width={1.4} />
        {/* üst havalandırma (açık kapak) */}
        <OG sh={[{ d: rrect(cx - 22, top[1] + 30, 44, 18, 4), f: '#203040' }, { d: `M${cx - 26} ${top[1] + 30}L${cx + 26} ${top[1] + 30}L${cx + 20} ${top[1] + 14}H${cx - 20}Z`, f: tint(TENT2, 0.15) }]} />
        {/* kapı: kapalı ama üstte fermuar aralığı */}
        <path d={`M${cx - 44} ${gy + 4}V${top[1] + 90}Q${cx} ${top[1] + 58} ${cx + 44} ${top[1] + 90}V${gy + 4}Z`} fill={tint(TENT2, 0.12)} stroke={K.out} stroke-width={1.6} />
        <path d={`M${cx} ${top[1] + 74}V${gy + 4}`} stroke={K.out} stroke-width={1.6} />
        <path d={`M${cx - 1} ${top[1] + 76}Q${cx - 14} ${top[1] + 100} ${cx - 1} ${top[1] + 116}Q${cx + 14} ${top[1] + 100} ${cx - 1} ${top[1] + 76}Z`} fill="#203040" stroke={K.out} stroke-width={1.4} />
        <rect x={cx - 4} y={top[1] + 114} width={6} height={9} rx={1.5} fill="#e2c35a" stroke={K.out} stroke-width={1.2} />
        <path d={`M${cx} ${top[1] + 124}V${gy}`} stroke={shade(TENT2, 0.4)} stroke-width={1.2} stroke-dasharray="2 2" />
        {/* temiz hava */}
        <AirArrow from={[262, 40]} to={[cx + 22, top[1] + 40]} bend={0.2} />
        <AirArrow from={[290, 130]} to={[cx + 10, top[1] + 98]} bend={-0.2} />
        <AirArrow from={[34, 92]} to={[cx - 14, top[1] + 98]} bend={0.25} />
      </Scene2>
    );
  },

  'barinma-co-alarm': () => {
    const ax = 196, ay = 82;
    const gy = 206;
    return (
      <Scene2 bg="indoor" gy={gy} wall="#efe4d2">
        {/* silik yatak ve yastık (uyku alanı) */}
        <g opacity={0.75}>
          <OG sh={[
            { d: rrect(-6, gy - 46, 250, 40, 8), f: '#c9a77c' },
            { d: rrect(-6, gy - 60, 250, 24, 10), f: '#7aa6d6' },
            { d: rrect(14, gy - 74, 70, 26, 12), f: '#fff' },
            { d: `M96 ${gy - 50}H236`, st: tint('#7aa6d6', 0.35), sw: 2 },
          ]} />
        </g>
        {/* duvara vidalı alarm: baş hizası */}
        <OG sh={[
          { d: rrect(ax - 44, ay - 50, 88, 100, 18), f: '#fbfaf7' },
          { d: rrect(ax - 44, ay + 34, 88, 16, 8), f: '#ecebe6', no: true },
          { d: rrect(ax - 30, ay - 34, 60, 32, 6), f: '#1d2836' },
          ...[0, 1, 2, 3].map((i) => ({ d: circ([ax - 18 + i * 12, ay + 14], 2.2), f: '#c9cfd6', no: true } as Sh)),
          { d: circ([ax, ay + 34], 6), f: K.danger },
          { d: circ([ax - 36, ay - 42], 2.6), f: '#c9cfd6' },
          { d: circ([ax + 36, ay + 42], 2.6), f: '#c9cfd6' },
        ]} />
        <circle cx={ax} cy={ay + 34} r={12} fill={K.danger} opacity={0.25} />
        <text x={ax} y={ay - 10} text-anchor="middle" font-size={22} font-weight={700} fill="#ff6b5e" font-family="'IBM Plex Sans', system-ui, sans-serif">CO</text>
        <Waves x={ax + 50} y={ay} a={0} n={3} r={11} color={K.danger} w={3.4} />
        <Waves x={ax - 50} y={ay} a={180} n={3} r={11} color={K.danger} w={3.4} />
        {/* pil simgesi */}
        <OG sh={[{ d: rrect(ax + 14, ay + 26, 18, 9, 2), f: K.safe }, { d: rrect(ax + 32, ay + 28.5, 3, 4, 1), f: K.safe }]} />
      </Scene2>
    );
  },

  /* ─────────── kış ─────────── */
  'barinma-katmanli-giyim': () => {
    const base: Omit<PersonProps, 'x'> = { ...AILE.dad, y: 230, s: 1.02, sleeve: 'long', bottomC: K.pants.dark, pose: { ...POSE.stand, face: 'calm' } };
    const xs = [54, 160, 266];
    const tops = ['#dfe4ea', '#b04a3a', '#2f6f8f'];
    const collar = (c: string, h = 6) => (r: Rig) => (
      <path d={`M${r.neck[0] - 9} ${r.neck[1] + 1}Q${r.neck[0]} ${r.neck[1] + 8} ${r.neck[0] + 9} ${r.neck[1] + 1}L${r.neck[0] + 7} ${r.neck[1] - h}H${r.neck[0] - 7}Z`} fill={c} stroke={K.out} stroke-width={1.3} />
    );
    const knit = (c: string) => (r: Rig) => (
      <g>
        {collar(tops[0], 4)(r)}
        <path d={`M${r.neck[0] - 9} ${r.neck[1] + 2}Q${r.neck[0]} ${r.neck[1] + 9} ${r.neck[0] + 9} ${r.neck[1] + 2}`} stroke={shade(c, 0.35)} stroke-width={3.6} fill="none" />
        {[-7, 0, 7].map((d) => <path key={d} d={`M${r.neck[0] + d * 1.6} ${r.neck[1] + 16}l-2.5 5l2.5 5l-2.5 5l2.5 5l-2.5 5`} stroke={shade(c, 0.28)} stroke-width={1.4} fill="none" />)}
      </g>
    );
    const coat = (c: string) => (r: Rig) => {
      const l = r.shoulderB[0] + 1, rr = r.shoulderF[0] - 1;
      const ys = [r.neck[1] + 20, r.neck[1] + 36, r.neck[1] + 52];
      return (
        <g>
          {ys.map((y) => <path key={y} d={`M${l} ${y}Q${(l + rr) / 2} ${y + 4} ${rr} ${y}`} stroke={shade(c, 0.32)} stroke-width={1.8} fill="none" />)}
          <path d={`M${r.neck[0]} ${r.neck[1] + 6}V${r.hip[1] + 4}`} stroke="#d8dde3" stroke-width={2.4} />
          {collar(tops[1], 6)(r)}
          <path d={`M${r.neck[0] - 14} ${r.neck[1] + 4}Q${r.neck[0]} ${r.neck[1] + 12} ${r.neck[0] + 14} ${r.neck[1] + 4}L${r.neck[0] + 11} ${r.neck[1] - 8}Q${r.neck[0]} ${r.neck[1] - 2} ${r.neck[0] - 11} ${r.neck[1] - 8}Z`} fill={c} stroke={K.out} stroke-width={1.4} />
        </g>
      );
    };
    const hood = (c: string) => (r: Rig) => <OG sh={[{ d: ell([r.head[0], r.head[1] + 4], r.headR * 1.45, r.headR * 1.35), f: shade(c, 0.12) }]} />;
    return (
      <Scene2 bg="indoor">
        <Person x={xs[0]} {...base} top={tops[0]} />
        <Person x={xs[1]} {...base} top={tops[1]} mid={knit(tops[1])} />
        <Person x={xs[2]} {...base} top={tops[2]} back={hood(tops[2])} mid={coat(tops[2])} />
        <Num x={xs[0]} y={28} n={1} r={12} />
        <Num x={xs[1]} y={28} n={2} r={12} />
        <Num x={xs[2]} y={28} n={3} r={12} />
        <Arrow from={[xs[0] + 22, 28]} to={[xs[1] - 18, 28]} w={4} />
        <Arrow from={[xs[1] + 22, 28]} to={[xs[2] - 18, 28]} w={4} />
      </Scene2>
    );
  },

  'barinma-bere-corap': () => {
    const gy = 200;
    const p: PersonProps = { ...AILE.mom, x: 178, y: gy + 4, s: 1.45, pose: { ...POSE.lieBack, face: 'closed' } };
    const r = rig(p);
    const R = r.headR;
    const beanie = (
      <G x={r.head[0]} y={r.head[1]} a={r.headA + 90}>
        <OG sh={[
          { d: `M${-R * 1.1} ${-R * 0.05}C${-R * 1.12} ${-R * 1.4} ${R * 1.12} ${-R * 1.4} ${R * 1.1} ${-R * 0.05}Z`, f: '#c6574e' },
          { d: rrect(-R * 1.16, -R * 0.42, R * 2.32, R * 0.46, R * 0.16), f: shade('#c6574e', 0.15) },
          { d: circ([0, -R * 1.28], R * 0.32), f: tint('#c6574e', 0.4) },
        ]} />
      </G>
    );
    const x0 = r.neck[0] + 4, x1 = r.ankleF[0] - 6;
    const sock = '#d9a13a';
    return (
      <Scene2 bg="indoor" gy={gy} wall="#e9dcc6">
        <Window x={200} y={30} w={74} h={60} view="night" />
        {/* yer yatağı */}
        <OG sh={[{ d: rrect(8, gy - 2, 304, 16, 6), f: '#4f9fd6' }, { d: rrect(4, gy + 12, 312, 10, 3), f: '#c9a06e' }]} />
        <Person {...p} only={['legB', 'legF', 'torso', 'armB', 'armF', 'head']} />
        {beanie}
        {/* battaniye: boyundan ayak bileğine, düz örtü */}
        <OG sh={[
          { d: `M${x0} ${gy + 4}C${x0 - 4} ${r.chest[1] - 6} ${x0 + 6} ${r.chest[1] - 16} ${x0 + 30} ${r.chest[1] - 16}L${x1 - 16} ${r.kneeF[1] - 12}C${x1 - 2} ${r.kneeF[1] - 10} ${x1 + 4} ${gy - 6} ${x1 + 2} ${gy + 4}Z`, f: '#c1554b' },
          { d: `M${x0 + 26} ${r.chest[1] - 4}L${x1 - 20} ${r.kneeF[1] - 2}`, st: shade('#c1554b', 0.25), sw: 1.8 },
        ]} />
        {/* kuru yün çoraplar */}
        {(['B', 'F'] as const).map((k) => {
          const an = r[`ankle${k}`], to = r[`toe${k}`];
          return <OG key={k} sh={[{ d: capsule([an[0] - 6, an[1] - 2], 8, [to[0] - 1, to[1] + 1], 7), f: k === 'B' ? shade(sock, 0.15) : sock }, { d: `M${an[0] - 2} ${an[1] - 9}v14`, st: shade(sock, 0.35), sw: 2 }]} />;
        })}
      </Scene2>
    );
  },

  'barinma-sicak-icecek': () => {
    const p: PersonProps = { ...AILE.dad, x: 160, y: 70, ax: 'head', ay: 'head', s: 2, sleeve: 'long', pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const nk = r.neck;
    const bl = '#c1554b';
    const mx = 160, my = 178;
    // battaniye başın arkasından omuzlara, önde açık; eller açıklıktan çıkıp kupayı tutuyor
    const wrap = `M${nk[0] - 30} ${nk[1] + 2}C${nk[0] - 16} ${nk[1] - 6} ${nk[0] + 16} ${nk[1] - 6} ${nk[0] + 30} ${nk[1] + 2}C${nk[0] + 70} ${nk[1] + 10} ${nk[0] + 84} ${nk[1] + 30} ${nk[0] + 92} 250H${nk[0] + 16}C${nk[0] + 22} ${my + 20} ${nk[0] + 30} ${my - 10} ${nk[0] + 14} ${nk[1] + 12}L${nk[0]} ${nk[1] + 10}L${nk[0] - 14} ${nk[1] + 12}C${nk[0] - 30} ${my - 10} ${nk[0] - 22} ${my + 20} ${nk[0] - 16} 250H${nk[0] - 92}C${nk[0] - 84} ${nk[1] + 30} ${nk[0] - 70} ${nk[1] + 10} ${nk[0] - 30} ${nk[1] + 2}Z`;
    return (
      <Scene2 bg="indoor" wall="#f0d9b8">
        <OG sh={[
          { d: rrect(18, 24, 84, 60, 4), f: '#b8513f' },
          { d: rrect(24, 30, 72, 48, 3), f: '#d9a13a', no: true },
          { d: 'M60 36L82 54L60 72L38 54Z', f: '#b8513f', no: true },
        ]} />
        <Person {...p} only={['torso', 'head']} />
        <OG sh={[{ d: wrap, f: bl }, { d: `M${nk[0] - 56} ${nk[1] + 30}L${nk[0] - 70} 236M${nk[0] + 56} ${nk[1] + 30}L${nk[0] + 70} 236`, st: shade(bl, 0.25), sw: 2 }]} />
        {/* kupa ve onu saran iki el */}
        <OG sh={[{ d: rrect(mx - 18, my - 22, 36, 40, 5), f: '#3d7ad6' }, { d: rrect(mx - 18, my - 22, 36, 7, 3), f: shade('#3d7ad6', 0.2) }]} />
        <OG sh={[{ d: ell([mx - 21, my + 2], 10, 13), f: K.skin[1] }, { d: ell([mx + 21, my + 2], 10, 13), f: K.skin[1] }]} />
        <Steam x={mx} y={my - 28} n={3} h={24} gap={9} c="#ffffff" w={3} />
      </Scene2>
    );
  },
  'barinma-kar-temizle': () => {
    const gy = 206;
    const apex: P = [232, 58];
    const L: P = [130, gy], Rr: P = [318, gy];
    const sa = angOf(L, apex);
    const nrm = sa - 90; // dışa (sol-yukarı) normal
    const along = (t: number, off = 0): P => pol(lerp(L, apex, t), nrm, off);
    const head = along(0.4, 7);
    const hands: [P, P] = [[124, 146], [110, 160]];
    const p: PersonProps = { ...AILE.dad, x: 72, y: 228, s: 1.02, sleeve: 'long', pose: { ...POSE.standSide, spine: -82, head: -76, armF: { to: hands[0] }, armB: { to: hands[1] }, handF: 'fist', handB: 'fist', face: 'calm' } };
    const beanie = (rr: Rig) => {
      const [hx, hy] = rr.head, R = rr.headR, c = '#c6574e';
      return <OG sh={[{ d: `M${hx - R * 1.08} ${hy - R * 0.1}C${hx - R * 1.1} ${hy - R * 1.3} ${hx + R * 1.1} ${hy - R * 1.3} ${hx + R * 1.08} ${hy - R * 0.1}Z`, f: c }, { d: rrect(hx - R * 1.12, hy - R * 0.44, R * 2.24, R * 0.44, R * 0.15), f: shade(c, 0.15) }]} />;
    };
    const snowPts: P[] = [along(0.46, 0), along(0.46, 12), along(0.7, 16), along(0.98, 16), [apex[0] + 10, apex[1] - 8], [apex[0] + 22, apex[1] + 14], [apex[0] + 12, apex[1] + 12], apex];
    return (
      <Scene2 bg="outdoor" gy={gy} ground="snow">
        <rect width={320} height={gy} fill="#c9d8e4" opacity={0.6} />
        <SnowFall seed={7} n={30} y1={200} />
        {/* çadır */}
        <OG sh={[{ d: `M${L[0]} ${L[1]}L${apex[0]} ${apex[1]}L${Rr[0]} ${Rr[1]}Z`, f: TENT2 }, { d: `M${apex[0]} ${apex[1]}L${Rr[0]} ${Rr[1]}H${apex[0] + 20}Z`, f: shade(TENT2, 0.16), no: true }, { d: `M${apex[0]} ${apex[1]}L${apex[0] - 14} ${gy}H${apex[0] + 18}Z`, f: shade(TENT2, 0.4), ln: true }]} />
        {/* çatıdaki kar */}
        <OG sh={[{ d: 'M' + snowPts.map((q) => `${f1(q[0])} ${f1(q[1])}`).join('L') + 'Z', f: SNOW }]} />
        {/* aşağı kayan kar parçaları ve yığın */}
        <OG sh={[{ d: ell(along(0.3, 9), 9, 6), f: SNOW }, { d: ell(along(0.16, 8), 7, 5), f: SNOW }]} />
        <path d={`M${L[0] - 30} ${gy + 2}Q${L[0] - 12} ${gy - 24} ${L[0] + 10} ${gy - 8}L${L[0] + 18} ${gy + 2}Z`} fill={SNOW} stroke={K.out} stroke-width={1.4} />
        {/* süpürge */}
        <path d={`M${hands[1][0] - 10} ${hands[1][1] + 6}L${head[0]} ${head[1]}`} stroke="#9a6b44" stroke-width={5} stroke-linecap="round" />
        <G x={head[0]} y={head[1]} a={sa}>
          <OG sh={[{ d: rrect(-4, -8, 24, 12, 2), f: '#d9a13a' }, { d: rrect(-4, 4, 24, 8, 1), f: '#e8c879' }]} />
        </G>
        <Person {...p} over={beanie} />
        <Arrow from={along(0.95, 34)} to={along(0.5, 34)} w={6} />
      </Scene2>
    );
  },

  'barinma-el-dezenfektan': () => {
    const bx = 84, by = 216;
    const nozzle: P = [bx + 66, 66];
    const palm: P = [nozzle[0] + 4, 128];
    const palmH = handAt({ a: -62, s: 1.0, pose: 'open', side: 'L', view: 'palm', skin: 1, arm: 200, sleeve: K.role.helper }, 'palm', palm);
    const cid = 'brn-rub';
    return (
      <Scene2 bg="closeup">
        {/* şişe */}
        <OG sh={[
          { d: rrect(bx - 38, by - 124, 76, 124, 12), f: '#cfe8f3' },
          { d: rrect(bx - 38, by - 70, 76, 70, 12), f: '#a9d3e8', no: true },
          { d: rrect(bx - 30, by - 104, 60, 50, 4), f: '#fbfaf7' },
          { d: rrect(bx - 12, by - 140, 24, 18, 3), f: '#e6e8eb' },
          { d: rrect(bx - 4, by - 156, 8, 18, 2), f: '#c9cfd6' },
          { d: `M${bx - 14} ${by - 162}H${nozzle[0]}V${nozzle[1] + 8}H${bx - 14}Z`, f: '#e6e8eb' },
        ]} />
        <text x={bx} y={by - 70} text-anchor="middle" font-size={19} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">%60+</text>
        <path d={`M${bx - 20} ${by - 92}H${bx + 20}`} stroke={K.water} stroke-width={4} stroke-linecap="round" />
        {/* jel damlası */}
        <path d={`M${nozzle[0] - 4} ${nozzle[1] + 10}C${nozzle[0] - 2} ${nozzle[1] + 20} ${nozzle[0] + 6} ${nozzle[1] + 26} ${nozzle[0] + 1} ${nozzle[1] + 34}A6.5 6.5 0 0 1 ${nozzle[0] - 9} ${nozzle[1] + 30}C${nozzle[0] - 9} ${nozzle[1] + 22} ${nozzle[0] - 6} ${nozzle[1] + 18} ${nozzle[0] - 4} ${nozzle[1] + 10}Z`} fill="#dff3fb" stroke={K.out} stroke-width={1.4} />
        <Hand {...palmH} />
        <path d={ell([palm[0] + 2, palm[1] - 2], 9, 5)} fill="#dff3fb" stroke={K.out} stroke-width={1.2} />
        {/* ovuşturma (ek kare) */}
        <defs><clipPath id={cid}><circle cx={258} cy={62} r={50} /></clipPath></defs>
        <circle cx={258} cy={62} r={50} fill="#fff" />
        <g clip-path={`url(#${cid})`}>
          <Hand x={246} y={112} a={6} s={0.72} pose="press" side="L" view="palm" skin={1} arm={60} sleeve={K.role.helper} />
          <Hand x={270} y={112} a={-6} s={0.72} pose="press" side="R" view="back" skin={1} arm={60} sleeve={K.role.helper} />
        </g>
        <circle cx={258} cy={62} r={50} fill="none" stroke={K.out} stroke-width={2} />
        <Arrow from={[214, 48]} to={[224, 26]} w={3.6} bend={0.3} />
        <Arrow from={[302, 48]} to={[292, 26]} w={3.6} bend={-0.3} />
      </Scene2>
    );
  },

  'barinma-dis-fircalama': () => {
    const gy = 204;
    const cup: P = [168, 140];
    const kid: PersonProps = { ...AILE.boy, x: 112, y: 226, s: 1.05, pose: { ...POSE.standSide, head: -84, armF: { to: cup }, armB: { at: 'mouth', d: [6, 4] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const kr = rig(kid);
    const mouth = kr.mouth;
    const bottleBase: P = [206, 102];
    const adult: PersonProps = { ...AILE.mom, x: 252, y: 226, s: 1, flip: true, pose: { ...POSE.standSide, armF: { to: [bottleBase[0] + 10, bottleBase[1] - 2] }, armB: { to: [bottleBase[0] + 20, bottleBase[1] - 18] }, handF: 'fist', handB: 'fist', face: 'calm' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Tent x={50} y={196} s={0.7} color={TENT} />
        {/* kamp lavabosu */}
        <OG sh={[{ d: rrect(120, 170, 112, 8, 2), f: '#b5bec8' }, { d: 'M126 170L134 152H218L226 170Z', f: '#dfe5ea' }, { d: rrect(130, 178, 6, 34, 1), f: '#8d949c' }, { d: rrect(216, 178, 6, 34, 1), f: '#8d949c' }]} />
        <Person {...adult} />
        <Person {...kid} />
        {/* diş fırçası */}
        <path d={`M${kr.handB[0] - 2} ${kr.handB[1] + 4}L${mouth[0] + 3} ${mouth[1]}`} stroke="#3d7ad6" stroke-width={4} stroke-linecap="round" />
        <rect x={mouth[0] - 2} y={mouth[1] - 3} width={7} height={5} rx={1} fill="#fff" stroke={K.out} stroke-width={1} />
        {/* bardak */}
        <OG sh={[{ d: `M${cup[0] - 8} ${cup[1] - 14}H${cup[0] + 8}L${cup[0] + 6} ${cup[1] + 6}H${cup[0] - 6}Z`, f: '#f2c14e' }]} />
        {/* şişe dökülüyor */}
        <Bottle x={bottleBase[0] + 14} y={bottleBase[1] - 8} a={-128} s={0.9} fill={0.5} />
        <path d={`M${bottleBase[0] - 22} ${bottleBase[1] + 4}Q${cup[0] + 4} ${cup[1] - 30} ${cup[0] + 2} ${cup[1] - 14}`} fill="none" stroke={K.water} stroke-width={4} stroke-linecap="round" />
      </Scene2>
    );
  },

  'barinma-dirsek-oksurme': () => {
    const base: PersonProps = { ...AILE.dad, x: 140, y: 100, ax: 'head', ay: 'head', s: 2.1, sleeve: 'long', pose: { ...POSE.standSide, head: -80, chest: -88, face: 'closed' } };
    const r0 = rig(base);
    const target: P = [r0.mouth[0] + 12, r0.mouth[1] + 9];
    const up = angOf(r0.shoulderF, target);
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: [up, -178], handF: 'fist' } };
    const r = rig(p);
    const drops: P[] = [[r.elbowF[0] + 14, r.elbowF[1] - 10], [r.elbowF[0] + 20, r.elbowF[1]], [r.elbowF[0] + 14, r.elbowF[1] + 10]];
    return (
      <Scene2 bg="indoor">
        <Window x={234} y={40} w={64} h={56} />
        <Person {...p} />
        <g fill={K.waterLight} stroke={K.out} stroke-width={1}>
          {drops.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} />)}
        </g>
        <path d={`M${r.elbowF[0] + 30} ${r.elbowF[1] - 18}l8 -6M${r.elbowF[0] + 34} ${r.elbowF[1]}h10M${r.elbowF[0] + 30} ${r.elbowF[1] + 18}l8 6`} stroke={K.ink} stroke-width={2.4} stroke-linecap="round" opacity={0.6} />
      </Scene2>
    );
  },

  'barinma-cop-kapakli': () => {
    const gy = 200;
    const bagHand: P = [176, 176];
    const walker: PersonProps = { ...AILE.mom, x: 156, y: 224, s: 0.95, pose: { ...POSE.walk, armF: { to: bagHand }, handF: 'fist', face: 'calm' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* çadır, kapısı açık */}
        <OG sh={[{ d: `M2 ${gy + 8}L58 70L118 ${gy + 8}Z`, f: TENT }, { d: `M58 70L118 ${gy + 8}H88Z`, f: shade(TENT, 0.16), no: true }, { d: `M34 ${gy + 8}L58 112L82 ${gy + 8}Z`, f: '#5a3826' }]} />
        {/* içeride kapalı kaplar */}
        <OG sh={[{ d: rrect(44, gy - 14, 26, 20, 3), f: '#f4f1ea' }, { d: rrect(42, gy - 18, 30, 6, 2), f: K.safe }, { d: rrect(50, gy - 32, 18, 14, 3), f: '#f4f1ea' }, { d: rrect(48, gy - 35, 22, 5, 2), f: K.water }]} />
        {/* pedallı çöp kovası */}
        <OG sh={[{ d: 'M112 214L108 166H140L136 214Z', f: '#9aa3ad' }, { d: 'M106 166Q124 154 142 166Z', f: '#7d8792' }, { d: rrect(116, 212, 16, 5, 1.5), f: '#3b3f4b' }]} />
        {/* kişi + bağlı poşet */}
        <Person {...walker} over={(r) => (
          <OG sh={[
            { d: `M${r.handF[0] - 14} ${r.handF[1] + 12}Q${r.handF[0] - 16} ${r.handF[1] + 40} ${r.handF[0]} ${r.handF[1] + 42}Q${r.handF[0] + 16} ${r.handF[1] + 40} ${r.handF[0] + 14} ${r.handF[1] + 12}Q${r.handF[0] + 6} ${r.handF[1] + 4} ${r.handF[0]} ${r.handF[1] + 4}Q${r.handF[0] - 6} ${r.handF[1] + 4} ${r.handF[0] - 14} ${r.handF[1] + 12}Z`, f: BAG },
            { d: ell([r.handF[0], r.handF[1] + 2], 4, 4), f: '#3c4049' },
          ]} />
        )} />
        {/* kamp konteyneri */}
        <OG sh={[
          { d: 'M236 120L242 214H312L318 120Z', f: '#4f8a5b' },
          { d: rrect(230, 108, 92, 14, 4), f: shade('#4f8a5b', 0.2) },
          { d: 'M258 140V196M282 140V196', st: shade('#4f8a5b', 0.3), sw: 2 },
          { d: circ([250, 218], 6), f: '#30333b' },
          { d: circ([304, 218], 6), f: '#30333b' },
        ]} />
        <Arrow from={[196, 120]} to={[236, 112]} w={6} bend={0.25} />
      </Scene2>
    );
  },

  /* ─────────── evde sıcak kalma ─────────── */
  'barinma-tek-oda': () => {
    const gy = 212, top = 84;
    const rooms: [number, number][] = [[24, 100], [100, 220], [220, 296]];
    const grey = '#b9bcc2';
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#2a3348" />
        <SnowFall seed={5} n={20} y1={230} />
        {/* çatı */}
        <OG sh={[{ d: `M10 ${top + 4}L160 18L310 ${top + 4}Z`, f: '#8a4a3a' }, { d: rrect(18, top - 2, 284, 8, 1), f: '#6e3a2e' }]} />
        {/* dış duvar */}
        <OG sh={[{ d: rrect(18, top + 4, 284, gy - top + 6, 1), f: '#7c7f86' }]} />
        {/* odalar */}
        <rect x={rooms[0][0]} y={top + 10} width={rooms[0][1] - rooms[0][0]} height={gy - top - 10} fill={grey} />
        <rect x={rooms[2][0]} y={top + 10} width={rooms[2][1] - rooms[2][0]} height={gy - top - 10} fill={grey} />
        <rect x={rooms[1][0]} y={top + 10} width={rooms[1][1] - rooms[1][0]} height={gy - top - 10} fill="#ffd27a" />
        <circle cx={160} cy={160} r={50} fill="#ffe7a6" opacity={0.6} />
        {/* gri eşyalar */}
        <OG sh={[{ d: rrect(30, gy - 26, 60, 26, 3), f: '#a3a7ae' }, { d: rrect(32, gy - 34, 22, 10, 4), f: '#c7cacf' }, { d: rrect(232, gy - 40, 30, 40, 2), f: '#a3a7ae' }, { d: rrect(266, gy - 66, 24, 66, 2), f: '#a3a7ae' }]} />
        {/* iç duvarlar + kapalı kapılar */}
        {[100, 220].map((x) => (
          <g key={x}>
            <OG sh={[{ d: rrect(x - 5, top + 10, 10, gy - top - 10, 0), f: '#7c7f86' }, { d: rrect(x - 5, gy - 74, 10, 74, 1), f: '#8a6a52' }, { d: circ([x, gy - 38], 2), f: '#e2c35a', ln: true }]} />
          </g>
        ))}
        
        
        {/* aile battaniye altında */}
        <Huddle x={160} y={gy} s={0.56} n={3} />
        {/* zemin */}
        <rect x={18} y={gy} width={284} height={8} fill="#5d5f66" stroke={K.out} stroke-width={1.4} />
        <rect x={0} y={gy + 8} width={320} height={40} fill="#e9eef3" />
        {/* soğuk / sıcak işaretleri */}
        <Flake x={62} y={top + 44} r={13} />
        <Flake x={258} y={top + 44} r={13} />
      </Scene2>
    );
  },

  'barinma-cam-naylon': () => {
    const wx = 52, wy = 32, ww = 164, wh = 146;
    const tl = handAt({ a: 80, s: 0.75, pose: 'press', side: 'R', skin: 1, arm: 200, sleeve: AILE.mom.top }, 'tip', [wx - 12, wy + 96]);
    return (
      <Scene2 bg="indoor" gy={214}>
        <Window x={wx} y={wy} w={ww} h={wh} view="day" />
        {/* naylon örtü */}
        <path d={`M${wx - 14} ${wy - 12}H${wx + ww + 14}V${wy + wh + 14}H${wx - 14}Z`} fill="#cfe3f3" opacity={0.75} stroke="#6f8fab" stroke-width={2} />
        <path d={`M${wx + 20} ${wy + 30}l30 40M${wx + 110} ${wy + 20}l40 60M${wx + 60} ${wy + 110}l24 34`} stroke="#fff" stroke-width={3} opacity={0.8} stroke-linecap="round" />
        {/* bantlar (kenarlar) */}
        <g fill="#9aa3ad" stroke={K.out} stroke-width={1.5}>
          <rect x={wx - 20} y={wy - 18} width={ww + 40} height={13} rx={1} />
          <rect x={wx - 20} y={wy + wh + 8} width={ww + 40} height={13} rx={1} />
          <rect x={wx - 20} y={wy - 18} width={13} height={wh + 39} rx={1} />
          <rect x={wx + ww + 7} y={wy - 18} width={13} height={wh * 0.55} rx={1} />
        </g>
        {/* bant rulosu: sağ kenar yapıştırılıyor */}
        <path d={`M${wx + ww + 13} ${wy - 18 + wh * 0.55}V${wy + wh * 0.72}`} stroke="#9aa3ad" stroke-width={11} />
        <OG sh={[{ d: circ([wx + ww + 13, wy + wh * 0.72 + 14], 16), f: '#9aa3ad' }, { d: circ([wx + ww + 13, wy + wh * 0.72 + 14], 7), f: '#e9e3d4' }]} />
        <Hand {...tl} />
        {/* kapı ve altına rulo havlu */}
        <Door x={244} y={214} w={74} h={176} />
        <OG sh={[{ d: capsule([238, 207], 8, [322, 207], 8), f: '#e07a8a' }, { d: 'M252 200V214M270 200V214M288 200V214M306 200V214', st: shade('#e07a8a', 0.25), sw: 1.4 }]} />
        
        
        
      </Scene2>
    );
  },

  'barinma-birlikte-battaniye': () => (
    <Scene2 bg="indoor" gy={170} wall="#e6dccb">
      <Window x={236} y={34} w={62} h={54} view="night" />
      {/* karton + minder */}
      <OG sh={[{ d: 'M14 236L40 194H284L310 236Z', f: '#c9a06e' }, { d: 'M34 222L54 188H268L288 222Z', f: '#4f9fd6' }]} />
      <Huddle x={160} y={214} s={1.12} n={4} />
    </Scene2>
  ),

  'barinma-folyo-battaniye': () => {
    const p: PersonProps = { ...AILE.mom, x: 160, y: 232, s: 1.25, sleeve: 'long', pose: { ...POSE.stand, armB: { at: 'chest', d: [-4, 8] }, armF: { at: 'chest', d: [4, 10] }, handB: 'fist', handF: 'fist', face: 'calm' } };
    const r = rig(p);
    const nk = r.neck;
    const foil = '#c9d2da';
    const wrapPts: P[] = [
      [nk[0] - 14, nk[1] - 2], [nk[0] - 34, nk[1] + 6], [nk[0] - 42, nk[1] + 50], [nk[0] - 44, nk[1] + 120], [nk[0] - 30, nk[1] + 128],
      [nk[0] + 30, nk[1] + 128], [nk[0] + 44, nk[1] + 120], [nk[0] + 42, nk[1] + 50], [nk[0] + 34, nk[1] + 6], [nk[0] + 14, nk[1] - 2], [nk[0], nk[1] + 6],
    ];
    const curl = (x: number, y: number, dir: 1 | -1) => <Arrow from={[x, y]} to={[x - dir * 16, y + 10]} bend={dir * 0.7} w={3.2} />;
    return (
      <Scene2 bg="outdoor" ground="snow">
        <SnowFall seed={11} n={18} y1={180} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head']} />
        <OG sh={[
          { d: smooth(wrapPts, true, 0.7), f: foil },
          { d: `M${nk[0] - 30} ${nk[1] + 30}l10 14l-6 18l12 22M${nk[0] + 26} ${nk[1] + 26}l-8 20l10 16l-6 26`, st: '#fff', sw: 2.2 },
          { d: `M${nk[0] - 10} ${nk[1] + 60}l8 10l-4 20`, st: '#a7b2bd', sw: 1.6 },
        ]} />
        {/* eller folyoyu göğüste tutuyor */}
        <OG sh={[{ d: circ([nk[0] - 6, nk[1] + 22], 6), f: K.skin[0] }, { d: circ([nk[0] + 7, nk[1] + 26], 6), f: K.skin[0] }]} />
        <path d={`M${nk[0] - 2} ${nk[1] + 6}L${nk[0] + 2} ${nk[1] + 120}`} stroke={shade(foil, 0.25)} stroke-width={1.6} />
        
        {curl(nk[0] - 54, nk[1] + 44, -1)}
        {curl(nk[0] + 54, nk[1] + 44, 1)}
        {curl(nk[0] - 54, nk[1] + 96, -1)}
        {curl(nk[0] + 54, nk[1] + 96, 1)}
        
      </Scene2>
    );
  },

};
