// Sıfırdan paketi sahneleri (a). Bkz. docs/agents/SIFIRDAN_CIZIM.md
// Kapsam: zaman/ölçü/bilgi rehberleri + haberleşme rehberleri (telsiz, mors, ışık, duman, ulak, eşek) + kategori kapakları.
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, Bubble, Campfire, Flame, Hand, HouseExt, K, Label, No, OG, OW, Ok, Person, POSE, Rock, Scene2, Smoke,
  Table, Chair, Tree, Water, Waves, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═══════════════ yardımcılar ═══════════════ */

const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const R2D = 180 / Math.PI;
const rad = (d: number) => d / R2D;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(rad(a)) * l, p[1] + Math.sin(rad(a)) * l];
const f1 = (n: number) => Math.round(n * 10) / 10;

/** Dönüş/ölçek grubu (yerel koordinat) */
const G = ({ x, y, s = 1, a = 0, children }: { x: number; y: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);

/** Düz yazı */
const T = ({ x, y, t, size = 14, fill = K.ink, anchor = 'middle', weight = 700, op }: { x: number; y: number; t: string; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; op?: number }) => (
  <text x={x} y={y} font-size={size} font-weight={weight} fill={fill} text-anchor={anchor} font-family={FONT} opacity={op}>{t}</text>
);

/** İnce çift uçlu ölçü oku (turuncu) */
function Dim({ a, b, color = K.action, w = 3 }: { a: P; b: P; color?: string; w?: number }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * R2D;
  const hl = w * 2.6 + 3;
  const head = (p: P, dir: number) => {
    const base = pol(p, dir, -hl);
    const l = pol(base, dir + 90, hl * 0.55), r = pol(base, dir - 90, hl * 0.55);
    return `M${f1(p[0])} ${f1(p[1])}L${f1(l[0])} ${f1(l[1])}L${f1(r[0])} ${f1(r[1])}Z`;
  };
  const a2 = pol(a, ang, hl * 0.8), b2 = pol(b, ang, -hl * 0.8);
  const line = `M${f1(a2[0])} ${f1(a2[1])}L${f1(b2[0])} ${f1(b2[1])}`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={line} stroke={K.out} stroke-width={w + 2.6} fill="none" />
      <path d={head(b, ang) + head(a, ang + 180)} fill={K.out} stroke={K.out} stroke-width={2.6} />
      <path d={line} stroke={color} stroke-width={w} fill="none" />
      <path d={head(b, ang) + head(a, ang + 180)} fill={color} />
    </g>
  );
}

/** Kesik çizgi */
const Dash = ({ a, b, color = K.action, w = 3, dash = '7 6' }: { a: P; b: P; color?: string; w?: number; dash?: string }) => (
  <g stroke-linecap="round">
    <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke={K.out} stroke-width={w + 2.4} stroke-dasharray={dash} fill="none" opacity={0.0} />
    <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke={color} stroke-width={w} stroke-dasharray={dash} fill="none" />
  </g>
);

/** Basit dış hatlı tek şekil */
const S = ({ d, f, ow }: { d: string; f: string; ow?: number }) => <OG sh={[{ d, f }]} ow={ow} />;

/** Kalın çizgi (dış hatlı) — ip, çubuk, tel */
const Rod = ({ a, b, w = 4, c = K.wood }: { a: P; b: P; w?: number; c?: string }) => (
  <OG sh={[{ d: capsule(a, w / 2, b, w / 2), f: c }]} />
);

/** İp (ince, dış hatlı, istenirse eğri) */
const Rope = ({ pts, w = 2.4, c = '#d9b873' }: { pts: P[]; w?: number; c?: string }) => {
  const d = pts.length > 2 ? smooth(pts) : `M${f1(pts[0][0])} ${f1(pts[0][1])}L${f1(pts[1][0])} ${f1(pts[1][1])}`;
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={w + 2.4} />
      <path d={d} stroke={c} stroke-width={w} />
    </g>
  );
};

/* ═══════════════ malzeme renkleri (paket geneli) ═══════════════ */
const M = {
  wood: K.wood,
  woodL: '#d4a373',
  rope: '#d9b873',
  stone: K.rock,
  paper: '#fbf6e9',
  paperLine: '#c9bfa8',
  dirt: '#c9a77a',
  dirtD: '#b48f62',
  iron: '#6f7782',
  radio: '#2f3b48',
  sky: K.sky,
  night: '#1d2846',
  donkey: '#8f8478',
  donkeyD: '#6f665d',
  donkeyL: '#d8d0c6',
  sack: '#d8c08e',
  felt: '#7a5a8c',
};

/* ═══════════════ oyuncular (CAST) ═══════════════ */
// Her rehberin bütün çizimlerinde aynı kişi(ler). Rehberler arasında çeşitlilik.
const CAST = {
  /** Güneş saati, takvim, ölçü, terazi, 3-4-5, şakul, yükseklik — "usta": orta yaşlı adam */
  usta: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.dark, role: 'helper', bottomC: K.pants.khaki, sleeve: 'long' } as const,
  /** Mevsim, hava — çiftçi kadın */
  ciftci: { who: 'woman', skin: 2, hair: 'scarf', hairC: '#6c9c5a', role: 'bystander2', bottomC: K.pants.brown, sleeve: 'long' } as const,
  /** Kayıt, bilgi — kâtip kadın + yardımcı genç adam */
  katip: { who: 'woman', skin: 0, hair: 'bun', hairC: K.hair.auburn, role: 'bystander', bottomC: K.pants.dark, sleeve: 'long' } as const,
  katip2: { who: 'man', skin: 3, hair: 'short', hairC: K.hair.black, role: 'bystander3', bottomC: K.pants.grey } as const,
  /** Okuma-yazma, aritmetik — öğretmen + kız çocuk */
  ogretmen: { who: 'woman', skin: 1, hair: 'long', hairC: K.hair.black, role: 'helper', bottomC: K.pants.navy, sleeve: 'long' } as const,
  ogrenci: { who: 'girl', skin: 1, hair: 'ponytail', hairC: K.hair.brown, role: 'bystander2' } as const,
  /** Telsiz (PMR ve amatör) — telsizci */
  telsizci: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'bystander4', bottomC: K.pants.denim, sleeve: 'long' } as const,
  telsizci2: { who: 'woman', skin: 1, hair: 'ponytail', hairC: K.hair.blond, role: 'bystander3', bottomC: K.pants.dark } as const,
  /** Mors, ışık-ayna — işaretçi */
  isaretci: { who: 'woman', skin: 2, hair: 'ponytail', hairC: K.hair.black, role: 'bystander', bottomC: K.pants.khaki, sleeve: 'long' } as const,
  /** Duman-ses — köylü adam */
  koylu: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.grey, role: 'bystander4', bottomC: K.pants.brown, sleeve: 'long', mustache: true } as const,
  /** Ulak — iki ulak + mesaj veren */
  ulak: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.brown, role: 'bystander3', bottomC: K.pants.khaki, sleeve: 'long' } as const,
  ulak2: { who: 'woman', skin: 2, hair: 'bun', hairC: K.hair.black, role: 'bystander3', bottomC: K.pants.dark, sleeve: 'long' } as const,
  merkez: { who: 'oldwoman', skin: 1, role: 'bystander' } as const,
  /** Eşek bakımı — seyis */
  seyis: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.dark, role: 'bystander2', bottomC: K.pants.dark, sleeve: 'long', mustache: true } as const,
};
const HANDSKIN = { usta: 1, ciftci: 2, katip: 0, ogretmen: 1, ogrenci: 1, telsizci: 2, isaretci: 2, seyis: 2 };

/* ═══════════════ ortak nesneler ═══════════════ */

/** Güneş (gökte) */
const Sun = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => (
  <g>
    <g stroke="#ffcf3a" stroke-width={3} stroke-linecap="round">
      {Array.from({ length: 8 }, (_, i) => {
        const a = pol([x, y], i * 45, r + 5), b = pol([x, y], i * 45, r + 12);
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
      })}
    </g>
    <S d={circ([x, y], r)} f="#ffd84a" />
  </g>
);

/** Gri ya da beyaz bulut. x,y = taban ortası */
const Cloud = ({ x, y, s = 1, c = '#ffffff', ow }: { x: number; y: number; s?: number; c?: string; ow?: number }) => (
  <G x={x} y={y} s={s}>
    <OG ow={ow ?? OW / s} sh={[{ d: 'M-34 0A14 14 0 0 1 -26 -20A17 17 0 0 1 2 -30A15 15 0 0 1 26 -18A12 12 0 0 1 34 0Z', f: c }]} />
  </G>
);

/** Kâğıt sayfa (TL) */
const Paper = ({ x, y, w, h, a = 0, c = M.paper }: { x: number; y: number; w: number; h: number; a?: number; c?: string }) => (
  <g transform={`rotate(${a} ${x + w / 2} ${y + h / 2})`}>
    <OG sh={[{ d: rrect(x, y, w, h, 2), f: c }]} />
  </g>
);

/** Kalem: uç (x,y), a yönü (uca doğru) */
const Pencil = ({ x, y, a = 135, l = 60, c = '#f2b631' }: { x: number; y: number; a?: number; l?: number; c?: string }) => (
  <G x={x} y={y} a={a + 180}>
    <OG sh={[{ d: `M0 0L10 -3.6H${l}V3.6H10Z`, f: c }, { d: 'M0 0L10 -3.6V3.6Z', f: '#f1d9b0' }, { d: 'M0 0L3.4 -1.2V1.2Z', f: K.ink, no: true }, { d: rrect(l - 7, -3.6, 7, 7.2, 1.5), f: '#e88a9a' }]} />
  </G>
);

/** Bıçak: uç (x,y), a yönü (uca doğru) */
const Knife = ({ x, y, a = 0, l = 40 }: { x: number; y: number; a?: number; l?: number }) => (
  <G x={x} y={y} a={a + 180}>
    <OG sh={[{ d: `M0 0Q${l * 0.5} -7 ${l} -5V3H8Z`, f: '#d6dde5' }, { d: rrect(l, -5, l * 0.75, 9, 3), f: '#7b4e2e' }]} />
  </G>
);

/** Kova. x,y = taban ortası */
const Bucket = ({ x, y, s = 1, c = '#8e99a6', water }: { x: number; y: number; s?: number; c?: string; water?: boolean }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[{ d: 'M-16 -30L-12 0H12L16 -30Z', f: c }, ...(water ? [{ d: ell([0, -30], 16, 4), f: K.water, ln: true } as Sh] : [{ d: ell([0, -30], 16, 4), f: shade(c, 0.3), ln: true } as Sh])]} />
    <path d="M-16 -30Q0 -52 16 -30" fill="none" stroke={K.out} stroke-width={2} />
  </G>
);

/** Ağırlık taşı (yontulmuş). x,y = taban ortası */
const Stone = ({ x, y, w = 26, h = 18, c = M.stone, text }: { x: number; y: number; w?: number; h?: number; c?: string; text?: string }) => (
  <g>
    <OG sh={[{ d: `M${x - w / 2} ${y}Q${x - w / 2 - 2} ${y - h * 0.8} ${x - w * 0.2} ${y - h}H${x + w * 0.25}Q${x + w / 2 + 2} ${y - h * 0.7} ${x + w / 2} ${y}Z`, f: c }]} />
    {text && <T x={x} y={y - h * 0.32} t={text} size={Math.min(11, h * 0.55)} fill="#fff" />}
  </g>
);

/** Kazık (yandan): x = orta, y = zemin */
const Stake = ({ x, y, h = 30, c = M.woodL }: { x: number; y: number; h?: number; c?: string }) => (
  <OG sh={[{ d: `M${x - 3.5} ${y - h}H${x + 3.5}V${y - 4}L${x} ${y + 4}L${x - 3.5} ${y - 4}Z`, f: c }]} />
);

/** Kazık (yukarıdan): daire */
const StakeTop = ({ x, y, r = 5 }: { x: number; y: number; r?: number }) => (
  <OG sh={[{ d: circ([x, y], r), f: M.woodL }, { d: circ([x, y], r * 0.45), f: shade(M.woodL, 0.25), no: true }]} />
);

/** Düğümlü ip (düz, iki uç arası n düğüm, uçlar dahil) */
function KnotRope({ a, b, n, w = 2.6, r = 3.6, c = M.rope }: { a: P; b: P; n: number; w?: number; r?: number; c?: string }) {
  const pts = Array.from({ length: n }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / (n - 1), a[1] + ((b[1] - a[1]) * i) / (n - 1)] as P);
  return (
    <g>
      <Rope pts={[a, b]} w={w} c={c} />
      {pts.map((p, i) => <OG key={i} sh={[{ d: circ(p, r), f: shade(c, 0.12) }]} ow={1.2} />)}
    </g>
  );
}

/** El telsizi (PMR). x,y = gövde alt ortası; a açısı; s ölçek */
const Walkie = ({ x, y, s = 1, a = 0, waves }: { x: number; y: number; s?: number; a?: number; waves?: boolean }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[
      { d: rrect(4, -86, 7, 34, 3.5), f: '#262c35' },
      { d: rrect(-13, -56, 26, 56, 6), f: '#e58a2b' },
      { d: rrect(-9, -50, 18, 14, 2), f: '#cfe6c6', ln: true },
      { d: rrect(-9, -30, 18, 24, 3), f: '#3a3f4a', ln: true },
      { d: rrect(-16, -46, 4, 12, 1.5), f: '#262c35' },
    ]} />
    <g fill="#8a919c">{[-24, -19, -14].map((yy) => <rect key={yy} x={-6} y={yy} width={12} height={2} rx={1} />)}</g>
    {waves && <Waves x={9} y={-88} a={-60} n={3} r={6} />}
  </G>
);

/** Eşek (yandan, sağa bakar). x = gövde ortası, y = zemin. head: 'up' | 'down' (su içiyor) */
function Donkey({ x, y, s = 1, head = 'up', flip }: { x: number; y: number; s?: number; head?: 'up' | 'down'; flip?: boolean }) {
  const c = M.donkey, d = M.donkeyD, l = M.donkeyL;
  const legs: Sh[] = [
    // uzak bacaklar (koyu)
    { d: capsule([-36, -62], 7, [-40, -6], 4.2), f: d },
    { d: capsule([30, -62], 7, [34, -6], 4.2), f: d },
    // yakın bacaklar
    { d: capsule([-28, -62], 8, [-30, -6], 4.6), f: c },
    { d: capsule([38, -62], 8, [40, -6], 4.6), f: c },
  ];
  const hooves: Sh[] = [[-40, 0], [34, 0], [-30, 0], [40, 0]].map(([hx]) => ({ d: rrect(hx - 5.5, -8, 11, 8, 2), f: '#3b3537' }));
  const neckHead: Sh[] = head === 'up'
    ? [
        { d: 'M34 -86Q46 -112 58 -124L74 -112Q62 -98 54 -72Z', f: c },
        { d: 'M56 -126Q66 -134 74 -126L92 -98Q96 -88 86 -86Q78 -84 72 -94L58 -112Z', f: c },
        { d: 'M86 -98Q95 -96 93 -88Q90 -84 84 -86Z', f: l, no: true },
        { d: 'M60 -126Q52 -156 56 -160Q62 -156 66 -128Z', f: c },
        { d: 'M66 -126Q66 -156 72 -158Q76 -150 70 -124Z', f: c },
        { d: 'M60 -128Q56 -150 57 -154', st: shade(c, 0.35), sw: 1.4 },
      ]
    : [
        { d: 'M34 -86Q52 -86 66 -60L54 -50Q44 -66 30 -64Z', f: c },
        { d: 'M54 -60Q62 -70 72 -62L88 -30Q90 -20 80 -20Q72 -20 70 -30L54 -48Z', f: c },
        { d: 'M82 -32Q90 -28 86 -21Q80 -18 76 -22Z', f: l, no: true },
        { d: 'M60 -64Q46 -88 48 -92Q56 -90 66 -66Z', f: c },
        { d: 'M66 -66Q60 -92 66 -94Q72 -88 70 -64Z', f: c },
      ];
  const eye: P = head === 'up' ? [74, -112] : [70, -50];
  return (
    <G x={x} y={y} s={flip ? -s : s}>
      <g transform={flip ? 'scale(1 1)' : undefined}>
        <OG ow={OW / s} sh={[
          ...legs.slice(0, 2),
          { d: 'M-46 -86Q-62 -80 -60 -50', st: K.out, sw: 3 },
          { d: ell([-60, -48], 3, 7), f: d },
          ...neckHead,
          { d: smooth([[-48, -70], [-50, -92], [-20, -100], [20, -98], [46, -90], [50, -66], [30, -56], [-10, -56], [-40, -58]], true), f: c },
          { d: smooth([[-40, -60], [-10, -60], [30, -60], [44, -66], [30, -57], [-10, -56]], true), f: l, no: true },
          ...legs.slice(2),
          ...hooves,
        ]} />
        <circle cx={eye[0]} cy={eye[1]} r={2.2} fill={K.ink} />
      </g>
    </G>
  );
}

/** Ay evresi (lit kısmı): ph 0 yeniay, .25 ilk dördün, .5 dolunay, .75 son dördün. Kuzey yarıküre. */
function MoonPhase({ x, y, r, ph }: { x: number; y: number; r: number; ph: number }) {
  const dark = '#3b4258', lit = '#f6efc9';
  const c = Math.cos(2 * Math.PI * ph);
  const rx = Math.abs(c) * r;
  const waxing = ph < 0.5;
  let litPath = '';
  if (Math.abs(ph - 0.5) < 1e-6) litPath = circ([x, y], r);
  else if (ph > 1e-6) {
    const outerSweep = waxing ? 1 : 0;
    const termSweep = waxing ? (c > 0 ? 0 : 1) : c > 0 ? 1 : 0;
    litPath = `M${x} ${y - r}A${r} ${r} 0 0 ${outerSweep} ${x} ${y + r}A${f1(rx)} ${r} 0 0 ${termSweep} ${x} ${y - r}Z`;
  }
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: dark }]} />
      {litPath && <path d={litPath} fill={lit} />}
      <circle cx={x} cy={y} r={r} fill="none" stroke={K.out} stroke-width={1.6} />
    </g>
  );
}

/* ═══════════════ güneş hesabı (enlem 40°) ═══════════════ */
/** Dik çubuğun gölge ucu (doğu, kuzey) — çubuk boyu 1. H saat açısı (derece, öğleden önce negatif), dec sapma */
function shadowTip(H: number, dec: number, lat = 40): [number, number] {
  const E = -Math.cos(rad(dec)) * Math.sin(rad(H));
  const N = Math.cos(rad(lat)) * Math.sin(rad(dec)) - Math.sin(rad(lat)) * Math.cos(rad(dec)) * Math.cos(rad(H));
  const U = Math.sin(rad(lat)) * Math.sin(rad(dec)) + Math.cos(rad(lat)) * Math.cos(rad(dec)) * Math.cos(rad(H));
  return [-E / U, -N / U];
}

/** Bıçak tutan el: bıçak ucu tip'te, dirA yönünde (saptan uca). */
function KnifeHand({ tip, dirA, kl = 40, skin = 1, sleeve = K.role.helper, s = 1.05, arm = 70 }: { tip: P; dirA: number; kl?: number; skin?: number; sleeve?: string; s?: number; arm?: number }) {
  const grip = pol(tip, dirA, -kl * 1.375);
  const h0 = { x: 0, y: 0, a: dirA + 90, s, pose: 'hold' as const, side: 'R' as const, grip: 22 };
  const off = handPoint(h0, 'grip');
  const hnd = { ...h0, x: grip[0] - off[0], y: grip[1] - off[1] };
  return (
    <Hand {...hnd} arm={arm} sleeve={sleeve} skin={skin}>
      <Knife x={tip[0]} y={tip[1]} a={dirA} l={kl} />
    </Hand>
  );
}

/** Asma terazi kefesi (tabak + 3 ip). (x,y) = askı noktası, kefe y+drop'ta */
function Pan({ x, y, drop = 60, w = 56, children }: { x: number; y: number; drop?: number; w?: number; children?: ComponentChildren }) {
  const py = y + drop;
  return (
    <g>
      <path d={`M${x} ${y}L${x - w / 2 + 3} ${py}M${x} ${y}L${x + w / 2 - 3} ${py}M${x} ${y}L${x} ${py}`} stroke={K.out} stroke-width={1.6} />
      {children}
      <OG sh={[{ d: `M${x - w / 2} ${py}Q${x} ${py + 18} ${x + w / 2} ${py}Z`, f: '#b8956a' }]} />
      <OG sh={[{ d: circ([x, y], 3), f: M.iron }]} ow={1} />
    </g>
  );
}

/** Dal (yukarıdan uzanan yatay ağaç dalı) */
const Branch = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <OG sh={[{ d: `M${x1} ${y - 6}Q${(x1 + x2) / 2} ${y - 10} ${x2} ${y - 3}L${x2} ${y + 3}Q${(x1 + x2) / 2} ${y + 4} ${x1} ${y + 8}Z`, f: K.trunk }, { d: ell([x2 - 30, y - 12], 22, 10), f: K.leaf }, { d: ell([x1 + 26, y - 14], 26, 11), f: K.leaf }]} />
);

/** Defter (yukarıdan, kapalı). TL köşe; icon içerik */
const Notebook = ({ x, y, w = 74, h = 96, c, a = 0, children }: { x: number; y: number; w?: number; h?: number; c: string; a?: number; children?: ComponentChildren }) => (
  <g transform={`rotate(${a} ${x + w / 2} ${y + h / 2})`}>
    <OG sh={[{ d: rrect(x + 3, y + 3, w, h, 4), f: '#e9e2cf' }, { d: rrect(x, y, w, h, 4), f: c }, { d: rrect(x, y, 9, h, 3), f: shade(c, 0.25), no: true }]} />
    <OG sh={[{ d: rrect(x + 18, y + 16, w - 28, h - 32, 4), f: '#fbf6e9' }]} ow={1.2} />
    {children}
  </g>
);
/** Simge: takvim */
const IcoCal = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G x={x} y={y} s={s}>
    <OG ow={1.2 / s} sh={[{ d: rrect(-14, -12, 28, 26, 3), f: '#fff' }, { d: rrect(-14, -12, 28, 8, 2), f: K.danger }]} />
    <g fill={K.ink}>{[[-8, 2], [0, 2], [8, 2], [-8, 9], [0, 9]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={1.8} />)}</g>
  </G>
);
/** Simge: çuval */
const IcoSack = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G x={x} y={y} s={s}>
    <OG ow={1.2 / s} sh={[{ d: 'M-6 -14Q-16 -2 -14 10Q-12 16 0 16Q12 16 14 10Q16 -2 6 -14Z', f: M.sack }, { d: 'M-8 -16L8 -16L5 -12H-5Z', f: shade(M.sack, 0.25) }]} />
  </G>
);
/** Simge: insanlar */
const IcoPeople = ({ x, y, s = 1, c = K.ink }: { x: number; y: number; s?: number; c?: string }) => (
  <G x={x} y={y} s={s}>
    <g fill={c}>
      {[-9, 9].map((dx) => <g key={dx}><circle cx={dx} cy={-7} r={4.5} /><path d={`M${dx - 7} 14V4Q${dx - 7} -1 ${dx} -1Q${dx + 7} -1 ${dx + 7} 4V14Z`} /></g>)}
      <circle cx={0} cy={-4} r={5} fill="#fff" /><circle cx={0} cy={-4} r={4.2} /><path d="M-8 16V7Q-8 1 0 1Q8 1 8 7V16Z" stroke="#fff" stroke-width={1.2} />
    </g>
  </G>
);

/** Yazı satırı (çizgi) */
const Scribble = ({ x, y, w, c = K.ink, op = 0.6 }: { x: number; y: number; w: number; c?: string; op?: number }) => (
  <path d={`M${x} ${y}H${x + w}`} stroke={c} stroke-width={3} stroke-linecap="round" opacity={op} />
);

/** Raf (yandan önden): x,y TL, w genişlik, n kat */
const Shelf = ({ x, y, w, h, n = 3 }: { x: number; y: number; w: number; h: number; n?: number }) => (
  <g>
    <OG sh={[{ d: rrect(x, y, 8, h, 1), f: K.wood }, { d: rrect(x + w - 8, y, 8, h, 1), f: K.wood }, ...Array.from({ length: n }, (_, i) => ({ d: rrect(x - 2, y + ((i + 1) * h) / n - 8, w + 4, 7, 1), f: M.woodL } as Sh))]} />
  </g>
);

/** Küçük çuval (önden). x,y taban ortası */
const Sack = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[{ d: 'M-10 -40Q-22 -24 -20 -6Q-18 0 0 0Q18 0 20 -6Q22 -24 10 -40Z', f: M.sack }, { d: 'M-12 -42H12L8 -36H-8Z', f: shade(M.sack, 0.25) }]} />
  </G>
);

/** Ekmek (yukarıdan) */
const Bread = ({ x, y, a = 0 }: { x: number; y: number; a?: number }) => (
  <g transform={`rotate(${a} ${x} ${y})`}>
    <OG sh={[{ d: ell([x, y], 11, 7), f: '#d9984a' }]} ow={1.2} />
    <path d={`M${x - 5} ${y - 3}l3 6M${x} ${y - 4}l3 6M${x + 5} ${y - 3}l2 5`} stroke="#a8692a" stroke-width={1.4} />
  </g>
);

/** Alet tutan el (genel): aletin ucu tip'te, dirA yönünde; sapın ortası uçtan back kadar geride. */
function ToolHand({ tip, dirA, back, skin = 1, sleeve = K.role.helper, s = 1.05, arm = 70, children }: { tip: P; dirA: number; back: number; skin?: number; sleeve?: string; s?: number; arm?: number; children?: ComponentChildren }) {
  const grip = pol(tip, dirA, -back);
  const h0 = { x: 0, y: 0, a: dirA + 90, s, pose: 'hold' as const, side: 'R' as const, grip: 22 };
  const off = handPoint(h0, 'grip');
  return <Hand {...h0} x={grip[0] - off[0]} y={grip[1] - off[1]} arm={arm} sleeve={sleeve} skin={skin}>{children}</Hand>;
}

/** Tepe (yan profil) */
const Hill = ({ x, w, top, gy = 240, c = '#9cc274' }: { x: number; w: number; top: number; gy?: number; c?: string }) => (
  <OG sh={[{ d: `M${x - w / 2} ${gy}Q${x - w * 0.25} ${top} ${x} ${top}Q${x + w * 0.25} ${top} ${x + w / 2} ${gy}Z`, f: c }]} />
);

/** Mors işaretleri: '.' ve '-' dizisi; x sol, y orta */
function MorseGlyph({ x, y, code, u = 6, c = K.ink }: { x: number; y: number; code: string; u?: number; c?: string }) {
  let cx = x;
  const out: JSX.Element[] = [];
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '.') { out.push(<circle key={i} cx={cx + u * 0.5} cy={y} r={u * 0.5} fill={c} />); cx += u; }
    else { out.push(<rect key={i} x={cx} y={y - u * 0.5} width={u * 3} height={u} rx={u * 0.4} fill={c} />); cx += u * 3; }
    cx += u;
  }
  return <g>{out}</g>;
}

/** Fener / lamba (yanık). x,y taban ortası */
const Lantern = ({ x, y, s = 1, lit = true }: { x: number; y: number; s?: number; lit?: boolean }) => (
  <G x={x} y={y} s={s}>
    {lit && <circle cx={0} cy={-22} r={26} fill="#ffe680" opacity={0.35} />}
    <OG ow={OW / s} sh={[{ d: rrect(-12, -6, 24, 6, 2), f: '#3d4250' }, { d: rrect(-10, -38, 20, 32, 4), f: lit ? '#ffe680' : '#cfd6de' }, { d: 'M-12 -38H12L8 -46H-8Z', f: '#3d4250' }, { d: 'M-4 -46Q0 -56 4 -46', st: K.out, sw: 2 }]} />
    {lit && <OG ow={OW / s} sh={[{ d: 'M0 -12C-6 -18 -2 -26 0 -32C2 -26 6 -18 0 -12Z', f: K.fire }]} />}
  </G>
);

/** Kulaklık (başın üstünde) */
const Headphones = ({ r }: { r: ReturnType<typeof rig> }) => {
  const h = r.head, R = r.headR;
  return (
    <g>
      <path d={`M${h[0] - R * 1.05} ${h[1]}A${R * 1.05} ${R * 1.15} 0 0 1 ${h[0] + R * 1.05} ${h[1]}`} stroke={K.out} stroke-width={4.5} fill="none" />
      <path d={`M${h[0] - R * 1.05} ${h[1]}A${R * 1.05} ${R * 1.15} 0 0 1 ${h[0] + R * 1.05} ${h[1]}`} stroke="#3d4250" stroke-width={2.5} fill="none" />
      <OG sh={[{ d: rrect(h[0] - R * 1.25, h[1] - 3, 7, 13, 3), f: '#3d4250' }, { d: rrect(h[0] + R * 1.25 - 7, h[1] - 3, 7, 13, 3), f: '#3d4250' }]} ow={1.2} />
    </g>
  );
};

/** Dolu gaz tüpü / boş tüp (asılı çan). x,y üst orta */
const Cylinder = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[{ d: rrect(-6, 0, 12, 10, 2), f: M.iron }, { d: 'M-22 22Q-22 10 -8 10H8Q22 10 22 22V74Q22 84 12 84H-12Q-22 84 -22 74Z', f: '#c6574e' }, { d: 'M10 14Q20 16 20 26V72Q20 82 12 82H6V14Z', f: shade('#c6574e', 0.18), no: true }]} />
  </G>
);

/** Yapraklı yeşil dal: a'dan b'ye */
const LeafyBranch = ({ a, b }: { a: P; b: P }) => {
  const n = 5;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * R2D;
  return (
    <g>
      <Rod a={a} b={b} w={3} c="#7a5a3a" />
      {Array.from({ length: n }, (_, i) => {
        const t = 0.25 + (i / n) * 0.75;
        const p: P = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        const side = i % 2 ? 1 : -1;
        const c = pol(p, ang + side * 45, 9);
        return <OG key={i} sh={[{ d: ell(c, 9, 4.5), f: '#4f9a42', t: `rotate(${f1(ang + side * 45)} ${f1(c[0])} ${f1(c[1])})` }]} ow={1.1} />;
      })}
    </g>
  );
};

/** Kol bandı (üst kol üstünde) */
const Armband = ({ r, c = '#ffd23f' }: { r: ReturnType<typeof rig>; c?: string }) => {
  const a = r.shoulderF, b = r.elbowF;
  const m: P = [a[0] + (b[0] - a[0]) * 0.55, a[1] + (b[1] - a[1]) * 0.55];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * R2D;
  return <OG sh={[{ d: rrect(-5, -7 * r.s, 10, 14 * r.s, 2), f: c, t: `translate(${f1(m[0])} ${f1(m[1])}) rotate(${f1(ang)})` }]} ow={1.2} />;
};

/** Ekvatoral kadran, yandan hafif açıyla: C merkez, R yarıçap, çubuk yönü lat derece (sağa yükselir).
 *  Kadran çubuğa dik; yüzü k oranında görünür. 24 saat çizgisi; 12 çizgisi en altta, kalın. */
function DialSide({ C, R, lat = 40, k = 0.42, rod = '#59616c', rodBack = 70, rodFront = 66, face = M.woodL }: { C: P; R: number; lat?: number; k?: number; rod?: string; rodBack?: number; rodFront?: number; face?: string }) {
  const u: P = [Math.cos(rad(lat)), -Math.sin(rad(lat))];
  const v: P = [Math.sin(rad(lat)), Math.cos(rad(lat))];
  const at = (t: number, rr: number): P => [C[0] + v[0] * rr * Math.cos(t) + u[0] * k * rr * Math.sin(t), C[1] + v[1] * rr * Math.cos(t) + u[1] * k * rr * Math.sin(t)];
  const vAng = Math.atan2(v[1], v[0]) * R2D;
  const back: P = [C[0] - u[0] * rodBack, C[1] - u[1] * rodBack];
  const front: P = [C[0] + u[0] * rodFront, C[1] + u[1] * rodFront];
  const p12 = at(0, R * 0.86);
  return (
    <g>
      <Rod a={back} b={C} w={6} c={rod} />
      <g transform={`translate(${f1(C[0])} ${f1(C[1])}) rotate(${f1(vAng)})`}>
        <OG sh={[{ d: ell([0, 0], R + 2, k * R + 6), f: shade(face, 0.3) }, { d: ell([0, -3], R, k * R), f: face }]} />
      </g>
      <g stroke={K.ink} stroke-width={1.4} stroke-linecap="round" opacity={0.75}>
        {Array.from({ length: 24 }, (_, i) => {
          if (i === 0) return null;
          const q = at((i * 15) / R2D, R * 0.86);
          return <line key={i} x1={f1(C[0])} y1={f1(C[1])} x2={f1(q[0])} y2={f1(q[1])} />;
        })}
      </g>
      <line x1={f1(C[0])} y1={f1(C[1])} x2={f1(p12[0])} y2={f1(p12[1])} stroke={K.ink} stroke-width={3.2} stroke-linecap="round" />
      <Rod a={C} b={front} w={6} c={rod} />
    </g>
  );
}

/* ═══════════════ SAHNELER ═══════════════ */

export const SCENES: Record<string, () => JSX.Element> = {
  /* ─────────── GÜNEŞ SAATİ ─────────── */
  'sf-bt-gunes-saati-kuzey': () => {
    // Yukarıdan: kuzey yukarı, doğu sağa. Sonbahar (sapma -12°), 40° enlem, öğle ±3 saat.
    const st: P = [160, 206];
    const k = 46; // çubuk boyu (px)
    const tips = [-45, -30, -15, 0, 15, 30, 45].map((H) => {
      const [e, n] = shadowTip(H, -12);
      return [st[0] + e * k, st[1] - n * k] as P;
    });
    const noon = tips[3];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.dirt} />
        {[[30, 40], [280, 60], [60, 170], [270, 200], [120, 30], [230, 150]].map(([gx, gy], i) => (
          <path key={i} d={`M${gx} ${gy}l3 -7l3 7M${gx + 8} ${gy}l2 -5l2 5`} stroke="#8fa35a" stroke-width={2} fill="none" stroke-linecap="round" />
        ))}
        {tips.map((p, i) => (
          <path key={i} d={`M${st[0]} ${st[1]}L${f1(p[0])} ${f1(p[1])}`} stroke="#5e4a35" stroke-width={i === 3 ? 0 : 3} opacity={0.35} stroke-linecap="round" />
        ))}
        <path d={`M${st[0]} ${st[1]}L${f1(noon[0])} ${f1(noon[1])}`} stroke="#4a3a2a" stroke-width={5} opacity={0.6} stroke-linecap="round" />
        <path d={smooth(tips)} stroke="#fff" stroke-width={2} stroke-dasharray="3 5" fill="none" opacity={0.8} />
        {tips.map((p, i) => <Stone key={i} x={p[0]} y={p[1] + 5} w={14} h={10} />)}
        <OG sh={[{ d: circ(st, 7), f: K.wood }, { d: circ(st, 3), f: shade(K.wood, 0.3), no: true }]} />
        <Arrow from={[noon[0], noon[1] - 14]} to={[noon[0], 30]} w={6} />
        <Label x={noon[0] + 30} y={34} text="K" size={18} />
      </Scene2>
    );
  },

  'sf-bt-gunes-saati-kadran': () => {
    const c: P = [150, 122], r = 92;
    const lines = Array.from({ length: 24 }, (_, i) => i * 15);
    // Kalem 13. çizgiyi çiziyor (12'nin bir sağındaki, alttan saat yönünde)
    const drawA = 90 - 15 * 3; // ekranda açı (0 = sağ). 12 = 90° (aşağı)
    const tip = pol(c, drawA, r * 0.86);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: circ(c, r), f: M.woodL }, { d: circ(c, r - 7), f: tint(M.woodL, 0.25), ln: true }]} />
        <g stroke={K.ink} stroke-width={1.8} stroke-linecap="round">
          {lines.map((a) => {
            if (a === drawA - 0) return null;
            const p = pol(c, a + 90, r - 9);
            return <line key={a} x1={c[0]} y1={c[1]} x2={f1(p[0])} y2={f1(p[1])} />;
          })}
        </g>
        {/* çizilmekte olan çizgi: yarısı */}
        <line x1={c[0]} y1={c[1]} x2={f1(tip[0])} y2={f1(tip[1])} stroke={K.ink} stroke-width={1.8} stroke-linecap="round" />
        {/* 12 en altta */}
        <T x={c[0]} y={c[1] + r - 14} t="12" size={14} />
        {/* 15° yayı (üstte iki çizgi arası) */}
        <path d={`M${c[0]} ${c[1]}L${f1(pol(c, -90, 80)[0])} ${f1(pol(c, -90, 80)[1])}A80 80 0 0 1 ${f1(pol(c, -75, 80)[0])} ${f1(pol(c, -75, 80)[1])}Z`} fill={K.action} opacity={0.55} />
        <path d={`M${f1(pol(c, -90, 70)[0])} ${f1(pol(c, -90, 70)[1])}A70 70 0 0 1 ${f1(pol(c, -75, 70)[0])} ${f1(pol(c, -75, 70)[1])}`} stroke={K.action} stroke-width={4} fill="none" />
        <OG sh={[{ d: circ(c, 6), f: '#6b4f3a' }]} />
        <Label x={268} y={40} text="15°" size={18} />
        <Arrow from={[240, 44]} to={[176, 52]} bend={0.1} w={4} />
        <Pencil x={tip[0]} y={tip[1]} a={-150} l={80} />
      </Scene2>
    );
  },

  'sf-bt-gunes-saati-kurulum': () => {
    // Yandan (doğudan, hafif yukarıdan) bakış: kuzey sağda. Çubuk yerle 40°; kadran çubuğa dik, 12 çizgisi en altta.
    const gy = 206;
    const lat = 40;
    const u: P = [Math.cos(rad(lat)), -Math.sin(rad(lat))];
    const foot: P = [62, 178];
    const at = (l: number): P => [foot[0] + u[0] * l, foot[1] + u[1] * l];
    const C = at(112);
    const R = 52;
    const v: P = [Math.sin(rad(lat)), Math.cos(rad(lat))];
    const p12: P = [C[0] + v[0] * R * 0.95, C[1] + v[1] * R * 0.95];
    return (
      <Scene2 bg="outdoor" gy={gy} ground="grass">
        <Sun x={36} y={40} r={13} />
        {/* kaide */}
        <OG sh={[{ d: rrect(30, 178, 230, gy - 178 + 6, 4), f: '#b9b3a6' }, { d: 'M30 194H260', st: shade('#b9b3a6', 0.3), sw: 1.5 }, { d: 'M110 178V194M180 178V194M70 194V210M140 194V210M220 194V210', st: shade('#b9b3a6', 0.3), sw: 1.5 }]} />
        <DialSide C={C} R={R} lat={lat} rodBack={112} rodFront={66} />
        <T x={f1(p12[0] + 8)} y={f1(p12[1] + 12)} t="12" size={14} />
        {/* açı: yatay ile çubuk arası */}
        <path d={`M${foot[0]} ${foot[1]}H${foot[0] + 92}`} stroke={K.ink} stroke-width={2.5} stroke-dasharray="6 5" />
        <path d={`M${foot[0] + 56} ${foot[1]}A56 56 0 0 0 ${f1(at(56)[0])} ${f1(at(56)[1])}`} stroke={K.action} stroke-width={5} fill="none" />
        <Label x={foot[0] + 40} y={foot[1] + 18} text="40°" size={16} />
        {/* kuzey */}
        <Arrow from={[250, 226]} to={[306, 226]} w={6} />
        <T x={240} y={232} t="K" size={18} anchor="end" />
      </Scene2>
    );
  },

  /* ─────────── TAKVİM ─────────── */
  'sf-bt-takvim-centik': () => {
    // Sayaç çubuğu: her 7. çentik uzun. Bıçak bir sonraki çentiği atıyor.
    const y0 = 116, x0 = 22, step = 11.5;
    const n = 18; // atılmış çentik sayısı
    const tip: P = [x0 + 8 + n * step, y0 - 10];
    const dirA = -118;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#f4c88a" />
        <circle cx={58} cy={150} r={30} fill="#ff9f3a" />
        <rect y={150} width={320} height={90} fill="#c9a27a" />
        <rect y={150} width={320} height={4} fill="#b48c63" />
        <OG sh={[{ d: rrect(x0 - 6, y0 - 14, 270, 28, 10), f: M.woodL }, { d: 'M' + (x0 - 2) + ' ' + (y0 + 8) + 'H' + (x0 + 258), st: shade(M.woodL, 0.25), sw: 1.5 }]} />
        {Array.from({ length: n }, (_, i) => {
          const x = x0 + 8 + i * step;
          const long = (i + 1) % 7 === 0;
          return <path key={i} d={`M${x} ${y0 - 12}V${y0 - 12 + (long ? 24 : 12)}`} stroke="#6b4a2b" stroke-width={3} stroke-linecap="round" />;
        })}
        <KnifeHand tip={tip} dirA={dirA} skin={HANDSKIN.usta} />
        <Label x={124} y={44} text="7" size={18} />
        <Arrow from={[112, 54]} to={[x0 + 8 + 6 * step, y0 - 18]} bend={0.2} w={4} />
        <Arrow from={[136, 54]} to={[x0 + 8 + 13 * step, y0 - 18]} bend={-0.2} w={4} />
      </Scene2>
    );
  },

  'sf-bt-takvim-ay-evreleri': () => {
    const ph = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.night} />
        {[[20, 20], [300, 30], [150, 12], [60, 120], [270, 120], [16, 210], [304, 212]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={1.3} fill="#f4eccb" opacity={0.7} />)}
        {ph.map((p, i) => {
          const row = Math.floor(i / 4), col = row === 0 ? i % 4 : 3 - (i % 4);
          const x = 48 + col * 75, y = 62 + row * 86;
          return <MoonPhase key={i} x={x} y={y} r={25} ph={p} />;
        })}
        {[0, 1, 2].map((i) => <Arrow key={i} from={[78 + i * 75, 62]} to={[94 + i * 75, 62]} w={3} />)}
        {[0, 1, 2].map((i) => <Arrow key={'b' + i} from={[244 - i * 75, 148]} to={[228 - i * 75, 148]} w={3} />)}
        <Arrow from={[284, 82]} to={[284, 118]} bend={-0.4} w={3} />
        <Label x={160} y={212} text="29,5 gün" size={16} />
      </Scene2>
    );
  },

  'sf-bt-takvim-golge-tasi': () => {
    // Yandan: sabit direk (boy 96 px), 40° enlem. Her hafta bir taş (21 Haz → 21 Ara, 27 taş). Kuzey sağda.
    // Gündönümü çevresinde gölge ucu az kıpırdar: taşlar orada sıkışır; ekinoks çevresinde aralık açılır.
    const gy = 196, px = 40, h = 96;
    const xs = Array.from({ length: 27 }, (_, w) => px + h / Math.tan(rad(50 + 23.44 * Math.cos((2 * Math.PI * 7 * w) / 365.25))));
    const sx = px + h / Math.tan(rad(50));
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        {/* güneş ışını: güneşten direk tepesine, oradan gölge ucuna (ekinoks, 50°) */}
        <path d={`M${f1(sx - 150)} ${f1(gy - 150 * Math.tan(rad(50)))}L${f1(sx)} ${gy}`} stroke="#f2b31c" stroke-width={2.5} stroke-dasharray="6 5" />
        <Sun x={f1(sx - 104)} y={f1(gy - 104 * Math.tan(rad(50)))} r={11} />
        <path d={`M${px} ${gy + 2}H${f1(sx)}`} stroke="#4a3a2a" stroke-width={8} opacity={0.6} stroke-linecap="round" />
        <OG sh={[{ d: rrect(px - 5, gy - h, 10, h + 3, 2), f: K.wood }]} />
        {xs.map((x, i) => (i === 0 || i === 26 ? null : <OG key={i} sh={[{ d: ell([x, gy + 2], 3.6, 3), f: M.stone }]} ow={1.2} />))}
        <Stone x={xs[0]} y={gy + 5} w={15} h={12} c="#8e8a82" />
        <Stone x={xs[26]} y={gy + 5} w={15} h={12} c="#8e8a82" />
        <Label x={xs[0] + 2} y={gy + 26} text="21 Haz" size={13} />
        <Label x={xs[26] - 6} y={gy + 26} text="21 Ara" size={13} />
        <Arrow from={[252, 150]} to={[306, 150]} w={5} />
        <T x={242} y={156} t="K" size={17} anchor="end" />
      </Scene2>
    );
  },

  /* ─────────── MEVSİM ─────────── */
  'sf-bt-mevsim-kiragi': () => {
    // Kırağılı sabah: çimende beyaz kristaller; dona dayanıksız fide şimdi ekilmez.
    const blades: P[] = Array.from({ length: 26 }, (_, i) => [8 + i * 12.2, 0]);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#c8d6ea" />
        <rect y={0} width={320} height={90} fill="#f0c6b4" opacity={0.7} />
        <circle cx={250} cy={96} r={20} fill="#ffd9a0" />
        <rect y={96} width={320} height={144} fill="#7f9f6a" />
        <path d="M0 96Q80 86 160 94T320 92V100H0Z" fill="#94ab86" />
        {blades.map(([bx], i) => {
          const hgt = 44 + ((i * 37) % 26);
          const lean = ((i * 13) % 11) - 5;
          const base = 242;
          const d = `M${bx - 6} ${base}Q${bx + lean} ${base - hgt * 0.6} ${bx + lean * 2} ${base - hgt}Q${bx + lean + 2} ${base - hgt * 0.5} ${bx + 6} ${base}Z`;
          return (
            <g key={i}>
              <path d={d} fill="#86ad7c" stroke={K.out} stroke-width={1.3} />
              <path d={`M${bx - 3} ${base - 4}Q${bx + lean * 0.6} ${base - hgt * 0.5} ${bx + lean * 2} ${base - hgt + 3}`} fill="none" stroke="#ffffff" stroke-width={2.2} />
            </g>
          );
        })}
        {/* fide */}
        <g>
          <path d="M160 200V150" stroke="#4f8a3c" stroke-width={4} />
          <OG sh={[{ d: 'M160 168Q136 160 132 146Q150 144 160 160Z', f: '#5aa84f' }, { d: 'M160 158Q184 150 188 136Q170 134 160 150Z', f: '#5aa84f' }, { d: 'M160 150Q154 134 160 124Q168 134 160 150Z', f: '#6fbf5d' }]} />
          <OG sh={[{ d: ell([160, 202], 26, 7), f: '#7a5a3a' }]} />
          {[[140, 148], [180, 140], [158, 130]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r={2.2} fill="#fff" />)}
        </g>
        <No x={160} y={164} r={50} />
        <Label x={60} y={36} text="0°C" size={16} />
      </Scene2>
    );
  },

  'sf-bt-mevsim-toprak-sikma': () => {
    const hl = { x: 80, y: 238, a: 0, s: 1.25, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    const hr = { x: 240, y: 238, a: 0, s: 1.25, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    const pl = handPoint(hl, 'palm'), pr = handPoint(hr, 'palm');
    return (
      <Scene2 bg="closeup">
        <line x1={160} y1={14} x2={160} y2={226} stroke="#b7c0cc" stroke-width={2} stroke-dasharray="6 6" />
        <Hand {...hl} arm={40} sleeve={K.role.bystander2} skin={HANDSKIN.ciftci} />
        <OG sh={[{ d: smooth([[pl[0] - 26, pl[1] - 4], [pl[0] - 14, pl[1] - 26], [pl[0] + 14, pl[1] - 28], [pl[0] + 28, pl[1] - 6], [pl[0] + 16, pl[1] + 12], [pl[0] - 16, pl[1] + 12]], true), f: '#6b4a32' }]} />
        {[[-10, -12], [2, -14], [14, -10]].map(([dx, dy], i) => <path key={i} d={`M${pl[0] + dx} ${pl[1] + dy}q3 10 0 18`} stroke="#4a3222" stroke-width={3} fill="none" stroke-linecap="round" />)}
        <path d={`M${pl[0] - 18} ${pl[1] - 18}q6 -4 12 0`} stroke="#9a7a5a" stroke-width={2} fill="none" />
        <Hand {...hr} arm={40} sleeve={K.role.bystander2} skin={HANDSKIN.ciftci} />
        {[[-20, -6, 9], [-4, -16, 8], [12, -4, 9], [22, -18, 6], [-14, 10, 6], [6, 8, 7], [-26, -22, 5]].map(([dx, dy, r], i) => (
          <OG key={i} sh={[{ d: smooth([[pr[0] + dx - r, pr[1] + dy], [pr[0] + dx - r * 0.3, pr[1] + dy - r * 0.9], [pr[0] + dx + r, pr[1] + dy - r * 0.4], [pr[0] + dx + r * 0.6, pr[1] + dy + r * 0.7], [pr[0] + dx - r * 0.5, pr[1] + dy + r * 0.8]], true), f: '#9c7650' }]} ow={1.2} />
        ))}
        {[[pr[0] - 40, pr[1] + 44], [pr[0] + 36, pr[1] + 50], [pr[0] + 44, pr[1] + 30]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={3} fill="#9c7650" stroke={K.out} stroke-width={1} />)}
        <Bad x={128} y={34} r={15} />
        <Ok x={288} y={34} r={15} />
      </Scene2>
    );
  },

  'sf-bt-mevsim-hasat-tane': () => {
    // Olgun başak + başparmak tırnağıyla bastırılan sert tane.
    const h = { x: 222, y: 250, a: -20, s: 1.6, pose: 'pinch' as const, side: 'R' as const };
    const pc = handPoint(h, 'pinch');
    const ear = (x: number, y: number, a: number, s: number) => (
      <G x={x} y={y} a={a} s={s}>
        <path d="M0 0V140" stroke="#c99a3c" stroke-width={4 / s} />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <OG ow={OW / s} sh={[{ d: ell([-7, i * 11], 6.5, 9), f: i % 2 ? '#e5b84f' : '#dcaa3e', t: `rotate(-20 -7 ${i * 11})` }, { d: ell([7, i * 11 + 5], 6.5, 9), f: i % 2 ? '#dcaa3e' : '#e5b84f', t: `rotate(20 7 ${i * 11 + 5})` }]} />
            <path d={`M-9 ${i * 11 - 7}L-22 ${i * 11 - 34}M9 ${i * 11 - 2}L22 ${i * 11 - 29}`} stroke="#c99a3c" stroke-width={1.4 / s} />
          </g>
        ))}
      </G>
    );
    return (
      <Scene2 bg="closeup">
        {ear(82, 46, 8, 1.15)}
        <Hand {...h} arm={60} sleeve={K.role.bystander2} skin={HANDSKIN.ciftci}>
        </Hand>
        <OG sh={[{ d: ell([pc[0] + 2, pc[1] + 2], 7, 10.5), f: '#e2b24a', t: `rotate(-30 ${pc[0] + 2} ${pc[1] + 2})` }, { d: `M${pc[0] - 2} ${pc[1] - 4}q4 6 2 12`, st: '#a97d2a', sw: 1.5 }]} />
        <Ok x={282} y={36} r={15} />
      </Scene2>
    );
  },

  /* ─────────── BULUT ─────────── */
  'sf-bt-bulut-sirrus': () => {
    const wisp = (x: number, y: number, l: number, k: number) => (
      <path d={`M${x} ${y}q${l * 0.3} ${-6 * k} ${l * 0.6} ${-4 * k}t${l * 0.4} ${-8 * k}q4 -3 1 -8`} stroke="#fff" stroke-width={3.2} fill="none" stroke-linecap="round" opacity={0.95} />
    );
    const ws: [number, number, number, number][] = [
      [180, 50, 60, 1], [240, 38, 50, 1], [130, 34, 46, 0.8], [200, 82, 70, 1.1], [80, 66, 70, 1], [20, 52, 66, 1], [40, 100, 80, 1.2], [110, 112, 76, 1], [10, 128, 70, 1.1], [170, 118, 60, 0.9], [270, 72, 40, 0.8],
    ];
    const p: PersonProps = { ...CAST.ciftci, x: 230, y: 228, s: 0.9, pose: { ...POSE.standSide, head: -118, armF: [-40, -50], handF: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={186}>
        <rect width={320} height={60} fill={K.sky} />
        <rect y={186} width={320} height={54} fill="#c9b36a" />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 24} 240L${i * 24 + 8} 192`} stroke="#b39a52" stroke-width={2} />)}
        {ws.map(([x, y, l, k], i) => <g key={i}>{wisp(x, y, l, k)}</g>)}
        {/* batıda kalınlaşan tabaka */}
        <path d="M0 140Q40 120 90 132T170 136Q130 150 60 152T0 156Z" fill="#fff" opacity={0.6} />
        <Person {...p} flip />
        <T x={18} y={180} t="B" size={16} fill="#4a5568" anchor="start" />
      </Scene2>
    );
  },

  'sf-bt-bulut-hale': () => {
    const m: P = [160, 96];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.night} />
        {[[20, 24], [300, 30], [40, 180], [290, 150], [250, 20], [70, 14]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={1.4} fill="#f4eccb" opacity={0.5} />)}
        <rect width={320} height={240} fill="#9fb0d8" opacity={0.18} />
        <circle cx={m[0]} cy={m[1]} r={70} fill="none" stroke="#e8eefc" stroke-width={10} opacity={0.35} />
        <circle cx={m[0]} cy={m[1]} r={70} fill="none" stroke="#f6f0d8" stroke-width={3} opacity={0.6} />
        <circle cx={m[0]} cy={m[1]} r={34} fill="#f6efc9" opacity={0.15} />
        <OG sh={[{ d: circ(m, 15), f: '#f6efc9' }]} />
        {/* ince bulut tülü */}
        <path d="M0 70Q80 58 160 72T320 66V82Q240 90 160 84T0 88Z" fill="#dfe6f6" opacity={0.18} />
        <path d="M0 116Q90 106 170 118T320 112V126Q230 132 150 126T0 132Z" fill="#dfe6f6" opacity={0.16} />
        {/* köy damları */}
        <path d="M0 240V196L30 178L60 196V188L96 166L132 188V200L160 186L188 200V184L222 164L256 184V194L282 180L320 196V240Z" fill="#141b2e" stroke="#0d1220" stroke-width={1.5} />
        <rect x={104} y={198} width={10} height={12} fill="#f4c96a" />
        <rect x={232} y={196} width={10} height={12} fill="#f4c96a" />
      </Scene2>
    );
  },

  'sf-bt-bulut-kumulonimbus': () => {
    const gy = 196;
    const a: PersonProps = { ...CAST.ciftci, x: 118, y: 226, s: 0.78, pose: { ...POSE.walk, face: 'worried' } };
    const b: PersonProps = { who: 'boy', skin: 2, role: 'bystander3', x: 82, y: 224, s: 0.78, pose: { ...POSE.walk, face: 'worried' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect width={320} height={gy} fill="#aac4d6" />
        {/* yağmur perdesi */}
        <g stroke="#6f8aa6" stroke-width={2} opacity={0.75}>
          {Array.from({ length: 16 }, (_, i) => <line key={i} x1={20 + i * 9} y1={118} x2={12 + i * 9} y2={gy - 4} />)}
        </g>
        {/* kule bulut + örs */}
        <OG sh={[{ d: 'M70 52Q40 46 8 44Q50 22 130 18Q230 12 306 32Q250 40 196 46Q170 52 150 60Z', f: '#6b7586' }]} />
        <OG sh={[
          { d: smooth([[24, 130], [20, 110], [36, 94], [40, 74], [58, 62], [70, 46], [96, 38], [122, 44], [142, 40], [162, 52], [172, 68], [188, 82], [186, 100], [200, 114], [198, 130]], true), f: '#5c6677' },
          { d: smooth([[150, 56], [168, 66], [184, 82], [182, 100], [196, 114], [194, 128], [150, 128], [160, 104], [150, 80]], true), f: '#4b5464', no: true },
        ]} />
        {/* şimşek */}
        <OG sh={[{ d: 'M120 126L104 160H116L100 192L132 150H118L134 126Z', f: '#ffe36b' }]} />
        <Person {...b} />
        <Person {...a} />
        {/* barınak */}
        <HouseExt x={236} y={gy + 6} w={76} h={52} />
        <Arrow from={[150, 170]} to={[226, 170]} w={6} />
      </Scene2>
    );
  },

  /* ─────────── RÜZGÂR ─────────── */
  'sf-bt-ruzgar-serit': () => {
    const gy = 196;
    const base: P = [130, 214];
    const top: P = [150, 46];
    // yer haçı (perspektif): K arkada (yukarı), G önde, D sağda, B solda
    const arm = (dx: number, dy: number) => [base[0] + dx, base[1] + dy] as P;
    
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <g stroke="#ffffff" stroke-width={2.5} stroke-linecap="round" opacity={0.85} fill="none">
          <path d="M14 70q20 -6 40 0t40 0" />
          <path d="M24 104q20 -6 40 0t40 0" />
          <path d="M8 136q20 -6 40 0t40 0" />
        </g>
        <OG sh={[{ d: smooth([[134, 50], [170, 44], [202, 58], [236, 48], [270, 62], [272, 74], [236, 62], [202, 72], [170, 58], [134, 62]], true, 0.6), f: K.danger }]} />
        <OG sh={[{ d: rrect(top[0] - 4, top[1], 8, base[1] - top[1], 2), f: K.wood }]} />
        <OG sh={[{ d: circ([262, 200], 28), f: '#fbfaf5' }]} />
        <path d="M262 178V222M240 200H284" stroke={K.ink} stroke-width={1.5} opacity={0.5} />
        <T x={262} y={186} t="K" size={13} />
        <T x={262} y={224} t="G" size={13} />
        <T x={282} y={205} t="D" size={13} />
        <T x={242} y={205} t="B" size={13} />
      </Scene2>
    );
  },

  'sf-bt-ruzgar-olcek': () => {
    // 5 kare (0–4): 0 duman dik, 1 duman eğik, 2 yapraklar kıpırdar, 3 dallar sallanır, 4 gövdeler eğilir.
    const panel = (i: number) => {
      const w = 56, x0 = 8 + i * 61;
      const bend = [0, 0, 2, 7, 13][i];
      const cx = x0 + w / 2 + 6 - bend * 0.9, gy = 182;
      const smokeA = [-90, -60, -38, -20, -8][i];
      const crown: P = [cx + bend * 0.9, gy - 96 + bend * 0.4];
      const cw = 17 - bend * 0.2, ch = 30 - bend * 0.3;
      return (
        <g key={i}>
          <OG sh={[{ d: rrect(x0, 16, w, 196, 8), f: K.sky }, { d: rrect(x0, gy, w, 30, 0), f: K.grass, no: true }]} />
          <rect x={x0} y={gy} width={w} height={2} fill={K.grassShade} />
          <OG sh={[
            { d: `M${cx - 5} ${gy}Q${cx - 4 + bend * 0.2} ${gy - 40} ${cx - 3 + bend * 0.8} ${gy - 74 + bend * 0.4}L${cx + 3 + bend * 0.8} ${gy - 74 + bend * 0.4}Q${cx + 4 + bend * 0.3} ${gy - 40} ${cx + 5} ${gy}Z`, f: K.trunk },
            { d: ell(crown, cw, ch), f: K.leaf, t: `rotate(${bend * 1.6} ${crown[0]} ${crown[1]})` },
          ]} />
          {/* 2: yapraklar kıpırdar (titreşim çizgileri) */}
          {i === 2 && <OG sh={[
            { d: ell([crown[0] + cw + 1, crown[1] - 14], 4.5, 2.6), f: K.leaf, t: `rotate(-30 ${f1(crown[0] + cw + 1)} ${f1(crown[1] - 14)})` },
            { d: ell([crown[0] + cw - 2, crown[1] + 10], 4.5, 2.6), f: K.leaf, t: `rotate(20 ${f1(crown[0] + cw - 2)} ${f1(crown[1] + 10)})` },
          ]} ow={1.2} />}
          {/* 3: dallar sallanır (çift tepe izi) */}
          {i === 3 && <OG sh={[{ d: ell([crown[0] - 6, crown[1] + 2], cw, ch), f: K.leaf, t: `rotate(-6 ${crown[0]} ${crown[1]})` }]} ow={1.4} />}
          {i === 3 && <OG sh={[{ d: ell(crown, cw, ch), f: K.leaf, t: `rotate(${bend * 1.6} ${crown[0]} ${crown[1]})` }]} />}
          {i >= 1 && <g stroke="#fff" stroke-width={2} stroke-linecap="round">
            {Array.from({ length: i }, (_, k) => <path key={k} d={`M${x0 + 5} ${42 + k * 12}h${8 + i * 3}`} />)}
          </g>}
          {/* duman (küçük ateş) */}
          <path d={smooth([[x0 + 11, gy - 2], pol([x0 + 11, gy - 2], smokeA, 13), pol(pol([x0 + 11, gy - 2], smokeA, 13), smokeA + 6, 14)])} stroke="#9aa1aa" stroke-width={6} fill="none" stroke-linecap="round" opacity={0.85} />
          <OG sh={[{ d: `M${x0 + 6} ${gy}L${x0 + 12} ${gy - 8}L${x0 + 18} ${gy}Z`, f: K.fire }]} ow={1} />
          <T x={x0 + w / 2} y={230} t={String(i)} size={20} fill="#fff" />
        </g>
      );
    };
    return (
      <Scene2 bg="dark">
        {[0, 1, 2, 3, 4].map(panel)}
      </Scene2>
    );
  },

  'sf-bt-ruzgar-sirt': () => {
    // Arkadan: sırtı rüzgâra dönük kişi; rüzgâr bizden ona doğru. Alçak basınç (A) solunda.
    const p: PersonProps = { ...CAST.ciftci, x: 160, y: 226, s: 1.05, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const hc = r.head;
    return (
      <Scene2 bg="outdoor">
        <Cloud x={64} y={92} s={1.25} c="#7d8796" />
        <T x={64} y={84} t="A" size={22} fill="#fff" />
        <Sun x={258} y={70} r={20} />
        <T x={258} y={78} t="Y" size={20} />
        <Person {...p} over={() => (
          <g>
            {/* başın arkası: başörtüsü yüzü kapatır */}
            <OG sh={[{ d: circ([hc[0], hc[1] - 1], r.headR * 1.08), f: CAST.ciftci.hairC }, { d: `M${hc[0] - 9} ${hc[1] + 10}Q${hc[0]} ${hc[1] + 24} ${hc[0] + 9} ${hc[1] + 10}`, f: CAST.ciftci.hairC }]} />
            <path d={`M${hc[0] - 6} ${hc[1] - 6}q6 4 12 0`} stroke={shade(CAST.ciftci.hairC, 0.3)} stroke-width={1.5} fill="none" />
          </g>
        )} />
        {/* rüzgâr: arkadan (izleyiciden) kişiye */}
        <Arrow from={[70, 236]} to={[118, 176]} w={6} />
        <Arrow from={[250, 236]} to={[202, 176]} w={6} />
      </Scene2>
    );
  },

  /* ─────────── UZUNLUK ─────────── */
  'sf-bt-olcu-ana-cubuk': () => {
    // Şerit metre ile 1 m'lik çubuk; her 10 cm'ye çentik.
    const x0 = 26, L = 260, y = 128;
    const cm = L / 100;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#d9b991" />
        {[40, 92, 180, 214].map((yy) => <path key={yy} d={`M0 ${yy}H320`} stroke="#c9a77d" stroke-width={2} />)}
        {/* şerit metre */}
        <OG sh={[{ d: rrect(x0 - 4, 70, L + 30, 30, 2), f: '#f4cf3a' }]} />
        {Array.from({ length: 21 }, (_, i) => {
          const x = x0 + i * 5 * cm;
          const big = i % 2 === 0;
          return <path key={i} d={`M${f1(x)} 70V${big ? 86 : 79}`} stroke={K.ink} stroke-width={big ? 2 : 1.4} />;
        })}
        {[0, 20, 40, 60, 80, 100].map((v) => <T key={v} x={x0 + v * cm + (v === 100 ? -2 : 0)} y={97} t={String(v)} size={9} />)}
        {/* ana çubuk */}
        <OG sh={[{ d: rrect(x0, y, L, 22, 3), f: M.woodL }, { d: `M${x0 + 4} ${y + 15}H${x0 + L - 4}`, st: shade(M.woodL, 0.2), sw: 1.4 }]} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = x0 + (i + 1) * 10 * cm;
          return i < 7 ? <path key={i} d={`M${f1(x)} ${y}v9`} stroke="#5b3d22" stroke-width={3} stroke-linecap="round" /> : null;
        })}
        {/* hizalama çizgileri */}
        {[0, 100].map((v) => <path key={v} d={`M${x0 + v * cm} 100V${y}`} stroke={K.action} stroke-width={2} stroke-dasharray="3 3" />)}
        <KnifeHand tip={[x0 + 80 * cm, y + 2]} dirA={-70} skin={HANDSKIN.usta} />
        <Label x={80} y={190} text="1 m" size={18} />
      </Scene2>
    );
  },

  'sf-bt-olcu-karis-kulac': () => {
    // Kulaç (kollar açık, parmak ucundan parmak ucuna) ≈ boy.
    const p: PersonProps = { ...CAST.usta, x: 150, y: 222, s: 1.05, pose: { ...POSE.stand, armB: [180, 180], armF: [0, 0], handB: 'flat', handF: 'flat', face: 'neutral' } };
    const r = rig(p);
    const lt = r.handB[0] - 9, rt = r.handF[0] + 9;
    const top = r.top;
    return (
      <Scene2 bg="indoor">
        <Person {...p} />
        <Dim a={[lt, top - 16]} b={[rt, top - 16]} />
        <Dim a={[rt + 22, top]} b={[rt + 22, 222]} />
        <path d={`M${rt + 8} ${top}H${rt + 30}M${rt + 8} 222H${rt + 30}`} stroke={K.ink} stroke-width={1.5} />
        <Label x={rt + 18} y={top - 40} text="≈" size={18} />
      </Scene2>
    );
  },

  'sf-bt-olcu-adim': () => {
    const gy = 190;
    const p: PersonProps = { ...CAST.usta, x: 168, y: 222, s: 0.95, pose: { ...POSE.walk, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <rect y={gy + 18} width={320} height={22} fill="#b9966a" />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} fill="#8a6a45" opacity={0.6}>
            <ellipse cx={38 + i * 26} cy={i % 2 ? 214 : 222} rx={7} ry={3} />
          </g>
        ))}
        <Stake x={26} y={224} h={56} c={K.danger} />
        <Stake x={296} y={224} h={56} c={K.danger} />
        <Person {...p} />
        <Dim a={[26, 40]} b={[296, 40]} />
        <Label x={160} y={40} text="100 m" size={16} />
      </Scene2>
    );
  },

  /* ─────────── TERAZİ ─────────── */
  'sf-bt-terazi-asma': () => {
    const y = 84, cx = 160, L = 110;
    return (
      <Scene2 bg="outdoor" gy={206}>
        <Branch x1={0} x2={320} y={28} />
        <Rope pts={[[cx, 30], [cx, y - 6]]} />
        <OG sh={[{ d: rrect(cx - L - 8, y - 5, 2 * L + 16, 10, 4), f: M.woodL }]} />
        <OG sh={[{ d: circ([cx, y - 6], 4), f: M.iron }]} ow={1} />
        <Pan x={cx - L} y={y + 2} drop={70}><Bucket x={cx - L} y={y + 74} s={0.0001} /></Pan>
        <Pan x={cx + L} y={y + 2} drop={70} />
        <path d={`M${cx - L} ${y + 14}V${y + 20}M${cx} ${y + 14}V${y + 20}M${cx + L} ${y + 14}V${y + 20}`} stroke={K.ink} stroke-width={1.5} />
        <Dim a={[cx - L, y + 30]} b={[cx - 4, y + 30]} w={2.6} />
        <Dim a={[cx + 4, y + 30]} b={[cx + L, y + 30]} w={2.6} />
        <path d={`M${cx - 70} 196H${cx + 70}`} stroke={K.safe} stroke-width={3} stroke-dasharray="6 5" opacity={0} />
        <Ok x={cx} y={190} r={15} />
      </Scene2>
    );
  },

  'sf-bt-terazi-su-sisesi': () => {
    const y = 84, cx = 160, L = 110;
    return (
      <Scene2 bg="outdoor" gy={206}>
        <Branch x1={0} x2={320} y={28} />
        <Rope pts={[[cx, 30], [cx, y - 6]]} />
        <OG sh={[{ d: rrect(cx - L - 8, y - 5, 2 * L + 16, 10, 4), f: M.woodL }]} />
        <OG sh={[{ d: circ([cx, y - 6], 4), f: M.iron }]} ow={1} />
        <Pan x={cx - L} y={y + 2} drop={88}>
          {/* 1 litrelik su şişesi */}
          <OG sh={[{ d: `M${cx - L - 13} ${y + 90}V${y + 46}Q${cx - L - 13} ${y + 36} ${cx - L - 5} ${y + 32}V${y + 24}H${cx - L + 5}V${y + 32}Q${cx - L + 13} ${y + 36} ${cx - L + 13} ${y + 46}V${y + 90}Z`, f: '#d9eef8' }, { d: `M${cx - L - 12} ${y + 89}V${y + 46}Q${cx - L - 12} ${y + 38} ${cx - L - 5} ${y + 34}H${cx - L + 5}Q${cx - L + 12} ${y + 38} ${cx - L + 12} ${y + 46}V${y + 89}Z`, f: K.water, no: true }, { d: rrect(cx - L - 6, y + 18, 12, 7, 2), f: '#3a7bd5' }]} />
        </Pan>
        <Pan x={cx + L} y={y + 2} drop={88}>
          <Stone x={cx + L} y={y + 91} w={40} h={30} c="#9a968c" text="1 kg" />
        </Pan>
        <Ok x={cx} y={178} r={15} />
        <Label x={cx - L} y={210} text="1 L" size={14} />
      </Scene2>
    );
  },

  'sf-bt-terazi-kantar': () => {
    // Kantar: asma noktası sol uca yakın; kısa kolda çuval, uzun kolda kayan taş.
    const y = 80, piv = 70, x1 = 40, x2 = 296;
    const sack = 50, wt = 236;
    return (
      <Scene2 bg="outdoor" gy={206}>
        <Branch x1={0} x2={200} y={26} />
        <Rope pts={[[piv, 28], [piv, y - 6]]} />
        <OG sh={[{ d: rrect(x1, y - 5, x2 - x1, 10, 4), f: M.woodL }]} />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${100 + i * 19} ${y - 5}v6`} stroke="#5b3d22" stroke-width={2.4} />)}
        <OG sh={[{ d: circ([piv, y - 6], 4), f: M.iron }]} ow={1} />
        {/* çuval */}
        <Rope pts={[[sack, y + 4], [sack, y + 44]]} />
        <OG sh={[{ d: smooth([[sack - 8, y + 44], [sack - 26, y + 70], [sack - 26, y + 110], [sack, y + 118], [sack + 26, y + 110], [sack + 26, y + 70], [sack + 8, y + 44]], true), f: M.sack }, { d: `M${sack - 8} ${y + 50}H${sack + 8}`, st: shade(M.sack, 0.4), sw: 2 }]} />
        {/* kayan ağırlık */}
        <OG sh={[{ d: rrect(wt - 6, y - 8, 12, 16, 3), f: M.iron }]} />
        <Rope pts={[[wt, y + 6], [wt, y + 30]]} />
        <Stone x={wt} y={y + 52} w={26} h={22} c="#8e8a82" />
        <Arrow from={[wt - 40, y - 30]} to={[wt + 30, y - 30]} w={4} />
        <Arrow from={[wt + 20, y - 30]} to={[wt - 50, y - 30]} w={4} head={1} />
      </Scene2>
    );
  },

  /* ─────────── 3-4-5 ─────────── */
  'sf-bt-345-dugumlu-ip': () => {
    const x0 = 22, x1 = 298, y = 120;
    const n = 13, step = (x1 - x0) / 12;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.dirt} />
        <KnotRope a={[x0, y]} b={[x1, y]} n={n} r={5.5} w={3.2} />
        {Array.from({ length: n }, (_, i) => <T key={i} x={x0 + i * step} y={y + 28} t={String(i + 1)} size={12} />)}
        <Label x={160} y={200} text="12 aralık" size={15} />
      </Scene2>
    );
  },

  'sf-bt-345-ucgen': () => {
    // Yukarıdan: köşe A, 4 birim sağa B, 3 birim yukarı C. Hipotenüs 5.
    const u = 40;
    const A: P = [64, 200], B: P = [64 + 4 * u, 200], C: P = [64, 200 - 3 * u];
    const knots: P[] = [];
    for (let i = 0; i <= 4; i++) knots.push([A[0] + i * u, A[1]]);
    for (let i = 1; i <= 5; i++) knots.push([B[0] + ((C[0] - B[0]) * i) / 5, B[1] + ((C[1] - B[1]) * i) / 5]);
    for (let i = 1; i < 3; i++) knots.push([C[0], C[1] + i * u]);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#9cc274" />
        {[[250, 40], [280, 170], [30, 30], [200, 110]].map(([gx, gy], i) => <path key={i} d={`M${gx} ${gy}l3 -7l3 7`} stroke="#6f9a50" stroke-width={2} fill="none" />)}
        <Rope pts={[A, B]} w={3} />
        <Rope pts={[B, C]} w={3} />
        <Rope pts={[C, A]} w={3} />
        {knots.map((k, i) => <OG key={i} sh={[{ d: circ(k, 4.2), f: shade(M.rope, 0.12) }]} ow={1.2} />)}
        <path d={`M${A[0]} ${A[1] - 16}H${A[0] + 16}V${A[1]}`} stroke={K.action} stroke-width={3} fill="none" />
        {[A, B, C].map((p, i) => <StakeTop key={i} x={p[0]} y={p[1]} r={7} />)}
        <Label x={(A[0] + B[0]) / 2} y={A[1] + 22} text="4" size={17} bg={K.white} />
        <Label x={A[0] - 26} y={(A[1] + C[1]) / 2} text="3" size={17} bg={K.white} />
        <Label x={(B[0] + C[0]) / 2 + 22} y={(B[1] + C[1]) / 2 - 16} text="5" size={17} bg={K.white} />
        <Label x={A[0] + 40} y={A[1] - 30} text="90°" size={14} />
      </Scene2>
    );
  },

  'sf-bt-345-kosegen': () => {
    const x0 = 54, y0 = 54, w = 212, h = 132;
    const c: P[] = [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
    const mid1: P = [x0 + w * 0.3, y0 + h * 0.3], mid2: P = [x0 + w * 0.7, y0 + h * 0.3];
    const tick = (p: P, a: number) => {
      const q1 = pol(pol(p, a, -3), a + 90, 8), q2 = pol(pol(p, a, -3), a - 90, 8);
      const q3 = pol(pol(p, a, 3), a + 90, 8), q4 = pol(pol(p, a, 3), a - 90, 8);
      return <path d={`M${f1(q1[0])} ${f1(q1[1])}L${f1(q2[0])} ${f1(q2[1])}M${f1(q3[0])} ${f1(q3[1])}L${f1(q4[0])} ${f1(q4[1])}`} stroke={K.ink} stroke-width={3} stroke-linecap="round" />;
    };
    const ad = Math.atan2(h, w) * R2D;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.dirt} />
        <path d={`M${x0} ${y0}H${x0 + w}V${y0 + h}H${x0}Z`} fill="none" stroke="#fff" stroke-width={2.5} stroke-dasharray="7 6" opacity={0.85} />
        <Rope pts={[c[0], c[2]]} w={3} c={K.action} />
        <Rope pts={[c[1], c[3]]} w={3} c={K.action} />
        {tick(mid1, ad)}
        {tick(mid2, 180 - ad)}
        {c.map((p, i) => <StakeTop key={i} x={p[0]} y={p[1]} r={7} />)}
        <Label x={160} y={y0 + h / 2} text="=" size={20} bg={K.white} />
        <Ok x={290} y={214} r={15} />
      </Scene2>
    );
  },

  /* ─────────── ŞAKUL, HORTUM, A-TERAZİSİ ─────────── */
  'sf-bt-sakul-duvar': () => {
    const gy = 206, wx = 214, top = 52;
    const sx = wx - 22;
    const p: PersonProps = { ...CAST.usta, x: 132, y: 228, s: 1.05, pose: { ...POSE.standSide, armF: { to: [sx - 2, top + 4] }, armB: [80, 60], handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* duvar (kesit) */}
        <OG sh={[{ d: rrect(wx, top, 70, gy - top + 12, 2), f: '#d9c3a5' }]} />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${wx} ${top + 20 + i * 20}H${wx + 70}M${wx + (i % 2 ? 22 : 46)} ${top + i * 20}v20`} stroke={shade('#d9c3a5', 0.25)} stroke-width={1.4} />)}
        <Person {...p} />
        <path d={`M${sx} ${top + 4}V${gy - 2}`} stroke={K.out} stroke-width={1.8} />
        <OG sh={[{ d: `M${sx - 7} ${gy - 2}H${sx + 7}L${sx} ${gy + 12}Z`, f: M.iron }]} />
        <Dim a={[sx + 2, top + 26]} b={[wx - 1, top + 26]} w={2.4} />
        <Dim a={[sx + 2, gy - 22]} b={[wx - 1, gy - 22]} w={2.4} />
        <Label x={wx - 11} y={top + 92} text="=" size={16} bg={K.white} />
      </Scene2>
    );
  },

  'sf-bt-hortum-terazi': () => {
    // Şeffaf hortum; iki uçtaki su seviyesi aynı yükseklikte (zemin eğimli).
    const lvl = 74;
    const lx = 62, rx = 262;
    const hose = smooth([[lx, 40], [lx, 150], [lx + 10, 196], [120, 210], [200, 186], [rx - 8, 160], [rx, 120], [rx, 46]]);
    return (
      <Scene2 bg="outdoor" gy={200}>
        <path d="M0 214L320 160V240H0Z" fill={K.grass} stroke={shade(K.grass, 0.15)} stroke-width={2} />
        <OG sh={[{ d: rrect(lx - 20, 30, 8, 186, 2), f: K.wood }, { d: rrect(rx + 12, 30, 8, 152, 2), f: K.wood }]} />
        <path d={hose} fill="none" stroke={K.out} stroke-width={12} stroke-linecap="round" />
        <path d={hose} fill="none" stroke="#e6f3fb" stroke-width={9} stroke-linecap="round" />
        <path d={hose} fill="none" stroke={K.water} stroke-width={7} stroke-dasharray={`0 0`} opacity={0} />
        {/* su: alt kısım dolu, uçlarda seviye */}
        <clipPath id="sfbt-hortum-su"><rect x={0} y={lvl} width={320} height={240} /></clipPath>
        <path d={hose} fill="none" stroke="#3a9be0" stroke-width={7} stroke-linecap="round" clip-path="url(#sfbt-hortum-su)" />
        <path d={`M${lx - 30} ${lvl}H${rx + 30}`} stroke={K.action} stroke-width={3} stroke-dasharray="8 6" />
        {/* bağlar */}
        {[[lx, 60], [lx, 130], [rx, 70], [rx, 130]].map(([x, y], i) => <path key={i} d={`M${x < 160 ? x - 14 : x + 6} ${y}H${x < 160 ? x - 2 : x + 16}`} stroke={K.out} stroke-width={3} />)}
      </Scene2>
    );
  },

  'sf-bt-a-terazisi': () => {
    const ap: P = [160, 34], lf: P = [70, 206], rf: P = [250, 206];
    const cy = 128;
    const at = (f: P, y: number): P => [ap[0] + ((f[0] - ap[0]) * (y - ap[1])) / (f[1] - ap[1]), y];
    const cl = at(lf, cy), cr = at(rf, cy);
    return (
      <Scene2 bg="outdoor" gy={206}>
        <Rod a={ap} b={lf} w={9} c={M.woodL} />
        <Rod a={ap} b={rf} w={9} c={M.woodL} />
        <Rod a={[cl[0] - 10, cy]} b={[cr[0] + 10, cy]} w={9} c={M.woodL} />
        <path d={`M160 ${cy - 7}V${cy + 7}`} stroke={K.danger} stroke-width={3} />
        <path d={`M${ap[0]} ${ap[1]}V172`} stroke={K.out} stroke-width={1.8} />
        <OG sh={[{ d: circ(ap, 6), f: M.iron }]} />
        <Stone x={160} y={186} w={18} h={15} c="#8e8a82" />
        <Ok x={226} y={70} r={15} />
      </Scene2>
    );
  },

  /* ─────────── HARİTA ─────────── */
  'sf-bt-harita-kuzey-olcek': () => (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill="#b98b5e" />
      <Paper x={30} y={18} w={262} h={204} />
      {/* başlık satırları */}
      <path d="M48 42H150M48 56H120" stroke={K.ink} stroke-width={3} stroke-linecap="round" opacity={0.6} />
      {/* kuzey oku */}
      <OG sh={[{ d: 'M248 40L262 92L248 82L234 92Z', f: K.ink }, { d: 'M248 40L262 92L248 82Z', f: '#fff', ln: true }]} />
      <T x={248} y={112} t="K" size={18} />
      {/* çizgi ölçek */}
      <g>
        <OG sh={[{ d: rrect(56, 170, 180, 12, 0), f: '#fff' }]} />
        {[0, 2].map((i) => <rect key={i} x={56 + i * 45} y={170} width={45} height={12} fill={K.ink} />)}
        <T x={56} y={202} t="0" size={13} />
        <T x={236} y={202} t="100 m" size={13} />
      </g>
      {/* ince taslak yollar */}
      <path d="M70 140Q120 100 170 120T230 96" stroke="#7a8b9a" stroke-width={2} fill="none" stroke-dasharray="5 4" />
      <Pencil x={238} y={176} a={120} l={84} />
    </Scene2>
  ),

  'sf-bt-harita-kesisim': () => {
    // A ve B noktalarından tepeye nişan; çizgiler tepede kesişir.
    const A: P = [60, 200], B: P = [250, 206], H: P = [150, 64];
    const ext = (p: P, q: P, k: number): P => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#b98b5e" />
        <Paper x={14} y={12} w={292} h={216} />
        <path d="M30 150Q90 130 140 160T300 140" stroke="#9db7c9" stroke-width={5} fill="none" opacity={0.7} />
        <Dash a={A} b={ext(A, H, 1.18)} w={3.4} />
        <Dash a={B} b={ext(B, H, 1.18)} w={3.4} />
        {/* tepe simgesi */}
        <OG sh={[{ d: `M${H[0] - 26} ${H[1] + 14}L${H[0]} ${H[1] - 18}L${H[0] + 26} ${H[1] + 14}Z`, f: '#9b7b55' }, { d: `M${H[0] - 8} ${H[1] - 8}L${H[0]} ${H[1] - 18}L${H[0] + 8} ${H[1] - 8}Z`, f: '#fff', no: true }]} />
        <circle cx={H[0]} cy={H[1]} r={5} fill={K.danger} stroke={K.out} stroke-width={1.5} />
        {[A, B].map((p, i) => (
          <g key={i}>
            <path d={`M${p[0]} ${p[1]}V${p[1] - 30}`} stroke={K.out} stroke-width={2.5} />
            <OG sh={[{ d: `M${p[0]} ${p[1] - 30}L${p[0] + 20} ${p[1] - 24}L${p[0]} ${p[1] - 18}Z`, f: '#3d7ad6' }]} />
            <circle cx={p[0]} cy={p[1]} r={4} fill={K.ink} />
            <T x={p[0] - 12} y={p[1] + 4} t={i ? 'B' : 'A'} size={15} anchor="end" />
          </g>
        ))}
      </Scene2>
    );
  },

  'sf-bt-harita-isaretler': () => (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill="#b98b5e" />
      <Paper x={12} y={12} w={296} h={216} />
      {/* dere ve köprü */}
      <path d="M150 14Q140 70 160 110T150 226" stroke="#7fb7e0" stroke-width={10} fill="none" />
      <OG sh={[{ d: rrect(138, 96, 34, 12, 2), f: '#8a6a45' }]} />
      {/* patika */}
      <path d="M30 104H138M172 102Q200 98 214 70" stroke={K.ink} stroke-width={2.5} stroke-dasharray="6 5" fill="none" />
      {/* tarla */}
      <OG sh={[{ d: rrect(30, 140, 70, 46, 2), f: '#cfe3b0' }]} />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${36 + i * 13} 146V180`} stroke="#6c9c5a" stroke-width={2} />)}
      {/* çeşme (damla) */}
      <OG sh={[{ d: 'M60 40C60 40 46 58 46 66A14 14 0 0 0 74 66C74 58 60 40 60 40Z', f: K.water }]} />
      {/* heyelan riski: kırmızı tarama */}
      <g>
        <OG sh={[{ d: smooth([[196, 128], [240, 120], [262, 140], [248, 176], [206, 178], [190, 154]], true), f: '#fbdcd8' }]} />
        <clipPath id="sfbt-heyelan"><path d={smooth([[196, 128], [240, 120], [262, 140], [248, 176], [206, 178], [190, 154]], true)} /></clipPath>
        <g clip-path="url(#sfbt-heyelan)" stroke={K.danger} stroke-width={3}>
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${170 + i * 10} 190L${210 + i * 10} 110`} />)}
        </g>
      </g>
      {/* toplanma noktası */}
      <path d="M240 64V30" stroke={K.out} stroke-width={3} />
      <OG sh={[{ d: 'M240 30L268 38L240 48Z', f: K.safe }]} />
      <circle cx={240} cy={64} r={4} fill={K.ink} />
      {/* açıklama kutusu */}
      <OG sh={[{ d: rrect(30, 196, 260, 24, 3), f: '#fffdf6' }]} />
      <g>
        <path d="M44 201C44 201 38 209 38 212A6 6 0 0 0 50 212C50 209 44 201 44 201Z" fill={K.water} />
        <path d="M66 208h22" stroke={K.ink} stroke-width={2.5} stroke-dasharray="5 4" />
        <rect x={104} y={203} width={18} height={10} fill="#8a6a45" />
        <rect x={140} y={202} width={20} height={12} fill="#cfe3b0" stroke="#6c9c5a" />
        <rect x={178} y={202} width={20} height={12} fill="#fbdcd8" stroke={K.danger} stroke-width={2} />
        <path d="M222 216V200L236 204L222 208" fill={K.safe} stroke={K.out} stroke-width={1.5} />
      </g>
    </Scene2>
  ),

  /* ─────────── YÜKSEKLİK ─────────── */
  'sf-bt-yukseklik-cubuk': () => {
    const gy = 196, x = 110, h = 96;
    const sh = h * 1.5;
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <Sun x={28} y={46} r={14} />
        <path d={`M${x} ${gy - h}L${x + sh} ${gy}`} stroke="#f2b31c" stroke-width={2.5} stroke-dasharray="6 5" />
        <path d={`M${x} ${gy + 1}H${x + sh}`} stroke="#4a3a2a" stroke-width={8} opacity={0.55} stroke-linecap="round" />
        <OG sh={[{ d: rrect(x - 4, gy - h, 8, h + 4, 2), f: M.woodL }]} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${x - 4} ${gy - h + (i + 1) * (h / 10)}h4`} stroke="#5b3d22" stroke-width={1.6} />)}
        {/* şakul */}
        <path d={`M${x - 4} ${gy - h + 6}H${x - 16}V${gy - 24}`} stroke={K.out} stroke-width={1.6} fill="none" />
        <OG sh={[{ d: `M${x - 21} ${gy - 24}H${x - 11}L${x - 16} ${gy - 12}Z`, f: M.iron }]} />
        <Dim a={[x, gy + 20]} b={[x + sh, gy + 20]} />
        <Label x={x - 40} y={gy - h / 2} text="1 m" size={15} />
      </Scene2>
    );
  },

  'sf-bt-yukseklik-golgeler': () => {
    // Güneş ışınları paralel: ağaç / gölgesi = çubuk / gölgesi.
    const gy = 196;
    const tx = 52, th = 132, tsh = th * 1.35;
    const sx = 238, sh = 40, ssh = sh * 1.35;
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <path d={`M${tx} ${gy + 2}H${tx + tsh}`} stroke="#4a3a2a" stroke-width={9} opacity={0.5} stroke-linecap="round" />
        <path d={`M${sx} ${gy + 2}H${sx + ssh}`} stroke="#4a3a2a" stroke-width={9} opacity={0.5} stroke-linecap="round" />
        <Tree x={tx} y={gy} s={th / 112} />
        <path d={`M${tx} ${gy - th}L${tx + tsh} ${gy}`} stroke="#f2b31c" stroke-width={2.5} stroke-dasharray="6 5" />
        <path d={`M${sx} ${gy - sh}L${sx + ssh} ${gy}`} stroke="#f2b31c" stroke-width={2.5} stroke-dasharray="6 5" />
        <OG sh={[{ d: rrect(sx - 3, gy - sh, 6, sh + 3, 2), f: M.woodL }]} />
        <Dim a={[tx, gy + 22]} b={[tx + tsh, gy + 22]} />
        <Dim a={[sx, gy + 22]} b={[sx + ssh, gy + 22]} />
        <Sun x={22} y={28} r={12} />
      </Scene2>
    );
  },

  'sf-bt-yukseklik-45-ucgen': () => {
    // Göz hizasından 45° nişan: ağaca uzaklık + göz yüksekliği = ağaç boyu.
    const gy = 222;
    const p0: PersonProps = { ...CAST.usta, x: 70, y: gy, s: 0.62, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(p0);
    const eye: P = [r0.head[0] + 5 * 0.62, r0.head[1] - 1];
    const L = 18;
    const p: PersonProps = { ...p0, pose: { ...POSE.standSide, armF: { to: [eye[0] + L * 0.55, eye[1] + 3] }, armB: [95, 100], handF: 'fist', face: 'neutral' } };
    const D = eye[1] - 22;
    const tx = eye[0] + D;
    const topY = eye[1] - D;
    const tri = `M${f1(eye[0] + 3)} ${f1(eye[1])}H${f1(eye[0] + 3 + L)}V${f1(eye[1] - L)}Z`;
    return (
      <Scene2 bg="outdoor" gy={200}>
        <Tree x={tx} y={gy} s={(gy - topY) / 112} kind="pine" />
        <Dash a={eye} b={[tx, topY]} w={3} />
        <Person {...p} />
        <OG sh={[{ d: tri, f: '#fff' }]} ow={1.2} />
        <Dim a={[eye[0], gy + 8]} b={[tx - 3, gy + 8]} w={2.6} />
        <Dim a={[eye[0] - 20, eye[1]]} b={[eye[0] - 20, gy]} w={2.6} />
        <Label x={eye[0] + 44} y={eye[1] - 14} text="45°" size={13} />
      </Scene2>
    );
  },

  /* ─────────── KAYIT ─────────── */
  'sf-bt-kayit-uc-defter': () => (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill="#a8774d" />
      {[48, 120, 190].map((yy) => <path key={yy} d={`M0 ${yy}H320`} stroke="#94683f" stroke-width={2} />)}
      <Notebook x={18} y={58} w={88} h={118} c="#c6574e" a={-4}><IcoCal x={66} y={117} s={1.4} /></Notebook>
      <Notebook x={116} y={52} w={88} h={118} c="#3d7ad6" a={1}><IcoSack x={164} y={111} s={1.5} /></Notebook>
      <Notebook x={214} y={58} w={88} h={118} c="#6c9c5a" a={4}><IcoPeople x={262} y={117} s={1.3} /></Notebook>
    </Scene2>
  ),

  'sf-bt-kayit-duzeltme': () => (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill="#a8774d" />
      <Paper x={16} y={14} w={288} h={212} />
      {[48, 92, 136, 180].map((yy) => <path key={yy} d={`M26 ${yy}H294`} stroke={M.paperLine} stroke-width={1.5} />)}
      <path d="M70 20V220" stroke="#e7a1a1" stroke-width={1.5} />
      {/* doğru düzeltme */}
      <IcoSack x={46} y={72} s={0.9} />
      <T x={110} y={82} t="12" size={26} weight={600} fill="#2b3a6b" />
      <path d="M92 74H130" stroke="#2b3a6b" stroke-width={2.5} />
      <T x={160} y={82} t="15" size={26} weight={600} fill="#2b3a6b" />
      <T x={204} y={80} t="AY" size={15} weight={600} fill="#2b3a6b" />
      <Ok x={268} y={70} r={15} />
      {/* kazınmış / karalanmış */}
      <IcoSack x={46} y={160} s={0.9} />
      <path d={smooth([[90, 160], [104, 148], [110, 168], [122, 150], [128, 170], [140, 152], [146, 166], [158, 150], [164, 170], [170, 158]])} stroke="#2b3a6b" stroke-width={4} fill="none" />
      <path d="M96 152L168 168M96 168L168 150" stroke="#2b3a6b" stroke-width={3} />
      <OG sh={[{ d: ell([200, 160], 14, 10), f: '#efe6d0' }]} ow={1} />
      <Bad x={268} y={158} r={15} />
    </Scene2>
  ),

  'sf-bt-kayit-iki-kisi': () => {
    // İki kişi sayıyor: biri raftaki çuvalları tek tek gösteriyor, öbürü panoya yazıyor.
    const a: PersonProps = { ...CAST.katip2, x: 62, y: 228, s: 1.0, pose: { ...POSE.stand, armF: { to: [132, 100] }, handF: 'mitten', face: 'neutral' } };
    const b: PersonProps = { ...CAST.katip, x: 274, y: 230, s: 1.0, flip: true, pose: { ...POSE.standSide, armB: { to: [232, 152] }, armF: { to: [238, 128] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const bc: P = [226, 132];
    return (
      <Scene2 bg="indoor" wall="#e4d6bd">
        <Shelf x={104} y={40} w={132} h={150} n={3} />
        {[0, 1, 2].map((row) => [0, 1, 2].map((i) => <Sack key={row + '-' + i} x={132 + i * 38} y={82 + row * 50} s={0.85} />))}
        <Person {...a} />
        <Person {...b} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <g transform={`rotate(-12 ${bc[0]} ${bc[1]})`}>
          <OG sh={[{ d: rrect(bc[0] - 17, bc[1] - 23, 34, 46, 3), f: '#3d7ad6' }, { d: rrect(bc[0] - 13, bc[1] - 18, 26, 37, 1), f: '#fbf6e9' }, { d: rrect(bc[0] - 7, bc[1] - 26, 14, 6, 2), f: M.iron }]} />
          {[0, 1, 2, 3].map((i) => <Scribble key={i} x={bc[0] - 9} y={bc[1] - 10 + i * 7} w={i === 3 ? 10 : 18} op={0.55} />)}
        </g>
        <Person {...b} only={['armF']} />
        <Pencil x={222} y={133} a={160} l={32} />
      </Scene2>
    );
  },

  /* ─────────── OKUMA-YAZMA ─────────── */
  'sf-bt-okuma-ses': () => {
    const t: PersonProps = { ...CAST.ogretmen, x: 92, y: 228, s: 1.05, pose: { ...POSE.standSide, armF: { at: 'mouth', d: [10, 4] }, handF: { shape: 'mitten', a: -60 }, face: 'speak' } };
    const c: PersonProps = { ...CAST.ogrenci, x: 238, y: 228, s: 1.15, flip: true, pose: { ...POSE.standSide, face: 'speak' } };
    const rt = rig(t);
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(118, 26, 92, 84, 4), f: '#2f5a46' }, { d: rrect(122, 30, 84, 76, 2), f: '#376a52', no: true }]} />
        <T x={164} y={94} t="e" size={72} fill="#fff" weight={600} />
        <Person {...t} />
        <Person {...c} />
        <Bubble x={rt.mouth[0] + 14} y={112} w={64} h={34} tail={[rt.mouth[0] + 8, rt.mouth[1] - 2]} text="eee" />
      </Scene2>
    );
  },

  'sf-bt-okuma-hece': () => {
    const card = (x: number, y: number, t: string, w = 70) => (
      <g>
        <OG sh={[{ d: rrect(x, y, w, 86, 8), f: '#fbf6e9' }]} />
        <T x={x + w / 2} y={y + 62} t={t} size={56} fill={K.ink} weight={600} />
      </g>
    );
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#2f5a46" />
        {card(18, 30, 'e')}
        <T x={113} y={86} t="+" size={34} fill="#fff" />
        {card(130, 30, 'l')}
        <Arrow from={[160, 126]} to={[160, 150]} w={5} />
        <Arrow from={[90, 126]} to={[132, 152]} w={5} />
        {card(108, 146, 'el', 104)}
      </Scene2>
    );
  },

  'sf-bt-okuma-kum-tepsi': () => {
    const h0 = { x: 0, y: 0, a: -50, s: 1.15, pose: 'point' as const, side: 'R' as const };
    const o = handPoint(h0, 'tip');
    const tip: P = [234, 126];
    const h = { ...h0, x: tip[0] - o[0], y: tip[1] - o[1] };
    const groove = (d: string) => (
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d={d} stroke="#b39466" stroke-width={9} />
        <path d={d} stroke="#9c7c50" stroke-width={4} />
      </g>
    );
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#a8774d" />
        <OG sh={[{ d: rrect(14, 16, 292, 208, 8), f: K.wood }, { d: rrect(26, 28, 268, 184, 4), f: '#e2c99a', ln: true }]} />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={34 + ((i * 53) % 256)} cy={36 + ((i * 37) % 168)} r={1.2} fill="#c9ab78" />)}
        {/* "e" */}
        {groove('M58 110H102A22 22 0 1 0 96 126')}
        {/* "l" */}
        {groove('M134 62V132')}
        {/* "a" (yazılmakta) */}
        {groove('M232 100A20 20 0 1 0 232 118M232 92V126')}
        <Hand {...h} arm={80} sleeve={K.role.bystander2} skin={HANDSKIN.ogrenci} />
      </Scene2>
    );
  },

  /* ─────────── ARİTMETİK ─────────── */
  'sf-bt-aritmetik-demet': () => {
    const stick = (x: number, y: number, a: number, l = 120) => (
      <g transform={`rotate(${a} ${x} ${y})`}><OG sh={[{ d: rrect(x - 3.5, y - l, 7, l, 3), f: '#d9a76a' }]} ow={1.2} /></g>
    );
    const bundle = (cx: number) => (
      <g>
        {Array.from({ length: 10 }, (_, i) => stick(cx - 22 + i * 4.9, 196, (i - 4.5) * 2.4))}
        <OG sh={[{ d: rrect(cx - 30, 128, 60, 10, 4), f: K.danger }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {bundle(70)}
        {bundle(150)}
        {[220, 244, 268].map((x) => <g key={x}>{stick(x, 196, 0)}</g>)}
        <Label x={160} y={30} text="23" size={22} />
        <T x={70} y={222} t="10" size={16} />
        <T x={150} y={222} t="10" size={16} />
        <T x={244} y={222} t="3" size={16} />
      </Scene2>
    );
  },

  'sf-bt-aritmetik-carpma': () => {
    const x0 = 34, x1 = 286, y0 = 28, rows = 10, dy = 15.5;
    const bw = 15;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(x0 - 12, y0 - 12, x1 - x0 + 24, rows * dy + 16, 6), f: K.wood }, { d: rrect(x0, y0 - 2, x1 - x0, rows * dy - 4, 2), f: '#f6efe0', ln: true }]} />
        {Array.from({ length: rows }, (_, r) => {
          const y = y0 + 5 + r * dy;
          const left = r < 6 ? 7 : 0;
          return (
            <g key={r}>
              <path d={`M${x0} ${y}H${x1}`} stroke="#6f7782" stroke-width={1.6} />
              {Array.from({ length: 10 }, (_, i) => {
                const onLeft = i < left;
                const bx = onLeft ? x0 + 10 + i * bw : x1 - 10 - (9 - i) * bw;
                return <OG key={i} sh={[{ d: ell([bx, y], 7, 6.4), f: onLeft ? K.action : '#c9b48e' }]} ow={1.1} />;
              })}
            </g>
          );
        })}
        <Dim a={[x0 + 2, y0 + rows * dy + 14]} b={[x0 + 18 + 6 * bw, y0 + rows * dy + 14]} w={2.4} />
        <path d={`M${x0 - 4} ${y0 + 1}V${y0 + 5 + 5 * dy + 4}`} stroke={K.action} stroke-width={3} />
        <Label x={210} y={210} text="6 × 7 = 42" size={17} />
        <T x={x0 + 10 + 3 * bw} y={y0 + rows * dy + 34} t="7" size={14} />
      </Scene2>
    );
  },

  'sf-bt-aritmetik-paylastirma': () => {
    const baskets: P[] = [[62, 64], [258, 64], [62, 182], [258, 182]];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#a8774d" />
        <OG sh={[{ d: rrect(10, 10, 300, 220, 10), f: '#c99a66' }]} />
        {baskets.map(([bx, by], i) => (
          <g key={i}>
            <OG sh={[{ d: ell([bx, by], 46, 34), f: '#b98a4e' }, { d: ell([bx, by], 38, 27), f: '#8a6436', ln: true }]} />
            {[[-18, -8, 10], [0, -12, -8], [18, -6, 14], [-10, 10, -14], [12, 10, 6]].map(([dx, dy, a], k) => <Bread key={k} x={bx + dx} y={by + dy} a={a} />)}
          </g>
        ))}
        <Label x={160} y={123} text="20 ÷ 4 = 5" size={17} bg={K.white} />
        <Arrow from={[124, 104]} to={[104, 88]} w={4} />
        <Arrow from={[196, 104]} to={[216, 88]} w={4} />
        <Arrow from={[124, 142]} to={[104, 158]} w={4} />
        <Arrow from={[196, 142]} to={[216, 158]} w={4} />
      </Scene2>
    );
  },

  /* ─────────── BİLGİYİ KORUMA ─────────── */
  'sf-bt-bilgi-uc-kopya': () => {
    const doc = (x: number, y: number, s = 1) => (
      <G x={x} y={y} s={s}>
        <OG ow={OW / s} sh={[{ d: rrect(-18, -24, 36, 48, 2), f: M.paper }]} />
        {[-12, -4, 4, 12].map((yy) => <path key={yy} d={`M-11 ${yy}H11`} stroke={K.ink} stroke-width={2 / s} opacity={0.55} />)}
      </G>
    );
    return (
      <Scene2 bg="outdoor" gy={176}>
        {/* ev 1 (sol) */}
        <HouseExt x={14} y={226} w={84} h={58} />
        {/* kaya sığınağı (orta, arkada) */}
        <OG sh={[{ d: 'M112 176Q118 120 160 112Q204 118 212 176Z', f: '#a5a39c' }, { d: 'M144 176Q146 150 160 148Q174 150 176 176Z', f: '#4d4a44' }]} />
        {/* başka köydeki ev (sağ, uzak tepe) */}
        <HouseExt x={236} y={150} w={64} h={44} color="#e8d2b8" roof="#8a5a3c" />
        {doc(160, 214, 1.2)}
        <Arrow from={[136, 206]} to={[92, 198]} w={5} />
        <Arrow from={[160, 184]} to={[160, 164]} w={5} />
        <Arrow from={[184, 204]} to={[246, 156]} w={5} />
        {doc(56, 160, 0.55)}
        {doc(160, 166, 0.5)}
        {doc(268, 100, 0.5)}
      </Scene2>
    );
  },

  'sf-bt-bilgi-karsilastirma': () => {
    // Biri aslını yüksek sesle okuyor (elinde), öbürü masadaki kopyada parmağıyla takip ediyor.
    const gy = 200;
    const tableTop = 158;
    const a: PersonProps = { ...CAST.katip, x: 78, y: 232, s: 1.0, pose: { ...POSE.standSide, armB: { to: [124, 140] }, armF: { to: [120, 150] }, handB: 'fist', handF: 'fist', face: 'speak' } };
    const b: PersonProps = { ...CAST.katip2, x: 236, y: 232, s: 1.0, flip: true, pose: { ...POSE.standSide, spine: -82, head: -64, armF: { to: [206, tableTop - 3] }, handF: 'mitten', face: 'neutral' } };
    const ra = rig(a);
    const pc: P = [130, 134];
    return (
      <Scene2 bg="indoor" gy={gy}>
        <Person {...a} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <g transform={`rotate(8 ${pc[0]} ${pc[1]})`}>
          <Paper x={pc[0] - 16} y={pc[1] - 24} w={32} h={44} />
          {[0, 1, 2, 3].map((i) => <Scribble key={i} x={pc[0] - 10} y={pc[1] - 14 + i * 8} w={i === 3 ? 12 : 20} op={0.5} />)}
        </g>
        <Person {...a} only={['armF']} />
        <Person {...b} />
        <OG sh={[{ d: rrect(20, tableTop, 280, 12, 3), f: K.wood }, { d: rrect(26, tableTop + 12, 268, 70, 2), f: shade(K.wood, 0.12) }]} />
        <OG sh={[{ d: `M176 ${tableTop - 1}L184 ${tableTop - 7}H250L244 ${tableTop - 1}Z`, f: M.paper }]} ow={1.2} />
        <Waves x={ra.mouth[0] + 10} y={ra.mouth[1] - 4} a={-10} n={3} r={7} />
      </Scene2>
    );
  },

  'sf-bt-bilgi-sandik': () => {
    const gy = 206;
    return (
      <Scene2 bg="indoor" gy={gy} wall="#e4d6bd">
        {/* taş ayaklar */}
        {[52, 180].map((x) => <Stone key={x} x={x} y={gy + 6} w={40} h={26} />)}
        {/* sandık gövdesi */}
        <OG sh={[{ d: rrect(24, 108, 186, 76, 3), f: '#9a6438' }, { d: rrect(34, 116, 166, 60, 2), f: '#5a3a22', ln: true }]} />
        {/* düz istif kâğıtlar */}
        {[0, 1, 2, 3, 4].map((i) => <OG key={i} sh={[{ d: rrect(44, 164 - i * 8, 146, 8, 1), f: i % 2 ? '#fbf6e9' : '#f1e8d2' }]} ow={1} />)}
        {/* açık kapak */}
        <OG sh={[{ d: `M24 108L36 44H218L210 108Z`, f: '#a86f40' }, { d: `M36 100L46 54H204L198 100Z`, f: '#b97d4b', no: true }]} />
        {/* katlanmış, bantlı kâğıt */}
        <OG sh={[{ d: 'M236 196L246 150L292 160L282 206Z', f: '#fbf6e9' }, { d: 'M241 173L287 183', st: K.out, sw: 1.5 }, { d: 'M254 152L262 156L252 202L244 198Z', f: '#e9d78a', op: 0.9 }]} />
        <No x={264} y={178} r={34} />
      </Scene2>
    );
  },

  /* ─────────── PMR446 ─────────── */
  'sf-bt-pmr-plan-etiketi': () => (
    <Scene2 bg="closeup">
      <G x={160} y={226} s={1}>
        <OG sh={[
          { d: rrect(42, -232, 18, 80, 8), f: '#262c35' },
          { d: rrect(-74, -170, 148, 168, 18), f: '#e58a2b' },
          { d: rrect(-60, -156, 120, 140, 10), f: shade('#e58a2b', 0.12), no: true },
          { d: rrect(-86, -130, 12, 40, 3), f: '#262c35' },
        ]} />
        <OG sh={[{ d: rrect(-58, -150, 116, 116, 6), f: '#fff' }]} />
      </G>
      {[['ÇAĞRI', '1', K.danger], ['GÖRÜŞ', '3', K.water], ['YEDEK', '5', K.safe]].map(([t, n, c], i) => (
        <g key={i}>
          <rect x={110} y={88 + i * 36} width={8} height={24} rx={2} fill={c} />
          <T x={124} y={106 + i * 36} t={t} size={15} anchor="start" />
          <T x={204} y={107 + i * 36} t={n} size={20} anchor="end" />
        </g>
      ))}
    </Scene2>
  ),

  'sf-bt-pmr-konusma': () => {
    const p: PersonProps = { ...CAST.telsizci, x: 104, y: 98, ax: 'head', ay: 'head', s: 2.1, pose: { ...POSE.standSide, armF: { to: [200, 168] }, armB: [95, 95], handF: 'fist', face: 'speak' } };
    const r = rig(p);
    const wx = 206;
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head', 'armB', 'armF']} mid={() => <Walkie x={wx} y={196} s={1.25} />} />
        <Dim a={[r.mouth[0] + 8, r.mouth[1]]} b={[wx - 18, r.mouth[1]]} w={2.6} />
        <Waves x={wx + 20} y={64} a={-60} n={3} r={7} />
        <Label x={250} y={200} text="1 karış" size={14} />
      </Scene2>
    );
  },

  'sf-bt-pmr-tepe': () => {
    const A: P = [70, 70];
    const B: P = [284, 118];
    const C: P = [252, 202];
    const mk = (who: any, x: number, y: number, s: number, flip?: boolean) => <Person {...who} x={x} y={y} s={s} flip={flip} pose={{ ...POSE.standSide, armF: { at: 'mouth', d: [8, 8] }, handF: 'fist', face: 'neutral' }} />;
    return (
      <Scene2 bg="outdoor" gy={210}>
        <Hill x={70} w={220} top={96} c="#a9cf86" />
        <Hill x={290} w={150} top={140} c="#b4d792" />
        {[120, 150, 205, 135].map((x, i) => <Tree key={i} x={x} y={226 - (i % 2) * 8} s={0.55} kind="pine" />)}
        {/* bina */}
        <OG sh={[{ d: rrect(176, 134, 52, 84, 2), f: '#e3d6c2' }, { d: 'M170 136L202 112L234 136Z', f: '#c2583e' }]} />
        <Dash a={[A[0] + 8, A[1] - 6]} b={[B[0] - 6, B[1] - 14]} w={3.4} />
        <Dash a={[A[0] + 8, A[1] - 6]} b={[C[0] - 6, C[1] - 18]} w={3} color={K.danger} />
        {mk(CAST.telsizci, A[0], 98, 0.42)}
        {mk(CAST.telsizci2, B[0], 142, 0.38, true)}
        {mk(CAST.telsizci2, C[0], 224, 0.38, true)}
        <Bad x={200} y={160} r={12} />
        <Ok x={200} y={70} r={12} />
      </Scene2>
    );
  },

  /* ─────────── AMATÖR ─────────── */
  'sf-bt-amator-istasyon': () => {
    const tableTop = 150;
    const p: PersonProps = { ...CAST.telsizci, x: 108, y: 232, s: 1.0, pose: { ...POSE.stand, armB: { to: [86, tableTop - 2] }, armF: { to: [144, 124] }, handF: 'fist', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor" gy={196}>
        <Person {...p} over={(rr) => <Headphones r={rr} />} />
        {/* masa */}
        <OG sh={[{ d: rrect(18, tableTop, 284, 10, 3), f: K.wood }, { d: rrect(24, tableTop + 10, 272, 80, 2), f: shade(K.wood, 0.12) }]} />
        {/* telsiz cihazı */}
        <OG sh={[{ d: rrect(176, 98, 112, 52, 5), f: '#3a4350' }, { d: rrect(184, 106, 56, 18, 2), f: '#cfe6c6', ln: true }, { d: circ([264, 122], 13), f: '#262c35', ln: true }, { d: circ([264, 122], 5), f: '#8a919c', ln: true }]} />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={190 + i * 13} cy={138} r={4} fill="#8a919c" stroke={K.out} stroke-width={1} />)}
        {/* masa mikrofonu */}
        <OG sh={[{ d: rrect(138, tableTop - 6, 20, 6, 2), f: '#262c35' }, { d: 'M148 144L146 128', st: K.out, sw: 3 }, { d: rrect(138, 108, 18, 22, 7), f: '#3d4250' }]} />
        {/* defter */}
        <OG sh={[{ d: rrect(40, tableTop - 6, 56, 8, 1), f: '#fbf6e9' }]} ow={1.2} />
        {/* akü */}
        <OG sh={[{ d: rrect(240, 196, 52, 34, 3), f: '#2e3138' }, { d: rrect(246, 190, 10, 6, 1), f: K.danger }, { d: rrect(276, 190, 10, 6, 1), f: '#262c35' }]} />
        <path d="M266 190Q270 160 260 152" stroke={K.danger} stroke-width={2.5} fill="none" />
        <Waves x={r.head[0] + 30} y={r.head[1] - 40} a={-40} n={3} r={6} />
      </Scene2>
    );
  },

  'sf-bt-amator-defter': () => {
    const cols = [44, 108, 162, 226];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#a8774d" />
        <Paper x={16} y={14} w={288} h={212} />
        <path d="M26 64H294" stroke={K.ink} stroke-width={2} />
        {cols.slice(1).map((x) => <path key={x} d={`M${x - 22} 22V218`} stroke={M.paperLine} stroke-width={1.5} />)}
        <IcoCal x={cols[0] + 6} y={42} s={0.95} />
        <g>
          <circle cx={cols[1] + 4} cy={42} r={13} fill="#fff" stroke={K.out} stroke-width={1.6} />
          <path d={`M${cols[1] + 4} 34V42L${cols[1] + 10} 46`} stroke={K.action} stroke-width={2.4} fill="none" stroke-linecap="round" />
        </g>
        <path d={`M${cols[2] - 10} 42q5 -12 10 0t10 0t10 0`} stroke={K.water} stroke-width={3} fill="none" />
        <g>
          <path d={`M${cols[3] + 8} 54V30M${cols[3] + 8} 32L${cols[3]} 24M${cols[3] + 8} 32L${cols[3] + 16} 24`} stroke={K.ink} stroke-width={2.5} fill="none" />
          <Waves x={cols[3] + 18} y={34} n={2} r={5} />
        </g>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <path d={`M26 ${100 + i * 26}H294`} stroke={M.paperLine} stroke-width={1.2} />
            <Scribble x={34} y={90 + i * 26} w={40} c="#2b3a6b" op={0.7} />
            <Scribble x={92} y={90 + i * 26} w={30} c="#2b3a6b" op={0.7} />
            <Scribble x={148} y={90 + i * 26} w={40} c="#2b3a6b" op={0.7} />
            <Scribble x={212} y={90 + i * 26} w={70 - (i % 3) * 12} c="#2b3a6b" op={0.7} />
          </g>
        ))}
      </Scene2>
    );
  },

  'sf-bt-amator-anten': () => {
    const gy = 206;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* doğru anten: direk + V tel */}
        <OG sh={[{ d: rrect(76, 40, 6, gy - 40 + 4, 2), f: M.iron }]} />
        <path d={`M79 44L20 ${gy - 60}M79 44L138 ${gy - 60}`} stroke={K.out} stroke-width={2} />
        {[20, 138].map((x) => <OG key={x} sh={[{ d: rrect(x - 3, gy - 64, 6, 68, 1), f: M.woodL }]} />)}
        <Ok x={110} y={36} r={14} />
        {/* elektrik hattı */}
        <OG sh={[{ d: rrect(282, 30, 9, gy - 30 + 4, 2), f: '#8a6a45' }, { d: rrect(262, 40, 50, 6, 1), f: '#8a6a45' }]} />
        <path d={`M266 40Q220 60 160 52M308 40Q260 66 160 64`} stroke={K.out} stroke-width={2} fill="none" />
        {/* yanlış anten: hattın hemen altında */}
        <OG sh={[{ d: rrect(222, 76, 5, gy - 76 + 4, 2), f: M.iron }]} />
        <path d={`M224 80L190 ${gy - 40}M224 80L258 ${gy - 40}`} stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: 'M236 50L228 62H236L230 74L244 58H236L242 50Z', f: '#ffe36b' }]} ow={1.2} />
        <No x={224} y={120} r={42} />
      </Scene2>
    );
  },

  /* ─────────── MORS ─────────── */
  'sf-bt-mors-zaman': () => {
    // A (.-) | 3 | N (-.) | 7 | E (.)   — birim: nokta
    const u = 13, x0 = 24, y = 112, hh = 22;
    const seq: [number, boolean][] = [[1, true], [1, false], [3, true], [3, false], [3, true], [1, false], [1, true], [7, false], [1, true]];
    let x = x0;
    const els: JSX.Element[] = [];
    const lbl: JSX.Element[] = [];
    seq.forEach(([n, on], i) => {
      if (on) els.push(<rect key={i} x={x} y={y - hh / 2} width={n * u} height={hh} rx={4} fill={K.action} stroke={K.out} stroke-width={1.5} />);
      else lbl.push(<g key={'g' + i}>{n > 1 ? <Dim a={[x + 1, y + 34]} b={[x + n * u - 1, y + 34]} w={2} color="#9dd5f6" /> : <path d={`M${x} ${y + 28}v10M${x + u} ${y + 28}v10M${x} ${y + 34}h${u}`} stroke="#9dd5f6" stroke-width={2} />}<T x={x + (n * u) / 2} y={y + 58} t={String(n)} size={14} fill="#9dd5f6" /></g>);
      x += n * u;
    });
    return (
      <Scene2 bg="dark">
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${x0 + i * u} ${y - 22}V${y + 18}`} stroke="#3c4758" stroke-width={1} />)}
        <path d={`M${x0} ${y}H${x0 + 21 * u}`} stroke="#3c4758" stroke-width={1.5} />
        {els}
        {lbl}
        <T x={x0 + 2.5 * u} y={y - 32} t="A" size={20} fill="#fff" />
        <T x={x0 + 10.5 * u} y={y - 32} t="N" size={20} fill="#fff" />
        <T x={x0 + 20.5 * u} y={y - 32} t="E" size={20} fill="#fff" />
        <T x={x0 + 3.5 * u} y={y + 6} t="3" size={13} fill={K.ink} />
        <T x={x0 + 0.5 * u} y={y - 52} t="" size={1} />
      </Scene2>
    );
  },

  'sf-bt-mors-tablo': () => {
    const codes: [string, string][] = [
      ['A', '.-'], ['B', '-...'], ['C', '-.-.'], ['D', '-..'], ['E', '.'], ['F', '..-.'], ['G', '--.'], ['H', '....'], ['I', '..'],
      ['J', '.---'], ['K', '-.-'], ['L', '.-..'], ['M', '--'], ['N', '-.'], ['O', '---'], ['P', '.--.'], ['Q', '--.-'], ['R', '.-.'],
      ['S', '...'], ['T', '-'], ['U', '..-'], ['V', '...-'], ['W', '.--'], ['X', '-..-'], ['Y', '-.--'], ['Z', '--..'],
    ];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#fbf6e9" />
        {codes.map(([l, c], i) => {
          const col = Math.floor(i / 9), row = i % 9;
          const x = 14 + col * 104, y = 22 + row * 24.5;
          return (
            <g key={l}>
              {row % 2 === 0 && <rect x={x - 4} y={y - 11} width={98} height={22} rx={4} fill="#efe6d0" />}
              <T x={x + 6} y={y + 6} t={l} size={16} />
              <MorseGlyph x={x + 22} y={y} code={c} u={5.4} />
            </g>
          );
        })}
      </Scene2>
    );
  },

  'sf-bt-mors-sos-fener': () => {
    const gy = 206;
    const p: PersonProps = { ...CAST.isaretci, x: 92, y: 228, s: 1.0, pose: { ...POSE.standSide, armF: [-10, -14], armB: [90, 70], handF: 'fist', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.night} />
        {[[30, 20], [290, 210], [200, 30], [120, 16], [300, 120]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={1.4} fill="#f4eccb" opacity={0.6} />)}
        <rect y={gy} width={320} height={34} fill={K.nightGround} />
        <G x={r.handF[0] - 6} y={r.handF[1]} a={-12}>
          <path d="M40 -9L240 -60V60L40 9Z" fill="#fff3b0" opacity={0.4} />
          <OG sh={[{ d: rrect(0, -6, 30, 12, 3), f: '#3d4250' }, { d: 'M28 -7L40 -11V11L28 7Z', f: '#4a505f' }]} />
          <rect x={38} y={-10} width={3} height={20} fill="#fff7c2" />
        </G>
        <Person {...p} />
        <G x={64} y={40}>
          <OG sh={[{ d: rrect(-8, -18, 252, 36, 18), f: '#fbf6e9' }]} />
          <MorseGlyph x={6} y={0} code="...---..." u={9.5} c={K.ink} />
        </G>
      </Scene2>
    );
  },

  /* ─────────── IŞIK-AYNA ─────────── */
  'sf-bt-isik-iki-tepe': () => {
    const A: P = [62, 78], B: P = [262, 90];
    return (
      <Scene2 bg="outdoor" gy={220}>
        <Hill x={50} w={200} top={104} c="#a9cf86" />
        <Hill x={272} w={190} top={116} c="#a9cf86" />
        {[120, 145, 170, 195, 160, 135, 182].map((x, i) => <Tree key={i} x={x} y={232 - (i > 3 ? 0 : 10)} s={0.5} kind="pine" />)}
        <Dash a={[A[0] + 10, A[1] - 2]} b={[B[0] - 10, B[1] - 2]} w={3.4} />
        <Person {...CAST.isaretci} x={A[0]} y={106} s={0.42} pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Person who="man" skin={1} role="bystander3" x={B[0]} y={118} s={0.42} flip pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Ok x={160} y={56} r={13} />
      </Scene2>
    );
  },

  'sf-bt-isik-ayna-nisan': () => {
    // Ayna gözün hemen altında; öbür el V yapıp hedefe uzanır; ışık V'nin arasından hedefe.
    const p0: PersonProps = { ...CAST.isaretci, x: 74, y: 330, s: 1.6, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(p0);
    const eye: P = [r0.head[0] + 6, r0.head[1] - 1];
    const mir: P = [eye[0] + 20, eye[1] + 14];
    const tgt: P = [298, 96];
    const bAng = Math.atan2(tgt[1] - mir[1], tgt[0] - mir[0]) * R2D;
    const vPt = pol(mir, bAng, 150);
    const wr = pol(vPt, bAng, -30);
    const p: PersonProps = { ...p0, pose: { ...POSE.standSide, armF: { to: [mir[0] + 1, mir[1] + 20] }, armB: { to: wr }, handF: 'fist', handB: 'none', face: 'neutral' } };
    const r = rig(p);
    const w = r.wristB;
    const fa = Math.atan2(vPt[1] - w[1], vPt[0] - w[0]) * R2D;
    const sk = K.skin[CAST.isaretci.skin];
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Sun x={26} y={26} r={12} />
        <Hill x={300} w={90} top={102} gy={176} c="#a9cf86" />
        <circle cx={tgt[0]} cy={tgt[1]} r={4} fill={K.ink} />
        <circle cx={tgt[0]} cy={tgt[1]} r={9} fill="#fff7b0" opacity={0.8} />
        <Person {...p} />
        {/* ayna: elin üstünde, gözün hemen altında */}
        <OG sh={[{ d: ell([mir[0], mir[1] + 2], 8, 13), f: '#59616c' }, { d: ell([mir[0], mir[1] + 2], 5.5, 10), f: '#d5ecf8' }]} />
        <path d={`M${f1(mir[0] - 2)} ${f1(mir[1] + 7)}L${f1(mir[0] + 2)} ${f1(mir[1] - 4)}`} stroke="#fff" stroke-width={2.5} stroke-linecap="round" />
        {/* V parmaklar */}
        <OG sh={[
          { d: capsule(pol(w, fa, 12), 4, pol(pol(w, fa, 12), fa - 26, 30), 3.4), f: sk },
          { d: capsule(pol(w, fa, 12), 4, pol(pol(w, fa, 12), fa + 26, 30), 3.4), f: sk },
          { d: capsule(w, 8, pol(w, fa, 12), 7.5), f: sk },
        ]} />
        <path d={`M${f1(mir[0])} ${f1(mir[1])}L${tgt[0]} ${tgt[1]}`} stroke="#fff3b0" stroke-width={7} opacity={0.7} />
        <path d={`M${f1(mir[0])} ${f1(mir[1])}L${tgt[0]} ${tgt[1]}`} stroke="#ffd84a" stroke-width={2.5} />
      </Scene2>
    );
  },

  'sf-bt-isik-gece-fener': () => {
    const gy = 206;
    const lx = 176, ly = 150;
    const p: PersonProps = { ...CAST.isaretci, x: 104, y: 228, s: 1.0, pose: { ...POSE.standSide, armF: { to: [lx + 14, ly - 40] }, armB: [80, 40], handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.night} />
        {[[30, 20], [200, 30], [120, 16], [300, 60], [250, 18]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={1.4} fill="#f4eccb" opacity={0.6} />)}
        <path d="M200 240Q260 120 320 130V240Z" fill="#26332f" />
        <circle cx={292} cy={128} r={10} fill="#ffe680" opacity={0.35} />
        <circle cx={292} cy={128} r={3.5} fill="#fff3b0" />
        <path d="M0 240V196Q120 186 240 206V240Z" fill={K.nightGround} />
        <path d={`M${lx + 12} ${ly - 30}L292 120V136L${lx + 12} ${ly - 12}Z`} fill="#fff3b0" opacity={0.35} />
        <Rod a={[lx, ly]} b={[lx, 214]} w={6} c={K.wood} />
        <Lantern x={lx} y={ly} s={1.1} />
        {/* menteşeli kapak (açık) */}
        <OG sh={[{ d: `M${lx + 14} ${ly - 48}L${lx + 34} ${ly - 46}L${lx + 30} ${ly - 8}L${lx + 14} ${ly - 4}Z`, f: '#7a5a3a' }]} />
        <Person {...p} />
        <MorseGlyph x={30} y={40} code=".-." u={9} c="#fff3b0" />
      </Scene2>
    );
  },

  /* ─────────── DUMAN-SES ─────────── */
  'sf-bt-duman-uc-ates': () => {
    const fires: [number, number, number][] = [[160, 160, 0.75], [76, 214, 1], [244, 214, 1]];
    return (
      <Scene2 bg="outdoor" gy={140}>
        <path d={`M160 160L76 214L244 214Z`} fill="none" stroke="#fff" stroke-width={2.5} stroke-dasharray="6 6" opacity={0.85} />
        {fires.map(([x, y, s], i) => (
          <g key={i}>
            <path d={smooth([[x, y - 30 * s], [x - 8, y - 70 * s], [x + 6, y - 110 * s], [x - 4, y - 150 * s]])} stroke="#9aa1aa" stroke-width={18 * s} fill="none" stroke-linecap="round" opacity={0.75} />
            <Campfire x={x} y={y} s={s} />
          </g>
        ))}
        <Label x={160} y={196} text="3" size={18} />
      </Scene2>
    );
  },

  'sf-bt-duman-can': () => {
    const gy = 206;
    const cx = 214, cy = 64;
    const hit: P = [cx - 22, cy + 56];
    const p: PersonProps = { ...CAST.koylu, x: 112, y: 228, s: 1.0, pose: { ...POSE.standSide, armF: { to: [hit[0] - 30, hit[1] + 8] }, armB: [80, 30], handF: 'fist', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* çatal direk */}
        <OG sh={[{ d: rrect(150, 30, 8, gy - 30 + 4, 2), f: K.wood }, { d: rrect(270, 30, 8, gy - 30 + 4, 2), f: K.wood }, { d: rrect(144, 26, 140, 8, 2), f: K.wood }]} />
        <path d={`M${cx} 34V${cy}`} stroke={K.out} stroke-width={3} />
        <Cylinder x={cx} y={cy} s={1} />
        {/* demir çubuk */}
        <Person {...p} mid={() => <Rod a={[r.handF[0] - 6, r.handF[1] + 6]} b={hit} w={5} c="#59616c" />} />
        <Waves x={cx + 30} y={cy + 46} a={0} n={3} r={9} />
        <Waves x={cx - 12} y={cy + 6} a={-150} n={2} r={9} />
      </Scene2>
    );
  },

  'sf-bt-duman-beyaz': () => {
    const gy = 206;
    const fx = 214;
    const tip: P = [fx - 6, gy - 22];
    const p: PersonProps = { ...CAST.koylu, x: 118, y: 228, s: 1.0, pose: { ...POSE.bend, spine: -42, chest: -30, head: -40, armF: { to: [fx - 52, gy - 46] }, armB: { to: [fx - 60, gy - 40] }, handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d={smooth([[fx, gy - 30], [fx - 14, gy - 80], [fx + 16, gy - 130], [fx - 6, gy - 180], [fx + 20, gy - 230]])} stroke="#f4f6f8" stroke-width={46} fill="none" stroke-linecap="round" />
        <path d={smooth([[fx, gy - 30], [fx - 14, gy - 80], [fx + 16, gy - 130], [fx - 6, gy - 180], [fx + 20, gy - 230]])} stroke="#dfe4ea" stroke-width={22} fill="none" stroke-linecap="round" />
        <Campfire x={fx} y={gy + 10} s={1.2} />
        <Person {...p} mid={() => <LeafyBranch a={[fx - 56, gy - 44]} b={tip} />} />
      </Scene2>
    );
  },

  /* ─────────── ULAK ─────────── */
  'sf-bt-ulak-form': () => {
    const box = (x: number, y: number, w: number, label: string) => (
      <g>
        <T x={x} y={y - 4} t={label} size={11} anchor="start" />
        <OG sh={[{ d: rrect(x, y, w, 22, 2), f: '#fff' }]} ow={1.2} />
      </g>
    );
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#a8774d" />
        <Paper x={16} y={10} w={288} h={220} />
        {box(30, 30, 50, 'NO')}
        {box(96, 30, 80, 'SAAT')}
        {box(30, 74, 124, 'KİMDEN')}
        {box(166, 74, 124, 'KİME')}
        <g>
          <OG sh={[{ d: rrect(194, 30, 16, 16, 2), f: K.danger }]} ow={1.2} />
          <path d="M197 38l4 4l7 -8" stroke="#fff" stroke-width={2.5} fill="none" />
          <T x={214} y={43} t="ACİL" size={12} anchor="start" />
          <OG sh={[{ d: rrect(250, 30, 16, 16, 2), f: '#fff' }]} ow={1.2} />
          <T x={270} y={43} t="NOR." size={11} anchor="start" />
        </g>
        <OG sh={[{ d: rrect(30, 108, 260, 82, 2), f: '#fff' }]} ow={1.2} />
        {[124, 142, 160, 178].map((y, i) => <Scribble key={y} x={40} y={y} w={[220, 190, 230, 120][i]} c="#2b3a6b" op={0.6} />)}
        <path d="M200 212q8 -16 16 -2t14 -6t12 4t12 -6" stroke="#2b3a6b" stroke-width={2.5} fill="none" />
        <path d="M190 216H290" stroke={K.ink} stroke-width={1.2} />
      </Scene2>
    );
  },

  'sf-bt-ulak-geri-okuma': () => {
    // Ulak elindeki mesajı yüksek sesle geri okuyor; mesajı veren kendi kopyasından dinleyip karşılaştırıyor.
    const gy = 228;
    const a: PersonProps = { ...CAST.merkez, x: 80, y: gy, s: 1.0, pose: { ...POSE.standSide, armB: { to: [122, 138] }, armF: { to: [118, 148] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const b: PersonProps = { ...CAST.ulak, x: 240, y: gy, s: 1.05, flip: true, pose: { ...POSE.standSide, armB: { to: [196, 128] }, armF: { to: [200, 138] }, handB: 'fist', handF: 'fist', face: 'speak' } };
    const rb = rig(b);
    const note = (c: P, ang: number) => (
      <g transform={`rotate(${ang} ${c[0]} ${c[1]})`}>
        <Paper x={c[0] - 15} y={c[1] - 20} w={30} h={38} />
        {[0, 1, 2].map((i) => <Scribble key={i} x={c[0] - 9} y={c[1] - 10 + i * 8} w={i === 2 ? 10 : 18} op={0.5} />)}
      </g>
    );
    return (
      <Scene2 bg="outdoor">
        <HouseExt x={-30} y={204} w={70} h={60} />
        <Person {...a} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        {note([124, 128], 8)}
        <Person {...a} only={['armF']} />
        <Person {...b} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        {note([194, 118], -8)}
        <Person {...b} only={['armF']} />
        <Waves x={rb.mouth[0] - 10} y={rb.mouth[1] - 4} a={190} n={3} r={7} />
      </Scene2>
    );
  },

  'sf-bt-ulak-iki-kisi': () => {
    const gy = 196;
    const a: PersonProps = { ...CAST.ulak2, x: 150, y: 216, s: 0.95, pose: { ...POSE.walk, face: 'neutral' } };
    const b: PersonProps = { ...CAST.ulak, x: 200, y: 228, s: 1.0, pose: { ...POSE.walk, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d="M0 236Q140 210 320 214V240H0Z" fill={K.dirt} />
        <Tree x={40} y={200} s={0.8} kind="pine" />
        <Tree x={292} y={200} s={0.7} />
        <Person {...a} over={(r) => <Armband r={r} />} />
        <Person {...b} back={(r) => (
          <g>
            <path d={`M${r.shoulderF[0] - 4} ${r.shoulderF[1]}L${r.hip[0] - 14} ${r.hip[1] + 4}`} stroke="#5b3d22" stroke-width={4} />
          </g>
        )} over={(r) => (
          <g>
            <OG sh={[{ d: rrect(r.hip[0] - 30, r.hip[1] - 14, 28, 24, 4), f: '#8a5a3c' }, { d: `M${r.hip[0] - 30} ${r.hip[1] - 6}H${r.hip[0] - 2}`, st: K.out, sw: 1.2 }]} />
            <Armband r={r} />
          </g>
        )} />
      </Scene2>
    );
  },

  /* ─────────── EŞEK-AT ─────────── */
  'sf-bt-esek-su': () => {
    const gy = 206;
    const p: PersonProps = { ...CAST.seyis, x: 254, y: 230, s: 1.0, flip: true, pose: { ...POSE.standSide, armF: { to: [214, 152] }, armB: { to: [226, 170] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Donkey x={110} y={228} s={1.0} head="down" />
        {/* yalak */}
        <OG sh={[{ d: 'M154 228L160 190H246L252 228Z', f: '#8a6a45' }, { d: rrect(164, 190, 78, 8, 2), f: K.water, ln: true }]} />
        {/* dökülen su */}
        <path d="M210 162Q208 176 206 192" stroke={K.water} stroke-width={6} fill="none" stroke-linecap="round" />
        <Person {...p} mid={() => <g transform="rotate(-60 212 156)"><Bucket x={212} y={172} s={0.8} water /></g>} />
      </Scene2>
    );
  },

  'sf-bt-esek-toynak': () => {
    // Yakın plan: kaldırılmış ön ayağın toynak tabanı; kazıma aleti taşı çıkarıyor.
    const c: P = [150, 140];
    return (
      <Scene2 bg="closeup">
        {/* bacak (dizden bükülü, yukarıdan gelir) */}
        <OG sh={[{ d: 'M90 -10L130 -10L150 70L110 80Z', f: M.donkey }, { d: ell([128, 82], 30, 18), f: M.donkey }]} />
        {/* toynak tabanı */}
        <OG sh={[
          { d: smooth([[c[0] - 52, c[1] - 30], [c[0], c[1] - 50], [c[0] + 52, c[1] - 30], [c[0] + 56, c[1] + 24], [c[0] + 30, c[1] + 54], [c[0] - 30, c[1] + 54], [c[0] - 56, c[1] + 24]], true), f: '#4a4340' },
          { d: smooth([[c[0] - 42, c[1] - 22], [c[0], c[1] - 40], [c[0] + 42, c[1] - 22], [c[0] + 46, c[1] + 22], [c[0] + 24, c[1] + 44], [c[0] - 24, c[1] + 44], [c[0] - 46, c[1] + 22]], true), f: '#cdb89a' },
          { d: `M${c[0]} ${c[1] - 6}L${c[0] - 20} ${c[1] + 44}H${c[0] + 20}Z`, f: '#a98d6a' },
        ]} />
        {/* taş */}
        <OG sh={[{ d: smooth([[c[0] + 24, c[1] + 4], [c[0] + 34, c[1] - 4], [c[0] + 40, c[1] + 8], [c[0] + 30, c[1] + 16]], true), f: '#8e8a82' }]} />
        <ToolHand tip={[c[0] + 30, c[1] + 10]} dirA={-150} back={58} skin={HANDSKIN.seyis} sleeve={K.role.bystander2} arm={80}>
          <G x={c[0] + 30} y={c[1] + 10} a={-150 + 180}>
            <OG sh={[{ d: 'M0 0Q-2 -10 6 -12L10 -8Q4 -6 6 2Z', f: '#c9d1da' }, { d: rrect(4, -6, 70, 9, 4), f: '#c6574e' }]} />
          </G>
        </ToolHand>
        <Arrow from={[c[0] + 60, c[1] + 70]} to={[c[0] + 100, c[1] + 90]} w={4} />
      </Scene2>
    );
  },

  'sf-bt-esek-semer': () => {
    const x = 150, gy = 226;
    return (
      <Scene2 bg="outdoor" gy={200}>
        <Donkey x={x} y={gy} s={1.25} />
        {/* uzak çuval ucu */}
        <OG sh={[{ d: rrect(x - 30, gy - 136, 44, 18, 6), f: shade(M.sack, 0.15) }]} />
        {/* keçe */}
        <OG sh={[{ d: `M${x - 42} ${gy - 124}Q${x - 6} ${gy - 134} ${x + 34} ${gy - 124}L${x + 30} ${gy - 96}H${x - 38}Z`, f: M.felt }]} />
        {/* semer */}
        <OG sh={[{ d: `M${x - 34} ${gy - 128}Q${x - 6} ${gy - 146} ${x + 26} ${gy - 128}L${x + 22} ${gy - 116}H${x - 30}Z`, f: '#8a5a3c' }]} />
        {/* yakın çuval */}
        <Rope pts={[[x - 14, gy - 128], [x - 18, gy - 100]]} />
        <OG sh={[{ d: smooth([[x - 40, gy - 102], [x + 10, gy - 104], [x + 14, gy - 76], [x - 10, gy - 64], [x - 40, gy - 72]], true), f: M.sack }]} />
        <Label x={x + 96} y={40} text="≤ %20" size={17} />
        <Arrow from={[x + 70, 48]} to={[x + 8, gy - 140]} bend={0.2} w={4} />
      </Scene2>
    );
  },

  /* ─────────── KATEGORİ KAPAKLARI ─────────── */
  'sf-bt-zaman-kapak': () => {
    const gy = 200;
    const u: P = [Math.cos(rad(40)), -Math.sin(rad(40))];
    const foot: P = [108, 150];
    const C: P = [foot[0] + u[0] * 70, foot[1] + u[1] * 70];
    // gölge: çubuğun gölgesi kadranda bir saat çizgisi boyunca
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Sun x={266} y={52} r={18} />
        <OG sh={[{ d: rrect(84, 150, 128, 14, 3), f: '#b9b3a6' }, { d: rrect(100, 164, 96, 50, 2), f: '#a8a294' }, { d: rrect(84, 212, 128, 12, 3), f: '#b9b3a6' }]} />
        <DialSide C={C} R={52} rodBack={70} rodFront={50} face="#e9c66a" />
        <Tree x={36} y={204} s={0.8} />
      </Scene2>
    );
  },

  'sf-bt-haberlesme-kapak': () => {
    const gy = 220;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Hill x={70} w={240} top={120} c="#a9cf86" />
        <Hill x={290} w={160} top={110} c="#b4d792" />
        <Person {...CAST.telsizci} x={74} y={124} s={0.55} pose={{ ...POSE.standSide, armF: { at: 'mouth', d: [8, 8] }, handF: 'fist', face: 'neutral' }} />
        <Waves x={96} y={48} a={-20} n={3} r={8} />
        <g>
          <circle cx={284} cy={98} r={16} fill="#fff7b0" opacity={0.7} />
          <path d="M284 78V118M264 98H304M270 84L298 112M298 84L270 112" stroke="#ffd84a" stroke-width={3} />
        </g>
        <Dash a={[118, 66]} b={[272, 98]} w={3} />
      </Scene2>
    );
  },

  'sf-bt-topluluk-kapak': () => {
    const ppl: PersonProps[] = [
      { who: 'oldwoman', skin: 1, role: 'bystander', x: 62, y: 226, s: 0.9 },
      { who: 'man', skin: 2, role: 'bystander3', x: 118, y: 228, s: 0.95, hair: 'short', hairC: K.hair.black },
      { who: 'girl', skin: 1, role: 'bystander2', x: 166, y: 228, s: 0.95 },
      { who: 'woman', skin: 0, role: 'helper', x: 212, y: 228, s: 0.95, hairC: K.hair.auburn },
      { who: 'oldman', skin: 3, role: 'bystander4', x: 262, y: 226, s: 0.9 },
    ];
    return (
      <Scene2 bg="outdoor">
        <Tree x={164} y={160} s={1.5} />
        {ppl.map((p, i) => <Person key={i} {...p} pose={{ ...POSE.stand, face: 'calm' }} />)}
      </Scene2>
    );
  },

  'sf-bt-doga-kapak': () => {
    const gy = 196;
    const cabin = (x: number, w: number, h: number) => (
      <g>
        <OG sh={[{ d: rrect(x, gy - h, w, h + 6, 2), f: '#a8723f' }, { d: `M${x - 8} ${gy - h + 2}L${x + w / 2} ${gy - h - 30}L${x + w + 8} ${gy - h + 2}Z`, f: '#7a5a3a' }, { d: rrect(x + w / 2 - 9, gy - 30, 18, 36, 2), f: '#5a3a22' }]} />
        {Array.from({ length: Math.floor(h / 10) }, (_, i) => <path key={i} d={`M${x} ${gy - h + 8 + i * 10}H${x + w}`} stroke={shade('#a8723f', 0.3)} stroke-width={1.2} />)}
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d="M0 150L60 70L110 130L170 50L240 136L290 90L320 120V170H0Z" fill="#8aa1b8" stroke={K.out} stroke-width={1.5} />
        <path d="M60 70L72 86L64 84L54 90ZM170 50L184 70L172 66L160 72Z" fill="#fff" />
        <rect y={150} width={320} height={50} fill={K.hill} />
        {[20, 50, 280, 300, 250].map((x, i) => <Tree key={i} x={x} y={gy + 2} s={0.8} kind="pine" />)}
        {cabin(76, 70, 52)}
        {cabin(166, 60, 44)}
        {/* odun istifi */}
        {Array.from({ length: 3 }, (_, r) => Array.from({ length: 5 - r }, (_, i) => <OG key={r + '-' + i} sh={[{ d: circ([246 + i * 11 + r * 5.5, 220 - r * 10], 5.5), f: '#c99a66' }, { d: circ([246 + i * 11 + r * 5.5, 220 - r * 10], 2), f: '#8a5a3c', no: true }]} ow={1} />))}
      </Scene2>
    );
  },
};
