// Sıfırdan paketi sahneleri (b): güneş imbiği, dezenfeksiyon ve dezenfektan hazırlama rehberleri.
// Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, Campfire, Cloth, Drop, Flame, Hand, K, Label, No, OG, OW, Ok, Person, POSE, Pot, Scene2, Smoke, Stove, Table, Timer, Tree, Wall, Waves, Window,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Rig } from '../../../src/art/kit2';

/* ═══════════════ Oyuncular (rehber başına sabit) ═══════════════ */
const CAST = {
  /** sabun / el yıkama */
  sab: { who: 'woman', skin: 2, hair: 'ponytail', hairC: K.hair.black, role: 'helper', bottomC: K.pants.dark } as const,
  /** güneş ve ısıyla temizlik */
  gun: { who: 'woman', skin: 1, hair: 'scarf', hairC: '#7a6aa8', role: 'bystander2', sleeve: 'long', bottom: 'longskirt', bottomC: '#5b5f78' } as const,
  /** yanlış dezenfektan: kapalı çadırdaki çocuk */
  dum: { who: 'boy', skin: 1, hairC: K.hair.dark, role: 'bystander3' } as const,
  /** kireç: göz koruyucu (gözlük), uzun kol, eldiven */
  krc: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.dark, mustache: true, role: 'bystander4', sleeve: 'long', bottomC: K.pants.grey, glasses: true } as const,
  /** elektroliz */
  elk: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'helper', sleeve: 'long', bottomC: K.pants.dark, glasses: true } as const,
};

/* ═══════════════ Paket renkleri ═══════════════ */
const C = {
  water: K.water,
  salt: '#7fb6d9', // tuzlu su (imbik havuzu)
  bucket: '#5b8fd1', // plastik kova
  bucketLid: '#3f6fae',
  jug: '#eaf5fb', // şeffaf ölçü kabı
  bleach: '#f6f3e6', // çamaşır suyu sıvısı
  lime: '#f3f1ea', // kireç
  ash: '#9b9a96', // kül
  glove: '#f0c23b', // eldiven
  handle: '#3d5a99', // makas sapı
  steel: '#b8c2cc',
  pc: '#c3ccd5', // düdüklü tencere
  cloth: K.cloth,
  graphite: '#4a4d55',
};

/* ═══════════════ Yardımcılar ═══════════════ */
const T = (x: number, y: number, s = 1, a = 0) => `translate(${x} ${y})${a ? ` rotate(${a})` : ''}${s !== 1 ? ` scale(${s})` : ''}`;
const G = ({ x, y, s = 1, a = 0, children }: { x: number; y: number; s?: number; a?: number; children?: ComponentChildren }) => <g transform={T(x, y, s, a)}>{children}</g>;
const txt = (x: number, y: number, t: string, size = 12, fill: string = K.ink, w = 700) => (
  <text x={x} y={y} font-size={size} font-weight={w} fill={fill} text-anchor="middle" font-family="'IBM Plex Sans', system-ui, sans-serif">{t}</text>
);
const gloves = (r: Rig) => (
  <g>
    <path d={circ(r.handB, 5.2 * r.s)} fill={shade(C.glove, 0.15)} stroke={K.out} stroke-width={1.4} />
    <path d={circ(r.handF, 5.6 * r.s)} fill={C.glove} stroke={K.out} stroke-width={1.4} />
  </g>
);

/** Makas. x,y = mafsal; a = bıçakların yönü; open = açıklık (derece) */
function Scissors({ x, y, s = 1, a = 0, open = 18, blood, rust }: { x: number; y: number; s?: number; a?: number; open?: number; blood?: boolean; rust?: boolean }) {
  const bl = rust ? '#9a6440' : C.steel;
  const hc = rust ? '#6e4a36' : C.handle;
  const piece = (r: number) => [
    { d: 'M0 -3.2L38 -0.8Q39.5 0 38 0.8L0 3.2Z', f: bl, t: `rotate(${r})` },
    { d: 'M0 -2.6L-12 -2.6L-12 2.6L0 2.6Z', f: bl, t: `rotate(${r})` },
    { d: circ([-21, 0], 8.5) + circ([-21, 0], 5), f: hc, fr: 'evenodd' as const, t: `rotate(${r})` },
  ];
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[...piece(-open / 2), ...piece(open / 2), { d: circ([0, 0], 2.4), f: shade(bl, 0.3) }]} />
      {blood && <g fill={K.blood}><ellipse cx={22} cy={-2} rx={6} ry={2.6} transform={`rotate(${-open / 2} 0 0)`} /><ellipse cx={30} cy={3} rx={4} ry={2} transform={`rotate(${open / 2} 0 0)`} /><circle cx={8} cy={0} r={2.4} /></g>}
      {rust && <g fill="#7a3b1c" opacity={0.85}><circle cx={14} cy={-2} r={2.2} /><circle cx={26} cy={2.6} r={1.8} /><circle cx={-20} cy={-6} r={2} /><circle cx={6} cy={2} r={1.6} /></g>}
    </G>
  );
}
/** İğne. x,y = merkez */
const Needle = ({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[{ d: 'M-22 -1.6L18 -0.6L24 0L18 0.6L-22 1.6Z', f: C.steel }, { d: ell([-17, 0], 3, 1), f: '#fff', no: true }]} />
  </G>
);
/** Maşa (pens). x,y = arka uç; a = yön; open = uç açıklığı */
const Tongs = ({ x, y, s = 1, a = 0, open = 6 }: { x: number; y: number; s?: number; a?: number; open?: number }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[
      { d: capsule([0, -1.5], 3, [64, -open], 2.2), f: C.steel },
      { d: capsule([0, 1.5], 3, [64, open], 2.2), f: shade(C.steel, 0.12) },
      { d: circ([0, 0], 4.5), f: shade(C.steel, 0.2) },
    ]} />
  </G>
);
/** Plastik kova. x,y = taban ortası. fill: sıvı rengi (ağızdan görünür) */
function Bucket({ x, y, s = 1, color = C.bucket, liq, lid, label, handle = true }: { x: number; y: number; s?: number; color?: string; liq?: string; lid?: boolean; label?: string; handle?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW / s} sh={[
        ...(handle && !lid ? [{ d: 'M-23 -40Q0 -72 23 -40', st: K.out, sw: 2.6 }] : []),
        { d: 'M-24 -46H24L19 -2Q19 0 17 0H-17Q-19 0 -19 -2Z', f: color },
        { d: 'M10 -46H24L19 -2Q19 0 17 0H8Z', f: shade(color, 0.14), no: true },
        { d: 'M-24.5 -40H24.5', st: shade(color, 0.3), sw: 1.4 },
        lid ? { d: rrect(-27, -52, 54, 8, 3), f: C.bucketLid } : { d: ell([0, -46], 24, 5), f: liq ?? shade(color, 0.35) },
      ]} />
      {label && (
        <g>
          <rect x={-17} y={-34} width={34} height={20} rx={2} fill="#fff" stroke={K.out} stroke-width={1.2 / s} />
          {txt(0, -20, label, 11, K.ink)}
        </g>
      )}
    </G>
  );
}
/** Şeffaf ölçü kabı. x,y = taban ortası; fill 0..1; text = kabın üstündeki yazı */
function Jug({ x, y, s = 1, fill = 0.6, liq = C.water, text, a = 0 }: { x: number; y: number; s?: number; fill?: number; liq?: string; text?: string; a?: number }) {
  const h = 58;
  const wl = -h * fill;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[
        { d: 'M20 -48Q36 -46 34 -30Q32 -18 20 -16', st: K.out, sw: 5 },
        { d: 'M20 -48Q36 -46 34 -30Q32 -18 20 -16', st: C.jug, sw: 2.4 },
        { d: `M-22 -${h}L-26 -${h + 6}H22V-2Q22 0 20 0H-20Q-22 0 -22 -2Z`, f: C.jug },
        { d: `M-22 ${wl}H22V-2Q22 0 20 0H-20Q-22 0 -22 -2Z`, f: liq, no: true, op: 0.85 },
        { d: 'M-22 -14H-12M-22 -28H-12M-22 -42H-12', st: K.out, sw: 1.2 },
      ]} />
      {text && txt(4, -24, text, 12, K.ink)}
    </G>
  );
}
/** Çamaşır suyu şişesi (beyaz, saplı, mavi kapak). x,y = taban ortası */
function Bleach({ x, y, s = 1, a = 0, text = '%5' }: { x: number; y: number; s?: number; a?: number; text?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[
        { d: 'M-16 -2V-44Q-16 -52 -8 -56L-4 -58V-64H6V-58Q16 -54 16 -44V-2Q16 0 14 0H-14Q-16 0 -16 -2Z', f: '#fbfbf8' },
        { d: 'M6 -54Q20 -52 18 -36', st: K.out, sw: 5 },
        { d: 'M6 -54Q20 -52 18 -36', st: '#fbfbf8', sw: 2.4 },
        { d: rrect(-5, -70, 12, 8, 2), f: '#2f6fc0' },
        { d: rrect(-13, -36, 26, 24, 2), f: '#2f6fc0' },
      ]} />
      {text && txt(0, -19, text, 10, '#fff')}
    </G>
  );
}
/** Kapaklı tencere (kitteki Pot + kapak). boil: kenardan buhar */
function LidPot({ x, y, s = 1, steam = true, color = '#8e99a6' }: { x: number; y: number; s?: number; steam?: boolean; color?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <Pot x={0} y={0} boil={false} color={color} />
      <OG sh={[
        { d: 'M-23 -28Q-20 -40 0 -41Q20 -40 23 -28Z', f: tint(color, 0.15) },
        { d: rrect(-6, -46, 12, 6, 2), f: K.ink },
      ]} />
      {steam && (
        <g fill="none" stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.95}>
          <path d="M-24 -32c-5 -5 3 -9 -2 -15" />
          <path d="M24 -32c5 -5 -3 -9 2 -15" />
          <path d="M-8 -48c-4-5 4-8 0-14" />
          <path d="M8 -48c-4-5 4-8 0-14" />
        </g>
      )}
    </G>
  );
}
/** Kesit tencere: arka iç duvar, içerik (children), su, ön kenar. x,y = taban ortası, s ölçek. lvl = su yüksekliği (yerel) */
function PotCut({ x, y, s = 1, w = 120, h = 74, lvl = 54, lid, children }: { x: number; y: number; s?: number; w?: number; h?: number; lvl?: number; lid?: boolean; children?: ComponentChildren }) {
  const hw = w / 2;
  return (
    <g>
      <G x={x} y={y} s={s}>
        <OG ow={OW / s} sh={[
          { d: capsule([-hw - 10, -h + 10], 4, [-hw - 1, -h + 10], 4), f: '#77818d' },
          { d: capsule([hw + 1, -h + 10], 4, [hw + 10, -h + 10], 4), f: '#77818d' },
          { d: `M${-hw} ${-h}H${hw}V-4Q${hw} 0 ${hw - 4} 0H${-hw + 4}Q${-hw} 0 ${-hw} -4Z`, f: '#5f6873' },
          { d: `M${-hw + 5} ${-h}H${hw - 5}V-9Q${hw - 5} -5 ${hw - 9} -5H${-hw + 9}Q${-hw + 5} -5 ${-hw + 5} -9Z`, f: '#cfd6dd', no: true },
        ]} />
      </G>
      {children}
      <G x={x} y={y} s={s}>
        <path d={`M${-hw + 5} ${-lvl}H${hw - 5}V-9Q${hw - 5} -5 ${hw - 9} -5H${-hw + 9}Q${-hw + 5} -5 ${-hw + 5} -9Z`} fill={K.water} opacity={0.5} />
        <path d={`M${-hw + 5} ${-lvl}H${hw - 5}`} stroke={K.waterLight} stroke-width={2.4 / s} />
        {lid && <OG ow={OW / s} sh={[{ d: `M${-hw - 3} ${-h}Q${-hw + 4} ${-h - 16} 0 ${-h - 17}Q${hw - 4} ${-h - 16} ${hw + 3} ${-h}Z`, f: '#9aa4af' }, { d: rrect(-8, -h - 24, 16, 8, 2), f: K.ink }]} />}
      </G>
    </g>
  );
}
/** Düdüklü tencere. x,y = taban ortası. steam: düdükten buhar; cut: kesit içerik (children) */
function PCooker({ x, y, s = 1, steam, whistle, cut, children }: { x: number; y: number; s?: number; steam?: boolean; whistle?: boolean; cut?: boolean; children?: ComponentChildren }) {
  return (
    <g>
      <G x={x} y={y} s={s}>
        <OG ow={OW / s} sh={[
          { d: capsule([-44, -50], 4, [-36, -50], 4), f: K.ink },
          { d: 'M-36 -58H36V-4Q36 0 32 0H-32Q-36 0 -36 -4Z', f: C.pc },
          { d: 'M18 -58H36V-4Q36 0 32 0H18Z', f: shade(C.pc, 0.12), no: true },
          ...(cut ? [{ d: 'M-31 -58H31V-8Q31 -5 28 -5H-28Q-31 -5 -31 -8Z', f: '#e3e8ec' }] : []),
        ]} />
      </G>
      {children}
      <G x={x} y={y} s={s}>
        {cut && <path d="M-31 -16H31V-8Q31 -5 28 -5H-28Q-31 -5 -31 -8Z" fill={K.water} opacity={0.75} />}
        <OG ow={OW / s} sh={[
          { d: 'M-39 -58Q-36 -70 0 -72Q36 -70 39 -58Z', f: tint(C.pc, 0.2) },
          { d: rrect(30, -68, 54, 9, 4), f: K.ink },
          { d: rrect(-5, -82, 10, 11, 2), f: K.ink },
          { d: circ([-16, -66], 3), f: K.danger },
        ]} />
        {steam && (
          <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round">
            <path d="M0 -86c-6 -6 5 -10 -1 -18" />
            <path d="M6 -88c4 -8 -4 -12 3 -20" />
          </g>
        )}
        {whistle && <Waves x={10} y={-92} a={-60} n={3} r={6} />}
      </G>
    </g>
  );
}
/** Eldivenli el (sade eldiven). x,y = bilek; a = parmak yönü (0 = yukarı); arm = önkol uzunluğu */
const Glove = ({ x, y, s = 1, a = 0, arm = 120, sleeve = K.role.helper, flip }: { x: number; y: number; s?: number; a?: number; arm?: number; sleeve?: string; flip?: boolean }) => (
  <g transform={`${T(x, y, s, a)}${flip ? ' scale(-1 1)' : ''}`}>
    <OG ow={OW / s} sh={[
      { d: capsule([0, 8], 13, [0, arm], 15), f: sleeve },
      { d: rrect(-15, -6, 30, 18, 5), f: shade(C.glove, 0.1) },
      { d: 'M-13 -4C-15 -20 -14 -38 -4 -44C6 -48 15 -40 14 -26C14 -16 13 -8 13 -4Z', f: C.glove },
      { d: capsule([-12, -10], 5.5, [-22, -26], 4.5), f: C.glove },
      { d: 'M-5 -40V-28M3 -42V-28', st: shade(C.glove, 0.3), sw: 1.2 },
    ]} />
  </g>
);
/** Etiketli şişe (opak). x,y = taban ortası */
function LabelBottle({ x, y, s = 1, color = '#e8e2d4', cap = K.danger, band, lines, lc = K.danger, w = 30, h = 76, neck = 12, a = 0, fs = 9 }: { x: number; y: number; s?: number; color?: string; cap?: string; band?: string; lines?: string[]; lc?: string; w?: number; h?: number; neck?: number; a?: number; fs?: number }) {
  const hw = w / 2;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={OW / s} sh={[
        { d: `M${-hw} -3V${-h + 16}Q${-hw} ${-h + 8} -5 ${-h + 4}V${-h - neck + 6}H5V${-h + 4}Q${hw} ${-h + 8} ${hw} ${-h + 16}V-3Q${hw} 0 ${hw - 3} 0H${-hw + 3}Q${-hw} 0 ${-hw} -3Z`, f: color },
        { d: rrect(-6.5, -h - neck - 2, 13, 9, 2), f: cap },
        ...(band ? [{ d: `M${-hw} ${-h + 24}H${hw}V${-h + 34}H${-hw}Z`, f: band }] : []),
      ]} />
      {lines && (
        <g>
          <rect x={-hw + 3} y={-h * 0.62} width={w - 6} height={lines.length * (fs + 2) + 6} rx={2} fill="#fff" stroke={K.out} stroke-width={1 / s} />
          {lines.map((l, i) => txt(0, -h * 0.62 + fs + 3 + i * (fs + 2), l, fs, i === 0 ? lc : K.ink))}
        </g>
      )}
    </G>
  );
}
/** Güneş. x,y merkez */
const Sun = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => (
  <g>
    {Array.from({ length: 10 }, (_, i) => {
      const a = (i * 36 * Math.PI) / 180;
      return <line key={i} x1={x + Math.cos(a) * (r + 4)} y1={y + Math.sin(a) * (r + 4)} x2={x + Math.cos(a) * (r + 11)} y2={y + Math.sin(a) * (r + 11)} stroke="#f5b53a" stroke-width={3} stroke-linecap="round" />;
    })}
    <circle cx={x} cy={y} r={r} fill="#ffd54a" stroke={K.out} stroke-width={1.5} />
  </g>
);
/** Kabarcıklar (köpük) */
const Bubbles = ({ pts, r = 4 }: { pts: P[]; r?: number }) => (
  <g>{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={r * (0.7 + (i % 3) * 0.25)} fill="#fff" fill-opacity={0.85} stroke={K.waterLight} stroke-width={1.2} />)}</g>
);
/** Ayırıcı çizgi (iki panelli sahnelerde) */
const Divider = ({ x = 160 }: { x?: number }) => <line x1={x} y1={22} x2={x} y2={218} stroke={K.out} stroke-width={1.5} stroke-dasharray="5 5" opacity={0.45} />;

/* ═══════════════ Sahneler ═══════════════ */
export const SCENES: Record<string, () => JSX.Element> = {};

/** Leğen. x,y = taban ortası, w = ağız genişliği */
function Basin({ x, y, w = 120, h = 34, color = '#8ea7bd', liq = K.water, foam }: { x: number; y: number; w?: number; h?: number; color?: string; liq?: string; foam?: boolean }) {
  const hw = w / 2;
  return (
    <g>
      <OG sh={[
        { d: `M${x - hw} ${y - h}H${x + hw}L${x + hw * 0.78} ${y - 2}Q${x + hw * 0.78} ${y} ${x + hw * 0.74} ${y}H${x - hw * 0.74}Q${x - hw * 0.78} ${y} ${x - hw * 0.78} ${y - 2}Z`, f: color },
        { d: ell([x, y - h], hw, 7), f: shade(color, 0.1) },
        { d: ell([x, y - h + 1], hw - 5, 5), f: liq },
      ]} />
      {foam && <Bubbles pts={[[x - hw * 0.6, y - h - 2], [x - hw * 0.3, y - h - 4], [x + hw * 0.1, y - h - 3], [x + hw * 0.5, y - h - 2], [x + hw * 0.7, y - h]]} r={5} />}
    </g>
  );
}
/** Fırça. x,y = sap ucu, a = yön (0 = sağa) */
const Brush = ({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[
      { d: rrect(0, -5, 44, 10, 4), f: '#c0603e' },
      { d: rrect(28, -9, 26, 18, 3), f: K.wood },
      { d: 'M31 9V17M36 9V17M41 9V17M46 9V17M51 9V17', st: '#e9d9a6', sw: 3 },
    ]} />
  </G>
);

Object.assign(SCENES, {
  /* ───── Güneş imbiği ───── */
  'sf-sd-imbik-kesit': () => {
    const gy = (x: number) => 98 + (x - 46) * 0.324; // camın alt yüzü
    return (
      <Scene2 bg="outdoor">
        <Sun x={150} y={38} r={15} />
        <g stroke="#f5b53a" stroke-width={3} stroke-linecap="round" stroke-dasharray="7 6">
          <path d="M164 60L190 140" />
          <path d="M138 62L124 140" />
          <path d="M150 62L156 140" />
        </g>
        {/* havuz */}
        <OG sh={[
          { d: rrect(36, 92, 12, 116, 2), f: K.wood },
          { d: 'M36 176H272V208H36Z', f: K.wood },
          { d: 'M46 182H264V202H46Z', f: '#2a2a30' },
          { d: 'M48 190H262V202H48Z', f: C.salt, no: true },
        ]} />
        {/* buhar */}
        {[100, 160, 215].map((x) => <path key={x} d={`M${x} 186c-5 -6 5 -10 0 -16c-5 -6 5 -10 0 -16`} fill="none" stroke="#fff" stroke-width={2.6} stroke-linecap="round" opacity={0.95} />)}
        {/* cam */}
        <path d={`M44 ${gy(44) - 4}L272 ${gy(272) - 4}`} stroke={K.out} stroke-width={8} stroke-linecap="round" />
        <path d={`M44 ${gy(44) - 4}L272 ${gy(272) - 4}`} stroke="#d6eefa" stroke-width={5} stroke-linecap="round" />
        {[86, 130, 176, 222].map((x) => <path key={x} d={`M${x} ${gy(x) + 1}a3.2 3.2 0 1 0 0.1 0`} fill={K.water} stroke={K.out} stroke-width={1} />)}
        <Arrow from={[120, gy(120) + 14]} to={[236, gy(236) + 12]} color={K.water} w={4} />
        {/* oluk ve hortum */}
        <OG sh={[
          { d: 'M266 168V182Q266 188 272 188H284Q290 188 290 182V168', st: K.out, sw: 4 },
          { d: 'M268 180H288V182Q288 186 284 186H272Q268 186 268 182Z', f: K.water, no: true },
          { d: 'M282 188C284 200 296 198 296 210', st: '#3d6b4f', sw: 5 },
        ]} />
        <OG sh={[{ d: 'M284 208H306V224Q306 228 302 228H288Q284 228 284 224Z', f: C.jug }, { d: 'M285 216H305V224Q305 227 302 227H288Q285 227 285 224Z', f: K.water, no: true }]} />
      </Scene2>
    );
  },
  'sf-sd-imbik-oluk': () => {
    const a: P = [10, 40], b: P = [236, 152];
    const on = (t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + 10];
    return (
      <Scene2 bg="closeup">
        <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={K.out} stroke-width={14} stroke-linecap="round" />
        <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke="#d6eefa" stroke-width={10} stroke-linecap="round" />
        {[0.25, 0.5, 0.75].map((t) => { const p = on(t); return <path key={t} d="M0 -6C2 -3 5 -1 5 2A5 5 0 0 1 -5 2C-5 -1 -2 -3 0 -6Z" transform={`translate(${p[0]} ${p[1] + 4})`} fill={K.water} stroke={K.out} stroke-width={1.2} />; })}
        <Arrow from={on(0.32)} to={[on(0.68)[0], on(0.68)[1]]} color={K.water} w={4} />
        <path d="M0 -6C2 -3 5 -1 5 2A5 5 0 0 1 -5 2C-5 -1 -2 -3 0 -6Z" transform="translate(240 168)" fill={K.water} stroke={K.out} stroke-width={1.2} />
        {/* oluk kesiti */}
        <OG sh={[
          { d: 'M212 150V174Q212 186 224 186H256Q268 186 268 174V150', st: K.out, sw: 6 },
          { d: 'M215 172H265V174Q265 183 256 183H224Q215 183 215 174Z', f: K.water, no: true },
        ]} />
        {/* hortum → kapaklı şişe */}
        <OG sh={[
          { d: 'M120 230V186Q120 176 130 172V160H154V172Q164 176 164 186V230Z', f: C.jug },
          { d: 'M121 206H163V229H121Z', f: K.water, no: true, op: 0.85 },
        ]} />
        <path d="M240 186C240 222 196 214 190 190C184 160 142 140 142 168" fill="none" stroke={K.out} stroke-width={10} stroke-linecap="round" />
        <path d="M240 186C240 222 196 214 190 190C184 160 142 140 142 168" fill="none" stroke="#4d8a62" stroke-width={7} stroke-linecap="round" />
      </Scene2>
    );
  },

  /* ───── Üç seviye ───── */
  'sf-sd-kirli-alet': () => (
    <Scene2 bg="closeup">
      <Divider />
      {/* yanlış: kanlı makas doğrudan klora */}
      <Basin x={80} y={214} w={110} h={30} liq="#d9e9a6" />
      <Scissors x={70} y={96} s={1.4} a={70} open={22} blood />
      <Arrow from={[40, 120]} to={[48, 170]} w={5} />
      <No x={80} y={140} r={62} />
      {/* doğru: önce sabun, su ve fırça */}
      <Basin x={240} y={214} w={130} h={30} foam />
      <Scissors x={212} y={176} s={1.3} a={-12} open={30} />
      <Brush x={300} y={128} s={1.25} a={150} />
      <Ok x={290} y={44} r={15} />
    </Scene2>
  ),
  'sf-sd-steril-alet': () => (
    <Scene2 bg="closeup">
      <Scissors x={58} y={92} s={1.3} a={0} open={14} />
      <Needle x={74} y={140} s={1.3} />
      <Arrow from={[116, 118]} to={[164, 118]} />
      <Stove x={216} y={226} s={1.7} />
      <PCooker x={216} y={182} s={1.25} steam whistle />
    </Scene2>
  ),

  /* ───── Kaynatma ───── */
  'sf-sd-alet-tencere': () => (
    <Scene2 bg="closeup">
      <PotCut x={160} y={222} s={1.7} w={130} h={80} lvl={56}>
        <Scissors x={122} y={200} s={1.35} a={-6} open={32} />
        <Tongs x={150} y={186} s={0.95} a={-4} open={8} />
        <Needle x={210} y={204} s={1.1} a={4} />
      </PotCut>
    </Scene2>
  ),
  'sf-sd-20-dk': () => (
    <Scene2 bg="indoor">
      <Table x={50} y={226} w={220} h={46} />
      <Stove x={160} y={180} s={1.8} />
      <LidPot x={160} y={180 - 26 * 1.8} s={2.0} />
      <Timer x={64} y={56} r={20} text="20 dk" />
    </Scene2>
  ),
  'sf-sd-masa-ile-alma': () => {
    const h = { x: 290, y: 60, a: -118, s: 1.15, pose: 'hold', side: 'R', grip: 12 } as const;
    const g = handPoint(h, 'grip');
    const d: P = [Math.cos((152 * Math.PI) / 180), Math.sin((152 * Math.PI) / 180)];
    const st: P = [g[0] - d[0] * 22, g[1] - d[1] * 22];
    const tip: P = [st[0] + d[0] * 64 * 1.9, st[1] + d[1] * 64 * 1.9];
    return (
      <Scene2 bg="closeup">
        <Pot x={110} y={232} s={2.6} />
        <Scissors x={tip[0] + 2} y={tip[1] + 4} s={1.2} a={96} open={8} />
        <Hand {...h} arm={200} sleeve={K.role.helper} skin={1}>
          <Tongs x={st[0]} y={st[1]} s={1.9} a={152} open={3} />
        </Hand>
      </Scene2>
    );
  },

  /* ───── Düdüklü ───── */
  'sf-sd-duduklu-izgara': () => (
    <Scene2 bg="closeup">
      <PCooker x={160} y={226} s={2.1} cut>
        {/* ters tabak */}
        <OG sh={[{ d: 'M112 184Q160 162 208 184Z', f: '#f2f2ee' }]} />
        {/* beze sarılı aletler */}
        <OG sh={[{ d: 'M118 172Q120 146 160 144Q202 146 202 172Q160 180 118 172Z', f: C.cloth }, { d: 'M134 150L146 172M186 150L176 172', st: shade(C.cloth, 0.2), sw: 1.4 }]} />
        <Scissors x={196} y={152} s={0.9} a={-160} open={10} />
      </PCooker>
      <path d="M100 140c-6 -8 6 -12 0 -20M220 140c-6 -8 6 -12 0 -20M160 140c-6 -8 6 -12 0 -20" fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />
    </Scene2>
  ),
  'sf-sd-duduklu-30-dk': () => (
    <Scene2 bg="indoor">
      <Table x={40} y={226} w={240} h={46} />
      <Stove x={160} y={182} s={1.6} />
      <PCooker x={160} y={182 - 26 * 1.6} s={1.15} steam whistle />
      <Timer x={56} y={52} r={20} text="30 dk" />
    </Scene2>
  ),
  'sf-sd-duduklu-bekle': () => (
    <Scene2 bg="indoor">
      <Table x={30} y={226} w={260} h={46} />
      <PCooker x={140} y={180} s={1.5} />
      <Hand x={250} y={70} a={-100} s={0.95} pose="fist" side="R" arm={120} sleeve={K.role.helper} skin={1} />
      <Arrow from={[230, 58]} to={[176, 60]} bend={0.3} w={5} />
      <No x={210} y={78} r={40} />
    </Scene2>
  ),
});

/** Sabun kalıbı. x,y = merkez */
const Soap = ({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[{ d: rrect(-20, -11, 40, 22, 9), f: '#f2c6d6' }, { d: rrect(-12, -5, 24, 6, 3), f: shade('#f2c6d6', 0.12), no: true }]} />
  </G>
);
/** Bidon (su kabı). x,y = taban ortası */
const Jerrycan = ({ x, y, s = 1, a = 0, color = '#e2c34a' }: { x: number; y: number; s?: number; a?: number; color?: string }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[
      { d: rrect(-22, -56, 44, 56, 6), f: color },
      { d: rrect(-14, -66, 18, 12, 3), f: shade(color, 0.15) },
      { d: rrect(-10, -62, 10, 5, 2), f: tint(color, 0.4), no: true },
      { d: rrect(10, -64, 9, 10, 2), f: '#2f6fc0' },
      { d: 'M-16 -42H16M-16 -24H16', st: shade(color, 0.25), sw: 1.4 },
    ]} />
  </G>
);
/** Kucak dolusu yorgan / kumaş katları. x,y = sol üst */
const Quilt = ({ x, y, w, h, color = '#7aa6d6' }: { x: number; y: number; w: number; h: number; color?: string }) => (
  <OG sh={[
    { d: rrect(x, y, w, h, 6), f: color },
    { d: `M${x + w / 3} ${y + 3}V${y + h - 3}M${x + (2 * w) / 3} ${y + 3}V${y + h - 3}M${x + 3} ${y + h / 2}H${x + w - 3}`, st: shade(color, 0.22), sw: 1.4 },
  ]} />
);

Object.assign(SCENES, {
  /* ───── Güneş ve ısı ───── */
  'sf-sd-camasir-kaynatma': () => {
    const st: P = [128, 96], en: P = [204, 158];
    const at = (t: number): P => [st[0] + (en[0] - st[0]) * t, st[1] + (en[1] - st[1]) * t];
    const p: PersonProps = { ...CAST.gun, x: 92, y: 224, s: 1.05, pose: { ...POSE.standSide, spine: -84, armB: { to: at(0.12) }, armF: { to: at(0.38) }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={292} y={196} s={0.8} />
        <Campfire x={214} y={226} s={1.5} />
        <Pot x={214} y={206} s={2.4} color="#6d747d" boil={false} />
        {/* çamaşırlar */}
        <OG sh={[
          { d: 'M172 140Q184 126 198 138Q206 124 222 136Q236 126 252 140Z', f: '#c6574e' },
          { d: 'M182 140Q196 132 212 140Q226 132 240 140Z', f: '#f4f1ea' },
        ]} />
        <path d="M188 120c-5 -6 5 -10 0 -18M214 116c-5 -6 5 -10 0 -18M240 120c-5 -6 5 -10 0 -18" fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />
        <path d={`M${st[0]} ${st[1]}L${en[0]} ${en[1]}`} stroke={K.out} stroke-width={7} stroke-linecap="round" />
        <path d={`M${st[0]} ${st[1]}L${en[0]} ${en[1]}`} stroke={K.wood} stroke-width={4} stroke-linecap="round" />
        <Person {...p} />
        <Label x={262} y={36} text="55 °C+" />
      </Scene2>
    );
  },
  'sf-sd-torba-bekletme': () => (
    <Scene2 bg="indoor">
      <Window x={30} y={50} />
      <Quilt x={112} y={130} w={96} h={70} color="#c6574e" />
      <OG sh={[
        { d: rrect(178, 176, 40, 22, 8), f: '#6b4f3a' },
        { d: rrect(178, 190, 44, 10, 3), f: '#3b3537' },
      ]} />
      {/* şeffaf torba */}
      <path d="M96 226Q86 150 120 116Q150 92 160 86Q170 92 200 116Q234 150 226 226Z" fill="#cfe3ef" fill-opacity={0.45} stroke={K.out} stroke-width={2} />
      <path d="M150 86Q160 78 170 86M154 80L160 70L166 80" fill="none" stroke={K.out} stroke-width={3} stroke-linecap="round" />
      <path d="M112 200Q106 160 124 134" fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.8} />
      <Label x={256} y={56} text="1–2 hafta" size={15} />
    </Scene2>
  ),
  'sf-sd-yatak-gunes': () => {
    const corner: P = [222, 168];
    const p: PersonProps = { ...CAST.gun, x: 270, y: 224, s: 1.05, flip: true, pose: { ...POSE.standSide, armF: { to: corner }, armB: { to: [226, 150] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Sun x={46} y={40} r={16} />
        <OG sh={[
          { d: rrect(28, 70, 8, 152, 2), f: K.wood },
          { d: rrect(224, 70, 8, 152, 2), f: K.wood },
          { d: 'M32 80L228 80', st: K.out, sw: 2.4 },
        ]} />
        <Quilt x={52} y={76} w={172} h={92} color="#7aa6d6" />
        <path d="M52 80H224" stroke={K.out} stroke-width={2.4} />
        <Person {...p} />
        <Arrow from={[130, 190]} to={[200, 190]} bend={-0.35} w={5} />
      </Scene2>
    );
  },

  /* ───── Yanlış dezenfektanlar ───── */
  'sf-sd-sirke-klor-yasak': () => (
    <Scene2 bg="closeup">
      <Smoke x={86} y={40} w={150} h={70} kind="cloud" color="#c4d35e" op={0.9} />
      <path d="M118 150Q114 136 128 132M200 150Q206 136 194 130" fill="none" stroke={K.water} stroke-width={4} stroke-linecap="round" />
      <LabelBottle x={70} y={120} s={1.1} a={50} color="#f1e3b8" cap="#8a5a2b" lines={['SİRKE']} lc={K.ink} fs={8} />
      <Bleach x={252} y={124} s={1.1} a={-50} />
      <Bucket x={160} y={226} s={1.6} liq="#cfdc7a" />
      <No x={160} y={186} r={46} />
    </Scene2>
  ),
  'sf-sd-duman-yasak': () => {
    const child: PersonProps = { ...CAST.dum, x: 224, y: 222, s: 1.15, pose: { ...POSE.sitFloor, spine: -76, head: -70, armF: { at: 'mouth', d: [6, 4] }, face: 'pain' } };
    const r = rig(child);
    return (
      <Scene2 bg="outdoor">
        <path d="M14 226L160 28L306 226Z" fill="#e0813c" stroke={K.out} stroke-width={2} />
        <path d="M34 222L160 52L286 222Z" fill="#f4c592" />
        <path d="M160 52V222" stroke={shade('#f4c592', 0.15)} stroke-width={2} />
        <Smoke x={60} y={70} w={200} h={70} kind="cloud" op={0.85} />
        {/* mangal */}
        <OG sh={[
          { d: 'M74 200H146L138 214H82Z', f: '#5c6470' },
          { d: 'M86 214L80 226M134 214L140 226', st: K.out, sw: 3 },
          { d: ell([110, 200], 36, 5), f: '#3a3a3a' },
        ]} />
        <g fill="#ff7b1c">{[[96, 198], [110, 196], [124, 198]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} />)}</g>
        <path d="M100 190c-6 -10 8 -16 0 -28c-6 -10 6 -16 0 -26M122 190c-6 -10 8 -16 0 -28" fill="none" stroke={K.smoke} stroke-width={4} stroke-linecap="round" opacity={0.85} />
        <Person {...child} />
        <Waves x={r.mouth[0] + 14} y={r.mouth[1]} a={0} n={2} r={5} color={K.ink} />
        <No x={110} y={182} r={40} />
      </Scene2>
    );
  },
  'sf-sd-ise-yarayanlar': () => (
    <Scene2 bg="closeup">
      <Soap x={58} y={96} s={1.4} />
      <Bubbles pts={[[40, 70], [62, 64], [80, 74]]} r={6} />
      <Ok x={90} y={118} r={11} />
      <Stove x={160} y={124} s={1.1} />
      <LidPot x={160} y={124 - 26 * 1.1} s={1.1} />
      <Ok x={192} y={118} r={11} />
      <PCooker x={256} y={124} s={0.7} steam />
      <Ok x={294} y={118} r={11} />
      <Bleach x={104} y={220} s={1.15} />
      <Ok x={136} y={210} r={11} />
      <LabelBottle x={214} y={220} s={1.15} w={40} color="#dfe9f0" cap="#2f6fc0" lines={['%60+']} lc={K.ink} fs={10} />
      <Ok x={246} y={210} r={11} />
    </Scene2>
  ),

  /* ───── Sabun ───── */
  'sf-sd-tippy-tap': () => {
    const spout: P = [186, 122];
    const hand: P = [182, 156];
    const pedal: P = [204, 214];
    const p: PersonProps = { ...CAST.sab, x: 132, y: 226, s: 1.05, pose: { ...POSE.standSide, spine: -78, chest: -70, head: -64, armB: { to: [hand[0] - 4, hand[1] + 4] }, armF: { to: hand }, legF: { to: pedal }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <OG sh={[
          { d: rrect(150, 52, 7, 172, 2), f: K.wood },
          { d: rrect(272, 52, 7, 172, 2), f: K.wood },
          { d: rrect(146, 50, 138, 7, 2), f: K.wood },
        ]} />
        <path d="M222 57V72" stroke={K.out} stroke-width={2.4} />
        <Jerrycan x={226} y={128} s={0.95} a={-28} />
        {/* ip: bidondan pedala */}
        <path d={`M232 120L${pedal[0] + 26} ${pedal[1] - 6}`} stroke="#8a6a3a" stroke-width={2.2} />
        <path d={`M${pedal[0] - 18} ${pedal[1] + 2}L${pedal[0] + 40} ${pedal[1] - 8}`} stroke={K.out} stroke-width={7} stroke-linecap="round" />
        <path d={`M${pedal[0] - 18} ${pedal[1] + 2}L${pedal[0] + 40} ${pedal[1] - 8}`} stroke={K.wood} stroke-width={4} stroke-linecap="round" />
        {/* sabun ipte */}
        <path d="M262 57V96" stroke="#8a6a3a" stroke-width={2} />
        <Soap x={262} y={104} s={0.6} a={90} />
        {/* çakıllı çukur */}
        <path d={ell([186, 222], 30, 7)} fill="#8f8a80" stroke={K.out} stroke-width={1.5} />
        <g fill="#c9c3b5">{[[172, 221], [182, 224], [194, 220], [202, 223], [178, 218]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} />)}</g>
        <path d={`M${spout[0]} ${spout[1]}Q${spout[0] - 3} ${spout[1] + 18} ${hand[0]} ${hand[1] - 6}`} fill="none" stroke={K.water} stroke-width={4} stroke-linecap="round" />
        <Person {...p} />
        <path d={`M${hand[0] + 2} ${hand[1] + 10}L${hand[0] + 4} 212`} stroke={K.water} stroke-width={3} stroke-dasharray="6 6" stroke-linecap="round" />
      </Scene2>
    );
  },
  'sf-sd-el-ovma': () => (
    <Scene2 bg="closeup">
      <Hand x={110} y={236} a={32} s={1.6} pose="press" side="L" view="back" skin={2} arm={120} sleeve={K.role.helper} />
      <Hand x={214} y={236} a={-32} s={1.6} pose="press" side="R" view="back" skin={2} arm={120} sleeve={K.role.helper} />
      <Bubbles pts={[[132, 120], [160, 104], [190, 118], [150, 140], [176, 146], [120, 150], [200, 150]]} r={6} />
      <Timer x={58} y={50} r={20} text="20 sn" />
    </Scene2>
  ),

  /* ───── Yara suyu ───── */
  'sf-sd-kapakli-sogutma': () => (
    <Scene2 bg="indoor">
      <Table x={14} y={226} w={292} h={46} />
      <Stove x={84} y={180} s={1.5} />
      <LidPot x={84} y={180 - 26 * 1.5} s={1.6} />
      <Arrow from={[138, 140]} to={[180, 140]} />
      <LidPot x={240} y={180} s={1.6} steam={false} />
      <Timer x={240} y={70} r={16} />
      <Ok x={282} y={118} r={12} />
    </Scene2>
  ),
  'sf-sd-tuz-kasik': () => {
    const h = { x: 34, y: 112, a: 96, s: 1.15, pose: 'hold', side: 'R', grip: 10 } as const;
    const g = handPoint(h, 'grip');
    const bowl: P = [g[0] + 92, g[1] + 10];
    return (
      <Scene2 bg="closeup">
        <Jug x={206} y={228} s={1.75} fill={0.72} text="½ L" />
        <g fill="#fff" stroke={K.out} stroke-width={0.8}>{[[0, 12], [3, 24], [-2, 34], [2, 46]].map(([dx, dy], i) => <rect key={i} x={bowl[0] + 12 + dx} y={bowl[1] + dy} width={3} height={3} />)}</g>
        <Hand {...h} arm={80} sleeve={K.role.helper} skin={1}>
          <OG sh={[
            { d: capsule([g[0] - 18, g[1] - 2], 3, [bowl[0] - 12, bowl[1] - 1], 2.4), f: C.steel },
            { d: ell(bowl, 15, 8), f: C.steel, t: `rotate(18 ${bowl[0]} ${bowl[1]})` },
            { d: 'M' + (bowl[0] - 10) + ' ' + (bowl[1] - 2) + 'Q' + bowl[0] + ' ' + (bowl[1] - 12) + ' ' + (bowl[0] + 12) + ' ' + (bowl[1] + 2) + 'Z', f: '#fff' },
          ]} />
        </Hand>
        <Label x={70} y={200} text="1 çay kaşığı" size={14} />
      </Scene2>
    );
  },
  'sf-sd-sise-sikma': () => {
    const h = { x: 238, y: 40, a: -135, s: 1.2, pose: 'hold', side: 'R', grip: 30 } as const;
    const g = handPoint(h, 'grip');
    const rot = (v: P, a: number): P => { const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
    const base = (() => { const v = rot([0, 38 * 1.2], -135); return [g[0] + v[0], g[1] + v[1]] as P; })();
    const capTip = (() => { const v = rot([0, -52 * 1.2], -135); return [g[0] + v[0], g[1] + v[1]] as P; })();
    const wound: P = [120, 176];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: capsule([-20, 196], 30, [340, 186], 34), f: K.skin[0] }, { d: 'M272 146H330V230H268Q262 190 272 146Z', f: K.pants.denim }]} />
        <path d={ell(wound, 26, 9)} fill="#e07a6e" stroke={K.out} stroke-width={1.2} />
        <path d="M100 174l8 -2M114 178l10 -3M128 175l8 -2" stroke={K.blood} stroke-width={2} stroke-linecap="round" />
        <path d={`M${capTip[0]} ${capTip[1]}Q${capTip[0] - 20} ${capTip[1] + 10} ${wound[0] + 6} ${wound[1] - 8}`} fill="none" stroke={K.water} stroke-width={5} stroke-linecap="round" />
        <path d={`M${capTip[0]} ${capTip[1]}Q${capTip[0] - 20} ${capTip[1] + 10} ${wound[0] + 6} ${wound[1] - 8}`} fill="none" stroke={K.waterLight} stroke-width={2} stroke-linecap="round" />
        <g>{[[92, 196], [150, 198], [104, 210]].map(([x, y], i) => <path key={i} d="M0 -6C2 -3 5 -1 5 2A5 5 0 0 1 -5 2C-5 -1 -2 -3 0 -6Z" transform={`translate(${x} ${y})`} fill={K.water} stroke={K.out} stroke-width={1} />)}</g>
        <Hand {...h} arm={160} sleeve={K.role.helper} skin={2}>
          <LabelBottle x={base[0]} y={base[1]} s={1.2} a={-135} color={C.jug} cap="#2f6fc0" w={28} h={64} neck={10} />
        </Hand>
      </Scene2>
    );
  },
});

/** Ölçü bardağı (küçük). x,y = taban ortası */
const Cup = ({ x, y, s = 1, a = 0, liq = K.water, text, color = C.jug }: { x: number; y: number; s?: number; a?: number; liq?: string; text?: string; color?: string }) => (
  <G x={x} y={y} s={s} a={a}>
    <OG ow={OW / s} sh={[
      { d: 'M-11 -28H11L9 -2Q9 0 7 0H-7Q-9 0 -9 -2Z', f: color },
      { d: 'M-10.3 -20H10.3L9 -2Q9 0 7 0H-7Q-9 0 -9 -2Z', f: liq, no: true, op: 0.9 },
    ]} />
    {text && txt(0, -32, text, 9)}
  </G>
);
/** Grafit çubuk (elektrot). x = merkez, y1..y2 */
const Rod = ({ x, y1, y2, w = 8, color = C.graphite }: { x: number; y1: number; y2: number; w?: number; color?: string }) => (
  <OG sh={[{ d: rrect(x - w / 2, y1, w, y2 - y1, w / 2), f: color }, { d: `M${x - w / 4} ${y1 + 4}V${y2 - 4}`, st: tint(color, 0.3), sw: 1.4 }]} />
);
/** Akü. x,y = taban ortası */
const Battery = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[
      { d: rrect(-38, -52, 76, 52, 4), f: '#3b3f4b' },
      { d: rrect(-38, -52, 76, 10, 3), f: '#555b68' },
      { d: rrect(-30, -60, 12, 9, 2), f: K.danger },
      { d: rrect(18, -60, 12, 9, 2), f: '#1e1e24' },
    ]} />
    {txt(0, -18, '12 V', 15, '#fff')}
  </G>
);

Object.assign(SCENES, {
  /* ───── Doğum malzemesi ───── */
  'sf-sd-dogum-icerik': () => (
    <Scene2 bg="floor">
      <rect x={14} y={14} width={292} height={212} rx={10} fill="#cfe3ef" stroke={K.out} stroke-width={2} />
      <Soap x={56} y={52} s={1.2} />
      {/* katlı naylon örtü */}
      <OG sh={[{ d: rrect(100, 30, 74, 46, 3), f: '#e8f2f8' }, { d: 'M100 53H174M137 30V76', st: '#a9c7da', sw: 1.4 }]} />
      {/* bez yığını */}
      <OG sh={[{ d: rrect(196, 28, 86, 54, 4), f: K.cloth }, { d: 'M196 46H282M196 64H282', st: shade(K.cloth, 0.18), sw: 1.4 }]} />
      {/* havlu */}
      <OG sh={[{ d: rrect(30, 100, 86, 62, 4), f: '#efe2c4' }, { d: 'M30 112H116M30 150H116', st: '#c6574e', sw: 3 }]} />
      {/* bebek battaniyesi ve şapka */}
      <OG sh={[{ d: rrect(132, 98, 80, 66, 4), f: '#f2c14e' }, { d: 'M136 106H208', st: shade('#f2c14e', 0.2), sw: 1.4 }]} />
      <OG sh={[{ d: 'M226 150Q226 112 252 112Q278 112 278 150Z', f: '#9cc7e8' }, { d: rrect(222, 146, 60, 10, 4), f: tint('#9cc7e8', 0.3) }]} />
      {/* ambalajlı jilet */}
      <OG sh={[{ d: rrect(44, 180, 64, 34, 3), f: '#fff' }, { d: rrect(54, 188, 44, 18, 2), f: C.steel }, { d: 'M64 197H88', st: K.out, sw: 2 }]} />
      {/* kâğıda sarılı iplikler */}
      <OG sh={[{ d: rrect(136, 178, 72, 38, 3), f: '#f3ecdc' }]} />
      <path d="M144 190Q172 184 200 190M144 197Q172 191 200 197M144 204Q172 198 200 204" fill="none" stroke="#fff" stroke-width={3.4} />
      <path d="M144 190Q172 184 200 190M144 197Q172 191 200 197M144 204Q172 198 200 204" fill="none" stroke={K.out} stroke-width={0.8} />
      {/* bez çanta */}
      <OG sh={[{ d: 'M232 222L238 182H292L298 222Z', f: '#a08a5c' }, { d: 'M248 182Q265 160 282 182', st: K.out, sw: 3 }]} />
    </Scene2>
  ),
  'sf-sd-bez-kaynatma': () => (
    <Scene2 bg="indoor">
      <Table x={40} y={226} w={240} h={46} />
      <Stove x={160} y={180} s={1.8} />
      <Pot x={160} y={180 - 26 * 1.8} s={2.4} boil={false} />
      <OG sh={[
        { d: 'M112 66Q126 50 142 62Q152 48 168 60Q184 48 198 62Q206 56 210 66Z', f: K.cloth },
        { d: 'M128 66Q144 58 160 66Q176 58 190 66Z', f: shade(K.cloth, 0.08) },
      ]} />
      <path d="M126 46c-5 -6 5 -10 0 -18M160 42c-5 -6 5 -10 0 -18M194 46c-5 -6 5 -10 0 -18" fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />
      <Timer x={58} y={52} r={20} text="20 dk" />
    </Scene2>
  ),
  'sf-sd-jilet-makas': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(18, 88, 82, 50, 4), f: '#fff' }, { d: rrect(30, 100, 58, 26, 3), f: C.steel }, { d: 'M42 113H76', st: K.out, sw: 2.4 }, { d: circ([36, 113], 3) + circ([82, 113], 3), f: '#fff' }]} />
      <Ok x={86} y={80} r={12} />
      <PotCut x={160} y={200} s={0.95} w={90} h={66} lvl={50} lid>
        <Scissors x={140} y={180} s={0.85} a={-4} open={26} />
      </PotCut>
      <Ok x={202} y={118} r={12} />
      <Scissors x={262} y={112} s={1.0} a={0} open={22} rust />
      <No x={266} y={112} r={40} />
    </Scene2>
  ),

  /* ───── Klor oranları ───── */
  'sf-sd-klor-40ml': () => {
    const h = { x: 92, y: 62, a: 110, s: 1.05, pose: 'hold', side: 'R', grip: 22 } as const;
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Bleach x={56} y={228} s={1.15} />
        <Jug x={212} y={228} s={1.8} fill={0.7} text="1 L" />
        <path d={`M${g[0] + 24} ${g[1] + 10}Q${g[0] + 40} ${g[1] + 16} ${g[0] + 44} ${g[1] + 44}`} fill="none" stroke="#e4dc8e" stroke-width={5} stroke-linecap="round" />
        <Hand {...h} arm={120} sleeve={K.role.helper} skin={1}>
          <Cup x={g[0] - 8} y={g[1] + 10} s={1.0} a={118} liq="#e4dc8e" />
        </Hand>
        <Label x={56} y={128} text="40 ml" />
        <Label x={262} y={40} text="%0,2" />
      </Scene2>
    );
  },
  'sf-sd-klor-1-9': () => (
    <Scene2 bg="closeup">
      <Cup x={48} y={124} s={1.25} liq="#e4dc8e" />
      {txt(48, 152, '1', 18)}
      {txt(84, 106, '+', 26)}
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <Cup key={`${r}${c}`} x={118 + c * 32} y={76 + r * 40} s={1.05} />))}
      {txt(150, 182, '9', 18)}
      <Arrow from={[204, 120]} to={[236, 150]} bend={-0.2} />
      <Bucket x={268} y={226} s={1.15} liq="#d9e9b0" />
      <Label x={268} y={52} text="%0,5" />
    </Scene2>
  ),
  'sf-sd-klor-etiketli-kova': () => {
    const h = { x: 248, y: 116, a: -120, s: 1.2, pose: 'hold', side: 'R', grip: 10 } as const;
    const g = handPoint(h, 'grip');
    const d: P = [-0.866, 0.5];
    return (
      <Scene2 bg="closeup">
        <Bucket x={150} y={232} s={2.5} lid handle={false} />
        <rect x={110} y={140} width={80} height={52} rx={3} fill="#fff" stroke={K.out} stroke-width={1.6} />
        {txt(150, 162, '%0,5', 18, K.ink)}
        {txt(150, 182, '3 Kas', 13, K.ink, 600)}
        <Hand {...h} arm={150} sleeve={K.role.helper} skin={1}>
          <OG sh={[{ d: capsule([g[0] - d[0] * 26, g[1] - d[1] * 26], 5.5, [g[0] + d[0] * 30, g[1] + d[1] * 30], 4.5), f: '#2b2d3a' }, { d: capsule([g[0] + d[0] * 30, g[1] + d[1] * 30], 3, [g[0] + d[0] * 37, g[1] + d[1] * 37], 1.6), f: '#555' }]} />
        </Hand>
      </Scene2>
    );
  },

  /* ───── Elektroliz ───── */
  'sf-sd-elektroliz-yer': () => {
    const p: PersonProps = { ...CAST.elk, x: 268, y: 226, s: 1.0, flip: true, pose: { ...POSE.standSide, spine: -88, armF: [96, 88], armB: [92, 86], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={196} y={170} s={1.4} />
        <Table x={112} y={224} w={128} h={60} />
        <OG sh={[{ d: rrect(130, 140, 48, 24, 3), f: '#dfeef6' }, { d: 'M131 148H177V161Q177 163 175 163H133Q131 163 131 161Z', f: '#bfe0f2', no: true }]} />
        <Rod x={146} y1={128} y2={158} w={5} />
        <Rod x={162} y1={128} y2={158} w={5} />
        <Battery x={212} y={164} s={0.5} />
        <path d="M146 128Q170 110 200 134M162 128Q190 116 222 134" fill="none" stroke={K.out} stroke-width={2} />
        <Person {...p} over={gloves} />
        <Campfire x={36} y={204} s={0.7} />
        <No x={36} y={190} r={22} />
      </Scene2>
    );
  },
  'sf-sd-elektrot-secimi': () => (
    <Scene2 bg="closeup">
      <line x1={20} y1={122} x2={300} y2={122} stroke={K.out} stroke-width={1.5} stroke-dasharray="5 5" opacity={0.45} />
      <Rod x={74} y1={30} y2={108} w={12} />
      <Rod x={104} y1={30} y2={108} w={12} />
      <OG sh={[{ d: rrect(150, 34, 44, 72, 3), f: '#8fa7b8' }]} />
      <path d="M156 44H188M156 56H188M156 68H188M156 80H188M156 92H188M164 38V102M174 38V102M184 38V102" stroke={shade('#8fa7b8', 0.3)} stroke-width={1.2} />
      <Ok x={232} y={70} r={16} />
      {/* yanlışlar */}
      <OG sh={[{ d: 'M40 144H50V146L46 212L45 216L44 212L40 146Z', f: '#8b8f96' }, { d: rrect(34, 140, 22, 6, 2), f: '#8b8f96' }]} />
      <OG sh={[{ d: ell([108, 156], 12, 16), f: C.steel }, { d: capsule([108, 170], 3.5, [108, 216], 3), f: C.steel }]} />
      <path d="M160 148c14 0 14 10 0 10s-14 10 0 10s14 10 0 10s-14 10 0 10s14 10 0 10" fill="none" stroke={K.out} stroke-width={6} stroke-linecap="round" />
      <path d="M160 148c14 0 14 10 0 10s-14 10 0 10s14 10 0 10s-14 10 0 10s14 10 0 10" fill="none" stroke="#c7773d" stroke-width={3.4} stroke-linecap="round" />
      <OG sh={[{ d: rrect(214, 144, 18, 72, 2), f: '#d8dde2' }]} />
      {[[62, 200], [126, 200], [186, 200], [250, 200]].map(([x, y], i) => <Bad key={i} x={x} y={y} r={11} />)}
    </Scene2>
  ),
  'sf-sd-elektroliz-duzenek': () => (
    <Scene2 bg="outdoor">
      <rect x={0} y={196} width={320} height={44} fill={K.wood} stroke={K.out} stroke-width={1.5} />
      {/* şeffaf plastik kap */}
      <path d="M50 100H210V192Q210 196 206 196H54Q50 196 50 192Z" fill="#e6f2f8" fill-opacity={0.7} stroke={K.out} stroke-width={2} />
      <path d="M52 122H208V192Q208 194 206 194H54Q52 194 52 192Z" fill="#bfe0f2" opacity={0.9} />
      <Rod x={104} y1={78} y2={178} w={11} />
      <Rod x={158} y1={78} y2={178} w={11} />
      <OG sh={[{ d: rrect(40, 94, 180, 10, 3), f: K.wood }]} />
      {/* kabarcıklar */}
      <g fill="#fff" stroke={K.waterLight} stroke-width={1}>{[[96, 160], [112, 146], [98, 132], [150, 164], [166, 150], [152, 134], [114, 170], [168, 172]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6 + (i % 2)} />)}</g>
      {/* klemens + kablo */}
      <OG sh={[{ d: rrect(96, 70, 16, 12, 3), f: K.danger }, { d: rrect(150, 70, 16, 12, 3), f: '#1e1e24' }]} />
      <path d="M104 70C110 30 232 30 248 128" fill="none" stroke={K.out} stroke-width={5} />
      <path d="M104 70C110 30 232 30 248 128" fill="none" stroke={K.danger} stroke-width={3} />
      <path d="M158 70C166 46 280 50 296 128" fill="none" stroke={K.out} stroke-width={5} />
      <path d="M158 70C166 46 280 50 296 128" fill="none" stroke="#1e1e24" stroke-width={3} />
      <Battery x={272} y={194} s={0.9} />
    </Scene2>
  ),
});

const SKULL = (x: number, y: number, s = 1, c = '#fff') => (
  <g transform={T(x, y, s)}>
    <path d="M-10 4C-14 -2 -13 -14 0 -14C13 -14 14 -2 10 4V9H-10Z" fill={c} />
    <circle cx={-4.5} cy={-3} r={3.2} fill={K.danger} />
    <circle cx={4.5} cy={-3} r={3.2} fill={K.danger} />
    <path d="M-5 9V13M0 9V13M5 9V13" stroke={c} stroke-width={2.4} />
  </g>
);
const FLAME_ICON = (x: number, y: number, s = 1, c = '#fff') => (
  <path transform={T(x, y, s)} d="M0 12C-9 12 -11 4 -8 -2C-6 -6 -2 -8 -2 -14C4 -10 6 -5 5 -1C7 -3 8 -5 8 -7C12 -2 12 6 7 10C5 11.5 3 12 0 12Z" fill={c} />
);
/** İÇİLMEZ etiketi (kırmızı). x,y = sol üst */
const DangerTag = ({ x, y, w = 110, h = 44, big = 15 }: { x: number; y: number; w?: number; h?: number; big?: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={4} fill={K.danger} stroke={K.out} stroke-width={1.5} />
    {SKULL(x + 17, y + h / 2 - 1, 0.95)}
    {txt(x + w / 2 + 8, y + h / 2 + big * 0.36, 'İÇİLMEZ', big, '#fff', 800)}
  </g>
);
/** Damıtma çıkışındaki toplama kavanozu. x,y = taban ortası */
const Jar = ({ x, y, s = 1, fill = 0.5, liq = '#e8eef4' }: { x: number; y: number; s?: number; fill?: number; liq?: string }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[
      { d: 'M-16 -40H16V-36Q20 -34 20 -28V-3Q20 0 17 0H-17Q-20 0 -20 -3V-28Q-20 -34 -16 -36Z', f: C.jug },
      { d: `M-19.5 ${-36 * fill}H19.5V-3Q19.5 -0.5 17 -0.5H-17Q-19.5 -0.5 -19.5 -3Z`, f: liq, no: true },
    ]} />
  </G>
);
/** Alkolmetre ve ölçek silindir. x,y = taban ortası */
const Hydrometer = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <G x={x} y={y} s={s}>
    <OG ow={OW / s} sh={[
      { d: rrect(-30, -6, 60, 6, 2), f: C.jug },
      { d: 'M-18 -150H18V-6H-18Z', f: C.jug },
      { d: 'M-17 -112H17V-6H-17Z', f: '#dde8f0', no: true },
      { d: capsule([0, -60], 9, [0, -30], 9), f: '#fbfbf8' },
      { d: rrect(-3.5, -150, 7, 92, 3), f: '#fbfbf8' },
      { d: 'M-3.5 -140H1M-3.5 -130H3.5M-3.5 -120H1M-3.5 -110H3.5M-3.5 -100H1M-3.5 -90H3.5M-3.5 -80H1', st: K.out, sw: 1 },
    ]} />
    <path d="M-17 -112H17" stroke={K.water} stroke-width={2.4 / s} />
  </G>
);

Object.assign(SCENES, {
  /* ───── Kireç ───── */
  'sf-sd-kirec-koruyucu': () => {
    const L: P = [132, 150], R: P = [188, 150];
    const p: PersonProps = { ...CAST.krc, x: 160, y: 230, s: 1.25, pose: { ...POSE.stand, armB: { to: L }, armF: { to: R }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Wall x={0} y={200} w={70} h={150} kind="brick" />
        <Person {...p} only={['legB', 'legF', 'torso', 'head']} />
        <OG sh={[{ d: 'M126 148H194L198 214H122Z', f: '#ece3cb' }, { d: 'M126 148L134 140H186L194 148', f: '#ddd2b5' }]} />
        {txt(160, 186, 'KİREÇ', 14, K.ink, 800)}
        <Person {...p} only={['armB', 'armF']} over={gloves} />
      </Scene2>
    );
  },
  'sf-sd-kirec-sondurme': () => {
    const hand: P = [150, 132];
    const cup: P = [204, 168];
    const p: PersonProps = { ...CAST.krc, x: 88, y: 226, s: 1.08, pose: { ...POSE.standSide, spine: -98, chest: -100, head: -118, armF: { to: hand }, armB: { to: [hand[0] - 10, hand[1] + 4] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Basin x={226} y={226} w={120} h={30} color="#8e99a6" liq="#e9e6dc" />
        <g>{[[200, 194], [222, 190], [244, 194], [214, 198], [236, 199]].map(([x, y], i) => <path key={i} d={ell([x, y], 9, 6)} fill={C.lime} stroke={K.out} stroke-width={1.2} />)}</g>
        <path d="M206 180c-6 -8 6 -14 0 -24M228 176c-6 -8 6 -14 0 -24M250 180c-6 -8 6 -14 0 -24" fill="none" stroke="#fff" stroke-width={3.4} stroke-linecap="round" />
        <path d={`M${hand[0]} ${hand[1]}L${cup[0]} ${cup[1]}`} stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={`M${hand[0]} ${hand[1]}L${cup[0]} ${cup[1]}`} stroke={K.wood} stroke-width={3} stroke-linecap="round" />
        <OG sh={[{ d: 'M196 162Q204 178 216 166Z', f: '#8e99a6' }]} />
        <Drop x={216} y={180} s={0.7} />
        <Person {...p} over={gloves} />
      </Scene2>
    );
  },
  'sf-sd-badana': () => {
    const tip: P = [214, 104];
    const p: PersonProps = { ...CAST.krc, x: 130, y: 226, s: 1.1, pose: { ...POSE.standSide, spine: -86, armF: { to: [178, 122] }, armB: { to: [168, 130] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <rect x={60} y={24} width={260} height={180} fill="#b7aa98" stroke={K.out} stroke-width={2} />
        <g stroke={shade('#b7aa98', 0.2)} stroke-width={1.4} fill="none">
          {[54, 84, 114, 144, 174].map((y, i) => <path key={y} d={`M60 ${y}H320`} />)}
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${90 + (i % 2) * 30 + i * 40} 24V200`} opacity={0.4} />)}
        </g>
        <rect x={60} y={24} width={152} height={180} fill="#f6f4ee" stroke={K.out} stroke-width={2} />
        <path d="M212 24V204" stroke="#e9e6dc" stroke-width={6} />
        <path d={`M172 126L${tip[0] - 8} ${tip[1] + 6}`} stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={`M172 126L${tip[0] - 8} ${tip[1] + 6}`} stroke={K.wood} stroke-width={3} stroke-linecap="round" />
        <OG sh={[{ d: rrect(tip[0] - 8, tip[1] - 12, 12, 26, 3), f: '#e9d9a6' }]} />
        <Bucket x={70} y={228} s={0.8} liq={C.lime} />
        <Person {...p} over={gloves} />
      </Scene2>
    );
  },

  /* ───── Kül suyu ───── */
  'sf-sd-kul-secimi': () => (
    <Scene2 bg="closeup">
      <Divider x={124} />
      <OG sh={[{ d: capsule([38, 82], 9, [86, 74], 9), f: K.trunk }, { d: circ([86, 74], 9), f: '#e3c49a' }]} />
      <Arrow from={[62, 98]} to={[62, 130]} w={4} />
      <OG sh={[{ d: 'M18 200Q30 148 62 144Q96 148 106 200Z', f: C.ash }]} />
      <Ok x={62} y={220 - 6} r={12} />
      {/* yanlışlar */}
      <OG sh={[{ d: ell([158, 150], 14, 10), f: '#2b2b30' }, { d: ell([178, 158], 12, 9), f: '#38383e' }, { d: ell([164, 166], 11, 8), f: '#222226' }]} />
      <OG sh={[{ d: 'M214 132L240 128L246 150L238 170L214 166L208 148Z', f: '#4f9ad6' }, { d: rrect(222, 120, 12, 10, 2), f: K.danger }]} />
      <OG sh={[{ d: rrect(258, 120, 22, 60, 2), f: K.wood }, { d: rrect(258, 120, 22, 30, 2), f: '#3fa36b' }]} />
      {[[170, 200], [228, 200], [270, 200]].map(([x, y], i) => <Bad key={i} x={x} y={y} r={11} />)}
    </Scene2>
  ),
  'sf-sd-kul-suzme': () => {
    const h = { x: 96, y: 66, a: 100, s: 1.05, pose: 'hold', side: 'R', grip: 22 } as const;
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        {/* kova kesiti: dipte kül, üstte berrak sıvı */}
        <OG sh={[{ d: 'M20 130H104L98 226H26Z', f: '#5b8fd1' }, { d: 'M25 136H99L94 222H31Z', f: '#efe9c6', no: true }, { d: 'M28 190H96L94 222H31Z', f: C.ash, no: true }]} />
        {/* kavanoz ve bez */}
        <OG sh={[{ d: 'M168 140H262V222Q262 228 256 228H174Q168 228 168 222Z', f: C.jug }, { d: 'M169 176H261V222Q261 227 256 227H174Q169 227 169 222Z', f: '#efe9c6', no: true }]} />
        <OG sh={[{ d: 'M160 140Q215 166 270 140L266 132H164Z', f: K.cloth }, { d: 'M164 146H266', st: '#8a6a3a', sw: 3 }]} />
        <rect x={180} y={190} width={70} height={22} rx={2} fill="#fff" stroke={K.out} stroke-width={1.2} />
        {txt(215, 205, 'KÜL SUYU', 11, K.danger, 800)}
        <path d={`M${g[0] + 30} ${g[1] + 4}Q${g[0] + 50} ${g[1] + 20} 214 150`} fill="none" stroke="#e8dfa6" stroke-width={5} stroke-linecap="round" />
        <Hand {...h} arm={100} sleeve={K.role.helper} skin={1}>
          <Cup x={g[0] - 6} y={g[1] + 14} s={1.3} a={120} liq="#efe9c6" />
        </Hand>
      </Scene2>
    );
  },
  'sf-sd-kul-tencere': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: capsule([8, 150], 9, [80, 140], 9), f: K.ink }, { d: ell([170, 140], 98, 74), f: '#6d747d' }, { d: ell([170, 140], 86, 64), f: '#8e99a6' }]} />
      <g fill="#8a6a3a" opacity={0.7}>{[[130, 110, 16, 9], [200, 170, 20, 10], [210, 104, 12, 7], [140, 176, 10, 6]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} />)}</g>
      <Cloth x={186} y={136} w={56} h={34} a={-12} color="#efe9c6" wet />
      <Glove x={226} y={170} s={1.0} a={-40} arm={140} />
      <Arrow from={[120, 94]} to={[118, 182]} bend={0.55} w={5} />
    </Scene2>
  ),

  /* ───── Alkol 1: maya ───── */
  'sf-sd-maya-agiz-bez': () => (
    <Scene2 bg="closeup">
      <Divider />
      <Bucket x={80} y={222} s={1.9} handle={false} liq="#e6d7a0" />
      <OG sh={[{ d: 'M28 132Q80 150 132 132L136 122H24Z', f: K.cloth }, { d: 'M30 142Q80 156 130 142', st: '#8a6a3a', sw: 3 }]} />
      <path d="M60 112c-4 -6 4 -10 0 -16M96 112c-4 -6 4 -10 0 -16" fill="none" stroke="#9aa3ad" stroke-width={2.6} stroke-linecap="round" />
      <Ok x={136} y={44} r={13} />
      {/* sıkı kapalı, şişmiş */}
      <OG sh={[{ d: 'M190 132Q182 180 196 220H284Q298 180 290 132Z', f: C.bucket }, { d: rrect(186, 122, 108, 12, 3), f: C.bucketLid }]} />
      <path d="M180 150l-10 -4M178 176l-12 0M300 150l10 -4M302 176l12 0" stroke={K.danger} stroke-width={3} stroke-linecap="round" />
      <No x={240} y={170} r={52} />
    </Scene2>
  ),
  'sf-sd-maya-havalanan': () => (
    <Scene2 bg="indoor">
      <Window x={34} y={46} w={80} h={70} />
      <Bucket x={74} y={222} s={1.15} handle={false} lid={false} liq="#e6d7a0" />
      <OG sh={[{ d: 'M44 172Q74 182 104 172L106 166H42Z', f: K.cloth }]} />
      <Arrow from={[96, 150]} to={[96, 104]} bend={-0.3} w={4} color={K.waterLight} />
      <Ok x={132} y={44} r={13} />
      {/* kapalı bodrum */}
      <rect x={160} y={0} width={160} height={240} fill="#3a3f4a" />
      <path d="M160 0V240" stroke={K.out} stroke-width={2} />
      <g fill="#59606c" stroke={K.out} stroke-width={1.5}>{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={170 + i * 22} y={60 + i * 26} width={150 - i * 22} height={26} />)}</g>
      <Bucket x={286} y={222} s={0.9} handle={false} liq="#e6d7a0" />
      <Smoke x={240} y={176} w={80} h={24} kind="cloud" color="#7a818b" op={0.6} />
      <No x={276} y={186} r={34} />
    </Scene2>
  ),
  'sf-sd-icilmez-etiket': () => (
    <Scene2 bg="closeup">
      <OG sh={[
        { d: 'M96 226V92Q96 80 110 76L130 70V52H162V70L196 78Q214 82 214 96V226Z', f: '#dfe3e6' },
        { d: rrect(126, 38, 40, 16, 3), f: K.danger },
        { d: 'M196 96Q240 98 238 134Q236 160 214 162', st: K.out, sw: 9 },
        { d: 'M196 96Q240 98 238 134Q236 160 214 162', st: '#dfe3e6', sw: 5 },
      ]} />
      <rect x={84} y={112} width={142} height={82} rx={5} fill={K.danger} stroke={K.out} stroke-width={2} />
      {SKULL(110, 140, 1.4)}
      {FLAME_ICON(200, 140, 1.4)}
      {txt(155, 182, 'İÇİLMEZ', 22, '#fff', 800)}
    </Scene2>
  ),

  /* ───── Alkol 2: imbik (şematik) ───── */
  'sf-sd-imbik-guvenlik': () => (
    <Scene2 bg="outdoor">
      <Arrow from={[150, 30]} to={[90, 30]} w={4} color="#9fb3c8" />
      <Arrow from={[190, 48]} to={[130, 48]} w={4} color="#9fb3c8" />
      {/* kazan + ateş */}
      <Campfire x={80} y={212} s={1.2} />
      <OG sh={[{ d: 'M52 186V140Q52 124 80 122Q108 124 108 140V186Q108 192 102 192H58Q52 192 52 186Z', f: '#c7773d' }, { d: rrect(70, 108, 20, 16, 3), f: shade('#c7773d', 0.15) }]} />
      {/* boru → soğutma kovası */}
      <path d="M80 110Q80 92 120 92H162" fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" />
      <path d="M80 110Q80 92 120 92H162" fill="none" stroke="#c7773d" stroke-width={4} stroke-linecap="round" />
      <Bucket x={172} y={196} s={1.3} liq={K.water} handle={false} />
      <path d="M162 92V118" stroke={K.out} stroke-width={7} /><path d="M162 92V118" stroke="#c7773d" stroke-width={4} />
      <path d="M184 172H204V186" fill="none" stroke={K.out} stroke-width={7} /><path d="M184 172H204V186" fill="none" stroke="#c7773d" stroke-width={4} />
      <Jar x={204} y={222} s={0.8} />
      <Label x={210} y={128} text="İÇİLMEZ" size={11} bg={K.danger} />
      {/* güvenlik: su ve kum kovası */}
      <Bucket x={262} y={226} s={0.8} liq={K.water} />
      <Bucket x={298} y={226} s={0.8} liq="#d9c08a" />
      <Ok x={280} y={150} r={11} />
    </Scene2>
  ),
  'sf-sd-imbik-malzeme': () => (
    <Scene2 bg="closeup">
      <line x1={20} y1={120} x2={300} y2={120} stroke={K.out} stroke-width={1.5} stroke-dasharray="5 5" opacity={0.45} />
      <path d="M40 40H90c16 0 16 14 0 14H60c-16 0 -16 14 0 14H90c16 0 16 14 0 14H40" fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
      <path d="M40 40H90c16 0 16 14 0 14H60c-16 0 -16 14 0 14H90c16 0 16 14 0 14H40" fill="none" stroke="#c7773d" stroke-width={5} stroke-linecap="round" />
      <OG sh={[{ d: 'M150 34H166V58Q190 70 190 88Q190 108 158 108Q126 108 126 88Q126 70 150 58Z', f: '#e6f2f8' }]} />
      <Ok x={228} y={70} r={15} />
      {/* yanlışlar: radyatör, lehimli boru */}
      <OG sh={[{ d: rrect(30, 140, 90, 70, 3), f: '#a3adb8' }]} />
      <path d="M40 146V204M52 146V204M64 146V204M76 146V204M88 146V204M100 146V204M112 146V204" stroke={shade('#a3adb8', 0.35)} stroke-width={2} />
      <path d="M150 176H260" stroke={K.out} stroke-width={10} stroke-linecap="round" /><path d="M150 176H260" stroke="#c7773d" stroke-width={7} stroke-linecap="round" />
      <path d={ell([190, 176], 9, 9) + ell([226, 176], 8, 8)} fill="#8b8f96" stroke={K.out} stroke-width={1.4} />
      <Bad x={128} y={146} r={12} />
      <Bad x={272} y={150} r={12} />
    </Scene2>
  ),
  'sf-sd-bas-atma': () => (
    <Scene2 bg="closeup">
      <path d="M10 60H180Q200 60 200 80V96" fill="none" stroke={K.out} stroke-width={11} stroke-linecap="round" />
      <path d="M10 60H180Q200 60 200 80V96" fill="none" stroke="#c7773d" stroke-width={7} stroke-linecap="round" />
      <Drop x={200} y={112} s={0.8} color="#e8eef4" />
      {/* ilk akan kısım: çay bardağına, atılacak */}
      <G x={200} y={222} s={1.7}>
        <OG ow={OW / 1.7} sh={[
          { d: 'M-13 -44Q-8 -30 -11 -16Q-14 -5 -9 0H9Q14 -5 11 -16Q8 -30 13 -44Z', f: C.jug },
          { d: 'M-10.6 -22Q-12.5 -12 -11 -8Q-12 -3 -8.5 -0.6H8.5Q12 -3 11 -8Q12.5 -12 10.6 -22Z', f: '#e8eef4', no: true },
        ]} />
      </G>
      <Label x={200} y={140} text="BAŞ" size={13} bg={K.white} />
      <Bad x={238} y={168} r={14} />
      {/* sonrası için ayrı kavanoz */}
      <Jar x={76} y={222} s={1.5} fill={0} />
      <Label x={76} y={146} text="İÇİLMEZ" size={12} bg={K.danger} />
    </Scene2>
  ),

  /* ───── Alkol 3: ölçme ───── */
  'sf-sd-alkolmetre': () => (
    <Scene2 bg="closeup">
      <Hydrometer x={110} y={226} s={1.3} />
      {/* büyüteç */}
      <path d="M134 80L196 74" stroke={K.out} stroke-width={1.5} stroke-dasharray="4 4" />
      <circle cx={236} cy={80} r={46} fill="#fff" stroke={K.out} stroke-width={3} />
      <path d="M200 92H272V120Q260 126 236 126Q212 126 200 120Z" fill="#dde8f0" />
      <rect x={226} y={34} width={20} height={92} fill="#fbfbf8" stroke={K.out} stroke-width={1.5} />
      <path d="M226 52H236M226 72H240M226 92H236" stroke={K.out} stroke-width={1.5} />
      {txt(255, 77, '80', 13)}
      <path d="M194 92H278" stroke={K.water} stroke-width={3} />
      <path d="M268 112L294 140" stroke={K.out} stroke-width={10} stroke-linecap="round" />
      <path d="M268 112L294 140" stroke="#7b4e2e" stroke-width={6} stroke-linecap="round" />
      <Label x={240} y={190} text="20 °C" />
    </Scene2>
  ),
  'sf-sd-yanma-testi-yasak': () => {
    const h = { x: 20, y: 160, a: 84, s: 1.0, pose: 'hold', side: 'R', grip: 8 } as const;
    const g = handPoint(h, 'grip');
    const bowl: P = [g[0] + 80, g[1] + 2];
    return (
      <Scene2 bg="closeup">
        <Divider x={184} />
        <Hand {...h} arm={60} sleeve={K.role.helper} skin={1}>
          <OG sh={[{ d: capsule([g[0] - 14, g[1]], 3, [bowl[0] - 12, bowl[1]], 2.4), f: C.steel }, { d: ell(bowl, 15, 7), f: C.steel }]} />
        </Hand>
        <path d={`M${bowl[0]} ${bowl[1] - 4}c-10 -6 -12 -20 -4 -30c2 6 6 8 6 2c6 8 10 14 6 22c-2 4 -4 6 -8 6z`} fill="#6fb6ff" fill-opacity={0.85} stroke={K.out} stroke-width={1.2} />
        <No x={bowl[0] - 10} y={bowl[1] - 14} r={46} />
        <Hydrometer x={250} y={226} s={1.1} />
        <Ok x={292} y={60} r={13} />
      </Scene2>
    );
  },
  'sf-sd-seyreltme': () => (
    <Scene2 bg="closeup">
      <Jug x={56} y={150} s={1.05} fill={0.75} liq="#e6e2f2" text="%96" />
      {txt(56, 172, '0,83 L', 13)}
      {txt(56, 208, '+', 22)}
      <Jug x={56} y={226 + 2} s={0.6} fill={0.5} />
      {txt(100, 222, 'su', 13)}
      <Arrow from={[120, 150]} to={[164, 150]} />
      <Jug x={232} y={226} s={1.85} fill={0.82} liq="#e6e2f2" text="1 L" />
      <Label x={236} y={40} text="%80" />
    </Scene2>
  ),

  /* ───── Metanol ───── */
  'sf-sd-farkli-sise': () => (
    <Scene2 bg="closeup">
      <Divider x={150} />
      {/* doğru: içki şişesine benzemeyen köşeli bidon, kırmızı bant, kafatası */}
      <OG sh={[
        { d: 'M30 226V100Q30 90 40 90H62V78H84V90H110Q120 90 120 100V226Z', f: '#dfe3e6' },
        { d: rrect(60, 68, 26, 12, 3), f: K.danger },
        { d: 'M96 76H118V90H110V84H104V90H96Z', f: '#c9ced2' },
        { d: 'M30 112H120V130H30Z', f: K.danger },
      ]} />
      <rect x={44} y={146} width={62} height={40} rx={3} fill="#fff" stroke={K.out} stroke-width={1.2} />
      {SKULL(75, 166, 1, K.danger)}
      <Ok x={128} y={56} r={13} />
      {/* su ve gazoz şişesi: yanlış */}
      <LabelBottle x={232} y={226} s={1.7} color="#d9eef8" cap="#2f6fc0" w={30} h={80} neck={10} />
      <No x={232} y={150} r={58} />
    </Scene2>
  ),
  'sf-sd-kilitli-dolap': () => {
    const kid: PersonProps = { who: 'girl', skin: 1, role: 'bystander2', x: 228, y: 228, s: 0.95, flip: true, pose: { ...POSE.standSide, head: -74, armF: [-60, -58], armB: [-70, -66], handF: { shape: 'flat', a: 0 }, handB: { shape: 'flat', a: 0 }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <OG sh={[
          { d: rrect(70, 28, 120, 104, 4), f: K.wood },
          { d: rrect(78, 36, 50, 88, 3), f: shade(K.wood, 0.06) },
          { d: rrect(132, 36, 50, 88, 3), f: shade(K.wood, 0.06) },
        ]} />
        <path d="M120 72H140" stroke={K.out} stroke-width={3} />
        <OG sh={[{ d: 'M124 82V74Q130 64 136 74V82', st: K.out, sw: 3 }, { d: rrect(120, 80, 20, 18, 3), f: '#d9a13a' }]} />
        <rect x={88} y={50} width={30} height={20} rx={2} fill={K.danger} stroke={K.out} stroke-width={1.2} />
        {SKULL(103, 60, 0.6)}
        <Ok x={168} y={110} r={12} />
        <Person {...kid} />
      </Scene2>
    );
  },
});
