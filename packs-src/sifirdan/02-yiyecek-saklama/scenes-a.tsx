// Sıfırdan paketi sahneleri (a): et, balık, tütsü, botulizm, meyve-sebze, fermente + kategori kapakları.
// Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { JSX, ComponentChildren } from 'preact';
import {
  Scene2, Person, POSE, K, Arrow, Label, Hand, OG, OW, capsule, rrect, ell, circ, smooth, shade, tint,
  No, Ok, Bad, Timer, Waves, Campfire, Flame, Window, Rock, Water, Drop, Tree, Smoke, Shake,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═══════════════════════ OYUNCULAR (CAST) ═══════════════════════
 * Paket genelinde dört kişi. Bir rehberin bütün çizimlerinde aynı kişi görünür.
 * Yakın planda el: aynı ten (skin) ve aynı kol rengi (sleeve).
 *   HASAN  — et işleri: et güvenliği, et kurutma, pastırma 1-2, kavurma, sucuk.
 *            adam, ten 1, kısa siyah saç, bıyık, kiremit uzun kollu üst, koyu pantolon.
 *   RIZA   — balık ve tütsü: balık tuzlama, balık kurutma, tütsüleme, tütsü fırını.
 *            adam, ten 2, kısa koyu kahve saç, lacivert uzun kollu kazak, haki pantolon.
 *   AYSE   — meyve-sebze: meyve kurutma, sebze kurutma, pestil-köme, pekmez.
 *            kadın, ten 1, hardal yazma (başörtüsü), yeşil uzun kollu üst, gri-mor uzun etek.
 *   ZEYNEP — fermente ve güvenlik: botulizm, turşu, salamura, zeytin, sirke, tarhana.
 *            kadın, ten 0, koyu topuz saç, mor uzun kollu üst, koyu pantolon.
 */
export const HASAN = { who: 'man', skin: 1, hair: 'short', hairC: K.hair.black, mustache: true, top: '#c6574e', sleeve: 'long', bottom: 'pants', bottomC: K.pants.dark } as const;
export const RIZA = { who: 'man', skin: 2, hair: 'short', hairC: K.hair.dark, top: '#2f5d8a', sleeve: 'long', bottom: 'pants', bottomC: K.pants.khaki } as const;
export const AYSE = { who: 'woman', skin: 1, hair: 'scarf', hairC: '#d9a13a', top: '#6c9c5a', sleeve: 'long', bottom: 'longskirt', bottomC: '#5b5f78' } as const;
export const ZEYNEP = { who: 'woman', skin: 0, hair: 'bun', hairC: K.hair.dark, top: '#8f6fc2', sleeve: 'long', bottom: 'pants', bottomC: K.pants.dark } as const;
/** Yakın plan eller: { skin, sleeve } */
const EL = {
  HASAN: { skin: 1, sleeve: HASAN.top },
  RIZA: { skin: 2, sleeve: RIZA.top },
  AYSE: { skin: 1, sleeve: AYSE.top },
  ZEYNEP: { skin: 0, sleeve: ZEYNEP.top },
};
/** Rehber → oyuncu */
export const CAST = {
  'sf-ys-et-guvenligi': HASAN, 'sf-ys-et-kurutma': HASAN, 'sf-ys-pastirma-1': HASAN, 'sf-ys-pastirma-2': HASAN,
  'sf-ys-kavurma': HASAN, 'sf-ys-sucuk': HASAN,
  'sf-ys-balik-tuzlama': RIZA, 'sf-ys-balik-kurutma': RIZA, 'sf-ys-tutsuleme': RIZA, 'sf-ys-tutsu-firini': RIZA,
  'sf-ys-meyve-kurutma': AYSE, 'sf-ys-sebze-kurutma': AYSE, 'sf-ys-pestil-kome': AYSE, 'sf-ys-pekmez': AYSE,
  'sf-ys-botulizm': ZEYNEP, 'sf-ys-tursu': ZEYNEP, 'sf-ys-salamura': ZEYNEP, 'sf-ys-zeytin': ZEYNEP,
  'sf-ys-sirke': ZEYNEP, 'sf-ys-tarhana': ZEYNEP,
};

/* ═══════════════════════ MALZEME RENKLERİ (paket geneli) ═══════════════════════ */
export const MAT = {
  meat: '#c8473e', // çiğ kırmızı et
  meatRaw: '#e98a84', // çiğ et içi (pembe)
  cooked: '#a07d68', // pişmiş et içi (gri-kahve)
  crust: '#7a4a34', // kızarmış dış yüz / kavurma
  fat: '#f4ead2', // iç yağı, kuyruk yağı, donmuş yağ
  pastirma: '#8e2a24', // kurumuş pastırma eti
  cemen: '#b8502c', // çemen
  salt: '#f7f6f2', // tuz
  board: '#dcae74', // kesme tahtası
  wood: K.wood, // odun, tahta
  clay: '#b8693f', // toprak küp, kil
  glaze: '#7c4a2c', // sırlı küp
  iron: '#4d525e', // demir kazan, tava, soba
  copper: '#c27a48', // kalaylı bakır kazan
  glass: '#d8eef4', // cam kavanoz
  brine: '#cfe7e2', // salamura (tuzlu su)
  water: K.water,
  oil: '#e6c04a', // zeytinyağı
  rope: '#c7a26a', // ip, sicim
  tul: '#ffffff', // tül, tülbent
  fish: '#8ea6bb', // balık sırtı
  fishBelly: '#e6ebef', // balık karnı
  sira: '#6b2141', // üzüm/dut şırası
  pekmez: '#4a1a16', // pekmez
  dough: '#e2b071', // tarhana hamuru
  ember: '#e8562a', // köz
  cloth: K.cloth, // bez
  stone: K.rock, // taş
};

/* ═══════════════════════ YARDIMCILAR ═══════════════════════ */
const G = ({ x, y, s = 1, a = 0, children }: { x: number; y: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${x} ${y})${a ? ` rotate(${a})` : ''}${s !== 1 ? ` scale(${s})` : ''}`}>{children}</g>
);
const O = ({ sh, s = 1 }: { sh: Sh[]; s?: number }) => <OG sh={sh} ow={OW / s} />;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
/** Sabit tohumlu sözde rastgele 0..1 */
const rnd = (i: number) => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
const ln = (pts: P[], c: string = K.out, w = 1.4): Sh => ({ d: 'M' + pts.map((p) => p.join(' ')).join('L'), st: c, sw: w });

/** Bıçak. x,y = sap ile ağzın birleştiği yer; a = ağzın yönü (0 = sağa). */
function Knife({ x, y, a = 0, s = 1, len = 70 }: { x: number; y: number; a?: number; s?: number; len?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <O s={s} sh={[
        { d: `M0 -6H${len - 12}Q${len} -6 ${len + 2} 2L0 3Z`, f: '#dfe4ea' },
        { d: `M0 0H${len - 4}`, st: '#b9c2cc', sw: 1.2 },
        { d: rrect(-34, -5.5, 34, 11, 4), f: '#5b3a28' },
        { d: circ([-24, 0], 1.6), f: '#d9c2a0', no: true },
        { d: circ([-12, 0], 1.6), f: '#d9c2a0', no: true },
      ]} />
    </G>
  );
}

/** Kesme tahtası (yukarıdan). x,y = sol üst */
function Board({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <O sh={[
      { d: rrect(x, y, w, h, 10), f: MAT.board },
      { d: rrect(x, y + h - 8, w, 8, 4), f: shade(MAT.board, 0.12), no: true },
      ln([[x + 14, y + 20], [x + w * 0.45, y + 22]], shade(MAT.board, 0.18), 1.2),
      ln([[x + w * 0.5, y + h - 26], [x + w - 16, y + h - 28]], shade(MAT.board, 0.18), 1.2),
    ]} />
  );
}

/** Asılı et parçası (kancalı). x,y = kancanın üst ucu */
function HangMeat({ x, y, s = 1, c = MAT.meat }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: 'M0 0V8Q0 14 -5 14', st: K.out, sw: 3.4 },
        { d: 'M0 0V8Q0 14 -5 14', st: K.metal, sw: 2 },
        { d: smooth([[-4, 12], [9, 13], [15, 28], [13, 50], [3, 62], [-10, 58], [-15, 40], [-12, 22]], true), f: c },
        { d: smooth([[-4, 12], [9, 13], [14, 24], [2, 22], [-12, 22]], true), f: MAT.fat },
        { d: smooth([[6, 30], [10, 44], [4, 54]]), st: tint(c, 0.4), sw: 2 },
        { d: smooth([[-8, 36], [-4, 46]]), st: shade(c, 0.25), sw: 1.6 },
      ]} />
    </G>
  );
}

/** Duvar termometresi. x,y = alt (hazne) merkezi */
function Thermo({ x, y, s = 1, lvl = 0.3 }: { x: number; y: number; s?: number; lvl?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: rrect(-9, -62, 18, 66, 8), f: '#fff' },
        { d: rrect(-3, -56, 6, 52, 3), f: '#eef2f5' },
        { d: rrect(-3, -4 - 46 * lvl, 6, 46 * lvl + 2, 2), f: K.danger, no: true },
        { d: circ([0, -2], 5.5), f: K.danger },
        ...range(5).map((i) => ln([[4, -14 - i * 9], [7, -14 - i * 9]], K.out, 1)),
      ]} />
    </G>
  );
}

/** Saplama termometre (kadranlı). x,y = şişin ucu; a = şişin yönü (90 = aşağı) */
function Probe({ x, y, a = 90, s = 1, len = 50 }: { x: number; y: number; a?: number; s?: number; len?: number }) {
  return (
    <G x={x} y={y} a={a - 90} s={s}>
      <O s={s} sh={[
        { d: rrect(-2, -len, 4, len, 2), f: '#c9d1da' },
        { d: circ([0, -len - 14], 15), f: '#e9edf1' },
        { d: circ([0, -len - 14], 11), f: '#fff' },
        ln([[0, -len - 14], [7, -len - 21]], K.danger, 2.2),
      ]} />
    </G>
  );
}

/** Yaban domuzu (yandan, sağa bakar). x,y = taban ortası */
function Boar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#5e4a3c';
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: capsule([-30, -22], 5, [-32, 0], 4), f: shade(c, 0.2) },
        { d: capsule([20, -22], 5, [18, 0], 4), f: shade(c, 0.2) },
        { d: smooth([[-46, -34], [-30, -58], [6, -62], [30, -54], [44, -40], [40, -22], [10, -16], [-30, -16], [-48, -22]], true), f: c },
        { d: smooth([[30, -56], [52, -48], [66, -34], [70, -26], [58, -22], [40, -24]], true), f: c },
        { d: ell([69, -29], 4.5, 6), f: '#c79a8a' },
        { d: smooth([[58, -27], [64, -38], [62, -30]]), f: '#fff', st: K.out, sw: 1.2 },
        { d: smooth([[30, -56], [36, -70], [42, -56]], true), f: shade(c, 0.15) },
        { d: circ([50, -44], 2), f: K.ink, no: true },
        { d: capsule([-22, -22], 5.5, [-20, 0], 4.2), f: c },
        { d: capsule([30, -24], 5.5, [32, 0], 4.2), f: c },
        { d: 'M-40 -40l-4 -8M-28 -54l-2 -9M-14 -58l0 -9M0 -60l2 -9M14 -58l3 -8', st: shade(c, 0.3), sw: 2.4 },
        { d: smooth([[-47, -30], [-56, -36], [-54, -28]]), st: K.out, sw: 2 },
      ]} />
    </G>
  );
}

/** Kısa saplı demir tava (yandan). x,y = taban ortası; içinde k: içerik */
function Pan({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ComponentChildren }) {
  return (
    <G x={x} y={y} s={s}>
      {children}
      <O s={s} sh={[
        { d: capsule([-40, -14], 3.4, [-80, -24], 4.4), f: '#3a3d45' },
        { d: 'M-42 -16H42L36 -2Q34 0 30 0H-30Q-34 0 -36 -2Z', f: MAT.iron },
        { d: 'M-42 -16H42', st: tint(MAT.iron, 0.3), sw: 2 },
      ]} />
    </G>
  );
}
/** Tavada et parçaları (tava içeriği). x,y = tavanın taban ortası */
function PanMeat({ x, y, s = 1, c = MAT.crust, n = 6 }: { x: number; y: number; s?: number; c?: string; n?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={range(n).map((i) => ({ d: ell([-30 + (i * 60) / (n - 1), -18 - (i % 2) * 4], 9, 6.5), f: i % 2 ? c : shade(c, 0.1) }))} />
    </G>
  );
}

/** Ikiye kesilmiş et parçası (kesit yüzü bize bakar). x,y = merkez */
function MeatCut({ x, y, s = 1, raw }: { x: number; y: number; s?: number; raw?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: smooth([[-44, 4], [-40, -20], [-10, -30], [26, -28], [44, -10], [42, 16], [14, 28], [-24, 26]], true), f: MAT.crust },
        { d: smooth([[-36, 4], [-32, -14], [-8, -22], [22, -20], [36, -6], [34, 12], [12, 20], [-20, 19]], true), f: raw ? MAT.cooked : MAT.cooked, no: true },
        ...(raw ? [{ d: smooth([[-20, 3], [-14, -10], [8, -12], [22, -2], [16, 10], [-6, 12]], true), f: MAT.meatRaw, no: true }] : []),
      ]} />
    </G>
  );
}

/** Odun sobası (yandan). x,y = taban ortası */
function WoodStove({ x, y, s = 1, pipe = 150 }: { x: number; y: number; s?: number; pipe?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: rrect(-6, -60 - pipe, 12, pipe, 2), f: shade(MAT.iron, 0.05) },
        { d: rrect(-28, -64, 56, 58, 5), f: MAT.iron },
        { d: rrect(-32, -68, 64, 8, 3), f: shade(MAT.iron, 0.2) },
        { d: rrect(-16, -48, 32, 24, 4), f: '#2d2f36' },
        { d: rrect(-12, -44, 24, 16, 3), f: K.fire, no: true },
        { d: 'M-8 -30c0-6 4-6 3-12c4 4 5 8 4 12M2 -30c0-5 3-6 2-10c3 3 4 6 3 10', f: K.fireCore, no: true },
        { d: capsule([-22, -6], 3, [-24, 0], 3), f: '#2d2f36' },
        { d: capsule([22, -6], 3, [24, 0], 3), f: '#2d2f36' },
      ]} />
    </G>
  );
}

/** Kuru et şeridi (asılı). x,y = üst ucu */
const strip = (x: number, y: number, h = 44, c = '#8a3328', w = 6): Sh[] => [
  { d: smooth([[x - w / 2, y], [x + w / 2, y], [x + w / 2 + 1, y + h * 0.5], [x + w / 2 - 1, y + h], [x - w / 2 + 1, y + h], [x - w / 2 - 1, y + h * 0.5]], true), f: c },
  { d: `M${x} ${y + 6}V${y + h - 6}`, st: tint(c, 0.25), sw: 1 },
];

/** Pastırma için büyük et kası (yukarıdan). x,y = merkez */
function MeatSlab({ x, y, s = 1, c = MAT.meat, slits = 0, salt = false }: { x: number; y: number; s?: number; c?: string; slits?: number; salt?: boolean }) {
  const outline = smooth([[-80, -10], [-66, -36], [-20, -44], [40, -40], [78, -24], [84, 6], [62, 34], [10, 42], [-50, 38], [-80, 20]], true);
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: outline, f: c },
        { d: smooth([[-60, -30], [-10, -36], [50, -30]]), st: tint(c, 0.35), sw: 2 },
        { d: smooth([[-50, 26], [0, 32], [56, 24]]), st: shade(c, 0.18), sw: 2 },
        ...range(slits).map((i) => {
          const cx = -48 + i * 24;
          return { d: `M${cx - 12} ${16}L${cx + 12} ${-16}`, st: salt ? '#fff' : shade(c, 0.5), sw: salt ? 6 : 4 } as Sh;
        }),
        ...range(slits).map((i) => {
          const cx = -48 + i * 24;
          return { d: `M${cx - 12} ${16}L${cx + 12} ${-16}`, st: salt ? '#e9e7e0' : '#5a1814', sw: salt ? 3.4 : 2 } as Sh;
        }),
      ]} />
      {salt && (
        <g fill={MAT.salt} stroke={shade(MAT.salt, 0.35)} stroke-width={0.6 / s}>
          {range(46).map((i) => {
            const px = -70 + ((i * 37) % 140);
            const py = -30 + ((i * 53) % 62);
            return <rect key={i} x={px} y={py} width={3.2} height={3.2} rx={0.6} transform={`rotate(${(i * 29) % 90} ${px} ${py})`} />;
          })}
        </g>
      )}
    </G>
  );
}

/** Düz taş (pres ağırlığı). x,y = taban ortası */
const flatStone = (x: number, y: number, w = 40, h = 20, c = MAT.stone): Sh[] => [
  { d: smooth([[x - w / 2, y], [x - w / 2 + 4, y - h * 0.7], [x - w * 0.1, y - h], [x + w * 0.3, y - h * 0.9], [x + w / 2, y - h * 0.4], [x + w / 2 - 2, y]], true), f: c },
  { d: smooth([[x - w * 0.2, y - h * 0.75], [x + w * 0.25, y - h * 0.7]]), st: tint(c, 0.4), sw: 1.6 },
];

/** Gölgelik saçak (üstte). y = saçak alt kenarı */
const eave = (y: number, x2 = 330): Sh[] => [
  { d: `M-10 0H${x2}V${y - 14}L-10 ${y + 4}Z`, f: '#9b4a32' },
  ...range(Math.ceil((x2 + 10) / 40)).map((i) => ({ d: `M${-10 + i * 40} ${y + 3 - i * 2}l14 -16`, st: shade('#9b4a32', 0.25), sw: 1.4 }) as Sh),
  { d: `M-10 ${y - 4}H${x2}V${y + 6}H-10Z`, f: '#6e4a32' },
];

/** Tül perde / tül örtü: yarı saydam beyaz, ince dikey kıvrımlar. x,y = sol üst */
function Tul({ x, y, w, h, op = 0.5 }: { x: number; y: number; w: number; h: number; op?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fff" opacity={op} />
      <g stroke="#fff" stroke-width={1} opacity={0.6}>
        {range(Math.floor(w / 22)).map((i) => <line key={i} x1={x + 11 + i * 22} y1={y} x2={x + 11 + i * 22} y2={y + h} />)}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.out} stroke-width={1.2} opacity={0.6} />
    </g>
  );
}


/** Balık (yandan, sağa bakar). x,y = gövde merkezi. Uzunluk ≈ 130·s.
 *  stale: bayat (donuk göz, solgun solungaç); smoked: tütsülenmiş altın-kahve; dried: kuru (koyu, büzük) */
function Fish({ x, y, s = 1, a = 0, flip, stale, smoked, dried, stripes = true }: { x: number; y: number; s?: number; a?: number; flip?: boolean; stale?: boolean; smoked?: boolean; dried?: boolean; stripes?: boolean }) {
  const back = smoked ? '#a8682c' : dried ? '#7d6a52' : stale ? '#8f9aa1' : '#3f6f9a';
  const belly = smoked ? '#d9a050' : dried ? '#c4b08a' : stale ? '#cfd3d2' : MAT.fishBelly;
  const body = smooth([[-50, 0], [-30, -13], [10, -17], [40, -12], [58, -3], [61, 2], [42, 10], [10, 15], [-30, 11]], true);
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${flip ? -s : s} ${s})`}>
      <O s={s} sh={[
        { d: 'M-46 0L-72 -18L-64 0L-72 18Z', f: shade(back, 0.08) },
        { d: 'M-4 -15L8 -27L16 -15Z', f: shade(back, 0.1) },
        { d: 'M-10 13L0 22L6 13Z', f: shade(belly, 0.1) },
        { d: body, f: belly },
        { d: smooth([[-50, 0], [-30, -13], [10, -17], [40, -12], [58, -3], [40, -1], [0, -2], [-30, -1]], true), f: back, no: true },
        ...(stripes && !smoked && !dried ? range(5).map((i) => ({ d: `M${-30 + i * 13} -2l8 -12`, st: shade(back, 0.35), sw: 2 }) as Sh) : []),
        { d: smooth([[38, -11], [33, 0], [38, 11]]), st: K.out, sw: 1.4 },
        ...(!smoked && !dried ? [{ d: smooth([[36, -7], [32, 0], [36, 8]]), st: stale ? '#b39a8c' : '#d23a3a', sw: 3 } as Sh] : []),
        { d: circ([48, -4], 5), f: stale ? '#c3c8cb' : '#fff' },
        ...(stale ? [] : [{ d: circ([48.5, -4], 3), f: K.ink, no: true } as Sh, { d: circ([47.4, -5.2], 1), f: '#fff', no: true } as Sh]),
        { d: 'M61 2L52 4', st: K.out, sw: 1.2 },
      ]} />
    </g>
  );
}

/** Köz yatağı. x,y = taban ortası, w genişlik */
function Embers({ x, y, w = 120, h = 18 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <O sh={[
      { d: smooth([[x - w / 2, y], [x - w * 0.4, y - h * 0.7], [x - w * 0.1, y - h], [x + w * 0.25, y - h * 0.9], [x + w / 2, y - h * 0.3], [x + w / 2, y]], true), f: '#3b3434' },
      ...range(Math.round(w / 18)).map((i) => ({ d: ell([x - w * 0.38 + (i * w * 0.76) / Math.max(1, Math.round(w / 18) - 1), y - h * 0.45 - (i % 2) * 3], 6, 3.5), f: i % 3 ? MAT.ember : K.fireCore, no: true }) as Sh),
    ]} />
  );
}

/** Kesit küp (toprak). x,y = taban ortası. Ön yüzde içini gösteren pencere: içerik win(x0,y0,w,h) ile verilir. */
function Crock({ x, y, s = 1, c = MAT.clay, children }: { x: number; y: number; s?: number; c?: string; children?: ComponentChildren }) {
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: smooth([[-34, -150], [-40, -132], [-62, -100], [-66, -50], [-48, -6], [0, 0], [48, -6], [66, -50], [62, -100], [40, -132], [34, -150]], false) + 'Z', f: c },
        { d: ell([0, -150], 36, 8), f: shade(c, 0.35) },
        { d: rrect(-40, -158, 80, 10, 4), f: tint(c, 0.12) },
        { d: smooth([[48, -110], [58, -60], [44, -14]]), st: shade(c, 0.2), sw: 6 },
      ]} />
      {children}
    </G>
  );
}

/** Cam kavanoz (yandan). x,y = taban ortası, w×h. İçerik children (yerel koordinatta, taban 0). lid: kapak türü */
function Jar({ x, y, s = 1, w = 80, h = 110, lid = 'metal', fill, level = 0.85, children }: { x: number; y: number; s?: number; w?: number; h?: number; lid?: 'metal' | 'cloth' | 'none' | 'bulge'; fill?: string; level?: number; children?: ComponentChildren }) {
  const r = 10;
  const body = `M${-w / 2} ${-h + 14}Q${-w / 2} ${-h + 6} ${-w / 2 + 8} ${-h + 4}H${w / 2 - 8}Q${w / 2} ${-h + 6} ${w / 2} ${-h + 14}V${-r}Q${w / 2} 0 ${w / 2 - r} 0H${-w / 2 + r}Q${-w / 2} 0 ${-w / 2} ${-r}Z`;
  const ly = -(h - 8) * level;
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[{ d: body, f: MAT.glass }]} />
      {fill && <path d={`M${-w / 2 + 1.5} ${ly}H${w / 2 - 1.5}V${-r}Q${w / 2 - 1.5} -1.5 ${w / 2 - r} -1.5H${-w / 2 + r}Q${-w / 2 + 1.5} -1.5 ${-w / 2 + 1.5} ${-r}Z`} fill={fill} opacity={0.85} />}
      {children}
      <O s={s} sh={[
        { d: body, st: K.out, sw: 3 },
        { d: `M${-w / 2 + 8} ${-h + 22}V${-18}`, st: '#fff', sw: 3 },
        ...(lid === 'metal' ? [{ d: rrect(-w / 2 + 4, -h - 8, w - 8, 13, 3), f: '#c9a227' } as Sh] : []),
        ...(lid === 'bulge' ? [{ d: `M${-w / 2 + 4} ${-h + 5}Q0 ${-h - 34} ${w / 2 - 4} ${-h + 5}Z`, f: '#c9a227' } as Sh] : []),
        ...(lid === 'cloth' ? [
          { d: `M${-w / 2 - 6} ${-h + 18}Q${-w / 2 - 2} ${-h - 8} 0 ${-h - 10}Q${w / 2 + 2} ${-h - 8} ${w / 2 + 6} ${-h + 18}L${w / 2 - 2} ${-h + 12}H${-w / 2 + 2}Z`, f: '#f1ead8' } as Sh,
          { d: `M${-w / 2 - 1} ${-h + 10}H${w / 2 + 1}`, st: K.out, sw: 3.4 } as Sh,
          { d: `M${-w / 2 - 1} ${-h + 10}H${w / 2 + 1}`, st: MAT.rope, sw: 2 } as Sh,
        ] : []),
      ]} />
    </G>
  );
}

/** Tütsü varili (kesit pencereli). x,y = taban ortası */
const Barrel = ({ x, y, w = 70, h = 110 }: { x: number; y: number; w?: number; h?: number }) => (
  <O sh={[
    { d: rrect(x - w / 2, y - h, w, h, 6), f: '#6f7f8c' },
    { d: rrect(x - w / 2 + 8, y - h + 10, w - 16, h - 46, 4), f: '#2e2a2a' },
    ln([[x - w / 2, y - h + 6], [x + w / 2, y - h + 6]], shade('#6f7f8c', 0.3), 2),
    ln([[x - w / 2, y - 30], [x + w / 2, y - 30]], shade('#6f7f8c', 0.3), 2),
  ]} />
);

/** Odun kütüğü (kesit yüzü bize bakar). x,y = merkez */
const log = (x: number, y: number, r = 14, bark = '#6b4a33', core = '#e3c08c', resin = false): Sh[] => [
  { d: circ([x, y], r), f: bark },
  { d: circ([x, y], r - 3.5), f: core },
  { d: circ([x, y], (r - 3.5) * 0.55), st: shade(core, 0.25), sw: 1.2 },
  ...(resin ? [{ d: `M${x + r * 0.2} ${y + r - 2}q2 6 0 9q-3 -3 0 -9z`, f: '#f0b429' } as Sh] : []),
];


/** Büyük tencere (yan). x,y = taban ortası. top: yüzey rengi; bits: yüzeydeki parçalar; boil: buhar */
function BigPot({ x, y, s = 1, top = '#d2b28e', bits = [] as Sh[], boil = true, c = '#8e99a6' }: { x: number; y: number; s?: number; top?: string; bits?: Sh[]; boil?: boolean; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <O s={s} sh={[
        { d: capsule([-27, -24], 3, [-20, -24], 3), f: shade(c, 0.2) },
        { d: capsule([20, -24], 3, [27, -24], 3), f: shade(c, 0.2) },
        { d: 'M-21 -28H21L19 -3Q19 0 16 0H-16Q-19 0 -19 -3Z', f: c },
        { d: 'M10 -28H21L19 -3Q19 0 16 0H8Z', f: shade(c, 0.14), no: true },
        { d: ell([0, -28], 21, 4.5), f: top },
        ...bits,
      ]} />
      {boil && (
        <g fill="none" stroke="#fff" stroke-width={1.1} stroke-linecap="round">
          <path d="M-8 -36c-4-5 4-8 0-14M3 -38c-4-5 4-8 0-14M13 -36c-4-5 4-8 0-14" />
        </g>
      )}
    </G>
  );
}

/** Geniş ocak kazanı (yan). x,y = kazanın alt ucu. w yarı genişlik. içerik rengi top, parçalar bits (sahne koordinatında) */
const cauldron = (x: number, y: number, w: number, top: string, c = MAT.iron): Sh[] => [
  { d: `M${x - w} ${y - w * 0.62}H${x + w}Q${x + w * 0.95} ${y + 2} ${x} ${y + 6}Q${x - w * 0.95} ${y + 2} ${x - w} ${y - w * 0.62}Z`, f: c },
  { d: ell([x, y - w * 0.62], w, w * 0.17), f: shade(c, 0.3) },
  { d: ell([x, y - w * 0.6], w * 0.89, w * 0.12), f: top },
  { d: capsule([x - w - 10, y - w * 0.6], 4, [x - w, y - w * 0.6], 4), f: '#3a3d45' },
  { d: capsule([x + w, y - w * 0.6], 4, [x + w + 10, y - w * 0.6], 4), f: '#3a3d45' },
];

/** Kırmızı uyarı üçgeni. x,y = merkez */
const WarnTri = ({ x, y, r = 22 }: { x: number; y: number; r?: number }) => (
  <g>
    <path d={`M${x} ${y - r}L${x + r * 1.05} ${y + r * 0.8}H${x - r * 1.05}Z`} fill="#fff" stroke="#fff" stroke-width={6} stroke-linejoin="round" />
    <path d={`M${x} ${y - r}L${x + r * 1.05} ${y + r * 0.8}H${x - r * 1.05}Z`} fill={K.danger} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
    <rect x={x - 2.4} y={y - r * 0.45} width={4.8} height={r * 0.7} rx={2} fill="#fff" />
    <circle cx={x} cy={y + r * 0.5} r={2.8} fill="#fff" />
  </g>
);

/** Kerevet: yerden yüksek ayaklı tahta sergi (yan-üst görünüş). x,y = sol ön ayağın tabanı */
const kerevet = (x: number, y: number, w: number, legH = 46, depth = 26): Sh[] => [
  { d: rrect(x + 4, y - legH, 7, legH, 2), f: shade(MAT.wood, 0.1) },
  { d: rrect(x + w - 11, y - legH, 7, legH, 2), f: shade(MAT.wood, 0.1) },
  { d: `M${x} ${y - legH}L${x + 14} ${y - legH - depth}H${x + w + 14}L${x + w} ${y - legH}Z`, f: '#d6b07a' },
  ...range(5).map((i) => ({ d: `M${x + 4 + (i * depth) / 5 * 0.55} ${y - legH - (i * depth) / 5}H${x + w + 4 + (i * depth) / 5 * 0.55}`, st: shade('#d6b07a', 0.2), sw: 1 }) as Sh),
  { d: rrect(x - 2, y - legH, w + 4, 7, 2), f: MAT.wood },
];

/** Yarım kayısı (yukarıdan). */
const apricot = (x: number, y: number, r = 9): Sh[] => [
  { d: ell([x, y], r, r * 0.8), f: '#f29a2e' },
  { d: ell([x, y], r * 0.55, r * 0.42), f: '#f8c160', no: true },
];
/** Elma halkası */
const appleRing = (x: number, y: number, r = 11): Sh[] => [
  { d: circ([x, y], r), f: '#f3e3b0' },
  { d: circ([x, y], r), st: '#c9412f', sw: 2.4 },
  { d: circ([x, y], r * 0.32), f: shade('#f3e3b0', 0.25) },
];
/** Kuru incir */
const fig = (x: number, y: number, r = 9): Sh[] => [
  { d: smooth([[x, y - r * 1.3], [x + r * 0.9, y], [x, y + r], [x - r * 0.9, y]], true), f: '#7a4e5e' },
];
/** Kırmızı biber (aşağı sarkan). x,y = sap */
const pepper = (x: number, y: number, a = 0, l = 30, c = '#d2382f'): Sh[] => {
  const r = (a * Math.PI) / 180, dx = -Math.sin(r), dy = Math.cos(r);
  return [
    { d: capsule([x, y], 1.6, [x + dx * 6, y + dy * 6], 1.6), f: K.leaf },
    { d: capsule([x + dx * 5, y + dy * 5], 6, [x + dx * l, y + dy * l], 1.5), f: c },
  ];
};
/** Bamya (aşağı sarkan) */
const okra = (x: number, y: number, l = 24): Sh[] => [{ d: capsule([x, y + 3], 4.6, [x + 1, y + l], 1.4), f: '#6f9a3c' }];
/** Domates yarısı (yukarıdan, kesik yüz yukarı) */
const tomatoHalf = (x: number, y: number, r = 16, rot = 0): Sh[] => [
  { d: circ([x, y], r), f: '#d8372d' },
  { d: circ([x, y], r * 0.84), f: '#ef6a4e', no: true },
  ...range(4).map((i) => {
    const an = rot + i * 1.5708 + 0.785;
    return { d: ell([x + Math.cos(an) * r * 0.45, y + Math.sin(an) * r * 0.45], r * 0.24, r * 0.24), f: '#f5b25a', no: true } as Sh;
  }),
  ...range(4).map((i) => {
    const an = rot + i * 1.5708;
    return { d: `M${x} ${y}L${x + Math.cos(an) * r * 0.8} ${y + Math.sin(an) * r * 0.8}`, st: '#d84a35', sw: 2 } as Sh;
  }),
];

/** Ceviz içi */
const walnut = (x: number, y: number, r = 7, c = '#c7965a'): Sh[] => [
  { d: smooth([[x - r, y], [x - r * 0.6, y - r * 0.9], [x + r * 0.6, y - r * 0.9], [x + r, y], [x + r * 0.6, y + r * 0.9], [x - r * 0.6, y + r * 0.9]], true), f: c },
  { d: `M${x} ${y - r * 0.8}V${y + r * 0.8}`, st: shade(c, 0.3), sw: 1 },
];
/** Köme dizisi (asılı). x,y = üst */
const kome = (x: number, y: number, n = 6, c = '#5a2a22'): Sh[] => [
  ln([[x, y], [x, y + 8]], K.out, 1.6),
  { d: smooth([[x - 6, y + 8], [x + 6, y + 8], ...range(n).flatMap((i) => [[x + 8, y + 16 + i * 14], [x + 6, y + 22 + i * 14]] as P[]), [x, y + 20 + n * 14], ...range(n).reverse().flatMap((i) => [[x - 6, y + 22 + i * 14], [x - 8, y + 16 + i * 14]] as P[])], true), f: c },
];


/** Salatalık (yandan). x,y = merkez, l uzunluk */
const cucumber = (x: number, y: number, l = 150, r = 16, a = 0): Sh[] => {
  const rad = (a * Math.PI) / 180, dx = Math.cos(rad) * l / 2, dy = Math.sin(rad) * l / 2;
  return [
    { d: capsule([x - dx, y - dy], r, [x + dx, y + dy], r * 0.9), f: '#4f8a3a' },
    { d: capsule([x - dx * 0.8, y - dy * 0.8 - r * 0.45], 2.4, [x + dx * 0.8, y + dy * 0.8 - r * 0.45], 2), f: '#7fb35e', no: true },
    ...range(6).map((i) => ({ d: circ([x - dx * 0.7 + (dx * 1.4 * i) / 5, y - dy * 0.7 + (dy * 1.4 * i) / 5 + (i % 2 ? 4 : -2)], 1.6), f: '#2f5a25', no: true }) as Sh),
  ];
};
/** Asma yaprağı rulosu (yan). x,y = alt uç; h boy */
const leafRoll = (x: number, y: number, h = 40, r = 7): Sh[] => [
  { d: capsule([x, y - r], r, [x, y - h + r], r), f: '#6f8f3a' },
  { d: `M${x - r + 2} ${y - h * 0.35}L${x + r - 2} ${y - h * 0.55}M${x - r + 2} ${y - h * 0.7}L${x + r - 2} ${y - h * 0.9}`, st: shade('#6f8f3a', 0.3), sw: 1.2 },
];
/** Yeşil/siyah zeytin */
const olive = (x: number, y: number, r = 8, c = '#7c9a3a', slit = false, a = -20): Sh[] => [
  { d: ell([0, 0], r * 1.25, r), t: `translate(${x} ${y}) rotate(${a})`, f: c },
  { d: ell([-r * 0.35, -r * 0.35], r * 0.35, r * 0.2), t: `translate(${x} ${y}) rotate(${a})`, f: tint(c, 0.4), no: true },
  ...(slit ? [{ d: `M${-r * 0.7} ${r * 0.1}L${r * 0.7} ${r * 0.1}`, t: `translate(${x} ${y}) rotate(${a})`, st: shade(c, 0.45), sw: 1.6 } as Sh] : []),
];
/** Ezilmiş üzüm tanesi */
const grape = (x: number, y: number, r = 6, crushed = false): Sh[] => crushed
  ? [{ d: smooth([[x - r, y], [x - r * 0.4, y - r * 0.7], [x + r * 0.6, y - r * 0.5], [x + r, y + r * 0.2], [x, y + r * 0.6]], true), f: '#6a2a52' }]
  : [{ d: circ([x, y], r), f: '#6a2a52' }, { d: circ([x - r * 0.35, y - r * 0.35], r * 0.25), f: tint('#6a2a52', 0.4), no: true }];
/** Sürahi (yan, sağa döker). x,y = taban ortası, a dönüş */
function Jug({ x, y, a = 0, s = 1, water = true, flip }: { x: number; y: number; a?: number; s?: number; water?: boolean; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${flip ? -s : s} ${s})`}>
      <O s={s} sh={[
        { d: 'M-26 -60Q-30 -66 -24 -66H16L28 -74L24 -60Q30 -30 26 -4Q24 0 20 0H-20Q-24 0 -26 -4Q-30 -30 -26 -60Z', f: MAT.glass },
        ...(water ? [{ d: 'M-27 -34H27Q28 -18 26 -4Q24 0 20 0H-20Q-24 0 -26 -4Q-28 -18 -27 -34Z', f: tint(K.water, 0.4), no: true } as Sh] : []),
        { d: 'M-26 -54Q-48 -50 -44 -30Q-40 -16 -26 -18', st: K.out, sw: 5 },
        { d: 'M-26 -54Q-48 -50 -44 -30Q-40 -16 -26 -18', st: MAT.glass, sw: 2.6 },
      ]} />
    </g>
  );
}
/** Tarhana parçacığı / kırıntı */
const crumbs = (x0: number, y0: number, w: number, h: number, n: number, r = 3, c = MAT.dough, seed = 0) =>
  range(n).map((i) => <circle key={i} cx={x0 + rnd(i + seed) * w} cy={y0 + rnd(i + seed + 500) * h} r={r * (0.6 + rnd(i + seed + 900) * 0.5)} fill={c} stroke={K.out} stroke-width={0.8} />);

/* ═══════════════════════ SAHNELER ═══════════════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ───── Et güvenliği (HASAN) ───── */
  'sf-ys-et-serin-asma': () => {
    const hook: P = [196, 58];
    const p: PersonProps = { ...HASAN, x: 138, y: 228, s: 1.05, pose: { ...POSE.standSide, armF: { to: [hook[0] - 2, hook[1] + 22] }, armB: { to: [hook[0] - 8, hook[1] + 36] }, head: -84, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#dbe3e8">
        <Window x={20} y={46} w={66} h={62} />
        <Arrow from={[92, 74]} to={[118, 80]} color={K.waterLight} w={5} />
        <Arrow from={[92, 94]} to={[118, 100]} color={K.waterLight} w={5} />
        <O sh={[{ d: rrect(150, 40, 170, 9, 3), f: MAT.wood }]} />
        <HangMeat x={244} y={48} s={1.25} />
        <HangMeat x={290} y={48} s={1.15} />
        <Person {...p} mid={() => <HangMeat x={hook[0]} y={48} s={1.25} />} />
        <Thermo x={46} y={186} s={0.9} lvl={0.18} />
        <Label x={46} y={124} text="4 °C" size={14} bg="#fff" />
      </Scene2>
    );
  },

  'sf-ys-trisin-yasak': () => (
    <Scene2 bg="closeup">
      <rect x={160} y={18} width={2} height={204} fill={K.out} opacity={0.15} />
      <Boar x={76} y={214} s={1.05} />
      <O sh={[ln([[52, 40], [116, 40]], K.out, 3.4), ...strip(62, 42, 46), ...strip(76, 42, 50), ...strip(90, 42, 44), ...strip(104, 42, 48)]} />
      <path d="M60 36c-4-8 4-10 0-18M84 34c-4-8 4-10 0-18M106 36c-4-8 4-10 0-18" stroke={K.smoke} stroke-width={3} fill="none" stroke-linecap="round" opacity={0.7} />
      <No x={84} y={66} r={50} />
      <Campfire x={240} y={214} s={1.2} />
      <Pan x={244} y={186} s={0.95}><PanMeat x={0} y={2} /></Pan>
      <path d="M226 140c-4-6 3-9 0-15M244 138c-4-6 3-9 0-15M262 140c-4-6 3-9 0-15" stroke="#fff" stroke-width={2.6} fill="none" stroke-linecap="round" />
      <Ok x={290} y={44} r={16} />
    </Scene2>
  ),

  'sf-ys-et-pismis-kesit': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={130} w={292} h={92} />
      <MeatCut x={88} y={160} s={1.3} />
      <g fill={K.waterLight} stroke={K.out} stroke-width={1}>
        <path d="M60 196q-4 10 6 12q8 -2 4 -12z" />
      </g>
      <MeatCut x={236} y={160} s={1.3} raw />
      <Probe x={88} y={150} a={100} s={1} len={40} />
      <Label x={130} y={50} text="71 °C" size={16} bg="#fff" />
      <Ok x={40} y={110} r={16} />
      <Bad x={290} y={110} r={16} />
    </Scene2>
  ),

  /* ───── Et kurutma (HASAN) ───── */
  'sf-ys-et-serit-kesme': () => (
    <Scene2 bg="closeup">
      <Board x={18} y={30} w={284} h={180} />
      <O sh={[
        { d: rrect(60, 66, 130, 112, 14), f: MAT.meat },
        { d: smooth([[74, 90], [120, 84], [170, 92]]), st: tint(MAT.meat, 0.35), sw: 2 },
        { d: smooth([[78, 150], [130, 156], [176, 148]]), st: shade(MAT.meat, 0.2), sw: 2 },
        ...range(4).map((i) => ({ d: rrect(204 + i * 18, 66, 12, 112, 5), f: i % 2 ? MAT.meat : shade(MAT.meat, 0.06) }) as Sh),
      ]} />
      <Knife x={196} y={62} a={90} s={1.1} len={110} />
      <Hand x={200} y={4} a={180} s={0.9} pose="fist" side="R" arm={80} {...EL.HASAN} />
      <Hand x={100} y={238} a={8} s={0.95} pose="press" side="L" arm={200} {...EL.HASAN} />
      <O sh={[ln([[204, 196], [204, 206]], K.out, 2), ln([[216, 196], [216, 206]], K.out, 2), ln([[204, 201], [216, 201]], K.out, 2)]} />
      <Label x={262} y={200} text="0,5 cm" size={15} />
    </Scene2>
  ),

  'sf-ys-et-kaynatma': () => (
    <Scene2 bg="closeup">
      <Campfire x={150} y={226} s={2} />
      <O sh={[ln([[96, 224], [104, 176]], '#3a3d45', 5), ln([[204, 224], [196, 176]], '#3a3d45', 5)]} />
      <G x={150} y={180} s={2.4}>
        <O s={2.4} sh={[
          { d: capsule([-27, -24], 3, [-20, -24], 3), f: shade('#8e99a6', 0.2) },
          { d: capsule([20, -24], 3, [27, -24], 3), f: shade('#8e99a6', 0.2) },
          { d: 'M-21 -28H21L19 -3Q19 0 16 0H-16Q-19 0 -19 -3Z', f: '#8e99a6' },
          { d: ell([0, -28], 21, 4.5), f: '#d2b28e' },
          { d: smooth([[-14, -29], [-6, -27], [2, -30]]), st: '#8a3328', sw: 2.6 },
          { d: smooth([[0, -27], [8, -29], [15, -27]]), st: '#8a3328', sw: 2.6 },
          { d: smooth([[-10, -31], [-2, -32], [6, -31]]), st: '#9a3d30', sw: 2.4 },
        ]} />
        <g fill="none" stroke="#fff" stroke-width={1} stroke-linecap="round">
          <path d="M-8 -36c-4-5 4-8 0-14M3 -38c-4-5 4-8 0-14M13 -36c-4-5 4-8 0-14" />
        </g>
      </G>
      <Timer x={232} y={50} r={18} text="5 dk" />
    </Scene2>
  ),

  'sf-ys-et-kurutma-askisi': () => (
    <Scene2 bg="indoor">
      <WoodStove x={70} y={214} s={1.25} pipe={110} />
      <O sh={[
        { d: rrect(150, 44, 6, 170, 2), f: MAT.wood },
        { d: rrect(292, 44, 6, 170, 2), f: MAT.wood },
        ln([[150, 56], [298, 56]], K.out, 3.4), ln([[150, 56], [298, 56]], K.metal, 2),
        ln([[150, 120], [298, 120]], K.out, 3.4), ln([[150, 120], [298, 120]], K.metal, 2),
        ...range(7).flatMap((i) => strip(166 + i * 20, 58, 50 - (i % 3) * 4)),
        ...range(7).flatMap((i) => strip(166 + i * 20, 122, 48 - ((i + 1) % 3) * 4)),
      ]} />
      <Arrow from={[132, 206]} to={[176, 182]} bend={0.15} w={5} />
      <Arrow from={[208, 196]} to={[208, 178]} w={5} />
      <Arrow from={[248, 196]} to={[248, 178]} w={5} />
      <Label x={226} y={22} text="60 °C" size={14} />
    </Scene2>
  ),

  /* ───── Pastırma 1 (HASAN) ───── */
  'sf-ys-pastirma-yarma': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={40} w={292} h={176} />
      <MeatSlab x={150} y={130} s={1.35} slits={4} />
      <Knife x={238} y={102} a={135} s={1} len={72} />
      <Hand x={262} y={80} a={225} s={0.8} pose="fist" side="R" arm={160} {...EL.HASAN} />
      <Hand x={60} y={238} a={20} s={0.85} pose="press" side="L" arm={200} {...EL.HASAN} />
      <path d="M88 186 A22 22 0 0 1 104 164" fill="none" stroke={K.action} stroke-width={3} />
      <Label x={54} y={170} text="45°" size={16} />
    </Scene2>
  ),

  'sf-ys-pastirma-tuz': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={40} w={292} h={176} />
      <MeatSlab x={150} y={128} s={1.35} slits={4} salt />
      <Hand x={110} y={238} a={-6} s={0.9} pose="press" side="L" arm={200} {...EL.HASAN} />
      <Hand x={196} y={238} a={6} s={0.9} pose="press" side="R" arm={200} {...EL.HASAN} />
      <G x={272} y={60}>
        <O sh={[{ d: 'M-30 0H30Q28 26 0 28Q-28 26 -30 0Z', f: '#7a8fa3' }, { d: ell([0, 0], 30, 7), f: MAT.salt }]} />
      </G>
    </Scene2>
  ),

  'sf-ys-pastirma-pres': () => {
    const sl = (y: number, x = 160, w = 180): Sh[] => [
      { d: smooth([[x - w / 2, y], [x - w / 2 + 6, y - 16], [x, y - 20], [x + w / 2 - 6, y - 16], [x + w / 2, y]], true), f: MAT.meat },
      { d: smooth([[x - w / 2 + 14, y - 12], [x, y - 15], [x + w / 2 - 14, y - 12]]), st: tint(MAT.meat, 0.35), sw: 1.6 },
    ];
    return (
      <Scene2 bg="indoor" wall="#dbe3e8">
        <O sh={[
          { d: rrect(40, 196, 240, 14, 3), f: MAT.wood },
          ...sl(196), ...sl(178, 150, 170),
          { d: rrect(46, 152, 228, 12, 3), f: MAT.wood },
          ...flatStone(100, 152, 56, 30), ...flatStone(166, 152, 62, 34, shade(MAT.stone, 0.08)), ...flatStone(230, 152, 54, 28),
        ]} />
        <Arrow from={[100, 64]} to={[100, 112]} />
        <Arrow from={[230, 64]} to={[230, 112]} />
        <Label x={166} y={52} text="12–24 sa" size={15} />
      </Scene2>
    );
  },

  /* ───── Pastırma 2 (HASAN) ───── */
  'sf-ys-cemen-kaplama': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={40} w={292} h={176} />
      <MeatSlab x={150} y={128} s={1.35} c={MAT.meat} />
      <G x={150} y={128} s={1.35}>
        <O s={1.35} sh={[{ d: smooth([[-80, -8], [-66, -36], [-20, -44], [14, -42], [20, -10], [10, 20], [16, 40], [-50, 38], [-80, 20]], true), f: MAT.cemen }]} />
        <path d="M-60 -20q8 -6 16 0t16 0M-62 10q8 -6 16 0t16 0M-40 26q8 -6 16 0" fill="none" stroke={shade(MAT.cemen, 0.25)} stroke-width={1.6 / 1.35} />
      </G>
      <Hand x={196} y={236} a={-30} s={0.95} pose="press" side="R" arm={200} {...EL.HASAN} />
      <G x={56} y={214}>
        <O sh={[{ d: 'M-36 -24H36Q34 4 0 6Q-34 4 -36 -24Z', f: '#7a8fa3' }, { d: ell([0, -24], 36, 8), f: MAT.cemen }]} />
      </G>
    </Scene2>
  ),

  'sf-ys-cemen-siyirma': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={170} w={292} h={52} />
      <O sh={[
        { d: rrect(30, 112, 260, 60, 14), f: MAT.meat },
        { d: smooth([[44, 140], [160, 136], [276, 142]]), st: tint(MAT.meat, 0.3), sw: 2 },
        { d: 'M30 116Q30 104 42 104H170V112H30Z', f: MAT.cemen },
        { d: 'M170 112V86Q172 82 180 82H278Q290 82 290 96V112Z', f: MAT.cemen },
        { d: smooth([[150, 104], [160, 88], [174, 84], [170, 104]], true), f: MAT.cemen },
      ]} />
      <G x={162} y={104} a={50}>
        <O sh={[{ d: rrect(-8, -70, 16, 70, 4), f: '#c99a62' }, { d: rrect(-12, -6, 24, 8, 2), f: '#d9ad75' }]} />
      </G>
      <Hand x={238} y={34} a={225} s={0.8} pose="fist" side="R" arm={90} {...EL.HASAN} />
      <Arrow from={[150, 70]} to={[96, 70]} w={5} />
      <O sh={[ln([[60, 96], [60, 112]], K.out, 2), ln([[54, 104], [66, 104]], K.out, 1.5)]} />
      <Label x={60} y={84} text="2–3 mm" size={14} />
    </Scene2>
  ),

  'sf-ys-pastirma-asma': () => {
    const pc = (x: number, y: number, h: number, w: number): Sh[] => [
      ln([[x, 52], [x, y + 4]], K.out, 2.6), ln([[x, 52], [x, y + 4]], MAT.rope, 1.4),
      { d: smooth([[x - w * 0.4, y + 4], [x + w * 0.45, y + 2], [x + w * 0.55, y + h * 0.45], [x + w * 0.4, y + h], [x - w * 0.35, y + h + 4], [x - w * 0.55, y + h * 0.5]], true), f: shade(MAT.cemen, 0.12) },
      { d: smooth([[x - w * 0.2, y + 14], [x + w * 0.1, y + h * 0.5], [x - w * 0.1, y + h * 0.85]]), st: shade(MAT.cemen, 0.35), sw: 2 },
      { d: smooth([[x + w * 0.25, y + 18], [x + w * 0.3, y + h * 0.6]]), st: tint(MAT.cemen, 0.25), sw: 2 },
    ];
    return (
      <Scene2 bg="outdoor">
        <rect x={0} y={0} width={320} height={240} fill="#1c1830" opacity={0.16} />
        <O sh={[...eave(50), ...pc(56, 72, 96, 40), ...pc(116, 66, 108, 46), ...pc(176, 74, 92, 40), ...pc(236, 68, 104, 44)]} />
        <Waves x={292} y={130} a={180} n={3} r={7} color={K.waterLight} />
      </Scene2>
    );
  },

  /* ───── Kavurma (HASAN) ───── */
  'sf-ys-kavurma-kazan': () => {
    const k = 222, ky = 176;
    const l0: P = [140, 92], l1: P = [232, 140];
    const at = (t: number): P => [l0[0] + (l1[0] - l0[0]) * t, l0[1] + (l1[1] - l0[1]) * t];
    const p: PersonProps = { ...HASAN, x: 104, y: 228, s: 1.05, pose: { ...POSE.standSide, spine: -84, head: -76, armB: { to: at(0.18) }, armF: { to: at(0.38) }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e6dccb">
        <Campfire x={k} y={226} s={1.6} />
        <O sh={[
          { d: `M${k - 74} ${ky - 46}H${k + 74}Q${k + 70} ${ky + 4} ${k} ${ky + 8}Q${k - 70} ${ky + 4} ${k - 74} ${ky - 46}Z`, f: MAT.iron },
          { d: ell([k, ky - 46], 74, 13), f: shade(MAT.iron, 0.3) },
          { d: ell([k, ky - 44], 66, 9), f: '#d9a441' },
          ...range(9).map((i) => ({ d: ell([k - 52 + i * 13, ky - 46 + (i % 2) * 3], 7, 5), f: i % 2 ? MAT.crust : shade(MAT.crust, 0.12) }) as Sh),
          { d: capsule([k - 84, ky - 44], 4, [k - 74, ky - 44], 4), f: '#3a3d45' },
          { d: capsule([k + 74, ky - 44], 4, [k + 84, ky - 44], 4), f: '#3a3d45' },
        ]} />
        <Person {...p} mid={() => <O sh={[{ d: capsule(l0, 2.6, l1, 2.6), f: '#7b4e2e' }, { d: ell([l1[0] + 4, l1[1] + 2], 9, 5), f: '#8e99a6' }]} />} />
      </Scene2>
    );
  },

  'sf-ys-kavurma-kup': () => (
    <Scene2 bg="closeup">
      <Crock x={150} y={226} s={1.25}>
        <O s={1.25} sh={[
          { d: rrect(-40, -122, 80, 108, 8), f: '#3a2a22' },
          { d: rrect(-40, -66, 80, 52, 8), f: MAT.crust },
          ...range(12).map((i) => ({ d: ell([-30 + (i % 4) * 20, -58 + Math.floor(i / 4) * 16], 9, 6.5), f: i % 2 ? tint(MAT.crust, 0.15) : shade(MAT.crust, 0.2) }) as Sh),
          { d: rrect(-40, -96, 80, 30, 0), f: MAT.fat },
          { d: rrect(-40, -122, 80, 108, 8), st: K.out, sw: 3 },
        ]} />
      </Crock>
      <Arrow from={[268, 120]} to={[208, 120]} w={5} />
      <Label x={262} y={92} text="2 parmak" size={14} />
    </Scene2>
  ),

  'sf-ys-kavurma-isitma': () => (
    <Scene2 bg="closeup">
      <Campfire x={170} y={222} s={1.7} />
      <Pan x={176} y={176} s={1.6}><PanMeat x={0} y={2} n={7} /></Pan>
      <g stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round">
        <path d="M130 120c-5-7 4-10 0-18M164 116c-5-7 4-10 0-18M198 116c-5-7 4-10 0-18M230 120c-5-7 4-10 0-18" />
      </g>
      <g stroke={K.fireCore} stroke-width={2.4} stroke-linecap="round">
        <path d="M112 140l-8 -6M240 140l8 -6M118 128l-6 -9M234 128l6 -9" />
      </g>
      <Timer x={46} y={52} r={18} text="10 dk" />
    </Scene2>
  ),

  /* ───── Sucuk (HASAN) ───── */
  'sf-ys-sucuk-cig-yasak': () => {
    const slice = (x: number, y: number, c: string, sp: string): Sh[] => [
      { d: ell([x, y], 15, 11), f: c },
      ...range(5).map((i) => ({ d: circ([x - 8 + ((i * 7) % 16), y - 5 + ((i * 5) % 10)], 1.6), f: sp, no: true }) as Sh),
    ];
    return (
      <Scene2 bg="closeup">
        <rect x={160} y={18} width={2} height={204} fill={K.out} opacity={0.15} />
        <O sh={[
          { d: ell([82, 160], 66, 22), f: '#fff' },
          { d: ell([82, 156], 50, 14), f: '#f1f1ee' },
          ...slice(56, 150, '#d0645c', '#f6e6d6'), ...slice(86, 146, '#c95a52', '#f6e6d6'), ...slice(110, 154, '#d0645c', '#f6e6d6'), ...slice(76, 164, '#c95a52', '#f6e6d6'),
        ]} />
        <No x={82} y={140} r={56} />
        <Campfire x={240} y={214} s={1.2} />
        <Pan x={244} y={186} s={0.95}>
          <O sh={[...slice(-24, -20, '#8a3a2a', '#e8c48a'), ...slice(2, -22, '#7d3426', '#e8c48a'), ...slice(26, -20, '#8a3a2a', '#e8c48a')]} />
        </Pan>
        <path d="M226 140c-4-6 3-9 0-15M244 138c-4-6 3-9 0-15M262 140c-4-6 3-9 0-15" stroke="#fff" stroke-width={2.6} fill="none" stroke-linecap="round" />
        <Ok x={290} y={44} r={16} />
      </Scene2>
    );
  },

  'sf-ys-sucuk-doldurma': () => (
    <Scene2 bg="closeup">
      <O sh={[
        { d: capsule([124, 112], 17, [292, 112], 17), f: '#b5473a' },
        { d: smooth([[134, 102], [210, 100], [286, 104]]), st: tint('#b5473a', 0.35), sw: 2.4 },
        ...range(9).map((i) => ({ d: circ([146 + i * 16, 116 + (i % 2) * 5], 1.8), f: '#f3dcc4', no: true }) as Sh),
        { d: circ([214, 98], 6), f: '#f0d6d0' },
        { d: 'M24 70L104 102V122L24 154Z', f: '#c9d1da' },
        { d: rrect(100, 104, 34, 16, 4), f: '#c9d1da' },
        { d: ell([24, 112], 8, 42), f: '#b5473a' },
        ...range(5).map((i) => ({ d: circ([20 + (i % 2) * 6, 86 + i * 12], 1.8), f: '#f3dcc4', no: true }) as Sh),
      ]} />
      <Arrow from={[40, 196]} to={[96, 196]} w={5} />
      <O sh={[{ d: capsule([214, 98], 0.8, [238, 52], 1.6), f: '#e9edf1' }]} />
      <Hand x={262} y={10} a={210} s={0.75} pose="pinch" side="R" arm={60} {...EL.HASAN} />
      <Arrow from={[176, 44]} to={[206, 82]} w={5} />
    </Scene2>
  ),

  'sf-ys-sucuk-asma': () => {
    const u = (x: number, h: number, c = '#9b3b2e') => {
      const d = `M${x - 14} ${66 + h}C${x - 17} 80 ${x - 10} 54 ${x} 54C${x + 10} 54 ${x + 17} 80 ${x + 14} ${66 + h}`;
      return [
        <path d={d} stroke={K.out} stroke-width={17} fill="none" stroke-linecap="round" />,
        <path d={d} stroke={c} stroke-width={14} fill="none" stroke-linecap="round" />,
        <path d={d} stroke={tint(c, 0.3)} stroke-width={2} fill="none" stroke-dasharray="10 14" />,
      ];
    };
    return (
      <Scene2 bg="indoor" wall="#dbe3e8">
        <Window x={20} y={50} w={66} h={62} />
        <g stroke={K.out} stroke-width={0.8} opacity={0.5}>
          {range(10).map((i) => <line key={'v' + i} x1={23 + i * 6.4} y1={53} x2={23 + i * 6.4} y2={109} />)}
          {range(9).map((i) => <line key={'h' + i} x1={23} y1={56 + i * 6.4} x2={83} y2={56 + i * 6.4} />)}
        </g>
        <O sh={[{ d: rrect(102, 48, 8, 18, 2), f: MAT.wood }, { d: rrect(296, 48, 8, 18, 2), f: MAT.wood }, { d: capsule([104, 54], 4, [304, 54], 4), f: MAT.wood }]} />
        {u(132, 90)}{u(176, 100)}{u(220, 86)}{u(264, 96)}
        <Waves x={96} y={150} a={0} n={3} r={7} color={K.waterLight} />
      </Scene2>
    );
  },

  /* ───── Balık tuzlama (RIZA) ───── */
  'sf-ys-balik-taze-secim': () => (
    <Scene2 bg="closeup">
      <Fish x={176} y={74} s={1.65} />
      <Fish x={176} y={176} s={1.65} stale />
      <Ok x={30} y={74} r={16} />
      <Bad x={30} y={176} r={16} />
    </Scene2>
  ),

  'sf-ys-balik-dilimleme': () => {
    // Yan yatmış başsız gövde (yukarıdan bakınca profil görünür), kalın dilimler arası boşluk
    const top = (x: number) => 128 - 34 * Math.sin(Math.PI * Math.min(1, Math.max(0, (x - 20) / 290)) * 0.95 + 0.12);
    const bot = (x: number) => 128 + 30 * Math.sin(Math.PI * Math.min(1, Math.max(0, (x - 20) / 290)) * 0.95 + 0.12);
    const seg = (x0: number, x1: number): Sh[] => {
      const xs = range(7).map((i) => x0 + ((x1 - x0) * i) / 6);
      const tp = xs.map((x) => [x, top(x)] as P), bt = xs.map((x) => [x, bot(x)] as P).reverse();
      const mid = xs.map((x) => [x, (top(x) * 2 + bot(x)) / 3] as P);
      return [
        { d: 'M' + [...tp, ...bt].map((p) => p.join(' ')).join('L') + 'Z', f: MAT.fishBelly },
        { d: 'M' + [...tp, ...mid.slice().reverse()].map((p) => p.join(' ')).join('L') + 'Z', f: '#3f6f9a', no: true },
        ...range(2).map((i) => ({ d: `M${x0 + 8 + i * 22} ${top(x0) + 18}l10 -12`, st: shade('#3f6f9a', 0.35), sw: 2 }) as Sh),
      ];
    };
    return (
      <Scene2 bg="closeup">
        <Board x={14} y={60} w={292} h={150} />
        <O sh={[...seg(30, 86), ...seg(96, 152), ...seg(162, 218), ...seg(228, 296)]} />
        <Knife x={224} y={66} a={90} s={1} len={116} />
        <Hand x={228} y={6} a={180} s={0.85} pose="fist" side="R" arm={60} {...EL.RIZA} />
        <O sh={[ln([[96, 178], [152, 178]], K.out, 2), ln([[96, 172], [96, 184]], K.out, 2), ln([[152, 172], [152, 184]], K.out, 2)]} />
        <Label x={124} y={198} text="6–8 cm" size={15} />
      </Scene2>
    );
  },

  'sf-ys-lakerda-katman': () => {
    const saltL = (y: number, h: number): JSX.Element => (
      <g>
        <rect x={84} y={y} width={152} height={h} fill={MAT.salt} />
        {range(30).map((i) => <rect key={i} x={88 + ((i * 29) % 144)} y={y + 2 + ((i * 7) % Math.max(2, h - 5))} width={3} height={3} fill="#d6d4cc" />)}
      </g>
    );
    const row = (y: number) => range(4).map((i) => (
      <O key={i} sh={[{ d: rrect(90 + i * 36, y, 32, 30, 5), f: '#e2a19a' }, { d: rrect(90 + i * 36, y, 32, 8, 4), f: '#5c7f9e', no: true }, { d: circ([106 + i * 36, y + 19], 3), f: '#c9c0b6' }]} />
    ));
    return (
      <Scene2 bg="closeup">
        <O sh={[{ d: rrect(76, 50, 168, 180, 10), f: '#8f6a4a' }]} />
        <rect x={84} y={58} width={152} height={164} fill="#5a4636" />
        {saltL(200, 20)}{row(170)}{saltL(158, 12)}{row(128)}{saltL(110, 18)}
        <O sh={[{ d: rrect(76, 50, 168, 180, 10), st: K.out, sw: 3 }]} />
        <Label x={160} y={30} text="%20 tuz" size={16} />
      </Scene2>
    );
  },

  /* ───── Balık kurutma (RIZA) ───── */
  'sf-ys-balik-tuza-gomme': () => {
    const grains = (y0: number, y1: number, n: number) => range(n).map((i) => <rect key={i} x={50 + ((i * 41) % 220)} y={y0 + ((i * 13) % (y1 - y0))} width={3} height={3} fill="#d6d4cc" />);
    return (
      <Scene2 bg="closeup">
        <O sh={[{ d: rrect(36, 110, 248, 116, 6), f: MAT.wood }]} />
        <rect x={44} y={118} width={232} height={100} fill={MAT.salt} />
        <Fish x={132} y={186} s={0.8} />
        <path d="M44 192q20 -5 40 0t40 0t40 0t40 0t40 0t32 0V218H44Z" fill={MAT.salt} />
        <rect x={44} y={160} width={232} height={14} fill={MAT.salt} />
        <Fish x={206} y={150} s={0.8} flip />
        <path d="M44 156q20 -5 40 0t40 0t40 0t40 0t40 0t32 0V174H44Z" fill={MAT.salt} />
        <rect x={44} y={118} width={232} height={14} fill={MAT.salt} />
        {grains(118, 216, 40)}
        <O sh={[{ d: rrect(36, 110, 248, 116, 6), st: K.out, sw: 3 }, ln([[36, 168], [44, 168]], K.out, 2), ln([[276, 168], [284, 168]], K.out, 2)]} />
        <g fill={MAT.salt} stroke={K.out} stroke-width={0.8}>
          {range(9).map((i) => <rect key={i} x={140 + ((i * 17) % 40)} y={56 + i * 6} width={4} height={4} />)}
        </g>
        <Hand x={196} y={-6} a={200} s={0.8} pose="pinch" side="R" arm={60} {...EL.RIZA} />
      </Scene2>
    );
  },

  'sf-ys-ciroz-ip': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <O sh={[
        { d: rrect(18, 40, 8, 180, 2), f: MAT.wood }, { d: rrect(294, 40, 8, 180, 2), f: MAT.wood },
        ln([[22, 50], [298, 50]], K.out, 3), ln([[22, 50], [298, 50]], MAT.rope, 1.6),
      ]} />
      {range(6).map((i) => <Fish key={i} x={52 + i * 44} y={102} s={0.62} a={90} dried stripes={false} />)}
      <path d="M30 44H290L298 160H22Z" fill="#fff" opacity={0.4} />
      <g stroke="#fff" stroke-width={1.2} opacity={0.7}>{range(11).map((i) => <line key={i} x1={44 + i * 23} y1={46} x2={36 + i * 25} y2={158} />)}</g>
      <path d="M30 44H290L298 160H22Z" fill="none" stroke={K.out} stroke-width={1.4} opacity={0.6} />
    </Scene2>
  ),

  'sf-ys-ciroz-atesleme': () => {
    const t0: P = [304, 72], tip: P = [176, 128];
    return (
      <Scene2 bg="closeup">
        <Embers x={150} y={226} w={240} h={34} />
        <g stroke={K.fireCore} stroke-width={2.4} stroke-linecap="round" opacity={0.9}>
          <path d="M80 186c-4-8 4-10 0-18M150 182c-4-8 4-10 0-18M220 186c-4-8 4-10 0-18" />
        </g>
        <Fish x={110} y={140} s={1.1} dried stripes={false} flip />
        <O sh={[{ d: capsule(t0, 3, tip, 2), f: '#9aa3ad' }, { d: capsule([t0[0], t0[1] + 10], 3, [tip[0], tip[1] + 6], 2), f: '#b9c2cc' }]} />
        <Hand x={318} y={56} a={250} s={0.8} pose="fist" side="R" arm={60} {...EL.RIZA} />
        <Label x={60} y={50} text="63 °C" size={16} bg="#fff" />
      </Scene2>
    );
  },

  /* ───── Tütsüleme (RIZA) ───── */
  'sf-ys-tutsu-sicak-soguk': () => (
    <Scene2 bg="outdoor">
      <rect x={159} y={0} width={2} height={240} fill={K.out} opacity={0.2} />
      <Campfire x={80} y={222} s={1.1} />
      <Barrel x={80} y={204} w={76} h={128} />
      <Fish x={68} y={124} s={0.42} a={90} smoked stripes={false} />
      <Fish x={92} y={124} s={0.42} a={90} smoked stripes={false} />
      <path d="M80 72c-4-8 4-10 0-18" stroke={K.smoke} stroke-width={3} fill="none" stroke-linecap="round" />
      <Label x={80} y={34} text="71 °C" size={15} />
      <Campfire x={190} y={222} s={0.8} />
      <O sh={[{ d: `M196 206L262 150`, st: K.out, sw: 13 }, { d: `M196 206L262 150`, st: '#8a8f96', sw: 10 }, { d: rrect(238, 70, 64, 84, 4), f: MAT.wood }, { d: rrect(246, 78, 48, 66, 3), f: '#2e2a2a' }]} />
      <Fish x={262} y={110} s={0.36} a={90} smoked stripes={false} />
      <Fish x={280} y={110} s={0.36} a={90} smoked stripes={false} />
      <path d="M270 64c-4-8 4-10 0-18" stroke={K.smoke} stroke-width={3} fill="none" stroke-linecap="round" />
      <Label x={238} y={34} text="32 °C altı" size={14} bg="#fff" />
    </Scene2>
  ),

  'sf-ys-tutsu-odun': () => (
    <Scene2 bg="closeup">
      <rect x={159} y={18} width={2} height={204} fill={K.out} opacity={0.15} />
      <O sh={[...log(46, 196, 20), ...log(88, 196, 20, '#7a5a40'), ...log(130, 196, 18), ...log(66, 162, 19, '#7a5a40'), ...log(108, 162, 19), ...log(88, 128, 18)]} />
      <G x={88} y={78}><O sh={[{ d: ell([0, 0], 22, 20), f: '#c4392f' }, { d: 'M0 -20q2 -8 8 -10', st: K.out, sw: 2 }, { d: 'M2 -22q8 -6 14 -2q-6 6 -14 2z', f: K.leaf }]} /></G>
      <Ok x={30} y={40} r={16} />
      <O sh={[...log(206, 196, 18, '#4a3326', '#ecd49a', true), ...log(244, 196, 18, '#4a3326', '#ecd49a', true), ...log(282, 196, 18, '#4a3326', '#ecd49a', true), ...log(226, 162, 17, '#4a3326', '#ecd49a', true), ...log(262, 162, 17, '#4a3326', '#ecd49a', true)]} />
      <Tree x={244} y={74} kind="pine" s={0.32} />
      <No x={244} y={150} r={68} />
    </Scene2>
  ),

  'sf-ys-tutsu-termometre': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={150} w={292} h={70} />
      <Fish x={158} y={160} s={2} smoked stripes={false} />
      <Probe x={150} y={162} a={100} s={1.3} len={44} />
      <Label x={250} y={66} text="71 °C" size={18} />
      <Arrow from={[216, 66]} to={[166, 76]} w={5} />
    </Scene2>
  ),

  /* ───── Tütsü fırını (RIZA) ───── */
  'sf-ys-tutsu-cadiri': () => {
    const top: P = [160, 40];
    return (
      <Scene2 bg="outdoor">
        <Tree x={36} y={196} s={0.8} />
        <Tree x={296} y={194} kind="pine" s={0.85} />
        <O sh={[
          { d: `M${top[0] - 6} ${top[1] + 10}L84 214H236L${top[0] + 6} ${top[1] + 10}Z`, f: '#d8cdb0' },
          { d: `M${top[0] + 6} ${top[1] + 10}L236 214H196L${top[0] + 2} ${top[1] + 12}Z`, f: shade('#d8cdb0', 0.12), no: true },
          ...range(6).map((i) => ({ d: ell([116 + (i % 3) * 40, 120 + Math.floor(i / 3) * 50], 16, 10), f: i % 2 ? K.leaf : shade(K.leaf, 0.15) }) as Sh),
          { d: 'M146 214Q160 170 174 214Z', f: '#3b3434' },
          ln([top, [78, 216]], '#7b4e2e', 4), ln([top, [242, 216]], '#7b4e2e', 4), ln([[top[0], top[1] - 12], [top[0] + 4, 216]], '#7b4e2e', 3),
          ln([[top[0] - 10, top[1] - 14], [top[0] + 10, top[1] + 6]], '#7b4e2e', 4), ln([[top[0] + 10, top[1] - 14], [top[0] - 10, top[1] + 6]], '#7b4e2e', 4),
        ]} />
        <Embers x={160} y={214} w={24} h={8} />
        <Smoke x={136} y={2} w={60} h={30} kind="cloud" op={0.8} />
      </Scene2>
    );
  },

  'sf-ys-tutsu-izgara': () => (
    <Scene2 bg="outdoor">
      <O sh={[
        { d: 'M160 30L70 216H250Z', f: '#4a4038' },
        ln([[160, 22], [64, 220]], '#7b4e2e', 5), ln([[160, 22], [256, 220]], '#7b4e2e', 5),
        ln([[104, 104], [216, 104]], '#a0784e', 4), ln([[110, 96], [210, 112]], '#a0784e', 3),
        ...range(5).flatMap((i) => strip(124 + i * 18, 106, 34)),
      ]} />
      <Embers x={160} y={214} w={56} h={14} />
      <Flame x={160} y={206} s={0.4} />
      <Arrow from={[142, 186]} to={[136, 152]} w={4} color="#c8ccd2" />
      <Arrow from={[178, 186]} to={[184, 152]} w={4} color="#c8ccd2" />
      <Arrow from={[160, 96]} to={[160, 50]} w={4} color="#c8ccd2" />
    </Scene2>
  ),

  'sf-ys-soguk-tutsu-kanal': () => (
    <Scene2 bg="outdoor">
      <O sh={[
        { d: 'M-10 210L120 166L330 88V250H-10Z', f: K.grass },
        { d: 'M-10 218L120 174L330 96V250H-10Z', f: '#8a6446' },
        { d: 'M88 202L238 140L246 120', st: K.out, sw: 14 },
        { d: 'M88 202L238 140L246 120', st: '#3b3434', sw: 10 },
        { d: rrect(214, 56, 70, 66, 4), f: MAT.wood },
        { d: rrect(222, 64, 54, 50, 3), f: '#2e2a2a' },
        { d: 'M24 203Q28 226 60 226Q94 226 98 184Z', f: '#3b3434' },
      ]} />
      <Fish x={238} y={90} s={0.3} a={90} stripes={false} />
      <Fish x={260} y={90} s={0.3} a={90} stripes={false} />
      <path d="M249 52c-4-8 4-10 0-18" stroke={K.smoke} stroke-width={3} fill="none" stroke-linecap="round" />
      <Flame x={58} y={220} s={0.55} />
      <Arrow from={[108, 194]} to={[156, 174]} w={3} color="#e6e8eb" />
      <Arrow from={[172, 167]} to={[222, 147]} w={3} color="#e6e8eb" />
    </Scene2>
  ),

  /* ───── Botulizm (ZEYNEP) ───── */
  'sf-ys-yagda-sarimsak-yasak': () => (
    <Scene2 bg="indoor" wall="#efe3c8">
      <Window x={70} y={30} w={180} h={130} />
      <g stroke={K.fireCore} stroke-width={4} stroke-linecap="round" opacity={0.8}>
        <path d="M262 30l22 -14M264 52l26 -2M260 72l22 10" />
      </g>
      <O sh={[{ d: rrect(50, 158, 220, 12, 3), f: '#e8dcc4' }]} />
      <Jar x={160} y={160} w={78} h={104} fill={MAT.oil} level={0.86}>
        <O sh={[
          ...[[-18, -22], [8, -18], [-4, -44], [16, -50], [-20, -66]].map(([gx, gy]) => ({ d: smooth([[gx, gy - 9], [gx + 7, gy + 3], [gx, gy + 8], [gx - 7, gy + 3]], true), f: '#fbf5e6' }) as Sh),
          { d: smooth([[22, -12], [18, -40], [24, -74]]), st: '#3f7a3a', sw: 2.4 },
          ...[[19, -30], [22, -50], [24, -66]].map(([lx, ly]) => ({ d: ell([lx + 4, ly], 4, 2.4), f: '#4f9a45' }) as Sh),
        ]} />
      </Jar>
      <No x={160} y={106} r={62} />
    </Scene2>
  ),

  'sf-ys-kabarik-kapak': () => (
    <Scene2 bg="closeup">
      <Jar x={74} y={204} w={72} h={100} lid="bulge" fill="#c8b98a" level={0.82}>
        <g fill="#fff" stroke={K.out} stroke-width={0.8}>
          <circle cx={-12} cy={-40} r={3} /><circle cx={6} cy={-56} r={2.4} /><circle cx={14} cy={-30} r={3.4} /><circle cx={-4} cy={-70} r={2} />
        </g>
      </Jar>
      <O sh={[
        { d: 'M128 146Q156 128 184 146V198Q156 214 128 198Z', f: '#b9c2cc' },
        { d: ell([156, 140], 28, 14), f: '#d3d9df' },
        ln([[128, 166], [184, 166]], shade('#b9c2cc', 0.25), 1.4), ln([[128, 180], [184, 180]], shade('#b9c2cc', 0.25), 1.4),
      ]} />
      <WarnTri x={112} y={56} r={24} />
      <Arrow from={[200, 160]} to={[232, 160]} w={6} />
      <O sh={[
        { d: smooth([[246, 210], [240, 160], [250, 128], [272, 122], [294, 128], [302, 160], [296, 210]], true), f: '#3b3f4b' },
        { d: 'M262 124l10 -14l10 14', st: K.out, sw: 3 },
        { d: smooth([[256, 150], [262, 190]]), st: tint('#3b3f4b', 0.3), sw: 2 },
      ]} />
    </Scene2>
  ),

  'sf-ys-konserve-kaynatma': () => (
    <Scene2 bg="closeup">
      <Campfire x={150} y={226} s={2} />
      <O sh={[ln([[96, 224], [104, 176]], '#3a3d45', 5), ln([[204, 224], [196, 176]], '#3a3d45', 5)]} />
      <BigPot x={150} y={180} s={2.4} top="#c98a3a" bits={[
        ...range(6).map((i) => ({ d: ell([-14 + i * 5.6, -28 + (i % 2) * 1.6], 2.6, 1.6), f: i % 2 ? '#6aa84f' : '#e05a3a' }) as Sh),
        ...range(4).map((i) => ({ d: circ([-10 + i * 7, -29.5 + (i % 2)], 1.2), f: '#fbe3b0', no: true }) as Sh),
      ]} />
      <Timer x={232} y={50} r={18} text="10 dk" />
    </Scene2>
  ),

  /* ───── Meyve kurutma (AYSE) ───── */
  'sf-ys-kerevet-tul': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <circle cx={282} cy={36} r={18} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
      <O sh={[
        ...kerevet(24, 206, 220, 60, 30),
        ...range(16).flatMap((i) => apricot(46 + (i % 8) * 25 + (Math.floor(i / 8) * 8), 140 - Math.floor(i / 8) * 13, 9)),
      ]} />
      <path d="M22 146Q20 104 50 100H246Q272 104 266 146" fill="#fff" opacity={0.42} stroke={K.out} stroke-width={1.2} />
      <g stroke="#fff" stroke-width={1} opacity={0.7}>{range(10).map((i) => <line key={i} x1={40 + i * 22} y1={102} x2={36 + i * 24} y2={146} />)}</g>
      <O sh={[{ d: rrect(232, 166, 76, 52, 8), f: K.dirt }, ...apricot(252, 196, 8), ...apricot(272, 190, 8), ...apricot(288, 200, 8)]} />
      <Bad x={300} y={168} r={11} />
    </Scene2>
  ),

  'sf-ys-meyve-ip': () => {
    const hand: P = [200, 128];
    const p: PersonProps = { ...AYSE, x: 254, y: 226, s: 1.05, flip: true, pose: { ...POSE.standSide, head: -96, armF: { to: hand }, armB: { to: [hand[0] + 10, hand[1] + 6] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#f2dfb8" ground="dirt">
        <circle cx={300} cy={-6} r={40} fill={K.fireCore} opacity={0.5} />
        <O sh={[
          ln([[20, 54], [300, 54]], K.out, 2.6), ln([[20, 54], [300, 54]], MAT.rope, 1.4),
          ...range(10).flatMap((i) => (i % 2 ? fig(36 + i * 26, 66, 9) : appleRing(36 + i * 26, 66, 11))),
          ln([[20, 104], [hand[0] - 4, hand[1] - 2]], K.out, 2.6), ln([[20, 104], [hand[0] - 4, hand[1] - 2]], MAT.rope, 1.4),
          ...range(5).flatMap((i) => appleRing(38 + i * 28, 107 + i * 3.6, 11)),
          ln([[hand[0] - 2, hand[1] - 1], [hand[0] - 22, hand[1] - 6]], '#c9d1da', 1.8),
        ]} />
        <Person {...p} />
      </Scene2>
    );
  },

  'sf-ys-kavanoz-sallama': () => (
    <Scene2 bg="closeup">
      <Jar x={100} y={206} w={86} h={124}>
        <O sh={range(14).flatMap((i) => apricot(-26 + (i % 4) * 17, -12 - Math.floor(i / 4) * 17, 9))} />
      </Jar>
      <Shake x1={46} x2={154} y={140} h={40} />
      <Jar x={240} y={206} w={78} h={110}>
        <O sh={range(10).flatMap((i) => apricot(-22 + (i % 4) * 15, -12 - Math.floor(i / 4) * 15, 8))} />
        <g fill="#fff" stroke="#9db3c4" stroke-width={0.8} opacity={0.9}>
          {range(14).map((i) => <circle key={i} cx={-28 + ((i * 13) % 56)} cy={-92 + ((i * 17) % 40)} r={2 + (i % 3) * 0.6} />)}
        </g>
      </Jar>
      <Bad x={276} y={86} r={14} />
      <Label x={100} y={40} text="7–10 gün" size={15} />
    </Scene2>
  ),

  /* ───── Sebze kurutma (AYSE) ───── */
  'sf-ys-domates-kurutma': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#d6b07a" />
      {range(9).map((i) => <rect key={i} x={0} y={i * 27} width={320} height={22} fill="#dcb883" stroke={K.out} stroke-width={1} />)}
      <O sh={range(15).flatMap((i) => tomatoHalf(42 + (i % 5) * 60 + (i % 3) * 4, 54 + Math.floor(i / 5) * 66 + (i % 2) * 5, 22, i * 0.7))} />
      <g fill="#fff">{range(15).flatMap((t) => range(7).map((j) => <circle key={t * 7 + j} cx={42 + (t % 5) * 60 + (t % 3) * 4 + (rnd(t * 7 + j) - 0.5) * 34} cy={54 + Math.floor(t / 5) * 66 + (t % 2) * 5 + (rnd(t * 7 + j + 99) - 0.5) * 34} r={1.5} />))}</g>
      <circle cx={318} cy={0} r={34} fill={K.fireCore} opacity={0.7} />
    </Scene2>
  ),

  'sf-ys-biber-ip': () => (
    <Scene2 bg="indoor" wall="#f2dfb8">
      <O sh={[
        { d: rrect(10, 26, 300, 8, 3), f: MAT.wood },
        ...[40, 92, 144, 196, 248].flatMap((x, j) => [
          ln([[x, 34], [x, 206]], K.out, 2.4), ln([[x, 34], [x, 206]], MAT.rope, 1.2),
          ...range(12).flatMap((i) => (j === 2 ? okra(x + (i % 2 ? 2 : -6), 38 + i * 14, 24) : pepper(x + (i % 2 ? 3 : -3), 38 + i * 14, i % 2 ? -24 : 24, 30, j % 2 ? '#c4302a' : '#d84a2c'))),
        ]),
      ]} />
    </Scene2>
  ),

  'sf-ys-patlican-oyma': () => (
    <Scene2 bg="closeup">
      <O sh={[
        ln([[200, 18], [310, 18]], K.out, 2.4), ln([[200, 18], [310, 18]], MAT.rope, 1.2),
        ...[220, 252, 284].flatMap((x) => [{ d: smooth([[x - 8, 22], [x + 8, 22], [x + 10, 50], [x + 4, 70], [x - 4, 70], [x - 10, 50]], true), f: '#4a2c45' } as Sh, { d: ell([x, 24], 6, 3), f: '#6b8a3c' } as Sh]),
      ]} />
      <Board x={14} y={130} w={292} h={92} />
      <O sh={[
        { d: smooth([[40, 170], [70, 140], [150, 132], [210, 140], [232, 160], [214, 186], [150, 196], [70, 194]], true), f: '#5b2f5c' },
        { d: smooth([[64, 168], [90, 150], [150, 144], [200, 152], [212, 166], [196, 180], [150, 184], [80, 182]], true), f: '#f1e4c4' },
        { d: smooth([[232, 160], [252, 152], [262, 162], [250, 170]], true), f: '#6b8a3c' },
        ...range(6).map((i) => ({ d: circ([100 + i * 15, 168 + (i % 2) * 4], 1.6), f: '#c9b07c', no: true }) as Sh),
      ]} />
      <G x={150} y={166} a={-20}>
        <O sh={[{ d: ell([0, 0], 14, 9), f: '#c9d1da' }, { d: capsule([10, -4], 3, [80, -26], 3.6), f: '#c9d1da' }]} />
      </G>
      <Hand x={274} y={160} a={-90} s={0.75} pose="fist" side="L" arm={80} {...EL.AYSE} />
      <Hand x={240} y={95} a={232} s={0.75} pose="fist" side="R" arm={90} {...EL.AYSE} />
    </Scene2>
  ),

  /* ───── Pestil ve köme (AYSE) ───── */
  'sf-ys-herle-karistirma': () => {
    const cup = { x: 268, y: 54, a: 230, s: 0.8, pose: 'fist' as const, side: 'R' as const };
    return (
      <Scene2 bg="closeup">
        <Campfire x={160} y={232} s={1.8} />
        <O sh={cauldron(160, 214, 116, MAT.sira, MAT.copper)} />
        <g fill={tint(MAT.sira, 0.3)}><circle cx={110} cy={146} r={4} /><circle cx={190} cy={148} r={3} /><circle cx={140} cy={150} r={2.6} /></g>
        <path d="M214 92Q206 120 204 144" stroke="#f6f2e8" stroke-width={4} fill="none" stroke-linecap="round" />
        <G x={226} y={80} a={-40}><O sh={[{ d: 'M-18 -14H18L14 12Q12 16 0 16Q-12 16 -14 12Z', f: '#c9d1da' }, { d: ell([0, -14], 18, 4), f: '#f6f2e8' }]} /></G>
        <Hand {...cup} arm={80} {...EL.AYSE} />
        <O sh={[{ d: capsule([92, 148], 5, [44, 30], 3.4), f: '#c99a62' }]} />
        <Hand x={20} y={8} a={150} s={0.8} pose="fist" side="L" arm={60} {...EL.AYSE} />
      </Scene2>
    );
  },

  'sf-ys-pestil-serme': () => (
    <Scene2 bg="closeup">
      <rect x={10} y={20} width={300} height={200} rx={10} fill={MAT.wood} stroke={K.out} stroke-width={2} />
      <rect x={24} y={32} width={272} height={176} fill={MAT.cloth} stroke={K.out} stroke-width={1.5} />
      <path d="M36 44H196Q212 80 200 120Q214 160 196 196H36Z" fill="#6a2430" stroke={K.out} stroke-width={1.5} />
      <path d="M50 70q30 -6 60 0t60 0M50 150q30 -6 60 0t60 0" stroke={tint('#6a2430', 0.25)} stroke-width={2} fill="none" />
      <G x={206} y={120} a={-8}><O sh={[{ d: rrect(-6, -56, 14, 112, 4), f: '#c99a62' }, { d: capsule([8, 0], 4, [60, 0], 5), f: '#a8784a' }]} /></G>
      <Hand x={300} y={126} a={-90} s={0.8} pose="fist" side="R" arm={40} {...EL.AYSE} />
      <Label x={110} y={226} text="2–3 mm" size={14} />
    </Scene2>
  ),

  'sf-ys-kome-batirma': () => {
    const kx = 214, ky = 210;
    const grip: P = [186, 82];
    const p: PersonProps = { ...AYSE, x: 112, y: 228, s: 1.05, pose: { ...POSE.standSide, spine: -84, head: -74, armF: { to: grip }, armB: { to: [grip[0] - 6, grip[1] + 8] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#efe3c8">
        <O sh={[ln([[14, 22], [100, 22]], K.out, 3), ...kome(30, 22, 6), ...kome(56, 22, 5), ...kome(82, 22, 6)]} />
        <Campfire x={kx} y={232} s={1.4} />
        <O sh={[...cauldron(kx, ky, 72, '#6a2430', MAT.copper)]} />
        <O sh={[ln([grip, [grip[0] + 14, 150]], K.out, 1.6), ...range(5).flatMap((i) => walnut(grip[0] + 2 + i * 2.6, 106 + i * 12, 6, '#7a3a30'))]} />
        <Person {...p} />
      </Scene2>
    );
  },

  /* ───── Pekmez (AYSE) ───── */
  'sf-ys-sira-aktarma': () => (
    <Scene2 bg="closeup">
      <O sh={[
        { d: 'M30 80H170V206Q170 216 160 216H40Q30 216 30 206Z', f: '#b46a4c' },
        { d: 'M40 96H160V170H40Z', f: '#b04a52' },
        { d: 'M40 170H160V206H40Z', f: '#6e5a4a' },
        { d: 'M40 96H160V206H40Z', st: K.out, sw: 1.5 },
      ]} />
      <g fill="#8e7a66">{range(12).map((i) => <circle key={i} cx={48 + i * 9.5} cy={182 + (i % 3) * 7} r={2.4} />)}</g>
      <O sh={[{ d: ell([100, 128], 18, 8), f: '#9aa3ad' }, { d: capsule([116, 124], 3, [232, 40], 3.4), f: '#9aa3ad' }]} />
      <Hand x={254} y={20} a={235} s={0.75} pose="fist" side="R" arm={60} {...EL.AYSE} />
      <O sh={[{ d: 'M206 136H296L290 210Q288 216 282 216H220Q214 216 212 210Z', f: '#8e99a6' }, { d: ell([251, 136], 45, 8), f: '#b04a52' }]} />
      <Arrow from={[150, 108]} to={[226, 112]} bend={-0.3} w={5} />
      <Bad x={30} y={190} r={11} />
    </Scene2>
  ),

  'sf-ys-pekmez-kazan': () => {
    const k = 222, ky = 178;
    const l0: P = [140, 92], l1: P = [228, 132];
    const at = (t: number): P => [l0[0] + (l1[0] - l0[0]) * t, l0[1] + (l1[1] - l0[1]) * t];
    const p: PersonProps = { ...AYSE, x: 104, y: 228, s: 1.05, pose: { ...POSE.standSide, spine: -84, head: -76, armB: { to: at(0.18) }, armF: { to: at(0.38) }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#efe3c8">
        <Campfire x={k} y={228} s={1.6} />
        <O sh={[...cauldron(k, ky, 76, '#5a1e1a', MAT.copper), ...range(6).map((i) => ({ d: ell([k - 44 + i * 18, ky - 46 + (i % 2) * 3], 9, 3.4), f: '#e8cfa0' }) as Sh)]} />
        <Person {...p} mid={() => <O sh={[{ d: capsule(l0, 2.6, l1, 2.6), f: '#7b4e2e' }, { d: ell([l1[0] + 6, l1[1] + 1], 11, 5), f: '#9aa3ad' }, ...range(3).map((i) => ({ d: circ([l1[0] + i * 4, l1[1] + 1], 1.2), f: K.out, no: true }) as Sh)]} />} />
      </Scene2>
    );
  },

  'sf-ys-pekmez-kivam': () => (
    <Scene2 bg="closeup">
      <O sh={[
        { d: ell([210, 190], 84, 26), f: '#fff' },
        { d: ell([210, 186], 62, 16), f: '#f3f3f0' },
        { d: ell([210, 184], 16, 9), f: MAT.pekmez },
        { d: ell([206, 182], 5, 2.4), f: tint(MAT.pekmez, 0.35), no: true },
      ]} />
      <G x={96} y={70} a={18}>
        <O sh={[{ d: capsule([-90, -10], 4, [-20, 0], 5), f: '#c9d1da' }, { d: ell([10, 2], 28, 13), f: '#c9d1da' }, { d: ell([12, 0], 22, 8), f: MAT.pekmez }]} />
      </G>
      <path d="M122 88Q120 120 124 150Q126 160 122 166" stroke={K.out} stroke-width={9} fill="none" stroke-linecap="round" />
      <path d="M122 88Q120 120 124 150Q126 160 122 166" stroke={MAT.pekmez} stroke-width={6} fill="none" stroke-linecap="round" />
      <Ok x={280} y={60} r={16} />
    </Scene2>
  ),

  /* ───── Turşu (ZEYNEP) ───── */
  'sf-ys-salatalik-uc': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={70} w={292} h={140} />
      <O sh={[...cucumber(140, 142, 190, 22), { d: ell([272, 142], 6, 18), f: '#4f8a3a' }, { d: ell([270, 142], 4, 15), f: '#d9e9b0', no: true }]} />
      <Knife x={254} y={86} a={90} s={1} len={96} />
      <Hand x={258} y={28} a={180} s={0.85} pose="fist" side="R" arm={60} {...EL.ZEYNEP} />
      <Hand x={110} y={238} a={-4} s={0.85} pose="press" side="L" arm={200} {...EL.ZEYNEP} />
      <Arrow from={[300, 214]} to={[278, 170]} w={5} />
    </Scene2>
  ),

  'sf-ys-salamura-tartma': () => (
    <Scene2 bg="closeup">
      <O sh={[
        { d: rrect(28, 176, 120, 34, 8), f: '#e6e8eb' },
        { d: circ([88, 193], 12), f: '#fff' },
        ln([[88, 193], [94, 186]], K.danger, 2),
        { d: 'M40 176L48 154H128L136 176Z', f: '#c9d1da' },
        { d: smooth([[56, 156], [72, 138], [88, 132], [104, 138], [120, 156]], true), f: MAT.salt },
      ]} />
      <g fill="#d6d4cc">{range(14).map((i) => <rect key={i} x={64 + ((i * 17) % 50)} y={140 + ((i * 7) % 14)} width={3} height={3} />)}</g>
      <Jug x={226} y={210} s={1.4} />
      <O sh={[ln([[244, 146], [254, 146]], K.out, 2), ln([[244, 166], [250, 166]], K.out, 1.5), ln([[244, 186], [250, 186]], K.out, 1.5)]} />
      <Label x={160} y={46} text="1 L + 75 g" size={18} />
    </Scene2>
  ),

  'sf-ys-tursu-agirlik': () => (
    <Scene2 bg="closeup">
      <Jar x={160} y={224} w={130} h={190} lid="cloth" fill={MAT.brine} level={0.8}>
        <O sh={[
          ...range(5).flatMap((i) => cucumber(-48 + i * 24, -60, 100, 11, 90)),
          { d: ell([0, -118], 56, 6), f: '#fff' },
        ]} />
        <G x={0} y={-122}><O sh={[{ d: rrect(-18, -40, 36, 40, 6), f: MAT.glass }, { d: rrect(-16, -26, 32, 24, 4), f: tint(K.water, 0.4), no: true }]} /></G>
        <path d={`M-63 ${-(190 - 8) * 0.8}H63`} stroke={K.water} stroke-width={2} />
      </Jar>
    </Scene2>
  ),

  /* ───── Salamura (ZEYNEP) ───── */
  'sf-ys-yaprak-rulo': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={40} w={292} h={176} />
      <O sh={[
        ...[[-6, 0], [4, -4], [-2, 6]].map(([dx, dy], i) => ({ d: smooth([[60 + dx, 70 + dy], [150 + dx, 60 + dy], [168 + dx, 110 + dy], [150 + dx, 168 + dy], [60 + dx, 160 + dy], [44 + dx, 116 + dy]], true), f: i % 2 ? '#7a9a3e' : '#6f8f3a' }) as Sh),
        ...range(4).map((i) => ({ d: `M60 ${80 + i * 22}H160`, st: shade('#6f8f3a', 0.25), sw: 1.2 }) as Sh),
        { d: capsule([110, 176], 14, [110, 60], 14), f: '#5e7f30' },
        { d: ell([110, 60], 14, 6), f: '#8bab52' },
        ...[226, 250, 274].flatMap((x) => [{ d: capsule([x, 190], 10, [x, 84], 10), f: '#6f8f3a' } as Sh, { d: ell([x, 84], 10, 4), f: '#8bab52' } as Sh]),
      ]} />
      <Hand x={70} y={238} a={20} s={0.8} pose="press" side="L" arm={200} {...EL.ZEYNEP} />
      <Hand x={150} y={238} a={-20} s={0.8} pose="press" side="R" arm={200} {...EL.ZEYNEP} />
    </Scene2>
  ),

  'sf-ys-yaprak-kavanoz': () => (
    <Scene2 bg="closeup">
      <Jar x={160} y={226} w={120} h={180} fill={MAT.brine} level={0.86}>
        <O sh={[
          ...range(5).flatMap((i) => leafRoll(-44 + i * 22, -6, 52, 9)),
          ...range(5).flatMap((i) => leafRoll(-44 + i * 22, -64, 52, 9)),
          { d: ell([0, -124], 50, 6), f: '#fff' },
          ...flatStone(0, -128, 46, 22),
        ]} />
      </Jar>
    </Scene2>
  ),

  'sf-ys-tuz-alma': () => (
    <Scene2 bg="closeup">
      <O sh={[
        { d: 'M30 150H290L270 214Q266 222 256 222H64Q54 222 50 214Z', f: '#c9d1da' },
        { d: ell([160, 150], 130, 18), f: shade('#c9d1da', 0.2) },
        { d: ell([160, 152], 120, 13), f: tint(K.water, 0.45) },
        ...range(5).flatMap((i) => leafRoll(70 + i * 22, 156, 30, 7).map((sh) => ({ ...sh, t: `rotate(90 ${70 + i * 22} 150)` }))),
        ...pepper(210, 146, 70, 40, '#7aa83a'), ...pepper(236, 154, 80, 40, '#8bb04a'),
      ]} />
      <path d="M258 56Q266 100 262 146" stroke={K.waterLight} stroke-width={6} fill="none" stroke-linecap="round" />
      <Jug x={190} y={70} a={56} s={0.9} />
      <Hand x={164} y={-4} a={140} s={0.75} pose="fist" side="L" arm={80} {...EL.ZEYNEP} />
    </Scene2>
  ),

  /* ───── Zeytin (ZEYNEP) ───── */
  'sf-ys-zeytin-cizme': () => (
    <Scene2 bg="closeup">
      <Board x={14} y={60} w={292} h={156} />
      <O sh={[
        ...[[50, 100], [80, 120], [56, 150], [94, 160], [130, 110], [70, 186]].flatMap(([x, y], i) => olive(x, y, 11, '#7c9a3a', true, -20 + i * 15)),
        ...olive(176, 150, 15, '#7c9a3a', false, 0),
        ...[[248, 180], [276, 160], [262, 200]].flatMap(([x, y]) => [...olive(x, y, 11, '#7c9a3a', false, 20), { d: `M${x - 6} ${y - 4}l5 4l-3 5`, st: K.out, sw: 1.4 } as Sh]),
        ...flatStone(262, 132, 56, 34),
      ]} />
      <Knife x={176} y={110} a={90} s={0.9} len={60} />
      <Hand x={180} y={34} a={180} s={0.8} pose="fist" side="R" arm={60} {...EL.ZEYNEP} />
    </Scene2>
  ),

  'sf-ys-zeytin-salamura': () => (
    <Scene2 bg="closeup">
      <Crock x={160} y={226} s={1.25} c={MAT.glaze}>
        <O s={1.25} sh={[
          { d: rrect(-40, -122, 80, 108, 8), f: MAT.brine },
          ...range(16).flatMap((i) => olive(-28 + (i % 4) * 19, -24 - Math.floor(i / 4) * 16, 7.5, '#7c9a3a', true, (i * 37) % 60 - 30)),
          { d: rrect(-38, -98, 76, 8, 2), f: MAT.wood },
          ...flatStone(0, -98, 40, 22),
          { d: rrect(-40, -122, 80, 108, 8), st: K.out, sw: 3 },
          ln([[-40, -112], [40, -112]], K.water, 1.6),
        ]} />
      </Crock>
      <Label x={160} y={22} text="1 L + 120 g" size={15} />
    </Scene2>
  ),

  'sf-ys-zeytin-sele': () => (
    <Scene2 bg="closeup">
      <O sh={[
        { d: 'M50 70H270L250 170Q248 176 240 176H80Q72 176 70 170Z', f: '#d1a85e' },
        ...range(7).map((i) => ({ d: `M${56 + i * 2.8} ${82 + i * 13}H${264 - i * 2.8}`, st: shade('#d1a85e', 0.3), sw: 1.4 }) as Sh),
        ...range(12).map((i) => ({ d: `M${64 + i * 17} 72L${76 + i * 15} 174`, st: shade('#d1a85e', 0.2), sw: 1 }) as Sh),
        { d: ell([160, 70], 110, 14), f: '#3b2f3a' },
        ...range(14).flatMap((i) => olive(70 + (i % 7) * 30, 64 + Math.floor(i / 7) * 10, 8.5, '#2f2a35', false, (i * 31) % 50 - 25)),
        { d: 'M40 212H280L272 224H48Z', f: '#c9d1da' },
        { d: ell([160, 212], 120, 6), f: '#4a2a2e' },
      ]} />
      <g fill={MAT.salt} stroke="#bdbbb4" stroke-width={0.6}>{range(30).map((i) => <rect key={i} x={66 + ((i * 41) % 190)} y={58 + ((i * 13) % 22)} width={3.4} height={3.4} />)}</g>
      <Drop x={120} y={190} s={0.9} color="#4a2a2e" /><Drop x={160} y={196} s={0.9} color="#4a2a2e" /><Drop x={200} y={188} s={0.9} color="#4a2a2e" />
    </Scene2>
  ),

  /* ───── Sirke (ZEYNEP) ───── */
  'sf-ys-sirke-uzum-ezme': () => (
    <Scene2 bg="closeup">
      <Jar x={150} y={224} w={140} h={118} lid="none" fill={tint('#7a2e4a', 0.35)} level={0.42}>
        <O sh={range(30).flatMap((i) => grape(-58 + (i % 10) * 13, -10 - Math.floor(i / 10) * 12, 6.5, i % 4 !== 0))} />
      </Jar>
      <Hand x={150} y={30} a={180} s={1} pose="hold" side="R" grip={16} arm={50} {...EL.ZEYNEP}>
        <O sh={[{ d: capsule([150, 10], 7, [150, 166], 8), f: '#c99a62' }, { d: ell([150, 176], 18, 10), f: '#b9884f' }]} />
      </Hand>
      <Arrow from={[236, 96]} to={[236, 156]} w={5} />
    </Scene2>
  ),

  'sf-ys-sirke-bez-ortu': () => (
    <Scene2 bg="closeup">
      <Jar x={150} y={226} w={128} h={150} lid="cloth" fill="#d9a65a" level={0.72}>
        <O sh={range(12).flatMap((i) => grape(-50 + (i % 6) * 20, -12 - Math.floor(i / 6) * 14, 7, true))} />
      </Jar>
      <O sh={[
        { d: 'M84 88H216', st: K.out, sw: 7 }, { d: 'M84 88H216', st: MAT.rope, sw: 4 },
        { d: 'M216 88q16 -10 18 4q-8 6 -18 -4z', f: MAT.rope },
        { d: 'M216 88q14 10 6 20', st: K.out, sw: 4 }, { d: 'M216 88q14 10 6 20', st: MAT.rope, sw: 2 },
        { d: 'M218 90q4 14 16 18', st: K.out, sw: 4 }, { d: 'M218 90q4 14 16 18', st: MAT.rope, sw: 2 },
      ]} />
    </Scene2>
  ),

  'sf-ys-sirke-anasi': () => (
    <Scene2 bg="closeup">
      <Jar x={150} y={226} w={128} h={170} lid="none" fill="#d9a65a" level={0.78}>
        <path d="M-62 -134Q-30 -142 0 -134T62 -136V-116Q30 -108 0 -116T-62 -114Z" fill="#efe0bd" stroke={K.out} stroke-width={1.4} opacity={0.95} />
      </Jar>
      <Arrow from={[290, 96]} to={[222, 98]} w={6} />
    </Scene2>
  ),

  /* ───── Tarhana (ZEYNEP) ───── */
  'sf-ys-tarhana-serme': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#c9b49a" />
      {range(12).map((i) => <rect key={i} x={(i % 4) * 82 - 6} y={Math.floor(i / 4) * 82 - 4} width={78} height={78} fill="none" stroke={shade('#c9b49a', 0.15)} stroke-width={2} />)}
      <O sh={[{ d: rrect(18, 26, 136, 190, 4), f: MAT.cloth }, { d: rrect(166, 26, 136, 190, 4), f: MAT.cloth }]} />
      <g>{crumbs(30, 38, 112, 166, 44, 6)}{crumbs(178, 38, 112, 166, 44, 6, MAT.dough, 77)}</g>
      <circle cx={318} cy={0} r={34} fill={K.fireCore} opacity={0.7} />
    </Scene2>
  ),

  'sf-ys-tarhana-ovma': () => (
    <Scene2 bg="closeup">
      <O sh={[{ d: rrect(10, 186, 300, 50, 4), f: MAT.cloth }]} />
      <g>{crumbs(30, 196, 260, 34, 60, 2.6)}</g>
      <Hand x={84} y={150} a={90} s={1.25} pose="open" side="L" view="palm" arm={80} {...EL.ZEYNEP} />
      <g>{crumbs(130, 124, 70, 20, 14, 4.2, MAT.dough, 33)}</g>
      <Hand x={232} y={136} a={-90} s={1.25} pose="press" side="L" view="back" arm={80} {...EL.ZEYNEP} />
      <g>{crumbs(110, 168, 100, 18, 16, 2.2, MAT.dough, 71)}</g>
      <Arrow from={[150, 80]} to={[104, 80]} w={5} />
      <Arrow from={[170, 80]} to={[216, 80]} w={5} />
    </Scene2>
  ),

  'sf-ys-tarhana-eleme': () => (
    <Scene2 bg="closeup">
      <O sh={[{ d: rrect(40, 206, 240, 22, 4), f: MAT.cloth }, { d: smooth([[110, 210], [160, 180], [210, 210]], true), f: '#e9c48a' }]} />
      <g fill="#e9c48a">{range(26).map((i) => <circle key={i} cx={130 + ((i * 29) % 64)} cy={140 + ((i * 17) % 40)} r={1.8} stroke={K.out} stroke-width={0.5} />)}</g>
      <O sh={[{ d: 'M86 110H234V124Q234 132 160 132Q86 132 86 124Z', f: MAT.wood }, { d: ell([160, 110], 74, 12), f: '#e6dcc6' }]} />
      <g>{crumbs(110, 102, 100, 10, 12, 4.2, MAT.dough, 11)}</g>
      <Hand x={70} y={156} a={24} s={0.75} pose="fist" side="R" arm={90} {...EL.ZEYNEP} />
      <Hand x={250} y={156} a={-24} s={0.75} pose="fist" side="L" arm={90} {...EL.ZEYNEP} />
    </Scene2>
  ),

  /* ───── Kategori kapakları ───── */
  'sf-ys-et-kapak': () => (
    <Scene2 bg="outdoor">
      <O sh={[
        ...eave(42, 210),
        ln([[10, 54], [200, 54]], K.out, 2.6), ln([[10, 54], [200, 54]], MAT.rope, 1.4),
        ...[[34, 60, 84, 34], [78, 58, 92, 38]].flatMap(([x, y, h, w]) => [
          { d: smooth([[x - w * 0.4, y], [x + w * 0.45, y - 2], [x + w * 0.55, y + h * 0.45], [x + w * 0.4, y + h], [x - w * 0.35, y + h + 4], [x - w * 0.55, y + h * 0.5]], true), f: shade(MAT.cemen, 0.12) } as Sh,
        ]),
      ]} />
      {[124, 150, 176].map((x) => <Fish key={x} x={x} y={92} s={0.5} a={90} dried stripes={false} />)}
      <Crock x={150} y={226} s={0.55} c={MAT.clay} />
      <O sh={[
        { d: 'M262 96L224 208H300Z', f: '#d8cdb0' },
        ln([[262, 88], [218, 210]], '#7b4e2e', 3), ln([[262, 88], [306, 210]], '#7b4e2e', 3),
        { d: 'M252 208Q262 186 272 208Z', f: '#3b3434' },
      ]} />
      <Smoke x={242} y={62} w={40} h={26} kind="cloud" op={0.75} />
    </Scene2>
  ),

  'sf-ys-meyve-sebze-kapak': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <circle cx={40} cy={36} r={16} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
      <O sh={[
        { d: rrect(196, 0, 8, 24, 2), f: MAT.wood }, ...range(8).flatMap((i) => pepper(200 + (i % 2 ? 4 : -4), 22 + i * 12, i % 2 ? -24 : 24, 26)),
        { d: rrect(256, 0, 8, 24, 2), f: MAT.wood }, ...range(8).flatMap((i) => pepper(260 + (i % 2 ? 4 : -4), 22 + i * 12, i % 2 ? -24 : 24, 26, '#c4302a')),
        ...kerevet(16, 214, 150, 44, 24),
        ...range(12).flatMap((i) => apricot(32 + (i % 6) * 22 + Math.floor(i / 6) * 7, 162 - Math.floor(i / 6) * 11, 8)),
      ]} />
      <Jar x={210} y={222} w={44} h={64} fill={MAT.brine} level={0.85}>
        <O sh={range(3).flatMap((i) => cucumber(-12 + i * 12, -28, 48, 5, 90))} />
      </Jar>
      <Jar x={258} y={222} w={44} h={64} fill={tint('#d2382f', 0.3)} level={0.85}>
        <O sh={range(3).flatMap((i) => pepper(-10 + i * 10, -54, 0, 44, '#d2382f'))} />
      </Jar>
    </Scene2>
  ),

  'sf-ys-sut-kapak': () => (
    <Scene2 bg="indoor" wall="#dcecf5">
      <O sh={[
        { d: rrect(10, 160, 300, 12, 3), f: MAT.wood },
        { d: rrect(24, 172, 10, 50, 2), f: shade(MAT.wood, 0.15) }, { d: rrect(286, 172, 10, 50, 2), f: shade(MAT.wood, 0.15) },
        // kâsede yoğurt ve tahta kaşık
        { d: 'M26 124Q30 160 72 160Q114 160 118 124Z', f: '#e9e3d3' },
        { d: 'M84 124H118Q114 160 72 160Q84 150 84 124Z', f: shade('#e9e3d3', 0.1), no: true },
        { d: ell([72, 124], 46, 9), f: '#f8f4e8' },
        { d: capsule([96, 122], 3, [112, 98], 3), f: MAT.wood },
        { d: ell([92, 124], 9, 5), f: MAT.wood },
        // tülbentte süzme
        ln([[150, 20], [150, 52]], K.out, 2.4),
        { d: smooth([[140, 52], [160, 52], [176, 80], [168, 104], [150, 110], [132, 104], [124, 80]], true), f: '#f6f3ea' },
        { d: 'M140 52l10 -6l10 6', st: K.out, sw: 2 },
        { d: 'M144 160H164L162 140H146Z', f: '#c9d1da' },
        // teneke ve peynir
        { d: rrect(186, 104, 60, 56, 3), f: '#c9d1da' },
        { d: rrect(192, 94, 22, 18, 3), f: '#fbfaf3' }, { d: rrect(218, 94, 22, 18, 3), f: '#fbfaf3' },
        // yayık
        { d: smooth([[258, 160], [252, 120], [262, 74], [284, 70], [300, 120], [296, 160]], true), f: MAT.wood },
        ln([[256, 96], [300, 96]], K.out, 2.4), ln([[254, 132], [298, 132]], K.out, 2.4),
      ]} />
      <Drop x={150} y={124} s={0.7} color="#e8e2a8" />
    </Scene2>
  ),

  'sf-ys-tahil-kiler-kapak': () => (
    <Scene2 bg="indoor" wall="#cfc6b6">
      <g fill="none" stroke={shade('#cfc6b6', 0.12)} stroke-width={1.6}>
        {range(6).map((r) => range(7).map((c) => <rect key={r + '-' + c} x={c * 52 - (r % 2) * 26} y={r * 30} width={52} height={30} rx={4} />))}
      </g>
      <O sh={[
        { d: rrect(10, 104, 300, 9, 2), f: MAT.wood },
        ...[30, 74].flatMap((x) => [{ d: smooth([[x - 18, 104], [x - 20, 70], [x - 8, 56], [x + 8, 56], [x + 20, 70], [x + 18, 104]], true), f: '#e8dcc0' } as Sh, { d: `M${x - 8} 58l8 -8l8 8`, st: K.out, sw: 2 } as Sh]),
        ...[124, 168].flatMap((x) => [{ d: smooth([[x - 16, 104], [x - 20, 80], [x - 12, 62], [x + 12, 62], [x + 20, 80], [x + 16, 104]], true), f: '#3f6f6a' } as Sh, { d: rrect(x - 12, 56, 24, 8, 2), f: shade('#3f6f6a', 0.2) } as Sh]),
        ln([[230, 10], [230, 100]], MAT.rope, 3),
        ...range(5).flatMap((i) => [{ d: ell([230 + (i % 2 ? 7 : -7), 26 + i * 15], 9, 8), f: '#c9884a' } as Sh]),
        ln([[276, 10], [276, 90]], MAT.rope, 3),
        ...range(4).flatMap((i) => [{ d: ell([276 + (i % 2 ? 6 : -6), 26 + i * 15], 8, 7), f: '#f3ecdc' } as Sh]),
        { d: rrect(10, 178, 300, 12, 3), f: MAT.wood },
        { d: smooth([[40, 178], [44, 150], [80, 140], [116, 150], [120, 178]], true), f: '#c88a44' },
        { d: 'M60 156l10 -6M80 152l10 -6M100 156l8 -5', st: shade('#c88a44', 0.3), sw: 2.4 },
        { d: rrect(176, 160, 96, 18, 6), f: '#9b9890' },
        { d: rrect(180, 140, 88, 20, 6), f: '#b0ada4' },
        { d: ell([224, 140], 10, 3), f: '#5e5b55' },
        { d: capsule([256, 138], 3, [256, 116], 3), f: MAT.wood },
      ]} />
    </Scene2>
  ),
};
