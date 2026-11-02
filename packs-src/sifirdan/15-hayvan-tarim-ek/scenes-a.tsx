// Sıfırdan paketi sahneleri (a): hayvanlar ve tarım ekleri. Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Arrow, Bad, Hand, K, Label, No, OG, OW, Ok, Person, POSE, Scene2, Tree,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Sh } from '../../../src/art/kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f1 = (n: number) => Math.round(n * 10) / 10;
const tr = (x: number, y: number, s = 1, a = 0, flip?: boolean) => `translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${flip ? -s : s} ${s})`;
const G = ({ x = 0, y = 0, s = 1, a = 0, flip, children }: { x?: number; y?: number; s?: number; a?: number; flip?: boolean; children?: ComponentChildren }) => (
  <g transform={tr(x, y, s, a, flip)}>{children}</g>
);
/** Yerel koordinatta çizilmiş şekil grubu (dış hat ölçeğe göre düzeltilir) */
const Gx = ({ x, y, s = 1, a = 0, flip, sh }: { x: number; y: number; s?: number; a?: number; flip?: boolean; sh: Sh[] }) => (
  <g transform={tr(x, y, s, a, flip)}>
    <OG sh={sh} ow={OW / s} />
  </g>
);
/** Yerel noktayı sahneye çevirir (flip ve ölçekle) */
const W = (x: number, y: number, s: number, flip: boolean | undefined, p: P): P => [x + (flip ? -1 : 1) * p[0] * s, y + p[1] * s];
/** El bileğini, elin verilen noktası hedefe gelecek şekilde konumlar */
function handAt<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}
const Txt = ({ x, y, t, size = 13, c = K.ink, anchor = 'middle', w = 700 }: { x: number; y: number; t: string; size?: number; c?: string; anchor?: 'start' | 'middle' | 'end'; w?: number }) => (
  <text x={x} y={y} font-size={size} font-weight={w} fill={c} text-anchor={anchor}>{t}</text>
);
/** Ölçü çizgisi + etiket */
function Dim({ a, b, text, size = 13, lx, ly, c = K.ink }: { a: P; b: P; text?: string; size?: number; lx?: number; ly?: number; c?: string }) {
  const n = angOf(a, b) + 90;
  const t1 = pol(a, n, 5), t2 = pol(a, n, -5), t3 = pol(b, n, 5), t4 = pol(b, n, -5);
  const m = lerp(a, b, 0.5);
  const d = `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}M${f1(t1[0])} ${f1(t1[1])}L${f1(t2[0])} ${f1(t2[1])}M${f1(t3[0])} ${f1(t3[1])}L${f1(t4[0])} ${f1(t4[1])}`;
  return (
    <g>
      <path d={d} stroke="#fff" stroke-width={4.5} stroke-linecap="round" />
      <path d={d} stroke={c} stroke-width={2} stroke-linecap="round" />
      {text && <Label x={lx ?? m[0]} y={ly ?? m[1]} text={text} size={size} bg={K.white} />}
    </g>
  );
}
/** Kesikli çizgi (kesim yeri, rota) */
function Dash({ a, b, d, c = K.action, w = 3 }: { a?: P; b?: P; d?: string; c?: string; w?: number }) {
  const path = d ?? `M${f1(a![0])} ${f1(a![1])}L${f1(b![0])} ${f1(b![1])}`;
  return (
    <g stroke-linecap="round" fill="none">
      <path d={path} stroke="#fff" stroke-width={w + 3} />
      <path d={path} stroke={c} stroke-width={w} stroke-dasharray="7 5" />
    </g>
  );
}
/** Termometre (x,y hazne merkezi) + etiket */
function Thermo({ x, y, text, s = 1, left }: { x: number; y: number; text?: string; s?: number; left?: boolean }) {
  return (
    <g>
      <Gx x={x} y={y} s={s} sh={[{ d: rrect(-4.5, -42, 9, 40, 4.5), f: '#f4f6f8' }, { d: circ([0, 0], 7.5), f: K.red }, { d: rrect(-1.8, -26, 3.6, 24, 1.8), f: K.red, no: true }]} />
      {text && <Label x={left ? x - 12 * s : x + 12 * s} y={y - 26 * s} text={text} size={13} bg={K.white} anchor={left ? 'end' : 'start'} />}
    </g>
  );
}
/** Panel kutusu (iki panelli sahneler) */
const Panel = ({ x, y, w, h, c = '#f6f1e6' }: { x: number; y: number; w: number; h: number; c?: string }) => (
  <rect x={x} y={y} width={w} height={h} rx={10} fill={c} stroke={K.out} stroke-width={1.5} />
);
/** Eldiven rengi filtresi (kit elini mavi eldivene çevirir); sahnede bir kez GloveDefs konmalı */
const GloveDefs = () => (
  <defs>
    <filter id="sfht-glove" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="0.16 0.30 0.05 0 0  0.27 0.5 0.08 0 0  0.40 0.72 0.14 0 0  0 0 0 1 0" />
    </filter>
  </defs>
);
const Glove = ({ children }: { children: ComponentChildren }) => <g filter="url(#sfht-glove)">{children}</g>;

/* ─────────── paket renkleri (aynı malzeme hep aynı renk) ─────────── */
const STRAW = '#e3c25e'; // saman
const STRAW_D = '#c9a443';
const WOOD = K.wood; // tahta
const WOOD_D = shade(K.wood, 0.2);
const SOIL = '#8a6040'; // toprak (kesit)
const TOPSOIL = '#5c3d27'; // koyu üst toprak
const WOOL = '#f1ebdd'; // yün (koyun)
const SHEEP_FACE = '#d8c4a8'; // koyun yüzü/bacağı
const LAMB = '#f7f1e4'; // kuzu
const GLOVE = '#4f9bd6'; // eldiven
const METAL = K.metal;
const STONE = '#a9a59b';
const IODINE = '#8a3f1c';
const DONKEY = '#9a9089';
const HORSE = '#a8673d';
const HOOF = '#5a4c44';
const HOOF_SOLE = '#c9b08a';
const FROG = '#9c7a5a';
const GRAIN = '#d9a441';
const MULB = '#4f9e45'; // dut yaprağı
const BEET = '#f3ead6'; // şeker pancarı
const SYRUP = '#b8783a';
const BARK = '#8a5b3c';
const WOOD_IN = '#ecd3a4';
const SHOOT = '#6aa845';
const GREY = '#e2e6e9'; // gri su

/* ─────────── oyuncular (rehber başına sabit) ─────────── */
/** köpek 1 (temel komutlar): at kuyruklu kadın, camgöbeği üst */
const KT = { who: 'woman', role: 'helper', skin: 1, hair: 'ponytail', hairC: K.hair.dark, sleeve: 'long', bottomC: K.pants.denim } as const;
/** köpek 2 (sürü/bekçi): bıyıklı çoban, kiremit üst */
const KS = { who: 'man', role: 'bystander4', skin: 2, hairC: K.hair.black, mustache: true, sleeve: 'long', bottomC: K.pants.brown } as const;
/** köpek 3 (iz): yeşil üstlü adam */
const KI = { who: 'man', role: 'bystander3', skin: 0, hairC: K.hair.brown, sleeve: 'long', bottomC: K.pants.khaki } as const;
/** kedi: başörtülü kadın, hardal üst */
const KD = { who: 'woman', role: 'bystander2', skin: 1, hair: 'scarf', hairC: '#6c9c5a', sleeve: 'long', bottom: 'longskirt', bottomC: '#5b5f78' } as const;
/** at-eşek alıştırma: mor üstlü genç adam */
const AE = { who: 'man', role: 'bystander', skin: 1, hairC: K.hair.black, sleeve: 'long', bottomC: K.pants.dark } as const;
/** toynak: camgöbeği üstlü adam */
const TY = { who: 'man', role: 'helper', skin: 2, hairC: K.hair.dark, mustache: true, sleeve: 'long', bottomC: K.pants.navy } as const;
/** güvercin: yaşlı adam, yeşil üst */
const GV = { who: 'oldman', role: 'bystander3', skin: 1, sleeve: 'long' } as const;
/** doğum (3 rehber): kadın çoban, kiremit üst, mavi eldiven */
const DG = { who: 'woman', role: 'bystander4', skin: 1, hair: 'bun', hairC: K.hair.black, sleeve: 'long', bottomC: K.pants.dark } as const;
/** pancar şekeri: kadın, mor üst */
const PS = { who: 'woman', role: 'bystander', skin: 0, hair: 'bun', hairC: K.hair.auburn, sleeve: 'long' } as const;
/** gri su: adam, hardal üst */
const GS = { who: 'man', role: 'bystander2', skin: 1, hairC: K.hair.brown, sleeve: 'short', bottomC: K.pants.denim } as const;

/* ════════════════════════ hayvanlar ════════════════════════ */

/** Köpek başı: merkez (0,0), burun +x yönünde. ear: sarkık kulak */
function dogHead(c: string, mask?: string, prick?: boolean): Sh[] {
  const d = shade(c, 0.18);
  return [
    prick ? { d: 'M-6 -6L-4 -20L4 -8Z', f: c } : { d: ell([0, 0], 4.2, 8.6), t: 'translate(-6 2) rotate(22)', f: mask ?? d },
    { d: circ([0, 0], 10), f: c },
    { d: capsule([4, 2], 6.5, [16, 3.5], 4.6), f: mask ?? tint(c, 0.25) },
    { d: circ([18, 2.6], 2.8), f: K.ink, no: true },
    { d: circ([6.5, -3.8], 1.8), f: K.ink, no: true },
    ...(prick ? [] : [{ d: ell([0, 0], 4.2, 8.6), t: 'translate(-6 2) rotate(22)', f: mask ?? d, ln: true } as Sh]),
  ];
}
type DogPose = 'stand' | 'sit' | 'run' | 'sniff' | 'lie' | 'lookUp';
/** Köpek (yandan, sağa bakar). x,y = taban ortası. harness: göğüs koşumu rengi; collar: boyun tasması */
function Dog({ x, y, s = 1, flip, pose = 'stand', c = '#b9814d', mask, harness, collar, fluffy, wag }: {
  x: number; y: number; s?: number; flip?: boolean; pose?: DogPose; c?: string; mask?: string; harness?: string; collar?: string; fluffy?: boolean; wag?: boolean;
}) {
  const d = shade(c, 0.16);
  const leg = (a: P, b: P, f: string, r0 = 4.6, r1 = 3.4): Sh => ({ d: capsule(a, r0, b, r1), f });
  const paw = (p: P, f: string): Sh => ({ d: ell([p[0] + 2, p[1] - 2.2], 4.6, 2.8), f });
  let sh: Sh[] = [];
  let head: P = [32, -62], ha = 0, neck: [P, P] = [[18, -44], [28, -58]];
  const tail = (a: P, b: P, cc: P): Sh[] => [
    { d: `M${a[0]} ${a[1]}Q${cc[0]} ${cc[1]} ${b[0]} ${b[1]}`, st: K.out, sw: fluffy ? 11 : 8 },
    { d: `M${a[0]} ${a[1]}Q${cc[0]} ${cc[1]} ${b[0]} ${b[1]}`, st: c, sw: fluffy ? 8 : 5 },
  ];
  if (pose === 'stand' || pose === 'run' || pose === 'sniff') {
    const run = pose === 'run';
    const fl = run ? [[18, -34], [36, -12]] as P[] : [[18, -34], [20, -2]] as P[];
    const fl2 = run ? [[12, -34], [26, -8]] as P[] : [[12, -34], [12, -2]] as P[];
    const bl = run ? [[-20, -36], [-40, -12]] as P[] : [[-22, -36], [-24, -2]] as P[];
    const bl2 = run ? [[-14, -36], [-30, -8]] as P[] : [[-16, -36], [-16, -2]] as P[];
    sh = [
      ...tail([-26, -46], run ? [-48, -54] : wag ? [-40, -66] : [-38, -60], run ? [-38, -46] : wag ? [-34, -50] : [-36, -48]),
      leg(fl[0], fl[1], d), paw(fl[1], d), leg(bl[0], bl[1], d), paw(bl[1], d),
      { d: ell([-2, -40], 28, fluffy ? 14 : 12), f: c },
      { d: ell([-20, -36], 12, 12), f: c },
      leg(fl2[0], fl2[1], c, 5, 3.6), paw(fl2[1], c), leg(bl2[0], bl2[1], c, 6, 3.6), paw(bl2[1], c),
    ];
    if (pose === 'sniff') { neck = [[16, -42], [32, -24]]; head = [38, -16]; ha = 40; }
    if (run) { neck = [[16, -44], [28, -52]]; head = [34, -54]; ha = 5; }
  } else if (pose === 'sit' || pose === 'lookUp') {
    sh = [
      ...tail([-14, -6], [-34, -2], [-26, -2]),
      leg([16, -34], [18, -2], d), paw([18, -2], d),
      { d: ell([0, 0], 15, 24), t: 'translate(2 -28) rotate(28)', f: c },
      { d: ell([-8, -13], 14, 12), f: c },
      { d: capsule([-4, -4], 4, [8, -2.6], 3.4), f: c },
      leg([10, -34], [10, -2], c, 5, 3.6), paw([10, -2], c),
    ];
    neck = [[8, -44], [16, -56]];
    head = [18, -62];
    ha = pose === 'lookUp' ? -38 : 0;
  } else {
    // lie: karnı yerde
    sh = [
      ...tail([-26, -10], [-44, -4], [-38, -8]),
      { d: ell([-2, -13], 28, fluffy ? 13 : 11), f: c },
      { d: ell([-18, -10], 12, 9), f: d, ln: true },
      { d: capsule([14, -6], 4.5, [38, -4], 3.6), f: c },
      paw([38, -4], c),
    ];
    neck = [[14, -18], [26, -26]];
    head = [30, -28];
    ha = 0;
  }
  const hs: Sh[] = [{ d: capsule(neck[0], fluffy ? 11 : 9, neck[1], fluffy ? 9 : 7.5), f: c }];
  const nk = lerp(neck[0], neck[1], 0.6);
  const na = angOf(neck[0], neck[1]) + 90;
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[...sh, ...hs]} />
      {harness && pose !== 'lie' && (
        <OG ow={OW / s} sh={[
          { d: capsule(pol(nk, na, -8), 2.6, pol(nk, na, 9), 2.6), f: harness },
          { d: pose === 'sit' || pose === 'lookUp' ? capsule([4, -44], 2.6, [-6, -18], 2.6) : capsule([6, -52], 2.8, [8, -28], 2.8), f: harness },
          { d: pose === 'sit' || pose === 'lookUp' ? capsule([-4, -46], 2.4, [14, -40], 2.4) : capsule([-4, -52], 2.6, [16, -50], 2.6), f: harness },
          { d: circ(pose === 'sit' || pose === 'lookUp' ? [-2, -46] : [-2, -53], 3), f: '#d9c36a' },
        ]} />
      )}
      {collar && <OG ow={OW / s} sh={[{ d: capsule(pol(nk, na, -7.5), 2.4, pol(nk, na, 8), 2.4), f: collar }]} />}
      <g transform={`translate(${head[0]} ${head[1]}) rotate(${ha})`}>
        <OG ow={OW / s} sh={dogHead(c, mask)} />
      </g>
    </G>
  );
}
/** Kangal/Akbaş yavrusu (yatan, tombul). x,y taban ortası */
function Puppy({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = '#eadcc0', m = '#4a3d36';
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[
        { d: 'M-24 -10Q-34 -12 -36 -4', st: K.out, sw: 9 },
        { d: 'M-24 -10Q-34 -12 -36 -4', st: c, sw: 6 },
        { d: ell([-4, -12], 24, 12), f: c },
        { d: ell([-16, -9], 10, 8), f: shade(c, 0.1), ln: true },
        { d: capsule([10, -6], 5, [28, -4], 4.4), f: c },
        { d: capsule([4, -5], 4.6, [22, -2.6], 4), f: c },
        { d: circ([24, -22], 11), f: c },
        { d: capsule([28, -19], 6, [35, -18], 4.6), f: m },
        { d: circ([39, -19], 2.6), f: K.ink, no: true },
        { d: ell([0, 0], 4.6, 8), t: 'translate(17 -19) rotate(22)', f: m },
        { d: circ([28.5, -25], 1.8), f: K.ink, no: true },
      ]} />
    </G>
  );
}

/** Koyun (yandan, sağa bakar). x,y = taban ortası. lie: yatıyor; udder: dolgun meme */
function Sheep({ x, y, s = 1, flip, lie, c = WOOL, face = SHEEP_FACE, udder, headDown, eye = true }: {
  x: number; y: number; s?: number; flip?: boolean; lie?: boolean; c?: string; face?: string; udder?: boolean; headDown?: boolean; eye?: boolean;
}) {
  const fd = shade(face, 0.15);
  const leg = (x0: number, f: string): Sh => ({ d: capsule([x0, -30], 4.2, [x0 + 1, -3], 3), f });
  const hoof = (x0: number): Sh => ({ d: rrect(x0 - 3.5, -6, 8, 6, 1.5), f: HOOF });
  const by = lie ? 26 : 0;
  const bumps: P[] = [[-38, -44], [-28, -58], [-10, -64], [10, -63], [28, -56], [38, -44], [30, -28], [8, -26], [-16, -26], [-34, -30]];
  const hx = headDown ? 50 : 50, hy = headDown ? -30 : -58;
  const head: Sh[] = headDown
    ? [
        { d: smooth([[30, -54], [46, -50], [56, -28], [50, -18], [36, -34]], true), f: c },
        { d: smooth([[44, -34], [54, -38], [62, -18], [58, -10], [48, -14]], true), f: face },
        { d: ell([0, 0], 8, 3.6), t: 'translate(44 -36) rotate(120)', f: fd },
      ]
    : [
        { d: smooth([[34, -54], [52, -64], [62, -52], [56, -40], [42, -42]], true), f: face },
        { d: ell([0, 0], 8.5, 3.8), t: 'translate(41 -58) rotate(155)', f: fd },
        { d: circ([38, -60], 9.5), f: c },
      ];
  void hx; void hy;
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <g transform={`translate(0 ${by})`}>
        <OG ow={OW / s} sh={[
          ...(lie ? [] : [leg(-26, fd), hoof(-25), leg(24, fd), hoof(25)]),
          ...bumps.map((p) => ({ d: circ(p, 13), f: c })),
          { d: ell([0, -44], 36, 19), f: c },
          ...(udder && !lie ? [{ d: smooth([[-30, -30], [-12, -30], [-14, -18], [-22, -14], [-30, -20]], true), f: '#efc3b0' } as Sh] : []),
          ...(lie ? [{ d: capsule([18, -24], 4, [36, -22], 3), f: fd }, { d: rrect(34, -26, 8, 6, 1.5), f: HOOF }] : [leg(-18, face), hoof(-17), leg(18, face), hoof(19)]),
          ...head,
        ]} />
        {eye && <circle cx={headDown ? 54 : 51} cy={headDown ? -28 : -56} r={1.9} fill={K.ink} />}
      </g>
    </G>
  );
}
/** Kuzu (yandan, sağa bakar). x,y = taban ortası. pose: stand | lie (göğsü üstünde) | suck (başı yukarıda annenin altında) */
function Lamb({ x, y, s = 1, flip, pose = 'stand', wet }: { x: number; y: number; s?: number; flip?: boolean; pose?: 'stand' | 'lie' | 'suck'; wet?: boolean }) {
  const c = wet ? '#ede4cf' : LAMB, d = shade(c, 0.14), f = '#e9d9c2';
  const leg = (a: P, b: P, col: string): Sh => ({ d: capsule(a, 3.4, b, 2.6), f: col });
  const hoof = (p: P): Sh => ({ d: rrect(p[0] - 3, p[1] - 4.5, 6.5, 4.5, 1.2), f: '#7a6a60' });
  if (pose === 'lie') {
    return (
      <G x={x} y={y} s={s} flip={flip}>
        <OG ow={OW / s} sh={[
          { d: ell([-2, -12], 24, 12), f: c },
          { d: ell([-14, -9], 10, 7), f: d, ln: true },
          { d: capsule([8, -5], 3.4, [26, -3.4], 2.8), f: f }, hoof([28, 0]),
          { d: capsule([14, -16], 7, [24, -26], 6), f: c },
          { d: smooth([[22, -34], [34, -34], [40, -24], [34, -18], [24, -22]], true), f: f },
          { d: ell([0, 0], 6, 2.8), t: 'translate(23 -31) rotate(160)', f: shade(f, 0.12) },
        ]} />
        <circle cx={32} cy={-28} r={1.6} fill={K.ink} />
      </G>
    );
  }
  const up = pose === 'suck';
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[
        leg([-14, -22], [-15, -2], d), hoof([-15, 0]), leg([12, -22], [13, -2], d), hoof([13, 0]),
        { d: ell([-1, -28], 21, 11), f: c },
        leg([-9, -22], [-9, -2], f), hoof([-9, 0]), leg([16, -22], [17, -2], f), hoof([17, 0]),
        { d: capsule([14, -32], 6, up ? [24, -44] : [22, -40], 5), f: c },
        { d: smooth(up ? [[22, -52], [32, -56], [38, -48], [32, -42], [24, -44]] : [[20, -46], [32, -48], [38, -38], [32, -32], [22, -36]], true), f: f },
        { d: ell([0, 0], 6, 2.8), t: up ? 'translate(21 -50) rotate(150)' : 'translate(20 -44) rotate(160)', f: shade(f, 0.12) },
      ]} />
      <circle cx={up ? 30 : 30} cy={up ? -51 : -42} r={1.6} fill={K.ink} />
    </G>
  );
}
/** Keçi (yandan, sağa bakar). x,y taban ortası */
function Goat({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = '#8b5e3c', d = shade(c, 0.22);
  const leg = (x0: number, f: string): Sh => ({ d: capsule([x0, -34], 4.2, [x0, -3], 3), f });
  const hoof = (x0: number): Sh => ({ d: rrect(x0 - 4, -6, 8.5, 6, 1.5), f: '#3b3537' });
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[
        leg(-24, d), hoof(-24), leg(28, d), hoof(28),
        { d: 'M-40 -52L-46 -66L-36 -56Z', f: c },
        { d: smooth([[-42, -40], [-34, -60], [0, -62], [30, -58], [42, -44], [32, -28], [0, -26], [-34, -28]], true), f: c },
        { d: smooth([[22, -58], [40, -72], [54, -64], [46, -48], [32, -40]], true), f: c },
        { d: ell([0, 0], 13, 8.5), t: 'translate(54 -70) rotate(28)', f: c },
        { d: ell([0, 0], 9, 4), t: 'translate(46 -72) rotate(160)', f: d },
        { d: 'M52 -76Q48 -94 34 -96L36 -91Q44 -88 46 -72Z', f: '#b8a789' },
        leg(-32, c), hoof(-32), leg(20, c), hoof(20),
        { d: 'M62 -64L58 -52L54 -64Z', f: d },
      ]} />
      <circle cx={56} cy={-74} r={1.8} fill={K.ink} />
    </G>
  );
}

/** Tek tip (at/eşek) yerel noktaları */
const EQ = {
  ring: [88, -104] as P, // yular halkası (çene altı)
  shoulder: [44, -88] as P,
  muzzle: [100, -104] as P,
  neck: [50, -112] as P,
  withers: [30, -102] as P,
  rump: [-44, -96] as P,
};
/** At ya da eşek (yandan, sağa bakar). x,y = taban ortası (toynaklar 0'da).
 *  kind: horse | donkey. halter: yular rengi. lift: yakın ön ayak kaldırılmış (taban arkaya bakar).
 *  head: 'up' | 'turn' (başı izleyiciye/sola dönük, hafif aşağı) */
function Equine({ x, y, s = 1, flip, kind = 'donkey', halter, lift, foal, headPose = 'up', part = 'all' }: {
  x: number; y: number; s?: number; flip?: boolean; kind?: 'horse' | 'donkey'; halter?: string; lift?: boolean; foal?: boolean; headPose?: 'up' | 'low'; part?: 'all' | 'body' | 'leg';
}) {
  const c = kind === 'horse' ? HORSE : DONKEY;
  const d = shade(c, 0.2), l = kind === 'horse' ? tint(c, 0.3) : '#e7e0d6';
  const mane = kind === 'horse' ? '#4a2c1c' : '#5d5450';
  const legR = foal ? 0.85 : 1;
  const legS = (a: P, b: P, r0: number, r1: number, f: string): Sh => ({ d: capsule(a, r0 * legR, b, r1 * legR), f });
  const hoofSh = (p: P, f = HOOF): Sh => ({ d: `M${p[0] - 6} ${p[1]}L${p[0] - 5} ${p[1] - 9}H${p[0] + 5}L${p[0] + 7} ${p[1]}Z`, f });
  const far: Sh[] = [
    legS([34, -70], [36, -38], 7, 5, d), legS([36, -38], [36, -10], 5, 4, d), hoofSh([36, 0]),
    legS([-34, -76], [-40, -44], 10, 6, d), legS([-40, -44], [-36, -10], 5, 4, d), hoofSh([-36, 0]),
  ];
  const nearBack: Sh[] = [legS([-42, -78], [-48, -44], 12, 6, c), legS([-48, -44], [-44, -10], 5.5, 4.2, c), hoofSh([-44, 0])];
  const nearFront: Sh[] = lift
    ? [
        legS([44, -76], [44, -42], 8.5, 5.5, c),
        legS([44, -42], [28, -40], 5.5, 4.2, c),
        // toynak: taban arkaya/yukarı
        { d: 'M29 -47Q21 -53 13 -51Q8 -43 12 -34Q20 -31 28 -33Z', f: HOOF },
        { d: ell([0, 0], 2.8, 7.6), t: 'translate(12.5 -42.5) rotate(4)', f: HOOF_SOLE },
      ]
    : [legS([44, -76], [44, -40], 8.5, 5.5, c), legS([44, -40], [44, -10], 5.5, 4.2, c), hoofSh([44, 0])];
  const headSh: Sh[] = headPose === 'up'
    ? [
        { d: 'M28 -98Q46 -128 62 -140L80 -124Q66 -104 60 -76Z', f: c },
        { d: smooth([[58, -140], [72, -148], [84, -136], [102, -110], [100, -98], [88, -96], [76, -110], [62, -126]], true), f: c },
        { d: smooth([[90, -112], [102, -108], [100, -98], [90, -97]], true), f: l, no: true },
      ]
    : [
        { d: 'M28 -98Q50 -112 70 -108L80 -92Q62 -86 58 -74Z', f: c },
        { d: smooth([[66, -112], [80, -116], [90, -102], [104, -74], [100, -64], [90, -64], [80, -80], [68, -96]], true), f: c },
        { d: smooth([[92, -80], [104, -74], [100, -64], [90, -65]], true), f: l, no: true },
      ];
  const earP = headPose === 'up' ? [68, -144] : [74, -112];
  const ears: Sh[] = kind === 'donkey'
    ? [
        { d: ell([0, 0], 5.5, 17), t: `translate(${earP[0] - 6} ${earP[1] - 14}) rotate(-18)`, f: c },
        { d: ell([0, 0], 5.5, 17), t: `translate(${earP[0] + 2} ${earP[1] - 15}) rotate(-6)`, f: c },
        { d: ell([0, 0], 2.4, 11), t: `translate(${earP[0] + 2} ${earP[1] - 14}) rotate(-6)`, f: '#4a4240', no: true },
      ]
    : [
        { d: `M${earP[0] - 6} ${earP[1] - 2}L${earP[0] - 6} ${earP[1] - 16}L${earP[0] + 2} ${earP[1] - 4}Z`, f: c },
        { d: `M${earP[0] - 1} ${earP[1] - 1}L${earP[0] + 1} ${earP[1] - 15}L${earP[0] + 7} ${earP[1] - 2}Z`, f: c },
      ];
  const maneSh: Sh[] = kind === 'horse'
    ? (headPose === 'up' ? [{ d: 'M24 -96Q42 -124 60 -142Q52 -120 34 -96Z', f: mane }, { d: 'M62 -144Q70 -150 72 -140L64 -138Z', f: mane }] : [{ d: 'M24 -96Q44 -112 66 -112Q50 -104 34 -94Z', f: mane }])
    : (headPose === 'up' ? [{ d: 'M26 -98Q42 -126 58 -140', st: K.out, sw: 7 }, { d: 'M26 -98Q42 -126 58 -140', st: mane, sw: 4.5 }] : [{ d: 'M26 -98Q46 -112 66 -112', st: K.out, sw: 7 }, { d: 'M26 -98Q46 -112 66 -112', st: mane, sw: 4.5 }]);
  const tailSh: Sh[] = kind === 'horse'
    ? [{ d: 'M-56 -96Q-72 -84 -70 -40Q-64 -46 -60 -40Q-58 -70 -50 -88Z', f: mane }]
    : [{ d: 'M-56 -92Q-66 -80 -64 -52', st: K.out, sw: 4.5 }, { d: 'M-56 -92Q-66 -80 -64 -52', st: c, sw: 2.5 }, { d: ell([-64, -48], 3.6, 8), f: mane }];
  const eye: P = headPose === 'up' ? [78, -128] : [86, -98];
  const halterSh: Sh[] = halter
    ? headPose === 'up'
      ? [
          { d: 'M70 -136L82 -108', st: K.out, sw: 4.6 }, { d: 'M70 -136L82 -108', st: halter, sw: 2.8 },
          { d: 'M80 -114Q92 -118 98 -112', st: K.out, sw: 4.6 }, { d: 'M80 -114Q92 -118 98 -112', st: halter, sw: 2.8 },
          { d: 'M82 -108Q86 -102 90 -100', st: K.out, sw: 4.6 }, { d: 'M82 -108Q86 -102 90 -100', st: halter, sw: 2.8 },
          { d: circ(EQ.ring, 2.8), f: '#d9c36a' },
        ]
      : [
          { d: 'M76 -108L86 -84', st: K.out, sw: 4.6 }, { d: 'M76 -108L86 -84', st: halter, sw: 2.8 },
          { d: 'M86 -88Q96 -90 100 -82', st: K.out, sw: 4.6 }, { d: 'M86 -88Q96 -90 100 -82', st: halter, sw: 2.8 },
          { d: circ([88, -78], 2.8), f: '#d9c36a' },
        ]
    : [];
  if (part === 'leg') return <G x={x} y={y} s={s} flip={flip}><OG ow={OW / s} sh={nearFront} /></G>;
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[
        ...far,
        ...tailSh,
        ...ears,
        ...headSh,
        { d: smooth([[-50, -96], [-20, -104], [20, -102], [40, -98], [54, -86], [52, -68], [30, -62], [-10, -62], [-46, -66], [-58, -82]], true), f: c },
        { d: smooth([[-44, -68], [-10, -66], [30, -66], [48, -72], [30, -63], [-10, -63]], true), f: l, no: true },
        ...maneSh,
        ...nearBack,
        ...(part === 'body' ? [] : nearFront),
      ]} />
      <OG ow={OW / s} sh={halterSh} />
      <circle cx={eye[0]} cy={eye[1]} r={2.3} fill={K.ink} />
    </G>
  );
}
/** Equine yerel noktası → sahne */
const eqPt = (x: number, y: number, s: number, flip: boolean | undefined, p: P) => W(x, y, s, flip, p);

/** Kedi (yandan oturan, sağa bakar). x,y taban ortası */
function Cat({ x, y, s = 1, flip, c = '#e39a4f' }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  const d = shade(c, 0.2);
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[
        { d: 'M-14 -4Q-34 -2 -32 -16', st: K.out, sw: 8 },
        { d: 'M-14 -4Q-34 -2 -32 -16', st: c, sw: 5 },
        { d: ell([0, 0], 13, 21), t: 'translate(-2 -22) rotate(16)', f: c },
        { d: ell([-8, -10], 12, 10), f: c },
        { d: capsule([8, -30], 3.6, [9, -2], 3), f: d },
        { d: capsule([3, -30], 3.8, [4, -2], 3.2), f: c },
        { d: 'M6 -54L4 -68L14 -58Z', f: c },
        { d: 'M14 -56L18 -70L22 -56Z', f: c },
        { d: ell([13, -48], 12, 10.5), f: c },
        { d: ell([20, -45], 5, 4), f: tint(c, 0.5), no: true },
        { d: 'M-12 -30L-6 -36M-14 -22L-6 -28', st: d, sw: 2 },
      ]} />
      <ellipse cx={18} cy={-50} rx={1.8} ry={2.4} fill={K.ink} />
      <path d="M24 -46L26 -45" stroke={K.ink} stroke-width={2} stroke-linecap="round" />
      <path d="M22 -44H34M22 -42L33 -39" stroke={K.out} stroke-width={0.8} />
    </G>
  );
}
/** Sıçan / fare (yandan, sağa bakar). x,y taban ortası */
function Rat({ x, y, s = 1, flip, c = '#8a8079' }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[
        { d: 'M-16 -6Q-30 -2 -38 -10', st: K.out, sw: 4 },
        { d: 'M-16 -6Q-30 -2 -38 -10', st: '#d9a6a0', sw: 2 },
        { d: smooth([[-18, -6], [-14, -18], [4, -20], [16, -12], [24, -6], [14, -2], [-12, -1]], true), f: c },
        { d: circ([8, -18], 4.5), f: '#d9a6a0' },
        { d: capsule([-8, -3], 2, [-6, 0], 1.6), f: '#d9a6a0' },
        { d: capsule([10, -3], 2, [12, 0], 1.6), f: '#d9a6a0' },
      ]} />
      <circle cx={16} cy={-11} r={1.4} fill={K.ink} />
      <circle cx={24.5} cy={-6.5} r={1.4} fill="#c4626a" />
    </G>
  );
}
/** Güvercin (yandan, sağa bakar). x,y taban ortası. sit: yuvada yatıyor (bacak yok) */
function Pigeon({ x, y, s = 1, flip, sit, c = '#9aa3b5' }: { x: number; y: number; s?: number; flip?: boolean; sit?: boolean; c?: string }) {
  const d = shade(c, 0.2);
  return (
    <G x={x} y={y} s={s} flip={flip}>
      <OG ow={OW / s} sh={[
        ...(sit ? [] : [{ d: 'M-2 -10L-4 0M4 -10L4 0', st: K.out, sw: 3.6 } as Sh, { d: 'M-2 -10L-4 0M4 -10L4 0', st: '#d0605a', sw: 2 } as Sh]),
        { d: 'M-12 -16L-30 -12L-28 -6L-10 -10Z', f: d },
        { d: smooth([[-16, -14], [-8, -24], [8, -26], [16, -20], [14, -10], [0, -6], [-12, -8]], true), f: c },
        { d: smooth([[-14, -14], [-4, -22], [8, -18], [-2, -12]], true), f: d },
        { d: 'M-8 -18L6 -18M-6 -14L6 -15', st: '#3b3f4b', sw: 1.6 },
        { d: capsule([10, -22], 6, [16, -32], 6), f: c },
        { d: ell([12, -24], 5, 4), f: '#7fae9a', no: true },
        { d: 'M21 -33L27 -31L21 -29Z', f: '#4a4545' },
      ]} />
      <circle cx={18} cy={-34} r={1.5} fill="#e8833a" />
    </G>
  );
}
/** İpekböceği larvası (yandan/yukarıdan, x,y baş). a yönü, s ölçek */
function Worm({ x, y, a = 0, s = 1, c = '#e4e2da', clear }: { x: number; y: number; a?: number; s?: number; c?: string; clear?: boolean }) {
  const cc = clear ? '#efe0b0' : c;
  const segs: P[] = [[0, 0], [-6, 0.8], [-12, 0], [-18, -0.8], [-24, 0], [-30, 0.6]];
  return (
    <Gx x={x} y={y} s={s} a={a} sh={[
      ...segs.slice(1).map((p, i) => ({ d: capsule(segs[i], 4.2 - i * 0.2, p, 4 - i * 0.2), f: cc })),
      { d: circ([1, 0], 3.6), f: shade(cc, 0.18) },
    ]} />
  );
}
/** Koza (x,y merkez) */
const Cocoon = ({ x, y, a = 0, s = 1, c = '#fbf8ef' }: { x: number; y: number; a?: number; s?: number; c?: string }) => (
  <Gx x={x} y={y} s={s} a={a} sh={[{ d: 'M-12 0Q-12 -8 -5 -8Q0 -5 5 -8Q12 -8 12 0Q12 8 5 8Q0 5 -5 8Q-12 8 -12 0Z', f: c }, { d: 'M-6 -4Q0 0 -6 4M6 -4Q0 0 6 4', st: shade(c, 0.2), sw: 1 }]} />
);

/* ════════════════════════ nesneler ════════════════════════ */

/** Kova (x orta, y dip) */
function Bucket({ x, y, s = 1, c = METAL, fill, w = 1 }: { x: number; y: number; s?: number; c?: string; fill?: string; w?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d={`M${-16 * w} -34Q0 -56 ${16 * w} -34`} fill="none" stroke={K.out} stroke-width={2 / s} />
      <OG ow={OW / s} sh={[{ d: `M${-18 * w} -34H${18 * w}L${14 * w} 0H${-14 * w}Z`, f: c }, { d: ell([0, -34], 18 * w, 4.5), f: fill ?? shade(c, 0.3) }]} />
    </G>
  );
}
/** Bağlama direği (x orta, y zemin) */
const PostTie = ({ x, y, h = 130 }: { x: number; y: number; h?: number }) => (
  <OG sh={[{ d: rrect(x - 6, y - h, 12, h, 3), f: WOOD }, { d: rrect(x - 8, y - h - 4, 16, 8, 3), f: WOOD_D }]} />
);
/** Ağaç kütüğü (x orta, y zemin, w genişlik, h yükseklik). cut: 'flat'|'slope'|'v' */
function Stump({ x, y, w = 30, h = 20, cut = 'slope', c = BARK }: { x: number; y: number; w?: number; h?: number; cut?: 'flat' | 'slope' | 'v'; c?: string }) {
  const l = x - w / 2, r = x + w / 2;
  const topL = cut === 'slope' ? y - h - w * 0.18 : y - h, topR = cut === 'slope' ? y - h + w * 0.18 : y - h;
  const face = cut === 'v'
    ? `M${l} ${y - h}L${x} ${y - h + w * 0.35}L${r} ${y - h}L${x} ${y - h - 6}Z`
    : ell([x, (topL + topR) / 2], w / 2, 5);
  return (
    <g>
      <OG sh={[
        { d: `M${l - 4} ${y}Q${l} ${y - 4} ${l} ${topL}H${r}L${r} ${topR}Q${r} ${y - 4} ${r + 4} ${y}Z`, f: c },
      ]} />
      {cut === 'v'
        ? <OG sh={[{ d: `M${l} ${y - h}L${x} ${y - h + w * 0.35}L${r} ${y - h}L${r} ${y - h - 4}L${l} ${y - h - 4}Z`, f: WOOD_IN }, { d: face, f: WOOD_IN, no: true }]} />
        : <OG sh={[{ d: cut === 'slope' ? `M${l} ${topL}Q${x} ${topL - 4} ${r} ${topR}Q${x} ${topR + 6} ${l} ${topL}Z` : face, f: WOOD_IN }]} />}
    </g>
  );
}
/** Yeşil sürgün demeti (kütükten çıkan) */
function Shoots({ x, y, n = 6, h = 70, spread = 30 }: { x: number; y: number; n?: number; h?: number; spread?: number }) {
  const out: JSX.Element[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5;
    const top: P = [x + t * spread * 2, y - h * (0.8 + 0.2 * Math.cos(t * 3))];
    const mid: P = [x + t * spread * 0.6, y - h * 0.45];
    out.push(<path key={'s' + i} d={`M${x + t * 8} ${y}Q${mid[0]} ${mid[1]} ${top[0]} ${top[1]}`} stroke={K.out} stroke-width={4.4} fill="none" stroke-linecap="round" />);
    out.push(<path key={'t' + i} d={`M${x + t * 8} ${y}Q${mid[0]} ${mid[1]} ${top[0]} ${top[1]}`} stroke="#7a5a3a" stroke-width={2.4} fill="none" stroke-linecap="round" />);
    for (let k = 0; k < 3; k++) {
      const p = lerp(mid, top, 0.3 + k * 0.33);
      out.push(<Gx key={'l' + i + k} x={p[0]} y={p[1]} a={(k % 2 ? 1 : -1) * 50 + t * 40} sh={[{ d: 'M0 0Q-5 -6 0 -14Q5 -6 0 0Z', f: SHOOT }]} />);
    }
  }
  return <g>{out}</g>;
}

export const SCENES: Record<string, () => JSX.Element> = {};
const S = SCENES;

/* ════════════════════════ KÖPEK ════════════════════════ */
const DOG1 = '#b9814d'; // temel komutlar köpeği (kahverengi)
const DOG3 = '#7d6450'; // iz köpeği (koyu kahve)
const MEAT = '#b5523f';
const CHEESE = '#f2d36b';
const LEASH = '#d63b35';

// Köpek 1: ödül, nohut büyüklüğünde et ve peynir parçaları avuçta
S['sf-ht-kopek-odul'] = () => {
  const pcs: [number, number, string][] = [[140, 184, MEAT], [154, 178, CHEESE], [168, 186, MEAT], [146, 198, CHEESE], [160, 200, MEAT], [174, 198, CHEESE], [152, 214, MEAT]];
  return (
    <Scene2 bg="closeup">
      {/* kesme tahtası, peynir kalıbı, bıçak */}
      <OG sh={[{ d: rrect(196, 160, 112, 54, 8), f: WOOD }, { d: rrect(196, 160, 112, 8, 4), f: tint(WOOD, 0.2), no: true }]} />
      <OG sh={[{ d: 'M214 160L222 128H262L270 160Z', f: CHEESE }, { d: 'M222 128H262L270 160', st: shade(CHEESE, 0.2), sw: 1.4 }, { d: circ([236, 146], 3.4), f: shade(CHEESE, 0.12), no: true }, { d: circ([254, 150], 2.6), f: shade(CHEESE, 0.12), no: true }]} />
      <OG sh={[{ d: rrect(270, 180, 30, 8, 3.5), f: '#6b4a32' }, { d: 'M270 180H222Q214 184 222 188H270Z', f: '#d3d9df' }]} />
      <OG sh={[{ d: rrect(232, 192, 9, 9, 2), f: CHEESE }, { d: rrect(246, 194, 9, 9, 2), f: MEAT }]} />
      {/* avuç */}
      <Hand x={150} y={236} a={-4} s={1.9} pose="open" view="palm" side="R" arm={60} skin={KT.skin} sleeve={K.role[KT.role]} />
      {pcs.map(([px, py, c], i) => <OG key={i} sh={[{ d: rrect(px - 5, py - 5, 10, 10, 2.5), f: c, t: `rotate(${(i * 23) % 40 - 20} ${px} ${py})` }]} />)}
      <Label x={76} y={44} text="nohut kadar" size={15} />
    </Scene2>
  );
};

// Köpek 1: otur — ödül burnun önünden başın üstüne kalkar, arka yere iner
S['sf-ht-kopek-otur'] = () => {
  const treat: P = [168, 96];
  const p: PersonProps = { ...KT, x: 92, y: 224, s: 1.2, pose: { ...POSE.kneel, spine: -84, head: -84, armF: { to: treat }, handF: 'fist', armB: [96, 92], face: 'neutral' } };
  return (
    <Scene2 bg="indoor">
      <Person {...p} />
      <Dog x={222} y={226} s={1.5} flip pose="lookUp" c={DOG1} collar={LEASH} />
      <OG sh={[{ d: rrect(treat[0] - 4.5, treat[1] - 10, 9, 8, 2), f: MEAT }]} />
      <Arrow from={[174, 132]} to={[188, 78]} bend={-0.35} />
      <Label x={262} y={36} text="otur" size={16} />
    </Scene2>
  );
};

// Köpek 1: gel — çömelmiş kişi kollarını açmış, köpek koşarak geliyor
S['sf-ht-kopek-gel'] = () => {
  const p: PersonProps = { ...KT, x: 82, y: 222, s: 1.2, pose: { ...POSE.kneelOne, spine: -80, head: -86, armF: [-10, -30], armB: [20, -20], handF: 'flat', handB: 'flat', face: 'calm' } };
  return (
    <Scene2 bg="outdoor">
      <Tree x={292} y={196} s={0.8} />
      <Person {...p} />
      <Dog x={228} y={222} s={1.35} flip pose="run" c={DOG1} collar={LEASH} wag />
      <Arrow from={[178, 208]} to={[136, 208]} w={6} />
      <Label x={250} y={40} text="gel" size={16} />
    </Scene2>
  );
};

// Köpek 2: 8 haftalık yavru yatan sakin koyunların arasında
S['sf-ht-kopek-yavru-suru'] = () => (
  <Scene2 bg="indoor" wall="#d9c3a1" gy={150}>
    <OG sh={[{ d: rrect(0, 50, 320, 10, 2), f: WOOD_D }, { d: rrect(0, 100, 320, 10, 2), f: WOOD_D }]} />
    <rect y={150} width={320} height={90} fill={STRAW} />
    <path d="M10 166l14 -4M60 180l12 4M120 170l14 -3M200 184l12 -4M270 172l14 3M40 226l12 -3M150 230l14 2M240 230l12 -4" stroke={STRAW_D} stroke-width={2} stroke-linecap="round" />
    <Sheep x={84} y={176} s={0.95} lie />
    <Sheep x={236} y={174} s={0.95} lie flip />
    <Sheep x={50} y={236} s={1.0} lie />
    <Sheep x={272} y={238} s={1.0} lie flip />
    <Puppy x={152} y={222} s={1.5} />
    <Label x={160} y={30} text="8 hafta" size={16} />
  </Scene2>
);

/** Yukarıdan koyun: x,y merkez, a yön (baş +x) */
const TopSheep = ({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) => (
  <Gx x={x} y={y} a={a} s={s} sh={[
    { d: ell([22, -6], 4, 6), f: SHEEP_FACE }, { d: ell([22, 6], 4, 6), f: SHEEP_FACE },
    ...([[-14, -8], [-14, 8], [0, -11], [0, 11], [13, -8], [13, 8], [-20, 0]] as P[]).map((p) => ({ d: circ(p, 8), f: WOOL })),
    { d: ell([0, 0], 20, 12), f: WOOL },
    { d: ell([26, 0], 8, 5.5), f: SHEEP_FACE },
  ]} />
);
/** Yukarıdan yavru köpek (baş +x): dört pati, iki sarkık kulak, koyu maske, kuyruk */
const TopPuppy = ({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) => {
  const c = '#eadcc0', m = '#4a3d36';
  return (
    <Gx x={x} y={y} a={a} s={s} sh={[
      { d: capsule([-14, 0], 3, [-24, 4], 2.4), f: c },
      { d: ell([0, 0], 15, 9.5), f: c },
      { d: ell([-4, 0], 7, 5), f: shade(c, 0.08), no: true },
      { d: circ([19, 0], 8), f: c },
      { d: ell([16, -8], 5, 3.2), f: m }, { d: ell([16, 8], 5, 3.2), f: m },
      { d: ell([27, 0], 5, 4), f: m },
    ]} />
  );
};

// Köpek 2: ağılda yavruya ayrılmış güvenli köşe (yatak, yem), dar aralıktan çıkıyor — yukarıdan
S['sf-ht-kopek-guvenli-kose'] = () => (
  <Scene2 bg="dark">
    <rect x={14} y={14} width={292} height={212} rx={6} fill={STRAW} />
    <path d="M40 160l12 -4M200 120l14 3M260 200l12 -4M120 200l14 2M180 40l12 4M280 100l10 -4" stroke={STRAW_D} stroke-width={2} stroke-linecap="round" />
    <rect x={14} y={14} width={292} height={212} rx={6} fill="none" stroke={K.out} stroke-width={12} />
    <rect x={14} y={14} width={292} height={212} rx={6} fill="none" stroke={WOOD} stroke-width={8} />
    {/* köşe bölmesi: tahta perde, yavrunun geçeceği dar aralık */}
    <rect x={18} y={18} width={122} height={100} fill={tint(STRAW, 0.3)} />
    <OG sh={[{ d: rrect(136, 14, 9, 108, 2), f: WOOD }, { d: rrect(14, 114, 86, 9, 2), f: WOOD }, { d: rrect(122, 114, 23, 9, 2), f: WOOD }]} />
    <OG sh={[{ d: ell([54, 56], 28, 22), f: '#7a8fb0' }, { d: ell([54, 56], 18, 13), f: tint('#7a8fb0', 0.3), no: true }]} />
    <OG sh={[{ d: circ([112, 40], 12), f: '#c6574e' }, { d: circ([112, 40], 7.5), f: '#8a5a3c' }]} />
    <TopPuppy x={111} y={126} a={70} s={1.15} />
    <Arrow from={[124, 156]} to={[160, 190]} w={6} bend={0.2} />
    <TopSheep x={214} y={74} a={200} s={1.2} />
    <TopSheep x={262} y={160} a={150} s={1.2} />
    <TopSheep x={196} y={196} a={-20} s={1.2} />
    <TopSheep x={268} y={52} a={100} s={1.1} />
  </Scene2>
);

// Köpek 2: kuzu kovalamaya "hayır" ve köpeği tasmasından tutup uzaklaştırma
S['sf-ht-kopek-kovalama-hayir'] = () => {
  const dog = { x: 178, y: 222, s: 1.25 };
  const collar = W(dog.x, dog.y, dog.s, false, [24, -53]);
  const back = W(dog.x, dog.y, dog.s, false, [-6, -50]);
  const p: PersonProps = { ...KS, x: 106, y: 224, s: 1.15, pose: { ...POSE.kneelOne, spine: -76, head: -70, armF: { to: collar }, handF: 'fist', armB: { to: back }, handB: 'flat', face: 'speak' } };
  return (
    <Scene2 bg="outdoor">
      <Lamb x={270} y={220} s={1.2} />
      <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
      <Dog x={dog.x} y={dog.y} s={dog.s} pose="stand" c="#eadcc0" mask="#4a3d36" collar={LEASH} fluffy />
      <Person {...p} only={['armF']} />
      <Arrow from={[collar[0] + 6, collar[1] - 34]} to={[collar[0] - 44, collar[1] - 34]} w={6} />
      <Label x={70} y={38} text="HAYIR!" size={16} bg={K.danger} />
    </Scene2>
  );
};

// Köpek 3: göğüs koşumu ve kısa kayış; boyun tasması yanlış
S['sf-ht-iz-kosum'] = () => {
  const d = { x: 140, y: 222, s: 2.3 };
  const ring = W(d.x, d.y, d.s, false, [-2, -53]);
  return (
    <Scene2 bg="outdoor">
      <Dog x={d.x} y={d.y} s={d.s} c={DOG3} harness={LEASH} />
      <path d={`M${ring[0]} ${ring[1]}Q${ring[0] - 40} ${ring[1] - 40} ${ring[0] - 60} 0`} stroke={K.out} stroke-width={5} fill="none" />
      <path d={`M${ring[0]} ${ring[1]}Q${ring[0] - 40} ${ring[1] - 40} ${ring[0] - 60} 0`} stroke="#2f6fa8" stroke-width={3} fill="none" />
      <Ok x={ring[0] + 18} y={ring[1] - 26} r={14} />
      {/* ek resim: boyun tasması */}
      <Panel x={226} y={14} w={84} h={70} />
      <Dog x={262} y={78} s={0.7} c={DOG3} collar={LEASH} />
      <path d={`M${262 + 22 * 0.7} ${78 - 54 * 0.7}L${306} ${24}`} stroke="#2f6fa8" stroke-width={2.4} />
      <Bad x={238} y={28} r={11} />
    </Scene2>
  );
};

// Köpek 3: ilk iz — düz sırada ayak izleri, her izde yiyecek, sonda eldiven ve ödül
S['sf-ht-iz-yiyecek-adim'] = () => {
  const xs = [40, 82, 124, 166, 208];
  return (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill={K.grass} />
      {[[20, 30], [70, 200], [140, 40], [220, 210], [290, 60], [250, 150], [100, 120]].map(([gx, gy], i) => <path key={i} d={`M${gx} ${gy}l3 -8M${gx + 6} ${gy}l-1 -9M${gx + 11} ${gy}l4 -7`} stroke={K.grassShade} stroke-width={2} stroke-linecap="round" />)}
      {xs.map((x, i) => {
        const yy = i % 2 ? 106 : 134;
        return (
          <g key={i}>
            <Gx x={x} y={yy} a={90} sh={[{ d: smooth([[-14, -6], [-4, -8], [12, -6], [16, 0], [12, 6], [-4, 7], [-14, 5], [-16, 0]], true), f: shade(K.grass, 0.38) }]} />
            <OG sh={[{ d: rrect(x - 5, yy - 5, 10, 10, 2.5), f: MEAT }]} />
          </g>
        );
      })}
      {/* eldiven ve ödül yığını */}
      <Gx x={266} y={118} a={-20} s={1.2} sh={[{ d: 'M-14 10L-12 -10Q-10 -16 -6 -12L-6 -20Q-4 -26 0 -20L1 -22Q4 -27 7 -21L8 -18Q12 -22 14 -16L12 6Q10 14 0 14Z', f: '#ece6da' }, { d: rrect(-12, 6, 24, 8, 3), f: '#c6574e' }]} />
      <OG sh={[[256, 146], [266, 150], [276, 146], [261, 140], [271, 139]].map(([px, py]) => ({ d: rrect(px - 5, py - 5, 10, 10, 2.5), f: MEAT }))} />
      <Dim a={[82, 78]} b={[124, 78]} text="60 cm" lx={103} ly={62} />
      <Dim a={[40, 182]} b={[266, 182]} text="3–12 m" lx={153} ly={200} />
    </Scene2>
  );
};

// Köpek 3: koşumlu köpek burnu yerde izi sürüyor, eğitici kısa kayışla arkada
S['sf-ht-iz-burun-yerde'] = () => {
  const d = { x: 202, y: 222, s: 1.45 };
  const ring = W(d.x, d.y, d.s, false, [-2, -53]);
  const hand: P = [104, 148];
  const p: PersonProps = { ...KI, x: 76, y: 224, s: 1.1, pose: { ...POSE.walk, armF: { to: hand }, handF: 'fist', face: 'neutral' } };
  return (
    <Scene2 bg="outdoor">
      {[150, 190, 230, 270, 300].map((fx, i) => <ellipse key={i} cx={fx} cy={i % 2 ? 214 : 222} rx={8} ry={3.5} fill={K.grassShade} />)}
      <path d={`M${hand[0]} ${hand[1]}Q${(hand[0] + ring[0]) / 2} ${(hand[1] + ring[1]) / 2 + 10} ${ring[0]} ${ring[1]}`} stroke={K.out} stroke-width={4.6} fill="none" />
      <path d={`M${hand[0]} ${hand[1]}Q${(hand[0] + ring[0]) / 2} ${(hand[1] + ring[1]) / 2 + 10} ${ring[0]} ${ring[1]}`} stroke="#2f6fa8" stroke-width={2.6} fill="none" />
      <Person {...p} />
      <Dog x={d.x} y={d.y} s={d.s} pose="sniff" c={DOG3} harness={LEASH} />
      <Arrow from={[262, 200]} to={[306, 200]} />
    </Scene2>
  );
};

/* ════════════════════════ KEDİ ════════════════════════ */
const CAT = '#e39a4f';
/** Metal bidon (kapaklı). x orta, y dip */
const Bin = ({ x, y, w = 40, h = 56, lid = true }: { x: number; y: number; w?: number; h?: number; lid?: boolean }) => (
  <OG sh={[
    { d: rrect(x - w / 2, y - h, w, h, 4), f: METAL },
    { d: `M${x - w / 2} ${y - h * 0.35}H${x + w / 2}M${x - w / 2} ${y - h * 0.7}H${x + w / 2}`, st: shade(METAL, 0.25), sw: 1.6 },
    ...(lid ? [{ d: rrect(x - w / 2 - 3, y - h - 7, w + 6, 9, 3), f: shade(METAL, 0.15) } as Sh, { d: rrect(x - 6, y - h - 12, 12, 6, 2), f: shade(METAL, 0.3) } as Sh] : []),
  ]} />
);
/** Toprak küp (kapaklı). x orta, y dip */
const Jar = ({ x, y, s = 1, c = '#b5683f' }: { x: number; y: number; s?: number; c?: string }) => (
  <Gx x={x} y={y} s={s} sh={[
    { d: 'M-12 0Q-24 -20 -18 -40Q-14 -50 -12 -54H12Q14 -50 18 -40Q24 -20 12 0Z', f: c },
    { d: rrect(-15, -60, 30, 8, 3), f: shade(c, 0.2) },
    { d: 'M-18 -36H18', st: shade(c, 0.25), sw: 1.6 },
  ]} />
);
/** Çuval (ağzı açık, dökülmüş) */
const Sack = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <Gx x={x} y={y} s={s} sh={[
    { d: 'M-24 0Q-30 -30 -18 -56L-22 -64Q-4 -58 4 -66Q12 -60 22 -64L18 -54Q30 -30 24 0Z', f: '#c9b48a' },
    { d: ell([0, -58], 18, 6), f: GRAIN },
    { d: 'M-14 -30Q0 -26 14 -32', st: shade('#c9b48a', 0.25), sw: 1.4 },
  ]} />
);
const Grains = ({ pts }: { pts: P[] }) => <OG sh={pts.map((p) => ({ d: ell(p, 3.2, 2.2), f: GRAIN }))} />;

// Kedi: beklenti — fareyi (küçük) avlar, sıçanı (büyük) nadiren
S['sf-ht-kedi-ambar'] = () => (
  <Scene2 bg="indoor" wall="#e3d6bd" gy={176}>
    <Cat x={150} y={222} s={1.5} c={CAT} flip />
    {/* fare: küçük, kedinin önünde */}
    <Rat x={62} y={222} s={0.75} flip />
    <Ok x={60} y={170} r={13} />
    <Label x={60} y={140} text="30 g" size={14} bg={K.white} />
    {/* sıçan: büyük, kedinin arkasında */}
    <Rat x={262} y={224} s={2.0} />
    <Bad x={262} y={150} r={13} />
    <Label x={262} y={120} text="300 g" size={14} bg={K.white} />
  </Scene2>
);

// Kedi: tahıl kapaklı kapta (doğru); açık çuval, dökülen tane, sıçan (yanlış)
S['sf-ht-kedi-kap-sakla'] = () => (
  <Scene2 bg="indoor" wall="#e3d6bd" gy={176}>
    <rect x={159} y={0} width={2} height={176} fill={shade('#e3d6bd', 0.2)} />
    {/* sol: yanlış */}
    <Sack x={70} y={206} s={1.4} />
    <Grains pts={[[100, 210], [110, 214], [118, 208], [128, 216], [96, 218], [136, 210], [40, 214], [30, 208]]} />
    <Rat x={132} y={228} s={1.2} flip />
    <Bad x={30} y={30} r={14} />
    {/* sağ: doğru */}
    <Bin x={212} y={212} w={50} h={80} />
    <OG sh={[{ d: rrect(256, 140, 44, 72, 8), f: '#dcecf2', op: 0.95 }, { d: rrect(258, 160, 40, 50, 6), f: GRAIN, no: true }, { d: rrect(254, 130, 48, 12, 3), f: '#8e99a6' }]} />
    {[[266, 172], [278, 180], [288, 168], [270, 192], [284, 198], [276, 164]].map(([gx, gy], i) => <ellipse key={i} cx={gx} cy={gy} rx={3} ry={2} fill={shade(GRAIN, 0.2)} />)}
    <Ok x={290} y={30} r={14} />
  </Scene2>
);

/** Eldivenli el: kol (kolluklu) normal, el mavi eldiven */
const GHand = (h: HandProps & { armLen?: number }) => (
  <g>
    <Hand {...h} arm={h.armLen ?? 200} />
    <Glove><Hand {...h} arm={18} sleeve={undefined} /></Glove>
  </g>
);
/** Aletin sapını tutan el: piv aletin sap ucu, sa sap yönü (sahne açısı, sapın uca doğru) */
const toolHand = (piv: P, sa: number, hs = 1, skin = 1) => handAt({ a: sa + 90, s: hs, pose: 'hold' as const, side: 'R' as const, skin, grip: 12 }, 'grip', piv);

// Kedi: eldivenle kum sandığından dışkıyı her gün kaldırma
S['sf-ht-kedi-kum-eldiven'] = () => {
  const box = { x: 30, y: 160, w: 170, h: 54 };
  const scoop: P = [134, 154];
  const end: P = [104, 80];
  const h = handAt({ a: 236, s: 1.15, pose: 'hold' as const, side: 'R' as const, skin: KD.skin, grip: 9 }, 'grip', lerp(scoop, end, 0.78));
  return (
    <Scene2 bg="closeup">
      <GloveDefs />
      <OG sh={[{ d: `M${box.x} ${box.y}H${box.x + box.w}L${box.x + box.w - 10} ${box.y + box.h}H${box.x + 10}Z`, f: '#6f9fd0' }, { d: ell([box.x + box.w / 2, box.y], box.w / 2, 12), f: '#e6d6b0' }]} />
      <OG sh={[{ d: ell([66, 160], 8, 4), f: '#7a5a3c' }, { d: ell([164, 162], 6, 3.4), f: '#7a5a3c' }]} />
      <OG sh={[{ d: capsule(scoop, 3.5, end, 3.5), f: '#e6e8eb' }, { d: `M${scoop[0] - 20} ${scoop[1] - 2}L${scoop[0] + 4} ${scoop[1] - 10}L${scoop[0] + 10} ${scoop[1] + 6}L${scoop[0] - 14} ${scoop[1] + 12}Z`, f: '#e6e8eb' }, { d: ell([scoop[0] - 5, scoop[1] + 1], 7, 3.6), f: '#7a5a3c' }]} />
      <GHand {...h} sleeve={K.role[KD.role]} />
      <Bucket x={262} y={216} s={1.3} c="#c6574e" />
      <Arrow from={[150, 196]} to={[236, 176]} bend={0.3} />
      <Label x={84} y={40} text="her gün" size={16} />
    </Scene2>
  );
};

/* ════════════════════════ AT VE EŞEK ════════════════════════ */
const ROPE = '#d9a13a';
const Rope = ({ a, b, sag = 0 }: { a: P; b: P; sag?: number }) => {
  const m = lerp(a, b, 0.5);
  const d = `M${f1(a[0])} ${f1(a[1])}Q${f1(m[0])} ${f1(m[1] + sag)} ${f1(b[0])} ${f1(b[1])}`;
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke={K.out} stroke-width={4.4} />
      <path d={d} stroke={ROPE} stroke-width={2.6} />
    </g>
  );
};

// At-eşek: baskı ve bırakma — iki panel
S['sf-ht-at-baski-birak'] = () => {
  const e1 = { x: 82, y: 210, s: 0.62 };
  const e2 = { x: 238, y: 210, s: 0.62 };
  const r1 = eqPt(e1.x, e1.y, e1.s, false, EQ.ring);
  const r2 = eqPt(e2.x, e2.y, e2.s, false, [88, -78]);
  const h1: P = [r1[0] - 34, r1[1] + 24];
  const p1: PersonProps = { ...AE, x: e1.x + 4, y: 222, s: 0.74, pose: { ...POSE.standSide, armF: { to: h1 }, handF: 'fist', armB: [96, 92], face: 'neutral' } };
  const neck2 = eqPt(e2.x, e2.y, e2.s, false, [52, -100]);
  const h2: P = [neck2[0] - 4, neck2[1] + 30];
  const p2: PersonProps = { ...AE, x: e2.x + 4, y: 222, s: 0.74, pose: { ...POSE.standSide, armF: { to: neck2 }, handF: 'flat', armB: { to: h2 }, handB: 'fist', face: 'calm' } };
  return (
    <Scene2 bg="outdoor" gy={186}>
      <rect x={159} y={0} width={2} height={240} fill="#fff" />
      <Equine x={e1.x} y={e1.y} s={e1.s} kind="donkey" halter="#3d7ad6" foal />
      <Rope a={r1} b={h1} />
      <Person {...p1} />
      <Arrow from={[r1[0] + 4, r1[1] + 14]} to={[r1[0] - 24, r1[1] + 34]} w={5} />
      <Equine x={e2.x} y={e2.y} s={e2.s} kind="donkey" halter="#3d7ad6" foal headPose="low" />
      <Rope a={r2} b={h2} sag={24} />
      <Person {...p2} />
      <Label x={20} y={26} text="1" size={15} anchor="start" />
      <Label x={176} y={26} text="2" size={15} anchor="start" />
      <Ok x={292} y={30} r={13} />
    </Scene2>
  );
};

// At-eşek: önden çekme yanlış; omzun yanında yürütme, daireler doğru
S['sf-ht-at-yandan-yurutme'] = () => {
  const ew = { x: 32, y: 212, s: 0.55 };
  const ec = { x: 200, y: 212, s: 0.62 };
  const rw = eqPt(ew.x, ew.y, ew.s, false, EQ.ring);
  const hw: P = [rw[0] + 26, rw[1] + 14];
  const pw: PersonProps = { ...AE, x: 112, y: 222, s: 0.7, flip: true, pose: { ...POSE.standSide, spine: -104, head: -96, legB: [120, 96], legF: [80, 86], armF: { to: hw }, handF: 'fist', armB: { to: [hw[0] + 4, hw[1] + 2] }, handB: 'fist', face: 'worried' } };
  const rc = eqPt(ec.x, ec.y, ec.s, false, EQ.ring);
  const hc: P = [rc[0] - 14, rc[1] + 34];
  const pc: PersonProps = { ...AE, x: ec.x + 30, y: 226, s: 0.74, pose: { ...POSE.walk, armF: { to: hc }, handF: 'fist', face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={186}>
      <rect x={129} y={0} width={2} height={240} fill="#fff" />
      <Equine x={ew.x} y={ew.y} s={ew.s} kind="donkey" halter="#3d7ad6" />
      <Rope a={rw} b={hw} />
      <Person {...pw} />
      <Bad x={20} y={26} r={12} />
      <ellipse cx={ec.x + 14} cy={216} rx={104} ry={18} fill="none" stroke="#fff" stroke-width={6} />
      <ellipse cx={ec.x + 14} cy={216} rx={104} ry={18} fill="none" stroke={K.action} stroke-width={3} stroke-dasharray="8 6" />
      <Equine x={ec.x} y={ec.y} s={ec.s} kind="donkey" halter="#3d7ad6" />
      <Rope a={rc} b={hc} sag={10} />
      <Person {...pc} />
      <Arrow from={[ec.x + 100, 222]} to={[ec.x + 116, 206]} w={5} />
      <Ok x={296} y={26} r={12} />
    </Scene2>
  );
};

/** Ayak kaldırma sahnesi: eşek/at, yanında bele eğilmiş kişi toynağı tutuyor (yüzü hayvanın arkasına) */
function LiftScene({ kind, cast, tied, pick }: { kind: 'horse' | 'donkey'; cast: Omit<PersonProps, 'x' | 'y'>; tied?: boolean; pick?: boolean }) {
  const e = { x: 96, y: 222, s: 1.22 };
  const hoof = eqPt(e.x, e.y, e.s, false, [18, -42]);
  const shoulder = eqPt(e.x, e.y, e.s, false, [40, -86]);
  const ring = eqPt(e.x, e.y, e.s, false, EQ.ring);
  const p: PersonProps = {
    ...cast, x: 196, y: 228, s: 1.0, flip: true,
    pose: { spine: -46, chest: -32, head: -22, legB: [100, 94], legF: [84, 90], armF: { to: [hoof[0] + 4, hoof[1] + 8] }, armB: { to: shoulder }, handF: 'mitten', handB: 'flat', face: 'neutral' },
  };
  return (
    <g>
      {tied && <PostTie x={292} y={222} h={150} />}
      {tied && <Rope a={ring} b={[284, ring[1] - 2]} sag={8} />}
      <Equine x={e.x} y={e.y} s={e.s} kind={kind} halter="#3d7ad6" lift part="body" />
      <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
      <Equine x={e.x} y={e.y} s={e.s} kind={kind} lift part="leg" />
      <Person {...p} only={['armF']} />
      {pick && <Gx x={hoof[0] + 2} y={hoof[1] + 12} a={-30} sh={[{ d: rrect(-3, 0, 6, 22, 3), f: '#c6574e' }, { d: 'M-1 0V-8Q-1 -12 4 -12', st: K.out, sw: 4.2 }, { d: 'M-1 0V-8Q-1 -12 4 -12', st: METAL, sw: 2.4 }]} />}
    </g>
  );
}
// At-eşek: ayak verme — omuzdan bacağa kayan el, bileğin arkasından kaldırma
S['sf-ht-at-ayak-kaldirma'] = () => (
  <Scene2 bg="outdoor" gy={186}>
    <LiftScene kind="donkey" cast={AE} />
    <Arrow from={[106, 98]} to={[106, 150]} w={5} />
  </Scene2>
);

/* ════════════════════════ TOYNAK ════════════════════════ */

// Toynak: güvenlik — göz hizasında bağlı at, kişi çömelmeden, vücudu ata yakın
S['sf-ht-toynak-baglama'] = () => (
  <Scene2 bg="outdoor" gy={186}>
    <LiftScene kind="horse" cast={TY} tied />
  </Scene2>
);

/** Toynak altı (taban görünüşü): x,y merkez, uç yukarıda. long: uzamış duvar */
function HoofSole({ x, y, s = 1, long }: { x: number; y: number; s?: number; long?: boolean }) {
  const wall = 'M0 -62Q40 -60 46 -14Q48 18 34 44L22 50Q30 20 26 -6Q20 -40 0 -42Q-20 -40 -26 -6Q-30 20 -22 50L-34 44Q-48 18 -46 -14Q-40 -60 0 -62Z';
  return (
    <Gx x={x} y={y} s={s} sh={[
      { d: 'M0 -62Q42 -60 47 -14Q50 20 34 46Q22 54 12 46Q0 40 -12 46Q-22 54 -34 46Q-50 20 -47 -14Q-42 -60 0 -62Z', f: HOOF_SOLE },
      { d: long ? 'M0 -72Q50 -70 56 -14Q58 22 40 52L34 44Q48 18 46 -14Q40 -60 0 -62Q-40 -60 -46 -14Q-48 18 -34 44L-40 52Q-58 22 -56 -14Q-50 -70 0 -72Z' : wall, f: HOOF },
      { d: 'M0 -18L18 40Q8 46 0 38Q-8 46 -18 40Z', f: FROG },
      { d: 'M0 -18L20 42M0 -18L-20 42', st: shade(HOOF_SOLE, 0.45), sw: 3 },
      { d: 'M-34 -16Q-30 10 -20 30M34 -16Q30 10 20 30', st: shade(HOOF_SOLE, 0.15), sw: 1.2 },
    ]} />
  );
}

/** Toynak kazıyıcı: sap ucu piv, sa yön (kanca uca doğru) */
const HoofPick = ({ piv, sa, s = 1 }: { piv: P; sa: number; s?: number }) => (
  <Gx x={piv[0]} y={piv[1]} a={sa} s={s} sh={[
    { d: capsule([0, 0], 5, [40, 0], 5), f: '#c6574e' },
    { d: 'M40 0H70Q78 0 78 8', st: K.out, sw: 7 },
    { d: 'M40 0H70Q78 0 78 8', st: METAL, sw: 4.4 },
  ]} />
);
// Toynak: kazıyıcıyla topuktan uca, okun yanındaki oluklar
S['sf-ht-toynak-kaziyici'] = () => {
  const piv: P = [262, 214];
  const sa = -128;
  const h = toolHand(pol(piv, sa, 20), sa, 1.1, TY.skin);
  return (
    <Scene2 bg="closeup">
      <HoofSole x={140} y={124} s={1.6} />
      <HoofPick piv={piv} sa={sa} s={1.25} />
      <Hand {...h} arm={200} sleeve={K.role[TY.role]} />
      <Arrow from={[96, 186]} to={[110, 70]} w={6} />
      <Label x={64} y={36} text="uç" size={14} bg={K.white} />
      <Label x={64} y={218} text="topuk" size={14} bg={K.white} />
    </Scene2>
  );
};

// Toynak: kerpetenle uzamış duvardan ince şerit; tabanı oyma yanlış
S['sf-ht-toynak-kesim'] = () => (
  <Scene2 bg="closeup">
    <HoofSole x={130} y={136} s={1.45} long />
    {/* kerpeten: ağız duvarın ucunda */}
    <OG sh={[
      { d: capsule([150, 32], 5, [250, 0], 5), f: '#c6574e' },
      { d: capsule([162, 44], 5, [262, 26], 5), f: '#b63a31' },
      { d: 'M118 30Q132 18 150 28L156 40Q140 40 128 44Z', f: METAL },
      { d: circ([152, 36], 4), f: shade(METAL, 0.3) },
    ]} />
    <OG sh={[{ d: 'M106 30Q124 24 140 28L140 33Q124 30 106 35Z', f: HOOF }]} />
    <Ok x={92} y={30} r={13} />
    {/* ek resim: tabanı oyma */}
    <Panel x={222} y={120} w={86} h={106} />
    <HoofSole x={265} y={178} s={0.62} />
    <Gx x={268} y={176} a={-30} sh={[{ d: 'M0 0L26 -6L28 -2L2 4Z', f: METAL }, { d: rrect(26, -8, 20, 9, 3), f: '#6b4a32' }]} />
    <Bad x={236} y={134} r={11} />
  </Scene2>
);

/* ════════════════════════ GÜVERCİN ════════════════════════ */
const EGG = '#f7f3ea';
/** Yuva gözü (önden): x,y sol üst, w kenar */
const Cubby = ({ x, y, w }: { x: number; y: number; w: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={w} fill="#5a3f2c" stroke={K.out} stroke-width={1.5} />
    <rect x={x} y={y + w - 8} width={w} height={8} fill={WOOD_D} />
  </g>
);
const Nest = ({ x, y, w = 40 }: { x: number; y: number; w?: number }) => (
  <OG sh={[{ d: ell([x, y], w / 2, w / 7), f: STRAW }, { d: `M${x - w / 2 + 4} ${y - 2}L${x + w / 2 - 6} ${y + 2}M${x - w / 3} ${y + 2}L${x + w / 3} ${y - 3}`, st: STRAW_D, sw: 1.5 }]} />
);
/** Güvercin yavrusu (tüylenmiş, oturan) */
const Squab = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <Gx x={x} y={y} s={s} sh={[
    { d: smooth([[-14, 0], [-14, -14], [0, -20], [14, -12], [14, 0]], true), f: '#c9c2b4' },
    { d: circ([10, -22], 8), f: '#c9c2b4' },
    { d: 'M17 -22L24 -20L17 -18Z', f: '#4a4545' },
    { d: 'M-10 -12L6 -12', st: '#a39a8a', sw: 1.4 },
  ]} />
);

// Güvercin: her çifte yan yana iki yuva gözü (biri yumurtalı, biri yavrulu)
S['sf-ht-guvercin-yuva-gozu'] = () => {
  const w = 70, x0 = 30, y0 = 30, gap = 10;
  const cells: P[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) cells.push([x0 + c * (w + gap) + 20, y0 + r * (w + gap) + 6]);
  return (
    <Scene2 bg="indoor" wall="#d9c3a1" gy={226}>
      <rect x={30} y={22} width={260} height={180} rx={4} fill={WOOD} stroke={K.out} stroke-width={1.5} />
      {cells.map(([cx, cy], i) => <Cubby key={i} x={cx} y={cy} w={w} />)}
      {/* alt sıra, ilk iki göz: çiftin yuvaları */}
      <rect x={cells[3][0] - 5} y={cells[3][1] - 5} width={2 * w + gap + 10} height={w + 10} rx={6} fill="none" stroke={K.action} stroke-width={3.5} />
      <Nest x={cells[3][0] + w / 2} y={cells[3][1] + w - 12} w={50} />
      <OG sh={[{ d: ell([cells[3][0] + w / 2 - 7, cells[3][1] + w - 18], 6, 8), f: EGG }, { d: ell([cells[3][0] + w / 2 + 8, cells[3][1] + w - 17], 6, 8), f: EGG }]} />
      <Nest x={cells[4][0] + w / 2} y={cells[4][1] + w - 12} w={50} />
      <Squab x={cells[4][0] + w / 2 - 2} y={cells[4][1] + w - 14} s={1.1} />
      <Pigeon x={cells[0][0] + w / 2} y={cells[0][1] + w - 8} s={1.1} />
      <Pigeon x={cells[2][0] + w / 2} y={cells[2][1] + w - 8} s={1.1} flip c="#b3b9c6" />
      <Dim a={[cells[5][0], cells[5][1] + w + 10]} b={[cells[5][0] + w, cells[5][1] + w + 10]} text="30 cm" lx={cells[5][0] + w / 2} ly={cells[5][1] + w + 12} />
    </Scene2>
  );
};

// Güvercin: yuvada iki yumurta üstünde kuluçkadaki kuş, yanında eşi
S['sf-ht-guvercin-kulucka'] = () => (
  <Scene2 bg="indoor" wall="#d9c3a1" gy={226}>
    <rect x={24} y={30} width={272} height={186} rx={4} fill={WOOD} stroke={K.out} stroke-width={1.5} />
    <rect x={40} y={44} width={240} height={160} fill="#5a3f2c" stroke={K.out} stroke-width={1.5} />
    <rect x={40} y={190} width={240} height={14} fill={WOOD_D} />
    <Nest x={130} y={184} w={130} />
    <OG sh={[{ d: ell([106, 176], 9, 12), f: EGG }]} />
    <Pigeon x={140} y={186} s={2.6} sit />
    <Pigeon x={232} y={190} s={2.2} flip c="#b3b9c6" />
    <Label x={160} y={22} text="17–18 gün" size={15} />
  </Scene2>
);

/** Ağız-burun bezi (yan yüz) */
const FaceCloth = ({ r }: { r: ReturnType<typeof rig> }) => {
  const m = r.mouth;
  const dir = r.flip ? -1 : 1;
  const hr = r.headR;
  return <OG sh={[{ d: `M${m[0] + dir * 5} ${m[1] - hr * 0.55}L${m[0] - dir * hr * 1.0} ${m[1] - hr * 0.7}L${m[0] - dir * hr * 1.1} ${m[1] + hr * 0.3}Q${m[0]} ${m[1] + hr * 0.5} ${m[0] + dir * 4} ${m[1] + hr * 0.15}Z`, f: '#f4f1ea' }]} />;
};
/** Püskürtme şişesi: x,y tetik altı (tutma noktası), sağa püskürtür */
const Sprayer = ({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) => (
  <Gx x={x} y={y} s={s} flip={flip} sh={[
    { d: rrect(-10, 0, 20, 30, 4), f: '#9dd5f6' },
    { d: 'M-6 0V-10H8L14 -6V-2H6V0Z', f: '#3d7ad6' },
    { d: 'M6 -4L12 4', st: K.out, sw: 2.4 },
  ]} />
);

// Güvercin: temizlikte önce ıslatma, ağız-burun bezli; kuru süpürme yanlış
S['sf-ht-guvercin-islak-temizlik'] = () => {
  const grip: P = [176, 132];
  const p: PersonProps = { ...GV, x: 118, y: 224, s: 1.2, pose: { ...POSE.standSide, spine: -84, chest: -70, head: -64, armF: { to: grip }, handF: 'fist', armB: [70, 70], face: 'neutral' } };
  const r = rig(p);
  return (
    <Scene2 bg="indoor" wall="#d9c3a1" gy={196}>
      {[[200, 214], [222, 222], [246, 212], [268, 224], [236, 230], [210, 232]].map(([dx, dy], i) => <ellipse key={i} cx={dx} cy={dy} rx={6} ry={2.6} fill="#f2f0ea" stroke={K.out} stroke-width={1} />)}
      <Person {...p} over={() => <FaceCloth r={r} />} />
      <Sprayer x={grip[0] + 4} y={grip[1] - 4} s={1.3} />
      {[[204, 150], [216, 170], [228, 190], [214, 186], [236, 168], [240, 200]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={3} fill={K.water} />)}
      {/* ek resim: kuru süpürme */}
      <Panel x={222} y={14} w={86} h={86} />
      <OG sh={[{ d: capsule([248, 26], 2.6, [272, 76], 2.6), f: WOOD }, { d: 'M262 74L284 72L292 92L266 94Z', f: STRAW }]} />
      <ellipse cx={290} cy={80} rx={14} ry={9} fill="#b9b2a4" opacity={0.85} />
      <Bad x={234} y={28} r={10} />
    </Scene2>
  );
};

/* ════════════════════════ DOĞUM (koyun, kuzu) ════════════════════════ */
/** Turuncu kesikli işaret halkası */
const Ring = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <g fill="none">
    <circle cx={x} cy={y} r={r} stroke="#fff" stroke-width={6} />
    <circle cx={x} cy={y} r={r} stroke={K.action} stroke-width={3.4} stroke-dasharray="7 5" />
  </g>
);
/** Eldiven: kişinin eli üstüne */
const gloveAt = (h: P, k = 1) => <OG sh={[{ d: circ(h, 6.5 * k), f: GLOVE }]} />;

// Doğum 1: yaklaşan doğum belirtileri — sürüden ayrı, dolgun meme, kalça önünde çöküntü
S['sf-ht-dogum-belirti'] = () => {
  const sh = { x: 176, y: 214, s: 1.75 };
  const ud = W(sh.x, sh.y, sh.s, false, [-21, -24]);
  const hip = W(sh.x, sh.y, sh.s, false, [-18, -58]);
  return (
    <Scene2 bg="outdoor" gy={176}>
      <Sheep x={30} y={186} s={0.55} headDown />
      <Sheep x={74} y={182} s={0.5} flip />
      <Sheep x={sh.x} y={sh.y} s={sh.s} udder />
      <Ring x={ud[0]} y={ud[1]} r={20} />
      <Ring x={hip[0]} y={hip[1]} r={20} />
    </Scene2>
  );
};

// Doğum 1: doğum bölmesi — 1,2 × 1,2 m, kuru saman, anne ve kuzu
S['sf-ht-dogum-bolme'] = () => (
  <Scene2 bg="indoor" wall="#d9c3a1" gy={150}>
    <OG sh={[{ d: 'M40 150L80 112H280L280 150Z', f: shade(WOOD, 0.12) }]} />
    {[96, 136, 176, 216, 256].map((x) => <rect key={x} x={x} y={114} width={2} height={36} fill={WOOD_D} />)}
    <OG sh={[{ d: 'M40 150V196L80 158V112Z', f: WOOD }]} />
    <rect x={0} y={150} width={320} height={90} fill={K.floor} />
    <OG sh={[{ d: 'M40 150H280L300 196H24Z', f: STRAW }]} />
    <path d="M70 168l14 -4M120 180l12 4M180 166l14 -3M230 184l12 -4M100 190l14 2M250 172l12 3" stroke={STRAW_D} stroke-width={2} stroke-linecap="round" />
    <Sheep x={150} y={186} s={1.15} lie />
    <Lamb x={236} y={190} s={1.2} pose="lie" flip />
    {/* ön perde (alçak) */}
    <OG sh={[{ d: rrect(18, 196, 290, 12, 2), f: WOOD }, { d: rrect(18, 216, 290, 12, 2), f: WOOD }, { d: rrect(18, 190, 10, 46, 2), f: WOOD_D }, { d: rrect(298, 190, 10, 46, 2), f: WOOD_D }]} />
    <Dim a={[24, 236]} b={[302, 236]} text="1,2 m" lx={163} ly={232} />
  </Scene2>
);

// Doğum 1: normal geliş — iki ön ayak tabanı aşağı, burun ayakların üstünde (şema)
S['sf-ht-dogum-normal-gelis'] = () => {
  const sh = { x: 168, y: 214, s: 2.3 };
  const u = W(sh.x, sh.y, sh.s, false, [-14, -42]);
  return (
    <Scene2 bg="closeup">
      <g opacity={0.55}><Sheep x={sh.x} y={sh.y} s={sh.s} eye={false} /></g>
      <OG sh={[{ d: ell(u, 62, 34), f: '#f3d9d0', op: 0.95 }]} />
      <Gx x={u[0] + 18} y={u[1] - 2} s={1.25} sh={[
        { d: ell([14, 4], 28, 17), f: LAMB },
        { d: capsule([-6, 14], 3.4, [-46, 16], 2.8), f: LAMB },
        { d: capsule([-6, 8], 3.4, [-48, 10], 2.8), f: LAMB },
        { d: rrect(-54, 13, 8, 6, 1.5), f: '#7a6a60' },
        { d: rrect(-56, 7, 8, 6, 1.5), f: '#7a6a60' },
        { d: smooth([[-8, -6], [-34, -6], [-44, 2], [-34, 6], [-10, 8]], true), f: '#e9d9c2' },
        { d: ell([-4, -6], 5, 3), f: shade('#e9d9c2', 0.12) },
      ]} />
      <circle cx={u[0] + 18 - 22 * 1.25} cy={u[1] - 2 - 1 * 1.25} r={2} fill={K.ink} />
      <Arrow from={[u[0] - 62, u[1] + 10]} to={[u[0] - 100, u[1] + 20]} w={5} />
      <Ok x={290} y={30} r={14} />
    </Scene2>
  );
};

// Doğum 2: eldivenli, kayganlaştırılmış el — parmak uçları birleşik koni
S['sf-ht-dogum-el-koni'] = () => (
  <Scene2 bg="closeup">
    <OG sh={[{ d: capsule([-20, 150], 22, [150, 130], 18), f: K.role[DG.role] }]} />
    <OG sh={[
      { d: capsule([40, 146], 19, [160, 128], 17), f: GLOVE },
      { d: smooth([[150, 110], [200, 102], [252, 116], [278, 128], [252, 138], [206, 152], [154, 148]], true), f: GLOVE },
      { d: 'M200 106Q236 116 276 127M202 120Q238 124 276 128M204 134Q238 132 276 129', st: shade(GLOVE, 0.3), sw: 1.6 },
      { d: 'M174 148Q210 156 250 138', st: shade(GLOVE, 0.3), sw: 1.6 },
    ]} />
    <path d="M190 108Q216 104 236 112M120 126Q140 120 160 120" stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round" opacity={0.85} />
    <circle cx={258} cy={118} r={2.4} fill="#fff" opacity={0.85} />
    <Arrow from={[220, 64]} to={[296, 64]} w={6} />
  </Scene2>
);

/** Kuzu bacağı şeması: noktalar boyunca */
function LegDiagram({ pts, x, y }: { pts: P[]; x: number; y: number }) {
  const sh: Sh[] = pts.slice(1).map((p, i) => ({ d: capsule([pts[i][0] + x, pts[i][1] + y], 7 - i * 1.2, [p[0] + x, p[1] + y], 6 - i * 1.2), f: LAMB }));
  const last = pts[pts.length - 1], prev = pts[pts.length - 2];
  const a = angOf(prev, last);
  return (
    <g>
      <OG sh={sh} />
      <Gx x={last[0] + x} y={last[1] + y} a={a} sh={[{ d: 'M-2 -6H8L10 6H-2Z', f: '#7a6a60' }]} />
      {pts.slice(1, -1).map((p, i) => <circle key={i} cx={p[0] + x} cy={p[1] + y} r={4} fill={K.action} stroke="#fff" stroke-width={1.5} />)}
    </g>
  );
}
// Doğum 2: ön bacak U (bilek ve diz aynı yöne), arka bacak Z (ters yöne)
S['sf-ht-dogum-u-z-bacak'] = () => (
  <Scene2 bg="closeup">
    <Panel x={12} y={12} w={144} h={216} />
    <Panel x={164} y={12} w={144} h={216} />
    <Txt x={84} y={42} t="ön bacak" size={16} />
    <Txt x={236} y={42} t="arka bacak" size={16} />
    <LegDiagram x={50} y={70} pts={[[0, 0], [0, 64], [44, 74], [52, 30]]} />
    <LegDiagram x={196} y={70} pts={[[0, 0], [40, 40], [6, 84], [58, 100]]} />
    <Txt x={84} y={214} t="U" size={30} c={K.action} />
    <Txt x={236} y={214} t="Z" size={30} c={K.action} />
  </Scene2>
);

// Doğum 2: çekme yönü — yakın plan: kuzunun iki ön ayağı eldivenli elde, aşağı ve dışarı yay
S['sf-ht-dogum-cekme-yonu'] = () => {
  const h = handAt({ a: 166, s: 0.95, pose: 'hold' as const, side: 'L' as const, view: 'back' as const, skin: DG.skin, grip: 10 }, 'grip', [70, 145]);
  return (
    <Scene2 bg="closeup">
      <GloveDefs />
      <g opacity={0.55}><Sheep x={204} y={222} s={2.0} eye={false} /></g>
      <OG sh={[{ d: ell([186, 136], 52, 30), f: '#f3d9d0', op: 0.95 }]} />
      {/* kuzu: gövde içeride, iki ön ayak ve baş dışarıda */}
      <OG sh={[
        { d: ell([196, 138], 32, 19), f: LAMB },
        { d: capsule([156, 148], 4.4, [52, 150], 3.6), f: LAMB },
        { d: rrect(42, 145, 11, 9, 2), f: '#7a6a60' },
        { d: capsule([156, 140], 4.4, [50, 141], 3.6), f: LAMB },
        { d: rrect(40, 136, 11, 9, 2), f: '#7a6a60' },
        { d: smooth([[166, 124], [124, 121], [96, 126], [90, 134], [102, 139], [166, 140]], true), f: '#e9d9c2' },
        { d: ell([0, 0], 8, 3.4), t: 'translate(138 124) rotate(172)', f: shade('#e9d9c2', 0.12) },
      ]} />
      <circle cx={112} cy={128} r={2} fill={K.ink} />
      <GHand {...h} sleeve={K.role[DG.role]} />
      <Arrow from={[34, 162]} to={[114, 224]} bend={0.45} w={6} />
      {/* küçük: düz yukarı çekme yanlış */}
      <Panel x={242} y={14} w={64} h={70} />
      <Arrow from={[274, 74]} to={[274, 28]} w={5} />
      <Bad x={296} y={24} r={10} />
    </Scene2>
  );
};

// Yeni doğan: ağız ve burundaki sıvıyı parmakla aşağı sıyırma
S['sf-ht-yenidogan-agiz-temizle'] = () => {
  const h = handAt({ a: 200, s: 1.3, pose: 'point' as const, side: 'R' as const, skin: DG.skin }, 'tip', [228, 116]);
  return (
    <Scene2 bg="closeup">
      <GloveDefs />
      <rect y={180} width={320} height={60} fill={STRAW} />
      <Gx x={150} y={130} s={2.6} sh={[
        { d: ell([-30, 12], 30, 16), f: '#ede4cf' },
        { d: capsule([-14, 4], 9, [0, -8], 8), f: '#ede4cf' },
        { d: smooth([[-4, -18], [16, -22], [34, -10], [30, 2], [8, 2], [-6, -6]], true), f: '#e9d9c2' },
        { d: ell([0, 0], 7, 3.2), t: 'translate(-2 -16) rotate(160)', f: shade('#e9d9c2', 0.12) },
      ]} />
      <circle cx={150 + 14 * 2.6} cy={130 - 12 * 2.6} r={4} fill={K.ink} />
      <ellipse cx={150 + 31 * 2.6} cy={130 - 7 * 2.6} rx={3} ry={2} fill={K.ink} />
      <OG sh={[{ d: ell([238, 128], 5, 7), f: K.waterLight }, { d: ell([226, 140], 4, 5), f: K.waterLight }]} />
      <GHand {...h} sleeve={K.role[DG.role]} />
      <Arrow from={[268, 92]} to={[262, 160]} w={5} />
    </Scene2>
  );
};

// Yeni doğan: nefes almıyorsa göğsü üstünde, kuru samanla sırtını ve kaburgalarını ovma
S['sf-ht-yenidogan-ovma'] = () => {
  const l = { x: 180, y: 214, s: 2.2 };
  const back = W(l.x, l.y, l.s, false, [-6, -24]);
  const p: PersonProps = { ...DG, x: 60, y: 224, s: 1.15, pose: { ...POSE.kneel, spine: -66, chest: -56, head: -46, armF: { to: [back[0], back[1] + 4] }, armB: { to: [back[0] - 26, back[1] + 10] }, face: 'neutral' } };
  return (
    <Scene2 bg="indoor" wall="#d9c3a1" gy={170}>
      <rect y={170} width={320} height={70} fill={STRAW} />
      <path d="M20 190l14 -4M90 216l12 4M160 200l14 -3M240 226l12 -4M280 190l14 2" stroke={STRAW_D} stroke-width={2} stroke-linecap="round" />
      <Lamb x={l.x} y={l.y} s={l.s} pose="lie" wet />
      <Person {...p} over={(r) => (
        <g>
          {gloveAt(r.handB, 1.1)}
          <OG sh={[{ d: ell(r.handF, 14, 8), f: STRAW }, { d: `M${r.handF[0] - 12} ${r.handF[1] - 2}L${r.handF[0] + 12} ${r.handF[1] + 2}M${r.handF[0] - 10} ${r.handF[1] + 4}L${r.handF[0] + 10} ${r.handF[1] - 4}`, st: STRAW_D, sw: 1.6 }]} />
        </g>
      )} />
      <Arrow from={[back[0] - 28, back[1] - 26]} to={[back[0] + 30, back[1] - 26]} w={5} />
      <Arrow from={[back[0] + 30, back[1] - 40]} to={[back[0] - 28, back[1] - 40]} w={5} />
    </Scene2>
  );
};

// Yeni doğan: göbek kordonunu iyotlu küçük kaba batırma
S['sf-ht-yenidogan-gobek-iyot'] = () => {
  const l = { x: 150, y: 176, s: 3.0 };
  const navel = W(l.x, l.y, l.s, false, [2, -17]);
  const cup: P = [navel[0], navel[1] + 40];
  const h = handAt({ a: 0, s: 1.2, pose: 'hold' as const, side: 'R' as const, skin: DG.skin, grip: 26 }, 'grip', [cup[0], cup[1] + 4]);
  return (
    <Scene2 bg="closeup">
      <GloveDefs />
      <Lamb x={l.x} y={l.y} s={l.s} />
      <OG sh={[{ d: capsule(navel, 3.4, [navel[0] + 1, navel[1] + 26], 2.6), f: '#e8b9a4' }]} />
      <GHand {...h} sleeve={K.role[DG.role]} armLen={120} />
      <OG sh={[{ d: `M${cup[0] - 13} ${cup[1] - 14}H${cup[0] + 13}L${cup[0] + 10} ${cup[1] + 18}H${cup[0] - 10}Z`, f: '#dcecf2', op: 0.95 }, { d: `M${cup[0] - 12} ${cup[1] - 4}H${cup[0] + 12}L${cup[0] + 10} ${cup[1] + 17}H${cup[0] - 10}Z`, f: IODINE, no: true }]} />
      <Label x={64} y={40} text="iyot" size={15} />
    </Scene2>
  );
};

/* ════════════════════════ İPEKBÖCEĞİ ════════════════════════ */
/** Dut yaprağı (x,y sap, a yön) */
const MulLeaf = ({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) => (
  <Gx x={x} y={y} a={a} s={s} sh={[
    { d: 'M0 0Q-20 -8 -22 -28Q-20 -46 0 -54Q20 -46 22 -28Q20 -8 0 0Z', f: MULB },
    { d: 'M0 -2V-50M0 -20L-14 -32M0 -20L14 -32M0 -34L-10 -44M0 -34L10 -44', st: shade(MULB, 0.3), sw: 1.4 },
  ]} />
);
/** Buharlı ısıtma: geniş tencere (x orta, y dip), ocak altında */
const BigPot = ({ x, y, w = 120, h = 60, c = '#8e99a6', fillC = K.water }: { x: number; y: number; w?: number; h?: number; c?: string; fillC?: string }) => (
  <OG sh={[
    { d: capsule([x - w / 2 - 10, y - h + 10], 4, [x - w / 2, y - h + 10], 4), f: shade(c, 0.2) },
    { d: capsule([x + w / 2, y - h + 10], 4, [x + w / 2 + 10, y - h + 10], 4), f: shade(c, 0.2) },
    { d: `M${x - w / 2} ${y - h}H${x + w / 2}L${x + w / 2 - 4} ${y - 4}Q${x + w / 2 - 4} ${y} ${x + w / 2 - 10} ${y}H${x - w / 2 + 10}Q${x - w / 2 + 4} ${y} ${x - w / 2 + 4} ${y - 4}Z`, f: c },
    { d: ell([x, y - h], w / 2, 7), f: fillC },
  ]} />
);
/** Ocak (odun ateşi + taş) x orta, y zemin */
const FireBase = ({ x, y, w = 130 }: { x: number; y: number; w?: number }) => (
  <g>
    <OG sh={[{ d: rrect(x - w / 2, y - 30, 26, 30, 4), f: STONE }, { d: rrect(x + w / 2 - 26, y - 30, 26, 30, 4), f: STONE }]} />
    <OG sh={[
      { d: `M${x - 30} ${y - 4}Q${x - 26} ${y - 30} ${x - 12} ${y - 34}Q${x - 14} ${y - 20} ${x} ${y - 30}Q${x + 2} ${y - 14} ${x + 14} ${y - 34}Q${x + 26} ${y - 26} ${x + 30} ${y - 4}Z`, f: K.fire },
      { d: `M${x - 14} ${y - 4}Q${x - 10} ${y - 20} ${x} ${y - 22}Q${x + 10} ${y - 18} ${x + 14} ${y - 4}Z`, f: K.fireCore, no: true },
    ]} />
  </g>
);
const Steam = ({ xs, y, h = 30 }: { xs: number[]; y: number; h?: number }) => (
  <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.95}>
    {xs.map((x) => <path key={x} d={`M${x} ${y}c-6 -${h / 4} 6 -${h / 2} 0 -${h * 0.75}c-4 -${h / 8} 2 -${h / 5} 0 -${h / 4}`} />)}
  </g>
);

// İpek: küçük larvalar ince doğranmış taze dut yaprağında, 26–28 °C
S['sf-ht-ipek-genc-larva'] = () => {
  const bits: P[] = [];
  for (let i = 0; i < 46; i++) bits.push([62 + Math.abs(Math.sin(i * 12.9898) * 43758.5) % 196, 66 + Math.abs(Math.sin(i * 78.233) * 12345.6) % 134]);
  const worms: [number, number, number][] = [[90, 110, 20], [150, 90, -30], [200, 140, 160], [120, 170, 60], [230, 100, 200], [170, 180, -10], [80, 160, 100]];
  return (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill="#c9b08a" />
      <OG sh={[{ d: rrect(30, 40, 260, 180, 8), f: WOOD }, { d: rrect(42, 52, 236, 156, 4), f: tint(WOOD, 0.35) }]} />
      {bits.map(([bx, by], i) => <Gx key={i} x={bx} y={by} a={(i * 47) % 180} sh={[{ d: rrect(-6, -4, 12, 8, 2), f: i % 3 ? MULB : tint(MULB, 0.2) }]} />)}
      {worms.map(([wx, wy, a], i) => <Worm key={i} x={wx} y={wy} a={a} s={0.75} />)}
      <MulLeaf x={262} y={200} a={-30} s={1.1} />
      <Thermo x={300} y={96} text="26–28 °C" left />
    </Scene2>
  );
};

// İpek: kozalık — raftaki kuru çalı/saman demetleri arasında kozalar
S['sf-ht-ipek-kozalik'] = () => {
  const twigs: JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    const bx = 40 + i * 30;
    const d = `M${bx} 198Q${bx - 10} 150 ${bx + 6} 110M${bx + 2} 160L${bx + 20} 132M${bx - 2} 150L${bx - 18} 120M${bx + 4} 128L${bx + 14} 100`;
    twigs.push(<path key={'o' + i} d={d} stroke={K.out} stroke-width={4.4} fill="none" stroke-linecap="round" />);
    twigs.push(<path key={'f' + i} d={d} stroke={i % 2 ? STRAW_D : '#9a7a52'} stroke-width={2.4} fill="none" stroke-linecap="round" />);
  }
  const coc: [number, number, number, string][] = [[56, 140, 20, '#fbf8ef'], [100, 120, -30, '#f3d86b'], [128, 160, 70, '#fbf8ef'], [168, 118, 10, '#fbf8ef'], [216, 146, -40, '#f3d86b'], [252, 120, 30, '#fbf8ef'], [276, 160, 80, '#fbf8ef'], [80, 176, -10, '#fbf8ef']];
  return (
    <Scene2 bg="indoor" wall="#e3d6bd" gy={226}>
      <OG sh={[{ d: rrect(18, 196, 284, 14, 3), f: WOOD }, { d: rrect(26, 210, 10, 24, 2), f: WOOD_D }, { d: rrect(284, 210, 10, 24, 2), f: WOOD_D }]} />
      {twigs}
      {coc.map(([cx, cy, a, c], i) => <Cocoon key={i} x={cx} y={cy} a={a} s={1.1} c={c} />)}
      <Worm x={196} y={92} a={-70} s={1.1} clear />
      <path d="M190 100L176 110M196 98L208 112M186 106L200 120" stroke="#fff" stroke-width={1} opacity={0.9} />
    </Scene2>
  );
};

// İpek: kozaları kaynayan suyun buharında delikli sepette, üstü bezle örtülü
S['sf-ht-ipek-koza-bogma'] = () => (
  <Scene2 bg="indoor" wall="#e3d6bd" gy={210}>
    <FireBase x={160} y={226} w={150} />
    <BigPot x={160} y={196} w={140} h={60} />
    {/* delikli sepet */}
    <OG sh={[{ d: 'M96 136H224L214 104H106Z', f: '#c9a06c' }]} />
    {[112, 132, 152, 172, 192, 210].map((hx) => <circle key={hx} cx={hx} cy={128} r={2.6} fill={shade('#c9a06c', 0.4)} />)}
    {[[124, 104], [146, 100], [168, 102], [190, 104], [136, 94], [178, 94]].map(([cx, cy], i) => <Cocoon key={i} x={cx} y={cy} s={0.9} c="#fbf8ef" />)}
    <OG sh={[{ d: 'M98 104Q160 74 222 104L226 112Q160 92 94 112Z', f: '#f4f1ea' }]} />
    <Steam xs={[92, 228]} y={140} h={40} />
    <Label x={262} y={40} text="10–15 dk" size={15} />
  </Scene2>
);

/* ════════════════════════ PANCAR ŞEKERİ ════════════════════════ */
/** Şeker pancarı (yan): x,y tepe ortası, s */
const Beet = ({ x, y, s = 1, a = 0, peeled }: { x: number; y: number; s?: number; a?: number; peeled?: boolean }) => (
  <Gx x={x} y={y} s={s} a={a} sh={[
    { d: 'M-24 0Q-26 30 -10 70Q-2 92 0 108Q4 92 10 70Q26 30 24 0Q12 -6 0 -6Q-12 -6 -24 0Z', f: peeled ? '#fbf7ec' : BEET },
    ...(peeled ? [] : [{ d: 'M-24 0Q-12 -6 0 -6Q12 -6 24 0L23 14Q12 10 0 10Q-12 10 -23 14Z', f: '#a9c47a' } as Sh, { d: 'M-12 2L-8 6M0 0L2 6M10 2L12 7', st: '#6c7a46', sw: 1.6 } as Sh]),
    { d: 'M-16 40Q-8 44 0 40M-8 64Q0 68 6 64', st: shade(BEET, 0.15), sw: 1.2 },
  ]} />
);
// Pancar: tepe kısmını yeşil-beyaz sınırdan kesme
S['sf-ht-pancar-tepe-kes'] = () => {
  const cut = 103;
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(30, 150, 260, 60, 8), f: WOOD }]} />
      <Beet x={100} y={120} s={1.25} a={-90} />
      <Dash a={[cut + 14, 70]} b={[cut + 14, 168]} />
      <OG sh={[{ d: rrect(cut + 9, 8, 9, 36, 3), f: '#6b4a32' }, { d: `M${cut + 9} 44H${cut + 19}L${cut + 19} 84Q${cut + 14} 90 ${cut + 9} 80Z`, f: '#d3d9df' }]} />
      <Arrow from={[cut - 14, 30]} to={[cut - 14, 76]} w={5} />
    </Scene2>
  );
};

// Pancar: lahana rendesinde ince dilim, dilimler doğrudan sıcak suya
S['sf-ht-pancar-dilim'] = () => (
  <Scene2 bg="indoor" wall="#e3d6bd" gy={214}>
    <BigPot x={150} y={226} w={170} h={70} c="#e8edf2" fillC={K.waterLight} />
    <Steam xs={[96, 214]} y={150} h={30} />
    {[[132, 160], [150, 166], [170, 158], [140, 176], [162, 180]].map(([sx, sy], i) => <Gx key={i} x={sx} y={sy} a={i * 30} sh={[{ d: ell([0, 0], 9, 3), f: '#fbf7ec' }]} />)}
    {/* rende: eğik tahta */}
    <Gx x={158} y={100} a={-28} sh={[{ d: rrect(-90, -10, 180, 20, 4), f: WOOD }, { d: rrect(-20, -6, 40, 12, 2), f: METAL }, { d: 'M-14 0H14', st: K.out, sw: 1.6 }]} />
    <Beet x={170} y={70} s={0.75} a={-118} peeled />
    <Thermo x={296} y={200} text="78–82 °C" left />
    <Label x={54} y={36} text="1,5 mm" size={14} />
  </Scene2>
);

// Pancar: sığ tepside kaynayan şuruptan köpüğü kevgirle alma
S['sf-ht-pancar-kopuk-al'] = () => {
  const sk: P = [170, 128];
  const sa = -40;
  const end = pol(sk, sa, 90);
  const h = toolHand(pol(sk, sa, 74), sa + 180, 1.1, PS.skin);
  return (
    <Scene2 bg="outdoor" gy={186}>
      <FireBase x={150} y={228} w={210} />
      <OG sh={[{ d: 'M40 150H260L250 186H50Z', f: '#e8edf2' }, { d: ell([150, 150], 110, 10), f: SYRUP }]} />
      {[[80, 148], [104, 152], [128, 147], [196, 150], [222, 148], [240, 152]].map(([fx, fy], i) => <ellipse key={i} cx={fx} cy={fy} rx={10} ry={4} fill="#f2e2bf" stroke={K.out} stroke-width={1} />)}
      <OG sh={[{ d: capsule(sk, 3, end, 3), f: METAL }, { d: ell(sk, 18, 7), f: METAL }, { d: ell([sk[0], sk[1] - 3], 15, 5), f: '#f2e2bf' }]} />
      <Hand {...h} arm={200} sleeve={K.role[PS.role]} />
      <Arrow from={[sk[0] - 50, sk[1] - 10]} to={[sk[0] - 22, sk[1] - 34]} bend={-0.3} />
    </Scene2>
  );
};

/* ════════════════════════ BALTALIK ════════════════════════ */
/** Yukarıdan ağaç tacı */
const Crown = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <OG sh={[{ d: circ([x, y], r), f: K.leaf }, { d: circ([x - r * 0.3, y - r * 0.3], r * 0.45), f: tint(K.leaf, 0.2), no: true }]} />
);
// Baltalık: alan şeritlere bölünmüş, her yıl yalnız biri kesilir
S['sf-ht-baltalik-parsel'] = () => {
  const n = 6, x0 = 20, w = 280 / n, y0 = 46, h = 170;
  return (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill="#c9b78f" />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * w;
        const items: JSX.Element[] = [];
        for (let k = 0; k < 4; k++) {
          const cx = x + w / 2 + (k % 2 ? 8 : -8), cy = y0 + 22 + k * 40;
          if (i === 0) items.push(<OG key={k} sh={[{ d: circ([cx, cy], 6), f: WOOD_IN }, { d: circ([cx, cy], 2.4), f: shade(WOOD_IN, 0.2), no: true }]} />);
          else items.push(<Crown key={k} x={cx} y={cy} r={4 + i * 3.4} />);
        }
        return (
          <g key={i}>
            <rect x={x} y={y0} width={w} height={h} fill={i === 0 ? '#d9c8a0' : '#a9c47a'} stroke="#fff" stroke-width={2} />
            {items}
            <Txt x={x + w / 2} y={36} t={['1', '2', '3', '…', '19', '20'][i]} size={16} c={K.ink} />
          </g>
        );
      })}
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="#fff" stroke-width={7} />
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={K.action} stroke-width={4} />
    </Scene2>
  );
};

// Baltalık: alçak, düz ve hafif eğik kesim doğru; V kesim (su biriken) yanlış
S['sf-ht-baltalik-kutuk-kesim'] = () => (
  <Scene2 bg="outdoor" gy={170}>
    <rect x={159} y={0} width={2} height={240} fill="#fff" />
    <rect y={200} width={320} height={40} fill={SOIL} />
    <Stump x={80} y={204} w={50} h={28} cut="slope" />
    <Dim a={[124, 204]} b={[124, 176]} text="3–10 cm" lx={128} ly={150} />
    <Ok x={32} y={30} r={13} />
    <Stump x={238} y={204} w={50} h={34} cut="v" />
    <OG sh={[{ d: 'M222 178L238 190L254 178Z', f: K.water }]} />
    <Bad x={292} y={30} r={13} />
  </Scene2>
);

/** Dikenli dal çit (x1..x2, y zemin) */
function ThornHedge({ x1, x2, y, h = 40 }: { x1: number; x2: number; y: number; h?: number }) {
  const ps: string[] = [];
  for (let xx = x1; xx < x2; xx += 14) ps.push(`M${xx} ${y}L${xx + 10} ${y - h}M${xx + 12} ${y}L${xx - 2} ${y - h * 0.8}M${xx + 4} ${y - h * 0.5}L${xx + 12} ${y - h * 0.6}`);
  const d = ps.join('');
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke={K.out} stroke-width={4.4} />
      <path d={d} stroke="#6b4a32" stroke-width={2.4} />
    </g>
  );
}
// Baltalık: kesilen kütükten sürgünler; 4 yıl hayvan sokmayın, dikenli çit
S['sf-ht-baltalik-surgun'] = () => (
  <Scene2 bg="outdoor" gy={176}>
    <Shoots x={110} y={206} n={7} h={120} spread={40} />
    <Stump x={110} y={214} w={50} h={20} cut="slope" />
    <ThornHedge x1={190} x2={226} y={226} h={58} />
    <Goat x={272} y={224} s={0.95} flip />
    <No x={264} y={176} r={26} />
    <Label x={60} y={36} text="4 yıl" size={16} />
  </Scene2>
);

/* ════════════════════════ FİDANLIK ════════════════════════ */
const ACORN = '#a8743f';
const WALNUT = '#c9a477';
const Acorn = ({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) => (
  <Gx x={x} y={y} a={a} s={s} sh={[{ d: ell([0, 3], 7, 10), f: ACORN }, { d: 'M-8 -3Q0 -12 8 -3Q0 0 -8 -3Z', f: '#7a5634' }, { d: capsule([0, -8], 1.2, [0, -12], 1.2), f: '#7a5634' }]} />
);
const Walnut = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <Gx x={x} y={y} s={s} sh={[{ d: ell([0, 0], 11, 10), f: WALNUT }, { d: 'M0 -10V10M-6 -6Q-2 0 -6 6M6 -6Q2 0 6 6', st: shade(WALNUT, 0.3), sw: 1.4 }]} />
);

// Fidanlık: su testi — batanlar sağlam, yüzenler boş
S['sf-ht-fidan-su-testi'] = () => (
  <Scene2 bg="closeup">
    <path d="M86 40Q160 6 234 40" fill="none" stroke={K.out} stroke-width={3} />
    <OG sh={[{ d: 'M70 40H250L234 214H86Z', f: tint(METAL, 0.5) }]} />
    <path d="M75 70H245L234 210H86Z" fill={K.water} opacity={0.55} />
    <path d="M75 70H245" stroke="#fff" stroke-width={2} />
    <Acorn x={112} y={66} a={70} s={1.3} />
    <Walnut x={170} y={66} s={1.2} />
    <Acorn x={214} y={64} a={-60} s={1.3} />
    <Acorn x={112} y={196} s={1.3} a={20} />
    <Walnut x={140} y={198} s={1.2} />
    <Acorn x={168} y={196} s={1.3} a={-30} />
    <Walnut x={196} y={198} s={1.2} />
    <Bad x={276} y={64} r={14} />
    <Ok x={276} y={190} r={14} />
  </Scene2>
);

// Fidanlık: soğuklatma — nemli kumla katlanmış tohum, kuzey duvarı dibinde gömülü kap
S['sf-ht-fidan-soguklatma'] = () => (
  <Scene2 bg="outdoor" gy={110}>
    <OG sh={[{ d: rrect(0, 20, 64, 100, 0), f: '#e9e0d0' }, { d: 'M-4 24L32 4L68 24Z', f: '#c2583e' }]} />
    <rect x={0} y={110} width={320} height={130} fill={SOIL} />
    <rect x={0} y={110} width={320} height={12} fill={TOPSOIL} />
    {/* gömülü delikli kap */}
    <OG sh={[{ d: 'M90 128H230L222 222H98Z', f: '#c9b48a' }]} />
    {[[100, 150], [110, 190], [218, 160], [212, 200]].map(([hx, hy], i) => <circle key={i} cx={hx} cy={hy} r={2.4} fill={shade('#c9b48a', 0.5)} />)}
    {[0, 1, 2].map((k) => <rect key={k} x={98 + k * 1.5} y={134 + k * 28} width={124 - k * 3} height={18} fill="#e6cf9a" />)}
    {[[120, 162], [150, 160], [184, 162], [208, 158], [128, 190], [160, 192], [196, 190]].map(([wx, wy], i) => (i % 2 ? <Walnut key={i} x={wx} y={wy} s={0.8} /> : <Acorn key={i} x={wx} y={wy} a={80} s={0.9} />))}
    <OG sh={[{ d: rrect(84, 120, 152, 10, 3), f: STRAW }]} />
    <Thermo x={276} y={92} text="1–5 °C" left />
    <Label x={276} y={140} text="3 ay" size={15} />
  </Scene2>
);

// Fidanlık: ekilmiş yatağın üstü tel kafesle örtülü, kenarları gömülü
S['sf-ht-fidan-tel-ortu'] = () => {
  const grid: string[] = [];
  for (let x = 54; x <= 266; x += 12) grid.push(`M${x} 140V198`);
  for (let y = 140; y <= 196; y += 12) grid.push(`M48 ${y}H272`);
  return (
    <Scene2 bg="outdoor" gy={186}>
      <OG sh={[{ d: 'M40 200Q60 180 160 178Q260 180 280 200Z', f: TOPSOIL }]} />
      {[90, 140, 190, 240].map((sx) => <path key={sx} d={`M${sx} 182q-4 -10 -10 -12M${sx} 182q4 -10 10 -12`} stroke={K.leaf} stroke-width={2.4} fill="none" stroke-linecap="round" />)}
      <path d="M48 202V140H272V202" fill="none" stroke={K.out} stroke-width={3.4} />
      <path d={grid.join('')} stroke="#7d8794" stroke-width={1.4} fill="none" />
      <path d="M48 202V140H272V202" fill="none" stroke="#9aa3ad" stroke-width={2} />
      <rect x={40} y={198} width={240} height={10} fill={SOIL} />
      <Rat x={20} y={214} s={0.9} />
      <Pigeon x={250} y={110} s={1.0} flip c="#8a7d72" />
    </Scene2>
  );
};

/* ════════════════════════ GRİ SU ════════════════════════ */
const ICONBG = '#f6f1e6';
/** Duş başlığı ikonu (x,y merkez) */
const IcoShower = ({ x, y }: { x: number; y: number }) => (
  <g>
    <OG sh={[{ d: 'M-20 -18H0V-8', st: K.out, sw: 4 }, { d: 'M-8 -10H8L10 -2H-10Z', f: METAL }].map((q) => ({ ...q, t: `translate(${x} ${y})` }))} />
    {[-6, 0, 6].map((dx) => <path key={dx} d={`M${x + dx} ${y + 2}l${dx / 2} 12`} stroke={K.water} stroke-width={2.4} stroke-linecap="round" />)}
  </g>
);
const IcoBasin = ({ x, y, dirty }: { x: number; y: number; dirty?: boolean }) => (
  <Gx x={x} y={y} sh={[{ d: 'M-18 -4H18Q16 12 0 12Q-16 12 -18 -4Z', f: '#e6e8eb' }, { d: ell([0, -4], 18, 4), f: dirty ? '#b9a27a' : K.waterLight }, { d: 'M-2 -12V-20H8', st: K.out, sw: 3 }]} />
);
const IcoTub = ({ x, y, c = '#6f9fd0', fillC = K.waterLight }: { x: number; y: number; c?: string; fillC?: string }) => (
  <Gx x={x} y={y} sh={[{ d: 'M-22 -6H22L18 12H-18Z', f: c }, { d: ell([0, -6], 22, 5), f: fillC }]} />
);
const IcoToilet = ({ x, y }: { x: number; y: number }) => (
  <Gx x={x} y={y} sh={[{ d: rrect(-16, -20, 12, 22, 2), f: '#f4f6f8' }, { d: 'M-6 -4H18Q18 8 6 10L4 16H-4V-4Z', f: '#f4f6f8' }]} />
);
const IcoKitchen = ({ x, y }: { x: number; y: number }) => (
  <g>
    <IcoBasin x={x} y={y} dirty />
    <Gx x={x - 4} y={y - 9} sh={[{ d: ell([0, 0], 9, 3), f: '#fff' }, { d: ell([10, -1], 6, 2.4), f: '#e8c46a' }]} />
  </g>
);
const IcoDiaper = ({ x, y }: { x: number; y: number }) => (
  <g>
    <IcoTub x={x} y={y} c="#d9a13a" fillC="#c9b48a" />
    <Gx x={x} y={y - 12} sh={[{ d: 'M-10 -6H10L6 6H-6Z', f: '#fff' }]} />
  </g>
);

// Gri su: kullanılabilen (duş, lavabo, durulama) ve kullanılmayan (tuvalet, evye, bebek bezi)
S['sf-ht-grisu-kaynaklar'] = () => (
  <Scene2 bg="closeup">
    <Panel x={12} y={12} w={144} h={216} c={ICONBG} />
    <Panel x={164} y={12} w={144} h={216} c={ICONBG} />
    <Ok x={84} y={34} r={14} />
    <Bad x={236} y={34} r={14} />
    <g transform="translate(84 84) scale(1.6) translate(-84 -84)"><IcoShower x={84} y={84} /></g>
    <g transform="translate(84 140) scale(1.6) translate(-84 -140)"><IcoBasin x={84} y={140} /></g>
    <g transform="translate(84 196) scale(1.6) translate(-84 -196)"><IcoTub x={84} y={196} /></g>
    <g transform="translate(236 84) scale(1.6) translate(-236 -84)"><IcoToilet x={236} y={84} /></g>
    <g transform="translate(236 140) scale(1.6) translate(-236 -140)"><IcoKitchen x={236} y={140} /></g>
    <g transform="translate(236 196) scale(1.6) translate(-236 -196)"><IcoDiaper x={236} y={196} /></g>
  </Scene2>
);

// Gri su: ağaç dibindeki malçlı sığ çanağa dökme; suyu yaprağa püskürtme yanlış
S['sf-ht-grisu-malc-cukur'] = () => {
  // kova: taban (bx,by), 115° devrik; ağız sağ-aşağı, çanağa döküyor
  const base: P = [158, 132], ang = 115, bs = 0.8;
  const rot = (l: P): P => { const c = Math.cos(ang * R), sn = Math.sin(ang * R); return [base[0] + (l[0] * c - l[1] * sn) * bs, base[1] + (l[0] * sn + l[1] * c) * bs]; };
  const rimUp = rot([-18, -34]), lip = rot([18, -34]), bot = rot([-4, -2]);
  const p: PersonProps = { ...GS, x: 120, y: 190, s: 1.0, pose: { ...POSE.standSide, spine: -64, chest: -50, head: -40, armF: { to: rimUp }, armB: { to: bot }, handF: 'fist', handB: 'fist', face: 'neutral' } };
  return (
    <Scene2 bg="outdoor" gy={186}>
      <rect y={186} width={320} height={54} fill={SOIL} />
      <rect y={186} width={320} height={6} fill={TOPSOIL} />
      {/* çanak + malç */}
      <OG sh={[{ d: 'M176 188Q230 210 284 188Z', f: TOPSOIL }, { d: 'M176 188Q230 206 284 188Q230 198 176 188Z', f: STRAW }]} />
      <Tree x={236} y={192} s={0.9} />
      <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
      <g transform={`rotate(${ang} ${base[0]} ${base[1]})`}><Bucket x={base[0]} y={base[1]} s={bs} c="#8e99a6" fill={GREY} /></g>
      <Person {...p} only={['armF']} />
      <path d={`M${lip[0]} ${lip[1]}Q${lip[0] + 14} ${lip[1] + 6} ${lip[0] + 16} 192`} stroke={K.waterLight} stroke-width={5} fill="none" stroke-linecap="round" />
      {[200, 230, 260].map((ax) => <Arrow key={ax} from={[ax, 202]} to={[ax, 228]} w={4} color={K.water} />)}
      {/* ek resim: hortumla yaprağa */}
      <Panel x={14} y={14} w={80} h={74} />
      <Gx x={60} y={70} s={0.5} sh={[{ d: capsule([0, 0], 4, [0, -40], 4), f: K.trunk }, { d: circ([0, -60], 28), f: K.leaf }]} />
      <path d="M20 80Q30 60 42 54" stroke="#4f9e45" stroke-width={4} fill="none" />
      {[[48, 46], [54, 52], [46, 40]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={2} fill={K.water} />)}
      <Bad x={86} y={22} r={10} />
    </Scene2>
  );
};

/** Bitki ikonları (x,y taban) */
const PlTree = ({ x, y }: { x: number; y: number }) => (
  <g><OG sh={[{ d: capsule([x, y], 4, [x, y - 30], 3.4), f: K.trunk }, { d: circ([x, y - 44], 20), f: K.leaf }]} /><OG sh={[{ d: circ([x - 8, y - 42], 4), f: K.red }, { d: circ([x + 8, y - 50], 4), f: K.red }, { d: circ([x + 4, y - 36], 4), f: K.red }]} /></g>
);
const PlVine = ({ x, y }: { x: number; y: number }) => (
  <g>
    <path d={`M${x - 20} ${y - 40}H${x + 20}M${x - 16} ${y}V${y - 42}M${x + 16} ${y}V${y - 42}`} stroke={K.out} stroke-width={3} />
    <OG sh={[{ d: smooth([[x - 18, y - 42], [x - 4, y - 48], [x + 12, y - 42]], false), st: K.leaf, sw: 9 }, ...([[-6, -30], [-2, -24], [-10, -24], [-6, -18]] as P[]).map((q) => ({ d: circ([x + q[0], y + q[1]], 3.6), f: '#7b4a8f' }))]} />
  </g>
);
const PlTomato = ({ x, y }: { x: number; y: number }) => (
  <g><OG sh={[{ d: `M${x} ${y}V${y - 42}`, st: K.leaf, sw: 3 }, { d: circ([x - 8, y - 22], 6), f: K.red }, { d: circ([x + 8, y - 32], 6), f: K.red }, { d: ell([x + 8, y - 16], 8, 4), f: K.leaf }, { d: ell([x - 8, y - 38], 8, 4), f: K.leaf }]} /></g>
);
const PlLettuce = ({ x, y }: { x: number; y: number }) => (
  <OG sh={[{ d: ell([x - 10, y - 10], 12, 10), f: '#8cc66b' }, { d: ell([x + 10, y - 10], 12, 10), f: '#8cc66b' }, { d: ell([x, y - 16], 12, 12), f: '#a6d68a' }]} />
);
const PlCarrot = ({ x, y }: { x: number; y: number }) => (
  <OG sh={[{ d: `M${x - 6} ${y - 20}L${x + 6} ${y - 20}L${x} ${y + 8}Z`, f: '#e8822f' }, { d: `M${x} ${y - 20}L${x - 8} ${y - 36}M${x} ${y - 20}L${x} ${y - 38}M${x} ${y - 20}L${x + 8} ${y - 36}`, st: K.leaf, sw: 3 }]} />
);
const PlParsley = ({ x, y }: { x: number; y: number }) => (
  <OG sh={[{ d: `M${x} ${y}L${x - 10} ${y - 26}M${x} ${y}L${x} ${y - 30}M${x} ${y}L${x + 10} ${y - 26}`, st: K.leaf, sw: 2 }, { d: circ([x - 10, y - 28], 6), f: '#4f9e45' }, { d: circ([x, y - 33], 6), f: '#4f9e45' }, { d: circ([x + 10, y - 28], 6), f: '#4f9e45' }]} />
);
const PlSeedling = ({ x, y }: { x: number; y: number }) => (
  <OG sh={[{ d: `M${x} ${y}V${y - 16}`, st: K.leaf, sw: 2.4 }, { d: ell([x - 7, y - 18], 7, 3.4), f: '#8cc66b' }, { d: ell([x + 7, y - 18], 7, 3.4), f: '#8cc66b' }]} />
);

// Gri su: meyve ağacı, asma, domates evet; marul, maydanoz, havuç, fide hayır
S['sf-ht-grisu-hangi-bitki'] = () => (
  <Scene2 bg="closeup">
    <Panel x={12} y={12} w={144} h={216} c={ICONBG} />
    <Panel x={164} y={12} w={144} h={216} c={ICONBG} />
    <Ok x={84} y={34} r={14} />
    <Bad x={236} y={34} r={14} />
    <rect x={20} y={206} width={128} height={6} rx={3} fill={TOPSOIL} />
    <rect x={172} y={206} width={128} height={6} rx={3} fill={TOPSOIL} />
    <g transform="translate(50 206) scale(1.3) translate(-50 -206)"><PlTree x={50} y={206} /></g>
    <g transform="translate(84 140) scale(1.1) translate(-84 -140)"><PlVine x={84} y={140} /></g>
    <g transform="translate(120 206) scale(1.3) translate(-120 -206)"><PlTomato x={120} y={206} /></g>
    <g transform="translate(200 120) scale(1.3) translate(-200 -120)"><PlLettuce x={200} y={120} /></g>
    <g transform="translate(270 120) scale(1.3) translate(-270 -120)"><PlParsley x={270} y={120} /></g>
    <g transform="translate(200 196) scale(1.3) translate(-200 -196)"><PlCarrot x={200} y={196} /></g>
    <g transform="translate(270 206) scale(1.5) translate(-270 -206)"><PlSeedling x={270} y={206} /></g>
  </Scene2>
);

/* ════════════════════════ KURAKLIK ════════════════════════ */
const Plant = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <Gx x={x} y={y} s={s} sh={[{ d: 'M0 0V-44', st: K.leaf, sw: 3.4 }, { d: ell([-12, -22], 12, 5), f: K.leaf, t: 'rotate(-20 -12 -22)' }, { d: ell([12, -32], 12, 5), f: K.leaf, t: 'rotate(20 12 -32)' }, { d: ell([-10, -42], 10, 4.6), f: K.leaf }]} />
);

// Kuraklık: malç kalınlığı — ince malzeme 5–8 cm, gevşek saman 15–20 cm, sap dibinde boşluk
S['sf-ht-kurak-malc-kalinlik'] = () => (
  <Scene2 bg="outdoor" gy={150}>
    <rect y={170} width={320} height={70} fill={SOIL} />
    <rect y={170} width={320} height={8} fill={TOPSOIL} />
    <rect x={159} y={0} width={2} height={240} fill="#fff" />
    {/* sol: ince kuru ot */}
    <OG sh={[{ d: 'M14 170V160H62V170ZM86 170V160H150V170Z', f: '#b9a46a' }]} />
    <Plant x={74} y={170} s={1.3} />
    <Dim a={[24, 172]} b={[24, 158]} text="5–8 cm" lx={80} ly={206} />
    {/* sağ: kabarık saman */}
    <OG sh={[{ d: 'M166 170V140Q190 134 222 140V170ZM246 170V140Q276 134 308 140V170Z', f: STRAW }]} />
    <path d="M172 150l14 -4M196 160l16 -2M256 152l14 4M278 162l16 -4" stroke={STRAW_D} stroke-width={2} stroke-linecap="round" />
    <Plant x={234} y={170} s={1.3} />
    <Dim a={[300, 172]} b={[300, 138]} text="15–20 cm" lx={240} ly={206} />
  </Scene2>
);

// Kuraklık: ekim çukuru — 30 cm genişlik, 15–20 cm derin, araları 90 cm; dipte gübre, yanında set
S['sf-ht-kurak-ekim-cukuru'] = () => {
  const pits = [70, 240];
  return (
    <Scene2 bg="outdoor" gy={120}>
      <rect y={140} width={320} height={100} fill="#c9a06c" />
      <rect y={140} width={320} height={6} fill={shade('#c9a06c', 0.15)} />
      {pits.map((px) => (
        <g key={px}>
          <OG sh={[{ d: `M${px - 44} 140Q${px - 40} 120 ${px - 30} 140Z`, f: '#b48a5a' }]} />
          <OG sh={[{ d: `M${px - 30} 140Q${px} 188 ${px + 30} 140Z`, f: '#7a5638' }, { d: `M${px - 16} 168Q${px} 184 ${px + 16} 168Q${px} 172 ${px - 16} 168Z`, f: '#3b2a1e' }]} />
          <Plant x={px} y={168} s={0.7} />
        </g>
      ))}
      <Dim a={[40, 194]} b={[100, 194]} text="30 cm" lx={70} ly={214} />
      <Dim a={[282, 140]} b={[282, 176]} text="15–20 cm" lx={240} ly={214} />
      <Dim a={[70, 100]} b={[240, 100]} text="90 cm" lx={155} ly={84} />
    </Scene2>
  );
};

// Kuraklık: eğimde eş yükselti boyunca taş setler; akan su setin önünde yavaşlayıp sızar
S['sf-ht-kurak-tas-set'] = () => {
  const slope = (x: number) => 70 + x * 0.42;
  const sets = [90, 200];
  return (
    <Scene2 bg="outdoor" gy={240}>
      <path d={`M0 ${slope(0)}L320 ${slope(320)}V240H0Z`} fill="#c9a06c" stroke={K.out} stroke-width={1.5} />
      {sets.map((sx) => {
        const sy = slope(sx);
        return (
          <g key={sx}>
            <OG sh={[{ d: `M${sx - 40} ${slope(sx - 40)}Q${sx - 20} ${sy - 6} ${sx} ${sy}L${sx} ${sy}Z`, f: '#7a5638', op: 0.6 }]} />
            <OG sh={[{ d: ell([sx + 2, sy - 6], 9, 7), f: STONE }, { d: ell([sx + 18, sy - 2], 9, 7), f: shade(STONE, 0.1) }, { d: ell([sx + 9, sy - 16], 9, 7), f: STONE }]} />
            <Arrow from={[sx - 54, slope(sx - 54) - 18]} to={[sx - 14, slope(sx - 14) - 12]} w={4} color={K.water} />
            <Arrow from={[sx - 12, sy + 6]} to={[sx - 12, sy + 34]} w={4} color={K.water} />
          </g>
        );
      })}
      {[[30, 30], [60, 44], [96, 26], [130, 40]].map(([dx, dy], i) => <path key={i} d={`M${dx} ${dy}l-4 10`} stroke={K.water} stroke-width={2.4} stroke-linecap="round" />)}
      <Dim a={[sets[1] + 34, slope(sets[1]) - 2]} b={[sets[1] + 34, slope(sets[1]) - 24]} text="25–30 cm" lx={sets[1] + 70} ly={slope(sets[1]) - 40} />
    </Scene2>
  );
};

/* ════════════════════════ KAPAKLAR ════════════════════════ */
S['sf-ht-kapak-hayvan'] = () => (
  <Scene2 bg="outdoor" gy={178}>
    {/* güvercinlik */}
    <OG sh={[{ d: rrect(262, 100, 8, 120, 2), f: WOOD_D }, { d: rrect(240, 70, 52, 40, 3), f: WOOD }, { d: 'M234 72L266 48L298 72Z', f: '#c2583e' }]} />
    <OG sh={[{ d: rrect(248, 82, 14, 16, 3), f: '#3a2e28' }, { d: rrect(270, 82, 14, 16, 3), f: '#3a2e28' }]} />
    <Pigeon x={250} y={66} s={0.9} />
    <Pigeon x={282} y={66} s={0.9} flip c="#b3b9c6" />
    <Sheep x={40} y={198} s={0.7} />
    <Sheep x={96} y={206} s={0.75} flip />
    <Equine x={168} y={222} s={0.95} kind="donkey" halter="#3d7ad6" />
    <Dog x={58} y={232} s={1.0} pose="sit" c="#eadcc0" mask="#4a3d36" fluffy />
  </Scene2>
);

S['sf-ht-kapak-tarim'] = () => (
  <Scene2 bg="outdoor" gy={130}>
    {/* arkada pancar tarlası */}
    {[0, 1, 2].map((r) => Array.from({ length: 9 }, (_, i) => <OG key={r + '-' + i} sh={[{ d: ell([20 + i * 36 + (r % 2) * 18, 120 + r * 12], 10, 6), f: r % 2 ? '#4f9e45' : '#5aa84f' }]} />))}
    <rect y={150} width={320} height={90} fill={TOPSOIL} />
    {/* ortada kütükler ve sürgünler */}
    <Shoots x={70} y={170} n={5} h={64} spread={22} />
    <Stump x={70} y={174} w={30} h={12} />
    <Shoots x={250} y={168} n={5} h={60} spread={22} />
    <Stump x={250} y={172} w={30} h={12} />
    {/* önde malçlı sebze sırası */}
    <OG sh={[{ d: 'M0 240V212Q160 200 320 212V240Z', f: STRAW }]} />
    <path d="M20 222l14 -4M80 226l12 4M150 220l14 -3M220 228l12 -4M280 222l14 2" stroke={STRAW_D} stroke-width={2} stroke-linecap="round" />
    <Plant x={110} y={214} s={1.1} />
    <Plant x={170} y={212} s={1.1} />
    <Plant x={230} y={214} s={1.1} />
  </Scene2>
);
