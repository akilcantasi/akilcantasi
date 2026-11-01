// Sıfırdan paketi sahneleri (a): su bulma, depolama ve arıtma. Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Arrow, Bad, Campfire, Table, Hand, K, Label, No, OG, Ok, Person, POSE, Pot, Rock, Scene2, Timer, Tree,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Rig } from '../../../src/art/kit2';

/* ═════════════ Oyuncu kadrosu (paket geneli) ═════════════
 * KOYLU  : bıyıklı köylü adam, yeşil üst, haki pantolon (kaynak arama, kaptaj, kuyu yeri, kuyu ağzı, havuz filtre)
 * KUYUCU : esmer usta, kiremit üst (kuyu kazmada yukarıdaki kişi, sarnıç)
 * KAZICI : genç adam, camgöbeği üst, kot (kuyuya inen kişi, kuyu klorlama, ev tipi kum filtresi)
 * KADIN  : başörtülü kadın, hardal üst, uzun etek (çıkrık, su taşıma, dinlendirme)
 * GENC   : at kuyruklu genç kadın, mor üst (su kalitesi, seramik filtre, SODIS)
 */
const CAST = {
  koylu: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.black, mustache: true, role: 'bystander3', bottom: 'pants', bottomC: K.pants.khaki },
  kuyucu: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.dark, role: 'bystander4', bottom: 'pants', bottomC: K.pants.dark },
  kazici: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.brown, role: 'helper', bottom: 'pants', bottomC: K.pants.denim },
  kadin: { who: 'woman', skin: 1, hair: 'scarf', hairC: '#b0476a', role: 'bystander2', bottom: 'longskirt', bottomC: '#5d5a7a' },
  genc: { who: 'woman', skin: 2, hair: 'ponytail', hairC: K.hair.black, role: 'bystander', bottom: 'pants', bottomC: K.pants.navy },
} as const satisfies Record<string, Partial<PersonProps>>;

/* ═════════════ Malzeme renkleri (paket geneli) ═════════════ */
const M = {
  beton: '#bdbab2',
  tas: K.rock,
  kil: '#b8693f',
  kum: '#e4c78f',
  cakil: '#a39b8f',
  cakilIri: '#8c8478',
  toprak: '#a07650',
  toprakDk: '#7c5a3c',
  kaya: '#8f8d88',
  odun: K.wood,
  su: K.water,
  bulanik: '#a98c5e',
  camur: '#6e5638',
  bidon: '#e9c445',
  kova: K.metal,
  plastik: '#e6e8eb',
  varil: '#3f78b5',
  kuru: '#dcc27a',
  kuruDk: '#c9ab5f',
  ip: '#c9a66b',
  yosun: '#5fae7a',
};

/* ═════════════ Yardımcılar ═════════════ */
const T = ({ x, y, s = 1, a = 0, children }: { x: number; y: number; s?: number; a?: number; children: ComponentChildren }) => (
  <g transform={`translate(${x} ${y})${a ? ` rotate(${a})` : ''}${s !== 1 ? ` scale(${s})` : ''}`}>{children}</g>
);

/** Düz yazı (hap değil) */
const Txt = ({ x, y, t, size = 12, c = K.ink, anchor = 'middle', w = 700 }: { x: number; y: number; t: string; size?: number; c?: string; anchor?: 'start' | 'middle' | 'end'; w?: number }) => (
  <text x={x} y={y} font-size={size} font-weight={w} fill={c} text-anchor={anchor} font-family="'IBM Plex Sans', system-ui, sans-serif">{t}</text>
);

/** Ölçü oku (iki uçlu ince çizgi) */
function Dim({ a, b, c = K.ink, w = 2 }: { a: P; b: P; c?: string; w?: number }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const hd = (p: P, s: number) => {
    const l = 7;
    const p1: P = [p[0] - s * l * Math.cos(ang - 0.45), p[1] - s * l * Math.sin(ang - 0.45)];
    const p2: P = [p[0] - s * l * Math.cos(ang + 0.45), p[1] - s * l * Math.sin(ang + 0.45)];
    return `M${p1[0]} ${p1[1]}L${p[0]} ${p[1]}L${p2[0]} ${p2[1]}`;
  };
  return (
    <g fill="none" stroke={c} stroke-width={w} stroke-linecap="round" stroke-linejoin="round">
      <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} />
      <path d={hd(b, 1)} />
      <path d={hd(a, -1)} />
    </g>
  );
}

/** Kova (taban ortası). fill: içindeki suyun rengi (yoksa boş) */
function Bucket({ x, y, s = 1, a = 0, fill, color = M.kova, handle = true }: { x: number; y: number; s?: number; a?: number; fill?: string; color?: string; handle?: boolean }) {
  return (
    <T x={x} y={y} s={s} a={a}>
      {handle && <path d="M-17 -30Q0 -52 17 -30" fill="none" stroke={K.out} stroke-width={2.4 / s} />}
      <OG ow={1.5 / s} sh={[
        { d: 'M-19 -32H19L15 -2Q15 0 13 0H-13Q-15 0 -15 -2Z', f: color },
        { d: 'M8 -32H19L15 -2Q15 0 13 0H6Z', f: shade(color, 0.15), no: true },
        { d: 'M-18 -24H18', st: shade(color, 0.3), sw: 1.2 },
        { d: ell([0, -32], 19, 4), f: fill ?? shade(color, 0.35) },
      ]} />
    </T>
  );
}

/** Dar ağızlı, kapaklı plastik bidon (taban ortası), yan görünüş */
function Jerry({ x, y, s = 1, a = 0, color = M.bidon, cap = true }: { x: number; y: number; s?: number; a?: number; color?: string; cap?: boolean }) {
  return (
    <T x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-18 -2V-40Q-18 -46 -12 -46H6L18 -36V-2Q18 0 16 0H-16Q-18 0 -18 -2Z', f: color },
        { d: 'M6 -46L18 -36V-2Q18 0 16 0H8Z', f: shade(color, 0.14), no: true },
        { d: rrect(-12, -54, 13, 6, 2), f: 'none', no: true },
        { d: 'M-12 -46Q-12 -55 -4 -55H2', st: K.out, sw: 3 },
        { d: rrect(8, -54, 9, 9, 2), f: cap ? K.safe : color },
        { d: 'M-12 -30H12M-12 -18H12', st: shade(color, 0.3), sw: 1.2 },
      ]} />
    </T>
  );
}

/** Taş örgü dokusu (dikdörtgen içinde) */
function Stones({ x, y, w, h, c = M.tas, r = 9 }: { x: number; y: number; w: number; h: number; c?: string; r?: number }) {
  const out: JSX.Element[] = [];
  let row = 0;
  for (let yy = y + r * 0.8; yy < y + h; yy += r * 1.5, row++) {
    for (let xx = x + (row % 2 ? r : r * 0.3); xx < x + w - r * 0.4; xx += r * 2.1) {
      out.push(<path key={`${xx}-${yy}`} d={ell([xx + r * 0.6, yy], r * 0.95, r * 0.68)} fill={(Math.round(xx + yy) % 3) ? c : shade(c, 0.1)} stroke={shade(c, 0.4)} stroke-width={1} />);
    }
  }
  return (
    <g>
      <defs><clipPath id={`st${x}-${y}-${w}`}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
      <rect x={x} y={y} width={w} height={h} fill={shade(c, 0.28)} stroke={K.out} stroke-width={1.5} />
      <g clip-path={`url(#st${x}-${y}-${w})`}>{out}</g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Çakıl dokusu: verilen yolun içine küçük taşlar */
function Gravel({ d, box, c = M.cakil, r = 3.2, id }: { d: string; box: [number, number, number, number]; c?: string; r?: number; id: string }) {
  const [x, y, w, h] = box;
  const dots: JSX.Element[] = [];
  let i = 0;
  for (let yy = y + r; yy < y + h; yy += r * 1.7) {
    for (let xx = x + ((i++ % 2) ? r : 0); xx < x + w; xx += r * 2.1) {
      dots.push(<ellipse key={`${xx}-${yy}`} cx={xx} cy={yy} rx={r} ry={r * 0.75} fill={(Math.round(xx * 7 + yy) % 3) ? tint(c, 0.15) : shade(c, 0.15)} stroke={shade(c, 0.45)} stroke-width={0.8} />);
    }
  }
  return (
    <g>
      <defs><clipPath id={id}><path d={d} /></clipPath></defs>
      <path d={d} fill={shade(c, 0.1)} />
      <g clip-path={`url(#${id})`}>{dots}</g>
      <path d={d} fill="none" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Kum dokusu (noktalı) */
function Sand({ d, box, c = M.kum, id }: { d: string; box: [number, number, number, number]; c?: string; id: string }) {
  const [x, y, w, h] = box;
  const dots: JSX.Element[] = [];
  let i = 0;
  for (let yy = y + 3; yy < y + h; yy += 5) {
    for (let xx = x + ((i++ % 2) ? 3 : 0); xx < x + w; xx += 7) dots.push(<circle key={`${xx}-${yy}`} cx={xx} cy={yy} r={0.9} fill={shade(c, 0.35)} />);
  }
  return (
    <g>
      <defs><clipPath id={id}><path d={d} /></clipPath></defs>
      <path d={d} fill={c} />
      <g clip-path={`url(#${id})`}>{dots}</g>
      <path d={d} fill="none" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Yükseltilmiş kuyu bileziği, önden (taban ortası x,y; w genişlik, h yükseklik) */
function WellRing({ x, y, w = 90, h = 52, color = M.beton, open = true }: { x: number; y: number; w?: number; h?: number; color?: string; open?: boolean }) {
  const rx = w / 2, ry = w * 0.13;
  return (
    <OG sh={[
      { d: `M${x - rx} ${y - h}V${y}A${rx} ${ry} 0 0 0 ${x + rx} ${y}V${y - h}Z`, f: color },
      { d: `M${x + rx * 0.45} ${y - h}V${y + ry * 0.9}A${rx} ${ry} 0 0 0 ${x + rx} ${y}V${y - h}Z`, f: shade(color, 0.12), no: true },
      { d: `M${x - rx} ${y - h * 0.5}A${rx} ${ry} 0 0 0 ${x + rx} ${y - h * 0.5}`, st: shade(color, 0.35), sw: 1.4 },
      { d: ell([x, y - h], rx, ry), f: tint(color, 0.2) },
      { d: ell([x, y - h], rx - 7, ry - 2.5), f: open ? '#1f2631' : tint(color, 0.2) },
    ]} />
  );
}

/** Basit çit (yan görünüş): x1→x2 boyunca direkler ve iki kuşak */
function Fence({ x1, x2, y, h = 38, n = 5, color = '#9a6a42' }: { x1: number; x2: number; y: number; h?: number; n?: number; color?: string }) {
  const posts = Array.from({ length: n }, (_, i) => x1 + ((x2 - x1) * i) / (n - 1));
  return (
    <OG sh={[
      { d: rrect(x1 - 2, y - h * 0.78, x2 - x1 + 4, 5, 2), f: tint(color, 0.15) },
      { d: rrect(x1 - 2, y - h * 0.4, x2 - x1 + 4, 5, 2), f: tint(color, 0.15) },
      ...posts.map((px) => ({ d: rrect(px - 3.5, y - h, 7, h, 2), f: color })),
    ]} />
  );
}

/** Kask (yarım küre) — kişinin başına `over` ile */
const Helmet = (r: Rig, c = '#f2c230') => {
  const [hx, hy] = r.head;
  const R = r.headR * 1.12;
  return (
    <OG sh={[
      { d: `M${hx - R} ${hy - R * 0.15}A${R} ${R * 0.95} 0 0 1 ${hx + R} ${hy - R * 0.15}Z`, f: c },
      { d: rrect(hx - R * 1.12, hy - R * 0.2, R * 2.24, R * 0.28, 2), f: shade(c, 0.1) },
    ]} />
  );
};

/** Emniyet kemeri kayışları (yan görünüş) — gövdeye `mid` ile */
const Harness = (r: Rig) => {
  const c = '#e0503a';
  return (
    <g fill="none" stroke-linecap="round">
      <path d={`M${r.neck[0] - 4} ${r.neck[1] + 3}L${r.hip[0] + 5} ${r.hip[1] - 4}`} stroke={K.out} stroke-width={6} />
      <path d={`M${r.neck[0] - 4} ${r.neck[1] + 3}L${r.hip[0] + 5} ${r.hip[1] - 4}`} stroke={c} stroke-width={3.6} />
      <path d={`M${r.hip[0] - 10} ${r.hip[1] - 6}L${r.hip[0] + 10} ${r.hip[1] - 6}`} stroke={K.out} stroke-width={6.5} />
      <path d={`M${r.hip[0] - 10} ${r.hip[1] - 6}L${r.hip[0] + 10} ${r.hip[1] - 6}`} stroke={c} stroke-width={4} />
    </g>
  );
};

const Rope = ({ pts, w = 2.6, c = M.ip }: { pts: P[]; w?: number; c?: string }) => (
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d={smooth(pts)} stroke={K.out} stroke-width={w + 2} />
    <path d={smooth(pts)} stroke={c} stroke-width={w} />
  </g>
);

/** Damla dizisi (akan su) */
const Stream = ({ from, to, w = 5 }: { from: P; to: P; w?: number }) => (
  <g fill="none" stroke-linecap="round">
    <path d={`M${from[0]} ${from[1]}Q${from[0] + (to[0] - from[0]) * 0.8} ${from[1]} ${to[0]} ${to[1]}`} stroke={shade(M.su, 0.25)} stroke-width={w + 2} />
    <path d={`M${from[0]} ${from[1]}Q${from[0] + (to[0] - from[0]) * 0.8} ${from[1]} ${to[0]} ${to[1]}`} stroke={K.waterLight} stroke-width={w} />
  </g>
);

/** Boru (kalın çizgi) */
const Pipe = ({ pts, w = 7, c = '#6f7d8c' }: { pts: P[]; w?: number; c?: string }) => (
  <g fill="none" stroke-linecap="butt" stroke-linejoin="round">
    <path d={`M${pts.map((p) => p.join(' ')).join('L')}`} stroke={K.out} stroke-width={w + 3} />
    <path d={`M${pts.map((p) => p.join(' ')).join('L')}`} stroke={c} stroke-width={w} />
  </g>
);

/** Kesit sahnesi için yer altı kuyu şaftı: x merkez, y0 ağız, y1 dip, w genişlik */
function Shaft({ x, y0, y1, w }: { x: number; y0: number; y1: number; w: number }) {
  return <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} fill="#4a3b2e" stroke={K.out} stroke-width={1.5} />;
}

/** Toprak kesit zemini (gy'den aşağı) */
const Ground = ({ gy, c = M.toprak }: { gy: number; c?: string }) => (
  <g>
    <rect x={0} y={gy} width={320} height={240 - gy} fill={c} />
    {[...Array(14)].map((_, i) => (
      <ellipse key={i} cx={(i * 53) % 310 + 8} cy={gy + 14 + ((i * 29) % (232 - gy > 20 ? 232 - gy - 14 : 10))} rx={3.5} ry={2.2} fill={shade(c, 0.18)} />
    ))}
    <rect x={0} y={gy - 4} width={320} height={6} fill={K.grass} stroke={K.out} stroke-width={1.2} />
  </g>
);

/** Tuvalet kulübesi */
function Outhouse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <T x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-24 0V-60H24V0Z', f: '#a8744a' },
        { d: 'M8 0V-60H24V0Z', f: shade('#a8744a', 0.14), no: true },
        { d: 'M-30 -58L0 -76L30 -58Z', f: '#7d5638' },
        { d: rrect(-14, -50, 22, 50, 2), f: shade('#a8744a', 0.25) },
        { d: 'M-6 -42 a3 4 0 1 0 0.1 0', f: '#fff' },
      ]} />
    </T>
  );
}


/** Şeffaf PET şişe (taban ortası). water: suyun rengi, fill: doluluk 0..1 */
function PetBottle({ x, y, s = 1, a = 0, water = M.su, fill = 0.8, scratched, tintC }: { x: number; y: number; s?: number; a?: number; water?: string; fill?: number; scratched?: boolean; tintC?: string }) {
  const body = 'M-12 -2V-50Q-12 -60 -5 -64V-72H5V-64Q12 -60 12 -50V-2Q12 0 10 0H-10Q-12 0 -12 -2Z';
  const wl = -64 * fill;
  return (
    <T x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[
        { d: body, f: tintC ?? '#eef7fb', op: tintC ? 1 : 0.85 },
        { d: `M-12 ${wl}H12V-2Q12 0 10 0H-10Q-12 0 -12 -2Z`, f: water, no: true, op: tintC ? 0.5 : 1 },
        { d: 'M-12 -22H12M-12 -40H12', st: shade('#cfe3ee', 0.2), sw: 1 },
        { d: rrect(-6, -80, 12, 9, 2), f: '#3d7ad6' },
        { d: 'M-7 -54V-10', st: '#fff', sw: 2.2 },
        ...(scratched ? [{ d: 'M-8 -46L6 -30M-4 -20L9 -36M-9 -14L2 -6M0 -50L10 -44', st: '#7c7c7c', sw: 1.3 }] : []),
      ]} />
    </T>
  );
}

/** Şeffaf geniş ağızlı kap/küp (taban ortası). level: su doluluğu; mud: dipte çamur */
function Tub({ x, y, s = 1, water = M.su, level = 0.8, mud }: { x: number; y: number; s?: number; water?: string; level?: number; mud?: boolean }) {
  const h = 66, w = 30;
  const top = -h * level;
  const wAt = (yy: number) => w - 5 * (1 + yy / h);
  const body = `M${-w} ${-h}H${w}L${w - 5} -2Q${w - 5} 0 ${w - 7} 0H${-w + 7}Q${-w + 5} 0 ${-w + 5} -2Z`;
  return (
    <T x={x} y={y} s={s}>
      <path d={body} fill="#f2f7fa" />
      <path d={`M${-wAt(top)} ${top}H${wAt(top)}L${w - 5} -2Q${w - 5} 0 ${w - 7} 0H${-w + 7}Q${-w + 5} 0 ${-w + 5} -2Z`} fill={water} />
      <path d={ell([0, top], wAt(top), 4)} fill={tint(water, 0.3)} />
      {mud && <path d={`M${-w + 6} -14Q0 -20 ${w - 6} -14L${w - 5} -2Q${w - 5} 0 ${w - 7} 0H${-w + 7}Q${-w + 5} 0 ${-w + 5} -2Z`} fill={M.camur} />}
      <path d={body} fill="none" stroke={K.out} stroke-width={1.8 / s} />
      <path d={ell([0, -h], w, 5)} fill="none" stroke={K.out} stroke-width={1.8 / s} />
      <path d={`M${-w + 6} ${-h + 8}V-8`} stroke="#fff" stroke-width={2.5 / s} opacity={0.7} />
    </T>
  );
}


/** Ev tipi biyokum filtre kutusu (taban ortası), dışı beton, yan çıkış borusu ve kap */
function BsFilter({ x, y }: { x: number; y: number }) {
  const w = 66, h = 92;
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={M.beton} stroke={K.out} stroke-width={1.5} />
      <rect x={x + w / 2 - 14} y={y - h} width={14} height={h} fill={shade(M.beton, 0.12)} />
      <rect x={x - w / 2 - 3} y={y - h - 6} width={w + 6} height={7} rx={2} fill="#1f2631" stroke={K.out} stroke-width={1.3} />
      <Pipe pts={[[x + w / 2, y - h + 26], [x + w / 2 + 20, y - h + 26], [x + w / 2 + 20, y - h + 36]]} w={6} />
      <path d={`M${x + w / 2 + 20} ${y - h + 42}V${y - 50}`} stroke={K.waterLight} stroke-width={3} stroke-linecap="round" />
      <Tub x={x + w / 2 + 20} y={y} s={0.7} water={K.waterLight} level={0.4} />
    </g>
  );
}

/** Alev (kitin alev çizimi; kit bileşeni G kullanır, burada sade kopya) */
const Flame3 = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-17 0-23-13-17-26C-13-35-5-37-6-50C4-43 9-34 7-25C11-28 13-32 13-37C21-27 21-12 15-5C11-1 6 0 0 0Z" fill={K.fireRed} />
    <path d="M0 0C-11 0-14-8-10-16C-7-22-2-23-2-31C4-26 7-20 5-13C8-15 9-17 9-20C13-14 13-6 9-3C6 -0.5 3 0 0 0Z" fill={K.fire} />
    <path d="M0 0C-5 0-7-4-5-8C-3-11 0-11 0-16C3-13 5-9 4-5C3-2 2 0 0 0Z" fill={K.fireCore} />
  </g>
);

/** Katlanmış temiz bez yığını (merkez) */
const Cloth2 = ({ x, y }: { x: number; y: number }) => (
  <OG sh={[
    { d: rrect(x - 30, y + 10, 60, 14, 3), f: '#f4f1ea' },
    { d: rrect(x - 28, y - 4, 56, 14, 3), f: '#e8f1f6' },
    { d: rrect(x - 26, y - 18, 52, 14, 3), f: '#f4f1ea' },
  ]} />
);

/* ═════════════ SAHNELER ═════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ───── Kaynak arama ───── */
  'sf-sd-kaynak-vadi': () => {
    // Yamaç kesiti: toprak altında eğik geçirimsiz katman; su katmanın üstünden yamaca çıkar.
    const surf: P[] = [[0, 62], [70, 74], [140, 104], [196, 140], [236, 168], [270, 186], [320, 190]];
    const ground = smooth(surf) + 'L320 240L0 240Z';
    const layerTop = 'M0 112L205 148';
    const spring: P = [205, 148];
    return (
      <Scene2 bg="outdoor" gy={240}>
        <path d={ground} fill={M.toprak} stroke={K.out} stroke-width={1.5} />
        {/* geçirimsiz kaya/kil katmanı */}
        <path d={'M0 112L205 148' + 'Q240 170 268 196L320 206V240H0Z'} fill={M.kaya} stroke={K.out} stroke-width={1.5} />
        <path d={'M0 150L320 230V240H0Z'} fill={shade(M.kaya, 0.2)} />
        {/* çimen */}
        <path d={smooth(surf)} fill="none" stroke={K.grassShade} stroke-width={6} />
        <path d={smooth(surf)} fill="none" stroke={K.out} stroke-width={1.3} />
        {/* sızan su: katmanın üstünde */}
        <path d={layerTop} fill="none" stroke={M.su} stroke-width={5} stroke-dasharray="10 7" stroke-linecap="round" transform="translate(0 -4)" />
        {/* yağmur */}
        {[[30, 20], [60, 34], [96, 22], [128, 40]].map(([dx, dy], i) => (
          <path key={i} d={`M${dx} ${dy}l-3 9`} stroke={M.su} stroke-width={3} stroke-linecap="round" />
        ))}
        {/* kaynaktan dereye akan su */}
        <path d={smooth([spring, [228, 162], [252, 180], [278, 190]])} fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
        <path d={smooth([spring, [228, 162], [252, 180], [278, 190]])} fill="none" stroke={M.su} stroke-width={5} stroke-linecap="round" />
        <path d="M262 190Q290 184 320 188V198H262Z" fill={M.su} stroke={K.out} stroke-width={1.5} />
        <Tree x={50} y={70} s={0.75} />
        <Tree x={112} y={92} s={0.6} kind="pine" />
        <circle cx={spring[0]} cy={spring[1]} r={8} fill={K.waterLight} stroke={K.out} stroke-width={1.5} />
        <Arrow from={[262, 92]} to={[216, 138]} />
      </Scene2>
    );
  },

  'sf-sd-kaynak-bitki': () => {
    const strip = 'M150 104Q190 106 230 112L320 210V240H170Z';
    const p: PersonProps = { ...CAST.koylu, x: 74, y: 226, s: 1.05, pose: { ...POSE.standSide, armF: [-14, -12], handF: { shape: 'flat', a: 0 }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={110}>
        <path d="M0 110Q150 96 320 116V240H0Z" fill={M.kuru} stroke={K.out} stroke-width={1.5} />
        <path d="M0 160Q160 150 320 168V240H0Z" fill={M.kuruDk} opacity={0.6} />
        {/* kuraklıkta yeşil kalan şerit */}
        <path d={strip} fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <Tree x={186} y={124} s={0.55} />
        <Tree x={226} y={132} s={0.75} />
        <Tree x={262} y={176} s={0.9} />
        <Tree x={212} y={192} s={0.7} />
        {[[196, 222], [206, 226], [250, 230], [260, 226], [282, 214]].map(([rx, ry], i) => (
          <path key={i} d={`M${rx} ${ry}l-4 -22M${rx} ${ry}l0 -26M${rx} ${ry}l5 -20`} stroke={K.grassShade} stroke-width={3} stroke-linecap="round" />
        ))}
        <Person {...p} />
        <Ok x={290} y={40} r={14} />
      </Scene2>
    );
  },

  'sf-sd-debi-olcme': () => {
    const mouth: P = [118, 116];
    const p: PersonProps = { ...CAST.koylu, x: 236, y: 226, s: 1.05, flip: true, pose: { ...POSE.kneelOne, spine: -70, chest: -64, armF: { to: [170, 196] }, armB: { to: [176, 198] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Stones x={16} y={70} w={100} h={140} />
        <Pipe pts={[[100, mouth[1]], [mouth[0] + 10, mouth[1]]]} w={9} />
        <Stream from={[mouth[0] + 13, mouth[1]]} to={[150, 186]} w={6} />
        <Bucket x={152} y={226} s={1.2} fill={K.waterLight} />
        <Label x={152} y={208} text="10 L" size={13} />
        <Person {...p} />
        <Timer x={246} y={56} r={18} text="? sn" />
      </Scene2>
    );
  },

  /* ───── Kaptaj ───── */
  'sf-sd-kaptaj-kesit': () => {
    // Yamaç kesiti: göz çevresinde çakıl, üstünde iri taş, kil, toprak + çim; çakıldan çıkan boru duvara gider.
    const surf: P[] = [[0, 70], [80, 84], [150, 112], [200, 140], [250, 168], [320, 176]];
    const gravel = 'M60 150Q60 118 100 116Q140 118 142 150Q142 172 100 174Q62 172 60 150Z';
    return (
      <Scene2 bg="outdoor" gy={240}>
        <path d={smooth(surf) + 'L320 240L0 240Z'} fill={M.toprak} stroke={K.out} stroke-width={1.5} />
        <path d="M0 160Q100 172 200 190L320 214V240H0Z" fill={M.kaya} stroke={K.out} stroke-width={1.5} />
        {/* kil tabakası (kubbe) */}
        <path d="M44 150Q44 92 100 90Q158 92 160 150Z" fill={M.kil} stroke={K.out} stroke-width={1.5} />
        {/* iri taşlar */}
        {[[66, 122], [86, 108], [110, 106], [132, 116], [146, 134], [56, 140]].map(([sx, sy], i) => (
          <path key={i} d={ell([sx, sy], 11, 8)} fill={i % 2 ? M.tas : shade(M.tas, 0.1)} stroke={K.out} stroke-width={1.3} />
        ))}
        <Gravel d={gravel} box={[58, 114, 86, 62]} id="kk-g" />
        {/* su gözü */}
        <path d="M78 168Q100 162 120 168" fill="none" stroke={M.su} stroke-width={4} stroke-linecap="round" />
        <circle cx={100} cy={160} r={6} fill={K.waterLight} stroke={K.out} stroke-width={1.3} />
        {/* boru ve çıkış duvarı */}
        <Pipe pts={[[138, 156], [236, 166], [254, 166]]} w={6} />
        <Stones x={226} y={126} w={30} h={58} />
        <Pipe pts={[[250, 160], [266, 160]]} w={6} />
        <Stream from={[268, 160]} to={[284, 196]} w={4} />
        <Bucket x={286} y={214} s={0.75} fill={K.waterLight} />
        {/* çimen ve işaret taşı */}
        <path d={smooth(surf)} fill="none" stroke={K.grassShade} stroke-width={6} />
        <Rock x={100} y={82} s={0.55} />
        <path d="M30 112L52 128" stroke={K.ink} stroke-width={1.5} />
        <Label x={26} y={104} text="kil" size={12} bg={K.white} />
        <Label x={36} y={196} text="çakıl" size={12} bg={K.white} />
        <path d="M50 188L72 162" stroke={K.ink} stroke-width={1.5} />
      </Scene2>
    );
  },

  'sf-sd-kaptaj-duvar': () => (
    <Scene2 bg="outdoor" gy={150}>
      <path d="M0 150Q160 120 320 150V240H0Z" fill={K.grass} />
      {/* eğimli beton taban ve ark */}
      <path d="M60 196L250 196L280 230H30Z" fill={M.beton} stroke={K.out} stroke-width={1.5} />
      <path d="M250 206L320 204V218L266 220Z" fill={shade(M.beton, 0.15)} stroke={K.out} stroke-width={1.5} />
      <path d="M262 212L320 210" stroke={M.su} stroke-width={4} stroke-linecap="round" />
      <Stones x={70} y={84} w={170} h={112} />
      <Pipe pts={[[156, 128], [176, 128]]} w={10} />
      <Stream from={[178, 128]} to={[198, 196]} w={7} />
      <Bucket x={202} y={214} s={1.15} fill={K.waterLight} />
      <Ok x={42} y={60} r={14} />
    </Scene2>
  ),

  'sf-sd-kaptaj-cit': () => {
    // Yukarıdan: göz, çevresinde çit; yukarıda (üstte) suyu yana akıtan hendek.
    const eye: P = [160, 140];
    const posts: P[] = [];
    for (let x = 76; x <= 244; x += 21) { posts.push([x, 78]); posts.push([x, 214]); }
    for (let y = 99; y < 214; y += 23) { posts.push([76, y]); posts.push([244, y]); }
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill={K.grass} />
        {[...Array(30)].map((_, i) => (
          <path key={i} d={`M${(i * 67) % 310 + 6} ${(i * 41) % 230 + 6}l3 -5l3 5`} stroke={K.grassShade} stroke-width={1.5} fill="none" />
        ))}
        {/* hendek */}
        <path d="M-10 52Q160 22 330 52" fill="none" stroke={K.out} stroke-width={15} />
        <path d="M-10 52Q160 22 330 52" fill="none" stroke={M.toprakDk} stroke-width={12} />
        <path d="M-10 52Q160 22 330 52" fill="none" stroke={M.su} stroke-width={5} />
        <Arrow from={[150, 30]} to={[40, 44]} bend={0.08} w={5} />
        <Arrow from={[170, 30]} to={[280, 44]} bend={-0.08} w={5} />
        {/* çit */}
        <rect x={76} y={78} width={168} height={136} fill="none" stroke={K.out} stroke-width={5} />
        <rect x={76} y={78} width={168} height={136} fill="none" stroke="#c49a6c" stroke-width={2.6} />
        {posts.map((p, i) => <rect key={i} x={p[0] - 4} y={p[1] - 4} width={8} height={8} fill="#8a5d3a" stroke={K.out} stroke-width={1.3} />)}
        {/* göz ve boru */}
        <path d={ell(eye, 24, 18)} fill={M.cakil} stroke={K.out} stroke-width={1.5} />
        <path d={ell(eye, 10, 8)} fill={M.su} stroke={K.out} stroke-width={1.3} />
        <path d="M160 160V214" stroke={K.out} stroke-width={6} stroke-dasharray="8 6" />
        <Stones x={136} y={214} w={48} h={20} r={6} />
        <Dim a={[200, 124]} b={[200, 84]} c={K.ink} />
        <Label x={222} y={104} text="10 m" size={12} bg={K.white} />
      </Scene2>
    );
  },

  /* ───── Kuyu 1: yer seçimi ───── */
  'sf-sd-kuyu-mesafe': () => (
    <Scene2 bg="outdoor" gy={240}>
      <path d="M0 140Q160 150 320 196V240H0Z" fill={K.grass} stroke={K.out} stroke-width={1.5} />
      <WellRing x={64} y={150} w={64} h={34} />
      <Outhouse x={268} y={204} s={0.95} />
      <Dim a={[100, 120]} b={[236, 150]} />
      <Label x={168} y={116} text="30 m" size={15} />
      <Ok x={64} y={86} r={13} />
    </Scene2>
  ),

  'sf-sd-kuyu-egim': () => {
    const Stake = ({ x, y }: { x: number; y: number }) => (
      <g>
        <OG sh={[{ d: rrect(x - 2.5, y - 46, 5, 48, 1.5), f: K.wood }, { d: `M${x + 2} ${y - 46}L${x + 22} ${y - 40}L${x + 2} ${y - 34}Z`, f: K.action }]} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={240}>
        {/* sol: çukur, su birikintisi */}
        <path d="M0 170Q40 166 70 190Q100 206 130 190Q150 172 160 170V240H0Z" fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <path d="M58 186Q100 210 140 186Z" fill={M.su} stroke={K.out} stroke-width={1.3} />
        <Stake x={98} y={198} />
        {[[40, 110], [70, 96], [120, 104]].map(([rx, ry], i) => <path key={i} d={`M${rx} ${ry}l-3 9`} stroke={M.su} stroke-width={3} stroke-linecap="round" />)}
        <Arrow from={[30, 160]} to={[66, 182]} w={4} color={M.su} />
        <Arrow from={[156, 160]} to={[130, 180]} w={4} color={M.su} />
        <No x={98} y={150} r={30} />
        {/* sağ: tümsek */}
        <path d="M160 200Q210 196 240 172Q270 196 320 200V240H160Z" fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <Stake x={240} y={176} />
        <Arrow from={[226, 170]} to={[186, 198]} w={4} color={M.su} />
        <Arrow from={[254, 170]} to={[294, 198]} w={4} color={M.su} />
        <Ok x={240} y={100} r={15} />
        <rect x={158.5} y={0} width={3} height={240} fill={K.white} />
      </Scene2>
    );
  },

  'sf-sd-kuyu-ekip': () => {
    const apex: P = [150, 52];
    const hole = { x: 150, y: 196 };
    const top: PersonProps = { ...CAST.kuyucu, x: 262, y: 222, s: 1, flip: true, pose: { ...POSE.standSide, spine: -96, armF: { to: [228, 128] }, armB: { to: [238, 142] }, face: 'neutral' } };
    const down: PersonProps = { ...CAST.kazici, x: 52, y: 222, s: 1, pose: { ...POSE.standSide, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Fence x1={14} x2={306} y={186} h={30} n={8} />
        {/* kuyu ağzı (karanlık delik) */}
        <path d={ell([hole.x, hole.y + 8], 40, 10)} fill="#1f2631" stroke={K.out} stroke-width={1.5} />
        {/* sehpa */}
        <OG sh={[
          { d: capsule([96, 214], 4, apex, 3), f: K.wood },
          { d: capsule([204, 214], 4, apex, 3), f: K.wood },
          { d: capsule([150, 190], 3, apex, 3), f: shade(K.wood, 0.2) },
          { d: circ(apex, 9), f: K.metal },
          { d: circ(apex, 3), f: K.out },
        ]} />
        <Rope pts={[[apex[0] - 8, apex[1]], [apex[0] - 8, 190]]} />
        <Rope pts={[[apex[0] + 7, apex[1] + 3], [232, 134], [244, 150]]} />
        <Person {...top} />
        <Person {...down} mid={Harness} over={(r) => Helmet(r)} />
      </Scene2>
    );
  },

  /* ───── Kuyu 2: kazma ve kaplama (kesit) ───── */
  'sf-sd-kuyu-kemer': () => {
    const gy = 104;
    const post: P = [236, gy];
    const dig: PersonProps = { ...CAST.kazici, x: 146, y: 232, s: 0.66, pose: { ...POSE.standSide, spine: -84, armF: { to: [168, 214] }, armB: { to: [160, 200] }, face: 'neutral' } };
    const d = rig(dig);
    const top: PersonProps = { ...CAST.kuyucu, x: 272, y: gy + 2, s: 0.6, flip: true, pose: { ...POSE.standSide, spine: -98, armF: { to: [244, 58] }, armB: { to: [250, 66] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        <Shaft x={150} y0={gy} y1={240} w={84} />
        {/* sabit direk ve halat */}
        <OG sh={[{ d: rrect(post[0] - 4, 34, 8, gy - 34 + 6, 2), f: K.wood }]} />
        <Rope pts={[[d.neck[0] - 2, d.neck[1] + 4], [150, 140], [150, gy - 2], [182, 60], [post[0] - 4, 52]]} />
        <Rope pts={[[post[0] + 4, 54], [246, 60], [250, 66]]} />
        {/* kürek */}
        <OG sh={[{ d: capsule([156, 196], 2, [176, 228], 2), f: K.wood }, { d: 'M170 224L184 222L186 234L172 236Z', f: K.metal }]} />
        <Person {...dig} mid={Harness} over={(r) => Helmet(r)} />
        <Person {...top} />
      </Scene2>
    );
  },

  'sf-sd-kuyu-havalandirma': () => {
    const gy = 104;
    const top: PersonProps = { ...CAST.kuyucu, x: 216, y: gy + 2, s: 0.66, flip: true, pose: { ...POSE.standSide, spine: -62, chest: -50, head: -36, armF: { to: [178, 96] }, armB: { to: [182, 92] }, face: 'neutral' } };
    const hr = rig(top);
    const cy = 196;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        <Shaft x={150} y0={gy} y1={240} w={84} />
        <Rope pts={[[hr.handF[0], hr.handF[1]], [160, 118], [150, cy - 30]]} w={2} />
        {/* mum ve tabla */}
        <path d={`M138 ${cy}H162`} stroke={K.out} stroke-width={4} stroke-linecap="round" />
        <path d={`M150 ${cy - 30}L140 ${cy}M150 ${cy - 30}L160 ${cy}`} stroke={K.out} stroke-width={1.2} />
        <OG sh={[{ d: rrect(145, cy - 22, 10, 22, 2), f: K.white }]} />
        <g transform={`translate(150 ${cy - 22}) scale(0.42)`}>
          <path d="M0 0C-17 0-23-13-17-26C-13-35-5-37-6-50C4-43 9-34 7-25C11-28 13-32 13-37C21-27 21-12 15-5C11-1 6 0 0 0Z" fill={K.fireRed} />
          <path d="M0 0C-11 0-14-8-10-16C-7-22-2-23-2-31C4-26 7-20 5-13C8-15 9-17 9-20C13-14 13-6 9-3C6 -0.5 3 0 0 0Z" fill={K.fireCore} />
        </g>
        <circle cx={150} cy={cy - 30} r={26} fill={K.fireCore} opacity={0.18} />
        <Person {...top} />
      </Scene2>
    );
  },

  'sf-sd-kuyu-kaplama': () => {
    const gy = 70;
    const ring = (y: number, i: number) => (
      <g key={i}>
        <rect x={104} y={y} width={12} height={30} fill={M.beton} stroke={K.out} stroke-width={1.4} />
        <rect x={184} y={y} width={12} height={30} fill={M.beton} stroke={K.out} stroke-width={1.4} />
      </g>
    );
    const dig: PersonProps = { ...CAST.kazici, x: 150, y: 234, s: 0.6, pose: { ...POSE.bend, spine: -50, chest: -40, armF: { to: [168, 226] }, armB: { to: [160, 214] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        <Shaft x={150} y0={gy} y1={240} w={96} />
        {[0, 1, 2, 3].map((i) => ring(gy + i * 30, i))}
        {/* yeni kazılan kısım: kaplamasız */}
        <path d={`M102 ${gy + 120}V240M198 ${gy + 120}V240`} stroke={M.toprakDk} stroke-width={3} stroke-dasharray="4 4" />
        <OG sh={[{ d: capsule([156, 210], 2, [174, 232], 2), f: K.wood }, { d: 'M168 228L182 226L184 236L170 238Z', f: K.metal }]} />
        <Person {...dig} over={(r) => Helmet(r)} />
        <Arrow from={[234, 84]} to={[234, 200]} w={6} />
        <Ok x={268} y={40} r={13} />
      </Scene2>
    );
  },

  /* ───── Kuyu 3: kuyu ağzı ───── */
  'sf-sd-kuyu-agzi-kesit': () => {
    const gy = 200;
    const p: PersonProps = { ...CAST.koylu, x: 270, y: 226, s: 0.92, flip: true, pose: { ...POSE.standSide, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* eğimli taban ve setler */}
        <path d="M24 214L60 200H200L236 214Z" fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(18, 205, 10, 11, 2), f: shade(M.beton, 0.2) }, { d: rrect(232, 205, 10, 11, 2), f: shade(M.beton, 0.2) }]} />
        <WellRing x={130} y={204} w={104} h={88} open={false} />
        <path d={ell([130, 116], 56, 14)} fill="#9a6a42" stroke={K.out} stroke-width={1.5} />
        <path d="M78 116H182" stroke={shade('#9a6a42', 0.3)} stroke-width={1.2} />
        {[[52, 150], [214, 150], [100, 90], [164, 88]].map(([rx, ry], i) => <path key={i} d={`M${rx} ${ry}l-3 9`} stroke={M.su} stroke-width={3} stroke-linecap="round" />)}
        <Arrow from={[70, 196]} to={[34, 206]} w={4} color={M.su} />
        <Arrow from={[190, 196]} to={[226, 206]} w={4} color={M.su} />
        <Dim a={[64, 202]} b={[64, 118]} />
        <Label x={40} y={160} text="1 m" size={13} bg={K.white} />
        <Person {...p} />
      </Scene2>
    );
  },

  'sf-sd-kuyu-ark': () => {
    const gy = 170;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d="M20 196L44 184H118L142 196Z" fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <WellRing x={81} y={188} w={64} h={52} open={false} />
        <path d={ell([81, 136], 35, 9)} fill="#9a6a42" stroke={K.out} stroke-width={1.5} />
        {/* sıvalı ark */}
        <path d="M134 194L258 206L258 216L130 202Z" fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <path d="M134 197L258 210" stroke={M.su} stroke-width={4} stroke-linecap="round" />
        {/* bahçe tarhı */}
        <path d="M236 216Q270 196 318 204V240H232Z" fill={M.toprakDk} stroke={K.out} stroke-width={1.5} />
        {[250, 272, 294].map((x, i) => (
          <g key={i}>
            <path d={ell([x - 5, 202 - i], 7, 4)} fill={K.leaf} stroke={K.out} stroke-width={1.2} />
            <path d={ell([x + 5, 200 - i], 7, 4)} fill={K.leaf} stroke={K.out} stroke-width={1.2} />
            <path d={`M${x} ${210 - i}V198`} stroke={K.grassShade} stroke-width={2} />
          </g>
        ))}
        <Dim a={[138, 184]} b={[256, 196]} />
        <Label x={196} y={166} text="4 m+" size={14} bg={K.white} />
      </Scene2>
    );
  },

  'sf-sd-kuyu-kapak': () => {
    const c = '#9a6a42';
    return (
      <Scene2 bg="outdoor" gy={200}>
        <WellRing x={160} y={226} w={200} h={90} open={false} />
        {/* ağzı taşan kapak */}
        <OG sh={[
          { d: `M${160 - 116} 132V140A116 30 0 0 0 ${160 + 116} 140V132Z`, f: shade(c, 0.2) },
          { d: ell([160, 132], 116, 30), f: c },
          { d: 'M74 118L74 146M114 106V158M160 102V162M206 106V158M246 118V146', st: shade(c, 0.35), sw: 1.4 },
          { d: rrect(134, 116, 52, 30, 3), f: tint(c, 0.15) },
          { d: rrect(128, 126, 8, 10, 2), f: K.metal },
          { d: rrect(176, 129, 12, 5, 2), f: K.out },
        ]} />
        {[[90, 60], [140, 46], [196, 54], [244, 66]].map(([rx, ry], i) => <path key={i} d={`M${rx} ${ry}l-3 9`} stroke={M.su} stroke-width={3} stroke-linecap="round" />)}
        <Arrow from={[52, 140]} to={[26, 168]} w={4} color={M.su} />
        <Arrow from={[268, 140]} to={[294, 168]} w={4} color={M.su} />
        <Ok x={276} y={44} r={14} />
      </Scene2>
    );
  },

  /* ───── Kuyu 4: klorlama (kesit, yukarıdan) ───── */
  'sf-sd-kuyu-fircalama': () => {
    const gy = 112;
    const p: PersonProps = { ...CAST.kazici, x: 238, y: gy + 2, s: 0.66, flip: true, glasses: true, pose: { ...POSE.standSide, spine: -84, armF: { to: [196, 64] }, armB: { to: [204, 82] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        <Shaft x={140} y0={gy} y1={240} w={76} />
        {/* yükseltilmiş bilezik (kesit) */}
        <rect x={92} y={72} width={10} height={168} fill={M.beton} stroke={K.out} stroke-width={1.4} />
        <rect x={178} y={72} width={10} height={168} fill={M.beton} stroke={K.out} stroke-width={1.4} />
        <rect x={102} y={214} width={76} height={26} fill={K.waterLight} stroke={K.out} stroke-width={1.2} opacity={0.9} />
        {/* uzun saplı fırça */}
        <OG sh={[{ d: capsule([206, 56], 2.5, [114, 182], 2.5), f: K.wood }, { d: rrect(102, 172, 10, 30, 3), f: '#d65b3a' }]} />
        {[176, 182, 188, 194, 200].map((y) => <path key={y} d={`M102 ${y}H98`} stroke={K.out} stroke-width={1.5} />)}
        <Person {...p} over={(r) => <g>{[r.handF, r.handB].map((h, i) => <circle key={i} cx={h[0]} cy={h[1]} r={4.2} fill="#f2c230" stroke={K.out} stroke-width={1.2} />)}</g>} />
      </Scene2>
    );
  },

  'sf-sd-kuyu-klor-dokme': () => {
    const gy = 112;
    const bk: P = [200, 40];
    const p: PersonProps = { ...CAST.kazici, x: 236, y: gy + 2, s: 0.66, flip: true, glasses: true, pose: { ...POSE.standSide, spine: -84, armF: { to: [bk[0] + 3, bk[1] + 16] }, armB: { to: [bk[0] - 12, bk[1] + 2] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        <Shaft x={140} y0={gy} y1={240} w={76} />
        <rect x={92} y={72} width={10} height={168} fill={M.beton} stroke={K.out} stroke-width={1.4} />
        <rect x={178} y={72} width={10} height={168} fill={M.beton} stroke={K.out} stroke-width={1.4} />
        <rect x={102} y={200} width={76} height={40} fill={K.waterLight} stroke={K.out} stroke-width={1.2} />
        <path d={`M${bk[0] - 22} ${bk[1] + 24}Q146 80 142 200`} fill="none" stroke="#c9d870" stroke-width={8} stroke-linecap="round" />
        <path d={`M${bk[0] - 22} ${bk[1] + 24}Q146 80 142 200`} fill="none" stroke="#e7f0b8" stroke-width={5} stroke-linecap="round" />
        <Bucket x={bk[0]} y={bk[1] + 14} s={0.7} a={-115} fill="#e7f0b8" />
        <Jerry x={290} y={128} s={0.8} color={K.white} />
        <Label x={288} y={150} text="%0,2" size={12} />
        <Person {...p} over={(r) => <g>{[r.handF, r.handB].map((h, i) => <circle key={i} cx={h[0]} cy={h[1]} r={4.2} fill="#f2c230" stroke={K.out} stroke-width={1.2} />)}</g>} />
      </Scene2>
    );
  },

  'sf-sd-kuyu-karistirma': () => {
    const gy = 112;
    const p: PersonProps = { ...CAST.kazici, x: 238, y: gy + 2, s: 0.66, flip: true, glasses: true, pose: { ...POSE.standSide, spine: -84, armF: { to: [196, 62] }, armB: { to: [204, 80] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        <Shaft x={140} y0={gy} y1={240} w={76} />
        <rect x={92} y={72} width={10} height={168} fill={M.beton} stroke={K.out} stroke-width={1.4} />
        <rect x={178} y={72} width={10} height={168} fill={M.beton} stroke={K.out} stroke-width={1.4} />
        <rect x={102} y={180} width={76} height={60} fill={K.waterLight} stroke={K.out} stroke-width={1.2} />
        <OG sh={[{ d: capsule([208, 52], 2.5, [128, 226], 2.5), f: K.wood }]} />
        <path d="M112 196Q140 186 166 196" fill="none" stroke={K.action} stroke-width={3.5} stroke-linecap="round" />
        <path d="M160 190L168 197L158 200" fill="none" stroke={K.action} stroke-width={3.5} stroke-linecap="round" stroke-linejoin="round" />
        {/* kova ve ip de suda */}
        <Rope pts={[[100, 72], [116, 120], [118, 196]]} w={2} />
        <Bucket x={120} y={228} s={0.55} fill={K.waterLight} />
        <Person {...p} over={(r) => <g>{[r.handF, r.handB].map((h, i) => <circle key={i} cx={h[0]} cy={h[1]} r={4.2} fill="#f2c230" stroke={K.out} stroke-width={1.2} />)}</g>} />
        <Timer x={36} y={40} r={15} text="30 dk" />
      </Scene2>
    );
  },

  /* ───── Çıkrık ve makara ───── */
  'sf-sd-cikrik': () => {
    const ax = 102; // mil yüksekliği
    const crank: P = [238, ax + 30];
    const w: PersonProps = { ...CAST.kadin, x: 276, y: 228, s: 0.95, pose: { ...POSE.stand, armB: { to: [crank[0] + 2, crank[1]] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <WellRing x={150} y={216} w={130} h={46} open />
        <Stones x={74} y={ax - 10} w={22} h={124} r={6} />
        <Stones x={204} y={ax - 10} w={22} h={124} r={6} />
        {/* mil, tambur, kol */}
        <OG sh={[
          { d: rrect(90, ax - 3, 144, 7, 3), f: K.metal },
          { d: rrect(122, ax - 14, 56, 28, 5), f: K.wood },
          { d: 'M130 -0M130 ' + (ax - 14) + 'V' + (ax + 14) + 'M142 ' + (ax - 14) + 'V' + (ax + 14) + 'M154 ' + (ax - 14) + 'V' + (ax + 14) + 'M166 ' + (ax - 14) + 'V' + (ax + 14), st: shade(K.wood, 0.3), sw: 1.2 },
          { d: capsule([232, ax], 3.5, crank, 3.5), f: K.metal },
          { d: capsule([crank[0], crank[1]], 4, [crank[0] + 10, crank[1]], 4), f: K.wood },
        ]} />
        <Rope pts={[[150, ax + 14], [150, 150]]} />
        <Bucket x={150} y={176} s={0.75} />
        <Person {...w} />
        <path d={`M${crank[0] - 18} ${ax - 16}A26 26 0 0 1 ${crank[0] + 18} ${ax - 8}`} fill="none" stroke={K.action} stroke-width={4} stroke-linecap="round" />
        <path d={`M${crank[0] + 12} ${ax - 14}L${crank[0] + 19} ${ax - 6}L${crank[0] + 9} ${ax - 4}`} fill="none" stroke={K.action} stroke-width={4} stroke-linecap="round" stroke-linejoin="round" />
      </Scene2>
    );
  },

  'sf-sd-makara-tek-cift': () => {
    const beam = 40;
    const Wheel = ({ c }: { c: P }) => <OG sh={[{ d: circ(c, 14), f: K.metal }, { d: circ(c, 4), f: K.out }]} />;
    // sol: tek makara
    const L: P = [86, beam + 22];
    // sağ: sabit + hareketli makara
    const R1: P = [254, beam + 22];
    const R2: P = [232, 140];
    return (
      <Scene2 bg="closeup">
        <rect x={14} y={beam - 10} width={292} height={12} fill={K.wood} stroke={K.out} stroke-width={1.5} />
        <rect x={158.5} y={beam + 6} width={3} height={190} fill={K.white} />
        {/* tek makara */}
        <path d={`M${L[0]} ${beam}V${L[1]}`} stroke={K.out} stroke-width={3} />
        <Rope pts={[[L[0] - 14, L[1]], [L[0] - 14, 150]]} />
        <Rope pts={[[L[0] + 14, L[1]], [L[0] + 14, 132]]} />
        <path d={`M${L[0] - 14} ${L[1]}A14 14 0 0 1 ${L[0] + 14} ${L[1]}`} fill="none" stroke={M.ip} stroke-width={3} />
        <Wheel c={L} />
        <Bucket x={L[0] - 14} y={190} s={0.8} fill={K.waterLight} />
        <Arrow from={[L[0] + 14, 134]} to={[L[0] + 14, 210]} w={7} />
        <Label x={L[0] + 46} y={176} text="10" size={14} />
        {/* çift makara */}
        <path d={`M${R1[0]} ${beam}V${R1[1]}`} stroke={K.out} stroke-width={3} />
        <Rope pts={[[R2[0] - 14, beam + 2], [R2[0] - 14, R2[1]]]} />
        <Rope pts={[[R2[0] + 14, R2[1]], [R1[0] - 14, R1[1]]]} />
        <path d={`M${R1[0] - 14} ${R1[1]}A14 14 0 0 1 ${R1[0] + 14} ${R1[1]}`} fill="none" stroke={M.ip} stroke-width={3} />
        <path d={`M${R2[0] - 14} ${R2[1]}A14 14 0 0 0 ${R2[0] + 14} ${R2[1]}`} fill="none" stroke={M.ip} stroke-width={3} />
        <Rope pts={[[R1[0] + 14, R1[1]], [R1[0] + 14, 132]]} />
        <Wheel c={R1} />
        <Wheel c={R2} />
        <path d={`M${R2[0]} ${R2[1]}V${R2[1] + 22}`} stroke={K.out} stroke-width={3} />
        <Bucket x={R2[0]} y={R2[1] + 58} s={0.8} fill={K.waterLight} />
        <Arrow from={[R1[0] + 14, 134]} to={[R1[0] + 14, 172]} w={7} />
        <Label x={R1[0] + 44} y={156} text="5" size={14} />
      </Scene2>
    );
  },

  'sf-sd-kova-ip-temiz': () => {
    const ax = 92;
    return (
      <Scene2 bg="outdoor">
        {/* sol: ip tamburda, kova askıda ağzı aşağı */}
        <WellRing x={66} y={206} w={92} h={40} open={false} />
        <Stones x={14} y={ax - 8} w={14} h={110} r={4.5} />
        <Stones x={104} y={ax - 8} w={14} h={110} r={4.5} />
        <OG sh={[{ d: rrect(22, ax - 3, 90, 6, 3), f: K.metal }, { d: rrect(46, ax - 13, 40, 26, 5), f: M.ip }]} />
        {[52, 60, 68, 76].map((x) => <path key={x} d={`M${x} ${ax - 13}V${ax + 13}`} stroke={shade(M.ip, 0.35)} stroke-width={1.3} />)}
        {/* askı direği */}
        <OG sh={[{ d: rrect(122, 96, 6, 116, 2), f: K.wood }, { d: capsule([125, 100], 2, [144, 100], 2), f: K.wood }]} />
        <Bucket x={144} y={108} s={0.6} a={180} />
        <Ok x={74} y={44} r={14} />
        <rect x={158.5} y={0} width={3} height={240} fill={K.white} />
        {/* sağ: ip yerde, başka kova */}
        <path d={smooth([[184, 214], [214, 206], [250, 216], [228, 226], [196, 222], [214, 212], [246, 208], [280, 216]])} fill="none" stroke={K.out} stroke-width={5} />
        <path d={smooth([[184, 214], [214, 206], [250, 216], [228, 226], [196, 222], [214, 212], [246, 208], [280, 216]])} fill="none" stroke={M.ip} stroke-width={3} />
        <Bucket x={268} y={210} s={0.9} color="#c9573c" fill={M.camur} />
        {[[252, 182], [262, 176], [276, 184]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill={M.camur} />)}
        <Bad x={240} y={120} r={18} />
      </Scene2>
    );
  },

  /* ───── Yağmur suyu ───── */
  'sf-sd-oluk-elek': () => {
    // Çatı saçağı ve eğimli oluk; iniş borusu ağzında yaprak tutan tel elek.
    const mesh: P = [244, 112];
    return (
      <Scene2 bg="outdoor">
        <path d="M0 0H320V62L0 76Z" fill="#c2583e" stroke={K.out} stroke-width={1.5} />
        {[0, 1, 2].map((r) => (
          <path key={r} d={Array.from({ length: 12 }, (_, i) => `M${i * 28} ${18 + r * 20 + (8 - i) * 0}a14 9 0 0 0 28 0`).join('')} fill="none" stroke={shade('#c2583e', 0.3)} stroke-width={1.5} />
        ))}
        <path d="M0 76L320 62V70L0 84Z" fill={shade('#c2583e', 0.25)} stroke={K.out} stroke-width={1.5} />
        {/* oluk (içi görünen) */}
        <path d="M6 92L272 108L272 126Q272 132 266 132L12 116Q6 116 6 110Z" fill={K.metal} stroke={K.out} stroke-width={1.5} />
        <path d="M6 92L272 108L272 112L6 96Z" fill={shade(K.metal, 0.3)} />
        <path d="M14 101L236 114" stroke={M.su} stroke-width={4} stroke-linecap="round" />
        {/* iniş borusu */}
        <rect x={228} y={124} width={32} height={116} fill={K.metal} stroke={K.out} stroke-width={1.5} />
        <rect x={250} y={124} width={10} height={116} fill={shade(K.metal, 0.15)} />
        {/* tel elek (kubbe) */}
        <path d={`M${mesh[0] - 20} ${mesh[1] + 4}Q${mesh[0]} ${mesh[1] - 34} ${mesh[0] + 20} ${mesh[1] + 4}`} fill={tint(K.metal, 0.5)} fill-opacity={0.5} stroke={K.out} stroke-width={1.8} />
        {[-12, -4, 4, 12].map((dx) => <path key={dx} d={`M${mesh[0] + dx} ${mesh[1] + 3}L${mesh[0] + dx * 0.4} ${mesh[1] - 26}`} stroke={K.out} stroke-width={1} />)}
        <path d={`M${mesh[0] - 17} ${mesh[1] - 6}Q${mesh[0]} ${mesh[1] - 12} ${mesh[0] + 17} ${mesh[1] - 6}M${mesh[0] - 12} ${mesh[1] - 18}Q${mesh[0]} ${mesh[1] - 22} ${mesh[0] + 12} ${mesh[1] - 18}`} fill="none" stroke={K.out} stroke-width={1} />
        {/* yapraklar */}
        {[[232, 96, -30], [252, 92, 20], [244, 82, 70]].map(([x, y, a], i) => (
          <path key={i} d={ell([0, 0], 9, 4.5)} transform={`translate(${x} ${y}) rotate(${a})`} fill={i === 1 ? '#c8962e' : '#8a9a3a'} stroke={K.out} stroke-width={1.2} />
        ))}
        <Arrow from={[60, 140]} to={[190, 150]} w={6} />
      </Scene2>
    );
  },

  'sf-sd-ilk-yagmur-ayirici': () => {
    const px = 92; // iniş borusu x
    return (
      <Scene2 bg="closeup">
        {/* iniş borusu */}
        <rect x={px - 12} y={0} width={24} height={84} fill={K.metal} stroke={K.out} stroke-width={1.5} />
        {/* ayırıcı dik boru (kesit, dolu kirli su) */}
        <rect x={px - 18} y={84} width={36} height={126} fill="#fff" fill-opacity={0.6} stroke={K.out} stroke-width={1.8} />
        <rect x={px - 16} y={96} width={32} height={112} fill={M.bulanik} />
        {[110, 136, 162, 188].map((y) => <circle key={y} cx={px - 4 + (y % 3) * 4} cy={y} r={2} fill={M.camur} />)}
        {/* tıkaç */}
        <OG sh={[{ d: rrect(px - 14, 210, 28, 12, 3), f: K.red }]} />
        {/* depoya giden yan kol */}
        <rect x={px + 18} y={84} width={70} height={18} fill={K.metal} stroke={K.out} stroke-width={1.5} />
        <path d={`M${px + 22} 93H${px + 84}`} stroke={M.su} stroke-width={6} stroke-linecap="round" />
        {/* depo */}
        <path d="M176 70H300V222Q300 228 294 228H182Q176 228 176 222Z" fill="#2f4f45" stroke={K.out} stroke-width={1.5} />
        <rect x={182} y={120} width={112} height={102} fill={M.su} />
        <path d="M182 120q8 -3 14 0t14 0t14 0t14 0t14 0t14 0t14 0t14 0" fill="none" stroke={K.waterLight} stroke-width={2} />
        <Arrow from={[px, 40]} to={[px, 140]} w={6} color={M.bulanik} />
        <Arrow from={[px + 34, 74]} to={[px + 104, 74]} w={5} color={M.su} />
        <Label x={px + 40} y={160} text="1" size={15} bg={K.white} />
        <Label x={238} y={56} text="2" size={15} bg={K.white} />
      </Scene2>
    );
  },

  'sf-sd-yagmur-depo': () => {
    const c = '#2f4f45';
    return (
      <Scene2 bg="outdoor">
        <path d="M66 70Q66 56 80 56H220Q234 56 234 70V196H66Z" fill={c} stroke={K.out} stroke-width={1.5} />
        <path d="M196 56H220Q234 56 234 70V196H196Z" fill={shade(c, 0.2)} />
        {[100, 140, 170].map((y) => <path key={y} d={`M66 ${y}H234`} stroke={shade(c, 0.35)} stroke-width={1.5} />)}
        <OG sh={[{ d: rrect(118, 46, 64, 12, 4), f: shade(c, 0.1) }]} />
        {/* havalandırma + sinek teli */}
        <Pipe pts={[[90, 56], [90, 34]]} w={8} />
        <rect x={82} y={24} width={16} height={11} fill="#fff" stroke={K.out} stroke-width={1.3} />
        <path d="M86 24V35M90 24V35M94 24V35M82 29H98" stroke={K.out} stroke-width={0.8} />
        {/* taşma borusu + sinek teli */}
        <Pipe pts={[[234, 76], [272, 76], [272, 108]]} w={8} />
        <rect x={266} y={106} width={13} height={14} fill="#fff" stroke={K.out} stroke-width={1.3} />
        <path d="M266 111H279M266 116H279M270 106V120M275 106V120" stroke={K.out} stroke-width={0.8} />
        {/* musluk ve kova */}
        <rect x={60} y={196} width={180} height={10} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <Pipe pts={[[110, 150], [96, 150], [96, 158]]} w={7} />
        <rect x={100} y={142} width={6} height={6} fill={K.red} stroke={K.out} stroke-width={1} />
        <path d="M96 162V176" stroke={K.waterLight} stroke-width={4} stroke-linecap="round" />
        <Bucket x={96} y={197} s={0.8} fill={K.waterLight} />
        <Ok x={36} y={46} r={14} />
      </Scene2>
    );
  },

  /* ───── Sarnıç ───── */
  'sf-sd-sarnic-siva': () => {
    const gy = 66;
    const p: PersonProps = { ...CAST.kuyucu, x: 118, y: 222, s: 0.86, flip: true, pose: { ...POSE.standSide, spine: -92, armF: { to: [62, 130] }, armB: [100, 80], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        {/* çukur: taş duvarlar */}
        <path d={`M40 ${gy}V236H280V${gy}`} fill="#d9cdb8" />
        <Stones x={24} y={gy} w={20} h={174} r={6} />
        <Stones x={276} y={gy} w={20} h={174} r={6} />
        <Stones x={24} y={222} w={272} h={18} r={6} />
        {/* sıva (sağ duvar ve taban sıvanmış, köşe yuvarlak) */}
        <path d={`M276 ${gy}V206Q276 222 260 222H120V214H256Q266 214 266 204V${gy}Z`} fill={tint(M.beton, 0.3)} stroke={K.out} stroke-width={1.4} />
        <path d={`M44 150V204Q44 214 54 214H120V222H60Q44 222 44 206Z`} fill={tint(M.beton, 0.3)} stroke={K.out} stroke-width={1.4} />
        <path d={`M44 130H54V150H44Z`} fill={tint(M.beton, 0.3)} />
        {/* mala */}
        <OG sh={[{ d: 'M48 118L60 112L60 142L48 148Z', f: K.metal }, { d: capsule([60, 128], 2, [70, 132], 2.5), f: K.wood }]} />
        <Person {...p} />
        <Bucket x={200} y={214} s={0.8} color={K.metal} fill={tint(M.beton, 0.1)} />
      </Scene2>
    );
  },

  'sf-sd-sarnic-cokeltme': () => {
    const gy = 60;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        {/* boru */}
        <Pipe pts={[[0, 96], [56, 96]]} w={10} />
        <path d="M56 96Q66 100 66 118" stroke={K.waterLight} stroke-width={6} stroke-linecap="round" fill="none" />
        {/* çökeltme bölmesi */}
        <rect x={40} y={80} width={74} height={140} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <rect x={50} y={110} width={54} height={100} fill={M.su} />
        <path d="M50 186Q77 178 104 186V210H50Z" fill={M.camur} stroke={K.out} stroke-width={1.2} />
        {/* ara duvar üstünden taşma */}
        <rect x={104} y={110} width={14} height={110} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        {/* sarnıç */}
        <rect x={118} y={80} width={190} height={140} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <rect x={118} y={90} width={180} height={120} fill="#3a2f26" />
        <rect x={118} y={126} width={180} height={84} fill={M.su} />
        <path d="M100 110Q112 100 124 112Q130 120 130 128" fill="none" stroke={K.waterLight} stroke-width={6} stroke-linecap="round" />
        <Arrow from={[64, 140]} to={[96, 118]} w={5} />
        <Arrow from={[150, 112]} to={[220, 112]} w={5} />
      </Scene2>
    );
  },

  'sf-sd-sarnic-kesit': () => {
    const gy = 78;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Ground gy={gy} />
        <rect x={30} y={96} width={260} height={136} rx={10} fill={tint(M.beton, 0.2)} stroke={K.out} stroke-width={1.5} />
        <rect x={40} y={104} width={240} height={120} rx={6} fill="#3a2f26" />
        <rect x={40} y={134} width={240} height={90} rx={6} fill={M.su} />
        <path d="M40 134q10 -3 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none" stroke={K.waterLight} stroke-width={2} />
        {/* kapak (tavan) */}
        <rect x={30} y={78} width={260} height={18} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(140, 70, 48, 10, 2), f: shade(M.beton, 0.2) }]} />
        {/* giriş (sağ uç) */}
        <Pipe pts={[[320, 50], [262, 50], [262, 110]]} w={8} />
        <Arrow from={[296, 30]} to={[270, 30]} w={4} color={M.su} />
        {/* taşma borusu sinek telli */}
        <Pipe pts={[[282, 120], [298, 120], [324, 150]]} w={6} />
        <rect x={290} y={113} width={11} height={14} fill="#fff" stroke={K.out} stroke-width={1.2} />
        <path d="M290 118H301M290 122H301M294 113V127M298 113V127" stroke={K.out} stroke-width={0.8} />
        <Arrow from={[296, 156]} to={[314, 178]} w={4} color={M.su} />
        {/* el pompası ve musluk (sol uç) */}
        <Pipe pts={[[62, 210], [62, 40]]} w={8} />
        <OG sh={[{ d: rrect(52, 26, 20, 26, 3), f: K.red }, { d: capsule([62, 28], 3, [100, 14], 3), f: K.metal }, { d: capsule([52, 40], 3, [42, 40], 3), f: K.metal }]} />
        <path d="M40 44V58" stroke={K.waterLight} stroke-width={4} stroke-linecap="round" />
        <Bucket x={40} y={76} s={0.55} fill={K.waterLight} />
      </Scene2>
    );
  },

  /* ───── Su taşıma ───── */
  'sf-sd-dar-agizli-kap': () => (
    <Scene2 bg="closeup">
      <Jerry x={82} y={200} s={2.2} />
      <Ok x={82} y={34} r={15} />
      <rect x={158.5} y={0} width={3} height={240} fill={K.white} />
      <Bucket x={240} y={200} s={2.1} fill={M.su} />
      {[[-30, 0], [10, -20], [30, 10]].map(([a, dx], i) => (
        <path key={i} d={ell([0, 0], 11, 5)} transform={`translate(${240 + dx} ${134 + i * 3}) rotate(${a})`} fill={i ? '#8a9a3a' : '#c8962e'} stroke={K.out} stroke-width={1.2} />
      ))}
      {[[222, 128], [256, 140], [236, 142]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill={M.camur} />)}
      <Bad x={240} y={34} r={15} />
    </Scene2>
  ),

  'sf-sd-omuz-sirigi': () => {
    // Önden: sırık iki omzun üstünde, ensenin arkasında; eller sırığı tutuyor; iki uçta eşit bidon.
    const w: PersonProps = { ...CAST.kadin, x: 160, y: 228, s: 1.1, pose: { ...POSE.stand, face: 'neutral' } };
    const r0 = rig(w);
    const sy = Math.min(r0.shoulderB[1], r0.shoulderF[1]) - 3;
    const L: P = [40, sy], R: P = [280, sy];
    w.pose = { ...w.pose, armB: { to: [r0.shoulderB[0] - 30, sy + 1] }, armF: { to: [r0.shoulderF[0] + 30, sy + 1] } };
    return (
      <Scene2 bg="outdoor">
        <Rope pts={[[L[0] + 10, L[1]], [L[0] + 10, 156]]} w={2} />
        <Rope pts={[[R[0] - 10, R[1]], [R[0] - 10, 156]]} w={2} />
        <Jerry x={L[0] + 10} y={208} s={1.05} />
        <Jerry x={R[0] - 10} y={208} s={1.05} />
        <Person {...w} only={['legB', 'legF', 'torso']} />
        <OG sh={[{ d: capsule(L, 4.5, R, 4.5), f: K.wood }]} />
        <Person {...w} only={['head', 'armB', 'armF']} shadow={false} />
        <Arrow from={[L[0] + 10, sy + 14]} to={[L[0] + 10, 142]} w={4} />
        <Arrow from={[R[0] - 10, sy + 14]} to={[R[0] - 10, 142]} w={4} />
      </Scene2>
    );
  },

  'sf-sd-musluklu-kap': () => {
    const tap: P = [196, 118];
    const glass: P = [tap[0] + 2, 152];
    const w: PersonProps = { ...CAST.kadin, x: 136, y: 226, s: 1.05, pose: { ...POSE.standSide, armF: { to: [glass[0] - 7, glass[1] - 2] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Table x={180} y={226} w={120} h={70} />
        {/* musluklu kap */}
        <OG sh={[
          { d: 'M206 156V92Q206 84 214 84H270Q278 84 278 92V156Z', f: '#5b8fc8' },
          { d: rrect(202, 74, 80, 12, 4), f: shade('#5b8fc8', 0.2) },
          { d: capsule([206, 128], 4, [tap[0], 128], 4), f: K.metal },
          { d: rrect(tap[0] - 4, 124, 8, 10, 2), f: K.metal },
          { d: rrect(tap[0] + 2, 118, 4, 8, 1), f: K.red },
        ]} />
        <path d={`M${tap[0]} 136V${glass[1] - 2}`} stroke={K.waterLight} stroke-width={3} stroke-linecap="round" />
        <Person {...w} mid={() => (
          <OG sh={[{ d: `M${glass[0] - 9} ${glass[1] - 14}H${glass[0] + 9}L${glass[0] + 7} ${glass[1] + 12}H${glass[0] - 7}Z`, f: '#e8f4fb', op: 0.9 }, { d: `M${glass[0] - 8} ${glass[1] + 2}H${glass[0] + 8}L${glass[0] + 7} ${glass[1] + 12}H${glass[0] - 7}Z`, f: K.waterLight, no: true }]} />
        )} />
      </Scene2>
    );
  },

  /* ───── Arıtma özeti ───── */
  'sf-sd-kaynatma-ocak': () => (
    <Scene2 bg="outdoor">
      <Campfire x={150} y={222} s={2} />
      <OG sh={[{ d: capsule([96, 150], 3, [96, 222], 3), f: K.metal }, { d: capsule([204, 150], 3, [204, 222], 3), f: K.metal }, { d: capsule([92, 150], 3, [208, 150], 3), f: K.metal }]} />
      <Pot x={150} y={196} s={2} />
      <Timer x={252} y={50} r={18} text="1 dk" />
    </Scene2>
  ),

  'sf-sd-kimyasal-su-yasak': () => (
    <Scene2 bg="outdoor">
      <path d="M40 206Q60 186 160 186Q270 188 288 206Q270 228 160 228Q50 226 40 206Z" fill="#4f6f86" stroke={K.out} stroke-width={1.5} />
      {['#e84d8a', '#f5c33b', '#40c4a0', '#7a6be0'].map((c, i) => (
        <path key={i} d={`M${80 + i * 10} ${204 + i * 3}Q160 ${190 + i * 5} ${250 - i * 12} ${206 + i * 2}`} fill="none" stroke={c} stroke-width={3} opacity={0.85} stroke-linecap="round" />
      ))}
      {/* devrilmiş varil */}
      <OG sh={[
        { d: rrect(196, 150, 86, 46, 6), f: '#8a3b32' },
        { d: 'M214 150V196M264 150V196', st: shade('#8a3b32', 0.35), sw: 2 },
        { d: ell([198, 173], 7, 23), f: shade('#8a3b32', 0.25) },
      ]} />
      <path d="M194 182Q180 192 170 196" stroke="#2b2d3a" stroke-width={5} stroke-linecap="round" fill="none" />
      <No x={150} y={110} r={42} />
    </Scene2>
  ),

  /* ───── Su kalitesi ───── */
  'sf-sd-sanitasyon-denetim': () => {
    const p: PersonProps = { ...CAST.genc, x: 54, y: 228, s: 1, pose: { ...POSE.standSide, armF: { to: [86, 136] }, armB: { to: [80, 146] }, face: 'worried' } };
    const ring = (x: number, y: number, rx: number, ry: number) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={K.danger} stroke-width={3.5} stroke-dasharray="7 5" />;
    return (
      <Scene2 bg="outdoor">
        {/* ağıl */}
        <Fence x1={226} x2={312} y={196} h={34} n={4} />
        <OG sh={[{ d: ell([270, 168], 20, 12), f: '#f1ece2' }, { d: ell([292, 162], 7, 6), f: '#4a4a4a' }, { d: 'M258 178V190M282 178V190', st: K.out, sw: 3 }]} />
        {/* kuyu, kapak açık, dibinde birikinti */}
        <path d="M110 214Q150 204 200 214Q190 226 150 226Q112 224 110 214Z" fill={M.su} stroke={K.out} stroke-width={1.3} />
        <WellRing x={150} y={208} w={84} h={48} open />
        <OG sh={[{ d: 'M190 168L214 120L222 124L198 172Z', f: '#9a6a42' }]} />
        <Person {...p} mid={(r) => <OG sh={[{ d: rrect(r.handF[0] - 2, r.handF[1] - 22, 20, 28, 2), f: K.white }, { d: `M${r.handF[0] + 2} ${r.handF[1] - 14}h12M${r.handF[0] + 2} ${r.handF[1] - 8}h12M${r.handF[0] + 2} ${r.handF[1] - 2}h8`, st: K.ink, sw: 1.2 }]} />} />
        {ring(150, 158, 46, 18)}
        {ring(196, 218, 22, 10)}
        {ring(272, 172, 42, 32)}
      </Scene2>
    );
  },

  'sf-sd-sise-isik': () => {
    const h = { x: 172, y: 236, a: 6, s: 1.5, pose: 'hold' as const, side: 'R' as const, grip: 36 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="outdoor">
        <circle cx={270} cy={44} r={24} fill="#ffd64a" stroke={K.out} stroke-width={1.5} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={`M${270 + 32 * Math.cos(a / 57.3)} ${44 + 32 * Math.sin(a / 57.3)}L${270 + 42 * Math.cos(a / 57.3)} ${44 + 42 * Math.sin(a / 57.3)}`} stroke="#f0a92a" stroke-width={4} stroke-linecap="round" />)}
        <Hand {...h} arm={50} sleeve={K.role.bystander} skin={2}>
          <PetBottle x={g[0]} y={g[1] + 44} s={1.5} a={6} water={M.bulanik} fill={0.82} />
        </Hand>
        {[[g[0] - 6, g[1] - 10], [g[0] + 4, g[1] + 6], [g[0] - 2, g[1] - 26]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} fill={M.camur} />)}
        <Bad x={g[0] + 46} y={g[1] - 52} r={15} />
        <PetBottle x={60} y={226} s={1.3} water={M.su} fill={0.82} />
        <Ok x={60} y={100} r={13} />
      </Scene2>
    );
  },

  'sf-sd-yosun-yasak': () => (
    <Scene2 bg="outdoor">
      <path d="M22 196Q40 172 160 172Q314 172 318 192V240H10Q6 214 22 196Z" fill="#3f8f8a" stroke={K.out} stroke-width={1.5} />
      {[[70, 190, 30, 8], [150, 186, 26, 7], [220, 196, 34, 9], [282, 190, 26, 6], [60, 222, 34, 8], [130, 222, 30, 8], [262, 226, 36, 8]].map(([x, y, rx, ry], i) => (
        <path key={i} d={ell([x, y], rx, ry)} fill={i % 2 ? '#7cc77a' : '#58b7a6'} stroke={shade('#58b7a6', 0.3)} stroke-width={1} />
      ))}
      {/* ölü balık (sırtüstü) */}
      <g transform="translate(176 210) scale(1.5)">
        <OG sh={[{ d: ell([0, 0], 18, 7), f: '#d8dde0' }, { d: 'M16 0L28 -8V8Z', f: '#c2c8cc' }]} />
        <path d="M-10 -1l4 3m0 -3l-4 3" stroke={K.out} stroke-width={1.4} />
      </g>
      <No x={180} y={204} r={46} />
    </Scene2>
  ),

  /* ───── Dinlendirme: üç küp ───── */
  'sf-sd-uc-kup': () => {
    const xs = [64, 160, 256];
    const waters = [M.bulanik, '#7fa7b9', M.su];
    return (
      <Scene2 bg="indoor">
        {xs.map((x, i) => (
          <g key={i}>
            <Tub x={x} y={214} s={1.15} water={waters[i]} level={0.8} mud={i === 1} />
            <Label x={x} y={182} text={String(i + 1)} size={18} bg={K.white} />
          </g>
        ))}
        <Arrow from={[166, 98]} to={[244, 110]} bend={-0.3} w={6} />
        <Arrow from={[70, 98]} to={[148, 110]} bend={-0.3} w={6} />
      </Scene2>
    );
  },

  'sf-sd-bez-suzgec': () => {
    const bk: P = [196, 122];
    const w: PersonProps = { ...CAST.kadin, x: 140, y: 226, s: 1.05, pose: { ...POSE.standSide, spine: -86, armF: { to: [bk[0] + 12, bk[1] + 22] }, armB: { to: [bk[0] - 2, bk[1] + 6] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Tub x={236} y={226} s={1.2} water={K.waterLight} level={0.5} />
        {/* gerilmiş bez */}
        <path d="M200 172Q236 186 272 172L276 182Q236 196 196 182Z" fill={K.cloth} stroke={K.out} stroke-width={1.5} />
        <path d="M210 176Q236 194 262 176" fill="none" stroke={M.bulanik} stroke-width={5} opacity={0.7} />
        <path d={`M${bk[0] + 26} ${bk[1] + 5}Q238 140 236 178`} fill="none" stroke={shade(M.bulanik, 0.25)} stroke-width={8} stroke-linecap="round" />
        <path d={`M${bk[0] + 26} ${bk[1] + 5}Q238 140 236 178`} fill="none" stroke={M.bulanik} stroke-width={5} stroke-linecap="round" />
        <Person {...w} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Bucket x={bk[0]} y={bk[1] + 14} s={0.85} a={70} fill={M.bulanik} />
        <Person {...w} only={['armF']} />
      </Scene2>
    );
  },

  'sf-sd-ust-su-aktarma': () => {
    // Eğik kap: su yüzeyi yatay, çamur alt köşede kalır.
    const c: P = [160, 140];
    const a = 30;
    const rad = a / 57.2958;
    const tub = (lx: number, ly: number): P => [c[0] + lx * Math.cos(rad) - ly * Math.sin(rad), c[1] + lx * Math.sin(rad) + ly * Math.cos(rad)];
    const w: PersonProps = { ...CAST.kadin, x: 94, y: 226, s: 1.05, pose: { ...POSE.standSide, spine: -86, armF: { to: tub(-12, 27) }, armB: { to: tub(-26, -22) }, face: 'neutral' } };
    const shape = [tub(-28, -25), tub(28, -25), tub(22, 25), tub(-22, 25)];
    const d = `M${shape.map((p) => p.join(' ')).join('L')}Z`;
    const lip = tub(28, -25);
    const hA = tub(-26, -25), hB = tub(26, -25), hC = tub(0, -46);
    return (
      <Scene2 bg="indoor">
        <Tub x={242} y={226} s={1.15} water={M.su} level={0.45} />
        <path d={`M${lip[0]} ${lip[1]}Q${lip[0] + 22} ${lip[1] + 2} 236 176`} fill="none" stroke={shade(M.su, 0.25)} stroke-width={8} stroke-linecap="round" />
        <path d={`M${lip[0]} ${lip[1]}Q${lip[0] + 22} ${lip[1] + 2} 236 176`} fill="none" stroke={K.waterLight} stroke-width={5} stroke-linecap="round" />
        <Person {...w} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <defs><clipPath id="usa"><path d={d} /></clipPath></defs>
        <path d={d} fill="#f2f7fa" />
        <g clip-path="url(#usa)">
          <rect x={0} y={lip[1] - 1} width={320} height={200} fill={M.su} />
          <path d={ell(tub(8, 24), 22, 9)} fill={M.camur} />
        </g>
        <path d={d} fill="none" stroke={K.out} stroke-width={1.8} />
        <path d={`M${hA[0]} ${hA[1]}Q${hC[0]} ${hC[1]} ${hB[0]} ${hB[1]}`} fill="none" stroke={K.out} stroke-width={2.4} />
        <Label x={tub(-4, 2)[0]} y={tub(-4, 2)[1]} text="2" size={14} bg={K.white} />
        <Person {...w} only={['armF']} />
        <Label x={242} y={208} text="3" size={14} bg={K.white} />
      </Scene2>
    );
  },

  /* ───── Ev tipi biyokum filtre ───── */
  'sf-sd-biokum-kesit': () => {
    const x0 = 96, x1 = 196;
    const yTop = 40, ySand = 96, yWat = 80, yFine = 186, yCoarse = 204, yBot = 222;
    return (
      <Scene2 bg="closeup">
        {/* kap */}
        <rect x={x0 - 8} y={yTop} width={x1 - x0 + 16} height={yBot - yTop + 8} rx={4} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <rect x={x0} y={yTop + 4} width={x1 - x0} height={yBot - yTop - 4} fill="#f4f1ea" />
        <rect x={x0} y={yWat} width={x1 - x0} height={ySand - yWat} fill={M.su} />
        <Sand d={`M${x0} ${ySand}H${x1}V${yFine}H${x0}Z`} box={[x0, ySand, x1 - x0, yFine - ySand]} id="bk-s" />
        <Gravel d={`M${x0} ${yFine}H${x1}V${yCoarse}H${x0}Z`} box={[x0, yFine, x1 - x0, yCoarse - yFine]} r={2.2} id="bk-g1" />
        <Gravel d={`M${x0} ${yCoarse}H${x1}V${yBot}H${x0}Z`} box={[x0, yCoarse, x1 - x0, yBot - yCoarse]} c={M.cakilIri} r={4} id="bk-g2" />
        {/* dağıtıcı tabla ve kapak */}
        <rect x={x0} y={62} width={x1 - x0} height={6} fill={K.metal} stroke={K.out} stroke-width={1.2} />
        {[110, 128, 146, 164, 182].map((x) => <rect key={x} x={x} y={62} width={4} height={6} fill="#f4f1ea" />)}
        <OG sh={[{ d: rrect(x0 - 12, yTop - 8, x1 - x0 + 24, 10, 3), f: shade(M.beton, 0.2) }]} />
        {/* çıkış borusu: dipten dışarı, yukarı kıvrılır */}
        <Pipe pts={[[x0 + 20, yBot - 6], [x1 + 24, yBot - 6], [x1 + 24, yWat], [x1 + 44, yWat], [x1 + 44, yWat + 10]]} w={7} />
        <path d={`M${x1 + 44} ${yWat + 16}V${yWat + 40}`} stroke={K.waterLight} stroke-width={4} stroke-linecap="round" />
        <Bucket x={x1 + 44} y={yWat + 82} s={0.8} color="#5b8fc8" fill={K.waterLight} />
        <path d={`M${x1 + 24} ${yWat}H${x1 + 4}`} stroke={K.ink} stroke-width={1.2} stroke-dasharray="3 3" />
        {/* katman adları */}
        <Txt x={x0 - 14} y={144} t="kum" anchor="end" size={13} />
        <Txt x={x0 - 14} y={199} t="ince çakıl" anchor="end" size={11} />
        <Txt x={x0 - 14} y={218} t="iri çakıl" anchor="end" size={11} />
        <Txt x={x0 - 14} y={92} t="su" anchor="end" size={13} c={shade(M.su, 0.3)} />
      </Scene2>
    );
  },

  'sf-sd-biokum-boru': () => {
    const ySand = 150, yWat = 104;
    return (
      <Scene2 bg="closeup">
        <rect x={20} y={20} width={176} height={220} fill="#f4f1ea" />
        <rect x={20} y={yWat} width={176} height={ySand - yWat} fill={M.su} />
        <path d={`M20 ${yWat}q8 -3 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0`} fill="none" stroke={K.waterLight} stroke-width={2} />
        <Sand d={`M20 ${ySand}H196V240H20Z`} box={[20, ySand, 176, 90]} id="bb-s" />
        <rect x={196} y={20} width={14} height={220} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <Pipe pts={[[210, 230], [244, 230], [244, yWat], [282, yWat], [282, yWat + 18]]} w={12} />
        <path d={`M282 ${yWat + 26}V${yWat + 60}`} stroke={K.waterLight} stroke-width={5} stroke-linecap="round" />
        <path d={`M20 ${ySand}H236`} stroke={K.ink} stroke-width={1.5} stroke-dasharray="5 4" />
        <path d={`M196 ${yWat}H236`} stroke={K.ink} stroke-width={1.5} stroke-dasharray="5 4" />
        <Dim a={[226, ySand - 2]} b={[226, yWat + 2]} />
        <Label x={110} y={127} text="5 cm" size={16} />
      </Scene2>
    );
  },

  'sf-sd-kum-yikama': () => {
    const bk: P = [206, 198];
    const p: PersonProps = { ...CAST.kazici, x: 150, y: 226, s: 1.05, pose: { ...POSE.crouch, armF: { to: [bk[0] + 18, bk[1] - 2] }, armB: { to: [bk[0] - 2, bk[1] + 18] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* elenmiş kum yığını */}
        <path d="M18 224Q60 160 104 224Z" fill={M.kum} stroke={K.out} stroke-width={1.5} />
        {/* dökülen bulanık su */}
        <path d={`M${bk[0] + 26} ${bk[1] + 4}Q262 204 268 228`} fill="none" stroke={shade(M.bulanik, 0.25)} stroke-width={9} stroke-linecap="round" />
        <path d={`M${bk[0] + 26} ${bk[1] + 4}Q262 204 268 228`} fill="none" stroke={M.bulanik} stroke-width={6} stroke-linecap="round" />
        <path d="M244 230Q270 222 300 230Q272 238 244 230Z" fill={M.bulanik} stroke={K.out} stroke-width={1.2} />
        <Bucket x={bk[0]} y={bk[1] + 26} s={1.05} a={48} fill={M.bulanik} handle={false} />
        <Person {...p} />
      </Scene2>
    );
  },

  'sf-sd-biokum-doldurma': () => {
    const bk: P = [172, 104];
    const p: PersonProps = { ...CAST.kazici, x: 108, y: 226, s: 1.05, pose: { ...POSE.standSide, spine: -86, armF: { to: [bk[0] + 12, bk[1] + 22] }, armB: { to: [bk[0] - 2, bk[1] + 6] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <BsFilter x={226} y={226} />
        <path d={`M${bk[0] + 26} ${bk[1] + 5}Q218 112 222 136`} fill="none" stroke={shade(K.waterLight, 0.3)} stroke-width={8} stroke-linecap="round" />
        <path d={`M${bk[0] + 26} ${bk[1] + 5}Q218 112 222 136`} fill="none" stroke={K.waterLight} stroke-width={5} stroke-linecap="round" />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Bucket x={bk[0]} y={bk[1] + 14} s={0.85} a={70} fill={K.waterLight} />
        <Person {...p} only={['armF']} />
        <Label x={250} y={56} text="12–18 L" size={14} />
      </Scene2>
    );
  },

  'sf-sd-biokum-cikis': () => (
    <Scene2 bg="indoor">
      <rect x={20} y={40} width={160} height={190} fill={M.beton} stroke={K.out} stroke-width={1.5} />
      <rect x={146} y={40} width={34} height={190} fill={shade(M.beton, 0.12)} />
      <Pipe pts={[[180, 92], [222, 92], [222, 108]]} w={12} />
      {[114, 128].map((y) => <path key={y} d={`M222 ${y}c0 4 -4 6 -4 9a4 4 0 0 0 8 0c0 -3 -4 -5 -4 -9z`} fill={K.waterLight} stroke={K.out} stroke-width={1.2} />)}
      <Jerry x={203} y={228} s={1.6} color={M.bidon} cap={false} />
      <Ok x={284} y={58} r={14} />
    </Scene2>
  ),

  'sf-sd-biokum-temizlik': () => {
    const x0 = 40, x1 = 240, yW = 70, yS = 150;
    return (
      <Scene2 bg="closeup">
        <rect x={x0 - 10} y={30} width={x1 - x0 + 20} height={220} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <rect x={x0} y={30} width={x1 - x0} height={220} fill="#f4f1ea" />
        <rect x={x0} y={yW} width={x1 - x0} height={yS - yW} fill={M.bulanik} />
        {[[80, 110], [130, 96], [170, 128], [210, 104], [104, 138]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={M.camur} />)}
        <Sand d={`M${x0} ${yS}H${x1}V250H${x0}Z`} box={[x0, yS, x1 - x0, 90]} id="bt-s" />
        <Hand x={156} y={52} a={180} s={1.05} pose="open" side="R" skin={0} arm={90} sleeve={K.role.helper} />
        <path d="M96 156A60 14 0 1 0 220 150" fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" />
        <path d="M212 140L222 151L208 156" fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" stroke-linejoin="round" />
        <Bucket x={286} y={226} s={0.9} fill={M.bulanik} />
      </Scene2>
    );
  },

  /* ───── Köy ölçeğinde havuz filtre ───── */
  'sf-sd-havuz-filtre-plan': () => {
    const Basin = ({ x }: { x: number }) => (
      <g>
        <rect x={x} y={60} width={96} height={120} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <rect x={x + 8} y={68} width={80} height={104} fill={M.su} stroke={K.out} stroke-width={1.2} />
        {[90, 116, 142].map((y) => <path key={y} d={`M${x + 22} ${y}h20m10 8h18`} stroke={K.waterLight} stroke-width={2} stroke-linecap="round" />)}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill="#cfe0b8" />
        <Basin x={40} />
        <Basin x={152} />
        {/* giriş kanalı */}
        <Pipe pts={[[0, 34], [200, 34]]} w={9} c={M.beton} />
        <Pipe pts={[[88, 34], [88, 62]]} w={7} c={M.beton} />
        <Pipe pts={[[200, 34], [200, 62]]} w={7} c={M.beton} />
        <path d="M4 34H196" stroke={M.su} stroke-width={4} />
        {/* çıkış ve klor deposu */}
        <Pipe pts={[[88, 180], [88, 206], [252, 206]]} w={7} />
        <Pipe pts={[[200, 180], [200, 206]]} w={7} />
        <circle cx={88} cy={194} r={6} fill={K.red} stroke={K.out} stroke-width={1.3} />
        <circle cx={200} cy={194} r={6} fill={K.red} stroke={K.out} stroke-width={1.3} />
        <path d={circ([276, 196], 26)} fill="#2f4f45" stroke={K.out} stroke-width={1.5} />
        <path d={circ([276, 196], 9)} fill={shade('#2f4f45', 0.3)} stroke={K.out} stroke-width={1.2} />
        <Arrow from={[24, 20]} to={[70, 20]} w={4} color={M.su} />
        <Label x={96} y={120} text="1" size={18} bg={K.white} />
        <Label x={208} y={120} text="2" size={18} bg={K.white} />
      </Scene2>
    );
  },

  'sf-sd-havuz-filtre-kesit': () => {
    const x0 = 30, x1 = 250, yBot = 222, yG = 196, yS = 128, yW = 62;
    return (
      <Scene2 bg="closeup">
        <path d={`M${x0 - 14} 34V${yBot + 12}H${x1 + 14}V34H${x1}V${yBot}H${x0}V34Z`} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <rect x={x0} y={yW} width={x1 - x0} height={yS - yW} fill={M.su} />
        <path d={`M${x0} ${yW}q10 -3 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0`} fill="none" stroke={K.waterLight} stroke-width={2} />
        <Sand d={`M${x0} ${yS}H${x1}V${yG}H${x0}Z`} box={[x0, yS, x1 - x0, yG - yS]} id="hk-s" />
        <Gravel d={`M${x0} ${yG}H${x1}V${yG + 8}H${x0}Z`} box={[x0, yG, x1 - x0, 8]} r={1.6} id="hk-g1" />
        <Gravel d={`M${x0} ${yG + 8}H${x1}V${yG + 16}H${x0}Z`} box={[x0, yG + 8, x1 - x0, 8]} r={2.4} id="hk-g2" />
        <Gravel d={`M${x0} ${yG + 16}H${x1}V${yBot}H${x0}Z`} box={[x0, yG + 16, x1 - x0, yBot - yG - 16]} c={M.cakilIri} r={3.4} id="hk-g3" />
        {/* delikli drenaj borusu */}
        <rect x={x0 + 4} y={yBot - 12} width={x1 - x0 + 30} height={10} fill="#6f7d8c" stroke={K.out} stroke-width={1.3} />
        {[50, 80, 110, 140, 170, 200, 230].map((x) => <circle key={x} cx={x} cy={yBot - 7} r={2} fill={K.out} />)}
        <Pipe pts={[[x1 + 14, yBot - 7], [300, yBot - 7], [300, 200]]} w={8} />
        <circle cx={300} cy={214} r={6} fill={K.red} stroke={K.out} stroke-width={1.3} />
        {/* giriş */}
        <Pipe pts={[[x0 + 10, 20], [x0 + 60, 20], [x0 + 60, 44]]} w={8} />
        <rect x={x0 + 50} y={yS - 6} width={22} height={6} fill={K.rock} stroke={K.out} stroke-width={1.2} />
        <Dim a={[x1 - 30, yS - 2]} b={[x1 - 30, yW + 2]} />
        <Label x={x1 - 64} y={95} text="1 m" size={14} bg={K.white} />
        <Dim a={[x1 - 30, yG - 2]} b={[x1 - 30, yS + 2]} />
        <Label x={x1 - 64} y={162} text="1 m" size={14} bg={K.white} />
      </Scene2>
    );
  },

  'sf-sd-havuz-kazima': () => {
    const yS = 196;
    const p: PersonProps = { ...CAST.koylu, x: 118, y: yS + 2, s: 1, pose: { ...POSE.standSide, spine: -64, chest: -56, head: -40, armF: { to: [186, 168] }, armB: { to: [166, 140] }, face: 'neutral' } };
    return (
      <Scene2 bg="closeup">
        <path d={`M8 40V240H312V40H296V${yS}H24V40Z`} fill={M.beton} stroke={K.out} stroke-width={1.5} />
        <Sand d={`M24 ${yS}H296V240H24Z`} box={[24, yS, 272, 44]} id="hz-s" />
        <rect x={24} y={yS - 5} width={170} height={6} fill="#5d5a33" stroke={K.out} stroke-width={1} />
        {/* kürek */}
        <OG sh={[{ d: capsule([160, 136], 2.5, [204, 186], 2.5), f: K.wood }, { d: 'M198 182L222 186L218 200L196 196Z', f: K.metal }]} />
        <Person {...p} />
        <Bucket x={262} y={yS + 2} s={1} fill="#5d5a33" />
        <Label x={108} y={226} text="1–2 cm" size={13} bg={K.white} />
      </Scene2>
    );
  },

  /* ───── Seramik filtre ───── */
  'sf-sd-seramik-yogurma': () => {
    const p: PersonProps = { ...CAST.genc, x: 96, y: 226, s: 1.05, pose: { ...POSE.kneel, spine: -60, chest: -48, head: -30, armF: { to: [176, 182] }, armB: { to: [160, 186] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* talaş ve elenmiş kil yığınları */}
        <path d="M234 228Q256 192 278 228Z" fill="#e8cf96" stroke={K.out} stroke-width={1.5} />
        {[[248, 214], [258, 208], [264, 220], [252, 222]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l6 -2`} stroke="#b08a4a" stroke-width={2} />)}
        <path d="M276 228Q296 196 316 228Z" fill={M.kil} stroke={K.out} stroke-width={1.5} />
        {/* tahta tekne */}
        <OG sh={[{ d: 'M130 188H230L220 226H140Z', f: K.wood }, { d: 'M130 188H230L228 194H132Z', f: shade(K.wood, 0.2) }]} />
        <path d="M136 192Q180 172 224 192Z" fill={M.kil} stroke={K.out} stroke-width={1.3} />
        {[[160, 186], [178, 182], [196, 186], [210, 189]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l5 -1`} stroke="#e8cf96" stroke-width={2} />)}
        <Person {...p} />
      </Scene2>
    );
  },

  'sf-sd-seramik-firin': () => {
    const Pot = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
      <T x={x} y={y} s={s}><OG ow={1.5 / s} sh={[{ d: 'M-18 0L-14 -26H14L18 0Z', f: '#c97b4a' }, { d: ell([0, -26], 14, 3), f: shade('#c97b4a', 0.3) }]} /></T>
    );
    return (
      <Scene2 bg="outdoor">
        <path d="M40 214Q40 70 160 70Q280 70 280 214Z" fill="#b26b45" stroke={K.out} stroke-width={1.5} />
        <path d="M58 214Q58 90 160 90Q262 90 262 214Z" fill="#3a2a22" stroke={K.out} stroke-width={1.2} />
        {/* raf ve çömlekler */}
        <rect x={64} y={166} width={192} height={8} fill={shade('#b26b45', 0.2)} stroke={K.out} stroke-width={1.2} />
        {[100, 140, 180, 220].map((x) => <Pot key={x} x={x} y={166} />)}
        {[120, 160, 200].map((x) => <Pot key={x} x={x} y={136} s={0.9} />)}
        {/* ateş */}
        <Flame3 x={130} y={214} s={0.75} />
        <Flame3 x={168} y={214} s={0.95} />
        <Flame3 x={200} y={214} s={0.7} />
        <OG sh={[{ d: capsule([110, 210], 4, [220, 206], 4), f: K.trunk }]} />
      </Scene2>
    );
  },

  'sf-sd-seramik-kova': () => {
    const bx = 160;
    return (
      <Scene2 bg="closeup">
        {/* kova (kesit) */}
        <path d={`M${bx - 70} 96H${bx + 70}L${bx + 62} 226H${bx - 62}Z`} fill="#f2f7fa" stroke={K.out} stroke-width={1.8} />
        <path d={`M${bx - 66} 176H${bx + 66}L${bx + 62} 226H${bx - 62}Z`} fill={K.waterLight} stroke={K.out} stroke-width={1.2} />
        {/* çömlek */}
        <path d={`M${bx - 66} 96L${bx - 46} 160Q${bx} 172 ${bx + 46} 160L${bx + 66} 96Z`} fill="#c97b4a" stroke={K.out} stroke-width={1.5} />
        <path d={`M${bx - 58} 104L${bx - 42} 154Q${bx} 164 ${bx + 42} 154L${bx + 58} 104Z`} fill={M.bulanik} />
        <path d={`M${bx - 58} 104H${bx + 58}`} stroke={K.out} stroke-width={1.2} />
        {/* kapak */}
        <OG sh={[{ d: rrect(bx - 80, 80, 160, 14, 4), f: '#5b8fc8' }, { d: rrect(bx - 12, 72, 24, 10, 3), f: shade('#5b8fc8', 0.2) }]} />
        {[[bx - 20, 170], [bx + 10, 172], [bx + 30, 168]].map(([x, y], i) => <path key={i} d={`M${x} ${y}c0 3 -3 5 -3 7a3 3 0 0 0 6 0c0 -2 -3 -4 -3 -7z`} fill={M.su} stroke={K.out} stroke-width={1} />)}
        {/* musluk */}
        <OG sh={[{ d: capsule([bx + 62, 212], 4, [bx + 84, 212], 4), f: K.metal }, { d: rrect(bx + 80, 208, 8, 12, 2), f: K.metal }, { d: rrect(bx + 72, 202, 6, 8, 1.5), f: K.red }]} />
        <path d={`M${bx + 84} 224V236`} stroke={M.su} stroke-width={3} stroke-linecap="round" />
      </Scene2>
    );
  },

  /* ───── SODIS ───── */
  'sf-sd-sodis-sise': () => (
    <Scene2 bg="closeup">
      <PetBottle x={66} y={214} s={1.85} water={M.su} />
      <PetBottle x={164} y={214} s={1.85} water={M.su} scratched />
      <PetBottle x={258} y={214} s={1.85} water={M.su} tintC="#5aa86a" />
      <Ok x={66} y={30} r={14} />
      <Bad x={164} y={30} r={14} />
      <Bad x={258} y={30} r={14} />
    </Scene2>
  ),

  'sf-sd-sodis-yazi-testi': () => {
    // Yukarıdan bakış: gazetenin üstünde dolu şişelerin dibi; berrakta harf okunur, bulanıkta okunmaz.
    const Bot = ({ x, c, ok }: { x: number; c: string; ok: boolean }) => (
      <g>
        <circle cx={x} cy={128} r={50} fill={c} opacity={ok ? 0.22 : 0.97} />
        <circle cx={x} cy={128} r={46} fill="none" stroke="#fff" stroke-width={3} opacity={0.7} />
        <circle cx={x} cy={128} r={50} fill="none" stroke={K.out} stroke-width={2.5} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <rect x={10} y={20} width={300} height={210} fill="#f3efe4" stroke={K.out} stroke-width={1.5} />
        {[0, 1, 2, 3, 4, 5].map((r) => <Txt key={r} x={160} y={58 + r * 30} t="ABCDEFGHIJKLMN" size={22} c="#3c3c3c" w={800} />)}
        <Bot x={90} c={M.su} ok />
        <Bot x={230} c={M.bulanik} ok={false} />
        <Ok x={132} y={84} r={14} />
        <Bad x={272} y={84} r={14} />
      </Scene2>
    );
  },

  'sf-sd-sodis-cati': () => (
    <Scene2 bg="outdoor">
      <circle cx={48} cy={44} r={22} fill="#ffd64a" stroke={K.out} stroke-width={1.5} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={`M${48 + 30 * Math.cos(a / 57.3)} ${44 + 30 * Math.sin(a / 57.3)}L${48 + 39 * Math.cos(a / 57.3)} ${44 + 39 * Math.sin(a / 57.3)}`} stroke="#f0a92a" stroke-width={4} stroke-linecap="round" />)}
      {/* ev duvarı ve sac çatı */}
      <rect x={30} y={170} width={260} height={70} fill="#efe1c6" stroke={K.out} stroke-width={1.5} />
      <path d="M14 176L60 104H260L306 176Z" fill="#a9b4bf" stroke={K.out} stroke-width={1.5} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <path key={i} d={`M${60 + i * 18.2} 104L${14 + i * 26.5} 176`} stroke={shade('#a9b4bf', 0.25)} stroke-width={2} />)}
      {[0, 1, 2, 3].map((i) => <PetBottle key={i} x={96 + i * 46} y={150 - i * 0} s={0.95} a={-90} water={M.su} fill={0.95} />)}
      {[0, 1, 2].map((i) => <PetBottle key={'b' + i} x={120 + i * 46} y={126} s={0.8} a={-90} water={M.su} fill={0.95} />)}
      <Label x={248} y={44} text="6 saat" size={16} />
    </Scene2>
  ),

  /* ───── Kategori kapakları ───── */
  'sf-sd-kapak-su-bulma': () => {
    const ax = 96;
    return (
      <Scene2 bg="outdoor">
        <Tree x={286} y={196} s={0.9} />
        <WellRing x={140} y={214} w={130} h={48} />
        <Stones x={66} y={ax - 10} w={20} h={120} r={6} />
        <Stones x={194} y={ax - 10} w={20} h={120} r={6} />
        <OG sh={[
          { d: 'M58 ' + (ax - 24) + 'L140 ' + (ax - 50) + 'L222 ' + (ax - 24) + 'Z', f: '#c2583e' },
          { d: rrect(80, ax - 3, 130, 7, 3), f: K.metal },
          { d: rrect(114, ax - 13, 52, 26, 5), f: M.ip },
          { d: capsule([210, ax], 3.5, [222, ax + 28], 3.5), f: K.metal },
        ]} />
        <Rope pts={[[140, ax + 13], [140, 140]]} />
        <Bucket x={140} y={168} s={0.75} fill={K.waterLight} />
        <Jerry x={244} y={226} s={1.05} />
        <Jerry x={34} y={228} s={0.9} color="#e9e7e2" />
      </Scene2>
    );
  },

  'sf-sd-kapak-aritma': () => (
    <Scene2 bg="closeup">
      {/* kum filtresi */}
      <rect x={24} y={60} width={80} height={156} rx={4} fill="#f4f1ea" stroke={K.out} stroke-width={1.6} />
      <rect x={28} y={84} width={72} height={16} fill={M.su} />
      <Sand d="M28 100H100V184H28Z" box={[28, 100, 72, 84]} id="ka-s" />
      <Gravel d="M28 184H100V212H28Z" box={[28, 184, 72, 28]} r={3} id="ka-g" />
      <OG sh={[{ d: rrect(18, 52, 92, 10, 3), f: M.beton }]} />
      {/* seramik çömlek + kova */}
      <path d="M126 120H214L206 216H134Z" fill="#f2f7fa" stroke={K.out} stroke-width={1.6} />
      <path d="M130 180H210L206 216H134Z" fill={K.waterLight} />
      <path d="M126 120L140 164Q170 172 200 164L214 120Z" fill="#c97b4a" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: rrect(118, 110, 104, 12, 4), f: '#5b8fc8' }, { d: capsule([206, 204], 3.5, [226, 204], 3.5), f: K.metal }]} />
      <path d="M126 120L134 216" fill="none" stroke={K.out} stroke-width={1.6} />
      {/* SODIS */}
      <circle cx={276} cy={52} r={18} fill="#ffd64a" stroke={K.out} stroke-width={1.5} />
      <PetBottle x={274} y={216} s={1.4} water={M.su} />
    </Scene2>
  ),

  'sf-sd-kapak-dezenfeksiyon': () => (
    <Scene2 bg="closeup">
      <Campfire x={124} y={226} s={1.6} />
      <OG sh={[{ d: capsule([64, 168], 3, [184, 168], 3), f: K.metal }]} />
      <Pot x={124} y={198} s={1.9} />
      {/* kaptan çıkan makas kulpu */}
      <path d="M100 150L112 120M120 150L114 120" stroke={K.out} stroke-width={4} stroke-linecap="round" />
      <path d={ell([110, 114], 6, 5)} fill="none" stroke={K.out} stroke-width={3.5} />
      <path d={ell([118, 116], 6, 5)} fill="none" stroke={K.out} stroke-width={3.5} />
      {/* sabun ve temiz bez */}
      <OG sh={[{ d: rrect(222, 200, 52, 22, 8), f: '#f3d8e2' }]} />
      <Cloth2 x={250} y={150} />
    </Scene2>
  ),

  'sf-sd-kapak-dezenfektan': () => (
    <Scene2 bg="closeup">
      {/* çamaşır suyu şişesi */}
      <OG sh={[
        { d: 'M36 220V128Q36 112 52 108H84Q100 112 100 128V220Z', f: K.white },
        { d: rrect(58, 92, 20, 18, 3), f: K.water },
        { d: rrect(44, 146, 48, 40, 4), f: K.water },
      ]} />
      <Txt x={68} y={172} t="%5" size={16} c="#fff" />
      {/* ölçü kabı */}
      <path d="M118 176H156L152 220H122Z" fill="#eef7fb" stroke={K.out} stroke-width={1.5} />
      <path d="M120 196H154L152 220H122Z" fill="#e8eebd" />
      {[186, 198, 210].map((y) => <path key={y} d={`M140 ${y}h10`} stroke={K.out} stroke-width={1.2} />)}
      {/* kapaklı kova */}
      <Bucket x={226} y={222} s={1.8} color="#e6e8eb" fill="#e8eebd" handle={false} />
      <OG sh={[{ d: rrect(186, 154, 80, 10, 3), f: '#5b8fc8' }]} />
      <Label x={226} y={196} text="%0,5" size={14} bg={K.white} />
    </Scene2>
  ),
};
