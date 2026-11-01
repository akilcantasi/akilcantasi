// Doğada hayatta kalma — sahneler (1. yarı): su bulma/arıtma, yön bulma, pusula, ateş, barınak.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Bottle, Campfire, Drop, Flame, Hand, K, Label, No, OG, Ok, Person, POSE, Rock, Scene2, Timer, Tree, Water, Waves,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const angOf = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);
/** El bileğini, elin verilen noktası (grip/pinch/tip) hedefe gelecek şekilde konumlar. */
function handAtP<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}
/* ─────────── oyuncular (rehber başına sabit; rehber içinde değişmez) ─────────── */
/** su bulma: yürüyüşçü kadın, at kuyruğu, kahverengi saç, turuncu sırt çantası */
const SB = { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.brown, skin: 0, bottomC: K.pants.denim } as const;
/** yön bulma (güneş, Kutup Yıldızı, saat): esmer adam, siyah saç */
const YON = { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black, bottomC: K.pants.denim } as const;
/** pusula ve harita: topuzlu kadın */
const PUS = { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.dark, skin: 1, bottomC: K.pants.dark } as const;
/** barınak, işaret, soğuk gece: at kuyruklu kadın (ortak "whistle-signal" sahnesiyle aynı) — hayatta-kalma-2.tsx'te de aynı */
const KAMP = { who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.dark, skin: 1, bottomC: K.pants.dark } as const;
const PACK = '#c0603e';

const DRY = '#d9c27a';
const SOIL = '#b98d5f';
const SOILD = '#8f6a45';

/** Güneş (ışınlı) */
function Sun({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f6b81f" stroke-width={3} stroke-linecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const a = i * 36;
          const p1 = pol([x, y], a, r + 5), p2 = pol([x, y], a, r + 12);
          return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill={K.fireCore} stroke={K.out} stroke-width={1.5} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff3a8" />
    </g>
  );
}

/** Yıldız pırıltısı */
function Star({ x, y, r = 3.4, c = '#fff6d8' }: { x: number; y: number; r?: number; c?: string }) {
  const k = r * 0.32;
  return <path d={`M${x} ${y - r * 1.6}L${x + k} ${y - k}L${x + r * 1.6} ${y}L${x + k} ${y + k}L${x} ${y + r * 1.6}L${x - k} ${y + k}L${x - r * 1.6} ${y}L${x - k} ${y - k}Z`} fill={c} />;
}

/** Vurgu halkası (beyaz altlıklı) */
function Ring({ x, y, r, c = K.action, w = 3 }: { x: number; y: number; r: number; c?: string; w?: number }) {
  return (
    <g fill="none">
      <circle cx={x} cy={y} r={r} stroke="#fff" stroke-width={w + 2.5} opacity={0.6} />
      <circle cx={x} cy={y} r={r} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Kesikli çizgi */
function Dash({ pts, c = K.action, w = 3, dash = '7 6', curve }: { pts: P[]; c?: string; w?: number; dash?: string; curve?: boolean }) {
  const d = curve ? smooth(pts) : 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
  return <path d={d} fill="none" stroke={c} stroke-width={w} stroke-dasharray={dash} stroke-linecap="round" />;
}

/** Sopa / dal */
function Stick({ a, b, w = 3.2, c = K.trunk }: { a: P; b: P; w?: number; c?: string }) {
  return <OG sh={[{ d: capsule(a, w, b, w * 0.85), f: c }]} />;
}

/** Yassı taş (üstten ya da yandan), MERKEZ */
function Pebble({ x, y, rx = 9, ry = 6, c = K.rock }: { x: number; y: number; rx?: number; ry?: number; c?: string }) {
  return <OG sh={[{ d: ell([x, y], rx, ry), f: c }, { d: ell([x + rx * 0.25, y + ry * 0.25], rx * 0.6, ry * 0.5), f: shade(c, 0.12), no: true }]} />;
}

/** Kova (yandan). x,y = taban ortası */
function Bucket({ x, y, s = 1, c = '#8aa0b2', water = true }: { x: number; y: number; s?: number; c?: string; water?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-17 -30Q0 -52 17 -30', st: K.out, sw: 2.4 },
          { d: 'M-18 -30H18L14 0H-14Z', f: c },
          { d: 'M8 -30H18L14 0H6Z', f: shade(c, 0.15), no: true },
          ...(water ? [{ d: ell([0, -30], 18, 4), f: K.water } as Sh] : [{ d: ell([0, -30], 18, 4), f: shade(c, 0.35) } as Sh]),
        ]}
      />
    </G>
  );
}

/** Açık ağızlı kap/kavanoz (yandan). x,y = taban ortası. level 0..1, wc = su rengi, sed = dip tortusu yüksekliği */
function Jar({ x, y, w = 50, h = 56, level = 0.6, wc = K.water, sed = 0, a = 0, c = '#e6f1f6' }: { x: number; y: number; w?: number; h?: number; level?: number; wc?: string; sed?: number; a?: number; c?: string }) {
  const hw = w / 2;
  const body = `M${-hw} ${-h}H${hw}V-5Q${hw} 0 ${hw - 5} 0H${-hw + 5}Q${-hw} 0 ${-hw} -5Z`;
  const lv = -h * level;
  return (
    <G x={x} y={y} a={a}>
      <OG
        sh={[
          { d: body, f: c },
          ...(level > 0 ? [{ d: `M${-hw} ${lv}H${hw}V-5Q${hw} 0 ${hw - 5} 0H${-hw + 5}Q${-hw} 0 ${-hw} -5Z`, f: wc, no: true } as Sh] : []),
          ...(sed > 0 ? [{ d: `M${-hw} ${-sed}Q${-hw / 2} ${-sed - 3} 0 ${-sed}T${hw} ${-sed}V-5Q${hw} 0 ${hw - 5} 0H${-hw + 5}Q${-hw} 0 ${-hw} -5Z`, f: '#8a6640', no: true } as Sh] : []),
          { d: ell([0, -h], hw, 4), f: tint(c, 0.4), ln: true },
          { d: `M${-hw + 6} ${-h + 8}V-10`, st: '#fff', sw: 2.4 },
        ]}
      />
    </G>
  );
}

/** Kuşbakışı insan (yukarı = yüzünün baktığı yön a=-90). hands: yerel koordinatta el noktaları */
function TopPerson({ x, y, a = -90, s = 1, top = K.role.helper, hair = K.hair.dark, skin = 1, hands = [[-16, -16], [16, -16]] as P[] }: { x: number; y: number; a?: number; s?: number; top?: string; hair?: string; skin?: number; hands?: P[] }) {
  const sk = K.skin[skin];
  return (
    <G x={x} y={y} a={a + 90} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([-17, 0], 5.5, hands[0], 4.5), f: top },
          { d: capsule([17, 0], 5.5, hands[1], 4.5), f: top },
          { d: circ(hands[0], 4.6), f: sk },
          { d: circ(hands[1], 4.6), f: sk },
          { d: ell([0, 1], 21, 10), f: top },
          { d: ell([0, 4], 19, 6), f: shade(top, 0.15), no: true },
          { d: ell([0, -9.5], 3, 2.5), f: sk },
          { d: circ([0, -1], 9.5), f: hair },
          { d: 'M-5 -6Q0 -9 5 -6', st: tint(hair, 0.3), sw: 1.4 },
        ]}
      />
    </G>
  );
}

/* ---------------- saat ---------------- */

/** Üstten analog kol saati. rot: kadran dönüşü (0 = 12 yukarı). h: saat (ondalıklı) */
function Watch({ x, y, r = 50, rot = 0, h = 3.83, fade12, ring1, wedge, noMin }: { x: number; y: number; r?: number; rot?: number; h?: number; fade12?: boolean; ring1?: boolean; wedge?: [number, number]; noMin?: boolean }) {
  const hA = h * 30 - 90; // kadran içinde açı (12 = -90)
  const mA = (h % 1) * 360 - 90;
  const num = (n: number) => {
    const p = pol([0, 0], n * 30 - 90, r * 0.64);
    return (
      <text key={n} x={f1(p[0])} y={f1(p[1] + r * 0.075)} font-size={f1(r * 0.21)} font-weight={700} text-anchor="middle" fill={K.ink} opacity={fade12 && n === 12 ? 0.25 : 1} font-family="'IBM Plex Sans', system-ui, sans-serif">
        {n}
      </text>
    );
  };
  const wd = wedge
    ? (() => {
        const a1 = wedge[0] * 30 - 90, a2 = wedge[1] * 30 - 90;
        const p1 = pol([0, 0], a1, r * 0.84), p2 = pol([0, 0], a2, r * 0.84);
        const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
        const sweep = a2 > a1 ? 1 : 0;
        return <path d={`M0 0L${f1(p1[0])} ${f1(p1[1])}A${f1(r * 0.84)} ${f1(r * 0.84)} 0 ${large} ${sweep} ${f1(p2[0])} ${f1(p2[1])}Z`} fill="#ffe14d" opacity={0.75} />;
      })()
    : null;
  const p1 = pol([0, 0], 30 - 90, r * 0.64);
  return (
    <G x={x} y={y} a={rot}>
      <OG
        sh={[
          { d: rrect(-r * 0.42, -r * 1.9, r * 0.84, r * 1.2, 6), f: '#5b4636' },
          { d: rrect(-r * 0.42, r * 0.7, r * 0.84, r * 1.2, 6), f: '#5b4636' },
          { d: rrect(r * 0.92, -r * 0.12, r * 0.18, r * 0.24, 2), f: K.metal },
          { d: circ([0, 0], r), f: '#c8ced6' },
          { d: circ([0, 0], r * 0.88), f: '#fdfcf8', ln: true },
        ]}
      />
      {wd}
      <g stroke={K.ink} stroke-linecap="round">
        {Array.from({ length: 12 }, (_, i) => {
          const a = pol([0, 0], i * 30 - 90, r * 0.86), b = pol([0, 0], i * 30 - 90, r * 0.78);
          return <line key={i} x1={f1(a[0])} y1={f1(a[1])} x2={f1(b[0])} y2={f1(b[1])} stroke-width={i % 3 ? 1.3 : 2.4} />;
        })}
      </g>
      {Array.from({ length: 12 }, (_, i) => num(i + 1))}
      {ring1 && <Ring x={p1[0]} y={p1[1] - r * 0.005} r={r * 0.17} />}
      <OG
        sh={[
          ...(noMin ? [] : [{ d: capsule(pol([0, 0], mA, -r * 0.1), r * 0.035, pol([0, 0], mA, r * 0.74), r * 0.025), f: '#5a6170' } as Sh]),
          { d: capsule(pol([0, 0], hA, -r * 0.08), r * 0.07, pol([0, 0], hA, r * 0.47), r * 0.05), f: K.ink },
          { d: circ([0, 0], r * 0.07), f: K.action },
        ]}
      />
    </G>
  );
}

/* ---------------- pusula ve harita ---------------- */

/** Şeffaf tabanlı pusula (üstten). x,y = kadran merkezi; a = yön okunun ekran açısı (-90 yukarı);
 *  bez = kadrandaki kuzey okunun ekran açısı; ndl = kırmızı iğnenin ekran açısı */
function BaseComp({ x, y, a = -90, bez = -90, ndl = -90, s = 1, hi }: { x: number; y: number; a?: number; bez?: number; ndl?: number; s?: number; hi?: boolean }) {
  const r = 24;
  return (
    <G x={x} y={y} s={s}>
      <G a={a + 90}>
        <OG
          ow={1.5 / s}
          sh={[
            { d: 'M-27 -64Q-27 -72 -19 -74L0 -80L19 -74Q27 -72 27 -64V30Q27 36 21 36H-21Q-27 36 -27 30Z', f: '#e8f4f8', op: 0.88 },
          ]}
        />
        <g stroke={K.ink} stroke-width={1.1}>
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={-27} y1={-60 + i * 9} x2={i % 2 ? -22 : -19} y2={-60 + i * 9} />
          ))}
        </g>
        {hi && <path d="M0 -76L-12 -52H-4V-30H4V-52H12Z" fill="none" stroke="#fff" stroke-width={7} stroke-linejoin="round" />}
        <path d="M0 -76L-12 -52H-4V-30H4V-52H12Z" fill={hi ? K.action : '#4a5060'} stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
      </G>
      <G a={bez + 90}>
        <OG
          ow={1.5 / s}
          sh={[
            { d: circ([0, 0], r + 5), f: '#3b3f4b' },
            { d: circ([0, 0], r), f: '#f4f8fa', ln: true },
          ]}
        />
        <g stroke="#cfd6de" stroke-width={1.1}>
          {Array.from({ length: 24 }, (_, i) => {
            const p1 = pol([0, 0], i * 15, r + 1.5), p2 = pol([0, 0], i * 15, r + 4);
            return <line key={i} x1={f1(p1[0])} y1={f1(p1[1])} x2={f1(p2[0])} y2={f1(p2[1])} />;
          })}
        </g>
        <text x={0} y={-r - 0.6} font-size={6.5} font-weight={700} fill="#fff" text-anchor="middle">K</text>
        <g stroke-width={1.2}>
          {[-14, -7, 7, 14].map((dx) => (
            <line key={dx} x1={dx} y1={-Math.sqrt(r * r - dx * dx) + 2} x2={dx} y2={Math.sqrt(r * r - dx * dx) - 2} stroke={Math.abs(dx) === 7 ? K.danger : K.ink} opacity={0.75} />
          ))}
        </g>
        <path d="M0 -20L-7.5 -9H-4.5V12H4.5V-9H7.5Z" fill="none" stroke={K.danger} stroke-width={2.2} stroke-linejoin="round" />
      </G>
      <G a={ndl + 90}>
        <OG ow={1.2 / s} sh={[{ d: 'M0 -17L4 0H-4Z', f: K.danger }, { d: 'M0 17L4 0H-4Z', f: '#f2f2f2' }, { d: circ([0, 0], 2.2), f: K.metal }]} />
      </G>
    </G>
  );
}

/** Topoğrafik harita (üstten). x,y = merkez; a = haritanın kuzeyinin ekran açısı (-90 yukarı) */
function TopoMap({ x, y, w = 220, h = 170, a = -90 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  const hw = w / 2, hh = h / 2;
  const cont = (cx: number, cy: number, rs: number[]) =>
    rs.map((rr, i) => (
      <path key={i} d={smooth([[cx - rr * 1.3, cy], [cx - rr * 0.6, cy - rr * 0.9], [cx + rr * 0.7, cy - rr * 0.8], [cx + rr * 1.25, cy + rr * 0.1], [cx + rr * 0.4, cy + rr * 0.85], [cx - rr * 0.8, cy + rr * 0.7]], true)} fill={i === rs.length - 1 ? '#d9c79a' : 'none'} stroke="#b08a52" stroke-width={1.2} />
    ));
  return (
    <G x={x} y={y} a={a + 90}>
      <OG sh={[{ d: rrect(-hw, -hh, w, h, 3), f: '#f1e8cc' }]} />
      <path d={`M${-hw + 30} ${hh - 30}Q${-hw + 60} ${hh - 70} ${-hw + 40} ${-10}`} fill="none" stroke="#a9cf86" stroke-width={26} opacity={0.55} stroke-linecap="round" />
      {cont(hw * 0.35, -hh * 0.25, [46, 33, 21, 10])}
      {cont(-hw * 0.45, -hh * 0.45, [24, 14])}
      <path d={smooth([[-hw, hh * 0.35], [-hw * 0.4, hh * 0.25], [0, hh * 0.6], [hw * 0.5, hh * 0.5], [hw, hh * 0.75]])} fill="none" stroke={K.water} stroke-width={3} />
      <g stroke="#4f74b5" stroke-width={1.3} opacity={0.75}>
        {[-0.66, -0.33, 0, 0.33, 0.66].map((t) => (
          <line key={t} x1={t * hw} y1={-hh + 3} x2={t * hw} y2={hh - 3} />
        ))}
      </g>
      <path d={`M${hw - 16} ${-hh + 26}V${-hh + 8}M${hw - 21} ${-hh + 14}L${hw - 16} ${-hh + 7}L${hw - 11} ${-hh + 14}`} fill="none" stroke={K.ink} stroke-width={2} stroke-linecap="round" stroke-linejoin="round" />
      <text x={hw - 16} y={-hh + 37} font-size={10} font-weight={700} text-anchor="middle" fill={K.ink}>K</text>
    </G>
  );
}

/* ---------------- yıldızlar ---------------- */

// Gerçek koordinatlar (sağ açıklık saat, dik açıklık derece); ekrana skyCam ile izdüşürülür.
const STARS = {
  dubhe: [11.062, 61.75], merak: [11.031, 56.38], phecda: [11.897, 53.69], megrez: [12.257, 57.03],
  alioth: [12.9, 55.96], mizar: [13.399, 54.93], alkaid: [13.792, 49.31],
  caph: [0.153, 59.15], schedar: [0.675, 56.54], navi: [0.945, 60.72], ruchbah: [1.43, 60.24], segin: [1.906, 63.67],
  polaris: [2.53, 89.26],
} as const;
type StarName = keyof typeof STARS;
const DIPPER: StarName[] = ['alkaid', 'mizar', 'alioth', 'megrez', 'dubhe', 'merak', 'phecda', 'megrez'];
const CAS: StarName[] = ['caph', 'schedar', 'navi', 'ruchbah', 'segin'];

function Constellation({ names, at, w = 1.4, sizes }: { names: StarName[]; at: (n: StarName) => P; w?: number; sizes?: Partial<Record<StarName, number>> }) {
  const pts = names.map(at);
  const uniq = [...new Set(names)];
  return (
    <g>
      <path d={'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')} fill="none" stroke="#9fb4e0" stroke-width={w} opacity={0.75} />
      {uniq.map((n) => {
        const p = at(n);
        return <Star key={n} x={p[0]} y={p[1]} r={sizes?.[n] ?? 3.6} />;
      })}
    </g>
  );
}

/** Gece arka planı (ay olmadan, yıldız serpintili) */
function NightSky({ gy = 240, seed = 1, avoid = [] }: { gy?: number; seed?: number; avoid?: [number, number, number][] }) {
  const pts: P[] = [];
  let v = seed * 9301;
  for (let i = 0; i < 46; i++) {
    v = (v * 9301 + 49297) % 233280;
    const x = (v / 233280) * 320;
    v = (v * 9301 + 49297) % 233280;
    const y = (v / 233280) * (gy - 10);
    if (avoid.some(([ax, ay, ar]) => Math.hypot(x - ax, y - ay) < ar)) continue;
    pts.push([x, y]);
  }
  return (
    <g>
      <rect width={320} height={240} fill="#18223f" />
      <rect y={gy - 70} width={320} height={70} fill="#22305a" opacity={0.6} />
      {pts.map((p, i) => <circle key={i} cx={f1(p[0])} cy={f1(p[1])} r={i % 3 ? 0.9 : 1.4} fill="#e8ecff" opacity={0.6} />)}
    </g>
  );
}

/* ---------------- ateş ve barınak ---------------- */

/** Kuru ot öbeği (yandan). x,y = taban ortası */
function Grass({ x, y, h = 22, c = DRY, n = 7, w = 16 }: { x: number; y: number; h?: number; c?: string; n?: number; w?: number }) {
  return (
    <g fill="none" stroke={c} stroke-width={2.2} stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1) - 0.5;
        const hh = h * (0.75 + ((i * 37) % 10) / 40);
        return <path key={i} d={`M${f1(x + t * w)} ${y}Q${f1(x + t * w * 1.4)} ${f1(y - hh * 0.6)} ${f1(x + t * w * 2.2 + 3)} ${f1(y - hh)}`} />;
      })}
    </g>
  );
}

/** Dal barınak (yandan profil, küçük): x = sırığın altı (sol), y = zemin */
function LeanTo({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: capsule([0, 0], 2.5, [0, -38], 2.5), f: K.trunk },
          { d: capsule([-4, -36], 2.4, [52, -36], 2.4), f: K.trunk },
          { d: 'M-2 -38L58 -40L66 0H-2Z', f: '#7d9c48' },
          { d: 'M30 -39L58 -40L66 0H34Z', f: shade('#7d9c48', 0.15), no: true },
          { d: 'M8 -30L14 -2M22 -32L30 -2M38 -34L46 -2', st: shade('#7d9c48', 0.35), sw: 1.6 },
        ]}
      />
    </G>
  );
}

/** Yere taşlarla çizilmiş kuzey oku; yanında çömelmiş, sopayla çizen kişi (YON). night: aynı sahne gece. */
function yonOk(night: boolean) {
  // Yerde (hafif perspektif) çizilmiş ok, taşlarla çevrili
  const fx = (x: number, y: number): P => [x, 150 + (y - 150) * 0.68];
  const arrowPts: P[] = [[128, 250], [128, 128], [92, 128], [150, 26], [208, 128], [172, 128], [172, 250]].map(([x, y]) => fx(x, y));
  const outline: P[] = [];
  for (let i = 0; i < arrowPts.length; i++) {
    const a = arrowPts[i], b = arrowPts[(i + 1) % arrowPts.length];
    const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 17));
    for (let k = 0; k < n; k++) outline.push(lerp(a, b, k / n));
  }
  const crouch: PersonProps = { ...YON, x: 268, y: 222, s: 1, flip: true, pose: { ...POSE.crouch, armF: { to: [222, 196] }, armB: { at: 'kneeF', d: [0, -4] }, face: 'neutral' } };
  const hand = rig(crouch).handF;
  const ground = night ? '#5a4a3a' : K.dirt;
  const body = (
    <g>
      <path d={'M' + arrowPts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z'} fill={shade(ground, 0.12)} stroke={shade(ground, 0.35)} stroke-width={3} stroke-linejoin="round" />
      {outline.map((p, i) => <Pebble key={i} x={p[0] + (i % 2 ? 1 : -1) * 2} y={p[1]} rx={7.5} ry={5} c={night ? (i % 3 ? '#8d8b86' : '#a3a19b') : i % 3 ? K.rock : '#bdbab2'} />)}
      <Label x={150} y={fx(0, 26)[1] - 18} text="K" size={18} />
      <Person {...crouch} />
      <Stick a={[hand[0] + 8, hand[1] - 14]} b={[196, 206]} w={2.6} />
    </g>
  );
  if (!night) return <Scene2 bg="outdoor" ground="dirt" gy={64}>{body}</Scene2>;
  return (
    <Scene2 bg="dark">
      <NightSky gy={64} seed={11} />
      <path d="M0 64Q70 46 150 58T320 52V64Z" fill="#26332f" />
      <rect y={64} width={320} height={176} fill={ground} />
      {body}
    </Scene2>
  );
}

/** Kuzeye (az0 kadar döndürülmüş) bakan, pitch derece yukarı eğik kamera; 39° K enleminde,
 *  yerel yıldız zamanı lst (saat). Dönüş: yıldızın ekran konumu. Doğu sağda. */
function skyCam(lst: number, pitch: number, F: number, c: P, az0 = 0) {
  const lat = 39 * R;
  return (n: StarName): P => {
    const [ra, de] = STARS[n];
    const H = (lst - ra) * 15 * R, d = de * R;
    const e = -Math.cos(d) * Math.sin(H);
    const no = -Math.cos(d) * Math.cos(H) * Math.sin(lat) + Math.sin(d) * Math.cos(lat);
    const up = Math.cos(d) * Math.cos(H) * Math.cos(lat) + Math.sin(d) * Math.sin(lat);
    const a = az0 * R;
    const e2 = e * Math.cos(a) - no * Math.sin(a), n2 = e * Math.sin(a) + no * Math.cos(a);
    const pp = pitch * R;
    const fw = n2 * Math.cos(pp) + up * Math.sin(pp), u = -n2 * Math.sin(pp) + up * Math.cos(pp);
    return [c[0] + (e2 / fw) * F, c[1] - (u / fw) * F];
  };
}

/* ════════════════════════════ SAHNELER ════════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ─────────── su bulma ─────────── */

  'hayatta-kalma-su-dinle': () => {
    const base: PersonProps = { ...SB, x: 132, y: 228, s: 1.05, pose: { ...POSE.stand, face: 'neutral' } };
    const r0 = rig(base);
    const ear: P = [r0.head[0] + r0.headR * 1.05, r0.head[1] + 2];
    const p: PersonProps = { ...base, pose: { ...POSE.stand, face: 'neutral', armF: { to: [ear[0] + 9, ear[1] + 8], bend: 1 }, handF: { shape: 'mitten', a: 55 } } };
    return (
      <Scene2 bg="outdoor" gy={196}>
        <Water x={234} y={186} w={86} h={10} />
        <Tree x={300} y={196} kind="pine" s={0.75} />
        <Tree x={214} y={198} kind="pine" s={0.9} />
        <Tree x={36} y={204} kind="pine" s={1.15} />
        <Tree x={268} y={214} kind="leaf" s={0.85} />
        <Person {...p} under={(r) => <OG sh={[{ d: rrect(r.shoulderB[0] + 2, r.shoulderB[1] - 12, r.shoulderF[0] - r.shoulderB[0] - 4, 50, 10), f: PACK }]} />}
          over={(r) => <OG sh={[{ d: capsule([r.shoulderB[0] + 6, r.shoulderB[1] + 2], 2.6, [r.shoulderB[0] + 9, r.shoulderB[1] + 44], 2.6), f: '#8e4128' }, { d: capsule([r.shoulderF[0] - 6, r.shoulderF[1] + 2], 2.6, [r.shoulderF[0] - 9, r.shoulderF[1] + 44], 2.6), f: '#8e4128' }]} />} />
        <Waves x={238} y={160} a={215} n={3} r={9} />
        <Waves x={200} y={112} a={215} n={3} r={9} />
      </Scene2>
    );
  },

  'hayatta-kalma-su-vadi': () => {
    const slope: P[] = [[0, 70], [60, 86], [120, 122], [175, 170], [215, 196], [260, 204], [300, 196], [320, 188]];
    const ySlope = (x: number) => {
      for (let i = 0; i < slope.length - 1; i++) if (x >= slope[i][0] && x <= slope[i + 1][0]) return lerp(slope[i], slope[i + 1], (x - slope[i][0]) / (slope[i + 1][0] - slope[i][0]))[1];
      return 200;
    };
    return (
      <Scene2 bg="outdoor" gy={240}>
        <path d={smooth(slope) + 'V240H0Z'} fill={K.hill} stroke={K.out} stroke-width={1.5} />
        <path d={smooth(slope.slice(3)) + 'V240H175Z'} fill={K.grass} opacity={0.7} />
        {[[40, 0.6], [16, 0.5]].map(([tx, ts], i) => <Tree key={i} x={tx} y={ySlope(tx) + 3} kind="pine" s={ts} />)}
        {[[60, 0], [96, 0]].map(([gx], i) => <Rock key={i} x={gx} y={ySlope(gx) + 4} s={0.5} />)}
        <path d="M206 240C214 226 236 222 252 218C272 213 286 210 300 206C308 204 314 202 320 200V209C312 212 304 214 296 217C278 222 262 226 248 230C236 233 228 236 224 240Z" fill={K.water} stroke={K.out} stroke-width={1.5} />
        {[[196, 205, 13], [222, 212, 11], [236, 200, 14], [276, 198, 12], [300, 214, 13], [186, 226, 12], [268, 232, 11], [314, 228, 10], [250, 203, 9]].map(([bx, by, br], i) => (
          <OG key={i} sh={[{ d: circ([bx, by], br), f: i % 2 ? '#3f8f45' : '#4f9e48' }, { d: circ([bx + br * 0.3, by + br * 0.3], br * 0.55), f: '#3a7d3e', no: true }]} />
        ))}
        <Tree x={252} y={200} kind="leaf" s={0.7} color="#4f9e48" />
        <Tree x={300} y={198} kind="leaf" s={0.6} color="#3f8f45" />
        <Person {...SB} x={88} y={ySlope(88) + 3} s={0.62} pose={{ ...POSE.walk, spine: -84 }} back={(r) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s} color={PACK} />} />
        <Arrow from={[118, 104]} to={[214, 182]} bend={-0.12} w={7} />
      </Scene2>
    );
  },

  'hayatta-kalma-yagmur-toplama': () => {
    const low: P = [160, 146];
    return (
      <Scene2 bg="outdoor" gy={206}>
        <rect width={320} height={206} fill="#8a98a8" opacity={0.45} />
        <Tree x={44} y={214} kind="leaf" s={1.5} />
        <Tree x={276} y={214} kind="leaf" s={1.5} />
        {/* ipler */}
        <g stroke="#e6d6a8" stroke-width={2.2}>
          <line x1={48} y1={98} x2={82} y2={100} />
          <line x1={272} y1={98} x2={238} y2={100} />
          <line x1={48} y1={150} x2={76} y2={136} />
          <line x1={272} y1={150} x2={244} y2={136} />
        </g>
        <OG
          sh={[
            { d: `M82 100Q160 106 238 100L244 136Q200 132 ${low[0] + 8} ${low[1]}L${low[0]} ${low[1] + 4}L${low[0] - 8} ${low[1]}Q120 132 76 136Z`, f: '#5a9fd6' },
            { d: `M82 100Q160 106 238 100L${low[0] + 2} ${low[1]}Z`, f: '#7bb6e4', no: true },
          ]}
        />
        <Pebble x={low[0]} y={low[1] - 5} rx={10} ry={6} />
        {/* yağmur */}
        <g stroke="#dbeefb" stroke-width={2} stroke-linecap="round" opacity={0.9}>
          {Array.from({ length: 22 }, (_, i) => {
            const x = 20 + ((i * 53) % 290), y = 14 + ((i * 37) % 70);
            return <line key={i} x1={x} y1={y} x2={x - 4} y2={y + 12} />;
          })}
        </g>
        <Drop x={low[0]} y={low[1] + 18} s={0.9} />
        <Drop x={low[0]} y={low[1] + 38} s={0.8} />
        <Bucket x={low[0]} y={222} s={1.15} />
        <Arrow from={[low[0] + 24, low[1] - 2]} to={[low[0] + 24, 178]} w={6} />
      </Scene2>
    );
  },

  'hayatta-kalma-ciy-toplama': () => {
    const gy = 206;
    const cloth: P[] = [[160, 170], [232, 166], [238, 181], [156, 184]];
    const p: PersonProps = { ...SB, x: 112, y: 228, s: 1.2, pose: { spine: -46, chest: -34, head: -14, legB: [96, 92], legF: [78, 86], armB: { to: [170, 172] }, armF: { to: [176, 178] }, face: 'neutral' } };
    return (
      <Scene2 bg="dark">
        <defs>
          <linearGradient id="hk-dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#5f6ea8" />
            <stop offset="0.6" stop-color="#d8a3c0" />
            <stop offset="1" stop-color="#ffc7a8" />
          </linearGradient>
        </defs>
        <rect width={320} height={gy} fill="url(#hk-dawn)" />
        <ellipse cx={250} cy={gy - 12} rx={90} ry={30} fill="#ffd9b8" opacity={0.7} />
        <path d={`M0 ${gy - 16}Q70 ${gy - 40} 140 ${gy - 20}T320 ${gy - 24}V${gy}H0Z`} fill="#7c8f86" />
        <rect y={gy} width={320} height={240 - gy} fill="#6f9e58" />
        {Array.from({ length: 18 }, (_, i) => <Grass key={'b' + i} x={8 + i * 18} y={gy + 4} h={30} c="#5d8a48" n={5} w={12} />)}
        <Person {...p} />
        <OG sh={[{ d: smooth(cloth, true, 0.5), f: tint(K.waterLight, 0.55) }, { d: `M166 176H226`, st: shade(K.cloth, 0.2), sw: 1.2 }]} />
        {Array.from({ length: 16 }, (_, i) => <Grass key={'f' + i} x={10 + i * 19} y={232} h={50} c="#86b863" n={6} w={13} />)}
        {/* bezin önündeki çiyli otlar */}
        {[[250, 174], [264, 182], [278, 172], [292, 184], [258, 192]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={3} fill="#e8f6ff" stroke={K.water} stroke-width={1.2} />)}
        <Arrow from={[176, 146]} to={[264, 146]} w={7} />
      </Scene2>
    );
  },

  /* ─────────── su arıtma ─────────── */

  'hayatta-kalma-su-suzme': () => {
    // Dinlendirilmiş kap (dibinde tortu) elde, yavaşça eğilerek üstteki su bezli kaba dökülüyor.
    const MUD = '#8a6640';
    const TOP = '#b9c9c4';
    const a = 104; // kap eğimi (ağız sağa, hafif aşağı)
    const hw = 28, hh = 72; // yerel: taban y=0, ağız y=-hh; merkez y=-hh/2
    const cx = 122, cy = 86; // kap merkezi (sahne)
    const toScene = (p: P): P => {
      const q: P = [p[0], p[1] + hh / 2];
      return [cx + q[0] * Math.cos(a * R) - q[1] * Math.sin(a * R), cy + q[0] * Math.sin(a * R) + q[1] * Math.cos(a * R)];
    };
    const lip = toScene([hw - 2, -hh]);
    const body = `M${-hw} ${-hh}H${hw}V-6Q${hw} 0 ${hw - 6} 0H${-hw + 6}Q${-hw} 0 ${-hw} -6Z`;
    // yerçekimi yerel çerçevede (+x'e yakın): su kabın "sağ" yarısında, yüzeyi yere paralel
    const gx = Math.sin(a * R), gyv = Math.cos(a * R);
    const c0 = gx * 2 + gyv * (-hh / 2);
    const big = 200;
    const wl: P[] = [[c0 * gx - gyv * big, c0 * gyv + gx * big], [c0 * gx + gyv * big, c0 * gyv - gx * big]];
    const waterPoly = `M${wl[0][0]} ${wl[0][1]}L${wl[1][0]} ${wl[1][1]}L${wl[1][0] + gx * big} ${wl[1][1] + gyv * big}L${wl[0][0] + gx * big} ${wl[0][1] + gyv * big}Z`;
    const hd = { a: -10, s: 1.25, pose: 'hold' as const, side: 'L' as const, view: 'back' as const, grip: 44 };
    const hp = handAtP(hd, 'grip', toScene([0, -hh * 0.55]));
    const recv: P = [222, 214];
    return (
      <Scene2 bg="closeup">
        <rect y={206} width={320} height={34} fill="#c9b49a" />
        {/* bezli kap */}
        <Jar x={recv[0]} y={recv[1]} w={70} h={72} level={0.42} wc="#7cbde8" />
        <path d={`M${recv[0] - 40} ${recv[1] - 74}Q${recv[0]} ${recv[1] - 58} ${recv[0] + 40} ${recv[1] - 74}L${recv[0] + 42} ${recv[1] - 64}Q${recv[0]} ${recv[1] - 48} ${recv[0] - 42} ${recv[1] - 64}Z`} fill={K.cloth} stroke={K.out} stroke-width={1.5} />
        {/* akan su */}
        <path d={`M${lip[0]} ${lip[1]}C${lip[0] + 14} ${lip[1] + 4} ${recv[0] - 6} ${recv[1] - 92} ${recv[0] - 4} ${recv[1] - 62}`} fill="none" stroke={TOP} stroke-width={7} stroke-linecap="round" />
        <path d={`M${lip[0]} ${lip[1]}C${lip[0] + 14} ${lip[1] + 4} ${recv[0] - 6} ${recv[1] - 92} ${recv[0] - 4} ${recv[1] - 62}`} fill="none" stroke="#fff" stroke-width={2} stroke-linecap="round" opacity={0.6} />
        {/* elde, dibinde tortu olan kap */}
        <Hand {...hp} arm={220} sleeve={K.role.helper} skin={1}>
          <G x={cx} y={cy} a={a}>
            <g transform={`translate(0 ${hh / 2})`}>
              <defs>
                <clipPath id="hk-pour">
                  <path d={body} />
                </clipPath>
              </defs>
              <path d={body} fill="#e6f1f6" />
              <g clip-path="url(#hk-pour)">
                <path d={waterPoly} fill={TOP} />
                <rect x={-hw} y={-17} width={hw * 2} height={17} fill={MUD} />
                {[[-16, -9], [-4, -6], [9, -10], [18, -5]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={2} fill={shade(MUD, 0.3)} />)}
              </g>
              <path d={body} fill="none" stroke={K.out} stroke-width={1.5} />
              <ellipse cx={0} cy={-hh} rx={hw} ry={4} fill="#f2f8fa" stroke={K.out} stroke-width={1.5} />
            </g>
          </G>
        </Hand>
        <Ok x={recv[0]} y={recv[1] - 20} r={12} />
      </Scene2>
    );
  },

  'hayatta-kalma-su-tablet': () => {
    const h0 = { x: 196, y: -14, a: 196, s: 1.15, pose: 'pinch' as const, side: 'R' as const };
    const p0 = handPoint(h0, 'pinch');
    const h = { ...h0, x: h0.x + 149 - p0[0], y: h0.y + 40 - p0[1] };
    const pin = handPoint(h, 'pinch');
    const eye: P = [56, 104];
    return (
      <Scene2 bg="closeup">
        <rect y={212} width={320} height={28} fill="#c9b49a" />
        {/* matara */}
        <OG
          sh={[
            { d: 'M118 214Q100 214 100 196V120Q100 98 122 92H134V80H164V92H176Q198 98 198 120V196Q198 214 180 214Z', f: '#5c8f63' },
            { d: 'M160 92H176Q198 98 198 120V196Q198 214 180 214H166Z', f: shade('#5c8f63', 0.18), no: true },
            { d: rrect(128, 74, 42, 10, 3), f: '#c5ccd3' },
            { d: rrect(108, 130, 82, 40, 4), f: '#e3d7b8', ln: true },
          ]}
        />
        <ellipse cx={149} cy={75} rx={14} ry={3} fill="#2c5a7c" />
        {/* kapak */}
        <OG sh={[{ d: rrect(222, 196, 36, 16, 4), f: '#3b3f4b' }, { d: 'M226 202H254M226 207H254', st: '#606676', sw: 1.4 }]} />
        {/* tablet paketi: üstte talimat satırları, altta tabletler */}
        <OG
          sh={[
            { d: rrect(16, 136, 76, 76, 5), f: '#e7edf3' },
            { d: 'M24 146H84M24 155H76M24 164H82M24 173H66', st: '#7b8794', sw: 2.6 },
            ...[0, 1, 2].map((i) => ({ d: ell([32 + i * 22, 196], 7, 7), f: i === 0 ? '#9aa6b2' : '#fbfbfb', ln: true }) as Sh),
          ]}
        />
        {/* göz: talimata bak */}
        <OG sh={[{ d: `M${eye[0] - 20} ${eye[1]}Q${eye[0]} ${eye[1] - 17} ${eye[0] + 20} ${eye[1]}Q${eye[0]} ${eye[1] + 17} ${eye[0] - 20} ${eye[1]}Z`, f: '#fff' }, { d: circ(eye, 7.5), f: '#3d6fb0' }, { d: circ(eye, 3.4), f: K.ink, no: true }]} />
        <Dash pts={[[eye[0], eye[1] + 14], [eye[0], 140]]} w={2.6} dash="4 4" />
        <Hand {...h} arm={120} sleeve={K.role.helper} skin={1}>
          <circle cx={pin[0]} cy={pin[1] + 3} r={6} fill="#fbfbfb" stroke={K.out} stroke-width={1.4} />
        </Hand>
        <circle cx={pin[0]} cy={pin[1] + 22} r={5.5} fill="#fbfbfb" stroke={K.out} stroke-width={1.4} />
        <Arrow from={[pin[0] + 26, pin[1] + 2]} to={[pin[0] + 26, 66]} w={5} />
        {/* bekleme: süreyi paket söyler */}
        <Timer x={252} y={112} r={20} />
        <Label x={252} y={152} text="paketteki süre" size={11} />
      </Scene2>
    );
  },

  'hayatta-kalma-sodis': () => {
    const sheetTop = 190;
    let prof = 'M16 198';
    for (let x = 16; x < 196; x += 16) prof += `Q${x + 4} ${sheetTop - 2} ${x + 8} ${sheetTop}T${x + 16} ${sheetTop}`;
    prof += 'L196 200L16 200Z';
    /** Yatay ya da dik şişe. x,y = taban ortası (dikken) */
    const Btl = ({ x, y, a = 0, s = 1, body, liq, cap = '#3a8fd0' }: { x: number; y: number; a?: number; s?: number; body: string; liq: string; cap?: string }) => (
      <G x={x} y={y} a={a} s={s}>
        <OG
          ow={1.5 / s}
          sh={[
            { d: 'M-12 -2V-38Q-12 -46 -5 -49V-54H5V-49Q12 -46 12 -38V-2Q12 0 10 0H-10Q-12 0 -12 -2Z', f: body },
            { d: 'M-10 -44H10V-3Q10 -1 8 -1H-8Q-10 -1 -10 -3Z', f: liq, no: true },
            { d: rrect(-6, -61, 12, 8, 2), f: cap },
            { d: 'M-6 -38V-10', st: '#fff', sw: 2.4 },
          ]}
        />
      </G>
    );
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={170}>
        <Sun x={50} y={42} r={18} />
        <g stroke="#ffd64a" stroke-width={3} stroke-linecap="round" stroke-dasharray="2 8" opacity={0.95}>
          <line x1={66} y1={68} x2={76} y2={160} />
          <line x1={76} y1={62} x2={150} y2={160} />
        </g>
        <OG sh={[{ d: prof, f: '#b9c3cc' }, { d: 'M16 200H196V206H16Z', f: shade('#b9c3cc', 0.2) }]} />
        <Btl x={48} y={sheetTop - 12} a={90} s={1.3} body="#f1f8fb" liq="#d6eef8" />
        <Btl x={126} y={sheetTop - 12} a={90} s={1.3} body="#f1f8fb" liq="#d6eef8" />
        <Label x={140} y={36} text="6 saat" />
        {/* yanlış örnekler */}
        <OG sh={[{ d: rrect(206, 62, 102, 158, 10), f: '#fbfaf7' }]} />
        <Btl x={234} y={196} s={1.45} body="#2e7d3a" liq="#4c9a52" cap="#1f5a28" />
        <No x={234} y={150} r={22} />
        <Btl x={282} y={196} s={1.45} body="#f1f8fb" liq="#8a6232" />
        <No x={282} y={150} r={22} />
        <Bad x={257} y={82} r={11} />
      </Scene2>
    );
  },

  /* ─────────── gölge çubuğu ─────────── */

  'hayatta-kalma-golge-cubuk-1': () => {
    const base: P = [168, 206];
    const top: P = [168, 100];
    const tip: P = [300, 212];
    const kneeler: PersonProps = { ...YON, x: 116, y: 226, s: 1, pose: { ...POSE.kneelOne, spine: -76, chest: -70, head: -80, armF: { to: [top[0] - 2, 150] }, armB: { to: [top[0] - 2, 128] }, handF: 'fist', handB: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={176}>
        <Sun x={36} y={38} r={16} />
        {/* gölge: güneşin tersine, yerde */}
        <path d={`M${base[0]} ${base[1] - 3}L${tip[0]} ${tip[1] - 2}L${tip[0]} ${tip[1] + 2}L${base[0]} ${base[1] + 3}Z`} fill={SOILD} opacity={0.8} />
        <Person {...kneeler} only={['legB', 'armB']} />
        <Stick a={[base[0], base[1] + 2]} b={top} w={3.8} />
        <Person {...kneeler} only={['legF', 'torso', 'head', 'armF']} />
      </Scene2>
    );
  },

  'hayatta-kalma-golge-cubuk-2': () => {
    const st: P = [168, 200];
    const s1: P = [104, 70], s2: P = [196, 64];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.dirt} />
        {[[30, 40], [280, 200], [60, 210], [250, 120], [36, 140], [290, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill={SOILD} opacity={0.5} />)}
        <path d={`M${st[0] - 3} ${st[1]}L${s1[0]} ${s1[1]}L${st[0] + 3} ${st[1]}Z`} fill={SOILD} opacity={0.3} />
        <path d={`M${st[0] - 3.5} ${st[1]}L${s2[0]} ${s2[1]}L${st[0] + 3.5} ${st[1]}Z`} fill={SOILD} opacity={0.85} />
        <OG sh={[{ d: circ(st, 6), f: K.trunk }, { d: circ(st, 2.5), f: tint(K.trunk, 0.3), no: true }]} />
        <Arrow from={[s1[0] + 16, s1[1] - 6]} to={[s2[0] - 16, s2[1] - 8]} bend={0.2} w={4} />
        <Pebble x={s1[0]} y={s1[1]} rx={11} ry={8} />
        <Pebble x={s2[0]} y={s2[1]} rx={11} ry={8} />
        <Label x={s1[0]} y={s1[1] + 24} text="B" size={14} />
        <Label x={s2[0]} y={s2[1] + 24} text="D" size={14} />
        <Timer x={206} y={204} r={14} text="15–20 dk" />
      </Scene2>
    );
  },

  'hayatta-kalma-golge-cubuk-kuzey': () => {
    const B: P = [72, 150], D: P = [248, 150];
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.dirt} />
        <path d={`M${B[0]} ${B[1]}L${D[0]} ${D[1]}`} stroke={SOILD} stroke-width={4} stroke-linecap="round" />
        <Pebble x={B[0]} y={B[1]} rx={11} ry={8} />
        <Pebble x={D[0]} y={D[1]} rx={11} ry={8} />
        <Label x={B[0]} y={B[1] + 24} text="B" size={14} />
        <Label x={D[0]} y={D[1] + 24} text="D" size={14} />
        <TopPerson x={160} y={190} a={-90} s={1.25} top={K.role.helper} skin={YON.skin} hair={YON.hairC} hands={[[-20, 14], [20, 14]]} />
        <Arrow from={[160, 150]} to={[160, 40]} w={9} />
        <Label x={160} y={24} text="K" size={18} />
      </Scene2>
    );
  },

  'hayatta-kalma-yon-ok': () => yonOk(false),
  'hayatta-kalma-yon-ok-gece': () => yonOk(true),

  /* ─────────── yıldızlar ─────────── */

  // Hepsi aynı gerçekçi gök: Türkiye (39° K) gözlemcisi kuzeye bakıyor; yıldız konumları gerçek
  // sağ açıklık/dik açıklıktan (dikdörtgensel kamera izdüşümü: ufuk ve gök büyük çemberleri düz çizgi).
  'hayatta-kalma-buyukayi': () => {
    // Yaz sonu akşamı (yerel yıldız zamanı 21 sa): kepçe kuzeybatıda alçakta, sapı solda.
    const cam = skyCam(21, 18, 280, [176, 104], -10);
    const at = (n: StarName) => cam(n);
    const d = at('dubhe'), m = at('merak');
    const watcher: PersonProps = { ...YON, x: 268, y: 234, s: 0.8, flip: true, shoes: '#151a26', pose: { ...POSE.standSide, spine: -94, chest: -98, head: -130, face: 'neutral' } };
    return (
      <Scene2 bg="dark">
        <NightSky gy={198} seed={3} avoid={DIPPER.map((n) => [...at(n), 10] as [number, number, number])} />
        <Constellation names={DIPPER} at={at} />
        <Ring x={d[0]} y={d[1]} r={9} w={2.6} />
        <Ring x={m[0]} y={m[1]} r={9} w={2.6} />
        <path d="M0 200L14 182L28 200L40 188L54 200L196 200L210 184L224 200L320 200V240H0Z" fill="#101827" />
        <rect y={198} width={320} height={42} fill="#141d2e" />
        <Person {...watcher} />
      </Scene2>
    );
  },

  'hayatta-kalma-kutup-yildizi-bulma': () => {
    // Aynı gök (yıldız zamanı 21 sa), kepçe sol altta. Merak→Dubhe çizgisi kasenin açık tarafından çıkıp
    // Kutup Yıldızı'na gider; Dubhe–Kutup ≈ 5 × Merak–Dubhe.
    const all: StarName[] = ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid', 'polaris'];
    const raw = skyCam(21, 20, 1, [0, 0], -20);
    const pr = all.map((n) => raw(n));
    const bx = [Math.min(...pr.map((q) => q[0])), Math.max(...pr.map((q) => q[0]))];
    const by = [Math.min(...pr.map((q) => q[1])), Math.max(...pr.map((q) => q[1]))];
    const k = Math.min((292 - 28) / (bx[1] - bx[0]), (214 - 26) / (by[1] - by[0]));
    const o: P = [28 - bx[0] * k + (292 - 28 - (bx[1] - bx[0]) * k) / 2, 26 - by[0] * k + (214 - 26 - (by[1] - by[0]) * k) / 2];
    const at = (n: StarName): P => { const q = raw(n); return [o[0] + q[0] * k, o[1] + q[1] * k]; };
    const d = at('dubhe'), m = at('merak'), pl = at('polaris');
    const dir = angOf(m, d);
    const gap = Math.hypot(d[0] - m[0], d[1] - m[1]);
    const dist = Math.hypot(pl[0] - d[0], pl[1] - d[1]);
    const n5 = Math.round(dist / gap);
    const lblP = pol(lerp(d, pl, 0.55), dir + 90, 34);
    return (
      <Scene2 bg="dark">
        <NightSky gy={240} seed={5} avoid={[[pl[0], pl[1], 26], ...all.map((n) => [...at(n), 12] as [number, number, number])]} />
        <Constellation names={DIPPER} at={at} />
        <Dash pts={[pol(m, dir, 7), pol(pl, dir + 180, 14)]} w={2.6} dash="5 5" />
        {Array.from({ length: n5 - 1 }, (_, i) => {
          const c = pol(d, angOf(d, pl), (dist * (i + 1)) / n5);
          const a = pol(c, dir + 90, 7), b = pol(c, dir - 90, 7);
          return <line key={i} x1={f1(a[0])} y1={f1(a[1])} x2={f1(b[0])} y2={f1(b[1])} stroke={K.action} stroke-width={3} stroke-linecap="round" />;
        })}
        <Ring x={d[0]} y={d[1]} r={8} w={2.4} />
        <Ring x={m[0]} y={m[1]} r={8} w={2.4} />
        <Star x={pl[0]} y={pl[1]} r={3.4} c="#ffffff" />
        <Ring x={pl[0]} y={pl[1]} r={12} c="#ffffff" w={2.6} />
        <Label x={lblP[0]} y={lblP[1]} text="×5" size={15} />
      </Scene2>
    );
  },

  'hayatta-kalma-kutup-kuzey': () => {
    // Yandan: kuzey sağda. Kutup Yıldızı gözden 39° yukarıda (Türkiye enlemi); tam altındaki ufuk noktası kuzey.
    const gy = 204;
    const p0: PersonProps = { ...YON, x: 92, y: 232, s: 0.86, pose: { ...POSE.standSide, head: -100, face: 'neutral' } };
    const r0 = rig(p0);
    const eye: P = [r0.head[0] + r0.headR * 0.5, r0.head[1]];
    const star = pol(eye, -39, 150);
    const sh = r0.shoulderF;
    const aim = pol(sh, angOf(sh, star), 60);
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: aim }, handF: { shape: 'flat' } } };
    return (
      <Scene2 bg="dark">
        <NightSky gy={gy} seed={7} avoid={[[star[0], star[1], 24]]} />
        <rect y={gy} width={320} height={240 - gy} fill={K.nightGround} />
        <path d={`M0 ${gy}Q60 ${gy - 14} 130 ${gy - 4}T320 ${gy - 6}V${gy}Z`} fill="#26332f" />
        <Dash pts={[pol(eye, -39, 40), pol(star, 141, 14)]} c="#c9d6f5" w={1.6} dash="3 6" />
        <Dash pts={[[star[0], star[1] + 14], [star[0], gy]]} c="#ffffff" w={2.2} dash="5 6" />
        <Star x={star[0]} y={star[1]} r={4} c="#fff" />
        <Ring x={star[0]} y={star[1]} r={11} c="#fff" w={2.4} />
        <Person {...p} />
        <Arrow from={[132, 226]} to={[star[0] - 8, gy + 6]} w={7} />
        <Label x={star[0] + 24} y={gy + 10} text="K" size={18} />
      </Scene2>
    );
  },

  'hayatta-kalma-kassiopeia': () => {
    // Sonbahar akşamı (yıldız zamanı 21,5 sa): Büyükayı kuzey ufkunun hemen üstünde, Kassiopeia yüksekte;
    // Kutup Yıldızı ikisinin arasında.
    const at = skyCam(21.5, 34, 185, [160, 124], 0);
    const pl = at('polaris');
    const mg = at('megrez'), nv = at('navi');
    const gy = 240; // ufuk çerçevenin hemen altında; ağaçlar kepçenin altını kesiyor
    return (
      <Scene2 bg="dark">
        <NightSky gy={gy} seed={9} avoid={[...DIPPER, ...CAS, 'polaris' as StarName].map((n) => [...at(n), 10] as [number, number, number])} />
        <Constellation names={DIPPER} at={at} />
        <Constellation names={CAS} at={at} />
        <Dash pts={[pol(mg, angOf(mg, pl), 10), pol(pl, angOf(pl, mg), 14)]} c="#c9d6f5" w={1.8} dash="4 6" />
        <Dash pts={[pol(nv, angOf(nv, pl), 10), pol(pl, angOf(pl, nv), 14)]} c="#c9d6f5" w={1.8} dash="4 6" />
        <Star x={pl[0]} y={pl[1]} r={4} c="#fff" />
        <Ring x={pl[0]} y={pl[1]} r={12} />
        <path d="M0 240V226L8 214L16 226L24 206L34 226L44 216L54 230L140 232L150 220L160 232L180 230L196 214L208 230L230 226L246 210L260 228L276 218L290 230L320 228V240Z" fill="#101827" />
      </Scene2>
    );
  },

  /* ─────────── saat yöntemi (kuzey yarımküre, Türkiye: 12 yerine 1) ─────────── */

  'hayatta-kalma-saat-duz': () => {
    const h = { x: 166, y: 262, a: -4, s: 2.7, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    const pm = handPoint(h, 'palm');
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.dirt} />
        <circle cx={60} cy={40} r={70} fill="#fff1b8" opacity={0.35} />
        {[[30, 200], [270, 40], [290, 210], [40, 120], [250, 140]].map(([x, y], i) => <Pebble key={i} x={x} y={y} rx={6} ry={4} />)}
        <Hand {...h} arm={60} sleeve={K.role.helper} skin={YON.skin} />
        <Watch x={pm[0] + 2} y={pm[1] - 44} r={50} h={4} />
      </Scene2>
    );
  },

  'hayatta-kalma-saat-akrep-gunes': () => {
    const c: P = [136, 144];
    const sun: P = [280, 40];
    const r = 58, hh = 4;
    const rot = angOf(c, sun) - (hh * 30 - 90);
    const hand = { x: 0, y: 0, a: rot, s: 2.6, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    const wr = pol(c, rot + 90, 70);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.dirt} />
        <Sun x={sun[0]} y={sun[1]} r={16} />
        <Hand {...hand} x={wr[0]} y={wr[1]} arm={80} sleeve={K.role.helper} skin={YON.skin} />
        <Watch x={c[0]} y={c[1]} r={r} rot={rot} h={hh} />
        <Dash pts={[pol(c, angOf(c, sun), r * 0.5), pol(sun, angOf(sun, c), 26)]} w={3.4} />
      </Scene2>
    );
  },

  'hayatta-kalma-saat-guney': () => {
    // Akrep 4'te ve güneşe bakıyor (yukarı). 1 ile 4 arası açının ortası (2:30) güney.
    const c: P = [158, 150];
    const r = 54, hh = 4;
    const up = -90;
    const rot = up - (hh * 30 - 90);
    const sun: P = [c[0], c[1] - r - 36];
    const bis = rot + ((1 + hh) / 2) * 30 - 90;
    const hand = { x: 0, y: 0, a: 0, s: 2.5, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    const tip = pol(c, bis, r * 1.8);
    const g = pol(tip, bis, 17);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill={K.dirt} />
        <Sun x={sun[0]} y={sun[1]} r={13} />
        <Hand {...hand} x={c[0] + 6} y={c[1] + 96} arm={80} sleeve={K.role.helper} skin={YON.skin} />
        <Watch x={c[0]} y={c[1]} r={r} rot={rot} h={hh} fade12 ring1 wedge={[1, hh]} />
        <Dash pts={[pol(c, up, r * 0.55), pol(sun, 90, 22)]} w={2.6} dash="4 4" />
        <Arrow from={pol(c, bis, r * 0.15)} to={tip} w={8} />
        <Label x={g[0]} y={g[1]} text="G" size={18} />
      </Scene2>
    );
  },

  /* ─────────── pusula ve harita ─────────── */

  'hayatta-kalma-harita-yonlendir': () => {
    const mc: P = [160, 118];
    const ma = -90 - 20;
    const w = 210, h = 150;
    const corner = (lx: number, ly: number): P => {
      const t = (ma + 90) * R;
      return [mc[0] + lx * Math.cos(t) - ly * Math.sin(t), mc[1] + lx * Math.sin(t) + ly * Math.cos(t)];
    };
    const cl = corner(-w / 2 + 8, h / 2 - 4), cr = corner(w / 2 - 8, h / 2 - 4);
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#a99c80" />
        {[[24, 30], [300, 24], [292, 200], [20, 214], [300, 110]].map(([x, y], i) => <Pebble key={i} x={x} y={y} rx={9} ry={6} c="#8e877a" />)}
        <TopoMap x={mc[0]} y={mc[1]} w={w} h={h} a={ma} />
        <BaseComp x={150} y={120} a={ma} bez={ma} ndl={-90} s={0.95} />
        <Hand x={cl[0] - 22} y={cl[1] + 34} a={30} s={0.85} pose="press" side="L" arm={160} sleeve={K.role.helper} skin={PUS.skin} />
        <Hand x={cr[0] + 6} y={cr[1] + 40} a={-10} s={0.85} pose="press" side="R" arm={160} sleeve={K.role.helper} skin={PUS.skin} />
        {/* saat yönünde çevir: haritanın kuzeyi (sola eğik) iğneyle aynı yöne gelsin */}
        <Arrow from={[236, 34]} to={[292, 128]} bend={-0.3} w={6} />
      </Scene2>
    );
  },

  'hayatta-kalma-pusula-kenar': () => {
    const st: P = [74, 196], fl: P = [250, 62];
    const a = angOf(st, fl);
    const mid = lerp(st, fl, 0.5);
    const c = pol(pol(mid, a, -22), a + 90, 27);
    return (
      <Scene2 bg="dark">
        <TopoMap x={160} y={120} w={316} h={236} a={-90} />
        <Dash pts={[st, fl]} c={K.danger} w={2.4} dash="5 5" />
        <OG sh={[{ d: circ(st, 7), f: '#fff' }, { d: circ(st, 2.5), f: K.danger, no: true }]} />
        <BaseComp x={c[0]} y={c[1]} a={a} bez={a + 50} ndl={-96} hi />
        <OG sh={[{ d: capsule([fl[0], fl[1] + 2], 1.6, [fl[0], fl[1] - 30], 1.6), f: K.ink }, { d: `M${fl[0]} ${fl[1] - 30}L${fl[0] + 20} ${fl[1] - 24}L${fl[0]} ${fl[1] - 17}Z`, f: K.danger }]} />
      </Scene2>
    );
  },

  'hayatta-kalma-pusula-kadran': () => {
    const st: P = [74, 196], fl: P = [250, 62];
    const a = angOf(st, fl);
    const mid = lerp(st, fl, 0.5);
    const c = pol(pol(mid, a, -22), a + 90, 27);
    const h0 = { x: 0, y: 0, a: 40, s: 0.95, pose: 'pinch' as const, side: 'R' as const };
    const tgt = pol(c, 150, 28);
    const p0 = handPoint(h0, 'pinch');
    const h = { ...h0, x: tgt[0] - p0[0], y: tgt[1] - p0[1] };
    return (
      <Scene2 bg="dark">
        <TopoMap x={160} y={120} w={316} h={236} a={-90} />
        <Dash pts={[st, fl]} c={K.danger} w={2.4} dash="5 5" />
        <OG sh={[{ d: circ(st, 7), f: '#fff' }, { d: circ(st, 2.5), f: K.danger, no: true }]} />
        <BaseComp x={c[0]} y={c[1]} a={a} bez={-90} ndl={-96} />
        <OG sh={[{ d: capsule([fl[0], fl[1] + 2], 1.6, [fl[0], fl[1] - 30], 1.6), f: K.ink }, { d: `M${fl[0]} ${fl[1] - 30}L${fl[0] + 20} ${fl[1] - 24}L${fl[0]} ${fl[1] - 17}Z`, f: K.danger }]} />
        <Hand {...h} arm={160} sleeve={K.role.helper} skin={PUS.skin} />
        <Arrow from={pol(c, -40, 44)} to={pol(c, 50, 44)} bend={-0.32} w={6} />
      </Scene2>
    );
  },

  'hayatta-kalma-pusula-igne': () => {
    const base: PersonProps = { ...PUS, x: 92, y: 234, s: 1.15, pose: { ...POSE.stand, face: 'neutral' } };
    const r0 = rig(base);
    const hold: P = [r0.hip[0], r0.chest[1] + 26];
    const p: PersonProps = { ...base, pose: { ...POSE.stand, face: 'neutral', armB: { to: [hold[0] - 9, hold[1] + 4] }, armF: { to: [hold[0] + 9, hold[1] + 4] }, handB: { shape: 'flat', a: 60 }, handF: { shape: 'flat', a: -60 } } };
    const ic: P = [236, 108], ir = 70;
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={206} kind="pine" s={0.8} />
        <Tree x={22} y={204} kind="pine" s={0.9} />
        <Person {...p} over={() => <BaseComp x={hold[0]} y={hold[1] - 2} a={-90} bez={-90} ndl={-90} s={0.34} />} />
        <path d={`M${hold[0] + 12} ${hold[1] - 10}L${ic[0] - ir * 0.9} ${ic[1] - ir * 0.42}M${hold[0] + 12} ${hold[1] + 8}L${ic[0] - ir * 0.7} ${ic[1] + ir * 0.72}`} stroke="#fff" stroke-width={2} opacity={0.85} />
        <defs>
          <clipPath id="hk-inset">
            <circle cx={ic[0]} cy={ic[1]} r={ir} />
          </clipPath>
        </defs>
        <circle cx={ic[0]} cy={ic[1]} r={ir} fill="#f3efe6" />
        <g clip-path="url(#hk-inset)">
          <BaseComp x={ic[0]} y={ic[1] + 8} a={-90} bez={-90} ndl={-90} s={1.75} />
        </g>
        <circle cx={ic[0]} cy={ic[1]} r={ir} fill="none" stroke={K.out} stroke-width={2.5} />
        <Ok x={ic[0] + ir * 0.72} y={ic[1] + ir * 0.72} r={15} />
      </Scene2>
    );
  },

  'hayatta-kalma-pusula-hedef': () => {
    const tree: P = [236, 168];
    const p: PersonProps = {
      ...PUS, x: 104, y: 238, s: 1.2, hair: 'none',
      pose: { ...POSE.stand, armB: { to: [92, 140] }, armF: { to: [116, 140] }, behind: ['armB', 'armF'] },
    };
    return (
      <Scene2 bg="outdoor" gy={176}>
        <Tree x={40} y={172} kind="pine" s={0.55} />
        <Tree x={170} y={170} kind="pine" s={0.45} />
        <Tree x={300} y={172} kind="pine" s={0.55} />
        <Tree x={278} y={166} kind="pine" s={0.4} />
        <Tree x={tree[0]} y={tree[1]} kind="leaf" s={0.72} color="#e0a72c" />
        <Ring x={tree[0]} y={tree[1] - 42} r={44} w={4} />
        <Dash pts={[[124, 218], [tree[0] - 2, tree[1] + 2]]} w={4} dash="9 8" />
        <Person {...p} over={(r) => (
          <g>
            <OG sh={[{ d: ell([r.head[0] - r.headR * 1.0, r.head[1] + 2], 3.4, 6), f: K.skin[PUS.skin] }, { d: ell([r.head[0] + r.headR * 1.0, r.head[1] + 2], 3.4, 6), f: K.skin[PUS.skin] }]} />
            <OG sh={[{ d: smooth([[r.head[0] - r.headR * 1.02, r.head[1] + r.headR * 0.55], [r.head[0] - r.headR * 1.04, r.head[1] - r.headR * 0.4], [r.head[0], r.head[1] - r.headR * 1.08], [r.head[0] + r.headR * 1.04, r.head[1] - r.headR * 0.4], [r.head[0] + r.headR * 1.02, r.head[1] + r.headR * 0.55], [r.head[0], r.head[1] + r.headR * 0.95]], true), f: PUS.hairC }, { d: circ([r.head[0], r.head[1] - r.headR * 1.05], r.headR * 0.48), f: PUS.hairC }]} />
            <OG sh={[{ d: rrect(r.neck[0] - 20, r.neck[1] + 10, 40, 56, 9), f: PACK }, { d: rrect(r.neck[0] - 14, r.neck[1] + 40, 28, 20, 5), f: shade(PACK, 0.15) }]} />
          </g>
        )} />
      </Scene2>
    );
  },

  /* ─────────── ateş ─────────── */

  'hayatta-kalma-ates-ruzgar-yasak': () => {
    const gy = 196;
    const bendTree = (x: number, y: number, s: number, kind: 'leaf' | 'pine') => (
      <g transform={`translate(${x} ${y}) skewX(-16) translate(${-x} ${-y})`}>
        <Tree x={x} y={y} s={s} kind={kind} color={kind === 'leaf' ? '#8faa48' : '#4f7d4a'} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect y={gy} width={320} height={240 - gy} fill={DRY} />
        <rect y={gy} width={320} height={3} fill={shade(DRY, 0.15)} />
        {bendTree(230, 200, 1.0, 'leaf')}
        {bendTree(292, 198, 0.9, 'pine')}
        {bendTree(40, 198, 0.8, 'leaf')}
        <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.9}>
          <path d="M14 40H64Q76 40 76 30" />
          <path d="M8 58H90" />
          <path d="M20 76H70Q82 76 82 86" />
        </g>
        {Array.from({ length: 14 }, (_, i) => <Grass key={i} x={14 + i * 23} y={226 - (i % 3) * 6} h={26} c="#c9a94e" />)}
        <Campfire x={124} y={214} s={1.15} />
        {[[156, 168, 2.6], [176, 176, 2.2], [196, 186, 2.6], [214, 196, 2], [168, 158, 1.8], [232, 204, 2.4], [252, 214, 1.8]].map(([x, y, rr], i) => (
          <circle key={i} cx={x} cy={y} r={rr} fill={i % 2 ? K.fireCore : K.fire} stroke={K.fireRed} stroke-width={0.8} />
        ))}
        <path d="M250 222c-4-6 2-9 0-14c5 3 7 8 4 14Z" fill={K.fire} stroke={K.fireRed} stroke-width={1} />
        <No x={124} y={176} r={44} />
      </Scene2>
    );
  },

  'hayatta-kalma-ates-alani': () => {
    const c: P = [146, 112];
    const rr = 84;
    const leaves: [number, number, string][] = [];
    for (let i = 0; i < 130; i++) {
      const x = (i * 71) % 320, y = (i * 113) % 240;
      if (Math.hypot(x - c[0], y - c[1]) > rr + 6) leaves.push([x, y, ['#c98a3a', '#a8682e', '#d9b04a', '#7f9a46'][i % 4]]);
    }
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#6f8a44" />
        {leaves.map(([x, y, col], i) => <ellipse key={i} cx={x} cy={y} rx={6} ry={3.4} transform={`rotate(${(i * 47) % 180} ${x} ${y})`} fill={col} stroke={shade(col, 0.3)} stroke-width={0.8} />)}
        <circle cx={c[0]} cy={c[1]} r={rr} fill={SOIL} stroke={SOILD} stroke-width={2} />
        {Array.from({ length: 12 }, (_, i) => {
          const p = pol(c, i * 30, 26);
          return <Pebble key={i} x={p[0]} y={p[1]} rx={8} ry={7} />;
        })}
        <circle cx={c[0]} cy={c[1]} r={18} fill="#4a4440" />
        <Stick a={[c[0] - 14, c[1] - 8]} b={[c[0] + 14, c[1] + 8]} w={3.6} />
        <Stick a={[c[0] - 14, c[1] + 8]} b={[c[0] + 14, c[1] - 8]} w={3.6} />
        <Flame x={c[0]} y={c[1] + 8} s={0.55} />
        {/* çap ölçüsü */}
        <g stroke={K.ink} stroke-width={1.6}>
          <line x1={c[0] - rr} y1={c[1] + 30} x2={c[0] - rr} y2={c[1] + 110} stroke-dasharray="3 3" />
          <line x1={c[0] + rr} y1={c[1] + 30} x2={c[0] + rr} y2={c[1] + 110} stroke-dasharray="3 3" />
        </g>
        <Arrow from={[c[0] - 26, 214]} to={[c[0] - rr + 1, 214]} w={4} />
        <Arrow from={[c[0] + 26, 214]} to={[c[0] + rr - 1, 214]} w={4} />
        <Label x={c[0]} y={214} text="3 m" size={14} />
        {/* su kovası (üstten) */}
        <OG sh={[{ d: circ([286, 196], 20), f: '#8aa0b2' }, { d: circ([286, 196], 16), f: K.water, ln: true }, { d: 'M266 196Q286 166 306 196', st: K.out, sw: 2.2 }]} />
      </Scene2>
    );
  },

  'hayatta-kalma-ates-yakma': () => {
    const apex: P = [150, 92];
    const feet = [104, 120, 136, 166, 182, 198];
    const h0 = { x: 0, y: 0, a: 58, s: 0.95, pose: 'pinch' as const, side: 'R' as const };
    const p0 = handPoint(h0, 'pinch');
    const match0: P = [118, 196];
    const h = { ...h0, x: match0[0] - 26 - p0[0], y: match0[1] + 14 - p0[1] };
    const pin = handPoint(h, 'pinch');
    return (
      <Scene2 bg="closeup">
        <rect y={200} width={320} height={40} fill={SOIL} />
        {[78, 112, 190, 224].map((x, i) => <Rock key={i} x={x} y={190} s={0.7} color="#97948d" />)}
        {/* 1: kav */}
        <OG sh={[{ d: smooth([[116, 200], [124, 182], [140, 174], [160, 172], [178, 178], [188, 200]], true), f: '#e7c95e' }]} />
        <g stroke="#b99a3c" stroke-width={1.6} fill="none">
          <path d="M124 196Q140 180 156 186M138 198Q152 178 172 184M150 198Q168 182 182 196M128 186L146 176M160 178L176 186" />
        </g>
        {/* 2: çadır biçiminde ince dallar */}
        {feet.map((x, i) => <Stick key={i} a={[x, 202]} b={lerp([x, 202], apex, 0.98)} w={2.6} c={i % 2 ? '#9b6a43' : '#8a5a36'} />)}
        {/* 3: kalın odunlar */}
        <OG sh={[
          { d: capsule([238, 206], 9, [300, 206], 9), f: K.trunk },
          { d: capsule([244, 188], 9, [306, 188], 9), f: shade(K.trunk, 0.08) },
          { d: circ([238, 206], 8), f: '#d2a56f', ln: true },
          { d: circ([244, 188], 8), f: '#d2a56f', ln: true },
        ]} />
        {[[50, 206], [266, 206]].map(([x], i) => <Rock key={i} x={x === 50 ? 40 : 320} y={226} s={0.9} color="#97948d" />)}
        <Rock x={150} y={232} s={0.9} color="#97948d" />
        <Rock x={98} y={232} s={0.8} color="#97948d" />
        <Rock x={202} y={232} s={0.8} color="#97948d" />
        {/* kibrit */}
        <Hand {...h} arm={140} sleeve={K.role.helper} skin={1}>
          <line x1={pin[0]} y1={pin[1]} x2={match0[0]} y2={match0[1]} stroke="#e8c48a" stroke-width={2.6} />
        </Hand>
        <circle cx={match0[0]} cy={match0[1]} r={2.6} fill={K.red} />
        <Flame x={match0[0] + 6} y={match0[1] + 2} s={0.42} />
        <Label x={102} y={168} text="1" size={13} />
        <Label x={176} y={96} text="2" size={13} />
        <Label x={272} y={160} text="3" size={13} />
      </Scene2>
    );
  },

  'hayatta-kalma-ates-sondurme': () => {
    const panel = (x: number, n: string, children: ComponentChildren) => (
      <g>
        <defs>
          <clipPath id={`hk-snd${n}`}>
            <rect x={x} y={40} width={92} height={176} rx={10} />
          </clipPath>
        </defs>
        <OG sh={[{ d: rrect(x, 40, 92, 176, 10), f: '#f8f6f0' }]} />
        <g clip-path={`url(#hk-snd${n})`}>
          <G x={x} y={40}>{children}</G>
        </g>
        <path d={rrect(x, 40, 92, 176, 10)} fill="none" stroke={K.out} stroke-width={1.5} />
        <Label x={x + 46} y={28} text={n} size={13} />
      </g>
    );
    const ash = (embers: boolean) => (
      <g>
        <OG sh={[{ d: 'M10 156Q46 128 82 156Z', f: '#8d8a86' }, { d: 'M4 158H88V166H4Z', f: SOIL }]} />
        {embers && [[34, 148], [48, 144], [60, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={K.fireRed} />)}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {panel(8, '1', (
          <g>
            <OG sh={[{ d: 'M4 158H88V166H4Z', f: SOIL }]} />
            <Campfire x={46} y={160} s={0.62} fire={false} />
            <path d="M38 152c-3-6 2-9 0-14c4 3 6 8 3 14Z" fill={K.fire} />
            <G x={70} y={50} a={-130} s={0.8}><Bucket x={0} y={0} /></G>
            <Hand x={80} y={40} a={225} s={0.5} pose="fist" side="R" arm={120} sleeve={K.role.helper} skin={1} />
            <path d="M54 66C50 82 47 104 46 140" fill="none" stroke={K.water} stroke-width={6} stroke-linecap="round" />
            <g fill="none" stroke="#c4ccd4" stroke-width={2.6} stroke-linecap="round">
              <path d="M24 136c-5-6 4-10 0-18M70 138c-5-6 4-10 0-18M30 112c-4-5 3-8 0-14" />
            </g>
          </g>
        ))}
        {panel(114, '2', (
          <g>
            {ash(true)}
            <Stick a={[74, 20]} b={[42, 150]} w={2.8} />
            <Hand x={80} y={30} a={205} s={0.5} pose="fist" side="R" arm={120} sleeve={K.role.helper} skin={1} />
            <path d="M24 128Q46 112 68 128" fill="none" stroke={K.action} stroke-width={3} stroke-linecap="round" />
            <path d="M64 120L70 129L60 131Z" fill={K.action} />
          </g>
        ))}
        {panel(220, '3', (
          <g>
            {ash(false)}
            <Hand x={46} y={60} a={180} s={0.68} pose="open" side="R" view="back" arm={120} sleeve={K.role.helper} skin={1} />
            <Ok x={76} y={140} r={12} />
          </g>
        ))}
        <Arrow from={[101, 128]} to={[121, 128]} w={4} />
        <Arrow from={[207, 128]} to={[227, 128]} w={4} />
      </Scene2>
    );
  },

  /* ─────────── barınak ─────────── */

  'hayatta-kalma-barinak-yer': () => {
    const deadTree = (x: number, y: number) => (
      <OG sh={[
        { d: capsule([x, y], 5, [x - 2, y - 92], 3), f: '#9c938a' },
        { d: capsule([x - 1, y - 50], 2.6, [x - 26, y - 76], 1.6), f: '#9c938a' },
        { d: capsule([x - 1, y - 66], 2.4, [x + 24, y - 92], 1.5), f: '#9c938a' },
        { d: capsule([x - 2, y - 84], 2, [x - 16, y - 104], 1.3), f: '#9c938a' },
        { d: capsule([x + 12, y - 78], 1.6, [x + 30, y - 76], 1.2), f: '#9c938a' },
      ]} />
    );
    return (
      <Scene2 bg="outdoor">
        <path d="M222 200L250 150L262 120L290 80L300 50L320 40V200Z" fill="#a49a8a" stroke={K.out} stroke-width={1.5} />
        <path d="M262 120L290 80L300 50L306 48L298 96L276 140Z" fill="#8c8273" />
        <Rock x={250} y={128} s={0.42} />
        <Rock x={238} y={160} s={0.38} />
        <g stroke={K.ink} stroke-width={1.6} stroke-linecap="round" opacity={0.6}>
          <path d="M256 112l4 -8M244 146l4 -8" />
        </g>
        <Rock x={232} y={202} s={0.5} />
        {/* kuru dere yatağı */}
        <path d="M0 206Q40 200 76 208Q60 224 0 222Z" fill="#d8c7a0" stroke={SOILD} stroke-width={1.5} />
        {[[14, 214], [32, 210], [50, 214], [22, 218], [64, 210]].map(([x, y], i) => <Pebble key={i} x={x} y={y} rx={4} ry={2.6} />)}
        {deadTree(110, 204)}
        <Tree x={146} y={204} s={0.8} />
        <Tree x={214} y={204} s={0.75} kind="pine" />
        <LeanTo x={158} y={210} s={0.8} />
        <No x={38} y={180} r={22} />
        <No x={108} y={132} r={22} />
        <No x={276} y={108} r={22} />
        <Ok x={184} y={164} r={13} />
      </Scene2>
    );
  },

  'hayatta-kalma-zemin-yalitim': () => {
    const gt = 178;
    const p: PersonProps = { ...KAMP, x: 180, y: gt - 26, s: 1.05, pose: { ...POSE.sitFloor, spine: -80, armB: { floor: -22 }, armF: { floor: -18 }, legB: [4, 6], legF: [-2, 4], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gt}>
        <rect y={gt} width={320} height={240 - gt} fill={SOIL} />
        <rect y={gt} width={320} height={3} fill={SOILD} />
        {[[30, 200], [70, 224], [120, 210], [250, 230], [290, 205], [210, 214], [160, 232]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={SOILD} />)}
        {/* yalıtım katmanı */}
        <OG sh={[{ d: `M92 ${gt}Q90 ${gt - 30} 110 ${gt - 28}H290Q306 ${gt - 30} 304 ${gt}Z`, f: '#b5783a' }]} />
        {Array.from({ length: 30 }, (_, i) => {
          const x = 100 + (i * 37) % 200, y = gt - 6 - ((i * 13) % 22);
          const col = ['#d08a3c', '#a8632c', '#e0b050', '#6d8f3e'][i % 4];
          return <ellipse key={i} cx={x} cy={y} rx={8} ry={3.6} transform={`rotate(${(i * 41) % 60 - 30} ${x} ${y})`} fill={col} stroke={shade(col, 0.35)} stroke-width={0.9} />;
        })}
        {[110, 170, 240].map((x, i) => (
          <path key={i} d={`M${x} ${gt - 14 + i * 2}h44M${x + 8} ${gt - 14 + i * 2}l-5 -5M${x + 18} ${gt - 14 + i * 2}l-5 -5M${x + 28} ${gt - 14 + i * 2}l-5 -5M${x + 8} ${gt - 14 + i * 2}l-5 5M${x + 18} ${gt - 14 + i * 2}l-5 5M${x + 28} ${gt - 14 + i * 2}l-5 5`} stroke="#2f7a4e" stroke-width={2} stroke-linecap="round" fill="none" />
        ))}
        <Person {...p} />
        {/* soğuk okları: topraktan yükselir, katmanda kesilir */}
        {[134, 200, 264].map((x) => (
          <g key={x}>
            <Arrow from={[x, 234]} to={[x, gt + 6]} w={4} color={K.water} />
            <line x1={x - 12} y1={gt + 1} x2={x + 12} y2={gt + 1} stroke="#fff" stroke-width={4} stroke-linecap="round" />
          </g>
        ))}
        <Arrow from={[40, 228]} to={[40, 150]} w={4} color={K.water} />
        {/* kalınlık */}
        <g stroke={K.ink} stroke-width={2} stroke-linecap="round">
          <line x1={82} y1={gt - 28} x2={82} y2={gt} />
          <line x1={76} y1={gt - 28} x2={104} y2={gt - 28} stroke-dasharray="3 3" />
          <line x1={76} y1={gt} x2={88} y2={gt} />
        </g>
        <Label x={70} y={gt - 48} text="1 karış" size={14} />
      </Scene2>
    );
  },

  'hayatta-kalma-barinak-dal': () => {
    // Eğik izdüşüm: X sırık boyunca (sağa), Z derinlik (sağ-yukarı), Y yukarı.
    const G0 = 214;
    const pr = (X: number, Y: number, Z: number): P => [X + 0.6 * Z, G0 - Y - 0.2 * Z];
    const H = 78, D = 84; // sırık yüksekliği (bel), dalların yere değdiği derinlik
    const x1 = 40, x2 = 236;
    const th = 22; // yaprak örtü kalınlığı
    const nZ = 0.69 * th, nY = 0.72 * th; // çatıya dik, dışarı doğru
    const pA = pr(x1, H, 0), pB = pr(x2, H, 0), gA = pr(x1, 0, D), gB = pr(x2, 0, D);
    const oA = pr(x1, H + nY, nZ), oB = pr(x2, H + nY, nZ), ogA = pr(x1, nY * 0.4, D + nZ), ogB = pr(x2, nY * 0.4, D + nZ);
    const xs = Array.from({ length: 26 }, (_, i) => x1 + 4 + i * ((x2 - x1 - 8) / 25));
    const lyer: PersonProps = { ...KAMP, x: 150, y: pr(0, 0, 40)[1] + 2, s: 0.84, pose: { ...POSE.lieBack } };
    const leaf = '#6f9a45';
    const pts = (a: P[]) => 'M' + a.map((q) => `${f1(q[0])} ${f1(q[1])}`).join('L') + 'Z';
    return (
      <Scene2 bg="outdoor" gy={150}>
        {/* arka ağaç gövdeleri (sırığın bağlandığı iki ağaç önde) */}
        {/* yaprak örtü: dalların üstünde (dış yüz) */}
        <OG sh={[{ d: pts([pA, oA, oB, ogB, gB, gA]), f: leaf }]} />
        {Array.from({ length: 30 }, (_, i) => {
          const t = (i * 0.37) % 1, u = ((i * 0.61) % 1) * 0.7;
          const q = lerp(lerp(oA, oB, t), lerp(ogA, ogB, t), u * 0.25);
          return <ellipse key={i} cx={f1(q[0])} cy={f1(q[1] + 4)} rx={6.5} ry={3} transform={`rotate(${(i * 29) % 50 - 20} ${f1(q[0])} ${f1(q[1] + 4)})`} fill={i % 3 ? '#86b052' : '#b98a3a'} stroke="#4c6b2e" stroke-width={0.8} />;
        })}
        {/* çatının altı (içeriden görünen yüz) */}
        <path d={pts([pA, pB, gB, gA])} fill={shade(leaf, 0.35)} />
        {/* eğik dallar: sırıktan yere */}
        {xs.map((x, i) => <Stick key={i} a={pr(x, H, 0)} b={pr(x, 0, D + 2)} w={2.6} c={i % 2 ? '#8a5a36' : '#a06e45'} />)}
        {/* kesit: sol uçta dal + üstünde yaprak katmanı */}
        <OG sh={[{ d: pts([pA, oA, ogA, gA]), f: '#86b052' }]} />
        {[0.15, 0.35, 0.55, 0.75].map((t, i) => {
          const q = lerp(lerp(pA, gA, t), lerp(oA, ogA, t), 0.55);
          return <ellipse key={i} cx={f1(q[0])} cy={f1(q[1])} rx={5} ry={2.4} transform={`rotate(52 ${f1(q[0])} ${f1(q[1])})`} fill={i % 2 ? '#b98a3a' : '#5d8a3a'} stroke="#4c6b2e" stroke-width={0.8} />;
        })}
        <Stick a={pA} b={pr(x1, 0, D + 2)} w={3} c="#8a5a36" />
        {/* yaprak döşek ve uzanan kişi */}
        <OG sh={[{ d: ell(pr(150, 0, 40), 92, 8), f: '#b5783a' }]} />
        {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={f1(70 + i * 15)} cy={f1(pr(0, 0, 40)[1] - 2 + (i % 3) * 3)} rx={6} ry={2.8} fill={['#d08a3c', '#e0b050', '#a8632c'][i % 3]} />)}
        <Person {...lyer} />
        {/* iki ağaç ve aralarına bel yüksekliğinde bağlı sırık */}
        {[x1 - 16, x2 + 16].map((tx, i) => (
          <OG key={i} sh={[
            { d: `M${tx - 8} ${G0 + 2}L${tx - 6} 20H${tx + 6}L${tx + 8} ${G0 + 2}Z`, f: K.trunk },
            { d: `M${tx + 2} ${G0 + 2}L${tx + 2} 20H${tx + 6}L${tx + 8} ${G0 + 2}Z`, f: shade(K.trunk, 0.18), no: true },
            { d: circ([tx - 18, 14], 24), f: K.leaf },
            { d: circ([tx + 18, 10], 24), f: K.leaf },
          ]} />
        ))}
        <Stick a={[x1 - 26, pA[1]]} b={[x2 + 26, pB[1]]} w={4} />
        <g stroke="#e6d6a8" stroke-width={3}>
          <path d={`M${x1 - 22} ${pA[1] - 6}l8 12M${x1 - 18} ${pA[1] - 7}l8 12M${x2 + 10} ${pB[1] - 6}l8 12M${x2 + 14} ${pB[1] - 7}l8 12`} />
        </g>
      </Scene2>
    );
  },

};
