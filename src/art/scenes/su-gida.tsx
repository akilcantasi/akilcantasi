// Su ve gıda — sahneler: su arıtma, gıda güvenliği, su depolama, evdeki gizli su,
// pişirmeden beslenme, sıcakta gıda, toplu mutfak.
import type { ComponentChildren, JSX } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Bottle, Chair, Cloth, Drop, Flame, Hand, K, Label, No, OG, Ok, Person, POSE, Pot, Scene2, Stove, Table, Tent, Tree, Waves, Window,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { P, PersonProps, Rig, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)})${a ? ` rotate(${f1(a)})` : ''}${s !== 1 ? ` scale(${s})` : ''}`}>{children}</g>
);
const T = ({ x, y, text, size = 12, c = K.ink, w = 700, anchor = 'middle' }: { x: number; y: number; text: string; size?: number; c?: string; w?: number; anchor?: 'start' | 'middle' | 'end' }) => (
  <text x={x} y={y} font-size={size} font-weight={w} fill={c} text-anchor={anchor} font-family="'IBM Plex Sans', system-ui, sans-serif">{text}</text>
);

const GLASS = '#dcedf5';
const MURKY = '#a68a5a';
const JUG = '#4f9fe0';
const STEEL = '#b9c2cc';
const GLOVE = '#4fb3c8';
const APRON = '#f6f4ee';

/** Güneş (ışınlı) */
function Sun({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f6b81f" stroke-width={3} stroke-linecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const p1 = pol([x, y], i * 36, r + 5), p2 = pol([x, y], i * 36, r + 12);
          return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff3a8" />
    </g>
  );
}

/** Duvar saati; turuncu dilim saat 12'den başlayıp `sweep` derece (60° = 10 dk ya da 2 sa). */
function Clock({ x, y, r = 34, sweep = 180, hands = true }: { x: number; y: number; r?: number; sweep?: number; hands?: boolean }) {
  const ri = r * 0.84;
  const a0 = -90, a1 = -90 + sweep;
  const p0 = pol([x, y], a0, ri), p1 = pol([x, y], a1, ri);
  const sector = `M${x} ${y}L${f1(p0[0])} ${f1(p0[1])}A${f1(ri)} ${f1(ri)} 0 ${sweep > 180 ? 1 : 0} 1 ${f1(p1[0])} ${f1(p1[1])}Z`;
  const hEnd = pol([x, y], a1, ri * 0.82);
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#5b6575' }, { d: circ([x, y], ri), f: '#fbfaf5', ln: true }]} />
      <path d={sector} fill={K.action} opacity={0.9} />
      {Array.from({ length: 12 }, (_, i) => {
        const q1 = pol([x, y], i * 30, ri * 0.8), q2 = pol([x, y], i * 30, ri * 0.95);
        return <line key={i} x1={q1[0]} y1={q1[1]} x2={q2[0]} y2={q2[1]} stroke={K.ink} stroke-width={i % 3 ? 1.4 : 2.6} stroke-linecap="round" />;
      })}
      {hands && (
        <g stroke={K.ink} stroke-linecap="round">
          <line x1={x} y1={y} x2={x} y2={y - ri * 0.82} stroke-width={3} />
          <line x1={x} y1={y} x2={hEnd[0]} y2={hEnd[1]} stroke-width={3} />
          <circle cx={x} cy={y} r={3} fill={K.ink} />
        </g>
      )}
    </g>
  );
}

/** Takvim yaprağı (SOL ÜST x,y). mark: kırmızı halka; text: büyük rakam */
function Calendar({ x, y, w = 40, h = 44, text = '1', mark }: { x: number; y: number; w?: number; h?: number; text?: string; mark?: boolean }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 4), f: '#fbfaf5' }, { d: rrect(x, y, w, h * 0.28, 4), f: K.red }, { d: rrect(x, y + h * 0.2, w, h * 0.08, 0), f: K.red, no: true }]} />
      <circle cx={x + w * 0.3} cy={y + 2} r={2.4} fill={K.ink} />
      <circle cx={x + w * 0.7} cy={y + 2} r={2.4} fill={K.ink} />
      <T x={x + w / 2} y={y + h * 0.84} text={text} size={h * 0.46} />
      {mark && <circle cx={x + w / 2} cy={y + h * 0.66} r={h * 0.3} fill="none" stroke={K.safe} stroke-width={3} />}
    </g>
  );
}

/** Termometre (dikey; x,y = hazne merkezi). level 0..1 */
function Thermo({ x, y, h = 70, level = 0.8, c = K.danger }: { x: number; y: number; h?: number; level?: number; c?: string }) {
  const top = y - h;
  return (
    <g>
      <OG sh={[{ d: capsule([x, top], 7, [x, y - 6], 7), f: '#fbfaf5' }, { d: circ([x, y], 11), f: c }]} />
      <path d={capsule([x, y - 6 - (h - 6) * level], 3.2, [x, y - 4], 3.2)} fill={c} />
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <line key={t} x1={x + 3} y1={y - 6 - (h - 6) * t} x2={x + 7} y2={y - 6 - (h - 6) * t} stroke={K.ink} stroke-width={1.3} />
      ))}
      <circle cx={x - 3} cy={y - 3} r={3} fill="#fff" opacity={0.5} />
    </g>
  );
}

/** Konserve kutusu (yandan). x,y = taban ortası. kind: ok | swollen | dent | rust | open */
function Can({ x, y, s = 1, kind = 'ok', label = '#d0473d', fill }: { x: number; y: number; s?: number; kind?: 'ok' | 'swollen' | 'dent' | 'rust' | 'open'; label?: string; fill?: string }) {
  const w = 22, h = 52;
  const sh: Sh[] = [];
  const body = kind === 'dent'
    ? `M${-w} -6V${-h + 6}H${w}V-34Q${w - 10} -28 ${w - 2} -18V-6Z`
    : `M${-w} -6V${-h + 6}H${w}V-6Z`;
  sh.push({ d: ell([0, -6], w, 6), f: shade(STEEL, 0.1) });
  sh.push({ d: body, f: STEEL });
  sh.push({ d: kind === 'dent' ? `M${-w} -14V${-h + 14}H${w}V-34Q${w - 10} -28 ${w - 2} -18L${w - 1} -14Z` : `M${-w} -14V${-h + 14}H${w}V-14Z`, f: label, no: true });
  sh.push({ d: `M${w - 8} -8V${-h + 8}H${w}V-8Z`, f: '#000', op: 0.12, no: true });
  if (kind === 'swollen') sh.push({ d: `M${-w} ${-h + 6}Q0 ${-h - 16} ${w} ${-h + 6}Q0 ${-h + 12} ${-w} ${-h + 6}Z`, f: tint(STEEL, 0.2) });
  else if (kind === 'open') {
    sh.push({ d: ell([0, -h + 6], w, 6), f: shade(STEEL, 0.25) });
    sh.push({ d: ell([0, -h + 7], w - 3, 4.4), f: fill ?? '#c9a26a', no: true });
  } else sh.push({ d: ell([0, -h + 6], w, 6), f: tint(STEEL, 0.2) });
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={sh} />
      {kind !== 'open' && kind !== 'swollen' && <ellipse cx={0} cy={-h + 6} rx={w - 5} ry={3.4} fill="none" stroke={shade(STEEL, 0.3)} stroke-width={1} />}
      {kind === 'dent' && <path d={`M${w - 9} -32Q${w - 14} -26 ${w - 6} -19`} fill="none" stroke={K.out} stroke-width={1.4} />}
      {kind === 'rust' && (
        <g fill="#9c5a2c">
          <ellipse cx={-10} cy={-44} rx={6} ry={3.5} />
          <ellipse cx={8} cy={-10} rx={8} ry={3} />
          <ellipse cx={-14} cy={-12} rx={4} ry={2.6} />
          <circle cx={12} cy={-42} r={2.4} />
          <ellipse cx={2} cy={-28} rx={5} ry={3} opacity={0.85} />
        </g>
      )}
      {kind === 'swollen' && <path d="M-9 -60l-4 -5M9 -60l4 -5M0 -63v-6" stroke={K.ink} stroke-width={1.6} stroke-linecap="round" />}
    </G>
  );
}

/** Musluklu su bidonu (önden). x,y = taban ortası */
function TapJug({ x, y, s = 1, c = JUG }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-30 -4V-62Q-30 -72 -20 -76H20Q30 -72 30 -62V-4Q30 0 26 0H-26Q-30 0 -30 -4Z', f: c },
          { d: 'M14 -76H20Q30 -72 30 -62V-4Q30 0 26 0H16Z', f: shade(c, 0.14), no: true },
          { d: rrect(-16, -92, 32, 8, 3), f: shade(c, 0.25) },
          { d: 'M-12 -84V-76H12V-84Z', f: c },
          { d: rrect(-9, -100, 18, 9, 2), f: '#2f6fb0' },
          { d: 'M-22 -54H22M-22 -36H22', st: tint(c, 0.35), sw: 2 },
          { d: rrect(-9, -22, 18, 9, 2), f: '#f2f2f2' },
          { d: rrect(-4, -14, 8, 9, 2), f: '#f2f2f2' },
        ]}
      />
      <path d="M-24 -66V-12" stroke="#fff" stroke-width={3} opacity={0.4} stroke-linecap="round" />
    </G>
  );
}

/** Kapaklı, saplı plastik bidon (yandan). x,y = taban ortası */
function Jerry({ x, y, s = 1, c = JUG, a = 0, cap = '#2f6fb0' }: { x: number; y: number; s?: number; c?: string; a?: number; cap?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-26 -4V-56Q-26 -64 -18 -66L8 -70Q14 -71 18 -66L26 -58V-4Q26 0 22 0H-22Q-26 0 -26 -4Z', f: c },
          { d: 'M12 -68L18 -66L26 -58V-4Q26 0 22 0H12Z', f: shade(c, 0.14), no: true },
          { d: 'M-22 -66Q-22 -84 -6 -84Q4 -84 4 -70', st: K.out, sw: 9 },
          { d: 'M-22 -66Q-22 -84 -6 -84Q4 -84 4 -70', st: shade(c, 0.1), sw: 5.6 },
          { d: rrect(10, -80, 13, 12, 2), f: cap },
        ]}
      />
      <path d="M-20 -54V-10" stroke="#fff" stroke-width={3} opacity={0.4} stroke-linecap="round" />
    </G>
  );
}

/** Damacana (19 L). x,y = taban ortası */
function Damacana({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-24 -4V-50Q-24 -60 -14 -66Q-8 -70 -8 -78H8Q8 -70 14 -66Q24 -60 24 -50V-4Q24 0 20 0H-20Q-24 0 -24 -4Z', f: '#bfe0f4' },
          { d: 'M-24 -46H24V-4Q24 0 20 0H-20Q-24 0 -24 -4Z', f: '#7fbde8', no: true },
          { d: 'M-24 -30H24M-24 -16H24', st: '#5fa4d8', sw: 1.6 },
          { d: rrect(-10, -86, 20, 9, 2), f: '#2f6fb0' },
        ]}
      />
      <path d="M-17 -54V-8" stroke="#fff" stroke-width={3} opacity={0.55} stroke-linecap="round" />
    </G>
  );
}

/** Streçli şişe su paketi (yandan 3 şişe görünür). x,y = taban ortası */
function Pack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      {[-20, 0, 20].map((dx) => (
        <Bottle key={dx} x={dx} y={0} s={1.05} fill={0.85} />
      ))}
      <path d="M-31 -6V-36Q-31 -40 -27 -40H27Q31 -40 31 -36V-6Q31 0 25 0H-25Q-31 0 -31 -6Z" fill="#ffffff" opacity={0.35} stroke={K.out} stroke-width={1.3} />
      <path d={rrect(-31, -28, 62, 12, 1)} fill="#3a9be0" opacity={0.85} stroke={K.out} stroke-width={1.2} />
    </G>
  );
}

/** Şeffaf 1 L şişe (açık ağız). x,y = taban ortası */
function LitreBottle({ x, y, s = 1, fill = 0.8, cap = true }: { x: number; y: number; s?: number; fill?: number; cap?: boolean }) {
  const H = 96;
  const wl = -6 - (H - 30) * fill;
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-18 -4V-62Q-18 -72 -8 -78V-90H8V-78Q18 -72 18 -62V-4Q18 0 14 0H-14Q-18 0 -18 -4Z', f: GLASS },
          { d: `M-18 ${wl}H18V-4Q18 0 14 0H-14Q-18 0 -18 -4Z`, f: K.waterLight, no: true },
          { d: `M-18 ${wl}H18`, st: K.water, sw: 1.6 },
          ...(cap ? [{ d: rrect(-10, -100, 20, 11, 2), f: K.water }] : [{ d: rrect(-10, -93, 20, 4, 1.5), f: tint(GLASS, 0.2) }]),
        ]}
      />
      <path d="M-12 -62V-10" stroke="#fff" stroke-width={3} opacity={0.7} stroke-linecap="round" />
    </G>
  );
}

/** Çamaşır suyu şişesi (saplı). x,y = taban ortası */
function BleachBottle({ x, y, s = 1, c = '#fbfaf7', cap = '#3a7bd5', children }: { x: number; y: number; s?: number; c?: string; cap?: string; children?: ComponentChildren }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-24 -4V-70Q-24 -82 -12 -86L-8 -96H8L10 -86Q24 -80 24 -68V-4Q24 0 20 0H-20Q-24 0 -24 -4Z', f: c },
          { d: 'M12 -84Q24 -80 24 -68V-4Q24 0 20 0H12Z', f: shade(c, 0.08), no: true },
          { d: 'M10 -84Q30 -84 30 -66Q30 -54 24 -50', st: K.out, sw: 7 },
          { d: 'M10 -84Q30 -84 30 -66Q30 -54 24 -50', st: c, sw: 4 },
          { d: rrect(-10, -106, 20, 11, 2.5), f: cap },
        ]}
      />
      {children}
    </G>
  );
}

/** Kova (yandan). x,y = taban ortası; level 0..1 */
function Bucket({ x, y, s = 1, c = '#8aa0b2', level = 0.5 }: { x: number; y: number; s?: number; c?: string; level?: number }) {
  const wy = -38 * level;
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-22 -40Q0 -64 22 -40', st: K.out, sw: 2.4 },
          { d: 'M-23 -40L-18 -3Q-18 0 -15 0H15Q18 0 18 -3L23 -40Z', f: c },
          { d: ell([0, -40], 23, 5), f: shade(c, 0.3) },
          ...(level > 0 ? [{ d: ell([0, wy], 20 - 4 * (1 - level), 4), f: K.water, no: true }] : []),
          { d: 'M10 -40L23 -40L18 -3Q18 0 15 0H8Z', f: shade(c, 0.14), no: true },
        ]}
      />
    </G>
  );
}

/** Bardak (şeffaf). x,y = taban ortası */
function Glass({ x, y, s = 1, fill = 0.6, c = K.waterLight }: { x: number; y: number; s?: number; fill?: number; c?: string }) {
  const h = 28;
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: `M-11 ${-h}L-9 -2Q-9 0 -7 0H7Q9 0 9 -2L11 ${-h}Z`, f: GLASS },
          ...(fill > 0 ? [{ d: `M${-9 - 2 * fill} ${-h * fill}L-9 -2Q-9 0 -7 0H7Q9 0 9 -2L${9 + 2 * fill} ${-h * fill}Z`, f: c, no: true }] : []),
        ]}
      />
      <path d={`M-6 ${-h + 4}V-5`} stroke="#fff" stroke-width={2} opacity={0.8} stroke-linecap="round" />
    </G>
  );
}

/** Tezgâh (yan/önden). x = SOL, y = tezgâh üst yüzeyi, alt = zemin gy */
function Counter({ x, y, w, gy, c = '#e8dcc6', top = '#9aa3ad' }: { x: number; y: number; w: number; gy: number; c?: string; top?: string }) {
  const n = Math.max(1, Math.round(w / 60));
  const dw = w / n;
  return (
    <OG
      sh={[
        { d: rrect(x + 2, y + 6, w - 4, gy - y - 6, 1), f: c },
        ...Array.from({ length: n }, (_, i) => ({ d: rrect(x + 2 + i * dw + 5, y + 14, dw - 10, gy - y - 22, 2), f: shade(c, 0.06), ln: true })),
        ...Array.from({ length: n }, (_, i) => ({ d: rrect(x + 2 + i * dw + dw / 2 - 7, y + 20, 14, 3.5, 1.5), f: K.metal, ln: true })),
        { d: rrect(x, y, w, 8, 2), f: top },
      ]}
    />
  );
}

/** Çöp kovası (pedallı). x,y = taban ortası */
function Bin({ x, y, s = 1, c = '#6d7c8c' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-22 -54L-18 -3Q-18 0 -15 0H15Q18 0 18 -3L22 -54Z', f: c },
          { d: 'M8 -54L22 -54L18 -3Q18 0 15 0H6Z', f: shade(c, 0.14), no: true },
          { d: 'M-24 -56Q-30 -82 -8 -88', st: K.out, sw: 3 },
          { d: ell([0, -55], 23, 5), f: '#2f343c' },
          { d: 'M-25 -58L-6 -92L0 -89L-19 -55Z', f: tint(c, 0.15) },
          { d: 'M-10 -2H10V3H-10Z', f: shade(c, 0.3) },
        ]}
      />
    </G>
  );
}

/** Önlük: kişinin gövdesine (ön ya da yan görünüş). */
function apron(r: Rig, front: boolean, c = APRON) {
  const s = r.s;
  if (front) {
    const cx = (r.shoulderB[0] + r.shoulderF[0]) / 2;
    const y0 = r.neck[1] + 14 * s, y1 = r.hip[1] + 34 * s;
    const w0 = 11 * s, w1 = 19 * s;
    return (
      <OG
        sh={[
          { d: `M${cx - w0} ${y0}H${cx + w0}L${cx + w0 + 2 * s} ${r.belly[1] - 4 * s}Q${cx + w1} ${r.belly[1]} ${cx + w1} ${r.hip[1]}V${y1}H${cx - w1}V${r.hip[1]}Q${cx - w1} ${r.belly[1]} ${cx - w0 - 2 * s} ${r.belly[1] - 4 * s}Z`, f: c },
          { d: `M${cx - w0} ${y0}L${cx - 5 * s} ${r.neck[1] + 2 * s}M${cx + w0} ${y0}L${cx + 5 * s} ${r.neck[1] + 2 * s}`, st: K.out, sw: 1.4 },
          { d: rrect(cx - 8 * s, r.hip[1] - 2 * s, 16 * s, 10 * s, 2), f: shade(c, 0.06), ln: true },
        ]}
      />
    );
  }
  const d = r.flip ? -1 : 1;
  const top: P = [r.chest[0] - d * 2 * s, r.neck[1] + 10 * s];
  const bot: P = [r.hip[0] + d * 14 * s, r.hip[1] + 36 * s];
  const back: P = [r.hip[0] - d * 4 * s, r.hip[1] + 36 * s];
  return (
    <OG
      sh={[
        { d: smooth([[top[0] - d * 8 * s, top[1]], top, [r.belly[0] + d * 3 * s, r.belly[1]], bot, back, [r.hip[0] - d * 2 * s, r.hip[1] - 2 * s], [r.chest[0] - d * 9 * s, r.chest[1] + 4 * s]], true, 0.6), f: c },
        { d: `M${r.hip[0] - d * 8 * s} ${r.belly[1] + 2 * s}L${r.belly[0]} ${r.belly[1] + 2 * s}`, st: shade(c, 0.3), sw: 1.6 },
      ]}
    />
  );
}

/** Eldiven: elin üstüne renkli yuvarlak (kişi ölçeğinde) */
const glove = (p: P, s: number) => <circle cx={p[0]} cy={p[1]} r={5.6 * s} fill={GLOVE} stroke={K.out} stroke-width={1.4} />;

/** Aşçı bonesi / saç filesi */
function Bonnet({ r, c = '#fbfaf7' }: { r: Rig; c?: string }) {
  const h = r.head, hr = r.headR;
  const d = r.flip ? -1 : 1;
  return (
    <OG
      sh={[
        { d: ell([h[0] - d * hr * 0.1, h[1] - hr * 0.55], hr * 1.08, hr * 0.62), f: c },
        { d: rrect(h[0] - hr * 1.05, h[1] - hr * 0.42, hr * 2.1, hr * 0.32, hr * 0.12), f: shade(c, 0.06) },
      ]}
    />
  );
}

/** Sönük tavan lambası (x = kablonun tavandaki ucu) */
function CeilLamp({ x, y = 0, len = 34, on = false }: { x: number; y?: number; len?: number; on?: boolean }) {
  const b = y + len;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={b} stroke={K.out} stroke-width={2} />
      <OG sh={[{ d: `M${x - 22} ${b + 16}Q${x - 18} ${b} ${x} ${b}Q${x + 18} ${b} ${x + 22} ${b + 16}Z`, f: '#5f6b78' }, { d: ell([x, b + 18], 8, 6), f: on ? K.fireCore : '#c9ccd1' }]} />
    </g>
  );
}

/** Buzdolabı (karşıdan, üstte dondurucu). x = SOL, y = zemin */
function Fridge({ x, y, w = 92, h = 170, c = '#eef1f4', open = false, dark = false }: { x: number; y: number; w?: number; h?: number; c?: string; open?: boolean; dark?: boolean }) {
  const top = y - h;
  const fz = h * 0.32;
  const sh: Sh[] = [{ d: rrect(x, top, w, h, 6), f: c }, { d: rrect(x + w * 0.8, top, w * 0.2, h, 6), f: shade(c, 0.07), no: true }];
  if (!open) {
    sh.push({ d: `M${x} ${top + fz}H${x + w}`, st: K.out, sw: 1.6 });
    sh.push({ d: rrect(x + 10, top + fz - 30, 6, 22, 3), f: STEEL });
    sh.push({ d: rrect(x + 10, top + fz + 12, 6, 40, 3), f: STEEL });
  } else {
    sh.push({ d: rrect(x + 6, top + 6, w - 12, h - 14, 3), f: dark ? '#3c4552' : '#dfe7ee' });
    for (const t of [0.32, 0.55, 0.76]) sh.push({ d: `M${x + 6} ${top + h * t}H${x + w - 6}`, st: dark ? '#56606e' : STEEL, sw: 2.4 });
    // açık kapı (perspektif, sağda)
    sh.push({ d: `M${x + w} ${top}L${x + w + 30} ${top + 12}V${y - 6}L${x + w} ${y}Z`, f: shade(c, 0.05) });
    sh.push({ d: `M${x + w + 4} ${top + h * 0.45}L${x + w + 26} ${top + h * 0.47}`, st: K.out, sw: 1.2 });
  }
  return <OG sh={sh} />;
}

/** Et paketi (strafor tabak + streç). MERKEZ x,y */
function MeatPack({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-20, -8, 40, 16, 4), f: '#f4f1ea' }, { d: smooth([[-14, -3], [-4, -7], [10, -5], [15, 1], [6, 5], [-10, 4]], true), f: '#c84b4b' }, { d: 'M-6 -2Q2 0 8 -3', st: '#f2b8b0', sw: 1.6 }]} />
      <path d={rrect(-20, -8, 40, 16, 4)} fill="#fff" opacity={0.25} />
    </G>
  );
}

/** Yemek tabağı (yandan). x,y = taban ortası; food rengi */
function Plate({ x, y, s = 1, a = 0, food = '#c6863e' }: { x: number; y: number; s?: number; a?: number; food?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[{ d: smooth([[-16, -10], [-8, -18], [4, -19], [14, -12]], false) + 'Z', f: food }, { d: 'M-24 -8Q0 -4 24 -8L18 -1Q0 2 -18 -1Z', f: '#fbfaf7' }]} />
      <circle cx={-4} cy={-13} r={2.4} fill={shade(food, 0.25)} />
      <circle cx={6} cy={-14} r={2} fill="#6aa84f" />
    </G>
  );
}

/** Derin dondurucu kesiti. x = SOL, y = zemin. full 0..1 */
function ChestFreezer({ x, y, w = 120, h = 92, full = 1 }: { x: number; y: number; w?: number; h?: number; full?: number }) {
  const top = y - h;
  const ix = x + 9, iw = w - 18, ib = y - 12, it = top + 12;
  const ih = ib - it;
  const items: JSX.Element[] = [];
  const cols = ['#c84b4b', '#e8c25a', '#6aa84f', '#e48b4a', '#8f6fc2', '#4f9fe0'];
  const rows = Math.round(4 * full);
  const rh = ih / 4;
  for (let j = 0; j < rows; j++) {
    const n = 4;
    for (let i = 0; i < n; i++) {
      const bw = iw / n;
      const off = j % 2 ? bw * 0.25 : 0;
      const bx = ix + i * bw + 2 + off * (i < n - 1 ? 1 : 0);
      const ww = bw - 4 - (j % 2 && i === n - 1 ? 0 : 0);
      items.push(<path key={j + '-' + i} d={rrect(Math.min(bx, ix + iw - ww - 2), ib - (j + 1) * rh + 2, ww, rh - 3, 3)} fill={cols[(i + j * 2) % cols.length]} stroke={K.out} stroke-width={1.2} />);
    }
  }
  const crystals: P[] = [[ix + iw * 0.2, it + ih * 0.12], [ix + iw * 0.55, it + ih * 0.08], [ix + iw * 0.85, it + ih * 0.15], [ix + iw * 0.35, it + ih * 0.5], [ix + iw * 0.75, it + ih * 0.45]];
  return (
    <g>
      <OG sh={[{ d: rrect(x, top, w, h, 6), f: '#eef1f4' }, { d: rrect(ix, it, iw, ih, 3), f: '#cfe6f3' }, { d: rrect(x - 3, top - 10, w + 6, 12, 4), f: '#f7f8fa' }, { d: rrect(x + w / 2 - 14, top - 4, 28, 5, 2), f: STEEL }]} />
      {items}
      {crystals.slice(0, full > 0.8 ? 3 : 5).map((c, i) => (
        <Snow key={i} x={c[0]} y={c[1]} r={6} />
      ))}
      <rect x={x + 12} y={y - 8} width={w - 24} height={4} rx={2} fill={shade('#eef1f4', 0.2)} />
    </g>
  );
}

/** Kar/buz kristali */
function Snow({ x, y, r = 6, c = '#ffffff' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g stroke={c} stroke-width={2.2} stroke-linecap="round">
      {[0, 60, 120].map((a) => {
        const p1 = pol([x, y], a, r), p2 = pol([x, y], a + 180, r);
        return <line key={a} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
      })}
      <circle cx={x} cy={y} r={1.6} fill={c} stroke="none" />
    </g>
  );
}

/** İki katlı ev kesiti. Döndürür: ölçüler */
const HS = { x0: 30, x1: 290, gy: 226, mid: 134, top: 44, riser: 266, upY: 72, sinkX: 196, lowX: 196, lowY: 192 };
function HouseSection({ flow = false }: { flow?: boolean }) {
  const { x0, x1, gy, mid, top, riser } = HS;
  const wallC = '#efe6d6';
  return (
    <g>
      <OG
        sh={[
          { d: `M${x0 - 14} ${top + 2}L${(x0 + x1) / 2} ${top - 38}L${x1 + 14} ${top + 2}Z`, f: '#c2583e' },
          { d: rrect(x0, top, x1 - x0, gy - top, 1), f: shade(wallC, 0.25) },
          { d: rrect(x0 + 8, top + 6, x1 - x0 - 16, mid - top - 10, 1), f: wallC },
          { d: rrect(x0 + 8, mid + 6, x1 - x0 - 16, gy - mid - 6, 1), f: wallC },
          { d: rrect(x0 + 8, mid - 6, x1 - x0 - 16, 6, 0), f: K.floor, ln: true },
          { d: rrect(x0 + 8, gy - 6, x1 - x0 - 16, 6, 0), f: K.floor, ln: true },
        ]}
      />
      {/* tesisat: dikey kolon ve iki kol */}
      <OG
        sh={[
          { d: `M${riser} ${gy + 10}V${HS.upY}H${HS.sinkX + 14}`, st: K.out, sw: 9 },
          { d: `M${riser} ${HS.lowY - 14}H${HS.lowX + 8}V${HS.lowY - 6}`, st: K.out, sw: 9 },
          { d: `M${riser} ${gy + 10}V${HS.upY}H${HS.sinkX + 14}`, st: '#9aa3ad', sw: 6 },
          { d: `M${riser} ${HS.lowY - 14}H${HS.lowX + 8}V${HS.lowY - 6}`, st: '#9aa3ad', sw: 6 },
        ]}
      />
      {/* üst kat lavabo */}
      <OG
        sh={[
          { d: rrect(HS.sinkX - 8, 104, 16, mid - 6 - 104, 2), f: '#fbfaf7' },
          { d: `M${HS.sinkX - 26} 96H${HS.sinkX + 26}Q${HS.sinkX + 24} 112 ${HS.sinkX} 112Q${HS.sinkX - 24} 112 ${HS.sinkX - 26} 96Z`, f: '#fbfaf7' },
          { d: `M${HS.sinkX + 14} ${HS.upY - 4}V${HS.upY + 12}H${HS.sinkX + 2}V${HS.upY + 20}`, st: K.out, sw: 6 },
          { d: `M${HS.sinkX + 14} ${HS.upY - 4}V${HS.upY + 12}H${HS.sinkX + 2}V${HS.upY + 20}`, st: STEEL, sw: 3.6 },
          { d: rrect(HS.sinkX + 8, HS.upY - 12, 12, 6, 2), f: K.danger },
        ]}
      />
      {/* alt kat musluk */}
      <OG sh={[{ d: rrect(HS.lowX - 4, HS.lowY - 10, 16, 8, 2), f: STEEL }, { d: rrect(HS.lowX + 2, HS.lowY - 16, 8, 6, 2), f: K.water }]} />
      {flow && <path d={`M${HS.lowX + 1} ${HS.lowY - 2}V${gy - 34}`} stroke={K.water} stroke-width={4} stroke-linecap="round" />}
      <Window x={60} y={64} w={46} h={40} />
      <Window x={60} y={154} w={46} h={40} />
    </g>
  );
}

/** Basit eldivenli el (bilek x,y; a: 0 = parmaklar yukarı) + uzun kol */
function Glove({ x, y, a = 0, s = 1, c = GLOVE, arm = 140, sleeve = K.role.helper }: { x: number; y: number; a?: number; s?: number; c?: string; arm?: number; sleeve?: string }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([0, 10], 13, [0, arm], 14), f: sleeve },
          { d: rrect(-15, -6, 30, 14, 4), f: shade(c, 0.12) },
          { d: 'M-14 -2C-15 -14 -16 -24 -14 -32H14C15 -24 14 -12 13 -2Z', f: c },
          { d: capsule([-10, -30], 4.4, [-11, -50], 3.8), f: c },
          { d: capsule([-3, -32], 4.6, [-3, -56], 4), f: c },
          { d: capsule([4, -32], 4.4, [5, -53], 3.8), f: c },
          { d: capsule([10, -28], 4, [12, -44], 3.4), f: c },
          { d: capsule([-13, -10], 5.4, [-24, -28], 4.4), f: c },
        ]}
      />
    </G>
  );
}

/** Mutfak ocağı/fırın (sönük). x = SOL, y = zemin */
function Range({ x, y, w = 70, h = 84 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <OG
      sh={[
        { d: rrect(x, y - h, w, h, 3), f: '#eef1f4' },
        { d: rrect(x + 8, y - h + 26, w - 16, h - 36, 3), f: '#3c4552', ln: true },
        { d: rrect(x + 14, y - h + 32, w - 28, 8, 2), f: '#56606e', no: true },
        { d: rrect(x - 2, y - h - 4, w + 4, 8, 2), f: '#5b6575' },
        { d: ell([x + w * 0.3, y - h - 6], 12, 3.4), f: '#2f343c' },
        { d: ell([x + w * 0.72, y - h - 6], 10, 3), f: '#2f343c' },
        ...[0.25, 0.5, 0.75].map((t) => ({ d: circ([x + w * t, y - h + 13], 3.6), f: '#2f343c' })),
      ]}
    />
  );
}

/** Kavanoz (yandan). x,y = taban ortası */
function Jar({ x, y, s = 1, c = '#d9b77a', lid = '#c0392b', h = 46, w = 34 }: { x: number; y: number; s?: number; c?: string; lid?: string; h?: number; w?: number }) {
  const hw = w / 2;
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: `M${-hw} -4V${-h + 10}Q${-hw} ${-h + 4} ${-hw + 5} ${-h + 4}H${hw - 5}Q${hw} ${-h + 4} ${hw} ${-h + 10}V-4Q${hw} 0 ${hw - 4} 0H${-hw + 4}Q${-hw} 0 ${-hw} -4Z`, f: c },
          { d: rrect(-hw + 3, -h - 6, w - 6, 11, 2), f: lid },
          { d: rrect(-hw + 2, -h * 0.66, w - 4, h * 0.36, 2), f: '#fbfaf5', ln: true },
        ]}
      />
      <path d={`M${-hw + 5} ${-h + 10}V-8`} stroke="#fff" stroke-width={2.4} opacity={0.4} stroke-linecap="round" />
    </G>
  );
}

/* ════════════════════════════ oyuncular (rehber başına sabit) ════════════════════════════ */
// Ortak wash-hands sahnesi yeşil kol + ten 1 çizer; o sahneyi kullanan rehberlerde oyuncu buna uyar.
const ARITMA = { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.dark, skin: 1 } as const;
const ARITMA_EL = { sleeve: K.role.helper, skin: 1 } as const;
const GIDA = { who: 'man', role: 'bystander3', skin: 1, hairC: K.hair.black, mustache: true } as const;
const DEPO = { who: 'man', role: 'bystander3', skin: 1, hairC: K.hair.dark } as const;
const GIZLI_EL = { sleeve: K.role.helper, skin: 1 } as const; // ortak tesisat-su-vanasi-kapat ile aynı
const PISIR = { who: 'oldwoman', role: 'bystander3', skin: 1 } as const;
const ASCI = { who: 'man', role: 'bystander3', skin: 1, hairC: K.hair.black, mustache: true } as const;

/* ════════════════════════════ sahneler ════════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ─────────────── Su arıtma ─────────────── */

  'su-gida-bezden-suzme': () => {
    const jx = 172;
    return (
      <Scene2 bg="closeup">
        {/* kavanoz */}
        <OG
          sh={[
            { d: 'M118 120Q118 112 126 112H218Q226 112 226 120V220Q226 230 216 230H128Q118 230 118 220Z', f: GLASS },
            { d: 'M120 168H224V220Q224 228 216 228H128Q120 228 120 220Z', f: K.waterLight, no: true },
            { d: 'M120 168H224', st: K.water, sw: 2 },
          ]}
        />
        <path d="M132 176V218" stroke="#fff" stroke-width={4} opacity={0.7} stroke-linecap="round" />
        {/* bulanık su akışı */}
        <path d="M146 88Q160 98 166 128" fill="none" stroke={K.out} stroke-width={11} stroke-linecap="round" />
        <path d="M146 88Q160 98 166 128" fill="none" stroke={MURKY} stroke-width={8} stroke-linecap="round" />
        {/* gerilmiş bez */}
        <OG
          sh={[
            { d: 'M108 112Q112 106 124 108Q172 116 220 108Q232 106 236 112L232 140Q228 146 224 134Q172 150 120 134Q116 146 112 140Z', f: K.cloth },
            { d: 'M130 118Q172 140 214 118', st: shade(K.cloth, 0.14), sw: 1.4 },
          ]}
        />
        <ellipse cx={168} cy={128} rx={24} ry={5} fill={MURKY} opacity={0.55} />
        {/* bezden süzülen berrak damlalar */}
        <Drop x={160} y={150} s={0.8} />
        <Drop x={178} y={156} s={0.7} />
        {/* sürahi (sağa eğik) */}
        <G x={95} y={70} a={60}>
          <OG
            sh={[
              { d: 'M-30 -10Q-34 -26 -26 -30H26Q34 -26 30 -10L24 40Q22 46 16 46H-16Q-22 46 -24 40Z', f: '#cfe3ea' },
              { d: 'M-29 -16H29L24 40Q22 46 16 46H-16Q-22 46 -24 40Z', f: MURKY, no: true },
              { d: 'M26 -30L42 -38L31 -16Z', f: '#cfe3ea' },
              { d: 'M-30 -14Q-52 -10 -48 12Q-46 26 -26 26', st: K.out, sw: 8 },
              { d: 'M-30 -14Q-52 -10 -48 12Q-46 26 -26 26', st: '#cfe3ea', sw: 4.6 },
            ]}
          />
        </G>
        <Hand x={50} y={10} a={150} s={0.8} pose="fist" side="L" arm={160} {...ARITMA_EL} />
        {(() => {
          // sürahinin dibi (döndürülmüş yerel (0,46)) ≈ (55,93); avuç dibe dayalı, kol sol alttan
          const h0 = { x: 0, y: 0, a: 60, s: 0.8, pose: 'press' as const, side: 'R' as const, view: 'palm' as const, arm: 160, ...ARITMA_EL };
          const pp = handPoint(h0, 'palm');
          return <Hand {...h0} x={46 - pp[0]} y={100 - pp[1]} />;
        })()}
        <Arrow from={[264, 112]} to={[264, 196]} w={7} />
      </Scene2>
    );
  },

  'su-gida-camasir-suyu-etiket': () => {
    const h = { x: 108, y: 214, a: 0, s: 1.25, pose: 'hold' as const, side: 'R' as const, grip: 54 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={200} {...ARITMA_EL}>
          <BleachBottle x={g[0]} y={g[1] + 74} s={1.4}>
            <rect x={-21} y={-80} width={42} height={30} rx={3} fill="#fff" stroke={K.safe} stroke-width={2} />
          </BleachBottle>
        </Hand>
        {/* büyütülmüş etiket */}
        <OG sh={[{ d: rrect(16, 20, 128, 50, 8), f: '#fff' }]} />
        <rect x={20} y={24} width={120} height={42} rx={6} fill="none" stroke={K.safe} stroke-width={2.4} />
        <T x={80} y={42} text="sodyum" size={15} />
        <T x={80} y={60} text="hipoklorit" size={15} />
        <path d={`M80 70L${g[0] - 6} ${g[1] - 58}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="4 3" />
        <Ok x={146} y={22} r={14} />
        {/* yanlış şişeler */}
        <BleachBottle x={240} y={110} s={0.72} c="#f6b9d0" cap="#c2508a">
          <circle cx={0} cy={-46} r={9} fill="#fff" stroke={K.out} stroke-width={1.5} />
          {[0, 72, 144, 216, 288].map((a) => {
            const p = pol([0, -46], a - 90, 5);
            return <circle key={a} cx={p[0]} cy={p[1]} r={3.4} fill="#e2577f" />;
          })}
          <circle cx={0} cy={-46} r={2.4} fill={K.fireCore} />
        </BleachBottle>
        <No x={282} y={40} r={20} />
        <BleachBottle x={240} y={226} s={0.8} c="#fbfaf7" cap="#7aa6d6">
          <rect x={-22} y={-50} width={44} height={36} rx={3} fill="#e8f1fb" stroke={K.out} stroke-width={1.5} />
          <T x={0} y={-35} text="sıfır" size={13} />
          <T x={0} y={-20} text="klor" size={13} />
        </BleachBottle>
        <No x={282} y={150} r={20} />
      </Scene2>
    );
  },

  'su-gida-damla-litre': () => {
    const h = { x: 150, y: -6, a: 180, s: 0.95, pose: 'hold' as const, side: 'R' as const, grip: 34 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <LitreBottle x={150} y={232} s={1.3} cap={false} fill={0.75} />
        <Hand {...h} arm={120} {...ARITMA_EL}>
          <G x={g[0]} y={g[1] - 4}>
            <OG sh={[{ d: rrect(-15, -26, 30, 46, 6), f: '#fbfaf7' }, { d: rrect(-15, -6, 30, 14, 2), f: '#e8f1fb' }, { d: 'M-8 20H8L4 32H-4Z', f: '#3a7bd5' }, { d: 'M-2 32H2V40H-2Z', f: '#3a7bd5' }]} />
          </G>
        </Hand>
        <Drop x={150} y={84} s={0.8} color="#e3f2fb" />
        <Drop x={150} y={104} s={0.8} color="#e3f2fb" />
        <Label x={70} y={30} text="1 L = 2 damla" size={14} />
      </Scene2>
    );
  },

  'su-gida-bekle-30': () => (
    <Scene2 bg="indoor">
      <Table x={30} y={222} w={160} h={70} />
      <LitreBottle x={110} y={152} s={1.05} fill={0.8} />
      <Waves x={110} y={34} a={-90} n={3} r={6} color="#8fb4a4" w={2.4} />
      <Clock x={240} y={92} r={50} sweep={180} />
      <Label x={240} y={170} text="30 dk" size={16} />
    </Scene2>
  ),

  'su-gida-kapakli-bidon': () => {
    const cy = 136;
    const tap: P = [210, cy - 46];
    const glassP: P = [204, cy];
    const p: PersonProps = { x: 140, y: 228, s: 1.12, ...ARITMA, pose: { ...POSE.standSide, armF: { to: [glassP[0] - 6, glassP[1] - 12] }, armB: { to: [tap[0] + 2, tap[1] + 2] }, handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e4ece9">
        <Window x={20} y={30} w={64} h={54} />
        <Counter x={150} y={cy} w={170} gy={200} />
        <OG sh={[{ d: rrect(176, cy - 34, 68, 34, 3), f: '#b77f50' }, { d: rrect(182, cy - 28, 56, 22, 2), f: '#9a6a43', ln: true }]} />
        <TapJug x={210} y={cy - 34} s={1.0} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <path d={`M${tap[0]} ${tap[1] + 2}V${glassP[1] - 10}`} stroke={K.water} stroke-width={3} />
        <Glass x={glassP[0] + 6} y={glassP[1]} s={0.9} fill={0.5} />
        <Person {...p} only={['armF']} />
        <Ok x={276} y={30} r={15} />
      </Scene2>
    );
  },

  /* ─────────────── Elektrik kesintisinde gıda ─────────────── */

  'su-gida-buzdolabi-kapali': () => (
    <Scene2 bg="indoor" wall="#dfe3e8">
      <CeilLamp x={262} len={30} />
      <path d="M250 74l-6 8M262 78v10M274 74l6 8" stroke="#9aa1aa" stroke-width={2} stroke-linecap="round" opacity={0.6} />
      <Fridge x={70} y={222} w={104} h={190} />
      <Label x={146} y={118} text="4 sa" size={16} />
      <Hand x={250} y={196} a={-80} s={1} pose="open" side="L" view="palm" arm={130} sleeve={K.role.bystander3} skin={GIDA.skin} />
      <No x={210} y={170} r={42} />
    </Scene2>
  ),

  'su-gida-dondurucu-saat': () => (
    <Scene2 bg="indoor" wall="#e3e7ec">
      <ChestFreezer x={26} y={222} w={124} h={110} full={1} />
      <ChestFreezer x={170} y={222} w={124} h={110} full={0.5} />
      <Label x={88} y={70} text="48 sa" size={18} />
      <Label x={232} y={70} text="24 sa" size={18} />
    </Scene2>
  ),

  'su-gida-bozuk-gida-at': () => {
    const p: PersonProps = {
      x: 162, y: 228, s: 1.1, ...GIDA,
      pose: { ...POSE.standSide, spine: -84, chest: -76, head: -70, armF: { to: [236, 128] }, armB: { to: [216, 118] }, face: 'neutral' },
    };
    const r = rig(p);
    return (
      <Scene2 bg="indoor" wall="#e6e0d4">
        <Fridge x={18} y={222} w={92} h={176} open dark />
        <Bin x={262} y={226} s={1.15} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <MeatPack x={r.handB[0] + 8} y={r.handB[1] - 6} a={24} s={1.2} />
        <Plate x={r.handF[0] + 16} y={r.handF[1] + 8} a={40} s={1.25} food="#d08a3c" />
        <Person {...p} only={['armF']} />
        <Arrow from={[258, 70]} to={[268, 140]} bend={-0.3} />
      </Scene2>
    );
  },

  'su-gida-siskin-konserve': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={190} width={320} height={50} fill="#c9b9a0" />
      <rect x={0} y={190} width={320} height={4} fill="#b29f84" />
      <Can x={50} y={206} s={1.3} kind="swollen" label="#d0473d" />
      <Can x={126} y={206} s={1.3} kind="dent" label="#e0a23a" />
      <Can x={202} y={206} s={1.3} kind="rust" label="#5a8f4e" />
      <No x={50} y={170} r={30} />
      <No x={126} y={170} r={30} />
      <No x={202} y={170} r={30} />
      <Can x={276} y={206} s={1.3} kind="ok" label="#3d7ad6" />
      <Ok x={276} y={102} r={15} />
    </Scene2>
  ),

  /* ─────────────── Su depolama ─────────────── */

  'su-gida-kisi-gun-litre': () => (
    <Scene2 bg="indoor" wall="#e6ecef">
      <Person x={70} y={226} s={1.02} {...DEPO} pose={{ ...POSE.stand, face: 'neutral' }} />
      {[140, 180, 220, 260].map((x) => (
        <LitreBottle key={x} x={x} y={224} s={1.0} fill={0.85} />
      ))}
      <Calendar x={262} y={30} w={40} h={44} text="1" mark />
      <Label x={176} y={62} text="4–5 L" size={18} />
    </Scene2>
  ),

  'su-gida-3-gun-bidonlar': () => (
    <Scene2 bg="indoor" wall="#e9e2d2">
      <OG sh={[{ d: rrect(184, 140, 132, 6, 1), f: K.wood }, { d: rrect(184, 80, 132, 6, 1), f: K.wood }]} />
      <Pack x={216} y={140} s={0.95} />
      <Pack x={280} y={140} s={0.95} />
      <Pack x={248} y={80} s={0.85} />
      <Damacana x={206} y={224} s={0.85} />
      <Damacana x={250} y={224} s={0.85} />
      <Damacana x={294} y={224} s={0.85} />
      <Person x={46} y={226} s={0.92} {...DEPO} pose={{ ...POSE.stand, face: 'neutral' }} />
      <Person x={96} y={226} s={0.88} who="woman" role="bystander" skin={1} hair="scarf" pose={{ ...POSE.stand, face: 'neutral' }} />
      <Person x={136} y={228} s={0.9} who="boy" role="helper" skin={1} hairC={K.hair.brown} pose={{ ...POSE.stand, face: 'neutral' }} />
      <Person x={168} y={228} s={0.85} who="girl" role="bystander2" skin={1} hairC={K.hair.dark} pose={{ ...POSE.stand, face: 'neutral' }} />
      <Calendar x={62} y={14} w={34} h={38} text="1" />
      <Calendar x={102} y={14} w={34} h={38} text="2" />
      <Calendar x={142} y={14} w={34} h={38} text="3" />
      <Label x={226} y={34} text="3 gün" size={17} />
    </Scene2>
  ),

  'su-gida-sise-su': () => {
    const bx = 150;
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={150} width={320} height={12} fill={K.wood} stroke={K.out} stroke-width={1.5} />
        <rect x={0} y={162} width={320} height={6} fill={shade(K.wood, 0.25)} />
        <Pack x={62} y={150} s={1.3} />
        <Damacana x={272} y={150} s={1.25} />
        <Bottle x={bx} y={150} s={2.1} fill={0.9} />
        <rect x={bx - 13} y={112} width={26} height={11} rx={2} fill="#fff" stroke={K.out} stroke-width={1.2} />
        <path d={`M${bx - 9} 116H${bx + 9}M${bx - 9} 120H${bx + 4}`} stroke={K.ink} stroke-width={1.3} />
        {/* büyütülmüş tarih */}
        <path d={`M${bx - 12} 114L104 64`} stroke={K.ink} stroke-width={1.5} stroke-dasharray="4 3" />
        <circle cx={bx} cy={117} r={16} fill="none" stroke={K.action} stroke-width={3} />
        <OG sh={[{ d: rrect(14, 22, 104, 44, 8), f: '#fff' }]} />
        <T x={66} y={40} text="SKT" size={12} c="#6b7280" />
        <T x={66} y={58} text="03.2027" size={16} />
        <Hand x={203} y={188} a={-28} s={1.05} pose="point" side="R" arm={80} sleeve={K.role.bystander3} skin={DEPO.skin} />
      </Scene2>
    );
  },

  'su-gida-bidon-temizleme': () => {
    const base: PersonProps = { x: 112, y: 228, s: 1.1, ...DEPO, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(base);
    const J: P = [r0.chest[0] + 40, r0.chest[1] + 18];
    const p: PersonProps = { ...base, pose: { ...POSE.standSide, armB: { to: [J[0] - 14, J[1] - 36] }, armF: { to: [J[0] + 20, J[1] + 10] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e1ebe8">
        <Counter x={186} y={150} w={134} gy={200} />
        <path d="M222 150V156Q222 170 236 170H284Q298 170 298 156V150Z" fill="#cfd6dd" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M300 150V112Q300 102 290 102H272', st: K.out, sw: 7 }, { d: 'M300 150V112Q300 102 290 102H272', st: STEEL, sw: 4 }]} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Jerry x={J[0]} y={J[1] + 34} s={0.9} a={-14} />
        <Person {...p} only={['armF']} />
        <Arrow from={[J[0] - 30, J[1] - 60]} to={[J[0] + 34, J[1] - 60]} bend={0.3} w={5} />
        <Arrow from={[J[0] + 38, J[1] + 50]} to={[J[0] - 26, J[1] + 50]} bend={0.3} w={5} />
        <BleachBottle x={244} y={150} s={0.48} />
        <OG sh={[{ d: capsule([262, 146], 1.8, [286, 142], 1.8), f: STEEL }, { d: ell([292, 141], 6, 3.4), f: STEEL }]} />
      </Scene2>
    );
  },

  'su-gida-bidon-etiket': () => {
    const h = { x: 236, y: 84, a: 230, s: 1.05, pose: 'hold' as const, side: 'R' as const, grip: 16 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Jerry x={140} y={238} s={2.3} />
        <G x={140} y={238} s={2.3}>
          <rect x={-22} y={-52} width={40} height={30} rx={2} fill="#fff" stroke={K.out} stroke-width={0.7} />
          <T x={-2} y={-39} text="İÇME SUYU" size={6.6} />
          <T x={-2} y={-29} text="01.11.26" size={6} c="#2f6fb0" />
        </G>
        <Hand {...h} arm={150} sleeve={K.role.bystander3} skin={DEPO.skin}>
          <G x={g[0]} y={g[1]} a={230}>
            <OG sh={[{ d: rrect(-6, -26, 12, 58, 4), f: '#2b2d3a' }, { d: 'M-6 -26L-3 -36H3L6 -26Z', f: '#2b2d3a' }, { d: rrect(-6, 16, 12, 16, 3), f: '#2f6fb0' }]} />
          </G>
        </Hand>
      </Scene2>
    );
  },

  'su-gida-serin-yer': () => (
    <Scene2 bg="closeup">
      {/* serin kiler */}
      <rect x={0} y={0} width={158} height={240} fill="#46546a" />
      <rect x={0} y={190} width={158} height={50} fill="#38445a" />
      <OG sh={[{ d: rrect(10, 160, 140, 7, 1), f: K.wood }, { d: rrect(14, 167, 6, 30, 1), f: shade(K.wood, 0.2) }, { d: rrect(140, 167, 6, 30, 1), f: shade(K.wood, 0.2) }]} />
      <Jerry x={52} y={160} s={1.0} />
      <Jerry x={112} y={160} s={1.0} />
      <Snow x={30} y={40} r={7} c="#9dd5f6" />
      <Ok x={80} y={40} r={16} />
      {/* güneşli balkon */}
      <rect x={162} y={0} width={158} height={240} fill={K.sky} />
      <rect x={162} y={180} width={158} height={60} fill="#cdbfa8" />
      <Sun x={292} y={34} r={16} />
      <g stroke={K.out} stroke-width={2}>
        <line x1={162} y1={142} x2={320} y2={142} />
        {[176, 200, 224, 248, 272, 296].map((x) => <line key={x} x1={x} y1={142} x2={x} y2={182} />)}
      </g>
      <Jerry x={206} y={206} s={0.95} />
      <Jerry x={270} y={206} s={0.95} c="#d63b35" cap="#2b2d3a" />
      <No x={240} y={150} r={52} />
      <rect x={157} y={0} width={6} height={240} fill="#fff" />
    </Scene2>
  ),

  /* ─────────────── Evdeki gizli su ─────────────── */

  'su-gida-ust-musluk-ac': () => {
    const knob: P = [HS.sinkX + 14, HS.upY - 9];
    return (
      <Scene2 bg="outdoor">
        <HouseSection />
        {/* musluk açık: içeri giren hava (kişi yok; ev kesitinde minik figür okunmuyordu) */}
        <Waves x={knob[0] + 4} y={knob[1] - 4} a={-60} n={3} r={6} color={K.water} />
        <Arrow from={[236, 40]} to={[HS.sinkX + 6, HS.upY + 18]} bend={-0.25} w={5} />
      </Scene2>
    );
  },

  'su-gida-alt-musluk-kap': () => (
    <Scene2 bg="outdoor">
      <HouseSection flow />
      <Bucket x={HS.lowX + 2} y={HS.gy - 6} s={0.8} level={0.6} />
      <Arrow from={[HS.riser + 16, HS.upY + 6]} to={[HS.riser + 16, HS.lowY - 20]} w={6} />
    </Scene2>
  ),

  'su-gida-termosifon-bosalt': () => (
    <Scene2 bg="indoor" wall="#dbe7ee">
      <g opacity={0.5} stroke="#c3d3dd" stroke-width={1.5}>
        {[30, 60, 90, 120, 150, 180].map((y) => <line key={y} x1={0} y1={y} x2={320} y2={y} />)}
        {[40, 80, 120, 160, 200, 240, 280].map((x) => <line key={x} x1={x} y1={0} x2={x} y2={200} />)}
      </g>
      {/* borular + kapalı soğuk su vanası */}
      <OG sh={[{ d: 'M126 0V30', st: K.out, sw: 9 }, { d: 'M174 0V30', st: K.out, sw: 9 }, { d: 'M126 0V30', st: '#5c9fd8', sw: 6 }, { d: 'M174 0V30', st: '#d8695c', sw: 6 }]} />
      <OG sh={[{ d: rrect(119, 8, 14, 12, 2), f: STEEL }, { d: rrect(96, 10, 40, 8, 3), f: K.danger }]} />
      {/* termosifon */}
      <OG
        sh={[
          { d: rrect(98, 26, 104, 136, 34), f: '#fbfaf7' },
          { d: rrect(170, 26, 32, 136, 30), f: shade('#fbfaf7', 0.07), no: true },
          { d: rrect(134, 104, 32, 18, 3), f: '#e8edf2', ln: true },
          { d: circ([142, 113], 3), f: K.safe, ln: true },
          { d: 'M150 162V178', st: K.out, sw: 8 },
          { d: 'M150 162V178', st: STEEL, sw: 5 },
          { d: rrect(140, 174, 20, 8, 2), f: STEEL },
        ]}
      />
      <path d="M152 182Q154 196 154 206" stroke={K.water} stroke-width={4} stroke-linecap="round" fill="none" />
      <Bucket x={154} y={228} s={1.0} level={0.45} />
      {/* fişten çekilmiş kablo */}
      <path d="M202 110Q226 112 230 140Q234 166 236 172" fill="none" stroke={K.out} stroke-width={3} />
      <OG sh={[{ d: rrect(229, 170, 14, 18, 3), f: '#fbfaf7' }, { d: 'M233 188V196M239 188V196', st: K.out, sw: 2 }]} />
      <OG sh={[{ d: rrect(266, 110, 30, 30, 4), f: '#fbfaf7' }, { d: circ([281, 125], 9), f: '#e8edf2', ln: true }, { d: circ([277, 125], 1.8), f: K.out }, { d: circ([285, 125], 1.8), f: K.out }]} />
      <Glove x={106} y={194} a={50} s={0.85} sleeve={GIZLI_EL.sleeve} />
    </Scene2>
  ),

  'su-gida-rezervuar': () => {
    // Temiz kap rezervuarın berrak suyuna daldırılıyor; tablet/blok yok. Çanak yasak.
    const tgt: P = [168, 76];
    const h0 = { x: 0, y: 0, a: -112, s: 0.9, pose: 'hold' as const, side: 'L' as const, grip: 46 };
    const gp = handPoint(h0, 'grip');
    const h = { ...h0, x: tgt[0] - gp[0], y: tgt[1] - gp[1] };
    const cup = '#fbfaf7';
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={200} width={320} height={40} fill="#d9d2c4" />
        {/* kaldırılmış kapak (duvara dayalı) */}
        <G x={78} y={40} a={-12}>
          <OG sh={[{ d: rrect(-12, 0, 24, 112, 4), f: '#fbfaf7' }, { d: rrect(8, 0, 4, 112, 2), f: shade('#fbfaf7', 0.1), no: true }]} />
        </G>
        {/* klozet çanağı */}
        <OG sh={[{ d: 'M108 150H232Q230 196 196 206L192 230H148L144 206Q110 196 108 150Z', f: '#fbfaf7' }, { d: ell([170, 152], 62, 9), f: '#e6ebef' }, { d: ell([170, 154], 46, 6), f: '#a9c6d8', no: true }]} />
        <No x={170} y={190} r={30} />
        {/* rezervuar: berrak su, içinde hiçbir nesne yok */}
        <OG
          sh={[
            { d: rrect(112, 60, 116, 84, 6), f: '#fbfaf7' },
            { d: rrect(120, 66, 100, 72, 4), f: '#e8f4fb' },
            { d: rrect(120, 84, 100, 54, 3), f: K.waterLight, no: true },
            { d: 'M120 84H220', st: K.water, sw: 2 },
          ]}
        />
        <Hand {...h} arm={170} {...GIZLI_EL}>
          <G x={tgt[0]} y={tgt[1]} a={0}>
            <OG sh={[{ d: 'M-22 -32L-18 22Q-18 27 -13 27H13Q18 27 18 22L22 -32Z', f: cup }, { d: ell([0, -32], 22, 5), f: shade(cup, 0.08) }, { d: 'M-21 -24H21', st: '#5aa5d8', sw: 3 }]} />
            <path d="M-19.4 8H19.4L18 22Q18 27 13 27H-13Q-18 27 -18 22Z" fill={K.waterLight} opacity={0.6} />
          </G>
        </Hand>
        {/* kabın alt kısmı suyun içinde */}
        <path d="M150 84Q160 80 168 84M186 84Q194 80 202 84" stroke="#fff" stroke-width={2} fill="none" />
        <Ok x={262} y={50} r={16} />
      </Scene2>
    );
  },

  'su-gida-kalorifer-yasak': () => (
    <Scene2 bg="indoor" wall="#efe3cf">
      {/* kombi */}
      <OG sh={[{ d: rrect(250, 18, 54, 74, 5), f: '#fbfaf7' }, { d: rrect(258, 66, 38, 14, 2), f: '#e1e6ea', ln: true }, { d: circ([266, 73], 3), f: K.water, ln: true }, { d: 'M262 92V200M276 92V200M290 92V200', st: '#9aa3ad', sw: 4 }]} />
      {/* petek */}
      <OG
        sh={[
          { d: rrect(34, 108, 180, 76, 4), f: '#f4f4f2' },
          ...Array.from({ length: 11 }, (_, i) => ({ d: rrect(40 + i * 16, 112, 10, 68, 3), f: shade('#f4f4f2', 0.06), ln: true })),
          { d: rrect(44, 184, 8, 16, 1), f: '#c9ccd1' },
          { d: rrect(196, 184, 8, 16, 1), f: '#c9ccd1' },
          { d: rrect(212, 112, 14, 9, 2), f: STEEL },
        ]}
      />
      <path d="M226 118Q236 124 238 150Q240 176 240 188" fill="none" stroke={K.out} stroke-width={6} stroke-linecap="round" />
      <path d="M226 118Q236 124 238 150Q240 176 240 188" fill="none" stroke="#5a4632" stroke-width={3.4} stroke-linecap="round" />
      <Glass x={240} y={226} s={1.4} fill={0.6} c="#5a4632" />
      <No x={240} y={190} r={38} />
    </Scene2>
  ),

  /* ─────────────── Pişirmeden beslenme ─────────────── */

  'su-gida-konserve-soguk': () => {
    // Ocak/ateş yok: masada açık ton balığı ve fasulye konservesi, kutudan soğuk yiyen kişi.
    const base: PersonProps = { x: 82, y: 226, s: 1.08, ...PISIR, pose: { ...POSE.sitChair, face: 'neutral' } };
    const r0 = rig(base);
    const canP: P = [150, 158];
    const p: PersonProps = { ...base, pose: { ...POSE.sitChair, head: -84, armB: { to: [canP[0] - 6, canP[1] - 22] }, armF: { to: [r0.mouth[0] + 20, r0.mouth[1] + 14] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor" wall="#e6e4d6">
        <Window x={236} y={22} w={64} h={52} />
        {/* kişi ve masa büyütülmüş (yakın plan) */}
        <g transform="translate(40 228) scale(1.32) translate(-40 -226)">
        <Chair x={76} y={226} />
        <Table x={112} y={226} w={168} h={66} />
        {/* ton balığı (yassı) + fasulye konservesi */}
        <Can x={232} y={160} s={0.62} kind="open" label="#3d7ad6" fill="#d9a77a" />
        <OG sh={[{ d: rrect(184, 146, 38, 14, 3), f: '#c8d0d8' }, { d: ell([203, 146], 19, 4.5), f: '#e7d6b4' }, { d: rrect(186, 150, 34, 7, 1), f: '#e2b23a', no: true }]} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Can x={canP[0]} y={canP[1]} s={0.72} kind="open" label="#c0392b" fill="#a0522d" />
        <path d={`M${r.handF[0] + 2} ${r.handF[1] - 2}L${r.mouth[0] + 5} ${r.mouth[1] + 1}`} stroke={K.out} stroke-width={4.6} stroke-linecap="round" />
        <path d={`M${r.handF[0] + 2} ${r.handF[1] - 2}L${r.mouth[0] + 5} ${r.mouth[1] + 1}`} stroke={STEEL} stroke-width={2.4} stroke-linecap="round" />
        <Person {...p} only={['armF']} />
        </g>
        <Ok x={196} y={50} r={15} />
      </Scene2>
    );
  },

  'su-gida-konserve-acacak': () => (
    <Scene2 bg="closeup">
      <Can x={150} y={236} s={2.4} kind="ok" label="#5a8f4e" />
      {/* bezle silinen kapak */}
      <Cloth x={124} y={112} w={58} h={20} a={-4} />
      <Hand x={68} y={136} a={75} s={0.85} pose="press" side="L" arm={140} sleeve={K.role.bystander3} skin={PISIR.skin} />
      {/* kelebek açacak sağ kenarda */}
      <G x={200} y={110}>
        <OG
          sh={[
            { d: rrect(-8, -12, 22, 22, 4), f: STEEL },
            { d: capsule([4, 6], 5, [70, 70], 6), f: '#a8322a' },
            { d: capsule([10, 0], 5, [80, 56], 6), f: '#d0473d' },
            { d: circ([3, 2], 6), f: shade(STEEL, 0.2) },
            { d: capsule([3, -12], 3.4, [3, -26], 3.4), f: STEEL },
            { d: 'M3 -26L-18 -38Q-24 -26 -12 -22ZM3 -26L24 -38Q30 -26 18 -22Z', f: STEEL },
          ]}
        />
      </G>
      <Hand x={296} y={196} a={-44} s={0.9} pose="fist" side="R" arm={120} sleeve={K.role.bystander3} skin={PISIR.skin} />
      <Arrow from={[176, 68]} to={[226, 74]} bend={0.35} w={5} />
    </Scene2>
  ),

  'su-gida-kuru-gidalar': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={118} width={320} height={122} fill="#c99a68" />
      <rect x={0} y={118} width={320} height={4} fill="#b0824f" />
      {/* arka sıra */}
      <OG sh={[{ d: 'M20 158Q16 130 44 126H84Q110 130 104 158Z', f: '#d89a4e' }, { d: 'M36 134Q42 144 38 152M58 130Q64 142 60 152M80 132Q86 144 82 154', st: shade('#d89a4e', 0.3), sw: 2 }]} />
      <Jar x={138} y={160} s={1.1} c="#e2cc9c" lid="#8a6a3a" />
      <Jar x={184} y={160} s={1.1} c="#4a2a1a" lid="#c0392b" />
      <Jar x={230} y={160} s={1.1} c="#b07434" lid="#2f6fb0" />
      <OG sh={[{ d: rrect(256, 112, 52, 48, 4), f: '#f0c35a' }, { d: rrect(262, 124, 40, 20, 3), f: '#fbfaf5', ln: true }]} />
      <g fill="#c89a5a" stroke={K.out} stroke-width={1}>
        <rect x={268} y={128} width={12} height={12} rx={2} />
        <rect x={284} y={128} width={12} height={12} rx={2} />
      </g>
      {/* ön sıra */}
      <OG sh={[{ d: rrect(24, 176, 74, 40, 5), f: '#3d7ad6' }, { d: rrect(32, 186, 58, 20, 3), f: '#fbfaf5', ln: true }]} />
      <g fill="#e8c27a" stroke={K.out} stroke-width={1}>
        {[42, 61, 80].map((x) => <circle key={x} cx={x} cy={196} r={6.5} />)}
      </g>
      <OG sh={[{ d: 'M118 196Q120 222 156 222Q192 222 194 196Z', f: '#9a6a43' }, { d: ell([156, 196], 38, 7), f: '#7b5233' }]} />
      <g stroke={K.out} stroke-width={1}>
        {[[136, 192, '#c89a5a'], [148, 189, '#e8d6b0'], [160, 192, '#a0703a'], [172, 189, '#c89a5a'], [142, 196, '#e8d6b0'], [166, 196, '#a0703a'], [154, 194, '#c89a5a']].map(([x, y, c], i) => (
          <ellipse key={i} cx={x as number} cy={y as number} rx={6} ry={4} fill={c as string} />
        ))}
      </g>
      <OG sh={[{ d: ell([256, 206], 46, 12), f: '#fbfaf7' }, { d: ell([256, 204], 34, 8), f: '#eef0f2', ln: true }]} />
      <g fill="#f29a3a" stroke={K.out} stroke-width={1}>
        {[[238, 200], [252, 196], [266, 200], [246, 206], [262, 206], [276, 203]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={7} ry={5} />)}
      </g>
    </Scene2>
  ),

  'su-gida-ocak-disarida': () => (
    <Scene2 bg="closeup">
      {/* dışarıda: doğru */}
      <rect x={0} y={0} width={158} height={240} fill={K.sky} />
      <rect x={0} y={170} width={158} height={70} fill={K.grass} />
      <Tree x={30} y={176} s={0.8} />
      <Stove x={88} y={214} s={1.7} />
      <Pot x={88} y={214 - 26 * 1.7} s={1.4} boil />
      <Ok x={136} y={26} r={15} />
      {/* evin içinde */}
      <rect x={162} y={0} width={158} height={119} fill={K.wall} />
      <rect x={162} y={96} width={158} height={23} fill={K.floor} />
      <Window x={178} y={16} w={44} h={38} />
      <Stove x={268} y={110} s={1} />
      <Pot x={268} y={84} s={0.8} boil={false} />
      <No x={268} y={78} r={30} />
      {/* çadırın içinde */}
      <rect x={162} y={121} width={158} height={119} fill={K.sky} />
      <rect x={162} y={210} width={158} height={30} fill={K.grass} />
      <Tent x={242} y={222} s={1.5} color="#3d8f6a" />
      <Stove x={236} y={222} s={0.8} />
      <No x={238} y={186} r={30} />
      <rect x={157} y={0} width={6} height={240} fill="#fff" />
      <rect x={160} y={117} width={160} height={6} fill="#fff" />
    </Scene2>
  ),

  /* ─────────────── Sıcakta gıda ─────────────── */

  'su-gida-saat-2': () => (
    <Scene2 bg="outdoor">
      <Tree x={36} y={196} s={0.8} />
      <Table x={30} y={226} w={180} h={64} color="#a8723f" />
      <Pot x={120} y={162} s={1.5} boil={false} color="#c6574e" />
      <G x={168} y={160} a={-8}>
        <OG sh={[{ d: ell([0, -3], 30, 5), f: '#a8463f' }, { d: rrect(-6, -12, 12, 7, 2), f: '#5b3a33' }]} />
      </G>
      <Clock x={256} y={82} r={48} sweep={60} />
      <Label x={256} y={154} text="2 sa" size={17} />
    </Scene2>
  ),

  'su-gida-termometre-32': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <rect x={0} y={0} width={320} height={140} fill="#ffe9b8" opacity={0.45} />
      <Sun x={46} y={44} r={20} />
      <Thermo x={104} y={196} h={130} level={0.86} />
      <Label x={142} y={86} text="32°C" size={15} bg="#fff" anchor="start" />
      <Table x={150} y={226} w={140} h={58} />
      <Plate x={206} y={168} s={1.6} food="#d08a3c" />
      <Waves x={206} y={128} a={-90} n={3} r={6} color="#e8833a" w={2.4} />
      <Clock x={268} y={140} r={22} sweep={30} />
      <Label x={226} y={30} text="32°C → 1 sa" size={15} />
    </Scene2>
  ),

  'su-gida-sogutma-cantasi': () => {
    const hinge = 146;
    const lidA = -36;
    const lidEnd: P = pol([112, hinge], lidA, 1);
    void lidEnd;
    return (
      <Scene2 bg="outdoor">
        <ellipse cx={150} cy={218} rx={140} ry={16} fill="#5d8a3f" opacity={0.45} />
        <Tree x={52} y={210} s={1.5} />
        {/* soğutma çantası: iç ve ön yüz */}
        <OG
          sh={[
            { d: rrect(112, 138, 140, 18, 3), f: '#2b3a4c' },
            { d: rrect(124, 128, 24, 18, 3), f: '#5fb3ec' },
            { d: rrect(152, 126, 30, 22, 4), f: '#fbfaf7' },
            { d: rrect(186, 130, 28, 16, 3), f: '#f3b54a' },
            { d: rrect(218, 128, 24, 18, 3), f: '#5fb3ec' },
          ]}
        />
        <OG sh={[{ d: rrect(108, 146, 148, 78, 8), f: '#e04a3c' }, { d: rrect(108, 146, 148, 14, 4), f: '#fbfaf7' }, { d: rrect(108, 210, 148, 14, 4), f: '#fbfaf7' }, { d: rrect(170, 166, 24, 8, 3), f: '#fbfaf7' }]} />
        {/* kapak (kapanıyor) */}
        <G x={110} y={hinge} a={lidA}>
          <OG sh={[{ d: rrect(0, -16, 150, 16, 5), f: '#fbfaf7' }, { d: rrect(0, -4, 150, 4, 2), f: shade('#fbfaf7', 0.12), no: true }]} />
        </G>
        <Hand x={274} y={48} a={-110} s={0.85} pose="press" side="L" view="back" arm={80} sleeve={K.role.helper} skin={1} />
        <Arrow from={[288, 92]} to={[268, 150]} bend={-0.25} w={6} />
        {/* küçük termometre */}
        <OG sh={[{ d: rrect(118, 178, 50, 24, 5), f: '#fbfaf7' }]} />
        <Thermo x={128} y={196} h={14} level={0.3} c={K.water} />
        <T x={152} y={195} text="5°C" size={11} />
      </Scene2>
    );
  },

  'su-gida-cig-pismis-ayri': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#c3c7cc" />
      <g opacity={0.35} fill="#9aa1a8">
        {[[30, 20], [80, 210], [200, 30], [290, 190], [150, 120], [250, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} />)}
      </g>
      {/* kırmızı tahta: çiğ tavuk */}
      <OG sh={[{ d: rrect(16, 44, 132, 172, 10), f: '#d9473d' }, { d: rrect(22, 50, 120, 160, 8), f: '#e25a4f', no: true }, { d: circ([82, 58], 5), f: '#b5352c' }]} />
      <OG sh={[{ d: smooth([[40, 110], [60, 86], [96, 82], [124, 100], [126, 136], [98, 156], [58, 152], [38, 132]], true), f: '#f6c1b0' }, { d: capsule([118, 144], 7, [132, 168], 5), f: '#f6c1b0' }, { d: capsule([46, 146], 7, [36, 168], 5), f: '#f6c1b0' }]} />
      <path d="M62 112Q82 104 104 114" stroke="#e59c8a" stroke-width={2} fill="none" />
      <OG sh={[{ d: 'M40 196L112 182L114 188L42 202Z', f: STEEL }, { d: rrect(112, 179, 30, 11, 4), f: '#2b2d3a', t: 'rotate(-11 127 184)' }]} />
      {/* yeşil tahta: pişmiş */}
      <OG sh={[{ d: rrect(172, 44, 132, 172, 10), f: '#3ea35f' }, { d: rrect(178, 50, 120, 160, 8), f: '#4db36d', no: true }, { d: circ([238, 58], 5), f: '#2f8a4c' }]} />
      <OG sh={[{ d: circ([238, 118], 44), f: '#fbfaf7' }, { d: circ([238, 118], 34), f: '#eef0f2', ln: true }]} />
      <OG sh={[{ d: smooth([[214, 112], [228, 98], [254, 100], [262, 118], [248, 132], [222, 130]], true), f: '#b5672e' }]} />
      <g stroke={K.out} stroke-width={1}>
        <circle cx={226} cy={140} r={6} fill="#e8833a" />
        <circle cx={244} cy={142} r={6} fill="#e8833a" />
        <circle cx={258} cy={134} r={5} fill="#6aa84f" />
      </g>
      <OG sh={[{ d: 'M196 196L268 182L270 188L198 202Z', f: STEEL }, { d: rrect(268, 179, 30, 11, 4), f: '#2f6fb0', t: 'rotate(-11 283 184)' }]} />
      <path d="M160 40V228" stroke="#fff" stroke-width={4} stroke-dasharray="10 7" stroke-linecap="round" />
      <Arrow from={[146, 22]} to={[96, 22]} w={5} />
      <Arrow from={[174, 22]} to={[224, 22]} w={5} />
    </Scene2>
  ),

  /* ─────────────── Toplu mutfak ─────────────── */

  'su-gida-hasta-asci-yasak': () => {
    const sick: PersonProps = { x: 62, y: 226, s: 1.0, who: 'man', role: 'bystander4', skin: 0, hairC: K.hair.brown, pose: { ...POSE.standSide, spine: -86, head: -80, armF: { at: 'head', d: [8, -2] }, handF: 'flat', face: 'pain' } };
    const r = rig(sick);
    const pose = { ...POSE.stand, armB: [70, 20] as [number, number], armF: [110, 160] as [number, number], face: 'neutral' as const };
    const c1: PersonProps = { x: 208, y: 196, s: 0.72, who: 'woman', role: 'helper', skin: 2, hair: 'bun', pose };
    const c2: PersonProps = { x: 270, y: 196, s: 0.72, ...ASCI, pose }; // rehberin aşçısı
    return (
      <Scene2 bg="outdoor">
        {/* yol */}
        <path d="M60 240L130 200H210L190 240Z" fill={K.dirt} opacity={0.8} />
        {/* mutfak çadırı */}
        <OG sh={[{ d: rrect(176, 70, 6, 136, 1), f: STEEL }, { d: rrect(304, 70, 6, 136, 1), f: STEEL }, { d: 'M168 74L243 36L318 74Z', f: '#fbfaf7' }, { d: 'M168 74H318V84H168Z', f: '#3d8f6a' }]} />
        <rect x={182} y={84} width={122} height={116} fill="#2b3a4c" opacity={0.15} />
        <Person {...c1} over={(q) => <g>{apron(q, true)}{glove(q.handB, q.s)}{glove(q.handF, q.s)}<Bonnet r={q} /></g>} />
        <Person {...c2} over={(q) => <g>{apron(q, true)}{glove(q.handB, q.s)}{glove(q.handF, q.s)}<Bonnet r={q} /></g>} />
        <Table x={190} y={210} w={110} h={46} color="#b9c2cc" />
        <Pot x={242} y={164} s={0.9} />
        {/* hasta gönüllü */}
        <Person {...sick} />
        <Drop x={r.head[0] - 14} y={r.head[1] - 4} s={0.7} color="#bfe3f5" />
        <Drop x={r.head[0] - 18} y={r.head[1] + 10} s={0.55} color="#bfe3f5" />
        <No x={138} y={196} r={28} />
      </Scene2>
    );
  },

  'su-gida-kazan-kaynatma': () => {
    const base: PersonProps = { x: 84, y: 226, s: 1.1, ...ASCI, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(base);
    const top: P = [r0.chest[0] + 22, r0.chest[1] - 6];
    const tip: P = [214, 134];
    const p: PersonProps = { ...base, pose: { ...POSE.standSide, spine: -84, armB: { to: top }, armF: { to: [top[0] + 22, top[1] + 18] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={292} y={196} kind="pine" s={0.9} />
        {/* ocak ayakları + ateş */}
        <OG sh={[{ d: 'M156 226L170 180M266 226L250 180', st: K.out, sw: 6 }, { d: 'M156 226L170 180M266 226L250 180', st: '#5b6575', sw: 3.4 }]} />
        <Flame x={196} y={218} s={0.8} />
        <Flame x={224} y={218} s={0.7} />
        <Pot x={210} y={194} s={2.3} boil color="#6d7480" />
        <rect x={164} y={127} width={92} height={6} rx={3} fill="#e0a23a" opacity={0.9} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} over={(q) => <Bonnet r={q} />} mid={(q) => apron(q, false)} />
        <path d={`M${top[0] - 10} ${top[1] - 10}L${tip[0]} ${tip[1]}`} stroke={K.out} stroke-width={6} stroke-linecap="round" />
        <path d={`M${top[0] - 10} ${top[1] - 10}L${tip[0]} ${tip[1]}`} stroke={K.wood} stroke-width={3.4} stroke-linecap="round" />
        <Person {...p} only={['armF']} />
        <Person {...p} only={['head']} over={(q) => <Bonnet r={q} />} />
      </Scene2>
    );
  },

  'su-gida-sicak-dagitim': () => {
    const plate: P = [206, 140];
    const vol: PersonProps = { x: 98, y: 214, s: 1.02, ...ASCI, pose: { ...POSE.standSide, armF: { to: [plate[0] - 14, plate[1] - 18] }, armB: { to: [146, 128] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    const rec: PersonProps = { x: 240, y: 230, s: 1.0, flip: true, who: 'oldman', role: 'victim', skin: 1, pose: { ...POSE.standSide, armF: { to: [plate[0] + 10, plate[1] + 4] }, armB: { to: [plate[0] + 16, plate[1] + 6] }, handF: 'flat', face: 'calm' } };
    const rv = rig(vol);
    return (
      <Scene2 bg="outdoor">
        <Person x={284} y={214} s={0.86} flip who="woman" role="bystander2" hair="scarf" skin={2} pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Person x={310} y={208} s={0.8} flip who="boy" role="bystander3" skin={0} pose={{ ...POSE.standSide, face: 'neutral' }} />
        <Person {...vol} mid={(q) => apron(q, false)} over={(q) => <g>{glove(q.handF, q.s)}{glove(q.handB, q.s)}<Bonnet r={q} /></g>} />
        <Table x={92} y={230} w={136} h={74} color="#b9c2cc" />
        <Pot x={146} y={156} s={1.25} boil color="#8e99a6" />
        {/* kepçe */}
        <path d={`M${rv.handF[0]} ${rv.handF[1]}L${plate[0] - 4} ${plate[1] - 6}`} stroke={K.out} stroke-width={5} stroke-linecap="round" />
        <path d={`M${rv.handF[0]} ${rv.handF[1]}L${plate[0] - 4} ${plate[1] - 6}`} stroke={STEEL} stroke-width={2.6} stroke-linecap="round" />
        <Person {...rec} />
        <Plate x={plate[0] + 4} y={plate[1] + 6} s={1.05} food="#e0a23a" />
        <OG sh={[{ d: ell([plate[0] - 2, plate[1] - 6], 9, 6), f: STEEL }]} />
        <Label x={226} y={30} text="60°C+" size={14} />
      </Scene2>
    );
  },

  'su-gida-mutfak-mesafe': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill={K.grass} />
      <g fill={K.grassShade} opacity={0.6}>
        {[[20, 30], [140, 200], [300, 40], [200, 220], [90, 216], [170, 30]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l3 -8l3 8M${x + 6} ${y}l3 -6l3 6`} stroke={K.grassShade} stroke-width={1.6} fill="none" />)}
      </g>
      {/* mutfak çadırı (üstten) */}
      <OG sh={[{ d: rrect(18, 62, 96, 116, 4), f: '#fbfaf7' }, { d: 'M66 62V178', st: shade('#fbfaf7', 0.2), sw: 2 }, { d: 'M18 62L66 92L114 62M18 178L66 148L114 178', st: shade('#fbfaf7', 0.15), sw: 1.4 }]} />
      <Pot x={66} y={134} s={0.8} boil />
      {/* yangın söndürücü */}
      <OG sh={[{ d: rrect(98, 184, 18, 40, 6), f: K.danger }, { d: rrect(102, 176, 10, 10, 2), f: '#2b2d3a' }, { d: 'M112 180Q124 178 122 194', st: K.out, sw: 3 }]} />
      {/* yaşam çadırları: hepsi okun ucunun (x=234) ötesinde */}
      {([[248, 16, '#e0813c'], [248, 88, '#3d7ad6'], [248, 160, '#e0813c']] as [number, number, string][]).map(([x, y, c]) => (
        <OG key={y} sh={[{ d: rrect(x, y, 58, 62, 4), f: c }, { d: `M${x + 29} ${y}V${y + 62}`, st: shade(c, 0.25), sw: 2 }]} />
      ))}
      {/* sınır çizgisi */}
      <path d="M238 12V228" stroke="#fff" stroke-width={2} stroke-dasharray="5 5" opacity={0.8} />
      {/* ölçü oku */}
      <path d="M124 120H234" stroke="#fff" stroke-width={2} stroke-dasharray="5 4" />
      <Arrow from={[178, 120]} to={[122, 120]} w={5} />
      <Arrow from={[178, 120]} to={[234, 120]} w={5} />
      <Label x={178} y={96} text="6 m" size={18} bg="#fff" />
    </Scene2>
  ),
};
