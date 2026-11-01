// Sıfırdan paketi sahneleri (b): kütük doldurma, taş, kireç, ahşap iskelet, merdiven, çatılar,
// kapı-pencere, kar barınağı, yurt, keçe, çit, ahır-kümes. Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Arrow, Bad, Flame, Hand, K, Label, No, OG, Ok, Person, POSE, Scene2, Shake, Smoke, Timer,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Sh } from '../../../src/art/kit2';

/* ════════════════════════ geometri yardımcıları ════════════════════════ */

const RAD = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * RAD) * l, p[1] + Math.sin(a * RAD) * l];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / RAD;
const poly = (ps: P[], close = true) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + (close ? 'Z' : '');
/** a→b arasında w kalınlığında dikdörtgen (kiriş, sırık, tahta) */
const beam = (a: P, b: P, w: number) => {
  const n = angOf(a, b) + 90;
  return poly([pol(a, n, w / 2), pol(b, n, w / 2), pol(b, n, -w / 2), pol(a, n, -w / 2)]);
};
/** deterministik rastgele */
function rnd(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);
/** El bileğini, elin verilen noktası hedefe gelecek şekilde konumlar. */
function handAt<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

/* ════════════════════════ malzeme renkleri (paket geneli) ════════════════════════ */

const M = {
  wood: K.wood, // kereste, tahta
  woodL: '#d6a774', // kesilmiş tahta yüzü
  bark: '#8a5a36', // kütük kabuğu
  logEnd: '#e2bd8a', // kütük kesiti
  ring: '#c49361',
  stone: '#b3ada1',
  stoneL: '#cbc5b8',
  mortar: '#e4ddcc', // kireç harcı
  lime: '#f6f4ec', // kireç
  clay: '#b9784b', // kil, çamur
  kerpic: '#c99563',
  soil: '#8f6a45',
  soilL: '#a98058',
  straw: '#e2c46b',
  reed: '#cfae5c',
  moss: '#7d9c46',
  snow: '#f3f7fa',
  snowS: '#d3e1ea',
  felt: '#e9dcc0',
  wool: '#f6f1e6',
  iron: '#59626e',
  tile: '#c2583e',
  rope: '#c9a56a',
};

/* ════════════════════════ oyuncular ════════════════════════ */
// Paket b oyuncu kadrosu: rehber başına sabit.
const CAST = {
  /** kireç: bıyıklı esmer usta, koruyucu gözlükle */
  kirec: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black, mustache: true, bottomC: K.pants.khaki, sleeve: 'long' } as const,
  /** merdiven: kahverengi saçlı genç adam */
  merdiven: { who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown, bottomC: K.pants.denim, sleeve: 'long' } as const,
  /** toprak dam bakımı: yaşlı köylü */
  dam: { who: 'oldman', role: 'bystander4', skin: 1, bottomC: K.pants.brown } as const,
  /** şındıl: koyu saçlı, bıyıklı usta */
  sindil: { who: 'man', role: 'helper', skin: 1, hairC: K.hair.dark, mustache: true, bottomC: K.pants.dark, sleeve: 'long' } as const,
  /** kar barınağı: kışlık giyimli kadın */
  kar: { who: 'woman', role: 'helper2', skin: 1, hair: 'ponytail', hairC: K.hair.dark, bottomC: K.pants.navy, sleeve: 'long' } as const,
  /** keçe: başörtülü kadın */
  kece: { who: 'woman', role: 'helper', skin: 2, hair: 'scarf', hairC: '#b44a4a', bottom: 'longskirt', bottomC: '#5b4a7a', sleeve: 'long' } as const,
};
/** yakın planlarda el tenleri */
const HAND = { dold: 1, kiremit: 0, pencere: 2, saz: 1, kapi: 1 };

/* ════════════════════════ ortak çizim parçaları ════════════════════════ */

/** Ölçü çizgisi: a→b, uçlarda dik çentik, ortada etiket */
function Dim({ a, b, text, size = 12, c = K.ink, lab }: { a: P; b: P; text: string; size?: number; c?: string; lab?: P }) {
  const n = angOf(a, b) + 90;
  const t1 = [pol(a, n, 5), pol(a, n, -5)], t2 = [pol(b, n, 5), pol(b, n, -5)];
  const m = lab ?? lerp(a, b, 0.5);
  return (
    <g>
      <g stroke="#fff" stroke-width={4} stroke-linecap="round" opacity={0.7}>
        <path d={poly([a, b], false) + poly(t1, false) + poly(t2, false)} fill="none" />
      </g>
      <g stroke={c} stroke-width={1.8} stroke-linecap="round">
        <path d={poly([a, b], false) + poly(t1, false) + poly(t2, false)} fill="none" />
      </g>
      <Label x={m[0]} y={m[1]} text={text} size={size} bg="#fff" />
    </g>
  );
}

/** Açı yayı: c merkez, a1→a2 derece; etiket yayın ortasının dışında */
function AngleArc({ c, r, a1, a2, text, size = 13 }: { c: P; r: number; a1: number; a2: number; text?: string; size?: number }) {
  const p1 = pol(c, a1, r), p2 = pol(c, a2, r);
  const sweep = a2 > a1 ? 1 : 0;
  const lab = pol(c, (a1 + a2) / 2, r + 18);
  return (
    <g>
      <path d={`M${f1(c[0])} ${f1(c[1])}L${f1(p1[0])} ${f1(p1[1])}A${r} ${r} 0 0 ${sweep} ${f1(p2[0])} ${f1(p2[1])}Z`} fill={K.action} opacity={0.35} />
      <path d={`M${f1(p1[0])} ${f1(p1[1])}A${r} ${r} 0 0 ${sweep} ${f1(p2[0])} ${f1(p2[1])}`} fill="none" stroke={K.action} stroke-width={3} />
      {text && <Label x={lab[0]} y={lab[1]} text={text} size={size} />}
    </g>
  );
}

/** Düzensiz taş (merkez c, w×h) */
function stoneD(c: P, w: number, h: number, seed: number, n = 3.2) {
  const r = rnd(seed);
  const pts: P[] = [];
  const k = 10;
  for (let i = 0; i < k; i++) {
    const t = (i / k) * Math.PI * 2 + r() * 0.2;
    const ct = Math.cos(t), st = Math.sin(t);
    const rr = 1 / Math.pow(Math.pow(Math.abs(ct), n) + Math.pow(Math.abs(st), n), 1 / n);
    const j = 0.9 + r() * 0.1;
    pts.push([c[0] + (w / 2) * ct * rr * j, c[1] + (h / 2) * st * rr * j]);
  }
  return smooth(pts, true, 0.7);
}
function Stone({ c, w, h, seed = 1, f = M.stone, n }: { c: P; w: number; h: number; seed?: number; f?: string; n?: number }) {
  return <OG sh={[{ d: stoneD(c, w, h, seed, n), f }, { d: stoneD([c[0] + w * 0.06, c[1] + h * 0.12], w * 0.8, h * 0.6, seed + 7, n), f: shade(f, 0.08), no: true }]} />;
}

/** Bir dikdörtgeni (x,y,w,h) sıralı, düzensiz taşlarla doldurur (duvar yüzü görünüşü). */
function StoneFace({ x, y, w, h, row = 22, seed = 3, mortar = M.mortar, f = M.stone, clip }: { x: number; y: number; w: number; h: number; row?: number; seed?: number; mortar?: string; f?: string; clip?: string }) {
  const r = rnd(seed);
  const out: JSX.Element[] = [];
  const rows = Math.ceil(h / row);
  for (let i = 0; i < rows; i++) {
    let xx = x - r() * 20;
    const yy = y + i * row;
    let j = 0;
    while (xx < x + w) {
      const sw = row * (1.2 + r() * 1.3);
      out.push(<path key={`${i}-${j}`} d={stoneD([xx + sw / 2, yy + row / 2], sw - 3, row - 3, seed * 100 + i * 17 + j, 4)} fill={r() > 0.7 ? shade(f, 0.08) : r() > 0.5 ? tint(f, 0.12) : f} stroke={K.out} stroke-width={1.1} />);
      xx += sw;
      j++;
    }
  }
  const id = clip ?? `sf-${seed}-${f1(x)}-${f1(y)}`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={mortar} />
      <g clip-path={`url(#${id})`}>{out}</g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Kerpiç duvar yüzü (sıvasız tuğla düzeni) */
function KerpicFace({ x, y, w, h, bw = 34, bh = 14, f = M.kerpic }: { x: number; y: number; w: number; h: number; bw?: number; bh?: number; f?: string }) {
  const id = `kf-${f1(x)}-${f1(y)}-${f1(w)}`;
  const rows = Math.ceil(h / bh);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={f} />
      <g clip-path={`url(#${id})`} stroke={shade(f, 0.28)} stroke-width={1.1}>
        {Array.from({ length: rows }, (_, i) => (
          <g key={i}>
            <line x1={x} y1={y + i * bh} x2={x + w} y2={y + i * bh} />
            {Array.from({ length: Math.ceil(w / bw) + 1 }, (_, j) => {
              const xx = x + j * bw + (i % 2 ? bw / 2 : 0);
              return <line key={j} x1={xx} y1={y + i * bh} x2={xx} y2={y + (i + 1) * bh} />;
            })}
          </g>
        ))}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Tahta / kiriş (a→b, w kalınlık) */
function Plank({ a, b, w, f = M.wood, grain = true }: { a: P; b: P; w: number; f?: string; grain?: boolean }) {
  const n = angOf(a, b) + 90;
  const sh: Sh[] = [{ d: beam(a, b, w), f }, { d: beam(pol(a, n, w * 0.25), pol(b, n, w * 0.25), w * 0.4), f: shade(f, 0.1), no: true }];
  if (grain && w > 7) sh.push({ d: poly([lerp(pol(a, n, -w * 0.15), pol(b, n, -w * 0.15), 0.12), lerp(pol(a, n, -w * 0.15), pol(b, n, -w * 0.15), 0.6)], false), st: shade(f, 0.3), sw: 1 });
  return <OG sh={sh} />;
}

/** Yuvarlak sırık (a→b) */
function Pole({ a, b, r = 4, f = M.bark }: { a: P; b: P; r?: number; f?: string }) {
  return <OG sh={[{ d: capsule(a, r, b, r * 0.9), f }]} />;
}

/** Kütük kesiti (ön yüz), yıllık halkalı */
function LogEnd({ c, r, rx }: { c: P; r: number; rx?: number }) {
  const x = rx ?? r;
  return (
    <g>
      <OG sh={[{ d: ell(c, x, r), f: M.bark }, { d: ell(c, x * 0.9, r * 0.9), f: M.logEnd, ln: true }]} />
      <g fill="none" stroke={M.ring} stroke-width={1.3}>
        <path d={ell([c[0] + 1, c[1] + 1], x * 0.66, r * 0.66)} />
        <path d={ell([c[0] + 1.5, c[1] + 1.5], x * 0.42, r * 0.42)} />
        <path d={ell([c[0] + 2, c[1] + 2], x * 0.18, r * 0.18)} />
      </g>
    </g>
  );
}

/** Kova (yandan). x,y = taban ortası */
function Bucket({ x, y, s = 1, a = 0, c = '#8aa0b2', water = true }: { x: number; y: number; s?: number; a?: number; c?: string; water?: boolean }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-17 -30Q0 -52 17 -30', st: K.out, sw: 2.4 },
          { d: 'M-18 -30H18L14 0H-14Z', f: c },
          { d: 'M8 -30H18L14 0H6Z', f: shade(c, 0.15), no: true },
          { d: ell([0, -30], 18, 4), f: water ? K.water : shade(c, 0.35) },
        ]}
      />
    </G>
  );
}

/** Tokmak (ahşap çekiç): sap ucu h, baş yönü a (sap yönü) */
function Mallet({ h, a, len = 46, s = 1 }: { h: P; a: number; len?: number; s?: number }) {
  const e = pol(h, a, len * s);
  const n = a + 90;
  return (
    <OG
      sh={[
        { d: capsule(h, 2.6 * s, e, 2.6 * s), f: M.woodL },
        { d: beam(pol(e, n, -11 * s), pol(e, n, 11 * s), 15 * s), f: M.wood },
      ]}
    />
  );
}

/** Buhar bulutu */
function Steam({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g fill="#ffffff" opacity={0.85} stroke="#aab4be" stroke-width={1.2}>
      <path d={smooth([[x - 14 * s, y], [x - 20 * s, y - 14 * s], [x - 8 * s, y - 26 * s], [x + 6 * s, y - 22 * s], [x + 16 * s, y - 32 * s], [x + 22 * s, y - 16 * s], [x + 14 * s, y - 2 * s]], true)} />
    </g>
  );
}

/** Yağmur damlası */
function Drip({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x} ${y - 7 * s}Q${x + 4.5 * s} ${y - 1 * s} ${x} ${y + 2 * s}Q${x - 4.5 * s} ${y - 1 * s} ${x} ${y - 7 * s}Z`} fill={K.water} stroke={K.out} stroke-width={1} />;
}

/** Tavuk (yandan, sağa bakar); x,y = ayak altı */
function Hen({ x, y, s = 1, flip, sit, c = '#b8653a' }: { x: number; y: number; s?: number; flip?: boolean; sit?: boolean; c?: string }) {
  const legs: Sh[] = sit ? [] : [
    { d: poly([[-3, -12], [-4, 0], [-8, 0]], false), st: '#d99a2b', sw: 2.4 },
    { d: poly([[4, -12], [4, 0], [9, 0]], false), st: '#d99a2b', sw: 2.4 },
  ];
  const by = sit ? -12 : -24;
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          ...legs,
          { d: smooth([[-24, by - 6], [-20, by - 20], [-14, by - 10], [-6, by - 12], [10, by - 12], [18, by - 2], [12, by + 10], [-6, by + 12], [-20, by + 6]], true), f: c },
          { d: smooth([[-6, by + 2], [6, by - 4], [12, by + 4], [2, by + 8]], true), f: shade(c, 0.15), no: true },
          { d: circ([16, by - 16], 7), f: c },
          { d: poly([[22, by - 18], [29, by - 15], [22, by - 13]]), f: '#f0b23a' },
          { d: smooth([[11, by - 22], [13, by - 28], [17, by - 25], [20, by - 29], [22, by - 22]], true), f: K.danger },
          { d: ell([22, by - 9], 2.4, 3.6), f: K.danger },
        ]}
      />
      <circle cx={18} cy={by - 17} r={1.4} fill={K.ink} />
    </g>
  );
}

/* ════════════════════════ kütük ara dolgusu ════════════════════════ */

/** Kütük duvar: önde kütüklerin yan yüzü, sağda uç kesitleri; iki kütük arasında geniş aralık. */
function LogPair({ up = 0, fill = 'none' as 'none' | 'kama' | 'sıva', moss = true }) {
  const ex = 230, r = 40, rx = 34;
  const cl: P = [ex, 198], cu: P = [ex, 88 - up];
  const body = (c: P) => (
    <OG
      sh={[
        { d: rrect(-20, c[1] - r, c[0] + 20, r * 2, 0), f: M.bark },
        { d: rrect(-20, c[1] + r * 0.1, c[0] + 20, r * 0.55, 0), f: shade(M.bark, 0.12), no: true },
        { d: poly([[0, c[1] - r * 0.55], [c[0] - 30, c[1] - r * 0.6]], false), st: shade(M.bark, 0.35), sw: 1.2 },
        { d: poly([[20, c[1] + r * 0.6], [c[0] - 50, c[1] + r * 0.55]], false), st: shade(M.bark, 0.35), sw: 1.2 },
      ]}
    />
  );
  const gTop = 88 + r, gBot = 198 - r; // 128..158
  const mossD = smooth([[-20, gBot - 9], [30, gBot - 13], [80, gBot - 8], [130, gBot - 14], [180, gBot - 9], [ex + 6, gBot - 12], [ex + 6, gBot + 2], [-20, gBot + 2]], true);
  return (
    <g>
      <rect x={-20} y={gTop - 4} width={ex + 20} height={gBot - gTop + 8} fill="#4a3a30" />
      {body(cl)}
      {moss && <OG sh={[{ d: mossD, f: M.moss }]} />}
      <LogEnd c={cl} r={r} rx={rx} />
      {(fill === 'kama' || fill === 'sıva') && (
        <g>
          {[[-10, 100], [96, 210]].map(([x0, x1], i) => (
            <OG key={i} sh={[{ d: poly([[x0, gTop + 3], [x1, gTop + 5], [x1, gBot - 12], [x0, gBot - 10]]), f: M.woodL }, { d: poly([[x0 + 10, gTop + 10], [x1 - 20, gTop + 11]], false), st: shade(M.woodL, 0.3), sw: 1 }]} />
          ))}
          {fill === 'kama' && [30, 140, 186].map((x) => <circle key={x} cx={x} cy={gTop + 11} r={2.6} fill={M.iron} stroke={K.out} stroke-width={1} />)}
        </g>
      )}
      {fill === 'sıva' && (
        <g>
          <OG sh={[{ d: smooth([[-20, gTop - 2], [60, gTop - 4], [150, gTop - 1], [ex + 2, gTop - 3], [ex + 4, gBot + 3], [150, gBot + 4], [60, gBot + 2], [-20, gBot + 4]], true, 0.4), f: M.clay }]} />
          <g stroke={M.straw} stroke-width={1.6} stroke-linecap="round">
            {Array.from({ length: 16 }, (_, i) => {
              const x = 6 + i * 14, y = gTop + 6 + ((i * 7) % 18);
              return <line key={i} x1={x} y1={y} x2={x + 6} y2={y + (i % 2 ? 3 : -3)} />;
            })}
          </g>
        </g>
      )}
      {body(cu)}
      <LogEnd c={cu} r={r} rx={rx} />
    </g>
  );
}

const S_DOLDURMA: Record<string, () => JSX.Element> = {
  'sf-yp-doldurma-yosun': () => (
    <Scene2 bg="closeup">
      <LogPair up={30} />
      {[50, 170].map((x) => (
        <path key={x} d={`M${x} 0V${88 - 30 - 40}`} stroke={M.rope} stroke-width={4} />
      ))}
      <Arrow from={[290, 30]} to={[290, 112]} />
      <Label x={110} y={136} text="yosun" size={14} />
    </Scene2>
  ),
  'sf-yp-doldurma-kama': () => (
    <Scene2 bg="closeup">
      <LogPair fill="kama" />
      <Arrow from={[150, 236]} to={[150, 162]} w={5} />
    </Scene2>
  ),
  'sf-yp-doldurma-sivama': () => (
    <Scene2 bg="closeup">
      <LogPair fill="sıva" />
      <Hand x={250} y={176} a={-62} s={0.85} pose="press" side="R" skin={HAND.dold} arm={140} sleeve="#6d7480" />
      <Arrow from={[150, 106]} to={[60, 106]} w={5} />
    </Scene2>
  ),
};

/* ════════════════════════ harçsız taş duvar ════════════════════════ */

/** Kuru duvar kesiti: iki yüz, ara dolgu, temel, şevli yüzler; isteğe bağlı bağlayıcı taş ve şablon */
function DrySection({ through = [] as number[], template = false, rows = 7 }) {
  const gy = 208, top = 46, base = 74, topW = 40, cx = 160;
  const hw = (y: number) => topW + ((y - top) / (gy - top)) * (base - topW);
  const rh = (gy - top - 14) / rows;
  const out: JSX.Element[] = [];
  // ara dolgu (küçük taşlar)
  const r = rnd(9);
  for (let i = 0; i < 70; i++) {
    const y = top + 18 + r() * (gy - top - 22);
    const w = hw(y) - 24;
    const x = cx - w + r() * 2 * w;
    out.push(<path key={'h' + i} d={stoneD([x, y], 9 + r() * 6, 7 + r() * 4, 300 + i)} fill={shade(M.stone, 0.15)} stroke={K.out} stroke-width={1} />);
  }
  // yüz taşları
  for (let i = 0; i < rows; i++) {
    const y0 = gy - 4 - (i + 1) * rh, yc = y0 + rh / 2;
    const w = hw(yc);
    const fnd = i === 0;
    if (through.includes(i)) {
      out.push(
        <g key={'t' + i}>
          <path d={stoneD([cx, yc], 2 * w + 10, rh - 2, 50 + i, 5)} fill="none" stroke={K.action} stroke-width={7} />
          <Stone c={[cx, yc]} w={2 * w + 10} h={rh - 2} seed={50 + i} f={tint(M.stone, 0.15)} n={5} />
        </g>,
      );
      continue;
    }
    const lenL = (i % 2 ? 0.55 : 0.8) * w, lenR = (i % 2 ? 0.8 : 0.55) * w;
    const ex = fnd ? 8 : 0;
    out.push(<Stone key={'l' + i} c={[cx - w - ex + lenL / 2, yc]} w={lenL} h={rh - 2} seed={10 + i} n={4} f={fnd ? shade(M.stone, 0.05) : M.stone} />);
    out.push(<Stone key={'r' + i} c={[cx + w + ex - lenR / 2, yc]} w={lenR} h={rh - 2} seed={30 + i} n={4} f={fnd ? shade(M.stone, 0.05) : M.stone} />);
  }
  // tepe taşı
  out.push(<Stone key="cap" c={[cx, top + 6]} w={topW * 2 + 6} h={20} seed={77} n={4} f={tint(M.stone, 0.05)} />);
  const tpl = template && (
    <g>
      {[-1, 1].map((sg) => {
        const a: P = [cx + sg * (base + 10), gy + 6], b: P = [cx + sg * (topW + 10), top - 14];
        return <Plank key={sg} a={a} b={b} w={7} f={M.woodL} grain={false} />;
      })}
      <Plank a={[cx - topW - 14, top - 10]} b={[cx + topW + 14, top - 10]} w={7} f={M.woodL} grain={false} />
      {[0.45, 0.75].map((t) => {
        const y = gy - (gy - top) * t;
        const w = hw(y) + 10;
        return <line key={t} x1={cx - w - 4} y1={y} x2={cx + w + 4} y2={y} stroke={K.white} stroke-width={2} stroke-dasharray="4 3" />;
      })}
    </g>
  );
  return (
    <g>
      <rect x={0} y={gy} width={320} height={40} fill={M.soilL} />
      <rect x={0} y={gy - 4} width={320} height={6} fill={K.grass} />
      <rect x={cx - base - 12} y={gy - 4} width={(base + 12) * 2} height={14} fill={shade(M.soilL, 0.15)} />
      <path d={poly([[cx - base, gy], [cx - topW, top], [cx + topW, top], [cx + base, gy]])} fill={shade(M.stone, 0.3)} />
      {out}
      {tpl}
    </g>
  );
}

/** Ön görünüş duvar: şaşırtmalı ya da düz derzli taşlar (dikdörtgensi) */
function CourseWall({ x, y, w, rows, rh, bad, seed }: { x: number; y: number; w: number; rows: number; rh: number; bad?: boolean; seed: number }) {
  const r = rnd(seed);
  const out: JSX.Element[] = [];
  const unit = w / 3;
  for (let i = 0; i < rows; i++) {
    const yy = y - (i + 1) * rh;
    const off = bad ? 0 : i % 2 ? unit / 2 : 0;
    let xx = x - off;
    let j = 0;
    while (xx < x + w - 1) {
      const sw = unit;
      const x0 = Math.max(xx, x), x1 = Math.min(xx + sw, x + w);
      out.push(<Stone key={i + '-' + j} c={[(x0 + x1) / 2, yy + rh / 2]} w={x1 - x0 - 2} h={rh - 2} seed={seed * 10 + i * 7 + j} n={5} f={r() > 0.5 ? M.stone : tint(M.stone, 0.12)} />);
      xx += sw;
      j++;
    }
  }
  return <g>{out}</g>;
}

const S_KURU: Record<string, () => JSX.Element> = {
  'sf-yp-kuru-dizme': () => (
    <Scene2 bg="outdoor" gy={206}>
      <CourseWall x={22} y={214} w={150} rows={5} rh={30} seed={4} />
      <CourseWall x={210} y={214} w={90} rows={5} rh={30} bad seed={6} />
      <line x1={240} y1={214} x2={240} y2={64} stroke={K.danger} stroke-width={4} />
      <Ok x={97} y={42} r={15} />
      <Bad x={255} y={42} r={15} />
      <Arrow from={[97, 106]} to={[97, 140]} w={4} />
    </Scene2>
  ),
  'sf-yp-kuru-sev': () => (
    <Scene2 bg="outdoor" gy={208}>
      <DrySection template />
    </Scene2>
  ),
  'sf-yp-kuru-baglayici': () => (
    <Scene2 bg="outdoor" gy={208}>
      <DrySection through={[2, 5]} />
      <Dim a={[44, 204]} b={[44, 136]} text="50 cm" />
      <Dim a={[284, 204]} b={[284, 72]} text="1 m" />
    </Scene2>
  ),
};

/* ════════════════════════ kireç ════════════════════════ */

const S_KIREC: Record<string, () => JSX.Element> = {
  'sf-yp-kirec-ocak': () => {
    const r = rnd(21);
    const layers: JSX.Element[] = [];
    for (let i = 0; i < 4; i++) {
      const y = 186 - i * 28;
      for (let j = 0; j < 9; j++) layers.push(<LogEnd key={`w${i}-${j}`} c={[124 + j * 12.5, y]} r={5.6} />);
      for (let j = 0; j < 6; j++) layers.push(<path key={`s${i}-${j}`} d={stoneD([128 + j * 18 + r() * 4, y - 13], 17, 15, 400 + i * 10 + j)} fill={j % 2 ? M.lime : '#dcd8cc'} stroke={K.out} stroke-width={1.1} />);
    }
    return (
      <Scene2 bg="outdoor" gy={214} ground="dirt">
        {/* yamaç: ocak sağdaki toprak sete gömülü */}
        <path d="M60 214Q90 120 110 84H320V240H60Z" fill={M.soilL} stroke={K.out} stroke-width={1.5} />
        <path d="M110 84H320V92H108Z" fill={K.grass} />
        <rect x={98} y={78} width={148} height={140} fill={shade(M.stone, 0.1)} stroke={K.out} stroke-width={1.5} />
        <rect x={110} y={82} width={124} height={130} fill="#4a3a30" />
        {layers}
        {/* ateşlik: alt odacık ve ağız */}
        <path d="M86 214V200Q86 190 98 190H234V212H98Z" fill="#2c211b" />
        <path d="M80 214V196Q80 184 94 184H110V214Z" fill="#2c211b" stroke={K.out} stroke-width={1.5} />
        <Flame x={118} y={212} s={0.75} />
        <Flame x={160} y={212} s={0.85} />
        <Flame x={204} y={212} s={0.75} />
        {/* kil örtü */}
        <path d="M98 80Q172 40 246 80Z" fill={M.clay} stroke={K.out} stroke-width={1.5} />
        <Smoke x={146} y={6} w={56} h={30} kind="cloud" op={0.7} />
        <Label x={280} y={150} text="900°C+" size={15} />
      </Scene2>
    );
  },
  'sf-yp-kirec-tas': () => (
    <Scene2 bg="closeup">
      {/* iyi pişmiş: içi beyaz, gözenekli */}
      <OG sh={[{ d: stoneD([88, 140], 104, 84, 5, 2.6), f: '#e9e4d6' }]} />
      <OG sh={[{ d: stoneD([88, 142], 82, 62, 6, 2.6), f: M.lime, ln: true }]} />
      <g fill="#ddd7c6">{[[70, 130], [96, 150], [108, 128], [80, 158], [62, 148], [100, 166]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} />)}</g>
      {/* az pişmiş: ortası gri */}
      <OG sh={[{ d: stoneD([232, 140], 104, 84, 8, 2.6), f: '#e2ddcf' }]} />
      <OG sh={[{ d: stoneD([232, 142], 82, 62, 9, 2.6), f: M.lime, ln: true }]} />
      <OG sh={[{ d: stoneD([234, 143], 46, 34, 10, 2.6), f: '#8f9298', ln: true }]} />
      <Ok x={88} y={62} r={17} />
      <Bad x={232} y={62} r={17} />
    </Scene2>
  ),
  'sf-yp-kirec-sondurme': () => {
    const base: P = [168, 104];
    const hF: P = [166, 98], hB: P = [178, 122];
    const p: PersonProps = {
      ...CAST.kirec, x: 112, y: 222, glasses: true,
      pose: { spine: -100, chest: -104, head: -98, legB: [102, 98], legF: [72, 86], armF: { to: hF }, armB: { to: hB }, face: 'neutral' },
    };
    const r = rig(p);
    const glove = (h: P) => <circle cx={h[0]} cy={h[1]} r={7} fill="#3f6b45" stroke={K.out} stroke-width={1.5} />;
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <OG sh={[{ d: poly([[196, 178], [306, 178], [298, 224], [204, 224]]), f: M.wood }, { d: poly([[202, 182], [300, 182], [296, 192], [206, 192]]), f: shade(M.wood, 0.25), no: true }]} />
        <g>{[212, 234, 256, 278].map((x, i) => <path key={x} d={stoneD([x, 180 - (i % 2) * 3], 22, 14, 600 + i)} fill={M.lime} stroke={K.out} stroke-width={1.1} />)}</g>
        <path d={smooth([[200, 120], [210, 146], [218, 176]])} fill="none" stroke={K.water} stroke-width={5} stroke-linecap="round" />
        <Steam x={250} y={164} s={1.2} />
        <Steam x={286} y={150} s={0.9} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Bucket x={base[0]} y={base[1]} a={112} s={0.9} />
        <Person {...p} only={['armF']} />
        {glove(r.handF)}
        {glove(r.handB)}
        <Arrow from={[96, 60]} to={[46, 60]} w={5} />
      </Scene2>
    );
  },
};

/* ════════════════════════ harçlı taş duvar ════════════════════════ */

const S_TASD: Record<string, () => JSX.Element> = {
  'sf-yp-tasd-baglayici': () => {
    const gy = 214, x0 = 90, x1 = 230, top = 34;
    const r = rnd(12);
    const core: JSX.Element[] = [];
    for (let i = 0; i < 40; i++) core.push(<path key={i} d={stoneD([x0 + 40 + r() * (x1 - x0 - 80), top + 10 + r() * (gy - top - 20)], 12 + r() * 8, 9 + r() * 5, 700 + i)} fill={shade(M.stone, 0.12)} stroke={K.out} stroke-width={1} />);
    const face: JSX.Element[] = [];
    for (let i = 0; i < 6; i++) {
      const y = gy - 15 - i * 30;
      if (i === 3) continue;
      face.push(<Stone key={'a' + i} c={[x0 + 22, y]} w={44} h={28} seed={710 + i} n={4} />);
      face.push(<Stone key={'b' + i} c={[x1 - 22, y]} w={44} h={28} seed={730 + i} n={4} />);
    }
    const ty = gy - 15 - 3 * 30;
    const tw = (x1 - x0) * 0.75;
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={gy} width={320} height={26} fill={M.soilL} />
        <rect x={x0} y={top} width={x1 - x0} height={gy - top} fill={M.mortar} stroke={K.out} stroke-width={1.5} />
        {core}
        {face}
        <path d={stoneD([x0 + tw / 2, ty], tw, 28, 760, 5)} fill="none" stroke={K.action} stroke-width={7} />
        <Stone c={[x0 + tw / 2, ty]} w={tw} h={28} seed={760} n={5} f={tint(M.stone, 0.15)} />
        <Dim a={[x0, 20]} b={[x1, 20]} text="50 cm" />
        <Dim a={[x0, ty + 26]} b={[x0 + tw, ty + 26]} text="¾" size={14} />
      </Scene2>
    );
  },
  'sf-yp-tasd-hatil': () => {
    const x = 30, w = 260, gy = 222;
    const bands = [190, 120, 50];
    return (
      <Scene2 bg="outdoor" gy={222}>
        <StoneFace x={x} y={42} w={w} h={gy - 42} row={18} seed={8} />
        {bands.map((y) => (
          <g key={y}>
            <Plank a={[x - 6, y]} b={[x + w + 6, y]} w={11} />
          </g>
        ))}
        <Dim a={[x + w + 16, 120]} b={[x + w + 16, 190]} text="1,5 m" size={12} lab={[x + w - 4, 155]} />
      </Scene2>
    );
  },
  'sf-yp-tasd-bosluk': () => {
    const x = 20, w = 280, gy = 220, top = 50;
    return (
      <Scene2 bg="outdoor" gy={220}>
        <StoneFace x={x} y={top} w={w} h={gy - top} row={17} seed={11} />
        <Plank a={[x - 4, top + 4]} b={[x + w + 4, top + 4]} w={9} />
        {/* pencere */}
        <rect x={100} y={96} width={52} height={60} fill="#3e4d5e" stroke={K.out} stroke-width={1.5} />
        <Plank a={[90, 91]} b={[162, 91]} w={9} />
        {/* kapı */}
        <rect x={194} y={96} width={52} height={124} fill="#7a5233" stroke={K.out} stroke-width={1.5} />
        <Plank a={[184, 91]} b={[256, 91]} w={9} />
        <Dim a={[x, 176]} b={[100, 176]} text="1,5 m" />
        <Dim a={[152, 128]} b={[194, 128]} text="1 m" size={11} />
      </Scene2>
    );
  },
};

/* ════════════════════════ ahşap iskelet ════════════════════════ */

/** Duvar çatkısı: taban kirişi, dikmeler, başlık kirişi; çaprazlar ve isteğe bağlı dolgu */
function Frame({ x0, x1, yb, yt, posts, braces, infill }: { x0: number; x1: number; yb: number; yt: number; posts: number[]; braces: Array<[P, P]>; infill?: Array<'kerpic' | 'orgu' | null> }) {
  const w = 10;
  return (
    <g>
      {infill &&
        posts.slice(0, -1).map((px, i) => {
          const k = infill[i];
          if (!k) return null;
          const xa = px + w / 2, xb = posts[i + 1] - w / 2;
          if (k === 'kerpic') return <KerpicFace key={i} x={xa} y={yt + w / 2} w={xb - xa} h={yb - yt - w} bw={26} bh={12} />;
          return (
            <g key={i}>
              <rect x={xa} y={yt + w / 2} width={xb - xa} height={yb - yt - w} fill={M.clay} stroke={K.out} stroke-width={1.2} />
              {Array.from({ length: 4 }, (_, j) => (
                <line key={j} x1={xa + ((j + 1) * (xb - xa)) / 5} y1={yt + w} x2={xa + ((j + 1) * (xb - xa)) / 5} y2={yb - w} stroke={shade(M.bark, 0.05)} stroke-width={4} />
              ))}
              {Array.from({ length: 9 }, (_, j) => {
                const y = yt + 14 + j * ((yb - yt - 24) / 9);
                return <path key={'o' + j} d={smooth([[xa + 2, y], [xa + (xb - xa) * 0.3, y + (j % 2 ? 3 : -3)], [xa + (xb - xa) * 0.6, y + (j % 2 ? -3 : 3)], [xb - 2, y]])} fill="none" stroke="#9a7a4c" stroke-width={3.4} />;
              })}
              <path d={smooth([[xa, yt + 66], [xa + (xb - xa) * 0.35, yt + 60], [xa + (xb - xa) * 0.7, yt + 68], [xb, yt + 62], [xb, yb - w / 2], [xa, yb - w / 2]], true, 0.4)} fill={M.clay} stroke={K.out} stroke-width={1.2} />
            </g>
          );
        })}
      {braces.map(([a, b], i) => <Plank key={'b' + i} a={a} b={b} w={9} grain={false} />)}
      {posts.map((px) => <Plank key={px} a={[px, yb]} b={[px, yt]} w={w} />)}
      <Plank a={[x0 - 4, yb]} b={[x1 + 4, yb]} w={12} />
      <Plank a={[x0 - 4, yt]} b={[x1 + 4, yt]} w={12} />
    </g>
  );
}

const S_ISKELET: Record<string, () => JSX.Element> = {
  'sf-yp-iskelet-dikme': () => {
    const o: P = [22, -14];
    const at = (p: P, t: number): P => [p[0] + o[0] * t, p[1] + o[1] * t];
    const yS = 150, yB = 178;
    return (
      <Scene2 bg="closeup">
        <StoneFace x={20} y={yB} w={270} h={62} row={20} seed={31} />
        {/* taban kirişi */}
        <OG sh={[{ d: poly([[20, yS], [290, yS], at([290, yS], 1), at([20, yS], 1)]), f: M.woodL }, { d: poly([[20, yS], [290, yS], [290, yB], [20, yB]]), f: M.wood }, { d: poly([[290, yS], at([290, yS], 1), at([290, yB], 1), [290, yB]]), f: M.logEnd }]} />
        {/* yuva */}
        <path d={poly([at([148, yS], 0.25), at([172, yS], 0.25), at([172, yS], 0.75), at([148, yS], 0.75)])} fill="#3a2a22" stroke={K.out} stroke-width={1.2} />
        {/* dikme ve zıvana dili */}
        <OG sh={[
          { d: poly([[152, 104], [168, 104], [168, 126], [152, 126]]), f: M.wood },
          { d: poly([[168, 104], at([168, 104], 0.5), at([168, 126], 0.5), [168, 126]]), f: shade(M.wood, 0.2) },
          { d: poly([[140, 0], [180, 0], [180, 104], [140, 104]]), f: M.wood },
          { d: poly([[180, 0], at([180, 0], 1), at([180, 104], 1), [180, 104]]), f: shade(M.wood, 0.2) },
          { d: poly([[150, 10], [152, 90]], false), st: shade(M.wood, 0.3), sw: 1 },
        ]} />
        <Arrow from={[106, 40]} to={[106, 128]} />
        <Label x={238} y={112} text="zıvana" size={14} />
      </Scene2>
    );
  },
  'sf-yp-iskelet-capraz': () => {
    const yb = 196, yt = 64;
    const posts = [24, 94, 164, 234];
    return (
      <Scene2 bg="outdoor" gy={210}>
        <StoneFace x={14} y={202} w={230} h={30} row={15} seed={33} />
        <Frame x0={24} x1={234} yb={yb} yt={yt} posts={posts} braces={[[[29, yb - 4], [89, yt + 60]], [[229, yb - 4], [169, yt + 60]], [[99, yt + 4], [159, yt + 64]]]} />
        <Ok x={130} y={32} r={15} />
        {/* çaprazsız çatkı yana yatar */}
        <g>
          <Plank a={[258, 196]} b={[290, 196]} w={8} />
          <Plank a={[260, 196]} b={[284, 112]} w={8} />
          <Plank a={[290, 196]} b={[314, 112]} w={8} />
          <Plank a={[280, 112]} b={[318, 112]} w={8} />
          <Bad x={286} y={84} r={13} />
        </g>
      </Scene2>
    );
  },
  'sf-yp-iskelet-himis': () => {
    const yb = 190, yt = 56;
    const posts = [24, 98, 172, 246, 296];
    return (
      <Scene2 bg="outdoor" gy={206}>
        <StoneFace x={12} y={196} w={296} h={44} row={16} seed={35} />
        <Frame x0={24} x1={296} yb={yb} yt={yt} posts={posts} infill={['kerpic', 'orgu', 'kerpic', 'kerpic']}
          braces={[[[29, yb - 4], [93, yt + 70]], [[241, yb - 4], [177, yt + 70]]]} />
      </Scene2>
    );
  },
};

/* ════════════════════════ merdiven ════════════════════════ */

/** Merdiven (yandan-eğik): ayak a, tepe b; iki dikme, basamaklar */
function Ladder({ a, b, gap = 26, w = 6, off = [10, -4] as P }: { a: P; b: P; gap?: number; w?: number; off?: P }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.floor(L / gap);
  const back = (p: P): P => [p[0] + off[0], p[1] + off[1]];
  const rungs = Array.from({ length: n }, (_, i) => lerp(a, b, (i + 0.7) / (n + 0.2)));
  return (
    <g>
      <Plank a={back(a)} b={back(b)} w={w} f={shade(M.wood, 0.2)} grain={false} />
      {rungs.map((p, i) => <OG key={i} sh={[{ d: capsule(p, 2.6, back(p), 2.6), f: M.woodL }]} />)}
      <Plank a={a} b={b} w={w} grain={false} />
    </g>
  );
}

const S_MERDIVEN: Record<string, () => JSX.Element> = {
  'sf-yp-merdiven-basamak': () => (
    <Scene2 bg="closeup">
      {/* doğru: basamak ucu dikmedeki delikten geçmiş, kavelayla sabit */}
      {[78, 168].map((y) => (
        <g key={y}>
          <OG sh={[{ d: rrect(56, y - 10, 30, 20, 8), f: M.woodL }]} />
        </g>
      ))}
      <Plank a={[100, 6]} b={[100, 236]} w={34} f={M.wood} />
      {[78, 168].map((y) => (
        <g key={'r' + y}>
          <OG sh={[{ d: rrect(116, y - 10, 92, 20, 8), f: M.woodL }, { d: rrect(116, y + 2, 92, 6, 3), f: shade(M.woodL, 0.12), no: true }]} />
          <OG sh={[{ d: circ([100, y], 5.5), f: M.logEnd }]} />
        </g>
      ))}
      <Ok x={160} y={36} r={15} />
      {/* yanlış: yüzeye çivili basamak */}
      <Plank a={[262, 60]} b={[262, 236]} w={26} f={M.wood} />
      <OG sh={[{ d: rrect(232, 120, 80, 18, 6), f: M.woodL }]} />
      <circle cx={262} cy={129} r={3} fill={M.iron} stroke={K.out} stroke-width={1} />
      <Bad x={262} y={36} r={15} />
    </Scene2>
  ),
  'sf-yp-merdiven-aci': () => {
    const gy = 214, wx = 252, top: P = [wx - 2, 54];
    const foot: P = [wx - (gy - top[1]) / 4, gy];
    return (
      <Scene2 bg="outdoor" gy={214}>
        <rect x={wx} y={40} width={80} height={180} fill="#e8dcc6" stroke={K.out} stroke-width={1.5} />
        <path d="M240 46L330 6V46Z" fill={M.tile} stroke={K.out} stroke-width={1.5} />
        <Ladder a={foot} b={top} />
        <Dim a={[wx + 22, gy]} b={[wx + 22, top[1]]} text="4" size={15} />
        <Dim a={[foot[0], gy + 14]} b={[wx, gy + 14]} text="1" size={15} lab={[foot[0] - 20, gy + 14]} />
      </Scene2>
    );
  },
  'sf-yp-merdiven-uc-nokta': () => {
    const foot: P = [190, 228], top: P = [246, 4];
    const at = (y: number): P => [foot[0] + ((foot[1] - y) / (foot[1] - top[1])) * (top[0] - foot[0]), y];
    const hA = at(98), hB = at(58), fA = at(200), fB = at(172);
    const hip = at(128);
    const p: PersonProps = {
      ...CAST.merdiven, x: hip[0] - 26, y: hip[1], ay: 'hip',
      pose: { spine: -78, chest: -80, head: -82, armB: { to: hB }, armF: { to: [hA[0] - 2, hA[1]] }, legB: { to: [fA[0] - 4, fA[1] - 2] }, legF: { to: [fB[0] - 6, fB[1] - 3] }, handB: 'fist', handF: 'fist', footB: 0, footF: 0, face: 'neutral' },
    };
    const Ring = ({ c }: { c: P }) => <circle cx={c[0]} cy={c[1]} r={13} fill="none" stroke={K.action} stroke-width={3.5} />;
    return (
      <Scene2 bg="outdoor" gy={214}>
        <rect x={252} y={0} width={80} height={220} fill="#e8dcc6" stroke={K.out} stroke-width={1.5} />
        <Ladder a={foot} b={top} gap={24} />
        <Person {...p} />
        <Ring c={hB} />
        <Ring c={[hA[0] - 2, hA[1]]} />
        <Ring c={[fA[0] - 4, fA[1] - 2]} />
        <Label x={70} y={40} text="3 nokta" size={15} />
      </Scene2>
    );
  },
};

/* ════════════════════════ çatı eğimi ════════════════════════ */

/** Beşik çatı silueti: tabanın ortası c, yarım genişlik hw, açı deg; malzeme deseni */
function RoofTri({ c, hw, deg, kind }: { c: P; hw: number; deg: number; kind: 'saz' | 'kiremit' | 'sindil' }) {
  const h = hw * Math.tan(deg * RAD);
  const L: P = [c[0] - hw, c[1]], R: P = [c[0] + hw, c[1]], T: P = [c[0], c[1] - h];
  const f = kind === 'saz' ? M.reed : kind === 'kiremit' ? M.tile : '#9b7350';
  const id = `rt-${f1(c[0])}`;
  const lines: JSX.Element[] = [];
  for (let i = 1; i < 6; i++) {
    const y = c[1] - (h * i) / 6;
    if (kind === 'saz') for (let j = -8; j <= 8; j++) lines.push(<line key={`${i}-${j}`} x1={c[0] + j * 7} y1={y} x2={c[0] + j * 7 + 2} y2={y + h / 6} stroke={shade(f, 0.25)} stroke-width={1} />);
    lines.push(<path key={'h' + i} d={kind === 'kiremit' ? `M${c[0] - hw} ${y}` + Array.from({ length: 12 }, (_, j) => `q4 5 8 0`).join('') + Array.from({ length: 12 }, () => `q4 5 8 0`).join('') : `M${c[0] - hw} ${y}H${c[0] + hw}`} fill="none" stroke={shade(f, 0.3)} stroke-width={1.3} />);
    if (kind === 'sindil') for (let j = -6; j <= 6; j++) lines.push(<line key={`s${i}-${j}`} x1={c[0] + j * 9 + (i % 2) * 4.5} y1={y} x2={c[0] + j * 9 + (i % 2) * 4.5} y2={y + h / 6} stroke={shade(f, 0.3)} stroke-width={1} />);
  }
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={poly([L, T, R])} />
        </clipPath>
      </defs>
      <path d={poly([L, T, R])} fill={f} />
      <g clip-path={`url(#${id})`}>{lines}</g>
      <path d={poly([L, T, R])} fill="none" stroke={K.out} stroke-width={1.6} />
    </g>
  );
}

const S_CATI: Record<string, () => JSX.Element> = {
  'sf-yp-cati-egimler': () => {
    const y = 176;
    const items = [
      { x: 56, deg: 45, kind: 'saz' as const, name: 'saz' },
      { x: 160, deg: 40, kind: 'kiremit' as const, name: 'kiremit' },
      { x: 264, deg: 35, kind: 'sindil' as const, name: 'şındıl' },
    ];
    return (
      <Scene2 bg="closeup">
        {items.map((it) => (
          <g key={it.x}>
            <rect x={it.x - 38} y={y} width={76} height={34} fill="#e8dcc6" stroke={K.out} stroke-width={1.5} />
            <RoofTri c={[it.x, y]} hw={48} deg={it.deg} kind={it.kind} />
            <AngleArc c={[it.x - 48, y]} r={26} a1={-it.deg} a2={0} />
            <Label x={it.x} y={64} text={`${it.deg}°`} size={16} />
            <text x={it.x} y={228} text-anchor="middle" font-size={14} font-weight={700} fill={K.ink}>{it.name}</text>
          </g>
        ))}
      </Scene2>
    );
  },
  'sf-yp-cati-makas': () => {
    const L: P = [118, 132], R: P = [300, 132], T: P = [209, 34];
    return (
      <Scene2 bg="outdoor" gy={214}>
        <KerpicFace x={110} y={132} w={28} h={86} bw={14} bh={12} />
        <KerpicFace x={280} y={132} w={28} h={86} bw={14} bh={12} />
        <Plank a={[L[0] - 8, L[1] + 8]} b={T} w={11} />
        <Plank a={[R[0] + 8, R[1] + 8]} b={T} w={11} />
        <path d={beam([L[0] - 4, L[1] + 6], [R[0] + 4, R[1] + 6], 12)} fill="none" stroke={K.safe} stroke-width={6} />
        <Plank a={[L[0] - 4, L[1] + 6]} b={[R[0] + 4, R[1] + 6]} w={11} />
        <Ok x={209} y={162} r={14} />
        {/* bağ kirişsiz: çatı duvarları dışa iter, duvarlar açılır */}
        <g>
          <path d="M8 216L22 132L42 132L30 216Z" fill={M.kerpic} stroke={K.out} stroke-width={1.5} />
          <path d="M84 216L72 132L92 132L106 216Z" fill={M.kerpic} stroke={K.out} stroke-width={1.5} />
          <g stroke={shade(M.kerpic, 0.3)} stroke-width={1.2}>
            {[150, 168, 186, 204].map((y) => <path key={y} d={`M${8 + (216 - y) / 6} ${y}H${30 + (216 - y) / 7}M${84 - (216 - y) / 7} ${y}H${106 - (216 - y) / 6}`} />)}
          </g>
          <Plank a={[26, 134]} b={[57, 84]} w={8} />
          <Plank a={[88, 134]} b={[57, 84]} w={8} />
          <Arrow from={[22, 160]} to={[2, 160]} w={4} color={K.danger} />
          <Arrow from={[92, 160]} to={[114, 160]} w={4} color={K.danger} />
          <Bad x={57} y={58} r={13} />
        </g>
      </Scene2>
    );
  },
  'sf-yp-cati-sacak': () => {
    const gy = 214, wx0 = 150, wx1 = 196;
    const eave: P = [96, 108];
    const ridge: P = [330, 4];
    return (
      <Scene2 bg="outdoor" gy={214}>
        <KerpicFace x={wx0} y={118} w={wx1 - wx0} h={gy - 118} bw={23} bh={12} />
        <rect x={wx0 - 6} y={104} width={wx1 - wx0 + 12} height={14} fill={M.wood} stroke={K.out} stroke-width={1.5} />
        <rect x={wx1} y={118} width={140} height={96} fill="#e9e0d0" opacity={0.6} />
        <Plank a={eave} b={ridge} w={10} />
        <path d={beam([eave[0] - 6, eave[1] - 10], [ridge[0], ridge[1] - 10], 12)} fill={M.tile} stroke={K.out} stroke-width={1.5} />
        {[0, 1, 2].map((i) => <Drip key={i} x={eave[0] - 6} y={128 + i * 26} />)}
        <g>{Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={66 + i * 7} cy={gy + 4 + (i % 2) * 2} rx={5} ry={3.4} fill={M.stone} stroke={K.out} stroke-width={1} />)}</g>
        <Dim a={[eave[0] - 6, 92]} b={[wx0, 92]} text="50 cm" lab={[118, 70]} />
      </Scene2>
    );
  },
};

/* ════════════════════════ toprak dam ════════════════════════ */

/** Düz toprak damlı kerpiç ev (önden). x sol, gy zemin, w genişlik */
function FlatHouse({ x, gy, w, h, soil = 22, s = 1 }: { x: number; gy: number; w: number; h: number; soil?: number; s?: number }) {
  return (
    <g>
      <KerpicFace x={x} y={gy - h} w={w} h={h} bw={26 * s} bh={12 * s} />
      <rect x={x + w * 0.4} y={gy - h * 0.62} width={w * 0.2} height={h * 0.62} fill="#7a5233" stroke={K.out} stroke-width={1.5} />
      <g>{Array.from({ length: Math.floor((w + 16) / 12) }, (_, i) => <LogEnd key={i} c={[x - 8 + 6 + i * 12, gy - h - 5]} r={5} />)}</g>
      <path d={`M${x - 10} ${gy - h - 10}H${x + w + 10}V${gy - h - 10 - soil}Q${x + w / 2} ${gy - h - 14 - soil} ${x - 10} ${gy - h - 10 - soil}Z`} fill={M.soil} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

const S_DAM: Record<string, () => JSX.Element> = {
  'sf-yp-dam-yasak': () => (
    <Scene2 bg="outdoor" gy={206}>
      <FlatHouse x={26} gy={214} w={110} h={86} soil={26} />
      <path d="M70 128L64 150L74 166L66 190" fill="none" stroke={K.out} stroke-width={2} />
      <Shake x1={20} x2={142} y={226} h={14} />
      <No x={81} y={152} r={50} />
      {/* hafif ahşap çatılı ev */}
      <rect x={190} y={128} width={110} height={86} fill="#e8dcc6" stroke={K.out} stroke-width={1.5} />
      <rect x={234} y={160} width={22} height={54} fill="#7a5233" stroke={K.out} stroke-width={1.5} />
      <RoofTri c={[245, 128]} hw={68} deg={30} kind="sindil" />
      <Ok x={245} y={36} r={16} />
    </Scene2>
  ),
  'sf-yp-dam-katlar': () => {
    const x0 = 20, x1 = 300;
    return (
      <Scene2 bg="closeup">
        <rect x={x0} y={200} width={x1 - x0} height={40} fill="#4a3a30" />
        {Array.from({ length: 7 }, (_, i) => <LogEnd key={i} c={[x0 + 22 + i * 42, 200]} r={17} />)}
        <g>{Array.from({ length: 23 }, (_, i) => <OG key={i} sh={[{ d: circ([x0 + 6 + i * 12.2, 176], 6), f: M.bark }]} />)}</g>
        <OG sh={[{ d: smooth([[x0, 168], [80, 160], [160, 164], [240, 158], [x1, 164], [x1, 150], [200, 146], [100, 150], [x0, 146]], true), f: M.straw }]} />
        <rect x={x0} y={140} width={x1 - x0} height={7} fill="#5e6f7c" stroke={K.out} stroke-width={1.2} />
        <rect x={x0} y={92} width={x1 - x0} height={48} fill={M.soil} stroke={K.out} stroke-width={1.5} />
        <g fill={shade(M.soil, 0.2)}>{Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={x0 + 12 + i * 15.5} cy={104 + (i * 13) % 30} rx={4} ry={2.4} />)}</g>
        <Dim a={[x1 - 30, 92]} b={[x1 - 30, 140]} text="≤15 cm" lab={[x1 - 30, 60]} />
      </Scene2>
    );
  },
  'sf-yp-dam-log': () => {
    const roof = 132;
    const grip: P = [150, 86];
    const p: PersonProps = { ...CAST.dam, x: 196, y: roof, s: 0.74, flip: true, pose: { ...POSE.walk, spine: -82, chest: -80, head: -86, armF: { to: grip }, armB: { to: [grip[0] + 4, grip[1] + 3] }, face: 'neutral' } };
    const roll: P = [96, roof - 13];
    return (
      <Scene2 bg="outdoor" gy={214}>
        <FlatHouse x={30} gy={228} w={260} h={76} soil={10} />
        <OG sh={[{ d: capsule(grip, 2.4, roll, 2.4), f: M.wood }]} />
        <OG sh={[{ d: ell(roll, 13, 13), f: M.stone }, { d: ell(roll, 4, 4), f: M.wood }]} />
        <Person {...p} />
        <Arrow from={[80, 70]} to={[30, 70]} />
      </Scene2>
    );
  },
};

/* ════════════════════════ eğik kesit yardımcıları ════════════════════════ */

/** Eğim boyunca yerel koordinat: x eğim yönünde (yukarı), y çatı yüzeyinden yukarı (dik). */
const slope = (o: P, deg: number) => {
  const u: P = [Math.cos(-deg * RAD), Math.sin(-deg * RAD)];
  const n: P = [u[1], -u[0]];
  return (x: number, y: number): P => [o[0] + u[0] * x + n[0] * y, o[1] + u[1] * x + n[1] * y];
};

/* ════════════════════════ saz çatı ════════════════════════ */

const S_SAZ: Record<string, () => JSX.Element> = {
  'sf-yp-saz-egim': () => {
    const L: P = [46, 206], R: P = [274, 206], T: P = [160, 60];
    const lath = (a: P, b: P) => Array.from({ length: 7 }, (_, i) => lerp(a, b, 0.1 + i * 0.125));
    return (
      <Scene2 bg="outdoor" gy={214}>
        <Plank a={L} b={T} w={10} />
        <Plank a={R} b={T} w={10} />
        <Plank a={[L[0] + 6, 200]} b={[R[0] - 6, 200]} w={10} />
        {[...lath(L, T), ...lath(R, T)].map((p, i) => {
          const s = i < 7 ? -1 : 1;
          const c: P = [p[0] + s * 7, p[1] - 5];
          return <OG key={i} sh={[{ d: rrect(c[0] - 4.5, c[1] - 4.5, 9, 9, 1.5), f: M.woodL }]} />;
        })}
        <AngleArc c={L} r={40} a1={-52} a2={0} text="45°+" size={15} />
      </Scene2>
    );
  },
  'sf-yp-saz-dizme': () => {
    const laths = [62, 116, 170];
    const bundle = (x: number, i: number) => (
      <g key={x}>
        <OG sh={[{ d: smooth([[x + 3, 34], [x + 37, 34], [x + 40, 206], [x, 206]], true, 0.3), f: M.reed }]} />
        <g stroke={shade(M.reed, 0.3)} stroke-width={1}>{[8, 15, 22, 29, 35].map((dx) => <line key={dx} x1={x + dx} y1={40} x2={x + dx + 1} y2={196} />)}</g>
        <ellipse cx={x + 20} cy={206} rx={20} ry={6} fill={shade(M.reed, 0.2)} stroke={K.out} stroke-width={1.3} />
        <g fill={shade(M.reed, 0.45)}>{[6, 13, 20, 27, 34].map((dx) => <circle key={dx} cx={x + dx} cy={206 + ((dx + i) % 3) - 1} r={1.3} />)}</g>
        <path d={`M${x} 118H${x + 40}`} stroke={M.rope} stroke-width={3.5} />
      </g>
    );
    const h = handAt({ a: -40, s: 0.85, pose: 'pinch' as const, side: 'L' as const, skin: HAND.saz, arm: 120, sleeve: K.role.bystander3 }, 'pinch', [86, 140]);
    return (
      <Scene2 bg="outdoor" gy={226}>
        {[22, 96].map((x) => <Plank key={x} a={[x, 0]} b={[x, 230]} w={12} />)}
        {laths.map((y) => <Plank key={y} a={[0, y]} b={[320, y]} w={10} />)}
        {[136, 178, 220, 262, 304].map((x, i) => bundle(x, i))}
        <path d={smooth([[136, 116], [118, 124], [100, 136], [86, 140]])} fill="none" stroke={M.rope} stroke-width={3} />
        <Hand {...h} />
        <Arrow from={[300, 150]} to={[300, 214]} w={4} />
      </Scene2>
    );
  },
  'sf-yp-saz-bindirme': () => {
    const tr = slope([30, 230], 48);
    const E = 46;
    const out: JSX.Element[] = [];
    out.push(<path key="rf" d={poly([tr(-10, -14), tr(300, -14), tr(300, -4), tr(-10, -4)])} fill={M.wood} stroke={K.out} stroke-width={1.5} />);
    for (let k = 0; k < 7; k++) out.push(<path key={'l' + k} d={poly([tr(k * E + 20, -4), tr(k * E + 30, -4), tr(k * E + 30, 6), tr(k * E + 20, 6)])} fill={M.woodL} stroke={K.out} stroke-width={1.2} />);
    for (let i = 0; i < 5; i++) {
      const x0 = i * E;
      const d = poly([tr(x0, 6 + i * 4), tr(x0, 46 + i * 4), tr(x0 + 150, 18 + (i + 2) * 4), tr(x0 + 150, 6 + (i + 2) * 4)]);
      out.push(<path key={'b' + i} d={d} fill={i % 2 ? M.reed : tint(M.reed, 0.12)} stroke={K.out} stroke-width={1.3} />);
      out.push(<path key={'s' + i} d={poly([tr(x0 + 10, 14), tr(x0 + 120, 12)], false)} stroke={shade(M.reed, 0.3)} stroke-width={1} />);
    }
    return (
      <Scene2 bg="outdoor" gy={240}>
        {out}
        <Dim a={tr(150, 22)} b={tr(150, 58)} text="15–20 cm" lab={tr(150, 84)} />
      </Scene2>
    );
  },
};

/* ════════════════════════ şındıl ════════════════════════ */

const S_SINDIL: Record<string, () => JSX.Element> = {
  'sf-yp-sindil-yarma': () => {
    const bx = 214, top = 136, gy = 222;
    const handleTop: P = [192, 96];
    const strike: P = [236, 74];
    const p: PersonProps = {
      ...CAST.sindil, x: 138, y: gy,
      pose: { spine: -80, chest: -74, head: -70, legB: [100, 94], legF: [74, 86], armB: { to: [handleTop[0], handleTop[1] + 8] }, armF: { to: strike, bend: -1 }, handB: 'fist', handF: 'fist', face: 'neutral' },
    };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={210}>
        <OG sh={[{ d: poly([[bx - 30, top], [bx + 30, top], [bx + 30, gy - 6], [bx - 30, gy - 6]]), f: M.bark }, { d: ell([bx, gy - 6], 30, 7), f: M.bark }, { d: ell([bx, top], 30, 8), f: M.logEnd }]} />
        <OG sh={[{ d: poly([[bx + 26, top + 2], [bx + 38, top - 4], [bx + 46, gy - 30], [bx + 34, gy - 26]]), f: M.woodL }]} />
        <OG sh={[{ d: poly([[bx - 26, top - 4], [bx + 26, top - 4], [bx + 26, top + 6], [bx - 26, top + 6]]), f: K.metal }, { d: capsule([bx - 24, top - 2], 4, handleTop, 4), f: M.wood }]} />
        <Person {...p} />
        <Mallet h={[r.handF[0] - 6, r.handF[1] + 10]} a={-30} len={34} />
        <Arrow from={[bx + 24, 60]} to={[bx + 24, 112]} w={5} />
      </Scene2>
    );
  },
  'sf-yp-sindil-bindirme': () => {
    const rows = [190, 140, 90, 40];
    const r = rnd(41);
    const out: JSX.Element[] = [];
    const joints: number[][] = [];
    rows.slice().reverse().forEach((y, ri) => {
      const i = rows.length - 1 - ri;
      let x = i % 2 ? -18 : -40;
      const js: number[] = [];
      let j = 0;
      while (x < 330) {
        const w = 40 + r() * 18;
        out.push(<OG key={`${i}-${j}`} sh={[{ d: rrect(x + 1, y - 120, w - 2, 128, 2), f: j % 3 === 0 ? tint('#9b7350', 0.12) : j % 3 === 1 ? '#9b7350' : shade('#9b7350', 0.08) }, { d: poly([[x + w * 0.35, y - 100], [x + w * 0.4, y]], false), st: shade('#9b7350', 0.3), sw: 1 }]} />);
        js.push(x);
        x += w;
        j++;
      }
      joints[i] = js;
    });
    const jx = 160;
    const lower = joints[0].reduce((a, b) => (Math.abs(b - jx) < Math.abs(a - jx) ? b : a));
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#6e5038" />
        {out}
        <line x1={lower} y1={198} x2={lower} y2={150} stroke={K.action} stroke-width={3} stroke-dasharray="5 4" />
        <circle cx={lower} cy={146} r={8} fill="none" stroke={K.action} stroke-width={3} />
      </Scene2>
    );
  },
  'sf-yp-sindil-civi': () => {
    const panel = (x: number, ok: boolean) => {
      const y = 170;
      const nailX = ok ? x + 112 : x + 50;
      const headY = y - 24 + (18 * (nailX - x - 24)) / 116;
      return (
        <g>
          <rect x={x} y={y + 16} width={140} height={14} fill={M.wood} stroke={K.out} stroke-width={1.5} />
          {[x + 40, x + 104].map((lx) => <rect key={lx} x={lx} y={y} width={16} height={16} fill={M.woodL} stroke={K.out} stroke-width={1.3} />)}
          <path d={poly([[x - 4, y - 12], [x + 92, y - 4], [x + 92, y], [x - 4, y - 4]])} fill="#9b7350" stroke={K.out} stroke-width={1.3} />
          <path d={poly([[x + 24, y - 24], [x + 140, y - 6], [x + 140, y], [x + 24, y - 15]])} fill={tint('#9b7350', 0.15)} stroke={K.out} stroke-width={1.3} />
          <line x1={nailX} y1={headY} x2={nailX} y2={y + 10} stroke={M.iron} stroke-width={3} />
          <rect x={nailX - 6} y={headY - 4} width={12} height={4} rx={1.5} fill={M.iron} stroke={K.out} stroke-width={1} />
          <circle cx={nailX} cy={y - 10} r={15} fill="none" stroke={ok ? K.safe : K.danger} stroke-width={3} />
          {ok ? <Ok x={x + 70} y={60} r={16} /> : <Bad x={x + 70} y={60} r={16} />}
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        {panel(14, true)}
        {panel(170, false)}
      </Scene2>
    );
  },
};

/* ════════════════════════ kiremit ════════════════════════ */

const S_KIREMIT: Record<string, () => JSX.Element> = {
  'sf-yp-kiremit-kalip': () => {
    // üstten ince tahta çerçeve, iç ölçü 27 × 17 cm (1 cm ≈ 7 birim). İki ölçü de iç kenarlarda.
    const ix = 66, iy = 70, iw = 189, ih = 119, b = 11;
    return (
      <Scene2 bg="closeup">
        <rect x={20} y={40} width={280} height={180} rx={6} fill="#e7d3a6" stroke={K.out} stroke-width={1.5} />
        <g fill="#cdb684">{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={30 + ((i * 53) % 262)} cy={48 + ((i * 37) % 164)} r={1.4} />)}</g>
        <path d={`M${ix - b} ${iy - b}h${iw + 2 * b}v${ih + 2 * b}h${-(iw + 2 * b)}Z M${ix} ${iy}v${ih}h${iw}v${-ih}Z`} fill={M.wood} fill-rule="evenodd" stroke={K.out} stroke-width={1.5} />
        <g stroke={shade(M.wood, 0.25)} stroke-width={1}>
          <path d={`M${ix - b + 6} ${iy - b / 2}H${ix + iw + b - 6}M${ix - b + 6} ${iy + ih + b / 2}H${ix + iw + b - 6}`} />
        </g>
        <Dim a={[ix + 1, iy + 22]} b={[ix + iw - 1, iy + 22]} text="27 cm" size={13} />
        <Dim a={[ix + 30, iy + 1]} b={[ix + 30, iy + ih - 1]} text="17 cm" size={13} lab={[ix + 30, iy + 78]} />
      </Scene2>
    );
  },
  'sf-yp-kiremit-firin': () => {
    const x0 = 56, x1 = 264, top = 50, gy = 216;
    const glow = '#e2492f';
    return (
      <Scene2 bg="outdoor" gy={216} ground="dirt">
        <StoneFace x={x0 - 22} y={top - 10} w={x1 - x0 + 44} h={gy - top + 10} row={18} seed={51} />
        <rect x={x0} y={top} width={x1 - x0} height={gy - top} fill="#2c211b" />
        <Flame x={110} y={gy - 2} s={0.9} />
        <Flame x={160} y={gy - 2} s={1} />
        <Flame x={210} y={gy - 2} s={0.9} />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={x0 + 2 + i * 16} y={168} width={10} height={9} fill={M.kerpic} stroke={K.out} stroke-width={1} />)}
        {[0, 1].map((row) =>
          Array.from({ length: 14 }, (_, i) => (
            <rect key={row + '-' + i} x={x0 + 6 + i * 14.5} y={row ? 70 : 118} width={7} height={46} fill={i % 2 ? glow : '#f06a3c'} stroke={K.out} stroke-width={1} />
          )),
        )}
        <g opacity={0.85}>{[96, 154, 212].map((x) => <path key={x} d={`M${x} 166Q${x + 8} 140 ${x} 120Q${x - 6} 100 ${x + 3} 80`} fill="none" stroke={K.fireCore} stroke-width={3} />)}</g>
        <Smoke x={120} y={0} w={80} h={36} kind="cloud" op={0.6} />
        <Label x={160} y={30} text="875–900°C" size={14} />
      </Scene2>
    );
  },
  'sf-yp-kiremit-dizme': () => {
    const tr = slope([-30, 236], 28);
    const L = 150, lap = 44, Eg = L - lap, t = 11;
    const out: JSX.Element[] = [];
    out.push(<path key="rf" d={poly([tr(-20, -22), tr(420, -22), tr(420, -6), tr(-20, -6)])} fill={M.wood} stroke={K.out} stroke-width={1.5} />);
    for (let k = 0; k < 4; k++) {
      const lx = k * Eg + L - 18;
      out.push(<path key={'l' + k} d={poly([tr(lx, -6), tr(lx + 16, -6), tr(lx + 16, 10), tr(lx, 10)])} fill={M.woodL} stroke={K.out} stroke-width={1.2} />);
    }
    for (let i = 0; i < 4; i++) {
      const x0 = i * Eg;
      const lo = i ? 10 + t : 4;
      out.push(<path key={'t' + i} d={poly([tr(x0, lo), tr(x0, lo + t), tr(x0 + L, 10 + t), tr(x0 + L, 10)])} fill={i % 2 ? M.tile : tint(M.tile, 0.1)} stroke={K.out} stroke-width={1.4} />);
      out.push(<path key={'n' + i} d={poly([tr(x0 + L - 14, 10), tr(x0 + L - 14, 2), tr(x0 + L - 4, 2), tr(x0 + L - 4, 10)])} fill={shade(M.tile, 0.15)} stroke={K.out} stroke-width={1.1} />);
    }
    const n1 = tr(Eg + L - 30, 10 + t), n2 = tr(Eg + L - 30, -4);
    return (
      <Scene2 bg="outdoor" gy={240}>
        {out}
        <path d={poly([tr(2 * Eg, 10), tr(Eg + L, 10), tr(Eg + L, 10 + 2 * t + 2), tr(2 * Eg, 10 + 2 * t + 2)])} fill="none" stroke={K.action} stroke-width={3} />
        <line x1={n1[0]} y1={n1[1]} x2={n2[0]} y2={n2[1]} stroke={M.iron} stroke-width={3} />
        <circle cx={n1[0]} cy={n1[1]} r={3.5} fill={M.iron} stroke={K.out} stroke-width={1} />
        <Dim a={tr(2 * Eg, 46)} b={tr(Eg + L, 46)} text="6,5 cm" lab={tr(2 * Eg + lap / 2, 72)} />
      </Scene2>
    );
  },
};

/* ════════════════════════ kapı ════════════════════════ */

const S_KAPI: Record<string, () => JSX.Element> = {
  'sf-yp-kapi-kasa': () => {
    const ox0 = 124, ox1 = 196, oy = 70, gy = 214, fw = 9;
    return (
      <Scene2 bg="outdoor" gy={214}>
        <KerpicFace x={0} y={18} w={320} h={gy - 18} />
        <rect x={ox0} y={oy} width={ox1 - ox0} height={gy - oy} fill="#3e3029" />
        <Plank a={[ox0 + fw / 2, gy]} b={[ox0 + fw / 2, oy]} w={fw} />
        <Plank a={[ox1 - fw / 2, gy]} b={[ox1 - fw / 2, oy]} w={fw} />
        <Plank a={[ox0, oy + fw / 2]} b={[ox1, oy + fw / 2]} w={fw} />
        <path d={beam([ox0 - 14, oy - 7], [ox1 + 14, oy - 7], 14)} fill="none" stroke={K.action} stroke-width={5} />
        <Plank a={[ox0 - 14, oy - 7]} b={[ox1 + 14, oy - 7]} w={14} />
        <Dim a={[ox0 + fw, 140]} b={[ox1 - fw, 140]} text="1 m" size={12} />
        <Dim a={[230, oy]} b={[230, gy]} text="2,1 m" lab={[256, 142]} />
        <Dim a={[ox0 - 14, 46]} b={[ox0, 46]} text="20 cm" lab={[86, 40]} />
      </Scene2>
    );
  },
  'sf-yp-kapi-kanat': () => {
    const x0 = 92, x1 = 228, y0 = 26, y1 = 222;
    return (
      <Scene2 bg="indoor">
        {Array.from({ length: 5 }, (_, i) => {
          const w = (x1 - x0) / 5;
          return <Plank key={i} a={[x0 + w * i + w / 2, y1]} b={[x0 + w * i + w / 2, y0]} w={w - 1} f={i % 2 ? M.woodL : tint(M.woodL, 0.1)} />;
        })}
        <Plank a={[x0 + 6, 194]} b={[x1 - 6, 194]} w={18} />
        <Plank a={[x0 + 6, 54]} b={[x1 - 6, 54]} w={18} />
        <Plank a={[x0 + 14, 182]} b={[x1 - 14, 66]} w={16} />
        {[54, 194].map((y) => <g key={y}><rect x={x0 - 22} y={y - 6} width={34} height={12} rx={3} fill={M.iron} stroke={K.out} stroke-width={1.2} /><circle cx={x0 - 22} cy={y} r={7} fill={M.iron} stroke={K.out} stroke-width={1.2} /></g>)}
        <Arrow from={[x0 + 40, 170]} to={[x1 - 30, 70]} w={5} />
        <OG sh={[{ d: rrect(x1 - 26, 116, 18, 9, 3), f: M.wood }]} />
      </Scene2>
    );
  },
  'sf-yp-kapi-mil': () => {
    const px = 120, pw = 26;
    return (
      <Scene2 bg="closeup">
        <rect x={20} y={10} width={280} height={36} fill={M.wood} stroke={K.out} stroke-width={1.5} />
        <rect x={px - 7} y={28} width={14} height={18} fill="#3a2a22" />
        <path d={stoneD([px + 30, 222], 220, 46, 61, 5)} fill={M.stone} stroke={K.out} stroke-width={1.5} />
        <path d={ell([px, 202], 12, 4)} fill="#3a2a22" />
        {Array.from({ length: 4 }, (_, i) => <Plank key={i} a={[px + pw / 2 + 18 + i * 34, 190]} b={[px + pw / 2 + 18 + i * 34, 62]} w={33} f={i % 2 ? M.woodL : tint(M.woodL, 0.1)} />)}
        <OG sh={[{ d: capsule([px, 36], 6, [px, 58], 6), f: shade(M.wood, 0.1) }, { d: capsule([px, 192], 6, [px, 206], 6), f: shade(M.wood, 0.1) }, { d: rrect(px - pw / 2, 56, pw, 138, 4), f: M.wood }]} />
        <circle cx={px} cy={40} r={16} fill="none" stroke={K.action} stroke-width={3.5} />
        <circle cx={px} cy={200} r={16} fill="none" stroke={K.action} stroke-width={3.5} />
        <Arrow from={[64, 140]} to={[64, 92]} bend={0.5} w={5} />
      </Scene2>
    );
  },
};

/* ════════════════════════ pencere ════════════════════════ */

function Sun({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f6b81f" stroke-width={3} stroke-linecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const a = pol([x, y], i * 36, r + 5), b = pol([x, y], i * 36, r + 11);
          return <line key={i} x1={f1(a[0])} y1={f1(a[1])} x2={f1(b[0])} y2={f1(b[1])} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Küçük gözlü pencere çerçevesi (x,y sol üst) */
function PaneFrame({ x, y, w, h, nx = 3, ny = 3, pane = '#f1e3b8', oiled = [] as number[] }: { x: number; y: number; w: number; h: number; nx?: number; ny?: number; pane?: string; oiled?: number[] }) {
  const b = 9, bar = 6;
  const pw = (w - 2 * b - (nx - 1) * bar) / nx, ph = (h - 2 * b - (ny - 1) * bar) / ny;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={M.wood} stroke={K.out} stroke-width={1.5} />
      {Array.from({ length: nx * ny }, (_, k) => {
        const i = k % nx, j = Math.floor(k / nx);
        const px = x + b + i * (pw + bar), py = y + b + j * (ph + bar);
        const o = oiled.includes(k);
        return (
          <g key={k}>
            <rect x={px} y={py} width={pw} height={ph} fill={o ? '#f2c76a' : pane} stroke={K.out} stroke-width={1.2} />
            {o && <path d={`M${px + 5} ${py + ph - 6}L${px + pw - 6} ${py + 5}`} stroke="#fff6d0" stroke-width={3} stroke-linecap="round" />}
          </g>
        );
      })}
    </g>
  );
}

const S_PENCERE: Record<string, () => JSX.Element> = {
  'sf-yp-pencere-yeri': () => {
    const x0 = 24, x1 = 300, gy = 214;
    const wx = x0 + 70, wy = 86, ww = 63, wh = 84;
    return (
      <Scene2 bg="outdoor" gy={214}>
        <KerpicFace x={x0} y={56} w={x1 - x0} h={gy - 56} />
        <path d={`M${x0 - 14} 58L${x0 + 20} 30H${x1 - 20}L${x1 + 14} 58Z`} fill={M.tile} stroke={K.out} stroke-width={1.5} />
        <PaneFrame x={wx} y={wy} w={ww} h={wh} />
        <Plank a={[wx - 14, wy - 6]} b={[wx + ww + 14, wy - 6]} w={11} />
        <rect x={210} y={118} width={44} height={96} fill="#7a5233" stroke={K.out} stroke-width={1.5} />
        <Dim a={[x0, 202]} b={[wx, 202]} text="1 m" />
        <Label x={wx + ww / 2} y={wy + wh + 14} text="0,90×1,20" size={11} bg="#fff" />
        <Sun x={286} y={22} r={11} />
      </Scene2>
    );
  },
  'sf-yp-pencere-yagli': () => {
    const fx = 46, fy = 26, fw = 228, fh = 196;
    const h = { x: 268, y: 236, a: -36, s: 0.9, pose: 'hold' as const, side: 'R' as const, grip: 12, skin: HAND.pencere };
    const g = handPoint(h, 'grip');
    const dir: P = [Math.sin(h.a * RAD), -Math.cos(h.a * RAD)];
    const tip: P = [g[0] + dir[0] * 74, g[1] + dir[1] * 74];
    const back: P = [g[0] - dir[0] * 24, g[1] - dir[1] * 24];
    return (
      <Scene2 bg="indoor">
        <rect x={fx - 10} y={fy - 10} width={fw + 20} height={fh + 20} fill="#fff4c9" opacity={0.6} />
        <PaneFrame x={fx} y={fy} w={fw} h={fh} oiled={[0, 1, 3, 4]} />
        <Hand {...h} arm={70} sleeve={K.role.bystander4}>
          <OG sh={[{ d: capsule(back, 4, tip, 4), f: M.wood }, { d: capsule(tip, 7, [tip[0] + dir[0] * 16, tip[1] + dir[1] * 16], 6), f: '#c79a3a' }]} />
        </Hand>
      </Scene2>
    );
  },
  'sf-yp-pencere-kepenk': () => {
    const x0 = 86, x1 = 234, y0 = 46, y1 = 184;
    const mid = (x0 + x1) / 2;
    return (
      <Scene2 bg="indoor" wall="#e3d3bb">
        <rect x={x0 - 12} y={y0 - 12} width={x1 - x0 + 24} height={y1 - y0 + 24} fill="#cdb894" stroke={K.out} stroke-width={1.5} />
        {Array.from({ length: 8 }, (_, i) => {
          const w = (x1 - x0) / 8;
          return <Plank key={i} a={[x0 + w * i + w / 2, y1]} b={[x0 + w * i + w / 2, y0]} w={w - 1} f={i % 2 ? M.wood : tint(M.wood, 0.08)} />;
        })}
        <line x1={mid} y1={y0} x2={mid} y2={y1} stroke={K.out} stroke-width={2.5} />
        {[x0 + 14, mid - 18, mid + 18, x1 - 14].map((x) => <rect key={x} x={x - 6} y={104} width={12} height={22} rx={2} fill={M.iron} stroke={K.out} stroke-width={1.2} />)}
        <Plank a={[x0 - 30, 115]} b={[x1 - 4, 115]} w={11} f={M.woodL} />
        <Arrow from={[x0 - 40, 86]} to={[x0 + 30, 86]} w={5} />
      </Scene2>
    );
  },
};

/* ════════════════════════ kar barınağı ════════════════════════ */

function SnowCave({ vent, cold, person = true }: { vent?: boolean; cold?: boolean; person?: boolean }) {
  const gy = 210;
  const outer = `M14 ${gy}C14 110 80 58 170 58C260 58 316 110 316 ${gy}Z`;
  const cav = `M98 ${gy - 6}V${gy - 34}C104 118 140 96 186 96C236 96 270 124 276 ${gy - 40}H134V${gy - 6}Z`;
  const tunnel = `M14 ${gy}V${gy - 24}H104V${gy - 6}Z`;
  const p: PersonProps = { ...CAST.kar, x: 214, y: gy - 40, s: 0.62, pose: { ...POSE.sitFloor, face: 'neutral' } };
  return (
    <g>
      <rect x={0} y={gy} width={320} height={30} fill={M.snow} />
      <path d={outer} fill={M.snow} stroke={K.out} stroke-width={1.6} />
      <path d={cav} fill="#5f7c92" stroke={K.out} stroke-width={1.4} />
      <path d={tunnel} fill="#5f7c92" />
      <path d={`M14 ${gy - 24}H98`} stroke={K.out} stroke-width={1.4} />
      <rect x={134} y={gy - 40} width={142} height={6} fill={M.snowS} />
      {vent && <path d="M178 54V100" stroke="#5f7c92" stroke-width={14} />}
      {person && <Person {...p} />}
      {cold && <Arrow from={[64, 140]} to={[64, gy - 12]} color={K.water} w={5} />}
    </g>
  );
}

const S_KAR: Record<string, () => JSX.Element> = {
  'sf-yp-kar-cubuk': () => {
    const c: P = [160, 210], rx = 128, ry = 132;
    const sticks = Array.from({ length: 11 }, (_, i) => -168 + i * 15.6);
    return (
      <Scene2 bg="outdoor" ground="snow" gy={206}>
        <path d={`M${c[0] - rx} ${c[1]}A${rx} ${ry} 0 0 1 ${c[0] + rx} ${c[1]}Z`} fill={M.snow} stroke={K.out} stroke-width={1.6} />
        <path d={`M${c[0] + 40} ${c[1] - 20}A${rx * 0.7} ${ry * 0.7} 0 0 0 ${c[0] + 100} ${c[1] - 60}`} fill="none" stroke={M.snowS} stroke-width={8} />
        {sticks.map((a, i) => {
          const s = [c[0] + rx * Math.cos(a * RAD), c[1] + ry * Math.sin(a * RAD)] as P;
          const e = pol(s, a, 14);
          return <OG key={i} sh={[{ d: capsule(pol(s, a, -8), 2.6, e, 2.4), f: M.bark }]} />;
        })}
        <Timer x={248} y={40} r={16} text="2 sa" />
      </Scene2>
    );
  },
  'sf-yp-kar-kesit': () => (
    <Scene2 bg="outdoor" ground="snow" gy={210}>
      <SnowCave cold />
      <Dim a={[186, 58]} b={[186, 96]} text="30 cm" lab={[236, 40]} />
    </Scene2>
  ),
  'sf-yp-kar-delik': () => (
    <Scene2 bg="outdoor" ground="snow" gy={210}>
      <SnowCave vent />
      <OG sh={[{ d: capsule([176, 124], 2.2, [180, 36], 2.2), f: M.bark }]} />
      <Arrow from={[150, 92]} to={[150, 26]} w={5} />
      <circle cx={178} cy={70} r={20} fill="none" stroke={K.action} stroke-width={3.5} />
    </Scene2>
  ),
};

/* ════════════════════════ yurt ════════════════════════ */

/** Çapraz kafes deseni (dikdörtgene kırpılmış) */
function Lattice({ x, y, w, h, step = 30, sw = 6, knot = 4, id }: { x: number; y: number; w: number; h: number; step?: number; sw?: number; knot?: number; id: string }) {
  const lines: JSX.Element[] = [];
  const knots: JSX.Element[] = [];
  for (let c = -h; c < w + h; c += step) {
    lines.push(<line key={'a' + c} x1={x + c} y1={y} x2={x + c + h} y2={y + h} stroke={K.out} stroke-width={sw + 3} />);
    lines.push(<line key={'b' + c} x1={x + c} y1={y + h} x2={x + c + h} y2={y} stroke={K.out} stroke-width={sw + 3} />);
  }
  const fills = [] as JSX.Element[];
  for (let c = -h; c < w + h; c += step) {
    fills.push(<line key={'fa' + c} x1={x + c} y1={y} x2={x + c + h} y2={y + h} stroke={M.woodL} stroke-width={sw} />);
    fills.push(<line key={'fb' + c} x1={x + c} y1={y + h} x2={x + c + h} y2={y} stroke={tint(M.woodL, 0.1)} stroke-width={sw} />);
  }
  if (knot)
    for (let i = -20; i < 40; i++)
      for (let j = -20; j < 40; j++) {
        const kx = x + (i * step) / 2, ky = y + (j * step) / 2;
        if ((i + j) % 2 !== 0) continue;
        if (kx < x - 2 || kx > x + w + 2 || ky < y + 2 || ky > y + h - 2) continue;
        knots.push(<circle key={i + '-' + j} cx={kx} cy={ky} r={knot} fill="#6b3f26" stroke={K.out} stroke-width={1} />);
      }
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clip-path={`url(#${id})`}>
        {lines}
        {fills}
        {knots}
      </g>
    </g>
  );
}

const YC: P = [160, 0];
const yurtGeo = (cy = 128, rx = 116, ry = 30, wh = 62) => {
  const top = (a: number): P => [YC[0] + rx * Math.cos(a * RAD), cy + ry * Math.sin(a * RAD)];
  const bot = (a: number): P => [YC[0] + rx * Math.cos(a * RAD), cy + wh + ry * Math.sin(a * RAD)];
  return { cy, rx, ry, wh, top, bot };
};

const S_YURT: Record<string, () => JSX.Element> = {
  'sf-yp-yurt-kafes': () => (
    <Scene2 bg="closeup">
      <Lattice x={30} y={46} w={260} h={150} step={44} sw={8} knot={5} id="yk1" />
      <Arrow from={[150, 222]} to={[40, 222]} w={5} />
      <Arrow from={[170, 222]} to={[280, 222]} w={5} />
      <circle cx={30 + 44 * 3} cy={46 + 66} r={14} fill="none" stroke={K.action} stroke-width={3.5} />
    </Scene2>
  ),
  'sf-yp-yurt-kusak': () => {
    const g = yurtGeo();
    const crown: P = [160, 44];
    const poles = Array.from({ length: 18 }, (_, i) => i * 20);
    const crownPt = (a: number): P => [crown[0] + 22 * Math.cos(a * RAD), crown[1] + 7 * Math.sin(a * RAD)];
    const pole = (a: number) => <OG key={'p' + a} sh={[{ d: capsule(g.top(a), 2.6, crownPt(a), 2), f: M.wood }]} />;
    const backPoles = poles.filter((a) => Math.sin(a * RAD) < 0);
    const frontPoles = poles.filter((a) => Math.sin(a * RAD) >= 0);
    const band = `M${g.top(180)[0]} ${g.top(180)[1]}A${g.rx} ${g.ry} 0 0 0 ${g.top(0)[0]} ${g.top(0)[1]}V${g.bot(0)[1]}A${g.rx} ${g.ry} 0 0 1 ${g.bot(180)[0]} ${g.bot(180)[1]}Z`;
    return (
      <Scene2 bg="outdoor" gy={200}>
        <ellipse cx={160} cy={g.cy + g.wh} rx={g.rx + 10} ry={g.ry + 6} fill={shade(K.grass, 0.12)} />
        {backPoles.map(pole)}
        <path d={`M${g.top(180)[0]} ${g.top(180)[1]}A${g.rx} ${g.ry} 0 0 1 ${g.top(0)[0]} ${g.top(0)[1]}`} fill="none" stroke="#b03a2e" stroke-width={6} />
        <defs>
          <clipPath id="yband">
            <path d={band} />
          </clipPath>
        </defs>
        <path d={band} fill="#d9cbb0" />
        <g clip-path="url(#yband)">
          <Lattice x={40} y={g.cy - g.ry} w={240} h={g.wh + 2 * g.ry} step={22} sw={4} knot={0} id="yk2" />
        </g>
        <path d={band} fill="none" stroke={K.out} stroke-width={1.5} />
        <rect x={146} y={g.cy + g.ry - 4} width={28} height={g.wh + 2} fill="#c0392b" stroke={K.out} stroke-width={1.5} />
        {frontPoles.map(pole)}
        <path d={`M${g.top(180)[0]} ${g.top(180)[1]}A${g.rx} ${g.ry} 0 0 0 ${g.top(0)[0]} ${g.top(0)[1]}`} fill="none" stroke={K.out} stroke-width={9} />
        <path d={`M${g.top(180)[0]} ${g.top(180)[1]}A${g.rx} ${g.ry} 0 0 0 ${g.top(0)[0]} ${g.top(0)[1]}`} fill="none" stroke="#c0453a" stroke-width={6} />
        <OG sh={[{ d: ell(crown, 24, 8), f: M.wood }, { d: ell(crown, 16, 4.5), f: K.sky }]} />
        <Arrow from={[16, g.cy + 2]} to={[36, g.cy + 2]} w={5} />
        <Arrow from={[304, g.cy + 2]} to={[284, g.cy + 2]} w={5} />
      </Scene2>
    );
  },
  'sf-yp-yurt-kece': () => {
    const g = yurtGeo(132, 118, 30, 60);
    const crown: P = [160, 46];
    const wall = `M${g.top(180)[0]} ${g.top(180)[1]}A${g.rx} ${g.ry} 0 0 0 ${g.top(0)[0]} ${g.top(0)[1]}V${g.bot(0)[1]}A${g.rx} ${g.ry} 0 0 1 ${g.bot(180)[0]} ${g.bot(180)[1]}Z`;
    const roof = `M${g.top(180)[0] - 6} ${g.top(180)[1]}L${crown[0] - 26} ${crown[1]}A26 8 0 0 1 ${crown[0] + 26} ${crown[1]}L${g.top(0)[0] + 6} ${g.top(0)[1]}A${g.rx + 6} ${g.ry + 3} 0 0 1 ${g.top(180)[0] - 6} ${g.top(180)[1]}Z`;
    return (
      <Scene2 bg="outdoor" gy={200}>
        <ellipse cx={160} cy={g.cy + g.wh} rx={g.rx + 12} ry={g.ry + 6} fill={shade(K.grass, 0.12)} />
        <path d={wall} fill={M.felt} stroke={K.out} stroke-width={1.6} />
        <path d={roof} fill={tint(M.felt, 0.1)} stroke={K.out} stroke-width={1.6} />
        {[0.35, 0.75].map((t) => {
          const y = g.cy + g.wh * t;
          return <path key={t} d={`M${g.top(180)[0]} ${y}A${g.rx} ${g.ry} 0 0 0 ${g.top(0)[0]} ${y}`} fill="none" stroke="#7a4a2a" stroke-width={3} />;
        })}
        {[-0.75, -0.4, 0, 0.4, 0.75].map((t) => (
          <path key={t} d={poly([[crown[0] + t * 24, crown[1] + 6], [160 + t * g.rx, g.cy + g.ry * Math.sqrt(1 - t * t) + 2]], false)} stroke="#7a4a2a" stroke-width={2.6} />
        ))}
        <OG sh={[{ d: ell(crown, 26, 8), f: M.wood }, { d: ell(crown, 18, 5), f: '#3a3030' }]} />
        <rect x={144} y={g.cy + g.ry + 6} width={32} height={g.wh - 4} fill="#c0392b" stroke={K.out} stroke-width={1.5} />
        <rect x={150} y={g.cy + g.ry + 12} width={20} height={g.wh - 12} fill="#e0a43a" stroke={K.out} stroke-width={1.2} />
      </Scene2>
    );
  },
};

/* ════════════════════════ keçe ════════════════════════ */

function Fluff({ x, y, w, h, seed = 1 }: { x: number; y: number; w: number; h: number; seed?: number }) {
  const r = rnd(seed);
  const pts: P[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const t = Math.PI + (i / (n - 1)) * Math.PI;
    pts.push([x + w / 2 + (w / 2) * Math.cos(t), y + h * Math.sin(t) * (0.8 + r() * 0.3)]);
  }
  return <OG sh={[{ d: smooth([...pts, [x + w, y], [x, y]], true, 0.8), f: M.wool }, { d: smooth([[x + w * 0.2, y - h * 0.3], [x + w * 0.5, y - h * 0.5], [x + w * 0.8, y - h * 0.25]]), st: '#d9d1c1', sw: 2 }]} />;
}

function ReedMat({ x, y, w, h, top }: { x: number; y: number; w: number; h: number; top?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={M.reed} stroke={K.out} stroke-width={1.5} />
      <g stroke={shade(M.reed, 0.25)} stroke-width={1}>
        {top
          ? Array.from({ length: Math.floor(w / 6) }, (_, i) => <line key={i} x1={x + 3 + i * 6} y1={y} x2={x + 3 + i * 6} y2={y + h} />)
          : Array.from({ length: Math.floor(w / 9) }, (_, i) => <line key={i} x1={x + 4 + i * 9} y1={y} x2={x + 2 + i * 9} y2={y + h} />)}
      </g>
    </g>
  );
}

const S_KECE: Record<string, () => JSX.Element> = {
  'sf-yp-kece-dovme': () => {
    const hit: P = [214, 168];
    const raise: P = [176, 70];
    const p: PersonProps = { ...CAST.kece, x: 110, y: 216, pose: { ...POSE.kneel, spine: -80, chest: -72, head: -66, armF: { to: raise, bend: -1 }, armB: { to: [168, 150] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={206}>
        <ReedMat x={150} y={204} w={160} h={10} />
        <Fluff x={160} y={206} w={140} h={36} seed={3} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: capsule(r.handB, 3, hit, 3), f: M.woodL }]} />
        <Person {...p} only={['armF']} />
        <OG sh={[{ d: capsule(r.handF, 3, pol(r.handF, -10, 70), 3), f: M.woodL }]} />
        <Arrow from={[262, 80]} to={[262, 156]} w={5} />
      </Scene2>
    );
  },
  'sf-yp-kece-serme': () => (
    <Scene2 bg="closeup">
      {/* hasır üstünde iki kat yün: alt kat yatay lifli, üst kat dikey lifli; üst katın köşesi kıvrılıp alttaki görünüyor */}
      <ReedMat x={20} y={22} w={280} h={200} top />
      <rect x={44} y={42} width={232} height={160} rx={16} fill={M.wool} stroke={K.out} stroke-width={1.5} />
      <g stroke="#cfc4ae" stroke-width={2.2} stroke-linecap="round">
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={58} y1={56 + i * 13} x2={262} y2={56 + i * 13} />)}
      </g>
      <path d="M58 42H262Q276 42 276 56V120L196 202H58Q44 202 44 188V56Q44 42 58 42Z" fill={tint(M.wool, 0.4)} stroke={K.out} stroke-width={1.5} />
      <g stroke="#d4cbb9" stroke-width={2.2} stroke-linecap="round">
        {Array.from({ length: 16 }, (_, i) => {
          const x = 58 + i * 13.5;
          const yb = Math.min(192, 202 - (x - 196) - 8);
          return <line key={i} x1={x} y1={54} x2={x} y2={x > 196 ? 202 - (x - 196) - 10 : yb} />;
        })}
      </g>
      <path d="M276 120L196 202L232 156Z" fill={shade(M.wool, 0.08)} stroke={K.out} stroke-width={1.5} />
      <Arrow from={[214, 182]} to={[262, 182]} w={4} />
      <Arrow from={[120, 70]} to={[120, 150]} w={5} />
    </Scene2>
  ),
  'sf-yp-kece-yuvarlama': () => {
    const c: P = [214, 184], R = 28;
    const spiral: P[] = Array.from({ length: 60 }, (_, i) => {
      const t = i * 0.32;
      const rr = R - 1 - i * 0.4;
      return [c[0] + rr * Math.cos(t), c[1] + rr * Math.sin(t)];
    });
    const p: PersonProps = { ...CAST.kece, x: 120, y: 216, pose: { ...POSE.kneel, spine: -48, chest: -40, head: -30, armF: { to: [c[0] - 14, c[1] - 22] }, armB: { to: [c[0] - 20, c[1] - 14] }, handF: 'flat', handB: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={206}>
        <circle cx={c[0]} cy={c[1]} r={R} fill={M.reed} stroke={K.out} stroke-width={1.6} />
        <path d={smooth(spiral)} fill="none" stroke={M.wool} stroke-width={4} />
        <path d={smooth(spiral)} fill="none" stroke={shade(M.reed, 0.3)} stroke-width={1} />
        <Person {...p} />
        <Arrow from={[c[0] - 4, c[1] - R - 18]} to={[c[0] + R + 20, c[1] - 8]} bend={-0.35} w={5} />
        <Arrow from={[252, 228]} to={[304, 228]} w={5} />
      </Scene2>
    );
  },
};

/* ════════════════════════ çit ════════════════════════ */

function Fox({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = '#d9692b';
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([-18, -20], 4, [-22, 0], 3.4), f: shade(c, 0.25) },
          { d: capsule([16, -20], 4, [20, 0], 3.4), f: shade(c, 0.25) },
          { d: smooth([[-30, -22], [-44, -30], [-62, -26], [-70, -16], [-56, -16], [-40, -16]], true), f: c },
          { d: smooth([[-66, -24], [-72, -18], [-64, -17]], true), f: K.white, no: true },
          { d: smooth([[-30, -34], [0, -38], [26, -32], [30, -18], [0, -14], [-28, -16]], true), f: c },
          { d: smooth([[22, -36], [32, -44], [46, -40], [56, -34], [44, -28], [28, -26]], true), f: c },
          { d: poly([[30, -44], [32, -56], [40, -44]]), f: c },
          { d: smooth([[40, -32], [56, -34], [46, -28]], true), f: K.white },
          { d: circ([56, -34], 2.4), f: K.ink },
        ]}
      />
      <circle cx={38} cy={-38} r={1.8} fill={K.ink} />
    </g>
  );
}

const S_CIT: Record<string, () => JSX.Element> = {
  'sf-yp-cit-zikzak': () => {
    // Üstten görünüş: sırıklar zikzak çizer, uçları köşelerde üst üste çaprazlanır (direk, çivi yok).
    const nodes: P[] = Array.from({ length: 6 }, (_, k) => [10 + k * 60, k % 2 ? 96 : 186]);
    const segs = nodes.slice(0, -1).map((a, i) => ({ a, b: nodes[i + 1], i }));
    const ext = (a: P, b: P, e: number): [P, P] => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const u: P = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
      return [[a[0] - u[0] * e, a[1] - u[1] * e], [b[0] + u[0] * e, b[1] + u[1] * e]];
    };
    const out: JSX.Element[] = [];
    for (let l = 0; l < 3; l++)
      for (const sg of segs) {
        if ((sg.i + l) % 2) continue;
        const [a, b] = ext(sg.a, sg.b, 16);
        out.push(<Pole key={`${l}-${sg.i}`} a={[a[0] + l * 3, a[1] - l * 10]} b={[b[0] + l * 3, b[1] - l * 10]} r={6} />);
      }
    for (let l = 0; l < 3; l++)
      for (const sg of segs) {
        if (!((sg.i + l) % 2)) continue;
        const [a, b] = ext(sg.a, sg.b, 16);
        out.push(<Pole key={`o${l}-${sg.i}`} a={[a[0] + l * 3, a[1] - l * 10]} b={[b[0] + l * 3, b[1] - l * 10]} r={6} />);
      }
    return (
      <Scene2 bg="floor">
        <rect x={0} y={0} width={320} height={240} fill={K.grass} />
        <path d={poly(nodes.map((n) => [n[0] + 8, n[1] + 12] as P), false)} fill="none" stroke={shade(K.grass, 0.25)} stroke-width={16} stroke-linejoin="round" opacity={0.5} />
        {out}
      </Scene2>
    );
  },
  'sf-yp-cit-orgu': () => {
    const stakes = Array.from({ length: 8 }, (_, i) => 22 + i * 40);
    const rows = Array.from({ length: 9 }, (_, i) => 92 + i * 13);
    const row = (y: number, r: number) => smooth(stakes.map((x, i) => [x, y + ((i + r) % 2 ? 3 : -3)] as P).concat([[340, y]]));
    return (
      <Scene2 bg="outdoor" gy={206}>
        {rows.map((y, r) => <path key={'b' + r} d={row(y, r)} fill="none" stroke={K.out} stroke-width={8} />)}
        {rows.map((y, r) => <path key={'c' + r} d={row(y, r)} fill="none" stroke="#9a7a4c" stroke-width={5.5} />)}
        {stakes.map((x) => <OG key={x} sh={[{ d: poly([[x - 6, 226], [x - 6, 70], [x, 58], [x + 6, 70], [x + 6, 226]]), f: M.bark }]} />)}
        {rows.map((y, r) => (
          <g key={'f' + r}>
            {stakes.map((x, i) => ((i + r) % 2 ? null : (
              <g key={i}>
                <line x1={x - 10} y1={y - 3} x2={x + 10} y2={y - 3} stroke={K.out} stroke-width={8} stroke-linecap="round" />
                <line x1={x - 11} y1={y - 3} x2={x + 11} y2={y - 3} stroke="#9a7a4c" stroke-width={5.5} />
              </g>
            )))}
          </g>
        ))}
      </Scene2>
    );
  },
  'sf-yp-cit-yirtici': () => {
    const x0 = 150, x1 = 312, gy = 214, wallTop = 150, top = 66;
    return (
      <Scene2 bg="outdoor" gy={214}>
        <rect x={x0} y={top} width={x1 - x0} height={wallTop - top} fill="#f2ead8" opacity={0.5} />
        <Hen x={250} y={wallTop + 2} s={0.9} />
        <g stroke={M.iron} stroke-width={1.6}>
          {Array.from({ length: 17 }, (_, i) => <line key={'v' + i} x1={x0 + i * 10} y1={top} x2={x0 + i * 10} y2={wallTop} />)}
          {Array.from({ length: 9 }, (_, i) => <line key={'h' + i} x1={x0} y1={top + i * 10.5} x2={x1} y2={top + i * 10.5} />)}
        </g>
        <Plank a={[x0, top]} b={[x0, gy]} w={8} />
        <path d={`M${x0 - 10} ${top}L${x1 + 10} ${top - 30}`} stroke={K.out} stroke-width={12} />
        <path d={`M${x0 - 10} ${top}L${x1 + 10} ${top - 30}`} stroke={M.tile} stroke-width={9} />
        <StoneFace x={x0} y={wallTop} w={x1 - x0} h={gy - wallTop + 10} row={16} seed={71} />
        <Fox x={66} y={222} s={0.95} />
        <No x={86} y={186} r={36} />
        <Dim a={[x0 - 14, gy]} b={[x0 - 14, wallTop]} text="60 cm" lab={[x0 - 14, 136]} />
      </Scene2>
    );
  },
};

/* ════════════════════════ ahır ve kümes ════════════════════════ */

function TopSheep({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: ell([0, 0], 15, 10), f: M.wool }, { d: ell([17, 0], 6, 4.5), f: '#3b3537' }]} />
    </G>
  );
}

const S_AHIR: Record<string, () => JSX.Element> = {
  'sf-yp-ahir-yon': () => {
    const x0 = 70, x1 = 250, y0 = 52, y1 = 120, t = 12;
    return (
      <Scene2 bg="floor">
        <rect x={0} y={0} width={320} height={240} fill="#c9b48a" />
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#a88a5c" />
        {/* kuzey, batı, doğu duvarları */}
        <rect x={x0 - t} y={y0 - t} width={x1 - x0 + 2 * t} height={t} fill={M.stone} stroke={K.out} stroke-width={1.5} />
        <rect x={x0 - t} y={y0} width={t} height={y1 - y0} fill={M.stone} stroke={K.out} stroke-width={1.5} />
        <rect x={x1} y={y0} width={t} height={y1 - y0} fill={M.stone} stroke={K.out} stroke-width={1.5} />
        <path d={`M${x0} ${y1}H${x1}`} stroke={K.out} stroke-width={2} stroke-dasharray="6 5" />
        {/* avlu çiti */}
        <path d={`M${x0 - t} ${y1}V206H${x1 + t}V${y1}`} fill="none" stroke={M.bark} stroke-width={4} />
        {[[110, 80, 0], [170, 90, 20], [210, 74, -10], [130, 150, 40], [200, 170, -30]].map(([x, y, a], i) => <TopSheep key={i} x={x} y={y} a={a} />)}
        <Sun x={160} y={226} r={10} />
        <Arrow from={[160, 210]} to={[160, 186]} w={5} />
        <Arrow from={[40, 6]} to={[40, 34]} color={K.water} w={5} />
        <Arrow from={[280, 6]} to={[280, 34]} color={K.water} w={5} />
        <Label x={160} y={22} text="K" size={14} bg="#fff" />
      </Scene2>
    );
  },
  'sf-yp-kumes-tunek': () => {
    // Tünekler uçtan görünüyor (yuvarlak kesit); aralar sırık merkezinden ölçülü.
    const gy = 214, py = 112;
    const perches = [96, 150, 204];
    return (
      <Scene2 bg="indoor" wall="#e6dccb">
        <Plank a={[66, py + 14]} b={[234, py + 14]} w={8} />
        <Plank a={[72, py + 14]} b={[72, gy]} w={9} />
        <Plank a={[228, py + 14]} b={[228, gy]} w={9} />
        {perches.map((x, i) => <Hen key={'h' + x} x={x - 2} y={py - 2} s={0.6} sit flip={i === 1} c={i === 1 ? '#efe6d6' : '#b8653a'} />)}
        {perches.map((x) => <OG key={x} sh={[{ d: circ([x, py + 2], 7), f: M.woodL }, { d: circ([x, py + 2], 3), f: 'none', ln: true }]} />)}
        <path d={`M${perches[1]} ${py + 12}V${py + 52}M${perches[2]} ${py + 12}V${py + 52}`} stroke={K.ink} stroke-width={1.2} stroke-dasharray="3 3" />
        <Dim a={[perches[1], py + 46]} b={[perches[2], py + 46]} text="35–40 cm" lab={[(perches[1] + perches[2]) / 2, py + 66]} />
        <Dim a={[34, gy]} b={[34, py + 2]} text="60–100 cm" lab={[46, 176]} />
      </Scene2>
    );
  },
  'sf-yp-kumes-folluk': () => {
    const gy = 214, by = 140, bw = 52, bh = 50;
    const xs = [70, 126, 182];
    return (
      <Scene2 bg="indoor" wall="#e6dccb">
        <Plank a={[60, by + 4]} b={[244, by + 4]} w={8} />
        <Plank a={[70, by + 8]} b={[70, gy]} w={8} />
        <Plank a={[234, by + 8]} b={[234, gy]} w={8} />
        {xs.map((x) => (
          <g key={x}>
            <rect x={x} y={by - bh} width={bw} height={bh} fill={M.wood} stroke={K.out} stroke-width={1.5} />
            <rect x={x + 6} y={by - bh + 6} width={bw - 12} height={bh - 6} fill="#3f3128" />
            <path d={smooth([[x + 6, by - 14], [x + 16, by - 20], [x + 28, by - 15], [x + 40, by - 21], [x + bw - 6, by - 14], [x + bw - 6, by], [x + 6, by]], true)} fill={M.straw} stroke={K.out} stroke-width={1} />
          </g>
        ))}
        <ellipse cx={92} cy={by - 16} rx={6} ry={8} fill="#f7efe0" stroke={K.out} stroke-width={1.2} />
        <Hen x={152} y={by - 6} s={0.62} sit />
        <Plank a={[60, by + 18]} b={[244, by + 18]} w={6} f={M.woodL} />
        <Dim a={[36, gy]} b={[36, by]} text="45–60 cm" lab={[56, 186]} />
      </Scene2>
    );
  },
};

export const SCENES: Record<string, () => JSX.Element> = {
  ...S_DOLDURMA,
  ...S_KURU,
  ...S_KIREC,
  ...S_TASD,
  ...S_ISKELET,
  ...S_MERDIVEN,
  ...S_CATI,
  ...S_DAM,
  ...S_SAZ,
  ...S_SINDIL,
  ...S_KIREMIT,
  ...S_KAPI,
  ...S_PENCERE,
  ...S_KAR,
  ...S_YURT,
  ...S_KECE,
  ...S_CIT,
  ...S_AHIR,
};
