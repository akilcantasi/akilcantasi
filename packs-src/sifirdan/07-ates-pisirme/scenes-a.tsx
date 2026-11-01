// Sıfırdan: Ateş, ısınma ve pişirme paketi sahneleri (a). Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Arrow, Bad, Bed, Door, Flame, Hand, K, Label, No, OG, Ok, Person, POSE, Pot, Rock, Scene2, Tree, Waves, Window,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Sh } from '../../../src/art/kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);
let uid = 0;
const nid = () => 'apa' + ++uid;

/** El bileğini, elin verilen noktası hedefe gelecek şekilde konumlar. */
function handAt<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

/* ─────────── paket geneli malzeme renkleri ─────────── */
const M = {
  kerpic: '#d2a676',
  kil: '#b98458', // fırın/tandır çamuru, kil yüksük
  tugla: '#b65b3d',
  atesTugla: '#e2c592',
  tas: '#aaa69d',
  tasD: '#8b877f',
  odun: K.trunk, // kütük kabuğu
  odunIc: '#dcb57f', // kesik yüz
  ahsap: '#c99057', // yapı ahşabı (kiriş, döşeme, duvar)
  demir: '#535a63',
  sac: '#8f98a2',
  kul: '#a7a29a',
  koz: '#e2452b',
  toprak: '#a77b52',
  toprakD: '#8a6342',
  yalitim: '#ece4d2', // kül, ponza, perlit: hafif yanmaz dolgu
  saman: '#e2c66a',
  yaprak: '#5aa84f',
  kav: '#2f2a28', // kömür bez
  cakmakTasi: '#59616c',
};

/** Kalın, dış hatlı çizgi (tel, sap, çubuk) */
function Rod({ d, w = 4, c = M.demir }: { d: string; w?: number; c?: string }) {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={w + 3} />
      <path d={d} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Çok noktalı akış oku (duman/hava yolu). */
function Flow({ pts, c = K.action, w = 5, round = false }: { pts: P[]; c?: string; w?: number; round?: boolean }) {
  const a = pts[pts.length - 1], b = pts[pts.length - 2];
  const ang = Math.atan2(a[1] - b[1], a[0] - b[0]) / R;
  const hl = w * 2.2 + 4;
  const end = pol(a, ang, -hl * 0.6);
  const body = [...pts.slice(0, -1), end];
  const d = round ? smooth(body, false, 0.9) : 'M' + body.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
  const base = pol(a, ang, -hl * 0.85);
  const hp = `M${f1(a[0])} ${f1(a[1])}L${pol(base, ang + 90, hl * 0.6).map(f1).join(' ')}L${pol(base, ang - 90, hl * 0.6).map(f1).join(' ')}Z`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={w + 3} />
      <path d={hp} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} fill="none" stroke={c} stroke-width={w} />
      <path d={hp} fill={c} />
    </g>
  );
}
const AIR = '#6fb6e0';

/** Ölçü çizgisi: uçlarda dik çentik, ortada beyaz etiket. */
function Dim({ a, b, text, size = 12, at = 0.5, off = [0, 0] }: { a: P; b: P; text: string; size?: number; at?: number; off?: P }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  const t1 = [pol(a, ang + 90, 6), pol(a, ang - 90, 6)];
  const t2 = [pol(b, ang + 90, 6), pol(b, ang - 90, 6)];
  const m = lerp(a, b, at);
  return (
    <g>
      <g stroke={K.ink} stroke-width={1.6} stroke-linecap="round">
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        <line x1={t1[0][0]} y1={t1[0][1]} x2={t1[1][0]} y2={t1[1][1]} />
        <line x1={t2[0][0]} y1={t2[0][1]} x2={t2[1][0]} y2={t2[1][1]} />
      </g>
      <Label x={m[0] + off[0]} y={m[1] + off[1]} text={text} size={size} bg={K.white} />
    </g>
  );
}

/** Tuğla örgü dikdörtgeni (kesit ya da cephe) */
function Bricks({ x, y, w, h, c = M.tugla, bw = 18, bh = 9 }: { x: number; y: number; w: number; h: number; c?: string; bw?: number; bh?: number }) {
  const id = nid();
  const rows = Math.ceil(h / bh);
  return (
    <g>
      <clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath>
      <rect x={x} y={y} width={w} height={h} fill={c} />
      <g clip-path={`url(#${id})`} stroke={shade(c, 0.35)} stroke-width={1.1}>
        {Array.from({ length: rows }, (_, i) => (
          <g key={i}>
            <line x1={x} y1={y + i * bh} x2={x + w} y2={y + i * bh} />
            {Array.from({ length: Math.ceil(w / bw) + 1 }, (_, j) => {
              const xx = x + j * bw + (i % 2 ? bw / 2 : 0);
              return <line key={j} x1={xx} y1={y + i * bh} x2={xx} y2={y + (i + 1) * bh} />;
            })}
          </g>
        ))}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Taş örgü dikdörtgeni */
function Stones({ x, y, w, h, c = M.tas, r = 9 }: { x: number; y: number; w: number; h: number; c?: string; r?: number }) {
  const id = nid();
  const rows = Math.ceil(h / (r * 1.6)) + 1;
  return (
    <g>
      <clipPath id={id}><rect x={x} y={y} width={w} height={h} /></clipPath>
      <rect x={x} y={y} width={w} height={h} fill={shade(c, 0.28)} />
      <g clip-path={`url(#${id})`}>
        {Array.from({ length: rows }, (_, i) =>
          Array.from({ length: Math.ceil(w / (r * 2)) + 2 }, (_, j) => {
            const cx = x + j * r * 2.05 + (i % 2 ? r : 0) - r * 0.3;
            const cy = y + i * r * 1.6 + r * 0.7;
            const k = (i * 7 + j * 3) % 5;
            return <ellipse key={i + '-' + j} cx={cx} cy={cy} rx={r * (0.92 + k * 0.03)} ry={r * 0.72} fill={k % 2 ? c : tint(c, 0.12)} stroke={shade(c, 0.4)} stroke-width={0.9} />;
          }),
        )}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Toprak kesiti (noktalı) */
function Soil({ x, y, w, h, c = M.toprak }: { x: number; y: number; w: number; h: number; c?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c} />
      <g fill={shade(c, 0.25)}>
        {Array.from({ length: Math.round((w * h) / 260) }, (_, i) => (
          <circle key={i} cx={x + ((i * 53.7) % w)} cy={y + ((i * 31.3 + (i % 3) * 7) % h)} r={1.3} />
        ))}
      </g>
    </g>
  );
}

/** Kızıl köz yığını */
function Coals({ x, y, w = 60, n = 9, dark = false }: { x: number; y: number; w?: number; n?: number; dark?: boolean }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const cx = x - w / 2 + t * w;
        const h = Math.sin(t * Math.PI);
        const cy = y - 4 - h * 6 - (i % 2) * 3;
        const c = dark ? (i % 3 ? '#3b3533' : '#4a4340') : i % 3 === 0 ? K.fireCore : i % 3 === 1 ? K.fire : M.koz;
        return <ellipse key={i} cx={cx} cy={cy} rx={6} ry={4.4} fill={c} stroke={dark ? K.out : shade(M.koz, 0.3)} stroke-width={1.1} />;
      })}
    </g>
  );
}

/** Duman topakları (havada) */
function Puffs({ x, y, n = 3, r = 8, c = K.smoke, op = 0.85, dx = 4, dy = -14 }: { x: number; y: number; n?: number; r?: number; c?: string; op?: number; dx?: number; dy?: number }) {
  return (
    <g opacity={op}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x + dx * i + (i % 2 ? 3 : -3)} cy={y + dy * i} r={r * (1 + i * 0.22)} fill={c} />
      ))}
    </g>
  );
}

/** Kıvılcım (küçük yıldız) */
function Spark({ x, y, r = 3.2, c = K.fireCore }: { x: number; y: number; r?: number; c?: string }) {
  const k = r * 0.35;
  return <path d={`M${x} ${y - r * 1.6}L${x + k} ${y - k}L${x + r * 1.6} ${y}L${x + k} ${y + k}L${x} ${y + r * 1.6}L${x - k} ${y + k}L${x - r * 1.6} ${y}L${x - k} ${y - k}Z`} fill={c} stroke={K.fireRed} stroke-width={0.7} />;
}

/** Güneş */
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
    </g>
  );
}

/** Yandan kütük (kabuklu), a ucundan kesik yüz görünür */
function Log({ a, b, r = 9, c = M.odun }: { a: P; b: P; r?: number; c?: string }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  return (
    <g>
      <OG sh={[{ d: capsule(a, r, b, r), f: c }, { d: ell(a, r * 0.55, r), f: M.odunIc, t: `rotate(${f1(ang)} ${a[0]} ${a[1]})`, ln: true }]} />
    </g>
  );
}
/** Kütüğün kesik yüzü (önden), yıllık halkalı */
function LogEnd({ x, y, r = 12, bark = true }: { x: number; y: number; r?: number; bark?: boolean }) {
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: bark ? M.odun : M.odunIc }, ...(bark ? [{ d: circ([x, y], r * 0.82), f: M.odunIc, ln: true }] : [])]} />
      <g fill="none" stroke={shade(M.odunIc, 0.25)} stroke-width={0.9}>
        <circle cx={x} cy={y} r={r * 0.5} />
        <circle cx={x} cy={y} r={r * 0.22} />
      </g>
    </g>
  );
}

/** Rüzgâr çizgileri (beyaz) */
function Wind({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.95}>
        <path d="M0 0H44Q54 0 54 -9" />
        <path d="M-8 14H56" />
        <path d="M2 28H40Q50 28 50 37" />
      </g>
    </G>
  );
}

/** Kömür bez parçası (üstten) */
const charCloth = (x: number, y: number, w = 26, h = 22, a = 0) => (
  <OG sh={[{ d: `M${-w / 2} ${-h / 2}L${w / 2 - 2} ${-h / 2 + 1}L${w / 2} ${h / 2 - 1}L${-w / 2 + 1} ${h / 2}Z`, f: M.kav, t: `translate(${x} ${y}) rotate(${a})` }]} />
);

/** Kuru ot yuvası (yandan) */
function Nest({ x, y, s = 1, smoke = false, flame = false }: { x: number; y: number; s?: number; smoke?: boolean; flame?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      {smoke && <Puffs x={2} y={-26} n={3} r={6} op={0.75} c="#9aa1a8" />}
      {flame && <Flame x={0} y={-10} s={0.38} />}
      <OG ow={1.5 / s} sh={[{ d: smooth([[-24, 0], [-22, -12], [-10, -18], [8, -18], [22, -12], [24, 0], [10, 6], [-10, 6]], true), f: '#dcc06a' }]} />
      <g fill="none" stroke="#b39436" stroke-width={1.4 / s} stroke-linecap="round">
        <path d="M-18 -8Q-4 -16 12 -10M-14 0Q0 -10 18 -4M-20 -2L-8 -14M6 -16L20 -6M-6 2Q6 -6 16 2" />
      </g>
      {(smoke || flame) && <circle cx={0} cy={-8} r={4} fill={M.koz} />}
    </G>
  );
}

/** C biçimli çelik çakmak (demirci çakmağı) */
function Striker({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <Rod d="M-26 4Q-38 4 -38 -7Q-38 -18 -22 -18M26 4Q38 4 38 -7Q38 -18 22 -18" w={5} c={M.demir} />
      <OG ow={1.5 / s} sh={[{ d: rrect(-28, -2, 56, 10, 3), f: '#6b737d' }, { d: 'M-26 6H26', st: '#a9b2bc', sw: 1.6 }]} />
    </G>
  );
}

/** Çakmaktaşı (keskin kenarlı). x,y = merkez */
function Flint({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-24 10L-20 -8L-4 -16L14 -14L26 -4L20 12L-4 16Z', f: M.cakmakTasi },
        { d: 'M-4 -16L14 -14L26 -4L8 -2Z', f: tint(M.cakmakTasi, 0.25), no: true },
        { d: 'M-24 10L-20 -8L-6 2L-4 16Z', f: shade(M.cakmakTasi, 0.2), no: true },
      ]} />
    </G>
  );
}

/** Büyüteç. x,y = mercek merkezi, a = sapın açısı */
function Magnifier({ x, y, r = 22, a = 40 }: { x: number; y: number; r?: number; a?: number }) {
  const h1 = pol([x, y], a, r + 2), h2 = pol([x, y], a, r + 34);
  return (
    <g>
      <OG sh={[{ d: capsule(h1, 4, h2, 5.5), f: '#3d3a45' }, { d: circ([x, y], r + 4), f: '#c9a447' }, { d: circ([x, y], r), f: '#dff2fb', ln: true }]} />
      <path d={`M${x - r * 0.5} ${y - r * 0.2}Q${x - r * 0.4} ${y - r * 0.55} ${x - r * 0.05} ${y - r * 0.6}`} fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />
    </g>
  );
}

/** Teneke kutu (yandan, hafif üstten). x,y = taban ortası */
function Tin({ x, y, w = 56, h = 34, lid = true, hole = true }: { x: number; y: number; w?: number; h?: number; lid?: boolean; hole?: boolean }) {
  const c = '#b8c0c8';
  return (
    <g>
      <OG sh={[
        { d: `M${x - w / 2} ${y - h}V${y - 3}Q${x - w / 2} ${y} ${x - w / 2 + 4} ${y}H${x + w / 2 - 4}Q${x + w / 2} ${y} ${x + w / 2} ${y - 3}V${y - h}Z`, f: c },
        { d: `M${x + w / 4} ${y - h}H${x + w / 2}V${y - 3}Q${x + w / 2} ${y} ${x + w / 2 - 4} ${y}H${x + w / 4}Z`, f: shade(c, 0.12), no: true },
        ...(lid ? [{ d: ell([x, y - h], w / 2 + 2, 7), f: tint(c, 0.15) }, { d: ell([x, y - h - 1], w / 2 - 4, 4.5), f: c, ln: true }] : [{ d: ell([x, y - h], w / 2, 6.5), f: '#5c636b' }]),
      ]} />
      {lid && hole && <circle cx={x + 4} cy={y - h - 1} r={2} fill={K.out} />}
    </g>
  );
}

/** Roket soba kesiti (yerel: x 0..176, y -104..0; taban y=0). Yanma kanalı L biçimli ve her yerde aynı
 *  genişlikte (28 birim ≈ 12 cm): yatay odun ağzı/tünel + dikey iç baca. fill: yalıtım ya da ağır tuğla. */
function RocketBody({ fill, pot, shelf }: { fill: 'light' | 'brick'; pot?: boolean; shelf?: boolean }) {
  const ch = 'M0 -48H112V-104H140V-20H0Z';
  return (
    <g>
      {fill === 'light' ? (
        <g>
          <rect x={0} y={-104} width={176} height={104} fill={M.yalitim} />
          <g fill={shade(M.yalitim, 0.22)}>{Array.from({ length: 46 }, (_, i) => <circle key={i} cx={4 + ((i * 37) % 168)} cy={-100 + ((i * 23) % 96)} r={1.6} />)}</g>
          <rect x={0} y={-104} width={176} height={104} fill="none" stroke={M.sac} stroke-width={5} />
          <rect x={0} y={-104} width={176} height={104} fill="none" stroke={K.out} stroke-width={1.5} />
        </g>
      ) : (
        <Bricks x={0} y={-104} w={176} h={104} />
      )}
      <path d={ch} fill="#2c2524" stroke={M.sac} stroke-width={2.5} />
      <path d={ch} fill="none" stroke={K.out} stroke-width={1} />
      {shelf && (
        <g>
          <rect x={-14} y={-37} width={84} height={4} fill={M.demir} stroke={K.out} stroke-width={1} />
          {[-43, -40].map((y, i) => <OG key={y} sh={[{ d: capsule([-40 + i * 6, y], 3, [64 - i * 4, y], 3), f: '#9b6a43' }]} />)}
          <Flame x={78} y={-36} s={0.36} />
        </g>
      )}
      {pot && (
        <g>
          <OG sh={[{ d: rrect(84, -111, 10, 7, 1), f: M.demir }, { d: rrect(158, -111, 10, 7, 1), f: M.demir }]} />
          <Pot x={126} y={-111} s={2.0} boil={false} />
        </g>
      )}
    </g>
  );
}

/** Kapaklı tencere. x,y = taban ortası */
function LidPot({ x, y, s = 1, steam = true }: { x: number; y: number; s?: number; steam?: boolean }) {
  const c = '#8e99a6';
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: capsule([-29, -24], 3, [-22, -24], 3), f: shade(c, 0.2) },
        { d: capsule([22, -24], 3, [29, -24], 3), f: shade(c, 0.2) },
        { d: 'M-22 -30H22L20 -3Q20 0 17 0H-17Q-20 0 -20 -3Z', f: c },
        { d: 'M10 -30H22L20 -3Q20 0 17 0H8Z', f: shade(c, 0.14), no: true },
        { d: 'M-24 -30Q0 -42 24 -30Z', f: tint(c, 0.1) },
        { d: capsule([0, -40], 3, [0, -37], 3), f: shade(c, 0.3) },
      ]} />
      {steam && <path d="M-26 -32c-4-3 2-6 -2-9M26 -32c4-3 -2-6 2-9" fill="none" stroke="#fff" stroke-width={2 / s} stroke-linecap="round" />}
    </G>
  );
}
/** Düşen su damlası (küçük) */
function Drop0({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y - 6}Q${x + 5} ${y} ${x} ${y + 3}Q${x - 5} ${y} ${x} ${y - 6}Z`} fill={K.waterLight} stroke={K.water} stroke-width={1.2} />;
}

/* ─────────── oyuncular (rehber başına sabit) ─────────── */
const CAST = {
  /** kibritsiz ateş rehberleri (çakmaktaşı, mercek, yay matkabı, kav, köz): esmer, siyah saçlı adam */
  ates: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black, bottomC: K.pants.khaki, sleeve: 'long' },
  /** odun kesme ve yarma: bıyıklı, kahverengi saçlı adam, hardal gömlek */
  odun: { who: 'man', role: 'bystander2', skin: 1, hairC: K.hair.brown, mustache: true, bottomC: K.pants.denim, sleeve: 'long' },
  /** aydınlatma: atkuyruklu kadın, yeşil üst */
  isik: { who: 'woman', role: 'bystander3', skin: 1, hair: 'ponytail', hairC: K.hair.dark, bottomC: K.pants.dark, sleeve: 'long' },
  /** ev içi ısınma, karbonmonoksit: kısa saçlı adam, mavi üst */
  ev: { who: 'man', role: 'victim', skin: 0, hairC: K.hair.dark, bottomC: K.pants.grey, sleeve: 'long' },
  /** fırın, tandır, sac, saman kutu: başörtülü kadın, kiremit üst, uzun etek */
  firin: { who: 'woman', role: 'bystander4', skin: 1, hair: 'scarf', hairC: '#5f7aa8', bottom: 'longskirt', bottomC: '#5b5f78', sleeve: 'long' },
} as const satisfies Record<string, Partial<PersonProps>>;
/** Yakın plan el için: rehberin oyuncusunun teni ve kolluğu */
const HANDS = {
  ates: { skin: 2, sleeve: K.role.helper },
  odun: { skin: 1, sleeve: K.role.bystander2 },
  isik: { skin: 1, sleeve: K.role.bystander3 },
  ev: { skin: 0, sleeve: K.role.victim },
  firin: { skin: 1, sleeve: K.role.bystander4 },
};

/* ════════════════════════ sahneler ════════════════════════ */

export const SCENES: Record<string, () => JSX.Element> = {
  /* ───── kategori kapağı: ateş ve yakıt ───── */
  'sf-ap-kapak-ates': () => (
    <Scene2 bg="outdoor" gy={186} ground="dirt">
      <rect width={320} height={186} fill="#f3c48a" />
      <rect y={120} width={320} height={66} fill="#f6d6a6" />
      <path d="M0 168Q70 140 150 160T320 150V186H0Z" fill="#c7a06c" />
      {/* yarılmış odun istifi */}
      {[[234, 212], [260, 212], [286, 212], [247, 189], [273, 189], [260, 166]].map(([x, y], i) => <LogEnd key={i} x={x} y={y} r={13} />)}
      {/* taş halka ve ateş */}
      <Flame x={118} y={204} s={1.7} />
      <OG sh={[
        { d: capsule([78, 206], 8, [158, 196], 8), f: M.odun },
        { d: capsule([82, 196], 8, [160, 208], 8), f: shade(M.odun, 0.15) },
      ]} />
      {[64, 88, 116, 144, 170].map((x, i) => <Rock key={i} x={x} y={222 - (i % 2) * 2} s={0.85} />)}
      {[[150, 120], [92, 104], [168, 92], [128, 82]].map(([x, y], i) => <Spark key={i} x={x} y={y} r={2.6} />)}
    </Scene2>
  ),

  /* ───── çakmaktaşı ───── */
  'sf-ap-cakmak-malzeme': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(24, 40, 272, 168, 14), f: '#d9cdb4' }]} />
      <Striker x={96} y={92} s={1.5} />
      <OG sh={[{ d: rrect(176, 76, 96, 18, 3), f: '#7b838d' }, { d: 'M184 76V94M192 76V94M200 76V94M208 76V94M216 76V94M224 76V94M232 76V94M240 76V94M248 76V94', st: shade('#7b838d', 0.3), sw: 1.2 }, { d: capsule([272, 85], 3, [290, 85], 2), f: '#7b838d' }]} />
      <Flint x={96} y={164} s={1.4} />
      {charCloth(176, 160, 34, 28, -8)}
      {charCloth(218, 168, 34, 28, 10)}
      {charCloth(258, 158, 30, 26, -4)}
    </Scene2>
  ),

  'sf-ap-cakmak-vurus': () => {
    const hl = handAt({ a: 40, s: 1.2, pose: 'hold', side: 'L', grip: 30, ...HANDS.ates }, 'grip', [120, 176]);
    const hr = handAt({ a: -100, s: 1.05, pose: 'fist', side: 'R', ...HANDS.ates }, 'palm', [250, 92]);
    return (
      <Scene2 bg="closeup">
        <Hand {...hl} arm={200}>
          <Flint x={128} y={150} s={1.9} />
        </Hand>
        {charCloth(116, 118, 34, 14, -12)}
        <circle cx={124} cy={116} r={3.6} fill={K.fireRed} />
        <circle cx={124} cy={116} r={1.7} fill={K.fireCore} />
        {[[160, 110], [148, 98], [170, 96], [138, 104], [178, 116]].map(([x, y], i) => <Spark key={i} x={x} y={y} r={2.6} />)}
        <Hand {...hr} arm={200} />
        <Striker x={214} y={98} s={1.3} a={-90} />
        <Arrow from={[180, 30]} to={[180, 92]} w={6} />
      </Scene2>
    );
  },

  'sf-ap-yuva-ufleme': () => {
    const p: PersonProps = { ...CAST.ates, x: 150, y: 224, s: 1.2, pose: { ...POSE.kneel, spine: -84, head: -86, face: 'neutral', armB: [0, 0], armF: [0, 0] } };
    const r0 = rig(p);
    const nest: P = [r0.mouth[0] + 40, r0.mouth[1] + 10];
    const pp: PersonProps = { ...p, pose: { ...p.pose, armB: { to: [nest[0] - 14, nest[1] + 4] }, armF: { to: [nest[0] + 10, nest[1] + 6] }, handB: 'mitten', handF: 'mitten' } };
    const r = rig(pp);
    return (
      <Scene2 bg="outdoor" gy={196}>
        <Wind x={22} y={90} s={0.9} />
        <Arrow from={[30, 140]} to={[86, 140]} w={5} />
        <Person {...pp} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Nest x={nest[0]} y={nest[1] + 8} s={1.1} smoke flame />
        <Person {...pp} only={['armF']} />
        <Waves x={r.mouth[0] + 6} y={r.mouth[1] + 2} a={14} n={2} r={6} color={K.waterLight} />
      </Scene2>
    );
  },

  /* ───── mercek ───── */
  'sf-ap-mercek-turleri': () => {
    const panel = (x: number, good: boolean) => {
      const cx = x + 66;
      const lens = good
        ? `M${cx} 58Q${cx + 22} 108 ${cx} 158Q${cx - 22} 108 ${cx} 58Z`
        : `M${cx - 12} 58H${cx + 12}Q${cx + 2} 108 ${cx + 12} 158H${cx - 12}Q${cx - 2} 108 ${cx - 12} 58Z`;
      const ys = [74, 108, 142];
      return (
        <g>
          <OG sh={[{ d: rrect(x, 30, 132, 184, 12), f: '#f6f3ec' }]} />
          <g stroke="#f2b31c" stroke-width={3} stroke-linecap="round">
            {ys.map((y) => <line key={y} x1={x + 10} y1={y} x2={cx - 6} y2={y} />)}
            {good
              ? ys.map((y) => <line key={'b' + y} x1={cx + 6} y1={y} x2={x + 116} y2={108} />)
              : ys.map((y) => <line key={'b' + y} x1={cx + 6} y1={y} x2={x + 124} y2={108 + (y - 108) * 1.9} />)}
          </g>
          <OG sh={[{ d: lens, f: '#bfe6f7' }]} />
          {good && <circle cx={x + 116} cy={108} r={5} fill={K.fireCore} stroke={K.fireRed} stroke-width={1.5} />}
          {good ? <Ok x={x + 106} y={190} r={14} /> : <Bad x={x + 106} y={190} r={14} />}
        </g>
      );
    };
    return (
      <Scene2 bg="dark">
        {panel(20, true)}
        {panel(168, false)}
        <Magnifier x={52} y={188} r={13} a={30} />
      </Scene2>
    );
  },

  'sf-ap-mercek-odak': () => {
    const L: P = [140, 92];
    const spot: P = [136, 198];
    const h = handAt({ a: -120, s: 1.0, pose: 'hold', side: 'R', grip: 14, ...HANDS.ates }, 'grip', pol(L, 60, 50));
    return (
      <Scene2 bg="closeup">
        <rect y={198} width={320} height={42} fill={M.toprak} />
        <Sun x={48} y={38} r={18} />
        <path d={`M${L[0] - 30} ${L[1]}L${spot[0]} ${spot[1]}L${L[0] + 30} ${L[1]}Z`} fill="#ffe27a" opacity={0.55} />
        <OG sh={[{ d: ell([136, 206], 56, 12), f: '#8c6a48' }]} />
        {charCloth(136, 200, 46, 12, 0)}
        <Puffs x={142} y={182} n={3} r={5} op={0.7} c="#9aa1a8" />
        <circle cx={spot[0]} cy={spot[1]} r={5} fill="#fff6b0" stroke={K.fireRed} stroke-width={2} />
        <Hand {...h} arm={220}>
          <Magnifier x={L[0]} y={L[1]} r={30} a={60} />
        </Hand>
      </Scene2>
    );
  },

  /* ───── yay matkabı ───── */
  'sf-ap-yay-parcalar': () => (
    <Scene2 bg="closeup">
      {/* yay */}
      <path d="M44 92Q160 22 276 92" fill="none" stroke={K.out} stroke-width={10} stroke-linecap="round" />
      <path d="M44 92Q160 22 276 92" fill="none" stroke={M.odun} stroke-width={6.5} stroke-linecap="round" />
      <line x1={46} y1={92} x2={274} y2={92} stroke="#efe6cf" stroke-width={2.4} />
      <Label x={160} y={92} text="85 cm" size={12} bg={K.white} />
      {/* mil */}
      <OG sh={[{ d: 'M40 140L58 131H170V149H58Z', f: '#d8b27e' }, { d: 'M58 131V149', st: shade('#d8b27e', 0.3), sw: 1 }]} />
      <Dim a={[184, 131]} b={[184, 149]} text="2 cm" off={[26, 0]} />
      {/* baskı parçası */}
      <OG sh={[{ d: rrect(232, 122, 52, 30, 8), f: M.tas }, { d: ell([258, 137], 7, 5), f: shade(M.tas, 0.3), ln: true }]} />
      {/* ocak tahtası */}
      <OG sh={[{ d: rrect(30, 172, 210, 28, 3), f: M.odunIc }, { d: circ([212, 186], 7), f: shade(M.odunIc, 0.3), ln: true }]} />
      <g stroke={shade(M.odunIc, 0.2)} stroke-width={1}><path d="M40 180H190M50 192H200" /></g>
      <Dim a={[30, 214]} b={[240, 214]} text="30 cm" />
      {/* yaprak */}
      <OG sh={[{ d: smooth([[256, 196], [272, 178], [296, 180], [290, 200], [268, 206]], true), f: '#a98a3e' }]} />
    </Scene2>
  ),

  'sf-ap-yay-durus': () => {
    const base: PersonProps = { ...CAST.ates, x: 92, y: 230, s: 1.4, pose: { spine: -64, chest: -56, head: -34, legF: [98, 180], legB: [-10, 90], footB: 0, armB: [60, 60], armF: [80, 80], face: 'neutral' } };
    const r0 = rig(base);
    const sx = r0.ankleB[0] + 18;
    const by = 222;
    const top = 168;
    const hand: P = [r0.kneeB[0] - 22, 196];
    const p: PersonProps = { ...base, pose: { ...base.pose, armB: { to: [sx - 2, top - 10] }, armF: { to: hand }, handB: 'mitten', handF: 'fist' } };
    const bowY = 196;
    const bow = `M${hand[0] - 8} ${bowY}Q${sx} ${bowY + 14} ${sx + 70} ${bowY - 4}`;
    return (
      <Scene2 bg="outdoor" gy={182}>
        <Tree x={292} y={190} s={0.75} kind="pine" />
        <OG sh={[{ d: rrect(r0.ankleB[0] - 34, by, 140, 9, 2), f: M.odunIc }]} />
        <Person {...p} only={['legB', 'armB', 'torso', 'head', 'legF']} />
        <OG sh={[{ d: rrect(sx - 6, top, 12, by - top, 3), f: '#d8b27e' }, { d: rrect(sx - 14, top - 12, 28, 13, 4), f: M.tas }]} />
        <Person {...p} only={['armB']} />
        <path d={bow} fill="none" stroke={K.out} stroke-width={9} stroke-linecap="round" />
        <path d={bow} fill="none" stroke={M.odun} stroke-width={6} stroke-linecap="round" />
        <line x1={hand[0] - 6} y1={bowY - 1} x2={sx + 68} y2={bowY - 5} stroke="#efe6cf" stroke-width={2.2} />
        <ellipse cx={sx} cy={bowY - 3} rx={8} ry={3.2} fill="none" stroke="#efe6cf" stroke-width={2.2} />
        <Person {...p} only={['armF']} />
        <Arrow from={[sx + 54, 174]} to={[sx + 96, 174]} w={5} />
        <Arrow from={[sx + 50, 174]} to={[sx + 16, 174]} w={5} />
        {[[sx - 12, by - 3], [sx + 11, by - 5]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.4} fill="#9aa1a8" opacity={0.85} />)}
      </Scene2>
    );
  },

  'sf-ap-yay-centik': () => {
    const c: P = [178, 128];
    const ey = 172;
    const dx = (ey - c[1]) * Math.tan(22.5 * R);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: ell([c[0], ey + 22], 40, 16), f: '#a98a3e' }]} />
        <OG sh={[{ d: `M18 70H302V${ey}H${c[0] + dx}L${c[0]} ${c[1]}L${c[0] - dx} ${ey}H18Z`, f: M.odunIc }]} />
        <g stroke={shade(M.odunIc, 0.18)} stroke-width={1.2}><path d="M30 86H290M30 104H130M230 104H290M30 150H120M240 150H290" /></g>
        <circle cx={c[0]} cy={c[1]} r={24} fill="#3a2a22" stroke={K.out} stroke-width={1.5} />
        <circle cx={c[0]} cy={c[1]} r={14} fill="#55392b" />
        <path d={`M${c[0]} ${c[1]}L${c[0] + dx} ${ey}H${c[0] - dx}Z`} fill="#a98a3e" stroke={K.action} stroke-width={3.5} stroke-linejoin="round" />
        <path d={`M${c[0]} ${c[1]}L${c[0] + 24 * Math.sin(22.5 * R)} ${c[1] + 24 * Math.cos(22.5 * R)}A24 24 0 0 1 ${c[0] - 24 * Math.sin(22.5 * R)} ${c[1] + 24 * Math.cos(22.5 * R)}Z`} fill={K.action} opacity={0.85} />
        <Label x={252} y={200} text="1/8" size={15} />
      </Scene2>
    );
  },

  /* ───── kav ───── */
  'sf-ap-kav-teneke': () => (
    <Scene2 bg="closeup">
      <Tin x={112} y={206} w={110} h={64} lid={false} />
      {[[-28, -6], [0, -12], [26, -4], [-10, 2]].map(([dx, a], i) => (
        <OG key={i} sh={[{ d: rrect(-18, -14, 36, 28, 2), f: i % 2 ? '#f4efe2' : '#e8e0cc', t: `translate(${112 + dx} ${136 + (i % 2) * 6}) rotate(${a})` }]} />
      ))}
      <OG sh={[{ d: ell([238, 112], 56, 24), f: '#c7ced6' }, { d: ell([238, 110], 46, 17), f: '#b8c0c8', ln: true }]} />
      <circle cx={238} cy={110} r={3.2} fill={K.out} />
      <Rod d="M286 40L262 84" w={3} c="#9aa3ad" />
      <Arrow from={[200, 44]} to={[232, 100]} w={5} />
    </Scene2>
  ),

  'sf-ap-kav-teneke-ates': () => {
    const panel = (x: number, n: number, body: JSX.Element) => {
      const id = nid();
      return (
        <g>
          <clipPath id={id}><rect x={x} y={24} width={140} height={192} rx={10} /></clipPath>
          <rect x={x} y={24} width={140} height={192} rx={10} fill="#f6f3ec" />
          <g clip-path={`url(#${id})`}>{body}</g>
          <rect x={x} y={24} width={140} height={192} rx={10} fill="none" stroke={K.out} stroke-width={1.5} />
          <Label x={x + 20} y={42} text={String(n)} size={13} />
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        {panel(12, 1, (
          <g>
            <rect x={12} y={190} width={140} height={30} fill={M.toprak} />
            <Coals x={82} y={196} w={96} n={10} />
            <Tin x={82} y={184} w={64} h={38} />
            <path d="M86 140c-6-10 6-14 0-24c8 6 10 14 4 24Z" fill={K.fire} stroke={K.fireRed} stroke-width={1} />
            <Puffs x={92} y={106} n={3} r={9} op={0.8} c="#8f969e" />
          </g>
        ))}
        {panel(168, 2, (
          <g>
            <rect x={168} y={190} width={140} height={30} fill={M.toprak} />
            <Coals x={238} y={196} w={96} n={10} />
            <Tin x={238} y={140} w={64} h={38} />
            <Rod d="M300 40L276 104L270 124M300 40L262 98L206 122" w={3.5} c={M.demir} />
            <Arrow from={[188, 150]} to={[188, 104]} w={5} />
          </g>
        ))}
      </Scene2>
    );
  },

  'sf-ap-kav-mantari': () => {
    const hoof = (x: number, y: number, s: number) => (
      <G x={x} y={y} s={s}>
        <OG ow={1.5 / s} sh={[{ d: 'M0 -26Q38 -24 46 6H0Z', f: '#9b948a' }, { d: 'M0 -10Q28 -10 40 -4', st: shade('#9b948a', 0.3), sw: 1.4 }, { d: 'M0 2Q30 0 44 2', st: shade('#9b948a', 0.3), sw: 1.4 }, { d: 'M0 6H46V10H0Z', f: '#c6a57c' }]} />
      </G>
    );
    return (
      <Scene2 bg="outdoor" gy={210}>
        <OG sh={[{ d: 'M30 0H104V240H30Z', f: '#c9c2b4' }]} />
        <g stroke={shade('#c9c2b4', 0.25)} stroke-width={1.6}><path d="M44 20V60M70 40V96M88 10V50M52 120V170M84 150V200M40 200V230" /></g>
        {hoof(104, 92, 1)}
        {hoof(104, 160, 0.8)}
        {/* büyütülmüş kesit */}
        <OG sh={[{ d: circ([224, 120], 78), f: '#f6f3ec' }]} />
        <path d="M150 104L136 96" stroke={K.out} stroke-width={1.5} stroke-dasharray="3 3" />
        <OG sh={[
          { d: 'M160 150Q164 70 236 62Q290 66 296 150Z', f: '#b07a4a' },
          { d: 'M160 150Q164 70 236 62Q290 66 296 150L284 150Q280 82 236 76Q176 82 172 150Z', f: '#7d776f', no: true },
          { d: 'M160 150H296V162H160Z', f: '#d8bf98' },
        ]} />
        <path d="M160 150Q164 70 236 62Q290 66 296 150" fill="none" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M206 112Q230 96 260 112L256 120Q230 106 210 120Z', f: '#c48d58', t: 'translate(0 -48) rotate(-8 232 112)' }]} />
        <OG sh={[{ d: 'M196 98L258 116L262 108Z', f: '#c9d1d9' }, { d: capsule([258, 114], 5, [292, 124], 6), f: '#3d3a45' }]} />
      </Scene2>
    );
  },

  /* ───── köz ───── */
  'sf-ap-koz-kulleme': () => {
    const sh = handAt({ a: -30, s: 0.9, pose: 'fist', side: 'R', ...HANDS.ates }, 'palm', [272, 64]);
    return (
      <Scene2 bg="indoor" wall="#e4d6bf">
        <Stones x={20} y={176} w={280} h={36} />
        <path d="M70 176Q74 118 160 112Q246 118 250 176Z" fill={M.kul} stroke={K.out} stroke-width={1.5} />
        <path d="M100 176Q104 146 160 142Q216 146 220 176Z" fill="#3a3230" />
        <Coals x={160} y={176} w={100} n={11} />
        <Coals x={160} y={164} w={60} n={6} />
        <g fill={shade(M.kul, 0.15)}>{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={84 + ((i * 37) % 150)} cy={128 + ((i * 13) % 30)} r={1.6} />)}</g>
        <Dim a={[160, 112]} b={[160, 142]} text="kül" off={[0, -40]} />
        <Rod d="M214 78L268 58" w={5} c={M.odun} />
        <OG sh={[{ d: 'M214 72L222 90L184 108Q170 100 172 86Z', f: M.sac }, { d: 'M210 80L214 90L186 102Q178 98 178 90Z', f: M.kul, no: true }]} />
        <Hand {...sh} arm={80} />
        <g fill={M.kul}>{[[180, 112], [190, 120], [174, 124]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} />)}</g>
      </Scene2>
    );
  },

  'sf-ap-koz-puro': () => (
    <Scene2 bg="closeup">
      <Puffs x={52} y={110} n={3} r={7} op={0.7} c="#9aa1a8" dx={-6} />
      <OG sh={[{ d: capsule([62, 132], 26, [262, 132], 26), f: '#c9a46a' }]} />
      <g stroke={shade('#c9a46a', 0.3)} stroke-width={1.2} fill="none">
        {[-16, -8, 0, 8, 16].map((d) => <path key={d} d={`M70 ${132 + d}Q120 ${130 + d} 160 ${133 + d}`} />)}
      </g>
      {/* kesit penceresi: içte köz */}
      <OG sh={[{ d: ell([108, 132], 30, 18), f: '#6a4a30' }]} />
      <ellipse cx={108} cy={132} rx={18} ry={10} fill={M.koz} stroke={K.out} stroke-width={1.2} />
      <ellipse cx={104} cy={130} rx={8} ry={4.5} fill={K.fireCore} />
      {/* dıştaki yeşil yaprak */}
      <OG sh={[{ d: 'M168 102Q230 96 282 120Q290 132 282 144Q230 168 168 162Q160 132 168 102Z', f: K.leaf }]} />
      <g stroke={shade(K.leaf, 0.3)} stroke-width={1.4} fill="none"><path d="M172 132H280M200 132L216 112M200 132L216 152M236 132L250 116M236 132L250 148" /></g>
      {[188, 252].map((x) => <Rod key={x} d={`M${x} 102Q${x + 6} 132 ${x} 164`} w={3} c="#d9c9a0" />)}
    </Scene2>
  ),

  'sf-ap-koz-kap': () => {
    const clay = M.kil;
    const top: P = [160, 44];
    const h = handAt({ a: 180, s: 1.0, pose: 'fist', side: 'R', ...HANDS.ates }, 'palm', [top[0] + 4, top[1] - 4]);
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={80} />
        <Rod d={`M104 112Q100 ${top[1]} ${top[0]} ${top[1]}Q220 ${top[1]} 216 112`} w={3} c={M.demir} />
        {/* çömlek kesiti */}
        <OG sh={[
          { d: 'M98 112Q84 150 100 196Q112 214 160 214Q208 214 220 196Q236 150 222 112Z', f: clay },
          { d: 'M110 120Q100 152 112 190Q122 204 160 204Q198 204 208 190Q220 152 210 120Z', f: '#5a4436' },
        ]} />
        <path d="M112 190Q122 204 160 204Q198 204 208 190L210 176H110Z" fill={M.kul} />
        <Coals x={160} y={180} w={60} n={6} />
        <OG sh={[{ d: 'M92 112H228V104Q160 92 92 104Z', f: shade(clay, 0.1) }, { d: capsule([160, 96], 6, [160, 92], 6), f: clay }]} />
        {[120, 144, 176, 200].map((x) => <circle key={x} cx={x} cy={106} r={2.6} fill={K.out} />)}
        {[[100, 150], [220, 150]].map(([x, y], i) => <circle key={i} cx={x + (i ? -5 : 5)} cy={y} r={2.8} fill={K.out} />)}
        <Flow pts={[[56, 150], [92, 150]]} c={AIR} w={4} />
        <Flow pts={[[264, 150], [228, 150]]} c={AIR} w={4} />
      </Scene2>
    );
  },

  /* ───── odun seçimi ───── */
  'sf-ap-odun-agir-hafif': () => {
    const tilt = -12; // ağır meşe kefesi aşağıda
    const L = pol([160, 70], 180 + tilt, 100), Rr = pol([160, 70], tilt, 100);
    const pan = (p: P, oak: boolean) => (
      <g>
        <g stroke={K.ink} stroke-width={1.6}><line x1={p[0]} y1={p[1]} x2={p[0] - 34} y2={p[1] + 58} /><line x1={p[0]} y1={p[1]} x2={p[0] + 34} y2={p[1] + 58} /></g>
        <OG sh={[{ d: `M${p[0] - 44} ${p[1] + 58}H${p[0] + 44}Q${p[0] + 40} ${p[1] + 72} ${p[0]} ${p[1] + 72}Q${p[0] - 40} ${p[1] + 72} ${p[0] - 44} ${p[1] + 58}Z`, f: M.sac }]} />
        <OG sh={[{ d: capsule([p[0] - 26, p[1] + 44], 13, [p[0] + 26, p[1] + 44], 13), f: oak ? '#6e4a30' : '#b9a58a' }, { d: ell([p[0] - 26, p[1] + 44], 7, 13), f: oak ? '#b98a56' : '#efe2c4', ln: true }]} />
        <Flame x={p[0]} y={p[1] + 22} s={oak ? 0.7 : 0.32} />
        <text x={p[0]} y={p[1] + 96} text-anchor="middle" font-size={16} font-weight={700} fill={K.ink}>{oak ? 'meşe' : 'kavak'}</text>
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M154 70H166V214H154Z', f: '#7b6a58' }, { d: rrect(124, 210, 72, 10, 3), f: '#7b6a58' }, { d: capsule(L, 4, Rr, 4), f: '#8d7b67' }, { d: circ([160, 70], 7), f: K.metal }]} />
        {pan(L, true)}
        {pan(Rr, false)}
      </Scene2>
    );
  },

  'sf-ap-odun-kivilcim': () => (
    <Scene2 bg="indoor" gy={206}>
      <Stones x={64} y={52} w={192} h={154} r={11} />
      <path d="M100 206V122Q100 96 126 96H194Q220 96 220 122V206Z" fill="#2c2524" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: capsule([118, 196], 8, [200, 190], 8), f: '#9b6a43' }, { d: capsule([120, 186], 8, [200, 198], 8), f: '#8a5a36' }]} />
      <Flame x={160} y={190} s={1.15} />
      {[[136, 150], [186, 140], [204, 162], [120, 166], [172, 124]].map(([x, y], i) => <Spark key={i} x={x} y={y} r={2.6} />)}
      {/* tel siper */}
      <g>
        <rect x={84} y={142} width={152} height={66} rx={4} fill="#9aa3ad" opacity={0.35} stroke={K.out} stroke-width={2} />
        <g stroke="#6c747d" stroke-width={1}>
          {Array.from({ length: 18 }, (_, i) => <line key={i} x1={92 + i * 8} y1={144} x2={92 + i * 8} y2={206} />)}
          {Array.from({ length: 8 }, (_, i) => <line key={'h' + i} x1={86} y1={150 + i * 8} x2={234} y2={150 + i * 8} />)}
        </g>
        <rect x={84} y={142} width={152} height={66} rx={4} fill="none" stroke={K.out} stroke-width={3} />
        {[[204, 160], [116, 172]].map(([x, y], i) => <Spark key={i} x={x} y={y} r={2.2} />)}
      </g>
      <Ok x={266} y={140} r={15} />
    </Scene2>
  ),

  /* ───── odun kurutma ───── */
  'sf-ap-odun-yarma': () => {
    const c: P = [232, 112], rr = 46, g = 6;
    const q = (a0: number) => {
      const o = pol(c, a0 + 45, g);
      const p1 = pol(o, a0, rr), p2 = pol(o, a0 + 90, rr);
      const i1 = pol(o, a0, rr * 0.82), i2 = pol(o, a0 + 90, rr * 0.82);
      return (
        <g key={a0}>
          <OG sh={[{ d: `M${o[0]} ${o[1]}L${p1[0]} ${p1[1]}A${rr} ${rr} 0 0 1 ${p2[0]} ${p2[1]}Z`, f: M.odun }, { d: `M${o[0]} ${o[1]}L${i1[0]} ${i1[1]}A${rr * 0.82} ${rr * 0.82} 0 0 1 ${i2[0]} ${i2[1]}Z`, f: M.odunIc, no: true }]} />
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        <LogEnd x={88} y={112} r={rr} />
        <Bad x={124} y={168} r={15} />
        {[0, 90, 180, 270].map(q)}
        <Ok x={268} y={168} r={15} />
        <Dim a={[c[0] + g, 196]} b={[c[0] + g + rr, 196]} text="10 cm" off={[0, 18]} />
      </Scene2>
    );
  },

  'sf-ap-odun-balta-durus': () => {
    // Vuruş anı: iki kol düz uzanmış, balta sapı yere paralel, ağız kütükte.
    const block = 178;
    const base: PersonProps = { ...CAST.odun, x: 100, y: 224, s: 1.12, pose: { spine: -66, chest: -58, head: -28, legB: [100, 96], legF: [74, 92], footB: 0, footF: 0, armB: [58, 58], armF: [55, 55], handB: 'fist', handF: 'fist', face: 'neutral' } };
    const r0 = rig(base);
    const grip: P = r0.handF;
    const hit: P = [grip[0] + 62, grip[1]];
    const logTop = grip[1] + 6;
    return (
      <Scene2 bg="outdoor" gy={196}>
        <Tree x={30} y={198} s={0.8} kind="pine" />
        <OG sh={[{ d: `M${hit[0] - 34} 222V${block}H${hit[0] + 34}V222Z`, f: M.odun }, { d: ell([hit[0], block], 34, 7), f: M.odunIc }]} />
        <OG sh={[{ d: rrect(hit[0] - 18, logTop, 36, block - logTop - 2, 3), f: M.odun }, { d: ell([hit[0], logTop], 18, 5), f: M.odunIc }]} />
        <Person {...base} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Rod d={`M${grip[0] - 12} ${grip[1]}L${hit[0] - 6} ${hit[1]}`} w={5} c="#c9a06a" />
        <OG sh={[{ d: `M${hit[0] - 12} ${hit[1] - 9}H${hit[0] + 5}L${hit[0] + 3} ${logTop + 12}H${hit[0] - 3}L${hit[0] - 12} ${hit[1] + 4}Z`, f: M.demir }]} />
        <Person {...base} only={['armF']} />
        <path d={`M${hit[0]} ${logTop + 12}V${block}`} stroke={K.out} stroke-width={1.5} />
        <Arrow from={[hit[0] - 6, 60]} to={[hit[0] + 14, hit[1] - 22]} bend={-0.3} w={5} />
      </Scene2>
    );
  },

  'sf-ap-odun-istif-ortu': () => (
    <Scene2 bg="outdoor" gy={200}>
      <g stroke={K.water} stroke-width={2} stroke-linecap="round" opacity={0.8}>
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={20 + i * 22} y1={14 + (i % 3) * 10} x2={12 + i * 22} y2={34 + (i % 3) * 10} />)}
      </g>
      <OG sh={[{ d: rrect(40, 206, 240, 9, 2), f: M.ahsap }, { d: rrect(40, 218, 240, 9, 2), f: shade(M.ahsap, 0.12) }]} />
      {Array.from({ length: 5 }, (_, row) => Array.from({ length: 9 }, (_, col) => <LogEnd key={row + '-' + col} x={62 + col * 24.5 + (row % 2) * 4} y={194 - row * 22} r={11.5} />))}
      <OG sh={[{ d: 'M26 92L294 80L296 90L28 102Z', f: '#9aa6b2' }]} />
      <g stroke={shade('#9aa6b2', 0.3)} stroke-width={1.2}>{Array.from({ length: 14 }, (_, i) => <line key={i} x1={40 + i * 18} y1={100 - i * 0.8} x2={40 + i * 18} y2={91 - i * 0.8} />)}</g>
      <Rock x={96} y={92} s={0.4} />
      <Rock x={230} y={86} s={0.4} />
      {[30, 292].map((x, i) => <path key={i} d={`M${x} ${i ? 94 : 106}v10`} stroke={K.water} stroke-width={2.5} stroke-linecap="round" />)}
      <Flow pts={[[6, 150], [34, 150]]} c="#fff" w={4} />
      <Flow pts={[[286, 150], [314, 150]]} c="#fff" w={4} />
    </Scene2>
  ),

  /* ───── odun kömürü ───── */
  'sf-ap-komur-cukur-izgara': () => (
    <Scene2 bg="outdoor" gy={84}>
      <Soil x={0} y={84} w={320} h={156} />
      <rect y={84} width={320} height={6} fill={K.grass} />
      <path d="M40 84L54 210H266L280 84Z" fill="#5d4532" stroke={K.out} stroke-width={1.5} />
      {[78, 118, 158, 198, 238].map((x) => <LogEnd key={x} x={x} y={198} r={10} />)}
      {[184, 166, 148, 130].map((y, i) => <Log key={y} a={[64 + i * 2, y]} b={[256 - i * 2, y]} r={8.5} />)}
      <Flow pts={[[62, 210], [258, 210]]} w={4} />
      <Dim a={[298, 84]} b={[298, 210]} text="1,2 m" off={[-6, 0]} />
    </Scene2>
  ),

  'sf-ap-komur-ortu-katman': () => (
    <Scene2 bg="outdoor" gy={120}>
      <Soil x={0} y={120} w={320} h={120} />
      <rect y={120} width={320} height={5} fill={K.grass} />
      <path d="M44 120L54 214H246L256 120Z" fill="#5d4532" stroke={K.out} stroke-width={1.5} />
      {[200, 184, 168, 152, 136].map((y, i) => <Log key={y} a={[60 + i, y]} b={[240 - i, y]} r={8} />)}
      {/* yaprak katı */}
      <path d="M40 124Q150 86 260 124L262 124Q150 108 38 124Z" fill="none" />
      <path d="M48 126Q150 92 252 126Q150 112 48 126Z" fill="#7d9a42" />
      <path d="M44 124Q150 98 256 124V126Q150 98 44 126Z" fill="none" />
      <path d="M44 124C70 108 230 108 256 124L256 124C230 100 70 100 44 124Z" fill="none" />
      <path d="M48 126C76 100 224 100 252 126L262 120C232 82 68 82 38 120Z" fill="#7d9a42" stroke={K.out} stroke-width={1.5} />
      <path d="M38 120C68 82 232 82 262 120L270 116C238 62 62 62 30 116Z" fill={M.toprak} stroke={K.out} stroke-width={1.5} />
      {/* ağız ve duman deliği */}
      <ellipse cx={40} cy={126} rx={9} ry={8} fill="#2c2524" stroke={K.out} stroke-width={1.5} />
      <Flame x={40} y={132} s={0.32} />
      <rect x={232} y={68} width={12} height={22} fill="#2c2524" stroke={K.out} stroke-width={1.2} transform="rotate(30 238 80)" />
      <Puffs x={252} y={52} n={3} r={9} c="#eef0f2" op={0.95} />
      <Dim a={[150, 67]} b={[150, 85]} text="20 cm" off={[-34, 0]} />
      <Dim a={[166, 86]} b={[166, 104]} text="20 cm" off={[36, 0]} />
    </Scene2>
  ),

  'sf-ap-komur-duman-renk': () => {
    const panel = (x: number, k: number) => {
      const id = nid();
      const cx = x + 46;
      return (
        <g>
          <clipPath id={id}><rect x={x} y={20} width={92} height={196} rx={10} /></clipPath>
          <rect x={x} y={20} width={92} height={196} rx={10} fill={K.sky} />
          <g clip-path={`url(#${id})`}>
            <path d={`M${x - 10} 216Q${cx} 150 ${x + 102} 216Z`} fill={M.toprak} stroke={K.out} stroke-width={1.5} />
            <rect x={cx - 6} y={160} width={12} height={10} fill="#2c2524" />
            {k === 0 && <Puffs x={cx} y={146} n={4} r={11} c="#f4f5f6" op={1} dx={2} dy={-24} />}
            {k === 1 && <Puffs x={cx} y={146} n={4} r={8} c="#8fa6cf" op={0.75} dx={2} dy={-24} />}
            {k === 2 && <g><Puffs x={cx} y={140} n={2} r={6} c="#dfe7ef" op={0.35} dx={2} dy={-24} /><OG sh={[{ d: ell([cx, 160], 15, 8), f: M.tas }]} /><Ok x={cx + 26} y={46} r={12} /></g>}
          </g>
          <rect x={x} y={20} width={92} height={196} rx={10} fill="none" stroke={K.out} stroke-width={1.5} />
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        {panel(12, 0)}
        {panel(114, 1)}
        {panel(216, 2)}
        <Arrow from={[98, 120]} to={[124, 120]} w={4} />
        <Arrow from={[200, 120]} to={[226, 120]} w={4} />
      </Scene2>
    );
  },

  /* ───── aydınlatma ───── */
  'sf-ap-kandil-fitil': () => {
    const lamp = (x: number, long: boolean) => {
      const tip: P = long ? [x + 70, 124] : [x + 62, 140];
      return (
        <g>
          <OG sh={[{ d: `M${x - 50} 150Q${x - 46} 196 ${x} 196Q${x + 40} 196 ${x + 52} 160L${x + 70} 146L${x + 62} 140L${x + 46} 150Z`, f: M.kil }]} />
          <path d={`M${x - 44} 158Q${x - 38} 186 ${x} 186Q${x + 34} 186 ${x + 44} 158Z`} fill="#c9a83c" stroke={K.out} stroke-width={1.2} />
          <path d={`M${x - 30} 172Q${x + 20} 168 ${x + 50} 154L${tip[0]} ${tip[1]}`} fill="none" stroke={K.out} stroke-width={5.5} stroke-linecap="round" />
          <path d={`M${x - 30} 172Q${x + 20} 168 ${x + 50} 154L${tip[0]} ${tip[1]}`} fill="none" stroke="#f3ead2" stroke-width={3} stroke-linecap="round" />
          <Flame x={tip[0] + 1} y={tip[1] + 3} s={long ? 1.15 : 0.5} />
          {long && <Puffs x={tip[0] + 4} y={tip[1] - 64} n={3} r={10} c="#2f2c2c" op={0.85} />}
          {long ? <Bad x={x - 30} y={110} r={15} /> : <Ok x={x - 30} y={110} r={15} />}
        </g>
      );
    };
    return (
      <Scene2 bg="dark">
        {lamp(70, true)}
        {lamp(222, false)}
      </Scene2>
    );
  },

  'sf-ap-mesale': () => {
    const base: PersonProps = { ...CAST.isik, x: 128, y: 226, s: 1.0, pose: { ...POSE.walk, face: 'neutral' } };
    const r0 = rig(base);
    const hand: P = [r0.shoulderF[0] + 40, r0.shoulderF[1] - 34];
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: hand }, handF: 'fist' } };
    const top: P = [hand[0] + 16, hand[1] - 44];
    return (
      <Scene2 bg="night" gy={196}>
        <path d="M0 230Q160 200 320 214V240H0Z" fill="#4a5a50" />
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Rod d={`M${hand[0] - 4} ${hand[1] + 14}L${top[0]} ${top[1]}`} w={5} c={M.odun} />
        <OG sh={[{ d: capsule([top[0] - 1, top[1] + 8], 6, [top[0] + 1, top[1] - 6], 6), f: '#7a5236' }]} />
        <Flame x={top[0]} y={top[1] - 2} s={0.8} />
        <Person {...p} only={['armF']} />
      </Scene2>
    );
  },

  'sf-ap-isik-mesafe': () => (
    <Scene2 bg="indoor" gy={200}>
      <Window x={22} y={46} w={64} h={70} view="night" />
      <OG sh={[{ d: 'M14 38H98V44H14Z', f: M.ahsap }, { d: 'M18 44H44Q40 120 46 190H18Z', f: '#c86f5c' }, { d: 'M70 44H96V190H66Q74 120 70 44Z', f: '#c86f5c' }]} />
      <OG sh={[{ d: rrect(146, 150, 60, 12, 3), f: M.tas }, { d: 'M156 162H196V212H156Z', f: M.tasD }]} />
      <OG sh={[{ d: 'M158 150Q160 136 176 136Q192 136 194 150Z', f: M.kil }, { d: 'M192 142L202 138L200 146Z', f: M.kil }]} />
      <Flame x={201} y={140} s={0.4} />
      <Dim a={[98, 120]} b={[176, 120]} text="90 cm" off={[0, -16]} />
    </Scene2>
  ),


  /* ───── kategori kapağı: ocak, baca ve ısınma ───── */
  'sf-ap-kapak-ocak': () => (
    <Scene2 bg="indoor" gy={196} wall={M.kerpic}>
      <OG sh={[{ d: 'M136 0H184V64H136Z', f: M.tas }]} />
      <Stones x={84} y={64} w={152} h={132} r={10} />
      <path d="M112 196V132Q112 110 134 110H186Q208 110 208 132V196Z" fill="#2c2524" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: capsule([126, 188], 7, [194, 184], 7), f: '#9b6a43' }]} />
      <Flame x={160} y={188} s={1.05} />
      <OG sh={[{ d: rrect(66, 196, 188, 12, 2), f: M.tasD }]} />
    </Scene2>
  ),

  /* ───── ocak yeri ───── */
  'sf-ap-ocak-mesafe': () => {
    const panel = (x: number, shield: boolean) => {
      const id = nid();
      const ox = shield ? x + 72 : x + 84;
      return (
        <g>
          <clipPath id={id}><rect x={x} y={14} width={146} height={210} rx={10} /></clipPath>
          <g clip-path={`url(#${id})`}>
            <rect x={x} y={14} width={146} height={210} fill={K.wall} />
            <rect x={x} y={196} width={146} height={28} fill={M.tas} />
            {/* ahşap duvar */}
            <rect x={x} y={14} width={22} height={182} fill={M.ahsap} stroke={K.out} stroke-width={1.5} />
            <g stroke={shade(M.ahsap, 0.25)} stroke-width={1}>{[40, 80, 120, 160].map((y) => <line key={y} x1={x} y1={y} x2={x + 22} y2={y} />)}</g>
            {shield && <g><rect x={x + 34} y={70} width={6} height={126} fill={M.sac} stroke={K.out} stroke-width={1.5} />{[90, 130, 170].map((y) => <rect key={y} x={x + 22} y={y} width={12} height={4} fill={M.demir} />)}</g>}
            {/* ocak */}
            <OG sh={[{ d: rrect(ox, 150, 52, 46, 3), f: M.tasD }, { d: rrect(ox + 8, 160, 36, 30, 3), f: '#2c2524', ln: true }]} />
            <Flame x={ox + 26} y={190} s={0.48} />
          </g>
          <rect x={x} y={14} width={146} height={210} rx={10} fill="none" stroke={K.out} stroke-width={1.5} />
          <Dim a={[x + 22, 136]} b={[ox, 136]} text={shield ? '30 cm' : '90 cm'} off={[0, -16]} />
          {shield ? <Ok x={x + 124} y={40} r={12} /> : null}
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        {panel(10, false)}
        {panel(164, true)}
      </Scene2>
    );
  },

  'sf-ap-ocak-taban': () => (
    <Scene2 bg="indoor" gy={206}>
      {/* ahşap döşeme */}
      <rect x={0} y={206} width={320} height={34} fill={M.ahsap} />
      <g stroke={shade(M.ahsap, 0.25)} stroke-width={1}>{[60, 140, 220, 300].map((x) => <line key={x} x1={x} y1={206} x2={x} y2={240} />)}</g>
      {/* boşluklu tuğla katı */}
      <OG sh={[{ d: rrect(36, 180, 248, 26, 1), f: M.tugla }]} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={46 + i * 27} y={187} width={14} height={12} rx={2} fill="#3a2a24" />)}
      {/* taş/sac üst kat */}
      <OG sh={[{ d: rrect(36, 168, 248, 12, 1), f: M.tas }]} />
      {/* ocak */}
      <OG sh={[{ d: rrect(112, 104, 96, 64, 3), f: M.tasD }, { d: rrect(126, 118, 68, 50, 3), f: '#2c2524', ln: true }]} />
      <Flame x={160} y={164} s={0.75} />
      <Dim a={[36, 156]} b={[112, 156]} text="45 cm" off={[0, -14]} />
      <Dim a={[208, 156]} b={[284, 156]} text="45 cm" off={[0, -14]} />
      <Flow pts={[[4, 193], [30, 193]]} c={AIR} w={3.5} />
    </Scene2>
  ),

  'sf-ap-ocak-orgu': () => (
    <Scene2 bg="indoor" gy={200} wall={M.kerpic}>
      <OG sh={[{ d: 'M136 0H184V44H136Z', f: M.tas }, { d: 'M96 44H224L196 84H124Z', f: M.tasD }]} />
      <Stones x={60} y={120} w={44} h={80} />
      <Stones x={216} y={120} w={44} h={80} />
      <Stones x={104} y={120} w={112} h={20} />
      <path d="M104 200V140H216V200Z" fill="#3a302c" stroke={K.out} stroke-width={1.5} />
      <Stones x={104} y={140} w={112} h={14} />
      <OG sh={[{ d: capsule([120, 192], 7, [200, 188], 7), f: '#9b6a43' }]} />
      <Flame x={160} y={192} s={0.8} />
      <OG sh={[{ d: rrect(48, 200, 224, 10, 2), f: M.tas }]} />
      <Puffs x={164} y={110} n={2} r={7} c="#8f969e" op={0.8} dy={-12} />
      <Flow pts={[[160, 150], [160, 112], [160, 70], [160, 20]]} w={5} />
    </Scene2>
  ),

  /* ───── baca ───── */
  'sf-ap-baca-yukseklik': () => {
    const ridge: P = [214, 104];
    const slope = 0.4;
    const roofY = (x: number) => ridge[1] + Math.abs(ridge[0] - x) * slope;
    const cx = 94; // bacanın sırta yatay uzaklığı ≈ 3 m
    const top = ridge[1] - 26;
    return (
      <Scene2 bg="outdoor" gy={226}>
        <OG sh={[{ d: `M44 226V${roofY(44)}L${ridge[0]} ${ridge[1]}L330 ${roofY(330)}V226Z`, f: M.kerpic }]} />
        <OG sh={[{ d: rrect(196, 180, 34, 46, 2), f: '#8a5a36' }, { d: rrect(90, 170, 40, 30, 2), f: '#bfe3f5' }]} />
        <OG sh={[{ d: `M${cx - 14} ${roofY(cx - 14) + 4}V${top}H${cx + 14}V${roofY(cx + 14) + 4}Z`, f: M.tugla }, { d: rrect(cx - 17, top - 6, 34, 7, 1), f: shade(M.tugla, 0.15) }]} />
        <OG sh={[{ d: `M24 ${roofY(24)}L${ridge[0]} ${ridge[1]}L340 ${roofY(340)}V${roofY(340) + 10}L${ridge[0]} ${ridge[1] + 10}L24 ${roofY(24) + 10}Z`, f: '#c2583e' }]} />
        <OG sh={[{ d: `M${cx - 14} ${roofY(cx - 14) + 2}V${top}H${cx + 14}V${roofY(cx + 14) + 2}Z`, f: M.tugla }, { d: rrect(cx - 17, top - 6, 34, 7, 1), f: shade(M.tugla, 0.15) }]} />
        <line x1={cx + 20} y1={ridge[1]} x2={ridge[0]} y2={ridge[1]} stroke={K.ink} stroke-width={1.4} stroke-dasharray="4 3" />
        <Dim a={[cx - 28, roofY(cx - 28) - 4]} b={[cx - 28, top - 6]} text="90 cm" off={[-22, 0]} />
        <Dim a={[cx + 34, ridge[1]]} b={[cx + 34, top - 6]} text="60 cm" off={[30, -4]} />
        <Dim a={[cx, 40]} b={[ridge[0], 40]} text="3 m" />
      </Scene2>
    );
  },

  'sf-ap-baca-yuksuk': () => {
    const py = 132;
    return (
      <Scene2 bg="indoor" gy={210}>
        {/* ahşap tavan */}
        <rect x={0} y={0} width={320} height={22} fill={M.ahsap} stroke={K.out} stroke-width={1.5} />
        {/* ahşap duvar (kesit) */}
        <rect x={196} y={22} width={28} height={188} fill={M.ahsap} stroke={K.out} stroke-width={1.5} />
        <g stroke={shade(M.ahsap, 0.25)} stroke-width={1}>{[40, 60, 200].map((y) => <line key={y} x1={196} y1={y} x2={224} y2={y} />)}</g>
        <Bricks x={196} y={py - 58} w={28} h={116} bw={14} bh={9} />
        <OG sh={[{ d: rrect(192, py - 18, 36, 36, 3), f: M.kil }]} />
        {/* soba ve boru */}
        <OG sh={[{ d: rrect(40, 140, 76, 70, 4), f: M.demir }, { d: rrect(52, 158, 40, 34, 3), f: '#2c2524', ln: true }]} />
        <Flame x={72} y={190} s={0.45} />
        <OG sh={[{ d: `M68 140V${py - 10}H260V${py + 10}H88V140Z`, f: M.sac }]} />
        <OG sh={[{ d: rrect(256, 22, 40, 188, 2), f: M.tugla }]} />
        <Bricks x={256} y={22} w={40} h={188} bw={16} bh={9} />
        <Dim a={[210, py + 18]} b={[210, py + 58]} text="30 cm" off={[-46, 0]} />
        <Dim a={[120, py - 10]} b={[120, 22]} text="45 cm" off={[0, 0]} />
      </Scene2>
    );
  },

  'sf-ap-baca-kapan': () => {
    const mesh = (x: number, y: number, w: number, h: number, g: number) => (
      <g>
        <rect x={x} y={y} width={w} height={h} fill="#dfe4ea" opacity={0.5} />
        <g stroke="#6c747d" stroke-width={1.1}>
          {Array.from({ length: Math.floor(w / g) + 1 }, (_, i) => <line key={i} x1={x + i * g} y1={y} x2={x + i * g} y2={y + h} />)}
          {Array.from({ length: Math.floor(h / g) + 1 }, (_, i) => <line key={'h' + i} x1={x} y1={y + i * g} x2={x + w} y2={y + i * g} />)}
        </g>
        <rect x={x} y={y} width={w} height={h} fill="none" stroke={K.out} stroke-width={2} />
      </g>
    );
    return (
      <Scene2 bg="outdoor" gy={240}>
        <Bricks x={56} y={150} w={96} h={90} bw={20} bh={10} />
        <OG sh={[{ d: rrect(50, 142, 108, 10, 2), f: M.tasD }]} />
        {mesh(66, 96, 76, 46, 7)}
        <OG sh={[{ d: 'M48 96L104 66L160 96Z', f: M.sac }]} />
        {[[86, 116], [118, 110], [100, 128]].map(([x, y], i) => <Spark key={i} x={x} y={y} r={2.4} />)}
        {/* büyütme */}
        <line x1={142} y1={110} x2={196} y2={92} stroke={K.out} stroke-width={1.5} stroke-dasharray="3 3" />
        <OG sh={[{ d: circ([248, 110], 62), f: '#f4f6f8' }]} />
        <g clip-path="none">{mesh(206, 74, 84, 72, 24)}</g>
        <Dim a={[206, 160]} b={[230, 160]} text="10–12 mm" off={[22, 16]} />
      </Scene2>
    );
  },

  /* ───── yangın güvenliği ───── */
  'sf-ap-yangin-baca-cati': () => (
    <Scene2 bg="outdoor" gy={212}>
      <OG sh={[{ d: 'M48 212V160H272V212Z', f: M.kerpic }, { d: rrect(138, 176, 40, 36, 2), f: '#8a5a36' }]} />
      <OG sh={[{ d: 'M24 168L160 96L296 168L284 174L160 108L36 174Z', f: '#d6b45a' }, { d: 'M36 174L160 108L284 174Z', f: '#c9a54c' }]} />
      <g stroke={shade('#d6b45a', 0.35)} stroke-width={1.2}>{Array.from({ length: 11 }, (_, i) => <line key={i} x1={60 + i * 20} y1={170} x2={160 + (i - 5) * 6} y2={112} />)}</g>
      <OG sh={[{ d: 'M206 160V46H234V160Z', f: M.tugla }]} />
      <rect x={200} y={20} width={40} height={26} fill="#dfe4ea" opacity={0.5} />
      <g stroke="#6c747d" stroke-width={1}>{[207, 214, 221, 228, 235].map((x) => <line key={x} x1={x} y1={20} x2={x} y2={46} />)}<line x1={200} y1={29} x2={240} y2={29} /><line x1={200} y1={37} x2={240} y2={37} /></g>
      <rect x={200} y={20} width={40} height={26} fill="none" stroke={K.out} stroke-width={2} />
      <OG sh={[{ d: 'M194 20L220 6L246 20Z', f: M.sac }]} />
      {[[210, 32], [228, 38]].map(([x, y], i) => <Spark key={i} x={x} y={y} r={2.2} />)}
      <line x1={160} y1={96} x2={200} y2={96} stroke={K.ink} stroke-width={1.4} stroke-dasharray="4 3" />
      <Ok x={274} y={44} r={14} />
    </Scene2>
  ),

  'sf-ap-yangin-bos-alan': () => {
    const c: P = [150, 120];
    const rr = 74;
    return (
      <Scene2 bg="floor">
        <circle cx={c[0]} cy={c[1]} r={rr} fill="#e9dcc4" opacity={0.6} stroke={K.action} stroke-width={3} stroke-dasharray="8 6" />
        <OG sh={[{ d: circ(c, 26), f: M.tas }, { d: circ(c, 16), f: '#2c2524', ln: true }]} />
        <Flame x={c[0]} y={c[1] + 8} s={0.5} />
        <Dim a={c} b={[c[0] + rr, c[1]]} text="90 cm" at={0.62} off={[0, 16]} />
        {/* yatak */}
        <OG sh={[{ d: rrect(244, 20, 66, 110, 6), f: '#f4f1ea' }, { d: rrect(244, 52, 66, 78, 4), f: '#7aa6d6' }, { d: rrect(254, 26, 46, 18, 6), f: '#fff' }]} />
        {/* odun */}
        {[[30, 196], [50, 196], [40, 180]].map(([x, y], i) => <LogEnd key={i} x={x} y={y} r={10} />)}
        {/* kilim */}
        <OG sh={[{ d: rrect(178, 196, 118, 36, 3), f: '#b9534a' }, { d: rrect(186, 202, 102, 24, 2), f: '#d9a13a', ln: true }]} />
      </Scene2>
    );
  },

  'sf-ap-yangin-kul-kova': () => {
    const bucket = (x: number, y: number, c: string, lid: boolean) => (
      <OG sh={[
        { d: `M${x - 24} ${y - 50}L${x - 19} ${y}H${x + 19}L${x + 24} ${y - 50}Z`, f: c },
        { d: `M${x + 6} ${y - 50}H${x + 24}L${x + 19} ${y}H${x + 6}Z`, f: shade(c, 0.12), no: true },
        ...(lid ? [{ d: rrect(x - 28, y - 58, 56, 9, 3), f: shade(c, 0.08) }, { d: capsule([x - 6, y - 61], 3, [x + 6, y - 61], 3), f: M.demir }] : [{ d: ell([x, y - 50], 24, 5), f: shade(c, 0.3) }]),
      ]} />
    );
    return (
      <Scene2 bg="outdoor" gy={170}>
        <OG sh={[{ d: 'M-10 170V96H58V170Z', f: M.kerpic }, { d: 'M-16 100L26 66L66 100Z', f: '#c2583e' }]} />
        <OG sh={[{ d: ell([140, 206], 54, 14), f: M.toprak }]} />
        {bucket(140, 208, '#9aa3ad', true)}
        <path d="M128 140c-4-6 4-8 0-14M148 136c-4-6 4-8 0-14" fill="none" stroke="#c9ced4" stroke-width={2.4} stroke-linecap="round" />
        <Ok x={176} y={150} r={13} />
        {/* yanlışlar */}
        <OG sh={[{ d: 'M228 222V188H270V222Z', f: '#c99a62' }, { d: 'M228 188L240 180H282L270 188Z', f: '#d9ad75' }, { d: 'M270 188L282 180V214L270 222Z', f: '#b5864f' }]} />
        {bucket(292, 224, '#4f8fd6', false)}
        <No x={266} y={192} r={34} />
      </Scene2>
    );
  },

  /* ───── karbonmonoksit ───── */
  'sf-ap-co-bacasiz-yasak': () => {
    const haze = (x: number, w: number) => <rect x={x} y={20} width={w} height={150} fill="#9aa1a8" opacity={0.28} />;
    return (
      <Scene2 bg="closeup">
        {/* oda */}
        <OG sh={[{ d: rrect(10, 20, 146, 200, 10), f: K.wall }]} />
        <rect x={10} y={180} width={146} height={40} fill={K.floor} />
        <Window x={26} y={46} w={44} h={44} />
        <Door x={104} y={182} w={40} h={90} />
        <OG sh={[{ d: 'M54 180L62 152H110L118 180Z', f: '#7a6a5a' }, { d: ell([86, 152], 28, 6), f: '#4a3a32' }]} />
        <Coals x={86} y={154} w={44} n={6} />
        {haze(10, 146)}
        <Bad x={136} y={40} r={14} />
        {/* çadır */}
        <OG sh={[{ d: rrect(164, 20, 146, 200, 10), f: '#2f3b52' }]} />
        <rect x={164} y={180} width={146} height={40} fill="#3f4a3f" />
        <OG sh={[{ d: 'M178 196L237 70L296 196Z', f: '#e0813c' }, { d: 'M237 70L296 196H260Z', f: shade('#e0813c', 0.15), no: true }]} />
        <Flame x={237} y={190} s={0.7} />
        <rect x={180} y={80} width={114} height={110} fill="#9aa1a8" opacity={0.3} />
        <Bad x={290} y={40} r={14} />
      </Scene2>
    );
  },

  'sf-ap-co-uyku-yasak': () => {
    const sl: PersonProps = { ...CAST.ev, x: 162, y: 172, s: 0.95, pose: { ...POSE.lieBack, face: 'closed' }, shadow: false };
    return (
      <Scene2 bg="indoor" gy={198}>
        <Window x={140} y={40} w={60} h={50} view="night" />
        <OG sh={[{ d: rrect(96, 150, 10, 66, 2), f: K.wood }, { d: rrect(286, 170, 8, 46, 2), f: K.wood }, { d: rrect(100, 182, 190, 16, 2), f: shade(K.wood, 0.15) }, { d: rrect(104, 168, 184, 16, 4), f: '#f4f1ea' }, { d: rrect(108, 156, 34, 14, 6), f: '#fff' }]} />
        <Person {...sl} />
        <OG sh={[{ d: 'M150 172Q150 150 162 150H284V186H150Z', f: '#7aa6d6' }]} />
        {/* soba */}
        <OG sh={[{ d: rrect(24, 140, 56, 74, 4), f: M.demir }, { d: rrect(34, 156, 36, 30, 3), f: '#2c2524', ln: true }, { d: rrect(44, 0, 14, 140, 1), f: M.sac }]} />
        <Flame x={52} y={184} s={0.5} />
        <No x={52} y={168} r={36} />
      </Scene2>
    );
  },

  'sf-ap-co-kotu-cekis': () => {
    const mark = (x: number, y: number, r = 18) => <circle cx={x} cy={y} r={r} fill="none" stroke={K.action} stroke-width={3.5} />;
    return (
      <Scene2 bg="indoor" gy={206}>
        <Stones x={40} y={60} w={150} h={146} r={10} />
        <path d="M66 206V128Q66 108 86 108H144Q164 108 164 128V206Z" fill="#2c2524" stroke={K.out} stroke-width={1.5} />
        <path d="M70 108Q90 70 115 86Q140 66 160 108Z" fill="#2c2524" opacity={0.65} />
        <OG sh={[{ d: capsule([80, 198], 6, [150, 196], 6), f: '#8a5a36' }]} />
        <G x={115} y={198} s={0.85}>
          <path d="M0 0C-14 0-18-10-12-20C-9-26-3-26-4-34C4-28 8-22 6-14C9-16 10-19 10-22C15-15 14-6 9-2C6 0 3 0 0 0Z" fill="#f2c23a" stroke="#c9952a" stroke-width={1.2} />
        </G>
        <Puffs x={150} y={110} n={4} r={12} c="#8a9097" op={0.85} dx={14} dy={-12} />
        <rect x={0} y={0} width={320} height={44} fill="#8a9097" opacity={0.55} />
        <Window x={226} y={70} w={64} h={60} />
        <rect x={231} y={75} width={54} height={50} fill="#eef2f5" opacity={0.75} />
        {mark(115, 84, 20)}
        {mark(115, 178, 18)}
        {mark(258, 100, 24)}
        {mark(184, 88, 18)}
      </Scene2>
    );
  },


  /* ───── şömine ───── */
  'sf-ap-somine-kesit': () => (
    <Scene2 bg="indoor" gy={206} wall={M.kerpic}>
      <Bricks x={118} y={0} w={44} h={70} />
      <Bricks x={54} y={66} w={172} h={140} />
      <path d="M84 206V128H196V206Z" fill="#2c2524" stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: capsule([100, 198], 6, [180, 196], 6), f: '#8a5a36' }]} />
      <Flame x={140} y={198} s={0.75} />
      <rect x={84} y={128} width={112} height={78} fill={K.action} opacity={0.35} />
      <rect x={84} y={128} width={112} height={78} fill="none" stroke={K.action} stroke-width={3} />
      <line x1={162} y1={30} x2={226} y2={56} stroke={K.out} stroke-width={1.5} stroke-dasharray="3 3" />
      <OG sh={[{ d: circ([262, 70], 44), f: '#f6f3ec' }]} />
      <OG sh={[{ d: rrect(232, 40, 60, 60, 2), f: M.tugla }]} />
      <rect x={247} y={55} width={30} height={30} fill={K.action} opacity={0.55} stroke={K.action} stroke-width={3} />
      <Label x={262} y={134} text="1/10" size={15} />
    </Scene2>
  ),

  'sf-ap-somine-rumford': () => {
    const fx = 160, fy = 92;
    return (
      <Scene2 bg="floor">
        <rect x={0} y={0} width={320} height={112} fill="#d8cdb9" />
        <Bricks x={40} y={20} w={240} h={92} c={M.tugla} />
        <path d="M86 112L132 60H188L234 112Z" fill="#3a302c" stroke={K.out} stroke-width={2} />
        <path d="M132 60H188" stroke={M.atesTugla} stroke-width={5} />
        <path d="M86 112L132 60M234 112L188 60" stroke={M.atesTugla} stroke-width={5} />
        <Flame x={fx} y={fy + 10} s={0.55} />
        <Flow pts={[[fx - 12, fy - 4], [112, 84], [70, 168]]} w={4} />
        <Flow pts={[[fx + 12, fy - 4], [208, 84], [250, 168]]} w={4} />
        <Flow pts={[[fx, fy + 14], [fx, 176]]} w={4} />
        <Dim a={[268, 60]} b={[268, 112]} text="≥30 cm" off={[0, 0]} />
        <line x1={190} y1={60} x2={274} y2={60} stroke={K.ink} stroke-width={1.2} stroke-dasharray="3 3" />
      </Scene2>
    );
  },

  'sf-ap-somine-ocaktasi': () => (
    // Üstten plan: arkada şömine duvarı ve ocak ağzı, önünde ahşap döşemeyi koruyan taş uzantı.
    <Scene2 bg="floor">
      <Bricks x={0} y={0} w={320} h={76} />
      <OG sh={[{ d: 'M112 76L122 30H198L208 76Z', f: '#3a302c' }]} />
      <Coals x={160} y={64} w={50} n={7} />
      <Stones x={72} y={76} w={176} h={80} c={M.tas} r={10} />
      <rect x={72} y={76} width={176} height={80} fill="none" stroke={K.out} stroke-width={2} />
      <line x1={112} y1={76} x2={112} y2={190} stroke={K.ink} stroke-width={1.3} stroke-dasharray="4 3" />
      <line x1={72} y1={156} x2={72} y2={190} stroke={K.ink} stroke-width={1.3} stroke-dasharray="4 3" />
      <Dim a={[160, 78]} b={[160, 154]} text="40 cm" />
      <Dim a={[72, 182]} b={[112, 182]} text="20 cm" off={[0, 20]} />
    </Scene2>
  ),

  /* ───── roket soba ───── */
  'sf-ap-roket-kesit': () => (
    <Scene2 bg="outdoor" gy={214} ground="dirt">
      <G x={50} y={214} s={1.15}>
        <RocketBody fill="light" pot shelf />
        <Flow pts={[[-34, -27], [2, -27]]} c={AIR} w={4} />
        <Flow pts={[[76, -34], [126, -34], [126, -98]]} w={4.5} />
        <Flow pts={[[118, -110], [72, -110], [72, -150]]} w={3.5} />
        <Flow pts={[[134, -110], [180, -110], [180, -150]]} w={3.5} />
        <Dim a={[112, -80]} b={[140, -80]} text="12 cm" off={[-40, 0]} />
        <Dim a={[198, -20]} b={[198, -104]} text="30–36 cm" off={[-6, 0]} />
      </G>
    </Scene2>
  ),

  'sf-ap-roket-yalitim': () => {
    const panel = (x: number, good: boolean) => {
      const id = nid();
      return (
        <g>
          <clipPath id={id}><rect x={x} y={20} width={146} height={200} rx={10} /></clipPath>
          <rect x={x} y={20} width={146} height={200} rx={10} fill="#f6f3ec" />
          <g clip-path={`url(#${id})`}>
            <G x={x + 14} y={196} s={0.66}><RocketBody fill={good ? 'light' : 'brick'} /></G>
            <Flame x={x + 46} y={176} s={0.32} />
          </g>
          <rect x={x} y={20} width={146} height={200} rx={10} fill="none" stroke={K.out} stroke-width={1.5} />
          {good ? <Ok x={x + 120} y={46} r={14} /> : <Bad x={x + 120} y={46} r={14} />}
        </g>
      );
    };
    return (
      <Scene2 bg="closeup">
        {panel(10, true)}
        {panel(164, false)}
      </Scene2>
    );
  },

  'sf-ap-roket-tencere-bosluk': () => {
    const cx = 160, w = 64, top = 150, gap = 16;
    const pb = top - gap;
    return (
      <Scene2 bg="closeup">
        {/* gövde ve yalıtım */}
        <rect x={20} y={top} width={280} height={100} fill={M.yalitim} stroke={K.out} stroke-width={1.5} />
        <g fill={shade(M.yalitim, 0.2)}>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={28 + ((i * 47) % 264)} cy={top + 8 + ((i * 23) % 80)} r={1.6} />)}</g>
        <rect x={cx - w / 2} y={top - 1} width={w} height={102} fill="#3a302c" stroke={M.sac} stroke-width={3} />
        {/* destekler */}
        <OG sh={[{ d: rrect(54, pb, 14, gap, 1), f: M.demir }, { d: rrect(252, pb, 14, gap, 1), f: M.demir }]} />
        {/* tencere ve etek */}
        <OG sh={[{ d: `M40 ${pb}V${pb - 84}H280V${pb}Z`, f: '#8e99a6' }, { d: `M40 ${pb - 84}H280V${pb - 74}H40Z`, f: shade('#8e99a6', 0.15) }]} />
        <rect x={28} y={pb - 70} width={6} height={70 + gap} fill={M.sac} stroke={K.out} stroke-width={1.5} />
        <rect x={286} y={pb - 70} width={6} height={70 + gap} fill={M.sac} stroke={K.out} stroke-width={1.5} />
        <Flow pts={[[cx, 236], [cx, pb + 6]]} w={5} />
        <Flow pts={[[cx - 12, pb + 8], [80, pb + 8], [37, pb + 8], [37, pb - 72]]} w={3} />
        <Flow pts={[[cx + 12, pb + 8], [240, pb + 8], [283, pb + 8], [283, pb - 72]]} w={3} />
        <Dim a={[cx + w / 2 + 22, top]} b={[cx + w / 2 + 22, pb]} text="3 cm" off={[30, 14]} />
      </Scene2>
    );
  },

  /* ───── kütle soba ───── */
  'sf-ap-kutle-genel': () => (
    <Scene2 bg="indoor" gy={206}>
      <OG sh={[{ d: rrect(150, 0, 20, 44, 1), f: M.sac }]} />
      <OG sh={[{ d: 'M84 206V64Q84 44 104 44H216Q236 44 236 64V206Z', f: '#ecdcc0' }, { d: 'M210 44Q236 44 236 64V206H210Z', f: shade('#ecdcc0', 0.08), no: true }]} />
      <OG sh={[{ d: rrect(138, 156, 44, 36, 4), f: M.demir }, { d: circ([174, 174], 3), f: K.metal, ln: true }]} />
      <Label x={160} y={110} text="≥800 kg" size={15} bg={K.white} />
      {[0, 1, 2].map((i) => (
        <g key={i} fill="none" stroke={K.action} stroke-width={3} stroke-linecap="round">
          <path d={`M${62 - i * 16} ${80 + i * 10}q-6 10 0 20t0 20t0 20t0 20`} />
          <path d={`M${258 + i * 16} ${80 + i * 10}q-6 10 0 20t0 20t0 20t0 20`} />
        </g>
      ))}
    </Scene2>
  ),

  'sf-ap-kutle-kanal': () => {
    const D = '#3a302c';
    return (
      <Scene2 bg="indoor" gy={210}>
        <Bricks x={60} y={20} w={190} h={190} c={'#c7a17a'} bw={20} bh={10} />
        <rect x={110} y={140} width={64} height={60} fill={D} stroke={K.out} stroke-width={1.5} />
        <rect x={126} y={44} width={32} height={98} fill={D} />
        <rect x={84} y={30} width={150} height={18} fill={D} stroke={K.out} stroke-width={1.2} />
        <rect x={200} y={46} width={30} height={150} fill={D} />
        <rect x={228} y={176} width={30} height={20} fill={D} />
        <OG sh={[{ d: rrect(258, 0, 22, 196, 1), f: M.sac }]} />
        <OG sh={[{ d: capsule([122, 194], 6, [162, 192], 6), f: '#8a5a36' }]} />
        <Flame x={142} y={194} s={0.6} />
        <Flow pts={[[142, 150], [142, 40], [214, 40], [214, 186], [268, 186], [268, 14]]} w={5} />
        <Label x={176} y={96} text="180°" size={13} />
      </Scene2>
    );
  },

  'sf-ap-kutle-surgu': () => {
    const knob: P = [232, 64];
    const h = handAt({ a: -110, s: 0.8, pose: 'pinch', side: 'R', ...HANDS.ev }, 'pinch', [knob[0] + 5, knob[1]]);
    return (
      <Scene2 bg="indoor" gy={214}>
        <OG sh={[{ d: 'M30 214V100H250V214Z', f: '#ecdcc0' }]} />
        <OG sh={[{ d: rrect(196, 0, 30, 100, 1), f: M.sac }]} />
        <Rod d={`M211 64H${knob[0]}`} w={4} c={M.demir} />
        <circle cx={knob[0] + 4} cy={knob[1]} r={6} fill={M.demir} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(80, 136, 110, 70, 6), f: '#2c2524' }, { d: 'M80 136L50 128V214L80 206Z', f: M.demir }]} />
        <Coals x={135} y={200} w={86} n={9} />
        {[[112, 186], [150, 182], [128, 180]].map(([x, y], i) => <path key={i} d={`M${x} ${y}c-5-2-6-8-2-14c1 5 4 6 4 3c3 4 3 9-2 11Z`} fill="#5aa9ff" stroke="#2f6fbf" stroke-width={1} />)}
        <Hand {...h} arm={200} />
        <No x={236} y={64} r={36} />
      </Scene2>
    );
  },

  /* ───── roket kütle ısıtıcı ───── */
  'sf-ap-rmh-j-oran': () => {
    const D = '#3a302c';
    return (
      <Scene2 bg="indoor" gy={214}>
        <rect x={30} y={120} width={176} height={94} fill={M.kerpic} stroke={K.out} stroke-width={1.5} />
        <rect x={126} y={44} width={58} height={128} fill={M.yalitim} stroke={K.out} stroke-width={1.5} />
        <g fill={shade(M.yalitim, 0.2)}>{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={130 + ((i * 17) % 50)} cy={50 + ((i * 29) % 116)} r={1.5} />)}</g>
        <path d="M58 120V200H170V44H142V172H86V120Z" fill={D} stroke={K.out} stroke-width={1.5} />
        {[64, 72, 80].map((x, i) => <OG key={x} sh={[{ d: capsule([x, 96 - i * 6], 3.5, [x, 168], 3.5), f: '#9b6a43' }]} />)}
        <Flame x={74} y={170} s={0.4} />
        <Flow pts={[[48, 92], [48, 150]]} c={AIR} w={4} />
        <Flow pts={[[96, 188], [156, 188], [156, 60]]} w={4.5} />
        <line x1={50} y1={120} x2={250} y2={120} stroke={K.ink} stroke-width={1.3} stroke-dasharray="4 3" />
        <line x1={186} y1={44} x2={250} y2={44} stroke={K.ink} stroke-width={1.3} stroke-dasharray="4 3" />
        <Arrow from={[240, 116]} to={[240, 50]} w={4} />
      </Scene2>
    );
  },

  'sf-ap-rmh-varil': () => {
    const D = '#3a302c';
    return (
      <Scene2 bg="indoor" gy={214}>
        <rect x={20} y={176} width={280} height={38} fill={M.kerpic} stroke={K.out} stroke-width={1.5} />
        {/* varil (ters) */}
        <path d="M92 176V60Q92 46 106 46H214Q228 46 228 60V176" fill={D} stroke={K.out} stroke-width={1.5} />
        <path d="M92 176V60Q92 46 106 46H214Q228 46 228 60V176" fill="none" stroke={M.demir} stroke-width={6} />
        <path d="M92 176V60Q92 46 106 46H214Q228 46 228 60V176" fill="none" stroke={K.out} stroke-width={1.2} />
        {/* yükseltici ve yalıtım */}
        <rect x={130} y={76} width={60} height={100} fill={M.yalitim} stroke={K.out} stroke-width={1.5} />
        <rect x={146} y={76} width={28} height={100} fill="#2c2524" stroke={M.sac} stroke-width={2} />
        <rect x={228} y={156} width={72} height={20} fill={D} stroke={K.out} stroke-width={1.2} />
        <Flow pts={[[160, 170], [160, 62]]} w={4.5} />
        <Flow pts={[[146, 58], [112, 58], [112, 160]]} w={3.5} />
        <Flow pts={[[174, 58], [210, 58], [210, 166], [292, 166]]} w={3.5} />
      </Scene2>
    );
  },

  'sf-ap-rmh-sedir': () => {
    const D = '#3a302c';
    const cap = (x: number, y: number) => <OG sh={[{ d: rrect(x - 7, y - 7, 14, 14, 3), f: K.action }]} />;
    const pipe = 'M80 196H252V160H306V0';
    return (
      <Scene2 bg="indoor" gy={214}>
        <rect x={296} y={0} width={24} height={240} fill={K.sky} />
        <rect x={276} y={0} width={20} height={214} fill="#cdbf9f" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M18 214V96Q18 86 28 86H70Q80 86 80 96V214Z', f: M.demir }]} />
        <OG sh={[{ d: 'M80 214V146Q80 136 90 136H270V214Z', f: M.kerpic }, { d: 'M88 136H270V126Q180 118 88 126Z', f: '#c86f5c' }]} />
        <path d={pipe} fill="none" stroke={K.out} stroke-width={18} stroke-linejoin="round" />
        <path d={pipe} fill="none" stroke={D} stroke-width={14} stroke-linejoin="round" />
        {cap(252, 196)}
        {cap(252, 160)}
        <Flow pts={[[94, 196], [236, 196]]} w={4} />
        <Flow pts={[[264, 160], [306, 160], [306, 20]]} w={4} />
      </Scene2>
    );
  },

  /* ───── yer ısıtma ───── */
  'sf-ap-ondol-genel': () => {
    const D = '#3a302c';
    return (
      <Scene2 bg="outdoor" gy={214}>
        <OG sh={[{ d: 'M10 214V100H270V214Z', f: M.kerpic }, { d: 'M0 104L140 50L280 104Z', f: '#c2583e' }]} />
        <rect x={20} y={108} width={60} height={106} fill={K.wall} stroke={K.out} stroke-width={1.2} />
        <rect x={86} y={108} width={176} height={70} fill={K.wall} stroke={K.out} stroke-width={1.2} />
        {/* ocak (alçakta) */}
        <OG sh={[{ d: rrect(30, 184, 50, 30, 2), f: M.tasD }]} />
        <rect x={40} y={192} width={38} height={22} fill={D} />
        <Flame x={56} y={212} s={0.4} />
        {/* kanallar ve plakalar */}
        <rect x={80} y={190} width={182} height={24} fill={D} />
        {[110, 150, 190, 230].map((x) => <rect key={x} x={x} y={192} width={12} height={22} fill={M.kerpic} stroke={K.out} stroke-width={1} />)}
        <OG sh={[{ d: rrect(80, 178, 182, 12, 1), f: M.tas }]} />
        {/* baca */}
        <OG sh={[{ d: 'M270 214V24H292V214Z', f: M.tugla }]} />
        <rect x={262} y={194} width={10} height={16} fill={D} />
        <Flow pts={[[70, 202], [176, 202], [282, 202], [282, 36]]} w={4} />
      </Scene2>
    );
  },

  'sf-ap-ondol-kanal': () => {
    const D = '#3a302c';
    return (
      <Scene2 bg="dark">
        <rect x={56} y={30} width={210} height={180} fill={D} stroke={M.kerpic} stroke-width={10} />
        {[66, 106, 146].map((y) => Array.from({ length: 5 }, (_, i) => <rect key={y + '-' + i} x={92 + i * 34} y={y + 26} width={22} height={12} rx={2} fill={M.kerpic} stroke={K.out} stroke-width={1} />))}
        <OG sh={[{ d: rrect(14, 104, 42, 32, 3), f: M.tasD }]} />
        <Flame x={36} y={132} s={0.42} />
        <OG sh={[{ d: rrect(264, 106, 34, 28, 3), f: M.tugla }]} />
        <Flow pts={[[60, 120], [100, 56], [250, 56], [276, 112]]} round w={3.5} />
        <Flow pts={[[62, 120], [250, 120], [266, 120]]} w={3.5} />
        <Flow pts={[[60, 120], [100, 184], [250, 184], [276, 128]]} round w={3.5} />
      </Scene2>
    );
  },

  'sf-ap-ondol-sizinti': () => (
    <Scene2 bg="indoor" gy={150}>
      <rect x={0} y={150} width={320} height={90} fill="#d9c49c" />
      <rect x={0} y={150} width={320} height={4} fill={shade('#d9c49c', 0.2)} />
      <path d="M90 214L104 200L98 190L116 178L110 168L126 160" fill="none" stroke={K.out} stroke-width={2.4} stroke-linejoin="round" />
      <Puffs x={110} y={150} n={3} r={9} c="#8f969e" op={0.75} dx={4} dy={-20} />
      <circle cx={108} cy={186} r={36} fill="none" stroke={K.action} stroke-width={4} />
      <Window x={210} y={40} w={70} h={64} />
      <OG sh={[{ d: 'M280 45L306 36V112L280 104Z', f: '#bfe3f5' }]} />
      <Flow pts={[[300, 140], [250, 140]]} c={AIR} w={4} />
    </Scene2>
  ),


  /* ───── kategori kapağı: fırın ve pişirme ───── */
  'sf-ap-kapak-firin': () => (
    <Scene2 bg="outdoor" gy={200} ground="dirt">
      <OG sh={[{ d: 'M20 40L300 24L304 36L22 52Z', f: '#c2583e' }, { d: rrect(34, 50, 10, 160, 2), f: M.ahsap }, { d: rrect(280, 34, 10, 176, 2), f: M.ahsap }]} />
      <Stones x={70} y={150} w={170} h={62} />
      <OG sh={[{ d: 'M78 150Q78 66 155 66Q232 66 232 150Z', f: M.kil }, { d: 'M196 150V124Q196 110 210 110Q224 110 224 124V150Z', f: '#2c2524' }]} />
      <path d="M100 120Q110 88 140 80" fill="none" stroke={tint(M.kil, 0.3)} stroke-width={4} stroke-linecap="round" />
      <Rod d="M214 136L300 112" w={5} c={M.ahsap} />
      <OG sh={[{ d: 'M194 140L226 130L230 142L198 152Z', f: M.ahsap }, { d: ell([212, 132], 16, 8), f: '#d9a35a' }]} />
    </Scene2>
  ),

  /* ───── kubbe fırın 1 ───── */
  'sf-ap-firin-kaide': () => (
    <Scene2 bg="outdoor" gy={214} ground="dirt">
      <path d="M70 128Q70 40 160 40Q250 40 250 128" fill="none" stroke={K.ink} stroke-width={2} stroke-dasharray="6 5" opacity={0.6} />
      <Stones x={50} y={152} w={220} h={62} />
      <OG sh={[{ d: rrect(50, 138, 220, 14, 1), f: M.yalitim }]} />
      <g fill={shade(M.yalitim, 0.25)}>{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={56 + i * 9} cy={145 + (i % 2) * 2} r={1.7} />)}</g>
      <Bricks x={64} y={126} w={192} h={12} c={M.atesTugla} bw={24} bh={12} />
    </Scene2>
  ),

  'sf-ap-firin-kum-kalip': () => {
    const h = handAt({ a: -60, s: 1.0, pose: 'press', side: 'R', ...HANDS.firin }, 'palm', [214, 92]);
    return (
      <Scene2 bg="outdoor" gy={214} ground="dirt">
        <Stones x={40} y={160} w={240} h={54} />
        <Bricks x={52} y={148} w={216} h={12} c={M.atesTugla} bw={24} bh={12} />
        <OG sh={[{ d: 'M80 148Q80 58 160 58Q240 58 240 148Z', f: '#c9a464' }]} />
        <g fill={shade('#c9a464', 0.2)}>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={96 + ((i * 41) % 128)} cy={80 + ((i * 17) % 62)} r={1.3} />)}</g>
        {[[110, 96, -30], [140, 74, -10], [176, 76, 12], [104, 128, -60], [206, 108, 40]].map(([x, y, a], i) => (
          <OG key={i} sh={[{ d: rrect(-15, -11, 30, 22, 2), f: '#f4f1ea', t: `translate(${x} ${y}) rotate(${a})` }]} />
        ))}
        <OG sh={[{ d: rrect(-15, -11, 30, 22, 2), f: '#f4f1ea', t: 'translate(214 92) rotate(30)' }]} />
        <Hand {...h} arm={200} />
      </Scene2>
    );
  },

  'sf-ap-firin-kapi-oran': () => (
    <Scene2 bg="outdoor" gy={214} ground="dirt">
      <Stones x={40} y={170} w={240} h={44} />
      <OG sh={[{ d: 'M54 170Q54 40 160 40Q266 40 266 170Z', f: M.kil }]} />
      <path d="M72 170Q72 60 160 60Q248 60 248 170" fill="none" stroke={K.ink} stroke-width={2} stroke-dasharray="6 5" />
      <path d="M126 170V132Q126 106 160 106Q194 106 194 132V170Z" fill="#2c2524" stroke={K.out} stroke-width={1.5} />
      <Dim a={[92, 170]} b={[92, 60]} text="100%" off={[-2, 0]} />
      <Dim a={[214, 170]} b={[214, 106]} text="%63" off={[22, 0]} />
      <line x1={92} y1={60} x2={160} y2={60} stroke={K.ink} stroke-width={1.2} stroke-dasharray="3 3" />
      <line x1={194} y1={106} x2={214} y2={106} stroke={K.ink} stroke-width={1.2} stroke-dasharray="3 3" />
    </Scene2>
  ),

  /* ───── kubbe fırın 2 ───── */
  'sf-ap-firin-beyaz-kubbe': () => {
    const half = (x: number, white: boolean) => (
      <g>
        <OG sh={[{ d: `M${x} 190Q${x} 70 ${x + 70} 70Q${x + 140} 70 ${x + 140} 190Z`, f: M.kil }, { d: `M${x + 14} 190Q${x + 14} 86 ${x + 70} 86Q${x + 126} 86 ${x + 126} 190Z`, f: white ? '#f1ece2' : '#2a2524' }]} />
        {!white && <Puffs x={x + 70} y={130} n={2} r={14} c="#4a4744" op={0.8} dy={-18} />}
        <Coals x={x + 70} y={190} w={70} n={8} />
        <Flame x={x + 70} y={186} s={white ? 0.8 : 0.6} />
        <Stones x={x - 6} y={190} w={152} h={30} />
        {white && <Ok x={x + 124} y={70} r={14} />}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {half(14, false)}
        <Arrow from={[156, 140]} to={[172, 140]} w={5} />
        {half(168, true)}
      </Scene2>
    );
  },

  'sf-ap-firin-un-testi': () => (
    <Scene2 bg="closeup">
      <path d="M0 0H320V90Q160 30 0 90Z" fill="#2a2524" />
      <Bricks x={0} y={88} w={320} h={152} c={M.atesTugla} bw={40} bh={20} />
      <OG sh={[{ d: ell([92, 160], 40, 16), f: '#2a2220' }]} />
      <Puffs x={92} y={130} n={3} r={8} c="#6a6a6a" op={0.75} />
      <OG sh={[{ d: ell([228, 160], 40, 16), f: '#e2b55a' }, { d: ell([228, 158], 24, 8), f: '#f0d08a', no: true }]} />
      <Bad x={92} y={206} r={15} />
      <Ok x={228} y={206} r={15} />
    </Scene2>
  ),

  'sf-ap-firin-ekmek-surme': () => {
    const floorY = 142;
    const p0: PersonProps = { ...CAST.firin, x: 70, y: 226, s: 1.08, pose: { ...POSE.standSide, face: 'neutral' } };
    const r0 = rig(p0);
    const hB: P = [r0.shoulderF[0] + 22, floorY - 6];
    const hF: P = [r0.shoulderF[0] + 46, floorY - 8];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armB: { to: hB }, armF: { to: hF }, handB: 'fist', handF: 'fist' } };
    return (
      <Scene2 bg="outdoor" gy={200} ground="dirt">
        <Stones x={176} y={floorY} w={150} h={84} />
        <OG sh={[{ d: `M178 ${floorY}Q178 48 260 48Q342 48 342 ${floorY}Z`, f: M.kil }, { d: `M194 ${floorY}V110Q194 66 260 66Q326 66 326 ${floorY}Z`, f: '#4a3a32' }]} />
        <path d={`M178 ${floorY}V112H194V${floorY}Z`} fill="#4a3a32" />
        <OG sh={[{ d: rrect(150, 150, 22, 50, 3), f: M.ahsap }, { d: capsule([161, 146], 4, [161, 150], 4), f: M.demir }]} />
        <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Rod d={`M${hB[0] - 4} ${floorY - 6}L262 ${floorY - 4}`} w={5} c={M.ahsap} />
        <OG sh={[{ d: `M238 ${floorY - 1}L290 ${floorY - 1}L288 ${floorY - 6}L240 ${floorY - 6}Z`, f: M.ahsap }, { d: ell([268, floorY - 14], 20, 9), f: '#e8c98c' }]} />
        <Person {...p} only={['armF']} />
      </Scene2>
    );
  },

  /* ───── tandır ───── */
  'sf-ap-tandir-halka': () => {
    const h = handAt({ a: 150, s: 1.0, pose: 'press', side: 'R', ...HANDS.firin }, 'palm', [212, 64]);
    return (
      <Scene2 bg="outdoor" gy={210} ground="dirt">
        <OG sh={[{ d: 'M90 210Q70 150 104 96Q120 72 130 62H190Q200 72 216 96Q250 150 230 210Z', f: M.kil }]} />
        <g fill="none" stroke={shade(M.kil, 0.3)} stroke-width={1.6}>
          {[180, 156, 132, 108, 84].map((y, i) => <path key={y} d={`M${86 + i * 6 + (y < 120 ? 10 : 0)} ${y}Q160 ${y + 8} ${234 - i * 6 - (y < 120 ? 10 : 0)} ${y}`} />)}
        </g>
        <OG sh={[{ d: capsule([132, 60], 7, [188, 60], 7), f: tint(M.kil, 0.15) }]} />
        <path d="M110 196Q110 184 122 184Q134 184 134 196Z" fill="#2c2524" stroke={K.out} stroke-width={1.5} />
        <Hand {...h} arm={160} />
        <Arrow from={[246, 70]} to={[200, 62]} w={4} />
      </Scene2>
    );
  },

  'sf-ap-tandir-gomme': () => (
    <Scene2 bg="outdoor" gy={96} ground="dirt">
      <Soil x={0} y={96} w={320} h={144} />
      <path d="M56 236Q40 170 80 110Q92 96 98 96H222Q228 96 240 110Q280 170 264 236Z" fill="#c9a87a" stroke={K.out} stroke-width={1.5} />
      <g fill={M.saman} opacity={0.8}>{Array.from({ length: 30 }, (_, i) => <rect key={i} x={64 + ((i * 37) % 190)} y={110 + ((i * 29) % 120)} width={6} height={1.6} transform={`rotate(${(i * 40) % 180} ${64 + ((i * 37) % 190)} ${110 + ((i * 29) % 120)})`} />)}</g>
      <path d="M88 236Q74 176 112 116Q122 102 128 98H192Q198 102 208 116Q246 176 232 236Z" fill={M.kil} stroke={K.out} stroke-width={1.5} />
      <path d="M102 236Q90 180 124 122Q134 112 138 110H182Q186 112 196 122Q230 180 218 236Z" fill="#3a302c" />
      <Coals x={160} y={236} w={90} n={10} />
      <rect x={124} y={92} width={72} height={8} fill="#3a302c" stroke={K.out} stroke-width={1.2} />
    </Scene2>
  ),

  'sf-ap-tandir-ekmek': () => {
    // Kesit: gömülü tandır; ağızdan giren el hamuru iç duvara düz bastırıyor.
    const target: P = [204, 176];
    const h = handAt({ a: 156, s: 0.8, pose: 'press', side: 'R', ...HANDS.firin }, 'palm', target);
    return (
      <Scene2 bg="outdoor" gy={96} ground="dirt">
        <Soil x={0} y={96} w={320} h={144} />
        <path d="M88 240Q74 176 112 116Q122 102 128 98H192Q198 102 208 116Q246 176 232 240Z" fill={M.kil} stroke={K.out} stroke-width={1.5} />
        <path d="M102 240Q90 180 124 122Q134 112 138 110H182Q186 112 196 122Q230 180 218 240Z" fill="#3a302c" />
        <Coals x={160} y={240} w={90} n={10} />
        <Flame x={160} y={236} s={0.42} />
        <OG sh={[{ d: ell([110, 168], 9, 22), f: '#e8c98c', t: 'rotate(18 110 168)' }, { d: ell([116, 204], 8, 18), f: '#e8c98c', t: 'rotate(12 116 204)' }]} />
        <OG sh={[{ d: ell([212, 180], 11, 30), f: '#e8c98c', t: 'rotate(-22 212 180)' }]} />
        <Hand {...h} arm={220} />
        <Arrow from={[150, 196]} to={[186, 188]} w={5} />
      </Scene2>
    );
  },

  /* ───── toprak fırın ───── */
  'sf-ap-toprakfirin-cukur': () => (
    <Scene2 bg="outdoor" gy={100}>
      <Soil x={0} y={100} w={320} h={140} />
      <rect y={100} width={320} height={5} fill={K.grass} />
      <path d="M70 100Q74 180 160 182Q246 180 250 100Z" fill="#6a4e38" stroke={K.out} stroke-width={1.5} />
      <Dim a={[268, 100]} b={[268, 182]} text="30–45 cm" off={[-8, 0]} />
      <Dim a={[70, 70]} b={[250, 70]} text="0,5–1 m" />
    </Scene2>
  ),

  'sf-ap-toprakfirin-katman': () => (
    <Scene2 bg="outdoor" gy={80}>
      <Soil x={0} y={80} w={320} h={160} />
      <rect y={80} width={320} height={5} fill={K.grass} />
      <path d="M40 80Q44 214 160 216Q276 214 280 80Z" fill="#6a4e38" stroke={K.out} stroke-width={1.5} />
      {[[100, 196], [130, 204], [160, 206], [190, 204], [220, 196], [116, 186], [146, 192], [176, 192], [206, 186]].map(([x, y], i) => (
        <OG key={i} sh={[{ d: ell([x, y], 13, 9), f: i % 2 ? '#8b877f' : '#9a968d' }]} />
      ))}
      <Coals x={160} y={206} w={120} n={9} />
      <path d="M58 168Q160 196 262 168L264 154Q160 182 56 154Z" fill="#4e9a45" stroke={K.out} stroke-width={1.5} />
      {[[104, 150], [160, 154], [216, 150]].map(([x, y], i) => (
        <OG key={i} sh={[{ d: rrect(x - 22, y - 26, 44, 26, 10), f: '#6aae54' }, { d: `M${x - 18} ${y - 13}H${x + 18}`, st: shade('#6aae54', 0.3), sw: 1.4 }]} />
      ))}
      <path d="M48 128Q160 132 272 128L272 112Q160 118 48 112Z" fill="#4e9a45" stroke={K.out} stroke-width={1.5} />
      <g fill="none" stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.85}>
        <path d="M130 108c-4-5 4-8 0-14M190 108c-4-5 4-8 0-14" />
      </g>
    </Scene2>
  ),

  'sf-ap-toprakfirin-ortu': () => {
    const leak: P = [206, 92];
    return (
      <Scene2 bg="outdoor" gy={130}>
        <Soil x={0} y={130} w={320} h={110} />
        <rect y={130} width={320} height={5} fill={K.grass} />
        <path d="M40 130Q44 236 160 238Q276 236 280 130Z" fill="#6a4e38" stroke={K.out} stroke-width={1.5} />
        <path d="M56 160Q160 180 264 160L270 140Q160 156 50 140Z" fill="#4e9a45" stroke={K.out} stroke-width={1.2} />
        <path d="M30 132Q160 104 290 132L290 122Q160 90 30 122Z" fill="#a2865a" stroke={K.out} stroke-width={1.5} />
        <path d="M24 124Q160 30 296 124Q160 92 24 124Z" fill={M.toprak} stroke={K.out} stroke-width={1.5} />
        <g fill="none" stroke="#fff" stroke-width={2.6} stroke-linecap="round"><path d={`M${leak[0]} ${leak[1] - 4}c-5-6 4-9 0-16M${leak[0] + 10} ${leak[1] - 2}c-5-6 4-9 0-16`} /></g>
        <circle cx={leak[0] + 4} cy={leak[1] - 6} r={20} fill="none" stroke={K.action} stroke-width={3.5} />
        <Rod d="M300 8L246 64" w={5} c={M.odun} />
        <OG sh={[{ d: 'M246 56L254 66L232 86Q220 80 226 68Z', f: M.sac }, { d: 'M236 68L246 66L232 80Q226 76 230 70Z', f: M.toprak, no: true }]} />
        <Arrow from={[232, 92]} to={[218, 90]} w={4} />
      </Scene2>
    );
  },

  /* ───── sac ───── */
  'sf-ap-sac-kurulum': () => (
    <Scene2 bg="outdoor" gy={196} ground="dirt">
      <OG sh={[{ d: ell([160, 210], 64, 9), f: '#5a4436' }]} />
      <OG sh={[{ d: capsule([118, 208], 5, [200, 206], 5), f: '#8a5a36' }]} />
      <Flame x={130} y={208} s={0.5} />
      <Flame x={160} y={206} s={0.6} />
      <Flame x={190} y={208} s={0.5} />
      <Rock x={92} y={214} s={1.1} />
      <Rock x={232} y={214} s={1.1} />
      <OG sh={[{ d: 'M70 192Q160 150 250 192L248 200Q160 160 72 200Z', f: M.demir }]} />
    </Scene2>
  ),

  'sf-ap-sac-su-damla': () => {
    const h = handAt({ a: 160, s: 1.0, pose: 'open', side: 'R', ...HANDS.firin }, 'tip', [190, 60]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M0 240V200Q160 110 320 200V240Z', f: M.demir }]} />
        <path d="M60 196Q160 140 260 196" fill="none" stroke={tint(M.demir, 0.3)} stroke-width={3} />
        {[[110, 164], [150, 152], [186, 156], [222, 170], [132, 160]].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y - 6} rx={5} ry={4} fill={K.waterLight} stroke={K.water} stroke-width={1.4} />
            <path d={`M${x - 9} ${y - 12}l-4 -4M${x + 9} ${y - 12}l4 -4M${x} ${y - 16}v-5`} stroke={K.water} stroke-width={1.6} stroke-linecap="round" />
          </g>
        ))}
        <Hand {...h} arm={200} />
        {[[176, 88], [168, 106], [184, 112]].map(([x, y], i) => <Drop0 key={i} x={x} y={y} />)}
        <Ok x={270} y={110} r={15} />
      </Scene2>
    );
  },

  'sf-ap-sac-cevirme': () => {
    const h = handAt({ a: -80, s: 0.95, pose: 'hold', side: 'R', grip: 10, ...HANDS.firin }, 'grip', [262, 90]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M0 240V196Q160 120 320 196V240Z', f: M.demir }]} />
        <OG sh={[{ d: 'M40 186Q120 150 190 150L188 140Q120 138 40 176Z', f: '#ead39a' }]} />
        <OG sh={[{ d: 'M190 150Q230 116 262 112L262 104Q222 104 188 140Z', f: '#ead39a' }]} />
        <g fill="#b9853e">{[[70, 172], [104, 162], [140, 154], [170, 148], [208, 130], [236, 116], [120, 166]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={4} ry={2.4} />)}</g>
        <Hand {...h} arm={200}>
          <Rod d="M150 156L300 78" w={4} c={M.ahsap} />
        </Hand>
        <Arrow from={[120, 110]} to={[200, 70]} bend={-0.3} w={5} />
      </Scene2>
    );
  },

  /* ───── saman kutu ───── */
  'sf-ap-saman-kaynatma': () => (
    <Scene2 bg="outdoor" gy={200} ground="dirt">
      <OG sh={[{ d: capsule([120, 214], 6, [200, 210], 6), f: '#8a5a36' }]} />
      <Flame x={140} y={212} s={0.55} />
      <Flame x={178} y={212} s={0.6} />
      <Rock x={104} y={218} s={0.9} />
      <Rock x={216} y={218} s={0.9} />
      <LidPot x={160} y={190} s={1.4} />
      <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round"><path d="M150 96c-5-6 5-10 0-18M170 92c-5-6 5-10 0-18" /></g>
    </Scene2>
  ),

  'sf-ap-saman-kapatma': () => (
    <Scene2 bg="indoor" gy={210}>
      <OG sh={[{ d: rrect(56, 96, 208, 118, 3), f: M.ahsap }]} />
      <rect x={68} y={96} width={184} height={106} fill={M.saman} />
      <g stroke={shade(M.saman, 0.3)} stroke-width={1.3}>{Array.from({ length: 40 }, (_, i) => { const x = 72 + ((i * 47) % 176), y = 100 + ((i * 29) % 98); return <line key={i} x1={x} y1={y} x2={x + 8} y2={y + ((i % 3) - 1) * 4} />; })}</g>
      <LidPot x={160} y={186} s={1.15} steam={false} />
      <OG sh={[{ d: rrect(76, 92, 168, 18, 9), f: '#c86f5c' }]} />
      <OG sh={[{ d: 'M56 92L56 84L264 34L268 42Z', f: shade(M.ahsap, 0.08) }]} />
      <Arrow from={[284, 30]} to={[284, 80]} bend={-0.2} w={5} />
    </Scene2>
  ),

  'sf-ap-saman-yeniden-kaynat': () => (
    <Scene2 bg="outdoor" gy={200} ground="dirt">
      <OG sh={[{ d: rrect(24, 150, 90, 64, 3), f: M.ahsap }, { d: rrect(20, 142, 98, 12, 3), f: shade(M.ahsap, 0.1) }]} />
      <g stroke={M.saman} stroke-width={3}><line x1={30} y1={156} x2={108} y2={156} /></g>
      <Arrow from={[124, 160]} to={[176, 160]} w={6} />
      <OG sh={[{ d: capsule([200, 214], 6, [280, 210], 6), f: '#8a5a36' }]} />
      <Flame x={222} y={212} s={0.55} />
      <Flame x={258} y={212} s={0.6} />
      <Rock x={190} y={218} s={0.8} />
      <Rock x={294} y={218} s={0.8} />
      <LidPot x={240} y={190} s={1.15} />
      <g fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round"><path d="M232 110c-5-6 5-10 0-18M250 106c-5-6 5-10 0-18" /></g>
    </Scene2>
  ),

  /* ───── güneş fırını ───── */
  'sf-ap-gunes-kutu-kesit': () => (
    <Scene2 bg="outdoor" gy={210}>
      <Sun x={44} y={40} r={16} />
      <G x={20}>
      <g stroke="#f6b81f" stroke-width={2.6} stroke-linecap="round">{[110, 150, 190].map((x) => <line key={x} x1={x - 50} y1={40} x2={x} y2={100} />)}</g>
      <OG sh={[{ d: rrect(40, 106, 200, 104, 3), f: '#c99a62' }]} />
      <rect x={52} y={110} width={176} height={90} fill={M.saman} />
      <g stroke={shade(M.saman, 0.3)} stroke-width={1.3}>{Array.from({ length: 30 }, (_, i) => { const x = 56 + ((i * 47) % 166), y = 114 + ((i * 29) % 82); return <line key={i} x1={x} y1={y} x2={x + 8} y2={y + ((i % 3) - 1) * 3} />; })}</g>
      <rect x={80} y={110} width={120} height={70} fill="#24211f" stroke={K.out} stroke-width={1.5} />
      <rect x={36} y={100} width={208} height={8} fill="#cfeaf6" opacity={0.85} stroke={K.out} stroke-width={1.5} />
      </G>
    </Scene2>
  ),

  'sf-ap-gunes-yansitici': () => (
    <Scene2 bg="outdoor" gy={200}>
      <Sun x={56} y={36} r={16} />
      <OG sh={[{ d: 'M108 150L84 64L236 64L212 150Z', f: K.foil }, { d: 'M84 64L108 150H120L100 64Z', f: tint(K.foil, 0.3), no: true }]} />
      <OG sh={[{ d: 'M108 150L40 120L60 196L108 196Z', f: K.foil }, { d: 'M212 150L280 120L260 196L212 196Z', f: K.foil }]} />
      <OG sh={[{ d: rrect(104, 146, 112, 56, 3), f: '#c99a62' }, { d: rrect(110, 150, 100, 18, 2), f: '#cfeaf6', ln: true }]} />
      <g stroke="#f6b81f" stroke-width={2.6} stroke-linecap="round">
        <line x1={74} y1={46} x2={196} y2={84} /><line x1={196} y1={84} x2={176} y2={150} />
        <line x1={68} y1={54} x2={128} y2={150} />
      </g>
      <Rock x={50} y={204} s={0.6} />
      <Rock x={270} y={204} s={0.6} />
    </Scene2>
  ),

  'sf-ap-gunes-cevirme': () => {
    const c: P = [160, 170];
    const box = (a: number) => (
      <G x={c[0]} y={c[1]} a={a}>
        <OG sh={[{ d: rrect(-30, -22, 60, 44, 3), f: '#c99a62' }, { d: rrect(-24, -16, 48, 32, 2), f: '#cfeaf6', ln: true }, { d: 'M-30 -22L-42 -50H42L30 -22Z', f: K.foil }]} />
      </G>
    );
    return (
      <Scene2 bg="dark">
        <rect width={320} height={240} fill="#9fcf7a" />
        <path d="M40 150Q160 -10 280 150" fill="none" stroke="#fff" stroke-width={2.4} stroke-dasharray="6 6" />
        <Sun x={52} y={124} r={10} />
        <Sun x={160} y={42} r={18} />
        <Sun x={268} y={124} r={10} />
        {box(0)}
        <Arrow from={[96, 196]} to={[118, 214]} bend={0.3} w={4} />
        <Arrow from={[224, 196]} to={[202, 214]} bend={-0.3} w={4} />
      </Scene2>
    );
  },

  /* ───── kap güvenliği ───── */
  'sf-ap-kap-galvaniz-yasak': () => (
    <Scene2 bg="outdoor" gy={200} ground="dirt">
      <OG sh={[{ d: capsule([110, 216], 6, [210, 212], 6), f: '#8a5a36' }]} />
      <Flame x={130} y={214} s={0.6} />
      <Flame x={190} y={214} s={0.6} />
      <OG sh={[{ d: 'M118 196L110 120H210L202 196Z', f: '#c4ccd3' }, { d: ell([160, 120], 50, 9), f: '#9aa3ad' }]} />
      <g fill="#e3e8ec">{[[130, 150], [152, 170], [178, 140], [190, 176], [140, 182], [168, 158]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 6}L${x + 6} ${y}L${x} ${y + 6}L${x - 6} ${y}Z`} stroke="#aab3bb" stroke-width={0.8} />)}</g>
      <Puffs x={160} y={96} n={3} r={13} c="#f2f4f5" op={0.95} dy={-22} />
      <No x={160} y={140} r={64} />
    </Scene2>
  ),

  'sf-ap-kap-kursun-sir': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M44 120Q36 186 92 196Q148 186 140 120Q136 100 92 100Q48 100 44 120Z', f: '#e0602e' }, { d: ell([92, 104], 34, 8), f: '#a8402a' }]} />
      <g fill="none" stroke="#f5c542" stroke-width={4} stroke-linecap="round"><path d="M50 140Q92 152 134 140M54 166Q92 178 130 166" /></g>
      <path d="M58 120Q64 110 76 108" fill="none" stroke="#fff" stroke-width={4} stroke-linecap="round" opacity={0.8} />
      <Bad x={128} y={206} r={15} />
      <OG sh={[{ d: 'M180 130Q178 196 228 196Q278 196 276 130Z', f: M.kil }, { d: rrect(172, 120, 112, 12, 5), f: shade(M.kil, 0.1) }, { d: capsule([170, 140], 5, [178, 140], 5), f: M.kil }, { d: capsule([278, 140], 5, [286, 140], 5), f: M.kil }]} />
      <Ok x={272} y={206} r={15} />
    </Scene2>
  ),

  'sf-ap-kap-kapali-yasak': () => (
    <Scene2 bg="outdoor" gy={200} ground="dirt">
      <OG sh={[{ d: capsule([96, 216], 6, [224, 212], 6), f: '#8a5a36' }]} />
      <Flame x={124} y={214} s={0.7} />
      <Flame x={196} y={214} s={0.7} />
      <OG sh={[{ d: 'M90 200Q84 160 92 130H140Q148 160 142 200Z', f: '#b8c0c8' }, { d: ell([116, 130], 24, 6), f: '#9aa3ad' }, { d: 'M96 150H136V180H96Z', f: '#d9a13a', no: true }]} />
      <OG sh={[{ d: 'M174 200Q166 156 178 136H222Q234 156 226 200Z', f: '#cfeaf6' }, { d: rrect(178, 124, 44, 14, 3), f: '#c4ccd3' }]} />
      <g stroke={K.danger} stroke-width={3} stroke-linecap="round">
        <path d="M80 120l-10 -10M116 112v-14M152 120l10 -10M168 118l-10 -10M200 106v-14M232 118l10 -10" />
      </g>
      <Bad x={282} y={56} r={18} />
    </Scene2>
  ),

};
