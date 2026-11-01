// Sel, heyelan, tsunami, akıntı, sel sonrası, çamur akışı, araç ve sel uyarısı sahneleri (kit v2).
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Car, Cloth, Door, Drop, Hand, HouseExt, K, Label, No, OG, Ok, Bad, Person, Phone, POSE, Radio, Rock,
  Scene2, Stairs, Table, Tent, Tree, Waves, Whistle, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { P, PersonProps, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

/** Musluk (ortak sahnedeki şeklin kopyası). x,y = ağız */
function Faucet({ x, y, s = 1, flowTo }: { x: number; y: number; s?: number; flowTo?: number }) {
  const m = '#b7c1cb';
  return (
    <g>
      {flowTo !== undefined && (
        <path d={`M${x - 7 * s} ${y}Q${x - 8 * s} ${(y + flowTo) / 2} ${x - 10 * s} ${flowTo}H${x + 10 * s}Q${x + 8 * s} ${(y + flowTo) / 2} ${x + 7 * s} ${y}Z`} fill={K.waterLight} stroke={K.out} stroke-width={1.3} opacity={0.95} />
      )}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <OG ow={1.5 / s} sh={[
          { d: rrect(-200, -46, 150, 18, 4), f: m },
          { d: 'M-56 -46H-6Q12 -46 12 -28V0H-12V-22H-56Z', f: m },
          { d: rrect(-15, -6, 30, 8, 2), f: shade(m, 0.15) },
          { d: rrect(-42, -64, 16, 20, 3), f: shade(m, 0.1) },
          { d: rrect(-52, -70, 36, 8, 4), f: K.danger },
        ]} />
      </g>
    </g>
  );
}

const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);
const MUD = '#9c7a52';
const MUDL = '#c4a47a';
const MUDD = '#78593a';
const SAND = '#e8d3a2';
const SANDW = '#c9b07c';
const SEA = '#3a8fd0';
const CONC = '#c9c6bf';
const GRASS = K.grass;
const SOIL = '#b98d5f';
const WARN = '#f6c431';

/** Dalgalı üst kenarlı su kütlesi (x,y = SOL ÜST). flow: akış çizgileri, op: saydamlık */
function Flood({ x, y, w, h, c = MUD, op = 1, flow = 0, dir = 1, amp = 3, bare }: { x: number; y: number; w: number; h: number; c?: string; op?: number; flow?: number; dir?: 1 | -1; amp?: number; bare?: boolean }) {
  let top = `M${x} ${y}`;
  for (let xx = x; xx < x + w - 0.1; xx += 20) top += `q5 ${-amp} 10 0t10 0`;
  const d = `${top}V${y + h}H${x}Z`;
  const lc = tint(c, 0.42);
  return (
    <g opacity={op}>
      {bare ? (
        <g>
          <path d={d} fill={c} />
          <path d={top} fill="none" stroke={K.out} stroke-width={1.5} />
        </g>
      ) : (
        <OG sh={[{ d, f: c }]} />
      )}
      <path d={`M${x} ${y + 5}H${x + w}`} stroke={shade(c, 0.08)} stroke-width={3} opacity={0.5} />
      {flow > 0 && <FlowLines x={x + 10} y={y + 12} w={w - 20} h={h - 16} n={flow} c={lc} dir={dir} />}
    </g>
  );
}

/** Akış çizgileri: dalgalı kısa çizgiler + uçta küçük ok başı */
function FlowLines({ x, y, w, h, n = 4, c = MUDL, dir = 1, wd = 2.4 }: { x: number; y: number; w: number; h: number; n?: number; c?: string; dir?: 1 | -1; wd?: number }) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const yy = y + (h * (i + 0.5)) / n;
    const len = 34 + (i % 2) * 14;
    const x0 = x + ((i * 61) % Math.max(1, w - len));
    const x1 = x0 + len;
    const [a, b] = dir > 0 ? [x0, x1] : [x1, x0];
    out.push(
      <g key={i}>
        <path d={`M${a} ${yy}q${(b - a) / 4} -4 ${(b - a) / 2} 0t${(b - a) / 2} 0`} />
        <path d={`M${b - dir * 6} ${yy - 4}L${b} ${yy}L${b - dir * 6} ${yy + 4}`} />
      </g>,
    );
  }
  return (
    <g fill="none" stroke={c} stroke-width={wd} stroke-linecap="round" stroke-linejoin="round">
      {out}
    </g>
  );
}

/** Sarı uyarı üçgeni (MERKEZ), içinde ünlem ya da şimşek */
function WarnTri({ x, y, r = 10, c = WARN, bolt }: { x: number; y: number; r?: number; c?: string; bolt?: boolean }) {
  const h = r * 1.7;
  const d = `M${x} ${y - h * 0.62}L${x + r} ${y + h * 0.38}H${x - r}Z`;
  const ink = c === WARN ? K.ink : '#fff';
  return (
    <g>
      <path d={d} fill="#fff" stroke="#fff" stroke-width={5} stroke-linejoin="round" opacity={0.85} />
      <path d={d} fill={c} stroke={K.out} stroke-width={1.6} stroke-linejoin="round" />
      {bolt ? (
        <path transform={`translate(${x} ${y + r * 0.05}) scale(${r / 14})`} d="M2 -10L-5 1H0L-2 9L5 -2H0Z" fill={ink} />
      ) : (
        <g fill={ink}>
          <rect x={x - r * 0.12} y={y - r * 0.55} width={r * 0.24} height={r * 0.62} rx={r * 0.1} />
          <circle cx={x} cy={y + r * 0.27} r={r * 0.14} />
        </g>
      )}
    </g>
  );
}

/** Şimşek simgesi (MERKEZ) */
function Bolt({ x, y, s = 1, c = WARN }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: 'M4 -18L-10 2H-1L-5 18L10 -3H1Z', f: c }]} />
    </G>
  );
}

/** Kıvılcım (yıldız çizgileri) */
function Spark({ x, y, r = 10, c = WARN }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g stroke={c} stroke-width={2.6} stroke-linecap="round">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r0 = r * 0.35, r1 = i % 2 ? r * 0.75 : r;
        return <line key={a} x1={x + Math.cos(a * R) * r0} y1={y + Math.sin(a * R) * r0} x2={x + Math.cos(a * R) * r1} y2={y + Math.sin(a * R) * r1} />;
      })}
    </g>
  );
}

/** Yağmur çizgileri */
function Rain({ x, y, w, h, n = 18, c = '#6f9fc8', len = 12, op = 0.85 }: { x: number; y: number; w: number; h: number; n?: number; c?: string; len?: number; op?: number }) {
  const ls = [];
  for (let i = 0; i < n; i++) {
    const xx = x + ((i * 37) % w);
    const yy = y + ((i * 53) % Math.max(1, h - len));
    ls.push(<line key={i} x1={xx} y1={yy} x2={xx - len * 0.3} y2={yy + len} />);
  }
  return (
    <g stroke={c} stroke-width={2} stroke-linecap="round" opacity={op}>
      {ls}
    </g>
  );
}

/** Koyu yağmur bulutu (MERKEZ) */
function Cloud({ x, y, s = 1, c = '#8d97a6' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-34 10A12 12 0 0 1 -26 -10A16 16 0 0 1 2 -18A14 14 0 0 1 26 -8A11 11 0 0 1 34 10Z', f: c },
          { d: 'M-34 10H34', st: shade(c, 0.2), sw: 2 },
        ]}
      />
    </G>
  );
}

/** Kurtarma botu (yandan, sağa bakar). x,y = su hattında taban ortası */
function Boat({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-40 -14H38Q46 -14 46 -6Q46 4 34 4H-34Q-42 4 -42 -4Z', f: K.action },
          { d: 'M-40 -6H46', st: shade(K.action, 0.3), sw: 2 },
          { d: rrect(-44, -18, 12, 18, 3), f: '#3b3f4b' },
          { d: 'M-24 -12H30', st: '#fff', sw: 2.2 },
        ]}
      />
    </g>
  );
}

/** Elektrik direği (x = dip, y = zemin) */
function Pole({ x, y, h = 130, a = 0 }: { x: number; y: number; h?: number; a?: number }) {
  return (
    <g transform={`rotate(${a} ${x} ${y})`}>
      <OG
        sh={[
          { d: rrect(x - 4, y - h, 8, h, 2), f: '#8a6a4c' },
          { d: rrect(x - 22, y - h + 10, 44, 6, 2), f: '#6f5440' },
          { d: circ([x - 16, y - h + 8], 2.6), f: '#e6e8eb' },
          { d: circ([x + 16, y - h + 8], 2.6), f: '#e6e8eb' },
        ]}
      />
    </g>
  );
}

/** Tsunami dalgası (MERKEZ tabanı x,y; sola doğru kıvrılır). w genişlik, h yükseklik */
function BigWave({ x, y, w = 120, h = 70, c = '#2f7fc0', flip }: { x: number; y: number; w?: number; h?: number; c?: string; flip?: boolean }) {
  const d = `M${-w / 2} 0C${-w / 2} ${-h * 0.5} ${-w * 0.2} ${-h} ${w * 0.05} ${-h}C${w * 0.25} ${-h} ${w * 0.3} ${-h * 0.75} ${w * 0.2} ${-h * 0.62}C${w * 0.12} ${-h * 0.52} ${w * 0.18} ${-h * 0.4} ${w * 0.3} ${-h * 0.42}C${w * 0.42} ${-h * 0.42} ${w * 0.5} ${-h * 0.2} ${w / 2} 0Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <OG sh={[{ d, f: c }, { d: `M${-w * 0.3} ${-h * 0.55}C${-w * 0.15} ${-h * 0.85} ${w * 0.05} ${-h * 0.92} ${w * 0.16} ${-h * 0.84}`, st: tint(c, 0.6), sw: 3 }]} />
      <path d={`M${w * 0.2} ${-h * 0.62}C${w * 0.12} ${-h * 0.52} ${w * 0.18} ${-h * 0.4} ${w * 0.3} ${-h * 0.42}`} fill="none" stroke="#fff" stroke-width={4} stroke-linecap="round" />
    </g>
  );
}

/** Balık (MERKEZ, a dönüş) */
function Fish({ x, y, s = 1, a = 0, c = '#9fb3c4' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.4 / s} sh={[{ d: 'M-14 0Q-4 -9 8 -3L15 -8V8L8 3Q-4 9 -14 0Z', f: c }, { d: circ([-8, -1], 1.4), f: K.ink, no: true }]} />
    </G>
  );
}

/** Dal / kütük (a..b arası) */
function Log({ a, b, r = 4, c = K.trunk }: { a: P; b: P; r?: number; c?: string }) {
  return <OG sh={[{ d: capsule(a, r, b, r * 0.85), f: c }]} />;
}

/** Kesikli çizgi */
function Dash({ pts, c = K.safe, w = 3, dash = '7 6', curve }: { pts: P[]; c?: string; w?: number; dash?: string; curve?: boolean }) {
  const d = curve ? smooth(pts) : 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke="#fff" stroke-width={w + 3} stroke-dasharray={dash} opacity={0.7} />
      <path d={d} stroke={c} stroke-width={w} stroke-dasharray={dash} />
    </g>
  );
}

/** Vurgu halkası */
function Ring({ x, y, r, c = K.action, w = 3.5 }: { x: number; y: number; r: number; c?: string; w?: number }) {
  return (
    <g fill="none">
      <circle cx={x} cy={y} r={r} stroke="#fff" stroke-width={w + 3} opacity={0.7} />
      <circle cx={x} cy={y} r={r} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Küçük çerçeve (ek görünüm) */
function Inset({ x, y, w, h, children, bg = '#dfeaf2' }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; bg?: string }) {
  const id = `ins-${x}-${y}-${w}`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={8} />
        </clipPath>
      </defs>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={10} fill="#fff" />
      <g clip-path={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={bg} />
        {children}
      </g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Derinlik ölçüsü (dikey çubuk + etiket) */
function Depth({ x, y1, y2, text }: { x: number; y1: number; y2: number; text: string }) {
  return (
    <g>
      <g stroke="#fff" stroke-width={5} stroke-linecap="round" opacity={0.8}>
        <path d={`M${x} ${y1}V${y2}M${x - 6} ${y1}H${x + 6}M${x - 6} ${y2}H${x + 6}`} />
      </g>
      <g stroke={K.ink} stroke-width={2.4} stroke-linecap="round">
        <path d={`M${x} ${y1}V${y2}M${x - 6} ${y1}H${x + 6}M${x - 6} ${y2}H${x + 6}`} />
      </g>
      <Label x={x} y={y1 - 14} text={text} size={14} bg={K.white} />
    </g>
  );
}

/** Ev kesiti: dış duvar + kat döşemeleri + çatı. x = SOL, y = zemin; floors kat, fh kat yüksekliği */
function HouseCut({ x, y, w, floors = 2, fh = 92, wall = '#efe4d2', outer = '#d9c2a0', roof = '#b5563f', slab, basement = 0 }: { x: number; y: number; w: number; floors?: number; fh?: number; wall?: string; outer?: string; roof?: string; slab?: [number, number][]; basement?: number }) {
  const H = floors * fh;
  const sh: Sh[] = [{ d: rrect(x, y - H - 6, w, H + 6 + basement, 1), f: outer }];
  sh.push({ d: rrect(x + 7, y - H + 2, w - 14, H - 2 + basement - 7 * (basement ? 1 : 0), 0), f: wall });
  // döşemeler
  for (let i = 1; i < floors; i++) {
    const fy = y - i * fh;
    const spans = slab ?? [[x + 7, x + w - 7]];
    for (const [a, b] of spans) sh.push({ d: rrect(a, fy - 3, b - a, 8, 0), f: CONC });
  }
  if (basement) sh.push({ d: rrect(x + 7, y - 3, w - 14, 8, 0), f: CONC });
  sh.push({ d: `M${x - 10} ${y - H - 4}L${x + w / 2} ${y - H - 44}L${x + w + 10} ${y - H - 4}Z`, f: roof });
  return <OG sh={sh} />;
}

/** Kova (yandan). x,y = taban ortası */
function Bucket({ x, y, s = 1, c = '#5d8fb8', water = K.waterLight }: { x: number; y: number; s?: number; c?: string; water?: string | null }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-30 -52Q0 -86 30 -52', st: K.out, sw: 2.6 },
          { d: 'M-32 -54H32L26 -3Q26 0 22 0H-22Q-26 0 -26 -3Z', f: c },
          { d: 'M14 -54H32L26 -3Q26 0 22 0H10Z', f: shade(c, 0.15), no: true },
          ...(water ? [{ d: ell([0, -54], 32, 6), f: water }] : [{ d: ell([0, -54], 32, 6), f: shade(c, 0.35) }]),
        ]}
      />
    </G>
  );
}

/** Plastik şişe (deterjan tipi). x,y = taban ortası */
function Jug({ x, y, s = 1, c = '#f4f4f0', cap = '#3d7ad6', mark, a = 0 }: { x: number; y: number; s?: number; c?: string; cap?: string; mark?: string; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-16 -4V-40Q-16 -48 -8 -52V-58H6V-52Q16 -48 16 -40V-4Q16 0 12 0H-12Q-16 0 -16 -4Z', f: c },
          { d: 'M6 -52Q16 -48 16 -40V-4Q16 0 12 0H6Z', f: shade(c, 0.1), no: true },
          { d: rrect(-9, -66, 18, 9, 2), f: cap },
          { d: rrect(-12, -36, 24, 22, 3), f: mark ? tint(mark, 0.75) : '#fff', ln: true },
        ]}
      />
      {mark && <circle cx={0} cy={-25} r={6} fill={mark} />}
    </G>
  );
}

/** Kürek (sap ucu top, ağız ucu bottom) */
function Shovel({ top, bottom }: { top: P; bottom: P }) {
  const a = Math.atan2(bottom[1] - top[1], bottom[0] - top[0]) / R;
  return (
    <g>
      <OG sh={[{ d: capsule(top, 2.6, bottom, 2.6), f: K.wood }]} />
      <G x={bottom[0]} y={bottom[1]} a={a - 90}>
        <OG sh={[{ d: 'M-11 0H11V14Q11 26 0 30Q-11 26 -11 14Z', f: K.metal }, { d: 'M4 2V24', st: tint(K.metal, 0.5), sw: 2 }]} />
      </G>
    </g>
  );
}

/** Konserve kutusu (MERKEZ). swollen: şişmiş, dent: ezik */
function Can({ x, y, s = 1, a = 0, swollen, dent }: { x: number; y: number; s?: number; a?: number; swollen?: boolean; dent?: boolean }) {
  const top = swollen ? 'M-12 -14Q0 -24 12 -14' : 'M-12 -14H12';
  const bot = swollen ? 'Q0 24 -12 14' : 'H-12';
  const side = dent ? 'L12 -2L6 2L12 6L12 14' : 'V14';
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[{ d: `${top}${side}${bot}Z`, f: '#b8c0c8' }, { d: rrect(-12, -7, 24, 12, 0), f: '#d0473d', no: true }, { d: 'M-12 -7H12M-12 5H12', st: K.out, sw: 1 }]} />
    </G>
  );
}

/** Gıda paketi (MERKEZ) */
function Pack({ x, y, s = 1, a = 0, c = '#f2c14e', mud }: { x: number; y: number; s?: number; a?: number; c?: string; mud?: boolean }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-13, -18, 26, 36, 2), f: c }, { d: rrect(-9, -10, 18, 12, 2), f: '#fff', ln: true }, ...(mud ? [{ d: 'M-13 6Q-4 2 2 8T13 6V18H-13Z', f: MUD, no: true }] : [])]} />
    </G>
  );
}

/** Kişi (aynı props) — ön/arka parça katmanlaması kolaylığı */
const at = (p: PersonProps) => rig(p);

/* ════════════════════════ oyuncular (rehber başına sabit) ════════════════════════ */

type Cast = Omit<Partial<PersonProps>, 'x' | 'y'>;
/** sel */
const SL: Cast = { who: 'man', role: 'helper', skin: 1, hairC: K.hair.dark };
/** heyelan */
const HY: Cast = { who: 'man', role: 'helper', skin: 1, hairC: K.hair.black };
/** sel-tsunami: anne + oğul */
const TS = { mom: { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.brown, skin: 0 } as Cast, kid: { who: 'boy', role: 'bystander2', skin: 0, hairC: K.hair.brown } as Cast };
/** sel-akintiya-kapilma: suya kapılan kişi + kıyıdaki kurtarıcı */
const AK = { vic: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark } as Cast, res: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black } as Cast };
/** sel-sonrasi-temizlik */
const ST: Cast = { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black };
/** sel-camur-akisi: anne + oğul */
const CA = { mom: { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.black, skin: 1 } as Cast, kid: { who: 'boy', role: 'bystander2', skin: 1, hairC: K.hair.black } as Cast };
/** sel-arac: sürücü + yolcu */
const AR = { drv: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark } as Cast, pas: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 1 } as Cast };
/** sel-uyarisi */
const SU: Cast = { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black };

/** Kaçamayan kişi top gibi kıvrılmış, başını koruyor (oyuncuya göre) */
function topOl(cast: Cast) {
  const p: PersonProps = {
    x: 162, y: 222, s: 1.45, ...cast,
    pose: { spine: -6, chest: 12, head: 46, legB: [40, 184], legF: [34, 182], armF: { at: 'nape', d: [2, -4] }, armB: { at: 'head', d: [6, -8] }, face: 'closed', footB: -10, footF: -10 },
  };
  return (
    <Scene2 bg="outdoor" gy={196} ground="dirt">
      <OG sh={[{ d: 'M-10 150Q40 120 90 160Q110 180 140 196H-10Z', f: MUD }, { d: 'M-10 172Q40 152 80 176L100 196H-10Z', f: MUDD, no: true }]} />
      <Rock x={250} y={70} s={0.8} color="#9a8f84" />
      <Rock x={200} y={36} s={0.55} color="#9a8f84" />
      <Rock x={290} y={124} s={0.6} color="#9a8f84" />
      <Rock x={40} y={146} s={0.7} color="#9a8f84" />
      <g stroke={K.ink} stroke-width={2.4} stroke-linecap="round" opacity={0.6}>
        <path d="M240 34v-16M254 30v-12M196 14v-10M286 98v-14M296 100v-10" />
      </g>
      <Person {...p} />
    </Scene2>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ───────────── sel ───────────── */
  'sel-yuksege-cik': () => {
    const gy = 226;
    const sh = 14.8, sw = 17;
    const stepTop = (i: number): P => [292 - i * sw - sw / 2, gy - (i + 1) * sh];
    const climb = (i: number, p: Partial<PersonProps>): PersonProps => ({
      x: stepTop(i)[0], y: stepTop(i)[1], s: 0.56, flip: true, face: 'worried',
      pose: { spine: -82, chest: -84, head: -84, legB: [90, 92], legF: [18, 96], armB: [70, 40], armF: [118, 100] },
      ...p,
    } as PersonProps);
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* dışarıda yükselen sel */}
        <Flood x={-10} y={168} w={60} h={80} flow={0} />
        <HouseCut x={36} y={gy} w={268} floors={2} fh={98} slab={[[43, 172]]} />
        {/* zemin kat penceresi: dışarıda kahverengi su */}
        <g>
          <rect x={60} y={150} width={60} height={46} fill="#bfe3f5" />
          <path d={`M60 172q7 -3 15 0t15 0t15 0t15 0V196H60Z`} fill={MUD} />
          <Window x={55} y={145} w={70} h={56} />
          <path d={`M60 172q7 -3 15 0t15 0t15 0t15 0`} fill="none" stroke={MUDD} stroke-width={2} />
        </g>
        {/* üst kat: pencere + dolap */}
        <Window x={62} y={50} w={60} h={46} />
        <Stairs x={292} y={gy} n={7} sw={sw} sh={sh} dir={-1} />
        <Person {...climb(6, { ...SL })} />
        <Person {...climb(4, { who: 'woman', role: 'bystander2', hair: 'bun', hairC: K.hair.dark })} />
        <Person {...climb(2, { who: 'girl', role: 'bystander3', s: 0.5 })} />
        {/* içerideki su (önde, yarı saydam) */}
        <Flood x={43} y={186} w={254} h={33} op={0.88} flow={2} dir={-1} />
        <Arrow from={[178, 114]} to={[124, 78]} color={K.safe} w={7} />
      </Scene2>
    );
  },

  'sel-akan-su-yasak': () => {
    const p: PersonProps = { x: 142, y: 230, s: 1.02, ...SL, face: 'worried', pose: { ...POSE.walk, armF: [60, 20], armB: [120, 150] } };
    const r = at(p);
    const wl = r.kneeF[1] + 2;
    return (
      <Scene2 bg="outdoor" gy={178} ground="pavement">
        <HouseExt x={10} y={178} w={110} h={70} />
        <HouseExt x={210} y={178} w={100} h={64} color="#e3d0b6" roof="#a14b37" />
        <Flood x={-10} y={wl} w={340} h={260 - wl} c={MUD} />
        <Person {...p} />
        <Flood x={-10} y={wl} w={340} h={260 - wl} c={MUD} op={0.8} flow={0} />
        <FlowLines x={10} y={wl + 8} w={300} h={240 - wl - 10} n={4} c={MUDL} />
        <No x={r.belly[0] - 4} y={r.belly[1] - 14} r={64} />
        <Depth x={262} y1={wl} y2={232} text="15 cm" />
      </Scene2>
    );
  },

  'sel-arac-yasak': () => {
    const wl = 188;
    const road = '#a9a7a0';
    return (
      <Scene2 bg="outdoor" gy={176} ground="pavement">
        {/* alt geçit: yolun üstünden geçen köprü (kesit) ve karanlık geçit ağzı */}
        <path d="M150 176Q166 176 176 200L184 214H330V176Z" fill={road} />
        <rect x={186} y={118} width={118} height={96} fill="#55585f" />
        <path d="M150 176Q166 176 176 200L184 214" fill="none" stroke={shade(road, 0.3)} stroke-width={2} />
        <OG sh={[{ d: rrect(176, 70, 140, 50, 2), f: CONC }, { d: rrect(176, 108, 140, 12, 0), f: shade(CONC, 0.15), no: true }, { d: rrect(176, 58, 140, 6, 1), f: K.metal }, ...[188, 220, 252, 284].map((x) => ({ d: rrect(x, 62, 4, 10, 1), f: K.metal }))]} />
        <Flood x={156} y={wl} w={174} h={60} />
        <g transform="rotate(-18 238 224)">
          <Car x={238} y={226} s={0.78} color="#4f7fb0" />
        </g>
        <Flood x={156} y={wl + 16} w={174} h={50} op={0.82} flow={2} />
        <No x={258} y={168} r={34} />
        <Car x={78} y={214} s={0.82} color="#d0473d" />
        <Arrow from={[118, 160]} to={[34, 160]} bend={0.55} w={7} />
        <Depth x={170} y1={wl} y2={222} text="30 cm" />
      </Scene2>
    );
  },

  'sel-cati-isaret': () => {
    const p: PersonProps = {
      x: 120, y: 128, s: 0.64, ...SL, face: 'speak',
      pose: { ...POSE.kneelOne, spine: -84, armF: [-60, -95], armB: { at: 'mouth', d: [4, 4] }, handB: 'fist' },
    };
    const r = at(p);
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Flood x={-10} y={166} w={340} h={80} flow={0} />
        <Tree x={300} y={178} s={0.6} />
        <HouseExt x={66} y={238} w={156} h={78} />
        <Flood x={-10} y={180} w={340} h={70} op={0.92} flow={3} />
        <Person {...p} />
        <Cloth x={r.handF[0] + 10} y={r.handF[1] - 12} w={36} h={26} a={-24} color="#fbfaf7" />
        <Whistle x={r.mouth[0] + 7} y={r.mouth[1] + 1} s={0.4} a={180} />
        <Waves x={r.mouth[0] + 16} y={r.mouth[1] + 2} n={3} r={7} a={0} />
        <Boat x={268} y={196} s={0.62} flip />
        <Person x={274} y={186} s={0.34} who="man" role="helper2" flip pose={{ ...POSE.kneelSit }} shadow={false} />
        <path d="M300 202q8 -3 16 0M294 208q8 -3 16 0" stroke="#fff" stroke-width={2} fill="none" stroke-linecap="round" />
        <Arrow from={[238, 196]} to={[214, 196]} w={5} />
      </Scene2>
    );
  },

  'sel-elektrik-teli': () => {
    const p: PersonProps = { x: 82, y: 226, s: 0.96, ...SL, flip: true, pose: { ...POSE.walk, face: 'worried' } };
    return (
      <Scene2 bg="outdoor" gy={172} ground="pavement">
        <HouseExt x={0} y={172} w={70} h={56} color="#e3d0b6" />
        <Flood x={150} y={190} w={180} h={60} flow={2} />
        <Pole x={262} y={196} h={150} />
        {/* sağlam tel sağa, kopan tel suya */}
        <path d="M246 54Q290 66 330 58" fill="none" stroke={K.ink} stroke-width={2.4} />
        <path d="M278 54Q250 90 226 130Q210 160 206 196" fill="none" stroke={K.ink} stroke-width={2.6} stroke-linecap="round" />
        <Spark x={206} y={200} r={14} />
        <Bolt x={206} y={200} s={0.9} />
        <path d="M170 214q8 -4 16 0M226 214q8 -4 16 0M180 226q8 -4 16 0" stroke={WARN} stroke-width={2.2} fill="none" stroke-linecap="round" />
        <WarnTri x={206} y={98} r={20} c={K.danger} bolt />
        <Person {...p} />
        <Arrow from={[124, 216]} to={[30, 196]} bend={-0.25} color={K.safe} w={7} />
      </Scene2>
    );
  },

  /* ───────────── heyelan ───────────── */
  'sel-heyelan-isaretler': () => {
    const sy = (x: number) => 40 + 0.72 * x;
    return (
      <Scene2 bg="outdoor" gy={206}>
        <OG sh={[{ d: `M-10 ${sy(-10)}L214 ${sy(214)}Q226 ${sy(214) + 6} 240 206H330V250H-10Z`, f: GRASS }, { d: `M-10 ${sy(-10) + 14}L214 ${sy(214) + 14}L240 250H-10Z`, f: K.grassShade, no: true }]} />
        {/* çatlaklar */}
        <path d={`M28 ${sy(28) + 4}l8 6l-4 8l9 5l-3 9M58 ${sy(58) + 2}l6 8l-6 6l8 6`} fill="none" stroke={MUDD} stroke-width={3} stroke-linejoin="round" stroke-linecap="round" />
        <WarnTri x={70} y={sy(70) - 24} r={10} />
        {/* eğilmiş direk */}
        <Pole x={110} y={sy(110) + 4} h={90} a={16} />
        <WarnTri x={150} y={sy(110) - 66} r={10} />
        {/* eğilmiş ağaç */}
        <g transform={`rotate(-18 166 ${sy(166) + 4})`}>
          <Tree x={166} y={sy(166) + 4} s={0.62} />
        </g>
        <WarnTri x={120} y={sy(120) + 32} r={10} />
        {/* yamaç dibinde kabaran toprak */}
        <OG sh={[{ d: `M172 ${sy(172) + 1}Q190 ${sy(180) - 22} 214 ${sy(204) - 12}Q232 200 246 207L240 214Q210 214 172 ${sy(172) + 1}Z`, f: SOIL }, { d: `M196 ${sy(190) - 10}l6 6l-4 6M218 ${sy(206) - 6}l5 5`, st: MUDD, sw: 2.2 }]} />
        <WarnTri x={212} y={232} r={10} />
        {/* ev, duvarda çatlak */}
        <HouseExt x={236} y={222} w={78} h={64} />
        <path d="M252 162l5 10l-6 8l7 10l-4 8" fill="none" stroke={K.out} stroke-width={2.4} stroke-linejoin="round" />
        <WarnTri x={292} y={130} r={10} />
        {/* yamaçtan ses */}
        <Waves x={40} y={sy(40) - 36} n={3} r={7} a={-130} color={K.ink} />
      </Scene2>
    );
  },

  'sel-heyelan-yana-kac': () => {
    const tongue = 'M128 10Q150 4 186 10Q200 60 214 110Q236 170 262 250H64Q86 170 106 110Q118 60 128 10Z';
    const a: PersonProps = { x: 276, y: 150, s: 0.58, ...HY, pose: POSE.run, face: 'worried' };
    const b: PersonProps = { x: 164, y: 230, s: 0.62, ...HY, face: 'pain', pose: { ...POSE.stand, armB: [-150, -120], armF: [-30, -60] } };
    return (
      <Scene2 bg="outdoor" gy={30}>
        <rect x={0} y={0} width={320} height={30} fill={K.sky} />
        <rect x={0} y={24} width={320} height={220} fill={GRASS} />
        <path d="M0 24Q80 14 160 22T320 20V30H0Z" fill={K.hill} />
        <Tree x={36} y={88} kind="pine" s={0.5} />
        <Tree x={300} y={70} kind="pine" s={0.45} />
        <Tree x={20} y={190} kind="pine" s={0.6} />
        <OG sh={[{ d: tongue, f: SOIL }, { d: 'M150 20Q166 80 186 130Q206 190 222 250H180Q170 180 160 120Z', f: shade(SOIL, 0.12), no: true }]} />
        <Rock x={150} y={70} s={0.6} color="#9a8f84" />
        <Rock x={186} y={130} s={0.8} color="#9a8f84" />
        <Rock x={120} y={160} s={0.9} color="#9a8f84" />
        <Rock x={210} y={200} s={0.7} color="#9a8f84" />
        <g stroke={MUDD} stroke-width={2.6} stroke-linecap="round" fill="none">
          <path d="M140 92v16M196 160v18M110 196v16" />
          <path d="M134 102l6 6l6 -6M190 172l6 6l6 -6M104 206l6 6l6 -6" />
        </g>
        <Person {...b} />
        <No x={164} y={180} r={42} />
        <Person {...a} />
        <Arrow from={[236, 120]} to={[306, 120]} color={K.safe} w={7} />
      </Scene2>
    );
  },

  'sel-heyelan-top-ol': () => topOl(HY),
  'sel-camur-top-ol': () => topOl(CA.mom),

  /* ───────────── tsunami ───────────── */
  'sel-tsunami-kiyidan-uzaklas': () => {
    const hill = (x: number) => (x < 150 ? 206 : 206 - (x - 150) * 0.62);
    const walker = (x: number, p: Partial<PersonProps>): PersonProps => ({ x, y: hill(x) + 6, s: 0.5, pose: { ...POSE.walk, spine: -80, chest: -80 }, face: 'worried', ...p } as PersonProps);
    return (
      <Scene2 bg="outdoor" gy={200}>
        <rect x={0} y={150} width={110} height={100} fill={SEA} />
        <path d="M0 150H110" stroke={tint(SEA, 0.5)} stroke-width={2} />
        <path d="M14 168h20M60 184h24M20 204h18" stroke={tint(SEA, 0.5)} stroke-width={2} stroke-linecap="round" />
        <OG sh={[{ d: 'M70 250Q96 190 120 180H330V250Z', f: SAND }]} />
        <OG sh={[{ d: `M118 250Q132 214 150 ${hill(150)}L330 ${hill(330)}V250Z`, f: GRASS }, { d: `M150 ${hill(150)}L330 ${hill(330)}`, st: shade(GRASS, 0.2), sw: 2 }]} />
        <path d={`M100 236Q130 212 150 212L330 ${hill(330) + 8}`} fill="none" stroke="#8d8b85" stroke-width={10} />
        <Tree x={300} y={hill(300) + 2} s={0.55} />
        <Person {...walker(190, { ...TS.kid, s: 0.5 })} />
        <Person {...walker(228, { ...TS.mom, s: 0.62 })} />
        <Arrow from={[190, 108]} to={[268, 64]} color={K.safe} w={7} />
        {/* tahliye tabelası: dalga + yokuşa çıkan insan/ok simgesi */}
        <g>
          <OG sh={[{ d: rrect(64, 160, 6, 76, 1.5), f: K.metal }, { d: rrect(28, 112, 78, 56, 6), f: K.safe }, { d: rrect(32, 116, 70, 48, 4), f: 'none', st: '#fff', sw: 2 }]} />
          <path d="M38 156c6-14 14-18 20-12c-6 0-8 6-4 12Z" fill="#fff" />
          <path d="M60 156L96 128V156Z" fill="#fff" opacity={0.95} />
          <path d="M66 140L88 122M80 120h9v9" stroke={K.safe} stroke-width={3.4} fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </Scene2>
    );
  },

  'sel-tsunami-deniz-cekiliyor': () => {
    const good: PersonProps = { x: 270, y: 194, s: 0.74, ...TS.mom, pose: POSE.run, face: 'worried' };
    const kid: PersonProps = { x: 226, y: 206, s: 0.58, ...TS.kid, pose: POSE.run, face: 'worried' };
    return (
      <Scene2 bg="outdoor" gy={150}>
        <rect x={0} y={128} width={320} height={22} fill={K.skyLow} />
        {/* ufukta yükselen dalga */}
        <rect x={0} y={140} width={70} height={110} fill={SEA} />
        <BigWave x={34} y={146} w={110} h={34} c="#2a6fae" />
        <OG sh={[{ d: 'M0 158H70Q120 160 170 172Q240 168 330 150V250H0Z', f: SANDW }]} />
        <OG sh={[{ d: 'M150 250Q190 190 240 176Q290 160 330 150V250Z', f: SAND }]} />
        <path d="M0 158H70" stroke={tint(SEA, 0.5)} stroke-width={2} />
        {/* açıkta kalan kaya ve balıklar */}
        <Rock x={60} y={196} s={0.8} color="#8f9590" />
        <Rock x={166} y={190} s={0.5} color="#8f9590" />
        <path d="M44 196q-4 -10 2 -16M76 196q4 -12 -2 -18" stroke="#4e8a49" stroke-width={3} fill="none" stroke-linecap="round" />
        <Fish x={34} y={222} a={-20} />
        <Fish x={96} y={232} a={14} s={0.9} c="#c9b46a" />
        <Fish x={150} y={226} a={-8} s={0.85} />
        <path d="M24 212l4 -6M40 214l-4 -5M140 216l4 -6" stroke={K.ink} stroke-width={1.8} stroke-linecap="round" />
        <Person {...kid} />
        <Person {...good} />
        <Arrow from={[214, 76]} to={[292, 50]} color={K.safe} w={7} />
      </Scene2>
    );
  },

  'sel-tsunami-yokus': () => {
    const hill = (x: number) => (x < 170 ? 208 : Math.max(70, 208 - (x - 170) * 0.92));
    const fam = (x: number, p: Partial<PersonProps>): PersonProps => ({ x, y: hill(x) + 4, s: 0.48, face: 'worried', pose: { ...POSE.walk, spine: -78, chest: -76, head: -84 }, ...p } as PersonProps);
    return (
      <Scene2 bg="outdoor" gy={208}>
        <rect x={0} y={192} width={40} height={60} fill={SEA} />
        <path d="M0 192H40" stroke={tint(SEA, 0.5)} stroke-width={2} />
        <OG sh={[{ d: `M34 250V206Q36 200 44 200H170L${330} ${hill(330)}V250Z`, f: GRASS }]} />
        <OG sh={[{ d: `M170 208L330 ${hill(330)}V250H170Z`, f: '#9cc574', no: true }]} />
        <HouseExt x={52} y={202} w={34} h={24} />
        <HouseExt x={96} y={202} w={30} h={22} color="#e3d0b6" roof="#a14b37" />
        <HouseExt x={134} y={202} w={30} h={24} />
        {/* tıkanmış sahil yolu */}
        <rect x={34} y={212} width={150} height={16} fill="#8d8b85" />
        <Car x={62} y={228} s={0.36} color="#4f7fb0" />
        <Car x={110} y={228} s={0.36} color="#d9a13a" />
        <Car x={158} y={228} s={0.36} color="#d0473d" />
        <Tree x={300} y={hill(300) + 2} s={0.5} kind="pine" />
        <Person {...fam(222, { ...TS.kid, s: 0.44 })} />
        <Person {...fam(252, { ...TS.mom, s: 0.54 })} />
        <Arrow from={[150, 122]} to={[214, 58]} color={K.safe} w={7} />
      </Scene2>
    );
  },
  'sel-tsunami-bina-ust-kat': () => {
    const gy = 224, fh = 60, bx = 140, bw = 160;
    const fl = (i: number) => gy - i * fh;
    const up = (i: number, step: number, p: Partial<PersonProps>): PersonProps => {
      const dir = i % 2 === 0 ? 1 : -1;
      const x0 = dir > 0 ? bx + 12 : bx + 12 + 5 * 14;
      return { x: x0 + dir * (step * 14 + 7), y: fl(i) - (step + 1) * 12, s: 0.34, flip: dir < 0, face: 'worried', pose: { spine: -80, legB: [90, 92], legF: [24, 96], armB: [70, 40], armF: [118, 100] }, ...p } as PersonProps;
    };
    return (
      <Scene2 bg="outdoor" gy={gy} ground="pavement">
        <rect x={0} y={190} width={60} height={60} fill={SEA} />
        <OG sh={[{ d: rrect(bx, gy - 3 * fh - 8, bw, 3 * fh + 8, 1), f: '#b9b4aa' }, { d: rrect(bx + 6, gy - 3 * fh, bw - 12, 3 * fh, 0), f: '#efe8dc' }, { d: rrect(bx - 4, gy - 3 * fh - 14, bw + 8, 8, 1), f: CONC }]} />
        {[1, 2].map((i) => <OG key={i} sh={[{ d: rrect(bx + 6, fl(i) - 3, bw - 12, 7, 0), f: CONC }]} />)}
        {[0, 1, 2].map((i) => <rect key={i} x={bx + 108} y={fl(i) - 46} width={34} height={26} fill="#bfe3f5" stroke={K.out} stroke-width={1.5} />)}
        <Stairs x={bx + 12} y={fl(0)} n={5} sw={14} sh={12} />
        <Stairs x={bx + 12 + 5 * 14} y={fl(1)} n={5} sw={14} sh={12} dir={-1} />
        <Stairs x={bx + 12} y={fl(2)} n={5} sw={14} sh={12} />
        <Person {...up(0, 2, { who: 'man', role: 'bystander', skin: 2 })} />
        <Person {...up(1, 1, { who: 'oldwoman', role: 'bystander3' })} />
        <Person {...up(1, 3, { who: 'man', role: 'bystander4', skin: 1, s: 0.34 })} />
        <Person x={bx + 116} y={fl(2) - 2} s={0.36} {...TS.mom} pose={{ ...POSE.stand, face: 'worried' }} />
        <Person x={bx + 134} y={fl(2) - 2} s={0.3} {...TS.kid} pose={{ ...POSE.stand, face: 'worried' }} />
        <Ok x={bx + bw - 14} y={fl(3) + 14} r={11} />
        <Ok x={bx + bw - 14} y={fl(2) + 14} r={11} />
        <BigWave x={70} y={gy + 2} w={150} h={58} />
        <Flood x={0} y={gy - 8} w={150} h={30} c={SEA} />
        <Arrow from={[bx - 14, 196]} to={[bx - 14, 70]} color={K.safe} w={7} />
      </Scene2>
    );
  },

  'sel-tsunami-donme': () => {
    const hillY = (x: number) => (x < 210 ? 210 : 210 - (x - 210) * 0.9);
    return (
      <Scene2 bg="outdoor" gy={150}>
        <rect x={0} y={128} width={320} height={22} fill={K.skyLow} />
        <rect x={0} y={146} width={90} height={100} fill={SEA} />
        <BigWave x={44} y={150} w={80} h={22} c="#2a6fae" />
        <OG sh={[{ d: 'M0 172Q60 164 120 176T330 172V250H0Z', f: SANDW }]} />
        <OG sh={[{ d: `M196 250Q200 214 210 ${hillY(210)}L330 ${hillY(330)}V250Z`, f: GRASS }]} />
        {/* enkaz */}
        <Log a={[24, 206]} b={[70, 196]} r={4} c="#a87c56" />
        <Log a={[70, 228]} b={[106, 236]} r={3.6} c="#8a6a4c" />
        <OG sh={[{ d: circ([178, 222], 11), f: '#30333b' }, { d: circ([178, 222], 5), f: SANDW }]} />
        <OG sh={[{ d: 'M18 236L40 222L62 236Z', f: '#4f7fb0' }]} />
        <OG sh={[{ d: rrect(100, 192, 26, 14, 2), f: '#c6574e' }]} />
        {/* kıyıya geri dönüş yolu: yasak */}
        <Dash pts={[[236, 168], [180, 186], [120, 200]]} c={K.danger} w={4} curve />
        <path d="M128 190L116 201L132 206" fill="none" stroke={K.danger} stroke-width={4} stroke-linecap="round" stroke-linejoin="round" />
        <No x={170} y={186} r={30} />
        <Person x={262} y={hillY(262) + 4} s={0.66} flip {...TS.mom} pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person x={294} y={hillY(294) + 4} s={0.52} flip {...TS.kid} pose={{ ...POSE.stand, face: 'neutral' }} />
      </Scene2>
    );
  },

  /* ───────────── akıntıya kapılma ───────────── */
  'sel-akinti-sirtustu': () => {
    const p: PersonProps = { x: 150, y: 174, s: 1.05, ...AK.vic, shadow: false, pose: { ...POSE.lieBack, face: 'neutral', head: 186, armB: [-14, -4], armF: [16, 8], legB: [-3, -5], legF: [2, -2] } };
    const r = at(p);
    return (
      <Scene2 bg="outdoor" gy={110}>
        <Tree x={40} y={118} kind="pine" s={0.6} />
        <Tree x={280} y={116} s={0.55} />
        <Flood x={-10} y={146} w={340} h={110} />
        <FlowLines x={40} y={150} w={240} h={8} n={1} c={MUDL} wd={3} />
        <Person {...p} />
        <Flood x={-10} y={158} w={340} h={90} op={0.72} />
        <FlowLines x={20} y={186} w={280} h={50} n={3} c={MUDL} wd={3.2} />
        <Waves x={r.mouth[0] + 2} y={r.mouth[1] - 6} n={3} r={6} a={-90} color={K.water} />
      </Scene2>
    );
  },

  'sel-akinti-ayaklar-onde': () => {
    const c: P = [134, 124];
    const p: PersonProps = { x: c[0], y: c[1], ay: 'hip', s: 0.88, ...AK.vic, shadow: false, pose: { ...POSE.stand, armB: [140, 150], armF: [40, 30], legB: [94, 92], legF: [86, 88], face: 'neutral' } };
    return (
      <Scene2 bg="dark">
        <rect x={0} y={0} width={320} height={240} fill={MUD} />
        <rect x={0} y={0} width={320} height={34} fill={GRASS} />
        <rect x={0} y={206} width={320} height={34} fill={GRASS} />
        <path d="M0 34q20 6 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0M0 206q20 -6 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="none" stroke={K.out} stroke-width={2} />
        <FlowLines x={10} y={44} w={300} h={40} n={2} c={MUDL} wd={3} />
        <FlowLines x={10} y={168} w={300} h={34} n={2} c={MUDL} wd={3} />
        <ellipse cx={c[0] + 6} cy={c[1]} rx={84} ry={34} fill={tint(MUD, 0.2)} />
        <g transform={`rotate(-90 ${c[0]} ${c[1]})`}>
          <Person {...p} />
        </g>
        <G x={-38} y={0}>
          <OG sh={[{ d: smooth([[252, 96], [282, 92], [300, 112], [296, 146], [266, 156], [246, 136], [244, 112]], true), f: '#8f9590' }, { d: smooth([[270, 140], [292, 130], [296, 146], [266, 156]], true), f: shade('#8f9590', 0.15), no: true }]} />
        </G>
        <Ring x={206} y={124} r={20} c={K.safe} w={3} />
      </Scene2>
    );
  },

  'sel-akinti-capraz': () => {
    // headDir: başın baktığı yön (derece). Ayaklar tam karşı yönde.
    const swim = (c: P, headDir: number, s: number, p: Partial<PersonProps>, pose: Partial<PersonProps['pose']> = {}) => (
      <g transform={`rotate(${headDir + 90} ${c[0]} ${c[1]})`}>
        <Person x={c[0]} y={c[1]} ay="hip" s={s} {...AK.vic} shadow={false} pose={{ ...POSE.stand, armB: [130, 120], armF: [50, 60], legB: [92, 92], legF: [88, 88], face: 'neutral', ...pose }} {...(p as object)} />
      </g>
    );
    const c: P = [82, 98];
    const fd = 32; // ayakların yönü: akıntı yönünde (sağ) ve kıyıya doğru (aşağı)
    const ft: P = [c[0] + Math.cos(fd * R) * 44, c[1] + Math.sin(fd * R) * 44];
    return (
      <Scene2 bg="dark">
        <rect x={0} y={0} width={320} height={240} fill={MUD} />
        <rect x={0} y={0} width={320} height={26} fill={GRASS} />
        <rect x={0} y={206} width={320} height={34} fill={GRASS} />
        <path d="M0 26q20 6 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0M0 206q20 -6 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" fill="none" stroke={K.out} stroke-width={2} />
        <FlowLines x={10} y={40} w={300} h={150} n={5} c={MUDL} wd={2.4} />
        {/* akıntı yönü: mavi oklar (sola → sağa) */}
        <Arrow from={[120, 44]} to={[174, 44]} color={K.water} w={5} />
        <Arrow from={[16, 178]} to={[70, 178]} color={K.water} w={5} />
        <Arrow from={[246, 168]} to={[300, 168]} color={K.water} w={5} />
        {/* kıyıya çapraz (≈45°) ilerleme çizgisi */}
        <Dash pts={[ft, [ft[0] + 78, ft[1] + 66]]} c={K.safe} w={4} />
        <Arrow from={[ft[0] + 66, ft[1] + 56]} to={[ft[0] + 92, ft[1] + 78]} color={K.safe} w={5} />
        {/* sırtüstü, ayaklar önde ve akıntı yönünde (sağ), baş akıntının geldiği yanda (sol), gövde kıyıya açılı */}
        {swim(c, fd + 180, 0.62, { role: 'victim' })}
        {/* küçük çerçeve: akıntıya karşı yüzmek yasak */}
        <Inset x={214} y={34} w={94} h={88} bg={MUD}>
          <FlowLines x={218} y={40} w={86} h={74} n={3} c={MUDL} wd={2} />
          <Arrow from={[222, 110]} to={[256, 110]} color={K.water} w={4} />
          {swim([262, 72], 180, 0.48, {}, { armB: [-150, -170], armF: [-30, -10], face: 'worried' })}
          <No x={260} y={76} r={30} />
        </Inset>
      </Scene2>
    );
  },

  'sel-akinti-ayaga-kalkma': () => {
    const bad: PersonProps = { x: 92, y: 210, s: 0.82, ...AK.vic, face: 'pain', pose: { spine: -62, chest: -64, head: -70, legB: [128, 134], legF: [70, 92], armB: [-30, -60], armF: [-10, -40] } };
    const rb = at(bad);
    const good: PersonProps = { x: 250, y: 206, s: 0.74, ...AK.vic, pose: { ...POSE.walk, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={90}>
        {/* sol: derin, hızlı su; sağ: sığ kıyı */}
        <OG sh={[{ d: 'M-10 214Q80 220 170 212Q200 208 214 200L330 196V250H-10Z', f: '#a99a84' }]} />
        <Flood x={-10} y={100} w={200} h={150} op={0.95} flow={3} />
        <Person {...bad} />
        <Rock x={rb.ankleB[0] - 13} y={220} s={0.85} color="#8f9590" />
        <Rock x={rb.ankleB[0] + 13} y={222} s={0.75} color="#7f8580" />
        <Flood x={-10} y={100} w={200} h={150} op={0.3} />
        <Ring x={rb.ankleB[0]} y={rb.ankleB[1] - 2} r={18} c={K.danger} w={3.5} />
        <No x={146} y={56} r={30} />
        <path d="M188 0V240" stroke="#fff" stroke-width={5} />
        <path d="M188 0V240" stroke={K.out} stroke-width={1.5} />
        <Person {...good} />
        <Flood x={190} y={192} w={140} h={60} c={MUD} op={0.6} />
        <Ok x={290} y={90} r={14} />
      </Scene2>
    );
  },

  'sel-akinti-ip-at': () => {
    const hand: P = [124, 104];
    const resc: PersonProps = { x: 92, y: 192, s: 0.9, ...AK.res, face: 'speak', pose: { spine: -86, chest: -88, legB: [116, 104], legF: [62, 80], armF: { to: hand }, armB: [110, 100] } };
    const vic: P = [262, 186];
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Flood x={150} y={168} w={180} h={80} flow={3} />
        <OG sh={[{ d: 'M-10 170H140Q160 172 170 190L180 250H-10Z', f: GRASS }]} />
        <Person x={34} y={186} s={0.76} who="woman" role="bystander" hair="long" hairC={K.hair.black} pose={{ ...POSE.standSide, armF: { at: 'head', d: [8, 2] }, face: 'speak' }} mid={(r) => <Phone x={r.head[0] + 9} y={r.head[1] + 3} s={0.3} a={10} call={false} />} />
        <Label x={40} y={46} text="112" size={15} />
        <Person {...resc} />
        {/* ip: kıyıdan akıntıdaki kişiye */}
        <path d={`M${hand[0]} ${hand[1]}Q200 30 ${vic[0] - 8} ${vic[1] - 18}`} fill="none" stroke="#e8c95a" stroke-width={3} stroke-linecap="round" />
        <path d={`M${hand[0]} ${hand[1]}Q200 30 ${vic[0] - 8} ${vic[1] - 18}`} fill="none" stroke={K.out} stroke-width={1} stroke-dasharray="3 4" />
        <Person x={vic[0]} y={vic[1] + 40} s={0.7} {...AK.vic} shadow={false} pose={{ ...POSE.stand, armB: [-140, -120], armF: [-40, -60], face: 'worried' }} />
        <Flood x={210} y={vic[1] - 10} w={122} h={80} bare />
        <Inset x={230} y={14} w={78} h={66} bg={K.sky}>
          <rect x={230} y={56} width={78} height={30} fill={MUD} />
          <g transform="rotate(60 262 44)">
            <Person x={262} y={44} ay="hip" s={0.3} {...AK.res} shadow={false} pose={{ ...POSE.stand, armB: [-100, -95], armF: [-80, -85] }} />
          </g>
          <No x={268} y={47} r={24} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────────── sel sonrası ───────────── */
  'sel-sonrasi-dis-kontrol': () => {
    const p: PersonProps = { x: 82, y: 224, s: 1.0, ...ST, face: 'worried', pose: { ...POSE.standSide, armF: { at: 'mouth', d: [7, -6] }, handF: { shape: 'flat', a: -60 }, head: -86 } };
    const r = at(p);
    return (
      <Scene2 bg="outdoor" gy={206}>
        <HouseExt x={150} y={212} w={150} h={100} color="#ecdcc2" />
        {/* çamur izi */}
        <path d="M150 170q12 -3 25 0t25 0t25 0t25 0t25 0t25 0V212H150Z" fill={MUD} opacity={0.55} />
        <path d="M150 170q12 -3 25 0t25 0t25 0t25 0t25 0t25 0" fill="none" stroke={MUDD} stroke-width={2.4} />
        {/* duvar çatlağı */}
        <path d="M172 116l6 12l-7 10l8 12l-5 10" fill="none" stroke={K.out} stroke-width={2.4} stroke-linejoin="round" />
        {/* sarkan kablo */}
        <path d="M290 112Q296 130 284 146Q276 156 282 168" fill="none" stroke={K.ink} stroke-width={2.6} stroke-linecap="round" />
        <Spark x={282} y={170} r={7} />
        {/* koku çizgileri */}
        <path d={`M${r.mouth[0] + 24} ${r.mouth[1] - 14}q6 -4 0 -8t0 -8M${r.mouth[0] + 34} ${r.mouth[1] - 10}q6 -4 0 -8t0 -8`} fill="none" stroke="#8a9a5b" stroke-width={2.4} stroke-linecap="round" />
        <Person {...p} />
        <Dash pts={[[110, 226], [170, 230], [222, 214]]} c={K.action} w={3.5} curve />
      </Scene2>
    );
  },

  'sel-sonrasi-koruyucu': () => {
    const p: PersonProps = { x: 148, y: 230, s: 1.18, ...ST, shoes: '#3e6b48', sleeve: 'long', pose: { ...POSE.stand, armF: [74, 104], armB: [104, 92], face: 'neutral' } };
    const r = at(p);
    const GL = '#f2c14e';
    const BT = '#3e6b48';
    const hr = r.headR;
    const eyeY = r.head[1] + hr * 0.02;
    const boot = (k: 'B' | 'F') => {
      const a = r[`ankle${k}`], kn = r[`knee${k}`];
      const t: P = [a[0] + (kn[0] - a[0]) * 0.75, a[1] + (kn[1] - a[1]) * 0.75];
      return { d: capsule(t, 7.6, [a[0], a[1] + 2], 7), f: BT };
    };
    const glove = (k: 'B' | 'F') => {
      const w = r[`wrist${k}`], e = r[`elbow${k}`], h = r[`hand${k}`];
      const t: P = [w[0] + (e[0] - w[0]) * 0.45, w[1] + (e[1] - w[1]) * 0.45];
      return [{ d: capsule(t, 6.4, w, 5.6), f: GL }, { d: circ([h[0], h[1] + 2], 7.2), f: GL }];
    };
    const sh0 = r.handF;
    return (
      <Scene2 bg="outdoor" gy={200} ground="dirt">
        <path d="M0 214q40 -8 80 0t80 0t80 0t80 0V240H0Z" fill={MUD} opacity={0.6} />
        <Shovel top={[sh0[0] + 4, sh0[1] - 66]} bottom={[sh0[0] + 10, 214]} />
        <Person {...p} />
        <OG sh={[boot('B'), boot('F'), ...glove('B'), ...glove('F')]} />
        {/* gözlük */}
        <OG sh={[{ d: rrect(r.head[0] - hr * 0.95, eyeY - hr * 0.3, hr * 1.9, hr * 0.62, hr * 0.28), f: '#bfe3f5' }, { d: `M${r.head[0] - hr * 0.95} ${eyeY}H${r.head[0] - hr * 1.08}M${r.head[0] + hr * 0.95} ${eyeY}H${r.head[0] + hr * 1.08}`, st: K.ink, sw: 2.4 }]} />
        <path d={`M${r.head[0] - hr * 0.6} ${eyeY - hr * 0.12}l${hr * 0.3} -${hr * 0.12}`} stroke="#fff" stroke-width={2} stroke-linecap="round" />
        {/* N95 maske */}
        <OG sh={[{ d: `M${r.head[0] - hr * 0.72} ${eyeY + hr * 0.42}Q${r.head[0]} ${eyeY + hr * 0.2} ${r.head[0] + hr * 0.72} ${eyeY + hr * 0.42}Q${r.head[0] + hr * 0.7} ${eyeY + hr * 1.12} ${r.head[0]} ${eyeY + hr * 1.18}Q${r.head[0] - hr * 0.7} ${eyeY + hr * 1.12} ${r.head[0] - hr * 0.72} ${eyeY + hr * 0.42}Z`, f: '#fbfaf7' }, { d: `M${r.head[0]} ${eyeY + hr * 0.3}V${eyeY + hr * 1.16}`, st: '#c9cfd6', sw: 1.4 }]} />
        <Ok x={r.head[0] + 40} y={eyeY - 6} r={10} />
        <Ok x={r.head[0] - 40} y={eyeY + 14} r={10} />
        <Ok x={r.handB[0] - 22} y={r.handB[1]} r={10} />
        <Ok x={r.ankleB[0] - 26} y={r.ankleB[1] - 14} r={10} />
      </Scene2>
    );
  },

  'sel-sonrasi-gida-at': () => {
    const bag: P = [214, 228];
    const p: PersonProps = { x: 262, y: 230, s: 1.05, ...ST, flip: true, sleeve: 'long', pose: { spine: -78, chest: -70, head: -80, legB: [96, 92], legF: [80, 90], armB: { to: [bag[0] + 14, bag[1] - 62] }, armF: { to: [bag[0] - 4, bag[1] - 64] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={206} wall="#e3e7e0">
        {/* tezgâh + çamurlu dolap (kapağı açık) */}
        <OG sh={[{ d: rrect(10, 112, 128, 96, 2), f: '#d8cdb9' }, { d: rrect(6, 104, 136, 10, 2), f: '#9aa3ad' }, { d: rrect(18, 122, 112, 80, 1), f: '#5b4a3a' }, { d: 'M130 122L150 128V198L130 202Z', f: '#c9bca5' }]} />
        <path d="M18 168q14 -4 28 0t28 0t28 0t28 0V202H18Z" fill={MUD} />
        <path d="M10 176q16 -4 32 0t32 0t32 0t32 0" fill="none" stroke={MUDD} stroke-width={2} opacity={0.7} />
        <rect x={22} y={160} width={104} height={4} fill="#8a7a66" />
        <Pack x={44} y={146} s={0.7} c="#e6b34a" mud />
        <Can x={70} y={152} s={0.7} />
        <Can x={98} y={150} s={0.7} swollen />
        <Window x={170} y={36} w={70} h={56} />
        {/* çöp torbası */}
        <OG sh={[{ d: `M${bag[0] - 30} ${bag[1] - 62}Q${bag[0] - 40} ${bag[1] - 20} ${bag[0] - 28} ${bag[1]}H${bag[0] + 28}Q${bag[0] + 40} ${bag[1] - 20} ${bag[0] + 30} ${bag[1] - 62}Q${bag[0]} ${bag[1] - 70} ${bag[0] - 30} ${bag[1] - 62}Z`, f: '#353a44' }, { d: `M${bag[0] - 14} ${bag[1] - 40}Q${bag[0] - 18} ${bag[1] - 20} ${bag[0] - 12} ${bag[1] - 6}`, st: '#5a606c', sw: 2 }]} />
        <Person {...p} />
        {/* torbaya düşen ürünler */}
        <Can x={176} y={112} s={1.0} a={-20} swollen />
        <Can x={212} y={80} s={0.9} a={25} dent />
        <Pack x={150} y={150} s={0.85} a={30} c="#7ab0d9" mud />
        <g stroke={K.ink} stroke-width={2} stroke-linecap="round" opacity={0.5} fill="none">
          <path d="M160 96q4 -8 10 -10M200 62q6 -6 12 -6M136 134q2 -8 8 -12" />
        </g>
        <Bad x={192} y={100} r={11} />
        <Bad x={230} y={68} r={11} />
        <Bad x={166} y={136} r={11} />
      </Scene2>
    );
  },

  'sel-sonrasi-camasir-suyu': () => {
    const h = { x: 238, y: 78, a: -78, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g = handPoint(h, 'grip');
    const lip: P = [g[0] - 30, g[1] + 2];
    return (
      <Scene2 bg="closeup">
        <defs>
          <filter id="sel-glove" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="0.37 0.72 0.13 0 0  0.29 0.57 0.11 0 0  0.12 0.23 0.04 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        {/* açık pencere */}
        <g>
          <OG sh={[{ d: rrect(18, 18, 78, 70, 2), f: '#f4f1ea' }, { d: rrect(24, 24, 66, 58, 1), f: '#bfe3f5', ln: true }]} />
          <OG sh={[{ d: 'M90 24L124 32V92L90 82Z', f: '#f4f1ea' }, { d: 'M96 32L118 38V84L96 77Z', f: '#d9eef8', ln: true }]} />
          <path d="M34 44q8 4 16 0t16 0M42 60q8 4 16 0" stroke="#fff" stroke-width={2.2} fill="none" stroke-linecap="round" opacity={0.9} />
        </g>
        <Bucket x={132} y={226} s={1.5} />
        <Label x={132} y={186} text="4 L" size={17} bg={K.white} />
        {/* dökülen çamaşır suyu */}
        <path d={`M${lip[0]} ${lip[1]}Q${lip[0] - 18} ${lip[1] + 20} 140 ${148}`} fill="none" stroke="#f3eeb4" stroke-width={6} stroke-linecap="round" />
        <path d={`M${lip[0]} ${lip[1]}Q${lip[0] - 18} ${lip[1] + 20} 140 ${148}`} fill="none" stroke={K.out} stroke-width={1} opacity={0.4} />
        {/* bardak (elin arkasında) */}
        <G x={g[0]} y={g[1]} a={-118}>
          <OG sh={[{ d: 'M-13 -18H13L10 18Q10 21 7 21H-7Q-10 21 -10 18Z', f: '#eef6fa' }, { d: 'M-12 -10H12L10 18Q10 21 7 21H-7Q-10 21 -10 18Z', f: '#f3eeb4', no: true }]} />
        </G>
        {/* lastik eldivenli el (sarı ev eldiveni, adım 4 ile aynı) + uzun manşet, ardından kol */}
        {(() => {
          const fd: P = [Math.sin(h.a * R), -Math.cos(h.a * R)];
          const cuff: P = [h.x - fd[0] * 54 * h.s, h.y - fd[1] * 54 * h.s];
          const far: P = [h.x - fd[0] * 260, h.y - fd[1] * 260];
          return (
            <g>
              <OG sh={[{ d: capsule(cuff, 15.6, far, 16), f: K.role.helper }]} />
              <g filter="url(#sel-glove)">
                <Hand {...h} arm={58} skin={2} />
              </g>
              <OG sh={[{ d: capsule([h.x - fd[0] * 44, h.y - fd[1] * 44], 15, cuff, 15.4), f: '#f2c14e' }]} />
            </g>
          );
        })()}
        {/* köşede: amonyak + çamaşır suyu yan yana yasak */}
        <Jug x={244} y={222} s={0.82} cap="#3d7ad6" mark={K.water} />
        <Jug x={280} y={222} s={0.82} cap="#c6574e" mark="#9b59b6" />
        <No x={262} y={190} r={40} />
      </Scene2>
    );
  },
  /* ───────────── çamur akışı ───────────── */
  'sel-camur-dere-yatagi': () => {
    const sl = (x: number) => (x < 196 ? 214 : 214 - (x - 196) * 0.9);
    const fam = (x: number, p: Partial<PersonProps>): PersonProps => ({ x, y: sl(x) + 4, s: 0.46, face: 'worried', pose: { ...POSE.walk, spine: -76, chest: -76, head: -84 }, ...p } as PersonProps);
    return (
      <Scene2 bg="outdoor" gy={200}>
        <rect x={0} y={0} width={320} height={200} fill="#a9b6c2" />
        <Cloud x={70} y={30} s={1.1} c="#7d8796" />
        <Cloud x={200} y={22} s={1.3} c="#8d97a6" />
        <Cloud x={290} y={44} s={0.9} c="#7d8796" />
        <OG sh={[{ d: 'M-10 120Q40 140 70 200L80 214H-10Z', f: '#7fae58' }]} />
        <OG sh={[{ d: `M70 214H196L330 ${sl(330)}V250H-10V214Z`, f: '#c2a77e' }]} />
        <OG sh={[{ d: `M196 214L330 ${sl(330)}V250H230Z`, f: '#7fae58' }]} />
        <path d={`M200 210L330 ${sl(330) - 4}`} stroke="#8d8b85" stroke-width={7} />
        {/* dere yatağı */}
        <path d="M0 226Q80 220 170 228T330 232V240H0Z" fill={K.water} opacity={0.75} />
        <Tent x={60} y={224} s={0.62} />
        <Car x={136} y={226} s={0.56} color="#d9a13a" />
        <No x={98} y={196} r={52} />
        <Person {...fam(240, { ...CA.kid, s: 0.42 })} />
        <Person {...fam(270, { ...CA.mom, s: 0.52 })} />
        <Arrow from={[204, 116]} to={[270, 56]} color={K.safe} w={7} />
        <Rain x={0} y={0} w={320} h={210} n={44} c="#5f86ad" len={14} />
      </Scene2>
    );
  },

  'sel-camur-dere-bulanik': () => {
    // Vadi kesiti: dere solda (uca bakan kesit), yamaç sağa doğru yükseliyor; kişi dereden DİK açıyla, yokuş yukarı uzaklaşıyor.
    const k = 0.4;
    const gyAt = (x: number) => 200 - Math.max(0, x - 128) * k;
    const fB: P = [182, gyAt(168) + 1], fF: P = [220, gyAt(206) + 1];
    const p: PersonProps = { x: 200, y: (fB[1] + fF[1]) / 2 - 68, ay: 'hip', s: 0.96, ...CA.mom, face: 'worried', pose: { ...POSE.walk, spine: -80, chest: -82, head: -84, legB: { to: fB }, legF: { to: fF }, footB: 0, footF: -22 } };
    return (
      <Scene2 bg="outdoor" gy={200}>
        {/* yamaç (sağa doğru yükselir) */}
        <path d={`M128 200L330 ${gyAt(330)}V250H104Z`} fill={GRASS} />
        <path d={`M128 200L330 ${gyAt(330)}`} stroke={K.out} stroke-width={1.5} />
        <Tree x={292} y={gyAt(292) + 2} s={0.6} />
        <Tree x={262} y={gyAt(252) + 2} kind="pine" s={0.5} />
        {/* dere yatağı (kesit): bulanık, dallı, taşlı su */}
        <path d="M-10 196H124L108 238H-10Z" fill={MUDD} stroke={K.out} stroke-width={1.5} />
        <path d="M-10 206H121L111 232Q50 238 -10 232Z" fill={MUD} />
        <path d="M-10 206q8 -4 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0t14 0" fill="none" stroke={K.out} stroke-width={1.5} />
        <FlowLines x={0} y={212} w={104} h={20} n={2} c={MUDL} wd={2} />
        <Log a={[20, 206]} b={[66, 196]} r={4.4} />
        <Rock x={92} y={232} s={0.45} color="#8f9590" />
        <Person {...p} />
        {/* uzaklaşma yönü: dereden uzağa, yokuş yukarı */}
        <Arrow from={[236, gyAt(236) - 30]} to={[296, gyAt(296) - 58]} w={6} />
        {/* küçük çerçeve: yukarıdan dere, sol berrak → sağ bulanık */}
        <Inset x={12} y={16} w={128} h={66} bg={GRASS}>
          <rect x={12} y={34} width={128} height={30} fill={K.water} />
          <path d="M70 34Q80 44 72 54Q66 62 78 64H140V34Z" fill={MUD} />
          <path d="M12 34H140M12 64H140" stroke={K.out} stroke-width={1.5} />
          <path d="M24 44h14M40 56h12" stroke={K.waterLight} stroke-width={2} stroke-linecap="round" />
          <Log a={[98, 44]} b={[124, 40]} r={2.6} />
          <Rock x={92} y={62} s={0.25} color="#8f9590" />
          <Arrow from={[46, 74]} to={[100, 74]} color={K.water} w={3} />
        </Inset>
      </Scene2>
    );
  },

  'sel-camur-yana-kac': () => {
    const flow = 'M150 0H214Q206 50 196 90Q186 140 200 250H70Q96 160 116 100Q132 50 150 0Z';
    const a: PersonProps = { x: 270, y: 128, s: 0.56, ...CA.mom, pose: POSE.run, face: 'worried' };
    const b: PersonProps = { x: 140, y: 232, s: 0.6, ...CA.mom, face: 'pain', pose: { ...POSE.stand, armB: [-150, -120], armF: [-30, -60] } };
    return (
      <Scene2 bg="dark">
        <rect x={0} y={0} width={320} height={240} fill="#6f9a4e" />
        {/* yüksek düz alan */}
        <OG sh={[{ d: 'M236 40H320V250H252Q240 160 236 40Z', f: '#a3cc7a' }]} />
        <Tree x={300} y={70} kind="pine" s={0.4} />
        <Tree x={24} y={60} kind="pine" s={0.45} />
        <Tree x={30} y={170} kind="pine" s={0.5} />
        <OG sh={[{ d: flow, f: '#7a5c3c' }, { d: 'M176 0H200Q190 60 178 110Q170 170 176 250H140Q150 160 160 100Z', f: MUD, no: true }]} />
        <Log a={[150, 60]} b={[186, 48]} r={4} />
        <Log a={[120, 170]} b={[160, 186]} r={4.4} c="#a87c56" />
        <Rock x={170} y={110} s={0.7} color="#8f9590" />
        <Rock x={110} y={140} s={0.6} color="#8f9590" />
        <Rock x={180} y={214} s={0.8} color="#8f9590" />
        <g stroke={MUDD} stroke-width={2.6} stroke-linecap="round" fill="none">
          <path d="M140 80v16M188 150v16M96 196v14" />
          <path d="M134 90l6 6l6 -6M182 160l6 6l6 -6M90 204l6 6l6 -6" />
        </g>
        <Person {...b} />
        <No x={140} y={182} r={42} />
        <Person {...a} />
        <Ok x={290} y={150} r={11} />
        <Arrow from={[196, 100]} to={[262, 96]} color={K.safe} w={7} />
      </Scene2>
    );
  },

  'sel-camur-ust-kat': () => {
    const gy = 226, fh = 98, x0 = 60;
    const sh = 16.3, sw = 15;
    const stx = 128;
    const step = (i: number): P => [stx + i * sw + sw / 2, gy - (i + 1) * sh];
    const fl = gy - fh;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* yamaç ve inen çamur */}
        <OG sh={[{ d: 'M-10 10Q40 40 54 120Q60 170 62 240H-10Z', f: '#7fae58' }]} />
        <OG sh={[{ d: 'M10 26Q42 66 48 128Q54 180 62 226V240H30Q28 190 22 140Q14 80 -6 44Z', f: MUD }, { d: 'M20 70l6 10M30 120l4 12M38 180l4 10', st: MUDD, sw: 2.4 }]} />
        <HouseCut x={x0} y={gy} w={250} floors={2} fh={fh} slab={[[x0 + 7, stx], [stx + 6 * sw, x0 + 243]]} />
        {/* üst kat ara duvar */}
        <OG sh={[{ d: rrect(stx + 6 * sw, fl - fh + 6, 7, fh - 8, 0), f: '#d9c2a0' }]} />
        <rect x={stx + 6 * sw} y={fl - 44} width={7} height={40} fill="#efe4d2" />
        <Window x={x0 + 14} y={fl - 70} w={40} h={36} />
        <Window x={250} y={fl - 72} w={44} h={38} />
        <Stairs x={stx} y={gy} n={6} sw={sw} sh={sh} />
        {/* zemin kata dolan çamur */}
        <Flood x={x0 + 7} y={188} w={236} h={31} c={MUD} op={0.94} flow={2} />
        <path d={`M${x0} 170Q${x0 + 20} 176 ${x0 + 30} 190`} fill="none" stroke={MUD} stroke-width={8} stroke-linecap="round" />
        <Bad x={x0 + 34} y={fl - 20} r={11} />
        <Person x={step(4)[0]} y={step(4)[1]} s={0.52} {...CA.mom} face="worried" pose={{ spine: -82, legB: [90, 92], legF: [20, 96], armB: [70, 40], armF: [118, 100] }} />
        <Person x={272} y={fl + 2} s={0.44} {...CA.kid} pose={{ ...POSE.stand, face: 'neutral' }} />
        <Ok x={286} y={fl - 82} r={11} />
        <Arrow from={[150, 196]} to={[214, 138]} color={K.safe} w={6} />
      </Scene2>
    );
  },

  /* ───────────── araç ───────────── */
  'sel-arac-tavan': () => {
    const cx = 160, cy = 214, cs = 1.32;
    const roofY = cy - 53 * cs;
    const win: P = [cx + 18 * cs, cy - 36 * cs];
    const grab: P = [cx - 4, roofY - 16];
    const drv: PersonProps = { x: win[0] + 4, y: win[1] + 4, ay: 'hip', s: 0.66, ...AR.drv, face: 'worried', pose: { spine: -70, chest: -82, head: -100, legB: [100, 100], legF: [96, 96], armF: { to: [cx + 30, roofY + 2] }, armB: { to: grab } } };
    const pas: PersonProps = { x: cx - 30, y: roofY + 1, s: 0.66, ...AR.pas, flip: false, face: 'worried', pose: { ...POSE.kneel, spine: -60, chest: -44, head: -40, armF: { to: grab }, armB: [100, 80] } };
    const clip = `M0 0H320V${win[1] + 10}H0Z`;
    return (
      <Scene2 bg="outdoor" gy={150}>
        <Flood x={-10} y={174} w={340} h={80} />
        <Car x={cx} y={cy} s={cs} color="#d0473d" />
        <defs><clipPath id="sel-drv"><path d={clip} /></clipPath></defs>
        <g clip-path="url(#sel-drv)">
          <Person {...drv} />
        </g>
        <Person {...pas} />
        <Flood x={-10} y={182} w={340} h={70} op={0.86} flow={3} />
        <Arrow from={[260, 160]} to={[260, 92]} w={7} />
      </Scene2>
    );
  },

  'sel-sonrasi-el-yika': () => {
    const foam = [[150, 150, 9], [168, 142, 11], [184, 156, 8], [140, 168, 8], [176, 172, 10], [160, 186, 7], [196, 140, 7], [128, 150, 6]];
    const sl = K.role[ST.role ?? 'helper'];
    return (
      <Scene2 bg="closeup">
        <Faucet x={166} y={66} s={1.1} flowTo={150} />
        <Hand x={98} y={226} a={50} s={1.25} pose="press" side="L" arm={140} sleeve={sl} skin={ST.skin} />
        <Hand x={234} y={226} a={-50} s={1.25} pose="press" side="R" arm={140} sleeve={sl} skin={ST.skin} />
        <g>{foam.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke="#b9c7d4" stroke-width={1.2} />)}</g>
        <Drop x={120} y={200} s={0.8} />
        <Drop x={210} y={204} s={0.7} />
      </Scene2>
    );
  },

  'sel-arac-kemer': () => {
    const p: PersonProps = { x: 150, y: 196, ay: 'hip', s: 2.1, ...AR.drv, pose: { ...POSE.stand, armB: [100, 96], face: 'worried' } };
    const r = at(p);
    const bk: P = [r.hipF[0] + 12, r.hipF[1] - 4];
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#5b616c" />
        <OG sh={[{ d: rrect(70, 20, 164, 240, 30), f: '#3f444d' }, { d: rrect(96, -10, 112, 46, 16), f: '#474c56' }]} />
        <Person {...p} only={['torso', 'head', 'armB']} />
        <Person {...p} pose={{ ...p.pose, armF: { to: [bk[0] + 30, bk[1] + 4] }, handF: 'mitten' }} only={['armF']} />
        {/* emniyet kemeri: omuzdan çapraz + kucak */}
        <OG sh={[{ d: capsule([r.shoulderB[0] - 4, r.shoulderB[1] - 10], 7, bk, 7), f: '#2b2f37' }, { d: capsule([r.hipB[0] - 30, r.hipB[1] + 2], 7, bk, 7), f: '#2b2f37' }]} />
        {/* toka */}
        <OG sh={[{ d: rrect(bk[0] - 8, bk[1] - 9, 46, 20, 4), f: '#1f2329' }, { d: rrect(bk[0] + 22, bk[1] - 5, 12, 12, 2), f: K.danger }, { d: rrect(bk[0] - 12, bk[1] - 7, 12, 16, 2), f: K.metal }]} />
        {/* yükselen su (göğüs altı) */}
        <Flood x={-10} y={156} w={340} h={100} c={MUD} op={0.62} />
        <Ring x={bk[0] + 26} y={bk[1] + 1} r={22} />
      </Scene2>
    );
  },

  'sel-arac-cam': () => {
    const p: PersonProps = { x: 132, y: 212, s: 1.12, ...AR.drv, face: 'worried', pose: { ...POSE.sitChair, armF: { to: [204, 146] }, armB: [60, 0], handF: 'flat' } };
    return (
      <Scene2 bg="closeup">
        {/* kapı iç paneli + yan cam */}
        <rect x={0} y={0} width={320} height={240} fill="#5b616c" />
        <OG sh={[{ d: rrect(10, 30, 300, 92, 10), f: '#2f3540' }, { d: rrect(20, 40, 280, 74, 6), f: K.sky }]} />
        {/* camdan görünen: yalnız gökyüzü ve uzak ağaçlar; su camın altında */}
        <path d="M20 104Q60 92 100 100T180 98T300 102V114H20Z" fill={K.hill} />
        <Tree x={64} y={106} s={0.32} kind="pine" />
        <Tree x={250} y={106} s={0.3} />
        <Rain x={24} y={42} w={270} h={44} n={14} c="#7da7cf" len={10} />
        <OG sh={[{ d: rrect(6, 118, 308, 130, 8), f: '#8b8f98' }, { d: rrect(150, 134, 120, 16, 4), f: '#6c7079' }]} />
        {/* cam düğmesi ve kapı kolu */}
        <OG sh={[{ d: rrect(196, 138, 18, 9, 2), f: '#30343c' }, { d: rrect(244, 158, 34, 10, 4), f: K.metal }]} />
        <No x={261} y={163} r={18} />
        {/* koltuk */}
        <OG sh={[{ d: rrect(70, 98, 34, 120, 10), f: '#3b3f48' }, { d: rrect(70, 168, 120, 30, 8), f: '#3b3f48' }]} />
        <Person {...p} />
        {/* dışarıdaki su: kapı hizasında, cam alt kenarının altında */}
        <Flood x={-10} y={156} w={340} h={94} c={MUD} op={0.55} flow={2} />
        <path d={"M-10 156" + "q5 -3 10 0t10 0".repeat(17)} fill="none" stroke={K.out} stroke-width={2.2} />
        <Arrow from={[150, 48]} to={[150, 100]} w={7} />
        <Inset x={14} y={140} w={86} h={84} bg={K.sky}>
          <rect x={14} y={140} width={86} height={84} fill="#bfe3f5" />
          <path d="M14 196H100V224H14Z" fill={MUD} />
          <path d="M30 156l10 8l-4 10M30 156l14 -2M30 156l2 14" stroke={K.out} stroke-width={1.6} fill="none" />
          <G x={44} y={172} a={-35}>
            <OG sh={[{ d: capsule([0, 0], 3, [0, 44], 3), f: '#d63b35' }, { d: rrect(-12, -8, 24, 10, 2), f: '#3b3f48' }, { d: 'M-12 -3L-20 -3L-12 2Z', f: K.metal }]} />
          </G>
          <Spark x={28} y={154} r={9} c={K.action} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────────── sel uyarısı ───────────── */
  'sel-uyari-radyo': () => (
    <Scene2 bg="indoor" gy={206}>
      <g>
        <OG sh={[{ d: rrect(170, 22, 120, 96, 3), f: '#f4f1ea' }, { d: rrect(178, 30, 104, 80, 2), f: '#5d6b7e', ln: true }]} />
        <Cloud x={226} y={46} s={0.8} c="#8d97a6" />
        <Rain x={182} y={56} w={96} h={50} n={16} c="#bcd6ee" len={14} />
        <path d="M230 30V110M178 70H282" stroke="#f4f1ea" stroke-width={4} />
        <rect x={164} y={114} width={132} height={8} rx={2} fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
      </g>
      <Table x={30} y={226} w={250} h={70} />
      <Radio x={100} y={156} s={1.05} />
      {/* telefon: ekranda uyarı + yağmur bulutu */}
      <G x={206} y={118} a={8}>
        <OG sh={[{ d: rrect(-24, -44, 48, 88, 8), f: '#2f3542' }, { d: rrect(-20, -38, 40, 76, 4), f: '#fff4e6', ln: true }]} />
        <path d="M0 -28L16 0H-16Z" fill={K.danger} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
        <rect x={-1.6} y={-20} width={3.2} height={10} rx={1.4} fill="#fff" />
        <circle cx={0} cy={-5} r={1.8} fill="#fff" />
        <G x={0} y={16} s={0.42}>
          <OG ow={3} sh={[{ d: 'M-34 10A12 12 0 0 1 -26 -10A16 16 0 0 1 2 -18A14 14 0 0 1 26 -8A11 11 0 0 1 34 10Z', f: K.action }]} />
        </G>
        <path d="M-8 24l-3 7M0 24l-3 7M8 24l-3 7" stroke={K.water} stroke-width={2.4} stroke-linecap="round" />
      </G>
      <Waves x={232} y={84} n={3} r={6} a={-40} color={K.danger} />
    </Scene2>
  ),

  'sel-uyari-bodrum-cik': () => {
    const gy = 132;
    const sw = 18, sh = 15;
    const st = (i: number): P => [262 - i * sw - sw / 2, 222 - (i + 1) * sh];
    const up = (i: number, p: Partial<PersonProps>): PersonProps => ({ x: st(i)[0], y: st(i)[1], s: 0.5, flip: true, face: 'worried', pose: { spine: -80, legB: [90, 92], legF: [20, 96], armB: [70, 40], armF: [118, 100] }, ...p } as PersonProps);
    const pack = (c: string) => (r: ReturnType<typeof rig>) => <Backpack x={r.back[0] + 7 * r.s} y={r.neck[1] + 5 * r.s} s={r.s * 1.05} color={c} flip />;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={120} fill="#a98b66" />
        <rect x={0} y={gy} width={320} height={6} fill={GRASS} />
        {/* dere: yükselen su */}
        <OG sh={[{ d: `M-10 ${gy}H78Q70 196 34 204H-10Z`, f: '#7d6248' }]} />
        <path d={`M-10 ${gy + 8}q8 -3 16 0t16 0t16 0t16 0t16 0L72 ${gy + 8}Q66 192 34 198H-10Z`} fill={MUD} stroke={K.out} stroke-width={1.5} />
        <path d={`M-10 ${gy + 32}H58`} stroke={MUDD} stroke-width={2} stroke-dasharray="5 4" />
        <path d={`M30 ${gy + 50}V${gy + 16}M23 ${gy + 24}L30 ${gy + 15}L37 ${gy + 24}`} stroke="#fff" stroke-width={3.4} fill="none" stroke-linecap="round" stroke-linejoin="round" />
        {/* bina + bodrum */}
        <OG sh={[{ d: rrect(110, 30, 196, gy - 30, 1), f: '#d9c2a0' }, { d: rrect(118, 38, 180, gy - 46, 0), f: '#efe4d2' }, { d: rrect(102, 22, 212, 10, 1), f: CONC }]} />
        <Window x={240} y={52} w={44} h={40} />
        <OG sh={[{ d: rrect(110, gy, 196, 98, 1), f: '#bfae94' }, { d: rrect(118, gy + 6, 180, 86, 0), f: '#e4d8c4' }]} />
        <OG sh={[{ d: rrect(118, gy - 3, 70, 8, 0), f: CONC }]} />
        <Door x={124} y={gy} w={40} h={80} open />
        <Stairs x={262} y={222} n={6} sw={sw} sh={sh} dir={-1} />
        <Person {...up(1, { who: 'boy', role: 'bystander3', s: 0.42 })} back={pack('#4f7fb0')} />
        <Person {...up(3, { who: 'woman', role: 'bystander2', hair: 'scarf', hairC: '#8f6fc2' })} back={pack('#c0603e')} />
        <Person x={150} y={gy} s={0.5} {...SU} flip face="worried" pose={POSE.walk} back={pack('#6c9c5a')} />
        <Arrow from={[284, 214]} to={[284, 146]} color={K.safe} w={7} />
      </Scene2>
    );
  },

  'sel-uyari-belge-poset': () => {
    const hl = { x: 64, y: 236, a: 20, s: 1.05, pose: 'hold' as const, side: 'L' as const, grip: 30 };
    const hr = { x: 214, y: 14, a: 200, s: 0.95, pose: 'hold' as const, side: 'R' as const, grip: 26 };
    const gr = handPoint(hr, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M258 104Q258 90 272 90H290Q304 90 304 104', st: K.out, sw: 4 }, { d: rrect(236, 100, 80, 110, 12), f: '#c0603e' }, { d: rrect(304, 100, 12, 110, 6), f: shade('#c0603e', 0.15), no: true }, { d: rrect(246, 150, 60, 46, 8), f: shade('#c0603e', 0.1) }, { d: circ([276, 126], 13), f: '#fff' }]} />
        <path d="M276 118V134M268 126H284" stroke={K.danger} stroke-width={4.4} stroke-linecap="round" />
        {/* şeffaf kilitli poşet */}
        <rect x={60} y={98} width={150} height={120} rx={6} fill="#dff0fb" stroke={K.out} stroke-width={1.6} />
        {/* içindekiler */}
        <G x={100} y={170} a={-6}>
          <OG sh={[{ d: rrect(-30, -22, 60, 40, 4), f: '#e9f1f7' }, { d: rrect(-24, -14, 18, 22, 2), f: '#c9d6e2', ln: true }, { d: 'M0 -10H22M0 -2H22M0 6H16', st: K.ink, sw: 2 }]} />
        </G>
        <G x={164} y={180} a={8}>
          <OG sh={[{ d: rrect(-22, -16, 44, 32, 3), f: '#fff' }, { d: 'M-6 0H6M0 -6V6', st: K.danger, sw: 4 }]} />
        </G>
        <rect x={60} y={98} width={150} height={120} rx={6} fill="#bfe3f5" opacity={0.35} />
        <path d="M68 116l20 -12M180 200l18 -12" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.9} />
        <OG sh={[{ d: rrect(56, 94, 158, 10, 3), f: K.danger }, { d: rrect(200, 90, 10, 18, 2), f: '#fff' }]} />
        <Hand {...hl} arm={200} sleeve={K.role.helper} skin={2} />
        {/* üstten içeri sokulan belgeler */}
        <Hand {...hr} arm={200} sleeve={K.role.helper} skin={2}>
          <G x={gr[0]} y={gr[1] + 30} a={-8}>
            <OG sh={[{ d: rrect(-26, -34, 52, 66, 3), f: '#fbfaf7' }, { d: 'M-18 -18H18M-18 -8H18M-18 2H10', st: '#8a94a3', sw: 2.4 }]} />
          </G>
        </Hand>
        <Arrow from={[150, 30]} to={[150, 76]} w={6} />
      </Scene2>
    );
  },

  'sel-uyari-esya-yukari': () => {
    const shelfY = 70;
    const tv: P = [196, shelfY - 8];
    const p: PersonProps = { x: 196, y: 232, s: 1.0, ...SU, face: 'neutral', pose: { ...POSE.stand, head: -88, armB: { to: [tv[0] - 34, tv[1] - 4] }, armF: { to: [tv[0] + 34, tv[1] - 4] } } };
    return (
      <Scene2 bg="indoor" gy={206}>
        <path d="M0 148H320" stroke={K.water} stroke-width={3.4} stroke-dasharray="10 7" />
        <Drop x={24} y={134} s={0.9} />
        {/* yüksek raf */}
        <OG sh={[{ d: rrect(40, shelfY, 230, 8, 1), f: K.wood }, { d: 'M60 86L60 100L74 86Z', f: shade(K.wood, 0.2) }, { d: 'M246 86L246 100L232 86Z', f: shade(K.wood, 0.2) }]} />
        {/* belge kutusu rafta */}
        <OG sh={[{ d: rrect(60, shelfY - 34, 52, 34, 2), f: '#d9a13a' }, { d: rrect(60, shelfY - 40, 56, 8, 2), f: shade('#d9a13a', 0.12) }, { d: rrect(76, shelfY - 24, 20, 10, 2), f: '#fff', ln: true }]} />
        {/* televizyon (rafa konuyor) */}
        <G x={tv[0]} y={tv[1]} a={0}>
          <OG sh={[{ d: rrect(-48, -50, 96, 52, 4), f: '#2f3542' }, { d: rrect(-43, -45, 86, 42, 2), f: '#3d5a7a' }, { d: 'M-34 -36l14 -6', st: '#fff', sw: 2 }]} />
        </G>
        <Person {...p} />
        {/* rulo halı */}
        <OG sh={[{ d: capsule([30, 214], 12, [128, 214], 12), f: '#c6574e' }, { d: ell([128, 214], 6, 12), f: '#e8a08a' }, { d: ell([128, 214], 2.5, 5), f: '#c6574e', ln: true }]} />
        <path d="M50 204v20M76 204v20M102 204v20" stroke={shade('#c6574e', 0.2)} stroke-width={2} />
        <Arrow from={[284, 136]} to={[284, 84]} w={6} />
      </Scene2>
    );
  },
};
