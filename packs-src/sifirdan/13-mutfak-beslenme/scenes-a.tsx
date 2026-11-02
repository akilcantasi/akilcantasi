// Sıfırdan paketi sahneleri (a): Mutfak, beslenme ve ilaçsız sağlık. Bkz. docs/agents/SIFIRDAN_CIZIM.md
// İlaç ve ilaç kutusu çizilmez. Bebekte bardakla besleme gösterilir; biberon yalnız "yasak" işaretiyle.
// Zayıf çocuk tam boy çizilmez: kol çevresi şeridi ve ayak yakın planı yeterli.
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, Bed, Bottle, Campfire, Chair, Door, Flame, Hand, K, Label, No, OG, OW, Ok, Person, POSE, Pot, Rock,
  Scene2, Table, Timer, Tree, Waves, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═══════════════════════ OYUNCU KADROSU ═══════════════════════ */
// Rehber başına bir kişi (ya da çift); bir rehberin bütün sahnelerinde aynı kişi görünür.
const CAST = {
  // Yabani mutfak rehberleri: aşçı kadın (yeşil uzun kollu üst, topuz saç)
  asci: { who: 'woman', skin: 1, hair: 'bun', hairC: K.hair.dark, top: K.role.bystander3, sleeve: 'long', bottom: 'longskirt', bottomC: '#6b5a7a' } as const,
  // Kalori ve stok: ambar sorumlusu (bıyıklı, hardal üst)
  ambar: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, top: K.role.bystander2, bottomC: K.pants.brown, mustache: true } as const,
  // Protein açlığı: avcı (kumral, kiremit üst)
  avci: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.brown, top: K.role.bystander4, bottomC: K.pants.khaki, sleeve: 'long' } as const,
  // Açlık sonrası beslenme: bakıcı kadın + hasta adam
  bakici: { who: 'woman', skin: 2, hair: 'scarf', hairC: '#3f7f8a', top: K.role.helper, sleeve: 'long', bottomC: K.pants.dark } as const,
  hasta: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.grey, top: K.role.victim, sleeve: 'long', bottomC: K.pants.grey } as const,
  // Ağır işte su: işçi (koyu ten, kiremit üst) + ikinci işçi kadın
  isci: { who: 'man', skin: 3, hair: 'short', hairC: K.hair.black, top: K.role.bystander4, bottomC: K.pants.denim } as const,
  isci2: { who: 'woman', skin: 1, hair: 'scarf', hairC: '#c9a24a', top: K.role.bystander3, sleeve: 'long', bottomC: K.pants.dark } as const,
  // Bebek/çocuk ve mama: anne (mor üst, başörtülü) + bebek
  anne: { who: 'woman', skin: 1, hair: 'scarf', hairC: '#8a5a9a', top: K.role.bystander, sleeve: 'long', bottom: 'longskirt', bottomC: '#4a5a7a' } as const,
  // Diyabet: orta yaşlı adam + eşi
  diyabet: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.grey, top: K.role.victim, bottomC: K.pants.navy, mustache: true } as const,
  diyabetEs: { who: 'woman', skin: 1, hair: 'bun', hairC: K.hair.grey, top: K.role.bystander4, sleeve: 'long', bottom: 'skirt', bottomC: K.pants.brown } as const,
  // Tansiyon: kadın (gri topuz, kiremit)
  tansiyon: { who: 'woman', skin: 2, hair: 'bun', hairC: K.hair.grey, top: K.role.bystander2, sleeve: 'long', bottom: 'skirt', bottomC: K.pants.dark } as const,
  // Astım: kız çocuk
  astim: { who: 'girl', skin: 0, hair: 'ponytail', hairC: K.hair.auburn, top: K.role.bystander3, bottomC: K.pants.denim } as const,
  // Gözlük: yaşlı kadın
  gozluk: { who: 'oldwoman', skin: 1, hairC: '#7a6aa8', top: K.role.bystander, sleeve: 'long' } as const,
  // Diş: yaşlı adam
  dis: { who: 'oldman', skin: 2, top: K.role.bystander2, sleeve: 'long', bottomC: K.pants.brown } as const,
  // Uyku: adam
  uyku: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.dark, top: K.role.victim, sleeve: 'long', bottomC: K.pants.dark } as const,
};
// Yakın plan eller (kadro ile aynı ten ve kol rengi)
const HA = { skin: 1, sleeve: K.role.bystander3 } as const; // aşçı
const HM = { skin: 2, sleeve: K.role.bystander2 } as const; // ambar
const HV = { skin: 0, sleeve: K.role.bystander4 } as const; // avcı
const HB = { skin: 2, sleeve: K.role.helper } as const; // bakıcı / ölçen sağlık gönüllüsü
const HN = { skin: 1, sleeve: K.role.bystander } as const; // anne
const HD = { skin: 1, sleeve: K.role.victim } as const; // diyabet adam
const HT = { skin: 2, sleeve: K.role.bystander2 } as const; // tansiyon kadın
const HS = { skin: 2, sleeve: K.role.bystander4 } as const; // sıtma/astım evi (ev halkı)
const HG = { skin: 1, sleeve: K.role.bystander } as const; // gözlük (yaşlı kadın)

/* ═══════════════════════ MALZEME RENKLERİ (paket geneli) ═══════════════════════ */
const M = {
  metal: '#8e99a6',
  metalD: '#6f7a87',
  wood: '#b77f50',
  woodL: '#d6a774',
  stone: '#aaa69d',
  water: K.water,
  glass: '#dcecf2',
  clay: '#c27a4e',
  flour: '#f4efe2',
  barley: '#d9c08f',
  corn: '#f0c23a',
  cornD: '#d9a21f',
  bulgur: '#d8b26a',
  lentil: '#a8603a',
  bean: '#efe3c8',
  chick: '#e2c48c',
  acorn: '#8a5a32',
  acornD: '#5c3a1e',
  rose: '#d8452e', // kuşburnu
  puree: '#ec7a2a',
  nettle: '#3f8a3e',
  green: '#5aa84f',
  young: '#9bd36a',
  soup: '#7fa64a',
  dough: '#f2dcb0',
  crust: '#d49a52',
  cheese: '#fbf7ea',
  oil: '#f2c94c',
  salt: '#fbfaf7',
  sugar: '#fdfbf5',
  milk: '#fbf8ef',
  meat: '#c9736a',
  meatPink: '#e9a0a0',
  meatW: '#f6efe4',
  crayLive: '#5c5a3a',
  crayRed: '#d8432c',
  snail: '#b88a52',
  snailBody: '#a49480',
  hay: '#e2c66a',
  hayD: '#c4a646',
  cloth: '#f4f1ea',
  sack: '#d9c49a',
  net: '#f3f6f8',
  rice: '#f7f3e8',
  egg: '#f6e27a',
  cup: '#e8eef2',
  glove: '#5d93d6',
};

/* ═══════════════════════ YARDIMCILAR ═══════════════════════ */
const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const tr = (x: number, y: number, s = 1, a = 0, fl = false) => `translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${fl ? -s : s} ${s})`;
const poly = (ps: P[]) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
const line = (ps: P[]) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
let uid = 0;
const nid = () => 'sfmb' + ++uid;

/** Taşınmış/ölçeklenmiş dış hatlı şekil grubu */
function Gx({ x, y, s = 1, a = 0, flip, sh }: { x: number; y: number; s?: number; a?: number; flip?: boolean; sh: Sh[] }) {
  return (
    <g transform={tr(x, y, s, a, flip)}>
      <OG sh={sh} ow={OW / s} />
    </g>
  );
}
function G({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) {
  return <g transform={tr(x, y, s, a)}>{children}</g>;
}
/** El bileğini, elin verilen noktası hedefe gelecek şekilde konumlar. */
function handAt<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}
/** Eldiven filtresi (ten rengini maviye çevirir) */
function GloveDefs() {
  return (
    <defs>
      <filter id="sfmb-glove" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0.18 0.33 0.05 0 0  0.27 0.5 0.08 0 0  0.38 0.7 0.12 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  );
}
/** Eldivenli ayrıntılı el (önkol kumaşlı, el ve bilek mavi eldivenli) */
function GHand(p: HandProps) {
  return (
    <g>
      <Hand {...p} />
      <g filter="url(#sfmb-glove)">
        <Hand {...p} arm={22} sleeve={undefined} />
      </g>
    </g>
  );
}
/** Kişinin ellerine eldiven (rig ile) */
function Gloves({ pts, s = 1 }: { pts: P[]; s?: number }) {
  return <OG sh={pts.map((h) => ({ d: ell(h, 6.5 * s, 7.5 * s), f: M.glove }))} />;
}

/** Kalın, dış hatlı çizgi (sap, çubuk, tel) */
function Rod({ d, w = 4, c = M.wood }: { d: string; w?: number; c?: string }) {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={w + 3} />
      <path d={d} stroke={c} stroke-width={w} />
    </g>
  );
}
/** Yaprak yolu: taban (0,0), uç (len,0). teeth: diş sayısı */
function leafD(len: number, w: number, teeth = 0, shape = 0.8): string {
  const n = teeth ? teeth * 2 : 10;
  const up: P[] = [], lo: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let hw = w * Math.sin(Math.PI * Math.pow(t, shape));
    if (teeth && i % 2 === 1) hw *= 1.22;
    up.push([t * len, -hw]);
    lo.push([t * len, hw]);
  }
  const pts = [...up, ...lo.reverse().slice(1, -1)];
  return teeth ? poly(pts) : smooth(pts, true);
}
function Lf({ x, y, a = 0, len = 30, w = 9, c = M.green, teeth = 0, shape = 0.8, vein = true }: { x: number; y: number; a?: number; len?: number; w?: number; c?: string; teeth?: number; shape?: number; vein?: boolean }) {
  return (
    <g transform={tr(x, y, 1, a)}>
      <OG sh={[{ d: leafD(len, w, teeth, shape), f: c }, ...(vein ? [{ d: `M2 0L${f1(len * 0.85)} 0`, st: shade(c, 0.3), sw: 1.2 }] : [])]} />
    </g>
  );
}
function Stem({ pts, w = 3, c = M.nettle }: { pts: P[]; w?: number; c?: string }) {
  return <Rod d={smooth(pts)} w={w} c={c} />;
}
/** Isırgan bitkisi (dik, karşılıklı dişli yapraklar, tepede körpe yapraklar) */
function Nettle({ x, y, h = 150, s = 1 }: { x: number; y: number; h?: number; s?: number }) {
  const n = 4;
  return (
    <g transform={tr(x, y, s)}>
      <Stem pts={[[0, 0], [2, -h * 0.5], [0, -h]]} w={4} />
      {Array.from({ length: n }, (_, i) => {
        const yy = -h * (0.2 + i * 0.19);
        const L = 44 - i * 6;
        return (
          <g key={i}>
            <Lf x={1} y={yy} a={-160} len={L} w={L * 0.36} teeth={7} c={M.nettle} />
            <Lf x={1} y={yy} a={-20} len={L} w={L * 0.36} teeth={7} c={M.nettle} />
          </g>
        );
      })}
      <Lf x={0} y={-h + 6} a={-130} len={20} w={7} teeth={5} c={M.young} />
      <Lf x={0} y={-h + 6} a={-50} len={20} w={7} teeth={5} c={M.young} />
      <Lf x={0} y={-h + 4} a={-90} len={18} w={6} teeth={4} c={M.young} />
    </g>
  );
}
/** Ebegümeci yaprağı (yuvarlak, dalgalı kenar). x,y merkez */
function Mallow({ x, y, r = 22, c = M.green, a = 0, spots = false }: { x: number; y: number; r?: number; c?: string; a?: number; spots?: boolean }) {
  const pts: P[] = Array.from({ length: 24 }, (_, i) => {
    const t = (i / 24) * Math.PI * 2;
    const notch = Math.abs(Math.sin(t / 2 - Math.PI / 4 + Math.PI / 4)) < 0.1 ? 0.62 : 1;
    const rr = r * (i % 2 ? 0.92 : 1) * notch;
    return [Math.cos(t + Math.PI / 2) * rr, Math.sin(t + Math.PI / 2) * rr * 0.94];
  });
  return (
    <g transform={tr(x, y, 1, a)}>
      <OG sh={[
        { d: smooth(pts, true), f: c },
        ...[-150, -120, -90, -60, -30].map((d) => ({ d: line([[0, r * 0.45], pol([0, r * 0.45], d, r * (0.95 - Math.abs(d + 90) * 0.002))]), st: shade(c, 0.3), sw: 1.2 })),
      ]} />
      {spots && [[-8, -4], [6, -10], [10, 4], [-4, 8], [-12, -12]].map(([sx, sy], i) => <circle key={i} cx={sx * r / 22} cy={sy * r / 22} r={2.6 * r / 22} fill="#b5652a" stroke={shade('#b5652a', 0.3)} stroke-width={0.6} />)}
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
      <circle cx={x} cy={y} r={r} fill="#ffd23f" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}
/** Ay (hilal) */
function Moon({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return <Gx x={x} y={y} sh={[{ d: `M0 ${-r}A${r} ${r} 0 1 0 0 ${r}A${f1(r * 0.62)} ${r} 0 1 1 0 ${-r}Z`, f: '#f4e7a6' }]} />;
}
/** Uyarı üçgeni */
function Warn({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <OG sh={[{ d: `M${x} ${y - r}L${x + r * 1.1} ${y + r * 0.8}H${x - r * 1.1}Z`, f: '#ffd23f' }]} />
      <path d={`M${x} ${y - r * 0.4}V${y + r * 0.25}`} stroke={K.out} stroke-width={r * 0.2} stroke-linecap="round" />
      <circle cx={x} cy={y + r * 0.55} r={r * 0.11} fill={K.out} />
    </g>
  );
}
/** Sivrisinek (yan). x,y gövde ortası */
function Mosq({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <g stroke={K.out} stroke-width={1.1} fill="none" stroke-linecap="round">
        <path d="M-2 2l-5 9M1 2l-1 10M4 2l3 9" />
        <path d="M8 -1l9 3" stroke-width={1.3} />
      </g>
      <ellipse cx={-2} cy={-6} rx={7} ry={3} fill="#dfe9f2" opacity={0.85} stroke={K.out} stroke-width={0.8} transform="rotate(-30 -2 -6)" />
      <path d="M-11 1Q0 -3 8 -1Q0 3 -11 1Z" fill="#4a4048" stroke={K.out} stroke-width={1} />
      <circle cx={8} cy={-1} r={2.2} fill="#4a4048" stroke={K.out} stroke-width={0.8} />
    </g>
  );
}
/** İki panelli karşılaştırma zemini */
function Panels({ split = 160, f = '#f7f4ec' }: { split?: number; f?: string }) {
  return (
    <g>
      <rect x={10} y={10} width={split - 15} height={220} rx={12} fill={f} stroke={K.out} stroke-width={1.5} />
      <rect x={split + 5} y={10} width={305 - split} height={220} rx={12} fill={f} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}
/** Köşe kartı (küçük ek sahne). children kırpılır. */
function Inset({ x, y, w, h, children, f = '#f7f4ec' }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; f?: string }) {
  const id = nid();
  return (
    <g>
      <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={10} /></clipPath></defs>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={f} />
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={K.out} stroke-width={1.6} />
    </g>
  );
}
/** Ölçü çizgisi (uçlarda çentik, ortada beyaz etiket) */
function Dim({ a, b, text, size = 13, off = [0, 0] }: { a: P; b: P; text: string; size?: number; off?: P }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  const t1 = [pol(a, ang + 90, 6), pol(a, ang - 90, 6)];
  const t2 = [pol(b, ang + 90, 6), pol(b, ang - 90, 6)];
  const m = lerp(a, b, 0.5);
  return (
    <g>
      <g stroke={K.ink} stroke-width={1.8} stroke-linecap="round">
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        <line x1={t1[0][0]} y1={t1[0][1]} x2={t1[1][0]} y2={t1[1][1]} />
        <line x1={t2[0][0]} y1={t2[0][1]} x2={t2[1][0]} y2={t2[1][1]} />
      </g>
      <Label x={m[0] + off[0]} y={m[1] + off[1]} text={text} size={size} bg={K.white} />
    </g>
  );
}

/* ─────────── kaplar ve mutfak aletleri ─────────── */
/** Tencere (yandan). x,y taban ortası. fill: içerik rengi (ağız elipsi) */
function PotX({ x, y, w = 96, h = 62, c = M.metal, fill = K.water, boil = false, steam = false, lid = false, s = 1, children }: { x: number; y: number; w?: number; h?: number; c?: string; fill?: string | null; boil?: boolean; steam?: boolean; lid?: boolean; s?: number; children?: ComponentChildren }) {
  const hw = w / 2;
  const ry = Math.max(4, w * 0.09);
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: capsule([-hw - 10, -h + 10], 3.5, [-hw + 2, -h + 10], 3.5), f: shade(c, 0.2) },
        { d: capsule([hw - 2, -h + 10], 3.5, [hw + 10, -h + 10], 3.5), f: shade(c, 0.2) },
        { d: `M${-hw} ${-h}H${hw}L${hw - 2} -4Q${hw - 2} 0 ${hw - 6} 0H${-hw + 6}Q${-hw + 2} 0 ${-hw + 2} -4Z`, f: c },
        { d: `M${hw * 0.45} ${-h}H${hw}L${hw - 2} -4Q${hw - 2} 0 ${hw - 6} 0H${hw * 0.45}Z`, f: shade(c, 0.14), no: true },
        { d: ell([0, -h], hw, ry), f: fill ?? shade(c, 0.45) },
      ]} />
      {children}
      {boil && (
        <g fill={tint(fill ?? K.water, 0.5)} stroke={shade(fill ?? K.water, 0.2)} stroke-width={0.8}>
          {[-0.6, -0.25, 0.1, 0.45, 0.7].map((t, i) => <circle key={i} cx={t * hw} cy={-h + (i % 2 ? 1 : -1.5)} r={2.4 + (i % 3)} />)}
        </g>
      )}
      {steam && (
        <g fill="none" stroke="#fff" stroke-width={2.6 / s} stroke-linecap="round" opacity={0.95}>
          {[-0.4, 0, 0.4].map((t) => <path key={t} d={`M${t * hw} ${-h - 8}c-5 -6 5 -10 0 -17c-4 -5 3 -8 0 -12`} />)}
        </g>
      )}
      {lid && <OG ow={OW / s} sh={[{ d: `M${-hw - 3} ${-h}Q0 ${-h - 16} ${hw + 3} ${-h}Z`, f: tint(c, 0.1) }, { d: rrect(-6, -h - 16, 12, 6, 2), f: '#3b3537' }]} />}
    </g>
  );
}
/** Kase (yandan). x,y taban ortası. fill: üst yüzey rengi, pile: tepeleme yığın rengi */
function Bowl({ x, y, w = 80, h = 34, c = '#d9c7a8', fill, pile, s = 1, glass }: { x: number; y: number; w?: number; h?: number; c?: string; fill?: string; pile?: string; s?: number; glass?: boolean }) {
  const hw = w / 2;
  const sh: Sh[] = [];
  sh.push({ d: `M${-hw} ${-h}Q${-hw} ${-h * 0.2} ${-hw * 0.45} -3H${hw * 0.45}Q${hw} ${-h * 0.2} ${hw} ${-h}Z`, f: c, op: glass ? 0.8 : undefined });
  sh.push({ d: rrect(-hw * 0.4, -4, hw * 0.8, 4, 1.5), f: shade(c, 0.15) });
  sh.push({ d: ell([0, -h], hw, Math.max(3.5, w * 0.08)), f: fill ?? shade(c, 0.3) });
  if (pile) sh.push({ d: `M${-hw * 0.9} ${-h + 1}Q${-hw * 0.5} ${-h - hw * 0.62} 0 ${-h - hw * 0.5}Q${hw * 0.5} ${-h - hw * 0.62} ${hw * 0.9} ${-h + 1}Q0 ${-h + 6} ${-hw * 0.9} ${-h + 1}Z`, f: pile });
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={sh} />
    </g>
  );
}
/** Bardak (şeffaf, yandan). x,y taban ortası */
function Glass({ x, y, w = 30, h = 40, fill = K.water, lv = 0.7, s = 1, op = 0.8 }: { x: number; y: number; w?: number; h?: number; fill?: string | null; lv?: number; s?: number; op?: number }) {
  const hw = w / 2;
  const top = -h, wl = -h * lv;
  const k = (yy: number) => hw - (hw * 0.18 * (yy - top)) / h; // tabana doğru daralır
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[{ d: `M${-hw} ${top}H${hw}L${hw * 0.82} 0H${-hw * 0.82}Z`, f: M.glass, op: 0.85 }]} />
      {fill && <path d={`M${-k(wl)} ${f1(wl)}H${k(wl)}L${hw * 0.82 - 1} -1H${-hw * 0.82 + 1}Z`} fill={fill} opacity={op} />}
      <path d={`M${-hw + 5} ${top + 5}L${-hw * 0.82 + 5} -6`} stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.8} />
      <path d={`M${-hw} ${top}H${hw}L${hw * 0.82} 0H${-hw * 0.82}Z`} fill="none" stroke={K.out} stroke-width={OW / s} />
    </g>
  );
}
/** Tahta kaşık. x,y = kaşık çanağı ortası, a = sapın yönü */
function Spoon({ x, y, a = -60, L = 80, s = 1, c = M.woodL, fill }: { x: number; y: number; a?: number; L?: number; s?: number; c?: string; fill?: string }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={[
        { d: capsule([8, 0], 2.6, [L, 0], 3.4), f: c },
        { d: ell([0, 0], 11, 7), f: c },
        ...(fill ? [{ d: ell([-1, 0], 8, 4.6), f: fill }] : []),
      ]} />
    </g>
  );
}
/** Metal çay/yemek kaşığı (yan) — çanak x,y; a sap yönü */
function TSpoon({ x, y, a = 0, s = 1, fill, heap = 0 }: { x: number; y: number; a?: number; s?: number; fill?: string; heap?: number }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={[
        { d: capsule([10, -1], 1.8, [58, -4], 2.6), f: '#c3ccd6' },
        { d: `M-12 -2Q-12 6 0 6Q10 6 12 -2Z`, f: '#c3ccd6' },
        ...(fill ? [{ d: `M-11 -2Q0 ${-2 - heap} 11 -2Z`, f: fill }] : []),
      ]} />
    </g>
  );
}
/** Kesme tahtası (yukarıdan). x,y sol üst */
function Board({ x, y, w = 220, h = 130 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 12), f: '#d9a86c' }, { d: circ([x + w - 16, y + 16], 5), f: shade('#d9a86c', 0.25) }]} />
      <g stroke={shade('#d9a86c', 0.15)} stroke-width={1.2}>
        {[0.25, 0.5, 0.75].map((t) => <path key={t} d={`M${x + 14} ${y + h * t}H${x + w - 30}`} />)}
      </g>
    </g>
  );
}
/** Mutfak bıçağı. x,y = sap ucu, a yön (0 = sağa) */
function Knife({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      { d: rrect(0, -4, 26, 8, 3), f: '#6b4a32' },
      { d: 'M26 -4H58Q66 -2 70 0Q62 4 26 4Z', f: '#c3ccd6' },
      { d: 'M28 -1H60', st: tint('#c3ccd6', 0.5), sw: 1.4 },
    ]} />
  );
}
/** Ocak: taş yığını + alev; tencere y - 20·s üstüne oturur. x,y taban ortası */
function Hearth({ x, y, w = 110, s = 1, fire = true, embers = false }: { x: number; y: number; w?: number; s?: number; fire?: boolean; embers?: boolean }) {
  const hw = w / 2;
  return (
    <g transform={tr(x, y, s)}>
      {fire && <Flame x={-12} y={-2} s={0.62} />}
      {fire && <Flame x={12} y={-2} s={0.55} />}
      {fire && <Flame x={0} y={-2} s={0.75} />}
      {embers && (
        <g>
          {[-16, -6, 4, 14].map((ex, i) => <ellipse key={ex} cx={ex} cy={-5 - (i % 2) * 2} rx={6} ry={4} fill={i % 2 ? '#e2452b' : '#ff7b1c'} stroke={shade('#e2452b', 0.3)} stroke-width={1} />)}
        </g>
      )}
      <OG ow={OW / s} sh={[
        { d: ell([-hw + 10, -10], 14, 11), f: M.stone },
        { d: ell([-hw + 14, -26], 12, 9), f: tint(M.stone, 0.1) },
        { d: ell([hw - 10, -10], 14, 11), f: M.stone },
        { d: ell([hw - 14, -26], 12, 9), f: tint(M.stone, 0.1) },
      ]} />
    </g>
  );
}
/** Sac (kubbeli). x,y kubbe tabanı ortası; üst yüzey y - 14 */
function Sac({ x, y, w = 150 }: { x: number; y: number; w?: number }) {
  const hw = w / 2;
  return <OG sh={[{ d: `M${-hw + x} ${y}Q${x} ${y - 30} ${hw + x} ${y}Q${x} ${y - 20} ${-hw + x} ${y}Z`, f: '#4a4e57' }, { d: `M${x - hw * 0.6} ${y - 9}Q${x} ${y - 22} ${x + hw * 0.6} ${y - 9}`, st: '#7a808c', sw: 2 }]} />;
}
/** Tava/tepsi (yandan, sığ). x,y taban ortası */
function Tray({ x, y, w = 160, h = 14, c = '#7d8692', fill }: { x: number; y: number; w?: number; h?: number; c?: string; fill?: string }) {
  const hw = w / 2;
  return (
    <OG sh={[
      ...(fill ? [{ d: `M${x - hw + 4} ${y - h + 2}Q${x} ${y - h - 6} ${x + hw - 4} ${y - h + 2}Z`, f: fill }] : []),
      { d: `M${x - hw} ${y - h}H${x + hw}L${x + hw - 8} ${y}H${x - hw + 8}Z`, f: c },
    ]} />
  );
}
/** Çuval (önden). x,y taban ortası */
function Sack({ x, y, w = 60, h = 70, c = M.sack, label, top = M.flour }: { x: number; y: number; w?: number; h?: number; c?: string; label?: string; top?: string }) {
  const hw = w / 2;
  return (
    <g>
      <OG sh={[
        { d: `M${x - hw} ${y - 4}Q${x - hw - 6} ${y - h * 0.6} ${x - hw + 4} ${y - h}H${x + hw - 4}Q${x + hw + 6} ${y - h * 0.6} ${x + hw} ${y - 4}Q${x} ${y + 3} ${x - hw} ${y - 4}Z`, f: c },
        { d: ell([x, y - h], hw - 4, 6), f: top },
        { d: `M${x - hw + 8} ${y - h * 0.55}Q${x} ${y - h * 0.5} ${x + hw - 8} ${y - h * 0.55}`, st: shade(c, 0.25), sw: 1.4 },
      ]} />
      {label && <text x={x} y={y - h * 0.22} text-anchor="middle" font-size={label.length > 6 ? 8.5 : 11} font-weight={700} fill={shade(c, 0.6)}>{label}</text>}
    </g>
  );
}
/** Defter (açık, yukarıdan eğik). x,y merkez */
function Notebook({ x, y, s = 1, a = 0, children }: { x: number; y: number; s?: number; a?: number; children?: ComponentChildren }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={[{ d: rrect(-42, -28, 84, 56, 3), f: '#f7f3e6' }, { d: 'M0 -28V28', st: shade('#f7f3e6', 0.35), sw: 1.4 }]} />
      <g stroke="#b9c7d6" stroke-width={1}>{[-14, -4, 6, 16].map((yy) => <path key={yy} d={`M-36 ${yy}H-6M6 ${yy}H36`} />)}</g>
      {children}
    </g>
  );
}
/** Terazi (iki kefeli, önden). x,y taban ortası */
function Balance({ x, y, s = 1, tilt = 0, left, right }: { x: number; y: number; s?: number; tilt?: number; left?: ComponentChildren; right?: ComponentChildren }) {
  const L: P = pol([0, -90], 180 + tilt, 58), Rr: P = pol([0, -90], tilt, 58);
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: 'M-26 0H26L18 -10H-18Z', f: M.metalD },
        { d: rrect(-4, -92, 8, 84, 2), f: M.metal },
        { d: capsule(L, 3, Rr, 3), f: M.metalD },
        { d: circ([0, -92], 6), f: '#e2c35a' },
      ]} />
      {[L, Rr].map((p, i) => (
        <g key={i}>
          <path d={`M${p[0]} ${p[1]}L${p[0] - 26} ${p[1] + 44}M${p[0]} ${p[1]}L${p[0] + 26} ${p[1] + 44}`} stroke={K.out} stroke-width={1.4} />
          {i === 0 ? left && <G x={p[0]} y={p[1] + 44}>{left}</G> : right && <G x={p[0]} y={p[1] + 44}>{right}</G>}
          <OG ow={OW / s} sh={[{ d: `M${p[0] - 32} ${p[1] + 44}H${p[0] + 32}Q${p[0] + 26} ${p[1] + 56} ${p[0]} ${p[1] + 56}Q${p[0] - 26} ${p[1] + 56} ${p[0] - 32} ${p[1] + 44}Z`, f: '#c9b071' }]} />
        </g>
      ))}
    </g>
  );
}
/** Yığın (yandan). x,y taban ortası */
function Heap({ x, y, w = 60, h = 26, c = M.flour, dots }: { x: number; y: number; w?: number; h?: number; c?: string; dots?: string }) {
  return (
    <g>
      <OG sh={[{ d: `M${x - w / 2} ${y}Q${x - w * 0.2} ${y - h * 1.3} ${x} ${y - h}Q${x + w * 0.2} ${y - h * 1.3} ${x + w / 2} ${y}Z`, f: c }]} />
      {dots && Array.from({ length: Math.round(w / 6) }, (_, i) => {
        const t = (i * 0.618) % 1;
        const px = x - w * 0.35 + t * w * 0.7;
        const py = y - 4 - ((i * 7) % Math.max(4, h * 0.7));
        return <circle key={i} cx={px} cy={py} r={1.6} fill={dots} />;
      })}
    </g>
  );
}
/** Kuşburnu meyvesi (oval kırmızı, uçta kuru çanak) */
function Rosehip({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return <Gx x={x} y={y} s={s} a={a} sh={[{ d: ell([0, 0], 6, 8.5), f: M.rose }, { d: 'M-3 -8L0 -12L3 -8', st: K.out, sw: 1.4 }, { d: 'M-2.5 -3Q-3 2 -1 5', st: tint(M.rose, 0.45), sw: 1.4 }]} />;
}
/** Palamut (meşe) */
function Acorn({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return <Gx x={x} y={y} s={s} a={a} sh={[{ d: ell([0, 3], 7, 9.5), f: '#b07a3e' }, { d: 'M-8.5 -3Q0 -12 8.5 -3Q0 0 -8.5 -3Z', f: '#7a5a3a' }, { d: capsule([0, -9], 1.2, [1, -13], 1.2), f: '#7a5a3a' }]} />;
}
/** Kerevit (yukarıdan, başı yukarı). x,y gövde ortası */
function Crayfish({ x, y, s = 1, a = 0, c = M.crayLive }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  const dk = shade(c, 0.22);
  return (
    <g transform={tr(x, y, s, a)}>
      <g stroke={K.out} stroke-width={1.6 / s} fill="none">
        <path d="M-4 -30Q-20 -60 -34 -70M4 -30Q20 -60 34 -70" />
        {[-8, 0, 8].map((dy) => <path key={dy} d={`M-10 ${dy - 6}l-14 ${dy * 0.4 + 4}M10 ${dy - 6}l14 ${dy * 0.4 + 4}`} stroke-width={2.6 / s} />)}
      </g>
      <OG ow={OW / s} sh={[
        { d: capsule([-10, -22], 4, [-24, -40], 5), f: c },
        { d: capsule([10, -22], 4, [24, -40], 5), f: c },
        { d: smooth([[-24, -40], [-34, -54], [-30, -74], [-22, -76], [-20, -60], [-16, -48]], true), f: dk },
        { d: smooth([[24, -40], [34, -54], [30, -74], [22, -76], [20, -60], [16, -48]], true), f: dk },
        { d: 'M-11 -6Q-13 -30 0 -36Q13 -30 11 -6Z', f: c },
        ...[0, 1, 2, 3].map((i) => ({ d: rrect(-10 + i * 1.2, -6 + i * 9, 20 - i * 2.4, 10, 4), f: i % 2 ? dk : c })),
        { d: 'M-4 30L-14 44H14L4 30Z', f: dk },
      ]} />
      <circle cx={-4} cy={-31} r={1.8} fill={K.out} />
      <circle cx={4} cy={-31} r={1.8} fill={K.out} />
    </g>
  );
}
/** Salyangoz (yandan, sağa gider). x,y taban ortası */
function Snail({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={tr(x, y, s, 0, flip)}>
      <OG ow={OW / s} sh={[
        { d: 'M-22 0Q-26 -4 -16 -6H14Q22 -8 24 -16L26 -22Q30 -20 29 -12Q28 -2 18 0Z', f: M.snailBody },
        { d: capsule([22, -14], 1.4, [27, -27], 1.2), f: M.snailBody },
        { d: capsule([19, -12], 1.4, [21, -24], 1.2), f: M.snailBody },
        { d: circ([-2, -18], 15), f: M.snail },
      ]} />
      <path d="M-2 -18m-11 0a11 11 0 1 0 11 -11a8 8 0 1 0 6 13a4.5 4.5 0 1 0 -6 -4" fill="none" stroke={shade(M.snail, 0.4)} stroke-width={1.6 / s} />
    </g>
  );
}

/* ═══════════════════════ SAHNELER: kapaklar ve yabani mutfak ═══════════════════════ */
const S1: Record<string, () => JSX.Element> = {
  // Kapak: taş ocakta buharı tüten tencere; önde sepet (ısırgan, ebegümeci, kuşburnu, palamut), tahtada kerevit
  'sf-mb-mutfak-kapak': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <Tree x={286} y={192} s={0.95} />
      <Hearth x={150} y={196} w={120} s={1.05} />
      <PotX x={150} y={170} w={100} h={60} fill={M.soup} steam boil />
      {/* sepet */}
      <g>
        <Lf x={52} y={196} a={-120} len={34} w={11} teeth={7} c={M.nettle} />
        <Lf x={62} y={194} a={-80} len={36} w={12} teeth={7} c={M.nettle} />
        <Mallow x={86} y={176} r={14} />
        <OG sh={[{ d: 'M26 196H106L98 232H34Z', f: '#c9a05a' }, { d: ell([66, 196], 40, 6), f: shade('#c9a05a', 0.3) }]} />
        <g stroke={shade('#c9a05a', 0.3)} stroke-width={1.4}>{[38, 52, 66, 80, 94].map((xx) => <path key={xx} d={`M${xx} 200L${xx + (66 - xx) * 0.1} 230`} />)}<path d="M30 214H102" /></g>
        <Rosehip x={46} y={192} />
        <Rosehip x={58} y={190} a={20} />
        <Rosehip x={72} y={192} a={-15} />
        <Acorn x={86} y={192} />
        <Acorn x={96} y={194} a={20} />
      </g>
      {/* tahta + kerevit */}
      <OG sh={[{ d: rrect(206, 210, 100, 18, 4), f: '#d9a86c' }]} />
      <Crayfish x={234} y={206} s={0.42} a={80} c={M.crayRed} />
      <Crayfish x={276} y={206} s={0.42} a={100} c={M.crayRed} />
    </Scene2>
  ),
  // Kapak: ambar rafı (çuvallar, yağ bidonu, tuz kavanozu), masada terazi ve defter, bir kase filizlenmiş nohut
  'sf-mb-kitlik-kapak': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: rrect(14, 104, 292, 8, 2), f: M.wood }, { d: rrect(24, 112, 8, 20, 2), f: shade(M.wood, 0.2) }, { d: rrect(288, 112, 8, 20, 2), f: shade(M.wood, 0.2) }]} />
      <Sack x={56} y={104} w={58} h={66} label="UN" />
      <Sack x={122} y={104} w={58} h={60} label="BULGUR" top={M.bulgur} />
      <Sack x={186} y={104} w={56} h={56} label="MERCİMEK" top={M.lentil} />
      <OG sh={[{ d: rrect(228, 52, 34, 52, 4), f: M.oil }, { d: rrect(238, 44, 14, 9, 2), f: '#c0603e' }]} />
      <Glass x={284} y={104} w={30} h={40} fill={M.salt} lv={0.8} op={1} />
      <Table x={40} y={226} w={240} h={56} />
      <Balance x={100} y={170} s={0.62} />
      <Notebook x={180} y={160} s={0.7} a={-4} />
      <Bowl x={248} y={170} w={56} h={22} c="#d58a5a" pile={M.chick} />
      <g>{[236, 244, 252, 260].map((xx, i) => <path key={xx} d={`M${xx} ${170 - 26 - (i % 2) * 3}q2 -7 7 -9`} stroke="#f3f0d0" stroke-width={2.2} fill="none" stroke-linecap="round" />)}</g>
    </Scene2>
  ),
  // Kapak: sabah ışığı, sineklikli pencere, cibinlikli yatak; masada su bardağı ve gözlük
  'sf-mb-saglik-kapak': () => (
    <Scene2 bg="indoor">
      <Window x={30} y={40} w={84} h={70} />
      <g stroke="#a6b2bd" stroke-width={0.8} opacity={0.9}>
        {Array.from({ length: 13 }, (_, i) => <path key={'v' + i} d={`M${33 + i * 6.3} 43V107`} />)}
        {Array.from({ length: 11 }, (_, i) => <path key={'h' + i} d={`M33 ${46 + i * 6}H111`} />)}
      </g>
      <Bed x={128} y={218} w={176} blanket="#7aa6d6" />
      {/* cibinlik */}
      <path d="M216 22L132 176H300Z" fill={M.net} opacity={0.55} stroke="#c9d3db" stroke-width={1.4} />
      <g stroke="#d5dde3" stroke-width={0.8}>{[150, 175, 200, 225, 250, 275].map((xx) => <path key={xx} d={`M216 24L${xx} 176`} />)}</g>
      <circle cx={216} cy={22} r={4} fill={M.wood} stroke={K.out} stroke-width={1.2} />
      <Table x={20} y={226} w={90} h={52} />
      <Glass x={46} y={174} w={22} h={30} lv={0.75} />
      <g transform="translate(84 170)">
        <circle cx={-8} cy={-4} r={6.5} fill="#dfeef6" stroke={K.out} stroke-width={1.8} />
        <circle cx={8} cy={-4} r={6.5} fill="#dfeef6" stroke={K.out} stroke-width={1.8} />
        <path d="M-1.5 -5h3M-14.5 -5l-6 4" stroke={K.out} stroke-width={1.8} fill="none" />
      </g>
    </Scene2>
  ),

  /* ───────── Kurbağa ve salyangoz ───────── */
  // Arındırma kovası (kesit): salyangozlar marul yaprakları üstünde, delikli kapak; yanda 7 gün yaprak+su, 3 gün yalnız su
  'sf-mb-salyangoz-kova': () => (
    <Scene2 bg="closeup">
      <g>
        <OG sh={[{ d: 'M40 74H190L178 222H52Z', f: '#7fb0d8' }]} />
        <path d="M48 82H182L171 214H59Z" fill="#eef4f8" />
        <OG sh={[{ d: smooth([[58, 214], [70, 190], [100, 196], [130, 186], [160, 194], [172, 214]], false) + 'Z', f: '#8fcf6a' }]} />
        <Lf x={70} y={206} a={-30} len={46} w={16} c="#8fcf6a" />
        <Lf x={160} y={206} a={-150} len={46} w={16} c="#a5da7c" />
        <Bowl x={150} y={212} w={30} h={10} c="#c3ccd6" fill={K.water} />
        <Snail x={92} y={196} s={0.9} />
        <Snail x={140} y={184} s={0.8} flip />
        <Snail x={110} y={150} s={0.72} />
        <path d="M86 80C70 110 66 150 70 188" stroke="#fff" stroke-width={4} opacity={0.5} fill="none" />
        {/* kapak */}
        <OG sh={[{ d: rrect(30, 52, 170, 16, 3), f: '#c99057' }]} />
        {[50, 72, 94, 116, 138, 160, 182].map((xx) => <circle key={xx} cx={xx} cy={60} r={3} fill={K.out} />)}
        <path d="M40 74H190L178 222H52Z" fill="none" stroke={K.out} stroke-width={1.6} />
      </g>
      <Inset x={212} y={36} w={96} h={80}>
        <Lf x={226} y={84} a={-35} len={38} w={13} c="#8fcf6a" />
        <path d="M282 62q-8 12 0 16q8 -4 0 -16z" fill={K.water} stroke={K.out} stroke-width={1.3} />
        <Label x={260} y={104} text="7 gün" size={13} />
      </Inset>
      <Inset x={212} y={128} w={96} h={80}>
        <path d="M260 150q-10 15 0 20q10 -5 0 -20z" fill={K.water} stroke={K.out} stroke-width={1.3} />
        <Label x={260} y={196} text="3 gün" size={13} />
      </Inset>
      <text x={260} y={124} text-anchor="middle" font-size={16} font-weight={800} fill={K.ink}>↓</text>
    </Scene2>
  ),
  // Pişmiş salyangozun eti iğneyle çıkarılıyor; kuyruktaki koyu kıvrık kısım kesilip ayrılmış (çarpı)
  'sf-mb-salyangoz-cikarma': () => {
    const pinTip: P = [150, 126];
    const pinEnd: P = [210, 74];
    const h = handAt({ a: -135, s: 0.95, pose: 'pinch' as const, side: 'R' as const }, 'pinch', lerp(pinTip, pinEnd, 0.9));
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <Board x={20} y={60} w={280} h={160} />
        {/* boş kabuk */}
        <g transform="translate(70 128) scale(1.6)">
          <OG ow={OW / 1.6} sh={[{ d: circ([0, 0], 18), f: M.snail }, { d: ell([14, 6], 6, 7), f: shade(M.snail, 0.5) }]} />
          <path d="M0 0m-13 0a13 13 0 1 0 13 -13a9 9 0 1 0 7 15a5 5 0 1 0 -7 -5" fill="none" stroke={shade(M.snail, 0.4)} stroke-width={1.2} />
        </g>
        {/* çıkan et */}
        <OG sh={[{ d: smooth([[112, 136], [128, 120], [156, 118], [182, 126], [190, 140], [170, 150], [138, 150]], true), f: M.snailBody }]} />
        <Rod d={line([pinTip, pinEnd])} w={2.4} c="#c3ccd6" />
        <GHand {...h} arm={160} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[120, 96]} to={[160, 78]} w={4} />
        {/* kesilen koyu kıvrık kısım */}
        <path d="M232 178m-10 0a10 10 0 1 0 10 -10a6 6 0 1 0 4 10" fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
        <path d="M232 178m-10 0a10 10 0 1 0 10 -10a6 6 0 1 0 4 10" fill="none" stroke="#4a3a30" stroke-width={5} stroke-linecap="round" />
        <Knife x={120} y={196} a={-6} s={0.9} />
        <Bad x={262} y={160} r={13} />
      </Scene2>
    );
  },
  // Kurbağa bacağı: içi beyaz ve donuk (onay) | içi pembe (yasak); 74°C
  'sf-mb-kurbaga-pismis': () => {
    // Bir çift kurbağa bacağı (kalçadan birleşik, ayaklar kesilmiş); öndeki baldır kesilmiş, iç rengi görünüyor
    const legs = (x: number, y: number, inner: string, skin: string) => {
      const hip: P = [x - 40, y - 4];
      const one = (dy: number, k: number): Sh[] => {
        const knee: P = [x + 6, y + dy - 10 * k];
        const ank: P = [x + 46, y + dy + 4];
        return [
          { d: capsule(knee, 6, ank, 4), f: skin },
          { d: capsule(hip, 12, knee, 7.5), f: skin },
        ];
      };
      return (
        <g>
          <OG sh={[...one(-14, 1), { d: capsule([x + 46, y - 10], 2.4, [x + 56, y - 12], 2.2), f: '#efe6d6' }]} />
          <OG sh={[...one(12, -1), { d: ell([x + 50, y + 16], 6, 7), f: inner }, { d: circ([x + 50, y + 16], 2), f: '#efe6d6' }]} />
          <OG sh={[{ d: ell([x - 14, y + 8], 12, 15), f: inner, t: `rotate(-14 ${x - 14} ${y + 8})` }, { d: circ([x - 14, y + 8], 2.6), f: '#efe6d6' }]} />
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        <Panels />
        <OG sh={[{ d: ell([86, 150], 66, 34), f: '#f6f7f9' }, { d: ell([236, 150], 66, 34), f: '#f6f7f9' }]} />
        {legs(84, 144, M.meatW, '#d9a35a')}
        {legs(234, 144, M.meatPink, '#e3b98a')}
        <Ok x={36} y={38} r={14} />
        <Bad x={288} y={38} r={14} />
        <Label x={86} y={210} text="74°C" />
      </Scene2>
    );
  },

  /* ───────── Kerevit ───────── */
  // Maşayla canlı kerevit kaynayan suya bırakılıyor; ≈5 dk
  'sf-mb-kerevit-kaynatma': () => {
    const tip: P = [168, 72];
    const h = handAt({ a: -120, s: 0.9, pose: 'fist' as const, side: 'R' as const }, 'grip', [236, 40]);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Hearth x={136} y={214} w={140} s={1.1} />
        <PotX x={136} y={188} w={126} h={74} fill={K.water} boil steam />
        <Crayfish x={tip[0] - 6} y={tip[1] + 44} s={0.62} a={-10} />
        <Rod d={line([[236, 40], tip])} w={3.4} c="#c3ccd6" />
        <Rod d={line([[236, 44], [tip[0] + 2, tip[1] + 6]])} w={3.4} c="#c3ccd6" />
        <Hand {...h} arm={160} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[104, 40]} to={[116, 96]} bend={0.1} />
        <Label x={262} y={168} text="≈5 dk" />
      </Scene2>
    );
  },
  // Pişmiş: kıpkırmızı kabuk, beyaz donuk et (onay) | gri yarı saydam et (yasak); 63°C
  'sf-mb-kerevit-pismis': () => {
    const meat = (x: number, y: number, c: string, op = 1) => (
      <g opacity={op}>
        <OG sh={[0, 1, 2].map((i) => ({ d: rrect(x - 36 + i * 24, y - 16, 26, 34, 10), f: c }))} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Panels />
        <Crayfish x={86} y={104} s={0.9} c={M.crayRed} />
        <Crayfish x={236} y={104} s={0.9} c="#7d8a7a" />
        {meat(86, 186, M.meatW)}
        {meat(236, 186, '#b9c3c4', 0.9)}
        <Ok x={36} y={38} r={14} />
        <Bad x={284} y={38} r={14} />
        <Label x={86} y={218} text="63°C" size={13} />
      </Scene2>
    );
  },
  // Kuyruk etinin sırtındaki siyah bağırsak çizgisi bıçak ucuyla çekilip çıkarılıyor
  'sf-mb-kerevit-bagirsak': () => {
    const segs = [0, 1, 2, 3, 4];
    return (
      <Scene2 bg="closeup">
        <Board x={14} y={50} w={292} h={170} />
        <OG sh={segs.map((i) => ({ d: ell([70 + i * 34, 150 - Math.sin((i / 4) * Math.PI) * 10], 24, 30 - i * 2.5), f: i % 2 ? '#f3e2d6' : M.meatW }))} />
        <g stroke="#e6a68e" stroke-width={2.2} fill="none">{segs.slice(0, 4).map((i) => <path key={i} d={`M${88 + i * 34} ${126 - Math.sin((i / 4) * Math.PI) * 10}q-4 22 0 46`} />)}</g>
        {/* siyah çizgi: solda ette, sağda dışarı çekilmiş */}
        <path d={smooth([[52, 130], [100, 118], [150, 112], [196, 120], [222, 112], [244, 90], [258, 66]])} fill="none" stroke="#2b2523" stroke-width={4.2} stroke-linecap="round" />
        <Knife x={314} y={30} a={150} s={0.9} />
        <Arrow from={[240, 140]} to={[290, 110]} w={5} />
      </Scene2>
    );
  },

  /* ───────── Isırgan ───────── */
  // Eldivenli, uzun kollu kadın ısırganın tepesindeki taze yaprakları makasla kesiyor; elinde sepet
  'sf-mb-isirgan-toplama': () => {
    const top: P = [214, 74];
    const p: PersonProps = { ...CAST.asci, x: 120, y: 224, s: 1.08, pose: { ...POSE.standSide, spine: -84, head: -76, armF: { to: [top[0] - 10, top[1] + 6] }, armB: [100, 96], face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <Tree x={36} y={194} s={0.8} kind="pine" />
        <Nettle x={232} y={222} h={150} />
        <Nettle x={278} y={224} h={120} s={0.9} />
        <Person {...p} mid={(rr) => (
          <g>
            <OG sh={[{ d: `M${rr.handB[0] - 22} ${rr.handB[1] + 4}H${rr.handB[0] + 22}L${rr.handB[0] + 16} ${rr.handB[1] + 30}H${rr.handB[0] - 16}Z`, f: '#c9a05a' }]} />
            <path d={`M${rr.handB[0] - 18} ${rr.handB[1] + 4}Q${rr.handB[0]} ${rr.handB[1] - 22} ${rr.handB[0] + 18} ${rr.handB[1] + 4}`} fill="none" stroke={K.out} stroke-width={4} />
            <path d={`M${rr.handB[0] - 18} ${rr.handB[1] + 4}Q${rr.handB[0]} ${rr.handB[1] - 22} ${rr.handB[0] + 18} ${rr.handB[1] + 4}`} fill="none" stroke="#c9a05a" stroke-width={2} />
            <Lf x={rr.handB[0] - 8} y={rr.handB[1] + 4} a={-110} len={18} w={6} teeth={4} c={M.young} />
          </g>
        )} />
        <Gloves pts={[r.handB, r.handF]} s={1.08} />
        {/* makas */}
        <g transform={tr(r.handF[0] + 4, r.handF[1] - 2, 1, -20)}>
          <path d="M0 0L22 -4M0 0L22 4" stroke={K.out} stroke-width={4.4} stroke-linecap="round" />
          <path d="M0 0L22 -4M0 0L22 4" stroke="#c3ccd6" stroke-width={2.2} stroke-linecap="round" />
        </g>
        <Arrow from={[278, 34]} to={[238, 62]} w={5} />
      </Scene2>
    );
  },
  // Kaynayan tencereye eldivenli el ısırgan yapraklarını atıyor; 1,5–2 dk, kapağı yanında
  'sf-mb-isirgan-haslama': () => {
    const h = handAt({ a: -150, s: 0.95, pose: 'open' as const, side: 'R' as const }, 'palm', [196, 64]);
    return (
      <Scene2 bg="indoor">
        <GloveDefs />
        <Hearth x={140} y={214} w={150} s={1.1} />
        <PotX x={140} y={188} w={134} h={76} fill="#6fae58" boil steam />
        <Lf x={150} y={84} a={120} len={26} w={9} teeth={5} c={M.nettle} />
        <Lf x={130} y={96} a={60} len={24} w={8} teeth={5} c={M.nettle} />
        <Lf x={168} y={100} a={100} len={22} w={8} teeth={5} c={M.nettle} />
        <GHand {...h} arm={170} sleeve={HA.sleeve} skin={HA.skin} />
        <OG sh={[{ d: 'M248 214Q278 170 308 214Z', f: tint(M.metal, 0.1) }, { d: rrect(272, 178, 12, 7, 2), f: '#3b3537' }]} />
        <Arrow from={[100, 60]} to={[118, 106]} bend={0.1} w={5} />
        <Label x={56} y={40} text="2 dk" />
      </Scene2>
    );
  },
  // Tencerede hafif koyulaşmış yeşil çorba (yukarıdan), kaşıktan kıvamlı akıyor; 15–20 dk
  'sf-mb-isirgan-corba': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: circ([146, 136], 96), f: M.metal }, { d: circ([146, 136], 84), f: M.soup }]} />
      <g fill={tint(M.soup, 0.25)}>{[[110, 110], [170, 150], [130, 170], [186, 104], [96, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + (i % 2) * 2} />)}</g>
      <g fill={M.nettle}>{[[124, 132], [160, 120], [150, 168], [106, 168], [184, 140]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={5} ry={2.6} transform={`rotate(${i * 40} ${x} ${y})`} />)}</g>
      <Spoon x={178} y={92} a={-40} L={110} s={1.1} fill={M.soup} />
      <Label x={262} y={216} text="15–20 dk" />
    </Scene2>
  ),

  /* ───────── Ebegümeci ve gözleme ───────── */
  // Genç, yuvarlak, hafif dişli yapraklar (onay) | sararmış, pas lekeli yaprak (yasak)
  'sf-mb-ebegumeci-yaprak': () => (
    <Scene2 bg="closeup">
      <Panels split={190} />
      <Mallow x={64} y={92} r={34} />
      <Mallow x={136} y={150} r={30} a={20} />
      <Mallow x={72} y={176} r={26} a={-30} c="#68b85a" />
      <Ok x={36} y={36} r={14} />
      <Mallow x={250} y={128} r={40} c="#c9b84a" spots />
      <No x={250} y={128} r={50} />
    </Scene2>
  ),
  // Yukarıdan: yufkanın yarısında yeşil iç ve peynir; el öbür yarısını kapatıyor (ok)
  'sf-mb-gozleme-ic': () => {
    const h = handAt({ a: 80, s: 0.9, pose: 'open' as const, side: 'L' as const }, 'tip', [104, 124]);
    return (
      <Scene2 bg="closeup">
        <Board x={14} y={24} w={292} h={196} />
        {/* sağ yarı: iç */}
        <OG sh={[{ d: `M160 42A80 80 0 0 1 160 202Z`, f: M.dough }]} />
        <g>
          {[[186, 92], [206, 120], [184, 152], [214, 160], [196, 76], [222, 96], [178, 122], [204, 184]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={5} fill={i % 2 ? M.nettle : M.green} transform={`rotate(${i * 50} ${x} ${y})`} stroke={shade(M.nettle, 0.3)} stroke-width={0.8} />)}
          {[[200, 104], [184, 138], [214, 140], [196, 168]].map(([x, y], i) => <rect key={i} x={x - 5} y={y - 4} width={10} height={8} rx={2} fill={M.cheese} stroke={K.out} stroke-width={1} />)}
        </g>
        {/* sol yarı kalkıp katlanıyor */}
        <OG sh={[{ d: 'M160 42Q96 50 82 122Q96 194 160 202Z', f: tint(M.dough, 0.15) }]} />
        <path d="M158 42V202" stroke={shade(M.dough, 0.3)} stroke-width={1.5} stroke-dasharray="4 4" />
        <Hand {...h} arm={150} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[96, 36]} to={[240, 40]} bend={-0.35} w={5} />
      </Scene2>
    );
  },
  // Odun ateşi üstünde sac; yarım ay gözleme tahta spatulayla çevriliyor; 2–3 dk
  'sf-mb-gozleme-sac': () => {
    const h = handAt({ a: -120, s: 0.9, pose: 'fist' as const, side: 'R' as const }, 'grip', [258, 112]);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Campfire x={150} y={214} s={1.3} />
        <OG sh={[{ d: ell([82, 200], 16, 12), f: M.stone }, { d: ell([218, 200], 16, 12), f: M.stone }]} />
        <Sac x={150} y={186} w={170} />
        {/* gözleme (yandan ince, yarım ay) */}
        <OG sh={[{ d: 'M98 166Q150 150 204 166Q150 176 98 166Z', f: M.crust }]} />
        <g fill="#9a6a32">{[118, 140, 162, 184].map((x) => <ellipse key={x} cx={x} cy={166} rx={4} ry={1.6} />)}</g>
        {/* spatula */}
        <Rod d={line([[258, 112], [196, 156]])} w={4} c={M.woodL} />
        <OG sh={[{ d: poly([[184, 154], [204, 152], [210, 164], [186, 168]]), f: M.woodL }]} />
        <Hand {...h} arm={160} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[140, 120]} to={[180, 120]} bend={-0.6} w={5} />
        <Label x={64} y={44} text="2–3 dk" />
      </Scene2>
    );
  },

  /* ───────── Palamut ───────── */
  // Oran: 800 g buğday unu + 200 g palamut unu (beşte bir)
  'sf-mb-palamut-oran': () => (
    <Scene2 bg="closeup">
      <Bowl x={98} y={170} w={130} h={40} c="#c9d2da" pile={M.flour} />
      <Bowl x={232} y={170} w={70} h={28} c="#c9d2da" pile={M.acorn} />
      <Label x={98} y={200} text="800 g" />
      <Label x={232} y={200} text="200 g" />
      <text x={180} y={150} text-anchor="middle" font-size={30} font-weight={800} fill={K.ink}>+</text>
      <g transform="translate(160 54)">
        {Array.from({ length: 5 }, (_, i) => {
          const a0 = -90 + i * 72, a1 = a0 + 72;
          const p0 = pol([0, 0], a0, 30), p1 = pol([0, 0], a1, 30);
          return <path key={i} d={`M0 0L${f1(p0[0])} ${f1(p0[1])}A30 30 0 0 1 ${f1(p1[0])} ${f1(p1[1])}Z`} fill={i === 0 ? M.acorn : M.flour} stroke={K.out} stroke-width={1.5} />;
        })}
      </g>
    </Scene2>
  ),
  // Sacda palamut parçaları kaşıkla karıştırılarak kavruluyor (açıktan koyuya); ≈30 dk; köşede simsiyah yanık (yasak)
  'sf-mb-palamut-kavurma': () => {
    const h = handAt({ a: -120, s: 0.9, pose: 'fist' as const, side: 'R' as const }, 'grip', [204, 96]);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Campfire x={124} y={216} s={1.3} />
        <OG sh={[{ d: ell([56, 202], 16, 12), f: M.stone }, { d: ell([192, 202], 16, 12), f: M.stone }]} />
        <Tray x={124} y={186} w={170} h={14} c="#4a4e57" />
        {Array.from({ length: 14 }, (_, i) => {
          const x = 54 + i * 10.5;
          const t = i / 13;
          const c = t < 0.35 ? '#c08a4e' : t < 0.7 ? '#93602f' : '#6a3f1e';
          return <ellipse key={i} cx={x} cy={170 - (i % 2) * 4} rx={6} ry={4.4} fill={c} stroke={K.out} stroke-width={1.1} />;
        })}
        <Rod d={line([[204, 96], [140, 166]])} w={4} c={M.woodL} />
        <OG sh={[{ d: ell([136, 170], 9, 5), f: M.woodL, t: 'rotate(-48 136 170)' }]} />
        <Hand {...h} arm={150} sleeve={HA.sleeve} skin={HA.skin} />
        <Label x={56} y={42} text="≈30 dk" />
        <Inset x={226} y={140} w={82} h={70}>
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={246 + (i % 3) * 18} cy={170 + Math.floor(i / 3) * 16} rx={7} ry={5} fill="#1f1a18" stroke={K.out} stroke-width={1} />)}
          <Bad x={292} y={156} r={10} />
        </Inset>
      </Scene2>
    );
  },
  // Bardağa bir kaşık dövülmüş palamut; üstüne kaynar su; 5–10 dk demlenir
  'sf-mb-palamut-kahve': () => {
    // Solda havanda dövülmüş palamut; el, tepeleme kaşıkla öğütülmüşü buharı tüten kaynar sulu bardağa döküyor
    const tip: P = [176, 108];
    const h = handAt({ a: 150, s: 0.95, pose: 'fist' as const, side: 'R' as const }, 'grip', [236, 70]);
    return (
      <Scene2 bg="closeup">
        {/* havan + tokmak */}
        <OG sh={[{ d: 'M24 170H104L94 218H34Z', f: '#b5ada2' }, { d: ell([64, 170], 40, 8), f: '#5a3a22' }, { d: capsule([74, 166], 5, [104, 116], 6), f: '#9a9187' }]} />
        <Glass x={180} y={218} w={62} h={84} fill="#5a3618" lv={0.62} op={0.95} />
        <g fill="none" stroke="#fff" stroke-width={2.6} stroke-linecap="round" opacity={0.95}>
          <path d="M166 126c-5 -7 5 -11 0 -19M190 126c-5 -7 5 -11 0 -19" />
        </g>
        <OG sh={[{ d: capsule(tip, 2.4, [236, 70], 3.2), f: '#c3ccd6' }, { d: ell([tip[0] - 4, tip[1] + 3], 11, 6.5), f: '#c3ccd6', t: `rotate(-28 ${tip[0] - 4} ${tip[1] + 3})` }]} />
        <OG sh={[{ d: ell([tip[0] - 6, tip[1] + 3], 8, 4.5), f: M.acornD, t: `rotate(-28 ${tip[0] - 6} ${tip[1] + 3})` }]} />
        <g fill={M.acornD}>{[[166, 118], [170, 126], [163, 132]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} />)}</g>
        <Hand {...h} arm={140} sleeve={HA.sleeve} skin={HA.skin} />
        <Label x={64} y={40} text="5–10 dk" />
      </Scene2>
    );
  },


  /* ───────── Kuşburnu ───────── */
  // Elek kasenin üstünde; tahta kaşık püreyi bastırıyor; çekirdekler elekte kalıyor, kaseye turuncu püre akıyor
  'sf-mb-kusburnu-elek': () => (
    <Scene2 bg="closeup">
      <Bowl x={160} y={222} w={190} h={64} c="#c9d2da" fill={M.puree} />
      <g>
        <OG sh={[{ d: 'M84 120H236Q232 178 160 182Q88 178 84 120Z', f: '#dfe4e8' }]} />
        <g stroke="#9aa6b2" stroke-width={0.9}>
          {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${92 + i * 10.5} 122V${170 - Math.abs(i - 6.5) * 3}`} />)}
          {Array.from({ length: 5 }, (_, i) => <path key={'h' + i} d={`M90 ${130 + i * 10}H230`} />)}
        </g>
        <OG sh={[{ d: smooth([[96, 128], [130, 140], [190, 140], [226, 128], [200, 152], [160, 160], [120, 152]], true), f: M.puree }]} />
        {[[120, 140], [150, 150], [176, 144], [200, 138], [138, 132]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={4} ry={2.6} fill="#e9d6a6" stroke={K.out} stroke-width={0.8} />)}
        <OG sh={[{ d: capsule([236, 120], 3, [270, 112], 4), f: M.metalD }]} />
        <ellipse cx={160} cy={120} rx={76} ry={9} fill="none" stroke={K.out} stroke-width={4} />
        <ellipse cx={160} cy={120} rx={76} ry={9} fill="none" stroke={M.metal} stroke-width={2} />
      </g>
      {/* damlalar */}
      <Spoon x={164} y={132} a={-70} L={100} s={1.05} />
      <Arrow from={[110, 26]} to={[136, 84]} w={5} />
    </Scene2>
  ),
  // Tencerenin ağzına gerili tülbentten püre süzülüyor; büyüteçte tülbentte kalan ince tüyler (onay)
  'sf-mb-kusburnu-tulbent': () => (
    <Scene2 bg="closeup">
      <PotX x={110} y={226} w={170} h={92} fill={M.puree} />
      {/* tülbent: ağzı kaplıyor, kenarları sarkıyor */}
      <OG sh={[
        { d: 'M20 134L28 170L40 140Z', f: M.cloth },
        { d: 'M200 134L192 172L180 140Z', f: M.cloth },
        { d: ell([110, 134], 94, 17), f: M.cloth },
      ]} />
      <OG sh={[{ d: ell([110, 136], 52, 9), f: M.puree }]} />
      {/* kepçe döküyor */}
      <OG sh={[{ d: 'M84 64Q114 92 146 72L142 64H88Z', f: M.metal }, { d: capsule([88, 66], 2.6, [-10, -8], 3.4), f: M.metalD }]} />
      <path d="M136 80Q130 108 120 132" stroke={K.out} stroke-width={9} fill="none" stroke-linecap="round" />
      <path d="M136 80Q130 108 120 132" stroke={M.puree} stroke-width={6} fill="none" stroke-linecap="round" />
      {/* büyüteç */}
      <g>
        <circle cx={250} cy={86} r={46} fill={M.cloth} stroke={K.out} stroke-width={4} />
        <g stroke="#d9b56a" stroke-width={1.6} stroke-linecap="round">
          {[[226, 70], [248, 62], [262, 88], [236, 98], [270, 70], [244, 112], [222, 90], [260, 110]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l${10 - (i % 3) * 4} ${4 + (i % 2) * 3}`} />)}
        </g>
        <g stroke="#c9d3db" stroke-width={0.6}>{[214, 226, 238, 250, 262, 274, 286].map((x) => <path key={x} d={`M${x} 44V128`} />)}</g>
        <circle cx={250} cy={86} r={46} fill="none" stroke={K.out} stroke-width={4} />
        <Rod d={line([[218, 120], [196, 150]])} w={8} c="#6b4a32" />
        <Ok x={290} y={136} r={13} />
      </g>
    </Scene2>
  ),
  // Soğuk tabakta marmelat; parmak ucuyla itince yüzeyi kırışıyor (onay)
  'sf-mb-marmelat-tabak': () => {
    const h = handAt({ a: -100, s: 1.1, pose: 'point' as const, side: 'R' as const }, 'tip', [188, 128]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: circ([150, 128], 100), f: '#f6f7f9' }, { d: circ([150, 128], 72), f: '#eef0f3' }]} />
        <OG sh={[{ d: smooth([[96, 120], [116, 96], [150, 88], [184, 98], [200, 124], [188, 154], [150, 166], [112, 156]], true), f: '#e9822e' }]} />
        <g fill="none" stroke={shade('#e9822e', 0.3)} stroke-width={1.8} stroke-linecap="round">
          <path d="M172 112q-6 16 0 30M162 108q-7 20 0 40M152 110q-6 18 0 36" />
        </g>
        <Hand {...h} arm={200} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[240, 70]} to={[200, 112]} w={4} />
        <Ok x={60} y={40} r={15} />
      </Scene2>
    );
  },

  /* ───────── Kıt malzemeyle ekmek ───────── */
  // Üç eşit ölçü: ikisi buğday unu, biri arpa unu → en çok üçte bir arpa
  'sf-mb-ekmek-arpa-oran': () => (
    <Scene2 bg="closeup">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Glass x={56 + i * 60} y={130} w={44} h={60} fill={i === 2 ? M.barley : M.flour} lv={0.85} op={1} />
        </g>
      ))}
      <text x={56} y={152} text-anchor="middle" font-size={12} font-weight={700} fill={K.ink}>buğday</text>
      <text x={116} y={152} text-anchor="middle" font-size={12} font-weight={700} fill={K.ink}>buğday</text>
      <text x={176} y={152} text-anchor="middle" font-size={12} font-weight={700} fill={K.ink}>arpa</text>
      <Arrow from={[206, 100]} to={[244, 140]} w={5} />
      <Bowl x={262} y={210} w={92} h={40} c="#c9d2da" pile="#ece0c4" />
      <Label x={116} y={196} text="1/3 arpa" />
    </Scene2>
  ),
  // Yağlanmış tepsiye 3–4 cm kalınlıkta mısır hamuru yayılıyor; ıslak el üstünü düzeltiyor
  'sf-mb-misir-ekmegi-tepsi': () => {
    const h = handAt({ a: 96, s: 1.0, pose: 'press' as const, side: 'R' as const, view: 'palm' as const }, 'palm', [150, 146]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M30 196H270L260 214H40Z', f: '#4a4e57' }, { d: 'M36 196H264V150Q150 140 36 150Z', f: M.corn }]} />
        <path d="M30 196H270" stroke={K.out} stroke-width={1.5} />
        <g fill={M.cornD}>{[60, 90, 120, 200, 230].map((x, i) => <circle key={x} cx={x} cy={170 + (i % 2) * 10} r={2} />)}</g>
        <Hand {...h} arm={180} sleeve={HA.sleeve} skin={HA.skin} />
        {[0, 1].map((i) => <path key={i} d={`M${130 + i * 50} 100q-4 7 0 9q4 -2 0 -9z`} fill={K.water} stroke={K.out} stroke-width={1} />)}
        <Dim a={[290, 196]} b={[290, 150]} text="3–4 cm" off={[0, -44]} />
        <Arrow from={[150, 82]} to={[230, 82]} w={4} />
      </Scene2>
    );
  },
  // Fırından çıkmış koyu altın mısır ekmeği; ortasına batırılan çöp temiz çıkıyor (onay)
  'sf-mb-misir-ekmegi-kontrol': () => {
    const h = handAt({ a: 200, s: 1.0, pose: 'pinch' as const, side: 'R' as const }, 'pinch', [190, 64]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: ell([150, 170], 130, 48), f: '#4a4e57' }, { d: ell([150, 160], 118, 40), f: '#c98a2e' }, { d: ell([150, 158], 104, 32), f: '#dda23a' }]} />
        <g fill="#b9781f">{[[110, 150], [150, 166], [190, 152], [130, 172], [176, 140]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={5} ry={2.4} />)}</g>
        <path d="M34 166Q40 186 70 196" stroke={K.out} stroke-width={1.4} fill="none" />
        <Rod d={line([[176, 128], [190, 64]])} w={3} c="#e6cf9a" />
        <Hand {...h} arm={160} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[150, 110]} to={[150, 60]} w={4} />
        <Ok x={250} y={110} r={15} />
      </Scene2>
    );
  },

  /* ───────── Tek tencere ───────── */
  // Büyük kasede bol soğuk suda kuru fasulye ve nohut; 12 saat
  'sf-mb-baklagil-islatma': () => (
    <Scene2 bg="closeup">
      <g>
        <OG sh={[{ d: 'M40 90H250Q250 200 190 214H100Q40 200 40 90Z', f: M.glass, op: 0.85 }]} />
        <path d="M44 104H246Q244 196 188 210H102Q46 196 44 104Z" fill={K.water} opacity={0.4} />
        {Array.from({ length: 34 }, (_, i) => {
          const row = i < 12 ? 0 : i < 22 ? 1 : i < 30 ? 2 : 3;
          const k = row === 0 ? i : row === 1 ? i - 12 : row === 2 ? i - 22 : i - 30;
          const n = [12, 10, 8, 4][row];
          const x = 145 + (k - (n - 1) / 2) * (128 - row * 14) / n + (row % 2) * 4;
          const y = 200 - row * 10;
          return i % 2 ? <ellipse key={i} cx={x} cy={y} rx={8} ry={5} fill={M.bean} stroke={K.out} stroke-width={1} transform={`rotate(${i * 23} ${x} ${y})`} /> : <circle key={i} cx={x} cy={y} r={5.5} fill={M.chick} stroke={K.out} stroke-width={1} />;
        })}
        <path d="M40 90H250Q250 200 190 214H100Q40 200 40 90Z" fill="none" stroke={K.out} stroke-width={1.6} />
        <path d="M60 110Q58 160 84 196" stroke="#fff" stroke-width={4} fill="none" opacity={0.6} />
      </g>
      <Moon x={268} y={40} r={14} />
      <Sun x={292} y={84} r={11} />
      <Label x={272} y={128} text="12 saat" />
    </Scene2>
  ),
  // Islatılmış fasulye ocakta fokur fokur kaynıyor; 10 dk+; köşede ılık közde duran tencere (yasak)
  'sf-mb-baklagil-kaynatma': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <Hearth x={120} y={216} w={150} s={1.15} />
      <PotX x={120} y={188} w={140} h={80} fill="#d9c7a0" boil steam>
        {[-40, -20, 0, 20, 40, -30, 10, 30].map((dx, i) => <ellipse key={i} cx={dx} cy={-80 + (i > 4 ? 3 : -1)} rx={6} ry={3.4} fill={M.bean} stroke={K.out} stroke-width={0.9} />)}
      </PotX>
      <Label x={60} y={42} text="10 dk+" />
      <Inset x={222} y={120} w={88} h={98}>
        <Hearth x={266} y={212} w={60} s={0.7} fire={false} embers />
        <PotX x={266} y={196} w={52} h={34} fill="#d9c7a0" />
        <Bad x={296} y={134} r={10} />
      </Inset>
    </Scene2>
  ),
  // Kesit: tahta sandıkta samanla çevrili kapaklı tencere; üstte minder; ısı içeride kalıyor
  'sf-mb-tencere-saman': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: rrect(56, 86, 208, 134, 4), f: M.wood }, { d: rrect(68, 98, 184, 118, 2), f: M.hay }]} />
      <g stroke={M.hayD} stroke-width={1.6} stroke-linecap="round">
        {Array.from({ length: 46 }, (_, i) => {
          const x = 74 + ((i * 41) % 172), y = 104 + ((i * 29) % 106);
          return <path key={i} d={`M${x} ${y}l${(i % 3) * 4 - 4} ${6 - (i % 2) * 3}`} />;
        })}
      </g>
      <PotX x={160} y={196} w={92} h={58} fill={null} lid />
      {/* minder */}
      <OG sh={[{ d: 'M50 88Q46 60 80 58H240Q274 60 270 88Z', f: '#c1554b' }]} />
      <g stroke={shade('#c1554b', 0.3)} stroke-width={1.4}>{[100, 160, 220].map((x) => <path key={x} d={`M${x} 64V84`} />)}</g>
      <g fill="none" stroke={K.action} stroke-width={3} stroke-linecap="round">
        <path d="M100 170q-6 -8 0 -16q6 -8 0 -16" />
        <path d="M220 170q-6 -8 0 -16q6 -8 0 -16" />
        <path d="M140 126q8 -6 16 0q8 6 16 0" />
      </g>
    </Scene2>
  ),
};


/* ═══════════════════════ SAHNELER: kıtlıkta beslenme ═══════════════════════ */
const HP = { skin: 1, sleeve: K.role.bystander4 } as const; // pellagra rehberi (eller)
const S2: Record<string, () => JSX.Element> = {
  /* ───────── Kalori ve stok ───────── */
  // 100 g'da kcal: un 350, mercimek 340, yağ 885, şeker 400
  'sf-mb-kalori-terazi': () => {
    const cols: Array<[string, string, string]> = [['un', M.flour, '350'], ['mercimek', M.lentil, '340'], ['yağ', M.oil, '885'], ['şeker', M.sugar, '400']];
    return (
      <Scene2 bg="closeup">
        <Label x={160} y={34} text="100 g" />
        {cols.map(([name, c, kc], i) => {
          const x = 46 + i * 76;
          return (
            <g key={name}>
              {name === 'yağ'
                ? <Glass x={x} y={156} w={44} h={62} fill={c} lv={0.8} op={1} />
                : <Bowl x={x} y={156} w={62} h={24} c="#c9d2da" pile={c} />}
              {name === 'mercimek' && [-12, -4, 4, 12, -8, 0, 8].map((dx, j) => <circle key={j} cx={x + dx} cy={156 - 30 - (j > 3 ? 6 : 0)} r={1.8} fill={shade(M.lentil, 0.3)} />)}
              <text x={x} y={180} text-anchor="middle" font-size={13} font-weight={700} fill={K.ink}>{name}</text>
              <Label x={x} y={206} text={kc} size={i === 2 ? 17 : 14} bg={i === 2 ? K.action : K.white} />
            </g>
          );
        })}
        <text x={160} y={232} text-anchor="middle" font-size={11} font-weight={700} fill={K.ink}>kcal</text>
      </Scene2>
    );
  },
  // Bir kişinin günlük payı tepside: bulgur 450 g, mercimek 60 g, yağ 25 g, şeker ve tuz; ≈2.100 kcal
  'sf-mb-gunluk-pay': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(18, 40, 284, 184, 16), f: '#c99057' }, { d: rrect(28, 50, 264, 164, 10), f: '#d6a774' }]} />
      <OG sh={[{ d: circ([100, 124], 58), f: '#e7ecf0' }, { d: circ([100, 124], 46), f: M.bulgur }]} />
      <g fill={shade(M.bulgur, 0.25)}>{Array.from({ length: 22 }, (_, i) => <circle key={i} cx={100 + Math.cos(i * 2.4) * (8 + (i % 5) * 7)} cy={124 + Math.sin(i * 2.4) * (8 + (i % 5) * 7)} r={1.6} />)}</g>
      <OG sh={[{ d: circ([206, 96], 30), f: '#e7ecf0' }, { d: circ([206, 96], 22), f: M.lentil }]} />
      <TSpoon x={196} y={164} a={10} s={1.4} fill={M.oil} heap={2} />
      <OG sh={[{ d: circ([262, 156], 14), f: '#e7ecf0' }, { d: circ([262, 156], 9), f: M.sugar }, { d: circ([262, 190], 11), f: '#e7ecf0' }, { d: circ([262, 190], 7), f: M.salt }]} />
      <Label x={100} y={196} text="450 g" size={13} bg={K.white} />
      <Label x={206} y={140} text="60 g" size={13} bg={K.white} />
      <Label x={196} y={196} text="25 g" size={13} bg={K.white} />
      <Label x={244} y={24} text="≈2.100 kcal" size={14} />
    </Scene2>
  ),
  // Ambar: çuvallar; sorumlu defter tutuyor; 5 kişi × 90 gün
  'sf-mb-ambar-hesap': () => {
    const nb: P = [204, 128];
    const p: PersonProps = { ...CAST.ambar, x: 220, y: 226, s: 1.12, pose: { ...POSE.stand, armB: { to: [nb[0] - 22, nb[1] + 6] }, armF: { to: [nb[0] + 26, nb[1] + 4] }, head: -100, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Sack x={46} y={214} w={60} h={78} label="UN" />
        <Sack x={106} y={216} w={58} h={70} label="BULGUR" top={M.bulgur} />
        <Sack x={76} y={150} w={52} h={50} top={M.lentil} />
        <Person {...p} over={() => <Notebook x={nb[0] + 2} y={nb[1]} s={0.72} a={-6}>
          <text x={0} y={-6} text-anchor="middle" font-size={14} font-weight={800} fill={K.ink}>5 × 90</text>
        </Notebook>} />
        <Label x={196} y={34} text="5 kişi × 90 gün" size={14} />
      </Scene2>
    );
  },

  /* ───────── Protein açlığı ───────── */

  // Tabak: küçük bölümde et, büyük bölümlerde bulgur ve patates, kenarda bir kaşık yağ
  'sf-mb-protein-tabak': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: circ([150, 126], 100), f: '#f6f7f9' }, { d: circ([150, 126], 80), f: '#eef0f3' }]} />
      <OG sh={[{ d: smooth([[80, 100], [120, 74], [162, 86], [156, 128], [104, 136], [76, 120]], true), f: M.bulgur }]} />
      <g fill={shade(M.bulgur, 0.3)}>{Array.from({ length: 70 }, (_, i) => <ellipse key={i} cx={88 + (i * 17.3) % 64} cy={88 + (i * 11.7) % 40} rx={2.4} ry={1.4} transform={`rotate(${i * 37} ${88 + (i * 17.3) % 64} ${88 + (i * 11.7) % 40})`} />)}</g>
      <OG sh={[[170, 112], [196, 120], [176, 140], [204, 146]].map(([x, y]) => ({ d: ell([x, y], 15, 11), f: '#e8c77a' }))} />
      <OG sh={[{ d: smooth([[118, 158], [146, 150], [162, 164], [150, 182], [122, 180]], true), f: '#a8623e' }]} />
      <TSpoon x={258} y={196} a={-30} s={1.2} fill={M.oil} heap={2} />
      <Ok x={268} y={46} r={15} />
    </Scene2>
  ),
  // Kırılmış kemiğin içindeki ilik kaşıkla çıkarılıyor
  'sf-mb-kemik-iligi': () => {
    const h = handAt({ a: -120, s: 0.95, pose: 'fist' as const, side: 'R' as const }, 'grip', [246, 70]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: smooth([[20, 190], [80, 166], [200, 160], [300, 176], [306, 220], [16, 224]], true), f: M.stone }]} />
        {/* iki yarım kemik */}
        <OG sh={[
          { d: capsule([40, 150], 13, [126, 140], 12), f: '#efe6d6' },
          { d: ell([36, 150], 14, 18), f: '#efe6d6' },
          { d: ell([128, 140], 8, 12), f: '#e3b56e' },
          { d: capsule([164, 154], 12, [258, 160], 13), f: '#efe6d6' },
          { d: ell([262, 160], 14, 18), f: '#efe6d6' },
          { d: ell([162, 154], 8, 12), f: '#e3b56e' },
        ]} />
        <Rod d={line([[246, 70], [176, 130]])} w={3} c="#c3ccd6" />
        <OG sh={[{ d: ell([170, 136], 9, 6), f: '#c3ccd6', t: 'rotate(-40 170 136)' }, { d: ell([170, 135], 6, 3.5), f: '#e3b56e', t: 'rotate(-40 170 135)' }]} />
        <Hand {...h} arm={150} sleeve={HV.sleeve} skin={HV.skin} />
      </Scene2>
    );
  },

  /* ───────── İskorbüt ───────── */
  // İki yakın plan: şişmiş, kanayan diş eti | bacakta kıl dibi kırmızı noktalar ve morluk
  'sf-mb-iskorbut-belirti': () => (
    <Scene2 bg="closeup">
      <Panels />
      {/* ağız: dudaklar aralık, üst dişler ve şişmiş, kanayan diş eti */}
      <OG sh={[{ d: ell([82, 122], 64, 44), f: '#d98a7a' }, { d: ell([82, 124], 52, 31), f: '#4a1f24' }]} />
      <OG sh={[{ d: 'M34 112Q82 84 130 112L128 124Q82 104 36 124Z', f: '#d8475a' }]} />
      <g>{[-35, -21, -7, 7, 21, 35].map((dx) => <rect key={dx} x={82 + dx - 6.5} y={113 + Math.abs(dx) * 0.12} width={13} height={18} rx={3} fill="#fbfaf2" stroke={K.out} stroke-width={1.1} />)}</g>
      <OG sh={[-28, -14, 0, 14, 28].map((dx) => ({ d: `M${82 + dx - 6} ${114 + Math.abs(dx) * 0.12}Q${82 + dx} ${127 + Math.abs(dx) * 0.1} ${82 + dx + 6} ${114 + Math.abs(dx) * 0.12}Z`, f: '#d8475a' }))} />
      <path d="M68 128q-3 7 0 10q3 -3 0 -10z" fill={K.blood} stroke={K.out} stroke-width={0.8} />
      <path d="M96 128q-3 6 0 9q3 -3 0 -9z" fill={K.blood} stroke={K.out} stroke-width={0.8} />
      {/* bacak */}
      <OG sh={[{ d: 'M204 10H256L252 120L250 176C262 182 290 186 296 196C300 206 290 212 278 212H214C204 212 202 200 206 186L206 120Z', f: K.skin[1] }, { d: rrect(198, 4, 64, 22, 6), f: K.pants.denim }]} />
      {Array.from({ length: 13 }, (_, i) => {
        const x = 214 + (i * 23) % 34, y = 40 + i * 10;
        return <g key={i}><circle cx={x} cy={y} r={2.6} fill="#d23a3a" /><path d={`M${x} ${y}l2 -5`} stroke="#6b4a3a" stroke-width={0.8} /></g>;
      })}
      <OG sh={[{ d: ell([232, 160], 13, 10), f: '#7b5aa6', op: 0.75 }]} />
    </Scene2>
  ),
  // Tepside ıslak bez; arasında ıslatılmış nohut ve mercimek; el bezi kaşıkla nemlendiriyor; 21–25°C, gölge
  'sf-mb-filiz-bez': () => {
    const h = handAt({ a: -130, s: 0.9, pose: 'fist' as const, side: 'R' as const }, 'grip', [262, 64]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(24, 44, 250, 176, 10), f: M.metal }, { d: rrect(34, 54, 230, 156, 6), f: '#e4eef4' }, { d: rrect(40, 118, 218, 86, 4), f: '#dfe6ea' }]} />
        <g stroke="#c4d4de" stroke-width={1.2}>{[70, 110, 150, 190, 230].map((x) => <path key={x} d={`M${x} 124V200`} />)}</g>
        {Array.from({ length: 26 }, (_, i) => {
          const x = 52 + (i % 9) * 24 + (Math.floor(i / 9) % 2) * 12, y = 140 + Math.floor(i / 9) * 22;
          return i % 3 ? <circle key={i} cx={x} cy={y} r={7} fill={M.chick} stroke={K.out} stroke-width={1} /> : <ellipse key={i} cx={x} cy={y} rx={5} ry={4} fill="#7a9a4a" stroke={K.out} stroke-width={1} />;
        })}
        {/* üst kat bez (katlanmış yarı) */}
        <OG sh={[{ d: 'M34 54H264V120Q150 128 34 120Z', f: '#f2f6f9' }]} />
        <g stroke="#c4d4de" stroke-width={1.2}>{[70, 110, 150, 190, 230].map((x) => <path key={x} d={`M${x} 60V116`} />)}</g>
        <Rod d={line([[262, 64], [212, 104]])} w={2.6} c="#c3ccd6" />
        <OG sh={[{ d: ell([204, 108], 10, 6), f: '#c3ccd6' }, { d: ell([204, 107], 7, 3.5), f: K.water }]} />
        {[0, 1].map((i) => <path key={i} d={`M${200 + i * 8} ${118 + i * 4}q-3 6 0 8q3 -2 0 -8z`} fill={K.water} stroke={K.out} stroke-width={0.8} />)}
        <Hand {...h} arm={160} sleeve={HA.sleeve} skin={1} />
        <Label x={70} y={28} text="21–25°C" size={14} />
      </Scene2>
    );
  },
  // Avuçta 1–2 cm filiz vermiş nohut ve mercimek (filiziyle birlikte yenir)
  'sf-mb-filiz-hazir': () => {
    const h = { x: 150, y: 250, a: 0, s: 2.1, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    const pm = handPoint(h, 'palm');
    const seeds: P[] = [[-30, -8], [-12, -14], [8, -10], [26, -4], [-20, 8], [2, 6], [20, 12], [-6, 22]];
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={20} sleeve={HA.sleeve} skin={HA.skin} />
        {seeds.map(([dx, dy], i) => {
          const c: P = [pm[0] + dx, pm[1] - 20 + dy];
          const tail = `M${c[0] + 4} ${c[1] - 4}q${10 + (i % 3) * 3} -6 ${16 + (i % 2) * 4} -18`;
          return (
            <g key={i}>
              <path d={tail} stroke={K.out} stroke-width={5} fill="none" stroke-linecap="round" />
              <path d={tail} stroke="#f1eec6" stroke-width={3} fill="none" stroke-linecap="round" />
              {i % 3 === 1 ? <ellipse cx={c[0]} cy={c[1]} rx={6} ry={5} fill="#7a9a4a" stroke={K.out} stroke-width={1.1} /> : <circle cx={c[0]} cy={c[1]} r={8} fill={M.chick} stroke={K.out} stroke-width={1.1} />}
            </g>
          );
        })}
        <Ok x={272} y={46} r={16} />
      </Scene2>
    );
  },

  /* ───────── Pellagra ve beriberi ───────── */
  // Güneş gören yerlerde (el sırtı, ön kol, boyun) kahverengi-kırmızı pullu döküntü; boyunda kolye gibi bant
  'sf-mb-pellagra-deri': () => {
    const p: PersonProps = { who: 'man', skin: 1, hair: 'short', hairC: K.hair.dark, top: K.role.bystander4, sleeve: 'short', x: 150, y: 70, ax: 'head', ay: 'head', s: 1.75, pose: { ...POSE.stand, armB: [100, 70], armF: [80, 110], face: 'worried' } };
    const r = rig(p);
    const rash = (a: P, b: P, n: number) => Array.from({ length: n }, (_, i) => {
      const q = lerp(a, b, 0.15 + (i / Math.max(1, n - 1)) * 0.75);
      return <ellipse key={i} cx={q[0] + (i % 2 ? 3 : -3)} cy={q[1]} rx={6} ry={4.5} fill="#9a4a2a" opacity={0.75} />;
    });
    return (
      <Scene2 bg="indoor">
        <Person {...p} over={(rr) => (
          <g>
            {rash(rr.elbowB, rr.wristB, 4)}
            {rash(rr.elbowF, rr.wristF, 4)}
            <ellipse cx={rr.handB[0]} cy={rr.handB[1]} rx={5} ry={4} fill="#9a4a2a" opacity={0.75} />
            <ellipse cx={rr.handF[0]} cy={rr.handF[1]} rx={5} ry={4} fill="#9a4a2a" opacity={0.75} />
            <path d={`M${rr.neck[0] - 13} ${rr.neck[1] - 2}Q${rr.neck[0]} ${rr.neck[1] + 12} ${rr.neck[0] + 13} ${rr.neck[1] - 2}`} fill="none" stroke="#9a4a2a" stroke-width={6} opacity={0.75} />
          </g>
        )} />
        <Sun x={276} y={44} r={14} />
        <Arrow from={[262, 64]} to={[r.wristF[0] + 18, r.wristF[1] - 20]} w={4} bend={0.1} />
      </Scene2>
    );
  },
  // Kireç suyunda pişmiş mısır taneleri ovunca kabuğu soyuluyor; sonra bol suda yıkanır
  'sf-mb-misir-kul': () => {
    const jug: P = [214, 54];
    return (
      <Scene2 bg="indoor">
        <Hearth x={110} y={216} w={150} s={1.1} />
        <PotX x={110} y={190} w={130} h={74} fill="#ecead8">
          {[-46, -30, -14, 2, 18, 34, 46, -38, -22, -6, 10, 26].map((dx, i) => <circle key={i} cx={dx} cy={-74 + (i > 6 ? 3 : -1)} r={4.5} fill={M.corn} stroke={K.out} stroke-width={0.8} />)}
        </PotX>
        {/* testi: kireç suyu dökülüyor; testiyi el kulpundan tutuyor */}
        <Hand {...handAt({ a: -150, s: 0.85, pose: 'fist' as const, side: 'R' as const }, 'grip', [jug[0] + 62, jug[1] - 14])} arm={120} sleeve={HP.sleeve} skin={HP.skin} />
        <g transform={tr(jug[0] + 34, jug[1] - 6, 1, -45)}>
          <OG sh={[
            { d: 'M24 -30Q40 -24 34 4Q30 18 22 14', st: K.out, sw: 4 },
            { d: 'M-16 -36H16L18 -26Q30 -6 22 20Q16 34 0 34Q-16 34 -22 20Q-30 -6 -18 -26Z', f: M.clay },
            { d: 'M-16 -36L-26 -44L-12 -36Z', f: M.clay },
          ]} />
        </g>
        <path d={`M${jug[0] + 2} ${jug[1] + 4}Q${jug[0] - 30} ${jug[1] + 30} ${jug[0] - 60} ${jug[1] + 58}`} stroke="#f2f0e4" stroke-width={7} fill="none" stroke-linecap="round" />
        <Inset x={214} y={118} w={96} h={96}>
          <Hand x={262} y={240} a={-10} s={0.9} pose="open" side="R" view="palm" arm={30} sleeve={HP.sleeve} skin={HP.skin} />
          {[[248, 186], [262, 182], [276, 188], [256, 196], [270, 198]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill={M.corn} stroke={K.out} stroke-width={0.8} />)}
          {[[236, 150], [286, 156], [250, 140], [274, 136]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q6 -4 10 0q-4 5 -10 0z`} fill="#f7efc8" stroke={K.out} stroke-width={0.8} />)}
          <Ok x={294} y={132} r={9} />
        </Inset>
      </Scene2>
    );
  },
  // Az suyla, suyunu çekmiş pirinç (onay) | bol suda haşlanıp suyu dökülen pirinç (yasak)
  'sf-mb-pirinc-suyu': () => (
    <Scene2 bg="closeup">
      <Panels />
      <PotX x={86} y={196} w={106} h={66} fill={M.rice} />
      <g fill="#e8e2d0">{Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={46 + (i * 11) % 80} cy={128 + (i % 3) * 2} rx={3} ry={1.6} />)}</g>
      <Ok x={36} y={38} r={14} />
      <g transform="rotate(38 236 150)">
        <PotX x={236} y={170} w={96} h={60} fill={tint(K.water, 0.3)} />
      </g>
      <path d="M266 108Q290 140 286 200" stroke={tint(K.water, 0.2)} stroke-width={8} fill="none" stroke-linecap="round" />
      <No x={236} y={140} r={56} />
    </Scene2>
  ),

  /* ───────── Açlık sonrası beslenme ───────── */
  // İlk gün kilo başına en çok 10 kcal: küçük kase; 7 güne yayılan, giderek büyüyen kaseler
  'sf-mb-refeeding-hesap': () => (
    <Scene2 bg="closeup">
      <Bowl x={88} y={104} w={78} h={30} c="#d58a5a" pile="#efe2c2" />
      <Label x={214} y={66} text="50 kg → 500 kcal" size={14} />
      <text x={214} y={98} text-anchor="middle" font-size={13} font-weight={700} fill={K.ink}>1. gün</text>
      {Array.from({ length: 7 }, (_, i) => {
        const x = 30 + i * 43;
        const w = 22 + i * 5;
        return (
          <g key={i}>
            <Bowl x={x} y={200} w={w} h={8 + i * 2} c="#d58a5a" pile="#efe2c2" />
            <text x={x} y={222} text-anchor="middle" font-size={12} font-weight={700} fill={K.ink}>{i + 1}</text>
          </g>
        );
      })}
      <Arrow from={[40, 150]} to={[286, 150]} w={4} />
    </Scene2>
  ),
  // Battaniyeye sarılı hastaya bakıcı küçük kaseden kaşıkla çorba içiriyor; duvarda saat, 2–3 saatte bir
  'sf-mb-refeeding-kucuk-ogun': () => {
    const pat: PersonProps = { ...CAST.hasta, x: 84, y: 226, s: 1.3, pose: { ...POSE.sitFloor, spine: -80, head: -88, armB: [70, 20], armF: [70, 20], face: 'neutral' } };
    const pr = rig(pat);
    const spoonAt: P = [pr.mouth[0] + 10, pr.mouth[1] + 2];
    const cg: PersonProps = { ...CAST.bakici, x: 226, y: 226, s: 1.3, flip: true, pose: { ...POSE.kneelSit, spine: -84, head: -84, armF: { to: [spoonAt[0] + 14, spoonAt[1] + 2] }, armB: { to: [196, 150] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <g transform="translate(270 50)">
          <circle r={20} fill="#fbfaf7" stroke={K.out} stroke-width={2} />
          <path d="M0 0V-13M0 0L9 5" stroke={K.out} stroke-width={2.4} stroke-linecap="round" />
        </g>
        <Label x={244} y={88} text="2–3 saatte bir" size={13} />
        <OG sh={[{ d: rrect(14, 214, 170, 14, 6), f: '#d9c8a8' }]} />
        <Person {...pat} />
        <Blanket2 x1={pr.hip[0] - 14} x2={pr.kneeF[0] + 46} y={pr.kneeF[1] - 2} />
        <Person {...cg} over={(r) => (
          <g>
            <Bowl x={r.handB[0] - 2} y={r.handB[1] + 10} w={30} h={14} c="#d58a5a" fill="#e4c46a" />
          </g>
        )} mid={(r) => <TSpoon x={spoonAt[0]} y={spoonAt[1]} a={0} s={0.7} fill="#e4c46a" />} />
      </Scene2>
    );
  },
  // Bakıcı iki parmağıyla hastanın bileğinden (başparmak tarafı) nabız sayıyor; 1 dakika
  'sf-mb-refeeding-izlem': () => {
    // Hastanın sağ önkolu soldan gelir, avuç yukarı, parmaklar sağa; bilek ortada açıkta.
    const pw = { x: 176, y: 170, a: 90, s: 1.3, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    // Bakıcının eli yukarıdan, parmaklar aşağı; işaret ve orta parmak ucu bilekte.
    const tgt: P = [pw.x - 22, pw.y + 2];
    const h = handAt({ a: 196, s: 1.15, pose: 'point' as const, side: 'R' as const, view: 'back' as const }, 'tip', tgt);
    const k = handPoint({ ...h }, 'tip');
    const base = handPoint({ ...h }, 'palm');
    const mid0: P = lerp(base, k, 0.42);
    const midTip: P = [k[0] + 11, k[1] - 1];
    return (
      <Scene2 bg="closeup">
        <Hand {...pw} arm={240} skin={CAST.hasta.skin} />
        <OG sh={[{ d: capsule([-20, pw.y], 19, [pw.x - 62, pw.y], 19), f: CAST.hasta.top }, { d: `M${pw.x - 74} ${pw.y - 18}V${pw.y + 18}`, st: shade(CAST.hasta.top, 0.3), sw: 1.4 }]} />
        <OG sh={[{ d: capsule([mid0[0] + 9, mid0[1]], 5.4, midTip, 4.6), f: K.skin[HB.skin] }]} />
        <Hand {...h} arm={200} sleeve={HB.sleeve} skin={HB.skin} />
        <Waves x={tgt[0] - 4} y={tgt[1] + 26} a={120} n={3} r={6} color={K.danger} />
        <Timer x={56} y={58} r={26} text="1 dk" />
      </Scene2>
    );
  },

  /* ───────── Su ve tuz ───────── */
  // Şapkalı işçi kazmayı bırakmış, sudan içiyor; güneş; 15–20 dakikada bir
  'sf-mb-is-su-icme': () => {
    const p: PersonProps = { ...CAST.isci, x: 140, y: 224, s: 1.12, pose: { ...POSE.standSide, head: -100, armF: { at: 'mouth', d: [8, 4] }, armB: [96, 96], face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Sun x={46} y={44} r={16} />
        {/* kazma yere dayalı */}
        <Rod d={line([[236, 220], [212, 132]])} w={4} c="#9a7046" />
        <OG sh={[{ d: 'M190 136Q212 120 236 134L232 140Q212 130 194 142Z', f: '#59616c' }]} />
        <Person {...p} over={(rr) => (
          <g>
            <Bottle x={rr.handF[0] + 6} y={rr.handF[1] + 14} a={-120} s={0.95} fill={0.5} />
            <OG sh={[{ d: ell([rr.head[0], rr.top + 9], 28, 6), f: '#e2c66a' }, { d: `M${rr.head[0] - 14} ${rr.top + 8}Q${rr.head[0]} ${rr.top - 12} ${rr.head[0] + 14} ${rr.top + 8}Z`, f: '#e2c66a' }]} />
          </g>
        )} />
        <Timer x={206} y={46} r={18} text="15–20 dk" />
      </Scene2>
    );
  },
  // İdrar rengi: açık saman sarısı (onay), koyu sarı (uyarı), kehribar (tehlike)
  'sf-mb-idrar-renk': () => (
    <Scene2 bg="closeup">
      {([['#f6ea9a', 'ok'], ['#e9b92e', 'warn'], ['#b86a1c', 'bad']] as const).map(([c, k], i) => {
        const x = 70 + i * 90;
        return (
          <g key={k}>
            <Glass x={x} y={186} w={56} h={86} fill={c} lv={0.7} op={1} />
            {k === 'ok' && <Ok x={x} y={70} r={16} />}
            {k === 'warn' && <Warn x={x} y={72} r={17} />}
            {k === 'bad' && <Bad x={x} y={70} r={16} />}
          </g>
        );
      })}
    </Scene2>
  ),
  // Ağaç gölgesinde oturan iki işçi; su testisi ve tuzlu yemek; aletler güneşte bırakılmış
  'sf-mb-golge-mola': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <Sun x={290} y={36} r={14} />
      <OG sh={[{ d: ell([110, 214], 106, 12), f: shade(K.dirt, 0.18), no: true }]} />
      <Tree x={110} y={210} s={1.65} />
      <Person {...CAST.isci} x={72} y={226} s={1.0} pose={{ ...POSE.sitFloor, spine: -78, face: 'calm' }} />
      <Person {...CAST.isci2} x={158} y={226} s={0.98} flip pose={{ ...POSE.sitFloor, spine: -78, face: 'calm' }} />
      <OG sh={[{ d: 'M106 226Q96 200 104 192H122Q130 200 120 226Z', f: M.clay }, { d: rrect(107, 186, 12, 7, 2), f: shade(M.clay, 0.2) }]} />
      <Bowl x={136} y={232} w={26} h={12} c="#d58a5a" fill={M.bulgur} />
      <Rod d={line([[236, 222], [292, 196]])} w={4} c="#9a7046" />
      <OG sh={[{ d: 'M284 186L302 192L296 206L280 200Z', f: '#59616c' }]} />
    </Scene2>
  ),

  /* ───────── Bebek ve çocuk ───────── */
  // Sandalyede oturan anne, kucağındaki bebeği yüzü kendine dönük, göğsüne yaslı tutuyor (giyinik, ölçülü);
  // köşede su ve çay bardağı (yasak): ilk 6 ay yalnız anne sütü
  'sf-mb-emzirme': () => {
    const mom: PersonProps = { ...CAST.anne, x: 104, y: 228, s: 1.32, pose: { ...POSE.sitChair, spine: -98, head: -62, face: 'calm' } };
    const m = rig(mom);
    const bHip: P = [m.hip[0] + 44, m.hip[1] - 14];
    const baby: PersonProps = { x: bHip[0], y: bHip[1], ay: 'hip', s: 1.3, who: 'baby', skin: 1, shadow: false, flip: true, pose: { spine: -28, head: -34, legB: [168, 120], legF: [160, 112], armB: [70, 20], armF: [60, 10], face: 'closed' } };
    const b = rig(baby);
    const hold: PersonProps = { ...mom, pose: { ...mom.pose, armB: { to: [b.hip[0] + 6, b.hip[1] - 2] }, armF: { to: [b.neck[0] + 8, b.neck[1] + 4] } } };
    return (
      <Scene2 bg="indoor">
        <Chair x={m.hip[0] - 4} y={228} seat={44 * 1.32} s={1.25} />
        <Person {...hold} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...baby} />
        <Person {...hold} only={['armF']} />
        <Inset x={222} y={30} w={86} h={84}>
          <Glass x={248} y={100} w={24} h={34} lv={0.75} />
          <Glass x={282} y={100} w={20} h={34} lv={0.75} fill="#b8642a" op={0.9} />
          <Bad x={296} y={44} r={10} />
        </Inset>
        <Label x={265} y={134} text="ilk 6 ay" size={13} />
      </Scene2>
    );
  },
  // Kaşıktaki koyu lapa akmıyor (onay) | sulu çorba kaşıktan akıyor (yasak)
  'sf-mb-lapa-kivam': () => (
    <Scene2 bg="closeup">
      <Panels />
      <TSpoon x={60} y={130} a={0} s={1.6} fill="#efdcaa" heap={12} />
      <Ok x={36} y={38} r={14} />
      <TSpoon x={206} y={110} a={12} s={1.6} fill="#efe6c8" heap={0} />
      <path d="M196 118q-4 16 -2 34M208 120q-2 20 2 40" stroke={K.out} stroke-width={6} fill="none" stroke-linecap="round" />
      <path d="M196 118q-4 16 -2 34M208 120q-2 20 2 40" stroke="#efe6c8" stroke-width={3.4} fill="none" stroke-linecap="round" />
      <path d="M194 170q-4 7 0 9q4 -2 0 -9z" fill="#efe6c8" stroke={K.out} stroke-width={1} />
      <No x={236} y={150} r={56} />
    </Scene2>
  ),
  // Çocuğun kendi kasesi: koyu lapa üstünde ezilmiş yumurta, bir çay kaşığı yağ ve ezilmiş yeşil sebze; çocuk kaşığı
  'sf-mb-cocuk-tabak': () => (
    // Çocuğun kasesi: koyu lapanın üstünde yarım haşlanmış yumurta ve küçük doğranmış ciğer/et; yanında yoğurt kasesi
    <Scene2 bg="closeup">
      <OG sh={[{ d: circ([126, 128], 88), f: '#7fb0d8' }, { d: circ([126, 128], 72), f: '#efdcaa' }]} />
      {/* yarım yumurta */}
      <OG sh={[{ d: ell([102, 104], 28, 21), f: '#fbfaf2' }, { d: circ([102, 106], 12), f: '#f2b81e' }]} />
      {/* doğranmış ciğer / et */}
      <OG sh={[[138, 142], [156, 128], [160, 152], [142, 164], [124, 156]].map(([x, y], i) => ({ d: rrect(x - 8, y - 6, 16, 12, 3), f: i % 2 ? '#7a3a2e' : '#8e4636', t: `rotate(${i * 23} ${x} ${y})` }))} />
      {/* yoğurt kasesi */}
      <OG sh={[{ d: 'M226 168H306Q304 214 266 216Q228 214 226 168Z', f: '#e8eef2' }, { d: ell([266, 168], 40, 10), f: M.milk }]} />
      <OG sh={[{ d: capsule([246, 30], 4, [262, 150], 5), f: '#f08a6a' }, { d: ell([244, 26], 10, 14), f: '#f08a6a' }]} />
    </Scene2>
  ),


  /* ───────── Mama yoksa ───────── */
  // 2 ölçü süt + 1 ölçü kaynamış su; şeker çay kaşığıyla
  'sf-mb-sut-olcu': () => (
    <Scene2 bg="closeup">
      <Glass x={50} y={170} w={44} h={66} fill={M.milk} lv={0.7} op={1} />
      <Glass x={110} y={170} w={44} h={66} fill={M.milk} lv={0.7} op={1} />
      <text x={150} y={142} text-anchor="middle" font-size={26} font-weight={800} fill={K.ink}>+</text>
      <Glass x={190} y={170} w={44} h={66} fill={K.water} lv={0.7} op={0.6} />
      <text x={230} y={142} text-anchor="middle" font-size={26} font-weight={800} fill={K.ink}>+</text>
      <TSpoon x={262} y={136} a={-60} s={1.3} fill={M.sugar} heap={4} />
      <text x={80} y={192} text-anchor="middle" font-size={13} font-weight={700} fill={K.ink}>süt</text>
      <text x={190} y={192} text-anchor="middle" font-size={13} font-weight={700} fill={K.ink}>su</text>
      <text x={268} y={192} text-anchor="middle" font-size={13} font-weight={700} fill={K.ink}>şeker</text>
      <Label x={130} y={40} text="2 : 1" size={18} />
    </Scene2>
  ),
  // Süt-su karışımı ilk kaynamada; el tencereyi ateşten alıyor (ok ateşten uzağa)
  'sf-mb-sut-kaynatma': () => {
    const grip: P = [208, 128];
    const h = handAt({ a: -100, s: 0.95, pose: 'fist' as const, side: 'R' as const }, 'grip', grip);
    return (
      <Scene2 bg="indoor">
        <Hearth x={120} y={216} w={130} s={1.05} />
        <PotX x={130} y={170} w={96} h={56} fill={M.milk} boil>
          <OG sh={[{ d: capsule([46, -50], 4, [80, -42], 5), f: '#3b3537' }]} />
          <path d="M-44 -58Q-30 -68 -14 -60Q0 -70 14 -60Q30 -68 44 -58" fill={M.milk} stroke={K.out} stroke-width={1.4} />
        </PotX>
        <Hand {...h} arm={150} sleeve={HN.sleeve} skin={HN.skin} />
        <Arrow from={[150, 70]} to={[234, 48]} bend={-0.2} w={5} />
      </Scene2>
    );
  },
  // Anne bebeği dik tutup açık bardağı dudağına değdiriyor; köşede biberon (yasak)
  'sf-mb-bardakla-besleme': () => {
    const mom: PersonProps = { ...CAST.anne, x: 96, y: 228, s: 1.32, pose: { ...POSE.sitChair, spine: -98, head: -60, face: 'neutral' } };
    const m = rig(mom);
    const bHip: P = [m.hip[0] + 44, m.hip[1] - 12];
    const baby: PersonProps = { x: bHip[0], y: bHip[1], ay: 'hip', s: 1.3, who: 'baby', skin: 1, shadow: false, pose: { spine: -100, head: -96, legB: [10, 70], legF: [5, 60], armB: [70, 30], armF: [60, 20], face: 'neutral' } };
    const b = rig(baby);
    const cup: P = [b.mouth[0] + 8, b.mouth[1] + 4];
    const hold: PersonProps = { ...mom, pose: { ...mom.pose, armB: { to: [b.belly[0] + 4, b.belly[1]] }, armF: { to: [cup[0] + 8, cup[1] + 10] } } };
    return (
      <Scene2 bg="indoor">
        <Chair x={m.hip[0] - 4} y={228} seat={44 * 1.32} s={1.25} />
        <Person {...hold} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...baby} />
        <Person {...hold} only={['armF']} under={() => null} over={() => <g transform={tr(cup[0] + 8, cup[1] + 12, 1, -18)}><Glass x={0} y={0} w={16} h={20} lv={0.45} fill={M.milk} op={1} /></g>} />
        <Inset x={236} y={30} w={72} h={92}>
          <g transform="translate(272 110) rotate(-15)">
            <OG sh={[{ d: rrect(-12, -56, 24, 50, 7), f: '#eef3f6' }, { d: rrect(-12, -36, 24, 30, 6), f: M.milk }, { d: rrect(-14, -64, 28, 9, 3), f: '#7fb0d8' }, { d: 'M-6 -64Q0 -82 6 -64Z', f: '#e8c99a' }]} />
          </g>
          <Bad x={296} y={44} r={10} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── Zayıflık ölçme ───────── */
  // Çocuğun sol kolu gevşek; omuz ucundan dirsek ucuna ip; orta noktası kalemle işaretleniyor
  'sf-mb-muac-orta-nokta': () => {
    // Yandan, bel üstü: normal görünümlü kız, sol kolu gevşek sarkıyor. Omuz ucundan dirsek ucuna kolun
    // arkası boyunca ip; ipin orta noktası kolda kırmızı işaret, ölçen el kalemle işaretliyor.
    const S = 2.9;
    const kid: PersonProps = { who: 'girl', skin: 2, hair: 'ponytail', hairC: K.hair.black, top: '#f0b84a', sleeve: 'none', x: 116, y: 40, ax: 'head', ay: 'head', s: S, pose: { ...POSE.standSide, armF: [90, 90], armB: [90, 90], face: 'neutral' } };
    const k = rig(kid);
    const off = -9 * S * 0.5; // kolun arka kenarı
    const sh: P = [k.shoulderF[0] + off, k.shoulderF[1] - 2];
    const el: P = [k.elbowF[0] + off, k.elbowF[1] + 4];
    const mid = lerp(sh, el, 0.5);
    const h = handAt({ a: 62, s: 1.0, pose: 'pinch' as const, side: 'L' as const }, 'pinch', [mid[0] - 40, mid[1] - 24]);
    return (
      <Scene2 bg="closeup">
        <Person {...kid} only={['torso', 'head', 'armB', 'armF']} />
        <path d={`M${sh[0]} ${sh[1]}L${el[0]} ${el[1]}`} stroke={K.out} stroke-width={5} stroke-linecap="round" />
        <path d={`M${sh[0]} ${sh[1]}L${el[0]} ${el[1]}`} stroke="#f4f1ea" stroke-width={2.6} stroke-linecap="round" />
        {[sh, el].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={4} fill="#f4f1ea" stroke={K.out} stroke-width={1.4} />)}
        <OG sh={[{ d: capsule([mid[0] - 2, mid[1] - 3], 1.6, [mid[0] - 40, mid[1] - 24], 3.6), f: '#f2c94c' }]} />
        <circle cx={mid[0]} cy={mid[1]} r={5} fill={K.danger} stroke={K.out} stroke-width={1.4} />
        <Hand {...h} arm={160} sleeve={HB.sleeve} skin={HB.skin} />
      </Scene2>
    );
  },
  // Üst kolu saran renkli ölçü şeridi; okuma noktası sarıda; altta renk anahtarı 11,5 ve 12,5 cm
  'sf-mb-muac-olcum': () => {
    const ax = 110;
    return (
      <Scene2 bg="closeup">
        {/* üst kol (yakın plan, dikey) */}
        <OG sh={[{ d: capsule([ax, 6], 34, [ax, 236], 30), f: K.skin[2] }, { d: rrect(ax - 42, -10, 84, 40, 8), f: '#f0b84a' }]} />
        {/* şerit: kolu sarıyor */}
        <OG sh={[{ d: rrect(ax - 36, 112, 72, 18, 3), f: '#f4f1ea' }]} />
        <OG sh={[{ d: 'M146 112H300V130H146Z', f: '#f4f1ea' }]} />
        <rect x={150} y={113} width={52} height={16} fill={K.danger} />
        <rect x={202} y={113} width={30} height={16} fill="#f2c94c" />
        <rect x={232} y={113} width={68} height={16} fill={K.safe} />
        <path d="M146 112H300V130H146Z" fill="none" stroke={K.out} stroke-width={1.5} />
        {/* okuma noktası: şeridin baş ucu sarıda */}
        <path d="M218 100L224 88H212Z" fill={K.ink} />
        <path d="M218 100V112" stroke={K.ink} stroke-width={2} />
        <Arrow from={[218, 54]} to={[218, 86]} w={4} />
        <text x={202} y={152} text-anchor="middle" font-size={12} font-weight={700} fill={K.ink}>11,5</text>
        <text x={234} y={152} text-anchor="middle" font-size={12} font-weight={700} fill={K.ink}>12,5</text>
        <text x={262} y={152} font-size={12} font-weight={700} fill={K.ink}>cm</text>
      </Scene2>
    );
  },
  // Solda: başparmak çocuğun ayağının üstüne 3 saniye bastırıyor (yandan yakın plan).
  // Sağda: parmak kalkınca ayağın üstünde çukur kalmış (beslenme ödemi). İki ayak da aynı şekilde denenir.
  'sf-mb-odem-test': () => {
    const sk = K.skin[2];
    // Yandan ayak (sağa bakan): bilek tepede (0,-70), topuk solda, parmaklar sağda; ayak sırtı ~ (22,-14)
    const foot = (x: number, y: number, s: number, pit: boolean) => (
      <g transform={tr(x, y, s)}>
        <OG ow={OW / s} sh={[
          { d: 'M-14 -84L-15 -10C-26 -4 -28 18 -12 22L58 22C70 22 72 8 62 4C44 -2 26 -10 14 -26L13 -84Z', f: sk },
          { d: rrect(-20, -96, 38, 22, 6), f: '#4a5a7a' },
        ]} />
        {pit && <g>
          <ellipse cx={34} cy={-9} rx={8} ry={4} fill={shade(sk, 0.32)} transform="rotate(30 34 -9)" />
          <ellipse cx={34} cy={-9} rx={15} ry={10} fill="none" stroke={K.action} stroke-width={2.4 / s} stroke-dasharray={`${4 / s} ${3 / s}`} transform="rotate(30 34 -9)" />
        </g>}
      </g>
    );
    const th = (tip: P, lift: number) => {
      // yumruk el, başparmak aşağı uzanıyor (ucu tip noktasında)
      const t: P = [tip[0], tip[1] - lift];
      const fist = handAt({ a: 200, s: 0.9, pose: 'fist' as const, side: 'R' as const }, 'palm', [t[0] + 6, t[1] - 34]);
      return (
        <g>
          <Hand {...fist} arm={140} sleeve={HB.sleeve} skin={HB.skin} />
          <OG sh={[{ d: capsule([t[0] + 2, t[1] - 26], 6.2, [t[0], t[1] - 3], 5.4), f: K.skin[HB.skin] }]} />
        </g>
      );
    };
    const sc = 1.25;
    const fx = 50, fy = 178, gx = 206;
    const dorsum = (x: number): P => [x + 34 * sc, fy - 13 * sc];
    return (
      <Scene2 bg="closeup">
        <Panels split={156} />
        {foot(fx, fy, sc, false)}
        {th(dorsum(fx), 0)}
        <Label x={84} y={214} text="3 sn" />
        {foot(gx, fy, sc, true)}
        {th(dorsum(gx), 42)}
        <Arrow from={[dorsum(gx)[0] + 26, dorsum(gx)[1] - 40]} to={[dorsum(gx)[0] + 26, dorsum(gx)[1] - 78]} w={4} />
      </Scene2>
    );
  },
};

/** Battaniye (dizlere örtü) */
function Blanket2({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <OG sh={[{ d: `M${x1} ${y + 26}Q${x1 + 4} ${y - 6} ${x1 + 20} ${y - 6}H${x2 - 6}Q${x2 + 6} ${y + 6} ${x2} ${y + 26}Z`, f: '#c1554b' }]} />;
}

/* ═══════════════════════ SAHNELER: ilaçsız sağlık ═══════════════════════ */
const SITMA = { who: 'woman', skin: 2, hair: 'scarf', hairC: '#c6574e', top: K.role.bystander4, sleeve: 'long', bottomC: K.pants.dark } as const;
/** Testi (eğik, döker). x,y ağız; a eğim */
function Jug({ x, y, a = -45, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={[
        { d: 'M24 -30Q40 -24 34 4Q30 18 22 14', st: K.out, sw: 4 },
        { d: 'M-16 -36H16L18 -26Q30 -6 22 20Q16 34 0 34Q-16 34 -22 20Q-30 -6 -18 -26Z', f: M.clay },
        { d: 'M-16 -36L-26 -44L-12 -36Z', f: M.clay },
      ]} />
    </g>
  );
}
/** Uyuyan baş (yukarıdan-yandan, yastıkta). x,y merkez */
function SleepHead({ x, y, r = 14, hair = K.hair.black, skin = K.skin[2] }: { x: number; y: number; r?: number; hair?: string; skin?: string }) {
  return (
    <g>
      <OG sh={[{ d: ell([x - r * 0.25, y], r * 1.05, r * 1.0), f: hair }, { d: ell([x + r * 0.12, y + r * 0.1], r * 0.8, r * 0.85), f: skin }]} />
      <path d={`M${x + r * 0.05} ${y - r * 0.05}q${r * 0.18} ${r * 0.14} ${r * 0.36} 0M${x + r * 0.05} ${y + r * 0.35}q${r * 0.2} ${r * 0.1} ${r * 0.4} 0`} stroke={K.out} stroke-width={1.3} fill="none" stroke-linecap="round" />
    </g>
  );
}
/** Gözlük (önden). x,y köprü ortası */
function Specs({ x, y, s = 1, broken = false }: { x: number; y: number; s?: number; broken?: boolean }) {
  return (
    <g transform={tr(x, y, s)}>
      <g fill="none" stroke-linecap="round">
        <path d={broken ? 'M-62 -6L-84 -2' : 'M-62 -6L-96 -12'} stroke={K.out} stroke-width={7 / s} />
        <path d={broken ? 'M-62 -6L-84 -2' : 'M-62 -6L-96 -12'} stroke="#5a4a6a" stroke-width={4 / s} />
        <path d="M62 -6L96 -12" stroke={K.out} stroke-width={7 / s} />
        <path d="M62 -6L96 -12" stroke="#5a4a6a" stroke-width={4 / s} />
      </g>
      <OG ow={OW / s} sh={[
        { d: rrect(-62, -26, 52, 42, 16), f: '#5a4a6a' },
        { d: rrect(10, -26, 52, 42, 16), f: '#5a4a6a' },
        { d: rrect(-56, -20, 40, 30, 12), f: '#dfeef6' },
        { d: rrect(16, -20, 40, 30, 12), f: '#dfeef6' },
        { d: 'M-10 -12Q0 -20 10 -12', st: '#5a4a6a', sw: 4 },
      ]} />
    </g>
  );
}
const S3: Record<string, () => JSX.Element> = {
  /* ───────── Diyabet ───────── */
  // Tabağın yarısı sebze ve ot, dörtte biri baklagil ve yumurta, dörtte biri kepekli tahıl; köşede şekerli içecek ve tatlı (yasak)
  'sf-mb-diyabet-tabak': () => {
    const c: P = [128, 124], r = 92;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: circ(c, r + 12), f: '#f6f7f9' }]} />
        <OG sh={[
          { d: `M${c[0]} ${c[1] - r}A${r} ${r} 0 0 0 ${c[0]} ${c[1] + r}Z`, f: '#7cc05a' },
          { d: `M${c[0]} ${c[1] - r}A${r} ${r} 0 0 1 ${c[0] + r} ${c[1]}H${c[0]}Z`, f: '#c9874e' },
          { d: `M${c[0] + r} ${c[1]}A${r} ${r} 0 0 1 ${c[0]} ${c[1] + r}V${c[1]}Z`, f: M.bulgur },
        ]} />
        {[[70, 90], [92, 130], [66, 160], [96, 196], [100, 70], [60, 126]].map(([x, y], i) => <Lf key={i} x={x} y={y} a={i * 60} len={22} w={7} c={i % 2 ? '#3f8a3e' : '#5aa84f'} />)}
        {[[150, 80], [170, 70], [186, 96], [162, 104], [146, 54]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={6} ry={4} fill={M.lentil} stroke={K.out} stroke-width={0.8} />)}
        <OG sh={[{ d: ell([196, 70], 13, 9), f: '#fbfaf2' }, { d: circ([196, 70], 5), f: '#f2c94c' }]} />
        <g fill={shade(M.bulgur, 0.3)}>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={140 + (i * 13.3) % 70} cy={132 + (i * 7.7) % 60} r={1.6} />)}</g>
        <Inset x={240} y={40} w={70} h={150}>
          <OG sh={[{ d: 'M262 128V84Q262 74 268 70V60H280V70Q286 74 286 84V128Z', f: '#c9483a' }, { d: rrect(266, 54, 16, 8, 2), f: '#f2c94c' }]} />
          <OG sh={[{ d: 'M252 176L292 160V178H252Z', f: '#f3d9a8' }, { d: 'M252 168L292 152V160L252 176Z', f: '#e88aa8' }]} />
          <Bad x={296} y={52} r={10} />
        </Inset>
      </Scene2>
    );
  },
  // Köy yolunda tempolu yürüyen orta yaşlı kadın ve adam; 30 dk
  'sf-mb-yuruyus': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <Tree x={36} y={196} s={0.8} />
      <Tree x={292} y={192} s={0.7} kind="pine" />
      <Person {...CAST.diyabetEs} x={110} y={222} s={1.05} pose={{ ...POSE.walk, face: 'calm' }} />
      <Person {...CAST.diyabet} x={186} y={226} s={1.1} pose={{ ...POSE.walk, face: 'calm' }} />
      <Timer x={236} y={50} r={20} text="30 dk" />
    </Scene2>
  ),
  // Tabureye oturmuş adam ayağına bakıyor (tabanı yukarı çevirmiş); büyüteçte küçük bir kabarcık
  'sf-mb-ayak-kontrol': () => {
    // Yakın plan: çıplak ayak tabanı; tabandaki küçük kızarık yara büyüteç altında, turuncu kesik halkayla.
    const sk = K.skin[HD.skin];
    const cx = 160, cy = 128;
    const toes: [number, number, number][] = [[-30, -76, 11], [-10, -84, 8.5], [6, -84, 8], [20, -80, 7.4], [33, -72, 6.6]];
    return (
      <Scene2 bg="closeup">
        <g transform={tr(cx, cy, 1.25, 8)}>
          <OG ow={OW / 1.25} sh={[
            { d: 'M-30 -62C-40 -40 -40 -10 -30 14C-24 34 -26 58 -14 72C-2 82 18 80 24 66C30 50 26 30 32 10C40 -14 42 -44 36 -62C26 -76 -18 -78 -30 -62Z', f: sk },
            ...toes.map(([x, y, r]) => ({ d: circ([x, y], r), f: sk })),
          ]} />
          <path d="M-16 -46Q2 -38 22 -46M-10 40Q4 46 18 40" stroke={shade(sk, 0.22)} stroke-width={1.4} fill="none" />
          <ellipse cx={-6} cy={-6} rx={7} ry={5} fill="#d9574e" stroke={K.out} stroke-width={1} />
          <ellipse cx={-6} cy={-6} rx={16} ry={13} fill="none" stroke={K.action} stroke-width={2.4} stroke-dasharray="4 3" />
        </g>
        {/* büyüteç yaranın üstünde */}
        <circle cx={cx - 2} cy={cy - 4} r={34} fill="#ffffff" opacity={0.25} stroke={K.out} stroke-width={5} />
        <circle cx={cx - 2} cy={cy - 4} r={34} fill="none" stroke="#6b4a32" stroke-width={2.4} />
        <Rod d={line([[cx + 22, cy + 20], [cx + 70, cy + 70]])} w={10} c="#6b4a32" />
      </Scene2>
    );
  },


  /* ───────── Tansiyon ───────── */
  // Silme bir çay kaşığı tuz: günde 5 g'ın altında; köşede tuzlukla aşırı tuzlanan tabak (yasak)
  'sf-mb-tuz-olcu': () => (
    <Scene2 bg="closeup">
      <TSpoon x={100} y={134} a={0} s={2.4} fill="#ffffff" heap={6} />
      <Label x={110} y={186} text="< 5 g / gün" size={17} />
      <Inset x={222} y={36} w={86} h={150}>
        <OG sh={[{ d: ell([264, 160], 34, 9), f: '#f6f7f9' }, { d: ell([264, 157], 22, 5), f: '#e0a050' }]} />
        <g transform="translate(272 92) rotate(150)">
          <OG sh={[{ d: rrect(-10, -24, 20, 36, 5), f: '#f4f1ea' }, { d: 'M-10 -24Q0 -36 10 -24Z', f: M.metal }]} />
        </g>
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={258 + (i % 3) * 6} cy={118 + i * 6} r={1.6} fill={K.out} />)}
        <Bad x={296} y={50} r={10} />
      </Inset>
    </Scene2>
  ),
  // Kasede suda bekletilen salamura peynir ve turşu; eski su dökülüp yeni su ekleniyor (döngü); birkaç saat
  'sf-mb-tuz-alma': () => (
    <Scene2 bg="closeup">
      <g>
        <OG sh={[{ d: 'M40 110H240Q240 210 180 220H100Q40 210 40 110Z', f: M.glass, op: 0.85 }]} />
        <path d="M44 122H236Q234 204 178 216H102Q46 204 44 122Z" fill={K.water} opacity={0.4} />
        {[[90, 186], [130, 196], [110, 160], [150, 170]].map(([x, y], i) => <rect key={i} x={x - 16} y={y - 12} width={32} height={24} rx={4} fill={M.cheese} stroke={K.out} stroke-width={1.3} transform={`rotate(${i * 12 - 10} ${x} ${y})`} />)}
        {[[190, 176], [200, 196]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={22} ry={9} fill="#8aa04a" stroke={K.out} stroke-width={1.3} transform={`rotate(${i * 20 - 10} ${x} ${y})`} />)}
        <path d="M40 110H240Q240 210 180 220H100Q40 210 40 110Z" fill="none" stroke={K.out} stroke-width={1.6} />
      </g>
      <path d="M236 70Q222 90 214 128" stroke={K.water} stroke-width={7} fill="none" stroke-linecap="round" opacity={0.85} />
      <Hand {...handAt({ a: -150, s: 0.85, pose: 'fist' as const, side: 'R' as const }, 'grip', [282, 50])} arm={120} sleeve={HT.sleeve} skin={HT.skin} />
      <Jug x={250} y={62} a={-50} s={1.0} />
      <Label x={90} y={60} text="birkaç saat" size={14} />
    </Scene2>
  ),
  // Sandalyede sırtı dayalı, ayakları yerde kadın; kolu masada kalp hizasında, üst kolda manşon; yanında defter
  'sf-mb-tansiyon-olcum': () => {
    const rest: P = [214, 150];
    const p: PersonProps = { ...CAST.tansiyon, x: 120, y: 226, s: 1.15, pose: { ...POSE.sitChair, spine: -94, head: -92, armF: { to: rest }, armB: [86, 30], face: 'neutral' } };
    const r = rig(p);
    const cuff = lerp(r.shoulderF, r.elbowF, 0.5);
    const ang = Math.atan2(r.elbowF[1] - r.shoulderF[1], r.elbowF[0] - r.shoulderF[0]) / R;
    return (
      <Scene2 bg="indoor">
        <Chair x={r.hip[0] - 4} y={226} seat={44 * 1.15} s={1.15} />
        <Table x={170} y={226} w={140} h={76} />
        <Person {...p} over={() => (
          <g>
            <g transform={tr(cuff[0], cuff[1], 1, ang)}>
              <OG sh={[{ d: rrect(-14, -11, 28, 22, 5), f: '#3f6fb0' }]} />
            </g>
            <path d={`M${cuff[0] + 6} ${cuff[1] + 8}Q${cuff[0] + 30} ${cuff[1] + 30} 254 146`} fill="none" stroke={K.out} stroke-width={2.4} />
          </g>
        )} />
        <OG sh={[{ d: rrect(244, 126, 34, 24, 4), f: '#e6e8eb' }, { d: rrect(249, 130, 24, 10, 2), f: '#b8e0c8' }]} />
        <Notebook x={290} y={140} s={0.36} a={-10} />
      </Scene2>
    );
  },

  /* ───────── Astım ───────── */
  // Bacalı sobada ateş, duman bacadan dışarı; çocuk sobadan uzakta pencere kenarında (onay); köşede odada açık ateş (yasak)
  'sf-mb-astim-duman': () => (
    <Scene2 bg="indoor">
      <Window x={30} y={60} w={70} h={64} />
      <Person {...CAST.astim} x={72} y={226} s={1.0} pose={{ ...POSE.sitChair, face: 'calm' }} />
      <Chair x={70} y={226} seat={44} s={0.95} />
      {/* soba ve baca */}
      <OG sh={[
        { d: rrect(184, 140, 52, 74, 6), f: '#4a4e57' },
        { d: rrect(178, 134, 64, 10, 3), f: '#3b3f48' },
        { d: rrect(200, 30, 14, 106, 2), f: '#6b717a' },
        { d: rrect(200, 30, 120, 14, 2), f: '#6b717a' },
        { d: rrect(196, 162, 28, 24, 4), f: '#2b2523' },
      ]} />
      <Flame x={210} y={184} s={0.36} />
      <OG sh={[{ d: rrect(194, 214, 6, 10, 1), f: '#3b3f48' }, { d: rrect(220, 214, 6, 10, 1), f: '#3b3f48' }]} />
      <Ok x={130} y={62} r={14} />
      <Inset x={250} y={130} w={60} h={80}>
        <Campfire x={280} y={200} s={0.8} />
        <g opacity={0.8}>{[0, 1, 2].map((i) => <circle key={i} cx={276 + i * 4} cy={168 - i * 12} r={7 + i * 2} fill={K.smoke} />)}</g>
        <Bad x={296} y={142} r={9} />
      </Inset>
    </Scene2>
  ),
  // Duvardaki küflü leke eldivenli el ve sabunlu fırçayla ovuluyor; yanda kova
  'sf-mb-astim-kuf': () => {
    const brush: P = [140, 104];
    const h = handAt({ a: 40, s: 0.85, pose: 'fist' as const, side: 'R' as const }, 'grip', [brush[0] + 14, brush[1] + 18]);
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <rect x={0} y={0} width={320} height={240} fill="#e9e0d0" />
        <g fill="#4a5a3a" opacity={0.75}>{Array.from({ length: 34 }, (_, i) => <circle key={i} cx={60 + (i * 37) % 140 + (i % 3) * 4} cy={50 + (i * 23) % 110} r={2 + (i % 4)} />)}</g>
        <g fill="#fff" opacity={0.85}>{[[120, 120], [134, 112], [150, 126], [128, 134]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6 + (i % 2) * 3} stroke="#c9d3db" />)}</g>
        <g transform={tr(brush[0], brush[1], 1, 30)}>
          <OG sh={[{ d: rrect(-30, -10, 60, 20, 6), f: M.woodL }, { d: rrect(-28, 8, 56, 8, 2), f: '#e8d6a8' }]} />
        </g>
        <GHand {...h} arm={130} sleeve={HS.sleeve} skin={HS.skin} />
        <Arrow from={[84, 160]} to={[176, 160]} bend={0.2} w={4} />
        <OG sh={[{ d: 'M236 230L240 180H300L304 230Z', f: '#7fb0d8' }, { d: ell([270, 180], 30, 6), f: tint(K.water, 0.4) }]} />
      </Scene2>
    );
  },
  // Avluda ipte güneşte kuruyan çarşaf ve yastık kılıfı; köşede kuş tüyü yastık (yasak)
  'sf-mb-astim-yatak': () => (
    <Scene2 bg="outdoor">
      <Sun x={44} y={42} r={16} />
      <Rod d="M20 220V64" w={4} c="#9a7046" />
      <Rod d="M300 220V64" w={4} c="#9a7046" />
      <path d="M20 70Q160 92 300 70" stroke={K.out} stroke-width={2} fill="none" />
      <OG sh={[{ d: 'M44 74Q90 82 140 82L136 190Q90 196 48 186Z', f: '#f4f1ea' }, { d: 'M158 82Q190 82 220 79L218 150Q190 154 160 152Z', f: '#bcd8ee' }]} />
      <g fill="#e2c35a">{[54, 92, 130, 172, 210].map((x) => <rect key={x} x={x - 2} y={74 + Math.abs(160 - x) * 0.08} width={5} height={10} rx={1} stroke={K.out} stroke-width={0.8} />)}</g>
      <Inset x={232} y={118} w={76} h={78}>
        <OG sh={[{ d: smooth([[240, 172], [254, 150], [290, 148], [302, 170], [288, 186], [252, 186]], true), f: '#f4f1ea' }]} />
        {[[262, 140], [280, 136], [272, 130]].map(([x, y], i) => <path key={i} d={`M${x} ${y}q4 -8 8 -2q-4 4 -8 2z`} fill="#fff" stroke={K.out} stroke-width={0.8} />)}
        <Bad x={296} y={130} r={9} />
      </Inset>
    </Scene2>
  ),

  /* ───────── Sıtma ───────── */
  // İçinde su birikmiş kova ters çevriliyor; çevrede ters saksı altı ve kapağı kapalı varil
  'sf-mb-durgun-su': () => {
    const bk: P = [190, 150]; // kova merkezi
    const p: PersonProps = { ...SITMA, x: 120, y: 226, s: 1.12, pose: { ...POSE.standSide, spine: -84, head: -60, armF: { to: [bk[0] + 6, bk[1] - 22] }, armB: { to: [bk[0] - 18, bk[1] + 10] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <path d={`M${bk[0] + 14} ${bk[1] + 26}Q${bk[0] + 30} ${bk[1] + 50} ${bk[0] + 26} 214`} stroke={K.water} stroke-width={12} fill="none" stroke-linecap="round" opacity={0.85} />
        <OG sh={[{ d: ell([bk[0] + 30, 218], 32, 6), f: tint(K.water, 0.2) }]} />
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <g transform={tr(bk[0], bk[1], 1, 130)}>
          <OG sh={[{ d: 'M-26 -28H26L20 28H-20Z', f: '#7fb0d8' }, { d: ell([0, -28], 26, 6), f: tint(K.water, 0.3) }]} />
        </g>
        <Person {...p} only={['armF']} />
        <OG sh={[{ d: 'M250 222V160Q250 152 258 152H296Q304 152 304 160V222Z', f: '#5a7a9a' }, { d: rrect(246, 146, 62, 10, 3), f: '#3f5a74' }]} />
        <OG sh={[{ d: 'M20 222L28 204H62L70 222Z', f: M.clay }]} />
        <Mosq x={46} y={124} s={1.6} a={-10} />
        <Bad x={70} y={108} r={11} />
        <Arrow from={[236, 96]} to={[226, 150]} bend={-0.4} w={4} />
      </Scene2>
    );
  },
  // Pencereye gerilmiş sık sineklik; dışarıdaki sivrisinekler içeri giremiyor
  'sf-mb-sineklik': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: rrect(60, 30, 200, 160, 4), f: '#f4f1ea' }, { d: rrect(72, 42, 176, 136, 2), f: '#bfe3f5' }]} />
      <path d="M72 140Q120 120 160 134T248 128V178H72Z" fill="#8fc163" />
      <g stroke="#7d8892" stroke-width={0.9} opacity={0.9}>
        {Array.from({ length: 30 }, (_, i) => <path key={'v' + i} d={`M${74 + i * 6} 42V178`} />)}
        {Array.from({ length: 23 }, (_, i) => <path key={'h' + i} d={`M72 ${44 + i * 6}H248`} />)}
      </g>
      <g fill="#f4f1ea" stroke={K.out} stroke-width={1}>{[[72, 42], [244, 42], [72, 174], [244, 174], [158, 42], [158, 174]].map(([x, y], i) => <circle key={i} cx={x + 2} cy={y + 2} r={3} />)}</g>
      <OG sh={[{ d: rrect(52, 186, 216, 10, 3), f: '#f4f1ea' }]} />
      <Mosq x={120} y={86} s={1.5} a={-10} />
      <Mosq x={196} y={70} s={1.3} a={15} />
      <Mosq x={210} y={120} s={1.4} a={-5} />
      <Ok x={290} y={40} r={14} />
    </Scene2>
  ),
  // Gece: yatağın üstünden asılmış cibinlik, kenarları yatak altına sıkıştırılmış; içinde uyuyan anne ve çocuk; dışarıda sivrisinekler
  'sf-mb-cibinlik': () => (
    <Scene2 bg="indoor" wall="#4a5577">
      <rect y={200} width={320} height={40} fill="#6b5a4a" />
      <OG sh={[{ d: rrect(30, 176, 260, 26, 4), f: '#8a6a4a' }, { d: rrect(34, 168, 252, 14, 4), f: '#f4f1ea' }]} />
      <OG sh={[{ d: rrect(44, 150, 70, 20, 8), f: '#fbfaf7' }]} />
      <SleepHead x={70} y={150} r={15} hair={SITMA.hairC} skin={K.skin[SITMA.skin]} />
      <SleepHead x={104} y={156} r={11} hair={K.hair.black} skin={K.skin[2]} />
      <OG sh={[{ d: 'M116 172Q118 142 140 140Q210 132 270 142Q284 150 282 172Z', f: '#7aa6d6' }]} />
      <path d="M160 18L36 182H284Z" fill={M.net} opacity={0.4} stroke="#d5dde3" stroke-width={1.6} />
      <g stroke="#d5dde3" stroke-width={0.8} opacity={0.8}>{[60, 100, 140, 180, 220, 260].map((x) => <path key={x} d={`M160 20L${x} 182`} />)}</g>
      <circle cx={160} cy={18} r={4} fill={M.wood} stroke={K.out} stroke-width={1.2} />
      <Arrow from={[30, 150]} to={[46, 192]} bend={-0.3} w={4} />
      <Arrow from={[292, 150]} to={[276, 192]} bend={0.3} w={4} />
      <Mosq x={40} y={70} s={1.3} />
      <Mosq x={280} y={60} s={1.3} a={10} />
      <Mosq x={270} y={110} s={1.1} a={-10} />
    </Scene2>
  ),

  /* ───────── Gözlük ───────── */
  // Kırık gözlük sapı ince telle çerçeveye sarılıyor (ok sarma yönünde)
  'sf-mb-gozluk-tel': () => (
    <Scene2 bg="closeup">
      <G x={-60} y={-40} s={1.4}>
        <Specs x={176} y={118} s={1.25} broken />
        <path d="M40 140L70 124" stroke={K.out} stroke-width={8} stroke-linecap="round" />
        <path d="M40 140L70 124" stroke="#5a4a6a" stroke-width={5} stroke-linecap="round" />
        <g stroke="#9aa6b2" stroke-width={2.2} fill="none">{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={74 + i * 5} cy={122 - i * 1.2} rx={3} ry={8} />)}</g>
        <path d="M100 116q14 -12 6 -26" stroke="#9aa6b2" stroke-width={2.2} fill="none" />
      </G>
      <Arrow from={[60, 52]} to={[96, 80]} bend={-0.6} w={5} />
    </Scene2>
  ),
  // Gözüne yakın tuttuğu koyu karttaki küçük deliklerden kitaba bakan kadın
  'sf-mb-igne-deligi': () => {
    // Yandan: yaşlı kadın delikli koyu kartı gözüne yakın tutuyor, öbür eliyle kitabı uzakta tutup okuyor
    const p0: PersonProps = { ...CAST.gozluk, x: 92, y: 238, s: 1.45, pose: { ...POSE.standSide, head: -88, face: 'neutral' } };
    const r0 = rig(p0);
    const card: P = [r0.head[0] + r0.headR + 8, r0.head[1] - 2];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: [card[0] + 2, card[1] + 22] }, armB: { to: [250, r0.head[1] + 38] } } };
    const hb = rig(p).handB;
    const book: P = [hb[0] - 4, hb[1] - 8];
    return (
      <Scene2 bg="indoor">
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <g transform={tr(book[0], book[1], 1, 0)}>
          <OG sh={[{ d: 'M0 -34L42 -40V40L0 46Z', f: '#f7f3e6' }, { d: 'M0 -34L-8 -38V42L0 46Z', f: '#c1554b' }]} />
          <g stroke="#9aa6b6" stroke-width={2}>{[-22, -10, 2, 14, 26].map((y) => <path key={y} d={`M6 ${y}L36 ${y - 4}`} />)}</g>
        </g>
        <Person {...p} only={['armF']} />
        <OG sh={[{ d: rrect(card[0] - 5, card[1] - 22, 11, 44, 3), f: '#2b2d3a' }]} />
        {[-12, -4, 4, 12].map((dy) => <circle key={dy} cx={card[0] + 0.5} cy={card[1] + dy} r={1.4} fill="#fff" />)}
        <path d={`M${card[0] + 8} ${card[1]}L${book[0] - 2} ${book[1] - 4}`} stroke={K.action} stroke-width={2} stroke-dasharray="5 4" />
      </Scene2>
    );
  },

  // Pencere önünde gün ışığında okuyan yaşlı kadın; su dolu yuvarlak şişe yazıyı büyütüyor
  'sf-mb-isik-yakin': () => {
    // Yaşlı kadın pencerenin önündeki masada oturmuş, gün ışığının düştüğü kâğıda büyük harflerle yazıyor
    const paper: P = [196, 152];
    const p: PersonProps = { ...CAST.gozluk, x: 120, y: 226, s: 1.12, pose: { ...POSE.sitChair, spine: -80, head: -58, armF: { to: [paper[0] + 4, paper[1] - 2] }, armB: { to: [paper[0] - 18, paper[1] + 1] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Window x={196} y={30} w={96} h={80} />
        <g opacity={0.4} fill="#ffe27a"><path d="M200 108L292 108L240 158L168 158Z" /></g>
        <Chair x={114} y={226} seat={44 * 1.12} s={1.1} />
        <Table x={164} y={226} w={146} h={70} />
        <OG sh={[{ d: 'M172 154L232 150L234 157L174 161Z', f: '#f7f3e6' }]} />
        <path d="M184 154l8 -1M196 153l10 -1M210 152l12 -1" stroke={K.ink} stroke-width={1.6} />
        <Person {...p} over={(rr) => <OG sh={[{ d: capsule([rr.handF[0] - 2, rr.handF[1] + 2], 1.4, [rr.handF[0] + 12, rr.handF[1] - 12], 2.2), f: '#2b2d3a' }]} />} />
      </Scene2>
    );
  },


  /* ───────── Diş ───────── */
  // Yanağı ve çene altı şişmiş, ağrılı adam çenesini tutuyor; uyarı ve 112
  'sf-mb-dis-tehlike': () => {
    const p: PersonProps = { ...CAST.dis, x: 140, y: 96, ax: 'head', ay: 'head', s: 2.3, pose: { ...POSE.stand, face: 'worried' } };
    const r = rig(p);
    const cheek: P = [r.head[0] + r.headR * 0.78, r.head[1] + r.headR * 0.5];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head', 'armB', 'armF']} over={() => (
          <OG sh={[{ d: smooth([[cheek[0] - 6, cheek[1] - 14], [cheek[0] + 12, cheek[1] - 8], [cheek[0] + 16, cheek[1] + 8], [cheek[0] + 4, cheek[1] + 20], [cheek[0] - 10, cheek[1] + 14]], true), f: K.skin[2] }]} />
        )} />
        <Warn x={268} y={60} r={22} />
        <Label x={268} y={110} text="112" size={18} bg={K.danger} color="#fff" />
        <g fill="none" stroke={K.danger} stroke-width={2.4} stroke-linecap="round">
          <path d={`M${cheek[0] + 32} ${cheek[1] - 6}q8 12 0 26`} />
          <path d={`M${cheek[0] + 40} ${cheek[1] - 12}q12 18 0 38`} />
        </g>
      </Scene2>
    );
  },
  // Adam ılık tuzlu su bardağından ağzını çalkalıyor; yanında tuz kabı ve yarım çay kaşığı tuz
  'sf-mb-tuzlu-su-calkalama': () => {
    // Bir su bardağı ılık kaynamış su; el, yarım çay kaşığı tuzu bardağa döküyor
    const tip: P = [196, 92];
    const h = handAt({ a: -140, s: 0.95, pose: 'fist' as const, side: 'R' as const }, 'grip', [262, 52]);
    return (
      <Scene2 bg="closeup">
        <Glass x={150} y={216} w={84} h={110} lv={0.8} op={0.55} />
        <g fill="none" stroke="#9fb3c2" stroke-width={2.6} stroke-linecap="round">
          <path d="M132 96c-5 -7 5 -11 0 -19M156 92c-5 -7 5 -11 0 -19" />
        </g>
        <OG sh={[{ d: capsule(tip, 2.2, [262, 52], 3), f: '#c3ccd6' }, { d: ell([tip[0] - 6, tip[1] + 3], 10, 6), f: '#c3ccd6', t: `rotate(-30 ${tip[0] - 6} ${tip[1] + 3})` }]} />
        <OG sh={[{ d: `M${tip[0] - 14} ${tip[1] + 6}Q${tip[0] - 6} ${tip[1] + 2} ${tip[0] + 2} ${tip[1] + 2}Z`, f: M.salt }]} />
        <g fill="#fff" stroke={K.out} stroke-width={0.6}>{[[176, 106], [172, 116], [178, 124], [170, 132]].map(([x, y], i) => <rect key={i} x={x} y={y} width={3} height={3} />)}</g>
        <Hand {...h} arm={140} sleeve={CAST.dis.top} skin={CAST.dis.skin} />
        <Label x={66} y={44} text="½ çay kaşığı" size={14} />
      </Scene2>
    );
  },

  // Masada yumuşak yemekler (yukarıdan): patates ezmesi, çorba, yoğurt; havanda dövülmüş ceviz
  'sf-mb-yumusak-yemek': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: rrect(14, 14, 292, 212, 14), f: '#c99057' }]} />
      <OG sh={[{ d: circ([92, 86], 52), f: '#f6f7f9' }, { d: circ([92, 86], 38), f: '#f1dc9a' }]} />
      <path d="M70 80q10 -10 20 0t20 0" stroke={shade('#f1dc9a', 0.3)} stroke-width={2} fill="none" />
      <OG sh={[{ d: circ([206, 82], 46), f: '#d58a5a' }, { d: circ([206, 82], 34), f: '#e0a050' }]} />
      <OG sh={[{ d: circ([102, 172], 36), f: '#7fb0d8' }, { d: circ([102, 172], 26), f: '#fbfaf2' }]} />
      <OG sh={[{ d: circ([222, 170], 40), f: '#b5ada2' }, { d: circ([222, 170], 28), f: '#8a6a4a' }]} />
      <g fill="#c9a06a">{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={222 + Math.cos(i * 2.3) * (4 + (i % 4) * 5)} cy={170 + Math.sin(i * 2.3) * (4 + (i % 4) * 5)} r={2} />)}</g>
      <Spoon x={150} y={130} a={30} L={70} />
    </Scene2>
  ),

  /* ───────── Uyku ───────── */
  // Sabah: kapı önünde çay bardağıyla oturan adam alçak sabah güneşine dönük
  'sf-mb-sabah-isik': () => {
    const p: PersonProps = { ...CAST.uyku, x: 112, y: 226, s: 1.12, pose: { ...POSE.sitChair, head: -94, armF: { at: 'chest', d: [18, 8] }, face: 'calm' } };
    return (
      <Scene2 bg="outdoor">
        <Sun x={286} y={150} r={20} />
        <g opacity={0.3} fill="#ffe27a"><path d="M270 140L120 100L120 200L270 160Z" /></g>
        <OG sh={[{ d: rrect(0, 50, 80, 176, 2), f: '#f0dcc0' }, { d: rrect(18, 96, 46, 110, 1), f: '#3a3530' }, { d: 'M18 96L44 102V210L18 206Z', f: '#8a5a3a' }]} />
        <OG sh={[{ d: rrect(80, 196, 64, 30, 4), f: M.stone }]} />
        <Person {...p} over={(rr) => <Glass x={rr.handF[0] + 4} y={rr.handF[1] + 6} w={12} h={18} fill="#b5501e" lv={0.75} op={1} />} />
      </Scene2>
    );
  },
  // Akşam: loş, sarı kandil ışığında hazırlanmış yer yatağı; kapatılmış telefon ve sönük lamba
  'sf-mb-aksam-los': () => (
    <Scene2 bg="indoor" wall="#5a5066">
      <rect y={200} width={320} height={40} fill="#6e5a48" />
      <circle cx={232} cy={150} r={70} fill="#ffcf6a" opacity={0.22} />
      <circle cx={232} cy={150} r={38} fill="#ffcf6a" opacity={0.25} />
      <OG sh={[{ d: rrect(20, 200, 170, 20, 6), f: '#c9b8d8' }, { d: rrect(28, 190, 40, 14, 6), f: '#f4f1ea' }, { d: rrect(70, 194, 120, 18, 6), f: '#7a6aa8' }]} />
      <OG sh={[{ d: rrect(206, 176, 70, 8, 2), f: M.wood }, { d: rrect(212, 184, 6, 34, 2), f: shade(M.wood, 0.2) }, { d: rrect(264, 184, 6, 34, 2), f: shade(M.wood, 0.2) }]} />
      <OG sh={[{ d: 'M220 176Q216 162 232 160Q248 162 244 176Z', f: M.clay }]} />
      <Flame x={232} y={162} s={0.22} />
      <OG sh={[{ d: rrect(252, 168, 18, 8, 2), f: '#2b2d3a' }]} />
      <OG sh={[{ d: 'M284 40V60', st: K.out, sw: 2 }, { d: 'M272 60H296L292 74H276Z', f: '#8e8a7a' }, { d: ell([284, 76], 6, 4), f: '#9a9a9a' }]} />
    </Scene2>
  ),
};

export const SCENES: Record<string, () => JSX.Element> = { ...S1, ...S2, ...S3 };
