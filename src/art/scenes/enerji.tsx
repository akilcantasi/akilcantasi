// Enerji ve şarj — sahneler. Şartname: src/art/spec/enerji.ts
// Çoğu sahne nesne yakın planıdır; yardımcı parçalar (powerbank, telefon, panel, akü,
// multimetre, modül…) bu dosyada tanımlıdır, kit2.tsx değiştirilmez.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Bad, Hand, K, Label, No, OG, Ok, Person, POSE, Radio, Scene2, Smoke, Table, Tree, Water, Waves, Window, Car, Flame, Stove, Backpack,
  capsule, circ, ell, rrect, shade, tint,
} from '../kit2';
import type { P } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)})${a ? ` rotate(${f1(a)})` : ''}${s !== 1 ? ` scale(${s})` : ''}`}>{children}</g>
);
const ow = (s: number) => 1.5 / s;
const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const LIME = '#a3e635';

/** Kablo (yumuşak çizgi, dış hatlı) */
function Cable({ pts, c = '#2f3542', w = 3.6 }: { pts: P[]; c?: string; w?: number }) {
  const d = 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={w + 2.6} />
      <path d={d} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Şimşek simgesi (MERKEZ) */
function Bolt({ x, y, s = 1, c = '#ffd23a' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M4 -22L-11 3H-1L-5 22L11 -5H1Z" fill={c} stroke={K.out} stroke-width={1.8 / s} stroke-linejoin="round" />
    </G>
  );
}

/** Kıvılcım (MERKEZ) */
function Spark({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  const pts = Array.from({ length: 16 }, (_, i) => pol([x, y], i * 22.5 - 90, i % 2 ? r * 0.4 : i % 4 ? r * 0.75 : r));
  return (
    <g>
      <path d={'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z'} fill="#ffd64a" stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
      <circle cx={x} cy={y} r={r * 0.28} fill="#fff" />
    </g>
  );
}

/** Güneş (MERKEZ) */
function Sun({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f6b81f" stroke-width={3.4} stroke-linecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const p1 = pol([x, y], i * 36, r + 5), p2 = pol([x, y], i * 36, r + 13);
          return <line key={i} x1={f1(p1[0])} y1={f1(p1[1])} x2={f1(p2[0])} y2={f1(p2[1])} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff3a8" />
    </g>
  );
}

/** Bulut (MERKEZ) */
function Cloud({ x, y, s = 1, c = '#b8c2cc' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: circ([-22, 4], 16), f: c }, { d: circ([0, -6], 22), f: c }, { d: circ([24, 4], 15), f: c }, { d: rrect(-36, 2, 74, 18, 9), f: c }]} />
    </G>
  );
}

/** Powerbank (MERKEZ). lv = yanan gösterge sayısı (0–3) */
function Powerbank({ x, y, s = 1, a = 0, c = '#2f3542', lv = 2 }: { x: number; y: number; s?: number; a?: number; c?: string; lv?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={ow(s)} sh={[{ d: rrect(-15, -26, 30, 52, 6), f: c }, { d: rrect(5, -26, 10, 52, 6), f: shade(c, 0.2), no: true }, { d: rrect(-6, 20, 12, 4, 1), f: '#596273', no: true }]} />
      {[-6, 0, 6].map((d, i) => <circle key={i} cx={d} cy={12} r={1.8} fill={i < lv ? K.safe : '#596273'} />)}
      <Bolt x={0} y={-6} s={0.45} />
    </G>
  );
}

/** Akıllı telefon (MERKEZ). children = ekran içeriği (yerel; ekran -16..16 × -31..27) */
function BigPhone({ x, y, s = 1, a = 0, children, screen = '#eaf4fb' }: { x: number; y: number; s?: number; a?: number; children?: ComponentChildren; screen?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={ow(s)} sh={[{ d: rrect(-19, -36, 38, 72, 7), f: '#2f3542' }]} />
      <rect x={-16} y={-31} width={32} height={58} rx={3} fill={screen} />
      <rect x={-5} y={-34} width={10} height={1.6} rx={0.8} fill="#596273" />
      {children}
    </G>
  );
}
/** Telefonun alt ucu (kablo girişi), sahne koordinatı */
const phoneBottom = (x: number, y: number, s: number): P => [x, y + 36 * s];

/** Ekranda pil simgesi (yerel). lv 0–1 doluluk; charge: şimşek */
function BatteryIcon({ x = 0, y = 0, k = 1, lv = 0.6, charge = true, c = K.safe }: { x?: number; y?: number; k?: number; lv?: number; charge?: boolean; c?: string }) {
  const h = 25 * lv;
  return (
    <G x={x} y={y} s={k}>
      <rect x={-8} y={-14} width={16} height={28} rx={2.5} fill="none" stroke={K.ink} stroke-width={1.8} />
      <rect x={-3.5} y={-17} width={7} height={3} rx={1} fill={K.ink} />
      {lv > 0 && <rect x={-5.5} y={11.5 - h} width={11} height={h} rx={1} fill={c} />}
      {charge && <path d="M1.5 -11L-4.5 1H0L-2 9L4.5 -3H0Z" fill="#ffd23a" stroke={K.ink} stroke-width={0.8} stroke-linejoin="round" />}
    </G>
  );
}

/** Katlanır güneş paneli (3/4 görünüş). x,y = alt kenar ortası */
function SolarPanel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wing = (x0: number, x1: number) => {
    const A: P = [x0, 0], B: P = [x1, 0], C: P = [x1 + 18, -56], D: P = [x0 + 18, -56];
    const lines: string[] = [];
    for (let i = 1; i < 4; i++) {
      const t = i / 4;
      lines.push(`M${f1(A[0] + (D[0] - A[0]) * t)} ${f1(A[1] + (D[1] - A[1]) * t)}L${f1(B[0] + (C[0] - B[0]) * t)} ${f1(B[1] + (C[1] - B[1]) * t)}`);
    }
    for (let i = 1; i < 3; i++) {
      const t = i / 3;
      lines.push(`M${f1(A[0] + (B[0] - A[0]) * t)} 0L${f1(D[0] + (C[0] - D[0]) * t)} -56`);
    }
    return [
      { d: `M${A[0] - 3} 3L${B[0] + 3} 3L${C[0] + 3} ${C[1] - 3}L${D[0] - 3} ${D[1] - 3}Z`, f: '#c9d2da' },
      { d: `M${A[0]} 0L${B[0]} 0L${C[0]} ${C[1]}L${D[0]} ${D[1]}Z`, f: '#2c4a86', ln: true },
      { d: lines.join(''), st: '#7d9ad6', sw: 1.2 },
    ];
  };
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: 'M40 -40L66 4', st: K.out, sw: 4.4 }, { d: 'M40 -40L66 4', st: '#8a919c', sw: 2.4 }, { d: 'M-10 -40L14 4', st: K.out, sw: 4.4 }, { d: 'M-10 -40L14 4', st: '#8a919c', sw: 2.4 }]} />
      <OG ow={ow(s)} sh={[...wing(-56, -2), ...wing(2, 56)]} />
      <OG ow={ow(s)} sh={[{ d: rrect(48, -14, 12, 9, 2), f: '#3b3f4b' }]} />
    </G>
  );
}
const panelOut = (x: number, y: number, s: number): P => [x + 60 * s, y - 9 * s];

/** 12 V akü (önden-üstten). x,y = alt orta. Kutuplar: + sol, − sağ */
function Battery12({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={ow(s)}
        sh={[
          { d: rrect(-56, -62, 112, 62, 5), f: '#3b3f4b' },
          { d: rrect(-58, -70, 116, 12, 4), f: '#2f3542' },
          { d: rrect(-42, -80, 16, 12, 3), f: '#c9a43a' },
          { d: rrect(26, -80, 16, 12, 3), f: '#a3adb8' },
          { d: rrect(-44, -40, 88, 26, 4), f: '#596273', ln: true },
        ]}
      />
      <text x={-34} y={-44} text-anchor="middle" font-size={18} font-weight={800} fill="#ff6b5e" font-family={FONT}>+</text>
      <text x={34} y={-44} text-anchor="middle" font-size={20} font-weight={800} fill="#fff" font-family={FONT}>−</text>
      <text x={0} y={-21} text-anchor="middle" font-size={14} font-weight={700} fill="#e9ecef" font-family={FONT}>12 V</text>
    </G>
  );
}
const batPlus = (x: number, y: number, s: number): P => [x - 34 * s, y - 80 * s];
const batMinus = (x: number, y: number, s: number): P => [x + 34 * s, y - 80 * s];

/** Akü maşası (MERKEZ, ağız aşağı) */
function Clamp({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: 'M-8 -22L-5 4L0 8L5 4L8 -22Z', f: c }, { d: rrect(-10, -30, 20, 10, 3), f: shade(c, 0.2) }]} />
    </G>
  );
}

/** Multimetre (MERKEZ) + ekran yazısı */
function Multimeter({ x, y, s = 1, text }: { x: number; y: number; s?: number; text: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(-30, -50, 60, 100, 9), f: '#f2b705' }, { d: rrect(-24, -44, 48, 88, 6), f: '#3b3f4b' }, { d: rrect(-19, -38, 38, 22, 3), f: '#cfe3c8', ln: true }, { d: circ([0, 6], 13), f: '#596273', ln: true }]} />
      <path d="M0 6L0 -5" stroke="#f2b705" stroke-width={3} stroke-linecap="round" />
      <circle cx={-11} cy={32} r={3.6} fill={K.danger} stroke={K.out} stroke-width={1} />
      <circle cx={11} cy={32} r={3.6} fill="#1f2631" stroke="#8a919c" stroke-width={1} />
      <text x={0} y={-22} text-anchor="middle" font-size={text.length > 5 ? 11 : 13} font-weight={800} fill={K.ink} font-family={FONT}>{text}</text>
    </G>
  );
}
/** Multimetre girişleri (sahne koordinatı) */
const mmJack = (x: number, y: number, s: number, red: boolean): P => [x + (red ? -11 : 11) * s, y + 32 * s];

/** Ölçüm probu: kablo + uç. from = multimetre girişi, to = prob ucu */
function Probe({ from, via, to, red }: { from: P; via: P; to: P; red: boolean }) {
  const c = red ? K.danger : '#2b2d3a';
  const ang = Math.atan2(to[1] - via[1], to[0] - via[0]) / R;
  const back = pol(to, ang, -26);
  return (
    <g>
      <Cable pts={[from, via, back]} c={c} w={2.6} />
      <OG sh={[{ d: capsule(back, 4.2, pol(to, ang, -6), 3.4), f: c }]} />
      <path d={`M${f1(pol(to, ang, -7)[0])} ${f1(pol(to, ang, -7)[1])}L${f1(to[0])} ${f1(to[1])}`} stroke="#c9d2da" stroke-width={2.4} stroke-linecap="round" />
    </g>
  );
}

/** Dönüştürücü modül (yeşil kart; MERKEZ) */
function Module({ x, y, s = 1, label }: { x: number; y: number; s?: number; label?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(-34, -20, 68, 40, 3), f: '#2e8b57' }, { d: rrect(-31, -8, 9, 16, 1.5), f: '#3a7bd5', ln: true }, { d: rrect(22, -8, 9, 16, 1.5), f: '#3a7bd5', ln: true }, { d: circ([4, 0], 11), f: '#3b3f4b', ln: true }, { d: rrect(-16, -16, 10, 9, 1.5), f: '#3a7bd5', ln: true }]} />
      <circle cx={-11} cy={-11.5} r={2.6} fill="#f2c94c" stroke={K.out} stroke-width={0.8} />
      <circle cx={-12} cy={10} r={4} fill="#1f2631" stroke="#8a919c" stroke-width={1} />
      {label && <Label x={0} y={-32} text={label} size={12} />}
    </G>
  );
}

/** USB-A dişi soket (MERKEZ) */
function UsbSocket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(-14, -8, 28, 16, 2), f: '#c9d2da' }, { d: rrect(-10, -4, 20, 8, 1), f: '#2b2d3a', ln: true }]} />
      <rect x={-8} y={-3} width={16} height={3} fill="#e9ecef" />
    </G>
  );
}

/** Çok girişli USB başlığı (L: x sol kenar, y orta) */
function Hub({ x, y, n = 4, s = 1 }: { x: number; y: number; n?: number; s?: number }) {
  const w = 16 + n * 18;
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(0, -14, w, 28, 6), f: '#f3f4f6' }, { d: rrect(0, 4, w, 10, 5), f: '#d9dde2', no: true }]} />
      {Array.from({ length: n }, (_, i) => <rect key={i} x={10 + i * 18} y={-5} width={12} height={6} rx={1} fill="#2b2d3a" />)}
      <circle cx={w - 6} cy={-8} r={2.2} fill={K.safe} />
    </G>
  );
}
const hubPort = (x: number, y: number, i: number, s = 1): P => [x + (16 + i * 18) * s, y - 2 * s];

/** Dizüstü bilgisayar (yandan-önden). x,y = taban orta */
function Laptop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: 'M-46 -6L-36 -76H36L46 -6Z', f: '#5b6270' }, { d: 'M-39 -11L-31 -70H31L39 -11Z', f: '#bfe3f5', ln: true }, { d: rrect(-60, -7, 120, 8, 3), f: '#8a919c' }]} />
      <rect x={52} y={-5} width={6} height={3} rx={1} fill="#2b2d3a" />
    </G>
  );
}

/** Sigorta yuvası (MERKEZ, yatay) */
function Fuse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(-26, -11, 52, 22, 9), f: '#e8eef2' }, { d: rrect(-12, -8, 24, 16, 2), f: '#f2b705', ln: true }]} />
      <rect x={-6} y={-3} width={4} height={6} fill="#c9d2da" />
      <rect x={2} y={-3} width={4} height={6} fill="#c9d2da" />
    </G>
  );
}

/** Çakmaklık soketi (dişi, yandan; x,y = ağız ortası, ağız yukarı) */
function LighterSocket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(-16, 0, 32, 40, 4), f: '#3b3f4b' }, { d: ell([0, 0], 18, 6), f: '#2f3542' }, { d: ell([0, 0], 12, 4), f: '#1f2631', ln: true }]} />
    </G>
  );
}

/** 12 V USB adaptörü (soketin içinden yukarı çıkan) */
function CarAdapter({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(-10, -26, 20, 26, 3), f: '#e9ecef' }, { d: rrect(-14, -38, 28, 14, 4), f: '#2f3542' }]} />
      <rect x={-6} y={-34} width={12} height={5} rx={1} fill="#c9d2da" />
      <circle cx={10} cy={-31} r={1.6} fill={K.water} />
    </G>
  );
}

/** Takvim yaprağı (TL) */
function Calendar({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, 96, 92, 6), f: '#fbfaf7' }, { d: rrect(x, y, 96, 24, 6), f: '#3d7ad6' }, { d: rrect(x, y + 14, 96, 10, 0), f: '#3d7ad6', no: true }]} />
      <circle cx={x + 24} cy={y + 2} r={4} fill="#596273" stroke={K.out} stroke-width={1.2} />
      <circle cx={x + 72} cy={y + 2} r={4} fill="#596273" stroke={K.out} stroke-width={1.2} />
      <g fill="#d5d9de">
        {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => <rect key={r + '-' + c} x={x + 10 + c * 16} y={y + 32 + r * 14} width={10} height={8} rx={1} />))}
      </g>
      <Label x={x + 48} y={y + 58} text={text} size={18} />
    </g>
  );
}

/** Masa üstü (zemin şeridi) */
const Desk = ({ y = 168, c = '#c99a6a' }: { y?: number; c?: string }) => (
  <g>
    <rect x={0} y={y} width={320} height={240 - y} fill={c} />
    <rect x={0} y={y} width={320} height={4} fill={shade(c, 0.12)} />
  </g>
);

/** Silindir 18650 hücre (MERKEZ) */
function Cell({ x, y, a = 0, c = '#3a7bd5', swollen, torn }: { x: number; y: number; a?: number; c?: string; swollen?: boolean; torn?: boolean }) {
  const body = swollen ? 'M-10 -28Q-15 0 -10 28H10Q15 0 10 -28Z' : rrect(-10, -28, 20, 56, 4);
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: body, f: c }, { d: rrect(-6, -32, 12, 5, 1.5), f: '#c9d2da' }, ...(torn ? [{ d: 'M-10 6L-2 12L-6 20L-10 22Z', f: '#c9d2da', ln: true }] : [])]} />
      <rect x={-7} y={-18} width={4} height={30} rx={2} fill={tint(c, 0.35)} />
    </G>
  );
}

/** Kalem pil (MERKEZ, yatay) */
function AA({ x, y, c = '#3a7bd5' }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x - 22, y - 7, 44, 14, 3), f: c }, { d: rrect(x + 10, y - 7, 12, 14, 3), f: '#c9d2da' }, { d: rrect(x + 22, y - 3, 3, 6, 1), f: '#a3adb8' }]} />
    </g>
  );
}

/** Uyarı kızıllığı olmadan ısı dalgası */
function HeatWaves({ x, y, n = 3 }: { x: number; y: number; n?: number }) {
  return (
    <g fill="none" stroke="#f08a5d" stroke-width={3} stroke-linecap="round" opacity={0.85}>
      {Array.from({ length: n }, (_, i) => <path key={i} d={`M${x + i * 14} ${y}c-5-6 5-10 0-16c-5-6 5-10 0-16`} />)}
    </g>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ── kategori kutusu ── */
  'cat-enerji': () => {
    const disc = '#25331a';
    return (
      <Scene2 bg="dark">
        <circle cx={160} cy={120} r={108} fill="#1f2a18" />
        <circle cx={160} cy={120} r={102} fill={disc} />
        <Sun x={92} y={66} r={14} />
        <Bolt x={236} y={62} s={0.9} />
        <Cable pts={[[112, 178], [112, 198], [160, 204], [204, 198], [204, 184]]} c="#e9ecef" w={3.4} />
        <Powerbank x={112} y={140} s={1.5} lv={3} />
        <BigPhone x={204} y={130} s={1.5}>
          <BatteryIcon y={-2} k={1.2} lv={0.7} />
        </BigPhone>
        <Arrow from={[140, 96]} to={[176, 96]} w={5} color={LIME} />
      </Scene2>
    );
  },

  'enerji-powerbank-telefon': () => (
    <Scene2 bg="closeup">
      <Desk />
      <Cable pts={[[110, 186], [112, 206], [170, 210], [214, 204], [214, 190]]} c="#e9ecef" w={3.4} />
      <Powerbank x={110} y={150} s={1.4} lv={3} />
      <BigPhone x={214} y={142} s={1.35}>
        <BatteryIcon k={1.2} lv={0.75} />
      </BigPhone>
      <Arrow from={[138, 216]} to={[188, 216]} w={5} />
    </Scene2>
  ),

  'enerji-ucak-modu': () => {
    const plane = 'M0 -20L4 -6L18 2L18 6L4 2L3 12L8 16L8 19L0 17L-8 19L-8 16L-3 12L-4 2L-18 6L-18 2L-4 -6Z';
    return (
      <Scene2 bg="closeup">
        <BigPhone x={150} y={118} s={2.4}>
          <path d={plane} transform="translate(0 -12) scale(0.7)" fill="#3d7ad6" stroke={K.ink} stroke-width={0.8} />
          <rect x={-11} y={4} width={22} height={11} rx={5.5} fill={K.safe} />
          <circle cx={5.5} cy={9.5} r={4.2} fill="#fff" />
        </BigPhone>
        <Hand x={200} y={232} a={-20} s={1.25} pose="point" side="L" arm={120} sleeve={K.role.helper} skin={2} />
        <G x={258} y={64}>
          <circle r={20} fill="#fbfaf7" stroke={K.out} stroke-width={1.8} />
          <path d="M0 -13V0L9 6" stroke={K.ink} stroke-width={2.6} fill="none" stroke-linecap="round" />
        </G>
        <Arrow from={[258, 92]} to={[214, 112]} bend={-0.2} w={4} />
      </Scene2>
    );
  },

  'enerji-dusuk-guc': () => (
    <Scene2 bg="closeup">
      <BigPhone x={150} y={118} s={2.4} screen="#0b0e13">
        <rect x={-13} y={-24} width={26} height={3} rx={1.5} fill="#596273" />
        <rect x={-13} y={-16} width={16} height={3} rx={1.5} fill="#596273" />
        <rect x={-14} y={-6} width={28} height={14} rx={3} fill="#1b2230" />
        <rect x={-12} y={-2} width={10} height={2.4} rx={1.2} fill="#e9ecef" />
        <rect x={2} y={-3} width={10} height={6} rx={3} fill="#f5a524" />
        <circle cx={9} cy={0} r={2.4} fill="#fff" />
        <rect x={-13} y={14} width={22} height={3} rx={1.5} fill="#3b4252" />
      </BigPhone>
      <Hand x={232} y={236} a={-38} s={1.25} pose="point" side="L" arm={120} sleeve={K.role.bystander} skin={0} />
    </Scene2>
  ),

  'enerji-kapasite': () => (
    <Scene2 bg="closeup">
      <Powerbank x={66} y={124} s={2} lv={3} />
      <Label x={66} y={190} text="10 000" size={14} bg="#fbfaf7" />
      <Arrow from={[112, 124]} to={[160, 124]} w={6} />
      <Label x={136} y={96} text="%65" size={14} />
      <BigPhone x={196} y={124} s={1.1}>
        <BatteryIcon k={1.2} lv={1} charge={false} />
      </BigPhone>
      <BigPhone x={262} y={124} s={1.1}>
        <BatteryIcon k={1.2} lv={0.5} charge={false} />
      </BigPhone>
      <Label x={229} y={190} text="≈ 1,5" size={16} bg="#fbfaf7" />
    </Scene2>
  ),

  'enerji-takvim-3ay': () => (
    <Scene2 bg="indoor" gy={170}>
      <Calendar x={40} y={36} text="3 AY" />
      <Table x={150} y={214} w={150} h={46} />
      <Powerbank x={210} y={140} s={1.3} lv={2} />
      <Cable pts={[[210, 172], [230, 178], [280, 176], [300, 120]]} c="#e9ecef" w={3} />
      <path d="M190 74a26 26 0 1 1 6 40" fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
      <path d="M190 74a26 26 0 1 1 6 40" fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" />
      <path d="M182 64L192 76L178 80Z" fill={K.action} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
    </Scene2>
  ),

  'enerji-arac-uyuma-yasak': () => (
    <Scene2 bg="indoor" wall="#8e8a82" gy={196}>
      {/* kapalı garaj: kepenk */}
      <rect x={0} y={0} width={320} height={30} fill="#6d6a64" />
      <g stroke="#7b7871" stroke-width={2}>{[40, 70, 100, 130, 160].map((y) => <line key={y} x1={0} y1={y} x2={320} y2={y} />)}</g>
      <Car x={170} y={222} s={2} color="#4f78b0" />
      {/* camda uyuyan sürücü */}
      <circle cx={190} cy={140} r={10} fill={K.skin[2]} stroke={K.out} stroke-width={1.4} />
      <path d="M180 137Q190 124 200 136" fill={K.hair.black} stroke={K.out} stroke-width={1.2} />
      <path d="M192 142h5" stroke={K.ink} stroke-width={1.6} stroke-linecap="round" />
      <text x={212} y={116} font-size={16} font-weight={700} fill={K.ink} font-family={FONT}>z z</text>
      <Smoke x={0} y={150} w={70} h={40} kind="cloud" />
      <Smoke x={0} y={34} w={320} h={44} />
      <No x={60} y={90} r={40} />
    </Scene2>
  ),

  'enerji-panel-bulut': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={158} height={240} fill="#c7ced6" />
      <Cloud x={70} y={46} s={1.3} />
      <Cloud x={120} y={70} s={0.8} c="#a9b3bd" />
      <SolarPanel x={74} y={196} s={0.95} />
      <rect x={162} y={0} width={158} height={240} fill="#efe6d6" />
      <Window x={178} y={28} w={126} h={130} />
      <SolarPanel x={238} y={150} s={0.72} />
      <rect x={162} y={196} width={158} height={44} fill="#c99a6a" />
      <line x1={160} y1={0} x2={160} y2={240} stroke={K.out} stroke-width={3} />
      <Arrow from={[40, 110]} to={[40, 148]} w={4} />
      <Arrow from={[290, 172]} to={[290, 210]} w={4} />
    </Scene2>
  ),

  'enerji-kurmali': () => {
    const hub: P = [214, 126];
    return (
      <Scene2 bg="closeup">
        <Desk y={176} />
        <Radio x={140} y={180} s={2} />
        <OG sh={[{ d: circ(hub, 8), f: '#596273' }, { d: capsule(hub, 5, [240, 150], 5), f: '#8a919c' }, { d: capsule([240, 150], 6, [252, 150], 6), f: '#2f3542' }]} />
        <Hand x={276} y={198} a={-50} s={1.05} pose="fist" side="L" arm={110} sleeve={K.role.helper2} skin={1} />
        <path d="M184 92a40 40 0 1 1 -4 64" fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
        <path d="M184 92a40 40 0 1 1 -4 64" fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" />
        <path d="M186 160L174 150L172 166Z" fill={K.action} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
      </Scene2>
    );
  },

  'enerji-bisiklet-dinamo': () => {
    const c: P = [130, 150];
    return (
      <Scene2 bg="outdoor" ground="pavement">
        {/* teker */}
        <circle cx={c[0]} cy={c[1]} r={66} fill="none" stroke={K.out} stroke-width={11} />
        <circle cx={c[0]} cy={c[1]} r={66} fill="none" stroke="#3b3f4b" stroke-width={8} />
        <g stroke="#a3adb8" stroke-width={1.6}>{Array.from({ length: 12 }, (_, i) => { const p = pol(c, i * 30, 60); return <line key={i} x1={c[0]} y1={c[1]} x2={f1(p[0])} y2={f1(p[1])} />; })}</g>
        {/* göbek dinamosu */}
        <OG sh={[{ d: circ(c, 14), f: '#c9d2da' }, { d: circ(c, 6), f: '#596273', ln: true }]} />
        {/* çatal ve kadro */}
        <OG sh={[{ d: capsule(c, 4, [176, 40], 5), f: '#3d7ad6' }, { d: capsule([176, 40], 5, [300, 52], 5), f: '#3d7ad6' }, { d: capsule([170, 30], 4, [196, 24], 4), f: '#2f3542' }]} />
        <Cable pts={[[c[0] + 8, c[1] - 6], [160, 96], [184, 58], [214, 52]]} c="#2b2d3a" w={2.4} />
        {/* gidondaki kutu + powerbank */}
        <OG sh={[{ d: rrect(206, 60, 40, 26, 4), f: '#2e8b57' }]} />
        <Cable pts={[[246, 74], [262, 92], [262, 104]]} c="#e9ecef" w={2.6} />
        <Powerbank x={262} y={132} s={1.05} lv={2} />
        <Arrow from={[60, 74]} to={[92, 92]} bend={0.3} w={4} />
      </Scene2>
    );
  },

  'enerji-kalem-pil': () => (
    <Scene2 bg="closeup">
      <Desk />
      <OG sh={[{ d: rrect(40, 104, 116, 88, 8), f: '#2f3542' }, { d: rrect(48, 112, 100, 72, 5), f: '#1f2631', ln: true }]} />
      <AA x={96} y={124} />
      <AA x={96} y={142} c="#d9a13a" />
      <AA x={96} y={160} />
      <AA x={96} y={178} c="#d9a13a" />
      <Cable pts={[[156, 150], [186, 150], [200, 196], [232, 200], [236, 184]]} c="#e9ecef" w={3.2} />
      <BigPhone x={236} y={136} s={1.3}>
        <BatteryIcon k={1.2} lv={0.25} />
      </BigPhone>
    </Scene2>
  ),

  'enerji-laptop-usb': () => (
    <Scene2 bg="closeup">
      <Desk y={180} />
      <Laptop x={124} y={184} s={1.4} />
      <Cable pts={[[202, 178], [222, 182], [244, 188], [250, 176]]} c="#e9ecef" w={3} />
      <BigPhone x={250} y={140} s={1.0}>
        <BatteryIcon k={1.1} lv={0.55} />
      </BigPhone>
    </Scene2>
  ),

  'enerji-ups': () => (
    <Scene2 bg="indoor" gy={180}>
      <OG sh={[{ d: rrect(70, 92, 96, 118, 8), f: '#2f3542' }, { d: rrect(78, 100, 80, 30, 4), f: '#3b3f4b', ln: true }]} />
      <circle cx={96} cy={115} r={6} fill={K.safe} stroke={K.out} stroke-width={1.2} />
      <text x={130} y={120} font-size={13} font-weight={700} fill="#e9ecef" font-family={FONT}>UPS</text>
      <OG sh={[{ d: rrect(98, 150, 22, 20, 3), f: '#f3f4f6' }]} />
      <Cable pts={[[109, 150], [60, 150], [56, 96], [112, 92]]} c="#e9ecef" w={3} />
      <BigPhone x={118} y={66} s={0.68}>
        <BatteryIcon k={1.2} lv={0.6} />
      </BigPhone>
      <Ok x={150} y={168} r={12} />
      {/* ısıtıcı */}
      <OG sh={[{ d: rrect(220, 96, 70, 108, 10), f: '#e7e2d8' }, { d: rrect(230, 110, 50, 70, 4), f: '#f08a5d', ln: true }]} />
      <g stroke="#c9563a" stroke-width={2.4}>{[122, 138, 154, 170].map((y) => <line key={y} x1={236} y1={y} x2={274} y2={y} />)}</g>
      <Cable pts={[[255, 204], [255, 214], [190, 214], [150, 196]]} c="#2f3542" w={3} />
      <No x={255} y={150} r={46} />
    </Scene2>
  ),

  'enerji-telefon-telefona': () => (
    <Scene2 bg="closeup">
      <Desk y={178} />
      {/* yandan: alttaki telefon yüzüstü, üstteki telefon sırtı ona değiyor */}
      <OG sh={[{ d: rrect(80, 160, 160, 14, 5), f: '#2f3542' }, { d: rrect(84, 138, 152, 14, 5), f: '#4f78b0' }]} />
      <rect x={92} y={137} width={136} height={3} rx={1.5} fill="#bfe3f5" />
      <g stroke={K.action} stroke-width={2.6} fill="none" stroke-linecap="round">
        <path d="M130 156q10-4 20 0t20 0" /><path d="M150 156q10-4 20 0" />
      </g>
      <Arrow from={[64, 166]} to={[64, 140]} w={4} />
      <BigPhone x={250} y={70} s={0.9}>
        <BatteryIcon k={1.1} lv={0.45} />
      </BigPhone>
      <Ok x={278} y={36} r={10} />
    </Scene2>
  ),

  'enerji-coklu-usb': () => {
    const hx = 98, hy = 186;
    const phones: P[] = [[52, 104], [124, 96], [196, 96], [268, 104]];
    return (
      <Scene2 bg="closeup">
        <Desk y={170} />
        {phones.map((p, i) => (
          <g key={i}>
            <Cable pts={[hubPort(hx, hy, i), [hubPort(hx, hy, i)[0], 166], [p[0], 150]]} c="#e9ecef" w={2.6} />
            <BigPhone x={p[0]} y={p[1]} s={0.95}>
              <BatteryIcon k={1} lv={0.3 + i * 0.15} />
              <rect x={-12} y={18} width={24} height={6} rx={1} fill="#f5e6a8" />
            </BigPhone>
          </g>
        ))}
        <Hub x={hx} y={hy} n={4} />
      </Scene2>
    );
  },

  'enerji-sarj-noktasi': () => (
    <Scene2 bg="outdoor">
      {/* gölgelik */}
      <OG sh={[{ d: 'M40 70L150 46L260 70Z', f: '#3e9b8f' }, { d: rrect(46, 70, 4, 120, 1), f: '#8a919c' }, { d: rrect(250, 70, 4, 120, 1), f: '#8a919c' }]} />
      <Table x={70} y={206} w={160} h={52} />
      <Hub x={96} y={146} n={4} s={0.9} />
      {[[110, 140], [128, 140], [150, 140], [170, 140]].map((p, i) => <BigPhone key={i} x={p[0] + i * 6} y={130} s={0.4} />)}
      <Person x={262} y={226} s={0.78} who="woman" role="bystander" hair="scarf" hairC="#5b6aa0" skin={1} flip pose={POSE.standSide} />
      <Person x={298} y={222} s={0.72} who="oldman" role="bystander3" skin={1} flip pose={POSE.standSide} />
      <Person x={44} y={228} s={0.8} who="man" role="helper" skin={2} pose={{ ...POSE.standSide, armF: { to: [104, 136] } }} />
    </Scene2>
  ),

  'enerji-yastik-yasak': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: rrect(20, 130, 200, 70, 10), f: '#7aa6d6' }, { d: rrect(30, 110, 110, 34, 14), f: '#fbfaf7' }]} />
      <BigPhone x={110} y={140} s={0.6} a={90} />
      <Cable pts={[[132, 140], [150, 150], [170, 196], [200, 214]]} c="#e9ecef" w={2.6} />
      <HeatWaves x={70} y={110} />
      <No x={100} y={130} r={56} />
      {/* doğru: sert masada */}
      <OG sh={[{ d: rrect(232, 40, 76, 76, 10), f: '#fbfaf7' }, { d: rrect(236, 92, 68, 20, 3), f: '#c99a6a', no: true }]} />
      <BigPhone x={270} y={84} s={0.5} a={90} />
      <Ok x={296} y={50} r={11} />
    </Scene2>
  ),

  'enerji-islak-telefon-yasak': () => (
    <Scene2 bg="closeup">
      <Desk y={180} />
      <BigPhone x={118} y={130} s={1.6}>
        <BatteryIcon k={1} lv={0.15} charge={false} />
      </BigPhone>
      {[[90, 80], [146, 96], [100, 168], [150, 150]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 9}C${x + 6} ${y - 2} ${x + 6} ${y + 6} ${x} ${y + 6}C${x - 6} ${y + 6} ${x - 6} ${y - 2} ${x} ${y - 9}Z`} fill={K.water} stroke={K.out} stroke-width={1.2} />
      ))}
      <Cable pts={[[118, 188], [118, 206], [186, 210], [186, 196]]} c="#e9ecef" w={3} />
      <No x={130} y={130} r={66} />
      <OG sh={[{ d: 'M226 168Q260 200 294 168Z', f: '#fbfaf7' }, { d: ell([260, 168], 34, 8), f: '#f3ecdc', ln: true }]} />
      <Bad x={260} y={140} r={13} />
    </Scene2>
  ),

  'enerji-direk-yasak': () => (
    <Scene2 bg="outdoor" ground="pavement">
      <OG sh={[{ d: rrect(196, 20, 10, 196, 3), f: '#4a5160' }, { d: rrect(193, 150, 16, 26, 3), f: '#596273', ln: true }]} />
      <path d="M201 24Q201 10 230 12" stroke="#4a5160" stroke-width={6} fill="none" />
      <Person x={130} y={226} s={1.0} who="man" role="bystander4" skin={1} pose={{ ...POSE.standSide, armF: { to: [194, 162] }, armB: { to: [186, 168] } }} />
      <Cable pts={[[194, 164], [170, 190], [150, 210]]} c="#2f3542" w={2.4} />
      <Spark x={196} y={160} r={14} />
      <Bolt x={240} y={140} s={0.9} />
      <No x={170} y={120} r={74} />
    </Scene2>
  ),

  'enerji-sarj-cantasi': () => (
    <Scene2 bg="floor">
      <Backpack x={64} y={52} s={1.4} />
      <Powerbank x={150} y={80} s={1.1} a={-10} lv={3} />
      <Powerbank x={186} y={82} s={1.1} a={8} lv={3} />
      <g fill="none" stroke={K.out} stroke-width={6}><circle cx={250} cy={78} r={20} /></g>
      <circle cx={250} cy={78} r={20} fill="none" stroke="#e9ecef" stroke-width={3.6} />
      <circle cx={250} cy={78} r={13} fill="none" stroke="#e9ecef" stroke-width={3.6} />
      <CarAdapter x={150} y={176} s={1.3} />
      <OG sh={[{ d: rrect(186, 140, 72, 56, 4), f: '#2c4a86' }]} />
      <path d="M210 140V196M234 140V196M186 168H258" stroke="#7d9ad6" stroke-width={1.4} />
      <Radio x={290} y={196} s={0.8} waves={false} />
      <Ok x={60} y={190} r={12} />
    </Scene2>
  ),

  /* ── kendin yap ── */
  'enerji-aku-usb-kutu': () => {
    const bx = 92, by = 214, s = 1.05;
    const p = batPlus(bx, by, s), m = batMinus(bx, by, s);
    return (
      <Scene2 bg="closeup">
        <Desk y={190} />
        <Battery12 x={bx} y={by} s={s} />
        <Clamp x={p[0]} y={p[1] - 4} c={K.danger} />
        <Clamp x={m[0]} y={m[1] - 4} c="#2f3542" />
        <Cable pts={[[p[0], p[1] - 34], [p[0], 76], [150, 64], [196, 64]]} c={K.danger} w={3.2} />
        <Fuse x={130} y={70} s={0.8} />
        <Cable pts={[[m[0], m[1] - 34], [m[0] + 30, 96], [210, 100]]} c="#2f3542" w={3.2} />
        <LighterSocket x={222} y={100} s={0.9} />
        <CarAdapter x={222} y={100} s={0.9} />
        <Cable pts={[[222, 64], [222, 46], [268, 40], [282, 60]]} c="#e9ecef" w={2.6} />
        <BigPhone x={282} y={96} s={0.85}>
          <BatteryIcon k={1} lv={0.6} />
        </BigPhone>
      </Scene2>
    );
  },

  'enerji-multimetre-aku': () => {
    const bx = 196, by = 214, s = 1.05;
    const p = batPlus(bx, by, s), m = batMinus(bx, by, s);
    return (
      <Scene2 bg="closeup">
        <Desk y={190} />
        <Battery12 x={bx} y={by} s={s} />
        <Multimeter x={64} y={130} s={1.2} text="12,6 V" />
        <Probe from={mmJack(64, 130, 1.2, true)} via={[110, 116]} to={[p[0], p[1] + 2]} red />
        <Probe from={mmJack(64, 130, 1.2, false)} via={[200, 90]} to={[m[0], m[1] + 2]} red={false} />
      </Scene2>
    );
  },

  'enerji-sigorta': () => (
    <Scene2 bg="closeup">
      <Battery12 x={74} y={228} s={1.1} />
      <Clamp x={batPlus(74, 228, 1.1)[0]} y={batPlus(74, 228, 1.1)[1] - 4} c={K.danger} />
      <Cable pts={[[batPlus(74, 228, 1.1)[0], 106], [36, 70], [120, 60], [310, 60]]} c={K.danger} w={4.4} />
      <Fuse x={168} y={60} s={1.8} />
      <Arrow from={[168, 132]} to={[168, 92]} w={5} />
      <Label x={168} y={150} text="5–10 A" size={14} />
    </Scene2>
  ),

  'enerji-multimetre-usb': () => {
    const mx = 168, my = 104;
    return (
      <Scene2 bg="closeup">
        <Desk y={188} />
        <Module x={mx} y={my + 70} s={1.5} />
        <Multimeter x={60} y={96} s={1.15} text="5,0 V" />
        <Probe from={mmJack(60, 96, 1.15, true)} via={[110, 218]} to={[mx + 42, my + 64]} red />
        <Probe from={mmJack(60, 96, 1.15, false)} via={[140, 222]} to={[mx + 42, my + 80]} red={false} />
        <OG sh={[{ d: capsule([168, 40], 4, [150, 152], 3), f: '#d9a13a' }, { d: capsule([150, 152], 2, [148, 162], 1.4), f: '#a3adb8' }]} />
        <Hand x={196} y={28} a={160} s={1.0} pose="pinch" side="R" arm={60} sleeve={K.role.helper} skin={1} />
      </Scene2>
    );
  },

  'enerji-buck': () => (
    <Scene2 bg="closeup">
      <Sun x={40} y={36} r={14} />
      <SolarPanel x={66} y={170} s={0.7} />
      <Cable pts={[panelOut(66, 170, 0.7), [124, 168], [132, 150]]} c="#2f3542" w={2.6} />
      <Module x={164} y={150} s={0.9} label="5 V" />
      <Cable pts={[[195, 150], [214, 150]]} c="#2f3542" w={2.6} />
      <UsbSocket x={228} y={150} />
      <Cable pts={[[242, 150], [262, 150], [266, 168]]} c="#e9ecef" w={2.6} />
      <Powerbank x={272} y={194} s={0.95} lv={2} />
      <Arrow from={[110, 196]} to={[140, 196]} w={4} />
      <Arrow from={[200, 196]} to={[240, 196]} w={4} />
    </Scene2>
  ),

  'enerji-dinamo-devre': () => {
    const y = 120;
    return (
      <Scene2 bg="closeup">
        {/* dinamo */}
        <OG sh={[{ d: ell([42, y], 20, 26), f: '#c9d2da' }, { d: ell([42, y], 9, 12), f: '#8a919c', ln: true }]} />
        <path d="M30 154q6-8 12 0t12 0" stroke={K.ink} stroke-width={2.4} fill="none" />
        <Cable pts={[[62, y - 8], [86, y - 8]]} c="#2b2d3a" w={2.4} />
        <Cable pts={[[62, y + 8], [86, y + 8]]} c="#2b2d3a" w={2.4} />
        {/* köprü diyot */}
        <G x={108} y={y}>
          <OG sh={[{ d: 'M0 -22L22 0L0 22L-22 0Z', f: '#2f3542' }]} />
          <g stroke="#e9ecef" stroke-width={1.6} fill="none"><path d="M-8 -6L-2 -12M2 -12L8 -6M8 6L2 12M-2 12L-8 6" /></g>
        </G>
        <Cable pts={[[130, y], [150, y]]} c={K.danger} w={2.4} />
        {/* kondansatör */}
        <OG sh={[{ d: rrect(150, y - 26, 26, 50, 5), f: '#3a7bd5' }, { d: rrect(150, y - 26, 26, 8, 4), f: '#c9d2da' }, { d: rrect(150, y + 12, 8, 12, 2), f: '#e9ecef', no: true }]} />
        <Cable pts={[[176, y], [196, y]]} c={K.danger} w={2.4} />
        {/* regülatör */}
        <OG sh={[{ d: rrect(196, y - 18, 30, 30, 2), f: '#2b2d3a' }, { d: rrect(198, y - 30, 26, 14, 2), f: '#a3adb8' }]} />
        <path d={`M204 ${y + 12}V${y + 26}M211 ${y + 12}V${y + 26}M218 ${y + 12}V${y + 26}`} stroke="#a3adb8" stroke-width={2} />
        <Cable pts={[[226, y], [254, y]]} c={K.danger} w={2.4} />
        <UsbSocket x={270} y={y} />
        <Label x={210} y={y - 46} text="5 V" size={13} />
        <Arrow from={[70, 190]} to={[250, 190]} w={4} />
      </Scene2>
    );
  },

  'enerji-turbin': () => {
    const hub: P = [150, 64];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: rrect(146, 70, 8, 140, 2), f: '#8a919c' }, { d: rrect(150, 56, 40, 18, 6), f: '#596273' }]} />
        {[0, 120, 240].map((a) => (
          <OG key={a} sh={[{ d: capsule(hub, 4, pol(hub, a - 90, 54), 9), f: '#fbfaf7' }]} />
        ))}
        <OG sh={[{ d: circ(hub, 7), f: '#3b3f4b' }]} />
        <Cable pts={[[156, 120], [160, 200], [196, 210], [212, 204]]} c="#2b2d3a" w={2.4} />
        <OG sh={[{ d: rrect(212, 188, 36, 26, 4), f: '#2e8b57' }]} />
        <Cable pts={[[248, 200], [262, 206]]} c="#e9ecef" w={2.4} />
        <Powerbank x={278} y={198} s={0.85} lv={1} />
        <g stroke="#ffffff" stroke-width={3} stroke-linecap="round" opacity={0.9}>
          <path d="M20 50H80M30 70H90M14 92H70" />
        </g>
        <path d="M206 30a40 40 0 0 1 10 46" fill="none" stroke={K.action} stroke-width={4} stroke-linecap="round" />
      </Scene2>
    );
  },

  'enerji-su-carki': () => {
    const c: P = [130, 150];
    return (
      <Scene2 bg="outdoor" gy={150}>
        <Water x={0} y={150} w={320} h={90} />
        <rect x={210} y={140} width={110} height={100} fill={K.grass} />
        <path d="M210 140Q200 190 216 240" stroke={K.grassShade} stroke-width={6} fill="none" />
        <circle cx={c[0]} cy={c[1]} r={40} fill="none" stroke={K.out} stroke-width={7} />
        <circle cx={c[0]} cy={c[1]} r={40} fill="none" stroke="#b77f50" stroke-width={4} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = i * 45;
          return <OG key={i} sh={[{ d: capsule(pol(c, a, 18), 3, pol(c, a, 50), 6), f: '#c99a6a' }]} />;
        })}
        <OG sh={[{ d: circ(c, 8), f: '#596273' }]} />
        <path d={`M${c[0]} ${c[1]}L232 132`} stroke="#d8c39a" stroke-width={3} />
        <OG sh={[{ d: rrect(228, 120, 8, 36, 2), f: '#87573a' }]} />
        <Cable pts={[[c[0] + 6, c[1] - 8], [200, 110], [252, 112]]} c="#2b2d3a" w={2.2} />
        <OG sh={[{ d: rrect(250, 100, 32, 24, 4), f: '#2e8b57' }]} />
        <Person x={290} y={226} s={0.7} who="woman" role="helper" hair="ponytail" hairC={K.hair.dark} skin={1} flip pose={POSE.standSide} />
        <Arrow from={[24, 196]} to={[80, 196]} w={4} color={K.waterLight} />
      </Scene2>
    );
  },

  'enerji-teg': () => (
    <Scene2 bg="indoor" gy={206}>
      {/* odun sobası */}
      <OG sh={[{ d: rrect(60, 136, 150, 78, 6), f: '#3b3f4b' }, { d: rrect(78, 156, 56, 40, 4), f: '#2b2d3a', ln: true }, { d: rrect(180, 20, 16, 118, 2), f: '#596273' }, { d: rrect(66, 212, 10, 12, 2), f: '#2b2d3a' }, { d: rrect(194, 212, 10, 12, 2), f: '#2b2d3a' }]} />
      <rect x={86} y={166} width={40} height={22} rx={3} fill="#f08a5d" opacity={0.8} />
      <OG sh={[{ d: rrect(96, 128, 76, 8, 2), f: '#8a919c' }, { d: rrect(116, 120, 40, 8, 1), f: '#fbfaf7' }, { d: rrect(108, 78, 56, 42, 6), f: '#a3adb8' }, { d: ell([136, 78], 28, 6), f: '#9dd5f6', ln: true }]} />
      <Cable pts={[[156, 123], [214, 106], [236, 108]]} c={K.danger} w={2.2} />
      <Cable pts={[[156, 126], [214, 116], [236, 116]]} c="#2b2d3a" w={2.2} />
      <Module x={252} y={112} s={0.55} />
      <Cable pts={[[268, 112], [284, 124], [284, 140]]} c="#e9ecef" w={2.4} />
      <Powerbank x={284} y={166} s={0.85} lv={1} />
      <Label x={60} y={60} text="150°" size={14} bg="#fbfaf7" />
    </Scene2>
  ),

  'enerji-teg-alev-yasak': () => (
    <Scene2 bg="dark">
      <Flame x={160} y={214} s={2.2} />
      <OG sh={[{ d: rrect(136, 120, 48, 8, 1), f: '#fbfaf7' }]} />
      <Smoke x={120} y={60} w={80} h={40} kind="cloud" />
      <Hand x={250} y={170} a={-90} s={1.1} pose="pinch" side="L" arm={90} sleeve={K.role.bystander3} skin={2} />
      <No x={160} y={130} r={70} />
      <Label x={54} y={40} text="150°" size={14} bg="#fbfaf7" />
    </Scene2>
  ),

  'enerji-18650-yasak': () => (
    <Scene2 bg="closeup">
      <Desk y={150} />
      <Cell x={80} y={170} a={-20} c="#3a7bd5" torn />
      <Cell x={130} y={180} a={70} c="#6c9c5a" />
      <Cell x={190} y={168} a={10} c="#d9a13a" swollen />
      <Cell x={246} y={182} a={-60} c="#8f6fc2" />
      <OG sh={[{ d: circ([140, 212], 10), f: '#d9a13a' }, { d: capsule([214, 214], 5, [262, 206], 4), f: '#a3adb8' }]} />
      <Spark x={154} y={196} r={11} />
      <No x={160} y={150} r={76} />
    </Scene2>
  ),

  'enerji-limon-yasak': () => (
    <Scene2 bg="closeup">
      <Desk y={170} />
      {[60, 112, 164].map((x, i) => (
        <g key={i}>
          <OG sh={[{ d: ell([x, 176], 26, 18), f: '#f4d03f' }, { d: ell([x + 24, 172], 5, 4), f: '#e0b92e' }]} />
          <rect x={x - 12} y={150} width={4} height={18} fill="#c98d63" stroke={K.out} stroke-width={1} />
          <rect x={x + 8} y={150} width={4} height={18} fill="#a3adb8" stroke={K.out} stroke-width={1} />
        </g>
      ))}
      <path d="M58 150Q84 126 110 150M110 150Q136 126 162 150" stroke={K.danger} stroke-width={2} fill="none" />
      <Cable pts={[[174, 150], [200, 140], [236, 182], [256, 178]]} c="#e9ecef" w={2.4} />
      <BigPhone x={256} y={132} s={1.1}>
        <BatteryIcon k={1.1} lv={0} charge={false} />
      </BigPhone>
      <Bad x={284} y={84} r={15} />
    </Scene2>
  ),

  'enerji-aku-telefon-yasak': () => {
    const bx = 120, by = 220, s = 1.1;
    const p = batPlus(bx, by, s), m = batMinus(bx, by, s);
    return (
      <Scene2 bg="closeup">
        <Battery12 x={bx} y={by} s={s} />
        <path d={`M${p[0]} ${p[1]}Q${p[0]} 60 230 70`} stroke="#c98d63" stroke-width={2.6} fill="none" />
        <path d={`M${m[0]} ${m[1]}Q${m[0] + 20} 90 232 92`} stroke="#c98d63" stroke-width={2.6} fill="none" />
        <BigPhone x={256} y={90} s={1.0}>
          <BatteryIcon k={1} lv={0.1} charge={false} />
        </BigPhone>
        <Spark x={p[0]} y={p[1] - 4} r={13} />
        <Smoke x={210} y={30} w={80} h={30} kind="cloud" />
        <No x={170} y={130} r={80} />
      </Scene2>
    );
  },
};
