// Sıfırdan paketi sahneleri (a). Bkz. docs/agents/SIFIRDAN_CIZIM.md
// Kapsam: 14-yolculuk-yerlesim paketinin bütün rehberleri ve dört kategori kapağı.
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Backpack, Bad, Bottle, Bubble, Campfire, Cane, Hand, HouseExt, K, Label, No, OG, OW, Ok, Person, POSE, Rock, Scene2,
  Tree, Water, Waves, capsule, circ, ell, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh, Pose } from '../../../src/art/kit2';

/* ═══════════════ yardımcılar ═══════════════ */

const FONT = "'IBM Plex Sans', system-ui, sans-serif";
const R2D = 180 / Math.PI;
const rad = (d: number) => d / R2D;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(rad(a)) * l, p[1] + Math.sin(rad(a)) * l];
const f1 = (n: number) => Math.round(n * 10) / 10;
const ang = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) * R2D;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Dönüş/ölçek grubu (yerel koordinat) */
const G = ({ x, y, s = 1, a = 0, sx, children }: { x: number; y: number; s?: number; a?: number; sx?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${sx ?? s} ${s})`}>{children}</g>
);

/** Düz yazı */
const T = ({ x, y, t, size = 14, fill = K.ink, anchor = 'middle', weight = 700, op }: { x: number; y: number; t: string; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; op?: number }) => (
  <text x={x} y={y} font-size={size} font-weight={weight} fill={fill} text-anchor={anchor} font-family={FONT} opacity={op}>{t}</text>
);

/** İnce çift uçlu ölçü oku */
function Dim({ a, b, color = K.action, w = 3 }: { a: P; b: P; color?: string; w?: number }) {
  const an = ang(a, b);
  const hl = w * 2.6 + 3;
  const head = (p: P, dir: number) => {
    const base = pol(p, dir, -hl);
    const l = pol(base, dir + 90, hl * 0.55), r = pol(base, dir - 90, hl * 0.55);
    return `M${f1(p[0])} ${f1(p[1])}L${f1(l[0])} ${f1(l[1])}L${f1(r[0])} ${f1(r[1])}Z`;
  };
  const a2 = pol(a, an, hl * 0.8), b2 = pol(b, an, -hl * 0.8);
  const line = `M${f1(a2[0])} ${f1(a2[1])}L${f1(b2[0])} ${f1(b2[1])}`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={line} stroke={K.out} stroke-width={w + 2.6} fill="none" />
      <path d={head(b, an) + head(a, an + 180)} fill={K.out} stroke={K.out} stroke-width={2.6} />
      <path d={line} stroke={color} stroke-width={w} fill="none" />
      <path d={head(b, an) + head(a, an + 180)} fill={color} />
    </g>
  );
}

/** Kesik çizgi */
const Dash = ({ a, b, color = K.action, w = 3, dash = '7 6' }: { a: P; b: P; color?: string; w?: number; dash?: string }) => (
  <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke={color} stroke-width={w} stroke-dasharray={dash} fill="none" stroke-linecap="round" />
);

/** Kalın çizgi (dış hatlı) — çubuk, dal */
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

/** Turuncu halka (dikkat çekilecek yer) */
const Ring = ({ x, y, r = 16, c = K.action }: { x: number; y: number; r?: number; c?: string }) => (
  <g fill="none">
    <circle cx={x} cy={y} r={r} stroke={K.out} stroke-width={6} />
    <circle cx={x} cy={y} r={r} stroke={c} stroke-width={3.6} />
  </g>
);

/** Güneş */
const Sun = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => {
      const a = i * 45;
      const p1 = pol([x, y], a, r + 5), p2 = pol([x, y], a, r + 13);
      return <path key={i} d={`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`} stroke="#f2b531" stroke-width={3.4} stroke-linecap="round" />;
    })}
    <OG sh={[{ d: circ([x, y], r), f: '#ffd34d' }]} />
  </g>
);

/** Tepe (dolgulu yay). x = orta, w genişlik, top = tepe y */
const Hill = ({ x, w, top, gy = 240, c = '#9cc274' }: { x: number; w: number; top: number; gy?: number; c?: string }) => (
  <path d={`M${x - w / 2} ${gy}Q${x - w / 4} ${top} ${x} ${top}T${x + w / 2} ${gy}Z`} fill={c} stroke={K.out} stroke-width={1.5} />
);

/** Ter damlası */
const Sweat = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G x={x} y={y} s={s}><OG ow={1.1 / s} sh={[{ d: 'M0 -7Q4 -1 3 2A3 3 0 0 1 -3 2Q-4 -1 0 -7Z', f: K.waterLight }]} /></G>
);

/** Nota simgesi */
const Note = ({ x, y, s = 1, c = K.action }: { x: number; y: number; s?: number; c?: string }) => (
  <G x={x} y={y} s={s}>
    <OG ow={1.2 / s} sh={[{ d: ell([0, 0], 5.5, 4.2), f: c, t: 'rotate(-20)' }, { d: rrect(3.6, -22, 2.6, 22, 1), f: c }, { d: 'M5 -22Q12 -18 13 -10Q9 -15 5 -15Z', f: c }]} />
  </G>
);

/* ═══════════════ malzeme renkleri (paket geneli) ═══════════════ */
const M = {
  wood: K.wood,
  woodL: '#d4a373',
  woodD: '#8a5a3c',
  rope: '#d9b873',
  sack: '#d8c08e',
  sackD: '#b99c66',
  cloth: '#e9dfc8',
  felt: '#7a5a8c',
  wicker: '#c99a55',
  tin: '#b9c2cc',
  tinD: '#8e99a6',
  iron: '#6f7782',
  adobe: '#cf9f72',
  adobeD: '#b58358',
  ice: '#bfe3f5',
  iceClear: '#8fcbea',
  iceWhite: '#eef4f7',
  iceGrey: '#a9b4bb',
  snow: '#f4f8fb',
  snowShade: '#dbe6ee',
  dirt: '#c9a77a',
  dirtD: '#a98559',
  paper: '#fbf6e9',
  paperLine: '#c9bfa8',
  blanket: '#b5523f',
  bag: '#5b7f4e',
  donkey: '#8f8478',
  donkeyD: '#6f665d',
  donkeyL: '#d8d0c6',
  mule: '#7a5b45',
  muleD: '#5f4535',
  horse: '#9a6a44',
  wool: '#f1ece2',
  goat: '#b08a64',
  dog: '#c08a52',
  tape: '#e8d6a8',
  sleepbag: '#7fb2d9',
  rain: '#f2c230',
  water: K.water,
};

/* ═══════════════ oyuncular (CAST) ═══════════════ */
// Bir rehberin bütün çizimlerinde aynı kişi(ler). Rehberler arasında çeşitlilik.
const CAST = {
  /** Yük hazırlama, yürüyüş-mola-ayak, su-yiyecek: yolcu kadın + yol arkadaşı */
  yolcu: { who: 'woman', skin: 1, hair: 'ponytail', hairC: K.hair.dark, role: 'bystander3', bottomC: K.pants.khaki, sleeve: 'long' } as const,
  yolcu2: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'bystander4', bottomC: K.pants.denim, sleeve: 'long' } as const,
  /** Grupla yolculuk */
  rehber: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'helper', bottomC: K.pants.dark, sleeve: 'long' } as const,
  nine: { who: 'oldwoman', skin: 1, role: 'bystander' } as const,
  anne: { who: 'woman', skin: 2, hair: 'scarf', hairC: '#c6574e', role: 'bystander2', bottomC: K.pants.navy, sleeve: 'long' } as const,
  kiz: { who: 'girl', skin: 2, hair: 'ponytail', hairC: K.hair.black, role: 'victim', sleeve: 'long', bottomC: K.pants.denim } as const,
  ogul: { who: 'boy', skin: 1, hair: 'short', hairC: K.hair.brown, role: 'bystander4', sleeve: 'long', bottomC: K.pants.khaki } as const,
  artci: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.brown, role: 'bystander3', bottomC: K.pants.khaki, sleeve: 'long' } as const,
  /** Hayvanla yolculuk: çoban */
  coban: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.grey, role: 'bystander2', bottomC: K.pants.brown, sleeve: 'long', mustache: true } as const,
  /** Yük hayvanı: seyis */
  seyis: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.dark, role: 'bystander4', bottomC: K.pants.dark, sleeve: 'long' } as const,
  /** El arabası: iki kişi */
  araba1: { who: 'man', skin: 3, hair: 'short', hairC: K.hair.black, role: 'bystander3', bottomC: K.pants.grey, sleeve: 'long' } as const,
  araba2: { who: 'woman', skin: 1, hair: 'bun', hairC: K.hair.auburn, role: 'bystander', bottomC: K.pants.dark, sleeve: 'long' } as const,
  /** Kar ayakkabısı ve karda yolculuk: kışçı adam (kırmızı mont) */
  kisci: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.brown, role: 'bystander4', top: '#b8433b', bottomC: K.pants.navy, sleeve: 'long', mustache: true } as const,
  /** Buz kalınlığı ve buza düşme: kurtarıcı kadın + düşen adam */
  buzcu: { who: 'woman', skin: 0, hair: 'bun', hairC: K.hair.blond, role: 'helper', bottomC: K.pants.dark, sleeve: 'long' } as const,
  dusen: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'victim', bottomC: K.pants.denim, sleeve: 'long' } as const,
  /** Siper ayağı */
  siper: { who: 'man', skin: 3, hair: 'short', hairC: K.hair.black, role: 'bystander3', bottomC: K.pants.khaki, sleeve: 'long' } as const,
};

/* ═══════════════ ortak nesneler ═══════════════ */

/** Çuval (önden). x,y = taban ortası */
const Sack = ({ x, y, s = 1, c = M.sack }: { x: number; y: number; s?: number; c?: string }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[
      { d: 'M-20 0Q-27 -20 -19 -38Q-10 -44 0 -42Q10 -44 19 -38Q27 -20 20 0Z', f: c },
      { d: 'M-12 -41L-16 -48L-6 -43ZM12 -41L16 -48L6 -43Z', f: shade(c, 0.12) },
      { d: 'M10 -38Q20 -20 14 0H20Q27 -20 19 -38Z', f: shade(c, 0.15), no: true },
    ]} />
  </G>
);

/** Bez torba (küçük, ağzı bağlı). x,y = taban ortası */
const Pouch = ({ x, y, s = 1, c = M.cloth, open, children }: { x: number; y: number; s?: number; c?: string; open?: boolean; children?: ComponentChildren }) => (
  <G x={x} y={y} s={s}>
    {open ? (
      <g>
        <OG ow={OW / s} sh={[{ d: 'M-24 0Q-30 -24 -20 -40H20Q30 -24 24 0Z', f: c }, { d: ell([0, -40], 21, 7), f: shade(c, 0.35) }]} />
        {children}
      </g>
    ) : (
      <OG ow={OW / s} sh={[
        { d: 'M-22 0Q-28 -22 -12 -36L-5 -40H5L12 -36Q28 -22 22 0Z', f: c },
        { d: 'M-5 -40L-12 -52L-2 -46L0 -54L3 -46L12 -52L5 -40Z', f: shade(c, 0.1) },
        { d: rrect(-7, -43, 14, 5, 2), f: M.rope },
      ]} />
    )}
  </G>
);

/** Teneke kutu (silindir, yandan). x,y = taban ortası */
const Can = ({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[
      { d: 'M-10 0V-26H10V0Z', f: M.tin },
      { d: 'M4 0V-26H10V0Z', f: M.tinD, no: true },
      { d: ell([0, -26], 10, 3), f: tint(M.tin, 0.3) },
      { d: 'M-10 -8H10M-10 -18H10', st: M.tinD, sw: 1.4 },
    ]} />
  </G>
);

/** Kova. x,y = taban ortası */
const Bucket = ({ x, y, s = 1, c = '#8e99a6', water }: { x: number; y: number; s?: number; c?: string; water?: boolean }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[{ d: 'M-16 -30L-12 0H12L16 -30Z', f: c }, { d: ell([0, -30], 16, 4), f: water ? K.water : shade(c, 0.3), ln: true }]} />
    <path d="M-16 -30Q0 -50 16 -30" fill="none" stroke={K.out} stroke-width={2 / s} />
  </G>
);

/** Su kabı (alçak tas). x,y = taban ortası */
const Bowl = ({ x, y, s = 1, c = '#c6574e' }: { x: number; y: number; s?: number; c?: string }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[{ d: 'M-14 -10L-10 0H10L14 -10Z', f: c }, { d: ell([0, -10], 14, 3.5), f: K.water, ln: true }]} />
  </G>
);

/** Eşek/katır/at (yandan, sağa bakar). x = gövde ortası, y = zemin. */
function Equid({ x, y, s = 1, head = 'up', c = M.donkey, d = M.donkeyD, l = M.donkeyL, ears = 'long', mane, under, over }: {
  x: number; y: number; s?: number; head?: 'up' | 'down'; c?: string; d?: string; l?: string; ears?: 'long' | 'short'; mane?: string;
  under?: ComponentChildren; over?: ComponentChildren;
}) {
  const legs: Sh[] = [
    { d: capsule([-36, -62], 7, [-40, -6], 4.2), f: d },
    { d: capsule([30, -62], 7, [34, -6], 4.2), f: d },
    { d: capsule([-28, -62], 8, [-30, -6], 4.6), f: c },
    { d: capsule([38, -62], 8, [40, -6], 4.6), f: c },
  ];
  const hooves: Sh[] = [[-40, 0], [34, 0], [-30, 0], [40, 0]].map(([hx]) => ({ d: rrect(hx - 5.5, -8, 11, 8, 2), f: '#3b3537' }));
  const earL = ears === 'long' ? 1 : 0.45;
  const neckHead: Sh[] = head === 'up'
    ? [
        { d: 'M34 -86Q46 -112 58 -124L74 -112Q62 -98 54 -72Z', f: c },
        { d: 'M56 -126Q66 -134 74 -126L92 -98Q96 -88 86 -86Q78 -84 72 -94L58 -112Z', f: c },
        { d: 'M86 -98Q95 -96 93 -88Q90 -84 84 -86Z', f: l, no: true },
        { d: `M60 -126Q${52} ${-126 - 30 * earL} ${56} ${-128 - 32 * earL}Q62 ${-126 - 28 * earL} 66 -128Z`, f: c },
        { d: `M66 -126Q66 ${-126 - 30 * earL} 72 ${-126 - 32 * earL}Q76 ${-126 - 24 * earL} 70 -124Z`, f: c },
        ...(mane ? [{ d: 'M32 -88Q40 -112 56 -128L60 -124Q48 -110 40 -86Z', f: mane } as Sh] : []),
      ]
    : [
        { d: 'M34 -86Q52 -86 66 -60L54 -50Q44 -66 30 -64Z', f: c },
        { d: 'M54 -60Q62 -70 72 -62L88 -30Q90 -20 80 -20Q72 -20 70 -30L54 -48Z', f: c },
        { d: 'M82 -32Q90 -28 86 -21Q80 -18 76 -22Z', f: l, no: true },
        { d: `M60 -64Q${46} ${-64 - 24 * earL} 48 ${-66 - 26 * earL}Q56 ${-66 - 24 * earL} 66 -66Z`, f: c },
        { d: `M66 -66Q60 ${-66 - 26 * earL} 66 ${-66 - 28 * earL}Q72 ${-66 - 22 * earL} 70 -64Z`, f: c },
      ];
  const eye: P = head === 'up' ? [74, -112] : [70, -50];
  return (
    <G x={x} y={y} s={s}>
      <ellipse cx={0} cy={0} rx={56} ry={5} fill="#000" opacity={0.12} />
      {under}
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
      {over}
    </G>
  );
}

/** Koyun (yandan, sağa bakar). x = gövde ortası, y = zemin. lie: yatıyor */
function Sheep({ x, y, s = 1, lie, flip, headDown }: { x: number; y: number; s?: number; lie?: boolean; flip?: boolean; headDown?: boolean }) {
  const by = lie ? -16 : -34;
  const puffs: P[] = [[-20, by], [-8, by - 8], [6, by - 8], [18, by - 2], [12, by + 8], [-4, by + 9], [-18, by + 8]];
  const hp: P = headDown ? [32, by + 16] : [30, by - 8];
  return (
    <G x={x} y={y} s={s} sx={flip ? -s : s}>
      <ellipse cx={0} cy={0} rx={30} ry={3.5} fill="#000" opacity={0.12} />
      <OG ow={OW / s} sh={[
        ...(lie ? [] : [
          { d: capsule([-16, by + 8], 3.5, [-17, 0], 2.8), f: '#3d3a38' },
          { d: capsule([14, by + 8], 3.5, [15, 0], 2.8), f: '#3d3a38' },
          { d: capsule([-10, by + 8], 3.5, [-11, 0], 2.8), f: '#4d4946' },
          { d: capsule([20, by + 8], 3.5, [21, 0], 2.8), f: '#4d4946' },
        ]),
        ...puffs.map((p) => ({ d: circ(p, 11), f: M.wool })),
        { d: ell([0, by], 22, 12), f: M.wool, no: true },
        { d: smooth([[hp[0] - 6, hp[1] - 6], [hp[0] + 8, hp[1] - 8], [hp[0] + 14, hp[1] + 2], [hp[0] + 8, hp[1] + 8], [hp[0] - 4, hp[1] + 6]], true), f: '#4a4542' },
        { d: ell([hp[0] - 4, hp[1] - 4], 6, 3), f: '#3d3a38', t: `rotate(-30 ${hp[0] - 4} ${hp[1] - 4})` },
      ]} />
      <circle cx={hp[0] + 5} cy={hp[1] - 2} r={1.6} fill="#fff" />
    </G>
  );
}

/** Keçi (yandan, sağa bakar). */
function Goat({ x, y, s = 1, lie, flip, c = M.goat, headDown }: { x: number; y: number; s?: number; lie?: boolean; flip?: boolean; c?: string; headDown?: boolean }) {
  const by = lie ? -16 : -36;
  const d = shade(c, 0.2);
  const hp: P = headDown ? [34, by + 18] : [32, by - 14];
  return (
    <G x={x} y={y} s={s} sx={flip ? -s : s}>
      <ellipse cx={0} cy={0} rx={30} ry={3.5} fill="#000" opacity={0.12} />
      <OG ow={OW / s} sh={[
        ...(lie ? [] : [
          { d: capsule([-16, by + 6], 4, [-17, 0], 2.6), f: d },
          { d: capsule([16, by + 6], 4, [17, 0], 2.6), f: d },
        ]),
        { d: 'M-22 ' + (by - 6) + 'L-28 ' + (by - 16) + 'L-24 ' + (by - 4) + 'Z', f: c },
        { d: smooth([[-24, by - 4], [0, by - 10], [22, by - 8], [26, by + 4], [10, by + 12], [-14, by + 12], [-26, by + 6]], true), f: c },
        { d: `M20 ${by - 4}Q${hp[0] - 2} ${hp[1] + 2} ${hp[0]} ${hp[1]}L${hp[0] + 8} ${hp[1] + 6}Q24 ${by + 6} 22 ${by + 8}Z`, f: c },
        { d: smooth([[hp[0] - 4, hp[1] - 4], [hp[0] + 6, hp[1] - 6], [hp[0] + 16, hp[1] + 6], [hp[0] + 12, hp[1] + 10], [hp[0] + 2, hp[1] + 6]], true), f: c },
        { d: `M${hp[0] + 2} ${hp[1] - 4}Q${hp[0] - 6} ${hp[1] - 18} ${hp[0] - 12} ${hp[1] - 14}Q${hp[0] - 4} ${hp[1] - 12} ${hp[0] - 2} ${hp[1] - 2}Z`, f: '#7d6a55' },
        { d: `M${hp[0] + 10} ${hp[1] + 9}L${hp[0] + 9} ${hp[1] + 18}L${hp[0] + 6} ${hp[1] + 8}Z`, f: d },
        ...(lie ? [] : [
          { d: capsule([-10, by + 6], 4.4, [-11, 0], 2.8), f: c },
          { d: capsule([22, by + 6], 4.4, [23, 0], 2.8), f: c },
        ]),
      ]} />
      <circle cx={hp[0] + 6} cy={hp[1] - 1} r={1.6} fill={K.ink} />
    </G>
  );
}

/** Köpek (yandan, sağa bakar). headDown: kaptan su içiyor */
function Dog({ x, y, s = 1, c = M.dog, headDown }: { x: number; y: number; s?: number; c?: string; headDown?: boolean }) {
  const d = shade(c, 0.2);
  const hp: P = headDown ? [34, -14] : [32, -46];
  return (
    <G x={x} y={y} s={s}>
      <ellipse cx={0} cy={0} rx={28} ry={3.5} fill="#000" opacity={0.12} />
      <OG ow={OW / s} sh={[
        { d: capsule([-16, -26], 5, [-18, -4], 3.2), f: d },
        { d: capsule([16, -26], 5, [18, -4], 3.2), f: d },
        { d: 'M-24 -32Q-36 -42 -34 -54Q-30 -46 -22 -38Z', f: c },
        { d: smooth([[-26, -34], [0, -38], [22, -36], [26, -24], [10, -18], [-14, -18], [-26, -24]], true), f: c },
        { d: `M16 -34Q${hp[0] - 6} ${hp[1] + 4} ${hp[0]} ${hp[1]}L${hp[0] + 8} ${hp[1] + 8}Q26 -24 24 -22Z`, f: c },
        { d: smooth([[hp[0] - 6, hp[1] - 6], [hp[0] + 6, hp[1] - 8], [hp[0] + 20, hp[1] + 2], [hp[0] + 18, hp[1] + 8], [hp[0] + 2, hp[1] + 8]], true), f: c },
        { d: ell([hp[0] + 19, hp[1] + 3], 2.6, 2.2), f: K.ink, no: true },
        { d: `M${hp[0] - 2} ${hp[1] - 6}Q${hp[0] - 10} ${hp[1] + 2} ${hp[0] - 6} ${hp[1] + 12}Q${hp[0]} ${hp[1] + 4} ${hp[0] + 2} ${hp[1] - 4}Z`, f: d },
        { d: capsule([-10, -24], 5.4, [-11, -4], 3.4), f: c },
        { d: capsule([22, -24], 5.4, [23, -4], 3.4), f: c },
        { d: rrect(-15, -6, 10, 6, 2.5), f: c },
        { d: rrect(18, -6, 10, 6, 2.5), f: c },
      ]} />
      <circle cx={hp[0] + 7} cy={hp[1] - 1} r={1.8} fill={K.ink} />
    </G>
  );
}

/** Tavuk (yandan, sağa bakar). x,y = gövde altı */
function Hen({ x, y, s = 1, c = '#b5643a' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[
        { d: 'M-16 -18Q-26 -30 -20 -36Q-14 -26 -8 -24Z', f: shade(c, 0.25) },
        { d: smooth([[-16, -18], [-4, -26], [8, -24], [14, -14], [8, -2], [-8, 0], [-16, -8]], true), f: c },
        { d: circ([10, -28], 7), f: c },
        { d: 'M7 -34Q8 -40 11 -37Q13 -41 15 -36Q17 -36 15 -32Z', f: K.red },
        { d: 'M16 -29L22 -27L16 -25Z', f: '#f2b531' },
        { d: 'M14 -24Q16 -19 13 -20Z', f: K.red },
        { d: 'M-8 -14Q2 -18 6 -10Q-2 -6 -8 -14Z', f: shade(c, 0.18), ln: true },
      ]} />
      <circle cx={11} cy={-29} r={1.3} fill={K.ink} />
    </G>
  );
}

/** El arabası (yandan, tekerlek sağda). x = tekerlek merkezi, y = zemin. load: 'ok' (tekerlek üstünde) | 'bad' (kollara yakın) | 'none' */
function Wheelbarrow({ x, y, s = 1, load = 'ok', a = 0 }: { x: number; y: number; s?: number; load?: 'ok' | 'bad' | 'none'; a?: number }) {
  const R = 14;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[
        // kollar ve ayak
        { d: capsule([-4, -R], 3, [-104, -44], 2.6), f: M.woodD },
        { d: capsule([-62, -30], 2.6, [-66, -2], 2.4), f: M.woodD },
        // tekne
        { d: 'M-70 -58L6 -52L-6 -26L-58 -26Z', f: '#4f7fb0' },
        { d: 'M-6 -26L6 -52L-2 -52L-14 -26Z', f: shade('#4f7fb0', 0.2), no: true },
      ]} />
      {load === 'ok' && (
        <g>
          <OG ow={OW / s} sh={[
            { d: rrect(-40, -82, 40, 30, 6), f: M.sack },
            { d: rrect(-26, -100, 30, 22, 6), f: shade(M.sack, 0.1) },
            { d: rrect(-56, -74, 20, 20, 5), f: M.blanket },
          ]} />
          <Rope pts={[[-50, -56], [-30, -98], [-6, -60]]} w={2} />
        </g>
      )}
      {load === 'bad' && (
        <OG ow={OW / s} sh={[
          { d: rrect(-74, -88, 36, 32, 6), f: M.sack },
          { d: rrect(-90, -110, 34, 26, 6), f: shade(M.sack, 0.1) },
          { d: rrect(-62, -112, 22, 22, 5), f: M.blanket },
        ]} />
      )}
      <OG ow={OW / s} sh={[{ d: circ([0, -R], R), f: '#3b3537' }, { d: circ([0, -R], R * 0.45), f: M.tin }]} />
    </G>
  );
}

/** Yalın ayak (yan görünüş, topuk solda, parmaklar sağda). x,y = topuk altı. */
function BareFoot({ x, y, s = 1, skin = 1, a = 0, red, tape }: { x: number; y: number; s?: number; skin?: number; a?: number; red?: boolean; tape?: boolean }) {
  const c = K.skin[skin];
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[
        { d: smooth([[18, -150], [8, -96], [4, -60], [-6, -34], [-4, -8], [12, 0], [70, 2], [128, 0], [160, -4], [170, -14], [162, -26], [120, -36], [84, -52], [58, -84], [56, -150]]), f: c },
        { d: 'M18 -150H56L54 -160H20Z', f: K.pants.khaki },
      ]} />
      <path d="M140 -24Q150 -20 160 -24M150 -30Q156 -28 162 -30" stroke={shade(c, 0.35)} stroke-width={1.6} fill="none" />
      <path d="M30 -60Q40 -70 52 -66" stroke={shade(c, 0.25)} stroke-width={1.6} fill="none" />
      {red && <ellipse cx={4} cy={-26} rx={10} ry={13} fill="#e86a5a" opacity={0.75} />}
      {tape && <OG ow={OW / s} sh={[{ d: 'M-8 -46Q-14 -24 -6 -2L22 -2Q16 -24 22 -46Z', f: M.tape }]} />}
    </G>
  );
}


/** Bere: kişinin başının üstüne */
const Beanie = ({ r, c = '#2f5f8a' }: { r: ReturnType<typeof rig>; c?: string }) => {
  const R = r.headR;
  return (
    <G x={r.head[0]} y={r.head[1]} a={r.headA + 90}>
      <OG sh={[{ d: `M${-R * 1.08} ${-R * 0.12}A${R * 1.08} ${R * 1.1} 0 0 1 ${R * 1.08} ${-R * 0.12}Z`, f: c }, { d: rrect(-R * 1.12, -R * 0.36, R * 2.24, R * 0.4, R * 0.15), f: shade(c, 0.15) }, { d: circ([0, -R * 1.2], R * 0.22), f: tint(c, 0.3) }]} />
    </G>
  );
};

/** Buz dikeni: iki kısa tahta sap, uçlarda çivi. a: sapın yönü (çiviye doğru). x,y = sap ortası */
const IcePick = ({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[{ d: rrect(-16, -6, 32, 12, 5), f: M.woodL }, { d: 'M16 -2L26 0L16 2Z', f: M.tin }]} />
  </G>
);

/** Kar ayakkabısı çerçevesi (yukarıdan, burun yukarıda). x,y = orta; L = boy */
function Snowshoe({ x, y, s = 1, a = 0, lacing = true }: { x: number; y: number; s?: number; a?: number; lacing?: boolean }) {
  const pts: P[] = [[0, -78], [28, -66], [36, -30], [30, 10], [16, 48], [4, 76], [-4, 76], [-16, 48], [-30, 10], [-36, -30], [-28, -66]];
  const bars = [-44, -20, 14, 40];
  const wAt = (yy: number) => (yy < -30 ? 34 * Math.sqrt(Math.max(0, 1 - ((yy + 30) / 50) ** 2)) + 0 : 34 - (yy + 30) * 0.3);
  return (
    <G x={x} y={y} s={s} a={a}>
      {lacing && (
        <g stroke="#d9b873" stroke-width={1.6 / s} opacity={0.9}>
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-30 + i * 7.5} -60L${-30 + i * 7.5} 60`} />)}
          {Array.from({ length: 13 }, (_, i) => <path key={'h' + i} d={`M-32 ${-66 + i * 11}H32`} />)}
        </g>
      )}
      <path d={smooth(pts, true)} fill="none" stroke={K.out} stroke-width={9 / s} />
      <path d={smooth(pts, true)} fill="none" stroke={M.woodL} stroke-width={6 / s} />
      {bars.map((b, i) => <OG key={i} ow={OW / s} sh={[{ d: rrect(-wAt(b) + 1, b - (i === 1 || i === 2 ? 4 : 2.5), (wAt(b) - 1) * 2, i === 1 || i === 2 ? 8 : 5, 2), f: M.wood }]} />)}
    </G>
  );
}

/* ═══════════════ sahneler ═══════════════ */

export const SCENES: Record<string, () => JSX.Element> = {
  /* ─────────── YÜK HAZIRLAMA ─────────── */
  'sf-yy-canta-yerlesim': () => {
    // Sola bakan yolcu; sırtındaki çanta kesit olarak büyük çizilmiş.
    const p: PersonProps = { ...CAST.yolcu, x: 104, y: 230, s: 1.2, flip: true, pose: { ...POSE.standSide, face: 'neutral' } };
    const r = rig(p);
    const bx = r.back[0] + 2, top = r.neck[1] - 14, h = 124, w = 70;
    return (
      <Scene2 bg="outdoor">
        <Tree x={286} y={204} s={0.8} kind="pine" />
        <Person {...p} />
        {/* omuz askısı */}
        <Rope pts={[[bx + 4, top + 14], [r.shoulderF[0] + 4, r.shoulderF[1] - 6], [r.chest[0] + 2, r.chest[1] + 16], [bx + 4, top + 70]]} w={4} c="#3b3f4b" />
        {/* çanta gövdesi (kesit) */}
        <OG sh={[{ d: rrect(bx, top, w, h, 14), f: '#c0603e' }, { d: rrect(bx + 6, top + 8, w - 12, h - 16, 9), f: '#f3e6d4' }]} />
        {/* üst: yağmurluk */}
        <OG sh={[{ d: rrect(bx + 10, top + 12, w - 20, 20, 6), f: M.rain }]} />
        {/* orta, sırta yakın: ağır (su + yiyecek) */}
        <OG sh={[{ d: rrect(bx + 9, top + 36, 26, 46, 4), f: '#6b4f3a' }, { d: rrect(bx + 37, top + 36, 24, 46, 6), f: '#8fbfa0' }]} />
        <OG sh={[{ d: rrect(bx + 13, top + 42, 8, 34, 3), f: K.water }, { d: rrect(bx + 23, top + 42, 8, 34, 3), f: '#d9b873' }]} ow={1.1} />
        {/* alt: uyku tulumu */}
        <OG sh={[{ d: rrect(bx + 10, top + 86, w - 20, 26, 12), f: M.sleepbag }, { d: 'M' + (bx + 24) + ' ' + (top + 88) + 'V' + (top + 110), st: shade(M.sleepbag, 0.3), sw: 1.6 }]} />
        {/* yan cep: şişe */}
        <Bottle x={bx + w + 4} y={top + 96} s={0.75} fill={0.8} />
        <Arrow from={[bx + 108, top + 30]} to={[bx + 40, top + 56]} bend={0.2} w={5} />
        <Label x={bx + 118} y={top + 16} text="AĞIR" size={15} />
        <Ok x={bx + 120} y={top + 72} />
      </Scene2>
    );
  },

  'sf-yy-canta-ayar': () => {
    // Yandan (sağa bakar): bel kemeri kalçada tokalı, eller omuz askılarını aşağı çekiyor.
    const base: PersonProps = { ...CAST.yolcu, x: 170, y: 230, s: 1.22, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(base);
    const strapEnd: P = [r0.chest[0] - 2, r0.chest[1] + 14];
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [strapEnd[0] + 4, strapEnd[1] + 2] }, armB: { to: [strapEnd[0] - 2, strapEnd[1] - 2] }, handF: 'fist', handB: 'fist' } };
    const r = rig(p);
    const bx = r.back[0] - 46, top = r.neck[1] - 8;
    const hipY = r.hip[1] - 6;
    return (
      <Scene2 bg="outdoor">
        <Tree x={36} y={204} s={0.9} />
        {/* çanta (arkada) */}
        <OG sh={[{ d: rrect(bx, top, 50, 104, 12), f: '#c0603e' }, { d: rrect(bx - 8, top + 50, 12, 32, 4), f: shade('#c0603e', 0.12) }]} />
        <Person {...p} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        {/* bel kemeri: kalça kemiğinin üstünde */}
        <OG sh={[{ d: rrect(bx + 30, hipY - 9, r.hip[0] - bx - 14 + 22, 16, 5), f: '#3b3f4b' }, { d: rrect(r.hip[0] + 4, hipY - 8, 12, 14, 2), f: '#e6e8eb' }]} />
        {/* omuz askısı: çantanın tepesinden omuz üstüne, göğüs önünden aşağı */}
        <Rope pts={[[bx + 44, top + 6], [r.shoulderF[0] + 2, r.shoulderF[1] - 8], [r.chest[0] + 3, r.chest[1] + 6], [strapEnd[0] + 2, strapEnd[1]]]} w={5} c="#3b3f4b" />
        <Rope pts={[[strapEnd[0] + 2, strapEnd[1]], [strapEnd[0] + 4, strapEnd[1] + 18]]} w={3} c="#3b3f4b" />
        <Person {...p} only={['armF']} />
        <Arrow from={[strapEnd[0] + 28, strapEnd[1] - 36]} to={[strapEnd[0] + 28, strapEnd[1] + 4]} w={5} />
        <Ring x={r.hip[0] + 10} y={hipY - 1} r={17} />
        <Ok x={r.hip[0] + 74} y={hipY + 36} />
      </Scene2>
    );
  },

  'sf-yy-battaniye-rulo': () => {
    // Sol: yerde açık battaniye + eşyalar; sağ: rulo omuzdan çapraz asılı.
    const p: PersonProps = { ...CAST.yolcu, x: 236, y: 230, s: 1.12, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const a: P = [r.shoulderB[0] - 4, r.shoulderB[1] - 4];
    const b: P = [r.hipF[0] + 10, r.hipF[1] + 6];
    return (
      <Scene2 bg="outdoor" gy={176}>
        {/* yerde battaniye (hafif yukarıdan) */}
        <OG sh={[{ d: 'M14 222L40 170H150L128 222Z', f: M.blanket }, { d: 'M40 170L150 170L146 178L36 178Z', f: shade(M.blanket, 0.15), no: true }]} />
        <g stroke={tint(M.blanket, 0.3)} stroke-width={2}><path d="M30 210H134M38 194H140" /></g>
        {/* eşyalar ortada sıra */}
        <OG sh={[{ d: rrect(52, 184, 22, 14, 4), f: '#6b4f3a' }, { d: rrect(78, 182, 18, 16, 4), f: '#8fbfa0' }, { d: rrect(100, 184, 24, 13, 4), f: M.rain }]} />
        <Bottle x={64} y={204} s={0.5} a={90} fill={0.8} />
        <Arrow from={[30, 160]} to={[62, 146]} bend={-0.4} w={4} />
        <Arrow from={[160, 196]} to={[178, 196]} w={5} />
        {/* kişi */}
        <Person {...p} mid={() => (
          <g>
            <OG sh={[{ d: capsule(a, 13, b, 13), f: M.blanket }]} />
            <path d={`M${f1(lerp(a, b, 0.33)[0] - 12)} ${f1(lerp(a, b, 0.33)[1] - 8)}l22 14M${f1(lerp(a, b, 0.66)[0] - 12)} ${f1(lerp(a, b, 0.66)[1] - 8)}l22 14`} stroke={shade(M.blanket, 0.25)} stroke-width={2} />
            <Rope pts={[pol(a, 0, -2), pol(a, -60, 12)]} w={2.4} />
            <Rope pts={[pol(b, 0, 2), pol(b, 60, 12)]} w={2.4} />
          </g>
        )} />
      </Scene2>
    );
  },

  /* ─────────── YÜRÜYÜŞ, MOLA, AYAK ─────────── */
  'sf-yy-mola-saat': () => {
    // Yolcu mola veriyor: yerde oturmuş, sırtını çantasına dayamış. Üstte 50 + 10 dakika saati.
    const gy = 196;
    const p: PersonProps = { ...CAST.yolcu, x: 150, y: 226, s: 1.25, pose: { ...POSE.sitFloor, face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <Tree x={286} y={206} s={1.0} />
        <Backpack x={r.back[0] - 18} y={r.neck[1] + 8} s={1.25} />
        <Person {...p} />
        {/* 50 + 10 dakika saati */}
        <g>
          <OG sh={[{ d: circ([62, 60], 34), f: '#fff' }]} />
          <path d={`M62 60L62 26A34 34 0 1 1 ${f1(62 + 34 * Math.sin(rad(300)))} ${f1(60 - 34 * Math.cos(rad(300)))}Z`} fill={K.safe} />
          <path d={`M62 60L${f1(62 + 34 * Math.sin(rad(300)))} ${f1(60 - 34 * Math.cos(rad(300)))}A34 34 0 0 1 62 26Z`} fill={K.action} />
          <circle cx={62} cy={60} r={34} fill="none" stroke={K.out} stroke-width={2} />
        </g>
        <Label x={176} y={48} text="50 + 10 dk" size={16} />
      </Scene2>
    );
  },

  'sf-yy-ayak-kontrol': () => (
    <Scene2 bg="closeup">
      {/* çıkarılmış ayakkabı */}
      <OG sh={[{ d: 'M206 214Q206 190 226 186L252 184Q262 160 280 162Q300 168 300 196V214Z', f: '#6b4f3a' }, { d: 'M206 214H300V220H206Z', f: '#3b3537' }]} />
      <BareFoot x={52} y={176} s={0.95} skin={CAST.yolcu.skin} red />
      <Ring x={56} y={152} r={20} />
    </Scene2>
  ),

  'sf-yy-ayak-bant': () => (
    <Scene2 bg="closeup">
      <BareFoot x={52} y={176} s={0.95} skin={CAST.yolcu.skin} tape />
      {/* bandı bastıran parmaklar */}
      <Hand x={-14} y={150} a={92} s={0.85} pose="press" side="R" arm={60} sleeve={K.role.bystander3} skin={CAST.yolcu.skin} />
      <Ok x={262} y={60} r={16} />
    </Scene2>
  ),

  /* ─────────── SU VE YİYECEK ─────────── */
  'sf-yy-su-hesap': () => {
    const p1: PersonProps = { ...CAST.yolcu, x: 76, y: 224, s: 0.95, pose: { ...POSE.walk, face: 'neutral' } };
    const sy = (x: number) => 228 - (x - 160) * 0.32;
    const p2: PersonProps = { ...CAST.yolcu, x: 240, y: sy(240) + 2, s: 0.95, pose: { ...POSE.walk, spine: -76, chest: -72, head: -80, legF: [52, 84], face: 'worried' } };
    const r2 = rig(p2);
    const pack = (r: ReturnType<typeof rig>) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} />;
    return (
      <Scene2 bg="outdoor" gy={206}>
        {/* sağ yarı: güneşli yokuş */}
        <path d="M160 0H320V240H160Z" fill="#fff3c4" opacity={0.35} />
        <path d={`M160 240V${sy(160)}L320 ${sy(320)}V240Z`} fill={K.grassShade} stroke={K.out} stroke-width={1.5} />
        <Sun x={292} y={96} r={13} />
        <path d="M160 12V228" stroke="#fff" stroke-width={3} stroke-dasharray="6 6" />
        <Person {...p1} back={pack} />
        <Person {...p2} back={pack} />
        <Sweat x={r2.head[0] + 12} y={r2.head[1] + 2} />
        <Sweat x={r2.head[0] + 20} y={r2.head[1] + 14} />
        <Bottle x={22} y={62} s={0.85} fill={0.5} />
        <Bottle x={182} y={62} s={0.85} fill={1} />
        <Label x={86} y={44} text="0,5 l/sa" size={15} />
        <Label x={238} y={44} text="1 l/sa" size={15} />
      </Scene2>
    );
  },

  'sf-yy-gun-torbalari': () => {
    const xs = [38, 99, 160, 221, 282];
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={120} width={320} height={120} fill={M.woodL} stroke={K.out} stroke-width={1.5} />
        {xs.map((x, i) => i === 0 ? (
          <Pouch key={i} x={x} y={196} s={1.3} open>
            {/* içindekiler: bulgur, kuru meyve, ceviz */}
            <OG sh={[{ d: ell([-8, -42], 10, 4.5), f: '#e2c27a' }, { d: circ([8, -45], 5), f: '#b34d3a' }, { d: circ([13, -40], 4.5), f: '#8a5a3c' }, { d: circ([-1, -47], 4.5), f: '#c9a26a' }]} ow={1.1} />
          </Pouch>
        ) : (
          <Pouch key={i} x={x} y={196} s={1.3} />
        ))}
        {xs.map((x, i) => <T key={'t' + i} x={x} y={182} t={String(i + 1)} size={28} fill={K.ink} />)}
      </Scene2>
    );
  },

  /* ─────────── GRUPLA YOLCULUK ─────────── */
  'sf-yy-grup-dizilis': () => {
    const s = 0.74, gy = 216;
    const walk: Pose = { ...POSE.walk, face: 'neutral' };
    const lead: PersonProps = { ...CAST.rehber, x: 282, y: gy, s, pose: walk };
    const nine: PersonProps = { ...CAST.nine, x: 222, y: gy, s: s * 0.95, pose: { spine: -84, chest: -76, head: -80, legB: [104, 100], legF: [78, 86], armB: [92, 80], armF: { to: [244, 160] }, face: 'neutral' } };
    const hand1: P = [152, 164];
    const anne: PersonProps = { ...CAST.anne, x: 130, y: gy, s, pose: { ...walk, armF: { to: hand1 } } };
    const kiz: PersonProps = { ...CAST.kiz, x: 170, y: gy, s: 0.82, pose: { ...walk, armB: { to: hand1 } } };
    const art: PersonProps = { ...CAST.artci, x: 50, y: gy, s, pose: walk };
    const pack = (c: string) => (r: ReturnType<typeof rig>) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} color={c} />;
    return (
      <Scene2 bg="outdoor" gy={196} ground="dirt">
        <Cane top={[245, 160]} bottom={[252, gy]} />
        <Person {...art} back={pack('#4f7fb0')} />
        <Person {...anne} back={pack('#c0603e')} />
        <Person {...kiz} />
        <Person {...nine} />
        <Person {...lead} back={pack('#6c9c5a')} />
        <Arrow from={[150, 40]} to={[270, 40]} w={6} />
      </Scene2>
    );
  },

  'sf-yy-cocuk-duduk': () => {
    // Kız önden, yakın: göğüs cebinde ad kâğıdı, montun fermuarına kısa iple bağlı düdük.
    const kiz: PersonProps = { ...CAST.kiz, x: 160, y: 268, s: 1.75, pose: { ...POSE.stand, face: 'neutral' } };
    const k = rig(kiz);
    const zip: P = [k.neck[0], k.neck[1] + 34];
    const pull: P = [zip[0], zip[1] + 4];
    const whistle: P = [zip[0] - 2, zip[1] + 26];
    return (
      <Scene2 bg="outdoor">
        <Tree x={292} y={200} s={0.9} kind="pine" />
        <Tree x={30} y={200} s={0.8} />
        <Person {...kiz} over={() => (
          <g>
            {/* fermuar */}
            <path d={`M${k.neck[0]} ${k.neck[1] + 8}V${k.hip[1] - 4}`} stroke={shade(K.role.victim, 0.4)} stroke-width={2.4} />
            {/* göğüs cebinde ad kâğıdı */}
            <OG sh={[{ d: rrect(k.neck[0] + 10, k.neck[1] + 22, 16, 20, 2), f: M.paper, t: `rotate(-6 ${k.neck[0] + 18} ${k.neck[1] + 32})` }, { d: rrect(k.neck[0] + 8, k.neck[1] + 34, 22, 18, 3), f: shade(K.role.victim, 0.15) }]} />
            <path d={`M${k.neck[0] + 13} ${k.neck[1] + 27}h9M${k.neck[0] + 13} ${k.neck[1] + 31}h7`} stroke={K.ink} stroke-width={1.4} />
            <Rope pts={[pull, [pull[0] - 3, pull[1] + 12], whistle]} w={1.8} c="#e2574c" />
            <OG sh={[{ d: rrect(whistle[0] - 5, whistle[1] - 2, 10, 20, 4), f: K.action }, { d: circ([whistle[0], whistle[1] + 14], 6), f: K.action }]} />
          </g>
        )} />
        <Ring x={whistle[0]} y={whistle[1] + 8} r={22} />
      </Scene2>
    );
  },

  /* ─────────── HAYVANLA YOLCULUK ─────────── */
  'sf-yy-hayvan-su': () => {
    // Arkada sırayla hayvanlar, önde her birinin günlük suyu kadar büyüyen kap.
    const by = 232;
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Dog x={38} y={180} s={0.8} />
        <Sheep x={104} y={182} s={0.85} />
        <Goat x={168} y={182} s={0.85} />
        <Equid x={250} y={186} s={0.6} c={M.horse} d={shade(M.horse, 0.2)} l={tint(M.horse, 0.4)} ears="short" mane="#4a3424" />
        <Bowl x={40} y={by} s={0.8} />
        <Bucket x={104} y={by} s={0.6} water />
        <Bucket x={168} y={by} s={0.85} water />
        <OG sh={[{ d: 'M214 236L220 196H300L306 236Z', f: M.woodD }, { d: rrect(222, 196, 76, 8, 2), f: K.water, ln: true }]} />
      </Scene2>
    );
  },

  'sf-yy-tavuk-kafes': () => {
    const p0: PersonProps = { ...CAST.coban, x: 110, y: 230, s: 1.15, pose: { ...POSE.walk, face: 'neutral' } };
    const r0 = rig(p0);
    const hand: P = [r0.hip[0] + 56, r0.hip[1] + 2];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: hand }, handF: 'fist' } };
    const bw = 86, bh = 58;
    const bx = hand[0] - bw / 2, by = hand[1] + 18;
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Tree x={290} y={204} s={0.9} />
        <Person {...p} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        {/* sepet arkası */}
        <OG sh={[{ d: rrect(bx, by, bw, bh, 10), f: shade(M.wicker, 0.35) }]} />
        <Hen x={bx + 30} y={by + 50} s={1.0} />
        <Hen x={bx + 62} y={by + 52} s={0.9} c="#e8e2d6" />
        {/* sepet örgüsü: seyrek çubuklar, aralarında hava delikleri */}
        <OG sh={[
          ...[0, 1, 2, 3, 4].map((i) => ({ d: rrect(bx + 4 + i * 19, by + 4, 6, bh - 8, 2), f: M.wicker } as Sh)),
          { d: rrect(bx - 2, by - 4, bw + 4, 10, 4), f: shade(M.wicker, 0.1) },
          { d: rrect(bx - 2, by + bh - 8, bw + 4, 10, 4), f: shade(M.wicker, 0.1) },
        ]} />
        {/* sap ve kapak bağı */}
        <Rope pts={[[bx + 14, by - 2], [hand[0], hand[1] - 2], [bx + bw - 14, by - 2]]} w={3.4} c={M.woodD} />
        <Rope pts={[[bx + 52, by - 4], [bx + 58, by + 8], [bx + 64, by - 4]]} w={2} />
        <Person {...p} only={['armF']} />
      </Scene2>
    );
  },

  'sf-yy-suru-golge': () => {
    const gy = 196;
    const coban: PersonProps = { ...CAST.coban, x: 266, y: 226, s: 0.95, flip: true, pose: { ...POSE.sitFloor, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Sun x={286} y={36} r={15} />
        <ellipse cx={142} cy={218} rx={142} ry={20} fill="#3f6b2f" opacity={0.55} />
        <Tree x={140} y={206} s={1.7} />
        <Sheep x={36} y={222} s={0.85} lie />
        <Sheep x={88} y={232} s={0.85} lie flip />
        <Sheep x={176} y={230} s={0.85} lie />
        <Person {...coban} />
      </Scene2>
    );
  },

  /* ─────────── YÜK HAYVANI ─────────── */
  'sf-yy-semer-kece': () => {
    // Seyis eşeğin arkasında; iki eliyle kalın keçeyi sırta yayıyor.
    const gy = 224, x = 170, s = 1.1;
    const backY = gy - 100 * s;
    const feltL: P = [x - 42 * s, backY - 8], feltR: P = [x + 34 * s, backY - 8];
    const sey: PersonProps = { ...CAST.seyis, x: 78, y: 230, s: 1.05, pose: { ...POSE.standSide, spine: -84, armB: { to: [feltL[0] + 8, feltL[1] + 4] }, armF: { to: [feltL[0] + 24, feltL[1] - 2] }, handB: 'flat', handF: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={196}>
        <Equid x={x} y={gy} s={s} />
        <Person {...sey} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        {/* katlanmış kalın keçe */}
        <OG sh={[
          { d: `M${feltL[0]} ${feltL[1] + 2}Q${x} ${feltL[1] - 12} ${feltR[0]} ${feltR[1] + 2}L${feltR[0] + 2} ${feltR[1] + 32}H${feltL[0] - 2}Z`, f: M.felt },
          { d: `M${feltL[0]} ${feltL[1] + 10}Q${x} ${feltL[1] - 4} ${feltR[0]} ${feltR[1] + 10}`, st: tint(M.felt, 0.3), sw: 2 },
        ]} />
        <Person {...sey} only={['armF']} />
        {/* yerde semer */}
        <OG sh={[{ d: 'M250 232Q254 210 276 206Q300 210 306 232Z', f: '#8a5a3c' }, { d: 'M258 232Q262 218 276 216Q292 218 298 232', st: shade('#8a5a3c', 0.3), sw: 2 }]} />
        <Arrow from={[x + 4, 26]} to={[x + 4, feltL[1] - 18]} w={5} />
        <Ok x={x + 64} y={46} />
      </Scene2>
    );
  },

  'sf-yy-heybe-denge': () => {
    // Arkadan eşek: iki yanda eşit heybe. Küçük ekte tek yana sarkmış yük.
    const donkeyBack = (cx: number, gy: number, s: number, tilt: boolean) => {
      const bag = (side: -1 | 1, drop: number, big: number) => {
        const bx = cx + side * (40 + big * 4) * s;
        return <OG ow={OW / s} sh={[{ d: rrect(bx - (16 + big * 4) * s, gy - (110 - drop) * s, (32 + big * 8) * s, (40 + big * 10) * s, 8 * s), f: side < 0 ? M.sack : M.sack }, { d: rrect(bx - (16 + big * 4) * s, gy - (110 - drop) * s, (32 + big * 8) * s, 10 * s, 4 * s), f: M.sackD }]} />;
      };
      return (
        <g>
          <ellipse cx={cx} cy={gy} rx={48 * s} ry={5 * s} fill="#000" opacity={0.12} />
          {/* baş ve kulaklar (uzakta, gövdenin üstünden) */}
          <OG ow={OW / s} sh={[
            { d: `M${cx - 14 * s} ${gy - 128 * s}Q${cx - 26 * s} ${gy - 170 * s} ${cx - 20 * s} ${gy - 172 * s}Q${cx - 12 * s} ${gy - 160 * s} ${cx - 6 * s} ${gy - 130 * s}Z`, f: M.donkey },
            { d: `M${cx + 14 * s} ${gy - 128 * s}Q${cx + 26 * s} ${gy - 170 * s} ${cx + 20 * s} ${gy - 172 * s}Q${cx + 12 * s} ${gy - 160 * s} ${cx + 6 * s} ${gy - 130 * s}Z`, f: M.donkey },
            { d: ell([cx, gy - 126 * s], 16 * s, 12 * s), f: M.donkey },
            // ön bacaklar (arkada)
            { d: capsule([cx - 14 * s, gy - 60 * s], 6 * s, [cx - 14 * s, gy - 4 * s], 4 * s), f: M.donkeyD },
            { d: capsule([cx + 14 * s, gy - 60 * s], 6 * s, [cx + 14 * s, gy - 4 * s], 4 * s), f: M.donkeyD },
            // sağrı
            { d: smooth([[cx - 34 * s, gy - 66 * s], [cx - 36 * s, gy - 102 * s], [cx, gy - 116 * s], [cx + 36 * s, gy - 102 * s], [cx + 34 * s, gy - 66 * s], [cx, gy - 56 * s]], true), f: M.donkey },
            // arka bacaklar
            { d: capsule([cx - 22 * s, gy - 66 * s], 9 * s, [cx - 24 * s, gy - 6 * s], 5 * s), f: M.donkey },
            { d: capsule([cx + 22 * s, gy - 66 * s], 9 * s, [cx + 24 * s, gy - 6 * s], 5 * s), f: M.donkey },
            { d: rrect(cx - 30 * s, gy - 8 * s, 12 * s, 8 * s, 2), f: '#3b3537' },
            { d: rrect(cx + 18 * s, gy - 8 * s, 12 * s, 8 * s, 2), f: '#3b3537' },
            // kuyruk
            { d: capsule([cx, gy - 100 * s], 3 * s, [cx, gy - 64 * s], 3 * s), f: M.donkeyD },
          ]} />
          {/* semer ve kayışlar */}
          <OG ow={OW / s} sh={[{ d: `M${cx - 34 * s} ${gy - 112 * s}Q${cx} ${gy - 132 * s} ${cx + 34 * s} ${gy - 112 * s}L${cx + 32 * s} ${gy - 104 * s}Q${cx} ${gy - 120 * s} ${cx - 32 * s} ${gy - 104 * s}Z`, f: '#8a5a3c' }]} />
          {tilt ? <g>{bag(-1, 0, 0)}{bag(1, -26, 1)}</g> : <g>{bag(-1, 0, 0)}{bag(1, 0, 0)}</g>}
        </g>
      );
    };
    return (
      <Scene2 bg="outdoor" gy={200}>
        {donkeyBack(120, 230, 1.15, false)}
        {/* iki heybe aynı hizada */}
        <Dash a={[50, 98]} b={[190, 98]} color={K.safe} w={3} />
        <Ok x={196} y={40} />
        {/* ek: tek yana sarkmış yük */}
        <rect x={226} y={120} width={86} height={108} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />
        {donkeyBack(262, 222, 0.5, true)}
        <Bad x={298} y={134} r={11} />
      </Scene2>
    );
  },

  'sf-yy-kolan-kuskun': () => {
    // Yandan yüklü katır; kolan ön bacakların hemen arkasından göğüs altına dolanıyor.
    // Sağ üstte yuvarlak ek: kolanın altına sokulmuş bir parmak.
    const gy = 224, x = 104, s = 1.2;
    const P_ = (px: number, py: number): P => [x + px * s, gy + py * s];
    const strap = '#3b3f4b';
    const ex = 270, ey = 60, er = 44;
    return (
      <Scene2 bg="outdoor" gy={196}>
        <Equid x={x} y={gy} s={s} c={M.mule} d={M.muleD} l={tint(M.mule, 0.45)} />
        {/* keçe + semer + yük */}
        <OG sh={[
          { d: `M${P_(-38, -98)[0]} ${P_(-38, -98)[1]}Q${x} ${P_(0, -114)[1]} ${P_(38, -96)[0]} ${P_(38, -96)[1]}L${P_(36, -86)[0]} ${P_(36, -86)[1]}H${P_(-36, -88)[0]}Z`, f: M.felt },
          { d: rrect(P_(-30, -126)[0], P_(-30, -126)[1], 54 * s, 26 * s, 8), f: M.sack },
          { d: rrect(P_(-32, -96)[0], P_(-32, -96)[1], 40 * s, 30 * s, 6), f: M.sackD },
        ]} />
        {/* kolan: semerden göğüs altına */}
        <OG sh={[{ d: `M${P_(12, -92)[0]} ${P_(12, -92)[1]}L${P_(20, -92)[0]} ${P_(20, -92)[1]}L${P_(22, -55)[0]} ${P_(22, -55)[1]}L${P_(13, -55)[0]} ${P_(13, -55)[1]}Z`, f: strap }]} />
        <Ring x={P_(17, -62)[0]} y={P_(17, -62)[1]} r={15} />
        {/* ek: kolanın altına bir parmak */}
        <g>
          <clipPath id="yy-kolan-ek"><circle cx={ex} cy={ey} r={er - 1} /></clipPath>
          <circle cx={ex} cy={ey} r={er} fill={M.mule} />
          <g clip-path="url(#yy-kolan-ek)">
            <rect x={ex - er} y={ey - er} width={er * 2} height={er * 2} fill={M.mule} />
            <Hand x={ex - 52} y={ey + 6} a={90} s={0.75} pose="point" side="R" arm={60} sleeve={K.role.bystander4} skin={CAST.seyis.skin} />
            <OG sh={[{ d: rrect(ex - 12, ey - er - 4, 26, er * 2 + 8, 3), f: strap }]} />
          </g>
          <circle cx={ex} cy={ey} r={er} fill="none" stroke={K.out} stroke-width={2.5} />
          <path d={`M${P_(28, -66)[0]} ${P_(28, -66)[1]}L${ex - er * 0.8} ${ey + er * 0.6}`} stroke={K.out} stroke-width={1.5} stroke-dasharray="4 4" />
        </g>
      </Scene2>
    );
  },

  /* ─────────── EL ARABASI ─────────── */
  'sf-yy-el-arabasi-yuk': () => {
    const gy = 226;
    const wx = 200;
    const handle: P = [wx - 104 * 1.1, gy - 44 * 1.1];
    const p: PersonProps = { ...CAST.araba1, x: handle[0] - 34, y: gy + 2, s: 1.05, pose: { ...POSE.walk, spine: -78, armF: { to: handle }, armB: { to: [handle[0] - 4, handle[1] + 2] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={200} ground="dirt">
        <Person {...p} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        <Wheelbarrow x={wx} y={gy} s={1.1} load="ok" />
        <Person {...p} only={['armF']} />
        <Ok x={wx - 10} y={70} />
        {/* ek: kollara yakın yığılmış */}
        <rect x={226} y={12} width={86} height={72} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />
        <Wheelbarrow x={296} y={76} s={0.5} load="bad" />
        <Bad x={300} y={24} r={10} />
      </Scene2>
    );
  },

  'sf-yy-araba-inis-ip': () => {
    // Yokuş sağa doğru iniyor: önde (aşağıda) araba, onu kollarından tutan kişi; yukarıda ipi tutup geriye yaslanan ikinci kişi.
    const k = 0.18;
    const sy = (x: number) => 162 + x * k;
    const a = Math.atan(k) * R2D, ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
    const loc = (wx: number, wy: number, lx: number, ly: number): P => [wx + lx * ca - ly * sa, wy + lx * sa + ly * ca];
    const wx = 266, wy = sy(266);
    const handle = loc(wx, wy, -104, -44);
    const tie = loc(wx, wy, -84, -38);
    const p1: PersonProps = { ...CAST.araba1, x: handle[0] - 28, y: sy(handle[0] - 28) + 3, s: 1.0, pose: { ...POSE.standSide, spine: -96, head: -86, legB: [104, 98], legF: [74, 82], armF: { to: handle }, armB: { to: [handle[0] - 3, handle[1] + 2] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const hold: P = [86, 122];
    const p2: PersonProps = { ...CAST.araba2, x: 48, y: sy(48) + 3, s: 1.0, pose: { spine: -112, chest: -108, head: -96, legB: [106, 98], legF: [54, 72], armF: { to: hold }, armB: { to: [hold[0] - 6, hold[1] + 2] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={240}>
        <path d={`M0 ${sy(0)}L320 ${sy(320)}V240H0Z`} fill={K.dirt} stroke={K.out} stroke-width={1.5} />
        <Rope pts={[hold, lerp(hold, tie, 0.5), tie]} w={2.6} />
        <Person {...p2} />
        <Person {...p1} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        <Wheelbarrow x={wx} y={wy + 1} s={1} a={a} load="ok" />
        <Person {...p1} only={['armF']} />
        <Arrow from={[124, 84]} to={[62, 72]} w={5} />
      </Scene2>
    );
  },

  /* ─────────── YERLEŞİM YERİ ─────────── */
  'sf-yy-yer-su': () => {
    const gy = 200;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d="M0 60Q60 64 110 120Q150 170 210 190L320 196V240H0Z" fill="#a9cf86" stroke={K.out} stroke-width={1.5} />
        <path d="M0 200H320V240H0Z" fill={K.grass} />
        <Rock x={70} y={98} s={1.0} />
        {/* kaynak ve aşağı inen su */}
        <path d="M84 94Q96 110 102 130Q112 152 134 170Q150 182 160 196" stroke={K.water} stroke-width={6} fill="none" stroke-linecap="round" />
        <OG sh={[{ d: ell([84, 96], 10, 5), f: K.water }]} />
        <Tree x={30} y={86} s={0.7} kind="pine" />
        <HouseExt x={184} y={216} w={58} h={40} />
        <HouseExt x={250} y={214} w={54} h={38} color="#e8cfae" />
        <Dash a={[96, 104]} b={[196, 180]} w={3} />
        <Label x={168} y={116} text="200 m" size={15} />
      </Scene2>
    );
  },

  'sf-yy-yer-sel': () => {
    // Kesit: ortada dere; kıyı ağacında taşkın izi; ev yüksekte, çadır dere kenarında.
    return (
      <Scene2 bg="outdoor" gy={240}>
        <path d="M0 120Q50 120 90 170L130 206H190L230 170Q262 150 320 120V240H0Z" fill="#a9cf86" stroke={K.out} stroke-width={1.5} />
        <Water x={130} y={198} w={60} h={42} />
        <path d="M78 160H244" stroke="#8a6a45" stroke-width={2.5} stroke-dasharray="6 5" />
        <Tree x={104} y={184} s={0.75} />
        <OG sh={[{ d: 'M88 158Q100 152 112 160Q104 166 92 164Z', f: '#8a6a45' }]} />
        <Ring x={102} y={158} r={14} />
        {/* ev, iz çizgisinin çok üstünde */}
        <HouseExt x={256} y={142} w={50} h={34} />
        <Ok x={300} y={84} />
        {/* çadır dere kenarında */}
        <g transform="translate(212 191) scale(0.42)"><path d="M-48 0L-4 -56L48 0Z" fill="#e0813c" stroke={K.out} stroke-width={3.4} /><path d="M-4 -56L-14 0H6Z" fill="#8c4a20" /></g>
        <Bad x={236} y={176} r={11} />
      </Scene2>
    );
  },

  'sf-yy-yer-egim': () => {
    const panel = (x: number, d: string, ok: boolean, label: string, extra?: JSX.Element) => (
      <g>
        <rect x={x} y={60} width={96} height={120} rx={10} fill={K.sky} stroke={K.out} stroke-width={2} />
        <path d={d} fill="#a9cf86" stroke={K.out} stroke-width={1.5} />
        {extra}
        {ok ? <Ok x={x + 82} y={74} /> : <Bad x={x + 82} y={74} />}
        <T x={x + 48} y={210} t={label} size={16} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {panel(8, 'M9 150L103 134V179H9Z', true, '%2–4', <HouseExt x={40} y={148} w={34} h={24} />)}
        {panel(112, 'M113 150H207V179H113Z', false, 'düz', <g><ellipse cx={150} cy={152} rx={26} ry={4} fill={K.water} /><ellipse cx={184} cy={156} rx={14} ry={3} fill={K.water} /><path d="M126 150v-10M130 150v-8M196 150v-9" stroke={K.grassShade} stroke-width={2} /></g>)}
        {panel(216, 'M217 179L311 96V179Z', false, '%10+', <g><Rock x={244} y={174} s={0.5} /><Rock x={262} y={160} s={0.4} /></g>)}
      </Scene2>
    );
  },
  /* ─────────── KAR AYAKKABISI ─────────── */
  'sf-yy-kar-ayakkabi-cerceve': () => {
    // Uzun esnek dal ortadan bükülmüş: önde yuvarlak burun, arkada iki uç üst üste getirilip iple sarılıyor.
    const pts: P[] = [[250, 120], [224, 70], [176, 50], [124, 66], [96, 104], [104, 140], [150, 158], [214, 176], [280, 196]];
    const pts2: P[] = [[250, 120], [262, 150], [280, 186], [296, 214]];
    const tie: P = [270, 178];
    return (
      <Scene2 bg="closeup">
        <path d={smooth(pts)} fill="none" stroke={K.out} stroke-width={11} stroke-linecap="round" />
        <path d={smooth(pts)} fill="none" stroke={M.woodL} stroke-width={8} stroke-linecap="round" />
        <path d={smooth(pts2)} fill="none" stroke={K.out} stroke-width={11} stroke-linecap="round" />
        <path d={smooth(pts2)} fill="none" stroke={M.woodL} stroke-width={8} stroke-linecap="round" />
        {/* ip sargısı */}
        {[-8, -2, 4, 10].map((d, i) => <path key={i} d={`M${tie[0] - 12 + d} ${tie[1] - 10 + d * 1.3}l18 -6`} stroke={K.out} stroke-width={5} stroke-linecap="round" />)}
        {[-8, -2, 4, 10].map((d, i) => <path key={'r' + i} d={`M${tie[0] - 12 + d} ${tie[1] - 10 + d * 1.3}l18 -6`} stroke={M.rope} stroke-width={3} stroke-linecap="round" />)}
        {/* burnu büken el */}
        <Hand x={60} y={44} a={130} s={0.9} pose="hold" side="L" arm={70} sleeve={K.role.bystander4} skin={CAST.kisci.skin} grip={30} />
        <Arrow from={[150, 30]} to={[86, 74]} bend={0.35} w={5} />
        <Dim a={[96, 214]} b={[290, 214]} w={3} />
        <Label x={190} y={232} text="≈ 1 m" size={13} />
      </Scene2>
    );
  },

  'sf-yy-kar-ayakkabi-bag': () => {
    // Yukarıdan: çerçeve, enine çubuk, ip örgü; bot burnu kalın çubuğa X ile bağlı, ip topuğun arkasından dolanıyor.
    const cx = 116, cy = 124;
    const toeBar = cy - 20;
    return (
      <Scene2 bg="dark">
        <rect x={0} y={0} width={320} height={240} fill={M.snow} />
        <Snowshoe x={cx} y={cy} s={1.45} />
        {/* bot (yukarıdan) */}
        <OG sh={[{ d: smooth([[cx, toeBar - 30], [cx + 17, toeBar - 18], [cx + 18, toeBar + 30], [cx + 14, toeBar + 64], [cx, toeBar + 72], [cx - 14, toeBar + 64], [cx - 18, toeBar + 30], [cx - 17, toeBar - 18]], true), f: '#6b4f3a' }, { d: ell([cx, toeBar + 46], 11, 16), f: '#4a3628' }]} />
        {/* X bağ burunda, ip topuk arkasından */}
        <Rope pts={[[cx - 22, toeBar - 2], [cx + 22, toeBar + 26]]} w={3} />
        <Rope pts={[[cx + 22, toeBar - 2], [cx - 22, toeBar + 26]]} w={3} />
        <Rope pts={[[cx - 20, toeBar + 22], [cx - 22, toeBar + 62], [cx, toeBar + 80], [cx + 22, toeBar + 62], [cx + 20, toeBar + 22]]} w={3} />
        {/* ek: yandan, topuk kalkıyor */}
        <rect x={204} y={70} width={108} height={100} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: rrect(214, 146, 90, 6, 3), f: M.woodL }]} />
        <G x={236} y={146} a={-28}>
          <OG sh={[{ d: 'M0 0H44Q50 -2 48 -12L36 -16L30 -40H14V-16L0 -10Z', f: '#6b4f3a' }]} />
        </G>
        <circle cx={238} cy={146} r={4} fill={K.action} stroke={K.out} stroke-width={1.5} />
        <Arrow from={[290, 140]} to={[282, 96]} bend={-0.3} w={4} />
      </Scene2>
    );
  },

  'sf-yy-cam-dali-ayakkabi': () => {
    // Yandan: karda ters konmuş çam dalı; kalın ucu bota iple bağlı.
    const gy = 196;
    const needles = (x0: number, x1: number, y: number) => Array.from({ length: Math.floor((x1 - x0) / 8) }, (_, i) => {
      const x = x0 + i * 8;
      return <path key={i} d={`M${x} ${y}l-10 -12M${x} ${y}l-10 10`} stroke={K.pine} stroke-width={3} stroke-linecap="round" />;
    });
    return (
      <Scene2 bg="outdoor" gy={gy} ground="snow">
        <Tree x={36} y={194} s={0.9} kind="pine" />
        <Tree x={290} y={192} s={0.8} kind="pine" />
        {/* dal: kalın uç önde (sağda), yapraklar yukarı kıvrık */}
        <g>
          {needles(62, 238, 204)}
          <Rod a={[54, 206]} b={[252, 204]} w={7} c={K.trunk} />
          {needles(66, 236, 204).map((n, i) => <g key={'u' + i} transform="translate(0 -6)">{n}</g>)}
        </g>
        {/* alt bacak ve bot */}
        <OG sh={[{ d: 'M178 -6H216L212 172H182Z', f: CAST.kisci.bottomC }]} />
        <OG sh={[{ d: 'M176 168H214Q222 170 230 178L250 184Q258 188 256 200H174Z', f: '#6b4f3a' }, { d: 'M174 196H256V202H174Z', f: '#3b3537' }]} />
        {/* bağcık deliklerinden geçen ip, dalın kalın ucuna */}
        <Rope pts={[[200, 176], [222, 186], [244, 202], [234, 208], [214, 204], [200, 190]]} w={2.6} />
        <Rope pts={[[186, 178], [192, 196], [200, 208]]} w={2.6} />
        <Ok x={282} y={60} />
      </Scene2>
    );
  },

  /* ─────────── BUZ KALINLIĞI ─────────── */
  'sf-yy-buz-renk': () => {
    const slab = (x: number, c: string, extra?: JSX.Element) => (
      <g>
        <rect x={x} y={130} width={92} height={74} fill={K.water} />
        <OG sh={[{ d: rrect(x, 96, 92, 40, 3), f: c }]} />
        {extra}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {slab(10, M.iceClear, <path d="M24 106l14 8M60 104l10 12" stroke="#fff" stroke-width={2.4} opacity={0.8} />)}
        {slab(114, M.iceWhite, <g fill="#c9d6de">{[[128, 108], [150, 120], [170, 104], [188, 124], [138, 126]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} />)}</g>)}
        {slab(218, M.iceGrey, <g><ellipse cx={250} cy={100} rx={18} ry={3} fill={K.water} /><path d="M232 112l20 14M276 106l-8 22" stroke="#7d878e" stroke-width={2} /></g>)}
        <Ok x={56} y={70} r={16} />
        <Label x={160} y={70} text="× 2" size={18} />
        <Bad x={264} y={70} r={16} />
      </Scene2>
    );
  },

  'sf-yy-buz-olcu': () => {
    // Kesit: buzda açılmış delik, işaretli çubuk; yanında diz çökmüş kişi ve keski.
    const iceT = 130, iceB = 162; // buz üst/alt
    const hx = 196; // delik ortası
    const p: PersonProps = { ...CAST.buzcu, x: 128, y: iceT + 2, s: 1.0, pose: { ...POSE.kneel, spine: -70, chest: -62, head: -50, armF: { to: [hx - 2, iceT - 28] }, armB: { to: [hx - 6, iceT - 18] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={iceT}>
        <rect x={0} y={iceT} width={320} height={110} fill={K.water} />
        <OG sh={[{ d: `M0 ${iceT}H${hx - 9}V${iceB}H0Z`, f: M.iceClear }, { d: `M${hx + 9} ${iceT}H320V${iceB}H${hx + 9}Z`, f: M.iceClear }]} />
        <Person {...p} />
        {/* keski yerde */}
        <G x={70} y={iceT - 4} a={0}><OG sh={[{ d: rrect(-24, -4, 40, 8, 3), f: M.woodD }, { d: 'M16 -3H34L38 0L34 3H16Z', f: M.iron }]} /></G>
        {/* işaretli çubuk: delikten aşağı, alt ucundaki kanca buzun altına takılı */}
        <OG sh={[{ d: rrect(hx - 3, iceT - 40, 6, iceB - iceT + 46, 2), f: M.woodL }, { d: `M${hx - 3} ${iceB + 2}H${hx + 16}V${iceB - 4}H${hx + 10}V${iceB - 2}H${hx - 3}Z`, f: M.iron }]} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${hx - 3} ${iceT - 36 + i * 9}h${i % 2 ? 4 : 6}`} stroke={K.ink} stroke-width={1.6} />)}
        <Dim a={[hx + 34, iceT]} b={[hx + 34, iceB]} w={3} />
        <Label x={hx + 66} y={iceT - 30} text="15 / 20 cm" size={14} />
      </Scene2>
    );
  },

  'sf-yy-buz-dikeni': () => {
    // Göğüs yakın planı: boyna asılı iki buz dikeni, iple birbirine bağlı.
    const p: PersonProps = { ...CAST.buzcu, x: 160, y: 72, ax: 'head', ay: 'head', s: 2.3, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const l: P = [r.neck[0] - 11, r.neck[1] + 46], rr: P = [r.neck[0] + 11, r.neck[1] + 46];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head', 'armB', 'armF']} />
        <Rope pts={[[r.neck[0] - 14, r.neck[1] + 4], [l[0] - 4, l[1] - 30], l]} w={2.6} />
        <Rope pts={[[r.neck[0] + 14, r.neck[1] + 4], [rr[0] + 4, rr[1] - 30], rr]} w={2.6} />
        <G x={l[0]} y={l[1] + 24} s={1.5} a={90}><OG ow={OW / 1.5} sh={[{ d: rrect(-16, -6, 32, 12, 5), f: M.woodL }, { d: rrect(14, -5, 7, 10, 3), f: '#c9a26a' }]} /></G>
        <G x={rr[0]} y={rr[1] + 24} s={1.5} a={90}><OG ow={OW / 1.5} sh={[{ d: rrect(-16, -6, 32, 12, 5), f: M.woodL }, { d: rrect(14, -5, 7, 10, 3), f: '#c9a26a' }]} /></G>
        {/* ek: kılıfı çıkmış uç */}
        <rect x={234} y={150} width={78} height={78} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />
        <IcePick x={262} y={190} s={1.4} a={0} />
      </Scene2>
    );
  },

  /* ─────────── BUZA DÜŞME ─────────── */
  'sf-yy-buz-cikis-kollar': () => {
    // Kesit: delikte suda kişi; kollar geldiği yöndeki buzda, bacaklar arkada yatay.
    const iceT = 128, iceB = 146;
    const edge = 150; // sağdaki sağlam buzun kenarı
    const p: PersonProps = { ...CAST.dusen, x: 78, y: 164, ay: 'hip', s: 1.0, shadow: false, pose: { spine: -24, chest: -22, head: -50, armF: { to: [edge + 52, iceT - 4] }, armB: { to: [edge + 40, iceT - 2] }, handF: 'fist', handB: 'fist', legB: [176, 186], legF: [170, 176], footB: -80, footF: -70, face: 'worried' } };
    return (
      <Scene2 bg="outdoor" gy={iceT}>
        <rect x={0} y={iceT} width={320} height={112} fill={K.water} />
        <OG sh={[{ d: `M0 ${iceT}H34L30 ${iceB}H0Z`, f: M.iceClear }]} />
        <Person {...p} />
        <rect x={34} y={iceT + 6} width={edge - 34} height={110} fill={K.water} opacity={0.55} />
        <path d={`M34 ${iceT + 6}q8 -4 16 0t16 0t16 0t16 0t16 0t16 0t16 0`} stroke={K.waterLight} stroke-width={2.4} fill="none" />
        <OG sh={[{ d: `M${edge} ${iceT}H320V${iceB}H${edge + 4}Z`, f: M.iceClear }]} />
        <Person {...p} only={['armB', 'armF']} />
        <Arrow from={[edge + 20, iceT - 50]} to={[edge + 100, iceT - 50]} w={6} />
        <Waves x={30} y={iceT + 38} a={180} n={3} r={7} />
      </Scene2>
    );
  },

  'sf-yy-buz-yuvarlan': () => {
    // Yandan: buzun üstüne çıkmış kişi yatarak delikten uzağa yuvarlanıyor. Ek: ayağa kalkan kişi yasak.
    const iceT = 170, iceB = 190;
    const p: PersonProps = { ...CAST.dusen, x: 176, y: iceT, s: 0.95, pose: { ...POSE.lieBack, face: 'worried', armB: [-150, -170], armF: [-30, -10] } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" gy={iceT}>
        <rect x={0} y={iceT} width={320} height={70} fill={K.water} />
        <OG sh={[{ d: `M0 ${iceT}H36V${iceB}H0Z`, f: M.iceClear }, { d: `M82 ${iceT}H320V${iceB}H86Z`, f: M.iceClear }]} />
        <Person {...p} />
        {[0, 1, 2].map((i) => <Sweat key={i} x={r.hip[0] - 30 + i * 30} y={iceT + 2} s={0.9} />)}
        {/* yuvarlanma oku */}
        <path d="M150 128a28 28 0 1 1 40 6" fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
        <path d="M150 128a28 28 0 1 1 40 6" fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" />
        <Arrow from={[200, 120]} to={[290, 120]} w={6} />
        {/* ek: ayağa kalkan kişi */}
        <rect x={10} y={12} width={84} height={104} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />
        <rect x={10} y={92} width={84} height={24} rx={0} fill={M.iceClear} />
        <Person {...CAST.dusen} x={52} y={102} s={0.48} pose={{ ...POSE.stand, face: 'worried' }} />
        <path d="M30 104l12 6l-6 4l14 2" stroke={K.out} stroke-width={1.6} fill="none" />
        <Bad x={84} y={24} r={10} />
      </Scene2>
    );
  },

  'sf-yy-buz-kurtarma-yatarak': () => {
    // Kıyıda yüzüstü yatan kurtarıcı, uzun dalı buzdaki deliğe uzatıyor. Ek: buzda koşan kişi yasak.
    const shoreEnd = 110, iceT = 196;
    const resc: PersonProps = { ...CAST.buzcu, x: 56, y: iceT, s: 0.9, pose: { spine: 2, chest: -2, head: -40, legB: [178, 182], legF: [182, 180], footB: -95, footF: -85, armB: [-16, -4], armF: [-12, -8], face: 'worried' } };
    const rr = rig(resc);
    const hold: P = rr.wristF;
    const hole0 = 222, hole1 = 286;
    const vic: PersonProps = { ...CAST.dusen, x: 254, y: iceT + 96, s: 0.85, shadow: false, pose: { view: 'front', armB: { to: [hole0 - 4, iceT - 6] }, armF: { to: [hole1 + 2, iceT - 4] }, handB: 'fist', face: 'worried' } };
    const v = rig(vic);
    const tip: P = [v.handB[0] + 2, v.handB[1] - 2];
    const a0 = ang(hold, tip);
    return (
      <Scene2 bg="outdoor" gy={iceT}>
        <Tree x={24} y={190} s={0.8} kind="pine" />
        <rect x={shoreEnd} y={iceT} width={210} height={44} fill={K.water} />
        <OG sh={[{ d: `M${shoreEnd} ${iceT}H${hole0}V${iceT + 12}H${shoreEnd}Z`, f: M.iceClear }, { d: `M${hole1} ${iceT}H320V${iceT + 12}H${hole1}Z`, f: M.iceClear }]} />
        <Person {...vic} />
        <rect x={hole0} y={iceT + 6} width={hole1 - hole0} height={40} fill={K.water} opacity={0.6} />
        <path d={`M0 ${iceT}H${shoreEnd}Q${shoreEnd + 8} ${iceT + 6} ${shoreEnd + 2} 240H0Z`} fill={K.dirt} stroke={K.out} stroke-width={1.5} />
        <Rod a={pol(hold, a0, -16)} b={tip} w={5} c={K.trunk} />
        <Person {...resc} />
        <Arrow from={pol(pol(hold, a0, 20), a0 - 90, 22)} to={pol(pol(tip, a0, -20), a0 - 90, 22)} w={5} />
        {/* ek: buzda koşan kişi yasak */}
        <rect x={214} y={12} width={96} height={96} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />
        <rect x={214} y={86} width={96} height={22} fill={M.iceClear} />
        <Person {...CAST.buzcu} x={262} y={96} s={0.44} pose={{ ...POSE.run, face: 'worried' }} />
        <No x={262} y={60} r={34} />
      </Scene2>
    );
  },

  /* ─────────── SİPER AYAĞI ─────────── */
  'sf-yy-corap-degistir': () => (
    <Scene2 bg="closeup">
      {/* çıkarılmış ıslak çorap, damlalar */}
      <OG sh={[{ d: 'M24 214Q20 186 34 176L58 178Q66 196 92 200Q104 206 98 216Z', f: '#7c8794' }]} />
      {[[44, 226], [70, 230], [90, 224]].map(([x, y], i) => <Sweat key={i} x={x} y={y} s={1.1} />)}
      {/* ayak, kuru yün çorap yarıya kadar giyilmiş */}
      <BareFoot x={140} y={170} s={0.8} skin={CAST.siper.skin} />
      <OG sh={[{ d: 'M206 172Q240 172 272 166Q282 156 270 146Q240 140 212 130Q196 132 192 150Q196 168 206 172Z', f: '#d9d1c2' }]} />
      <path d="M220 134Q216 152 222 170M236 140Q232 156 238 170" stroke="#b9ae9b" stroke-width={2} fill="none" />
      <Hand x={150} y={56} a={150} s={0.8} pose="hold" side="L" arm={60} sleeve={K.role.bystander3} skin={CAST.siper.skin} grip={28} />
      <Arrow from={[244, 112]} to={[184, 112]} w={5} />
      <Ok x={280} y={52} r={15} />
    </Scene2>
  ),

  'sf-yy-ayak-havalandir': () => {
    const gy = 186;
    const p: PersonProps = { ...CAST.siper, x: 140, y: 222, s: 1.15, pose: { ...POSE.lieBack, face: 'neutral', legB: [-12, 0], legF: [-16, -4], footB: -80, footF: -80 }, shoes: null };
    const ra = rig(p);
    const pack: P = [ra.ankleB[0] - 4, ra.ankleB[1] + 12];
    return (
      <Scene2 bg="indoor" gy={gy} wall="#cdb89a">
        <OG sh={[{ d: rrect(20, 214, 290, 14, 4), f: M.felt }]} />
        <OG sh={[{ d: rrect(pack[0] - 30, pack[1] - 34, 60, 34, 8), f: '#c0603e' }, { d: rrect(pack[0] - 26, pack[1] - 44, 52, 14, 6), f: M.blanket }]} />
        <Person {...p} />
        {/* ayakkabılar ağzı açık */}
        <OG sh={[{ d: 'M250 186Q250 170 262 168L276 166Q280 156 290 158Q300 162 300 178V186Z', f: '#6b4f3a' }, { d: ell([286, 162], 8, 3), f: '#2c221b' }]} />
        <Waves x={pack[0] + 26} y={pack[1] - 70} a={-90} n={3} r={6} color={K.water} />
      </Scene2>
    );
  },

  'sf-yy-ayak-oda-isisi': () => {
    // Barınakta oturan kişi; kurulanmış çıplak ayak battaniye üstünde yüksekte. İki ek: soba ve su kabı yasak.
    const gy = 176;
    const p: PersonProps = { ...CAST.siper, x: 78, y: 226, s: 1.05, shoes: null, pose: { ...POSE.sitFloor, legB: [-6, 4], legF: [-14, 0], footB: -60, footF: -60, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={gy} wall="#cdb89a">
        <OG sh={[{ d: rrect(150, 186, 56, 22, 6), f: M.blanket }, { d: rrect(146, 204, 64, 22, 6), f: shade(M.blanket, 0.1) }]} />
        <Person {...p} />
        {/* ıslak çorap ve ayakkabı */}
        <OG sh={[{ d: 'M226 226Q224 210 234 206L248 208Q252 218 268 220Q276 224 272 228Z', f: '#7c8794' }]} />
        <Sweat x={250} y={234} />
        {/* ekler */}
        <rect x={214} y={14} width={46} height={90} rx={8} fill="#fff" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: rrect(222, 60, 30, 36, 3), f: '#3b3f4b' }, { d: rrect(228, 70, 18, 12, 2), f: K.fire }]} />
        <OG sh={[{ d: 'M222 40Q236 36 244 50L236 54Q232 46 222 48Z', f: K.skin[CAST.siper.skin] }]} />
        <Bad x={252} y={22} r={9} />
        <rect x={266} y={14} width={46} height={90} rx={8} fill="#fff" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: 'M272 74L276 96H302L306 74Z', f: M.tinD }, { d: ell([289, 74], 17, 4), f: K.water }]} />
        <OG sh={[{ d: 'M282 30H294V76H282Z', f: K.skin[CAST.siper.skin] }]} />
        <Bad x={304} y={22} r={9} />
      </Scene2>
    );
  },

  /* ─────────── KARDA YOLCULUK ─────────── */
  'sf-yy-kat-ac-kapa': () => {
    // Sol: yürürken ince katla, mont belde bağlı, bere elde; sağ: molada oturan kişi kalın mont ve bere giymiş.
    const gy = 200;
    const p1: PersonProps = { ...CAST.kisci, top: '#d9a13a', x: 80, y: 226, s: 0.95, pose: { ...POSE.walk, face: 'neutral' } };
    const r1 = rig(p1);
    const p2: PersonProps = { ...CAST.kisci, x: 236, y: 226, s: 0.95, pose: { ...POSE.sitFloor, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy} ground="snow">
        <Tree x={300} y={196} s={0.7} kind="pine" />
        <Tree x={150} y={194} s={0.6} kind="pine" />
        <Person {...p1} mid={(r) => <g><OG sh={[{ d: rrect(r.hip[0] - 18, r.hip[1] - 14, 36, 12, 5), f: '#b8433b' }, { d: 'M' + (r.hip[0] - 4) + ' ' + (r.hip[1] - 4) + 'l-6 30l12 0Z', f: '#b8433b' }]} /></g>} />
        <OG sh={[{ d: ell([r1.handF[0] + 4, r1.handF[1] + 6], 9, 6), f: '#2f5f8a' }]} />
        <path d="M160 30V220" stroke="#fff" stroke-width={3} stroke-dasharray="6 6" />
        <Person {...p2} over={(r) => <Beanie r={r} />} />
      </Scene2>
    );
  },

  'sf-yy-yarikli-gozluk': () => {
    const p: PersonProps = { ...CAST.kisci, x: 150, y: 110, ax: 'head', ay: 'head', s: 2.7, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const ey = r.head[1] + 2, R = r.headR;
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={170} width={320} height={70} fill={M.snow} />
        <Person {...p} only={['torso', 'head']} over={(rr) => <Beanie r={rr} />} />
        <Rope pts={[[r.head[0] - R * 1.05, ey], [r.head[0] - R * 1.1, ey + 6]]} w={2.4} />
        <Rope pts={[[r.head[0] + R * 1.05, ey], [r.head[0] + R * 1.1, ey + 6]]} w={2.4} />
        <OG sh={[{ d: `M${r.head[0] - R * 1.05} ${ey - 10}Q${r.head[0]} ${ey - 16} ${r.head[0] + R * 1.05} ${ey - 10}V${ey + 10}Q${r.head[0] + 10} ${ey + 8} ${r.head[0]} ${ey + 2}Q${r.head[0] - 10} ${ey + 8} ${r.head[0] - R * 1.05} ${ey + 10}Z`, f: M.woodL }]} />
        <path d={`M${r.head[0] - R * 0.66} ${ey - 1}h${R * 0.44}M${r.head[0] + R * 0.22} ${ey - 1}h${R * 0.44}`} stroke={K.ink} stroke-width={3.4} stroke-linecap="round" />
        {/* ek: isle karartılmış iç yüz */}
        <rect x={232} y={150} width={80} height={74} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: 'M240 178Q272 170 304 178V198Q284 194 272 188Q260 194 240 198Z', f: '#3b3537' }]} />
        <path d="M250 186h12M282 186h12" stroke="#fff" stroke-width={2.4} stroke-linecap="round" />
      </Scene2>
    );
  },
  /* ─────────── FARK EDİLMEZ ─────────── */
  'sf-yy-kuru-odun': () => {
    const logs = (cx: number, c: string, cEnd: string, crack: boolean) => (
      <g>
        {[[-26, 0], [0, 0], [26, 0], [-13, -20], [13, -20], [0, -40]].map(([dx, dy], i) => (
          <g key={i}>
            <OG sh={[{ d: circ([cx + dx, 214 + dy], 12), f: c }, { d: circ([cx + dx, 214 + dy], 7), f: cEnd, no: true }]} />
            {crack && <path d={`M${cx + dx} ${214 + dy}l6 -7M${cx + dx} ${214 + dy}l-5 6`} stroke={shade(cEnd, 0.4)} stroke-width={1.6} />}
          </g>
        ))}
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={200}>
        <path d="M160 20V230" stroke="#fff" stroke-width={3} stroke-dasharray="6 6" />
        {/* sol: kuru odun ateşi, ince az duman */}
        {logs(80, '#7a5434', '#c9a26a', true)}
        <path d="M80 150Q72 120 84 96Q94 74 86 50" stroke="#c8ccd2" stroke-width={4} fill="none" stroke-linecap="round" opacity={0.8} />
        <Ok x={130} y={40} />
        {/* sağ: yaş odun, kalın beyaz duman */}
        {logs(240, '#6c8a4a', '#d6e0a8', false)}
        {[[240, 150, 20], [226, 120, 24], [252, 96, 28], [232, 66, 30], [262, 44, 30]].map(([x, y, r], i) => <OG key={i} sh={[{ d: circ([x, y], r), f: '#eef0f2' }]} />)}
        <Bad x={296} y={140} />
      </Scene2>
    );
  },

  'sf-yy-pencere-perde': () => {
    const gy = 206;
    return (
      <Scene2 bg="night" gy={gy}>
        <OG sh={[{ d: rrect(20, 70, 280, 150, 2), f: M.adobe }, { d: 'M8 74L160 30L312 74Z', f: '#6b4f3a' }]} />
        {/* sol pencere: battaniyeyle kapalı, kenarda ince loş ışık */}
        <rect x={56} y={104} width={70} height={64} fill="#ffd77a" opacity={0.55} />
        <OG sh={[{ d: rrect(58, 106, 66, 60, 2), f: M.blanket }]} />
        <path d="M70 106V166M90 106V166M110 106V166" stroke={shade(M.blanket, 0.2)} stroke-width={2} />
        <rect x={50} y={98} width={82} height={76} fill="none" stroke={K.out} stroke-width={3} />
        <Ok x={92} y={196} />
        {/* sağ pencere: perdesiz, parlak */}
        <circle cx={230} cy={136} r={58} fill="#ffe9a0" opacity={0.3} />
        <rect x={192} y={98} width={82} height={76} fill="#ffe08a" stroke={K.out} stroke-width={3} />
        <path d="M233 98V174M192 136H274" stroke={K.out} stroke-width={3} />
        <No x={233} y={136} r={36} />
      </Scene2>
    );
  },

  'sf-yy-komsu-takas': () => {
    const shake: P = [160, 140];
    const a: PersonProps = { who: 'woman', skin: 1, hair: 'scarf', hairC: '#6c9c5a', role: 'bystander2', bottomC: K.pants.brown, sleeve: 'long', x: 116, y: 226, s: 1.12, pose: { ...POSE.standSide, armF: { to: shake }, handF: 'fist', face: 'calm' } };
    const b: PersonProps = { who: 'man', skin: 2, hair: 'short', hairC: K.hair.grey, role: 'bystander', bottomC: K.pants.dark, sleeve: 'long', mustache: true, x: 204, y: 226, s: 1.12, flip: true, pose: { ...POSE.standSide, armF: { to: [shake[0] + 2, shake[1]] }, handF: 'fist', face: 'calm' } };
    return (
      <Scene2 bg="outdoor" gy={196} ground="dirt">
        <Tree x={28} y={196} s={0.9} />
        <Tree x={296} y={196} s={0.9} kind="pine" />
        {/* elma sepeti ve un çuvalı */}
        <OG sh={[{ d: 'M38 232L44 204H84L90 232Z', f: M.wicker }]} />
        {[[52, 202], [64, 198], [76, 202], [58, 194], [70, 192]].map(([x, y], i) => <OG key={i} sh={[{ d: circ([x, y], 6), f: K.red }]} ow={1.2} />)}
        <Sack x={268} y={234} s={0.9} c="#efe7d6" />
        <Person {...a} />
        <Person {...b} />
      </Scene2>
    );
  },

  /* ─────────── ALARM ─────────── */
  'sf-yy-cakil-yol': () => {
    const gy = 196;
    const p: PersonProps = { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'bystander2', bottomC: K.pants.dark, sleeve: 'long', x: 140, y: 226, s: 1.0, pose: { ...POSE.walk, face: 'neutral' } };
    const pebbles = Array.from({ length: 70 }, (_, i) => [8 + ((i * 37) % 250), 206 + ((i * 13) % 30)] as P);
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <OG sh={[{ d: rrect(232, 70, 90, 140, 2), f: M.adobe }, { d: rrect(252, 118, 40, 86, 2), f: M.woodD }]} />
        <path d="M0 204H258V240H0Z" fill="#cfc6b6" />
        {pebbles.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={4 + (i % 3)} ry={2.6} fill={['#9a948a', '#b8b0a2', '#7d786f'][i % 3]} stroke={K.out} stroke-width={0.8} />)}
        <Person {...p} />
        <Waves x={110} y={214} a={-120} n={3} r={7} />
        <Waves x={176} y={214} a={-60} n={3} r={7} />
      </Scene2>
    );
  },

  'sf-yy-teneke-dizisi': () => {
    // İçeriden: kapının iç yüzünde ipe dizili teneke dizisi; kapı aralanınca sallanıyor.
    return (
      <Scene2 bg="indoor" gy={214} wall="#d8c3a2">
        <OG sh={[{ d: rrect(70, 26, 150, 200, 3), f: M.wood }, { d: rrect(80, 36, 130, 80, 2), f: shade(M.wood, 0.08) }, { d: rrect(80, 126, 130, 90, 2), f: shade(M.wood, 0.08) }]} />
        <rect x={220} y={26} width={22} height={200} fill="#2a2522" />
        <OG sh={[{ d: circ([200, 130], 5), f: M.iron }]} />
        {/* çivi ve ip */}
        <OG sh={[{ d: circ([140, 54], 4), f: M.iron }]} />
        <Rope pts={[[140, 54], [138, 90], [134, 130], [130, 172]]} w={2.4} />
        <Can x={152} y={98} s={1.0} a={14} />
        <Can x={126} y={130} s={1.0} a={-12} />
        <Can x={146} y={164} s={1.0} a={16} />
        <Can x={124} y={196} s={1.0} a={-10} />
        {/* bir tenekenin kesiti: içinde taş */}
        <OG sh={[{ d: ell([128, 186], 4, 3), f: K.rock }]} ow={1} />
        <Waves x={182} y={110} a={-20} n={3} r={7} />
        <Waves x={92} y={150} a={200} n={3} r={7} />
        <Arrow from={[260, 120]} to={[240, 150]} bend={0.3} w={4} />
      </Scene2>
    );
  },

  'sf-yy-kapi-ip-zil': () => {
    const gy = 206;
    const post: P = [210, 70];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* direk ve halka */}
        <OG sh={[{ d: rrect(204, 64, 14, 156, 2), f: M.woodD }, { d: rrect(70, 92, 14, 128, 2), f: M.woodD }]} />
        <circle cx={post[0] + 7} cy={post[1] + 10} r={5} fill="none" stroke={K.out} stroke-width={3} />
        {/* bahçe kapısı kanadı (aralanmış) */}
        <OG sh={[{ d: 'M84 102L196 92V206L84 210Z', f: 'none' }]} />
        {[0, 1, 2, 3, 4].map((i) => <OG key={i} sh={[{ d: rrect(88 + i * 22, 98 - i * 2, 14, 110, 2), f: M.woodL }]} />)}
        <OG sh={[{ d: rrect(84, 114, 116, 10, 2), f: M.wood }, { d: rrect(84, 176, 116, 10, 2), f: M.wood }]} />
        {/* ip: kapı kanadından halkaya, oradan teneke dizisine */}
        <Rope pts={[[180, 114], [200, 82], [post[0] + 7, post[1] + 10]]} w={2.2} />
        <Rope pts={[[post[0] + 7, post[1] + 10], [244, 76], [256, 96], [256, 140]]} w={2.2} />
        <Can x={262} y={128} s={0.8} a={12} />
        <Can x={252} y={154} s={0.8} a={-10} />
        <Can x={262} y={180} s={0.8} a={10} />
        <Waves x={282} y={150} a={-20} n={3} r={6} />
        {/* kapı açılınca kanat sola gider, ip çekilir */}
        <Arrow from={[176, 150]} to={[112, 150]} w={6} />
      </Scene2>
    );
  },

  /* ─────────── STOK HIRSIZLIK ─────────── */
  'sf-yy-stok-bol': () => {
    const sacks = (x: number, y: number) => <g>{[0, 1, 2].map((i) => <OG key={i} sh={[{ d: ell([x + i * 13, y], 6, 8), f: M.sack }]} ow={1.2} />)}</g>;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#a9cf86" />
        {/* ev */}
        <OG sh={[{ d: rrect(24, 30, 110, 80, 3), f: M.adobe }, { d: rrect(34, 40, 90, 60, 2), f: '#e9dcc4' }]} />
        {sacks(60, 70)}
        {/* ahır */}
        <OG sh={[{ d: rrect(190, 120, 108, 92, 3), f: M.woodD }, { d: rrect(200, 130, 88, 72, 2), f: '#d8c39c' }]} />
        {sacks(226, 166)}
        {/* çalılık içinde gizli küçük depo */}
        {[[70, 186], [92, 202], [46, 206], [64, 222], [100, 176]].map(([x, y], i) => <OG key={i} sh={[{ d: circ([x, y], 18), f: K.grassShade }]} />)}
        <OG sh={[{ d: rrect(56, 188, 40, 28, 3), f: '#8a6a45' }]} />
        {sacks(66, 202)}
        <Dash a={[134, 90]} b={[196, 130]} w={3} />
        <Dash a={[80, 112]} b={[76, 168]} w={3} />
        <Dash a={[120, 200]} b={[188, 180]} w={3} />
      </Scene2>
    );
  },

  'sf-yy-depo-kilit': () => {
    return (
      <Scene2 bg="outdoor" gy={214}>
        <OG sh={[{ d: rrect(0, 40, 320, 186, 0), f: M.adobe }]} />
        {/* kapı */}
        <OG sh={[{ d: rrect(56, 76, 110, 140, 2), f: M.woodD }]} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${56 + 27.5 * (i + 1)} 78V214`} stroke={shade(M.woodD, 0.3)} stroke-width={2} />)}
        {/* sürgü */}
        <OG sh={[{ d: rrect(88, 136, 96, 12, 3), f: M.iron }, { d: rrect(176, 128, 14, 28, 2), f: shade(M.iron, 0.2) }, { d: rrect(120, 128, 10, 28, 2), f: shade(M.iron, 0.2) }]} />
        {/* asma kilit */}
        <path d="M176 154V146A9 9 0 0 1 194 146V154" fill="none" stroke={K.out} stroke-width={6} />
        <path d="M176 154V146A9 9 0 0 1 194 146V154" fill="none" stroke={M.tin} stroke-width={3.4} />
        <OG sh={[{ d: rrect(170, 152, 30, 26, 4), f: '#d9a13a' }, { d: circ([185, 163], 3), f: K.ink }]} />
        {/* pencere: parmaklık, içte perde */}
        <OG sh={[{ d: rrect(222, 82, 70, 60, 2), f: '#e9dcc4' }]} />
        <path d="M226 86Q240 110 236 138H226ZM288 86Q274 110 278 138H288Z" fill={M.felt} />
        {[0, 1, 2, 3, 4].map((i) => <OG key={i} sh={[{ d: rrect(228 + i * 13, 82, 5, 60, 2), f: M.iron }]} ow={1.2} />)}
        <rect x={222} y={82} width={70} height={60} fill="none" stroke={K.out} stroke-width={3} />
      </Scene2>
    );
  },

  'sf-yy-stok-defter': () => {
    const gy = 196;
    const kat: PersonProps = { who: 'woman', skin: 1, hair: 'bun', hairC: K.hair.dark, role: 'bystander', bottomC: K.pants.navy, sleeve: 'long', x: 72, y: 228, s: 1.1, pose: { ...POSE.standSide, armF: { to: [104, 140] }, armB: { to: [96, 146] }, handF: 'fist', handB: 'flat', head: -60, face: 'neutral' } };
    const say: PersonProps = { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'bystander3', bottomC: K.pants.khaki, sleeve: 'long', x: 280, y: 228, s: 1.1, flip: true, pose: { ...POSE.standSide, armF: { to: [232, 120] }, handF: 'mitten', face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={gy} wall="#d8c3a2">
        {/* aynı boy çuvallar düzgün istif: 4-3-2 */}
        {[0, 1, 2, 3].map((i) => <Sack key={'a' + i} x={140 + i * 32} y={214} s={0.78} />)}
        {[0, 1, 2].map((i) => <Sack key={'b' + i} x={156 + i * 32} y={182} s={0.78} />)}
        {[0, 1].map((i) => <Sack key={'c' + i} x={172 + i * 32} y={150} s={0.78} />)}
        <Person {...kat} mid={() => <OG sh={[{ d: 'M88 132L114 128L118 150L92 154Z', f: M.paper }, { d: 'M94 138l16 -2M95 144l16 -2', st: K.ink, sw: 1.2 }]} />} />
        <Person {...say} />
      </Scene2>
    );
  },

  /* ─────────── KEMİRGEN VE NEM ─────────── */
  'sf-yy-delik-boyu': () => {
    const mouse = (x: number, y: number, s: number, c: string) => (
      <G x={x} y={y} s={s}>
        <path d="M-16 -4Q-34 -2 -42 -14" stroke={K.out} stroke-width={2.4 / s} fill="none" stroke-linecap="round" />
        <OG ow={OW / s} sh={[{ d: smooth([[-18, 0], [-14, -14], [4, -18], [16, -10], [24, -2], [10, 0]], true), f: c }, { d: circ([6, -16], 5), f: tint(c, 0.25) }]} />
        <circle cx={18} cy={-8} r={1.6 / 1} fill={K.ink} />
      </G>
    );
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={190} fill={M.adobe} />
        <rect x={0} y={190} width={320} height={50} fill={M.woodL} stroke={K.out} stroke-width={1.5} />
        {/* küçük delik + kalem */}
        <OG sh={[{ d: ell([80, 180], 9, 9), f: '#2a2522' }]} />
        <G x={60} y={120} a={0}><OG sh={[{ d: 'M0 -4.5H50L60 0L50 4.5H0Z', f: '#f2b631' }, { d: 'M50 -4.5L60 0L50 4.5Z', f: '#f1d9b0' }]} /></G>
        {mouse(108, 214, 0.8, '#9a948a')}
        <Label x={80} y={92} text="6 mm" size={14} />
        {/* büyük delik */}
        <OG sh={[{ d: ell([226, 176], 16, 15), f: '#2a2522' }]} />
        {mouse(268, 218, 1.3, '#7d6a5a')}
        <Label x={226} y={92} text="12 mm" size={14} />
      </Scene2>
    );
  },

  'sf-yy-delik-kapat': () => {
    const panel = (x: number, children: JSX.Element) => (
      <g>
        <rect x={x} y={34} width={96} height={170} rx={8} fill={M.adobe} stroke={K.out} stroke-width={2} />
        {children}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {panel(8, <g>
          <OG sh={[{ d: ell([56, 150], 16, 14), f: '#2a2522' }]} />
          <g stroke="#b9c2cc" stroke-width={1.6} fill="none">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${44 + i * 5} ${140 + (i % 2) * 6}q6 -8 10 2t8 4`} />)}</g>
          <Hand x={88} y={210} a={-40} s={0.62} pose="press" side="R" arm={40} sleeve={K.role.bystander2} skin={2} />
        </g>)}
        {panel(112, <g>
          <OG sh={[{ d: ell([160, 150], 18, 15), f: '#bdb6a6' }]} />
          <G x={176} y={146} a={-30}><OG sh={[{ d: 'M-14 -8H18L22 8H-18Z', f: M.iron }, { d: rrect(0, -24, 6, 18, 2), f: M.woodD }]} /></G>
        </g>)}
        {panel(216, <g>
          <OG sh={[{ d: ell([264, 150], 18, 15), f: tint(M.adobe, 0.12) }]} ow={0.8} />
        </g>)}
        <Arrow from={[100, 20]} to={[124, 20]} w={4} />
        <Arrow from={[204, 20]} to={[228, 20]} w={4} />
        <Ok x={264} y={190} r={14} />
      </Scene2>
    );
  },

  'sf-yy-istif-palet': () => {
    const gy = 206;
    const pallet = (x: number, w: number) => <OG sh={[{ d: rrect(x, 196, w, 6, 1), f: M.woodL }, { d: rrect(x + 4, 202, 10, 8, 1), f: M.wood }, { d: rrect(x + w / 2 - 5, 202, 10, 8, 1), f: M.wood }, { d: rrect(x + w - 14, 202, 10, 8, 1), f: M.wood }]} />;
    const stack = (x: number) => <g>{[0, 1].map((i) => <Sack key={'a' + i} x={x + 18 + i * 34} y={196} s={0.8} />)}<Sack x={x + 35} y={156} s={0.8} /></g>;
    return (
      <Scene2 bg="indoor" gy={gy} wall="#d8c3a2">
        <rect x={0} y={0} width={14} height={gy + 34} fill={shade('#d8c3a2', 0.2)} stroke={K.out} stroke-width={1.5} />
        {pallet(60, 72)}{stack(60)}
        {pallet(176, 72)}{stack(176)}
        <Dim a={[16, 120]} b={[58, 120]} w={3} />
        <Dim a={[134, 120]} b={[174, 120]} w={3} />
        <Label x={96} y={56} text="1 m" size={15} />
        <Sack x={286} y={226} s={0.8} />
        <Bad x={302} y={168} r={11} />
      </Scene2>
    );
  },

  /* ─────────── YANGIN GÖZETLEME ─────────── */
  'sf-yy-gozcu-tepe': () => {
    const pt = 132; // platform üstü
    const p: PersonProps = { who: 'man', skin: 0, hair: 'short', hairC: K.hair.brown, role: 'bystander4', bottomC: K.pants.khaki, sleeve: 'long', x: 92, y: pt, s: 0.72, pose: { ...POSE.standSide, armF: { at: 'head', d: [8, -6] }, handF: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={200}>
        {[200, 222, 244, 266, 288, 310].map((x, i) => <Tree key={i} x={x} y={196} s={0.45} kind="pine" />)}
        <path d="M262 170Q256 140 266 116Q276 92 266 66" stroke="#9aa2ab" stroke-width={7} fill="none" stroke-linecap="round" />
        <Hill x={80} w={260} top={170} c="#9cc274" />
        <Rod a={[62, pt + 8]} b={[58, 186]} w={5} c={M.woodD} />
        <Rod a={[122, pt + 8]} b={[126, 186]} w={5} c={M.woodD} />
        <Rod a={[60, 170]} b={[124, 146]} w={3} c={M.woodD} />
        <OG sh={[{ d: rrect(52, pt, 84, 8, 2), f: M.wood }]} />
        <OG sh={[{ d: rrect(52, pt - 24, 4, 24, 1), f: M.woodD }, { d: rrect(132, pt - 24, 4, 24, 1), f: M.woodD }, { d: rrect(52, pt - 22, 84, 4, 1), f: M.woodD }]} />
        <Person {...p} />
        <Dash a={[112, 32]} b={[250, 90]} w={2} />
      </Scene2>
    );
  },

  'sf-yy-yon-levhasi': () => {
    const c: P = [150, 128];
    const icon = (a: number, r: number, el: (p: P) => JSX.Element) => el(pol(c, a, r));
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: ell(c, 140, 90), f: M.woodL }]} />
        <circle cx={c[0]} cy={c[1]} r={64} fill="none" stroke={shade(M.woodL, 0.3)} stroke-width={2} stroke-dasharray="5 5" />
        {/* kuzey oku */}
        <path d={`M${c[0]} ${c[1] - 56}L${c[0] - 10} ${c[1] - 26}H${c[0] + 10}Z`} fill={K.ink} />
        <T x={c[0]} y={c[1] - 62} t="K" size={18} />
        {/* tepe, köy, dere */}
        {icon(-150, 100, (p) => <path d={`M${p[0] - 18} ${p[1] + 8}L${p[0]} ${p[1] - 12}L${p[0] + 18} ${p[1] + 8}Z`} fill="#8a9a6a" stroke={K.out} stroke-width={1.5} />)}
        {icon(150, 98, (p) => <g><path d={`M${p[0] - 12} ${p[1] + 8}V${p[1] - 4}L${p[0]} ${p[1] - 14}L${p[0] + 12} ${p[1] - 4}V${p[1] + 8}Z`} fill={M.adobe} stroke={K.out} stroke-width={1.5} /></g>)}
        {icon(90, 74, (p) => <path d={`M${p[0] - 30} ${p[1]}q8 -6 15 0t15 0t15 0t15 0`} stroke={K.water} stroke-width={4} fill="none" />)}
        {/* duman yönünde işaret */}
        {icon(-30, 100, (p) => <g><path d={`M${p[0]} ${p[1] + 10}Q${p[0] - 6} ${p[1] - 4} ${p[0] + 2} ${p[1] - 16}`} stroke="#7a818b" stroke-width={5} fill="none" stroke-linecap="round" /><circle cx={p[0]} cy={p[1] + 10} r={4} fill={K.danger} /></g>)}
        <Dash a={c} b={pol(c, -30, 92)} w={3} />
        <Hand x={284} y={150} a={-34} s={0.8} pose="point" side="R" arm={60} sleeve={K.role.bystander4} skin={0} />
      </Scene2>
    );
  },

  'sf-yy-iki-gozcu-kesisim': () => {
    const A: P = [50, 190], B: P = [270, 196], F: P = [176, 76];
    const hill = (p: P) => <g><OG sh={[{ d: ell(p, 30, 18), f: '#a9b97a' }, { d: ell([p[0], p[1] - 2], 16, 9), f: '#c2cf92' }]} /><OG sh={[{ d: rrect(p[0] - 4, p[1] - 14, 8, 12, 2), f: M.woodD }]} /></g>;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.paper} />
        {/* orman */}
        {[[120, 60], [150, 46], [190, 50], [220, 70], [140, 94], [200, 100], [170, 108], [240, 96]].map(([x, y], i) => <OG key={i} sh={[{ d: circ([x, y], 14), f: '#8fbf7a' }]} ow={1.1} />)}
        {hill(A)}{hill(B)}
        <path d={`M${A[0]} ${A[1] - 8}L${F[0] + 40} ${F[1] - 40}`} stroke={K.action} stroke-width={4} />
        <path d={`M${B[0]} ${B[1] - 8}L${F[0] - 46} ${F[1] - 50}`} stroke={K.action} stroke-width={4} />
        <path d={`M${F[0]} ${F[1]}q-6 -14 2 -26`} stroke="#7a818b" stroke-width={5} fill="none" stroke-linecap="round" />
        <circle cx={F[0]} cy={F[1]} r={14} fill="none" stroke={K.danger} stroke-width={4} />
        <path d="M300 20l-6 18h12z" fill={K.ink} /><T x={300} y={52} t="K" size={13} />
      </Scene2>
    );
  },
  /* ─────────── OYUNCAK ─────────── */
  'sf-yy-rulo-testi': () => {
    const roll = (x: number, y: number) => (
      <g>
        <OG sh={[{ d: `M${x - 22} ${y}V${y + 90}A22 7 0 0 0 ${x + 22} ${y + 90}V${y}Z`, f: '#cfa77a' }, { d: ell([x, y], 22, 7), f: '#8a6a45' }, { d: ell([x, y], 16, 4.5), f: '#3b2f25' }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={200} width={320} height={40} fill={M.woodL} stroke={K.out} stroke-width={1.5} />
        {/* sol: küçük tahta parça rulodan geçip düşüyor */}
        {roll(90, 100)}
        <OG sh={[{ d: rrect(80, 206, 20, 14, 2), f: '#e2b45a', t: 'rotate(12 90 213)' }]} />
        <path d="M76 196v-8M104 196v-8" stroke={K.out} stroke-width={2} stroke-linecap="round" />
        <Hand x={64} y={20} a={140} s={0.8} pose="pinch" side="R" arm={60} sleeve={K.role.helper} skin={2} />
        <Bad x={130} y={70} />
        {/* sağ: bez top rulodan geçmiyor */}
        {roll(232, 110)}
        <OG sh={[{ d: circ([232, 82], 30), f: '#e2574c' }, { d: 'M206 74Q232 92 258 74M210 96Q232 80 254 96', st: '#fff', sw: 2.4 }]} />
        <Ok x={282} y={52} />
      </Scene2>
    );
  },

  'sf-yy-bez-bebek': () => {
    const panel = (x: number) => <rect x={x} y={20} width={96} height={200} rx={10} fill="#fff" stroke={K.out} stroke-width={2} />;
    const cloth = '#f0e2c4';
    return (
      <Scene2 bg="closeup">
        {panel(8)}{panel(112)}{panel(216)}
        {/* 1: rulo bez */}
        <OG sh={[{ d: rrect(40, 50, 32, 140, 14), f: cloth }, { d: 'M40 70H72M40 120H72M40 170H72', st: shade(cloth, 0.2), sw: 1.6 }]} />
        {/* 2: baş iple boğulmuş */}
        <OG sh={[{ d: circ([160, 72], 22), f: cloth }, { d: rrect(144, 92, 32, 98, 12), f: cloth }, { d: rrect(146, 90, 28, 8, 3), f: K.red }]} />
        <Arrow from={[100, 120]} to={[124, 120]} w={4} />
        <Arrow from={[204, 120]} to={[228, 120]} w={4} />
        {/* 3: kollar çapraz, elbise, iplik gözler */}
        <OG sh={[
          { d: rrect(226, 98, 76, 18, 9), f: cloth },
          { d: circ([264, 72], 22), f: cloth },
          { d: 'M246 100H282L298 190H230Z', f: '#6c9cc8' },
          { d: rrect(252, 92, 24, 8, 3), f: K.red },
        ]} />
        <circle cx={257} cy={70} r={2.4} fill={K.ink} /><circle cx={271} cy={70} r={2.4} fill={K.ink} /><path d="M258 81q6 4 12 0" stroke={K.ink} stroke-width={1.8} fill="none" stroke-linecap="round" />
      </Scene2>
    );
  },

  'sf-yy-topac': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={170} width={320} height={70} fill={M.woodL} stroke={K.out} stroke-width={1.5} />
      <ellipse cx={160} cy={204} rx={46} ry={8} fill="#000" opacity={0.12} />
      {/* makara topaç */}
      <OG sh={[
        { d: rrect(156, 70, 8, 60, 3), f: M.woodD },
        { d: ell([160, 140], 50, 12), f: '#c58a52' },
        { d: `M110 140L156 200H164L210 140Z`, f: '#d9a26a' },
        { d: ell([160, 140], 50, 12), f: '#e2b47a' },
        { d: ell([160, 140], 9, 3), f: M.woodD },
      ]} />
      <path d="M126 150Q160 170 194 150" stroke={shade('#d9a26a', 0.3)} stroke-width={2} fill="none" />
      {/* dönüş oku */}
      <path d="M100 116A64 20 0 1 0 220 112" fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
      <path d="M100 116A64 20 0 1 0 220 112" fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" />
      <path d="M212 100L230 110L214 122Z" fill={K.action} stroke={K.out} stroke-width={1.5} />
      {/* çeviren çocuk parmakları */}
      <Hand x={104} y={44} a={110} s={0.75} pose="pinch" side="R" arm={60} sleeve={K.role.bystander2} skin={1} />
    </Scene2>
  ),

  /* ─────────── OYUNLAR ─────────── */
  'sf-yy-mendil-kapmaca': () => {
    const gy = 196;
    const kidL = (x: number, i: number): PersonProps => ({ who: i % 2 ? 'girl' : 'boy', skin: i % 4, role: 'bystander3', x, y: 214 - (i % 2) * 4, s: 0.55, pose: { ...POSE.standSide, face: 'neutral' } });
    const kidR = (x: number, i: number): PersonProps => ({ who: i % 2 ? 'boy' : 'girl', skin: (i + 2) % 4, role: 'bystander', x, y: 214 - (i % 2) * 4, s: 0.55, flip: true, pose: { ...POSE.standSide, face: 'neutral' } });
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <path d="M30 222H120M200 222H290" stroke="#fff" stroke-width={3} />
        {[22, 40, 58].map((x, i) => <Person key={'l' + i} {...kidL(x, i)} />)}
        {[262, 280, 298].map((x, i) => <Person key={'r' + i} {...kidR(x, i)} />)}
        {/* koşan iki çocuk */}
        <Person who="girl" skin={1} role="bystander3" hair="ponytail" hairC={K.hair.auburn} x={118} y={226} s={0.68} pose={{ ...POSE.run, face: 'neutral' }} />
        <Person who="boy" skin={2} role="bystander" x={204} y={226} s={0.68} flip pose={{ ...POSE.run, face: 'neutral' }} />
        {/* mendil */}
        <OG sh={[{ d: 'M148 224L160 216L174 222L162 230Z', f: '#fff' }, { d: 'M152 223L160 218', st: K.red, sw: 2 }]} />
        {/* ebe arkada */}
        <Person who="woman" skin={2} hair="bun" hairC={K.hair.black} role="helper" x={160} y={186} s={0.58} pose={{ ...POSE.stand, armF: { at: 'mouth', d: [8, 6] }, handF: 'fist', face: 'speak' }} />
        <Bubble x={208} y={60} w={44} h={34} tail={[176, 108]} text="3!" />
      </Scene2>
    );
  },

  'sf-yy-seksek': () => {
    // Toprakta seksek kareleri (perspektif), bir karede yassı taş; tek ayak üstünde seken çocuk.
    const row = (y0: number, y1: number, x0: number, x1: number) => `M${x0} ${y0}L${x1} ${y0}`;
    const kid: PersonProps = { who: 'girl', skin: 1, hair: 'long', hairC: K.hair.auburn, role: 'bystander2', bottom: 'skirt', x: 88, y: 222, s: 0.95, pose: { ...POSE.standSide, legB: [130, 40], footB: 20, armB: [140, 160], armF: [40, 20], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={150} ground="dirt">
        {/* kareler: aşağıdan yukarı daralarak */}
        <g fill="none" stroke="#fff" stroke-width={3}>
          <path d="M150 230L170 160H250L270 230Z" />
          <path d="M156 206H264M162 184H258M210 230V206M210 184V160" />
          <path d="M170 160L178 134H242L250 160M178 134L184 116H236L242 134" />
          <path d="M208 160V134" />
        </g>
        <OG sh={[{ d: ell([222, 196], 9, 4), f: K.rock }]} />
        <Person {...kid} />
        <Arrow from={[120, 120]} to={[176, 120]} bend={-0.4} w={4} />
      </Scene2>
    );
  },

  'sf-yy-dokuz-tas': () => {
    const c: P = [160, 120];
    const sq = [96, 64, 32];
    const pts: P[] = [];
    sq.forEach((h) => { for (const dx of [-1, 0, 1]) for (const dy of [-1, 0, 1]) if (dx || dy) pts.push([c[0] + dx * h, c[1] + dy * h]); });
    const dark = new Set([0, 1, 2]); // üst sıra (dış kare): üç koyu taş
    const light = [9, 12, 20, 15];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.dirt} />
        <g fill="none" stroke="#fff4dc" stroke-width={3}>
          {sq.map((h, i) => <rect key={i} x={c[0] - h} y={c[1] - h} width={h * 2} height={h * 2} />)}
          <path d={`M${c[0]} ${c[1] - 96}V${c[1] - 32}M${c[0]} ${c[1] + 32}V${c[1] + 96}M${c[0] - 96} ${c[1]}H${c[0] - 32}M${c[0] + 32} ${c[1]}H${c[0] + 96}`} />
        </g>
        {/* üç koyu taş bir çizgide (dış karenin sol kenarı) */}
        <path d={`M${c[0] - 96} ${c[1] - 96}V${c[1] + 96}`} stroke={K.action} stroke-width={8} stroke-linecap="round" opacity={0.85} />
        {[[c[0] - 96, c[1] - 96], [c[0] - 96, c[1]], [c[0] - 96, c[1] + 96], [c[0] + 32, c[1] - 32]].map((p, i) => <OG key={'d' + i} sh={[{ d: circ(p as P, 11), f: '#4a4542' }]} />)}
        {[[c[0], c[1] - 96], [c[0] + 96, c[1] - 96], [c[0] + 64, c[1]], [c[0], c[1] + 64], [c[0] + 96, c[1] + 96]].map((p, i) => <OG key={'l' + i} sh={[{ d: circ(p as P, 11), f: '#f1ece2' }]} />)}
      </Scene2>
    );
  },

  /* ─────────── ÇALGI ─────────── */
  'sf-yy-kabak-marakas': () => {
    const h = { x: 96, y: 236, a: 30, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 34 };
    return (
      <Scene2 bg="closeup">
        <G x={176} y={110} a={30}>
          <OG sh={[{ d: smooth([[0, -70], [30, -50], [40, -10], [30, 30], [0, 44], [-30, 30], [-40, -10], [-30, -50]], true), f: '#d9b45a' }, { d: rrect(-8, 40, 16, 70, 6), f: '#b9913f' }]} />
          {/* kesit: içi ve çekirdekler */}
          <OG sh={[{ d: smooth([[0, -56], [22, -40], [28, -10], [20, 20], [0, 30], [-20, 20], [-28, -10], [-22, -40]], true), f: '#f3e3b0' }]} />
          {[[-10, -30], [8, -36], [14, -10], [-14, 0], [2, 10], [-4, -14], [12, 12], [-16, -20]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={4} ry={2.4} fill="#6b4f3a" transform={`rotate(${i * 40} ${x} ${y})`} />)}
        </G>
        <Hand {...h} arm={60} sleeve={K.role.bystander2} skin={1} />
        <Waves x={250} y={50} a={-40} n={3} r={9} />
        <Waves x={120} y={40} a={-140} n={3} r={9} />
      </Scene2>
    );
  },

  'sf-yy-teneke-davul': () => {
    const kid: PersonProps = { who: 'boy', skin: 3, hair: 'short', hairC: K.hair.black, role: 'bystander3', x: 160, y: 92, ax: 'head', ay: 'head', s: 1.9, pose: { ...POSE.stand, armB: { to: [128, 168] }, armF: { to: [196, 170] }, handB: 'flat', handF: 'flat', face: 'calm' } };
    return (
      <Scene2 bg="closeup">
        <Person {...kid} only={['torso', 'head', 'armB', 'armF']} />
        {/* teneke davul */}
        <OG sh={[
          { d: 'M96 176L106 240H214L224 176Z', f: M.tin },
          { d: 'M200 176L208 240H214L224 176Z', f: M.tinD, no: true },
          { d: ell([160, 176], 66, 14), f: '#e9d2a6' },
          { d: ell([160, 180], 68, 8), f: M.cloth },
        ]} />
        {[110, 134, 160, 186, 210].map((x, i) => <path key={i} d={`M${x} 186L${x + 6} 220`} stroke={M.rope} stroke-width={2.4} />)}
        <path d="M100 220H220" stroke={M.rope} stroke-width={3} />
        <Person {...kid} only={['armB', 'armF']} />
        <Waves x={240} y={150} a={-30} n={3} r={8} />
        <Waves x={80} y={150} a={-150} n={3} r={8} />
      </Scene2>
    );
  },

  'sf-yy-sise-dizisi': () => {
    // Kız masanın arkasında, ilk şişenin ağzına üflüyor. Az sulu şişe kalın (büyük nota), çok sulu ince (küçük nota).
    const xs = [134, 171, 208, 245, 282];
    const fill = [0.15, 0.35, 0.55, 0.72, 0.9];
    const top: P = [xs[0], 206 - 1.7 * 48];
    const p: PersonProps = { who: 'girl', skin: 1, hair: 'ponytail', hairC: K.hair.brown, role: 'bystander2', x: top[0] - 10, y: top[1] - 4, ax: 'mouth', ay: 'mouth', s: 1.45, pose: { ...POSE.standSide, spine: -84, head: -66, armF: { to: [xs[0] - 14, 190] }, armB: { to: [xs[0] - 18, 194] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="closeup">
        <Person {...p} />
        <rect x={0} y={200} width={320} height={40} fill={M.woodL} stroke={K.out} stroke-width={1.5} />
        {xs.map((x, i) => <Bottle key={i} x={x} y={206} s={1.7} fill={fill[i]} color="#e6f2f6" />)}
        <Waves x={top[0] + 4} y={top[1] - 14} a={-70} n={2} r={5} />
        <Note x={176} y={58} s={1.5} />
        <Note x={282} y={62} s={0.85} />
      </Scene2>
    );
  },

  /* ─────────── TOPLU MÜZİK ─────────── */
  'sf-yy-ritim-cemberi': () => {
    // Akşam, ateşsiz çember: arkada ve önde oturan insanlar; biri davul, diğerleri el çırpıyor.
    const clap: Pose = { ...POSE.sitFloor, armB: { at: 'chest', d: [16, -6] }, armF: { at: 'chest', d: [18, -8] }, handB: 'flat', handF: 'flat', face: 'calm' };
    const back: PersonProps[] = [
      { who: 'oldwoman', skin: 1, role: 'bystander', x: 96, y: 150, s: 0.62, pose: clap },
      { who: 'man', skin: 2, role: 'bystander3', hair: 'short', hairC: K.hair.black, x: 160, y: 146, s: 0.62, pose: clap },
      { who: 'girl', skin: 0, role: 'bystander2', hair: 'long', hairC: K.hair.blond, x: 224, y: 150, s: 0.62, flip: true, pose: clap },
    ];
    return (
      <Scene2 bg="outdoor" gy={120} ground="dirt">
        <ellipse cx={160} cy={176} rx={130} ry={44} fill={shade(K.dirt, 0.08)} stroke="#fff" stroke-width={2} stroke-dasharray="6 6" />
        {back.map((p, i) => <Person key={i} {...p} />)}
        <Person who="woman" skin={3} role="bystander4" hair="bun" hairC={K.hair.black} x={58} y={200} s={0.8} pose={clap} />
        <Person who="boy" skin={1} role="helper" x={264} y={200} s={0.8} flip pose={{ ...POSE.sitFloor, armF: { to: [228, 184] }, armB: { to: [222, 180] }, handF: 'flat', handB: 'flat', face: 'calm' }} />
        <OG sh={[{ d: 'M206 210L210 184H236L240 210Z', f: M.tin }, { d: ell([223, 184], 13, 4), f: '#e9d2a6' }]} />
        <Waves x={223} y={170} a={-90} n={3} r={6} />
      </Scene2>
    );
  },

  'sf-yy-is-sarkisi': () => {
    const gy = 176;
    const ppl: PersonProps[] = [
      { who: 'man', skin: 2, role: 'bystander3', hair: 'short', hairC: K.hair.black, x: 50, y: 216, s: 0.82, pose: { ...POSE.bend } },
      { who: 'woman', skin: 1, role: 'bystander2', hair: 'scarf', hairC: '#6c9c5a', x: 130, y: 216, s: 0.82, pose: { ...POSE.bend } },
      { who: 'man', skin: 0, role: 'bystander4', hair: 'short', hairC: K.hair.brown, x: 210, y: 216, s: 0.82, pose: { ...POSE.bend } },
    ];
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        {/* başaklar */}
        {Array.from({ length: 26 }, (_, i) => <path key={i} d={`M${10 + i * 12} 236V${196 - (i % 3) * 4}`} stroke="#d9b45a" stroke-width={3} />)}
        {ppl.map((p, i) => {
          const r = rig(p);
          return (
            <g key={i}>
              <Person {...p} face="speak" />
              <path d={`M${r.handF[0]} ${r.handF[1]}q14 10 26 -2q-2 -16 -14 -18`} fill="none" stroke={K.out} stroke-width={5} />
              <path d={`M${r.handF[0]} ${r.handF[1]}q14 10 26 -2q-2 -16 -14 -18`} fill="none" stroke={M.tin} stroke-width={3} />
              <Note x={r.head[0] + 22} y={r.head[1] - 24} s={0.8} />
            </g>
          );
        })}
        <Arrow from={[40, 40]} to={[280, 40]} w={5} />
      </Scene2>
    );
  },

  /* ─────────── DOĞA DENEYLERİ ─────────── */
  'sf-yy-yagmur-olcer': () => {
    const gy = 200;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Tree x={50} y={206} s={1.1} />
        <Rod a={[226, 120]} b={[226, 216]} w={7} c={M.woodD} />
        <OG sh={[{ d: rrect(206, 70, 32, 56, 4), f: '#e6f2f6' }, { d: rrect(206, 104, 32, 22, 4), f: K.water }]} />
        <Rope pts={[[204, 112], [240, 116]]} w={2.4} />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M206 ${78 + i * 6}h${i % 2 ? 5 : 9}`} stroke={K.ink} stroke-width={1.4} />)}
        {[[220, 30], [240, 46], [200, 50]].map(([x, y], i) => <Sweat key={i} x={x} y={y} />)}
        <Dim a={[64, 186]} b={[218, 186]} w={3} />
        <Label x={140} y={172} text="× 2" size={15} />
      </Scene2>
    );
  },

  'sf-yy-tohum-kavanoz': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={206} width={320} height={34} fill={M.woodL} stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: rrect(84, 40, 120, 170, 16), f: '#e6f2f6' }, { d: rrect(96, 30, 96, 14, 3), f: M.tinD }]} />
      {/* ıslak bez cam kenarında */}
      <rect x={92} y={52} width={104} height={150} rx={10} fill="#d8cbb0" opacity={0.75} />
      {/* fasulyeler: kök aşağı, filiz yukarı */}
      {[[116, 120], [146, 110], [174, 126]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y + 6}Q${x - 4} ${y + 30} ${x + 2} ${y + 54}`} stroke="#f4f0e2" stroke-width={3} fill="none" />
          <path d={`M${x} ${y - 4}Q${x + 4} ${y - 24} ${x - 2} ${y - 38}`} stroke={K.leaf} stroke-width={3.4} fill="none" />
          <OG sh={[{ d: ell([x - 4, y - 40], 7, 4), f: K.leaf }]} ow={1} />
          <OG sh={[{ d: ell([x, y], 9, 6), f: '#e9e2cf' }]} />
        </g>
      ))}
      {/* cetvel ve el */}
      <OG sh={[{ d: rrect(222, 60, 16, 140, 2), f: '#f2c94c' }]} />
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M222 ${68 + i * 10}h${i % 2 ? 5 : 9}`} stroke={K.ink} stroke-width={1.4} />)}
      <Hand x={292} y={210} a={-40} s={0.75} pose="open" side="L" arm={50} sleeve={K.role.bystander2} skin={1} />
    </Scene2>
  ),

  'sf-yy-golge-cubugu': () => {
    const st: P = [160, 170];
    const tips: P[] = [[40, 120], [80, 104], [126, 98], [164, 100], [200, 102], [244, 110], [286, 126]];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={M.dirt} />
        {tips.map((t, i) => <path key={i} d={`M${st[0]} ${st[1]}L${t[0]} ${t[1]}`} stroke="#8a7050" stroke-width={2} opacity={0.5} />)}
        <path d={`M${st[0]} ${st[1]}L${tips[3][0]} ${tips[3][1]}`} stroke={K.action} stroke-width={5} stroke-linecap="round" />
        <path d={smooth(tips)} fill="none" stroke="#fff4dc" stroke-width={2} stroke-dasharray="5 5" />
        {tips.map((t, i) => <OG key={'s' + i} sh={[{ d: ell(t, 8, 6), f: i === 3 ? K.action : K.rock }]} />)}
        <OG sh={[{ d: circ(st, 8), f: M.woodD }, { d: circ(st, 3.5), f: shade(M.woodD, 0.3) }]} />
      </Scene2>
    );
  },

  /* ─────────── GÖZLEM DEFTERİ ─────────── */
  'sf-yy-defter-sayfa': () => {
    const box = (x: number, y: number, ic: JSX.Element) => (
      <g>
        <rect x={x} y={y} width={110} height={34} rx={4} fill="#fff" stroke={K.out} stroke-width={1.6} />
        {ic}
        <path d={`M${x + 40} ${y + 12}h58M${x + 40} ${y + 22}h46`} stroke={M.paperLine} stroke-width={2} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(20, 20, 140, 200, 6), f: M.paper }, { d: rrect(160, 20, 140, 200, 6), f: M.paper }]} />
        <path d="M160 22V218" stroke={K.out} stroke-width={2} />
        {/* tarih çizgisi + güneş/bulut */}
        <path d="M34 40h60" stroke={M.paperLine} stroke-width={3} />
        <circle cx={124} cy={40} r={8} fill="#ffd34d" stroke={K.out} stroke-width={1.4} />
        <path d="M128 48a7 7 0 0 1 12 -4a5 5 0 0 1 8 4z" fill="#fff" stroke={K.out} stroke-width={1.4} />
        {box(34, 66, <g><ellipse cx={54} cy={83} rx={12} ry={7} fill="#fff" stroke={K.ink} stroke-width={2} /><circle cx={54} cy={83} r={4} fill={K.ink} /></g>)}
        {box(34, 116, <T x={54} y={142} t="?" size={24} />)}
        {box(34, 166, <g><circle cx={54} cy={180} r={8} fill="#ffe08a" stroke={K.ink} stroke-width={1.6} /><rect x={50} y={188} width={8} height={6} fill={K.ink} /></g>)}
        {/* yaprak şeması */}
        <OG sh={[{ d: 'M230 190Q176 130 230 50Q284 130 230 190Z', f: '#8fc163' }]} />
        <path d="M230 190V52M230 140l-22 -18M230 140l22 -18M230 106l-18 -16M230 106l18 -16" stroke={K.out} stroke-width={1.6} fill="none" />
        <path d="M258 120H284M230 196V206" stroke={K.ink} stroke-width={1.4} />
        <path d="M262 134h24M262 140h18" stroke={M.paperLine} stroke-width={2} />
      </Scene2>
    );
  },

  'sf-yy-defter-cizim': () => {
    // Yakın plan defter sayfası: sade yaprak şeması, parçalarına oklar ve yazı çizgileri;
    // yanda yaprak kenarının büyütülmüş ayrıntısı. Kurşun kalem sayfanın kenarında.
    const ink = K.ink;
    const leaf = 'M110 196Q60 150 92 64Q140 96 136 170Q130 190 110 196Z';
    const lineTo = (a: P, b: P, tx: number, ty: number, right = true) => (
      <g>
        <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={ink} stroke-width={1.8} fill="none" />
        <path d={`M${f1(pol(a, ang(b, a) + 25, 7)[0])} ${f1(pol(a, ang(b, a) + 25, 7)[1])}L${a[0]} ${a[1]}L${f1(pol(a, ang(b, a) - 25, 7)[0])} ${f1(pol(a, ang(b, a) - 25, 7)[1])}`} stroke={ink} stroke-width={1.8} fill="none" stroke-linejoin="round" />
        <path d={right ? `M${tx} ${ty}h30M${tx} ${ty + 7}h20` : `M${tx - 30} ${ty}h30M${tx - 20} ${ty + 7}h20`} stroke={M.paperLine} stroke-width={3} stroke-linecap="round" />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {/* defter */}
        <OG sh={[{ d: rrect(18, 20, 284, 206, 8), f: M.paper }]} />
        <path d="M30 44H290" stroke={M.paperLine} stroke-width={1.2} opacity={0.6} />
        {/* yaprak şeması */}
        <OG sh={[{ d: leaf, f: K.leaf }]} />
        <path d="M110 196Q104 140 92 64M104 160L84 140M106 128L122 112M100 108L84 96" stroke={shade(K.leaf, 0.35)} stroke-width={2} fill="none" />
        <path d="M110 196L114 214" stroke={K.out} stroke-width={3} stroke-linecap="round" />
        {/* parçalara oklar */}
        {lineTo([96, 70], [56, 52], 30, 50, true)}
        {lineTo([86, 140], [46, 160], 22, 168, true)}
        {lineTo([114, 212], [150, 212], 154, 210, true)}
        {/* büyütülmüş ayrıntı: yaprak kenarı */}
        <circle cx={131} cy={150} r={10} fill="none" stroke={K.action} stroke-width={3} />
        <path d="M140 146L208 112" stroke={K.out} stroke-width={1.5} stroke-dasharray="4 4" />
        <clipPath id="yy-defter-ek"><circle cx={240} cy={100} r={45} /></clipPath>
        <circle cx={240} cy={100} r={46} fill={M.paper} />
        <g clip-path="url(#yy-defter-ek)">
          <path d={(() => {
            // tırtıklı yaprak kenarı: sol alttan sağ üste çapraz
            const a0: P = [196, 150], a1: P = [292, 48];
            const pts: P[] = [];
            for (let i = 0; i <= 8; i++) {
              const q = lerp(a0, a1, i / 8);
              pts.push(i % 2 ? pol(q, ang(a0, a1) - 90, 9) : q);
            }
            return 'M' + pts.map((q) => `${f1(q[0])} ${f1(q[1])}`).join('L') + 'L300 160L180 160Z';
          })()} fill={K.leaf} stroke={K.out} stroke-width={2} stroke-linejoin="round" />
          <path d="M216 160L262 100M236 160L280 116M200 136L236 112" stroke={shade(K.leaf, 0.35)} stroke-width={2} fill="none" />
        </g>
        <circle cx={240} cy={100} r={46} fill="none" stroke={K.action} stroke-width={4} />
        {/* kurşun kalem */}
        <G x={226} y={196} a={-20}><OG sh={[{ d: rrect(-40, -5, 64, 10, 2), f: '#f2c230' }, { d: 'M24 -5L38 0L24 5Z', f: '#e9d2a6' }, { d: 'M34 -1.5L38 0L34 1.5Z', f: K.ink }]} /></G>
      </Scene2>
    );
  },

  'sf-yy-agac-yil': () => {
    const tree = (x: number, crown: string | null, flowers?: string, snow?: boolean) => (
      <g>
        <rect x={x} y={30} width={72} height={150} rx={8} fill={snow ? '#dfe9f0' : K.sky} stroke={K.out} stroke-width={2} />
        <rect x={x} y={150} width={72} height={30} fill={snow ? M.snow : K.grass} />
        <rect x={x} y={150} width={72} height={30} fill="none" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: `M${x + 33} 164L${x + 34} 110L${x + 26} 92L${x + 30} 90L${x + 36} 102L${x + 40} 88L${x + 44} 90L${x + 38} 110L${x + 39} 164Z`, f: K.trunk }]} />
        {crown && <OG sh={[{ d: circ([x + 36, 88], 26), f: crown }]} />}
        {flowers && [[-12, -8], [10, -14], [0, 6], [14, 4], [-14, 8]].map(([dx, dy], i) => <circle key={i} cx={x + 36 + dx} cy={88 + dy} r={4} fill={flowers} stroke={K.out} stroke-width={1} />)}
        {snow && <path d={`M${x + 26} 92l-4 -2M${x + 44} 90l4 -2`} stroke="#fff" stroke-width={4} stroke-linecap="round" />}
        <rect x={x + 10} y={192} width={52} height={22} rx={3} fill="#fff" stroke={K.out} stroke-width={1.6} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {tree(6, '#a8d48a', '#f6b6c8')}
        {tree(84, K.leaf)}
        {tree(162, '#e0a43a')}
        {tree(240, null, undefined, true)}
      </Scene2>
    );
  },

  /* ─────────── KATEGORİ KAPAKLARI ─────────── */
  'sf-yy-yolculuk-kapak': () => {
    const gy = 196;
    const walk: Pose = { ...POSE.walk, face: 'neutral' };
    const hand: P = [92, 172];
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <path d="M120 196L170 150H200L320 196Z" fill={tint(K.dirt, 0.2)} />
        <Equid x={230} y={222} s={0.62} over={<OG sh={[{ d: rrect(-34, -112, 30, 38, 6), f: M.sack }, { d: rrect(-6, -110, 30, 36, 6), f: M.sackD }]} />} />
        <Person {...CAST.yolcu} x={150} y={224} s={0.82} pose={walk} back={(r) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} />} />
        <Person {...CAST.anne} x={66} y={224} s={0.82} pose={{ ...walk, armF: { to: hand } }} />
        <Person {...CAST.kiz} x={108} y={226} s={0.62} pose={{ ...walk, armB: { to: hand } }} />
        <Arrow from={[40, 40]} to={[150, 40]} w={5} />
      </Scene2>
    );
  },

  'sf-yy-kis-kapak': () => {
    const gy = 170;
    const p: PersonProps = { ...CAST.kisci, x: 120, y: 214, s: 1.0, pose: { ...POSE.walk, face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" gy={gy} ground="snow">
        {[20, 46, 270, 300, 240].map((x, i) => <Tree key={i} x={x} y={gy + 4} s={0.85} kind="pine" />)}
        {[20, 46, 270, 300, 240].map((x, i) => <path key={'s' + i} d={`M${x - 16} ${gy - 46}l16 -14l16 14z`} fill="#fff" opacity={0.9} />)}
        <ellipse cx={230} cy={196} rx={70} ry={12} fill={M.ice} stroke={K.out} stroke-width={1.5} />
        <Person {...p} over={(rr) => (
          <g>
            <Beanie r={rr} />
            <path d={`M${rr.head[0] - 2} ${rr.head[1] + 1}h${rr.headR + 4}`} stroke={M.woodL} stroke-width={6} stroke-linecap="round" />
            <path d={`M${rr.head[0] + 4} ${rr.head[1] + 1}h${rr.headR - 4}`} stroke={K.ink} stroke-width={1.6} />
          </g>
        )} />
        {/* kar ayakkabıları */}
        <OG sh={[{ d: ell([r.toeB[0] - 6, r.toeB[1] + 2], 26, 5), f: M.woodL, t: `rotate(20 ${r.toeB[0] - 6} ${r.toeB[1] + 2})` }, { d: ell([r.toeF[0] - 6, r.toeF[1] + 2], 26, 5), f: M.woodL }]} />
        <rect x={0} y={218} width={320} height={22} fill={M.snow} />
      </Scene2>
    );
  },

  'sf-yy-guvenlik-kapak': () => {
    const gy = 196;
    const house = (x: number, w: number, h: number) => (
      <g>
        <OG sh={[{ d: rrect(x, gy - h, w, h + 8, 2), f: M.adobe }, { d: `M${x - 8} ${gy - h + 2}L${x + w / 2} ${gy - h - 26}L${x + w + 8} ${gy - h + 2}Z`, f: '#6b4f3a' }]} />
        <rect x={x + w / 2 - 12} y={gy - h + 16} width={24} height={20} fill="#ffd77a" opacity={0.5} />
        <OG sh={[{ d: rrect(x + w / 2 - 10, gy - h + 18, 20, 16, 1), f: M.blanket }]} />
      </g>
    );
    return (
      <Scene2 bg="night" gy={gy}>
        <rect width={320} height={120} fill="#3b3a63" opacity={0.6} />
        {[16, 300, 136].map((x, i) => <Tree key={i} x={x} y={gy + 6} s={0.9} kind="pine" color="#24543f" />)}
        {house(40, 76, 52)}
        {house(166, 64, 46)}
        <Rope pts={[[200, gy - 30], [200, gy - 12]]} w={1.6} />
        <Can x={200} y={gy - 2} s={0.5} />
        {/* gözetleme platformu */}
        <Rod a={[248, 150]} b={[244, 204]} w={4} c={M.woodD} />
        <Rod a={[290, 150]} b={[294, 204]} w={4} c={M.woodD} />
        <Rod a={[248, 190]} b={[290, 160]} w={3} c={M.woodD} />
        <OG sh={[{ d: rrect(240, 146, 58, 7, 2), f: M.wood }, { d: rrect(241, 124, 4, 24, 1), f: M.woodD }, { d: rrect(293, 124, 4, 24, 1), f: M.woodD }, { d: rrect(240, 122, 58, 5, 2), f: M.wood }]} />
        <Person who="man" skin={0} hair="short" hairC={K.hair.brown} role="bystander4" bottomC={K.pants.khaki} sleeve="long" x={268} y={146} s={0.5} pose={{ ...POSE.standSide, armF: { at: 'head', d: [8, -6] }, handF: 'flat', face: 'neutral' }} />
      </Scene2>
    );
  },

  'sf-yy-moral-kapak': () => {
    const clap: Pose = { ...POSE.sitFloor, armB: { at: 'chest', d: [16, -6] }, armF: { at: 'chest', d: [18, -8] }, handB: 'flat', handF: 'flat', face: 'calm' };
    return (
      <Scene2 bg="night" gy={180}>
        <Campfire x={160} y={206} s={0.9} />
        <Person who="man" skin={2} role="bystander3" hair="short" hairC={K.hair.black} x={118} y={168} s={0.6} pose={clap} />
        <Person who="woman" skin={0} role="bystander" hair="long" hairC={K.hair.auburn} x={204} y={168} s={0.6} flip pose={clap} />
        <Person who="oldwoman" skin={1} role="bystander2" x={60} y={226} s={0.85} pose={{ ...POSE.sitFloor, armF: [-40, -70], handF: 'fist', face: 'calm' }} over={(r) => (
          <G x={r.handF[0]} y={r.handF[1]} a={-20}><OG sh={[{ d: rrect(-3, -4, 6, 16, 2), f: '#b9913f' }, { d: ell([0, -16], 11, 14), f: '#d9b45a' }]} /></G>
        )} />
        <Waves x={56} y={92} a={-120} n={2} r={6} />
        <Person who="boy" skin={3} role="helper" x={262} y={226} s={0.75} flip pose={{ ...POSE.sitFloor, armF: { to: [228, 200] }, armB: { to: [222, 196] }, handF: 'flat', handB: 'flat', face: 'calm' }} />
        <OG sh={[{ d: 'M208 226L212 200H238L242 226Z', f: M.tin }, { d: ell([225, 200], 13, 4), f: '#e9d2a6' }]} />
        <Note x={100} y={60} s={1.1} />
        <Note x={220} y={52} s={0.9} />
      </Scene2>
    );
  },
};
