// Sıfırdan: Tarım ve hayvancılık — sahneler (a): toprak-tohum, bahçe-tarla rehberleri ve kategori kapakları.
// Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Arrow, Bad, Hand, K, Label, OG, Ok, No, Person, POSE, Rock, Scene2, Tree, Waves, Shake,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Sh } from '../../../src/art/kit2';

/* ════════════════════════ oyuncular (CAST) ════════════════════════
 * Paket genelinde üç kişi; bir rehberin bütün çizimlerinde aynı kişi görünür.
 *  ADAM  — bıyıklı çiftçi, yeşil gömlek, haki pantolon (toprak, kompost, gübre, patates, buğday ekimi, teras)
 *  KADIN — başörtülü kadın, kiremit gömlek, uzun etek (fide, filiz, ekim takvimi, üç kardeş, buğday hasadı, sulama)
 *  GENC  — at kuyruklu genç kadın, camgöbeği tişört, kot (tohum saklama, atalık tohum, zararlılar, sera)
 */
export const CAST = {
  ADAM: { who: 'man', top: '#6c9c5a', skin: 1, hair: 'short', hairC: K.hair.dark, mustache: true, bottom: 'pants', bottomC: K.pants.khaki, sleeve: 'long' },
  KADIN: { who: 'woman', top: '#c6574e', skin: 2, hair: 'scarf', hairC: '#7d5a8c', bottom: 'longskirt', bottomC: '#4f4a6e', sleeve: 'long' },
  GENC: { who: 'woman', top: '#13a394', skin: 0, hair: 'ponytail', hairC: K.hair.brown, bottom: 'pants', bottomC: K.pants.denim, sleeve: 'short' },
} as const;
type CastKey = keyof typeof CAST;
/** Yakın plan el için kişiye uygun ten/kol rengi */
const HANDOF = (c: CastKey) => ({ skin: CAST[c].skin, sleeve: CAST[c].top });

/* ════════════════════════ malzeme renkleri (paket geneli) ════════════════════════ */
const TOPRAK = '#7b5638'; // üst toprak (koyu)
const TOPRAKD = '#5e3f27';
const ALT = '#b48a5a'; // alt toprak (açık)
const KUM = '#dcc28e';
const MIL = '#a98462';
const KIL = '#8c6c5e';
const KOMPOST = '#4b3324';
const SAMAN = '#e3c76b';
const SAMAND = '#c4a54a';
const CAM = '#d6ecf5';
const ODUN = K.wood;
const DEMIR = K.metal;
const YAPRAK = '#4f9e45';
const YAPRAKD = '#3d7f36';
const DOMATES = '#e0452f';
const BUGDAY = '#e2b84c';
const NAYLON = '#e8f3f7';

/* ════════════════════════ yardımcılar ════════════════════════ */
const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
let UID = 0;
const uid = () => 'sfa' + ++UID;
const G = ({ x = 0, y = 0, s = 1, a = 0, sx, children }: { x?: number; y?: number; s?: number; a?: number; sx?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${sx ?? s} ${s})`}>{children}</g>
);
const line = (pts: P[]) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
const poly = (pts: P[]) => line(pts) + 'Z';

/** El bileğini, elin verilen noktası hedefe gelecek şekilde konumlar. */
function handAt<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

/** Ölçü çizgisi: iki uçta dik çentik + ortada etiket */
function Dim({ a, b, text, off = 0, size = 13, c = K.ink, lx, ly }: { a: P; b: P; text?: string; off?: number; size?: number; c?: string; lx?: number; ly?: number }) {
  const ang = angOf(a, b);
  const n = ang + 90;
  const A = pol(a, n, off), B = pol(b, n, off);
  const t1 = [pol(A, n, 5), pol(A, n, -5)], t2 = [pol(B, n, 5), pol(B, n, -5)];
  const m = lerp(A, B, 0.5);
  return (
    <g>
      <g stroke="#fff" stroke-width={5} opacity={0.6} stroke-linecap="round">
        <path d={line([A, B])} />
      </g>
      <g stroke={c} stroke-width={2} stroke-linecap="round">
        <path d={line([A, B])} />
        <path d={line(t1)} />
        <path d={line(t2)} />
      </g>
      {text && <Label x={lx ?? m[0]} y={ly ?? m[1]} text={text} size={size} bg={K.ink} />}
    </g>
  );
}

/** Güneş */
function Sun({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f6b81f" stroke-width={3} stroke-linecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const p1 = pol([x, y], i * 36, r + 4), p2 = pol([x, y], i * 36, r + 10);
          return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff3a8" />
    </g>
  );
}

/** Termometre simgesi (yanında etiket) */
function Thermo({ x, y, s = 1, text, hot }: { x: number; y: number; s?: number; text?: string; hot?: boolean }) {
  const fill = hot ? K.danger : K.action;
  return (
    <g>
      <G x={x} y={y} s={s}>
        <OG sh={[{ d: capsule([0, -34], 5, [0, 0], 5), f: K.white }, { d: circ([0, 4], 8), f: K.white }]} />
        <path d={capsule([0, hot ? -28 : -16], 2.6, [0, 2], 2.6)} fill={fill} />
        <circle cx={0} cy={4} r={5.6} fill={fill} />
        {[-26, -20, -14, -8].map((yy) => <rect key={yy} x={2.5} y={yy} width={3} height={1.3} fill={K.ink} />)}
      </G>
      {text && <Label x={x + 14 * s} y={y - 12 * s} text={text} size={13} anchor="start" bg={K.ink} />}
    </g>
  );
}

/** Saat simgesi + etiket */
function Clock({ x, y, r = 12, text }: { x: number; y: number; r?: number; text?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={K.white} stroke={K.out} stroke-width={2} />
      <path d={line([[x, y - r * 0.65], [x, y], [x + r * 0.5, y + r * 0.2]])} stroke={K.ink} stroke-width={2} fill="none" stroke-linecap="round" />
      {text && <Label x={x + r + 4} y={y} text={text} size={13} anchor="start" bg={K.ink} />}
    </g>
  );
}

/** Yaprak şekli: taban, yön, boy, en */
function leaf(b: P, a: number, len: number, wid: number): string {
  const t = pol(b, a, len);
  const m1 = pol(pol(b, a, len * 0.45), a - 90, wid / 2);
  const m2 = pol(pol(b, a, len * 0.45), a + 90, wid / 2);
  return smooth([b, m1, t, m2], true, 0.9);
}
function Leaf({ b, a, len, wid, c = YAPRAK, vein = true }: { b: P; a: number; len: number; wid: number; c?: string; vein?: boolean }) {
  return (
    <g>
      <OG sh={[{ d: leaf(b, a, len, wid), f: c }]} />
      {vein && <path d={line([b, pol(b, a, len * 0.8)])} stroke={shade(c, 0.25)} stroke-width={1.2} fill="none" />}
    </g>
  );
}

/** Fide: gövde + çenek yaprakları (+ gerçek yapraklar) */
function Seedling({ x, y, s = 1, n = 2, c = YAPRAK }: { x: number; y: number; s?: number; n?: number; c?: string }) {
  const top: P = [x, y - 26 * s];
  return (
    <g>
      <path d={smooth([[x, y], [x - 1.5 * s, y - 13 * s], top])} stroke={shade(c, 0.15)} stroke-width={3 * s} fill="none" stroke-linecap="round" />
      <Leaf b={top} a={-160} len={14 * s} wid={8 * s} c={c} vein={false} />
      <Leaf b={top} a={-20} len={14 * s} wid={8 * s} c={c} vein={false} />
      {n > 2 && <Leaf b={[x, y - 17 * s]} a={-130} len={12 * s} wid={7 * s} c={shade(c, 0.05)} vein={false} />}
      {n > 3 && <Leaf b={[x, y - 15 * s]} a={-50} len={12 * s} wid={7 * s} c={shade(c, 0.05)} vein={false} />}
    </g>
  );
}

/** Domates bitkisi (kök dipte x,y) */
function Tomato({ x, y, s = 1, fruits = 4, pale, stake }: { x: number; y: number; s?: number; fruits?: number; pale?: boolean; stake?: boolean }) {
  const c = pale ? '#9cbf7d' : YAPRAK;
  const h = 100 * s;
  const st: P[] = [[x, y], [x + 3 * s, y - h * 0.3], [x - 2 * s, y - h * 0.62], [x + 1 * s, y - h]];
  const fr: P[] = [[x - 16, y - 40], [x + 15, y - 52], [x - 12, y - 68], [x + 13, y - 30], [x + 4, y - 82], [x - 20, y - 22]].map(([a, b]) => [x + (a - x) * s, y + (b - y) * s] as P);
  return (
    <g>
      {stake && <OG sh={[{ d: rrect(x + 8 * s, y - h - 8 * s, 4 * s, h + 14 * s, 1.5), f: ODUN }]} />}
      <path d={smooth(st)} stroke={shade(c, 0.2)} stroke-width={4 * s} fill="none" stroke-linecap="round" />
      {[0.22, 0.42, 0.62, 0.82].map((t, i) => {
        const b = lerp(st[0], st[3], t);
        const side = i % 2 ? 1 : -1;
        return (
          <g key={i}>
            <Leaf b={b} a={side > 0 ? -30 : -150} len={30 * s} wid={13 * s} c={c} />
            <Leaf b={b} a={side > 0 ? -170 : -10} len={20 * s} wid={10 * s} c={shade(c, 0.08)} />
          </g>
        );
      })}
      <Leaf b={st[3]} a={-90} len={16 * s} wid={9 * s} c={c} />
      {fr.slice(0, fruits).map((p, i) => (
        <g key={i}>
          <OG sh={[{ d: circ(p, 7.5 * s), f: pale ? '#e9a089' : DOMATES }]} />
          <circle cx={p[0] - 2.5 * s} cy={p[1] - 2.5 * s} r={2 * s} fill="#fff" opacity={0.5} />
          <path d={`M${p[0] - 3 * s} ${p[1] - 7 * s}L${p[0]} ${p[1] - 5 * s}L${p[0] + 3 * s} ${p[1] - 7 * s}`} stroke={YAPRAKD} stroke-width={2 * s} fill="none" />
        </g>
      ))}
    </g>
  );
}

/** Toprak kesiti dikdörtgeni (taneli doku) */
function Soil({ x, y, w, h, c = TOPRAK, dots = true, top }: { x: number; y: number; w: number; h: number; c?: string; dots?: boolean; top?: string }) {
  const pts: P[] = [];
  if (dots) for (let i = 0; i < Math.floor((w * h) / 260); i++) pts.push([x + ((i * 37.3) % w), y + 4 + ((i * 53.7) % Math.max(1, h - 6))]);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c} />
      {top && <rect x={x} y={y} width={w} height={4} fill={top} />}
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i % 3 ? 1.1 : 1.7} fill={shade(c, 0.3)} opacity={0.7} />)}
    </g>
  );
}

/** Cam kavanoz (x = orta, y = taban). İçerik children, gövdeye kırpılır. */
function Jar({ x, y, w = 76, h = 104, lid = '#8e99a6', lidOn = true, children, lidA = 0 }: { x: number; y: number; w?: number; h?: number; lid?: string | null; lidOn?: boolean; lidA?: number; children?: ComponentChildren }) {
  const id = uid();
  const body = rrect(x - w / 2, y - h, w, h, 12);
  const nw = w * 0.8;
  return (
    <g>
      <defs><clipPath id={id}><path d={body} /></clipPath></defs>
      <path d={body} fill={CAM} opacity={0.55} />
      <g clip-path={`url(#${id})`}>{children}</g>
      <path d={rrect(x - nw / 2, y - h - 7, nw, 10, 3)} fill={CAM} opacity={0.7} stroke={K.out} stroke-width={1.5} />
      <path d={body} fill="none" stroke={K.out} stroke-width={2.2} />
      <rect x={x - w / 2 + 7} y={y - h + 12} width={5} height={h - 28} rx={2.5} fill="#fff" opacity={0.6} />
      {lid && lidOn && (
        <G x={x} y={y - h - 8} a={lidA}>
          <OG sh={[{ d: rrect(-nw / 2 - 3, -11, nw + 6, 13, 3), f: lid }]} />
          {[-0.3, 0, 0.3].map((t) => <rect key={t} x={t * nw - 1} y={-9} width={2} height={9} fill={shade(lid, 0.2)} />)}
        </G>
      )}
    </g>
  );
}

/** Fasulye tanesi */
function Bean({ x, y, a = 0, s = 1, c = '#efe4cf' }: { x: number; y: number; a?: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[{ d: smooth([[-9, -2], [-4, -6], [5, -6], [9, -1], [6, 5], [-1, 4], [-7, 5]], true), f: c }]} />
      <ellipse cx={-1} cy={2.5} rx={2.6} ry={1.4} fill={shade(c, 0.35)} />
    </G>
  );
}

/** Kürek / bel / yaba / çapa / tırmık: sap a→b, baş b ucunda */
function Tool({ a, b, head = 'shovel', w = 3.4 }: { a: P; b: P; head?: 'shovel' | 'spade' | 'fork' | 'hoe' | 'rake' | 'none' | 'rod'; w?: number }) {
  const ang = angOf(a, b);
  const sh: Sh[] = [{ d: capsule(a, w, b, w), f: head === 'rod' ? DEMIR : ODUN }];
  const hd: JSX.Element[] = [];
  const at = (l: number, k: number) => pol(pol(b, ang, l), ang + 90, k);
  if (head === 'shovel' || head === 'spade') {
    const sq = head === 'spade';
    const blade = sq
      ? poly([at(-4, -11), at(-4, 11), at(30, 11), at(32, 0), at(30, -11)])
      : smooth([at(-4, -12), at(18, -14), at(36, 0), at(18, 14), at(-4, 12)], true);
    sh.push({ d: blade, f: DEMIR });
  } else if (head === 'fork') {
    sh.push({ d: capsule(at(0, -13), 2.4, at(0, 13), 2.4), f: DEMIR });
    for (const k of [-13, -4.3, 4.3, 13]) sh.push({ d: capsule(at(0, k), 2, at(30, k), 1.2), f: DEMIR });
  } else if (head === 'hoe') {
    sh.push({ d: poly([at(-3, -3), at(-3, 3), at(2, 26), at(-12, 26), at(-12, 18)]), f: DEMIR });
  } else if (head === 'rake') {
    sh.push({ d: capsule(at(0, -22), 2.6, at(0, 22), 2.6), f: DEMIR });
    for (let k = -20; k <= 20; k += 6.6) sh.push({ d: capsule(at(0, k), 1.4, at(-10, k), 1.2), f: DEMIR });
  }
  return <g><OG sh={sh} />{hd}</g>;
}

/** Orak: sap ucu h, bıçak yönü a (derece) */
function Sickle({ h, a = 0, s = 1 }: { h: P; a?: number; s?: number }) {
  return (
    <G x={h[0]} y={h[1]} a={a} s={s}>
      <OG sh={[
        { d: capsule([-22, 0], 3.6, [0, 0], 3.2), f: ODUN },
        { d: 'M0 -3C18 -10 40 -6 46 14C48 22 44 30 38 32C42 20 36 6 22 2C14 0 6 2 0 3Z', f: DEMIR },
      ]} />
      <path d="M8 -3C24 -7 38 -2 43 12" stroke="#e7edf2" stroke-width={1.6} fill="none" />
    </G>
  );
}

/** Kova (x = orta, y = taban) */
function Bucket({ x, y, s = 1, c = '#8e99a6', fill }: { x: number; y: number; s?: number; c?: string; fill?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-18 -34C-18 -52 18 -52 18 -34" stroke={K.out} stroke-width={2} fill="none" />
      <OG sh={[{ d: poly([[-18, -34], [18, -34], [14, 0], [-14, 0]]), f: c }, { d: ell([0, -34], 18, 5), f: fill ?? shade(c, 0.3) }]} />
      <rect x={-15} y={-26} width={30} height={2} fill={shade(c, 0.2)} />
    </G>
  );
}

/** Kalbur (yandan, x orta, y çember alt kenarı) */
function Sieve({ x, y, w = 80, a = 0 }: { x: number; y: number; w?: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: rrect(-w / 2, -14, w, 14, 3), f: ODUN }]} />
      <path d={`M${-w / 2 + 2} -2H${w / 2 - 2}`} stroke={K.ink} stroke-width={1} stroke-dasharray="2 2" />
    </G>
  );
}

/** Mısır sapı (yandan; x,y dip) */
function Corn({ x, y, h = 150, s = 1, cob = true }: { x: number; y: number; h?: number; s?: number; cob?: boolean }) {
  const top: P = [x, y - h];
  const lv = [0.25, 0.4, 0.55, 0.7, 0.85];
  return (
    <g>
      <OG sh={[{ d: capsule([x, y], 3.4 * s, top, 2 * s), f: '#7fb04f' }]} />
      {lv.map((t, i) => {
        const b: P = [x, y - h * t];
        const side = i % 2 ? 1 : -1;
        const p1 = [b, pol(b, side > 0 ? -40 : -140, 26 * s), pol(b, side > 0 ? -5 : -175, 46 * s), pol(b, side > 0 ? 18 : 162, 54 * s)] as P[];
        return <path key={i} d={smooth(p1)} stroke={K.out} stroke-width={7 * s} fill="none" stroke-linecap="round" />;
      })}
      {lv.map((t, i) => {
        const b: P = [x, y - h * t];
        const side = i % 2 ? 1 : -1;
        const p1 = [b, pol(b, side > 0 ? -40 : -140, 26 * s), pol(b, side > 0 ? -5 : -175, 46 * s), pol(b, side > 0 ? 18 : 162, 54 * s)] as P[];
        return <path key={'i' + i} d={smooth(p1)} stroke={i % 2 ? '#6aa845' : '#7cbb52'} stroke-width={4.4 * s} fill="none" stroke-linecap="round" />;
      })}
      {cob && (
        <G x={x + 5 * s} y={y - h * 0.5} a={-20} s={s}>
          <OG sh={[{ d: ell([0, -10], 6, 15), f: '#f2cf55' }, { d: smooth([[-6, 6], [-8, -8], [-2, -24], [2, -6], [6, 6]], true), f: '#9cc46a' }]} />
          <path d="M0 -26l-3 -8M0 -26l2 -9M0 -26l5 -6" stroke="#b5763f" stroke-width={1.5} />
        </G>
      )}
      <path d={`M${top[0]} ${top[1]}l-8 -12M${top[0]} ${top[1]}l0 -14M${top[0]} ${top[1]}l8 -12`} stroke="#c9a24a" stroke-width={2.5 * s} stroke-linecap="round" />
    </g>
  );
}

/** Buğday sapı + başak (x,y dip). bow: başağın öne eğikliği (derece) */
function Wheat({ x, y, h = 110, s = 1, bow = 0, c = BUGDAY, green }: { x: number; y: number; h?: number; s?: number; bow?: number; c?: string; green?: boolean }) {
  const col = green ? '#9cc46a' : c;
  const top: P = [x + bow * 0.25, y - h];
  const ea = -90 + bow;
  const grains: JSX.Element[] = [];
  for (let i = 0; i < 6; i++) {
    const p = pol(top, ea, i * 5.2 * s);
    for (const sd of [-1, 1]) {
      const q = pol(p, ea + 90 * sd, 2.6 * s);
      grains.push(<ellipse key={i + '' + sd} cx={q[0]} cy={q[1]} rx={2.6 * s} ry={4 * s} transform={`rotate(${f1(ea + 90 + sd * 25)} ${f1(q[0])} ${f1(q[1])})`} fill={col} stroke={K.out} stroke-width={1} />);
      const aw = pol(q, ea + sd * 18, 12 * s);
      grains.push(<path key={'a' + i + sd} d={line([q, aw])} stroke={shade(col, 0.2)} stroke-width={0.9} />);
    }
  }
  return (
    <g>
      <path d={smooth([[x, y], [x + bow * 0.05, y - h * 0.5], top])} stroke={shade(col, 0.15)} stroke-width={2.2 * s} fill="none" />
      <Leaf b={[x, y - h * 0.3]} a={-60} len={26 * s} wid={4 * s} c={green ? '#8cbf5a' : '#d6b44f'} vein={false} />
      {grains}
      <path d={line([top, pol(top, ea, 28 * s)])} stroke={shade(col, 0.3)} stroke-width={1.5} />
    </g>
  );
}

/** Patates yumrusu */
function Tuber({ x, y, s = 1, a = 0, sprout }: { x: number; y: number; s?: number; a?: number; sprout?: boolean }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[{ d: smooth([[-16, 0], [-10, -10], [6, -11], [16, -3], [12, 9], [-4, 10], [-14, 7]], true), f: '#d9b16e' }]} />
      <circle cx={-6} cy={-2} r={1.4} fill="#9a7440" />
      <circle cx={7} cy={2} r={1.4} fill="#9a7440" />
      <circle cx={0} cy={6} r={1.2} fill="#9a7440" />
      {sprout && <OG sh={[{ d: capsule([2, -9], 2.8, [3, -20], 2.2), f: '#7d5a8a' }, { d: circ([3, -21], 3), f: '#88b25a' }]} />}
    </G>
  );
}

/** Patates bitkisi (yaprak öbeği) */
function PotatoPlant({ x, y, s = 1, yellow }: { x: number; y: number; s?: number; yellow?: boolean }) {
  const c = yellow ? '#c8b45a' : '#5fa24c';
  return (
    <g>
      {[[-14, -18, -130], [12, -20, -50], [-4, -30, -100], [8, -36, -70], [-12, -34, -120], [16, -8, -20], [-18, -6, -160]].map(([dx, dy, a], i) => (
        <Leaf key={i} b={[x + dx * s * 0.4, y + dy * s * 0.5]} a={a} len={20 * s} wid={11 * s} c={i % 2 ? c : shade(c, 0.08)} vein={false} />
      ))}
      <path d={line([[x, y], [x, y - 20 * s]])} stroke={shade(c, 0.25)} stroke-width={3 * s} />
    </g>
  );
}

/** Lahana / marul */
function Cabbage({ x, y, s = 1, c = '#8cc66b', lettuce }: { x: number; y: number; s?: number; c?: string; lettuce?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG sh={[
        { d: smooth([[-22, 0], [-26, -12], [-14, -22], [0, -24], [14, -22], [26, -12], [22, 0]], true), f: shade(c, 0.1) },
        { d: ell([0, -12], 14, 12), f: lettuce ? tint(c, 0.15) : tint(c, 0.25) },
      ]} />
      <path d="M0 -2V-20M-8 -6L-3 -18M8 -6L3 -18" stroke={shade(c, 0.25)} stroke-width={1.2} fill="none" />
    </G>
  );
}

/** Kabak yaprağı öbeği + çiçek */
function Squash({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const m = flip ? -1 : 1;
  return (
    <g>
      <path d={smooth([[x, y], [x + 40 * m * s, y + 2], [x + 80 * m * s, y + 4]])} stroke="#5f9a3e" stroke-width={3 * s} fill="none" />
      {[[10, -14, 1.1], [34, -10, 1.25], [60, -8, 1], [80, -4, 0.8]].map(([dx, dy, k], i) => (
        <g key={i}>
          <OG sh={[{ d: smooth([[x + dx * m * s - 16 * k * s, y + dy * s], [x + dx * m * s - 12 * k * s, y + (dy - 18 * k) * s], [x + dx * m * s, y + (dy - 24 * k) * s], [x + dx * m * s + 14 * k * s, y + (dy - 16 * k) * s], [x + dx * m * s + 16 * k * s, y + dy * s]], true), f: i % 2 ? '#3f8a3a' : '#4e9b43' }]} />
          <path d={line([[x + dx * m * s, y + dy * s], [x + dx * m * s, y + (dy - 20 * k) * s]])} stroke="#2f6e2c" stroke-width={1} />
        </g>
      ))}
      <OG sh={[{ d: ell([x + 50 * m * s, y - 2 * s], 15 * s, 10 * s), f: '#e9a43a' }]} />
      <path d={`M${x + 40 * m * s} ${y - 6 * s}Q${x + 50 * m * s} ${y - 10 * s} ${x + 60 * m * s} ${y - 6 * s}`} stroke="#c47f22" stroke-width={1.3} fill="none" />
    </g>
  );
}

/** Tahta sandık/kasa (yandan, x sol, y taban) */
function Crate({ x, y, w = 90, h = 34, c = ODUN }: { x: number; y: number; w?: number; h?: number; c?: string }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y - h, w, h, 2), f: c }]} />
      <rect x={x + 2} y={y - h / 2 - 1} width={w - 4} height={2} fill={shade(c, 0.3)} />
      <rect x={x + 6} y={y - h + 2} width={3} height={h - 4} fill={shade(c, 0.2)} />
      <rect x={x + w - 9} y={y - h + 2} width={3} height={h - 4} fill={shade(c, 0.2)} />
    </g>
  );
}

/** Karık/tarla sırtı yandan */
const ridge = (x1: number, x2: number, y: number, h: number) =>
  smooth([[x1, y], [x1 + (x2 - x1) * 0.2, y - h * 0.85], [(x1 + x2) / 2, y - h], [x2 - (x2 - x1) * 0.2, y - h * 0.85], [x2, y]]) + 'Z';

/** Sahne başlığı yerine sol üst köşe küçük etiketi (ölçü vb.) */
function Tag({ x, y, text, c = K.ink, size = 13 }: { x: number; y: number; text: string; c?: string; size?: number }) {
  return <Label x={x} y={y} text={text} size={size} bg={c} />;
}

/** Su damlası */
function Drip({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <OG sh={[{ d: `M${x} ${y - 7 * s}C${x + 5 * s} ${y - 1 * s} ${x + 5 * s} ${y + 4 * s} ${x} ${y + 4 * s}C${x - 5 * s} ${y + 4 * s} ${x - 5 * s} ${y - 1 * s} ${x} ${y - 7 * s}Z`, f: K.water }]} ow={1.1} />;
}

/* ════════════════════════ SAHNELER ════════════════════════ */
export const SCENES: Record<string, () => JSX.Element> = {};
const S = SCENES;

/* ─────────── Toprağını tanı (ADAM, yakın plan eller) ─────────── */
S['sf-th-toprak-serit'] = () => {
  const h = { a: 62, s: 1.5, pose: 'pinch', side: 'R', view: 'back', ...HANDOF('ADAM') } as const;
  const hh = handAt(h, 'pinch', [118, 132]);
  const p0: P = [118, 132];
  const rib: P[] = [p0, [150, 128], [182, 130], [206, 140], [218, 156]];
  return (
    <Scene2 bg="closeup">
      {/* cetvel */}
      <G x={112} y={190}>
        <OG sh={[{ d: rrect(0, 0, 150, 24, 3), f: '#f2d27a' }]} />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={6 + i * 11.5} y={0} width={1.4} height={i % 2 ? 6 : 11} fill={K.ink} />)}
      </G>
      <path d={smooth(rib)} stroke={K.out} stroke-width={15} fill="none" stroke-linecap="round" />
      <path d={smooth(rib)} stroke={KIL} stroke-width={12} fill="none" stroke-linecap="round" />
      <path d={smooth(rib.map(([a, b]) => [a, b - 3] as P))} stroke={tint(KIL, 0.25)} stroke-width={2.5} fill="none" stroke-linecap="round" />
      <Hand {...hh} arm={200} />
      {/* ölçü işaretleri: 2,5 ve 5 cm */}
      <path d="M147 182V146M204 182V150" stroke={K.ink} stroke-width={2} stroke-dasharray="4 3" />
      <Label x={147} y={226} text="2,5 cm" size={13} bg={K.ink} />
      <Label x={210} y={226} text="5 cm" size={13} bg={K.ink} />
      <Arrow from={[150, 100]} to={[212, 108]} bend={0.15} />
    </Scene2>
  );
};

S['sf-th-toprak-kavanoz'] = () => {
  const jx = 160, jy = 214;
  const hl = { a: 20, s: 1.15, pose: 'open', side: 'L', view: 'back', ...HANDOF('ADAM') } as const;
  const hr = { a: -20, s: 1.15, pose: 'open', side: 'R', view: 'back', ...HANDOF('ADAM') } as const;
  return (
    <Scene2 bg="closeup">
      <Jar x={jx} y={jy} w={92} h={130}>
        <rect x={jx - 50} y={jy - 130} width={100} height={130} fill="#a78a68" opacity={0.85} />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={jx - 40 + ((i * 23) % 80)} cy={jy - 120 + ((i * 41) % 116)} r={1.4} fill={TOPRAKD} opacity={0.6} />)}
      </Jar>
      <Hand {...hl} x={jx + 52} y={jy - 10} a={-10} arm={160} />
      <Hand {...hr} x={jx - 52} y={jy - 10} a={10} arm={160} />
      <Arrow from={[48, 150]} to={[48, 70]} w={5} />
      <Arrow from={[48, 90]} to={[48, 170]} w={5} />
      <Arrow from={[272, 150]} to={[272, 70]} w={5} />
      <Arrow from={[272, 90]} to={[272, 170]} w={5} />
    </Scene2>
  );
};

S['sf-th-toprak-kavanoz-katlar'] = () => {
  const jx = 150, jy = 214, h = 150, w = 100;
  const b = jy - 4;
  const kum = 44, mil = 28, kil = 22;
  const yK = b - kum, yM = yK - mil, yC = yM - kil;
  const mark = (yy: number, t: string) => (
    <g>
      <path d={line([[jx + w / 2 - 2, yy], [jx + w / 2 + 12, yy]])} stroke={K.danger} stroke-width={3} stroke-linecap="round" />
      <Label x={jx + w / 2 + 18} y={yy} text={t} size={13} anchor="start" bg={K.ink} />
    </g>
  );
  return (
    <Scene2 bg="closeup">
      <rect x={0} y={jy} width={320} height={26} fill="#c9a27a" />
      <rect x={0} y={jy} width={320} height={3} fill="#b48c63" />
      <Jar x={jx} y={jy} w={w} h={h} lid={null}>
        <rect x={jx - 60} y={jy - h} width={120} height={h} fill="#cfe3ec" />
        <rect x={jx - 60} y={yC} width={120} height={kil} fill={KIL} />
        <rect x={jx - 60} y={yM} width={120} height={mil} fill={MIL} />
        <rect x={jx - 60} y={yK} width={120} height={kum + 10} fill={KUM} />
        {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={jx - 48 + ((i * 17) % 96)} cy={yK + 4 + ((i * 29) % (kum - 6))} r={1.6} fill={shade(KUM, 0.3)} />)}
        {[[-30, 0], [-8, 3], [12, -1], [30, 2]].map(([dx, dy], i) => <ellipse key={i} cx={jx + dx} cy={jy - h + 22 + dy} rx={5} ry={2} fill="#3a2a1e" />)}
      </Jar>
      {mark(yK, '1 dk')}
      {mark(yM, '2 sa')}
      {mark(yC, '48 sa')}
      <text x={jx - w / 2 - 8} y={yK + kum / 2 + 5} text-anchor="end" font-size={15} font-weight={700} fill={K.ink}>kum</text>
      <text x={jx - w / 2 - 8} y={yM + mil / 2 + 5} text-anchor="end" font-size={15} font-weight={700} fill={K.ink}>mil</text>
      <text x={jx - w / 2 - 8} y={yC + kil / 2 + 3} text-anchor="end" font-size={15} font-weight={700} fill={K.ink}>kil</text>
    </Scene2>
  );
};

/* ─────────── Tohum saklama (GENC) ─────────── */
function Envelope({ x, y, a = 0, w = 30, h = 44, c = '#efe2c4' }: { x: number; y: number; a?: number; w?: number; h?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: rrect(-w / 2, -h, w, h, 2), f: c }]} />
      <path d={`M${-w / 2} ${-h}L0 ${-h + 12}L${w / 2} ${-h}`} stroke={shade(c, 0.3)} stroke-width={1.2} fill="none" />
      <rect x={-w / 2 + 5} y={-h + 20} width={w - 10} height={2.4} fill={K.ink} opacity={0.7} />
      <rect x={-w / 2 + 5} y={-h + 27} width={w - 14} height={2.4} fill={K.ink} opacity={0.5} />
    </G>
  );
}
S['sf-th-tohum-kavanoz'] = () => {
  const jx = 150, jy = 206;
  const lidY = jy - 130 - 8;
  const h = { a: -90, s: 1.25, pose: 'hold', side: 'R', view: 'back', grip: 20, ...HANDOF('GENC') } as const;
  const hh = handAt(h, 'grip', [jx + 30, lidY - 4]);
  return (
    <Scene2 bg="indoor" wall="#7d7f8f" gy={206}>
      <rect x={0} y={206} width={320} height={34} fill="#8a6a4c" />
      <rect x={0} y={206} width={320} height={5} fill="#a8825d" />
      <Jar x={jx} y={jy} w={110} h={130}>
        <Envelope x={jx - 30} y={jy - 4} a={-6} />
        <Envelope x={jx + 2} y={jy - 4} a={3} c="#e8d3a8" />
        <Envelope x={jx + 30} y={jy - 6} a={8} c="#f3e8d0" />
        <OG sh={[{ d: smooth([[jx - 14, jy - 52], [jx - 18, jy - 76], [jx - 4, jy - 84], [jx + 10, jy - 76], [jx + 8, jy - 52]], true), f: K.cloth }]} />
        <path d={`M${jx - 14} ${jy - 72}H${jx + 9}`} stroke="#8a6a4c" stroke-width={3} stroke-linecap="round" fill="none" />
        {[[jx - 10, jy - 62], [jx - 2, jy - 66], [jx + 3, jy - 58], [jx - 7, jy - 56]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={2.6} ry={1.4} fill="#e9dcc0" stroke={shade(K.cloth, 0.3)} stroke-width={0.8} />)}
      </Jar>
      <Hand {...hh} arm={200} />
      <Arrow from={[jx - 70, lidY - 34]} to={[jx - 10, lidY - 44]} bend={-0.25} w={5} />
    </Scene2>
  );
};

/** Nemli bez üstünde 10 tohum (yukarıdan). roots: kök vermiş tohumların indisleri */
function SeedCloth({ roots, fold }: { roots?: number[]; fold?: boolean }) {
  const pts: P[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) pts.push([88 + c * 36, 132 + r * 44]);
  return (
    <g>
      <OG sh={[{ d: rrect(60, fold ? 106 : 56, 200, fold ? 116 : 166, 4), f: '#c7d6df' }]} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={64} y={(fold ? 116 : 66) + i * 28} width={192} height={1.4} fill="#aebfca" />)}
      {pts.map((p, i) => {
        const on = roots?.includes(i);
        return (
          <g key={i}>
            {on && <path d={smooth([[p[0] + 6, p[1] + 2], [p[0] + 12, p[1] + 10], [p[0] + 9, p[1] + 20], [p[0] + 14, p[1] + 26]])} stroke={K.out} stroke-width={4.6} fill="none" stroke-linecap="round" />}
            {on && <path d={smooth([[p[0] + 6, p[1] + 2], [p[0] + 12, p[1] + 10], [p[0] + 9, p[1] + 20], [p[0] + 14, p[1] + 26]])} stroke="#fbf6e6" stroke-width={2.4} fill="none" stroke-linecap="round" />}
            <Bean x={p[0]} y={p[1]} a={-20} s={1.15} />
          </g>
        );
      })}
    </g>
  );
}
S['sf-th-cimlenme-testi'] = () => (
  <Scene2 bg="floor">
    <SeedCloth fold />
    {/* katlanan üst yarı */}
    <OG sh={[{ d: poly([[60, 106], [260, 106], [250, 50], [70, 50]]), f: '#d6e2e9' }]} />
    {[0, 1].map((i) => <rect key={i} x={74} y={64 + i * 18} width={172} height={1.4} fill="#aebfca" />)}
    <Arrow from={[284, 50]} to={[284, 160]} bend={-0.35} />
    <Label x={36} y={36} text="10" size={18} />
  </Scene2>
);
S['sf-th-cimlenme-sayim'] = () => (
  <Scene2 bg="floor">
    <SeedCloth roots={[0, 1, 3, 4, 5, 6, 7, 9]} />
    <Bad x={88 + 2 * 36 + 14} y={132 - 14} r={9} />
    <Bad x={88 + 8 * 36 - 180 + 14} y={176 - 14} r={9} />
    <Label x={160} y={34} text="8 / 10" size={18} />
  </Scene2>
);

/* ─────────── Atalık tohum (GENC) ─────────── */
function Flower({ x, y, r = 34, a = 0, c = '#f6c13b' }: { x: number; y: number; r?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={Array.from({ length: 5 }, (_, i) => ({ d: leaf([0, 0], i * 72 - 90, r, r * 0.8), f: i % 2 ? c : shade(c, 0.06) }))} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={line([pol([0, 0], i * 72 - 90, r * 0.2), pol([0, 0], i * 72 - 90, r * 0.8)])} stroke={shade(c, 0.25)} stroke-width={1.2} />)}
      <circle cx={0} cy={0} r={r * 0.24} fill="#e5a21f" stroke={K.out} stroke-width={1.3} />
    </G>
  );
}
S['sf-th-elle-tozlama'] = () => {
  const fc: P = [120, 120];
  const tip: P = [126, 116];
  const end: P = [214, 70];
  const h = { a: -125, s: 1.2, pose: 'pinch', side: 'R', view: 'back', ...HANDOF('GENC') } as const;
  const hh = handAt(h, 'pinch', end);
  return (
    <Scene2 bg="outdoor" ground="grass" gy={214}>
      {/* dişi çiçek: altında küçük kabak */}
      <path d={smooth([[40, 230], [52, 200], [70, 186]])} stroke="#5f9a3e" stroke-width={5} fill="none" />
      <G x={88} y={170} a={-40}>
        <OG sh={[{ d: ell([0, 0], 24, 11), f: '#7fb04f' }]} />
        {[-12, 0, 12].map((dx) => <path key={dx} d={`M${dx - 4} -9Q${dx} 0 ${dx - 4} 9`} stroke="#5d8f3a" stroke-width={2} fill="none" />)}
      </G>
      <Flower x={fc[0]} y={fc[1]} r={46} a={10} />
      {/* erkek çiçek: yaprakları soyulmuş, başçık dişinin ortasında */}
      <path d={line([end, lerp(end, tip, 0.86)])} stroke={K.out} stroke-width={7} stroke-linecap="round" />
      <path d={line([end, lerp(end, tip, 0.86)])} stroke="#7fb04f" stroke-width={4} stroke-linecap="round" />
      <OG sh={[{ d: capsule(lerp(end, tip, 0.8), 4.2, tip, 5), f: '#f2b32a' }]} />
      <Hand {...hh} arm={200} />
      <Arrow from={[90, 40]} to={[116, 98]} />
    </Scene2>
  );
};
S['sf-th-tohum-bitki-isaret'] = () => {
  const px = 150, py = 214;
  const tie: P = [px + 2, py - 52];
  const p: PersonProps = { ...CAST.GENC, x: 222, y: 224, flip: true, pose: { ...POSE.kneelOne, spine: -80, head: -100, armF: { to: [tie[0] + 4, tie[1]] }, armB: { at: 'kneeF', d: [2, -4] }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={196}>
      <rect x={0} y={206} width={320} height={16} fill={TOPRAK} opacity={0.5} />
      <Tomato x={56} y={214} s={0.78} fruits={1} pale />
      <Tomato x={px} y={py} s={1.3} fruits={6} />
      <Tomato x={292} y={214} s={0.72} fruits={1} pale />
      <path d={`M${tie[0] - 5} ${tie[1] - 2}h10M${tie[0] + 3} ${tie[1]}l8 10M${tie[0] + 3} ${tie[1]}l12 4`} stroke={K.out} stroke-width={5} stroke-linecap="round" />
      <path d={`M${tie[0] - 5} ${tie[1] - 2}h10M${tie[0] + 3} ${tie[1]}l8 10M${tie[0] + 3} ${tie[1]}l12 4`} stroke="#3a7fd0" stroke-width={3} stroke-linecap="round" />
      <Person {...p} />
      <Arrow from={[104, 100]} to={[138, 136]} />
    </Scene2>
  );
};
S['sf-th-domates-tohum-mayalama'] = () => {
  const jx = 190, jy = 214, jh = 120;
  const top = jy - jh + 26;
  return (
    <Scene2 bg="closeup">
      <rect x={0} y={jy} width={320} height={26} fill="#c9a27a" />
      <rect x={0} y={jy} width={320} height={3} fill="#b48c63" />
      {/* kesik domates */}
      <G x={70} y={196}>
        <OG sh={[{ d: ell([0, 0], 34, 30), f: DOMATES }, { d: ell([0, 0], 26, 22), f: '#f07a5c' }]} />
        {[[-12, -6], [12, -6], [0, 10]].map(([dx, dy], i) => (
          <g key={i}>
            <ellipse cx={dx} cy={dy} rx={8} ry={6} fill="#f6c46a" stroke={shade('#f07a5c', 0.3)} stroke-width={1} />
            {[-3, 0, 3].map((k) => <ellipse key={k} cx={dx + k} cy={dy + (k ? 1 : -1)} rx={1.4} ry={2} fill="#efe2b0" stroke="#b58a3c" stroke-width={0.6} />)}
          </g>
        ))}
      </G>
      <Jar x={jx} y={jy} w={92} h={jh} lid={null}>
        <rect x={jx - 50} y={top} width={100} height={jh} fill="#e8a27f" opacity={0.75} />
        {/* küf tabakası */}
        <path d={smooth([[jx - 50, top + 2], [jx - 30, top - 4], [jx - 10, top + 2], [jx + 10, top - 3], [jx + 30, top + 2], [jx + 50, top - 2], [jx + 50, top + 12], [jx - 50, top + 12]], true)} fill="#f4f1e4" stroke={K.out} stroke-width={1.2} />
        {[[-30, 4], [-6, 6], [18, 3], [36, 6]].map(([dx, dy], i) => <circle key={i} cx={jx + dx} cy={top + dy} r={2.6} fill="#c9cdb9" />)}
        {/* dipte iyi tohumlar */}
        {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={jx - 38 + (i % 8) * 11} cy={jy - 8 - Math.floor(i / 8) * 6} rx={4.5} ry={2.6} fill="#f1e2b4" stroke="#a88a4a" stroke-width={0.8} />)}
      </Jar>
      <Arrow from={[130, 116]} to={[146, 132]} />
      <Label x={250} y={40} text="3–6 gün" size={15} bg={K.ink} />
    </Scene2>
  );
};

/* ─────────── Fide (KADIN) ─────────── */
/** Fide kabı kesiti (yamuk) */
function PotSection({ x, y, w, h, soil = KOMPOST, top = 18 }: { x: number; y: number; w: number; h: number; soil?: string; top?: number }) {
  const id = uid();
  const body = poly([[x, y - h], [x + w, y - h], [x + w - 10, y], [x + 10, y]]);
  return (
    <g>
      <defs><clipPath id={id}><path d={body} /></clipPath></defs>
      <path d={body} fill="#e8e1d2" />
      <g clip-path={`url(#${id})`}><Soil x={x} y={y - h + top} w={w} h={h} c={soil} /></g>
      <path d={body} fill="none" stroke={K.out} stroke-width={2.4} />
    </g>
  );
}
S['sf-th-fide-ekim-derinlik'] = () => {
  const surf = 96;
  return (
    <Scene2 bg="closeup">
      <PotSection x={50} y={222} w={190} h={140} top={14} />
      {/* büyütülmüş tohum */}
      <G x={130} y={surf + 46}><Bean x={0} y={0} s={2.1} c="#e7d6a7" /></G>
      <Dim a={[200, surf]} b={[200, surf + 36]} />
      <Label x={248} y={surf + 18} text="2–3 kat" size={14} bg={K.ink} />
      <Dim a={[100, surf + 38]} b={[100, surf + 54]} />
      <Label x={70} y={surf + 46} text="1" size={14} bg={K.ink} />
      <path d={`M100 ${surf + 38}H118M100 ${surf + 54}H118`} stroke={K.ink} stroke-width={1.2} stroke-dasharray="3 2" />
      <path d={`M150 ${surf}H200M150 ${surf + 36}H200`} stroke={K.ink} stroke-width={1.2} stroke-dasharray="3 2" />
    </Scene2>
  );
};
S['sf-th-fide-dipten-sulama'] = () => {
  const ty = 214;
  return (
    <Scene2 bg="indoor" gy={200}>
      {/* tepsi ve su */}
      <rect x={46} y={ty - 22} width={228} height={18} fill={K.water} opacity={0.6} />
      <OG sh={[{ d: poly([[40, ty - 26], [280, ty - 26], [272, ty], [48, ty]]), f: 'none' }]} />
      <path d={poly([[40, ty - 26], [280, ty - 26], [272, ty], [48, ty]])} fill="#8e99a6" opacity={0.35} />
      {[70, 134, 198].map((x, i) => (
        <g key={i}>
          <PotSection x={x} y={ty - 6} w={52} h={64} top={10} />
          <rect x={x + 6} y={ty - 22} width={40} height={16} fill={K.water} opacity={0.45} />
          <Seedling x={x + 26} y={ty - 60} s={1.1} n={i === 1 ? 4 : 3} />
          <Arrow from={[x + 26, ty - 10]} to={[x + 26, ty - 44]} color={K.water} w={4} />
        </g>
      ))}
      <path d={poly([[40, ty - 26], [280, ty - 26], [272, ty], [48, ty]])} fill="none" stroke={K.out} stroke-width={2.4} />
    </Scene2>
  );
};
S['sf-th-fide-derin-dikim'] = () => {
  const gy = 120, x = 140;
  const st: P[] = [[x, 222], [x + 3, 170], [x - 2, gy], [x + 2, 70], [x, 40]];
  const h = { a: 180, s: 1.05, pose: 'press', side: 'R', view: 'back', ...HANDOF('KADIN') } as const;
  return (
    <Scene2 bg="outdoor" gy={gy}>
      <Soil x={0} y={gy} w={320} h={120} c={TOPRAK} />
      <rect x={0} y={gy} width={320} height={3} fill={TOPRAKD} />
      {/* gömülü gövde boyunca yeni kökler */}
      {[136, 156, 176, 196, 214].map((yy, i) => (
        <g key={i} stroke="#efe2c4" stroke-width={2} fill="none" stroke-linecap="round">
          <path d={smooth([[x, yy], [x - 14, yy + 6], [x - 26, yy + 16]])} />
          <path d={smooth([[x + 1, yy + 2], [x + 15, yy + 8], [x + 24, yy + 18]])} />
        </g>
      ))}
      <path d={smooth(st)} stroke={K.out} stroke-width={7.5} fill="none" stroke-linecap="round" />
      <path d={smooth(st)} stroke="#6f9f45" stroke-width={4.5} fill="none" stroke-linecap="round" />
      {[[gy - 14, -150], [gy - 22, -30], [gy - 40, -155], [gy - 50, -25], [gy - 66, -140], [gy - 74, -45]].map(([yy, a], i) => (
        <Leaf key={i} b={[x, yy]} a={a} len={30} wid={14} />
      ))}
      <Leaf b={[x, 42]} a={-90} len={16} wid={9} />
      <Hand {...handAt(h, 'palm', [176, gy - 6])} arm={160} />
      <Dim a={[100, gy]} b={[100, 222]} />
      <Label x={70} y={170} text="2/3" size={15} bg={K.ink} />
      <Thermo x={34} y={60} text="12–15 °C" s={0.9} />
    </Scene2>
  );
};

/* ─────────── Kompost (ADAM) ─────────── */
const KAHVE = '#a06f3c';
const YESIL = '#6aa845';
/** Kompost yığını kesiti: x1..x2 taban, y taban, h yükseklik */
function CompostPile({ x1, x2, y, h, layers = true, steam }: { x1: number; x2: number; y: number; h: number; layers?: boolean; steam?: boolean }) {
  const id = uid();
  const body = smooth([[x1, y], [x1 + 14, y - h * 0.6], [x1 + 40, y - h * 0.97], [(x1 + x2) / 2, y - h], [x2 - 40, y - h * 0.97], [x2 - 14, y - h * 0.6], [x2, y]]) + 'Z';
  const bands: JSX.Element[] = [];
  if (layers) {
    let yy = y;
    bands.push(<rect key="d" x={x1} y={y - 22} width={x2 - x1} height={22} fill="#6b4a2c" />);
    for (let i = 0; i < 10; i++) bands.push(<path key={'tw' + i} d={line([[x1 + 8 + i * ((x2 - x1) / 10), y - 4], [x1 + 24 + i * ((x2 - x1) / 10), y - 18]])} stroke="#3b2a1a" stroke-width={2.4} />);
    yy = y - 22;
    let k = 0;
    while (yy > y - h - 4) {
      const brown = k % 2 === 0;
      const th = brown ? 24 : 9;
      bands.push(<rect key={'b' + k} x={x1} y={yy - th} width={x2 - x1} height={th} fill={brown ? KAHVE : YESIL} />);
      if (brown) for (let j = 0; j < 8; j++) bands.push(<path key={'s' + k + j} d={line([[x1 + 10 + j * ((x2 - x1) / 8), yy - 6], [x1 + 22 + j * ((x2 - x1) / 8), yy - 14]])} stroke={shade(KAHVE, 0.25)} stroke-width={1.6} />);
      yy -= th;
      k++;
    }
  } else {
    bands.push(<rect key="m" x={x1} y={y - h - 4} width={x2 - x1} height={h + 4} fill="#6b4a2c" />);
    for (let j = 0; j < 40; j++) bands.push(<circle key={j} cx={x1 + 10 + ((j * 37) % (x2 - x1 - 20))} cy={y - 6 - ((j * 23) % (h - 12))} r={2} fill={j % 3 ? '#4b3324' : '#8a6a3e'} />);
  }
  return (
    <g>
      <defs><clipPath id={id}><path d={body} /></clipPath></defs>
      <g clip-path={`url(#${id})`}>{bands}</g>
      <path d={body} fill="none" stroke={K.out} stroke-width={2.4} />
      {steam && [x1 + (x2 - x1) * 0.35, x1 + (x2 - x1) * 0.55, x1 + (x2 - x1) * 0.72].map((sx, i) => (
        <path key={i} d={smooth([[sx, y - h - 4], [sx - 6, y - h - 16], [sx + 4, y - h - 28], [sx - 3, y - h - 40]])} stroke="#ffffff" stroke-width={4} fill="none" stroke-linecap="round" opacity={0.85} />
      ))}
    </g>
  );
}
S['sf-th-kompost-katlar'] = () => (
  <Scene2 bg="outdoor" gy={214}>
    <CompostPile x1={110} x2={290} y={220} h={150} />
    <Dim a={[300, 220]} b={[300, 70]} />
    <Label x={300} y={145} text="1 m" size={13} bg={K.ink} />
    <Bucket x={30} y={226} s={0.85} fill={KAHVE} />
    <Bucket x={68} y={226} s={0.85} fill={KAHVE} />
    <Bucket x={50} y={180} s={0.85} fill={YESIL} />
    <Label x={52} y={120} text="2–3 : 1" size={14} bg={K.ink} />
  </Scene2>
);
S['sf-th-kompost-sikma'] = () => {
  const h = { a: 90, s: 1.7, pose: 'fist', side: 'R', view: 'back', ...HANDOF('ADAM') } as const;
  const hh = { ...h, x: 100, y: 120 };
  const pc = handPoint(hh, 'grip');
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: smooth([[pc[0] + 18, pc[1] - 26], [pc[0] + 34, pc[1] - 22], [pc[0] + 36, pc[1] - 6], [pc[0] + 22, pc[1] - 10]], true), f: KOMPOST }]} />
      <OG sh={[{ d: smooth([[pc[0] - 4, pc[1] + 20], [pc[0] + 10, pc[1] + 28], [pc[0] + 26, pc[1] + 22], [pc[0] + 12, pc[1] + 16]], true), f: KOMPOST }]} />
      <Hand {...hh} arm={200} />
      <Drip x={pc[0] + 10} y={pc[1] + 54} s={1.5} />
      <Drip x={pc[0] + 22} y={pc[1] + 84} s={1.5} />
      <Ok x={262} y={60} r={18} />
      <Label x={250} y={200} text="2 damla" size={14} bg={K.ink} />
    </Scene2>
  );
};
S['sf-th-kompost-sicaklik'] = () => {
  const rodTop: P = [176, 96];
  const rodIn: P = [214, 186];
  const p: PersonProps = { ...CAST.ADAM, x: 110, y: 224, pose: { ...POSE.standSide, spine: -84, armF: { to: [rodTop[0] - 2, rodTop[1] + 8] }, armB: { to: [rodTop[0] + 6, rodTop[1] + 26] }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={210}>
      <CompostPile x1={150} x2={318} y={222} h={110} layers={false} steam />
      <Person {...p} mid={() => <Tool a={rodTop} b={rodIn} head="rod" w={2.6} />} />
      <path d={smooth([[rodTop[0] + 14, rodTop[1] + 30], [rodTop[0] + 6, rodTop[1] + 18], [rodTop[0] + 14, rodTop[1] + 6]])} stroke="#fff" stroke-width={3} fill="none" opacity={0.8} />
      <Thermo x={46} y={60} text="50–65 °C" hot />
    </Scene2>
  );
};

/* ─────────── Gübre (ADAM) ─────────── */
const GUBRE = '#5a4130';
function ManurePile({ x1, x2, y, h, tarp }: { x1: number; x2: number; y: number; h: number; tarp?: boolean }) {
  const body = smooth([[x1, y], [x1 + 20, y - h * 0.7], [(x1 + x2) / 2, y - h], [x2 - 20, y - h * 0.7], [x2, y]]) + 'Z';
  const tp = smooth([[x1 + 6, y - h * 0.45], [x1 + 22, y - h * 0.78], [(x1 + x2) / 2, y - h - 4], [x2 - 22, y - h * 0.78], [x2 - 6, y - h * 0.45], [x2 - 26, y - h * 0.5], [(x1 + x2) / 2, y - h * 0.62], [x1 + 26, y - h * 0.5]], true);
  return (
    <g>
      <OG sh={[{ d: body, f: GUBRE }]} />
      {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={x1 + 20 + ((i * 31) % (x2 - x1 - 40))} cy={y - 6 - ((i * 17) % (h * 0.5))} r={2.2} fill={i % 2 ? '#3f2d20' : '#7a5c3c'} />)}
      {tarp && <OG sh={[{ d: tp, f: '#4f7fb0' }]} />}
    </g>
  );
}
S['sf-th-gubre-yigin'] = () => {
  const grip1: P = [138, 112], blade: P = [196, 150];
  const p: PersonProps = { ...CAST.ADAM, x: 96, y: 224, pose: { ...POSE.standSide, spine: -76, chest: -70, armB: { to: grip1 }, armF: { to: lerp(grip1, blade, 0.42) }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={208} ground="dirt">
      <rect x={130} y={214} width={190} height={10} fill="#8f8a80" />
      <ManurePile x1={150} x2={316} y={218} h={100} tarp />
      {[220, 250, 280].map((sx, i) => <path key={i} d={smooth([[sx, 112], [sx - 6, 98], [sx + 4, 86], [sx - 3, 74]])} stroke="#fff" stroke-width={3.5} fill="none" stroke-linecap="round" opacity={0.8} />)}
      <Person {...p} mid={() => <Tool a={grip1} b={blade} head="spade" />} />
      <Thermo x={30} y={56} text="60 °C" hot s={0.9} />
      <Label x={272} y={40} text="3 ay" size={15} bg={K.ink} />
    </Scene2>
  );
};
function Wheelbarrow({ x, y, s = 1, load = GUBRE }: { x: number; y: number; s?: number; load?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-46 -40L-62 -22" stroke={K.out} stroke-width={5} stroke-linecap="round" />
      <path d="M-46 -40L-62 -22" stroke={ODUN} stroke-width={3} stroke-linecap="round" />
      <OG sh={[{ d: smooth([[-50, -46], [-30, -58], [0, -60], [26, -54], [36, -44]], false) + 'L28 -44Z', f: load }]} />
      <OG sh={[{ d: poly([[-56, -46], [40, -46], [24, -18], [-40, -18]]), f: '#3f7fb0' }, { d: capsule([-30, -18], 2.4, [-34, 0], 2.4), f: DEMIR }]} />
      <OG sh={[{ d: circ([30, -10], 12), f: '#3b3537' }, { d: circ([30, -10], 4), f: DEMIR }]} />
    </G>
  );
}
S['sf-th-gubre-serpme'] = () => {
  const g1: P = [118, 132], blade: P = [180, 118];
  const p: PersonProps = { ...CAST.ADAM, x: 100, y: 222, pose: { ...POSE.standSide, spine: -82, legB: [100, 96], legF: [76, 88], armB: { to: g1 }, armF: { to: lerp(g1, blade, 0.45) }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={176} ground="dirt">
      {/* karıştırılmış koyu şerit ve serpilmiş gübre */}
      <rect x={150} y={176} width={170} height={64} fill={shade(K.dirt, 0.25)} />
      {Array.from({ length: 34 }, (_, i) => <ellipse key={i} cx={150 + ((i * 29) % 166)} cy={186 + ((i * 13) % 48)} rx={4} ry={2.4} fill={GUBRE} />)}
      <Wheelbarrow x={52} y={226} s={0.8} />
      <Person {...p} mid={() => <g><Tool a={g1} b={blade} head="shovel" /><ellipse cx={blade[0] + 16} cy={blade[1] - 3} rx={12} ry={5} fill={GUBRE} /></g>} />
      {[[214, 104], [236, 118], [252, 140], [226, 134], [262, 160]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={5} ry={3.4} fill={GUBRE} stroke={K.out} stroke-width={1} />)}
      <Arrow from={[200, 84]} to={[276, 146]} bend={0.3} />
      <Label x={252} y={40} text="1–4 kg/m²" size={15} bg={K.ink} />
    </Scene2>
  );
};
S['sf-th-kul-serpme'] = () => {
  const hand: P = [168, 132];
  const p: PersonProps = { ...CAST.ADAM, glasses: true, x: 104, y: 224, pose: { ...POSE.standSide, spine: -80, chest: -76, head: -70, armF: { to: hand }, armB: [100, 96], handF: 'fist', face: 'neutral' } };
  const r = rig(p);
  const glove = '#4f5866';
  return (
    <Scene2 bg="outdoor" gy={196} ground="dirt">
      <rect x={130} y={214} width={170} height={6} fill="#b9b5ad" />
      <Bucket x={58} y={228} s={0.9} fill="#b9b5ad" />
      <Person {...p} over={(rr) => (
        <g>
          <circle cx={rr.handF[0]} cy={rr.handF[1]} r={7.5} fill={glove} stroke={K.out} stroke-width={1.5} />
          <circle cx={rr.handB[0]} cy={rr.handB[1]} r={7} fill={glove} stroke={K.out} stroke-width={1.5} />
          <path d={rrect(rr.mouth[0] - 9, rr.mouth[1] - 6, 13, 12, 4)} fill="#f4f1ea" stroke={K.out} stroke-width={1.3} />
        </g>
      )} />
      {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={r.handF[0] - 4 + ((i * 7) % 26) + i * 0.6} cy={r.handF[1] + 12 + ((i * 11) % 74)} r={2.5} fill="#6f6c66" />)}
      <Label x={250} y={40} text="0,5 kg/m²" size={15} bg={K.ink} />
    </Scene2>
  );
};

/* ─────────── Filiz (KADIN) ─────────── */
const MERCIMEK = '#e3843a';
function Lentil({ x, y, s = 1, root = 0, a = 0 }: { x: number; y: number; s?: number; root?: number; a?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      {root > 0 && <path d={smooth([[2, 3], [6, 3 + root * 0.4], [3, 3 + root * 0.75], [7, 3 + root]])} stroke={K.out} stroke-width={3.4} fill="none" stroke-linecap="round" />}
      {root > 0 && <path d={smooth([[2, 3], [6, 3 + root * 0.4], [3, 3 + root * 0.75], [7, 3 + root]])} stroke="#fbf6e6" stroke-width={1.8} fill="none" stroke-linecap="round" />}
      <ellipse cx={0} cy={0} rx={5.5} ry={4} fill={MERCIMEK} stroke={K.out} stroke-width={1} />
    </G>
  );
}
S['sf-th-filiz-islatma'] = () => {
  const jx = 140, jy = 214, jh = 132;
  const lt = jy - 30, wt = jy - 30 - 78;
  return (
    <Scene2 bg="closeup">
      <rect x={0} y={jy} width={320} height={26} fill="#c9a27a" />
      <rect x={0} y={jy} width={320} height={3} fill="#b48c63" />
      <Jar x={jx} y={jy} w={100} h={jh} lid={null}>
        <rect x={jx - 60} y={wt} width={120} height={jh} fill={K.water} opacity={0.35} />
        <path d={`M${jx - 60} ${wt}H${jx + 60}`} stroke={K.water} stroke-width={2.5} />
        {Array.from({ length: 44 }, (_, i) => <Lentil key={i} x={jx - 44 + (i % 11) * 8.8} y={jy - 6 - Math.floor(i / 11) * 6} s={0.9} />)}
      </Jar>
      <Dim a={[jx + 64, lt]} b={[jx + 64, wt]} />
      <Label x={jx + 102} y={(lt + wt) / 2} text="3 kat" size={14} bg={K.ink} />
      <Dim a={[jx + 64, jy - 4]} b={[jx + 64, lt]} />
      <Label x={jx + 92} y={jy - 16} text="1" size={13} bg={K.ink} />
      <Clock x={226} y={46} r={14} text="8–12 sa" />
    </Scene2>
  );
};
S['sf-th-filiz-kavanoz'] = () => {
  const c: P = [166, 118];
  return (
    <Scene2 bg="closeup">
      <rect x={0} y={214} width={320} height={26} fill="#c9a27a" />
      <rect x={0} y={214} width={320} height={3} fill="#b48c63" />
      {/* kase */}
      <OG sh={[{ d: smooth([[60, 168], [70, 204], [120, 216], [190, 214], [232, 200], [240, 168]], false) + 'Z', f: '#d9dde3' }]} />
      <ellipse cx={150} cy={170} rx={88} ry={10} fill="#b7bec8" stroke={K.out} stroke-width={1.5} />
      <G x={c[0]} y={c[1]} a={130}>
        <Jar x={0} y={60} w={78} h={120} lid={null}>
          {Array.from({ length: 30 }, (_, i) => <Lentil key={i} x={-30 + (i % 8) * 8.5} y={-56 - Math.floor(i / 8) * 7} s={0.9} root={i % 3 ? 8 : 5} a={(i * 47) % 360} />)}
        </Jar>
        {/* tülbent */}
        <OG sh={[{ d: rrect(-36, -72, 72, 14, 4), f: '#f4f1ea' }]} />
        {[-24, -12, 0, 12, 24].map((k) => <path key={k} d={`M${k} -71V-59`} stroke="#d2ccbe" stroke-width={1.2} />)}
        <rect x={-38} y={-62} width={76} height={5} fill={K.action} stroke={K.out} stroke-width={1} />
      </G>
      <Drip x={214} y={178} s={1.3} />
      <Drip x={222} y={194} s={1} />
      <Arrow from={[110, 56]} to={[196, 140]} color={K.water} w={4} bend={0.2} />
    </Scene2>
  );
};
S['sf-th-filiz-hazir'] = () => {
  return (
    <Scene2 bg="closeup">
      <rect x={0} y={206} width={320} height={34} fill="#c9a27a" />
      <rect x={0} y={206} width={320} height={3} fill="#b48c63" />
      {/* tabakta filizler */}
      <OG sh={[{ d: ell([92, 196], 70, 14), f: '#f4f1ea' }]} />
      {Array.from({ length: 22 }, (_, i) => <Lentil key={i} x={44 + (i % 11) * 9.5} y={186 + Math.floor(i / 11) * 6 - (i % 3) * 2} s={0.9} root={7} a={(i * 61) % 360} />)}
      {/* büyütülmüş tek filiz */}
      <circle cx={222} cy={110} r={66} fill="#fff" stroke={K.out} stroke-width={2} />
      <Lentil x={186} y={86} s={3.4} root={14} a={-12} />
      <Dim a={[198, 102]} b={[220, 148]} off={-16} />
      <Label x={268} y={150} text="1–2 cm" size={14} bg={K.ink} />
      <path d="M130 178L162 150" stroke={K.out} stroke-width={1.5} stroke-dasharray="4 3" />
    </Scene2>
  );
};

/* ─────────── Yazlık ekim takvimi (KADIN) ─────────── */
function PlumTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <Tree x={x} y={y} s={s} color="#7fb35a" />
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={x - 30 * s + ((i * 17) % (60 * s))} cy={y + 2 + (i % 3) * 3} rx={2.6} ry={1.6} fill="#f6e3ea" stroke="#c9a0b0" stroke-width={0.6} />)}
    </g>
  );
}
S['sf-th-toprak-sicaklik-el'] = () => {
  const gy = 112;
  const h = { a: 172, s: 1.35, pose: 'press', side: 'R', view: 'back', ...HANDOF('KADIN') } as const;
  const tip = handPoint({ ...h, x: 150, y: gy - 4 }, 'tip');
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <PlumTree x={268} y={gy - 2} s={0.75} />
      <Hand {...h} x={150} y={gy - 4} arm={200} />
      <rect x={0} y={gy} width={320} height={128} fill={TOPRAK} opacity={0.5} />
      <rect x={0} y={gy} width={320} height={3} fill={TOPRAKD} />
      <Dim a={[200, gy + 2]} b={[200, tip[1]]} />
      <Label x={240} y={(gy + tip[1]) / 2} text="10 cm" size={13} bg={K.ink} />
      <Thermo x={34} y={52} text="12–15 °C" s={0.9} />
    </Scene2>
  );
};
function PetCover({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-16 0V-30C-16 -40 -7 -44 -6 -50V-56H6V-50C7 -44 16 -40 16 -30V0Z" fill="#e8f6fb" opacity={0.45} stroke={K.out} stroke-width={1.8} />
      <rect x={-7} y={-62} width={14} height={7} rx={1.5} fill="#3a7fd0" stroke={K.out} stroke-width={1.3} />
      <rect x={-12} y={-34} width={3} height={26} rx={1.5} fill="#fff" opacity={0.7} />
    </G>
  );
}
function Snowflake({ x, y, r = 10, c = '#e6f2fb' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g stroke={c} stroke-width={2.4} stroke-linecap="round">
      {[0, 60, 120].map((a) => { const p1 = pol([x, y], a, r), p2 = pol([x, y], a + 180, r); return <line key={a} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />; })}
    </g>
  );
}
S['sf-th-fide-gece-ortu'] = () => (
  <Scene2 bg="night" gy={180}>
    <rect x={0} y={192} width={320} height={48} fill="#3e3127" />
    {[60, 130, 200, 270].map((x) => (
      <g key={x}>
        <Seedling x={x} y={204} s={1.5} n={4} c="#5aa84f" />
        <PetCover x={x} y={206} s={1.3} />
      </g>
    ))}
    <Snowflake x={60} y={50} r={11} />
    <Snowflake x={150} y={70} r={8} />
    <Snowflake x={204} y={36} r={9} />
  </Scene2>
);
S['sf-th-harita-dogu'] = () => {
  const gy = 168;
  return (
    <Scene2 bg="outdoor" gy={gy}>
      {/* karlı dağlar */}
      <path d="M-10 168L60 60L110 120L170 40L240 118L290 70L340 168Z" fill="#8e9bb0" stroke={K.out} stroke-width={1.8} />
      <path d="M60 60L44 86L58 82L70 92L78 88ZM170 40L150 72L166 66L178 78L192 66ZM290 70L276 92L290 88L302 96Z" fill="#fbfbfb" />
      <rect x={0} y={gy} width={320} height={72} fill={K.grass} />
      {/* lahana sıraları */}
      {[0, 1].map((r) => [30, 70, 110].map((x) => <Cabbage key={r + '-' + x} x={x + r * 14} y={190 + r * 30} s={0.7} />))}
      {/* naylon tünel içinde domates */}
      <Tomato x={204} y={216} s={0.55} fruits={3} />
      <Tomato x={250} y={216} s={0.55} fruits={3} />
      <path d="M170 220C170 150 290 150 290 220Z" fill={NAYLON} opacity={0.5} stroke={K.out} stroke-width={2} />
      {[200, 230, 260].map((x) => <path key={x} d={`M${x} ${x === 230 ? 166 : 170}V220`} stroke="#c9d6dd" stroke-width={1.5} opacity={0.8} />)}
      <Label x={250} y={40} text="Haziran" size={15} bg={K.ink} />
    </Scene2>
  );
};

/* ─────────── Kışlık ekim takvimi (KADIN) ─────────── */
function WheatSeedling({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      {[[-6, -72], [0, -90], [6, -108], [-2, -60], [4, -122]].map(([dx, a], i) => (
        <path key={i} d={smooth([[x + dx * 0.3, y], pol([x + dx, y - 18 * s], a, 18 * s), pol([x + dx, y - 18 * s], a + (a < -90 ? -14 : 14), 38 * s)])} stroke={K.out} stroke-width={5 * s} fill="none" stroke-linecap="round" />
      ))}
      {[[-6, -72], [0, -90], [6, -108], [-2, -60], [4, -122]].map(([dx, a], i) => (
        <path key={'i' + i} d={smooth([[x + dx * 0.3, y], pol([x + dx, y - 18 * s], a, 18 * s), pol([x + dx, y - 18 * s], a + (a < -90 ? -14 : 14), 38 * s)])} stroke={i % 2 ? '#6aa845' : '#7cbb52'} stroke-width={3 * s} fill="none" stroke-linecap="round" />
      ))}
      {[-40, -20, 0, 20, 40].map((dx, i) => (
        <path key={'r' + i} d={smooth([[x, y + 2], [x + dx * 0.5 * s, y + 24 * s], [x + dx * s, y + (44 + (i % 2) * 10) * s]])} stroke="#efe2c4" stroke-width={2} fill="none" stroke-linecap="round" />
      ))}
    </g>
  );
}
S['sf-th-bugday-fide-kis'] = () => {
  const gy = 150;
  return (
    <Scene2 bg="outdoor" gy={110} ground="snow">
      <Soil x={0} y={gy} w={320} h={90} c={TOPRAK} />
      <rect x={0} y={110} width={320} height={gy - 110} fill="#f4f8fb" />
      {[70, 160, 250].map((x) => <WheatSeedling key={x} x={x} y={gy} s={1.1} />)}
      <rect x={0} y={110} width={320} height={gy - 110} fill="#f4f8fb" opacity={0.55} />
      <path d={`M0 110H320`} stroke="#c7d6df" stroke-width={2} />
      <Label x={262} y={40} text="3–4 yaprak" size={13} bg={K.ink} />
      <Ok x={34} y={40} r={16} />
    </Scene2>
  );
};
S['sf-th-sarimsak-saman'] = () => {
  const gy = 150;
  const st = 26;
  const h = { a: 160, s: 1.05, pose: 'open', side: 'R', view: 'back', ...HANDOF('KADIN') } as const;
  return (
    <Scene2 bg="outdoor" gy={gy - st}>
      <Soil x={0} y={gy} w={320} h={90} c={TOPRAK} />
      {[50, 110, 170, 230, 290].map((x) => (
        <G key={x} x={x} y={gy + 40}>
          <OG sh={[{ d: 'M0 -26C8 -14 12 -2 8 6C4 10 -4 10 -8 6C-12 -2 -8 -14 0 -26Z', f: '#f3ead6' }]} />
          <path d="M0 -24C2 -12 3 0 1 8" stroke="#d8c8a6" stroke-width={1.2} fill="none" />
        </G>
      ))}
      {/* saman katı (sağda henüz serilmemiş) */}
      <rect x={0} y={gy - st} width={230} height={st} fill={SAMAN} />
      {Array.from({ length: 50 }, (_, i) => { const x0 = (i * 29) % 226, y0 = gy - st + 3 + ((i * 7) % (st - 6)); return <path key={i} d={line([[x0, y0], [x0 + 14, y0 + ((i % 3) - 1) * 4]])} stroke={SAMAND} stroke-width={1.6} />; })}
      <path d={`M0 ${gy - st}H230V${gy}`} stroke={K.out} stroke-width={1.6} fill="none" />
      <Hand {...h} x={262} y={56} arm={160} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={line([[236 + (i % 4) * 10, 110 + Math.floor(i / 4) * 12], [246 + (i % 4) * 10, 114 + Math.floor(i / 4) * 12]])} stroke={SAMAND} stroke-width={2} />)}
      <Dim a={[20, gy - st]} b={[20, gy]} off={-0} />
      <Label x={64} y={gy - st - 18} text="5–10 cm" size={13} bg={K.ink} />
    </Scene2>
  );
};

/* ─────────── Patates (ADAM) ─────────── */
S['sf-th-patates-dikim'] = () => {
  const gy = 120, ty = gy + 28;
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <Soil x={0} y={gy} w={320} h={120} c={TOPRAK} />
      <rect x={0} y={gy} width={320} height={3} fill={TOPRAKD} />
      {[70, 170, 270].map((x) => <Tuber key={x} x={x} y={ty} s={1.3} sprout />)}
      <Dim a={[70, ty + 34]} b={[170, ty + 34]} />
      <Label x={120} y={ty + 58} text="30–40 cm" size={13} bg={K.ink} />
      <Dim a={[214, gy]} b={[214, ty - 4]} />
      <Label x={238} y={gy - 16} text="5 cm" size={13} bg={K.ink} />
      <Arrow from={[170, 40]} to={[170, 96]} />
    </Scene2>
  );
};
S['sf-th-patates-bogaz'] = () => {
  const gy = 176;
  const g1: P = [124, 104], blade: P = [176, 172];
  const p: PersonProps = { ...CAST.ADAM, x: 92, y: 222, pose: { ...POSE.standSide, spine: -72, chest: -66, armB: { to: g1 }, armF: { to: lerp(g1, blade, 0.45) }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      {/* sırt kesiti */}
      <path d={ridge(170, 310, 206, 40)} fill={TOPRAK} stroke={K.out} stroke-width={2} />
      <PotatoPlant x={240} y={168} s={1.1} />
      <Tuber x={222} y={196} s={0.8} />
      <Tuber x={258} y={198} s={0.8} a={20} />
      <Person {...p} mid={() => <Tool a={g1} b={blade} head="hoe" />} />
      <Arrow from={[176, 196]} to={[210, 180]} bend={-0.2} w={5} />
    </Scene2>
  );
};
S['sf-th-patates-hasat'] = () => {
  const gy = 178;
  const g1: P = [150, 96], tip: P = [196, 206];
  const p: PersonProps = { ...CAST.ADAM, x: 116, y: 222, pose: { ...POSE.standSide, spine: -78, chest: -72, armB: { to: g1 }, armF: { to: lerp(g1, tip, 0.3) }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <PotatoPlant x={240} y={190} s={0.9} yellow />
      {[[208, 196, 0], [236, 202, 30], [262, 194, -20], [222, 186, 60]].map(([x, y, a], i) => <Tuber key={i} x={x} y={y} s={0.9} a={a} />)}
      <Person {...p} mid={() => <Tool a={g1} b={tip} head="fork" />} />
      <Crate x={18} y={226} w={70} h={30} />
      {[30, 50, 70].map((x) => <Tuber key={x} x={x} y={194} s={0.7} />)}
      <Arrow from={[196, 140]} to={[218, 104]} bend={-0.2} />
    </Scene2>
  );
};

/* ─────────── Üç kardeş (KADIN) ─────────── */
const hump = (cx: number, y: number, w: number, h: number) =>
  smooth([[cx - w / 2, y], [cx - w * 0.3, y - h * 0.9], [cx - w * 0.12, y - h], [cx, y - h * 0.88], [cx + w * 0.12, y - h], [cx + w * 0.3, y - h * 0.9], [cx + w / 2, y]]) + 'Z';
S['sf-th-uc-kardes-tumsek'] = () => {
  const y = 196;
  return (
    <Scene2 bg="outdoor" gy={186} ground="dirt">
      {[70, 230].map((cx) => <OG key={cx} sh={[{ d: hump(cx, y, 110, 48), f: TOPRAK }]} />)}
      <Dim a={[14, y]} b={[14, y - 48]} />
      <Label x={36} y={y - 66} text="30 cm" size={13} bg={K.ink} />
      <Dim a={[70, 120]} b={[230, 120]} />
      <Label x={150} y={100} text="1,5 m" size={14} bg={K.ink} />
      <path d={`M70 ${y - 46}V126M230 ${y - 46}V126`} stroke={K.ink} stroke-width={1.3} stroke-dasharray="4 3" />
    </Scene2>
  );
};
S['sf-th-uc-kardes-fasulye'] = () => {
  // Yakın plan kesit: tümseğin ortasında genç mısır; 15 cm yanındaki çukurlara fasulye tohumu bırakılıyor.
  const cx = 150, y = 236;
  const holeL: P = [cx - 72, 170], holeR: P = [cx + 72, 170];
  const h = { a: 180, s: 1.15, pose: 'pinch', side: 'R', view: 'back', ...HANDOF('KADIN') } as const;
  const drop: P = [holeR[0], 92];
  const hh = handAt(h, 'pinch', drop);
  return (
    <Scene2 bg="outdoor" gy={150} ground="dirt">
      <OG sh={[{ d: hump(cx, y, 360, 74), f: TOPRAK }]} />
      {[[60, 200], [120, 214], [200, 206], [250, 222], [100, 228]].map(([x, yy], i) => <ellipse key={i} cx={x} cy={yy} rx={3} ry={2} fill={TOPRAKD} />)}
      <Corn x={cx} y={y - 64} h={92} s={0.95} cob={false} />
      {[holeL, holeR].map((p, i) => (
        <g key={i}>
          <ellipse cx={p[0]} cy={p[1] + 2} rx={13} ry={5} fill={TOPRAKD} stroke={K.out} stroke-width={1.2} />
          {i === 0 && <Bean x={p[0]} y={p[1] + 1} s={1.1} />}
        </g>
      ))}
      <Bean x={drop[0]} y={drop[1] + 8} s={1.1} />
      <Hand {...hh} arm={200} />
      <Arrow from={[holeR[0], drop[1] + 22]} to={[holeR[0], holeR[1] - 8]} w={4} />
      <Dim a={[cx, 200]} b={[holeR[0], 200]} />
      <Label x={(cx + holeR[0]) / 2} y={218} text="15 cm" size={13} bg={K.ink} />
    </Scene2>
  );
};
S['sf-th-uc-kardes-kabak'] = () => {
  const y = 222, cx = 160;
  const corn = [cx - 40, cx, cx + 40];
  return (
    <Scene2 bg="outdoor" gy={190}>
      <OG sh={[{ d: hump(cx, y, 260, 40), f: TOPRAK }]} />
      {corn.map((x) => <Corn key={x} x={x} y={y - 36} h={168} s={0.85} />)}
      {corn.map((x) => {
        const pts: P[] = [];
        for (let i = 0; i <= 14; i++) pts.push([x + Math.sin(i * 1.3) * 7, y - 38 - i * 8.4]);
        return (
          <g key={'b' + x}>
            <path d={smooth(pts)} stroke={K.out} stroke-width={4} fill="none" />
            <path d={smooth(pts)} stroke="#a5c95a" stroke-width={2.2} fill="none" />
            {[3, 7, 11].map((i) => <Leaf key={i} b={pts[i]} a={i % 2 ? -20 : -160} len={14} wid={11} c="#a5c95a" vein={false} />)}
            {[5, 9].map((i) => <path key={'p' + i} d={line([pts[i], [pts[i][0] + 3, pts[i][1] + 16]])} stroke="#6e9a34" stroke-width={3} stroke-linecap="round" />)}
          </g>
        );
      })}
      <Squash x={cx + 70} y={y - 10} s={1} />
      <Squash x={cx - 70} y={y - 10} s={1} flip />
    </Scene2>
  );
};

/* ─────────── Buğday ekimi (ADAM) ─────────── */
const TANE = '#d9a441';
S['sf-th-tohumluk-eleme'] = () => {
  const sy = 132, sx1 = 98, sx2 = 222;
  const p: PersonProps = { ...CAST.ADAM, x: 160, y: 226, s: 1.05, pose: { ...POSE.stand, armB: { to: [sx1 + 4, sy] }, armF: { to: [sx2 - 4, sy] }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={196} ground="dirt">
      <OG sh={[{ d: ell([160, 226], 96, 10), f: '#e9e2cf' }]} />
      {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={110 + ((i * 23) % 100)} cy={224 - (i % 3) * 2} rx={2} ry={1.4} fill="#8a6a3a" />)}
      <Person {...p} mid={() => (
        <g>
          <OG sh={[{ d: ell([160, sy], (sx2 - sx1) / 2, 14), f: ODUN }, { d: ell([160, sy - 2], (sx2 - sx1) / 2 - 6, 10), f: '#c9a26a' }]} />
          {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={112 + (i % 11) * 9} cy={sy - 6 + Math.floor(i / 11) * 5} rx={3.6} ry={2.4} fill={TANE} stroke={K.out} stroke-width={0.8} />)}
        </g>
      )} />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={120 + ((i * 31) % 80)} cy={sy + 24 + ((i * 17) % 60)} rx={1.8} ry={1.2} fill="#8a6a3a" />)}
      <Arrow from={[60, 104]} to={[24, 104]} w={5} />
      <Arrow from={[260, 104]} to={[296, 104]} w={5} />
    </Scene2>
  );
};
S['sf-th-elle-serpme'] = () => {
  const hand: P = [212, 104];
  const p: PersonProps = { ...CAST.ADAM, x: 140, y: 224, pose: { ...POSE.walk, armF: { to: hand }, handF: 'flat', face: 'neutral' } };
  const r = rig(p);
  const seeds: P[] = [];
  for (let i = 0; i < 26; i++) { const a = -30 + (i % 13) * 8; const d = 30 + Math.floor(i / 13) * 26 + (i % 3) * 6; seeds.push(pol(r.handF, a, d)); }
  return (
    <Scene2 bg="outdoor" gy={170} ground="dirt">
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M0 ${180 + i * 8}H320`} stroke={shade(K.dirt, 0.1)} stroke-width={1.2} />)}
      <Person {...p} over={(rr) => (
        <g>
          <OG sh={[{ d: smooth([[rr.hip[0] - 12, rr.hip[1] - 14], [rr.hip[0] + 14, rr.hip[1] - 12], [rr.hip[0] + 16, rr.hip[1] + 14], [rr.hip[0] + 2, rr.hip[1] + 22], [rr.hip[0] - 12, rr.hip[1] + 12]], true), f: '#e9dcc0' }]} />
          <path d={line([[rr.hip[0] - 10, rr.hip[1] - 12], [rr.neck[0] + 6, rr.neck[1] + 4]])} stroke="#8a6a3a" stroke-width={3} />
        </g>
      )} />
      {seeds.map((q, i) => <ellipse key={i} cx={q[0]} cy={q[1]} rx={2.4} ry={1.6} fill={TANE} stroke={K.out} stroke-width={0.7} />)}
      <Arrow from={[r.handF[0] - 30, r.handF[1] - 36]} to={[r.handF[0] + 34, r.handF[1] - 30]} bend={-0.4} w={5} />
      {/* küçük plan: önce boyuna, sonra enine */}
      <G x={22} y={20}>
        <OG sh={[{ d: rrect(0, 0, 76, 76, 6), f: K.white }, { d: rrect(8, 8, 60, 60, 2), f: K.dirt }]} />
        <Arrow from={[38, 62]} to={[38, 14]} w={4} />
        <Arrow from={[14, 38]} to={[62, 38]} w={4} />
      </G>
    </Scene2>
  );
};
S['sf-th-tohum-ortme'] = () => {
  const gy = 112;
  const rx = 200;
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <Soil x={0} y={gy} w={320} h={128} c={TOPRAK} />
      <rect x={0} y={gy} width={320} height={3} fill={TOPRAKD} />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={20 + i * 25 + (i % 2) * 6} cy={gy + 46 + (i % 3) * 4} rx={5} ry={3.2} fill={TANE} stroke={K.out} stroke-width={1} />)}
      {/* tırmık */}
      <Tool a={[rx + 90, 10]} b={[rx, gy - 12]} head="rake" />
      <Dim a={[60, gy + 2]} b={[60, gy + 46]} />
      <Label x={104} y={gy + 24} text="4–6 cm" size={14} bg={K.ink} />
      <Arrow from={[rx + 40, gy - 22]} to={[rx - 70, gy - 22]} w={5} />
    </Scene2>
  );
};

/* ─────────── Buğday hasadı (KADIN) ─────────── */
function WheatField({ x1, x2, y, h = 120, n = 14, cut }: { x1: number; x2: number; y: number; h?: number; n?: number; cut?: boolean }) {
  return <g>{Array.from({ length: n }, (_, i) => <Wheat key={i} x={x1 + (i * (x2 - x1)) / Math.max(1, n - 1)} y={y + (i % 2) * 4} h={h + ((i * 7) % 14)} s={0.85} bow={cut ? 0 : 18 + (i % 3) * 4} />)}</g>;
}
S['sf-th-orak-bicme'] = () => {
  const grab: P = [196, 98];
  const cutP: P = [200, 124];
  const p: PersonProps = { ...CAST.KADIN, x: 128, y: 226, pose: { ...POSE.standSide, spine: -80, chest: -74, head: -80, armB: { to: grab }, armF: { to: [cutP[0] - 14, cutP[1] + 4] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={200}>
      <rect x={0} y={200} width={320} height={40} fill="#d9be6a" />
      <WheatField x1={214} x2={316} y={226} h={128} n={9} />
      {/* elde tutulan demet */}
      {[-6, -2, 2, 6].map((dx) => <Wheat key={dx} x={grab[0] + dx} y={cutP[1] + 6} h={cutP[1] + 6 - 74} s={0.85} bow={10 + dx} />)}
      {[-6, -2, 2, 6].map((dx) => <path key={'s' + dx} d={line([[cutP[0] + dx, cutP[1] + 8], [cutP[0] + dx, 226]])} stroke="#c9a24a" stroke-width={2} />)}
      <Person {...p} mid={(r) => <Sickle h={r.handF} a={-8} s={0.9} />} />
      <Dim a={[244, 82]} b={[244, 124]} />
      <Label x={284} y={104} text="25 cm" size={13} bg={K.ink} />
    </Scene2>
  );
};
function Sheaf({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[{ d: smooth([[-12, 0], [-6, -40], [-14, -70], [0, -76], [14, -70], [6, -40], [12, 0]], true), f: '#d9b552' }]} />
      {[-6, -2, 2, 6].map((dx) => <path key={dx} d={`M${dx} -2V-60`} stroke="#b8923a" stroke-width={1.2} />)}
      {[-9, -3, 3, 9].map((dx, i) => <ellipse key={i} cx={dx} cy={-80 - (i % 2) * 4} rx={3.6} ry={8} fill={BUGDAY} stroke={K.out} stroke-width={1} transform={`rotate(${dx * 2} ${dx} ${-80})`} />)}
      <rect x={-8} y={-44} width={16} height={5} fill="#8a6a3a" stroke={K.out} stroke-width={1} />
    </G>
  );
}
S['sf-th-demet-kurutma'] = () => (
  <Scene2 bg="outdoor" gy={176}>
    <rect x={0} y={176} width={320} height={64} fill="#d9be6a" />
    {Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${(i * 23) % 320} ${184 + ((i * 13) % 52)}v-6`} stroke="#b8923a" stroke-width={1.6} />)}
    {[[80, 214, 1.1], [200, 206, 1], [282, 190, 0.7]].map(([x, y, s], i) => (
      <g key={i}>
        <Sheaf x={x - 16 * s} y={y} a={12} s={s} />
        <Sheaf x={x + 16 * s} y={y} a={-12} s={s} />
        <Sheaf x={x} y={y + 2} s={s} />
      </g>
    ))}
    <Clock x={30} y={40} r={13} text="7–10 gün" />
  </Scene2>
);
S['sf-th-savurma'] = () => {
  const g1: P = [126, 128], tip: P = [176, 60];
  const p: PersonProps = { ...CAST.KADIN, x: 100, y: 224, pose: { ...POSE.standSide, spine: -88, armB: { to: g1 }, armF: { to: lerp(g1, tip, 0.4) }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={196} ground="dirt">
      {/* tane yığını */}
      <OG sh={[{ d: smooth([[170, 222], [190, 206], [212, 202], [236, 210], [250, 222]]) + 'Z', f: TANE }]} />
      <Person {...p} mid={() => <Tool a={g1} b={tip} head="fork" />} />
      {/* düşen taneler */}
      {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={190 + ((i * 13) % 40)} cy={70 + ((i * 29) % 126)} rx={2.4} ry={1.6} fill={TANE} stroke={K.out} stroke-width={0.6} />)}
      {/* rüzgârla uçan saman */}
      {Array.from({ length: 22 }, (_, i) => { const x0 = 214 + ((i * 37) % 96), y0 = 50 + ((i * 23) % 90); return <path key={i} d={line([[x0, y0], [x0 + 10, y0 + ((i % 3) - 1) * 3]])} stroke="#f0dc96" stroke-width={2.4} stroke-linecap="round" />; })}
      <Arrow from={[150, 30]} to={[300, 30]} color={K.water} w={5} />
      <Arrow from={[230, 150]} to={[300, 150]} color={K.water} w={4} />
    </Scene2>
  );
};

/* ─────────── Ekim nöbeti (kişi yok; plan çizimi) ─────────── */
function PodIcon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG sh={[{ d: 'M-26 6C-20 -10 10 -14 26 -6C28 -2 26 2 22 2C8 -4 -12 2 -22 12C-26 14 -28 10 -26 6Z', f: '#7cbb52' }]} />
      {[-12, 0, 12].map((dx, i) => <ellipse key={i} cx={dx} cy={-2 + i * -1.5 + (dx < 0 ? 3 : 0)} rx={4.6} ry={3.6} fill="#a6d47a" />)}
    </G>
  );
}
function OnionIcon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M0 -14C-2 -26 -6 -34 -8 -40M0 -14C2 -26 4 -34 8 -42" stroke={K.out} stroke-width={5} fill="none" stroke-linecap="round" />
      <path d="M0 -14C-2 -26 -6 -34 -8 -40M0 -14C2 -26 4 -34 8 -42" stroke="#7cbb52" stroke-width={3} fill="none" stroke-linecap="round" />
      <OG sh={[{ d: 'M0 -16C14 -10 18 6 6 12H-6C-18 6 -14 -10 0 -16Z', f: '#c98b4a' }]} />
      <path d="M-4 -10C-8 0 -6 8 -3 11M4 -10C8 0 6 8 3 11" stroke="#a0662c" stroke-width={1.2} fill="none" />
    </G>
  );
}
function CarrotIcon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M0 -12l-6 -12M0 -12l0 -14M0 -12l6 -12" stroke={K.out} stroke-width={5} stroke-linecap="round" />
      <path d="M0 -12l-6 -12M0 -12l0 -14M0 -12l6 -12" stroke="#5fa24c" stroke-width={3} stroke-linecap="round" />
      <OG sh={[{ d: 'M-7 -12H7L1 22H-1Z', f: '#ee8a2c' }]} />
    </G>
  );
}
S['sf-th-nobet-dort-parsel'] = () => {
  const cells: Array<{ x: number; y: number; n: string; c: string; icon: JSX.Element }> = [
    { x: 40, y: 22, n: '1', c: '#cfe6b4', icon: <><PodIcon x={92} y={72} s={1.3} /></> },
    { x: 168, y: 22, n: '2', c: '#d6e8c4', icon: <><Cabbage x={220} y={90} s={1.25} /></> },
    { x: 168, y: 126, n: '3', c: '#ead9bd', icon: <><Tuber x={206} y={178} s={1.2} /><OG sh={[{ d: circ([240, 172], 11), f: DOMATES }]} /></> },
    { x: 40, y: 126, n: '4', c: '#efdcc6', icon: <><OnionIcon x={80} y={182} s={1.1} /><CarrotIcon x={112} y={176} s={1.1} /></> },
  ];
  return (
    <Scene2 bg="closeup">
      {cells.map((c) => (
        <g key={c.n}>
          <OG sh={[{ d: rrect(c.x, c.y, 112, 92, 6), f: c.c }]} />
          {c.icon}
          <circle cx={c.x + 14} cy={c.y + 14} r={10} fill={K.ink} />
          <text x={c.x + 14} y={c.y + 19} text-anchor="middle" font-size={14} font-weight={700} fill="#fff">{c.n}</text>
        </g>
      ))}
      <Arrow from={[146, 48]} to={[176, 48]} w={5} />
      <Arrow from={[240, 108]} to={[240, 134]} w={5} />
      <Arrow from={[174, 196]} to={[144, 196]} w={5} />
      <Arrow from={[78, 132]} to={[78, 106]} w={5} />
    </Scene2>
  );
};
S['sf-th-birlikte-ekim'] = () => {
  const gy = 196;
  return (
    <Scene2 bg="outdoor" gy={gy - 20}>
      <rect x={0} y={gy - 20} width={320} height={64} fill={TOPRAK} />
      <path d={`M220 ${gy - 150}L60 ${gy + 30}H180L250 ${gy - 150}Z`} fill="#33507a" opacity={0.16} />
      <Sun x={290} y={34} r={14} />
      {[220, 252].map((x) => <Corn key={x} x={x} y={gy + 4} h={160} s={0.8} />)}
      {[90, 136].map((x) => <Cabbage key={x} x={x} y={gy + 18} s={0.9} c="#9fd27a" lettuce />)}
      {[48, 114, 170].map((x) => (
        <G key={x} x={x} y={gy + 26}>
          <OG sh={[{ d: ell([0, 0], 6, 7), f: '#d9455e' }]} />
          <path d="M0 -6l-4 -10M0 -6l4 -10" stroke="#5fa24c" stroke-width={3} stroke-linecap="round" />
        </G>
      ))}
    </Scene2>
  );
};

/* ─────────── Zararlılar (GENC) ─────────── */
function Caterpillar({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[0, 1, 2, 3, 4, 5].map((i) => ({ d: circ([i * 5.5, Math.sin(i) * 1.5], 4), f: i === 5 ? '#6aa845' : '#86c35a' }))} />
      <circle cx={29} cy={-1} r={1} fill={K.ink} />
    </G>
  );
}
S['sf-th-zararli-elle'] = () => {
  const pick: P = [176, 96];
  const h = { a: -150, s: 1.3, pose: 'pinch', side: 'R', view: 'back', ...HANDOF('GENC') } as const;
  return (
    <Scene2 bg="closeup">
      {/* lahana yaprağı */}
      <OG sh={[{ d: smooth([[10, 230], [6, 150], [40, 90], [110, 70], [150, 110], [140, 180], [90, 230]], true), f: '#8cc66b' }]} />
      <path d={smooth([[30, 228], [60, 160], [104, 92]])} stroke="#6da650" stroke-width={3} fill="none" />
      <Caterpillar x={50} y={170} a={-60} />
      <Caterpillar x={86} y={130} a={-20} />
      {/* sabunlu su kabı */}
      <OG sh={[{ d: poly([[200, 170], [300, 170], [290, 228], [210, 228]]), f: '#d9dde3' }, { d: ell([250, 170], 50, 8), f: '#bfe0f2' }]} />
      {[[226, 166], [244, 164], [262, 167], [276, 164]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={4} fill="#fff" stroke="#9cc6de" stroke-width={1} />)}
      <Caterpillar x={pick[0] - 4} y={pick[1] + 6} a={80} />
      <Hand {...handAt(h, 'pinch', pick)} arm={200} />
      <Arrow from={[196, 116]} to={[232, 150]} w={5} />
    </Scene2>
  );
};
function Sprayer({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[
        { d: rrect(-16, -10, 32, 64, 8), f: '#e9eef2' },
        { d: rrect(-10, -26, 20, 18, 3), f: '#3a9be0' },
        { d: poly([[-6, -26], [24, -30], [24, -22], [6, -18]]), f: '#3a9be0' },
        { d: poly([[0, -12], [8, -12], [4, 6], [-2, 6]]), f: '#2f7fc0' },
      ]} />
      <rect x={-12} y={14} width={24} height={36} rx={5} fill={K.water} opacity={0.35} />
    </G>
  );
}
S['sf-th-yaprak-alti-puskurtme'] = () => {
  const noz: P = [138, 136];
  return (
    <Scene2 bg="outdoor" gy={210}>
      {/* bitkinin gövdesi ve öbür yaprakları: yaprak havada süzülmesin */}
      <path d={smooth([[268, 214], [266, 150], [272, 90], [278, 20]])} stroke={K.out} stroke-width={7} fill="none" stroke-linecap="round" />
      <path d={smooth([[268, 214], [266, 150], [272, 90], [278, 20]])} stroke="#5f9a3f" stroke-width={4} fill="none" stroke-linecap="round" />
      <Leaf b={[276, 36]} a={-30} len={40} wid={16} />
      <Leaf b={[268, 150]} a={-20} len={42} wid={17} />
      <Leaf b={[267, 176]} a={-160} len={34} wid={14} />
      <ellipse cx={268} cy={214} rx={34} ry={6} fill={TOPRAK} stroke={K.out} stroke-width={1.2} />
      {/* yaprak, alt yüzü görünüyor */}
      <path d={smooth([[150, 40], [214, 30], [300, 54], [290, 92], [220, 104], [160, 86]], true)} fill="#a9cf86" stroke={K.out} stroke-width={2} />
      <path d={smooth([[150, 60], [220, 66], [296, 72]])} stroke="#86ad66" stroke-width={2} fill="none" />
      {[[186, 84], [204, 90], [222, 92], [240, 88], [258, 84], [214, 80], [232, 78], [198, 76]].map(([cx, cy], i) => (
        <g key={i}><ellipse cx={cx} cy={cy} rx={3.6} ry={2.6} fill="#5e8f3a" stroke={K.out} stroke-width={0.8} /></g>
      ))}
      {/* sis */}
      <path d={`M${noz[0]} ${noz[1]}L190 66L250 96Z`} fill={K.waterLight} opacity={0.55} />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={160 + ((i * 17) % 70)} cy={110 - ((i * 13) % 34)} r={1.8} fill={K.water} opacity={0.8} />)}
      <Sprayer x={118} y={170} a={45} s={1.2} />
      <Hand {...handAt({ a: 45, s: 1.15, pose: 'hold', side: 'R', view: 'back', grip: 34, ...HANDOF('GENC') }, 'grip', [100, 196])} arm={200} />
      <Arrow from={[150, 150]} to={[196, 104]} />
    </Scene2>
  );
};
function Butterfly({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG sh={[
        { d: ell([-9, -6], 10, 8), f: '#f6f4ec' }, { d: ell([9, -6], 10, 8), f: '#f6f4ec' },
        { d: ell([-7, 6], 7, 6), f: '#f1eee2' }, { d: ell([7, 6], 7, 6), f: '#f1eee2' },
        { d: capsule([0, -10], 2, [0, 12], 1.6), f: K.ink },
      ]} />
      <circle cx={-14} cy={-9} r={2.6} fill={K.ink} /><circle cx={14} cy={-9} r={2.6} fill={K.ink} />
      <path d="M0 -10l-5 -8M0 -10l5 -8" stroke={K.ink} stroke-width={1.2} />
    </G>
  );
}
S['sf-th-tul-ortu'] = () => {
  const gy = 196;
  const id = uid();
  const net = `M30 ${gy + 8}C30 70 290 70 290 ${gy + 8}Z`;
  return (
    <Scene2 bg="outdoor" gy={gy}>
      <defs>
        <pattern id={id} width={6} height={6} patternUnits="userSpaceOnUse"><path d="M0 0L6 6M6 0L0 6" stroke="#c9d2da" stroke-width={0.8} /></pattern>
      </defs>
      <rect x={0} y={gy} width={320} height={44} fill={TOPRAK} />
      {[70, 125, 180, 235].map((x) => <Cabbage key={x} x={x} y={gy + 14} s={1} />)}
      {[80, 160, 240].map((x) => <path key={x} d={`M${x - 52} ${gy + 8}C${x - 52} 92 ${x + 52 - 80 + 80} 92 ${x + 52 - 80 + 80} ${gy + 8}`} stroke="none" fill="none" />)}
      <path d={net} fill="#ffffff" opacity={0.55} />
      <path d={net} fill={`url(#${id})`} />
      <path d={net} fill="none" stroke={K.out} stroke-width={2} />
      {/* kenarlar toprakla gömülü */}
      <path d={ridge(14, 52, gy + 14, 14)} fill={TOPRAKD} stroke={K.out} stroke-width={1.5} />
      <path d={ridge(268, 306, gy + 14, 14)} fill={TOPRAKD} stroke={K.out} stroke-width={1.5} />
      <Butterfly x={262} y={52} s={1.3} />
      <No x={262} y={52} r={26} />
    </Scene2>
  );
};

/* ─────────── Sulama (KADIN) ─────────── */
function Sapling({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <OG sh={[{ d: capsule([x, y], 4 * s, [x, y - 90 * s], 2.4 * s), f: K.trunk }]} />
      {[[-70, -50], [-40, -130], [-60, -120], [-20, -60], [-80, -70], [-30, -150]].map(([yy, a], i) => <Leaf key={i} b={[x, y + yy * s * (i < 3 ? 1 : 1.2)]} a={a} len={24 * s} wid={12 * s} />)}
    </g>
  );
}
S['sf-th-canak-sulama'] = () => {
  const gy = 196, tx = 210;
  const hands: P = [150, 118];
  const p: PersonProps = { ...CAST.KADIN, x: 96, y: 226, pose: { ...POSE.standSide, spine: -78, chest: -72, armB: { to: [hands[0] - 4, hands[1] - 18] }, armF: { to: [hands[0] + 4, hands[1] + 10] }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={gy - 6} ground="dirt">
      <ellipse cx={tx} cy={gy + 8} rx={56} ry={11} fill={K.water} opacity={0.75} stroke={K.out} stroke-width={1.5} />
      <path d={ridge(tx - 82, tx - 50, gy + 12, 18)} fill={TOPRAK} stroke={K.out} stroke-width={1.6} />
      <path d={ridge(tx + 50, tx + 82, gy + 12, 18)} fill={TOPRAK} stroke={K.out} stroke-width={1.6} />
      <Sapling x={tx} y={gy + 8} s={1} />
      <Person {...p} mid={() => <G x={hands[0] + 8} y={hands[1]} a={-60}><Bucket x={0} y={18} s={0.85} fill={K.water} /></G>} />
      <path d={smooth([[hands[0] + 30, hands[1] - 8], [hands[0] + 50, hands[1] + 20], [hands[0] + 58, gy + 4]])} stroke={K.water} stroke-width={7} fill="none" stroke-linecap="round" opacity={0.85} />
      <Dim a={[tx + 92, gy + 12]} b={[tx + 92, gy - 6]} />
      <Label x={256} y={gy - 34} text="10–15 cm" size={13} bg={K.ink} />
    </Scene2>
  );
};
function Testi({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG sh={[{ d: 'M-12 -100H12V-88C34 -78 44 -50 40 -24C36 -6 22 0 0 0C-22 0 -36 -6 -40 -24C-44 -50 -34 -78 -12 -88Z', f: '#c7744a' }]} />
      <path d="M-30 -50C-28 -30 -18 -14 -4 -10" stroke="#e39a70" stroke-width={3} fill="none" stroke-linecap="round" />
    </G>
  );
}
S['sf-th-testi-sulama'] = () => {
  const gy = 104, tx = 160;
  const id = uid();
  return (
    <Scene2 bg="outdoor" gy={gy}>
      <defs><radialGradient id={id}><stop offset="0.45" stop-color={K.water} stop-opacity={0.65} /><stop offset="1" stop-color={K.water} stop-opacity={0} /></radialGradient></defs>
      <Soil x={0} y={gy} w={320} h={136} c={TOPRAK} />
      <ellipse cx={tx} cy={gy + 58} rx={110} ry={80} fill={`url(#${id})`} />
      <Testi x={tx} y={gy + 100} s={1} />
      <OG sh={[{ d: smooth([[tx - 20, gy - 2], [tx - 10, gy - 10], [tx + 14, gy - 10], [tx + 22, gy - 2]]) + 'Z', f: K.rock }]} />
      {[60, 260].map((x) => (
        <g key={x}>
          {[-1, 0, 1].map((k) => <path key={k} d={smooth([[x, gy + 2], [x + (tx - x) * 0.2 + k * 8, gy + 30], [x + (tx - x) * 0.45 + k * 10, gy + 50 + k * 12]])} stroke="#efe2c4" stroke-width={2} fill="none" stroke-linecap="round" />)}
          <Seedling x={x} y={gy + 2} s={1.6} n={4} />
        </g>
      ))}
      <rect x={0} y={gy} width={320} height={3} fill={TOPRAKD} />
    </Scene2>
  );
};
S['sf-th-malc-ortu'] = () => {
  const gy = 140, st = 22;
  return (
    <Scene2 bg="outdoor" gy={gy - st}>
      <Soil x={0} y={gy} w={160} h={100} c={TOPRAKD} />
      <Soil x={160} y={gy} w={160} h={100} c="#b99368" />
      {[[190, 160, 220, 190], [250, 150, 236, 200], [290, 170, 270, 220]].map(([a1, b1, a2, b2], i) => <path key={i} d={`M${a1} ${b1}L${(a1 + a2) / 2 + 6} ${(b1 + b2) / 2}L${a2} ${b2}`} stroke="#7a5a3a" stroke-width={2} fill="none" />)}
      <rect x={0} y={gy - st} width={160} height={st} fill={SAMAN} />
      {Array.from({ length: 34 }, (_, i) => { const x0 = (i * 29) % 150, y0 = gy - st + 3 + ((i * 7) % (st - 6)); return <path key={i} d={line([[x0, y0], [x0 + 14, y0 + ((i % 3) - 1) * 4]])} stroke={SAMAND} stroke-width={1.6} />; })}
      <path d={`M0 ${gy - st}H160V${gy}`} stroke={K.out} stroke-width={1.6} fill="none" />
      <path d={`M160 ${gy}V240`} stroke={K.out} stroke-width={1.6} />
      <Cabbage x={80} y={gy - st + 4} s={1} lettuce c="#8cc66b" />
      <Cabbage x={240} y={gy + 4} s={0.85} lettuce c="#b3c46a" />
      <Dim a={[20, gy - st]} b={[20, gy]} />
      <Label x={64} y={gy - st - 18} text="5–10 cm" size={13} bg={K.ink} />
      <Ok x={130} y={200} r={15} />
      <Bad x={290} y={60} r={15} />
    </Scene2>
  );
};

/* ─────────── Teras (ADAM; yalnız düzen çizimleri) ─────────── */
const TAS = '#a9a59b';
function Stone({ x, y, w, h, c = TAS }: { x: number; y: number; w: number; h: number; c?: string }) {
  return <OG sh={[{ d: smooth([[x, y + h * 0.5], [x + w * 0.1, y + h * 0.05], [x + w * 0.5, y], [x + w * 0.92, y + h * 0.08], [x + w, y + h * 0.55], [x + w * 0.88, y + h], [x + w * 0.4, y + h], [x + w * 0.06, y + h * 0.92]], true), f: c }]} />;
}
S['sf-th-a-cerceve'] = () => {
  const ap: P = [160, 52], L: P = [96, 204], Rr: P = [224, 204];
  const by = 150;
  const bl = lerp(ap, L, (by - ap[1]) / (L[1] - ap[1])), br = lerp(ap, Rr, (by - ap[1]) / (Rr[1] - ap[1]));
  return (
    <Scene2 bg="outdoor" gy={196}>
      <path d="M0 196L320 196V240H0Z" fill="#9cc56d" />
      <path d="M0 214H320" stroke={K.action} stroke-width={3} stroke-dasharray="9 7" />
      {[40, 96, 224, 290].map((x) => <OG key={x} sh={[{ d: poly([[x - 3, 222], [x + 3, 222], [x + 3, 196], [x, 190], [x - 3, 196]]), f: ODUN }]} />)}
      <OG sh={[{ d: capsule(ap, 4, [L[0], 214], 4), f: ODUN }, { d: capsule(ap, 4, [Rr[0], 214], 4), f: ODUN }, { d: capsule(bl, 3.6, br, 3.6), f: ODUN }]} />
      <rect x={158} y={by - 7} width={4} height={14} fill={K.danger} />
      <path d={line([ap, [160, by + 12]])} stroke={K.ink} stroke-width={1.6} />
      <OG sh={[{ d: poly([[154, by + 12], [166, by + 12], [160, by + 24]]), f: DEMIR }]} />
      <Ok x={198} y={by - 26} r={13} />
    </Scene2>
  );
};
S['sf-th-teras-duvar'] = () => {
  // yan kesit: yamaç sağa doğru yükselir, duvar yamaca yatık
  const stones: Array<[number, number, number, number]> = [
    [60, 198, 64, 30], [64, 170, 56, 28], [70, 144, 50, 26], [76, 120, 44, 24], [82, 98, 38, 22],
  ];
  return (
    <Scene2 bg="outdoor" gy={230}>
      <path d="M0 228H70L120 100L320 40V240H0Z" fill={ALT} stroke={K.out} stroke-width={1.6} />
      <path d="M118 100L320 40V52L120 112Z" fill={TOPRAK} />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={130 + ((i * 23) % 60)} cy={120 + ((i * 17) % 100)} r={3} fill="#8e8a82" />)}
      {stones.map(([x, y, w, h], i) => <Stone key={i} x={x} y={y} w={w} h={h} />)}
      <Stone x={70} y={132} w={120} h={14} c="#c3bfb3" />
      <Arrow from={[180, 168]} to={[176, 148]} />
      <path d="M62 228L84 96" stroke={K.action} stroke-width={2} stroke-dasharray="6 5" />
      <path d="M62 228V96" stroke={K.ink} stroke-width={1.4} stroke-dasharray="3 4" />
    </Scene2>
  );
};
S['sf-th-teras-kesit'] = () => {
  // Tek basamağın yan kesiti: yamaç sağda. Taş duvarın arkasında çakıl dolgu; yağmur suyu
  // dolgudan aşağı süzülüp duvarın dibinden dışarı çıkar, duvarın arkasında birikmez.
  const low = 204, top = 92;
  const wx = 96, ww = 34, gx = wx + ww, gw = 30;
  const nSt = 5, sh = (low - top) / nSt;
  return (
    <Scene2 bg="outdoor" gy={240}>
      {/* alt basamak yüzeyi */}
      <path d={`M0 ${low}H${gx + 2}V240H0Z`} fill={ALT} />
      <path d={`M0 ${low}H${wx + 4}V${low + 10}H0Z`} fill={TOPRAK} />
      {/* üst basamak: alt toprak dolgu, üstte üst toprak */}
      <path d={`M${gx + gw} ${top}H320V240H${gx + gw}Z`} fill={ALT} />
      <path d={`M${gx} ${top}H320V${top + 14}H${gx}Z`} fill={TOPRAK} />
      {/* çakıl dolgu */}
      <rect x={gx} y={top + 14} width={gw} height={240 - top - 14} fill="#cfcabd" />
      {Array.from({ length: 33 }, (_, i) => <circle key={i} cx={gx + 6 + (i % 3) * 9 + (Math.floor(i / 3) % 2) * 3} cy={top + 22 + Math.floor(i / 3) * 12} r={3.6} fill="#8e8a82" stroke={K.out} stroke-width={0.6} />)}
      <path d={`M${gx + gw} ${top + 14}V240`} stroke={K.out} stroke-width={1} stroke-dasharray="3 3" />
      {/* taş duvar: yamaca doğru hafif yatık */}
      {Array.from({ length: nSt }, (_, k) => <Stone key={k} x={wx + (nSt - 1 - k) * 0 + k * 1.8} y={low - (k + 1) * sh} w={ww + 4} h={sh + 1} />)}
      {/* yağmur ve süzülen su */}
      {[[200, 50], [236, 40], [272, 54]].map(([x, y], i) => <Drip key={i} x={x} y={y} s={1.3} />)}
      <Arrow from={[236, 84]} to={[gx + 16, 182]} bend={0.25} color={K.water} w={5} />
      <Arrow from={[gx + 4, low - 6]} to={[30, low - 10]} bend={0.1} color={K.water} w={5} />
      <Label x={gx + gw / 2 + 4} y={top - 14} text="çakıl" size={13} bg={K.ink} />
    </Scene2>
  );
};

/* ─────────── Sera (GENC) ─────────── */
function ColdFrame({ x, y, open = 0 }: { x: number; y: number; open?: number }) {
  // x = sol (kuzey, yüksek arka), y = taban; ön (güney) sağda
  const bw = 200, bh = 70, fh = 38;
  const back: P = [x, y - bh], front: P = [x + bw, y - fh];
  const lidEnd = pol(back, angOf(back, front) - open, Math.hypot(bw, bh - fh));
  return (
    <g>
      <OG sh={[{ d: poly([[x, y], [x, y - bh], [x + 10, y - bh], [x + 10, y]]), f: ODUN }, { d: poly([[x, y], [x + bw, y], [x + bw, y - fh], [x + bw - 10, y - fh]]), f: ODUN }]} />
      <OG sh={[{ d: poly([[x, y - 14], [x + bw, y - 14], [x + bw, y], [x, y]]), f: shade(ODUN, 0.05) }]} />
      {[60, 100, 140].map((dx) => <Cabbage key={dx} x={x + dx} y={y - 12} s={0.6} lettuce c="#9fd27a" />)}
      <path d={poly([back, lidEnd, pol(lidEnd, angOf(back, lidEnd) + 90, 8), pol(back, angOf(back, lidEnd) + 90, 8)])} fill="#a9d6ec" opacity={0.85} stroke={K.out} stroke-width={2.4} />
      <path d={line([lerp(back, lidEnd, 0.2), lerp(back, lidEnd, 0.35)])} stroke="#fff" stroke-width={3} />
      <circle cx={back[0] + 3} cy={back[1] + 3} r={3.5} fill={K.ink} />
    </g>
  );
}
S['sf-th-soguk-cerceve'] = () => (
  <Scene2 bg="outdoor" gy={200}>
    <Sun x={290} y={36} r={13} />
    <ColdFrame x={50} y={214} />
    <Dim a={[34, 214]} b={[34, 144]} />
    <Label x={34} y={124} text="40–60" size={13} bg={K.ink} />
    <Dim a={[268, 214]} b={[268, 176]} />
    <Label x={276} y={156} text="25–30" size={13} bg={K.ink} />
    <Arrow from={[264, 60]} to={[214, 140]} bend={0.1} />
  </Scene2>
);
S['sf-th-sicak-yastik'] = () => {
  const gy = 96, m1 = 150, m0 = 196;
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <Soil x={0} y={gy} w={320} h={144} c={ALT} />
      <rect x={60} y={gy} width={200} height={m0 - gy + 30} fill={K.dirt} />
      <rect x={60} y={m1} width={200} height={m0 - m1 + 30} fill={GUBRE} />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={line([[66 + ((i * 31) % 186), m1 + 8 + ((i * 13) % 60)], [76 + ((i * 31) % 186), m1 + 4 + ((i * 13) % 60)]])} stroke={SAMAND} stroke-width={1.6} />)}
      <Soil x={60} y={gy + 6} w={200} h={m1 - gy - 6} c={TOPRAK} />
      {[100, 160, 220].map((x) => <Seedling key={x} x={x} y={gy + 8} s={1} />)}
      <path d={`M60 ${gy}V${m0 + 30}H260V${gy}`} stroke={K.out} stroke-width={2} fill="none" />
      {[100, 160, 220].map((x) => <Waves key={x} x={x} y={m1 - 4} a={-90} n={2} r={6} />)}
      <Dim a={[284, gy + 6]} b={[284, m1]} />
      <Label x={284} y={gy - 14} text="15–20" size={13} bg={K.ink} />
      <Dim a={[38, m1]} b={[38, m1 + 74]} />
      <Label x={38} y={m1 - 14} text="30" size={13} bg={K.ink} />
    </Scene2>
  );
};
S['sf-th-cerceve-havalandirma'] = () => {
  // Kapak önden aralanmış, tahta takozla dayalı; içerideki sıcak hava aralıktan çıkıyor.
  const x = 24, y = 214;
  return (
    <Scene2 bg="outdoor" gy={200}>
      <Sun x={292} y={36} r={13} />
      <ColdFrame x={x} y={y} open={15} />
      <OG sh={[{ d: rrect(x + 184, y - 90, 9, 54, 2), f: shade(ODUN, 0.1) }]} />
      <Arrow from={[x + 150, y - 30]} to={[x + 262, y - 104]} bend={-0.12} color={K.danger} w={5} />
      <Arrow from={[x + 120, y - 22]} to={[x + 270, y - 64]} bend={-0.1} color={K.danger} w={5} />
    </Scene2>
  );
};

/* ─────────── Kategori kapakları ─────────── */
function Chicken({ x, y, s = 1, flip, c = '#f2e6d0' }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  return (
    <G x={x} y={y} s={s} sx={flip ? -s : s}>
      <path d="M-4 -2V8M4 -2V8" stroke="#e0a030" stroke-width={2.4} />
      <OG sh={[
        { d: smooth([[-22, -22], [-14, -10], [0, -6], [16, -12], [20, -26], [10, -30], [-6, -24]], true), f: c },
        { d: smooth([[-20, -22], [-30, -38], [-24, -42], [-16, -30]], true), f: shade(c, 0.1) },
        { d: circ([16, -36], 8), f: c },
        { d: smooth([[11, -44], [14, -50], [17, -46], [20, -50], [22, -43]], true), f: K.red },
        { d: poly([[23, -38], [30, -35], [23, -32]]), f: '#e9a43a' },
      ]} />
      <circle cx={18} cy={-37} r={1.4} fill={K.ink} />
      <path d="M-8 -22C-2 -14 8 -14 10 -20" stroke={shade(c, 0.25)} stroke-width={1.4} fill="none" />
    </G>
  );
}
function Hive({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG sh={[
        { d: rrect(-4 - 26, -14, 60, 14, 1), f: shade(ODUN, 0.1) },
        { d: rrect(-28, -50, 56, 36, 2), f: '#f2d27a' },
        { d: rrect(-28, -82, 56, 32, 2), f: '#e9c25a' },
        { d: poly([[-34, -82], [34, -82], [30, -92], [-30, -92]]), f: '#c6574e' },
      ]} />
      <rect x={-10} y={-20} width={20} height={4} fill={K.ink} />
    </G>
  );
}
function Bee({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x - 2} cy={y - 5} rx={4} ry={3} fill="#fff" opacity={0.85} stroke={K.out} stroke-width={0.8} />
      <ellipse cx={x} cy={y} rx={5} ry={3.6} fill="#f6c13b" stroke={K.out} stroke-width={1} />
      <path d={`M${x - 1} ${y - 3.4}v6.8M${x + 2} ${y - 3.2}v6.4`} stroke={K.ink} stroke-width={1.2} />
    </g>
  );
}
S['sf-th-kapak-toprak-tohum'] = () => (
  <Scene2 bg="indoor" wall="#efe3cc" gy={176}>
    <rect x={0} y={176} width={320} height={64} fill="#b98a5c" />
    <rect x={0} y={176} width={320} height={5} fill="#d0a476" />
    <Jar x={70} y={196} w={64} h={86} lid="#c6574e">
      <rect x={30} y={140} width={80} height={60} fill="#efe4cf" />
      {Array.from({ length: 14 }, (_, i) => <Bean key={i} x={50 + (i % 4) * 12} y={150 + Math.floor(i / 4) * 12} s={0.7} />)}
    </Jar>
    <Jar x={150} y={200} w={64} h={96} lid="#3a7fd0">
      <rect x={110} y={150} width={80} height={60} fill={TANE} />
      {Array.from({ length: 24 }, (_, i) => <ellipse key={i} cx={126 + (i % 6) * 8} cy={158 + Math.floor(i / 6) * 10} rx={3} ry={2} fill={shade(TANE, 0.2)} />)}
    </Jar>
    <PotSection x={204} y={206} w={90} h={60} top={10} />
    <Seedling x={249} y={156} s={1.8} n={4} />
  </Scene2>
);
S['sf-th-kapak-bahce-tarla'] = () => (
  <Scene2 bg="outdoor" gy={140}>
    <Sun x={276} y={38} r={14} />
    <rect x={0} y={140} width={320} height={34} fill="#e2c35e" />
    {Array.from({ length: 20 }, (_, i) => <Wheat key={i} x={8 + i * 16} y={168} h={40} s={0.55} bow={14} />)}
    <rect x={0} y={168} width={320} height={72} fill={TOPRAK} />
    {[0, 1].map((r) => (
      <g key={r}>
        <path d={`M0 ${190 + r * 34}H320`} stroke={K.water} stroke-width={5} />
        {[30, 90, 150, 210, 270].map((x) => (r ? <Cabbage key={x} x={x + 14} y={218 + 18} s={0.6} /> : <Seedling key={x} x={x} y={186} s={1.3} n={4} />))}
      </g>
    ))}
  </Scene2>
);
S['sf-th-kapak-meyve'] = () => (
  <Scene2 bg="outdoor" gy={196}>
    <OG sh={[{ d: smooth([[150, 210], [154, 160], [148, 120], [156, 100], [166, 120], [162, 160], [168, 210]], true), f: K.trunk }]} />
    {[[156, 120, -140, 60], [160, 116, -40, 66], [158, 140, -160, 50], [162, 138, -20, 54]].map(([x, y, a, l], i) => <OG key={i} sh={[{ d: capsule([x, y], 5, pol([x, y], a, l), 2.4), f: K.trunk }]} />)}
    {Array.from({ length: 22 }, (_, i) => { const a = (i * 137) % 360; const d = 30 + ((i * 53) % 60); const c = pol([158, 84], a, d * 0.95); return <OG key={i} sh={[{ d: ell([c[0], c[1] * 0.85 + 14], 13, 10), f: i % 3 ? '#7fb35a' : '#6aa845' }]} />; })}
    {Array.from({ length: 16 }, (_, i) => { const a = (i * 97) % 360; const d = 24 + ((i * 41) % 56); const c = pol([158, 84], a, d); return <g key={'f' + i}><circle cx={c[0]} cy={c[1] * 0.85 + 14} r={4.4} fill={i % 2 ? '#fbe2ea' : '#fff'} stroke="#d39aae" stroke-width={1} /><circle cx={c[0]} cy={c[1] * 0.85 + 14} r={1.4} fill="#e8b23a" /></g>; })}
    {[[110, 104], [204, 96], [176, 128]].map(([x, y], i) => <OG key={'a' + i} sh={[{ d: circ([x, y], 8), f: '#d9453a' }]} />)}
  </Scene2>
);
S['sf-th-kapak-hayvan'] = () => (
  <Scene2 bg="outdoor" gy={176}>
    {/* kümes */}
    <OG sh={[{ d: rrect(18, 110, 96, 80, 2), f: '#c99a64' }, { d: poly([[10, 112], [66, 72], [122, 112]]), f: '#c6574e' }, { d: rrect(54, 150, 24, 40, 2), f: '#6b4a2c' }]} />
    {[30, 42, 90, 102].map((x) => <rect key={x} x={x} y={116} width={2} height={70} fill={shade('#c99a64', 0.2)} />)}
    <Hive x={262} y={200} s={1} />
    <Bee x={232} y={92} /><Bee x={290} y={80} /><Bee x={252} y={70} />
    <Chicken x={150} y={210} s={1.3} />
    <Chicken x={206} y={222} s={1.1} flip c="#c9783e" />
    <Chicken x={120} y={226} s={0.5} c="#f6d65a" />
  </Scene2>
);
