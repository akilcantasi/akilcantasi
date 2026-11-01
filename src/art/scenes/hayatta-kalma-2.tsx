// Hayatta kalma — ikinci yarı (barınak brandası, işaret, yiyecek, soğuk/sıcak, dere, hayvan, düğümler).
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Bottle, Campfire, Cloth, Drop, Flame, Hand, K, Label, No, OG, Ok, Person, POSE, Rock,
  Scene2, Tent, Timer, Tree, Water, Waves, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Rig, Sh } from '../kit2';

/* ════════════════════════════ yardımcılar ════════════════════════════ */

const G = ({ x, y, s = 1, a = 0, fx = false, children }: { x: number; y: number; s?: number; a?: number; fx?: boolean; children?: ComponentChildren }) => (
  <g transform={`translate(${x} ${y})${a ? ` rotate(${a})` : ''} scale(${fx ? -s : s} ${s})`}>{children}</g>
);
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const addP = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];

/* ─────────── oyuncular (rehber başına sabit; rehber içinde değişmez) ─────────── */
/** barınak, işaret, soğuk gece: at kuyruklu kadın (ortak "whistle-signal" sahnesiyle aynı) — hayatta-kalma-1.tsx'te de aynı */
const KAMP = { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.dark, skin: 1, bottomC: K.pants.dark } as const;
/** yabani yiyecek: kahverengi saçlı açık tenli adam */
const YIY = { who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown, bottomC: K.pants.denim } as const;
/** sıcak: açık renkli uzun kollu giysili, geniş şapkalı adam */
const SIC = { who: 'man', role: 'helper', top: '#ece4cf', sleeve: 'long', skin: 1, hairC: K.hair.dark, bottomC: K.pants.khaki } as const;
/** dere geçme: kahverengi saçlı adam, kiremit sırt çantası */
const DERE = { who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown, bottomC: K.pants.denim } as const;
/** vahşi hayvan: koyu tenli adam, sırt çantalı */
const HAY = { who: 'man', role: 'helper', skin: 3, hairC: K.hair.black, bottomC: K.pants.khaki } as const;
const PACK = '#c0603e';

/** El bileğini, verilen el noktası (tip/pinch/grip) hedefe gelecek şekilde konumlar. */
function handAt(h: Omit<HandProps, 'x' | 'y'>, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): HandProps {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

/** Güneş (ışınlı). */
function Sun({ x, y, r = 18, hot }: { x: number; y: number; r?: number; hot?: boolean }) {
  const n = 12;
  return (
    <g>
      {hot && <circle cx={x} cy={y} r={r * 1.9} fill="#ffe08a" opacity={0.45} />}
      <g stroke={hot ? '#ff9d2e' : '#ffc23d'} stroke-width={hot ? 4 : 3} stroke-linecap="round">
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2;
          return <line key={i} x1={x + Math.cos(a) * r * 1.3} y1={y + Math.sin(a) * r * 1.3} x2={x + Math.cos(a) * r * (hot ? 1.75 : 1.6)} y2={y + Math.sin(a) * r * (hot ? 1.75 : 1.6)} />;
        })}
      </g>
      <OG sh={[{ d: circ([x, y], r), f: hot ? '#ffb02e' : '#ffd23f' }, { d: circ([x - r * 0.25, y - r * 0.25], r * 0.55), f: hot ? '#ffd257' : '#ffe57a', no: true }]} />
    </g>
  );
}

/** Helikopter (yandan, sola bakar). x,y = gövde merkezi. */
function Heli({ x, y, s = 1, color = '#d84a3a' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-48 -24H48', st: K.out, sw: 3.4 },
          { d: rrect(-2, -24, 4, 8, 1), f: K.out },
          { d: 'M10 -4L58 -8L60 -2L14 6Z', f: shade(color, 0.1) },
          { d: rrect(54, -20, 6, 18, 2), f: shade(color, 0.1) },
          { d: 'M-30 2C-30 -12 -16 -18 0 -18C16 -18 24 -10 24 2C24 12 12 16 -2 16C-20 16 -30 12 -30 2Z', f: color },
          { d: 'M-27 -2C-25 -11 -15 -14 -6 -14V2Z', f: '#bfe3f5', ln: true },
          { d: 'M-22 24H18M-14 16L-16 24M8 16L10 24', st: K.out, sw: 2.6 },
        ]}
      />
    </G>
  );
}

/** Küçük uçak (yandan, sağa doğru yukarı). */
function Plane({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s} a={-10}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-4 -2L-14 -22H-6L10 -2Z', f: '#c9d2da' },
          { d: 'M-30 0C-30 -5 -24 -6 -16 -6H22C30 -6 34 -3 34 0C34 3 30 5 22 5H-22C-28 5 -30 3 -30 0Z', f: '#eef2f5' },
          { d: 'M-30 0L-36 -14H-28L-20 -5Z', f: '#c9d2da' },
          { d: 'M-4 3L-14 20H-6L10 3Z', f: '#b9c3cc' },
        ]}
      />
    </G>
  );
}

/** Boz ayı (yandan, sağa bakar; flip ile sola). x,y = ayakların ortası, zemin. */
function Bear({ x, y, s = 1, flip, color = '#7a5233' }: { x: number; y: number; s?: number; flip?: boolean; color?: string }) {
  const sd = shade(color, 0.22);
  const lt = tint(color, 0.25);
  return (
    <G x={x} y={y} s={s} fx={flip}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([-26, -30], 9, [-30, -3], 7.5), f: sd },
          { d: capsule([20, -30], 8.5, [16, -3], 7), f: sd },
          { d: 'M-46 -30C-48 -52 -30 -62 -6 -60C6 -66 22 -66 32 -56C40 -50 44 -40 42 -30C40 -18 30 -14 14 -16H-30C-42 -16 -46 -22 -46 -30Z', f: color },
          { d: capsule([-36, -28], 9.5, [-38, -3], 8), f: color },
          { d: capsule([28, -30], 9, [30, -3], 7.5), f: color },
          { d: ell([-37, -2.5], 10, 4.5), f: color },
          { d: ell([32, -2.5], 9.5, 4.5), f: color },
          { d: circ([40, -60], 5), f: color },
          { d: 'M30 -52C30 -66 52 -68 58 -56L70 -50C74 -47 72 -42 67 -42L50 -40C38 -38 30 -42 30 -52Z', f: color },
          { d: circ([69.5, -47], 2.8), f: K.ink, no: true },
          { d: circ([50, -54], 1.8), f: K.ink, no: true },
          { d: circ([40, -60], 2.4), f: sd, no: true },
          { d: 'M-6 -60C6 -66 22 -66 32 -56', st: lt, sw: 2.4 },
        ]}
      />
    </G>
  );
}

/** Sokak köpeği (yandan, sağa bakar). bark: ağzı açık + ses çizgileri. */
function Dog({ x, y, s = 1, flip, color = '#c99a5b', bark = true }: { x: number; y: number; s?: number; flip?: boolean; color?: string; bark?: boolean }) {
  const sd = shade(color, 0.22);
  return (
    <G x={x} y={y} s={s} fx={flip}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-30 -34C-38 -40 -44 -50 -40 -56', st: K.out, sw: 7 },
          { d: 'M-30 -34C-38 -40 -44 -50 -40 -56', st: color, sw: 4.4 },
          { d: capsule([-22, -30], 5, [-26, -1], 3.6), f: sd },
          { d: capsule([16, -30], 5, [20, -1], 3.6), f: sd },
          { d: 'M-32 -38C-32 -48 -20 -50 -6 -48H14C24 -50 30 -44 28 -34C26 -24 18 -22 8 -22H-22C-30 -22 -32 -30 -32 -38Z', f: color },
          { d: capsule([-28, -30], 5.5, [-30, -1], 4), f: color },
          { d: capsule([22, -30], 5.5, [26, -1], 4), f: color },
          { d: ell([-28, -1.5], 6, 3), f: color },
          { d: ell([28, -1.5], 6, 3), f: color },
          { d: 'M18 -42C16 -56 28 -62 38 -58L40 -64L44 -56C48 -54 52 -52 56 -50C58 -49 58 -46 56 -45L40 -42C30 -38 20 -36 18 -42Z', f: color },
          ...(bark ? [{ d: 'M40 -43L57 -40L54 -36C48 -34 42 -36 38 -38Z', f: '#fff' } as Sh, { d: 'M42 -42L53 -40L50 -37C47 -36 44 -37 41 -39Z', f: '#b5463b', no: true } as Sh] : []),
          { d: circ([56, -48.5], 2.4), f: K.ink, no: true },
          { d: circ([40, -51], 1.6), f: K.ink, no: true },
          { d: 'M32 -58C30 -52 34 -48 36 -48', st: sd, sw: 2 },
        ]}
      />
      {bark && <Waves x={62} y={-44} a={0} n={2} r={6} color={K.ink} w={2.2} />}
    </G>
  );
}

/** Uzun gövdeli ağaç (yaprakları çerçevenin tepesinde). */
function TallTree({ x, y, top, w = 14, r = 34, c = K.leaf }: { x: number; y: number; top: number; w?: number; r?: number; c?: string }) {
  return (
    <OG
      sh={[
        { d: `M${x - w / 2} ${y}L${x - w * 0.4} ${top}H${x + w * 0.4}L${x + w / 2} ${y}Z`, f: K.trunk },
        { d: `M${x + w * 0.15} ${y}L${x + w * 0.2} ${top}H${x + w * 0.4}L${x + w / 2} ${y}Z`, f: shade(K.trunk, 0.18), no: true },
        { d: circ([x - r * 0.7, top + 4], r * 0.8), f: c },
        { d: circ([x + r * 0.75, top + 2], r * 0.8), f: c },
        { d: circ([x, top - r * 0.45], r), f: c },
        { d: circ([x + r * 0.6, top + r * 0.2], r * 0.55), f: shade(c, 0.16), no: true },
      ]}
    />
  );
}

/** Çalı (yuvarlak öbek). x,y = taban ortası */
function Bush({ x, y, s = 1, c = '#5f9c48' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: circ([-18, -18], 18), f: c },
          { d: circ([18, -18], 18), f: c },
          { d: circ([0, -32], 22), f: c },
          { d: 'M-36 -2H36V0H-36Z', f: c },
          { d: circ([14, -16], 12), f: shade(c, 0.15), no: true },
        ]}
      />
    </G>
  );
}

/** Yaprak döşek: kahverengi/sarı yaprak yığını. x1..x2, y = zemin */
function LeafBed({ x1, x2, y, h = 12 }: { x1: number; x2: number; y: number; h?: number }) {
  const n = Math.round((x2 - x1) / 12);
  const cols = ['#c98a3b', '#a8682e', '#d9a548', '#8f9a3e'];
  return (
    <g>
      <OG sh={[{ d: `M${x1} ${y}C${x1} ${y - h} ${x1 + 10} ${y - h * 1.2} ${(x1 + x2) / 2} ${y - h * 1.2}C${x2 - 10} ${y - h * 1.2} ${x2} ${y - h} ${x2} ${y}Z`, f: '#b07a3a' }]} />
      {Array.from({ length: n }, (_, i) => {
        const cx = x1 + 8 + i * ((x2 - x1 - 16) / Math.max(1, n - 1));
        const cy = y - h * 0.55 - ((i * 7) % 5);
        return <ellipse key={i} cx={cx} cy={cy} rx={6} ry={2.6} transform={`rotate(${(i * 47) % 70 - 35} ${cx} ${cy})`} fill={cols[i % 4]} stroke={K.out} stroke-width={1} />;
      })}
    </g>
  );
}

/** Bere (başın üstüne). */
function Beanie({ r, c = '#c6574e' }: { r: Rig; c?: string }) {
  const [hx, hy] = r.head;
  const R = r.headR;
  return (
    <OG
      sh={[
        { d: `M${hx - R * 1.06} ${hy - R * 0.4}C${hx - R * 1.1} ${hy - R * 1.45} ${hx + R * 1.1} ${hy - R * 1.45} ${hx + R * 1.06} ${hy - R * 0.4}Z`, f: c },
        { d: rrect(hx - R * 1.1, hy - R * 0.7, R * 2.2, R * 0.38, R * 0.15), f: shade(c, 0.15) },
        { d: circ([hx, hy - R * 1.26], R * 0.28), f: tint(c, 0.4) },
      ]}
    />
  );
}

/** Geniş kenarlı şapka + enseyi örten bez (SIC oyuncusu). side: yandan görünüş (sağa bakar). */
function SunHat({ r, side }: { r: Rig; side?: boolean }) {
  const [hx, hy] = r.head;
  const R = r.headR;
  const hat = '#d8c08a';
  if (side) {
    const bx = r.flip ? 1 : -1; // başın arkası
    return (
      <OG sh={[
        { d: `M${hx + bx * R * 0.2} ${hy - R * 0.3}L${hx + bx * R * 1.15} ${hy - R * 0.2}L${hx + bx * R * 1.25} ${hy + R * 1.45}Q${hx + bx * R * 0.85} ${hy + R * 1.55} ${hx + bx * R * 0.55} ${hy + R * 0.9}Z`, f: '#f6f2e8' },
        { d: ell([hx, hy - R * 0.5], R * 2.0, R * 0.36), f: hat },
        { d: `M${hx - R * 0.95} ${hy - R * 0.5}C${hx - R} ${hy - R * 1.7} ${hx + R} ${hy - R * 1.7} ${hx + R * 0.95} ${hy - R * 0.5}Z`, f: hat },
        { d: rrect(hx - R * 0.98, hy - R * 0.85, R * 1.96, R * 0.3, 1), f: '#8a6a3a' },
      ]} />
    );
  }
  return (
    <OG sh={[
      { d: `M${hx - R * 1.02} ${hy - R * 0.3}L${hx - R * 1.2} ${hy + R * 1.5}Q${hx - R * 1.0} ${hy + R * 1.65} ${hx - R * 0.86} ${hy + R * 0.7}Z`, f: '#f6f2e8' },
      { d: `M${hx + R * 1.02} ${hy - R * 0.3}L${hx + R * 1.2} ${hy + R * 1.5}Q${hx + R * 1.0} ${hy + R * 1.65} ${hx + R * 0.86} ${hy + R * 0.7}Z`, f: '#f6f2e8' },
      { d: ell([hx, hy - R * 0.55], R * 2.1, R * 0.4), f: hat },
      { d: `M${hx - R * 0.95} ${hy - R * 0.55}C${hx - R} ${hy - R * 1.75} ${hx + R} ${hy - R * 1.75} ${hx + R * 0.95} ${hy - R * 0.55}Z`, f: hat },
      { d: rrect(hx - R * 0.98, hy - R * 0.9, R * 1.96, R * 0.3, 1), f: '#8a6a3a' },
    ]} />
  );
}

/** Çerçeveli küçük panel (karşılaştırma / ek kare) */
function Card({ x, y, w, h, c = '#fbfaf7' }: { x: number; y: number; w: number; h: number; c?: string }) {
  return <OG sh={[{ d: rrect(x, y, w, h, 10), f: c }]} />;
}

/* ─────────── ip / düğüm çizimi ─────────── */

/** Kalın ip: noktalar boyunca yumuşak yol; layers = [i0, i1] nokta-indeks aralıkları (alttan üste çizim
 *  sırası). split'ten küçük indeksler `c1` (ana ip, mavi), büyükler `c2` (uç, turuncu). cut = görünen son indeks. */
function Rope({ pts, layers, w = 9, split = 1e9, c1 = '#3a7fd0', c2 = K.action, cut, tip, start }: { pts: P[]; layers: [number, number][]; w?: number; split?: number; c1?: string; c2?: string; cut?: number; tip?: boolean; start?: boolean }) {
  const d = smooth(pts);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1];
  const fr = (i: number) => {
    const k = Math.max(0, Math.min(pts.length - 1, i));
    const a = Math.floor(k), b = Math.min(pts.length - 1, a + 1);
    return ((cum[a] + (cum[b] - cum[a]) * (k - a)) / L) * 100;
  };
  const end = cut ?? pts.length - 1;
  const segs: { a: number; b: number; c: string }[] = [];
  for (const [i0, i1] of layers) {
    const a = Math.max(0, i0), b = Math.min(end, i1);
    if (b <= a) continue;
    if (a < split && b > split) {
      segs.push({ a, b: split, c: c1 }, { a: split, b, c: c2 });
    } else segs.push({ a, b, c: a >= split ? c2 : c1 });
  }
  const tp = pts[Math.round(end)];
  const tc = end > split ? c2 : c1;
  const showTip = tip ?? layers.some(([a, b]) => end > a && end <= b);
  return (
    <g fill="none">
      {segs.map((sg, i) => {
        const fa = fr(sg.a), fb = fr(sg.b);
        const da = `0 ${fa.toFixed(2)} ${(fb - fa).toFixed(2)} 300`;
        return (
          <g key={i}>
            <path d={d} pathLength={100} stroke={K.out} stroke-width={w + 3.2} stroke-dasharray={da} />
            <path d={d} pathLength={100} stroke={sg.c} stroke-width={w} stroke-dasharray={da} />
            <path d={d} pathLength={100} stroke={tint(sg.c, 0.35)} stroke-width={w * 0.22} stroke-dasharray={da} transform={`translate(${-w * 0.18} ${-w * 0.18})`} opacity={0.8} />
          </g>
        );
      })}
      {start && <circle cx={pts[0][0]} cy={pts[0][1]} r={w / 2 + 0.2} fill={split <= 0 ? c2 : c1} stroke={K.out} stroke-width={1.6} />}
      {showTip && <circle cx={tp[0]} cy={tp[1]} r={w / 2 + 0.2} fill={tc} stroke={K.out} stroke-width={1.6} />}
    </g>
  );
}

const tf = (pts: P[], ox: number, oy: number, k: number): P[] => pts.map(([x, y]) => [ox + x * k, oy + y * k]);
const tp1 = (q: P, ox: number, oy: number, k: number): P => [ox + q[0] * k, oy + q[1] * k];

/** Aşama numarası (yuvarlak). */
function Step({ x, y, n }: { x: number; y: number; n: number | string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={K.ink} />
      <text x={x} y={y + 4.6} font-size={13} font-weight={700} fill="#fff" text-anchor="middle">{n}</text>
    </g>
  );
}

/* ════════════════════════════ SAHNELER ════════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ───────── barınak ───────── */
  'hayatta-kalma-barinak-branda': () => {
    const R1: P = [52, 122], R2: P = [210, 104], G1: P = [146, 224], G2: P = [282, 194];
    const tarp = '#4f8a6c';
    return (
      <Scene2 bg="outdoor" gy={190}>
        <TallTree x={214} y={194} top={20} w={11} r={28} c="#4f9a48" />
        {/* barınağın altındaki gölge / giriş */}
        <OG sh={[{ d: `M${R1[0]} ${R1[1]}L${R1[0] + 2} 228L${G1[0]} ${G1[1]}Z`, f: '#5b4630' }]} />
        <LeafBed x1={60} x2={130} y={226} h={10} />
        {/* ip */}
        <path d={`M${R1[0] - 4} ${R1[1] + 1}L${R2[0] + 4} ${R2[1] - 1}`} stroke={K.out} stroke-width={4} />
        <path d={`M${R1[0] - 4} ${R1[1] + 1}L${R2[0] + 4} ${R2[1] - 1}`} stroke="#e9d9a8" stroke-width={2} />
        {/* branda */}
        <OG
          sh={[
            { d: `M${R1[0]} ${R1[1]}L${R2[0]} ${R2[1]}L${G2[0]} ${G2[1]}L${G1[0]} ${G1[1]}Z`, f: tarp },
            { d: `M${lerp(R1, R2, 0.5)[0]} ${lerp(R1, R2, 0.5)[1]}L${R2[0]} ${R2[1]}L${G2[0]} ${G2[1]}L${lerp(G1, G2, 0.5)[0]} ${lerp(G1, G2, 0.5)[1]}Z`, f: shade(tarp, 0.12), no: true },
            { d: `M${lerp(R1, R2, 0.5)[0]} ${lerp(R1, R2, 0.5)[1]}L${lerp(G1, G2, 0.5)[0]} ${lerp(G1, G2, 0.5)[1]}`, st: shade(tarp, 0.3), sw: 1.4 },
          ]}
        />
        {/* kazıklar */}
        {[G1, G2].map((g, i) => (
          <OG key={i} sh={[{ d: `M${g[0] + 6} ${g[1] - 6}L${g[0] + 12} ${g[1] + 4}`, st: K.out, sw: 1.6 }, { d: `M${g[0] + 10} ${g[1] - 4}L${g[0] + 14} ${g[1] - 4}L${g[0] + 13} ${g[1] + 8}Z`, f: '#d6b07a' }]} />
        ))}
        <TallTree x={44} y={232} top={14} w={16} r={34} />
        <path d={`M${R1[0] - 8} ${R1[1] - 3}h16M${R1[0] - 8} ${R1[1] + 4}h16`} stroke="#e9d9a8" stroke-width={2.4} />
        {/* rüzgâr */}
        <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round">
          <path d="M312 132q-12 -6 -24 0t-22 2" />
          <path d="M314 160q-12 -6 -24 0t-18 4" />
          <path d="M300 104q-10 -5 -20 0" />
        </g>
        <Arrow from={[300, 182]} to={[262, 160]} w={6} />
      </Scene2>
    );
  },

  'hayatta-kalma-parlak-bez': () => {
    const red = '#ff4a2a';
    // yere serilmiş bez: sağ köşesi kişinin önünde
    const c1: P = [176, 216], c2: P = [190, 206];
    const kn: PersonProps = { ...KAMP, x: 236, y: 228, s: 0.95, flip: true, pose: { ...POSE.kneel, spine: -62, chest: -48, head: -36, legB: [96, 182], legF: [92, 180], armB: { to: c2 }, armF: { to: c1 }, handB: 'flat', handF: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={52} y={222} s={1.35} />
        <OG sh={[{ d: capsule([62, 162], 4, [146, 148], 2.6), f: K.trunk }]} />
        {/* dala asılı bez */}
        <OG
          sh={[
            { d: 'M98 155L134 150L138 202Q128 206 118 202T96 204Z', f: red },
            { d: 'M118 152L134 150L138 202Q128 206 118 202Z', f: shade(red, 0.14), no: true },
            { d: 'M108 156L106 200M124 152L126 200', st: shade(red, 0.3), sw: 1.2 },
          ]}
        />
        <circle cx={99} cy={155} r={3} fill="#e9d9a8" stroke={K.out} />
        <circle cx={134} cy={150} r={3} fill="#e9d9a8" stroke={K.out} />
        {/* yere geniş serilmiş bez */}
        <OG sh={[{ d: `M92 222L172 204L${c2[0] + 8} ${c2[1] + 2}L${c1[0] + 6} ${c1[1] + 6}L106 234Z`, f: red }, { d: `M140 212L172 204L${c2[0] + 8} ${c2[1] + 2}L${c1[0] + 6} ${c1[1] + 6}L150 228Z`, f: shade(red, 0.12), no: true }]} />
        <Person {...kn} />
        <Heli x={226} y={50} s={0.6} />
        <Waves x={194} y={54} a={180} n={2} r={7} color={K.ink} w={2} />
      </Scene2>
    );
  },

  'hayatta-kalma-barinak-bez': () => {
    // Barınağın (branda) hemen yanında, ağaç dalına parlak kırmızı bez asan kişi.
    const red = '#ff4a2a';
    const b1: P = [64, 122], b2: P = [156, 98];
    const c1 = lerp(b1, b2, 0.45), c2 = lerp(b1, b2, 0.8);
    const p: PersonProps = { ...KAMP, x: 186, y: 226, s: 1.0, flip: true, pose: { ...POSE.standSide, head: -100, armB: { to: [c2[0] + 2, c2[1] + 4] }, armF: { to: [c2[0] + 4, c2[1] + 10] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const tarp = '#4f8a6c';
    return (
      <Scene2 bg="outdoor">
        <Tree x={56} y={224} s={1.3} />
        <OG sh={[{ d: capsule(b1, 4.4, b2, 2.6), f: K.trunk }]} />
        {/* dala asılı bez */}
        <OG
          sh={[
            { d: `M${c1[0]} ${c1[1] + 2}L${c2[0]} ${c2[1] + 2}L${c2[0] + 4} ${c2[1] + 62}Q${(c1[0] + c2[0]) / 2} ${c2[1] + 70} ${c1[0] - 2} ${c1[1] + 62}Z`, f: red },
            { d: `M${(c1[0] + c2[0]) / 2} ${(c1[1] + c2[1]) / 2 + 2}L${c2[0]} ${c2[1] + 2}L${c2[0] + 4} ${c2[1] + 62}Q${(c1[0] + c2[0]) / 2 + 8} ${c2[1] + 68} ${(c1[0] + c2[0]) / 2} ${(c1[1] + c2[1]) / 2 + 66}Z`, f: shade(red, 0.14), no: true },
          ]}
        />
        {/* branda barınak */}
        <OG sh={[
          { d: 'M222 214L262 140L306 214Z', f: tarp },
          { d: 'M262 140L306 214H284Z', f: shade(tarp, 0.14), no: true },
          { d: 'M240 214L262 172L276 214Z', f: '#2e3b2c' },
        ]} />
        <Person {...p} />
        <Heli x={250} y={44} s={0.5} />
      </Scene2>
    );
  },

  /* ───────── işaret ───────── */
  'hayatta-kalma-yer-isareti': () => {
    const A: P = [140, 214], L: P = [76, 30], Rr: P = [204, 30];
    const arm = (from: P, to: P, k: number) =>
      Array.from({ length: 8 }, (_, i) => {
        const p = lerp(from, to, (i + 0.5) / 8);
        const ang = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
        if ((i + k) % 2) return <OG key={i} sh={[{ d: ell([0, 0], 12, 9), f: K.rock, t: `translate(${p[0]} ${p[1]}) rotate(${ang + i * 13})` }, { d: ell([3, 2], 6, 4), f: shade(K.rock, 0.12), no: true, t: `translate(${p[0]} ${p[1]}) rotate(${ang})` }]} />;
        return <OG key={i} sh={[{ d: capsule([-13, 0], 4.6, [13, 0], 4), f: '#9b6a40', t: `translate(${p[0]} ${p[1]}) rotate(${ang + 4})` }]} />;
      });
    // ölçü oku: sağ kolun dışına paralel
    const dir: P = [Rr[0] - A[0], Rr[1] - A[1]];
    const len = Math.hypot(dir[0], dir[1]);
    const nrm: P = [-dir[1] / len, dir[0] / len];
    const off = -24;
    const m1: P = [A[0] - nrm[0] * off, A[1] - nrm[1] * off];
    const m2: P = [Rr[0] - nrm[0] * off, Rr[1] - nrm[1] * off];
    const mid = lerp(m1, m2, 0.5);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.grass} />
        {[[30, 30], [270, 30], [300, 120], [40, 120], [120, 120], [180, 200], [20, 200]].map(([gx, gy], i) => (
          <path key={i} d={`M${gx} ${gy}l3 -7l2 7l3 -6l1 6`} fill="none" stroke={K.grassShade} stroke-width={1.8} stroke-linecap="round" />
        ))}
        {arm(A, L, 0)}
        {arm(A, Rr, 1)}
        <Arrow from={mid} to={lerp(mid, m2, 0.92)} w={4} />
        <Arrow from={mid} to={lerp(mid, m1, 0.92)} w={4} />
        <Label x={mid[0] + 30} y={mid[1] + 2} text="3 m" size={15} />
      </Scene2>
    );
  },

  'hayatta-kalma-ayna': () => {
    const base: PersonProps = { ...KAMP, x: 84, y: 92, ax: 'head', ay: 'head', s: 1.65, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(base);
    const R = r0.headR;
    const eye: P = [r0.head[0] + R * 0.5, r0.head[1] - R * 0.08];
    const mirror: P = [eye[0] + R * 0.75, eye[1] + R * 0.35];
    const aim: P = [290, 38];
    const ul = Math.hypot(aim[0] - mirror[0], aim[1] - mirror[1]);
    const u0: P = [(aim[0] - mirror[0]) / ul, (aim[1] - mirror[1]) / ul];
    // uzanan kol: yumruk ışın çizgisinin hemen altında, iki parmak V yapıp ışını aralarına alıyor
    const fistT: P = [mirror[0] + u0[0] * 78 - u0[1] * -9, mirror[1] + u0[1] * 78 + u0[0] * -9];
    const p: PersonProps = {
      ...base,
      pose: { ...base.pose, armB: { to: [mirror[0] - 2, mirror[1] + 12], bend: 1 }, armF: { to: fistT }, handB: 'fist', handF: 'fist' },
    };
    const r = rig(p);
    const sk = K.skin[KAMP.skin];
    // V'nin ortası, gerçek yumruk konumuna göre; ışın aynadan V'nin ortasından geçip uçağa gider
    const vMid: P = [r.handF[0] + u0[0] * 14 + u0[1] * 8, r.handF[1] + u0[1] * 14 - u0[0] * 8];
    const dl = Math.hypot(vMid[0] - mirror[0], vMid[1] - mirror[1]);
    const u: P = [(vMid[0] - mirror[0]) / dl, (vMid[1] - mirror[1]) / dl];
    const n: P = [-u[1], u[0]];
    const k = Math.min((280 - mirror[0]) / u[0], (34 - mirror[1]) / u[1]);
    const plane: P = [mirror[0] + u[0] * k, mirror[1] + u[1] * k];
    const tip = (o: number): P => [vMid[0] + u[0] * 4 + n[0] * o, vMid[1] + u[1] * 4 + n[1] * o];
    const beam = `M${mirror[0]} ${mirror[1] - 2}L${plane[0] - 14} ${plane[1] - 9}L${plane[0] - 12} ${plane[1] + 9}L${mirror[0]} ${mirror[1] + 2}Z`;
    return (
      <Scene2 bg="outdoor">
        <Sun x={30} y={32} r={15} />
        <Plane x={plane[0]} y={plane[1]} s={0.5} />
        <Person {...p} mid={() => (
          <OG sh={[{ d: rrect(-6, -11, 12, 22, 2.5), f: '#a3adb8', t: `translate(${mirror[0]} ${mirror[1]}) rotate(-25)` }, { d: rrect(-4, -9, 8, 18, 1.5), f: '#e8f7fd', t: `translate(${mirror[0]} ${mirror[1]}) rotate(-25)` }]} />
        )} over={() => (
          <g>
            <path d={beam} fill={K.action} opacity={0.6} />
            <OG sh={[
              { d: capsule(r.handF, 4.2, tip(-9), 3.4), f: sk },
              { d: capsule(r.handF, 4.2, tip(9), 3.4), f: sk },
            ]} />
          </g>
        )} />
      </Scene2>
    );
  },

  'hayatta-kalma-helikopter-y': () => (
    <Scene2 bg="outdoor">
      <Heli x={196} y={46} s={0.8} />
      <Person {...KAMP} x={104} y={228} s={1.05} pose={{ view: 'front', armB: [-118, -120], armF: [-62, -60], legB: [96, 92], legF: [84, 88], face: 'speak' }} />
      <Card x={206} y={122} w={104} h={104} />
      <Person x={236} y={214} s={0.42} who="woman" role="bystander" shadow={false} pose={{ view: 'front', armB: [-100, -96], armF: [80, 86], legB: [92, 90], legF: [88, 90] }} />
      <Person x={282} y={214} s={0.42} who="man" role="bystander2" shadow={false} pose={{ ...POSE.wave }} />
      <No x={258} y={174} r={44} />
    </Scene2>
  ),

  /* ───────── yiyecek / öncelik ───────── */
  'hayatta-kalma-oncelik-sirasi': () => {
    const cx = [42, 122, 202, 280];
    const sc = (i: number, k: number, ch: ComponentChildren) => <g transform={`translate(${cx[i]} 140) scale(${k}) translate(${-cx[i]} -140)`}>{ch}</g>;
    return (
      <Scene2 bg="closeup">
        {sc(0, 1.2, <g>
          <OG sh={[{ d: 'M32 98V92Q32 88 36 88H48Q52 88 52 92V98', st: K.out, sw: 3.4 }, { d: rrect(14, 96, 56, 44, 6), f: '#fbfaf7' }, { d: rrect(14, 96, 56, 8, 5), f: '#e2e2de' }]} />
          <path d="M48 106A14 14 0 1 0 48 132A11 11 0 1 1 48 106Z" fill={K.red} stroke={K.out} stroke-width={1.2} />
        </g>)}
        {sc(1, 1.15, <g>
          <Tent x={116} y={140} s={0.68} color="#4f8a6c" />
          <Flame x={148} y={142} s={0.6} />
        </g>)}
        {sc(2, 1.2, <g>
          <Bottle x={192} y={142} s={1.05} fill={0.75} />
          <Drop x={216} y={116} s={1.8} />
        </g>)}
        {sc(3, 1.0, <g>
          <OG sh={[{ d: 'M270 140C262 140 258 132 260 126C262 120 268 118 272 121C276 118 282 120 284 126C286 132 282 140 274 140Z', f: '#d9473a' }, { d: 'M272 121Q272 114 276 112', st: K.out, sw: 1.6 }, { d: ell([279, 114], 4, 2), f: K.leaf }]} />
          <OG sh={[{ d: 'M286 140V126C286 120 304 120 304 126V140Z', f: '#d9a35a' }, { d: 'M290 126H300', st: shade('#d9a35a', 0.3), sw: 1.2 }]} />
        </g>)}
        {[0, 1, 2].map((i) => <Arrow key={i} from={[cx[i] + 18, 186]} to={[cx[i + 1] - 18, 186]} w={5} />)}
        {cx.map((x, i) => <Step key={i} x={x} y={186} n={i + 1} />)}
      </Scene2>
    );
  },

  'hayatta-kalma-mantar-yasak': () => {
    const mush = (x: number, y: number, s: number, cap: string, dots: boolean, wide = 1) => (
      <G x={x} y={y} s={s}>
        <OG ow={1.5 / s} sh={[
          { d: 'M-6 0C-7 -10 -6 -20 -4 -26H4C6 -20 7 -10 6 0Z', f: '#f3ead6' },
          { d: `M${-22 * wide} -22C${-22 * wide} -40 ${22 * wide} -40 ${22 * wide} -22C${10 * wide} -26 ${-10 * wide} -26 ${-22 * wide} -22Z`, f: cap },
          { d: `M${6 * wide} -36C${16 * wide} -34 ${22 * wide} -28 ${22 * wide} -22C${16 * wide} -24 ${10 * wide} -25 ${6 * wide} -25Z`, f: shade(cap, 0.15), no: true },
        ]} />
        {dots && <g fill="#fff">{[[-12, -30], [0, -34], [10, -29], [-4, -27]].map(([a, b], i) => <circle key={i} cx={a * wide} cy={b} r={2.4} />)}</g>}
      </G>
    );
    return (
      <Scene2 bg="closeup">
        <path d="M0 196Q80 186 160 194T320 192V240H0Z" fill="#7a5a3c" />
        <path d="M0 196Q80 186 160 194T320 192" fill="none" stroke={K.out} stroke-width={1.5} />
        {[[20, 216], [150, 226], [196, 212], [110, 234], [60, 230]].map(([lx, ly], i) => <ellipse key={i} cx={lx} cy={ly} rx={9} ry={3.5} fill={['#c98a3b', '#a8682e', '#d9a548', '#8f9a3e', '#c98a3b'][i]} stroke={K.out} stroke-width={1} transform={`rotate(${i * 30 - 30} ${lx} ${ly})`} />)}
        {/* yabani mantarlar */}
        {mush(46, 214, 1.25, '#c9a36a', false, 0.8)}
        {mush(152, 212, 1.3, '#f0ecdf', false, 1.1)}
        {mush(100, 206, 2.1, '#e04436', true)}
        <No x={100} y={160} r={68} />
        {/* tavada pişen mantar da zehirli */}
        <Campfire x={262} y={232} s={0.8} />
        <OG sh={[{ d: capsule([206, 196], 3, [228, 198], 3), f: '#3b3f4b' }, { d: 'M226 194H298Q298 206 286 208H238Q226 206 226 194Z', f: '#3b3f4b' }, { d: ell([262, 194], 36, 5), f: '#555b68' }]} />
        {[[246, 192], [262, 190], [278, 193]].map(([mx, my], i) => <path key={i} d={`M${mx - 8} ${my}C${mx - 8} ${my - 10} ${mx + 8} ${my - 10} ${mx + 8} ${my}Z`} fill={i === 1 ? '#e04436' : '#c9a36a'} stroke={K.out} stroke-width={1.2} />)}
        <g fill="none" stroke="#c4ccd4" stroke-width={2.4} stroke-linecap="round"><path d="M250 176c-4-6 3-9 0-15M270 174c-4-6 3-9 0-15" /></g>
        <No x={262} y={182} r={40} />
      </Scene2>
    );
  },

  'hayatta-kalma-bitki-yasak': () => {
    // Yakın plan: çalıdan kopardığı tanımadığı meyveyi ağzına götüren el; üstünde yasak işareti.
    const p: PersonProps = { ...YIY, x: 222, y: 92, ax: 'head', ay: 'head', s: 2.3, flip: true, pose: { ...POSE.standSide, head: -94, face: 'neutral' } };
    const r = rig(p);
    const berry: P = [r.mouth[0] - 16, r.mouth[1] + 4];
    const h = handAt({ a: -40, s: 0.9, pose: 'pinch', side: 'L', view: 'back', skin: YIY.skin, arm: 220, sleeve: K.role.helper }, 'pinch', berry);
    const berries: [number, number, string][] = [[34, 92, '#8e24aa'], [48, 102, '#d81b60'], [30, 112, '#8e24aa'], [74, 140, '#d81b60'], [86, 150, '#8e24aa'], [62, 156, '#d81b60'], [104, 104, '#8e24aa'], [26, 176, '#d81b60'], [44, 190, '#8e24aa'], [96, 196, '#d81b60']];
    return (
      <Scene2 bg="outdoor">
        <OG sh={[
          { d: circ([36, 120], 52), f: '#4f9a48' },
          { d: circ([90, 150], 42), f: '#4f9a48' },
          { d: circ([30, 200], 48), f: '#4f9a48' },
          { d: circ([88, 214], 36), f: shade('#4f9a48', 0.12) },
        ]} />
        {[[16, 80, 30], [66, 96, -20], [104, 140, 40], [56, 196, -40], [96, 180, 10], [10, 150, 70]].map(([lx, ly, la], i) => (
          <path key={i} d={`M${lx} ${ly}q10 -10 22 0q-10 10 -22 0z`} fill={tint('#4f9a48', 0.25)} stroke={K.out} stroke-width={1.2} transform={`rotate(${la} ${lx} ${ly})`} />
        ))}
        {berries.map(([bx, by, bc], i) => <g key={i}><circle cx={bx} cy={by} r={6} fill={bc} stroke={K.out} stroke-width={1.4} /><circle cx={bx - 2} cy={by - 2} r={1.6} fill="#fff" opacity={0.8} /></g>)}
        <Person {...p} only={['torso', 'head']} />
        <Hand {...h} />
        <circle cx={berry[0]} cy={berry[1]} r={7} fill="#8e24aa" stroke={K.out} stroke-width={1.4} />
        <circle cx={berry[0] - 2} cy={berry[1] - 2} r={1.8} fill="#fff" opacity={0.8} />
        <No x={berry[0] - 2} y={berry[1] + 6} r={34} />
      </Scene2>
    );
  },
  /* ───────── soğuk gece ───────── */
  'hayatta-kalma-katman-giyin': () => {
    const shell = K.role.helper, fleece = '#6c9c5a', glove = '#3b3f4b';
    const base: PersonProps = { ...KAMP, x: 100, y: 230, s: 1.15, sleeve: 'long', pose: { ...POSE.stand, face: 'neutral' } };
    const r0 = rig(base);
    const zipTop: P = [r0.neck[0], r0.neck[1] + 10 * r0.s];
    const zipPull: P = [r0.neck[0], r0.neck[1] + 34 * r0.s];
    const hem: P = [r0.hip[0], r0.hip[1] - 2];
    const p: PersonProps = { ...base, pose: { ...POSE.stand, armF: { to: [zipPull[0] + 3, zipPull[1] + 2] }, armB: { to: [hem[0] - 4, hem[1] - 6] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const shirt = (x: number, y: number, c: string, n: number) => (
      <g>
        <OG sh={[
          { d: `M${x - 18} ${y - 26}L${x - 8} ${y - 30}Q${x} ${y - 25} ${x + 8} ${y - 30}L${x + 18} ${y - 26}L${x + 30} ${y + 6}L${x + 22} ${y + 9}L${x + 15} ${y - 10}V${y + 22}H${x - 15}V${y - 10}L${x - 22} ${y + 9}L${x - 30} ${y + 6}Z`, f: c },
          { d: `M${x + 4} ${y - 26}L${x + 18} ${y - 26}L${x + 15} ${y - 10}V${y + 22}H${x + 4}Z`, f: shade(c, 0.12), no: true },
        ]} />
        <Step x={x} y={y + 2} n={n} />
      </g>
    );
    const drops = [[40, 30], [150, 24], [200, 60], [260, 34], [300, 70], [20, 90], [176, 110], [230, 196], [290, 150], [60, 64], [130, 70], [16, 160]];
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <rect width={320} height={130} fill="#9aa7b4" opacity={0.75} />
        {/* bulutlar */}
        <OG sh={[{ d: smooth([[150, 40], [170, 18], [200, 14], [222, 26], [250, 20], [276, 34], [270, 52], [160, 54]], true), f: '#8a96a3' }, { d: smooth([[-10, 30], [20, 6], [60, 8], [90, 26], [80, 44], [-10, 46]], true), f: '#7f8b98' }]} />
        <Tree x={292} y={200} kind="pine" s={0.8} />
        {drops.map(([x, y], i) => <path key={i} d={`M${x} ${y}l-3 9`} stroke="#3d7fc4" stroke-width={2.2} stroke-linecap="round" />)}
        <Person {...p}
          back={(rr) => (
            // kapüşon (başın arkasında, omuzlarda)
            <OG sh={[{ d: `M${rr.neck[0] - 20 * rr.s} ${rr.neck[1] + 4}Q${rr.neck[0] - 24 * rr.s} ${rr.head[1] - 6} ${rr.neck[0]} ${rr.head[1] - 2}Q${rr.neck[0] + 24 * rr.s} ${rr.head[1] - 6} ${rr.neck[0] + 20 * rr.s} ${rr.neck[1] + 4}Z`, f: shade(shell, 0.15) }]} />
          )}
          mid={(rr) => (
            <g>
              {/* açık yaka: altta polar, ortada fermuar */}
              <OG sh={[{ d: `M${zipTop[0] - 7} ${rr.neck[1] + 2}H${zipTop[0] + 7}L${zipPull[0] + 2} ${zipPull[1]}H${zipPull[0] - 2}Z`, f: fleece }]} />
              <path d={`M${zipPull[0]} ${zipPull[1]}V${hem[1] - 2}`} stroke={K.ink} stroke-width={1.6} stroke-dasharray="2 2" />
              <OG sh={[{ d: rrect(zipPull[0] - 2.5, zipPull[1] - 1, 5, 8, 1.5), f: K.metal }]} />
              {/* atkı */}
              <OG sh={[{ d: rrect(rr.neck[0] - 15, rr.neck[1] - 6, 30, 10, 5), f: '#e8b33a' }]} />
              <Beanie r={rr} c="#c6574e" />
            </g>
          )}
          over={(rr) => <OG sh={[{ d: circ(rr.handB, 6.5), f: glove }, { d: circ(rr.handF, 6.5), f: glove }]} />}
        />
        <Arrow from={[zipPull[0] + 36, zipPull[1] + 34]} to={[zipPull[0] + 36, zipPull[1] - 6]} w={5} />
        {/* katmanlar: içlik, polar, yağmurluk */}
        {shirt(196, 104, '#eef0f2', 1)}
        {shirt(228, 132, fleece, 2)}
        {shirt(260, 160, shell, 3)}
        <Ok x={292} y={96} r={14} />
      </Scene2>
    );
  },

  'hayatta-kalma-folyo-battaniye': () => {
    const p: PersonProps = { ...KAMP, x: 150, y: 224, s: 1.55, pose: { spine: -80, chest: -76, head: -84, legB: [-40, 66], legF: [-34, 70], armB: { at: 'kneeB', d: [-4, 6] }, armF: { at: 'kneeF', d: [-6, 8] }, footB: 0, footF: 0, face: 'neutral' } };
    const r = rig(p);
    const foil = K.foil;
    const pts: P[] = [
      [r.neck[0] + 9, r.neck[1] - 3], [r.chest[0] + 6, r.chest[1] + 2], addP(r.kneeF, [-2, -12]), addP(r.kneeF, [12, -4]),
      addP(r.ankleF, [14, 2]), [r.toeF[0] + 6, 224], [r.hip[0] - 24, 224], addP(r.back, [-14, 4]), [r.neck[0] - 12, r.neck[1] - 2],
    ];
    const d = smooth(pts, true, 0.9);
    const spark = (x: number, y: number, k = 1) => <path d={`M${x} ${y - 7 * k}L${x + 1.8 * k} ${y - 1.8 * k}L${x + 7 * k} ${y}L${x + 1.8 * k} ${y + 1.8 * k}L${x} ${y + 7 * k}L${x - 1.8 * k} ${y + 1.8 * k}L${x - 7 * k} ${y}L${x - 1.8 * k} ${y - 1.8 * k}Z`} fill="#fff" />;
    return (
      <Scene2 bg="night">
        <Tree x={40} y={204} kind="pine" s={1.1} color="#24584a" />
        <Tree x={286} y={204} kind="pine" s={0.9} color="#24584a" />
        <LeafBed x1={66} x2={276} y={230} h={14} />
        <Person {...p} over={() => (
          <g>
            <OG sh={[
              { d, f: foil },
              { d: `M${r.chest[0] - 4} ${r.chest[1] + 10}Q${r.hip[0] + 6} ${r.hip[1] - 10} ${r.hip[0] - 4} 220`, st: shade(foil, 0.25), sw: 1.6 },
              { d: `M${r.kneeF[0] - 6} ${r.kneeF[1]}Q${r.kneeF[0] - 2} ${r.kneeF[1] + 30} ${r.kneeF[0] + 4} 220`, st: shade(foil, 0.25), sw: 1.6 },
              { d: `M${r.back[0] - 8} ${r.back[1] + 10}Q${r.back[0] - 12} ${r.back[1] + 40} ${r.hip[0] - 16} 218`, st: '#ffffff', sw: 2.4 },
            ]} />
            {/* bere */}
            <Beanie r={r} c="#c6574e" />
          </g>
        )} />
        {spark(r.kneeF[0] + 4, r.kneeF[1] - 4, 1.1)}
        {spark(r.chest[0] - 6, r.chest[1] + 26, 0.8)}
        {spark(r.back[0] - 16, r.back[1] + 34, 0.9)}
        {spark(r.kneeF[0] + 34, r.kneeF[1] - 26, 0.7)}
      </Scene2>
    );
  },

  'hayatta-kalma-sokulma': () => {
    // Yukarıdan: barınağın yaprak döşeğinde yan yana sokulmuş iki kişi, ikisinin üstünde tek battaniye.
    const loc = (cx: number, cy: number, p: P): P => [cx + p[1] - 150, cy - (p[0] - 160)];
    const mk = (pp: PersonProps, cx: number, cy: number) => (
      <g transform={`translate(${cx} ${cy}) rotate(-90) translate(-160 -150)`}>
        <Person {...pp} x={160} y={230} s={1.4} shadow={false} only={['torso', 'head', 'armB', 'armF']} />
      </g>
    );
    const A: PersonProps = { ...KAMP, x: 160, y: 230, pose: { ...POSE.stand, face: 'closed' } };
    const B: PersonProps = { x: 160, y: 230, who: 'man', role: 'bystander', hairC: K.hair.black, skin: 2, pose: { ...POSE.stand, face: 'closed' } };
    const ra = rig({ ...A, s: 1.4 });
    const neck = loc(206, 84, ra.neck);
    const bl = '#b5503f';
    const bx = neck[0] + 6;
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#2f3a2c" />
        {/* barınağın iki yan duvarı (yukarıdan dal sırası) */}
        <OG sh={[{ d: rrect(20, 26, 280, 12, 5), f: K.trunk }, { d: rrect(20, 204, 280, 12, 5), f: K.trunk }]} />
        {[40, 80, 120, 160, 200, 240, 280].map((x, i) => <g key={i}><path d={`M${x} 32l10 -10M${x} 210l10 10`} stroke="#5a8f4a" stroke-width={4} stroke-linecap="round" /></g>)}
        {/* yaprak döşek */}
        <OG sh={[{ d: rrect(18, 46, 290, 152, 18), f: '#a8743c' }]} />
        {Array.from({ length: 26 }, (_, i) => {
          const lx = 28 + ((i * 47) % 270), ly = 54 + ((i * 29) % 136);
          return <ellipse key={i} cx={lx} cy={ly} rx={8} ry={3.2} fill={['#c98a3b', '#8f9a3e', '#d9a548', '#b0662e'][i % 4]} stroke={K.out} stroke-width={0.8} transform={`rotate(${(i * 53) % 180} ${lx} ${ly})`} />;
        })}
        {mk(A, 206, 84)}
        {mk(B, 206, 158)}
        {/* ortak battaniye: boyundan ayaklara, iki kişiyi birden örtüyor */}
        <OG sh={[
          { d: `M${bx} 48Q${bx - 8} 123 ${bx} 198H288Q300 198 300 186V60Q300 48 288 48Z`, f: bl },
          { d: `M${bx + 70} 52V190M${bx + 140} 52V190`, st: shade(bl, 0.25), sw: 1.6 },
          { d: `M${bx} 121H298`, st: shade(bl, 0.18), sw: 1.2 },
        ]} />
      </Scene2>
    );
  },

  /* ───────── sıcak ───────── */
  'hayatta-kalma-sicak-saat': () => {
    const rockC = '#b98a5e';
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={196}>
        <Sun x={196} y={44} r={20} hot />
        {/* kaya çıkıntısı ve gölge */}
        <ellipse cx={92} cy={222} rx={80} ry={12} fill="#7d6040" opacity={0.55} />
        <OG sh={[
          { d: 'M8 230L10 150C14 110 40 92 80 94C120 96 156 110 166 128C170 136 162 140 150 138C130 134 100 132 74 140C56 146 48 168 50 230Z', f: rockC },
          { d: 'M74 140C100 132 130 134 150 138C162 140 170 136 166 128C150 132 110 124 74 132Z', f: shade(rockC, 0.2), no: true },
          { d: 'M30 110C46 100 70 98 90 102', st: tint(rockC, 0.3), sw: 2.4 },
        ]} />
        <Person {...SIC} x={98} y={224} s={0.95} pose={{ ...POSE.sitFloor, spine: -78, legB: [-14, 70], legF: [-4, 20], armB: { at: 'kneeB', d: [0, 4] }, armF: { floor: 10 }, face: 'neutral' }} over={(r) => <SunHat r={r} side />} />
        <Backpack x={52} y={186} s={0.85} a={-8} />
        {/* güneşte yürüyen küçük figür */}
        <Person {...SIC} x={262} y={210} s={0.55} pose={{ ...POSE.walk, face: 'pain' }} over={(r) => <SunHat r={r} side />} />
        <No x={262} y={166} r={36} />
        <Timer x={26} y={30} r={14} text="10–16" />
      </Scene2>
    );
  },

  'hayatta-kalma-golgelik': () => {
    const tarp = '#f1ead8';
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Sun x={160} y={26} r={14} hot />
        <Bush x={40} y={226} s={1.5} c="#7a9a4a" />
        <Bush x={284} y={226} s={1.5} c="#7a9a4a" />
        <ellipse cx={162} cy={228} rx={98} ry={9} fill="#7d6040" opacity={0.45} />
        {/* direkler (dal) ve gergi ipleri: branda iki direğe bağlı, ipler çalılara/taşlara gergin */}
        <path d="M62 84L14 196M258 80L306 196" stroke="#e6d6a8" stroke-width={2} />
        <OG sh={[{ d: capsule([62, 230], 3.2, [62, 80], 2.8), f: K.trunk }, { d: capsule([258, 230], 3.2, [258, 76], 2.8), f: K.trunk }]} />
        <OG sh={[
          { d: 'M60 78Q160 96 262 74L266 86Q160 108 58 90Z', f: tarp },
          { d: 'M160 90Q210 88 262 74L266 86Q214 100 160 102Z', f: shade(tarp, 0.1), no: true },
        ]} />
        <Backpack x={166} y={182} s={1.0} color="#4f7fb0" />
        <Person {...SIC} x={160} y={226} s={0.95} pose={{ ...POSE.sitChair, armB: [70, 10], armF: [66, 6], face: 'neutral' }} over={(r) => <SunHat r={r} side />} />
        <Arrow from={[16, 116]} to={[78, 116]} w={4} color={K.waterLight} />
        <Arrow from={[244, 116]} to={[304, 116]} w={4} color={K.waterLight} />
        <Arrow from={[96, 108]} to={[226, 108]} w={4} color={K.waterLight} />
      </Scene2>
    );
  },

  'hayatta-kalma-sicak-ortu': () => {
    const p: PersonProps = { ...SIC, x: 104, y: 228, s: 1.18, pose: { ...POSE.stand, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Sun x={292} y={30} r={15} hot />
        <Person {...p} over={(r) => <SunHat r={r} />} />
        <Ok x={160} y={60} r={15} />
        <Person x={250} y={226} s={0.8} who="man" top="#ec8f7a" sleeve="none" skin={SIC.skin} hairC={SIC.hairC} bottom="shorts" bottomC={K.pants.khaki} pose={{ ...POSE.stand, face: 'pain' }} />
        <No x={250} y={162} r={50} />
      </Scene2>
    );
  },

  'hayatta-kalma-islak-bez': () => {
    const p: PersonProps = { ...SIC, x: 166, y: 104, ax: 'head', ay: 'head', s: 2.4, pose: { ...POSE.standSide, head: -86, face: 'neutral' } };
    const r = rig(p);
    const cl: P = [r.head[0] - r.headR * 0.95, r.head[1] + r.headR * 0.55];
    const h = handAt({ a: 20, s: 0.85, pose: 'press', side: 'R', view: 'back', skin: SIC.skin, arm: 200, sleeve: SIC.top }, 'palm', [cl[0] - 6, cl[1] + 2]);
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <Cloth x={cl[0]} y={cl[1]} w={44} h={70} a={14} wet />
        <Hand {...h} />
        <Drop x={cl[0] + 18} y={cl[1] + 50} s={0.8} />
        <Drop x={cl[0] + 26} y={cl[1] + 70} s={0.6} />
        <Bottle x={282} y={226} s={1.3} fill={0.18} />
      </Scene2>
    );
  },

  /* ───────── dere ───────── */
  'hayatta-kalma-dere-geri-don': () => {
    const foam = (x: number, y: number, w: number) => <path d={`M${x} ${y}q${w / 6} -6 ${w / 3} 0t${w / 3} 0t${w / 3} 0`} fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />;
    return (
      <Scene2 bg="outdoor">
        {/* uzaktaki köprü */}
        <rect x={0} y={178} width={90} height={7} fill={K.water} opacity={0.7} />
        <OG sh={[{ d: 'M18 182Q44 162 70 182', st: '#8a5a3a', sw: 4 }, { d: 'M20 172H68', st: '#8a5a3a', sw: 2 }, { d: 'M28 172V178M44 168V172M60 172V178', st: '#8a5a3a', sw: 1.6 }]} />
        <Water x={186} y={204} w={140} h={40} />
        {foam(196, 214, 40)}
        {foam(250, 224, 50)}
        {foam(210, 234, 36)}
        <g fill="#fff" stroke={K.out} stroke-width={1}>
          <circle cx={204} cy={206} r={5} /><circle cx={214} cy={203} r={4} /><circle cx={286} cy={208} r={5} /><circle cx={296} cy={205} r={3.5} />
        </g>
        <Rock x={192} y={216} s={0.6} />
        <Person {...DERE} x={128} y={224} s={1.1} flip pose={{ ...POSE.walk, face: 'neutral' }} back={(r) => <Backpack x={r.back[0] + 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} flip color={PACK} />} />
        <No x={250} y={160} r={32} />
        <Arrow from={[96, 116]} to={[40, 140]} w={7} color={K.safe} bend={-0.15} />
      </Scene2>
    );
  },
  'hayatta-kalma-dere-diz': () => {
    const panel = (cx: number, deep: boolean) => {
      const p: PersonProps = { ...DERE, x: cx, y: 226, s: 0.98, pose: { ...POSE.standSide, face: deep ? 'worried' : 'neutral' } };
      const r = rig(p);
      const knee = (r.kneeB[1] + r.kneeF[1]) / 2;
      const wy = deep ? knee - 26 : knee + 16;
      const x0 = cx - 78, x1 = cx + 78;
      let top = `M${x0} ${wy}`;
      for (let x = x0; x < x1; x += 16) top += `q4 ${deep ? -5 : -2.5} 8 0t8 0`;
      return (
        <g>
          <Person {...p} shadow={false} back={(rr) => <Backpack x={rr.back[0] - 9 * rr.s} y={rr.neck[1] + 6 * rr.s} s={rr.s} color={PACK} />} />
          <path d={`${top}V240H${x0}Z`} fill={K.water} opacity={0.78} />
          <path d={top} fill="none" stroke={K.out} stroke-width={1.5} />
          {deep ? (
            <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round">
              <path d={`M${x0 + 8} ${wy + 14}h30M${x0 + 20} ${wy + 30}h36M${x1 - 50} ${wy + 18}h40M${x1 - 40} ${wy + 38}h30`} />
              <circle cx={cx - 22} cy={wy - 2} r={4} /><circle cx={cx + 26} cy={wy - 3} r={5} /><circle cx={cx + 36} cy={wy - 1} r={3} />
            </g>
          ) : (
            <path d={`M${x0 + 12} ${wy + 16}h18M${x1 - 34} ${wy + 24}h18`} stroke={K.waterLight} stroke-width={2.4} stroke-linecap="round" />
          )}
          <path d={`M${x0 + 4} ${knee}H${x1 - 4}`} stroke={K.ink} stroke-width={2.2} stroke-dasharray="7 5" />
        </g>
      );
    };
    return (
      <Scene2 bg="outdoor">
        {panel(80, false)}
        {panel(240, true)}
        <rect x={158} y={0} width={4} height={240} fill="#fff" />
        <Ok x={140} y={30} r={15} />
        <No x={292} y={36} r={22} />
      </Scene2>
    );
  },

  'hayatta-kalma-dere-kemer': () => {
    const p: PersonProps = { ...DERE, x: 160, y: 4, ax: 'neck', ay: 'neck', s: 2.7, pose: { ...POSE.stand } };
    const r = rig(p);
    const strap = '#3b3f4b';
    const cx = r.neck[0];
    const chestY = r.neck[1] + 54;
    const hipY = r.hip[1] - 22;
    const shL = r.shoulderB, shR = r.shoulderF;
    const sx1 = shL[0] + 14, sx2 = shR[0] - 14;
    const buckle = (y: number, h: number, gap: number) => (
      <OG sh={[
        { d: rrect(cx - gap / 2 - 22, y - h / 2, 22, h, 3), f: '#2b2d3a' },
        { d: rrect(cx + gap / 2, y - h / 2, 22, h, 3), f: '#2b2d3a' },
        { d: rrect(cx - gap / 2 - 8, y - h / 2 + 3, 10, h - 6, 2), f: '#5b6070', ln: true },
      ]} />
    );
    const hL = handAt({ a: 20, s: 1.0, pose: 'pinch', side: 'L', skin: DERE.skin, arm: 200, sleeve: K.role.helper }, 'pinch', [cx - 26, chestY + 2]);
    const hR = handAt({ a: -20, s: 1.0, pose: 'pinch', side: 'R', skin: DERE.skin, arm: 200, sleeve: K.role.helper }, 'pinch', [cx + 30, hipY + 2]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(shL[0] - 30, -10, shR[0] - shL[0] + 60, 200, 14), f: PACK }]} />
        <Person {...p} only={['torso']} />
        <OG sh={[
          { d: `M${sx1 - 8} ${r.neck[1]}L${sx1 + 8} ${r.neck[1]}L${sx1 + 2} ${hipY}L${sx1 - 14} ${hipY}Z`, f: strap },
          { d: `M${sx2 - 8} ${r.neck[1]}L${sx2 + 8} ${r.neck[1]}L${sx2 + 14} ${hipY}L${sx2 - 2} ${hipY}Z`, f: strap },
          { d: rrect(sx1 - 6, chestY - 6, cx - sx1 - 4, 12, 3), f: strap },
          { d: rrect(cx + 10, chestY - 6, sx2 - cx - 4, 12, 3), f: strap },
          { d: rrect(r.hip[0] - 120, hipY - 12, 82, 24, 5), f: strap },
          { d: rrect(r.hip[0] + 38, hipY - 12, 82, 24, 5), f: strap },
        ]} />
        {buckle(chestY, 16, 16)}
        {buckle(hipY, 30, 20)}
        <Arrow from={[cx - 4, chestY - 22]} to={[cx - 36, chestY - 22]} w={5} />
        <Arrow from={[cx + 4, chestY - 22]} to={[cx + 36, chestY - 22]} w={5} />
        <Arrow from={[cx - 4, hipY - 34]} to={[cx - 40, hipY - 34]} w={5} />
        <Arrow from={[cx + 4, hipY - 34]} to={[cx + 40, hipY - 34]} w={5} />
        <Hand {...hL} />
        <Hand {...hR} />
      </Scene2>
    );
  },

  'hayatta-kalma-dere-sopa': () => {
    // Akıntı soldan sağa. Kişi yüzü akıntının geldiği yöne (sola) dönük; sopa önünde, yukarı akışta.
    const stickBot: P = [92, 186], stickTop: P = [112, 82];
    const grip1: P = lerp(stickBot, stickTop, 0.72), grip2: P = lerp(stickBot, stickTop, 0.52);
    const p: PersonProps = { ...DERE, x: 172, y: 196, s: 1.1, flip: true, pose: { spine: -80, chest: -76, head: -84, legB: [102, 92], legF: [76, 98], armF: { to: grip1 }, armB: { to: grip2 }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.water} />
        <path d="M0 0H320V50Q240 58 160 52T0 54Z" fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <Tree x={40} y={40} kind="pine" s={0.36} />
        <Tree x={290} y={42} kind="pine" s={0.4} />
        <path d="M0 220Q100 212 200 220T320 216V240H0Z" fill={K.dirt} stroke={K.out} stroke-width={1.5} />
        <g stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.7}>
          <path d="M20 100h26M60 150h30M250 96h34M262 150h26M20 196h30M226 200h30" />
        </g>
        <Arrow from={[10, 76]} to={[66, 76]} w={5} color="#1f5fa8" />
        <Arrow from={[10, 124]} to={[60, 124]} w={5} color="#1f5fa8" />
        <Arrow from={[262, 132]} to={[310, 132]} w={5} color="#1f5fa8" />
        <ellipse cx={stickBot[0]} cy={stickBot[1]} rx={12} ry={4} fill="none" stroke="#fff" stroke-width={2} />
        <Person {...p} back={(r) => <Backpack x={r.back[0] + 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s} flip color={PACK} />} mid={() => (
          <OG sh={[{ d: `M${stickBot[0]} ${stickBot[1]}L${stickTop[0]} ${stickTop[1]}`, st: K.out, sw: 7.5 }, { d: `M${stickBot[0]} ${stickBot[1]}L${stickTop[0]} ${stickTop[1]}`, st: '#9b6a40', sw: 4.5 }]} />
        )} />
        <path d="M120 180Q172 172 222 182L222 200Q172 206 120 196Z" fill={K.water} opacity={0.6} />
        <ellipse cx={172} cy={192} rx={40} ry={7} fill="none" stroke="#fff" stroke-width={2} opacity={0.9} />
        {/* yan adımlarla karşı kıyıya (akıntıya dik) */}
        <Arrow from={[222, 176]} to={[222, 66]} w={6} />
        <Arrow from={[244, 176]} to={[244, 90]} w={4} />
      </Scene2>
    );
  },

  'hayatta-kalma-dere-dusme': () => {
    const p: PersonProps = { ...DERE, x: 150, y: 178, s: 1.1, shadow: false, pose: { ...POSE.lieBack, spine: 188, chest: 190, head: 198, legB: [-6, -6], legF: [-3, -3], armB: [10, 8], armF: [14, 12], face: 'worried' } };
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.water} />
        <path d="M0 0H320V56Q240 64 160 58T0 60Z" fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <Tree x={250} y={44} kind="pine" s={0.42} />
        <Tree x={290} y={46} kind="leaf" s={0.38} />
        <g stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.7}>
          <path d="M20 100h26M40 210h30M100 220h34M200 214h26M20 140h20M120 90h26" />
        </g>
        <Arrow from={[16, 120]} to={[64, 120]} w={4} color="#1f5fa8" />
        <Arrow from={[150, 212]} to={[200, 212]} w={4} color="#1f5fa8" />
        <Person {...p} />
        <path d="M56 166Q160 156 266 160L268 190Q160 196 54 190Z" fill={K.water} opacity={0.82} />
        <path d="M56 166Q90 160 118 164M150 160Q200 156 250 158" fill="none" stroke="#fff" stroke-width={2.6} stroke-linecap="round" />
        <Rock x={286} y={174} s={0.75} color="#8e8c86" />
        <Rock x={304} y={150} s={0.5} color="#8e8c86" />
        <Arrow from={[164, 128]} to={[226, 70]} w={7} />
      </Scene2>
    );
  },

  /* ───────── vahşi hayvan ───────── */
  'hayatta-kalma-hayvan-kosma-yasak': () => (
    <Scene2 bg="outdoor">
      <Tree x={300} y={170} kind="pine" s={0.7} />
      <Tree x={226} y={168} kind="pine" s={0.55} />
      <path d="M0 236Q120 214 240 196T320 186V178Q260 182 200 194T0 222Z" fill={K.dirt} />
      <Bear x={274} y={190} s={0.48} flip />
      <Person {...HAY} x={74} y={226} s={0.95} flip pose={{ ...POSE.run, face: 'worried' }} back={(r) => <Backpack x={r.back[0] + 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s} flip color={PACK} />} />
      <No x={74} y={150} r={52} />
      <Person {...HAY} x={186} y={220} s={0.95} pose={{ view: 'front', armB: [118, 112], armF: [62, 68], legB: [94, 90], legF: [86, 90], face: 'neutral' }} back={(r) => <OG sh={[{ d: rrect(r.shoulderB[0] + 2, r.shoulderB[1] - 10, r.shoulderF[0] - r.shoulderB[0] - 4, 50, 10), f: PACK }]} />} />
      <Ok x={222} y={62} r={15} />
    </Scene2>
  ),

  'hayatta-kalma-ayi-geri-cekil': () => {
    // Kişi ayıya (sağa) dönük; arka ayağı geride, ayıdan uzaklaşarak yan-geri adım.
    const p: PersonProps = { ...HAY, x: 132, y: 226, s: 1.08, pose: { spine: -94, chest: -94, head: -90, armB: [100, 96], armF: [80, 84], legB: [124, 106], legF: [88, 90], footB: 12, face: 'speak' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={182} kind="pine" s={0.85} />
        <Tree x={208} y={180} kind="pine" s={0.6} />
        <path d="M0 236Q120 220 220 204T320 196V186Q240 190 180 202T0 226Z" fill={K.dirt} />
        <Bear x={262} y={200} s={0.62} flip />
        <Person {...p} back={(rr) => <Backpack x={rr.back[0] - 9 * rr.s} y={rr.neck[1] + 6 * rr.s} s={rr.s} color={PACK} />} />
        <Waves x={r.mouth[0] + 8} y={r.mouth[1]} a={0} n={2} r={5} color={K.ink} w={2} />
        <Arrow from={[r.toeB[0] - 4, 214]} to={[34, 232]} w={6} bend={-0.2} />
      </Scene2>
    );
  },

  'hayatta-kalma-ayi-yuzustu': () => {
    const shirt = K.role.helper, pants = HAY.bottomC, sk = K.skin[HAY.skin];
    const head: P = [56, 150];
    const shU: P = [92, 124], shD: P = [92, 176];
    const elU: P = [62, 102], elD: P = [62, 198];
    const hand: P = [80, 150];
    const hipU: P = [168, 138], hipD: P = [168, 162];
    const ftU: P = [236, 104], ftD: P = [236, 200];
    const knU = lerp(hipU, ftU, 0.5), knD = lerp(hipD, ftD, 0.5);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.grass} />
        {[[30, 40], [140, 60], [200, 30], [110, 220], [280, 220], [20, 210], [290, 130]].map(([gx, gy], i) => (
          <path key={i} d={`M${gx} ${gy}l3 -7l2 7l3 -6l1 6`} fill="none" stroke={K.grassShade} stroke-width={1.8} stroke-linecap="round" />
        ))}
        <Bear x={272} y={66} s={0.62} flip />
        <OG sh={[
          { d: capsule(hipU, 10, knU, 8.6), f: pants },
          { d: capsule(knU, 8.6, ftU, 7), f: pants },
          { d: capsule(hipD, 10, knD, 8.6), f: pants },
          { d: capsule(knD, 8.6, ftD, 7), f: pants },
          { d: ell([ftU[0] + 6, ftU[1] - 4], 10, 6.5), f: K.shoe, t: `rotate(-36 ${ftU[0] + 6} ${ftU[1] - 4})` },
          { d: ell([ftD[0] + 6, ftD[1] + 4], 10, 6.5), f: K.shoe, t: `rotate(36 ${ftD[0] + 6} ${ftD[1] + 4})` },
          { d: `M${shU[0] - 4} ${shU[1] - 4}C${shU[0] + 30} ${shU[1] - 8} ${hipU[0]} ${hipU[1] - 12} ${hipU[0] + 6} ${hipU[1] - 2}V${hipD[1] + 2}C${hipD[0]} ${hipD[1] + 12} ${shD[0] + 30} ${shD[1] + 8} ${shD[0] - 4} ${shD[1] + 4}C${shD[0] - 14} ${shD[1]} ${shU[0] - 14} ${shU[1]} ${shU[0] - 4} ${shU[1] - 4}Z`, f: shirt },
        ]} />
        {/* çanta sırtta */}
        <OG sh={[
          { d: rrect(100, 126, 56, 48, 8), f: PACK },
          { d: rrect(104, 130, 22, 40, 6), f: shade(PACK, 0.15) },
          { d: rrect(132, 136, 18, 28, 4), f: tint(PACK, 0.15), ln: true },
        ]} />
        {/* baş (arkadan) ve kollar */}
        <OG sh={[
          { d: circ([head[0] + 1, head[1] - 15], 3.6), f: sk },
          { d: circ([head[0] + 1, head[1] + 15], 3.6), f: sk },
          { d: circ(head, 16), f: HAY.hairC },
          { d: capsule(shU, 7, elU, 5.6), f: shirt },
          { d: capsule(elU, 5.6, hand, 4.6), f: sk },
          { d: capsule(shD, 7, elD, 5.6), f: shirt },
          { d: capsule(elD, 5.6, hand, 4.6), f: sk },
          { d: ell([hand[0] - 2, hand[1] - 5], 7, 6), f: sk },
          { d: ell([hand[0] - 2, hand[1] + 5], 7, 6), f: sk },
          { d: `M${hand[0] - 8} ${hand[1]}H${hand[0] + 4}M${hand[0] - 6} ${hand[1] - 4}l4 4l-4 4`, st: shade(sk, 0.35), sw: 1.2 },
        ]} />
        <Arrow from={[20, 92]} to={[64, 136]} w={5} />
        <Arrow from={[188, 120]} to={[214, 96]} w={5} />
        <Arrow from={[188, 180]} to={[214, 204]} w={5} />
      </Scene2>
    );
  },

  'hayatta-kalma-kopek-dur': () => {
    const base: PersonProps = { ...HAY, x: 160, y: 222, s: 1.12, pose: { ...POSE.stand, head: -104, face: 'neutral' } };
    const r0 = rig(base);
    const p: PersonProps = { ...base, pose: { ...base.pose, armB: { to: [r0.shoulderF[0] - 6, r0.shoulderF[1] + 22], bend: -1 }, armF: { to: [r0.shoulderB[0] + 6, r0.shoulderB[1] + 28], bend: 1 } }, back: (r) => <OG sh={[{ d: rrect(r.shoulderB[0] + 2, r.shoulderB[1] - 10, r.shoulderF[0] - r.shoulderB[0] - 4, 50, 10), f: PACK }]} /> };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Dog x={232} y={206} s={0.6} flip color="#8a7a6a" />
        <Person {...p} />
        <Dog x={58} y={232} s={0.95} color="#c99a5b" />
        <Dog x={266} y={234} s={0.85} flip color="#3b3537" />
        <Ok x={214} y={56} r={14} />
        <Card x={12} y={12} w={62} h={76} />
        <Person {...HAY} x={43} y={82} s={0.38} shadow={false} pose={{ ...POSE.run, face: 'worried' }} />
        <No x={43} y={50} r={26} />
      </Scene2>
    );
  },
  // Ortak 'flush-water-15' ile aynı fikir; kol bu rehberin oyuncusuna (HAY) ait: koyu ten, camgöbeği kol.
  'hayatta-kalma-isirik-yika': () => {
    const m = '#b7c1cb';
    const fx = 150, fy = 82, fs = 1.1, flowTo = 152;
    return (
      <Scene2 bg="closeup">
        <path d={`M${fx - 7 * fs} ${fy}Q${fx - 8 * fs} ${(fy + flowTo) / 2} ${fx - 10 * fs} ${flowTo}H${fx + 10 * fs}Q${fx + 8 * fs} ${(fy + flowTo) / 2} ${fx + 7 * fs} ${fy}Z`} fill={K.waterLight} stroke={K.out} stroke-width={1.3} opacity={0.95} />
        <path d={`M${fx - 2 * fs} ${fy + 8}V${flowTo - 8}`} stroke="#fff" stroke-width={2} opacity={0.8} stroke-linecap="round" />
        <g transform={`translate(${fx} ${fy}) scale(${fs})`}>
          <OG ow={1.5 / fs} sh={[
            { d: rrect(-200, -46, 150, 18, 4), f: m },
            { d: 'M-56 -46H-6Q12 -46 12 -28V0H-12V-22H-56Z', f: m },
            { d: rrect(-15, -6, 30, 8, 2), f: shade(m, 0.15) },
            { d: rrect(-42, -64, 16, 20, 3), f: shade(m, 0.1) },
            { d: rrect(-52, -70, 36, 8, 4), f: K.danger },
            { d: 'M-50 -40H-12', st: '#fff', sw: 3 },
          ]} />
        </g>
        <Hand x={104} y={164} a={-86} s={1.0} pose="open" side="R" view="palm" arm={260} skin={HAY.skin} />
        {/* sıvanmış kol: su çıplak cilde akıyor */}
        <OG sh={[{ d: capsule([246, 174], 14, [350, 181], 14), f: K.role.helper }]} />
        <g fill="none" stroke={K.waterLight} stroke-width={3} stroke-linecap="round">
          <path d="M136 182q-6 10 -8 22M166 182q8 10 8 24" />
        </g>
        {/* sabun */}
        <OG sh={[{ d: rrect(206, 206, 44, 20, 8), f: '#f3e7b3' }, { d: 'M214 212H240', st: '#fff', sw: 2.4 }]} />
        <Drop x={124} y={212} s={0.9} />
        <Drop x={178} y={218} s={0.8} />
        <Timer x={238} y={46} r={15} text="15 dk" />
      </Scene2>
    );
  },

  /* ───────── düğümler ───────── */
  'hayatta-kalma-dugum-sekiz': () => {
    const L: P[] = [[50, 178], [50, 140], [52, 110], [66, 82], [60, 58], [40, 52], [26, 68], [34, 96], [52, 112], [70, 128], [68, 148], [50, 152], [30, 144], [26, 120], [36, 92], [46, 78], [52, 40], [55, 20]];
    const layers: [number, number][] = [[9.5, 12.5], [15, 17], [0, 7.5], [7.5, 9.5], [12.5, 15]];
    const k = 0.95, oy = 18;
    const cuts = [9, 13, 17];
    const cxs = [58, 160, 262];
    return (
      <Scene2 bg="closeup">
        {cxs.map((cx, i) => {
          const ox = cx - 50 * k;
          const T = (q: P) => tp1(q, ox, oy, k);
          return (
            <g key={i}>
              <Rope pts={tf(L, ox, oy, k)} layers={layers} split={5} cut={cuts[i]} w={9} />
              {i === 0 && <Arrow from={T([84, 134])} to={T([18, 150])} bend={-0.45} w={3.5} />}
              {i === 1 && <Arrow from={T([12, 124])} to={T([38, 68])} bend={-0.3} w={3.5} />}
              {i === 2 && <Arrow from={T([66, 26])} to={T([72, 0])} w={3.5} />}
              <Step x={cx} y={222} n={i + 1} />
            </g>
          );
        })}
      </Scene2>
    );
  },

  'hayatta-kalma-dugum-izbarco': () => {
    const L: P[] = [[50, -6], [50, 30], [50, 58], [38, 78], [42, 104], [62, 112], [80, 96], [78, 72], [62, 60], [34, 58], [18, 80], [14, 130], [36, 170], [70, 172], [90, 146], [80, 124], [67, 90], [66, 56], [64, 34], [58, 18], [46, 16], [34, 24], [34, 42], [44, 76], [52, 94], [54, 130]];
    // Alttan üste çizim sırası. Doğru izbarço: küçük halkada uca giden kol ana ipin ÜSTÜNDE; uç halkadan
    // alttan girer (alt kenarın altından, üst kenarın üstünden), ana ipin ARKASINDAN dolanır, aynı halkadan
    // önden girip arkadan çıkar (üst kenarın üstünden, alt kenarın altından): iki uç kolu paralel.
    const layers: [number, number][] = [[23.2, 25], [18.5, 21], [15, 16.2], [3.2, 5], [6.5, 8.2], [8.65, 15], [0, 1.5], [1.5, 3.2], [5, 6.5], [8.2, 8.65], [16.2, 18.5], [21, 23.2]];
    const k = 0.8, oy = 26;
    const cuts = [15, 18, 22, 25];
    const cxs = [42, 121, 200, 279];
    return (
      <Scene2 bg="closeup">
        {cxs.map((cx, i) => {
          const ox = cx - 52 * k;
          const T = (q: P) => tp1(q, ox, oy, k);
          return (
            <g key={i}>
              <Rope pts={tf(L, ox, oy, k)} layers={layers} split={13} cut={cuts[i]} w={7.5} />
              {i === 0 && <Arrow from={T([96, 120])} to={T([70, 76])} bend={0.3} w={3.2} />}
              {i === 1 && <Arrow from={T([74, 26])} to={T([22, 18])} bend={0.6} w={3.2} />}
              {i === 2 && <Arrow from={T([22, 46])} to={T([46, 96])} bend={0.25} w={3.2} />}
              {i === 3 && <Arrow from={T([50, 182])} to={T([50, 206])} w={3.2} />}
              <Step x={cx} y={222} n={i + 1} />
            </g>
          );
        })}
      </Scene2>
    );
  },

  'hayatta-kalma-dugum-camadan': () => {
    // Doğrulanmış geometri: kapatılmış düğümün kesişim sırası/üst-alt bilgisinden burulma (writhe) hesaplandı;
    // aşağıdaki üst-alt düzeni kare düğüm (camadan) verir, tek tip alternatif düzen ise kocakarı düğümü verir.
    // İç içe iki kıvrım: mavi kıvrım turuncunun iki kolunun üstünde, mavinin iki kolu turuncu kıvrımın
    // üstünde, ortadaki iki kesişimde turuncu üstte. Doğru: iki kısa uç da üst yanda. Yanlış: aynı düğüm,
    // kısa uçlar ters yanlarda (hırsız düğümü) — yük altında kayar.
    const blue = '#3a7fd0';
    const body: P[] = [[-40, -6], [-15, -6], [0, -9], [12, -13], [22, -9], [25, 0], [22, 9], [12, 13], [0, 9], [-15, 6], [-40, 6]];
    const legs = (topLen: number, botLen: number): P[] => [[-topLen, -6], ...body, [-botLen, 6]];
    const k = 2.3;
    const reef = (oy: number, blueTailTop: boolean) => {
      const R = (pts: P[], c: string, layers: [number, number][], start = false, tip = false) => (
        <Rope pts={tf(pts, 160, oy, k)} layers={layers} c1={c} c2={c} w={11} tip={tip} start={start} />
      );
      const o = legs(48, 120);
      const b = (blueTailTop ? legs(48, 120) : legs(120, 48)).map(([x, y]) => [-x, y] as P);
      return (
        <g>
          {R(o, K.action, [[0, 2.3], [4.2, 7.8], [9.7, 12]], true, false)}
          {R(b, blue, [[2.3, 4.2], [7.8, 9.7]])}
          {R(b, blue, [[0, 2.3], [4.2, 7.8], [9.7, 12]], blueTailTop, !blueTailTop)}
          {R(o, K.action, [[2.3, 4.2], [7.8, 9.7]])}
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        {reef(70, true)}
        <Ok x={290} y={30} r={14} />
        <line x1={20} y1={122} x2={300} y2={122} stroke="#c9ced6" stroke-width={2} stroke-dasharray="6 6" />
        {reef(178, false)}
        <Bad x={290} y={140} r={14} />
      </Scene2>
    );
  },

  'hayatta-kalma-dugum-iskota': () => {
    const blue = '#3a7fd0';
    const BL: P[] = [[-80, -16], [-30, -16], [10, -16], [28, -11], [34, 0], [28, 11], [10, 16], [-30, 16], [-80, 16]];
    const OR: P[] = [[84, 4], [56, 4], [34, 2], [16, 2], [4, -4], [-10, -16], [-14, -30], [-30, -34], [-40, -18], [-42, 0], [-38, 18], [-28, 32], [-14, 26], [-10, 14], [-6, 0], [4, -16], [8, -30], [10, -40]];
    const cuts = [4, 12, 17];
    const ys = [46, 122, 196];
    return (
      <Scene2 bg="closeup">
        {ys.map((y, i) => {
          const ox = 178, k = 0.95;
          const T = (q: P) => tp1(q, ox, y, k);
          const bl = tf(BL, ox, y, k), or = tf(OR, ox, y, k);
          return (
            <g key={i}>
              <Rope pts={or} layers={[[0, 2.6]]} c1={K.action} c2={K.action} w={5.5} cut={cuts[i]} tip={false} />
              <Rope pts={or} layers={[[7, 11]]} c1={K.action} c2={K.action} w={5.5} cut={cuts[i]} />
              <Rope pts={bl} layers={[[0, 8]]} c1={blue} c2={blue} w={12} tip start />
              <Rope pts={or} layers={[[11, 17]]} c1={K.action} c2={K.action} w={5.5} cut={cuts[i]} />
              <Rope pts={or} layers={[[2.6, 7]]} c1={K.action} c2={K.action} w={5.5} cut={cuts[i]} />
              {i === 0 && <Arrow from={T([10, -12])} to={T([-6, -40])} bend={0.2} w={3.2} />}
              {i === 1 && <Arrow from={T([-22, 34])} to={T([2, -20])} bend={-0.25} w={3.2} />}
              {i === 2 && <Arrow from={T([90, 4])} to={T([118, 4])} w={3.2} />}
              {i === 2 && <Arrow from={T([-86, 0])} to={T([-114, 0])} w={3.2} />}
              <Step x={24} y={y} n={i + 1} />
            </g>
          );
        })}
      </Scene2>
    );
  },

  'hayatta-kalma-dugum-kazik': () => {
    const L: P[] = [[38, 8], [24, 8], [-20, 8], [-25, 11], [0, 15], [25, 19], [10, 10], [-10, -10], [-25, -21], [0, -16], [25, -10], [14, -8], [-20, -8], [-36, -8]];
    const cuts = [8, 13];
    const cxs = [78, 228];
    const wood = '#b98a5e';
    return (
      <Scene2 bg="closeup">
        {cxs.map((cx, i) => {
          const k = 1.5, cy = 112;
          const pts = tf(L, cx, cy, k);
          const T = (q: P) => tp1(q, cx, cy, k);
          const post = (
            <OG sh={[
              { d: rrect(cx - 20 * k, 16, 40 * k, 214, 6), f: wood },
              { d: rrect(cx + 6 * k, 16, 14 * k, 214, 6), f: shade(wood, 0.14), no: true },
              { d: `M${cx - 8 * k} 40V80M${cx - 12 * k} 150V200M${cx + 2 * k} 90V130`, st: shade(wood, 0.3), sw: 1.4 },
            ]} />
          );
          return (
            <g key={i}>
              <Rope pts={pts} layers={[[2, 5], [8, 10]]} split={8} cut={cuts[i]} w={10} tip={false} />
              {post}
              <Rope pts={pts} layers={[[0, 2]]} split={8} cut={cuts[i]} w={10} />
              <Rope pts={pts} layers={[[10, 13]]} split={8} cut={cuts[i]} w={10} />
              <Rope pts={pts} layers={[[5, 8]]} split={8} cut={cuts[i]} w={10} />
              {i === 0 && <Arrow from={T([-34, -32])} to={T([34, -14])} bend={-0.35} w={3.4} />}
              {i === 1 && <Arrow from={T([-41, -8])} to={T([-52, -8])} w={3.4} />}
              {i === 1 && <Arrow from={T([43, 8])} to={T([54, 8])} w={3.4} />}
              <Step x={cx} y={222} n={i + 1} />
            </g>
          );
        })}
      </Scene2>
    );
  },
};
