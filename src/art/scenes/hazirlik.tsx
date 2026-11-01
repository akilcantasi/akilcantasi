// Hazırlık ve iletişim — sahneler: afet çantası, belgeler, iletişim, ev sabitleme, aile planı,
// araç kiti, ilk yardım çantası, iş yeri/okul, evcil hayvan.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bottle, Chair, Door, Hand, K, Label, No, OG, Ok, Person, POSE, Scene2, Shake, Table, Tree, Waves, Whistle, Window, Flashlight,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)})${a ? ` rotate(${f1(a)})` : ''}${s !== 1 ? ` scale(${s})` : ''}`}>{children}</g>
);
const T = ({ x, y, text, size = 12, c = K.ink, w = 700, anchor = 'middle' }: { x: number; y: number; text: string; size?: number; c?: string; w?: number; anchor?: 'start' | 'middle' | 'end' }) => (
  <text x={x} y={y} font-size={size} font-weight={w} fill={c} text-anchor={anchor} font-family="'IBM Plex Sans', system-ui, sans-serif">{text}</text>
);
const poly = (pts: P[]) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';

const PACK = '#e0702a'; // afet çantası (turuncu tonu, eylem okundan koyu)
const PAPER = '#fbfaf5';
const LINE = '#b9bcc4';
const TABLETOP = '#c99766';
const GLOVEB = '#4f8fe0';

/** Gri yazı çizgileri (belge içeriği) */
function Lines({ x, y, w, n = 4, gap = 6, c = LINE, sw = 2.2 }: { x: number; y: number; w: number; n?: number; gap?: number; c?: string; sw?: number }) {
  return (
    <g stroke={c} stroke-width={sw} stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={x} y1={y + i * gap} x2={x + w * (i === n - 1 ? 0.6 : i % 2 ? 0.85 : 1)} y2={y + i * gap} />
      ))}
    </g>
  );
}

/** Belge kâğıdı (SOL ÜST x,y). stamp: kırmızı mühür; photo: kimlik fotoğrafı kutusu */
function Doc({ x, y, w = 50, h = 64, a = 0, stamp, c = PAPER, title }: { x: number; y: number; w?: number; h?: number; a?: number; stamp?: boolean; c?: string; title?: string }) {
  return (
    <g transform={a ? `rotate(${a} ${x + w / 2} ${y + h / 2})` : undefined}>
      <OG sh={[{ d: rrect(x, y, w, h, 2), f: c }]} />
      {title && <rect x={x + 6} y={y + 6} width={w * 0.5} height={4} rx={2} fill={'#7d8492'} />}
      <Lines x={x + 6} y={y + (title ? 17 : 10)} w={w - 12} n={Math.max(2, Math.floor((h - (stamp ? 30 : 18)) / 7))} gap={7} />
      {stamp && <circle cx={x + w - 13} cy={y + h - 12} r={7} fill="none" stroke={K.danger} stroke-width={2} />}
    </g>
  );
}

/** Kimlik kartı (SOL ÜST x,y) */
function IdCard({ x, y, w = 50, h = 32, a = 0, c = '#cfe3f7' }: { x: number; y: number; w?: number; h?: number; a?: number; c?: string }) {
  return (
    <g transform={a ? `rotate(${a} ${x + w / 2} ${y + h / 2})` : undefined}>
      <OG sh={[{ d: rrect(x, y, w, h, 3), f: c }, { d: rrect(x + 4, y + 5, w * 0.3, h - 10, 2), f: '#e9d8c6', ln: true }]} />
      <circle cx={x + 4 + w * 0.15} cy={y + h * 0.42} r={h * 0.13} fill="#9a7a62" />
      <path d={`M${x + 4 + w * 0.15 - h * 0.2} ${y + h - 6}Q${x + 4 + w * 0.15} ${y + h * 0.5} ${x + 4 + w * 0.15 + h * 0.2} ${y + h - 6}Z`} fill="#9a7a62" />
      <Lines x={x + w * 0.42} y={y + 9} w={w * 0.48} n={3} gap={h * 0.22} sw={2} c="#8aa2bd" />
    </g>
  );
}

/** Önden sırt çantası. x,y = ÜST ORTA */
function FrontPack({ x, y, s = 1, c = PACK, a = 0 }: { x: number; y: number; s?: number; c?: string; a?: number }) {
  const d = shade(c, 0.18);
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-6 6Q-6 -6 0 -6Q6 -6 6 6', st: K.out, sw: 3 },
          { d: 'M-24 14Q-24 4 -12 4H12Q24 4 24 14V58Q24 64 18 64H-18Q-24 64 -24 58Z', f: c },
          { d: 'M-24 22Q0 14 24 22V14Q24 4 12 4H-12Q-24 4 -24 14Z', f: d },
          { d: rrect(-16, 34, 32, 24, 5), f: d, ln: true },
          { d: 'M-12 40H12', st: K.out, sw: 1.4 },
          { d: rrect(-4, 28, 8, 4, 1.5), f: '#3b3f4b' },
          { d: 'M-24 26H-28V50H-24', f: d },
        ]}
      />
      <path d="M-14 46H14" stroke={tint(c, 0.5)} stroke-width={2.4} stroke-linecap="round" />
    </G>
  );
}

/** Yukarıdan açık sırt çantası. x,y = MERKEZ */
function OpenPack({ x, y, s = 1, c = PACK, a = 0 }: { x: number; y: number; s?: number; c?: string; a?: number }) {
  const d = shade(c, 0.2);
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([-12, -34], 4, [-12, 34], 4), f: d },
          { d: capsule([12, -34], 4, [12, 34], 4), f: d },
          { d: rrect(-30, -40, 60, 80, 18), f: c },
          { d: ell([0, -6], 22, 26), f: '#3a2a22' },
          { d: ell([0, -6], 22, 26), f: 'none', st: shade(c, 0.35), sw: 3 },
          { d: rrect(-20, 24, 40, 12, 4), f: d, ln: true },
        ]}
      />
      <path d="M-14 -10Q-4 -18 8 -12" stroke="#5a463a" stroke-width={3} fill="none" stroke-linecap="round" />
    </G>
  );
}

/** Konserve (yan görünüş). x,y = taban ortası */
function Can({ x, y, s = 1, c = '#d6453b', a = 0, w = 30, h = 34, date }: { x: number; y: number; s?: number; c?: string; a?: number; w?: number; h?: number; date?: boolean }) {
  const hw = w / 2;
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: `M${-hw} ${-h + 3}V-3Q${-hw} 0 ${-hw + 3} 0H${hw - 3}Q${hw} 0 ${hw} -3V${-h + 3}Z`, f: K.metal },
          { d: rrect(-hw, -h * 0.78, w, h * 0.58, 1), f: c, ln: true },
          { d: ell([0, -h + 3], hw, 4), f: tint(K.metal, 0.3) },
          { d: `M${hw - 6} ${-h * 0.78}H${hw}V${-h * 0.2}H${hw - 6}Z`, f: shade(c, 0.18), no: true },
        ]}
      />
      <circle cx={-hw * 0.2} cy={-h * 0.5} r={h * 0.13} fill="#ffd25e" />
      {date && <rect x={-hw + 3} y={-h + 6} width={w - 6} height={7} rx={1.5} fill="#fff" stroke={K.out} stroke-width={1} />}
    </G>
  );
}

/** Konserve (yukarıdan). MERKEZ */
function CanTop({ x, y, r = 14, c = '#d6453b' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: c }, { d: circ([x, y], r * 0.82), f: tint(K.metal, 0.2), ln: true }, { d: circ([x, y], r * 0.6), f: 'none', st: shade(K.metal, 0.15), sw: 1.2 }]} />
      <path d={`M${x + r * 0.2} ${y - r * 0.35}a${r * 0.22} ${r * 0.18} 0 1 1 0.1 0`} fill="none" stroke={K.out} stroke-width={1.6} />
    </g>
  );
}

/** Kavanoz (yan görünüş). x,y = taban ortası */
function Jar({ x, y, s = 1, fill = '#c98f4f', lid = '#d6453b', w = 26, h = 30, glass }: { x: number; y: number; s?: number; fill?: string; lid?: string; w?: number; h?: number; glass?: boolean }) {
  const hw = w / 2;
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: `M${-hw} ${-h + 8}Q${-hw} ${-h + 4} ${-hw + 4} ${-h + 4}H${hw - 4}Q${hw} ${-h + 4} ${hw} ${-h + 8}V-3Q${hw} 0 ${hw - 3} 0H${-hw + 3}Q${-hw} 0 ${-hw} -3Z`, f: glass ? '#dcedf5' : fill },
          ...(glass ? [{ d: `M${-hw} ${-h * 0.55}H${hw}V-3Q${hw} 0 ${hw - 3} 0H${-hw + 3}Q${-hw} 0 ${-hw} -3Z`, f: fill, no: true } as Sh] : []),
          { d: rrect(-hw - 1, -h - 3, w + 2, 9, 2), f: lid },
          { d: rrect(-hw + 3, -h * 0.62, w - 6, h * 0.36, 1.5), f: '#f4ead2', ln: true },
        ]}
      />
      {glass && <path d={`M${-hw + 4} ${-h + 10}V-6`} stroke="#fff" stroke-width={2} stroke-linecap="round" opacity={0.8} />}
    </G>
  );
}

/** Paket (yukarıdan/önden düz). SOL ÜST */
function Pack({ x, y, w = 40, h = 50, c = '#e6b84a', a = 0, kind = 'fruit' }: { x: number; y: number; w?: number; h?: number; c?: string; a?: number; kind?: 'fruit' | 'biscuit' | 'food' | 'snack' }) {
  const cx = x + w / 2, cy = y + h / 2;
  return (
    <g transform={a ? `rotate(${a} ${cx} ${cy})` : undefined}>
      <OG
        sh={[
          { d: `M${x} ${y + 4}L${x + 4} ${y}L${x + 8} ${y + 4}L${x + 12} ${y}L${x + 16} ${y + 4}L${x + w - 16} ${y + 4}L${x + w - 12} ${y}L${x + w - 8} ${y + 4}L${x + w - 4} ${y}L${x + w} ${y + 4}V${y + h}H${x}Z`, f: c },
          { d: rrect(x, y + 4, w, 6, 0), f: shade(c, 0.15), no: true },
          ...(kind === 'fruit' ? [{ d: ell([cx, cy + 4], w * 0.32, h * 0.26), f: '#f7efd9', ln: true } as Sh] : []),
          ...(kind === 'food' ? [{ d: rrect(x + 5, y + h * 0.32, w - 10, h * 0.5, 4), f: '#fff', ln: true } as Sh] : []),
        ]}
      />
      {kind === 'fruit' && [[-6, 2], [4, 6], [-2, 10], [6, -2], [-8, 9]].map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r={2.8} fill={i % 2 ? '#8b4a2b' : '#c57a2e'} />)}
      {kind === 'biscuit' && [0, 1, 2].map((i) => <circle key={i} cx={x + w * (0.22 + i * 0.28)} cy={cy + 4} r={w * 0.12} fill="#e2b56a" stroke={K.out} stroke-width={1.2} />)}
      {kind === 'food' && (
        <g>
          <circle cx={cx - 4} cy={cy + 6} r={3.2} fill="#8b5a3a" />
          <circle cx={cx + 5} cy={cy + 3} r={3.2} fill="#8b5a3a" />
          <circle cx={cx + 2} cy={cy + 11} r={3.2} fill="#8b5a3a" />
        </g>
      )}
    </g>
  );
}

/** Konserve açacağı (yukarıdan). MERKEZ; a dönüş */
function Opener({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG
        sh={[
          { d: capsule([-30, 0], 5, [4, 0], 5), f: '#3b3f4b' },
          { d: rrect(2, -9, 22, 18, 4), f: K.metal },
          { d: circ([13, 0], 6), f: shade(K.metal, 0.2), ln: true },
          { d: 'M24 -5L32 -2L24 2Z', f: K.metal },
        ]}
      />
    </G>
  );
}

/** Masa üstü (yukarıdan tahta). */
function WoodTop({ c = TABLETOP }: { c?: string }) {
  return (
    <g>
      <rect width={320} height={240} fill={c} />
      {[48, 96, 144, 192].map((yy) => <rect key={yy} y={yy} width={320} height={1.6} fill={shade(c, 0.12)} />)}
      {[[40, 20], [210, 70], [120, 120], [260, 168], [70, 214]].map(([xx, yy], i) => <path key={i} d={`M${xx} ${yy}q14 -3 28 0`} stroke={shade(c, 0.1)} stroke-width={1.4} fill="none" />)}
    </g>
  );
}

/** Kesikli ok */
function DArrow({ from, to, bend = 0, w = 4, color = K.action, dash = '8 7' }: { from: P; to: P; bend?: number; w?: number; color?: string; dash?: string }) {
  const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  const nx = dy / len, ny = -dx / len;
  const c: P = [mx + nx * bend * len, my + ny * bend * len];
  const ang = Math.atan2(to[1] - c[1], to[0] - c[0]) / R;
  const hl = w * 2.6 + 6;
  const base = pol(to, ang, -hl);
  const d = `M${f1(from[0])} ${f1(from[1])}Q${f1(c[0])} ${f1(c[1])} ${f1(base[0])} ${f1(base[1])}`;
  const hp = poly([to, pol(base, ang + 90, hl * 0.6), pol(base, ang - 90, hl * 0.6)]);
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={w + 3} stroke-dasharray={dash} />
      <path d={hp} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} fill="none" stroke={color} stroke-width={w} stroke-dasharray={dash} />
      <path d={hp} fill={color} />
    </g>
  );
}

/** Takvim yaprağı (SOL ÜST) */
function Calendar({ x, y, w = 40, h = 44, text }: { x: number; y: number; w?: number; h?: number; text?: string }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 4), f: '#fbfaf5' }, { d: rrect(x, y, w, h * 0.28, 4), f: K.red }, { d: rrect(x, y + h * 0.2, w, h * 0.08, 0), f: K.red, no: true }]} />
      <circle cx={x + w * 0.3} cy={y + 2} r={2.4} fill={K.ink} />
      <circle cx={x + w * 0.7} cy={y + 2} r={2.4} fill={K.ink} />
      {text ? (
        <T x={x + w / 2} y={y + h * 0.8} text={text} size={h * 0.32} />
      ) : (
        <g fill="#c3c6cc">
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={x + 5 + (i % 3) * (w - 10) / 3} y={y + h * 0.38 + Math.floor(i / 3) * h * 0.18} width={(w - 10) / 3 - 3} height={h * 0.12} rx={1} />)}
        </g>
      )}
    </g>
  );
}

/** Telefon gövdesi + ekran içeriği (MERKEZ x,y; çocuklar yerel koordinatta, ekran -16..16 × -31..27) */
function PhoneBody({ x, y, s = 1, a = 0, screen = '#eaf4fb', children }: { x: number; y: number; s?: number; a?: number; screen?: string; children?: ComponentChildren }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG sh={[{ d: rrect(-19, -36, 38, 72, 7), f: '#2f3542' }]} ow={1.5 / s} />
      <rect x={-16} y={-31} width={32} height={58} rx={3} fill={screen} />
      <rect x={-5} y={-34} width={10} height={1.6} rx={0.8} fill="#596273" />
      {children}
    </G>
  );
}

/** Bulut (MERKEZ) */
function CloudIcon({ x, y, s = 1, c = '#fbfaf7' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: 'M-30 14Q-40 14 -40 4Q-40 -6 -28 -7Q-26 -22 -10 -22Q2 -30 14 -20Q30 -22 32 -6Q42 -4 42 5Q42 14 32 14Z', f: c }]} />
    </G>
  );
}

/** Asma kilit (MERKEZ) */
function Lock({ x, y, s = 1, c = K.safe }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: 'M-6 -2V-8Q-6 -14 0 -14Q6 -14 6 -8V-2', st: K.out, sw: 3.4 }, { d: rrect(-10, -3, 20, 16, 3), f: c }, { d: circ([0, 4], 2.4), f: K.ink, no: true }]} />
    </G>
  );
}

/** Baz istasyonu kulesi. x,y = taban ortası; h boy */
function Tower({ x, y, h = 110, c = '#d6453b' }: { x: number; y: number; h?: number; c?: string }) {
  const top = y - h;
  const w = h * 0.22;
  const lat: string[] = [];
  for (let i = 0; i < 5; i++) {
    const t0 = i / 5, t1 = (i + 1) / 5;
    const xa = (t: number) => w * (1 - t) + 3 * t;
    const y0 = y - h * 0.8 * t0, y1 = y - h * 0.8 * t1;
    lat.push(`M${f1(x - xa(t0))} ${f1(y0)}L${f1(x + xa(t1))} ${f1(y1)}M${f1(x + xa(t0))} ${f1(y0)}L${f1(x - xa(t1))} ${f1(y1)}`);
  }
  return (
    <g>
      <path d={`M${x - w} ${y}L${x - 3} ${y - h * 0.8}M${x + w} ${y}L${x + 3} ${y - h * 0.8}`} stroke={K.out} stroke-width={5.5} stroke-linecap="round" />
      <path d={`M${x - w} ${y}L${x - 3} ${y - h * 0.8}M${x + w} ${y}L${x + 3} ${y - h * 0.8}`} stroke={c} stroke-width={3} stroke-linecap="round" />
      <path d={lat.join('')} stroke={c} stroke-width={1.6} />
      <OG sh={[{ d: rrect(x - 2.5, top, 5, h * 0.22, 1), f: c }, { d: rrect(x - 11, top + 6, 6, 18, 1.5), f: '#e9ecef' }, { d: rrect(x + 5, top + 6, 6, 18, 1.5), f: '#e9ecef' }]} />
      <circle cx={x} cy={top - 2} r={3} fill={c} stroke={K.out} stroke-width={1.2} />
    </g>
  );
}

/** Sinyal çubukları (SOL ALT x,y). n dolu çubuk sayısı */
function Bars({ x, y, n = 0, s = 1, on = K.ink }: { x: number; y: number; n?: number; s?: number; on?: string }) {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + i * 4 * s} y={y - (3 + i * 2.4) * s} width={2.8 * s} height={(3 + i * 2.4) * s} rx={0.6} fill={i < n ? on : 'none'} stroke={'#8a93a1'} stroke-width={0.8} />
      ))}
    </g>
  );
}

/** Kilitli (ziplock) şeffaf poşet. SOL ÜST x,y */
function ZipBag({ x, y, w, h, children, drops = true }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; drops?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill="#d6ecfa" opacity={0.5} />
      {children}
      <rect x={x} y={y} width={w} height={h} rx={5} fill="#cfe8f8" opacity={0.35} stroke={K.out} stroke-width={1.6} />
      <rect x={x + 3} y={y + 5} width={w - 6} height={5} rx={2} fill="#d84b4b" opacity={0.9} stroke={K.out} stroke-width={1} />
      <path d={`M${x + 8} ${y + 18}V${y + h - 10}`} stroke="#fff" stroke-width={3} opacity={0.75} stroke-linecap="round" />
      {drops && (
        <g>
          {[[0.32, 0.3], [0.7, 0.5], [0.5, 0.78], [0.86, 0.22]].map(([u, v], i) => {
            const px = x + w * u, py = y + h * v;
            return (
              <g key={i}>
                <path d={`M${px} ${py - 18}V${py - 6}`} stroke="#fff" stroke-width={2} opacity={0.7} stroke-linecap="round" />
                <path transform={`translate(${px} ${py})`} d="M0 -7C2.5 -3 5 -1 5 2.5A5 5 0 0 1 -5 2.5C-5 -1 -2.5 -3 0 -7Z" fill={K.water} stroke={K.out} stroke-width={1} />
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}

/** Mavi eldiven filtresi (Hand'i lateks eldivene çevirir) */
const GloveDefs = () => (
  <defs>
    <filter id="hz-glove" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="0.10 0.12 0.04 0 0.02  0.25 0.30 0.10 0 0.06  0.45 0.40 0.15 0 0.18  0 0 0 1 0" />
    </filter>
  </defs>
);

/* ════════════════════════ nesneler ════════════════════════ */

/** Yangın söndürücü. x,y = taban ortası */
function Extinguisher({ x, y, s = 1, gauge = false }: { x: number; y: number; s?: number; gauge?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M8 -66C24 -66 30 -56 30 -40V-22', st: K.out, sw: 5 / s + 2 },
          { d: 'M8 -66C24 -66 30 -56 30 -40V-22', st: '#3b3f4b', sw: 5 },
          { d: rrect(26, -24, 8, 10, 2), f: '#3b3f4b' },
          { d: 'M-16 -6V-50Q-16 -62 0 -62Q16 -62 16 -50V-6Q16 0 10 0H-10Q-16 0 -16 -6Z', f: K.red },
          { d: 'M6 -60Q16 -58 16 -50V-6Q16 0 10 0H6Z', f: shade(K.red, 0.18), no: true },
          { d: rrect(-12, -42, 24, 18, 2), f: '#f4f1ea', ln: true },
          { d: rrect(-5, -72, 10, 11, 2), f: '#3b3f4b' },
          { d: 'M-4 -72L-18 -80L-16 -84L2 -76Z', f: '#3b3f4b' },
          { d: 'M3 -71L14 -71L16 -67H5Z', f: '#3b3f4b' },
          { d: 'M-10 -55Q-10 -59 -6 -60', st: tint(K.red, 0.5), sw: 2.4 },
          ...(gauge ? [{ d: circ([-9, -70], 5), f: '#fff' } as Sh] : []),
        ]}
      />
      <path d="M-6 -33H6M-6 -29H3" stroke={K.out} stroke-width={1.6} stroke-linecap="round" />
    </g>
  );
}

/** İlk yardım kutusu, kırmızı hilalli. x,y = taban ortası */
function CrescentKit({ x, y, s = 1, w = 56, h = 40 }: { x: number; y: number; s?: number; w?: number; h?: number }) {
  const hw = w / 2;
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: `M-9 ${-h + 2}V${-h - 4}Q-9 ${-h - 7} -6 ${-h - 7}H6Q9 ${-h - 7} 9 ${-h - 4}V${-h + 2}`, st: K.out, sw: 3.4 },
          { d: rrect(-hw, -h, w, h, 5), f: '#fbfaf5' },
          { d: rrect(-hw, -h, w, 8, 4), f: '#e3e0d8' },
        ]}
      />
      <circle cx={-2} cy={-h * 0.5 + 1} r={12} fill={K.red} />
      <circle cx={3} cy={-h * 0.5 - 0.5} r={10} fill="#fbfaf5" />
    </G>
  );
}

/** Kedi (oturan, önden). x,y = taban ortası */
function Cat({ x, y, s = 1, c = '#e39a4f', flip }: { x: number; y: number; s?: number; c?: string; flip?: boolean }) {
  const d = shade(c, 0.2);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M14 -4Q34 -2 32 -18Q31 -28 24 -30', st: K.out, sw: 9 },
          { d: 'M14 -4Q34 -2 32 -18Q31 -28 24 -30', st: c, sw: 6 },
          { d: 'M-18 0Q-22 -26 -10 -38H10Q22 -26 18 0Z', f: c },
          { d: 'M-8 0V-14M8 0V-14', st: d, sw: 1.6 },
          { d: 'M-16 -52L-15 -70L-4 -60Z', f: c },
          { d: 'M16 -52L15 -70L4 -60Z', f: c },
          { d: ell([0, -50], 17, 14), f: c },
          { d: 'M-13 -64L-12 -59L-8 -61Z', f: '#f2b7a7', no: true },
          { d: 'M13 -64L12 -59L8 -61Z', f: '#f2b7a7', no: true },
          { d: ell([0, -42], 7, 5), f: tint(c, 0.55), no: true },
          { d: ell([0, -20], 8, 12), f: tint(c, 0.4), no: true },
        ]}
      />
      <path d="M-6 -60L-4 -55M6 -60L4 -55" stroke={d} stroke-width={2} stroke-linecap="round" />
      <ellipse cx={-6.5} cy={-50} rx={2.4} ry={3} fill={K.ink} />
      <ellipse cx={6.5} cy={-50} rx={2.4} ry={3} fill={K.ink} />
      <path d="M-2 -45H2L0 -43Z" fill="#c4626a" />
      <path d="M0 -43Q-2 -40 -4 -41M0 -43Q2 -40 4 -41" stroke={K.out} stroke-width={1} fill="none" stroke-linecap="round" />
      <path d="M-8 -44H-18M-8 -42L-17 -39M8 -44H18M8 -42L17 -39" stroke={K.out} stroke-width={0.8} />
    </g>
  );
}

/** Köpek (yandan, sağa bakar). x,y = arka ayaklar arası taban */
function Dog({ x, y, s = 1, color = '#b9814d', flip, collar }: { x: number; y: number; s?: number; color?: string; flip?: boolean; collar?: string }) {
  const dk = shade(color, 0.22);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([-18, -26], 4, [-34, -46], 3), f: color },
          { d: capsule([-12, -22], 5, [-14, -2], 4), f: dk },
          { d: capsule([22, -22], 5, [24, -2], 4), f: dk },
          { d: ell([2, -30], 26, 13), f: color },
          { d: capsule([-6, -24], 5.5, [-6, -2], 4.4), f: color },
          { d: capsule([16, -24], 5.5, [18, -2], 4.4), f: color },
          { d: capsule([22, -34], 8, [30, -50], 8), f: color },
          ...(collar ? [{ d: capsule([21, -42], 3, [36, -46], 3), f: collar } as Sh] : []),
          { d: ell([34, -56], 12, 11), f: color },
          { d: capsule([40, -52], 7, [50, -50], 6), f: tint(color, 0.15) },
          { d: 'M28 -64Q22 -54 26 -44Q32 -50 32 -60Z', f: dk },
        ]}
      />
      <circle cx={52} cy={-52} r={2.6} fill={K.ink} />
      <circle cx={38} cy={-58} r={2} fill={K.ink} />
      <path d="M44 -46Q48 -44 52 -46" stroke={K.out} stroke-width={1.3} fill="none" stroke-linecap="round" />
    </g>
  );
}


/** Araç arkası (açık bagaj). x = orta, y = zemin. Çocuklar bagaj tabanına konur (taban y - 46). */
function CarRear({ x, y, c = '#d0473d', snow, children }: { x: number; y: number; c?: string; snow?: boolean; children?: ComponentChildren }) {
  const d = shade(c, 0.18);
  return (
    <g>
      <ellipse cx={x} cy={y + 2} rx={130} ry={8} fill="#000" opacity={0.15} />
      <OG
        sh={[
          { d: rrect(x - 116, y - 30, 36, 30, 5), f: '#2a2d35' },
          { d: rrect(x + 80, y - 30, 36, 30, 5), f: '#2a2d35' },
          // gövde yan direkleri ve tavan
          { d: `M${x - 120} ${y - 60}L${x - 112} ${y - 120}Q${x - 110} ${y - 128} ${x - 100} ${y - 128}H${x + 100}Q${x + 110} ${y - 128} ${x + 112} ${y - 120}L${x + 120} ${y - 60}Z`, f: c },
          // bagaj içi
          { d: `M${x - 98} ${y - 46}L${x - 94} ${y - 118}H${x + 94}L${x + 98} ${y - 46}Z`, f: '#2c2a30' },
          { d: `M${x - 98} ${y - 46}L${x - 90} ${y - 66}H${x + 90}L${x + 98} ${y - 46}Z`, f: '#55565e' },
          // alt gövde + tampon
          { d: rrect(x - 124, y - 64, 248, 40, 8), f: c },
          { d: rrect(x - 124, y - 40, 248, 18, 6), f: '#3b3f4b' },
          { d: rrect(x - 26, y - 58, 52, 14, 2), f: '#f4f1ea', ln: true },
          // stop lambaları
          { d: rrect(x - 120, y - 112, 16, 40, 4), f: '#e8473d' },
          { d: rrect(x + 104, y - 112, 16, 40, 4), f: '#e8473d' },
          // açık bagaj kapağı
          { d: `M${x - 104} ${y - 132}L${x - 116} ${y - 176}H${x + 116}L${x + 104} ${y - 132}Z`, f: d },
          { d: `M${x - 94} ${y - 140}L${x - 102} ${y - 168}H${x + 102}L${x + 94} ${y - 140}Z`, f: '#9fc4dc' },
        ]}
      />
      <path d={`M${x - 70} ${y - 162}L${x - 40} ${y - 146}M${x - 50} ${y - 164}L${x - 20} ${y - 148}`} stroke="#fff" stroke-width={3} opacity={0.5} stroke-linecap="round" />
      {snow && (
        <g>
          <path d={`M${x - 118} ${y - 176}Q${x - 118} ${y - 186} ${x - 96} ${y - 186}Q${x - 60} ${y - 192} ${x} ${y - 186}Q${x + 60} ${y - 192} ${x + 112} ${y - 184}Q${x + 120} ${y - 180} ${x + 116} ${y - 176}Z`} fill="#fbfdff" stroke={K.out} stroke-width={1.4} />
          <path d={`M${x - 124} ${y - 64}Q${x - 100} ${y - 70} ${x - 80} ${y - 64}M${x + 80} ${y - 64}Q${x + 100} ${y - 70} ${x + 124} ${y - 64}`} stroke="#fbfdff" stroke-width={5} stroke-linecap="round" />
        </g>
      )}
      {children}
    </g>
  );
}

/** Katlanmış üçgen reflektör (kutusunda). x,y = taban ortası */
function Reflector({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-24, -16, 48, 16, 3), f: '#3b3f4b' }, { d: 'M0 -46L24 -6H-24Z', f: K.red }, { d: 'M0 -34L14 -10H-14Z', f: '#3b3f4b' }]} />
    </G>
  );
}

/** Basınç göstergesi (MERKEZ). v: 0..1 ibre konumu */
function Gauge({ x, y, r = 40, v = 0.5 }: { x: number; y: number; r?: number; v?: number }) {
  const a0 = 210, a1 = 330; // derece, saat yönünde (yukarı yay)
  const arc = (from: number, to: number, rr: number) => {
    const p1 = pol([x, y], from, rr), p2 = pol([x, y], to, rr);
    return `M${f1(p1[0])} ${f1(p1[1])}A${rr} ${rr} 0 0 1 ${f1(p2[0])} ${f1(p2[1])}`;
  };
  const span = a1 - a0;
  const na = a0 + span * v;
  const tip = pol([x, y], na, r * 0.74);
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#c9ced6' }, { d: circ([x, y], r * 0.86), f: '#fbfaf7', ln: true }]} />
      <path d={arc(a0, a0 + span * 0.3, r * 0.68)} stroke={K.danger} stroke-width={r * 0.16} fill="none" />
      <path d={arc(a0 + span * 0.3, a0 + span * 0.7, r * 0.68)} stroke={K.safe} stroke-width={r * 0.16} fill="none" />
      <path d={arc(a0 + span * 0.7, a1, r * 0.68)} stroke={K.danger} stroke-width={r * 0.16} fill="none" />
      <path d={`M${x} ${y}L${f1(tip[0])} ${f1(tip[1])}`} stroke={K.ink} stroke-width={r * 0.07} stroke-linecap="round" />
      <circle cx={x} cy={y} r={r * 0.1} fill={K.ink} />
    </g>
  );
}

/* ════════════════════════ oyuncular (rehber başına sabit) ════════════════════════ */
// Aynı rehberin bütün adımlarında aynı kişi görünür. Yakın plan ellerde kol yeni = rol rengi, ten = skin.
// afet-cantasi, hazirlik-belgeler ve hazirlik-ilk-yardim-cantasi ortak el sahneleri paylaşır
// (hazirlik-belge-posette, hazirlik-tarih-kontrol): üçünde de camgöbeği kol + ten 1.
const CANTA = { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 1 } as const;
const BELGE = { who: 'man', role: 'helper', skin: 1, hairC: K.hair.dark } as const;
const ILKY = { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.black, skin: 1 } as const;
const ILETISIM = { sleeve: K.role.helper, skin: 1 } as const; // ortak whistle-signal/sms-send ile aynı
const EV = { who: 'man', role: 'helper', skin: 1, hairC: K.hair.black } as const;
// aile planı: ortak go-assembly-area sahnesindeki anne (hardal) + oğul (camgöbeği) ile aynı
const AILE = {
  mom: { who: 'woman', role: 'bystander2', skin: 1 },
  son: { who: 'boy', role: 'helper', skin: 1 },
  dad: { who: 'man', role: 'bystander', skin: 1, hairC: K.hair.black, mustache: true },
  girl: { who: 'girl', role: 'bystander3', skin: 1 },
} as const;
const ARAC = { sleeve: K.role.helper, skin: 1 } as const;
const IS = { who: 'man', role: 'bystander', skin: 2, hairC: K.hair.black, mustache: true } as const;
const EVCIL = { who: 'man', role: 'bystander', skin: 1, hairC: K.hair.dark } as const;
const HAND_HS = { sleeve: K.role.helper, skin: 1 } as const; // ortak el sahneleri

/* ════════════════════════ sahneler ════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ─────────── afet çantası ─────────── */
  'hazirlik-canta-kapi': () => {
    const hook: P = [96, 74];
    const p: PersonProps = {
      x: 168, y: 230, s: 1.18, ...CANTA,
      pose: { ...POSE.stand, armB: { to: [hook[0] + 2, hook[1] + 14] }, armF: { to: [236, 134] }, face: 'neutral' },
    };
    return (
      <Scene2 bg="indoor">
        <Door x={182} y={204} w={66} h={150} />
        <OG sh={[{ d: rrect(80, 66, 34, 8, 2), f: K.wood }, { d: capsule([96, 70], 2.5, [96, 80], 2.5), f: '#5b6070' }]} />
        <FrontPack x={hook[0]} y={hook[1] + 4} s={1.15} />
        <Person {...p} />
        <Arrow from={[40, 40]} to={[70, 92]} bend={-0.2} />
        <Ok x={290} y={30} />
      </Scene2>
    );
  },

  'hazirlik-canta-su-gida': () => (
    <Scene2 bg="closeup">
      <WoodTop />
      <OpenPack x={52} y={128} s={1.2} />
      <Bottle x={110} y={92} a={90} s={1} fill={0.9} />
      <Bottle x={110} y={116} a={90} s={1} fill={0.9} />
      <CanTop x={174} y={60} />
      <CanTop x={206} y={60} c="#3d7ad6" />
      <CanTop x={174} y={92} c="#6c9c5a" />
      <Pack x={226} y={76} w={40} h={50} kind="fruit" c="#e6b84a" />
      <Pack x={118} y={146} w={60} h={34} kind="biscuit" c="#4f7fb0" />
      <Jar x={210} y={190} fill="#d9c08a" lid="#8b5a3a" />
      <Jar x={244} y={190} fill="#5a2f1e" lid="#d6453b" />
      <Opener x={190} y={214} a={-8} />
      <Label x={274} y={32} text="3 gün" size={15} />
    </Scene2>
  ),

  'hazirlik-canta-koruma': () => (
    <Scene2 bg="closeup">
      <WoodTop />
      <OpenPack x={50} y={120} s={1.2} />
      <Whistle x={124} y={52} s={1.1} />
      {/* toz maskesi */}
      <g>
        <path d="M168 46Q150 30 140 50M232 46Q250 30 260 50" stroke={K.out} stroke-width={2} fill="none" />
        <OG sh={[{ d: 'M170 40Q200 26 230 40L226 64Q200 80 174 64Z', f: '#f4f1ea' }, { d: 'M200 32V74', st: shade('#f4f1ea', 0.2), sw: 1.4 }, { d: circ([212, 54], 5), f: '#c8ccd2', ln: true }]} />
      </g>
      {/* iş eldiveni */}
      <G x={262} y={92} a={20}>
        <OG sh={[{ d: 'M-14 30V-6Q-14 -12 -10 -12V-28Q-10 -32 -6 -32Q-3 -32 -3 -28V-14H-1V-32Q-1 -36 3 -36Q6 -36 6 -32V-14H8V-28Q8 -32 11 -32Q14 -32 14 -28V-6L20 -14Q24 -16 25 -12L16 6V30Z', f: '#d99a3a' }, { d: rrect(-15, 18, 32, 14, 2), f: '#b77a2a' }]} />
      </G>
      <G x={236} y={110} a={-10}>
        <OG sh={[{ d: 'M-14 30V-6Q-14 -12 -10 -12V-28Q-10 -32 -6 -32Q-3 -32 -3 -28V-14H-1V-32Q-1 -36 3 -36Q6 -36 6 -32V-14H8V-28Q8 -32 11 -32Q14 -32 14 -28V-6L20 -14Q24 -16 25 -12L16 6V30Z', f: '#d99a3a' }, { d: rrect(-15, 18, 32, 14, 2), f: '#b77a2a' }]} />
      </G>
      {/* kapalı çakı */}
      <G x={124} y={104} a={-14}>
        <OG sh={[{ d: capsule([-22, 0], 7, [22, 0], 7), f: K.red }, { d: 'M-24 -1H24', st: K.metal, sw: 2 }]} />
        <path d="M-4 -2h8v4h-8zM-2 -4h4v8h-4z" fill="#fff" />
      </G>
      {/* küçük makas */}
      <G x={168} y={118} a={-30}>
        <OG sh={[{ d: circ([-18, -6], 6), f: 'none', st: K.out, sw: 5.5 }, { d: circ([-18, 6], 6), f: 'none', st: K.out, sw: 5.5 }]} />
        <g fill="none" stroke="#3d7ad6" stroke-width={3}>
          <circle cx={-18} cy={-6} r={6} />
          <circle cx={-18} cy={6} r={6} />
        </g>
        <OG sh={[{ d: 'M-12 -3L22 1L-12 5Z', f: K.metal }, { d: 'M-12 3L22 -1L-12 -5Z', f: tint(K.metal, 0.2) }]} />
      </G>
      {/* katlanmış yağmurluk */}
      <OG sh={[{ d: rrect(110, 150, 74, 50, 6), f: '#f2c230' }, { d: 'M110 168H184', st: shade('#f2c230', 0.25), sw: 1.6 }, { d: 'M147 150V200', st: shade('#f2c230', 0.25), sw: 1.6 }, { d: rrect(110, 182, 74, 18, 6), f: shade('#f2c230', 0.1), no: true }]} />
      {/* rulo battaniye */}
      <OG sh={[{ d: rrect(200, 158, 84, 40, 18), f: '#7d6aa8' }, { d: ell([270, 178], 14, 20), f: '#9887c0' }, { d: 'M270 168a6 8 0 1 1 -2 14a3 4 0 1 1 1 -7', st: shade('#7d6aa8', 0.3), sw: 1.6 }, { d: 'M220 158V198M244 158V198', st: '#3b3f4b', sw: 3 }]} />
    </Scene2>
  ),

  'hazirlik-tarih-kontrol': () => {
    const box = { x: 160, y: 134 };
    return (
      <Scene2 bg="closeup">
        <Calendar x={232} y={22} w={58} h={60} />
        <Hand x={116} y={232} a={30} s={1.2} pose="open" side="L" view="back" arm={80} {...HAND_HS} />
        <G x={box.x} y={box.y} a={-6}>
          <OG sh={[{ d: rrect(-40, -46, 80, 92, 4), f: '#fbfaf5' }, { d: rrect(-40, -46, 80, 22, 4), f: '#3d7ad6' }, { d: rrect(-40, -30, 80, 6, 0), f: '#3d7ad6', no: true }, { d: capsule([-14, -10], 7, [14, -10], 7), f: '#e8a33d' }, { d: 'M0 -17V-3', st: K.out, sw: 1.4 }]} />
          <Lines x={-28} y={14} w={56} n={3} gap={7} />
          <rect x={-30} y={-42} width={44} height={13} rx={2.5} fill="#fff" stroke={K.out} stroke-width={1.4} />
          <T x={-8} y={-32} text="06/27" size={10} />
        </G>
        {(() => {
          const pt0: HandProps = { x: 0, y: 0, a: -40, s: 1.1, pose: 'point', side: 'R', view: 'back', arm: 160, ...HAND_HS };
          const t = handPoint(pt0, 'tip');
          return <Hand {...pt0} x={177 - t[0]} y={103 - t[1]} />;
        })()}
        <Label x={58} y={60} text="6 ay" size={18} />
        <Ok x={284} y={206} r={15} />
      </Scene2>
    );
  },

  /* ─────────── belgeler ─────────── */
  'hazirlik-belge-posette': () => {
    const bx = 46, by = 74, bw = 228, bh = 146;
    const slider: P = [196, by + 7];
    const h0: HandProps = { x: 0, y: 0, a: 176, s: 1.0, pose: 'pinch', side: 'R', view: 'back', arm: 120, ...HAND_HS };
    const p0 = handPoint(h0, 'pinch');
    const h: HandProps = { ...h0, x: slider[0] - p0[0], y: slider[1] - p0[1] };
    const l0: HandProps = { x: 0, y: 0, a: 168, s: 0.95, pose: 'pinch', side: 'L', view: 'back', arm: 120, ...HAND_HS };
    const q0 = handPoint(l0, 'pinch');
    const corner: P = [bx + 6, by + 22];
    const lh: HandProps = { ...l0, x: corner[0] - q0[0], y: corner[1] - q0[1] };
    // damlalar yalnızca poşetin dış yüzeyinde, kâğıtların olmadığı kenar boşluklarında ve alt kenardan akıyor
    const drops: P[] = [[bx + 12, by + 60], [bx + 13, by + 112], [bx + bw - 12, by + 52], [bx + bw - 12, by + 104], [bx + 70, by + bh - 9], [bx + 160, by + bh - 9]];
    const drip: P[] = [[bx + 40, by + bh + 12], [bx + 128, by + bh + 14], [bx + 200, by + bh + 10]];
    return (
      <Scene2 bg="closeup">
        {/* şeffaf poşet: önce arka yüz */}
        <rect x={bx} y={by} width={bw} height={bh} rx={6} fill="#d6ecfa" opacity={0.55} />
        {/* içerideki KURU belgeler: kenarlardan içeride */}
        <Doc x={bx + 28} y={by + 24} w={74} h={98} a={-4} stamp title="t" />
        <Doc x={bx + 98} y={by + 22} w={74} h={98} a={3} title="t" />
        <IdCard x={bx + 150} y={by + 66} w={56} h={36} a={-6} />
        {/* poşetin ön yüzü */}
        <rect x={bx} y={by} width={bw} height={bh} rx={6} fill="#cfe8f8" opacity={0.3} stroke={K.out} stroke-width={1.8} />
        <path d={`M${bx + 10} ${by + 22}V${by + bh - 12}`} stroke="#fff" stroke-width={3} opacity={0.8} stroke-linecap="round" />
        {/* fermuar: solda kapalı, sağda hâlâ açık */}
        <rect x={bx + 3} y={by + 4} width={slider[0] - bx - 3} height={6} rx={2} fill="#d84b4b" stroke={K.out} stroke-width={1} />
        <path d={`M${slider[0]} ${by + 4}L${bx + bw - 4} ${by - 2}M${slider[0]} ${by + 10}L${bx + bw - 4} ${by + 14}`} stroke="#d84b4b" stroke-width={4} stroke-linecap="round" />
        <OG sh={[{ d: rrect(slider[0] - 7, slider[1] - 7, 14, 14, 3), f: '#3b3f4b' }]} />
        {/* dış yüzeydeki damlalar ve izleri */}
        {drops.map((d, i) => (
          <g key={i}>
            <path d={`M${d[0]} ${d[1] - 18}V${d[1] - 7}`} stroke="#fff" stroke-width={2.2} opacity={0.8} stroke-linecap="round" />
            <path transform={`translate(${d[0]} ${d[1]})`} d="M0 -7C2.5 -3 5 -1 5 2.5A5 5 0 0 1 -5 2.5C-5 -1 -2.5 -3 0 -7Z" fill={K.water} stroke={K.out} stroke-width={1} />
          </g>
        ))}
        {drip.map((d, i) => (
          <path key={i} transform={`translate(${d[0]} ${d[1]})`} d="M0 -7C2.5 -3 5 -1 5 2.5A5 5 0 0 1 -5 2.5C-5 -1 -2.5 -3 0 -7Z" fill={K.water} stroke={K.out} stroke-width={1} />
        ))}
        <Hand {...lh} />
        <Hand {...h} />
        {/* kapanma yönü */}
        <Arrow from={[84, by - 20]} to={[154, by - 20]} w={6} />
      </Scene2>
    );
  },

  'hazirlik-belge-fotokopi': () => {
    const btn: P = [188, 112];
    const p: PersonProps = { x: 90, y: 226, s: 1.12, ...BELGE, pose: { ...POSE.standSide, spine: -86, armF: { to: btn }, armB: [96, 84], face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        {/* fotokopi makinesi */}
        <OG
          sh={[
            { d: rrect(150, 120, 110, 92, 4), f: '#e6e8eb' },
            { d: rrect(150, 186, 110, 26, 3), f: '#cfd3d9' },
            { d: rrect(146, 104, 118, 18, 3), f: '#d2d6dc' },
            { d: rrect(178, 108, 22, 9, 2), f: '#3b3f4b' },
            { d: rrect(160, 132, 90, 10, 2), f: '#b9bec6', ln: true },
            { d: rrect(160, 160, 90, 10, 2), f: '#b9bec6', ln: true },
            { d: 'M260 136H292L296 146H260Z', f: '#cfd3d9' },
          ]}
        />
        <circle cx={186} cy={112.5} r={2.6} fill={K.safe} />
        {/* çıkan kopyalar: çıkış tepsisinde yatan deste */}
        <OG sh={[{ d: 'M258 134L298 130L300 136L258 140Z', f: PAPER }, { d: 'M258 129L297 125L298 131L258 135Z', f: PAPER }, { d: 'M258 124L296 120L297 126L258 130Z', f: PAPER }]} />
        {/* üstte asıl belgeler */}
        <IdCard x={212} y={92} w={34} h={14} c="#cfe3f7" />
        <Person {...p} />
        <Arrow from={[286, 64]} to={[282, 112]} w={5} />
      </Scene2>
    );
  },

  'hazirlik-belge-dijital': () => {
    const h: HandProps = { x: 128, y: 200, a: 4, s: 1.4, pose: 'hold', side: 'R', grip: 38, arm: 60, ...HAND_HS };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M0 196L320 196V240H0Z', f: TABLETOP }]} />
        <Doc x={30} y={176} w={110} h={40} a={0} />
        <Hand {...h}>
          <PhoneBody x={g[0]} y={g[1]} s={1.4} a={4}>
            <rect x={-12} y={-24} width={24} height={30} rx={1.5} fill="#fff" stroke={K.out} stroke-width={0.8} />
            <Lines x={-8} y={-18} w={16} n={4} gap={6} sw={1.6} />
            <circle cx={0} cy={18} r={5} fill="#fff" stroke={K.out} stroke-width={1.4} />
          </PhoneBody>
        </Hand>
        <CloudIcon x={250} y={56} s={1.1} c="#e1f0fb" />
        <Lock x={252} y={56} s={1.1} />
        {/* USB bellek */}
        <G x={262} y={170} a={-20}>
          <OG sh={[{ d: rrect(-12, -30, 24, 46, 5), f: '#3d7ad6' }, { d: rrect(-8, -44, 16, 16, 1.5), f: K.metal }, { d: rrect(-4, -40, 3, 4, 0.5), f: K.ink, no: true }, { d: rrect(1, -40, 3, 4, 0.5), f: K.ink, no: true }]} />
        </G>
        <Arrow from={[180, 90]} to={[212, 66]} bend={-0.1} />
        <Arrow from={[184, 140]} to={[234, 156]} bend={0.1} />
      </Scene2>
    );
  },

  'hazirlik-belge-yakina': () => {
    const env: P = [168, 138];
    const giver: PersonProps = { x: 116, y: 226, s: 1.1, ...BELGE, pose: { ...POSE.standSide, armF: { to: [env[0] - 8, env[1] + 2] }, face: 'neutral' } };
    const rel: PersonProps = { x: 222, y: 226, s: 1.1, flip: true, who: 'man', role: 'bystander2', skin: 0, hairC: K.hair.brown, pose: { ...POSE.standSide, armF: { to: [env[0] + 10, env[1] + 2] }, armB: [86, 100], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        {/* başka şehir silueti */}
        <g fill="#9fb3c8" stroke={K.out} stroke-width={1.2}>
          <rect x={196} y={98} width={22} height={102} />
          <rect x={220} y={76} width={18} height={124} />
          <rect x={240} y={110} width={26} height={90} />
          <rect x={268} y={88} width={16} height={112} />
          <path d="M286 200V96L294 70L302 96V200Z" />
          <rect x={304} y={120} width={20} height={80} />
        </g>
        <g fill="#cfdceb">
          {[[200, 106], [200, 122], [224, 86], [224, 104], [244, 118], [256, 118], [272, 98], [308, 128]].map(([xx, yy], i) => <rect key={i} x={xx} y={yy} width={6} height={7} />)}
        </g>
        {/* ev girişi */}
        <OG sh={[{ d: rrect(-4, 54, 112, 150, 2), f: '#f0dcc0' }, { d: 'M-10 58L52 26L114 58Z', f: '#c2583e' }]} />
        <Door x={22} y={204} w={60} h={118} />
        {/* valiz */}
        <OG sh={[{ d: 'M262 156V146H278V156', st: K.out, sw: 3 }, { d: rrect(254, 156, 32, 56, 4), f: '#3f5684' }, { d: 'M262 164V204M278 164V204', st: shade('#3f5684', 0.3), sw: 2 }, { d: circ([260, 216], 3.5), f: '#3b3f4b' }, { d: circ([280, 216], 3.5), f: '#3b3f4b' }]} />
        <Person {...giver} />
        <Person {...rel} />
        {/* zarf */}
        <G x={env[0]} y={env[1]} a={-4}>
          <OG sh={[{ d: rrect(-16, -11, 32, 22, 2), f: '#f3ecdc' }, { d: 'M-16 -10L0 2L16 -10', st: K.out, sw: 1.3 }]} />
        </G>
        <Arrow from={[150, 112]} to={[192, 112]} bend={-0.3} w={5} />
      </Scene2>
    );
  },

  /* ─────────── iletişim ─────────── */
  'hazirlik-112-baska-sebeke': () => {
    const h: HandProps = { x: 116, y: 252, a: 4, s: 2.2, pose: 'hold', side: 'R', grip: 38, arm: 40, ...ILETISIM };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="outdoor">
        <Tower x={44} y={196} h={110} c="#3d7ad6" />
        <Tower x={262} y={192} h={84} c="#d6453b" />
        <Hand {...h}>
          <PhoneBody x={g[0]} y={g[1]} s={2.2} a={4}>
            <rect x={-16} y={-31} width={32} height={9} fill="#d9e6f2" />
            <Bars x={-15} y={-23.6} n={0} s={0.7} />
            <T x={-3.6} y={-24.8} text="Sadece acil" size={3.25} anchor="start" w={700} />
            <T x={0} y={0} text="112" size={13} />
            <circle cx={0} cy={14} r={6.5} fill={K.safe} />
            <path d="M-3 11c.6-.6 1.3-.4 1.6.2l.6 1.3c.2.5 0 .9-.4 1.2l-.4.3c.4 1 1.2 1.8 2.2 2.2l.3-.4c.3-.4.8-.6 1.2-.4l1.3.6c.6.3.8 1 .2 1.6-.9.9-2.1 1-3.1.5-1.5-.8-2.8-2.1-3.6-3.6-.6-1-.4-2.2.5-3.1z" fill="#fff" />
          </PhoneBody>
        </Hand>
        <DArrow from={[176, 96]} to={[248, 104]} bend={0.18} />
        <Waves x={266} y={108} a={0} n={2} r={6} color={K.safe} />
      </Scene2>
    );
  },

  'hazirlik-pil-tasarruf': () => {
    const h: HandProps = { x: 150, y: 262, a: 0, s: 2.6, pose: 'hold', side: 'R', grip: 38, arm: 40, ...ILETISIM };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Hand {...h}>
          <PhoneBody x={g[0]} y={g[1]} s={2.6} screen="#26303f">
            {/* pil simgesi (sarı, düşük güç) */}
            <rect x={4} y={-28} width={9} height={4.6} rx={1} fill="none" stroke="#f2c230" stroke-width={0.9} />
            <rect x={13.2} y={-26.6} width={1.2} height={1.8} fill="#f2c230" />
            <rect x={5} y={-27} width={2.6} height={2.6} fill="#f2c230" />
            {/* parlaklık çubuğu */}
            <circle cx={9} cy={-15} r={2.2} fill="#ffd64a" />
            <g stroke="#ffd64a" stroke-width={0.7} stroke-linecap="round">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((an) => {
                const a1 = pol([9, -15], an, 3.2), a2 = pol([9, -15], an, 4.4);
                return <line key={an} x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} />;
              })}
            </g>
            <rect x={6} y={-8} width={6} height={30} rx={3} fill="#4b5668" />
            <rect x={6} y={14} width={6} height={8} rx={3} fill="#ffd64a" />
            <circle cx={9} cy={14} r={3.4} fill="#fff" stroke={K.out} stroke-width={0.5} />
            {/* güç tasarrufu düğmesi */}
            <circle cx={-8} cy={0} r={6.5} fill="#f2c230" stroke={K.out} stroke-width={0.6} />
            <rect x={-11} y={-2} width={5.6} height={4} rx={0.6} fill="none" stroke={K.ink} stroke-width={0.7} />
            <rect x={-5.4} y={-0.8} width={0.8} height={1.6} fill={K.ink} />
            <rect x={-10.3} y={-1.3} width={1.4} height={2.6} fill={K.ink} />
          </PhoneBody>
        </Hand>
        <Arrow from={[254, 60]} to={[254, 154]} w={7} />
      </Scene2>
    );
  },

  /* ─────────── ev sabitleme ─────────── */
  'hazirlik-dolap-sabitleme': () => {
    const grip: P = [236, 52];
    const p: PersonProps = {
      x: 176, y: 178, s: 1, ...EV,
      pose: { ...POSE.standSide, spine: -88, head: -80, armF: { to: grip }, armB: { to: [214, 76] }, face: 'neutral' },
    };
    return (
      <Scene2 bg="indoor">
        {/* duvar kesiti */}
        <rect x={276} y={0} width={44} height={240} fill="#d8ccb8" />
        <path d="M276 0V240" stroke={K.out} stroke-width={2} />
        <g stroke="#c4b69e" stroke-width={1.2}>
          {[20, 50, 80, 110, 140, 170, 200, 230].map((yy) => <line key={yy} x1={278} y1={yy} x2={320} y2={yy - 10} />)}
        </g>
        {/* kitaplık (yan + ön kenar) */}
        <OG
          sh={[
            { d: rrect(214, 42, 62, 162, 2), f: K.wood },
            { d: rrect(214, 42, 12, 162, 1), f: tint(K.wood, 0.15) },
            ...[78, 116, 154].map((yy) => ({ d: `M214 ${yy}H226`, st: K.out, sw: 1.4 } as Sh)),
          ]}
        />
        {/* L demir */}
        <OG sh={[{ d: 'M250 38H278V20H282V42H250Z', f: '#7b8794' }]} />
        <circle cx={263} cy={40} r={1.4} fill={K.ink} />
        <circle cx={280} cy={28} r={1.4} fill={K.ink} />
        {/* tabure */}
        <OG sh={[{ d: rrect(146, 178, 64, 8, 2), f: '#5a8fc0' }, { d: 'M152 186L148 214M204 186L208 214', st: K.out, sw: 6 }, { d: 'M152 186L148 214M204 186L208 214', st: '#5a8fc0', sw: 3.6 }]} />
        {/* matkap */}
        <G x={grip[0]} y={grip[1]}>
          <OG sh={[{ d: capsule([-6, 4], 4.5, [-2, -12], 5), f: '#2f3542' }, { d: rrect(-12, -24, 34, 14, 5), f: '#f2a83a' }, { d: rrect(22, -21, 8, 8, 1.5), f: '#3b3f4b' }, { d: 'M30 -17H42', st: K.out, sw: 2.6 }]} />
        </G>
        <Person {...p} />
        {/* ayrıntı balonu */}
        <defs><clipPath id="hz-balon"><circle cx={70} cy={72} r={51} /></clipPath></defs>
        <circle cx={70} cy={72} r={52} fill="#fff" />
        <g clip-path="url(#hz-balon)">
          <rect x={86} y={26} width={30} height={92} fill="#d8ccb8" />
          <path d="M86 26V118" stroke={K.out} stroke-width={1.6} />
          <rect x={28} y={84} width={58} height={34} fill={K.wood} stroke={K.out} stroke-width={1.6} />
          <OG sh={[{ d: 'M38 78H82V40H90V86H38Z', f: '#7b8794' }]} />
          <OG sh={[{ d: rrect(90, 51, 24, 10, 3), f: '#f2c230' }]} />
          <OG sh={[{ d: 'M80 54H112', st: '#4b5563', sw: 4 }, { d: rrect(76, 50, 6, 8, 1), f: '#5b6575' }]} />
          <OG sh={[{ d: 'M58 74V96', st: '#4b5563', sw: 4 }, { d: rrect(54, 72, 8, 6, 1), f: '#5b6575' }]} />
        </g>
        <circle cx={70} cy={72} r={52} fill="none" stroke={K.out} stroke-width={2.4} />
        <Arrow from={[28, 30]} to={[50, 66]} w={5} bend={-0.2} />
        <Ok x={300} y={222} />
      </Scene2>
    );
  },

  'hazirlik-yatak-yeri': () => {
    const Bedd = ({ x, y, w, h, faded }: { x: number; y: number; w: number; h: number; faded?: boolean }) =>
      faded ? (
        <g opacity={0.6}>
          <rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke="#5a4636" stroke-width={2.4} stroke-dasharray="7 5" />
          <rect x={x + 8} y={y + 6} width={w - 16} height={18} rx={5} fill="none" stroke="#5a4636" stroke-width={2} stroke-dasharray="5 4" />
        </g>
      ) : (
        <OG sh={[{ d: rrect(x, y, w, h, 4), f: '#f4f1ea' }, { d: rrect(x + 2, y + h * 0.3, w - 4, h * 0.7 - 2, 3), f: '#7aa6d6' }, { d: rrect(x + 8, y + 6, w - 16, 18, 6), f: '#fff' }, { d: `M${x + 2} ${y + h * 0.3 + 8}H${x + w - 2}`, st: shade('#7aa6d6', 0.25), sw: 1.4 }]} />
      );
    return (
      <Scene2 bg="floor">
        {/* duvarlar */}
        <path d="M14 14H306V226H14Z" fill="none" stroke="#5b6070" stroke-width={10} />
        {/* pencere (üst duvar) */}
        <rect x={74} y={9} width={90} height={10} fill="#bfe3f5" stroke={K.out} stroke-width={1.4} />
        <path d="M119 9V19" stroke={K.out} stroke-width={1.4} />
        {/* kapı (alt duvar) */}
        <rect x={210} y={221} width={50} height={10} fill={K.floor} />
        <path d="M210 226A50 50 0 0 1 260 176" fill="none" stroke="#7d6a58" stroke-width={1.4} stroke-dasharray="4 3" />
        <path d="M210 226V176" stroke="#8a5a3a" stroke-width={4} />
        {/* uzun dolap (sol duvar) */}
        <OG sh={[{ d: rrect(20, 24, 40, 116, 2), f: '#a8724a' }, { d: 'M20 82H60', st: K.out, sw: 1.4 }, { d: rrect(54, 28, 6, 108, 1), f: shade('#a8724a', 0.2), no: true }]} />
        {/* eski yer */}
        <Bedd x={68} y={24} w={92} h={120} faded />
        <No x={114} y={84} r={34} />
        {/* yeni yer: iç duvar */}
        <Bedd x={204} y={24} w={94} h={124} />
        <Ok x={250} y={170} r={14} />
        <Arrow from={[150, 170]} to={[204, 120]} bend={0.25} />
      </Scene2>
    );
  },

  'hazirlik-agir-alt-raf': () => {
    const L = 76, Rr = 234, top = 22, bot = 206;
    const shelves = [64, 108, 152];
    const Box = ({ x, y, w, h, c = '#d9b07a' }: { x: number; y: number; w: number; h: number; c?: string }) => (
      <OG sh={[{ d: rrect(x, y - h, w, h, 1.5), f: c }, { d: `M${x} ${y - h + 6}H${x + w}`, st: shade(c, 0.25), sw: 1.2 }, { d: rrect(x + w * 0.35, y - h, w * 0.3, 6, 0), f: '#e8d8b8', no: true }]} />
    );
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(L - 6, top - 6, Rr - L + 12, bot - top + 6, 3), f: K.wood }, { d: rrect(L, top, Rr - L, bot - top - 6, 1), f: shade(K.wood, 0.3) }, ...shelves.map((yy) => ({ d: rrect(L, yy, Rr - L, 6, 0), f: K.wood } as Sh))]} />
        {/* üst raflar: hafif kutular */}
        <Box x={88} y={64} w={40} h={28} />
        <Box x={134} y={64} w={30} h={20} c="#e3c493" />
        <Box x={176} y={64} w={46} h={32} c="#cfa36b" />
        <Box x={96} y={108} w={34} h={24} c="#e3c493" />
        <Box x={150} y={108} w={44} h={30} />
        {/* orta raf: birkaç kitap */}
        {[0, 1, 2, 3].map((i) => <OG key={i} sh={[{ d: rrect(90 + i * 11, 118 + (i % 2) * 4, 10, 34 - (i % 2) * 4, 1), f: ['#5b7fb6', '#c6574e', '#6c9c5a', '#d9a13a'][i] }]} />)}
        {/* alt raf: ağırlar */}
        {[0, 1, 2, 3, 4].map((i) => <OG key={i} sh={[{ d: rrect(84 + i * 13, 164, 12, 36, 1), f: ['#3f5684', '#8b3a3a', '#2f6b4f', '#6b4f3a', '#3f5684'][i] }, { d: `M${86 + i * 13} 172H${94 + i * 13}`, st: '#e9d8a8', sw: 1.4 }]} />)}
        <Jar x={176} y={200} w={30} h={36} glass fill="#d98c3a" lid="#8b5a3a" />
        <OG sh={[{ d: 'M206 200Q198 186 204 172Q210 162 208 154H222Q220 162 226 172Q232 186 224 200Z', f: '#4f9fe0' }, { d: 'M210 168Q214 166 218 168', st: '#fff', sw: 2 }]} />
        {/* gergin bant */}
        {[42, 86, 130, 178].map((yy) => (
          <g key={yy}>
            <path d={`M${L - 2} ${yy}H${Rr + 2}`} stroke={K.out} stroke-width={4} />
            <path d={`M${L - 2} ${yy}H${Rr + 2}`} stroke="#e9ecef" stroke-width={2} />
          </g>
        ))}
        <Arrow from={[270, 34]} to={[270, 184]} w={7} />
      </Scene2>
    );
  },

  'hazirlik-dolap-mandal': () => {
    const C = '#e8e2d6';
    return (
      <Scene2 bg="indoor" wall="#dfe7ea" gy={226}>
        {/* dolap gövdesi */}
        <OG sh={[{ d: rrect(14, 10, 292, 190, 3), f: C }, { d: rrect(150, 16, 44, 178, 1), f: '#4a4038' }]} />
        {/* raf ve kavanoz silueti */}
        <rect x={150} y={100} width={44} height={5} fill="#6b5d50" />
        {/* sol kapak (kapalı) */}
        <OG sh={[{ d: rrect(20, 16, 128, 178, 2), f: '#f6f2ea' }, { d: rrect(32, 28, 104, 154, 3), f: 'none', st: shade(C, 0.18), sw: 2 }, { d: rrect(126, 90, 6, 30, 3), f: '#8e99a6' }]} />
        {/* sağ kapak (aralık, öne açılmış) */}
        <OG sh={[{ d: 'M190 12L300 16V194L190 200Z', f: '#f6f2ea' }, { d: 'M184 14L190 12V200L184 197Z', f: shade(C, 0.25) }, { d: rrect(200, 28, 90, 152, 3), f: 'none', st: shade(C, 0.18), sw: 2 }]} />
        {/* çocuk emniyet mandalı */}
        <OG sh={[{ d: rrect(150, 60, 14, 22, 3), f: '#fbfaf7' }, { d: 'M162 70H186', st: K.out, sw: 7 }, { d: 'M162 70H186', st: '#fbfaf7', sw: 4.4 }, { d: rrect(180, 62, 8, 18, 2), f: '#fbfaf7' }, { d: 'M156 64Q150 70 156 76', st: K.out, sw: 1.4 }]} />
        {/* el kulpu çekiyor */}
        {(() => {
          const h: HandProps = { x: 252, y: 178, a: -36, s: 1.15, pose: 'fist', side: 'L', view: 'palm', arm: 80, sleeve: K.role.helper, skin: EV.skin };
          const g = handPoint(h, 'grip');
          return (
            <g>
              <OG sh={[{ d: rrect(g[0] - 4, g[1] - 40, 8, 52, 3), f: '#8e99a6' }]} />
              <Hand {...h} />
            </g>
          );
        })()}
        <path d="M244 98l12 -6M248 112l14 -2" stroke={K.ink} stroke-width={2.2} stroke-linecap="round" />
        <Arrow from={[96, 40]} to={[146, 66]} bend={-0.15} />
      </Scene2>
    );
  },

  'hazirlik-tv-kayis': () => {
    const anchors: P[] = [[86, 30], [194, 30]];
    return (
      <Scene2 bg="indoor">
        {/* sehpa */}
        <OG sh={[{ d: rrect(56, 160, 172, 46, 3), f: '#8a6248' }, { d: 'M142 166V200', st: K.out, sw: 1.4 }, { d: circ([132, 183], 2.5), f: '#d8c49a' }, { d: circ([152, 183], 2.5), f: '#d8c49a' }]} />
        {/* TV */}
        <OG sh={[{ d: rrect(124, 146, 36, 14, 2), f: '#3b3f4b' }, { d: rrect(66, 58, 152, 92, 4), f: '#2b2f3a' }, { d: rrect(72, 64, 140, 80, 2), f: '#3c5a7d' }]} />
        <path d="M84 76L104 64M84 92L124 68" stroke="#fff" stroke-width={3} opacity={0.25} stroke-linecap="round" />
        {/* kayışlar */}
        {anchors.map((a, i) => (
          <g key={i}>
            <OG sh={[{ d: rrect(a[0] - 8, a[1] - 6, 16, 10, 2), f: '#7b8794' }, { d: circ([a[0], a[1] - 1], 1.8), f: K.ink, no: true }]} />
            <path d={`M${a[0]} ${a[1] + 4}V60`} stroke={K.out} stroke-width={8} />
            <path d={`M${a[0]} ${a[1] + 4}V60`} stroke="#3f4552" stroke-width={5.4} />
            <OG sh={[{ d: rrect(a[0] - 5, 42, 10, 7, 1.5), f: '#b9c2cc' }]} />
          </g>
        ))}
        {/* tezgah + kaydırmaz ped + mikrodalga */}
        <OG sh={[{ d: rrect(232, 150, 92, 56, 2), f: '#c2a07a' }, { d: rrect(232, 144, 92, 8, 2), f: '#e5d9c6' }]} />
        <rect x={240} y={138} width={78} height={6} rx={1.5} fill="#3b6f4f" stroke={K.out} stroke-width={1.2} />
        <g fill="#5d9a74">{[244, 252, 260, 268, 276, 284, 292, 300, 308].map((xx) => <circle key={xx} cx={xx + 2} cy={141} r={1.3} />)}</g>
        <OG sh={[{ d: rrect(244, 96, 76, 42, 3), f: '#e6e8eb' }, { d: rrect(250, 102, 44, 30, 2), f: '#3b3f4b' }, { d: rrect(300, 104, 12, 24, 1), f: '#cfd3d9', ln: true }]} />
        <Arrow from={[40, 20]} to={[74, 40]} w={5} />
        <Arrow from={[150, 14]} to={[184, 34]} w={5} />
        <Arrow from={[224, 228]} to={[246, 146]} w={5} bend={-0.2} />
        <Ok x={292} y={30} />
      </Scene2>
    );
  },

  /* ─────────── aile planı ─────────── */
  'hazirlik-plan-masa': () => {
    const pen: P = [146, 172];
    const dad: PersonProps = { x: 116, y: 236, s: 1.05, ...AILE.dad, pose: { ...POSE.stand, head: -98, armF: { to: pen }, armB: { to: [92, 176] }, face: 'speak' } };
    const mom: PersonProps = { x: 206, y: 236, s: 1.02, ...AILE.mom, pose: { ...POSE.stand, head: -96, armB: { to: [190, 174] }, armF: { to: [226, 176] }, face: 'neutral' } };
    const boy: PersonProps = { x: 40, y: 230, s: 1, ...AILE.son, pose: { ...POSE.stand, head: -78, armF: { to: [70, 160] }, face: 'neutral' } };
    const girl: PersonProps = { x: 282, y: 230, s: 1, ...AILE.girl, pose: { ...POSE.stand, head: -102, armB: { to: [252, 162] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e6dccb">
        <Window x={124} y={22} w={72} h={50} />
        <Person {...dad} />
        <Person {...mom} />
        {/* masa (perspektif) */}
        <OG sh={[{ d: 'M60 154H260L284 196H36Z', f: K.wood }, { d: rrect(36, 196, 248, 10, 1), f: shade(K.wood, 0.2) }, { d: rrect(46, 206, 10, 30, 1), f: shade(K.wood, 0.25) }, { d: rrect(264, 206, 10, 30, 1), f: shade(K.wood, 0.25) }]} />
        {/* plan kâğıdı */}
        <OG sh={[{ d: 'M98 160H222L234 192H86Z', f: PAPER }]} />
        <OG sh={[{ d: 'M106 182V172L114 166L122 172V182Z', f: '#f0dcc0' }, { d: 'M104 172L114 164L124 172', st: K.red, sw: 2.2 }]} />
        <path d="M128 176Q150 170 172 174" stroke={K.action} stroke-width={2.4} fill="none" stroke-dasharray="4 3" />
        <path d="M170 170L178 174L170 178Z" fill={K.action} />
        <circle cx={190} cy={176} r={6} fill={K.safe} stroke={K.out} stroke-width={1.2} />
        <circle cx={212} cy={182} r={6} fill={K.safe} stroke={K.out} stroke-width={1.2} />
        <path d="M187 176h6M190 173v6M209 182h6M212 179v6" stroke="#fff" stroke-width={1.6} />
        <OG sh={[{ d: capsule([pen[0], pen[1]], 1.6, [pen[0] + 8, pen[1] - 16], 2.2), f: '#3d7ad6' }]} />
        <Person {...dad} only={['armF', 'armB']} />
        <Person {...mom} only={['armF', 'armB']} />
        <Person {...boy} />
        <Person {...girl} />
      </Scene2>
    );
  },

  'hazirlik-irtibat-kisi': () => {
    const young: PersonProps = { x: 70, ax: 'head', y: 84, ay: 'head', s: 1.5, ...AILE.mom, pose: { ...POSE.stand, armF: { at: 'head', d: [2, 14], bend: -1 }, face: 'speak' } };
    const y1 = rig(young);
    const elder: PersonProps = { x: 250, ax: 'head', y: 84, ay: 'head', s: 1.5, who: 'oldwoman', role: 'bystander', pose: { ...POSE.stand, armB: { at: 'head', d: [-2, 14], bend: 1 }, face: 'neutral' } };
    const e1 = rig(elder);
    return (
      <Scene2 bg="closeup">
        <defs>
          <clipPath id="hz-c1"><circle cx={74} cy={98} r={60} /></clipPath>
          <clipPath id="hz-c2"><circle cx={246} cy={98} r={60} /></clipPath>
        </defs>
        {/* harita */}
        <rect width={320} height={240} fill="#9fd0ee" />
        <path d="M-10 150Q30 120 80 132Q130 118 170 128Q220 112 270 124Q310 118 330 132V250H-10Z" fill="#cfe2b0" stroke={K.out} stroke-width={1.6} />
        <path d="M30 200Q60 190 90 198M200 210Q240 196 280 206" stroke="#b3cc8f" stroke-width={3} fill="none" />
        {/* sol: deprem bölgesi */}
        <g clip-path="url(#hz-c1)">
          <rect x={10} y={30} width={130} height={130} fill="#e9dcc8" />
          <path d="M14 30L40 30L46 160H14Z" fill="#cdbfa8" />
          <path d="M30 40l6 18l-8 12l9 16l-5 14" stroke={K.out} stroke-width={2} fill="none" />
          <path d="M120 30l-4 22l8 10l-6 18" stroke={K.out} stroke-width={2} fill="none" />
          <Person {...young} only={['torso', 'head', 'armB', 'armF']} />
        </g>
        <circle cx={74} cy={98} r={60} fill="none" stroke={K.out} stroke-width={3} />
        <OG sh={[{ d: rrect(y1.handF[0] - 4, y1.handF[1] - 12, 9, 18, 2), f: '#2f3542' }]} />
        {/* sağ: başka şehirdeki yaşlı akraba */}
        <g clip-path="url(#hz-c2)">
          <rect x={180} y={30} width={130} height={130} fill="#f3e3c4" />
          <Window x={270} y={52} w={40} h={44} />
          <Person {...elder} only={['torso', 'head', 'armB', 'armF']} />
        </g>
        <circle cx={246} cy={98} r={60} fill="none" stroke={K.out} stroke-width={3} />
        <OG sh={[{ d: rrect(e1.handB[0] - 5, e1.handB[1] - 12, 9, 18, 2), f: '#2f3542' }]} />
        {/* haritada iki nokta ve kesikli ok */}
        <circle cx={70} cy={196} r={7} fill={K.danger} stroke={K.out} stroke-width={1.5} />
        <circle cx={252} cy={206} r={7} fill={K.safe} stroke={K.out} stroke-width={1.5} />
        <DArrow from={[84, 200]} to={[240, 206]} bend={0.12} w={5} />
      </Scene2>
    );
  },

  'hazirlik-numara-kart': () => {
    const h0: HandProps = { x: 268, y: 40, a: -128, s: 1.25, pose: 'pinch', side: 'R', view: 'back', skin: AILE.mom.skin, arm: 120, sleeve: K.role.bystander2 };
    const p0 = handPoint(h0, 'pinch');
    const want: P = [238, 104];
    const h: HandProps = { ...h0, x: h0.x + want[0] - p0[0], y: h0.y + want[1] - p0[1] };
    const pin = want;
    return (
      <Scene2 bg="closeup">
        {/* açık cüzdan */}
        <OG sh={[{ d: rrect(36, 120, 250, 104, 10), f: '#8a5a3a' }, { d: 'M161 120V224', st: shade('#8a5a3a', 0.35), sw: 2 }, { d: rrect(176, 140, 98, 30, 4), f: '#6f4528' }, { d: rrect(176, 176, 98, 30, 4), f: '#6f4528' }, { d: rrect(48, 134, 100, 76, 6), f: '#7a4c2f' }]} />
        <path d="M44 128H152M170 128H278" stroke={tint('#8a5a3a', 0.3)} stroke-width={1.4} stroke-dasharray="4 3" />
        {/* katlanmış kart (cebe giriyor) */}
        <G x={pin[0] - 8} y={pin[1] + 24} a={-10}>
          <OG sh={[{ d: rrect(-46, -30, 92, 60, 3), f: PAPER }, { d: 'M0 -30V30', st: '#d6d2c6', sw: 1.4 }]} />
          <T x={-23} y={-12} text="112" size={17} c={K.danger} />
          {[4, 14].map((yy) => (
            <g key={yy}>
              <path transform={`translate(-38 ${yy - 5}) scale(0.55)`} d="M2 2c1-1 2.5-.8 3 .3l1.2 2.4c.3.8 0 1.6-.6 2.1l-.7.5c.7 1.8 2.2 3.3 4 4l.5-.7c.5-.6 1.4-.9 2.1-.6l2.4 1.2c1.1.5 1.3 2 .3 3-1.6 1.6-3.8 1.9-5.6.9-2.8-1.6-5.2-4-6.8-6.8-1-1.8-.7-4 .9-5.6z" fill={K.ink} />
              <path d={`M-26 ${yy}H-6`} stroke={LINE} stroke-width={2.4} stroke-linecap="round" />
            </g>
          ))}
          {[-14, -2, 10, 22].map((yy) => (
            <g key={yy}>
              <path transform={`translate(6 ${yy - 5}) scale(0.5)`} d="M2 2c1-1 2.5-.8 3 .3l1.2 2.4c.3.8 0 1.6-.6 2.1l-.7.5c.7 1.8 2.2 3.3 4 4l.5-.7c.5-.6 1.4-.9 2.1-.6l2.4 1.2c1.1.5 1.3 2 .3 3-1.6 1.6-3.8 1.9-5.6.9-2.8-1.6-5.2-4-6.8-6.8-1-1.8-.7-4 .9-5.6z" fill={K.ink} />
              <path d={`M17 ${yy}H40`} stroke={LINE} stroke-width={2.4} stroke-linecap="round" />
            </g>
          ))}
        </G>
        {/* cebin ön kenarı kartın üstünde */}
        <OG sh={[{ d: rrect(176, 140, 98, 30, 4), f: '#6f4528' }]} />
        <Hand {...h} />
        <Arrow from={[132, 92]} to={[180, 148]} bend={0.2} w={5} />
      </Scene2>
    );
  },

  'hazirlik-tatbikat': () => {
    // Ev tatbikatı: anne (aynı aile) sağlam masanın altında Çök-Kapan-Tutun; masa ayağını tutuyor.
    const leg: P = [292, 196];
    const p: PersonProps = { x: 168, y: 228, s: 1.55, ...AILE.mom, pose: { ...POSE.dropCover, armB: { to: leg }, handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Calendar x={14} y={14} w={50} h={54} text="6 ay" />
        <Shake x1={84} x2={312} y={28} h={18} />
        <Table x={44} y={228} w={268} h={128} />
        <Person {...p} />
      </Scene2>
    );
  },

  /* ─────────── araç kiti ─────────── */
  'hazirlik-arac-zorunlu': () => (
    <Scene2 bg="outdoor" ground="pavement" gy={190}>
      <CarRear x={160} y={232} c="#5b7fb6">
        <Extinguisher x={98} y={186} s={0.62} />
        <CrescentKit x={164} y={186} s={1} w={60} h={40} />
        <Reflector x={228} y={186} s={0.9} />
        <Reflector x={236} y={186} s={0.9} />
      </CarRear>
      <Ok x={98} y={128} r={11} />
      <Ok x={164} y={128} r={11} />
      <Ok x={234} y={128} r={11} />
    </Scene2>
  ),

  'hazirlik-arac-stepne': () => {
    const valve: P = [118, 150];
    const h: HandProps = { x: 64, y: 224, a: 30, s: 1.05, pose: 'hold', side: 'R', grip: 16, arm: 80, ...ARAC };
    const g = handPoint(h, 'grip');
    const ang = Math.atan2(valve[1] - g[1], valve[0] - g[0]) / R;
    return (
      <Scene2 bg="closeup">
        {/* bagaj kuyusu */}
        <rect x={0} y={60} width={320} height={180} fill="#3a3b42" />
        <OG sh={[{ d: 'M-4 62L18 0H302L324 62Z', f: '#6b6e78' }, { d: 'M-4 62H324', st: K.out, sw: 2 }]} />
        <path d="M30 40H290" stroke="#5a5d66" stroke-width={2} />
        {/* stepne */}
        <OG sh={[{ d: circ([150, 150], 76), f: '#25262b' }, { d: circ([150, 150], 46), f: '#b9c2cc' }, { d: circ([150, 150], 14), f: '#8e99a6' }]} />
        <g stroke="#1b1c20" stroke-width={3}>{Array.from({ length: 16 }, (_, i) => { const a1 = pol([150, 150], i * 22.5, 56), a2 = pol([150, 150], i * 22.5, 72); return <line key={i} x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} />; })}</g>
        <g fill="#5b6575">{[0, 72, 144, 216, 288].map((an) => { const q = pol([150, 150], an, 26); return <circle key={an} cx={q[0]} cy={q[1]} r={4} />; })}</g>
        {/* kriko */}
        <G x={262} y={110}>
          <OG sh={[{ d: rrect(-26, 40, 52, 8, 2), f: '#2f6fb0' }, { d: 'M-22 40L0 14L22 40', st: K.out, sw: 7 }, { d: 'M-22 40L0 14L22 40', st: '#3d7ad6', sw: 4 }, { d: 'M-22 -12L0 14L22 -12', st: K.out, sw: 7 }, { d: 'M-22 -12L0 14L22 -12', st: '#3d7ad6', sw: 4 }, { d: rrect(-18, -20, 36, 8, 2), f: '#2f6fb0' }, { d: 'M-30 14H30', st: K.out, sw: 3.4 }]} />
        </G>
        {/* bijon anahtarı */}
        <OG sh={[{ d: 'M236 200L300 186', st: K.out, sw: 8 }, { d: 'M236 200L300 186', st: '#8e99a6', sw: 5 }, { d: 'M240 182L246 214', st: K.out, sw: 8 }, { d: 'M240 182L246 214', st: '#8e99a6', sw: 5 }]} />
        {/* supap */}
        <OG sh={[{ d: capsule([valve[0], valve[1]], 3, [valve[0] - 6, valve[1] + 8], 3), f: '#2b2d3a' }]} />
        {/* basınç ölçer (kalem tipi) */}
        <G x={g[0]} y={g[1]} a={ang}>
          <OG sh={[{ d: rrect(-40, -6, 56, 12, 4), f: '#c9ced6' }, { d: rrect(14, -8, 14, 16, 3), f: '#5b6575' }, { d: rrect(-56, -3, 18, 6, 2), f: '#fbfaf7' }]} />
          <path d="M-54 -3V3M-50 -3V3M-46 -3V3" stroke={K.ink} stroke-width={1} />
        </G>
        <Hand {...h} />
        <Waves x={valve[0] + 6} y={valve[1] - 16} a={-60} n={2} r={6} color={K.water} />
      </Scene2>
    );
  },

  'hazirlik-arac-kis': () => (
    <Scene2 bg="outdoor" ground="snow" gy={190}>
      <g fill="#fff" stroke="#b8c6d2" stroke-width={0.8}>
        {[[30, 40], [70, 90], [110, 30], [200, 20], [250, 70], [292, 36], [20, 130], [300, 120], [150, 14]].map(([xx, yy], i) => <circle key={i} cx={xx} cy={yy} r={i % 2 ? 2.4 : 3.2} />)}
      </g>
      <CarRear x={160} y={232} c="#6c9c5a" snow>
        {/* kar zinciri */}
        <g fill="none" stroke={K.out} stroke-width={1.2}>
          {[[78, 180], [90, 176], [102, 180], [84, 170], [96, 166], [108, 172], [72, 172], [90, 186]].map(([xx, yy], i) => <ellipse key={i} cx={xx} cy={yy} rx={6} ry={3.6} fill="#a3adb8" stroke-width={1.4} transform={`rotate(${i * 37} ${xx} ${yy})`} />)}
        </g>
        {/* kürek */}
        <OG sh={[{ d: 'M128 112L136 162', st: K.out, sw: 6 }, { d: 'M128 112L136 162', st: '#7b4e2e', sw: 3.6 }, { d: rrect(120, 104, 18, 8, 3), f: '#3b3f4b' }, { d: 'M126 158L148 156L150 184L128 186Z', f: '#3d7ad6' }]} />
        {/* buz kazıyıcı */}
        <OG sh={[{ d: capsule([156, 184], 4, [168, 160], 4), f: '#f2c230' }, { d: 'M162 164L178 154L182 162L170 170Z', f: '#f2c230' }]} />
        {/* katlanmış battaniye */}
        <OG sh={[{ d: rrect(184, 160, 56, 26, 4), f: '#c6574e' }, { d: 'M184 170H240M184 178H240M198 160V186M222 160V186', st: '#e9d8c6', sw: 2 }]} />
        {/* bere */}
        <OG sh={[{ d: 'M244 186Q244 160 258 160Q272 160 272 186Z', f: '#3d7ad6' }, { d: rrect(242, 178, 32, 8, 3), f: '#2f6fb0' }, { d: circ([258, 158], 5), f: '#fbfaf7' }]} />
        {/* eldiven */}
        <OG sh={[{ d: 'M192 158Q186 140 196 136Q204 134 206 146L210 140Q214 138 214 144L210 158Z', f: '#8f6fc2' }, { d: 'M212 158Q206 142 214 138Q222 136 224 148L228 142Q232 140 232 146L228 158Z', f: '#8f6fc2' }]} />
      </CarRear>
    </Scene2>
  ),

  'hazirlik-arac-aku-kablo': () => (
    <Scene2 bg="closeup">
      <rect width={320} height={240} fill="#4a4c55" />
      <g stroke="#555862" stroke-width={1}>{Array.from({ length: 24 }, (_, i) => <line key={i} x1={0} y1={i * 10} x2={320} y2={i * 10 + 4} />)}</g>
      {/* çanta */}
      <OG sh={[{ d: rrect(18, 26, 196, 190, 14), f: '#5b7fb6' }, { d: rrect(30, 40, 172, 164, 10), f: '#a9bfdc' }, { d: 'M30 40H202', st: '#c9ced6', sw: 3 }]} />
      {/* sarılı kablolar */}
      <ellipse cx={116} cy={124} rx={66} ry={56} fill="none" stroke={K.out} stroke-width={11} />
      <ellipse cx={116} cy={124} rx={66} ry={56} fill="none" stroke="#2b2b30" stroke-width={7} />
      <ellipse cx={116} cy={124} rx={52} ry={44} fill="none" stroke={K.out} stroke-width={11} />
      <ellipse cx={116} cy={124} rx={52} ry={44} fill="none" stroke="#d6453b" stroke-width={7} />
      <ellipse cx={116} cy={124} rx={40} ry={33} fill="none" stroke={K.out} stroke-width={11} />
      <ellipse cx={116} cy={124} rx={40} ry={33} fill="none" stroke="#2b2b30" stroke-width={7} />
      <ellipse cx={116} cy={124} rx={28} ry={22} fill="none" stroke={K.out} stroke-width={11} />
      <ellipse cx={116} cy={124} rx={28} ry={22} fill="none" stroke="#d6453b" stroke-width={7} />
      {/* maşalar */}
      {([[60, 196, -20, '#d6453b'], [168, 196, 20, '#2b2b30']] as [number, number, number, string][]).map(([xx, yy, an, c], i) => (
        <G key={i} x={xx} y={yy} a={an}>
          <OG sh={[{ d: 'M-26 -4L18 -14L24 -8L-22 4Z', f: c }, { d: 'M-26 4L18 14L24 8L-22 -4Z', f: shade(c, 0.15) }, { d: rrect(-36, -6, 14, 12, 3), f: '#c9a24a' }, { d: circ([-2, 0], 3), f: K.metal }]} />
        </G>
      ))}
      {/* powerbank */}
      <OG sh={[{ d: rrect(230, 40, 64, 96, 10), f: '#e6e8eb' }, { d: rrect(250, 54, 24, 8, 2), f: '#3b3f4b' }]} />
      <g fill={K.safe}>{[0, 1, 2, 3].map((i) => <circle key={i} cx={248 + i * 9} cy={120} r={2.6} />)}</g>
      {/* araç şarj kablosu */}
      <OG sh={[{ d: 'M262 160L262 172', st: K.out, sw: 3 }, { d: rrect(254, 170, 16, 30, 4), f: '#3b3f4b' }, { d: rrect(256, 196, 12, 14, 2), f: K.metal }]} />
      <path d="M262 160C240 150 300 140 280 160C260 176 300 186 290 200" fill="none" stroke={K.out} stroke-width={5} />
      <path d="M262 160C240 150 300 140 280 160C260 176 300 186 290 200" fill="none" stroke="#fbfaf7" stroke-width={2.6} />
    </Scene2>
  ),

  'hazirlik-arac-sondurucu-kontrol': () => {
    const cx = 104;
    const h0: HandProps = { x: 0, y: 0, a: -8, s: 1.15, pose: 'hold', side: 'R', view: 'back', grip: 26, arm: 160, ...ARAC };
    const g0 = handPoint(h0, 'grip');
    const h: HandProps = { ...h0, x: cx - g0[0], y: 104 - g0[1] };
    return (
      <Scene2 bg="closeup">
        {/* gövde */}
        <OG sh={[{ d: `M${cx - 56} 252V150Q${cx - 56} 118 ${cx} 116Q${cx + 56} 118 ${cx + 56} 150V252Z`, f: K.red }, { d: `M${cx + 24} 120Q${cx + 56} 126 ${cx + 56} 150V252H${cx + 24}Z`, f: shade(K.red, 0.18), no: true }, { d: `M${cx - 40} 146Q${cx - 40} 130 ${cx - 26} 126`, st: tint(K.red, 0.5), sw: 4 }]} />
        {/* valf, kol, hortum */}
        <OG sh={[
          { d: rrect(cx - 12, 84, 24, 36, 3), f: '#3b3f4b' },
          { d: rrect(cx - 24, 70, 48, 20, 4), f: '#2f3542' },
          { d: `M${cx - 18} 72L${cx - 70} 44L${cx - 64} 34L${cx + 4} 68Z`, f: '#2f3542' },
          { d: `M${cx - 22} 66L${cx - 74} 56L${cx - 72} 48L${cx - 20} 60Z`, f: '#4b5260' },
          { d: `M${cx + 24} 80H${cx + 60}`, st: K.out, sw: 8 },
          { d: `M${cx + 24} 80H${cx + 60}`, st: '#8e99a6', sw: 5 },
        ]} />
        <Gauge x={cx + 112} y={84} r={58} v={0.5} />
        <Hand {...h} />
        <Ok x={286} y={186} r={18} />
      </Scene2>
    );
  },

  /* ─────────── ilk yardım çantası ─────────── */
  'hazirlik-ilkyardim-kutu-yer': () => {
    const kit: P = [222, 84];
    const mom: PersonProps = { x: 150, y: 230, s: 1.15, ...ILKY, pose: { ...POSE.stand, head: -84, armF: { to: [kit[0] - 18, kit[1] - 18] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e3e7d9">
        {/* raf */}
        <OG sh={[{ d: rrect(176, 84, 110, 8, 2), f: K.wood }, { d: 'M190 92L190 108L204 92Z', f: shade(K.wood, 0.2) }, { d: 'M272 92L272 108L258 92Z', f: shade(K.wood, 0.2) }]} />
        <CrescentKit x={kit[0]} y={kit[1]} s={1} />
        <OG sh={[{ d: rrect(250, 58, 26, 26, 2), f: '#cfa36b' }]} />
        <Person {...mom} />
        {/* yerde oynayan çocuk */}
        <Person x={58} y={226} s={0.92} who="boy" role="bystander2" pose={{ ...POSE.sitFloor, armF: { to: [92, 214] }, armB: { floor: -14 }, face: 'calm' }} />
        <OG sh={[{ d: rrect(92, 204, 14, 14, 2), f: '#3d7ad6' }, { d: rrect(108, 210, 12, 12, 2), f: '#f2c230' }, { d: rrect(98, 192, 12, 12, 2), f: K.red }]} />
        <Arrow from={[258, 26]} to={[236, 42]} w={5} />
      </Scene2>
    );
  },

  'hazirlik-ilkyardim-eldiven': () => {
    const gl: HandProps = { x: 150, y: 168, a: -12, s: 1.3, pose: 'open', side: 'R', view: 'back', skin: 0, arm: 90 };
    const cuff: P = [gl.x - 22, gl.y + 4];
    const b0: HandProps = { x: 0, y: 0, a: 64, s: 1.15, pose: 'pinch', side: 'L', view: 'back', arm: 100, ...HAND_HS };
    const p0 = handPoint(b0, 'pinch');
    const bare: HandProps = { ...b0, x: b0.x + cuff[0] - p0[0], y: b0.y + cuff[1] - p0[1] };
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        {/* eldiven kutusu */}
        <OG sh={[{ d: rrect(216, 140, 94, 84, 6), f: '#3d7ad6' }, { d: ell([263, 158], 30, 9), f: '#1f3b66' }, { d: rrect(226, 190, 74, 22, 3), f: '#fbfaf7', ln: true }]} />
        <OG sh={[{ d: 'M248 158Q244 132 256 124Q262 120 264 132L268 122Q274 118 276 128L272 158Z', f: GLOVEB }, { d: 'M262 158Q262 138 270 134Q278 132 280 144L276 158Z', f: shade(GLOVEB, 0.15) }]} />
        <path d="M236 201h54" stroke={GLOVEB} stroke-width={5} stroke-linecap="round" />
        {/* cep tipi suni solunum maskesi (önden): şeffaf armut biçimli kubbe + yumuşak kenar + tek yönlü valfli ağızlık */}
        <G x={262} y={74}>
          <path d="M0 -44C16 -44 24 -22 30 0C36 22 32 40 0 42C-32 40 -36 22 -30 0C-24 -22 -16 -44 0 -44Z" fill="#e3f3fb" opacity={0.85} stroke={K.out} stroke-width={1.6} />
          <path d="M0 -36C12 -36 19 -18 24 0C29 18 26 32 0 34C-26 32 -29 18 -24 0C-19 -18 -12 -36 0 -36Z" fill="none" stroke="#9fd0ea" stroke-width={4} />
          <path d="M-14 -24Q-20 -6 -20 12" stroke="#fff" stroke-width={3.5} fill="none" stroke-linecap="round" />
          <OG sh={[{ d: circ([0, 4], 14), f: '#fbfaf7' }, { d: circ([0, 4], 8.5), f: '#3d7ad6' }, { d: circ([0, 4], 3.5), f: '#fbfaf7' }]} />
        </G>
        {/* küçük sert taşıma kutusu */}
        <OG sh={[
          { d: rrect(196, 18, 40, 30, 8), f: '#f2c230' },
          { d: `M196 30H236`, st: shade('#f2c230', 0.3), sw: 1.6 },
          { d: 'M216 34V44M211 39H221', st: K.danger, sw: 3.4 },
        ]} />
        {/* eldivenli sağ el */}
        <g filter="url(#hz-glove)">
          <Hand {...gl} />
        </g>
        <G x={gl.x} y={gl.y} a={gl.a}>
          <OG sh={[{ d: 'M-17 18Q0 12 17 18L18 30Q0 24 -18 30Z', f: tint(GLOVEB, 0.2) }]} />
        </G>
        {/* çıplak sol el manşeti çekiyor */}
        <Hand {...bare} />
        <Arrow from={[70, 150]} to={[70, 84]} w={6} />
      </Scene2>
    );
  },

  'hazirlik-ilkyardim-aletler': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M24 34Q90 26 160 32T298 30L300 210Q230 216 160 210T22 214Z', f: '#fbfaf7' }]} />
      <path d="M24 122Q160 116 300 122M160 32V210" stroke="#e3dfd5" stroke-width={2} fill="none" />
      {/* makas (sargı makası) */}
      <G x={92} y={82} a={-12}>
        <OG sh={[{ d: ell([-38, -10], 13, 9), f: 'none', st: K.out, sw: 9 }, { d: ell([-38, 12], 13, 9), f: 'none', st: K.out, sw: 9 }]} />
        <g fill="none" stroke="#3d7ad6" stroke-width={5.4}><ellipse cx={-38} cy={-10} rx={13} ry={9} /><ellipse cx={-38} cy={12} rx={13} ry={9} /></g>
        <OG sh={[{ d: 'M-26 -6L40 6L42 10L-26 4Z', f: K.metal }, { d: 'M-26 6L38 -2Q46 -2 44 4L-26 -4Z', f: tint(K.metal, 0.25) }, { d: circ([-14, 0], 3), f: '#5b6575' }]} />
      </G>
      {/* cımbız */}
      <G x={214} y={78} a={8}>
        <OG sh={[{ d: 'M-48 -2L40 -8L42 -5L-48 2Z', f: K.metal }, { d: 'M-48 2L40 8L42 5L-48 -2Z', f: tint(K.metal, 0.25) }, { d: rrect(-52, -4, 10, 8, 2), f: shade(K.metal, 0.2) }]} />
      </G>
      {/* çengelli iğneler */}
      {[0, 1, 2].map((i) => (
        <G key={i} x={60 + i * 34} y={168 + (i % 2) * 8} a={-20 + i * 14}>
          <OG sh={[{ d: 'M-14 -4H12Q18 -4 18 0Q18 4 12 4H-14', f: 'none', st: K.out, sw: 4.4 }, { d: rrect(-20, -6, 10, 12, 2), f: '#c9a24a' }]} />
          <path d="M-14 -4H12Q18 -4 18 0Q18 4 12 4H-14" fill="none" stroke="#c9ced6" stroke-width={2.2} />
          <circle cx={18} cy={0} r={3} fill="none" stroke="#c9ced6" stroke-width={1.6} />
        </G>
      ))}
      {/* dijital termometre */}
      <G x={232} y={166} a={-24}>
        <OG sh={[{ d: 'M-50 -9H30Q44 -9 50 -2V2Q44 9 30 9H-50Q-56 9 -56 0Q-56 -9 -50 -9Z', f: '#fbfaf7' }, { d: capsule([48, 0], 3, [62, 0], 2.4), f: K.metal }, { d: rrect(-40, -6, 32, 12, 2), f: '#cfe6c8', ln: true }, { d: circ([4, 0], 4.4), f: '#3d7ad6' }]} />
        <T x={-24} y={4} text="36.6" size={9} />
      </G>
    </Scene2>
  ),

  /* ─────────── iş yeri ve okul ─────────── */
  'hazirlik-is-cikis-yolu': () => {
    const p: PersonProps = { x: 96, y: 228, s: 1.15, ...IS, pose: { ...POSE.standSide, head: -104, armF: { to: [180, 62] }, handF: 'flat', face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e4e8ec">
        {/* kapı + merdiven simgesi */}
        <OG sh={[{ d: rrect(204, 84, 76, 120, 2), f: '#9aa6b2' }, { d: rrect(210, 90, 64, 114, 1), f: '#b9c2cc' }, { d: rrect(222, 100, 40, 30, 2), f: '#bfe3f5', ln: true }, { d: rrect(214, 146, 10, 6, 2), f: '#5b6575' }]} />
        <path d="M228 194h8v-8h8v-8h8v-8h8" stroke="#5b6575" stroke-width={3} fill="none" />
        {/* acil çıkış levhası */}
        <OG sh={[{ d: rrect(186, 24, 112, 44, 5), f: K.safe }]} />
        <g fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
          <circle cx={216} cy={33} r={4} stroke="none" />
          <path d="M213 40L208 52L214 58M208 52L201 48M213 40L222 46M213 40L218 50L226 54M218 50L214 62" fill="none" stroke-width={3.4} />
          <rect x={232} y={30} width={18} height={32} rx={1} fill="none" stroke-width={2.6} />
          <path d="M256 46H288M278 37L289 46L278 55" fill="none" stroke-width={4.4} />
        </g>
        <Person {...p} />
        <Arrow from={[150, 172]} to={[200, 172]} />
      </Scene2>
    );
  },

  'hazirlik-is-masa-cantasi': () => (
    <Scene2 bg="indoor" wall="#e4e8ec" gy={196}>
      {/* masa gövdesi */}
      <OG sh={[{ d: rrect(10, 20, 240, 14, 2), f: '#cfb08a' }, { d: rrect(18, 34, 20, 170, 1), f: '#b9966e' }, { d: rrect(222, 34, 20, 170, 1), f: '#b9966e' }]} />
      {/* açık çekmece */}
      <OG sh={[{ d: 'M44 44H216L232 168H28Z', f: '#e2c9a6' }, { d: 'M50 52H210L222 160H38Z', f: '#cfb08a' }, { d: rrect(24, 166, 212, 28, 3), f: '#b9966e' }, { d: rrect(110, 174, 40, 8, 4), f: '#5b6575' }]} />
      {/* küçük çanta */}
      <OG sh={[{ d: 'M58 62H202L210 152H50Z', f: '#c6574e' }, { d: 'M64 70H196L202 144H58Z', f: '#7f2f2a' }, { d: 'M58 62H202', st: '#c9ced6', sw: 3 }]} />
      <Bottle x={86} y={140} s={1.2} fill={0.8} />
      <OG sh={[{ d: rrect(106, 104, 30, 14, 3), f: '#e6b84a' }, { d: 'M112 111H130', st: shade('#e6b84a', 0.3), sw: 1.4 }]} />
      <Flashlight x={106} y={132} s={0.8} a={0} beam={false} />
      <Whistle x={170} y={88} s={0.7} />
      <OG sh={[{ d: 'M146 80Q160 72 176 80L174 96Q160 104 148 96Z', f: '#f4f1ea' }]} />
      <OG sh={[{ d: rrect(160, 112, 32, 22, 3), f: '#fbfaf7' }, { d: 'M171 123h10M176 118v10', st: K.red, sw: 3 }]} />
      {/* spor ayakkabı */}
      <G x={286} y={226}>
        <OG sh={[{ d: 'M-34 0V-10Q-34 -20 -22 -22L-6 -30Q2 -34 6 -26L14 -14Q30 -12 32 -4V0Z', f: '#fbfaf7' }, { d: rrect(-35, -6, 68, 7, 3), f: '#3d7ad6' }, { d: 'M-8 -26L0 -18M-2 -28L6 -20', st: K.out, sw: 1.4 }]} />
      </G>
      <G x={250} y={232}>
        <OG sh={[{ d: 'M-34 0V-10Q-34 -20 -22 -22L-6 -30Q2 -34 6 -26L14 -14Q30 -12 32 -4V0Z', f: '#fbfaf7' }, { d: rrect(-35, -6, 68, 7, 3), f: '#3d7ad6' }, { d: 'M-8 -26L0 -18M-2 -28L6 -20', st: K.out, sw: 1.4 }]} />
      </G>
    </Scene2>
  ),

  'hazirlik-is-cok-kapan': () => {
    const leg: P = [295, 170];
    const p: PersonProps = { x: 176, y: 226, s: 1.32, ...IS, pose: { ...POSE.dropCover, armB: { to: leg }, handB: 'fist', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor" wall="#e4e8ec">
        {/* pencere solda, uzakta */}
        <Window x={14} y={40} w={52} h={58} />
        <Table x={78} y={226} w={234} h={112} color="#b9966e" />
        <OG sh={[{ d: rrect(166, 86, 12, 30, 2), f: '#3b3f4b' }, { d: rrect(144, 110, 56, 6, 2), f: '#3b3f4b' }, { d: rrect(130, 40, 84, 50, 4), f: '#2b2f3a' }, { d: rrect(135, 45, 74, 40, 2), f: '#5b7fb6' }]} />
        <OG sh={[{ d: rrect(232, 104, 40, 10, 2), f: '#e6e8eb' }]} />
        <Person {...p} />
        <circle cx={r.handB[0] + 1} cy={r.handB[1]} r={17} fill="none" stroke="#fff" stroke-width={6} opacity={0.7} />
        <circle cx={r.handB[0] + 1} cy={r.handB[1]} r={17} fill="none" stroke={K.action} stroke-width={3} />
        <Ok x={294} y={26} r={15} />
      </Scene2>
    );
  },

  'hazirlik-okul-teslim': () => {
    const list: P = [108, 124];
    const card: P = [198, 106];
    const teacher: PersonProps = { x: 82, y: 226, s: 1.12, who: 'woman', role: 'helper', hair: 'scarf', hairC: '#3d7ad6', top: '#f2c230', pose: { ...POSE.standSide, head: -70, armF: { to: list }, armB: { to: [list[0] - 6, list[1] + 4] }, face: 'neutral' } };
    const parent: PersonProps = { x: 252, y: 226, s: 1.1, flip: true, ...IS, pose: { ...POSE.standSide, armF: { to: card }, face: 'neutral' } };
    const child: PersonProps = { x: 168, y: 226, s: 1, who: 'girl', role: 'bystander3', pose: { ...POSE.walk, armF: { to: [214, 150] }, face: 'calm' } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        {/* okul binası */}
        <OG sh={[{ d: rrect(120, 70, 200, 130, 2), f: '#e8c9a0' }, { d: rrect(196, 130, 46, 70, 2), f: '#8a5a3a' }]} />
        <g>{[140, 164, 260, 284].map((xx) => <OG key={xx} sh={[{ d: rrect(xx, 92, 18, 20, 1), f: '#bfe3f5' }]} />)}</g>
        <path d="M300 70V30" stroke={K.out} stroke-width={2.4} />
        <OG sh={[{ d: 'M300 30H326V46H300Z', f: K.red }]} />
        <Tree x={30} y={202} s={0.9} />
        <Person {...teacher} mid={(r) => (
          <g>
            <path d={`M${r.chest[0] - 10} ${r.neck[1] + 20}L${r.hip[0] - 4} ${r.hip[1] - 6}`} stroke="#d9dde2" stroke-width={4} />
          </g>
        )} />
        {/* pano + liste */}
        <G x={list[0] + 4} y={list[1] - 2} a={-14}>
          <OG sh={[{ d: rrect(-14, -20, 28, 38, 2), f: '#a8724a' }, { d: rrect(-11, -15, 22, 30, 1), f: PAPER }, { d: rrect(-5, -22, 10, 5, 1), f: '#5b6575' }]} />
          <Lines x={-7} y={-9} w={14} n={4} gap={6} sw={1.8} />
        </G>
        <Person {...child} />
        <Person {...parent} />
        <IdCard x={card[0] - 16} y={card[1] - 18} w={30} h={20} />
        <Arrow from={[156, 64]} to={[124, 104]} w={5} bend={0.2} />
      </Scene2>
    );
  },

  /* ─────────── evcil hayvan ─────────── */
  'hazirlik-evcil-canta': () => (
    <Scene2 bg="floor">
      <OpenPack x={62} y={112} s={1.1} c="#4f7fb0" />
      <Pack x={118} y={40} w={52} h={66} kind="food" c="#6c9c5a" />
      <Bottle x={190} y={90} a={70} s={1.1} fill={0.85} />
      {/* katlanır su kabı */}
      <OG sh={[{ d: circ([158, 170], 34), f: '#13a394' }, { d: circ([158, 170], 26), f: tint('#13a394', 0.25), ln: true }, { d: circ([158, 170], 18), f: tint('#13a394', 0.45), ln: true }]} />
      {/* konserve mama */}
      <CanTop x={212} y={150} r={18} c="#c6574e" />
      <path d="M200 182q6 -4 12 0q-6 4 -12 0zM212 182l5 -3v6z" fill={K.ink} />
      <Cat x={272} y={222} s={1.15} />
    </Scene2>
  ),

  'hazirlik-evcil-kafes': () => {
    const p: PersonProps = { x: 116, y: 226, s: 1.12, ...EVCIL, pose: { ...POSE.walk, armF: [98, 40], armB: [-10, 10], face: 'neutral' } };
    const r = rig(p);
    const hf = r.handF, hb = r.handB;
    const collar: P = [256, 168];
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={194} s={0.8} kind="pine" />
        <path d={`M${hb[0]} ${hb[1]}Q${(hb[0] + collar[0]) / 2} ${Math.max(hb[1], collar[1]) + 14} ${collar[0]} ${collar[1]}`} stroke="#c6574e" stroke-width={2.6} fill="none" />
        <Dog x={226} y={222} s={1} collar="#c6574e" />
        <Person {...p} />
        {/* taşıma kafesi (önde) */}
        <G x={hf[0]} y={hf[1] + 3} s={0.86}>
          <OG sh={[{ d: 'M-12 0Q-12 -8 0 -8Q12 -8 12 0', st: K.out, sw: 4 }, { d: rrect(-40, 0, 80, 52, 10), f: '#7aa6d6' }, { d: rrect(-40, 26, 80, 26, 8), f: shade('#7aa6d6', 0.15), no: true }, { d: rrect(4, 8, 30, 36, 4), f: '#3a3530' }]} />
          <g transform="translate(20 46) scale(0.48)"><Cat x={0} y={0} s={1} /></g>
          <g stroke="#e6e8eb" stroke-width={2.2}>{[9, 15, 21, 27].map((xx) => <line key={xx} x1={xx} y1={8} x2={xx} y2={44} />)}</g>
          <rect x={4} y={8} width={30} height={36} rx={4} fill="none" stroke={K.out} stroke-width={1.6} />
          <OG sh={[{ d: rrect(34, 20, 5, 10, 1.5), f: '#f2c230' }]} />
          <g fill="#5b6575">{[-30, -22, -14, -30, -22, -14].map((xx, i) => <circle key={i} cx={xx} cy={i < 3 ? 14 : 22} r={2.2} />)}</g>
        </G>
        <Person {...p} only={['armF']} />
      </Scene2>
    );
  },

  'hazirlik-evcil-kunye': () => {
    const tag: P = [146, 176];
    const h0: HandProps = { x: 270, y: 250, a: -60, s: 1.15, pose: 'pinch', side: 'R', view: 'back', skin: EVCIL.skin, arm: 90, sleeve: K.role.bystander };
    const p0 = handPoint(h0, 'pinch');
    const want: P = [tag[0] + 14, tag[1] + 8];
    const h: HandProps = { ...h0, x: h0.x + want[0] - p0[0], y: h0.y + want[1] - p0[1] };
    return (
      <Scene2 bg="closeup">
        <Dog x={-6} y={300} s={3.4} color="#c99a5b" collar="#c6574e" />
        {/* halka + künye */}
        <circle cx={tag[0]} cy={tag[1] - 30} r={5} fill="none" stroke={K.out} stroke-width={4.4} />
        <circle cx={tag[0]} cy={tag[1] - 30} r={5} fill="none" stroke="#c9ced6" stroke-width={2.2} />
        <OG sh={[{ d: circ(tag, 26), f: '#c9ced6' }, { d: circ(tag, 21), f: 'none', st: shade('#c9ced6', 0.2), sw: 1.4 }]} />
        <path transform={`translate(${tag[0] - 15} ${tag[1] - 11}) scale(0.6)`} d="M2 2c1-1 2.5-.8 3 .3l1.2 2.4c.3.8 0 1.6-.6 2.1l-.7.5c.7 1.8 2.2 3.3 4 4l.5-.7c.5-.6 1.4-.9 2.1-.6l2.4 1.2c1.1.5 1.3 2 .3 3-1.6 1.6-3.8 1.9-5.6.9-2.8-1.6-5.2-4-6.8-6.8-1-1.8-.7-4 .9-5.6z" fill={K.ink} />
        <Lines x={tag[0] - 4} y={tag[1] - 6} w={18} n={2} gap={6} c="#6d7480" sw={2.4} />
        <Lines x={tag[0] - 14} y={tag[1] + 8} w={28} n={1} c="#6d7480" sw={2.4} />
        <Hand {...h} />
        <Arrow from={[60, 228]} to={[112, 194]} bend={-0.15} />
      </Scene2>
    );
  },

  'hazirlik-evcil-foto': () => {
    const h: HandProps = { x: 110, y: 256, a: 6, s: 2.1, pose: 'hold', side: 'R', grip: 38, skin: EVCIL.skin, arm: 40, sleeve: K.role.bystander };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <ZipBag x={190} y={60} w={110} h={130} drops={false}>
          <G x={245} y={132} a={6}>
            <OG sh={[{ d: rrect(-34, -46, 68, 92, 4), f: '#f2c230' }, { d: rrect(-34, -46, 10, 92, 3), f: shade('#f2c230', 0.18) }]} />
            <g fill={K.ink}>
              <ellipse cx={4} cy={-6} rx={9} ry={8} />
              <circle cx={-8} cy={-20} r={4} />
              <circle cx={1} cy={-26} r={4} />
              <circle cx={11} cy={-26} r={4} />
              <circle cx={19} cy={-18} r={4} />
            </g>
            <Lines x={-18} y={20} w={42} n={2} gap={8} c="#8a7a3a" />
          </G>
        </ZipBag>
        <Hand {...h}>
          <PhoneBody x={g[0]} y={g[1]} s={2.1} a={6} screen="#cfe6f5">
            <rect x={-16} y={8} width={32} height={19} fill="#a8d08f" />
            {/* sahip */}
            <path d="M-15 27V12Q-15 2 -5 2Q5 2 5 12V27Z" fill={K.role.bystander} stroke={K.out} stroke-width={0.6} />
            <circle cx={-5} cy={-6} r={6.5} fill={K.skin[1]} stroke={K.out} stroke-width={0.6} />
            <path d="M-11.5 -7Q-11 -14 -5 -14Q1 -14 1.5 -7Q-2 -11 -5 -10Q-9 -11 -11.5 -7Z" fill={K.hair.dark} />
            <circle cx={-7} cy={-6} r={0.8} fill={K.ink} />
            <circle cx={-3} cy={-6} r={0.8} fill={K.ink} />
            <path d="M-7 -3Q-5 -1.6 -3 -3" stroke={K.ink} stroke-width={0.6} fill="none" />
            {/* kucaktaki kedi */}
            <g transform="translate(4 16) scale(0.28)"><Cat x={0} y={0} s={1} /></g>
          </PhoneBody>
        </Hand>
      </Scene2>
    );
  },
};
