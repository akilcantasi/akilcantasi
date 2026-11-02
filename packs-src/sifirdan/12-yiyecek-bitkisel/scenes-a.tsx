// Sıfırdan paketi sahneleri (a): Yiyecek bulma — bitkiler ve mevsimler. Bkz. docs/agents/SIFIRDAN_CIZIM.md
// İlke: bu çizimler tanıma kartı DEĞİLDİR. Yenen bitkiler bilerek şematik çizilir; karşılaştırmalarda
// yenen tarafa yeşil onay konmaz, zehirli tarafa büyük kırmızı yasak konur ve altta
// "EMİN DEĞİLSEN YEME" şeridi bulunur. Termiye ve mürdümük için "yenir" izlenimi veren sahne yoktur.
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, Campfire, Hand, K, Label, No, OG, OW, Ok, Person, Phone, POSE, Pot, Rock,
  Scene2, Tree, Water, Waves, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═══════════════════════ OYUNCU KADROSU (paket geneli) ═══════════════════════ */
// Toplayıcı: başörtülü kadın, buğday ten, camgöbeği üst, haki pantolon. Bütün toplama
// sahnelerinde ve yakın plan ellerde (HT) o görünür.
// Bilen yaşlı: yaşlı kadın, esmer, mor üst — yalnız "yöreyi bilen" eli olarak (HY).
// Çocuk: kız çocuk, kumral at kuyruğu, hardal üst (çocuk rehberi).
// Yürüyüşçü: bıyıklı adam, kiremit mont (kar rehberi).
const CAST = {
  toplayici: { who: 'woman', skin: 1, hair: 'scarf', hairC: '#3f6f8f', top: K.role.helper, sleeve: 'long', bottom: 'pants', bottomC: K.pants.khaki } as const,
  cocuk: { who: 'girl', skin: 1, hair: 'ponytail', hairC: K.hair.brown, top: K.role.bystander2, bottom: 'pants', bottomC: K.pants.denim } as const,
  yuruyuscu: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, top: K.role.bystander4, sleeve: 'long', bottomC: K.pants.dark, mustache: true } as const,
};
const HT = { skin: 1, sleeve: K.role.helper } as const; // toplayıcının eli
const HY = { skin: 2, sleeve: K.role.bystander } as const; // bilen yaşlının eli
const HC = { skin: 1, sleeve: K.role.bystander2 } as const; // çocuğun eli

/* ═══════════════════════ MALZEME RENKLERİ (paket geneli) ═══════════════════════ */
const C = {
  soil: '#9a7552',
  mud: '#6f5843',
  stone: '#b5b1a7',
  wood: '#a87449',
  bark: '#7a5236',
  inner: '#f0dca8',
  steel: '#b9c2cc',
  glass: '#dcecf2',
  leaf: '#5aa84f',
  leafDk: '#3f8a3e',
  young: '#9bd36a',
  white: '#fbfaf5',
  snow: '#f4f8fb',
  cloth: '#f4f1ea',
  pink: '#e58fb8',
  purple: '#8a5bb8',
  berry: '#3a2140',
  black: '#1f1a22',
  red: '#d8432e',
  nut: '#a0703f',
  mold: '#3d3a2c',
};

/* ═══════════════════════ YARDIMCILAR ═══════════════════════ */
const f1 = (n: number) => Math.round(n * 10) / 10;
const tr = (x: number, y: number, s = 1, a = 0, fl = false) => `translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${fl ? -s : s} ${s})`;
const poly = (ps: P[]) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
const line = (ps: P[]) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
const rad = (a: number) => (a * Math.PI) / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(rad(a)) * l, p[1] + Math.sin(rad(a)) * l];

/** Taşınmış/ölçeklenmiş dış hatlı şekil grubu */
function Gx({ x, y, s = 1, a = 0, flip, sh }: { x: number; y: number; s?: number; a?: number; flip?: boolean; sh: Sh[] }) {
  return (
    <g transform={tr(x, y, s, a, flip)}>
      <OG sh={sh} ow={OW / s} />
    </g>
  );
}
/** Eldivenli el: kit eli + mavi eldiven rengi (renk filtresi) */
function GloveDefs() {
  return (
    <defs>
      <filter id="sfybt-glove" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0.18 0.33 0.05 0 0  0.27 0.5 0.08 0 0  0.38 0.7 0.12 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  );
}
function Glove({ children }: { children: ComponentChildren }) {
  return <g filter="url(#sfybt-glove)">{children}</g>;
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
/** Yaprak: x,y taban, a yön */
function Lf({ x, y, a = 0, len = 30, w = 9, c = C.leaf, teeth = 0, shape = 0.8, vein = true }: { x: number; y: number; a?: number; len?: number; w?: number; c?: string; teeth?: number; shape?: number; vein?: boolean }) {
  return (
    <g transform={tr(x, y, 1, a)}>
      <OG sh={[{ d: leafD(len, w, teeth, shape), f: c }, ...(vein ? [{ d: `M2 0L${f1(len * 0.85)} 0`, st: shade(c, 0.3), sw: 1.2 }] : [])]} />
    </g>
  );
}
/** Sap/dal */
function Stem({ pts, w = 3, c = C.leafDk }: { pts: P[]; w?: number; c?: string }) {
  return (
    <g>
      <path d={smooth(pts)} fill="none" stroke={K.out} stroke-width={w + 3} stroke-linecap="round" />
      <path d={smooth(pts)} fill="none" stroke={c} stroke-width={w} stroke-linecap="round" />
    </g>
  );
}
/** Toprak şeridi */
function Soil({ y = 196, c = C.soil, grass = true }: { y?: number; c?: string; grass?: boolean }) {
  return (
    <g>
      <OG sh={[{ d: `M-5 ${y}Q40 ${y - 5} 80 ${y}T160 ${y}T240 ${y}T330 ${y}V250H-5Z`, f: c }]} />
      {grass && (
        <g fill="none" stroke={K.grassShade} stroke-width={2.2} stroke-linecap="round">
          {[18, 64, 120, 196, 252, 300].map((x) => (
            <path key={x} d={`M${x} ${y}l-4 -9M${x} ${y}l1 -11M${x} ${y}l5 -8`} />
          ))}
        </g>
      )}
    </g>
  );
}
/** Panel zemini: x,y sol üst */
function Panel({ x, y = 10, w, h = 196, f = '#f7f4ec' }: { x: number; y?: number; w: number; h?: number; f?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={12} fill={f} stroke={K.out} stroke-width={1.5} />;
}
/** Panel içine kırpma (su vb. taşmasın) */
function InPanel({ id, x, y = 10, w, h = 196, children }: { id: string; x: number; y?: number; w: number; h?: number; children: ComponentChildren }) {
  return (
    <g>
      <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={12} /></clipPath></defs>
      <g clip-path={`url(#${id})`}>{children}</g>
    </g>
  );
}
/** Alt şerit: "EMİN DEĞİLSEN YEME" (karşılaştırma sahnelerinde zorunlu) */
function Emin({ y = 222 }: { y?: number }) {
  return <Label x={160} y={y} text="EMİN DEĞİLSEN YEME" size={12} bg={K.danger} />;
}
/** Kırmızı uyarı üçgeni (C) */
function Warn({ x, y, r = 22 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={tr(x, y, r / 22)}>
      <path d="M0 -22L22 18H-22Z" fill={K.danger} stroke={K.out} stroke-width={2} stroke-linejoin="round" />
      <path d="M0 -8V6" stroke="#fff" stroke-width={4} stroke-linecap="round" />
      <circle cx={0} cy={12} r={2.4} fill="#fff" />
    </g>
  );
}
/** Küçük bıçak. x,y = sap ucu, a yön (0 = sağa) */
function Knife({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      { d: rrect(0, -4, 26, 8, 3), f: C.wood },
      { d: 'M26 -4H58Q66 -2 70 0Q62 4 26 4Z', f: C.steel },
      { d: 'M28 -1H60', st: tint(C.steel, 0.5), sw: 1.4 },
    ]} />
  );
}
/** Makas (açık). x,y = mafsal, a = ağız yönü */
function Scissors({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      { d: 'M0 0L34 -9L36 -6L2 3Z', f: C.steel },
      { d: 'M0 0L34 9L36 6L2 -3Z', f: shade(C.steel, 0.1) },
      { d: 'M0 -1Q-12 -6 -20 -10', st: K.out, sw: 4 },
      { d: 'M0 1Q-12 6 -20 10', st: K.out, sw: 4 },
      { d: ell([-26, -12], 8, 6), f: '#d6453b' },
      { d: ell([-26, 12], 8, 6), f: '#d6453b' },
      { d: ell([-26, -12], 4, 2.6), f: '#e4e9ef' },
      { d: ell([-26, 12], 4, 2.6), f: '#e4e9ef' },
      { d: circ([0, 0], 2.4), f: K.out },
    ]} />
  );
}
/** Toplayıcının eli, verilen noktadaki sapı (makas halkaları) kavrar */
function HoldAt({ at, a = -90, s = 0.9 }: { at: P; a?: number; s?: number }) {
  const hk = { x: 0, y: 0, a, s, pose: 'hold' as const, side: 'L' as const, grip: 22 };
  const g0 = handPoint(hk, 'grip');
  return <Hand {...hk} x={at[0] - g0[0]} y={at[1] - g0[1]} arm={200} sleeve={HT.sleeve} skin={HT.skin} />;
}
/** Beyaz şemsiye çiçek başı. x,y = sapın tepesi */
function Umbel({ x, y, r = 40, c = C.white }: { x: number; y: number; r?: number; c?: string }) {
  const rays = [-160, -138, -116, -90, -64, -42, -20];
  const ends = rays.map((a) => [x + Math.cos(rad(a)) * r, y + Math.sin(rad(a)) * r * 0.62] as P);
  return (
    <g>
      {ends.map((e, i) => <path key={i} d={line([[x, y], e])} stroke={C.leafDk} stroke-width={2} />)}
      {ends.map((e, i) => (
        <g key={'u' + i}>
          <OG sh={[{ d: ell([e[0], e[1] - 4], r * 0.25, r * 0.15), f: c }]} />
          {[-0.12, 0, 0.12].map((dx) => <circle key={dx} cx={e[0] + dx * r} cy={e[1] - 5} r={1.4} fill="#c9c4b0" />)}
        </g>
      ))}
    </g>
  );
}
/** İnce parçalı (maydanoz/havuç benzeri) yaprak */
function Fern({ x, y, a = -90, len = 50, c = C.leaf }: { x: number; y: number; a?: number; len?: number; c?: string }) {
  return (
    <g transform={tr(x, y, 1, a)}>
      <path d={`M0 0H${len}`} stroke={K.out} stroke-width={4} />
      <path d={`M0 0H${len}`} stroke={c} stroke-width={2} />
      {Array.from({ length: 5 }, (_, i) => {
        const t = 0.3 + i * 0.15;
        const L = (len * 0.3) * (1 - i * 0.12);
        return (
          <g key={i}>
            <Lf x={len * t} y={0} a={-48} len={L} w={L * 0.2} teeth={3} c={c} vein={false} />
            <Lf x={len * t} y={0} a={48} len={L} w={L * 0.2} teeth={3} c={c} vein={false} />
          </g>
        );
      })}
      <Lf x={len - 2} y={0} a={0} len={len * 0.24} w={len * 0.06} teeth={3} c={c} vein={false} />
    </g>
  );
}
/** Pileli geniş yaprak (akçöpleme) */
function Pleated({ x, y, a = -90, len = 70, w = 24, c = '#7fb257' }: { x: number; y: number; a?: number; len?: number; w?: number; c?: string }) {
  const ribs = [-0.6, -0.3, 0, 0.3, 0.6];
  return (
    <g transform={tr(x, y, 1, a)}>
      <OG sh={[
        { d: leafD(len, w, 0, 0.75), f: c },
        ...ribs.map((k) => ({ d: `M4 ${f1(k * w * 0.25)}Q${f1(len * 0.45)} ${f1(k * w * 0.95)} ${f1(len * 0.93)} ${f1(k * w * 0.1)}`, st: shade(c, 0.35), sw: 1.6 })),
      ]} />
    </g>
  );
}
/** Şerit yaprak demeti (topraktan çıkan). x,y taban */
function StrapTuft({ x, y, s = 1, c = C.leaf, n = 5, w = 7 }: { x: number; y: number; s?: number; c?: string; n?: number; w?: number }) {
  const as = n === 5 ? [-122, -104, -90, -76, -58] : [-114, -90, -66];
  return (
    <g transform={tr(x, y, s)}>
      {as.map((a, i) => (
        <Lf key={i} x={0} y={0} a={a} len={70 - Math.abs(a + 90) * 0.5} w={w} c={i % 2 ? shade(c, 0.12) : c} shape={0.6} />
      ))}
    </g>
  );
}
/** Tane (meyve). x,y merkez */
function Berry({ x, y, r = 6, c = C.berry, shine = true }: { x: number; y: number; r?: number; c?: string; shine?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c} stroke={K.out} stroke-width={1.3} />
      {shine && <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#fff" opacity={0.75} />}
    </g>
  );
}
/** Kar kümesi (dal üstünde) */
function SnowCap({ x, y, w = 20 }: { x: number; y: number; w?: number }) {
  return <OG sh={[{ d: `M${x - w / 2} ${y}Q${x - w / 2} ${y - 7} ${x} ${y - 7}Q${x + w / 2} ${y - 7} ${x + w / 2} ${y}Z`, f: C.snow }]} />;
}
/** Kar tanesi simgesi */
function Flake({ x, y, r = 10, c = '#5b8fc7' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g stroke={c} stroke-width={2.4} stroke-linecap="round">
      {[0, 60, 120].map((a) => <path key={a} d={line([pol([x, y], a, r), pol([x, y], a + 180, r)])} />)}
    </g>
  );
}
/** Güneş simgesi */
function Sun({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f2a51f" stroke-width={2.4} stroke-linecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={line([pol([x, y], a, r + 3), pol([x, y], a, r + 8)])} />)}
      </g>
      <circle cx={x} cy={y} r={r} fill="#ffd34a" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}
/** Ay simgesi ("bir gece") */
function Moon({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <OG sh={[{ d: `M${x + r * 0.3} ${y - r}A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r}A${r * 1.3} ${r * 1.3} 0 0 1 ${x + r * 0.3} ${y - r}Z`, f: '#f4dd7a' }]} />;
}
/** Sığ geniş kap/kase (yandan). x,y taban ortası */
function Bowl({ x, y, w = 80, h = 30, c = '#d9cbb0', liquid }: { x: number; y: number; w?: number; h?: number; c?: string; liquid?: string }) {
  const hw = w / 2;
  return (
    <g>
      <OG sh={[
        { d: `M${x - hw} ${y - h}Q${x - hw + 4} ${y} ${x - hw * 0.4} ${y}H${x + hw * 0.4}Q${x + hw - 4} ${y} ${x + hw} ${y - h}Z`, f: c },
        { d: ell([x, y - h], hw, 6), f: liquid ?? shade(c, 0.15) },
      ]} />
    </g>
  );
}
/** Bez (yerde, perspektif) */
function GroundCloth({ x, y, w = 150, h = 22 }: { x: number; y: number; w?: number; h?: number }) {
  return <OG sh={[{ d: `M${x - w / 2} ${y}L${x - w / 2 + 16} ${y - h}H${x + w / 2 - 10}L${x + w / 2 + 6} ${y}Z`, f: C.cloth }, { d: `M${x - w / 4} ${y - 3}L${x - w / 4 + 6} ${y - h + 3}M${x + w / 5} ${y - 3}L${x + w / 5 + 4} ${y - h + 3}`, st: '#d9d2c2', sw: 1.4 }]} />;
}

/* ═══════════════════════ SAHNELER ═══════════════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ───────── Kategori kapakları ───────── */
  // Dört mevsim şeridi: körpe filiz, dut dalı, kestane, karlı kuşburnu
  'sf-ybt-kapak-mevsim': () => {
    const xs = [12, 87, 162, 237];
    const bgs = ['#e6f4d8', '#fdf1cc', '#f8e2c8', '#e2eef8'];
    return (
      <Scene2 bg="closeup">
        {xs.map((x, i) => <Panel key={i} x={x} y={12} w={71} h={216} f={bgs[i]} />)}
        {/* ilkbahar: filiz */}
        <Lf x={47} y={42} a={-130} len={16} w={6} c={C.young} vein={false} />
        <Lf x={47} y={42} a={-50} len={16} w={6} c={C.young} vein={false} />
        <rect x={16} y={176} width={63} height={48} rx={8} fill={C.soil} />
        <Stem pts={[[47, 178], [46, 140], [48, 112]]} w={4} c={C.leafDk} />
        <Lf x={47} y={150} a={-150} len={30} w={9} c={C.leaf} />
        <Lf x={47} y={140} a={-30} len={30} w={9} c={C.leaf} />
        <Lf x={48} y={114} a={-120} len={22} w={7} c={C.young} />
        <Lf x={48} y={114} a={-60} len={22} w={7} c={C.young} />
        {/* yaz: dut dalı */}
        <Sun x={122} y={42} />
        <Stem pts={[[90, 96], [122, 110], [160, 104]]} w={5} c={C.bark} />
        <Lf x={130} y={108} a={-60} len={30} w={13} c={C.leaf} teeth={6} />
        <Lf x={110} y={104} a={-120} len={28} w={12} c={C.leafDk} teeth={6} />
        {[[112, 132], [128, 140], [144, 130]].map(([bx, by], i) => (
          <g key={i}>
            <Stem pts={[[bx, by - 22], [bx, by - 10]]} w={1.6} c={C.leafDk} />
            <OG sh={[{ d: capsule([bx, by - 9], 5.5, [bx, by + 9], 5.5), f: C.berry }]} />
            <g fill="#5a3460">{[-5, 0, 5].map((dy) => <circle key={dy} cx={bx + (dy % 2 ? 2 : -2)} cy={by + dy} r={1.6} />)}</g>
          </g>
        ))}
        <GroundCloth x={122} y={214} w={56} h={14} />
        {[[110, 205], [126, 207], [138, 203]].map(([bx, by], i) => <OG key={i} sh={[{ d: capsule([bx - 4, by], 3.5, [bx + 4, by], 3.5), f: C.berry }]} />)}
        {/* sonbahar: kestane */}
        <Lf x={197} y={44} a={-110} len={22} w={8} c="#d98a2b" teeth={5} />
        {[[184, 150], [212, 156], [198, 186]].map(([nx, ny], i) => (
          <Gx key={i} x={nx} y={ny} s={1.3} sh={[{ d: 'M-12 10Q-14 -8 0 -18Q14 -8 12 10Z', f: '#7a4a2a' }, { d: 'M-12 10H12', st: '#d8c79a', sw: 3 }, { d: 'M0 -18l-2 -5M0 -18l2 -5', st: '#d8c79a', sw: 1.4 }]} />
        ))}
        <Lf x={176} y={110} a={-20} len={52} w={12} c="#c9862e" teeth={8} />
        {/* kış: karlı kuşburnu */}
        <Flake x={272} y={42} />
        <Stem pts={[[244, 170], [270, 130], [296, 96]]} w={4} c="#6b3b2a" />
        <Stem pts={[[268, 134], [292, 146]]} w={3} c="#6b3b2a" />
        {[[296, 104, 0], [290, 154, 0], [260, 150, 0]].map(([hx, hy], i) => (
          <g key={i}>
            <OG sh={[{ d: ell([hx, hy], 8, 11), f: C.red }, { d: `M${hx - 4} ${hy - 11}L${hx} ${hy - 17}L${hx + 4} ${hy - 11}`, f: '#5a3a2a' }]} />
          </g>
        ))}
        <SnowCap x={282} y={112} w={22} />
        <SnowCap x={266} y={138} w={20} />
        <rect x={240} y={196} width={65} height={28} rx={8} fill={C.snow} stroke={K.out} stroke-width={1.2} />
      </Scene2>
    );
  },
  // Yer yer: çam ormanı, sazlıklı dere, maki, kayalık kıyı (işaret yok; yalnız yer)
  'sf-ybt-kapak-yer': () => (
    <Scene2 bg="outdoor" gy={176}>
      <Tree x={26} y={190} s={1.15} kind="pine" />
      <Tree x={62} y={182} s={0.95} kind="pine" />
      <Water x={92} y={186} w={74} h={60} />
      {[98, 108, 150, 160].map((rx, i) => (
        <g key={rx}>
          <Stem pts={[[rx, 200], [rx + 2, 150], [rx + (i % 2 ? 4 : -2), 110 + i * 6]]} w={3} c="#8fae58" />
          <OG sh={[{ d: ell([rx + (i % 2 ? 4 : -2), 104 + i * 6], 5, 12), f: '#8a5a48' }]} />
          <Lf x={rx + 1} y={170} a={i % 2 ? -40 : -140} len={26} w={4} c="#8fae58" vein={false} />
        </g>
      ))}
      {[[190, 192, 0.7], [220, 186, 0.6]].map(([tx, ty, s], i) => <Tree key={i} x={tx} y={ty} s={s} color="#5f8c3c" />)}
      <OG sh={[{ d: ell([206, 198], 22, 12), f: '#6f9a46' }]} />
      <Water x={248} y={170} w={80} h={80} color="#3f8fd0" />
      <Rock x={262} y={206} s={1.4} />
      <Rock x={296} y={222} s={1.1} />
      <path d="M244 172q6 -6 12 0t12 0" stroke="#fff" stroke-width={2.4} fill="none" stroke-linecap="round" />
    </Scene2>
  ),
  // Güvenlik: şemsiye çiçekli zehirli bitki büyük yasakla; köşede 114
  'sf-ybt-kapak-guvenlik': () => (
    <Scene2 bg="closeup">
      <Soil y={214} />
      <Stem pts={[[130, 216], [132, 140], [128, 76]]} w={5} c="#6f9a5c" />
      <Fern x={131} y={180} a={-150} len={56} />
      <Fern x={131} y={160} a={-30} len={56} />
      <Fern x={130} y={122} a={-145} len={42} />
      <Umbel x={128} y={76} r={44} />
      <No x={130} y={124} r={92} />
      <Phone x={272} y={150} s={1.05} text="114" />
    </Scene2>
  ),

  /* ───────── İlkbahar ───────── */
  // Madımak (şematik): yere yayılan ince gövdeler, küçük uzunca yapraklar, pembe çiçekçikler; makas körpe ucu kesiyor
  'sf-ybt-madimak': () => {
    const root: P = [150, 196];
    const branch = (pts: P[], flip: boolean) => (
      <g>
        <Stem pts={pts} w={3} c="#7b6a48" />
        {pts.slice(1).map((p, i) => (
          <g key={i}>
            <Lf x={p[0]} y={p[1]} a={flip ? -150 : -30} len={22} w={5} c={C.leaf} vein={false} />
            <Lf x={p[0]} y={p[1]} a={flip ? 160 : 20} len={18} w={4.5} c={C.leafDk} vein={false} />
            <circle cx={p[0]} cy={p[1] - 3} r={3.6} fill={C.pink} stroke={K.out} stroke-width={1} />
          </g>
        ))}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Soil y={196} />
        {branch([root, [116, 186], [82, 178], [48, 176]], true)}
        {branch([root, [182, 184], [214, 174], [246, 164]], false)}
        {branch([root, [138, 168], [118, 146]], true)}
        {branch([root, [166, 166], [190, 146]], false)}
        <Lf x={246} y={164} a={-40} len={20} w={6} c={C.young} vein={false} />
        <Lf x={246} y={164} a={-10} len={16} w={5} c={C.young} vein={false} />
        <Scissors x={262} y={154} a={160} s={1.1} />
        <HoldAt at={pol([262, 154], 160, -27)} a={-110} />
        <Arrow from={[200, 60]} to={[244, 140]} bend={-0.2} />
      </Scene2>
    );
  },
  // Kenger (şematik): dikenli yapraklar, açmamış yeşil çiçek başı; eldivenli el bıçakla kesiyor; beyaz süt damlası
  'sf-ybt-kenger': () => {
    const head: P = [140, 96];
    const hk = { x: 0, y: 0, a: -70, s: 1.0, pose: 'hold' as const, side: 'L' as const, grip: 30 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [218, 140];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <Soil y={208} />
        {[-160, -130, -50, -20].map((a, i) => <Lf key={a} x={140} y={206} a={a} len={92 - (i % 2) * 18} w={16} teeth={8} c={i % 2 ? C.leafDk : '#7aa860'} />)}
        <Stem pts={[[140, 206], [141, 160], [140, 116]]} w={9} c="#8bb06a" />
        <Lf x={140} y={150} a={-35} len={40} w={9} teeth={5} c="#7aa860" />
        <g>
          {Array.from({ length: 16 }, (_, i) => {
            const a = -180 + i * 12;
            return <path key={i} d={line([pol(head, a, 24), pol(head, a, 36)])} stroke={K.out} stroke-width={2} stroke-linecap="round" />;
          })}
          <OG sh={[{ d: ell(head, 26, 22), f: '#8fbf5a' }, { d: `M${head[0] - 18} ${head[1] - 4}Q${head[0]} ${head[1] + 6} ${head[0] + 18} ${head[1] - 4}M${head[0] - 14} ${head[1] + 8}Q${head[0]} ${head[1] + 16} ${head[0] + 14} ${head[1] + 8}`, st: shade('#8fbf5a', 0.3), sw: 1.4 }]} />
        </g>
        <Knife x={grip[0] - 4} y={grip[1] + 2} a={-168} s={1.05} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Glove><Hand {...h} arm={18} skin={HT.skin} /></Glove>
        <OG sh={[{ d: 'M0 0C-5 8 -7 13 -7 17A7 7 0 0 0 7 17C7 13 5 8 0 0Z', f: C.white, t: `translate(${head[0] - 10} ${head[1] + 26})` }]} />
        <Arrow from={[50, 40]} to={[108, 80]} bend={-0.2} />
      </Scene2>
    );
  },
  // Çirişe karışan iki zehirli demet: şerit yapraklı acı çiğdem | pileli yapraklı akçöpleme — ikisi de yasak.
  // Çiriş bilerek çizilmez: benzer demetlerin yanında "yenir" kartı yanlış teşhise yol açar.
  'sf-ybt-cirisi-ayir': () => (
    <Scene2 bg="closeup">
      <Panel x={10} w={145} />
      <Panel x={165} w={145} />
      {[10, 165].map((x) => <rect key={x} x={x + 5} y={166} width={135} height={36} rx={8} fill={C.soil} />)}
      <StrapTuft x={82} y={172} s={1.5} c="#5f9e48" w={8} />
      <No x={82} y={112} r={60} />
      {[-128, -98, -66].map((a, i) => <Pleated key={a} x={238} y={172} a={a} len={96 - i * 6} w={24} />)}
      <No x={238} y={112} r={60} />
      <Emin />
    </Scene2>
  ),

  /* ───────── Yaz ───────── */
  // Dut silkme: ağacın altında bez; toplayıcı alçak dalı sallıyor; olgun dutlar beze düşüyor
  'sf-ybt-dut-silkme': () => {
    const grip: P = [206, 118];
    const p: PersonProps = { ...CAST.toplayici, x: 236, y: 224, s: 0.95, flip: true, pose: { ...POSE.standSide, face: 'neutral', head: -96, armB: { to: [grip[0] + 6, grip[1] + 2] }, armF: { to: grip }, handB: 'fist', handF: 'fist' } };
    return (
      <Scene2 bg="outdoor" gy={196}>
        <OG sh={[{ d: 'M54 214L60 120Q62 96 70 70L84 70Q80 100 82 120L86 214Z', f: K.trunk }]} />
        {[[40, 50, 40], [96, 40, 46], [150, 50, 36], [70, 20, 34]].map(([cx, cy, r], i) => <OG key={i} sh={[{ d: circ([cx, cy], r), f: i % 2 ? '#5f9c47' : '#6aac50' }]} />)}
        <Stem pts={[[80, 92], [140, 100], [190, 114], [214, 120]]} w={6} c={K.trunk} />
        {[[150, 92], [176, 102], [128, 92]].map(([lx, ly], i) => <Lf key={i} x={lx} y={ly} a={-70 + i * 30} len={24} w={11} teeth={5} c={C.leaf} />)}
        {[[136, 110], [162, 116], [186, 126]].map(([bx, by], i) => <OG key={i} sh={[{ d: capsule([bx, by - 5], 4.5, [bx, by + 5], 4.5), f: C.berry }]} />)}
        <g>
          <OG sh={[{ d: capsule([118, 99], 4, [118, 107], 4), f: '#a8c860' }, { d: capsule([110, 101], 4, [110, 109], 4), f: '#a8c860' }]} />
          <Bad x={104} y={124} r={9} />
        </g>
        <path d="M196 104l-6 -6M200 132l-6 6" stroke={K.action} stroke-width={2.6} stroke-linecap="round" />
        <GroundCloth x={150} y={222} w={190} h={22} />
        {[[120, 140], [150, 160], [180, 136], [140, 186], [196, 176]].map(([bx, by], i) => (
          <g key={i}>
            <path d={`M${bx} ${by - 16}v10`} stroke="#fff" stroke-width={2} stroke-linecap="round" opacity={0.8} />
            <OG sh={[{ d: capsule([bx, by - 4], 4.5, [bx, by + 4], 4.5), f: C.berry }]} />
          </g>
        ))}
        {[[100, 214], [116, 210], [140, 216], [170, 212], [196, 214]].map(([bx, by], i) => <OG key={i} sh={[{ d: capsule([bx - 4, by], 4, [bx + 4, by], 4), f: C.berry }]} />)}
        <Person {...p} />
      </Scene2>
    );
  },
  // Böğürtlen (şematik) | güzelavratotu: tek parlak siyah tane, yıldız çanak, çan çiçek — yasak
  'sf-ybt-guzelavrat': () => {
    const drupe = (cx: number, cy: number) => {
      const pts: P[] = [];
      for (let r = 0; r < 5; r++) for (let c = 0; c < (r % 2 ? 3 : 4); c++) pts.push([cx - 12 + c * 8 + (r % 2 ? 4 : 0), cy - 16 + r * 8]);
      return <g>{pts.map(([x, y], i) => <Berry key={i} x={x} y={y} r={5} c="#2a1d2e" />)}</g>;
    };
    return (
      <Scene2 bg="closeup">
        <Panel x={10} w={145} />
        <Panel x={165} w={145} />
        <Stem pts={[[30, 200], [60, 120], [80, 70]]} w={4} c="#7a4a5a" />
        {[[50, 150], [66, 104]].map(([tx, ty], i) => <path key={i} d={`M${tx} ${ty}l6 -2`} stroke={K.out} stroke-width={2} />)}
        <Lf x={58} y={130} a={10} len={40} w={13} teeth={7} c={C.leafDk} />
        <Lf x={70} y={90} a={-170} len={34} w={11} teeth={6} c={C.leaf} />
        <Stem pts={[[78, 76], [96, 92]]} w={2} c="#7a4a5a" />
        {drupe(104, 112)}
        <OG sh={[{ d: smooth([[86, 90], [96, 84], [106, 90], [96, 94]], true), f: '#5a8a3a' }]} />
        {/* güzelavratotu: tane sol altta, çan çiçek sağ üstte (yasak çizgisinin dışında) */}
        <Stem pts={[[290, 206], [262, 140], [236, 70]]} w={4} c="#6f8a4a" />
        <Lf x={268} y={160} a={-10} len={34} w={14} c={C.leaf} />
        <Lf x={250} y={110} a={-170} len={40} w={16} c={C.leafDk} />
        <Stem pts={[[256, 124], [228, 128], [216, 130]]} w={2.4} c="#6f8a4a" />
        {[0, 72, 144, 216, 288].map((a) => <Lf key={a} x={214} y={134} a={a - 90} len={21} w={6} c="#5f9a48" vein={false} />)}
        <Berry x={214} y={140} r={15} c={C.black} />
        <Stem pts={[[240, 80], [256, 74]]} w={2} c="#6f8a4a" />
        <OG sh={[{ d: 'M-10 0Q-11 -20 0 -22Q11 -20 10 0Q5 5 0 2Q-5 5 -10 0Z', f: '#7a4a60', t: 'translate(262 76) rotate(200)' }]} />
        <No x={238} y={108} r={66} />
        <Emin />
      </Scene2>
    );
  },
  // Tatula: beyaz boru çiçek, dişli yaprak, dikenli koza, dökülen siyah tohumlar; büyük yasak
  'sf-ybt-tatula': () => {
    const pod: P = [112, 160];
    return (
      <Scene2 bg="closeup">
        <Soil y={212} />
        <Stem pts={[[160, 214], [162, 150], [180, 92]]} w={6} c="#6f9a4c" />
        <Stem pts={[[161, 176], [130, 166], [126, 162]]} w={4} c="#6f9a4c" />
        <Lf x={162} y={150} a={-170} len={62} w={24} teeth={6} c={C.leafDk} />
        <Lf x={164} y={130} a={-15} len={60} w={22} teeth={5} c={C.leaf} />
        <OG sh={[{ d: 'M0 0L36 -9Q42 -12 46 -7Q48 0 46 7Q42 12 36 9Z', f: '#fbfbf5', t: 'translate(180 92) rotate(-50)' }, { d: 'M0 -3L36 -6M0 3L36 6', st: '#c9c2d8', sw: 1.2, t: 'translate(180 92) rotate(-50)' }]} />
        <g>
          {Array.from({ length: 22 }, (_, i) => {
            const a = i * (360 / 22);
            return <path key={i} d={line([pol(pod, a, 18), pol(pod, a, 27)])} stroke={K.out} stroke-width={2} stroke-linecap="round" />;
          })}
          <OG sh={[{ d: ell(pod, 19, 21), f: '#8fb860' }]} />
        </g>
        {[[86, 204], [96, 208], [78, 210], [104, 200]].map(([sx, sy], i) => <OG key={i} sh={[{ d: ell([sx, sy], 3.5, 2.8), f: C.black }]} />)}
        <No x={160} y={124} r={100} />
      </Scene2>
    );
  },

  /* ───────── Sonbahar ───────── */
  // Ceviz ve fındık: tahta kerevette tek kat, gölgede (ağaç gölgesi); '2–3 hafta'
  'sf-ybt-ceviz-kurutma': () => {
    const walnut = (x: number, y: number, k: number) => (
      <g key={'w' + k}>
        <OG sh={[{ d: ell([x, y], 12, 11), f: '#c9a26a' }, { d: `M${x} ${y - 11}Q${x - 3} ${y} ${x} ${y + 11}`, st: shade('#c9a26a', 0.35), sw: 1.4 }, { d: `M${x - 7} ${y - 4}q3 2 0 5M${x + 7} ${y - 4}q-3 2 0 5`, st: shade('#c9a26a', 0.3), sw: 1.2 }]} />
      </g>
    );
    const hazel = (x: number, y: number, k: number) => <OG key={'h' + k} sh={[{ d: ell([x, y], 8, 7.5), f: C.nut }, { d: ell([x, y - 4], 5, 3), f: '#d9c08f' }]} />;
    const items: JSX.Element[] = [];
    let k = 0;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
      const x = 44 + c * 30 + (r % 2) * 14, y = 58 + r * 34;
      items.push((r + c) % 3 === 0 ? hazel(x, y, k++) : walnut(x, y, k++));
    }
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#9cbf7a" />
        <OG sh={[{ d: rrect(24, 32, 236, 150, 6), f: '#c79a66' }]} />
        {[56, 88, 120, 152].map((y) => <path key={y} d={`M26 ${y}H258`} stroke={shade('#c79a66', 0.3)} stroke-width={2} />)}
        {items}
        <path d="M0 0H320V22Q200 30 120 18T0 26Z" fill="#2f5f3a" opacity={0.35} />
        <Label x={142} y={210} text="2–3 hafta" />
      </Scene2>
    );
  },
  // Acı çiğdem: sonbaharda yapraksız pembe-mor çiçek; ilkbahar yaprakları küçük çerçevede; ikisi de yasak
  'sf-ybt-aci-cigdem-guz': () => {
    const fl = (x: number, y: number, h: number, a = 0) => (
      <g key={x} transform={tr(x, y, 1, a)}>
        <path d={`M0 0V${-h}`} stroke={K.out} stroke-width={7} stroke-linecap="round" />
        <path d={`M0 0V${-h}`} stroke="#f3eef4" stroke-width={4} stroke-linecap="round" />
        <OG sh={[
          { d: `M0 ${-h}Q-16 ${-h - 18} -6 ${-h - 40}Q0 ${-h - 30} 0 ${-h}Z`, f: '#c58ad0' },
          { d: `M0 ${-h}Q16 ${-h - 18} 6 ${-h - 40}Q0 ${-h - 30} 0 ${-h}Z`, f: '#b678c4' },
          { d: `M0 ${-h}Q-8 ${-h - 22} 0 ${-h - 44}Q8 ${-h - 22} 0 ${-h}Z`, f: '#d69ee0' },
        ]} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={186}>
        {fl(70, 206, 40, -8)}
        {fl(110, 214, 54, 4)}
        {fl(150, 204, 34, -2)}
        {fl(190, 216, 48, 8)}
        <g fill="none" stroke={K.grassShade} stroke-width={2} stroke-linecap="round">
          {[40, 90, 130, 170, 214].map((x) => <path key={x} d={`M${x} 222l-3 -8M${x} 222l2 -9`} />)}
        </g>
        <No x={130} y={150} r={80} />
        <rect x={236} y={16} width={72} height={92} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        <rect x={240} y={86} width={64} height={18} rx={5} fill={C.soil} />
        <StrapTuft x={272} y={90} s={0.85} n={3} w={7} />
        <Bad x={298} y={28} r={10} />
      </Scene2>
    );
  },

  /* ───────── Kış ───────── */
  // Karlı kuşburnu: eldivenli el donmuş meyveyi topluyor; yanda tencerede kaynatma
  'sf-ybt-kis-kusburnu': () => {
    const hip = (x: number, y: number, k: number) => (
      <g key={k}>
        <OG sh={[{ d: ell([x, y], 9, 12), f: C.red }, { d: `M${x - 4} ${y - 12}L${x} ${y - 18}L${x + 4} ${y - 12}`, f: '#5a3a2a' }]} />
        <circle cx={x - 3} cy={y - 4} r={2.4} fill="#fff" opacity={0.6} />
      </g>
    );
    const target: P = [150, 120];
    const hk = { x: 0, y: 0, a: -75, s: 1.0, pose: 'pinch' as const, side: 'R' as const };
    const q = handPoint(hk, 'pinch');
    const h = { ...hk, x: target[0] - q[0] + 2, y: target[1] - q[1] + 2 };
    return (
      <Scene2 bg="outdoor" gy={190} ground="snow">
        <GloveDefs />
        <Stem pts={[[60, 210], [90, 150], [130, 100], [170, 70]]} w={5} c="#6b3b2a" />
        <Stem pts={[[94, 144], [60, 110], [40, 92]]} w={4} c="#6b3b2a" />
        <Stem pts={[[120, 112], [150, 112]]} w={3} c="#6b3b2a" />
        <SnowCap x={140} y={92} w={30} />
        <SnowCap x={60} y={108} w={26} />
        <SnowCap x={84} y={158} w={22} />
        {hip(150, 122, 1)}
        {hip(170, 80, 2)}
        {hip(44, 102, 3)}
        {hip(72, 126, 4)}
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Glove><Hand {...h} arm={18} skin={HT.skin} /></Glove>
        <Campfire x={262} y={226} s={1.1} />
        <Pot x={262} y={214} s={1.15} color="#8e99a6" />
      </Scene2>
    );
  },
  // Baldıran ilk yıl rozeti: kar arasında maydanoz benzeri yaprak demeti; uzanan el durduruluyor
  'sf-ybt-baldiran-rozet': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={60} width={320} height={180} fill={C.soil} />
      {[[40, 90, 40], [260, 80, 50], [70, 210, 46], [280, 210, 40], [170, 226, 40]].map(([sx, sy, r], i) => <ellipse key={i} cx={sx} cy={sy} rx={r} ry={r * 0.4} fill={C.snow} />)}
      {[-170, -130, -90, -50, -10, 30, 70, 110, 150].map((a, i) => <Fern key={a} x={160} y={140} a={a} len={66 - (i % 2) * 12} c={i % 2 ? C.leafDk : C.leaf} />)}
      <circle cx={160} cy={140} r={6} fill="#8a6a9a" stroke={K.out} stroke-width={1.2} />
      <Hand x={300} y={210} a={-60} s={0.8} pose="open" side="R" arm={80} sleeve={HT.sleeve} skin={HT.skin} />
      <Bad x={262} y={160} r={12} />
      <No x={160} y={140} r={86} />
    </Scene2>
  ),
  /* ───────── Çiçekler ───────── */
  // Akasya: dikenli dalda beyaz sarkık salkım; el yalnız çiçek salkımını koparıyor
  'sf-ybt-akasya-cicek': () => {
    const top: P = [150, 92];
    const hk = { x: 0, y: 0, a: -110, s: 0.95, pose: 'pinch' as const, side: 'R' as const };
    const q = handPoint(hk, 'pinch');
    const h = { ...hk, x: top[0] - q[0] + 3, y: top[1] - q[1] };
    return (
      <Scene2 bg="closeup">
        <Stem pts={[[0, 70], [80, 82], [170, 84], [320, 66]]} w={6} c="#7a5a3c" />
        {[[80, 82], [236, 76]].map(([tx, ty], i) => (
          <g key={i}>
            <path d={`M${tx - 2} ${ty - 3}l-6 -10l9 6Z`} fill={K.out} />
            <path d={`M${tx + 2} ${ty - 3}l6 -10l-9 6Z`} fill={K.out} />
          </g>
        ))}
        {[[60, 80, -110], [210, 80, -60], [270, 72, -100]].map(([lx, ly, la], i) => (
          <g key={i} transform={tr(lx, ly, 1, la)}>
            <path d="M0 0H70" stroke={K.out} stroke-width={3.4} />
            <path d="M0 0H70" stroke={C.leafDk} stroke-width={1.6} />
            {[14, 30, 46, 62].map((d) => (
              <g key={d}>
                <OG sh={[{ d: ell([d, -9], 8, 5), f: C.leaf }, { d: ell([d, 9], 8, 5), f: C.leaf }]} />
              </g>
            ))}
          </g>
        ))}
        <Stem pts={[[150, 84], [152, 140], [146, 200]]} w={2} c="#8aa86a" />
        {Array.from({ length: 9 }, (_, i) => {
          const y = 104 + i * 11;
          const side = i % 2 ? 1 : -1;
          const x = 150 + side * (12 - i * 0.6);
          return <OG key={i} sh={[{ d: `M${x} ${y - 7}Q${x + side * 12} ${y - 6} ${x + side * 11} ${y + 3}Q${x} ${y + 9} ${x - side * 4} ${y}Z`, f: C.white }, { d: ell([x - side * 2, y - 6], 3, 2.5), f: '#cfe0a8' }]} />;
        })}
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
      </Scene2>
    );
  },
  // Sarkık salkımlar (şematik): beyaz-dikenli ağaç dalı | mor salkım sarmaşığı + bakla | sarı salkım + bakla
  'sf-ybt-salkim-ayrim': () => {
    const raceme = (x: number, y: number, c: string, n = 8, w = 13) => (
      <g>
        <Stem pts={[[x, y], [x + 2, y + n * 10]]} w={1.6} c="#8aa86a" />
        {Array.from({ length: n }, (_, i) => {
          const yy = y + 8 + i * 10;
          const ww = w * (1 - i * 0.07);
          return <OG key={i} sh={[{ d: ell([x - ww * 0.45, yy], ww * 0.5, 5.5), f: c }, { d: ell([x + ww * 0.45, yy + 3], ww * 0.5, 5.5), f: shade(c, 0.08) }]} />;
        })}
      </g>
    );
    const pod = (x: number, y: number, c: string, a = 80) => <Gx x={x} y={y} a={a} sh={[{ d: 'M0 -5Q30 -9 52 -3Q56 0 52 4Q30 8 0 5Q-3 0 0 -5Z', f: c }, ...[12, 24, 36].map((d) => ({ d: ell([d, 0], 3.5, 3), f: shade(c, 0.15) }))]} />;
    return (
      <Scene2 bg="closeup">
        <Panel x={10} w={145} />
        <Panel x={165} w={145} />
        {/* mor salkım: kıvrık sarmaşık, mor ve beyaz salkım, bakla */}
        <path d="M16 40C46 26 60 62 90 46S136 28 150 44" stroke={K.out} stroke-width={6} fill="none" stroke-linecap="round" />
        <path d="M16 40C46 26 60 62 90 46S136 28 150 44" stroke="#8a6a4a" stroke-width={3} fill="none" stroke-linecap="round" />
        {raceme(52, 44, '#a07ad0', 11, 16)}
        {raceme(96, 48, C.white, 9, 14)}
        {pod(126, 50, '#9aa88a', 84)}
        <No x={82} y={112} r={62} />
        {/* altın yağmuru: sarı salkım, bakla */}
        <Stem pts={[[170, 44], [236, 50], [304, 44]]} w={4} c="#6a7a4a" />
        {raceme(220, 50, '#f2cf3a', 11, 16)}
        {pod(270, 52, '#7f8a58', 84)}
        <No x={238} y={112} r={62} />
        <Emin />
      </Scene2>
    );
  },
  // Kabak çiçeği: açık sarı çiçeğin ortasındaki erkek organ parmakla çıkarılıyor
  'sf-ybt-kabak-cicegi': () => {
    const c: P = [150, 128];
    const tip: P = [158, 92];
    const hk = { x: 0, y: 0, a: -20, s: 1.0, pose: 'pinch' as const, side: 'R' as const };
    const q = handPoint(hk, 'pinch');
    const h = { ...hk, x: tip[0] - q[0], y: tip[1] - q[1] };
    return (
      <Scene2 bg="closeup">
        <Lf x={40} y={230} a={-60} len={90} w={40} teeth={7} c={C.leafDk} />
        <Lf x={290} y={230} a={-120} len={80} w={36} teeth={7} c={C.leaf} />
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={tr(c[0], c[1], 1, a - 90)}>
            <OG sh={[{ d: 'M0 -26Q50 -38 86 0Q50 38 0 26Z', f: '#f7c234' }, { d: 'M6 0L80 0', st: '#e0a01a', sw: 2 }]} />
          </g>
        ))}
        <OG sh={[{ d: circ(c, 26), f: '#f0a82a' }]} />
        <OG sh={[{ d: capsule([152, 120], 7, [158, 94], 8), f: '#f5d24a' }]} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Arrow from={[124, 104]} to={[132, 44]} bend={-0.2} />
      </Scene2>
    );
  },

  /* ───────── Özsu ───────── */
  // Delik: kalın gövdeye el burgusuyla hafif yukarı eğimli küçük delik
  'sf-ybt-ozsu-delik': () => {
    const hole: P = [132, 132];
    const a = 192; // dışarıdan içeri hafif yukarı: dış uç (sap) delikten alçakta
    const end = pol(hole, a, -96);
    const hk = { x: 0, y: 0, a: -90, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [end[0] + 4, end[1]];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="outdoor" gy={206} ground="snow">
        <OG sh={[{ d: 'M24 250L30 0H140L136 250Z', f: '#8c6a4c' }]} />
        {[50, 72, 96, 118].map((x, i) => <path key={x} d={`M${x} ${10 + i * 20}q4 30 0 60t0 60`} stroke={shade('#8c6a4c', 0.3)} stroke-width={2} fill="none" />)}
        <path d={line([pol(hole, a, 10), hole])} stroke={K.out} stroke-width={8} stroke-linecap="round" />
        <path d={line([hole, end])} stroke={K.out} stroke-width={6} />
        <path d={line([hole, end])} stroke={C.steel} stroke-width={3.4} />
        <OG sh={[{ d: capsule([end[0], end[1] - 26], 6, [end[0], end[1] + 26], 6), f: C.wood }]} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <path d={`M${hole[0]} ${hole[1]}H${hole[0] + 80}`} stroke="#fff" stroke-width={2} stroke-dasharray="5 4" />
        <Label x={250} y={64} text="8 mm" />
      </Scene2>
    );
  },
  // Özsu toplama: delikteki soyulmuş çubuktan damlayan özsu; altta ağzı bezle örtülü kap
  'sf-ybt-ozsu-kap': () => (
    <Scene2 bg="outdoor" gy={200} ground="snow">
      <Stem pts={[[150, 30], [210, 6]]} w={4} c="#6a4a32" />
      <Stem pts={[[120, 46], [70, 14]]} w={4} c="#6a4a32" />
      <OG sh={[{ d: 'M86 250L92 0H176L170 250Z', f: '#8c6a4c' }]} />
      {[106, 126, 150].map((x, i) => <path key={x} d={`M${x} ${20 + i * 14}q4 30 0 60t0 60`} stroke={shade('#8c6a4c', 0.3)} stroke-width={2} fill="none" />)}
      <circle cx={166} cy={110} r={5} fill="#3a2a20" />
      <OG sh={[{ d: capsule([164, 110], 4, [212, 116], 3.5), f: '#e8dcb8' }]} />
      {[[214, 132], [214, 150]].map(([dx, dy], i) => <OG key={i} sh={[{ d: 'M0 0C-3 5 -4 8 -4 10A4 4 0 0 0 4 10C4 8 3 5 0 0Z', f: K.waterLight, t: `translate(${dx} ${dy})` }]} />)}
      <path d="M180 112Q196 150 196 166M244 166Q244 140 210 118" stroke={K.out} stroke-width={2} fill="none" />
      <OG sh={[{ d: 'M190 168H250L246 222Q246 226 240 226H200Q194 226 194 222Z', f: '#8e99a6' }, { d: 'M186 168Q220 158 254 168L252 176Q220 168 188 176Z', f: C.cloth }]} />
    </Scene2>
  ),
  // Kaynatma: ateşte geniş sığ tencere, buhar; yanda bidon ve koyu şurup kavanozu
  'sf-ybt-ozsu-kaynatma': () => (
    <Scene2 bg="outdoor" gy={196}>
      <Campfire x={120} y={222} s={1.6} />
      <OG sh={[{ d: 'M54 170H186L180 198Q178 202 172 202H68Q62 202 60 198Z', f: '#8e99a6' }, { d: ell([120, 170], 66, 7), f: '#e8d9a0' }]} />
      <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.95}>
        {[80, 110, 140, 168].map((x) => <path key={x} d={`M${x} 158c-5 -6 5 -10 0 -18c-5 -6 5 -10 0 -18`} />)}
      </g>
      <OG sh={[{ d: rrect(214, 120, 50, 80, 8), f: '#e6eef2' }, { d: rrect(232, 110, 14, 12, 3), f: '#3d7ad6' }, { d: rrect(216, 140, 46, 58, 6), f: '#e9f0d8', op: 0.9 }]} />
      <OG sh={[{ d: 'M276 168H302V196Q302 200 298 200H280Q276 200 276 196Z', f: '#8a4f1e' }, { d: rrect(274, 160, 30, 8, 2), f: '#8e99a6' }]} />
      <Label x={258} y={54} text="40 L → 1 L" size={14} />
    </Scene2>
  ),

  /* ───────── Çam ───────── */
  // Çam dalı (ikili iğne demetleri, odunsu kozalak) | porsuk dalı (yassı tek iğneler, kırmızı kadeh meyve) — yasak
  'sf-ybt-cam-porsuk': () => {
    const pine: JSX.Element[] = [];
    for (let i = 0; i < 9; i++) {
      const p0: P = [28 + i * 13, 140 - i * 9];
      const a = -100 + (i % 2) * 30;
      pine.push(<g key={i}>
        <path d={line([p0, pol(p0, a - 12, 46)])} stroke={K.out} stroke-width={4} stroke-linecap="round" />
        <path d={line([p0, pol(p0, a + 12, 46)])} stroke={K.out} stroke-width={4} stroke-linecap="round" />
        <path d={line([p0, pol(p0, a - 12, 46)])} stroke="#3f8a4e" stroke-width={2} stroke-linecap="round" />
        <path d={line([p0, pol(p0, a + 12, 46)])} stroke="#3f8a4e" stroke-width={2} stroke-linecap="round" />
        <circle cx={p0[0]} cy={p0[1]} r={2.4} fill="#6a4a32" />
      </g>);
    }
    const yew: JSX.Element[] = [];
    for (let i = 0; i < 12; i++) {
      const x = 182 + i * 10, y = 148 - i * 7;
      yew.push(<Lf key={'a' + i} x={x} y={y} a={-125} len={24} w={3.4} c="#2f6a3e" vein={false} />);
      yew.push(<Lf key={'b' + i} x={x} y={y} a={55} len={22} w={3.4} c="#245a34" vein={false} />);
    }
    const aril = (x: number, y: number) => (
      <g key={x}>
        <OG sh={[{ d: 'M-10 -6Q-11 -13 0 -13Q11 -13 10 -6Q11 8 0 10Q-11 8 -10 -6Z', f: '#e0322e', t: `translate(${x} ${y})` }, { d: ell([x, y + 6], 4.5, 3.5), f: '#3a2a22' }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Panel x={10} w={145} />
        <Panel x={165} w={145} />
        <Stem pts={[[20, 150], [80, 110], [140, 70]]} w={5} c="#6a4a32" />
        {pine}
        <g>
          <OG sh={[{ d: ell([84, 166], 18, 26), f: '#9a6a3c' }]} />
          {[-14, -4, 6, 16].map((dy) => <path key={dy} d={`M68 ${166 + dy}Q84 ${172 + dy} 100 ${166 + dy}`} stroke={shade('#9a6a3c', 0.35)} stroke-width={1.6} fill="none" />)}
        </g>
        {yew}
        <Stem pts={[[176, 152], [240, 106], [304, 62]]} w={4} c="#6a4a32" />
        {aril(206, 146)}
        {aril(270, 102)}
        <No x={238} y={104} r={62} />
        <Emin />
      </Scene2>
    );
  },
  // Çam fıstığı: ateş yanında ısınıp pulları açılmış iri kozalak; el silkeliyor, tohumlar beze düşüyor
  'sf-ybt-cam-fistigi': () => {
    const cone: P = [176, 100];
    const hk = { x: 0, y: 0, a: -100, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 36 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [cone[0] + 36, cone[1] - 30];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="outdoor" gy={186}>
        <Campfire x={58} y={214} s={1.4} />
        <GroundCloth x={190} y={222} w={150} h={22} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin}>
          <OG sh={[{ d: capsule([cone[0] + 14, cone[1] - 30], 4, [grip[0] + 6, grip[1]], 4), f: '#7a5236' }]} />
        </Hand>
        <g>
          <OG sh={[{ d: ell(cone, 28, 36), f: '#5a3a26' }]} />
          {[-24, -12, 0, 12, 24].map((dy, r) => [-14, 0, 14].map((dx) => {
            const x = cone[0] + dx + (r % 2 ? 7 : 0), y = cone[1] + dy;
            if (Math.abs(x - cone[0]) > 22 - Math.abs(dy) * 0.4) return null;
            return <OG key={dx + '-' + dy} sh={[{ d: `M${x - 7} ${y - 3}Q${x} ${y - 8} ${x + 7} ${y - 3}L${x + 5} ${y + 4}Q${x} ${y + 6} ${x - 5} ${y + 4}Z`, f: '#b07440' }]} />;
          }))}
        </g>
        {[[150, 160], [176, 170], [204, 150], [160, 196], [214, 204], [182, 210]].map(([sx, sy], i) => <OG key={i} sh={[{ d: ell([sx, sy], 6, 4), f: '#5a3a26', t: `rotate(${i * 30} ${sx} ${sy})` }]} />)}
        <path d="M136 120l-8 4M136 136l-8 0M220 120l8 4" stroke={K.action} stroke-width={2.6} stroke-linecap="round" />
        <g>
          <OG sh={[{ d: ell([284, 214], 18, 8), f: C.stone }]} />
          <OG sh={[{ d: ell([278, 198], 8, 5), f: '#5a3a26' }, { d: ell([292, 198], 6, 4), f: '#f5ead2' }]} />
        </g>
      </Scene2>
    );
  },
  // İç kabuk: devrilmiş kütükte dış kabuk açılmış; açık renkli iç kabuk bıçakla şerit şerit sıyrılıyor
  'sf-ybt-ic-kabuk': () => {
    const hk = { x: 0, y: 0, a: -130, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [214, 62];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="outdoor" gy={150}>
        <OG sh={[{ d: 'M-10 104H262Q290 145 262 186H-10Z', f: C.bark }, { d: ell([262, 145], 26, 41), f: '#e9cf9a' }, { d: ell([262, 145], 18, 31), f: '#d9b77a' }]} />
        {[116, 172].map((y) => <path key={y} d={`M-10 ${y}H100`} stroke={shade(C.bark, 0.3)} stroke-width={2} />)}
        <OG sh={[{ d: 'M110 106H240V156H110Z', f: C.inner }]} />
        {[124, 140].map((y) => <path key={y} d={`M114 ${y}H236`} stroke={shade(C.inner, 0.2)} stroke-width={1.4} />)}
        <OG sh={[{ d: 'M140 106Q150 80 174 74Q188 72 196 80L186 90Q174 88 168 96Q162 102 164 106Z', f: '#f3e2b6' }]} />
        <Knife x={grip[0]} y={grip[1]} a={155} s={1.1} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Arrow from={[230, 206]} to={[120, 206]} />
        <Ok x={200} y={132} r={12} />
        <Bad x={40} y={140} r={12} />
      </Scene2>
    );
  },

  /* ───────── Sulak alan ───────── */
  // Kamış: suda boğumlu gövdeler, tüylü tepe; çamurda yatay beyaz kök ve sivri körpe filizler
  'sf-ybt-kamis': () => (
    <Scene2 bg="outdoor" gy={110}>
      <Water x={0} y={112} w={330} h={80} />
      <OG sh={[{ d: 'M-5 170Q80 164 160 170T330 168V250H-5Z', f: C.mud }]} />
      <OG sh={[{ d: capsule([30, 196], 7, [290, 200], 7), f: '#f2ead6' }]} />
      {[80, 150, 220].map((x) => <path key={x} d={`M${x} 190v14`} stroke={shade('#f2ead6', 0.3)} stroke-width={2} />)}
      {[[60, 18], [120, 30], [180, 14], [250, 26]].map(([x, top], i) => (
        <g key={x}>
          <Stem pts={[[x, 196], [x + 2, 120], [x + (i % 2 ? 6 : -4), top + 30]]} w={4} c="#9fb860" />
          {[150, 110, 80].map((y) => <path key={y} d={`M${x - 3} ${y}h7`} stroke={K.out} stroke-width={1.6} />)}
          <Lf x={x + 1} y={96} a={i % 2 ? -30 : -150} len={44} w={5} c="#8fae58" vein={false} />
          <OG sh={[{ d: smooth([[x + (i % 2 ? 6 : -4), top + 32], [x - 10, top + 12], [x + (i % 2 ? 12 : 2), top - 2], [x + 12, top + 16]], true), f: '#9a6a72' }]} />
        </g>
      ))}
      {[104, 200].map((x) => <OG key={x} sh={[{ d: `M${x - 5} 194Q${x} 160 ${x + 1} 150Q${x + 4} 170 ${x + 6} 194Z`, f: C.young }]} />)}
      <Arrow from={[30, 232]} to={[60, 206]} bend={-0.2} />
      <Arrow from={[160, 140]} to={[194, 158]} bend={0.2} />
    </Scene2>
  ),
  // Su kenarında şemsiye çiçekli ot (su baldıranı): parçalı yaprak, lekeli gövde, beyaz şemsiye çiçek — yasak.
  // Su teresi ve deniz rezenesi rehberlerinde kullanılır; yenen bitki bilerek çizilmez (yanlış teşhis riski).
  'sf-ybt-semsiye-yasak': () => (
    <Scene2 bg="outdoor" gy={160}>
      <Water x={0} y={188} w={330} h={60} />
      <OG sh={[{ d: 'M-5 172Q60 164 160 174T330 170V192H-5Z', f: C.mud }]} />
      <Stem pts={[[160, 184], [162, 124], [158, 78]]} w={6} c="#6f9a5c" />
      <g fill="#7a3f5a">{[[160, 168], [162, 150], [161, 134], [159, 116], [160, 98]].map(([sx, sy], i) => <ellipse key={i} cx={sx + (i % 2 ? 1.5 : -1.5)} cy={sy} rx={2.2} ry={3.4} />)}</g>
      <Fern x={161} y={156} a={-150} len={60} />
      <Fern x={161} y={136} a={-30} len={60} />
      <Fern x={160} y={110} a={-148} len={44} />
      <Fern x={160} y={102} a={-32} len={40} />
      <Umbel x={158} y={78} r={46} />
      <No x={160} y={112} r={92} />
      <Emin y={224} />
    </Scene2>
  ),
  // Su kenarı otları kaynatılır; çiğ salata ve sirke yetmez
  'sf-ybt-tere-kaynatma': () => (
    <Scene2 bg="outdoor" gy={190}>
      <Campfire x={110} y={224} s={1.5} />
      <Pot x={110} y={208} s={1.8} />
      {[[-20, -50], [0, -54], [18, -50]].map(([dx, dy], i) => <OG key={i} sh={[{ d: circ([110 + dx, 208 + dy], 7), f: C.leafDk }]} />)}
      <Label x={110} y={58} text="60 °C +" />
      <g>
        <OG sh={[{ d: ell([250, 210], 42, 10), f: '#f2f0ea' }]} />
        {[[232, 202], [248, 198], [262, 203], [270, 196]].map(([lx, ly], i) => <OG key={i} sh={[{ d: circ([lx, ly], 7), f: C.leaf }]} />)}
        <OG sh={[{ d: 'M282 160H296V196H282Z', f: '#e9e3c8' }, { d: rrect(285, 150, 8, 12, 2), f: '#8e99a6' }]} />
        <Bad x={250} y={170} r={14} />
      </g>
    </Scene2>
  ),

  /* ───────── Kıyı ───────── */
  // Deniz börülcesi (şematik): çamurda eklem eklem şişkin yeşil gövdeler; makas körpe ucu kesiyor
  'sf-ybt-borulce': () => {
    const seg = (x: number, y: number, n: number, a: number, k: string) => {
      const out: JSX.Element[] = [];
      let p: P = [x, y];
      for (let i = 0; i < n; i++) {
        const q = pol(p, a + (i % 2 ? 4 : -4), 16);
        out.push(<OG key={k + i} sh={[{ d: capsule(p, 6, q, 7), f: i === n - 1 ? C.young : '#6fae4f' }]} />);
        p = q;
      }
      return out;
    };
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M-5 190Q80 184 160 190T330 188V250H-5Z', f: C.mud }]} />
        <path d="M30 206h40M120 214h30M220 208h50" stroke={K.waterLight} stroke-width={3} stroke-linecap="round" />
        {seg(100, 194, 6, -96, 'a')}
        {seg(140, 196, 7, -86, 'b')}
        {seg(180, 194, 5, -72, 'c')}
        {seg(70, 196, 4, -120, 'd')}
        {seg(140, 150, 3, -40, 'e')}
        <Scissors x={176} y={76} a={150} s={1.1} />
        <HoldAt at={pol([176, 76], 150, -27)} a={-120} />
        <Arrow from={[80, 40]} to={[160, 70]} bend={-0.2} />
      </Scene2>
    );
  },
  /* ───────── Akdeniz ───────── */
  // Keçiboynuzu: koyu yeşil yapraklı dalda olgun koyu kahverengi baklalar; el bakla koparıyor
  'sf-ybt-keciboynuzu': () => {
    const pod = (x: number, y: number, a: number, k: number) => <Gx key={k} x={x} y={y} a={a} sh={[{ d: 'M0 -7Q50 -14 96 -2Q102 4 96 8Q50 6 0 7Q-4 0 0 -7Z', f: '#5a3220' }, { d: 'M6 -2Q50 -6 92 2', st: '#7a4a30', sw: 1.4 }]} />;
    const pinch: P = [214, 120];
    const hk = { x: 0, y: 0, a: -100, s: 0.95, pose: 'pinch' as const, side: 'R' as const };
    const q = handPoint(hk, 'pinch');
    const h = { ...hk, x: pinch[0] - q[0], y: pinch[1] - q[1] };
    return (
      <Scene2 bg="closeup">
        <Stem pts={[[0, 40], [90, 56], [200, 60], [320, 40]]} w={7} c="#6a4a32" />
        {[[40, 46, -120], [120, 58, -70], [170, 60, -110], [260, 50, -60], [70, 50, 110]].map(([lx, ly, la], i) => (
          <g key={i} transform={tr(lx, ly, 1, la)}>
            {[18, 40].map((d) => <OG key={d} sh={[{ d: ell([d, -10], 11, 8), f: '#2f6a3e' }, { d: ell([d, 10], 11, 8), f: '#2a5c36' }]} />)}
          </g>
        ))}
        {pod(96, 62, 86, 1)}
        {pod(130, 62, 76, 2)}
        {pod(206, 62, 92, 3)}
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
      </Scene2>
    );
  },
  // Zakkum dalı (uzun, kalın yapraklar üçlü halkalar halinde; pembe çiçek salkımı) — büyük yasak.
  // Defne bilerek çizilmez: karayemiş de defneye benzer; "yenir" kartı yanlış teşhise yol açar.
  'sf-ybt-zakkum-defne': () => (
    <Scene2 bg="closeup">
      <Stem pts={[[160, 230], [160, 150], [160, 66]]} w={5} c="#6f8a4a" />
      {[[200, 0], [150, 30], [104, 0]].map(([ny, off], i) => (
        <g key={i}>{[-160, -90, -20].map((a) => <Lf key={a} x={160} y={ny} a={a + off - (i === 1 ? 0 : 0)} len={74 - i * 6} w={9} c={i % 2 ? '#3f6e3c' : '#4a7a44'} />)}</g>
      ))}
      {[[140, 58], [176, 50], [160, 72], [124, 76], [194, 72]].map(([fx, fy], i) => (
        <g key={i}>{[0, 72, 144, 216, 288].map((a) => {
          const q = pol([fx, fy], a, 8);
          return <OG key={a} sh={[{ d: ell(q, 7, 5), f: i % 2 ? '#e77fa8' : '#f29cbf', t: `rotate(${a} ${f1(q[0])} ${f1(q[1])})` }]} />;
        })}<circle cx={fx} cy={fy} r={3} fill="#c94f7c" /></g>
      ))}
      <No x={160} y={118} r={92} />
      <Emin y={226} />
    </Scene2>
  ),

  /* ───────── Yosun ───────── */
  // Temiz açık kıyı: dalgalı kayalıkta kayaya bağlı yeşil yosun kesiliyor | liman, boru ağzı, çürük yosun yığını — yasak
  'sf-ybt-yosun-temiz-kiyi': () => {
    const tip: P = [92, 128];
    const hk = { x: 0, y: 0, a: -120, s: 0.75, pose: 'pinch' as const, side: 'R' as const };
    const q = handPoint(hk, 'pinch');
    const h = { ...hk, x: tip[0] - q[0], y: tip[1] - q[1] };
    return (
      <Scene2 bg="closeup">
        <defs><clipPath id="sfybt-yk-l"><rect x={10} y={10} width={145} height={196} rx={12} /></clipPath><clipPath id="sfybt-yk-r"><rect x={165} y={10} width={145} height={196} rx={12} /></clipPath></defs>
        <g clip-path="url(#sfybt-yk-l)">
          <rect x={10} y={10} width={145} height={196} fill={K.sky} />
          <Water x={10} y={100} w={150} h={110} />
          <path d="M20 104q10 -14 24 -4t24 -6" stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round" />
          <OG sh={[{ d: 'M30 210L44 150L80 136L120 150L134 210Z', f: K.rock }]} />
          {[60, 76, 92].map((x, i) => <OG key={x} sh={[{ d: `M${x} 146Q${x - 8} 130 ${x + 2} 118Q${x + 10} 130 ${x + 4} 146Z`, f: i % 2 ? '#5fc24a' : '#7fd25a' }]} />)}
          <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        </g>
        <rect x={10} y={10} width={145} height={196} rx={12} fill="none" stroke={K.out} stroke-width={1.5} />
        <g clip-path="url(#sfybt-yk-r)">
          <rect x={165} y={10} width={145} height={196} fill="#cfd8dc" />
          <Water x={165} y={120} w={150} h={90} color="#5f8a7a" />
          <OG sh={[{ d: rrect(165, 60, 70, 62, 2), f: '#a9a49a' }, { d: capsule([210, 100], 9, [252, 104], 9), f: '#7d8590' }]} />
          <OG sh={[{ d: 'M254 106Q262 126 258 140L246 140Q250 124 246 110Z', f: '#5a4a32' }]} />
          <OG sh={[{ d: 'M190 180Q210 150 240 160Q270 150 296 180Z', f: '#6a5a2a' }]} />
          {[[210, 168], [230, 160], [260, 166]].map(([fx, fy], i) => <path key={i} d={`M${fx} ${fy - 10}q4 -4 0 -8`} stroke={K.out} stroke-width={1.4} fill="none" />)}
        </g>
        <rect x={165} y={10} width={145} height={196} rx={12} fill="none" stroke={K.out} stroke-width={1.5} />
        <No x={238} y={120} r={60} />
        <Ok x={36} y={36} r={13} />
      </Scene2>
    );
  },
  // Göl köpüğü: durgun gölde parlak yeşil boya gibi tabaka; kaynatmak zehri gidermez
  'sf-ybt-gol-kopuk': () => (
    <Scene2 bg="outdoor" gy={120}>
      <Water x={0} y={130} w={330} h={110} color="#4a8fb0" />
      <OG sh={[{ d: 'M20 140Q60 128 100 140T180 138T240 144Q200 162 140 158T20 156Z', f: '#5fd03a' }, { d: 'M60 176Q100 168 150 178T230 176Q190 196 120 190T60 186Z', f: '#4cc032' }]} />
      <g fill="#a6f070">{[[50, 146], [90, 150], [130, 146], [170, 150], [110, 182], [160, 184]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} />)}</g>
      <OG sh={[{ d: 'M230 134Q270 118 330 124V240H260Q250 190 230 134Z', f: K.grass }]} />
      <Campfire x={282} y={222} s={1.0} />
      <Pot x={282} y={212} s={1.1} />
      <Bad x={300} y={154} r={11} />
      <Warn x={60} y={70} r={26} />
    </Scene2>
  ),

  /* ───────── Liken ───────── */
  // Toplanmayacak likenler: taş üstünde parlak sarı-turuncu liken | daldan sakal gibi sarkan liken — ikisi de yasak.
  // Yenen liken bilerek çizilmez ("yenir" kartı yok).
  'sf-ybt-liken-ayrim': () => (
    <Scene2 bg="closeup">
      <Panel x={10} w={145} />
      <Panel x={165} w={145} />
      <OG sh={[{ d: smooth([[24, 180], [40, 120], [90, 100], [140, 128], [140, 186], [70, 196]], true), f: K.rock }]} />
      {[[62, 140, 16], [96, 128, 13], [86, 164, 18], [118, 158, 11], [50, 172, 10]].map(([cx, cy, r], i) => <OG key={i} sh={[{ d: circ([cx, cy], r), f: i % 2 ? '#f2b41e' : '#ea8a1a' }]} />)}
      <No x={82} y={112} r={62} />
      <Stem pts={[[170, 40], [240, 50], [306, 42]]} w={6} c="#6a4a32" />
      {[192, 214, 236, 258, 280].map((x, i) => (
        <path key={x} d={`M${x} 48q-8 26 3 48t-3 ${54 + (i % 2) * 18}`} stroke="#b9d0a0" stroke-width={6} fill="none" stroke-linecap="round" />
      ))}
      <No x={238} y={112} r={62} />
      <Emin />
    </Scene2>
  ),
  // Liken acılığı: doğranmış liken suda; kaşıkla kül ekleniyor; bir gece
  'sf-ybt-liken-kul': () => {
    const sp: P = [146, 104];
    const hk = { x: 0, y: 0, a: -60, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [208, 70];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="indoor" gy={170}>
        <Bowl x={130} y={206} w={150} h={50} c="#d9cbb0" liquid="#b9c8a8" />
        {[[90, 158], [110, 160], [130, 156], [150, 160], [170, 157]].map(([lx, ly], i) => <OG key={i} sh={[{ d: ell([lx, ly], 9, 3.4), f: '#8a7a44' }]} />)}
        <path d={line([sp, grip])} stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={line([sp, grip])} stroke={C.steel} stroke-width={3} stroke-linecap="round" />
        <OG sh={[{ d: ell(sp, 10, 6), f: C.steel }, { d: ell([sp[0], sp[1] - 2], 8, 3.6), f: '#9a9a9a' }]} />
        <g fill="#8a8a8a">{[[144, 120], [148, 132], [142, 144]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} />)}</g>
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Bowl x={268} y={206} w={60} h={22} c="#c9b590" liquid="#9a9a9a" />
        <Moon x={50} y={60} r={18} />
        <Label x={66} y={104} text="1 gece" />
      </Scene2>
    );
  },
  /* ───────── Bahçe ───────── */
  // Terk edilmiş bahçe: meyve ağacı ve sebze sıraları; köşede ilaç şişeleri, gübre çuvalı, akaryakıt bidonu — çevresi kırmızı kesikli, çarpılı
  'sf-ybt-bahce-tehlike': () => (
    <Scene2 bg="outdoor" gy={96}>
      <rect x={0} y={96} width={320} height={144} fill="#a8c47a" />
      {[120, 150, 180, 210].map((y, r) => (
        <g key={y}>
          <rect x={20} y={y - 4} width={170} height={10} rx={5} fill={C.soil} />
          {Array.from({ length: 8 }, (_, i) => <OG key={i} sh={[{ d: circ([32 + i * 21, y - 2], 7 - r * 0.4), f: r % 2 ? C.leaf : C.leafDk }]} />)}
        </g>
      ))}
      <Tree x={60} y={104} s={0.9} />
      {[[44, 30], [72, 26], [58, 14]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r={4} fill="#d84a3a" stroke={K.out} stroke-width={1} />)}
      <circle cx={256} cy={176} r={54} fill="#e5393522" stroke={K.danger} stroke-width={3} stroke-dasharray="8 6" />
      <Gx x={226} y={186} a={80} sh={[{ d: rrect(-6, -26, 12, 26, 3), f: '#e9e3c8' }, { d: rrect(-4, -32, 8, 7, 2), f: '#3d7ad6' }, { d: rrect(-5, -18, 10, 8, 1), f: K.danger }]} />
      <Gx x={244} y={200} a={-70} sh={[{ d: rrect(-6, -26, 12, 26, 3), f: '#d9e6c8' }, { d: rrect(-4, -32, 8, 7, 2), f: '#6c9c5a' }]} />
      <OG sh={[{ d: 'M250 148H286L290 186H246Z', f: '#e6dcc0' }, { d: 'M256 162H280V172H256Z', f: '#c6574e' }]} />
      <OG sh={[{ d: rrect(270, 186, 30, 34, 4), f: K.danger }, { d: rrect(276, 180, 12, 8, 2), f: '#8e1f1c' }]} />
      <path d="M236 206q10 4 22 0" stroke="#5a4a2a" stroke-width={4} fill="none" opacity={0.6} />
      <Bad x={300} y={128} r={13} />
    </Scene2>
  ),
  // Yeşillenmiş patates: yeşil kısım ve kabuk kalınca soyuluyor; baştan sona yeşil filizli patates çarpılı
  'sf-ybt-yesil-patates': () => {
    const hk = { x: 0, y: 0, a: -110, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [176, 86];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="closeup">
        <defs><clipPath id="sfybt-pt"><path d={ell([140, 128], 76, 56)} /></clipPath></defs>
        <OG sh={[{ d: ell([140, 128], 76, 56), f: '#c9a26a' }]} />
        <g clip-path="url(#sfybt-pt)">
          <path d={ell([140, 128], 70, 50)} fill="#f2e3b0" />
          <path d={ell([64, 128], 26, 62)} fill="#9fca5a" />
        </g>
        <path d="M70 98Q60 130 76 160" stroke="#7fb24a" stroke-width={3} fill="none" stroke-dasharray="5 4" />
        <OG sh={[{ d: 'M66 166Q50 196 26 194Q36 176 58 156Z', f: '#9fca5a' }]} />
        <Knife x={grip[0]} y={grip[1]} a={200} s={1.3} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Arrow from={[32, 46]} to={[64, 92]} bend={-0.2} />
        <g>
          <OG sh={[{ d: ell([262, 206], 34, 22), f: '#8fbf5a' }]} />
          {[[244, 190], [270, 186], [286, 200]].map(([sx, sy], i) => <OG key={i} sh={[{ d: capsule([sx, sy], 3, [sx + (i - 1) * 4, sy - 14], 2.4), f: '#d9c8e8' }]} />)}
          <Bad x={298} y={176} r={11} />
        </g>
      </Scene2>
    );
  },
  // Acı kabak: çiğ kabaktan ince dilim dilin ucuyla tadılıyor; acıysa bütün kabak çöpe
  'sf-ybt-aci-kabak': () => {
    const base: PersonProps = { ...CAST.toplayici, x: 92, y: 82, ax: 'head', ay: 'head', s: 2.3, shadow: false, pose: { ...POSE.standSide, head: -86, face: 'neutral' } };
    const r0 = rig(base);
    const lip: P = [r0.mouth[0] + 8, r0.mouth[1] + 1];
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [lip[0] + 20, lip[1] + 10], bend: 1 }, handF: { shape: 'fist', a: -90 } } };
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['legB', 'legF', 'torso', 'head']} />
        <OG sh={[{ d: ell([lip[0] + 6, lip[1]], 3, 9), f: '#eef0c8' }, { d: `M${lip[0] + 3} ${lip[1] - 9}A3 9 0 0 0 ${lip[0] + 3} ${lip[1] + 9}`, st: '#4f8a3a', sw: 2.4 }]} />
        <Person {...p} only={['armF']} />
        <Gx x={206} y={122} a={-20} sh={[{ d: capsule([-26, 0], 13, [26, 0], 15), f: '#5f9a3e' }, { d: 'M-24 -4H22', st: '#8fc06a', sw: 2 }, { d: rrect(-36, -4, 10, 8, 2), f: '#6a7a3a' }]} />
        <Arrow from={[222, 146]} to={[262, 170]} bend={-0.2} />
        <OG sh={[{ d: 'M248 176H300L294 230H254Z', f: '#7d8590' }, { d: rrect(244, 168, 60, 10, 3), f: '#5d6570' }]} />
        <Label x={250} y={50} text="acı?" />
      </Scene2>
    );
  },

  /* ───────── Şehir ───────── */
  // Parkta meyveli ağaç (yer seçimi, onay); kaldırım ve yol kenarındaki otlar çarpılı
  'sf-ybt-sehir-meyve': () => (
    <Scene2 bg="outdoor" gy={176}>
      <rect x={0} y={196} width={320} height={44} fill="#8e939b" />
      <path d="M0 218H320" stroke="#fff" stroke-width={3} stroke-dasharray="18 12" />
      <rect x={0} y={186} width={320} height={10} fill="#c9c6bd" stroke={K.out} stroke-width={1.2} />
      <Tree x={120} y={182} s={1.25} color="#5f9c47" />
      {[[96, 80], [120, 66], [140, 92], [108, 104], [132, 110], [150, 76]].map(([fx, fy], i) => <OG key={i} sh={[{ d: capsule([fx, fy - 3], 3.6, [fx, fy + 3], 3.6), f: C.berry }]} />)}
      <Ok x={168} y={40} r={14} />
      {[230, 252, 274].map((x, i) => (
        <g key={x}>
          <Lf x={x} y={188} a={-120 + i * 10} len={22} w={6} c="#7d9a5a" teeth={4} />
          <Lf x={x} y={188} a={-60 - i * 6} len={20} w={6} c="#6d8a4a" teeth={4} />
        </g>
      ))}
      <Bad x={292} y={160} r={12} />
    </Scene2>
  ),
  // Mesafe şeması (yukarıdan): işlek yol ve eski boyalı bina dibinde kırmızı kurşun bandı; ortadaki yeşil alan uygun
  'sf-ybt-sehir-mesafe': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#9fca7a" />
      <rect x={0} y={0} width={60} height={240} fill="#7d828a" />
      <path d="M30 0V240" stroke="#fff" stroke-width={3} stroke-dasharray="16 12" />
      <rect x={60} y={0} width={26} height={240} fill={K.danger} opacity={0.35} />
      <OG sh={[{ d: rrect(200, 14, 108, 64, 4), f: '#d8c8b0' }]} />
      <path d="M204 22h100M204 70h100" stroke="#b9a586" stroke-width={2} />
      <rect x={186} y={10} width={130} height={86} rx={8} fill={K.danger} opacity={0.3} />
      <OG sh={[{ d: rrect(120, 130, 100, 74, 14), f: '#6fb04f' }]} />
      {[[140, 150], [196, 152], [168, 186]].map(([tx, ty], i) => <OG key={i} sh={[{ d: circ([tx, ty], 11), f: '#4f8f3a' }]} />)}
      <Ok x={220} y={128} r={13} />
      <Arrow from={[96, 166]} to={[114, 166]} w={4} head={0.8} />
      <Arrow from={[96, 166]} to={[66, 166]} w={4} head={0.8} />
    </Scene2>
  ),

  /* ───────── Zehirli otlar ───────── */
  // Su baldıranı: dere kenarında beyaz şemsiye çiçekli ot; kesitte içi bölmeli kök sapı; büyük yasak
  'sf-ybt-su-baldirani': () => (
    <Scene2 bg="outdoor" gy={170}>
      <Water x={0} y={196} w={330} h={50} />
      <OG sh={[{ d: 'M-5 180Q60 172 160 182T330 178V200H-5Z', f: C.mud }]} />
      <Stem pts={[[120, 190], [122, 120], [118, 62]]} w={6} c="#6f9a5c" />
      <Fern x={121} y={160} a={-150} len={56} />
      <Fern x={121} y={140} a={-30} len={56} />
      <Fern x={120} y={104} a={-145} len={42} />
      <Umbel x={118} y={62} r={46} />
      <No x={120} y={120} r={92} />
      <g>
        <rect x={232} y={22} width={78} height={110} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(256, 34, 30, 86, 13), f: '#f3efe0' }]} />
        {[50, 66, 82, 98].map((y) => <path key={y} d={`M258 ${y}H284`} stroke={K.out} stroke-width={1.6} />)}
        <path d="M262 42v74M280 42v74" stroke="#d9cfb0" stroke-width={1.2} />
      </g>
    </Scene2>
  ),
  // Akçöpleme: kalın gövdede sarmal dizilmiş pileli geniş yapraklar; tepede yeşilimsi-beyaz çiçek salkımı
  'sf-ybt-cople': () => (
    <Scene2 bg="outdoor" gy={180}>
      <Stem pts={[[160, 222], [160, 120], [160, 50]]} w={9} c="#8ab060" />
      {[[-150, 200], [-30, 186], [-160, 160], [-20, 146], [-145, 120], [-35, 104]].map(([a, y], i) => <Pleated key={i} x={160} y={y} a={a} len={70 - i * 5} w={22 - i} />)}
      {[[-120, 60], [-90, 50], [-60, 60], [-140, 76], [-40, 76]].map(([a, y], i) => (
        <g key={i}>
          <path d={line([[160, y], pol([160, y], a, 34)])} stroke={K.out} stroke-width={3.4} />
          <path d={line([[160, y], pol([160, y], a, 34)])} stroke="#b9c890" stroke-width={1.6} />
          {[14, 24, 34].map((d) => <OG key={d} sh={[{ d: circ(pol([160, y], a, d), 3.4), f: '#e8eccb' }]} />)}
        </g>
      ))}
      <No x={160} y={120} r={94} />
    </Scene2>
  ),
  // Kurtboğan: el gibi derin parçalı yapraklar, miğfer biçimli mor çiçek salkımı; küçük çerçevede krem çiçekli hali
  'sf-ybt-kurtbogan': () => {
    const palm = (x: number, y: number, a: number, L: number, k: number) => (
      <g key={k}>{[-60, -30, 0, 30, 60].map((d) => <Lf key={d} x={x} y={y} a={a + d} len={L * (1 - Math.abs(d) / 200)} w={L * 0.12} teeth={5} c={C.leafDk} />)}</g>
    );
    const helmet = (x: number, y: number, c: string, k: string) => <OG key={k} sh={[{ d: `M${x - 9} ${y + 6}Q${x - 10} ${y - 10} ${x + 2} ${y - 12}Q${x + 10} ${y - 8} ${x + 8} ${y + 6}Q${x} ${y + 2} ${x - 9} ${y + 6}Z`, f: c }, { d: ell([x - 1, y + 8], 7, 4), f: shade(c, 0.15) }]} />;
    return (
      <Scene2 bg="closeup">
        <Soil y={214} />
        <Stem pts={[[130, 216], [132, 140], [134, 40]]} w={5} c="#6f8a4a" />
        {palm(132, 190, -150, 52, 1)}
        {palm(132, 176, -30, 52, 2)}
        {palm(133, 140, -145, 40, 3)}
        {[44, 62, 80, 98, 116].map((y, i) => helmet(134 + (i % 2 ? 10 : -10), y, '#5a5ab8', 'h' + i))}
        <No x={134} y={120} r={92} />
        <rect x={238} y={20} width={72} height={106} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        <Stem pts={[[274, 120], [274, 34]]} w={3} c="#6f8a4a" />
        {[46, 66, 86, 106].map((y, i) => helmet(274 + (i % 2 ? 8 : -8), y, '#efe3b0', 'c' + i))}
        <Bad x={300} y={30} r={10} />
      </Scene2>
    );
  },

  /* ───────── Zehirli ağaç ve çalılar ───────── */
  // Porsuk: yassı iğneli dal, kırmızı kadeh meyveler, içteki koyu tohum; arkada budanmış porsuk çit; büyük yasak
  'sf-ybt-porsuk-ayrinti': () => {
    const needles: JSX.Element[] = [];
    for (let i = 0; i < 24; i++) {
      const x = 22 + i * 12, y = 154 - i * 12 * (90 / 280);
      needles.push(<Lf key={'a' + i} x={x} y={y} a={-108} len={24} w={3.6} c="#2f6a3e" vein={false} />);
      needles.push(<Lf key={'b' + i} x={x} y={y} a={72} len={22} w={3.6} c="#245a34" vein={false} />);
    }
    const aril = (x: number, y: number) => (
      <g key={x}>
        <OG sh={[{ d: 'M-13 -8Q-14 -17 0 -17Q14 -17 13 -8Q14 10 0 13Q-14 10 -13 -8Z', f: '#e0322e', t: `translate(${x} ${y})` }, { d: ell([x, y + 5], 6, 5), f: '#2a1e18' }]} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={200}>
        <OG sh={[{ d: rrect(0, 196, 320, 60, 20), f: '#2f5a3a' }]} />
        {needles}
        <Stem pts={[[16, 156], [160, 110], [304, 62]]} w={5} c="#6a4a32" />
        {aril(96, 148)}
        {aril(224, 104)}
        <No x={160} y={112} r={100} />
      </Scene2>
    );
  },
  // Zakkum: dere yatağında pembe çiçekli çalı; dalından şiş ve ateş odunu yapılmaz
  'sf-ybt-zakkum': () => (
    <Scene2 bg="outdoor" gy={170}>
      <OG sh={[{ d: 'M-5 196Q100 186 200 196T330 192V250H-5Z', f: '#cdbb98' }]} />
      {[[60, 210], [120, 216], [210, 206]].map(([rx, ry], i) => <Rock key={i} x={rx} y={ry} s={0.6} />)}
      <Stem pts={[[110, 196], [104, 130], [80, 80]]} w={4} c="#6f8a4a" />
      <Stem pts={[[110, 196], [120, 120], [150, 70]]} w={4} c="#6f8a4a" />
      {[[88, 100], [104, 140], [140, 90], [118, 150]].map(([nx, ny], i) => (
        <g key={i}>{[-160, -90, -20].map((a) => <Lf key={a} x={nx} y={ny} a={a + i * 10} len={46} w={6} c="#3f6e3c" />)}</g>
      ))}
      {[[78, 70], [152, 62], [96, 84], [136, 78]].map(([fx, fy], i) => (
        <g key={i}>{[0, 72, 144, 216, 288].map((a) => { const q = pol([fx, fy], a, 7); return <OG key={a} sh={[{ d: ell(q, 6, 4.4), f: '#ee8fb4', t: `rotate(${a} ${q[0]} ${q[1]})` }]} />; })}</g>
      ))}
      <No x={114} y={120} r={84} />
      <g>
        <path d="M228 120L300 96" stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d="M228 120L300 96" stroke="#9fb070" stroke-width={3} stroke-linecap="round" />
        <Bad x={290} y={78} r={11} />
        <Campfire x={262} y={214} s={1.1} />
        <Bad x={292} y={172} r={11} />
      </g>
    </Scene2>
  ),
  // Eşek hıyarı: yerde sürünen kıllı yapraklar, küçük tüylü meyve suyunu fışkırtıyor; burun damlası yasak
  'sf-ybt-esek-hiyari': () => (
    <Scene2 bg="closeup">
      <Soil y={206} />
      <Stem pts={[[20, 200], [80, 190], [150, 196], [200, 186]]} w={4} c="#7f9a5a" />
      {[[50, 196, -120], [100, 190, -60], [150, 196, -110]].map(([lx, ly, la], i) => <Lf key={i} x={lx} y={ly} a={la} len={56} w={22} teeth={6} c="#6f9068" />)}
      <Gx x={196} y={176} a={-30} sh={[{ d: capsule([-14, 0], 9, [14, 0], 9), f: '#9ab870' }, ...[-8, 0, 8].map((d) => ({ d: `M${d} -9l-1 -4M${d} 9l1 4`, st: K.out, sw: 1.4 }))]} />
      <g fill={K.waterLight} stroke={K.out} stroke-width={1}>
        {[[220, 156, 5], [234, 146, 4], [248, 138, 3.4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
      </g>
      <g>
        <OG sh={[{ d: rrect(244, 56, 30, 46, 6), f: '#a9744a' }, { d: rrect(250, 40, 18, 18, 3), f: '#e9e3c8' }, { d: ell([259, 38], 9, 6), f: '#3d3a4a' }]} />
        <No x={259} y={70} r={42} />
      </g>
    </Scene2>
  ),

  /* ───────── Çocuk ───────── */
  // Çocuk bulduğu taneyi ağzına götürmeden yetişkine gösteriyor
  'sf-ybt-cocuk-goster': () => {
    const kid: PersonProps = { ...CAST.cocuk, x: 110, y: 222, s: 1.0, pose: { ...POSE.crouch, face: 'neutral', armF: [-20, -10], handF: 'flat' } };
    const kr = rig(kid);
    const adult: PersonProps = { ...CAST.toplayici, x: 220, y: 224, s: 1.0, flip: true, pose: { ...POSE.kneelOne, face: 'neutral', head: -70, armF: { to: [kr.handF[0] + 16, kr.handF[1] + 6] }, handF: 'flat' } };
    return (
      <Scene2 bg="outdoor" gy={186}>
        <Person {...kid} />
        <Berry x={kr.handF[0] + 2} y={kr.handF[1] - 7} r={6} c={C.black} />
        <Person {...adult} />
      </Scene2>
    );
  },
  // Taneli çalı: parlak siyah, kırmızı, beyaz taneler; uzanan küçük çocuk eli durduruluyor
  'sf-ybt-cocuk-tane': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: smooth([[20, 200], [40, 60], [160, 30], [290, 70], [300, 200]], true), f: '#4f8a3e' }]} />
      {[[80, 90, -30], [200, 70, 20], [240, 140, -40], [100, 160, 30]].map(([lx, ly, la], i) => <Lf key={i} x={lx} y={ly} a={la} len={40} w={13} c="#6aa850" />)}
      {[[120, 100], [134, 110], [126, 120]].map(([x, y], i) => <Berry key={'k' + i} x={x} y={y} r={8} c={C.black} />)}
      {[[200, 110], [214, 118], [206, 128]].map(([x, y], i) => <Berry key={'r' + i} x={x} y={y} r={8} c="#e0322e" />)}
      {[[160, 160], [174, 168], [166, 176]].map(([x, y], i) => <Berry key={'w' + i} x={x} y={y} r={8} c="#f6f4ee" />)}
      <Hand x={60} y={240} a={40} s={0.65} pose="open" side="R" arm={60} sleeve={HC.sleeve} skin={HC.skin} />
      <Bad x={64} y={176} r={12} />
      <No x={166} y={136} r={74} />
    </Scene2>
  ),
  // Çocuk bilinmeyen bir şey yediyse: yetişkin 114'ü arıyor; bitki parçası küçük torbada saklanıyor
  'sf-ybt-cocuk-agiz': () => {
    const kid: PersonProps = { ...CAST.cocuk, x: 200, y: 222, s: 0.95, flip: true, pose: { ...POSE.standSide, face: 'worried' } };
    const kr = rig(kid);
    const adult: PersonProps = { ...CAST.toplayici, x: 120, y: 224, s: 1.05, pose: { ...POSE.kneelOne, face: 'worried', head: -84, armF: { to: [kr.shoulderF[0] + 2, kr.shoulderF[1] + 4] }, handF: 'flat' } };
    return (
      <Scene2 bg="outdoor" gy={186}>
        <Person {...kid} />
        <Person {...adult} />
        <Phone x={270} y={70} s={0.95} text="114" />
        <OG sh={[{ d: rrect(36, 192, 34, 30, 4), f: '#e6f0f4', op: 0.9 }, { d: 'M36 198H70', st: K.danger, sw: 2 }]} />
        <Lf x={44} y={216} a={-40} len={20} w={6} c={C.leaf} vein={false} />
      </Scene2>
    );
  },

  /* ───────── Acılık giderme ───────── */
  // Kaynatıp suyunu dökme: kaynamış ot süzgeçte kalıyor, tencereden dökülen acı su süzgeçten alttaki kaba akıyor
  'sf-ybt-ot-kaynatma': () => (
    <Scene2 bg="indoor" gy={186}>
      {/* eğik tencere (sağ üstte), ağzı sola-aşağı */}
      <g transform="rotate(-62 236 92)"><Pot x={236} y={110} s={1.6} boil={false} /></g>
      <path d="M196 96Q178 104 170 128" stroke={K.out} stroke-width={10} fill="none" stroke-linecap="round" />
      <path d="M196 96Q178 104 170 128" stroke="#9cc8b0" stroke-width={6} fill="none" stroke-linecap="round" />
      {/* süzgeç ve içindeki ot */}
      <OG sh={[{ d: 'M106 136H214Q208 180 160 182Q112 180 106 136Z', f: '#c9d2da' }, { d: capsule([96, 136], 4, [106, 136], 4), f: '#9aa6b2' }, { d: capsule([214, 136], 4, [224, 136], 4), f: '#9aa6b2' }]} />
      {[[124, 134], [140, 130], [156, 133], [172, 129], [190, 134], [148, 138], [182, 138]].map(([lx, ly], i) => <Lf key={i} x={lx - 8} y={ly} a={-15 + (i % 3) * 15} len={20} w={6} c={i % 2 ? C.leafDk : C.leaf} vein={false} />)}
      <g fill={K.out}>{[132, 146, 160, 174, 188].map((x) => <circle key={x} cx={x} cy={162} r={1.8} />)}</g>
      {/* süzgeçten akan su */}
      <g fill="#9cc8b0" stroke={K.out} stroke-width={1}>{[[148, 194], [162, 200], [174, 192]].map(([dx, dy], i) => <ellipse key={i} cx={dx} cy={dy} rx={3} ry={4.5} />)}</g>
      <Bowl x={160} y={232} w={130} h={22} c="#b9c3cc" liquid="#9cc8b0" />
    </Scene2>
  ),
  // Kireç suyunda mısır: tencerede su ve mısır; eldivenli el kaşıkla sönmüş kireç ekliyor
  'sf-ybt-misir-kirec': () => {
    const sp: P = [150, 120];
    const hk = { x: 0, y: 0, a: -60, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [216, 82];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="indoor" gy={190}>
        <GloveDefs />
        <Campfire x={140} y={226} s={1.4} />
        <OG sh={[{ d: 'M84 150H196L192 206Q192 212 186 212H94Q88 212 88 206Z', f: '#8e99a6' }, { d: ell([140, 150], 56, 8), f: K.water }]} />
        <g>{[[110, 150], [124, 148], [138, 152], [152, 148], [166, 151], [178, 149]].map(([x, y], i) => <OG key={i} sh={[{ d: ell([x, y], 5, 3.4), f: '#f2c234' }]} />)}</g>
        <path d={line([sp, grip])} stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={line([sp, grip])} stroke={C.steel} stroke-width={3} stroke-linecap="round" />
        <OG sh={[{ d: ell(sp, 11, 6), f: C.steel }, { d: ell([sp[0], sp[1] - 2], 9, 4), f: '#ffffff' }]} />
        <g fill="#fff" stroke={K.out} stroke-width={0.6}>{[[146, 132], [150, 140]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} />)}</g>
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Glove><Hand {...h} arm={18} skin={HT.skin} /></Glove>
        <Label x={86} y={50} text="1 kg : 10 g" size={14} />
      </Scene2>
    );
  },

  /* ───────── Tahıl ───────── */
  // Ergot: başaktaki taneler arasından çıkan mor-siyah boynuz biçimli mahmuzlar
  'sf-ybt-ergot-basak': () => {
    const grains: JSX.Element[] = [];
    for (let i = 0; i < 9; i++) {
      const y = 50 + i * 17;
      for (const sd of [-1, 1]) {
        const x = 150 + sd * 10;
        const spur = (i === 2 && sd === 1) || (i === 5 && sd === -1) || (i === 7 && sd === 1);
        grains.push(spur
          ? <Gx key={i + '' + sd} x={x} y={y} a={sd > 0 ? -60 : -120} sh={[{ d: 'M0 -5Q30 -7 52 -2Q56 0 52 2Q30 7 0 5Z', f: '#3a2236' }, { d: 'M6 -1H46', st: '#6a4a6a', sw: 1.4 }]} />
          : <Gx key={i + '' + sd} x={x} y={y} a={sd > 0 ? -60 : -120} sh={[{ d: ell([10, 0], 11, 6), f: '#d9b860' }, { d: `M20 0L60 0`, st: '#b89a4a', sw: 1.2 }]} />);
      }
    }
    return (
      <Scene2 bg="closeup">
        <Stem pts={[[150, 236], [150, 40]]} w={4} c="#c9a850" />
        {grains}
        <Arrow from={[270, 150]} to={[214, 126]} bend={0.2} />
        <Warn x={60} y={64} r={26} />
      </Scene2>
    );
  },
  // Tuzlu suda yüzdürme: dipte batan sağlam taneler, yüzeyde yüzen mahmuzlar ve boş taneler; kepçeyle alınıyor
  'sf-ybt-tuzlu-su-yuzdurme': () => {
    const hk = { x: 0, y: 0, a: -70, s: 0.95, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [262, 60];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    const lad: P = [190, 96];
    return (
      <Scene2 bg="indoor" gy={200}>
        <OG sh={[{ d: 'M60 80H240L228 222H72Z', f: '#dfe6ea' }]} />
        <path d="M63 100H237L228 218H72Z" fill="#a9d4ef" opacity={0.8} />
        <path d="M63 100H237" stroke="#fff" stroke-width={2} />
        {Array.from({ length: 16 }, (_, i) => <OG key={i} sh={[{ d: ell([84 + (i % 8) * 18, 208 - Math.floor(i / 8) * 8], 6, 3.6), f: '#d9b860' }]} />)}
        {[[90, 100, 1], [118, 99, 0], [150, 100, 1], [176, 99, 0], [110, 101, 0]].map(([x, y, sp], i) => (
          sp ? <OG key={i} sh={[{ d: capsule([x - 10, y - 2], 3, [x + 10, y - 3], 2.4), f: '#3a2236' }]} /> : <OG key={i} sh={[{ d: ell([x, y - 2], 6, 3), f: '#efe2b8' }]} />
        ))}
        <path d={line([lad, grip])} stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={line([lad, grip])} stroke={C.steel} stroke-width={3} stroke-linecap="round" />
        <OG sh={[{ d: `M${lad[0] - 16} ${lad[1]}Q${lad[0]} ${lad[1] + 16} ${lad[0] + 16} ${lad[1]}Z`, f: C.steel }]} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin} />
        <Label x={100} y={44} text="1 L + 250 g tuz" size={13} />
      </Scene2>
    );
  },
  // Buğday başağı (şematik) | delice: ince başak, sapa yan dizili başakçıklar, siyah taneler — yasak
  'sf-ybt-delice': () => {
    const wheat: JSX.Element[] = [];
    for (let i = 0; i < 8; i++) for (const sd of [-1, 1]) wheat.push(<Gx key={i + '' + sd} x={82 + sd * 8} y={50 + i * 16} a={sd > 0 ? -70 : -110} sh={[{ d: ell([9, 0], 11, 7), f: '#d9a850' }, { d: 'M20 0L50 0', st: '#b8904a', sw: 1.2 }]} />);
    const darnel: JSX.Element[] = [];
    for (let i = 0; i < 6; i++) {
      const sd = i % 2 ? 1 : -1;
      darnel.push(<g key={i}><Gx x={238} y={44 + i * 24} a={sd > 0 ? -35 : -145} sh={[{ d: ell([12, 0], 13, 5), f: '#7fa060' }]} /><OG sh={[{ d: ell([238 + sd * 12, 38 + i * 24], 4, 3), f: C.black }]} /></g>);
    }
    return (
      <Scene2 bg="closeup">
        <Panel x={10} w={145} />
        <Panel x={165} w={145} />
        <Stem pts={[[82, 204], [82, 44]]} w={4} c="#c9a850" />
        {wheat}
        <Stem pts={[[238, 204], [238, 40]]} w={3} c="#8aa86a" />
        {darnel}
        <No x={238} y={112} r={64} />
        <Emin />
      </Scene2>
    );
  },

  /* ───────── Baklagil (yalnız uyarı; "yenir" izlenimi verilmez) ───────── */
  // Mürdümük: ince dar yapraklar, beyaz-mavimsi çiçek, yassı bakla; büyük kırmızı uyarı üçgeni
  'sf-ybt-murdumuk': () => (
    <Scene2 bg="closeup">
      <Soil y={212} />
      <Stem pts={[[120, 214], [124, 140], [140, 60]]} w={3.4} c="#7fa060" />
      {[[122, 180, -150], [123, 160, -30], [126, 130, -150], [130, 110, -30], [134, 90, -140]].map(([lx, ly, la], i) => <Lf key={i} x={lx} y={ly} a={la} len={52} w={4} c={C.leaf} />)}
      {[[150, 66], [142, 50]].map(([fx, fy], i) => <OG key={i} sh={[{ d: ell([fx, fy], 9, 7), f: '#dfe8f8' }, { d: ell([fx + 6, fy + 2], 5, 4), f: '#a9c0ea' }]} />)}
      <Gx x={126} y={146} a={20} sh={[{ d: 'M0 -6Q24 -10 44 -2Q48 2 44 6Q24 8 0 6Z', f: '#b9cc7a' }, { d: 'M4 -4Q24 -8 42 -2', st: shade('#b9cc7a', 0.3), sw: 1.4 }]} />
      <Warn x={240} y={110} r={54} />
    </Scene2>
  ),
  // Yalnız mürdümükten oluşan tabak — büyük yasak (tek başına asla)
  'sf-ybt-murdumuk-oran': () => (
    <Scene2 bg="indoor" gy={150}>
      <OG sh={[{ d: ell([160, 180], 110, 36), f: '#f4f1ea' }, { d: ell([160, 176], 84, 24), f: '#ebe5d6' }]} />
      {Array.from({ length: 30 }, (_, i) => {
        const x = 96 + (i % 10) * 14 + (Math.floor(i / 10) % 2) * 6, y = 164 + Math.floor(i / 10) * 10;
        return <Gx key={i} x={x} y={y} a={i * 37} sh={[{ d: 'M-6 -4L5 -5L7 3L-4 5Z', f: '#d9cfa8' }]} />;
      })}
      <No x={160} y={150} r={88} />
    </Scene2>
  ),

  /* ───────── Kar ───────── */
  // Kar yemek yok: avuçtaki karı ağzına götüren yürüyüşçü; vücuttan soğuk çizgiler; büyük yasak
  'sf-ybt-kar-yasak': () => {
    const base: PersonProps = { ...CAST.yuruyuscu, x: 150, y: 226, s: 1.1, pose: { ...POSE.standSide, face: 'neutral' } };
    const m = rig(base).mouth;
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [m[0] + 10, m[1] + 8], bend: 1 }, handF: { shape: 'flat', a: -70 } } };
    const hf = rig(p).handF;
    return (
      <Scene2 bg="outdoor" gy={190} ground="snow">
        <Person {...p} />
        <OG sh={[{ d: ell([hf[0] + 4, hf[1] - 6], 9, 6), f: C.snow }]} />
        {[[100, 120, 180], [96, 160, 180], [200, 130, 0]].map(([x, y, a], i) => <Waves key={i} x={x} y={y} a={a} n={2} r={7} color="#5b8fc7" />)}
        <No x={150} y={130} r={96} />
      </Scene2>
    );
  },
  // Kar eritme: tencerede önce bir parmak su, kar azar azar ekleniyor | kuru tencere karla tepeleme — çarpılı
  'sf-ybt-kar-eritme': () => {
    const hk = { x: 0, y: 0, a: -150, s: 0.9, pose: 'hold' as const, side: 'R' as const, grip: 32 };
    const g0 = handPoint(hk, 'grip');
    const grip: P = [112, 100];
    const h = { ...hk, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    const cutPot = (x: number, y: number, k: string, water: boolean) => (
      <g key={k}>
        <OG sh={[{ d: `M${x - 44} ${y - 70}H${x + 44}L${x + 40} ${y - 4}Q${x + 40} ${y} ${x + 34} ${y}H${x - 34}Q${x - 40} ${y} ${x - 40} ${y - 4}Z`, f: '#c4ccd4' }]} />
        {water && <path d={`M${x - 41} ${y - 16}H${x + 41}L${x + 40} ${y - 4}Q${x + 40} ${y - 1} ${x + 34} ${y - 1}H${x - 34}Q${x - 39} ${y - 1} ${x - 40} ${y - 4}Z`} fill={K.water} />}
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={170} ground="snow">
        <Campfire x={90} y={226} s={1.3} />
        {cutPot(90, 206, 'a', true)}
        <OG sh={[{ d: ell([92, 184], 14, 8), f: C.snow }]} />
        <Hand {...h} arm={200} sleeve={HT.sleeve} skin={HT.skin}>
          <OG sh={[{ d: ell(grip, 12, 9), f: C.snow }]} />
        </Hand>
        <Arrow from={[40, 150]} to={[60, 186]} bend={0.3} w={5} />
        <Campfire x={242} y={226} s={1.3} />
        {cutPot(242, 206, 'b', false)}
        <OG sh={[{ d: 'M198 136Q200 100 242 92Q284 100 286 136Z', f: C.snow }, { d: 'M198 136H286V200H198Z', f: C.snow }]} />
        <Bad x={290} y={80} r={13} />
      </Scene2>
    );
  },
};
