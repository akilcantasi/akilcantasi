// Yaralanma ve hastalık sahneleri (1. yarı): burun kanaması, yanık, kırık, ezilme, baş/omurga,
// göz, diş, ağız, göğüs, karın, kanama ve kopan parça.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Bad, Bed, Blanket, Blood, Chair, Cloth, Drop, Flame, Hand, K, Label, No, OG, Ok, OW, Person, Phone, POSE,
  Scene2, Stairs, Table, Timer, Wall, Waves, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Pose } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

type R = ReturnType<typeof rig>;
let uid = 0;
const nid = (p: string) => `${p}-${++uid}`;
const f1 = (n: number) => Math.round(n * 10) / 10;

/** Baş-yerel noktayı (yarıçap ≈12, yüz +x, tepe -y) sahne koordinatına çevirir. */
function hp(r: R, p: P): P {
  const k = r.headR / 12;
  const a = ((r.headA + 90) * Math.PI) / 180;
  const x = (r.flip ? -p[0] : p[0]) * k, y = p[1] * k;
  return [r.head[0] + x * Math.cos(a) - y * Math.sin(a), r.head[1] + x * Math.sin(a) + y * Math.cos(a)];
}
/** Ayrıntılı eli, verilen noktası (tip/grip/palm/pinch) hedefe gelecek şekilde konumlar. */
type HP = Omit<HandProps, 'x' | 'y' | 'children'>;
function place(h: HP, which: 'tip' | 'grip' | 'palm' | 'pinch', t: P): HandProps {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: t[0] - o[0], y: t[1] - o[1] };
}
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Eldivenli el: önce kol + kol yeni, üstüne mavi nitril eldiven (renk süzgeci). */
function Gloved(h: HandProps) {
  const id = nid('glv');
  return (
    <g>
      <Hand {...h} />
      <defs>
        <filter id={id} color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="0.17 0.33 0.06 0 0.1  0.24 0.47 0.09 0 0.12  0.31 0.62 0.12 0 0.12  0 0 0 1 0" />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>
        <Hand {...h} arm={30} sleeve={undefined} />
      </g>
    </g>
  );
}

/** Küçük ikinci kare. İçerik 320 genişlikli kendi koordinatında çizilir (yükseklik = h·320/w). */
function Panel({ x, y, w, h, bg = K.closeup, children }: { x: number; y: number; w: number; h: number; bg?: string; children?: ComponentChildren }) {
  const id = nid('pn');
  const k = w / 320;
  return (
    <g>
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={11} fill="#fff" />
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={8} />
        </clipPath>
      </defs>
      <g clip-path={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={bg} />
        <g transform={`translate(${x} ${y}) scale(${f1(k * 1000) / 1000})`}>{children}</g>
      </g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

const T = (x: number, y: number, a = 0, s = 1) => `translate(${f1(x)} ${f1(y)})${a ? ` rotate(${a})` : ''}${s !== 1 ? ` scale(${s})` : ''}`;
const Gx = ({ x, y, a = 0, s = 1, children }: { x: number; y: number; a?: number; s?: number; children?: ComponentChildren }) => <g transform={T(x, y, a, s)}>{children}</g>;

/** Beze sarılı soğuk paket (MERKEZ). */
function ColdPack({ x, y, w = 40, h = 24, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  return (
    <Gx x={x} y={y} a={a}>
      <OG
        sh={[
          { d: rrect(-w / 2 + 3, -h / 2 - 3, w - 6, h, 4), f: '#9dd5f6' },
          { d: `M${-w / 2} ${-h / 2 + 2}Q${-w / 4} ${-h / 2 - 1} 0 ${-h / 2 + 1}T${w / 2} ${-h / 2 + 1}V${h / 2 - 1}Q${w / 4} ${h / 2 + 2} 0 ${h / 2}T${-w / 2} ${h / 2}Z`, f: K.cloth },
          { d: `M${-w / 2 + 3} ${h / 6}H${w / 2 - 3}`, st: shade(K.cloth, 0.14), sw: 1.2 },
        ]}
      />
      <g stroke={K.water} stroke-width={1.6} stroke-linecap="round">
        <path d="M0 -6V4M-4.5 -3.5L4.5 1.5M4.5 -3.5L-4.5 1.5" />
      </g>
    </Gx>
  );
}

/** Duvar saati (MERKEZ). from/to: turuncu dilim (derece, 0 = saat 12, saat yönünde). */
function Clock({ x, y, r = 40, from = 0, to = 90 }: { x: number; y: number; r?: number; from?: number; to?: number }) {
  const pa = (d: number, rr: number): P => [x + rr * Math.sin((d * Math.PI) / 180), y - rr * Math.cos((d * Math.PI) / 180)];
  const a0 = pa(from, r * 0.86), a1 = pa(to, r * 0.86);
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#f4f1ea' }, { d: circ([x, y], r * 0.88), f: '#fff', ln: true }]} />
      <path d={`M${x} ${y}L${f1(a0[0])} ${f1(a0[1])}A${f1(r * 0.86)} ${f1(r * 0.86)} 0 ${to - from > 180 ? 1 : 0} 1 ${f1(a1[0])} ${f1(a1[1])}Z`} fill={K.action} opacity={0.85} />
      {Array.from({ length: 12 }, (_, i) => {
        const p1 = pa(i * 30, r * 0.8), p2 = pa(i * 30, r * (i % 3 ? 0.72 : 0.64));
        return <path key={i} d={`M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}`} stroke={K.ink} stroke-width={i % 3 ? 1.5 : 2.6} stroke-linecap="round" />;
      })}
      <path d={`M${x} ${y}L${f1(pa(to, r * 0.66)[0])} ${f1(pa(to, r * 0.66)[1])}M${x} ${y}L${f1(pa(from, r * 0.48)[0])} ${f1(pa(from, r * 0.48)[1])}`} stroke={K.ink} stroke-width={3} stroke-linecap="round" />
      <circle cx={x} cy={y} r={3.2} fill={K.ink} />
    </g>
  );
}

/** Kanepe (karşıdan). x = SOL, y = zemin. Oturak üstü = y - 48. */
function Sofa({ x, y, w = 260, color = '#7d8fb3' }: { x: number; y: number; w?: number; color?: string }) {
  const sd = shade(color, 0.16);
  return (
    <OG
      sh={[
        { d: rrect(x + 16, y - 14, 8, 14, 2), f: K.wood },
        { d: rrect(x + w - 24, y - 14, 8, 14, 2), f: K.wood },
        { d: rrect(x + 14, y - 100, w - 28, 62, 12), f: sd },
        { d: rrect(x + 10, y - 50, w - 20, 38, 7), f: color },
        { d: `M${x + 14} ${y - 38}H${x + w - 14}`, st: shade(color, 0.28), sw: 1.4 },
        { d: rrect(x, y - 70, 30, 58, 10), f: tint(color, 0.08) },
        { d: rrect(x + w - 30, y - 70, 30, 58, 10), f: tint(color, 0.08) },
      ]}
    />
  );
}

/** Yastık (MERKEZ). */
const Pillow = ({ x, y, w = 50, h = 18, color = '#f4f1ea' }: { x: number; y: number; w?: number; h?: number; color?: string }) => (
  <OG sh={[{ d: smooth([[x - w / 2, y], [x - w * 0.4, y - h / 2], [x, y - h / 2 + 1], [x + w * 0.4, y - h / 2], [x + w / 2, y], [x + w * 0.4, y + h / 2], [x, y + h / 2 - 1], [x - w * 0.4, y + h / 2]], true), f: color }]} />
);

/** Diş (kesici). x,y = taç-kök birleşimi; taç -y yönünde; s ölçek, a dönüş. */
function Tooth({ x, y, s = 1, a = 0, dry }: { x: number; y: number; s?: number; a?: number; dry?: boolean }) {
  return (
    <Gx x={x} y={y} a={a} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: 'M-12 -2C-11.5 16 -6 36 0 44C6 36 11.5 16 12 -2Z', f: dry ? '#d8c08a' : '#ecd590' },
          { d: 'M-4 6C-3 18 -1.5 30 0 36', st: shade('#ecd590', 0.2), sw: 1.4 / s },
          { d: 'M-14 0C-16 -12 -16 -26 -12.5 -33Q0 -37 12.5 -33C16 -26 16 -12 14 0Q0 4 -14 0Z', f: dry ? '#ece6d6' : '#fbfaf3' },
          { d: 'M-7 -28Q-8.5 -16 -7 -6', st: '#fff', sw: 2.4 / s },
        ]}
      />
    </Gx>
  );
}

/** Bardak (taban ortası). liquid: sıvı rengi, fill 0..1 */
function Glass({ x, y, w = 34, h = 48, fill = 0.75, liquid = K.water, op = 0.55, children }: { x: number; y: number; w?: number; h?: number; fill?: number; liquid?: string; op?: number; children?: ComponentChildren }) {
  const t = 4;
  const d = `M${x - w / 2} ${y - h}L${x - w / 2 + t} ${y - 2}Q${x - w / 2 + t} ${y} ${x - w / 2 + t + 2} ${y}H${x + w / 2 - t - 2}Q${x + w / 2 - t} ${y} ${x + w / 2 - t} ${y - 2}L${x + w / 2} ${y - h}Z`;
  const ly = y - h * fill;
  const lx = (yy: number) => (w / 2) - (t * (yy - (y - h))) / h;
  return (
    <g>
      <path d={d} fill="#e9f5fb" opacity={0.6} />
      <path d={`M${x - lx(ly)} ${ly}L${x - w / 2 + t} ${y - 2}Q${x - w / 2 + t} ${y} ${x - w / 2 + t + 2} ${y}H${x + w / 2 - t - 2}Q${x + w / 2 - t} ${y} ${x + w / 2 - t} ${y - 2}L${x + lx(ly)} ${ly}Z`} fill={liquid} opacity={op} />
      {children}
      <path d={`M${x - lx(ly)} ${ly}H${x + lx(ly)}`} stroke={shade(liquid, 0.15)} stroke-width={1.4} />
      <path d={d} fill="none" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
      <path d={`M${x - w / 2 + 6} ${y - h + 6}L${x - w / 2 + 8} ${y - 8}`} stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.8} />
    </g>
  );
}

/** Kopan parmak parçası (MERKEZ, a dönüş: 0 = uç sağda). */
function Finger({ x, y, a = 0, s = 1, skin = 1 }: { x: number; y: number; a?: number; s?: number; skin?: number }) {
  const sk = K.skin[skin];
  return (
    <Gx x={x} y={y} a={a} s={s}>
      <OG
        ow={OW / s}
        sh={[
          { d: capsule([-14, 0], 6.4, [14, 0], 5.6), f: sk },
          { d: ell([-14.5, 0], 2.4, 5.6), f: '#d9706a', ln: true },
          { d: ell([12, 0], 3.6, 3.2), f: tint(sk, 0.45), no: true },
          { d: 'M-2 -5Q-0.5 0 -2 5M2 -5Q3.5 0 2 5', st: shade(sk, 0.3), sw: 0.9 },
        ]}
      />
    </Gx>
  );
}

/** Kilitli poşet (MERKEZ). */
function Bag({ x, y, w = 62, h = 50, children }: { x: number; y: number; w?: number; h?: number; children?: ComponentChildren }) {
  return (
    <g>
      <path d={rrect(x - w / 2, y - h / 2, w, h, 6)} fill="#f2f8fb" opacity={0.55} />
      {children}
      <path d={rrect(x - w / 2, y - h / 2, w, h, 6)} fill="none" stroke={K.out} stroke-width={1.8} />
      <rect x={x - w / 2} y={y - h / 2 + 4} width={w} height={5} fill="#3a9be0" stroke={K.out} stroke-width={1.2} />
      <path d={`M${x - w / 2 + 6} ${y - h / 2 + 14}V${y + h / 2 - 8}`} stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.85} />
    </g>
  );
}

/** Buz küpü (MERKEZ). */
const Ice = ({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) => (
  <Gx x={x} y={y} a={a} s={s}>
    <path d={rrect(-9, -9, 18, 18, 4)} fill="#eaf7fd" stroke={K.out} stroke-width={1.4 / s} />
    <path d="M-5 -4L-1 -6M-5 0L-3 -1" stroke="#fff" stroke-width={2 / s} stroke-linecap="round" />
  </Gx>
);

/** Kalem (uç noktası x,y; a = gövdenin uca göre açısı). */
const Pen = ({ x, y, a = -50, l = 70, color = '#3a5fb0' }: { x: number; y: number; a?: number; l?: number; color?: string }) => (
  <Gx x={x} y={y} a={a}>
    <OG
      sh={[
        { d: `M0 0L9 -3.4V3.4Z`, f: '#e8d2a6' },
        { d: rrect(8, -4, l, 8, 3), f: color },
        { d: rrect(l - 6, -4.5, 12, 9, 3), f: shade(color, 0.25) },
        { d: 'M0 0L3.2 -1.2V1.2Z', f: K.ink, no: true },
      ]}
    />
  </Gx>
);

/** Beton parçası (taban ortası). */
function Slab({ x, y, w = 110, h = 44, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  const c = '#a9a59c';
  return (
    <Gx x={x} y={y} a={a}>
      <OG
        sh={[
          { d: `M${-w / 2} 0L${-w / 2 + 6} ${-h + 4}L${-w / 2 + 30} ${-h}L${w / 2 - 10} ${-h + 2}L${w / 2} ${-h + 16}L${w / 2 - 4} 0Z`, f: c },
          { d: `M${-w / 2 + 6} ${-h + 4}L${-w / 2 + 30} ${-h}L${w / 2 - 10} ${-h + 2}L${w / 2} ${-h + 16}L${w / 2 - 6} ${-h + 12}L${-w / 2 + 4} ${-h + 12}Z`, f: tint(c, 0.25), no: true },
          { d: `M${-w / 2 + 20} ${-h + 22}l10 6l-4 9M${w / 2 - 30} ${-h + 18}l-6 10`, st: shade(c, 0.35), sw: 1.4 },
          { d: `M${w / 2 - 4} ${-h + 20}l12 -6M${w / 2 - 3} ${-h + 30}l14 -3`, st: '#7c5a44', sw: 2.2 },
        ]}
      />
    </Gx>
  );
}

/** Yanık kızarıklığı: ön kol üstünde yumuşak kırmızı leke. */
const Redness = ({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) => (
  <g>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#e2554a" opacity={0.42} />
    <ellipse cx={x - rx * 0.15} cy={y} rx={rx * 0.6} ry={ry * 0.6} fill="#d8433a" opacity={0.35} />
  </g>
);

/** Gövde çevresinde dönme halkası: arka yarı (önce) + ön yarı ok başıyla (sonra). */
function Ring({ cx, cy, rx, ry, part }: { cx: number; cy: number; rx: number; ry: number; part: 'back' | 'front' }) {
  if (part === 'back') {
    const d = `M${cx} ${cy - ry}A${rx} ${ry} 0 0 0 ${cx} ${cy + ry}`;
    return (
      <g fill="none" stroke-linecap="round">
        <path d={d} stroke={K.out} stroke-width={8} />
        <path d={d} stroke={shade(K.action, 0.15)} stroke-width={5} />
      </g>
    );
  }
  const end: P = [cx + rx * 0.5, cy + ry * 0.87];
  const d = `M${cx} ${cy - ry}A${rx} ${ry} 0 0 1 ${f1(end[0])} ${f1(end[1])}`;
  const hd = `M${f1(end[0] - 13)} ${f1(end[1] + 4)}L${f1(end[0] + 4)} ${f1(end[1] - 9)}L${f1(end[0] + 4)} ${f1(end[1] + 12)}Z`;
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={8.5} />
      <path d={hd} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} stroke={K.action} stroke-width={5.5} />
      <path d={hd} fill={K.action} />
    </g>
  );
}

/** Not defteri (sol üst) + yazı. */
const Notebook = ({ x, y, w = 46, h = 32, text, a = 0 }: { x: number; y: number; w?: number; h?: number; text?: string; a?: number }) => (
  <Gx x={x} y={y} a={a}>
    <OG sh={[{ d: rrect(0, 0, w, h, 2), f: '#fffdf4' }, { d: rrect(0, 0, w, 5, 1.5), f: '#d9483b' }]} />
    {text && (
      <text x={w / 2} y={h / 2 + 7} text-anchor="middle" font-size={13} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">
        {text}
      </text>
    )}
  </Gx>
);

/** Mutfak musluğu: duvardan gelen boru, ağız (sx,sy) noktasında. */
const Faucet = ({ sx, sy }: { sx: number; sy: number }) => (
  <OG
    sh={[
      { d: rrect(sx - 92, sy - 58, 24, 16, 3), f: K.metal },
      { d: `M${sx - 70} ${sy - 54}H${sx - 16}Q${sx + 6} ${sy - 54} ${sx + 6} ${sy - 32}V${sy - 4}H${sx - 6}V${sy - 32}Q${sx - 6} ${sy - 42} ${sx - 16} ${sy - 42}H${sx - 70}Z`, f: '#c3cbd4' },
      { d: rrect(sx - 8, sy - 6, 16, 7, 2), f: shade(K.metal, 0.15) },
      { d: rrect(sx - 46, sy - 70, 10, 17, 2), f: K.metal },
      { d: rrect(sx - 58, sy - 74, 34, 7, 3), f: '#3a9be0' },
    ]}
  />
);

/** Su akışı (dalgalı ince şerit) a → b. */
const Stream = ({ a, b, w = 7 }: { a: P; b: P; w?: number }) => {
  const m = lerp(a, b, 0.5);
  const d = `M${f1(a[0])} ${f1(a[1])}Q${f1(m[0] + 2)} ${f1(m[1])} ${f1(b[0])} ${f1(b[1])}`;
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke={K.out} stroke-width={w + 2.4} opacity={0.6} />
      <path d={d} stroke={K.water} stroke-width={w} />
      <path d={d} stroke={K.waterLight} stroke-width={w * 0.3} transform="translate(-1.5 0)" />
    </g>
  );
};

/** Soldan gelen yatay ön kol için kol yeni (x0 = yenin bittiği nokta). */
const Cuff = ({ x0, y, r, color }: { x0: number; y: number; r: number; color: string }) => (
  <OG sh={[{ d: capsule([x0 - 120, y], r + 3, [x0, y], r + 2.4), f: color }, { d: `M${x0 - 4} ${y - r}V${y + r}`, st: shade(color, 0.3), sw: 1.4 }]} />
);

/** Yarı saydam streç film tabakası. */
const Film = ({ d }: { d: string }) => (
  <g>
    <path d={d} fill="#dff1fa" opacity={0.5} />
    <path d={d} fill="none" stroke="#7fb6d6" stroke-width={1.6} stroke-dasharray="0" />
  </g>
);

/** Sırtüstü yatan yetişkin (baş solda) için hazır duruş */
const lie = (o: Partial<PersonProps> & { x: number; y: number }, pose: Pose = {}): PersonProps => ({
  who: 'man', role: 'victim', s: 1, ...o, pose: { ...POSE.lieBack, ...pose },
});

/* ════════════════════════ oyuncular (rehber başına sabit) ════════════════════════ */

type Look = Pick<PersonProps, 'who' | 'role' | 'skin' | 'hair' | 'hairC' | 'top' | 'bottom' | 'bottomC'>;
interface Cast { victim: Look; helper: Look }

/** burun-kanamasi: kişi kendi burnunu sıkıyor */
const BRN: Cast = {
  victim: { who: 'woman', role: 'victim', hair: 'ponytail', hairC: K.hair.dark, skin: 1 },
  helper: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black },
};
/** yanik */
const YNK: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.brown },
  helper: { who: 'woman', role: 'helper', hair: 'scarf', hairC: '#5d6fa6', skin: 1 },
};
/** kirik-burkulma */
const KRK: Cast = {
  victim: { who: 'woman', role: 'victim', hair: 'long', hairC: K.hair.black, skin: 2 },
  helper: { who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown },
};
/** ezilme-yaralanmasi */
const EZL: Cast = {
  victim: { who: 'man', role: 'victim', skin: 2, hairC: K.hair.black },
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 1 },
};
/** yaralanma-bas-travmasi: spor kıyafetli genç + yanında kalan yetişkin */
const BAS: Cast = {
  victim: { who: 'boy', role: 'victim', top: '#d9483b', bottom: 'shorts', bottomC: '#f4f1ea', hairC: K.hair.dark, skin: 1 },
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.brown, skin: 0 },
};
/** yaralanma-omurga */
const OMR: Cast = {
  victim: { who: 'man', role: 'victim', skin: 3, hairC: K.hair.black },
  helper: { who: 'woman', role: 'helper', hair: 'long', hairC: K.hair.black, skin: 1, bottomC: K.pants.khaki },
};
/** yaralanma-goz */
const GOZ: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark },
  helper: { who: 'woman', role: 'helper', skin: 2, hair: 'bun', hairC: K.hair.black },
};
/** yaralanma-dis */
const DIS: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.auburn },
  helper: { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.dark },
};
/** yaralanma-gogus */
const GGS: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark },
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2 },
};
/** yaralanma-karin */
const KRN: Cast = {
  victim: { who: 'woman', role: 'victim', hair: 'long', hairC: K.hair.dark, skin: 2 },
  helper: { who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown },
};
/** yaralanma-uzuv-kopmasi */
const UZV: Cast = {
  victim: { who: 'man', role: 'victim', skin: 2, hairC: K.hair.black },
  helper: { who: 'woman', role: 'helper', skin: 1, hair: 'ponytail', hairC: K.hair.brown },
};

/** Ortak "yatırın, üstünü örtün, konuşun" sahnesi, rehberin oyuncularıyla. */
function coverScene(c: Cast, face: PersonProps['face'] = 'neutral') {
  // Yaralı sırtüstü (baş solda), büyük ölçek. Yardımcı başın arkasında topukları üstünde diz çökmüş,
  // elleri dizlerinde, konuşuyor. Battaniye vücut hattını izler; ayaklar dışarıda.
  const s = 1.75;
  const victim: PersonProps = { x: 262, y: 230, s, ...c.victim, pose: { ...POSE.lieBack, face } };
  const v = rig(victim);
  const fl = 230;
  const sx = v.shoulderF[0] + 4 * s;
  const ty = v.chest[1] - 3 * s;
  const ax = v.ankleF[0] - 2 * s;
  const ay = v.ankleF[1] - 9 * s;
  const top = smooth([[sx, ty + 1], [v.hip[0] - 20 * s, ty - 1], [v.kneeF[0], v.kneeF[1] - 8 * s], [ax, ay]]);
  const body = `${top}Q${ax + 6} ${ay + 2} ${ax + 5} ${fl}L${sx - 3} ${fl}Q${sx - 6} ${ty + 6} ${sx} ${ty + 1}Z`;
  const BL = '#c1554b';
  const hem = rrect(sx - 3, ty - 3, 13 * s, fl - ty + 2, 6);
  const helper: PersonProps = {
    x: v.head[0] - 52 * s, y: 232, s, ...c.helper,
    pose: { ...POSE.kneelSit, spine: -78, chest: -64, head: -48, legB: [8, 180], legF: [4, 178], armF: [96, 24], armB: [92, 28], face: 'speak' },
  };
  const hr = rig(helper);
  return (
    <Scene2 bg="indoor" gy={150}>
      <Person {...helper} />
      <Person {...victim} />
      <OG sh={[{ d: body, f: BL }, { d: `M${f1(v.hip[0] - 10 * s)} ${f1(ty + 4)}L${f1(v.hip[0] - 4 * s)} ${fl - 3}M${f1(v.kneeF[0] + 4 * s)} ${f1(v.kneeF[1] - 2 * s)}L${f1(v.kneeF[0] + 10 * s)} ${fl - 3}`, st: shade(BL, 0.22), sw: 1.8 }]} />
      <OG sh={[{ d: hem, f: tint(BL, 0.18) }]} />
      <Waves x={hr.mouth[0] + 10} y={hr.mouth[1] + 2} a={20} n={2} r={6} />
    </Scene2>
  );
}

/** Ortak yetişkin kalp masajı sahnesi, rehberin oyuncularıyla (yan görünüş, kollar dik, omuzlar ellerin üstünde). */
function cprScene(c: Cast) {
  const victim: PersonProps = { x: 168, y: 228, s: 1.25, ...c.victim, pose: { ...POSE.lieBack, face: 'closed' } };
  const v = rig(victim);
  const ch: P = [v.chest[0], v.chest[1]];
  const resc: PersonProps = {
    x: ch[0], ax: 'wristF', y: 225, s: 1.25, flip: true, ...c.helper,
    pose: { spine: -60, chest: -58, head: -40, legB: [92, 182], legF: [86, 180], armB: [90, 90], armF: [90, 90], handB: { shape: 'flat', a: -90 }, handF: { shape: 'flat', a: -86 }, face: 'neutral' },
  };
  const r = rig(resc);
  return (
    <Scene2 bg="indoor">
      <Person {...resc} />
      <Person {...victim} />
      <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${ch[1] - 4}`} stroke="#fff" stroke-width={3.4} stroke-dasharray="5 5" opacity={0.9} />
      <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${ch[1] - 4}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="5 5" />
      <Arrow from={[ch[0] - 34, 136]} to={[ch[0] - 34, 184]} />
      <Label x={252} y={36} text="100–120/dk" size={15} />
    </Scene2>
  );
}

/** Başın arkasında diz çökmüş yardımcı, iki eliyle başı iki yandan tutuyor (yan görünüş). */
function headHold(c: Cast, s = 1.2, vx = 206) {
  const v: PersonProps = { x: vx, y: 228, s, ...c.victim, pose: { ...POSE.lieBack, face: 'neutral' } };
  const rv = rig(v);
  const ear = hp(rv, [-1.2, 1.6]);
  const far = hp(rv, [-0.5, -8]);
  const helper: PersonProps = {
    x: rv.head[0] - 62 * s, y: 228, s, ...c.helper,
    pose: { ...POSE.kneelSit, spine: -52, chest: -42, head: -30, legB: [8, 180], legF: [4, 178], armB: { to: [far[0] - 3, far[1] + 2] }, armF: { to: [ear[0] - 3, ear[1] + 2] }, handB: { shape: 'flat', a: 20 }, handF: { shape: 'flat', a: 20 }, face: 'neutral' },
  };
  const y0 = rv.hip[1] - 5;
  return (
    <Scene2 bg="indoor">
      <Person {...helper} only={['legB', 'legF', 'armB', 'torso', 'head']} />
      <Person {...v} />
      <Person {...helper} only={['armF']} />
      <path d={`M${f1(rv.head[0] - 22)} ${f1(y0)}H${f1(rv.toeF[0] + 10)}`} stroke={K.safe} stroke-width={3} stroke-dasharray="9 7" stroke-linecap="round" />
      <Ok x={282} y={150} />
    </Scene2>
  );
}

/** Burnun yumuşak kısmını kendi parmaklarıyla sıkan, başı öne eğik kişi (yakın plan). */
function noseSqueeze(c: Cast, o: { x: number; y: number; s: number; arrows?: boolean }) {
  const p: PersonProps = { x: o.x, y: o.y, ax: 'head', ay: 'head', s: o.s, ...c.victim, pose: { view: 'side', spine: -76, chest: -66, head: -52, face: 'worried', armB: [100, 60] } };
  const r = rig(p);
  const soft = hp(r, [13.2, 3.2]);
  const h = place({ a: -48, s: 0.82 * (o.s / 3.4), pose: 'pinch', side: 'R', skin: c.victim.skin, arm: 220, sleeve: K.role.victim }, 'pinch', soft);
  const mouth = hp(r, [10.8, 7.2]);
  const fa = ((r.headA + 90) * Math.PI) / 180;
  const n: P = [Math.cos(fa - Math.PI / 2), Math.sin(fa - Math.PI / 2)];
  const L = 40 * (o.s / 3.4);
  const a1: P = [soft[0] + n[0] * L + Math.cos(fa) * 14, soft[1] + n[1] * L + Math.sin(fa) * 14];
  const a2: P = [soft[0] - n[0] * L + Math.cos(fa) * 14, soft[1] - n[1] * L + Math.sin(fa) * 14];
  return (
    <g>
      <Person {...p} only={['torso', 'head']} />
      <Hand {...h} />
      {o.arrows !== false && <Arrow from={a1} to={lerp(a1, soft, 0.55)} w={4.5} />}
      {o.arrows !== false && <Arrow from={a2} to={lerp(a2, soft, 0.55)} w={4.5} />}
      <Waves x={mouth[0] + 10} y={mouth[1] + 10} a={30} n={3} r={7} color={K.water} />
    </g>
  );
}

/** Eldivenli iki el üst üste, katlanmış bezi yaranın üstüne bastırıyor. Kollar yukarıdan, birbirini kesmeden gelir.
 *  stump: yara elde (parmak kopması); bez parmakların üstünde. */
function pressScene({ vSkin, hSkin, pad, hand, stump }: { vSkin: number; hSkin: number; pad: P; hand: P; stump?: boolean }) {
  const victim: HandProps = { x: hand[0], y: hand[1], a: 90, s: 1.2, pose: stump ? 'fist' : 'open', side: 'R', skin: vSkin, arm: 260 };
  // alttaki el (sağ el) parmakları sola-aşağı, üstteki el (sol el) parmakları sağa-aşağı: kollar V çizer, kesişmez
  const h1 = place({ a: 200, s: 0.95, pose: 'press', side: 'R', skin: hSkin, arm: 160, sleeve: K.role.helper }, 'palm', [pad[0] + 10, pad[1] - 6]);
  const h2 = place({ a: 160, s: 0.95, pose: 'press', side: 'L', skin: hSkin, arm: 160, sleeve: K.role.helper }, 'palm', [pad[0] - 10, pad[1] - 12]);
  return (
    <Scene2 bg="closeup">
      <Hand {...victim} />
      <Cuff x0={46} y={hand[1]} r={15.5} color={K.role.victim} />
      <Blood x={pad[0] - 46} y={pad[1] + 18} s={0.8} />
      <Blood x={pad[0] + 50} y={pad[1] + 20} s={0.6} />
      <OG sh={[{ d: rrect(pad[0] - 42, pad[1] - 14, 84, 24, 4), f: K.cloth }, { d: rrect(pad[0] - 40, pad[1] - 22, 80, 12, 4), f: tint(K.cloth, 0.3) }]} />
      <path d={`M${pad[0] - 34} ${pad[1] + 8}Q${pad[0]} ${pad[1] + 14} ${pad[0] + 32} ${pad[1] + 8}`} stroke={K.blood} stroke-width={3} fill="none" opacity={0.7} />
      <Gloved {...h1} />
      <Gloved {...h2} />
      <Arrow from={[pad[0], 14]} to={[pad[0], 52]} w={7} />
    </Scene2>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ── Burun kanaması ── */
  'yaralanma-burun-one-egil': () => {
    const s = 1.38;
    const base: PersonProps = { x: 124, y: 228, s, ...BRN.victim, pose: { ...POSE.sitChair, spine: -70, chest: -64, head: -48, face: 'speak' } };
    const r0 = rig(base);
    const lap: P = [r0.hip[0] + 34 * s, r0.hip[1] - 9 * s];
    const p: PersonProps = { ...base, pose: { ...base.pose, armB: { to: [lap[0] - 6, lap[1] + 2] }, armF: { to: [lap[0] + 8, lap[1] + 1] } } };
    const r = rig(p);
    const nose = hp(r, [13.6, 2.4]);
    const napY = lap[1] - 2;
    return (
      <Scene2 bg="indoor">
        <Window x={228} y={40} />
        <Chair x={r.hip[0] - 4} y={228} seat={228 - (r.hip[1] + 8 * s)} s={1.3} />
        <Person {...p} mid={() => <Cloth x={nose[0] + 2} y={napY} w={44} h={10} />} />
        {[0.12, 0.42, 0.72].map((t, i) => (
          <Drop key={i} x={nose[0] + 1} y={nose[1] + 8 + (napY - nose[1] - 12) * t} s={0.55} color={K.blood} />
        ))}
        <Blood x={nose[0] + 2} y={napY - 1} s={0.35} />
        <Arrow from={[r.head[0] - 18, r.top - 20]} to={[r.head[0] + 46, r.head[1] + 22]} bend={0.42} />
        <Ok x={288} y={150} />
      </Scene2>
    );
  },

  'yaralanma-burun-sikma': () => (
    // Oturan kişi, baş ÖNE eğik; kendi başparmağı ve işaret parmağı burnun YUMUŞAK alt kısmını sıkıyor.
    <Scene2 bg="closeup">{noseSqueeze(BRN, { x: 116, y: 104, s: 3.4 })}</Scene2>
  ),

  'yaralanma-burun-sure': () => (
    // Aynı kişi aynı tutuşla burnunu sıkmayı sürdürüyor; yanında saat, çeyreği turuncu.
    <Scene2 bg="closeup">
      {noseSqueeze(BRN, { x: 86, y: 100, s: 2.9, arrows: false })}
      <Clock x={246} y={92} r={50} from={0} to={90} />
      <Label x={246} y={170} text="10–15 dk" size={17} />
    </Scene2>
  ),

  /* ── Yanık ── */
  'yaralanma-yanik-yuvarlanma': () => {
    // Giysisi yanan kişi yerde yan yatmış, elleriyle yüzünü kapatıp yuvarlanıyor (gövdeyi saran kavisli ok).
    // Tek fikir: yere yat, yuvarlan. Büyük ölçek, alevler sırtta/kalçada.
    const s = 1.55;
    const v: PersonProps = {
      x: 176, y: 222, s, ...YNK.victim,
      pose: { view: 'front', spine: 180, chest: 182, head: 186, face: 'pain', legB: [2, 4], legF: [-4, 2], footB: -90, footF: -90, armB: [150, 210], armF: [205, 150] },
    };
    const r0 = rig(v);
    const face = hp(r0, [0, 1]);
    const vp: PersonProps = { ...v, pose: { ...v.pose, armB: { to: [face[0] + 4, face[1] + 6] }, armF: { to: [face[0] + 2, face[1] - 6] } } };
    const r = rig(vp);
    const topY = Math.min(r.chest[1], r.back[1]);
    const cx = (r.hip[0] + r.neck[0]) / 2;
    return (
      <Scene2 bg="indoor" gy={128}>
        <Ring cx={cx} cy={r.hip[1] - 4} rx={17} ry={42} part="back" />
        <Person {...vp} />
        <Flame x={cx - 10} y={topY + 5} s={0.55} />
        <Flame x={cx + 14} y={topY + 4} s={0.42} />
        <Flame x={r.hip[0] + 30} y={topY + 8} s={0.34} />
        <Ring cx={cx} cy={r.hip[1] - 4} rx={17} ry={42} part="front" />
      </Scene2>
    );
  },

  'yaralanma-yanik-sogutma': () => {
    const h: HandProps = { x: 252, y: 156, a: 90, s: 1.25, pose: 'open', side: 'R', skin: 1, arm: 240 };
    const sp: P = [160, 70];
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={206} width={320} height={34} fill="#cfd8e0" />
        <rect x={0} y={204} width={320} height={4} fill="#aab6c2" />
        <Faucet sx={sp[0]} sy={sp[1]} />
        <Hand {...h} />
        <Cuff x0={48} y={156} r={16} color={K.role.victim} />
        <Redness x={156} y={152} rx={40} ry={10} />
        <Stream a={[sp[0], sp[1] + 2]} b={[sp[0] + 1, 138]} />
        <path d="M150 140Q136 146 132 170M172 140Q186 148 190 172" fill="none" stroke={K.water} stroke-width={3} stroke-linecap="round" opacity={0.85} />
        <Drop x={128} y={186} s={0.8} />
        <Drop x={196} y={190} s={0.75} />
        <Drop x={162} y={196} s={0.65} />
        <Timer x={238} y={38} r={15} text="20 dk" />
        <Ok x={44} y={46} />
      </Scene2>
    );
  },

  'yaralanma-yanik-strec': () => {
    const h: HandProps = { x: 256, y: 158, a: 90, s: 1.25, pose: 'open', side: 'R', skin: 1, arm: 240 };
    const film = 'M88 132Q120 128 156 131T228 130L230 180Q196 184 160 181T90 182Z';
    const hl = place({ a: 165, s: 0.8, pose: 'press', side: 'R', skin: YNK.helper.skin, arm: 140, sleeve: K.role.helper }, 'tip', [96, 136]);
    const hr = place({ a: 195, s: 0.8, pose: 'press', side: 'L', skin: YNK.helper.skin, arm: 140, sleeve: K.role.helper }, 'tip', [222, 134]);
    return (
      <Scene2 bg="closeup">
        <Hand {...h} />
        <Cuff x0={52} y={158} r={16} color={K.role.victim} />
        <Redness x={158} y={155} rx={40} ry={10} />
        <Film d={film} />
        <path d="M104 142L126 140M190 172L214 170" stroke="#fff" stroke-width={2.2} stroke-linecap="round" opacity={0.9} />
        <Hand {...hl} />
        <Hand {...hr} />
        {/* streç film rulosu */}
        <g>
          <OG sh={[{ d: rrect(30, 200, 92, 24, 11), f: '#e6f3fa' }, { d: ell([30, 212], 6, 12), f: '#d9b98a' }, { d: ell([30, 212], 2.6, 5.5), f: shade('#d9b98a', 0.3), no: true }]} />
          <path d="M44 205H112" stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.9} />
          <path d="M122 214Q132 220 140 214" fill="none" stroke="#7fb6d6" stroke-width={1.6} />
        </g>
        <Arrow from={[132, 104]} to={[192, 104]} w={5} />
      </Scene2>
    );
  },

  'yaralanma-yanik-ortme': () => coverScene(YNK, 'pain'),

  /* ── Kırık ── */
  'yaralanma-kirik-acik-yara': () => {
    const sk = K.skin[2];
    const leg = 'M-10 112C40 110 90 112 140 118C190 124 230 126 262 128C276 128 284 122 288 104C292 86 296 70 304 66C316 62 322 74 320 90C318 112 306 140 292 156C278 168 262 166 246 164C200 160 140 176 90 186C50 192 18 186 -10 182Z';
    const hL = place({ a: 172, s: 0.92, pose: 'press', side: 'R', skin: 0, arm: 160, sleeve: K.role.helper }, 'tip', [96, 122]);
    const hR = place({ a: 186, s: 0.92, pose: 'press', side: 'L', skin: 0, arm: 160, sleeve: K.role.helper }, 'tip', [212, 132]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: leg, f: sk }, { d: 'M-10 108H34V186H-10Z', f: K.pants.denim }, { d: 'M34 108V186', st: shade(K.pants.denim, 0.3), sw: 2 }, { d: 'M60 176Q110 166 150 168', st: shade(sk, 0.18), sw: 1.4 }]} />
        <Blood x={152} y={130} s={0.7} />
        <Cloth x={154} y={126} w={64} h={26} a={4} />
        <path d="M140 122Q150 114 160 120" fill="none" stroke={shade(K.cloth, 0.2)} stroke-width={1.4} />
        <circle cx={162} cy={130} r={4} fill={K.blood} opacity={0.6} />
        <Hand {...hL} />
        <Hand {...hR} />
        {/* kemik ucu bezin ortasından çıkıyor; tam üstüne kırmızı ✗'li ok: buraya bastırma */}
        <OG sh={[{ d: smooth([[150, 132], [149, 116], [154, 106], [162, 104], [166, 112], [164, 132]], false) + 'Z', f: '#f6efdc' }]} />
        <Arrow from={[157, 30]} to={[157, 92]} w={5} color={K.danger} />
        <Bad x={180} y={44} r={13} />
        <Arrow from={[58, 50]} to={[66, 96]} w={5} />
        <Arrow from={[252, 56]} to={[244, 104]} w={5} />
      </Scene2>
    );
  },

  'yaralanma-kirik-atel': () => {
    const s = 1.12;
    const h: HandProps = { x: 226, y: 122, a: 90, s, pose: 'open', side: 'R', skin: KRK.victim.skin, arm: 166, sleeve: undefined };
    const elbow: P = [226 - 166 * s, 122];
    const board = '#c9a06a';
    const ties = [72, 128, 214];
    return (
      <Scene2 bg="floor">
        <OG sh={[{ d: capsule([elbow[0] - 30, -10], 19, elbow, 15), f: K.role.victim }]} />
        <OG sh={[{ d: rrect(26, 92, 240, 60, 5), f: board }, { d: 'M32 100H260M32 144H260', st: shade(board, 0.2), sw: 1.4 }, { d: rrect(30, 96, 232, 52, 3), f: tint(board, 0.12), no: true }]} />
        <Hand {...h} />
        <path d="M168 112l5 6l-5 5l5 6" fill="none" stroke={K.danger} stroke-width={2.4} stroke-linejoin="round" stroke-linecap="round" opacity={0.75} />
        {ties.map((x) => (
          <g key={x}>
            <OG sh={[{ d: rrect(x - 8, 88, 16, 68, 3), f: K.cloth }, { d: `M${x - 8} 100H${x + 8}M${x - 8} 144H${x + 8}`, st: shade(K.cloth, 0.15), sw: 1 }]} />
            <OG sh={[{ d: ell([x, 156], 6, 5), f: K.cloth }, { d: capsule([x - 2, 158], 3, [x - 7, 172], 2.6), f: K.cloth }, { d: capsule([x + 2, 158], 3, [x + 8, 171], 2.6), f: K.cloth }]} />
          </g>
        ))}
        <Ok x={286} y={40} />
      </Scene2>
    );
  },

  'yaralanma-yukari-kaldirma': () => {
    const seat = 224 - 48;
    const pil: P = [270, seat - 18];
    const ank: P = [pil[0] - 4, pil[1] - 28];
    const v = lie({ x: 160, y: seat, s: 1.15, who: 'woman', hair: 'long', hairC: K.hair.auburn, skin: 0 }, { head: 172, chest: 182, face: 'calm', legB: { to: [ank[0] + 2, ank[1]], bend: 1 }, legF: { to: ank, bend: 1 } });
    const r = rig(v);
    const knee = r.kneeF, ak = r.ankleF;
    return (
      <Scene2 bg="indoor">
        <Window x={40} y={26} />
        <Sofa x={8} y={224} w={304} />
        <Pillow x={pil[0]} y={pil[1] + 8} w={58} h={18} color="#e9d9a8" />
        <Pillow x={pil[0]} y={pil[1] - 8} w={54} h={18} color="#f4f1ea" />
        <Pillow x={54} y={seat - 8} w={50} h={18} color="#e9d9a8" />
        <Person {...v} />
        <OG sh={[{ d: capsule(lerp(knee, ak, 0.45), 7.4, lerp(knee, ak, 1.05), 6.6), f: K.cloth }, { d: `M${f1(lerp(knee, ak, 0.62)[0])} ${f1(lerp(knee, ak, 0.62)[1] - 7)}l-2 14M${f1(lerp(knee, ak, 0.82)[0])} ${f1(lerp(knee, ak, 0.82)[1] - 7)}l-2 14`, st: shade(K.cloth, 0.2), sw: 1.1 }]} />
        <Arrow from={[ak[0] - 6, ak[1] - 22]} to={[ak[0] - 6, ak[1] - 70]} />
        <ColdPack x={150} y={228} w={40} h={16} />
      </Scene2>
    );
  },
  'yaralanma-kirik-yukari': () => {
    // kirik-burkulma oyuncusu: sargılı ayak bileği iki yastık üstünde, kalp hizasının üstünde.
    const seat = 224 - 48;
    const pil: P = [270, seat - 18];
    const ank: P = [pil[0] - 4, pil[1] - 28];
    const v = lie({ x: 160, y: seat, s: 1.15, ...KRK.victim }, { head: 172, chest: 182, face: 'neutral', legB: { to: [ank[0] + 2, ank[1]], bend: 1 }, legF: { to: ank, bend: 1 } });
    const r = rig(v);
    const knee = r.kneeF, ak = r.ankleF;
    return (
      <Scene2 bg="indoor">
        <Window x={40} y={26} />
        <Sofa x={8} y={224} w={304} />
        <Pillow x={pil[0]} y={pil[1] + 8} w={58} h={18} color="#e9d9a8" />
        <Pillow x={pil[0]} y={pil[1] - 8} w={54} h={18} color="#f4f1ea" />
        <Pillow x={54} y={seat - 8} w={50} h={18} color="#e9d9a8" />
        <Person {...v} />
        <OG sh={[{ d: capsule(lerp(knee, ak, 0.45), 7.4, lerp(knee, ak, 1.05), 6.6), f: K.cloth }, { d: `M${f1(lerp(knee, ak, 0.62)[0])} ${f1(lerp(knee, ak, 0.62)[1] - 7)}l-2 14M${f1(lerp(knee, ak, 0.82)[0])} ${f1(lerp(knee, ak, 0.82)[1] - 7)}l-2 14`, st: shade(K.cloth, 0.2), sw: 1.1 }]} />
        <Arrow from={[ak[0] - 6, ak[1] - 22]} to={[ak[0] - 6, ak[1] - 70]} />
      </Scene2>
    );
  },

  /* ── Ezilme ── */
  'yaralanma-ezilme-saat-not': () => {
    const v = lie({ x: 172, y: 228, s: 1.05, ...EZL.victim }, { face: 'worried', head: 172, armB: [-6, -10], armF: [8, 4] });
    const nb: P = [58, 158];
    const hp0: PersonProps = { x: 56, y: 206, s: 1.05, ...EZL.helper, pose: { ...POSE.kneelSit, spine: -84, head: -40, face: 'speak', armB: { to: [nb[0] + 4, nb[1] + 18] }, armF: { to: [nb[0] + 32, nb[1] + 18] } } };
    const rh0 = rig(hp0);
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <OG sh={[{ d: 'M206 200V92L222 84L236 100L250 80L268 96L290 74L306 92L320 86V200Z', f: '#cdb89a' }]} />
        <g stroke={shade('#cdb89a', 0.3)} stroke-width={1.3}>
          <path d="M206 120H320M206 144H320M206 168H320M232 120V144M262 144V168M290 120V144M246 168V200M300 168V200M250 98V120" />
        </g>
        <Person {...hp0} mid={() => <g><Notebook x={nb[0]} y={nb[1]} w={36} h={22} /></g>} />
        <Waves x={rh0.mouth[0] + 8} y={rh0.mouth[1]} a={20} n={2} r={6} />
        <Timer x={40} y={36} r={15} text="14:20" />
        <Person {...v} />
        <OG sh={[{ d: 'M184 230L188 198L206 188L232 192L246 180L272 186L300 178L320 182V240H176Z', f: '#b3aea4' }, { d: 'M200 212l16 -4l10 8M240 202l18 2l6 10M286 198l14 6', st: shade('#b3aea4', 0.35), sw: 1.6 }]} />
        <OG sh={[{ d: rrect(206, 180, 40, 18, 2), f: '#cdb89a', t: 'rotate(-12 226 189)' }, { d: rrect(260, 172, 34, 16, 2), f: '#cdb89a', t: 'rotate(10 277 180)' }]} />
      </Scene2>
    );
  },
  'yaralanma-ezilme-bekleme': () => {
    // Bacağı beton parçasının altında; yardımcı yükü kaldırmıyor, yanında diz çökmüş, elini omzuna koyup konuşuyor.
    const vp = lie({ x: 150, y: 228, s: 1.05, ...EZL.victim }, { face: 'worried', head: 172 });
    const rv = rig(vp);
    const helper: PersonProps = { x: rv.head[0] - 6, y: 214, s: 1.05, ...EZL.helper, pose: { ...POSE.kneelSit, spine: -74, chest: -62, head: -50, face: 'speak', armF: { to: [rv.shoulderF[0] + 4, rv.shoulderF[1] - 6] }, handF: 'flat', armB: [80, 30] } };
    const rh = rig(helper);
    const team = (x: number) => <Person x={x} y={182} s={0.5} flip who="man" role="helper2" pose={{ ...POSE.walk, armF: [60, 20], armB: [100, 70] }} />;
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {team(256)}
        {team(286)}
        <Person {...helper} />
        <Person {...vp} />
        <Waves x={rh.mouth[0] + 8} y={rh.mouth[1] - 2} a={20} n={2} r={6} />
        <Slab x={258} y={234} w={124} h={46} a={-3} />
        <No x={262} y={214} r={16} />
      </Scene2>
    );
  },
  'yaralanma-ezilme-ortme': () => coverScene(EZL, 'worried'),
  'yaralanma-ezilme-kpr': () => cprScene(EZL),
  /* ── Başa darbe ── */
  'yaralanma-bas-boyun-sabitleme': () => headHold(BAS, 1.5, 214),
  'yaralanma-omurga-bas-tutma': () => headHold(OMR, 1.3, 200),
  'yaralanma-bas-dinlenme': () => {
    // Spor kıyafetli genç kanepede arkasına yaslanmış dinleniyor; elleri kucağında, soğuk paket YOK.
    const s = 1.25;
    const base: PersonProps = { x: 124, y: 226, s, ...BAS.victim, pose: { ...POSE.sitChair, spine: -104, chest: -100, head: -92, face: 'neutral' } };
    const r0 = rig(base);
    const lap: P = [r0.hip[0] + 22 * s, r0.hip[1] - 5 * s];
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [lap[0] + 4, lap[1]] }, armB: { to: [lap[0] - 2, lap[1] - 1] } } };
    const r = rig(p);
    const adult: PersonProps = { x: 192, y: 230, s: 1.12, flip: true, ...BAS.helper, pose: { ...POSE.standSide, spine: -80, chest: -66, head: -62, armF: { to: [r.shoulderF[0] + 2, r.shoulderF[1] - 3] }, handF: 'flat', face: 'calm' } };
    return (
      <Scene2 bg="indoor">
        <Window x={238} y={34} />
        <Sofa x={14} y={222} w={176} color="#8c9b6c" />
        <Pillow x={64} y={160} w={40} h={30} color="#e9d9a8" />
        <Person {...adult} />
        <Person {...p} />
        <g>
          <OG sh={[{ d: circ([282, 216], 15), f: '#fff' }]} />
          <path d="M282 209l6 4l-2 7h-8l-2 -7z" fill={K.ink} />
          <path d="M282 201v8M288 213l8 -3M286 220l5 7M278 220l-5 7M276 213l-8 -3" stroke={K.ink} stroke-width={1.2} />
        </g>
      </Scene2>
    );
  },
  'yaralanma-bas-refakat': () => {
    // Gece; genç yatakta uyuyor, yetişkin yanında sandalyede oturmuş ona bakıyor, elinde 112'ye hazır telefon.
    // Sahne 1.25 kat büyütülerek çizilir (figürler yüksekliğin büyük kısmını doldursun).
    const v = lie({ x: 228, y: 188, s: 0.95, ...BAS.victim }, { head: 172 });
    const sit: PersonProps = { x: 96, y: 226, s: 1.08, ...BAS.helper, pose: { ...POSE.sitChair, spine: -82, head: -58, face: 'neutral', armF: { to: [130, 170] }, armB: { to: [124, 174] } } };
    const r = rig(sit);
    return (
      <Scene2 bg="indoor" wall="#3f4a6b">
        <g transform="translate(-62 -46) scale(1.25)">
          <Window x={150} y={40} w={56} h={46} view="night" />
          <Bed x={148} y={226} w={168} blanket="#6c84b8" />
          <Person {...v} />
          <Blanket x1={198} x2={318} y={194} h={24} color="#6c84b8" />
          <Chair x={r.hip[0] - 2} y={226} seat={226 - (r.hip[1] + 8)} />
          <Person {...sit} over={(q) => <Phone x={q.handF[0] + 2} y={q.handF[1] - 4} s={0.3} a={-70} text="112" />} />
        </g>
        <Timer x={40} y={36} r={15} text="24 sa" />
      </Scene2>
    );
  },

  /* ── Omurga ── */
  'yaralanma-omurga-kimildatma': () => {
    // Yaralı olduğu yerde yatıyor (yakın plan); yardımcı başın arkasında topukları üstüne diz çökmüş, "kıpırdama" diyor.
    // Sağ üstte küçük kare: iki kişinin yaralıyı kaldırmaya uzanması kırmızı yasakla çizili.
    const S = 1.42;
    const v = lie({ x: 214, y: 232, s: S, ...OMR.victim }, { face: 'worried', head: 174 });
    const rv = rig(v);
    const helper: PersonProps = { x: rv.head[0] - 48 * S, y: 234, s: S, ...OMR.helper, pose: { ...POSE.kneelSit, spine: -82, chest: -72, head: -50, legB: [8, 180], legF: [4, 178], armF: [96, 24], armB: [92, 28], face: 'speak' } };
    const hr = rig(helper);
    return (
      <Scene2 bg="indoor" gy={150}>
        <Person {...helper} />
        <Person {...v} />
        <Waves x={hr.mouth[0] + 10} y={hr.mouth[1] + 2} a={20} n={2} r={6} />
        <Panel x={170} y={12} w={138} h={100} bg={K.wall}>
          <rect x={0} y={180} width={320} height={80} fill={K.floor} />
          <Person {...lie({ x: 176, y: 226, s: 1.3, ...OMR.victim })} />
          <Person x={62} y={226} s={1.3} who="man" role="bystander" pose={{ ...POSE.bend, spine: -22, armF: { to: [96, 204] }, armB: { to: [100, 208] } }} />
          <Person x={286} y={226} s={1.3} flip who="man" role="bystander3" pose={{ ...POSE.bend, spine: -22, armF: { to: [250, 206] }, armB: { to: [246, 210] } }} />
          <No x={160} y={140} r={86} />
        </Panel>
      </Scene2>
    );
  },
  'yaralanma-omurga-tek-parca': () => {
    // Acil taşıma: yaralı bir battaniyenin üstünde; yardımcı başın arkasında çömelmiş, battaniyenin baş tarafını
    // iki eliyle toplamış, yaralıyı vücut ekseni boyunca geriye çekiyor. Baş-gövde-bacak tek parça (yeşil kesik hat).
    const s = 1.25;
    const gy = 230;
    const v = lie({ x: 206, y: gy - 3, s, ...OMR.victim }, { face: 'worried', head: 178 });
    const rv = rig(v);
    const grip: P = [rv.head[0] - 34, gy - 16];
    const helper: PersonProps = {
      x: grip[0] - 46, y: gy, s, ...OMR.helper,
      pose: { ...POSE.crouch, spine: -98, chest: -86, head: -64, armF: { to: grip }, armB: { to: [grip[0] + 2, grip[1] - 4] }, handF: 'fist', handB: 'fist', face: 'neutral' },
    };
    const BL = '#c1554b';
    const sheet = `M${grip[0] - 2} ${grip[1] - 4}Q${rv.head[0] - 16} ${gy - 8} ${rv.head[0] - 6} ${gy - 4}H${rv.toeF[0] + 12}V${gy + 3}H${rv.head[0] - 8}Q${rv.head[0] - 20} ${gy + 2} ${grip[0] - 2} ${grip[1] + 6}Z`;
    const y0 = rv.hip[1] - 5;
    return (
      <Scene2 bg="indoor">
        <Person {...helper} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <OG sh={[{ d: sheet, f: BL }, { d: `M${rv.head[0] + 30} ${gy - 1}H${rv.toeF[0] + 4}`, st: shade(BL, 0.25), sw: 1.4 }]} />
        <Person {...v} />
        <Person {...helper} only={['armF']} />
        <path d={`M${f1(rv.head[0] - 16)} ${f1(y0)}H${f1(rv.toeF[0] + 10)}`} stroke={K.safe} stroke-width={3} stroke-dasharray="9 7" stroke-linecap="round" />
        <Arrow from={[rv.hip[0] + 70, rv.hip[1] - 60]} to={[rv.hip[0] - 40, rv.hip[1] - 60]} w={6} />
      </Scene2>
    );
  },
  'yaralanma-omurga-ortme': () => coverScene(OMR, 'worried'),
  'yaralanma-omurga-kpr': () => cprScene(OMR),
  /* ── Göz ── */
  'yaralanma-goz-yikama': () => {
    // Baş, yaralı göz (ekranın sağındaki göz) tarafına belirgin yana eğik; yaralı göz aşağıda.
    // Yardımcı başparmak ve işaret parmağıyla kapakları açık tutuyor; sürahiden ince, yumuşak akış
    // iç köşeye (burun tarafı) düşüyor, dış köşeden yanağa ve lavaboya akıyor; sağlam göz yukarıda, kuru.
    const p: PersonProps = { x: 132, y: 116, ax: 'head', ay: 'head', s: 3.6, ...GOZ.victim, pose: { ...POSE.stand, spine: -80, chest: -70, head: -42, face: 'worried' } };
    const r = rig(p);
    const eye = hp(r, [4.4, 0.4]);
    const inner = hp(r, [2.2, 0.2]);
    const outer = hp(r, [8.6, 1.6]);
    const jaw = hp(r, [11, 9]);
    // Yardımcının eli başın dış-üst yanından gelir: işaret parmağı üst kapağı yukarı, başparmak alt kapağı aşağı çeker.
    const k = r.headR / 12;
    const sk = K.skin[GOZ.helper.skin ?? 2];
    const palmC = hp(r, [19, -9]);
    const armEnd = hp(r, [36, -46]);
    const idxA = hp(r, [16, -9]), idxB = hp(r, [10, -5.8]), idxT = hp(r, [5, -3.6]);
    const thA = hp(r, [17.5, -5]), thB = hp(r, [11, 4.2]), thT = hp(r, [5.6, 4.3]);
    const lidHand = (
      <g>
        <OG sh={[{ d: capsule(palmC, 3.6 * k, armEnd, 4.2 * k), f: sk }, { d: capsule(lerp(palmC, armEnd, 0.45), 4.8 * k, armEnd, 5.2 * k), f: K.role.helper }]} />
        <OG sh={[
          { d: capsule(thA, 1.6 * k, thB, 1.35 * k), f: sk }, { d: capsule(thB, 1.35 * k, thT, 1.15 * k), f: sk },
          { d: ell(palmC, 4.2 * k, 3.8 * k), f: sk },
          { d: capsule(idxA, 1.4 * k, idxB, 1.25 * k), f: sk }, { d: capsule(idxB, 1.25 * k, idxT, 1.1 * k), f: sk },
          { d: capsule(hp(r, [17.5, -12]), 1.4 * k, hp(r, [15, -11.4]), 1.3 * k), f: sk },
          { d: capsule(hp(r, [20, -13]), 1.3 * k, hp(r, [17.6, -13.6]), 1.2 * k), f: sk },
        ]} />
      </g>
    );
    // açık tutulan göz: beyazı ve kızarıklığı görünür
    const eyeOpen = (
      <g>
        <OG sh={[{ d: ell(eye, 3.4 * k, 2.6 * k), f: '#fbeeee' }]} />
        <circle cx={eye[0]} cy={eye[1]} r={1.5 * k} fill="#5a3b2a" />
        <circle cx={eye[0]} cy={eye[1]} r={0.7 * k} fill={K.ink} />
        <ellipse cx={eye[0]} cy={eye[1]} rx={3.4 * k} ry={2.6 * k} fill="#e0605a" opacity={0.18} />
      </g>
    );
    const lip: P = [inner[0] - 16, inner[1] - 66];
    const stream = `M${f1(lip[0])} ${f1(lip[1])}Q${f1(lip[0] + 6)} ${f1(lip[1] + 40)} ${f1(inner[0])} ${f1(inner[1] - 2)}`;
    const run = `M${f1(inner[0] + 1)} ${f1(inner[1] + 2)}Q${f1(eye[0])} ${f1(eye[1] + 5)} ${f1(outer[0])} ${f1(outer[1] + 2)}Q${f1(jaw[0] + 4)} ${f1(jaw[1] - 6)} ${f1(jaw[0] + 8)} ${f1(jaw[1] + 6)}`;
    const sinkY = 206;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M0 196Q160 186 320 196V240H0Z', f: '#f4f8fb' }, { d: 'M70 204Q190 194 300 204Q290 232 190 236Q80 234 70 204Z', f: '#cfd8e0' }]} />
        <Person {...p} only={['torso', 'head']} />
        {eyeOpen}
        <g fill="none" stroke-linecap="round">
          <path d={stream} stroke={K.out} stroke-width={4.4} opacity={0.5} />
          <path d={stream} stroke={K.water} stroke-width={2.8} />
          <path d={run} stroke={K.water} stroke-width={3.4} opacity={0.85} />
          <path d={`M${f1(jaw[0] + 8)} ${f1(jaw[1] + 6)}Q${f1(jaw[0] + 12)} ${f1(jaw[1] + 30)} ${f1(jaw[0] + 10)} ${sinkY - 4}`} stroke={K.water} stroke-width={2.4} stroke-dasharray="5 6" />
        </g>
        <Drop x={jaw[0] + 11} y={sinkY - 14} s={0.7} />
        <Gx x={lip[0] - 43.8} y={lip[1] - 2.4} a={50}>
          <OG sh={[{ d: 'M-18 -26H18L22 20Q22 26 16 26H-16Q-22 26 -22 20Z', f: '#e9f5fb' }, { d: 'M-22 2H22L22 20Q22 26 16 26H-16Q-22 26 -22 20Z', f: K.waterLight, no: true }, { d: 'M18 -26L30 -32L24 -16Z', f: '#e9f5fb' }, { d: 'M-18 -18Q-34 -14 -30 4Q-28 12 -20 12', st: K.out, sw: 4 }]} />
        </Gx>
        <Hand {...place({ a: 70, s: 0.6, pose: 'fist', side: 'R', skin: GOZ.helper.skin, arm: 200, sleeve: K.role.helper }, 'grip', [lip[0] - 43.8 - 19.3, lip[1] - 2.4 - 23])} />
        {lidHand}
        <Label x={276} y={36} text="20 dk" size={16} />
      </Scene2>
    );
  },
  'yaralanma-goz-toz': () => {
    const p: PersonProps = { x: 98, y: 104, ax: 'head', ay: 'head', s: 2.5, ...GOZ.victim, pose: { ...POSE.stand, face: 'pain' } };
    const r = rig(p);
    const eye = hp(r, [4.4, 0.2]);
    const fist = place({ a: -28, s: 0.82, pose: 'fist', side: 'R', skin: GOZ.victim.skin, arm: 200, sleeve: K.role.victim }, 'tip', [eye[0] + 6, eye[1] + 6]);
    const q: PersonProps = { x: 140, y: 130, ax: 'head', ay: 'head', s: 4.4, ...GOZ.victim, pose: { ...POSE.standSide, head: -112, face: 'neutral' } };
    const rq = rig(q);
    const fa = rq.headA + 90; // yüzün baktığı yön
    const qe = hp(rq, [9, -1.2]);
    const c: P = [qe[0] + 22 * Math.cos((fa * Math.PI) / 180), qe[1] + 22 * Math.sin((fa * Math.PI) / 180)];
    const hold = place({ a: -14, s: 1.4, pose: 'hold', side: 'R', skin: GOZ.victim.skin, arm: 200, sleeve: K.role.victim, grip: 30 }, 'grip', [c[0] + 4, c[1] + 4]);
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <Hand {...fist} />
        <No x={eye[0] + 6} y={eye[1] + 4} r={34} />
        <Panel x={196} y={34} w={112} h={150}>
          <Person {...q} only={['torso', 'head']} />
          <Hand {...hold}>
            <Gx x={c[0]} y={c[1]} a={rq.headA}>
              <OG sh={[{ d: 'M-24 -20H24L18 24H-18Z', f: '#e9f5fb' }, { d: 'M-22.5 -10H22.5L18 24H-18Z', f: K.waterLight, no: true }]} ow={2.6} />
            </Gx>
          </Hand>
        </Panel>
        <Ok x={294} y={44} />
      </Scene2>
    );
  },
  'yaralanma-goz-bardak': () => {
    const p: PersonProps = { x: 160, y: 108, ax: 'head', ay: 'head', s: 3.6, ...GOZ.victim, pose: { ...POSE.stand, face: 'closed' } };
    const r = rig(p);
    const eye = hp(r, [4.4, 0.4]);
    const rim = 24, base = 15, up = 40;
    const cx = eye[0] + 2, cy = eye[1] + 4;
    const cupBody = `M${cx - rim} ${cy}L${cx - base} ${cy - up}H${cx + base}L${cx + rim} ${cy}A${rim} ${rim * 0.38} 0 0 1 ${cx - rim} ${cy}Z`;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: smooth([[30, 140], [60, 60], [160, 40], [260, 60], [290, 140], [250, 200], [70, 200]], true), f: '#f4f1ea' }]} />
        <Person {...p} only={['head']} />
        <circle cx={eye[0]} cy={eye[1]} r={9} fill="#f2b8ac" opacity={0.8} />
        <path d={`M${eye[0] - 1} ${eye[1]}L${eye[0] + 4} ${eye[1] - 22}`} stroke="#7b5a3c" stroke-width={3.4} stroke-linecap="round" />
        <path d={cupBody} fill="#fbfaf7" opacity={0.62} />
        <path d={cupBody} fill="none" stroke={K.out} stroke-width={2.2} stroke-linejoin="round" />
        <ellipse cx={cx} cy={cy - up} rx={base} ry={base * 0.36} fill="#f4f1ea" stroke={K.out} stroke-width={2} />
        <OG sh={[{ d: rrect(cx - 7, cy - up - 34, 14, 30, 2), f: '#efe2c0', t: `rotate(-8 ${cx} ${cy - up})` }, { d: rrect(cx - 7, cy + 4, 14, 28, 2), f: '#efe2c0', t: `rotate(10 ${cx} ${cy})` }]} />
        <OG sh={[{ d: 'M-10 196Q80 178 160 186Q240 178 330 196V250H-10Z', f: '#7aa6d6' }, { d: 'M-10 196Q80 178 160 186Q240 178 330 196', st: '#fff', sw: 6 }]} />
      </Scene2>
    );
  },
  /* ── Diş ── */
  'yaralanma-dis-tutma': () => {
    const crown: P = [146, 76];
    const h = place({ a: -76, s: 0.9, pose: 'pinch', side: 'R', skin: DIS.helper.skin, arm: 200, sleeve: K.role.helper }, 'pinch', crown);
    return (
      <Scene2 bg="closeup">
        <Tooth x={140} y={112} s={2.3} a={8} />
        <Hand {...h} />
        <Ok x={72} y={88} r={15} />
        <Bad x={214} y={196} r={15} />
        <path d="M196 196L168 194" stroke={K.danger} stroke-width={3.4} stroke-linecap="round" />
      </Scene2>
    );
  },
  'yaralanma-dis-yerlestirme': () => {
    const sk = K.skin[DIS.victim.skin ?? 1];
    const gap = [148, 172];
    const teeth = [86, 110, 124, 148, 172, 196, 210, 234];
    const tooth: P = [160, 150];
    const h = place({ a: -40, s: 1.15, pose: 'pinch', side: 'R', skin: DIS.helper.skin, arm: 200, sleeve: K.role.helper }, 'pinch', [tooth[0] + 2, tooth[1] + 26]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M-10 -10H330V250H-10Z', f: sk }]} />
        <path d="M128 30Q160 52 192 30" fill="none" stroke={shade(sk, 0.25)} stroke-width={2} />
        <ellipse cx={142} cy={22} rx={9} ry={5} fill={shade(sk, 0.35)} />
        <ellipse cx={178} cy={22} rx={9} ry={5} fill={shade(sk, 0.35)} />
        <OG sh={[{ d: 'M54 116Q86 76 132 74Q160 84 188 74Q234 76 266 116Q240 196 160 200Q80 196 54 116Z', f: '#c96b6b' }, { d: 'M70 112Q100 96 160 96Q220 96 250 112Q232 168 160 172Q88 168 70 112Z', f: '#5a2a33' }, { d: 'M100 156Q160 132 220 156Q200 170 160 172Q120 170 100 156Z', f: '#d9707a', no: true }]} />
        <path d="M78 104Q160 86 242 104L240 112Q160 100 80 112Z" fill="#e58a8f" />
        {teeth.slice(0, -1).map((x, i) => {
          const w = teeth[i + 1] - x;
          if (x === gap[0]) return <rect key={x} x={x + 4} y={100} width={w - 8} height={8} rx={4} fill="#9b2f3a" />;
          return <path key={x} d={rrect(x + 1, 98, w - 2, i === 2 || i === 4 ? 30 : 24, 4)} fill="#fbfaf3" stroke={K.out} stroke-width={1.4} />;
        })}
        <Tooth x={tooth[0]} y={tooth[1] - 2} s={0.8} a={180} />
        <Hand {...h} />
        <Arrow from={[110, 190]} to={[138, 128]} w={5} bend={-0.15} />
        <Panel x={206} y={132} w={104} h={96}>
          {/* alt yüz yakın plan: dudaklar aralık, üst ve alt ön dişler katlanmış beyaz bezi ısırıyor; bez dudaklardan dışarı taşıyor */}
          <rect width={320} height={300} fill={K.skin[1]} />
          <ellipse cx={92} cy={40} rx={30} ry={18} fill={shade(K.skin[1], 0.3)} />
          <ellipse cx={228} cy={40} rx={30} ry={18} fill={shade(K.skin[1], 0.3)} />
          <path d="M110 20Q160 60 210 20" fill="none" stroke={shade(K.skin[1], 0.3)} stroke-width={6} />
          <OG ow={4} sh={[
            { d: 'M40 150Q90 90 160 96Q230 90 280 150Q230 238 160 240Q90 238 40 150Z', f: '#c96b6b' },
            { d: 'M62 150Q110 122 160 124Q210 122 258 150Q210 212 160 214Q110 212 62 150Z', f: '#5a2a33' },
          ]} />
          <OG ow={3} sh={[0, 1, 2, 3].map((i) => ({ d: rrect(98 + i * 31, 120, 29, 34, 6), f: '#fbfaf3' }))} />
          <OG ow={3} sh={[0, 1, 2, 3].map((i) => ({ d: rrect(102 + i * 29, 180, 27, 30, 6), f: '#fbfaf3' }))} />
          <OG ow={4} sh={[
            { d: 'M104 154Q130 148 160 150Q192 148 218 154L220 180Q190 186 160 184Q130 186 102 180Z', f: K.cloth },
            { d: 'M108 167H214', st: shade(K.cloth, 0.2), sw: 4 },
            { d: 'M138 182Q132 222 146 262L190 260Q178 222 184 182Z', f: K.cloth },
            { d: 'M150 196Q148 226 158 254', st: shade(K.cloth, 0.2), sw: 4 },
          ]} />
        </Panel>
      </Scene2>
    );
  },

  'yaralanma-dis-sut': () => (
    // Yakın plan masa: bir bardak sütün içinde diş (kurumasın); yanda kâğıt mendile sarılı kuru diş yasak.
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M-10 196H330V250H-10Z', f: K.wood }, { d: 'M-10 196H330', st: shade(K.wood, 0.25), sw: 2 }]} />
      <Glass x={120} y={202} w={92} h={128} fill={0.8} liquid="#fbfaf3" op={0.95}>
        <g opacity={0.8}>
          <Tooth x={120} y={150} s={1.15} a={160} />
        </g>
      </Glass>
      <Ok x={186} y={66} />
      <OG sh={[{ d: 'M216 196L226 160L278 154L292 192Z', f: '#f4f1ea' }, { d: 'M226 160L250 174L278 154', st: shade(K.cloth, 0.2), sw: 1.4 }]} />
      <Tooth x={254} y={178} s={0.6} a={70} dry />
      <No x={254} y={172} r={34} />
    </Scene2>
  ),

  'yaralanma-agiz-bastirma': () => {
    const p: PersonProps = { x: 160, y: 98, ax: 'head', ay: 'head', s: 2.9, ...DIS.victim, pose: { ...POSE.stand, face: 'worried' } };
    const r = rig(p);
    const lip = hp(r, [0, 9]);
    const cheek = hp(r, [-10, 4]);
    const press = place({ a: -12, s: 0.82, pose: 'press', side: 'R', skin: DIS.victim.skin, arm: 200, sleeve: K.role.victim }, 'tip', [lip[0] + 6, lip[1] + 4]);
    const pk: P = [cheek[0] - 14, cheek[1] + 2];
    const pack = place({ a: 24, s: 0.8, pose: 'press', side: 'L', skin: DIS.victim.skin, arm: 200, sleeve: K.role.victim }, 'tip', [pk[0] - 4, pk[1] + 4]);
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <circle cx={lip[0] + 2} cy={lip[1] - 1} r={3} fill={K.blood} />
        <Cloth x={lip[0] + 2} y={lip[1] + 3} w={30} h={14} a={-4} />
        <circle cx={lip[0] - 4} cy={lip[1] + 1} r={2.6} fill={K.blood} opacity={0.7} />
        <Hand {...press} />
        <Hand {...pack} />
        <ColdPack x={pk[0]} y={pk[1] - 8} w={46} h={26} a={-76} />
        <Timer x={232} y={40} r={15} text="10 dk" />
      </Scene2>
    );
  },
  /* ── Göğüs ── */
  'yaralanma-gogus-yari-oturur': () => {
    const v: PersonProps = { x: 70, y: 226, s: 1.12, ...GGS.victim, pose: { spine: -116, chest: -104, head: -92, legB: [-12, 50], legF: [-20, 44], armB: { floor: 6 }, face: 'pain' } };
    const rv0 = rig(v);
    const vp: PersonProps = { ...v, pose: { ...v.pose, armF: { to: [rv0.chest[0] + 2, rv0.chest[1] + 2] }, handF: 'flat' } };
    const helper: PersonProps = { x: 226, y: 226, s: 1.1, flip: true, ...GGS.helper, pose: { ...POSE.kneelOne, spine: -84, head: -88, face: 'speak', armF: { at: 'head', d: [2, 8] }, armB: [90, 70] } };
    const rh = rig(helper);
    return (
      <Scene2 bg="indoor">
        <Wall x={0} y={226} w={30} h={170} color="#d9cdb6" />
        <Person {...vp} />
        <Person {...helper} over={() => <Phone x={rh.handF[0] - 1} y={rh.handF[1] - 2} s={0.32} a={8} />} />
        <Label x={276} y={70} text="112" size={18} />
        <Waves x={rh.head[0] - 6} y={rh.head[1] - 24} a={-60} n={3} r={6} />
      </Scene2>
    );
  },
  'yaralanma-gogus-acik-yara': () => {
    // ERC 2025: açık göğüs yarası AÇIK bırakılır. Sol: eski yöntem, üç kenarı bantlı naylon örtü = yasak.
    // Sağ: aynı yara üstü açık, hiçbir şey konmamış = doğru.
    const sk = K.skin[GGS.victim.skin ?? 1];
    const w: P = [160, 160];
    const torso = () => (
      <g>
        <rect x={-10} y={-10} width={340} height={360} fill={sk} />
        <path d="M-10 60Q100 140 200 100Q260 80 330 30" fill="none" stroke={shade(sk, 0.22)} stroke-width={4} />
        {[150, 200, 250, 300].map((y) => <path key={y} d={`M30 ${y}Q160 ${y + 26} 300 ${y - 20}`} fill="none" stroke={shade(sk, 0.1)} stroke-width={4} />)}
        <ellipse cx={w[0]} cy={w[1]} rx={22} ry={12} fill="#8e1f22" stroke={K.out} stroke-width={3} />
        <Blood x={w[0] + 8} y={w[1] + 34} s={1.4} />
      </g>
    );
    const tape = '#dcc48e';
    return (
      <Scene2 bg="closeup">
        <Panel x={12} y={22} w={140} h={156}>
          {torso()}
          <path d={rrect(w[0] - 70, w[1] - 58, 140, 116, 6)} fill="#cfe7f5" opacity={0.7} />
          <path d={rrect(w[0] - 70, w[1] - 58, 140, 116, 6)} fill="none" stroke="#3f84b0" stroke-width={5} />
          <path d={`M${w[0] - 52} ${w[1] - 40}L${w[0] - 20} ${w[1] - 46}M${w[0] + 20} ${w[1] + 44}L${w[0] + 50} ${w[1] + 38}`} stroke="#fff" stroke-width={6} stroke-linecap="round" />
          <OG ow={3.5} sh={[
            { d: rrect(w[0] - 86, w[1] - 72, 172, 30, 3), f: tape },
            { d: rrect(w[0] - 86, w[1] - 72, 30, 150, 3), f: tape },
            { d: rrect(w[0] + 56, w[1] - 72, 30, 150, 3), f: tape },
          ]} />
        </Panel>
        <Panel x={168} y={22} w={140} h={156}>
          {torso()}
          <ellipse cx={w[0]} cy={w[1]} rx={44} ry={32} fill="none" stroke={K.safe} stroke-width={6} stroke-dasharray="12 8" />
        </Panel>
        <rect x={9} y={19} width={146} height={162} rx={11} fill="none" stroke={K.danger} stroke-width={3.5} />
        <Bad x={82} y={206} r={16} />
        <Ok x={238} y={206} r={16} />
      </Scene2>
    );
  },
  'yaralanma-gogus-izle': () => {
    // Göğüs yaralısı duvara yaslanmış, YARI OTURUR; yardımcı yanında diz çökmüş, yüzüne ve dudaklarına bakıyor.
    const v: PersonProps = { x: 84, y: 230, s: 1.34, ...GGS.victim, pose: { spine: -116, chest: -104, head: -92, legB: [-12, 50], legF: [-20, 44], armB: { floor: 6 }, face: 'worried' } };
    const rv0 = rig(v);
    const vp: PersonProps = { ...v, pose: { ...v.pose, armF: { to: [rv0.chest[0] + 2, rv0.chest[1] + 4] }, handF: 'flat' } };
    const rv = rig(vp);
    const lips = rv.mouth;
    const helper: PersonProps = { x: 236, y: 230, s: 1.3, flip: true, ...GGS.helper, pose: { ...POSE.kneelOne, spine: -74, chest: -62, head: -44, face: 'neutral', armF: { to: [rv.kneeF[0] + 8, rv.kneeF[1] - 2] }, handF: 'flat', armB: [100, 70] } };
    const rh = rig(helper);
    return (
      <Scene2 bg="indoor">
        <Wall x={0} y={230} w={34} h={190} color="#d9cdb6" />
        <Window x={150} y={28} w={60} h={50} />
        <Person {...vp} />
        <Person {...helper} />
        <circle cx={lips[0] + 1} cy={lips[1]} r={7.5} fill="none" stroke="#fff" stroke-width={5} opacity={0.8} />
        <circle cx={lips[0] + 1} cy={lips[1]} r={7.5} fill="none" stroke={K.action} stroke-width={3} />
        <path d={`M${f1(rh.head[0] - 14)} ${f1(rh.head[1] - 2)}L${f1(lips[0] + 12)} ${f1(lips[1] + 1)}`} stroke={K.action} stroke-width={2} stroke-dasharray="3 5" stroke-linecap="round" opacity={0.9} />
        <Waves x={rv.chest[0] + 12} y={rv.chest[1] + 6} a={0} n={3} r={6} color={K.water} />
      </Scene2>
    );
  },

  'yaralanma-bas-soguk': () => {
    // Oturan kişi alnının yanındaki şişliğe beze sarılı soğuk paketi kendi eliyle tutuyor; süre etiketi yok.
    const p: PersonProps = { x: 150, y: 112, ax: 'head', ay: 'head', s: 3.2, ...BAS.victim, pose: { ...POSE.stand, head: -96, face: 'worried' } };
    const r = rig(p);
    const k = r.headR / 12;
    const bump = hp(r, [-5.6, -8.2]);
    const pack = hp(r, [-12.4, -5.6]);
    const r0 = r;
    const q: PersonProps = { ...p, pose: { ...p.pose, armB: { to: [pack[0] - 2, pack[1] + 10], bend: -1 }, handB: { shape: 'flat', a: 10 } } };
    return (
      <Scene2 bg="indoor">
        <Window x={226} y={30} />
        <Person {...q} only={['torso', 'head']} />
        <OG sh={[{ d: ell(bump, 4.4 * r0.headR / 12, 3.4 * r0.headR / 12), f: '#e9a789' }]} />
        <ellipse cx={bump[0]} cy={bump[1]} rx={7 * k} ry={5.8 * k} fill="none" stroke={K.action} stroke-width={3} stroke-dasharray="7 5" />
        <ColdPack x={pack[0]} y={pack[1]} w={48} h={30} a={-72} />
        <Person {...q} only={['armB']} />
      </Scene2>
    );
  },

  'yaralanma-gogus-kpr': () => cprScene(GGS),

  /* ── Karın ── */
  'yaralanma-karin-diz-bukuk': () => {
    // Yakın plan: sırtüstü yatan yaralı (baş solda), dizler bükük, dizlerin altında rulo battaniye.
    // Yardımcı başın arkasında diz çökmüş, elleri dizlerinde, konuşuyor.
    const s = 1.5;
    const v = lie({ x: 212, y: 230, s, ...KRN.victim }, { face: 'pain', head: 174, legB: [-34, 40], legF: [-38, 42] });
    const rv = rig(v);
    const helper: PersonProps = {
      x: rv.head[0] - 46 * s, y: 232, s, ...KRN.helper,
      pose: { ...POSE.kneelSit, spine: -84, chest: -76, head: -52, legB: [8, 180], legF: [4, 178], armF: [96, 24], armB: [92, 28], face: 'speak' },
    };
    const hr = rig(helper);
    const kx = rv.kneeF[0];
    const ky = 230 - 13 * s;
    return (
      <Scene2 bg="indoor" gy={150}>
        <Person {...helper} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <OG sh={[{ d: capsule([kx - 16, ky], 13 * s, [kx + 6, ky], 13 * s), f: '#c1554b' }, { d: smooth([[kx + 2, ky - 10], [kx + 16, ky - 5], [kx + 14, ky + 9], [kx + 1, ky + 7]], true), f: shade('#c1554b', 0.2), ln: true }]} />
        <Person {...v} />
        <Waves x={hr.mouth[0] + 10} y={hr.mouth[1] + 2} a={20} n={2} r={6} />
        <Ok x={290} y={40} />
      </Scene2>
    );
  },
  'yaralanma-karin-nemli-bez': () => {
    const sk = K.skin[KRN.victim.skin ?? 2];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M30 -10H290L282 200Q160 214 38 200Z', f: sk }, { d: 'M38 196Q160 210 282 196L286 250H34Z', f: K.pants.denim }]} />
        <path d="M60 30Q160 50 260 30" fill="none" stroke={shade(sk, 0.18)} stroke-width={2.4} />
        <ellipse cx={160} cy={160} rx={4} ry={6} fill={shade(sk, 0.3)} />
        <Cloth x={156} y={108} w={120} h={70} a={-3} wet />
        {[[120, 96], [150, 116], [182, 92], [196, 124], [132, 128]].map(([x, y], i) => <Drop key={i} x={x} y={y} s={0.55} />)}
        <Film d="M78 60Q120 54 160 58T238 56L242 156Q200 162 160 158T80 160Z" />
        <path d="M94 74L120 70M200 146L226 142" stroke="#fff" stroke-width={2.4} stroke-linecap="round" />
        <Panel x={226} y={150} w={84} h={78}>
          <rect width={320} height={300} fill={sk} />
          <OG sh={[{ d: smooth([[90, 180], [120, 140], [170, 150], [200, 120], [240, 160], [210, 200], [160, 190], [120, 220]], true), f: '#e7a3a0' }]} ow={4} />
          <Hand x={180} y={330} a={-10} s={2.6} pose="press" side="R" skin={KRN.helper.skin} arm={200} sleeve={K.role.helper} />
          <No x={160} y={150} r={110} />
        </Panel>
      </Scene2>
    );
  },

  'yaralanma-yeme-icme-yasak': () => (
    // Yakın plan: su bardağı ve ekmek dilimi; üstünde büyük yasak işareti. Tek fikir: ağızdan hiçbir şey yok.
    <Scene2 bg="closeup">
      <rect x={0} y={196} width={320} height={44} fill="#cdb38f" />
      <rect x={0} y={194} width={320} height={4} fill={shade('#cdb38f', 0.25)} />
      <Glass x={124} y={198} w={58} h={86} />
      <OG sh={[
        { d: smooth([[172, 198], [170, 168], [180, 146], [204, 138], [228, 146], [238, 168], [236, 198]], false) + 'Z', f: '#d79b54' },
        { d: smooth([[180, 198], [178, 172], [186, 154], [204, 148], [222, 154], [230, 172], [228, 198]], false) + 'Z', f: '#f3e1b8', ln: true },
      ]} />
      <No x={170} y={142} r={86} />
    </Scene2>
  ),
  'yaralanma-karin-ortme': () => coverScene(KRN, 'worried'),

  /* ── Kanama, kopan parça ── */
  'yaralanma-uzuv-ortme': () => coverScene(UZV, 'worried'),
  'yaralanma-kanama-bastirma': () => pressScene({ vSkin: 2, hSkin: 1, pad: [150, 160], hand: [262, 168] }),
  'yaralanma-uzuv-bastirma': () => {
    // Yaralının eli soldan (parmaklar sağa); katlanmış bez parmak köküne konmuş, parmak uçları bezin dışında görünüyor.
    // Yardımcının eldivenli iki eli üst üste, ikisi de yukarıdan paralel geliyor; kollar kesişmez.
    const vs = UZV.victim.skin ?? 2, hs = UZV.helper.skin ?? 1;
    const wrist: P = [112, 172];
    const victim: HandProps = { x: wrist[0], y: wrist[1], a: 90, s: 1.45, pose: 'open', side: 'R', skin: vs, arm: 260 };
    const pad: P = [158, 166];
    const h1 = place({ a: 172, s: 1.1, pose: 'press', side: 'R', skin: hs, arm: 200, sleeve: K.role.helper }, 'tip', [pad[0] - 6, pad[1] + 12]);
    const h2 = place({ a: 184, s: 1.1, pose: 'press', side: 'L', skin: hs, arm: 200, sleeve: K.role.helper }, 'tip', [pad[0] + 10, pad[1] - 2]);
    return (
      <Scene2 bg="closeup">
        <Hand {...victim} />
        <Cuff x0={36} y={wrist[1]} r={17} color={K.role.victim} />
        <Blood x={pad[0] - 8} y={pad[1] + 32} s={0.8} />
        <Drop x={pad[0] + 26} y={pad[1] + 42} s={0.6} color={K.blood} />
        <OG sh={[{ d: rrect(pad[0] - 34, pad[1] - 18, 68, 38, 6), f: K.cloth }, { d: rrect(pad[0] - 32, pad[1] - 24, 64, 12, 5), f: tint(K.cloth, 0.3) }]} />
        <path d={`M${pad[0] - 30} ${pad[1] + 12}Q${pad[0]} ${pad[1] + 18} ${pad[0] + 28} ${pad[1] + 12}`} stroke={K.blood} stroke-width={3} fill="none" opacity={0.7} />
        <Gloved {...h1} />
        <Gloved {...h2} />
        <Arrow from={[70, 40]} to={[70, 90]} w={7} />
      </Scene2>
    );
  },
  'yaralanma-kopan-parca-sarma': () => {
    const c: P = [146, 140];
    const hl = place({ a: 70, s: 0.92, pose: 'pinch', side: 'R', skin: UZV.helper.skin, arm: 160, sleeve: K.role.helper }, 'pinch', [c[0] - 40, c[1] - 6]);
    const hr = place({ a: -70, s: 0.92, pose: 'pinch', side: 'L', skin: UZV.helper.skin, arm: 160, sleeve: K.role.helper }, 'pinch', [c[0] + 40, c[1] - 6]);
    return (
      <Scene2 bg="floor">
        <rect width={320} height={240} fill={K.wood} />
        {[40, 100, 160, 220].map((y) => <rect key={y} y={y} width={320} height={1.6} fill={shade(K.wood, 0.15)} />)}
        <OG sh={[{ d: `M${c[0] - 70} ${c[1] - 30}L${c[0] + 70} ${c[1] - 34}L${c[0] + 76} ${c[1] + 46}L${c[0] - 74} ${c[1] + 50}Z`, f: '#cfe6f2' }]} />
        {[[-50, 30], [-20, 38], [20, 34], [52, 28], [0, -22], [-56, -16]].map(([dx, dy], i) => <Drop key={i} x={c[0] + dx} y={c[1] + dy} s={0.55} />)}
        <Finger x={c[0]} y={c[1] + 6} s={1.3} a={-6} skin={UZV.victim.skin} />
        <OG sh={[{ d: `M${c[0] - 70} ${c[1] - 30}L${c[0] - 36} ${c[1] - 14}L${c[0] - 10} ${c[1] + 16}L${c[0] - 40} ${c[1] + 22}Z`, f: tint('#cfe6f2', 0.3) }]} />
        <Gloved {...hl} />
        <Gloved {...hr} />
        <g>
          <OG sh={[{ d: rrect(244, 116, 40, 92, 8), f: '#f4f8fb' }, { d: rrect(256, 100, 16, 18, 3), f: K.water }, { d: rrect(250, 140, 28, 34, 3), f: '#fff', ln: true }]} />
          <text x={264} y={162} text-anchor="middle" font-size={12} font-weight={700} fill={K.water} font-family="'IBM Plex Sans', system-ui, sans-serif">SF</text>
        </g>
      </Scene2>
    );
  },

  'yaralanma-kopan-parca-buzlu-su': () => {
    const box = rrect(24, 70, 186, 150, 14);
    const bag: P = [118, 148];
    return (
      <Scene2 bg="closeup">
        <path d={box} fill="#e9f5fb" opacity={0.7} />
        <rect x={27} y={96} width={180} height={121} rx={11} fill={K.water} opacity={0.4} />
        <path d="M27 96H207" stroke={K.water} stroke-width={2} />
        {[[46, 120, 10], [44, 196, -12], [72, 204, 18], [190, 116, -8], [188, 196, 14], [160, 206, -6], [100, 206, 8], [130, 202, 22], [60, 160, -20], [178, 158, 12]].map(([x, y, a], i) => <Ice key={i} x={x} y={y} a={a} s={1.1} />)}
        <ellipse cx={bag[0]} cy={bag[1]} rx={52} ry={42} fill={K.waterLight} opacity={0.6} />
        <Bag x={bag[0]} y={bag[1]} w={64} h={56}>
          <Cloth x={bag[0]} y={bag[1] + 6} w={42} h={24} a={-8} />
          <Finger x={bag[0] + 2} y={bag[1] + 6} s={0.8} a={-8} skin={UZV.victim.skin} />
        </Bag>
        <path d={box} fill="none" stroke={K.out} stroke-width={2.4} />
        <path d="M36 82V200" stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.8} />
        <Ok x={196} y={58} />
        <Ice x={252} y={192} s={1.1} a={8} />
        <Ice x={276} y={190} s={1.1} a={-10} />
        <Ice x={264} y={174} s={1.1} a={14} />
        <Finger x={264} y={164} s={0.9} a={-10} skin={UZV.victim.skin} />
        <No x={264} y={176} r={36} />
      </Scene2>
    );
  },

  'yaralanma-kopan-parca-etiket': () => {
    // Yakın plan: buzlu su kabındaki kapalı poşetin üstüne yapıştırılmış etikete el kalemle ad ve saat yazıyor.
    const lbl: P = [140, 170];
    const pt: P = [lbl[0] + 52, lbl[1] + 12];
    const hand = place({ a: 30, s: 1.0, pose: 'hold', side: 'R', skin: UZV.helper.skin, arm: 200, sleeve: K.role.helper, grip: 12 }, 'grip', [pt[0] + 30, pt[1] - 30]);
    const box = rrect(16, 64, 288, 168, 14);
    return (
      <Scene2 bg="closeup">
        <path d={box} fill="#e9f5fb" opacity={0.7} />
        <rect x={19} y={92} width={282} height={137} rx={11} fill={K.water} opacity={0.4} />
        <path d="M19 92H301" stroke={K.water} stroke-width={2} />
        {[[40, 116, 10], [36, 206, -12], [68, 214, 18], [280, 112, -8], [282, 204, 14], [250, 214, -6]].map(([x, y, a], i) => <Ice key={i} x={x} y={y} a={a} s={1.1} />)}
        <Bag x={150} y={150} w={200} h={128}>
          <Cloth x={150} y={116} w={60} h={26} a={-6} />
          <Finger x={152} y={116} s={0.85} a={-6} skin={UZV.victim.skin} />
        </Bag>
        <OG sh={[{ d: rrect(lbl[0] - 62, lbl[1] - 26, 124, 54, 4), f: '#fffdf4' }]} />
        <text x={lbl[0]} y={lbl[1] - 4} text-anchor="middle" font-size={15} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">Ad Soyad</text>
        <text x={lbl[0]} y={lbl[1] + 19} text-anchor="middle" font-size={16} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">14:20</text>
        <path d={box} fill="none" stroke={K.out} stroke-width={2.4} />
        <Hand {...hand}>
          <Pen x={pt[0]} y={pt[1]} a={-50} l={60} />
        </Hand>
      </Scene2>
    );
  },
};
