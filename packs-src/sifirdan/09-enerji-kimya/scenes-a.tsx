// Sıfırdan paketi sahneleri (a): basit makineler, su ve rüzgâr gücü, elektrik + kategori kapakları.
// Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { JSX } from 'preact';
import {
  Scene2, Person, POSE, K, OG, Arrow, Label, Ok, Bad, No, Hand, Tree, Water, Waves, Flame, Timer,
  smooth, capsule, rrect, ell, circ, shade, tint,
} from '../../../src/art/kit2';
import type { PersonProps, P } from '../../../src/art/kit2';

/* ═══════════════ Oyuncu kadrosu (rehber içinde aynı kişi) ═══════════════ */
const CAST = {
  /** kaldıraç, rampa: usta */
  usta: { who: 'man', role: 'helper', skin: 1, hair: 'short', hairC: K.hair.dark, mustache: true, bottomC: K.pants.khaki } as const,
  /** kaldıraç takoz, çamaşır, zir: Ayşe */
  ayse: { who: 'woman', role: 'bystander3', skin: 2, hair: 'scarf', hairC: '#b5584a', sleeve: 'long', bottomC: K.pants.navy } as const,
  /** palanga, rampa, rüzgâr türbini: Can */
  can: { who: 'man', role: 'bystander2', skin: 2, hair: 'short', hairC: K.hair.black, bottomC: K.pants.grey } as const,
  /** palanga emniyet, sarkaç: Elif */
  elif: { who: 'woman', role: 'bystander', skin: 0, hair: 'ponytail', hairC: K.hair.auburn } as const,
  /** bocurgat, su değirmeni: Dede */
  dede: { who: 'oldman', role: 'bystander4' } as const,
  /** su çarkı, pompalar, mikro hidro: Mert */
  mert: { who: 'man', role: 'helper', skin: 3, hair: 'short', hairC: K.hair.black, bottomC: K.pants.dark } as const,
  /** elektrik rehberleri (el yakın planları): Deniz */
  deniz: { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.dark } as const,
};

/* ═══════════════ Paket malzeme renkleri ═══════════════ */
const ROPE = '#d9b36c';
const WOOD = K.wood;
const IRON = '#7f8a97';
const STONE = K.rock;
const CLAY = '#c8744a';
const SAND = '#b98d55';
const WET = '#8a6337';
const PLUS = '#d63b35'; // artı kablo
const MINUS = '#26262e'; // eksi kablo
const BLUE = '#2f6fd0'; // ölçü (kuvvet kolu)

/* ═══════════════ Yardımcılar ═══════════════ */
const f1 = (n: number) => Math.round(n * 10) / 10;
const pl = (pts: P[]) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
const rad = (a: number) => (a * Math.PI) / 180;
const onC = (c: P, r: number, a: number): P => [c[0] + r * Math.cos(rad(a)), c[1] + r * Math.sin(rad(a))];

/** Dış hatlı çizgi (ip, kablo, boru, çubuk) */
function Ln({ d, c, w = 4, dash, out = true }: { d: string; c: string; w?: number; dash?: string; out?: boolean }) {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      {out && <path d={d} stroke={K.out} stroke-width={w + 3} />}
      <path d={d} stroke={c} stroke-width={w} stroke-dasharray={dash} />
    </g>
  );
}
const Rope = ({ pts, w = 3.2 }: { pts: P[]; w?: number }) => <Ln d={pl(pts)} c={ROPE} w={w} />;

/** Düz yazı (beyaz haleli) */
function T({ x, y, t, s = 13, c = K.ink, a = 'middle', w = 700 }: { x: number; y: number; t: string; s?: number; c?: string; a?: 'start' | 'middle' | 'end'; w?: number }) {
  return (
    <text x={x} y={y} font-size={s} font-weight={w} fill={c} text-anchor={a} stroke="#fff" stroke-width={3.2} paint-order="stroke" stroke-linejoin="round">
      {t}
    </text>
  );
}

/** Yay ok: merkez c, yarıçap r, a0'dan a1'e (derece; a1 > a0 saat yönü) */
function ArcArrow({ c, r, a0, a1, color = K.action, w = 5 }: { c: P; r: number; a0: number; a1: number; color?: string; w?: number }) {
  const dir = a1 > a0 ? 1 : -1;
  const hl = w * 2.3 + 4;
  const aEnd = a1 - dir * ((hl * 0.6) / r) * (180 / Math.PI);
  const s = onC(c, r, a0), e = onC(c, r, aEnd), tip = onC(c, r, a1);
  const d = `M${f1(s[0])} ${f1(s[1])}A${r} ${r} 0 ${Math.abs(aEnd - a0) > 180 ? 1 : 0} ${dir > 0 ? 1 : 0} ${f1(e[0])} ${f1(e[1])}`;
  const t = rad(a1 + dir * 90 - dir * ((hl * 0.4) / r) * (180 / Math.PI));
  const base: P = [tip[0] - Math.cos(t) * hl * 0.8, tip[1] - Math.sin(t) * hl * 0.8];
  const n: P = [-Math.sin(t) * hl * 0.62, Math.cos(t) * hl * 0.62];
  const hp = `M${f1(tip[0])} ${f1(tip[1])}L${f1(base[0] + n[0])} ${f1(base[1] + n[1])}L${f1(base[0] - n[0])} ${f1(base[1] - n[1])}Z`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={w + 3} />
      <path d={hp} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} fill="none" stroke={color} stroke-width={w} />
      <path d={hp} fill={color} />
    </g>
  );
}

/** Ölçü çizgisi: uçlarda dik çentik, ortada yazı */
function Dim({ a, b, t, c = K.ink, off = [0, 0] as P, s = 13, w = 2.2 }: { a: P; b: P; t: string; c?: string; off?: P; s?: number; w?: number }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const n: P = [-Math.sin(ang) * 5, Math.cos(ang) * 5];
  const d = `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}M${f1(a[0] - n[0])} ${f1(a[1] - n[1])}L${f1(a[0] + n[0])} ${f1(a[1] + n[1])}M${f1(b[0] - n[0])} ${f1(b[1] - n[1])}L${f1(b[0] + n[0])} ${f1(b[1] + n[1])}`;
  return (
    <g>
      <path d={d} stroke="#fff" stroke-width={w + 2.5} stroke-linecap="round" fill="none" />
      <path d={d} stroke={c} stroke-width={w} stroke-linecap="round" fill="none" />
      {t && <T x={(a[0] + b[0]) / 2 + off[0]} y={(a[1] + b[1]) / 2 + off[1]} t={t} s={s} c={c} />}
    </g>
  );
}

/** Ahşap sandık. x = sol, y = taban */
function Crate({ x, y, w = 56, h = 44, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  return (
    <g transform={`rotate(${a} ${x} ${y})`}>
      <OG sh={[{ d: rrect(x, y - h, w, h, 2), f: '#c99a62' }, { d: rrect(x + 3, y - h + 3, w - 6, h - 6, 1), f: 'none', ln: true }]} />
      <path d={`M${x + 3} ${y - 3}L${x + w - 3} ${y - h + 3}M${x} ${y - h / 2}H${x + w}`} stroke={K.out} stroke-width={1.3} />
    </g>
  );
}

/** Kaya/iri taş (yumru). c = merkez */
function Boulder({ c, rx, ry, col = STONE }: { c: P; rx: number; ry: number; col?: string }) {
  const pts: P[] = [[-1, 0.15], [-0.85, -0.55], [-0.35, -0.95], [0.3, -0.98], [0.85, -0.6], [1, 0.1], [0.75, 0.85], [0, 1], [-0.75, 0.85]].map(([u, v]) => [c[0] + u * rx, c[1] + v * ry]);
  const sh: P[] = [[0.3, -0.98], [0.85, -0.6], [1, 0.1], [0.75, 0.85], [0, 1], [0.35, 0.3]].map(([u, v]) => [c[0] + u * rx, c[1] + v * ry]);
  return <OG sh={[{ d: smooth(pts, true), f: col }, { d: smooth(sh, true), f: shade(col, 0.14), no: true }]} />;
}

/** Makara: c merkez, r yarıçap */
function Sheave({ c, r = 11, col = IRON }: { c: P; r?: number; col?: string }) {
  return <OG sh={[{ d: circ(c, r), f: col }, { d: circ(c, r * 0.62), f: tint(col, 0.25), ln: true }, { d: circ(c, 2.4), f: K.out }]} />;
}

/** Güneş (gökte) */
function Sun({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = onC([x, y], r + 4, i * 45), b = onC([x, y], r + 11, i * 45);
        return <path key={i} d={pl([a, b])} stroke="#f5b400" stroke-width={3} stroke-linecap="round" />;
      })}
      <OG sh={[{ d: circ([x, y], r), f: '#ffd23f' }]} />
    </g>
  );
}

/** Küçük numara rozeti */
function Num({ x, y, n, bg = K.white, r = 8.5 }: { x: number; y: number; n: string; bg?: string; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={bg} stroke={K.out} stroke-width={1.5} />
      <text x={x} y={y + r * 0.42} font-size={r * 1.25} font-weight={700} text-anchor="middle" fill={bg === K.white ? K.ink : '#fff'}>{n}</text>
    </g>
  );
}

/** Toprak testi silueti (zir). cx merkez, top ağız y, bot taban y, w genişlik ölçeği */
function potPts(cx: number, top: number, bot: number, rw: number, bw: number, botw: number): P[] {
  const h = bot - top;
  return [
    [cx - rw, top], [cx - bw, top + h * 0.45], [cx - botw, bot], [cx + botw, bot], [cx + bw, top + h * 0.45], [cx + rw, top],
  ];
}

/** Halka (iç boş) yolu */
const ring = (c: P, r1: number, r2: number) => circ(c, r1) + circ(c, r2);
/** Halka dilimi */
function sector(c: P, r1: number, r2: number, a0: number, a1: number): string {
  const n = 6, pts: P[] = [];
  for (let i = 0; i <= n; i++) pts.push(onC(c, r2, a0 + ((a1 - a0) * i) / n));
  for (let i = n; i >= 0; i--) pts.push(onC(c, r1, a0 + ((a1 - a0) * i) / n));
  return pl(pts) + 'Z';
}

/** Üstten dolan kovalı çark (su sağ yandaki kovalarda, saat yönünde döner) */
function Overshot({ c, r }: { c: P; r: number }) {
  const n = 16, w = r * 0.2;
  return (
    <g>
      <OG sh={[{ d: ring(c, r, r - w), f: WOOD, fr: 'evenodd' }]} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i * 360) / n;
        const full = a >= 290 || a <= 70;
        return (
          <g key={i}>
            {full && <path d={sector(c, r - w + 2, r - w * 0.35, a + 3, a + 360 / n - 3)} fill={K.water} />}
            <path d={pl([onC(c, r - w, a), onC(c, r, a + 8)])} stroke={K.out} stroke-width={1.8} />
          </g>
        );
      })}
      {Array.from({ length: 8 }, (_, i) => <OG key={i} sh={[{ d: capsule(c, 3, onC(c, r - w, i * 45), 2.5), f: shade(WOOD, 0.12) }]} />)}
      <OG sh={[{ d: circ(c, 9), f: IRON }, { d: circ(c, 3), f: K.out }]} />
    </g>
  );
}
/** Alttan çarpan düz kanatlı çark */
function Undershot({ c, r }: { c: P; r: number }) {
  const n = 12;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (i * 360) / n;
        return <OG key={i} sh={[{ d: capsule(onC(c, r - 22, a), 4, onC(c, r + 6, a), 4), f: shade(WOOD, 0.08) }]} />;
      })}
      <OG sh={[{ d: ring(c, r - 14, r - 24), f: WOOD, fr: 'evenodd' }]} />
      {Array.from({ length: 6 }, (_, i) => <OG key={i} sh={[{ d: capsule(c, 3, onC(c, r - 24, i * 60), 2.5), f: shade(WOOD, 0.12) }]} />)}
      <OG sh={[{ d: circ(c, 9), f: IRON }, { d: circ(c, 3), f: K.out }]} />
    </g>
  );
}
/** Çok kanatlı rüzgâr pompası (önden): x,y = kule tabanı ortası */
function Windpump({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const h = 136 * s, c: P = [x, y - h - 6 * s], R = 46 * s;
  return (
    <g>
      <Ln d={pl([[x - 34 * s, y], [x - 6 * s, y - h]])} c={IRON} w={3 * s} />
      <Ln d={pl([[x + 34 * s, y], [x + 6 * s, y - h]])} c={IRON} w={3 * s} />
      {[0.25, 0.5, 0.75].map((t, i) => {
        const yy = y - h * t, hw = 34 * s - 28 * s * t;
        const yy2 = y - h * (t + 0.25), hw2 = 34 * s - 28 * s * (t + 0.25);
        return (
          <g key={i}>
            <Ln d={pl([[x - hw, yy], [x + hw, yy]])} c={IRON} w={1.8 * s} />
            <Ln d={pl([[x - hw, yy], [x + hw2, yy2]])} c={IRON} w={1.4 * s} />
          </g>
        );
      })}
      <OG sh={[{ d: pl([[x + 6 * s, c[1] - 4 * s], [x + 62 * s, c[1] - 26 * s], [x + 66 * s, c[1] + 2 * s], [x + 8 * s, c[1] + 4 * s]]) + 'Z', f: '#e9e4d6' }]} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = i * 22.5;
        return <OG key={i} sh={[{ d: pl([onC(c, 10 * s, a - 5), onC(c, R, a - 8), onC(c, R, a + 8), onC(c, 10 * s, a + 5)]) + 'Z', f: i % 2 ? '#e9edf1' : '#c9d0d8' }]} />;
      })}
      <path d={circ(c, R)} fill="none" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: circ(c, 8 * s), f: '#6f7883' }]} />
    </g>
  );
}
/** Kuyu kesiti (toprak, kuyu boşluğu, su) */
function WellSection({ gy, water }: { gy: number; water: number }) {
  return (
    <g>
      <rect x={0} y={gy} width={320} height={240 - gy} fill="#a8875f" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 53) % 300 + 10} cy={gy + 14 + ((i * 37) % (230 - gy))} r={2} fill="#8f7150" />)}
      <rect x={124} y={gy} width={52} height={240 - gy} fill="#5e4a36" />
      <rect x={124} y={water} width={52} height={240 - water} fill={K.water} />
      <path d={`M124 ${water}h52`} stroke={K.waterLight} stroke-width={2} />
      <path d={`M124 ${gy}V240M176 ${gy}V240`} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}
/** Kollu el pompası (tulumba). x = gövde ekseni, y = zemin */
function HandPump({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-16, -6, 32, 8, 2), f: '#5d6670' }, { d: rrect(-9, -62, 18, 58, 3), f: '#4f6f8f' }, { d: pl([[9, -48], [30, -44], [30, -38], [9, -40]]) + 'Z', f: '#4f6f8f' }, { d: rrect(-11, -68, 22, 8, 2), f: '#3f5a75' }]} />
      <OG ow={1.5 / s} sh={[{ d: capsule([-4, -66], 3, [-56, -88], 3.5), f: '#3f5a75' }, { d: circ([-4, -66], 3.5), f: K.out }]} />
    </g>
  );
}
/** Akü (önden). x sol, y üst; + solda, − sağda */
function Battery({ x, y, w = 90, h = 56, label = true }: { x: number; y: number; w?: number; h?: number; label?: boolean }) {
  const tp = batT(x, y, w);
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 5), f: '#3d4250' }, { d: rrect(x, y, w, 10, 4), f: '#2e323d' }, { d: rrect(tp.p[0] - 6, y - 7, 12, 9, 2), f: PLUS }, { d: rrect(tp.m[0] - 6, y - 7, 12, 9, 2), f: '#5a5d68' }]} />
      {label && <text x={tp.p[0]} y={y + 32} font-size={18} font-weight={700} fill="#fff" text-anchor="middle">+</text>}
      {label && <text x={tp.m[0]} y={y + 32} font-size={18} font-weight={700} fill="#fff" text-anchor="middle">−</text>}
    </g>
  );
}
const batT = (x: number, y: number, w = 90) => ({ p: [x + w * 0.2, y - 6] as P, m: [x + w * 0.8, y - 6] as P });
/** Hat sigortası (sarı gövde). c merkez, a açı */
function Fuse({ c, a = 0, big }: { c: P; a?: number; big?: boolean }) {
  const w = big ? 32 : 22, h = big ? 16 : 12;
  return (
    <g transform={`rotate(${a} ${c[0]} ${c[1]})`}>
      <OG sh={[{ d: rrect(c[0] - w / 2, c[1] - h / 2, w, h, 3), f: '#f2c14e' }, { d: rrect(c[0] - w / 4, c[1] - h / 4, w / 2, h / 2, 1), f: '#fff3c4', ln: true }]} />
      <path d={`M${c[0] - w / 4} ${c[1]}H${c[0] + w / 4}`} stroke={K.out} stroke-width={1.4} />
    </g>
  );
}
/** Kablo (+ kırmızı, − siyah) */
const Wire = ({ pts, plus, w = 4 }: { pts: P[]; plus?: boolean; w?: number }) => <Ln d={pl(pts)} c={plus ? PLUS : MINUS} w={w} />;
/** Diyot simgesi (sağa iletir) */
function Diode({ c, a = 0 }: { c: P; a?: number }) {
  return (
    <g transform={`rotate(${a} ${c[0]} ${c[1]})`}>
      <OG sh={[{ d: rrect(c[0] - 14, c[1] - 10, 28, 20, 4), f: '#eef1f4' }]} />
      <path d={`M${c[0] - 6} ${c[1] - 6}L${c[0] + 5} ${c[1]}L${c[0] - 6} ${c[1] + 6}Z`} fill={K.ink} />
      <path d={`M${c[0] + 6} ${c[1] - 7}V${c[1] + 7}`} stroke={K.ink} stroke-width={2.4} />
    </g>
  );
}
/** Küçük rüzgâr türbini (direk + 3 kanat, önden). x,y = direk tabanı */
function Turbine({ x, y, h, s = 1 }: { x: number; y: number; h: number; s?: number }) {
  const c: P = [x, y - h];
  return (
    <g>
      <Ln d={pl([[x, y], c])} c="#9aa7b4" w={5 * s} />
      {[-90, 30, 150].map((a) => <OG key={a} sh={[{ d: capsule(c, 3 * s, onC(c, 40 * s, a), 5 * s), f: '#fbfaf5' }]} />)}
      <OG sh={[{ d: circ(c, 6 * s), f: '#6f7883' }]} />
    </g>
  );
}
/** Çatısında türbin olan ev */
function HouseRoofTurbine({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y - 54, 88, 54, 2), f: '#f0dcc0' }, { d: pl([[x - 6, y - 52], [x + 44, y - 86], [x + 94, y - 52]]) + 'Z', f: '#c2583e' }, { d: rrect(x + 14, y - 36, 18, 20, 2), f: '#9dd5f6' }, { d: rrect(x + 54, y - 34, 18, 34, 2), f: '#a8724a' }]} />
      <Turbine x={x + 62} y={y - 72} h={34} s={0.6} />
    </g>
  );
}
/** Sapma (boşaltma) kontrolcülü şarj şeması: kaynak → diyot/köprü → sigorta → akü; kontrolcü + ısıtıcı direnç */
function DumpSchema({ src }: { src: 'wind' | 'water' }) {
  const B = { x: 118, y: 162, w: 88 };
  const tp = batT(B.x, B.y, B.w);
  const top = 70;
  return (
    <Scene2 bg="closeup">
      {/* kaynak */}
      {src === 'wind' ? (
        <g>
          <Ln d={pl([[34, 104], [34, 56]])} c="#9aa7b4" w={4} />
          {[-90, 30, 150].map((a) => <OG key={a} sh={[{ d: capsule([34, 50], 2.5, onC([34, 50], 28, a), 4), f: '#fbfaf5' }]} />)}
          <OG sh={[{ d: circ([34, 50], 5), f: '#6f7883' }]} />
        </g>
      ) : (
        <g>
          <Undershot c={[28, 54]} r={17} />
        </g>
      )}
      <OG sh={[{ d: rrect(10, 92, 36, 34, 6), f: '#6f7883' }]} />
      <text x={28} y={115} font-size={16} font-weight={700} fill="#fff" text-anchor="middle">G</text>
      {src === 'wind' && (
        <g>
          {[98, 109, 120].map((y) => <Ln key={y} d={pl([[46, y], [58, y]])} c="#8a939e" w={2} />)}
          <OG sh={[{ d: rrect(58, 90, 34, 38, 4), f: '#eef1f4' }]} />
          <text x={75} y={114} font-size={12} font-weight={700} fill={K.ink} text-anchor="middle">~/=</text>
        </g>
      )}
      {/* artı hat: kaynak → (diyot) → sigorta → akü + ; eksi hat akünün altından dolaşır */}
      <Wire plus pts={[[src === 'wind' ? 92 : 46, 100], [src === 'wind' ? 100 : 62, 100], [src === 'wind' ? 100 : 62, top], [tp.p[0], top], [tp.p[0], tp.p[1]]]} />
      <Wire pts={[[src === 'wind' ? 92 : 46, 118], [src === 'wind' ? 104 : 72, 118], [src === 'wind' ? 104 : 72, 226], [B.x + B.w + 14, 226], [B.x + B.w + 14, 146], [tp.m[0], 146], [tp.m[0], tp.m[1]]]} />
      {src === 'water' && <Diode c={[94, top]} />}
      <Fuse c={[tp.p[0], 140]} a={90} />
      <Battery x={B.x} y={B.y} w={B.w} />
      {/* sapma kontrolcüsü ve direnç */}
      <Wire plus pts={[[tp.p[0], top], [232, top]]} />
      <Wire pts={[[B.x + B.w + 14, 146], [258, 146], [258, 100]]} />
      <OG sh={[{ d: rrect(228, 52, 60, 48, 5), f: '#5e7fa6' }, { d: rrect(238, 60, 40, 14, 2), f: '#cfe7d6' }]} />
      <Ln d={pl([[244, 100], [244, 166]])} c="#8a939e" w={3} />
      <Ln d={pl([[272, 100], [272, 166]])} c="#8a939e" w={3} />
      <OG sh={[{ d: rrect(226, 166, 66, 34, 4), f: '#e9e4d6' }]} />
      <path d={`M234 183${Array.from({ length: 8 }, (_, i) => `L${240 + i * 6.5} ${i % 2 ? 176 : 190}`).join('')}L286 183`} stroke="#d0473d" stroke-width={2.6} fill="none" stroke-linejoin="round" />
      <Waves x={259} y={206} a={90} n={2} r={6} color={K.action} />
      <Arrow from={[300, 80]} to={[300, 160]} w={4} />
      <Label x={150} y={36} text="akü hep bağlı" size={12} bg={K.safe} />
    </Scene2>
  );
}

/** Güneş paneli (önden). x,y sol üst */
function SolarPanel({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  const cols = 4, rows = 3, m = 4;
  const cw = (w - 2 * m) / cols, ch = (h - 2 * m - (label ? 16 : 0)) / rows;
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 3), f: '#c9d0d8' }, { d: rrect(x + m, y + m, w - 2 * m, h - 2 * m, 1), f: '#22407a' }]} />
      {Array.from({ length: cols * rows }, (_, i) => (
        <rect key={i} x={x + m + (i % cols) * cw + 1} y={y + m + Math.floor(i / cols) * ch + 1} width={cw - 2} height={ch - 2} fill={i % 2 ? '#2d5296' : '#2a4b8c'} />
      ))}
      {label && <text x={x + w / 2} y={y + h - m - 4} font-size={12.5} font-weight={700} fill="#fff" text-anchor="middle">{label}</text>}
    </g>
  );
}
/** Uç işaretleri (+/−) */
function PolMarks({ xs, y }: { xs: [number, string][]; y: number }) {
  return <g>{xs.map(([x, t]) => <T key={x} x={x + (t === '+' ? 12 : -12)} y={y + 6} t={t} s={17} c={t === '+' ? PLUS : MINUS} />)}</g>;
}
/** İki panel paralel: artılar birlikte, eksiler birlikte; isteğe bağlı birleşik artı hatta sigorta */
function ParPanels({ fuse }: { fuse?: boolean }) {
  return (
    <Scene2 bg="closeup">
      <SolarPanel x={16} y={44} w={128} h={96} label="20 V · 5 A" />
      <SolarPanel x={176} y={44} w={128} h={96} label="20 V · 5 A" />
      <PolMarks xs={[[40, '−'], [120, '+'], [200, '+'], [280, '−']]} y={150} />
      <Wire plus pts={[[120, 140], [120, 168], [200, 168], [200, 140]]} />
      <Wire plus pts={[[160, 168], [160, 194]]} />
      <Wire pts={[[40, 140], [40, 208], [138, 208]]} />
      <Wire pts={[[280, 140], [280, 208], [182, 208]]} />
      {fuse && <Fuse c={[160, 182]} a={90} />}
      <OG sh={[{ d: rrect(138, 194, 44, 28, 4), f: '#5e7fa6' }]} />
      {fuse ? <Label x={226} y={186} text="15 A" size={15} /> : <Label x={160} y={22} text="20 V · 10 A" size={16} />}
      {fuse && <T x={160} y={28} t="(5 + 5) × 1,25 → 15 A" s={14} />}
    </Scene2>
  );
}
/** Şarj kontrolcüsü şeması. stage 1: akü bağlanıyor; 2: panel (örtülü) bağlanıyor; 3: yük çıkışına lamba */
function CtrlSchema({ stage }: { stage: 1 | 2 | 3 }) {
  const B = { x: 136, y: 176, w: 80 };
  const bt = batT(B.x, B.y, B.w); // + (152,170), − (200,170)
  const yT = 110;
  const panelOn = stage >= 2;
  return (
    <Scene2 bg="closeup">
      {/* panel */}
      <SolarPanel x={10} y={20} w={84} h={58} label="" />
      {stage === 2 && (
        <g>
          <OG sh={[{ d: smooth([[8, 14], [52, 8], [96, 14], [98, 66], [92, 76], [52, 72], [10, 76], [6, 66]], true), f: '#7b5c94' }]} />
          <path d="M30 14Q34 44 28 74M70 12Q74 44 70 72" stroke={shade('#7b5c94', 0.3)} stroke-width={2} fill="none" />
        </g>
      )}
      {panelOn ? (
        <g>
          <Wire plus pts={[[72, 78], [72, 128], [116, 128], [116, yT]]} />
          <Wire pts={[[32, 78], [32, 140], [132, 140], [132, yT]]} />
          <Fuse c={[94, 128]} />
        </g>
      ) : (
        <g>
          <Wire plus pts={[[72, 78], [72, 116], [84, 126]]} />
          <Wire pts={[[32, 78], [32, 132], [46, 144]]} />
          <OG sh={[{ d: rrect(78, 120, 12, 12, 2), f: '#5a5d68' }, { d: rrect(40, 138, 12, 12, 2), f: '#5a5d68' }]} />
        </g>
      )}
      {/* akü */}
      <Wire plus pts={[bt.p, [bt.p[0], yT]]} />
      <Wire pts={[bt.m, [bt.m[0], 140], [168, 140], [168, yT]]} />
      <Fuse c={[bt.p[0], 152]} a={90} />
      <Battery x={B.x} y={B.y} w={B.w} h={48} />
      {/* yük: LED lamba */}
      {stage === 3 && (
        <g>
          <Wire plus pts={[[188, yT], [188, 128], [256, 128]]} />
          <Wire pts={[[204, yT], [204, 116], [256, 116]]} />
          <OG sh={[{ d: rrect(256, 106, 44, 32, 4), f: '#e9e4d6' }, { d: rrect(272, 90, 12, 16, 2), f: IRON }, { d: circ([278, 76], 14), f: '#fff3a8' }]} />
          <Waves x={278} y={60} a={-90} n={2} r={7} color="#f5b400" />
        </g>
      )}
      {/* kontrolcü */}
      <OG sh={[{ d: rrect(100, 40, 120, 70, 6), f: '#5e7fa6' }]} />
      <Sun x={124} y={70} r={7} />
      <OG sh={[{ d: rrect(150, 64, 20, 13, 2), f: '#3d4250' }, { d: rrect(153, 60, 4, 4, 1), f: PLUS }, { d: rrect(163, 60, 4, 4, 1), f: '#8a939e' }]} />
      <OG sh={[{ d: circ([196, 68], 7), f: '#fff3a8' }, { d: rrect(193, 75, 6, 5, 1), f: IRON }]} />
      {[116, 132, 152, 168, 188, 204].map((x, i) => <circle key={x} cx={x} cy={yT - 6} r={3.4} fill={i % 2 ? MINUS : PLUS} stroke={K.out} stroke-width={1.2} />)}
      {stage === 1 && <Num x={bt.p[0] - 22} y={150} n="1" bg={K.action} r={12} />}
      {stage === 2 && <Num x={52} y={110} n="2" bg={K.action} r={12} />}
    </Scene2>
  );
}

/* ═══════════════ Sahneler ═══════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ───────── Kategori kapağı: basit makineler ───────── */
  'sf-ek-makine-kapak': () => {
    const end: P = [62, 120], tip: P = [176, 206];
    const fl: P = [end[0] + (tip[0] - end[0]) * 0.88, end[1] + (tip[1] - end[1]) * 0.88];
    const pc: P = [262, 70];
    return (
      <Scene2 bg="outdoor" gy={196}>
        {/* ağaç ve makara */}
        <OG sh={[{ d: 'M296 214L292 60L300 60L306 214Z', f: K.trunk }, { d: capsule([300, 52], 7, [226, 46], 5), f: K.trunk }]} />
        <OG sh={[{ d: circ([304, 30], 26), f: K.leaf }, { d: circ([268, 30], 20), f: K.leaf }]} />
        <Rope pts={[[pc[0], 48], [pc[0], pc[1]]]} />
        <Rope pts={[[pc[0] - 11, pc[1]], [pc[0] - 11, 150]]} />
        <Rope pts={[[pc[0] + 11, pc[1]], [pc[0] + 11, 186]]} />
        <Sheave c={pc} r={11} />
        <Crate x={pc[0] - 34} y={182} w={40} h={34} />
        {/* kaldıraç */}
        <Ln d={pl([end, tip])} c={WOOD} w={7} />
        <OG sh={[{ d: rrect(fl[0] - 11, fl[1] + 3, 22, 214 - fl[1] - 3, 3), f: shade(STONE, 0.05) }]} />
        <Boulder c={[204, 182]} rx={30} ry={28} />
        <Person {...CAST.usta} x={36} y={218} pose={{ spine: -66, chest: -60, head: -72, legB: [104, 96], legF: [72, 88], armB: { to: [end[0] - 3, end[1] - 1] }, armF: { to: [end[0] + 5, end[1] + 3] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Arrow from={[204, 140]} to={[204, 112]} />
      </Scene2>
    );
  },

  /* ───────── Kaldıraç ───────── */
  'sf-ek-kaldirac-ornek': () => {
    const end: P = [84, 126], tip: P = [266, 209];
    const fl: P = [end[0] + (tip[0] - end[0]) * 0.9, end[1] + (tip[1] - end[1]) * 0.9];
    return (
      <Scene2 bg="outdoor" gy={200}>
        <Ln d={pl([end, tip])} c={WOOD} w={7} />
        <OG sh={[{ d: rrect(fl[0] - 13, fl[1] + 3, 26, 216 - fl[1] - 3, 3), f: shade(STONE, 0.05) }]} />
        <Boulder c={[288, 182]} rx={30} ry={33} />
        <Person {...CAST.usta} x={52} y={218} pose={{ spine: -66, chest: -60, head: -72, legB: [104, 96], legF: [72, 88], armB: { to: [end[0] - 3, end[1] - 1] }, armF: { to: [end[0] + 5, end[1] + 3] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Dim a={[end[0], 232]} b={[fl[0], 232]} t="1,8 m" c={BLUE} off={[0, -5]} />
        <Dim a={[fl[0], 232]} b={[tip[0], 232]} t="" c={K.danger} />
        <T x={fl[0] + 6} y={168} t="0,2 m" c={K.danger} />
        <path d={pl([[fl[0] + 6, 172], [fl[0] + 10, 222]])} stroke={K.danger} stroke-width={1.5} stroke-dasharray="3 3" />
        <Arrow from={[288, 138]} to={[288, 108]} />
        <Arrow from={[108, 82]} to={[108, 116]} />
      </Scene2>
    );
  },
  'sf-ek-kaldirac-takoz': () => {
    const end: P = [56, 112], tip: P = [174, 188];
    const fl: P = [end[0] + (tip[0] - end[0]) * 0.84, end[1] + (tip[1] - end[1]) * 0.84];
    return (
      <Scene2 bg="outdoor" gy={200}>
        <Ln d={pl([end, tip])} c={WOOD} w={7} />
        <OG sh={[{ d: rrect(fl[0] - 11, fl[1] + 3, 22, 210 - fl[1] - 3, 3), f: shade(STONE, 0.05) }]} />
        <Boulder c={[192, 152]} rx={40} ry={34} />
        {/* takoz yığını: alttaki yerinde, üstteki yandan sürülüyor; el yükün dışında */}
        <OG sh={[{ d: rrect(172, 198, 50, 12, 2), f: '#a87447' }, { d: rrect(194, 187, 50, 11, 2), f: '#c08a58' }]} />
        <Person {...CAST.usta} x={28} y={214} pose={{ spine: -66, chest: -60, head: -72, legB: [104, 96], legF: [72, 88], armB: { to: [end[0] - 3, end[1] - 1] }, armF: { to: [end[0] + 5, end[1] + 3] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Person {...CAST.ayse} x={272} y={226} flip pose={{ ...POSE.crouch, armF: { to: [245, 193] }, armB: { to: [247, 199] }, handF: 'flat', face: 'neutral' }} />
        <Arrow from={[262, 166]} to={[232, 166]} w={5} />
      </Scene2>
    );
  },
  'sf-ek-kaldirac-elarabasi': () => {
    const wc: P = [246, 196];
    const hand: P = [114, 146];
    return (
      <Scene2 bg="outdoor" gy={200}>
        {/* kollar ve ayak */}
        <Ln d={pl([[wc[0] + 4, wc[1] - 6], [hand[0] - 2, hand[1]]])} c={shade(WOOD, 0.1)} w={5} />
        <Ln d={pl([[186, 178], [182, 214]])} c={shade(WOOD, 0.1)} w={4} />
        {/* tekne */}
        <OG sh={[{ d: pl([[160, 140], [268, 136], [252, 182], [186, 184]]) + 'Z', f: '#4f8a6c' }, { d: pl([[160, 140], [268, 136], [264, 146], [166, 150]]) + 'Z', f: shade('#4f8a6c', 0.15), no: true }]} />
        {/* taşlar tekerleğe yakın */}
        <Boulder c={[236, 132]} rx={20} ry={14} />
        <Boulder c={[212, 136]} rx={14} ry={11} col={shade(STONE, 0.08)} />
        <Ln d={pl([[wc[0] + 4, wc[1] - 6], [hand[0] - 2, hand[1]]])} c={WOOD} w={5} out={false} />
        <OG sh={[{ d: circ(wc, 19), f: '#3b3f4b' }, { d: circ(wc, 8), f: IRON, ln: true }]} />
        <Person {...CAST.usta} x={84} y={218} pose={{ ...POSE.walk, spine: -84, armB: { to: [hand[0] - 2, hand[1] + 1] }, armF: { to: hand }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Arrow from={[150, 182]} to={[150, 154]} />
      </Scene2>
    );
  },

  /* ───────── Palanga ───────── */
  'sf-ek-palanga-sabit': () => {
    // sol: sabit makara (1×) — sağ: hareketli makara (2×)
    const a: P = [86, 62], b: P = [218, 140], f: P = [b[0] + 28, 62];
    return (
      <Scene2 bg="closeup">
        <rect x={160} y={14} width={2} height={212} fill="#c6ced8" />
        <OG sh={[{ d: capsule([16, 26], 9, [150, 30], 8), f: K.trunk }, { d: capsule([176, 26], 9, [306, 30], 8), f: K.trunk }]} />
        {/* sabit makara */}
        <Rope pts={[[a[0], 34], [a[0], a[1]]]} />
        <Rope pts={[[a[0] - 14, a[1]], [a[0] - 14, 156]]} />
        <Rope pts={[[a[0] + 14, a[1]], [a[0] + 14, 196]]} />
        <path d={`M${a[0] - 14} ${a[1]}A14 14 0 0 1 ${a[0] + 14} ${a[1]}`} fill="none" stroke={K.out} stroke-width={6.2} />
        <path d={`M${a[0] - 14} ${a[1]}A14 14 0 0 1 ${a[0] + 14} ${a[1]}`} fill="none" stroke={ROPE} stroke-width={3.2} />
        <Sheave c={a} r={12} />
        <Crate x={a[0] - 36} y={196} w={44} h={40} />
        <Hand x={a[0] + 14} y={214} a={0} s={0.62} pose="fist" side="R" arm={40} sleeve={K.role.bystander2} skin={2} />
        <Arrow from={[a[0] + 36, 150]} to={[a[0] + 36, 190]} w={5} />
        <Arrow from={[a[0] - 52, 186]} to={[a[0] - 52, 150]} w={5} />
        <Label x={a[0] - 8} y={222} text="1×" />
        {/* hareketli makara + daldaki yön makarası: ip aşağı çekilir */}
        <Rope pts={[[b[0] - 14, 34], [b[0] - 14, b[1]]]} />
        <Rope pts={[[b[0] + 14, b[1]], [b[0] + 14, f[1]]]} />
        <Rope pts={[[f[0], 34], [f[0], f[1]]]} />
        <Rope pts={[[f[0] + 14, f[1]], [f[0] + 14, 196]]} />
        <path d={`M${f[0] - 14} ${f[1]}A14 14 0 0 1 ${f[0] + 14} ${f[1]}`} fill="none" stroke={K.out} stroke-width={6.2} />
        <path d={`M${f[0] - 14} ${f[1]}A14 14 0 0 1 ${f[0] + 14} ${f[1]}`} fill="none" stroke={ROPE} stroke-width={3.2} />
        <Sheave c={f} r={12} />
        <path d={`M${b[0] - 14} ${b[1]}A14 14 0 0 0 ${b[0] + 14} ${b[1]}`} fill="none" stroke={K.out} stroke-width={6.2} />
        <path d={`M${b[0] - 14} ${b[1]}A14 14 0 0 0 ${b[0] + 14} ${b[1]}`} fill="none" stroke={ROPE} stroke-width={3.2} />
        <Sheave c={b} r={12} />
        <Ln d={pl([[b[0], b[1]], [b[0], 168]])} c={IRON} w={3} />
        <Crate x={b[0] - 22} y={208} w={44} h={40} />
        <Hand x={f[0] + 14} y={214} a={0} s={0.62} pose="fist" side="R" arm={40} sleeve={K.role.bystander2} skin={2} />
        <Arrow from={[f[0] + 34, 150]} to={[f[0] + 34, 190]} w={5} />
        <Arrow from={[b[0] - 40, 196]} to={[b[0] - 40, 166]} w={5} />
        <Label x={b[0]} y={226} text="2×" />
      </Scene2>
    );
  },
  'sf-ek-palanga-kollar': () => {
    // 4 kollu palanga: ölü uç üst blokta → kollar x=110,130,150,170; serbest uç x=190
    const r = 10, yT = 64, yB = 150;
    const xs = [110, 130, 150, 170];
    const rope = `M110 ${yT + 12}V${yB}A${r} ${r} 0 0 0 130 ${yB}V${yT}A${r} ${r} 0 0 1 150 ${yT}V${yB}A${r} ${r} 0 0 0 170 ${yB}V${yT}A${r} ${r} 0 0 1 190 ${yT}V196`;
    return (
      <Scene2 bg="outdoor" gy={206}>
        <OG sh={[{ d: capsule([0, 26], 12, [240, 30], 9), f: K.trunk }]} />
        <Rope pts={[[150, 34], [150, 46]]} w={4} />
        <OG sh={[{ d: rrect(102, 46, 96, 30, 6), f: shade(WOOD, 0.1) }, { d: rrect(96, 140, 84, 22, 6), f: shade(WOOD, 0.1) }]} />
        <Sheave c={[140, yT]} r={r} />
        <Sheave c={[180, yT]} r={r} />
        <Sheave c={[120, yB]} r={r} />
        <Sheave c={[160, yB]} r={r} />
        <circle cx={110} cy={yT + 10} r={3.5} fill={IRON} stroke={K.out} stroke-width={1.5} />
        <Ln d={rope} c={ROPE} w={3.2} />
        <Ln d={pl([[138, 162], [138, 176]])} c={IRON} w={3} />
        <Crate x={112} y={214} w={52} h={40} />
        {xs.map((x, i) => <Num key={i} x={x} y={106 + (i % 2) * 14} n={String(i + 1)} bg={K.action} />)}
        <Person {...CAST.can} x={232} y={226} flip pose={{ ...POSE.standSide, spine: -96, armB: { to: [192, 112] }, armF: { to: [192, 134] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Arrow from={[204, 150]} to={[204, 184]} w={5} />
        <Arrow from={[90, 206]} to={[90, 174]} w={5} />
        <Label x={46} y={118} text="4×" />
      </Scene2>
    );
  },
  'sf-ek-palanga-emniyet': () => {
    // basit 2 kollu palanga; serbest uç çekenden sonra kazığa iki tur sarılı, ikinci kişi tutuyor
    const t: P = [92, 56], m: P = [76, 128];
    const stake: P = [216, 214];
    return (
      <Scene2 bg="outdoor" gy={200}>
        <OG sh={[{ d: capsule([0, 22], 12, [150, 26], 8), f: K.trunk }]} />
        <Rope pts={[[t[0], 28], [t[0], t[1]]]} w={4} />
        {/* ip: ölü uç daldan → hareketli makara altı → üst makara → aşağı çekene */}
        <Ln d={`M62 28V${m[1]}A14 14 0 0 0 90 ${m[1]}V${t[1]}`} c={ROPE} w={3.2} />
        <Ln d={`M78 ${t[1]}A14 14 0 0 1 106 ${t[1]}V206L${stake[0] - 6} 210`} c={ROPE} w={3.2} />
        <Sheave c={t} r={12} />
        <Sheave c={m} r={12} />
        <Ln d={pl([[m[0], m[1]], [m[0], 150]])} c={IRON} w={3} />
        <Crate x={m[0] - 24} y={188} w={48} h={38} />
        {/* kazık ve sarım */}
        <OG sh={[{ d: rrect(stake[0] - 5, 168, 10, 50, 2), f: WOOD }]} />
        <ellipse cx={stake[0]} cy={190} rx={9} ry={3.5} fill="none" stroke={K.out} stroke-width={5.6} />
        <ellipse cx={stake[0]} cy={190} rx={9} ry={3.5} fill="none" stroke={ROPE} stroke-width={3} />
        <ellipse cx={stake[0]} cy={198} rx={9} ry={3.5} fill="none" stroke={K.out} stroke-width={5.6} />
        <ellipse cx={stake[0]} cy={198} rx={9} ry={3.5} fill="none" stroke={ROPE} stroke-width={3} />
        <Rope pts={[[stake[0] + 8, 192], [262, 150]]} />
        <Person {...CAST.can} x={136} y={222} flip pose={{ ...POSE.standSide, spine: -96, armB: { to: [108, 104] }, armF: { to: [108, 126] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Person {...CAST.elif} x={290} y={222} flip pose={{ ...POSE.standSide, spine: -100, chest: -98, armB: { to: [264, 150] }, armF: { to: [270, 146] }, legB: [104, 92], legF: [80, 88], handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <ArcArrow c={[stake[0], 194]} r={22} a0={200} a1={340} w={4.5} />
      </Scene2>
    );
  },

  /* ───────── Rampa ───────── */
  'sf-ek-rampa-oran': () => {
    const b: P = [40, 200], t: P = [234, 152];
    const ang = (Math.atan2(t[1] - b[1], t[0] - b[0]) * 180) / Math.PI;
    const mid: P = [b[0] + (t[0] - b[0]) * 0.46, b[1] + (t[1] - b[1]) * 0.46];
    return (
      <Scene2 bg="outdoor" gy={200} ground="dirt">
        <OG sh={[{ d: rrect(234, 152, 90, 30, 3), f: '#5e7fa6' }, { d: rrect(234, 152, 90, 7, 2), f: tint('#5e7fa6', 0.2) }, { d: circ([282, 188], 14), f: '#3b3f4b' }, { d: circ([282, 188], 5.5), f: IRON, ln: true }]} />
        <OG sh={[{ d: `M${b[0]} ${b[1]}L${t[0]} ${t[1] - 6}L${t[0] + 2} ${t[1]}L${b[0] + 4} ${b[1] + 6}Z`, f: WOOD }]} />
        <g transform={`rotate(${ang} ${mid[0]} ${mid[1]})`}>
          <Crate x={mid[0] - 24} y={mid[1] - 3} w={48} h={38} />
        </g>
        <Arrow from={[mid[0] + 34, mid[1] - 32]} to={[mid[0] + 82, mid[1] - 44]} w={5} />
        <path d={`M${t[0] - 4} ${t[1] - 6}V${b[1]}`} stroke={K.out} stroke-width={1.6} stroke-dasharray="4 3" />
        <Dim a={[t[0] - 8, t[1] + 2]} b={[t[0] - 8, b[1] - 2]} t="" c={K.danger} />
        <T x={t[0] - 16} y={190} t="1 m" c={K.danger} a="end" s={15} />
        <Dim a={[b[0] + 2, b[1] + 16]} b={[t[0] + 4, t[1] + 16]} t="" c={BLUE} />
        <T x={150} y={204} t="4 m" c={BLUE} s={15} />
      </Scene2>
    );
  },
  'sf-ek-rampa-merdane': () => {
    const rollers = [140, 182, 224];
    return (
      <Scene2 bg="outdoor" gy={200} ground="dirt">
        <OG sh={[{ d: rrect(122, 128, 124, 64, 4), f: '#b9b2a4' }, { d: rrect(122, 128, 124, 10, 3), f: tint('#b9b2a4', 0.2), no: true }]} />
        {rollers.map((x) => <OG key={x} sh={[{ d: circ([x, 199], 8), f: WOOD }, { d: circ([x, 199], 3.5), f: shade(WOOD, 0.2), ln: true }]} />)}
        {/* sıradaki kütük yükün önünde bekliyor */}
        <OG sh={[{ d: circ([272, 199], 8), f: WOOD }, { d: circ([272, 199], 3.5), f: shade(WOOD, 0.2), ln: true }]} />
        <Person {...CAST.can} x={70} y={222} pose={{ spine: -56, chest: -52, head: -62, legB: [118, 110], legF: [70, 88], armB: { to: [122, 150] }, armF: { to: [123, 160] }, handB: 'flat', handF: 'flat', face: 'neutral' }} />
        <Arrow from={[256, 120]} to={[300, 120]} />
      </Scene2>
    );
  },
  'sf-ek-rampa-yasak': () => {
    const b: P = [26, 212], t: P = [250, 120];
    const ang = (Math.atan2(t[1] - b[1], t[0] - b[0]) * 180) / Math.PI;
    const mid: P = [b[0] + (t[0] - b[0]) * 0.62, b[1] + (t[1] - b[1]) * 0.62];
    return (
      <Scene2 bg="outdoor" gy={200} ground="dirt">
        <OG sh={[{ d: rrect(248, 86, 80, 38, 3), f: '#5e7fa6' }, { d: rrect(248, 120, 80, 10, 2), f: shade('#5e7fa6', 0.2) }]} />
        <OG sh={[{ d: `M${b[0]} ${b[1]}L${t[0]} ${t[1] - 6}L${t[0] + 2} ${t[1]}L${b[0] + 4} ${b[1] + 6}Z`, f: WOOD }]} />
        <g transform={`rotate(${ang} ${mid[0]} ${mid[1]})`}>
          <Crate x={mid[0] - 26} y={mid[1] - 3} w={52} h={40} />
        </g>
        <Arrow from={[mid[0] - 34, mid[1] + 2]} to={[96, 170]} color={K.danger} w={4.5} />
        <Person {...CAST.can} x={46} y={228} flip pose={{ ...POSE.standSide, face: 'worried' }} />
        <No x={46} y={150} r={36} />
      </Scene2>
    );
  },

  /* ───────── Bocurgat ───────── */
  'sf-ek-bocurgat-oran': () => {
    const c: P = [132, 92];
    const rd = 20, h: P = onC(c, rd * 5, 26);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(c[0] - 10, c[1], 20, 150, 3), f: shade(WOOD, 0.12) }]} />
        <Rope pts={[[c[0] - rd, c[1]], [c[0] - rd, 172]]} />
        <OG sh={[{ d: pl([[c[0] - rd - 16, 172], [c[0] - rd + 16, 172], [c[0] - rd + 12, 206], [c[0] - rd - 12, 206]]) + 'Z', f: IRON }, { d: rrect(c[0] - rd - 13, 176, 26, 6, 2), f: K.water, no: true }]} />
        <OG sh={[{ d: circ(c, rd), f: WOOD }, { d: circ(c, rd * 0.55), f: shade(WOOD, 0.15), ln: true }]} />
        <OG sh={[{ d: capsule(c, 6, h, 5), f: IRON }, { d: circ(h, 8), f: shade(WOOD, 0.1) }, { d: circ(c, 4), f: K.out }]} />
        <Dim a={[c[0] + 2, c[1] - 30]} b={[h[0] + 2, h[1] - 30]} t="50 cm" c={BLUE} off={[0, -8]} />
        <Dim a={[c[0] - 30, c[1]]} b={[c[0] - 30, c[1] - rd]} t="" c={K.danger} />
        <T x={c[0] - 36} y={c[1] - 4} t="10 cm" c={K.danger} a="end" />
        <ArcArrow c={c} r={rd * 5 + 18} a0={6} a1={58} />
        <Label x={262} y={210} text="5×" />
      </Scene2>
    );
  },
  'sf-ek-bocurgat-kuyu': () => {
    const y = 104, crank: P = [236, 146];
    return (
      <Scene2 bg="outdoor" gy={196}>
        {/* kuyu */}
        <OG sh={[{ d: rrect(96, 168, 128, 44, 4), f: '#b8afa0' }, { d: ell([160, 168], 64, 9), f: '#3a3530' }]} />
        <g stroke={K.out} stroke-width={1.2} opacity={0.5}>
          <path d="M96 184H224M96 198H224M126 168V184M160 184V198M194 168V184M140 198V212M180 198V212" />
        </g>
        {/* çatallı direkler */}
        <OG sh={[{ d: capsule([104, 206], 5, [104, y + 4], 4), f: K.trunk }, { d: capsule([104, y + 10], 3, [94, y - 8], 3), f: K.trunk }, { d: capsule([104, y + 10], 3, [114, y - 8], 3), f: K.trunk }]} />
        <OG sh={[{ d: capsule([216, 206], 5, [216, y + 4], 4), f: K.trunk }, { d: capsule([216, y + 10], 3, [206, y - 8], 3), f: K.trunk }, { d: capsule([216, y + 10], 3, [226, y - 8], 3), f: K.trunk }]} />
        <OG sh={[{ d: capsule([96, y], 13, [226, y], 13), f: WOOD }, { d: rrect(144, y - 13, 32, 26, 2), f: shade(ROPE, 0.1) }]} />
        <path d={`M148 ${y - 13}v26M154 ${y - 13}v26M160 ${y - 13}v26M166 ${y - 13}v26M172 ${y - 13}v26`} stroke={K.out} stroke-width={1.1} opacity={0.6} />
        <Rope pts={[[160, y + 13], [160, 168]]} />
        <OG sh={[{ d: capsule([230, y], 4, crank, 4), f: IRON }, { d: capsule(crank, 4, [246, crank[1]], 4), f: shade(WOOD, 0.1) }]} />
        <Person {...CAST.dede} x={282} y={224} flip pose={{ ...POSE.standSide, spine: -100, armB: { to: [248, 144] }, armF: { to: [246, 148] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Arrow from={[176, 156]} to={[176, 124]} w={5} />
      </Scene2>
    );
  },
  'sf-ek-bocurgat-mandal': () => {
    const c: P = [146, 128], R = 66, r0 = 52, N = 12;
    const pts: P[] = [];
    for (let i = 0; i < N; i++) {
      const a0 = (i * 360) / N, a1 = ((i + 1) * 360) / N;
      pts.push(onC(c, r0, a0), onC(c, R, a1 - 2), onC(c, r0, a1 - 0.5));
    }
    const tipA = -66;
    const tip = onC(c, R - 3, tipA);
    const piv: P = [272, 56];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(256, 40, 34, 160, 4), f: shade(WOOD, 0.12) }]} />
        <OG sh={[{ d: pl(pts) + 'Z', f: IRON }, { d: circ(c, 30), f: WOOD, ln: true }, { d: circ(c, 9), f: shade(IRON, 0.3), ln: true }]} />
        <OG sh={[{ d: capsule(piv, 12, tip, 5), f: '#9c6a3f' }, { d: circ(piv, 4.5), f: K.out }]} />
        <ArcArrow c={c} r={R + 18} a0={150} a1={86} />
        <ArcArrow c={c} r={R + 18} a0={10} a1={56} color={K.danger} w={4.5} />
        <Bad x={248} y={210} r={14} />
      </Scene2>
    );
  },

  /* ───────── Ağırlık ve sarkaç ───────── */
  'sf-ek-agirlik-mil': () => {
    const c: P = [128, 74], rd = 14;
    const blades = [20, 110, 200, 290];
    return (
      <Scene2 bg="indoor" gy={214}>
        <OG sh={[{ d: rrect(c[0] - 18, 20, 36, 96, 3), f: shade(WOOD, 0.08) }]} />
        <circle cx={c[0] - 9} cy={30} r={2} fill={K.out} />
        <circle cx={c[0] + 9} cy={106} r={2} fill={K.out} />
        <OG sh={[{ d: circ(c, rd), f: shade(ROPE, 0.1) }]} />
        <Rope pts={[[c[0] + rd, c[1]], [c[0] + rd, 150]]} />
        <Boulder c={[c[0] + rd, 168]} rx={20} ry={18} />
        {blades.map((a) => (
          <OG key={a} sh={[{ d: capsule(onC(c, 12, a), 2.4, onC(c, 50, a), 2.4), f: IRON }, { d: `M${pl([onC(c, 24, a - 7), onC(c, 58, a - 4), onC(c, 58, a + 4), onC(c, 24, a + 7)])}Z`, f: '#c99a62' }]} />
        ))}
        <OG sh={[{ d: circ(c, 6), f: IRON }]} />
        <ArcArrow c={c} r={74} a0={-40} a1={20} />
        <Arrow from={[178, 150]} to={[178, 196]} />
      </Scene2>
    );
  },
  'sf-ek-sarkac-kurulum': () => {
    const nail: P = [150, 40], L = 128, ang = 16;
    const bob: P = [nail[0] + L * Math.sin(rad(ang)), nail[1] + L * Math.cos(rad(ang))];
    return (
      <Scene2 bg="indoor" gy={206}>
        <OG sh={[{ d: rrect(72, 22, 14, 186, 2), f: '#a8724a' }, { d: rrect(214, 22, 14, 186, 2), f: '#a8724a' }, { d: rrect(72, 22, 156, 14, 2), f: '#a8724a' }]} />
        <rect x={86} y={36} width={128} height={172} fill={shade(K.wall, 0.12)} />
        <path d={`M${nail[0]} ${nail[1]}V${nail[1] + L + 10}`} stroke={K.out} stroke-width={1.5} stroke-dasharray="4 4" opacity={0.6} />
        <path d={`M${nail[0]} ${nail[1] + 60}A60 60 0 0 0 ${f1(nail[0] + 60 * Math.sin(rad(ang)))} ${f1(nail[1] + 60 * Math.cos(rad(ang)))}`} fill="none" stroke={K.action} stroke-width={3} />
        <path d={pl([nail, bob])} stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: rrect(nail[0] - 3, nail[1] - 6, 6, 8, 1.5), f: IRON }, { d: circ(bob, 11), f: STONE }]} />
        <Person {...CAST.elif} x={238} y={228} flip pose={{ ...POSE.standSide, armF: { to: [bob[0] + 10, bob[1] - 1] }, handF: 'fist', face: 'neutral' }} />
      </Scene2>
    );
  },
  'sf-ek-sarkac-olcu': () => {
    const nail: P = [130, 26], bob: P = [130, 180];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(0, 12, 320, 12, 1), f: '#a8724a' }]} />
        <path d={`M${nail[0]} ${nail[1]}L${bob[0]} ${bob[1]}`} stroke={K.out} stroke-width={2} />
        <path d={`M${nail[0]} ${nail[1]}L${f1(nail[0] - 154 * Math.sin(rad(9)))} ${f1(nail[1] + 154 * Math.cos(rad(9)))}M${nail[0]} ${nail[1]}L${f1(nail[0] + 154 * Math.sin(rad(9)))} ${f1(nail[1] + 154 * Math.cos(rad(9)))}`} stroke={K.out} stroke-width={1.5} stroke-dasharray="3 4" opacity={0.45} />
        <circle cx={f1(nail[0] - 154 * Math.sin(rad(9)))} cy={f1(nail[1] + 154 * Math.cos(rad(9)))} r={16} fill={STONE} opacity={0.3} />
        <circle cx={f1(nail[0] + 154 * Math.sin(rad(9)))} cy={f1(nail[1] + 154 * Math.cos(rad(9)))} r={16} fill={STONE} opacity={0.3} />
        <OG sh={[{ d: rrect(nail[0] - 3, nail[1] - 6, 6, 9, 1.5), f: IRON }, { d: circ(bob, 16), f: STONE }]} />
        <circle cx={bob[0]} cy={bob[1]} r={2.5} fill={K.out} />
        {/* şerit metre */}
        <OG sh={[{ d: rrect(176, nail[1], 16, bob[1] - nail[1], 1), f: '#f2d03b' }]} />
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M176 ${f1(nail[1] + i * 9.6)}h${i % 5 === 0 ? 10 : 5}`} stroke={K.out} stroke-width={1.2} />)}
        <path d={`M176 ${bob[1]}H${bob[0] + 2}M176 ${nail[1]}H${nail[0] + 4}`} stroke={K.danger} stroke-width={2} stroke-dasharray="3 3" />
        <Label x={250} y={104} text="99,4 cm" size={15} />
        <path d={`M${f1(nail[0] - 172 * Math.sin(rad(9)))} ${f1(nail[1] + 172 * Math.cos(rad(9)))}A172 172 0 0 0 ${f1(nail[0] + 172 * Math.sin(rad(9)))} ${f1(nail[1] + 172 * Math.cos(rad(9)))}`} fill="none" stroke={K.action} stroke-width={3.5} stroke-linecap="round" />
        <T x={nail[0]} y={226} t="1 sn" s={15} />
      </Scene2>
    );
  },

  /* ───────── Çamaşır ───────── */
  'sf-ek-camasir-kova': () => {
    const pc = 160;
    return (
      <Scene2 bg="closeup">
        {/* kova kesiti */}
        <OG sh={[{ d: pl([[86, 86], [234, 86], [222, 216], [98, 216]]) + 'Z', f: '#5b8fd0' }, { d: pl([[94, 92], [226, 92], [215, 209], [105, 209]]) + 'Z', f: '#eef3f8' }]} />
        <path d={pl([[100, 150], [220, 150], [215, 209], [105, 209]]) + 'Z'} fill={K.waterLight} />
        {/* çamaşır */}
        <OG sh={[{ d: smooth([[110, 196], [130, 180], [150, 192], [172, 178], [196, 190], [212, 182], [212, 204], [110, 206]], true), f: '#e98f8a' }, { d: smooth([[118, 172], [140, 166], [154, 176], [134, 186]], true), f: '#f4d58d' }, { d: smooth([[180, 166], [204, 162], [210, 176], [186, 180]], true), f: '#a7c7e7' }]} />
        <path d="M100 150H220" stroke={K.water} stroke-width={2} />
        {/* kapak ve delik */}
        <OG sh={[{ d: rrect(80, 78, 70, 10, 3), f: '#4a7cbd' }, { d: rrect(170, 78, 70, 10, 3), f: '#4a7cbd' }]} />
        {/* piston */}
        <OG sh={[{ d: rrect(pc - 4, 20, 8, 130, 2), f: WOOD }, { d: rrect(pc - 16, 18, 32, 9, 3), f: WOOD }]} />
        <OG sh={[{ d: `M${pc - 8} 132L${pc + 8} 132L${pc + 30} 162L${pc - 30} 162Z`, f: IRON }]} />
        {[-14, 0, 14].map((dx) => <circle key={dx} cx={pc + dx} cy={150} r={2.6} fill={K.out} />)}
        <Arrow from={[pc - 18, 146]} to={[pc - 34, 130]} color={K.water} w={3} />
        <Arrow from={[pc + 18, 146]} to={[pc + 34, 130]} color={K.water} w={3} />
        <Arrow from={[200, 30]} to={[200, 64]} w={5} />
        <Arrow from={[214, 64]} to={[214, 30]} w={5} />
      </Scene2>
    );
  },
  'sf-ek-camasir-calkalama': () => {
    const bx = 198, top = 170;
    return (
      <Scene2 bg="indoor" gy={206}>
        <OG sh={[{ d: rrect(bx - 8, 54, 16, 12, 3), f: WOOD }, { d: rrect(bx - 3.5, 58, 7, 160, 2), f: WOOD }]} />
        <OG sh={[{ d: pl([[bx - 34, top], [bx + 34, top], [bx + 29, 224], [bx - 29, 224]]) + 'Z', f: '#5b8fd0' }, { d: rrect(bx - 37, top - 6, 74, 8, 3), f: '#4a7cbd' }]} />
        <Person {...CAST.ayse} x={146} y={226} pose={{ ...POSE.standSide, spine: -84, chest: -80, head: -76, armB: { to: [bx - 3, 82] }, armF: { to: [bx - 3, 112] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <Arrow from={[244, 132]} to={[244, 92]} w={5} />
        <Arrow from={[258, 92]} to={[258, 132]} w={5} />
        <Label x={252} y={62} text="3–5 dk" size={14} />
      </Scene2>
    );
  },
  'sf-ek-camasir-burma': () => {
    const y = 118, x0 = 52, x1 = 214;
    const tw: JSX.Element[] = [];
    for (let x = x0 + 8; x < x1 - 4; x += 14) tw.push(<path key={x} d={`M${x} ${y - 11}Q${x + 7} ${y} ${x + 4} ${y + 11}`} stroke={shade('#e6edf4', 0.3)} stroke-width={2} fill="none" />);
    return (
      <Scene2 bg="outdoor" gy={200}>
        <OG sh={[{ d: rrect(36, 50, 14, 168, 3), f: K.trunk }]} />
        <OG sh={[{ d: smooth([[x0 - 6, y - 8], [x0 + 20, y - 12], [(x0 + x1) / 2, y - 10], [x1 - 6, y - 12], [x1 + 2, y - 4], [x1 + 2, y + 6], [x1 - 6, y + 12], [(x0 + x1) / 2, y + 10], [x0 + 20, y + 12], [x0 - 6, y + 8]], true), f: '#e6edf4' }]} />
        {tw}
        <OG sh={[{ d: rrect(x1 + 2, y - 40, 8, 80, 3), f: WOOD }]} />
        {[90, 130, 170].map((x, i) => <path key={x} d={`M${x} ${y + 18 + i * 3}q-3 5 0 8q3 -3 0 -8z`} fill={K.water} stroke={K.out} stroke-width={1} />)}
        <Person {...CAST.ayse} x={266} y={224} flip pose={{ ...POSE.standSide, armB: { to: [x1 + 6, y - 32] }, armF: { to: [x1 + 6, y + 30] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        <ArcArrow c={[x1 + 6, y]} r={50} a0={-150} a1={-100} />
      </Scene2>
    );
  },

  /* ───────── Zir ───────── */
  'sf-ek-zir-kesit': () => {
    const outer = potPts(160, 58, 216, 92, 116, 64);
    const cav = potPts(160, 62, 206, 82, 104, 54);
    const inner = potPts(160, 64, 176, 62, 74, 46);
    const innerCav = potPts(160, 68, 168, 54, 66, 38);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: smooth(outer, false) + 'Z', f: CLAY }, { d: smooth(cav, false) + 'Z', f: WET }]} />
        {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={78 + ((i * 37) % 164)} cy={120 + ((i * 23) % 80)} r={1.6} fill={SAND} />)}
        <OG sh={[{ d: smooth(inner, false) + 'Z', f: tint(CLAY, 0.08) }, { d: smooth(innerCav, false) + 'Z', f: '#f3e3cf' }]} />
        <OG sh={[{ d: circ([140, 150], 14), f: '#e2463c' }, { d: circ([170, 152], 13), f: '#e2463c' }, { d: capsule([150, 128], 8, [186, 120], 6), f: '#4caf50' }, { d: circ([156, 130], 12), f: '#e2463c' }]} />
        <OG sh={[{ d: smooth([[60, 62], [100, 52], [160, 56], [220, 52], [260, 62], [262, 72], [220, 64], [160, 66], [100, 64], [58, 72]], true), f: '#dfe9f1' }]} />
      </Scene2>
    );
  },
  'sf-ek-zir-golge': () => {
    const pot = (x: number, y: number) => (
      <g>
        <OG sh={[{ d: smooth(potPts(x, y - 50, y, 26, 32, 18), false) + 'Z', f: CLAY }, { d: smooth([[x - 30, y - 52], [x, y - 58], [x + 30, y - 52], [x + 30, y - 46], [x - 30, y - 46]], true), f: '#dfe9f1' }]} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={196}>
        <Sun x={270} y={36} />
        <ellipse cx={88} cy={210} rx={76} ry={10} fill={K.grassShade} />
        <Tree x={66} y={204} s={1.5} />
        {pot(112, 214)}
        <g fill="none" stroke="#7d8aa0" stroke-width={2.4} stroke-linecap="round" opacity={0.85}>
          <path d="M150 150q10 -6 20 0t20 0" />
          <path d="M156 168q10 -6 20 0t20 0" />
          <path d="M150 186q10 -6 20 0t20 0" />
        </g>
        {pot(254, 214)}
        <Ok x={112} y={140} />
        <Bad x={254} y={140} />
      </Scene2>
    );
  },
  'sf-ek-zir-sulama': () => {
    // yakın plan: iki testinin ağzı (kesit), aradaki kuma maşrapayla su
    const h = { x: 150, y: 30, a: 172, s: 0.95, pose: 'hold' as const, side: 'R' as const, grip: 34 };
    const g: P = [h.x + Math.sin(rad(h.a)) * 42 * h.s, h.y - Math.cos(rad(h.a)) * 42 * h.s];
    const ca = -104; // maşrapa ağzının yönü (sola, hafif aşağı)
    const mouth: P = [g[0] + Math.sin(rad(ca)) * 24, g[1] - Math.cos(rad(ca)) * 24];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: `M20 132Q160 112 300 132V240H20Z`, f: CLAY }, { d: `M40 140Q160 121 280 140V240H40Z`, f: WET }, { d: `M104 146Q160 136 216 146V240H104Z`, f: tint(CLAY, 0.08) }, { d: `M118 152Q160 144 202 152V240H118Z`, f: '#f3e3cf' }]} />
        {[[56, 160], [72, 190], [86, 220], [60, 228], [252, 168], [236, 200], [262, 222], [90, 168], [228, 226]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.7} fill={SAND} />)}
        <OG sh={[{ d: circ([146, 176], 15), f: '#e2463c' }, { d: circ([176, 180], 14), f: '#e2463c' }]} />
        <path d={`M${f1(mouth[0])} ${f1(mouth[1])}Q${f1(mouth[0] - 18)} ${f1(mouth[1] + 10)} 74 140`} stroke={K.out} stroke-width={8} fill="none" stroke-linecap="round" />
        <path d={`M${f1(mouth[0])} ${f1(mouth[1])}Q${f1(mouth[0] - 18)} ${f1(mouth[1] + 10)} 74 140`} stroke={K.water} stroke-width={5} fill="none" stroke-linecap="round" />
        <Hand {...h} arm={80} sleeve={K.role.bystander3} skin={2}>
          <g transform={`rotate(${ca} ${f1(g[0])} ${f1(g[1])})`}>
            <OG sh={[{ d: rrect(g[0] - 15, g[1] - 24, 30, 44, 4), f: '#9aa7b4' }, { d: rrect(g[0] - 15, g[1] - 24, 30, 7, 3), f: K.water }]} />
          </g>
        </Hand>
        <Label x={250} y={208} text="günde 1–3" size={14} />
      </Scene2>
    );
  },


  /* ───────── Kategori kapağı: su ve rüzgâr ───────── */
  'sf-ek-su-ruzgar-kapak': () => (
    <Scene2 bg="outdoor" gy={170}>
      <Windpump x={250} y={176} s={0.62} />
      <OG sh={[{ d: rrect(0, 64, 132, 12, 2), f: WOOD }]} />
      <path d="M2 64H130" stroke={K.water} stroke-width={5} />
      <path d="M128 66Q140 70 142 84" stroke={K.out} stroke-width={8} fill="none" stroke-linecap="round" />
      <path d="M128 66Q140 70 142 84" stroke={K.water} stroke-width={5} fill="none" stroke-linecap="round" />
      <Overshot c={[130, 146]} r={62} />
      <Water x={0} y={206} w={320} h={40} />
      <ArcArrow c={[130, 146]} r={80} a0={-30} a1={30} />
    </Scene2>
  ),

  /* ───────── Su çarkı ───────── */
  'sf-ek-su-debi-kova': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: pl([[0, 60], [150, 74], [150, 96], [0, 82]]) + 'Z', f: WOOD }]} />
      <path d="M0 66L148 79" stroke={K.water} stroke-width={6} />
      <path d="M146 82Q160 90 160 124V176" stroke={K.out} stroke-width={14} fill="none" />
      <path d="M146 82Q160 90 160 124V176" stroke={K.water} stroke-width={11} fill="none" />
      <OG sh={[{ d: pl([[118, 140], [204, 140], [196, 222], [126, 222]]) + 'Z', f: '#e8a83a' }, { d: rrect(114, 136, 94, 8, 3), f: shade('#e8a83a', 0.15) }, { d: ell([161, 150], 40, 5), f: K.water }]} />
      <T x={161} y={196} t="10 L" s={18} />
      <Timer x={244} y={70} r={20} />
      <Label x={252} y={118} text="2 sn" size={18} />
      <Label x={252} y={190} text="5 L/sn" size={15} bg={K.water} />
    </Scene2>
  ),
  'sf-ek-su-carki-ustten': () => {
    const c: P = [150, 132], r = 76;
    return (
      <Scene2 bg="outdoor" gy={196}>
        <OG sh={[{ d: pl([[c[0] - 8, c[1]], [c[0] + 8, c[1]], [c[0] + 30, 214], [c[0] - 30, 214]]) + 'Z', f: shade(WOOD, 0.15) }]} />
        <Overshot c={c} r={r} />
        {/* oluk */}
        <OG sh={[{ d: rrect(-4, 40, c[0] + 16, 13, 2), f: WOOD }]} />
        <path d={`M0 42H${c[0] + 10}`} stroke={K.water} stroke-width={4} />
        <path d={`M${c[0] + 10} 46Q${c[0] + 24} 50 ${c[0] + 26} ${c[1] - r + 14}`} stroke={K.out} stroke-width={9} fill="none" stroke-linecap="round" />
        <path d={`M${c[0] + 10} 46Q${c[0] + 24} 50 ${c[0] + 26} ${c[1] - r + 14}`} stroke={K.water} stroke-width={6} fill="none" stroke-linecap="round" />
        <Water x={60} y={208} w={260} h={40} />
        <ArcArrow c={c} r={r + 18} a0={-20} a1={40} />
        <Dim a={[262, 47]} b={[262, 208]} t="" c={BLUE} />
        <Label x={286} y={128} text="2 m+" size={14} />
      </Scene2>
    );
  },
  'sf-ek-su-carki-alttan': () => {
    const c: P = [160, 104], r = 76;
    return (
      <Scene2 bg="outdoor" gy={150}>
        <OG sh={[{ d: rrect(0, 150, 320, 90, 0), f: K.dirt }]} />
        <Water x={0} y={162} w={320} h={60} />
        <OG sh={[{ d: pl([[c[0] - 6, c[1]], [c[0] + 6, c[1]], [c[0] + 16, 158], [c[0] - 16, 158]]) + 'Z', f: shade(WOOD, 0.15) }]} />
        <Undershot c={c} r={r} />
        <Arrow from={[16, 196]} to={[66, 196]} color={tint(K.water, 0.4)} w={5} />
        <Arrow from={[250, 196]} to={[300, 196]} color={tint(K.water, 0.4)} w={5} />
        <ArcArrow c={c} r={r + 14} a0={-40} a1={-140} />
      </Scene2>
    );
  },

  /* ───────── Su değirmeni ───────── */
  'sf-ek-degirmen-genel': () => (
    <Scene2 bg="outdoor" gy={200} ground="dirt">
      {/* yamaç ve havuz */}
      <OG sh={[{ d: 'M0 74H86L190 198H0Z', f: shade(K.dirt, 0.05) }]} />
      <OG sh={[{ d: 'M8 60H78L74 76H12Z', f: K.water }]} />
      {/* oluk */}
      <OG sh={[{ d: pl([[70, 66], [80, 62], [186, 170], [174, 176]]) + 'Z', f: WOOD }]} />
      <path d="M76 66L180 170" stroke={K.water} stroke-width={4} />
      {/* bina kesiti */}
      <OG sh={[{ d: rrect(176, 66, 130, 134, 2), f: '#e2d5bf' }, { d: 'M168 70L241 30L314 70Z', f: '#b5583f' }]} />
      <rect x={186} y={154} width={110} height={46} fill="#3e3a36" />
      <OG sh={[{ d: rrect(176, 144, 130, 10, 1), f: shade(WOOD, 0.1) }]} />
      {/* taşlar, mil, çark */}
      <OG sh={[{ d: rrect(206, 130, 70, 14, 3), f: '#b9b2a4' }, { d: rrect(206, 114, 70, 14, 3), f: '#cfc8b9' }, { d: pl([[226, 84], [256, 84], [246, 108], [236, 108]]) + 'Z', f: WOOD }]} />
      <OG sh={[{ d: rrect(238, 118, 6, 70, 1), f: IRON }]} />
      <OG sh={[{ d: rrect(206, 180, 70, 10, 3), f: WOOD }, ...[212, 226, 240, 254, 268].map((x) => ({ d: pl([[x - 4, 174], [x + 4, 174], [x + 6, 194], [x - 2, 194]]) + 'Z', f: shade(WOOD, 0.1) }))]} />
      <path d="M182 176Q196 182 206 184" stroke={K.water} stroke-width={5} fill="none" stroke-linecap="round" />
      <Arrow from={[30, 100]} to={[66, 100]} color={K.water} w={4} />
      <Arrow from={[120, 92]} to={[152, 124]} color={K.water} w={4} />
      <Arrow from={[278, 214]} to={[312, 214]} color={K.water} w={4} />
    </Scene2>
  ),
  'sf-ek-degirmen-cark': () => {
    const c: P = [160, 150], R = 112, k = 0.36;
    const n = 14;
    const paddle = (i: number) => {
      const a = (i * 360) / n;
      const p0 = [c[0] + Math.cos(rad(a)) * 26, c[1] + Math.sin(rad(a)) * 26 * k] as P;
      const p1 = [c[0] + Math.cos(rad(a)) * R, c[1] + Math.sin(rad(a)) * R * k] as P;
      return { a, d: pl([[p0[0], p0[1] - 10], [p1[0], p1[1] - 16], [p1[0], p1[1] + 6], [p0[0], p0[1] + 6]]) + 'Z' };
    };
    const ps = Array.from({ length: n }, (_, i) => paddle(i));
    const back = ps.filter((p) => Math.sin(rad(p.a)) < 0);
    const front = ps.filter((p) => Math.sin(rad(p.a)) >= 0);
    return (
      <Scene2 bg="closeup">
        {back.map((p) => <OG key={p.a} sh={[{ d: p.d, f: shade(WOOD, 0.18) }]} />)}
        <OG sh={[{ d: rrect(c[0] - 7, 14, 14, c[1] - 14, 2), f: IRON }]} />
        <OG sh={[{ d: `M${c[0] - 26} ${c[1] - 10}V${c[1] + 6}A26 ${26 * k} 0 0 0 ${c[0] + 26} ${c[1] + 6}V${c[1] - 10}Z`, f: shade(WOOD, 0.1) }, { d: ell([c[0], c[1] - 10], 26, 26 * k), f: WOOD }]} />
        {front.map((p) => <OG key={p.a} sh={[{ d: p.d, f: WOOD }]} />)}
        <OG sh={[{ d: pl([[0, 166], [40, 168], [40, 180], [0, 182]]) + 'Z', f: shade(WOOD, 0.1) }]} />
        <path d="M40 174Q52 172 62 168" stroke={K.out} stroke-width={10} fill="none" stroke-linecap="round" />
        <path d="M40 174Q52 172 62 168" stroke={K.water} stroke-width={7} fill="none" stroke-linecap="round" />
        <Arrow from={[220, 34]} to={[110, 34]} bend={0.25} />
      </Scene2>
    );
  },
  'sf-ek-degirmen-tas': () => (
    <Scene2 bg="closeup">
      {/* alt taş (sabit) */}
      <OG sh={[{ d: rrect(50, 146, 98, 38, 3), f: '#b3ab9c' }, { d: rrect(172, 146, 98, 38, 3), f: '#b3ab9c' }]} />
      {/* üst taş (döner) */}
      <OG sh={[{ d: rrect(50, 98, 92, 42, 3), f: '#d1c9ba' }, { d: rrect(178, 98, 92, 42, 3), f: '#d1c9ba' }]} />
      {/* mil ve köprü */}
      <OG sh={[{ d: rrect(153, 112, 14, 140, 2), f: IRON }, { d: rrect(132, 112, 56, 10, 2), f: shade(IRON, 0.2) }]} />
      <T x={110} y={172} t="sabit" s={14} />
      <path d="M58 143H262" stroke={K.out} stroke-width={1} stroke-dasharray="2 3" />
      <Arrow from={[90, 80]} to={[230, 80]} bend={-0.18} />
    </Scene2>
  ),

  /* ───────── Yel değirmeni ───────── */
  'sf-ek-yel-cok-kanat': () => (
    <Scene2 bg="outdoor" gy={196}>
      <Windpump x={140} y={214} s={1} />
      <OG sh={[{ d: rrect(214, 150, 84, 58, 4), f: '#9aa7b4' }, { d: rrect(210, 146, 92, 8, 3), f: shade('#9aa7b4', 0.15) }]} />
      <Ln d={pl([[150, 206], [214, 196]])} c={IRON} w={3} />
      <path d="M210 196q4 4 0 9" stroke={K.water} stroke-width={3} fill="none" />
    </Scene2>
  ),
  'sf-ek-yel-bez-yelken': () => {
    const hub: P = [170, 96], L = 86;
    const spars = Array.from({ length: 8 }, (_, i) => -90 + i * 45);
    const furled = new Set([1, 4, 6]);
    return (
      <Scene2 bg="outdoor" gy={196}>
        <path d="M0 186H320V200H0Z" fill="#7cc0e8" />
        <OG sh={[{ d: pl([[134, 214], [140, 104], [204, 104], [210, 214]]) + 'Z', f: '#f2efe8' }, { d: pl([[132, 108], [172, 70], [212, 108]]) + 'Z', f: '#8e6a4a' }, { d: rrect(160, 170, 24, 44, 10), f: '#3f74b5' }]} />
        {spars.map((a, i) => {
          const tip = onC(hub, L, a);
          const nxt = onC(hub, L * 0.72, a + 30);
          return (
            <g key={a}>
              {!furled.has(i) && <OG sh={[{ d: pl([onC(hub, 16, a), tip, nxt]) + 'Z', f: '#fbfaf5' }]} />}
              <Ln d={pl([hub, tip])} c={shade(WOOD, 0.1)} w={furled.has(i) ? 6 : 3} />
            </g>
          );
        })}
        <path d={pl([...spars.map((a) => onC(hub, L, a)), onC(hub, L, spars[0])])} stroke={K.out} stroke-width={1} fill="none" opacity={0.6} />
        <OG sh={[{ d: circ(hub, 9), f: shade(WOOD, 0.25) }]} />
      </Scene2>
    );
  },
  'sf-ek-yel-pompa-cubugu': () => {
    const gy = 120, rx = 168;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* toprak kesiti */}
        <rect x={0} y={gy} width={320} height={120} fill="#a8875f" />
        <rect x={146} y={gy} width={44} height={120} fill="#5e4a36" />
        <rect x={146} y={176} width={44} height={64} fill={K.water} />
        {/* kule */}
        <Ln d={pl([[120, gy], [156, 40]])} c={IRON} w={3} />
        <Ln d={pl([[216, gy], [180, 40]])} c={IRON} w={3} />
        <Ln d={pl([[128, 100], [208, 100]])} c={IRON} w={2} />
        <Ln d={pl([[138, 76], [198, 76]])} c={IRON} w={2} />
        <Ln d={pl([[128, 100], [198, 76]])} c={IRON} w={2} />
        {/* pompa silindiri ve boru */}
        <OG sh={[{ d: rrect(rx - 6, 120, 12, 76, 1), f: '#8a939e' }, { d: rrect(rx - 11, 190, 22, 36, 3), f: '#6f7883' }, { d: rrect(rx - 9, 206, 18, 6, 1), f: shade(WOOD, 0.3) }]} />
        <Ln d={pl([[rx - 4, 112], [250, 112]])} c="#8a939e" w={5} />
        <OG sh={[{ d: rrect(244, 74, 62, 46, 3), f: '#9aa7b4' }]} />
        {/* pompa çubuğu */}
        <Ln d={pl([[rx, 40], [rx, 208]])} c={shade(IRON, 0.25)} w={3} />
        {/* çark (yandan), dişli kutusu, krank ve karşı ağırlık */}
        <OG sh={[{ d: rrect(150, 34, 40, 14, 3), f: '#6f7883' }, { d: capsule([190, 40], 3, [262, 36], 3), f: IRON }, { d: pl([[236, 20], [292, 24], [292, 50], [236, 46]]) + 'Z', f: '#e9e4d6' }]} />
        <OG sh={[{ d: ell([142, 40], 6, 31), f: '#d9dde2' }]} />
        <OG sh={[{ d: capsule([174, 40], 4, [rx, 40], 4), f: K.out }, { d: rrect(176, 44, 14, 12, 2), f: '#4b4f5a' }]} />
        <Arrow from={[rx + 34, 150]} to={[rx + 34, 186]} w={5} />
        <Arrow from={[rx + 48, 186]} to={[rx + 48, 150]} w={5} />
      </Scene2>
    );
  },

  /* ───────── El pompası ───────── */
  'sf-ek-pompa-emme': () => (
    <Scene2 bg="outdoor" gy={104} ground="dirt">
      <WellSection gy={104} water={180} />
      <Ln d={pl([[150, 90], [150, 210]])} c="#8a939e" w={6} />
      <HandPump x={150} y={104} s={0.82} />
      <Dim a={[214, 106]} b={[214, 179]} t="" c={K.danger} />
      <Label x={262} y={142} text="≤ 7 m" size={16} />
    </Scene2>
  ),
  'sf-ek-pompa-derin-kuyu': () => (
    <Scene2 bg="outdoor" gy={76} ground="dirt">
      <WellSection gy={76} water={150} />
      <Ln d={pl([[150, 64], [150, 200]])} c="#8a939e" w={6} />
      <Ln d={pl([[150, 60], [150, 204]])} c={shade(IRON, 0.3)} w={2.4} out={false} />
      <OG sh={[{ d: rrect(140, 190, 20, 36, 3), f: '#6f7883' }, { d: rrect(142, 204, 16, 6, 1), f: shade(WOOD, 0.3) }]} />
      <HandPump x={150} y={76} s={0.72} />
      <Dim a={[214, 78]} b={[214, 206]} t="" c={K.danger} />
      <Label x={264} y={142} text="≈30 m" size={16} />
    </Scene2>
  ),
  'sf-ek-pompa-doldurma': () => {
    // pompa solda (kolu sola bakar), kişi sağda: kol ile kişi karışmaz
    const top: P = [120, 92];
    return (
      <Scene2 bg="outdoor" gy={200}>
        <OG sh={[{ d: rrect(82, 196, 84, 20, 3), f: '#b8afa0' }]} />
        <HandPump x={120} y={196} s={1.5} />
        {/* kova (eğik) */}
        <path d={`M128 70Q120 74 ${top[0]} ${top[1] - 6}`} stroke={K.out} stroke-width={8} fill="none" stroke-linecap="round" />
        <path d={`M128 70Q120 74 ${top[0]} ${top[1] - 6}`} stroke={K.water} stroke-width={5} fill="none" stroke-linecap="round" />
        <g transform="rotate(-115 146 63)">
          <OG sh={[{ d: pl([[128, 42], [164, 42], [160, 84], [132, 84]]) + 'Z', f: '#9aa7b4' }, { d: ell([146, 42], 18, 4), f: K.water }]} />
        </g>
        <Person {...CAST.mert} x={220} y={224} flip pose={{ ...POSE.standSide, spine: -94, armB: { to: [164, 56] }, armF: { to: [154, 80] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
      </Scene2>
    );
  },

  /* ───────── Koç pompası ───────── */
  'sf-ek-koc-genel': () => (
    <Scene2 bg="outdoor" gy={210}>
      <OG sh={[{ d: 'M0 88H70L176 210H0Z', f: K.hill }, { d: 'M210 210L262 60H320V210Z', f: K.hill }]} />
      {/* bent ve gölet */}
      <OG sh={[{ d: 'M6 78H64L62 92H8Z', f: K.water }, { d: rrect(60, 72, 10, 22, 2), f: '#b8afa0' }]} />
      {/* besleme borusu (düz) */}
      <Ln d={pl([[66, 90], [168, 200]])} c="#8a939e" w={6} />
      {/* pompa */}
      <OG sh={[{ d: rrect(164, 192, 24, 14, 2), f: '#6f7883' }, { d: rrect(178, 164, 12, 30, 5), f: '#8a939e' }]} />
      <path d="M170 190q-2 -10 -8 -14M172 190q2 -12 -2 -18" stroke={K.water} stroke-width={2.6} fill="none" stroke-linecap="round" />
      {/* çıkış borusu ve depo */}
      <Ln d={pl([[186, 166], [206, 160], [264, 72]])} c="#4f8fd0" w={3} />
      <OG sh={[{ d: rrect(262, 34, 46, 34, 3), f: '#9aa7b4' }]} />
      <Water x={0} y={214} w={320} h={30} />
      <Dim a={[24, 96]} b={[24, 200]} t="" c={BLUE} />
      <T x={30} y={150} t="düşü" a="start" c={BLUE} s={14} />
      <Dim a={[300, 70]} b={[300, 196]} t="" c={K.danger} />
      <T x={292} y={140} t="çıkış" a="end" c={K.danger} s={14} />
    </Scene2>
  ),
  'sf-ek-koc-klapeler': () => (
    <Scene2 bg="closeup">
      {/* gövde ve besleme borusu */}
      <OG sh={[{ d: rrect(0, 160, 120, 34, 2), f: '#8a939e' }, { d: rrect(110, 150, 150, 56, 6), f: '#8a939e' }]} />
      <rect x={0} y={166} width={252} height={34} fill={K.waterLight} />
      {/* atık klapesi: yukarıda açık yuva, altında sarkan disk */}
      <OG sh={[{ d: rrect(120, 136, 44, 16, 2), f: '#6f7883' }]} />
      <rect x={134} y={136} width={16} height={32} fill={K.waterLight} />
      <OG sh={[{ d: rrect(128, 170, 28, 6, 2), f: '#3b3f4b' }, { d: rrect(140, 112, 4, 60, 1), f: '#3b3f4b' }, { d: rrect(132, 108, 20, 6, 1), f: '#3b3f4b' }]} />
      {[[-1, 1], [1, 1]].map(([sx], i) => (
        <path key={i} d={`M${142 + sx * 10} 134Q${142 + sx * 24} 116 ${142 + sx * 34} 120`} stroke={K.water} stroke-width={4} fill="none" stroke-linecap="round" />
      ))}
      {/* çıkış klapesi ve hava odası */}
      <OG sh={[{ d: rrect(196, 30, 52, 122, 8), f: '#9aa7b4' }]} />
      <rect x={202} y={96} width={40} height={52} fill={K.waterLight} />
      <OG sh={[{ d: rrect(198, 148, 48, 6, 1), f: '#6f7883' }, { d: pl([[204, 146], [222, 132], [226, 136], [212, 148]]) + 'Z', f: '#3b3f4b' }]} />
      <Ln d={pl([[248, 110], [306, 110], [306, 20]])} c="#4f8fd0" w={6} />
      <Arrow from={[16, 184]} to={[70, 184]} color={K.water} w={5} />
      <Arrow from={[230, 182]} to={[230, 160]} color={K.water} w={4} />
      <Arrow from={[268, 102]} to={[296, 102]} color={K.water} w={4} />
    </Scene2>
  ),
  'sf-ek-koc-calistirma': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(0, 168, 230, 40, 4), f: '#8a939e' }, { d: rrect(96, 144, 56, 26, 3), f: '#6f7883' }]} />
      <OG sh={[{ d: rrect(118, 98, 12, 50, 2), f: '#3b3f4b' }, { d: rrect(106, 92, 36, 9, 2), f: '#3b3f4b' }]} />
      {[-1, 1].map((sx) => <path key={sx} d={`M${124 + sx * 18} 142Q${124 + sx * 40} 118 ${124 + sx * 52} 126`} stroke={K.water} stroke-width={4} fill="none" stroke-linecap="round" />)}
      <Hand x={153} y={40} a={190} s={0.9} pose="point" side="R" arm={80} sleeve={K.role.helper} skin={3} />
      <Arrow from={[196, 60]} to={[196, 100]} w={5} />
      <Label x={250} y={200} text="30–100/dk" size={14} />
    </Scene2>
  ),

  /* ───────── Mikro hidro ───────── */
  'sf-ek-hidro-dusu-hortum': () => {
    // yamaç: üstte düz, sonra eğim. Hortum yamaçta yatar; alt uç direğe bağlı, su seviyesi üst uçla aynı
    const up: P = [70, 104], k0 = 92, slope = 0.4;
    const sy = (x: number) => (x <= k0 ? up[1] : up[1] + (x - k0) * slope);
    const st = 226, base = sy(st);
    return (
      <Scene2 bg="outdoor" gy={200}>
        <OG sh={[{ d: `M0 ${up[1]}L${k0} ${up[1]}L320 ${f1(sy(320))}V240H0Z`, f: K.grass }]} />
        <path d={`M${up[0]} ${up[1] - 1}L${k0} ${up[1] + 1}L${st - 6} ${f1(base + 1)}V${up[1]}`} stroke={K.out} stroke-width={6} fill="none" stroke-linejoin="round" />
        <path d={`M${up[0]} ${up[1] - 1}L${k0} ${up[1] + 1}L${st - 6} ${f1(base + 1)}V${up[1]}`} stroke="#bfe3f7" stroke-width={3.5} fill="none" stroke-linejoin="round" />
        <path d={`M${st - 6} ${f1(base)}V${up[1] + 1}`} stroke={K.water} stroke-width={3.5} />
        <OG sh={[{ d: rrect(st - 2, 84, 7, base - 80, 1), f: WOOD }]} />
        <path d={`M${up[0]} ${up[1]}H${st + 30}`} stroke={K.water} stroke-width={1.8} stroke-dasharray="5 4" />
        <Person {...CAST.usta} x={up[0] - 26} y={up[1] + 2} s={0.82} pose={{ ...POSE.crouch, armF: { to: [up[0], up[1] - 2] }, armB: { to: [up[0] - 3, up[1]] }, face: 'neutral' }} />
        <Person {...CAST.can} x={st + 56} y={f1(sy(st + 56) + 4)} s={0.82} flip pose={{ ...POSE.standSide, armF: { to: [st + 6, up[1] + 12] }, armB: { to: [st + 6, up[1] + 28] }, face: 'neutral' }} />
        <Dim a={[st + 18, up[1]]} b={[st + 18, base]} t="" c={K.danger} />
        <T x={st - 14} y={150} t="1 basamak" a="end" s={14} c={K.danger} />
      </Scene2>
    );
  },
  'sf-ek-hidro-turbin-tipleri': () => (
    <Scene2 bg="closeup">
      <rect x={106} y={20} width={2} height={200} fill="#c6ced8" />
      <rect x={212} y={20} width={2} height={200} fill="#c6ced8" />
      {/* Pelton */}
      <OG sh={[{ d: circ([56, 110], 30), f: '#9aa7b4' }, { d: circ([56, 110], 8), f: '#6f7883' }, ...Array.from({ length: 10 }, (_, i) => ({ d: ell(onC([56, 110], 34, i * 36), 7, 5), f: '#c9d0d8' }))]} />
      <OG sh={[{ d: pl([[6, 152], [30, 146], [30, 158], [6, 160]]) + 'Z', f: '#6f7883' }]} />
      <path d="M30 152L52 146" stroke={K.water} stroke-width={4} stroke-linecap="round" />
      <T x={56} y={200} t="yüksek" s={14} />
      {/* çapraz akış */}
      <OG sh={[{ d: rrect(130, 84, 62, 52, 4), f: '#c9d0d8' }]} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${136 + i * 8.5} 86V134`} stroke="#6f7883" stroke-width={2.4} />)}
      <OG sh={[{ d: ell([130, 110], 6, 26), f: '#9aa7b4' }]} />
      <Arrow from={[124, 66]} to={[150, 92]} color={K.water} w={4} />
      <T x={160} y={200} t="orta" s={14} />
      {/* pervane */}
      <OG sh={[{ d: rrect(222, 92, 88, 40, 6), f: '#c9d0d8' }]} />
      <OG sh={[{ d: ell([266, 112], 5, 18), f: '#6f7883' }, { d: ell([266, 112], 4, 4), f: K.out }]} />
      <Arrow from={[226, 112]} to={[254, 112]} color={K.water} w={4} />
      <T x={266} y={200} t="alçak" s={14} />
      <T x={160} y={36} t="düşü" s={14} c={BLUE} />
    </Scene2>
  ),
  'sf-ek-hidro-baglanti': () => <DumpSchema src="water" />,

  /* ───────── Rüzgâr türbini ───────── */
  'sf-ek-turbin-yer': () => (
    <Scene2 bg="outdoor" gy={200}>
      <HouseRoofTurbine x={14} y={214} />
      <Tree x={170} y={210} s={1.0} />
      <Turbine x={262} y={212} h={166} s={0.85} />
      <path d="M146 96H272" stroke={K.out} stroke-width={1.4} stroke-dasharray="4 3" />
      <path d="M220 63H262" stroke={K.out} stroke-width={1.4} stroke-dasharray="4 3" />
      <Dim a={[232, 63]} b={[232, 96]} t="" c={BLUE} />
      <Label x={194} y={70} text="9 m+" size={14} />
      <Bad x={56} y={110} />
    </Scene2>
  ),
  'sf-ek-turbin-direk': () => {
    // menteşeli direk yarı kaldırılmış; kaldırma kolu + vinç; çelik gergi halatları kazıklarda
    const hg: P = [170, 202], L = 140, ang = -38;
    const top = onC(hg, L, ang);
    const gin = onC(hg, 62, ang - 90);
    const winch: P = [40, 204];
    const mid = onC(hg, L * 0.6, ang);
    const stakes: P[] = [[96, 212], [252, 214], [298, 210]];
    return (
      <Scene2 bg="outdoor" gy={200}>
        {/* gergi halatları */}
        {stakes.map((p, i) => <Ln key={i} d={pl([mid, p])} c={IRON} w={1.6} />)}
        {stakes.map((p, i) => <OG key={i} sh={[{ d: rrect(p[0] - 2.5, p[1] - 8, 5, 12, 1), f: WOOD }]} />)}
        {/* vinç halatı */}
        <Ln d={pl([gin, [winch[0] + 8, winch[1] - 12]])} c={IRON} w={2} />
        <Ln d={pl([hg, top])} c="#9aa7b4" w={7} />
        <Ln d={pl([hg, gin])} c="#9aa7b4" w={5} />
        <OG sh={[{ d: rrect(hg[0] - 14, hg[1] - 2, 28, 12, 2), f: '#b8afa0' }, { d: circ(hg, 6), f: '#6f7883' }]} />
        <g transform={`rotate(${ang + 90} ${f1(top[0])} ${f1(top[1])})`}>
          <OG sh={[{ d: rrect(top[0] - 7, top[1] - 26, 14, 26, 4), f: '#e9e4d6' }, { d: capsule([top[0], top[1] - 26], 3, [top[0] - 38, top[1] - 36], 6), f: '#fbfaf5' }, { d: capsule([top[0], top[1] - 26], 3, [top[0] + 38, top[1] - 36], 6), f: '#fbfaf5' }]} />
        </g>
        {/* el vinci (kazığa bağlı) */}
        <OG sh={[{ d: rrect(winch[0] - 3, winch[1] - 12, 6, 24, 1), f: WOOD }, { d: rrect(winch[0] - 14, winch[1] - 22, 28, 20, 3), f: '#6f7883' }, { d: circ([winch[0], winch[1] - 12], 6), f: '#9aa7b4' }, { d: capsule([winch[0], winch[1] - 12], 2.5, [winch[0] - 14, winch[1] - 30], 2.5), f: IRON }]} />
        <ArcArrow c={hg} r={L + 18} a0={-34} a1={-68} />
      </Scene2>
    );
  },
  'sf-ek-turbin-bosaltma': () => <DumpSchema src="wind" />,

  /* ───────── Kategori kapağı: elektrik ───────── */
  'sf-ek-elektrik-kapak': () => {
    const bt = batT(40, 150, 86);
    return (
      <Scene2 bg="indoor" gy={206}>
        {/* pencere ve dışarıdaki panel */}
        <OG sh={[{ d: rrect(196, 26, 104, 86, 3), f: '#c2e4f4' }]} />
        <rect x={200} y={88} width={96} height={20} fill={K.grass} />
        <Sun x={278} y={44} r={9} />
        <g transform="rotate(-14 236 70)"><SolarPanel x={206} y={54} w={60} h={36} label="" /></g>
        <path d="M196 69H300M248 26V112" stroke={K.out} stroke-width={3} />
        {/* raf */}
        <OG sh={[{ d: rrect(20, 206 - 60, 140, 8, 2), f: WOOD }]} />
        <Battery x={40} y={150 - 56 + 0} w={86} h={50} />
        <Wire plus pts={[[bt.p[0], 88], [bt.p[0], 72], [140, 72], [140, 62]]} />
        <Wire pts={[[bt.m[0], 88], [bt.m[0], 80], [150, 80], [150, 62]]} />
        <Fuse c={[bt.p[0], 76]} a={90} />
        <OG sh={[{ d: rrect(124, 20, 44, 42, 4), f: '#5e7fa6' }, { d: rrect(131, 27, 30, 12, 2), f: '#cfe7d6' }]} />
        {/* LED lamba */}
        <Ln d={pl([[168, 40], [184, 40], [184, 128]])} c="#8a939e" w={2.5} />
        <OG sh={[{ d: circ([184, 142], 13), f: '#fff3a8' }, { d: rrect(178, 126, 12, 6, 2), f: IRON }]} />
        <Waves x={184} y={158} a={90} n={3} r={7} color="#f5b400" />
      </Scene2>
    );
  },

  /* ───────── Kablolama ───────── */
  'sf-ek-kablo-sigorta-yeri': () => {
    const B = { x: 24, y: 150, w: 104 };
    const bt = batT(B.x, B.y, B.w);
    return (
      <Scene2 bg="closeup">
        <Wire plus pts={[bt.p, [bt.p[0], 46], [276, 46]]} />
        <Wire plus pts={[[200, 46], [200, 104]]} />
        <Wire plus pts={[[276, 46], [276, 104]]} />
        <Wire pts={[bt.m, [bt.m[0], 132], [150, 132], [150, 214], [276, 214]]} />
        <Wire pts={[[200, 150], [200, 214]]} />
        <Wire pts={[[276, 150], [276, 214]]} />
        <Battery x={B.x} y={B.y} w={B.w} h={58} />
        <Fuse c={[bt.p[0], 120]} a={90} big />
        <Fuse c={[200, 74]} a={90} />
        <Fuse c={[276, 74]} a={90} />
        {/* yükler: lamba ve telefon şarjı */}
        <OG sh={[{ d: rrect(184, 104, 32, 46, 5), f: '#e9e4d6' }, { d: circ([200, 120], 10), f: '#fff3a8' }]} />
        <OG sh={[{ d: rrect(260, 104, 32, 46, 5), f: '#e9e4d6' }, { d: rrect(268, 112, 16, 26, 3), f: '#2f3542' }]} />
        <Arrow from={[96, 92]} to={[bt.p[0] + 16, 116]} w={4.5} />
      </Scene2>
    );
  },
  'sf-ek-kablo-kisa-devre': () => {
    const B = { x: 22, y: 128, w: 150 };
    const bt = batT(B.x, B.y, B.w);
    return (
      <Scene2 bg="closeup">
        <rect x={190} y={20} width={2} height={200} fill="#c6ced8" />
        <Battery x={B.x} y={B.y} w={B.w} h={84} />
        {/* terminallere aynı anda değen anahtar */}
        <OG sh={[{ d: capsule([bt.p[0] - 8, bt.p[1] - 6], 6, [bt.m[0] + 8, bt.m[1] - 6], 6), f: '#9aa7b4' }, { d: circ([bt.p[0] - 12, bt.p[1] - 6], 11), f: '#9aa7b4' }, { d: circ([bt.m[0] + 12, bt.m[1] - 6], 11), f: '#9aa7b4' }]} />
        {[bt.p, bt.m].map((p, i) => (
          <path key={i} d={`M${p[0]} ${p[1] - 30}l4 10l10 -4l-6 9l9 6l-11 0l-2 10l-4 -10l-10 4l6 -9l-9 -6l11 0z`} fill="#ffd23f" stroke={K.action} stroke-width={1.5} />
        ))}
        <No x={(bt.p[0] + bt.m[0]) / 2} y={bt.p[1] - 6} r={48} />
        {/* yüzük ve saat masada */}
        <OG sh={[{ d: rrect(204, 168, 104, 10, 2), f: WOOD }]} />
        <OG sh={[{ d: capsule([224, 166], 5, [264, 166], 5), f: '#6b4f3a' }, { d: circ([244, 160], 11), f: '#d9dde2' }, { d: circ([244, 160], 7), f: '#fbfaf5', ln: true }]} />
        <path d="M244 155V160L247 162" stroke={K.out} stroke-width={1.3} fill="none" />
        <OG sh={[{ d: ring([286, 160], 8, 5), f: '#f2c14e', fr: 'evenodd' }]} />
        <Ok x={256} y={100} r={16} />
      </Scene2>
    );
  },
  'sf-ek-kablo-sira': () => {
    const B = { x: 60, y: 140, w: 200 };
    const bt = batT(B.x, B.y, B.w);
    return (
      <Scene2 bg="closeup">
        <Battery x={B.x} y={B.y} w={B.w} h={84} />
        <Wire plus w={6} pts={[[10, 40], [bt.p[0], 40], [bt.p[0], bt.p[1] - 4]]} />
        <OG sh={[{ d: rrect(bt.p[0] - 9, bt.p[1] - 12, 18, 12, 3), f: '#c9a24a' }]} />
        <Wire w={6} pts={[[310, 30], [bt.m[0], 30], [bt.m[0], bt.m[1] - 40]]} />
        <OG sh={[{ d: rrect(bt.m[0] - 9, bt.m[1] - 48, 18, 12, 3), f: '#c9a24a' }]} />
        <Arrow from={[bt.m[0] + 26, bt.m[1] - 44]} to={[bt.m[0] + 26, bt.m[1] - 12]} w={5} />
        <Num x={bt.p[0] - 30} y={bt.p[1] - 30} n="1" bg={K.action} r={14} />
        <Num x={bt.m[0] - 30} y={bt.m[1] - 30} n="2" bg={K.action} r={14} />
      </Scene2>
    );
  },

  /* ───────── Akü ───────── */
  'sf-ek-aku-olcum': () => {
    const B = { x: 30, y: 120, w: 150 };
    const bt = batT(B.x, B.y, B.w);
    return (
      <Scene2 bg="closeup">
        <Battery x={B.x} y={B.y} w={B.w} h={90} />
        <Ln d={`M200 92Q120 40 ${bt.p[0]} ${bt.p[1] - 6}`} c={PLUS} w={3} />
        <Ln d={`M200 140Q170 140 ${bt.m[0]} ${bt.m[1] - 6}`} c={MINUS} w={3} />
        <OG sh={[{ d: capsule([bt.p[0], bt.p[1] - 18], 3, [bt.p[0], bt.p[1] - 2], 2), f: PLUS }, { d: capsule([bt.m[0], bt.m[1] - 18], 3, [bt.m[0], bt.m[1] - 2], 2), f: MINUS }]} />
        <OG sh={[{ d: rrect(200, 40, 96, 150, 10), f: '#f2c14e' }, { d: rrect(210, 52, 76, 40, 4), f: '#cfe0c8' }, { d: circ([248, 138], 22), f: '#3b3f4b' }]} />
        <path d="M248 138L248 120" stroke="#fff" stroke-width={3} stroke-linecap="round" />
        <text x={248} y={80} font-size={19} font-weight={700} fill={K.ink} text-anchor="middle">12,24</text>
        <text x={248} y={182} font-size={13} font-weight={700} fill={K.ink} text-anchor="middle">V</text>
        <Label x={104} y={226} text="%50" size={14} />
      </Scene2>
    );
  },
  'sf-ek-aku-havadar': () => (
    <Scene2 bg="indoor" gy={196}>
      <OG sh={[{ d: rrect(206, 36, 92, 86, 3), f: '#c2e4f4' }]} />
      <rect x={210} y={100} width={84} height={18} fill={K.grass} />
      <OG sh={[{ d: pl([[252, 40], [292, 30], [292, 116], [252, 118]]) + 'Z', f: tint('#c2e4f4', 0.4) }]} />
      <path d="M210 79H252M252 40V118" stroke={K.out} stroke-width={3} />
      <Battery x={110} y={156} w={90} h={52} />
      <OG sh={[{ d: rrect(112, 64, 86, 34, 5), f: '#5e7fa6' }, { d: rrect(122, 72, 30, 12, 2), f: '#cfe7d6' }]} />
      <Wire plus pts={[[128, 98], batT(110, 156, 90).p]} w={3} />
      <Wire pts={[[182, 98], batT(110, 156, 90).m]} w={3} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${140 + i * 16} 144q-5 -8 0 -15t0 -15`} stroke="#9aa7b4" stroke-width={3} fill="none" stroke-linecap="round" />)}
      <Arrow from={[176, 116]} to={[214, 100]} color="#8a939e" w={5} bend={-0.2} />
      <Flame x={34} y={120} s={0.8} />
      <No x={34} y={104} r={24} />
    </Scene2>
  ),
  'sf-ek-aku-su': () => (
    <Scene2 bg="closeup">
      {/* kesit: hücreler, plakalar, sıvı seviyesi */}
      <OG sh={[{ d: rrect(30, 112, 260, 116, 6), f: '#3d4250' }, { d: rrect(38, 122, 244, 100, 3), f: '#2b2f3a' }]} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={42 + i * 81} y={136} width={73} height={84} fill={tint(K.waterLight, 0.2)} />
          {Array.from({ length: 6 }, (_, j) => <rect key={j} x={48 + i * 81 + j * 11} y={152} width={6} height={64} fill={j % 2 ? '#6f7883' : '#8a6a4a'} stroke={K.out} stroke-width={0.8} />)}
          <rect x={115 + i * 81} y={124} width={8} height={98} fill="#3d4250" />
        </g>
      ))}
      <path d="M42 140H282" stroke={K.action} stroke-width={2.4} stroke-dasharray="6 4" />
      {/* kapaklar: sağdaki açık */}
      <OG sh={[{ d: rrect(68, 102, 22, 12, 3), f: '#5a5d68' }, { d: rrect(149, 102, 22, 12, 3), f: '#5a5d68' }]} />
      <rect x={230} y={108} width={22} height={8} fill="#1d2027" />
      {/* damıtık su şişesi */}
      <path d="M232 70Q238 90 240 112" stroke={K.out} stroke-width={7} fill="none" stroke-linecap="round" />
      <path d="M232 70Q238 90 240 112" stroke={K.water} stroke-width={4} fill="none" stroke-linecap="round" />
      <g transform="rotate(128 262 44)">
        <OG sh={[{ d: rrect(248, 14, 28, 56, 6), f: '#e8f4fb' }, { d: rrect(256, 4, 12, 12, 2), f: '#3a9be0' }, { d: rrect(248, 40, 28, 30, 6), f: K.waterLight, no: true }]} />
      </g>
    </Scene2>
  ),

  /* ───────── Güneş paneli bağlama ───────── */
  'sf-ek-panel-seri': () => (
    <Scene2 bg="closeup">
      <SolarPanel x={16} y={44} w={128} h={96} label="20 V · 5 A" />
      <SolarPanel x={176} y={44} w={128} h={96} label="20 V · 5 A" />
      <PolMarks xs={[[40, '−'], [120, '+'], [200, '−'], [280, '+']]} y={150} />
      <Wire plus pts={[[120, 140], [120, 172], [156, 172]]} />
      <Wire pts={[[200, 140], [200, 172], [164, 172]]} />
      <OG sh={[{ d: rrect(152, 166, 16, 12, 2), f: '#5a5d68' }]} />
      <Wire pts={[[40, 140], [40, 208], [138, 208]]} />
      <Wire plus pts={[[280, 140], [280, 208], [182, 208]]} />
      <OG sh={[{ d: rrect(138, 194, 44, 28, 4), f: '#5e7fa6' }]} />
      <Label x={160} y={22} text="40 V · 5 A" size={16} />
    </Scene2>
  ),
  'sf-ek-panel-paralel': () => <ParPanels />,
  'sf-ek-panel-sigorta': () => <ParPanels fuse />,

  /* ───────── Şarj kontrolcüsü ───────── */
  'sf-ek-kontrol-aku-once': () => <CtrlSchema stage={1} />,
  'sf-ek-kontrol-panel-sonra': () => <CtrlSchema stage={2} />,
  'sf-ek-kontrol-yuk': () => <CtrlSchema stage={3} />,

  /* ───────── İnvertör ───────── */
  'sf-ek-invertor-dalga': () => {
    const sine: P[] = Array.from({ length: 41 }, (_, i) => [24 + i * 3.2, 120 - 40 * Math.sin((i / 40) * 2 * Math.PI)]);
    const sq: P[] = [[172, 120], [180, 120], [180, 82], [208, 82], [208, 120], [220, 120], [220, 158], [248, 158], [248, 120], [258, 120], [258, 82], [286, 82], [286, 120], [298, 120]];
    return (
      <Scene2 bg="closeup">
        <rect x={160} y={30} width={2} height={180} fill="#c6ced8" />
        <path d="M20 120H150M168 120H300" stroke={K.out} stroke-width={1.5} opacity={0.5} />
        <Ln d={pl(sine)} c={K.safe} w={4} />
        <Ln d={pl(sq)} c={K.action} w={4} />
        <Ok x={84} y={40} r={16} />
        <g>
          <circle cx={236} cy={40} r={18} fill="#fff" />
          <circle cx={236} cy={40} r={16} fill={K.action} />
          <text x={236} y={48} font-size={22} font-weight={700} fill={K.ink} text-anchor="middle">!</text>
        </g>
        <T x={84} y={204} t="tam sinüs" s={15} />
        <T x={236} y={204} t="modifiye" s={15} />
      </Scene2>
    );
  },
  'sf-ek-invertor-sigorta': () => {
    const B = { x: 18, y: 126, w: 120 };
    const bt = batT(B.x, B.y, B.w);
    return (
      <Scene2 bg="closeup">
        <Wire plus w={6} pts={[bt.p, [bt.p[0], 76], [180, 76], [180, 124], [196, 124]]} />
        <Wire w={6} pts={[bt.m, [bt.m[0], 104], [160, 104], [160, 164], [196, 164]]} />
        <Battery x={B.x} y={B.y} w={B.w} h={80} />
        <Fuse c={[bt.p[0], 98]} a={90} big />
        {/* invertör */}
        <OG sh={[{ d: rrect(196, 96, 110, 100, 6), f: '#c9d0d8' }, { d: rrect(196, 96, 110, 14, 6), f: '#9aa7b4' }, { d: rrect(232, 140, 54, 40, 4), f: '#eef1f4' }, { d: rrect(216, 120, 12, 22, 3), f: '#3b3f4b' }]} />
        {[244, 262, 280].map((x) => <rect key={x} x={x - 1} y={150} width={2} height={20} fill={K.out} />)}
        <text x={222} y={156} font-size={11} font-weight={700} fill={K.ink} text-anchor="middle">0</text>
        <OG sh={[{ d: rrect(214, 132, 16, 8, 2), f: '#e9edf1' }]} />
        <Label x={100} y={40} text="≤ 2 m" size={15} />
      </Scene2>
    );
  },
  'sf-ek-invertor-priz': () => (
    <Scene2 bg="indoor" gy={200}>
      {/* doğru: lamba invertörün kendi prizinde */}
      <OG sh={[{ d: rrect(20, 168, 70, 44, 5), f: '#c9d0d8' }, { d: rrect(54, 178, 26, 24, 4), f: '#eef1f4' }]} />
      <Ln d="M67 190Q90 214 112 190V160" c="#eef1f4" w={3} />
      <OG sh={[{ d: rrect(100, 192, 26, 8, 2), f: '#6f7883' }, { d: rrect(110, 140, 6, 54, 2), f: '#6f7883' }, { d: pl([[94, 112], [132, 112], [124, 140], [102, 140]]) + 'Z', f: '#f2c14e' }]} />
      <Ok x={60} y={130} r={15} />
      <rect x={156} y={20} width={2} height={200} fill={shade(K.wall, 0.2)} />
      {/* yanlış: invertör çıkışı kabloyla duvar prizine (ev tesisatına) */}
      <OG sh={[{ d: rrect(186, 70, 40, 40, 6), f: '#fbfaf5' }, { d: circ([206, 90], 12), f: '#e9e4d6' }]} />
      <OG sh={[{ d: rrect(226, 168, 74, 44, 5), f: '#c9d0d8' }, { d: rrect(264, 178, 26, 24, 4), f: '#eef1f4' }]} />
      <Ln d="M277 190Q262 140 214 96" c="#eef1f4" w={4} />
      <OG sh={[{ d: rrect(197, 81, 18, 18, 4), f: '#3b3f4b' }, { d: rrect(268, 183, 18, 14, 3), f: '#3b3f4b' }]} />
      <No x={240} y={140} r={56} />
    </Scene2>
  ),

  /* ───────── Kategori kapağı: kimya ───────── */
  'sf-ek-kimya-kapak': () => {
    const pot: P = [176, 170];
    return (
      <Scene2 bg="outdoor" gy={196}>
        {/* ateş ve kazan */}
        <Flame x={pot[0] - 14} y={212} s={0.9} />
        <Flame x={pot[0] + 14} y={212} s={0.8} />
        <OG sh={[{ d: rrect(pot[0] - 52, 196, 18, 16, 4), f: STONE }, { d: rrect(pot[0] + 34, 196, 18, 16, 4), f: STONE }]} />
        <OG sh={[{ d: `M${pot[0] - 46} ${pot[1] - 30}H${pot[0] + 46}L${pot[0] + 40} ${pot[1] + 10}Q${pot[0]} ${pot[1] + 32} ${pot[0] - 40} ${pot[1] + 10}Z`, f: '#4b4f5a' }, { d: ell([pot[0], pot[1] - 30], 46, 7), f: '#d9d2bf' }]} />
        {[0, 1].map((i) => <path key={i} d={`M${pot[0] - 10 + i * 22} ${pot[1] - 44}q-5 -8 0 -16t0 -16`} stroke="#c7ccd3" stroke-width={3} fill="none" stroke-linecap="round" />)}
        <Ln d={pl([[pot[0] + 10, pot[1] - 30], [pot[0] - 40, 66]])} c={WOOD} w={4} />
        <Person {...CAST.ayse} glasses x={84} y={222} pose={{ ...POSE.standSide, spine: -84, armB: { to: [pot[0] - 29, 82] }, armF: { to: [pot[0] - 20, 96] }, handB: 'fist', handF: 'fist', face: 'neutral' }} />
        {/* mum, mürekkep, kâğıt */}
        <OG sh={[{ d: rrect(254, 166, 14, 34, 2), f: '#f6efd6' }]} />
        <Flame x={261} y={166} s={0.35} />
        <OG sh={[{ d: rrect(280, 180, 22, 20, 4), f: '#2b2f5a' }, { d: rrect(286, 172, 10, 9, 2), f: '#6b4f3a' }]} />
        <OG sh={[{ d: pl([[236, 212], [300, 206], [304, 216], [240, 222]]) + 'Z', f: '#f3ecdc' }]} />
      </Scene2>
    );
  },
};
