// Elektrik, gaz ve su (tesisat) — sahneler. Şartname: src/art/spec/tesisat.ts
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Car, Chair, Door, Drop, Flame, Flashlight, Hand, HouseExt, K, Label, No, OG, Ok, Person, Phone, POSE,
  Scene2, Smoke, Table, Tent, Timer, Tree, Wall, Water, Waves, Window,
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
const ow = (s: number) => 1.5 / s;

/** Elin bir noktası (parmak ucu/tutuş) hedefe gelecek şekilde bilek konumunu hesaplar */
function aim<T extends Omit<HandProps, 'x' | 'y'>>(h: T, t: P, which: 'tip' | 'grip' | 'palm' | 'pinch' = 'tip'): T & { x: number; y: number } {
  const p = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: t[0] - p[0], y: t[1] - p[1] };
}

/** Yan kare (ek çizim). x,y,w,h sahne koordinatı; içerik yerel koordinatta k ölçeğiyle çizilir
 *  (yerel alan: w/k × h/k). */
let panelUid = 0;
function Panel({ x, y, w, h, k = 1, bg = '#fff', children }: { x: number; y: number; w: number; h: number; k?: number; bg?: string; children?: ComponentChildren }) {
  const id = 'tes-panel-' + ++panelUid;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={10} />
        </clipPath>
      </defs>
      <rect x={x - 1} y={y - 1} width={w + 2} height={h + 2} rx={11} fill="#fff" />
      <g clip-path={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={bg} />
        <g transform={`translate(${x} ${y}) scale(${k})`}>{children}</g>
      </g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={K.out} stroke-width={2.2} />
    </g>
  );
}

/** Gaz dalgaları (açık yeşilimsi kıvrımlar) */
const GAS = '#9cc23f';
function Gas({ x, y, s = 1, n = 3, gap = 18, op = 0.85 }: { x: number; y: number; s?: number; n?: number; gap?: number; op?: number }) {
  return (
    <g fill="none" stroke={GAS} stroke-width={3.2} stroke-linecap="round" opacity={op}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} transform={`translate(${f1(x + i * gap * s)} ${f1(y + (i % 2) * 7 * s)}) scale(${s})`} d="M0 0c-6-5 6-9 0-14c-6-5 6-9 0-14" />
      ))}
    </g>
  );
}

/** Kıvılcım patlaması (sarı yıldız) */
function Spark({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const rr = i % 2 ? r * 0.4 : i % 4 ? r * 0.75 : r;
    return pol([x, y], i * 22.5 - 90, rr);
  });
  return (
    <g>
      <path d={'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z'} fill="#ffd64a" stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
      <circle cx={x} cy={y} r={r * 0.28} fill="#fff" />
    </g>
  );
}

/** Şimşek / elektrik çarpması simgesi (MERKEZ) */
function Bolt({ x, y, s = 1, a = 0, c = '#ffd23a' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <path d="M4 -22L-11 3H-1L-5 22L11 -5H1Z" fill={c} stroke={K.out} stroke-width={1.8 / s} stroke-linejoin="round" />
    </G>
  );
}

/** Kablo (yumuşak çizgi, dış hatlı) */
function Cable({ pts, c = '#2f3542', w = 3.6 }: { pts: P[]; c?: string; w?: number }) {
  const d = smooth(pts);
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={w + 2.6} />
      <path d={d} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Ölçü oku (çift başlı koyu çizgi) */
function Dim({ a, b, c = K.ink }: { a: P; b: P; c?: string }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  const head = (p: P, d: number) => {
    const q1 = pol(p, d + 155, 10), q2 = pol(p, d - 155, 10);
    return `M${f1(q1[0])} ${f1(q1[1])}L${f1(p[0])} ${f1(p[1])}L${f1(q2[0])} ${f1(q2[1])}`;
  };
  return (
    <g fill="none" stroke={c} stroke-width={2.6} stroke-linecap="round" stroke-linejoin="round">
      <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} stroke-dasharray="7 5" />
      <path d={head(b, ang)} />
      <path d={head(a, ang + 180)} />
      <path d={`M${a[0]} ${a[1] - 9}V${a[1] + 9}M${b[0]} ${b[1] - 9}V${b[1] + 9}`} />
    </g>
  );
}

/** Eldiven: kişinin ellerinin üstüne renkli eldiven */
const gloves = (c: string, which: Array<'B' | 'F'> = ['B', 'F']) => (r: ReturnType<typeof rig>) => (
  <g>
    {which.map((w) => {
      const h = w === 'B' ? r.handB : r.handF;
      const wr = w === 'B' ? r.wristB : r.wristF;
      return (
        <OG key={w} sh={[{ d: capsule(wr, 5.4 * r.s, h, 6.4 * r.s), f: c }, { d: circ(h, 6.6 * r.s), f: c }]} />
      );
    })}
  </g>
);

/** Güneş (ışınlı). MERKEZ */
function Sun({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f6b81f" stroke-width={3.4} stroke-linecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const p1 = pol([x, y], i * 36, r + 5), p2 = pol([x, y], i * 36, r + 13);
          return <line key={i} x1={f1(p1[0])} y1={f1(p1[1])} x2={f1(p2[0])} y2={f1(p2[1])} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff3a8" />
    </g>
  );
}

/** Isı dalgaları (kırmızımsı dalgalı çizgiler, yukarı) */
function Heat({ x, y, s = 1, n = 3 }: { x: number; y: number; s?: number; n?: number }) {
  return (
    <g fill="none" stroke={K.danger} stroke-width={2.8} stroke-linecap="round" opacity={0.85}>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} transform={`translate(${f1(x + (i - (n - 1) / 2) * 12 * s)} ${y}) scale(${s})`} d="M0 0c-5-4 5-8 0-12c-5-4 5-8 0-12" />
      ))}
    </g>
  );
}

/** Yağmur çizgileri */
function Rain({ x, y, w, h, n = 14 }: { x: number; y: number; w: number; h: number; n?: number }) {
  return (
    <g stroke={K.water} stroke-width={2.2} stroke-linecap="round" opacity={0.8}>
      {Array.from({ length: n }, (_, i) => {
        const xx = x + ((i * 37) % w);
        const yy = y + ((i * 53) % h);
        return <line key={i} x1={xx} y1={yy} x2={xx - 4} y2={yy + 12} />;
      })}
    </g>
  );
}

/* ════════════════════════ nesneler ════════════════════════ */

const PLATE = '#f7f5f0';

/** Lamba düğmesi (MERKEZ). on: açık konumda */
function SwitchPlate({ x, y, s = 1, on }: { x: number; y: number; s?: number; on?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={ow(s)}
        sh={[
          { d: rrect(-17, -24, 34, 48, 5), f: PLATE },
          { d: rrect(-9, -15, 18, 30, 3), f: '#ebe9e3', ln: true },
          on ? { d: rrect(-9, -15, 18, 13, 3), f: '#d4d1c9', no: true } : { d: rrect(-9, 2, 18, 13, 3), f: '#d4d1c9', no: true },
        ]}
      />
      <path d="M-9 0H9" stroke={K.out} stroke-width={1 / s} />
      {on && <circle cx={0} cy={9} r={2} fill={K.safe} />}
    </G>
  );
}

/** Duvar prizi (topraklı, MERKEZ) */
function Socket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={ow(s)}
        sh={[
          { d: rrect(-22, -22, 44, 44, 6), f: PLATE },
          { d: circ([0, 0], 15), f: '#e1ded6', ln: true },
          { d: rrect(-3, -15, 6, 4, 1), f: K.metal, no: true },
          { d: rrect(-3, 11, 6, 4, 1), f: K.metal, no: true },
        ]}
      />
      <circle cx={-6} cy={0} r={2.6} fill={K.out} />
      <circle cx={6} cy={0} r={2.6} fill={K.out} />
    </G>
  );
}

/** Kapı zili düğmesi (MERKEZ) */
function Doorbell({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: rrect(-15, -20, 30, 40, 5), f: PLATE }, { d: circ([0, 2], 8.5), f: '#f0c84a', ln: true }]} />
      <path d="M-4 -12a4 4 0 0 1 8 0v3h2v1.6h-12v-1.6h2z" fill="#9aa1ab" />
    </G>
  );
}

/** Fiş (yandan). x,y = pin uçlarının ortası; a: pinlerin baktığı yön (0 = yukarı).
 *  Kablo yerel (0, 30)'dan çıkar → plugTail ile bulunur. */
function Plug({ x, y, s = 1, a = 0, c = '#f2f0ea' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={ow(s)}
        sh={[
          { d: rrect(-8, 0, 4, 14, 1.8), f: K.metal },
          { d: rrect(4, 0, 4, 14, 1.8), f: K.metal },
          { d: 'M-13 12H13V20Q13 28 6 32H-6Q-13 28 -13 20Z', f: c },
          { d: 'M6 12H13V20Q13 28 6 32Z', f: shade(c, 0.12), no: true },
          { d: rrect(-4, 31, 8, 6, 2), f: shade(c, 0.2) },
        ]}
      />
    </G>
  );
}
const plugTail = (x: number, y: number, s: number, a: number): P => {
  const r = (a + 90) * R;
  return [x + Math.cos(r) * 36 * s, y + Math.sin(r) * 36 * s];
};

/** Fişin arkadan (prize takılı) görünüşü (MERKEZ) */
function PlugFace({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <OG ow={ow(s)} sh={[{ d: circ([x, y], 14 * s), f: '#efede7' }, { d: circ([x, y], 6 * s), f: '#d9d6ce', ln: true }]} />;
}

/** Çakmak (MERKEZ, a = yön; alev yukarıda) */
function Lighter({ x, y, s = 1, a = 0, lit = true }: { x: number; y: number; s?: number; a?: number; lit?: boolean }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      {lit && <Flame x={3} y={-26} s={0.5} />}
      <OG ow={ow(s)} sh={[{ d: rrect(-8, -12, 16, 36, 4), f: '#3d7ad6' }, { d: rrect(3, -12, 5, 36, 3), f: shade('#3d7ad6', 0.15), no: true }, { d: rrect(-8, -24, 16, 13, 2), f: K.metal }, { d: circ([-3, -25], 4), f: '#3b3f4b' }]} />
    </G>
  );
}

/** Kibrit (taban x,y; alevli) */
function Match({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <Flame x={0} y={-50} s={0.62} />
      <OG ow={ow(s)} sh={[{ d: rrect(-2.5, -48, 5, 48, 1.5), f: '#e9cf96' }, { d: ell([0, -50], 4.2, 5.6), f: K.red }]} />
    </G>
  );
}

/** Yanan sigara (sol uç x,y; sağa uzanır) */
function Cigarette({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <path d="M52 -6c-6-6 6-10 0-16c-6-6 6-10 0-16" fill="none" stroke="#9aa1ab" stroke-width={2.6} stroke-linecap="round" />
      <OG ow={ow(s)} sh={[{ d: rrect(0, -4.5, 15, 9, 2), f: '#e3a24c' }, { d: rrect(14, -4.5, 34, 9, 1.5), f: '#fbfaf7' }, { d: rrect(46, -4.5, 6, 9, 1.5), f: '#e8472d' }]} />
      <circle cx={50} cy={0} r={2} fill="#ffd64a" />
    </G>
  );
}

/** Mutfak ocağı (fırınlı, karşıdan). x,y = taban ortası. Üst yüzey ≈ y - 104·s */
function Range({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={ow(s)}
        sh={[
          { d: rrect(-50, -92, 100, 92, 3), f: '#eef0f2' },
          { d: rrect(34, -92, 16, 92, 3), f: '#d9dde2', no: true },
          { d: 'M-50 -92L-42 -112H42L50 -92Z', f: '#3b3f4b' },
          { d: ell([-20, -102], 15, 4.6), f: '#23252e', ln: true },
          { d: ell([20, -102], 15, 4.6), f: '#23252e', ln: true },
          { d: rrect(-50, -92, 100, 14, 2), f: '#d9dde2' },
          { d: circ([-30, -85], 4), f: '#3b3f4b' },
          { d: circ([-12, -85], 4), f: '#3b3f4b' },
          { d: circ([12, -85], 4), f: '#3b3f4b' },
          { d: circ([30, -85], 4), f: '#3b3f4b' },
          { d: rrect(-42, -70, 84, 60, 3), f: '#e4e7eb', ln: true },
          { d: rrect(-32, -60, 64, 32, 2), f: '#2b3946', ln: true },
          { d: 'M-28 -72H28', st: K.out, sw: 3 },
        ]}
      />
    </G>
  );
}

/** Mutfak tezgâhı (yan/karşıdan dolap). x = SOL, y = zemin */
function Counter({ x, y, w = 110, h = 84, c = '#e7d7bf' }: { x: number; y: number; w?: number; h?: number; c?: string }) {
  return (
    <OG
      sh={[
        { d: rrect(x, y - h + 6, w, h - 6, 2), f: c },
        { d: rrect(x - 3, y - h, w + 6, 8, 2), f: '#9a9fa8' },
        { d: rrect(x + 6, y - h + 16, w / 2 - 9, h - 26, 2), f: tint(c, 0.25), ln: true },
        { d: rrect(x + w / 2 + 3, y - h + 16, w / 2 - 9, h - 26, 2), f: tint(c, 0.25), ln: true },
      ]}
    />
  );
}

/** Pilli kamp lambası. x,y = taban ortası */
function Lantern({ x, y, s = 1, glow = true }: { x: number; y: number; s?: number; glow?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      {glow && <circle cx={0} cy={-26} r={30} fill="#ffe27a" opacity={0.3} />}
      <OG
        ow={ow(s)}
        sh={[
          { d: 'M-8 -50Q0 -62 8 -50', st: K.out, sw: 2.4 },
          { d: rrect(-14, -6, 28, 6, 2), f: '#2f6b55' },
          { d: rrect(-11, -42, 22, 36, 3), f: '#fff1a8' },
          { d: rrect(-14, -50, 28, 9, 3), f: '#2f6b55' },
        ]}
      />
      <circle cx={0} cy={-24} r={6} fill="#fff" opacity={0.9} />
    </G>
  );
}

/** Mum (şamdanda). x,y = taban ortası */
function Candle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <circle cx={0} cy={-46} r={20} fill="#ffd64a" opacity={0.25} />
      <OG ow={ow(s)} sh={[{ d: ell([0, -3], 18, 4), f: '#c9a24a' }, { d: rrect(-7, -38, 14, 36, 2), f: '#fbf5e6' }, { d: 'M0 -38V-44', st: K.out, sw: 1.6 }]} />
      <Flame x={0} y={-42} s={0.5} />
    </G>
  );
}

/** Televizyon (sehpasız, ayaklı). x,y = taban ortası */
function TV({ x, y, s = 1, muddy }: { x: number; y: number; s?: number; muddy?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: 'M-18 0L-10 -10H10L18 0Z', f: '#3b3f4b' }, { d: rrect(-40, -62, 80, 52, 4), f: '#30333b' }, { d: rrect(-35, -57, 70, 42, 2), f: '#2b3946', ln: true }]} />
      <path d="M-28 -50l10 -6M-28 -42l18 -11" stroke="#fff" stroke-width={2} opacity={0.35} stroke-linecap="round" />
      {muddy && <path d="M-40 -24Q-20 -30 0 -22T40 -26V-14Q40 -10 36 -10H-36Q-40 -10 -40 -14Z" fill="#8a6a45" opacity={0.85} />}
    </G>
  );
}

/** Dizüstü bilgisayar (yandan açık). x,y = taban ortası */
function Laptop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: 'M-26 -4L-20 -42H18L12 -4Z', f: '#5b6270' }, { d: 'M-21 -8L-16 -38H14L9 -8Z', f: '#bfe3f5', ln: true }, { d: rrect(-34, -5, 58, 5, 2), f: '#8a919c' }]} />
    </G>
  );
}

/** Sokak lambası (direk dibi x,y). on: yanıyor */
function StreetLamp({ x, y, h = 130, on }: { x: number; y: number; h?: number; on?: boolean }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x - 3, y - h, 6, h, 2), f: '#4a5160' }, { d: `M${x} ${y - h + 4}Q${x} ${y - h - 10} ${x + 22} ${y - h - 8}`, st: K.out, sw: 5 }, { d: `M${x + 12} ${y - h - 12}H${x + 36}L${x + 32} ${y - h - 4}H${x + 16}Z`, f: '#4a5160' }]} />
      <path d={`M${x} ${y - h + 4}Q${x} ${y - h - 10} ${x + 22} ${y - h - 8}`} stroke="#4a5160" stroke-width={3} fill="none" />
      <rect x={x + 17} y={y - h - 5} width={14} height={3} rx={1.5} fill={on ? '#ffe27a' : '#596273'} />
    </g>
  );
}

/** Elektrik direği. x,y = dip; a = eğim (0 = dik, + = sağa yatık); h boy */
function PowerPole({ x, y, a = 0, h = 150 }: { x: number; y: number; a?: number; h?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG
        sh={[
          { d: 'M-5 0L-3.5 ' + -h + 'H3.5L5 0Z', f: '#9c7a5a' },
          { d: rrect(-30, -h + 14, 60, 7, 2), f: '#8a6a4c' },
          { d: rrect(-26, -h + 8, 5, 7, 1), f: '#e9ecef' },
          { d: rrect(21, -h + 8, 5, 7, 1), f: '#e9ecef' },
        ]}
      />
    </G>
  );
}

/** Jeneratör (yandan). x,y = taban ortası. running: titreşim çizgileri; exhaust: egzoz sağda */
function Generator({ x, y, s = 1, running, exhaust = true }: { x: number; y: number; s?: number; running?: boolean; exhaust?: boolean }) {
  const body = '#e2b23a';
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={ow(s)}
        sh={[
          ...(exhaust ? [{ d: rrect(36, -46, 20, 14, 4), f: K.metal }, { d: rrect(54, -42, 8, 6, 2), f: shade(K.metal, 0.25) }] : []),
          { d: rrect(-48, -12, 96, 12, 2), f: '#3b3f4b' },
          { d: circ([-34, -4], 7), f: '#2b2d3a' },
          { d: circ([34, -4], 7), f: '#2b2d3a' },
          { d: rrect(-40, -58, 76, 46, 6), f: body },
          { d: rrect(12, -58, 24, 46, 6), f: shade(body, 0.15), no: true },
          { d: rrect(-38, -76, 72, 20, 8), f: K.red },
          { d: rrect(-28, -82, 14, 8, 2), f: '#2b2d3a' },
          { d: rrect(-32, -50, 32, 30, 3), f: '#3b3f4b', ln: true },
          { d: rrect(6, -48, 24, 14, 2), f: '#e9ecef', ln: true },
          { d: 'M-46 -10V-62Q-46 -70 -40 -70', st: K.out, sw: 4 },
          { d: 'M44 -10V-62Q44 -70 38 -70', st: K.out, sw: 4 },
        ]}
      />
      <path d="M-27 -44H-5M-27 -37H-5M-27 -30H-5" stroke="#59606e" stroke-width={2.2} />
      <circle cx={12} cy={-41} r={2.6} fill={K.out} />
      <circle cx={24} cy={-41} r={2.6} fill={K.out} />
      {running && (
        <g fill="none" stroke={K.ink} stroke-width={2.4} stroke-linecap="round" opacity={0.7}>
          <path d="M-56 -60q-5 8 0 16M-63 -56q-4 5 0 10" />
          <path d="M-56 -36q-5 8 0 16" />
        </g>
      )}
    </G>
  );
}
/** Egzoz ucu (sahne koordinatı) */
const genExhaust = (x: number, y: number, s: number): P => [x + 62 * s, y - 39 * s];
/** Yakıt kapağı (sahne koordinatı) */
const genCap = (x: number, y: number, s: number): P => [x - 21 * s, y - 82 * s];

/** Yakıt bidonu. x,y = MERKEZ, a dönüş; ağız yerel (14,-40) */
function Jerrycan({ x, y, s = 1, a = 0, color = '#d0473d' }: { x: number; y: number; s?: number; a?: number; color?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={ow(s)}
        sh={[
          { d: capsule([14, -32], 4.5, [24, -52], 3.6), f: '#3b3f4b' },
          { d: 'M-26 -32Q-26 -38 -20 -38H10L26 -26V30Q26 36 20 36H-20Q-26 36 -26 30Z', f: color },
          { d: 'M12 -34L26 -24V30Q26 36 20 36H12Z', f: shade(color, 0.15), no: true },
          { d: rrect(-20, -50, 26, 10, 4), f: shade(color, 0.1) },
          { d: 'M-20 -14L16 22M16 -14L-20 22', st: shade(color, 0.3), sw: 2.4 },
        ]}
      />
    </G>
  );
}
const canSpout = (x: number, y: number, s: number, a: number): P => {
  const r = a * R, lx = 24 * s, ly = -52 * s;
  return [x + lx * Math.cos(r) - ly * Math.sin(r), y + lx * Math.sin(r) + ly * Math.cos(r)];
};

/** Kova (yandan). x,y = taban ortası */
function Bucket({ x, y, s = 1, c = '#5d8fc4', water = true }: { x: number; y: number; s?: number; c?: string; water?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={ow(s)}
        sh={[
          { d: 'M-21 -40Q0 -66 21 -40', st: K.out, sw: 2.4 },
          { d: 'M-22 -40H22L17 -3Q17 0 14 0H-14Q-17 0 -17 -3Z', f: c },
          { d: 'M8 -40H22L17 -3Q17 0 14 0H6Z', f: shade(c, 0.15), no: true },
          { d: ell([0, -40], 22, 5), f: water ? K.water : shade(c, 0.3) },
        ]}
      />
    </G>
  );
}

/** LPG tüpü (yandan). x,y = taban ortası; a dönüş (taban etrafında). dent/rust/broken: hasarlı */
const TUBE = '#4f86c6';
function Tube({ x, y, s = 1, a = 0, dent, rust, broken, c = TUBE }: { x: number; y: number; s?: number; a?: number; dent?: boolean; rust?: boolean; broken?: boolean; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={ow(s)}
        sh={[
          { d: rrect(-22, -7, 44, 7, 2), f: shade(c, 0.35) },
          { d: 'M-25 -10V-68Q-25 -86 -10 -90H10Q25 -86 25 -68V-10Q25 -4 19 -4H-19Q-25 -4 -25 -10Z', f: c },
          { d: 'M12 -89Q25 -85 25 -68V-10Q25 -4 19 -4H12Z', f: shade(c, 0.15), no: true },
          { d: 'M-25 -50H25', st: shade(c, 0.3), sw: 1.6 },
          broken
            ? { d: rrect(-5, -100, 10, 12, 2), t: 'rotate(-28 0 -90)', f: '#c9a24a' }
            : { d: rrect(-5, -102, 10, 14, 2), f: '#d6b04a' },
          { d: 'M-15 -88V-108H15V-88', st: K.out, sw: 7 },
          { d: 'M-15 -88V-108H15V-88', st: shade(c, 0.25), sw: 4 },
        ]}
      />
      {!dent && <path d="M-16 -74V-20" stroke="#fff" stroke-width={3} opacity={0.35} stroke-linecap="round" />}
      {dent && <path d="M-25 -64Q-10 -56 -24 -40M-10 -30q8 6 2 14" fill="none" stroke={shade(c, 0.45)} stroke-width={3} stroke-linecap="round" />}
      {dent && <path d="M-25 -64Q-12 -56 -24 -40Z" fill={shade(c, 0.3)} />}
      {rust && (
        <g fill="#9a5a2c" opacity={0.9}>
          <ellipse cx={8} cy={-30} rx={9} ry={6} />
          <ellipse cx={-6} cy={-12} rx={7} ry={4} />
          <ellipse cx={14} cy={-66} rx={5} ry={4} />
        </g>
      )}
      {broken && <path d="M4 -104l5 -5l-2 6l6 -3" stroke={K.out} stroke-width={1.6} fill="none" />}
    </G>
  );
}

/** Powerbank (karşıdan). MERKEZ */
function Powerbank({ x, y, s = 1, a = 0, c = '#2f3542' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={ow(s)} sh={[{ d: rrect(-15, -26, 30, 52, 6), f: c }, { d: rrect(5, -26, 10, 52, 6), f: shade(c, 0.2), no: true }, { d: rrect(-6, 20, 12, 4, 1), f: '#596273', no: true }]} />
      {[-6, 0, 6].map((d, i) => <circle key={i} cx={d} cy={12} r={1.8} fill={i < 2 ? K.safe : '#596273'} />)}
      <Bolt x={0} y={-6} s={0.45} />
    </G>
  );
}

/** Akıllı telefon, ekranı serbest (MERKEZ). children = ekran içeriği (yerel; ekran -16..16 × -31..27) */
function BigPhone({ x, y, s = 1, a = 0, children, screen = '#eaf4fb' }: { x: number; y: number; s?: number; a?: number; children?: ComponentChildren; screen?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={ow(s)} sh={[{ d: rrect(-19, -36, 38, 72, 7), f: '#2f3542' }]} />
      <rect x={-16} y={-31} width={32} height={58} rx={3} fill={screen} />
      <rect x={-5} y={-34} width={10} height={1.6} rx={0.8} fill="#596273" />
      {children}
    </G>
  );
}
/** Ekranda şarj olan pil simgesi (yerel) */
function ChargeIcon({ x = 0, y = 0, k = 1 }: { x?: number; y?: number; k?: number }) {
  return (
    <G x={x} y={y} s={k}>
      <rect x={-8} y={-14} width={16} height={28} rx={2.5} fill="none" stroke={K.ink} stroke-width={1.8} />
      <rect x={-3.5} y={-17} width={7} height={3} rx={1} fill={K.ink} />
      <rect x={-5.5} y={-1} width={11} height={12.5} rx={1} fill={K.safe} />
      <path d="M1.5 -11L-4.5 1H0L-2 9L4.5 -3H0Z" fill="#ffd23a" stroke={K.ink} stroke-width={0.8} stroke-linejoin="round" />
    </G>
  );
}

/** Katlanır güneş paneli (3/4 görünüş, yüzü sol üste). x,y = alt kenar ortası */
function SolarPanel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // iki kanat: sol ve sağ, alt kenar y=0, üst kenar geriye yatık
  const wing = (x0: number, x1: number): Sh[] => {
    const A: P = [x0, 0], B: P = [x1, 0], C: P = [x1 + 18, -56], D: P = [x0 + 18, -56];
    const lines: string[] = [];
    for (let i = 1; i < 4; i++) {
      const t = i / 4;
      lines.push(`M${f1(A[0] + (D[0] - A[0]) * t)} ${f1(A[1] + (D[1] - A[1]) * t)}L${f1(B[0] + (C[0] - B[0]) * t)} ${f1(B[1] + (C[1] - B[1]) * t)}`);
    }
    for (let i = 1; i < 3; i++) {
      const t = i / 3;
      const p = [A[0] + (B[0] - A[0]) * t, 0], q = [D[0] + (C[0] - D[0]) * t, -56];
      lines.push(`M${f1(p[0])} 0L${f1(q[0])} -56`);
    }
    return [
      { d: `M${A[0] - 3} 3L${B[0] + 3} 3L${C[0] + 3} ${C[1] - 3}L${D[0] - 3} ${D[1] - 3}Z`, f: '#c9d2da' },
      { d: `M${A[0]} 0L${B[0]} 0L${C[0]} ${C[1]}L${D[0]} ${D[1]}Z`, f: '#2c4a86', ln: true },
      { d: lines.join(''), st: '#7d9ad6', sw: 1.2 },
      { d: `M${D[0] + 4} ${D[1] + 6}L${D[0] + 16} ${D[1] + 6}L${D[0] + 6} ${D[1] + 22}Z`, f: '#ffffff', op: 0.25, no: true },
    ];
  };
  return (
    <G x={x} y={y} s={s}>
      <OG ow={ow(s)} sh={[{ d: 'M40 -40L66 4', st: K.out, sw: 4.4 }, { d: 'M40 -40L66 4', st: '#8a919c', sw: 2.4 }, { d: 'M-10 -40L14 4', st: K.out, sw: 4.4 }, { d: 'M-10 -40L14 4', st: '#8a919c', sw: 2.4 }]} />
      <OG ow={ow(s)} sh={[...wing(-56, -2), ...wing(2, 56)]} />
      <OG ow={ow(s)} sh={[{ d: rrect(48, -14, 12, 9, 2), f: '#3b3f4b' }]} />
    </G>
  );
}
/** Panelin kablo çıkışı */
const panelOut = (x: number, y: number, s: number): P => [x + 60 * s, y - 9 * s];

/** Sigorta kutusu (kapağı açık). x,y = SOL ÜST */
function FuseBox({ x, y, w = 64, h = 80 }: { x: number; y: number; w?: number; h?: number }) {
  const rows = [y + 18, y + 46];
  return (
    <g>
      <OG
        sh={[
          { d: rrect(x, y, w, h, 4), f: '#e9ecef' },
          { d: rrect(x + 6, y + 6, w - 12, h - 12, 2), f: '#cfd4da', ln: true },
          ...rows.map((ry) => ({ d: rrect(x + 9, ry, w - 18, 22, 1.5), f: '#f7f7f5', ln: true })),
          { d: `M${x} ${y + 4}L${x - 18} ${y + 12}V${y + h + 6}L${x} ${y + h - 4}Z`, f: '#dfe3e8' },
        ]}
      />
      {rows.map((ry) =>
        [0, 1, 2, 3].map((i) => <rect key={ry + '-' + i} x={x + 13 + i * ((w - 26) / 4)} y={ry + 4} width={7} height={14} rx={1.5} fill={i === 1 && ry === rows[0] ? K.danger : '#3b3f4b'} />),
      )}
    </g>
  );
}

/** Ölçü aleti (multimetre). MERKEZ */
function Meter({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={ow(s)} sh={[{ d: rrect(-12, -20, 24, 40, 4), f: '#f2c230' }, { d: rrect(-8, -15, 16, 10, 1.5), f: '#cfe8c8', ln: true }, { d: circ([0, 7], 5.5), f: '#3b3f4b' }]} />
      <path d="M0 7l3 -3" stroke="#fff" stroke-width={1.4} />
    </G>
  );
}

/** Basit kaldırım (zemin üstüne) */
function Pavement({ y }: { y: number }) {
  return (
    <g>
      <rect x={0} y={y} width={320} height={240 - y} fill="#b9b7b0" />
      <rect x={0} y={y} width={320} height={3} fill="#9f9d96" />
      {[40, 110, 180, 250].map((xx) => <path key={xx} d={`M${xx} ${y + 4}l-14 ${240 - y}`} stroke="#a3a19a" stroke-width={1.5} />)}
    </g>
  );
}

/** Apartman cephesi. x = SOL, y = zemin. open: pencereler açık */
function Apartment({ x, y, w = 120, floors = 3, fh = 44, open = true, night }: { x: number; y: number; w?: number; floors?: number; fh?: number; open?: boolean; night?: boolean }) {
  const H = floors * fh;
  const c = night ? '#3b4561' : '#e6d3b8';
  const sh: Sh[] = [{ d: rrect(x, y - H - 10, w, H + 10, 2), f: c }, { d: rrect(x - 4, y - H - 14, w + 8, 8, 2), f: shade(c, 0.2) }];
  const ww = w * 0.24;
  for (let f = 0; f < floors; f++) {
    const fy = y - (f + 1) * fh + 8;
    for (let i = 0; i < 3; i++) {
      const wx = x + w * 0.08 + i * (w * 0.3);
      if (f === 0 && i === 1) continue;
      sh.push({ d: rrect(wx, fy, ww, fh * 0.55, 1), f: night ? '#1b2236' : open ? '#3a3530' : '#bfe3f5', ln: true });
      if (open && !night) sh.push({ d: `M${f1(wx)} ${fy}L${f1(wx - ww * 0.4)} ${fy + 4}V${f1(fy + fh * 0.55 + 4)}L${f1(wx)} ${f1(fy + fh * 0.55)}Z`, f: '#cfe9f6' });
    }
  }
  sh.push({ d: rrect(x + w * 0.4, y - fh * 0.8, w * 0.2, fh * 0.8, 1), f: '#7a5236', ln: true });
  return <OG sh={sh} />;
}

/* ════════════════════════ sahneler ════════════════════════ */

const DARKWALL = '#454c63';

/* ─── Oyuncular (rehber başına sabit; rehber içinde değişmez) ─── */
type Cast = Pick<PersonProps, 'who' | 'role' | 'skin' | 'hair' | 'hairC' | 'mustache'>;
/** tesisat-gaz-kacagi */
const GAZ: Cast = { who: 'woman', role: 'bystander', hair: 'ponytail', hairC: K.hair.dark, skin: 1 };
/** tesisat-elektrik-kesintisi ve tesisat-hasarli-elektrik (aynı ev sahibi) */
const KES: Cast = { who: 'woman', role: 'bystander4', hair: 'scarf', hairC: '#3f6f8f', skin: 1 };
/** tesisat-boru-patlamasi */
const BORU: Cast = { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.brown, skin: 1 };
/** tesisat-jenerator */
const JEN: Cast = { who: 'man', role: 'bystander2', hair: 'short', hairC: K.hair.black, skin: 2 };
/** tesisat-gunes-powerbank */
const GNS: Cast = { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.black, skin: 2 };
/** tesisat-tup-guvenligi */
const TUP: Cast = { who: 'man', role: 'helper', hair: 'short', hairC: K.hair.brown, skin: 1 };
const sleeveOf = (c: Cast) => K.role[c.role ?? 'helper'];

/** Sigorta kutusunda ana şalteri indiren el (yakın plan). Yangın kategorisi de kullanır. */
export function salterScene(sleeve: string, skin: number) {
  return () => {
    const bx = 70, by = 30, bw = 180, bh = 180;
    const mx = 196, my = 100;
    return (
      <Scene2 bg="indoor" wall="#dfe3e6">
        <OG sh={[{ d: rrect(bx, by, bw, bh, 6), f: '#b9c2cc' }, { d: rrect(bx + 10, by + 10, bw - 20, bh - 20, 4), f: '#e9ecef', ln: true }]} />
        {[0, 1, 2, 3].map((i) => (
          <OG key={i} sh={[{ d: rrect(bx + 20 + i * 22, by + 50, 16, 40, 2), f: '#fbfaf7' }, { d: rrect(bx + 23 + i * 22, by + 58, 10, 12, 1.5), f: '#3b3f4b' }]} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <OG key={'b' + i} sh={[{ d: rrect(bx + 20 + i * 22, by + 110, 16, 40, 2), f: '#fbfaf7' }, { d: rrect(bx + 23 + i * 22, by + 118, 10, 12, 1.5), f: '#3b3f4b' }]} />
        ))}
        <OG sh={[{ d: rrect(mx - 22, my - 46, 44, 92, 4), f: '#fbfaf7' }, { d: rrect(mx - 12, my + 8, 24, 30, 3), f: K.danger }]} />
        <Hand x={mx + 34} y={my - 40} a={200} s={1.2} pose="point" side="L" arm={140} sleeve={sleeve} skin={skin} />
        <Arrow from={[mx + 50, my + 4]} to={[mx + 50, my + 58]} w={6} />
      </Scene2>
    );
  };
}

/** Basit buzdolabı (karşıdan). x = SOL, y = zemin */
function Fridge({ x, y, w = 104, h = 190 }: { x: number; y: number; w?: number; h?: number }) {
  const c = '#eef1f4';
  return (
    <OG sh={[
      { d: rrect(x, y - h, w, h, 8), f: c },
      { d: rrect(x + w - 16, y - h, 16, h, 8), f: shade(c, 0.08), no: true },
      { d: `M${x} ${y - h * 0.66}H${x + w}`, st: K.out, sw: 2 },
      { d: rrect(x + 10, y - h + 18, 6, 30, 3), f: '#9aa3ad' },
      { d: rrect(x + 10, y - h * 0.66 + 14, 6, 44, 3), f: '#9aa3ad' },
    ]} />
  );
}

export const SCENES: Record<string, ArtFn> = {
  /* ─────────────── Gaz kaçağı ─────────────── */
  'tesisat-dugme-yasak': () => {
    const sw: P = [96, 96];
    const h = aim({ a: -38, s: 1.45, pose: 'point' as const, side: 'R' as const }, [sw[0] + 2, sw[1] + 4]);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.wall} />
        <Gas x={150} y={66} s={1.1} n={3} />
        <Gas x={36} y={232} s={0.9} n={2} />
        <SwitchPlate x={sw[0]} y={sw[1]} s={2.1} />
        <Socket x={sw[0]} y={196} s={1.25} />
        <Hand {...h} arm={240} sleeve={K.role.bystander} skin={1} />
        <No x={sw[0] + 4} y={sw[1] + 2} r={56} />
        <Doorbell x={250} y={96} s={1.9} />
        <No x={250} y={98} r={44} />
      </Scene2>
    );
  },

  'tesisat-ates-yasak': () => {
    const burner: P = [140, 120];
    const hh = { a: -58, s: 1.2, pose: 'hold' as const, side: 'R' as const, grip: 22 };
    const g0 = handPoint({ ...hh, x: 0, y: 0 }, 'grip');
    // çakmak alevinin ucu brülöre yakın olsun: tutuş noktası brülörden ~44 birim geride
    const gp = pol(burner, -58 + 90 - 180 + 180 + 0, 0);
    const grip: P = [burner[0] + 44, burner[1] + 30];
    void gp;
    const h = { ...hh, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="indoor" wall="#e8dcc6">
        <rect x={30} y={30} width={260} height={60} fill="#f3ead9" />
        <path d="M30 50H290M30 70H290M82 30V90M134 30V90M186 30V90M238 30V90" stroke="#ddd0b8" stroke-width={1.5} />
        <Counter x={10} y={218} w={74} h={84} />
        <Counter x={236} y={218} w={74} h={84} />
        <Range x={160} y={220} s={1.0} />
        <Gas x={128} y={96} s={0.9} n={3} gap={20} />
        <Hand {...h} arm={240} sleeve={sleeveOf(GAZ)} skin={GAZ.skin}>
          <Lighter x={grip[0]} y={grip[1]} s={1.4} a={-58} />
        </Hand>
        <No x={150} y={116} r={50} />
        <Match x={46} y={110} s={1} a={-12} />
        <No x={44} y={84} r={30} />
        <Cigarette x={250} y={80} s={0.9} a={-8} />
        <No x={274} y={72} r={30} />
      </Scene2>
    );
  },

  'tesisat-pencere-ac': () => {
    const wx = 214, wy = 40, ww = 74, wh = 92;
    const handle: P = [wx - 14, wy + 50];
    return (
      <Scene2 bg="indoor" wall="#e8dcc6">
        <Door x={22} y={204} open />
        {/* açık pencere: dışarısı görünür, kanat içeri sonuna kadar açık */}
        <OG sh={[{ d: rrect(wx, wy, ww, wh, 2), f: '#f4f1ea' }, { d: rrect(wx + 6, wy + 6, ww - 12, wh - 12, 1), f: K.sky, ln: true }, { d: rrect(wx - 6, wy + wh - 2, ww + 12, 8, 2), f: '#f4f1ea' }]} />
        <path d={`M${wx + 6} ${wy + wh - 26}Q${wx + 30} ${wy + wh - 44} ${wx + ww - 6} ${wy + wh - 30}V${wy + wh - 6}H${wx + 6}Z`} fill={K.hill} />
        <OG sh={[{ d: `M${wx} ${wy + 2}L${wx - 22} ${wy - 6}V${wy + wh + 2}L${wx} ${wy + wh - 4}Z`, f: '#f4f1ea' }, { d: `M${wx - 4} ${wy + 8}L${wx - 18} ${wy + 3}V${wy + wh - 6}L${wx - 4} ${wy + wh - 10}Z`, f: '#d6eef9', ln: true }, { d: rrect(handle[0] - 3, handle[1] - 8, 5, 14, 2), f: K.metal }]} />
        <Counter x={196} y={218} w={110} h={70} />
        <Gas x={98} y={68} s={1} n={3} gap={22} />
        <Gas x={150} y={50} s={0.9} n={2} gap={20} />
        <Person {...GAZ} x={150} y={226} s={1.08}
          pose={{ ...POSE.standSide, head: -84, armF: { to: [handle[0] + 1, handle[1] + 2] }, armB: [100, 60], face: 'worried' }} />
        <Arrow from={[150, 30]} to={[250, 30]} bend={-0.15} />
        <Arrow from={[96, 92]} to={[40, 112]} bend={0.2} />
      </Scene2>
    );
  },

  'tesisat-disaridan-187': () => {
    // telefon kulakta (dışarıda, binadan uzakta arıyor); numara etikette
    const p: PersonProps = { ...GAZ, x: 236, y: 228, s: 1.25, pose: { ...POSE.standSide, armF: { at: 'head', d: [6, 8] }, handF: 'fist', armB: [96, 96], face: 'speak' } };
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Apartment x={12} y={186} w={128} floors={3} fh={46} />
        <rect x={0} y={186} width={320} height={60} fill="#b9b7b0" />
        <rect x={0} y={186} width={320} height={3} fill="#9f9d96" />
        <Gas x={40} y={60} s={0.8} n={2} gap={30} />
        <Gas x={92} y={110} s={0.8} n={2} gap={20} />
        <Tree x={170} y={190} s={0.7} />
        <Person {...p} mid={(r) => <Phone x={r.head[0] + 8} y={r.head[1] + 6} s={0.42} a={-10} />} />
        <Label x={286} y={40} text="187" size={20} />
        <Dim a={[146, 232]} b={[214, 232]} />
      </Scene2>
    );
  },

  /* ─────────────── Elektrik kesintisi ─────────────── */
  'tesisat-fener-mum': () => {
    const tl: P = [118, 214];
    const top = tl[1] - 60;
    const lamp: P = [176, top];
    return (
      <Scene2 bg="indoor" wall={DARKWALL}>
        <rect width={320} height={240} fill="#121726" opacity={0.45} />
        <circle cx={lamp[0]} cy={lamp[1] - 26} r={110} fill="#ffe27a" opacity={0.12} />
        <circle cx={lamp[0]} cy={lamp[1] - 26} r={64} fill="#ffe27a" opacity={0.14} />
        <Chair x={84} y={214} />
        <Person {...KES} x={84} y={214} s={1.08} pose={{ ...POSE.sitChair, armF: { to: [lamp[0] - 40, top - 3] }, armB: { to: [lamp[0] - 50, top - 3] }, face: 'neutral' }} />
        <Table x={tl[0]} y={tl[1]} w={130} h={60} />
        <Lantern x={lamp[0]} y={top} s={1.1} />
        <Ok x={36} y={46} r={15} />
        <Panel x={220} y={12} w={90} h={74} bg="#2a3046">
          <rect x={0} y={54} width={90} height={20} fill={K.wood} />
          <Candle x={45} y={60} s={0.9} />
          <No x={45} y={38} r={27} />
        </Panel>
      </Scene2>
    );
  },

  'tesisat-fis-cek': () => {
    const s1: P = [96, 142], s2: P = [184, 142];
    const ps = 1.35;
    const pinTip: P = [s2[0] + 30, s2[1]];
    const hh = { a: -90, s: 1.2, pose: 'hold' as const, side: 'R' as const, grip: 30, view: 'back' as const };
    const body: P = [pinTip[0] + 24 * ps, pinTip[1]];
    const h = aim(hh, body, 'grip');
    const tail2 = plugTail(pinTip[0], pinTip[1], ps, -90);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#e7dfd0" />
        {/* tavan lambası */}
        <path d="M160 0V24" stroke={K.out} stroke-width={2.5} />
        <OG sh={[{ d: 'M140 40Q140 22 160 22Q180 22 180 40Z', f: '#e9ecef' }, { d: circ([160, 44], 6), f: '#f4f1ea' }]} />
        <SwitchPlate x={42} y={58} s={1.2} on />
        <Ok x={66} y={34} r={11} />
        <OG sh={[{ d: rrect(52, 112, 176, 60, 8), f: PLATE }]} />
        <Socket x={s1[0]} y={s1[1]} s={1.15} />
        <Socket x={s2[0]} y={s2[1]} s={1.15} />
        {/* 1. fiş çekilmiş, aşağıda sarkıyor */}
        <Cable pts={[[56, 226], [80, 214], [96, 186], plugTail(114, 210, 1, 160)]} />
        <Plug x={114} y={210} s={1.0} a={160} c="#3b3f4b" />
        <Laptop x={44} y={234} s={1.1} />
        {/* 2. fiş eldeyken çekiliyor */}
        <Cable pts={[tail2, [tail2[0] + 16, tail2[1] + 30], [tail2[0] + 6, 212], [250, 222]]} />
        <TV x={276} y={234} s={0.7} />
        <Plug x={pinTip[0]} y={pinTip[1]} s={ps} a={-90} />
        <Hand {...h} arm={200} sleeve={sleeveOf(KES)} skin={KES.skin} />
        <Arrow from={[210, 96]} to={[276, 96]} />
      </Scene2>
    );
  },

  'tesisat-186-ara': () => {
    const h = { x: 160, y: 250, a: 6, s: 1.6, pose: 'hold' as const, side: 'R' as const, grip: 38 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="night" gy={196}>
        <Apartment x={-10} y={196} w={110} floors={3} fh={42} night />
        <Apartment x={226} y={196} w={110} floors={3} fh={46} night />
        <rect x={0} y={196} width={320} height={50} fill="#3a4152" />
        <StreetLamp x={110} y={200} h={120} />
        <StreetLamp x={212} y={200} h={110} />
        <Hand {...h} arm={40} sleeve={sleeveOf(KES)} skin={KES.skin}>
          <Phone x={g[0]} y={g[1]} s={1.6} a={6} text="186" />
        </Hand>
        <Waves x={g[0] + 46} y={g[1] - 46} a={-20} n={3} r={9} />
      </Scene2>
    );
  },

  'tesisat-dusen-tel': () => {
    const top: P = [148, 128];
    const end: P = [116, 214];
    const pY = 222; // kişinin ayak hizası
    return (
      <Scene2 bg="outdoor" gy={176}>
        <Pavement y={190} />
        <Tree x={300} y={178} s={0.8} kind="pine" />
        <PowerPole x={14} y={208} a={56} h={158} />
        <path d={`M${top[0]} ${top[1]}Q${top[0] + 10} ${end[1] - 30} ${end[0]} ${end[1]}`} fill="none" stroke={K.out} stroke-width={3.4} />
        <path d={`M${top[0] + 18} ${top[1] - 10}Q${top[0] + 50} ${top[1] + 6} 320 ${top[1] - 20}`} fill="none" stroke={K.out} stroke-width={2.4} />
        <ellipse cx={end[0]} cy={end[1]} rx={48} ry={17} fill={K.danger} opacity={0.14} />
        <ellipse cx={end[0]} cy={end[1]} rx={48} ry={17} fill="none" stroke={K.danger} stroke-width={3} stroke-dasharray="8 6" />
        <Spark x={end[0] - 4} y={end[1] - 4} r={15} />
        <Spark x={end[0] + 14} y={end[1] - 14} r={7} />
        <Person {...KES} x={272} y={pY} s={1.0} pose={{ ...POSE.stand, face: 'worried' }} />
        {/* ölçü: yerdeki tel ucundan kişiye */}
        <Dim a={[end[0], end[1] + 4]} b={[252, end[1] + 4]} />
        <Label x={196} y={196} text="20 m" size={15} />
      </Scene2>
    );
  },

  'tesisat-buzdolabi-kapali': () => (
    <Scene2 bg="indoor" wall="#dfe3e8">
      <Fridge x={70} y={222} w={104} h={190} />
      <Label x={146} y={118} text="4 sa" size={16} />
      <Hand x={250} y={196} a={-80} s={1} pose="open" side="L" view="palm" arm={130} sleeve={sleeveOf(KES)} skin={KES.skin} />
      <No x={210} y={170} r={42} />
    </Scene2>
  ),
  'tesisat-hasarli-salter': salterScene(sleeveOf(KES), KES.skin ?? 1),
  'tesisat-boru-salter': salterScene(sleeveOf(BORU), BORU.skin ?? 1),
  'tesisat-gaz-vana': () => {
    const vx = 150, vy = 160;
    const h = { x: vx, y: 22, a: 180, s: 1.25, pose: 'hold' as const, side: 'R' as const, grip: 16 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(-10, vy - 13, 340, 26, 2), f: '#c9a24a' }, { d: rrect(-10, vy + 4, 340, 9, 0), f: shade('#c9a24a', 0.15), no: true }, { d: rrect(vx - 26, vy - 20, 52, 40, 6), f: '#d6a838' }, { d: circ([vx, vy - 18], 9), f: '#8d96a0' }]} />
        <OG sh={[{ d: capsule([vx, vy - 18], 7.5, [g[0], g[1] - 18], 7), f: '#f5c518' }]} />
        <Hand {...h} arm={60} sleeve={sleeveOf(GAZ)} skin={GAZ.skin}>
          <OG sh={[{ d: rrect(g[0] - 8, g[1] - 36, 16, 50, 6), f: '#f5c518' }]} />
        </Hand>
        <path d={`M${vx + 92} ${vy - 22}H${vx + 30}`} stroke="#b8c0c9" stroke-width={14} stroke-linecap="round" opacity={0.55} />
        <Arrow from={[vx + 100, vy - 40]} to={[vx + 36, g[1] - 10]} bend={0.32} w={6} />
      </Scene2>
    );
  },

  /* ─────────────── Jeneratör ─────────────── */
  'tesisat-jenerator-disarida': () => (
    <Scene2 bg="outdoor" gy={128}>
      <HouseExt x={16} y={136} w={100} h={64} />
      <Tree x={300} y={132} s={0.6} />
      <Generator x={206} y={136} s={0.78} running />
      
      <Ok x={206} y={44} r={16} />
      {/* garaj */}
      <Panel x={8} y={146} w={98} h={88} k={0.5} bg="#bfc3c9">
        <rect x={0} y={150} width={196} height={40} fill="#8d9097" />
        <rect x={30} y={20} width={136} height={130} fill="#9ea3ab" stroke={K.out} stroke-width={3} />
        {[44, 68, 92, 116, 140].map((yy) => <path key={yy} d={`M30 ${yy}H166`} stroke="#80858e" stroke-width={3} />)}
        <Generator x={98} y={168} s={1.1} running />
        <No x={98} y={92} r={64} />
      </Panel>
      {/* bodrum */}
      <Panel x={111} y={146} w={98} h={88} k={0.5} bg="#a8957c">
        <rect x={0} y={150} width={196} height={40} fill="#7d6a52" />
        <rect x={18} y={12} width={50} height={22} fill="#3a4152" stroke={K.out} stroke-width={3} />
        <path d="M150 150V126H166V102H182V78H196" fill="#c9b79c" stroke={K.out} stroke-width={3} />
        <Generator x={92} y={168} s={1.1} running />
        <No x={98} y={92} r={64} />
      </Panel>
      {/* çadır */}
      <Panel x={214} y={146} w={98} h={88} k={0.5} bg={K.sky}>
        <rect x={0} y={160} width={196} height={30} fill={K.grass} />
        <Tent x={98} y={172} s={2.6} />
        <Generator x={100} y={170} s={0.85} running />
        <No x={98} y={92} r={64} />
      </Panel>
    </Scene2>
  ),

  'tesisat-jenerator-mesafe': () => {
    const gx = 214, gy = 214, gs = 0.95;
    const ex = genExhaust(gx, gy, gs);
    return (
      <Scene2 bg="outdoor" gy={186}>
        <HouseExt x={-18} y={210} w={120} h={110} />
        <Smoke x={ex[0] + 4} y={ex[1] - 34} w={46} h={24} kind="cloud" op={0.55} />
        <Generator x={gx} y={gy} s={gs} running />
        <Arrow from={[ex[0] + 4, ex[1] - 4]} to={[312, ex[1] - 26]} w={5} />
        <Dim a={[106, 228]} b={[164, 228]} />
        <Label x={135} y={208} text="6 m" size={16} />
      </Scene2>
    );
  },

  'tesisat-jenerator-tente': () => {
    const fl: P = [62, 220], fr: P = [236, 220], bl: P = [96, 186], br: P = [270, 186];
    const ht = 96;
    const t = (p: P, d = 0): P => [p[0], p[1] - ht + d];
    const tarp = '#4c8f73';
    return (
      <Scene2 bg="outdoor" gy={176}>
        <rect width={320} height={240} fill="#55627a" opacity={0.28} />
        <path d={`M${fl[0] - 14} ${fl[1] + 6}L${fr[0] + 18} ${fr[1] + 6}L${br[0] + 18} ${br[1] - 4}L${bl[0] - 14} ${bl[1] - 4}Z`} fill="#c7c4bd" stroke={K.out} stroke-width={1.6} />
        <path d={`M${fl[0] - 14} ${fl[1] + 6}L${fr[0] + 18} ${fr[1] + 6}V${fr[1] + 12}H${fl[0] - 14}Z`} fill="#a9a6a0" stroke={K.out} stroke-width={1.6} />
        {[bl, br].map((p, i) => <OG key={i} sh={[{ d: rrect(p[0] - 2.5, p[1] - ht, 5, ht, 1.5), f: '#6b6f78' }]} />)}
        <Generator x={166} y={214} s={1.0} running />
        {[fl, fr].map((p, i) => <OG key={i} sh={[{ d: rrect(p[0] - 3, p[1] - ht, 6, ht, 1.5), f: '#7b808a' }]} />)}
        <OG sh={[{ d: `M${t(fl)[0]} ${t(fl)[1]}L${t(fr)[0]} ${t(fr)[1]}L${t(br)[0]} ${t(br)[1]}L${t(bl)[0]} ${t(bl)[1]}Z`, f: tarp }, { d: `M${t(fl)[0]} ${t(fl)[1]}L${t(fr)[0]} ${t(fr)[1]}V${t(fr)[1] + 7}H${t(fl)[0]}Z`, f: shade(tarp, 0.18) }]} />
        <Rain x={10} y={6} w={300} h={80} n={18} />
        <Rain x={6} y={120} w={40} h={90} n={5} />
        <Rain x={278} y={110} w={36} h={90} n={5} />
        {[90, 140, 190, 236].map((xx, i) => <Drop key={i} x={xx} y={t(fl)[1] - 18 - (i % 2) * 6} s={0.8} />)}
      </Scene2>
    );
  },

  'tesisat-priz-baglama-yasak': () => {
    const sock: P = [100, 132];
    const pin: P = [sock[0] + 16, sock[1] + 12];
    const pa = -58;
    const tail = plugTail(pin[0], pin[1], 1.1, pa);
    return (
      <Scene2 bg="outdoor" gy={176}>
        {/* ev içi */}
        <rect x={0} y={0} width={178} height={240} fill={K.wall} />
        <rect x={0} y={200} width={178} height={40} fill={K.floor} />
        <rect x={0} y={200} width={178} height={3} fill={K.floorShade} />
        <OG sh={[{ d: rrect(172, 0, 16, 240, 0), f: '#cdbfa6' }]} />
        <Socket x={sock[0]} y={sock[1]} s={1.35} />
        {/* kablo duvardaki delikten dışarı jeneratöre */}
        <Cable pts={[tail, [tail[0] + 20, tail[1] + 30], [150, 196], [180, 200], [210, 204], [234, 196]]} c="#e2b23a" />
        <Plug x={pin[0]} y={pin[1]} s={1.1} a={pa} c="#3b3f4b" />
        <Generator x={232} y={226} s={0.6} running />
        <Plug x={246} y={198} s={0.6} a={-90} c="#3b3f4b" />
        {/* direkteki teknisyen */}
        <PowerPole x={292} y={230} h={196} />
        <path d="M188 52Q240 70 292 46" fill="none" stroke={K.out} stroke-width={2.2} />
        <Person x={286} y={140} s={0.56} flip who="man" role="helper2" skin={1} hair="short" pose={{ ...POSE.standSide, armF: { to: [293, 80] }, armB: { to: [292, 96] }, legF: [70, 110], face: 'worried' }}
          over={(r) => <path d={`M${r.head[0] - 9} ${r.head[1] - 1}A9.5 9.5 0 0 1 ${r.head[0] + 9} ${r.head[1] - 1}Z`} fill="#f5c518" stroke={K.out} stroke-width={1.2} />} />
        <Bolt x={248} y={80} s={1.2} a={14} />
        <No x={sock[0] + 8} y={sock[1] + 6} r={46} />
      </Scene2>
    );
  },

  'tesisat-yakit-soguk': () => {
    // Jeneratör kapalı ve hâlâ sıcak; kişi bidonu yere koymuş, soğumasını bekliyor.
    const gx = 222, gy = 222, gs = 1.05;
    return (
      <Scene2 bg="outdoor" gy={186}>
        <Generator x={gx} y={gy} s={gs} />
        <Heat x={gx - 6} y={gy - 96} s={1.1} n={3} />
        <Jerrycan x={150} y={190} s={0.72} />
        <Person {...JEN} x={92} y={226} s={1.1} pose={{ ...POSE.standSide, armF: [100, 92], face: 'neutral' }} over={gloves('#e8c43a')} />
        <Timer x={150} y={60} r={18} />
        <Label x={250} y={36} text="kapat → soğut" size={13} />
      </Scene2>
    );
  },

  /* ─────────────── Su borusu ─────────────── */
  'tesisat-su-vanasi-kapat': () => {
    const py = 120;
    const vx = 214;
    const lever: P = [vx, py + 70];
    const h = aim({ a: 0, s: 1.25, pose: 'fist' as const, side: 'R' as const }, [lever[0] - 2, lever[1] - 8], 'grip');
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#dfe3e6" />
        <OG sh={[{ d: rrect(-10, py - 11, 340, 22, 3), f: '#b9c2cc' }, { d: rrect(-10, py + 4, 340, 7, 0), f: '#a3adb8', no: true }]} />
        {/* su sayacı */}
        <OG sh={[{ d: rrect(56, py - 20, 92, 40, 6), f: '#c9a24a' }, { d: circ([102, py - 20], 30), f: '#c9a24a' }, { d: circ([102, py - 20], 23), f: '#fbfaf5', ln: true }]} />
        <rect x={88} y={py - 30} width={28} height={9} rx={1.5} fill={K.ink} />
        <text x={102} y={py - 23} text-anchor="middle" font-size={7.5} font-weight={700} fill="#fff" font-family="'IBM Plex Mono', monospace">0347</text>
        <path d={`M102 ${py - 12}l9 -6`} stroke={K.danger} stroke-width={2.2} stroke-linecap="round" />
        {/* vana */}
        <OG sh={[{ d: rrect(vx - 22, py - 16, 44, 32, 5), f: '#d6b04a' }, { d: circ([vx, py], 8), f: '#b8932f', ln: true }]} />
        {/* eski (açık) konum: boruya paralel, kesikli */}
        <path d={`M${vx + 6} ${py - 4}H${vx + 76}`} stroke={K.out} stroke-width={13} stroke-dasharray="6 6" opacity={0.25} stroke-linecap="round" />
        <OG sh={[{ d: capsule([vx, py], 6, lever, 7), f: '#2f7fd0' }]} />
        <Hand {...h} arm={220} sleeve={K.role.helper} skin={1} />
        <Arrow from={[vx + 80, py + 10]} to={[vx + 34, py + 76]} bend={-0.3} />
      </Scene2>
    );
  },

  'tesisat-musluk-ac': () => {
    const cx = 140;
    const spout: P = [cx, 74];
    const hdl: P = [cx + 32, 96];
    const h = aim({ a: -70, s: 1.15, pose: 'pinch' as const, side: 'R' as const }, [hdl[0] + 6, hdl[1] - 4], 'pinch');
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#e7ecef" />
        <g stroke="#cfd8de" stroke-width={1.5}>
          {[24, 52, 80].map((yy) => <path key={yy} d={`M0 ${yy}H320`} />)}
          {[40, 100, 160, 220, 280].map((xx) => <path key={xx} d={`M${xx} 0V108`} />)}
        </g>
        {/* tezgâh + lavabo */}
        <OG sh={[{ d: rrect(-4, 108, 328, 18, 2), f: '#9aa3ad' }, { d: rrect(54, 110, 172, 12, 6), f: '#5d6672', ln: true }, { d: rrect(-4, 126, 328, 120, 0), f: '#e7d7bf' }]} />
        <OG sh={[{ d: rrect(14, 138, 140, 96, 3), f: '#3a3530' }, { d: rrect(166, 138, 140, 96, 3), f: tint('#e7d7bf', 0.2) }]} />
        {/* dolap içi borular */}
        <OG sh={[{ d: rrect(cx - 34, 126, 10, 108, 2), f: K.metal }, { d: 'M96 126V150Q96 166 112 166H130V234H120V176H112Q86 176 86 150V126Z', f: '#c9d2da' }]} />
        <Arrow from={[cx - 52, 150]} to={[cx - 52, 222]} w={6} />
        {/* batarya */}
        <OG
          sh={[
            { d: rrect(cx - 40, 98, 80, 12, 4), f: '#c9d2da' },
            { d: `M${cx - 6} 100V64Q${cx - 6} 52 ${cx + 6} 52H${cx + 14}Q${cx + 26} 52 ${cx + 26} 64V68H${cx + 16}V64Q${cx + 16} 62 ${cx + 14} 62H${cx + 8}Q${cx + 6} 62 ${cx + 6} 64V100Z`, f: '#c9d2da' },
            { d: rrect(cx - 36, 88, 14, 12, 3), f: '#c9d2da' },
            { d: rrect(cx - 48, 84, 26, 7, 3.5), f: K.danger },
            { d: rrect(cx + 22, 88, 14, 12, 3), f: '#c9d2da' },
            { d: rrect(hdl[0] - 4, hdl[1] - 30, 8, 26, 3.5), f: '#2f7fd0' },
          ]}
        />
        <Drop x={spout[0] + 21} y={84} s={0.8} />
        <Drop x={spout[0] + 21} y={100} s={0.65} />
        <Hand {...h} arm={200} sleeve={sleeveOf(BORU)} skin={BORU.skin} />
        <Arrow from={[hdl[0] + 28, 56]} to={[hdl[0] + 8, 24]} bend={0.4} w={5} />
      </Scene2>
    );
  },

  'tesisat-kova-havlu': () => {
    const wring: P = [204, 154];
    return (
      <Scene2 bg="indoor" wall="#e3e7e2">
        {/* patlamış boru */}
        <OG sh={[{ d: rrect(44, -4, 14, 206, 2), f: '#b9c2cc' }, { d: rrect(40, 118, 22, 10, 2), f: '#a3adb8' }]} />
        <path d="M58 112l8 -6l-6 10l10 -2" stroke={K.out} stroke-width={1.6} fill="none" />
        <path d="M60 112q22 -6 34 8" fill="none" stroke={K.water} stroke-width={3} stroke-linecap="round" />
        <Drop x={70} y={140} s={0.9} />
        <Drop x={86} y={160} s={0.8} />
        <Drop x={60} y={168} s={0.9} />
        <ellipse cx={120} cy={216} rx={112} ry={16} fill={K.water} opacity={0.75} stroke={K.out} stroke-width={1.4} />
        <path d="M40 214h20M110 222h24M170 212h16" stroke={K.waterLight} stroke-width={2} stroke-linecap="round" />
        {/* sandalye ve üstüne kaldırılan eşyalar */}
        <Chair x={286} y={214} flip />
        <OG sh={[{ d: rrect(266, 140, 40, 26, 2), f: '#c99a62' }, { d: 'M266 150H306', st: shade('#c99a62', 0.3), sw: 1.6 }, { d: rrect(272, 124, 28, 16, 2), f: '#7aa6d6' }]} />
        <Bucket x={wring[0] + 2} y={224} s={1.05} />
        <Person {...BORU} x={140} y={224} s={1.08}
          pose={{ ...POSE.kneel, spine: -74, chest: -66, head: -40, armB: { to: [wring[0] - 10, wring[1] - 6] }, armF: { to: [wring[0] + 12, wring[1] + 4] }, face: 'neutral' }}
          mid={() => (
            <g>
              <OG sh={[{ d: capsule([wring[0] - 14, wring[1] - 8], 7, [wring[0] + 14, wring[1] + 6], 7), f: '#f2e7c9' }, { d: `M${wring[0] - 6} ${wring[1] - 10}l6 12M${wring[0] + 2} ${wring[1] - 6}l6 12`, st: shade('#f2e7c9', 0.3), sw: 1.6 }]} />
            </g>
          )} />
        <Drop x={wring[0] + 2} y={wring[1] + 22} s={0.8} />
        <Drop x={wring[0] - 6} y={wring[1] + 34} s={0.65} />
      </Scene2>
    );
  },

  'tesisat-boru-yalitim': () => {
    const py = 132;
    const end = 186;
    const hl = aim({ a: 64, s: 1.25, pose: 'hold' as const, side: 'R' as const, grip: 36 }, [end - 112, py], 'grip');
    const hr = aim({ a: -64, s: 1.25, pose: 'hold' as const, side: 'L' as const, grip: 36 }, [end - 30, py], 'grip');
    return (
      <Scene2 bg="dark">
        <Wall x={0} y={240} w={320} h={240} kind="brick" color="#c98a6a" />
        {/* saçak ve buz sarkıtları */}
        <OG sh={[{ d: rrect(-4, -4, 328, 24, 0), f: '#e9eef2' }]} />
        {[24, 58, 96, 140, 176, 222, 262, 296].map((xx, i) => (
          <OG key={xx} sh={[{ d: `M${xx - 6} 18L${xx} ${36 + (i % 3) * 10}L${xx + 6} 18Z`, f: '#d6f0fb' }]} />
        ))}
        {/* boru: solda yalıtılmış, sağda çıplak */}
        <OG sh={[{ d: rrect(end - 10, py - 9, 340, 18, 3), f: '#b9c2cc' }, { d: rrect(end - 10, py + 3, 340, 6, 0), f: '#a3adb8', no: true }]} />
        <OG sh={[{ d: rrect(-10, py - 18, end + 10, 36, 9), f: '#4a505c' }, { d: rrect(-10, py + 4, end + 10, 14, 6), f: '#3b3f4b', no: true }, { d: `M0 ${py - 4}H${end - 6}`, st: '#2b2d3a', sw: 1.6 }]} />
        <Hand {...hl} arm={220} sleeve={K.role.helper} skin={1} />
        <Hand {...hr} arm={220} sleeve={K.role.helper} skin={1} />
        <Arrow from={[end - 40, 68]} to={[end + 50, 68]} />
        {/* kar */}
        <path d="M0 214Q60 198 120 210T240 206T320 210V240H0Z" fill="#f4f8fb" stroke={K.out} stroke-width={1.5} />
        {[[30, 70], [250, 90], [290, 170], [20, 170]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#fff" />)}
      </Scene2>
    );
  },

  /* ─────────────── Araçta şarj ─────────────── */
  'tesisat-araba-disarida': () => (
    <Scene2 bg="outdoor" gy={186}>
      <Tree x={150} y={190} s={0.8} />
      <Car x={98} y={222} s={1.05} color="#3d7ad6" />
      <g fill="#9aa1ab">
        <circle cx={22} cy={196} r={7} opacity={0.6} />
        <circle cx={12} cy={180} r={9} opacity={0.45} />
        <circle cx={18} cy={158} r={11} opacity={0.3} />
        <circle cx={34} cy={136} r={12} opacity={0.18} />
      </g>
      <Ok x={98} y={120} r={16} />
      <Panel x={182} y={66} w={130} h={162} k={0.65} bg="#a9adb4">
        <rect x={0} y={200} width={200} height={50} fill="#82868d" />
        <rect x={20} y={40} width={160} height={160} fill="#9ea3ab" stroke={K.out} stroke-width={3} />
        {[64, 88, 112, 136, 160, 184].map((yy) => <path key={yy} d={`M20 ${yy}H180`} stroke="#80858e" stroke-width={3} />)}
        <Car x={104} y={222} s={1.15} color="#3d7ad6" />
        <Smoke x={0} y={0} w={200} h={120} op={0.8} />
        <No x={100} y={140} r={64} />
      </Panel>
    </Scene2>
  ),

  'tesisat-usb-sarj': () => {
    const sock: P = [118, 150];
    const usb: P = [sock[0], sock[1] + 3];
    return (
      <Scene2 bg="dark">
        {/* torpido ve orta konsol */}
        <rect x={0} y={0} width={320} height={80} fill="#3b404c" />
        <path d="M0 80Q160 60 320 80V96H0Z" fill="#30343e" />
        <OG sh={[{ d: 'M48 96H190L204 240H34Z', f: '#4a505c' }, { d: rrect(78, 104, 80, 20, 4), f: '#2b2f38', ln: true }]} />
        <path d="M86 110h64M86 117h64" stroke="#5b6270" stroke-width={2} />
        {/* 12 V yuvası ve adaptör */}
        <OG sh={[{ d: circ(sock, 24), f: '#2b2f38' }, { d: circ(sock, 18), f: '#1f2229', ln: true }, { d: circ(sock, 15), f: '#3b3f4b' }]} />
        <circle cx={sock[0]} cy={sock[1]} r={15} fill="none" stroke="#49b4ff" stroke-width={2.4} />
        <rect x={usb[0] - 7} y={usb[1] - 3} width={14} height={6} rx={1} fill="#c9d2da" stroke={K.out} />
        <Label x={sock[0]} y={sock[1] - 34} text="12 V" size={12} bg="#fff" />
        {/* vites */}
        <OG sh={[{ d: capsule([118, 230], 6, [118, 196], 5), f: '#2b2f38' }, { d: circ([118, 190], 11), f: '#30333b' }]} />
        {/* kablo telefona */}
        <Cable pts={[usb, [150, 170], [190, 180], [222, 172]]} c="#e9ecef" w={3} />
        <BigPhone x={244} y={150} s={1.6} a={-8}>
          <ChargeIcon y={-6} k={0.95} />
        </BigPhone>
      </Scene2>
    );
  },

  'tesisat-aku-masa': () => {
    const pos: P = [70, 82], neg: P = [190, 82];
    const adp: P = [262, 92];
    return (
      <Scene2 bg="closeup">
        {/* akü (yukarıdan) */}
        <OG sh={[{ d: rrect(22, 52, 200, 150, 8), f: '#30333b' }, { d: rrect(34, 64, 176, 126, 5), f: '#3b3f4b', ln: true }, { d: rrect(80, 140, 84, 30, 4), f: '#f2c230' }]} />
        <path d="M92 155h60" stroke="#30333b" stroke-width={3} />
        {/* kutuplar */}
        <OG sh={[{ d: circ(pos, 15), f: K.danger }, { d: circ(pos, 7), f: '#c9d2da', ln: true }, { d: circ(neg, 15), f: '#596273' }, { d: circ(neg, 7), f: '#c9d2da', ln: true }]} />
        <text x={pos[0]} y={136} text-anchor="middle" font-size={58} font-weight={800} fill={K.danger} stroke="#fff" stroke-width={1.5}>+</text>
        <text x={neg[0]} y={136} text-anchor="middle" font-size={64} font-weight={800} fill="#e9ecef">−</text>
        {/* maşalar ve kablolar */}
        <Cable pts={[[pos[0] + 6, pos[1] - 22], [110, 20], [220, 26], [adp[0] - 16, adp[1] - 10]]} c={K.danger} w={5} />
        <Cable pts={[[neg[0] + 6, neg[1] - 22], [214, 44], [adp[0] - 16, adp[1] + 4]]} c="#2b2d3a" w={5} />
        {[{ p: pos, c: K.danger }, { p: neg, c: '#2b2d3a' }].map(({ p, c }, i) => (
          <G key={i} x={p[0]} y={p[1]} a={22}>
            <OG sh={[{ d: 'M-9 -6L-6 -44H6L9 -6Z', f: c }, { d: 'M-11 6L-9 -8H9L11 6Q0 12 -11 6Z', f: K.metal }, { d: 'M-8 -30H8', st: shade(c, 0.4), sw: 1.6 }]} />
          </G>
        ))}
        {/* USB adaptör ve telefon */}
        <OG sh={[{ d: rrect(adp[0] - 18, adp[1] - 18, 36, 34, 5), f: '#e9ecef' }, { d: rrect(adp[0] - 7, adp[1] + 5, 14, 6, 1), f: '#596273' }]} />
        <Cable pts={[[adp[0], adp[1] + 14], [adp[0] + 4, 136], [270, 148]]} c="#e9ecef" w={3} />
        <BigPhone x={272} y={186} s={0.95}>
          <ChargeIcon y={-2} k={0.9} />
        </BigPhone>
      </Scene2>
    );
  },

  'tesisat-aku-kivilcim-yasak': () => (
    <Scene2 bg="outdoor" gy={200}>
      {/* açık kaput (karşıdan) */}
      <OG sh={[{ d: 'M50 120L76 20H244L270 120Z', f: '#c6574e' }, { d: 'M66 112L86 30H234L254 112Z', f: '#b04a42', ln: true }]} />
      <path d="M160 120L160 24" stroke={K.out} stroke-width={2.2} />
      <OG sh={[{ d: rrect(20, 120, 280, 64, 10), f: '#2b2f38' }, { d: rrect(10, 170, 300, 46, 10), f: '#c6574e' }, { d: rrect(30, 178, 54, 18, 6), f: '#ffe28a', ln: true }, { d: rrect(236, 178, 54, 18, 6), f: '#ffe28a', ln: true }, { d: rrect(116, 188, 88, 18, 4), f: '#3b3f4b', ln: true }]} />
      <OG sh={[{ d: rrect(176, 128, 100, 34, 6), f: '#596273' }, { d: circ([226, 145], 10), f: '#3b3f4b', ln: true }]} />
      {/* akü */}
      <OG sh={[{ d: rrect(44, 126, 96, 46, 5), f: '#30333b' }, { d: rrect(54, 118, 16, 10, 2), f: K.danger }, { d: rrect(114, 118, 16, 10, 2), f: '#596273' }]} />
      <text x={62} y={156} text-anchor="middle" font-size={18} font-weight={800} fill={K.danger}>+</text>
      <text x={122} y={156} text-anchor="middle" font-size={20} font-weight={800} fill="#e9ecef">−</text>
      {/* çıplak tel uçları kıvılcım */}
      <Cable pts={[[62, 118], [74, 92], [96, 82]]} c={K.danger} w={4} />
      <Cable pts={[[122, 118], [126, 92], [108, 82]]} c="#2b2d3a" w={4} />
      <path d="M96 82l4 -2M108 82l-4 -2" stroke="#d6b04a" stroke-width={3} stroke-linecap="round" />
      <Spark x={102} y={78} r={18} />
      <Spark x={88} y={66} r={7} />
      {/* sigara */}
      <Cigarette x={150} y={112} s={1} a={-6} />
      <No x={136} y={98} r={56} />
    </Scene2>
  ),

  /* ─────────────── Güneş paneli / powerbank ─────────────── */
  'tesisat-tasarruf-modu': () => {
    const h = { x: 160, y: 256, a: 0, s: 2.3, pose: 'hold' as const, side: 'R' as const, grip: 38 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={30} sleeve={sleeveOf(GNS)} skin={GNS.skin}>
          <BigPhone x={g[0]} y={g[1]} s={2.3} screen="#dfe6ee">
            {/* pil simgesi, düşük */}
            <rect x={-9} y={-27} width={16} height={9} rx={2} fill="none" stroke={K.ink} stroke-width={1.3} />
            <rect x={7} y={-24.5} width={2} height={4} rx={0.6} fill={K.ink} />
            <rect x={-7.6} y={-25.6} width={3.6} height={6.2} rx={0.8} fill={K.danger} />
            {/* tasarruf anahtarı (açık) */}
            <rect x={-12} y={-12} width={24} height={13} rx={6.5} fill={K.safe} stroke={K.ink} stroke-width={1} />
            <circle cx={5.5} cy={-5.5} r={5} fill="#fff" stroke={K.ink} stroke-width={0.8} />
            <path d="M-9 -2.6c0-4 3-6.5 6.5-6.5c0 4-3 6.5-6.5 6.5z" fill="#fff" />
            {/* parlaklık */}
            <circle cx={-10} cy={13} r={2.6} fill="#f6b81f" />
            <g stroke="#f6b81f" stroke-width={0.9} stroke-linecap="round">
              {[0, 60, 120, 180, 240, 300].map((a) => { const p1 = pol([-10, 13], a, 3.8), p2 = pol([-10, 13], a, 5.4); return <line key={a} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />; })}
            </g>
            <rect x={-4} y={11.5} width={16} height={3} rx={1.5} fill="#b8c2cc" />
            <rect x={-4} y={11.5} width={4} height={3} rx={1.5} fill={K.action} />
            <circle cx={0} cy={13} r={2.6} fill="#fff" stroke={K.ink} stroke-width={0.8} />
          </BigPhone>
        </Hand>
      </Scene2>
    );
  },

  'tesisat-panel-gunese': () => {
    const pn: P = [140, 208];
    const edge: P = [pn[0] + 66 * 1.15, pn[1] - 34 * 1.15];
    return (
      <Scene2 bg="outdoor" gy={176} ground="dirt">
        <Sun x={44} y={42} r={18} />
        <g stroke="#f6b81f" stroke-width={2.6} stroke-dasharray="7 6" stroke-linecap="round">
          <line x1={66} y1={60} x2={112} y2={140} />
          <line x1={74} y1={52} x2={148} y2={130} />
          <line x1={80} y1={44} x2={182} y2={120} />
        </g>
        <SolarPanel x={pn[0]} y={pn[1]} s={1.15} />
        <Person {...GNS} x={276} y={226} s={1.05} flip
          pose={{ ...POSE.kneelOne, spine: -74, chest: -64, head: -64, armF: { to: edge }, armB: { to: [edge[0] - 6, edge[1] + 24] }, face: 'neutral' }} />
        <Arrow from={[112, 232]} to={[214, 230]} bend={0.18} w={5} />
      </Scene2>
    );
  },

  'tesisat-panel-powerbank': () => {
    // Panel tam güneşte; kablo şemsiye gölgesine uzanıyor; powerbank ve telefon gölgede.
    const pn: P = [62, 214];
    const ps = 0.8;
    const out = panelOut(pn[0], pn[1], ps);
    const pb: P = [196, 196];
    const ph: P = [270, 194];
    const um = '#2f8f86';
    return (
      <Scene2 bg="outdoor" gy={176}>
        <Sun x={36} y={36} r={17} />
        <g stroke="#f6b81f" stroke-width={2.4} stroke-dasharray="6 6" stroke-linecap="round">
          <line x1={52} y1={60} x2={62} y2={136} />
          <line x1={62} y1={54} x2={96} y2={130} />
        </g>
        {/* gölge alanı */}
        <path d="M150 182H318V240H136Z" fill="#2f4a2a" opacity={0.42} />
        {/* bahçe şemsiyesi */}
        <OG sh={[{ d: capsule([234, 76], 2.6, [234, 236], 2.6), f: '#d9dde2' }]} />
        <OG sh={[
          { d: 'M146 98Q234 30 322 98Q300 90 278 98Q256 88 234 98Q212 88 190 98Q168 90 146 98Z', f: um },
          { d: 'M190 98Q212 88 234 98Q234 54 234 52Q200 64 190 98Z', f: tint(um, 0.35), no: true },
          { d: 'M278 98Q256 88 234 98Q234 54 234 52Q268 64 278 98Z', f: tint(um, 0.35), no: true },
        ]} />
        <SolarPanel x={pn[0]} y={pn[1]} s={ps} />
        <Cable pts={[out, [out[0] + 18, 226], [pb[0] - 30, 230], [pb[0], pb[1] + 24]]} />
        <Powerbank x={pb[0]} y={pb[1]} s={1.05} />
        <Cable pts={[[pb[0], pb[1] + 24], [pb[0] + 10, 232], [ph[0], 234], [ph[0], ph[1] + 30]]} c="#e9ecef" w={3} />
        <BigPhone x={ph[0]} y={ph[1]} s={0.82}>
          <ChargeIcon y={-4} k={0.9} />
        </BigPhone>
        <Arrow from={[112, 140]} to={[170, 150]} />
        <Arrow from={[214, 150]} to={[248, 150]} />
      </Scene2>
    );
  },

  'tesisat-pil-golgede': () => {
    const pn: P = [64, 214];
    const ps = 0.7;
    const out = panelOut(pn[0], pn[1], ps);
    const bag: P = [170, 218];
    return (
      <Scene2 bg="outdoor" gy={176}>
        <Sun x={32} y={34} r={15} />
        <ellipse cx={168} cy={214} rx={58} ry={12} fill="#4f7a3a" opacity={0.55} />
        <Tree x={170} y={204} s={1.05} />
        <SolarPanel x={pn[0]} y={pn[1]} s={ps} />
        {/* çanta + powerbank + telefon */}
        <OG sh={[{ d: 'M136 222Q134 196 150 194H192Q206 196 204 222Z', f: '#c0603e' }, { d: 'M150 194Q170 182 190 194', st: K.out, sw: 3 }, { d: 'M138 206H202', st: shade('#c0603e', 0.3), sw: 2 }]} />
        <Cable pts={[out, [out[0] + 16, 226], [140, 228], [152, 196]]} />
        <Powerbank x={160} y={180} s={0.62} a={0} />
        <BigPhone x={184} y={182} s={0.42}>
          <ChargeIcon y={-4} k={0.9} />
        </BigPhone>
        <Ok x={170} y={140} r={14} />
        <Panel x={222} y={54} w={90} h={110} k={0.6} bg={K.sky}>
          <rect x={0} y={130} width={150} height={60} fill={K.grass} />
          <Sun x={110} y={30} r={18} />
          <Powerbank x={64} y={128} s={1.4} />
          <Heat x={64} y={76} s={1.2} n={3} />
          <No x={66} y={110} r={50} />
        </Panel>
      </Scene2>
    );
  },

  'tesisat-siskin-powerbank': () => {
    // Isı geçirmez uzun eldivenli el, şişmiş powerbankı seramik tabağa koyuyor. Çıplak ten yok.
    const pb: P = [170, 120];
    const h = aim({ a: 180, s: 1.3, pose: 'hold' as const, side: 'R' as const, grip: 62 }, pb, 'grip');
    const cuff = pol([h.x, h.y], -90, 0);
    return (
      <Scene2 bg="closeup">
        <defs>
          <filter id="ts-glove" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="0.3 0.3 0.1 0 0  0.3 0.3 0.15 0 0  0.3 0.3 0.2 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <rect x={0} y={150} width={320} height={90} fill="#b5b3ad" />
        <path d="M0 150H320" stroke="#9f9d96" stroke-width={2} />
        <g fill="#a5a39c">{[[40, 190], [120, 220], [270, 180], [220, 228], [80, 170]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} />)}</g>
        {/* seramik tabak */}
        <OG sh={[{ d: ell([170, 206], 82, 18), f: '#fbfaf7' }, { d: ell([170, 203], 58, 11), f: '#eceae4', ln: true }]} />
        {/* çıkarılmış kablo */}
        <Cable pts={[[20, 200], [50, 186], [84, 190], [96, 176]]} c="#e9ecef" w={3} />
        <OG sh={[{ d: rrect(92, 162, 10, 16, 2), f: '#c9d2da' }]} />
        {/* duman */}
        <path d="M150 74c-8-8 8-14 0-24M176 70c-8-8 8-14 0-24M200 76c-8-8 8-14 0-24" fill="none" stroke="#8b929c" stroke-width={4} stroke-linecap="round" opacity={0.7} />
        {/* kol (giysi) */}
        <Hand {...h} arm={160} sleeve={K.role.helper} skin={1} />
        {/* ısı geçirmez eldiven (el + kısa manşet) */}
        <g filter="url(#ts-glove)">
          <Hand {...h} arm={34} skin={1}>
            <G x={pb[0]} y={pb[1]}>
              <OG sh={[{ d: 'M-34 -14Q-36 -28 -20 -26Q0 -36 20 -26Q36 -28 34 -14Q42 0 34 14Q36 28 20 26Q0 36 -20 26Q-36 28 -34 14Q-42 0 -34 -14Z', f: '#4a505c' }]} />
            </G>
          </Hand>
        </g>
        <OG sh={[{ d: rrect(cuff[0] - 21, cuff[1] - 50, 42, 16, 5), f: '#8a929c' }, { d: `M${cuff[0] - 19} ${cuff[1] - 42}H${cuff[0] + 19}`, st: shade('#8a929c', 0.3), sw: 1.2 }]} />
        {/* powerbank ayrıntısı (eldivenin üstünde renkli kalsın): şişkin kasa çatlağı */}
        <G x={pb[0]} y={pb[1]}>
          <path d="M-20 -18Q0 -26 20 -18" stroke="#7a828f" stroke-width={3} fill="none" />
          <path d="M-36 2L-24 -4L-14 6L-2 -2L10 8L22 -2L36 4" stroke={K.out} stroke-width={3.4} fill="none" />
          <path d="M-36 2L-24 -4L-14 6L-2 -2L10 8L22 -2L36 4" stroke="#ffb15c" stroke-width={1.4} fill="none" />
        </G>
        <Arrow from={[252, 112]} to={[252, 176]} />
      </Scene2>
    );
  },

  /* ─────────────── LPG tüpü ─────────────── */
  'tesisat-tup-vana-kapat': () => {
    const knob: P = [160, 96];
    const h = aim({ a: -78, s: 1.25, pose: 'pinch' as const, side: 'R' as const }, [knob[0] + 4, knob[1] - 2], 'pinch');
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#e8dcc6" />
        <Gas x={30} y={70} s={1} n={3} gap={20} />
        {/* tüpün üst kısmı */}
        <OG sh={[{ d: 'M50 244V196Q50 150 110 140H210Q270 150 270 196V244Z', f: TUBE }, { d: 'M224 142Q270 152 270 196V244H232Z', f: shade(TUBE, 0.15), no: true }]} />
        <path d="M80 200Q90 166 120 156" stroke="#fff" stroke-width={5} opacity={0.35} fill="none" stroke-linecap="round" />
        <path d="M108 142V100H212V142" fill="none" stroke={K.out} stroke-width={14} stroke-linejoin="round" />
        <path d="M108 142V100H212V142" fill="none" stroke={shade(TUBE, 0.25)} stroke-width={10} stroke-linejoin="round" />
        {/* vana + regülatör */}
        <OG sh={[{ d: rrect(146, 108, 28, 34, 3), f: '#d6b04a' }, { d: rrect(126, 82, 68, 30, 8), f: '#3b3f4b' }, { d: capsule([126, 98], 7, [-10, 140], 7), f: '#e2b23a' }, { d: circ(knob, 15), f: '#30333b' }, { d: circ(knob, 7), f: '#596273', ln: true }]} />
        <Hand {...h} arm={240} sleeve={K.role.helper} skin={1} />
        <Arrow from={[118, 54]} to={[192, 50]} bend={-0.35} w={5} />
      </Scene2>
    );
  },

  'tesisat-tup-dik': () => {
    const carrier: PersonProps = { ...TUP, x: 150, y: 226, s: 1.05, pose: { ...POSE.standSide, spine: -86, chest: -84, armF: { to: [184, 124] }, armB: { to: [178, 126] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={176} ground="pavement">
        <Tube x={46} y={226} s={0.95} />
        <Ok x={46} y={100} r={14} />
        <Person {...carrier} mid={() => <Tube x={181} y={216} s={0.82} />} />
        <Tube x={212} y={206} s={0.8} a={90} />
        <g fill="none" stroke={K.ink} stroke-width={2.4} stroke-linecap="round" opacity={0.7}>
          <path d="M300 200q8 8 0 16M308 196q10 12 0 24" />
        </g>
        <No x={256} y={206} r={40} />
      </Scene2>
    );
  },

  'tesisat-tup-bodrum-yasak': () => (
    <Scene2 bg="outdoor" gy={138}>
      {/* toprak kesiti */}
      <rect x={0} y={140} width={320} height={100} fill="#8f6a45" />
      {/* ev */}
      <OG sh={[{ d: rrect(18, 54, 284, 90, 2), f: '#efe3cf' }, { d: 'M8 58L160 10L312 58Z', f: '#c2583e' }, { d: rrect(28, 148, 264, 84, 2), f: '#b9a78c' }, { d: rrect(18, 140, 284, 8, 0), f: '#9f8e74' }]} />
      <path d="M150 56V140" stroke={K.out} stroke-width={3} />
      {/* mutfak penceresi */}
      <Window x={34} y={68} w={50} h={40} />
      <Tube x={112} y={140} s={0.48} />
      <Ok x={112} y={74} r={12} />
      {/* merdiven ve altındaki tüp */}
      <path d="M160 140L292 64" stroke={K.out} stroke-width={8} />
      <path d="M160 140L292 64" stroke="#a8724a" stroke-width={5} />
      {[0, 1, 2, 3, 4, 5].map((i) => { const x = 170 + i * 21, y = 134 - i * 12; return <path key={i} d={`M${x} ${y}h16v-12`} fill="none" stroke="#a8724a" stroke-width={4} />; })}
      <Tube x={256} y={140} s={0.4} />
      <No x={256} y={118} r={22} />
      {/* bodrum: tüp ve yere çöken gaz */}
      <Tube x={110} y={230} s={0.5} />
      <path d="M30 230V214Q60 204 90 212T150 210T210 212T290 210V230Z" fill="#a9cf6a" opacity={0.6} />
      <Gas x={170} y={214} s={0.7} n={4} gap={22} />
      <No x={112} y={202} r={32} />
    </Scene2>
  ),

  'tesisat-sabunlu-su-testi': () => {
    const joint: P = [196, 104];
    const ha = -140;
    const hh = { a: ha, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 14 };
    const g0 = handPoint({ ...hh, x: 0, y: 0 }, 'grip');
    // fırçanın kılları tutuştan 62·s ileride
    const tipOff = pol([0, 0], ha - 90, 62);
    const grip: P = [joint[0] + 6 - tipOff[0], joint[1] - 10 - tipOff[1]];
    const h = { ...hh, x: grip[0] - g0[0], y: grip[1] - g0[1] };
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#e8dcc6" />
        {/* tüp üstü */}
        <OG sh={[{ d: 'M40 244V200Q40 160 96 150H196Q252 160 252 200V244Z', f: TUBE }]} />
        <path d="M96 152V116H196V152" fill="none" stroke={K.out} stroke-width={14} />
        <path d="M96 152V116H196V152" fill="none" stroke={shade(TUBE, 0.25)} stroke-width={10} />
        <OG sh={[{ d: rrect(132, 120, 28, 32, 3), f: '#d6b04a' }, { d: rrect(116, 92, 62, 30, 8), f: '#3b3f4b' }, { d: rrect(178, 96, 18, 18, 3), f: '#c9a24a' }, { d: capsule([196, 105], 7.5, [330, 150], 7.5), f: '#e2b23a' }]} />
        {/* köpük kabarcıkları */}
        {[[198, 92, 7], [208, 104, 9], [196, 116, 6], [212, 88, 5], [186, 100, 4.5], [220, 114, 5]].map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill="#ffffff" opacity={0.85} stroke={K.water} stroke-width={1.4} />
            <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#fff" />
          </g>
        ))}
        {/* büyüteç */}
        <g>
          <circle cx={70} cy={60} r={22} fill="#e8f5fc" stroke={K.out} stroke-width={5} opacity={0.95} />
          <circle cx={70} cy={60} r={22} fill="none" stroke="#5b6270" stroke-width={3} />
          <circle cx={64} cy={56} r={5} fill="#fff" stroke={K.water} stroke-width={1.2} />
          <circle cx={76} cy={66} r={7} fill="#fff" stroke={K.water} stroke-width={1.2} />
          <OG sh={[{ d: capsule([86, 76], 4.5, [104, 94], 5.5), f: '#5b6270' }]} />
        </g>
        {/* sabunlu su kâsesi */}
        <OG sh={[{ d: 'M250 214H310Q306 238 280 238Q254 238 250 214Z', f: '#e9ecef' }, { d: ell([280, 214], 30, 6), f: '#d6eef9' }]} />
        {[[270, 208], [282, 206], [292, 209]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#fff" stroke={K.water} stroke-width={1.2} />)}
        <Hand {...h} arm={220} sleeve={sleeveOf(TUP)} skin={TUP.skin}>
          <G x={grip[0]} y={grip[1]} a={ha}>
            <OG sh={[{ d: rrect(-5, -40, 10, 66, 4), f: '#b77f50' }, { d: rrect(-7, -58, 14, 20, 2), f: '#f2e7c9' }, { d: rrect(-5, -42, 10, 6, 1), f: K.metal }]} />
          </G>
        </Hand>
      </Scene2>
    );
  },

  'tesisat-ezik-tup-yasak': () => {
    const att: PersonProps = { x: 252, y: 226, s: 1.02, flip: true, who: 'man', role: 'bystander2', skin: 2, hairC: K.hair.black, mustache: true, pose: { ...POSE.standSide, armF: { to: [218, 122] }, armB: { to: [222, 126] }, face: 'calm' } };
    return (
      <Scene2 bg="outdoor" gy={176} ground="pavement">
        {/* bayi dükkânı */}
        <OG sh={[{ d: rrect(176, 20, 150, 170, 0), f: '#e6d3b8' }, { d: rrect(196, 74, 110, 116, 2), f: '#3a3530' }]} />
        <path d="M170 26H326V56Q316 66 306 56Q296 66 286 56Q276 66 266 56Q256 66 246 56Q236 66 226 56Q216 66 206 56Q196 66 186 56Q176 66 170 56Z" fill="#22b35e" stroke={K.out} stroke-width={1.6} />
        {[186, 226, 266, 306].map((xx) => <path key={xx} d={`M${xx} 26V56`} stroke="#fff" stroke-width={10} opacity={0.7} />)}
        <Tube x={290} y={190} s={0.5} />
        <Tube x={308} y={190} s={0.5} />
        <Person {...att} mid={() => <Tube x={220} y={214} s={0.8} />} />
        <Ok x={220} y={84} r={12} />
        {/* müşteri ve hasarlı tüp */}
        <Person {...TUP} x={64} y={226} s={1.02} pose={{ ...POSE.standSide, armF: [10, -10], armB: [96, 92], face: 'neutral' }} />
        <Tube x={130} y={228} s={0.8} a={-10} dent rust broken />
        <No x={130} y={182} r={40} />
      </Scene2>
    );
  },

  /* ─────────────── Hasarlı tesisat ─────────────── */
  'tesisat-islak-zemin-yasak': () => {
    const panel: P = [244, 98];
    return (
      <Scene2 bg="indoor" wall="#d9d8cf">
        <rect x={0} y={150} width={320} height={50} fill="#bdb7a3" opacity={0.6} />
        <path d="M0 150H320" stroke="#9c8c6a" stroke-width={2} />
        <OG sh={[{ d: rrect(220, 64, 48, 62, 4), f: '#e9ecef' }, { d: rrect(226, 72, 36, 22, 2), f: '#f7f7f5', ln: true }]} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={229 + i * 8} y={76} width={5} height={14} rx={1} fill="#3b3f4b" />)}
        <Socket x={244} y={160} s={0.85} />
        <Person {...KES} x={150} y={226} s={1.08}
          pose={{ ...POSE.standSide, armF: { to: [panel[0] - 14, panel[1] - 4] }, armB: [100, 70], face: 'neutral' }} />
        <g opacity={0.82}>
          <Water x={0} y={210} w={320} h={34} />
        </g>
        <Bolt x={290} y={66} s={1.3} />
        <No x={232} y={100} r={42} />
      </Scene2>
    );
  },

  'tesisat-islak-cihaz-yasak': () => {
    const sock: P = [258, 116];
    const pin: P = [sock[0] + 12, sock[1] + 16];
    const pa = -34;
    const body: P = [pin[0] + 22 * Math.sin(-pa * R) * -1 + 10, pin[1] + 22];
    const h = aim({ a: -34, s: 1.0, pose: 'hold' as const, side: 'R' as const, grip: 28 }, [pin[0] + 12, pin[1] + 20], 'grip');
    void body;
    const tail = plugTail(pin[0], pin[1], 1.0, pa);
    return (
      <Scene2 bg="indoor" wall="#ddd8c8">
        <rect x={0} y={126} width={320} height={74} fill="#a88a62" opacity={0.45} />
        <path d="M0 126Q40 120 80 128T160 124T240 128T320 124" fill="none" stroke="#7d6346" stroke-width={2.4} />
        <rect x={0} y={200} width={320} height={40} fill="#8f7452" opacity={0.6} />
        {/* buzdolabı */}
        <OG sh={[{ d: rrect(16, 44, 76, 170, 6), f: '#eef0f2' }, { d: rrect(16, 104, 76, 3, 0), f: '#c9cfd6', no: true }, { d: rrect(78, 60, 5, 30, 2), f: '#9aa3ad' }, { d: rrect(78, 118, 5, 40, 2), f: '#9aa3ad' }]} />
        <path d="M16 150Q40 140 60 152T92 146V208Q92 214 86 214H22Q16 214 16 208Z" fill="#8a6a45" opacity={0.8} />
        <Drop x={40} y={224} s={0.7} color="#8a6a45" />
        {/* televizyon */}
        <TV x={150} y={216} s={1.0} muddy />
        {/* uzatma kablosu */}
        <OG sh={[{ d: rrect(186, 214, 54, 14, 4), f: '#e9ecef' }, { d: circ([200, 221], 4), f: '#596273' }, { d: circ([216, 221], 4), f: '#596273' }]} />
        <path d="M188 220q12 8 36 2" fill="none" stroke="#8a6a45" stroke-width={3} opacity={0.7} />
        <Cable pts={[[240, 222], [262, 214], tail]} c="#e9ecef" w={3.4} />
        <Socket x={sock[0]} y={sock[1]} s={1.1} />
        <Plug x={pin[0]} y={pin[1]} s={1.0} a={pa} />
        <Hand {...h} arm={200} sleeve={sleeveOf(KES)} skin={KES.skin} />
        <No x={sock[0] + 6} y={sock[1] + 10} r={40} />
      </Scene2>
    );
  },

  'tesisat-elektrikci-kontrol': () => {
    const box = { x: 222, y: 58 };
    const probe: P = [box.x + 24, box.y + 34];
    return (
      <Scene2 bg="indoor">
        <FuseBox x={box.x} y={box.y} w={70} h={86} />
        <Person {...KES} x={60} y={224} s={1.0} pose={{ ...POSE.stand, face: 'neutral' }} />
        <Person x={170} y={226} s={1.1} who="man" role="helper" bottomC={K.pants.navy} skin={2} hairC={K.hair.black}
          pose={{ ...POSE.standSide, head: -86, armF: { to: probe }, armB: { to: [192, 128] }, face: 'calm' }}
          over={(r) => (
            <g>
              {gloves('#e8c43a')(r)}
              <Meter x={r.handB[0] + 2} y={r.handB[1] - 4} s={1.0} a={10} />
              <path d={`M${r.handF[0] + 4} ${r.handF[1] - 2}L${probe[0] + 4} ${probe[1] - 2}`} stroke={K.danger} stroke-width={3} stroke-linecap="round" />
            </g>
          )} />
        <Ok x={300} y={50} r={13} />
      </Scene2>
    );
  },
};
