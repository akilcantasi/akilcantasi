// Yangın kategorisi sahneleri (kit v2). Şartname: src/art/spec/yangin.ts
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Car, Cloth, Door, Drop, Flame, Flashlight, Hand, HouseExt, K, Label, No, OG, Ok, Person, Phone, POSE,
  Scene2, Smoke, Stairs, Tree, Waves, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { P, PersonProps, Sh } from '../kit2';
import { salterScene } from './tesisat';

/* ════════════════════════ yardımcılar ════════════════════════ */

const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const f1 = (n: number) => Math.round(n * 10) / 10;

/** Yangın söndürücü (yan görünüş; kol ve tetik sağa bakar). x,y = taban ortası.
 *  Yerel ölçüler (s=1): gövde 28×58, toplam boy ≈ 74. */
function Ext({ x, y, s = 1, label, pin = true, flip }: { x: number; y: number; s?: number; label?: string; pin?: boolean; flip?: boolean }) {
  const dk = '#3b3f4b';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-14 -6V-48Q-14 -58 0 -58Q14 -58 14 -48V-6Q14 0 8 0H-8Q-14 0 -14 -6Z', f: K.red },
          { d: 'M5 -57Q14 -55 14 -48V-6Q14 0 8 0H5Z', f: shade(K.red, 0.18), no: true },
          { d: rrect(-5, -67, 10, 10, 2), f: dk },
          { d: 'M-3 -66L22 -74L23 -70L1 -61Z', f: dk },
          { d: 'M2 -61H21V-57.5H2Z', f: dk },
          { d: circ([-7, -55], 3.6), f: '#f4f1ea' },
          { d: 'M-10 -48Q-10 -53 -6 -54', st: tint(K.red, 0.5), sw: 2.2 },
        ]}
      />
      {pin && (
        <g>
          <path d="M-4 -64H-11" stroke="#c9ccd2" stroke-width={2} />
          <circle cx={-14} cy={-64} r={3.8} fill="none" stroke={K.out} stroke-width={3.4} />
          <circle cx={-14} cy={-64} r={3.8} fill="none" stroke="#f2c14e" stroke-width={1.8} />
        </g>
      )}
      <path d="M-7 -57.5V-55" stroke={K.danger} stroke-width={1} />
      {label && (
        <g transform={flip ? 'scale(-1 1)' : undefined}>
          <rect x={-11} y={-44} width={22} height={20} rx={2} fill="#fbfaf7" stroke={K.out} stroke-width={1.2 / s} />
          <text x={0} y={-30.5} font-size={9} font-weight={800} text-anchor="middle" fill={K.ink}>{label}</text>
        </g>
      )}
    </g>
  );
}
/** Söndürücünün bir noktası (sahne koordinatı): lever = tutma yeri, hose = hortum çıkışı */
function extPt(x: number, y: number, s: number, which: 'lever' | 'hose' | 'pin' | 'top', flip = false): P {
  const loc: Record<string, P> = { lever: [10, -64], hose: [-4, -60], pin: [-14, -64], top: [0, -67] };
  const p = loc[which];
  return [x + p[0] * s * (flip ? -1 : 1), y + p[1] * s];
}
/** Hortum: from (söndürücü) → pts → to; to'da a yönüne bakan meme */
function Hose({ pts, a, s = 1 }: { pts: P[]; a: number; s?: number }) {
  const d = smooth(pts);
  const e = pts[pts.length - 1];
  return (
    <g>
      <path d={d} fill="none" stroke={K.out} stroke-width={6 * s} stroke-linecap="round" />
      <path d={d} fill="none" stroke="#3b3f4b" stroke-width={3.4 * s} stroke-linecap="round" />
      <g transform={`translate(${f1(e[0])} ${f1(e[1])}) rotate(${a}) scale(${s})`}>
        <OG ow={1.4 / s} sh={[{ d: 'M-4 -3.4L13 -5.4V5.4L-4 3.4Z', f: '#2a2d36' }]} />
      </g>
    </g>
  );
}
/** Toz bulutu (beyaz). from = meme ucu, yön a, uzunluk len */
function Powder({ from, a, len = 90, w = 44 }: { from: P; a: number; len?: number; w?: number }) {
  return (
    <g transform={`translate(${f1(from[0])} ${f1(from[1])}) rotate(${a})`}>
      <path d={`M0 -3L${len} ${-w / 2}Q${len + 16} 0 ${len} ${w / 2}L0 3Z`} fill="#ffffff" opacity={0.75} />
      {[0.35, 0.6, 0.85, 1].map((t, i) => (
        <circle key={i} cx={len * t} cy={(i % 2 ? -1 : 1) * w * 0.12} r={(w / 2) * t * 0.85 + 3} fill="#f4f6f8" opacity={0.85} stroke="#cfd5dc" stroke-width={1} />
      ))}
    </g>
  );
}
/** Tava (yan görünüş). x,y = taban ortası; sap sola (flip: sağa) */
function Pan({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <OG ow={1.5 / s} sh={[{ d: capsule([-24, -7], 2.6, [-58, -13], 3.4), f: '#2f3238' }, { d: 'M-25 -10H25L21 0H-21Z', f: '#4b505b' }, { d: 'M-25 -10H25V-8H-25Z', f: '#6a707c', no: true }]} />
    </g>
  );
}
/** Mutfak tezgâhı (yan görünüş). x = SOL, y = zemin; üst yüzey y-h. hob: ocak gözünün ortası (x) */
function Counter({ x, y, w, h = 84, hob }: { x: number; y: number; w: number; h?: number; hob?: number }) {
  const c = '#e9e4da';
  return (
    <g>
      <OG
        sh={[
          { d: rrect(x, y - h, w, h, 1), f: c },
          { d: rrect(x + 4, y - h + 14, w - 8, h - 20, 2), f: shade(c, 0.06), ln: true },
          { d: rrect(x - 3, y - h - 7, w + 6, 9, 2), f: '#8d8f96' },
          ...(hob !== undefined ? [{ d: rrect(hob - 34, y - h - 11, 68, 5, 1.5), f: '#2c2f36' } as Sh, { d: circ([hob, y - h + 7], 4.2), f: '#2c2f36' } as Sh, { d: circ([hob + 14, y - h + 7], 4.2), f: '#2c2f36' } as Sh] : []),
        ]}
      />
    </g>
  );
}
/** Mutfak duvarı fayansı */
function Tiles({ y1, y2 }: { y1: number; y2: number }) {
  const l: string[] = [];
  for (let yy = y1; yy <= y2; yy += 16) l.push(`M0 ${yy}H320`);
  for (let xx = 0; xx <= 320; xx += 16) l.push(`M${xx} ${y1}V${y2}`);
  return (
    <g>
      <rect x={0} y={y1} width={320} height={y2 - y1} fill="#dfe9ec" />
      <path d={l.join('')} stroke="#c3d2d7" stroke-width={1.2} />
    </g>
  );
}
/** Çöp kovası. x,y = taban ortası */
function Bin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: 'M-17 -40H17L14 0H-14Z', f: '#8e99a6' }, { d: 'M6 -40H17L14 0H5Z', f: shade('#8e99a6', 0.15), no: true }, { d: rrect(-19, -43, 38, 5, 2), f: '#6d7480' }]} />
      <path d="M-8 -32V-6M0 -32V-6M8 -32V-6" stroke={shade('#8e99a6', 0.3)} stroke-width={1.4} />
    </g>
  );
}
/** Büyük alev öbeği (birkaç Flame) */
function Blaze({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <Flame x={x - 12 * s} y={y} s={0.75 * s} />
      <Flame x={x + 13 * s} y={y} s={0.8 * s} />
      <Flame x={x} y={y} s={1.05 * s} />
    </g>
  );
}
/** Şimşek simgesi (merkez x,y; boy ≈ 2h) */
function Bolt({ x, y, h = 16, a = 0 }: { x: number; y: number; h?: number; a?: number }) {
  const d = `M${h * 0.18} ${-h}L${-h * 0.42} ${h * 0.12}H${-h * 0.02}L${-h * 0.2} ${h}L${h * 0.46} ${-h * 0.2}H${h * 0.04}L${h * 0.3} ${-h}Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <OG sh={[{ d, f: '#ffd23f' }]} />
    </g>
  );
}
/** Termometre. x,y = hazne merkezi */
function Thermo({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: capsule([0, -2], 7, [0, -50], 6), f: '#f4f1ea' }, { d: circ([0, 0], 10), f: K.danger }, { d: capsule([0, -4], 3, [0, -40], 3), f: K.danger, no: true }]} />
      <path d="M4 -16H8M4 -24H8M4 -32H8M4 -40H8" stroke={K.out} stroke-width={1.4} stroke-linecap="round" />
    </g>
  );
}
/** Köşe etiketi (ÇEK, SIK…) */
const Corner = ({ text, x = 16, y = 26 }: { text: string; x?: number; y?: number }) => <Label x={x} y={y} text={text} size={16} anchor="start" />;
/** Aşama numarası */
function Step({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill={K.ink} />
      <text x={x} y={y + 5} font-size={14} font-weight={700} fill="#fff" text-anchor="middle">{n}</text>
    </g>
  );
}
/** Kırpılmış çerçeve (TL) */
let insetN = 0;
function Inset({ x, y, w, h, children, bg = '#fff' }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; bg?: string }) {
  const id = 'yg-in-' + ++insetN;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={9} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={9} fill={bg} />
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={9} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}
/** Kesikli ok (yeşil kaçış yolu vb.) */
function DashArrow({ pts, color = K.safe, w = 4 }: { pts: P[]; color?: string; w?: number }) {
  const d = smooth(pts);
  const e = pts[pts.length - 1], p = pts[pts.length - 2];
  const a = (Math.atan2(e[1] - p[1], e[0] - p[0]) * 180) / Math.PI;
  const hl = w * 2.6 + 3;
  return (
    <g>
      <path d={d} fill="none" stroke={color} stroke-width={w} stroke-dasharray={`${w * 2} ${w * 1.6}`} stroke-linecap="round" />
      <path d={`M${hl * 0.2} 0L${-hl} ${-hl * 0.62}L${-hl} ${hl * 0.62}Z`} transform={`translate(${f1(e[0])} ${f1(e[1])}) rotate(${f1(a)})`} fill={color} stroke={K.out} stroke-width={1.2} stroke-linejoin="round" />
    </g>
  );
}
/** Duman kıvrımı (ince yükselen duman). x,y = kaynak */
function Wisp({ x, y, h = 40, s = 1, color = K.smoke, op = 0.85 }: { x: number; y: number; h?: number; s?: number; color?: string; op?: number }) {
  return (
    <g opacity={op}>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + (i % 2 ? 6 : -4) * s} cy={y - (i + 0.5) * (h / 3)} r={(6 + i * 3.5) * s} fill={i % 2 ? color : shade(color, 0.1)} />
      ))}
    </g>
  );
}
/** Yangın battaniyesi kılıfı (duvara asılı kırmızı kutu, altta iki çekme şeridi). x,y = SOL ÜST */
function BlanketPouch({ x, y, w = 46, h = 54, open }: { x: number; y: number; w?: number; h?: number; open?: boolean }) {
  return (
    <g>
      <OG
        sh={[
          { d: rrect(x, y, w, h, 4), f: K.red },
          { d: rrect(x + w * 0.62, y, w * 0.38, h, 4), f: shade(K.red, 0.15), no: true },
          { d: rrect(x + 6, y + 8, w - 12, 18, 2), f: '#fbfaf7', ln: true },
          ...(open ? [] : [{ d: rrect(x + 8, y + h - 2, 8, 16, 2), f: '#2c2f36' } as Sh, { d: rrect(x + w - 16, y + h - 2, 8, 16, 2), f: '#2c2f36' } as Sh]),
        ]}
      />
      <Flame x={x + w / 2} y={y + 24} s={0.36} />
    </g>
  );
}
/** Kuşbakışı ağaç tepesi */
function TreeTop({ x, y, r = 14, c = K.pine }: { x: number; y: number; r?: number; c?: string }) {
  return <OG sh={[{ d: circ([x, y], r), f: c }, { d: `M${x + r * 0.1} ${y + r}A${r} ${r} 0 0 0 ${x + r} ${y - r * 0.1}A${r * 0.8} ${r * 0.8} 0 0 1 ${x + r * 0.1} ${y + r}Z`, f: shade(c, 0.2), no: true }]} />;
}
/** Kuşbakışı insan (baş + omuz). a = bakış yönü */
function TopPerson({ x, y, a = 0, c = K.role.victim, s = 1, hair = K.hair.dark }: { x: number; y: number; a?: number; c?: string; s?: number; hair?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: ell([0, 0], 7, 13), f: c }, { d: capsule([2, -11], 3.2, [12, -9], 2.6), f: c }, { d: capsule([2, 11], 3.2, [-8, 12], 2.6), f: c }, { d: circ([1, 0], 6.4), f: hair }]} />
    </g>
  );
}
/** Kuşbakışı araba (ön = a yönü; a=-90 yukarı) */
function CarTop({ x, y, a = -90, color = '#d0473d', hazard, s = 1 }: { x: number; y: number; a?: number; color?: string; hazard?: boolean; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a + 90}) scale(${s})`}>
      {hazard && [[-15, -30], [15, -30], [-15, 31], [15, 31]].map(([hx, hy], i) => <circle key={i} cx={hx} cy={hy} r={9} fill={K.action} opacity={0.45} />)}
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-17, -34, 34, 68, 10), f: color },
          { d: rrect(-13, -17, 26, 10, 3), f: '#bfe3f5', ln: true },
          { d: rrect(-13, 16, 26, 8, 3), f: '#bfe3f5', ln: true },
          { d: rrect(-12, -6, 24, 21, 3), f: shade(color, 0.12), ln: true },
          ...(hazard ? [[-12, -32], [12, -32], [-12, 33], [12, 33]].map(([hx, hy]) => ({ d: circ([hx, hy], 3.2), f: '#ffb13b', ln: true }) as Sh) : []),
        ]}
      />
    </g>
  );
}
/** Duvar tipi priz (karşıdan). Merkez x,y */
function Socket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-18, -18, 36, 36, 6), f: '#f4f1ea' }, { d: circ([0, 0], 12), f: '#e3ded3', ln: true }, { d: circ([-5, 0], 2.2), f: K.ink, no: true }, { d: circ([5, 0], 2.2), f: K.ink, no: true }]} />
    </g>
  );
}
/** Sigorta kutusu (kapak açık; şalterler). x,y = SOL ÜST. down: ana şalter aşağıda */
function FuseBox({ x, y, w = 56, h = 64, down = true }: { x: number; y: number; w?: number; h?: number; down?: boolean }) {
  const sw = (cx: number, main: boolean) => {
    const top = y + 18;
    return (
      <g key={cx}>
        <rect x={cx - 5} y={top} width={10} height={26} rx={2} fill={main ? '#d63b35' : '#f4f1ea'} stroke={K.out} stroke-width={1.3} />
        <rect x={cx - 3.5} y={main && down ? top + 15 : top + 3} width={7} height={8} rx={1.5} fill={K.ink} />
      </g>
    );
  };
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 3), f: '#d6d8dc' }, { d: rrect(x + 5, y + 12, w - 10, h - 20, 2), f: '#eef0f2', ln: true }]} />
      <Bolt x={x + w / 2} y={y + 6} h={4.5} />
      {[x + 14, x + 28, x + 42].map((cx, i) => sw(cx, i === 0))}
      {down && <Arrow from={[x + 14, y + h - 4]} to={[x + 14, y + h + 16]} w={4} />}
    </g>
  );
}
/** Elektrikli ısıtıcı (yan görünüş, yağlı radyatör tipi). x,y = taban ortası */
function Heater({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const fins = [-24, -12, 0, 12, 24];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[...fins.map((fx) => ({ d: rrect(fx - 6, -60, 12, 54, 5), f: '#e8e6e0' }) as Sh), { d: rrect(-32, -8, 64, 5, 2), f: '#a3adb8' }, { d: capsule([-28, -3], 2.6, [-28, 2], 2.6), f: '#3b3f4b' }, { d: capsule([28, -3], 2.6, [28, 2], 2.6), f: '#3b3f4b' }]} />
    </g>
  );
}
/** Duvardaki yangın alarm butonu. x,y = SOL ÜST */
function AlarmButton({ x, y, s = 1, pressed }: { x: number; y: number; s?: number; pressed?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(0, 0, 30, 30, 4), f: K.red }, { d: rrect(5, 5, 20, 20, 3), f: '#fbfaf7', ln: true }, { d: circ([15, 15], 6), f: pressed ? '#b02a25' : K.red, ln: true }]} />
      <Waves x={32} y={6} n={2} a={-40} r={5} color={K.danger} />
    </g>
  );
}
/** Duman dedektörü (alttan görünüş). Merkez x,y */
function Detector({ x, y, r = 44 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#f7f6f2' }, { d: circ([x, y], r * 0.72), f: '#ecebe6', ln: true }, { d: circ([x, y], r * 0.3), f: '#dcdad3', ln: true }]} />
      <g stroke="#c3c0b8" stroke-width={2} stroke-linecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const c = Math.cos((a * Math.PI) / 180), sn = Math.sin((a * Math.PI) / 180);
          return <path key={a} d={`M${f1(x + c * r * 0.4)} ${f1(y + sn * r * 0.4)}L${f1(x + c * r * 0.62)} ${f1(y + sn * r * 0.62)}`} />;
        })}
      </g>
    </g>
  );
}
/** Mavi su akışı (bardaktan) from→to */
function Pour({ from, to, w = 7 }: { from: P; to: P; w?: number }) {
  const m: P = [from[0] + (to[0] - from[0]) * 0.25, from[1] + (to[1] - from[1]) * 0.6];
  return <path d={`M${from[0]} ${from[1]}Q${m[0]} ${m[1]} ${to[0]} ${to[1]}`} fill="none" stroke={K.water} stroke-width={w} stroke-linecap="round" opacity={0.9} />;
}
/** Bardak (eğik). x,y = ağız ortası, a = eğim */
function Glass({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: 'M-10 0H10L8 28H-8Z', f: '#e3f2fb' }, { d: 'M-9 8H9L8 28H-8Z', f: K.waterLight, no: true }]} />
    </g>
  );
}
/** Ölçü çizgisi + etiket */
function Measure({ x1, x2, y, text }: { x1: number; x2: number; y: number; text: string }) {
  return (
    <g>
      <path d={`M${x1} ${y - 6}V${y + 6}M${x2} ${y - 6}V${y + 6}M${x1} ${y}H${x2}`} stroke={K.out} stroke-width={2.4} stroke-linecap="round" stroke-dasharray="0" />
      <Label x={(x1 + x2) / 2} y={y} text={text} size={14} />
    </g>
  );
}
/** Konum işareti (damla). x,y = sivri uç */
function Pin({ x, y, s = 1, color = K.safe }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: 'M0 0C-6 -10 -14 -18 -14 -28A14 14 0 0 1 14 -28C14 -18 6 -10 0 0Z', f: color }, { d: circ([0, -28], 5.5), f: '#fff', ln: true }]} />
    </g>
  );
}
/** Yıldız. Merkez x,y */
function Star({ x, y, r = 14, color = K.safe }: { x: number; y: number; r?: number; color?: string }) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`);
  }
  return <OG sh={[{ d: 'M' + pts.join('L') + 'Z', f: color }]} />;
}
/** Kırmızı-mavi tepe lambası (araç üstü). x,y = taban ortası */
function LightBar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-14, -6, 14, 6, 2), f: K.water }, { d: rrect(0, -6, 14, 6, 2), f: K.danger }]} />
    </g>
  );
}
/** Görevli kasketi (başın üstüne) */
function Cap({ r, c = '#2f5d3a' }: { r: ReturnType<typeof rig>; c?: string }) {
  const [hx, hy] = r.head;
  const R = r.headR;
  const dir = r.flip ? -1 : 1;
  return <OG sh={[{ d: `M${hx - R * 1.02} ${hy - R * 0.35}Q${hx - R} ${hy - R * 1.25} ${hx} ${hy - R * 1.2}Q${hx + R} ${hy - R * 1.25} ${hx + R * 1.02} ${hy - R * 0.35}Z`, f: c }, { d: `M${hx + dir * R * 0.4} ${hy - R * 0.4}L${hx + dir * R * 1.55} ${hy - R * 0.25}L${hx + dir * R * 0.9} ${hy - R * 0.55}Z`, f: shade(c, 0.3) }]} />;
}
/** Yanak is lekeleri */
function Soot({ r }: { r: ReturnType<typeof rig> }) {
  const [hx, hy] = r.head;
  const R = r.headR;
  const d = r.flip ? -1 : 1;
  return (
    <g fill="#3a3534" opacity={0.75}>
      <ellipse cx={hx + d * R * 0.45} cy={hy + R * 0.35} rx={R * 0.28} ry={R * 0.16} />
      <ellipse cx={hx + d * R * 0.1} cy={hy - R * 0.45} rx={R * 0.22} ry={R * 0.12} />
      <ellipse cx={hx + d * R * 0.75} cy={hy + R * 0.05} rx={R * 0.12} ry={R * 0.1} />
    </g>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

const KITCHEN_WALL = '#eef1ec';

/* ─── Oyuncular (rehber başına sabit; rehber içinde değişmez) ─── */
type Cast = Pick<PersonProps, 'who' | 'role' | 'skin' | 'hair' | 'hairC' | 'mustache' | 'bottom' | 'bottomC' | 'top'>;
/** yangin: binadan kaçan kişi */
const YNG: Cast = { who: 'woman', role: 'victim', hair: 'ponytail', hairC: K.hair.dark, skin: 1 };
/** orman-yangini: kaçan kişi */
const ORM: Cast = { who: 'man', role: 'victim', hair: 'short', hairC: K.hair.black, skin: 2 };
/** yangin-sondurucu: söndürücüyü kullanan kişi */
const SND: Cast = { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.dark, skin: 1 };
/** yangin-yag: mutfaktaki kişi */
const YAG: Cast = { who: 'man', role: 'helper', hair: 'short', hairC: K.hair.black, skin: 2, mustache: true };
/** yangin-elektrik */
const ELK: Cast = { who: 'woman', role: 'bystander2', hair: 'long', hairC: K.hair.dark, skin: 1 };
/** yangin-arac: sürücü ve çocuk */
const ARC = {
  driver: { who: 'man', role: 'bystander', hair: 'short', hairC: K.hair.brown, skin: 1 } as Cast,
  child: { who: 'boy', role: 'bystander2', hair: 'short', hairC: K.hair.dark, skin: 1 } as Cast,
};
/** yangin-yuksek-bina: dairedeki kişi */
const BNA: Cast = { who: 'man', role: 'victim', hair: 'short', hairC: K.hair.brown, skin: 0 };
/** yangin-duman-solunmasi */
const DMN = {
  victim: { who: 'man', role: 'victim', hair: 'short', hairC: K.hair.brown, skin: 1 } as Cast,
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2 } as Cast,
};
/** yangin-giysi-tutustu: giysisi tutuşan kişi (5. adımda yardım eden de odur) ve diğer yaralı */
const GYS = {
  self: { who: 'woman', role: 'victim', hair: 'long', hairC: K.hair.brown, skin: 1 } as Cast,
  other: { who: 'man', role: 'bystander3', hair: 'short', hairC: K.hair.dark, skin: 2 } as Cast,
};
/** yangin-kacis-plani: aile babası (dedektörü deneyen, yoklama yapan) */
const PLN: Cast = { who: 'man', role: 'bystander', hair: 'short', hairC: K.hair.dark, skin: 1, mustache: true };

/** Kapıya elin TERSİYLE dokunma (yakın plan) */
function kapiDokun(c: Cast) {
  return () => {
    const door = '#a8724a';
    const sk = K.skin[c.skin ?? 1];
    const sleeve = K.role[c.role ?? 'victim'];
    const W: P = [238, 170]; // bilek
    const s2 = 1.9;
    const L = (x: number, y: number): P => [W[0] + x * s2, W[1] + y * s2];
    const pth = (pts: P[]) => 'M' + pts.map((q) => `${f1(q[0])} ${f1(q[1])}`).join('L');
    const handD = smooth([L(10, 8), L(10, -18), L(10.5, -38), L(10, -56), L(8.5, -70), L(3, -74), L(-1.5, -66), L(-4, -48), L(-11, -34), L(-16, -18), L(-14, -2), L(-10, 8)], true, 0.7);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#e2dccf" />
        <path d="M0 214H200L320 196V240H0Z" fill={K.floor} />
        <OG sh={[
          { d: 'M196 -10L330 26V196L196 216Z', f: door },
          { d: 'M196 -10L206 -7V215L196 216Z', f: '#efe9df' },
          { d: 'M222 22L300 44V108L222 98Z', f: shade(door, 0.1), ln: true },
          { d: 'M222 120L300 124V182L222 196Z', f: shade(door, 0.1), ln: true },
        ]} />
        <path d="M206 213L330 194" stroke="#2a2523" stroke-width={5} />
        <Wisp x={240} y={206} h={34} s={0.85} />
        <Wisp x={286} y={200} h={40} s={0.95} />
        <Waves x={290} y={120} a={0} n={3} r={7} color={K.danger} />
        <OG sh={[
          { d: capsule(L(-2, 4), 11.5, L(-80, 50), 13.5), f: sk },
          { d: capsule(L(-46, 30), 15, L(-110, 72), 16), f: sleeve },
        ]} />
        <path d={pth([L(-44, 22), L(-52, 40)])} stroke={shade(sleeve, 0.3)} stroke-width={1.4} />
        <OG sh={[
          { d: handD, f: sk },
          { d: capsule(L(-10, -10), 5.2, L(-20, -32), 4.2), f: sk },
          { d: ell(L(7.5, -66), 2.2 * s2, 3.4 * s2), f: tint(sk, 0.45), no: true },
        ]} />
        <g stroke={shade(sk, 0.32)} stroke-width={1.3} fill="none" stroke-linecap="round">
          <path d={pth([L(-2, -44), L(2, -68)])} />
          <path d={pth([L(3, -42), L(6, -60)])} />
          <path d={pth([L(9, -38), L(5, -36)])} />
          <path d={pth([L(9, -54), L(5, -53)])} />
        </g>
        <path d={pth([L(12.5, -6), L(12.5, -62)])} stroke={K.action} stroke-width={4} stroke-linecap="round" opacity={0.9} />
        <Thermo x={58} y={90} s={1.15} />
      </Scene2>
    );
  };
}

/** Kapı altına ıslak havlu bastırma (oda içi, yandan; iki el havluda) */
function odaHavlu(c: Cast) {
  return () => {
    const towel: P = [62, 196];
    const p: PersonProps = {
      ...c, x: 146, y: 222, s: 1.1, flip: true,
      pose: { ...POSE.kneel, spine: -40, chest: -30, head: -40, legB: [96, 182], legF: [84, 180], armB: { to: [towel[0] + 4, towel[1] - 3] }, armF: { to: [towel[0] + 22, towel[1] - 4] }, handB: 'flat', handF: 'flat', face: 'worried' },
    };
    return (
      <Scene2 bg="indoor" wall="#e6ddd0">
        <Window x={214} y={46} w={78} h={64} />
        <Door x={18} y={200} w={62} h={118} />
        <Wisp x={84} y={196} h={30} s={0.5} op={0.45} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Cloth x={towel[0]} y={towel[1]} w={88} h={16} wet color="#cfe6f2" />
        <Person {...p} only={['armF']} />
        <Drop x={34} y={216} s={0.7} />
        <Drop x={70} y={220} s={0.6} />
        <Drop x={98} y={214} s={0.55} />
      </Scene2>
    );
  };
}

/** Giysisi tutuşan kişi yerde yuvarlanıyor (oyuncuya göre) */
function yuvarlan(c: Cast, label?: string) {
    // Yerde yan dönmüş, iki eli yüzünü kapatıyor; ileri geri yuvarlanıyor.
    const roll0: PersonProps = {
      ...c, x: 172, y: 214, s: 1.15, shadow: false,
      pose: { view: 'front', spine: 181, chest: 182, head: 196, legB: [1, 1], legF: [-1, 0], footB: -90, footF: -90, armB: [160, 160], armF: [160, 160], face: 'closed', behind: ['armB'] },
    };
    const r0 = rig(roll0);
    const fc = r0.mouth;
    const roll: PersonProps = { ...roll0, pose: { ...roll0.pose, armB: { to: [fc[0] + 2, fc[1] - 3] }, armF: { to: [fc[0] - 1, fc[1] + 2] }, handB: 'flat', handF: 'flat' } };
    const ro = rig(roll);
    const cx = ro.hip[0] - 10, cy = ro.hip[1] - 6;
    return (
      <Scene2 bg="indoor">
        <ellipse cx={ro.hip[0] - 10} cy={218} rx={110} ry={6} fill="#000" opacity={0.08} />
        <Arrow from={[cx - 40, cy + 10]} to={[cx + 40, cy - 2]} bend={-0.75} w={6} />
        <Person {...roll} />
        <Flame x={ro.hip[0] + 34} y={ro.hip[1] - 10} s={0.34} />
        <Arrow from={[cx + 40, cy + 8]} to={[cx - 40, cy + 16]} bend={-0.5} w={6} />
        {label && <Corner text={label} />}
      </Scene2>
    );
  }

export const SCENES: Record<string, ArtFn> = {
  /* ─────────── yangın: binadan kaçış ─────────── */
  'yangin-emekle': () => (
    <Scene2 bg="indoor" wall="#d6d0c4">
      <Door x={254} y={200} />
      <Blaze x={34} y={206} s={1.1} />
      <rect x={0} y={150} width={320} height={52} fill="#ffffff" opacity={0.35} />
      <path d="M0 150H320" stroke="#ffffff" stroke-width={2} stroke-dasharray="6 6" opacity={0.9} />
      <Smoke x={0} y={0} w={320} h={132} color="#5f656e" op={0.95} />
      <Person {...YNG} x={124} y={224} s={1.05} pose={{ ...POSE.crawl, face: 'worried' }} />
      <Arrow from={[204, 176]} to={[246, 176]} w={7} />
    </Scene2>
  ),

  'yangin-kapi-dokun': kapiDokun(YNG),
  'yangin-bina-kapi-dokun': kapiDokun(BNA),

  'yangin-kapi-kapat': () => {
    const dx = 52, dw = 64, dh = 120, gy = 200;
    const leafEnd = dx + dw * 0.78;
    const handle: P = [leafEnd - 8, gy - dh * 0.5];
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(dx - 6, gy - dh - 6, dw + 12, dh + 6, 2), f: '#efe9df' }, { d: rrect(dx, gy - dh, dw, dh, 1), f: '#3a2a24' }]} />
        <rect x={dx} y={gy - dh} width={dw} height={dh} fill={K.fire} opacity={0.3} />
        <Flame x={dx + dw - 8} y={gy} s={0.9} />
        <Smoke x={dx} y={gy - dh} w={dw} h={30} color="#5b6068" />
        <OG sh={[{ d: `M${dx} ${gy - dh}L${leafEnd} ${gy - dh + 4}L${leafEnd} ${gy + 2}L${dx} ${gy}Z`, f: '#a8724a' }, { d: rrect(dx + 8, gy - dh + 14, leafEnd - dx - 18, 38, 2), f: shade('#a8724a', 0.1), ln: true }, { d: rrect(dx + 8, gy - 56, leafEnd - dx - 18, 44, 2), f: shade('#a8724a', 0.1), ln: true }]} />
        <Wisp x={leafEnd + 6} y={gy - dh + 20} h={40} s={0.7} op={0.6} />
        <Person {...YNG} x={150} y={224} s={1.05} pose={{ ...POSE.walk, armF: { to: handle }, handF: 'fist', face: 'worried' }} />
        <OG sh={[{ d: circ(handle, 3.4), f: '#e2c35a' }]} />
        <Arrow from={[150, 50]} to={[84, 46]} bend={0.35} w={6} />
      </Scene2>
    );
  },

  'yangin-oda-havlu': odaHavlu(YNG),
  'yangin-bina-oda-havlu': odaHavlu(BNA),

  // tek büyük sahne: yerde yatmış, eller yüzde, ileri geri yuvarlanıyor (üç kareli şerit küçük kalıyordu)
  'yangin-dur-yat-yuvarlan': () => yuvarlan(YNG),

  /* ─────────── orman yangını ─────────── */
  'yangin-orman-ruzgar': () => {
    const front = (t: number): P => [118 + Math.sin(t * 5) * 8 + t * 14, -6 + t * 146];
    const fp = Array.from({ length: 11 }, (_, i) => front(i / 10));
    const burnt = `M0 0${fp.map((p) => `L${f1(p[0])} ${f1(p[1])}`).join('')}Q${fp[10][0] - 10} ${fp[10][1] + 24} ${fp[10][0] - 50} ${fp[10][1] + 28}Q20 ${fp[10][1] + 34} 0 ${fp[10][1] + 30}Z`;
    const trees: [number, number, number][] = [];
    const rnd = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
    for (let i = 0; i < 70; i++) trees.push([8 + rnd(i) * 310, 8 + rnd(i + 500) * 228, 10 + rnd(i + 900) * 6]);
    const person: P = [204, 120];
    const ok = (x: number, y: number) => {
      if (Math.hypot(x - person[0], y - person[1]) < 40) return false;
      if (y < 160 && x < front(Math.max(0, y + 6) / 146)[0] + 16) return false;
      if (y >= 140 && y < 190 && x < 110) return false;
      if (x > 80 && x < 200 && y > 150) return false;
      return true;
    };
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#8fbf62" />
        <path d={burnt} fill="#3d3a38" />
        {trees.filter(([tx, ty]) => ok(tx, ty)).map(([tx, ty, r], i) => <TreeTop key={i} x={tx} y={ty} r={r} c={i % 2 ? K.pine : '#3f8f4d'} />)}
        {Array.from({ length: 8 }, (_, i) => {
          const p = front(i / 7);
          return <Flame key={i} x={p[0] + 4} y={p[1] + 12} s={0.6} />;
        })}
        {[30, 80, 130].map((wy) => <Arrow key={wy} from={[14, wy]} to={[66, wy]} w={4} color="#e9f3fb" />)}
        <TopPerson x={person[0]} y={person[1]} a={150} c={K.role.victim} s={1.3} hair={K.hair.black} />
        <DashArrow pts={[[person[0] + 14, person[1] - 6], [262, 100], [306, 96]]} color={K.danger} w={4} />
        <Bad x={270} y={80} r={11} />
        <Arrow from={[194, 140]} to={[96, 206]} bend={-0.18} w={7} color={K.safe} />
        <Ok x={150} y={208} r={11} />
      </Scene2>
    );
  },

  'yangin-orman-yokus': () => {
    const slope = (x: number) => 216 - (x - 60) * 0.62;
    const sy = (x: number) => (x < 60 ? 216 : Math.max(60, slope(x)));
    const down: PersonProps = { ...ORM, x: 56, y: 224, s: 0.86, flip: true, pose: { ...POSE.run, face: 'worried' } };
    const n = (x: number, d: number): P => [x + d * 0.53, slope(x) + d * 0.85];
    return (
      <Scene2 bg="outdoor" gy={216} ground="dirt">
        <path d={`M60 216L320 ${f1(slope(320))}V240H60Z`} fill="#7b9c4a" stroke={K.out} stroke-width={2} />
        {[214, 240, 276, 304].map((tx) => <Tree key={tx} x={tx} y={sy(tx) + 2} kind="pine" s={0.42} />)}
        <path d={`M96 ${f1(slope(96))}L204 ${f1(slope(204))}L${n(204, 14)[0]} ${n(204, 14)[1]}L${n(96, 14)[0]} ${n(96, 14)[1]}Z`} fill="#3d3a38" />
        {[108, 128, 148, 168, 190].map((fx, i) => <Flame key={fx} x={fx} y={slope(fx) + 4} s={0.5 + i * 0.13} />)}
        <Smoke x={120} y={10} w={150} h={50} kind="cloud" op={0.75} />
        <Arrow from={[150, slope(150) - 56]} to={[236, slope(236) - 60]} w={7} color={K.danger} />
        <Bad x={252} y={slope(236) - 66} r={13} />
        <Person {...down} />
        <Arrow from={[110, 70]} to={[40, 70]} w={6} color={K.safe} />
        <Ok x={132} y={70} r={13} />
      </Scene2>
    );
  },

  'yangin-orman-tahliye': () => {
    const man: PersonProps = { ...ORM, x: 70, y: 226, s: 0.96, flip: true, pose: { ...POSE.walk, face: 'worried' } };
    const officer: PersonProps = { x: 250, y: 228, s: 0.9, flip: true, who: 'man', role: 'bystander3', top: '#4e6b3c', bottomC: '#3e5232', skin: 1, pose: { ...POSE.standSide, armF: [-8, -4], handF: 'flat', face: 'speak' } };
    const pack = (c: string, k = 1) => (r: ReturnType<typeof rig>) => <Backpack x={r.back[0] + (r.flip ? 8 : -8) * r.s} y={r.neck[1] + 6 * r.s} s={r.s * k} color={c} flip={r.flip} />;
    return (
      <Scene2 bg="outdoor" ground="pavement">
        {/* uzak tepe: yangın ve duman yalnız burada */}
        <Smoke x={226} y={30} w={100} h={36} kind="cloud" color="#8a8f96" op={0.8} />
        <Smoke x={250} y={10} w={80} h={28} kind="cloud" color="#9aa0a6" op={0.7} />
        <path d="M226 176Q262 120 298 94Q316 88 330 92V176Z" fill="#b7c9a6" stroke={K.out} stroke-width={1.1} opacity={0.85} />
        <Flame x={290} y={104} s={0.17} />
        <Flame x={304} y={96} s={0.2} />
        <Flame x={318} y={96} s={0.16} />
        <Car x={138} y={212} s={0.95} color="#3f6fb5" />
        <g>
          <Car x={290} y={206} s={0.9} color="#3d5a35" />
          <LightBar x={290} y={160} s={0.9} />
          <rect x={258} y={180} width={52} height={7} fill="#f4f1ea" stroke={K.out} stroke-width={1.2} />
        </g>
        <Person {...man} back={pack('#c0603e')} />
        <Person {...officer} over={(r) => <Cap r={r} />} />
        <Arrow from={[204, 92]} to={[124, 92]} w={6} />
      </Scene2>
    );
  },

  'yangin-orman-arac': () => {
    // Kesit: araç kapısı kaldırılmış gibi; kişi ön koltuğun önünde, tabana eğilmiş, üstü battaniyeyle örtülü.
    const s = 3.2, cx = 168, cy = 250;
    const X = (u: number) => cx + u * s, Y = (v: number) => cy + v * s;
    const floor = Y(-17);
    const crouch: PersonProps = { ...ORM, x: X(-8), y: floor, s: 0.95, shadow: false, pose: { ...POSE.kneel, spine: -12, chest: 8, head: 50, legB: [100, 182], legF: [94, 180], armB: { floor: 30 }, armF: { floor: 36 }, face: 'closed' } };
    const cr = rig(crouch);
    const bl = '#c1554b';
    const R0 = cr.headR;
    const blanket = smooth([[cr.hip[0] - 26, floor - 1], [cr.hip[0] - 24, cr.hip[1] - 12], [cr.back[0] - 4, cr.back[1] - 14], [cr.head[0] - R0 * 0.3, cr.head[1] - R0 * 1.25], [cr.head[0] + R0 * 0.9, cr.head[1] - R0 * 0.55], [cr.chest[0] + 6, cr.chest[1] + 12], [cr.chest[0] - 4, floor - 1]], false, 0.75) + 'Z';
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={200}>
        <rect width={320} height={200} fill="#f2b37a" opacity={0.35} />
        <Smoke x={-10} y={10} w={180} h={60} kind="cloud" color="#7f858c" op={0.85} />
        <Flame x={14} y={204} s={0.7} />
        <Flame x={300} y={204} s={0.55} />
        <Car x={cx} y={cy} s={s} color="#e0a43a" />
        <path d={`M${X(-31)} ${Y(-35)}L${X(-20)} ${Y(-48)}H${X(17)}Q${X(21)} ${Y(-48)} ${X(24)} ${Y(-45)}L${X(33)} ${Y(-35)}L${X(36)} ${floor}H${X(-34)}Z`} fill="#efe7da" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
        {/* koltuk (arkada) ve torpido (önde) */}
        <OG sh={[{ d: rrect(X(-34), Y(-26), 13 * s, 9 * s, 4), f: '#6d5a50' }, { d: `M${X(-31)} ${Y(-26)}L${X(-25)} ${Y(-47)}L${X(-20)} ${Y(-46)}L${X(-22)} ${Y(-26)}Z`, f: '#6d5a50' }, { d: `M${X(25)} ${Y(-35)}L${X(36)} ${Y(-32)}L${X(36)} ${Y(-21)}L${X(23)} ${Y(-26)}Z`, f: '#4a4f5a' }]} />
        <path d={`M${X(-31)} ${Y(-35)}L${X(-20)} ${Y(-48)}H${X(17)}Q${X(21)} ${Y(-48)} ${X(24)} ${Y(-45)}L${X(33)} ${Y(-35)}Z`} fill="#bfe3f5" opacity={0.4} />
        <path d={`M${X(-31)} ${Y(-35)}H${X(33)}`} stroke={K.out} stroke-width={2} />
        <Person {...crouch} />
        <path d={blanket} fill={bl} stroke={K.out} stroke-width={2} stroke-linejoin="round" />
        <path d={`M${f1(cr.back[0] - 8)} ${f1(cr.back[1] - 8)}Q${f1(cr.back[0] - 14)} ${f1(floor - 24)} ${f1(cr.back[0] - 18)} ${f1(floor - 3)}`} fill="none" stroke={shade(bl, 0.25)} stroke-width={2.4} />
        <path d={`M${X(-34)} ${floor}H${X(36)}`} stroke={K.out} stroke-width={2.4} />
        {/* direksiyon: aracın önü sağda */}
        <path d={`M${X(20)} ${Y(-27)}L${X(14)} ${Y(-41)}`} stroke={K.out} stroke-width={5} stroke-linecap="round" />
        <ellipse cx={X(14)} cy={Y(-41)} rx={4} ry={11} transform={`rotate(-20 ${X(14)} ${Y(-41)})`} fill="none" stroke={K.out} stroke-width={4} />
      </Scene2>
    );
  },

  'yangin-orman-yanmis-alan': () => {
    const p0: PersonProps = { x: 150, y: 222, s: 1.1, who: 'man', role: 'victim', skin: 2, hairC: K.hair.black, pose: { spine: 2, chest: 4, head: 14, legB: [178, 178], legF: [181, 181], footB: -90, footF: -90, armB: [-2, -2], armF: [-2, -2], face: 'closed' } };
    const r0 = rig(p0);
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armB: { to: [r0.head[0] + 6, r0.head[1] - 8], bend: 1 }, armF: { to: [r0.head[0] + 8, r0.head[1] - 4], bend: 1 }, handB: 'flat', handF: 'flat' } };
    const stump = (x: number, h: number) => `M${x - 4} 198L${x - 3} ${198 - h}L${x - 9} ${190 - h}L${x - 7} ${188 - h}L${x - 1} ${194 - h}L${x + 1} ${186 - h - 6}L${x + 3} ${198 - h}L${x + 4} 198Z`;
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={196}>
        <rect x={0} y={196} width={250} height={44} fill="#3b3734" />
        <path d="M0 196H250" stroke="#2a2725" stroke-width={3} />
        {[[20, 40], [62, 28], [228, 34]].map(([sx, h], i) => <OG key={i} sh={[{ d: stump(sx, h), f: '#2a2523' }]} />)}
        <rect x={250} y={190} width={70} height={50} fill={K.grass} />
        <Tree x={278} y={194} kind="pine" s={0.62} />
        <Tree x={306} y={196} kind="leaf" s={0.5} />
        <Smoke x={200} y={30} w={130} h={70} kind="cloud" op={0.85} />
        <Smoke x={250} y={84} w={80} h={50} kind="cloud" op={0.7} />
        <Person {...p} />
        <Ok x={150} y={150} r={13} />
      </Scene2>
    );
  },

  /* ─────────── söndürücü kullanma ─────────── */
  'yangin-tup-cikis-arkada': () => {
    const pr: PersonProps = { ...SND, x: 132, y: 224, s: 0.98, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(pr);
    const ex = r0.hip[0] + 6, es = 0.72;
    const lev: P = [r0.hip[0] + 14, r0.hip[1] + 2];
    const ey = lev[1] + 64 * es;
    const noz: P = [r0.shoulderF[0] + 34, r0.shoulderF[1] + 40];
    const p: PersonProps = { ...pr, pose: { ...pr.pose, armF: { to: lev, bend: 1 }, armB: { to: noz }, handF: 'fist', handB: 'fist' } };
    return (
      <Scene2 bg="indoor" wall={KITCHEN_WALL}>
        <Door x={14} y={200} w={56} open />
        <Arrow from={[96, 62]} to={[30, 62]} w={8} color={K.safe} />
        <Person {...p} mid={() => (
          <g>
            <Ext x={ex} y={ey} s={es} />
            <Hose pts={[extPt(ex, ey, es, 'hose'), [ex - 8, ey - 12], [noz[0] - 10, noz[1] + 8], noz]} a={20} s={0.8} />
          </g>
        )} />
        <Bin x={270} y={222} s={0.9} />
        <Flame x={270} y={186} s={0.9} />
        <Measure x1={176} x2={262} y={234} text="2 m" />
      </Scene2>
    );
  },

  'yangin-tup-pim': () => {
    const s = 2.6, ex = 150, ey = 300;
    const pin = extPt(ex, ey, s, 'pin');
    const lv = extPt(ex, ey, s, 'lever');
    const hb0 = { x: 0, y: 0, a: -100, s: 1.05, pose: 'fist' as const, side: 'R' as const };
    const g0 = handPoint(hb0, 'grip');
    const hb = { ...hb0, x: lv[0] + 6 - g0[0], y: lv[1] + 4 - g0[1] };
    const hp = { x: pin[0] - 6, y: pin[1] + 62, a: -8, s: 1.0, pose: 'pinch' as const, side: 'L' as const };
    const pp = handPoint(hp, 'pinch');
    return (
      <Scene2 bg="closeup">
        <Ext x={ex} y={ey} s={s} pin={false} />
        <Hose pts={[extPt(ex, ey, s, 'hose'), [ex - 10, ey - 90], [ex - 40, ey - 110], [ex - 70, ey - 120]]} a={180} s={1.6} />
        <Hand {...hb} arm={200} sleeve={K.role.helper} skin={1} />
        <path d={`M${pin[0] + 22} ${pin[1]}H${pp[0]}`} stroke="#c9ccd2" stroke-width={5} stroke-linecap="round" />
        <circle cx={pp[0] - 6} cy={pp[1]} r={10} fill="none" stroke={K.out} stroke-width={6} />
        <circle cx={pp[0] - 6} cy={pp[1]} r={10} fill="none" stroke="#f2c14e" stroke-width={3.4} />
        <Hand {...hp} arm={220} sleeve={K.role.helper} skin={1} />
        <Arrow from={[pp[0] - 24, pp[1] - 30]} to={[pp[0] - 76, pp[1] - 30]} w={7} />
        <Corner text="ÇEK" />
      </Scene2>
    );
  },

  'yangin-tup-dogrult': () => {
    const pr: PersonProps = { ...SND, x: 92, y: 224, s: 0.98, pose: { ...POSE.standSide, spine: -84, face: 'neutral' } };
    const r0 = rig(pr);
    const ex = r0.hip[0] + 4, es = 0.74;
    const lev: P = [r0.hip[0] + 12, r0.hip[1] - 6];
    const ey = lev[1] + 64 * es;
    const noz: P = [r0.shoulderF[0] + 44, r0.shoulderF[1] + 34];
    const base: P = [252, 206];
    const p: PersonProps = { ...pr, pose: { ...pr.pose, armF: { to: lev, bend: 1 }, armB: { to: noz }, handF: 'fist', handB: 'fist' } };
    const a = (Math.atan2(base[1] - noz[1], base[0] - noz[0]) * 180) / Math.PI;
    return (
      <Scene2 bg="indoor" wall={KITCHEN_WALL}>
        <Bin x={252} y={222} s={1} />
        <Blaze x={252} y={186} s={1.15} />
        <Person {...p} mid={() => (
          <g>
            <Ext x={ex} y={ey} s={es} />
            <Hose pts={[extPt(ex, ey, es, 'hose'), [ex - 8, ey - 10], [noz[0] - 12, noz[1] + 10], noz]} a={a} s={0.8} />
          </g>
        )} />
        <path d={`M${noz[0] + 14} ${noz[1] + 4}L${base[0] - 22} ${base[1] - 4}`} stroke={K.danger} stroke-width={0} />
        <path d={`M${noz[0] + 12} ${noz[1] - 4}L${236} ${110}`} stroke={K.danger} stroke-width={3} stroke-dasharray="6 5" stroke-linecap="round" />
        <Bad x={236} y={104} r={12} />
        <DashArrow pts={[[noz[0] + 12, noz[1] + 4], [base[0] - 24, base[1] - 10]]} color={K.action} w={4} />
        <Corner text="DOĞRULT" />
      </Scene2>
    );
  },

  'yangin-tup-sik': () => {
    const s = 2.5, ex = 112, ey = 330;
    const lev = extPt(ex, ey, s, 'lever');
    const h0 = { x: 0, y: 0, a: 196, s: 1.2, pose: 'fist' as const, side: 'R' as const };
    const g0 = handPoint(h0, 'grip');
    const h = { ...h0, x: lev[0] + 4 - g0[0], y: lev[1] - 6 - g0[1] };
    const noz: P = [236, 170];
    return (
      <Scene2 bg="closeup">
        <Ext x={ex} y={ey} s={s} pin={false} />
        <Hose pts={[extPt(ex, ey, s, 'hose'), [ex - 30, 200], [ex - 10, 230], [180, 220], [noz[0] - 18, noz[1] + 14], noz]} a={-30} s={1.6} />
        <Powder from={[noz[0] + 20, noz[1] - 11]} a={-30} len={70} w={50} />
        <Hand {...h} arm={160} sleeve={K.role.helper} skin={1} />
        <Arrow from={[lev[0] - 50, lev[1] - 86]} to={[lev[0] - 50, lev[1] - 40]} w={7} />
        <Corner text="SIK" />
      </Scene2>
    );
  },

  'yangin-tup-supur': () => {
    const pr: PersonProps = { ...SND, x: 96, y: 226, s: 0.98, pose: { ...POSE.standSide, spine: -80, chest: -78, face: 'neutral' } };
    const r0 = rig(pr);
    const ex = r0.hip[0] + 6, es = 0.74;
    const lev: P = [r0.hip[0] + 13, r0.hip[1] - 6];
    const ey = lev[1] + 64 * es;
    const noz: P = [r0.shoulderF[0] + 46, r0.shoulderF[1] + 38];
    const p: PersonProps = { ...pr, pose: { ...pr.pose, armF: { to: lev, bend: 1 }, armB: { to: noz }, handF: 'fist', handB: 'fist' } };
    return (
      <Scene2 bg="indoor" wall={KITCHEN_WALL}>
        <Bin x={256} y={222} s={1} />
        <Flame x={244} y={182} s={0.45} />
        <Flame x={266} y={182} s={0.38} />
        <Powder from={[noz[0] + 12, noz[1] + 2]} a={20} len={86} w={40} />
        <Person {...p} mid={() => (
          <g>
            <Ext x={ex} y={ey} s={es} />
            <Hose pts={[extPt(ex, ey, es, 'hose'), [ex - 8, ey - 10], [noz[0] - 12, noz[1] + 10], noz]} a={20} s={0.8} />
          </g>
        )} />
        <Arrow from={[256, 236]} to={[204, 214]} bend={-0.22} w={5} />
        <Arrow from={[256, 236]} to={[308, 214]} bend={0.22} w={5} />
        <Corner text="SÜPÜR" />
      </Scene2>
    );
  },

  /* ─────────── yağ yangını ─────────── */
  'yangin-yag-su-yasak': () => {
    const pan: P = [214, 112];
    const p: PersonProps = { ...YAG, x: 92, y: 224, s: 0.95, pose: { ...POSE.standSide, armF: { to: [168, 92] }, armB: [80, 70], handF: 'fist', face: 'worried' } };
    return (
      <Scene2 bg="indoor" wall={KITCHEN_WALL}>
        <Tiles y1={40} y2={116} />
        <Counter x={150} y={200} w={170} h={84} hob={214} />
        <Pan x={pan[0]} y={pan[1]} s={1} flip />
        <g opacity={0.95}>
          <circle cx={214} cy={60} r={52} fill={K.fireRed} />
          <circle cx={190} cy={40} r={30} fill={K.fireRed} />
          <circle cx={244} cy={36} r={32} fill={K.fireRed} />
          <circle cx={214} cy={64} r={36} fill={K.fire} />
          <circle cx={214} cy={74} r={18} fill={K.fireCore} />
        </g>
        <Flame x={214} y={104} s={0.9} />
        <Person {...p} />
        <Glass x={172} y={88} a={-110} s={0.9} />
        <Pour from={[176, 90]} to={[200, 102]} w={5} />
        <No x={160} y={120} r={96} />
      </Scene2>
    );
  },

  'yangin-yag-ocak-kapat': () => {
    const kn: P = [160, 176];
    const h = { x: 220, y: 250, a: -20, s: 1.15, pose: 'pinch' as const, side: 'R' as const };
    const pp = handPoint(h, 'pinch');
    const hh = { ...h, x: h.x + (kn[0] - pp[0]), y: h.y + (kn[1] - pp[1]) };
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={110} fill="#dfe9ec" />
        <OG sh={[{ d: rrect(-10, 96, 340, 14, 2), f: '#3a3d45' }, { d: rrect(-10, 110, 340, 140, 0), f: '#e9e4da' }]} />
        <Pan x={150} y={98} s={1.4} flip />
        <Blaze x={150} y={86} s={1} />
        <OG sh={[{ d: circ(kn, 30), f: '#f4f1ea' }, { d: rrect(kn[0] - 6, kn[1] - 26, 12, 52, 5), f: '#cfd3d8', t: `rotate(-90 ${kn[0]} ${kn[1]})` }]} />
        <text x={kn[0] - 44} y={kn[1] - 30} font-size={16} font-weight={800} text-anchor="middle" fill={K.ink}>0</text>
        <path d={`M${kn[0] - 30} ${kn[1] - 12}A32 32 0 0 1 ${kn[0] - 30} ${kn[1] - 12}`} />
        <Arrow from={[kn[0] + 40, kn[1] - 30]} to={[kn[0] - 6, kn[1] - 48]} bend={0.35} w={6} />
        <Hand {...hh} arm={200} sleeve={K.role.helper} skin={2} />
        <OG sh={[{ d: circ([60, 176], 22), f: '#f4f1ea' }, { d: rrect(54, 156, 12, 40, 5), f: '#cfd3d8' }]} />
      </Scene2>
    );
  },

  'yangin-yag-kapak': () => {
    const pan: P = [214, 116];
    const lid: P = [212, 98];
    const p: PersonProps = { ...YAG, x: 94, y: 224, s: 0.95, pose: { ...POSE.standSide, spine: -84, armF: { to: [lid[0] - 22, lid[1] - 6] }, armB: [86, 78], handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall={KITCHEN_WALL}>
        <Tiles y1={40} y2={116} />
        <Counter x={150} y={200} w={170} h={80} hob={214} />
        <Pan x={pan[0]} y={pan[1]} s={1} flip />
        <Flame x={232} y={108} s={0.42} />
        <g transform={`rotate(-6 ${lid[0]} ${lid[1]})`}>
          <OG sh={[{ d: `M${lid[0] - 30} ${lid[1]}Q${lid[0]} ${lid[1] - 14} ${lid[0] + 30} ${lid[1]}Z`, f: '#9aa4b0' }, { d: capsule([lid[0] - 24, lid[1] - 6], 3, [lid[0] - 20, lid[1] - 10], 3), f: '#3b3f4b' }, { d: rrect(lid[0] - 6, lid[1] - 13, 12, 5, 2), f: '#3b3f4b' }]} />
        </g>
        <Person {...p} />
        <Arrow from={[186, 70]} to={[256, 70]} w={6} />
      </Scene2>
    );
  },

  'yangin-yag-battaniye': () => {
    const p0: PersonProps = { ...YAG, x: 160, y: 232, s: 1.12, pose: { ...POSE.stand, face: 'neutral' } };
    const r0 = rig(p0);
    const hy = r0.shoulderB[1] + 26;
    const tl: P = [r0.shoulderB[0] - 30, hy];
    const trp: P = [r0.shoulderF[0] + 30, hy];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armB: { to: tl, bend: -1 }, armF: { to: trp, bend: 1 }, handB: 'fist', handF: 'fist' } };
    const top = 190;
    const bc = '#ece8df';
    const bot = 158;
    return (
      <Scene2 bg="indoor" wall={KITCHEN_WALL} gy={200}>
        <Tiles y1={40} y2={top} />
        <BlanketPouch x={262} y={36} w={42} h={52} open />
        <Flame x={142} y={186} s={0.5} />
        <Flame x={178} y={186} s={0.45} />
        <Flame x={160} y={186} s={0.55} />
        <Person {...p} only={['torso', 'head', 'armB', 'armF']} />
        <path d={`M${tl[0] - 8} ${hy - 9}H${trp[0] + 8}L${trp[0] + 14} ${bot}Q${(tl[0] + trp[0]) / 2} ${bot + 6} ${tl[0] - 14} ${bot}Z`} fill={bc} stroke={K.out} stroke-width={1.8} stroke-linejoin="round" />
        <path d={`M${tl[0] - 8} ${hy - 9}H${trp[0] + 8}V${hy + 9}H${tl[0] - 8}Z`} fill={shade(bc, 0.1)} stroke={K.out} stroke-width={1.6} />
        <path d={`M${tl[0] + 22} ${hy + 14}L${tl[0] + 16} ${bot - 4}M${trp[0] - 22} ${hy + 14}L${trp[0] - 16} ${bot - 4}`} stroke="#d2cbbd" stroke-width={2} />
        <OG sh={[{ d: rrect(10, top, 300, 10, 2), f: '#8d8f96' }, { d: rrect(14, top + 10, 292, 60, 0), f: '#e9e4da' }]} />
        <OG sh={[{ d: 'M124 190H196L192 180H128Z', f: '#4b505b' }, { d: capsule([196, 184], 2.6, [226, 182], 3), f: '#2f3238' }]} />
        <Arrow from={[52, 110]} to={[52, 168]} w={7} />
      </Scene2>
    );
  },

  /* ─────────── elektrik yangını ─────────── */
  'yangin-elektrik-su-yasak': () => {
    const p: PersonProps = { ...ELK, x: 82, y: 224, s: 0.98, pose: { ...POSE.standSide, armF: { to: [146, 108] }, armB: [84, 76], handF: 'fist', face: 'worried' } };
    return (
      <Scene2 bg="indoor" wall="#e7e0d3">
        <Socket x={226} y={156} s={1.3} />
        <OG sh={[{ d: rrect(212, 146, 28, 20, 4), f: '#f4f1ea' }]} />
        <path d="M226 166C226 190 250 200 290 204" fill="none" stroke={K.out} stroke-width={6} />
        <path d="M226 166C226 190 250 200 290 204" fill="none" stroke="#f4f1ea" stroke-width={3.4} />
        <Smoke x={196} y={70} w={70} h={44} kind="cloud" color="#6f757d" op={0.85} />
        <Flame x={228} y={150} s={0.5} />
        <Person {...p} />
        <Glass x={150} y={104} a={-112} s={0.9} />
        <Pour from={[154, 106]} to={[206, 148]} w={5} />
        <Bolt x={180} y={150} h={16} a={-20} />
        <Bolt x={134} y={170} h={13} a={10} />
        <No x={160} y={124} r={96} />
      </Scene2>
    );
  },

  'yangin-elektrik-tup': () => {
    const pr: PersonProps = { ...ELK, x: 98, y: 226, s: 0.98, pose: { ...POSE.standSide, spine: -82, face: 'neutral' } };
    const r0 = rig(pr);
    const ex = r0.hip[0] + 6, es = 0.9;
    const lev: P = [r0.hip[0] + 12, r0.hip[1] - 14];
    const ey = lev[1] + 64 * es;
    const noz: P = [r0.shoulderF[0] + 46, r0.shoulderF[1] + 40];
    const p: PersonProps = { ...pr, pose: { ...pr.pose, armF: { to: lev, bend: 1 }, armB: { to: noz }, handF: 'fist', handB: 'fist' } };
    return (
      <Scene2 bg="indoor" wall="#e7e0d3">
        <Inset x={14} y={14} w={74} h={86} bg="#f6f1e7">
          <FuseBox x={23} y={20} w={56} h={56} />
        </Inset>
        <Heater x={258} y={214} s={1} />
        <Smoke x={226} y={96} w={70} h={46} kind="cloud" color="#6f757d" op={0.8} />
        <Flame x={262} y={208} s={0.5} />
        <Powder from={[noz[0] + 12, noz[1] + 2]} a={24} len={72} w={34} />
        <Person {...p} mid={() => (
          <g>
            <Ext x={ex} y={ey} s={es} label="ABC" />
            <Hose pts={[extPt(ex, ey, es, 'hose'), [ex - 10, ey - 10], [noz[0] - 12, noz[1] + 10], noz]} a={24} s={0.8} />
          </g>
        )} />
      </Scene2>
    );
  },

  'yangin-elektrik-salter': salterScene(K.role[ELK.role ?? 'bystander2'], ELK.skin ?? 1),

  /* ─────────── araç yangını ─────────── */
  'yangin-arac-kenara-cek': () => (
    <Scene2 bg="dark">
      <rect width={320} height={240} fill={K.grass} />
      <rect x={60} y={0} width={190} height={240} fill="#6b6e75" />
      <path d="M60 0V240M250 0V240" stroke="#f4f1ea" stroke-width={4} />
      <path d="M120 0V240" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="18 16" />
      <path d="M180 0V240" stroke="#f4f1ea" stroke-width={4} />
      <rect x={250} y={0} width={8} height={240} fill="#9aa0a6" />
      <Arrow from={[90, 214]} to={[202, 96]} bend={-0.18} w={7} />
      <CarTop x={215} y={70} a={-96} color="#3f6fb5" hazard />
      <Smoke x={186} y={0} w={64} h={34} kind="cloud" color="#6f757d" op={0.9} />
    </Scene2>
  ),

  'yangin-arac-in': () => {
    const hand: P = [70, 162];
    const dad: PersonProps = { ...ARC.driver, x: 92, y: 226, s: 0.98, flip: true, pose: { ...POSE.walk, armF: { to: hand }, face: 'worried' } };
    const kid: PersonProps = { ...ARC.child, x: 48, y: 226, s: 0.98, flip: true, pose: { ...POSE.walk, armB: { to: hand }, face: 'worried' } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <rect x={0} y={218} width={320} height={22} fill="#6b6e75" />
        <Car x={236} y={206} s={1.15} color="#d0473d" />
        <OG sh={[{ d: 'M168 165L150 128L158 124L178 162Z', f: '#d0473d' }]} />
        <Smoke x={252} y={104} w={70} h={50} kind="cloud" color="#6f757d" op={0.9} />
        <OG sh={[{ d: rrect(160, 150, 28, 22, 4), f: '#7b4e2e' }, { d: 'M166 150Q174 140 182 150', st: K.out, sw: 2.4 }]} />
        <No x={174} y={160} r={22} />
        <Person {...kid} />
        <Person {...dad} />
      </Scene2>
    );
  },

  'yangin-arac-uzaklas': () => (
    <Scene2 bg="outdoor" ground="pavement" gy={178}>
      <rect x={0} y={192} width={320} height={48} fill="#6b6e75" />
      <path d="M0 216H320" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="16 14" />
      <Car x={262} y={196} s={0.78} color="#d0473d" />
      <Smoke x={250} y={104} w={70} h={50} kind="cloud" color="#6f757d" op={0.9} />
      <Smoke x={270} y={80} w={50} h={34} kind="cloud" color="#7a818b" op={0.7} />
      <Person {...ARC.driver} x={80} y={176} s={0.66} pose={{ ...POSE.stand, face: 'worried' }} />
      <Person {...ARC.child} x={50} y={177} s={0.66} pose={{ ...POSE.stand, face: 'worried' }} />
      <OG sh={[{ d: rrect(16, 146, 5, 34, 1), f: '#a3adb8' }, { d: rrect(115, 146, 5, 34, 1), f: '#a3adb8' }, { d: rrect(10, 144, 116, 12, 2), f: '#f4f1ea' }]} />
      <path d="M24 145l-8 10M44 145l-8 10M64 145l-8 10M84 145l-8 10M104 145l-8 10M124 145l-8 10" stroke={K.danger} stroke-width={7} />
      <rect x={10} y={144} width={116} height={12} rx={2} fill="none" stroke={K.out} stroke-width={1.5} />
      <Measure x1={124} x2={222} y={148} text="30 m" />
    </Scene2>
  ),

  'yangin-arac-kaput-yasak': () => {
    // Yanlış hareket: el kaputun ön kenarını kaldırıp açıyor (kırmızı yasak).
    const s = 3.2, cx = 34, cy = 262;
    const H: P = [cx + 40 * s, cy - 35 * s];
    const F: P = [cx + 63 * s, cy - 27 * s];
    const rot = (p: P, a: number): P => { const r = (a * Math.PI) / 180, dx = p[0] - H[0], dy = p[1] - H[1]; return [H[0] + dx * Math.cos(r) - dy * Math.sin(r), H[1] + dx * Math.sin(r) + dy * Math.cos(r)]; };
    const F2 = rot(F, -30);
    const h0 = { x: 0, y: 0, a: -35, s: 1.05, pose: 'fist' as const, side: 'R' as const, view: 'back' as const };
    const g0 = handPoint(h0, 'grip');
    const h = { ...h0, x: F2[0] + 6 - g0[0], y: F2[1] + 8 - g0[1] };
    return (
      <Scene2 bg="outdoor" ground="pavement" gy={226}>
        <Car x={cx} y={cy} s={s} color="#d0473d" />
        <path d={`M${f1(H[0])} ${f1(H[1])}L${f1(F2[0])} ${f1(F2[1])}L${f1(F[0])} ${f1(F[1])}Z`} fill="#2a2523" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
        <Flame x={H[0] + 52} y={H[1] + 16} s={0.5} />
        <path d={`M${f1(H[0])} ${f1(H[1])}L${f1(F2[0])} ${f1(F2[1])}L${f1(F2[0] + 2)} ${f1(F2[1] + 11)}L${f1(H[0])} ${f1(H[1] + 8)}Z`} fill="#d0473d" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
        <Smoke x={H[0] - 10} y={H[1] - 96} w={130} h={70} kind="cloud" color="#6f757d" op={0.9} />
        <Hand {...h} arm={220} sleeve={K.role[ARC.driver.role ?? 'bystander']} skin={ARC.driver.skin} />
        <No x={H[0] + 60} y={H[1] - 4} r={58} />
      </Scene2>
    );
  },

  /* ─────────── yüksek bina ─────────── */
  'yangin-bina-kapi-kapat': () => {
    const dx = 46, dw = 62, dh = 122, gy = 200;
    const door = '#7d5434';
    const gap = 5; // yalnız ince bir aralık kalmış
    const handle: P = [dx + dw - gap - 9, gy - dh * 0.5];
    const btn: P = [222, 108];
    return (
      <Scene2 bg="indoor" wall="#dfe3e6">
        <OG sh={[{ d: rrect(dx - 6, gy - dh - 6, dw + 12, dh + 6, 2), f: '#c9ccd2' }, { d: rrect(dx, gy - dh, dw, dh, 1), f: '#2a2523' }]} />
        {/* kapı kanadı neredeyse tamamen kapalı */}
        <OG sh={[
          { d: rrect(dx, gy - dh, dw - gap, dh, 1), f: door },
          { d: rrect(dx + 8, gy - dh + 12, dw - gap - 16, dh * 0.36, 2), f: shade(door, 0.1), ln: true },
          { d: rrect(dx + 8, gy - dh * 0.5 + 10, dw - gap - 16, dh * 0.38, 2), f: shade(door, 0.1), ln: true },
        ]} />
        {/* aralıktan sızan ince duman */}
        <Wisp x={dx + dw - 1} y={gy - dh + 26} h={34} s={0.55} op={0.55} />
        <Wisp x={dx + dw + 2} y={gy - 30} h={22} s={0.45} op={0.45} />
        <AlarmButton x={btn[0] - 15} y={btn[1] - 15} s={1.1} pressed />
        <Person x={144} y={224} s={1.05} who="man" role="victim" skin={0} hairC={K.hair.brown} pose={{ ...POSE.walk, spine: -88, legB: [104, 116], legF: [76, 86], armB: { to: [btn[0] - 14, btn[1]] }, armF: { to: handle }, handF: 'fist', handB: { shape: 'flat', a: 0 }, face: 'worried' }} />
        <OG sh={[{ d: circ(handle, 3.4), f: '#e2c35a' }]} />
        <Arrow from={[126, 28]} to={[94, 60]} bend={0.3} w={6} />
      </Scene2>
    );
  },

  'yangin-bina-merdiven': () => (
    <Scene2 bg="indoor" wall="#e6e2da">
      <rect x={0} y={0} width={156} height={240} fill="#bdbab4" />
      <Stairs x={10} y={200} n={6} sw={22} sh={22} color="#a9a59e" />
      <Smoke x={0} y={0} w={156} h={190} color="#4f545b" op={0.95} />
      <No x={78} y={110} r={44} />
      <rect x={156} y={0} width={8} height={240} fill="#8d8f96" stroke={K.out} stroke-width={1.5} />
      <rect x={164} y={0} width={156} height={240} fill="#f2efe6" />
      <rect x={164} y={200} width={156} height={40} fill={K.floor} />
      <Stairs x={168} y={200} n={6} sw={24} sh={22} dir={1} color="#d8cfc0" />
      <path d="M172 140L314 8" stroke="#7b4e2e" stroke-width={5} stroke-linecap="round" />
      <path d="M190 124V166M226 92V132M262 58V100M298 24V66" stroke="#7b4e2e" stroke-width={3} />
      <Person {...BNA} x={222} y={157} s={0.74} flip pose={{ ...POSE.walk, legB: [70, 100], legF: [110, 100], armB: { to: [204, 112] }, face: 'neutral' }} />
      <Ok x={294} y={180} r={14} />
    </Scene2>
  ),

  'yangin-bina-pencere-isaret': () => {
    const win = { x: 150, y: 50, w: 80, h: 76 };
    const p: PersonProps = { ...BNA, x: win.x + 38, y: win.y + 46, ax: 'head', ay: 'head', s: 0.82, pose: { ...POSE.stand, armB: [-150, -120], armF: [30, -30], face: 'worried' } };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <rect x={70} y={-10} width={250} height={210} fill="#e3d6c2" stroke={K.out} stroke-width={2} />
        {[[90, 150], [250, 50], [250, 150], [90, 50]].map(([wx, wy], i) => <Window key={i} x={wx} y={wy} w={56} h={50} />)}
        <path d="M70 140H320" stroke={shade('#e3d6c2', 0.15)} stroke-width={3} />
        <Inset x={win.x} y={win.y} w={win.w} h={win.h} bg="#3a3530">
          <Smoke x={win.x} y={win.y} w={win.w} h={22} color="#5b6068" op={0.8} />
          <Person {...p} only={['torso', 'head', 'armB']} />
        </Inset>
        <Person {...p} only={['armF']} over={(rr) => <Flashlight x={rr.handF[0] - 6} y={rr.handF[1]} s={0.6} a={-20} />} />
        <rect x={win.x - 6} y={win.y + win.h - 4} width={win.w + 12} height={8} rx={2} fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
        <Person {...p} only={['armB']} />
        <path d={`M${r.handB[0]} ${r.handB[1]}q-14 -10 -30 -4q-10 14 -26 8q10 -16 0 -26q16 4 30 -4z`} fill="#fbfaf7" stroke={K.out} stroke-width={1.6} />
        <Waves x={r.handB[0] - 50} y={r.handB[1] - 14} a={180} n={2} r={6} />
      </Scene2>
    );
  },

  /* ─────────── duman solunması ─────────── */
  'yangin-duman-temiz-hava': () => {
    // Yardımcı, öksüren kişiyi elini sırtına koyarak dumanlı binadan açık havaya yürütüyor.
    const victim: PersonProps = { ...DMN.victim, x: 196, y: 226, s: 1.05, pose: { ...POSE.walk, spine: -80, chest: -70, head: -60, armF: { at: 'mouth', d: [4, 6] }, handF: 'fist', face: 'pain' } };
    const v = rig(victim);
    const helper: PersonProps = { ...DMN.helper, x: 128, y: 224, s: 1.05, pose: { ...POSE.walk, armF: { to: [v.back[0] - 2, v.back[1] + 6] }, handF: 'flat', face: 'worried' } };
    return (
      <Scene2 bg="outdoor">
        <rect x={-4} y={30} width={70} height={172} fill="#d9c9b0" stroke={K.out} stroke-width={2} />
        <rect x={14} y={110} width={40} height={90} fill="#3a3530" stroke={K.out} stroke-width={2} />
        <Smoke x={0} y={36} w={80} h={66} kind="cloud" color="#5b6068" op={0.9} />
        <Smoke x={18} y={96} w={52} h={40} kind="cloud" color="#6f757d" op={0.85} />
        <Tree x={298} y={198} s={0.8} />
        <Person {...helper} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        <Person {...victim} />
        <Person {...helper} only={['armF']} />
        <Waves x={v.mouth[0] + 16} y={v.mouth[1]} a={10} n={3} r={5} color={K.smoke} />
        <Arrow from={[226, 52]} to={[296, 52]} w={7} />
      </Scene2>
    );
  },

  'yangin-duman-kpr': () => {
    // Göğüs kompresyonu, yandan: eller göğsün ortasında, kollar düz, omuzlar ellerin üstünde.
    const victim: PersonProps = { ...DMN.victim, x: 132, y: 230, s: 1.45, pose: POSE.lieBack };
    const v = rig(victim);
    const c: P = [v.chest[0] - 2, v.chest[1] + 1];
    const resc: PersonProps = {
      ...DMN.helper, x: c[0], ax: 'shoulderF', y: 219, s: 1.45, flip: true,
      pose: { spine: -58, chest: -56, head: -30, legB: [70, 178], legF: [66, 176], armB: { to: [c[0] + 1, c[1]] }, armF: { to: c }, handB: { shape: 'flat', a: -95 }, handF: { shape: 'flat', a: -88 }, face: 'neutral' },
    };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Person {...resc} />
        <Person {...victim} />
        <Arrow from={[c[0] + 62, 64]} to={[c[0] + 62, 124]} />
      </Scene2>
    );
  },

  'yangin-duman-derlenme': () => {
    const p: PersonProps = { ...DMN.victim, x: 186, y: 226, s: 1.5, pose: POSE.recovery };
    const r = rig(p);
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Person {...p} />
        <Waves x={r.head[0] + 2} y={r.head[1] - 24} a={-90} n={3} r={5} color={K.water} />
      </Scene2>
    );
  },

  'yangin-duman-oturt': () => {
    const sit: PersonProps = { ...DMN.victim, x: 104, y: 222, s: 1.14, pose: { ...POSE.sitChair, spine: -92, armB: [84, 40], armF: [80, 30], face: 'worried' } };
    const sr = rig(sit);
    const helper: PersonProps = { ...DMN.helper, x: 204, y: 230, s: 1.14, flip: true, pose: { ...POSE.kneelOne, spine: -70, chest: -60, head: -66, armF: { to: [sr.neck[0] + 9, sr.neck[1] + 5] }, armB: { to: [sr.neck[0] + 6, sr.neck[1] + 10] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <rect x={0} y={60} width={40} height={140} fill="#d9c9b0" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: rrect(-6, 200, 150, 24, 2), f: '#bab4a8' }, { d: rrect(-6, 178, 126, 24, 2), f: '#c9c3b8' }]} />
        <Tree x={292} y={198} s={0.8} />
        <Person {...sit} over={(r) => <Soot r={r} />} />
        <Person {...helper} />
      </Scene2>
    );
  },

  /* ─────────── giysi tutuşması ─────────── */
  'yangin-giysi-dur': () => {
    const p: PersonProps = { ...GYS.self, x: 186, y: 226, s: 1.12, pose: { ...POSE.stand, armB: [100, 100], armF: [70, 70], face: 'worried' } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor">
        <g opacity={0.45}>
          <Person x={70} y={210} s={0.78} who="woman" role="bystander" hair="long" top="#8b8e96" bottomC="#6d7480" pose={{ ...POSE.run }} />
        </g>
        <No x={70} y={140} r={44} />
        <Person {...p} />
        <Flame x={r.elbowF[0] + 2} y={r.elbowF[1] + 10} s={0.5} />
        <Flame x={r.kneeF[0] + 6} y={r.kneeF[1] + 6} s={0.55} />
        <Corner text="DUR" x={232} />
      </Scene2>
    );
  },

  'yangin-giysi-yat': () => {
    const l0: PersonProps = { ...GYS.self, x: 170, y: 222, s: 1.05, pose: { ...POSE.lieBack, face: 'closed' } };
    const r0 = rig(l0);
    const face: P = [r0.head[0] + 3, r0.head[1] - 12];
    const p: PersonProps = { ...l0, pose: { ...l0.pose, armB: { to: [face[0] + 4, face[1] + 2] }, armF: { to: face }, handB: 'flat', handF: 'flat' } };
    return (
      <Scene2 bg="indoor">
        <Person {...p} />
        <Flame x={r0.hip[0] - 4} y={r0.hip[1] - 8} s={0.62} />
        <Flame x={r0.hip[0] + 20} y={r0.hip[1] - 6} s={0.45} />
        <Arrow from={[170, 70]} to={[170, 150]} w={8} />
        <Corner text="YAT" />
      </Scene2>
    );
  },

  'yangin-giysi-yuvarlan': () => yuvarlan(GYS.self, 'YUVARLAN'),

  'yangin-giysi-battaniye': () => {
    const victim: PersonProps = { ...GYS.other, x: 206, y: 226, s: 1.2, pose: { ...POSE.lieBack, face: 'pain' } };
    const v = rig(victim);
    const h0: PersonProps = { ...GYS.self, x: 66, y: 224, s: 1.2, pose: { ...POSE.kneel, spine: -62, chest: -50, head: -40, face: 'worried' } };
    const hr = rig(h0);
    const grip: P = [hr.shoulderF[0] + 50, hr.shoulderF[1] + 24];
    const helper: PersonProps = { ...h0, pose: { ...h0.pose, armF: { to: grip }, armB: { to: [grip[0] - 4, grip[1] - 3] }, handF: 'fist', handB: 'fist' } };
    const bc = '#6e5a8a';
    const far: P = [v.kneeF[0] - 2, 226];
    return (
      <Scene2 bg="indoor">
        <Person {...victim} />
        <Flame x={v.kneeF[0] + 12} y={v.kneeF[1] - 4} s={0.62} />
        <Flame x={v.kneeF[0] + 32} y={v.kneeF[1] - 2} s={0.46} />
        <Person {...helper} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <path d={`M${grip[0] - 2} ${grip[1] - 6}C${grip[0] + 40} ${grip[1] - 10} ${v.hip[0] - 10} ${v.hip[1] - 20} ${far[0]} ${v.hip[1] - 8}C${far[0] + 8} ${v.hip[1]} ${far[0] + 4} 218 ${far[0] + 2} 226H${grip[0] + 16}C${grip[0] + 8} 206 ${grip[0] + 4} ${grip[1] + 20} ${grip[0] - 2} ${grip[1] - 6}Z`} fill={bc} stroke={K.out} stroke-width={1.8} stroke-linejoin="round" />
        <path d={`M${grip[0] + 30} ${grip[1] + 2}L${grip[0] + 30} 224M${grip[0] + 66} ${grip[1] + 14}L${grip[0] + 68} 224`} stroke={shade(bc, 0.25)} stroke-width={2} />
        <Person {...helper} only={['armF']} />
        <Arrow from={[grip[0] + 20, grip[1] - 40]} to={[v.kneeF[0] + 10, v.kneeF[1] - 48]} bend={-0.2} w={6} />
      </Scene2>
    );
  },

  /* ─────────── kaçış planı ─────────── */
  'yangin-plan-dedektor': () => {
    const det: P = [160, 52];
    const h = { x: 172, y: 250, a: 4, s: 1.6, pose: 'point' as const, side: 'R' as const };
    const tip = handPoint(h, 'tip');
    const hh = { ...h, x: h.x + (det[0] - tip[0]), y: h.y + (det[1] + 6 - tip[1]) };
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={44} fill="#f6f4ee" />
        <path d="M0 44H320" stroke="#d8d3c8" stroke-width={2} />
        <Detector x={det[0]} y={det[1]} r={50} />
        <circle cx={det[0] + 30} cy={det[1] - 22} r={9} fill={K.danger} opacity={0.35} />
        <circle cx={det[0] + 30} cy={det[1] - 22} r={4} fill={K.danger} stroke={K.out} stroke-width={1.2} />
        <Waves x={det[0] + 58} y={det[1] + 10} a={10} n={3} r={9} />
        <Waves x={det[0] - 58} y={det[1] + 10} a={170} n={3} r={9} />
        <Hand {...hh} arm={220} sleeve={K.role.bystander} skin={1} />
      </Scene2>
    );
  },

  'yangin-plan-iki-cikis': () => {
    const X0 = 20, Y0 = 18, X1 = 230, Y1 = 216, HX0 = 114, HX1 = 136, MY = 117;
    const wall = '#3d3a3a';
    const meet: P = [282, 196];
    const g1: [number, number] = [Y0 + 30, Y0 + 62], g2: [number, number] = [MY + 30, MY + 62];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.grass} />
        <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill="#efe5d2" />
        <rect x={HX0} y={Y0} width={HX1 - HX0} height={Y1 - Y0} fill="#ddd1bb" />
        <g stroke={wall} stroke-width={6} stroke-linecap="square" fill="none">
          <path d={`M${X0} ${Y0}H${X1}V${Y1}H${HX1}M${HX0} ${Y1}H${X0}V${Y0}`} />
          <path d={`M${X0} ${MY}H${HX0}M${HX1} ${MY}H${X1}`} />
          <path d={`M${HX0} ${Y0}V${g1[0]}M${HX0} ${g1[1]}V${g2[0]}M${HX0} ${g2[1]}V${Y1}`} />
          <path d={`M${HX1} ${Y0}V${g1[0]}M${HX1} ${g1[1]}V${g2[0]}M${HX1} ${g2[1]}V${Y1}`} />
        </g>
        <g stroke={K.water} stroke-width={6}>
          <path d={`M${X0} ${Y0 + 30}V${Y0 + 66}M${X0} ${MY + 30}V${MY + 66}M${X1} ${Y0 + 30}V${Y0 + 66}M${X1} ${MY + 30}V${MY + 66}`} />
        </g>
        {[[67, g1], [67, g2], [183, g1], [183, g2]].map(([cx, g], i) => {
          const gg = g as [number, number];
          const left = (cx as number) < HX0;
          const cy = (gg[0] + gg[1]) / 2;
          const c = cx as number;
          const winX = left ? X0 - 16 : X1 + 16;
          const doorPts: P[] = left ? [[c + 4, cy - 4], [HX0 - 2, cy - 4], [HX0 + 6, cy + 10]] : [[c - 4, cy - 4], [HX1 + 2, cy - 4], [HX1 - 6, cy + 10]];
          return (
            <g key={i}>
              <circle cx={c} cy={cy} r={6} fill={K.safe} stroke={K.out} stroke-width={1.4} />
              <DashArrow pts={doorPts} w={3.4} />
              <DashArrow pts={[[c + (left ? -8 : 8), cy + 2], [winX, cy + 2]]} w={3.4} />
            </g>
          );
        })}
        <DashArrow pts={[[125, 196], [125, 230]]} w={3.4} />
        <Star x={meet[0]} y={meet[1]} r={18} />
      </Scene2>
    );
  },

  'yangin-plan-bulusma': () => {
    const boyHead: P = [186, 150];
    const dad: PersonProps = { ...PLN, x: 236, y: 226, s: 0.98, flip: true, pose: { ...POSE.standSide, armF: { to: [boyHead[0] + 26, boyHead[1] - 22] }, handF: 'fist', face: 'speak' } };
    const d = rig(dad);
    // uzatılmış işaret parmağı: önkol doğrultusunda
    const fa = (d.foreF * Math.PI) / 180;
    const tipP: P = [d.handF[0] + Math.cos(fa) * 12, d.handF[1] + Math.sin(fa) * 12];
    return (
      <Scene2 bg="outdoor">
        <HouseExt x={10} y={196} w={110} h={76} />
        <Tree x={282} y={202} s={1.0} />
        <Pin x={282} y={66} s={1.15} />
        <Person x={128} y={224} s={0.95} who="woman" role="bystander2" hair="scarf" hairC="#5aa0a8" skin={1} pose={{ ...POSE.stand, face: 'calm' }} />
        <Person x={160} y={226} s={0.95} who="girl" role="bystander3" pose={{ ...POSE.stand, face: 'calm' }} />
        <Person x={boyHead[0]} y={226} s={0.95} who="boy" role="bystander4" skin={1} pose={{ ...POSE.stand, face: 'calm' }} />
        <Person {...dad} />
        <OG sh={[{ d: capsule(d.handF, 2.6, tipP, 2.2), f: K.skin[1] }]} ow={1.3} />
        {/* yoklama: sırayla gösterilen kişiler */}
        <g fill="none" stroke={K.action} stroke-width={2.6} stroke-dasharray="4 5" stroke-linecap="round">
          <path d={`M${f1(tipP[0] - 4)} ${f1(tipP[1] - 4)}Q172 96 128 112`} />
        </g>
      </Scene2>
    );
  },

  'yangin-plan-tup-battaniye': () => (
    <Scene2 bg="indoor" wall={KITCHEN_WALL}>
      <Tiles y1={70} y2={120} />
      <Door x={20} y={200} w={62} h={128} />
      <BlanketPouch x={124} y={50} w={50} h={60} open />
      <OG sh={[{ d: rrect(132, 140, 36, 6, 2), f: '#8e99a6' }]} />
      <Ext x={149} y={202} s={0.8} label="ABC" />
      <Ok x={196} y={60} r={13} />
      <Ok x={196} y={160} r={13} />
      <Counter x={226} y={200} w={100} h={80} />
    </Scene2>
  ),
};
