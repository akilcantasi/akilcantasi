// Hava olayları — sıcak çarpması, yıldırım, kar fırtınası, çığ, toz fırtınası, hortum, sıcak dalgası, dolu.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Blanket, Bottle, Car, Chair, Door, Drop, Flame, GY, Hand, HouseExt, K, Label, No, OG, Ok, Person, Phone, POSE,
  Scene2, Table, Timer, Tree, Water, Waves, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { P, PersonProps, Rig, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);

const STORM = '#5e6778';
const DUST = '#c08a4e';
const SNOW = '#eef3f6';
const ASPH = '#6f7178';

/** Güneş. Merkez x,y */
function Sun({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = i * 45;
    const p1 = pol([x, y], a, r + 6), p2 = pol([x, y], a, r + 14);
    return `M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`;
  }).join('');
  return (
    <g>
      <path d={rays} stroke={K.out} stroke-width={7.5} stroke-linecap="round" />
      <path d={rays} stroke="#ffc83a" stroke-width={4.5} stroke-linecap="round" />
      <OG sh={[{ d: circ([x, y], r), f: '#ffc83a' }, { d: circ([x - r * 0.3, y - r * 0.3], r * 0.35), f: '#ffe48a', no: true }]} />
    </g>
  );
}

/** Ay (hilal). Merkez x,y */
function Moon({ x, y, r = 14, bg = K.nightSky }: { x: number; y: number; r?: number; bg?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#f4eccb" />
      <circle cx={x - r * 0.45} cy={y - r * 0.35} r={r * 0.9} fill={bg} />
    </g>
  );
}

/** Bulut. x,y = taban ortası, w genişlik */
function Cloud({ x, y, w = 100, color = '#e9eef3' }: { x: number; y: number; w?: number; color?: string }) {
  const k = w / 100;
  const d = `M${x - 46 * k} ${y}C${x - 62 * k} ${y} ${x - 62 * k} ${y - 26 * k} ${x - 42 * k} ${y - 28 * k}C${x - 40 * k} ${y - 48 * k} ${x - 14 * k} ${y - 54 * k} ${x - 4 * k} ${y - 40 * k}C${x + 6 * k} ${y - 62 * k} ${x + 40 * k} ${y - 58 * k} ${x + 40 * k} ${y - 30 * k}C${x + 60 * k} ${y - 30 * k} ${x + 62 * k} ${y} ${x + 46 * k} ${y}Z`;
  return <OG sh={[{ d, f: color }, { d: `M${x - 40 * k} ${y - 7 * k}H${x + 44 * k}`, st: shade(color, 0.15), sw: 3.5 * k }]} />;
}

/** Fırtınalı gökyüzü + koyu tepeler (Scene2 outdoor üzerine). */
function StormSky({ gy = GY, c = STORM, hill = '#56704f', clouds = true }: { gy?: number; c?: string; hill?: string; clouds?: boolean }) {
  return (
    <g>
      <rect width={320} height={gy} fill={c} />
      <rect y={gy - 70} width={320} height={70} fill={tint(c, 0.12)} />
      <path d={`M0 ${gy - 18}Q60 ${gy - 42} 130 ${gy - 22}T260 ${gy - 26}T320 ${gy - 30}V${gy}H0Z`} fill={hill} />
      {clouds && (
        <g>
          <Cloud x={70} y={46} w={130} color="#434a58" />
          <Cloud x={230} y={40} w={150} color="#3c4250" />
          <Cloud x={160} y={30} w={110} color="#4a5262" />
        </g>
      )}
    </g>
  );
}

/** Şimşek. x,y = üst uç; s ölçek */
function Bolt({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[{ d: 'M0 0L-13 38H-2L-16 80L18 28H6L15 0Z', f: '#ffd84a' }, { d: 'M6 28H18L-16 80Z', f: '#f2b72a', no: true }]} />
    </G>
  );
}

/** Dolu tanesi */
function Hail({ x, y, r = 4.2, trail = true }: { x: number; y: number; r?: number; trail?: boolean }) {
  return (
    <g>
      {trail && <path d={`M${x - 2} ${y - r - 3}l-3 -9`} stroke="#ffffff" stroke-width={1.6} opacity={0.7} stroke-linecap="round" />}
      <circle cx={x} cy={y} r={r} fill="#eef7fc" stroke={K.out} stroke-width={1.2} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff" />
    </g>
  );
}
/** Dolu yağışı: alan içine yerleştirilmiş taneler */
function HailFall({ x1, x2, y1, y2, n = 18, seed = 1 }: { x1: number; x2: number; y1: number; y2: number; n?: number; seed?: number }) {
  const out: P[] = [];
  let v = seed * 9301 + 49297;
  const rnd = () => ((v = (v * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) out.push([x1 + rnd() * (x2 - x1), y1 + rnd() * (y2 - y1)]);
  return <g>{out.map((p, i) => <Hail key={i} x={p[0]} y={p[1]} r={3.4 + (i % 3) * 0.8} />)}</g>;
}
/** Yağmur çizgileri */
function Rain({ x1, x2, y1, y2, n = 24, seed = 3, c = '#a9c9e8' }: { x1: number; x2: number; y1: number; y2: number; n?: number; seed?: number; c?: string }) {
  let v = seed * 7919 + 17;
  const rnd = () => ((v = (v * 9301 + 49297) % 233280) / 233280);
  const d = Array.from({ length: n }, () => {
    const x = x1 + rnd() * (x2 - x1), y = y1 + rnd() * (y2 - y1);
    return `M${f1(x)} ${f1(y)}l-4 12`;
  }).join('');
  return <path d={d} stroke={c} stroke-width={1.8} stroke-linecap="round" opacity={0.8} />;
}
/** Kar taneleri (noktalar) */
function SnowFall({ x1 = 0, x2 = 320, y1 = 0, y2 = 200, n = 30, seed = 5, wind = 0 }: { x1?: number; x2?: number; y1?: number; y2?: number; n?: number; seed?: number; wind?: number }) {
  let v = seed * 7919 + 17;
  const rnd = () => ((v = (v * 9301 + 49297) % 233280) / 233280);
  return (
    <g fill="#fff">
      {Array.from({ length: n }, (_, i) => {
        const x = x1 + rnd() * (x2 - x1), y = y1 + rnd() * (y2 - y1);
        return wind ? (
          <path key={i} d={`M${f1(x)} ${f1(y)}l${wind} 3`} stroke="#fff" stroke-width={2.6} stroke-linecap="round" opacity={0.9} />
        ) : (
          <circle key={i} cx={x} cy={y} r={1.6 + (i % 3) * 0.6} opacity={0.92} />
        );
      })}
    </g>
  );
}

/** Vurgu halkası (beyaz altlıklı) */
function Ring({ x, y, r, c = K.water, w = 3 }: { x: number; y: number; r: number; c?: string; w?: number }) {
  return (
    <g fill="none">
      <circle cx={x} cy={y} r={r} stroke="#fff" stroke-width={w + 2.5} opacity={0.7} />
      <circle cx={x} cy={y} r={r} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Ek çerçeve (beyaz kart + kırpma) */
let insetUid = 0;
function Inset({ x, y, w, h, children, bg = '#fff' }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; bg?: string }) {
  const id = 'hv-in-' + ++insetUid;
  return (
    <g>
      <rect x={x - 1} y={y + 2} width={w + 2} height={h + 2} rx={11} fill="#000" opacity={0.18} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill={bg} />
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={10} />
      </clipPath>
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Kırpma grubu (yol ile) */
let clipUid = 0;
function Clip({ d, children }: { d: string; children?: ComponentChildren }) {
  const id = 'hv-cl-' + ++clipUid;
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <g clip-path={`url(#${id})`}>{children}</g>
    </g>
  );
}

/** Sıcaklık dalgaları (dikey kıvrımlar) */
function HeatWaves({ x, y, n = 3, gap = 16, h = 26, c = '#f2a33a' }: { x: number; y: number; n?: number; gap?: number; h?: number; c?: string }) {
  return (
    <g fill="none" stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const xx = x + (i - (n - 1) / 2) * gap;
        const d = `M${xx} ${y}q-5 ${-h / 4} 0 ${-h / 2}t0 ${-h / 2}`;
        return (
          <g key={i}>
            <path d={d} stroke={K.out} stroke-width={5} />
            <path d={d} stroke={c} stroke-width={3} />
          </g>
        );
      })}
    </g>
  );
}

/** Hava akımı çizgileri (yatay kıvrımlı) */
function Breeze({ x, y, len = 50, n = 3, gap = 10, c = '#ffffff', dir = 1, w = 2.6 }: { x: number; y: number; len?: number; n?: number; gap?: number; c?: string; dir?: 1 | -1; w?: number }) {
  return (
    <g fill="none" stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const yy = y + (i - (n - 1) / 2) * gap;
        const l = len * (i === 1 ? 1 : 0.75);
        const d = `M${x} ${yy}q${(dir * l) / 4} -5 ${(dir * l) / 2} 0t${(dir * l) / 2} 0`;
        return (
          <g key={i}>
            <path d={d} stroke={K.out} stroke-width={w + 2} opacity={0.5} />
            <path d={d} stroke={c} stroke-width={w} />
          </g>
        );
      })}
    </g>
  );
}

/** Hortum (huni). x,y = yere değdiği nokta, h boy */
function Tornado({ x, y, h = 150, w = 90, c = '#7d8592' }: { x: number; y: number; h?: number; w?: number; c?: string }) {
  const top = y - h;
  const d = `M${x - w / 2} ${top}C${x - w / 2 + 6} ${top + h * 0.35} ${x - 14} ${top + h * 0.55} ${x - 6} ${y - 8}Q${x} ${y + 2} ${x + 6} ${y - 8}C${x + 16} ${top + h * 0.55} ${x + w / 2 - 4} ${top + h * 0.35} ${x + w / 2} ${top}Z`;
  const bands = [0.12, 0.3, 0.48, 0.66, 0.82].map((t) => {
    const yy = top + h * t;
    const hw = (w / 2) * (1 - t) ** 1.25 + 5;
    return `M${f1(x - hw)} ${f1(yy)}Q${x} ${f1(yy + 6)} ${f1(x + hw)} ${f1(yy - 3)}`;
  }).join('');
  return (
    <g>
      <ellipse cx={x} cy={y + 2} rx={30} ry={7} fill={shade(c, 0.1)} opacity={0.6} />
      <OG sh={[{ d, f: c }, { d: bands, st: shade(c, 0.28), sw: 2.2 }]} />
      <g fill={shade(c, 0.2)}>
        <circle cx={x - 22} cy={y - 6} r={3} />
        <circle cx={x + 24} cy={y - 12} r={2.4} />
        <rect x={x + 30} y={y - 30} width={6} height={3} transform={`rotate(30 ${x + 33} ${y - 28})`} />
      </g>
    </g>
  );
}

/** Toz bulutu katmanı */
function DustCloud({ x = 0, y = 0, w = 320, h = 120, op = 0.85, c = DUST }: { x?: number; y?: number; w?: number; h?: number; op?: number; c?: string }) {
  const n = Math.max(3, Math.round(w / 34));
  const st = w / n;
  return (
    <g opacity={op}>
      <rect x={x} y={y} width={w} height={h * 0.62} fill={c} />
      {Array.from({ length: n }, (_, i) => (
        <circle key={'a' + i} cx={x + st * (i + 0.5)} cy={y + h * 0.62} r={st * 0.66 + (i % 2) * 4} fill={shade(c, 0.12)} />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <circle key={'b' + i} cx={x + st * (i + 0.5) - 5} cy={y + h * 0.56} r={st * 0.56 + (i % 2) * 4} fill={c} />
      ))}
    </g>
  );
}
/** Toz zerreleri */
function Specks({ x1, x2, y1, y2, n = 26, seed = 2, c = '#8a5a2c' }: { x1: number; x2: number; y1: number; y2: number; n?: number; seed?: number; c?: string }) {
  let v = seed * 7919 + 17;
  const rnd = () => ((v = (v * 9301 + 49297) % 233280) / 233280);
  return (
    <g fill={c} opacity={0.7}>
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={x1 + rnd() * (x2 - x1)} cy={y1 + rnd() * (y2 - y1)} r={1 + (i % 3) * 0.6} />)}
    </g>
  );
}

/** Bere (başın üstüne). */
function Beanie({ r, c = '#c6574e', lift = 0 }: { r: Rig; c?: string; lift?: number }) {
  const hx = r.head[0], hy = r.head[1] - lift * r.headR;
  const Rr = r.headR;
  return (
    <OG
      sh={[
        { d: `M${hx - Rr * 1.06} ${hy - Rr * 0.12}C${hx - Rr * 1.1} ${hy - Rr * 1.3} ${hx + Rr * 1.1} ${hy - Rr * 1.3} ${hx + Rr * 1.06} ${hy - Rr * 0.12}Z`, f: c },
        { d: rrect(hx - Rr * 1.12, hy - Rr * 0.46, Rr * 2.24, Rr * 0.46, Rr * 0.15), f: shade(c, 0.15) },
        { d: circ([hx, hy - Rr * 1.12], Rr * 0.3), f: tint(c, 0.4) },
      ]}
    />
  );
}

/** Kürek: tutamaktan (a) bıçağa (b) */
function Shovel({ a, b, c = '#d84a3a' }: { a: P; b: P; c?: string }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  const t0 = pol(b, ang + 90, 11), t1 = pol(b, ang - 90, 11);
  const e0 = pol(t0, ang, 24), e1 = pol(t1, ang, 24);
  const tip = pol(b, ang, 30);
  const blade = `M${f1(t0[0])} ${f1(t0[1])}L${f1(e0[0])} ${f1(e0[1])}Q${f1(tip[0])} ${f1(tip[1])} ${f1(e1[0])} ${f1(e1[1])}L${f1(t1[0])} ${f1(t1[1])}Z`;
  const gr = pol(a, ang, -8);
  return <OG sh={[{ d: capsule(gr, 3.2, b, 2.6), f: '#8a5a3a' }, { d: capsule(pol(gr, ang + 90, 6), 2.6, pol(gr, ang - 90, 6), 2.6), f: '#3b3f4b' }, { d: blade, f: c }]} />;
}
/** Sopa / sonda: a→b düz çubuk */
function Stick({ a, b, w = 2.6, c = '#c9ccd2' }: { a: P; b: P; w?: number; c?: string }) {
  return <OG sh={[{ d: capsule(a, w, b, w), f: c }]} />;
}

/** Buz torbası (beze sarılı). Merkez */
function IceBag({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-14, -9, 28, 18, 6), f: '#f4f1ea' }, { d: 'M-14 -2H14', st: '#d7d1c4', sw: 1.4 }]} />
      <rect x={-8} y={-5} width={6} height={6} rx={1.2} fill="#bfe6fb" stroke={K.water} stroke-width={1} />
      <rect x={2} y={-3} width={6} height={6} rx={1.2} fill="#bfe6fb" stroke={K.water} stroke-width={1} />
    </G>
  );
}

/** Buz küpü */
function Cube({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.3 / s} sh={[{ d: rrect(-6, -6, 12, 12, 2.5), f: '#dff3fd' }, { d: 'M-3 -3L1 -3', st: '#fff', sw: 2 }]} />
    </G>
  );
}

/** Ev içi duvar arası oda (kesit) — x,y SOL ÜST */
function Room({ x, y, w, h, wall = K.wall, floor = K.floor }: { x: number; y: number; w: number; h: number; wall?: string; floor?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={wall} />
      <rect x={x} y={y + h - 8} width={w} height={8} fill={floor} />
      <rect x={x} y={y + h - 14} width={w} height={6} fill={shade(wall, 0.08)} />
    </g>
  );
}

/** Odun sobası (yandan). x,y = taban ortası */
function WoodStove({ x, y, s = 1, pipe = 120 }: { x: number; y: number; s?: number; pipe?: number }) {
  const body = '#4a4f5a';
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-6, -64 - pipe, 12, pipe + 4, 1), f: '#6c727d' },
          { d: rrect(-22, -8, 6, 8, 1), f: shade(body, 0.2) },
          { d: rrect(16, -8, 6, 8, 1), f: shade(body, 0.2) },
          { d: rrect(-26, -62, 52, 56, 5), f: body },
          { d: rrect(-28, -66, 56, 7, 2), f: shade(body, 0.15) },
          { d: rrect(-16, -48, 32, 28, 3), f: '#2a2d33', ln: true },
        ]}
      />
      <Flame x={0} y={-22} s={0.42} />
      <path d="M-14 -34H14M-14 -26H14" stroke="#ffb35a" stroke-width={1} opacity={0.4} />
    </G>
  );
}

/** Koltuk (yandan, sırtlık sağda). x = SOL, y = zemin */
function Armchair({ x, y, w = 70, c = '#7c8fbf' }: { x: number; y: number; w?: number; c?: string }) {
  return (
    <OG
      sh={[
        { d: rrect(x + 4, y - 8, 6, 8, 1), f: K.wood },
        { d: rrect(x + w - 10, y - 8, 6, 8, 1), f: K.wood },
        { d: rrect(x + w - 18, y - 84, 18, 78, 8), f: shade(c, 0.12) },
        { d: rrect(x, y - 40, w, 32, 6), f: c },
        { d: rrect(x - 2, y - 52, 20, 44, 7), f: tint(c, 0.08) },
      ]}
    />
  );
}

/** Perde (karşıdan). x,y = SOL ÜST korniş, w genişlik, h boy, open 0..1 (0 = kapalı) */
function Curtain({ x, y, w, h, open = 0.5, c = '#c8614f' }: { x: number; y: number; w: number; h: number; open?: number; c?: string }) {
  const pw = (w / 2) * (1 - open * 0.75);
  const panel = (x0: number, dir: 1 | -1) => {
    const x1 = x0 + dir * pw;
    const d = `M${x0} ${y}H${x1}Q${x1 - dir * 4} ${y + h / 2} ${x1 + dir * 2} ${y + h}H${x0}Z`;
    const folds = [0.3, 0.62].map((t) => `M${f1(x0 + dir * pw * t)} ${y + 4}V${y + h - 2}`).join('');
    return [{ d, f: c }, { d: folds, st: shade(c, 0.22), sw: 1.6 }] as Sh[];
  };
  return (
    <g>
      <OG sh={[...panel(x, 1), ...panel(x + w, -1)]} />
      <OG sh={[{ d: rrect(x - 6, y - 5, w + 12, 5, 2), f: '#8a6a4a' }]} />
    </g>
  );
}

/** Çamaşır askısı (kurutmalık) + çamaşırlar. x = SOL, y = zemin */
function Laundry({ x, y, w = 60, h = 60 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <OG
        sh={[
          { d: capsule([x + 4, y], 2, [x + 10, y - h], 2), f: K.metal },
          { d: capsule([x + w - 4, y], 2, [x + w - 10, y - h], 2), f: K.metal },
          { d: capsule([x + 6, y - h], 2, [x + w - 6, y - h], 2), f: K.metal },
        ]}
      />
      <OG
        sh={[
          { d: `M${x + 10} ${y - h}h18l-2 30h-14Z`, f: '#7aa6d6' },
          { d: `M${x + 30} ${y - h}h20l-3 22h-14Z`, f: '#f2c14e' },
        ]}
      />
    </g>
  );
}

/** Televizyon (sehpada). x = SOL, y = zemin */
function Tv({ x, y, w = 110, h = 66, screen = '#24303f' }: { x: number; y: number; w?: number; h?: number; screen?: string }) {
  return (
    <OG
      sh={[
        { d: rrect(x, y - 36, w, 36, 3), f: K.wood },
        { d: `M${x + 8} ${y - 26}H${x + w - 8}`, st: shade(K.wood, 0.25), sw: 1.4 },
        { d: rrect(x + w / 2 - 14, y - 44, 28, 8, 2), f: '#30333b' },
        { d: rrect(x + 4, y - 44 - h, w - 8, h, 4), f: '#30333b' },
        { d: rrect(x + 9, y - 39 - h, w - 18, h - 10, 2), f: screen, ln: true },
        { d: `M${x + 16} ${y - 32 - h + 4}l14 -0`, st: '#ffffff', sw: 0 },
      ]}
    />
  );
}

/** Duvar prizi (karşıdan). Merkez */
function Socket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-20, -20, 40, 40, 7), f: '#f7f5f0' }, { d: circ([0, 0], 13), f: '#e7e3da', ln: true }]} />
      <circle cx={-5} cy={0} r={2.4} fill={K.ink} />
      <circle cx={5} cy={0} r={2.4} fill={K.ink} />
    </G>
  );
}
/** Fiş (yatay; uçlar sola). x,y = gövdenin merkezi */
function Plug({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([-26, -4], 1.6, [-14, -4], 1.6), f: K.metal },
          { d: capsule([-26, 4], 1.6, [-14, 4], 1.6), f: K.metal },
          { d: 'M-14 -11Q-14 -13 -12 -13H8Q16 -10 18 -4V4Q16 10 8 13H-12Q-14 13 -14 11Z', f: '#f2f0ea' },
          { d: 'M-8 -13V13', st: '#d5d1c6', sw: 1.4 },
        ]}
      />
    </G>
  );
}

/** Kablo (yumuşak yol) */
function Cable({ pts, c = '#e9e6de' }: { pts: P[]; c?: string }) {
  const d = smooth(pts);
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke={K.out} stroke-width={6} />
      <path d={d} stroke={c} stroke-width={3.4} />
    </g>
  );
}

/** Duvar saati. Merkez */
function WallClock({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#fff' }, { d: circ([x, y], r - 3.5), f: '#fff', ln: true }]} />
      {Array.from({ length: 12 }, (_, i) => {
        const p1 = pol([x, y], i * 30, r - 6), p2 = pol([x, y], i * 30, r - 8.5);
        return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={K.ink} stroke-width={1.2} />;
      })}
      <path d={`M${x} ${y - r * 0.6}V${y}L${x + r * 0.42} ${y + r * 0.2}`} stroke={K.ink} stroke-width={2.2} fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  );
}

/** Masa saati (ayaklı). x,y = taban ortası */
function DeskClock({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  const c: P = [x, y - r - 5];
  return (
    <g>
      <OG sh={[{ d: capsule([x - r * 0.6, y], 2.4, [x - r * 0.4, c[1]], 2.4), f: '#8a6a4a' }, { d: capsule([x + r * 0.6, y], 2.4, [x + r * 0.4, c[1]], 2.4), f: '#8a6a4a' }]} />
      <OG sh={[{ d: circ([c[0] - r * 0.55, c[1] - r * 0.85], 5), f: K.action }, { d: circ([c[0] + r * 0.55, c[1] - r * 0.85], 5), f: K.action }, { d: circ(c, r), f: '#3e6f8f' }, { d: circ(c, r - 4), f: '#fff', ln: true }]} />
      <path d={`M${c[0]} ${c[1] - r * 0.55}V${c[1]}L${c[0] + r * 0.4} ${c[1] + r * 0.22}`} stroke={K.ink} stroke-width={2.2} fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  );
}

/** Su bardağı. x,y = taban ortası */
function Glass({ x, y, s = 1, a = 0, fill = 0.7 }: { x: number; y: number; s?: number; a?: number; fill?: number }) {
  const h = 22;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.3 / s} sh={[{ d: `M-8 ${-h}H8L6.5 0H-6.5Z`, f: '#e4f3fb', op: 0.95 }, { d: `M${-8 + 1.5 * (1 - fill)} ${-h * fill}H${8 - 1.5 * (1 - fill)}L6.5 0H-6.5Z`, f: K.waterLight, no: true }, { d: `M-4 ${-h + 4}V-4`, st: '#fff', sw: 1.6 }]} />
    </G>
  );
}
/** Sürahi. x,y = taban ortası */
function Jug({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.4 / s}
        sh={[
          { d: 'M14 -40Q28 -38 26 -24Q24 -14 14 -12', st: K.out, sw: 4 },
          { d: 'M-12 -46H10L14 -40Q16 -20 14 -2Q14 0 12 0H-12Q-14 0 -14 -2Q-16 -20 -14 -40Z', f: '#e4f3fb' },
          { d: 'M-14.6 -30H14.8Q16 -20 14 -2Q14 0 12 0H-12Q-14 0 -14 -2Q-16 -20 -14.6 -30Z', f: K.waterLight, no: true },
          { d: 'M-12 -46L-20 -50L-14 -40Z', f: '#e4f3fb' },
          { d: 'M-7 -26V-8', st: '#fff', sw: 2 },
        ]}
      />
    </G>
  );
}

/** El yelpazesi. Merkez (sap ucu) x,y; a yön */
function HandFan({ x, y, s = 1, a = 0, c = '#e8a33a' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.4 / s} sh={[{ d: 'M0 0L-22 -26A34 34 0 0 1 22 -26Z', f: c }, { d: 'M0 0L-11 -31M0 0V-34M0 0L11 -31', st: shade(c, 0.3), sw: 1.2 }, { d: capsule([0, 0], 2.2, [0, 8], 2.2), f: '#8a5a3a' }]} />
    </G>
  );
}

/** Köpek (yandan, sağa bakar). x,y = taban */
function Dog({ x, y, s = 1, color = '#b9814d', flip }: { x: number; y: number; s?: number; color?: string; flip?: boolean }) {
  const dk = shade(color, 0.22);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: ell([2, -30], 26, 13), f: color },
          { d: capsule([22, -34], 8, [30, -50], 8), f: color },
          { d: ell([34, -56], 12, 11), f: color },
          { d: capsule([40, -52], 7, [50, -50], 6), f: tint(color, 0.15) },
          { d: 'M28 -64Q22 -54 26 -44Q32 -50 32 -60Z', f: dk },
        ]}
      />
      <circle cx={52} cy={-52} r={2.6} fill={K.ink} />
      <circle cx={38} cy={-58} r={2} fill={K.ink} />
      <path d="M46 -45Q50 -40 53 -45" stroke={K.out} stroke-width={1.3} fill="#e86a6a" stroke-linecap="round" />
    </g>
  );
}

/** Kıvılcım */
function Spark({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  const pts: P[] = [];
  for (let i = 0; i < 16; i++) pts.push(pol([x, y], i * 22.5 - 90, i % 2 ? r * 0.38 : r));
  const d = 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
  return (
    <g>
      <OG sh={[{ d, f: '#ffd84a' }, { d: circ([x, y], r * 0.3), f: '#fff6c2', no: true }]} />
    </g>
  );
}

/** Yolcu yeri / çocuk koltuğu (yandan; sırtlık solda). x = SOL, y = oturak altı */
function CarSeat({ x, y, s = 1, c = '#3b3f4b' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.4 / s} sh={[{ d: 'M0 0V-44Q0 -50 6 -50H10Q14 -50 14 -44V-14H34Q38 -14 38 -10V0Z', f: c }, { d: 'M14 -14H34', st: tint(c, 0.25), sw: 1.4 }]} />
    </G>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

/** Kar yığını (düz alt) */
const snowPile = (x1: number, x2: number, y: number, h: number) =>
  `M${x1} ${y}C${x1 + (x2 - x1) * 0.15} ${y - h} ${x1 + (x2 - x1) * 0.45} ${y - h * 1.1} ${x1 + (x2 - x1) * 0.6} ${y - h * 0.9}C${x1 + (x2 - x1) * 0.8} ${y - h * 0.8} ${x2 - 4} ${y - h * 0.4} ${x2} ${y}Z`;

/* ════════════════════════ rehber oyuncuları (CAST) ════════════════════════
 * Her rehberde bütün adımlarda aynı kişiler görünür. Sahnelerde {...CAST.x, pose: …} ile yayılır. */
type Cast = Omit<PersonProps, 'x' | 'y'>;
/** sıcak çarpması */
const SC: Record<'victim' | 'helper' | 'helper2', Cast> = {
  victim: { who: 'man', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.dark, bottomC: K.pants.dark },
  helper: { who: 'woman', role: 'helper', skin: 2, hair: 'bun', hairC: K.hair.black, bottomC: '#6b5a4e' },
  helper2: { who: 'man', role: 'bystander2', skin: 0, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.denim },
};
/** fırtına-yıldırım: "sen" + yıldırım çarpan kişi */
const FY: Record<'you' | 'victim', Cast> = {
  you: { who: 'woman', role: 'helper', skin: 2, hair: 'bun', hairC: K.hair.black, bottomC: '#6b5a4e' },
  victim: { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown },
};
/** kar fırtınası: "sen" (mavi mont) + aile */
const KF: Record<'you' | 'grandma' | 'kid', Cast> = {
  you: { who: 'man', role: 'helper', top: '#2f5d9a', sleeve: 'long', skin: 1, hair: 'short', hairC: K.hair.dark, bottomC: K.pants.dark },
  grandma: { who: 'oldwoman', role: 'bystander', skin: 1 },
  kid: { who: 'girl', role: 'bystander3', skin: 1, hair: 'ponytail', hairC: K.hair.dark },
};
/** çığ: çığa yakalanan (kırmızı mont) + kurtarıcı arkadaş */
const CG: Record<'victim' | 'rescuer', Cast> = {
  victim: { who: 'man', role: 'helper2', top: '#d84a3a', sleeve: 'long', skin: 1, hair: 'short', hairC: K.hair.dark, bottomC: K.pants.dark },
  rescuer: { who: 'woman', role: 'helper', sleeve: 'long', skin: 0, hair: 'ponytail', hairC: K.hair.brown, bottomC: K.pants.dark },
};
/** toz fırtınası */
const TZ: Record<'you', Cast> = { you: { who: 'woman', role: 'bystander', skin: 1, hair: 'scarf', hairC: '#c6574e' } };
/** hortum */
const HR: Record<'you' | 'kid', Cast> = {
  you: { who: 'man', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.dark },
  kid: { who: 'boy', role: 'bystander3', skin: 1, hair: 'short', hairC: K.hair.dark },
};
/** sıcak dalgası */
const SD: Record<'you', Cast> = { you: { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.dark } };
/** dolu */
const DL: Record<'you' | 'kid', Cast> = {
  you: { who: 'man', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.dark },
  kid: { who: 'girl', role: 'bystander3', skin: 1, hair: 'ponytail', hairC: K.hair.brown },
};

/** Kalp masajı (yan görünüş): kurtarıcı yaralının uzak yanında diz çökmüş, kollar düz, omuzlar ellerin üstünde. */
function CprScene({ victim, rescuer, bg = 'indoor', ground }: { victim: Cast; rescuer: Cast; bg?: 'indoor' | 'outdoor'; ground?: 'snow' | 'grass' }) {
  const vp: PersonProps = { ...victim, x: 168, y: 228, s: 1.25, pose: POSE.lieBack, face: 'closed' };
  const v = rig(vp);
  const c: P = [v.chest[0], v.chest[1]];
  const rp: PersonProps = {
    ...rescuer, x: c[0], ax: 'wristF', y: 225, s: 1.25, flip: true, face: 'neutral',
    pose: { spine: -60, chest: -58, head: -40, legB: [92, 182], legF: [86, 180], armB: [90, 90], armF: [90, 90], handB: { shape: 'flat', a: -90 }, handF: { shape: 'flat', a: -86 } },
  };
  const r = rig(rp);
  return (
    <Scene2 bg={bg} ground={ground}>
      {ground === 'snow' && <SnowFall y2={190} n={18} />}
      <Person {...rp} />
      <Person {...vp} />
      <Arrow from={[r.shoulderF[0] + 14, r.shoulderF[1] - 58]} to={[r.shoulderF[0] + 14, r.shoulderF[1] - 14]} w={7} />
      <Label x={252} y={36} text="100–120/dk" size={15} />
    </Scene2>
  );
}

export const SCENES: Record<string, ArtFn> = {
  /* ─────────── sıcak çarpması ─────────── */

  'hava-golgeye-al': () => {
    // Yardımcı, bilinci bulanık kişiyi belinden sarıp kolunu omzuna alarak ağacın gölgesine yürütüyor.
    const victim: PersonProps = {
      ...SC.victim, x: 172, y: 222, s: 1.05, face: 'pain',
      pose: { ...POSE.walk, spine: -80, chest: -72, head: -58, legB: [104, 118], legF: [78, 94], armF: [96, 92] },
    };
    const v = rig(victim);
    const helper: PersonProps = { ...SC.helper, x: 140, y: 228, s: 1.04, face: 'neutral', pose: { ...POSE.walk, spine: -88 } };
    const h = rig(helper);
    const vp: PersonProps = { ...victim, pose: { ...victim.pose, armB: { to: [h.shoulderF[0] - 6, h.shoulderF[1] - 4] } } };
    const hp: PersonProps = { ...helper, pose: { ...helper.pose, armF: { to: [v.belly[0] - 4, v.belly[1] + 6], bend: 1 }, armB: [60, 30] } };
    return (
      <Scene2 bg="outdoor">
        <Sun x={42} y={40} r={18} />
        <ellipse cx={278} cy={222} rx={74} ry={13} fill="#3f6b2f" opacity={0.4} />
        <Tree x={292} y={212} s={1.45} />
        <Person {...vp} only={['armB']} />
        <Person {...hp} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        <Person {...vp} only={['legB', 'legF', 'torso', 'head', 'armF']} />
        <Person {...hp} only={['armF']} />
        <Arrow from={[100, 44]} to={[220, 44]} w={7} />
      </Scene2>
    );
  },

  'hava-soguk-suya-daldir': () => {
    const victim: PersonProps = {
      ...SC.victim, x: 214, y: 190, s: 1.22, sleeve: 'short', shoes: null, shadow: false, face: 'closed',
      pose: { ...POSE.lieBack, spine: 186, chest: 194, head: 205, armB: [10, 0], armF: [14, 4], legB: [0, -6], legF: [4, -2] },
    };
    const v = rig(victim);
    const helper: PersonProps = {
      ...SC.helper, x: 40, y: 228, s: 1.1, face: 'neutral',
      pose: { ...POSE.kneel, spine: -74, chest: -56, head: -40, armB: { to: [v.head[0] - 8, v.head[1] - 4] }, armF: { to: [v.head[0] - 4, v.head[1] + 12] }, handF: { shape: 'flat', a: -40 } },
    };
    const tub = 'M74 124H310Q314 124 314 128L308 202Q306 214 292 214H96Q82 214 80 202L72 128Q72 124 74 124Z';
    const wl = v.neck[1] + 6;
    return (
      <Scene2 bg="indoor" wall="#d9e6ea">
        <g opacity={0.5}>
          {[30, 70, 110].map((yy) => <path key={yy} d={`M0 ${yy}H320`} stroke="#c3d3d8" stroke-width={1.4} />)}
          {[40, 100, 160, 220, 280].map((xx) => <path key={xx} d={`M${xx} 0V120`} stroke="#c3d3d8" stroke-width={1.4} />)}
        </g>
        <OG sh={[{ d: tub, f: '#f7f7f5' }]} />
        <Person {...victim} />
        <Clip d={tub}>
          <rect x={70} y={wl} width={250} height={110} fill={K.water} opacity={0.66} />
          <path d={`M70 ${wl}H320`} stroke={K.waterLight} stroke-width={2.4} />
        </Clip>
        {[[150, 0], [180, 14], [210, -8], [240, 10], [268, -4], [292, 12]].map(([cx, a], i) => (
          <Cube key={i} x={cx} y={wl - 1 + (i % 2) * 6} a={a} s={1.1} />
        ))}
        <path d="M72 128L80 202Q82 214 96 214H292Q306 214 308 202L314 128" fill="none" stroke={K.out} stroke-width={2} />
        <rect x={70} y={121} width={248} height={8} rx={4} fill="#ffffff" stroke={K.out} stroke-width={1.5} />
        <Person {...helper} />
        <OG sh={[{ d: rrect(100, 214, 10, 10, 2), f: '#c9ccd2' }, { d: rrect(280, 214, 10, 10, 2), f: '#c9ccd2' }]} />
      </Scene2>
    );
  },

  'hava-islat-yelpazele': () => {
    const victim: PersonProps = { ...SC.victim, x: 168, y: 226, s: 1.05, pose: POSE.lieBack, face: 'closed' };
    const v = rig(victim);
    const neck: P = [v.chest[0] - 4, v.chest[1] - 26];
    const bottleAt: P = [neck[0] + 37, neck[1] - 31];
    const pourer: PersonProps = {
      ...SC.helper, x: 236, y: 214, s: 1.0, flip: true, face: 'neutral',
      pose: { ...POSE.kneel, spine: -72, chest: -52, head: -40, armF: { to: [bottleAt[0] + 2, bottleAt[1] - 6] }, armB: [100, 90] },
    };
    const fanAt: P = [96, 116];
    const fanner: PersonProps = {
      ...SC.helper2, x: 50, y: 226, face: 'neutral',
      pose: { ...POSE.kneel, spine: -84, armF: { to: fanAt }, armB: [96, 80] },
    };
    return (
      <Scene2 bg="outdoor">
        <Sun x={30} y={28} r={12} />
        <ellipse cx={160} cy={220} rx={150} ry={14} fill="#3f6b2f" opacity={0.3} />
        <Tree x={300} y={196} s={1.5} />
        <Person {...pourer} />
        <Person {...victim} />
        <Bottle x={bottleAt[0]} y={bottleAt[1]} a={-130} s={1} fill={0.6} />
        <path d={`M${neck[0]} ${neck[1] + 2}q-3 8 0 18`} stroke={K.water} stroke-width={3} fill="none" stroke-linecap="round" />
        <Drop x={neck[0] - 8} y={neck[1] + 14} s={0.6} />
        <Drop x={neck[0] + 8} y={neck[1] + 16} s={0.55} />
        <Person {...fanner} mid={() => <HandFan x={fanAt[0]} y={fanAt[1]} s={1.25} a={40} />} />
        <Breeze x={112} y={150} len={44} c={K.waterLight} />
      </Scene2>
    );
  },

  'hava-buz-noktalari': () => {
    // Önden (yukarıdan) sırtüstü yatan kişi; çizim dik kurulup -90° döndürülür (baş solda).
    // Kollar gövdeden hafifçe açık (koltuk altı görünür), bacaklar hafif aralık (kasık görünür).
    // Bezle sarılı buz: boynun iki yanı, iki koltuk altı, iki kasık; mavi halkalarla.
    const p: PersonProps = {
      ...SC.victim, x: 160, y: 132, ax: 'hip', ay: 'hip', s: 1.38, shadow: false,
      pose: { view: 'front', armB: [122, 102], armF: [58, 78], legB: [100, 94], legF: [80, 86], face: 'closed' },
    };
    const r = rig(p);
    const pts: { q: P; a: number }[] = [
      // boynun iki yanı (çene altı ile omuz arası)
      { q: [r.neck[0] - 17, r.neck[1] + 1], a: 90 }, { q: [r.neck[0] + 17, r.neck[1] + 1], a: 90 },
      // koltuk altları (kol ile gövdenin birleştiği köşe)
      { q: [r.shoulderB[0] - 4, r.shoulderB[1] + 27], a: 70 }, { q: [r.shoulderF[0] + 4, r.shoulderF[1] + 27], a: -70 },
      // kasıklar (uyluğun gövdeyle birleştiği iç çizgi)
      { q: [r.hipB[0] + 3, r.hipB[1] + 36], a: 125 }, { q: [r.hipF[0] - 3, r.hipF[1] + 36], a: 55 },
    ];
    return (
      <Scene2 bg="outdoor">
        <rect x={0} y={0} width={320} height={240} fill="#7fb35a" />
        <g transform="rotate(-90 160 120)">
          <rect x={104} y={-6} width={112} height={252} rx={10} fill="#e8d6b0" stroke={K.out} stroke-width={1.5} />
          <Person {...p} />
          {pts.map(({ q, a }, i) => <IceBag key={i} x={q[0]} y={q[1]} a={a} s={0.55} />)}
          {pts.map(({ q }, i) => <Ring key={'r' + i} x={q[0]} y={q[1]} r={11} w={2.6} />)}
        </g>
      </Scene2>
    );
  },

  /* ─────────── fırtına / yıldırım ─────────── */

  'hava-yildirim-iceri-gir': () => (
    <Scene2 bg="outdoor">
      <StormSky />
      <Bolt x={128} y={44} s={1.1} />
      <Rain x1={0} x2={320} y1={50} y2={190} n={30} />
      <OG sh={[{ d: rrect(214, 54, 110, 148, 2), f: '#d9cbb4' }, { d: rrect(208, 46, 120, 12, 2), f: '#a8574a' }]} />
      {[[232, 70], [276, 70]].map(([wx, wy]) => <Window key={wx} x={wx} y={wy} w={34} h={30} />)}
      <Door x={238} y={202} w={54} h={92} open />
      <Car x={58} y={214} s={0.78} color="#4f7fb0" />
      <Ok x={58} y={150} r={12} />
      <Person {...FY.you} x={176} y={224} s={0.95} face="worried" pose={POSE.run} />
      <Arrow from={[150, 128]} to={[232, 150]} bend={-0.15} />
    </Scene2>
  ),

  'hava-fisten-cek': () => {
    // Fırtına ÖNCESİ: pencerede yaklaşan koyu bulutlar (şimşek/yağmur yok). El televizyonun fişini prizden
    // çekiyor, fişte dışa doğru turuncu ok. Pencere önünde balkondan içeri alınmış saksı ve katlanır sandalye.
    const gy = 226;
    const h = { x: 196, y: 196, a: 0, s: 1.15, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g = handPoint(h, 'grip');
    const sock: P = [g[0] - 44, g[1]];
    const pot = '#c2673e';
    return (
      <Scene2 bg="indoor" wall="#e4dccd" gy={gy}>
        <g>
          <OG sh={[{ d: rrect(14, 22, 112, 92, 2), f: '#f4f1ea' }, { d: rrect(20, 28, 100, 80, 1), f: '#cfe6f3', ln: true }]} />
          <Clip d={rrect(20, 28, 100, 80, 1)}>
            <rect x={20} y={28} width={100} height={80} fill="#cfe6f3" />
            <rect x={20} y={90} width={100} height={18} fill={K.hill} />
            <rect x={70} y={28} width={50} height={64} fill="#8d97a8" opacity={0.55} />
            <Cloud x={110} y={64} w={74} color="#4a5262" />
            <Cloud x={84} y={48} w={52} color="#5b6475" />
            <Cloud x={38} y={52} w={34} color="#ffffff" />
          </Clip>
          <path d="M70 28V108M20 68H120" stroke="#f4f1ea" stroke-width={4} />
          <rect x={8} y={112} width={124} height={7} rx={2} fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
        </g>
        {/* içeri alınmış saksı ve katlanır bahçe sandalyesi */}
        <OG sh={[
          { d: `M22 ${gy - 34}H58L54 ${gy - 2}H26Z`, f: pot },
          { d: rrect(19, gy - 38, 42, 7, 2), f: shade(pot, 0.12) },
        ]} />
        <OG sh={[
          { d: smooth([[40, gy - 38], [26, gy - 64], [18, gy - 80], [32, gy - 66], [40, gy - 40]], true), f: K.leaf },
          { d: smooth([[40, gy - 38], [46, gy - 70], [56, gy - 88], [54, gy - 64], [42, gy - 38]], true), f: K.leaf },
          { d: smooth([[40, gy - 38], [62, gy - 56], [74, gy - 60], [62, gy - 46], [42, gy - 36]], true), f: shade(K.leaf, 0.12) },
        ]} />
        <OG sh={[
          { d: capsule([80, gy - 2], 2.4, [116, gy - 86], 2.4), f: '#e9e6de' },
          { d: capsule([116, gy - 2], 2.4, [84, gy - 70], 2.4), f: '#e9e6de' },
          { d: rrect(78, gy - 50, 40, 8, 3), f: '#5b8fc4' },
          { d: rrect(96, gy - 92, 26, 30, 4), f: '#5b8fc4', t: 'rotate(24 109 -77)'.replace('-77', String(gy - 77)) },
        ]} />
        <Tv x={214} y={gy} w={96} h={60} />
        <Socket x={sock[0]} y={sock[1]} s={1.05} />
        <Cable pts={[[g[0] + 22, g[1]], [g[0] + 34, g[1] + 6], [236, 214], [250, 196], [258, 184]]} />
        <Hand {...h} arm={60} sleeve={K.role.helper} skin={2}>
          <Plug x={g[0]} y={g[1]} s={1.15} />
        </Hand>
        <Arrow from={[g[0] - 26, g[1] - 50]} to={[g[0] + 34, g[1] - 50]} w={7} />
      </Scene2>
    );
  },

  'hava-iceride-fise-dokunma': () => {
    // Fırtına sırasında: pencerede şimşek. Kişi pencere ve kapıdan uzakta, odanın ortasında koltukta oturuyor,
    // elleri kucağında. Yanda prize takılı televizyonun kablosuna uzanan el yasak; küçük karede musluk ve duş yasak.
    const gy = 228;
    const sit: PersonProps = { ...FY.you, x: 140, y: gy, s: 1.1, face: 'neutral', pose: { ...POSE.sitChair, spine: -98, head: -90 } };
    const r0 = rig(sit);
    const lap: P = [r0.hip[0] + 22 * 1.1, r0.hip[1] - 6];
    const sp: PersonProps = { ...sit, pose: { ...sit.pose, armB: { to: [lap[0] - 2, lap[1]] }, armF: { to: [lap[0] + 4, lap[1] + 1] } } };
    const sock: P = [214, 196];
    const plug: P = [sock[0] + 16, sock[1]];
    const reach = { a: -24, s: 0.66, pose: 'point' as const, side: 'R' as const, skin: 2, arm: 200, sleeve: K.role.helper };
    const tip = handPoint({ ...reach, x: 0, y: 0 }, 'tip');
    const hx = plug[0] + 2 - tip[0], hy = plug[1] + 8 - tip[1];
    return (
      <Scene2 bg="indoor" wall="#d9d3c7" gy={gy}>
        <rect width={320} height={gy} fill="#1c1830" opacity={0.07} />
        <g>
          <OG sh={[{ d: rrect(14, 24, 70, 76, 2), f: '#f4f1ea' }, { d: rrect(19, 29, 60, 66, 1), f: '#2c3a5c', ln: true }]} />
          <Clip d={rrect(19, 29, 60, 66, 1)}>
            <Rain x1={18} x2={80} y1={28} y2={96} n={14} />
            <Cloud x={46} y={48} w={50} color="#4a5262" />
            <Bolt x={56} y={44} s={0.5} />
          </Clip>
          <path d="M49 29V95M19 62H79" stroke="#f4f1ea" stroke-width={4} />
          <rect x={8} y={98} width={82} height={6} rx={2} fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
        </g>
        <g transform={`translate(${2 * 138} 0) scale(-1 1)`}>
          <Armchair x={96} y={gy} w={74} c="#7c8fbf" />
        </g>
        <Person {...sp} />
        <Tv x={234} y={gy} w={78} h={48} />
        <Socket x={sock[0]} y={sock[1]} s={0.72} />
        <Cable pts={[[plug[0] + 14, plug[1]], [plug[0] + 20, plug[1] + 6], [244, 214], [262, 200], [270, 190]]} />
        <Plug x={plug[0]} y={plug[1]} s={0.72} />
        <Hand x={hx} y={hy} {...reach} />
        <No x={plug[0] + 2} y={plug[1] + 6} r={26} />
        <Inset x={186} y={12} w={124} h={94} bg="#e8eef3">
          <g>
            <rect x={186} y={86} width={124} height={30} fill="#d3dde5" />
            {/* mutfak musluğu + evye (kapalı) */}
            <OG sh={[
              { d: rrect(196, 84, 58, 14, 3), f: '#f4f8fb' },
              { d: rrect(204, 52, 12, 32, 3), f: '#c3cbd4' },
              { d: 'M210 56V42Q210 32 222 32H234Q244 32 244 42V54', st: K.out, sw: 8 },
              { d: 'M210 56V42Q210 32 222 32H234Q244 32 244 42V54', st: '#c3cbd4', sw: 5 },
              { d: rrect(198, 46, 24, 7, 2), f: K.metal },
            ]} />
            {/* duş başlığı (kapalı) */}
            <OG sh={[
              { d: 'M298 12V34Q298 40 292 42L282 48', st: K.out, sw: 7 },
              { d: 'M298 12V34Q298 40 292 42L282 48', st: '#c3cbd4', sw: 4.2 },
              { d: 'M262 44L284 36L292 56L270 64Z', f: K.metal },
              { d: 'M268 61L290 53', st: shade(K.metal, 0.3), sw: 1.8 },
            ]} />
            <Bad x={242} y={72} r={11} />
            <Bad x={296} y={76} r={11} />
          </g>
        </Inset>
      </Scene2>
    );
  },

  'hava-yalniz-agac-yasak': () => (
    <Scene2 bg="outdoor">
      <StormSky />
      <Tree x={108} y={204} s={1.45} />
      <Bolt x={124} y={14} s={0.75} />
      <Person {...FY.you} x={140} y={218} s={0.78} face="worried" pose={POSE.standSide} />
      <No x={108} y={128} r={74} />
      <Inset x={208} y={110} w={100} h={106} bg="#c9dbe6">
        <path d="M208 140L308 196V216H208Z" fill={K.grass} />
        <path d="M208 140L308 196" stroke={K.out} stroke-width={1.5} fill="none" />
        <Person {...FY.you} x={262} y={182} s={0.42} pose={{ ...POSE.walk, spine: -82 }} />
        <Arrow from={[236, 140]} to={[290, 172]} w={4} />
      </Inset>
      <Ok x={296} y={122} r={11} />
    </Scene2>
  ),

  'hava-sudan-cik': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <StormSky gy={184} hill="#4f6560" />
      <Bolt x={58} y={40} s={0.95} />
      <rect y={184} width={320} height={56} fill="#e2cf9f" />
      <Person {...FY.you} x={150} y={236} s={1.08} sleeve="none" bottom="shorts" bottomC="#3d7ad6" shoes={null} face="worried" pose={POSE.walk} />
      <Water x={0} y={196} w={176} h={44} />
      <path d="M176 196Q190 214 206 240H176Z" fill={K.water} opacity={0.6} />
      <OG sh={[{ d: 'M250 214L300 208L310 222L258 228Z', f: '#e8574d' }, { d: 'M262 212L272 225M282 210L292 223', st: '#fff', sw: 3 }]} />
      <Arrow from={[200, 120]} to={[272, 150]} bend={-0.2} />
    </Scene2>
  ),

  'hava-30-dakika-bekle': () => (
    <Scene2 bg="indoor">
      <g>
        <OG sh={[{ d: rrect(24, 38, 116, 92, 2), f: '#f4f1ea' }, { d: rrect(30, 44, 104, 80, 1), f: '#cfe3ee', ln: true }]} />
        <Clip d={rrect(30, 44, 104, 80, 1)}>
          <rect x={30} y={100} width={104} height={24} fill={K.hill} />
          <Cloud x={112} y={84} w={70} color="#4a5262" />
          <Bolt x={118} y={78} s={0.32} />
          <Breeze x={44} y={70} len={30} n={2} c="#ffffff" />
        </Clip>
        <path d="M82 44V124M30 84H134" stroke="#f4f1ea" stroke-width={4} />
        <rect x={18} y={128} width={128} height={7} rx={2} fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
      </g>
      <Table x={86} y={222} w={96} h={60} />
      <DeskClock x={134} y={162} r={20} />
      <Label x={134} y={100} text="30 dk" size={17} />
      <Door x={252} y={210} w={56} h={112} />
      <Person {...FY.you} x={224} y={226} s={1} face="neutral" pose={POSE.stand} />
    </Scene2>
  ),

  /* ─────────── kar fırtınası ─────────── */

  'hava-tek-odada-toplan': () => {
    // Evin içi: sobalı odada battaniyeye sarılmış aile; "sen" kullanılmayan odanın kapısını kapatıyor.
    const gy = 214;
    const door = { x: 250, w: 56, h: 116 };
    const leaf: P = [door.x + door.w * 0.45, gy - door.h * 0.52];
    const you: PersonProps = { ...KF.you, x: 212, y: 228, s: 1.12, face: 'neutral', pose: { ...POSE.walk, spine: -84, armF: { to: [leaf[0] - 2, leaf[1] + 4] } } };
    return (
      <Scene2 bg="indoor" gy={gy} wall="#efe2c8">
        <Window x={96} y={40} w={60} h={50} view="night" />
        <SnowFall x1={100} x2={152} y1={44} y2={86} n={8} />
        <WoodStove x={44} y={216} s={0.9} pipe={90} />
        <Person {...KF.grandma} x={104} y={222} s={0.92} face="neutral" pose={{ ...POSE.sitFloor, armB: [60, 20], armF: [50, 10] }} />
        <Person {...KF.kid} x={146} y={224} s={0.74} face="neutral" pose={{ ...POSE.sitFloor, armB: [60, 20], armF: [50, 10] }} />
        <Blanket x1={84} x2={178} y={226} h={30} color="#c1554b" />
        <Door x={door.x} y={gy} w={door.w} h={door.h} open />
        <Person {...you} />
        <Arrow from={[204, 40]} to={[272, 52]} bend={-0.25} w={6} />
      </Scene2>
    );
  },

  'hava-kat-kat-giyin': () => {
    const p: PersonProps = { ...KF.you, x: 160, y: 230, s: 1.25, face: 'calm', pose: { ...POSE.stand, armB: [104, 96], armF: [76, 84] } };
    const r = rig(p);
    const nx = r.neck[0], ny = r.neck[1];
    const sweater = '#d9a13a', tee = '#f4f1ea';
    return (
      <Scene2 bg="outdoor" ground="snow">
        <SnowFall y2={196} n={26} />
        <Person
          {...p}
          over={(q) => (
            <g>
              <OG sh={[{ d: `M${nx - 13} ${ny - 1}L${nx} ${ny + 34}L${nx + 13} ${ny - 1}Z`, f: sweater }, { d: `M${nx - 7} ${ny}L${nx} ${ny + 14}L${nx + 7} ${ny}Z`, f: tee }, { d: `M${nx} ${ny + 34}V${q.hip[1] - 4}`, st: shade('#2f5d9a', 0.4), sw: 2.4 }]} />
              <OG sh={[{ d: circ(q.handB, 7.5), f: '#c6574e' }, { d: circ(q.handF, 7.5), f: '#c6574e' }]} />
              <OG sh={[{ d: rrect(q.ankleB[0] - 7, q.ankleB[1] - 8, 14, 7, 2), f: '#e8e2d6' }, { d: rrect(q.ankleF[0] - 7, q.ankleF[1] - 8, 14, 7, 2), f: '#e8e2d6' }]} />
              <Beanie r={q} lift={0.28} />
            </g>
          )}
        />
        <path d={`M${nx - 6} ${ny + 14}L96 92`} stroke={K.out} stroke-width={1.8} />
        <circle cx={nx - 6} cy={ny + 14} r={2.6} fill={K.out} />
        <Label x={70} y={84} text="3 kat" size={15} />
      </Scene2>
    );
  },

  'hava-soba-guvenli': () => (
    <Scene2 bg="indoor" gy={212}>
      <g>
        <Window x={236} y={44} w={66} h={60} />
        <OG sh={[{ d: 'M241 49H269L262 72H241Z', f: '#cfe3ee', ln: true }]} />
        <Curtain x={226} y={38} w={86} h={84} open={1} c="#c8614f" />
        <Breeze x={238} y={130} len={40} n={2} dir={-1} c={K.waterLight} />
      </g>
      <WoodStove x={74} y={214} s={1} pipe={110} />
      <Armchair x={226} y={214} w={76} />
      <path d="M104 182H220" stroke={K.out} stroke-width={5} />
      <path d="M104 182H220" stroke={K.action} stroke-width={3} />
      <path d="M104 182l10 -7v14ZM220 182l-10 -7v14Z" fill={K.action} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
      <Label x={162} y={164} text="1 m" size={15} />
      <Inset x={118} y={14} w={104} h={86} bg="#efe6d6">
        <rect x={118} y={86} width={104} height={14} fill={K.floor} />
        <WoodStove x={150} y={92} s={0.55} pipe={30} />
        <Laundry x={168} y={92} w={44} h={48} />
        <No x={170} y={57} r={34} />
      </Inset>
    </Scene2>
  ),

  'hava-baca-kar-temizle': () => {
    const shoveler: PersonProps = { ...KF.you, x: 62, y: 222, face: 'neutral', pose: { ...POSE.bend, spine: -40, chest: -30, head: -30, armB: { to: [116, 176] }, armF: { to: [96, 160] }, legF: [70, 96] } };
    return (
      <Scene2 bg="outdoor" ground="snow">
        <rect width={320} height={200} fill="#b8c6d2" />
        <SnowFall y2={196} n={22} />
        <OG sh={[{ d: rrect(176, 20, 160, 196, 2), f: '#e6d3b4' }, { d: 'M176 30H336', st: '#cdb994', sw: 2 }]} />
        <Window x={222} y={60} w={60} h={50} />
        <OG sh={[{ d: snowPile(176, 336, 22, 14), f: SNOW }]} />
        <OG sh={[{ d: rrect(146, 156, 32, 14, 2), f: '#a3adb8' }, { d: rrect(140, 152, 10, 22, 2), f: '#8b95a1' }]} />
        <path d="M136 156c-8 -10 4 -16 -4 -26M128 166c-10 -8 0 -18 -10 -26" stroke="#ffffff" stroke-width={3} fill="none" stroke-linecap="round" opacity={0.85} />
        <OG sh={[{ d: snowPile(120, 176, 214, 22), f: SNOW }, { d: snowPile(186, 320, 214, 18), f: SNOW }]} />
        <Person {...shoveler} />
        <Shovel a={[94, 158]} b={[124, 186]} />
        <OG sh={[{ d: ell([140, 190], 9, 4), f: SNOW }]} />
        <Arrow from={[150, 90]} to={[142, 144]} />
      </Scene2>
    );
  },

  'hava-arac-egzoz-kar': () => {
    const pipe: P = [96, 206];
    const kneeler: PersonProps = { ...KF.you, x: 54, y: 224, face: 'neutral', pose: { ...POSE.kneelOne, spine: -60, chest: -40, head: -30, armF: { to: [pipe[0] - 6, pipe[1] - 2] }, armB: { to: [pipe[0] - 16, pipe[1] + 4] } } };
    return (
      <Scene2 bg="outdoor" ground="snow" gy={206}>
        <rect width={320} height={206} fill="#b8c6d2" />
        <SnowFall y2={200} n={24} />
        <path d="M176 142L172 92" stroke={K.out} stroke-width={2.4} />
        <OG sh={[{ d: 'M172 92L196 100L173 108Z', f: K.danger }]} />
        <Car x={200} y={222} s={1.5} color="#4f7fb0" />
        <OG sh={[{ d: 'M124 146Q170 136 230 141Q240 138 246 146Z', f: SNOW }]} />
        <OG sh={[{ d: snowPile(86, 100, 224, 6), f: SNOW }, { d: snowPile(240, 320, 224, 16), f: SNOW }]} />
        <OG sh={[{ d: rrect(pipe[0] - 4, pipe[1] - 4, 18, 8, 3), f: '#6c727d' }, { d: ell([pipe[0] - 4, pipe[1]], 2.4, 3.6), f: '#2b2d3a' }]} />
        <Person {...kneeler} />
        <Timer x={34} y={36} r={15} text="10 dk" />
      </Scene2>
    );
  },

  /* ─────────── çığ ─────────── */

  'hava-cig-yana-kac': () => {
    // Karşıdan yamaç: soldan aşağı yuvarlanan kar bulutu (çığ); kişi akışın yanına, sağa doğru kaçıyor.
    const edge = (x0: number, x1: number, n: number, r0: number, r1: number) =>
      Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        return [x0 + (x1 - x0) * t, 64 + 170 * t, r0 + (r1 - r0) * t] as [number, number, number];
      });
    const right = edge(108, 196, 7, 10, 30).slice(1);
    const left = edge(78, -6, 6, 10, 30).slice(1);
    const inner: [number, number, number][] = [[92, 74, 14], [96, 112, 20], [70, 140, 22], [120, 150, 22], [60, 190, 26], [118, 200, 28], [160, 214, 22]];
    const all = [...left, ...right, ...inner];
    return (
      <Scene2 bg="outdoor" ground="snow" gy={232}>
        <rect width={320} height={232} fill="#cfe3f0" />
        <OG sh={[{ d: 'M-10 120L50 70L96 96L170 52L236 92L290 64L330 84V240H-10Z', f: '#8fa1b3' }, { d: 'M150 66L170 52L190 64L178 70L168 62Z', f: '#f4f8fb', no: true }, { d: 'M276 74L290 64L304 72L292 76Z', f: '#f4f8fb', no: true }]} />
        <path d="M-10 160Q150 130 330 150V240H-10Z" fill="#eef4f8" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M80 64L106 64L200 244L-10 244Z', f: '#ffffff' }, ...all.map(([cx, cy, rr], i) => ({ d: circ([cx, cy], rr), f: i % 2 ? '#ffffff' : '#e3ecf3' }))]} />
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M62 86v34m-7 -9l7 9l7 -9M112 104v34m-7 -9l7 9l7 -9M86 156v34m-7 -9l7 9l7 -9" stroke={K.out} stroke-width={6} />
          <path d="M62 86v34m-7 -9l7 9l7 -9M112 104v34m-7 -9l7 9l7 -9M86 156v34m-7 -9l7 9l7 -9" stroke="#7f9db5" stroke-width={3.4} />
        </g>
        <Person {...CG.victim} x={250} y={228} s={1.0} face="worried" pose={{ ...POSE.run, head: -96 }} />
        <Arrow from={[214, 44]} to={[304, 44]} w={7} />
      </Scene2>
    );
  },

  'hava-cig-nefes-boslugu': () => {
    // Kar altında kesit: bir el ağzı ve burnu kapatıp yüzün önünde boşluk açıyor, diğer kol yüzeye doğru uzanıyor.
    const base: PersonProps = { ...CG.victim, x: 128, y: 186, ax: 'hip', ay: 'hip', s: 1.35, shadow: false, face: 'worried', pose: { spine: -68, chest: -70, head: -86, legB: [140, 124], legF: [128, 112], armB: [-96, -92], armF: [60, 60] } };
    const r0 = rig(base);
    const m = r0.mouth;
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [m[0] + 3, m[1] + 6], bend: 1 }, handF: { shape: 'flat', a: -70 }, handB: 'mitten' } };
    const r = rig(p);
    const pk: P = [m[0] + 26, m[1] + 2];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#e3edf4" />
        <rect width={320} height={22} fill="#bcd6ea" />
        <path d="M0 22Q40 16 80 22T160 20T240 24T320 18" stroke={K.out} stroke-width={1.6} fill="none" />
        <g fill="#cfdde8">
          {[[30, 70], [40, 190], [260, 210], [70, 130], [292, 150], [190, 226], [240, 120]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={14} ry={6} />)}
        </g>
        <Person {...p} under={() => <ellipse cx={pk[0]} cy={pk[1]} rx={30} ry={26} fill="#9fb7cb" stroke={K.out} stroke-width={1.4} />} />
        <Ring x={pk[0] - 6} y={pk[1]} r={40} />
        <Arrow from={[r.handB[0] - 26, r.handB[1] + 50]} to={[r.handB[0] - 26, 30]} w={6} />
      </Scene2>
    );
  },

  'hava-cig-son-gorulen-yer': () => {
    const surf = (x: number) => 112 + x * 0.32;
    const mk: P = [196, surf(196) + 4];
    const friend: PersonProps = { ...CG.rescuer, x: 142, y: surf(142) + 8, face: 'speak', pose: { ...POSE.standSide, spine: -84, armF: { to: [mk[0] - 4, mk[1] - 58] }, armB: { at: 'head', d: [2, 10] } } };
    const fr = rig(friend);
    return (
      <Scene2 bg="outdoor" ground="snow" gy={240}>
        <path d={`M0 ${surf(0)}L320 ${surf(320)}V240H0Z`} fill="#f2f6f9" stroke={K.out} stroke-width={1.5} />
        {[[40, 4], [90, 6], [240, 2], [290, 6], [60, 30], [250, 40]].map(([x, dy], i) => (
          <ellipse key={i} cx={x} cy={surf(x) + dy + 8} rx={14} ry={6} fill="#e1e9ef" stroke={K.out} stroke-width={1.1} />
        ))}
        <Person {...friend} />
        <Stick a={[mk[0] - 4, mk[1] - 64]} b={mk} w={2.6} c="#8a5a3a" />
        <OG sh={[{ d: `M${mk[0] - 3} ${mk[1] - 64}L${mk[0] + 22} ${mk[1] - 58}L${mk[0] - 2} ${mk[1] - 48}Z`, f: K.danger }]} />
        <Phone x={fr.head[0] - 3} y={fr.head[1] + 3} s={0.3} a={-12} call={false} />
        <Label x={fr.head[0] - 44} y={fr.head[1] - 4} text="112" size={15} />
        <path d={`M${mk[0] + 10} ${mk[1] + 12}L${292} ${surf(292) + 26}`} stroke={K.out} stroke-width={6} stroke-dasharray="10 8" stroke-linecap="round" />
        <path d={`M${mk[0] + 10} ${mk[1] + 12}L${292} ${surf(292) + 26}`} stroke={K.action} stroke-width={3.6} stroke-dasharray="10 8" stroke-linecap="round" />
        <path d={`M300 ${surf(300) + 30}l-16 -14l-2 14Z`} fill={K.action} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
      </Scene2>
    );
  },

  'hava-cig-sonda-kurek': () => {
    // Kesit: sonda kara gömülü kişiye değiyor; kurtarıcı kürekle kazıp önce yüzünü açıyor.
    const sy = 120;
    const victim: PersonProps = { ...CG.victim, x: 166, y: 224, s: 1.1, flip: true, shadow: false, face: 'closed', pose: POSE.lieBack };
    const v = rig(victim);
    const hole = `M${v.head[0] - 34} ${sy}L${v.head[0] - 20} ${v.head[1] + 10}H${v.head[0] + 42}L${v.head[0] + 58} ${sy}Z`;
    const probeBot: P = [v.belly[0] - 4, v.belly[1] - 6];
    const probeTop: P = [probeBot[0] - 4, 62];
    const blade: P = [v.head[0] + 30, v.head[1] - 34];
    const grip: P = [v.head[0] - 30, sy - 44];
    const resc: PersonProps = { ...CG.rescuer, x: v.head[0] - 92, y: sy + 4, s: 0.95, face: 'neutral', pose: { ...POSE.kneelOne, spine: -50, chest: -36, head: -24, armB: { to: grip }, armF: { to: [grip[0] + 16, grip[1] + 22] } } };
    return (
      <Scene2 bg="outdoor" ground="snow" gy={sy}>
        <rect width={320} height={sy} fill="#cfe3f0" />
        <rect y={sy} width={320} height={240 - sy} fill="#e3edf4" />
        <path d={`M0 ${sy}H320`} stroke={K.out} stroke-width={1.6} />
        <g fill="#cfdde8">
          {[[30, 160], [60, 220], [290, 200], [270, 150]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={14} ry={6} />)}
        </g>
        <path d={hole} fill="#a9c1d4" stroke={K.out} stroke-width={1.4} />
        <Person {...victim} />
        <Stick a={probeTop} b={probeBot} w={2.4} />
        <Person {...resc} />
        <Shovel a={grip} b={blade} />
        <OG sh={[{ d: snowPile(v.head[0] + 58, v.head[0] + 120, sy + 1, 14), f: '#f2f6f9' }]} />
      </Scene2>
    );
  },

  /* ─────────── toz fırtınası ─────────── */

  'hava-pencereleri-kapat': () => {
    const handle: P = [196, 112];
    return (
      <Scene2 bg="indoor" wall="#efe6d6">
        <OG sh={[{ d: rrect(50, 34, 156, 138, 3), f: '#f4f1ea' }, { d: rrect(58, 42, 68, 122, 1), f: DUST, ln: true }, { d: rrect(130, 42, 68, 122, 1), f: DUST, ln: true }]} />
        <Clip d={`${rrect(58, 42, 68, 122, 1)}${rrect(130, 42, 68, 122, 1)}`}>
          <rect x={50} y={34} width={156} height={138} fill="#d9a35f" />
          <DustCloud x={40} y={30} w={180} h={90} c="#b5763c" />
          <Specks x1={58} x2={198} y1={60} y2={160} n={34} />
        </Clip>
        <rect x={44} y={170} width={168} height={8} rx={2} fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(handle[0] - 3, handle[1] - 4, 6, 26, 3), f: '#c9ccd2' }]} />
        <Person {...TZ.you} x={252} y={228} s={1.1} face="neutral" pose={{ ...POSE.stand, armB: { to: [handle[0] + 2, handle[1] + 16] } }} />
        <Arrow from={[176, 70]} to={[178, 132]} bend={0.3} />
      </Scene2>
    );
  },

  'hava-toz-maske': () => {
    const p: PersonProps = { ...TZ.you, x: 160, y: 96, ax: 'head', ay: 'head', s: 2.7, face: 'neutral', pose: POSE.stand };
    const r = rig(p);
    const [hx, hy] = r.head;
    const k = r.s;
    return (
      <Scene2 bg="closeup">
        <rect width={320} height={240} fill="#d7a868" />
        <DustCloud x={0} y={0} w={320} h={110} c="#b5763c" op={0.75} />
        <Specks x1={0} x2={320} y1={0} y2={240} n={50} seed={7} />
        <Person {...p} only={['torso', 'head']} />
        <OG
          sh={[
            { d: `M${hx - 12 * k} ${hy + 1 * k}Q${hx} ${hy - 3 * k} ${hx + 12 * k} ${hy + 1 * k}L${hx + 10 * k} ${hy + 11 * k}Q${hx} ${hy + 17 * k} ${hx - 10 * k} ${hy + 11 * k}Z`, f: '#fbfaf7' },
            { d: `M${hx} ${hy - 1.6 * k}V${hy + 14.4 * k}`, st: '#d5d1c6', sw: 2 },
            { d: `M${hx - 12 * k} ${hy + 3 * k}L${hx - 13.4 * k} ${hy - 1 * k}M${hx + 12 * k} ${hy + 3 * k}L${hx + 13.4 * k} ${hy - 1 * k}`, st: '#e8e6e0', sw: 3 },
          ]}
        />
        <OG
          sh={[
            { d: rrect(hx - 13 * k, hy - 5.4 * k, 26 * k, 3 * k, 1.5 * k), f: '#3b3f4b' },
            { d: `M${hx - 11 * k} ${hy - 6 * k}H${hx + 11 * k}Q${hx + 12 * k} ${hy + 1.6 * k} ${hx + 6 * k} ${hy + 1.4 * k}Q${hx + 2 * k} ${hy + 1.4 * k} ${hx} ${hy - 0.4 * k}Q${hx - 2 * k} ${hy + 1.4 * k} ${hx - 6 * k} ${hy + 1.4 * k}Q${hx - 12 * k} ${hy + 1.6 * k} ${hx - 11 * k} ${hy - 6 * k}Z`, f: '#bfe3f5', op: 0.55 },
            { d: `M${hx - 8 * k} ${hy - 4 * k}l3 -1`, st: '#fff', sw: 2.6 },
          ]}
        />
      </Scene2>
    );
  },

  'hava-toz-arac-yol-disi': () => {
    const offCar = (x: number, y: number, s: number) => (
      <g>
        <Car x={x} y={y} s={s} color="#4f7fb0" />
        <rect x={x + 54 * s} y={y - 28 * s} width={8 * s} height={5 * s} rx={2} fill="#8a8e96" stroke={K.out} stroke-width={1.2} />
        <rect x={x - 63 * s} y={y - 28 * s} width={6 * s} height={6 * s} rx={1.5} fill="#7a4242" stroke={K.out} stroke-width={1.2} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={150}>
        <rect width={320} height={150} fill="#d9a35f" />
        <rect y={146} width={320} height={52} fill={ASPH} />
        <path d="M0 172H320" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="18 14" />
        <rect y={198} width={320} height={5} fill="#d8d4c8" />
        <rect y={203} width={320} height={37} fill="#b98d5f" />
        <g opacity={0.85}>
          <Car x={92} y={186} s={0.86} color="#d0473d" />
        </g>
        <No x={92} y={160} r={40} />
        {offCar(238, 238, 0.86)}
        <Ok x={290} y={180} r={12} />
        <DustCloud x={0} y={0} w={320} h={150} c="#b5763c" op={0.8} />
        <rect width={320} height={240} fill="#c08a4e" opacity={0.18} />
        <Specks x1={0} x2={320} y1={0} y2={240} n={46} seed={4} />
      </Scene2>
    );
  },

  /* ─────────── hortum ─────────── */

  'hava-hortum-ic-oda': () => {
    // Ev içi kesit: solda pencereli oda (dışarıda hortum), sağda penceresiz iç oda/banyo; "sen" çocukla iç odaya geçiyor.
    const you: PersonProps = { ...HR.you, x: 176, y: 228, s: 1.0, face: 'worried', pose: { ...POSE.walk, armF: [40, 20] } };
    const yr = rig(you);
    const kid: PersonProps = { ...HR.kid, x: 238, y: 228, s: 1.0, face: 'worried', pose: { ...POSE.walk, armB: { to: yr.handF } } };
    return (
      <Scene2 bg="indoor" wall="#efe4cf">
        <rect x={210} y={0} width={110} height={200} fill="#dcebf1" />
        <path d="M210 40H320M210 80H320M210 120H320M210 160H320M246 0V200M282 0V200" stroke="#c3d6df" stroke-width={1.6} />
        <rect x={20} y={36} width={92} height={80} fill="#aab6c4" />
        <Clip d={rrect(20, 36, 92, 80, 2)}>
          <Cloud x={70} y={56} w={110} color="#4a5262" />
          <Tornado x={66} y={116} h={66} w={40} c="#5c6472" />
        </Clip>
        <OG sh={[{ d: `M14 30H118V122H14ZM20 36V116H112V36Z`, f: '#f4f1ea' }, { d: 'M66 36V116M20 76H112', st: '#f4f1ea', sw: 4 }]} />
        <OG sh={[{ d: rrect(10, 120, 112, 7, 2), f: '#f4f1ea' }]} />
        <OG sh={[{ d: rrect(196, 0, 16, 200, 0), f: '#d8cdb9' }, { d: rrect(196, 0, 16, 62, 0), f: '#c9bda6', no: true }]} />
        <OG sh={[{ d: rrect(256, 150, 60, 52, 6), f: '#ffffff' }, { d: rrect(262, 156, 48, 14, 4), f: '#e8f1f5', ln: true }]} />
        <Person {...you} />
        <Person {...kid} />
        <Arrow from={[120, 46]} to={[226, 46]} bend={-0.15} w={7} />
        <Ok x={290} y={30} r={14} />
      </Scene2>
    );
  },

  'hava-hortum-comel-bas-koru': () => {
    const p: PersonProps = { ...HR.you, x: 168, y: 222, s: 1.5, face: 'worried', pose: { ...POSE.dropCover, armB: [56, -148], armF: [64, -152] } };
    const r = rig(p);
    const top = Math.min(r.back[1], r.hip[1] - 14) + 8;
    const x0 = r.hip[0] - 40, x1 = r.head[0] + r.headR + 24;
    const mid = (x0 + x1) / 2;
    const mat = `M${f1(x0)} 208C${f1(x0 - 4)} ${f1(top + 20)} ${f1(mid - 70)} ${f1(top - 4)} ${f1(mid)} ${f1(top - 4)}C${f1(mid + 70)} ${f1(top - 4)} ${f1(x1 + 4)} ${f1(top + 20)} ${f1(x1)} 204L${f1(x1 - 16)} 204C${f1(x1 - 16)} ${f1(top + 30)} ${f1(mid + 60)} ${f1(top + 16)} ${f1(mid)} ${f1(top + 16)}C${f1(mid - 60)} ${f1(top + 16)} ${f1(x0 + 16)} ${f1(top + 30)} ${f1(x0 + 16)} 208Z`;
    return (
      <Scene2 bg="indoor" wall="#e4dccd">
        <Door x={18} y={192} w={50} h={110} />
        <Person {...p} />
        <OG sh={[{ d: mat, f: '#e7e1f2' }, { d: `M${f1(mid - 50)} ${f1(top - 2)}V${f1(top + 15)}M${f1(mid)} ${f1(top - 4)}V${f1(top + 16)}M${f1(mid + 50)} ${f1(top - 2)}V${f1(top + 15)}`, st: '#bdb3d4', sw: 1.6 }]} />
      </Scene2>
    );
  },

  'hava-hortum-hendek': () => {
    const p: PersonProps = { ...HR.you, x: 112, y: 222, s: 0.95, shadow: false, pose: { spine: 2, chest: 4, head: 14, legB: [178, 180], legF: [182, 180], armB: { at: 'nape', d: [2, -4] }, armF: { at: 'head', d: [0, -6] }, footB: -80, footF: -80, face: 'closed' } };
    return (
      <Scene2 bg="outdoor" ground="grass" gy={190}>
        <StormSky gy={190} clouds={false} />
        <Cloud x={230} y={40} w={170} color="#434a58" />
        <Tornado x={236} y={186} h={140} w={80} />
        <rect y={190} width={320} height={50} fill={K.grass} />
        <path d="M24 196Q30 226 50 228H210Q230 226 236 196Z" fill="#8f6a45" stroke={K.out} stroke-width={1.5} />
        <Person {...p} />
        <rect x={250} y={188} width={70} height={20} fill={ASPH} />
        <Car x={292} y={204} s={0.62} color="#d0473d" />
      </Scene2>
    );
  },

  'hava-kopuk-tel-yasak': () => {
    // Sağda devrilmiş direk ve yerde kıvılcım saçan kopuk tel; "sen" ondan uzaklaşıp sola yürüyor.
    const top: P = [214, 70];
    const end: P = [176, 214];
    return (
      <Scene2 bg="outdoor" ground="pavement" gy={196}>
        <rect width={320} height={196} fill="#b8c6d2" />
        <OG sh={[{ d: capsule([300, 214], 6, top, 5), f: '#8a6a4a' }, { d: capsule(pol(top, 140, 20), 2.6, pol(top, -40, 20), 2.6), f: '#6b4f3a' }]} />
        <path d={`M${top[0] - 4} ${top[1] + 8}Q150 110 ${end[0]} ${end[1]}`} stroke={K.out} stroke-width={3.8} fill="none" />
        <path d={`M${pol(top, -40, 20)[0]} ${pol(top, -40, 20)[1]}Q300 60 340 76`} stroke={K.out} stroke-width={2.8} fill="none" />
        <circle cx={end[0]} cy={end[1]} r={34} fill={K.danger} opacity={0.14} />
        <Spark x={end[0]} y={end[1]} r={17} />
        <Spark x={end[0] + 18} y={end[1] - 12} r={8} />
        <Spark x={end[0] - 16} y={end[1] - 8} r={6} />
        <Person {...HR.you} x={86} y={228} s={1.12} flip face="worried" pose={POSE.walk} />
        <Arrow from={[132, 48]} to={[30, 48]} w={7} />
      </Scene2>
    );
  },

  /* ─────────── sıcak dalgası ─────────── */

  'hava-sicak-saatler': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: rrect(168, 36, 136, 124, 3), f: '#f4f1ea' }, { d: rrect(176, 44, 120, 108, 1), f: '#fff1c4', ln: true }]} />
      <Clip d={rrect(176, 44, 120, 108, 1)}>
        <rect x={176} y={44} width={120} height={108} fill="#ffe7a1" />
        <rect x={176} y={122} width={120} height={30} fill="#d2c3a2" />
        <rect x={176} y={110} width={40} height={12} fill="#e8b9a0" stroke={K.out} stroke-width={1} />
        <rect x={252} y={100} width={44} height={22} fill="#e3cfae" stroke={K.out} stroke-width={1} />
        <Sun x={270} y={66} r={13} />
        <HeatWaves x={214} y={124} n={3} gap={14} h={22} c="#f2a33a" />
        <Person x={252} y={146} s={0.24} who="man" role="victim" shadow={false} pose={POSE.walk} />
        <No x={252} y={130} r={17} />
      </Clip>
      <path d="M236 44V152" stroke="#f4f1ea" stroke-width={4} />
      <rect x={162} y={158} width={148} height={8} rx={2} fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
      <Person {...SD.you} x={104} y={226} s={1.05} face="neutral" pose={POSE.standSide} />
      <WallClock x={46} y={64} r={22} />
      <Label x={46} y={104} text="10–16" size={15} />
    </Scene2>
  ),

  'hava-su-ic': () => {
    const base: PersonProps = { ...SD.you, x: 132, y: 228, s: 1.3, face: 'neutral', pose: { ...POSE.sitChair } };
    const m = rig(base).mouth;
    const gl: P = [m[0] + 14, m[1] + 14];
    const p: PersonProps = { ...base, pose: { ...POSE.sitChair, head: -82, armF: { to: [gl[0] - 2, gl[1] - 4] }, handF: 'fist' } };
    return (
      <Scene2 bg="outdoor" gy={170}>
        <rect y={0} width={320} height={34} fill="#2f8059" />
        <path d="M0 34Q20 48 40 34T80 34T120 34T160 34T200 34T240 34T280 34T320 34V20H0Z" fill="#2f8059" stroke={K.out} stroke-width={1.5} />
        <rect y={170} width={320} height={70} fill="#7fae5a" />
        <ellipse cx={170} cy={226} rx={160} ry={14} fill="#3f6b2f" opacity={0.3} />
        <Chair x={124} y={228} seat={57} s={1.3} />
        <Person {...p} mid={() => null} over={() => <Glass x={gl[0] + 4} y={gl[1] + 6} s={0.95} a={-50} fill={0.5} />} />
        <Table x={210} y={228} w={100} h={74} />
        <Jug x={262} y={154} s={1.1} />
      </Scene2>
    );
  },

  'hava-perde-kapat': () => {
    const L = { x: 10, w: 146 };
    const Rr = { x: 164, w: 146 };
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#e9e0d0" />
        <Inset x={L.x} y={12} w={L.w} h={216} bg="#efe4cf">
          <rect x={L.x} y={196} width={L.w} height={32} fill={K.floor} />
          <OG sh={[{ d: rrect(L.x + 54, 40, 76, 92, 2), f: '#f4f1ea' }, { d: rrect(L.x + 59, 45, 66, 82, 1), f: K.sky, ln: true }]} />
          <Sun x={L.x + 100} y={70} r={12} />
          <Curtain x={L.x + 50} y={34} w={84} h={104} open={0.15} />
          <Person {...SD.you} x={L.x + 32} y={222} s={0.82} face="neutral" pose={{ ...POSE.standSide, armF: { to: [L.x + 66, 70] } }} />
          <Arrow from={[L.x + 98, 150]} to={[L.x + 130, 150]} w={5} />
        </Inset>
        <Inset x={Rr.x} y={12} w={Rr.w} h={216} bg="#4c5876">
          <rect x={Rr.x} y={196} width={Rr.w} height={32} fill={shade(K.floor, 0.35)} />
          <OG sh={[{ d: rrect(Rr.x + 54, 40, 76, 92, 2), f: '#d9d3c4' }, { d: rrect(Rr.x + 59, 45, 66, 82, 1), f: K.nightSky, ln: true }]} />
          <Moon x={Rr.x + 104} y={70} r={12} />
          <OG sh={[{ d: `M${Rr.x + 59} 45L${Rr.x + 40} 56V122L${Rr.x + 59} 127Z`, f: '#9cb2c8' }]} />
          <Person {...SD.you} x={Rr.x + 32} y={222} s={0.82} face="neutral" pose={{ ...POSE.standSide, armF: { to: [Rr.x + 44, 96] } }} />
          <Breeze x={Rr.x + 96} y={150} len={40} n={3} dir={-1} c={K.waterLight} />
        </Inset>
      </Scene2>
    );
  },

  'hava-komsu-kontrol': () => {
    const fan: P = [84, 118];
    return (
      <Scene2 bg="outdoor" ground="pavement" gy={214}>
        <rect width={320} height={214} fill="#e6d3b4" />
        <OG sh={[{ d: rrect(36, 66, 104, 150, 2), f: '#efe9df' }, { d: rrect(44, 74, 88, 142, 1), f: '#3a3530' }, { d: 'M132 74L170 84V222L132 216Z', f: '#a8724a' }]} />
        <Person x={86} y={218} s={0.98} who="oldwoman" role="bystander" pose={{ ...POSE.stand, armF: { to: [fan[0] + 22, fan[1] + 26] }, face: 'calm' }} />
        <HandFan x={fan[0] + 24} y={fan[1] + 22} s={1} a={-20} />
        <Person {...SD.you} x={232} y={226} s={1.05} flip face="speak" pose={{ ...POSE.standSide, armF: [60, 0], handF: 'fist' }} over={(q) => <Bottle x={q.handF[0]} y={q.handF[1] + 14} s={0.95} fill={0.8} />} />
        <Waves x={206} y={74} a={200} n={2} r={6} />
      </Scene2>
    );
  },

  'hava-arac-cocuk-yasak': () => {
    const cx = 160, cy = 220, s = 2.1;
    const rearWin = `M${cx - 32 * s} ${cy - 35 * s}L${cx - 20 * s} ${cy - 48 * s}H${cx - 2 * s}V${cy - 35 * s}Z`;
    const frontWin = `M${cx + 3 * s} ${cy - 35 * s}V${cy - 48 * s}H${cx + 17 * s}Q${cx + 21 * s} ${cy - 48 * s} ${cx + 24 * s} ${cy - 45 * s}L${cx + 33 * s} ${cy - 35 * s}Z`;
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <rect width={320} height={200} fill="#ffe7a1" />
        <Sun x={286} y={32} r={16} />
        <Car x={cx} y={cy} s={s} color="#e6e8eb" />
        <Clip d={rearWin}>
          <rect x={cx - 70} y={cy - 104} width={70} height={40} fill="#cfe3ee" />
          <CarSeat x={cx - 50} y={cy - 70} s={0.72} />
          <Person x={cx - 38} y={cy - 82} ax="head" ay="head" s={1.25} who="baby" shadow={false} pose={{ spine: -86, legB: [-10, 60], legF: [-6, 64], armB: [60, 10], armF: [50, 0], face: 'pain' }} />
        </Clip>
        <Clip d={frontWin}>
          <rect x={cx} y={cy - 104} width={80} height={40} fill="#cfe3ee" />
          <Dog x={cx + 6} y={cy - 46} s={0.75} />
        </Clip>
        <path d={rearWin + frontWin} fill="#bfe3f5" opacity={0.25} stroke={K.out} stroke-width={1.5} />
        <HeatWaves x={cx} y={cy - 116} n={4} gap={22} h={28} c="#f08a3a" />
        <No x={cx + 34} y={cy - 72} r={80} />
      </Scene2>
    );
  },

  /* ─────────── dolu ─────────── */

  'hava-dolu-iceri-gir': () => {
    const a: P = [190, 74], b: P = [222, 70];
    const p: PersonProps = { ...DL.you, x: 180, y: 224, s: 0.95, face: 'worried', pose: { ...POSE.walk, spine: -80, head: -72, armB: { to: a }, armF: { to: b } } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <StormSky />
        <OG sh={[{ d: rrect(232, 54, 100, 148, 2), f: '#d9cbb4' }, { d: rrect(226, 46, 110, 12, 2), f: '#a8574a' }]} />
        <Window x={276} y={70} w={34} h={30} />
        <Door x={246} y={202} w={54} h={96} open />
        <Person {...p} only={['legB', 'armB']} />
        <Person {...p} only={['legF', 'torso', 'head']} />
        <OG sh={[{ d: `M${a[0] - 8} ${a[1] + 6}Q${r.head[0] + 2} ${r.head[1] - 34} ${b[0] + 8} ${b[1] + 4}L${b[0] + 14} ${b[1] + 26}Q${r.head[0] + 4} ${r.head[1] - 10} ${a[0] - 14} ${a[1] + 30}Z`, f: '#2f5d9a' }]} />
        <Person {...p} only={['armF']} />
        <HailFall x1={10} x2={226} y1={50} y2={200} n={22} seed={3} />
        <Arrow from={[120, 120]} to={[238, 140]} bend={-0.12} />
      </Scene2>
    );
  },

  'hava-dolu-bas-koru': () => {
    const a: P = [134, 46], b: P = [176, 46];
    const p: PersonProps = { ...DL.you, x: 156, y: 232, s: 1.3, face: 'worried', pose: { ...POSE.walk, spine: -86, armB: { to: a }, armF: { to: b } } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <StormSky />
        <Person {...p} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        <OG sh={[{ d: rrect(a[0] - 18, a[1] - 22, b[0] - a[0] + 36, 30, 6), f: '#c0603e' }, { d: `M${a[0] - 12} ${a[1] - 22}Q${(a[0] + b[0]) / 2} ${a[1] - 44} ${b[0] + 12} ${a[1] - 22}`, st: K.out, sw: 3 }, { d: `M${a[0] - 18} ${a[1] - 10}H${b[0] + 18}`, st: shade('#c0603e', 0.3), sw: 1.6 }]} />
        <Person {...p} only={['armF']} />
        <HailFall x1={12} x2={100} y1={12} y2={196} n={11} seed={8} />
        <HailFall x1={214} x2={310} y1={12} y2={196} n={11} seed={2} />
        <HailFall x1={110} x2={204} y1={6} y2={14} n={3} seed={4} />
        {[[40, 214], [94, 222], [228, 218], [282, 210]].map(([x, y], i) => (
          <g key={i}>
            <Hail x={x} y={y - 12} r={3.6} trail={false} />
            <path d={`M${x - 10} ${y}q4 -8 8 -10M${x + 10} ${y}q-4 -8 -8 -10`} stroke="#ffffff" stroke-width={1.8} fill="none" stroke-linecap="round" />
          </g>
        ))}
      </Scene2>
    );
  },

  'hava-dolu-arac-ici': () => {
    const body = 'M14 196V142Q14 132 24 130L74 124L110 78Q116 70 128 70H222Q236 70 244 80L276 120L298 126Q308 128 308 140V196Q308 204 300 204H22Q14 204 14 196Z';
    const win1 = 'M82 124L114 84Q118 80 124 80H168V124Z';
    const win2 = 'M176 124V80H222Q232 80 238 88L266 124Z';
    const seat = '#5b5f78';
    const child: PersonProps = { ...DL.kid, x: 210, y: 170, s: 0.74, shadow: false, face: 'closed', pose: { ...POSE.sitChair, spine: -54, chest: -34, head: -14, armB: [80, 10], armF: [70, 0] } };
    const c = rig(child);
    const adult: PersonProps = { ...DL.you, x: 132, y: 170, s: 0.98, shadow: false, face: 'closed', pose: { ...POSE.sitChair, spine: -28, chest: -8, head: 12, armB: { to: [c.nape[0] - 2, c.nape[1] - 2] }, armF: { to: [c.back[0] + 10, c.back[1] + 4] } } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <StormSky />
        <OG sh={[{ d: body, f: '#d0473d' }]} />
        <OG sh={[{ d: win1, f: '#bfe3f5', ln: true }, { d: win2, f: '#bfe3f5', ln: true }]} />
        <OG sh={[{ d: rrect(30, 130, 262, 56, 6), f: '#e9e0d0', ln: true }]} />
        <OG sh={[{ d: rrect(96, 108, 18, 70, 6), f: seat }, { d: rrect(96, 160, 150, 18, 5), f: seat }]} />
        <Person {...child} />
        <Person {...adult} />
        <OG sh={[{ d: circ([60, 204], 20), f: '#30333b' }, { d: circ([262, 204], 20), f: '#30333b' }, { d: circ([60, 204], 8), f: K.metal, ln: true }, { d: circ([262, 204], 8), f: K.metal, ln: true }]} />
        <HailFall x1={70} x2={300} y1={10} y2={64} n={14} seed={11} />
        {[[110, 96], [150, 88], [214, 92], [246, 108]].map(([x, y], i) => (
          <g key={i}>
            <Hail x={x} y={y} r={4} trail={false} />
            <path d={`M${x - 8} ${y - 6}l-4 -4M${x + 8} ${y - 6}l4 -4M${x} ${y - 9}v-5`} stroke="#ffffff" stroke-width={2} stroke-linecap="round" />
          </g>
        ))}
      </Scene2>
    );
  },

  'hava-alt-gecit-yasak': () => (
    <Scene2 bg="outdoor" ground="grass" gy={150}>
      <StormSky gy={150} clouds={false} />
      <Cloud x={80} y={40} w={150} color="#434a58" />
      <Cloud x={240} y={34} w={160} color="#3c4250" />
      <rect y={150} width={320} height={90} fill="#7f9a62" />
      <path d="M0 168H96Q130 168 150 226H262Q282 168 316 168H320V240H0Z" fill={ASPH} stroke={K.out} stroke-width={1.5} />
      <path d="M128 190H282V226H150Z" fill={K.water} opacity={0.85} />
      <path d="M134 192H280" stroke={K.waterLight} stroke-width={2.4} />
      <Car x={268} y={96} s={0.5} color="#e0b23a" />
      <OG sh={[{ d: rrect(124, 96, 206, 26, 2), f: '#b9b7b0' }, { d: rrect(124, 122, 22, 68, 1), f: '#a5a39c' }, { d: rrect(200, 122, 14, 68, 1), f: '#a5a39c' }, { d: rrect(120, 92, 210, 6, 2), f: '#8b8e96' }]} />
      <path d="M150 190H284" stroke={K.out} stroke-width={1.5} />
      <Car x={70} y={176} s={0.82} color="#4f7fb0" />
      <No x={72} y={150} r={42} />
      <Rain x1={0} x2={320} y1={50} y2={200} n={34} seed={9} />
      <HailFall x1={0} x2={320} y1={50} y2={140} n={12} seed={5} />
    </Scene2>
  ),

  /* ─────────── rehbere özel ortak sahne kopyaları (oyuncu tutarlılığı) ─────────── */

  'sicak-yan-yatir': () => {
    // Derlenme pozisyonu: sıcak çarpması rehberinin yaralısı, gölgede yan yatmış, nefes alıyor.
    const p: PersonProps = { ...SC.victim, x: 180, y: 226, s: 1.45, face: 'closed', pose: { ...POSE.recovery, legF: [74, -6], legB: [2, 2] } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor">
        <ellipse cx={170} cy={222} rx={160} ry={16} fill="#3f6b2f" opacity={0.35} />
        <Person {...p} />
        <Waves x={r.head[0] - 4} y={r.head[1] - 24} a={-110} n={3} r={6} color={K.water} />
      </Scene2>
    );
  },

  'firtina-kpr': () => <CprScene victim={FY.victim} rescuer={FY.you} />,

  'cig-kpr': () => <CprScene victim={CG.victim} rescuer={CG.rescuer} bg="outdoor" ground="snow" />,
};
