// Sıfırdan paketi sahneleri (b). Bkz. docs/agents/SIFIRDAN_CIZIM.md
// Enerji (pedal, alternatör, pil, termoelektrik) ve kimya/malzeme rehberleri.
import type { JSX } from 'preact';
import {
  Scene2, Person, POSE, K, OG, capsule, rrect, ell, circ, smooth, shade, tint, Arrow, Label, No, Ok, Bad, Timer,
  Campfire, Flame, Pot, Stove, Smoke, Phone, Table, Window, Door, Bed, Tree, Hand, handPoint, rig, Drop, Waves,
} from '../../../src/art/kit2';
import type { PersonProps, Rig, P, Sh } from '../../../src/art/kit2';

/* ═══════════════════════ OYUNCULAR (CAST) ═══════════════════════ */
// Elektrik rehberleri: aynı usta (esmer, kısa siyah saç, hardal üst, lacivert pantolon).
const EL = { who: 'man', role: 'bystander2', skin: 2, hair: 'short', hairC: K.hair.black, bottomC: K.pants.navy } as const;
// Kimya rehberleri (kostik, kireç, alçı, kül suyu, kömür, cam, biyogaz, odun gazı): aynı kadın;
// uzun kollu yeşil üst, topuz saç, koruyucu gözlük ve sarı lastik eldiven HER sahnede.
const KIM = { who: 'woman', role: 'bystander3', skin: 1, hair: 'bun', hairC: K.hair.dark, sleeve: 'long', bottomC: K.pants.dark } as const;
// Kimya güvenliği: gözüne kostik kaçan yardımlı kişi (mavi üst).
const KAZA = { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.grey } as const;
// Mum: yaşlı kadın. Yağ: yaşlı adam. Kâğıt: genç adam. Mürekkep: el yakın planı (ten 1).
const MUM = { who: 'oldwoman', role: 'bystander4', skin: 1 } as const;
const YAG = { who: 'oldman', role: 'bystander2', skin: 2 } as const;
const KAG = { who: 'man', role: 'bystander', skin: 3, hair: 'short', hairC: K.hair.black, bottomC: K.pants.khaki } as const;
// Biyogaz: çiftçi (adam, kiremit üst) + 112'yi arayan komşu (KIM).
const CIF = { who: 'man', role: 'bystander4', skin: 1, hair: 'short', hairC: K.hair.dark, bottomC: K.pants.brown } as const;
// Odun gazı: zehirlenen kişi (CIF ile aynı çiftçi) + çıkaran KIM.

/* ═══════════════════════ MALZEME RENKLERİ ═══════════════════════ */
const IRON = '#4b5059'; // demir (kazan, soba)
const ALU = '#c9d0d8'; // alüminyum
const LIME = '#f1efe8'; // kireç, alçı (beyaz)
const ASH = '#9b9893'; // kül
const LYE = '#9a6a2e'; // kül suyu (kahverengi)
const SOIL = '#8a6040'; // toprak
const SOILD = '#6f4a30';
const CLAY = '#c27a4a'; // pişmiş toprak / kil
const STONE = '#b7b2a6';
const WAX = '#f2cf5b'; // balmumu
const OIL = '#e8c23a'; // zeytinyağı
const CHAR = '#2c2a2b'; // kömür
const GLOVE = '#f2c43d'; // sarı lastik eldiven
const GOG = '#b9e6f2'; // gözlük camı
const STRAP = '#2f3540';
const RED_W = '#d63b35';
const BLK_W = '#2b2d3a';
const PLA = '#dfe3e8'; // plastik kova/kutu

const F = "'IBM Plex Sans', system-ui, sans-serif";
const R2D = 180 / Math.PI;
const f1 = (n: number) => Math.round(n * 10) / 10;

/* ═══════════════════════ YARDIMCILAR ═══════════════════════ */

/** Kişi rig'ine koruyucu gözlük (başın yerel çerçevesinde). */
function goggles(r: Rig, front = false) {
  const ha = r.flip ? 180 - r.headA : r.headA;
  const kh = r.headR / 12;
  const t = `translate(${r.head[0].toFixed(1)} ${r.head[1].toFixed(1)}) scale(${r.flip ? -1 : 1} 1) rotate(${(ha + 90).toFixed(1)}) scale(${kh.toFixed(3)})`;
  return (
    <g transform={t}>
      {front ? (
        <OG ow={1.1} sh={[{ d: rrect(-13.4, -2.2, 26.8, 3.4, 1), f: STRAP }, { d: rrect(-10, -3.8, 20, 8, 3.2), f: GOG }, { d: 'M-7 -1.6L-4 -2.6', st: '#fff', sw: 1.4 }]} />
      ) : (
        <OG ow={1.1} sh={[{ d: rrect(-12.8, -2.6, 16.4, 3.4, 1), f: STRAP }, { d: rrect(3, -5, 9.2, 8, 2.8), f: GOG }, { d: 'M5.4 -3L8 -3.6', st: '#fff', sw: 1.3 }]} />
      )}
    </g>
  );
}

/** Kişinin ellerine eldiven. */
function gloves(r: Rig, which: Array<'B' | 'F'> = ['B', 'F']) {
  const s = r.s;
  return (
    <g>
      {which.map((k) => {
        const h = k === 'B' ? r.handB : r.handF;
        const w = k === 'B' ? r.wristB : r.wristF;
        const a = Math.atan2(h[1] - w[1], h[0] - w[0]);
        const back: P = [w[0] - Math.cos(a) * 6 * s, w[1] - Math.sin(a) * 6 * s];
        const c = k === 'B' ? shade(GLOVE, 0.12) : GLOVE;
        return (
          <OG
            key={k}
            ow={1.2 * (0.75 + 0.25 * s)}
            sh={[
              { d: capsule(back, 4.3 * s, w, 4.5 * s), f: shade(c, 0.08) },
              { d: ell([0, 0], 7 * s, 5 * s), t: `translate(${h[0].toFixed(1)} ${h[1].toFixed(1)}) rotate(${(a * R2D).toFixed(1)})`, f: c },
            ]}
          />
        );
      })}
    </g>
  );
}

/** Koruyuculu kimya çalışanı: gözlük + eldiven + ekstra katman. */
function Worker(p: PersonProps & { gl?: Array<'B' | 'F'>; extra?: (r: Rig) => JSX.Element | null; hold?: (r: Rig) => JSX.Element | null }) {
  const { gl = ['B', 'F'], extra, hold, ...pp } = p;
  const front = pp.pose?.view === 'front';
  return (
    <Person
      {...pp}
      mid={hold}
      over={(r) => (
        <g>
          {extra ? extra(r) : null}
          {gloves(r, gl)}
          {goggles(r, front && (pp.pose?.headView ?? 'front') === 'front')}
        </g>
      )}
    />
  );
}

/** Yakın plan eldivenli el (mitten). x,y = bilek; a: 0 = parmaklar yukarı. */
function Mitt({ x, y, a = 0, s = 1, sleeve = K.role.bystander3, side = 'R', arm = 120, glove = true, skin = 1 }: { x: number; y: number; a?: number; s?: number; sleeve?: string; side?: 'L' | 'R'; arm?: number; glove?: boolean; skin?: number }) {
  const m = side === 'L' ? -1 : 1;
  const c = glove ? GLOVE : K.skin[skin];
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${m * s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([0, 8], 10, [0, 8 + arm], 11), f: sleeve },
          { d: rrect(-11.5, -5, 23, 15, 4), f: shade(c, 0.1) },
          { d: 'M-10.5 -2L-11 -28Q-11 -42 0 -42Q11 -42 11 -28L10.5 -2Z', f: c },
          { d: capsule([-8, -8], 5, [-17, -24], 4.4), f: c },
          { d: 'M-3.6 -41V-28M3.6 -41V-28', st: shade(c, 0.35), sw: 1.4 },
        ]}
      />
    </g>
  );
}

/** Kalın tel (dış hatlı çizgi). */
function Wire({ d, c = RED_W, w = 3.2 }: { d: string; c?: string; w?: number }) {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={w + 2.6} />
      <path d={d} stroke={c} stroke-width={w} />
    </g>
  );
}

function T({ x, y, t, s = 14, c = K.ink, w = 700, a = 'middle' }: { x: number; y: number; t: string; s?: number; c?: string; w?: number; a?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} fill={c} font-size={s} font-weight={w} text-anchor={a} font-family={F}>{t}</text>;
}

/** Voltmetre (multimetre). x,y = sol üst. */
function Volt({ x, y, text, s = 1 }: { x: number; y: number; text: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(0, 0, 62, 86, 8), f: '#f0b52c' }, { d: rrect(6, 6, 50, 74, 5), f: '#3b4250' }, { d: rrect(11, 12, 40, 24, 3), f: '#cfe8c8' }, { d: circ([31, 56], 11), f: '#596273' }, { d: 'M31 56L38 48', st: '#fff', sw: 2.4 }]} />
      <T x={31} y={30} t={text} s={12} />
    </g>
  );
}

/** Akü. x,y = taban ortası. */
function Aku({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(-26, -15 - 44, 10, 9, 2), f: RED_W },
        { d: rrect(16, -15 - 44, 10, 9, 2), f: '#3b3f4b' },
        { d: rrect(-36, -52, 72, 52, 4), f: '#373b47' },
        { d: rrect(-38, -56, 76, 10, 3), f: '#4a4f5d' },
      ]} />
      <T x={-21} y={-24} t="+" s={20} c="#ff7c73" />
      <T x={21} y={-24} t="−" s={20} c="#cfd3da" />
    </g>
  );
}

/** Tekerlek (bisiklet). */
function Wheel({ c, r }: { c: P; r: number }) {
  const sp = [0, 30, 60, 90, 120, 150];
  return (
    <g>
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={K.out} stroke-width={8.5} />
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke="#3b3f4b" stroke-width={6} />
      <circle cx={c[0]} cy={c[1]} r={r - 4.5} fill="none" stroke="#b8c0c9" stroke-width={1.6} />
      {sp.map((a) => (
        <path key={a} d={`M${c[0] + Math.cos(a / R2D) * (r - 5)} ${c[1] + Math.sin(a / R2D) * (r - 5)}L${c[0] - Math.cos(a / R2D) * (r - 5)} ${c[1] - Math.sin(a / R2D) * (r - 5)}`} stroke="#9aa3ad" stroke-width={1} />
      ))}
      <circle cx={c[0]} cy={c[1]} r={4} fill="#9aa3ad" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Kova. x,y = taban ortası. */
function Kova({ x, y, s = 1, color = PLA, liquid = K.water, fill = 0.75, handle = true }: { x: number; y: number; s?: number; color?: string; liquid?: string | null; fill?: number; handle?: boolean }) {
  const top = -44;
  const ly = top * fill;
  const hw = 18 + (22 - 18) * fill;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {handle && <path d="M-22 -40Q0 -72 22 -40" fill="none" stroke={K.out} stroke-width={2.4 / s} />}
      <OG ow={1.5 / s} sh={[
        { d: 'M-23 -44H23L18.5 -1Q18 0 17 0H-17Q-18 0 -18.5 -1Z', f: color },
        ...(liquid ? [{ d: ell([0, ly], hw, 4), f: liquid, ln: true } as Sh] : []),
        { d: 'M10 -44H23L18.5 -1Q18 0 17 0H8Z', f: shade(color, 0.1), no: true },
        { d: 'M-23 -44H23', st: K.out, sw: 1.6 },
      ]} />
      {liquid && fill > 0.98 && null}
    </g>
  );
}

/** Demir kazan. x,y = taban ortası. */
function Kazan({ x, y, s = 1, liquid = LYE, steam = false }: { x: number; y: number; s?: number; liquid?: string | null; steam?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-34 -40H34Q35 -8 0 -2Q-35 -8 -34 -40Z', f: IRON },
        { d: 'M14 -40H34Q35 -8 0 -2Q20 -12 14 -40Z', f: shade(IRON, 0.18), no: true },
        { d: rrect(-37, -44, 74, 7, 3), f: tint(IRON, 0.15) },
        ...(liquid ? [{ d: ell([0, -42], 31, 3.5), f: liquid } as Sh] : []),
        { d: capsule([-37, -40], 3, [-44, -36], 3), f: IRON },
        { d: capsule([37, -40], 3, [44, -36], 3), f: IRON },
      ]} />
      {steam && (
        <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.85}>
          <path d="M-14 -50c-5-6 5-10 0-17" />
          <path d="M2 -52c-5-6 5-10 0-17" />
          <path d="M17 -50c-5-6 5-10 0-17" />
        </g>
      )}
    </g>
  );
}

/** Ateş: taşlar, odunlar, alev. */
function Fire({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <Campfire x={x} y={y} s={s} />;
}

/** Buhar kıvrımları. */
function Steam({ x, y, n = 3, s = 1, gap = 14 }: { x: number; y: number; n?: number; s?: number; gap?: number }) {
  return (
    <g fill="none" stroke="#fff" stroke-width={3 * s} stroke-linecap="round" opacity={0.9}>
      {Array.from({ length: n }, (_, i) => {
        const xx = x + (i - (n - 1) / 2) * gap;
        return <path key={i} d={`M${xx} ${y}c${-5 * s} ${-6 * s} ${5 * s} ${-10 * s} 0 ${-17 * s}`} />;
      })}
    </g>
  );
}

/** Kabarcıklar. */
function Bubbles({ pts, r = 2.4, c = '#fff' }: { pts: P[]; r?: number; c?: string }) {
  return <g fill={c} stroke={K.out} stroke-width={1}>{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={r * (0.7 + ((i * 37) % 10) / 20)} />)}</g>;
}

/** Numara rozeti (panelli sahneler için). */
function Num({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={K.ink} stroke="#fff" stroke-width={2} />
      <T x={x} y={y + 5} t={String(n)} s={14} c="#fff" />
    </g>
  );
}

/** Panel çerçevesi (iki/üç kareli sahneler). */
function Panel({ x, y, w, h, c = '#f6f3ec' }: { x: number; y: number; w: number; h: number; c?: string }) {
  return <path d={rrect(x, y, w, h, 10)} fill={c} stroke={K.out} stroke-width={1.6} />;
}

/** 18650 hücre (yatık). x,y = sol uç ortası. */
function Cell({ x, y, l = 46, r = 9, c = '#3f8fd0', bulge = 0, rust = false, dent = false }: { x: number; y: number; l?: number; r?: number; c?: string; bulge?: number; rust?: boolean; dent?: boolean }) {
  const body = bulge
    ? `M${x + 3} ${y - r}Q${x + l / 2} ${y - r - bulge} ${x + l - 3} ${y - r}L${x + l - 3} ${y + r}Q${x + l / 2} ${y + r + bulge} ${x + 3} ${y + r}Z`
    : rrect(x + 3, y - r, l - 6, 2 * r, 3);
  return (
    <g>
      <OG sh={[
        { d: rrect(x, y - r + 1.5, 6, 2 * r - 3, 2), f: '#c4ccd4' },
        { d: rrect(x + l - 6, y - r + 1.5, 6, 2 * r - 3, 2), f: '#c4ccd4' },
        { d: body, f: c },
        { d: `M${x + 6} ${y - r * 0.45}H${x + l - 8}`, st: tint(c, 0.45), sw: 2 },
        ...(dent ? [{ d: `M${x + l * 0.4} ${y - r}Q${x + l * 0.5} ${y - r * 0.2} ${x + l * 0.62} ${y - r}Z`, f: shade(c, 0.3) } as Sh] : []),
      ]} />
      {rust && (
        <g fill="#9a5a2a" opacity={0.95}>
          <circle cx={x + l * 0.3} cy={y + 2} r={3.2} />
          <circle cx={x + l * 0.55} cy={y - 3} r={2.4} />
          <circle cx={x + l * 0.7} cy={y + 4} r={2.8} />
        </g>
      )}
    </g>
  );
}

/** Masa üstü (yakın plan zemin). */
function Desk({ y = 180, c = K.wood }: { y?: number; c?: string }) {
  return (
    <g>
      <rect x={0} y={y} width={320} height={240 - y} fill={c} />
      <rect x={0} y={y} width={320} height={4} fill={shade(c, 0.15)} />
    </g>
  );
}

/** Sıcak hava/ısı dalgaları (kırmızı). */
function Heat({ x, y, n = 3, gap = 12, h = 22, c = K.danger }: { x: number; y: number; n?: number; gap?: number; h?: number; c?: string }) {
  return (
    <g fill="none" stroke={c} stroke-width={2.6} stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const xx = x + (i - (n - 1) / 2) * gap;
        return <path key={i} d={`M${xx} ${y}q-4 ${-h / 4} 0 ${-h / 2}t0 ${-h / 2}`} />;
      })}
    </g>
  );
}


/** Masada suya katı ekleme (kostik/alçı): doğru yol + sağ üstte yanlış yolun yasak kutusu. */
function TablePour({ tool }: { tool: 'spoon' | 'scoop' }) {
  const hand: P = [146, 100];
  const tip: P = [168, 104];
  const w: PersonProps = { ...KIM, x: 88, y: 226, s: 1.15, pose: { ...POSE.standSide, spine: -86, head: -100, armF: { to: hand }, armB: { to: [120, 128] }, face: 'neutral' } };
  return (
    <Scene2 bg="indoor">
      <Table x={116} y={226} w={190} h={70} />
      <Kova x={176} y={156} s={1} color="#4f8fd6" fill={0.62} handle={false} />
      <Worker
        {...w}
        hold={(r) => (
          <g>
            <OG sh={[{ d: rrect(r.handB[0] - 9, r.handB[1] - 14, 18, 22, 3), f: '#fbfaf7' }, { d: rrect(r.handB[0] - 10, r.handB[1] - 18, 20, 6, 2), f: '#596273' }]} />
          </g>
        )}
        extra={(r) =>
          tool === 'spoon' ? (
            <OG sh={[{ d: capsule(r.handF, 2, tip, 2), f: '#9aa3ad' }, { d: ell([tip[0] + 4, tip[1] + 1], 7, 3.6), f: '#c4ccd4' }, { d: ell([tip[0] + 4, tip[1] - 1], 5, 2), f: LIME }]} />
          ) : (
            <OG sh={[{ d: capsule(r.handF, 2.4, [tip[0] - 2, tip[1] - 2], 2.4), f: K.wood }, { d: `M${tip[0] - 6} ${tip[1] - 8}L${tip[0] + 10} ${tip[1] - 4}L${tip[0] + 8} ${tip[1] + 8}L${tip[0] - 6} ${tip[1] + 6}Z`, f: '#c4ccd4' }]} />
          )
        }
      />
      {tool === 'spoon' ? (
        <g fill={LIME} stroke={K.out} stroke-width={0.9}>
          {[[172, 113], [170, 120], [175, 125], [171, 131]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={2.3} />)}
        </g>
      ) : (
        <path d="M176 110Q178 120 176 132" stroke={LIME} stroke-width={7} stroke-linecap="round" fill="none" />
      )}
      <Arrow from={[204, 82]} to={[186, 118]} bend={0.3} w={5} />
      <Ok x={150} y={176} r={13} />
      {/* yanlış yol */}
      <Panel x={216} y={12} w={94} h={100} c="#fbf7ef" />
      <OG sh={[{ d: 'M236 96Q263 112 290 96L286 86H240Z', f: '#fbfaf7' }, { d: ell([263, 86], 18, 6), f: LIME }]} />
      <path d="M250 44Q262 56 262 82" stroke={K.water} stroke-width={5} fill="none" stroke-linecap="round" />
      <g transform="rotate(38 236 40)">
        <OG sh={[{ d: 'M222 26H248L252 60Q236 64 220 60Z', f: '#9fd0e8' }, { d: 'M248 26L258 20L250 34Z', f: '#9fd0e8' }, { d: 'M221 34Q208 42 221 52', st: K.out, sw: 3.4 }, { d: 'M223 40H250V58Q236 62 222 58Z', f: K.water, no: true }]} />
      </g>
      <No x={263} y={62} r={34} />
    </Scene2>
  );
}

/** Küçük gazojen kazanı. x,y = taban ortası. */
function Gazojen({ x, y, s = 1, smoke = false }: { x: number; y: number; s?: number; smoke?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: capsule([-16, -12], 3, [-20, 0], 3), f: IRON },
        { d: capsule([16, -12], 3, [20, 0], 3), f: IRON },
        { d: rrect(-22, -86, 44, 76, 6), f: '#6b7280' },
        { d: rrect(-26, -92, 52, 9, 3), f: IRON },
        { d: 'M22 -24H44V-64H52', st: K.out, sw: 7 },
        { d: 'M22 -24H44V-64H52', st: '#8e99a6', sw: 4 },
        { d: rrect(-12, -40, 24, 14, 3), f: '#2a2c33' },
      ]} />
      <rect x={-8} y={-37} width={16} height={8} rx={2} fill={K.fire} />
      {smoke && <Smoke x={30} y={-110} w={60} h={34} kind="cloud" op={0.85} />}
    </g>
  );
}

/** Kesik çizgi (ince). */
function Dash({ d, c = K.out, w = 2 }: { d: string; c?: string; w?: number }) {
  return <path d={d} stroke={c} stroke-width={w} stroke-dasharray="6 5" fill="none" stroke-linecap="round" />;
}


/** Elma dilimleri (sirke meyvesi). */
function Apples({ pts, s = 1 }: { pts: P[]; s?: number }) {
  return (
    <OG sh={pts.map((p, i) => ({ d: `M${p[0] - 9 * s} ${p[1]}A${9 * s} ${9 * s} 0 0 0 ${p[0] + 9 * s} ${p[1]}Z`, t: `rotate(${(i * 67) % 360} ${p[0]} ${p[1]})`, f: i % 2 ? '#f3e6a8' : '#efe0a0' } as Sh)).concat(
      pts.map((p, i) => ({ d: `M${p[0] - 9 * s} ${p[1]}A${9 * s} ${9 * s} 0 0 0 ${p[0] + 9 * s} ${p[1]}`, t: `rotate(${(i * 67) % 360} ${p[0]} ${p[1]})`, st: i % 3 ? '#d23c2c' : '#7fb24a', sw: 3 } as Sh)),
    )} />
  );
}

/* ═══════════════════════ SAHNELER ═══════════════════════ */

export const SCENES: Record<string, () => JSX.Element> = {
  /* ─────────────── PEDAL JENERATÖRÜ ─────────────── */
  'sf-ek-pedal-motor-test': () => {
    const tip: P = [226, 128];
    const h = { x: 286, y: 196, a: -62, s: 1.15, pose: 'pinch' as const, side: 'R' as const };
    const pp = handPoint(h, 'pinch');
    const hx = h.x + (tip[0] - pp[0]);
    const hy = h.y + (tip[1] - pp[1]);
    return (
      <Scene2 bg="closeup">
        <Desk y={176} />
        {/* motor */}
        <OG sh={[
          { d: rrect(196, 124, 34, 9, 3), f: '#c4ccd4' },
          { d: rrect(106, 98, 92, 62, 10), f: '#59626f' },
          { d: rrect(106, 98, 92, 14, 6), f: '#6f7987', no: true },
          { d: rrect(100, 104, 12, 50, 4), f: '#3b4250' },
          { d: rrect(192, 104, 12, 50, 4), f: '#3b4250' },
          { d: rrect(120, 160, 64, 16, 3), f: '#3b4250' },
          { d: circ([122, 104], 4), f: RED_W },
          { d: circ([140, 104], 4), f: '#2b2d3a' },
        ]} />
        <Volt x={18} y={70} text="12 V" />
        <Wire d="M122 102C118 70 96 58 70 72" c={RED_W} />
        <Wire d="M140 102C140 60 100 40 52 70" c={BLK_W} />
        <Hand x={hx} y={hy} a={h.a} s={h.s} pose="pinch" side="R" arm={90} sleeve={K.role.bystander2} skin={2} />
        <Arrow from={[214, 96]} to={[214, 164]} bend={-0.75} w={5} />
      </Scene2>
    );
  },

  'sf-ek-pedal-kurulum': () => {
    const rh: P = [96, 168]; // arka göbek
    const fh: P = [232, 188]; // ön göbek
    const bb: P = [158, 190];
    const seat: P = [140, 126];
    const bar: P = [214, 116];
    const pF: P = [174, 196];
    const pB: P = [142, 184];
    const rider: PersonProps = {
      ...EL, x: seat[0] - 2, y: seat[1] - 2, ay: 'hip', s: 1.08,
      pose: { spine: -62, chest: -55, head: -75, armB: { to: bar }, armF: { to: [bar[0] + 2, bar[1] + 2] }, legB: { to: pB }, legF: { to: pF }, footB: 0, footF: 0, face: 'neutral' },
      shadow: false,
    };
    const frame = (
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d={`M${rh[0]} ${rh[1]}L${bb[0]} ${bb[1]}L${seat[0] + 2} ${seat[1] + 8}L${rh[0]} ${rh[1]}M${seat[0] + 2} ${seat[1] + 8}L${bar[0] - 6} ${bar[1] + 18}L${bb[0]} ${bb[1]}M${bar[0] - 6} ${bar[1] + 18}L${fh[0]} ${fh[1]}M${bar[0] - 6} ${bar[1] + 18}L${bar[0]} ${bar[1]}`} stroke={K.out} stroke-width={7.5} />
        <path d={`M${rh[0]} ${rh[1]}L${bb[0]} ${bb[1]}L${seat[0] + 2} ${seat[1] + 8}L${rh[0]} ${rh[1]}M${seat[0] + 2} ${seat[1] + 8}L${bar[0] - 6} ${bar[1] + 18}L${bb[0]} ${bb[1]}M${bar[0] - 6} ${bar[1] + 18}L${fh[0]} ${fh[1]}M${bar[0] - 6} ${bar[1] + 18}L${bar[0]} ${bar[1]}`} stroke="#2f8f87" stroke-width={4.5} />
      </g>
    );
    return (
      <Scene2 bg="indoor">
        {/* sehpa */}
        <OG sh={[{ d: capsule([rh[0], rh[1]], 3, [70, 222], 3), f: '#7d8691' }, { d: capsule([rh[0], rh[1]], 3, [122, 222], 3), f: '#7d8691' }, { d: rrect(62, 220, 68, 6, 2), f: '#5d6570' }]} />
        <Wheel c={rh} r={36} />
        <Wheel c={fh} r={36} />
        {frame}
        <OG sh={[{ d: rrect(seat[0] - 12, seat[1] + 2, 26, 6, 3), f: '#2b2d3a' }, { d: capsule([bar[0], bar[1]], 2.4, [bar[0] + 8, bar[1] - 2], 2.4), f: '#2b2d3a' }, { d: circ(bb, 7), f: '#9aa3ad' }, { d: capsule(pB, 2.5, pF, 2.5), f: '#5d6570' }]} />
        {/* motor arka lastiğe bastırılmış */}
        <OG sh={[{ d: capsule([36, 128], 3, [36, 222], 3), f: '#7d8691' }, { d: rrect(28, 218, 18, 6, 2), f: '#5d6570' }, { d: circ([46, 142], 17), f: '#59626f' }, { d: circ([46, 142], 6), f: '#c4ccd4' }, { d: circ([61, 150], 4.5), f: '#c4ccd4' }]} />
        <Wire d="M36 152C24 170 22 196 14 236" c={RED_W} />
        <Wire d="M42 158C34 180 30 204 26 236" c={BLK_W} />
        <Person {...rider} />
        <Arrow from={[150, 224]} to={[188, 210]} bend={0.4} w={5} />
        <Arrow from={[84, 128]} to={[60, 150]} bend={0.35} w={4.5} />
      </Scene2>
    );
  },

  'sf-ek-pedal-diyot': () => {
    const y1 = 90, y2 = 178;
    return (
      <Scene2 bg="closeup">
        <Wire d={`M58 ${y1 + 20}V${y1}H262V${y1 + 34}`} c={RED_W} />
        <Wire d={`M58 ${y2 - 20}V${y2}H262V${y2 - 40}`} c={BLK_W} />
        {/* motor */}
        <OG sh={[{ d: circ([58, 134], 26), f: '#59626f' }]} />
        <T x={58} y={142} t="M" s={22} c="#fff" />
        {/* diyot */}
        <OG sh={[{ d: rrect(104, y1 - 16, 52, 32, 6), f: '#fff' }, { d: `M116 ${y1 - 12}L140 ${y1}L116 ${y1 + 12}Z`, f: K.ink }, { d: `M141 ${y1 - 13}V${y1 + 13}`, st: K.ink, sw: 4 }]} />
        {/* sigorta */}
        <OG sh={[{ d: rrect(178, y1 - 10, 40, 20, 6), f: '#f0b52c' }, { d: `M184 ${y1}H212`, st: K.ink, sw: 2 }]} />
        <Aku x={262} y={190} s={0.9} />
        <Arrow from={[96, 62]} to={[156, 62]} w={6} />
        <Arrow from={[156, 124]} to={[104, 124]} w={5} color={K.danger} />
        <Bad x={130} y={146} r={12} />
      </Scene2>
    );
  },

  /* ─────────────── ALTERNATÖR ─────────────── */
  'sf-ek-alt-matkap-test': () => {
    const chuck: P = [148, 128];
    const grip: P = [212, 150];
    const usta: PersonProps = { ...EL, x: 250, y: 228, flip: true, s: 1.12, pose: { ...POSE.standSide, spine: -84, head: -96, armF: { to: grip }, armB: { to: [190, 132] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Table x={14} y={226} w={200} h={70} />
        {/* motor mengenede */}
        <OG sh={[{ d: rrect(36, 140, 18, 16, 2), f: '#5d6570' }, { d: rrect(54, 104, 72, 52, 9), f: '#59626f' }, { d: rrect(124, 124, 26, 8, 2), f: '#c4ccd4' }, { d: circ([70, 104], 4), f: RED_W }, { d: circ([88, 104], 4), f: BLK_W }]} />
        <Volt x={26} y={64} text="14 V" s={0.62} />
        <Wire d="M70 100C68 90 60 98 48 112" c={RED_W} w={2.4} />
        <Wire d="M88 100C88 84 66 82 56 112" c={BLK_W} w={2.4} />
        <Person {...usta} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        {/* matkap */}
        <OG sh={[
          { d: rrect(chuck[0], chuck[1] - 7, 18, 14, 3), f: '#3b4250' },
          { d: rrect(chuck[0] + 16, chuck[1] - 14, 66, 28, 9), f: '#2f8f87' },
          { d: `M${grip[0] - 12} ${chuck[1] + 10}L${grip[0] - 16} ${chuck[1] + 50}H${grip[0] + 4}L${grip[0] + 8} ${chuck[1] + 10}Z`, f: '#2f8f87' },
          { d: rrect(grip[0] - 22, chuck[1] + 46, 32, 14, 4), f: '#3b4250' },
        ]} />
        <Person {...usta} only={['armF']} />
        <Arrow from={[134, 98]} to={[136, 158]} bend={0.6} w={4.5} />
      </Scene2>
    );
  },

  'sf-ek-alt-kasnak': () => {
    const big: P = [92, 126];
    const small: P = [246, 156];
    const R = 34, r = 9;
    const blades = Array.from({ length: 12 }, (_, i) => i * 30);
    return (
      <Scene2 bg="outdoor">
        {/* su çarkı */}
        <g>
          {blades.map((a) => (
            <path key={a} d={`M${big[0] + Math.cos(a / R2D) * 26} ${big[1] + Math.sin(a / R2D) * 26}L${big[0] + Math.cos(a / R2D) * 70} ${big[1] + Math.sin(a / R2D) * 70}`} stroke={K.out} stroke-width={6} />
          ))}
          {blades.map((a) => (
            <path key={'i' + a} d={`M${big[0] + Math.cos(a / R2D) * 26} ${big[1] + Math.sin(a / R2D) * 26}L${big[0] + Math.cos(a / R2D) * 70} ${big[1] + Math.sin(a / R2D) * 70}`} stroke={K.wood} stroke-width={3.4} />
          ))}
          <circle cx={big[0]} cy={big[1]} r={66} fill="none" stroke={K.out} stroke-width={7} />
          <circle cx={big[0]} cy={big[1]} r={66} fill="none" stroke={shade(K.wood, 0.1)} stroke-width={4} />
        </g>
        {/* kayış (açık) */}
        <path d={`M${big[0]} ${big[1] - R}L${small[0]} ${small[1] - r}M${big[0]} ${big[1] + R}L${small[0]} ${small[1] + r}`} stroke={K.out} stroke-width={6} />
        <path d={`M${big[0]} ${big[1] - R}L${small[0]} ${small[1] - r}M${big[0]} ${big[1] + R}L${small[0]} ${small[1] + r}`} stroke="#3b3f4b" stroke-width={3.6} />
        <OG sh={[{ d: circ(big, R), f: '#8e99a6' }, { d: circ(big, R - 8), f: tint('#8e99a6', 0.25) }, { d: circ(big, 6), f: '#3b4250' }]} />
        {/* jeneratör */}
        <OG sh={[{ d: rrect(254, 170, 50, 32, 3), f: K.wood }, { d: rrect(250, 134, 56, 40, 9), f: '#59626f' }, { d: circ(small, r), f: '#8e99a6' }, { d: circ(small, 3), f: '#3b4250' }]} />
        <OG sh={[{ d: 'M-4 30H70V44H-4Z', f: K.wood }, { d: 'M-4 30H70V36H-4Z', f: K.water, no: true }]} />
        <path d="M70 36Q86 38 90 62" fill="none" stroke={K.out} stroke-width={10} stroke-linecap="round" />
        <path d="M70 36Q86 38 90 62" fill="none" stroke={K.water} stroke-width={7} stroke-linecap="round" />
        <Arrow from={[176, 70]} to={[176, 170]} bend={-0.5} w={5} />
        <Arrow from={[268, 116]} to={[232, 132]} bend={0.5} w={4} />
        <Label x={246} y={92} text="hızlı" size={13} />
        <Label x={92} y={208} text="yavaş" size={13} />
      </Scene2>
    );
  },

  'sf-ek-alt-kopru-diyot': () => (
    <Scene2 bg="closeup">
      <Wire d="M76 104H140" c="#8a5a3a" />
      <Wire d="M80 124H140" c={BLK_W} />
      <Wire d="M76 144H140" c="#8e99a6" />
      <OG sh={[{ d: circ([52, 124], 32), f: '#59626f' }, { d: circ([52, 124], 10), f: '#3b4250' }]} />
      {/* soğutucu + köprü */}
      <OG sh={[
        ...[0, 1, 2, 3, 4, 5].map((i) => ({ d: rrect(132 + i * 12, 168, 7, 30, 1.5), f: '#b8c0c9' } as Sh)),
        { d: rrect(126, 160, 76, 14, 2), f: '#b8c0c9' },
        { d: rrect(140, 86, 48, 76, 5), f: '#2f3540' },
      ]} />
      <T x={164} y={130} t="~ / =" s={13} c="#fff" />
      <Wire d="M188 108H262" c={RED_W} />
      <Wire d="M188 140H262" c={BLK_W} />
      <T x={278} y={114} t="+" s={26} c={K.danger} />
      <T x={278} y={148} t="−" s={26} />
      <Label x={52} y={190} text="3 tel" size={13} />
    </Scene2>
  ),

  /* ─────────────── PİL PAKETİ ─────────────── */
  'sf-ek-pil-hazir': () => (
    <Scene2 bg="closeup">
      <Desk y={170} />
      {/* powerbank → telefon */}
      <Wire d="M84 150C100 150 104 124 118 122" c="#fbfaf7" w={2.6} />
      <OG sh={[{ d: rrect(22, 120, 62, 54, 8), f: '#3b4250' }, { d: rrect(30, 128, 12, 6, 2), f: K.safe }, { d: rrect(46, 128, 12, 6, 2), f: K.safe }, { d: rrect(62, 128, 12, 6, 2), f: K.safe }]} />
      <Phone x={132} y={118} s={1} call={false} />
      {/* akülü matkap (akü takılı) */}
      <OG sh={[
        { d: rrect(186, 96, 16, 16, 3), f: '#3b4250' },
        { d: rrect(200, 88, 84, 32, 10), f: '#2f8f87' },
        { d: 'M238 118L232 150H256L262 118Z', f: '#2f8f87' },
        { d: rrect(222, 148, 50, 24, 5), f: '#3b4250' },
        { d: rrect(230, 154, 16, 6, 2), f: K.safe },
      ]} />
      <Ok x={160} y={50} r={22} />
    </Scene2>
  ),

  'sf-ek-pil-ayikla': () => (
    <Scene2 bg="closeup">
      <Desk y={186} />
      {/* metal kutu */}
      <OG sh={[{ d: 'M14 196V112H150V196Z', f: '#8e99a6' }, { d: 'M20 190V118H144V190Z', f: '#6f7987' }]} />
      <Cell x={32} y={140} c="#3f8fd0" bulge={7} />
      <Cell x={88} y={136} c="#d0763f" dent />
      <Cell x={32} y={172} c="#5aa05a" rust />
      <Cell x={88} y={170} c="#8f6fc2" bulge={5} />
      <Bad x={136} y={104} r={15} />
      {/* ölçüm */}
      <Cell x={184} y={172} c="#3f8fd0" l={56} />
      <Volt x={222} y={50} text="1,6 V" s={0.95} />
      <Wire d="M240 132C236 150 196 150 186 172" c={RED_W} w={2.4} />
      <Wire d="M262 132C268 150 246 160 238 172" c={BLK_W} w={2.4} />
      <Bad x={292} y={50} r={14} />
    </Scene2>
  ),

  'sf-ek-pil-sarj-kutu': () => (
    <Scene2 bg="indoor">
      <Door x={14} y={200} w={54} h={128} open />
      {/* taş zemin ve metal kutu */}
      <OG sh={[{ d: rrect(70, 194, 104, 14, 3), f: STONE }, { d: 'M80 196V132H164V196Z', f: '#8e99a6' }, { d: 'M86 196V138H158V196Z', f: '#59626f' }]} />
      <OG sh={[{ d: rrect(96, 164, 52, 30, 4), f: '#3f8fd0' }, { d: rrect(102, 170, 16, 8, 2), f: K.safe }]} />
      <Wire d="M146 172C170 160 172 120 176 96" c={BLK_W} w={2.4} />
      <OG sh={[{ d: rrect(168, 80, 20, 18, 3), f: '#fbfaf7' }]} />
      <Ok x={122} y={114} r={14} />
      {/* yatak üstünde şarj */}
      <Bed x={204} y={214} w={110} />
      <OG sh={[{ d: rrect(242, 160, 34, 18, 3), f: '#3f8fd0' }]} />
      <Wire d="M276 168C292 150 300 120 304 96" c={BLK_W} w={2.2} />
      <No x={260} y={160} r={34} />
    </Scene2>
  ),

  /* ─────────────── TERMOELEKTRİK ─────────────── */
  'sf-ek-teg-plaka': () => (
    <Scene2 bg="closeup">
      {/* soba gövdesi + içteki ateş */}
      <OG sh={[{ d: rrect(-10, 40, 100, 170, 6), f: IRON }, { d: rrect(10, 120, 60, 70, 6), f: '#2a2c33' }]} />
      <Flame x={40} y={186} s={1} />
      <Flame x={58} y={188} s={0.6} />
      {/* alüminyum plaka */}
      <OG sh={[{ d: rrect(90, 66, 22, 118, 3), f: ALU }]} />
      {/* modül */}
      <OG sh={[{ d: rrect(112, 92, 10, 66, 1.5), f: '#f3f3ef' }]} />
      {/* soğutucu */}
      <OG sh={[
        { d: rrect(122, 70, 20, 110, 3), f: '#b8c0c9' },
        ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ d: rrect(142, 74 + i * 15, 64, 7, 2), f: '#b8c0c9' } as Sh)),
      ]} />
      {/* cıvatalar */}
      <OG sh={[{ d: capsule([80, 78], 3, [216, 78], 3), f: '#8e99a6' }, { d: capsule([80, 172], 3, [216, 172], 3), f: '#8e99a6' }, { d: rrect(212, 70, 9, 16, 2), f: '#6f7987' }, { d: rrect(212, 164, 9, 16, 2), f: '#6f7987' }]} />
      <Wire d="M117 158C117 200 150 214 180 214" c={RED_W} w={2.2} />
      <Wire d="M117 152C112 196 140 226 170 226" c={BLK_W} w={2.2} />
      <Heat x={100} y={60} n={2} gap={12} h={24} />
      <g fill="none" stroke={K.water} stroke-width={2.6} stroke-linecap="round">
        <path d="M232 92q8 -4 16 0t16 0M232 124q8 -4 16 0t16 0M232 156q8 -4 16 0t16 0" />
      </g>
    </Scene2>
  ),

  'sf-ek-teg-baglanti': () => {
    const mods = [36, 84, 132];
    return (
      <Scene2 bg="closeup">
        <Wire d="M44 120H76M92 120H124" c={RED_W} />
        <Wire d="M140 120H180" c={RED_W} />
        <Wire d="M140 140C150 150 170 150 180 140" c={BLK_W} />
        <Wire d="M44 140C34 170 150 176 182 150" c={BLK_W} />
        <OG sh={mods.map((x) => ({ d: rrect(x - 18, 106, 36, 36, 3), f: '#f3f3ef' } as Sh))} />
        <g stroke="#c2c2bc" stroke-width={1.2}>
          {mods.map((x) => <path key={x} d={`M${x - 12} 118H${x + 12}M${x - 12} 124H${x + 12}M${x - 12} 130H${x + 12}`} />)}
        </g>
        {/* DC-DC kartı */}
        <OG sh={[{ d: rrect(178, 108, 46, 40, 4), f: '#2e8a4a' }, { d: rrect(190, 116, 14, 14, 2), f: '#2b2d3a' }, { d: circ([212, 136], 5), f: '#c4ccd4' }]} />
        <Wire d="M224 128C240 128 244 128 248 128" c="#fbfaf7" />
        <Phone x={272} y={128} s={1.1} call={false} />
        <Label x={160} y={64} text="5 V" size={15} />
        <Heat x={84} y={96} n={3} gap={46} h={20} />
      </Scene2>
    );
  },

  'sf-ek-teg-kablo': () => {
    const stove = (x: number) => (
      <OG sh={[
        { d: rrect(x + 22, 40, 14, 74, 2), f: '#3b4250' },
        { d: rrect(x, 110, 58, 74, 6), f: IRON },
        { d: rrect(x + 10, 130, 38, 30, 4), f: '#2a2c33' },
        { d: capsule([x + 6, 184], 3, [x + 4, 200], 3), f: IRON },
        { d: capsule([x + 52, 184], 3, [x + 54, 200], 3), f: IRON },
      ]} />
    );
    return (
      <Scene2 bg="indoor">
        <rect x={159} y={0} width={2} height={240} fill={K.out} opacity={0.5} />
        {stove(22)}
        <Flame x={51} y={158} s={0.5} />
        <OG sh={[{ d: rrect(80, 130, 8, 22, 1), f: '#f3f3ef' }]} />
        <Wire d="M88 140H112V40H150" c={BLK_W} w={2.6} />
        <g fill="#fbfaf7" stroke={K.out} stroke-width={1.2}>
          <rect x={108} y={80} width={8} height={5} />
          <rect x={108} y={110} width={8} height={5} />
          <rect x={128} y={37} width={5} height={8} />
        </g>
        <Ok x={130} y={186} r={14} />
        {stove(196)}
        <Flame x={225} y={158} s={0.5} />
        <Wire d="M218 52Q230 46 240 52M218 64Q230 58 240 64M218 76Q230 70 240 76M240 76C270 90 290 100 300 120" c={BLK_W} w={2.6} />
        <No x={229} y={64} r={26} />
      </Scene2>
    );
  },
  /* ─────────────── KİMYASAL GÜVENLİK ─────────────── */
  'sf-ek-kg-koruyucu': () => (
    <Scene2 bg="outdoor">
      <Worker {...KIM} x={122} y={228} s={1.22} pose={{ ...POSE.stand, face: 'neutral' }} />
      <Kova x={214} y={222} s={1.05} color="#9aa3ad" fill={0.8} />
      {/* musluklu 20 L bidon */}
      <OG sh={[
        { d: rrect(248, 136, 56, 82, 9), f: '#4f8fd6' },
        { d: rrect(262, 124, 28, 16, 4), f: '#3a72b8' },
        { d: rrect(270, 116, 12, 10, 2), f: '#2b2d3a' },
        { d: rrect(244, 194, 14, 10, 2), f: '#2b2d3a' },
        { d: 'M256 150V204', st: tint('#4f8fd6', 0.35), sw: 3 },
      ]} />
      <Label x={276} y={176} text="20 L" size={12} bg="#fff" />
    </Scene2>
  ),

  'sf-ek-kg-suya-ekle': () => <TablePour tool="spoon" />,

  'sf-ek-kg-goz-yikama': () => {
    const v: PersonProps = { ...KAZA, x: 138, y: 124, ax: 'head', ay: 'head', s: 2.6, pose: { ...POSE.stand, head: -64, face: 'worried' } };
    const r = rig(v);
    const kh = r.headR / 12;
    const a = (r.headA + 90) / R2D;
    const loc = (px: number, py: number): P => [r.head[0] + (px * Math.cos(a) - py * Math.sin(a)) * kh, r.head[1] + (px * Math.sin(a) + py * Math.cos(a)) * kh];
    const bridge = loc(-0.6, -0.8);
    const eye = loc(4.4, 0.2);
    const off = loc(15, 1.5);
    const jm: P = [bridge[0] - 18, bridge[1] - 40];
    const flow = `M${jm[0]} ${jm[1]}Q${bridge[0] - 8} ${bridge[1] - 18} ${bridge[0]} ${bridge[1]}Q${eye[0]} ${eye[1] - 1} ${off[0]} ${off[1]}Q${off[0] + 6} ${off[1] + 10} ${off[0] + 4} ${off[1] + 40}`;
    return (
      <Scene2 bg="closeup">
        <Person {...v} only={['torso', 'head', 'armB']} />
        <path d={flow} fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" opacity={0.3} />
        <path d={flow} fill="none" stroke={K.water} stroke-width={4.8} stroke-linecap="round" opacity={0.9} />
        <Drop x={off[0] + 4} y={off[1] + 58} s={1} />
        {/* yardımcının eldivenli elinde sürahi: su burun kökünden gözün üstünden dışa akar */}
        <g transform={`translate(${f1(jm[0])} ${f1(jm[1])}) rotate(28)`}>
          <path d="M-60 -10Q-76 -8 -74 6Q-72 18 -58 14" fill="none" stroke={K.out} stroke-width={8} />
          <path d="M-60 -10Q-76 -8 -74 6Q-72 18 -58 14" fill="none" stroke="#9fc3e3" stroke-width={4.5} />
          <OG sh={[{ d: 'M-60 -22H-12L2 -12L-12 -6V16Q-12 26 -22 26H-50Q-60 26 -60 16Z', f: '#9fc3e3' }, { d: 'M-58 -14H-14V-6H-58Z', f: K.water, no: true }]} />
        </g>
        <Mitt x={jm[0] - 64} y={jm[1] - 54} a={140} s={0.62} sleeve={K.role.bystander3} arm={120} />
        <Timer x={34} y={200} r={16} text="30 dk" />
      </Scene2>
    );
  },

  /* ─────────────── KİREÇ ─────────────── */
  'sf-ek-kirec-sirke': () => {
    const hand: P = [206, 112];
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <OG sh={[
          { d: smooth([[180, 214], [176, 176], [196, 150], [238, 142], [276, 156], [292, 190], [288, 216]], true, 0.8), f: '#c9c5ba' },
          { d: smooth([[196, 168], [214, 152], [246, 150], [258, 168], [236, 180], [208, 182]], true, 0.8), f: '#ecebe4' },
        ]} />
        <Worker {...KIM} x={96} y={228} s={1.32} pose={{ ...POSE.kneelOne, spine: -74, chest: -64, head: -45, armF: { to: hand }, armB: { at: 'kneeF', d: [-2, -6] }, face: 'neutral' }}
          extra={(r) => (
            <OG sh={[{ d: rrect(r.handF[0] - 4, r.handF[1] - 4, 8, 22, 2), f: '#e9f3f7' }, { d: ell([r.handF[0], r.handF[1] - 8], 6, 7), f: '#b54a3c' }, { d: rrect(r.handF[0] - 1.6, r.handF[1] + 16, 3.2, 10, 1), f: '#e9f3f7' }]} />
          )} />
        <Drop x={hand[0]} y={146} s={0.8} color="#d8b75a" />
        <Bubbles pts={[[214, 160], [222, 156], [230, 162], [218, 166], [240, 158], [226, 152], [234, 168]]} r={3} />
        <Waves x={226} y={136} a={-90} n={2} r={6} color="#fff" />
      </Scene2>
    );
  },

  'sf-ek-kirec-ocak': () => {
    const L = 76, Rr = 176;
    const chunks: P[] = [];
    for (let row = 0; row < 4; row++) for (let i = 0; i < 4; i++) chunks.push([L + 16 + i * 24 + (row % 2) * 10, 92 + row * 24]);
    return (
      <Scene2 bg="outdoor" gy={70}>
        <path d="M0 70H170L262 208H320V240H0Z" fill={SOIL} stroke={K.out} stroke-width={1.5} />
        <path d="M0 70H170L262 208H320" fill="none" stroke={K.grass} stroke-width={5} />
        {/* taş örgü kuyu */}
        <path d={`M${L - 12} 70V214H${Rr + 12}V70`} fill={STONE} stroke={K.out} stroke-width={1.5} />
        <rect x={L} y={70} width={Rr - L} height={136} fill="#4a3a33" stroke={K.out} stroke-width={1.5} />
        {/* ateş ağzı */}
        <path d={`M${Rr} 180H250L258 206H${Rr}Z`} fill="#3a2d27" stroke={K.out} stroke-width={1.5} />
        {/* katmanlar: taş + yakıt */}
        {[104, 128, 152].map((yy) => <rect key={yy} x={L + 2} y={yy - 4} width={Rr - L - 4} height={7} fill={CHAR} />)}
        <OG sh={chunks.map((c, i) => ({ d: ell(c, 10 + (i % 3), 8), f: i % 2 ? '#e3e0d6' : '#d2cec2' } as Sh))} />
        <OG sh={[{ d: capsule([L + 8, 196], 5, [Rr - 6, 192], 5), f: K.trunk }, { d: capsule([L + 14, 186], 5, [Rr - 12, 190], 5), f: shade(K.trunk, 0.15) }]} />
        <Flame x={L + 34} y={190} s={0.55} />
        <Flame x={L + 66} y={190} s={0.6} />
        <Flame x={L + 92} y={192} s={0.45} />
        <Arrow from={[L + 50, 84]} to={[L + 50, 30]} w={5} color={K.danger} />
        <Smoke x={L} y={14} w={100} h={30} kind="cloud" op={0.75} />
        <Label x={250} y={40} text="900 °C+" size={14} />
      </Scene2>
    );
  },

  'sf-ek-kirec-sondurme': () => {
    const blade: P = [196, 168];
    const w: PersonProps = { ...KIM, x: 82, y: 228, s: 1.15, pose: { spine: -98, chest: -100, head: -108, legB: [96, 92], legF: [76, 88], armF: { to: [134, 132] }, armB: { to: [112, 140] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        {/* metal tekne */}
        <OG sh={[{ d: 'M168 176H302L292 224H178Z', f: '#8e99a6' }, { d: 'M172 176H298', st: K.out, sw: 2 }]} />
        <path d="M174 180H296" stroke={LIME} stroke-width={6} />
        <Bubbles pts={[[200, 178], [230, 176], [262, 178], [282, 176]]} r={3} />
        <Steam x={238} y={168} n={4} s={1.3} gap={20} />
        <Worker {...w}
          extra={(r) => (
            <OG sh={[{ d: capsule([r.handB[0] - 14, r.handB[1] + 4], 2.6, blade, 2.6), f: K.wood }, { d: `M${blade[0] - 6} ${blade[1] - 10}L${blade[0] + 18} ${blade[1] - 4}L${blade[0] + 14} ${blade[1] + 12}L${blade[0] - 8} ${blade[1] + 6}Z`, f: '#8e99a6' }, { d: ell([blade[0] + 6, blade[1] - 6], 9, 5), f: LIME }]} />
          )} />
        <Arrow from={[230, 112]} to={[214, 152]} bend={0.3} w={5} />
      </Scene2>
    );
  },

  /* ─────────────── ALÇI ─────────────── */
  'sf-ek-alci-kavurma': () => {
    const paddle: P = [214, 166];
    return (
      <Scene2 bg="outdoor">
        <Fire x={226} y={222} s={1.2} />
        <OG sh={[{ d: ell([170, 214], 14, 10), f: K.rock }, { d: ell([284, 214], 14, 10), f: K.rock }, { d: rrect(150, 176, 150, 8, 2), f: IRON }]} />
        <OG sh={[{ d: 'M164 177Q190 160 226 160Q262 160 286 177Z', f: LIME }]} />
        <Steam x={226} y={156} n={3} gap={22} />
        <Worker {...KIM} x={100} y={228} s={1.15} pose={{ spine: -62, chest: -56, head: -40, legB: [100, 96], legF: [74, 92], armF: { to: [160, 132] }, armB: { to: [146, 142] }, face: 'neutral' }}
          hold={(r) => <OG sh={[{ d: capsule([r.handB[0] - 6, r.handB[1] - 2], 2.6, paddle, 2.6), f: K.wood }, { d: ell([paddle[0] + 4, paddle[1] + 2], 12, 4), t: `rotate(25 ${paddle[0] + 4} ${paddle[1] + 2})`, f: K.wood }]} />} />
        <Arrow from={[188, 120]} to={[248, 124]} bend={-0.35} w={4.5} />
      </Scene2>
    );
  },

  'sf-ek-alci-karistirma': () => <TablePour tool="scoop" />,

  'sf-ek-alci-yasak': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M66 112H254L238 226H82Z', f: PLA }, { d: ell([160, 112], 94, 16), f: '#9aa3ad' }, { d: ell([160, 116], 88, 12), f: LIME }]} />
      <Hand x={196} y={34} a={196} s={1.05} pose="open" side="R" arm={120} sleeve={K.role.bystander} skin={1} />
      <OG sh={[{ d: 'M148 112Q168 104 190 114Q170 122 148 112Z', f: LIME }]} />
      <Heat x={96} y={98} n={2} gap={14} h={26} />
      <Heat x={236} y={98} n={2} gap={14} h={26} />
      <No x={168} y={96} r={46} />
      <Label x={160} y={200} text="60 °C+" size={16} bg={K.danger} />
    </Scene2>
  ),

  /* ─────────────── ODUN KÖMÜRÜ ─────────────── */
  'sf-ek-komur-ortme': () => {
    const gy = 112;
    const logs: P[] = [];
    for (let r = 0; r < 3; r++) logs.push([0, gy + 26 + r * 22]);
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={128} fill={SOIL} />
        <path d={`M34 ${gy}V214H286V${gy}Z`} fill="#3a2d27" stroke={K.out} stroke-width={1.5} />
        {/* odunlar */}
        <OG sh={[0, 1, 2, 3].map((i) => ({ d: capsule([44, gy + 30 + i * 22], 9, [276, gy + 30 + i * 22], 9), f: i % 2 ? shade(K.trunk, 0.12) : K.trunk } as Sh))} />
        <Flame x={58} y={gy + 50} s={0.6} />
        <Flame x={76} y={gy + 76} s={0.5} />
        {/* örtü: yaprak + toprak tümsek */}
        <path d={`M30 ${gy}V${gy - 14}H290V${gy}Z`} fill="#7a9a3a" stroke={K.out} stroke-width={1.5} />
        <path d={`M30 ${gy - 14}V${gy - 28}Q160 ${gy - 48} 290 ${gy - 28}V${gy - 14}Z`} fill={SOILD} stroke={K.out} stroke-width={1.5} />
        {/* hava deliği (sol) ve duman deliği (sağ) */}
        <rect x={34} y={gy - 30} width={14} height={32} fill="#3a2d27" stroke={K.out} stroke-width={1.5} />
        <rect x={272} y={gy - 30} width={14} height={32} fill="#3a2d27" stroke={K.out} stroke-width={1.5} />
        <Arrow from={[4, gy - 50]} to={[34, gy - 22]} w={4} color={K.water} />
        <Smoke x={252} y={gy - 80} w={60} h={44} kind="cloud" op={0.85} />
        <path d={`M220 ${gy - 40}V${gy}`} stroke={K.ink} stroke-width={2} />
        <path d={`M214 ${gy - 40}H226M214 ${gy}H226`} stroke={K.ink} stroke-width={2} />
        <Label x={190} y={gy - 64} text="20+20 cm" size={13} />
      </Scene2>
    );
  },

  'sf-ek-komur-yigin': () => {
    // ateş, koninin tepesindeki baca deliğinden uzun bir sırıkla verilir
    const hole: P = [160, 82];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[
          { d: 'M50 214Q66 170 110 120Q140 88 150 84H170Q182 90 210 120Q250 168 262 214Z', f: SOILD },
          { d: 'M86 160Q96 150 110 150M128 120Q140 112 150 118M200 196Q214 188 226 192M70 200Q84 192 98 196', st: K.grass, sw: 4 },
          { d: rrect(150, 78, 20, 10, 3), f: '#3a2d27' },
        ]} />
        <Smoke x={120} y={6} w={46} h={40} kind="cloud" op={0.7} />
        <Worker {...KIM} x={282} y={228} s={1.1} flip pose={{ spine: -80, chest: -74, head: -66, legB: [98, 94], legF: [72, 90], armF: { to: [230, 130] }, armB: { to: [246, 124] }, handB: 'fist', handF: 'fist', face: 'neutral' }}
          hold={() => <OG sh={[{ d: capsule([258, 119], 2.8, [hole[0] + 8, hole[1] - 6], 2.6), f: K.wood }]} />} />
        <Flame x={hole[0] + 6} y={hole[1] - 2} s={0.42} />
      </Scene2>
    );
  },

  'sf-ek-komur-co': () => (
    <Scene2 bg="indoor">
      <Window x={210} y={46} />
      <Smoke x={0} y={0} w={320} h={60} op={0.45} />
      {/* mangal */}
      <OG sh={[
        { d: capsule([52, 196], 2.5, [46, 222], 2.5), f: IRON },
        { d: capsule([96, 196], 2.5, [102, 222], 2.5), f: IRON },
        { d: 'M36 180H112L104 198H44Z', f: '#8e99a6' },
      ]} />
      <g stroke={K.out} stroke-width={1}>
        {[48, 60, 72, 84, 96].map((x, i) => <circle key={x} cx={x} cy={178} r={5.5} fill={i % 2 ? '#e8472d' : '#ff7b1c'} />)}
      </g>
      <Heat x={74} y={164} n={3} gap={12} h={20} c="#9aa3ad" />
      <Person {...KAZA} x={214} y={228} s={1.02} pose={POSE.lieBack} />
      <No x={160} y={124} r={58} />
    </Scene2>
  ),

  /* ─────────────── AKTİF KÖMÜR ─────────────── */
  'sf-ek-aktif-kirma': () => (
    <Scene2 bg="closeup">
      <Desk y={188} c={STONE} />
      {/* bez torba */}
      <OG sh={[{ d: smooth([[40, 194], [36, 160], [60, 138], [100, 134], [138, 140], [158, 166], [154, 196]], true, 0.8), f: '#e8dcc2' }, { d: 'M140 142Q156 128 166 122', st: '#b59a6a', sw: 3 }]} />
      {/* tokmak */}
      <OG sh={[{ d: capsule([118, 92], 3.5, [196, 34], 3.5), f: K.wood }, { d: rrect(70, 82, 56, 30, 6), t: 'rotate(-36 98 97)', f: shade(K.wood, 0.1) }]} />
      <Mitt x={214} y={36} a={-128} s={0.82} sleeve={K.role.bystander3} arm={140} />
      <Waves x={96} y={130} a={-90} n={2} r={8} />
      {/* kevgir + kararmış su */}
      <OG sh={[{ d: 'M206 156H306Q300 202 256 206Q212 202 206 156Z', f: '#8e99a6' }, { d: ell([256, 156], 50, 7), f: '#44494f' }]} />
      <g fill={CHAR} stroke={K.out} stroke-width={0.8}>
        {[[230, 150], [244, 146], [258, 150], [272, 146], [286, 151], [250, 154], [268, 155]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={5} />)}
      </g>
      <path d="M244 210V226M262 212V230M278 208V222" stroke="#44494f" stroke-width={3} stroke-linecap="round" />
    </Scene2>
  ),

  'sf-ek-aktif-kutu': () => (
    <Scene2 bg="outdoor" ground="dirt">
      {/* kor yatağı */}
      <OG sh={[...[-48, -24, 0, 24, 48].map((dx) => ({ d: ell([160 + dx, 214], 12, 8), f: K.rock } as Sh))]} />
      <g stroke={K.out} stroke-width={1}>
        {[118, 134, 150, 166, 182, 198].map((x, i) => <circle key={x} cx={x} cy={204 - (i % 2) * 4} r={7} fill={i % 2 ? '#e8472d' : CHAR} />)}
      </g>
      {/* metal kutu */}
      <OG sh={[{ d: rrect(118, 132, 84, 66, 5), f: '#a3adb8' }, { d: rrect(112, 124, 96, 12, 4), f: '#8e99a6' }, { d: circ([160, 128], 2.6), f: K.out }]} />
      <path d="M160 120c-5-8 5-12 0-20c-5-8 5-12 0-20" stroke="#9aa3ad" stroke-width={3} fill="none" stroke-linecap="round" />
      <Timer x={220} y={64} r={18} text="1 sa" />
    </Scene2>
  ),

  'sf-ek-aktif-filtre': () => (
    <Scene2 bg="indoor">
      {/* sehpa */}
      <OG sh={[{ d: rrect(56, 168, 120, 8, 2), f: K.wood }, { d: rrect(62, 176, 8, 50, 2), f: shade(K.wood, 0.2) }, { d: rrect(162, 176, 8, 50, 2), f: shade(K.wood, 0.2) }]} />
      {/* kova kesit */}
      <path d="M62 34H170L164 168H68Z" fill={PLA} stroke={K.out} stroke-width={1.6} />
      <path d="M68 46H164L163 72H67Z" fill={K.water} opacity={0.8} />
      <path d="M67 72H163L162 102H67.5Z" fill="#e3cf9c" />
      <path d="M67.5 102H162L161 134H68Z" fill={CHAR} />
      <path d="M68 134H161L160 162H68Z" fill="#9aa3ad" />
      <g fill="#b9b4a8" stroke={K.out} stroke-width={0.8}>
        {[[78, 158], [94, 160], [110, 157], [142, 158], [156, 157], [126, 160]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={5} />)}
      </g>
      <g fill="#4a4a4c">
        {[[80, 112], [100, 120], [120, 110], [140, 122], [154, 112], [92, 126], [130, 128]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={4} />)}
      </g>
      <path d="M62 34H170L164 168H68Z" fill="none" stroke={K.out} stroke-width={1.8} />
      <T x={115} y={92} t="kum" s={13} />
      <T x={115} y={122} t="kömür" s={13} c="#fff" />
      <T x={115} y={154} t="çakıl" s={13} />
      {/* musluk ve akış */}
      <OG sh={[{ d: rrect(164, 150, 18, 8, 2), f: '#8e99a6' }, { d: rrect(176, 150, 6, 14, 2), f: '#8e99a6' }]} />
      <path d="M179 166Q182 186 238 170" stroke={K.water} stroke-width={4} fill="none" stroke-linecap="round" />
      <Stove x={252} y={226} s={1.3} />
      <Pot x={252} y={192} s={1.1} />
    </Scene2>
  ),
  /* ─────────────── KÜL SUYU VE POTAS ─────────────── */
  'sf-ek-potas-fici': () => (
    <Scene2 bg="closeup">
      {/* taşlar */}
      <OG sh={[{ d: rrect(76, 178, 44, 30, 6), f: STONE }, { d: rrect(200, 178, 44, 30, 6), f: STONE }]} />
      {/* fıçı kesit */}
      <path d="M86 40H234L228 180H92Z" fill={K.wood} stroke={K.out} stroke-width={1.6} />
      <path d="M98 44H222L218 172H102Z" fill={ASH} />
      <path d="M98 44Q160 76 222 44Z" fill={tint(K.closeup, 0.2)} />
      <path d="M100 140H220L219 156H101Z" fill="#e2c35a" />
      <path d="M101 156H219L218 172H102Z" fill="#9aa3ad" />
      <g fill="#b9b4a8" stroke={K.out} stroke-width={0.7}>
        {[112, 128, 144, 160, 176, 192, 208].map((x, i) => <circle key={x} cx={x} cy={164 + (i % 2) * 2} r={4.5} />)}
      </g>
      <g stroke="#c9a640" stroke-width={1.6}>
        {[110, 126, 142, 158, 174, 190, 206].map((x) => <path key={x} d={`M${x} 144L${x + 10} 152`} />)}
      </g>
      <path d="M86 40H234L228 180H92Z" fill="none" stroke={K.out} stroke-width={2} />
      {/* delikler ve damlalar */}
      <g fill={K.out}>{[134, 160, 186].map((x) => <rect key={x} x={x - 3} y={176} width={6} height={6} />)}</g>
      <Drop x={160} y={198} s={0.8} color={LYE} />
      <Drop x={134} y={194} s={0.6} color={LYE} />
      {/* toplama kabı */}
      <OG sh={[{ d: 'M128 210H192Q190 232 160 232Q130 232 128 210Z', f: CLAY }, { d: ell([160, 211], 32, 5), f: LYE }]} />
      <T x={262} y={100} t="kül" s={14} a="start" />
      <path d="M258 96H222" stroke={K.ink} stroke-width={1.6} />
      <T x={262} y={152} t="saman" s={14} a="start" />
      <path d="M258 148H220" stroke={K.ink} stroke-width={1.6} />
      <T x={262} y={172} t="çakıl" s={14} a="start" />
      <path d="M258 168H220" stroke={K.ink} stroke-width={1.6} />
    </Scene2>
  ),

  'sf-ek-potas-suzme': () => {
    const jug: P = [176, 84];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: rrect(186, 196, 36, 26, 6), f: STONE }, { d: rrect(268, 196, 36, 26, 6), f: STONE }]} />
        <OG sh={[{ d: 'M190 96H300L294 196H196Z', f: K.wood }, { d: 'M193 130H297M195 164H295', st: shade(K.wood, 0.3), sw: 2 }, { d: ell([245, 96], 55, 7), f: ASH }]} />
        <OG sh={[{ d: 'M222 214H268Q266 232 245 232Q224 232 222 214Z', f: CLAY }, { d: ell([245, 215], 23, 4), f: LYE }]} />
        <Drop x={245} y={206} s={0.7} color={LYE} />
        <path d="M192 88Q222 86 240 96" stroke={K.water} stroke-width={4} fill="none" stroke-linecap="round" />
        <Worker {...KIM} x={108} y={228} s={1.12} pose={{ ...POSE.standSide, spine: -84, head: -96, armF: { to: jug }, armB: { to: [jug[0] - 8, jug[1] + 18] }, face: 'neutral' }}
          hold={() => (
            <g transform={`translate(${jug[0]} ${jug[1]}) rotate(100)`}>
              <OG sh={[{ d: 'M-15 -15H15L11 15H-11Z', f: '#9aa3ad' }, { d: ell([0, -15], 15, 4), f: K.water }, { d: 'M-12 -6H12', st: shade('#9aa3ad', 0.25), sw: 1.5 }]} />
            </g>
          )} />
      </Scene2>
    );
  },

  'sf-ek-potas-kaynatma': () => {
    const bowl: P = [222, 150];
    return (
      <Scene2 bg="outdoor">
        <Fire x={226} y={222} s={1.3} />
        <Kazan x={226} y={202} s={1.25} liquid={LYE} steam />
        <Worker {...KIM} x={92} y={228} s={1.15} pose={{ spine: -88, chest: -90, head: -100, legB: [96, 92], legF: [80, 88], armF: { to: [150, 112] }, armB: { to: [134, 118] }, face: 'neutral' }}
          hold={(r) => <OG sh={[{ d: capsule([r.handB[0] - 10, r.handB[1] - 2], 2.4, bowl, 2.4), f: K.wood }]} />} />
      </Scene2>
    );
  },

  /* ─────────────── TUZ ─────────────── */
  'sf-ek-tuz-havuz': () => {
    const pool = (x: number, y: number, w: number) => (
      <g>
        <path d={`M${x} ${y}H${x + w}L${x + w + 22} ${y + 34}H${x - 22}Z`} fill="#8e99a6" stroke={K.out} stroke-width={1.6} />
        <path d={`M${x + 4} ${y + 4}H${x + w - 4}L${x + w + 14} ${y + 30}H${x - 14}Z`} fill={K.waterLight} />
        <g fill="#fff" stroke={K.out} stroke-width={0.8}>
          {[0.1, 0.3, 0.55, 0.8].map((t, i) => <path key={i} d={`M${x - 10 + t * (w + 20)} ${y + 28}l4 -6l4 6z`} />)}
          {[0.2, 0.7].map((t, i) => <path key={'b' + i} d={`M${x + t * w} ${y + 8}l3 -5l3 5z`} />)}
        </g>
      </g>
    );
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={120}>
        <rect x={0} y={100} width={320} height={20} fill={K.water} />
        <circle cx={270} cy={44} r={18} fill="#ffd64a" stroke={K.out} stroke-width={1.5} />
        <g stroke="#ffd64a" stroke-width={3} stroke-linecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={`M${270 + Math.cos(a / R2D) * 24} ${44 + Math.sin(a / R2D) * 24}L${270 + Math.cos(a / R2D) * 32} ${44 + Math.sin(a / R2D) * 32}`} />)}
        </g>
        <g stroke="#fff" stroke-width={3} stroke-linecap="round" fill="none">
          <path d="M30 50H90M50 64H120M24 78H76" />
        </g>
        {pool(50, 136, 90)}
        {pool(188, 136, 90)}
        {pool(118, 186, 100)}
      </Scene2>
    );
  },

  'sf-ek-tuz-toplama': () => {
    const bowlC: P = [118, 132];
    return (
      <Scene2 bg="closeup">
        {/* tava */}
        <OG sh={[{ d: 'M20 176H200L190 214H30Z', f: IRON }, { d: ell([110, 176], 90, 10), f: '#c9d6de' }]} />
        <g fill="#fff" stroke={K.out} stroke-width={0.8}>
          {[40, 60, 84, 150, 170, 186].map((x, i) => <path key={x} d={`M${x} ${178 - (i % 2) * 3}l4 -6l4 6z`} />)}
        </g>
        {/* süzgeç ve kap */}
        <OG sh={[{ d: 'M222 200H302Q298 230 262 230Q226 230 222 200Z', f: CLAY }, { d: 'M220 168H304Q298 200 262 204Q226 200 220 168Z', f: '#c4ccd4' }, { d: ell([262, 168], 42, 6), f: '#f4f4f0' }]} />
        <g fill="#c4ccd4">{[240, 256, 272, 288].map((x) => <circle key={x} cx={x - 2} cy={188} r={2} fill="#6f7987" />)}</g>
        {/* kepçe ve el */}
        <OG sh={[{ d: capsule(bowlC, 3, [214, 76], 3), f: K.wood }, { d: 'M96 128Q118 150 140 128Z', f: K.wood }, { d: ell(bowlC, 18, 5), f: '#fff' }]} />
        <Mitt x={226} y={70} a={-122} s={0.8} glove={false} skin={2} sleeve={K.role.bystander} arm={140} />
        <Arrow from={[150, 104]} to={[236, 150]} bend={-0.4} w={5} />
      </Scene2>
    );
  },

  'sf-ek-tuz-aci-su': () => (
    <Scene2 bg="outdoor" ground="dirt">
      {/* tava eğik, acı su toprağa dökülüyor */}
      <Person who="woman" role="bystander" skin={2} hair="scarf" hairC="#c6574e" x={90} y={228} s={1.12} pose={{ spine: -66, chest: -58, head: -45, legB: [100, 94], legF: [72, 90], armF: { to: [168, 134] }, armB: { to: [150, 128] }, face: 'neutral' }}
        over={() => <OG sh={[{ d: 'M140 118L196 140L190 154L136 132Z', f: IRON }]} />} />
      <path d="M194 148Q206 170 206 210" stroke="#cdbb8a" stroke-width={6} fill="none" stroke-linecap="round" />
      <OG sh={[{ d: ell([210, 214], 26, 6), f: '#9a7a52' }]} />
      <Label x={238} y={182} text="acı su" size={14} />
      {/* tuz kabına katma: yasak */}
      <Panel x={232} y={14} w={80} h={90} c="#fbf7ef" />
      <OG sh={[{ d: rrect(252, 54, 40, 42, 5), f: '#e9f3f7' }, { d: rrect(252, 70, 40, 26, 4), f: '#fff', ln: true }]} />
      <T x={272} y={90} t="tuz" s={11} />
      <Drop x={272} y={44} s={1} color="#cdbb8a" />
      <No x={272} y={60} r={34} />
    </Scene2>
  ),

  /* ─────────────── MUM ─────────────── */
  'sf-ek-mum-su-banyosu': () => (
    <Scene2 bg="closeup">
      <Desk y={204} />
      <Stove x={108} y={226} s={1.5} />
      {/* büyük tencere kesit */}
      <path d="M42 96H174L170 186H46Z" fill="#8e99a6" stroke={K.out} stroke-width={1.6} />
      <path d="M48 116H168L166 180H50Z" fill={K.water} opacity={0.85} />
      {/* iç kap */}
      <path d="M80 84H136V164H80Z" fill="#c4ccd4" stroke={K.out} stroke-width={1.6} />
      <path d="M84 116H132V160H84Z" fill={WAX} />
      <OG sh={[{ d: rrect(88, 98, 16, 16, 3), f: tint(WAX, 0.1) }, { d: rrect(110, 102, 14, 14, 3), f: tint(WAX, 0.1) }]} />
      <Label x={108} y={58} text="62–64 °C" size={14} />
      <Ok x={190} y={100} r={13} />
      {/* doğrudan ateşte */}
      <Stove x={262} y={226} s={1.1} />
      <OG sh={[{ d: 'M232 160H292L290 196H234Z', f: '#c4ccd4' }, { d: ell([262, 160], 30, 5), f: WAX }]} />
      <Flame x={262} y={202} s={0.4} />
      <Bad x={292} y={140} r={14} />
    </Scene2>
  ),

  'sf-ek-mum-daldirma': () => {
    const stickY = 104;
    return (
      <Scene2 bg="indoor">
        {/* kurutma çubuğu ve asılı mumlar */}
        <OG sh={[{ d: rrect(256, 56, 6, 144, 2), f: K.wood }, { d: rrect(306, 56, 6, 144, 2), f: K.wood }, { d: rrect(250, 52, 66, 7, 2), f: K.wood }]} />
        {[270, 284, 298].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 58V68`} stroke={K.out} stroke-width={1.5} />
            <OG sh={[{ d: `M${x - 5} 68H${x + 5}L${x + 4} ${116 + (i % 2) * 6}H${x - 4}Z`, f: WAX }]} />
          </g>
        ))}
        <Stove x={190} y={226} s={1.4} />
        <OG sh={[{ d: 'M150 150H230L226 190H154Z', f: '#8e99a6' }, { d: ell([190, 150], 40, 6), f: WAX }]} />
        <Person {...MUM} x={112} y={228} s={1.12} pose={{ ...POSE.standSide, spine: -84, head: -100, armF: { to: [166, stickY] }, armB: { to: [152, stickY + 4] }, face: 'neutral' }}
          mid={() => (
            <g>
              {[176, 190, 204].map((x) => <path key={x} d={`M${x} ${stickY}V146`} stroke={K.out} stroke-width={1.6} />)}
              {[176, 190, 204].map((x) => <OG key={'c' + x} sh={[{ d: `M${x - 4} ${stickY + 10}H${x + 4}L${x + 3.5} 150H${x - 3.5}Z`, f: WAX }]} />)}
              <OG sh={[{ d: capsule([144, stickY], 3, [216, stickY], 3), f: K.wood }]} />
            </g>
          )} />
        <Arrow from={[244, 84]} to={[244, 134]} w={5} />
        <Arrow from={[230, 134]} to={[230, 84]} w={5} />
      </Scene2>
    );
  },

  'sf-ek-mum-kalip': () => (
    <Scene2 bg="closeup">
      <Desk y={206} />
      {/* fitil çubuğu */}
      <OG sh={[{ d: capsule([100, 70], 3, [200, 70], 3), f: K.wood }]} />
      {/* kâğıt rulo kalıp kesit */}
      <path d="M124 76H176V206H124Z" fill="#f3ecdc" stroke={K.out} stroke-width={1.6} />
      <path d="M130 120Q150 136 170 120V200H130Z" fill={WAX} stroke={K.out} stroke-width={1.2} />
      <path d="M150 70V200" stroke={K.out} stroke-width={1.8} />
      {/* dökülen mum */}
      <path d="M210 66Q178 70 166 118" stroke={WAX} stroke-width={6} fill="none" stroke-linecap="round" />
      <OG sh={[{ d: 'M204 40L244 30L252 58L214 72Z', f: '#c4ccd4' }, { d: 'M204 40L214 72L206 70Z', f: WAX }]} />
      <Mitt x={262} y={70} a={-60} s={0.75} glove={false} skin={1} sleeve={K.role.bystander4} arm={140} />
      <Arrow from={[96, 150]} to={[128, 128]} w={4.5} />
    </Scene2>
  ),

  /* ─────────────── YAĞ ─────────────── */
  'sf-ek-yag-dibek': () => {
    const top: P = [180, 54];
    const bot: P = [200, 166];
    const on = (t: number): P => [top[0] + (bot[0] - top[0]) * t, top[1] + (bot[1] - top[1]) * t];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: 'M150 160H262Q262 222 206 226Q150 222 150 160Z', f: STONE }, { d: ell([206, 160], 56, 10), f: '#6b4a5a' }]} />
        <g fill="#4a2f45" stroke={K.out} stroke-width={0.8}>{[176, 192, 214, 232].map((x, i) => <ellipse key={x} cx={x} cy={157 + (i % 2)} rx={6} ry={4} />)}</g>
        <Person {...YAG} x={122} y={228} s={1.12} pose={{ ...POSE.standSide, spine: -84, head: -96, armF: { to: on(0.38) }, armB: { to: on(0.2) }, handB: 'fist', handF: 'fist', face: 'neutral' }}
          mid={() => <OG sh={[{ d: capsule(top, 5, bot, 7), f: K.wood }]} />} />
        <Arrow from={[244, 56]} to={[244, 122]} w={5} />
        <Arrow from={[260, 122]} to={[260, 56]} w={5} />
      </Scene2>
    );
  },

  'sf-ek-yag-pres': () => (
    <Scene2 bg="outdoor">
      {/* taban ve oluk */}
      <OG sh={[{ d: rrect(120, 194, 132, 16, 3), f: STONE }, { d: 'M248 198H272L270 206H248Z', f: STONE }, { d: 'M260 214H310L304 232H266Z', f: '#7a5a3a' }, { d: ell([285, 214], 25, 4), f: OIL }]} />
      <path d="M268 204Q280 206 282 214" stroke={OIL} stroke-width={4} fill="none" />
      {/* hasır torbalar */}
      <OG sh={[0, 1, 2, 3, 4].map((i) => ({ d: rrect(146, 182 - i * 12, 82, 12, 6), f: i % 2 ? '#b5925a' : '#c9a66a' } as Sh))} />
      <g fill={OIL}>{[150, 224].map((x) => <path key={x} d={`M${x} 160q-3 8 0 12q3 -4 0 -12z`} />)}</g>
      <OG sh={[{ d: rrect(140, 124, 94, 8, 2), f: K.wood }]} />
      {/* kaldıraç: solda dikme, sağda taş */}
      <OG sh={[{ d: rrect(40, 70, 14, 140, 2), f: K.trunk }, { d: capsule([46, 110], 6, [300, 136], 6), f: K.wood }]} />
      <path d="M296 142V172" stroke={K.out} stroke-width={2} />
      <OG sh={[{ d: smooth([[278, 174], [296, 168], [314, 176], [312, 200], [282, 202]], true), f: K.rock }]} />
      <Arrow from={[188, 66]} to={[188, 108]} w={5} />
    </Scene2>
  ),

  'sf-ek-yag-ayirma': () => (
    <Scene2 bg="closeup">
      <Desk y={210} />
      <path d="M80 70H240L232 212H88Z" fill="#c4ccd4" stroke={K.out} stroke-width={1.6} />
      <path d="M86 96H234L232 128H86.5Z" fill={OIL} />
      <path d="M86.5 128H232L230 206H90Z" fill="#4e3a2a" />
      <path d="M80 70H240L232 212H88Z" fill="none" stroke={K.out} stroke-width={1.8} />
      <T x={160} y={118} t="yağ" s={15} />
      <T x={160} y={176} t="karasu" s={15} c="#fff" />
      {/* kepçe */}
      <OG sh={[{ d: capsule([196, 98], 3, [266, 28], 3), f: '#8e99a6' }, { d: 'M168 92Q190 112 212 92Z', f: '#8e99a6' }, { d: ell([190, 93], 22, 4), f: OIL }]} />
      <Mitt x={280} y={36} a={-130} s={0.75} glove={false} skin={2} sleeve={K.role.bystander2} arm={140} />
    </Scene2>
  ),

  /* ─────────────── KÂĞIT ─────────────── */
  'sf-ek-kagit-dovme': () => {
    const head: P = [184, 74];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: rrect(142, 196, 96, 22, 6), f: STONE }, { d: smooth([[150, 196], [168, 188], [200, 190], [228, 194]], false), st: '#efe6c8', sw: 7 }]} />
        <Person {...KAG} x={90} y={228} s={1.15} pose={{ ...POSE.kneelOne, spine: -80, chest: -74, head: -60, armF: { to: [148, 118] }, armB: { to: [140, 124] }, face: 'neutral' }}
          mid={(r) => <OG sh={[{ d: capsule([r.handB[0] - 4, r.handB[1] + 4], 3, head, 3), f: K.wood }, { d: rrect(head[0] - 12, head[1] - 10, 40, 22, 5), t: `rotate(-50 ${head[0]} ${head[1]})`, f: shade(K.wood, 0.12) }]} />} />
        <Arrow from={[222, 104]} to={[206, 170]} bend={-0.2} w={5} />
        {/* su bardağında dağılan lif */}
        <OG sh={[{ d: 'M258 140H302L298 214H262Z', f: '#e9f3f7' }, { d: 'M260 154H300L297 210H263Z', f: K.waterLight, no: true }]} />
        <path d="M268 182c6 -10 14 4 20 -6c4 8 -6 14 2 20c-8 2 -14 -6 -22 -2c-2 -6 6 -6 0 -12z" fill="#fff" opacity={0.9} />
        <path d="M258 140H302L298 214H262Z" fill="none" stroke={K.out} stroke-width={1.6} />
      </Scene2>
    );
  },

  'sf-ek-kagit-daldirma': () => {
    const fr: P[] = [[160, 140], [244, 140], [258, 154], [174, 154]];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[{ d: 'M138 172H312L302 226H148Z', f: K.wood }, { d: 'M144 176H306L304 184H146Z', f: '#e9eef0' }]} />
        <Person {...KAG} x={88} y={228} s={1.15} pose={{ spine: -48, chest: -38, head: -28, legB: [100, 94], legF: [74, 90], armF: { to: [176, 150] }, armB: { to: [166, 146] }, face: 'neutral' }}
          mid={() => (
            <g>
              <path d={`M${fr[0][0]} ${fr[0][1]}L${fr[1][0]} ${fr[1][1]}L${fr[2][0]} ${fr[2][1]}L${fr[3][0]} ${fr[3][1]}Z`} fill={K.wood} stroke={K.out} stroke-width={1.6} />
              <path d={`M${fr[0][0] + 6} ${fr[0][1] + 2}L${fr[1][0] - 4} ${fr[1][1] + 2}L${fr[2][0] - 8} ${fr[2][1] - 2}L${fr[3][0] + 4} ${fr[3][1] - 2}Z`} fill="#f3f0e6" />
              <g stroke="#cfcabd" stroke-width={0.8}>{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${168 + i * 14} 143L${180 + i * 14} 151`} />)}</g>
            </g>
          )} />
        <g fill={K.water}>{[186, 206, 226, 244].map((x, i) => <path key={x} d={`M${x} ${158 + (i % 2) * 4}q-3 5 0 7q3 -2 0 -7z`} />)}</g>
        <Arrow from={[236, 104]} to={[200, 104]} w={4.5} />
        <Arrow from={[252, 104]} to={[290, 104]} w={4.5} />
      </Scene2>
    );
  },

  'sf-ek-kagit-pres': () => (
    <Scene2 bg="indoor">
      {/* arka: kuruyan yapraklar */}
      <OG sh={[{ d: 'M206 60H300L304 196H210Z', f: K.wood }, { d: rrect(218, 74, 32, 40, 2), f: '#f6f2e6' }, { d: rrect(258, 74, 32, 40, 2), f: '#f6f2e6' }, { d: rrect(220, 126, 32, 40, 2), f: '#f6f2e6' }, { d: rrect(260, 126, 32, 40, 2), f: '#f6f2e6' }]} />
      {/* tava */}
      <OG sh={[{ d: 'M24 210H190L184 226H30Z', f: '#8e99a6' }]} />
      <OG sh={[
        { d: rrect(34, 196, 146, 12, 2), f: K.wood },
        ...[0, 1, 2, 3, 4, 5].map((i) => ({ d: rrect(40, 188 - i * 8, 134, 8, 1), f: i % 2 ? '#f6f2e6' : '#9aa3ad' } as Sh)),
        { d: rrect(34, 132, 146, 12, 2), f: K.wood },
        { d: smooth([[56, 132], [64, 112], [92, 108], [104, 120], [100, 132]], true), f: K.rock },
        { d: smooth([[110, 132], [118, 106], [150, 104], [164, 118], [160, 132]], true), f: shade(K.rock, 0.1) },
      ]} />
      <g fill={K.water}>{[42, 174].map((x) => <path key={x} d={`M${x} 176q-4 8 0 12q4 -4 0 -12zM${x} 196q-3 6 0 9q3 -3 0 -9z`} />)}</g>
      <Arrow from={[108, 56]} to={[108, 96]} w={5} />
    </Scene2>
  ),

  /* ─────────────── MÜREKKEP ─────────────── */
  'sf-ek-murekkep-is': () => (
    <Scene2 bg="closeup">
      <Desk y={196} />
      {/* kandil */}
      <OG sh={[{ d: 'M110 200Q110 172 150 170L196 176Q200 186 186 196Q160 204 110 200Z', f: CLAY }, { d: ell([148, 176], 26, 5), f: '#6b4a2a' }, { d: capsule([180, 180], 4, [196, 176], 4), f: CLAY }]} />
      <Flame x={198} y={172} s={0.55} />
      {/* toprak tabak (altı isli) */}
      <OG sh={[{ d: 'M140 96Q198 118 256 96L250 88H146Z', f: CLAY }, { d: 'M164 104Q198 116 232 104Q198 110 164 104Z', f: '#1e1c1d' }]} />
      <path d="M198 144c-4 -10 4 -16 0 -26" stroke="#55565a" stroke-width={3} fill="none" stroke-linecap="round" />
      <Mitt x={286} y={102} a={-94} s={0.72} glove={false} skin={0} sleeve="#4f7fb0" arm={120} />
      <path d="M118 96V170" stroke={K.ink} stroke-width={2} />
      <path d="M112 96H124M112 170H124" stroke={K.ink} stroke-width={2} />
      <Label x={86} y={132} text="1 karış" size={12} />
    </Scene2>
  ),

  'sf-ek-murekkep-ezme': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: smooth([[30, 200], [40, 150], [120, 136], [250, 140], [296, 170], [286, 212], [150, 222]], true, 0.8), f: STONE }]} />
      <OG sh={[{ d: ell([150, 172], 64, 16), f: '#1e1c1d' }]} />
      <OG sh={[{ d: smooth([[128, 170], [130, 140], [156, 130], [182, 140], [180, 170]], true, 0.8), f: '#8f8a80' }]} />
      <Mitt x={188} y={104} a={-150} s={0.8} glove={false} skin={0} sleeve="#4f7fb0" arm={150} />
      <Arrow from={[88, 196]} to={[216, 198]} bend={-0.35} w={5} />
    </Scene2>
  ),

  'sf-ek-murekkep-kararma': () => (
    <Scene2 bg="closeup">
      <path d={rrect(46, 22, 228, 200, 6)} fill="#f6f1e2" stroke={K.out} stroke-width={1.6} />
      <path d="M70 66c10 -10 16 8 26 -2s14 6 24 -4s16 10 26 0s12 6 22 -2s14 8 24 0s14 4 24 -2" stroke="#b9b4ae" stroke-width={4} fill="none" stroke-linecap="round" />
      <path d="M70 176c10 -10 16 8 26 -2s14 6 24 -4s16 10 26 0s12 6 22 -2s14 8 24 0s14 4 24 -2" stroke="#2a1e33" stroke-width={4} fill="none" stroke-linecap="round" />
      <Timer x={124} y={122} r={18} />
      <Arrow from={[160, 106]} to={[160, 146]} w={5} />
    </Scene2>
  ),

  /* ─────────────── CAM ─────────────── */
  'sf-ek-cam-sise-kesme': () => {
    const GL = '#9fd0b0';
    const bottle = (cx: number, base: number, part: 'all' | 'top' | 'bot' = 'all', dy = 0) => {
      const body = `M${cx - 22} ${base}V${base - 82}Q${cx - 22} ${base - 100} ${cx - 8} ${base - 108}V${base - 130}H${cx + 8}V${base - 108}Q${cx + 22} ${base - 100} ${cx + 22} ${base - 82}V${base}Z`;
      const cut = base - 60;
      return (
        <g>
          {part !== 'top' && <path d={`M${cx - 22} ${base}V${cut}H${cx + 22}V${base}Z`} fill={GL} stroke={K.out} stroke-width={1.6} />}
          {part !== 'bot' && <g transform={`translate(0 ${-dy})`}><path d={part === 'all' ? body : `M${cx - 22} ${cut}V${base - 82}Q${cx - 22} ${base - 100} ${cx - 8} ${base - 108}V${base - 130}H${cx + 8}V${base - 108}Q${cx + 22} ${base - 100} ${cx + 22} ${base - 82}V${cut}Z`} fill={GL} stroke={K.out} stroke-width={1.6} /></g>}
          {part === 'all' && <path d={`M${cx - 12} ${base - 90}V${base - 20}`} stroke="#fff" stroke-width={3} opacity={0.6} />}
          {part === 'all' && <path d={`M${cx - 22} ${cut}H${cx + 22}`} stroke={K.ink} stroke-width={2.4} stroke-dasharray="4 3" />}
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        <Panel x={6} y={10} w={98} h={220} />
        <Panel x={111} y={10} w={98} h={220} />
        <Panel x={216} y={10} w={98} h={220} />
        {bottle(55, 210)}
        <OG sh={[{ d: capsule([78, 150], 3, [96, 128], 3), f: '#8e99a6' }, { d: circ([78, 150], 4), f: '#c4ccd4' }]} />
        <Mitt x={100} y={120} a={-40} s={0.42} sleeve={K.role.bystander3} arm={60} />
        {bottle(160, 210)}
        <path d="M120 70Q130 76 138 150" stroke={K.danger} stroke-width={5} fill="none" stroke-linecap="round" />
        <Steam x={150} y={146} n={2} gap={14} s={0.8} />
        <OG sh={[{ d: 'M226 178H304L300 214H230Z', f: '#cfe6f3' }]} />
        {bottle(265, 210, 'bot')}
        {bottle(265, 210, 'top', 22)}
        <path d="M226 186H304" stroke={K.water} stroke-width={3} />
        <Arrow from={[298, 120]} to={[298, 80]} w={4} />
        <Num x={22} y={26} n={1} />
        <Num x={127} y={26} n={2} />
        <Num x={232} y={26} n={3} />
      </Scene2>
    );
  },

  'sf-ek-cam-tavlama': () => (
    <Scene2 bg="closeup">
      <path d="M40 24V204H302" stroke={K.ink} stroke-width={2.6} fill="none" />
      <path d="M34 32L40 22L46 32M294 198L304 204L294 210" stroke={K.ink} stroke-width={2.6} fill="none" />
      <Dash d="M76 92L104 196" c={K.danger} w={4} />
      <path d="M48 36Q60 82 76 92H150Q230 120 296 196" stroke={K.safe} stroke-width={5} fill="none" stroke-linecap="round" />
      <Label x={114} y={74} text="550 °C" size={13} />
      <Ok x={262} y={140} r={13} />
      {/* çatlak cam */}
      <OG sh={[{ d: rrect(110, 150, 40, 40, 4), f: '#cfe6f3' }]} />
      <path d="M122 154l6 14l-8 8l10 12M128 168l14 -6" stroke={K.out} stroke-width={1.6} fill="none" />
      <Bad x={150} y={150} r={11} />
      <Timer x={238} y={42} r={14} />
    </Scene2>
  ),

  'sf-ek-cam-yagli-kagit': () => (
    <Scene2 bg="indoor">
      <path d="M96 78H180L300 240H40Z" fill="#fff3c4" opacity={0.45} />
      <OG sh={[
        { d: rrect(90, 30, 96, 96, 3), f: K.wood },
        { d: rrect(98, 38, 36, 36, 1), f: '#f6e3a8', ln: true },
        { d: rrect(142, 38, 36, 36, 1), f: '#f6e3a8', ln: true },
        { d: rrect(98, 82, 36, 36, 1), f: '#f6e3a8', ln: true },
        { d: rrect(142, 82, 36, 36, 1), f: '#f6e3a8', ln: true },
        { d: rrect(84, 124, 108, 8, 2), f: K.wood },
      ]} />
      <g stroke="#e3c97a" stroke-width={1.2}>{[48, 60, 92, 104].map((y) => <path key={y} d={`M102 ${y}H130M146 ${y}H174`} />)}</g>
      <Table x={180} y={226} w={120} h={60} />
      <Pot x={238} y={166} s={0.8} boil={false} />
    </Scene2>
  ),

  /* ─────────────── FERMANTASYON (sirke ve turşu) ─────────────── */
  'sf-ek-ferm-bez': () => (
    <Scene2 bg="closeup">
      <Desk y={206} />
      {/* toprak küp + bez */}
      <OG sh={[{ d: 'M70 98Q40 120 44 166Q50 210 118 212Q186 210 192 166Q196 120 166 98Z', f: CLAY }, { d: rrect(70, 86, 96, 16, 5), f: shade(CLAY, 0.1) }]} />
      <OG sh={[{ d: 'M60 92Q118 70 176 92L170 110Q118 100 66 110Z', f: '#f4f1ea' }, { d: 'M64 104Q118 96 172 104', st: '#9a6a2e', sw: 3.4 }]} />
      <g fill="none" stroke={K.water} stroke-width={3} stroke-linecap="round">
        <path d="M92 40V70M118 34V66M144 40V70" />
        <path d="M86 62L92 72L98 62M112 58L118 68L124 58M138 62L144 72L150 62" />
      </g>
      <Ok x={196} y={120} r={13} />
      {/* sıkı kapak: yanlış */}
      <OG sh={[{ d: rrect(232, 124, 60, 82, 10), f: '#e9f3f7' }, { d: rrect(228, 110, 68, 18, 4), f: '#8e99a6' }, { d: rrect(236, 150, 52, 52, 8), f: '#efe7c4', no: true }]} />
      <Apples pts={[[248, 172], [270, 166], [256, 190], [278, 188]]} s={0.9} />
      <path d="M232 124H292" stroke={K.out} stroke-width={1.5} />
      <Bad x={292} y={104} r={14} />
    </Scene2>
  ),

  'sf-ek-ferm-tursu': () => {
    const jar = (x: number, w: number, top: number, base: number) => `M${x} ${top + 14}Q${x} ${top} ${x + 14} ${top}H${x + w - 14}Q${x + w} ${top} ${x + w} ${top + 14}V${base - 8}Q${x + w} ${base} ${x + w - 8} ${base}H${x + 8}Q${x} ${base} ${x} ${base - 8}Z`;
    return (
      <Scene2 bg="closeup">
        <Desk y={212} />
        <path d={jar(40, 140, 40, 214)} fill="#e9f3f7" stroke={K.out} stroke-width={1.6} />
        <path d="M43 76H177V206Q177 211 172 211H48Q43 211 43 206Z" fill="#d6ebc4" />
        <OG sh={[
          { d: capsule([62, 196], 11, [100, 120], 10), f: '#5c9a3a' },
          { d: capsule([92, 198], 11, [128, 118], 10), f: '#6aa846' },
          { d: capsule([124, 198], 11, [160, 124], 10), f: '#5c9a3a' },
          { d: capsule([156, 196], 9, [148, 150], 8), f: '#d94a3a' },
        ]} />
        <OG sh={[{ d: smooth([[64, 100], [80, 88], [140, 86], [160, 98], [150, 110], [74, 112]], true), f: STONE }]} />
        <path d="M43 76H177" stroke={K.water} stroke-width={3} />
        <path d={jar(40, 140, 40, 214)} fill="none" stroke={K.out} stroke-width={2} />
        <Ok x={196} y={60} r={13} />
        {/* yanlış: sebze suyun dışında */}
        <path d={jar(228, 72, 102, 212)} fill="#e9f3f7" stroke={K.out} stroke-width={1.6} />
        <path d="M231 150H297V206Q297 209 294 209H234Q231 209 231 206Z" fill="#d6ebc4" />
        <OG sh={[{ d: capsule([248, 200], 8, [262, 116], 7), f: '#5c9a3a' }, { d: capsule([276, 200], 8, [282, 160], 7), f: '#6aa846' }]} />
        <OG sh={[{ d: circ([258, 126], 5), f: '#4a6a3a' }, { d: circ([266, 136], 4), f: '#3d5a2f' }]} />
        <path d="M231 150H297" stroke={K.water} stroke-width={3} />
        <Bad x={296} y={98} r={13} />
      </Scene2>
    );
  },

  'sf-ek-ferm-sise-yasak': () => (
    <Scene2 bg="closeup">
      <Desk y={212} />
      <OG sh={[{ d: 'M104 72Q100 60 116 58H204Q220 60 216 72V200Q216 214 202 214H118Q104 214 104 200Z', f: '#e9f3f7' }, { d: 'M98 40Q160 18 222 40V62H98Z', f: '#8e99a6' }]} />
      <path d="M107 92H213V198Q213 211 200 211H120Q107 211 107 198Z" fill="#efe7c4" />
      <Apples pts={[[126, 186], [150, 196], [176, 188], [198, 194], [136, 160], [164, 166], [192, 160], [124, 132], [152, 136], [182, 128], [200, 112], [140, 108]]} s={1.15} />
      <Bubbles pts={[[118, 90], [130, 84], [146, 88], [162, 82], [178, 88], [194, 84], [206, 90], [170, 150], [134, 146]]} r={3.6} />
      <path d="M204 70l-10 26l12 16l-8 22M110 150l14 10l-4 18" stroke={K.out} stroke-width={2.2} fill="none" />
      <path d="M128 28l-6 -14M160 20v-14M192 28l6 -14" stroke={K.danger} stroke-width={3} stroke-linecap="round" />
      <No x={160} y={132} r={70} />
    </Scene2>
  ),

  /* ─────────────── BİYOGAZ ─────────────── */
  'sf-ek-biyogaz-tank': () => {
    const gy = 96;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={144} fill={SOIL} />
        <rect x={0} y={gy} width={320} height={5} fill={K.grass} />
        {/* tank */}
        <path d="M100 210V84Q100 56 128 56H212Q240 56 240 84V210Z" fill="#6f7987" stroke={K.out} stroke-width={1.6} />
        <path d="M106 112H234V204H106Z" fill="#6b4f2e" />
        <path d="M106 112V84Q106 62 128 62H212Q234 62 234 84V112Z" fill="#e8e4c6" />
        <Bubbles pts={[[130, 150], [160, 130], [190, 160], [214, 136], [150, 180], [200, 190], [176, 118]]} r={3} c="#c9b98a" />
        {/* besleme borusu */}
        <path d="M58 92L126 196" stroke={K.out} stroke-width={14} stroke-linecap="round" />
        <path d="M58 92L126 196" stroke="#9aa3ad" stroke-width={10} stroke-linecap="round" />
        <OG sh={[{ d: 'M38 70H82L66 92H54Z', f: '#9aa3ad' }]} />
        {/* taşma borusu */}
        <path d="M234 124H284V100" stroke={K.out} stroke-width={14} fill="none" />
        <path d="M234 124H284V100" stroke="#9aa3ad" stroke-width={10} fill="none" />
        <path d="M268 100H300V118H268Z" fill="#6b4f2e" stroke={K.out} stroke-width={1.5} />
        {/* gaz çıkışı */}
        <path d="M170 56V26H226" stroke={K.out} stroke-width={10} fill="none" />
        <path d="M170 56V26H226" stroke="#e8c23a" stroke-width={6} fill="none" />
        <OG sh={[{ d: rrect(186, 18, 14, 16, 2), f: K.danger }]} />
        <Arrow from={[30, 50]} to={[56, 74]} w={4} />
        <Arrow from={[234, 26]} to={[290, 26]} w={4} color="#9aa3ad" />
      </Scene2>
    );
  },

  'sf-ek-biyogaz-sabun': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(-10, 92, 140, 22, 4), f: '#e8c23a' }, { d: rrect(190, 92, 140, 22, 4), f: '#e8c23a' }, { d: rrect(124, 84, 72, 38, 6), f: '#8e99a6' }]} />
      <Bubbles pts={[[136, 80], [148, 74], [160, 80], [172, 72], [184, 80], [154, 66], [166, 60]]} r={4.4} />
      <circle cx={160} cy={98} r={44} fill="none" stroke={K.danger} stroke-width={4} />
      <Label x={160} y={30} text="kaçak" size={14} bg={K.danger} />
      {/* fırça ve el */}
      <OG sh={[{ d: capsule([222, 104], 3, [270, 156], 3), f: K.wood }, { d: rrect(196, 92, 30, 18, 4), t: 'rotate(45 211 101)', f: '#e6e8eb' }]} />
      <Mitt x={284} y={170} a={-48} s={0.7} glove={false} skin={1} sleeve={K.role.bystander4} arm={120} />
    </Scene2>
  ),

  'sf-ek-biyogaz-girme-yasak': () => {
    const gy = 150;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={90} fill={SOIL} />
        <rect x={0} y={gy} width={320} height={5} fill={K.grass} />
        {/* tank kesit */}
        <path d={`M14 ${gy + 12}H196V244H14Z`} fill="#4d4a3a" stroke={K.out} stroke-width={1.6} />
        <path d={`M18 ${gy + 16}H192V244H18Z`} fill="#9bb07a" opacity={0.4} />
        <path d={`M18 214H192V244H18Z`} fill="#6b4f2e" />
        <rect x={84} y={gy - 2} width={44} height={16} fill="#3a352c" stroke={K.out} stroke-width={1.5} />
        {/* merdiven */}
        <g stroke={K.out} stroke-width={1.4}>
          <rect x={92} y={gy - 44} width={5} height={150} fill="#9aa3ad" />
          <rect x={116} y={gy - 44} width={5} height={150} fill="#9aa3ad" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={97} y={gy - 36 + i * 18} width={19} height={3.5} fill="#9aa3ad" />)}
        </g>
        <Person {...CIF} x={106} y={gy + 22} ay="hip" s={0.82} pose={{ spine: -92, head: -96, legB: [70, 120], legF: [96, 84], armF: { to: [119, gy - 14] }, armB: { to: [95, gy - 10] }, face: 'neutral' }} />
        <Waves x={60} y={gy + 50} a={-90} n={2} r={7} color="#6f8a4a" />
        <No x={106} y={gy - 4} r={52} />
        {/* dışarıda 112'yi arayan komşu */}
        <Person who="woman" role="helper" skin={2} hair="long" hairC={K.hair.black} x={262} y={gy + 6} s={0.8} flip pose={{ ...POSE.standSide, armF: { at: 'head', d: [-3, 9] }, face: 'speak' }}
          over={(r) => <Phone x={r.handF[0]} y={r.handF[1] - 6} s={0.2} call={false} />} />
        <Label x={262} y={20} text="112" size={16} />
        <Ok x={300} y={54} r={12} />
      </Scene2>
    );
  },

  /* ─────────────── ODUN GAZI ─────────────── */
  'sf-ek-gazojen-kesit': () => (
    <Scene2 bg="closeup">
      <path d="M110 40H210V214H110Z" fill="#6b7280" stroke={K.out} stroke-width={1.6} />
      <path d="M116 46H204V208H116Z" fill="#3a3c42" />
      <OG sh={[{ d: rrect(102, 26, 116, 16, 4), f: IRON }, { d: rrect(150, 14, 20, 14, 3), f: IRON }]} />
      {/* odun */}
      <OG sh={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => ({ d: rrect(122 + (i % 4) * 20 + ((i >> 2) % 2) * 8, 54 + (i >> 2) * 26, 18, 20, 3), f: i % 2 ? K.wood : shade(K.wood, 0.12) } as Sh))} />
      {/* kor */}
      <g stroke={K.out} stroke-width={1}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={126 + (i % 4) * 22} cy={142 + (i >> 2) * 16} r={8} fill={i % 3 ? '#ff7b1c' : '#e8472d'} />)}
      </g>
      <path d="M116 178H204" stroke="#c4ccd4" stroke-width={4} stroke-dasharray="8 4" />
      <path d="M118 186H202V206H118Z" fill={ASH} />
      {/* hava girişi */}
      <path d="M40 150H110" stroke={K.out} stroke-width={14} />
      <path d="M40 150H110" stroke="#9aa3ad" stroke-width={10} />
      <Arrow from={[22, 124]} to={[96, 124]} w={4} color={K.water} />
      {/* gaz çıkışı */}
      <path d="M210 196H262V120" stroke={K.out} stroke-width={14} fill="none" />
      <path d="M210 196H262V120" stroke="#9aa3ad" stroke-width={10} fill="none" />
      <Arrow from={[284, 176]} to={[284, 104]} w={5} color="#7a818b" />
      <Label x={262} y={72} text="CO + H₂" size={14} bg="#e6e8eb" />
    </Scene2>
  ),

  'sf-ek-gazojen-acik-hava': () => (
    <Scene2 bg="outdoor">
      <Tree x={36} y={196} s={0.7} />
      <Gazojen x={100} y={218} s={1} />
      <circle cx={100} cy={176} r={60} fill="none" stroke={K.safe} stroke-width={2.6} stroke-dasharray="7 6" />
      <Ok x={150} y={112} r={14} />
      {/* garaj */}
      <path d="M176 240V70L248 40L320 70V240Z" fill="#cbbfae" stroke={K.out} stroke-width={1.6} />
      <path d="M190 240V110H310V240Z" fill="#4a4d55" stroke={K.out} stroke-width={1.6} />
      <Gazojen x={246} y={232} s={0.9} smoke />
      <No x={250} y={170} r={52} />
    </Scene2>
  ),

  'sf-ek-gazojen-co': () => {
    const v: PersonProps = { ...CIF, x: 214, y: 226, s: 1.1, pose: { ...POSE.walk, spine: -80, head: -70, armF: { at: 'head', d: [2, -4] }, face: 'pain' } };
    const vr = rig(v);
    const h: PersonProps = { ...KIM, x: 136, y: 228, s: 1.1, pose: { ...POSE.walk, armF: { to: vr.back }, armB: { at: 'head', d: [-3, 9] }, face: 'worried' } };
    return (
      <Scene2 bg="outdoor">
        <path d="M0 240V60L50 36L110 60V240Z" fill="#cbbfae" stroke={K.out} stroke-width={1.6} />
        <path d="M12 240V100H98V240Z" fill="#4a4d55" stroke={K.out} stroke-width={1.6} />
        <Gazojen x={52} y={232} s={0.8} />
        <Smoke x={10} y={100} w={88} h={40} kind="layer" op={0.8} />
        <Worker {...h} gl={['F']} extra={(r) => <Phone x={r.handB[0]} y={r.handB[1] - 6} s={0.22} call={false} />} />
        <Person {...v} />
        <Arrow from={[252, 96]} to={[304, 96]} w={6} />
        <Label x={140} y={30} text="112" size={16} />
      </Scene2>
    );
  },
};
