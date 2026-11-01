// Sıfırdan paketi sahneleri (b): meyve ağaçları, mantar, hayvancılık ve arıcılık.
// Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Arrow, Bad, Hand, K, Label, No, OG, Ok, Person, POSE, Scene2, Tree, Water, Waves,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps } from '../../../src/art/kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);
/** El bileğini, elin verilen noktası hedefe gelecek şekilde konumlar. */
function handAt<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

/* ─────────── paket renkleri (aynı malzeme hep aynı renk) ─────────── */
const SOIL = '#8a6040'; // toprak (kesit)
const TOPSOIL = '#5c3d27'; // koyu üst toprak
const SUBSOIL = '#c9a06c'; // açık alt toprak
const BARK = '#8a5b3c'; // ağaç kabuğu / dal
const BARK_OLD = '#9a958c'; // kuru / yaşlı odun
const SHOOT = '#a8473a'; // bir yıllık kırmızımsı sürgün (şeftali)
const WOOD_IN = '#ecd3a4'; // kesik odun yüzü
const CAMB = '#5cbf45'; // kabuk altı yeşil tabaka
const STRAW = '#e3c25e'; // saman / kuru ot
const STRAW_D = '#c9a443';
const HAY = '#b9c36a'; // yeşil kuru ot
const WOOD = K.wood; // işlenmiş tahta
const WAX = '#f1c84b'; // balmumu
const HONEY = '#e99a1c'; // bal
const MESH = '#7d8794'; // tel
const CLAY = '#a86f4a'; // kil

/* ─────────── oyuncular (rehber başına sabit) ─────────── */
/** meyve ağaçları (fidan, aşı, budama): bıyıklı bahçıvan, yeşil gömlek */
const BAH = { who: 'man', role: 'bystander3', skin: 1, hairC: K.hair.dark, mustache: true, sleeve: 'long', bottomC: K.pants.khaki } as const;
/** mantar: topuzlu kadın, mor üst */
const MAN = { who: 'woman', role: 'bystander', skin: 0, hair: 'bun', hairC: K.hair.auburn, sleeve: 'long', bottomC: K.pants.dark } as const;
/** tavuk ve tavşan: başörtülü köylü kadın, hardal üst */
const KOY = { who: 'woman', role: 'bystander2', skin: 1, hair: 'scarf', hairC: '#c6574e', sleeve: 'long', bottom: 'longskirt', bottomC: '#5b5f78' } as const;
/** keçi-koyun, sağım, kırkım: esmer çoban, kiremit üst */
const COB = { who: 'man', role: 'bystander4', skin: 2, hairC: K.hair.black, mustache: true, sleeve: 'long', bottomC: K.pants.brown } as const;
/** arıcı: beyaz tulum */
const ARI = { who: 'man', role: 'helper', top: '#f1efe8', sleeve: 'long', skin: 1, hairC: K.hair.brown, bottomC: '#e4e1d6' } as const;
/** hayvan sağlığı, kesim: camgöbeği üstlü adam */
const BAK = { who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown, sleeve: 'long', bottomC: K.pants.navy } as const;
/** ot ve balık: kadın, at kuyruğu, yeşil üst */
const CIF = { who: 'woman', role: 'bystander3', skin: 2, hair: 'ponytail', hairC: K.hair.black, sleeve: 'long', bottomC: K.pants.denim } as const;

/* ─────────── nesneler ─────────── */

/** Konik dal/gövde: noktalar boyunca r0'dan r1'e incelen kapsül zinciri */
function Limb({ pts, r0, r1, c = BARK }: { pts: P[]; r0: number; r1: number; c?: string }) {
  const n = pts.length - 1;
  const r = (i: number) => r0 + ((r1 - r0) * i) / n;
  return <OG sh={pts.slice(1).map((p, i) => ({ d: capsule(pts[i], r(i), p, r(i + 1)), f: c }))} />;
}
/** Göz (tomurcuk): x,y dibi, a yönü (derece, -90 yukarı) */
function Bud({ x, y, a = -90, s = 1, c = '#7a4a2e' }: { x: number; y: number; a?: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a + 90} s={s}>
      <OG sh={[{ d: 'M-4 1Q-5 -5 0 -11Q5 -5 4 1Z', f: c }]} />
    </G>
  );
}
/** Yaprak: x,y sap ucu, a yönü */
function Leaf({ x, y, a = -90, s = 1, c = K.leaf }: { x: number; y: number; a?: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a + 90} s={s}>
      <OG sh={[{ d: 'M0 0Q-9 -10 0 -24Q9 -10 0 0Z', f: c }, { d: 'M0 -2L0 -20', st: shade(c, 0.3), sw: 1 }]} />
    </G>
  );
}
/** Budama makası: pivot x,y; ağız +x yönünde (a ile döner) */
function Shears({ x, y, a = 0, s = 1, open = 0.25 }: { x: number; y: number; a?: number; s?: number; open?: number }) {
  const o = open * 22;
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[
        { d: `M-2 -2L-34 ${-6 - o * 0.4}Q-40 ${-6 - o * 0.4} -40 ${-1 - o * 0.4}L-38 ${1 - o * 0.4}L-2 3Z`, f: '#d0473d' },
        { d: `M-2 2L-34 ${8 + o * 0.4}Q-40 ${8 + o * 0.4} -40 ${3 + o * 0.4}L-38 ${1 + o * 0.4}L-2 -3Z`, f: '#b63a31' },
        { d: `M-3 -3Q14 ${-6 - o} 26 ${-3 - o}Q14 ${2 - o * 0.3} -3 3Z`, f: '#c9d0d8' },
        { d: `M-3 3Q12 ${7 + o * 0.6} 22 ${5 + o}Q12 ${-1 + o * 0.3} -3 -3Z`, f: '#aab3bd' },
        { d: circ([0, 0], 2.6), f: '#6d7480' },
      ]} />
    </G>
  );
}
/** Makası tutan el (kol çerçeve dışından gelir). piv = makas pivotu, sa = ağız yönü */
function ShearsHand({ piv, sa, s = 1.2, hs = 0.85, sleeve = K.role.bystander3, skin = 1 }: { piv: P; sa: number; s?: number; hs?: number; sleeve?: string; skin?: number }) {
  const grip = pol(piv, sa + 180, 25 * s);
  const h = handAt({ a: sa + 90, s: hs, pose: 'hold' as const, side: 'R' as const, skin, grip: 16 }, 'grip', grip);
  return (
    <g>
      <Shears x={piv[0]} y={piv[1]} a={sa} s={s} open={0.35} />
      <Hand {...h} arm={180} sleeve={sleeve} />
    </g>
  );
}
/** Bıçak: sap ucu x,y; ağız +x yönünde */
function Knife({ x, y, a = 0, s = 1, blade = 34 }: { x: number; y: number; a?: number; s?: number; blade?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[
        { d: rrect(0, -4, 26, 8, 3.5), f: '#6b4a32' },
        { d: `M25 -4H${25 + blade * 0.85}Q${25 + blade} -4 ${25 + blade} 0Q${25 + blade * 0.7} 4 25 4Z`, f: '#d3d9df' },
      ]} />
    </G>
  );
}
/** Düz çubuk (sap, sırık) */
function Stick({ a, b, w = 3, c = WOOD }: { a: P; b: P; w?: number; c?: string }) {
  return <OG sh={[{ d: capsule(a, w, b, w), f: c }]} />;
}
/** Ölçü çizgisi + etiket (iki ucu tırnaklı) */
function Dim({ a, b, text, off = 0, size = 13, lx, ly }: { a: P; b: P; text?: string; off?: number; size?: number; lx?: number; ly?: number }) {
  const ang = angOf(a, b);
  const n = ang + 90;
  const A = pol(a, n, off), B = pol(b, n, off);
  const t1 = pol(A, n, 5), t2 = pol(A, n, -5), t3 = pol(B, n, 5), t4 = pol(B, n, -5);
  const m = lerp(A, B, 0.5);
  return (
    <g>
      <path d={`M${A[0]} ${A[1]}L${B[0]} ${B[1]}M${t1[0]} ${t1[1]}L${t2[0]} ${t2[1]}M${t3[0]} ${t3[1]}L${t4[0]} ${t4[1]}`} stroke="#fff" stroke-width={4.5} stroke-linecap="round" />
      <path d={`M${A[0]} ${A[1]}L${B[0]} ${B[1]}M${t1[0]} ${t1[1]}L${t2[0]} ${t2[1]}M${t3[0]} ${t3[1]}L${t4[0]} ${t4[1]}`} stroke={K.ink} stroke-width={2} stroke-linecap="round" />
      {text && <Label x={lx ?? m[0]} y={ly ?? m[1]} text={text} size={size} bg={K.white} />}
    </g>
  );
}
/** Kesim çizgisi (kesikli) */
function CutLine({ a, b, c = K.action, w = 3 }: { a: P; b: P; c?: string; w?: number }) {
  return (
    <g stroke-linecap="round">
      <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke="#fff" stroke-width={w + 3} />
      <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke={c} stroke-width={w} stroke-dasharray="6 4" />
    </g>
  );
}
/** Toprak kesiti: gy'den aşağı */
function SoilSection({ gy, c = SOIL, top = TOPSOIL, topH = 14 }: { gy: number; c?: string; top?: string; topH?: number }) {
  return (
    <g>
      <rect x={0} y={gy} width={320} height={240 - gy} fill={c} />
      <rect x={0} y={gy} width={320} height={topH} fill={top} />
      {[[30, 40], [90, 70], [150, 52], [230, 80], [280, 46], [60, 92], [200, 100]].map(([x, d], i) => (
        <ellipse key={i} cx={x} cy={gy + d} rx={3} ry={2} fill={shade(c, 0.18)} />
      ))}
    </g>
  );
}

/* ═══════════════ MEYVE AĞAÇLARI ═══════════════ */

const meyve: Record<string, () => JSX.Element> = {
  // Fidan dikimi 3: 60 cm çukur, üst toprak bir yana, alt toprak öbür yana
  'sf-th-fidan-cukur': () => {
    const gy = 132;
    const hx0 = 130, hx1 = 196, hb = 196; // çukur: 66 birim ≈ 60 cm
    const grip1: P = [236, 92], grip2: P = [222, 120];
    const blade: P = [166, 188];
    const p: PersonProps = { ...BAH, x: 262, y: gy + 4, s: 0.82, flip: true, pose: { spine: -70, chest: -60, head: -64, legB: [96, 92], legF: [80, 96], armF: { to: grip2 }, armB: { to: grip1 }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <SoilSection gy={gy} topH={22} c={SUBSOIL} />
        <path d={`M${hx0} ${gy}V${hb}H${hx1}V${gy}Z`} fill={shade(SUBSOIL, 0.45)} />
        <path d={`M${hx0} ${gy}V${hb}H${hx1}V${gy}`} fill="none" stroke={K.out} stroke-width={1.5} />
        {/* üst toprak yığını (koyu) solda, alt toprak yığını (açık) sağda */}
        <OG sh={[{ d: `M28 ${gy + 1}Q48 ${gy - 34} 76 ${gy - 30}Q100 ${gy - 26} 116 ${gy + 1}Z`, f: TOPSOIL }]} />
        <OG sh={[{ d: `M200 ${gy + 1}Q206 ${gy - 22} 222 ${gy - 20}Q236 ${gy - 16} 242 ${gy + 1}Z`, f: SUBSOIL }]} />
        <Person {...p} mid={() => (
          <g>
            <Stick a={pol(grip1, angOf(grip1, blade), -8)} b={blade} w={2.6} />
            <G x={blade[0]} y={blade[1]} a={angOf(grip1, blade) - 90}>
              <OG sh={[{ d: 'M-11 -6H11L10 16Q0 22 -10 16Z', f: '#8e99a6' }]} />
            </G>
          </g>
        )} />
        <Dim a={[hx0, 222]} b={[hx1, 222]} text="60 cm" lx={163} ly={222} />
        <Dim a={[hx0 - 12, gy]} b={[hx0 - 12, hb]} />
      </Scene2>
    );
  },

  // Fidan dikimi 5: aşı noktası toprağın 5–10 cm üstünde, çevresinde su dolu çanak
  'sf-th-fidan-asi-noktasi': () => {
    const gy = 150;
    const x = 160;
    const graft: P = [x, gy - 34];
    return (
      <Scene2 bg="closeup" gy={gy}>
        <SoilSection gy={gy} />
        {/* çanak: iki yanda toprak set, arası su */}
        <path d={`M${x - 92} ${gy}Q${x - 80} ${gy - 16} ${x - 66} ${gy}Z`} fill={TOPSOIL} stroke={K.out} stroke-width={1.5} />
        <path d={`M${x + 66} ${gy}Q${x + 80} ${gy - 16} ${x + 92} ${gy}Z`} fill={TOPSOIL} stroke={K.out} stroke-width={1.5} />
        <path d={`M${x - 70} ${gy - 6}H${x + 70}L${x + 66} ${gy + 2}Q${x} ${gy + 14} ${x - 66} ${gy + 2}Z`} fill={K.water} stroke={K.out} stroke-width={1.5} />
        <path d={`M${x - 50} ${gy - 2}H${x - 24}M${x + 24} ${gy - 2}H${x + 50}`} stroke={K.waterLight} stroke-width={2} stroke-linecap="round" />
        {/* kökler */}
        {[[-40, 50], [-20, 70], [10, 72], [34, 54], [52, 34], [-56, 28]].map(([dx, dy], i) => (
          <path key={i} d={smooth([[x, gy + 6], [x + dx * 0.5, gy + dy * 0.55], [x + dx, gy + dy]])} fill="none" stroke="#6b4a32" stroke-width={3} stroke-linecap="round" />
        ))}
        <Limb pts={[[x, gy + 14], [x, graft[1]], [x + 1, 20]]} r0={8} r1={5.5} />
        {/* kabarık aşı noktası */}
        <OG sh={[{ d: ell(graft, 11, 7), f: shade(BARK, 0.1) }]} />
        <path d={`M${x - 10} ${graft[1] + 1}Q${x} ${graft[1] - 5} ${x + 10} ${graft[1] + 1}`} fill="none" stroke={K.out} stroke-width={1.2} />
        <Bud x={x + 6} y={70} a={-50} />
        <Bud x={x - 6} y={46} a={-130} />
        <Dim a={[x + 34, gy]} b={[x + 34, graft[1]]} />
        <Label x={x + 74} y={gy - 18} text="5–10 cm" size={13} bg={K.white} />
        <Arrow from={[x - 74, graft[1] - 34]} to={[x - 16, graft[1] - 3]} w={5} />
      </Scene2>
    );
  },

  // Fidan dikimi 7: dalsız fidanın tepesi bir gözün hemen üstünden kesilir
  'sf-th-fidan-tepe-kesim': () => {
    const gy = 214;
    const x = 150;
    const cut: P = [x, 64];
    const piv: P = [x + 2, cut[1] - 2];
    const sa = 200; // makas ağzı sola-hafif yukarı
    const hd = sa + 180; // sap yönü
    const grip = pol(piv, hd, 30);
    const h = handAt({ a: hd + 90 + 180, s: 0.85, pose: 'hold' as const, side: 'R' as const, skin: BAH.skin, grip: 16 }, 'grip', grip);
    return (
      <Scene2 bg="outdoor" gy={gy - 14}>
        <ellipse cx={x} cy={gy} rx={40} ry={7} fill={TOPSOIL} />
        <g opacity={0.35}>
          <Limb pts={[[x, cut[1]], [x + 1, 22]]} r0={3.4} r1={2.8} />
        </g>
        <Limb pts={[[x, gy], [x - 1, 130], [x, cut[1]]]} r0={5.5} r1={3.6} />
        <Bud x={x + 3} y={cut[1] + 9} a={-40} s={1.1} />
        <Bud x={x - 4} y={108} a={-140} />
        <Bud x={x + 4} y={152} a={-40} />
        <Shears x={piv[0]} y={piv[1]} a={sa} s={1.3} open={0.35} />
        <Hand {...h} arm={160} sleeve={K.role[BAH.role]} />
        <Dim a={[x - 50, gy]} b={[x - 50, cut[1]]} text="60–75 cm" lx={x - 50} ly={142} />
      </Scene2>
    );
  },

  // Yarma aşı 4: düz kesilmiş anacın ortasına tokmakla bıçak vurularak yarık açılır
  'sf-th-yarma-acma': () => {
    const cx = 150, top = 124, rx = 70, ry = 18;
    const bl: P = [cx, top + 18]; // bıçak ağzının ucu (yarığın dibi)
    const mal: P = [cx + 6, 34]; // tokmak başı
    const hg: P = [cx + 70, 38];
    const h = handAt({ a: 180, s: 0.9, pose: 'hold' as const, side: 'L' as const, skin: BAH.skin, grip: 14 }, 'grip', hg);
    return (
      <Scene2 bg="closeup">
        {/* anaç gövdesi */}
        <OG sh={[{ d: `M${cx - rx} ${top}V250H${cx + rx}V${top}Z`, f: BARK }]} />
        <path d={`M${cx - rx + 14} ${top + 30}V240M${cx + rx - 18} ${top + 50}V240M${cx - 20} ${top + 70}V240`} stroke={shade(BARK, 0.25)} stroke-width={2} />
        <OG sh={[{ d: ell([cx, top], rx, ry), f: WOOD_IN }]} />
        <ellipse cx={cx} cy={top} rx={rx - 7} ry={ry - 3} fill="none" stroke={CAMB} stroke-width={2.5} />
        <ellipse cx={cx} cy={top} rx={rx * 0.5} ry={ry * 0.5} fill="none" stroke={shade(WOOD_IN, 0.15)} stroke-width={1.5} />
        {/* yarık: üst yüzde ve ön yüzde */}
        <path d={`M${cx - rx + 2} ${top}L${cx + rx - 2} ${top}`} stroke={K.out} stroke-width={3} />
        <path d={`M${cx - 2} ${top + ry - 1}L${cx} ${top + 60}L${cx + 2} ${top + ry - 1}Z`} fill={K.out} />
        {/* bıçak: ağzı yarıkta, sırtı yukarıda */}
        <OG sh={[
          { d: `M${cx - 46} ${top - 4}H${cx + 30}L${cx + 30} ${top - 26}H${cx - 50}Q${cx - 54} ${top - 15} ${cx - 46} ${top - 4}Z`, f: '#c9d0d8' },
          { d: rrect(cx + 30, top - 24, 50, 14, 5), f: '#6b4a32' },
        ]} />
        {/* tokmak */}
        <Stick a={[mal[0] + 10, mal[1]]} b={[hg[0] + 26, hg[1]]} w={4} c={WOOD} />
        <OG sh={[{ d: rrect(mal[0] - 22, mal[1] - 16, 34, 34, 6), f: shade(WOOD, 0.1) }]} />
        <Hand {...h} arm={120} sleeve={K.role[BAH.role]} />
        <Arrow from={[cx - 28, 30]} to={[cx - 28, top - 34]} w={6} />
        <Dim a={[cx + rx + 16, top]} b={[cx + rx + 16, top + 60]} />
        <Label x={cx + rx + 16} y={top + 84} text="3–5 cm" size={13} bg={K.white} />
      </Scene2>
    );
  },

  // Yarma aşı 5: kalemin dibi uzun, düz kesimle kama gibi yontulur; bıçak kendinden uzağa
  'sf-th-kalem-yontma': () => {
    const x = 150;
    const topY = 28, wedge0 = 150, tip: P = [x + 2, 214];
    const hold = handAt({ a: 90, s: 0.95, pose: 'hold' as const, side: 'L' as const, view: 'back' as const, skin: BAH.skin, grip: 12 }, 'grip', [x, 74]);
    const kh: P = [x + 38, 128];
    const ka = angOf(kh, [x + 4, 200]);
    const kn = handAt({ a: ka - 180 + 0, s: 0.95, pose: 'hold' as const, side: 'R' as const, skin: BAH.skin, grip: 12 }, 'grip', kh);
    return (
      <Scene2 bg="closeup">
        <Hand {...hold} arm={160} sleeve={K.role[BAH.role]} />
        <OG sh={[{ d: `M${x - 6} ${topY}H${x + 6}V${wedge0}L${tip[0]} ${tip[1]}L${x - 6} ${wedge0}Z`, f: BARK }]} />
        {/* kesik yüz (açık renk odun, kenarında yeşil) */}
        <path d={`M${x + 6} ${wedge0 - 6}L${tip[0]} ${tip[1]}L${x - 2} ${wedge0 + 20}Z`} fill={WOOD_IN} stroke={K.out} stroke-width={1.2} />
        <path d={`M${x + 5} ${wedge0 - 2}L${tip[0] + 0.5} ${tip[1] - 6}`} stroke={CAMB} stroke-width={2} />
        <Bud x={x + 6} y={60} a={-45} />
        <Bud x={x - 6} y={102} a={-135} />
        <Bud x={x + 6} y={136} a={-45} />
        <Knife x={pol(kh, ka, -16)[0]} y={pol(kh, ka, -16)[1]} a={ka} s={1} blade={56} />
        <Hand {...kn} arm={160} sleeve={K.role[BAH.role]} />
        <Arrow from={[x + 34, 170]} to={[x + 18, 214]} w={5} />
      </Scene2>
    );
  },

  // Yarma aşı 6: iki kalem yarığın iki kenarında; kabuk altı yeşil tabakalar çakışıyor
  'sf-th-yarma-kambiyum': () => {
    const cx = 160, top = 150, rx = 112, ry = 36;
    const sc = (sx: number, dir: number) => {
      const bx = sx; // kalem dış kenarı ≈ anaç kabuğunun iç kenarı
      const w = 14;
      const x0 = dir < 0 ? bx : bx - w, x1 = x0 + w;
      const outer = dir < 0 ? x0 : x1;
      return (
        <g>
          <OG sh={[{ d: rrect(x0, 30, w, top - 30 + 4, 5), f: BARK }]} />
          <path d={`M${outer - dir * 3} 40V${top}`} stroke={CAMB} stroke-width={3} />
          <Bud x={outer} y={64} a={dir < 0 ? -140 : -40} />
          <Bud x={dir < 0 ? x1 : x0} y={100} a={dir < 0 ? -40 : -140} />
        </g>
      );
    };
    const cl = cx - rx + 13, cr = cx + rx - 13;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: `M${cx - rx} ${top}V250H${cx + rx}V${top}Z`, f: BARK }]} />
        <OG sh={[{ d: ell([cx, top], rx, ry), f: WOOD_IN }]} />
        <ellipse cx={cx} cy={top} rx={rx - 12} ry={ry - 6} fill="none" stroke={CAMB} stroke-width={3.5} />
        <path d={`M${cx - rx} ${top}A${rx} ${ry} 0 0 1 ${cx + rx} ${top}A${rx} ${ry} 0 0 1 ${cx - rx} ${top}`} fill="none" stroke={K.out} stroke-width={1.5} />
        <path d={`M${cl} ${top}H${cr}`} stroke={K.out} stroke-width={4} />
        {sc(cl, -1)}
        {sc(cr, 1)}
        <Arrow from={[cl + 52, 92]} to={[cl + 6, top - 4]} w={5} />
        <Arrow from={[cr - 52, 92]} to={[cr - 6, top - 4]} w={5} />
      </Scene2>
    );
  },

  // Göz aşısı 4: gözün altından 30° kesik, üstünden inen ikinci kesik; yonga çıkar
  'sf-th-yonga-kesim': () => {
    // Solda göz çubuğu yandan: gözün altındaki 30° kesik ve üstten inen ikinci kesik (turuncu).
    // Sağda bu iki kesikle çıkan yonga, gözüyle birlikte.
    const x = 96, r = 18, R = x + r;
    const bud: P = [R, 118];
    const up: P = [R, 52], low: P = [R, 168], deep: P = [R - 18, 190];
    const chipD = 112;
    const chipPath = (dx: number) => `M${up[0] + dx} ${up[1]}Q${R - 22 + dx} 110 ${deep[0] + dx} ${deep[1]}L${low[0] + dx} ${low[1]}Z`;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: `M${x - r} -10H${R}V250H${x - r}Z`, f: BARK }]} />
        <path d={`M${x - 8} 10V40M${x - 4} 206V236`} stroke={shade(BARK, 0.25)} stroke-width={2} />
        <Bud x={bud[0]} y={bud[1]} a={-30} s={1.6} />
        <Limb pts={[[bud[0], bud[1] + 6], [bud[0] + 14, bud[1] + 2]]} r0={2.4} r1={2.2} c="#6b8f3e" />
        {/* kesik çizgileri: üstten inen uzun kesik ve alttaki 30° kesik */}
        <CutLine a={up} b={[R - 17, 120]} />
        <CutLine a={[R - 17, 120]} b={deep} />
        <CutLine a={low} b={deep} />
        {/* 30° açı yayı */}
        <path d={`M${R} ${low[1]}V${low[1] + 30}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="3 3" />
        <path d={`M${R} ${low[1] + 20}A20 20 0 0 1 ${R - 10} ${low[1] + 17}`} fill="none" stroke={K.ink} stroke-width={1.6} />
        <Label x={R + 30} y={low[1] + 28} text="30°" size={15} bg={K.white} />
        {/* çıkarılmış yonga */}
        <path d={chipPath(chipD)} fill={BARK} stroke={K.out} stroke-width={1.6} />
        <path d={`M${up[0] + chipD} ${up[1]}Q${R - 22 + chipD} 110 ${deep[0] + chipD} ${deep[1]}`} fill="none" stroke={CAMB} stroke-width={3} />
        <Bud x={bud[0] + chipD} y={bud[1]} a={-30} s={1.6} />
        <Limb pts={[[bud[0] + chipD, bud[1] + 6], [bud[0] + chipD + 14, bud[1] + 2]]} r0={2.4} r1={2.2} c="#6b8f3e" />
        <Arrow from={[R + 30, 96]} to={[R + 80, 96]} w={5} />
      </Scene2>
    );
  },

  // Göz aşısı 5–6: yonga anaçtaki aynı yuvaya oturtulur; yeşil kenarlar çakışır
  'sf-th-yonga-yuva': () => {
    const x = 130, w = 44;
    const slot = { cx: x, cy: 124, rx: 13, ry: 40 };
    const cdx = 52;
    const pinch = handAt({ a: -80, s: 1, pose: 'pinch' as const, side: 'L' as const, skin: COB.skin === 2 ? BAH.skin : BAH.skin }, 'pinch', [slot.cx + cdx + 18, slot.cy + 6]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(x - w / 2, -10, w, 260, 6), f: BARK }]} />
        <path d={`M${x - 14} 20V60M${x + 12} 180V230`} stroke={shade(BARK, 0.25)} stroke-width={2} />
        <OG sh={[{ d: ell([slot.cx, slot.cy], slot.rx, slot.ry), f: WOOD_IN }]} />
        <ellipse cx={slot.cx} cy={slot.cy} rx={slot.rx - 2} ry={slot.ry - 2} fill="none" stroke={CAMB} stroke-width={2.5} />
        <OG sh={[{ d: ell([slot.cx + cdx, slot.cy], slot.rx, slot.ry), f: BARK }]} />
        <ellipse cx={slot.cx + cdx} cy={slot.cy} rx={slot.rx - 2} ry={slot.ry - 2} fill="none" stroke={CAMB} stroke-width={2.5} />
        <Bud x={slot.cx + cdx} y={slot.cy + 6} a={-90} s={1.1} />
        <Hand {...pinch} arm={160} sleeve={K.role[BAH.role]} />
        <Arrow from={[slot.cx + cdx + 4, 66]} to={[slot.cx + 6, 66]} w={5} />
      </Scene2>
    );
  },

  // Göz aşısı 7: aşı yeri aşağıdan yukarı bantla sarılır; göz ve yaprak sapı açıkta
  'sf-th-goz-sarma': () => {
    const x = 150, w = 46;
    const bud: P = [x + 2, 124];
    const bands = [190, 174, 158, 142, 106, 90, 74];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(x - w / 2, -10, w, 260, 6), f: BARK }]} />
        {bands.map((y) => (
          <path key={y} d={`M${x - w / 2 - 2} ${y + 6}L${x + w / 2 + 2} ${y - 6}L${x + w / 2 + 2} ${y + 6}L${x - w / 2 - 2} ${y + 18}Z`} fill="#eaf4fb" opacity={0.85} stroke="#9fb6c6" stroke-width={1.2} />
        ))}
        <Bud x={bud[0]} y={bud[1] + 4} a={-90} s={1.5} />
        <Limb pts={[[bud[0] + 6, bud[1] + 8], [bud[0] + 22, bud[1] + 4]]} r0={2.2} r1={2} c="#6b8f3e" />
        <Arrow from={[x + 56, 196]} to={[x + 56, 80]} w={5} />
        <Ok x={x - 64} y={bud[1]} r={14} />
      </Scene2>
    );
  },

  // Genç ağaç budaması 3: merkezi lider (elma, armut) — piramit biçimi, rakip dik dal alınır
  'sf-th-merkezi-lider': () => {
    // Ortada tek dik lider, kat kat yan dallar (piramit). Liderin ucunda turuncu "1/3" kesimi;
    // sağdaki rakip dik dal dibinden kırmızı kesikle alınır.
    const x = 140, gy = 224;
    const tiers: [number, number, number][] = [[170, 84, 4.5], [126, 62, 3.6], [90, 42, 2.8]];
    const lTop = 22, cutY = 46;
    const rv0: P = [x + 3, 158], rv1: P = [x + 44, 112], rv2: P = [x + 52, 52];
    const ra = angOf(rv0, rv1);
    const rc = lerp(rv0, rv1, 0.3);
    return (
      <Scene2 bg="outdoor" gy={gy - 12}>
        {tiers.map(([y, l, r]) => (
          <g key={y}>
            <Limb pts={[[x, y], [x - l * 0.6, y - l * 0.5], [x - l, y - l * 0.55]]} r0={r} r1={r * 0.5} />
            <Limb pts={[[x, y + 6], [x + l * 0.6, y + 6 - l * 0.5], [x + l, y + 6 - l * 0.55]]} r0={r} r1={r * 0.5} />
          </g>
        ))}
        {/* rakip dik dal */}
        <Limb pts={[rv0, rv1, rv2]} r0={3.6} r1={2.4} />
        <Limb pts={[[x, gy], [x, 130], [x + 1, lTop]]} r0={9} r1={3} />
        <CutLine a={pol(rc, ra + 90, 11)} b={pol(rc, ra - 90, 11)} c={K.danger} />
        <Bad x={rv2[0] + 22} y={rv2[1] + 4} r={12} />
        <CutLine a={[x - 13, cutY]} b={[x + 13, cutY]} />
        <Label x={x - 44} y={cutY} text="1/3" size={14} />
      </Scene2>
    );
  },

  // Genç ağaç budaması 4: ortası açık (şeftali, kayısı, erik) — 3–4 ana dal, ortada lider yok
  'sf-th-ortasi-acik': () => {
    const x = 160, gy = 222;
    const br: [number, number, number][] = [[156, -160, 1], [138, -22, 1], [120, -130, 0.95], [116, -50, 0.95]];
    return (
      <Scene2 bg="outdoor" gy={gy - 12}>
        <Limb pts={[[x, gy], [x, 156], [x, 112]]} r0={9} r1={6.5} />
        <OG sh={[{ d: ell([x, 112], 6.5, 3), f: WOOD_IN }]} />
        {br.map(([y, a, k], i) => {
          const p0: P = [x + (a > -90 ? 4 : -4), y];
          const p1 = pol(p0, a, 44 * k), p2 = pol(p1, a + (a > -90 ? -28 : 28), 56 * k);
          return <Limb key={i} pts={[p0, p1, p2]} r0={5.5} r1={2.6} />;
        })}
        <Dim a={[x - 64, 156]} b={[x - 64, 138]} />
        <path d={`M${x - 64} 156H${x - 4}M${x - 64} 138H${x + 4}`} stroke={K.ink} stroke-width={1} stroke-dasharray="3 3" />
        <Label x={x - 96} y={147} text="20 cm" size={13} bg={K.white} />
        <circle cx={x} cy={72} r={26} fill="none" stroke={K.safe} stroke-width={3} stroke-dasharray="6 5" />
      </Scene2>
    );
  },

  // Genç ağaç budaması 6: dal yakasının hemen dışından kes; gövdeye sıfır ya da uzun güdük yanlış
  'sf-th-dal-yakasi': () => {
    const tx = 92;
    const j: P = [tx + 22, 150];
    const dir = -32;
    const end = pol(j, dir, 230);
    const col = pol(j, dir, 26);
    const cutAt = (d: number) => {
      const c = pol(j, dir, d);
      return [pol(c, dir + 90, 26), pol(c, dir - 90, 26)] as [P, P];
    };
    const ok = cutAt(34), stub = cutAt(112);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: `M${tx - 28} -10H${tx + 24}V250H${tx - 28}Z`, f: BARK }]} />
        <Limb pts={[pol(j, dir, -6), end]} r0={15} r1={11} />
        {/* dal yakası: kabarık halka */}
        <OG sh={[{ d: ell([0, 0], 10, 21), t: `translate(${f1(col[0])} ${f1(col[1])}) rotate(${dir})`, f: shade(BARK, 0.08) }]} />
        <path d={`M${tx + 23} 70V230`} stroke={K.danger} stroke-width={3.5} stroke-dasharray="7 5" />
        <CutLine a={ok[0]} b={ok[1]} c={K.safe} w={3.5} />
        <CutLine a={stub[0]} b={stub[1]} c={K.danger} w={3.5} />
        <Ok x={ok[0][0] + 6} y={ok[0][1] + 14} r={12} />
        <Bad x={tx + 40} y={212} r={12} />
        <Bad x={stub[0][0] + 8} y={stub[0][1] + 16} r={12} />
      </Scene2>
    );
  },

  // Olgun ağaç budaması 3: birbirine sürtünen dallardan zayıf olanı alınır
  'sf-th-capraz-dal': () => {
    const base: P = [150, 250];
    const fork: P = [150, 196];
    const strong: P[] = [fork, [176, 140], [214, 82], [262, 26]];
    const weakS: P = [fork[0] - 4, fork[1] - 6];
    const weak: P[] = [weakS, [128, 156], [152, 110], [210, 56], [290, 34]];
    const rub: P = [196, 104];
    const cutC = pol(weakS, -120, 18);
    return (
      <Scene2 bg="outdoor">
        <Limb pts={[base, fork]} r0={20} r1={16} />
        <Limb pts={weak} r0={8} r1={4} />
        <Limb pts={strong} r0={13} r1={7} />
        <OG sh={[{ d: ell(rub, 12, 7), f: WOOD_IN }]} />
        <path d={`M${rub[0] - 6} ${rub[1] - 2}L${rub[0] + 6} ${rub[1] + 2}M${rub[0] - 4} ${rub[1] + 3}L${rub[0] + 4} ${rub[1] + 5}`} stroke={shade(BARK, 0.3)} stroke-width={1.5} />
        <Waves x={rub[0] - 18} y={rub[1] - 6} a={-140} n={2} r={5} />
        <CutLine a={pol(cutC, -30, 16)} b={pol(cutC, 150, 16)} w={3.5} />
        <Arrow from={[64, 150]} to={[cutC[0] - 14, cutC[1] + 4]} w={5} />
      </Scene2>
    );
  },

  // Olgun ağaç budaması 4: dalın üstünden dimdik çıkan su sürgünleri dibinden alınır
  'sf-th-su-surgunu': () => {
    const y0 = 170;
    const sprouts = [96, 152, 208, 252];
    const cutX = 152;
    return (
      <Scene2 bg="outdoor">
        <Limb pts={[[-20, y0 + 26], [100, y0 + 4], [220, y0 - 4], [340, y0 - 16]]} r0={18} r1={11} c={shade(BARK, 0.1)} />
        {sprouts.map((sx, i) => {
          const by = y0 - 6 - (sx - 100) * 0.06;
          return (
            <g key={sx}>
              <Limb pts={[[sx, by], [sx + 2, by - 60], [sx - 2 + (i % 2) * 6, by - 130]]} r0={3.2} r1={2} c="#7a5a3a" />
              {[40, 80, 112].map((dy) => <Bud key={dy} x={sx + (dy % 80 ? 2 : -2)} y={by - dy} a={dy % 80 ? -50 : -130} s={0.7} />)}
              {sx !== cutX && <path d={`M${sx - 9} ${by - 8}H${sx + 9}`} stroke={K.action} stroke-width={4} stroke-linecap="round" />}
            </g>
          );
        })}
        <ShearsHand piv={[cutX + 4, y0 - 16]} sa={150} />
      </Scene2>
    );
  },

  // Olgun ağaç budaması 6: şeftalide geçen yılki kırmızımsı sürgünün yarısı alınır
  'sf-th-seftali-budama': () => {
    const old: P[] = [[-10, 210], [60, 186], [110, 170]];
    const shoot: P[] = [[110, 170], [170, 140], [230, 108], [292, 74]];
    const half = lerp(shoot[1], shoot[2], 0.5);
    return (
      <Scene2 bg="outdoor">
        <Limb pts={old} r0={14} r1={10} c={BARK_OLD} />
        <Limb pts={[shoot[0], shoot[1], half]} r0={6} r1={4.5} c={SHOOT} />
        <g opacity={0.45}>
          <Limb pts={[half, shoot[2], shoot[3]]} r0={4.5} r1={3} c={SHOOT} />
        </g>
        {[0.12, 0.3, 0.46, 0.62, 0.78, 0.92].map((t, i) => {
          const seg = t < 0.5 ? lerp(shoot[0], shoot[2], t * 2 * 0.98) : lerp(shoot[2], shoot[3], (t - 0.5) * 2);
          return <Bud key={t} x={seg[0]} y={seg[1] - (i % 2 ? 0 : 0)} a={i % 2 ? -120 : 60} s={0.9} c="#c46a5a" />;
        })}
        <CutLine a={pol(half, -60, 24)} b={pol(half, 120, 24)} w={3.5} />
        <Label x={half[0] + 4} y={half[1] - 44} text="%50" size={16} />
      </Scene2>
    );
  },
};

/* ═══════════════ MANTAR ═══════════════ */

/** İstiridye mantarı (yandan raf gibi): x,y sap dibi, a yönü (0 = sağa), s ölçek */
function Oyster({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  const c = '#d6cdb9';
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG sh={[
        { d: 'M0 -3Q8 -4 14 -6L14 5Q8 4 0 3Z', f: '#ece4d4' },
        { d: 'M10 -4Q20 -18 40 -18Q54 -17 56 -6Q57 4 50 8Q44 3 34 4Q22 6 12 6Q8 1 10 -4Z', f: c },
        { d: 'M14 3Q30 0 48 6', st: shade(c, 0.3), sw: 1.2 },
        { d: 'M16 0Q28 -10 46 -10', st: tint(c, 0.4), sw: 1.4 },
      ]} />
    </G>
  );
}
/** Saydam mantar torbası: x orta, y dip */
function GrowBag({ x, y, w = 92, h = 130, white = 0.2, children }: { x: number; y: number; w?: number; h?: number; white?: number; children?: ComponentChildren }) {
  const top = y - h;
  const body = `M${x - w / 2 + 6} ${y}Q${x - w / 2 - 4} ${y - h * 0.5} ${x - w / 2 + 8} ${top + 14}L${x - 6} ${top}H${x + 6}L${x + w / 2 - 8} ${top + 14}Q${x + w / 2 + 4} ${y - h * 0.5} ${x + w / 2 - 6} ${y}Z`;
  const layers = [0.15, 0.32, 0.5, 0.68, 0.84];
  return (
    <g>
      <OG sh={[{ d: body, f: STRAW }]} />
      {layers.map((t, i) => (
        <path key={i} d={`M${x - w / 2 + 2} ${y - h * t}Q${x} ${y - h * t - 6} ${x + w / 2 - 2} ${y - h * t}`} fill="none" stroke={i % 2 ? '#fbfaf7' : STRAW_D} stroke-width={i % 2 ? 7 : 2} opacity={0.95} />
      ))}
      {white > 0 && <path d={body} fill="#f6f4ee" opacity={white} />}
      <path d={body} fill="#eaf4fb" opacity={0.18} stroke={K.out} stroke-width={1.5} />
      <path d={`M${x - 8} ${top + 2}H${x + 8}`} stroke="#c6574e" stroke-width={4} stroke-linecap="round" />
      {children}
    </g>
  );
}

const mantar: Record<string, () => JSX.Element> = {
  // Mantar 2: kıyılmış saman 65–80 °C suda 1–2 saat pastörize edilir
  'sf-th-saman-pastorize': () => {
    const gy = 206;
    const px = 196, pTop = 112, pw = 132, ph = 72;
    const tipIn: P = [px - 22, pTop + 30];
    const g1: P = [118, 118], g2: P = [110, 140];
    const w: PersonProps = { ...MAN, x: 74, y: gy + 18, s: 0.95, pose: { ...POSE.standSide, spine: -84, armF: { to: g2 }, armB: { to: g1 }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        {/* ateş ve taşlar */}
        {[px - 56, px - 20, px + 20, px + 56].map((sx) => <OG key={sx} sh={[{ d: ell([sx, gy + 6], 16, 9), f: K.rock }]} />)}
        <path d={`M${px - 30} ${gy}Q${px - 20} ${gy - 34} ${px - 6} ${gy - 18}Q${px} ${gy - 44} ${px + 10} ${gy - 18}Q${px + 22} ${gy - 34} ${px + 30} ${gy}Z`} fill={K.fire} stroke={K.out} stroke-width={1.5} />
        <path d={`M${px - 14} ${gy}Q${px - 8} ${gy - 18} ${px} ${gy - 10}Q${px + 8} ${gy - 20} ${px + 14} ${gy}Z`} fill={K.fireCore} />
        {/* kazan */}
        <OG sh={[
          { d: `M${px - pw / 2} ${pTop}H${px + pw / 2}L${px + pw / 2 - 8} ${pTop + ph - 8}Q${px} ${pTop + ph + 4} ${px - pw / 2 + 8} ${pTop + ph - 8}Z`, f: '#5f6873' },
          { d: rrect(px - pw / 2 - 6, pTop - 6, pw + 12, 10, 4), f: '#7b8590' },
        ]} />
        <rect x={px - pw / 2 + 2} y={pTop + 4} width={pw - 4} height={6} fill={K.water} />
        {/* sudan taşan saman uçları */}
        {[-48, -30, -12, 8, 26, 44].map((dx, i) => (
          <path key={dx} d={`M${px + dx} ${pTop + 8}L${px + dx + (i % 2 ? 8 : -6)} ${pTop - 10}`} stroke={STRAW} stroke-width={4} stroke-linecap="round" />
        ))}
        <Waves x={px - 30} y={pTop - 26} a={-90} n={3} r={6} color="#ffffff" />
        <Waves x={px + 28} y={pTop - 30} a={-90} n={3} r={6} color="#ffffff" />
        <Person {...w} mid={() => <Stick a={pol(g1, angOf(g1, tipIn), -10)} b={tipIn} w={2.4} />} />
        <Label x={px} y={60} text="65–80 °C" size={15} />
      </Scene2>
    );
  },

  // Mantar 3: saman ve misel kat kat naylon torbaya doldurulur, ağız bağlanır, iğneyle delikler
  'sf-th-mantar-torba': () => {
    const bx = 150, by = 222;
    const ph = handAt({ a: 170, s: 0.85, pose: 'pinch' as const, side: 'R' as const, skin: MAN.skin }, 'pinch', [bx + 6, 60]);
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(30, by - 4, 260, 14, 3), f: WOOD }]} />
        <GrowBag x={bx} y={by - 2} w={104} h={136} />
        {[[bx - 30, by - 100], [bx + 26, by - 70], [bx - 20, by - 44], [bx + 30, by - 112]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2} fill={K.ink} />
        ))}
        {/* misel kavanozu */}
        <OG sh={[{ d: rrect(232, by - 66, 46, 62, 8), f: '#eef6f9' }, { d: rrect(236, by - 52, 38, 44, 6), f: '#f7f5ef' }]} />
        {[[244, by - 40], [256, by - 28], [264, by - 44], [250, by - 18]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={STRAW} />)}
        <Hand {...ph} arm={150} sleeve={K.role[MAN.role]} />
        {[[bx + 4, 78], [bx + 10, 90], [bx + 2, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill="#fbfaf7" stroke={K.out} stroke-width={0.8} />)}
        <Arrow from={[bx - 40, 70]} to={[bx - 40, 106]} w={4} />
      </Scene2>
    );
  },

  // Mantar 6: şapka kenarı aşağı kıvrıkken küme dipten çevrilerek koparılır
  'sf-th-mantar-hasat': () => {
    const bx = 100, by = 230;
    const slit: P = [bx + 72, 120];
    const h = handAt({ a: -20, s: 0.95, pose: 'hold' as const, side: 'R' as const, skin: MAN.skin, grip: 16 }, 'grip', [slit[0] + 12, slit[1] + 2]);
    return (
      <Scene2 bg="closeup">
        <GrowBag x={bx} y={by} w={150} h={210} white={0.75} />
        <path d={`M${slit[0] - 2} ${slit[1] - 18}L${slit[0] + 2} ${slit[1] + 18}`} stroke={K.out} stroke-width={3} />
        <Oyster x={slit[0]} y={slit[1] + 14} a={18} s={1.2} />
        <Oyster x={slit[0]} y={slit[1] - 14} a={-22} s={1.25} />
        <Oyster x={slit[0]} y={slit[1]} a={-2} s={1.5} />
        <Hand {...h} arm={160} sleeve={K.role[MAN.role]} />
        <Arrow from={[slit[0] + 30, slit[1] + 64]} to={[slit[0] + 50, slit[1] + 26]} bend={-0.5} w={5} />
      </Scene2>
    );
  },
};

/* ═══════════════ TAVUK VE TAVŞAN ═══════════════ */

const HEN = '#b0623a'; // kahverengi tavuk
const HEN2 = '#f1ece0'; // beyaz tavuk
const COMB = '#d63b35';
const BEAK = '#f2b233';
const EGG = '#f0dcc0';
const CHICK = '#f6d54a';

/** Yandan tavuk (sağa bakar; flip sola). x,y = ayak altı (sit: gövde altı). */
function Hen({ x, y, s = 1, flip, c = HEN, sit, puff, legs = true }: { x: number; y: number; s?: number; flip?: boolean; c?: string; sit?: boolean; puff?: boolean; legs?: boolean }) {
  const by = sit ? -14 : -30; // gövde merkezi
  const k = puff ? 1.15 : 1;
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      {!sit && legs && (
        <g stroke={BEAK} stroke-width={2.6} stroke-linecap="round" fill="none">
          <path d="M-2 -16L-4 0M-4 0L-10 0M-4 0L2 0" />
          <path d="M6 -16L7 0M7 0L1 0M7 0L13 0" />
        </g>
      )}
      <OG sh={[
        { d: `M-30 ${by - 12 * k}Q-36 ${by - 30 * k} -24 ${by - 34 * k}Q-20 ${by - 20 * k} -14 ${by - 14 * k}Z`, f: shade(c, 0.25) },
        { d: smooth([[-22, by - 8 * k], [-6, by - 16 * k], [14, by - 14 * k], [22, by - 2], [12, by + 15 * k], [-12, by + 14 * k], [-26, by + 2]], true), f: c },
        { d: smooth([[-10, by - 2], [6, by - 6], [14, by + 4], [0, by + 10]], true), f: shade(c, 0.15) },
        { d: circ([20, by - 22], 9), f: c },
        { d: `M14 ${by - 30}Q16 ${by - 38} 20 ${by - 32}Q22 ${by - 39} 25 ${by - 31}Q29 ${by - 35} 28 ${by - 27}Z`, f: COMB },
        { d: `M28 ${by - 25}L36 ${by - 21}L28 ${by - 18}Z`, f: BEAK },
        { d: ell([27, by - 13], 3, 4), f: COMB },
      ]} />
      <circle cx={22} cy={by - 24} r={1.8} fill={K.ink} />
    </g>
  );
}
/** Civciv (sağa bakar). x,y ayak altı */
function Chick({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-1 -5L-2 0M3 -5L4 0" stroke={BEAK} stroke-width={1.8} stroke-linecap="round" />
      <OG sh={[{ d: ell([0, -11], 9, 7), f: CHICK }, { d: circ([7, -19], 5.5), f: CHICK }, { d: 'M12 -20L17 -18L12 -16Z', f: '#f08a24' }]} />
      <circle cx={8.5} cy={-20} r={1.2} fill={K.ink} />
    </g>
  );
}
function Egg({ x, y, s = 1, a = 0, c = EGG }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return <OG sh={[{ d: smooth([[0, -10], [7, -2], [6, 7], [0, 10], [-6, 7], [-7, -2]], true), t: `translate(${f1(x)} ${f1(y)}) rotate(${a}) scale(${s})`, f: c, k: s }]} />;
}
/** Tilki (yandan, sağa bakar) */
function Fox({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = '#d8732e';
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <OG sh={[
        { d: 'M-34 -24Q-62 -30 -66 -8Q-56 -14 -40 -12Z', f: c },
        { d: 'M-66 -8Q-62 -14 -56 -13L-60 -6Z', f: '#fbfaf7' },
        { d: capsule([-24, -20], 3, [-26, 0], 2.6), f: shade(c, 0.2) },
        { d: capsule([10, -20], 3, [12, 0], 2.6), f: shade(c, 0.2) },
        { d: smooth([[-34, -26], [-10, -32], [16, -30], [22, -18], [8, -12], [-28, -12]], true), f: c },
        { d: capsule([-18, -18], 3, [-16, 0], 2.6), f: c },
        { d: capsule([16, -18], 3, [18, 0], 2.6), f: c },
        { d: 'M16 -30L22 -50L28 -36Z', f: c },
        { d: 'M24 -34L32 -50L34 -32Z', f: c },
        { d: smooth([[14, -30], [30, -36], [36, -28], [48, -22], [30, -16], [16, -20]], true), f: c },
        { d: 'M30 -20L48 -22L34 -15Z', f: '#fbfaf7' },
        { d: circ([48, -22], 2.4), f: K.ink },
      ]} />
      <circle cx={30} cy={-29} r={1.6} fill={K.ink} />
    </g>
  );
}
/** Oturan tavşan (yandan, sağa bakar) */
function Rabbit({ x, y, s = 1, flip, c = '#cbb9a3' }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <OG sh={[
        { d: circ([-28, -16], 6), f: '#fbfaf7' },
        { d: smooth([[-26, -4], [-28, -22], [-10, -34], [10, -28], [16, -12], [12, 0], [-20, 0]], true), f: c },
        { d: ell([-12, -4], 14, 5), f: shade(c, 0.12) },
        { d: smooth([[8, -44], [4, -62], [10, -66], [14, -48]], true), f: shade(c, 0.08) },
        { d: smooth([[12, -42], [14, -64], [20, -64], [18, -42]], true), f: c },
        { d: ell([16, -32], 12, 10), f: c },
        { d: ell([8, -2], 6, 3), f: c },
      ]} />
      <circle cx={21} cy={-35} r={1.8} fill={K.ink} />
      <circle cx={27.5} cy={-29} r={1.4} fill="#d98a8a" />
    </g>
  );
}

const tavuk: Record<string, () => JSX.Element> = {
  // Kümes 2: tünek — tavuk başına 25 cm, yuvarlak sırık, altında dışkı tahtası
  'sf-th-kumes-tunek': () => {
    const ry = 128;
    const xs = [86, 158, 230];
    return (
      <Scene2 bg="indoor" wall="#d9c3a0">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={i * 48} y={0} width={1.5} height={191} fill={shade('#d9c3a0', 0.15)} />)}
        <OG sh={[{ d: rrect(30, 176, 260, 10, 2), f: WOOD }]} />
        <Stick a={[40, 136]} b={[40, 176]} w={3} />
        <Stick a={[280, 136]} b={[280, 176]} w={3} />
        <OG sh={[{ d: rrect(24, ry, 272, 9, 4.5), f: WOOD }]} />
        {xs.map((x, i) => <Hen key={x} x={x} y={ry + 2} s={1.15} c={i === 1 ? HEN2 : HEN} legs={false} sit />)}
        <Dim a={[xs[0], 46]} b={[xs[1], 46]} text="25 cm" size={13} />
        <Dim a={[xs[1], 46]} b={[xs[2], 46]} />
      </Scene2>
    );
  },

  // Kümes 3: her 5 tavuğa bir, kenarı 30 cm saman dolu folluk; karanlık, sakin köşe
  'sf-th-kumes-folluk': () => {
    const y0 = 196, bw = 76, bh = 92;
    const xs = [42, 122, 202];
    return (
      <Scene2 bg="indoor" wall="#d9c3a0">
        {xs.map((x) => (
          <g key={x}>
            <OG sh={[{ d: `M${x} ${y0}V${y0 - bh}H${x + bw}V${y0}Z`, f: shade(WOOD, 0.35) }]} />
            <path d={`M${x + 4} ${y0 - 16}Q${x + 20} ${y0 - 30} ${x + bw / 2} ${y0 - 24}Q${x + 56} ${y0 - 32} ${x + bw - 4} ${y0 - 16}`} fill={STRAW} stroke={STRAW_D} stroke-width={1.5} />
          </g>
        ))}
        <Hen x={xs[1] + bw / 2 - 4} y={y0 - 16} s={1.2} sit />
        <Egg x={xs[2] + 28} y={y0 - 24} />
        <Egg x={xs[2] + 44} y={y0 - 22} a={20} />
        <Egg x={xs[0] + 36} y={y0 - 24} a={-10} />
        {xs.map((x) => <OG key={'f' + x} sh={[{ d: rrect(x - 2, y0 - 16, bw + 4, 18, 2), f: WOOD }]} />)}
        <OG sh={[{ d: rrect(36, y0 - bh - 10, 248, 10, 2), f: WOOD }]} />
        <Dim a={[xs[2], y0 + 22]} b={[xs[2] + bw, y0 + 22]} text="30 cm" size={13} />
      </Scene2>
    );
  },

  // Kümes 4: delikler kapalı, tavuklar her akşam kapatılır; tilki dışarıda kalır
  'sf-th-kumes-yirtici': () => {
    const gy = 206;
    const cx0 = 22, cw = 170, ch = 112;
    const door = { x: 110, w: 50, h: 82 };
    const bolt: P = [door.x + door.w - 4, gy - 46];
    const w: PersonProps = { ...KOY, x: 200, y: gy + 18, s: 0.98, flip: true, pose: { ...POSE.standSide, armF: { to: [bolt[0] + 8, bolt[1]] }, armB: [96, 100], face: 'neutral' } };
    return (
      <Scene2 bg="night" gy={gy}>
        {/* kümes: taş temel + tahta duvar + çatı */}
        <OG sh={[{ d: rrect(cx0 - 4, gy - 14, cw + 8, 18, 3), f: K.rock }]} />
        <OG sh={[{ d: `M${cx0} ${gy - 14}V${gy - ch}H${cx0 + cw}V${gy - 14}Z`, f: '#9a6a44' }]} />
        {[1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={cx0 + i * 24} y={gy - ch} width={1.4} height={ch - 14} fill={shade('#9a6a44', 0.25)} />)}
        <OG sh={[{ d: `M${cx0 - 22} ${gy - ch + 4}L${cx0 + cw / 2} ${gy - ch - 44}L${cx0 + cw + 22} ${gy - ch + 4}Z`, f: '#7a4a33' }]} />
        {/* telli havalandırma */}
        <OG sh={[{ d: rrect(cx0 + 16, gy - ch + 12, 54, 30, 2), f: '#28303d' }]} />
        <path d={`M${cx0 + 16} ${gy - ch + 22}h54M${cx0 + 16} ${gy - ch + 32}h54M${cx0 + 30} ${gy - ch + 12}v30M${cx0 + 44} ${gy - ch + 12}v30M${cx0 + 58} ${gy - ch + 12}v30`} stroke={MESH} stroke-width={1.2} />
        {/* kapı (kapalı) ve sürgü */}
        <OG sh={[{ d: rrect(door.x, gy - 14 - door.h, door.w, door.h, 2), f: '#b58358' }]} />
        <path d={`M${door.x + 4} ${gy - 20}L${door.x + door.w - 4} ${gy - 14 - door.h + 6}`} stroke={shade('#b58358', 0.3)} stroke-width={3} />
        <OG sh={[{ d: rrect(bolt[0] - 18, bolt[1] - 4, 28, 8, 3), f: '#c9d0d8' }, { d: rrect(door.x + door.w, bolt[1] - 6, 10, 12, 2), f: '#8e99a6' }]} />
        <Person {...w} />
        <Arrow from={[bolt[0] - 34, bolt[1] - 22]} to={[bolt[0] - 2, bolt[1] - 22]} w={4} />
        <Fox x={262} y={gy + 22} s={0.9} flip />
      </Scene2>
    );
  },

  // Kuluçka 4: tavuğun altında 10–14 yumurta; yem ve su yuvanın hemen yanında
  'sf-th-kulucka-yuva': () => {
    const gy = 206;
    const nx = 132;
    return (
      <Scene2 bg="indoor" wall="#c9b28e">
        <rect x={0} y={0} width={320} height={191} fill="#2b2d3a" opacity={0.18} />
        <OG sh={[{ d: `M${nx - 80} ${gy + 10}V${gy - 40}H${nx + 80}V${gy + 10}Z`, f: shade(WOOD, 0.35) }]} />
        <path d={`M${nx - 76} ${gy - 6}Q${nx} ${gy - 30} ${nx + 76} ${gy - 6}V${gy + 6}H${nx - 76}Z`} fill={STRAW} stroke={STRAW_D} stroke-width={1.5} />
        {[-50, -34, -18, 2, 20, 38, 54].map((dx, i) => <Egg key={dx} x={nx + dx} y={gy - 14 + Math.abs(dx) * 0.08} a={i * 17 - 40} />)}
        <Hen x={nx - 6} y={gy - 16} s={1.75} sit puff />
        <OG sh={[{ d: rrect(nx - 84, gy - 4, 168, 16, 2), f: WOOD }]} />
        {/* su ve yem */}
        <OG sh={[{ d: `M${232} ${gy - 4}H${272}L${268} ${gy + 12}H${236}Z`, f: '#8e99a6' }]} />
        <rect x={236} y={gy - 4} width={32} height={4} fill={K.water} />
        <OG sh={[{ d: `M${266} ${gy + 14}H${310}L${306} ${gy + 28}H${270}Z`, f: '#c0603e' }]} />
        {[274, 282, 290, 298].map((x) => <circle key={x} cx={x} cy={gy + 13} r={2.4} fill={STRAW_D} />)}
        <Label x={nx} y={40} text="10–14" size={16} />
      </Scene2>
    );
  },

  // Kuluçka 6: 7. günde yumurta fenerle ışığa tutulur — damarlı döllü, berrak olan çıkarılır
  'sf-th-yumurta-isik': () => {
    const eggs: [number, boolean][] = [[100, true], [222, false]];
    return (
      <Scene2 bg="dark">
        {eggs.map(([x, fert]) => (
          <g key={x}>
            <path d={`M${x - 26} 236L${x - 34} 150H${x + 34}L${x + 26} 236Z`} fill="#ffe9a8" opacity={0.18} />
            <OG sh={[{ d: rrect(x - 20, 176, 40, 60, 6), f: '#3b3f4b' }, { d: ell([x, 176], 20, 5), f: '#ffe9a8' }]} />
            <G x={x} y={112} s={1}>
              <OG sh={[{ d: smooth([[0, -60], [28, -40], [38, 2], [26, 42], [0, 54], [-26, 42], [-38, 2], [-28, -40]], true), f: '#ffd98a' }]} />
              <path d="M-16 -46Q0 -38 16 -46Q8 -58 0 -59Q-8 -58 -16 -46Z" fill="#f7c76a" />
              {fert && (
                <g fill="none" stroke="#b5452e" stroke-width={2} stroke-linecap="round">
                  <circle cx={2} cy={4} r={7} fill="#7a2a1c" stroke="none" />
                  <path d="M2 4Q-14 -6 -24 -20M2 4Q20 -8 26 -24M2 4Q-18 18 -26 30M2 4Q18 20 22 36M-12 -8Q-8 -20 -4 -26M14 -10Q20 -4 30 -2" />
                </g>
              )}
            </G>
            {fert ? <Ok x={x + 40} y={52} r={13} /> : <Bad x={x + 40} y={52} r={13} />}
          </g>
        ))}
        <Label x={160} y={24} text="7. gün" size={15} />
      </Scene2>
    );
  },

  // Kuluçka 8: civcivler büyük tavuğun giremediği bölmede; sığ su (çakıllı), kırma tahıl
  'sf-th-civciv-bolme': () => {
    const gy = 168;
    const fy = gy + 4, fh = 56;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Hen x={236} y={fy - 14} s={1.45} flip />
        {/* dar aralıklı çit: civciv geçer, tavuk geçemez */}
        <OG sh={[{ d: rrect(0, fy - fh, 320, 7, 2), f: WOOD }, { d: rrect(0, fy - 20, 320, 7, 2), f: WOOD }]} />
        {Array.from({ length: 23 }, (_, i) => (
          <OG key={i} sh={[{ d: rrect(4 + i * 14, fy - fh - 6, 6, fh + 10, 2), f: tint(WOOD, 0.1) }]} />
        ))}
        {[0, 106, 212, 316].map((x) => <OG key={'p' + x} sh={[{ d: rrect(x - 4, fy - fh - 10, 10, fh + 14, 2), f: shade(WOOD, 0.1) }]} />)}
        {/* sığ su kabı + çakıl */}
        <OG sh={[{ d: ell([84, 206], 34, 9), f: '#8e99a6' }]} />
        <ellipse cx={84} cy={205} rx={28} ry={6} fill={K.water} />
        {[70, 82, 94, 102].map((x, i) => <circle key={x} cx={x} cy={205 + (i % 2)} r={3.4} fill={K.rock} stroke={K.out} stroke-width={1} />)}
        {/* yemlik: kırma tahıl */}
        <OG sh={[{ d: `M196 226H260L254 210H202Z`, f: '#c0603e' }]} />
        {[206, 216, 226, 236, 246].map((x) => <circle key={x} cx={x} cy={209} r={2.6} fill={STRAW_D} />)}
        <Chick x={40} y={214} s={1.5} />
        <Chick x={136} y={206} s={1.4} flip />
        <Chick x={150} y={232} s={1.5} />
        <Chick x={282} y={230} s={1.45} flip />
      </Scene2>
    );
  },

  // Tavşan 1: gölgede, yerden yüksek tel kafes; taban sık tel
  'sf-th-tavsan-kafes': () => {
    const gy = 206;
    const x0 = 58, x1 = 238, top = 76, bot = 172;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <ellipse cx={150} cy={gy + 12} rx={150} ry={20} fill={K.grassShade} opacity={0.7} />
        <Tree x={290} y={gy + 4} s={1.3} />
        {[x0 + 6, x1 - 6].map((x) => <Stick key={x} a={[x, bot]} b={[x, gy + 14]} w={4} />)}
        <OG sh={[{ d: rrect(x0 - 8, top - 12, x1 - x0 + 16, 12, 3), f: WOOD }]} />
        <rect x={x0} y={top} width={x1 - x0} height={bot - top} fill="#eef3f6" opacity={0.25} />
        <OG sh={[{ d: rrect(x0 + 10, bot - 30, 46, 24, 3), f: HAY }]} />
        <Rabbit x={152} y={bot - 2} s={1.25} />
        <OG sh={[{ d: rrect(x1 - 40, bot - 18, 26, 14, 3), f: '#8e99a6' }]} />
        <rect x={x1 - 37} y={bot - 16} width={20} height={4} fill={K.water} />
        <g stroke={MESH} stroke-width={1.3}>
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${x0 + i * 20} ${top}V${bot}`} />)}
          {Array.from({ length: 5 }, (_, i) => <path key={'h' + i} d={`M${x0} ${top + i * 24}H${x1}`} />)}
        </g>
        <rect x={x0} y={bot - 2} width={x1 - x0} height={6} fill={MESH} stroke={K.out} stroke-width={1.2} />
        <rect x={x0} y={top} width={x1 - x0} height={bot - top + 4} fill="none" stroke={K.out} stroke-width={2} />
        <Label x={148} y={38} text="75×75×50 cm" size={14} bg={K.white} />
      </Scene2>
    );
  },

  // Tavşan 5: 28. gün kafese saman dolu yavru kutusu; dişi tüy yolup yuva yapar
  'sf-th-tavsan-yavru-kutusu': () => {
    const gy = 206;
    const bx = 54, bw = 130, bh = 70;
    return (
      <Scene2 bg="indoor" wall="#d6dde2">
        <OG sh={[{ d: `M${bx} ${gy}V${gy - bh}H${bx + bw}V${gy}Z`, f: shade(WOOD, 0.4) }]} />
        <path d={`M${bx + 6} ${gy - 28}Q${bx + 30} ${gy - 52} ${bx + bw / 2} ${gy - 44}Q${bx + 100} ${gy - 56} ${bx + bw - 6} ${gy - 28}V${gy - 10}H${bx + 6}Z`} fill={STRAW} stroke={STRAW_D} stroke-width={1.5} />
        {/* annenin tüyü ve altında yavrular */}
        {[[bx + 46, gy - 40], [bx + 66, gy - 44], [bx + 86, gy - 40]].map(([x, y], i) => (
          <OG key={i} sh={[{ d: ell([x, y], 11, 7), f: '#d9a9a0' }]} />
        ))}
        <path d={`M${bx + 30} ${gy - 40}Q${bx + 44} ${gy - 60} ${bx + 66} ${gy - 52}Q${bx + 88} ${gy - 62} ${bx + 102} ${gy - 40}Q${bx + 66} ${gy - 46} ${bx + 30} ${gy - 40}Z`} fill="#f4efe6" stroke={K.out} stroke-width={1.3} />
        <OG sh={[{ d: `M${bx} ${gy}V${gy - 34}H${bx + bw}V${gy}Z`, f: WOOD }]} />
        <Rabbit x={256} y={gy + 10} s={1.5} flip />
        <Label x={bx + bw / 2} y={60} text="28. gün" size={15} />
      </Scene2>
    );
  },
};

/* ═══════════════ KEÇİ, KOYUN, SAĞIM, KIRKIM ═══════════════ */

const GOAT = '#8b5e3c';
const GOAT2 = '#ece6da';
const WOOL = '#efe7d6';
const SKIN_PINK = '#efc3b0';
const MILK = '#fbfaf3';

/** Yandan keçi (sağa bakar). x,y = toynak altı. udder: dişi memesi. eat: baş aşağı (yemde) */
function Goat({ x, y, s = 1, flip, c = GOAT, udder, eat, horns = true }: { x: number; y: number; s?: number; flip?: boolean; c?: string; udder?: boolean; eat?: boolean; horns?: boolean }) {
  const d = shade(c, 0.22);
  const hx = eat ? 54 : 54, hy = eat ? -40 : -70;
  const leg = (x0: number, f: string, dx = 0) => ({ d: capsule([x0, -34], 4.2, [x0 + dx, -3], 3), f });
  const hoof = (x0: number) => ({ d: rrect(x0 - 4, -6, 9, 6, 1.5), f: '#3b3537' });
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <OG sh={[leg(-24, d), hoof(-24), leg(28, d, 2), hoof(30)]} />
      <OG sh={[
        { d: 'M-40 -52L-46 -66L-36 -56Z', f: c },
        { d: smooth([[-42, -40], [-34, -60], [0, -62], [30, -58], [42, -44], [32, -28], [0, -26], [-34, -28]], true), f: c },
        { d: smooth(eat ? [[24, -54], [40, -60], [52, -46], [44, -36], [30, -42]] : [[22, -58], [40, -72], [54, -64], [46, -48], [32, -40]], true), f: c },
        { d: ell([0, 0], 13, 8.5), t: `translate(${hx} ${hy}) rotate(${eat ? 70 : 28})`, f: c },
        { d: ell([0, 0], 9, 4), t: `translate(${eat ? hx - 6 : hx - 8} ${eat ? hy - 12 : hy - 2}) rotate(${eat ? 110 : 160})`, f: d },
        ...(horns ? [{ d: eat ? `M${hx - 4} ${hy - 12}Q${hx - 18} ${hy - 26} ${hx - 30} ${hy - 22}L${hx - 26} ${hy - 18}Q${hx - 16} ${hy - 20} ${hx - 6} ${hy - 6}Z` : `M${hx - 2} ${hy - 6}Q${hx - 6} ${hy - 24} ${hx - 20} ${hy - 26}L${hx - 18} ${hy - 21}Q${hx - 10} ${hy - 18} ${hx - 8} ${hy - 2}Z`, f: '#b8a789' }] : []),
        ...(udder ? [{ d: smooth([[-30, -30], [-8, -30], [-10, -16], [-20, -12], [-30, -18]], true), f: SKIN_PINK }, { d: capsule([-24, -16], 2.6, [-25, -8], 2.2), f: SKIN_PINK }, { d: capsule([-14, -16], 2.6, [-13, -8], 2.2), f: SKIN_PINK }] : []),
        leg(-32, c, -2), hoof(-34), leg(20, c, 2), hoof(22),
      ]} />
      {!eat && <path d={`M${hx + 8} ${hy + 6}L${hx + 4} ${hy + 18}L${hx} ${hy + 6}Z`} fill={d} stroke={K.out} stroke-width={1} />}
      <circle cx={eat ? hx + 3 : hx + 2} cy={eat ? hy - 2 : hy - 4} r={1.8} fill={K.ink} />
    </g>
  );
}
/** Yandan koyun (sağa bakar). x,y = toynak altı */
function Sheep({ x, y, s = 1, flip, c = WOOL, face = '#4a3f3a' }: { x: number; y: number; s?: number; flip?: boolean; c?: string; face?: string }) {
  const leg = (x0: number) => ({ d: capsule([x0, -30], 4, [x0, -3], 3), f: face });
  const bumps: P[] = [[-36, -42], [-26, -58], [-8, -64], [12, -62], [30, -54], [38, -40], [28, -26], [6, -24], [-16, -24], [-34, -28]];
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flip ? -s : s} ${s})`}>
      <OG sh={[leg(-26), leg(26)]} />
      <OG sh={[
        ...bumps.map((p) => ({ d: circ(p, 13), f: c })),
        { d: ell([2, -42], 34, 18), f: c },
        leg(-18), leg(18),
        { d: smooth([[34, -54], [52, -62], [60, -50], [54, -40], [40, -42]], true), f: face },
        { d: ell([0, 0], 8, 3.5), t: 'translate(40 -56) rotate(150)', f: face },
        { d: circ([36, -58], 9), f: c },
      ]} />
      <circle cx={51} cy={-54} r={1.8} fill="#fff" />
    </g>
  );
}
/** Kova: x orta, y dip */
function Pail({ x, y, s = 1, c = '#a3adb8', milk = true }: { x: number; y: number; s?: number; c?: string; milk?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-16 -32Q0 -54 16 -32" fill="none" stroke={K.out} stroke-width={2} />
      <OG sh={[{ d: 'M-18 -32H18L14 0H-14Z', f: c }, { d: ell([0, -32], 18, 4.5), f: milk ? MILK : shade(c, 0.3) }]} />
    </G>
  );
}

const hayvan: Record<string, () => JSX.Element> = {
  // Keçi-koyun 1: kuru, havadar ağıl; havalandırma yukarıda, saman altlık; çit en az 120 cm
  'sf-th-agil': () => {
    const gy = 208;
    const x0 = 12, x1 = 206, wallTop = 92;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* ağıl kesiti */}
        <OG sh={[{ d: `M${x0} ${gy}V${wallTop}H${x0 + 16}V${gy}Z`, f: K.rock }]} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${x0} ${wallTop + 20 + i * 22}H${x0 + 16}`} stroke={shade(K.rock, 0.3)} stroke-width={1.2} />)}
        <rect x={x0 + 16} y={wallTop} width={x1 - x0 - 16} height={gy - wallTop} fill="#e2d2b4" />
        <OG sh={[{ d: `M${x0 - 8} ${wallTop + 4}L${x1 + 14} ${wallTop - 34}L${x1 + 18} ${wallTop - 26}L${x0 - 4} ${wallTop + 12}Z`, f: '#7a4a33' }]} />
        <Stick a={[x1, gy]} b={[x1, wallTop - 30]} w={4} />
        {/* yukarıda telli havalandırma */}
        <OG sh={[{ d: rrect(x1 - 4, wallTop - 22, 8, 26, 2), f: '#2b2d3a' }]} />
        <Waves x={x1 + 12} y={wallTop - 10} a={-20} n={2} r={5} color={K.water} />
        <path d={`M${x0 + 16} ${gy - 8}Q${x0 + 60} ${gy - 16} ${x0 + 100} ${gy - 8}Q${x0 + 150} ${gy - 16} ${x1} ${gy - 8}V${gy + 2}H${x0 + 16}Z`} fill={STRAW} stroke={STRAW_D} stroke-width={1.5} />
        <Sheep x={66} y={gy - 4} s={0.82} />
        <Goat x={150} y={gy - 2} s={0.82} c={GOAT2} />
        {/* dışarıdaki çit */}
        {[226, 266, 306].map((x) => <OG key={x} sh={[{ d: rrect(x - 4, gy - 104, 8, 112, 2), f: shade(WOOD, 0.1) }]} />)}
        {[gy - 96, gy - 66, gy - 36].map((y) => <OG key={y} sh={[{ d: rrect(218, y, 102, 7, 2), f: WOOD }]} />)}
      </Scene2>
    );
  },

  // Keçi-koyun 5: yavru ilk saatlerde annesinin ağız sütünü emer
  'sf-th-kolostrum': () => {
    const gy = 214;
    return (
      <Scene2 bg="indoor" wall="#e2d2b4">
        <path d={`M0 ${gy - 6}Q80 ${gy - 14} 160 ${gy - 6}Q240 ${gy - 14} 320 ${gy - 6}V240H0Z`} fill={STRAW} stroke={STRAW_D} stroke-width={1.5} />
        <Goat x={150} y={gy + 6} s={1.75} udder />
        <Goat x={150} y={gy + 14} s={0.82} flip c={GOAT2} horns={false} />
      </Scene2>
    );
  },

  // Keçi-koyun 6: kaldırılmış ayağın tabanı; uzayıp tabana kıvrılan tırnak kenarı kesilir
  'sf-th-tirnak-kesim': () => {
    const c: P = [146, 150]; // toynak tabanı merkezi
    const claw = (dx: number, flipX: number) => {
      const t = `translate(${c[0] + dx} ${c[1]}) scale(${flipX} 1)`;
      return (
        <g transform={t}>
          <OG sh={[
            { d: 'M0 -46Q26 -46 28 -6Q28 34 4 48Q-8 40 -6 -6Q-6 -40 0 -46Z', f: '#3b3537' },
            { d: 'M3 -36Q18 -34 19 -6Q19 24 6 36Q0 28 1 -6Z', f: '#d9cbb0' },
            { d: 'M24 -12Q34 8 22 34Q14 30 18 4Z', f: '#8e8478' },
          ]} />
          <path d="M20 -14Q30 8 18 36" fill="none" stroke="#fff" stroke-width={5} />
          <path d="M20 -14Q30 8 18 36" fill="none" stroke={K.action} stroke-width={3} stroke-dasharray="5 3" />
        </g>
      );
    };
    const hold = handAt({ a: 200, s: 0.95, pose: 'hold' as const, side: 'L' as const, skin: COB.skin, grip: 22 }, 'grip', [c[0] - 6, 70]);
    return (
      <Scene2 bg="closeup">
        <Limb pts={[[c[0] - 10, -20], [c[0] - 4, 60], [c[0], 100]]} r0={18} r1={16} c={GOAT} />
        <Hand {...hold} arm={160} sleeve={K.role[COB.role]} />
        {claw(4, 1)}
        {claw(-4, -1)}
        <ShearsHand piv={[c[0] + 40, c[1] + 24]} sa={-150} s={1.2} hs={0.85} sleeve={K.role[COB.role]} skin={COB.skin} />
      </Scene2>
    );
  },

  // Sağım 1: hayvan 40–45 cm yüksek sehpada, başı bağlı, önünde yem; sağımcı yanında
  'sf-th-sagim-sehpa': () => {
    const gy = 214;
    const pTop = gy - 42;
    const g = { x: 132, y: pTop, s: 1.05 };
    const udder: P = [g.x + 20 * g.s, pTop - 18];
    const m: PersonProps = { ...COB, x: 250, y: gy + 8, s: 0.92, flip: true, pose: { ...POSE.sitChair, spine: -70, chest: -60, head: -70, armF: { to: [udder[0] + 6, udder[1] + 6] }, armB: { to: [udder[0] - 2, udder[1] + 4] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e2d2b4">
        {/* sağım sehpası */}
        <OG sh={[{ d: rrect(36, pTop, 170, 9, 2), f: WOOD }]} />
        {[44, 190].map((x) => <OG key={x} sh={[{ d: rrect(x, pTop + 8, 8, gy - pTop - 2, 2), f: shade(WOOD, 0.15) }]} />)}
        {/* boyunduruk */}
        <OG sh={[{ d: rrect(52, pTop - 112, 7, 112, 2), f: WOOD }, { d: rrect(68, pTop - 112, 7, 112, 2), f: WOOD }, { d: rrect(46, pTop - 116, 36, 7, 2), f: WOOD }]} />
        <OG sh={[{ d: `M28 ${pTop - 30}H60L56 ${pTop - 14}H32Z`, f: '#c0603e' }]} />
        <Goat x={g.x} y={g.y} s={g.s} flip c={GOAT2} udder />
        <OG sh={[{ d: rrect(rig(m).hip[0] - 16, rig(m).hip[1] + 4, 34, 8, 2), f: WOOD }, { d: rrect(rig(m).hip[0] - 3, rig(m).hip[1] + 10, 6, gy - rig(m).hip[1] - 4, 1), f: shade(WOOD, 0.2) }]} />
        <Person {...m} />
        <Pail x={udder[0] - 2} y={pTop} s={0.62} />
        <Dim a={[24, gy + 2]} b={[24, pTop]} />
        <Label x={98} y={gy + 12} text="40–45 cm" size={13} bg={K.white} />
      </Scene2>
    );
  },

  // Sağım 4: başparmak ve işaret parmağı meme dibini sıkar, öbür parmaklar sırayla kapanır
  'sf-th-sagim-el': () => {
    // Yandan yakın plan: el memeyi sarıyor. Başparmak ve işaret parmağı meme dibinde halka (1),
    // orta parmak (2), yüzük ve serçe parmak (3) sırayla kapanıyor; süt uçtan aşağı akıyor.
    const tx = 140, tbot = 168;
    const sk = K.skin[COB.skin];
    const rows = [80, 102, 124, 144];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: smooth([[-20, -30], [340, -30], [300, 34], [220, 44], [100, 44], [20, 34]], true), f: SKIN_PINK }]} />
        <OG sh={[{ d: smooth([[tx - 19, 30], [tx + 19, 30], [tx + 16, 100], [tx + 12, tbot - 8], [tx, tbot], [tx - 12, tbot - 8], [tx - 16, 100]], true), f: SKIN_PINK }]} />
        <path d={`M${tx} ${tbot + 4}L${tx - 3} 232`} stroke="#fff" stroke-width={5} stroke-linecap="round" />
        {/* kol ve elin sırtı (sağda) */}
        <OG sh={[
          { d: capsule([tx + 50, 112], 20, [350, 118], 22), f: sk },
          { d: capsule([tx + 112, 116], 25, [360, 120], 26), f: K.role[COB.role] },
          { d: smooth([[tx + 6, 70], [tx + 40, 62], [tx + 66, 84], [tx + 66, 140], [tx + 40, 156], [tx + 8, 152]], true), f: sk },
        ]} />
        {/* memeyi saran parmaklar: üstte işaret, altta serçe */}
        <OG sh={rows.map((y, i) => ({ d: capsule([tx + 22, y], 9.5 - i * 0.8, [tx - 17, y + 1], 8.5 - i * 0.8), f: sk }))} />
        {rows.map((y, i) => <ellipse key={i} cx={tx - 19 + i * 0.6} cy={y + 1} rx={2.6} ry={4} fill={tint(sk, 0.45)} />)}
        {/* başparmak: işaret parmağıyla meme dibinde halka */}
        <OG sh={[{ d: capsule([tx + 30, 72], 8.5, [tx - 12, 64], 7.5), f: sk }]} />
        {[[1, 70], [2, 102], [3, 134]].map(([n, y]) => (
          <g key={n}>
            <circle cx={tx - 52} cy={y} r={11} fill={K.action} stroke={K.out} stroke-width={1.5} />
            <text x={tx - 52} y={y + 5} font-size={14} font-weight={700} text-anchor="middle" fill={K.ink}>{n}</text>
          </g>
        ))}
        <Arrow from={[tx - 80, 64]} to={[tx - 80, 150]} w={5} />
      </Scene2>
    );
  },

  // Sağım 7: süt temiz bezden süzülür, kap soğuk dereye oturtulup soğutulur
  'sf-th-sut-sogutma': () => {
    const gy = 168;
    const cx = 160;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Water x={0} y={gy + 8} w={320} h={70} />
        <OG sh={[{ d: `M${cx - 40} ${gy + 54}V${gy - 40}Q${cx - 40} ${gy - 58} ${cx - 22} ${gy - 62}H${cx + 22}Q${cx + 40} ${gy - 58} ${cx + 40} ${gy - 40}V${gy + 54}Z`, f: '#b9c2cb' }]} />
        <OG sh={[{ d: ell([cx, gy - 62], 24, 6), f: '#f4f1ea' }]} />
        <path d={`M${cx - 24} ${gy - 62}Q${cx - 30} ${gy - 52} ${cx - 26} ${gy - 46}M${cx + 24} ${gy - 62}Q${cx + 30} ${gy - 52} ${cx + 26} ${gy - 46}`} stroke={K.out} stroke-width={1.2} fill="#f4f1ea" />
        <path d={`M${cx - 26} ${gy - 66}H${cx + 26}`} stroke="#c6574e" stroke-width={3} />
        <rect x={0} y={gy + 22} width={320} height={60} fill={K.water} opacity={0.55} />
        <path d={`M${cx - 70} ${gy + 30}h30M${cx + 44} ${gy + 40}h36M${cx - 100} ${gy + 52}h24`} stroke={K.waterLight} stroke-width={2.5} stroke-linecap="round" />
        <Waves x={cx - 60} y={gy - 10} a={180} n={3} r={7} color={K.water} />
        <Waves x={cx + 60} y={gy - 10} a={0} n={3} r={7} color={K.water} />
        <Label x={cx} y={40} text="4 °C" size={16} bg={K.water} />
      </Scene2>
    );
  },

  // Kırkım 4: koyun kalçası üstüne sırtüstü oturtulur, sırtı kırkımcının dizlerine yaslanır
  'sf-th-kirkim-oturtma': () => {
    // Yandan: koyun kalçası yerde, gövdesi geriye yatık, sırtı kırkımcının dizlerine dayalı;
    // ön ayakları boşta sarkıyor, arka ayakları önde uzanıyor. Kırkımcı arkada ayakta, elleri koltuk altında.
    const gy = 212;
    const rump: P = [178, gy + 2];
    const S: P = [150, gy - 92]; // omuz
    const ax = angOf(rump, S);
    const mid = lerp(rump, S, 0.5);
    const face = '#4a3f3a';
    const leg = (a: P, b: P, r = 4.4) => ({ d: capsule(a, r, b, r * 0.75), f: face });
    const bumps: P[] = Array.from({ length: 12 }, (_, i) => {
      const t = (i / 12) * Math.PI * 2;
      const lx = Math.cos(t) * 30, ly = Math.sin(t) * 54;
      const c = Math.cos((ax + 90) * R), sn = Math.sin((ax + 90) * R);
      return [mid[0] + lx * c - ly * sn, mid[1] + lx * sn + ly * c];
    });
    const arm: P = [S[0] + 18, S[1] + 22];
    const sh: PersonProps = { ...COB, x: 104, y: gy + 14, s: 1.05, pose: { spine: -72, chest: -58, head: -56, legB: [96, 86], legF: [62, 98], armF: { to: [arm[0] + 6, arm[1] + 4] }, armB: { to: [arm[0] - 4, arm[1] + 2] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e2d2b4">
        <rect x={0} y={gy - 4} width={320} height={40} fill="#d6d0c4" />
        <Person {...sh} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[
          leg([rump[0] + 14, rump[1] - 12], [rump[0] + 76, rump[1] - 4]),
          leg([rump[0] + 8, rump[1] - 4], [rump[0] + 68, rump[1] + 6]),
          ...bumps.map((p) => ({ d: circ(p, 15), f: WOOL })),
          { d: ell([0, 0], 30, 54), t: `translate(${f1(mid[0])} ${f1(mid[1])}) rotate(${f1(ax + 90)})`, f: WOOL },
          leg([S[0] + 26, S[1] + 26], [S[0] + 52, S[1] + 56]),
          leg([S[0] + 20, S[1] + 32], [S[0] + 44, S[1] + 64]),
          // baş: boyun omuzdan yukarı, yüz sağa-yukarı
          { d: ell([0, 0], 17, 10), t: `translate(${S[0] + 26} ${S[1] - 26}) rotate(-38)`, f: face },
          { d: ell([0, 0], 7, 3.5), t: `translate(${S[0] + 8} ${S[1] - 30}) rotate(160)`, f: face },
          { d: circ([S[0] + 12, S[1] - 26], 12), f: WOOL },
        ]} />
        <circle cx={S[0] + 30} cy={S[1] - 32} r={1.9} fill="#fff" />
        <Person {...sh} only={['armF']} />
      </Scene2>
    );
  },

  // Kırkım 7: yapağı temiz tarafı aşağı serilir, kirli kenarlar ayıklanır
  'sf-th-yapagi-serme': () => {
    const pts: P[] = [[40, 70], [100, 40], [180, 38], [262, 56], [292, 120], [262, 186], [180, 204], [96, 200], [36, 160], [26, 112]];
    const dirt: P[] = [[54, 168], [38, 128], [282, 148]];
    const h = handAt({ a: 20, s: 0.9, pose: 'pinch' as const, side: 'R' as const, skin: COB.skin }, 'pinch', [dirt[0][0] + 4, dirt[0][1] + 6]);
    return (
      <Scene2 bg="floor">
        <OG sh={[{ d: rrect(14, 24, 292, 196, 6), f: tint(WOOD, 0.15) }]} />
        {[70, 120, 170].map((y) => <path key={y} d={`M14 ${y}H306`} stroke={shade(WOOD, 0.1)} stroke-width={1.2} />)}
        <OG sh={[{ d: smooth(pts, true), f: WOOL }]} />
        {[[100, 90], [160, 80], [220, 100], [130, 140], [200, 150], [90, 130], [250, 130]].map(([x, y], i) => (
          <path key={i} d={`M${x - 10} ${y}q5 -6 10 0t10 0`} fill="none" stroke={shade(WOOL, 0.18)} stroke-width={1.5} />
        ))}
        {dirt.map(([x, y], i) => <OG key={i} sh={[{ d: ell([x, y], 13, 9), f: '#8f7b5c' }]} />)}
        <OG sh={[{ d: ell([dirt[0][0] + 8, dirt[0][1] + 40], 12, 8), f: '#8f7b5c' }]} />
        <Hand {...h} arm={160} sleeve={K.role[COB.role]} />
      </Scene2>
    );
  },
};

/* ═══════════════ ARICILIK ═══════════════ */

const BEE = '#f2b233';
const VEIL = '#2b2d3a';

function Bee({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <ellipse cx={-1} cy={-5} rx={4} ry={3} fill="#fff" opacity={0.85} stroke={K.out} stroke-width={0.8} />
      <ellipse cx={0} cy={0} rx={5.5} ry={3.6} fill={BEE} stroke={K.out} stroke-width={1} />
      <path d="M-1.5 -3.4V3.4M2 -3.2V3.2" stroke={K.out} stroke-width={1.3} />
    </G>
  );
}
/** Koruyucu şapka + tül: kişinin başına (rig) göre */
function BeeHat({ r }: { r: ReturnType<typeof rig> }) {
  const [hx, hy] = r.head;
  const k = r.s;
  const brimY = hy - 9 * k;
  return (
    <g>
      <path d={`M${hx - 20 * k} ${brimY}L${hx - 15 * k} ${hy + 22 * k}Q${hx} ${hy + 27 * k} ${hx + 15 * k} ${hy + 22 * k}L${hx + 20 * k} ${brimY}Z`} fill={VEIL} opacity={0.45} stroke={K.out} stroke-width={1.2} />
      <path d={`M${hx - 18 * k} ${brimY + 8 * k}H${hx + 18 * k}M${hx - 17 * k} ${brimY + 16 * k}H${hx + 17 * k}M${hx - 16 * k} ${brimY + 24 * k}H${hx + 16 * k}`} stroke={VEIL} stroke-width={0.8} opacity={0.6} />
      <OG sh={[{ d: ell([hx, brimY], 24 * k, 5 * k), f: '#e9dcb8' }, { d: `M${hx - 11 * k} ${brimY}Q${hx - 11 * k} ${brimY - 14 * k} ${hx} ${brimY - 14 * k}Q${hx + 11 * k} ${brimY - 14 * k} ${hx + 11 * k} ${brimY}Z`, f: '#e9dcb8' }]} />
    </g>
  );
}
/** Duman kabı (körük): x,y dip ortası */
function Smoker({ x, y, s = 1, smoke = true }: { x: number; y: number; s?: number; smoke?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG sh={[
        { d: rrect(-10, -34, 20, 34, 3), f: '#b9c2cb' },
        { d: 'M-10 -34Q0 -46 10 -34Z', f: '#9aa4ae' },
        { d: 'M2 -42L12 -48L14 -44L6 -38Z', f: '#9aa4ae' },
        { d: 'M-10 -28L-24 -24L-24 -6L-10 -4Z', f: '#a8724a' },
      ]} />
      {smoke && <path d="M14 -48q6 -8 0 -14t2 -14" fill="none" stroke="#fff" stroke-width={4} stroke-linecap="round" opacity={0.9} />}
    </G>
  );
}
/** Petek gözleri (altıgen ızgara) bir dikdörtgende; fill(i,j) her gözün rengi */
function Comb({ x, y, w, h, r = 7, fill }: { x: number; y: number; w: number; h: number; r?: number; fill: (i: number, j: number) => string | null }) {
  const dx = r * 1.732, dy = r * 1.5;
  const cells: JSX.Element[] = [];
  for (let j = 0; j * dy < h - r; j++)
    for (let i = 0; i * dx < w - r; i++) {
      const cx = x + r + i * dx + (j % 2 ? dx / 2 : 0), cy = y + r + j * dy;
      if (cx > x + w - r * 0.8) continue;
      const c = fill(i, j);
      if (!c) continue;
      const pts = Array.from({ length: 6 }, (_, k) => pol([cx, cy], 30 + k * 60, r * 0.95));
      cells.push(<path key={i + '-' + j} d={'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z'} fill={c} stroke={shade(WAX, 0.35)} stroke-width={1} />);
    }
  return <g>{cells}</g>;
}

const ari: Record<string, () => JSX.Element> = {
  // Arıcılık 1-1: geniş şapkaya tül, kol ve paçada lastik, elde bilekten bağlı naylon torba
  'sf-th-ari-giysi': () => {
    const p: PersonProps = { ...ARI, x: 150, y: 232, s: 1.18, pose: { ...POSE.stand, armF: [70, 100], face: 'neutral' } };
    const r = rig(p);
    const bag = (h: P) => <OG sh={[{ d: smooth([[h[0] - 10, h[1] - 10], [h[0] + 10, h[1] - 10], [h[0] + 13, h[1] + 8], [h[0], h[1] + 16], [h[0] - 13, h[1] + 8]], true), f: '#eef6fb', op: 0.85 }]} />;
    const band = (a: P) => <path d={`M${a[0] - 7} ${a[1]}H${a[0] + 7}`} stroke="#c6574e" stroke-width={4} stroke-linecap="round" />;
    return (
      <Scene2 bg="outdoor">
        <Smoker x={r.handF[0] + 4} y={r.handF[1] + 46} s={1.1} />
        <Person {...p} over={(rr) => (
          <g>
            <BeeHat r={rr} />
            {band(lerp(rr.elbowB, rr.wristB, 0.85))}
            {band(lerp(rr.elbowF, rr.wristF, 0.85))}
            {band([rr.ankleB[0], rr.ankleB[1] - 6])}
            {band([rr.ankleF[0], rr.ankleF[1] - 6])}
            {bag(rr.handB)}
            {bag(rr.handF)}
          </g>
        )} />
        <Bee x={250} y={70} s={1.4} a={-10} />
        <Bee x={276} y={100} s={1.2} a={20} />
        <Bee x={56} y={90} s={1.3} a={10} />
      </Scene2>
    );
  },

  // Arıcılık 1-3: üst çıtalı kovan — uzun sandık, yan yana çıtalar, çıtalardan sarkan petekler
  'sf-th-ust-citali-kovan': () => {
    const top = 70, depth = 92, x0 = 30, x1 = 290, bot = top + depth;
    const n = 9, bw = (x1 - x0) / n;
    return (
      <Scene2 bg="outdoor" gy={206}>
        {[x0 + 40, x1 - 40].map((x) => <Stick key={x} a={[x, bot - 4]} b={[x, 220]} w={4} />)}
        {/* kesit: içi */}
        <OG sh={[{ d: `M${x0} ${top}L${x0 + 34} ${bot}H${x1 - 34}L${x1} ${top}Z`, f: shade(WOOD, 0.45) }]} />
        {Array.from({ length: n }, (_, i) => {
          const cx = x0 + bw * (i + 0.5);
          const inset = Math.max(0, 34 - Math.min(cx - x0, x1 - cx)) ;
          const hw = bw / 2 - 3;
          if (i === 0 || i === n - 1) return null;
          return (
            <OG key={i} sh={[{ d: `M${cx - hw} ${top + 6}H${cx + hw}Q${cx + hw} ${bot - 18 - inset} ${cx} ${bot - 8 - inset}Q${cx - hw} ${bot - 18 - inset} ${cx - hw} ${top + 6}Z`, f: WAX }]} />
          );
        })}
        {Array.from({ length: n }, (_, i) => (
          <OG key={'b' + i} sh={[{ d: rrect(x0 + bw * i + 1, top - 8, bw - 2, 10, 2), f: WOOD }]} />
        ))}
        {/* sandık kenarları (önden kesit çerçevesi) */}
        <path d={`M${x0} ${top}L${x0 + 34} ${bot}H${x1 - 34}L${x1} ${top}`} fill="none" stroke={shade(WOOD, 0.1)} stroke-width={7} />
        <path d={`M${x0} ${top}L${x0 + 34} ${bot}H${x1 - 34}L${x1} ${top}`} fill="none" stroke={K.out} stroke-width={1.5} />
        <circle cx={x0 + 30} cy={bot - 22} r={6} fill={K.out} />
        <Bee x={x0 + 8} y={bot - 30} s={1.2} />
        <Dim a={[x0 + bw * 4, top - 22]} b={[x0 + bw * 5, top - 22]} />
        <Label x={x0 + bw * 4.5} y={top - 44} text="35 mm" size={14} bg={K.white} />
      </Scene2>
    );
  },

  // Arıcılık 1-6: daldaki oğulun altına kutu tutulur, dal tek sert sarsışla silkelenir
  'sf-th-ogul-silkeleme': () => {
    const gy = 214;
    const sw: P = [196, 70]; // oğul merkezi
    const boxTop = 128;
    const bx = sw[0] - 2;
    const p: PersonProps = { ...ARI, x: 112, y: gy + 12, s: 1.02, pose: { ...POSE.standSide, spine: -86, armB: { to: [bx - 30, boxTop + 10] }, armF: { to: [154, 44] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Limb pts={[[340, 8], [250, 32], [180, 40], [110, 44]]} r0={8} r1={4} />
        {[[260, 30], [214, 36], [146, 40]].map(([x, y], i) => <Leaf key={i} x={x} y={y} a={i % 2 ? -60 : -120} s={1} />)}
        <path d={`M${sw[0]} 40Q${sw[0] + 34} 50 ${sw[0] + 26} 82Q${sw[0] + 16} 110 ${sw[0]} 112Q${sw[0] - 16} 110 ${sw[0] - 26} 82Q${sw[0] - 34} 50 ${sw[0]} 40Z`} fill="#b07a2a" stroke={K.out} stroke-width={1.5} />
        {[[-12, 56], [8, 62], [-4, 80], [14, 88], [-16, 92], [2, 102], [-6, 66], [18, 72]].map(([dx, dy], i) => (
          <Bee key={i} x={sw[0] + dx} y={dy} s={0.9} a={i * 40} />
        ))}
        {/* kutu */}
        <OG sh={[{ d: `M${bx - 40} ${boxTop}H${bx + 40}L${bx + 36} ${boxTop + 60}H${bx - 36}Z`, f: WOOD }, { d: `M${bx - 40} ${boxTop}H${bx + 40}L${bx + 34} ${boxTop + 10}H${bx - 34}Z`, f: shade(WOOD, 0.45) }]} />
        {[[bx - 8, 120], [bx + 10, 116], [bx + 2, 124]].map(([x, y], i) => <Bee key={'f' + i} x={x} y={y} s={0.9} a={90} />)}
        <Person {...p} over={(rr) => <BeeHat r={rr} />} />
        <Waves x={150} y={30} a={-120} n={3} r={6} />
      </Scene2>
    );
  },

  // Arıcılık 2-4: yavrulu petek (larva, kapalı kahve gözler) alınmaz; sırlı bal peteği alınır
  'sf-th-yavru-petek': () => {
    const fr = (x: number, kind: 'brood' | 'honey') => (
      <g>
        <OG sh={[{ d: rrect(x - 6, 30, 140, 12, 2), f: WOOD }]} />
        <OG sh={[{ d: `M${x + 4} 42H${x + 124}V${172}Q${x + 64} ${222} ${x + 4} ${172}Z`, f: WAX }]} />
        <Comb x={x + 6} y={44} w={116} h={150} r={7} fill={(i, j) => {
          const cy = 51 + j * 10.5;
          const cx = x + 13 + i * 12.1;
          const inside = cy < 172 || Math.hypot((cx - (x + 64)) / 60, (cy - 172) / 50) < 1;
          if (!inside) return null;
          if (kind === 'honey') return (i + j) % 7 === 0 && j < 2 ? '#f7c548' : '#f6e1a0';
          return (i * 3 + j * 5) % 4 === 0 ? '#fbfaf7' : '#b07a3a';
        }} />
        {kind === 'brood' && [[x + 30, 80], [x + 66, 110], [x + 94, 76], [x + 46, 140]].map(([cx, cy], i) => (
          <path key={i} d={`M${cx - 3} ${cy + 2}q3 -6 6 0`} fill="none" stroke="#e8e0cf" stroke-width={2} />
        ))}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {fr(18, 'brood')}
        {fr(176, 'honey')}
        <No x={82} y={120} r={52} />
        <Ok x={290} y={44} r={16} />
      </Scene2>
    );
  },

  // Arıcılık 2-6: ezilmiş petek tülbentte asılır, bal alttaki kaba süzülür (ısıtılmaz)
  'sf-th-bal-suzme': () => {
    const gy = 206;
    const cx = 130;
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(10, gy - 4, 300, 12, 2), f: WOOD }]} />
        <Stick a={[20, 30]} b={[250, 30]} w={4} />
        <path d={`M${cx - 6} 34L${cx - 30} 64M${cx + 6} 34L${cx + 30} 64`} stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: smooth([[cx - 34, 62], [cx + 34, 62], [cx + 38, 96], [cx + 16, 118], [cx, 122], [cx - 16, 118], [cx - 38, 96]], true), f: '#f4efe0' }]} />
        {[[cx - 16, 84], [cx + 12, 92], [cx - 4, 104], [cx + 20, 76]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill={WAX} stroke={shade(WAX, 0.3)} stroke-width={1} />)}
        <path d={`M${cx} 122V${gy - 50}`} stroke={HONEY} stroke-width={5} stroke-linecap="round" />
        <path d={`M${cx} 122V${gy - 50}`} stroke={tint(HONEY, 0.4)} stroke-width={1.5} stroke-linecap="round" />
        <OG sh={[{ d: `M${cx - 46} ${gy - 46}H${cx + 46}L${cx + 40} ${gy - 4}H${cx - 40}Z`, f: '#8e99a6' }, { d: ell([cx, gy - 46], 46, 7), f: HONEY }]} />
        {[236, 278].map((x) => (
          <g key={x}>
            <OG sh={[{ d: rrect(x - 16, gy - 50, 32, 46, 6), f: HONEY }, { d: rrect(x - 17, gy - 58, 34, 10, 2), f: '#c6574e' }]} />
            <rect x={x - 10} y={gy - 42} width={5} height={28} rx={2.5} fill="#fff" opacity={0.45} />
          </g>
        ))}
      </Scene2>
    );
  },

  // Arıcılık 2-8: mum su dolu kapta yavaş ısıtılır, üstte donar; doğrudan ateşte eritilmez
  'sf-th-balmumu-eritme': () => {
    const gy = 206;
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(6, gy - 4, 308, 12, 2), f: WOOD }]} />
        {/* doğru: su dolu tencerede mum yüzüyor */}
        <OG sh={[{ d: rrect(40, gy - 34, 120, 30, 4), f: K.red }, { d: rrect(52, gy - 40, 96, 7, 2), f: K.metal }]} />
        <path d={`M70 ${gy - 40}c0-5 5-6 3-11c5 3 5 6 3 10M96 ${gy - 40}c0-5 5-6 3-11c5 3 5 6 3 10M122 ${gy - 40}c0-5 5-6 3-11c5 3 5 6 3 10`} fill="#5aa9ff" />
        <OG sh={[{ d: `M46 ${gy - 120}H154L150 ${gy - 50}Q150 ${gy - 46} 146 ${gy - 46}H54Q50 ${gy - 46} 50 ${gy - 50}Z`, f: '#8e99a6' }]} />
        <rect x={50} y={gy - 110} width={100} height={60} fill={K.water} opacity={0.85} />
        <path d={`M50 ${gy - 110}Q75 ${gy - 116} 100 ${gy - 110}T150 ${gy - 110}V${gy - 102}H50Z`} fill={WAX} stroke={K.out} stroke-width={1.2} />
        <Ok x={100} y={gy - 150} r={15} />
        {/* yanlış: mum kabı doğrudan alevde */}
        <path d={`M218 ${gy - 6}Q226 ${gy - 40} 238 ${gy - 22}Q246 ${gy - 52} 256 ${gy - 22}Q268 ${gy - 40} 276 ${gy - 6}Z`} fill={K.fire} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: `M214 ${gy - 64}H280L276 ${gy - 34}H218Z`, f: '#5f6873' }, { d: ell([247, gy - 64], 33, 5), f: WAX }]} />
        <No x={247} y={gy - 60} r={46} />
      </Scene2>
    );
  },
};

/* ═══════════════ HAYVAN SAĞLIĞI, KESİM ═══════════════ */

const GLOVE = '#4f9bd6';
const LIME = '#f7f7f2';

/** Eldivenli el (kişinin rig el noktasına) */
const gloveAt = (h: P, k = 1) => <OG sh={[{ d: circ(h, 6.5 * k), f: GLOVE }]} />;
/** Yemlik (tahta oluk): x sol, y zemin */
function Trough({ x, y, w = 110, grain = true }: { x: number; y: number; w?: number; grain?: boolean }) {
  return (
    <g>
      <OG sh={[{ d: `M${x} ${y - 26}H${x + w}L${x + w - 8} ${y - 6}H${x + 8}Z`, f: WOOD }, { d: rrect(x + 10, y - 8, 6, 8, 1), f: shade(WOOD, 0.2) }, { d: rrect(x + w - 16, y - 8, 6, 8, 1), f: shade(WOOD, 0.2) }]} />
      {grain && <path d={`M${x + 6} ${y - 26}Q${x + w / 2} ${y - 34} ${x + w - 6} ${y - 26}Z`} fill={STRAW_D} stroke={K.out} stroke-width={1} />}
    </g>
  );
}
/** Uyarı üçgeni (kırmızı) */
function Warn({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <path d={`M${x} ${y - r}L${x + r * 1.1} ${y + r * 0.8}H${x - r * 1.1}Z`} fill="#fff" stroke="#fff" stroke-width={5} stroke-linejoin="round" />
      <path d={`M${x} ${y - r}L${x + r * 1.1} ${y + r * 0.8}H${x - r * 1.1}Z`} fill={K.danger} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
      <path d={`M${x} ${y - r * 0.4}V${y + r * 0.2}`} stroke="#fff" stroke-width={r * 0.2} stroke-linecap="round" />
      <circle cx={x} cy={y + r * 0.52} r={r * 0.11} fill="#fff" />
    </g>
  );
}
/** Et parçası (asılı but) — sade, kansız */
function MeatCut({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M0 -12V4" stroke={K.metal} stroke-width={2.5} />
      <path d="M0 -14q6 0 6 6" fill="none" stroke={K.metal} stroke-width={2.5} />
      <OG sh={[
        { d: smooth([[-6, 4], [6, 4], [14, 30], [16, 62], [6, 78], [-8, 76], [-16, 56], [-12, 26]], true), f: '#c9675a' },
        { d: smooth([[-5, 6], [5, 6], [9, 20], [-8, 20]], true), f: '#f3e6d6' },
        { d: smooth([[4, 34], [12, 40], [10, 60], [4, 66]], false), f: 'none', st: '#f3e6d6', sw: 3 },
      ]} />
    </G>
  );
}

const saglik: Record<string, () => JSX.Element> = {
  // Hayvan sağlığı 1: her sabah yem verirken say ve izle; ayrı, başı önde duran hayvan
  'sf-th-gunluk-kontrol': () => {
    const gy = 208;
    const pail: P = [92, 124];
    const p: PersonProps = { ...BAK, x: 58, y: gy + 18, s: 1, pose: { ...POSE.standSide, spine: -84, armF: { to: [pail[0] - 2, pail[1] - 20] }, armB: { to: [pail[0] - 12, pail[1] + 6] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <Trough x={96} y={gy + 22} w={120} />
        <Goat x={146} y={gy + 2} s={0.8} c={GOAT2} eat />
        <Hen x={110} y={gy + 32} s={0.85} />
        <Hen x={226} y={gy + 30} s={0.85} flip c={HEN2} />
        <Person {...p} mid={() => (
          <G x={pail[0]} y={pail[1]} a={50}>
            <OG sh={[{ d: 'M-14 -26H14L11 0H-11Z', f: '#a3adb8' }]} />
          </G>
        )} />
        <path d={`M${pail[0] + 14} ${pail[1] + 4}Q${pail[0] + 26} ${pail[1] + 30} ${pail[0] + 30} ${gy - 10}`} fill="none" stroke={STRAW_D} stroke-width={4} stroke-dasharray="2 5" stroke-linecap="round" />
        {/* sürüden ayrı, başı önde duran keçi */}
        <Goat x={274} y={gy + 6} s={0.72} flip c={GOAT} eat horns={false} />
        <circle cx={268} cy={gy - 26} r={42} fill="none" stroke={K.action} stroke-width={4} />
      </Scene2>
    );
  },

  // Hayvan sağlığı 5: hasta hayvan ayrı bölmede; ayrı ayakkabı ve eldivenle, en son bakılır
  'sf-th-hasta-ayirma': () => {
    // Solda sürü kendi ağılında; sağda araya boşluk bırakılmış ayrı küçük bölmede tek başına hasta keçi.
    const gy = 206;
    const pen = (x0: number, x1: number, posts: number[]) => (
      <g>
        {posts.map((x) => <OG key={x} sh={[{ d: rrect(x - 4, gy - 76, 8, 86, 2), f: shade(WOOD, 0.1) }]} />)}
        {[gy - 68, gy - 40].map((y) => <OG key={y} sh={[{ d: rrect(x0, y, x1 - x0, 7, 2), f: WOOD }]} />)}
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {pen(8, 146, [14, 78, 140])}
        {pen(190, 312, [196, 252, 306])}
        <Sheep x={56} y={gy + 10} s={0.72} />
        <Goat x={112} y={gy + 16} s={0.7} c={GOAT2} eat />
        <Goat x={252} y={gy + 14} s={0.84} flip c={GOAT} eat horns={false} />
        <Arrow from={[112, gy - 104]} to={[236, gy - 100]} bend={-0.35} w={5} />
      </Scene2>
    );
  },

  // Hayvan sağlığı 7: ölü hayvan en az 1 m derine gömülür, üstüne kireç serpilir
  'sf-th-olu-gomme': () => {
    const gy = 126;
    const hx0 = 100, hx1 = 196, hb = 222;
    const scoop: P = [176, 96];
    const p: PersonProps = { ...BAK, x: 228, y: gy + 4, s: 0.7, flip: true, pose: { spine: -62, chest: -52, head: -50, legB: [96, 92], legF: [80, 96], armF: { to: scoop }, armB: { to: [scoop[0] + 18, scoop[1] + 10] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy} ground="dirt">
        <SoilSection gy={gy} topH={16} />
        <path d={`M${hx0} ${gy}V${hb}H${hx1}V${gy}Z`} fill={shade(SOIL, 0.4)} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: `M14 ${gy + 1}Q30 ${gy - 30} 56 ${gy - 26}Q80 ${gy - 22} 92 ${gy + 1}Z`, f: SOIL }]} />
        {/* dipte ölü tavuk (yan yatmış) */}
        <g transform={`translate(${(hx0 + hx1) / 2 - 10} ${hb - 4}) rotate(-8)`}>
          <OG sh={[{ d: smooth([[-30, 0], [-26, -18], [0, -22], [24, -14], [30, 0]], true), f: HEN }, { d: circ([32, -8], 8), f: HEN }, { d: 'M38 -6L46 -4L38 -1Z', f: BEAK }]} />
          <path d="M30 -10l4 2" stroke={K.ink} stroke-width={1.5} />
        </g>
        {/* kireç serpintisi */}
        {[[132, 150], [150, 168], [164, 140], [142, 186], [170, 180], [126, 200], [158, 124]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={LIME} />)}
        <path d={`M${hx0 + 4} ${hb - 30}Q${(hx0 + hx1) / 2} ${hb - 40} ${hx1 - 4} ${hb - 30}`} fill="none" stroke={LIME} stroke-width={5} stroke-linecap="round" opacity={0.9} />
        <Person {...p} mid={() => <OG sh={[{ d: `M${scoop[0] - 14} ${scoop[1] - 6}H${scoop[0] + 8}L${scoop[0] + 4} ${scoop[1] + 8}H${scoop[0] - 12}Z`, f: '#a3adb8' }, { d: ell([scoop[0] - 3, scoop[1] - 6], 11, 3), f: LIME }]} />} over={(r) => <g>{gloveAt(r.handF, 0.8)}{gloveAt(r.handB, 0.8)}</g>} />
        <Dim a={[hx0 - 14, gy]} b={[hx0 - 14, hb]} text="1 m" lx={hx0 - 40} ly={(gy + hb) / 2} />
      </Scene2>
    );
  },

  // Kesim 2: temiz, gölgeli, sineğe kapalı yer; su, sabun, iki keskin bıçak, ip, çengel, eldiven
  'sf-th-kesim-yeri': () => {
    const gy = 210;
    const tTop = 156;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <ellipse cx={170} cy={gy + 10} rx={170} ry={22} fill={K.grassShade} opacity={0.75} />
        <Limb pts={[[20, 240], [26, 120], [40, 40], [60, -10]]} r0={18} r1={12} c={K.trunk} />
        <Limb pts={[[34, 64], [140, 40], [260, 34], [330, 26]]} r0={9} r1={6} c={K.trunk} />
        <path d="M0 -10Q120 30 330 -10V0H0Z" fill={K.leaf} />
        {/* ip ve çengel */}
        <path d="M200 36V96" stroke="#b9a27a" stroke-width={3} />
        <path d="M200 96v10q0 10 -8 10t-6 -8" fill="none" stroke={K.metal} stroke-width={3.5} stroke-linecap="round" />
        {/* masa */}
        <OG sh={[{ d: rrect(70, tTop, 220, 10, 2), f: WOOD }, { d: rrect(82, tTop + 10, 8, gy - tTop + 4, 1), f: shade(WOOD, 0.2) }, { d: rrect(270, tTop + 10, 8, gy - tTop + 4, 1), f: shade(WOOD, 0.2) }]} />
        {/* su bidonu */}
        <OG sh={[{ d: rrect(88, tTop - 52, 40, 52, 6), f: '#4f86c6' }, { d: rrect(100, tTop - 60, 14, 9, 2), f: '#2f5f9a' }]} />
        {/* sabun */}
        <OG sh={[{ d: rrect(136, tTop - 12, 24, 12, 4), f: '#f2d27a' }]} />
        {/* iki bıçak */}
        <Knife x={166} y={tTop - 4} s={0.9} blade={30} />
        <Knife x={170} y={tTop - 14} s={0.9} blade={30} />
        {/* leğenler */}
        <OG sh={[{ d: `M226 ${tTop}H284L278 ${tTop - 16}H232Z`, f: '#9aa4ae' }]} />
        <OG sh={[{ d: `M210 ${gy + 18}H280L272 ${gy}H218Z`, f: '#9aa4ae' }]} />
        {/* eldiven */}
        <OG sh={[{ d: smooth([[238, tTop - 30], [256, tTop - 30], [258, tTop - 18], [236, tTop - 18]], true), f: GLOVE }]} />
      </Scene2>
    );
  },

  // Kesim 8: iç organ kontrolü — sağlıklı düz renkli ciğer; su dolu keseli (kist) ciğer yenmez
  'sf-th-ic-organ-kontrol': () => {
    const liver = (x: number, cyst: boolean) => (
      <g>
        <OG sh={[{ d: smooth([[x - 54, -6], [x - 30, -30], [x + 10, -28], [x + 50, -18], [x + 54, 4], [x + 20, 22], [x - 30, 20], [x - 56, 12]].map(([a, b]) => [a, 136 + b] as P), true), f: '#7e3a2e' }]} />
        <path d={`M${x - 6} 110Q${x} 130 ${x - 10} 154`} fill="none" stroke={shade('#7e3a2e', 0.3)} stroke-width={2} />
        {cyst && [[x - 30, 128, 9], [x + 14, 124, 11], [x + 30, 142, 7], [x - 10, 146, 8]].map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="#e9f0e6" stroke={K.out} stroke-width={1.2} />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.25} fill="#fff" />
          </g>
        ))}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(14, 76, 292, 124, 14), f: '#cfd6dd' }, { d: rrect(24, 86, 272, 104, 10), f: '#e8edf1' }]} />
        <path d="M160 92V184" stroke="#b6bfc8" stroke-width={2} />
        {liver(90, false)}
        {liver(232, true)}
        <Ok x={90} y={56} r={16} />
        <Bad x={232} y={56} r={16} />
      </Scene2>
    );
  },

  // Kesim 9: et serin, havadar, gölge yerde asılı ve parçalar birbirine değmeden soğur
  'sf-th-et-sogutma': () => {
    const rail = 54;
    return (
      <Scene2 bg="indoor" wall="#dfe6ea">
        {/* tülle örtülü pencere */}
        <OG sh={[{ d: rrect(214, 48, 86, 84, 3), f: '#c2e4f4' }]} />
        <rect x={218} y={52} width={78} height={76} fill="#fff" opacity={0.55} />
        <path d="M218 72H296M218 92H296M218 112H296M238 52V128M258 52V128M278 52V128" stroke="#fff" stroke-width={1} />
        <Stick a={[12, rail]} b={[200, rail]} w={3.5} c={K.metal} />
        {[40, 92, 144].map((x, i) => <MeatCut key={x} x={x} y={rail + 14} s={1.2 - i * 0.04} />)}
        <Arrow from={[208, 84]} to={[176, 94]} color={K.water} w={4} />
        <Arrow from={[208, 112]} to={[176, 128]} color={K.water} w={4} />
      </Scene2>
    );
  },
};

/* ═══════════════ OT VE BALIK HAVUZU ═══════════════ */

/** Yaba: sap a → çatal ucu b */
function Fork({ a, b }: { a: P; b: P }) {
  const ang = angOf(a, b);
  return (
    <g>
      <Stick a={a} b={pol(b, ang, -22)} w={2.4} />
      <G x={b[0]} y={b[1]} a={ang + 90}>
        <path d="M-9 22H9M-9 22V0M0 22V-2M9 22V0" fill="none" stroke={K.out} stroke-width={4.5} stroke-linecap="round" />
        <path d="M-9 22H9M-9 22V0M0 22V-2M9 22V0" fill="none" stroke="#a3adb8" stroke-width={2.4} stroke-linecap="round" />
      </G>
    </g>
  );
}
/** Sazan (yandan, sağa bakar); x,y merkez; a dönüş */
function Carp({ x, y, s = 1, a = 0, mouth }: { x: number; y: number; s?: number; a?: number; mouth?: boolean }) {
  const c = '#b8913e';
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG sh={[
        { d: 'M-24 0L-38 -12L-36 0L-38 12Z', f: shade(c, 0.15) },
        { d: 'M-6 -10L4 -20L10 -10Z', f: shade(c, 0.15) },
        { d: ell([0, 0], 26, 11), f: c },
        ...(mouth ? [{ d: ell([26, 0], 3, 4), f: '#5a3d22' }] : []),
      ]} />
      <circle cx={16} cy={-3} r={2} fill={K.ink} />
      <path d="M10 -8Q14 0 10 8" fill="none" stroke={shade(c, 0.3)} stroke-width={1.2} />
    </G>
  );
}

const otbalik: Record<string, () => JSX.Element> = {
  // Ot 3: biçilen ot güneşte serilir, günde 1–2 kez yabayla çevrilir; yağmur gelirse tınaz
  'sf-th-ot-cevirme': () => {
    const gy = 172;
    const tip: P = [176, 206];
    const g1: P = [116, 136], g2: P = [134, 162];
    const p: PersonProps = { ...CIF, x: 92, y: 230, s: 1, pose: { spine: -66, chest: -56, head: -50, legB: [100, 92], legF: [70, 100], armB: { to: g1 }, armF: { to: g2 }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d="M200 20a14 14 0 0 1 26 -4a11 11 0 0 1 20 8a10 10 0 0 1 -4 18h-44a10 10 0 0 1 2 -22z" fill="#9aa4ae" stroke={K.out} stroke-width={1.2} />
        {[[56, gy + 2], [272, gy + 4]].map(([x, y], i) => (
          <OG key={i} sh={[{ d: `M${x - 18} ${y}Q${x} ${y - 36} ${x + 18} ${y}Z`, f: HAY }]} />
        ))}
        {[186, 212, 236].map((y, i) => (
          <path key={y} d={`M-10 ${y}Q80 ${y - 10} 160 ${y}T330 ${y}`} fill="none" stroke={i === 1 ? tint(HAY, 0.2) : HAY} stroke-width={12} stroke-linecap="round" />
        ))}
        <Person {...p} mid={() => <Fork a={pol(g1, angOf(g1, tip), -12)} b={tip} />} />
        <Arrow from={[200, 186]} to={[214, 160]} bend={-0.6} w={4} />
      </Scene2>
    );
  },

  // Ot 6: tınaz — kuru taban üstünde, ortası sıkı, kenarları dışa eğimli, tepesi sivri, bağlı, örtülü
  'sf-th-tinaz': () => {
    const gy = 206;
    const cx = 156;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* taş taban */}
        {[-54, -28, -2, 24, 50].map((dx) => <OG key={dx} sh={[{ d: ell([cx + dx, gy + 4], 15, 8), f: K.rock }]} />)}
        {/* orta direk */}
        <Stick a={[cx, gy - 168]} b={[cx, gy - 200]} w={3.5} />
        {/* gövde: dar taban, dışa şişkin karın, sivri tepe */}
        <OG sh={[{ d: `M${cx - 56} ${gy}C${cx - 92} ${gy - 34} ${cx - 98} ${gy - 92} ${cx - 62} ${gy - 126}Q${cx - 30} ${gy - 158} ${cx} ${gy - 174}Q${cx + 30} ${gy - 158} ${cx + 62} ${gy - 126}C${cx + 98} ${gy - 92} ${cx + 92} ${gy - 34} ${cx + 56} ${gy}Z`, f: HAY }]} />
        {[[-58, -64], [24, -44], [-30, -104], [40, -96], [-50, -24], [4, -132], [56, -60], [-8, -72]].map(([dx, dy], i) => (
          <path key={i} d={`M${cx + dx} ${gy + dy}q7 -5 14 -3`} fill="none" stroke={shade(HAY, 0.25)} stroke-width={1.5} />
        ))}
        <path d={`M${cx - 56} ${gy - 4}Q${cx} ${gy + 4} ${cx + 56} ${gy - 4}`} fill="none" stroke={shade(HAY, 0.3)} stroke-width={2} />
        {/* sazdan tepe örtüsü */}
        <OG sh={[{ d: `M${cx - 56} ${gy - 120}Q${cx - 28} ${gy - 156} ${cx} ${gy - 176}Q${cx + 28} ${gy - 156} ${cx + 56} ${gy - 120}L${cx + 44} ${gy - 112}L${cx + 30} ${gy - 122}L${cx + 14} ${gy - 110}L${cx} ${gy - 122}L${cx - 14} ${gy - 110}L${cx - 30} ${gy - 122}L${cx - 44} ${gy - 112}Z`, f: '#a0864a' }]} />
        {/* ipler ve uçlarında ağırlık taşları */}
        {[-1, 1].map((k) => (
          <g key={k}>
            <path d={`M${cx} ${gy - 172}Q${cx + k * 62} ${gy - 150} ${cx + k * 84} ${gy - 80}L${cx + k * 92} ${gy - 46}`} fill="none" stroke="#6b4a32" stroke-width={2.5} />
            <OG sh={[{ d: ell([cx + k * 92, gy - 38], 9, 8), f: K.rock }]} />
          </g>
        ))}
      </Scene2>
    );
  },

  // Ot 7: samanlıkta ara ara el yığına sokulur; ısınma, buhar ya da küf kokusu varsa yığın açılır
  'sf-th-ot-sicaklik-kontrol': () => {
    const gy = 210;
    const inHand: P = [176, 132];
    const p: PersonProps = { ...CIF, x: 92, y: gy + 18, s: 1.05, pose: { ...POSE.standSide, spine: -80, chest: -74, armF: { to: inHand }, armB: [96, 100], face: 'worried' } };
    return (
      <Scene2 bg="indoor" wall="#c9b28e">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={i * 48} y={0} width={1.5} height={200} fill={shade('#c9b28e', 0.15)} />)}
        <OG sh={[{ d: `M150 ${gy + 6}Q144 120 190 80Q240 50 300 70L340 76V${gy + 6}Z`, f: HAY }]} />
        {[[200, 110], [250, 90], [270, 150], [220, 170], [300, 120]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y}l16 -5`} stroke={shade(HAY, 0.25)} stroke-width={1.5} />
        ))}
        <Person {...p} />
        <Waves x={226} y={66} a={-90} n={3} r={7} color="#fff" />
        <Waves x={274} y={52} a={-90} n={3} r={7} color="#fff" />
        <Warn x={264} y={130} r={20} />
      </Scene2>
    );
  },

  // Balık 3: dikdörtgen havuz, kil sıvalı taban, su derinliği 1–1,5 m
  'sf-th-havuz-kesit': () => {
    const gy = 92;
    const wl = 104; // su yüzü
    const bot = 196;
    const L = 46, Rr = 274; // havuz üst kenarları
    const bl = L + 46, br = Rr - 46; // taban köşeleri
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <SoilSection gy={gy} topH={10} />
        {/* setler */}
        <OG sh={[{ d: `M0 ${gy}H${L - 18}L${L} ${gy - 6}L${L + 8} ${gy}Z`, f: SOIL }, { d: `M320 ${gy}H${Rr + 18}L${Rr} ${gy - 6}L${Rr - 8} ${gy}Z`, f: SOIL }]} />
        {/* kil kaplama */}
        <path d={`M${L - 4} ${gy}L${bl - 4} ${bot + 10}H${br + 4}L${Rr + 4} ${gy}H${Rr - 8}L${br} ${bot}H${bl}L${L + 8} ${gy}Z`} fill={CLAY} stroke={K.out} stroke-width={1.5} />
        <path d={`M${L + 8 + (wl - gy) * 0.5} ${wl}L${bl} ${bot}H${br}L${Rr - 8 - (wl - gy) * 0.5} ${wl}Z`} fill={K.water} stroke={K.out} stroke-width={1.5} />
        <path d={`M${L + 8} ${gy}L${L + 8 + (wl - gy) * 0.5} ${wl}M${Rr - 8} ${gy}L${Rr - 8 - (wl - gy) * 0.5} ${wl}`} stroke={K.out} stroke-width={1.5} />
        <path d={`M90 ${wl + 14}h30M170 ${wl + 30}h40M120 ${wl + 60}h26`} stroke={K.waterLight} stroke-width={2.5} stroke-linecap="round" />
        <Carp x={130} y={164} s={1} />
        <g transform="translate(340 0) scale(-1 1)"><Carp x={170} y={128} s={0.8} /></g>
        <Dim a={[br - 14, wl]} b={[br - 14, bot]} text="1–1,5 m" lx={br - 14} ly={(wl + bot) / 2 + 8} />
      </Scene2>
    );
  },

  // Balık 5: dere havuza doğrudan bağlanmaz, yanından geçer; giriş ve taşmada elek
  'sf-th-havuz-elek': () => {
    const px = 70, py = 66, pw = 190, ph = 110;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.grass} />
        {[[30, 30], [290, 210], [40, 200], [300, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={K.grassShade} />)}
        {/* dere: sağda yukarıdan aşağı */}
        <path d="M300 -10Q282 60 296 120T290 250" fill="none" stroke={K.out} stroke-width={26} />
        <path d="M300 -10Q282 60 296 120T290 250" fill="none" stroke={K.water} stroke-width={23} />
        {/* yan kanal: dereden havuza */}
        <path d={`M288 40H200V${py}`} fill="none" stroke={K.out} stroke-width={11} />
        <path d={`M288 40H200V${py}`} fill="none" stroke={K.water} stroke-width={8} />
        {/* havuz */}
        <OG sh={[{ d: rrect(px - 10, py - 10, pw + 20, ph + 20, 10), f: SOIL }, { d: rrect(px, py, pw, ph, 6), f: K.water }]} />
        <path d={`M${px + 30} ${py + 30}h40M${px + 100} ${py + 60}h50M${px + 40} ${py + 84}h30`} stroke={K.waterLight} stroke-width={2.5} stroke-linecap="round" />
        {/* giriş elek sepeti */}
        <OG sh={[{ d: rrect(188, py - 14, 24, 18, 3), f: '#c9d0d8' }]} />
        <path d={`M192 ${py - 14}V${py + 4}M198 ${py - 14}V${py + 4}M204 ${py - 14}V${py + 4}M188 ${py - 6}H212`} stroke={MESH} stroke-width={1.3} />
        {/* taşma kanalı ve ızgara */}
        <path d={`M${px} ${py + ph - 20}H20V250`} fill="none" stroke={K.out} stroke-width={11} />
        <path d={`M${px} ${py + ph - 20}H20V250`} fill="none" stroke={K.water} stroke-width={8} />
        <OG sh={[{ d: rrect(px - 26, py + ph - 32, 16, 24, 2), f: '#c9d0d8' }]} />
        <path d={`M${px - 26} ${py + ph - 26}h16M${px - 26} ${py + ph - 20}h16M${px - 26} ${py + ph - 14}h16M${px - 20} ${py + ph - 32}v24`} stroke={MESH} stroke-width={1.3} />
        <Arrow from={[294, 150]} to={[292, 214]} color="#fff" w={4} />
        <Arrow from={[200, 28]} to={[230, 28]} color="#fff" w={3} head={0.8} />
        <Ok x={200} y={py + 26} r={11} />
        <Ok x={px - 18} y={py + ph + 6} r={11} />
      </Scene2>
    );
  },

  // Balık 8: şafakta balıklar yüzeyde ağız açıp hava yutuyorsa oksijen azdır: yemi kes, taze su ver, karıştır
  'sf-th-balik-oksijen': () => {
    const wl = 140;
    const blade: P = [158, wl + 26];
    const g1: P = [112, 94], g2: P = [126, 112];
    const p: PersonProps = { ...CIF, x: 66, y: wl + 4, s: 0.86, pose: { spine: -70, chest: -60, head: -50, legB: [100, 92], legF: [72, 98], armB: { to: g1 }, armF: { to: g2 }, face: 'worried' } };
    return (
      <Scene2 bg="outdoor" gy={wl}>
        <rect width={320} height={wl - 10} fill="#f6d7b8" />
        <circle cx={250} cy={wl - 20} r={24} fill="#ffd28a" />
        <path d={`M0 ${wl - 22}Q80 ${wl - 40} 160 ${wl - 24}T320 ${wl - 30}V${wl}H0Z`} fill={K.hill} />
        <rect x={0} y={wl} width={320} height={240 - wl} fill={K.water} />
        <OG sh={[{ d: `M-10 ${wl - 6}H100Q118 ${wl - 4} 120 ${wl + 30}L-10 ${wl + 60}Z`, f: SOIL }]} />
        {[[218, -72], [256, -80], [292, -68]].map(([x, a], i) => {
          const m = pol([x, wl + 24], a, 26 * 0.85);
          return (
            <g key={i}>
              <Carp x={x} y={wl + 24} s={0.85} a={a} mouth />
              <ellipse cx={m[0]} cy={wl} rx={9} ry={2.5} fill="none" stroke="#fff" stroke-width={1.5} />
              <circle cx={m[0] + 6} cy={wl - 8} r={2.6} fill="#fff" stroke={K.water} stroke-width={1} />
            </g>
          );
        })}
        <path d={`M140 ${wl + 50}h40M230 ${wl + 70}h50`} stroke={K.waterLight} stroke-width={2.5} stroke-linecap="round" />
        <Person {...p} mid={() => (
          <g>
            <Stick a={pol(g1, angOf(g1, blade), -10)} b={blade} w={2.4} />
            <G x={blade[0]} y={blade[1]} a={angOf(g1, blade) - 90}>
              <OG sh={[{ d: rrect(-8, -6, 16, 26, 6), f: WOOD }]} />
            </G>
          </g>
        )} />
        <Waves x={blade[0] + 18} y={wl + 6} a={0} n={2} r={6} color="#fff" />
        <Warn x={292} y={36} r={18} />
      </Scene2>
    );
  },
};

export const SCENES: Record<string, () => JSX.Element> = {
  ...meyve,
  ...mantar,
  ...tavuk,
  ...hayvan,
  ...ari,
  ...saglik,
  ...otbalik,
};
