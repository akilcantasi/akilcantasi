// Sıfırdan paketi sahneleri (a): Yiyecek bulma. Bkz. docs/agents/SIFIRDAN_CIZIM.md
// Not: zehirli/yenir karşılaştırmalarında "yenir" bitki bilerek şematik çizilir (tanıma rehberi değil);
// vurgu kırmızı yasak/uyarıdadır. Silah çizilmez; bıçak yalnız mutfak/temizlik aracı olarak küçük görünür.
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, Campfire, Flame, GY, Hand, K, Label, No, OG, OW, Ok, Person, Phone, POSE, Pot, Rock,
  Scene2, Smoke, Timer, Tree, Water, Waves, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═══════════════════════ OYUNCU KADROSU (paket geneli) ═══════════════════════ */
// Toplayıcı (yabani yiyecek rehberleri): kadın, topuz saç, camgöbeği üst, haki pantolon.
// Balıkçı (balık rehberleri): bıyıklı adam, esmer, hardal üst.
// İzci (iz ve tuzak rehberleri): kumral adam, yeşil üst.
// İşleyen (avı işleme): eldivenli eller (mavi nitril), kiremit kol.
const CAST = {
  toplayici: { who: 'woman', skin: 1, hair: 'bun', hairC: K.hair.dark, top: K.role.helper, bottom: 'pants', bottomC: K.pants.khaki } as const,
  balikci: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, top: K.role.bystander2, bottomC: K.pants.denim, mustache: true } as const,
  izci: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.brown, top: K.role.bystander3, bottomC: K.pants.brown } as const,
  isleyen: { who: 'woman', skin: 2, hair: 'scarf', hairC: '#7a6aa8', top: K.role.bystander4, bottomC: K.pants.dark, sleeve: 'long' } as const,
};
// Yakın plan eller (kadro ile aynı ten ve kol rengi)
const HT = { skin: 1, sleeve: K.role.helper } as const; // toplayıcı
const HB = { skin: 2, sleeve: K.role.bystander2 } as const; // balıkçı
const HI = { skin: 0, sleeve: K.role.bystander3 } as const; // izci
const HW = { skin: 2, sleeve: K.role.bystander4 } as const; // işleyen (eldivenli kullanılır)

/* ═══════════════════════ MALZEME RENKLERİ (paket geneli) ═══════════════════════ */
const C = {
  soil: '#9a7552',
  mud: '#7d6248',
  mudWet: '#6b5340',
  stone: '#b5b1a7',
  wood: '#a87449',
  stick: '#8a6038',
  rope: '#e8d6a8',
  steel: '#b9c2cc',
  glass: '#dcecf2',
  leaf: '#5aa84f',
  leafDk: '#3f8a3e',
  young: '#9bd36a',
  white: '#fbfaf5',
  glove: '#5d93d6',
  fish: '#9db3c3',
  fishBack: '#5f7d93',
  rabbit: '#a98a6c',
  deer: '#b27a4b',
  boar: '#5d4c42',
  liver: '#7a2230',
  bile: '#4f9a3a',
  meat: '#c9736a',
  egg: '#f1e6cf',
  bark: '#7a5236',
};

/* ═══════════════════════ YARDIMCILAR ═══════════════════════ */
const f1 = (n: number) => Math.round(n * 10) / 10;
const tr = (x: number, y: number, s = 1, a = 0, fl = false) => `translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${fl ? -s : s} ${s})`;
const poly = (ps: P[]) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
const line = (ps: P[]) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
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
      <filter id="sfyb-glove" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0.18 0.33 0.05 0 0  0.27 0.5 0.08 0 0  0.38 0.7 0.12 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  );
}
function Glove({ children }: { children: ComponentChildren }) {
  return <g filter="url(#sfyb-glove)">{children}</g>;
}

/** Yaprak yolu: taban (0,0), uç (len,0). teeth: diş sayısı (tırtıklı kenar) */
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
/** Yaprak: x,y taban, a yön (derece) */
function Lf({ x, y, a = 0, len = 30, w = 9, c = C.leaf, teeth = 0, shape = 0.8, vein = true }: { x: number; y: number; a?: number; len?: number; w?: number; c?: string; teeth?: number; shape?: number; vein?: boolean }) {
  return (
    <g transform={tr(x, y, 1, a)}>
      <OG sh={[{ d: leafD(len, w, teeth, shape), f: c }, ...(vein ? [{ d: `M2 0L${f1(len * 0.85)} 0`, st: shade(c, 0.3), sw: 1.2 }] : [])]} />
    </g>
  );
}
/** Sap/dal: noktalar boyunca kalınlık */
function Stem({ pts, w = 3, c = C.leafDk }: { pts: P[]; w?: number; c?: string }) {
  return (
    <g>
      <path d={smooth(pts)} fill="none" stroke={K.out} stroke-width={w + 3} stroke-linecap="round" />
      <path d={smooth(pts)} fill="none" stroke={c} stroke-width={w} stroke-linecap="round" />
    </g>
  );
}
/** İp / misina */
function Rope({ pts, w = 2.2, c = C.rope, out = true }: { pts: P[]; w?: number; c?: string; out?: boolean }) {
  return (
    <g fill="none" stroke-linecap="round">
      {out && <path d={smooth(pts)} stroke={K.out} stroke-width={w + 2} />}
      <path d={smooth(pts)} stroke={c} stroke-width={w} />
    </g>
  );
}
/** Toprak şeridi (yakın planlar için) */
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
/** İki panelli karşılaştırma zemini */
function Panels({ split = 160, frame = false }: { split?: number; frame?: boolean }) {
  const f = frame ? 'none' : '#f7f4ec';
  return (
    <g>
      <rect x={10} y={10} width={split - 15} height={220} rx={12} fill={f} stroke={K.out} stroke-width={1.5} />
      <rect x={split + 5} y={10} width={305 - split} height={220} rx={12} fill={f} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}
/** Küçük bıçak (mutfak/temizlik). x,y = sap ucu, a yön (0 = sağa) */
function Knife({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      { d: rrect(0, -4, 26, 8, 3), f: C.wood },
      { d: 'M26 -4H58Q66 -2 70 0Q62 4 26 4Z', f: C.steel },
      { d: 'M28 -1H60', st: tint(C.steel, 0.5), sw: 1.4 },
    ]} />
  );
}
/** Cam kavanoz/kap. x,y = taban ortası. liquid: sıvı rengi, lv: 0..1 */
function Jar({ x, y, w = 50, h = 56, liquid = K.water, lv = 0.7, lid = false, s = 1, children }: { x: number; y: number; w?: number; h?: number; liquid?: string | null; lv?: number; lid?: boolean; s?: number; children?: ComponentChildren }) {
  const hw = w / 2;
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[{ d: `M${-hw} ${-h + 4}Q${-hw} 0 ${-hw + 6} 0H${hw - 6}Q${hw} 0 ${hw} ${-h + 4}Z`, f: C.glass }]} />
      {liquid && <path d={`M${-hw + 1} ${f1(-h * lv)}H${hw - 1}V-6Q${hw - 1} -1 ${hw - 6} -1H${-hw + 6}Q${-hw + 1} -1 ${-hw + 1} -6Z`} fill={liquid} opacity={0.85} />}
      {children}
      <path d={`M${-hw + 6} ${-h + 10}V-10`} stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.7} />
      {lid && <OG ow={OW / s} sh={[{ d: rrect(-hw - 2, -h - 6, w + 4, 9, 2), f: '#8e99a6' }]} />}
    </g>
  );
}
/** Taş (yukarıdan/yandan basit yuvarlak taş) */
function Stone({ x, y, rx = 14, ry = 10, c = C.stone, a = 0 }: { x: number; y: number; rx?: number; ry?: number; c?: string; a?: number }) {
  return (
    <g transform={tr(x, y, 1, a)}>
      <OG sh={[{ d: ell([0, 0], rx, ry), f: c }, { d: `M${f1(-rx * 0.5)} ${f1(ry * 0.55)}Q${f1(rx * 0.4)} ${f1(ry * 0.9)} ${f1(rx * 0.85)} ${f1(ry * 0.1)}`, st: shade(c, 0.25), sw: 2 }]} />
    </g>
  );
}

/* ─────────────── bitkiler ─────────────── */
/** Isırgan: dik gövde, karşılıklı dişli yaprak çiftleri, tepede körpe açık yeşil yapraklar */
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
            <Lf x={1} y={yy} a={-160} len={L} w={L * 0.36} teeth={7} c={C.leafDk} />
            <Lf x={1} y={yy} a={-20} len={L} w={L * 0.36} teeth={7} c={C.leafDk} />
          </g>
        );
      })}
      <Lf x={0} y={-h + 6} a={-130} len={20} w={7} teeth={5} c={C.young} />
      <Lf x={0} y={-h + 6} a={-50} len={20} w={7} teeth={5} c={C.young} />
      <Lf x={0} y={-h + 4} a={-90} len={18} w={6} teeth={4} c={C.young} />
    </g>
  );
}
/** Beyaz şemsiye çiçek başı (bileşik umbel). x,y = sapın tepesi */
function Umbel({ x, y, r = 40 }: { x: number; y: number; r?: number }) {
  const rays = [-160, -138, -116, -90, -64, -42, -20];
  return (
    <g>
      {rays.map((a) => {
        const e: P = [x + Math.cos((a * Math.PI) / 180) * r, y + Math.sin((a * Math.PI) / 180) * r * 0.62];
        return <path key={a} d={line([[x, y], e])} stroke={C.leafDk} stroke-width={2} />;
      })}
      {rays.map((a) => {
        const e: P = [x + Math.cos((a * Math.PI) / 180) * r, y + Math.sin((a * Math.PI) / 180) * r * 0.62];
        return (
          <g key={'u' + a}>
            <OG sh={[{ d: ell([e[0], e[1] - 4], 10, 6), f: C.white }]} />
            {[-5, 0, 5].map((dx) => <circle key={dx} cx={e[0] + dx} cy={e[1] - 5 + Math.abs(dx) * 0.3} r={1.4} fill="#d9d4c4" />)}
          </g>
        );
      })}
    </g>
  );
}
/** İnce parçalı (havuç/maydanoz benzeri) yaprak: x,y taban, a yön */
function Fern({ x, y, a = -90, len = 50, c = C.leaf }: { x: number; y: number; a?: number; len?: number; c?: string }) {
  const n = 5;
  return (
    <g transform={tr(x, y, 1, a)}>
      <path d={`M0 0H${len}`} stroke={K.out} stroke-width={4} />
      <path d={`M0 0H${len}`} stroke={c} stroke-width={2} />
      {Array.from({ length: n }, (_, i) => {
        const t = 0.3 + i * 0.15;
        const L = 15 * (1 - i * 0.12);
        return (
          <g key={i}>
            <Lf x={len * t} y={0} a={-48} len={L} w={3} teeth={3} c={c} vein={false} />
            <Lf x={len * t} y={0} a={48} len={L} w={3} teeth={3} c={c} vein={false} />
          </g>
        );
      })}
      <Lf x={len - 2} y={0} a={0} len={12} w={3} teeth={3} c={c} vein={false} />
    </g>
  );
}
/** Mor lekeli tüysüz gövde parçası (baldıran) — dikey, x,y taban */
function SpottedStem({ x, y, h = 160, w = 16 }: { x: number; y: number; h?: number; w?: number }) {
  const spots: [number, number, number, number][] = [[-3, 0.12, 4, 6], [4, 0.24, 3, 5], [-2, 0.38, 5, 7], [3, 0.52, 3.5, 5], [-4, 0.66, 3, 4.5], [2, 0.8, 4.5, 6], [-1, 0.92, 3, 4]];
  return (
    <g>
      <OG sh={[{ d: rrect(x - w / 2, y - h, w, h, w / 2), f: '#79a86a' }, { d: rrect(x + w * 0.1, y - h + 4, w * 0.35, h - 8, 3), f: '#6a9a5c', no: true }]} />
      {spots.map(([dx, t, rx, ry], i) => (
        <ellipse key={i} cx={x + dx} cy={y - h * t} rx={rx} ry={ry} fill="#8a2f5a" />
      ))}
      <path d={`M${x - w / 2 + 3} ${y - h + 8}V${y - 8}`} stroke="#fff" stroke-width={2} opacity={0.5} stroke-linecap="round" />
    </g>
  );
}


/** Mantar: x,y taban ortası. kind 'dome' (kubbe şapka) | 'flat' */
function Mushroom({ x, y, s = 1, cap = '#f1ece0', a = 0 }: { x: number; y: number; s?: number; cap?: string; a?: number }) {
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      { d: 'M-7 0Q-9 -20 -6 -34H6Q9 -20 7 0Q0 3 -7 0Z', f: '#f3efe4' },
      { d: 'M-9 -26Q0 -22 9 -26L8 -22Q0 -18 -8 -22Z', f: '#e6e0cf' },
      { d: 'M-30 -32Q-30 -62 0 -62Q30 -62 30 -32Q0 -26 -30 -32Z', f: cap },
      { d: 'M-30 -32Q0 -26 30 -32Q0 -36 -30 -32Z', f: shade(cap, 0.12) },
    ]} />
  );
}
/** Palamut: x,y merkez, a yön */
function Acorn({ x, y, s = 1, a = 0, bad = false }: { x: number; y: number; s?: number; a?: number; bad?: boolean }) {
  const nut = bad ? '#5b4636' : '#b98a4e';
  return (
    <g>
      <Gx x={x} y={y} s={s} a={a} sh={[
        { d: 'M-9 -2Q-10 14 0 20Q10 14 9 -2Z', f: nut },
        { d: 'M-11 -2Q-11 -10 0 -10Q11 -10 11 -2Q0 2 -11 -2Z', f: '#8a6a44' },
        { d: 'M-1 -10V-14', st: K.out, sw: 2 },
        { d: 'M-6 -5H6M-8 -2H8', st: shade('#8a6a44', 0.3), sw: 1 },
      ]} />
      {bad && <circle cx={x + 2 * s} cy={y + 8 * s} r={2.2 * s} fill="#1f1a16" />}
    </g>
  );
}
/** Soyulmuş palamut içi */
function Kernel({ x, y, s = 1, a = 0, c = '#efd9a8' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return <Gx x={x} y={y} s={s} a={a} sh={[{ d: 'M-8 -6Q-10 10 0 14Q10 10 8 -6Q0 -10 -8 -6Z', f: c }, { d: 'M0 -7V12', st: shade(c, 0.25), sw: 1 }]} />;
}
/** Kapaklı tencere (kit Pot + kapak) */
function LidPot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <Pot x={x} y={y} s={s} boil={false} />
      <Gx x={x} y={y} s={s} sh={[{ d: 'M-23 -28Q0 -40 23 -28Z', f: '#7d8895' }, { d: rrect(-5, -40, 10, 5, 2), f: K.out }]} />
      <g fill="none" stroke="#fff" stroke-width={2.4 * s} stroke-linecap="round" opacity={0.9}>
        <path d={`M${x - 26 * s} ${y - 30 * s}c-4 -5 4 -8 0 -14`} />
        <path d={`M${x + 26 * s} ${y - 30 * s}c-4 -5 4 -8 0 -14`} />
      </g>
    </g>
  );
}



/** Balık (yandan, sağa bakar). x,y merkez; L≈100·s. stale: bozulmuş görünüm */
function Fish({ x, y, s = 1, a = 0, flip = false, c = C.fish, back = C.fishBack, stale = false, dead = false }: { x: number; y: number; s?: number; a?: number; flip?: boolean; c?: string; back?: string; stale?: boolean; dead?: boolean }) {
  const body = smooth([[-40, 0], [-20, -16], [10, -20], [36, -10], [48, 0], [36, 10], [10, 16], [-20, 12]], true);
  const cc = stale ? '#b9bcb6' : c, bb = stale ? '#8e928c' : back;
  return (
    <g transform={tr(x, y, s, a, flip)}>
      <OG ow={OW / s} sh={[
        { d: 'M-36 0L-58 -18L-54 0L-58 18Z', f: bb },
        { d: 'M-6 -18L6 -30L20 -18Z', f: bb },
        { d: 'M0 14L10 24L18 13Z', f: bb },
        { d: body, f: cc },
        { d: smooth([[-38, -2], [-20, -15], [10, -19], [36, -10], [44, -4], [10, -8], [-20, -6]], true), f: bb, no: true },
        { d: 'M24 -12Q18 0 24 12', st: shade(cc, 0.3), sw: 1.6 },
      ]} />
      {stale || dead ? (
        <g>
          <circle cx={34} cy={-3} r={4.6} fill="#c9ccc4" stroke={K.out} stroke-width={1.2 / s} />
          {dead && <path d="M31 -6l6 6M37 -6l-6 6" stroke={K.out} stroke-width={1.4 / s} />}
        </g>
      ) : (
        <g>
          <circle cx={34} cy={-3} r={4.6} fill="#fff" stroke={K.out} stroke-width={1.2 / s} />
          <circle cx={35} cy={-3} r={2.4} fill={K.out} />
        </g>
      )}
    </g>
  );
}
const DeadFish = ({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) => <Fish x={x} y={y} s={s} a={a + 180} flip dead c="#b9bcb6" back="#8e928c" />;

/* ─────────────── hayvanlar: böcek ─────────────── */
/** Çekirge (yandan, sağa bakar). x,y gövde ortası. parts: false ise baş/kanat/arka bacak çizilmez */
function Grasshopper({ x, y, s = 1, c = '#7fae3e', parts = true }: { x: number; y: number; s?: number; c?: string; parts?: boolean }) {
  const dk = shade(c, 0.25);
  return (
    <g transform={tr(x, y, s)}>
      {parts && <OG ow={OW / s} sh={[{ d: capsule([-4, -4], 5, [-20, -26], 4), f: dk }, { d: capsule([-20, -26], 3, [-34, 6], 2), f: dk }]} />}
      <OG ow={OW / s} sh={[
        { d: capsule([10, 4], 2, [8, 14], 1.6), f: dk },
        { d: capsule([2, 4], 2, [-2, 14], 1.6), f: dk },
        { d: smooth([[-34, 0], [-20, -6], [0, -8], [14, -6], [18, 2], [0, 8], [-20, 6]], true), f: c },
        ...(parts ? [
          { d: smooth([[-30, -4], [-10, -12], [10, -10], [6, -4], [-14, -2]], true), f: '#b9c97a' },
          { d: capsule([0, -2], 6, [-12, -18], 4.5), f: c },
          { d: capsule([-12, -18], 3, [-26, 8], 2.2), f: c },
          { d: ell([22, -2], 9, 8), f: c },
          { d: smooth([[24, -8], [34, -26], [46, -32]]), st: K.out, sw: 1.6 },
        ] : []),
      ]} />
      {parts && <circle cx={25} cy={-4} r={2.4} fill={K.out} />}
      {[-24, -16, -8].map((sx) => <path key={sx} d={`M${sx} -6v12`} stroke={dk} stroke-width={1.2} />)}
    </g>
  );
}
/** Cırcır böceği (koyu, kısa, uzun antenli) */
function Cricket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#5a4632';
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: capsule([-2, -2], 5, [-16, -20], 4), f: shade(c, 0.2) },
        { d: capsule([-16, -20], 3, [-28, 6], 2), f: shade(c, 0.2) },
        { d: capsule([8, 4], 2, [10, 13], 1.6), f: c },
        { d: smooth([[-26, 0], [-12, -9], [6, -8], [14, 0], [0, 8], [-18, 7]], true), f: c },
        { d: smooth([[-24, -3], [-8, -10], [6, -7], [-12, 0]], true), f: '#7a6248' },
        { d: ell([18, -1], 8, 7), f: c },
        { d: smooth([[22, -6], [40, -24], [56, -22]]), st: K.out, sw: 1.4 },
        { d: smooth([[22, -4], [44, -10], [58, -4]]), st: K.out, sw: 1.4 },
      ]} />
    </g>
  );
}
/** Beyaz kurtçuk (C biçimli larva) */
function Grub({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const pts: P[] = Array.from({ length: 9 }, (_, i) => { const t = Math.PI * (0.15 + i * 0.16); return [Math.cos(t) * 22, -Math.sin(t) * 18] as P; });
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        ...pts.map((p, i) => ({ d: circ(p, 9 - Math.abs(i - 4) * 0.6), f: '#f4ecd6' })),
        { d: circ([pts[8][0] - 2, pts[8][1] + 3], 7), f: '#c46a2a' },
      ]} />
      {pts.slice(1, 8).map((p, i) => <path key={i} d={`M${f1(p[0] * 0.75)} ${f1(p[1] * 0.75)}L${f1(p[0] * 1.3)} ${f1(p[1] * 1.3)}`} stroke={shade('#f4ecd6', 0.25)} stroke-width={1.2} />)}
    </g>
  );
}
/** Yer solucanı */
function Worm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const pts: P[] = [[-40, 6], [-26, -6], [-10, 4], [6, -6], [22, 4], [36, -4]];
  return (
    <g transform={tr(x, y, s)}>
      <path d={smooth(pts)} fill="none" stroke={K.out} stroke-width={13} stroke-linecap="round" />
      <path d={smooth(pts)} fill="none" stroke="#d98a86" stroke-width={10} stroke-linecap="round" />
      <path d="M-14 -1l3 6M-8 -1l3 6" stroke="#b9645e" stroke-width={1.4} />
    </g>
  );
}
/** Tüylü tırtıl */
function Caterpillar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const segs = [-30, -20, -10, 0, 10, 20];
  return (
    <g transform={tr(x, y, s)}>
      <g stroke={K.out} stroke-width={1.3}>
        {segs.map((sx) => [-60, -90, -120, -30, -150].map((a) => <path key={sx + ':' + a} d={`M${sx} -4l${f1(Math.cos((a * Math.PI) / 180) * 14)} ${f1(Math.sin((a * Math.PI) / 180) * 14)}`} />))}
      </g>
      <OG ow={OW / s} sh={[...segs.map((sx) => ({ d: circ([sx, -4], 7.5), f: '#6a5236' })), { d: circ([30, -4], 7), f: '#3a2a22' }]} />
      {segs.map((sx) => <circle key={sx} cx={sx} cy={-6} r={2} fill="#ff8a1f" />)}
    </g>
  );
}
/** Parlak kırmızı-siyah böcek (yukarıdan) */
function Beetle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={tr(x, y, s)}>
      <g stroke={K.out} stroke-width={2.4} stroke-linecap="round">
        {[-8, 0, 8].map((dy) => <path key={dy} d={`M-14 ${dy}l-10 ${dy * 0.6 - 2}M14 ${dy}l10 ${dy * 0.6 - 2}`} />)}
      </g>
      <OG ow={OW / s} sh={[{ d: ell([0, -22], 9, 7), f: '#22252c' }, { d: ell([0, 0], 18, 22), f: '#d8312b' }, { d: 'M0 -20V22', st: K.out, sw: 1.5 }]} />
      {[[-8, -8], [8, -8], [-9, 8], [9, 8], [0, 0]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={3.6} fill="#22252c" />)}
    </g>
  );
}
/** Arı (yandan) */
function Bee({ x, y, s = 1, wasp = false }: { x: number; y: number; s?: number; wasp?: boolean }) {
  const yel = wasp ? '#f2c813' : '#e0a83a';
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: ell([-4, -12], 9, 6), f: '#e8f4fb', t: 'rotate(-30 -4 -12)' },
        { d: ell([4, -13], 8, 5), f: '#e8f4fb', t: 'rotate(-60 4 -13)' },
        { d: wasp ? smooth([[-18, 0], [-10, -7], [-4, -5], [-4, 5], [-10, 7]], true) : ell([-8, 0], 10, 7.5), f: yel },
        { d: ell([4, -1], 5.5, 5), f: '#3a2f26' },
        { d: circ([12, -1], 4.5), f: '#3a2f26' },
      ]} />
      <path d={wasp ? 'M-14 -5v10M-9 -6.5v13' : 'M-12 -6v12M-6 -7v14'} stroke="#2a221c" stroke-width={2.6} />
      {wasp && <path d="M-18 0l-4 0" stroke={K.out} stroke-width={1.6} />}
    </g>
  );
}
/** Örümcek (yukarıdan) */
function Spider({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={tr(x, y, s)}>
      <g fill="none" stroke={K.out} stroke-width={2.6} stroke-linecap="round" stroke-linejoin="round">
        {[-1, 1].map((m) => [-50, -20, 15, 45].map((a) => {
          const r = (a * Math.PI) / 180;
          return <path key={m + ':' + a} d={`M0 -6L${f1(m * Math.cos(r) * 18)} ${f1(-6 + Math.sin(r) * 14 - 8)}L${f1(m * Math.cos(r) * 30)} ${f1(-6 + Math.sin(r) * 24 + 6)}`} />;
        }))}
      </g>
      <OG ow={OW / s} sh={[{ d: ell([0, 10], 11, 13), f: '#2e2a2a' }, { d: ell([0, -8], 8, 7), f: '#3e3836' }]} />
    </g>
  );
}

/* ─────────────── kıyı, yumurta, bal ─────────────── */
/** Midye (yandan). open: açık kabuk */
function Mussel({ x, y, s = 1, a = 0, open = false }: { x: number; y: number; s?: number; a?: number; open?: boolean }) {
  const c = '#2f3a5a';
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={open ? [
        { d: 'M0 0Q-6 -20 4 -38Q16 -30 14 -4Z', f: c, t: 'rotate(-28)' },
        { d: 'M0 0Q-6 -20 4 -38Q16 -30 14 -4Z', f: '#e9c88a' },
        { d: 'M3 -6Q-2 -20 5 -32Q11 -26 10 -8Z', f: '#e39a5a' },
        { d: 'M0 0Q-6 -20 4 -38Q16 -30 14 -4Z', f: c, t: 'rotate(28)' },
      ] : [
        { d: 'M0 0Q-10 -20 2 -40Q18 -32 16 -4Q8 2 0 0Z', f: c },
        { d: 'M3 -6Q0 -20 6 -32', st: tint(c, 0.4), sw: 1.4 },
      ]} />
    </g>
  );
}
/** Yumurta. x,y merkez */
function Egg({ x, y, s = 1, a = 0, c = C.egg, mark = false }: { x: number; y: number; s?: number; a?: number; c?: string; mark?: boolean }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={[{ d: 'M0 -16C9 -16 13 -4 13 3C13 11 7 16 0 16C-7 16 -13 11 -13 3C-13 -4 -9 -16 0 -16Z', f: c }, { d: 'M-6 -8Q-8 -2 -7 2', st: '#fff', sw: 2 }]} />
      {mark && <path d="M-6 -2L6 6M6 -2L-6 6" stroke="#2a2522" stroke-width={2.6} stroke-linecap="round" />}
    </g>
  );
}
/** Yuva (yukarıdan) */
function Nest({ x, y, rx = 70, ry = 46 }: { x: number; y: number; rx?: number; ry?: number }) {
  return (
    <g>
      <OG sh={[{ d: ell([x, y], rx, ry), f: '#a07a4a' }, { d: ell([x, y + 2], rx * 0.7, ry * 0.66), f: '#6e5236' }]} />
      <g stroke="#7a5a36" stroke-width={2} stroke-linecap="round">
        {Array.from({ length: 22 }, (_, i) => { const t = (i / 22) * Math.PI * 2; const p: P = [x + Math.cos(t) * rx * 0.85, y + Math.sin(t) * ry * 0.85]; return <path key={i} d={`M${f1(p[0] - 8)} ${f1(p[1] - 3)}l16 ${i % 2 ? 6 : -4}`} />; })}
      </g>
    </g>
  );
}
/** Ağaç gövdesi (kalın, kesik), kovuklu olabilir. x = orta, y = zemin */
function Trunk({ x, y, w = 70, h = 220, hollow }: { x: number; y: number; w?: number; h?: number; hollow?: number }) {
  return (
    <g>
      <OG sh={[
        { d: `M${x - w / 2} ${y}Q${x - w / 2 + 6} ${y - h / 2} ${x - w / 2 + 4} ${y - h}H${x + w / 2 - 4}Q${x + w / 2 - 6} ${y - h / 2} ${x + w / 2} ${y}Z`, f: C.bark },
        { d: `M${x + w / 6} ${y}Q${x + w / 4} ${y - h / 2} ${x + w / 5} ${y - h}H${x + w / 2 - 4}Q${x + w / 2 - 6} ${y - h / 2} ${x + w / 2} ${y}Z`, f: shade(C.bark, 0.15), no: true },
        ...(hollow ? [{ d: ell([x - 4, hollow], w * 0.2, w * 0.3), f: '#2a1d14' }] : []),
      ]} />
      <g stroke={shade(C.bark, 0.3)} stroke-width={1.5} fill="none">
        <path d={`M${x - w / 4} ${y - 20}v-40M${x - w / 6} ${y - h + 20}v30M${x + w / 8} ${y - 60}v-30`} />
      </g>
    </g>
  );
}


/* ─────────────── balık araçları ─────────────── */
/** Kanca (J biçimli tel) — x,y göz, aşağı sarkar */
function Hook({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <g transform={tr(x, y, s, a)} fill="none" stroke-linecap="round">
      <path d="M0 0V22Q0 32 -8 32Q-14 32 -14 24L-10 20" stroke={K.out} stroke-width={4.4 / s} />
      <path d="M0 0V22Q0 32 -8 32Q-14 32 -14 24L-10 20" stroke={C.steel} stroke-width={2.2 / s} />
    </g>
  );
}
/** Şamandıra (mantar tıpa) — x,y merkez */
function Bobber({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <Gx x={x} y={y} s={s} sh={[{ d: rrect(-7, -9, 14, 18, 5), f: '#c98a4e' }, { d: 'M-7 -1H7', st: shade('#c98a4e', 0.3), sw: 1 }]} />;
}
/** Kerevit (yukarıdan, başı yukarı). x,y gövde ortası */
function Crayfish({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  const c = '#7a5236';
  const dk = shade(c, 0.2);
  return (
    <g transform={tr(x, y, s, a)}>
      <g stroke={K.out} stroke-width={1.6} fill="none">
        <path d="M-4 -30Q-20 -60 -34 -70M4 -30Q20 -60 34 -70" />
        {[-8, 0, 8].map((dy) => <path key={dy} d={`M-10 ${dy - 6}l-14 ${dy * 0.4 + 4}M10 ${dy - 6}l14 ${dy * 0.4 + 4}`} stroke-width={2.6} />)}
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
/** Kurbağa (yandan, sağa bakar). toad: siğilli kahverengi karakurbağası */
function Frog({ x, y, s = 1, toad = false }: { x: number; y: number; s?: number; toad?: boolean }) {
  const c = toad ? '#8a6a46' : '#5aa04a';
  const dk = shade(c, 0.2);
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: smooth([[-30, 0], [-38, -12], [-14, -10], [-6, 0]], true), f: dk },
        { d: smooth([[-34, 0], [-30, -26], [-6, -40], [22, -34], [34, -20], [30, -8], [10, 0]], true), f: c },
        { d: smooth([[-24, -2], [-18, -22], [-4, -18], [-2, 0]], true), f: dk },
        { d: capsule([12, -8], 3.5, [16, 0], 3), f: c },
        { d: ell([20, -32], 7, 6), f: c },
        ...(toad ? [{ d: ell([4, -30], 10, 5), f: '#a8885a', t: 'rotate(-10 4 -30)' }] : []),
      ]} />
      <circle cx={21} cy={-33} r={3.2} fill={toad ? '#c8902a' : '#e8d24a'} stroke={K.out} stroke-width={1.2 / s} />
      <circle cx={21.5} cy={-33} r={1.4} fill={K.out} />
      <path d="M26 -20Q32 -18 34 -20" stroke={K.out} stroke-width={1.4 / s} fill="none" />
      {toad
        ? [[-14, -26], [-4, -32], [8, -18], [-20, -14], [0, -12], [14, -26], [-10, -6]].map(([wx, wy], i) => <circle key={i} cx={wx} cy={wy} r={2.4} fill="#6a4e32" />)
        : <path d="M-20 -26Q0 -36 20 -28" stroke={tint(c, 0.4)} stroke-width={2} fill="none" />}
    </g>
  );
}
/** Sepet (yandan, yatay silindir, ağzı solda). x,y = ağız ortası */
function Basket({ x, y, L = 150, R = 46, funnel = true, s = 1 }: { x: number; y: number; L?: number; R?: number; funnel?: boolean; s?: number }) {
  const c = '#c9a05a';
  const dk = shade(c, 0.25);
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: `M0 ${-R}H${L - 20}Q${L} ${-R} ${L} 0Q${L} ${R} ${L - 20} ${R}H0Z`, f: tint(c, 0.25) },
        { d: ell([0, 0], 12, R), f: c },
      ]} />
      <g stroke={dk} stroke-width={1.6} fill="none">
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${12 + i * ((L - 30) / 6)} ${-R}V${R}`} />)}
        {[-R * 0.5, 0, R * 0.5].map((yy) => <path key={yy} d={`M6 ${yy}H${L - 6}`} />)}
      </g>
      {funnel && (
        <g>
          <OG ow={OW / s} sh={[{ d: `M0 ${-R + 4}L${L * 0.42} -10V10L0 ${R - 4}Z`, f: c }]} />
          <g stroke={dk} stroke-width={1.4}>
            {[0.12, 0.24, 0.36].map((t) => <path key={t} d={`M${L * t} ${f1((-R + 4) * (1 - t / 0.42) - 10 * (t / 0.42))}V${f1((R - 4) * (1 - t / 0.42) + 10 * (t / 0.42))}`} />)}
          </g>
        </g>
      )}
    </g>
  );
}


/* ─────────────── memeliler ─────────────── */
/** Tavşan (yandan, sağa bakar, oturur). x,y = zemin ortası */
function Rabbit({ x, y, s = 1, flip = false, hop = false }: { x: number; y: number; s?: number; flip?: boolean; hop?: boolean }) {
  const c = C.rabbit, dk = shade(c, 0.2);
  return (
    <g transform={tr(x, y, s, hop ? -12 : 0, flip)}>
      <OG ow={OW / s} sh={[
        { d: capsule([18, -46], 4, [8, -74], 5), f: dk },
        { d: ell([-8, -20], 24, 20), f: c },
        { d: capsule([10, -8], 3.5, [16, 0], 3), f: c },
        { d: ell([-16, -4], 16, 6), f: dk },
        { d: ell([18, -38], 13, 12), f: c },
        { d: capsule([14, -46], 4.5, [2, -76], 5.5), f: c },
        { d: circ([-32, -24], 6), f: '#f4efe6' },
      ]} />
      <circle cx={23} cy={-40} r={2.2} fill={K.out} />
      <circle cx={30} cy={-34} r={1.6} fill="#c96a6a" />
    </g>
  );
}
/** Karaca (yandan, sağa bakar). x,y = zemin ortası. graze: baş aşağıda */
function Deer({ x, y, s = 1, flip = false, graze = false, run = false }: { x: number; y: number; s?: number; flip?: boolean; graze?: boolean; run?: boolean }) {
  const c = C.deer, dk = shade(c, 0.2);
  // boyun ucu, başın arkası, burun ucu, kulak ucu, göz
  const nk: P = graze ? [62, -36] : [48, -100];
  const hb: P = graze ? [64, -30] : [46, -104];
  const mz: P = graze ? [80, -8] : [70, -94];
  const ear: P = graze ? [52, -50] : [36, -124];
  const eye: P = graze ? [68, -23] : [54, -103];
  const legs: [P, P][] = run
    ? [[[-26, -60], [-56, -30]], [[-20, -60], [-40, -24]], [[26, -60], [60, -44]], [[32, -60], [52, -32]]]
    : [[[-28, -60], [-30, 0]], [[-20, -60], [-18, 0]], [[24, -60], [26, 0]], [[32, -60], [36, 0]]];
  return (
    <g transform={tr(x, y, s, 0, flip)}>
      <OG ow={OW / s} sh={[
        ...legs.slice(0, 2).map(([a, b], i) => ({ d: capsule(a, i ? 5 : 6, b, 2.6), f: i % 2 ? c : dk })),
        ...legs.slice(2).map(([a, b], i) => ({ d: capsule(a, i ? 5 : 6, b, 2.6), f: i % 2 ? c : dk })),
        { d: ell([-46, -72], 4, 6), f: '#f4efe6' },
        { d: smooth([[-44, -74], [-20, -86], [20, -84], [44, -78], [46, -60], [20, -54], [-20, -54], [-44, -60]], true), f: c },
        { d: capsule([32, -74], 11, nk, 7), f: c },
        { d: capsule([hb[0] - 2, hb[1]], 3, ear, 5), f: dk },
        { d: capsule(hb, 9, mz, 4.5), f: c },
      ]} />
      <circle cx={eye[0]} cy={eye[1]} r={2.2} fill={K.out} />
      <circle cx={mz[0]} cy={mz[1]} r={2.2} fill={K.out} />
    </g>
  );
}
/** Yaban domuzu silueti (yandan, sağa bakar) */
function Boar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = C.boar;
  return (
    <Gx x={x} y={y} s={s} sh={[
      { d: capsule([-24, -20], 5, [-26, 0], 3.5), f: shade(c, 0.2) },
      { d: capsule([20, -20], 5, [22, 0], 3.5), f: shade(c, 0.2) },
      { d: capsule([-14, -20], 5, [-12, 0], 3.5), f: c },
      { d: capsule([28, -20], 5, [32, 0], 3.5), f: c },
      { d: smooth([[-40, -26], [-24, -48], [10, -52], [34, -44], [56, -26], [52, -16], [20, -14], [-30, -14]], true), f: c },
      { d: 'M48 -24L60 -22L58 -16L50 -16Z', f: '#7a6458' },
      { d: 'M30 -46L36 -58L40 -44Z', f: c },
    ]} />
  );
}
/** Ayak izi parçaları (yukarıdan çamurda): içi koyu çukur */
const PIT = '#5a4532';
function Pad({ x, y, rx, ry, a = 0 }: { x: number; y: number; rx: number; ry: number; a?: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${a} ${x} ${y})`} fill={PIT} stroke={shade(PIT, 0.3)} stroke-width={1} />;
}
/** Köpekgil izi (4 parmak + taban + tırnak). x,y = taban; s ölçek; yön yukarı */
function CanidTrack({ x, y, s = 1, narrow = 1 }: { x: number; y: number; s?: number; narrow?: number }) {
  const toes: P[] = [[-12 * narrow, -16], [-4 * narrow, -24], [4 * narrow, -24], [12 * narrow, -16]];
  return (
    <g transform={tr(x, y, s)}>
      <path d="M-9 0Q-10 -9 0 -10Q10 -9 9 0Q8 6 0 6Q-8 6 -9 0Z" fill={PIT} />
      {toes.map(([tx, ty], i) => (
        <g key={i}>
          <ellipse cx={tx} cy={ty} rx={3.6} ry={4.6} fill={PIT} />
          <path d={`M${tx} ${ty - 6}l${(tx / 12) * 1.5} -4`} stroke={PIT} stroke-width={2} stroke-linecap="round" />
        </g>
      ))}
    </g>
  );
}


/* ─────────────── avı işleme ─────────────── */
/** Karaciğer (yakın plan). spots: hastalık lekeleri; cysts: sıvı dolu keseler; gall: safra kesesi */
function Liver({ x, y, s = 1, spots = false, cysts = false, gall = false }: { x: number; y: number; s?: number; spots?: boolean; cysts?: boolean; gall?: boolean }) {
  const c = C.liver;
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: smooth([[-54, -8], [-30, -30], [10, -30], [50, -20], [56, 0], [30, 22], [-10, 26], [-46, 16]], true), f: c },
        { d: 'M-2 -28Q4 0 -6 24', st: shade(c, 0.35), sw: 1.6 },
        ...(gall ? [{ d: smooth([[10, 10], [24, 4], [34, 16], [28, 34], [14, 32]], true), f: C.bile }] : []),
      ]} />
      <path d="M-40 -14Q-30 -24 -16 -24" stroke="#fff" stroke-width={3} opacity={0.45} fill="none" stroke-linecap="round" />
      {spots && [[-36, -2], [-24, 10], [-14, -12], [6, -16], [18, 4], [30, -8], [-4, 6], [40, 4], [-30, -16], [10, 14]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={2.6} fill="#f3e3b0" />)}
      {cysts && [[-28, -4, 9], [12, -10, 11], [30, 8, 7]].map(([sx, sy, r], i) => <circle key={i} cx={sx} cy={sy} r={r} fill="#e8eef0" stroke={K.out} stroke-width={1.3 / s} />)}
    </g>
  );
}
/** Kuş (yandan). plucked: yolunmuş; hang: ayaklarından baş aşağı */
function Bird({ x, y, s = 1, plucked = false, a = 0, legs = true }: { x: number; y: number; s?: number; plucked?: boolean; a?: number; legs?: boolean }) {
  const c = plucked ? '#f1d2b4' : '#8a6a4a';
  const dk = shade(c, 0.18);
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      ...(legs ? [{ d: capsule([-4, 22], 2.4, [-8, 40], 2), f: '#e0a040' }, { d: capsule([6, 22], 2.4, [8, 40], 2), f: '#e0a040' }] : []),
      { d: smooth([[-34, -4], [-20, -22], [10, -24], [30, -10], [30, 10], [10, 26], [-20, 22]], true), f: c },
      ...(plucked ? [] : [{ d: smooth([[-24, -10], [0, -16], [22, -4], [6, 10], [-18, 8]], true), f: dk }, { d: 'M-34 -4L-48 -12L-44 4Z', f: dk }]),
      { d: capsule([26, -6], 7, [40, -24], 6), f: c },
      { d: circ([42, -28], 9), f: plucked ? c : '#5a4a3a' },
      { d: 'M50 -30L60 -26L50 -24Z', f: '#e0a040' },
    ]} />
  );
}
/** Termometre (iç sıcaklık ölçer). x,y uç noktası */
function Thermo({ x, y, s = 1, a = -30, text }: { x: number; y: number; s?: number; a?: number; text?: string }) {
  return (
    <g>
      <Gx x={x} y={y} s={s} a={a} sh={[{ d: capsule([0, 0], 2, [0, -60], 2.5), f: C.steel }, { d: circ([0, -76], 16), f: '#f4f6f8' }, { d: 'M0 -76L8 -84', st: K.danger, sw: 2.4 }]} />
      {text && <Label x={x + Math.sin((a * Math.PI) / 180) * 76 * s + 44} y={y - Math.cos((a * Math.PI) / 180) * 76 * s} text={text} />}
    </g>
  );
}
/** Koyun (yan yatmış, şişmiş leş) */
function DeadSheep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // yan yatmış: sırtı aşağıda-solda, karnı sağ üstte; kaskatı bacaklar karından dışarı uzanır; baş solda yerde
  const wool = smooth(Array.from({ length: 26 }, (_, i) => {
    const t = (i / 26) * Math.PI * 2;
    const r = i % 2 ? 1 : 1.08;
    return [Math.cos(t) * 58 * r, -34 + Math.sin(t) * 32 * r] as P;
  }), true);
  const leg = '#3e3632';
  return (
    <g>
      <Gx x={x} y={y} s={s} sh={[
        { d: capsule([10, -58], 5, [44, -98], 4), f: leg },
        { d: capsule([28, -54], 5, [70, -86], 4), f: leg },
        { d: capsule([-14, -60], 5, [-4, -104], 4), f: leg },
        { d: capsule([-30, -56], 5, [-30, -100], 4), f: leg },
        { d: wool, f: '#ece6d8' },
        { d: smooth([[-50, -20], [-78, -26], [-104, -14], [-104, 0], [-74, 2], [-52, -6]], true), f: '#3e3632' },
        { d: smooth([[-64, -22], [-60, -36], [-52, -32], [-56, -20]], true), f: '#3e3632' },
        { d: 'M-90 -14l6 6M-84 -14l-6 6', st: '#e9e3d6', sw: 1.6 },
      ]} />
      <OG sh={[{ d: ell([x - 106 * s, y - 2], 12 * s, 3.5 * s), f: '#6a1414' }]} />
      <path d={`M${f1(x - 104 * s)} ${f1(y - 8 * s)}q-3 4 -2 8`} stroke="#6a1414" stroke-width={3 * s} fill="none" stroke-linecap="round" />
    </g>
  );
}

/** 4 tetikli düşen taş (tetik-dort sahnesiyle aynı geometri). x,y = taşın yere değen ucu; s ölçek */
function Fig4Trap({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${f1(x - 24 * s)} ${f1(y - 222 * s)}) scale(${s})`}>
      <OG ow={OW / s} sh={[
        { d: rrect(194, 116, 12, 108, 3), f: C.wood },
        { d: capsule([160, 158], 5.5, [252, 158], 5.5), f: '#b98a52' },
        { d: capsule([238, 82], 6, [164, 154], 6), f: '#c9965e' },
      ]} />
      <OG ow={OW / s} sh={[{ d: ell([240, 158], 10, 8), f: '#c9736a' }]} />
      <OG ow={OW / s} sh={[{ d: 'M24 222L248 75L238 59L12 206Z', f: '#9a958c' }, { d: 'M24 222L248 75L244 69L20 216Z', f: '#86817a', no: true }]} />
    </g>
  );
}

/* ═══════════════════════ SAHNELER ═══════════════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ───────── Yabani otlar ───────── */
  // Isırgan: eldivenli el tepedeki körpe yaprakları koparıyor; ok tepeyi gösteriyor
  'sf-yb-isirgan-toplama': () => {
    const top: P = [124, 50];
    const h0 = { x: 0, y: 0, a: -62, s: 0.95, pose: 'pinch' as const, side: 'L' as const };
    const q = handPoint(h0, 'pinch');
    const hp = { ...h0, x: top[0] - q[0], y: top[1] - q[1] };
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <Soil y={214} />
        <Nettle x={124} y={214} h={162} />
        <Hand {...hp} arm={200} sleeve={HT.sleeve} skin={1} />
        <Glove>
          <Hand {...hp} arm={16} skin={1} />
        </Glove>
        <Arrow from={[60, 30]} to={[104, 50]} bend={-0.2} />
        <Pot x={262} y={222} s={1.3} />
        <Label x={262} y={150} text="2 dk" />
      </Scene2>
    );
  },
  // Ebegümeci: yuvarlak dalgalı yapraklar, pembe-mor çizgili çiçek; şematik tanıtım
  'sf-yb-ebegumeci': () => {
    const leaf = (x: number, y: number, r: number, a = 0) => (
      <g transform={tr(x, y, 1, a)} key={x + '-' + y}>
        <OG sh={[
          { d: smooth(Array.from({ length: 22 }, (_, i) => { const t = (i / 22) * Math.PI * 2; const rr = r * (i % 2 ? 0.93 : 1) * (Math.abs(Math.sin(t / 2)) < 0.12 ? 0.7 : 1); return [Math.cos(t) * rr, Math.sin(t) * rr * 0.92] as P; }), true), f: C.leaf },
          ...[0, 50, 100, 150, 200, 250, 300].map((d) => ({ d: `M0 ${f1(r * 0.55)}L${f1(Math.cos((d * Math.PI) / 180) * r * 0.8)} ${f1(Math.sin((d * Math.PI) / 180) * r * 0.75)}`, st: shade(C.leaf, 0.3), sw: 1.2 })),
        ]} />
      </g>
    );
    const flower = (x: number, y: number, r: number) => (
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={tr(x, y, 1, a - 90)}>
            <OG sh={[{ d: smooth([[0, 0], [r * 0.6, -r * 0.42], [r, -r * 0.3], [r * 1.05, 0], [r, r * 0.3], [r * 0.6, r * 0.42]], true), f: '#d58bd0' }, { d: `M3 0L${f1(r * 0.9)} 0M3 -2L${f1(r * 0.8)} -${f1(r * 0.2)}M3 2L${f1(r * 0.8)} ${f1(r * 0.2)}`, st: '#8a3a8a', sw: 1.3 }]} />
          </g>
        ))}
        <circle cx={x} cy={y} r={r * 0.18} fill="#f2e7c8" stroke={K.out} stroke-width={1.2} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Soil y={200} />
        <Stem pts={[[150, 206], [110, 150], [80, 110]]} w={3} c={C.leafDk} />
        <Stem pts={[[150, 206], [190, 150], [230, 120]]} w={3} c={C.leafDk} />
        <Stem pts={[[150, 206], [152, 130], [160, 80]]} w={3} c={C.leafDk} />
        {leaf(78, 104, 34, 0)}
        {leaf(232, 112, 34, 10)}
        {leaf(150, 150, 26, -10)}
        {flower(166, 70, 30)}
        {flower(110, 176, 18)}
        <Ok x={276} y={40} r={16} />
      </Scene2>
    );
  },
  // Semizotu / sütleğen: koparılan sap. Solda süt yok (onay), sağda beyaz süt damlıyor (yasak).
  'sf-yb-semizotu-sutlegen': () => {
    const fleshy = (x: number, y: number) => (
      <g>
        <Stem pts={[[x - 40, y + 30], [x - 10, y + 10], [x + 6, y - 20]]} w={9} c="#b5524a" />
        {[[x - 26, y + 20, -70], [x - 6, y + 2, -20], [x + 4, y - 14, -100]].map(([lx, ly, la], i) => (
          <Lf key={i} x={lx} y={ly} a={la} len={22} w={8} c="#6aa34f" shape={1} vein={false} />
        ))}
        <OG sh={[{ d: ell([x + 7, y - 22], 6, 4), f: '#9cc36a' }]} />
      </g>
    );
    const thin = (x: number, y: number) => (
      <g>
        <Stem pts={[[x - 40, y + 30], [x - 10, y + 10], [x + 6, y - 20]]} w={5} c="#9a8a5a" />
        {[[x - 26, y + 20, -70], [x - 6, y + 2, -20], [x + 4, y - 14, -100]].map(([lx, ly, la], i) => (
          <Lf key={i} x={lx} y={ly} a={la} len={16} w={5} c="#7d9a5a" vein={false} />
        ))}
        <OG sh={[{ d: ell([x + 7, y - 22], 5, 3.5), f: C.white }]} />
        <OG sh={[{ d: 'M0 0C-5 8 -7 13 -7 17A7 7 0 0 0 7 17C7 13 5 8 0 0Z', f: C.white, t: `translate(${x + 8} ${y - 18})` }]} />
        <OG sh={[{ d: 'M0 0C-4 6 -5 10 -5 13A5 5 0 0 0 5 13C5 10 4 6 0 0Z', f: C.white, t: `translate(${x + 9} ${y + 14})` }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Panels />
        <g transform="translate(86 128) scale(1.7) translate(-86 -128)">{fleshy(86, 132)}</g>
        <g transform="translate(236 128) scale(1.7) translate(-236 -128)">{thin(236, 132)}</g>
        <Ok x={40} y={42} r={16} />
        <No x={236} y={128} r={62} />
      </Scene2>
    );
  },

  /* ───────── Zehirli benzerler ───────── */
  // Şemsiye çiçekli bitki: büyük kırmızı yasak; el durduruluyor
  'sf-yb-semsiye-yasak': () => (
    <Scene2 bg="closeup">
      <Soil y={214} />
      <Stem pts={[[150, 216], [152, 140], [148, 70]]} w={5} c="#6f9a5c" />
      <Fern x={151} y={180} a={-150} len={58} />
      <Fern x={151} y={160} a={-30} len={58} />
      <Fern x={150} y={120} a={-145} len={44} />
      <Fern x={150} y={110} a={-35} len={44} />
      <Umbel x={148} y={70} r={46} />
      <Hand x={292} y={150} a={-100} s={0.8} pose="open" side="R" arm={60} sleeve={HT.sleeve} skin={1} />
      <No x={150} y={112} r={92} />
      <Bad x={250} y={98} r={14} />
    </Scene2>
  ),
  // Baldıran gövdesi: tüysüz, mor lekeli; boy ölçeği için yetişkin silueti; uyarı
  'sf-yb-baldiran-govde': () => (
    <Scene2 bg="outdoor" gy={210}>
      <SpottedStem x={150} y={222} h={150} w={18} />
      <Fern x={150} y={120} a={-150} len={50} />
      <Fern x={150} y={104} a={-30} len={50} />
      <Stem pts={[[150, 74], [150, 54]]} w={4} c="#79a86a" />
      <Umbel x={150} y={54} r={36} />
      <Person {...CAST.toplayici} x={252} y={226} s={1.0} pose={{ ...POSE.stand, face: 'worried' }} />
      <Arrow from={[84, 150]} to={[136, 160]} />
      <g transform="translate(52 82)">
        <path d="M0 -22L22 18H-22Z" fill={K.danger} stroke={K.out} stroke-width={2} stroke-linejoin="round" />
        <path d="M0 -8V6" stroke="#fff" stroke-width={4} stroke-linecap="round" />
        <circle cx={0} cy={12} r={2.4} fill="#fff" />
      </g>
    </Scene2>
  ),
  // Acı çiğdem / yabani soğan: solda ezilen yaprak koklanıyor (koku = onay); sağda kokusuz çiğdem, yasak
  'sf-yb-cigdem-sogan': () => {
    const colchicum = (x: number, y: number) => (
      <g>
        <OG sh={[{ d: ell([x, y + 6], 16, 12), f: '#c9a77a' }, { d: `M${x - 4} ${y - 4}Q${x} ${y + 4} ${x + 4} ${y - 4}`, st: shade('#c9a77a', 0.3), sw: 1.2 }]} />
        <Lf x={x - 4} y={y - 4} a={-112} len={92} w={13} c={C.leaf} shape={0.7} />
        <Lf x={x + 4} y={y - 4} a={-70} len={86} w={12} c={C.leafDk} shape={0.7} />
        <Lf x={x} y={y - 4} a={-92} len={100} w={12} c={C.leaf} shape={0.7} />
      </g>
    );
    // sol: kadın (yandan, büst) ezdiği ince yaprağı kendi eliyle burnuna götürüyor
    const base: PersonProps = { ...CAST.toplayici, x: 58, y: 84, ax: 'head', ay: 'head', s: 2.0, shadow: false, pose: { ...POSE.standSide, head: -84, face: 'neutral' } };
    const r0 = rig(base);
    const nose: P = [r0.mouth[0] + 22, r0.mouth[1] + 12];
    const smell: PersonProps = { ...base, pose: { ...base.pose, armF: { to: nose, bend: 1 }, handF: { shape: 'fist', a: -80 } } };
    const rr = rig(smell);
    const hf = rr.handF;
    return (
      <Scene2 bg="closeup">
        <Panels />
        <defs><clipPath id="sfyb-cig-l"><rect x={10} y={10} width={145} height={220} rx={12} /></clipPath></defs>
        <g clip-path="url(#sfyb-cig-l)">
          <Person {...smell} only={['legB', 'legF', 'torso', 'head']} />
          <Lf x={hf[0] - 2} y={hf[1] + 2} a={-58} len={50} w={6} shape={0.6} c={C.leaf} vein={false} />
          <Person {...smell} only={['armF']} />
        </g>
        <Waves x={hf[0] - 6} y={hf[1] - 14} a={-150} n={2} r={6} color={K.safe} />
        <Ok x={130} y={40} r={15} />
        {/* sağ: kokusuz, geniş yapraklı soğanlı bitki */}
        <rect x={166} y={190} width={138} height={39} rx={10} fill={C.soil} />
        {colchicum(236, 188)}
        <No x={236} y={128} r={60} />
      </Scene2>
    );
  },
  /* ───────── Yenebilirlik testi ───────── */
  // Testin işe yaramadığı bitkiler: dört kutuda örnek işaret, hepsi kırmızı çarpılı
  'sf-yb-test-yasak-isaretler': () => {
    const box = (x: number, y: number, kid: JSX.Element) => (
      <g>
        <rect x={x} y={y} width={140} height={100} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        {kid}
        <Bad x={x + 124} y={y + 16} r={11} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {box(14, 14, (
          <g>
            <Stem pts={[[40, 96], [70, 70], [92, 46]]} w={6} c="#9a8a5a" />
            <OG sh={[{ d: ell([94, 44], 5, 4), f: C.white }, { d: 'M0 0C-5 8 -7 13 -7 17A7 7 0 0 0 7 17C7 13 5 8 0 0Z', f: C.white, t: 'translate(96 50)' }]} />
          </g>
        ))}
        {box(166, 14, (
          <g>
            <Stem pts={[[236, 108], [236, 70]]} w={4} c="#6f9a5c" />
            <g transform="translate(236 70) scale(0.7) translate(-236 -70)"><Umbel x={236} y={70} r={46} /></g>
          </g>
        ))}
        {box(14, 126, <Mushroom x={84} y={218} s={1.15} cap="#efe9dc" />)}
        {box(166, 126, (
          <g>
            <Stem pts={[[236, 222], [236, 186]]} w={3} />
            <Lf x={236} y={186} a={-150} len={40} w={13} c={C.leaf} />
            <Lf x={236} y={186} a={-30} len={40} w={13} c={C.leaf} />
            <Lf x={236} y={186} a={-90} len={44} w={14} c={C.leafDk} />
          </g>
        ))}
      </Scene2>
    );
  },
  // Deri testi: ezilmiş yaprak bileğin iç yüzünde, 15 dk
  'sf-yb-test-deri': () => (
    <Scene2 bg="closeup">
      <Hand x={130} y={150} a={-90} s={1.25} pose="open" side="L" view="palm" arm={260} skin={1} />
      <OG sh={[{ d: rrect(256, 128, 80, 46, 8), f: HT.sleeve }]} />
      <OG sh={[{ d: smooth([[150, 138], [174, 132], [198, 140], [194, 160], [168, 166], [148, 158]], true), f: '#4f9a45' }, { d: 'M156 148Q174 144 190 150', st: '#2f6e32', sw: 1.4 }]} />
      <Arrow from={[178, 70]} to={[175, 126]} />
      <Timer x={238} y={52} r={18} text="15 dk" />
    </Scene2>
  ),
  // Dudak testi: pişmiş küçük parça dudağın dışına değdiriliyor, 3 dk
  'sf-yb-test-dudak': () => {
    const base: PersonProps = { ...CAST.toplayici, x: 120, y: 80, ax: 'head', ay: 'head', s: 2.4, shadow: false, pose: { ...POSE.standSide, head: -86, face: 'neutral' } };
    const r0 = rig(base);
    const lip: P = [r0.mouth[0] + 7, r0.mouth[1] + 1];
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [lip[0] + 22, lip[1] + 8], bend: 1 }, handF: { shape: 'fist', a: -90 } } };
    const hf = rig(p).handF;
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['legB', 'legF', 'torso', 'head']} />
        <OG sh={[{ d: ell([lip[0] + 6, lip[1]], 9, 6), f: '#5aa83e' }]} />
        <Person {...p} only={['armF']} />
        <Timer x={240} y={52} r={18} text="3 dk" />
      </Scene2>
    );
  },

  /* ───────── Yabani meyve ───────── */
  // Kuşburnu: ikiye açılmış meyvenin tohum ve tüyleri bıçak ucuyla kazınıyor; temiz kabuk onaylı
  'sf-yb-kusburnu-ayiklama': () => {
    const half = (x: number, y: number, full: boolean, s = 1) => (
      <g transform={tr(x, y, s)}>
        <OG ow={OW / s} sh={[
          { d: ell([0, 0], 30, 42), f: '#d8432e' },
          { d: ell([0, 2], 22, 33), f: full ? '#f2c45a' : '#f39a62' },
          { d: 'M-6 -42L0 -52L6 -42', f: '#5a3a2a' },
        ]} />
        {full && (
          <g>
            {[[-8, -14], [6, -16], [-10, 4], [8, 2], [-2, -4], [0, 16], [-8, 20], [9, 18]].map(([sx, sy], i) => (
              <ellipse key={i} cx={sx} cy={sy} rx={4} ry={5.5} fill="#f6e7b8" stroke={K.out} stroke-width={1} />
            ))}
            <g stroke="#fff" stroke-width={1} opacity={0.9}>
              {[-14, -8, -2, 4, 10, 14].map((sx) => <path key={sx} d={`M${sx} -24l3 -5M${sx} 26l-3 5`} />)}
            </g>
          </g>
        )}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {half(96, 128, true, 1.4)}
        <Arrow from={[150, 196]} to={[200, 206]} bend={0.2} />
        <g>
          {[[226, 206], [240, 212], [232, 198], [248, 204], [222, 214]].map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={4} ry={5.5} fill="#f6e7b8" stroke={K.out} stroke-width={1} />)}
          <Bad x={262} y={190} r={10} />
        </g>
        {half(250, 104, false, 0.95)}
        <Ok x={280} y={52} r={13} />
      </Scene2>
    );
  },
  // Kestane ayrımı: sık ince dikenli kabuk + üç kestane (onay) | seyrek kalın çıkıntılı kabuk + tek yuvarlak at kestanesi (yasak)
  'sf-yb-kestane-ayrim': () => {
    const spiky = (x: number, y: number) => (
      <g>
        <g stroke={K.out} stroke-width={1.3}>
          {Array.from({ length: 40 }, (_, i) => {
            const t = (i / 40) * Math.PI * 2;
            return <path key={i} d={line([[x + Math.cos(t) * 40, y + Math.sin(t) * 34], [x + Math.cos(t) * 54, y + Math.sin(t) * 47]])} stroke="#9bb04a" stroke-width={2} />;
          })}
        </g>
        <OG sh={[{ d: ell([x, y], 42, 36), f: '#a9bf55' }, { d: ell([x, y + 2], 32, 26), f: '#f0e3c0' }]} />
        {[-17, 0, 17].map((dx) => (
          <Gx key={dx} x={x + dx} y={y + 4} sh={[{ d: 'M-10 10Q-12 -8 0 -16Q12 -8 10 10Z', f: '#7a4a2a' }, { d: 'M-10 10H10', st: '#d8c79a', sw: 3 }, { d: 'M0 -16l-2 -5M0 -16l2 -5M0 -16v-6', st: '#d8c79a', sw: 1.4 }]} />
        ))}
      </g>
    );
    const knobby = (x: number, y: number) => (
      <g>
        <OG sh={[
          ...Array.from({ length: 9 }, (_, i) => { const t = (i / 9) * Math.PI * 2; return { d: ell([x + Math.cos(t) * 40, y + Math.sin(t) * 34], 5, 5), f: '#a9bf55' }; }),
          { d: ell([x, y], 42, 36), f: '#a9bf55' },
          { d: ell([x, y + 2], 32, 26), f: '#f0e3c0' },
          { d: ell([x, y + 2], 22, 21), f: '#7a3a1e' },
          { d: ell([x - 6, y - 4], 7, 5), f: '#a35a32', no: true },
          { d: ell([x + 4, y + 12], 12, 6), f: '#cdb48a' },
        ]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Panels />
        {spiky(84, 124)}
        {knobby(236, 124)}
        <Ok x={40} y={40} r={15} />
        <No x={236} y={124} r={70} />
      </Scene2>
    );
  },
  // Porsuk: koyu iğne yapraklı dal, kırmızı kadeh biçimli meyveler; uzanan el, büyük yasak
  'sf-yb-porsuk-yasak': () => {
    const twig: P[] = [[20, 70], [100, 92], [190, 108], [300, 120]];
    const needles: JSX.Element[] = [];
    for (let i = 0; i < 26; i++) {
      const t = i / 26;
      const x = 24 + t * 270, y = 72 + t * 48 - Math.sin(t * 3) * 6;
      needles.push(<Lf key={'a' + i} x={x} y={y} a={-70 + (i % 2) * 8} len={26} w={3} c="#2f6a3e" vein={false} />);
      needles.push(<Lf key={'b' + i} x={x} y={y} a={110 - (i % 2) * 8} len={24} w={3} c="#245a34" vein={false} />);
    }
    const aril = (x: number, y: number) => (
      <g key={x}>
        <Stem pts={[[x, y - 30], [x, y - 12]]} w={2} c="#5a3a2a" />
        <OG sh={[{ d: 'M-11 -6Q-12 -14 0 -14Q12 -14 11 -6Q12 8 0 10Q-12 8 -11 -6Z', f: '#e0322e', t: `translate(${x} ${y})` }, { d: ell([x, y + 6], 5, 4), f: '#3a2a22' }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {needles}
        <Stem pts={twig} w={5} c="#6a4a32" />
        {aril(110, 128)}
        {aril(150, 140)}
        {aril(200, 146)}
        <Hand x={150} y={226} a={-10} s={0.8} pose="open" side="R" arm={80} sleeve={HT.sleeve} skin={1} />
        <No x={158} y={136} r={62} />
      </Scene2>
    );
  },

  /* ───────── Palamut ───────── */
  // Palamut kırma: taşla kırılıyor; temiz içler | kararmış, delikli olanlar çarpılı
  'sf-yb-palamut-soyma': () => {
    const hs = { x: 196, y: 210, a: -20, s: 1.05, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g = handPoint(hs, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: smooth([[30, 150], [110, 132], [230, 136], [292, 156], [280, 214], [160, 226], [40, 212]], true), f: '#a7a59c' }]} />
        <Acorn x={150} y={150} s={1.4} a={80} />
        <Hand {...hs} arm={120} sleeve={HT.sleeve} skin={1}>
          <Stone x={g[0]} y={g[1]} rx={20} ry={14} c="#8f8c85" />
        </Hand>
        <Waves x={150} y={124} a={-90} n={2} r={7} color={K.action} />
        {[[64, 176, 20], [86, 192, -30], [58, 200, 60]].map(([kx, ky, ka], i) => <Kernel key={i} x={kx} y={ky} a={ka} s={1.2} />)}
        <Ok x={74} y={150} r={11} />
        {[[240, 192, 20], [264, 182, -30], [258, 206, 70]].map(([kx, ky, ka], i) => (
          <g key={i}>
            <Kernel x={kx} y={ky} a={ka} s={1.2} c="#7a5a3a" />
            <circle cx={kx - 2} cy={ky + 1} r={2.6} fill="#2a2018" />
            <circle cx={kx + 3} cy={ky - 4} r={1.8} fill="#2a2018" />
          </g>
        ))}
        <Bad x={262} y={156} r={11} />
      </Scene2>
    );
  },
  // Sıcak yöntem: kaynayan suda, kapağı kapalı tencerede palamut 20 dk kaynar
  'sf-yb-palamut-kaynatma': () => (
    <Scene2 bg="outdoor" ground="dirt" gy={196}>
      <Campfire x={160} y={228} s={1.9} />
      <LidPot x={160} y={196} s={2.3} />
      <Timer x={214} y={56} r={20} text="20 dk" />
    </Scene2>
  ),
  // Acılık gidene kadar: koyu kahve → açık kahve → berrak su; sonra tadına bakılır
  'sf-yb-palamut-tat': () => (
    <Scene2 bg="closeup">
      <Jar x={60} y={200} w={64} h={82} liquid="#6b4426" lv={0.75} />
      <Jar x={160} y={200} w={64} h={82} liquid="#b98a52" lv={0.75} />
      <Jar x={260} y={200} w={64} h={82} liquid="#bfe2f2" lv={0.75} />
      <Arrow from={[96, 160]} to={[124, 160]} w={5} />
      <Arrow from={[196, 160]} to={[224, 160]} w={5} />
      {[[50, 186], [66, 182], [150, 186], [168, 184], [252, 186], [268, 182]].map(([kx, ky], i) => <Kernel key={i} x={kx} y={ky} s={0.8} a={i * 40} />)}
      <Ok x={260} y={86} r={16} />
    </Scene2>
  ),

  /* ───────── Kök ve yumru ───────── */
  // Su kamışı: kesitte çamurun altındaki yatay beyaz kök; kişi çekip çıkarıyor
  'sf-yb-sukamisi-kok': () => {
    const mudY = 186;
    const cat = (x: number, h: number) => (
      <g key={x}>
        <Stem pts={[[x, mudY], [x + 2, mudY - h]]} w={3} c="#6f9a4a" />
        <OG sh={[{ d: rrect(x - 5, mudY - h * 0.8, 10, 30, 5), f: '#7a4a2a' }]} />
        <Lf x={x} y={mudY} a={-96} len={h * 0.9} w={4} c={C.leaf} vein={false} />
        <Lf x={x} y={mudY} a={-80} len={h * 0.75} w={4} c={C.leafDk} vein={false} />
      </g>
    );
    const grip: P = [176, 200];
    return (
      <Scene2 bg="outdoor" gy={mudY}>
        <Water x={-10} y={mudY - 6} w={110} h={20} />
        <rect x={0} y={mudY} width={320} height={60} fill={C.mud} />
        <path d={`M0 ${mudY}H320`} stroke={K.out} stroke-width={1.5} />
        {cat(60, 110)}
        {cat(96, 124)}
        {cat(140, 100)}
        <OG sh={[{ d: capsule([40, 214], 7, [210, 206], 6), f: '#f1ead6' }, ...[70, 110, 150, 186].map((x) => ({ d: `M${x} 210l-4 9M${x + 4} 210l3 9`, st: '#d8cfb6', sw: 1.4 }))]} />
        <Person {...CAST.toplayici} x={232} y={214} flip pose={{ ...POSE.kneelOne, spine: -45, chest: -25, head: -20, armF: { to: grip }, armB: { to: [grip[0] + 10, grip[1] + 4] }, face: 'neutral' }} />
        <Arrow from={[120, 236]} to={[120, 222]} w={5} />
      </Scene2>
    );
  },

  /* ───────── Mantar ───────── */
  // Yabani mantar: el uzanıyor, büyük yasak
  'sf-yb-mantar-yasak': () => (
    <Scene2 bg="outdoor" gy={186}>
      <Tree x={40} y={190} kind="pine" s={1.1} />
      <Tree x={292} y={192} kind="pine" s={0.9} />
      <OG sh={[{ d: 'M0 186H320V240H0Z', f: '#6f8a4a' }]} />
      <Mushroom x={130} y={214} s={1.3} cap="#f1ece0" />
      <Mushroom x={176} y={206} s={0.9} cap="#a8774a" />
      <Mushroom x={96} y={204} s={0.7} cap="#c99a62" />
      <Hand x={250} y={170} a={-118} s={0.85} pose="open" side="R" arm={120} sleeve={HT.sleeve} skin={1} />
      <No x={140} y={170} r={62} />
    </Scene2>
  ),
  // Halk testleri geçersiz: gümüş kaşık, salyangoz, kaynatma — hepsi çarpılı
  'sf-yb-mantar-halk-testi': () => {
    const box = (x: number, kid: JSX.Element) => (
      <g>
        <rect x={x} y={40} width={92} height={150} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        {kid}
        <Bad x={x + 46} y={40} r={14} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {box(12, (
          <g>
            <Pot x={58} y={176} s={1.2} boil={false} />
            <Gx x={66} y={140} a={-60} sh={[{ d: capsule([0, 0], 2.5, [50, 0], 2.5), f: '#d6dbe0' }, { d: ell([-8, 0], 9, 6), f: '#d6dbe0' }]} />
          </g>
        ))}
        {box(114, (
          <g>
            <Mushroom x={160} y={184} s={1} cap="#e9e2d2" />
            <OG sh={[
              { d: 'M124 120Q126 112 132 113L134 104M128 114L126 105M124 120H170Q172 124 166 124H124Z', f: '#c9b08a' },
              { d: circ([152, 108], 14), f: '#b07a46' },
              { d: smooth([[152, 108], [156, 106], [156, 112], [148, 112], [146, 104], [154, 98], [162, 104]]), st: K.out, sw: 1.4 },
            ]} />
          </g>
        ))}
        {box(216, (
          <g>
            <Campfire x={262} y={184} s={1} />
            <Pot x={262} y={166} s={1.15} />
          </g>
        ))}
      </Scene2>
    );
  },
  // Mantar yedikten sonra belirti: 114'ü arayın; yemek artığı kapta saklanıyor
  'sf-yb-cagri-114': () => {
    const h = { x: 120, y: 240, a: 8, s: 1.5, pose: 'hold' as const, side: 'R' as const, grip: 38 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={40} sleeve={HT.sleeve} skin={1}>
          <Phone x={g[0]} y={g[1]} s={1.5} a={8} text="114" />
        </Hand>
        <Waves x={g[0] + 44} y={g[1] - 40} a={-20} n={3} r={9} />
        <Jar x={250} y={210} w={70} h={64} liquid={null} lid>
          <Mushroom x={0} y={-6} s={0.6} cap="#c99a62" a={-10} />
        </Jar>
      </Scene2>
    );
  },
  /* ───────── Kıyı ───────── */
  // Temiz yer: açık denize bakan dalgalı kayalık (onay) | liman/boru çıkışı (yasak)
  'sf-yb-kiyi-temiz-yer': () => (
    <Scene2 bg="closeup">
      <defs>
        <clipPath id="sfyb-kiyi-l"><rect x={10} y={10} width={145} height={220} rx={12} /></clipPath>
        <clipPath id="sfyb-kiyi-r"><rect x={165} y={10} width={145} height={220} rx={12} /></clipPath>
      </defs>
      <g clip-path="url(#sfyb-kiyi-l)">
        <rect x={0} y={0} width={160} height={240} fill={K.sky} />
        <Water x={0} y={130} w={170} h={110} />
        <path d="M14 128q10 -14 22 0t22 0t22 0" fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />
        <OG sh={[{ d: 'M60 240L72 168L104 150L140 160L160 190V240Z', f: '#9a958c' }, { d: 'M104 150L140 160L160 190V240H120Z', f: '#86817a', no: true }]} />
        {[[86, 176], [96, 182], [108, 172], [118, 180]].map(([mx, my], i) => <Mussel key={i} x={mx} y={my} s={0.5} a={i * 20 - 30} />)}
      </g>
      <g clip-path="url(#sfyb-kiyi-r)">
        <rect x={160} y={0} width={160} height={240} fill="#d9dde0" />
        <Water x={160} y={150} w={170} h={90} color="#6f8a7a" />
        <OG sh={[{ d: 'M160 128H262V146H160Z', f: '#b7b3aa' }, { d: rrect(226, 112, 60, 22, 4), f: '#8e99a6' }, { d: ell([286, 123], 6, 11), f: '#5f6873' }]} />
        <path d="M290 128q10 10 6 36" fill="none" stroke="#7a5a36" stroke-width={8} stroke-linecap="round" />
        <ellipse cx={286} cy={168} rx={24} ry={6} fill="#7a5a36" opacity={0.6} />
        <rect x={180} y={60} width={30} height={68} fill="#c9c3b6" stroke={K.out} stroke-width={1.5} />
      </g>
      <Panels frame />
      <Ok x={40} y={40} r={15} />
      <Bad x={196} y={40} r={15} />
    </Scene2>
  ),
  // Midye seçme: kayaya yapışık kapalı midyeler (onay); elde açık-kırık midye (çarpı)
  'sf-yb-midye-secme': () => {
    const c = '#2f3a5a';
    const valve = 'M0 0Q-12 -24 -4 -52Q8 -60 16 -50Q20 -24 8 0Z';
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M0 240V120L40 96L120 90L170 110L160 240Z', f: '#9a958c' }, { d: 'M120 90L170 110L160 240H110Z', f: '#86817a', no: true }]} />
        {[[40, 150, -20], [62, 140, 10], [84, 150, -6], [106, 140, 18], [52, 176, 4], [76, 172, -14], [100, 176, 12], [124, 166, -4]].map(([mx, my, ma], i) => <Mussel key={i} x={mx} y={my + 22} s={1} a={ma} />)}
        <Ok x={84} y={70} r={15} />
        {/* sağ: ağzı açık kalmış (ölü) midye */}
        <OG sh={[{ d: smooth([[190, 214], [240, 204], [300, 210], [306, 232], [186, 232]], true), f: '#c9b48a' }]} />
        <g transform={tr(240, 210, 1.25)}>
          <OG ow={OW / 1.25} sh={[
            { d: valve, f: c, t: 'rotate(-62)' },
            { d: 'M0 -2Q-22 -14 -26 -30Q-4 -40 24 -30Q20 -12 2 -2Z', f: '#e8a066' },
            { d: 'M-12 -22Q0 -30 12 -22', st: '#b8643a', sw: 1.4 },
            { d: valve, f: c, t: 'rotate(56)' },
          ]} />
        </g>
        <Bad x={262} y={70} r={15} />
      </Scene2>
    );
  },
  // Renk değiştirmiş deniz, kıyıda ölü balık: kabuklu toplanmaz
  'sf-yb-kiyi-renkli-su': () => (
    <Scene2 bg="outdoor" gy={150}>
      <rect x={0} y={110} width={320} height={60} fill="#a2473a" />
      <path d="M0 110H320" stroke={K.out} stroke-width={1.5} />
      <path d="M20 128q12 -8 24 0t24 0M180 140q12 -8 24 0t24 0" fill="none" stroke="#c96b5a" stroke-width={2.4} />
      <OG sh={[{ d: 'M0 166Q80 156 160 162T320 160V240H0Z', f: '#d8c79a' }]} />
      <OG sh={[{ d: 'M230 240L240 184L272 170L300 178L320 200V240Z', f: '#9a958c' }]} />
      {[[262, 196], [276, 202], [290, 194]].map(([mx, my], i) => <Mussel key={i} x={mx} y={my} s={0.6} a={i * 20 - 20} />)}
      <DeadFish x={70} y={190} s={0.8} />
      <DeadFish x={150} y={206} s={0.6} a={20} />
      <No x={272} y={190} r={38} />
      <Person {...CAST.toplayici} x={196} y={226} pose={{ ...POSE.standSide, face: 'worried' }} />
    </Scene2>
  ),

  /* ───────── Böcek ───────── */
  // Yenebilir: çekirge, cırcır, kurtçuk, solucan (pişirilerek)
  'sf-yb-bocek-yenir': () => {
    const box = (x: number, y: number, kid: JSX.Element) => (
      <g>
        <rect x={x} y={y} width={140} height={100} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        {kid}
        <Ok x={x + 124} y={y + 16} r={10} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {box(14, 14, <Grasshopper x={76} y={74} s={1.25} />)}
        {box(166, 14, <Cricket x={222} y={74} s={1.25} />)}
        {box(14, 126, <Grub x={84} y={196} s={1.3} />)}
        {box(166, 126, <Worm x={236} y={180} s={1.4} />)}
      </Scene2>
    );
  },
  // Uzak durun: tüylü tırtıl, parlak renkli böcek, arı, örümcek
  'sf-yb-bocek-yasak': () => {
    const box = (x: number, y: number, kid: JSX.Element) => (
      <g>
        <rect x={x} y={y} width={140} height={100} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        {kid}
        <Bad x={x + 124} y={y + 16} r={10} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {box(14, 14, <Caterpillar x={80} y={74} s={1.3} />)}
        {box(166, 14, <Beetle x={236} y={66} s={1.3} />)}
        {box(14, 126, <Bee x={84} y={180} s={2.4} />)}
        {box(166, 126, <Spider x={236} y={178} s={1.4} />)}
      </Scene2>
    );
  },
  // Çekirge temizleme: baş, kanatlar ve dikenli arka bacaklar koparılır
  'sf-yb-cekirge-temizleme': () => (
    <Scene2 bg="closeup">
      <Grasshopper x={150} y={130} s={2.6} parts={false} />
      <g transform={tr(250, 70, 2.2)}>
        <OG ow={OW / 2.2} sh={[{ d: ell([0, 0], 9, 8), f: '#7fae3e' }, { d: smooth([[2, -6], [8, -16], [16, -20]]), st: K.out, sw: 1.6 }]} />
        <circle cx={3} cy={-2} r={2.4} fill={K.out} />
      </g>
      <Gx x={80} y={50} s={2} sh={[{ d: smooth([[-20, 4], [0, -6], [20, -4], [16, 2], [-4, 6]], true), f: '#b9c97a' }]} />
      <OG sh={[
        { d: capsule([62, 168], 3, [90, 222], 2.4), f: '#5f8a2e' },
        { d: capsule([28, 214], 10, [62, 166], 5), f: '#7fae3e' },
        { d: 'M34 206L58 172', st: '#5f8a2e', sw: 1.4 },
      ]} />
      <g stroke={K.out} stroke-width={2} stroke-linecap="round">
        {[0.25, 0.45, 0.65, 0.85].map((t) => { const px = 62 + 28 * t, py = 168 + 54 * t; return <path key={t} d={`M${f1(px)} ${f1(py)}l7 -3`} />; })}
      </g>
      <Arrow from={[210, 104]} to={[236, 84]} w={5} />
      <Arrow from={[110, 96]} to={[94, 70]} w={5} />
      <Arrow from={[112, 166]} to={[86, 184]} w={5} />
    </Scene2>
  ),

  /* ───────── Yumurta ───────── */
  // Yuvada işaretli 2–3 yumurta bırakılır; el işaretsiz olanı alıyor
  'sf-yb-yumurta-isaret': () => {
    const h = { x: 266, y: 236, a: -40, s: 1.05, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Nest x={140} y={128} rx={104} ry={72} />
        <Egg x={110} y={118} s={1.2} a={-20} mark />
        <Egg x={150} y={104} s={1.2} a={10} mark />
        <Egg x={142} y={150} s={1.2} a={70} mark />
        <Ok x={70} y={60} r={14} />
        <Hand {...h} arm={60} sleeve={HT.sleeve} skin={1}>
          <Egg x={g[0]} y={g[1]} s={1.2} a={-40} />
        </Hand>
      </Scene2>
    );
  },
  // Tazelik testi: dibe yatan taze (onay); dik duran ve yüzen eski (çarpı)
  'sf-yb-yumurta-su-testi': () => (
    <Scene2 bg="closeup">
      <Jar x={60} y={210} w={78} h={110} liquid={K.waterLight} lv={0.85}>
        <Egg x={0} y={-16} s={1.1} a={90} />
      </Jar>
      <Jar x={160} y={210} w={78} h={110} liquid={K.waterLight} lv={0.85}>
        <Egg x={0} y={-20} s={1.1} a={0} />
      </Jar>
      <Jar x={260} y={210} w={78} h={110} liquid={K.waterLight} lv={0.85}>
        <Egg x={0} y={-90} s={1.1} a={0} />
      </Jar>
      <Ok x={60} y={70} r={15} />
      <Bad x={160} y={70} r={15} />
      <Bad x={260} y={70} r={15} />
    </Scene2>
  ),
  // Tam pişirme: kaynayan suda yumurta; kesilmiş, akı ve sarısı katı
  'sf-yb-yumurta-pisirme': () => (
    <Scene2 bg="closeup">
      <Campfire x={96} y={222} s={1.4} />
      <Pot x={96} y={196} s={1.9} />
      <Egg x={92} y={140} s={0.9} a={70} />
      <OG sh={[{ d: 'M190 170C190 140 220 124 236 124C252 124 282 140 282 170Z', f: '#fdfaf2' }, { d: ell([236, 160], 20, 14), f: '#f2b632' }]} />
      <OG sh={[{ d: 'M190 178C190 200 220 214 236 214C252 214 282 200 282 178Z', f: '#fdfaf2' }, { d: ell([236, 186], 20, 12), f: '#f2b632' }]} />
      <Ok x={290} y={110} r={15} />
    </Scene2>
  ),

  /* ───────── Bal ───────── */
  // Bal arısı kovuğu (onay) | kâğıt gibi gri eşek arısı yuvası (yasak)
  'sf-yb-ari-esek-ayrim': () => (
    <Scene2 bg="closeup">
      <defs><clipPath id="sfyb-ari-l"><rect x={10} y={10} width={145} height={220} rx={12} /></clipPath></defs>
      <Panels />
      <g clip-path="url(#sfyb-ari-l)">
        <Trunk x={70} y={240} w={96} h={260} hollow={124} />
        <OG sh={[{ d: 'M58 104Q62 120 58 146L50 146Q54 124 50 104Z', f: '#e8b84a' }, { d: 'M52 112h6M52 122h6M52 132h6', st: '#b9862a', sw: 1.2 }]} />
      </g>
      <Bee x={118} y={92} s={1.2} />
      <Bee x={126} y={140} s={1.2} />
      <Bee x={104} y={180} s={1.1} />
      <Ok x={40} y={40} r={14} />
      <Stem pts={[[170, 40], [240, 46], [306, 40]]} w={6} c={C.bark} />
      <OG sh={[{ d: smooth([[236, 48], [272, 70], [282, 120], [258, 162], [236, 168], [212, 162], [190, 120], [200, 70]], true), f: '#b9b6ae' }, { d: ell([236, 160], 8, 5), f: '#3a3632' }]} />
      <g stroke="#8e8a82" stroke-width={1.6} fill="none">
        <path d="M204 84Q236 92 270 84M196 108Q236 118 278 108M198 132Q236 142 276 132" />
      </g>
      <Bee x={290} y={176} s={1.2} wasp />
      <Bee x={190} y={196} s={1.2} wasp />
      <No x={236} y={112} r={64} />
    </Scene2>
  ),
  // Koruyucu giysi: uzun kol, paçalar çorapta, eldiven, şapka ve yüz tülü
  'sf-yb-bal-koruyucu-giysi': () => {
    const p: PersonProps = { ...CAST.toplayici, x: 160, y: 228, s: 1.18, sleeve: 'long', pose: { ...POSE.stand, armB: [110, 96], armF: [70, 84], face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <GloveDefs />
        <Tree x={40} y={196} s={0.9} />
        <Person {...p} />
        {/* çoraplar paçanın üstünde */}
        {[r.ankleB, r.ankleF].map((a, i) => <OG key={i} sh={[{ d: rrect(a[0] - 8, a[1] - 18, 16, 16, 3), f: '#e9e4d6' }]} />)}
        {/* eldivenler */}
        {[r.handB, r.handF].map((h, i) => <OG key={'g' + i} sh={[{ d: ell(h, 7.5, 9), f: C.glove }, { d: rrect(h[0] - 7, h[1] - 16, 14, 8, 3), f: shade(C.glove, 0.1) }]} />)}
        {/* şapka ve tül */}
        <OG sh={[
          { d: `M${r.head[0] - 44} ${r.head[1] - 8}Q${r.head[0]} ${r.head[1] - 22} ${r.head[0] + 44} ${r.head[1] - 8}Q${r.head[0]} ${r.head[1] - 2} ${r.head[0] - 44} ${r.head[1] - 8}Z`, f: '#e2cf96' },
          { d: `M${r.head[0] - 18} ${r.head[1] - 12}Q${r.head[0]} ${r.head[1] - 40} ${r.head[0] + 18} ${r.head[1] - 12}Z`, f: '#e2cf96' },
        ]} />
        <path d={`M${r.head[0] - 38} ${r.head[1] - 6}L${r.head[0] - 30} ${r.head[1] + 34}Q${r.head[0]} ${r.head[1] + 40} ${r.head[0] + 30} ${r.head[1] + 34}L${r.head[0] + 38} ${r.head[1] - 6}`} fill="#ffffff" fill-opacity={0.45} stroke={K.out} stroke-width={1.5} />
        <Arrow from={[r.head[0] + 82, r.head[1] - 10]} to={[r.head[0] + 44, r.head[1] + 4]} w={5} />
        <Arrow from={[r.handF[0] + 52, r.handF[1] - 6]} to={[r.handF[0] + 14, r.handF[1]]} w={5} />
        <Arrow from={[r.ankleF[0] + 56, r.ankleF[1] - 20]} to={[r.ankleF[0] + 14, r.ankleF[1] - 10]} w={5} />
      </Scene2>
    );
  },
  // Duman: alevsiz tüten nemli ot demeti kovan ağzına tutuluyor
  'sf-yb-bal-duman': () => {
    const hole: P = [92, 116];
    const tip: P = [140, 124];
    const p: PersonProps = { ...CAST.toplayici, x: 236, y: 226, flip: true, sleeve: 'long', pose: { ...POSE.standSide, armF: { to: [tip[0] + 30, tip[1] + 8] }, armB: { to: [tip[0] + 40, tip[1] + 14] }, face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <Trunk x={70} y={214} w={92} h={230} hollow={hole[1]} />
        <Person {...p} />
        <OG sh={[{ d: `M${r.head[0] - 26} ${r.head[1] - 8}Q${r.head[0]} ${r.head[1] - 20} ${r.head[0] + 26} ${r.head[1] - 8}Q${r.head[0]} ${r.head[1] - 2} ${r.head[0] - 26} ${r.head[1] - 8}Z`, f: '#e2cf96' }, { d: `M${r.head[0] - 12} ${r.head[1] - 11}Q${r.head[0]} ${r.head[1] - 30} ${r.head[0] + 12} ${r.head[1] - 11}Z`, f: '#e2cf96' }]} />
        <path d={`M${r.head[0] - 22} ${r.head[1] - 6}L${r.head[0] - 18} ${r.head[1] + 22}H${r.head[0] + 18}L${r.head[0] + 22} ${r.head[1] - 6}`} fill="#fff" fill-opacity={0.45} stroke={K.out} stroke-width={1.3} />
        <OG sh={[{ d: capsule([tip[0], tip[1]], 7, [tip[0] + 38, tip[1] + 10], 5), f: '#8a9a5a' }, { d: `M${tip[0] + 6} ${tip[1] - 4}l4 10M${tip[0] + 14} ${tip[1] - 2}l3 10`, st: '#5f6f3a', sw: 1.4 }]} />
        <g opacity={0.95}>
          {[[128, 118, 12], [114, 112, 14], [100, 116, 13], [112, 98, 10]].map(([cx, cy, rr], i) => <circle key={i} cx={cx} cy={cy} r={rr} fill="#f2f2ee" stroke="#c9c9c2" stroke-width={1.2} />)}
        </g>
        <Bee x={40} y={60} s={0.9} />
        <Bee x={150} y={60} s={0.9} />
      </Scene2>
    );
  },
  /* ───────── Olta ───────── */
  // Sırık olta: boydan uzun esnek kamış, ucuna bağlı ip suya iniyor
  'sf-yb-olta-sirik': () => {
    const grip: P = [116, 128];
    const tip: P = [262, 44];
    const p: PersonProps = { ...CAST.balikci, x: 70, y: 214, pose: { ...POSE.standSide, armF: { to: grip }, armB: { to: [grip[0] - 18, grip[1] + 14] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={196}>
        <Water x={150} y={190} w={180} h={60} />
        <OG sh={[{ d: 'M0 196H160Q170 210 160 240H0Z', f: K.grass }]} />
        <Person {...p} />
        <path d={smooth([[grip[0] - 30, grip[1] + 22], grip, [200, 64], tip])} fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" />
        <path d={smooth([[grip[0] - 30, grip[1] + 22], grip, [200, 64], tip])} fill="none" stroke="#c9b26a" stroke-width={4} stroke-linecap="round" />
        <Rope pts={[tip, [266, 120], [268, 196]]} w={1.6} c="#f4f1ea" />
        <Bobber x={268} y={194} s={0.9} />
        <Arrow from={[220, 24]} to={[254, 40]} w={5} />
      </Scene2>
    );
  },
  // Şamandıra, ağırlık, yemli kanca (kesit)
  'sf-yb-olta-samandira': () => (
    <Scene2 bg="outdoor" gy={60}>
      <rect x={0} y={60} width={320} height={180} fill={K.water} />
      <rect x={0} y={60} width={320} height={180} fill="#2a6aa8" opacity={0.25} />
      <path d="M0 60q10 -4 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M0 214Q80 204 160 212T320 208V240H0Z', f: '#b89a6a' }]} />
      <Rope pts={[[160, 0], [160, 50]]} w={1.6} c="#f4f1ea" />
      <Rope pts={[[160, 68], [160, 170]]} w={1.6} c="#f4f1ea" />
      <Bobber x={160} y={58} s={1.8} />
      <Stone x={160} y={150} rx={8} ry={7} c="#8f8c85" />
      <Hook x={160} y={170} s={1.3} />
      <g transform="translate(150 200) rotate(-70) scale(0.42)"><Worm x={0} y={0} /></g>
      <Arrow from={[230, 30]} to={[180, 52]} w={5} />
      <Arrow from={[230, 150]} to={[176, 150]} w={5} />
      <Arrow from={[230, 196]} to={[166, 202]} w={5} />
    </Scene2>
  ),
  // Bırakma olta: dibe çakılı iki esnek fidan, aralarında ip, sarkan kısa iğneli ipler (kesit)
  'sf-yb-birakma-olta': () => (
    <Scene2 bg="outdoor" gy={70}>
      <rect x={0} y={70} width={320} height={170} fill={K.water} />
      <path d="M0 70H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M0 206Q80 198 160 204T320 200V240H0Z', f: '#b89a6a' }]} />
      <Stem pts={[[54, 214], [50, 140], [60, 84]]} w={5} c={C.stick} />
      <Stem pts={[[266, 214], [270, 140], [260, 84]]} w={5} c={C.stick} />
      <Rope pts={[[60, 88], [160, 94], [260, 88]]} w={2} />
      <Rope pts={[[120, 92], [122, 140]]} w={1.6} c="#f4f1ea" />
      <Rope pts={[[200, 92], [198, 140]]} w={1.6} c="#f4f1ea" />
      <Hook x={122} y={138} s={1.1} />
      <Hook x={198} y={138} s={1.1} />
      <Arrow from={[160, 30]} to={[160, 84]} w={5} />
    </Scene2>
  ),

  /* ───────── Kanca ───────── */
  // Diken kanca: dal sap, kıvrık diken uç; ip sapa sarılı
  'sf-yb-kanca-diken': () => (
    <Scene2 bg="closeup">
      <OG sh={[
        { d: 'M190 140Q214 162 214 172Q200 196 156 214Q192 186 194 168Q186 160 180 156Z', f: '#6e4a2a' },
        { d: capsule([70, 70], 9, [204, 152], 7), f: '#8a6038' },
      ]} />
      <Rope pts={[[20, 40], [60, 62], [84, 76]]} w={2.4} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${86 + i * 7} ${70 + i * 4.3}l-6 14`} stroke={K.out} stroke-width={4.6} stroke-linecap="round" />)}
      {[0, 1, 2, 3, 4].map((i) => <path key={'r' + i} d={`M${86 + i * 7} ${70 + i * 4.3}l-6 14`} stroke={C.rope} stroke-width={2.6} stroke-linecap="round" />)}
      <Arrow from={[250, 236]} to={[170, 216]} bend={0.25} />
    </Scene2>
  ),
  // Tahta ve diken kanca: ~2,5 cm sap, çentiğe oturtulmuş eğik diken, sıkı sargı
  'sf-yb-kanca-tahta': () => (
    <Scene2 bg="closeup">
      <OG sh={[
        { d: rrect(60, 100, 170, 34, 10), f: '#c99a62' },
        { d: 'M206 100L230 108V126L206 134Z', f: '#7a5a36' },
        { d: 'M208 108Q232 92 214 54Q252 80 228 126Z', f: '#e2cf96' },
      ]} />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${150 + i * 9} 96v42`} stroke={K.out} stroke-width={5} stroke-linecap="round" />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={'r' + i} d={`M${150 + i * 9} 96v42`} stroke={C.rope} stroke-width={3} stroke-linecap="round" />)}
      <Rope pts={[[20, 117], [62, 117]]} w={2.6} />
      <path d="M60 176H230M60 168V184M230 168V184" stroke={K.out} stroke-width={2.4} />
      <Label x={145} y={204} text="2,5 cm" />
    </Scene2>
  ),
  // Çatal kanca: yemin içine ipe paralel gömülür; balık yutunca çubuk boğazda yan döner
  'sf-yb-catal-yem': () => {
    const gorge = (x: number, y: number, a: number, gs = 1) => (
      <Gx x={x} y={y} a={a} s={gs} sh={[{ d: 'M-30 0L-24 -4H24L30 0L24 4H-24Z', f: '#eadcc0' }, { d: 'M-2 -4V4M2 -4V4', st: K.out, sw: 1.2 }]} />
    );
    return (
      <Scene2 bg="closeup">
        <Panels />
        <Rope pts={[[84, 24], [84, 90]]} w={2} />
        <path d={smooth([[84, 84], [90, 110], [78, 140], [90, 170], [82, 196]])} fill="none" stroke={K.out} stroke-width={22} stroke-linecap="round" />
        <path d={smooth([[84, 84], [90, 110], [78, 140], [90, 170], [82, 196]])} fill="none" stroke="#d98a86" stroke-width={19} stroke-linecap="round" />
        <g opacity={0.85}>{gorge(84, 132, 90)}</g>
        <Fish x={242} y={128} s={1.02} flip />
        <OG sh={[{ d: smooth([[214, 118], [240, 114], [266, 122], [266, 134], [240, 140], [214, 136]], true), f: '#e9a8a0' }]} />
        <Rope pts={[[176, 126], [206, 126], [234, 128]]} w={2} />
        {gorge(236, 128, 90, 0.75)}
        <Arrow from={[204, 78]} to={[248, 92]} bend={-0.5} w={5} />
      </Scene2>
    );
  },

  /* ───────── Balık yeri ───────── */
  // Balığın saklandığı yerler (kesit): sarkan çalı gölgesi, batık kütük, derin gölet
  'sf-yb-balik-saklanma': () => (
    <Scene2 bg="outdoor" gy={70}>
      <rect x={0} y={70} width={320} height={170} fill={K.water} />
      <path d="M0 70H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M0 60H40Q60 64 64 120Q100 150 150 150Q180 150 200 200Q240 226 320 214V240H0Z', f: '#a88a5a' }]} />
      <OG sh={[{ d: 'M0 30Q30 10 60 22Q90 18 100 40Q110 70 80 74Q50 80 20 70Q0 64 0 30Z', f: '#4f8a3e' }]} />
      <rect x={60} y={72} width={60} height={30} fill="#1f4a7a" opacity={0.25} />
      <Fish x={92} y={92} s={0.42} flip />
      <OG sh={[{ d: capsule([150, 150], 9, [226, 168], 8), f: '#6a4a32' }, { d: ell([226, 168], 7, 7), f: '#a88a5a' }]} />
      <Fish x={188} y={140} s={0.42} />
      <Fish x={262} y={190} s={0.48} flip />
      <Arrow from={[150, 100]} to={[112, 94]} w={5} />
      <Arrow from={[150, 112]} to={[180, 134]} w={5} />
      <Arrow from={[250, 120]} to={[262, 172]} w={5} />
    </Scene2>
  ),
  // Akıntıda kayanın arkasındaki durgun girdap (kuş bakışı); şamandıra girdabın kenarında
  'sf-yb-balik-girdap': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#8fc163" />
      <OG sh={[{ d: 'M60 0H260V240H60Z', f: K.water }]} />
      <Arrow from={[110, 10]} to={[110, 70]} w={5} />
      <Arrow from={[220, 10]} to={[220, 70]} w={5} />
      <Arrow from={[100, 100]} to={[100, 200]} w={4} />
      <Arrow from={[230, 100]} to={[230, 200]} w={4} />
      <OG sh={[{ d: smooth([[130, 78], [170, 66], [196, 84], [190, 112], [150, 118], [126, 104]], true), f: '#9a958c' }]} />
      <path d={smooth([[140, 140], [180, 140], [186, 162], [160, 176], [140, 160], [154, 150]])} fill="none" stroke={K.waterLight} stroke-width={3} stroke-linecap="round" />
      <Fish x={164} y={158} s={0.36} a={-90} />
      <Bobber x={194} y={176} s={1.2} />
      <Ok x={222} y={150} r={13} />
    </Scene2>
  ),
  // Yem çeşitleri: solucan, çekirge, kurtçuk, balık parçası; ortada kanca
  'sf-yb-yem-cesitleri': () => (
    <Scene2 bg="closeup">
      <Worm x={80} y={64} s={1.1} />
      <Grasshopper x={240} y={64} s={1.1} />
      <Grub x={80} y={196} s={1} />
      <OG sh={[{ d: smooth([[200, 176], [250, 168], [280, 180], [270, 200], [220, 204]], true), f: '#e9a8a0' }, { d: 'M214 188Q240 182 266 188', st: '#c97a72', sw: 1.4 }]} />
      <Hook x={164} y={96} s={1.8} />
      <Rope pts={[[164, 30], [164, 96]]} w={1.8} c="#f4f1ea" />
    </Scene2>
  ),

  /* ───────── Sepet tuzak ───────── */
  // İlke: balık geniş huniden girer, dar ağızdan çıkamaz
  'sf-yb-sepet-huni-ilke': () => (
    <Scene2 bg="outdoor" gy={30}>
      <rect x={0} y={30} width={320} height={210} fill={K.water} />
      <Basket x={92} y={130} L={200} R={70} />
      <Fish x={36} y={130} s={0.42} />
      <Arrow from={[40, 170]} to={[120, 140]} bend={0.1} w={5} />
      <Fish x={240} y={150} s={0.42} />
      <path d="M220 110Q170 90 140 120" fill="none" stroke={K.danger} stroke-width={4} stroke-dasharray="7 6" stroke-linecap="round" />
      <Bad x={160} y={78} r={12} />
    </Scene2>
  ),
  // Taş set: V biçimli iki taş kol akıntı yönünde daralır; uçta huni sepet (kuş bakışı)
  'sf-yb-tas-set': () => {
    const stones = (a: P, b: P, n: number) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1); return <Stone key={i} x={a[0] + (b[0] - a[0]) * t} y={a[1] + (b[1] - a[1]) * t} rx={9} ry={7} a={i * 30} />; });
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#8fc163" />
        <OG sh={[{ d: 'M0 30H320V210H0Z', f: K.water }]} />
        {stones([30, 40], [170, 112], 10)}
        {stones([30, 200], [170, 128], 10)}
        <g transform="translate(186 120) rotate(0) scale(0.55)"><Basket x={0} y={0} L={180} R={40} /></g>
        <Arrow from={[24, 120]} to={[90, 120]} w={5} />
        <Arrow from={[60, 80]} to={[120, 106]} w={4} />
        <Arrow from={[60, 160]} to={[120, 134]} w={4} />
      </Scene2>
    );
  },
  // Kıyıda yarım ay taş duvar: su çekilince içinde balık kalır
  'sf-yb-tas-havuz': () => {
    const n = 13;
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#d8c79a" />
        <OG sh={[{ d: 'M320 0V240H250Q230 120 250 0Z', f: K.water }]} />
        <OG sh={[{ d: 'M-5 -5H58Q66 60 60 120T58 245H-5Z', f: '#9cbf6a' }]} />
        <g fill="none" stroke={K.grassShade} stroke-width={2.2} stroke-linecap="round">
          {[[20, 40], [36, 110], [18, 170], [40, 210]].map(([gx, gy]) => <path key={gx + '-' + gy} d={`M${gx} ${gy}l-4 -9M${gx} ${gy}l1 -11M${gx} ${gy}l5 -8`} />)}
        </g>
        <Arrow from={[262, 120]} to={[304, 120]} w={5} />
        <OG sh={[{ d: 'M70 50A110 76 0 0 1 70 190Z', f: K.waterLight }]} />
        {Array.from({ length: n }, (_, i) => { const t = -Math.PI / 2 + (i / (n - 1)) * Math.PI; return <Stone key={i} x={70 + Math.cos(t) * 112} y={120 + Math.sin(t) * 78} rx={11} ry={9} a={i * 25} />; })}
        <Fish x={110} y={104} s={0.36} />
        <Fish x={130} y={146} s={0.32} flip />
      </Scene2>
    );
  },

  /* ───────── Ağ ───────── */
  // Üst ip iki ağaç arasında; ikiye katlanmış ince ipler eşit aralıkla sarkıyor; kişi son ipi bağlıyor
  'sf-yb-ag-ust-ip': () => {
    const y0 = 92;
    const knot: P = [212, y0];
    const p: PersonProps = { ...CAST.balikci, x: 176, y: 226, pose: { ...POSE.standSide, armF: { to: knot }, armB: { to: [knot[0] + 6, knot[1] + 8] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Trunk x={26} y={206} w={30} h={180} />
        <Trunk x={300} y={206} w={30} h={180} />
        <Rope pts={[[40, y0], [160, y0 + 2], [286, y0]]} w={2.6} />
        {[60, 84, 108, 132, 156, 180].map((x) => (
          <g key={x}>
            <path d={`M${x - 3} ${y0}V${y0 + 90}M${x + 3} ${y0}V${y0 + 90}`} stroke={C.rope} stroke-width={1.6} />
            <circle cx={x} cy={y0} r={3} fill={C.rope} stroke={K.out} stroke-width={1} />
          </g>
        ))}
        <path d={`M${knot[0] - 3} ${y0}V${y0 + 60}M${knot[0] + 3} ${y0}V${y0 + 60}`} stroke={C.rope} stroke-width={1.6} />
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <path d={`M${knot[0] - 3} ${y0}V${y0 + 60}M${knot[0] + 3} ${y0}V${y0 + 60}`} stroke={C.rope} stroke-width={1.6} />
        <Person {...p} only={['armF']} />
      </Scene2>
    );
  },
  // İlk sıra: komşu iki ipin birbirine bakan telleri tek düğümle bağlanıyor; eşkenar dörtgen göz
  'sf-yb-ag-dugum': () => {
    const xs = [40, 100, 160, 220, 280];
    const y0 = 34, yk = 130;
    const strand = (pts: P[], k: string) => (
      <g key={k}>
        <path d={line(pts)} fill="none" stroke={K.out} stroke-width={4.2} stroke-linejoin="round" />
        <path d={line(pts)} fill="none" stroke={C.rope} stroke-width={2.2} stroke-linejoin="round" />
      </g>
    );
    const h0 = { x: 0, y: 0, a: -30, s: 0.8, pose: 'pinch' as const, side: 'L' as const };
    const q = handPoint(h0, 'pinch');
    const hk = { ...h0, x: 130 + 4 - q[0], y: yk + 4 - q[1] };
    const out: JSX.Element[] = [];
    xs.forEach((x, i) => {
      const L: P[] = i > 0 ? [[x - 8, y0], [x - 8, yk - 46], [(xs[i - 1] + x) / 2, yk], [x - 8, yk + 46], [x - 8, 236]] : [[x - 8, y0], [x - 8, 236]];
      const R: P[] = i < xs.length - 1 ? [[x + 8, y0], [x + 8, yk - 46], [(xs[i + 1] + x) / 2, yk], [x + 8, yk + 46], [x + 8, 236]] : [[x + 8, y0], [x + 8, 236]];
      out.push(strand(L, 'l' + i), strand(R, 'r' + i));
    });
    return (
      <Scene2 bg="closeup">
        <path d={`M108 ${yk + 46}L130 ${yk}L152 ${yk + 46}Z`} fill={K.action} opacity={0.22} />
        <Rope pts={[[8, y0], [312, y0]]} w={3.4} />
        {out}
        {xs.slice(0, -1).map((x, i) => <circle key={i} cx={(x + xs[i + 1]) / 2} cy={yk} r={5.5} fill={C.rope} stroke={K.out} stroke-width={1.5} />)}
        {xs.map((x) => <circle key={'t' + x} cx={x} cy={y0} r={5} fill={C.rope} stroke={K.out} stroke-width={1.5} />)}
        <Hand {...hk} arm={120} sleeve={HB.sleeve} skin={2} />
      </Scene2>
    );
  },
  // Ağ suda (kesit): üst ipte şişe ve kuru dal yüzdürücüler, altta taş ağırlıklar, uçlar kazıkta
  'sf-yb-ag-suda': () => {
    const yTop = 72, yBot = 196;
    return (
      <Scene2 bg="outdoor" gy={70}>
        <rect x={0} y={70} width={320} height={170} fill={K.water} />
        <path d="M0 70H320" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M0 206Q80 200 160 206T320 202V240H0Z', f: '#b89a6a' }]} />
        <OG sh={[{ d: 'M0 40H40L56 70V240H0Z', f: '#a88a5a' }]} />
        <OG sh={[{ d: rrect(30, 28, 8, 40, 2), f: C.stick }]} />
        <Rope pts={[[36, 34], [70, yTop]]} w={2} />
        <g stroke={C.rope} stroke-width={1.4} fill="none">
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${70 + i * 24} ${yTop}L${82 + i * 24} ${yTop + 31}L${70 + i * 24} ${yTop + 62}L${82 + i * 24} ${yTop + 93}L${70 + i * 24} ${yBot}`} />)}
          {Array.from({ length: 10 }, (_, i) => <path key={'b' + i} d={`M${94 + i * 24} ${yTop}L${82 + i * 24} ${yTop + 31}L${94 + i * 24} ${yTop + 62}L${82 + i * 24} ${yTop + 93}L${94 + i * 24} ${yBot}`} />)}
        </g>
        <Rope pts={[[70, yTop], [310, yTop]]} w={2.4} />
        <Rope pts={[[70, yBot], [310, yBot]]} w={2.4} />
        {[100, 196, 292].map((x) => <OG key={x} sh={[{ d: rrect(x - 9, yTop - 14, 18, 24, 5), f: '#cfe6ef' }, { d: rrect(x - 3, yTop - 20, 6, 6, 1), f: K.safe }]} />)}
        {[148, 244].map((x) => <OG key={x} sh={[{ d: capsule([x - 14, yTop - 4], 5, [x + 14, yTop - 4], 5), f: C.wood }]} />)}
        {[100, 172, 244].map((x) => <Stone key={x} x={x} y={yBot + 8} rx={10} ry={8} c="#8f8c85" />)}
        <Fish x={210} y={140} s={0.5} flip />
      </Scene2>
    );
  },

  /* ───────── Kerevit ve kurbağa ───────── */
  // İpe bağlı yeme tutunan kerevit yavaşça çekiliyor; kepçe altından yaklaşıyor (kesit)
  'sf-yb-kerevit-ip': () => {
    const bait: P = [170, 134];
    return (
      <Scene2 bg="outdoor" gy={96}>
        <rect x={0} y={96} width={320} height={144} fill={K.water} />
        <path d="M0 96H320" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M0 216Q120 208 320 214V240H0Z', f: '#b89a6a' }]} />
        <OG sh={[{ d: 'M0 76H70L84 96L70 240H0Z', f: '#a88a5a' }]} />
        <Hand x={40} y={92} a={60} s={0.7} pose="fist" side="R" arm={60} sleeve={HB.sleeve} skin={2} />
        <Rope pts={[[78, 70], [130, 90], [bait[0], bait[1] - 6]]} w={1.8} c="#f4f1ea" />
        <Crayfish x={bait[0]} y={bait[1] + 38} s={0.8} />
        <OG sh={[{ d: ell(bait, 11, 9), f: '#c9736a' }]} />
        <Arrow from={[128, 150]} to={[100, 116]} w={4} />
        <path d={smooth([[300, 30], [270, 130], [236, 190]])} fill="none" stroke={K.out} stroke-width={6} />
        <path d={smooth([[300, 30], [270, 130], [236, 190]])} fill="none" stroke={C.stick} stroke-width={3.4} />
        <OG sh={[{ d: smooth([[204, 186], [236, 180], [268, 196], [250, 226], [216, 222]], true), f: '#e8ecef', op: 0.85 }]} />
        <g stroke="#9aa6b2" stroke-width={1}>{[214, 226, 238, 250].map((x) => <path key={x} d={`M${x} 184v38`} />)}</g>
      </Scene2>
    );
  },
  // Kereviti kıskaçların gerisinden, sırtından tutun (onay); kıskaçtan tutmak (çarpı)
  'sf-yb-kerevit-tutma': () => {
    const cx: P = [160, 140];
    const back: P = [cx[0], cx[1] - 16 * 1.6];
    const h0 = { x: 0, y: 0, a: -58, s: 1.0, pose: 'pinch' as const, side: 'R' as const };
    const q = handPoint(h0, 'pinch');
    const h = { ...h0, x: back[0] + 2 - q[0], y: back[1] - q[1] };
    // köşe: kıskacın ucundan tutmak (yanlış)
    const ic: P = [56, 206];
    const claw: P = [ic[0] + 30 * 0.6, ic[1] - 70 * 0.6];
    const w0 = { x: 0, y: 0, a: -70, s: 0.34, pose: 'pinch' as const, side: 'R' as const };
    const wq = handPoint(w0, 'pinch');
    const w = { ...w0, x: claw[0] - wq[0], y: claw[1] - wq[1] };
    return (
      <Scene2 bg="closeup">
        <Crayfish x={cx[0]} y={cx[1]} s={1.6} />
        <Hand {...h} arm={200} sleeve={HB.sleeve} skin={2} />
        <Ok x={290} y={36} r={15} />
        <g>
          <rect x={12} y={136} width={92} height={94} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
          <defs><clipPath id="sfyb-kerevit-in"><rect x={12} y={136} width={92} height={94} rx={10} /></clipPath></defs>
          <g clip-path="url(#sfyb-kerevit-in)">
            <Crayfish x={ic[0]} y={ic[1]} s={0.6} />
            <Hand {...w} arm={80} sleeve={HB.sleeve} skin={2} />
          </g>
          <Bad x={24} y={148} r={10} />
        </g>
      </Scene2>
    );
  },
  // Su kurbağası (ıslak, düz deri; onay) | karakurbağası (kuru, siğilli; göz arkası bezler; yasak)
  'sf-yb-kurbaga-ayrim': () => (
    <Scene2 bg="closeup">
      <Panels />
      <Frog x={84} y={156} s={1.55} />
      <Frog x={234} y={156} s={1.55} toad />
      <Ok x={40} y={40} r={15} />
      <Arrow from={[232, 50]} to={[240, 94]} w={5} />
      <No x={236} y={124} r={66} />
    </Scene2>
  ),

  /* ───────── Ayak izleri ───────── */
  // Tavşan izi: iki uzun arka ayak önde, iki küçük ön ayak arkada; tekrarlayan grup
  'sf-yb-iz-tavsan': () => {
    const grp = (x: number, y: number) => (
      <g key={x}>
        <Pad x={x + 26} y={y - 8} rx={14} ry={5} />
        <Pad x={x + 26} y={y + 8} rx={14} ry={5} />
        <Pad x={x - 4} y={y - 2} rx={4.5} ry={4} />
        <Pad x={x - 14} y={y + 5} rx={4.5} ry={4} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill={C.mud} />
        <rect x={0} y={0} width={320} height={240} fill="#8a7055" opacity={0.6} />
        {grp(40, 150)}
        {grp(130, 140)}
        {grp(220, 150)}
        <Arrow from={[60, 196]} to={[270, 196]} w={5} />
        <Rabbit x={230} y={86} s={0.9} hop />
      </Scene2>
    );
  },
  // Tilki, köpek, kurt izi: dört parmak, taban yastığı, tırnak izleri; boy farkı
  'sf-yb-iz-kopekgil': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#8a7055" />
      <CanidTrack x={58} y={150} s={1.2} narrow={0.75} />
      <CanidTrack x={150} y={150} s={1.7} />
      <CanidTrack x={256} y={156} s={2.4} />
      <Arrow from={[300, 40]} to={[264, 84]} w={5} />
    </Scene2>
  ),
  // Ayı izi: uzun insan ayağına benzer arka iz, kısa ön iz, beş parmak ve uzun tırnak; ölçek için bot izi
  'sf-yb-iz-ayi': () => {
    const bear = (x: number, y: number, L: number) => (
      <g>
        <path d={`M${x - 22} ${y - 10}Q${x - 24} ${y + L} ${x} ${y + L + 4}Q${x + 24} ${y + L} ${x + 22} ${y - 10}Q${x} ${y - 18} ${x - 22} ${y - 10}Z`} fill={PIT} />
        {[-22, -11, 0, 11, 22].map((dx, i) => (
          <g key={i}>
            <ellipse cx={x + dx} cy={y - 24 + Math.abs(dx) * 0.3} rx={5.4} ry={6.4} fill={PIT} />
            <path d={`M${x + dx} ${y - 32 + Math.abs(dx) * 0.3}v-12`} stroke={PIT} stroke-width={2.4} stroke-linecap="round" />
          </g>
        ))}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#8a7055" />
        {bear(80, 100, 96)}
        {bear(170, 110, 40)}
        <g transform="translate(264 120)">
          <path d="M-16 -50Q-18 -66 0 -68Q18 -66 16 -50L14 10Q14 30 0 30Q-14 30 -14 10Z" fill="#6e5640" stroke={shade(PIT, 0.2)} stroke-width={1} />
          {[-40, -26, -12, 2, 16].map((yy) => <path key={yy} d={`M-12 ${yy}H12`} stroke={PIT} stroke-width={3} />)}
        </g>
      </Scene2>
    );
  },

  /* ───────── Diğer izler ───────── */
  // Hayvan yolu: otlar arasında dar patika, çalı altında tünel gibi açıklık
  'sf-yb-hayvan-yolu': () => (
    <Scene2 bg="outdoor" gy={110}>
      <OG sh={[{ d: 'M0 110H320V240H0Z', f: '#9cc46a' }]} />
      <path d="M120 240Q150 190 180 160Q200 140 214 126" fill="none" stroke="#c9b68a" stroke-width={30} stroke-linecap="round" />
      <path d="M120 240Q150 190 180 160Q200 140 214 126" fill="none" stroke="#b7a274" stroke-width={2} stroke-dasharray="6 8" />
      <OG sh={[{ d: smooth([[170, 128], [190, 84], [240, 70], [290, 86], [300, 124], [260, 132]], true), f: '#4f8a3e' }, { d: ell([222, 124], 16, 12), f: '#2e4a24' }]} />
      <g stroke="#6f9a4a" stroke-width={2.4} stroke-linecap="round">
        {[[20, 200], [50, 180], [70, 220], [240, 210], [270, 180], [300, 220], [90, 160], [40, 140], [280, 150]].map(([gx, gy], i) => <path key={i} d={`M${gx} ${gy}l-5 -16M${gx} ${gy}l1 -18M${gx} ${gy}l6 -14`} />)}
      </g>
      <Arrow from={[132, 222]} to={[204, 136]} bend={-0.15} w={5} />
    </Scene2>
  ),
  // Dışkı: tavşan (yuvarlak bilye), karaca (uzunca koyu tane), tilki (ince uzun burgulu); dalla dürtülür
  'sf-yb-diski-turleri': () => {
    const box = (x: number, kid: JSX.Element) => (
      <g>
        <rect x={x} y={30} width={94} height={180} rx={10} fill="#a88a64" stroke={K.out} stroke-width={1.5} />
        {kid}
        <Stem pts={[[x + 86, 50], [x + 50, 128]]} w={4} c={C.stick} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {box(12, <g>{[[36, 150], [50, 146], [44, 160], [60, 158], [30, 164], [54, 170]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r={6} fill="#6a5236" stroke={K.out} stroke-width={1} />)}</g>)}
        {box(113, <g>{[[140, 150, 20], [156, 146, -10], [146, 162, 60], [164, 162, 30], [134, 168, -30]].map(([px, py, pa], i) => <ellipse key={i} cx={px} cy={py} rx={4} ry={7} transform={`rotate(${pa} ${px} ${py})`} fill="#3a2e24" stroke={K.out} stroke-width={1} />)}</g>)}
        {box(214, <g><path d={smooth([[236, 170], [250, 160], [264, 166], [276, 156], [284, 140]])} fill="none" stroke={K.out} stroke-width={11} stroke-linecap="round" /><path d={smooth([[236, 170], [250, 160], [264, 166], [276, 156], [284, 140]])} fill="none" stroke="#5a4a3a" stroke-width={8} stroke-linecap="round" /><path d="M284 140l6 -10" stroke={K.out} stroke-width={2} /></g>)}
      </Scene2>
    );
  },
  // Yaban domuzu izi: eşelenmiş toprak, çamur çukuru, toynak izleri; uzakta domuz; uyarı
  'sf-yb-domuz-esinti': () => (
    <Scene2 bg="outdoor" gy={120}>
      <Tree x={40} y={124} kind="leaf" s={0.8} />
      <Tree x={120} y={122} kind="leaf" s={0.7} />
      <Boar x={240} y={126} s={0.55} />
      <OG sh={[{ d: 'M0 120H320V240H0Z', f: '#7d9a54' }]} />
      <OG sh={[{ d: smooth([[40, 170], [90, 156], [150, 166], [140, 196], [80, 200], [36, 190]], true), f: '#7a5a3a' }]} />
      {[[60, 176], [90, 170], [120, 180], [76, 190], [110, 192]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={9} ry={5} fill="#5e432a" stroke={K.out} stroke-width={1} />)}
      <OG sh={[{ d: ell([226, 196], 60, 22), f: '#5b4a3a' }, { d: ell([226, 198], 44, 14), f: '#6f5a46' }]} />
      {[[176, 224], [196, 230], [290, 222]].map(([hx, hy], i) => <g key={i}><Pad x={hx - 3} y={hy} rx={2.6} ry={5} a={-8} /><Pad x={hx + 3} y={hy} rx={2.6} ry={5} a={8} /></g>)}
      <g transform="translate(286 52)">
        <path d="M0 -22L22 18H-22Z" fill={K.danger} stroke={K.out} stroke-width={2} stroke-linejoin="round" />
        <path d="M0 -8V6" stroke="#fff" stroke-width={4} stroke-linecap="round" />
        <circle cx={0} cy={12} r={2.4} fill="#fff" />
      </g>
    </Scene2>
  ),

  /* ───────── Hayvan davranışı ───────── */
  // Şafakta çayır kenarında otlayan karaca ve tavşan
  'sf-yb-safak-hayvan': () => (
    <Scene2 bg="outdoor" gy={150}>
      <rect x={0} y={0} width={320} height={150} fill="#f6c99a" />
      <rect x={0} y={90} width={320} height={60} fill="#f9dcb6" />
      <circle cx={250} cy={150} r={30} fill="#ffb347" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M0 140Q80 120 170 138T320 132V150H0Z', f: '#c2b089' }]} />
      <OG sh={[{ d: 'M0 150H320V240H0Z', f: '#94b45e' }]} />
      <Tree x={30} y={160} kind="pine" s={1} />
      <Tree x={70} y={156} kind="pine" s={0.8} />
      <Deer x={150} y={212} s={1} graze />
      <Rabbit x={278} y={216} s={0.8} flip />
    </Scene2>
  ),
  // Patikalar suya iner: farklı yönlerden gelen yollar dere kıyısında birleşir (kuş bakışı)
  'sf-yb-su-kenari-yol': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#8fc163" />
      <OG sh={[{ d: 'M0 190Q80 170 160 186T320 176V240H0Z', f: K.water }]} />
      <OG sh={[{ d: smooth([[110, 186], [140, 160], [190, 160], [220, 182], [170, 190]], true), f: '#8a7055' }]} />
      {[[40, 10], [160, 0], [300, 20]].map(([px, py], i) => (
        <path key={i} d={smooth([[px, py], [(px + 160) / 2 + (i - 1) * 10, 90], [160, 166]])} fill="none" stroke="#c9b68a" stroke-width={14} stroke-linecap="round" />
      ))}
      {[[150, 176], [164, 170], [178, 178], [190, 168]].map(([hx, hy], i) => <g key={i}><Pad x={hx - 2} y={hy} rx={2} ry={4} a={-8} /><Pad x={hx + 2} y={hy} rx={2} ry={4} a={8} /></g>)}
      <Arrow from={[50, 30]} to={[110, 120]} w={5} />
      <Arrow from={[160, 20]} to={[160, 120]} w={5} />
      <Arrow from={[290, 40]} to={[214, 120]} w={5} />
    </Scene2>
  ),
  // Rüzgâr hayvandan size doğru eserken yaklaşın (onay); köşede ters rüzgâr, kaçan karaca (çarpı)
  'sf-yb-ruzgar-yonu': () => {
    const wind = (x: number, y: number, dir: 1 | -1) => (
      <g fill="none" stroke="#5d7a99" stroke-width={3.4} stroke-linecap="round">
        <path d={`M${x} ${y}h${-44 * dir}q${-10 * dir} 0 ${-10 * dir} -8`} />
        <path d={`M${x + 10 * dir} ${y + 14}h${-50 * dir}`} />
        <path d={`M${x} ${y + 28}h${-40 * dir}q${-10 * dir} 0 ${-10 * dir} 8`} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Person {...CAST.izci} x={70} y={226} pose={{ ...POSE.crouch, face: 'neutral' }} />
        <OG sh={[{ d: smooth([[96, 226], [100, 170], [130, 150], [154, 176], [150, 226]], true), f: '#4f8a3e' }]} />
        <Deer x={232} y={214} s={0.85} graze />
        {wind(210, 70, 1)}
        <Arrow from={[200, 128]} to={[160, 128]} w={4} color="#5d7a99" />
        <Ok x={130} y={40} r={14} />
        <g>
          <rect x={232} y={14} width={78} height={64} rx={8} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
          <Deer x={278} y={70} s={0.36} run />
          <Arrow from={[244, 30]} to={[270, 30]} w={3} color="#9aa6b2" />
          <Bad x={300} y={22} r={9} />
        </g>
      </Scene2>
    );
  },

  /* ───────── İlmek ───────── */
  // Kayan ilmek: telin ucunda küçük göz, öbür uç gözden geçer
  'sf-yb-ilmek-tel': () => {
    const loop = smooth([[150, 92], [100, 70], [62, 110], [80, 168], [140, 186], [196, 150], [200, 110], [170, 92]]);
    return (
      <Scene2 bg="closeup">
        <path d={loop} fill="none" stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={loop} fill="none" stroke="#b9c2cc" stroke-width={3.6} stroke-linecap="round" />
        <path d="M150 92L300 60" fill="none" stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d="M150 92L300 60" fill="none" stroke="#b9c2cc" stroke-width={3.6} stroke-linecap="round" />
        <circle cx={160} cy={92} r={9} fill="none" stroke={K.out} stroke-width={6} />
        <circle cx={160} cy={92} r={9} fill="none" stroke="#b9c2cc" stroke-width={3.4} />
        <circle cx={160} cy={92} r={20} fill="none" stroke={K.action} stroke-width={3} />
        <Arrow from={[230, 98]} to={[200, 160]} bend={-0.3} w={5} />
      </Scene2>
    );
  },
  // İlmek baş yüksekliğinde, yolun üstünde; telin ucu kazığa bağlı
  'sf-yb-ilmek-yukseklik': () => (
    <Scene2 bg="outdoor" gy={180}>
      <path d="M0 214H320" stroke="#c9b68a" stroke-width={26} />
      <Stem pts={[[180, 214], [180, 120]]} w={5} c={C.stick} />
      <Stem pts={[[176, 124], [226, 124]]} w={4} c={C.stick} />
      <ellipse cx={200} cy={170} rx={14} ry={20} fill="none" stroke={K.out} stroke-width={4.4} />
      <ellipse cx={200} cy={170} rx={14} ry={20} fill="none" stroke="#b9c2cc" stroke-width={2.4} />
      <path d="M200 124V150" stroke="#b9c2cc" stroke-width={2.4} />
      <Rabbit x={120} y={220} s={1.1} />
      <path d="M150 168H186" stroke={K.action} stroke-width={2.4} stroke-dasharray="5 5" />
    </Scene2>
  ),
  // Huni: patikanın iki yanına dizilen dallar daralır; en dar yerde ilmek (kuş bakışı)
  'sf-yb-ilmek-huni': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#8fc163" />
      <path d="M0 120H320" stroke="#c9b68a" stroke-width={30} />
      {[[20, 50], [60, 70], [100, 90], [140, 104]].map(([sx, sy], i) => <g key={i}><Stem pts={[[sx, sy], [sx + 34, sy + 14]]} w={4} c={C.stick} /><Stem pts={[[sx, 240 - sy], [sx + 34, 226 - sy]]} w={4} c={C.stick} /></g>)}
      <ellipse cx={204} cy={120} rx={6} ry={16} fill="none" stroke={K.out} stroke-width={4.4} />
      <ellipse cx={204} cy={120} rx={6} ry={16} fill="none" stroke="#b9c2cc" stroke-width={2.4} />
      <Arrow from={[30, 120]} to={[150, 120]} w={5} />
    </Scene2>
  ),

  /* ───────── Düşen taş tuzağı ───────── */
  // 4 tetiği: dik direk, yemli yatay çubuk, eğik kaldıraç; çentikler vurgulu
  'sf-yb-tetik-dort': () => (
    <Scene2 bg="closeup">
      <path d="M0 222H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[
        { d: rrect(194, 116, 12, 108, 3), f: C.wood },
        { d: capsule([160, 158], 5.5, [252, 158], 5.5), f: '#b98a52' },
        { d: capsule([238, 82], 6, [164, 154], 6), f: '#c9965e' },
      ]} />
      <OG sh={[{ d: ell([240, 158], 10, 8), f: '#c9736a' }]} />
      <OG sh={[{ d: 'M24 222L248 75L238 59L12 206Z', f: '#9a958c' }, { d: 'M24 222L248 75L244 69L20 216Z', f: '#86817a', no: true }]} />
      <circle cx={200} cy={119} r={12} fill="none" stroke={K.action} stroke-width={3} />
      <circle cx={204} cy={158} r={12} fill="none" stroke={K.action} stroke-width={3} />
      <circle cx={164} cy={156} r={12} fill="none" stroke={K.action} stroke-width={3} />
    </Scene2>
  ),
  // Kurulu düşen taş: yassı taş eğik, tetiğe dayalı; yem tam altında; uzakta küçük hayvan
  'sf-yb-dusen-tas-kurulu': () => (
    <Scene2 bg="outdoor" gy={176}>
      <path d="M0 214H320" stroke="#c9b68a" stroke-width={26} />
      <Fig4Trap x={40} y={218} s={0.82} />
      <Rabbit x={290} y={222} s={0.6} flip />
    </Scene2>
  ),
  // Kurarken el taşın altına sokulmaz (yasak); yem uzun çubukla yerleştirilir (onay)
  'sf-yb-dusen-el-yasak': () => {
    const trap = (dx: number) => (
      <g>
        <OG sh={[{ d: rrect(dx + 76, 150, 6, 52, 2), f: C.wood }]} />
        <OG sh={[{ d: `M${dx + 16} 200L${dx + 34} 196L${dx + 120} 120L${dx + 136} 128L${dx + 124} 142L${dx + 44} 206Z`, f: '#9a958c' }]} />
        <path d={`M${dx + 10} 206H${dx + 146}`} stroke={K.out} stroke-width={1.5} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Panels />
        {trap(4)}
        <Hand x={146} y={196} a={-100} s={0.6} pose="open" side="R" arm={60} sleeve={HI.sleeve} skin={0} />
        <No x={84} y={170} r={42} />
        {trap(160)}
        <Stem pts={[[300, 120], [252, 168], [240, 192]]} w={4} c={C.stick} />
        <OG sh={[{ d: ell([236, 196], 7, 5), f: '#c9736a' }]} />
        <Hand x={302} y={150} a={-45} s={0.45} pose="fist" side="R" arm={40} sleeve={HI.sleeve} skin={0} />
        <Ok x={200} y={40} r={14} />
      </Scene2>
    );
  },

  /* ───────── Tuzak güvenliği ───────── */
  // Her tuzağın yanındaki ağaca renkli bez ve çentik; dibinde kurulu ilmek
  'sf-yb-tuzak-isaret': () => (
    <Scene2 bg="outdoor" gy={176}>
      <Trunk x={140} y={226} w={70} h={240} />
      <OG sh={[{ d: 'M106 90Q140 96 174 90L176 104Q140 110 104 104Z', f: '#d6336c' }, { d: 'M168 98Q186 120 182 144L172 142Q174 122 160 104Z', f: '#d6336c' }]} />
      <OG sh={[{ d: 'M120 140L134 132L134 152Z', f: '#e9d6b0' }]} />
      <ellipse cx={210} cy={200} rx={10} ry={14} fill="none" stroke={K.out} stroke-width={4} />
      <ellipse cx={210} cy={200} rx={10} ry={14} fill="none" stroke="#b9c2cc" stroke-width={2.2} />
      <Stem pts={[[196, 228], [196, 180], [230, 180]]} w={3} c={C.stick} />
      <Arrow from={[260, 60]} to={[186, 96]} w={5} />
      <Arrow from={[70, 170]} to={[118, 146]} w={5} />
    </Scene2>
  ),
  // Ölümcül tuzağa arkadan yaklaşın (onay); açık önünden yaklaşmak (çarpı)
  'sf-yb-tuzak-arkadan': () => (
    <Scene2 bg="outdoor" gy={176}>
      <OG sh={[{ d: rrect(196, 168, 6, 48, 2), f: C.wood }]} />
      <OG sh={[{ d: 'M120 216L136 210L240 140L256 148L244 160L150 222Z', f: '#9a958c' }]} />
      <Person {...CAST.izci} x={70} y={226} pose={{ ...POSE.walk, face: 'neutral' }} />
      <Ok x={70} y={40} r={14} />
      <path d="M310 200Q290 190 268 196" fill="none" stroke={K.danger} stroke-width={4} stroke-dasharray="7 6" stroke-linecap="round" />
      <Bad x={292} y={160} r={13} />
    </Scene2>
  ),

  /* ───────── Küçük memeli temizleme ───────── */
  // Eldiven ve yüz örtüsü: ağız ve burun bezle örtülü, eldivenli eller
  'sf-yb-eldiven-maske': () => {
    const p: PersonProps = { ...CAST.isleyen, x: 160, y: 78, ax: 'head', ay: 'head', s: 2.0, shadow: false, pose: { ...POSE.stand, armB: [118, -84], armF: [62, -96], handB: 'none', handF: 'none', face: 'neutral' } };
    const r = rig(p);
    const hs = 0.62;
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <Person {...p} />
        <OG sh={[{ d: smooth([[r.mouth[0] - 24, r.mouth[1] - 12], [r.mouth[0], r.mouth[1] - 16], [r.mouth[0] + 24, r.mouth[1] - 12], [r.mouth[0] + 22, r.mouth[1] + 12], [r.mouth[0], r.mouth[1] + 20], [r.mouth[0] - 22, r.mouth[1] + 12]], true), f: '#f4f1ea' }]} />
        <Glove>
          <Hand x={r.wristB[0]} y={r.wristB[1]} a={-6} s={hs} pose="open" side="L" view="palm" arm={4} skin={2} />
          <Hand x={r.wristF[0]} y={r.wristF[1]} a={6} s={hs} pose="open" side="R" view="palm" arm={4} skin={2} />
        </Glove>
        <Arrow from={[300, 40]} to={[r.mouth[0] + 34, r.mouth[1] - 6]} w={5} />
      </Scene2>
    );
  },
  // Deri boğazdan kuyruğa yarılır; bıçak ucu deri altında yukarı dönük
  'sf-yb-tavsan-deri-yarma': () => {
    const c = C.rabbit;
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <OG sh={[{ d: rrect(20, 30, 280, 190, 14), f: '#a7a59c' }]} />
        <OG sh={[
          { d: capsule([86, 110], 7, [30, 84], 10), f: c },
          { d: capsule([86, 132], 7, [30, 158], 10), f: c },
          { d: capsule([126, 98], 7, [114, 72], 6), f: c },
          { d: capsule([126, 144], 7, [114, 170], 6), f: c },
          { d: capsule([206, 98], 10, [262, 72], 7), f: c },
          { d: capsule([206, 144], 10, [262, 170], 7), f: c },
          { d: ell([166, 121], 62, 38), f: c },
          { d: ell([162, 121], 48, 26), f: '#e6d6bc' },
          { d: circ([94, 121], 24), f: c },
          { d: circ([234, 121], 9), f: '#f4efe6' },
        ]} />
        <path d="M74 104L40 90M74 138L40 152" stroke="#e8a8a0" stroke-width={5} stroke-linecap="round" />
        <circle cx={74} cy={121} r={3.5} fill="#c96a6a" />
        <path d="M100 121H224" stroke={K.action} stroke-width={3.4} stroke-dasharray="8 6" stroke-linecap="round" />
        <Arrow from={[116, 196]} to={[220, 196]} w={5} />
      </Scene2>
    );
  },
  // Karaciğer kontrolü: düz, parlak koyu kırmızı (onay) | beyaz-sarı noktalı (çarpı)
  'sf-yb-karaciger-kontrol': () => (
    <Scene2 bg="closeup">
      <Panels />
      <Liver x={84} y={124} s={1.15} />
      <Liver x={236} y={124} s={1.15} spots />
      <Ok x={40} y={40} r={15} />
      <Bad x={196} y={40} r={15} />
    </Scene2>
  ),

  /* ───────── Kuş temizleme ───────── */
  // Fokurdamayan ama buharı tüten suya kuş kısa süre batırılır; köşede tüy kolayca çıkıyor
  'sf-yb-kus-haslama': () => {
    const h = { x: 144, y: 20, a: 180, s: 0.8, pose: 'hold' as const, side: 'R' as const, grip: 28 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: capsule([134, 98], 2.8, [g[0] - 3, g[1] - 4], 2.4), f: '#e0a040' }, { d: capsule([146, 98], 2.8, [g[0] + 3, g[1] - 4], 2.4), f: '#e0a040' }]} />
        <Pot x={140} y={226} s={2.6} boil={false} />
        <Bird x={140} y={140} s={1.25} a={90} legs={false} />
        <g transform={tr(140, 226, 2.6)}>
          <OG ow={OW / 2.6} sh={[
            { d: 'M-21 -28A21 4.5 0 0 0 21 -28L19 -3Q19 0 16 0H-16Q-19 0 -19 -3Z', f: '#8e99a6' },
            { d: 'M10 -26.5L21 -28L19 -3Q19 0 16 0H8Z', f: shade('#8e99a6', 0.14), no: true },
          ]} />
          <path d="M-20 -28A20 3.8 0 0 0 20 -28Z" fill={K.water} opacity={0.9} />
        </g>
        <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.9}>
          <path d="M84 130c-5 -6 5 -10 0 -18M200 130c-5 -6 5 -10 0 -18" />
        </g>
        <Hand {...h} arm={60} sleeve={HW.sleeve} skin={2} />
        <Arrow from={[70, 40]} to={[70, 100]} w={5} />
        <g>
          <rect x={232} y={14} width={78} height={80} rx={8} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
          <OG sh={[{ d: smooth([[254, 70], [270, 50], [292, 40], [282, 60]], true), f: '#8a6a4a' }, { d: 'M256 70L294 38', st: K.out, sw: 1.4 }]} />
          <Ok x={300} y={24} r={9} />
        </g>
      </Scene2>
    );
  },
  // Kalan ince tüyler: yolunmuş kuş alevin üstünde kısa süre gezdirilir
  'sf-yb-kus-alev': () => (
    <Scene2 bg="closeup">
      <Campfire x={160} y={226} s={2} />
      <OG sh={[{ d: capsule([110, 116], 2.6, [60, 90], 2.2), f: '#e0a040' }, { d: capsule([116, 122], 2.6, [64, 98], 2.2), f: '#e0a040' }]} />
      <Bird x={160} y={110} s={1.5} plucked legs={false} a={-10} />
      <Hand x={20} y={130} a={60} s={0.7} pose="fist" side="R" arm={60} sleeve={HW.sleeve} skin={2} />
      <Arrow from={[110, 36]} to={[230, 36]} w={5} />
    </Scene2>
  ),
  // Safra kesesi: karaciğere yapışık yeşil kese; çevresinden geniş kesilir, delinmez
  'sf-yb-safra-kesesi': () => (
    <Scene2 bg="closeup">
      <Liver x={150} y={120} s={2.2} gall />
      <circle cx={208} cy={160} r={42} fill="none" stroke={K.action} stroke-width={4} />
      <path d="M208 160m-54 0a54 54 0 1 0 108 0a54 54 0 1 0 -108 0" fill="none" stroke={K.action} stroke-width={2.6} stroke-dasharray="7 6" />
      <Knife x={300} y={230} a={-130} s={0.9} />
    </Scene2>
  ),

  /* ───────── Balık temizleme ───────── */
  // Taze balık: parlak göz, kırmızı solungaç (onay) | çökük göz, soluk solungaç, parmak izi çukuru (çarpı)
  'sf-yb-balik-bozulma': () => (
    <Scene2 bg="closeup">
      <Panels split={160} />
      <Fish x={88} y={130} s={1} />
      <OG sh={[{ d: 'M108 118Q102 130 108 142L113 130Z', f: '#d84a4a' }]} />
      <Fish x={240} y={130} s={1} stale />
      <OG sh={[{ d: 'M260 118Q254 130 260 142L265 130Z', f: '#c9a8a0' }]} />
      <ellipse cx={226} cy={134} rx={6} ry={4.5} fill="#9aa09a" stroke={K.out} stroke-width={1} />
      <Ok x={40} y={40} r={15} />
      <Bad x={196} y={40} r={15} />
    </Scene2>
  ),
  // Karın: kuyruk altındaki delikten başa doğru yarılır
  'sf-yb-balik-karin': () => (
    <Scene2 bg="closeup">
      <Fish x={160} y={110} s={2.5} a={0} />
      <path d="M100 148Q150 162 214 146" fill="none" stroke={K.action} stroke-width={3.4} stroke-dasharray="8 6" stroke-linecap="round" />
      <Arrow from={[96, 200]} to={[212, 200]} w={5} />
    </Scene2>
  ),
  // Fileto: solungaç arkasından omurgaya kadar kesilir, bıçak omurga boyunca kuyruğa kayar
  'sf-yb-balik-fileto': () => (
    <Scene2 bg="closeup">
      <Fish x={160} y={124} s={2.5} flip />
      <path d="M132 74V122H226" fill="none" stroke={K.action} stroke-width={3.4} stroke-dasharray="8 6" stroke-linecap="round" />
      <Arrow from={[130, 200]} to={[230, 200]} w={5} />
    </Scene2>
  ),

  /* ───────── İç organ ───────── */
  // Kist: içi sıvı dolu keseli karaciğer atılır; köpeğe verilmez
  'sf-yb-organ-kist': () => (
    <Scene2 bg="closeup">
      <Liver x={130} y={124} s={2} cysts />
      <Bad x={240} y={56} r={16} />
      <g>
        <rect x={222} y={140} width={88} height={88} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        <Gx x={256} y={212} s={0.78} sh={[
          { d: capsule([-20, -18], 4, [-20, 0], 3.5), f: '#a8784a' },
          { d: capsule([14, -18], 4, [14, 0], 3.5), f: '#a8784a' },
          { d: capsule([-26, -28], 2.5, [-38, -42], 2), f: '#c99a62' },
          { d: ell([0, -24], 28, 12), f: '#c99a62' },
          { d: capsule([-12, -18], 4, [-12, 0], 3.5), f: '#c99a62' },
          { d: capsule([22, -18], 4, [22, 0], 3.5), f: '#c99a62' },
          { d: circ([30, -36], 11), f: '#c99a62' },
          { d: capsule([34, -32], 6, [48, -28], 4.5), f: '#c99a62' },
          { d: smooth([[22, -46], [30, -48], [28, -30], [21, -34]], true), f: '#8a6a44' },
        ]} />
        <circle cx={256 + 33 * 0.78} cy={212 - 39 * 0.78} r={1.8} fill={K.out} />
        <OG sh={[{ d: ell([298, 206], 7, 5), f: C.liver }]} />
        <No x={266} y={184} r={36} />
      </g>
    </Scene2>
  ),

  /* ───────── Et hastalıkları ───────── */
  // Ölü bulunan hayvan açılmaz, yenmez
  'sf-yb-sarbon-les': () => (
    <Scene2 bg="outdoor" gy={150}>
      <DeadSheep x={186} y={212} s={1.35} />
      <Bad x={268} y={60} r={20} />
    </Scene2>
  ),
  // Et en kalın yerinden kesilir: içi pembe değil; iç sıcaklık 71 °C
  'sf-yb-et-pisirme-kontrol': () => (
    <Scene2 bg="closeup">
      <OG sh={[
        { d: smooth([[40, 150], [80, 110], [180, 104], [230, 130], [220, 180], [120, 196], [50, 186]], true), f: '#6a3e26' },
        { d: smooth([[130, 108], [180, 104], [230, 130], [222, 176], [168, 184], [140, 150]], true), f: '#a88a76' },
      ]} />
      <Thermo x={186} y={140} s={1.1} a={20} />
      <Label x={250} y={40} text="71 °C" />
      <Ok x={60} y={60} r={15} />
    </Scene2>
  ),
  // Tuzlama, kurutma, tütsüleme trişini öldürmez (çarpı); iyice kaynatmak (onay)
  'sf-yb-trisin-yasak': () => {
    const box = (x: number, y: number, kid: JSX.Element, ok = false) => (
      <g>
        <rect x={x} y={y} width={140} height={100} rx={10} fill="#f7f4ec" stroke={K.out} stroke-width={1.5} />
        {kid}
        {ok ? <Ok x={x + 124} y={y + 16} r={11} /> : <Bad x={x + 124} y={y + 16} r={11} />}
      </g>
    );
    const meat = (x: number, y: number, w = 60, h = 26) => <OG sh={[{ d: rrect(x - w / 2, y - h / 2, w, h, 8), f: '#b0543e' }, { d: `M${x - w / 2 + 6} ${y - 2}H${x + w / 2 - 6}`, st: '#e8c4b0', sw: 2 }]} />;
    return (
      <Scene2 bg="closeup">
        {box(14, 14, <g>{meat(70, 76)}{[[56, 56], [70, 52], [84, 58], [62, 64], [78, 66]].map(([sx, sy], i) => <rect key={i} x={sx} y={sy} width={4} height={4} fill="#fff" stroke={K.out} stroke-width={0.8} />)}</g>)}
        {box(166, 14, <g><path d="M176 36H300" stroke={K.out} stroke-width={2} />{[200, 236, 272].map((x) => <OG key={x} sh={[{ d: rrect(x - 7, 38, 14, 56, 5), f: '#8a3a2a' }]} />)}</g>)}
        {box(14, 126, <g><Smoke x={30} y={150} w={100} h={30} kind="cloud" op={0.7} />{meat(70, 200, 50, 22)}</g>)}
        {box(166, 126, <g><Campfire x={236} y={222} s={0.9} /><Pot x={236} y={206} s={1.1} /></g>, true)}
      </Scene2>
    );
  },

  /* ───────── Kategori kapakları ───────── */
  'sf-yb-kapak-yabani': () => {
    const pick: P = [236, 150];
    const p: PersonProps = { ...CAST.toplayici, x: 166, y: 224, pose: { ...POSE.bend, spine: -50, armF: { to: pick }, armB: { to: [190, 170] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={52} y={198} s={1.2} />
        <Nettle x={250} y={222} h={90} s={1} />
        <Person {...p} />
        <OG sh={[{ d: 'M180 176H214L208 204H186Z', f: '#c9a05a' }, { d: 'M184 176Q197 156 210 176', st: K.out, sw: 2 }]} />
        {[[66, 214], [80, 220], [96, 212]].map(([ax, ay], i) => <Acorn key={i} x={ax} y={ay} s={0.6} a={i * 50} />)}
      </Scene2>
    );
  },
  'sf-yb-kapak-balik': () => {
    const grip: P = [150, 140];
    const tip: P = [276, 70];
    return (
      <Scene2 bg="outdoor" gy={186}>
        <Water x={150} y={180} w={180} h={70} />
        <OG sh={[{ d: 'M0 186H160Q170 210 162 240H0Z', f: K.grass }]} />
        <Person {...CAST.balikci} x={96} y={222} pose={{ ...POSE.kneelOne, armF: { to: grip }, armB: { to: [grip[0] - 16, grip[1] + 10] }, face: 'neutral' }} />
        <path d={smooth([[grip[0] - 24, grip[1] + 18], grip, [220, 84], tip])} fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" />
        <path d={smooth([[grip[0] - 24, grip[1] + 18], grip, [220, 84], tip])} fill="none" stroke="#c9b26a" stroke-width={4} stroke-linecap="round" />
        <Rope pts={[tip, [280, 130], [282, 186]]} w={1.6} c="#f4f1ea" />
        <Bobber x={282} y={184} s={1} />
        <Fish x={230} y={216} s={0.4} />
      </Scene2>
    );
  },
  'sf-yb-kapak-iz': () => {
    const h0 = { x: 0, y: 0, a: -150, s: 1, pose: 'point' as const, side: 'R' as const };
    const q = handPoint(h0, 'tip');
    const hp = { ...h0, x: 150 - q[0], y: 150 - q[1] };
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#8a7055" />
        <CanidTrack x={90} y={190} s={1.6} narrow={0.8} />
        <CanidTrack x={120} y={110} s={1.6} narrow={0.8} />
        <Pad x={210} y={180} rx={14} ry={5} a={-90} />
        <Pad x={230} y={180} rx={14} ry={5} a={-90} />
        <Pad x={216} y={214} rx={4.5} ry={4} />
        <Pad x={226} y={226} rx={4.5} ry={4} />
        <Hand {...hp} arm={160} sleeve={HI.sleeve} skin={0} />
      </Scene2>
    );
  },
  'sf-yb-kapak-isleme': () => (
    <Scene2 bg="closeup">
      <GloveDefs />
      <OG sh={[{ d: rrect(10, 130, 300, 100, 14), f: '#a7a59c' }]} />
      <Fish x={120} y={170} s={1.4} />
      <Glove>
        <Hand x={56} y={236} a={30} s={0.8} pose="press" side="L" arm={20} skin={2} />
      </Glove>
      <Campfire x={256} y={130} s={1.2} />
      <Pot x={256} y={112} s={1.3} />
      <Label x={256} y={34} text="71 °C" />
    </Scene2>
  ),
  // __END__
};
