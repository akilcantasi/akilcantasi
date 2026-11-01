// Nükleer / kimyasal / biyolojik tehditler ve doğa (kaybolma, ısırık-sokma, hipotermi, dağ havası) sahneleri.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Bed, Blanket, Blood, Bottle, Car, Chair, Cloth, Door, Drop, Flashlight, Hand, K, Label, No, OG, OW, Ok,
  Person, Phone, POSE, Radio, Rock, Scene2, Smoke, Stairs, Table, Timer, Tree, Wall, Waves, Whistle, Window, capsule, circ, ell, handPoint, rig, rrect,
  shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Rig, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const RD = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * RD) * l, p[1] + Math.sin(a * RD) * l];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);

const GAS = '#c3cf45';
const COAT = '#6f8a55';
const MASKC = '#f7f7f2';
const TAPE = '#9ea6b0';

/** Ayrıntılı eli parmak ucu verilen noktaya gelecek şekilde konumlandırır. */
function handTip(tip: P, h: Omit<HandProps, 'x' | 'y'>, which: 'tip' | 'grip' | 'palm' | 'pinch' = 'tip'): HandProps {
  const p = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: tip[0] - p[0], y: tip[1] - p[1] };
}

/** Başın yerel koordinatlarında çizim (baş merkezi 0,0; yüz +x yönünde; baş yarıçapı ≈ 12). */
function HeadG({ r, children }: { r: Rig; children?: ComponentChildren }) {
  const k = r.headR / 12;
  return <g transform={`translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)}) scale(${f1((r.flip ? -k : k) * 1000) / 1000} ${f1(k * 1000) / 1000})`}>{children}</g>;
}
const strap = (d: string, k: number) => (
  <g fill="none" stroke-linecap="round">
    <path d={d} stroke={K.out} stroke-width={2.6 / Math.max(k, 0.5)} />
    <path d={d} stroke="#e4e4dc" stroke-width={1.4 / Math.max(k, 0.5)} />
  </g>
);

/** N95/FFP2 maske, önden. dy: aşağı kaydırma (çeneye yerleştirme), hang: lastikler sarkık */
function MaskF({ r, dy = 0, hang, wire = true }: { r: Rig; dy?: number; hang?: boolean; wire?: boolean }) {
  const k = r.headR / 12;
  const y = (v: number) => v + dy;
  const cup = smooth([[-9.6, y(2.6)], [0, y(0.6)], [9.6, y(2.6)], [10.6, y(8.4)], [6.2, y(15.6)], [0, y(17.2)], [-6.2, y(15.6)], [-10.6, y(8.4)]], true, 0.85);
  return (
    <HeadG r={r}>
      {hang
        ? strap(`M-10 ${y(5)}C-15 ${y(20)} -12 ${y(30)} -7 ${y(28)}C-4 ${y(24)} -7 ${y(16)} -9.4 ${y(12)}M10 ${y(5)}C15 ${y(20)} 12 ${y(30)} 7 ${y(28)}C4 ${y(24)} 7 ${y(16)} 9.4 ${y(12)}`, k)
        : strap(`M-9.6 ${y(3.4)}L-12.4 ${y(-3.5)}M9.6 ${y(3.4)}L12.4 ${y(-3.5)}M-10 ${y(11)}L-11.6 ${y(14.5)}M10 ${y(11)}L11.6 ${y(14.5)}`, k)}
      <OG ow={OW / k} sh={[{ d: cup, f: MASKC }, { d: `M0 ${y(1)}V${y(16.8)}`, st: '#cfcfc6', sw: 0.9 }, { d: `M-8.6 ${y(9)}Q0 ${y(10.6)} 8.6 ${y(9)}`, st: '#dcdcd3', sw: 0.7 }]} />
      {wire && <path d={`M-5.4 ${y(2.4)}Q0 ${y(0.6)} 5.4 ${y(2.4)}`} fill="none" stroke="#7d8794" stroke-width={1.5} stroke-linecap="round" />}
    </HeadG>
  );
}
/** N95 maske, yandan (profil) — üst lastik tepeye yakın, alt lastik ensede */
function MaskS({ r, off = 0, straps = true }: { r: Rig; off?: number; straps?: boolean }) {
  const k = r.headR / 12;
  const cup = smooth([[4 + off, -1.6], [11 + off, -2.2], [15.8 + off, 4], [13.8 + off, 11.2], [7 + off, 14.6], [3 + off, 10.4]], true, 0.85);
  return (
    <HeadG r={r}>
      {straps && strap(`M${4 + off} -0.4L-12.2 -7.4M${4.4 + off} 10L-9.6 9.6`, k)}
      <OG ow={OW / k} sh={[{ d: cup, f: MASKC }, { d: `M${10.5 + off} -1.8Q${13 + off} 5 ${10 + off} 13.6`, st: '#d4d4cb', sw: 0.8 }]} />
      <path d={`M${5 + off} -1.4Q${9 + off} -2.8 ${12 + off} -1.2`} fill="none" stroke="#7d8794" stroke-width={1.4} stroke-linecap="round" />
    </HeadG>
  );
}

/** Ek çerçeve (beyaz kart + kırpma) */
let insetUid = 0;
function Inset({ x, y, w, h, children, bg = '#fff' }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; bg?: string }) {
  const id = 'nd-in-' + ++insetUid;
  return (
    <g>
      <rect x={x - 1} y={y + 2} width={w + 2} height={h + 2} rx={11} fill="#000" opacity={0.18} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={bg} />
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={10} />
      </clipPath>
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Bulut. x,y = taban ortası, w genişlik */
function Cloud({ x, y, w = 100, color = '#e9eef3' }: { x: number; y: number; w?: number; color?: string }) {
  const k = w / 100;
  const d = `M${x - 46 * k} ${y}C${x - 62 * k} ${y} ${x - 62 * k} ${y - 26 * k} ${x - 42 * k} ${y - 28 * k}C${x - 40 * k} ${y - 48 * k} ${x - 14 * k} ${y - 54 * k} ${x - 4 * k} ${y - 40 * k}C${x + 6 * k} ${y - 62 * k} ${x + 40 * k} ${y - 58 * k} ${x + 40 * k} ${y - 30 * k}C${x + 60 * k} ${y - 30 * k} ${x + 62 * k} ${y} ${x + 46 * k} ${y}Z`;
  return <OG sh={[{ d, f: color }, { d: `M${x - 40 * k} ${y - 7 * k}H${x + 44 * k}`, st: shade(color, 0.15), sw: 3.5 * k }]} />;
}
/** Şimşek. x,y = üst uç */
function Bolt({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[{ d: 'M0 0L-13 38H-2L-16 80L18 28H6L15 0Z', f: '#ffd84a' }, { d: 'M6 28H18L-16 80Z', f: '#f2b72a', no: true }]} />
    </G>
  );
}
/** Kar / yağmur çizgileri */
function Streaks({ x1, x2, y1, y2, n = 24, seed = 3, c = '#ffffff', dx = -4, dy = 12, w = 1.8 }: { x1: number; x2: number; y1: number; y2: number; n?: number; seed?: number; c?: string; dx?: number; dy?: number; w?: number }) {
  let v = seed * 7919 + 17;
  const rnd = () => ((v = (v * 9301 + 49297) % 233280) / 233280);
  const d = Array.from({ length: n }, () => `M${f1(x1 + rnd() * (x2 - x1))} ${f1(y1 + rnd() * (y2 - y1))}l${dx} ${dy}`).join('');
  return <path d={d} stroke={c} stroke-width={w} stroke-linecap="round" opacity={0.85} />;
}
/** Rüzgâr çizgileri (yatay kıvrımlı) */
function Breeze({ x, y, len = 50, n = 3, gap = 10, c = '#ffffff', dir = 1, w = 2.6 }: { x: number; y: number; len?: number; n?: number; gap?: number; c?: string; dir?: 1 | -1; w?: number }) {
  return (
    <g fill="none" stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const yy = y + (i - (n - 1) / 2) * gap;
        const l = len * (i === 1 ? 1 : 0.75);
        const d = `M${x} ${yy}q${(dir * l) / 4} -5 ${(dir * l) / 2} 0t${(dir * l) / 2} 0`;
        return (
          <g key={i}>
            <path d={d} stroke={K.out} stroke-width={w + 2} opacity={0.5} />
            <path d={d} stroke={c} stroke-width={w} />
          </g>
        );
      })}
    </g>
  );
}
/** Sıcaklık işareti (küçük turuncu dalgalar) */
function Heat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const d = [-6, 0, 6].map((dx) => `M${f1(x + dx * s)} ${f1(y)}q${-3 * s} ${-4 * s} 0 ${-8 * s}t0 ${-8 * s}`).join('');
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke={K.out} stroke-width={4.4 * s} />
      <path d={d} stroke={K.action} stroke-width={2.6 * s} />
    </g>
  );
}
/** Çift yönlü ölçü oku */
function Measure({ a, b, color = K.action }: { a: P; b: P; color?: string }) {
  const m: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return (
    <g>
      <Arrow from={m} to={a} w={4} color={color} />
      <Arrow from={m} to={b} w={4} color={color} />
    </g>
  );
}
/** Konum iğnesi. x,y = sivri uç */
function Pin({ x, y, s = 1, c = K.safe }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[{ d: 'M0 0C-4 -9 -12 -15 -12 -24A12 12 0 0 1 12 -24C12 -15 4 -9 0 0Z', f: c }, { d: circ([0, -24], 4.6), f: '#fff', ln: true }]} />
    </G>
  );
}
/** Şerit (bant) parçası: a→b, genişlik w */
function TapeStrip({ a, b, w = 10, c = TAPE }: { a: P; b: P; w?: number; c?: string }) {
  return <OG sh={[{ d: capsule(a, w / 2, b, w / 2), f: c }, { d: `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`, st: tint(c, 0.35), sw: 1.2 }]} />;
}
/** Bant rulosu (karşıdan). Merkez x,y */
function TapeRoll({ x, y, r = 12, c = TAPE }: { x: number; y: number; r?: number; c?: string }) {
  return <OG sh={[{ d: circ([x, y], r), f: c }, { d: circ([x, y], r * 0.55), f: '#e8dfcf', ln: true }, { d: `M${x - r * 0.75} ${y - r * 0.3}A${r * 0.8} ${r * 0.8} 0 0 1 ${x - r * 0.2} ${y - r * 0.78}`, st: tint(c, 0.4), sw: 1.6 }]} />;
}
/** Naylon poşet (ağzı açık). x,y = taban ortası */
function PlasticBag({ x, y, s = 1, c = '#dfe9ef' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-26 -44Q-30 -46 -24 -50L-14 -52Q-16 -58 -10 -60Q-6 -54 -8 -50H8Q6 -56 10 -60Q16 -58 14 -52L24 -50Q30 -46 26 -44L22 -4Q21 0 16 0H-16Q-21 0 -22 -4Z', f: c },
          { d: ell([0, -46], 24, 6), f: shade(c, 0.32) },
          { d: 'M-14 -36Q-12 -20 -16 -8M6 -34Q10 -20 8 -6', st: '#fff', sw: 2 },
        ]}
      />
    </G>
  );
}
/** Ayakkabı çifti (yerde) */
function ShoePair({ x, y, s = 1, c = K.shoe }: { x: number; y: number; s?: number; c?: string }) {
  const sh = (dx: number): Sh => ({ d: `M${dx - 12} 0Q${dx - 14} -8 ${dx - 6} -10L${dx + 4} -10Q${dx + 12} -9 ${dx + 14} -3Q${dx + 14} 0 ${dx + 10} 0Z`, f: c });
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[sh(-10), sh(16), { d: 'M-16 -10H-6M10 -10H20', st: tint(c, 0.4), sw: 1.4 }]} />
    </G>
  );
}
/** Şişe (şampuan vb). x,y = taban ortası */
function Flask({ x, y, s = 1, c = '#4fb3a8', cap = '#f4f1ea' }: { x: number; y: number; s?: number; c?: string; cap?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[{ d: rrect(-6, -50, 12, 9, 2), f: cap }, { d: 'M-12 -2V-34Q-12 -42 -4 -42H4Q12 -42 12 -34V-2Q12 0 10 0H-10Q-12 0 -12 -2Z', f: c }, { d: rrect(-8, -30, 16, 14, 2), f: '#fff', ln: true }, { d: 'M8 -38V-4', st: shade(c, 0.18), sw: 3 }]} />
    </G>
  );
}
/** Koltuk (kanepe), karşıdan. x = SOL, y = zemin */
function Sofa({ x, y, w = 150, c = '#7c8fbf' }: { x: number; y: number; w?: number; c?: string }) {
  const sd = shade(c, 0.16);
  return (
    <OG
      sh={[
        { d: rrect(x + 8, y - 86, w - 16, 52, 10), f: sd },
        { d: rrect(x + 6, y - 46, w - 12, 30, 6), f: c },
        { d: rrect(x, y - 62, 18, 48, 7), f: c },
        { d: rrect(x + w - 18, y - 62, 18, 48, 7), f: c },
        { d: rrect(x + 8, y - 16, 8, 16, 2), f: K.wood },
        { d: rrect(x + w - 16, y - 16, 8, 16, 2), f: K.wood },
      ]}
    />
  );
}
/** Duvar saati. Merkez */
function WallClock({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#5a6474' }, { d: circ([x, y], r * 0.82), f: '#fbfaf5', ln: true }]} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = pol([x, y], i * 30, r * 0.7), b = pol([x, y], i * 30, r * 0.62);
        return <path key={i} d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke={K.ink} stroke-width={1.4} />;
      })}
      <path d={`M${x} ${y}V${y - r * 0.55}M${x} ${y}L${x + r * 0.38} ${y + r * 0.12}`} stroke={K.ink} stroke-width={2.4} stroke-linecap="round" />
    </g>
  );
}
/** Perde (kapalı). x,y = SOL ÜST, w×h */
function Curtains({ x, y, w, h, c = '#c8614f' }: { x: number; y: number; w: number; h: number; c?: string }) {
  const half = w / 2;
  const panel = (x0: number): Sh[] => [
    { d: rrect(x0, y, half + 1, h, 2), f: c },
    { d: [0.25, 0.5, 0.75].map((t) => `M${f1(x0 + half * t)} ${y + 4}V${y + h - 2}`).join(''), st: shade(c, 0.22), sw: 1.6 },
  ];
  return <OG sh={[{ d: rrect(x - 6, y - 6, w + 12, 5, 2), f: '#8a6a4a' }, ...panel(x), ...panel(x + half - 1)]} />;
}
/** Kesik bina: dış kabuk + katlar + bodrum. Kat iç alanları (x0,y0,w,h) döner */
function sectionRooms(x: number, w: number, gy: number, floors: number, fh: number, bh: number) {
  const rooms: { x: number; y: number; w: number; h: number; floor: number }[] = [];
  for (let i = 0; i < floors; i++) rooms.push({ x: x + 7, y: gy - (i + 1) * fh + 5, w: w - 14, h: fh - 9, floor: i + 1 });
  rooms.unshift({ x: x + 7, y: gy + 4, w: w - 14, h: bh - 11, floor: 0 });
  return rooms;
}
function SectionShell({ x, w, gy, floors, fh, bh, wallC = '#e9e0d0' }: { x: number; w: number; gy: number; floors: number; fh: number; bh: number; wallC?: string }) {
  const H = floors * fh;
  const rooms = sectionRooms(x, w, gy, floors, fh, bh);
  return (
    <g>
      <OG sh={[{ d: rrect(x, gy - H - 4, w, H + bh + 4, 2), f: '#9b8f7f' }, { d: `M${x - 8} ${gy - H - 4}L${x + w / 2} ${gy - H - 26}L${x + w + 8} ${gy - H - 4}Z`, f: '#b5563f' }]} />
      {rooms.map((rm, i) => (
        <g key={i}>
          <rect x={rm.x} y={rm.y} width={rm.w} height={rm.h} fill={rm.floor === 0 ? '#ddd3c2' : wallC} />
          <rect x={rm.x} y={rm.y + rm.h - 4} width={rm.w} height={4} fill={K.floor} />
        </g>
      ))}
    </g>
  );
}
/** Kesitte dış duvardaki pencere */
const secWindow = (x: number, y: number, w = 7, h = 18) => <rect x={x} y={y} width={w} height={h} fill="#bfe3f5" stroke={K.out} stroke-width={1.2} />;

/** Engerek: kıvrılmış gövde + kalkık baş (sola bakar). x,y = taban ortası */
function Viper({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = '#a08a5c', dk = '#4a3c2a';
  const coil = (cy: number, rx: number, ry: number) => [{ d: ell([0, cy], rx, ry), f: c }, { d: ell([0, cy - 1], rx - 7, ry - 4), f: shade(c, 0.1), ln: true }];
  const zig = (cy: number, rx: number) => `M${-rx + 4} ${cy}l5 -3l5 3l5 -3l5 3l5 -3l5 3l5 -3l5 3l5 -3l5 3`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <OG ow={OW / s} sh={[...coil(-8, 30, 10), ...coil(-18, 22, 8)]} />
      <path d={zig(-3, 30)} transform="scale(0.98 1)" fill="none" stroke={dk} stroke-width={2.4} stroke-linejoin="round" />
      <OG ow={OW / s} sh={[{ d: 'M-6 -22C-10 -34 -14 -42 -22 -46', st: c, sw: 9 }, { d: 'M-6 -22C-10 -34 -14 -42 -22 -46', st: K.out, sw: 12 }].reverse()} />
      <path d="M-7 -25C-10 -33 -13 -40 -20 -44" fill="none" stroke={dk} stroke-width={2} stroke-dasharray="4 4" />
      <OG ow={OW / s} sh={[{ d: 'M-18 -52Q-24 -54 -34 -48Q-38 -45 -34 -43Q-26 -40 -18 -42Q-14 -47 -18 -52Z', f: c }]} />
      <circle cx={-27} cy={-48} r={1.6} fill={K.ink} />
      <path d="M-36 -45l-6 1M-42 44" stroke={K.danger} stroke-width={1.4} stroke-linecap="round" />
    </g>
  );
}
/** Sekizgen DUR tabelası (direkli). x = direk dibi, y = zemin */
function StopSign({ x, y, r = 20, pole = 56 }: { x: number; y: number; r?: number; pole?: number }) {
  const c: P = [x, y - pole - r];
  const pts = Array.from({ length: 8 }, (_, i) => pol(c, 22.5 + i * 45, r));
  const d = 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
  const pi = Array.from({ length: 8 }, (_, i) => pol(c, 22.5 + i * 45, r - 3.5));
  const di = 'M' + pi.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
  return (
    <g>
      <OG sh={[{ d: rrect(x - 3, y - pole - 2, 6, pole + 2, 1.5), f: K.metal }, { d, f: K.danger }, { d: di, f: 'none', st: '#fff', sw: 2 }]} />
      <text x={c[0]} y={c[1] + 5} text-anchor="middle" font-size={r * 0.62} font-weight={800} fill="#fff" font-family="'IBM Plex Sans', system-ui, sans-serif">DUR</text>
    </g>
  );
}
/** Emniyet şeridi a→b (sarı-siyah) */
function Cordon({ a, b }: { a: P; b: P }) {
  const d = `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
  return (
    <g fill="none">
      <path d={d} stroke={K.out} stroke-width={9} stroke-linecap="round" />
      <path d={d} stroke="#ffd23a" stroke-width={6} />
      <path d={d} stroke="#2b2d3a" stroke-width={6} stroke-dasharray="7 7" />
    </g>
  );
}
const Post = ({ x, y, h = 60 }: { x: number; y: number; h?: number }) => <OG sh={[{ d: rrect(x - 3, y - h, 6, h, 1.5), f: '#e85a3a' }, { d: rrect(x - 3, y - h + 12, 6, 6, 0), f: '#fff', no: true }]} />;

/** Sırt çantası (yere konmuş, ön görünüş). x,y = taban ortası */
function PackFront({ x, y, s = 1, c = '#c0603e' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[{ d: 'M-6 -46Q0 -52 6 -46', st: K.out, sw: 3 }, { d: 'M-18 -4V-34Q-18 -46 -6 -46H6Q18 -46 18 -34V-4Q18 0 14 0H-14Q-18 0 -18 -4Z', f: c }, { d: rrect(-13, -22, 26, 16, 4), f: shade(c, 0.12) }, { d: 'M-18 -32Q0 -26 18 -32', st: shade(c, 0.35), sw: 1.4 }]} />
    </G>
  );
}
/** Kol (yakın plan, yatay): a→b uzun kapsül deri + kol kapağı */
function ArmBar({ a, b, r = 34, skin = 1 }: { a: P; b: P; r?: number; skin?: number }) {
  return <OG sh={[{ d: capsule(a, r, b, r * 0.92), f: K.skin[skin] }, { d: `M${a[0]} ${a[1] + r * 0.55}L${b[0]} ${b[1] + r * 0.5}`, st: shade(K.skin[skin], 0.08), sw: r * 0.5 }]} />;
}

/** Yukarıdan insan simgesi (harita için) */
function TopPerson({ x, y, s = 1, a = 0, c = K.role.helper }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[{ d: capsule([4, -6], 3, [14, -8], 2.6), f: K.skin[1] }, { d: capsule([-4, 6], 3, [-13, 9], 2.6), f: K.skin[1] }, { d: ell([0, 0], 7, 11), f: c }, { d: circ([1, 0], 5.6), f: K.hair.dark }]} />
    </G>
  );
}

/* ════════════════════════ oyuncular (rehber başına sabit) ════════════════════════ */
type Cast = Pick<PersonProps, 'who' | 'role' | 'skin' | 'hair' | 'hairC' | 'top' | 'bottom' | 'bottomC' | 'glasses' | 'sleeve'>;
/** hipotermi: üşüyen adam + yardım eden kadın */
const HIP = {
  victim: { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.denim } as Cast,
  helper: { who: 'woman', role: 'helper', skin: 1, hair: 'ponytail', hairC: K.hair.black, bottomC: K.pants.dark } as Cast,
};
/** ormanda kaybolma: tek yürüyüşçü (kadın) */
const KAY = { hiker: { who: 'woman', role: 'helper', skin: 1, hair: 'ponytail', hairC: K.hair.brown, bottomC: K.pants.dark } as Cast };
/** yılan/akrep/arı: ısırılan adam + yardım eden kadın */
const ISR = {
  victim: { who: 'man', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.dark, bottomC: K.pants.denim } as Cast,
  helper: { who: 'woman', role: 'helper', skin: 2, hair: 'long', hairC: K.hair.black, bottomC: K.pants.dark } as Cast,
};
/** dağda hava: yürüyüşçü adam + arkadaşı */
const HAV = {
  hiker: { who: 'man', role: 'helper', skin: 1, hair: 'short', hairC: K.hair.dark, bottomC: K.pants.denim } as Cast,
  friend: { who: 'woman', role: 'bystander2', skin: 0, hair: 'ponytail', hairC: K.hair.brown, bottomC: K.pants.dark } as Cast,
};
/** doğada yalnız yaralanma: tek yaralı adam */
const YAL = { victim: { who: 'man', role: 'victim', skin: 2, hair: 'short', hairC: K.hair.black, bottomC: K.pants.khaki } as Cast };
/** nükleer radyasyon: anne + kızı */
const RAD = {
  mom: { who: 'woman', role: 'helper', skin: 1, hair: 'long', hairC: K.hair.black, bottomC: K.pants.dark } as Cast,
  girl: { who: 'girl', role: 'bystander2', skin: 1, hair: 'ponytail', hairC: K.hair.brown } as Cast,
};
/** kimyasal sızıntı ve korunma odası: aynı kadın (+ oğlu) */
const KIM = {
  main: { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.black, bottomC: K.pants.dark } as Cast,
  boy: { who: 'boy', role: 'bystander3', skin: 1, hair: 'short', hairC: K.hair.black } as Cast,
};
/** salgın: hasta adam + bakan kadın + çocuk */
const SAL = {
  patient: { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.grey } as Cast,
  carer: { who: 'woman', role: 'helper', skin: 2, hair: 'bun', hairC: K.hair.dark, bottomC: K.pants.dark } as Cast,
  boy: { who: 'boy', role: 'bystander2', skin: 2, hair: 'short', hairC: K.hair.black } as Cast,
};
/** patlama sonrası: kadın */
const PAT = { main: { who: 'woman', role: 'helper', skin: 2, hair: 'long', hairC: K.hair.black, bottomC: K.pants.dark } as Cast };
/** maske: tek kişi */
const MSK = { main: { who: 'woman', role: 'bystander', skin: 1, hair: 'bun', hairC: K.hair.dark, bottomC: K.pants.dark } as Cast };

/** Düdük yakın planı (oyuncuya göre). debris: enkaz altında */
function WhistleScene({ cast, debris }: { cast: Cast; debris?: boolean }) {
  const p: PersonProps = { ...cast, x: 104, y: 120, ax: 'head', ay: 'head', s: 2.5, pose: { ...POSE.standSide, face: 'closed' } };
  const r = rig(p);
  const wx = r.mouth[0] + 22, wy = r.mouth[1] + 2;
  const rc: P = [262, 158], rr = 22;
  const q = (a: number): P => [rc[0] + rr * Math.cos(a * RD), rc[1] + rr * Math.sin(a * RD)];
  const [x0, y0] = q(-50), [x1, y1] = q(206);
  const e = q(210);
  const d: P = [Math.cos(300 * RD), Math.sin(300 * RD)];
  const n: P = [-d[1], d[0]];
  const tip: P = [e[0] + d[0] * 19, e[1] + d[1] * 19];
  return (
    <Scene2 bg={debris ? 'dark' : 'closeup'}>
      {debris && (
        <g>
          <rect width={320} height={240} fill="#5d5650" />
          <OG sh={[{ d: 'M-10 -10H330V34L250 46L170 30L90 50L-10 38Z', f: '#9a948a' }, { d: 'M40 40L120 52M200 36L260 44', st: shade('#9a948a', 0.3), sw: 2 }]} />
          <OG sh={[{ d: 'M-10 214L60 196L120 208L200 192L260 204L330 196V250H-10Z', f: '#8a847a' }]} />
          <OG sh={[{ d: capsule([200, 70], 5, [330, 70], 5), f: K.metal }]} />
        </g>
      )}
      <Person {...p} only={['torso', 'head']} />
      <Whistle x={wx} y={wy} s={1.3} />
      {[0, 1, 2].map((i) => (
        <Waves key={i} x={wx + 26 + i * 30} y={wy - 4 - i * 10} a={-12} n={2} r={7} w={3.6} />
      ))}
      <Label x={262} y={debris ? 112 : 42} text="6× / 1 dk" size={17} />
      <path d={`M${f1(x0)} ${f1(y0)}A${rr} ${rr} 0 1 1 ${f1(x1)} ${f1(y1)}`} fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" />
      <path d={`M${f1(tip[0])} ${f1(tip[1])}L${f1(e[0] + n[0] * 9 - d[0] * 3)} ${f1(e[1] + n[1] * 9 - d[1] * 3)}L${f1(e[0] - n[0] * 9 - d[0] * 3)} ${f1(e[1] - n[1] * 9 - d[1] * 3)}Z`} fill={K.action} stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
    </Scene2>
  );
}

const SOIL = '#a9784a', SOILD = '#8a5d36';
/** Soğuk zeminden ayrılma: yaprak/dal yatağı üstünde oturan kişi, topraktan yükselen soğuk okları katmanda kesiliyor. */
function GroundScene({ cast, splint, pack }: { cast: Cast; splint?: boolean; pack?: boolean }) {
  const gt = 180;
  const lay = gt - 22;
  const p: PersonProps = { ...cast, x: 140, y: lay, s: 1.3, pose: { ...POSE.sitFloor, face: splint ? 'pain' : 'neutral' } };
  const r = rig(p);
  const dir = Math.atan2(r.ankleF[1] - r.hipF[1], r.ankleF[0] - r.hipF[0]) / RD;
  const up = (q: P, dd: number) => pol(q, dir - 90, dd);
  const a0 = pol(r.kneeF, dir, -18), a1 = pol(r.ankleF, dir, 8);
  return (
    <Scene2 bg="outdoor" gy={gt}>
      <rect y={gt} width={320} height={240 - gt} fill={SOIL} />
      <rect y={gt} width={320} height={3} fill={SOILD} />
      {[[30, 204], [70, 226], [118, 212], [250, 230], [292, 206], [210, 216], [160, 232]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={SOILD} />)}
      <Tree x={292} y={gt} kind="pine" s={0.8} />
      {pack && <Backpack x={86} y={gt - 30} s={0.95} />}
      <OG sh={[{ d: `M70 ${gt}Q66 ${lay - 4} 86 ${lay - 4}H264Q282 ${lay - 4} 280 ${gt}Z`, f: '#b5783a' }]} />
      {Array.from({ length: 30 }, (_, i) => {
        const x = 82 + ((i * 37) % 190), y = gt - 5 - ((i * 13) % 17);
        const col = ['#d08a3c', '#a8632c', '#e0b050', '#6d8f3e'][i % 4];
        return <ellipse key={i} cx={x} cy={y} rx={8} ry={3.6} transform={`rotate(${((i * 41) % 60) - 30} ${x} ${y})`} fill={col} stroke={shade(col, 0.35)} stroke-width={0.9} />;
      })}
      {splint && <OG sh={[{ d: capsule(up(a0, 8), 3, up(a1, 8), 3), f: '#9a6a3e' }]} />}
      <Person {...p} />
      {splint && (
        <g>
          <OG sh={[{ d: capsule(up(a0, -8), 3, up(a1, -8), 3), f: '#9a6a3e' }]} />
          {[0.25, 0.8].map((t) => {
            const c: P = [a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t];
            return <OG key={t} sh={[{ d: capsule(up(c, -11), 4.5, up(c, 11), 4.5), f: K.cloth }]} />;
          })}
        </g>
      )}
      {[120, 190, 250].map((x) => (
        <g key={x}>
          <Arrow from={[x, 234]} to={[x, gt + 8]} w={4} color={K.water} />
          <line x1={x - 12} y1={gt + 2} x2={x + 12} y2={gt + 2} stroke="#fff" stroke-width={4} stroke-linecap="round" />
        </g>
      ))}
      <Arrow from={[34, 232]} to={[34, 150]} w={4} color={K.water} />
    </Scene2>
  );
}

/** Kalp masajı (kit örneğindeki doğru teknik), verilen oyuncularla. */
function CprScene({ victim, helper }: { victim: Cast; helper: Cast }) {
  const vic: PersonProps = { ...victim, x: 168, y: 228, s: 1.25, pose: POSE.lieBack };
  const v = rig(vic);
  const c: P = [v.chest[0], v.chest[1]];
  const resc: PersonProps = {
    ...helper, x: c[0], ax: 'wristF', y: 225, s: 1.25, flip: true,
    pose: { spine: -60, chest: -58, head: -40, legB: [92, 182], legF: [86, 180], armB: [90, 90], armF: [90, 90], handB: { shape: 'flat', a: -90 }, handF: { shape: 'flat', a: -86 }, face: 'neutral' },
  };
  const r = rig(resc);
  return (
    <Scene2 bg="outdoor" ground="snow">
      <rect width={320} height={186} fill="#b9c4cf" />
      <Tree x={292} y={196} kind="pine" s={0.8} color="#3f7a62" />
      <Person {...resc} />
      <Person {...vic} />
      <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${c[1] - 4}`} stroke="#fff" stroke-width={3.4} stroke-dasharray="5 5" opacity={0.9} />
      <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${c[1] - 4}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="5 5" />
      <Arrow from={[c[0] - 34, 136]} to={[c[0] - 34, 184]} />
      <Label x={252} y={36} text="100–120/dk" size={15} />
    </Scene2>
  );
}

/** Şüpheli paket: masada açık zarf (beyaz toz) ve sahipsiz çanta; kişi dokunmadan kapıya yürüyor. */
function SuspectScene({ cast }: { cast: Cast }) {
  return (
    <Scene2 bg="indoor">
      <Table x={18} y={214} w={130} h={64} />
      <OG sh={[{ d: 'M36 150L78 146L82 128L44 126Z', f: '#efe4c8' }, { d: 'M36 150L58 136L78 146', st: '#c8b894', sw: 1.4 }, { d: 'M44 126L60 116L82 128', f: '#e3d4b0' }]} />
      <path d="M70 150Q88 144 98 150Q90 156 70 150Z" fill="#fff" stroke="#c9c9c2" stroke-width={1} />
      <g fill="#fff">
        <circle cx={96} cy={146} r={1.6} />
        <circle cx={102} cy={149} r={1.3} />
        <circle cx={88} cy={142} r={1.2} />
      </g>
      <OG sh={[{ d: 'M108 150V128Q108 124 112 124H138Q142 124 142 128V150Z', f: '#5b4a3e' }, { d: 'M116 124Q116 112 125 112Q134 112 134 124', st: K.out, sw: 3 }, { d: 'M108 136H142', st: shade('#5b4a3e', 0.3), sw: 1.5 }]} />
      <Hand x={34} y={58} a={145} s={0.66} pose="open" side="R" view="palm" skin={cast.skin} arm={70} sleeve={K.role[cast.role ?? 'helper']} />
      <No x={54} y={84} r={30} />
      <Door x={250} y={212} w={56} h={116} open />
      <Person {...cast} x={190} y={228} pose={{ ...POSE.walk, face: 'worried' }} />
      <Arrow from={[214, 112]} to={[252, 112]} />
    </Scene2>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ─────────── nükleer-radyasyon ─────────── */
  'nukleer-bina-gir': () => {
    const hand: P = [148, 160];
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Smoke kind="cloud" x={14} y={34} w={120} h={46} color="#cdbf86" op={0.95} />
        <Smoke kind="cloud" x={60} y={22} w={70} h={34} color="#b9ad80" op={0.9} />
        <Wall x={196} y={216} w={134} h={210} kind="brick" color="#d9a57c" />
        <Window x={206} y={28} w={42} h={40} />
        <Window x={268} y={28} w={42} h={40} />
        <Door x={232} y={216} w={54} h={100} open />
        <Car x={52} y={222} s={0.6} color="#5b84c4" />
        <No x={52} y={198} r={20} />
        <Person {...RAD.girl} x={124} y={228} pose={{ ...POSE.walk, armF: { to: hand }, face: 'worried' }} />
        <Person {...RAD.mom} x={170} y={228} pose={{ ...POSE.walk, armB: { to: hand }, face: 'neutral' }} />
        <Arrow from={[192, 136]} to={[246, 136]} />
      </Scene2>
    );
  },

  'nukleer-bina-ortasi': () => {
    const gy = 168, X = 34, W = 252, fh = 44, bh = 58;
    const rooms = sectionRooms(X, W, gy, 3, fh, bh);
    const f2 = rooms[2], b = rooms[0];
    const fade = (x: number, y: number, w: number, h: number) => <rect x={x} y={y} width={w} height={h} fill="#ffffff" opacity={0.55} />;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect y={gy} width={320} height={240 - gy} fill="#a88b66" />
        <rect y={gy} width={320} height={3} fill="#7c6447" />
        <SectionShell x={X} w={W} gy={gy} floors={3} fh={fh} bh={bh} />
        {rooms.slice(1).map((rm, i) => (
          <g key={i}>
            {secWindow(X, rm.y + 8)}
            {secWindow(X + W - 7, rm.y + 8)}
          </g>
        ))}
        {/* orta kattaki iç oda */}
        <rect x={118} y={f2.y} width={84} height={f2.h - 4} fill="#cdeccf" />
        <rect x={112} y={f2.y} width={6} height={f2.h} fill="#9b8f7f" stroke={K.out} stroke-width={1} />
        <rect x={202} y={f2.y} width={6} height={f2.h} fill="#9b8f7f" stroke={K.out} stroke-width={1} />
        {/* bodrum vurgusu */}
        <rect x={b.x} y={b.y} width={b.w} height={b.h - 4} fill="#cdeccf" />
        {/* soluk alanlar: çatı katı ve pencere kenarları */}
        {fade(rooms[3].x, rooms[3].y, rooms[3].w, rooms[3].h)}
        {fade(f2.x, f2.y, 71, f2.h)}
        {fade(208, f2.y, X + W - 7 - 208, f2.h)}
        {fade(rooms[1].x, rooms[1].y, 46, rooms[1].h)}
        {fade(X + W - 53, rooms[1].y, 46, rooms[1].h)}
        <Person {...RAD.mom} x={128} y={b.y + b.h - 3} s={0.44} pose={POSE.sitFloor} face="neutral" />
        <Person {...RAD.girl} x={178} y={b.y + b.h - 3} s={0.44} pose={POSE.sitFloor} face="neutral" />
        <Ok x={160} y={f2.y - 2} r={11} />
        <Ok x={246} y={b.y + 20} r={12} />
      </Scene2>
    );
  },

  'nukleer-giysi-cikar': () => {
    const p: PersonProps = { ...RAD.mom, x: 140, y: 228, s: 1.12, shoes: null, pose: { ...POSE.stand, armB: [112, 122], armF: [68, 58], face: 'neutral' } };
    const r = rig(p);
    const eB = r.elbowB, eF = r.elbowF;
    const coatBack = smooth([[eB[0] - 4, eB[1] - 10], [r.hip[0], eB[1] - 2], [eF[0] + 4, eF[1] - 10], [eF[0] + 10, r.hip[1] + 26], [r.hip[0], r.hip[1] + 32], [eB[0] - 10, r.hip[1] + 26]], true, 0.6);
    const sleeve = (a: P, b: P) => capsule(a, 7.4, b, 6.6);
    return (
      <Scene2 bg="indoor">
        <Door x={22} y={204} w={58} h={118} open />
        <Person
          {...p}
          under={() => <OG sh={[{ d: coatBack, f: COAT }, { d: `M${eB[0]} ${eB[1] - 6}Q${r.hip[0]} ${eB[1] + 6} ${eF[0]} ${eF[1] - 6}`, st: shade(COAT, 0.3), sw: 2 }]} />}
          over={(q) => <OG sh={[{ d: sleeve(q.elbowB, q.wristB), f: COAT }, { d: sleeve(q.elbowF, q.wristF), f: COAT }]} />}
        />
        <ShoePair x={74} y={226} s={0.9} />
        <PlasticBag x={262} y={228} s={1.1} />
        <Arrow from={[eF[0] + 26, eF[1] + 4]} to={[250, 168]} bend={-0.25} />
      </Scene2>
    );
  },

  'nukleer-dus-sampuan': () => {
    const p: PersonProps = { ...RAD.mom, x: 150, y: 112, ax: 'head', ay: 'head', s: 2.3, top: K.skin[1], sleeve: 'none', hair: 'none', pose: { view: 'side', spine: -90, head: -96, armB: { at: 'head', d: [-6, -12] }, armF: { at: 'head', d: [4, -13] }, handB: 'mitten', handF: 'mitten', face: 'closed' } };
    const r = rig(p);
    const foam = [[-12, -16], [-4, -20], [5, -19], [12, -14], [-14, -8], [-6, -24], [2, -25], [-16, 0], [-12, 8], [-8, -12], [0, -14], [8, -10], [-17, -12]].map(([dx, dy]) => [r.head[0] + dx * 1.9, r.head[1] + dy * 1.6] as P);
    const tiles = [];
    for (let x = 0; x < 320; x += 32) tiles.push(<path key={'v' + x} d={`M${x} 0V240`} />);
    for (let y = 0; y < 240; y += 32) tiles.push(<path key={'h' + y} d={`M0 ${y}H320`} />);
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill="#d6e8ef" />
        <g stroke="#b9d0da" stroke-width={1.6}>{tiles}</g>
        <OG sh={[{ d: capsule([40, 14], 3.5, [92, 14], 3.5), f: K.metal }, { d: 'M84 8L108 14L104 30L80 22Z', f: K.metal }, { d: rrect(97, 6, 22, 30, 4), f: '#c5ccd4', t: 'rotate(22 108 21)' }]} />
        <g stroke={K.water} stroke-width={2.4} stroke-linecap="round" opacity={0.85}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${108 + i * 4} ${36 + i}L${122 + i * 9} ${74 + (i % 2) * 6}`} />
          ))}
        </g>
        <Person {...p} only={['armB', 'torso', 'head']} />
        <g>
          {foam.map((f, i) => (
            <circle key={i} cx={f[0]} cy={f[1]} r={6 + (i % 3) * 2} fill="#fff" stroke="#b9cbd6" stroke-width={1.2} />
          ))}
        </g>
        <Person {...p} only={['armF']} />
        <OG sh={[{ d: rrect(222, 166, 92, 8, 2), f: '#f4f1ea' }]} />
        <Flask x={244} y={166} s={1} c="#3fa58f" />
        <Flask x={288} y={166} s={1} c="#e58fb0" />
        <Ok x={244} y={100} r={12} />
        <No x={288} y={140} r={22} />
      </Scene2>
    );
  },

  'nukleer-iceride-24-saat': () => {
    const sy = 214;
    return (
      <Scene2 bg="indoor" gy={sy}>
        <Window x={22} y={46} w={82} h={74} />
        <Curtains x={18} y={44} w={90} h={84} />
        <WallClock x={164} y={50} r={22} />
        <Label x={164} y={90} text="24 sa" size={15} />
        <Door x={256} y={sy} w={50} h={116} />
        <No x={281} y={146} r={24} />
        <Sofa x={66} y={sy + 10} w={182} />
        <Person {...RAD.mom} x={118} y={sy} s={0.92} pose={{ ...POSE.sitChair, armF: [70, 0] }} face="neutral" />
        <Person {...RAD.girl} x={190} y={sy} s={0.92} pose={POSE.sitChair} face="neutral" />
      </Scene2>
    );
  },

  /* ─────────── kimyasal-sızıntı ─────────── */
  'nukleer-kimyasal-yana-kac': () => {
    const cloud = smooth([[60, 34], [110, 22], [170, 30], [214, 46], [228, 82], [206, 120], [150, 128], [96, 108], [62, 74]], true, 0.9);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#a7cf84" />
        <path d="M0 196H320" stroke="#c9c3b5" stroke-width={22} />
        <path d="M0 196H320" stroke="#fff" stroke-width={1.6} stroke-dasharray="10 8" />
        <path d="M262 0V240" stroke="#c9c3b5" stroke-width={18} />
        <OG sh={[{ d: rrect(14, 16, 64, 46, 3), f: '#8f98a5' }, { d: rrect(20, 22, 24, 34, 2), f: '#b0b7c1', ln: true }, { d: circ([64, 30], 9), f: '#4a505c' }, { d: circ([64, 30], 4.5), f: '#2a2e36', no: true }]} />
        <OG sh={[{ d: cloud, f: GAS, op: 0.85 }]} />
        <path d={cloud} fill="none" stroke="#9aa52f" stroke-width={2} stroke-dasharray="6 5" />
        <Arrow from={[96, 62]} to={[136, 62]} w={4} color="#ffffff" />
        <Arrow from={[120, 96]} to={[160, 96]} w={4} color="#ffffff" />
        <Arrow from={[166, 56]} to={[206, 56]} w={4} color="#ffffff" />
        <path d="M250 84L200 84" stroke={K.danger} stroke-width={4} stroke-dasharray="6 5" stroke-linecap="round" />
        <No x={218} y={84} r={15} />
        <TopPerson x={262} y={84} s={1.5} a={90} c={K.role.helper} />
        <Arrow from={[262, 108]} to={[262, 168]} w={7} />
      </Scene2>
    );
  },

  'nukleer-ust-kat-ic-oda': () => {
    const gy = 168, X = 30, W = 260, fh = 44, bh = 58;
    const rooms = sectionRooms(X, W, gy, 3, fh, bh);
    const top = rooms[3], f1r = rooms[1], b = rooms[0];
    const gasTop = f1r.y + f1r.h * 0.45;
    const gas = `M${b.x} ${gasTop}q15 -5 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0V${b.y + b.h - 4}H${b.x}Z`;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect y={gy} width={320} height={240 - gy} fill="#a88b66" />
        <SectionShell x={X} w={W} gy={gy} floors={3} fh={fh} bh={bh} />
        {rooms.slice(1).map((rm, i) => (
          <g key={i}>
            {secWindow(X, rm.y + 8)}
            {secWindow(X + W - 7, rm.y + 8)}
          </g>
        ))}
        <rect x={118} y={top.y} width={86} height={top.h - 4} fill="#cdeccf" />
        <rect x={112} y={top.y} width={6} height={top.h} fill="#9b8f7f" stroke={K.out} stroke-width={1} />
        <rect x={204} y={top.y} width={6} height={top.h} fill="#9b8f7f" stroke={K.out} stroke-width={1} />
        <Stairs x={b.x + 4} y={b.y + b.h - 4} n={4} sw={14} sh={12} color="#b7a98f" />
        <path d={gas} fill={GAS} opacity={0.6} />
        <path d={`M${b.x} ${gasTop}q15 -5 30 0t30 0t30 0t30 0t30 0t30 0t30 0t30 0`} fill="none" stroke="#9aa52f" stroke-width={2} />
        <rect x={b.x} y={gy - 2} width={b.w} height={6} fill="#9b8f7f" opacity={0.0} />
        <Person {...KIM.main} x={140} y={top.y + top.h - 3} s={0.38} pose={POSE.sitFloor} face="neutral" />
        <Person {...KIM.boy} x={180} y={top.y + top.h - 3} s={0.34} pose={POSE.sitFloor} face="neutral" />
        <Ok x={160} y={top.y - 6} r={11} />
        <No x={b.x + 32} y={b.y + 24} r={18} />
      </Scene2>
    );
  },

  'nukleer-kapi-havlu-bant': () => {
    const gy = 206;
    const towelY = 200;
    return (
      <Scene2 bg="indoor" gy={gy}>
        <Door x={150} y={gy - 8} w={112} h={196} />
        <rect x={150} y={gy - 8} width={112} height={8} fill="#2a2523" />
        <TapeStrip a={[146, 6]} b={[146, gy - 12]} w={10} />
        <TapeStrip a={[266, 6]} b={[266, gy - 12]} w={10} />
        <OG sh={[{ d: capsule([156, towelY], 8, [258, towelY], 8), f: '#bcd8ea' }, { d: 'M176 193V207M200 193V207M224 193V207M248 193V207', st: '#94bcd6', sw: 1.6 }]} />
        <Drop x={190} y={218} s={0.6} />
        <Drop x={232} y={222} s={0.5} />
        <Person {...KIM.main} x={98} y={226} s={1.05} pose={{ spine: -40, chest: -28, head: -12, legB: [96, 184], legF: [90, 182], armB: { to: [170, 198] }, armF: { to: [186, 202] }, handB: 'flat', handF: 'flat', face: 'neutral' }} />
        <Arrow from={[222, 140]} to={[210, 186]} />
      </Scene2>
    );
  },

  /* ─────────── salgın ─────────── */
  'nukleer-dirsege-oksur': () => {
    const p: PersonProps = { ...SAL.patient, x: 146, y: 96, ax: 'head', ay: 'head', s: 2.5, sleeve: 'long', pose: { ...POSE.stand, head: -96, face: 'closed' } };
    const r = rig(p);
    const sl = K.role.victim;
    const k = r.headR / 12;
    const elbow: P = [r.head[0] + 1 * k, r.head[1] + 6.5 * k];
    const wrist: P = [r.head[0] + 25 * k, r.head[1] - 4 * k];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <OG sh={[{ d: capsule(r.shoulderB, 13, elbow, 12), f: sl }, { d: capsule(elbow, 12, wrist, 10), f: sl }]} />
        <path d={`M${elbow[0] + 4} ${elbow[1] - 11}Q${elbow[0] + 9} ${elbow[1] - 2} ${elbow[0] + 4} ${elbow[1] + 9}`} fill="none" stroke={shade(sl, 0.3)} stroke-width={2} />
        <Hand x={wrist[0] - 4} y={wrist[1] + 2} a={62} s={0.85} pose="fist" side="R" view="back" skin={SAL.patient.skin} arm={0} />
        <g>
          {[[-6, -16], [6, -18], [-14, -10], [14, -12], [0, -22]].map(([dx, dy], i) => (
            <circle key={i} cx={elbow[0] + dx} cy={elbow[1] + dy + 4} r={2.2} fill={K.waterLight} stroke={K.water} stroke-width={1} />
          ))}
        </g>
        <Ok x={270} y={50} r={16} />
      </Scene2>
    );
  },

  'nukleer-hasta-ayri-oda': () => {
    // Ev kesiti: kalın duvar evi ikiye ayırır. Solda ayrı oda: yatak tümüyle odanın içinde, battaniyeye sarılı,
    // alnında ıslak bez olan ateşli hasta. Sağda salonda aile. Aradaki duvarda KAPALI kapı (yeşil onay).
    const pat: PersonProps = { ...SAL.patient, x: 80, y: 176, s: 0.84, shoes: null, pose: { ...POSE.lieBack, head: 172, face: 'closed' } };
    const r = rig(pat);
    const wx = 168, ww = 34; // ara duvar
    return (
      <Scene2 bg="indoor" wall="#dfe5ee">
        <rect x={wx + ww} y={0} width={320 - wx - ww} height={201} fill={K.wall} />
        <Window x={40} y={34} w={56} h={46} />
        <OG sh={[{ d: rrect(wx, -4, ww, 206, 1), f: '#cfc4b2' }, { d: `M${wx + 4} 0V200M${wx + ww - 4} 0V200`, st: shade('#cfc4b2', 0.18), sw: 1.4 }]} />
        <OG sh={[{ d: rrect(wx + 3, 86, ww - 6, 116, 2), f: '#8a5a38' }, { d: rrect(wx + 7, 90, ww - 14, 112, 1), f: '#a8724a', ln: true }, { d: circ([wx + ww - 10, 148], 2.6), f: '#e8c35a' }]} />
        <Ok x={wx + ww / 2} y={66} r={14} />
        <Bed x={10} y={214} w={140} blanket="#b691c9" />
        <Person {...pat} />
        <Blanket x1={r.neck[0] - 4} x2={150} y={178} h={26} color="#b691c9" />
        <Cloth x={r.head[0] + 1} y={r.head[1] - 9} w={16} h={7} a={-4} color="#bfe0f2" wet={false} />
        <Waves x={r.head[0] + 4} y={r.head[1] - 26} a={-90} n={2} r={5} color={K.danger} />
        <Chair x={240} y={222} s={0.95} />
        <Person {...SAL.carer} x={240} y={222} s={0.95} pose={POSE.sitChair} face="neutral" />
        <Person {...SAL.boy} x={290} y={226} s={0.95} flip pose={POSE.standSide} face="neutral" />
      </Scene2>
    );
  },

  'nukleer-hasta-bakim-maske': () => {
    const pat: PersonProps = { ...SAL.patient, x: 258, y: 170, s: 0.92, flip: true, pose: { ...POSE.sitFloor, spine: -80, armB: { floor: -14 }, armF: { to: [214, 136] } }, face: 'neutral' };
    const cup: P = [208, 136];
    const rel: PersonProps = { ...SAL.carer, x: 150, y: 228, s: 1.0, pose: { ...POSE.standSide, armF: { to: [cup[0] - 6, cup[1] + 2] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Window x={18} y={40} w={80} h={70} />
        <rect x={23} y={45} width={34} height={60} fill="#e9f6fc" opacity={0.6} />
        <Breeze x={66} y={76} len={60} n={3} gap={12} c="#ffffff" />
        <g transform="translate(436 0) scale(-1 1)">
          <Bed x={136} y={214} w={170} blanket="#7aa6d6" />
        </g>
        <Person {...pat} over={(q) => <MaskS r={q} />} />
        <Blanket x1={136} x2={240} y={172} h={16} color="#7aa6d6" />
        <Person {...rel} over={(q) => <MaskS r={q} />} />
        <OG sh={[{ d: 'M200 124H216L214 146H202Z', f: '#dff1fa' }, { d: 'M202.5 132H213.5L212.5 145H203.5Z', f: K.water, no: true }]} />
      </Scene2>
    );
  },

  'nukleer-supheli-paket': () => <SuspectScene cast={PAT.main} />,
  'nukleer-salgin-supheli-paket': () => <SuspectScene cast={SAL.carer} />,

  /* kimyasal: ıslak bez ve akan suyla yıkama (rehbere özel oyuncu) */
  'nukleer-kimyasal-islak-bez': () => {
    const p: PersonProps = { ...KIM.main, x: 150, y: 96, ax: 'head', ay: 'head', s: 2.7, pose: { ...POSE.stand, face: 'worried' } };
    const r = rig(p);
    const m = r.mouth;
    const cy = m[1] + 5;
    const wet = '#a9c9de';
    const cloth = `M${m[0] - 40} ${cy - 18}Q${m[0] - 18} ${cy - 25} ${m[0] + 2} ${cy - 21}Q${m[0] + 24} ${cy - 26} ${m[0] + 42} ${cy - 16}Q${m[0] + 46} ${cy + 4} ${m[0] + 40} ${cy + 24}Q${m[0] + 18} ${cy + 30} ${m[0]} ${cy + 26}Q${m[0] - 22} ${cy + 31} ${m[0] - 40} ${cy + 22}Q${m[0] - 45} ${cy + 2} ${m[0] - 40} ${cy - 18}Z`;
    return (
      <Scene2 bg="closeup">
        <Smoke x={0} y={0} w={320} h={46} op={0.55} color={GAS} />
        <Person {...p} only={['torso', 'head']} />
        <OG sh={[{ d: cloth, f: wet }, { d: `M${m[0] - 30} ${cy - 10}q6 12 2 26M${m[0] + 26} ${cy - 12}q-4 14 2 28`, st: shade(wet, 0.2), sw: 1.6 }]} />
        <Drop x={m[0] - 26} y={cy + 40} s={0.8} />
        <Drop x={m[0] + 32} y={cy + 38} s={0.6} />
        <Hand x={m[0] + 40} y={cy + 40} a={-42} s={0.82} pose="press" side="R" arm={230} sleeve={K.role.helper} skin={KIM.main.skin} />
      </Scene2>
    );
  },

  'nukleer-kimyasal-yikama': () => {
    const m = '#b7c1cb';
    const fx = 110, fy = 82, flowTo = 150;
    return (
      <Scene2 bg="closeup">
        <path d={`M${fx - 8} ${fy}Q${fx - 9} ${(fy + flowTo) / 2} ${fx - 11} ${flowTo}H${fx + 11}Q${fx + 9} ${(fy + flowTo) / 2} ${fx + 8} ${fy}Z`} fill={K.waterLight} stroke={K.out} stroke-width={1.3} />
        <path d={`M${fx - 2} ${fy + 8}V${flowTo - 8}`} stroke="#fff" stroke-width={2} opacity={0.8} stroke-linecap="round" />
        <OG sh={[{ d: rrect(-20, 30, 120, 20, 4), f: m }, { d: `M96 30H${fx - 6}Q${fx + 14} 30 ${fx + 14} 50V${fy}H${fx - 14}V54H96Z`, f: m }, { d: rrect(fx - 17, fy - 7, 34, 9, 2), f: shade(m, 0.15) }, { d: rrect(104, 12, 18, 20, 3), f: shade(m, 0.1) }, { d: rrect(94, 6, 38, 8, 4), f: K.danger }]} />
        <Hand x={150} y={164} a={-86} s={1.0} pose="open" side="R" view="palm" arm={260} skin={KIM.main.skin} />
        <g fill="none" stroke={K.waterLight} stroke-width={3} stroke-linecap="round">
          <path d="M96 180q-6 10 -8 22M126 180q8 10 8 24" />
        </g>
        <Drop x={84} y={212} s={0.9} />
        <Drop x={138} y={218} s={0.8} />
        <Timer x={238} y={46} r={15} text="15 dk" />
      </Scene2>
    );
  },

  /* patlama: asansör yok, merdivenden in; enkaz altında düdük */
  'nukleer-patlama-merdiven': () => {
    const sx = 150, sy = 224, sw = 30, sh = 18, n = 5;
    const stepTop = (i: number) => sy - (i + 1) * sh;
    const stepX = (i: number) => sx + (i + 0.5) * sw;
    const rail = (x: number): P => [x, stepTop(0) - 48 - ((x - stepX(0)) * sh) / sw];
    const hand: P = [stepX(2) - 4, rail(stepX(2) - 4)[1] - 3];
    const person: PersonProps = {
      ...PAT.main, x: stepX(2) - 6, y: stepTop(2) - 48, ay: 'hip', s: 0.95, flip: true,
      pose: {
        spine: -84, chest: -82, head: -70,
        legF: { to: [stepX(1) + 2, stepTop(1) - 4] }, legB: { to: [stepX(2) + 10, stepTop(2) - 4] },
        footB: 180, footF: 180,
        armB: { to: hand }, armF: [100, 110], face: 'neutral',
      },
    };
    const r0 = rail(sx - 4), r1 = rail(sx + n * sw + 10);
    const ex = 18, ey = 210, ew = 86, eh = 124, st = '#b9c2cc';
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(ex - 8, ey - eh - 14, ew + 16, eh + 14, 2), f: '#8c96a2' }, { d: rrect(ex, ey - eh, ew / 2, eh, 1), f: st }, { d: rrect(ex + ew / 2, ey - eh, ew / 2, eh, 1), f: shade(st, 0.08) }, { d: rrect(ex + ew * 0.3, ey - eh - 11, ew * 0.4, 8, 2), f: '#2f3542' }]} />
        <No x={61} y={146} r={46} />
        <Stairs x={sx} y={sy} n={n} sw={sw} sh={sh} />
        <path d={`M${stepX(0)} ${stepTop(0)}V${r0[1] + 6}M${stepX(4)} ${stepTop(4)}V${rail(stepX(4))[1]}`} stroke="#7b4e2e" stroke-width={4} stroke-linecap="round" />
        <path d={`M${r0[0]} ${r0[1]}L${r1[0]} ${r1[1]}`} stroke="#7b4e2e" stroke-width={6} stroke-linecap="round" />
        <Person {...person} />
        <Arrow from={[stepX(2) + 8, stepTop(0) - 6]} to={[sx - 30, sy + 6]} w={6} />
      </Scene2>
    );
  },

  'nukleer-patlama-duduk': () => <WhistleScene cast={PAT.main} debris />,

  /* ─────────── korunma odası ─────────── */
  'nukleer-ic-oda-sec': () => {
    const wallC = '#4a4f5c';
    const room = (x: number, y: number, w: number, h: number, f: string) => <rect x={x} y={y} width={w} height={h} fill={f} />;
    const win = (x1: number, y1: number, x2: number, y2: number) => <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke="#7ec4ec" stroke-width={7} stroke-linecap="butt" />;
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill="#e8e2d4" />
        {room(30, 20, 260, 200, '#d3d4d6')}
        {room(116, 84, 84, 72, '#9ee0b0')}
        {room(200, 84, 40, 72, '#d9e6ee')}
        <g stroke={wallC} stroke-width={4} fill="none" stroke-linecap="square">
          <path d="M116 84H240V156H116Z" />
          <path d="M200 84V156" />
          <path d="M30 84H90M30 156H90M116 20V60M200 20V60M240 156V220M116 180V220M240 84H290" />
        </g>
        {/* kapı boşlukları */}
        <g stroke="#9ee0b0" stroke-width={5}>
          <path d="M150 156H172" />
        </g>
        <path d="M150 156H172" stroke="#d3d4d6" stroke-width={5} opacity={0} />
        <rect x={30} y={20} width={260} height={200} fill="none" stroke={wallC} stroke-width={7} />
        {win(60, 20, 94, 20)}
        {win(140, 20, 176, 20)}
        {win(230, 20, 266, 20)}
        {win(30, 110, 30, 140)}
        {win(290, 110, 290, 140)}
        {win(60, 220, 94, 220)}
        {win(166, 220, 200, 220)}
        {win(250, 220, 276, 220)}
        {/* banyo: küvet ve klozet */}
        <OG sh={[{ d: rrect(206, 92, 28, 40, 9), f: '#ffffff' }, { d: rrect(210, 96, 20, 32, 7), f: '#bfe3f5', ln: true }, { d: ell([220, 145], 7, 6), f: '#fff' }]} />
        {/* iç odada aile (üstten) */}
        <TopPerson x={140} y={112} s={1.1} a={-90} c={K.role.bystander} />
        <TopPerson x={162} y={128} s={1.1} a={-90} c={K.role.helper} />
        <TopPerson x={180} y={110} s={0.85} a={-90} c={K.role.bystander2} />
        <Ok x={158} y={84} r={14} />
      </Scene2>
    );
  },

  'nukleer-kapatma-seti': () => {
    const sticker = (x: number, y: number) => (
      <g>
        <rect x={x} y={y} width={22} height={16} rx={2} fill="#ffe7a3" stroke={K.out} stroke-width={1.2} />
        <rect x={x + 5} y={y + 3} width={12} height={10} fill="#bfe3f5" stroke={K.out} stroke-width={1} />
        <path d={`M${x + 11} ${y + 3}V${y + 13}M${x + 5} ${y + 8}H${x + 17}`} stroke={K.out} stroke-width={0.9} />
      </g>
    );
    const sheet = (x: number, y: number, w: number) => (
      <g>
        <OG sh={[{ d: rrect(x, y, w, 30, 3), f: '#dceef6', op: 0.95 }, { d: `M${x + 6} ${y + 6}L${x + 20} ${y + 24}M${x + w - 24} ${y + 5}L${x + w - 10} ${y + 22}`, st: '#fff', sw: 2 }]} />
        {sticker(x + w / 2 - 11, y + 7)}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <path d="M24 96H296L316 226H4Z" fill={K.wood} stroke={K.out} stroke-width={2} />
        <path d="M4 226H316V236H4Z" fill={shade(K.wood, 0.2)} stroke={K.out} stroke-width={2} />
        {sheet(44, 78, 66)}
        {sheet(126, 74, 66)}
        {sheet(208, 78, 66)}
        <g transform="translate(0 6)">
          <OG sh={[{ d: rrect(214, 126, 70, 14, 4), f: '#4f9fd6' }, { d: rrect(210, 140, 76, 14, 4), f: '#e6b44a' }, { d: rrect(216, 154, 68, 14, 4), f: '#c96b5a' }]} />
        </g>
        <TapeRoll x={52} y={170} r={22} />
        <TapeRoll x={100} y={182} r={20} />
        <g transform="translate(160 170) rotate(-30)">
          <OG sh={[{ d: 'M0 -3L52 -1L52 1L0 3Z', f: '#c9d2da' }, { d: 'M0 3L50 12L49 14L0 5Z', f: '#c9d2da' }, { d: ell([-10, -8], 9, 7), f: K.danger }, { d: ell([-10, 10], 9, 7), f: K.danger }, { d: ell([-10, -8], 4, 3), f: '#e9e0d0', no: true }, { d: ell([-10, 10], 4, 3), f: '#e9e0d0', no: true }]} />
        </g>
      </Scene2>
    );
  },

  'nukleer-oda-malzemeleri': () => {
    const can = (x: number, y: number) => <OG sh={[{ d: rrect(x - 12, y - 30, 24, 30, 3), f: '#c7ced6' }, { d: rrect(x - 12, y - 24, 24, 16, 1), f: '#d9534f', no: true }, { d: ell([x, y - 30], 12, 3.5), f: '#e3e8ed' }]} />;
    return (
      <Scene2 bg="floor">
        <rect x={10} y={30} width={300} height={196} rx={14} fill="#7f9ac0" stroke={K.out} stroke-width={2} />
        <rect x={18} y={38} width={284} height={180} rx={10} fill="none" stroke="#a4b9d6" stroke-width={2} stroke-dasharray="6 5" />
        <Bottle x={36} y={118} s={1.2} fill={0.85} />
        <Bottle x={64} y={118} s={1.2} fill={0.85} />
        <Bottle x={92} y={118} s={1.2} fill={0.85} />
        {can(126, 118)}
        {can(154, 118)}
        <OG sh={[{ d: rrect(174, 64, 40, 54, 3), f: '#e6b44a' }, { d: rrect(180, 74, 28, 18, 2), f: '#fff3d0', ln: true }]} />
        <OG sh={[{ d: rrect(226, 80, 66, 38, 4), f: '#fbfaf7' }, { d: 'M254 88H264V95H271V105H264V112H254V105H247V95H254Z', f: K.danger, no: true }]} />
        <Flashlight x={30} y={182} s={1.1} beam={false} />
        <Radio x={124} y={204} s={0.95} waves={false} />
        <Phone x={190} y={176} s={0.8} call={false} />
        <path d="M190 205Q192 214 206 214H222" fill="none" stroke="#f4f1ea" stroke-width={3} stroke-linecap="round" />
        <OG sh={[{ d: rrect(220, 208, 14, 12, 2), f: '#f4f1ea' }]} />
        <OG sh={[{ d: ell([270, 188], 24, 18), f: '#2f3440' }, { d: ell([270, 188], 9, 7), f: '#4a5160', ln: true }, { d: 'M246 188h-8', st: K.out, sw: 3 }]} />
      </Scene2>
    );
  },

  'nukleer-pencere-naylon-bant': () => {
    const wx = 96, wy = 32, ww = 130, wh = 112;
    const tapeEnd: P = [wx + ww + 6, wy + 62];
    return (
      <Scene2 bg="indoor">
        <Window x={wx} y={wy} w={ww} h={wh} />
        <rect x={wx - 8} y={wy - 8} width={ww + 16} height={wh + 14} fill="#dcf0fa" opacity={0.55} stroke="#a9cfe3" stroke-width={1.5} />
        <path d={`M${wx + 10} ${wy + 30}L${wx + 40} ${wy + 6}M${wx + 60} ${wy + 100}L${wx + 100} ${wy + 66}`} stroke="#fff" stroke-width={3} opacity={0.8} stroke-linecap="round" />
        <TapeStrip a={[wx - 8, wy - 8]} b={[wx + ww + 6, wy - 8]} w={10} />
        <TapeStrip a={[wx - 8, wy - 8]} b={[wx - 8, wy + wh + 6]} w={10} />
        <TapeStrip a={[wx - 8, wy + wh + 6]} b={[wx + ww + 6, wy + wh + 6]} w={10} />
        <TapeStrip a={[wx + ww + 6, wy - 8]} b={tapeEnd} w={10} />
        <OG sh={[{ d: rrect(130, 162, 62, 22, 2), f: '#cfd5dc' }, { d: 'M136 168H186M136 173H186M136 178H186', st: '#8e99a6', sw: 1.6 }]} />
        <TapeStrip a={[126, 166]} b={[196, 166]} w={9} />
        <TapeStrip a={[126, 180]} b={[196, 180]} w={9} />
        <Person {...KIM.main} x={278} y={228} s={1.05} flip pose={{ ...POSE.standSide, armF: { to: [tapeEnd[0] + 4, tapeEnd[1] + 10] }, armB: { to: [tapeEnd[0] + 6, tapeEnd[1] - 24] }, head: -100, face: 'neutral' }} />
        <TapeRoll x={tapeEnd[0] + 8} y={tapeEnd[1] + 12} r={9} />
        <Arrow from={[wx + ww - 46, tapeEnd[1] - 4]} to={[wx + ww - 2, tapeEnd[1] - 4]} />
      </Scene2>
    );
  },

  /* ─────────── patlama sonrası ─────────── */
  'nukleer-patlama-uzaklas': () => {
    const elder: PersonProps = { x: 66, y: 226, flip: true, who: 'oldwoman', role: 'bystander4', pose: { ...POSE.walk, spine: -84 }, face: 'worried' };
    const e = rig(elder);
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Smoke kind="cloud" x={200} y={12} w={120} h={50} color="#7a818b" op={0.9} />
        <Smoke kind="cloud" x={220} y={46} w={96} h={40} color="#8d939c" op={0.9} />
        <Wall x={214} y={204} w={96} h={124} kind="crack" color="#d2c6b2" />
        <path d="M214 80L232 92L246 78L262 96L280 82L296 94L310 80V82H214Z" fill="#d2c6b2" stroke={K.out} stroke-width={1.5} />
        <Window x={226} y={110} w={30} h={30} broken />
        <Window x={270} y={110} w={30} h={30} broken />
        <Window x={248} y={156} w={30} h={30} broken />
        <OG sh={[{ d: 'M200 212L212 202L226 206L232 214Z', f: '#a5a39c' }, { d: 'M300 214L306 204L318 208V214Z', f: '#a5a39c' }]} />
        <OG sh={[{ d: rrect(182, 210, 26, 16, 4), f: '#3d7ad6' }, { d: 'M188 210Q195 202 202 210', st: K.out, sw: 2.4 }]} />
        <Person x={164} y={228} flip who="man" role="bystander2" pose={POSE.walk} face="worried" skin={2} />
        <Person {...elder} />
        <Person {...PAT.main} x={102} y={230} flip pose={{ ...POSE.walk, armF: { to: [e.elbowB[0] + 2, e.elbowB[1]] } }} face="worried" />
        <Arrow from={[130, 34]} to={[40, 34]} />
      </Scene2>
    );
  },

  'nukleer-geri-donme-yasak': () => {
    const ph: P = [212, 92];
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Smoke kind="cloud" x={220} y={30} w={100} h={50} color="#7a818b" op={0.9} />
        <Smoke kind="cloud" x={240} y={80} w={80} h={40} color="#8d939c" op={0.9} />
        <OG sh={[{ d: 'M236 206L254 186L274 196L288 182L306 200L320 196V214H236Z', f: '#a5a39c' }]} />
        <Post x={232} y={222} h={70} />
        <Cordon a={[232, 166]} b={[330, 160]} />
        <Person x={182} y={228} who="man" role="bystander4" pose={{ ...POSE.walk, armF: { to: ph }, handF: 'mitten' }} face="neutral" skin={1} />
        <Phone x={ph[0] + 4} y={ph[1] - 8} s={0.38} call={false} />
        <No x={190} y={140} r={46} />
        <Person {...PAT.main} x={70} y={228} flip pose={POSE.walk} face="neutral" />
        <Ok x={60} y={46} r={15} />
      </Scene2>
    );
  },

  /* ─────────── maske kullanımı ─────────── */
  'nukleer-maske-cene': () => {
    // Maske tek avucun içinde (elin sırtı bize dönük), burun teli parmak uçlarında ve üstte; lastikler elin
    // altından serbest sarkıyor. Maske çenenin altına oturtuluyor: alt kenar çeneyi sarıyor. Yukarı turuncu ok.
    const p: PersonProps = { ...MSK.main, x: 150, y: 80, ax: 'head', ay: 'head', s: 3.1, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const k = r.headR / 12;
    const at = (x: number, y: number): P => [r.head[0] + x * k, r.head[1] + y * k];
    const dy = 9; // maske aşağıda: üst kenar dudak üstünde, alt kenar çenenin altında
    const wire = at(0, 1.2 + dy);
    const hs = 0.6;
    // el: parmaklar yukarı, parmak uçları burun telinin hemen altında; avuç maskenin önünde
    const hand = handTip([wire[0] + 1, wire[1] + 3 * k], { a: 0, s: hs, pose: 'press', side: 'R', view: 'back', skin: 1, arm: 200, sleeve: K.role.bystander });
    const wrist: P = [hand.x, hand.y];
    // lastikler: maskenin iki yanından elin altına sarkan iki halka
    const L1 = at(-9.8, 5 + dy), L2 = at(-10, 11 + dy), R1 = at(9.8, 5 + dy), R2 = at(10, 11 + dy);
    const loop = (a: P, b: P, dx: number, depth: number) =>
      `M${f1(a[0])} ${f1(a[1])}C${f1(a[0] + dx)} ${f1(a[1] + depth)} ${f1(b[0] + dx * 0.4)} ${f1(b[1] + depth * 1.1)} ${f1(wrist[0] + dx * 0.6)} ${f1(wrist[1] + depth * 0.5)}C${f1(b[0] + dx * 0.2)} ${f1(b[1] + depth * 0.6)} ${f1(b[0])} ${f1(b[1] + 8)} ${f1(b[0])} ${f1(b[1])}`;
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <g fill="none" stroke-linecap="round">
          {[loop(L1, L2, -10, 34), loop(R1, R2, 10, 34)].map((d, i) => (
            <g key={i}>
              <path d={d} stroke={K.out} stroke-width={4.2} />
              <path d={d} stroke="#e4e4dc" stroke-width={2.2} />
            </g>
          ))}
        </g>
        <MaskF r={r} dy={dy} wire />
        <Hand {...hand} />
        <Arrow from={[262, 196]} to={[262, 112]} w={7} />
      </Scene2>
    );
  },

  'nukleer-maske-lastikler': () => {
    const p: PersonProps = { ...MSK.main, x: 168, y: 98, ax: 'head', ay: 'head', s: 2.7, pose: { view: 'side', spine: -90, head: -90, face: 'neutral' } };
    const r = rig(p);
    const k = r.headR / 12;
    const hp = (x: number, y: number): P => [r.head[0] + x * k, r.head[1] + y * k];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} over={(q) => <MaskS r={q} />} />
        <Arrow from={hp(-24, -22)} to={hp(-12.5, -9.5)} w={6} />
        <Arrow from={hp(-26, 18)} to={hp(-12, 10.5)} w={6} />
        <Ok x={276} y={44} r={16} />
      </Scene2>
    );
  },

  'nukleer-maske-burun-teli': () => {
    const p: PersonProps = { ...MSK.main, x: 160, y: 96, ax: 'head', ay: 'head', s: 3.4, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const k = r.headR / 12;
    const tl: P = [r.head[0] - 4 * k, r.head[1] + 2.4 * k];
    const tr2: P = [r.head[0] + 4 * k, r.head[1] + 2.4 * k];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <MaskF r={r} />
        <Hand {...handTip([tl[0] - 2, tl[1] + 1], { a: 38, s: 0.56, pose: 'press', side: 'L', view: 'back', skin: MSK.main.skin, arm: 260, sleeve: K.role.bystander })} />
        <Hand {...handTip([tr2[0] + 2, tr2[1] + 1], { a: -38, s: 0.56, pose: 'press', side: 'R', view: 'back', skin: MSK.main.skin, arm: 260, sleeve: K.role.bystander })} />
        <Arrow from={[tl[0] - 70, tl[1] - 4]} to={[tl[0] - 40, tl[1] - 4]} w={5} />
        <Arrow from={[tr2[0] + 70, tr2[1] - 4]} to={[tr2[0] + 40, tr2[1] - 4]} w={5} />
      </Scene2>
    );
  },

  'nukleer-maske-kacak-kontrol': () => {
    const p: PersonProps = { ...MSK.main, x: 116, y: 100, ax: 'head', ay: 'head', s: 2.6, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const k = r.headR / 12;
    const c: P = [r.head[0], r.head[1] + 10 * k];
    const q: PersonProps = { ...MSK.main, x: 262, y: 70, ax: 'head', ay: 'head', s: 1.5, glasses: true, pose: { ...POSE.stand, face: 'neutral' } };
    const rq = rig(q);
    const kq = rq.headR / 12;
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <MaskF r={r} />
        <Hand {...handTip([c[0] - 7, c[1] - 6 * k], { a: 14, s: 0.7, pose: 'press', side: 'L', skin: MSK.main.skin, arm: 200, sleeve: K.role.bystander })} />
        <Hand {...handTip([c[0] + 7, c[1] - 6 * k], { a: -14, s: 0.7, pose: 'press', side: 'R', skin: MSK.main.skin, arm: 200, sleeve: K.role.bystander })} />
        <Ok x={46} y={40} r={16} />
        <Inset x={204} y={12} w={108} h={112} bg="#eef2f6">
          <Person {...q} only={['torso', 'head']} />
          <MaskF r={rq} />
          <g fill="#ffffff" opacity={0.85}>
            <circle cx={rq.head[0] - 4.4 * kq} cy={rq.head[1] + 0.2 * kq} r={3 * kq} />
            <circle cx={rq.head[0] + 4.4 * kq} cy={rq.head[1] + 0.2 * kq} r={3 * kq} />
          </g>
          <Waves x={rq.head[0] - 5 * kq} y={rq.head[1] - 1 * kq} a={-110} n={2} r={5} color={K.water} />
          <Waves x={rq.head[0] + 5 * kq} y={rq.head[1] - 1 * kq} a={-70} n={2} r={5} color={K.water} />
        </Inset>
        <Bad x={300} y={24} r={12} />
      </Scene2>
    );
  },

  'nukleer-maske-cikar': () => {
    const p0: PersonProps = { ...MSK.main, x: 120, y: 118, ax: 'head', ay: 'head', s: 2.1, pose: { view: 'side', spine: -90, head: -90 } };
    const r0 = rig(p0);
    const k0 = r0.headR / 12;
    const grab: P = [r0.head[0] - 13 * k0, r0.head[1] - 4 * k0];
    const p: PersonProps = { ...p0, pose: { view: 'side', spine: -90, head: -90, armB: { to: [grab[0] - 2, grab[1] - 3], bend: -1 }, armF: { to: grab, bend: -1 }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="closeup">
        <Person {...p} />
        <MaskS r={r} off={8} straps={false} />
        <HeadG r={r}>
          {strap('M12 -1L-15 -3M12.4 10.6L-15 2', r.headR / 12)}
        </HeadG>
        <Arrow from={[r.head[0] + 30, r.head[1] - 46]} to={[r.head[0] + 84, r.head[1] - 6]} bend={-0.25} />
        <OG sh={[{ d: 'M248 224L242 170H298L292 224Z', f: '#8e99a6' }, { d: 'M240 166H300V172H240Z', f: '#6d7480' }, { d: 'M242 164L262 136L268 140L250 166Z', f: '#6d7480' }]} />
        <OG sh={[{ d: 'M250 40H284V50H262V58H250Z', f: K.metal }, { d: rrect(244, 34, 24, 8, 3), f: '#c5ccd4' }]} />
        <path d="M256 62V84M252 68V90M260 68V88" stroke={K.water} stroke-width={2.4} stroke-linecap="round" />
      </Scene2>
    );
  },

  /* ─────────── doğa: hipotermi ─────────── */
  'doga-hipotermi-koruma': () => {
    const vic: PersonProps = { ...HIP.victim, x: 78, y: 226, pose: { ...POSE.walk, spine: -84, armB: { at: 'chest', d: [6, -2] }, armF: { at: 'chest', d: [2, -8] } }, face: 'worried' };
    const v = rig(vic);
    return (
      <Scene2 bg="outdoor" ground="snow">
        <rect width={320} height={186} fill="#b9c4cf" />
        <path d="M0 182Q60 158 130 178T260 174T320 170V200H0Z" fill="#dfe6ec" />
        <Rock x={262} y={214} s={3.4} color="#8e8c86" />
        <Streaks x1={250} x2={330} y1={20} y2={200} n={40} dx={-14} dy={4} w={2.2} seed={4} />
        <Streaks x1={0} x2={200} y1={10} y2={110} n={16} dx={-1.5} dy={2} w={3} seed={7} />
        <OG sh={[{ d: 'M150 214L160 206H218L224 214Z', f: '#c1554b' }]} />
        <Person {...vic} />
        <path d={`M${v.head[0] - 20} ${v.head[1] - 6}q-4 6 0 12M${v.head[0] - 26} ${v.head[1] - 9}q-5 9 0 18M${v.back[0] - 12} ${v.back[1] - 2}q-4 6 0 12`} fill="none" stroke={K.ink} stroke-width={1.8} stroke-linecap="round" />
        <Person {...HIP.helper} x={136} y={228} pose={{ ...POSE.walk, armB: { to: [v.elbowF[0] + 4, v.elbowF[1] - 2] } }} face="neutral" />
        <Arrow from={[176, 150]} to={[196, 196]} bend={-0.3} />
      </Scene2>
    );
  },

  'doga-hipotermi-kuru-giysi': () => {
    const vic: PersonProps = { ...HIP.victim, x: 168, y: 222, pose: { ...POSE.sitFloor, spine: -80, armB: [100, 60], armF: [80, 40] }, face: 'worried' };
    const v = rig(vic);
    const grab: P = [v.back[0] - 26, v.back[1] + 6];
    const coat = smooth([[v.shoulderB[0] - 2, v.shoulderB[1] - 4], [grab[0] - 4, grab[1] - 8], [grab[0] - 10, grab[1] + 30], [grab[0] + 8, grab[1] + 52], [v.hip[0] - 6, v.hip[1] - 6], [v.back[0] + 2, v.back[1] + 8]], true, 0.7);
    return (
      <Scene2 bg="indoor" wall="#e8a35e" gy={196}>
        <path d="M0 0L0 196H320V0Z" fill="#e8a35e" />
        <path d="M0 196L110 0H210L320 196Z" fill="#f0b676" />
        <path d="M110 0L60 196M210 0L260 196" stroke="#c97f3d" stroke-width={2} />
        <rect y={196} width={320} height={44} fill="#5f6f7d" />
        <rect y={196} width={320} height={3} fill="#4a5966" />
        <Person {...vic} />
        <OG sh={[{ d: coat, f: COAT }]} />
        <Drop x={grab[0] - 6} y={grab[1] + 62} s={0.7} />
        <Drop x={grab[0] + 10} y={grab[1] + 70} s={0.6} />
        <Drop x={grab[0] - 16} y={grab[1] + 44} s={0.5} />
        <Person {...HIP.helper} x={86} y={224} pose={{ ...POSE.kneel, spine: -80, armB: { to: grab }, armF: { to: [grab[0] + 4, grab[1] - 6] } }} face="neutral" />
        <OG sh={[{ d: rrect(244, 204, 60, 12, 3), f: '#4f7fb0' }, { d: rrect(248, 192, 54, 12, 3), f: '#d9a13a' }, { d: rrect(246, 180, 56, 12, 3), f: '#c6574e' }]} />
        <Ok x={274} y={160} r={14} />
      </Scene2>
    );
  },

  'doga-hipotermi-sarma': () => {
    const p: PersonProps = { ...HIP.victim, x: 162, y: 206, s: 1.4, pose: { ...POSE.lieBack, face: 'worried' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="snow">
        <rect width={320} height={186} fill="#b9c4cf" />
        <Tree x={30} y={196} kind="pine" s={0.8} color="#3f7a62" />
        <Tree x={292} y={194} kind="pine" s={0.9} color="#3f7a62" />
        <OG sh={[{ d: rrect(12, 204, 296, 12, 4), f: '#e2b13c' }, { d: 'M60 205V215M90 205V215M120 205V215M150 205V215M180 205V215M210 205V215M240 205V215M270 205V215', st: shade('#e2b13c', 0.25), sw: 1.4 }]} />
        <Person {...p} />
        <Blanket x1={r.neck[0] - 6} x2={r.toeF[0] + 14} y={206} h={36} color="#3d6fb8" />
        <Blanket x1={r.neck[0] + 4} x2={r.toeF[0] + 10} y={206} h={29} foil />
        <g transform={`translate(${r.head[0]} ${r.head[1]}) rotate(${r.headA + 90})`}>
          <OG sh={[
            { d: `M${-r.headR * 1.1} ${-r.headR * 0.05}C${-r.headR * 1.12} ${-r.headR * 1.4} ${r.headR * 1.12} ${-r.headR * 1.4} ${r.headR * 1.1} ${-r.headR * 0.05}Z`, f: '#c6574e' },
            { d: rrect(-r.headR * 1.16, -r.headR * 0.42, r.headR * 2.32, r.headR * 0.46, r.headR * 0.16), f: shade('#c6574e', 0.15) },
          ]} />
        </g>
      </Scene2>
    );
  },

  'doga-hipotermi-govde-isitma': () => {
    const p: PersonProps = { ...HIP.victim, x: 186, y: 210, s: 1.3, pose: { ...POSE.lieBack, armF: [8, 4], face: 'worried' } };
    const r = rig(p);
    const pack = (c: P, w = 26, h = 14) => (
      <g>
        <OG sh={[{ d: rrect(c[0] - w / 2, c[1] - h / 2, w, h, 5), f: '#f4f1ea' }, { d: rrect(c[0] - w / 2 + 4, c[1] - h / 2 + 3, w - 8, h - 6, 3), f: '#e98b5c', op: 0.5, no: true }]} />
        <Heat x={c[0]} y={c[1] - h / 2 - 4} s={0.7} />
      </g>
    );
    return (
      <Scene2 bg="indoor" gy={170}>
        <rect y={170} width={320} height={70} fill="#5f6f7d" />
        <OG sh={[{ d: rrect(14, 196, 300, 14, 4), f: '#e2b13c' }]} />
        <Person {...p} />
        <Blanket x1={r.hip[0] + 10} x2={318} y={210} h={30} color="#c1554b" />
        <OG sh={[{ d: `M${r.hip[0] + 10} 210L${r.hip[0] - 4} 186L${r.hip[0] + 22} 182Z`, f: shade('#c1554b', 0.12) }]} />
        {pack([r.neck[0] + 2, r.neck[1] - 10], 22, 12)}
        {pack([r.chest[0], r.chest[1] - 8])}
        {pack([r.hip[0] + 2, r.hip[1] - 12])}
        <Inset x={208} y={12} w={102} h={72} bg="#eef2f6">
          <ArmBar a={[200, 54]} b={[330, 54]} r={16} skin={HIP.victim.skin} />
          <Hand x={236} y={30} a={100} s={0.48} pose="press" side="R" skin={HIP.helper.skin} arm={70} sleeve={K.role.helper} />
          <path d="M240 72l10 0M262 72l10 0" stroke={K.ink} stroke-width={2} stroke-linecap="round" />
          <No x={259} y={48} r={28} />
        </Inset>
      </Scene2>
    );
  },

  /* ─────────── kaybolma ─────────── */
  'doga-kaybolma-dur': () => {
    const p: PersonProps = { ...KAY.hiker, x: 160, y: 222, s: 1.05, pose: { ...POSE.stand, armF: [-10, -86], handF: { shape: 'flat', a: 0 }, face: 'worried' } };
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Tree x={28} y={172} kind="pine" s={1.05} />
        <Tree x={292} y={172} kind="pine" s={1.1} />
        <Tree x={250} y={168} kind="pine" s={0.75} />
        <Tree x={70} y={168} kind="pine" s={0.7} />
        <path d="M120 240L148 196L104 170H128L160 186L196 170H220L176 200L210 240Z" fill={K.dirt} stroke={shade(K.dirt, 0.2)} stroke-width={1.5} />
        <Person {...p} under={(q) => <OG sh={[{ d: rrect(q.neck[0] - 20, q.neck[1] + 2, 40, 52, 8), f: '#c0603e' }]} />} over={(q) => <path d={`M${q.shoulderB[0] + 4} ${q.shoulderB[1] - 2}L${q.shoulderB[0] + 6} ${q.chest[1] + 18}M${q.shoulderF[0] - 4} ${q.shoulderF[1] - 2}L${q.shoulderF[0] - 6} ${q.chest[1] + 18}`} stroke="#8a3f27" stroke-width={4} stroke-linecap="round" />} />
        <StopSign x={60} y={226} r={24} pole={60} />
      </Scene2>
    );
  },

  'doga-kaybolma-yerinde-kal': () => {
    const p: PersonProps = { ...KAY.hiker, x: 150, y: 214, s: 1.0, flip: true, pose: { ...POSE.sitFloor, spine: -82, legB: [-20, 60], legF: [-30, 50] }, face: 'neutral' };
    return (
      <Scene2 bg="outdoor" gy={176}>
        <Tree x={26} y={178} kind="pine" s={1.0} />
        <Tree x={300} y={176} kind="pine" s={1.1} />
        <Tree x={70} y={174} kind="leaf" s={0.7} />
        <path d="M90 214Q60 196 40 184T0 170" fill="none" stroke={K.danger} stroke-width={4} stroke-dasharray="7 6" stroke-linecap="round" />
        <No x={52} y={190} r={18} />
        <OG sh={[{ d: ell([150, 216], 52, 9), f: '#b9773a' }, { d: ell([150, 214], 40, 5), f: '#d39a4a', no: true }]} />
        <OG sh={[{ d: capsule([168, 200], 14, [300, 194], 13), f: '#8a5a3a' }, { d: ell([300, 194], 9, 12), f: '#c9a07a', ln: true }, { d: ell([300, 194], 4, 6), f: '#a37a52', ln: true }, { d: 'M190 192H240M210 204H270', st: shade('#8a5a3a', 0.25), sw: 1.6 }]} />
        <OG sh={[{ d: 'M252 196L246 120', st: '#7b4e2e', sw: 4 }, { d: 'M246 124L284 128L280 156L250 150Z', f: '#ff4f9a' }]} />
        <Person {...p} />
        <Pin x={150} y={86} s={1.3} />
      </Scene2>
    );
  },

  /* ─────────── yılan, arı, alerji ─────────── */
  'doga-yilan-uzaklas': () => (
    <Scene2 bg="outdoor" ground="dirt" gy={186}>
      <Rock x={30} y={196} s={1.2} />
      <Rock x={300} y={200} s={1.4} />
      <Rock x={276} y={224} s={0.8} />
      <Viper x={232} y={216} s={1.1} />
      <Person {...ISR.victim} x={118} y={228} pose={{ spine: -96, chest: -98, head: -92, legB: [98, 92], legF: [64, 96], armB: [40, 10], armF: [60, 20], footF: 0, face: 'worried' }} />
      <Arrow from={[110, 40]} to={[40, 40]} />
      <Inset x={206} y={14} w={100} h={78} bg="#eef6ea">
        <Person {...ISR.victim} x={236} y={88} s={0.42} pose={{ ...POSE.standSide, spine: -70, armF: [30, 20] }} />
        <path d="M258 52L292 80" stroke="#7b4e2e" stroke-width={3} stroke-linecap="round" />
        <Viper x={292} y={88} s={0.38} />
        <No x={256} y={52} r={30} />
      </Inset>
    </Scene2>
  ),

  'doga-yilan-hareketsiz': () => {
    // Yandan: ısırılan adam sırtüstü yatıyor; ısırılan bacak iki yanından rulo montlarla desteklenmiş (buz YOK).
    // Yardımcı arka tarafta diz çökmüş: bir eli bacağı sabit tutuyor, diğeriyle telefonla 112'yi arıyor.
    const vic: PersonProps = { ...ISR.victim, x: 150, y: 222, s: 1.25, pose: { ...POSE.lieBack, face: 'pain' } };
    const v = rig(vic);
    const thigh: P = [(v.hipF[0] + v.kneeF[0]) / 2, (v.hipF[1] + v.kneeF[1]) / 2 - 6];
    const hel: PersonProps = { ...ISR.helper, x: 170, y: 204, s: 1.1, pose: { ...POSE.kneel, spine: -80, head: -84, armB: { to: thigh }, armF: { at: 'head', d: [3, 9] }, handF: 'fist', handB: 'flat', face: 'speak' } };
    const roll = (a: P, b: P, c: string) => <OG sh={[{ d: capsule(a, 8, b, 8), f: c }, { d: `M${a[0] + 6} ${a[1] - 4}L${b[0] - 6} ${b[1] - 4}`, st: tint(c, 0.3), sw: 1.4 }]} />;
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={196} s={0.9} />
        <Person {...hel} over={(q) => <Phone x={q.handF[0] + 2} y={q.handF[1] - 8} s={0.36} call={false} a={14} />} />
        <Label x={260} y={36} text="112" />
        {roll([v.kneeF[0] + 4, v.kneeF[1] - 16], [v.ankleF[0] + 8, v.ankleF[1] - 16], '#7a6a58')}
        <Person {...vic} />
        {roll([v.kneeF[0] + 4, v.kneeF[1] + 7], [v.ankleF[0] + 8, v.ankleF[1] + 7], '#7a6a58')}
        <g fill={K.blood}>
          <circle cx={v.ankleF[0] - 7} cy={v.ankleF[1] - 4} r={2} />
          <circle cx={v.ankleF[0] - 1} cy={v.ankleF[1] - 4} r={2} />
        </g>
        <circle cx={v.ankleF[0] - 4} cy={v.ankleF[1] - 4} r={12} fill="none" stroke={K.action} stroke-width={2.6} />
      </Scene2>
    );
  },

  'doga-ari-igne-kazima': () => {
    const sting: P = [150, 113];
    const cardEdge: P = [196, 114];
    return (
      <Scene2 bg="closeup">
        <ArmBar a={[-20, 150]} b={[340, 150]} r={38} skin={1} />
        <ellipse cx={sting[0]} cy={sting[1] + 3} rx={10} ry={4} fill="#e98b78" opacity={0.7} />
        <path d={`M${sting[0]} ${sting[1] + 1}L${sting[0] - 3} ${sting[1] - 12}`} stroke={K.ink} stroke-width={2} stroke-linecap="round" />
        <ellipse cx={sting[0] - 3.4} cy={sting[1] - 14} rx={2.8} ry={3.6} fill="#e9d07a" stroke={K.ink} stroke-width={1} />
        <g transform={`translate(${cardEdge[0]} ${cardEdge[1]}) rotate(-58)`}>
          <OG sh={[{ d: rrect(0, -30, 96, 60, 6), f: '#3d7ad6' }, { d: rrect(10, -18, 16, 12, 2), f: '#e2c35a', ln: true }, { d: 'M10 12H70', st: '#bcd3f2', sw: 3 }]} />
        </g>
        <Hand x={250} y={84} a={-62} s={0.8} pose="pinch" side="L" skin={2} arm={120} sleeve={K.role.helper} />
        <Arrow from={[236, 134]} to={[168, 134]} w={6} />
        <Inset x={14} y={14} w={86} h={64} bg="#eef2f6">
          <path d="M28 40L84 34M28 40L84 48" stroke="#8e99a6" stroke-width={4} stroke-linecap="round" />
          <path d="M28 40L84 34M28 40L84 48" stroke={K.out} stroke-width={1} stroke-linecap="round" fill="none" opacity={0.6} />
          <No x={57} y={46} r={24} />
        </Inset>
      </Scene2>
    );
  },

  'doga-alerji-sislik': () => {
    const p: PersonProps = { x: 104, y: 98, ax: 'head', ay: 'head', s: 2.5, who: 'man', role: 'victim', hair: 'short', hairC: K.hair.dark, skin: 1, pose: { ...POSE.stand, face: 'worried' } };
    const r = rig(p);
    const k = r.headR / 12;
    const throat: P = [r.neck[0] + 4, r.neck[1] + 4];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <HeadG r={r}>
          <path d={`${ell([-4.5, -0.4], 3.9, 2.7)}${ell([4.5, -0.4], 3.9, 2.7)}`} fill={tint(K.skin[1], 0.08)} />
          <path d="M-7.6 -0.6Q-4.5 -3.6 -1.4 -0.6M1.4 -0.6Q4.5 -3.6 7.6 -0.6" stroke={shade(K.skin[1], 0.3)} stroke-width={0.8} fill="none" stroke-linecap="round" />
          <path d="M-6.4 1.2Q-4.5 2 -2.6 1.2M2.6 1.2Q4.5 2 6.4 1.2" stroke={K.ink} stroke-width={1} fill="none" stroke-linecap="round" />
          <OG ow={OW / k} sh={[{ d: ell([0, 7.8], 4.9, 2.9), f: '#d9707a' }, { d: 'M-4 7.8Q0 8.6 4 7.8', st: '#9a3d47', sw: 0.6 }]} />
        </HeadG>
        <Hand {...handTip(throat, { a: 30, s: 0.8, pose: 'press', side: 'R', skin: 1, arm: 200, sleeve: K.role.victim })} />
        <Inset x={196} y={62} w={114} h={166} bg="#eef2f6">
          <OG sh={[{ d: capsule([222, 40], 36, [228, 250], 32), f: K.pants.denim }, { d: 'M246 60L252 240', st: shade(K.pants.denim, 0.25), sw: 2 }]} />
          <OG sh={[{ d: rrect(266, 140, 62, 20, 7), f: '#f2c14e' }, { d: rrect(256, 142, 13, 16, 4), f: K.action }, { d: rrect(276, 144, 16, 12, 2), f: '#fff', ln: true }]} />
          <Hand x={326} y={150} a={-90} s={0.85} pose="fist" side="L" skin={2} arm={60} sleeve={K.role.helper} />
          <Arrow from={[262, 96]} to={[256, 130]} w={5} />
        </Inset>
        <Label x={280} y={34} text="112" />
      </Scene2>
    );
  },

  /* ─────────── dağ havası ─────────── */
  'doga-hava-geri-don': () => {
    const gy = (x: number) => 226 - x * 0.46;
    const px = 128;
    return (
      <Scene2 bg="outdoor">
        <rect width={320} height={240} fill="#7d8796" />
        <Cloud x={250} y={60} w={140} color="#434a58" />
        <Cloud x={170} y={40} w={110} color="#4f5766" />
        <Breeze x={180} y={84} len={60} n={3} gap={10} dir={-1} />
        <path d={`M-10 ${gy(-10)}L296 ${gy(296)}L330 ${gy(296) + 20}V240H-10Z`} fill="#8a9a6e" stroke={K.out} stroke-width={2} />
        <path d={`M296 ${gy(296)}L330 ${gy(296) + 20}V240H230Z`} fill="#77875d" />
        <path d={`M0 ${gy(0) + 10}L296 ${gy(296) + 6}`} stroke="#c9a77a" stroke-width={7} stroke-linecap="round" />
        <Person {...HAV.hiker} x={px} y={gy(px) + 12} s={0.78} flip pose={{ ...POSE.walk, spine: -94 }} face="worried" back={(q) => <Backpack x={q.back[0] + 7 * q.s} y={q.neck[1] + 6 * q.s} s={q.s} flip />} />
        <No x={240} y={gy(240) - 14} r={18} />
        <Arrow from={[96, 110]} to={[34, 140]} color={K.safe} />
      </Scene2>
    );
  },

  'doga-hava-sirttan-in': () => {
    const sy = (x: number) => 92 + (330 - x) * (122 / 340);
    return (
      <Scene2 bg="outdoor">
        <rect width={320} height={240} fill="#5a6372" />
        <Cloud x={110} y={34} w={150} color="#3c4250" />
        <Cloud x={250} y={26} w={130} color="#434a58" />
        <path d={`M-10 ${sy(-10)}L330 ${sy(330)}V240H-10Z`} fill="#8a9a6e" stroke={K.out} stroke-width={2} />
        <Tree x={286} y={sy(286) + 4} kind="leaf" s={0.5} />
        <Bolt x={270} y={6} s={0.7} />
        <No x={286} y={sy(286) - 34} r={24} />
        <Person {...HAV.friend} x={226} y={sy(226) + 4} s={0.62} flip face="worried" pose={{ ...POSE.walk, spine: -96 }} back={(q) => <Backpack x={q.back[0] + 7 * q.s} y={q.neck[1] + 6 * q.s} s={q.s} flip color="#4f7fb0" />} />
        <Person {...HAV.hiker} x={170} y={sy(170) + 6} s={0.7} flip face="worried" pose={{ ...POSE.walk, spine: -96 }} back={(q) => <Backpack x={q.back[0] + 7 * q.s} y={q.neck[1] + 6 * q.s} s={q.s} flip />} />
        {[18, 44].map((x, i) => <Tree key={i} x={x} y={232 - i * 4} kind="pine" s={0.5} color="#2f6a4a" />)}
        <Arrow from={[124, sy(124) - 8]} to={[70, sy(70) - 2]} />
      </Scene2>
    );
  },

  'doga-hava-comelme': () => {
    const crouch = (x: number, y: number, s: number, c: Cast): PersonProps => ({
      ...c, x, y, s,
      pose: { spine: -50, chest: -40, head: -10, legB: [-30, 104], legF: [-28, 106], armB: { at: 'head', d: [-1, 1] }, armF: { at: 'head', d: [0, 2] }, footB: 0, footF: 0, face: 'closed' },
    });
    const a = crouch(112, 206, 1.15, HAV.hiker);
    const b = crouch(258, 196, 0.8, HAV.friend);
    const fa = rig(a).ankleF[0], fb = rig(b).ankleF[0];
    return (
      <Scene2 bg="outdoor">
        <rect width={320} height={186} fill="#6b7483" />
        <path d="M0 182Q60 158 130 178T260 174T320 170V200H0Z" fill="#7f9361" />
        <Cloud x={250} y={36} w={120} color="#434a58" />
        <Bolt x={262} y={30} s={0.7} />
        <OG sh={[{ d: rrect(fa - 30, 206, 56, 20, 6), f: '#c0603e' }, { d: rrect(fa - 22, 210, 26, 12, 4), f: shade('#c0603e', 0.12) }]} />
        <Person {...a} />
        <OG sh={[{ d: rrect(fb - 20, 196, 38, 14, 5), f: '#4f7fb0' }]} />
        <Person {...b} />
        <Measure a={[148, 232]} b={[232, 232]} />
        <Label x={190} y={214} text="5 m" size={14} />
        <Inset x={12} y={12} w={96} h={56} bg="#eef6ea">
          <Person {...HAV.hiker} x={62} y={58} s={0.42} pose={POSE.lieBack} face="neutral" />
          <No x={60} y={42} r={22} />
        </Inset>
      </Scene2>
    );
  },

  'doga-hava-sis-dur': () => {
    const p: PersonProps = { ...HAV.hiker, x: 150, y: 226, s: 1.05, pose: { ...POSE.stand, head: -84, armB: [70, -30], armF: [110, -150], face: 'neutral' } };
    const r = rig(p);
    const ph: P = [r.chest[0], r.chest[1] + 2];
    return (
      <Scene2 bg="outdoor" gy={176}>
        <Tree x={40} y={176} kind="pine" s={0.9} />
        <Tree x={270} y={176} kind="pine" s={0.9} />
        <rect width={320} height={240} fill="#e6eaee" opacity={0.78} />
        <path d="M110 240L140 190L150 176H170L176 190L210 240Z" fill={K.dirt} opacity={0.9} />
        <rect width={320} height={180} fill="#eef1f4" opacity={0.5} />
        <Rock x={232} y={226} s={1.5} />
        <path d="M218 212L246 212" stroke="#fff" stroke-width={5} />
        <path d="M218 218L246 218" stroke={K.danger} stroke-width={5} />
        <Person {...p} back={(q) => <OG sh={[{ d: rrect(q.neck[0] - 18, q.neck[1] + 2, 36, 46, 8), f: '#c0603e' }]} />} />
        <Phone x={ph[0]} y={ph[1]} s={0.36} call={false} />
        <Smoke kind="layer" x={0} y={0} w={320} h={60} color="#f2f4f6" op={0.85} />
        <g>
          <path d={`M${ph[0] + 8} ${ph[1] - 4}L250 70`} stroke={K.out} stroke-width={1.4} stroke-dasharray="3 3" />
          <Phone x={266} y={64} s={1.1} call={false} />
          <rect x={250} y={36} width={32} height={50} fill="#d6ecd2" />
          <path d="M252 70Q262 60 270 64T282 54" stroke="#c9a77a" stroke-width={3} fill="none" />
          <Pin x={266} y={66} s={0.62} c={K.water} />
        </g>
      </Scene2>
    );
  },

  /* ─────────── yalnız yaralanma ─────────── */
  'doga-yaralanma-bastirma': () => {
    // Yandan: yerde oturan yaralı öne eğilmiş, baldırındaki yaraya katlanmış bezi İKİ eliyle sıkıca bastırıyor.
    const base: PersonProps = { ...YAL.victim, x: 70, y: 226, s: 1.9, pose: { ...POSE.sitFloor, spine: -50, chest: -40, head: -24, legB: [2, 4], legF: [-2, 2] } };
    const r0 = rig(base);
    const w: P = [r0.kneeF[0] + (r0.ankleF[0] - r0.kneeF[0]) * 0.32, r0.kneeF[1] + (r0.ankleF[1] - r0.kneeF[1]) * 0.32 - 10];
    const p: PersonProps = { ...base, pose: { ...base.pose, armB: { to: [w[0] + 6, w[1] - 2] }, armF: { to: [w[0] - 2, w[1] - 3] }, handB: { shape: 'flat', a: -80 }, handF: { shape: 'flat', a: -80 }, face: 'pain' } };
    return (
      <Scene2 bg="outdoor" gy={186}>
        <Tree x={292} y={190} kind="pine" s={1.0} />
        <Tree x={250} y={188} kind="pine" s={0.7} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Blood x={w[0] + 10} y={w[1] + 20} s={0.8} />
        <Cloth x={w[0] + 2} y={w[1] + 2} w={52} h={20} a={2} />
        <Person {...p} only={['armF']} />
        <Arrow from={[w[0] + 44, w[1] - 74]} to={[w[0] + 30, w[1] - 26]} w={6} />
      </Scene2>
    );
  },

  'doga-yaralanma-zemin': () => <GroundScene cast={YAL.victim} />,
  'doga-yaralanma-duduk': () => <WhistleScene cast={YAL.victim} />,
  'doga-kaybolma-duduk': () => <WhistleScene cast={KAY.hiker} />,
  'doga-kaybolma-zemin': () => <GroundScene cast={KAY.hiker} />,
  'doga-hipotermi-kpr': () => <CprScene victim={HIP.victim} helper={HIP.helper} />,

  'doga-kaybolma-parlak-bez': () => {
    // Açık alanda: parlak kırmızı bir giysi dala asılı; yürüyüşçü ikinci bir parlak bezi yere seriyor.
    const red = '#ff4a2a';
    const c1: P = [176, 216], c2: P = [190, 206];
    const kn: PersonProps = { ...KAY.hiker, x: 236, y: 228, s: 0.95, flip: true, pose: { ...POSE.kneel, spine: -62, chest: -48, head: -36, legB: [96, 182], legF: [92, 180], armB: { to: c2 }, armF: { to: c1 }, handB: 'flat', handF: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={52} y={222} s={1.35} />
        <OG sh={[{ d: capsule([62, 162], 4, [146, 148], 2.6), f: K.trunk }]} />
        <OG sh={[{ d: 'M98 155L134 150L138 202Q128 206 118 202T96 204Z', f: red }, { d: 'M118 152L134 150L138 202Q128 206 118 202Z', f: shade(red, 0.14), no: true }]} />
        <OG sh={[{ d: `M92 222L172 204L${c2[0] + 8} ${c2[1] + 2}L${c1[0] + 6} ${c1[1] + 6}L106 234Z`, f: red }, { d: `M140 212L172 204L${c2[0] + 8} ${c2[1] + 2}L${c1[0] + 6} ${c1[1] + 6}L150 228Z`, f: shade(red, 0.12), no: true }]} />
        <Person {...kn} back={(q) => <Backpack x={q.back[0] + 7 * q.s} y={q.neck[1] + 6 * q.s} s={q.s} flip />} />
      </Scene2>
    );
  },

  'doga-hava-yagmurluk': () => {
    // Önden: yağmur başlamadan yürüyüşçü yağmurluğunu giymiş, fermuarını yukarı çekiyor; altında teal tişört yakası.
    const coat = '#e2b13c';
    const base: PersonProps = { ...HAV.hiker, x: 120, y: 230, s: 1.15, top: coat, sleeve: 'long', pose: { ...POSE.stand, face: 'neutral' } };
    const r0 = rig(base);
    const zipTop: P = [r0.neck[0], r0.neck[1] + 8 * r0.s];
    const zipPull: P = [r0.neck[0], r0.neck[1] + 30 * r0.s];
    const hem: P = [r0.hip[0], r0.hip[1] - 2];
    const p: PersonProps = { ...base, pose: { ...POSE.stand, armF: { to: [zipPull[0] + 3, zipPull[1] + 2] }, armB: { to: [hem[0] - 4, hem[1] - 6] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const drops = [[40, 30], [150, 24], [200, 60], [260, 34], [300, 70], [20, 90], [176, 110], [290, 150], [60, 64], [16, 160], [240, 120]];
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <rect width={320} height={130} fill="#9aa7b4" opacity={0.75} />
        <Cloud x={220} y={50} w={130} color="#6f7a88" />
        <Cloud x={50} y={40} w={100} color="#7f8b98" />
        <Tree x={292} y={200} kind="pine" s={0.8} />
        {drops.map(([x, y], i) => <path key={i} d={`M${x} ${y}l-3 9`} stroke="#3d7fc4" stroke-width={2.2} stroke-linecap="round" />)}
        <Person {...p}
          back={(rr) => <OG sh={[{ d: `M${rr.neck[0] - 20 * rr.s} ${rr.neck[1] + 4}Q${rr.neck[0] - 24 * rr.s} ${rr.head[1] - 6} ${rr.neck[0]} ${rr.head[1] - 2}Q${rr.neck[0] + 24 * rr.s} ${rr.head[1] - 6} ${rr.neck[0] + 20 * rr.s} ${rr.neck[1] + 4}Z`, f: shade(coat, 0.15) }]} />}
          mid={(rr) => (
            <g>
              <OG sh={[{ d: `M${zipTop[0] - 7} ${zipTop[1] - 6}L${zipTop[0]} ${zipPull[1]}L${zipTop[0] + 7} ${zipTop[1] - 6}Z`, f: K.role.helper }]} />
              <path d={`M${zipPull[0]} ${zipPull[1]}V${rr.hip[1] - 4}`} stroke={shade(coat, 0.4)} stroke-width={2} />
            </g>
          )}
        />
        <Backpack x={226} y={196} s={1.1} />
        <Arrow from={[zipPull[0] + 36, zipPull[1] + 30]} to={[zipPull[0] + 36, zipTop[1]]} w={5} />
      </Scene2>
    );
  },

  'doga-yaralanma-atel': () => {
    const p: PersonProps = { ...YAL.victim, x: 100, y: 224, s: 1.4, pose: { ...POSE.sitFloor, spine: -110, chest: -104, head: -92, legB: [4, 4], legF: [-1, 1], armB: { floor: -18 }, armF: [70, 20] }, face: 'pain' };
    const r = rig(p);
    const dir = Math.atan2(r.ankleF[1] - r.hipF[1], r.ankleF[0] - r.hipF[0]) / RD;
    const a0 = pol(r.hipF, dir, 24), a1 = pol(r.ankleF, dir, 12);
    const up = (q: P, d: number) => pol(q, dir - 90, d);
    const stick = (o: number) => <OG sh={[{ d: capsule(up(a0, o), 3.4, up(a1, o), 3), f: '#9a6a3e' }]} />;
    const wrap = (q: P) => <OG sh={[{ d: capsule(up(q, -11), 5, up(q, 11), 5), f: K.cloth }]} />;
    return (
      <Scene2 bg="outdoor" gy={186}>
        <Tree x={292} y={190} kind="pine" s={1.0} />
        <Rock x={34} y={226} s={3.4} />
        {stick(10)}
        <Person {...p} />
        {stick(-10)}
        {wrap(pol(r.hipF, dir, 40))}
        {wrap(pol(r.kneeF, dir, 18))}
        {wrap(pol(r.ankleF, dir, -6))}
        <Backpack x={286} y={180} s={1.15} />
      </Scene2>
    );
  },
};

