// Psikolojik ilk yardım + zehirlenme sahneleri (kit v2).
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Bad, Bed, Bottle, Bubble, Chair, Door, Flame, Hand, HouseExt, K, Label, No, OG, Ok, Person, POSE, Phone, Pot, Rock,
  Scene2, Shake, Smoke, Table, Tent, Timer, Tree, Waves, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Rig, Sh } from '../kit2';

/* ════════════════════════════ yardımcılar ════════════════════════════ */

const RAD = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * RAD) * l, p[1] + Math.sin(a * RAD) * l];
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / RAD;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, fx = false, children }: { x?: number; y?: number; s?: number; a?: number; fx?: boolean; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)})${a ? ` rotate(${f1(a)})` : ''} scale(${fx ? -s : s} ${s})`}>{children}</g>
);

/** Baş yerel koordinatını (yarıçap 12, yüz +x / önde) sahneye çevirir. */
function headPt(r: Rig, lx: number, ly: number): P {
  const kh = r.headR / 12;
  if (!r.flip) {
    const a = (r.headA + 90) * RAD;
    return [r.head[0] + (lx * Math.cos(a) - ly * Math.sin(a)) * kh, r.head[1] + (lx * Math.sin(a) + ly * Math.cos(a)) * kh];
  }
  const a = (180 - r.headA + 90) * RAD;
  return [r.head[0] - (lx * Math.cos(a) - ly * Math.sin(a)) * kh, r.head[1] + (lx * Math.sin(a) + ly * Math.cos(a)) * kh];
}
/** El bileğini, verilen el noktası hedefe gelecek şekilde konumlar. */
function handAt(h: Omit<HandProps, 'x' | 'y'>, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): HandProps {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

let uid = 0;
/** Çerçeveli ek kare (kırpılmış) */
function Panel({ x, y, w, h, bg = K.sky, children, r = 10 }: { x: number; y: number; w: number; h: number; bg?: string; children?: ComponentChildren; r?: number }) {
  const id = 'pz-p' + ++uid;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={r} />
        </clipPath>
      </defs>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={r + 2} fill="#fff" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={bg} />
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Kesikli turuncu ok */
function DashArrow({ from, to, bend = 0, w = 4, color = K.action }: { from: P; to: P; bend?: number; w?: number; color?: string }) {
  const m = lerp(from, to, 0.5);
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const n = pol([0, 0], angOf(from, to) - 90, bend * len);
  const c = add(m, n);
  const tang = bend ? angOf(c, to) : angOf(from, to);
  const hl = w * 2.3 + 5;
  const end = pol(to, tang, -hl * 0.7);
  const b = pol(to, tang, -hl);
  const d = bend ? `M${f1(from[0])} ${f1(from[1])}Q${f1(c[0])} ${f1(c[1])} ${f1(end[0])} ${f1(end[1])}` : `M${f1(from[0])} ${f1(from[1])}L${f1(end[0])} ${f1(end[1])}`;
  const h1 = pol(b, tang + 90, hl * 0.6), h2 = pol(b, tang - 90, hl * 0.6);
  const hp = `M${f1(to[0])} ${f1(to[1])}L${f1(h1[0])} ${f1(h1[1])}L${f1(h2[0])} ${f1(h2[1])}Z`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={w + 3} stroke-dasharray="9 7" />
      <path d={d} fill="none" stroke={color} stroke-width={w} stroke-dasharray="9 7" />
      <path d={hp} fill={color} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Ölçü çizgisi (iki uçlu) + etiket */
function Dim({ a, b, text, c = K.ink }: { a: P; b: P; text: string; c?: string }) {
  const an = angOf(a, b);
  const head = (p: P, dir: number) => {
    const t = pol(p, dir, 9);
    const q1 = pol(t, dir + 90, 5), q2 = pol(t, dir - 90, 5);
    return `M${f1(p[0])} ${f1(p[1])}L${f1(q1[0])} ${f1(q1[1])}L${f1(q2[0])} ${f1(q2[1])}Z`;
  };
  const tk = (p: P) => {
    const p1 = pol(p, an + 90, 9), p2 = pol(p, an - 90, 9);
    return `M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`;
  };
  const m = lerp(a, b, 0.5);
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke="#fff" stroke-width={6} opacity={0.7} />
      <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke={c} stroke-width={2.6} />
      <path d={tk(a) + tk(b)} stroke={c} stroke-width={2.6} />
      <path d={head(a, an) + head(b, an + 180)} fill={c} stroke={c} stroke-width={1} />
      <Label x={m[0]} y={m[1]} text={text} size={16} bg={K.white} />
    </g>
  );
}

/** Kızılay hilali (beyaz zemin üzerinde). x,y = merkez */
function Crescent({ x, y, r = 10, bg = '#fff', ring = true }: { x: number; y: number; r?: number; bg?: string; ring?: boolean }) {
  return (
    <g>
      {ring && <circle cx={x} cy={y} r={r * 1.35} fill={bg} stroke={K.out} stroke-width={1.5} />}
      <circle cx={x} cy={y} r={r} fill={K.red} />
      <circle cx={x + r * 0.42} cy={y - r * 0.08} r={r * 0.82} fill={bg} />
    </g>
  );
}

/** Kalp simgesi. x,y = merkez */
function Heart({ x, y, s = 1, c = '#e8607a' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: 'M0 9C-6 4 -12 0 -12 -5C-12 -10 -6 -12 0 -6C6 -12 12 -10 12 -5C12 0 6 4 0 9Z', f: c }, { d: 'M-7 -6A4 4 0 0 1 -3 -8', st: '#fff', sw: 2 }]} />
    </G>
  );
}

/** Yansıtıcı yelek: gövdeye iki açık şerit (yan ya da ön görünüş) */
function VestStripes({ r, front }: { r: Rig; front?: boolean }) {
  const a = lerp(r.hip, r.neck, 0.36), b = lerp(r.hip, r.neck, 0.62);
  const half = front ? Math.abs(r.shoulderF[0] - r.shoulderB[0]) * 0.55 : Math.abs(r.chest[0] - r.back[0]) * 0.48;
  const c = front ? a : lerp(r.chest, r.back, 0.5);
  const dy = b[1] - a[1];
  return (
    <g stroke="#f7f3c6" stroke-width={3 * r.s} stroke-linecap="round" opacity={0.95}>
      <path d={`M${f1(c[0] - half)} ${f1(c[1])}H${f1(c[0] + half)}`} />
      <path d={`M${f1(c[0] - half)} ${f1(c[1] + dy)}H${f1(c[0] + half)}`} />
    </g>
  );
}

const HELMET = '#f2c230';
/** Baret (başın üstüne) */
function Helmet({ r, c = HELMET }: { r: Rig; c?: string }) {
  const H = 12;
  const p = (x: number, y: number) => headPt(r, x, y);
  const q = (x: number, y: number) => { const v = p(x, y); return `${f1(v[0])} ${f1(v[1])}`; };
  const dome = `M${q(-13, -1)}C${q(-13.5, -17)} ${q(13.5, -17)} ${q(13, -1)}Z`;
  const brim = `M${q(-14, -2.5)}L${q(16.5, -2.5)}L${q(16.5, 0.6)}L${q(-14, 0.6)}Z`;
  void H;
  return <OG ow={1.3} sh={[{ d: dome, f: c }, { d: brim, f: shade(c, 0.12) }, { d: `M${q(0, -13.6)}L${q(0, -2.5)}`, st: shade(c, 0.3), sw: 2 }]} />;
}

/** Kişinin gövdesine sarılı battaniye (mid katmanında) */
function Wrap({ r, c = '#b5646a' }: { r: Rig; c?: string }) {
  const out = (p: P, o: P, k: number) => pol(p, angOf(o, p), k);
  const ctr = lerp(r.hip, r.neck, 0.5);
  const k = 5 * r.s;
  const pts: P[] = [
    out(lerp(r.neck, r.back, 0.3), ctr, k + 3 * r.s), out(r.shoulderF, ctr, k + 2 * r.s), out(r.chest, ctr, k), out(r.belly, ctr, k),
    out(r.hipF, ctr, k + 2 * r.s), out(r.hipB, ctr, k + 3 * r.s), out(r.back, ctr, k + 2 * r.s),
  ];
  return (
    <OG
      sh={[
        { d: smooth(pts, true, 0.8), f: c },
        { d: smooth([lerp(pts[0], pts[1], 0.5), lerp(pts[2], pts[3], 0.5), lerp(pts[4], pts[5], 0.3)], false), st: shade(c, 0.3), sw: 1.4 },
      ]}
    />
  );
}

/** Bardak (şeffaf). x,y = taban ortası */
function Glass({ x, y, s = 1, fill = 0.7, liquid = K.water, a = 0 }: { x: number; y: number; s?: number; fill?: number; liquid?: string; a?: number }) {
  const h = 30, top = 11, bot = 9;
  const ly = -h * fill;
  const wl = bot + (top - bot) * fill;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[
        { d: `M${-top} ${-h}L${top} ${-h}L${bot} 0L${-bot} 0Z`, f: '#e6f3fa', op: 0.95 },
        { d: `M${-wl} ${ly}L${wl} ${ly}L${bot} 0L${-bot} 0Z`, f: liquid, no: true, op: 0.85 },
        { d: `M${-top + 4} ${-h + 4}L${-bot + 3} -4`, st: '#fff', sw: 2 },
      ]} />
    </G>
  );
}
/** İnce belli çay bardağı (tabaklı). x,y = taban ortası */
function TeaGlass({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: ell([0, -2], 16, 4), f: '#f4f1ea' },
        { d: 'M-9 -36C-9 -28 -5 -24 -5 -20C-5 -16 -9 -12 -9 -6Q-9 -3 -6 -3H6Q9 -3 9 -6C9 -12 5 -16 5 -20C5 -24 9 -28 9 -36Z', f: '#b5402a', op: 0.92 },
        { d: 'M-9 -36H9', st: '#fff', sw: 2 },
        { d: 'M-6 -31C-6 -27 -3 -24 -3 -21', st: '#ffffff', sw: 1.6 },
      ]} />
    </G>
  );
}
/** Kahve fincanı. x,y = taban ortası */
function CoffeeCup({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: ell([0, -2], 18, 4), f: '#f4f1ea' },
        { d: capsule([10, -18], 6, [10, -10], 5), f: '#f4f1ea' },
        { d: capsule([10, -18], 2.2, [10, -10], 1.8), f: K.closeup, no: true },
        { d: 'M-12 -26H12L10 -8Q9 -4 5 -4H-5Q-9 -4 -10 -8Z', f: '#f4f1ea' },
        { d: ell([0, -26], 12, 3), f: '#5b3a24' },
      ]} />
      <path d="M-4 -32c-3-4 3-6 0-11M4 -32c-3-4 3-6 0-11" stroke={K.smoke} stroke-width={2} fill="none" stroke-linecap="round" opacity={0.6} />
    </G>
  );
}
/** Kola kutusu. x,y = taban ortası */
function Can({ x, y, s = 1, c = '#d6342e', a = 0 }: { x: number; y: number; s?: number; c?: string; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-10 -36Q-10 -40 -7 -40H7Q10 -40 10 -36V-3Q10 0 7 0H-7Q-10 0 -10 -3Z', f: c },
        { d: rrect(-10, -40, 20, 4, 1.5), f: K.metal },
        { d: rrect(-10, -4, 20, 4, 1.5), f: K.metal },
        { d: 'M-10 -20Q0 -26 10 -18', st: '#fff', sw: 2.4 },
        { d: 'M-6 -33V-8', st: tint(c, 0.4), sw: 2 },
      ]} />
    </G>
  );
}
/** Ay simgesi */
function Moon({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#f4dc6b" stroke={K.out} stroke-width={1.5} />
      <circle cx={x + r * 0.5} cy={y - r * 0.35} r={r * 0.85} fill={K.nightSky} />
    </g>
  );
}
/** Dik dikdörtgen "çerçeve içinde" mini panel arka planı: çadır içi duvarı */
const TENTIN = '#e9c79a';

/** Masada açık defter + üstünde kalem (hafif perspektif). x,y = defter ortası */
function Notebook({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-58 -14L-4 -20L0 24L-62 22Z', f: '#7a5236' },
        { d: 'M58 -14L4 -20L0 24L62 22Z', f: '#7a5236' },
        { d: 'M-54 -16L-2 -21L0 20L-58 18Z', f: '#fbf7ec' },
        { d: 'M54 -16L2 -21L0 20L58 18Z', f: '#f4efe2' },
      ]} />
      <path d="M-46 -8L-10 -12M-47 0L-10 -3M-48 8L-10 5M10 -12L46 -8M10 -3L47 0M10 5L48 8M10 13L36 15" stroke="#9fb4c8" stroke-width={1.3} stroke-linecap="round" />
      <path d="M0 -21V20" stroke={shade('#f4efe2', 0.25)} stroke-width={1.4} />
      {/* kalem */}
      <g transform="rotate(-24 22 2)">
        <OG ow={1.4 / s} sh={[
          { d: rrect(-8, -3, 50, 7, 2), f: '#2f6fd6' },
          { d: 'M-8 -3L-17 0.5L-8 4Z', f: '#f2d9b0' },
          { d: rrect(34, -4, 6, 9, 1.5), f: '#d6d9de' },
        ]} />
        <path d="M-17 0.5L-14 0.5" stroke={K.ink} stroke-width={2} stroke-linecap="round" />
      </g>
    </G>
  );
}
/** Tespih: boncuk dizisi */
function Tespih({ pts, c = '#7b3f2a' }: { pts: P[]; c?: string }) {
  const path = smooth(pts, true, 1);
  const n = 26;
  const beads: P[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const k = t * pts.length;
    const i0 = Math.floor(k) % pts.length, i1 = (i0 + 1) % pts.length;
    beads.push(lerp(pts[i0], pts[i1], k - Math.floor(k)));
  }
  return (
    <g>
      <path d={path} fill="none" stroke={shade(c, 0.3)} stroke-width={1} />
      {beads.map((b, i) => <circle key={i} cx={f1(b[0])} cy={f1(b[1])} r={3} fill={c} stroke={K.out} stroke-width={0.9} />)}
      <path d={`M${f1(pts[0][0])} ${f1(pts[0][1])}l-2 10l-3 6`} stroke={shade(c, 0.2)} stroke-width={3} stroke-linecap="round" fill="none" />
      <circle cx={pts[0][0] - 5} cy={pts[0][1] + 18} r={3} fill="#d9a13a" stroke={K.out} stroke-width={0.9} />
    </g>
  );
}

/** Basit kişi simgesi (çerçeve içi ikonlar için): baş + omuz */
function Bust({ x, y, s = 1, c = K.role.bystander, skin = 1, hair = K.hair.dark }: { x: number; y: number; s?: number; c?: string; skin?: number; hair?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.3 / s} sh={[
        { d: 'M-15 0C-15 -12 -9 -17 0 -17C9 -17 15 -12 15 0Z', f: c },
        { d: circ([0, -25], 8), f: K.skin[skin] },
        { d: 'M-8 -26C-9 -33 -4 -35 0 -35C5 -35 9 -33 8 -26C6 -29 -5 -29 -8 -26Z', f: hair },
      ]} />
    </G>
  );
}

/** Katlanır kamp sandalyesi (yan). x = oturak ortası, y = zemin */
function CampChair({ x, y, s = 1, c = '#3f6f9e' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-18 0L16 -40M18 0L-16 -40" stroke={K.metal} stroke-width={3} stroke-linecap="round" />
      <path d="M-18 0L16 -40M18 0L-16 -40" stroke={K.out} stroke-width={5} stroke-linecap="round" opacity={0.0} />
      <OG ow={1.4 / s} sh={[
        { d: 'M-18 -42Q0 -36 18 -42L16 -36Q0 -30 -16 -36Z', f: c },
        { d: 'M-20 -42L-26 -82L-18 -82L-12 -42Z', f: shade(c, 0.1) },
      ]} />
    </G>
  );
}

/** Akşamüstü / solgun açık hava arka planı katmanı */
const MUTED = { a: '#7f8fa6', b: '#9b8aa8', c: '#8da38a', d: '#b08f7a' };

/* ════════════════════════════ OYUNCULAR (rehber başına sabit) ════════════════════════════ */
type Cast = Omit<PersonProps, 'x' | 'y'>;

/** psikoloji-ilk-yardim: yelekli gönüllü adam + sarsılmış kadın */
const PIY = {
  helper: { who: 'man', role: 'helper', skin: 1, hairC: K.hair.dark } as Cast,
  victim: { who: 'woman', role: 'victim', hair: 'bun', hairC: K.hair.black, skin: 2, bottomC: K.pants.dark } as Cast,
};
/** psikoloji-panik-atak: panik yaşayan kadın + yanında kalan adam */
const PAN = {
  victim: { who: 'woman', role: 'victim', hair: 'long', hairC: K.hair.brown, skin: 1, bottomC: K.pants.dark } as Cast,
  helper: { who: 'man', role: 'helper', skin: 3, hairC: K.hair.black, bottomC: K.pants.denim } as Cast,
};
/** psikoloji-cocukla-konusma: bıyıklı baba + oğlu */
const COC = {
  parent: { who: 'man', role: 'helper', skin: 1, hairC: K.hair.black, mustache: true, bottomC: K.pants.denim } as Cast,
  child: { who: 'boy', role: 'bystander2', skin: 1, hairC: K.hair.dark } as Cast,
};
/** psikoloji-cocuk-stres-belirtileri: anne + üç çocuğu (küçük, okul çağı, ergen) */
const STR = {
  parent: { who: 'woman', role: 'bystander', hair: 'bun', hairC: K.hair.black, skin: 1, bottomC: K.pants.dark } as Cast,
  small: { who: 'boy', role: 'bystander2', skin: 1, hairC: K.hair.black } as Cast,
  school: { who: 'boy', role: 'bystander3', skin: 1, hairC: K.hair.brown } as Cast,
  teen: { who: 'man', role: 'bystander4', top: '#5d6472', skin: 1, hairC: K.hair.dark, bottomC: K.pants.dark } as Cast,
};
/** psikoloji-yas: yas tutan kadın + arkadaşı */
const YAS = {
  griever: { who: 'woman', role: 'bystander', top: MUTED.b, hair: 'bun', hairC: K.hair.dark, skin: 1, bottomC: '#4a4e5c' } as Cast,
  friend: { who: 'man', role: 'helper', top: '#5e8f88', skin: 2, hairC: K.hair.black, bottomC: '#4a4e5c' } as Cast,
};
/** psikoloji-uyku-stres */
const UYK = { p: { who: 'woman', role: 'victim', hair: 'long', hairC: K.hair.dark, skin: 1 } as Cast };
/** psikoloji-gonullu-tukenmislik: baretli yorgun gönüllü + ekip eşi */
const GON = {
  tired: { who: 'man', role: 'helper', skin: 1, hairC: K.hair.dark, bottomC: K.pants.grey } as Cast,
  buddy: { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.black, skin: 2, bottomC: K.pants.grey } as Cast,
};
/** psikoloji-travma-tepkileri: irkilen adam + yakını */
const TRV = {
  victim: { who: 'man', role: 'victim', skin: 2, hairC: K.hair.black } as Cast,
  kin: { who: 'woman', role: 'bystander3', hair: 'scarf', hairC: '#c6574e', skin: 1 } as Cast,
};
/** psikoloji-intihar-dusuncesi: zor durumdaki genç kadın + yanında kalan yaşlı kadın */
const INT = {
  person: { who: 'woman', role: 'victim', top: '#7e86b8', hair: 'long', hairC: K.hair.dark, skin: 1 } as Cast,
  helper: { who: 'oldwoman', role: 'helper', skin: 2 } as Cast,
};

/* ── ortak kurgular (oyuncu alan fabrikalar) ── */

/** Ebeveyn tek dizi üstünde çömelmiş, çocukla göz hizasında, ellerini tutuyor. */
function gozHizasi(parent: Cast, child: Cast, face: PersonProps['face']) {
  const mid: P = [178, 158];
  const dad: PersonProps = {
    ...parent, x: 124, y: 224, s: 1.1,
    pose: { ...POSE.kneelOne, spine: -82, head: -88, armF: { to: mid }, armB: { to: [mid[0] - 2, mid[1] + 4] }, face },
  };
  const kid: PersonProps = { s: 1.02, ...child, x: 222, y: 224, flip: true, pose: { ...POSE.standSide, armF: { to: [mid[0] + 4, mid[1] + 2] }, armB: { to: [mid[0] + 6, mid[1] + 6] }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor">
      <Tent x={60} y={176} s={1} color="#3f8fb8" />
      <Tent x={270} y={170} s={0.75} color="#e0813c" />
      <Person {...kid} />
      <Person {...dad} />
    </Scene2>
  );
}


/** Yakın plan yüz: burundan 5 say al, ağızdan 5 say ver. */
function nefesClose(c: Cast) {
  const p: PersonProps = { ...c, x: 132, y: 116, ax: 'head', ay: 'head', s: 2.9, pose: { ...POSE.standSide, head: -86, face: 'closed' } };
  const r = rig(p);
  const nose = headPt(r, 13.4, 1.6);
  const mouth = headPt(r, 12, 6.6);
  return (
    <Scene2 bg="closeup">
      <Person {...p} only={['torso', 'head', 'armB']} />
      <Arrow from={[nose[0] + 70, nose[1] - 30]} to={[nose[0] + 10, nose[1] - 4]} color={K.water} w={7} />
      <Arrow from={[mouth[0] + 10, mouth[1] + 8]} to={[mouth[0] + 70, mouth[1] + 36]} color={K.waterLight} w={7} />
      <Label x={nose[0] + 92} y={nose[1] - 40} text="5" size={20} bg={K.water} />
      <Label x={mouth[0] + 92} y={mouth[1] + 46} text="5" size={20} bg={K.waterLight} />
    </Scene2>
  );
}

/** El, yıkım görüntüsü olan telefonu kapatıyor; köşede yasaklı haber simgesi. */
function haberKapat(sleeve: string, skin: number) {
  const h = { a: -18, s: 1.5, pose: 'hold' as const, side: 'R' as const, grip: 40, arm: 220, sleeve, skin };
  const c: P = [176, 132];
  const hp = handAt(h, 'grip', c);
  return (
    <Scene2 bg="closeup">
      <Hand {...hp}>
        <G x={c[0]} y={c[1]} a={-18} s={1.5}>
          <OG ow={1} sh={[{ d: rrect(-21, -38, 42, 76, 7), f: '#2f3542' }]} />
          <rect x={-18} y={-33} width={36} height={62} rx={3} fill="#9fb7c9" />
          <path d="M-14 22V-6L-6 -12V-2L2 -8L4 20Z" fill="#c9b9a0" stroke={K.out} stroke-width={0.8} />
          <path d="M4 20L8 2L16 6V22Z" fill="#a8977e" stroke={K.out} stroke-width={0.8} />
          <path d="M-17 29C-10 20 -2 22 4 18C10 22 14 20 18 26V29Z" fill="#8c7c66" />
          <path d="M-10 -1h3M-10 6h3M-3 4h3" stroke={K.out} stroke-width={1.4} />
        </G>
      </Hand>
      <Arrow from={[244, 70]} to={[250, 150]} bend={-0.45} w={6} />
      <g>
        <OG sh={[{ d: rrect(36, 50, 68, 48, 5), f: '#4a5160' }, { d: rrect(42, 56, 56, 34, 2), f: '#bfe3f5' }, { d: 'M58 98L52 108M82 98L88 108', st: K.out, sw: 3 }]} />
        <path d="M48 82H92M48 76H76" stroke={K.red} stroke-width={4} />
        <No x={70} y={76} r={36} />
      </g>
    </Scene2>
  );
}

/** Ayna sandalye (sola bakan oturan için) */
const ChairL = ({ x, y, s }: { x: number; y: number; s: number }) => (
  <g transform={`translate(${f1(2 * x)} 0) scale(-1 1)`}><Chair x={x} y={y} s={s} /></g>
);

/**
 * İki kişi karşılıklı sandalyede oturuyor (yan görünüş). `speaker` konuşur (ağız açık + balon),
 * öbürü öne eğilmiş dinler. Dokunma yok.
 */
function talkSit(left: Cast, right: Cast, speaker: 'left' | 'right', opts: { wall?: string; rightFace?: PersonProps['face']; leftFace?: PersonProps['face'] } = {}) {
  const s = 1.12, gy = 226;
  const lean = { spine: -84, chest: -76, head: -80 };
  const upright = { spine: -92, chest: -90, head: -86 };
  const L0: PersonProps = { ...left, x: 90, y: gy, s, pose: { ...POSE.sitChair, ...(speaker === 'left' ? upright : lean), face: speaker === 'left' ? 'speak' : (opts.leftFace ?? 'neutral') } };
  const R0: PersonProps = { ...right, x: 230, y: gy, s, flip: true, pose: { ...POSE.sitChair, ...(speaker === 'right' ? upright : lean), face: speaker === 'right' ? 'speak' : (opts.rightFace ?? 'neutral') } };
  const lr0 = rig(L0), rr0 = rig(R0);
  const L: PersonProps = { ...L0, pose: { ...L0.pose, armB: { to: [lr0.kneeB[0] - 6, lr0.kneeB[1] - 4] }, armF: { to: [lr0.kneeF[0] - 2, lr0.kneeF[1] - 4] }, handB: 'flat', handF: 'flat' } };
  const R: PersonProps = { ...R0, pose: { ...R0.pose, armB: { to: [rr0.kneeB[0] + 6, rr0.kneeB[1] - 4] }, armF: { to: [rr0.kneeF[0] + 2, rr0.kneeF[1] - 4] }, handB: 'flat', handF: 'flat' } };
  const lr = rig(L), rr = rig(R);
  const sp = speaker === 'left' ? lr : rr;
  const bw = 46, bh = 30;
  const bx = speaker === 'left' ? sp.head[0] + 6 : sp.head[0] - bw - 6;
  const by = sp.top - bh - 16;
  return (
    <Scene2 bg="indoor" wall={opts.wall ?? '#e9e1d2'}>
      <Chair x={lr.hip[0] - 4} y={gy} s={s} />
      <ChairL x={rr.hip[0] + 4} y={gy} s={s} />
      <Person {...L} />
      <Person {...R} />
      <Bubble x={bx} y={by} w={bw} h={bh} tail={[sp.mouth[0] + (speaker === 'left' ? 6 : -6), sp.mouth[1] - 8]}>
        <g fill={K.ink}>{[-9, 0, 9].map((d) => <circle key={d} cx={bx + bw / 2 + d} cy={by + bh / 2} r={2.6} />)}</g>
      </Bubble>
    </Scene2>
  );
}

/** Sağlık çadırı (kırmızı hilalli). x = sol kenar, y = zemin */
function HealthTent({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={2 / s} sh={[
        { d: 'M0 0V-54L18 -76H108L126 -54V0Z', f: '#f4f1ea' },
        { d: 'M108 -76L126 -54V0H108Z', f: shade('#f4f1ea', 0.12), no: true },
        { d: 'M0 -54H126', st: shade('#f4f1ea', 0.25), sw: 2 },
        { d: 'M40 0V-30Q40 -40 54 -40Q68 -40 68 -30V0Z', f: '#5d6472' },
      ]} />
      <Crescent x={54} y={-58} r={9} ring={false} bg="#f4f1ea" />
    </G>
  );
}

/**
 * Sağlık ekibine gitmek: `lead` önde yürür, `sup` arkasından eli onun sırtında; sağda sağlık çadırı.
 * Opsiyonel `over` eklentileri (yelek vb.)
 */
function goHealth(sup: Cast, lead: Cast, opts: { leadFace?: PersonProps['face']; supOver?: (r: Rig) => any; leadOver?: (r: Rig) => any; leadS?: number; leadX?: number; leadBelly?: boolean } = {}) {
  const lead0: PersonProps = { ...lead, x: opts.leadX ?? 140, y: 222, s: opts.leadS ?? 1.08, pose: { ...POSE.walk, face: opts.leadFace ?? 'neutral' } };
  const l0 = rig(lead0);
  const leadP: PersonProps = opts.leadBelly ? { ...lead0, pose: { ...lead0.pose, spine: -82, chest: -76, armF: { at: 'belly', d: [2, -2] }, handF: 'flat' } } : lead0;
  const l = rig(leadP);
  void l0;
  const supP: PersonProps = { ...sup, x: 82, y: 224, s: 1.08, pose: { ...POSE.walk, armF: { to: [l.back[0] + 1, l.back[1] - 4] }, handF: 'flat', face: 'neutral' } };
  return (
    <Scene2 bg="outdoor">
      <Tree x={28} y={192} s={0.8} kind="pine" />
      <HealthTent x={190} y={208} s={1.0} />
      <Person {...supP} only={['legB', 'armB', 'legF', 'torso', 'head']} over={opts.supOver} />
      <Person {...leadP} over={opts.leadOver} />
      <Person {...supP} only={['armF']} />
      <Arrow from={[l.head[0] + 22, 112]} to={[l.head[0] + 66, 112]} w={6} />
    </Scene2>
  );
}

/** Derlenme (yan yatış) pozisyonu: yerde yan yatan, nefes alan kişi. */
function recov(c: Cast, opts: { s?: number; wall?: string } = {}) {
  const p: PersonProps = { ...c, x: 196, y: 222, s: opts.s ?? 1.3, pose: POSE.recovery };
  const r = rig(p);
  return (
    <Scene2 bg="indoor" wall={opts.wall}>
      <Person {...p} over={(rr) => <FlatMouth r={rr} skin={c.skin} />} />
      <Waves x={r.head[0] + 2} y={r.head[1] - 22 * (opts.s ?? 1.3)} a={-90} n={3} r={6} color={K.water} />
    </Scene2>
  );
}

/** Bilinçsiz kişinin ağzını düz çizgi yapar (kitin varsayılan ağzı hafif gülümser). */
function FlatMouth({ r, skin = 1 }: { r: Rig; skin?: number }) {
  const m = r.mouth;
  const a = r.flip ? -(r.headA + 90) : r.headA + 90;
  const k = r.headR / 12;
  return (
    <g transform={`translate(${f1(m[0])} ${f1(m[1])}) rotate(${f1(a)}) scale(${f1(k)})`}>
      <ellipse cx={0} cy={0.4} rx={3.6} ry={2.2} fill={K.skin[skin]} />
      <path d="M-2.2 0.2H2.2" stroke={K.ink} stroke-width={1.3} stroke-linecap="round" />
    </g>
  );
}

/** Kalp masajı (yan görünüş; ornek-kpr kalıbı). */
function kpr(helper: Cast, victim: Cast) {
  const v: PersonProps = { ...victim, x: 146, y: 226, s: 1.15, pose: POSE.lieBack };
  const vr = rig(v);
  const c: P = [vr.chest[0] - 2, vr.chest[1] + 1];
  const resc: PersonProps = {
    ...helper, x: c[0], ax: 'shoulderF', y: 217, s: 1.15, flip: true,
    pose: { spine: -58, chest: -56, head: -30, legB: [70, 178], legF: [66, 176], armB: { to: [c[0] + 1, c[1]] }, armF: { to: c }, handB: { shape: 'flat', a: -95 }, handF: { shape: 'flat', a: -88 }, face: 'neutral' },
  };
  return (
    <Scene2 bg="indoor">
      <Person {...resc} />
      <Person {...v} over={(rr) => <FlatMouth r={rr} skin={victim.skin} />} />
      <Arrow from={[c[0] + 50, 96]} to={[c[0] + 50, 150]} />
      <Label x={262} y={40} text="100–120/dk" size={15} />
    </Scene2>
  );
}

/* ════════════════════════════ PSİKOLOJİ ════════════════════════════ */

function yasBench(friendSpeaks: boolean) {
  const benchY = 176;
  const cry0: PersonProps = { ...YAS.griever, x: 196, y: 222, s: 1.12, pose: { ...POSE.sitChair, spine: -80, chest: -66, head: -46, face: 'closed' } };
  const c0 = rig(cry0);
  const cry: PersonProps = { ...cry0, pose: { ...cry0.pose, armF: { to: [c0.mouth[0] + 2, c0.mouth[1] - 6] }, armB: { to: [c0.kneeB[0] - 6, c0.kneeB[1] - 6] }, handF: 'flat' } };
  const cr = rig(cry);
  const lis: PersonProps = { ...YAS.friend, x: 132, y: 222, s: 1.12, pose: { ...POSE.sitChair, spine: -86, chest: -80, head: friendSpeaks ? -66 : -74, armF: { to: [cr.back[0] - 2, cr.nape[1] + 8] }, handF: 'flat', face: friendSpeaks ? 'speak' : 'neutral' } };
  const lr = rig(lis);
  const eye = headPt(cr, 7, 2);
  return (
    <Scene2 bg="outdoor">
    <rect width={320} height={240} fill="#c9d3dc" opacity={0.35} />
    <Tree x={292} y={192} s={0.95} color="#7f9f74" />
    {/* bank */}
    <OG sh={[
      { d: rrect(84, benchY - 50, 10, 74, 2), f: '#8a6a50' },
      { d: rrect(84, benchY - 46, 160, 9, 2), f: '#9c7a5c' },
      { d: rrect(84, benchY - 30, 160, 9, 2), f: '#9c7a5c' },
      { d: rrect(96, benchY - 4, 8, 46, 2), f: '#6b6f78' },
      { d: rrect(224, benchY - 4, 8, 46, 2), f: '#6b6f78' },
      { d: rrect(84, benchY - 2, 170, 8, 2), f: '#9c7a5c' },
    ]} />
    <Person {...lis} />
    <Person {...cry} />
    {friendSpeaks && (
      <Bubble x={lr.head[0] - 64} y={lr.top - 46} w={46} h={30} tail={[lr.head[0] - 6, lr.top - 4]}>
        <g fill={K.ink}>{[-9, 0, 9].map((d) => <circle key={d} cx={lr.head[0] - 41 + d} cy={lr.top - 31} r={2.6} />)}</g>
      </Bubble>
    )}
    <path d={`M${f1(eye[0] + 1)} ${f1(eye[1] + 2)}c-2 4 -2 6 0 7c2 -1 2 -3 0 -7z`} fill={K.waterLight} stroke={K.out} stroke-width={0.8} />
    </Scene2>
  );
  }

const PSI: Record<string, ArtFn> = {
  'psikoloji-bak': () => {
    const vol: PersonProps = { ...PIY.helper, x: 70, y: 230, s: 1.08, pose: { ...POSE.stand, armB: [96, 92], armF: [84, 88], face: 'neutral' } };
    const v = rig(vol);
    const sit: PersonProps = {
      ...PIY.victim, x: 196, y: 198, s: 0.78,
      pose: { spine: -66, chest: -40, head: 8, legB: [-48, 74], legF: [-40, 80], footB: 0, footF: 0, face: 'closed' },
    };
    const sr = rig(sit);
    const sit2: PersonProps = { ...sit, pose: { ...sit.pose, armB: { to: headPt(sr, 2, 6) }, armF: { to: headPt(sr, 6, 2) }, handB: 'flat', handF: 'flat' } };
    const kid: PersonProps = { x: 276, y: 202, s: 0.82, who: 'girl', role: 'bystander2', skin: 0, pose: { ...POSE.stand, armB: [94, 90], armF: [86, 90], face: 'worried' } };
    const eye = headPt(v, 4, 0);
    return (
      <Scene2 bg="outdoor">
        <Tent x={250} y={166} s={0.7} color="#3f8fb8" />
        <Tree x={20} y={190} s={0.8} kind="pine" />
        <Person {...sit2} />
        <Person {...kid} />
        <Person {...vol} over={(r) => <g><VestStripes r={r} front /></g>} />
        <DashArrow from={[eye[0] + 18, eye[1] - 4]} to={[sr.head[0] - 18, sr.head[1] - 8]} bend={0.12} />
        <DashArrow from={[eye[0] + 20, eye[1] - 18]} to={[rig(kid).head[0] - 16, rig(kid).head[1] - 22]} bend={0.18} />
      </Scene2>
    );
  },

  'psikoloji-dinle': () => {
    const vic: PersonProps = {
      ...PIY.victim, x: 108, y: 224, s: 1.12,
      pose: { spine: -84, chest: -78, head: -84, legB: [-8, 92], legF: [-4, 88], footB: 0, footF: 0, armB: { at: 'chest', d: [-2, 6] }, armF: { at: 'chest', d: [-4, 2] }, face: 'worried' },
    };
    const vr = rig(vic);
    const box = <OG sh={[{ d: rrect(vr.hip[0] - 34, 224 - 48 * 1.12 + 14, 52, 48 * 1.12 - 14, 3), f: '#9c7650' }, { d: `M${vr.hip[0] - 30} ${224 - 30}H${vr.hip[0] + 14}`, st: shade('#9c7650', 0.3), sw: 1.4 }]} />;
    const give: P = [vr.chest[0] + 34, vr.chest[1] + 8];
    const vol: PersonProps = {
      ...PIY.helper, x: 236, y: 226, s: 1.12, flip: true,
      pose: { ...POSE.crouch, spine: -66, chest: -74, head: -66, armF: { to: give }, armB: [100, 60], handF: 'fist', face: 'neutral' },
    };
    const wr = rig(vol);
    return (
      <Scene2 bg="outdoor" wall={undefined}>
        <Tent x={270} y={170} s={0.8} color="#3f8fb8" />
        {box}
        <Person {...vic} mid={(r) => <Wrap r={r} c="#a35e64" />} />
        <Bottle x={wr.handF[0] - 3} y={wr.handF[1] + 14} s={1.05} a={-12} fill={0.75} />
        <Person {...vol} over={(r) => <VestStripes r={r} />} />
      </Scene2>
    );
  },

  'psikoloji-baglanti': () => {
    const wom: PersonProps = { ...PIY.victim, x: 100, y: 230, s: 1.0, pose: { ...POSE.walk, face: 'neutral' } };
    const w = rig(wom);
    const vol: PersonProps = { ...PIY.helper, x: 48, y: 228, s: 1.0, pose: { ...POSE.walk, armF: { to: lerp(w.back, w.hip, 0.35) }, handF: 'flat', face: 'neutral' } };
    const o: P = [w.head[0] + 26, w.head[1] + 14];
    return (
      <Scene2 bg="outdoor">
        {/* şarj noktası */}
        <g>
          <OG sh={[{ d: rrect(168, 122, 34, 50, 5), f: '#4a5160' }, { d: rrect(174, 129, 22, 18, 2), f: '#9be27a' }, { d: rrect(181, 172, 8, 22, 1), f: K.metal }]} />
          <path d="M188 131L181 139H186L182 145L191 136H185Z" fill="#2b2d3a" />
          <path d="M175 158h6M189 158h6" stroke="#cfd5dd" stroke-width={3} stroke-linecap="round" />
        </g>
        {/* su noktası */}
        <g>
          <OG sh={[{ d: rrect(218, 98, 44, 40, 6), f: '#4f8fd0' }, { d: rrect(224, 138, 6, 52, 1), f: K.metal }, { d: rrect(250, 138, 6, 52, 1), f: K.metal }, { d: rrect(235, 134, 10, 10, 2), f: K.metal }]} />
          <path d="M240 146V154" stroke={K.water} stroke-width={3} />
          <path d="M240 104C244 110 247 113 247 117A7 7 0 0 1 233 117C233 113 236 110 240 104Z" fill="#fff" />
        </g>
        {/* sağlık çadırı */}
        <g>
          <Tent x={284} y={204} s={0.72} color="#f4f1ea" />
          <Crescent x={282} y={181} r={6.5} ring={false} bg="#f4f1ea" />
        </g>
        <Person {...vol} only={['legB', 'armB', 'legF', 'torso', 'head']} over={(r) => <VestStripes r={r} />} />
        <Person {...wom} />
        <Person {...vol} only={['armF']} />
        <Arrow from={o} to={[162, 140]} bend={-0.05} w={5} />
        <Arrow from={[o[0] + 2, o[1] - 8]} to={[212, 108]} bend={0.12} w={5} />
        <Arrow from={[o[0] + 4, o[1] + 8]} to={[262, 186]} bend={-0.12} w={5} />
      </Scene2>
    );
  },

  'psikoloji-nefes': () => nefesClose(PAN.victim),
  'psikoloji-piy-nefes': () => nefesClose(PIY.victim),
  'psikoloji-uyku-nefes': () => nefesClose(UYK.p),

  'psikoloji-oturma': () => {
    const base: PersonProps = {
      ...PAN.victim, x: 116, y: 226, s: 1.5,
      pose: { spine: -76, chest: -80, head: -84, legB: [-44, 70], legF: [-30, 84], footB: 0, footF: 0, face: 'worried' },
    };
    const r0 = rig(base);
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [r0.chest[0] - 3, r0.chest[1] + 2] }, handF: 'flat', armB: { to: [r0.kneeB[0] - 2, r0.kneeB[1] - 4] } } };
    return (
      <Scene2 bg="indoor" wall="#e4dccb">
        <OG sh={[{ d: rrect(r0.back[0] - 54, 54, 52, 156, 2), f: '#d4c6ae' }, { d: rrect(r0.back[0] - 8, 54, 6, 156, 1), f: shade('#d4c6ae', 0.15), no: true }]} />
        <Window x={210} y={60} w={74} h={62} />
        <Person {...p} />
      </Scene2>
    );
  },

  'psikoloji-ayak-yere': () => {
    // Sandalyede dik oturan kişi (baş kadrajın içinde): iki ayağı düz, tabanları yerde; elleri dizlerinde.
    // Ayakların altında yere doğru turuncu oklar.
    const s = 1.32, gy = 214;
    const p: PersonProps = {
      ...PAN.victim, x: 142, y: gy, s,
      pose: { ...POSE.sitChair, spine: -92, head: -88, legB: [4, 92], legF: [0, 90], footB: 0, footF: 0, face: 'neutral' },
    };
    const r0 = rig(p);
    const p2: PersonProps = { ...p, pose: { ...p.pose, armB: { to: [r0.kneeB[0] - 8, r0.kneeB[1] - 12] }, armF: { to: [r0.kneeF[0] - 4, r0.kneeF[1] - 12] }, handB: 'flat', handF: 'flat' } };
    const r = rig(p2);
    const fx = (r.ankleF[0] + r.toeF[0]) / 2;
    return (
      <Scene2 bg="indoor" gy={168}>
        <Chair x={r.hip[0] - 8} y={gy} seat={gy - r.hip[1] - 6} s={1.25} />
        <Person {...p2} />
        <Arrow from={[fx - 26, gy - 2]} to={[fx - 26, gy + 22]} w={6} />
        <Arrow from={[fx + 12, gy - 2]} to={[fx + 12, gy + 22]} w={6} />
      </Scene2>
    );
  },

  'psikoloji-panik-yaninda': () => talkSit(PAN.helper, PAN.victim, 'left', { rightFace: 'worried' }),

  'psikoloji-cocuk-goz-hizasi': () => gozHizasi(COC.parent, { ...COC.child, s: 1.02 }, 'calm'),
  'psikoloji-stres-okul-konusma': () => gozHizasi(STR.parent, { ...STR.school, s: 1.08 }, 'calm'),

  'psikoloji-cocuk-sarilma': () => {
    const mom0: PersonProps = { ...COC.parent, x: 132, y: 226, s: 1.18, pose: { ...POSE.kneel, spine: -86, head: -72, face: 'closed' } };
    const m0 = rig(mom0);
    const kid: PersonProps = {
      ...COC.child, x: m0.chest[0] + 34, y: 228, s: 1.02, flip: true,
      pose: { spine: -80, chest: -74, head: -58, legB: [96, 92], legF: [84, 88], armF: { to: [m0.nape[0] - 2, m0.nape[1] + 4] }, armB: { to: [m0.back[0] + 2, m0.back[1] - 10] }, face: 'closed' },
    };
    const k = rig(kid);
    const mom: PersonProps = { ...mom0, pose: { ...mom0.pose, armF: { to: [k.back[0] - 2, k.back[1] + 2] }, armB: { to: [k.back[0] - 4, k.back[1] - 10] }, handF: 'flat', handB: 'flat' } };
    return (
      <Scene2 bg="outdoor">
        <Tent x={46} y={176} s={0.9} color="#3f8fb8" />
        <Tent x={290} y={172} s={0.7} color="#e0813c" />
        <Person {...kid} only={['armB']} />
        <Person {...mom} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...kid} only={['legB', 'legF', 'torso', 'head', 'armF']} />
        <Person {...mom} only={['armF']} />
      </Scene2>
    );
  },

  'psikoloji-cocuk-resim': () => {
    // Yukarıdan bakış: çadır zemini, kâğıt; çocuk altta, yetişkin sağda bağdaş kurmuş.
    const top = (cx: number, cy: number, a: number, s: number, shirt: string, pants: string, hair: string, skin: number, armR?: P) => {
      const sk = K.skin[skin];
      const ar: P = armR ?? [15, -30];
      return (
        <G x={cx} y={cy} a={a} s={s}>
          <OG ow={1.5 / s} sh={[
            { d: ell([0, -22], 30, 13), f: pants },
            { d: ell([-13, -30], 7, 5), f: K.shoe },
            { d: ell([13, -30], 7, 5), f: K.shoe },
            { d: capsule([-24, 2], 6, [-14, -24], 4.6), f: shirt },
            { d: circ([-14, -26], 4.6), f: sk },
            { d: capsule([24, 2], 6, ar, 4.6), f: shirt },
            { d: circ(ar, 4.6), f: sk },
            { d: ell([0, 4], 26, 12), f: shirt },
            { d: circ([0, 0], 11), f: sk },
            { d: 'M-11 1C-11.5 -8 -6 -11 0 -11C6 -11 11.5 -8 11 1C11 7 7 11 0 11.5C-7 11 -11 7 -11 1Z', f: hair },
          ]} />
        </G>
      );
    };
    const crayon = (x: number, y: number, a: number, c: string) => (
      <G x={x} y={y} a={a}>
        <OG sh={[{ d: rrect(-3, -16, 6, 26, 1.5), f: c }, { d: 'M-3 -16L0 -22L3 -16Z', f: shade(c, 0.2) }]} />
      </G>
    );
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill="#6f9a74" />
        <path d="M0 0L60 40H260L320 0ZM0 240L60 200H260L320 240Z" fill={shade('#6f9a74', 0.08)} />
        <path d="M60 40V200M260 40V200" stroke={shade('#6f9a74', 0.2)} stroke-width={2} />
        {/* kâğıt + resim */}
        <OG sh={[{ d: rrect(96, 40, 128, 96, 2), f: '#fbfaf7' }]} />
        <g stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width={3}>
          <path d="M112 112V86L136 66L160 86V112Z" stroke="#d6342e" />
          <path d="M129 112V96H143V112" stroke="#8a5a32" />
          <circle cx={200} cy={60} r={9} stroke="#f2b632" />
          <path d="M178 96a4 4 0 1 1 0.1 0M178 100V114M172 105H184M178 114l-5 9M178 114l5 9" stroke="#3a7bd5" />
          <path d="M200 100a3 3 0 1 1 0.1 0M200 103V114M195 108H205M200 114l-4 8M200 114l4 8" stroke="#e05a9a" />
          <path d="M104 126H216" stroke="#5aa84f" />
        </g>
        {crayon(76, 82, 30, '#3a7bd5')}
        {crayon(72, 120, -20, '#f2b632')}
        {crayon(244, 52, 60, '#5aa84f')}
        {/* çocuk (altta, yukarıya / kâğıda bakıyor), sağ eli kâğıtta */}
        {top(150, 192, 0, 1.15, K.role.bystander2, K.pants.navy, K.hair.dark, 1, [6, -58])}
        {crayon(158, 124, 25, '#d6342e')}
        {/* yetişkin (sağda, sola / resme bakıyor) */}
        {top(266, 102, -90, 1.3, K.role.helper, K.pants.denim, K.hair.black, 1)}
      </Scene2>
    );
  },

  'psikoloji-haber-kapat': () => haberKapat(K.role.victim, UYK.p.skin ?? 1),
  'psikoloji-cocuk-haber': () => haberKapat(K.role.helper, COC.parent.skin ?? 1),
  'psikoloji-travma-haber': () => haberKapat(K.role.victim, TRV.victim.skin ?? 1),

  'psikoloji-cocuk-yapisma': () => {
    const mom: PersonProps = { ...STR.parent, x: 150, y: 228, s: 1.25, pose: { view: 'front', spine: -94, head: -104, armB: [100, 94], legB: [94, 90], legF: [86, 90], face: 'neutral' } };
    const m = rig(mom);
    const kid: PersonProps = {
      ...STR.small, x: m.kneeF[0] + 22, y: 228, s: 0.82, flip: true,
      pose: { spine: -86, chest: -84, head: -76, legB: [96, 92], legF: [84, 88], armF: { to: [m.kneeF[0] - 8, m.kneeF[1] - 4] }, armB: { to: [m.kneeF[0] - 4, m.kneeF[1] - 14] }, face: 'worried' },
    };
    const k = rig(kid);
    const mom2: PersonProps = { ...mom, pose: { ...mom.pose, armF: { to: [k.head[0] + 1, k.head[1] - k.headR * 0.8] }, handF: 'flat' } };
    return (
      <Scene2 bg="outdoor">
        <Tent x={56} y={178} s={0.95} color="#3f8fb8" />
        <Tree x={286} y={190} s={0.85} />
        <Person {...mom2} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...kid} />
        <Person {...mom2} only={['armF']} />
      </Scene2>
    );
  },

  'psikoloji-cocuk-karin-agrisi': () => {
    // Çocuk minderde, bacakları önde uzanmış oturuyor; hafif öne kapanmış, iki eli KARNINDA, yüzü üzgün.
    // Ağrı çizgileri karnın önünde (dizlerin yanında değil). Anne yanında diz çökmüş, eli sırtında.
    const base: PersonProps = {
      ...STR.school, x: 170, y: 220, s: 1.6,
      pose: { spine: -86, chest: -80, head: -74, legB: [2, 4], legF: [-2, 2], footB: -80, footF: -80, face: 'worried' },
    };
    const r0 = rig(base);
    const bel: P = [r0.belly[0] - 2, r0.belly[1] - 1];
    const kid: PersonProps = { ...base, pose: { ...base.pose, armF: { to: bel }, armB: { to: [bel[0] - 1, bel[1] - 7] }, handF: 'flat', handB: 'flat' } };
    const momB: PersonProps = { ...STR.parent, x: 98, y: 228, s: 1.3, pose: { ...POSE.kneelSit, spine: -80, head: -72, armB: [80, 30], face: 'neutral' } };
    const mom: PersonProps = { ...momB, pose: { ...momB.pose, armF: { to: [r0.back[0] - 3, r0.back[1] + 2] }, handF: { shape: 'flat', a: 30 } } };
    const b = rig(kid).belly;
    const c: P = [b[0] + 2, b[1] - 3];
    return (
      <Scene2 bg="indoor" wall={TENTIN}>
        <path d="M0 0L160 0L0 120Z" fill={shade(TENTIN, 0.06)} />
        <path d="M320 0L160 0L320 120Z" fill={shade(TENTIN, 0.06)} />
        <OG sh={[{ d: rrect(112, 208, 190, 16, 6), f: '#c0603e' }, { d: `M118 216H296`, st: shade('#c0603e', 0.3), sw: 1.2 }]} />
        <Person {...mom} />
        <Person {...kid} />
        {/* karın ağrısı: karnın önünde kırmızı ışınlar */}
        <g stroke={K.danger} stroke-width={2.6} stroke-linecap="round">
          {[-62, -32, -2].map((a) => {
            const cs = Math.cos(a * RAD), sn = Math.sin(a * RAD);
            return <path d={`M${f1(c[0] + cs * 16)} ${f1(c[1] + sn * 16)}L${f1(c[0] + cs * 27)} ${f1(c[1] + sn * 27)}`} />;
          })}
        </g>
      </Scene2>
    );
  },

  'psikoloji-genc-icine-kapanma': () => {
    const teen0: PersonProps = {
      ...STR.teen, x: 246, y: 214, s: 1.02, flip: true,
      pose: { spine: -72, chest: -58, head: -40, legB: [-58, 88], legF: [-50, 96], footB: 0, footF: 0, face: 'neutral' },
    };
    const t0 = rig(teen0);
    const teen: PersonProps = { ...teen0, pose: { ...teen0.pose, armF: { to: [t0.kneeF[0] + 6, t0.kneeF[1] + 10] }, armB: { to: [t0.kneeB[0] + 8, t0.kneeB[1] + 4] } } };
    const hood = (r: Rig) => {
      const q = (x: number, y: number) => { const v = headPt(r, x, y); return `${f1(v[0])} ${f1(v[1])}`; };
      return <OG sh={[{ d: `M${q(9, -13)}C${q(-4, -20)} ${q(-18, -12)} ${q(-17, 2)}C${q(-17, 12)} ${q(-10, 18)} ${q(-2, 18)}L${q(-4, 6)}C${q(-12, 2)} ${q(-10, -8)} ${q(10, -9)}Z`, f: shade('#5d6472', 0.05) }]} />;
    };
    const dad: PersonProps = { ...STR.parent, x: 128, y: 220, s: 1.05, pose: { spine: -86, chest: -82, head: -80, legB: [-20, 80], legF: [-10, 86], footB: 0, footF: 0, armB: [70, 20], armF: [60, 10], face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall={TENTIN}>
        <path d="M0 0L160 0L0 120Z" fill={shade(TENTIN, 0.06)} />
        <path d="M320 0L160 0L320 120Z" fill={shade(TENTIN, 0.06)} />
        <Person {...dad} />
        <Person {...teen} over={hood} />
      </Scene2>
    );
  },

  'psikoloji-yas-konusma': () => yasBench(false),
  'psikoloji-yas-basin-sagolsun': () => yasBench(true),
  'psikoloji-yas-destek': () => goHealth(YAS.friend, YAS.griever),

  'psikoloji-yas-anma': () => {
    const h = { a: 8, s: 1.25, pose: 'hold' as const, side: 'R' as const, grip: 66, arm: 200, sleeve: MUTED.b, skin: YAS.griever.skin ?? 1 };
    const c: P = [128, 116];
    const hp = handAt(h, 'grip', c);
    return (
      <Scene2 bg="closeup">
        <rect y={186} width={320} height={54} fill="#b8946e" />
        <rect y={186} width={320} height={3} fill={shade('#b8946e', 0.2)} />
        <Notebook x={248} y={204} />
        <Tespih pts={[[196, 214], [214, 206], [226, 216], [216, 230], [194, 232], [184, 222]]} />
        <Hand {...hp}>
          <G x={c[0]} y={c[1]} a={8}>
            <OG sh={[{ d: rrect(-56, -46, 112, 88, 4), f: '#8a5a32' }, { d: rrect(-46, -36, 92, 68, 2), f: '#e9e2d0', ln: true }]} />
            <rect x={-46} y={-36} width={92} height={68} fill="#cfe0c8" />
            <Bust x={-24} y={32} s={1.05} c="#5b7fae" skin={1} />
            <Bust x={4} y={32} s={1.0} c="#b0607a" skin={1} hair={K.hair.brown} />
            <Bust x={26} y={32} s={0.7} c="#e0a33a" skin={1} hair={K.hair.black} />
            <rect x={-46} y={-36} width={92} height={68} fill="none" stroke={K.out} stroke-width={1.5} />
          </G>
        </Hand>
      </Scene2>
    );
  },

  'psikoloji-yas-yemek': () => {
    const potP: P = [138, 140];
    const nb: PersonProps = { ...YAS.friend, x: 118, y: 230, s: 1.18, pose: { ...POSE.stand, armB: { to: [potP[0] - 22, potP[1] - 10], bend: 1 }, armF: { to: [potP[0] + 22, potP[1] - 10], bend: -1 }, face: 'neutral' } };
    const flapEdge: P = [268, 150];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[
          { d: 'M190 212L254 56L318 212Z', f: '#6a8fb8' },
          { d: 'M222 212L254 116L286 212Z', f: '#2c3242' },
        ]} />
        <Person {...YAS.griever} x={250} y={214} s={0.86} pose={{ view: 'front', armB: [100, 94], armF: { to: flapEdge }, legB: [92, 90], legF: [88, 90], face: 'worried' }} />
        {/* aralanmış kapı kanadı */}
        <OG sh={[{ d: `M254 116L${flapEdge[0] + 4} ${flapEdge[1] - 10}L300 212H284Z`, f: tint('#6a8fb8', 0.12) }]} />
        <Person {...YAS.griever} x={250} y={214} s={0.86} pose={{ view: 'front', armB: [100, 94], armF: { to: flapEdge }, legB: [92, 90], legF: [88, 90], face: 'worried' }} only={['armF']} />
        <Tree x={30} y={190} s={0.8} kind="pine" />
        <Person {...nb} />
        <Pot x={potP[0]} y={potP[1] + 14} s={1.1} boil={false} color="#c0603e" />
        <path d={`M${potP[0] - 8} ${potP[1] - 22}c-4-5 4-8 0-14M${potP[0] + 6} ${potP[1] - 24}c-4-5 4-8 0-14`} stroke="#fff" stroke-width={2.4} fill="none" stroke-linecap="round" opacity={0.9} />
      </Scene2>
    );
  },

  'psikoloji-kafein-yok': () => (
    <Scene2 bg="closeup">
      <rect y={176} width={320} height={64} fill="#c8a882" />
      <rect y={176} width={320} height={3} fill={shade('#c8a882', 0.2)} />
      <g>
        <circle cx={40} cy={44} r={24} fill={K.nightSky} />
        <Moon x={40} y={44} r={14} />
      </g>
      <TeaGlass x={54} y={190} s={1.3} />
      <CoffeeCup x={118} y={190} s={1.3} />
      <Can x={180} y={190} s={1.3} />
      <No x={54} y={150} r={30} />
      <No x={118} y={152} r={30} />
      <No x={180} y={150} r={30} />
      <Glass x={262} y={190} s={1.6} fill={0.75} />
      <Ok x={284} y={110} r={14} />
    </Scene2>
  ),

  'psikoloji-goz-bandi': () => {
    const p: PersonProps = { ...UYK.p, x: 186, y: 206, s: 1.75, pose: { ...POSE.lieBack, head: 182 } };
    const r = rig(p);
    const q = (x: number, y: number) => { const v = headPt(r, x, y); return `${f1(v[0])} ${f1(v[1])}`; };
    const mask = (
      <g>
        <path d={`M${q(9, -1)}L${q(-11, -4)}`} stroke="#3b3f58" stroke-width={3.4} />
        <OG sh={[{ d: `M${q(3, -5)}C${q(10, -6.5)} ${q(13.5, -3)} ${q(12.8, 1)}C${q(10, 3.2)} ${q(6, 2.8)} ${q(3.2, 1.8)}Z`, f: '#6a5ea8' }]} />
        <OG sh={[{ d: circ(headPt(r, -1.4, 1.2), 2.6 * r.headR / 12), f: '#f2c14e' }]} />
      </g>
    );
    const sh = r.shoulderF;
    return (
      <Scene2 bg="indoor" wall="#3a4058" gy={176}>
        <path d="M0 0L160 0L0 150Z" fill="#323850" />
        <path d="M320 0L160 0L320 150Z" fill="#323850" />
        <rect y={176} width={320} height={64} fill="#4d5468" />
        {/* arkadaki uyuyanlar */}
        <OG sh={[{ d: rrect(14, 150, 110, 24, 11), f: '#6a7a5a' }, { d: circ([26, 156], 10), f: K.skin[2] }, { d: rrect(196, 146, 110, 24, 11), f: '#7a5a6a' }, { d: circ([294, 152], 10), f: K.skin[0] }]} />
        <path d="M20 150q5-7 12-2M288 146q5-7 12-2" stroke={K.hair.black} stroke-width={5} fill="none" stroke-linecap="round" />
        {/* yastık + uyku tulumu */}
        <OG sh={[{ d: rrect(r.head[0] - 30, r.head[1] + 6, 58, 18, 8), f: '#e9e4d8' }, { d: rrect(sh[0] - 18, 196, 330 - sh[0], 34, 16), f: '#3f7f6a' }]} />
        <Person {...p} only={['head', 'torso', 'armB']} over={() => mask} />
        {/* kalın battaniye */}
        <OG sh={[{ d: `M${f1(sh[0] + 4)} 188Q${f1(sh[0] + 90)} 172 330 184V224Q200 232 ${f1(sh[0])} 224Z`, f: '#b5646a' }, { d: `M${f1(sh[0] + 24)} 196Q${f1(sh[0] + 100)} 186 320 194`, st: shade('#b5646a', 0.3), sw: 1.6 }]} />
        <text x={150} y={110} font-size={24} font-weight={700} fill="#c9d2f0" opacity={0.85} font-family="'IBM Plex Sans', system-ui, sans-serif">z</text>
        <text x={168} y={90} font-size={17} font-weight={700} fill="#c9d2f0" opacity={0.7} font-family="'IBM Plex Sans', system-ui, sans-serif">z</text>
      </Scene2>
    );
  },

  'psikoloji-gonullu-yorgun': () => {
    const G0 = 228;
    const s = 1.22;
    const hipY = G0 - 64;
    const p0: PersonProps = { ...GON.tired, x: 160, y: hipY, ay: 'hip', s, pose: { view: 'front', spine: -90, head: -90, face: 'closed' } };
    const r0 = rig(p0);
    const legs = { legB: { to: [r0.hipB[0] - 12, G0 - 7] as P, bend: 1 as const }, legF: { to: [r0.hipF[0] + 12, G0 - 7] as P, bend: -1 as const } };
    const r1 = rig({ ...p0, pose: { ...p0.pose, ...legs } });
    const p: PersonProps = { ...p0, pose: { ...p0.pose, ...legs, armB: { to: [r1.kneeB[0] + 10, r1.kneeB[1] + 12] }, armF: { to: [r1.kneeF[0] - 10, r1.kneeF[1] + 12] } } };
    const r = rig(p);
    const dirt = (
      <g fill="#6b5640" opacity={0.55}>
        <ellipse cx={r.hip[0] - 8} cy={r.hip[1] - 30} rx={5} ry={3} />
        <ellipse cx={r.hip[0] + 10} cy={r.hip[1] - 14} rx={4} ry={2.6} />
        <ellipse cx={r.hip[0] + 4} cy={r.hip[1] - 50} rx={3.5} ry={2.2} />
        <ellipse cx={r.kneeB[0] + 2} cy={r.kneeB[1] + 10} rx={4} ry={2.4} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <OG sh={[{ d: 'M8 200L14 150L40 136L58 160L52 200Z', f: '#b9a690' }, { d: 'M262 200L270 164L300 156L318 176V200Z', f: '#b9a690' }]} />
        <ellipse cx={160} cy={G0} rx={70} ry={5} fill="#000" opacity={0.13} />
        <OG sh={[{ d: `M104 ${G0}L110 ${hipY + 4}Q160 ${hipY - 8} 210 ${hipY + 2}L218 ${G0}Z`, f: K.rock }, { d: `M180 ${hipY}Q200 ${hipY} 210 ${hipY + 2}L218 ${G0}H186Z`, f: shade(K.rock, 0.15), no: true }]} />
        <Person {...p} shadow={false} over={(rr) => <g><VestStripes r={rr} front />{dirt}<HelmetFront r={rr} /></g>} />
        <Bottle x={258} y={G0} s={1.35} fill={1} />
      </Scene2>
    );
  },

  'psikoloji-gonullu-mola': () => {
    const b1: PersonProps = { ...GON.tired, x: 104, y: 224, s: 1.08, pose: { ...POSE.sitChair, head: -98, face: 'calm' } };
    const m1 = rig(b1).mouth;
    const v1: PersonProps = { ...b1, pose: { ...b1.pose, armF: { to: [m1[0] + 10, m1[1] + 4] }, handF: 'fist', armB: [80, 10] } };
    const r1 = rig(v1);
    const b2: PersonProps = { ...GON.buddy, x: 214, y: 224, s: 1.08, flip: true, pose: { ...POSE.sitChair, face: 'calm' } };
    const m2 = rig(b2).mouth;
    const v2: PersonProps = { ...b2, pose: { ...b2.pose, armF: { to: [m2[0] - 12, m2[1] + 6] }, handF: 'fist' } };
    const r2 = rig(v2);
    return (
      <Scene2 bg="outdoor">
        <Tree x={160} y={196} s={1.75} />
        <ellipse cx={160} cy={226} rx={130} ry={10} fill="#000" opacity={0.12} />
        <CampChair x={r1.hip[0] - 4} y={226} s={1.08} />
        <g transform={`translate(${2 * (r2.hip[0] + 4)} 0) scale(-1 1)`}><CampChair x={r2.hip[0] + 4} y={226} s={1.08} c="#7a5aa8" /></g>
        <Person {...v1} only={['legB', 'legF', 'torso', 'head', 'armB']} over={(r) => <VestStripes r={r} />} />
        <Bottle x={r1.handF[0] + 10} y={r1.handF[1] + 14} s={0.95} a={-112} fill={0.6} />
        <Person {...v1} only={['armF']} />
        <Person {...v2} over={(r) => <VestStripes r={r} />} />
        <G x={r2.handF[0] - 8} y={r2.handF[1] - 4} a={20}>
          <OG sh={[{ d: 'M-12 -6L12 -6L10 4L-10 4Z', f: '#e6c38a' }, { d: 'M-12 -2H12', st: '#5aa84f', sw: 2.4 }, { d: 'M-12 1H12', st: '#d6342e', sw: 1.6 }]} />
        </G>
        <OG sh={[{ d: 'M146 226C146 212 170 212 170 226Z', f: HELMET }, { d: rrect(142, 224, 32, 4, 1.5), f: shade(HELMET, 0.12) }]} />
        <OG sh={[{ d: 'M176 226C176 214 196 214 196 226Z', f: '#f4f1ea' }, { d: rrect(172, 224, 28, 4, 1.5), f: shade('#f4f1ea', 0.12) }]} />
        <Timer x={284} y={40} r={16} />
      </Scene2>
    );
  },

  'psikoloji-gonullu-es': () => {
    const tired: PersonProps = { ...GON.tired, x: 92, y: 230, s: 1.12, pose: { ...POSE.stand, spine: -92, head: -98, face: 'worried' } };
    const t = rig(tired);
    const help: PersonProps = { ...GON.buddy, x: 156, y: 230, s: 1.12, pose: { ...POSE.stand, armB: { to: [t.shoulderF[0] + 4, t.shoulderF[1] + 4], bend: -1 }, handB: 'flat', armF: [-12, -14], handF: 'flat', face: 'neutral' } };
    const h = rig(help);
    return (
      <Scene2 bg="outdoor">
        {/* mola alanı: gölgelik + sandalye + su */}
        <g>
          <path d="M232 112V206M308 112V206" stroke={K.out} stroke-width={4} />
          <path d="M232 112V206M308 112V206" stroke={K.metal} stroke-width={2} />
          <OG sh={[{ d: 'M224 114L270 92L316 114Z', f: '#3f8fb8' }, { d: 'M224 114Q235 122 247 114Q259 122 270 114Q282 122 293 114Q305 122 316 114Z', f: shade('#3f8fb8', 0.15) }]} />
          <CampChair x={258} y={206} s={0.7} />
          <Bottle x={288} y={206} s={0.8} fill={0.8} />
          <Bottle x={298} y={206} s={0.8} fill={0.8} />
        </g>
        <Person {...tired} over={(r) => <g><VestStripes r={r} front /><HelmetFront r={r} /></g>} />
        <Person {...help} over={(r) => <VestStripes r={r} front />} />
        <Arrow from={[h.handF[0] + 10, h.handF[1] + 10]} to={[244, 148]} bend={-0.15} />
      </Scene2>
    );
  },

  'psikoloji-irkilme': () => {
    const st0: PersonProps = { ...TRV.victim, x: 150, y: 224, s: 1.1, pose: { ...POSE.sitChair, spine: -96, chest: -100, head: -96, face: 'worried' } };
    const r0 = rig(st0);
    const st: PersonProps = { ...st0, pose: { ...st0.pose, armF: { to: [r0.chest[0] + 6, r0.chest[1] - 6] }, armB: { to: [r0.chest[0] + 2, r0.chest[1] - 12] }, handF: 'flat', handB: 'flat' } };
    const r = rig(st);
    const calm: PersonProps = { ...TRV.kin, x: 62, y: 224, s: 1.06, pose: { ...POSE.sitChair, head: -92, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Door x={240} y={202} w={60} h={124} />
        <Waves x={236} y={120} a={180} n={3} r={9} w={3} />
        <Shake x1={232} x2={306} y={150} h={30} />
        <Chair x={rig(calm).hip[0] - 4} y={226} s={1.06} />
        <Person {...calm} />
        <Chair x={r.hip[0] - 4} y={226} s={1.1} />
        <Person {...st} />
        <g stroke={K.ink} stroke-width={2.2} stroke-linecap="round" opacity={0.7}>
          <path d={`M${f1(r.head[0] - 6)} ${f1(r.top - 4)}l-4 -8M${f1(r.head[0] + 4)} ${f1(r.top - 6)}l0 -9M${f1(r.head[0] + 14)} ${f1(r.top - 2)}l5 -7`} />
        </g>
      </Scene2>
    );
  },

  'psikoloji-yaninda-kal': () => yanindaKal(false),
  'psikoloji-intihar-dinle': () => yanindaKal(true),
  'psikoloji-intihar-destek': () => goHealth(INT.helper, INT.person),

  'psikoloji-gonullu-destek': () => goHealth(GON.buddy, GON.tired, { supOver: (r) => <VestStripes r={r} />, leadOver: (r) => <VestStripes r={r} /> }),
  'psikoloji-travma-konusma': () => talkSit(TRV.kin, TRV.victim, 'right'),
  'psikoloji-travma-destek': () => goHealth(TRV.kin, TRV.victim),
  'psikoloji-stres-destek': () => goHealth(STR.parent, { ...STR.school }, { leadS: 0.8, leadX: 126 }),
};

/** Yatak kenarında yan yana oturan iki kişi. `talking`: kişi konuşuyor, yardımcı ona dönmüş dinliyor. */
function yanindaKal(talking: boolean) {
  const sad0: PersonProps = { ...INT.person, x: 200, y: 224, s: 1.12, pose: { ...POSE.sitChair, spine: -82, chest: -64, head: talking ? -60 : -40, face: talking ? 'speak' : 'closed' } };
  const sr0 = rig(sad0);
  const sadHand: P = [sr0.hip[0] - 8, sr0.hip[1] + 4];
  const sad: PersonProps = { ...sad0, pose: { ...sad0.pose, armB: { to: [sr0.kneeB[0] - 4, sr0.kneeB[1] - 6] }, armF: { to: sadHand }, handF: 'flat' } };
  const lis: PersonProps = { ...INT.helper, x: 132, y: 224, s: 1.12, pose: { ...POSE.sitChair, spine: -86, chest: -78, head: -70, armF: { to: [sadHand[0] - 18, sadHand[1] + 2] }, handF: 'flat', face: 'neutral' } };
  return (
    <Scene2 bg="indoor" wall="#f0d9b8">
      <Window x={36} y={46} w={60} h={56} />
      <rect x={240} y={60} width={44} height={56} fill="#fff3c4" stroke={K.out} stroke-width={1.5} rx={2} />
      <rect x={246} y={66} width={32} height={44} fill="#e8b25a" />
      <OG sh={[
        { d: rrect(70, 120, 12, 110, 2), f: K.wood },
        { d: rrect(70, 166, 210, 22, 6), f: '#f4f1ea' },
        { d: rrect(74, 186, 202, 12, 2), f: shade(K.wood, 0.1) },
        { d: rrect(268, 150, 12, 80, 2), f: K.wood },
        { d: 'M86 166Q170 158 266 166V188H86Z', f: '#d98b5f' },
      ]} />
      <Person {...lis} />
      <Person {...sad} />
      {talking && (() => {
        const r = rig(sad);
        const bx = r.head[0] + 14, by = r.top - 40;
        return (
          <Bubble x={bx} y={by} w={46} h={30} tail={[r.mouth[0] + 6, r.mouth[1] - 6]}>
            <g fill={K.ink}>{[-9, 0, 9].map((d) => <circle key={d} cx={bx + 23 + d} cy={by + 15} r={2.6} />)}</g>
          </Bubble>
        );
      })()}
    </Scene2>
  );
}

/** Önden kask (simetrik; baş ekseni dik) */
function HelmetFront({ r, c = HELMET }: { r: Rig; c?: string }) {
  const H = r.headR;
  return (
    <g transform={`translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})`}>
      <OG ow={1.4} sh={[
        { d: `M${f1(-1.1 * H)} ${f1(-0.25 * H)}C${f1(-1.12 * H)} ${f1(-1.45 * H)} ${f1(1.12 * H)} ${f1(-1.45 * H)} ${f1(1.1 * H)} ${f1(-0.25 * H)}Z`, f: c },
        { d: rrect(-1.3 * H, -0.4 * H, 2.6 * H, 0.26 * H, 0.12 * H), f: shade(c, 0.12) },
        { d: `M0 ${f1(-1.15 * H)}V${f1(-0.4 * H)}`, st: shade(c, 0.25), sw: 2.4 },
      ]} />
    </g>
  );
}

/* ════════════════════════ zehirlenme yardımcıları ════════════════════════ */

/** Mantar (yan). x,y = sap dibi */
function Mushroom({ x, y, s = 1, a = 0, cap = '#c9a27a', wild }: { x: number; y: number; s?: number; a?: number; cap?: string; wild?: boolean }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.4 / s} sh={[
        { d: 'M-4 0Q-5 -10 -4 -16H4Q5 -10 4 0Z', f: '#f1ead8' },
        { d: 'M-16 -14C-16 -26 -8 -31 0 -31C8 -31 16 -26 16 -14Q0 -18 -16 -14Z', f: cap },
        { d: 'M-16 -14Q0 -18 16 -14Q0 -12 -16 -14Z', f: shade(cap, 0.15) },
      ]} />
      {wild && <g fill="#fff"><circle cx={-6} cy={-24} r={2.2} /><circle cx={5} cy={-26} r={1.8} /><circle cx={9} cy={-19} r={1.6} /><circle cx={-10} cy={-18} r={1.5} /></g>}
    </G>
  );
}
/** Duvar saati. hh,mm = saat, dakika */
function WallClock({ x, y, r = 18, hh = 12, mm = 0 }: { x: number; y: number; r?: number; hh?: number; mm?: number }) {
  const ha = ((hh % 12) + mm / 60) * 30 - 90, ma = mm * 6 - 90;
  const h = pol([x, y], ha, r * 0.5), m = pol([x, y], ma, r * 0.78);
  return (
    <g>
      <circle cx={x} cy={y} r={r + 3} fill="#5b6070" stroke={K.out} stroke-width={1.5} />
      <circle cx={x} cy={y} r={r} fill="#fff" />
      {[0, 90, 180, 270].map((a) => { const p1 = pol([x, y], a, r * 0.82), p2 = pol([x, y], a, r * 0.95); return <path key={a} d={`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`} stroke={K.ink} stroke-width={2} />; })}
      <path d={`M${x} ${y}L${f1(h[0])} ${f1(h[1])}`} stroke={K.ink} stroke-width={3} stroke-linecap="round" />
      <path d={`M${x} ${y}L${f1(m[0])} ${f1(m[1])}`} stroke={K.ink} stroke-width={2} stroke-linecap="round" />
      <circle cx={x} cy={y} r={2} fill={K.action} />
    </g>
  );
}
/** Kömür sobası + boru. x = gövde ortası, y = zemin; pipeTo = borunun duvara girdiği y */
function CoalStove({ x, y, s = 1, pipeTo = 30 }: { x: number; y: number; s?: number; pipeTo?: number }) {
  const top = y - 78 * s;
  return (
    <g>
      <OG sh={[
        { d: rrect(x - 6 * s, pipeTo, 12 * s, top - pipeTo + 4, 1), f: '#5a5e68' },
        { d: rrect(x - 22 * s, top, 44 * s, 70 * s, 6 * s), f: '#3f434d' },
        { d: rrect(x - 25 * s, top - 4 * s, 50 * s, 8 * s, 3), f: '#555a65' },
        { d: rrect(x - 13 * s, top + 22 * s, 26 * s, 20 * s, 3), f: '#ff8a1f' },
        { d: rrect(x - 18 * s, y - 8 * s, 6 * s, 8 * s, 1), f: '#2f323a' },
        { d: rrect(x + 12 * s, y - 8 * s, 6 * s, 8 * s, 1), f: '#2f323a' },
      ]} />
      <rect x={x - 9 * s} y={top + 30 * s} width={18 * s} height={8 * s} rx={2} fill="#ffd64a" />
    </g>
  );
}
/** Mangal (kömürlü). x,y = taban ortası */
function Mangal({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-24 0L-18 -22M24 0L18 -22" stroke={K.out} stroke-width={4} stroke-linecap="round" />
      <path d="M-24 0L-18 -22M24 0L18 -22" stroke="#6b6f78" stroke-width={2.4} stroke-linecap="round" />
      <OG ow={1.5 / s} sh={[{ d: 'M-32 -36H32L26 -20H-26Z', f: '#5a5e68' }, { d: rrect(-30, -40, 60, 6, 2), f: '#6f7480' }]} />
      <g>
        {[-20, -10, 0, 10, 20].map((cx, i) => <circle key={cx} cx={cx} cy={-41 - (i % 2) * 2} r={5.5} fill={i % 2 ? '#e8472d' : '#ff7b1c'} stroke={K.out} stroke-width={1} />)}
      </g>
      <Flame x={-6} y={-42} s={0.38} />
      <Flame x={10} y={-42} s={0.3} />
    </G>
  );
}
/** Tüplü ısıtıcı (radyant). x,y = taban ortası */
function TubeHeater({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(-14, -50, 28, 50, 8), f: '#3d7ad6' },
        { d: rrect(-6, -56, 12, 7, 2), f: K.metal },
        { d: 'M0 -56V-64', st: K.out, sw: 3 },
        { d: rrect(-22, -96, 44, 34, 4), f: '#6b6f78' },
        { d: rrect(-17, -91, 34, 24, 2), f: '#ff8a1f' },
      ]} />
      <path d="M-14 -85h28M-14 -79h28M-14 -73h28" stroke="#ffd64a" stroke-width={2.2} />
    </G>
  );
}
/** Jeneratör (yan). x,y = taban ortası; egzoz sağa */
function Generator({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-34 -4V-46M34 -4V-46M-34 -46H34', st: K.out, sw: 5 },
        { d: rrect(-28, -40, 56, 34, 4), f: '#f2c230' },
        { d: rrect(-20, -32, 22, 18, 3), f: '#3f434d' },
        { d: circ([16, -23], 8), f: '#555a65' },
        { d: rrect(28, -18, 16, 6, 2), f: K.metal },
        { d: rrect(-38, -6, 76, 6, 2), f: '#3f434d' },
        { d: circ([-26, 0], 5), f: '#2f323a' },
        { d: circ([26, 0], 5), f: '#2f323a' },
      ]} />
      <path d="M-34 -4V-46M34 -4V-46M-34 -46H34" stroke="#d6342e" stroke-width={3} fill="none" stroke-linecap="round" />
    </G>
  );
}
/** Kilit (asma). x,y = gövde merkezi */
function Padlock({ x, y, s = 1, c = '#e2c35a' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-6 -4V-10A6 6 0 0 1 6 -10V-4" fill="none" stroke={K.out} stroke-width={5.4} />
      <path d="M-6 -4V-10A6 6 0 0 1 6 -10V-4" fill="none" stroke={K.metal} stroke-width={2.8} />
      <OG ow={1.5 / s} sh={[{ d: rrect(-10, -5, 20, 16, 3), f: c }, { d: circ([0, 2], 2.2), f: K.out }]} />
    </G>
  );
}
/** İlaç kutusu (C merkez). w×h */
function MedBox({ x, y, w = 40, h = 26, a = 0, band = '#3d7ad6' }: { x: number; y: number; w?: number; h?: number; a?: number; band?: string }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: rrect(-w / 2, -h / 2, w, h, 2), f: '#f4f1ea' }, { d: `M${-w / 2} ${h * 0.1}H${w / 2}V${h * 0.3}H${-w / 2}Z`, f: band, no: true }, { d: `M${-w * 0.32} ${-h * 0.18}h${w * 0.18}M${-w * 0.23} ${-h * 0.32}v${h * 0.28}`, st: K.red, sw: 2.6 }, { d: `M${w * 0.02} ${-h * 0.22}h${w * 0.32}`, st: '#9aa2ad', sw: 2 }]} />
    </G>
  );
}
/** Temizlik maddesi şişesi (tetikli ya da kapaklı). x,y = taban ortası */
function Cleaner({ x, y, s = 1, c = '#5aa9d6', spray }: { x: number; y: number; s?: number; c?: string; spray?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        spray ? { d: 'M-6 -46H8L14 -40H4V-36H-6Z', f: '#f4f1ea' } : { d: rrect(-5, -46, 10, 8, 2), f: '#f4f1ea' },
        { d: 'M-12 -2V-28Q-12 -36 -6 -38H6Q12 -36 12 -28V-2Q12 0 10 0H-10Q-12 0 -12 -2Z', f: c },
        { d: rrect(-9, -26, 18, 14, 2), f: '#fff' },
        { d: 'M-4 -22L0 -15L4 -22Z', f: K.danger },
      ]} />
    </G>
  );
}
/** Şeffaf poşet (taban ortası) */
function ClearBag({ x, y, w = 70, h = 64, children }: { x: number; y: number; w?: number; h?: number; children?: ComponentChildren }) {
  return (
    <g>
      <path d={`M${x - w / 2} ${y - h}L${x - w / 2 + 4} ${y - 4}Q${x - w / 2 + 6} ${y} ${x - w / 2 + 10} ${y}H${x + w / 2 - 10}Q${x + w / 2 - 6} ${y} ${x + w / 2 - 4} ${y - 4}L${x + w / 2} ${y - h}Z`} fill="#dceef7" opacity={0.55} />
      {children}
      <path d={`M${x - w / 2} ${y - h}L${x - w / 2 + 4} ${y - 4}Q${x - w / 2 + 6} ${y} ${x - w / 2 + 10} ${y}H${x + w / 2 - 10}Q${x + w / 2 - 6} ${y} ${x + w / 2 - 4} ${y - 4}L${x + w / 2} ${y - h}`} fill="#dceef7" fill-opacity={0.25} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
      <path d={`M${x - w / 2} ${y - h}H${x + w / 2}`} stroke="#5aa9d6" stroke-width={3} />
      <path d={`M${x - w / 2 + 8} ${y - h + 10}V${y - 14}`} stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.8} />
    </g>
  );
}
/** Tarım ilacı bidonu/kutusu (taban ortası); tehlike etiketli */
function PestCan({ x, y, s = 1, a = 0, c = '#3f8a4a' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(-6, -54, 12, 8, 2), f: '#2f323a' },
        { d: 'M-18 -2V-38Q-18 -46 -10 -47H10Q18 -46 18 -38V-2Q18 0 16 0H-16Q-18 0 -18 -2Z', f: c },
        { d: rrect(-14, -38, 28, 30, 2), f: '#fff' },
        { d: 'M0 -36L11 -23L0 -10L-11 -23Z', f: '#fff' },
      ]} />
      <path d="M0 -36L11 -23L0 -10L-11 -23Z" fill="none" stroke={K.danger} stroke-width={2} />
      <circle cx={0} cy={-25} r={4} fill={K.ink} />
      <path d="M-2.4 -21.4V-19.2M0 -21.4V-19.2M2.4 -21.4V-19.2" stroke={K.ink} stroke-width={1.2} />
      <circle cx={-1.5} cy={-25.5} r={1} fill="#fff" />
      <circle cx={1.5} cy={-25.5} r={1} fill="#fff" />
      <path d="M-6 -16L6 -12M6 -16L-6 -12" stroke={K.ink} stroke-width={1.6} stroke-linecap="round" />
    </G>
  );
}
/** Lastik eldiven (tam boy figürde el noktasına) */
function Glove({ p, s = 1, c = '#f2c230' }: { p: P; s?: number; c?: string }) {
  return <OG sh={[{ d: circ(p, 6 * s), f: c }, { d: ell([p[0] + 1.5 * s, p[1] + 1.5 * s], 3 * s, 2.4 * s), f: shade(c, 0.14), no: true }]} />;
}
/** Yandan filtreli yarım yüz maskesi: burun-ağzı örten kauçuk gövde + yanda yuvarlak filtre kartuşu + kayış */
function Respirator({ r }: { r: Rig }) {
  const q = (x: number, y: number) => { const v = headPt(r, x, y); return `${f1(v[0])} ${f1(v[1])}`; };
  const c = headPt(r, 7, 8);
  const k = r.headR / 12;
  return (
    <g>
      <path d={`M${q(6, -1)}L${q(-8, -6)}M${q(5, 10)}L${q(-8, 9)}`} stroke={K.out} stroke-width={2.4 * k} stroke-linecap="round" />
      <OG sh={[{ d: `M${q(5, -3)}C${q(11, -3)} ${q(15, 1)} ${q(15, 6)}C${q(15, 11)} ${q(11, 14)} ${q(5, 13)}C${q(3, 9)} ${q(3, 2)} ${q(5, -3)}Z`, f: '#4a4f5a' }]} />
      <OG sh={[{ d: circ(c, 5.6 * k), f: '#d0508a' }, { d: circ(c, 2.6 * k), f: shade('#d0508a', 0.25), ln: true }]} />
    </g>
  );
}
/** Kimyasala dayanıklı uzun eldiven (nitril, yeşil): elden önkolun yarısına */
function LongGlove({ r, side, c = '#3f9a5a' }: { r: Rig; side: 'B' | 'F'; c?: string }) {
  const e = side === 'B' ? r.elbowB : r.elbowF, w = side === 'B' ? r.wristB : r.wristF, h = side === 'B' ? r.handB : r.handF;
  const s = r.s;
  const cuff = lerp(w, e, 0.6);
  return <OG sh={[{ d: capsule(cuff, 5.4 * s, w, 4.2 * s), f: c }, { d: capsule(w, 4.4 * s, h, 5.6 * s), f: c }, { d: capsule(cuff, 5.6 * s, lerp(w, e, 0.52), 5.4 * s), f: shade(c, 0.15) }]} />;
}
/** Gaz/duman bulanıklığı (oda) */
function Haze({ x = 0, y = 0, w = 320, h = 200, op = 0.28 }: { x?: number; y?: number; w?: number; h?: number; op?: number }) {
  return (
    <g opacity={op}>
      <rect x={x} y={y} width={w} height={h} fill="#8d939c" />
      {[[40, 60, 40], [120, 40, 50], [220, 70, 46], [290, 40, 36], [170, 120, 40]].map(([cx, cy, rr], i) => <circle key={i} cx={x + cx * w / 320} cy={y + cy} r={rr} fill="#a3a9b1" />)}
    </g>
  );
}

/* ════════════════════════════ ZEHİRLENME ════════════════════════════ */

/** karbonmonoksit */
const CO = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark } as Cast,
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2 } as Cast,
};
/** zehirlenme (genel) */
const ZG = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.brown } as Cast,
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2 } as Cast,
};
/** zehirlenme-cocuk-yutma: anne + küçük kız */
const CY = {
  parent: { who: 'woman', role: 'helper', hair: 'long', hairC: K.hair.black, skin: 2 } as Cast,
  child: { who: 'girl', role: 'bystander2', hair: 'ponytail', hairC: K.hair.brown, skin: 2 } as Cast,
};
/** zehirlenme-mantar: mantarı yiyen adam + eşi */
const MN = {
  man: { who: 'man', role: 'bystander4', skin: 1, hairC: K.hair.dark } as Cast,
  wife: { who: 'woman', role: 'bystander', hair: 'scarf', hairC: '#c6574e', skin: 1 } as Cast,
};
/** zehirlenme-gida: hasta kadın + yakını */
const GD = {
  p: { who: 'woman', role: 'victim', hair: 'bun', hairC: K.hair.dark, skin: 1 } as Cast,
  helper: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black } as Cast,
};
/** zehirlenme-metanol */
const MT = { victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark } as Cast };
/** zehirlenme-tarim-ilaci: yaşlı çiftçi + maskeli/eldivenli yardımcı */
const TR = {
  victim: { who: 'oldman', role: 'victim', skin: 1, top: '#6b8fb8', bottomC: '#c9a04a' } as Cast,
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2 } as Cast,
};

/** Telefonla 114'ü arayan kişi, ürünün kutusunu tutup etiketine bakıyor. */
function kutuyuGoster(c: Cast) {
  const p0: PersonProps = { ...c, x: 168, y: 92, ax: 'head', ay: 'head', s: 2.0, pose: { view: 'front', head: -96, face: 'worried' } };
  const r0 = rig(p0);
  const ear = headPt(r0, 13, 2);
  const box: P = [64, 108];
  const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: [ear[0] + 6, ear[1] + 14], bend: 1 }, armB: { to: [box[0] + 10, box[1] + 16] } } };
  return (
    <Scene2 bg="indoor" wall="#e4e8ee" gy={238}>
      <Person {...p} only={['torso', 'head', 'armB']} />
      <Phone x={ear[0] + 10} y={ear[1] + 2} s={0.95} a={12} text="114" />
      <Person {...p} only={['armF']} />
      <MedBox x={box[0]} y={box[1]} w={74} h={46} a={-10} />
      <DashArrow from={[r0.head[0] - 26, r0.head[1] + 4]} to={[box[0] + 32, box[1] - 30]} bend={0.1} w={3} />
    </Scene2>
  );
}

/**
 * Göz yıkama yakın planı (önden, büyük yüz): baş yaralı göz tarafına yatık, yaralı göz aşağıda.
 * Yardımcının eli sağ alttan geliyor: başparmak alt kapağı aşağı, işaret parmağı üst kapağı yukarı çekiyor.
 * Musluk suyu gözün burun tarafındaki iç köşesine düşüyor, gözün üstünden dış köşeye akıp yanaktan süzülüyor.
 */
function gozYika(victim: Cast, opts: { bald?: boolean; mustache?: boolean; sleeve?: string; helperSkin?: number } = {}) {
  const C: P = [138, 128], ROT = 16;
  const T = (x: number, y: number): P => {
    const a = ROT * RAD, dx = x - C[0], dy = y - C[1];
    return [C[0] - 16 + dx * Math.cos(a) - dy * Math.sin(a), C[1] + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const sk = K.skin[victim.skin ?? 1];
  const hairC = victim.hairC ?? K.hair.dark;
  const hsk = K.skin[opts.helperSkin ?? 2];
  const sleeve = opts.sleeve ?? K.role.helper;
  const fx = 0, fy = 0; void fx; void fy;
  // yüz yerel koordinatları (C merkezli değil, mutlak; sonra döndürülür)
  const eyeR: P = [172, 112], eyeL: P = [102, 112];
  const inner: P = [145, 114], outer: P = [199, 110];
  const innerS = T(inner[0], inner[1]);
  const flowLocal = `M${inner[0]} ${inner[1] - 1}Q${eyeR[0]} ${eyeR[1] - 5} ${outer[0]} ${outer[1]}Q${outer[0] + 10} ${outer[1] + 6} ${outer[0] + 12} ${outer[1] + 40}`;
  const tapTop: P = [innerS[0], 18];
  const finger = (pts: P[], w: number) => pts.slice(0, -1).map((q, i) => ({ d: capsule(q, w, pts[i + 1], w * 0.92), f: hsk }));
  return (
    <Scene2 bg="closeup">
      <g transform={`translate(-16 0) rotate(${ROT} ${C[0]} ${C[1]})`}>
        <OG sh={[
          // omuz + boyun
          { d: 'M40 270C40 226 80 206 138 206C196 206 236 226 236 270Z', f: (victim.top as string) ?? K.role.victim },
          { d: rrect(112, 176, 52, 46, 14), f: shade(sk, 0.1) },
          // kulaklar
          { d: ell([62, 124], 11, 18), f: sk },
          { d: ell([214, 124], 11, 18), f: sk },
          // yüz
          { d: ell([138, 122], 76, 90), f: sk },
          // saç
          opts.bald
            ? { d: 'M64 118C58 92 66 74 78 66C74 86 74 104 78 118ZM212 118C218 92 210 74 198 66C202 86 202 104 198 118Z', f: hairC }
            : { d: 'M62 120C54 46 100 30 138 30C176 30 222 46 214 120C206 92 196 70 176 62C150 72 112 72 90 62C78 74 68 94 62 120Z', f: hairC },
        ]} />
        {/* kaşlar */}
        <path d="M84 90Q104 82 122 90M154 88Q172 78 194 86" stroke={opts.bald ? K.hair.grey : shade(hairC, 0.2)} stroke-width={5} stroke-linecap="round" fill="none" />
        {/* sağlam göz kapalı (su oraya akmıyor) */}
        <path d={`M${eyeL[0] - 15} ${eyeL[1]}Q${eyeL[0]} ${eyeL[1] + 8} ${eyeL[0] + 15} ${eyeL[1]}`} stroke={K.ink} stroke-width={3} stroke-linecap="round" fill="none" />
        {/* yaralı göz: kapaklar açılmış */}
        <OG sh={[
          { d: `M${inner[0]} ${inner[1]}Q${eyeR[0]} ${eyeR[1] - 34} ${outer[0]} ${outer[1]}Q${eyeR[0]} ${eyeR[1] + 34} ${inner[0]} ${inner[1]}Z`, f: '#fbe3e1' },
          { d: circ(eyeR, 12.5), f: '#6b4a2e' },
          { d: circ(eyeR, 5.6), f: K.ink, no: true },
        ]} />
        <circle cx={eyeR[0] + 3} cy={eyeR[1] - 3} r={2.2} fill="#fff" />
        {/* burun + ağız */}
        <path d="M136 108Q130 132 124 146Q132 152 142 148" stroke={shade(sk, 0.35)} stroke-width={3} stroke-linecap="round" stroke-linejoin="round" fill="none" />
        {opts.mustache && <path d="M112 166Q124 156 138 162Q152 156 164 166Q150 172 138 168Q126 172 112 166Z" fill={K.hair.grey} stroke={K.out} stroke-width={1.4} />}
        <path d="M118 176Q138 170 158 176" stroke={K.ink} stroke-width={3} stroke-linecap="round" fill="none" />
        {/* su: iç köşeden gözün üstünden dış köşeye, yanaktan aşağı */}
        <path d={flowLocal} fill="none" stroke={K.out} stroke-width={8.5} stroke-linecap="round" stroke-linejoin="round" />
        <path d={flowLocal} fill="none" stroke={K.waterLight} stroke-width={5.5} stroke-linecap="round" stroke-linejoin="round" />
        {/* yardımcının eli: sağ alttan; başparmak alt kapakta, işaret parmağı üst kapakta */}
        <OG sh={[
          { d: capsule([300, 250], 26, [232, 196], 22), f: sleeve },
          { d: ell([222, 178], 24, 20), f: hsk },
          ...finger([[218, 172], [232, 128], [216, 92], [182, 86]], 7.4),
          ...finger([[206, 190], [188, 164], [170, 144]], 8),
          { d: capsule([232, 160], 7, [240, 142], 6.4), f: shade(hsk, 0.08) },
        ]} />
        <path d="M176 84.6l5 -1.4M166 142l4.6 2.4" stroke={tint(hsk, 0.45)} stroke-width={3} stroke-linecap="round" />
      </g>
      {/* musluk + iç köşeye düşen su */}
      <OG sh={[{ d: rrect(tapTop[0] - 70, 0, 84, 12, 3), f: K.metal }, { d: rrect(tapTop[0] - 8, 6, 16, 16, 3), f: shade(K.metal, 0.1) }]} />
      <path d={`M${f1(tapTop[0])} 20L${f1(innerS[0])} ${f1(innerS[1] - 2)}`} stroke={K.out} stroke-width={8.5} stroke-linecap="round" />
      <path d={`M${f1(tapTop[0])} 20L${f1(innerS[0])} ${f1(innerS[1] - 2)}`} stroke={K.waterLight} stroke-width={5.5} stroke-linecap="round" />
      <Arrow from={T(146, 62)} to={T(206, 70)} bend={0.28} w={5} />
      <Label x={272} y={34} text="15 dk" size={16} />
    </Scene2>
  );
}

const ZEH: Record<string, ArtFn> = {
  'zehirlenme-kpr': () => kpr(ZG.helper, ZG.victim),
  'zehirlenme-yan-yatir': () => recov(ZG.victim),
  'zehirlenme-co-yan-yatir': () => recov(CO.victim),
  'zehirlenme-cocuk-yan-yatir': () => recov(CY.child, { s: 1.55 }),
  'zehirlenme-metanol-yan-yatir': () => recov(MT.victim),
  'zehirlenme-cocuk-kutu': () => kutuyuGoster(CY.parent),
  'zehirlenme-tarim-goz-yika': () => gozYika({ ...TR.victim, hairC: K.hair.grey }, { bald: true, mustache: true, sleeve: K.role.helper, helperSkin: TR.helper.skin }),
  'zehirlenme-mantar-acil': () => goHealth(MN.wife, MN.man, { leadFace: 'pain', leadBelly: true }),
  'zehirlenme-gida-doktor': () => goHealth(GD.helper, GD.p, { leadFace: 'worried' }),
  'zehirlenme-co-temiz-hava': () => {
    const S = 0.95;
    const vic: PersonProps = {
      ...CO.victim, x: 196, y: 226, s: S, flip: true,
      pose: { spine: -130, chest: -126, head: -112, legB: [2, 2], legF: [-2, -2], footB: -80, footF: -80, armB: [70, 20], armF: [64, 14], face: 'closed' },
    };
    const v = rig(vic);
    const help: PersonProps = {
      ...CO.helper, x: v.neck[0] + 30, y: 228, s: S, flip: true,
      pose: { spine: -56, chest: -44, head: -36, legB: [104, 84], legF: [70, 98], armF: { to: [v.chest[0] - 2, v.chest[1] + 4] }, armB: { to: [v.chest[0] + 4, v.chest[1] - 2] }, face: 'worried' },
    };
    const sash: P = [146, 64];
    const opener: PersonProps = { x: 168, y: 206, s: 0.8, flip: true, who: 'man', role: 'bystander4', skin: 2, hairC: K.hair.black, pose: { ...POSE.standSide, head: -96, armF: { to: sash }, armB: [96, 100], face: 'worried' } };
    return (
      <Scene2 bg="indoor">
        <CoalStove x={30} y={208} s={0.95} pipeTo={0} />
        {/* pencere: sağ kanat içeri açık */}
        <OG sh={[{ d: rrect(76, 40, 66, 62, 2), f: '#f4f1ea' }, { d: rrect(81, 45, 56, 52, 1), f: '#bfe3f5', ln: true }]} />
        <path d="M86 56L94 48M86 66L104 50" stroke="#fff" stroke-width={2} opacity={0.8} />
        <OG sh={[{ d: `M137 45L${sash[0] + 6} ${sash[1] - 22}L${sash[0] + 6} ${sash[1] + 44}L137 97Z`, f: '#e8eef2' }]} />
        {/* açık kapı: dışarısı */}
        <g>
          <OG sh={[{ d: rrect(256, 84, 60, 124, 2), f: '#efe9df' }, { d: rrect(261, 89, 50, 119, 1), f: K.sky, ln: true }]} />
          <rect x={261} y={176} width={50} height={32} fill={K.grass} />
          <OG sh={[{ d: 'M311 89L320 84V214L311 208Z', f: '#a8724a' }]} />
        </g>
        <Haze w={256} h={208} op={0.3} />
        <Person {...opener} />
        <Person {...help} only={['legB', 'legF', 'torso', 'head']} />
        <Person {...vic} />
        <Person {...help} only={['armB', 'armF']} />
        <Arrow from={[236, 70]} to={[300, 70]} w={7} />
      </Scene2>
    );
  },

  'zehirlenme-co-cadirda-mangal-yasak': () => {
    // Kesit: kapalı çadırın içinde mangal, tüplü ısıtıcı, çalışan jeneratör ve uyuyan kişi.
    const T = '#e0813c';
    const apex: P = [160, -26];
    const L: P = [-30, 226], Rr: P = [350, 226];
    const sleeper: PersonProps = { x: 268, y: 222, s: 0.62, who: 'man', role: 'victim', skin: 2, pose: POSE.lieBack };
    return (
      <Scene2 bg="night" gy={226}>
        {/* çadır dışı kumaş (kalın kenar) + içi */}
        <OG sh={[{ d: `M${L[0]} ${L[1]}L${apex[0]} ${apex[1]}L${Rr[0]} ${Rr[1]}Z`, f: T }]} />
        <path d={`M${L[0] + 22} ${L[1]}L${apex[0]} ${apex[1] + 22}L${Rr[0] - 22} ${Rr[1]}Z`} fill={TENTIN} />
        <path d={`M${L[0] + 22} ${L[1]}L${apex[0]} ${apex[1] + 22}L${Rr[0] - 22} ${Rr[1]}`} fill="none" stroke={shade(T, 0.25)} stroke-width={2} />
        <path d={`M${apex[0]} 0V224`} stroke={K.out} stroke-width={5} />
        <path d={`M${apex[0]} 0V224`} stroke="#8a8f99" stroke-width={3} />
        <OG sh={[{ d: rrect(0, 222, 320, 20, 0), f: '#5d6a7a' }]} />
        <Haze x={0} y={0} w={320} h={222} op={0.18} />
        <Generator x={50} y={222} s={1.05} />
        <path d="M96 194q8 -6 14 -2t12 -4" stroke="#7d838c" stroke-width={4} fill="none" stroke-linecap="round" />
        <Mangal x={126} y={222} s={1.05} />
        <TubeHeater x={186} y={222} s={0.9} />
        <OG sh={[{ d: rrect(218, 214, 96, 9, 4), f: '#3f7f6a' }]} />
        <Person {...sleeper} />
        <OG sh={[{ d: 'M250 216Q272 204 310 208V222H250Z', f: '#b5646a' }]} />
        <text x={232} y={190} font-size={16} font-weight={700} fill={K.ink} opacity={0.6} font-family="'IBM Plex Sans', system-ui, sans-serif">z</text>
        <text x={242} y={178} font-size={12} font-weight={700} fill={K.ink} opacity={0.5} font-family="'IBM Plex Sans', system-ui, sans-serif">z</text>
        <g opacity={0.9}><No x={160} y={128} r={94} /></g>
      </Scene2>
    );
  },

  'zehirlenme-jenerator-6-metre': () => (
    <Scene2 bg="outdoor">
      <HouseExt x={10} y={208} w={110} h={100} />
      <Generator x={254} y={206} s={1.25} />
      <g fill="#9aa2ad" opacity={0.75}>
        <circle cx={316} cy={176} r={6} />
        <circle cx={300} cy={180} r={4} />
      </g>
      <Dim a={[124, 222]} b={[226, 222]} text="6 m" />
      <Ok x={254} y={120} r={16} />
    </Scene2>
  ),

  'zehirlenme-co-dedektor': () => {
    const btn: P = [150, 96];
    const h = handAt({ a: -28, s: 1.25, pose: 'point', side: 'R', arm: 200, sleeve: K.role.helper, skin: 1 }, 'tip', [btn[0] + 2, btn[1] + 2]);
    return (
      <Scene2 bg="indoor" wall="#dfe5d6" gy={238}>
        {/* yatak başı */}
        <OG sh={[{ d: rrect(176, 176, 150, 70, 6), f: K.wood }, { d: rrect(186, 196, 130, 50, 10), f: '#fff' }, { d: 'M200 214Q250 202 320 210V240H200Z', f: '#7aa6d6' }]} />
        {/* dedektör */}
        <OG sh={[{ d: circ(btn, 40), f: '#f6f6f2' }, { d: circ(btn, 30), f: '#ebebe4', ln: true }, { d: circ(btn, 11), f: '#d8dbe0', ln: true }]} />
        <g fill={K.ink}>{[-18, -10, 10, 18].map((dx) => <circle key={dx} cx={btn[0] + dx} cy={btn[1] + 22} r={1.8} />)}</g>
        <circle cx={btn[0] + 22} cy={btn[1] - 18} r={3.4} fill="#e53935" stroke={K.out} stroke-width={1} />
        <text x={btn[0]} y={btn[1] - 18} text-anchor="middle" font-size={10} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">CO</text>
        <Waves x={btn[0] + 46} y={btn[1] - 6} a={-10} n={3} r={10} w={3} />
        <Waves x={btn[0] - 46} y={btn[1] - 6} a={190} n={3} r={10} w={3} />
        <Hand {...h} />
      </Scene2>
    );
  },

  'zehirlenme-goz-yika': () => gozYika(ZG.victim, { sleeve: K.role.helper, helperSkin: ZG.helper.skin }),
  'zehirlenme-kutuyu-goster': () => kutuyuGoster(ZG.helper),

  'zehirlenme-mantar-ornek': () => {
    const bag: P = [178, 226];
    const mh = handAt({ a: 168, s: 0.9, pose: 'pinch', side: 'L', arm: 200, sleeve: K.role.bystander4, skin: MN.man.skin ?? 1 }, 'pinch', [bag[0] - 4, 120]);
    const phone: P = [272, 108];
    const ph = handAt({ a: -6, s: 1.05, pose: 'hold', side: 'R', grip: 40, arm: 200, sleeve: K.role.bystander4, skin: MN.man.skin ?? 1 }, 'grip', phone);
    return (
      <Scene2 bg="closeup">
        <rect y={150} width={320} height={90} fill="#c8a882" />
        <rect y={150} width={320} height={3} fill={shade('#c8a882', 0.2)} />
        {/* tabak */}
        <OG sh={[{ d: ell([72, 196], 62, 20), f: '#f4f1ea' }, { d: ell([72, 194], 44, 13), f: '#e9e4d8', ln: true }]} />
        <path d="M44 194q14-8 30-4q14 4 22 2" stroke="#8a5a32" stroke-width={7} stroke-linecap="round" fill="none" />
        <g fill="#c9a27a" stroke={K.out} stroke-width={1}>
          <path d="M52 190a7 5 0 0 1 14 0z" /><path d="M76 196a7 5 0 0 1 14 0z" />
        </g>
        <path d="M30 210L46 168" stroke={K.metal} stroke-width={4} stroke-linecap="round" />
        {/* poşet */}
        <ClearBag x={bag[0]} y={bag[1]} w={74} h={70}>
          <Mushroom x={bag[0] - 14} y={bag[1] - 6} s={0.9} />
          <Mushroom x={bag[0] + 12} y={bag[1] - 4} s={0.8} a={14} />
        </ClearBag>
        <Mushroom x={bag[0] - 4} y={140} s={1.05} />
        <Hand {...mh} />
        <Arrow from={[bag[0] - 50, 128]} to={[bag[0] - 26, 172]} bend={0.2} w={5} />
        {/* telefonla fotoğraf */}
        <Hand {...ph}>
          <G x={phone[0]} y={phone[1]} a={-6} s={1.05}>
            <OG ow={1.3} sh={[{ d: rrect(-19, -36, 38, 72, 7), f: '#2f3542' }]} />
            <rect x={-16} y={-31} width={32} height={58} rx={3} fill="#e6eef2" />
            <Mushroom x={0} y={14} s={0.8} />
            <path d="M-12 -24v-4h4M12 -24v-4h-4M-12 20v4h4M12 20v4h-4" stroke={K.ink} stroke-width={1.6} fill="none" />
          </G>
        </Hand>
      </Scene2>
    );
  },

  'zehirlenme-mantar-saat': () => (
    <Scene2 bg="closeup">
      <Panel x={8} y={8} w={140} h={224} bg={K.wall}>
        <rect x={8} y={176} width={140} height={56} fill={K.floor} />
        <WallClock x={78} y={44} r={18} hh={13} mm={0} />
        <OG sh={[{ d: rrect(30, 150, 96, 8, 2), f: K.wood }, { d: rrect(70, 158, 12, 50, 2), f: shade(K.wood, 0.15) }]} />
        <Person {...MN.man} x={40} y={208} s={0.66} pose={{ ...POSE.sitChair, armF: [10, -60], face: 'neutral' }} />
        <Person {...MN.wife} x={118} y={208} s={0.66} flip pose={{ ...POSE.sitChair, armF: [10, -50], face: 'neutral' }} />
        <OG sh={[{ d: ell([78, 148], 18, 4), f: '#f4f1ea' }]} />
        <g fill="#c9a27a" stroke={K.out} stroke-width={0.8}><path d="M70 147a5 4 0 0 1 10 0z" /><path d="M78 146a5 4 0 0 1 10 0z" /></g>
      </Panel>
      <Panel x={172} y={8} w={140} h={224} bg={K.wall}>
        <rect x={172} y={176} width={140} height={56} fill={K.floor} />
        <WallClock x={242} y={44} r={18} hh={19} mm={0} />
        <Person {...MN.man} x={238} y={212} s={0.82} pose={{ ...POSE.standSide, spine: -76, chest: -66, head: -70, armF: { at: 'belly', d: [2, -2] }, armB: { at: 'belly', d: [0, -8] }, handF: 'flat', face: 'pain' }} />
      </Panel>
      <Arrow from={[102, 44]} to={[214, 44]} bend={-0.2} w={6} />
      <Label x={160} y={86} text="6 sa" size={16} />
    </Scene2>
  ),

  'zehirlenme-mantar-toplama-yasak': () => (
    <Scene2 bg="outdoor">
      <Tree x={30} y={194} kind="pine" s={1.1} />
      <Tree x={80} y={184} kind="pine" s={0.8} />
      <Tree x={292} y={190} kind="pine" s={1.0} />
      <Person {...MN.man} x={140} y={224} s={1.08} pose={{ ...POSE.bend, armF: { to: [182, 214] }, armB: [80, 60] }} />
      <Mushroom x={186} y={224} s={0.95} cap="#d6342e" wild />
      <Mushroom x={204} y={226} s={0.7} cap="#d6342e" wild />
      <Mushroom x={110} y={226} s={0.7} cap="#c9a27a" />
      <No x={160} y={166} r={62} />
      <Panel x={222} y={12} w={88} h={76} bg="#f4f1ea">
        <OG sh={[{ d: rrect(232, 40, 68, 36, 4), f: '#3d6fb0' }]} />
        <Mushroom x={248} y={66} s={0.62} cap="#e9dcc4" />
        <Mushroom x={266} y={64} s={0.66} cap="#e9dcc4" />
        <Mushroom x={284} y={66} s={0.6} cap="#e9dcc4" />
        <rect x={232} y={40} width={68} height={36} rx={4} fill="#e6f3fa" opacity={0.35} stroke={K.out} stroke-width={1.5} />
        <rect x={244} y={68} width={44} height={10} rx={1.5} fill="#fff" stroke={K.out} stroke-width={1} />
        <path d="M248 70v6M251 70v6M253 70v6M257 70v6M260 70v6M264 70v6" stroke={K.ink} stroke-width={1} />
      </Panel>
      <Ok x={302} y={18} r={11} />
    </Scene2>
  ),

  'zehirlenme-gida-yudum-su': () => {
    const p0: PersonProps = { ...GD.p, x: 118, y: 236, s: 1.65, pose: { ...POSE.sitChair, head: -94, face: 'neutral' } };
    const m = rig(p0).mouth;
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: [m[0] + 14, m[1] + 22] }, armB: { at: 'chest', d: [-6, 8] }, handF: 'fist' } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor" wall="#e8dccb">
        <Table x={196} y={238} w={120} h={74} />
        {/* sürahi */}
        <OG sh={[{ d: 'M262 164V124Q262 116 268 114L268 106H292V114Q298 116 298 124V164Z', f: '#e6f3fa', op: 0.95 }, { d: 'M262 164V136H298V164Z', f: K.water, no: true, op: 0.6 }, { d: 'M298 124Q312 126 310 140Q308 152 298 152', st: K.out, sw: 3 }]} />
        {/* ORS paketi */}
        <G x={222} y={152} a={-8}>
          <OG sh={[{ d: 'M-20 -14H20L18 14H-18Z', f: '#fff' }, { d: 'M-20 -14H20V-8H-20Z', f: '#3d9ad6', no: true }, { d: 'M-17 -11h4M-11 -11h4M-5 -11h4M1 -11h4M7 -11h4', st: '#fff', sw: 1 }]} />
          <text x={0} y={7} text-anchor="middle" font-size={11} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">ORS</text>
        </G>
        <Chair x={r.hip[0] - 6} y={236} seat={236 - r.hip[1] - 4} s={1.55} color="#9a6a44" />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Glass x={r.handF[0] + 6} y={r.handF[1] + 10} s={0.95} a={-34} fill={0.45} />
        <Person {...p} only={['armF']} />
      </Scene2>
    );
  },

  'zehirlenme-gida-konserve-at': () => {
    const can: P = [226, 84];
    const hp = handAt({ a: 180, s: 1.3, pose: 'hold', side: 'R', grip: 40, arm: 200, sleeve: K.role.victim, skin: GD.p.skin ?? 1 }, 'grip', can);
    const bulgeCan = (x: number, y: number, s = 1) => (
      <G x={x} y={y} s={s}>
        <OG ow={1.5 / s} sh={[
          { d: 'M-20 -4V-40H20V-4Q20 0 16 0H-16Q-20 0 -20 -4Z', f: '#c9d0d8' },
          { d: 'M-20 -40Q0 -56 20 -40Z', f: '#b5bec8' },
          { d: rrect(-20, -32, 40, 18, 0), f: '#e8a23a' },
          { d: 'M-20 -4Q0 6 20 -4', st: K.out, sw: 1.4 },
        ]} />
        <path d="M-8 -26q4-4 8 0t8 0" stroke="#fff" stroke-width={2} fill="none" />
      </G>
    );
    return (
      <Scene2 bg="closeup">
        <rect y={180} width={320} height={60} fill="#c8a882" />
        <rect y={180} width={320} height={3} fill={shade('#c8a882', 0.2)} />
        {/* köpüklü kavanoz */}
        <G x={70} y={196}>
          <OG sh={[
            { d: 'M-26 -4V-58Q-26 -64 -20 -64H20Q26 -64 26 -58V-4Q26 0 22 0H-22Q-26 0 -26 -4Z', f: '#e6f3fa', op: 0.9 },
            { d: 'M-24 -4V-50H24V-4Q24 -2 22 -2H-22Q-24 -2 -24 -4Z', f: '#b8c46a', no: true },
            { d: rrect(-24, -76, 48, 14, 3), f: '#c0603e' },
          ]} />
          <g fill="#fff" stroke={K.out} stroke-width={1}>
            <circle cx={-14} cy={-58} r={5} /><circle cx={-4} cy={-60} r={6} /><circle cx={8} cy={-58} r={5} /><circle cx={17} cy={-59} r={4} />
            <circle cx={-6} cy={-80} r={4} /><circle cx={6} cy={-81} r={3} />
          </g>
        </G>
        <No x={70} y={152} r={46} />
        {/* çöp kutusu */}
        <OG sh={[{ d: 'M196 236L190 152H274L268 236Z', f: '#6b7280' }, { d: rrect(184, 142, 96, 12, 3), f: '#555a65' }, { d: 'M210 168V222M232 168V222M254 168V222', st: shade('#6b7280', 0.3), sw: 3 }]} />
        <Hand {...hp}>{bulgeCan(can[0], can[1] + 32, 1.3)}</Hand>
        <No x={can[0]} y={can[1] + 4} r={40} />
        <Arrow from={[292, 96]} to={[292, 150]} w={6} />
      </Scene2>
    );
  },

  'zehirlenme-dugme-pil': () => {
    const bat: P = [150, 178];
    const kh = handAt({ a: -58, s: 0.78, pose: 'open', side: 'R', arm: 200, sleeve: K.role.bystander2, skin: CY.child.skin ?? 2 }, 'tip', [bat[0] + 22, bat[1] - 4]);
    return (
      <Scene2 bg="floor">
        {/* uzaktan kumanda, pil kapağı açık */}
        <G x={70} y={150} a={-14}>
          <OG sh={[{ d: rrect(-22, -62, 44, 124, 14), f: '#3f434d' }, { d: rrect(-14, 6, 28, 46, 4), f: '#22252b' }, { d: circ([0, -44], 7), f: K.red }]} />
          <g fill="#8d939c">{[-24, -12, 0].map((yy) => [-8, 8].map((xx) => <circle key={xx + '' + yy} cx={xx} cy={yy} r={4} />))}</g>
          <circle cx={0} cy={30} r={10} fill="#cfd5dd" stroke={K.out} stroke-width={1.4} />
        </G>
        <OG sh={[{ d: rrect(100, 196, 34, 22, 3), f: '#3f434d' }]} />
        {/* düğme pil */}
        <circle cx={bat[0]} cy={bat[1]} r={22} fill="#fff6c8" opacity={0.6} />
        <OG sh={[{ d: circ(bat, 13), f: '#cfd5dd' }, { d: circ([bat[0] - 1, bat[1] - 1], 9), f: '#e7ebef', ln: true }]} />
        <path d={`M${bat[0] - 20} ${bat[1] - 18}l-6 -6M${bat[0] + 18} ${bat[1] - 20}l5 -7M${bat[0]} ${bat[1] - 26}v-8`} stroke="#f2c230" stroke-width={2.6} stroke-linecap="round" />
        <Hand {...kh} />
        {/* ek kare: hastaneye koşan ebeveyn */}
        <Panel x={216} y={12} w={94} h={84} bg={K.sky}>
          <rect x={216} y={78} width={94} height={18} fill={K.grass} />
          <Person {...CY.parent} x={244} y={88} s={0.42} pose={{ ...POSE.run, face: 'worried' }} />
          <OG sh={[{ d: rrect(270, 36, 34, 44, 2), f: '#f4f1ea' }]} />
          <Crescent x={287} y={52} r={8} ring={false} bg="#f4f1ea" />
          <Arrow from={[252, 30]} to={[268, 30]} w={3} />
        </Panel>
      </Scene2>
    );
  },

  'zehirlenme-kilitli-dolap': () => (
    <Scene2 bg="indoor" wall="#e6e0d2" gy={176}>
      {/* tezgâh + alt dolaplar */}
      <OG sh={[{ d: rrect(20, 150, 290, 12, 2), f: '#8a8f99' }, { d: rrect(26, 162, 278, 78, 2), f: '#d9c3a0' }, { d: 'M118 166V236M212 166V236', st: shade('#d9c3a0', 0.3), sw: 2 }]} />
      {/* üst dolap: cam kapaklı */}
      <OG sh={[{ d: rrect(70, 14, 190, 104, 3), f: '#c9a27a' }, { d: rrect(78, 22, 84, 88, 2), f: '#eaf3f6', ln: true }, { d: rrect(168, 22, 84, 88, 2), f: '#eaf3f6', ln: true }, { d: 'M78 66H252', st: shade('#c9a27a', 0.25), sw: 3 }]} />
      <MedBox x={98} y={52} w={30} h={20} />
      <MedBox x={136} y={54} w={28} h={16} band="#22b35e" />
      <MedBox x={190} y={52} w={30} h={20} band={K.red} />
      <Cleaner x={100} y={108} s={0.85} />
      <Cleaner x={132} y={108} s={0.85} c="#f2c230" spray />
      <Cleaner x={196} y={108} s={0.85} c="#8f6fc2" />
      <Cleaner x={230} y={108} s={0.85} c="#5aa84f" />
      <path d="M86 28L96 20M86 38L104 22" stroke="#fff" stroke-width={2} opacity={0.6} />
      <Padlock x={165} y={78} s={1.2} />
      <Ok x={278} y={24} r={14} />
      {/* alt kare: su şişesinde çamaşır suyu */}
      <Panel x={14} y={176} w={92} h={56} bg="#f4f1ea">
        <G x={60} y={228} a={0}>
          <OG sh={[{ d: 'M-9 -2V-30Q-9 -36 -4 -38V-42H4V-38Q9 -36 9 -30V-2Q9 0 7 0H-7Q-9 0 -9 -2Z', f: '#eef6f9' }, { d: 'M-9 -26H9V-2Q9 0 7 0H-7Q-9 0 -9 -2Z', f: '#d8e36a', no: true }, { d: rrect(-5, -48, 10, 7, 1.5), f: '#3d9ad6' }]} />
        </G>
        <No x={60} y={206} r={24} />
      </Panel>
    </Scene2>
  ),

  'zehirlenme-metanol-bulanik-gorme': () => {
    const id = 'pz-blur' + ++uid;
    const objs = (
      <g>
        <G x={140} y={178}>
          <OG sh={[{ d: 'M-18 -2V-70Q-18 -82 -8 -86V-112H8V-86Q18 -82 18 -70V-2Q18 0 16 0H-16Q-18 0 -18 -2Z', f: '#dceef2', op: 0.9 }, { d: 'M-18 -50H18V-2Q18 0 16 0H-16Q-18 0 -18 -2Z', f: '#cfe3e8', no: true }, { d: rrect(-9, -120, 18, 10, 2), f: '#9aa2ad' }]} />
        </G>
        <Glass x={210} y={178} s={1.5} fill={0.5} liquid="#d7e8ec" />
      </g>
    );
    return (
      <Scene2 bg="indoor" wall="#c9c3b8" gy={170}>
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={3.2} />
          </filter>
        </defs>
        <rect y={150} width={320} height={90} fill="#9c7a5c" />
        <g filter={`url(#${id})`}>
          <g opacity={0.55} transform="translate(16 -4)">{objs}</g>
          {objs}
        </g>
        <rect width={320} height={240} fill="#e8e8e8" opacity={0.18} />
        {(() => {
          // Ön planda bulanık görme yaşayan adam: endişeli, bulanık şişeye bakıyor.
          const pp: PersonProps = { ...MT.victim, x: 84, y: 118, ax: 'head', ay: 'head', s: 2.4, pose: { ...POSE.standSide, spine: -88, chest: -86, head: -98, face: 'worried' } };
          const rr = rig(pp);
          void rr;
          return (
            <g>
              <Person {...pp} only={['torso', 'head', 'armB']} />
            </g>
          );
        })()}
      </Scene2>
    );
  },

  'zehirlenme-ayni-sise': () => {
    const bottle: P = [160, 170];
    const ppl: { x: number; who: 'man' | 'woman' | 'oldman'; role: 'victim' | 'bystander' | 'bystander2' | 'bystander3' | 'bystander4'; skin: number; hair?: 'scarf' | 'bun' }[] = [
      { x: 44, who: 'man', role: 'victim', skin: 1 },
      { x: 118, who: 'woman', role: 'bystander', skin: 2, hair: 'bun' },
      { x: 202, who: 'oldman', role: 'bystander3', skin: 1 },
      { x: 276, who: 'man', role: 'bystander2', skin: 3 },
    ];
    return (
      <Scene2 bg="indoor" wall="#e9dcc8">
        {ppl.map((q) => <Person key={q.x} x={q.x} y={220} s={1.02} who={q.who} role={q.role} skin={q.skin} hair={q.hair} pose={{ ...POSE.stand, face: 'worried' }} />)}
        <OG sh={[{ d: rrect(10, 172, 300, 12, 3), f: K.wood }, { d: rrect(20, 184, 280, 56, 2), f: shade(K.wood, 0.15) }]} />
        {ppl.map((q) => <Glass key={'g' + q.x} x={q.x + (q.x < 160 ? 14 : -14)} y={174} s={0.75} fill={0.4} liquid="#e8eef0" />)}
        <G x={bottle[0]} y={174}>
          <OG sh={[{ d: 'M-12 -2V-46Q-12 -54 -6 -56V-74H6V-56Q12 -54 12 -46V-2Q12 0 10 0H-10Q-12 0 -12 -2Z', f: '#dceef2' }, { d: 'M-12 -30H12V-2Q12 0 10 0H-10Q-12 0 -12 -2Z', f: '#cfe3e8', no: true }]} />
        </G>
        {ppl.map((q) => {
          const tx = q.x + (q.x < 160 ? 16 : -16);
          return <Arrow key={'a' + q.x} from={[bottle[0] + (q.x < 160 ? -14 : 14), 118]} to={[tx, 84]} bend={q.x < 160 ? -0.15 : 0.15} w={4} />;
        })}
      </Scene2>
    );
  },

  'zehirlenme-bandrol-kontrol': () => {
    const bx = 108;
    const bh = handAt({ a: 0, s: 1.2, pose: 'hold', side: 'L', grip: 44, arm: 200, sleeve: K.role.victim, skin: MT.victim.skin ?? 1 }, 'grip', [bx, 178]);
    const ph = handAt({ a: -128, s: 0.95, pose: 'point', side: 'L', arm: 200, sleeve: K.role.victim, skin: MT.victim.skin ?? 1 }, 'tip', [bx - 12, 74]);
    return (
      <Scene2 bg="closeup">
        <rect y={206} width={320} height={34} fill="#c8a882" />
        {/* kapalı, bandrollü şişe */}
        <Hand {...bh}>
          <G x={bx} y={206}>
            <OG sh={[
              { d: 'M-20 -2V-80Q-20 -96 -9 -102V-142H9V-102Q20 -96 20 -80V-2Q20 0 18 0H-18Q-20 0 -20 -2Z', f: '#3f7f5a' },
              { d: rrect(-10, -154, 20, 14, 2), f: '#c9a24a' },
              { d: rrect(-18, -72, 36, 34, 2), f: '#f4ead2' },
              { d: 'M-14 -150L16 -114L8 -108L-20 -144Z', f: '#f2f5f8' },
            ]} />
            <path d="M-10 -142L10 -122M-6 -146L12 -128" stroke="#3d9ad6" stroke-width={2} />
            <path d="M-12 -60h24M-12 -52h18" stroke="#9c7a5c" stroke-width={2} />
          </G>
        </Hand>
        <Hand {...ph} />
        <Ok x={bx - 44} y={64} r={15} />
        {/* etiketsiz, kapağı açık pet şişe */}
        <G x={238} y={206}>
          <OG sh={[{ d: 'M-18 -2V-60Q-18 -72 -8 -78V-96H8V-78Q18 -72 18 -60V-2Q18 0 16 0H-16Q-18 0 -18 -2Z', f: '#e6f3fa', op: 0.92 }, { d: 'M-18 -48H18V-2Q18 0 16 0H-16Q-18 0 -18 -2Z', f: '#e9ead6', no: true }]} />
          <path d="M-12 -40V-10" stroke="#fff" stroke-width={2.4} stroke-linecap="round" />
        </G>
        <OG sh={[{ d: rrect(268, 194, 18, 12, 2), f: '#3d9ad6' }]} />
        <No x={240} y={150} r={52} />
      </Scene2>
    );
  },

  'zehirlenme-tarla-temiz-hava': () => {
    const far: PersonProps = { ...TR.victim, x: 186, y: 226, s: 1.0, pose: { ...POSE.walk, spine: -72, chest: -62, head: -50, armB: [100, 92], face: 'pain' } };
    const f = rig(far);
    const help: PersonProps = { ...TR.helper, x: 140, y: 224, s: 1.02, pose: { ...POSE.walk, armF: { to: [f.elbowB[0] - 2, f.elbowB[1] - 4] }, armB: { to: [f.back[0] - 2, f.back[1] - 2] }, face: 'neutral' } };
    const hr = rig(help);
    const far2: PersonProps = { ...far, pose: { ...far.pose, armF: [70, 80] } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* sera */}
        <OG sh={[{ d: 'M-10 200V140Q-10 92 40 92Q90 92 90 140V200Z', f: '#dceef2', op: 0.85 }, { d: 'M20 96V200M60 96V200M-10 150H90', st: '#9fb7c9', sw: 2 }]} />
        <path d="M100 210h220M100 222h220M100 234h220" stroke="#8fae5a" stroke-width={4} stroke-dasharray="8 6" />
        {/* sırt pülverizatörü */}
        <G x={80} y={226}>
          <OG sh={[{ d: rrect(-14, -44, 28, 44, 6), f: '#e0813c' }, { d: rrect(-8, -50, 16, 7, 2), f: '#3f434d' }]} />
          <path d="M10 -20Q30 -10 40 -2" stroke={K.out} stroke-width={3} fill="none" />
        </G>
        {/* rüzgâr (sağdan) */}
        <g stroke="#ffffff" stroke-width={3} fill="none" stroke-linecap="round" opacity={0.9}>
          <path d="M312 70H262q-10 0 -10 -8t10 -6" />
          <path d="M316 94H244" />
          <path d="M312 118H270q-10 0 -10 8t10 6" />
        </g>
        <Person {...far2} only={['armB']} />
        <Person {...help} only={['legB', 'legF', 'torso', 'head', 'armB']} over={(r) => <Respirator r={r} />} />
        <LongGlove r={hr} side="B" />
        <Person {...far2} only={['legB', 'legF', 'torso', 'head', 'armF']} />
        <Person {...help} only={['armF']} />
        <LongGlove r={hr} side="F" />
        <Arrow from={[200, 60]} to={[262, 60]} w={6} />
      </Scene2>
    );
  },

  'zehirlenme-pestisit-etiket': () => {
    const can: P = [104, 150];
    const ch = handAt({ a: 6, s: 1.2, pose: 'hold', side: 'L', grip: 52, arm: 200, sleeve: K.role.helper, skin: TR.helper.skin ?? 2 }, 'grip', can);
    const ph: P = [236, 112];
    const phh = handAt({ a: -8, s: 1.15, pose: 'hold', side: 'R', grip: 40, arm: 200, sleeve: K.role.helper, skin: TR.helper.skin ?? 2 }, 'grip', ph);
    return (
      <Scene2 bg="closeup">
        <Hand {...ch}><PestCan x={can[0]} y={can[1] + 40} s={1.6} /></Hand>
        <Hand {...phh}><Phone x={ph[0]} y={ph[1]} s={1.15} a={-8} text="114" /></Hand>
        <DashArrow from={[ph[0] - 34, ph[1] - 6]} to={[can[0] + 36, can[1] - 6]} w={3} />
      </Scene2>
    );
  },

  'zehirlenme-eldivenle-giysi-cikar': () => {
    // Eldivenli yardımcı, çiftçiden çıkarılan ilaçlı ceketi şeffaf poşete koyuyor; çıkarılan çizmeler poşetin yanında.
    // Çiftçi atletle, çorapla bekliyor.
    const JACK = TR.victim.top as string;
    const stain = (x: number, y: number, rx: number, ry: number) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#6f6a2a" opacity={0.6} />;
    const vic: PersonProps = { ...TR.victim, top: '#eef0f2', sleeve: 'none', shoes: '#8a8f99', x: 78, y: 226, s: 1.12, pose: { ...POSE.standSide, armB: [96, 92], armF: [86, 88], face: 'worried' } };
    const hold: P = [222, 132];
    const help: PersonProps = { ...TR.helper, x: 168, y: 226, s: 1.12, pose: { ...POSE.standSide, spine: -84, head: -80, armF: { to: hold }, armB: { to: [hold[0] - 4, hold[1] + 6] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const bagX = 256;
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Person {...vic} />
        {/* çıkarılmış çizmeler (ilaçlı) */}
        <G x={196} y={226}>
          <OG sh={[{ d: 'M-14 0V-30H-2V-10H8Q12 -10 12 -4V0Z', f: '#4a4f3a' }, { d: 'M2 0V-26H12V-10H20Q24 -10 24 -4V0Z', f: shade('#4a4f3a', 0.12) }]} />
          {stain(-8, -18, 4, 3)}
        </G>
        <ClearBag x={bagX} y={228} w={62} h={58} />
        <Person {...help} over={(r) => <g><LongGlove r={r} side="B" /><LongGlove r={r} side="F" /></g>} />
        {/* ceket: yardımcının elinden poşete sarkıyor */}
        <G x={hold[0] + 6} y={hold[1] + 4}>
          <OG sh={[
            { d: 'M-10 -4Q8 -10 26 -2L32 40Q14 48 -4 40Z', f: JACK },
            { d: 'M26 -2Q36 6 40 26L34 30Q30 14 24 8Z', f: shade(JACK, 0.12) },
            { d: 'M2 -6L10 18L16 -6', st: shade(JACK, 0.3), sw: 1.6 },
          ]} />
          {stain(8, 22, 6, 4)}
          {stain(22, 30, 4, 3)}
        </G>
        <Person {...help} only={['armF']} over={(r) => <LongGlove r={r} side="F" />} />
        <Arrow from={[bagX + 30, 120]} to={[bagX + 30, 168]} w={5} />
      </Scene2>
    );
  },

  'zehirlenme-pestisit-kilitli': () => (
    <Scene2 bg="indoor" wall="#b98a5c" gy={196}>
      {[30, 70, 110, 150, 190, 230, 270].map((x) => <path key={x} d={`M${x} 0V188`} stroke={shade('#b98a5c', 0.2)} stroke-width={2} />)}
      <rect y={196} width={320} height={44} fill="#a08a6a" />
      {/* metal dolap, tel kapak */}
      <OG sh={[{ d: rrect(118, 20, 170, 196, 4), f: '#8d96a2' }, { d: rrect(126, 28, 76, 180, 2), f: '#5d6672', ln: true }, { d: rrect(204, 28, 76, 180, 2), f: '#5d6672', ln: true }, { d: 'M126 88H280M126 148H280', st: '#a3adb8', sw: 4 }]} />
      <PestCan x={146} y={86} s={0.95} />
      <PestCan x={182} y={86} s={0.95} c="#c0603e" />
      <PestCan x={228} y={86} s={0.95} c="#3d6fb0" />
      <PestCan x={262} y={86} s={0.95} />
      <PestCan x={150} y={146} s={0.95} c="#c0603e" />
      <PestCan x={236} y={146} s={0.95} c="#3d6fb0" />
      <PestCan x={170} y={206} s={0.95} c="#3f8a4a" />
      <g stroke="#c9d2da" stroke-width={0.9} opacity={0.6}>
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${126 + i * 10} 28V208`} />)}
        {Array.from({ length: 18 }, (_, i) => <path key={'h' + i} d={`M126 ${28 + i * 10}H280`} />)}
      </g>
      <Padlock x={203} y={120} s={1.3} />
      <Ok x={296} y={30} r={14} />
      {/* ek kare: boş ilaç kutusundan su içmek */}
      <Panel x={8} y={100} w={104} h={130} bg="#e4e9ef">
        {(() => {
          const pp: PersonProps = { x: 50, y: 146, ax: 'head', ay: 'head', s: 1.3, who: 'man', role: 'bystander4', skin: 1, hairC: K.hair.dark, pose: { ...POSE.standSide, head: -100 } };
          const m = rig(pp).mouth;
          const base: P = [m[0] + 36, m[1] + 30];
          const mid: P = [m[0] + 20, m[1] + 16];
          const p2: PersonProps = { ...pp, pose: { ...pp.pose, armF: { to: mid } } };
          return (
            <g>
              <Person {...p2} only={['torso', 'head', 'armB']} />
              <PestCan x={base[0]} y={base[1]} s={0.8} a={-50} />
              <path d={`M${f1(m[0] + 6)} ${f1(m[1] + 2)}l2 6`} stroke={K.water} stroke-width={3} stroke-linecap="round" />
              <Person {...p2} only={['armF']} />
            </g>
          );
        })()}
        <Bad x={96} y={116} r={12} />
      </Panel>
    </Scene2>
  ),

};

export const SCENES: Record<string, ArtFn> = { ...PSI, ...ZEH };

// kullanılmayan içe aktarımlar için (ileride)
void [Bad, Bed, Phone, Rock, Smoke, Table, Window, Helmet, Can, ell, HouseExt];
