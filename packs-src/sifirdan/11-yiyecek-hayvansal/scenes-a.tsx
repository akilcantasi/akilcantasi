// Sıfırdan paketi sahneleri (a): Yiyecek bulma — hayvansal kaynaklar. Bkz. docs/agents/SIFIRDAN_CIZIM.md
// İlke: öldürme anı çizilmez; temizleme ve pişirme ölçülü (kan yok); ölü hayvanlar şematik ve sade.
// Yasak/zehirli canlılar kırmızı yasak işaretiyle, yenen tür yeşil onayla gösterilir.
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, Campfire, Flashlight, Hand, K, Label, No, OG, OW, Ok, Person, POSE, Pot, Rock,
  Scene2, Timer, Tree, Waves, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═══════════════════════ OYUNCU KADROSU (paket geneli) ═══════════════════════ */
// Avcı (kurbağa, kerevit, salyangoz): kadın, at kuyruğu koyu saç, camgöbeği üst, haki pantolon, çizme.
// Ortak (kurbağa yakalamada ikinci kişi; balık ve kıyı rehberlerinin balıkçısı): bıyıklı esmer adam, hardal üst, kot.
// Gözcü (böcek, arı, parazit, ölü hayvan, korunan hayvan): kumral açık tenli adam, yeşil üst, kahve pantolon.
const CAST = {
  avci: { who: 'woman', skin: 1, hair: 'ponytail', hairC: K.hair.dark, top: K.role.helper, bottom: 'pants', bottomC: K.pants.khaki, sleeve: 'long', shoes: '#3e4a3a' } as const,
  ortak: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, top: K.role.bystander2, bottomC: K.pants.denim, mustache: true, sleeve: 'long' } as const,
  gozcu: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.brown, top: K.role.bystander3, bottomC: K.pants.brown, sleeve: 'long' } as const,
};
// Yakın plan eller (kadro ile aynı ten ve kol rengi)
const HA = { skin: 1, sleeve: K.role.helper } as const; // avcı
const HO = { skin: 2, sleeve: K.role.bystander2 } as const; // ortak / balıkçı
const HG = { skin: 0, sleeve: K.role.bystander3 } as const; // gözcü

/* ═══════════════════════ MALZEME RENKLERİ (paket geneli) ═══════════════════════ */
const C = {
  soil: '#9a7552',
  mud: '#7d6248',
  mudDk: '#5f4a37',
  sand: '#e2cf9e',
  stone: '#b5b1a7',
  wood: '#b98a5a',
  board: '#c99a64',
  stick: '#8a6038',
  rope: '#e8d6a8',
  steel: '#b9c2cc',
  glass: '#dcecf2',
  pet: '#d6ecf3',
  leaf: '#5aa84f',
  leafDk: '#3f8a3e',
  reed: '#8db255',
  white: '#fbfaf5',
  glove: '#5d93d6',
  // kurbağalar
  frog: '#7f9a46', // su kurbağası: zeytin yeşili
  frogBack: '#5f7a34',
  frogStripe: '#b8dc6a',
  frogSpot: '#3f5226',
  toad: '#8b7052', // karakurbağası: mat kahve
  toadWart: '#a88a64',
  tree: '#5cc23e', // ağaç kurbağası
  meat: '#efc3b0', // çiğ beyaz et (kurbağa bacağı)
  meatPink: '#e79a98',
  cooked: '#f4ead8',
  // diğer
  fish: '#9db3c3',
  fishBack: '#5f7d93',
  cray: '#7a5236',
  crayRed: '#d9573a',
  snail: '#c9a26a',
  snailBand: '#7a5a3a',
  snailBody: '#b9a48a',
  ice: '#bfe3f2',
  iceWhite: '#eef3f6',
  iceGrey: '#a3abb0',
  water: K.water,
  bag: '#d8c9a6',
  egg: '#f1e6cf',
  liver: '#7a2230',
  bark: '#7a5236',
};

/* ═══════════════════════ YARDIMCILAR ═══════════════════════ */
const f1 = (n: number) => Math.round(n * 10) / 10;
const tr = (x: number, y: number, s = 1, a = 0, fl = false) => `translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${fl ? -s : s} ${s})`;
const poly = (ps: P[]) => 'M' + ps.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
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
      <filter id="sfyh-glove" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0.18 0.33 0.05 0 0  0.27 0.5 0.08 0 0  0.38 0.7 0.12 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  );
}
function Glove({ children }: { children: ComponentChildren }) {
  return <g filter="url(#sfyh-glove)">{children}</g>;
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
/** Kalın çubuk (sopa, kamış, sap) */
function Stick({ pts, w = 4, c = C.stick }: { pts: P[]; w?: number; c?: string }) {
  return (
    <g fill="none" stroke-linecap="round">
      <path d={smooth(pts)} stroke={K.out} stroke-width={w + 3} />
      <path d={smooth(pts)} stroke={c} stroke-width={w} />
    </g>
  );
}
/** Saz/kamış öbeği. x,y taban */
function Reeds({ x, y, h = 90, n = 5, c = C.reed }: { x: number; y: number; h?: number; n?: number; c?: string }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const dx = (i - (n - 1) / 2) * 7;
        const lean = (i - (n - 1) / 2) * 6;
        const hh = h * (0.75 + ((i * 37) % 10) / 40);
        return (
          <g key={i}>
            <Stick pts={[[x + dx, y], [x + dx + lean * 0.4, y - hh * 0.6], [x + dx + lean, y - hh]]} w={2.4} c={c} />
            {i % 2 === 0 && <Gx x={x + dx + lean} y={y - hh} a={lean * 0.6} sh={[{ d: capsule([0, 0], 3.6, [0, -18], 3.4), f: '#8a5a32' }]} />}
          </g>
        );
      })}
    </g>
  );
}
/** İki panelli karşılaştırma zemini */
function Panels({ split = 160, c = '#f7f4ec' }: { split?: number; c?: string }) {
  return (
    <g>
      <rect x={10} y={10} width={split - 15} height={220} rx={12} fill={c} stroke={K.out} stroke-width={1.5} />
      <rect x={split + 5} y={10} width={305 - split} height={220} rx={12} fill={c} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}
/** Küçük bıçak. x,y = sap ucu, a yön (0 = sağa) */
function Knife({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      { d: rrect(0, -4, 26, 8, 3), f: '#6b4a32' },
      { d: 'M26 -4H58Q66 -2 70 0Q62 4 26 4Z', f: C.steel },
      { d: 'M28 -1H60', st: tint(C.steel, 0.5), sw: 1.4 },
    ]} />
  );
}
/** Kesme tahtası (yandan hafif üstten). x,y sol üst; w,h */
function Board({ x, y, w, h = 16 }: { x: number; y: number; w: number; h?: number }) {
  return (
    <OG sh={[
      { d: rrect(x, y, w, h, 4), f: C.board },
      { d: `M${x + 6} ${y + h * 0.45}H${x + w - 30}M${x + 40} ${y + h * 0.75}H${x + w - 8}`, st: shade(C.board, 0.2), sw: 1.2 },
    ]} />
  );
}
/** Yukarıdan bakış tahta (yakın plan) */
function BoardTop({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 10), f: C.board }]} />
      <g stroke={shade(C.board, 0.14)} stroke-width={1.4} fill="none">
        {[0.2, 0.42, 0.63, 0.85].map((t) => <path key={t} d={`M${x + 12} ${f1(y + h * t)}Q${x + w / 2} ${f1(y + h * t + 4)} ${x + w - 12} ${f1(y + h * t - 2)}`} />)}
      </g>
    </g>
  );
}
/** Kova (yandan). x,y taban ortası. lid: kapaklı */
function Bucket({ x, y, s = 1, c = '#8e99a6', lid = false, fill }: { x: number; y: number; s?: number; c?: string; lid?: boolean; fill?: string }) {
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: 'M-22 -44L-17 0H17L22 -44Z', f: c },
        { d: 'M4 -44L6 0H17L22 -44Z', f: shade(c, 0.12), no: true },
        ...(fill ? [{ d: ell([0, -44], 22, 5), f: fill }] : []),
        ...(lid ? [{ d: rrect(-25, -50, 50, 8, 3), f: shade(c, 0.15) }] : []),
      ]} />
      <path d="M-21 -44Q0 -78 21 -44" fill="none" stroke={K.out} stroke-width={2.2 / s} />
    </g>
  );
}
/** Kepçe (ince gözlü ağ + sap). x,y = ağız ortası; a = sap yönü */
function Net({ x, y, a = -120, s = 1, len = 120 }: { x: number; y: number; a?: number; s?: number; len?: number }) {
  return (
    <g transform={tr(x, y, s, 0)}>
      <Stick pts={[[0, 0], [Math.cos((a * Math.PI) / 180) * len, Math.sin((a * Math.PI) / 180) * len]]} w={3.4 / s} />
      <OG ow={OW / s} sh={[
        { d: 'M-24 0Q-22 30 0 34Q22 30 24 0Z', f: '#e8ecef', op: 0.85 },
        { d: ell([0, 0], 25, 6), f: 'none', st: K.out, sw: 3 },
      ]} />
      <g stroke="#9aa6b2" stroke-width={0.9}>
        {[-16, -8, 0, 8, 16].map((dx) => <path key={dx} d={`M${dx} 3V${f1(30 - Math.abs(dx) * 0.5)}`} />)}
        {[10, 20].map((dy) => <path key={dy} d={`M-21 ${dy}H21`} />)}
      </g>
    </g>
  );
}

/* ─────────────── kurbağalar ─────────────── */
/** Su kurbağası (yandan, sağa bakar). x,y = zemin; uzun ≈ 135·s (ayak dahil).
 *  Islak parlak deri, zeytin yeşili, koyu lekeler, sırtta açık çizgi, uzun çizgili arka bacak, perdeli ayak. */
function WaterFrog({ x, y, s = 1, flip = false, glow = false }: { x: number; y: number; s?: number; flip?: boolean; glow?: boolean }) {
  const c = C.frog, dk = C.frogBack;
  return (
    <g transform={tr(x, y, s, 0, flip)}>
      <OG ow={OW / s} sh={[
        // arka (uzak) bacak ucu
        { d: smooth([[-46, -4], [-70, -6], [-84, -2], [-70, 0], [-46, 0]], true), f: dk },
        // perdeli ayak (yakın)
        { d: 'M-50 -2L-86 -14L-80 -6L-92 -4L-82 0L-90 6L-50 2Z', f: tint(c, 0.15) },
        // baldır (dizden bileğe, geriye)
        { d: capsule([-4, -8], 7.5, [-50, -2], 4.5), f: c },
        // gövde + baş
        { d: smooth([[-40, -10], [-38, -28], [-18, -40], [10, -42], [32, -38], [48, -26], [56, -16], [48, -8], [26, -6], [0, -4], [-24, -4]], true), f: c },
        // açık karın
        { d: smooth([[-30, -8], [0, -6], [30, -8], [48, -10], [40, -6], [0, -3], [-26, -4]], true), f: '#e6e2b6', no: true },
        // uyluk (kalçadan dize, öne)
        { d: capsule([-28, -20], 12, [-2, -9], 8), f: c },
        // ön bacak
        { d: capsule([28, -18], 5, [34, -2], 4), f: c },
        { d: 'M28 0L42 -2L36 2Z', f: c },
        // göz tümseği
        { d: ell([30, -42], 9, 8), f: c },
      ]} />
      {/* sırtta açık çizgi */}
      <path d="M-34 -30Q-6 -44 22 -44" fill="none" stroke={K.out} stroke-width={5.4 / s} stroke-linecap="round" />
      <path d="M-34 -30Q-6 -44 22 -44" fill="none" stroke={C.frogStripe} stroke-width={3.4 / s} stroke-linecap="round" />
      {/* koyu lekeler */}
      {[[-24, -26, 4.5], [-8, -32, 4], [8, -30, 3.6], [-14, -18, 3.4], [6, -18, 3], [-36, -18, 3]].map(([sx, sy, r], i) => <ellipse key={i} cx={sx} cy={sy} rx={r} ry={r * 0.75} fill={C.frogSpot} />)}
      {/* bacak çizgileri */}
      {[-20, -10].map((sx) => <path key={sx} d={`M${sx} -28L${sx + 6} -10`} stroke={C.frogSpot} stroke-width={3.4 / s} stroke-linecap="round" />)}
      {[-16, -28, -40].map((sx) => <path key={sx} d={`M${sx} -11L${sx - 2} -1`} stroke={C.frogSpot} stroke-width={3 / s} stroke-linecap="round" />)}
      {/* perdeli ayak: parmak kemikleri */}
      <path d="M-52 0L-84 -12M-52 0L-89 -4M-52 0L-87 5" fill="none" stroke={dk} stroke-width={1.6 / s} stroke-linecap="round" />
      {/* kulak zarı, ağız, burun */}
      <circle cx={20} cy={-30} r={5} fill={dk} stroke={K.out} stroke-width={1 / s} />
      <path d="M56 -16Q40 -14 24 -20" fill="none" stroke={K.out} stroke-width={1.3 / s} />
      <circle cx={50} cy={-26} r={1.2} fill={K.out} />
      {/* parlak ıslak deri */}
      <path d="M-26 -34Q-12 -42 6 -42" fill="none" stroke="#fff" stroke-width={2.2 / s} stroke-linecap="round" opacity={0.7} />
      <path d="M36 -30Q44 -28 48 -22" fill="none" stroke="#fff" stroke-width={1.8 / s} stroke-linecap="round" opacity={0.6} />
      {glow && <circle cx={31} cy={-44} r={13} fill="#fff6a0" opacity={0.55} />}
      <circle cx={31} cy={-44} r={4.6} fill={glow ? '#fff6a0' : '#d9b84a'} stroke={K.out} stroke-width={1.2 / s} />
      <ellipse cx={32} cy={-44} rx={2.4} ry={1.4} fill={glow ? '#ffffff' : K.out} />
    </g>
  );
}
/** Karakurbağası (yandan, sağa bakar). x,y = zemin. Mat, siğilli kahve deri, göz arkasında uzun bez, kısa bacak. */
function Toad({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = C.toad, dk = shade(c, 0.2);
  return (
    <g transform={tr(x, y, s, 0, flip)}>
      <OG ow={OW / s} sh={[
        { d: capsule([-18, -10], 7, [-34, -2], 6), f: dk },
        { d: smooth([[-44, -12], [-38, -36], [-14, -50], [16, -50], [38, -42], [50, -28], [50, -14], [36, -6], [0, -4], [-30, -4]], true), f: c },
        { d: smooth([[-34, -10], [0, -8], [36, -10], [44, -14], [36, -7], [0, -5], [-30, -6]], true), f: '#cdb48e', no: true },
        // kısa, kalın arka bacak (toplu)
        { d: capsule([-26, -22], 13, [-10, -8], 10), f: c },
        { d: 'M-22 -2L-2 -4L-8 2L-24 2Z', f: c },
        // ön bacak
        { d: capsule([30, -20], 6, [34, -2], 5), f: c },
        { d: 'M28 0L44 -2L38 3Z', f: c },
        // göz tümseği
        { d: ell([30, -48], 8, 7), f: c },
        // bez kabartısı (göz arkasında, uzun, belirgin şişkin)
        { d: smooth([[-6, -46], [2, -56], [16, -58], [25, -53], [22, -44], [8, -41]], true), f: '#c49c66' },
      ]} />
      <path d="M0 -52Q10 -57 20 -55" fill="none" stroke="#e2c79a" stroke-width={2 / s} stroke-linecap="round" />
      {/* siğiller */}
      {[[-30, -30], [-20, -40], [-14, -30], [0, -34], [12, -32], [-34, -18], [-22, -14], [34, -34], [26, -24], [-4, -22], [40, -20]].map(([wx, wy], i) => (
        <circle key={i} cx={wx} cy={wy} r={i % 3 ? 2.6 : 3.4} fill={C.toadWart} stroke={shade(c, 0.35)} stroke-width={0.9 / s} />
      ))}
      {[[2, -49], [8, -51], [14, -50], [20, -50], [6, -45], [12, -46], [18, -47]].map(([wx, wy], i) => <circle key={'b' + i} cx={wx} cy={wy} r={1.1} fill={shade(c, 0.4)} />)}
      <path d="M50 -16Q38 -14 26 -22" fill="none" stroke={K.out} stroke-width={1.3 / s} />
      <circle cx={31} cy={-50} r={4.4} fill="#c8902a" stroke={K.out} stroke-width={1.2 / s} />
      <ellipse cx={32} cy={-50} rx={2.4} ry={1.3} fill={K.out} />
    </g>
  );
}
/** Ağaç kurbağası (yandan, sağa bakar, bir sapa tutunmuş). x,y = sapın üst yüzü, karın altı.
 *  Parlak yaprak yeşili, gözden geriye koyu yan şerit, parmak uçlarında yuvarlak diskler. */
function TreeFrog({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  const c = C.tree, dk = shade(c, 0.18), disc = tint(c, 0.35);
  const toes = (base: P, tips: P[]) => tips.map((t, i) => (
    <g key={i}>
      <path d={`M${base[0]} ${base[1]}L${t[0]} ${t[1]}`} stroke={K.out} stroke-width={4.4 / s} stroke-linecap="round" />
      <path d={`M${base[0]} ${base[1]}L${t[0]} ${t[1]}`} stroke={c} stroke-width={2.6 / s} stroke-linecap="round" />
      <circle cx={t[0]} cy={t[1]} r={3} fill={disc} stroke={K.out} stroke-width={1.1 / s} />
    </g>
  ));
  return (
    <g transform={tr(x, y, s, a)}>
      {/* arka ayak parmakları (sapın üstünde, geride) */}
      {toes([-22, -2], [[-34, 2], [-28, 4], [-20, 4], [-12, 3]])}
      <OG ow={OW / s} sh={[
        // katlanmış arka bacak: uyluk + baldır
        { d: capsule([-18, -14], 8, [-4, -6], 6), f: dk },
        { d: capsule([-4, -6], 5, [-22, -2], 4), f: dk },
        // gövde + baş
        { d: smooth([[-30, -12], [-26, -26], [-6, -34], [16, -34], [30, -26], [35, -16], [26, -8], [0, -5], [-22, -5]], true), f: c },
        // yakın arka uyluk
        { d: capsule([-20, -16], 9, [-6, -8], 6.5), f: c },
        // göz tümseği
        { d: ell([18, -33], 7.5, 6.5), f: c },
        // ön bacak (sapa uzanır)
        { d: capsule([20, -14], 4.2, [24, -2], 3.4), f: c },
      ]} />
      {/* ön ayak parmakları sapı kavrar */}
      {toes([24, -2], [[17, 4], [24, 5], [31, 3]])}
      {/* gözden geriye koyu yan şerit (beyaz kenarlı) */}
      <path d="M13 -30Q0 -23 -24 -18" fill="none" stroke="#f4f7e8" stroke-width={5 / s} stroke-linecap="round" />
      <path d="M13 -30Q0 -23 -24 -18" fill="none" stroke="#4a3a24" stroke-width={3 / s} stroke-linecap="round" />
      <path d="M35 -16Q27 -14 19 -20" fill="none" stroke={K.out} stroke-width={1.2 / s} />
      <circle cx={19} cy={-34} r={4.2} fill="#d9a43a" stroke={K.out} stroke-width={1.1 / s} />
      <ellipse cx={20} cy={-34} rx={2.2} ry={1.3} fill={K.out} />
      <path d="M-14 -29Q0 -34 10 -33" fill="none" stroke="#fff" stroke-width={1.8 / s} opacity={0.75} stroke-linecap="round" />
    </g>
  );
}
/** Su kurbağası, yukarıdan (burnu yukarı). x,y = bel. */
function FrogTop({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  const c = C.frog, dk = C.frogBack;
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={[
        // arka bacaklar (katlanmış, yanlara)
        ...[-1, 1].flatMap((m) => [
          { d: 'M' + [[m * 20, 22], [m * 62, 46], [m * 58, 54], [m * 70, 56], [m * 60, 60], [m * 66, 66], [m * 20, 30]].map((p) => p.join(' ')).join('L') + 'Z', f: tint(c, 0.12) },
          { d: capsule([m * 14, 10], 11, [m * 44, 24], 8), f: c },
          { d: capsule([m * 44, 24], 7, [m * 22, 40], 5), f: c },
        ]),
        // ön bacaklar
        ...[-1, 1].map((m) => ({ d: capsule([m * 14, -26], 5, [m * 30, -12], 4), f: c })),
        // gövde
        { d: smooth([[0, -62], [16, -52], [22, -30], [20, 0], [14, 24], [0, 30], [-14, 24], [-20, 0], [-22, -30], [-16, -52]], true), f: c },
        // gözler
        { d: circ([-11, -46], 6), f: c },
        { d: circ([11, -46], 6), f: c },
      ]} />
      <path d="M0 -50V24" stroke={K.out} stroke-width={5 / s} stroke-linecap="round" />
      <path d="M0 -50V24" stroke={C.frogStripe} stroke-width={3 / s} stroke-linecap="round" />
      {[[-10, -20], [10, -14], [-8, 4], [9, 10], [-12, 16]].map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={3.6} ry={2.8} fill={C.frogSpot} />)}
      {[-11, 11].map((ex) => <g key={ex}><circle cx={ex} cy={-47} r={3.4} fill="#d9b84a" stroke={K.out} stroke-width={1 / s} /><circle cx={ex} cy={-47} r={1.6} fill={K.out} /></g>)}
      {[-1, 1].map((m) => <path key={m} d={`M${m * 30} 18L${m * 34} 30M${m * 42} 22L${m * 38} 34`} stroke={C.frogSpot} stroke-width={2.4 / s} stroke-linecap="round" />)}
      <path d="M-8 -36Q0 -42 8 -36" fill="none" stroke="#fff" stroke-width={1.8 / s} opacity={0.6} />
    </g>
  );
}
/** Derisi soyulmuş kurbağa bacak çifti (yukarıdan; bel yukarıda, ayaksız). x,y = bel ortası; cooked: pişmiş */
function FrogLegs({ x, y, s = 1, a = 0, cooked = false, split = 0, pelvis = true }: { x: number; y: number; s?: number; a?: number; cooked?: boolean; split?: number; pelvis?: boolean }) {
  const c = cooked ? '#e6c18e' : C.meat;
  // tek bacak (sağ): kalın uyluk, diz, tombul baldır, ince bilek (ayak kesik)
  const R: P[] = [[3, 0], [20, 0], [26, 16], [24, 38], [19, 52], [22, 66], [19, 84], [16, 97], [11, 97], [8, 84], [7, 68], [10, 54], [6, 40], [1, 20]];
  const leg = (m: number) => ({ d: smooth(R.map(([px, py]) => [m * (px + split), py] as P), true), f: c });
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={OW / s} sh={[leg(-1), leg(1), ...(pelvis && !split ? [{ d: 'M-21 12L-21 -4Q-21 -7 -16 -7H16Q21 -7 21 -4L21 12Q0 16 -21 12Z', f: c }, { d: ell([0, -6], 19, 3.2), f: shade(c, 0.1) }] : [])]} />
      {[-1, 1].map((m) => <path key={m} d={`M${m * (8 + split)} 14Q${m * (18 + split)} 28 ${m * (15 + split)} 46M${m * (12 + split)} 62Q${m * (17 + split)} 72 ${m * (14 + split)} 84`} fill="none" stroke={shade(c, 0.14)} stroke-width={1.8 / s} />)}
      {[-1, 1].map((m) => <ellipse key={'k' + m} cx={m * (13.5 + split)} cy={97} rx={2.6} ry={1.6} fill="#f5efe6" stroke={K.out} stroke-width={1 / s} />)}
    </g>
  );
}
/** El yerleştir: eldeki bir noktayı (grip/pinch/tip/palm) hedefe getiren x,y'yi döndürür */
function placeHand<T extends { a?: number; s?: number; side?: 'L' | 'R'; view?: 'back' | 'palm'; pose?: any; grip?: number }>(h: T, which: 'tip' | 'grip' | 'palm' | 'pinch', to: P): T & { x: number; y: number } {
  const p = handPoint({ ...h, x: 0, y: 0 } as any, which);
  return { ...h, x: to[0] - p[0], y: to[1] - p[1] };
}

/* ─────────────── kişiler için kısayol ─────────────── */
const who = (c: Partial<PersonProps>, p: Partial<PersonProps>) => ({ ...c, ...p }) as PersonProps;

/* ═══════════════════════ SAHNELER ═══════════════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ───────── Kategori kapakları ───────── */
  // Kurbağa kategorisi: kıyıda sazların önünde su kurbağası, suda bir kerevit, taşta bir salyangoz
  'sf-yh-kapak-kurbaga': () => (
    <Scene2 bg="outdoor" gy={150}>
      <rect x={0} y={170} width={320} height={70} fill={K.water} />
      <path d="M0 170Q80 166 160 170T320 170" fill="none" stroke={tint(K.water, 0.5)} stroke-width={2} />
      <OG sh={[{ d: 'M-5 150H200Q230 152 236 172Q232 196 200 206H-5Z', f: C.mud }]} />
      <Reeds x={250} y={180} h={110} n={6} />
      <Reeds x={30} y={150} h={70} n={4} />
      <Snail x={34} y={166} s={0.7} />
      <WaterFrog x={140} y={194} s={1.2} />
      <Crayfish x={282} y={214} s={0.5} a={-80} />
    </Scene2>
  ),

  /* ───────── Kurbağa 1: tanıma ───────── */
  // Su kurbağası: su kenarında çamurda; ıslak parlak deri, sırt çizgisi ve perdeli uzun arka ayak oklarla; yeşil onay
  'sf-yh-kurbaga-su': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={190} width={320} height={50} fill={K.water} />
      <OG sh={[{ d: 'M-5 176H236Q262 182 266 194Q256 214 236 222H-5Z', f: C.mud }]} />
      <Reeds x={290} y={196} h={150} n={5} />
      <WaterFrog x={170} y={196} s={1.55} />
      <Arrow from={[70, 50]} to={[128, 118]} bend={-0.2} />
      <Arrow from={[30, 150]} to={[46, 180]} w={5} />
      <Ok x={278} y={36} r={16} />
    </Scene2>
  ),
  // İki panel: solda su kurbağası suyun kıyısında (onay), sağda kuru toprakta siğilli karakurbağası,
  // göz arkasındaki bez kabartısı turuncu okla; karakurbağası büyük kırmızı yasakla
  'sf-yh-kurbaga-kara': () => (
    <Scene2 bg="closeup">
      <defs>
        <clipPath id="sfyh-kara-l"><rect x={10} y={10} width={125} height={220} rx={12} /></clipPath>
        <clipPath id="sfyh-kara-r"><rect x={145} y={10} width={165} height={220} rx={12} /></clipPath>
      </defs>
      <Panels split={140} />
      <g clip-path="url(#sfyh-kara-l)">
        <rect x={10} y={160} width={130} height={80} fill={K.water} />
        <OG sh={[{ d: 'M0 136H90Q114 142 118 160L102 176H0Z', f: C.mud }]} />
        <WaterFrog x={84} y={158} s={0.78} />
      </g>
      <Ok x={34} y={36} r={14} />
      <g clip-path="url(#sfyh-kara-r)">
        <OG sh={[{ d: 'M140 178Q230 170 320 178V240H140Z', f: '#c9a77a' }]} />
        <g fill="#a98a5e">{[[170, 206], [220, 218], [280, 200], [250, 226]].map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={6} ry={3} />)}</g>
        <Toad x={218} y={186} s={1.5} />
      </g>
      <Arrow from={[178, 44]} to={[228, 100]} bend={0.15} w={5} />
      <No x={276} y={50} r={28} />
    </Scene2>
  ),
  // Ağaç kurbağası: saz sapına tutunmuş küçük parlak yeşil kurbağa; parmak uçlarındaki diskler turuncu okla; 3–5 cm; yasak
  'sf-yh-kurbaga-agac': () => (
    <Scene2 bg="closeup">
      <Gx x={0} y={0} sh={[{ d: smooth([[196, 176], [246, 126], [300, 98], [272, 142], [212, 178]], true), f: C.reed }]} />
      <Stick pts={[[-10, 196], [120, 180], [330, 156]]} w={10} c={C.reed} />
      <TreeFrog x={150} y={174} s={2.6} a={-6} />
      <Arrow from={[268, 228]} to={[226, 186]} w={5} bend={-0.2} />
      <Label x={70} y={40} text="3–5 cm" />
      <No x={270} y={52} r={30} />
    </Scene2>
  ),
  /* ───────── Kurbağa 2: yakalama ───────── */
  // Gece: kıyıda duran avcı fenerin ışığını çamurdaki kurbağanın gözlerine sabit tutuyor; gözler ışıkta parlıyor
  'sf-yh-kurbaga-fener': () => {
    const frog: P = [248, 206];
    const eye: P = [frog[0] + 31 * 0.8, frog[1] - 44 * 0.8];
    const lamp = { x: 74, y: 222, s: 1.0, face: 'neutral' as const, pose: { ...POSE.standSide, spine: -84, head: -84, armF: { to: [128, 128] as P }, armB: [96, 92] as [number, number] } };
    const hand = rig(who(CAST.avci, lamp)).handF;
    const ang = (Math.atan2(eye[1] - hand[1], eye[0] - hand[0]) * 180) / Math.PI;
    const ux = Math.cos((ang * Math.PI) / 180), uy = Math.sin((ang * Math.PI) / 180);
    const head: P = [hand[0] + ux * 26, hand[1] + uy * 26];
    const far: P = [eye[0] + ux * 40, eye[1] + uy * 40];
    return (
      <Scene2 bg="night" gy={176}>
        <rect x={0} y={200} width={320} height={40} fill="#2b4f78" />
        <OG sh={[{ d: 'M-5 176H266Q292 186 298 204Q286 222 262 232H-5Z', f: '#4a3f33' }]} />
        <Reeds x={300} y={204} h={120} n={4} c="#5f7a3a" />
        <path d={`M${f1(head[0])} ${f1(head[1])}L${f1(far[0] - uy * 46)} ${f1(far[1] + ux * 46)}L${f1(far[0] + uy * 46)} ${f1(far[1] - ux * 46)}Z`} fill="#fff3b0" opacity={0.35} />
        <Person {...who(CAST.avci, lamp)} over={() => <Flashlight x={hand[0] - ux * 8} y={hand[1] - uy * 8} a={ang} s={0.8} beam={false} />} />
        <WaterFrog x={frog[0]} y={frog[1]} s={0.8} glow />
      </Scene2>
    );
  },
  // Yandan yakın plan: arkadan ve üstten gelen el kurbağayı arka bacakların hemen önünden, belinden kavramış; yeşil onay
  'sf-yh-kurbaga-kavrama': () => {
    const fx = 168, fy = 206, fs = 1.7;
    const waist: P = [fx + 2 * fs, fy - 22 * fs];
    const h = placeHand({ a: 165, s: 1.25, pose: 'hold' as const, side: 'L' as const, grip: 44 }, 'grip', waist);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={196} width={320} height={44} fill={K.water} />
        <OG sh={[{ d: 'M-5 184H262Q290 190 294 204Q284 222 262 230H-5Z', f: C.mud }]} />
        <WaterFrog x={fx} y={fy} s={fs} />
        <Hand {...h} arm={160} sleeve={HO.sleeve} skin={HO.skin} />
        <Ok x={282} y={36} r={16} />
      </Scene2>
    );
  },

  /* ───────── Kurbağa 3: temizleme ───────── */
  // Tahtada ayakları kesilmiş kurbağa: soldaki eldivenli el derili üst gövdeyi tutuyor; alttaki eldivenli el
  // bel kesiğinden ters dönmüş deriyi çorap gibi bacaklardan aşağı sıyırıyor (ok); kan yok
  'sf-yh-kurbaga-deri': () => {
    const bx = 150, by = 104;
    const sk = by + 84; // sıyrılan derinin toplandığı yer
    const hB = placeHand({ a: 8, s: 1.05, pose: 'hold' as const, side: 'R' as const, grip: 30 }, 'grip', [bx, sk + 6]);
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <BoardTop x={24} y={20} w={272} h={208} />
        {/* soyulmuş bacaklar (açık pembe et) */}
        <FrogLegs x={bx} y={by} s={1.05} pelvis={false} />
        {/* üst gövde (derili) */}
        <OG sh={[{ d: smooth([[bx - 24, by + 8], [bx - 26, by - 26], [bx - 16, by - 58], [bx, by - 66], [bx + 16, by - 58], [bx + 26, by - 26], [bx + 24, by + 8]], true), f: C.frog }]} />
        <path d={`M${bx} ${by - 58}V${by + 2}`} stroke={C.frogStripe} stroke-width={3} stroke-linecap="round" />
        <g fill={C.frogSpot}>{[[bx - 12, by - 30], [bx + 13, by - 20], [bx - 10, by - 6]].map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={4} ry={3} />)}</g>
        {/* bel kesiği */}
        <path d={`M${bx - 24} ${by + 8}Q${bx} ${by + 14} ${bx + 24} ${by + 8}`} fill="none" stroke={K.out} stroke-width={2} />
        {/* ters dönmüş, buruşuk deri (içi açık renk) bileklerde toplanmış */}
        <OG sh={[{ d: smooth([[bx - 32, sk - 8], [bx - 14, sk - 14], [bx, sk - 8], [bx + 14, sk - 14], [bx + 32, sk - 8], [bx + 30, sk + 16], [bx, sk + 20], [bx - 30, sk + 16]], true), f: '#cfd9a8' }]} />
        <g fill="none" stroke={C.frogBack} stroke-width={1.8}>
          <path d={`M${bx - 26} ${sk}Q${bx - 14} ${sk - 4} ${bx - 4} ${sk + 2}M${bx + 4} ${sk + 2}Q${bx + 14} ${sk - 4} ${bx + 26} ${sk}M${bx - 22} ${sk + 10}Q${bx} ${sk + 6} ${bx + 22} ${sk + 10}`} />
        </g>
        {/* derili gövdeyi tutan eldivenli el (soldan) */}
        <Hand x={bx - 78} y={by - 36} a={90} s={1.05} pose="press" side="R" arm={140} sleeve={HA.sleeve} skin={HA.skin} />
        <Glove><Hand x={bx - 78} y={by - 36} a={90} s={1.05} pose="press" side="R" arm={0} skin={HA.skin} /></Glove>
        {/* deriyi aşağı sıyıran eldivenli el (alttan) */}
        <Hand {...hB} arm={140} sleeve={HA.sleeve} skin={HA.skin} />
        <Glove><Hand {...hB} arm={0} skin={HA.skin} /></Glove>
        <Arrow from={[bx + 66, by + 10]} to={[bx + 66, by + 96]} w={6} />
      </Scene2>
    );
  },
  // Tahtada derisi soyulmuş bacak çifti: kesik çizgi ortadan, bıçak ikiye ayırıyor; yanda temiz su kabı
  'sf-yh-kurbaga-bacak': () => (
    <Scene2 bg="closeup">
      <BoardTop x={20} y={24} w={210} h={200} />
      <FrogLegs x={118} y={70} s={1.4} />
      <path d="M118 46V216" stroke={K.action} stroke-width={3} stroke-dasharray="7 6" />
      <Knife x={176} y={30} a={145} s={1.0} />
      <OG sh={[{ d: 'M236 150Q238 196 272 198Q306 196 308 150Z', f: '#cfd6dc' }, { d: ell([272, 150], 36, 12), f: '#cfd6dc' }, { d: ell([272, 151], 30, 8), f: K.waterLight }]} />
    </Scene2>
  ),

  /* ───────── Kurbağa 4: pişirme ───────── */
  // Ateş üstünde kaynayan tencereye el bir çift kurbağa bacağını belinden tutup bırakıyor (ok aşağı)
  'sf-yh-kurbaga-haslama': () => {
    const top: P = [150, 46];
    const h = placeHand({ a: -100, s: 1.0, pose: 'pinch' as const, side: 'L' as const }, 'pinch', [top[0], top[1] - 2]);
    return (
      <Scene2 bg="outdoor" gy={200}>
        <Campfire x={150} y={222} s={1.25} />
        <Pot x={150} y={204} s={1.8} />
        <FrogLegs x={top[0]} y={top[1]} s={0.72} />
        <Hand {...h} arm={160} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[96, 64]} to={[110, 124]} w={5} bend={0.15} />
      </Scene2>
    );
  },
  // İki panel, haşlanmış bacağın uyluğu kemiğe kadar kesilmiş: solda kemik çevresi pembe (çarpı);
  // sağda her yeri beyaz-opak (onay), termometre ucu kemiğe değmeden en kalın yerde, '74 °C'
  'sf-yh-kurbaga-pisme-kontrol': () => {
    const leg = (x: number, y: number, done: boolean) => (
      <g>
        {/* kemik (diz ucu dışarıda) */}
        <OG sh={[{ d: capsule([x - 34, y], 4.5, [x + 50, y + 4], 4), f: '#f6f1e8' }, { d: circ([x + 52, y + 4], 7.5), f: '#f6f1e8' }]} />
        {/* dış kabuk (haşlanmış yüzey) */}
        <OG sh={[{ d: smooth([[x - 54, y + 4], [x - 46, y - 24], [x - 16, y - 32], [x + 14, y - 22], [x + 36, y - 8], [x + 38, y + 10], [x + 14, y + 26], [x - 18, y + 34], [x - 46, y + 28]], true), f: '#ead6b0' }]} />
        {/* kesik yüzey: iç et */}
        <path d={smooth([[x - 44, y + 4], [x - 38, y - 16], [x - 14, y - 22], [x + 12, y - 14], [x + 28, y - 4], [x + 28, y + 8], [x + 10, y + 18], [x - 16, y + 24], [x - 38, y + 20]], true)} fill={C.cooked} stroke={shade(C.cooked, 0.2)} stroke-width={1.2} />
        {!done && <path d={smooth([[x - 34, y - 2], [x - 10, y - 12], [x + 20, y - 4], [x + 22, y + 8], [x - 8, y + 14], [x - 34, y + 8]], true)} fill={C.meatPink} opacity={0.95} />}
        <OG sh={[{ d: capsule([x - 32, y + 2], 4.5, [x + 30, y + 3], 4), f: '#f6f1e8' }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <Panels />
        {leg(84, 132, false)}
        {leg(236, 132, true)}
        {/* termometre: kadranı yukarıda, şişi en kalın yere, kemiğin üstünde durur */}
        <OG sh={[{ d: capsule([248, 64], 2.4, [222, 118], 2.2), f: C.steel }]} />
        <OG sh={[{ d: circ([252, 58], 13), f: '#fbfaf5' }]} />
        <path d="M252 50V58L258 62" fill="none" stroke={K.danger} stroke-width={2} stroke-linecap="round" />
        <Bad x={38} y={38} r={15} />
        <Ok x={190} y={38} r={15} />
        <Label x={240} y={204} text="74 °C" />
      </Scene2>
    );
  },
  /* ───────── Kerevit kapanı ───────── */
  // Yan kesit: pet bidonun kesilen üst parçası ters çevrilip huni gibi içeri geçirilmiş, kenarı dikilmiş;
  // gövdede delikler, dipte bez içinde yem; turuncu ok huni ağzından girişi gösteriyor
  'sf-yh-kerevit-sise-kapan': () => (
    <Scene2 bg="closeup">
      <OG sh={[
        { d: 'M70 70H262Q290 70 290 98V172Q290 200 262 200H70Z', f: C.pet, op: 0.95 },
      ]} />
      {/* yem torbası (dipte) */}
      <OG sh={[{ d: smooth([[214, 198], [222, 168], [246, 160], [268, 170], [272, 198]], true), f: C.bag }, { d: 'M240 162l-4 -10M246 162l6 -9', st: K.out, sw: 1.6 }]} />
      {/* huni (içe dönük) */}
      <OG sh={[{ d: 'M70 70L150 120V150L70 200Z', f: tint(C.pet, 0.2), op: 0.95 }, { d: 'M150 120V150', st: K.out, sw: 2.4 }]} />
      <path d="M70 70L150 120M70 200L150 150" stroke="#7fb3c9" stroke-width={1.4} />
      {/* dikiş */}
      <g stroke={K.out} stroke-width={2.2} stroke-linecap="round">{[82, 104, 126, 148, 170, 188].map((yy) => <path key={yy} d={`M64 ${yy}l12 6`} />)}</g>
      {/* delikler */}
      <g fill="#4d6d7c">{[[180, 82], [210, 80], [240, 82], [268, 92], [190, 104], [226, 100], [256, 112], [280, 140], [200, 186]].map(([hx, hy], i) => <circle key={i} cx={hx} cy={hy} r={3} />)}</g>
      <path d="M90 86H250" stroke="#fff" stroke-width={3} opacity={0.6} stroke-linecap="round" />
      <Arrow from={[14, 135]} to={[146, 135]} w={6} />
      <Crayfish x={40} y={190} s={0.42} a={90} />
    </Scene2>
  ),
  // Gölet kıyısı kesiti, akşam: taşla ağırlaştırılmış pet kapan taşlı dipte, ipi kıyıdaki köke bağlı; kerevit huniye yürüyor
  'sf-yh-kerevit-kapan-kurma': () => (
    <Scene2 bg="outdoor" gy={96}>
      <rect x={0} y={0} width={320} height={96} fill="#f2c9a0" />
      <rect x={0} y={56} width={320} height={40} fill="#f6dcb8" />
      <circle cx={250} cy={84} r={14} fill="#ffb15a" />
      <rect x={0} y={96} width={320} height={144} fill={K.water} />
      <path d="M0 96H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M-5 70H70Q84 72 86 96L96 150Q110 210 150 214H330V245H-5Z', f: C.mud }]} />
      <g>{[[170, 216], [210, 218], [260, 214], [300, 218], [130, 206]].map(([sx, sy], i) => <Rock key={i} x={sx} y={sy + 6} s={0.4} />)}</g>
      {/* kök */}
      <Stick pts={[[40, 72], [56, 86], [70, 100], [78, 118]]} w={5} c="#6b4a2a" />
      <Tree x={24} y={72} s={0.5} />
      {/* kapan */}
      <g transform="translate(150 130) scale(0.42)">
        <OG ow={OW / 0.42} sh={[{ d: 'M70 70H262Q290 70 290 98V172Q290 200 262 200H70Z', f: C.pet, op: 0.95 }, { d: 'M70 70L150 120V150L70 200Z', f: tint(C.pet, 0.2) }]} />
        <OG ow={OW / 0.42} sh={[{ d: ell([230, 182], 26, 18), f: C.stone }, { d: smooth([[180, 198], [190, 176], [210, 172], [214, 198]], true), f: C.bag }]} />
      </g>
      <Rope pts={[[66, 100], [110, 150], [160, 186], [186, 192]]} w={1.8} />
      <Crayfish x={130} y={210} s={0.34} a={90} />
      <Arrow from={[146, 222]} to={[178, 196]} w={4} bend={-0.3} />
    </Scene2>
  ),
  // Yakın plan: pişmiş, soyulmuş kerevit kuyruğu; parmaklar sırtındaki ince koyu bağırsağı çekip çıkarıyor
  'sf-yh-kerevit-bagirsak': () => {
    // Yukarıdan: soyulmuş kuyruk eti (halka çizgili, ucunda kırmızı kuyruk yelpazesi); sırt ortasındaki
    // ince koyu bağırsak kalın uçtan parmaklarla yukarı çekilip çıkarılıyor
    const pinch: P = [74, 62];
    const h = placeHand({ a: -150, s: 1.2, pose: 'pinch' as const, side: 'L' as const }, 'pinch', pinch);
    const body = smooth([[56, 150], [70, 124], [120, 118], [180, 124], [228, 138], [252, 156], [232, 170], [180, 178], [120, 182], [70, 176]], true);
    const vein: P[] = [pinch, [78, 112], [100, 146], [150, 148], [200, 152], [238, 156]];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M248 156L290 128L296 156L290 184Z', f: C.crayRed }, { d: body, f: '#f6e4d8' }]} />
        <g stroke="#e58a6a" stroke-width={3} fill="none" stroke-linecap="round">{[92, 122, 152, 182, 210, 232].map((sx, i) => <path key={sx} d={`M${sx} ${121 + i * 2}Q${sx + 8} ${150} ${sx} ${179 - i * 2}`} />)}</g>
        <path d={smooth(vein)} fill="none" stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={smooth(vein)} fill="none" stroke="#4a3a2e" stroke-width={3.6} stroke-linecap="round" />
        <Hand {...h} arm={160} sleeve={HA.sleeve} skin={HA.skin} />
        <Arrow from={[126, 112]} to={[108, 64]} w={5} />
      </Scene2>
    );
  },

  /* ───────── Salyangoz ───────── */
  // Yağmur sonrası taş duvar dibi: eldivenli el şeritli salyangozu yapraktan alıp sepete koyuyor; sümüklüböcek kırmızı çarpılı
  'sf-yh-salyangoz-toplama': () => {
    const h = { x: 150, y: 40, a: -170, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 40 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <g>{[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => <Gx key={r + '-' + c} x={0} y={0} sh={[{ d: rrect(c * 72 - (r % 2) * 36 - 10, r * 34 - 6, 68, 30, 8), f: r % 2 ? '#b8b2a4' : '#c4beb0' }]} />))}</g>
        <OG sh={[{ d: 'M-5 128H330V245H-5Z', f: '#6f5a40' }]} />
        {[[30, 150, -20], [96, 160, 10], [200, 156, -30], [250, 170, 20]].map(([lx, ly, la], i) => <Gx key={i} x={lx} y={ly} a={la} sh={[{ d: smooth([[0, 0], [20, -12], [50, -6], [60, 0], [40, 10], [16, 10]], true), f: C.leaf }, { d: 'M4 0H54', st: C.leafDk, sw: 1.2 }]} />)}
        <Snail x={70} y={150} s={0.8} />
        <Snail x={g[0] - 2} y={g[1] + 24} s={0.85} retracted />
        <Glove><Hand {...h} arm={150} sleeve={HA.sleeve} skin={HA.skin} /></Glove>
        {/* sepet */}
        <OG sh={[{ d: 'M214 150H306L296 220H224Z', f: '#c9a05a' }, { d: ell([260, 150], 46, 9), f: '#8a6a3a' }]} />
        <g stroke={shade('#c9a05a', 0.3)} stroke-width={1.6}>{[170, 186, 202].map((yy) => <path key={yy} d={`M${218 + (yy - 150) * 0.12} ${yy}H${302 - (yy - 150) * 0.12}`} />)}</g>
        <Snail x={244} y={152} s={0.45} retracted />
        <Arrow from={[176, 120]} to={[226, 132]} w={5} />
        {/* sümüklüböcek */}
        <OG sh={[{ d: smooth([[40, 214], [60, 204], [100, 202], [118, 196], [124, 206], [110, 214]], true), f: '#a08868' }]} />
        <path d="M116 198l4 -10M120 200l8 -8" stroke={K.out} stroke-width={1.8} stroke-linecap="round" />
        <Bad x={140} y={196} r={13} />
      </Scene2>
    );
  },
  // Tülle örtülü delikli kasada yemsiz salyangozlar; el su serpiyor; "2 gün"
  'sf-yh-salyangoz-arindirma': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: rrect(60, 112, 190, 96, 6), f: C.wood }]} />
      <g stroke={shade(C.wood, 0.3)} stroke-width={1.6}>{[130, 150, 170, 190].map((yy) => <path key={yy} d={`M64 ${yy}H246`} />)}</g>
      <g fill="#3e2c1c">{[80, 110, 140, 170, 200, 230].map((hx) => <rect key={hx} x={hx} y={136} width={10} height={6} rx={2} />)}</g>
      <Snail x={110} y={128} s={0.6} />
      <Snail x={170} y={124} s={0.55} retracted />
      <Snail x={214} y={128} s={0.6} flip />
      <path d="M54 112Q150 92 256 112" fill="none" stroke="#e8ecef" stroke-width={0} />
      <OG sh={[{ d: 'M52 116Q60 86 150 84Q240 86 258 116Z', f: '#eef1f4', op: 0.55 }]} />
      <g stroke="#b9c2cc" stroke-width={0.8} opacity={0.8}>{[80, 110, 140, 170, 200, 230].map((hx) => <path key={hx} d={`M${hx} 88L${hx - 6} 116`} />)}</g>
      <Hand x={250} y={20} a={-150} s={0.8} pose="open" side="L" view="palm" arm={140} sleeve={HA.sleeve} skin={HA.skin} />
      {[[190, 70], [176, 82], [204, 84], [186, 96]].map(([dx, dy], i) => <path key={i} d={`M${dx} ${dy - 6}q-4 6 0 8q4 -2 0 -8z`} fill={K.water} stroke={K.out} stroke-width={1} />)}
      <Label x={70} y={50} text="2 gün" />
    </Scene2>
  ),
  // Haşlanmış salyangoz: sivri çöple et kabuğundan çevrilerek çıkarılıyor; bıçak kıvrık uçtaki koyu kısmı kesiyor
  'sf-yh-salyangoz-et-cikarma': () => (
    <Scene2 bg="closeup">
      <BoardTop x={20} y={150} w={280} h={80} />
      <Snail x={80} y={150} s={2.2} retracted />
      <OG sh={[{ d: smooth([[120, 116], [150, 104], [190, 104], [214, 116], [222, 134], [210, 146], [190, 138], [160, 132], [130, 132]], true), f: '#a8916c' }]} />
      <OG sh={[{ d: smooth([[214, 116], [236, 110], [252, 124], [246, 142], [226, 146], [212, 136]], true), f: '#4a3a2c' }]} />
      <Stick pts={[[150, 118], [150, 40]]} w={3} c="#e2c48a" />
      {(() => { const h0 = { x: 0, y: 0, a: -170, s: 0.9, pose: 'pinch' as const, side: 'L' as const }; const q = handPoint(h0, 'pinch'); return <Hand {...h0} x={150 - q[0]} y={52 - q[1]} arm={60} sleeve={HA.sleeve} skin={HA.skin} />; })()}
      <path d="M216 96V156" stroke={K.action} stroke-width={3} stroke-dasharray="6 5" />
      <Knife x={300} y={80} a={150} s={1} />
      <Arrow from={[260, 190]} to={[226, 160]} w={5} />
    </Scene2>
  ),

  /* ───────── Elle balık ───────── */
  // Dere kesiti: büyük taşın altındaki gölgede ve kıyı oyuğunda, başları akıntıya karşı duran balıklar; mavi ok akıntı
  'sf-yh-elle-balik-yeri': () => (
    <Scene2 bg="outdoor" gy={60}>
      <rect x={0} y={60} width={320} height={180} fill={K.water} />
      <path d="M0 60H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M-5 214Q100 206 200 212Q250 214 330 208V245H-5Z', f: '#b89a6a' }]} />
      <OG sh={[{ d: 'M250 40H330V245H260V200Q232 192 232 160Q232 130 262 120V60Z', f: C.mud }]} />
      <path d="M262 124Q240 140 240 160Q240 186 262 196" fill="none" stroke={C.mudDk} stroke-width={8} opacity={0.6} />
      <OG sh={[{ d: smooth([[60, 214], [62, 160], [96, 128], [150, 124], [184, 150], [190, 196], [176, 214]], true), f: C.stone }]} />
      <path d="M70 200Q120 216 180 202" fill="none" stroke={shade(C.stone, 0.3)} stroke-width={10} opacity={0.5} />
      <Fish x={124} y={200} s={0.42} flip />
      <Fish x={252} y={160} s={0.36} flip />
      <Arrow from={[20, 90]} to={[110, 90]} w={6} color={K.water} />
      <path d="M20 90H110" stroke="#fff" stroke-width={0} />
      <Arrow from={[90, 30]} to={[118, 182]} bend={-0.1} w={5} />
      <Arrow from={[220, 24]} to={[244, 148]} bend={0.1} w={5} />
    </Scene2>
  ),
  // Yan kesit yakın plan: avucu yukarı bakan el taşın altında, balığın karnının altında; ok kuyruktan solungaçlara
  'sf-yh-elle-gidiklama': () => (
    <Scene2 bg="outdoor" gy={30}>
      <rect x={0} y={30} width={320} height={210} fill={K.water} />
      <path d="M0 30H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M-5 216Q160 208 330 214V245H-5Z', f: '#b89a6a' }]} />
      <OG sh={[{ d: smooth([[40, 120], [80, 70], [180, 56], [270, 76], [310, 120], [290, 136], [180, 128], [70, 136]], true), f: C.stone }]} />
      <Fish x={170} y={160} s={1.1} flip />
      <Hand x={250} y={196} a={-100} s={1.05} pose="open" side="R" view="palm" arm={160} sleeve={HO.sleeve} skin={HO.skin} />
      <Arrow from={[240, 206]} to={[124, 196]} w={5} />
    </Scene2>
  ),

  /* ───────── Gece balıkçılığı ───────── */
  // Kamış olta şeması: uzun esnek kamış, ucunda ip; ipin ucunda iğne, bir karış yukarıda küçük ağırlık; iğnede solucan
  'sf-yh-kamis-olta': () => (
    <Scene2 bg="closeup">
      <Stick pts={[[20, 226], [140, 110], [262, 34]]} w={7} c="#c8b06a" />
      <g stroke="#9a8a4a" stroke-width={1.6}>{[[80, 168], [140, 110], [200, 70]].map(([nx, ny], i) => <path key={i} d={`M${nx - 6} ${ny - 4}l12 8`} />)}</g>
      <path d="M262 34V190" stroke={K.out} stroke-width={1.6} />
      <Gx x={262} y={140} sh={[{ d: ell([0, 0], 7, 9), f: '#7d8590' }]} />
      <g transform="translate(262 186)" fill="none" stroke-linecap="round">
        <path d="M0 0V18Q0 28 -8 28Q-14 28 -14 20L-10 16" stroke={K.out} stroke-width={4.4} />
        <path d="M0 0V18Q0 28 -8 28Q-14 28 -14 20L-10 16" stroke={C.steel} stroke-width={2.2} />
      </g>
      <path d="M254 196Q244 206 254 212Q266 220 252 226" fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />
      <path d="M254 196Q244 206 254 212Q266 220 252 226" fill="none" stroke="#d98a86" stroke-width={5.4} stroke-linecap="round" />
      <path d="M284 140V186" stroke={K.action} stroke-width={2.4} />
      <path d="M278 140H290M278 186H290" stroke={K.action} stroke-width={2.4} />
      <Label x={226} y={164} text="1 karış" size={13} />
    </Scene2>
  ),
  // Alacakaranlık kıyı: çatallı sopaya yaslanmış iki kamış olta, uçlarında zil ve beyaz bez; arkada oturan kişi feneri ayaklarına tutuyor
  'sf-yh-kamis-zil': () => {
    const seat = { x: 64, y: 186, s: 0.82, face: 'neutral' as const, pose: { ...POSE.sitFloor, armF: { to: [100, 168] as P } } };
    const hnd = rig(who(CAST.ortak, seat)).handF;
    return (
      <Scene2 bg="night" gy={170}>
        <rect x={0} y={0} width={320} height={110} fill="#4a4f7a" opacity={0.5} />
        <rect x={0} y={190} width={320} height={50} fill="#2b4f78" />
        <OG sh={[{ d: 'M-5 170H200Q230 176 240 196H-5Z', f: '#4a3f33' }]} />
        <path d="M100 172L130 196L132 176L120 200" fill="#fff3b0" opacity={0} />
        <path d={`M${hnd[0] + 6} ${hnd[1]}L84 196L130 196Z`} fill="#fff3b0" opacity={0.35} />
        <Person {...who(CAST.ortak, seat)} over={() => <Flashlight x={hnd[0] - 4} y={hnd[1]} a={60} s={0.6} beam={false} />} />
        {[0, 1].map((i) => {
          const bx = 160 + i * 36;
          const tip: P = [282 + i * 10, 70 + i * 22];
          return (
            <g key={i}>
              <Stick pts={[[bx, 186], [bx, 150]]} w={3} c="#6b4a2a" />
              <Stick pts={[[bx, 150], [bx - 6, 140]]} w={2.4} c="#6b4a2a" />
              <Stick pts={[[bx, 150], [bx + 6, 140]]} w={2.4} c="#6b4a2a" />
              <Stick pts={[[bx - 40, 184], [bx, 146], tip]} w={3.4} c="#c8b06a" />
              <path d={`M${tip[0]} ${tip[1]}L${tip[0] + 10} 220`} stroke="#d8d8d8" stroke-width={1.2} />
              <Gx x={tip[0]} y={tip[1] + 6} sh={[{ d: 'M-6 0Q-6 -10 0 -10Q6 -10 6 0Z', f: '#e0b43a' }]} />
              <Gx x={tip[0] - 14} y={tip[1] + 10} sh={[{ d: 'M0 0L10 -4L12 14L2 16Z', f: K.white }]} />
            </g>
          );
        })}
      </Scene2>
    );
  },
  // Gece, sığ su: kıyıdan tutulan fener ışığında toplanmış küçük balıklar; ince gözlü kepçe alttan kaldırıyor
  'sf-yh-fener-kepce': () => (
    <Scene2 bg="night" gy={90}>
      <rect x={0} y={90} width={320} height={150} fill="#2b4f78" />
      <path d="M0 90H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M-5 70H60Q76 80 80 100L70 245H-5Z', f: '#4a3f33' }]} />
      <OG sh={[{ d: 'M60 220Q200 210 330 220V245H60Z', f: '#6a5a44' }]} />
      <path d="M70 60L190 110L120 200Z" fill="#fff3b0" opacity={0.35} />
      <Flashlight x={36} y={52} a={30} s={0.8} beam={false} />
      {(() => { const h0 = { x: 0, y: 0, a: 120, s: 0.75, pose: 'fist' as const, side: 'R' as const }; const q = handPoint(h0, 'grip'); return <Hand {...h0} x={46 - q[0]} y={58 - q[1]} arm={80} sleeve={HO.sleeve} skin={HO.skin} />; })()}
      {[[130, 140], [150, 150], [140, 160], [166, 140], [124, 164], [158, 170], [176, 156]].map(([fx, fy], i) => <Fish key={i} x={fx} y={fy} s={0.16} flip={i % 2 === 0} />)}
      <Net x={150} y={190} a={-40} len={170} />
      <Arrow from={[230, 210]} to={[200, 170]} w={5} />
    </Scene2>
  ),

  /* ───────── Buz deliği ───────── */
  // Kesit: üç buz; 15 cm şeffaf-mavi buz tek kişi (onay), 20 cm birkaç kişi (onay), gri buz yasak
  'sf-yh-buz-kalinlik': () => {
    const col = (x: number, th: number, c: string, n: number, txt: string) => (
      <g>
        <rect x={x} y={150} width={90} height={80} fill={K.water} />
        <OG sh={[{ d: rrect(x, 150 - th, 90, th, 3), f: c }]} />
        <text x={x + 45} y={150 - th / 2 + 6} text-anchor="middle" font-size={16} font-weight={700} fill={K.ink}>{txt}</text>
        {Array.from({ length: n }, (_, i) => <Mini key={i} x={x + 45 + (i - (n - 1) / 2) * 22} y={150 - th} />)}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {col(14, 34, C.ice, 1, '15 cm')}
        {col(115, 44, C.ice, 3, '20 cm')}
        {col(216, 34, C.iceGrey, 0, '')}
        <path d="M226 130l20 14l10 -8l18 14M250 116l8 14" fill="none" stroke={K.out} stroke-width={1.6} />
        <Ok x={30} y={30} r={14} />
        <Ok x={132} y={30} r={14} />
        <No x={261} y={84} r={30} />
      </Scene2>
    );
  },
  // Kesit: buz deliğinin üstünde çapraz çubuk, ipe iliştirilmiş kırmızı bez, suda yemli iğne; arkada kişi başka deliği izliyor
  'sf-yh-buz-bayrak': () => (
    <Scene2 bg="outdoor" gy={110} ground="snow">
      <rect x={0} y={110} width={320} height={130} fill={K.water} />
      <OG sh={[{ d: 'M-5 104H118V136H-5Z', f: C.ice }, { d: 'M150 104H330V136H150Z', f: C.ice }]} />
      <OG sh={[{ d: 'M-5 100H118V106H-5Z', f: C.iceWhite }, { d: 'M150 100H330V106H150Z', f: C.iceWhite }]} />
      <Stick pts={[[96, 98], [172, 98]]} w={5} />
      <path d="M134 98V200" stroke={K.out} stroke-width={1.6} />
      <Gx x={134} y={86} sh={[{ d: 'M0 12L0 0L18 -6L16 8Z', f: K.red }]} />
      <path d="M134 98V86" stroke={K.out} stroke-width={1.6} />
      <g transform="translate(134 196)" fill="none" stroke-linecap="round">
        <path d="M0 0V14Q0 22 -6 22Q-11 22 -11 16L-8 13" stroke={K.out} stroke-width={4} />
        <path d="M0 0V14Q0 22 -6 22Q-11 22 -11 16L-8 13" stroke={C.steel} stroke-width={2} />
      </g>
      <Fish x={220} y={196} s={0.4} flip />
      <Person {...who(CAST.ortak, { x: 250, y: 104, s: 0.5, face: 'neutral', pose: POSE.kneel, flip: true })} />
      <Stick pts={[[200, 98], [236, 98]]} w={3} />
    </Scene2>
  ),
  // İki panel: solda buz deliğinde kişi kollarını buzun üstüne uzatmış, tutamakları saplamış, tekme atıyor;
  // sağda buzun üstünde yüzükoyun yatıp delikten uzağa yuvarlanıyor
  'sf-yh-buz-kurtulma': () => {
    const inW = { x: 66, y: 118, ay: 'shoulderF' as const, s: 0.7, face: 'worried' as const, pose: { spine: -58, chest: -50, head: -70, armB: { to: [118, 112] as P }, armF: { to: [128, 114] as P }, legB: [130, 150] as [number, number], legF: [110, 140] as [number, number], handB: 'fist' as const, handF: 'fist' as const } };
    return (
      <Scene2 bg="closeup">
        <defs>
          <clipPath id="sfyh-buz-l"><rect x={10} y={10} width={145} height={220} rx={12} /></clipPath>
          <clipPath id="sfyh-buz-r"><rect x={165} y={10} width={145} height={220} rx={12} /></clipPath>
        </defs>
        <Panels />
        <g clip-path="url(#sfyh-buz-l)">
          <rect x={0} y={0} width={160} height={240} fill="#cfe6f2" />
          <Person {...who(CAST.ortak, inW)} />
          <rect x={0} y={120} width={160} height={120} fill={K.water} opacity={0.6} />
          <OG sh={[{ d: 'M108 112H170V130H112Z', f: C.ice }, { d: 'M-5 112H34V130H-5Z', f: C.ice }]} />
          <Waves x={30} y={200} a={180} n={2} />
          <Arrow from={[60, 60]} to={[130, 92]} w={4} bend={-0.2} />
        </g>
        <g clip-path="url(#sfyh-buz-r)">
          <rect x={160} y={0} width={160} height={240} fill="#cfe6f2" />
          <rect x={160} y={166} width={160} height={80} fill={K.water} />
          <OG sh={[{ d: 'M200 148H330V170H200Z', f: C.ice }, { d: 'M150 148H176V170H150Z', f: C.ice }]} />
          <Person {...who(CAST.ortak, { x: 226, y: 148, s: 0.62, face: 'worried', shadow: false, pose: { spine: 0, chest: 0, head: 6, armB: [10, 0], armF: [0, -6], legB: [180, 180], legF: [178, 178] } })} />
          <Arrow from={[230, 90]} to={[290, 104]} w={5} bend={-0.5} />
        </g>
      </Scene2>
    );
  },
  /* ───────── Tatlı su balıkları ───────── */
  // Üç sazangil portresi: sazan, kızılkanat, tatlısu kefali; pullu, dişsiz; yeşil onay
  'sf-yh-balik-sazangil': () => (
    <Scene2 bg="closeup">
      <Carp x={110} y={58} s={0.95} c="#c49a4a" back="#8a6a2a" fin="#9a7434" deep barbel />
      <Carp x={196} y={128} s={0.85} c="#c8d0d4" back="#6f7f74" fin="#e0503a" deep />
      <Carp x={110} y={196} s={0.9} c="#b9c2c4" back="#5f6f72" fin="#8a8f86" />
      <g font-size={14} font-weight={700} fill={K.ink}>
        <text x={200} y={64}>sazan</text>
        <text x={34} y={134}>kızılkanat</text>
        <text x={200} y={202}>kefal</text>
      </g>
      <Ok x={290} y={30} r={14} />
    </Scene2>
  ),
  // Tahtada bıyıklı balık (ağız üstünde iki çift bıyık); eti onaylı; çıkarılmış turuncu yumurta kesesi çarpılı, çukura ok
  'sf-yh-biyikli-yumurta': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M-5 196Q160 188 330 196V245H-5Z', f: C.soil }]} />
      <OG sh={[{ d: ell([250, 214], 40, 10), f: '#3e2c1c' }]} />
      <BoardTop x={16} y={40} w={200} h={130} />
      <Carp x={116} y={92} s={1.0} c="#b9a27a" back="#7a6a4a" fin="#a08a5a" barbel long />
      <OG sh={[{ d: smooth([[70, 146], [96, 136], [130, 140], [140, 152], [116, 162], [80, 160]], true), f: '#f08a3a' }]} />
      <g fill="#ffb36a">{[[86, 150], [100, 146], [114, 152], [126, 148], [96, 156]].map(([ex, ey], i) => <circle key={i} cx={ex} cy={ey} r={3} />)}</g>
      <Bad x={150} y={140} r={13} />
      <Ok x={196} y={60} r={13} />
      <Arrow from={[150, 166]} to={[236, 204]} bend={0.25} w={5} />
    </Scene2>
  ),
  // Turna balığının uzun, ördek gagası gibi ağzı ve sivri dişleri; ağza uzanan el kırmızı yasakla durduruluyor
  'sf-yh-turna-dis': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#d7e6dc" opacity={0.6} />
      <Pike x={170} y={130} s={1.25} />
      <Hand x={-10} y={150} a={70} s={0.95} pose="open" side="R" arm={80} sleeve={HO.sleeve} skin={HO.skin} />
      <No x={58} y={112} r={34} />
    </Scene2>
  ),

  /* ───────── Zehirli deniz balıkları ───────── */
  // Balon balığı portresi: gri benekli sırt, beyaz karın, gümüş şerit, gaga dişleri; büyük kırmızı yasak
  'sf-yh-balon-baligi': () => (
    <Scene2 bg="closeup">
      <Puffer x={160} y={124} s={1.3} />
      <No x={160} y={120} r={96} />
    </Scene2>
  ),
  // Sığ kumlu dip kesiti: kuma gömülü trakonyanın gözleri ve dikenleri görünüyor; ayakkabılı ayak kumu sürterek ilerliyor
  'sf-yh-trakonya-kum': () => (
    <Scene2 bg="outdoor" gy={40}>
      <rect x={0} y={40} width={320} height={200} fill={K.waterLight} />
      <path d="M0 40H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M-5 170Q160 160 330 170V245H-5Z', f: C.sand }]} />
      {/* gömülü balık: sırt çizgisi, gözler, siyah dikenler */}
      <path d="M180 170Q220 162 270 168" fill="none" stroke="#b49a6a" stroke-width={4} />
      <OG sh={[{ d: 'M206 166L210 146L214 166Z', f: '#2a2a30' }, { d: 'M214 166L219 144L223 166Z', f: '#2a2a30' }, { d: 'M223 166L227 148L231 166Z', f: '#2a2a30' }, { d: 'M199 167L202 152L206 167Z', f: '#2a2a30' }]} />
      <path d="M200 160Q214 150 230 160" fill="none" stroke="#2a2a30" stroke-width={0} />
      {[248, 258].map((ex) => <g key={ex}><circle cx={ex} cy={166} r={4.4} fill="#f1e6c0" stroke={K.out} stroke-width={1.2} /><circle cx={ex} cy={166} r={2} fill={K.out} /></g>)}
      <Bad x={216} y={128} r={13} />
      {/* ayakkabılı ayak ve bacak */}
      <OG sh={[{ d: capsule([84, -20], 15, [84, 70], 14), f: K.pants.denim }, { d: capsule([84, 70], 11, [86, 140], 10), f: K.skin[2] }, { d: 'M66 136H112Q128 140 132 158Q132 170 122 172H66Q58 170 58 156Z', f: '#3e5a7a' }, { d: 'M58 164H132V172H58Z', f: '#2a2a30' }]} />
      <path d="M40 172Q70 160 140 172" fill="none" stroke="#c9b27e" stroke-width={4} />
      <Arrow from={[120, 196]} to={[180, 196]} w={6} />
    </Scene2>
  ),
  // Sandalyede oturan kişi ayağını sıcak su dolu leğene daldırmış; buhar; "30 dk"
  'sf-yh-sicak-su-daldirma': () => {
    const sit = { x: 120, y: 220, s: 1.0, face: 'pain' as const, pose: { ...POSE.sitChair, legF: [0, 90] as [number, number], legB: [4, 92] as [number, number], armF: [60, 20] as [number, number] }, shoes: null };
    return (
      <Scene2 bg="indoor" gy={180}>
        {/* leğenin arka kenarı ve suyu */}
        <OG sh={[{ d: ell([176, 204], 56, 9), f: '#8e99a6' }, { d: ell([176, 205], 50, 6.5), f: K.waterLight }]} />
        <Person {...who(CAST.ortak, sit)} under={() => <Chair />} />
        {/* leğenin ön yüzü (ayaklar içeride) */}
        <OG sh={[{ d: 'M120 205Q176 216 232 205L222 232H130Z', f: '#8e99a6' }]} />
        <path d="M124 205Q176 214 228 205" fill="none" stroke={tint(K.water, 0.3)} stroke-width={3} />
        {[150, 196, 216].map((sx) => <path key={sx} d={`M${sx} 194q-6 -10 0 -18q6 -8 0 -18`} fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />)}
        <Timer x={230} y={60} r={20} text="30 dk" />
      </Scene2>
    );
  },

  /* ───────── Yengeç ve deniz kestanesi ───────── */
  // Yukarıdan: el kaya yengecini sırtından, arka bacakların üstünden tutuyor; kıskaçlar ele uzanamıyor; yeşil onay
  'sf-yh-yengec-tutma': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M0 0H320V240H0Z', f: '#9a958c' }]} />
      <g fill="#86817a">{[[40, 40], [280, 200], [60, 210], [260, 30]].map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={20} ry={10} />)}</g>
      <Crab x={160} y={110} s={1.4} />
      <Hand x={162} y={212} a={0} s={1.15} pose="press" side="R" arm={60} sleeve={HO.sleeve} skin={HO.skin} />
      <Ok x={284} y={36} r={16} />
    </Scene2>
  ),
  // İki panel: solda ters çevrilmiş kestane, ağız çevresinde kesik daire ve makas; sağda açılmış kabukta beş turuncu şerit, onay
  'sf-yh-kestane-acma': () => (
    <Scene2 bg="closeup">
      <Panels />
      <Urchin x={85} y={130} r={44} />
      <circle cx={85} cy={130} r={24} fill="none" stroke={K.action} stroke-width={3} stroke-dasharray="6 5" />
      <circle cx={85} cy={130} r={7} fill="#3a2a2a" />
      <Knife x={146} y={66} a={140} s={0.9} />
      <Urchin x={235} y={130} r={44} open />
      <Ok x={290} y={36} r={14} />
    </Scene2>
  ),

  /* ───────── Ahtapot ve kalamar ───────── */
  // Kayalık sığ su kesiti: ipe bağlı yengeç kaya deliğinin önünde; delikten çıkan ahtapot kollarıyla sarılıyor; kayadaki kişi ipi yavaşça çekiyor
  'sf-yh-ahtapot-ip': () => {
    const bait: P = [150, 188];
    const sit = { x: 250, y: 92, s: 0.72, face: 'neutral' as const, flip: true, pose: { ...POSE.sitFloor, armF: { to: [214, 70] as P }, armB: { to: [206, 78] as P } } };
    return (
      <Scene2 bg="outdoor" gy={100}>
        <rect x={0} y={100} width={320} height={140} fill={K.water} />
        <path d="M0 100H320" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M200 92Q240 74 330 80V245H260Q236 200 230 150Q220 120 200 110Z', f: '#8f8a80' }]} />
        <OG sh={[{ d: 'M-5 150Q30 140 70 160Q110 176 120 230H-5Z', f: '#8f8a80' }]} />
        <OG sh={[{ d: ell([60, 196], 26, 20), f: '#2a2a30' }]} />
        <OG sh={[{ d: 'M-5 224Q160 216 330 222V245H-5Z', f: C.sand }]} />
        <Octo x={62} y={196} bait={bait} />
        <Crab x={bait[0]} y={bait[1]} s={0.42} a={90} />
        <Person {...who(CAST.ortak, sit)} over={(r) => <Rope pts={[[bait[0], bait[1] - 6], [182, 126], [r.handB[0] + 2, r.handB[1] + 2]]} w={1.8} c="#f4f1ea" />} />
        <Arrow from={[184, 150]} to={[196, 110]} w={5} />
      </Scene2>
    );
  },
  // Yukarıdan, taş tezgâhta ahtapot: kesik çizgiler gözlerin üstünü ve altını gösteriyor; ok kolların ortasındaki gagaya
  'sf-yh-ahtapot-temizleme': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(14, 14, 292, 212, 14), f: '#c9c4b8' }]} />
      <OctoTop x={160} y={108} s={1.1} />
      <path d="M100 74H220M100 112H220" stroke={K.action} stroke-width={3} stroke-dasharray="7 6" />
      <Arrow from={[260, 200]} to={[176, 140]} w={5} bend={0.2} />
    </Scene2>
  ),
  // Kalamar: kollar başla birlikte gövdeden çekiliyor (ok), saydam kalem gövdeden çekilip çıkarılıyor (ok)
  'sf-yh-kalamar-temizleme': () => (
    <Scene2 bg="closeup">
      <BoardTop x={14} y={40} w={292} h={170} />
      <Squid x={30} y={140} />
      <Arrow from={[192, 182]} to={[236, 182]} w={5} />
      <Arrow from={[200, 96]} to={[232, 62]} w={5} />
    </Scene2>
  ),
  /* ───────── Arı larvası ───────── */
  // Petek yakın planı: alt kenarda kubbe gibi kabarık iri erkek arı gözleri (ok), yukarıda düz kapaklı küçük işçi gözleri; bıçak alt bölümü kesiyor
  'sf-yh-erkek-ari-petegi': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(14, 14, 292, 212, 6), f: C.wood }, { d: rrect(28, 28, 264, 184, 4), f: '#e8c06a' }]} />
      <g>{Array.from({ length: 6 }, (_, r) => Array.from({ length: 14 }, (_, c) => {
        const cx = 40 + c * 18 + (r % 2) * 9, cy = 40 + r * 15;
        return <path key={r + '-' + c} d={hexD(cx, cy, 9)} fill="#d9a84a" stroke="#9a6e2a" stroke-width={1.2} />;
      }))}</g>
      <g>{Array.from({ length: 3 }, (_, r) => Array.from({ length: 10 }, (_, c) => {
        const cx = 44 + c * 25 + (r % 2) * 12, cy = 140 + r * 22;
        return <g key={'d' + r + c}><circle cx={cx} cy={cy} r={11.5} fill="#c9944a" stroke="#7a5428" stroke-width={1.4} /><circle cx={cx - 3} cy={cy - 3} r={4} fill="#e6b872" /></g>;
      }))}</g>
      <path d="M24 126H296" stroke={K.action} stroke-width={3} stroke-dasharray="8 6" />
      <Knife x={240} y={110} a={175} s={1} />
      <Arrow from={[24, 220]} to={[38, 190]} w={5} />
    </Scene2>
  ),
  // Petek parçası ters çevrilip tahtaya vuruluyor; beyaz larvalar kaba dökülüyor; yanda kavrulmuş larvalı tava
  'sf-yh-larva-cikarma': () => {
    const h = { x: 60, y: 30, a: 120, s: 0.95, pose: 'fist' as const, side: 'R' as const };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <BoardTop x={20} y={150} w={200} h={70} />
        <OG sh={[{ d: rrect(g[0] - 10, g[1] - 4, 110, 36, 4), f: '#e8c06a' }]} />
        <g>{[0, 1, 2, 3, 4].map((c) => <circle key={c} cx={g[0] + 4 + c * 21} cy={g[1] + 34} r={9} fill="#f6efd8" stroke="#9a6e2a" stroke-width={1.2} />)}</g>
        <Hand {...h} arm={80} sleeve={HG.sleeve} skin={HG.skin} />
        {[[120, 112], [146, 126], [104, 134], [160, 104], [132, 148]].map(([lx, ly], i) => <Larva key={i} x={lx} y={ly} />)}
        <OG sh={[{ d: 'M90 168H190L180 196H100Z', f: '#cfd6dc' }, { d: ell([140, 168], 50, 8), f: '#eef0f2' }]} />
        <Larva x={130} y={168} />
        <Larva x={152} y={170} />
        <Arrow from={[210, 60]} to={[210, 130]} w={5} />
        <OG sh={[{ d: ell([268, 196], 40, 10), f: '#3a3a40' }, { d: capsule([300, 192], 4, [318, 180], 4), f: '#3a3a40' }]} />
        <g fill="#d9a85a">{[[254, 192], [268, 190], [282, 194], [262, 198], [276, 198]].map(([lx, ly], i) => <ellipse key={i} cx={lx} cy={ly} rx={5} ry={3} />)}</g>
      </Scene2>
    );
  },

  /* ───────── Çekirge ───────── */
  // Sabah otlak: kişi açık tuttuğu bezi otların üstünde süpürür gibi gezdiriyor; bezin içinde çekirgeler; yanda ağzı bağlı torba
  'sf-yh-cekirge-bez': () => {
    const pr = { x: 110, y: 222, s: 0.95, face: 'neutral' as const, pose: { ...POSE.bend, armB: { to: [176, 176] as P }, armF: { to: [196, 182] as P } } };
    return (
      <Scene2 bg="outdoor" gy={190}>
        <g stroke={K.grassShade} stroke-width={2.4} stroke-linecap="round">{Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 11} 232l${(i % 3) - 1 * 3} -${26 + (i * 7) % 14}`} />)}</g>
        <Person {...who(CAST.gozcu, pr)} />
        <OG sh={[{ d: 'M172 172Q220 168 262 196Q240 214 200 210Q178 200 172 172Z', f: K.cloth }]} />
        <Grasshopper x={214} y={196} s={0.4} />
        <Grasshopper x={240} y={202} s={0.34} />
        <Arrow from={[270, 160]} to={[300, 190]} w={5} bend={-0.3} />
        <OG sh={[{ d: 'M24 230Q18 196 34 186L46 186Q60 196 54 230Z', f: C.bag }, { d: 'M30 184H50', st: K.out, sw: 3 }]} />
      </Scene2>
    );
  },
  // Çam dalında beyaz ipeksi kese yuva, yerde uç uca dizilmiş tüylü tırtıllar; uzanan el kırmızı yasakla
  'sf-yh-cam-kese-yasak': () => (
    <Scene2 bg="outdoor" gy={170}>
      <Stick pts={[[330, 40], [240, 60], [140, 70]]} w={8} c={C.bark} />
      {[160, 190, 220, 260, 300].map((nx) => <g key={nx} stroke={K.pine} stroke-width={2.4}>{[-30, -10, 10, 30].map((d) => <path key={d} d={`M${nx} 64l${d * 0.4} -16M${nx} 64l${d * 0.4} 16`} />)}</g>)}
      <OG sh={[{ d: smooth([[200, 66], [226, 60], [244, 80], [236, 108], [214, 112], [196, 92]], true), f: '#f4f4f0' }]} />
      <g stroke="#cfd4d8" stroke-width={1} fill="none"><path d="M204 76Q220 90 236 84M206 96Q222 100 234 98" /></g>
      {[40, 92, 144, 196].map((cx, i) => <Caterpillar key={i} x={cx} y={212} s={0.85} />)}
      <Hand x={250} y={250} a={-60} s={0.9} pose="open" side="L" arm={60} sleeve={HG.sleeve} skin={HG.skin} />
      <No x={210} y={200} r={30} />
    </Scene2>
  ),
  // İki panel: çiçek üstünde uzun gövdeli mavi-siyah yağ böceği ve kırmızı-siyah çizgili böcek, yasak; sağda karşılaştırma için çekirge, onay
  'sf-yh-yag-bocegi-yasak': () => (
    <Scene2 bg="closeup">
      <Panels split={196} />
      <Stick pts={[[100, 230], [100, 150]]} w={4} c={C.leafDk} />
      <OG sh={Array.from({ length: 6 }, (_, i) => { const t = (i / 6) * Math.PI * 2; return { d: ell([100 + Math.cos(t) * 26, 140 + Math.sin(t) * 12], 18, 9), f: '#f6e27a', t: `rotate(${f1((t * 180) / Math.PI)} ${f1(100 + Math.cos(t) * 26)} ${f1(140 + Math.sin(t) * 12)})` }; })} />
      <OG sh={[{ d: ell([100, 140], 12, 6), f: '#e0a030' }]} />
      <Meloe x={98} y={128} />
      <Striped x={60} y={70} />
      <No x={100} y={110} r={78} />
      <Grasshopper x={256} y={140} s={0.9} />
      <Ok x={290} y={36} r={14} />
    </Scene2>
  ),

  /* ───────── Kuş yumurtası ve koruma ───────── */
  // İki panel: bacada leylek yuvası, ağaç kovuğunda baykuş; her birinde kırmızı yasak
  'sf-yh-yuva-yasak': () => (
    <Scene2 bg="closeup">
      <Panels c="#d8ecf4" />
      <OG sh={[{ d: 'M60 230V150H110V230Z', f: '#c9705a' }, { d: 'M54 142H116V152H54Z', f: '#a85a48' }]} />
      <OG sh={[{ d: smooth([[40, 146], [60, 128], [110, 128], [130, 146], [110, 154], [60, 154]], true), f: '#a07a4a' }]} />
      <Stork x={86} y={134} />
      <No x={42} y={46} r={22} />
      <OG sh={[{ d: 'M200 230Q206 120 196 20H284Q276 120 290 230Z', f: C.bark }]} />
      <OG sh={[{ d: ell([240, 120], 26, 38), f: '#2a1d14' }]} />
      <Owl x={240} y={134} />
      <No x={190} y={46} r={22} />
    </Scene2>
  ),
  // İki panel: yuvada yumurtaların üstünde oturan kuş, uzanan el yasakla; sağda su dolu kapta dik duran yumurta, çarpı
  'sf-yh-yumurta-kulucka': () => (
    <Scene2 bg="closeup">
      <Panels split={176} />
      <OG sh={[{ d: smooth([[30, 176], [50, 150], [140, 150], [160, 176], [130, 190], [60, 190]], true), f: '#a07a4a' }]} />
      <Bird x={92} y={140} s={0.9} />
      <Hand x={150} y={40} a={-140} s={0.65} pose="open" side="L" arm={60} sleeve={HG.sleeve} skin={HG.skin} />
      <No x={120} y={70} r={26} />
      <OG sh={[{ d: 'M206 90H290L284 210Q282 218 274 218H222Q214 218 212 210Z', f: C.glass, op: 0.9 }]} />
      <rect x={210} y={110} width={77} height={104} fill={K.waterLight} opacity={0.8} />
      <OG sh={[{ d: 'M248 82C258 82 263 96 263 104C263 114 256 120 248 120C240 120 233 114 233 104C233 96 238 82 248 82Z', f: C.egg }]} />
      <Bad x={292} y={34} r={14} />
    </Scene2>
  ),

  /* ───────── Yenmeyecek hayvanlar ───────── */
  // Kaplumbağa ve kirpi yan yana; her birinin üstünde kırmızı yasak
  'sf-yh-korunan-hayvanlar': () => (
    <Scene2 bg="outdoor" gy={160}>
      <g transform="translate(-12 -32) scale(1.2)"><Tortoise x={70} y={196} /><Hedgehog x={204} y={196} /></g>
      <No x={84} y={60} r={30} />
      <No x={236} y={70} r={30} />
    </Scene2>
  ),
  // Yerde sürünen yarasa; uzanan çıplak el kırmızı yasakla durduruluyor
  'sf-yh-yarasa-yasak': () => (
    <Scene2 bg="outdoor" gy={150} ground="dirt">
      <Bat x={120} y={206} />
      <Hand x={300} y={120} a={-110} s={0.95} pose="open" side="L" arm={80} sleeve={HG.sleeve} skin={HG.skin} />
      <No x={226} y={140} r={36} />
    </Scene2>
  ),

  /* ───────── Kene, sülük, parazit ───────── */
  // Çok yakın plan: ince uçlu cımbız keneyi deriye en yakın yerden tutuyor; ok düz yukarı
  'sf-yh-kene-cikarma': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M-5 170Q160 160 330 170V245H-5Z', f: K.skin[0] }]} />
      <g stroke={shade(K.skin[0], 0.1)} stroke-width={1.2} fill="none">{[40, 90, 230, 280].map((hx) => <path key={hx} d={`M${hx} 180q4 -8 10 -10`} />)}</g>
      <OG sh={[{ d: ell([170, 150], 22, 16), f: '#5a3a2a', t: 'rotate(-20 170 150)' }, { d: ell([150, 162], 8, 6), f: '#3a2418' }]} />
      <g stroke={K.out} stroke-width={2.6} stroke-linecap="round">{[-1, 1].map((m) => [0, 10].map((d) => <path key={m + ':' + d} d={`M${160 + d} ${156 + m * 10}l${-6 + d} ${m * 12}`} />))}</g>
      <OG sh={[{ d: 'M144 160L200 30L208 34L150 164Z', f: C.steel }, { d: 'M152 164L232 40L238 46L158 168Z', f: C.steel }]} />
      <Arrow from={[110, 150]} to={[110, 60]} w={6} />
    </Scene2>
  ),
  // Baldır yakın planı: bir el deriyi geriyor, diğer elin tırnağı sülüğün dar ağız ucunun altına kayıyor (ok)
  'sf-yh-suluk-cikarma': () => {
    const mouth: P = [148, 154];
    const hp = placeHand({ a: 62, s: 1.0, pose: 'point' as const, side: 'R' as const }, 'tip', [mouth[0] + 2, mouth[1] + 6]);
    const hs = placeHand({ a: 210, s: 0.95, pose: 'press' as const, side: 'L' as const }, 'palm', [96, 124]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M-5 60Q160 40 330 60V245H-5Z', f: K.skin[1] }]} />
        <OG sh={[{ d: smooth([[146, 152], [160, 146], [200, 134], [250, 136], [270, 152], [250, 168], [200, 168], [160, 158]], true), f: '#3a3a2e' }]} />
        <path d="M180 148Q220 142 250 150" fill="none" stroke="#5a5a46" stroke-width={2} />
        {/* deriyi geren el (üstten): avuç ağız ucunun yanında deriye basıp sola geriyor */}
        <Hand {...hs} arm={160} sleeve={HO.sleeve} skin={HO.skin} />
        <Arrow from={[58, 168]} to={[22, 168]} w={4} />
        {/* tırnak ağız ucunun altına kayıyor */}
        <Hand {...hp} arm={120} sleeve={HO.sleeve} skin={HO.skin} />
        <Arrow from={[198, 214]} to={[166, 178]} w={5} />
      </Scene2>
    );
  },
  // Kesim yerinde kistli ciğer çukura atılıyor (ok); köpeğin önündeki ciğer parçası kırmızı yasakla
  'sf-yh-ic-organ-kopek-yasak': () => (
    <Scene2 bg="outdoor" gy={170} ground="dirt">
      <OG sh={[{ d: ell([96, 206], 56, 14), f: '#3e2c1c' }]} />
      <Liver x={96} y={130} s={0.7} />
      <Arrow from={[96, 160]} to={[96, 196]} w={5} />
      <Dog x={250} y={214} />
      <Liver x={186} y={210} s={0.3} />
      <No x={186} y={204} r={26} />
    </Scene2>
  ),

  /* ───────── Ölü hayvan ───────── */
  // Şematik: çayırda yatan ölü koyun (sade, kansız) büyük kırmızı yasakla; bıçak kırmızı çarpılı
  'sf-yh-les-isaretler': () => (
    <Scene2 bg="outdoor" gy={160}>
      <DeadSheep x={176} y={196} s={1.15} />
      <Knife x={126} y={70} a={-25} s={0.95} />
      <No x={160} y={56} r={40} />
    </Scene2>
  ),
  // Eldivenli kişi yol kenarındaki ölü tilkiyi uzun kürekle çukura itiyor; eli hayvana değmiyor; yeşil onay
  'sf-yh-les-sopa': () => {
    const blade: P = [196, 214];
    const pr = { x: 70, y: 222, s: 0.95, face: 'neutral' as const, pose: { ...POSE.walk, spine: -70, chest: -70, armB: { to: [124, 150] as P }, armF: { to: [146, 166] as P } } };
    return (
      <Scene2 bg="outdoor" gy={170} ground="dirt">
        <OG sh={[{ d: ell([270, 222], 46, 12), f: '#3e2c1c' }]} />
        <Stick pts={[[100, 128], blade]} w={4} />
        <Person {...who(CAST.gozcu, pr)} over={(r) => <g>{[r.handB, r.handF].map((h, i) => <circle key={i} cx={h[0]} cy={h[1]} r={6} fill={C.glove} stroke={K.out} stroke-width={1.4} />)}</g>} />
        <OG sh={[{ d: 'M186 206L208 200L212 218L192 224Z', f: C.steel }]} />
        <DeadFox x={240} y={214} />
        <Arrow from={[204, 160]} to={[262, 168]} w={5} />
        <Ok x={290} y={36} r={15} />
      </Scene2>
    );
  },
  // Ağzı bezle, gözleri gözlükle örtülü kişi ters çevrilmiş poşete sarılı eliyle ölü kuşu kaldırıyor; yerde başka ölü kuşlar
  'sf-yh-olu-kus-eldiven': () => {
    const pr = { x: 110, y: 222, s: 1.0, face: 'neutral' as const, glasses: true, pose: { ...POSE.crouch, armF: { to: [180, 196] as P } } };
    return (
      <Scene2 bg="outdoor" gy={170}>
        <DeadBird x={250} y={216} />
        <DeadBird x={290} y={196} s={0.7} />
        <Person {...who(CAST.gozcu, pr)}
          over={(r) => (
            <g>
              <OG sh={[{ d: rrect(r.mouth[0] - 12, r.mouth[1] - 7, 18, 13, 4), f: K.cloth }]} />
              <OG sh={[{ d: smooth([[r.handF[0] - 14, r.handF[1] - 4], [r.handF[0] - 4, r.handF[1] - 18], [r.handF[0] + 14, r.handF[1] - 10], [r.handF[0] + 12, r.handF[1] + 8], [r.handF[0] - 6, r.handF[1] + 10]], true), f: '#eef0f2', op: 0.95 }]} />
            </g>
          )} />
        <DeadBird x={192} y={210} s={0.7} />
      </Scene2>
    );
  },

  /* ───────── Kapaklar: balık ve güvenlik ───────── */
  // Kayalık kıyı: suda bir balık, kayada bir yengeç
  'sf-yh-kapak-balik': () => (
    <Scene2 bg="outdoor" gy={100}>
      <rect x={0} y={100} width={320} height={140} fill={K.water} />
      <path d="M0 100H320" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: 'M-5 90Q40 80 90 96Q120 120 110 245H-5Z', f: '#8f8a80' }]} />
      <Crab x={56} y={70} s={0.75} />
      <Fish x={210} y={160} s={1.1} flip />
      <Fish x={150} y={210} s={0.5} />
    </Scene2>
  ),
  // Otta çekirge ve bir petek parçası
  'sf-yh-kapak-guvenlik': () => (
    <Scene2 bg="outdoor" gy={170}>
      <Stick pts={[[60, 240], [90, 140], [140, 70]]} w={4} c={C.leafDk} />
      <Grasshopper x={110} y={110} s={1.2} />
      <OG sh={[{ d: 'M190 200L200 150L270 140L290 190L260 214Z', f: '#e8c06a' }]} />
      <g>{[[214, 168], [234, 164], [254, 160], [224, 186], [244, 182], [264, 178]].map(([hx, hy], i) => <path key={i} d={hexD(hx, hy, 9)} fill="#d9a84a" stroke="#9a6e2a" stroke-width={1.2} />)}</g>
    </Scene2>
  ),
};

/* ─────────────── sonradan tanımlanan yardımcılar (sahnelerde kullanılır) ─────────────── */
/** Kerevit (yukarıdan, başı yukarı). x,y gövde ortası */
function Crayfish({ x, y, s = 1, a = 0, c = C.cray }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  const dk = shade(c, 0.2);
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
/** Bahçe salyangozu (yandan, sağa gider). x,y = taban; kabuk çapı ≈ 44·s */
function Snail({ x, y, s = 1, flip = false, retracted = false }: { x: number; y: number; s?: number; flip?: boolean; retracted?: boolean }) {
  const sp: P[] = Array.from({ length: 30 }, (_, i) => {
    const t = i * 0.42;
    const r = 3 + i * 0.62;
    return [-2 + Math.cos(t + 1.6) * r, -24 + Math.sin(t + 1.6) * r] as P;
  });
  return (
    <g transform={tr(x, y, s, 0, flip)}>
      {!retracted && (
        <g>
          <OG ow={OW / s} sh={[{ d: smooth([[-30, 0], [-20, -6], [10, -8], [30, -10], [38, -20], [44, -26], [46, -18], [40, -4], [30, 0]], true), f: C.snailBody }]} />
          <path d="M38 -22L44 -40M42 -20L52 -34" stroke={K.out} stroke-width={2.6 / s} stroke-linecap="round" />
          <path d="M38 -22L44 -40M42 -20L52 -34" stroke={C.snailBody} stroke-width={1.4 / s} stroke-linecap="round" />
          <circle cx={44} cy={-41} r={2.2} fill={K.out} />
          <circle cx={52} cy={-35} r={2.2} fill={K.out} />
        </g>
      )}
      <OG ow={OW / s} sh={[{ d: circ([-2, -24], 22), f: C.snail }]} />
      <path d={smooth(sp)} fill="none" stroke={C.snailBand} stroke-width={3.6 / s} stroke-linecap="round" />
      <path d="M-14 -40Q-4 -46 8 -40" fill="none" stroke="#fff" stroke-width={2 / s} opacity={0.5} stroke-linecap="round" />
    </g>
  );
}

/** Balık (yandan, sağa bakar). x,y merkez; L≈100·s */
function Fish({ x, y, s = 1, a = 0, flip = false, c = C.fish, back = C.fishBack }: { x: number; y: number; s?: number; a?: number; flip?: boolean; c?: string; back?: string }) {
  const body = smooth([[-40, 0], [-20, -16], [10, -20], [36, -10], [48, 0], [36, 10], [10, 16], [-20, 12]], true);
  return (
    <g transform={tr(x, y, s, a, flip)}>
      <OG ow={OW / s} sh={[
        { d: 'M-36 0L-58 -18L-54 0L-58 18Z', f: back },
        { d: 'M-6 -18L6 -30L20 -18Z', f: back },
        { d: 'M0 14L10 24L18 13Z', f: back },
        { d: body, f: c },
        { d: smooth([[-38, -2], [-20, -15], [10, -19], [36, -10], [44, -4], [10, -8], [-20, -6]], true), f: back, no: true },
        { d: 'M24 -12Q18 0 24 12', st: shade(c, 0.3), sw: 1.6 },
      ]} />
      <circle cx={34} cy={-3} r={4.6} fill="#fff" stroke={K.out} stroke-width={1.2 / s} />
      <circle cx={35} cy={-3} r={2.4} fill={K.out} />
    </g>
  );
}
/** Küçük insan simgesi (buz kalınlığı). x,y ayak */
function Mini({ x, y }: { x: number; y: number }) {
  return <OG sh={[{ d: circ([x, y - 30], 5), f: K.role.bystander2 }, { d: `M${x - 6} ${y}V${y - 16}Q${x - 6} ${y - 23} ${x} ${y - 23}Q${x + 6} ${y - 23} ${x + 6} ${y - 16}V${y}Z`, f: K.role.bystander2 }]} />;
}

/** Sazangil balık portresi (yandan, sağa bakar). deep: yüksek gövde; barbel: bıyık; long: uzun gövde */
function Carp({ x, y, s = 1, c, back, fin, deep = false, barbel = false, long = false }: { x: number; y: number; s?: number; c: string; back: string; fin: string; deep?: boolean; barbel?: boolean; long?: boolean }) {
  const h = deep ? 26 : 18, L = long ? 66 : 52;
  const body = smooth([[-L, 0], [-L * 0.5, -h * 0.8], [0, -h], [L * 0.6, -h * 0.7], [L, -2], [L * 0.6, h * 0.6], [0, h * 0.85], [-L * 0.5, h * 0.6]], true);
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: `M${-L + 4} 0L${-L - 22} -18L${-L - 14} 0L${-L - 22} 18Z`, f: fin },
        { d: `M-14 ${-h + 2}L-4 ${-h - 14}L18 ${-h + 1}Z`, f: fin },
        { d: `M-8 ${h * 0.8}L4 ${h + 10}L14 ${h * 0.75}Z`, f: fin },
        { d: `M${-L * 0.6} ${h * 0.5}L${-L * 0.55} ${h * 0.5 + 9}L${-L * 0.4} ${h * 0.55}Z`, f: fin },
        { d: body, f: c },
        { d: smooth([[-L + 2, -2], [-L * 0.5, -h * 0.78], [0, -h * 0.98], [L * 0.6, -h * 0.68], [L * 0.8, -h * 0.3], [0, -h * 0.4], [-L * 0.5, -h * 0.3]], true), f: back, no: true },
        { d: `M${L * 0.5} ${-h * 0.6}Q${L * 0.4} 0 ${L * 0.5} ${h * 0.5}`, st: shade(c, 0.3), sw: 1.4 },
        { d: `M${L * 0.66} 6L${L * 0.88} 8`, st: shade(c, 0.4), sw: 1.4 },
      ]} />
      <g fill="none" stroke={shade(c, 0.25)} stroke-width={1 / s} opacity={0.8}>
        {[-30, -16, -2, 12, 26].flatMap((sx) => [-8, 2].map((sy) => <path key={sx + ':' + sy} d={`M${sx} ${sy}q5 4 0 8`} />))}
      </g>
      {barbel && <path d={`M${L - 4} 4q8 8 4 14M${L - 10} 6q4 10 -2 14`} fill="none" stroke={K.out} stroke-width={2 / s} stroke-linecap="round" />}
      <circle cx={L * 0.7} cy={-h * 0.3} r={4} fill="#fff" stroke={K.out} stroke-width={1.1 / s} />
      <circle cx={L * 0.7 + 1} cy={-h * 0.3} r={2.1} fill={K.out} />
    </g>
  );
}
/** Turna balığı başı (yandan, sola bakar, ağız açık, sivri dişler). x,y = baş ortası */
function Pike({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#7d9a5a', dk = '#4f6a3a';
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: smooth([[150, -34], [60, -36], [0, -30], [-40, -24], [-90, -12], [-100, -6], [-60, -4], [-10, 6], [-60, 14], [-96, 20], [-80, 28], [-20, 30], [60, 36], [150, 34]], true), f: c },
        { d: smooth([[150, -34], [60, -36], [0, -30], [-40, -24], [-84, -12], [0, -14], [80, -18], [150, -10]], true), f: dk, no: true },
        { d: 'M-90 -10L-10 2L-90 18Q-70 6 -90 -10Z', f: '#c96a6a' },
        { d: 'M20 -22Q32 0 18 26', st: shade(c, 0.35), sw: 2 },
      ]} />
      {[-82, -70, -58, -46, -34, -22].map((tx, i) => <path key={tx} d={`M${tx} ${-9 + i * 2}l3 7l3 -7`} fill="#fff" stroke={K.out} stroke-width={0.9 / s} />)}
      {[-80, -66, -52, -38, -24].map((tx, i) => <path key={'b' + tx} d={`M${tx} ${16 - i * 2}l3 -7l3 7`} fill="#fff" stroke={K.out} stroke-width={0.9 / s} />)}
      {[[40, -10], [70, 6], [100, -16], [120, 14], [60, -22]].map(([sx, sy], i) => <ellipse key={i} cx={sx} cy={sy} rx={6} ry={3} fill="#c8d89a" />)}
      <circle cx={-20} cy={-18} r={6} fill="#e8d24a" stroke={K.out} stroke-width={1.2 / s} />
      <circle cx={-21} cy={-18} r={3} fill={K.out} />
    </g>
  );
}
/** Balon balığı (yandan, sağa bakar) */
function Puffer({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[
        { d: 'M-70 0L-96 -20L-90 0L-96 20Z', f: '#8a8478' },
        { d: 'M-30 -30L-20 -46L-6 -30Z', f: '#8a8478' },
        { d: smooth([[-74, 0], [-50, -30], [0, -40], [50, -30], [80, -8], [84, 6], [50, 30], [0, 38], [-50, 26]], true), f: '#f6f3ea' },
        { d: smooth([[-74, -2], [-50, -30], [0, -40], [50, -30], [80, -10], [40, -6], [0, -4], [-50, -6]], true), f: '#8f8a7a', no: true },
        { d: 'M-70 2Q0 -4 78 -2Q40 6 0 6Q-40 8 -70 4Z', f: '#d6dde4' },
        { d: 'M80 -6L92 -4L92 6L80 8Z', f: '#f2f2ea' },
        { d: 'M-4 10L10 22L18 8Z', f: '#c9c2b0' },
      ]} />
      <path d="M-66 3Q0 0 78 1" stroke="#fff" stroke-width={2} opacity={0.9} />
      {[[-40, -20], [-20, -28], [0, -22], [20, -30], [36, -18], [-56, -10], [-10, -12], [16, -12], [52, -20]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={3.2} fill="#4a4436" />)}
      <path d="M86 -4V8" stroke={K.out} stroke-width={1.4 / s} />
      <circle cx={58} cy={-14} r={6} fill="#f2d66a" stroke={K.out} stroke-width={1.2 / s} />
      <circle cx={59} cy={-14} r={3} fill={K.out} />
    </g>
  );
}
/** Kaya yengeci (yukarıdan, kıskaçlar yukarı). x,y kabuk ortası */
function Crab({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  const c = '#7a5a6a', dk = shade(c, 0.2);
  return (
    <g transform={tr(x, y, s, a)}>
      <g fill="none" stroke-linecap="round">
        {[-1, 1].flatMap((m) => [0, 10, 20].map((dy) => (
          <g key={m + ':' + dy}>
            <path d={`M${m * 24} ${dy - 2}L${m * 46} ${dy - 10 + dy * 0.4}L${m * 56} ${dy + 10 + dy * 0.6}`} stroke={K.out} stroke-width={7 / s} />
            <path d={`M${m * 24} ${dy - 2}L${m * 46} ${dy - 10 + dy * 0.4}L${m * 56} ${dy + 10 + dy * 0.6}`} stroke={dk} stroke-width={4.4 / s} />
          </g>
        )))}
      </g>
      <OG ow={OW / s} sh={[
        ...[-1, 1].flatMap((m) => [
          { d: capsule([m * 20, -14], 5, [m * 34, -34], 6), f: c },
          { d: smooth([[m * 26, -36], [m * 40, -50], [m * 38, -66], [m * 30, -60], [m * 28, -48], [m * 22, -40]], true), f: c },
        ]),
        { d: smooth([[-30, -8], [-20, -24], [0, -28], [20, -24], [30, -8], [24, 16], [0, 24], [-24, 16]], true), f: c },
      ]} />
      <circle cx={-6} cy={-26} r={2.6} fill={K.out} />
      <circle cx={6} cy={-26} r={2.6} fill={K.out} />
      <path d="M-16 -8Q0 -16 16 -8" fill="none" stroke={tint(c, 0.3)} stroke-width={2 / s} />
    </g>
  );
}
/** Deniz kestanesi (yukarıdan). open: kesilmiş üst, içte beş turuncu şerit */
function Urchin({ x, y, r = 40, open = false }: { x: number; y: number; r?: number; open?: boolean }) {
  const n = 36;
  return (
    <g>
      <g stroke={K.out} stroke-width={2.4} stroke-linecap="round">
        {Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; const l = r + 14 + (i % 3) * 5; return <path key={i} d={`M${f1(x + Math.cos(t) * r * 0.8)} ${f1(y + Math.sin(t) * r * 0.8)}L${f1(x + Math.cos(t) * l)} ${f1(y + Math.sin(t) * l)}`} />; })}
      </g>
      <OG sh={[{ d: circ([x, y], r), f: '#4a2f4a' }]} />
      {open && (
        <g>
          <OG sh={[{ d: circ([x, y], r * 0.72), f: '#2f2430' }]} />
          <OG sh={Array.from({ length: 5 }, (_, i) => { const t = -Math.PI / 2 + (i / 5) * Math.PI * 2; return { d: capsule([x + Math.cos(t) * r * 0.18, y + Math.sin(t) * r * 0.18], 5, [x + Math.cos(t) * r * 0.58, y + Math.sin(t) * r * 0.58], 8), f: '#f08a2a' }; })} />
        </g>
      )}
    </g>
  );
}
/** Ahtapot kolları delikten çıkıp yeme sarılıyor (yandan). x,y = delik; bait = yem */
function Octo({ x, y, bait }: { x: number; y: number; bait: P }) {
  const c = '#b8645a';
  const arms: P[][] = [
    [[x + 8, y - 6], [x + 50, y - 22], [bait[0] - 20, bait[1] - 22], [bait[0] - 4, bait[1] - 14], [bait[0] + 8, bait[1] - 4]],
    [[x + 10, y + 4], [x + 50, y + 10], [bait[0] - 24, bait[1] + 14], [bait[0] - 4, bait[1] + 16], [bait[0] + 6, bait[1] + 8]],
    [[x + 12, y], [x + 46, y - 4], [bait[0] - 30, bait[1] - 4], [bait[0] - 16, bait[1] + 2]],
  ];
  return (
    <g>
      {arms.map((a, i) => (
        <g key={i} fill="none" stroke-linecap="round">
          <path d={smooth(a)} stroke={K.out} stroke-width={10} />
          <path d={smooth(a)} stroke={c} stroke-width={7} />
          {a.slice(1, -1).map((p, j) => <circle key={j} cx={p[0]} cy={p[1] + 3} r={1.8} fill="#f2d0c8" stroke="none" />)}
        </g>
      ))}
      <OG sh={[{ d: ell([x - 2, y - 4], 16, 12), f: c }]} />
      <circle cx={x + 6} cy={y - 8} r={4} fill="#f2e6a0" stroke={K.out} stroke-width={1.2} />
      <rect x={x + 3} y={y - 9} width={6} height={2} fill={K.out} />
    </g>
  );
}
/** Ahtapot (yukarıdan). x,y = gözler arası */
function OctoTop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#c9786a';
  const arms = Array.from({ length: 8 }, (_, i) => {
    const t = Math.PI * (0.08 + i * 0.12);
    const p1: P = [Math.cos(t) * 30, 26 + Math.sin(t) * 14];
    const p2: P = [Math.cos(t) * 80, 34 + Math.sin(t) * 60];
    const p3: P = [Math.cos(t) * 110 + (i < 4 ? 10 : -10), 50 + Math.sin(t) * 96];
    return [[0, 20] as P, p1, p2, p3];
  });
  return (
    <g transform={tr(x, y, s)}>
      {arms.map((a, i) => (
        <g key={i} fill="none" stroke-linecap="round">
          <path d={smooth(a)} stroke={K.out} stroke-width={14 / s} />
          <path d={smooth(a)} stroke={c} stroke-width={11 / s} />
        </g>
      ))}
      <OG ow={OW / s} sh={[{ d: smooth([[-26, 20], [-30, -20], [-20, -50], [0, -58], [20, -50], [30, -20], [26, 20], [0, 26]], true), f: c }]} />
      {[-12, 12].map((ex) => <g key={ex}><circle cx={ex} cy={-6} r={6} fill="#f2e6a0" stroke={K.out} stroke-width={1.2 / s} /><rect x={ex - 4} y={-7} width={8} height={2.4} fill={K.out} /></g>)}
      <OG ow={OW / s} sh={[{ d: circ([0, 32], 6), f: '#2a2a30' }]} />
    </g>
  );
}
/** Kalamar (yukarıdan): solda yüzgeçli gövde (tüp), sağ ağzından saydam kalem dışarı çekiliyor;
 *  sağda gövdeden ayrılmış baş ve kollar. x,y = gövdenin sol (yüzgeç) ucu */
function Squid({ x, y }: { x: number; y: number }) {
  const c = '#f1d9d2';
  const mo = x + 128; // gövde ağzı
  return (
    <g>
      {/* saydam kalem: gövde ağzından yukarı-sağa çekilmiş (yarısı içeride) */}
      <OG sh={[{ d: `M${x + 60} ${y - 2}Q${mo - 6} ${y - 18} ${mo + 52} ${y - 62}Q${mo + 46} ${y - 30} ${mo + 6} ${y - 4}Q${mo - 30} ${y + 6} ${x + 60} ${y + 4}Z`, f: '#e8f4fb', op: 0.95 }]} />
      <OG sh={[
        { d: `M${x + 14} ${y}L${x + 30} ${y - 16}L${mo} ${y - 20}Q${mo + 6} ${y} ${mo} ${y + 20}L${x + 30} ${y + 16}Z`, f: c },
        { d: `M${x} ${y}L${x + 4} ${y - 28}L${x + 40} ${y - 15}Z`, f: tint(c, 0.25) },
        { d: `M${x} ${y}L${x + 4} ${y + 28}L${x + 40} ${y + 15}Z`, f: tint(c, 0.25) },
      ]} />
      {/* kalemin gövde içindeki kısmı (gölge) */}
      <path d={`M${x + 64} ${y + 1}Q${mo - 20} ${y - 2} ${mo} ${y - 9}`} fill="none" stroke="#c9dbe6" stroke-width={3} />
      <g fill="#b0626a">{[[44, -8], [62, 8], [84, -11], [100, 10], [54, 2], [112, -4]].map(([sx, sy], i) => <circle key={i} cx={x + sx} cy={y + sy} r={2.6} />)}</g>
      {/* baş ve kollar (ayrılmış) */}
      {[-14, -7, 0, 7, 14].map((dy) => (
        <g key={dy} fill="none" stroke-linecap="round">
          <path d={`M${x + 196} ${y + dy * 0.5}Q${x + 220} ${y + dy * 1.4} ${x + 244} ${y + dy * 2.2}`} stroke={K.out} stroke-width={6} />
          <path d={`M${x + 196} ${y + dy * 0.5}Q${x + 220} ${y + dy * 1.4} ${x + 244} ${y + dy * 2.2}`} stroke={c} stroke-width={3.6} />
        </g>
      ))}
      <OG sh={[{ d: ell([x + 186, y], 16, 15), f: c }]} />
      <circle cx={x + 184} cy={y - 5} r={4.6} fill="#2a2a30" />
    </g>
  );
}
/** Sandalye (sahne içinde, kişinin altında): basit tahta sandalye x≈100..148 */
function Chair() {
  return <OG sh={[{ d: 'M86 172H140V180H86Z', f: C.wood }, { d: 'M88 180H94V222H88ZM134 180H140V222H134Z', f: shade(C.wood, 0.1) }, { d: 'M86 172H94V100H86Z', f: C.wood }]} />;
}

/** Altıgen yol */
function hexD(cx: number, cy: number, r: number) {
  return poly(Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + Math.PI / 6; return [cx + Math.cos(t) * r, cy + Math.sin(t) * r] as P; }));
}
/** Beyaz arı larvası (küçük C) */
function Larva({ x, y }: { x: number; y: number }) {
  return <OG sh={[{ d: 'M-8 2Q-10 -8 0 -9Q9 -8 8 0Q6 6 0 5Q4 0 0 -3Q-4 -2 -3 3Z', f: '#f8f3e4', t: `translate(${x} ${y})` }]} />;
}
/** Çekirge (yandan, sağa bakar) */
function Grasshopper({ x, y, s = 1, c = '#7fae3e' }: { x: number; y: number; s?: number; c?: string }) {
  const dk = shade(c, 0.25);
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[{ d: capsule([-4, -4], 5, [-20, -26], 4), f: dk }, { d: capsule([-20, -26], 3, [-34, 6], 2), f: dk }]} />
      <OG ow={OW / s} sh={[
        { d: capsule([10, 4], 2, [8, 14], 1.6), f: dk },
        { d: capsule([2, 4], 2, [-2, 14], 1.6), f: dk },
        { d: smooth([[-34, 0], [-20, -6], [0, -8], [14, -6], [18, 2], [0, 8], [-20, 6]], true), f: c },
        { d: smooth([[-30, -4], [-10, -12], [10, -10], [6, -4], [-14, -2]], true), f: '#b9c97a' },
        { d: capsule([0, -2], 6, [-12, -18], 4.5), f: c },
        { d: capsule([-12, -18], 3, [-26, 8], 2.2), f: c },
        { d: ell([22, -2], 9, 8), f: c },
        { d: smooth([[24, -8], [34, -26], [46, -32]]), st: K.out, sw: 1.6 },
      ]} />
      <circle cx={25} cy={-4} r={2.4} fill={K.out} />
    </g>
  );
}
/** Tüylü tırtıl */
function Caterpillar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const segs = [-30, -20, -10, 0, 10, 20];
  return (
    <g transform={tr(x, y, s)}>
      <g stroke={K.out} stroke-width={1.3 / s}>
        {segs.map((sx) => [-60, -90, -120, -30, -150].map((a) => <path key={sx + ':' + a} d={`M${sx} -4l${f1(Math.cos((a * Math.PI) / 180) * 14)} ${f1(Math.sin((a * Math.PI) / 180) * 14)}`} />))}
      </g>
      <OG ow={OW / s} sh={[...segs.map((sx) => ({ d: circ([sx, -4], 7.5), f: '#6a5236' })), { d: circ([30, -4], 7), f: '#3a2a22' }]} />
      {segs.map((sx) => <circle key={sx} cx={sx} cy={-6} r={2} fill="#ff8a1f" />)}
    </g>
  );
}
/** Yağ böceği (yandan): uzun yumuşak parlak mavi-siyah gövde */
function Meloe({ x, y }: { x: number; y: number }) {
  const c = '#2a3a6a';
  return (
    <g>
      <g stroke={K.out} stroke-width={2.4} stroke-linecap="round">{[-14, 0, 14].map((d) => <path key={d} d={`M${x + d} ${y + 6}l${d * 0.3 - 4} 14`} />)}</g>
      <OG sh={[{ d: smooth([[x - 40, y + 2], [x - 30, y - 12], [x + 4, y - 14], [x + 22, y - 6], [x + 24, y + 6], [x - 10, y + 10]], true), f: c }, { d: circ([x + 30, y - 2], 8), f: '#1e2a4a' }]} />
      <path d={`M${x - 30} ${y - 6}Q${x - 6} ${y - 14} ${x + 14} ${y - 8}`} fill="none" stroke="#6a8ad8" stroke-width={2.4} opacity={0.8} />
      <path d={`M${x + 34} ${y - 8}q8 -12 16 -10M${x + 34} ${y - 6}q12 -4 18 2`} fill="none" stroke={K.out} stroke-width={1.6} />
    </g>
  );
}
/** Kırmızı-siyah çizgili böcek (yandan) */
function Striped({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <g stroke={K.out} stroke-width={2.2} stroke-linecap="round">{[-8, 4].map((d) => <path key={d} d={`M${x + d} ${y + 6}l-4 10`} />)}</g>
      <OG sh={[{ d: ell([x, y], 22, 10), f: '#d8312b' }, { d: circ([x + 24, y], 6), f: '#22252c' }]} />
      <g fill="#22252c">{[-12, -2, 8].map((d) => <rect key={d} x={x + d} y={y - 9} width={4} height={18} />)}</g>
    </g>
  );
}
/** Leylek (yandan, ayakta, sağa bakar). x,y = ayak */
function Stork({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <g stroke={K.out} stroke-width={4} stroke-linecap="round"><path d={`M${x - 4} ${y}V${y - 26}M${x + 6} ${y}V${y - 26}`} /></g>
      <g stroke="#e04a30" stroke-width={2.2} stroke-linecap="round"><path d={`M${x - 4} ${y}V${y - 26}M${x + 6} ${y}V${y - 26}`} /></g>
      <OG sh={[
        { d: smooth([[x - 26, y - 36], [x - 10, y - 50], [x + 16, y - 48], [x + 22, y - 34], [x + 4, y - 24], [x - 20, y - 26]], true), f: '#fbfaf5' },
        { d: smooth([[x - 30, y - 34], [x - 14, y - 44], [x + 8, y - 42], [x + 4, y - 30], [x - 18, y - 28]], true), f: '#2a2a30' },
        { d: capsule([x + 14, y - 44], 5, [x + 20, y - 76], 4), f: '#fbfaf5' },
        { d: circ([x + 22, y - 80], 7), f: '#fbfaf5' },
        { d: `M${x + 27} ${y - 82}L${x + 54} ${y - 72}L${x + 27} ${y - 77}Z`, f: '#e04a30' },
      ]} />
      <circle cx={x + 23} cy={y - 82} r={1.6} fill={K.out} />
    </g>
  );
}
/** Baykuş (önden). x,y = alt */
function Owl({ x, y }: { x: number; y: number }) {
  const c = '#9a7a54';
  return (
    <g>
      <OG sh={[{ d: smooth([[x - 22, y], [x - 24, y - 30], [x - 18, y - 52], [x, y - 58], [x + 18, y - 52], [x + 24, y - 30], [x + 22, y]], true), f: c }, { d: smooth([[x - 14, y - 2], [x - 14, y - 26], [x, y - 32], [x + 14, y - 26], [x + 14, y - 2]], true), f: '#d9c4a0' }]} />
      {[-9, 9].map((d) => <g key={d}><circle cx={x + d} cy={y - 44} r={8} fill="#f2d66a" stroke={K.out} stroke-width={1.3} /><circle cx={x + d} cy={y - 44} r={4} fill={K.out} /></g>)}
      <path d={`M${x - 3} ${y - 38}L${x} ${y - 32}L${x + 3} ${y - 38}Z`} fill="#e0a040" stroke={K.out} stroke-width={1} />
      <path d={`M${x - 20} ${y - 56}l4 -8l6 6M${x + 20} ${y - 56}l-4 -8l-6 6`} fill={c} stroke={K.out} stroke-width={1.3} />
    </g>
  );
}
/** Kuluçkadaki kuş (yandan, yuvada oturan). x,y gövde ortası */
function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#8a6a4a', dk = shade(c, 0.18);
  return (
    <Gx x={x} y={y} s={s} sh={[
      { d: smooth([[-40, 0], [-20, -22], [10, -24], [30, -10], [30, 10], [-20, 14]], true), f: c },
      { d: smooth([[-30, -8], [0, -16], [22, -4], [6, 8], [-18, 8]], true), f: dk },
      { d: 'M-40 0L-58 -12L-54 4Z', f: dk },
      { d: capsule([24, -10], 7, [36, -26], 6), f: c },
      { d: circ([38, -30], 9), f: '#5a4a3a' },
      { d: 'M46 -32L56 -28L46 -26Z', f: '#e0a040' },
    ]} />
  );
}
/** Kaplumbağa (yandan, sağa) */
function Tortoise({ x, y }: { x: number; y: number }) {
  const c = '#8a7a3a';
  return (
    <g>
      <OG sh={[
        { d: capsule([x - 30, y - 10], 8, [x - 32, y], 7), f: '#a8a070' },
        { d: capsule([x + 28, y - 10], 8, [x + 30, y], 7), f: '#a8a070' },
        { d: capsule([x + 36, y - 22], 8, [x + 54, y - 30], 9), f: '#a8a070' },
        { d: `M${x - 46} ${y - 12}Q${x - 44} ${y - 64} ${x} ${y - 66}Q${x + 44} ${y - 64} ${x + 46} ${y - 12}Z`, f: c },
        { d: `M${x - 48} ${y - 12}H${x + 48}V${y - 6}H${x - 48}Z`, f: shade(c, 0.2) },
      ]} />
      <g fill="none" stroke={shade(c, 0.35)} stroke-width={2}>
        <path d={`M${x - 14} ${y - 60}L${x - 18} ${y - 36}L${x + 18} ${y - 36}L${x + 14} ${y - 60}M${x - 18} ${y - 36}L${x - 24} ${y - 12}M${x + 18} ${y - 36}L${x + 24} ${y - 12}M${x - 18} ${y - 36}L${x - 40} ${y - 32}M${x + 18} ${y - 36}L${x + 40} ${y - 32}`} />
      </g>
      <circle cx={x + 56} cy={y - 32} r={2} fill={K.out} />
    </g>
  );
}
/** Kirpi (yandan, sağa) */
function Hedgehog({ x, y }: { x: number; y: number }) {
  const n = 22;
  return (
    <g>
      <g stroke={K.out} stroke-width={1.6} stroke-linecap="round">
        {Array.from({ length: n }, (_, i) => { const t = Math.PI * (1.02 + (i / (n - 1)) * 0.9); return <path key={i} d={`M${f1(x - 6 + Math.cos(t) * 36)} ${f1(y - 8 + Math.sin(t) * 34)}l${f1(Math.cos(t) * 14)} ${f1(Math.sin(t) * 14)}`} />; })}
      </g>
      <OG sh={[
        { d: capsule([x - 16, y - 6], 5, [x - 16, y], 4), f: '#6a5040' },
        { d: capsule([x + 18, y - 6], 5, [x + 18, y], 4), f: '#6a5040' },
        { d: smooth([[x + 20, y - 10], [x + 36, y - 20], [x + 52, y - 10], [x + 36, y - 2]], true), f: '#c9a882' },
        { d: `M${x - 44} ${y - 6}Q${x - 40} ${y - 44} ${x - 4} ${y - 44}Q${x + 30} ${y - 40} ${x + 30} ${y - 10}Q${x} ${y} ${x - 44} ${y - 6}Z`, f: '#6a5040' },
      ]} />
      <circle cx={x + 52} cy={y - 10} r={3} fill={K.out} />
      <circle cx={x + 36} cy={y - 14} r={2} fill={K.out} />
    </g>
  );
}
/** Yerde sürünen yarasa (önden-üstten, kanatlar yarı açık, yere yaslı). x,y = gövde altı */
function Bat({ x, y }: { x: number; y: number }) {
  const c = '#4a3e3a', m = '#6a5a54';
  const wing = (k: number) => `M${x + k * 8} ${y - 20}L${x + k * 30} ${y - 40}L${x + k * 66} ${y - 30}L${x + k * 80} ${y - 6}Q${x + k * 70} ${y - 12} ${x + k * 62} ${y - 2}Q${x + k * 52} ${y - 10} ${x + k * 42} ${y}Q${x + k * 30} ${y - 8} ${x + k * 14} ${y - 2}Z`;
  return (
    <g>
      <OG sh={[{ d: wing(-1), f: m }, { d: wing(1), f: m }, { d: ell([x, y - 16], 13, 18), f: c }, { d: circ([x, y - 38], 11), f: c }, { d: `M${x - 9} ${y - 44}L${x - 12} ${y - 60}L${x - 2} ${y - 48}Z`, f: c }, { d: `M${x + 9} ${y - 44}L${x + 12} ${y - 60}L${x + 2} ${y - 48}Z`, f: c }]} />
      <g stroke={shade(m, 0.3)} stroke-width={1.4}>{[-1, 1].map((k) => <path key={k} d={`M${x + k * 30} ${y - 40}L${x + k * 62} ${y - 2}M${x + k * 30} ${y - 40}L${x + k * 42} ${y}M${x + k * 30} ${y - 40}L${x + k * 80} ${y - 6}`} />)}</g>
      <circle cx={x - 4} cy={y - 40} r={1.8} fill="#f2e6a0" />
      <circle cx={x + 4} cy={y - 40} r={1.8} fill="#f2e6a0" />
    </g>
  );
}
/** Karaciğer (yakın plan, kistli) */
function Liver({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = C.liver;
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={OW / s} sh={[{ d: smooth([[-54, -8], [-30, -30], [10, -30], [50, -20], [56, 0], [30, 22], [-10, 26], [-46, 16]], true), f: c }]} />
      {[[-28, -4, 9], [12, -10, 11], [30, 8, 7]].map(([sx, sy, r], i) => <circle key={i} cx={sx} cy={sy} r={r} fill="#e8eef0" stroke={K.out} stroke-width={1.3 / s} />)}
    </g>
  );
}
/** Köpek (yandan, sola bakar, ayakta). x,y = ayak ortası */
function Dog({ x, y }: { x: number; y: number }) {
  const c = '#b9814d', dk = shade(c, 0.2);
  return (
    <g>
      <OG sh={[
        { d: capsule([x + 30, y - 40], 4, [x + 48, y - 64], 3), f: c },
        { d: capsule([x + 24, y - 36], 5, [x + 26, y], 4.5), f: dk },
        { d: capsule([x - 18, y - 36], 5, [x - 20, y], 4.5), f: dk },
        { d: capsule([x - 28, y - 46], 18, [x + 28, y - 44], 16), f: c },
        { d: capsule([x + 16, y - 36], 5, [x + 14, y], 4.5), f: c },
        { d: capsule([x - 30, y - 36], 5, [x - 32, y], 4.5), f: c },
        { d: capsule([x - 40, y - 56], 8, [x - 50, y - 76], 9), f: c },
        { d: smooth([[x - 66, y - 82], [x - 52, y - 92], [x - 40, y - 80], [x - 50, y - 68], [x - 74, y - 68], [x - 80, y - 74]], true), f: c },
        { d: smooth([[x - 46, y - 88], [x - 36, y - 84], [x - 40, y - 66], [x - 46, y - 72]], true), f: dk },
      ]} />
      <circle cx={x - 58} cy={y - 81} r={2.2} fill={K.out} />
      <circle cx={x - 80} cy={y - 73} r={2.6} fill={K.out} />
    </g>
  );
}
/** Ölü koyun (yan yatmış, karnı bize dönük, bacaklar dimdik öne uzanmış; şematik, kansız). x,y = zemin ortası */
function DeadSheep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const wool = smooth(Array.from({ length: 28 }, (_, i) => {
    const t = (i / 28) * Math.PI * 2;
    const r = i % 2 ? 1 : 1.07;
    return [Math.cos(t) * 60 * r, -26 + Math.sin(t) * 26 * r] as P;
  }), true);
  const leg = '#3e3632';
  const L = (a: P, b: P) => [{ d: capsule(a, 4.6, b, 4), f: leg }, { d: ell(b, 5, 4), f: '#262220' }];
  return (
    <Gx x={x} y={y} s={s} sh={[
      { d: wool, f: '#ece6d8' },
      ...L([-30, -8], [-14, 26]), ...L([-14, -6], [4, 28]),
      ...L([24, -6], [50, 22]), ...L([38, -10], [66, 16]),
      // baş yere yaslı
      { d: smooth([[-52, -26], [-74, -30], [-100, -18], [-102, -4], [-74, 0], [-54, -10]], true), f: leg },
      { d: smooth([[-66, -28], [-62, -42], [-54, -38], [-58, -26]], true), f: leg },
      { d: 'M-88 -20l6 6M-82 -20l-6 6', st: '#e9e3d6', sw: 1.8 },
    ]} />
  );
}
/** Ölü tilki (yan yatmış, şematik). x,y = zemin */
function DeadFox({ x, y }: { x: number; y: number }) {
  const c = '#c96a32';
  return (
    <g>
      <OG sh={[
        { d: smooth([[x - 30, y - 2], [x - 60, y - 6], [x - 70, y - 2], [x - 50, y + 2]], true), f: c },
        { d: capsule([x - 34, y - 14], 14, [x + 20, y - 14], 13), f: c },
        { d: smooth([[x + 26, y - 20], [x + 46, y - 26], [x + 62, y - 10], [x + 40, y - 2]], true), f: c },
        { d: `M${x + 34} ${y - 24}L${x + 30} ${y - 38}L${x + 42} ${y - 26}Z`, f: c },
        { d: capsule([x - 10, y - 4], 3, [x + 6, y + 2], 3), f: '#3a2a22' },
      ]} />
      <path d={`M${x - 70} ${y - 2}l8 2`} stroke="#fff" stroke-width={3} />
      <path d={`M${x + 44} ${y - 18}l4 4M${x + 48} ${y - 18}l-4 4`} stroke={K.out} stroke-width={1.4} />
    </g>
  );
}
/** Ölü kuş (sırtüstü, şematik) */
function DeadBird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Gx x={x} y={y} s={s} sh={[
      { d: smooth([[-24, -2], [-10, -16], [14, -16], [26, -4], [10, 2], [-14, 2]], true), f: '#9aa0a8' },
      { d: 'M-24 -4L-38 -10L-34 2Z', f: '#6a707a' },
      { d: circ([28, -6], 8), f: '#6a707a' },
      { d: 'M35 -6L44 -4L35 -2Z', f: '#e0a040' },
      { d: 'M0 -16L-2 -26M6 -16L8 -26', st: '#e0a040', sw: 1.8 },
      { d: 'M25 -9l5 5M30 -9l-5 5', st: K.out, sw: 1.2 },
    ]} />
  );
}
