// Deprem kategorisi — sahneler: deprem anı, sonrası, enkaz, kurtarma, kalabalık alan, hasarlı bina,
// çocuklar, yüksek bina.
import type { ComponentChildren, JSX } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Bed, Car, Door, Flashlight, Hand, K, Label, No, OG, Ok, Person, POSE, Phone, Scene2, Shake, Sign, Table,
  Tree, Waves, Whistle, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { P, PersonProps, Pose, Rig, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);
const poly = (pts: P[]) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';

const CONC = '#bdb7ab';
const CONC_D = '#a39d91';
const DUST = '#cfc6b4';
const HELMET = '#f2c230';
const GLOVE = '#d99a3a';
const BOOT = '#5b4332';

/** Deterministik sözde rastgele */
function rnd(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Vurgu halkası */
function Ring({ x, y, r, c = K.action, w = 3.4 }: { x: number; y: number; r: number; c?: string; w?: number }) {
  return (
    <g fill="none">
      <circle cx={x} cy={y} r={r} stroke="#fff" stroke-width={w + 3} opacity={0.75} />
      <circle cx={x} cy={y} r={r} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Kesikli çizgi */
function Dash({ pts, c = K.action, w = 3, dash = '7 6' }: { pts: P[]; c?: string; w?: number; dash?: string }) {
  return <path d={'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')} fill="none" stroke={c} stroke-width={w} stroke-dasharray={dash} stroke-linecap="round" />;
}

/** Kesikli çift yönlü mesafe oku */
function Span({ a, b, c = K.action }: { a: P; b: P; c?: string }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  const head = (p: P, d: number) => {
    const q1 = pol(p, d + 150, 13), q2 = pol(p, d - 150, 13);
    return `M${f1(q1[0])} ${f1(q1[1])}L${f1(p[0])} ${f1(p[1])}L${f1(q2[0])} ${f1(q2[1])}`;
  };
  const a2 = pol(a, ang, 4), b2 = pol(b, ang, -4);
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={`M${f1(a2[0])} ${f1(a2[1])}L${f1(b2[0])} ${f1(b2[1])}`} stroke="#fff" stroke-width={7} opacity={0.7} />
      <path d={head(a, ang + 180) + head(b, ang)} stroke={K.out} stroke-width={7.5} />
      <path d={`M${f1(a2[0])} ${f1(a2[1])}L${f1(b2[0])} ${f1(b2[1])}`} stroke={c} stroke-width={4} stroke-dasharray="9 7" />
      <path d={head(a, ang + 180) + head(b, ang)} stroke={c} stroke-width={4.5} />
    </g>
  );
}

/** Beton parçası (düzensiz çokgen). MERKEZ x,y */
function Chunk({ x, y, w = 30, h = 18, a = 0, c = CONC, seed = 1 }: { x: number; y: number; w?: number; h?: number; a?: number; c?: string; seed?: number }) {
  const r = rnd(seed);
  const pts: P[] = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 360 + r() * 30;
    const k = 0.78 + r() * 0.3;
    pts.push([Math.cos(t * R) * (w / 2) * k, Math.sin(t * R) * (h / 2) * k]);
  }
  const top = pts.filter((p) => p[1] < 0.2 * h);
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: poly(pts), f: c }, { d: poly([[0, 0], ...pts.slice(0, 3)]), f: shade(c, 0.12), no: true }]} />
      {top.length > 2 && <path d={`M${f1(-w * 0.2)} ${f1(-h * 0.05)}l${f1(w * 0.18)} ${f1(h * 0.12)}`} stroke={shade(c, 0.3)} stroke-width={1.1} />}
    </G>
  );
}

/** Beton döşeme (eğik levha). Uç noktaları a,b; kalınlık t */
function Slab({ a, b, t = 14, c = CONC, rebar = true }: { a: P; b: P; t?: number; c?: string; rebar?: boolean }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  const a1 = pol(a, ang + 90, t), b1 = pol(b, ang + 90, t);
  const bj: P[] = [b, pol(lerpP(b, b1, 0.35), ang, 5), pol(lerpP(b, b1, 0.7), ang, -3), b1];
  const sh: Sh[] = [
    { d: poly([a, ...bj, a1]), f: c },
    { d: poly([lerpP(a, a1, 0.62), lerpP(b, b1, 0.62), b1, a1]), f: shade(c, 0.14), no: true },
  ];
  return (
    <g>
      <OG sh={sh} />
      {rebar && (
        <g stroke="#7d5a43" stroke-width={2} stroke-linecap="round" fill="none">
          <path d={`M${f1(pol(lerpP(b, b1, 0.35), ang, 3)[0])} ${f1(pol(lerpP(b, b1, 0.35), ang, 3)[1])}q8 -2 12 6`} />
          <path d={`M${f1(pol(lerpP(b, b1, 0.7), ang, -2)[0])} ${f1(pol(lerpP(b, b1, 0.7), ang, -2)[1])}q9 3 10 10`} />
        </g>
      )}
    </g>
  );
}
function lerpP(a: P, b: P, t: number): P {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Enkaz yığını: x1..x2 arası, y = taban, h = yükseklik */
function Rubble({ x1, x2, y, h = 50, seed = 3, c = CONC }: { x1: number; x2: number; y: number; h?: number; seed?: number; c?: string }) {
  const r = rnd(seed);
  const w = x2 - x1;
  const outline: P[] = [[x1, y]];
  const n = 7;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const hh = h * Math.sin(t * Math.PI) * (0.75 + r() * 0.35);
    outline.push([x1 + w * t, y - hh]);
  }
  outline.push([x2, y]);
  const chunks: JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    const t = 0.1 + r() * 0.8;
    const hh = h * Math.sin(t * Math.PI) * 0.8;
    chunks.push(<Chunk key={i} x={x1 + w * t} y={y - hh * (0.35 + r() * 0.6)} w={16 + r() * 22} h={10 + r() * 10} a={r() * 60 - 30} seed={seed * 10 + i} c={i % 3 ? c : CONC_D} />);
  }
  return (
    <g>
      <OG sh={[{ d: smooth(outline, true, 0.5), f: shade(c, 0.18) }]} />
      {chunks}
      <g stroke="#7d5a43" stroke-width={2} stroke-linecap="round" fill="none">
        <path d={`M${x1 + w * 0.3} ${y - h * 0.7}l-6 -14l4 -6`} />
        <path d={`M${x1 + w * 0.68} ${y - h * 0.62}l8 -12`} />
      </g>
    </g>
  );
}

/** Toz zerrecikleri */
function DustMotes({ x, y, w, h, n = 18, seed = 7 }: { x: number; y: number; w: number; h: number; n?: number; seed?: number }) {
  const r = rnd(seed);
  return (
    <g fill={DUST} opacity={0.85}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={f1(x + r() * w)} cy={f1(y + r() * h)} r={f1(1.2 + r() * 2.2)} />
      ))}
    </g>
  );
}

/** Kask (başın üstüne; rig ile) */
function Helmet({ r, c = HELMET }: { r: Rig; c?: string }) {
  const H = r.headR;
  const front = Math.abs(((r.headA % 360) + 360) % 360 - 270) < 1 && false;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})${r.flip ? ' scale(-1 1)' : ''}`;
  void front;
  return (
    <g transform={t}>
      <OG
        ow={1.4}
        sh={[
          { d: `M${f1(-1.08 * H)} ${f1(-0.18 * H)}C${f1(-1.1 * H)} ${f1(-1.35 * H)} ${f1(1.1 * H)} ${f1(-1.35 * H)} ${f1(1.08 * H)} ${f1(-0.18 * H)}Z`, f: c },
          { d: rrect(-1.2 * H, -0.3 * H, 2.62 * H, 0.26 * H, 0.12 * H), f: shade(c, 0.12) },
          { d: `M${f1(-0.1 * H)} ${f1(-1.08 * H)}V${f1(-0.3 * H)}`, st: shade(c, 0.25), sw: 2 },
        ]}
      />
    </g>
  );
}
/** Önden kask (simetrik) */
function HelmetFront({ r, c = HELMET }: { r: Rig; c?: string }) {
  const H = r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])})`;
  return (
    <g transform={t}>
      <OG
        ow={1.4}
        sh={[
          { d: `M${f1(-1.1 * H)} ${f1(-0.25 * H)}C${f1(-1.12 * H)} ${f1(-1.45 * H)} ${f1(1.12 * H)} ${f1(-1.45 * H)} ${f1(1.1 * H)} ${f1(-0.25 * H)}Z`, f: c },
          { d: rrect(-1.3 * H, -0.4 * H, 2.6 * H, 0.26 * H, 0.12 * H), f: shade(c, 0.12) },
          { d: `M0 ${f1(-1.15 * H)}V${f1(-0.4 * H)}`, st: shade(c, 0.25), sw: 2.4 },
        ]}
      />
    </g>
  );
}
/** Önden toz maskesi */
function MaskFront({ r }: { r: Rig }) {
  const H = r.headR;
  const m = r.mouth;
  return (
    <g>
      <path d={`M${f1(m[0] - 0.62 * H)} ${f1(m[1] - 0.25 * H)}L${f1(m[0] - 1.0 * H)} ${f1(m[1] - 0.6 * H)}M${f1(m[0] + 0.62 * H)} ${f1(m[1] - 0.25 * H)}L${f1(m[0] + 1.0 * H)} ${f1(m[1] - 0.6 * H)}`} stroke="#e8e8e8" stroke-width={2.2} />
      <OG sh={[{ d: smooth([[m[0] - 0.66 * H, m[1] - 0.42 * H], [m[0], m[1] - 0.62 * H], [m[0] + 0.66 * H, m[1] - 0.42 * H], [m[0] + 0.5 * H, m[1] + 0.32 * H], [m[0], m[1] + 0.48 * H], [m[0] - 0.5 * H, m[1] + 0.32 * H]], true, 0.8), f: '#f6f6f2' }]} />
      <path d={`M${f1(m[0])} ${f1(m[1] - 0.55 * H)}V${f1(m[1] + 0.42 * H)}`} stroke="#c9c9c2" stroke-width={1.3} />
    </g>
  );
}
/** Yandan toz maskesi */
function MaskSide({ r }: { r: Rig }) {
  const H = r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})${r.flip ? ' scale(-1 1)' : ''}`;
  return (
    <g transform={t}>
      <path d={`M${f1(0.55 * H)} ${f1(0.25 * H)}L${f1(-0.6 * H)} ${f1(-0.05 * H)}`} stroke="#e8e8e8" stroke-width={2} />
      <OG sh={[{ d: smooth([[0.55 * H, 0.05 * H], [1.15 * H, 0.18 * H], [1.05 * H, 0.75 * H], [0.6 * H, 0.95 * H]], true, 0.8), f: '#f6f6f2' }]} />
    </g>
  );
}
/** Eldiven (tam boy figürde, el noktasında) */
function Glove({ p, s = 1 }: { p: P; s?: number }) {
  return <OG sh={[{ d: circ(p, 5.6 * s), f: GLOVE }, { d: ell([p[0] + 1.5 * s, p[1] + 1.5 * s], 3 * s, 2.4 * s), f: shade(GLOVE, 0.14), no: true }]} />;
}
/** Bot konçu (bilek üstü) */
function BootShaft({ p, s = 1, front }: { p: P; s?: number; front?: boolean }) {
  const w = (front ? 11 : 12) * s;
  return <OG sh={[{ d: rrect(p[0] - w / 2 + (front ? 0 : 1 * s), p[1] - 14 * s, w, 15 * s, 2.5 * s), f: BOOT }]} />;
}
/** Yansıtıcı yelek şeritleri (yandan; gövde üstüne) */
function VestStripes({ r }: { r: Rig }) {
  const a = r.chest, b = r.back;
  const y1 = lerpP(r.hip, r.neck, 0.35), y2 = lerpP(r.hip, r.neck, 0.6);
  const off = (p: P, q: P): [P, P] => [lerpP(p, a, 0) as P, q];
  void off;
  const dx = (a[0] - b[0]) * 0.5;
  return (
    <g stroke="#f4f1ea" stroke-width={2.6} opacity={0.95}>
      <path d={`M${f1(y1[0] - dx * 0.9)} ${f1(y1[1])}L${f1(y1[0] + dx * 0.9)} ${f1(y1[1])}`} />
      <path d={`M${f1(y2[0] - dx * 0.9)} ${f1(y2[1])}L${f1(y2[0] + dx * 0.9)} ${f1(y2[1])}`} />
    </g>
  );
}

/** Tavandan sarkan sallanan avize. x = askı noktası (tavan y=0), a = sallanma açısı */
function Chandelier({ x, len = 52, a = 14 }: { x: number; len?: number; a?: number }) {
  return (
    <g>
      <g transform={`rotate(${a} ${x} 0)`}>
        <path d={`M${x} 0V${len}`} stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: `M${x - 22} ${len + 18}Q${x} ${len - 6} ${x + 22} ${len + 18}Z`, f: '#f0c75e' }, { d: ell([x, len + 19], 22, 3.5), f: shade('#f0c75e', 0.18) }, { d: circ([x, len + 24], 4.5), f: '#fff3b0' }]} />
      </g>
      <g fill="none" stroke={K.ink} stroke-width={2.2} stroke-linecap="round" opacity={0.65}>
        <path d={`M${x - 34} ${len + 2}q-6 10 -2 22`} />
        <path d={`M${x - 42} ${len - 4}q-6 12 -2 26`} />
        <path d={`M${x + 38} ${len + 4}q6 10 2 22`} />
      </g>
    </g>
  );
}

/** Koltuk (yan görünüş). x = SOL, y = zemin */
function Sofa({ x, y, w = 96, c = '#6d8fb3' }: { x: number; y: number; w?: number; c?: string }) {
  return (
    <OG
      sh={[
        { d: rrect(x, y - 66, 18, 60, 6), f: shade(c, 0.12) },
        { d: rrect(x + 6, y - 34, w - 6, 26, 6), f: c },
        { d: rrect(x + w - 16, y - 46, 16, 38, 6), f: c },
        { d: rrect(x + 10, y - 10, 6, 10, 1), f: K.wood },
        { d: rrect(x + w - 14, y - 10, 6, 10, 1), f: K.wood },
      ]}
    />
  );
}

/** Yerde düşmüş eşyalar: kitap, çerçeve, kırık vazo */
function FloorMess({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-40, -8, 26, 8, 1.5), f: '#c6574e' },
          { d: rrect(-36, -15, 22, 7, 1.5), f: '#4f7fb0' },
          { d: poly([[4, 0], [30, -4], [32, -22], [8, -20]]), f: '#d9c4a0' },
          { d: poly([[9, -3], [27, -6], [28, -18], [11, -17]]), f: '#bfe3f5', ln: true },
          { d: poly([[44, 0], [50, -12], [58, -10], [56, 0]]), f: '#7aa6d6' },
          { d: poly([[60, 0], [64, -7], [70, -2]]), f: '#7aa6d6' },
          { d: poly([[72, 0], [75, -5], [80, 0]]), f: '#7aa6d6' },
        ]}
      />
    </G>
  );
}

/** Cam kırıkları (yerde) */
function Shards({ x, y, w = 120, seed = 5 }: { x: number; y: number; w?: number; seed?: number }) {
  const r = rnd(seed);
  const sh: Sh[] = [];
  for (let i = 0; i < 9; i++) {
    const cx = x + r() * w, sz = 5 + r() * 9;
    const cy = y - r() * 8;
    sh.push({ d: poly([[cx - sz, cy + 2], [cx + r() * 4, cy - sz * 0.9], [cx + sz, cy + 1.5]]), f: '#cfeefc' });
  }
  return (
    <g>
      <OG sh={sh} ow={1.2} />
    </g>
  );
}

/** Elektrik direği (telli). x = dip, y = zemin */
function Pole({ x, y, h = 120 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x - 3.5, y - h, 7, h, 1.5), f: '#8a6a4f' }, { d: rrect(x - 22, y - h + 10, 44, 5, 1.5), f: '#8a6a4f' }]} />
      <g fill="#ddd" stroke={K.out} stroke-width={1}>
        <circle cx={x - 18} cy={y - h + 8} r={2.4} />
        <circle cx={x + 18} cy={y - h + 8} r={2.4} />
      </g>
      <path d={`M${x - 18} ${y - h + 8}Q${x - 60} ${y - h + 22} ${x - 120} ${y - h + 6}M${x + 18} ${y - h + 8}Q${x + 50} ${y - h + 22} ${x + 90} ${y - h + 4}`} fill="none" stroke={K.out} stroke-width={1.4} />
    </g>
  );
}

/** Yasak işaretli simge kutusu (küçük çerçeve) */
function Inset({ x, y, w, h, children, bg = '#fff' }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; bg?: string }) {
  const id = `ins-${x}-${y}-${w}`;
  return (
    <g>
      <rect x={x + 2} y={y + 3} width={w} height={h} rx={8} fill="#000" opacity={0.15} />
      <rect x={x} y={y} width={w} height={h} rx={8} fill={bg} stroke={K.out} stroke-width={2} />
      <clipPath id={id}>
        <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx={7} />
      </clipPath>
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Kat düğümü: yan yatmış, katları çökmüş bina. x = SOL, y = zemin */
function CollapsedBuilding({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#e3d6c2';
  return (
    <G x={x} y={y} s={s}>
      <g transform="rotate(-9 0 0)">
        <OG
          ow={1.5 / s}
          sh={[
            { d: poly([[6, -40], [104, -40], [110, -160], [10, -168]]), f: c },
            { d: poly([[80, -40], [104, -40], [110, -160], [86, -162]]), f: shade(c, 0.12), no: true },
            ...[0, 1, 2].map((i) => ({ d: rrect(20 + i * 2, -150 + i * 0, 22, 18, 1), f: '#8fb7cc', ln: true })),
            ...[0, 1, 2].map((i) => ({ d: rrect(60 + i * 2, -150, 22, 18, 1), f: '#8fb7cc', ln: true })),
            { d: rrect(22, -110, 22, 18, 1), f: '#8fb7cc', ln: true },
            { d: rrect(64, -108, 22, 18, 1), f: '#8fb7cc', ln: true },
            { d: rrect(24, -72, 22, 16, 1), f: '#5d6a74', ln: true },
            { d: rrect(66, -70, 22, 16, 1), f: '#5d6a74', ln: true },
          ]}
        />
        <path d="M30 -168l10 30l-8 20l12 22M96 -40l-6 -24l8 -18" fill="none" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
      </g>
      {/* çökmüş alt katlar: üst üste binmiş döşemeler */}
      <Slab a={[-4, -42]} b={[118, -28]} t={10} c={CONC} rebar={false} />
      <Slab a={[-8, -22]} b={[124, -16]} t={10} c={CONC_D} rebar={false} />
      <Rubble x1={-24} x2={150} y={0} h={22} seed={11} />
    </G>
  );
}

/** Hasarlı bina (eğik, sıva dökülmüş, çatlak). x = SOL, y = zemin */
function DamagedBuilding({ x, y, w = 120, floors = 4, tilt = 4, c = '#eadcc4' }: { x: number; y: number; w?: number; floors?: number; tilt?: number; c?: string }) {
  const fh = 36;
  const H = floors * fh;
  const win: Sh[] = [];
  for (let i = 0; i < floors; i++) {
    for (let j = 0; j < 3; j++) win.push({ d: rrect(x + 12 + j * (w - 24) / 3 + 3, y - (i + 1) * fh + 8, (w - 24) / 3 - 8, 18, 1), f: '#9fc4d8', ln: true });
  }
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <OG
        sh={[
          { d: rrect(x, y - H - 6, w, H + 6, 2), f: c },
          { d: rrect(x + w - 16, y - H - 6, 16, H + 6, 1), f: shade(c, 0.12), no: true },
          ...win,
          { d: rrect(x - 4, y - H - 12, w + 8, 8, 2), f: shade(c, 0.25) },
          // sıva dökülmesi (tuğla görünür)
          { d: smooth([[x + 18, y - 98], [x + 40, y - 104], [x + 50, y - 88], [x + 36, y - 76], [x + 20, y - 82]], true), f: '#c0765a' },
          { d: smooth([[x + 70, y - 34], [x + 92, y - 40], [x + 98, y - 22], [x + 80, y - 14], [x + 68, y - 22]], true), f: '#c0765a' },
          { d: rrect(x + w / 2 - 12, y - 30, 24, 30, 1), f: '#7d5a43', ln: true },
        ]}
      />
      <g stroke="#a65a3e" stroke-width={1} opacity={0.8}>
        <path d={`M${x + 22} ${y - 94}h22M${x + 24} ${y - 86}h20M${x + 74} ${y - 30}h20M${x + 76} ${y - 22}h16`} />
      </g>
      <path d={`M${x + w * 0.62} ${y - H - 6}l-8 22l10 14l-12 20l8 16l-10 22l6 18`} fill="none" stroke={K.out} stroke-width={2.4} stroke-linejoin="round" />
      <path d={`M${x + 8} ${y - 60}l14 10l-4 12l12 8`} fill="none" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
    </g>
  );
}

/** Masa altı çökmüş kişi için ortak duruş: iki kol başı/enseyi örter */

/** Yeşil ok */
const GArrow = (p: { from: P; to: P; bend?: number; w?: number }) => <Arrow {...p} color={K.safe} />;

/** Kalp simgesi (MERKEZ) */
function Heart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: 'M0 8C-12 0 -14 -6 -10 -10C-6 -14 -2 -11 0 -7C2 -11 6 -14 10 -10C14 -6 12 0 0 8Z', f: '#e8576b' }]} />
    </G>
  );
}

/** Market rafı (yan görünüş, kesit). x = SOL, y = zemin */
function Shelf({ x, y, w = 70, h = 150, tilt = 0 }: { x: number; y: number; w?: number; h?: number; tilt?: number }) {
  const levels = 4;
  const sh: Sh[] = [{ d: rrect(x, y - h, 7, h, 1), f: '#8d97a3' }, { d: rrect(x + w - 7, y - h, 7, h, 1), f: '#8d97a3' }];
  const cols = ['#e57a44', '#4f9d69', '#e2c44d', '#5a8fd1', '#c75b8f'];
  for (let i = 0; i < levels; i++) {
    const yy = y - 8 - i * (h / levels);
    sh.push({ d: rrect(x, yy - 4, w, 5, 1), f: '#b8c0c9' });
    for (let j = 0; j < 3; j++) sh.push({ d: rrect(x + 9 + j * 18, yy - 4 - 22, 15, 22, 1.5), f: cols[(i + j) % cols.length] });
  }
  return <g transform={`rotate(${tilt} ${x} ${y})`}><OG sh={sh} /></g>;
}

/** Kutu / koli (MERKEZ) */
function Box({ x, y, w = 18, h = 18, a = 0, c = '#e57a44' }: { x: number; y: number; w?: number; h?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: rrect(-w / 2, -h / 2, w, h, 1.5), f: c }, { d: rrect(-w / 2, -h / 2, w, h * 0.3, 1.5), f: tint(c, 0.25), ln: true }]} />
    </G>
  );
}

/** Alışveriş arabası (yan). x = taban ortası, y = zemin */
function Cart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-34 -62L-28 -62L-22 -20H26L32 -50H-26', st: K.out, sw: 3.5 },
          { d: 'M-24 -50H32L26 -20H-20Z', f: '#c9d2da' },
          { d: 'M-12 -50V-20M0 -50V-20M12 -50V-20M-22 -36H29', st: '#8d97a3', sw: 1.4 },
          { d: 'M-20 -20L-16 -6H22L26 -20', st: K.out, sw: 3 },
          { d: circ([-14, -5], 5), f: '#3b3f4b' },
          { d: circ([20, -5], 5), f: '#3b3f4b' },
        ]}
      />
    </G>
  );
}

/** Stadyum koltuğu (yan; arkalığı solda). x = oturak ortası, y = basamak */
function Seat({ x, y, c = '#3d7ad6' }: { x: number; y: number; c?: string }) {
  return <OG sh={[{ d: rrect(x - 3, y - 18, 5, 18, 1), f: '#8d97a3' }, { d: rrect(x - 12, y - 22, 22, 6, 2), f: c }, { d: rrect(x - 14, y - 44, 6, 26, 2), f: c }]} />;
}

/** Spreyle çarpı ve yazı */
function SprayCan({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: rrect(-6, -10, 12, 26, 3), f: K.action }, { d: rrect(-4, -15, 8, 6, 1.5), f: '#e9e9e9' }, { d: rrect(-2, -19, 4, 4, 1), f: K.ink }]} />
    </G>
  );
}

/** Tablet / pano (MERKEZ) */
function Tablet({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-11, -15, 22, 30, 3), f: '#2f3542' }, { d: rrect(-8.5, -12, 17, 24, 1.5), f: '#eaf4fb', no: true }, { d: 'M-5 -6H5M-5 -1H5M-5 4H2', st: '#7a8796', sw: 1.6 }]} />
    </G>
  );
}

/** Not defteri (MERKEZ) */
function Notebook({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: rrect(-10, -13, 20, 26, 2), f: '#f4f1ea' }, { d: rrect(-10, -13, 4, 26, 1.5), f: '#4f7fb0' }, { d: 'M-3 -6H7M-3 -1H7M-3 4H5', st: '#9aa3ad', sw: 1.4 }]} />
    </G>
  );
}

/** Kırmızı-beyaz şerit: a'dan b'ye */
function Tape({ a, b }: { a: P; b: P }) {
  const d = `M${f1(a[0])} ${f1(a[1])}Q${f1((a[0] + b[0]) / 2)} ${f1((a[1] + b[1]) / 2 + 6)} ${f1(b[0])} ${f1(b[1])}`;
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke={K.out} stroke-width={9} />
      <path d={d} stroke="#fff" stroke-width={6.5} />
      <path d={d} stroke={K.danger} stroke-width={6.5} stroke-dasharray="10 10" />
    </g>
  );
}

/** Mum (taban ortası) */
function Candle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-5, -26, 10, 26, 2), f: '#f4efe1' }, { d: 'M0 -26V-30', st: K.out, sw: 1.4 }]} />
      <path d="M0 -42C4 -37 5 -33 0 -29C-5 -33 -4 -37 0 -42Z" fill={K.fire} />
      <path d="M0 -37C2 -34 2 -32 0 -30C-2 -32 -2 -34 0 -37Z" fill={K.fireCore} />
    </G>
  );
}
/** Çakmak (taban ortası) */
function Lighter({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-7, -24, 14, 24, 2.5), f: K.water }, { d: rrect(-6, -31, 12, 8, 1.5), f: K.metal }, { d: circ([3, -27], 2.4), f: '#6d7480', ln: true }]} />
      <path d="M-1 -44C3 -39 4 -35 -1 -32C-6 -35 -5 -39 -1 -44Z" fill={K.fire} />
    </G>
  );
}

/** Beşik (önden). x = SOL, y = zemin */
function Crib({ x, y, w = 92, c = '#e9d3a8' }: { x: number; y: number; w?: number; c?: string }) {
  const sh: Sh[] = [
    { d: rrect(x, y - 72, 8, 72, 2), f: shade(c, 0.1) },
    { d: rrect(x + w - 8, y - 72, 8, 72, 2), f: shade(c, 0.1) },
    { d: rrect(x + 6, y - 28, w - 12, 10, 2), f: shade(c, 0.12) },
    { d: rrect(x + 8, y - 34, w - 16, 8, 3), f: '#f4f1ea' },
    { d: rrect(x + 4, y - 64, w - 8, 6, 2), f: c },
  ];
  for (let i = 1; i < 7; i++) sh.push({ d: rrect(x + (w * i) / 7 - 2, y - 60, 4, 34, 1), f: c });
  return <OG sh={sh} />;
}

/** Tablo (duvarda). x,y = SOL ÜST */
function Picture({ x, y, w = 56, h = 40 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <path d={`M${x + 10} ${y}L${x + w / 2} ${y - 12}L${x + w - 10} ${y}`} fill="none" stroke={K.out} stroke-width={1.4} />
      <OG sh={[{ d: rrect(x, y, w, h, 2), f: '#9c6b3e' }, { d: rrect(x + 5, y + 5, w - 10, h - 10, 1), f: '#bfe3f5', ln: true }, { d: poly([[x + 6, y + h - 6], [x + w * 0.4, y + h * 0.4], [x + w * 0.6, y + h * 0.65], [x + w * 0.75, y + h * 0.5], [x + w - 6, y + h - 6]]), f: '#7cb36a', no: true }]} />
    </g>
  );
}

/** Şehir silueti (pencere dışı). x,y = SOL ALT */
function Skyline({ x, y, w }: { x: number; y: number; w: number }) {
  const bs = [[0, 46, 22], [24, 70, 18], [44, 38, 26], [72, 84, 20], [94, 54, 24], [120, 66, 18], [140, 44, 26], [168, 76, 22]];
  return (
    <g fill="#9bb4c8">
      {bs.filter(([bx]) => bx < w).map(([bx, bh, bw], i) => (
        <rect key={i} x={x + bx} y={y - bh} width={Math.min(bw, w - bx)} height={bh} fill={i % 2 ? '#9bb4c8' : '#8aa6bd'} />
      ))}
    </g>
  );
}

/* ════════════════════════ oyuncular (rehber başına sabit) ════════════════════════ */

type Cast = Omit<Partial<PersonProps>, 'x' | 'y'>;
/** deprem-aninda: tek kişi, bütün adımlarda aynı */
const DA: Cast = { who: 'man', role: 'helper', skin: 1, hairC: K.hair.brown };
/** deprem-sonrasi: yetişkin + çocuk */
const DS = { adult: { who: 'woman', role: 'helper', hair: 'long', hairC: K.hair.dark, skin: 1 } as Cast, kid: { who: 'girl', role: 'bystander2', hair: 'ponytail', hairC: K.hair.dark, skin: 1 } as Cast };
/** enkaz-altinda: enkaz altındaki kişi */
const EA: Cast = { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark };
/** enkaz-kurtarma: ana gönüllü (turuncu yelek) + ekip arkadaşı */
const EK = { lead: { who: 'man', role: 'helper2', skin: 1, hairC: K.hair.dark, sleeve: 'long' } as Cast, mate: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2, sleeve: 'long' } as Cast };
/** deprem-kalabalik-alan */
const KA: Cast = { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black };
/** deprem-hasarli-bina */
const HB: Cast = { who: 'man', role: 'helper', skin: 1, hairC: K.hair.brown };
/** deprem-cocuklar: ebeveyn + çocuk */
const DC = { parent: { who: 'woman', role: 'helper', hair: 'long', hairC: K.hair.black, skin: 2 } as Cast, kid: { who: 'girl', role: 'bystander2', hair: 'ponytail', hairC: K.hair.black, skin: 2 } as Cast };
/** deprem-yuksek-bina */
const YB: Cast = { who: 'woman', role: 'helper', hair: 'long', hairC: K.hair.auburn, skin: 0 };


/** ÇÖK-KAPAN-TUTUN (net okunan): dizler yerde ve kalçanın altında, sırt yere paralel, baş öne-aşağı;
 *  ön kolun eli ensede/başın arkasında, arka kol ön kolu yerde (ya da {to} ile masa ayağında). */
function coverP(base: PersonProps, k = 0.45, armB?: Pose['armB']): PersonProps {
  const pz: Pose = {
    spine: -6, chest: 4, head: 30, legB: [88, 182], legF: [84, 180],
    armB: armB ?? { floor: 40 }, handB: armB ? 'fist' : 'flat', armF: [0, 0], face: 'worried',
  };
  const r0 = rig({ ...base, pose: { ...pz, armB: [0, 0] } });
  const tgt = lerpP(r0.nape, r0.head, k);
  return { ...base, ax: 'hip', ay: 'hip', x: r0.hip[0], y: r0.hip[1], gy: base.y, pose: { ...pz, armF: { to: tgt }, handF: 'mitten' } };
}

/** Masa altında Çök-Kapan-Tutun (oyuncuya göre) */
function masaAlti(cast: Cast) {
  const leg: P = [271, 186];
  const p = coverP({ x: 160, y: 226, s: 1.38, ...cast }, 0.55, { to: leg });
  const r = rig(p);
  return (
    <Scene2 bg="indoor">
      {/* penceresiz iç duvar: süpürgelik ve elektrik düğmesi */}
      <rect x={0} y={192} width={320} height={8} fill={K.wallShade} />
      <OG sh={[{ d: rrect(22, 52, 16, 24, 3), f: '#f4f1ea' }, { d: rrect(27, 58, 6, 12, 2), f: '#dcd6cb', ln: true }]} />
      <Table x={40} y={226} w={244} h={112} />
      <Person {...p} />
      <Shake x1={32} x2={292} y={120} h={26} />
      <Ok x={r.neck[0] - 18} y={r.neck[1] - 40} r={12} />
    </Scene2>
  );
}

/** Enkaz altında boruya vurma (oyuncuya göre) */
function enkazVurma(cast: Cast) {
  const pipeX = 246;
  const hit: P = [pipeX - 6, 196];
  const p: PersonProps = {
    x: 112, y: 216, s: 1.22, ...cast, shadow: false,
    pose: { spine: -12, chest: -8, head: -46, legB: [178, 180], legF: [176, 182], armB: { floor: 16 }, armF: { to: hit }, handF: 'fist', face: 'worried' },
  };
  const r = rig(p);
  const mz = r.mouth;
  return (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill="#3a3530" />
      <rect y={214} width={320} height={26} fill="#5b5148" />
      <OG sh={[{ d: rrect(pipeX, 60, 16, 156, 3), f: '#8d97a3' }, { d: rrect(pipeX - 3, 140, 22, 8, 2), f: '#6d7480' }]} />
      <Person {...p} />
      <OG sh={[{ d: poly([[hit[0] - 3, hit[1] - 10], [hit[0] + 9, hit[1] - 8], [hit[0] + 11, hit[1] + 4], [hit[0] - 1, hit[1] + 6]]), f: K.rock }]} />
      <path d={`M${f1(mz[0] + 2)} ${f1(mz[1] + 2)}Q${f1(r.neck[0] + 10)} ${f1(r.neck[1] + 14)} ${f1(r.neck[0] - 2)} ${f1(r.neck[1] + 4)}`} fill="none" stroke={K.ink} stroke-width={1.4} />
      <Whistle x={mz[0] + 12} y={mz[1] - 1} s={0.72} a={10} />
      <Slab a={[-20, 74]} b={[340, 88]} t={30} c={CONC} rebar={false} />
      <Chunk x={300} y={204} w={50} h={30} seed={3} />
      <Chunk x={24} y={204} w={46} h={24} seed={8} />
      <Chunk x={190} y={208} w={30} h={14} seed={13} c={CONC_D} />
      <Waves x={pipeX + 20} y={160} n={3} r={9} a={-10} />
      <Waves x={pipeX + 20} y={30} n={3} r={9} a={-30} />
      <OG sh={[{ d: rrect(pipeX, 0, 16, 60, 3), f: '#8d97a3' }]} />
      <Label x={292} y={118} text="3×" size={18} />
    </Scene2>
  );
}

/** Asansör yasak, merdivenden inen kişi (oyuncuya göre). Ortak 'no-elevator' sahnesinin rehbere özel kopyası. */
function merdivenAsansorsuz(cast: Cast) {
  const sx = 150, sy = 224, sw = 30, sh = 18, n = 5;
  const stepTop = (i: number) => sy - (i + 1) * sh;
  const stepX = (i: number) => sx + (i + 0.5) * sw;
  const rail = (x: number): P => [x, stepTop(0) - 48 - ((x - stepX(0)) * sh) / sw];
  const hand: P = [stepX(2) - 4, rail(stepX(2) - 4)[1] - 3];
  const person: PersonProps = {
    x: stepX(2) - 6, y: stepTop(2) - 50, ay: 'hip', s: 0.95, flip: true, ...cast,
    pose: {
      spine: -84, chest: -82, head: -70,
      legF: { to: [stepX(1) + 2, stepTop(1) - 4] }, legB: { to: [stepX(2) + 10, stepTop(2) - 4] },
      footB: 180, footF: 180,
      armB: { to: hand }, armF: [100, 110], face: 'neutral',
    },
  };
  const r0 = rail(sx - 4), r1 = rail(sx + n * sw + 10);
  let st = `M${sx} ${sy}`;
  for (let i = 0; i < n; i++) st += `V${stepTop(i)}h${sw}`;
  st += `V${sy}Z`;
  return (
    <Scene2 bg="indoor">
      {/* asansör kapısı */}
      <OG sh={[{ d: rrect(18, 86, 86, 124, 3), f: '#9aa3ad' }, { d: rrect(24, 100, 74, 110, 1), f: '#c9d0d6' }, { d: 'M61 100V210', st: K.out, sw: 2 }, { d: rrect(40, 90, 42, 8, 2), f: '#3b3f4b' }, { d: rrect(108, 140, 10, 22, 2), f: '#c9d0d6' }]} />
      <No x={61} y={146} r={48} />
      <path d={st} fill="#d8cfbf" stroke={K.out} stroke-width={1.5} />
      <path d={`M${stepX(0)} ${stepTop(0)}V${r0[1] + 6}M${stepX(4)} ${stepTop(4)}V${rail(stepX(4))[1]}`} stroke="#7b4e2e" stroke-width={4} stroke-linecap="round" />
      <path d={`M${r0[0]} ${r0[1]}L${r1[0]} ${r1[1]}`} stroke="#7b4e2e" stroke-width={6} stroke-linecap="round" />
      <Person {...person} />
      <Arrow from={[stepX(2) + 8, stepTop(0) - 6]} to={[sx - 30, sy + 6]} w={6} />
    </Scene2>
  );
}

/** Dolgun kanepe (önden). x = SOL, y = zemin */
function SofaFront({ x, y, w = 176, c = '#7a8fb3' }: { x: number; y: number; w?: number; c?: string }) {
  const d = shade(c, 0.14);
  return (
    <OG
      sh={[
        { d: rrect(x + 14, y - 104, w - 28, 66, 14), f: d },
        { d: rrect(x + 22, y - 98, (w - 52) / 2, 56, 12), f: c },
        { d: rrect(x + 30 + (w - 52) / 2, y - 98, (w - 52) / 2, 56, 12), f: c },
        { d: rrect(x + 10, y - 50, w - 20, 40, 8), f: shade(c, 0.06) },
        { d: rrect(x + 24, y - 54, (w - 52) / 2, 22, 8), f: tint(c, 0.12) },
        { d: rrect(x + 28 + (w - 52) / 2, y - 54, (w - 52) / 2, 22, 8), f: tint(c, 0.12) },
        { d: rrect(x, y - 72, 28, 62, 12), f: c },
        { d: rrect(x + w - 28, y - 72, 28, 62, 12), f: c },
        { d: rrect(x + 10, y - 10, 8, 10, 2), f: K.wood },
        { d: rrect(x + w - 18, y - 10, 8, 10, 2), f: K.wood },
      ]}
    />
  );
}

/** Masa yoksa: dolgun kanepenin hemen yanında Çök-Kapan-Tutun */
function koltukYani(cast: Cast) {
  const gyo = 228;
  const p = coverP({ x: 250, y: gyo, s: 1.4, ...cast, flip: true }, 0.55);
  const r = rig(p);
  return (
    <Scene2 bg="indoor" wall="#e8ddc9">
      <OG sh={[{ d: rrect(286, 52, 16, 24, 3), f: '#f4f1ea' }, { d: rrect(291, 58, 6, 12, 2), f: '#dcd6cb', ln: true }]} />
      <SofaFront x={14} y={gyo - 4} w={178} />
      <Person {...p} />
      <Shake x1={8} x2={310} y={104} h={26} />
      <Ok x={r.elbowF[0] + 6} y={r.top - 26} r={12} />
    </Scene2>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

export const SCENES: Record<string, ArtFn> = {

  /* ───────── deprem-aninda ───────── */
  'deprem-cok': () => {
    const p: PersonProps = { x: 170, y: 224, s: 1.15, ...DA, pose: { ...POSE.crawl, spine: -20, head: -40, face: 'worried' } };
    return (
      <Scene2 bg="indoor">
        <Window x={238} y={58} />
        <Sofa x={10} y={204} />
        <Chandelier x={84} len={30} a={16} />
        <g opacity={0.28}>
          <Person x={170} y={224} s={1.15} {...DA} pose={POSE.standSide} shadow={false} />
        </g>
        <Person {...p} />
        <Arrow from={[128, 104]} to={[128, 170]} w={7} />
        <Shake x1={110} x2={272} y={206} h={22} />
      </Scene2>
    );
  },

  'deprem-kapan-masa': () => masaAlti(DA),

  'deprem-koltuk-yani': () => koltukYani(DA),

  'deprem-tutun-masa': () => {
    const leg: P = [262, 168];
    const p = coverP({ x: 92, y: 234, s: 1.75, ...DA }, 0.55, { to: leg });
    const r = rig(p);
    return (
      <Scene2 bg="indoor" gy={150}>
        <OG sh={[{ d: rrect(-10, 20, 340, 18, 4), f: K.wood }, { d: rrect(-10, 36, 340, 8, 1), f: shade(K.wood, 0.22) }, { d: rrect(252, 40, 18, 210, 2), f: K.wood }]} />
        <Person {...p} />
                <Ring x={r.handB[0] + 2} y={r.handB[1]} r={22} />
        <Shake x1={20} x2={300} y={28} h={20} />
      </Scene2>
    );
  },

  'deprem-yatak-yastik': () => {
    const bx = 30, by = 214;
    const top = by - 41;
    const pillowC: P = [76, top - 22];
    const p: PersonProps = {
      x: 150, y: top, flip: true, s: 1.05, ...DA, shadow: false,
      pose: { spine: 2, chest: 4, head: 8, legB: [178, 180], legF: [176, 180], armB: { to: [pillowC[0] + 6, pillowC[1] - 2] }, armF: { to: [pillowC[0] - 6, pillowC[1] + 2] }, face: 'closed' },
    };
    return (
      <Scene2 bg="indoor" wall="#e6dccb">
        <Bed x={bx} y={by} w={250} blanket="#7aa6d6" />
        <Person {...p} only={['legB', 'armB', 'torso', 'legF', 'head']} />
        <OG sh={[{ d: smooth([[44, pillowC[1] - 2], [76, pillowC[1] - 14], [110, pillowC[1] - 4], [106, pillowC[1] + 12], [76, pillowC[1] + 8], [46, pillowC[1] + 12]], true, 0.9), f: '#fff' }, { d: `M58 ${pillowC[1] + 2}Q76 ${pillowC[1] - 2} 96 ${pillowC[1] + 3}`, st: '#d8d4cc', sw: 1.4 }]} />
        <Person {...p} only={['armF']} />
        <Shake x1={22} x2={292} y={150} h={26} />
        <Ok x={78} y={pillowC[1] - 36} r={13} />
      </Scene2>
    );
  },

  'deprem-acik-alan': () => {
    // uzakta bina, ağaç ve direk (küçük, arka planda); önde açık alanda çökmüş kişi
    const p = coverP({ x: 192, y: 228, s: 1.45, ...DA }, 0.55);
    return (
      <Scene2 bg="outdoor" gy={176}>
        <G x={6} y={60} s={0.78}>
          <OG sh={[{ d: rrect(14, 92, 52, 104, 1), f: '#e3d6c2' }, { d: rrect(10, 86, 60, 8, 2), f: shade('#e3d6c2', 0.25) }, ...[0, 1, 2].flatMap((i) => [{ d: rrect(22, 102 + i * 30, 14, 16, 1), f: '#9fc4d8', ln: true }, { d: rrect(44, 102 + i * 30, 14, 16, 1), f: '#9fc4d8', ln: true }])]} />
        </G>
        <Tree x={84} y={178} s={0.62} />
        <Pole x={116} y={178} h={86} />
        <Person {...p} />
        <Span a={[132, 150]} b={[180, 150]} />
      </Scene2>
    );
  },

  'deprem-arac-dur': () => {
    // el freni: yakın plan
    const dirA = 28;
    const dir: P = [Math.sin(dirA * R), -Math.cos(dirA * R)];
    const piv: P = [46, 112];
    const grip: P = [piv[0] + dir[0] * 58, piv[1] + dir[1] * 58];
    const hs = 0.62;
    const h = { x: grip[0] - dir[0] * 44 * hs, y: grip[1] - dir[1] * 44 * hs, a: dirA, s: hs, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const tipL: P = [piv[0] + dir[0] * 84, piv[1] + dir[1] * 84];
    const cs = 1.4, cx = 150, cy = 210;
    const winD = 'M3 -35V-48H17Q21 -48 24 -45L33 -35Z';
    return (
      <Scene2 bg="outdoor" ground="grass">
        <rect y={206} width={320} height={34} fill="#6e7178" />
        <path d="M0 223H320" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="18 14" />
        <Car x={cx} y={cy} s={cs} color="#3d7ad6" />
        <clipPath id="dep-car-win"><path d={winD} transform={`translate(${cx} ${cy}) scale(${cs})`} /></clipPath>
        <g clip-path="url(#dep-car-win)">
          <Person x={164} y={152} ax="head" ay="head" s={0.78} {...DA} pose={{ ...POSE.standSide, face: 'neutral' }} only={['torso', 'head']} />
        </g>
        <path d={winD} transform={`translate(${cx} ${cy}) scale(${cs})`} fill="none" stroke={K.out} stroke-width={1.5 / cs} />
        {/* el freni yakın planı */}
        <Inset x={14} y={14} w={128} h={100} bg="#4a505f">
          <OG sh={[{ d: rrect(14, 98, 110, 30, 6), f: '#3b3f4b' }, { d: rrect(piv[0] - 14, piv[1] - 10, 28, 20, 6), f: '#2f3542' }]} />
          <OG sh={[{ d: `M${f1(piv[0])} ${f1(piv[1])}L${f1(tipL[0])} ${f1(tipL[1])}`, st: '#2b2d3a', sw: 15 }, { d: `M${f1(piv[0])} ${f1(piv[1])}L${f1(tipL[0])} ${f1(tipL[1])}`, st: '#6d7480', sw: 11 }]} />
          <circle cx={tipL[0]} cy={tipL[1]} r={5} fill={K.danger} stroke={K.out} stroke-width={1.4} />
          <Hand {...h} arm={70} sleeve={K.role.helper} skin={1}>
            <path d={`M${f1(grip[0] - dir[0] * 16)} ${f1(grip[1] - dir[1] * 16)}L${f1(grip[0] + dir[0] * 16)} ${f1(grip[1] + dir[1] * 16)}`} stroke="#6d7480" stroke-width={11} />
          </Hand>
          <Arrow from={[112, 96]} to={[112, 40]} w={5} bend={0.12} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── deprem-sonrasi ───────── */
  'deprem-yara-kontrol': () => {
    const kid: PersonProps = { x: 222, y: 226, s: 1.0, ...DS.kid, flip: true, pose: { ...POSE.sitFloor, face: 'worried' } };
    const k = rig(kid);
    const adult: PersonProps = {
      x: 128, y: 226, s: 1.12, ...DS.adult,
      pose: { ...POSE.stand, head: -100, armB: [116, -78], handB: { shape: 'mitten', a: 0 }, armF: { to: [k.shoulderF[0] - 2, k.shoulderF[1] - 2] }, face: 'neutral' },
    };
    return (
      <Scene2 bg="indoor" wall="#e8ddc9">
        <Picture x={242} y={50} />
        <g transform="rotate(14 60 80)"><Picture x={30} y={60} w={46} h={34} /></g>
        <FloorMess x={36} y={234} s={0.85} />
        <Chunk x={290} y={228} w={16} h={9} seed={4} />
        <Person {...kid} />
        <Person {...adult} />
      </Scene2>
    );
  },

  'deprem-ayakkabi-cam': () => {
    const p: PersonProps = {
      x: 108, y: 230, s: 1.25, ...DS.adult,
      pose: { spine: -70, chest: -40, head: -10, legB: [4, 92], legF: [-30, 60], footF: 10, armB: { to: [192, 188] }, armF: { to: [178, 196] }, face: 'neutral' },
    };
    const r = rig(p);
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(40, 178, 96, 20, 4), f: '#a8724a' }, { d: rrect(46, 196, 8, 30, 1), f: shade('#a8724a', 0.2) }, { d: rrect(122, 196, 8, 30, 1), f: shade('#a8724a', 0.2) }]} />
        <Person {...p} />
        <Shards x={170} y={232} w={130} />
        <Ok x={r.toeF[0] + 18} y={r.toeF[1] - 22} r={12} />
        <Inset x={222} y={18} w={84} h={70}>
          <G x={264} y={56} s={1.1}>
            <OG sh={[{ d: 'M-8 18C-14 6 -12 -12 -2 -18C6 -22 12 -14 11 -2C10 8 6 16 2 22C-2 26 -6 24 -8 18Z', f: K.skin[1] }, ...[[-8, -26], [-1, -29], [5, -27], [10, -23], [13, -18]].map(([tx, ty], i) => ({ d: circ([tx, ty], 3.4 - i * 0.35), f: K.skin[1] }))]} />
          </G>
          <No x={264} y={53} r={26} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── enkaz-altinda ───────── */
  'deprem-enkaz-agiz-kapat': () => {
    const p: PersonProps = { x: 168, y: 122, ax: 'head', ay: 'head', s: 2.5, ...EA, pose: { ...POSE.stand, spine: -84, head: -80, face: 'worried' } };
    const r = rig(p);
    const m = r.mouth;
    const H = r.headR;
    const shirt = K.role.victim;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#3a3530" />
        <Person {...p} only={['torso', 'head']} />
        {/* yaka yukarı çekilmiş: ağız ve burun örtülü */}
        <OG sh={[{ d: smooth([[m[0] - 0.98 * H, m[1] - 0.22 * H], [m[0], m[1] - 0.4 * H], [m[0] + 0.98 * H, m[1] - 0.22 * H], [m[0] + 1.2 * H, m[1] + 1.3 * H], [m[0], m[1] + 1.6 * H], [m[0] - 1.2 * H, m[1] + 1.3 * H]], true, 0.7), f: shirt }, { d: `M${m[0] - 0.8 * H} ${m[1] - 0.1 * H}Q${m[0]} ${m[1] - 0.28 * H} ${m[0] + 0.8 * H} ${m[1] - 0.1 * H}`, st: shade(shirt, 0.3), sw: 2 }]} />
        <Hand x={m[0] - 34} y={m[1] + 70} a={10} s={0.75} pose="fist" side="R" arm={140} sleeve={shirt} skin={1} />
        <Slab a={[-20, 30]} b={[340, -6]} t={34} c={CONC_D} rebar={false} />
        <Chunk x={30} y={206} w={60} h={40} a={-10} seed={2} />
        <Chunk x={290} y={210} w={70} h={44} a={12} seed={6} />
        <Chunk x={60} y={150} w={34} h={22} a={20} seed={9} />
        <DustMotes x={10} y={50} w={300} h={170} n={34} />
      </Scene2>
    );
  },

  'deprem-enkaz-vurma': () => enkazVurma(EA),

  'deprem-enkaz-dinle': () => {
    const res: PersonProps = {
      x: 120, y: 120, s: 0.95, ...EK.lead, shadow: false,
      pose: { ...POSE.kneel, legB: [70, 182], legF: [66, 180], spine: -2, chest: 10, head: -24, armF: { floor: 24 }, armB: { at: 'mouth', d: [9, 10] }, handB: 'fist', face: 'closed' },
    };
    const rr = rig(res);
    const vic: PersonProps = {
      x: 196, y: 210, s: 1.0, ...EA, flip: true, shadow: false,
      pose: { spine: -18, chest: -14, head: -70, legB: [178, 180], legF: [176, 182], armB: { floor: 14 }, armF: { floor: 36 }, handF: 'fist', face: 'worried' },
    };
    const v = rig(vic);
    const m = rr.mouth;
    return (
      <Scene2 bg="outdoor" gy={100}>
        <rect y={96} width={320} height={144} fill="#6b6157" />
        <Rubble x1={-10} x2={330} y={130} h={24} seed={5} />
        {/* boşluk */}
        <path d="M56 212Q66 150 150 146Q250 140 284 212Z" fill="#2e2a26" stroke={K.out} stroke-width={1.5} />
        <rect y={210} width={320} height={30} fill="#5b5148" />
        <Chunk x={36} y={176} w={44} h={26} seed={12} c={CONC_D} />
        <Chunk x={302} y={180} w={44} h={28} seed={14} c={CONC_D} />
        <Person {...res} over={(q) => <g><Helmet r={q} /><Glove p={q.handF} s={0.95} /></g>} />
        {/* dudaktaki işaret parmağı (sessizlik) */}
        <path d={`M${f1(m[0] + 4)} ${f1(m[1] + 10)}L${f1(m[0] + 3)} ${f1(m[1] - 7)}`} stroke={K.out} stroke-width={6.4} stroke-linecap="round" />
        <path d={`M${f1(m[0] + 4)} ${f1(m[1] + 10)}L${f1(m[0] + 3)} ${f1(m[1] - 7)}`} stroke={K.skin[1]} stroke-width={3.8} stroke-linecap="round" />
        <Person {...vic} />
        <Dash pts={[[rr.head[0] + 4, rr.head[1] + 20], [v.head[0] - 4, v.head[1] - 20]]} c={K.action} w={3.2} />
        <Waves x={v.handF[0] - 6} y={v.handF[1] - 8} n={3} r={7} a={-110} />
      </Scene2>
    );
  },

  /* ───────── enkaz-kurtarma ───────── */
  'deprem-kurtarma-girme': () => {
    const vol: PersonProps = { x: 272, y: 222, s: 0.95, ...EK.lead, flip: true, pose: { ...POSE.standSide, face: 'worried' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <CollapsedBuilding x={40} y={210} s={1} />
        <No x={110} y={166} r={30} />
        <Person {...vol} over={(r) => <Helmet r={r} />} />
      </Scene2>
    );
  },

  'deprem-kurtarma-koruyucu': () => {
    const p: PersonProps = { x: 150, y: 228, s: 1.18, ...EK.lead, bottomC: K.pants.navy, shoes: BOOT, pose: { ...POSE.stand, face: 'calm' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Person {...p} over={(q) => (
          <g>
            <HelmetFront r={q} />
            <MaskFront r={q} />
            <Glove p={q.handB} s={1.15} />
            <Glove p={q.handF} s={1.15} />
            <BootShaft p={q.ankleB} s={1.15} front />
            <BootShaft p={q.ankleF} s={1.15} front />
            <g stroke="#f4f1ea" stroke-width={3}>
              <path d={`M${f1(q.shoulderB[0] + 4)} ${f1(q.chest[1] + 18)}H${f1(q.shoulderF[0] - 4)}`} />
              <path d={`M${f1(q.shoulderB[0] + 5)} ${f1(q.chest[1] + 30)}H${f1(q.shoulderF[0] - 5)}`} />
            </g>
          </g>
        )} />
        <Ok x={r.head[0] + 36} y={r.head[1] - 18} r={9} />
        <Ok x={r.mouth[0] - 32} y={r.mouth[1] + 2} r={9} />
        <Ok x={r.handF[0] + 20} y={r.handF[1] - 6} r={9} />
        <Ok x={r.elbowB[0] - 20} y={r.elbowB[1]} r={9} />
        <Ok x={r.ankleF[0] + 22} y={r.ankleF[1] - 4} r={9} />
      </Scene2>
    );
  },

  'deprem-kurtarma-sessizlik': () => {
    const lead: PersonProps = { x: 64, y: 222, s: 1.0, ...EK.lead, pose: { ...POSE.standSide, armF: [-80, -86], handF: 'fist', face: 'neutral' } };
    const listen: PersonProps = {
      x: 196, y: 186, s: 0.95, ...EK.mate, flip: true,
      pose: { ...POSE.kneel, spine: -36, chest: 8, head: 60, armB: { floor: 18 }, armF: { floor: 4 }, face: 'closed' },
    };
    const l = rig(listen);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Rubble x1={120} x2={330} y={204} h={60} seed={21} />
        <Person {...listen} over={(r) => <Helmet r={r} />} />
        <Person x={290} y={160} s={0.62} who="woman" role="bystander" pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person x={20} y={170} s={0.6} who="oldman" role="bystander3" pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person x={110} y={176} s={0.62} who="boy" role="bystander4" pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person {...lead} over={(r) => <Helmet r={r} />} />
        <Waves x={l.head[0] + 12} y={l.head[1] - 6} n={3} r={6} a={-60} />
      </Scene2>
    );
  },

  'deprem-kurtarma-takoz': () => {
    const gyo = 212;
    // dayanak: üst üste dört tahta; kaldıraç bunun üstünden geçer
    const fx = 136, fw = 30, bh = 10, nb = 4;
    const fTop: P = [fx + fw / 2, gyo - nb * bh];
    // kaldıraç: ucu kalkık beton bloğun altında, sapı solda yukarıda
    const tip: P = [196, gyo - 6];
    const dir = Math.atan2(fTop[1] - tip[1], fTop[0] - tip[0]) / R;
    const lev = (l: number) => pol(tip, dir, l);
    const end = lev(150);
    const v1: PersonProps = {
      x: 44, y: 224, s: 1.0, ...EK.lead, shoes: BOOT,
      pose: { spine: -66, chest: -50, head: -50, legB: [108, 96], legF: [74, 88], armB: { to: lev(144) }, armF: { to: lev(124) }, handB: 'fist', handF: 'fist', face: 'neutral' },
    };
    // takoz kalası: zeminde, dayanağın yanından geçip ucu bloğun altına giriyor
    const wTip: P = [194, gyo - 2];
    const wEnd: P = [150, gyo - 4];
    const blk: P[] = [[176, 166], [300, 174], [304, gyo], [182, gyo - 14]];
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* arkada taşıyıcı kolon: dokunma */}
        <OG sh={[{ d: rrect(246, 22, 30, 160, 2), f: CONC }, { d: rrect(264, 22, 12, 160, 1), f: CONC_D, no: true }]} />
        <path d="M250 60l12 18l-6 14l14 16" fill="none" stroke={K.out} stroke-width={2} />
        <No x={261} y={78} r={24} />
        {/* blok altındaki boşluk ve blok */}
        <path d={poly([[182, gyo - 14], [304, gyo], [182, gyo]])} fill="#3a3530" />
        <OG sh={[{ d: poly(blk), f: CONC }, { d: poly([[180, gyo - 26], [302, gyo - 12], [304, gyo], [182, gyo - 14]]), f: CONC_D, no: true }]} />
        <path d="M214 178l10 10l-4 8" fill="none" stroke={shade(CONC, 0.35)} stroke-width={1.4} />
        {/* dayanak tahtaları */}
        <OG sh={Array.from({ length: nb }, (_, i) => ({ d: rrect(fx + (i % 2 ? 2 : 0), gyo - (i + 1) * bh, fw - 2, bh, 1.5), f: i % 2 ? '#c99a62' : K.wood }))} />
        {/* kaldıraç */}
        <OG sh={[{ d: `M${f1(tip[0])} ${f1(tip[1])}L${f1(end[0])} ${f1(end[1])}`, st: K.out, sw: 8.5 }, { d: `M${f1(tip[0])} ${f1(tip[1])}L${f1(end[0])} ${f1(end[1])}`, st: '#4a505f', sw: 5.5 }]} />
        {/* bloğun ön alt kenarı kaldıracın ucunu örter */}
        <OG sh={[{ d: poly([[182, gyo - 14], [204, gyo - 11.5], [204, gyo - 4], [182, gyo - 6]]), f: CONC_D }]} />
        <Person {...v1} over={(r) => <g><Helmet r={r} /><Glove p={r.handB} s={0.92} /><Glove p={r.handF} s={0.92} /></g>} />
        {/* takoz kalası (ön planda, dayanağın yanından) */}
        <OG sh={[{ d: poly([[wEnd[0], wEnd[1] - 7], [wTip[0], wTip[1] - 4], [wTip[0], wTip[1] + 2], [wEnd[0], wEnd[1] + 8]]), f: '#d6a15e' }, { d: `M${wEnd[0] + 10} ${wEnd[1] - 1}L${wTip[0] - 20} ${wTip[1] - 1}`, st: shade('#d6a15e', 0.25), sw: 1.2 }]} />
        <Arrow from={[190, 156]} to={[190, 112]} w={6} />
        <Arrow from={[150, 228]} to={[196, 228]} w={4.5} />
      </Scene2>
    );
  },

  'deprem-kurtarma-isaretle': () => {
    const sprayAt: P = [112, 110];
    const p: PersonProps = {
      x: 210, y: 224, s: 1.1, ...EK.lead, flip: true,
      pose: { ...POSE.standSide, armF: { to: [sprayAt[0] + 34, sprayAt[1] + 4] }, armB: { to: [190, 148] }, face: 'neutral' },
    };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Rubble x1={226} x2={340} y={206} h={70} seed={31} />
        <OG sh={[{ d: rrect(10, 40, 150, 166, 2), f: '#e1d4bd' }, { d: rrect(10, 34, 150, 8, 2), f: shade('#e1d4bd', 0.25) }]} />
        {/* sade işaret: sprey tik + ARANDI + saat */}
        <g stroke={K.action} stroke-width={7} stroke-linecap="round" stroke-linejoin="round" fill="none" opacity={0.95}>
          <path d="M52 90L72 112L108 66" />
        </g>
        <text x={82} y={146} text-anchor="middle" font-size={21} font-weight={800} fill={K.action} font-family="'IBM Plex Sans', system-ui, sans-serif">ARANDI</text>
        <text x={82} y={172} text-anchor="middle" font-size={19} font-weight={700} fill={K.action} font-family="'IBM Plex Sans', system-ui, sans-serif">14:30</text>
        <Person {...p} over={(q) => <g><Helmet r={q} /><Notebook x={q.handB[0] - 4} y={q.handB[1] - 4} a={-10} /></g>} />
        <SprayCan x={r.handF[0] - 4} y={r.handF[1] - 2} a={-70} />
        <path d="M128 112l-8 -2M128 116l-9 3M127 108l-7 -6" stroke={K.action} stroke-width={2} stroke-linecap="round" />
      </Scene2>
    );
  },

  /* ───────── deprem-kalabalik-alan ───────── */
  'deprem-kalabalik-kosma': () => {
    const fg = coverP({ x: 80, y: 228, s: 1.0, ...KA }, 0.55);
    const fr = rig(fg);
    return (
      <Scene2 bg="indoor" wall="#dfe5ea">
        {/* AVM girişi: cam kapılar */}
        <OG sh={[{ d: rrect(150, 40, 160, 160, 2), f: '#b9d6e6' }, { d: rrect(146, 32, 168, 12, 2), f: '#6d7480' }, { d: 'M190 44V200M230 44V200M270 44V200', st: '#8d97a3', sw: 4 }]} />
        <Person x={214} y={206} s={0.72} who="woman" role="bystander" pose={POSE.run} />
        <Person x={244} y={204} s={0.72} who="man" role="bystander2" pose={POSE.run} />
        <Person x={186} y={210} s={0.74} who="boy" role="bystander4" pose={POSE.run} />
        <Person x={262} y={212} s={0.74} who="man" role="bystander3" skin={3} pose={POSE.run} />
        <No x={230} y={150} r={48} />
        <Person {...fg} />
        <Ok x={fr.head[0] + 6} y={fr.top - 22} r={13} />
      </Scene2>
    );
  },

  'deprem-magaza-raf': () => {
    const p = coverP({ x: 178, y: 226, s: 1.0, ...KA }, 0.55);
    return (
      <Scene2 bg="indoor" wall="#eef0ea">
        <Shelf x={12} y={204} w={70} h={170} tilt={-2} />
        <Box x={98} y={70} a={24} c="#5a8fd1" />
        <Box x={112} y={128} a={-18} c="#e2c44d" />
        <Box x={96} y={196} a={8} c="#e57a44" />
        <Box x={120} y={198} w={14} h={14} a={-30} c="#4f9d69" />
        <path d="M92 52q4 8 0 14M108 108q4 8 0 14" fill="none" stroke={K.ink} stroke-width={2} stroke-linecap="round" opacity={0.6} />
        <Cart x={282} y={222} s={0.82} />
        <Person {...p} />
        <Arrow from={[132, 160]} to={[196, 160]} w={7} />
        <Shake x1={4} x2={90} y={110} h={30} />
      </Scene2>
    );
  },

  'deprem-stadyum-koltuk': () => {
    // Tribün, yandan: koltuklar sola (sahaya) bakar. Kişi kendi koltuğunun önüne, iki sıra arasına çökmüş.
    const gyo = 214;
    const seat = (x: number, y: number, c: string, k = 1) => (
      <G x={x} y={y} s={k}>
        <OG sh={[{ d: rrect(-4, -40, 8, 40, 2), f: '#8d97a3' }, { d: rrect(-34, -50, 52, 12, 4), f: c }, { d: rrect(12, -104, 14, 64, 5), f: c }, { d: rrect(-30, -40, 8, 4, 1), f: shade(c, 0.2), no: true }]} />
      </G>
    );
    const p = coverP({ x: 186, y: gyo + 12, s: 1.25, ...KA, flip: true }, 0.55);
    return (
      <Scene2 bg="outdoor" ground="grass" gy={150}>
        {/* basamaklar: önde alçak, arkada yüksek */}
        <path d={`M-4 244V${gyo}H262V${gyo - 40}H330V244Z`} fill="#c7c3ba" stroke={K.out} stroke-width={1.5} />
        <rect x={-4} y={gyo} width={266} height={5} fill={shade('#c7c3ba', 0.15)} />
        <rect x={262} y={gyo - 40} width={70} height={5} fill={shade('#c7c3ba', 0.15)} />
        {/* öndeki sıranın koltuğu (solda) ve kişinin kendi koltuğu (sağda) */}
        {seat(58, gyo, '#d0473d')}
        {seat(286, gyo - 40, '#d0473d')}
        {seat(236, gyo, '#3d7ad6')}
        <Person {...p} />
        <Shake x1={20} x2={300} y={40} h={24} />
      </Scene2>
    );
  },

  'deprem-metro-tutun': () => {
    const pole1 = 124, pole2 = 236;
    const g1: P = [pole1, 136];
    const sitP: PersonProps = {
      x: 84, y: 222, s: 1.0, who: 'woman', role: 'bystander', hair: 'long', hairC: K.hair.black, skin: 1,
      pose: { ...POSE.sitChair, spine: -80, chest: -66, head: -50, armF: { to: g1 }, handF: 'fist', armB: [-110, -10], face: 'worried' },
    };
    const g2a: P = [pole2, 146], g2b: P = [pole2, 170];
    const crP: PersonProps = {
      x: 202, y: 222, s: 1.0, ...KA,
      pose: { ...POSE.kneel, spine: -70, chest: -58, head: -62, armF: { to: g2b }, handF: 'fist', armB: { to: g2a }, handB: 'fist', face: 'worried' },
    };
    const Grip = ({ p, sk, w = 6 }: { p: P; sk: string; w?: number }) => (
      <OG sh={[0, 1, 2].map((i) => ({ d: capsule([p[0] - w / 2 - 3.5, p[1] - 5 + i * 4.6], 2.6, [p[0] + w / 2 + 3.5, p[1] - 5 + i * 4.6], 2.6), f: sk }))} ow={1.2} />
    );
    return (
      <Scene2 bg="indoor" wall="#dde3e6" gy={206}>
        <rect y={70} width={320} height={46} fill="#9bb4c8" />
        <path d="M0 70H320M0 116H320M70 70V116M180 70V116" stroke={K.out} stroke-width={1.5} />
        {/* kapalı kapı */}
        <rect x={262} y={56} width={58} height={150} fill="#b9c2c9" stroke={K.out} stroke-width={1.5} />
        <path d="M291 56V206" stroke={K.out} stroke-width={2.2} />
        <rect x={268} y={70} width={18} height={40} rx={3} fill="#9bb4c8" stroke={K.out} stroke-width={1.2} />
        <rect x={296} y={70} width={18} height={40} rx={3} fill="#9bb4c8" stroke={K.out} stroke-width={1.2} />
        <OG sh={[{ d: rrect(18, 176, 92, 10, 3), f: '#3d7ad6' }, { d: rrect(22, 186, 84, 20, 2), f: '#6d7480' }, { d: rrect(14, 128, 12, 52, 3), f: '#3d7ad6' }]} />
        <OG sh={[{ d: rrect(pole1 - 4, 30, 8, 176, 3), f: '#8f9aa6' }, { d: rrect(pole2 - 4, 30, 8, 176, 3), f: '#8f9aa6' }, { d: rrect(0, 26, 320, 7, 2), f: '#8f9aa6' }]} />
        <Person {...sitP} />
        <Person {...crP} />
        <Grip p={[g1[0], g1[1] + 1]} sk={K.skin[1]} />
        <Grip p={[g2a[0], g2a[1] + 1]} sk={shade(K.skin[2], 0.12)} />
        <Grip p={[g2b[0], g2b[1] + 1]} sk={K.skin[2]} />
        <Ring x={g1[0]} y={g1[1] + 1} r={14} />
        <Ring x={g2a[0]} y={g2a[1] + 1} r={12} />
        <Ring x={g2b[0]} y={g2b[1] + 1} r={12} />
        <Shake x1={14} x2={306} y={150} h={22} />
      </Scene2>
    );
  },

  'deprem-kalabalik-cikis': () => {
    const staff: PersonProps = { x: 70, y: 224, s: 1.05, who: 'man', role: 'helper2', skin: 2, hairC: K.hair.black, pose: { ...POSE.standSide, armF: [-8, -12], handF: 'flat', face: 'speak' } };
    return (
      <Scene2 bg="indoor" wall="#e4e2da">
        <Door x={246} y={204} w={56} open />
        <OG sh={[{ d: rrect(236, 54, 76, 30, 4), f: K.safe }]} />
        <path d="M250 69H280M272 61L282 69L272 77" stroke="#fff" stroke-width={4} fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <g fill="#fff"><circle cx={296} cy={62} r={3.2} /><path d="M292 80l3 -9l-4 -3l5 -1l4 4l3 2" stroke="#fff" stroke-width={2.4} fill="none" stroke-linecap="round" /></g>
        <Person x={150} y={222} s={0.86} who="woman" role="bystander" pose={{ ...POSE.walk, face: 'neutral' }} />
        <Person x={190} y={220} s={0.86} who="oldman" role="bystander3" pose={{ ...POSE.walk, face: 'neutral' }} />
        <Person x={228} y={218} s={0.86} {...KA} pose={{ ...POSE.walk, face: 'neutral' }} />
        <Person {...staff} over={(r) => <VestStripes r={r} />} />
        <GArrow from={[146, 62]} to={[226, 66]} bend={-0.12} />
      </Scene2>
    );
  },

  /* ───────── deprem-hasarli-bina ───────── */
  'deprem-bina-dis-kontrol': () => {
    const p: PersonProps = { x: 262, y: 224, s: 1.0, ...HB, flip: true, pose: { ...POSE.standSide, head: -100, face: 'worried' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <DamagedBuilding x={30} y={204} w={120} floors={4} tilt={4} />
        <Chunk x={160} y={204} w={20} h={10} seed={3} />
        <Chunk x={140} y={208} w={14} h={8} seed={5} />
        <Person {...p} />
        <Dash pts={[[r.head[0] - 14, r.head[1] - 2], [150, 80]]} c={K.ink} w={2.4} dash="5 6" />
      </Scene2>
    );
  },

  'deprem-bina-kolon-catlak': () => (
    <Scene2 bg="closeup">
      {/* kiriş */}
      <OG sh={[{ d: rrect(0, 14, 320, 20, 1), f: CONC_D }]} />
      {/* çatlak kolon: çapraz çatlak, dökülmüş beton, çıplak donatı */}
      <OG sh={[{ d: rrect(40, 30, 92, 214, 2), f: CONC }, { d: rrect(110, 30, 22, 214, 1), f: CONC_D, no: true }]} />
      <OG sh={[{ d: smooth([[54, 104], [94, 90], [126, 112], [120, 160], [76, 170], [48, 150]], true, 0.8), f: '#8f897d' }]} />
      <g stroke="#7d5a43" stroke-width={4} stroke-linecap="round" fill="none">
        <path d="M66 96Q72 130 62 170" />
        <path d="M104 92Q116 128 106 170" />
        <path d="M56 118H122M56 146H120" stroke-width={2.6} />
      </g>
      <path d="M42 62L74 92L66 104L102 150L94 160L132 204" fill="none" stroke={K.out} stroke-width={3.4} stroke-linejoin="round" />
      <Chunk x={150} y={228} w={24} h={12} seed={7} />
      <Chunk x={24} y={230} w={18} h={10} seed={4} />
      {/* bina girişi: girilmez */}
      <OG sh={[{ d: rrect(196, 70, 94, 174, 2), f: '#3a3530' }, { d: rrect(188, 62, 110, 10, 2), f: CONC_D }]} />
      <No x={243} y={150} r={40} />
    </Scene2>
  ),

  'deprem-hasar-tespit': () => {
    const t1: PersonProps = { x: 120, y: 200, s: 0.86, who: 'man', role: 'helper2', skin: 1, pose: { ...POSE.stand, armF: { to: [146, 128] }, face: 'neutral' } };
    const t2: PersonProps = { x: 196, y: 200, s: 0.86, who: 'woman', role: 'helper2', hair: 'bun', hairC: K.hair.black, skin: 2, pose: { ...POSE.stand, armB: { to: [170, 132] }, face: 'neutral' } };
    const r1 = rig(t1), r2 = rig(t2);
    const ph = { x: 262, y: 250, a: -6, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 38 };
    const g = handPoint(ph, 'grip');
    return (
      <Scene2 bg="outdoor">
        <DamagedBuilding x={92} y={190} w={140} floors={3} tilt={0} />
        <Person {...t1} over={(r) => <g><HelmetFront r={r} /><Tablet x={r1.handF[0] + 2} y={r1.handF[1] - 6} s={0.9} /></g>} />
        <Person {...t2} over={(r) => <g><HelmetFront r={r} /><Tablet x={r2.handB[0] - 2} y={r2.handB[1] - 6} s={0.9} /></g>} />
        <Hand {...ph} arm={60} sleeve={K.role.helper} skin={1}>
          <G x={g[0]} y={g[1]} a={-6} s={1.1}>
            <OG ow={1.4} sh={[{ d: rrect(-19, -36, 38, 72, 7), f: '#2f3542' }, { d: rrect(-16, -31, 32, 58, 3), f: '#eaf4fb', no: true }]} />
            <rect x={-16} y={-31} width={32} height={10} fill="#d63b35" />
            <path d="M-8 -6L0 -13L8 -6V4H-8Z" fill="#f4f1ea" stroke={K.out} stroke-width={1.2} />
            <circle cx={6} cy={3} r={5} fill="none" stroke={K.out} stroke-width={1.6} />
            <path d="M9.5 6.5L13 10" stroke={K.out} stroke-width={2} stroke-linecap="round" />
            <rect x={-12} y={14} width={24} height={8} rx={4} fill={K.safe} />
          </G>
        </Hand>
      </Scene2>
    );
  },

  'deprem-bina-yasak': () => {
    const fam = (x: number, who: PersonProps['who'], role: PersonProps['role'], s: number, hair?: PersonProps['hair'], extra: Cast = {}): PersonProps => ({ x, y: 226, s, who, role, hair, flip: true, pose: { ...POSE.walk, face: 'worried' }, ...extra });
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <OG sh={[{ d: rrect(20, 20, 170, 184, 1), f: '#e7dac2' }, { d: rrect(14, 14, 182, 10, 2), f: shade('#e7dac2', 0.25) }, { d: rrect(30, 36, 34, 30, 1), f: '#9fc4d8', ln: true }, { d: rrect(146, 36, 34, 30, 1), f: '#9fc4d8', ln: true }]} />
        <path d="M120 20l-8 30l12 20l-10 26" fill="none" stroke={K.out} stroke-width={2.2} />
        <Door x={76} y={204} w={60} h={110} />
        <OG sh={[{ d: rrect(94, 112, 24, 18, 2), f: K.danger }]} />
        <No x={106} y={156} r={22} />
        <Tape a={[14, 158]} b={[198, 150]} />
        <OG sh={[{ d: rrect(10, 150, 6, 56, 1), f: '#8d97a3' }, { d: rrect(194, 144, 6, 62, 1), f: '#8d97a3' }]} />
        <Person {...fam(236, 'man', 'helper', 0.95, undefined, HB)} />
        <Person {...fam(272, 'woman', 'bystander', 0.92, 'long')} />
        <Person {...fam(302, 'boy', 'bystander2', 0.9)} />
        <Arrow from={[228, 52]} to={[300, 52]} w={5} />
      </Scene2>
    );
  },

  'deprem-bina-fener': () => {
    const p: PersonProps = { x: 150, y: 224, s: 1.05, ...HB, sleeve: 'long', shoes: BOOT, pose: { ...POSE.walk, armF: [-8, -8], handF: 'fist', face: 'neutral' } };
    const r = rig(p);
    const off: PersonProps = { x: 70, y: 222, s: 1.0, who: 'man', role: 'helper2', skin: 2, hairC: K.hair.black, pose: { ...POSE.walk, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#5b5650" gy={204}>
        <rect y={0} width={320} height={204} fill="#4a4540" />
        <Door x={212} y={204} w={70} h={118} open />
        <path d="M40 0l8 30l-10 18l12 26" fill="none" stroke="#2b2722" stroke-width={2} />
        <Person {...off} over={(q) => <g><Helmet r={q} /><VestStripes r={q} /></g>} />
        <Flashlight x={r.handF[0] - 6} y={r.handF[1]} s={1} a={4} />
        <Person {...p} over={(q) => <g><Helmet r={q} /><Glove p={q.handF} s={1.05} /><Glove p={q.handB} s={1.05} /><BootShaft p={q.ankleB} s={1.05} /><BootShaft p={q.ankleF} s={1.05} /></g>} />
        <Inset x={226} y={12} w={82} h={60}>
          <Candle x={248} y={66} s={0.85} />
          <Lighter x={284} y={66} s={0.85} />
          <No x={267} y={42} r={23} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── deprem-cocuklar ───────── */
  'deprem-bebek-gogus': () => {
    // Masanın altında: anne topukları üstüne çökmüş, öne kapanmış; bebek göğsüne bastırılmış, iki kolu bebeği sarıyor.
    const mom0: PersonProps = {
      x: 136, y: 228, s: 1.6, ...DC.parent,
      pose: { spine: -60, chest: -44, head: -22, legB: [14, 182], legF: [10, 180], footB: 0, footF: 0, armB: [60, 0], armF: [60, 0], face: 'worried' },
    };
    const m = rig(mom0);
    const baby: PersonProps = {
      ax: 'back', ay: 'back', x: m.chest[0] + 22, y: m.chest[1] + 14, s: 1.25, who: 'baby', flip: true, shadow: false,
      pose: { spine: -76, chest: -80, head: -96, legB: [40, 110], legF: [30, 100], armB: [-150, 170], armF: [-130, 160], face: 'closed' },
    };
    const b = rig(baby);
    const mom: PersonProps = {
      ...mom0,
      pose: { ...mom0.pose, armB: { to: [b.head[0] + 2, b.head[1] - 4] }, armF: { to: [b.back[0] + 6, b.hip[1] - 2] }, handB: 'mitten', handF: 'mitten' },
    };
    return (
      <Scene2 bg="indoor">
        <Table x={8} y={228} w={304} h={190} />
        <Person {...mom} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        <Person {...baby} />
        <Person {...mom} only={['armF']} />
        <Shake x1={12} x2={308} y={22} h={22} />
        <Ok x={250} y={84} r={13} />
      </Scene2>
    );
  },

  'deprem-cocuga-seslen': () => {
    const dad: PersonProps = { x: 30, y: 224, s: 0.92, ...DC.parent, pose: { ...POSE.dropCover, spine: -34, chest: -28, head: -50, armB: { floor: 22 }, armF: { to: [0, 0] }, face: 'speak' } };
    const d0 = rig(dad);
    const dad2: PersonProps = { ...dad, pose: { ...dad.pose, armF: { to: [d0.mouth[0] + 7, d0.mouth[1] + 1] }, handF: { shape: 'mitten', a: -80 } } };
    const d = rig(dad2);
    const kid = coverP({ x: 262, y: 224, s: 0.82, ...DC.kid, flip: true }, 0.55);
    return (
      <Scene2 bg="indoor">
        <rect x={166} y={0} width={154} height={191} fill="#dfe9e4" />
        <rect x={166} y={191} width={154} height={9} fill={shade('#dfe9e4', 0.1)} />
        <OG sh={[{ d: rrect(160, 0, 10, 240, 1), f: '#cfc4b2' }]} />
        <Door x={110} y={200} w={46} h={104} open />
        <Table x={194} y={224} w={116} h={68} />
        <Person {...kid} />
        <g opacity={0.45}>
          <Person x={128} y={222} s={0.7} {...DC.parent} pose={POSE.run} />
        </g>
        <No x={134} y={164} r={24} />
        <Person {...dad2} />
        <Waves x={d.mouth[0] + 2} y={d.mouth[1] - 22} n={3} r={9} a={-80} />
      </Scene2>
    );
  },

  'deprem-cocuk-el-tut': () => {
    const hand: P = [170, 160];
    const ad: PersonProps = { x: 132, y: 224, s: 1.1, ...DC.parent, pose: { ...POSE.stand, armF: { to: hand }, face: 'calm' } };
    const ch: PersonProps = { x: 204, y: 224, s: 1.05, ...DC.kid, sleeve: 'long', shoes: '#c6574e', pose: { ...POSE.stand, armB: { to: hand }, face: 'calm' } };
    const c = rig(ch);
    return (
      <Scene2 bg="outdoor">
        <Sign x={276} y={196} w={66} h={46} icon="people" pole={66} />
        <Tree x={36} y={196} s={0.9} />
        <Person {...ad} />
        <Person {...ch} over={(r) => (
          <g>
            <OG sh={[{ d: rrect(r.hipF[0] - 6, r.hipF[1] - 26, 15, 13, 1.5), f: shade(K.role.bystander2, 0.15) }, { d: rrect(r.hipF[0] - 3, r.hipF[1] - 34, 11, 13, 1.5), f: '#fff' }]} />
            <path d={`M${f1(r.hipF[0] - 1)} ${f1(r.hipF[1] - 30)}h6M${f1(r.hipF[0] - 1)} ${f1(r.hipF[1] - 26.5)}h5`} stroke={K.ink} stroke-width={1.3} />
          </g>
        )} />
        <Ring x={hand[0]} y={hand[1] + 2} r={12} c={K.safe} w={2.6} />
      </Scene2>
    );
  },

  'deprem-cocuk-sakinlestir': () => {
    const ch: PersonProps = { x: 150, y: 224, s: 0.95, ...DC.kid, pose: { ...POSE.standSide, face: 'calm' } };
    const c = rig(ch);
    const ad: PersonProps = {
      x: 206, y: 224, s: 1.05, ...DC.parent, flip: true,
      pose: { ...POSE.kneelOne, spine: -82, head: -96, armF: { to: [c.back[0] - 2, c.back[1] - 4] }, armB: { to: [c.back[0] + 4, c.back[1] + 10] }, face: 'calm' },
    };
    return (
      <Scene2 bg="outdoor">
        <Person x={40} y={190} s={0.6} who="oldwoman" role="bystander3" pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person x={72} y={192} s={0.6} who="man" role="bystander4" pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person x={290} y={188} s={0.58} who="woman" role="bystander" pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person {...ad} only={['legB', 'armB', 'torso', 'legF', 'head']} />
        <Person {...ch} over={(r) => (
          <OG sh={[{ d: smooth([[r.neck[0] - 14, r.neck[1] + 2], [r.neck[0] + 12, r.neck[1] - 2], [r.chest[0] + 8, r.chest[1] + 18], [r.kneeF[0] + 10, r.kneeF[1] + 10], [r.hip[0] - 16, r.kneeB[1] + 14], [r.back[0] - 8, r.back[1]]], true, 0.8), f: '#c1554b' }, { d: `M${f1(r.neck[0] - 4)} ${f1(r.neck[1] + 6)}L${f1(r.hip[0] - 4)} ${f1(r.kneeB[1] + 6)}`, st: shade('#c1554b', 0.25), sw: 1.6 }]} />
        )} />
        <Person {...ad} only={['armF']} />
        <Heart x={180} y={64} s={1.1} />
      </Scene2>
    );
  },

  'deprem-karyola': () => (
    <Scene2 bg="indoor" wall="#efe3d2">
      <Window x={240} y={50} w={64} h={60} />
      <Crib x={128} y={218} w={104} />
      <Ok x={180} y={92} r={14} />
      <Inset x={12} y={14} w={100} h={120} bg="#efe3d2">
        <rect x={12} y={110} width={100} height={30} fill={K.floor} />
        <Window x={30} y={24} w={40} h={34} />
        <Picture x={72} y={50} w={30} h={22} />
        <Crib x={24} y={120} w={84} />
        <No x={62} y={78} r={38} />
      </Inset>
    </Scene2>
  ),

  /* ───────── deprem-yuksek-bina ───────── */
  'deprem-yuksek-pencere-uzak': () => {
    const p: PersonProps = { x: 170, y: 224, s: 1.05, ...YB, pose: { ...POSE.walk, face: 'worried' } };
    return (
      <Scene2 bg="indoor" wall="#e7e3dc">
        <rect x={0} y={20} width={110} height={180} fill="#bfe3f5" />
        <Skyline x={0} y={200} w={110} />
        <path d="M0 20H110V200M36 20V200M72 20V200M0 110H110" fill="none" stroke="#6d7480" stroke-width={4} />
        <Shake x1={12} x2={100} y={70} h={30} />
        <Table x={236} y={222} w={78} h={62} />
        <Person {...p} />
        <Arrow from={[208, 120]} to={[262, 120]} w={7} />
      </Scene2>
    );
  },

  'deprem-asansor-dugme': () => {
    const btn: P[] = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) btn.push([70 + j * 32, 60 + i * 30]);
    const target = btn[9];
    const h0 = { x: 0, y: 0, a: -55, s: 0.95, pose: 'point' as const, side: 'R' as const };
    const tip0 = handPoint(h0, 'tip');
    const h = { ...h0, x: target[0] - tip0[0], y: target[1] - tip0[1] };
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill="#c9d0d6" />
        <OG sh={[{ d: rrect(44, 30, 84, 188, 6), f: '#a3adb8' }]} />
        {btn.map((b, i) => (
          <g key={i}>
            <circle cx={b[0]} cy={b[1]} r={11} fill="#ffe28a" stroke={K.out} stroke-width={1.5} />
            <circle cx={b[0]} cy={b[1]} r={15} fill="none" stroke="#ffd64a" stroke-width={2} opacity={0.6} />
          </g>
        ))}
        {/* kapı aralığı */}
        <rect x={196} y={20} width={110} height={210} fill="#d8ccb8" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(196, 20, 26, 210, 1), f: '#b8c0c9' }, { d: rrect(280, 20, 26, 210, 1), f: '#b8c0c9' }]} />
        <Arrow from={[230, 126]} to={[276, 126]} w={7} />
        <Hand {...h} arm={120} sleeve={K.role.helper} skin={0} />
      </Scene2>
    );
  },

  'deprem-merdiven-in': () => {
    // merdiven sağ üstten sol alta iner
    const stepW = 34, stepH = 17, n = 8;
    const x0 = 10, y0 = 230;
    const stepTop = (i: number): P => [x0 + i * stepW, y0 - (i + 1) * stepH];
    let d = `M${x0} ${y0}`;
    for (let i = 0; i < n; i++) d += `V${y0 - (i + 1) * stepH}h${stepW}`;
    d += `V${y0}Z`;
    const ppl: { i: number; who: PersonProps['who']; role: PersonProps['role']; hair?: PersonProps['hair']; hairC?: string; skin: number }[] = [
      { i: 1, who: 'man', role: 'bystander', skin: 2 },
      { i: 3, who: 'woman', role: 'helper', hair: 'long', hairC: K.hair.auburn, skin: 0 },
      { i: 5, who: 'oldman', role: 'bystander3', skin: 0 },
    ];
    const rail = (x: number) => y0 - ((x - x0) / stepW) * stepH - 66;
    return (
      <Scene2 bg="indoor" wall="#d9d7cf" gy={240}>
        <path d={d} fill="#bdb7ab" stroke={K.out} stroke-width={1.5} />
        <path d={Array.from({ length: n }, (_, i) => `M${x0 + i * stepW} ${y0 - (i + 1) * stepH}h${stepW}`).join('')} stroke={shade('#bdb7ab', 0.3)} stroke-width={3} />
        {[0, 2, 4, 6, 8].map((i) => <path key={i} d={`M${x0 + i * stepW + 4} ${y0 - i * stepH - 2}V${rail(x0 + i * stepW + 4)}`} stroke="#8d97a3" stroke-width={2.6} />)}
        {ppl.map((q, k) => {
          const st = stepTop(q.i);
          const px = st[0] + stepW * 0.5;
          const hand: P = [px - 12, rail(px - 12) + 1];
          return <Person key={k} x={px} y={st[1] + 1} s={0.74} flip who={q.who} role={q.role} hair={q.hair} hairC={q.hairC} skin={q.skin} pose={{ ...POSE.walk, spine: -84, armF: { to: hand }, handF: 'fist', face: 'neutral' }} />;
        })}
        <path d={`M${x0} ${rail(x0)}L${x0 + n * stepW} ${rail(x0 + n * stepW)}`} stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={`M${x0} ${rail(x0)}L${x0 + n * stepW} ${rail(x0 + n * stepW)}`} stroke="#6d7480" stroke-width={3.5} stroke-linecap="round" />
        <Chunk x={x0 + 2.5 * stepW} y={y0 - 3 * stepH - 4} w={14} h={8} seed={2} />
        <Chunk x={x0 + 6.6 * stepW} y={y0 - 7 * stepH - 4} w={16} h={9} seed={5} />
        <GArrow from={[300, 40]} to={[250, 84]} />
      </Scene2>
    );
  },

  'deprem-yuksek-masa': () => masaAlti(YB),
  'deprem-yuksek-merdiven-asansor': () => merdivenAsansorsuz(YB),
  'deprem-yuksek-vurma': () => enkazVurma(YB),
  'deprem-sonrasi-merdiven': () => merdivenAsansorsuz(DS.adult),
  'deprem-sonrasi-toplanma': () => {
    const hand: P = [120, 146];
    const parent: PersonProps = { x: 84, y: 218, ...DS.adult, pose: { ...POSE.walk, armF: { to: hand }, face: 'neutral' } };
    const child: PersonProps = { x: 150, y: 218, s: 0.82, ...DS.kid, pose: { ...POSE.walk, armB: { to: hand }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={192} kind="pine" s={0.8} />
        <Sign x={250} y={214} w={78} h={56} pole={70} icon="people" />
        <Person {...parent} back={(r) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} color="#c0603e" />} />
        <Person {...child} back={(r) => <Backpack x={r.back[0] - 7 * r.s} y={r.neck[1] + 4 * r.s} s={0.72 * r.s} color="#4f7fb0" />} />
        <Arrow from={[176, 120]} to={[206, 120]} w={5} />
      </Scene2>
    );
  },
};
