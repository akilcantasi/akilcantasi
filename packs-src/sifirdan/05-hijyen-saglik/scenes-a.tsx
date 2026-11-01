// Sıfırdan: Hijyen ve sağlık — sahneler (a). Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Arrow, Bad, Blanket, Campfire, Chair, Cloth, HouseExt, Table, Drop, Flame, Hand, K, Label, No, OG, Ok, Person, POSE, Pot, Rock, Scene2, Smoke, Timer, Tree, Waves, Window,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Rig, Sh } from '../../../src/art/kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`}>{children}</g>
);
function handAtP<H extends Omit<HandProps, 'x' | 'y'>>(h: H, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): H & { x: number; y: number } {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - o[0], y: target[1] - o[1] };
}

/* ─────────── paket geneli malzeme renkleri ─────────── */
const SOIL = '#b98d5f';
const SOILD = '#8f6a45';
const DUNG = '#6e4b2f';
const LIME = '#f5f3ec';
const ASH = '#bcb7ad';
const IRON = '#55595f';
const WOOD = K.wood;
const PLANK = '#a8703f';
const GLOVE = '#4f8fd0';
const CLOTH = K.cloth;
const LYE = '#9a6a3a';
const ROPE = '#c8a46a';

/* ─────────── oyuncular (rehber başına sabit) ─────────── */
/** kireç: gözlüklü, ağzı bezli adam */
const KRC = { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black, glasses: true, bottomC: K.pants.dark, sleeve: 'long' } as const;
/** çöp: yeşil gömlekli adam */
const COP = { who: 'man', role: 'bystander3', skin: 1, hairC: K.hair.dark, mustache: true, bottomC: K.pants.brown, sleeve: 'long' } as const;

/** sabun: gözlüklü, eldivenli adam */
const SAB = { who: 'man', role: 'helper', skin: 0, hairC: K.hair.brown, glasses: true, bottomC: K.pants.denim, sleeve: 'long' } as const;
/** çamaşır: başörtülü kadın */
const CAM = { who: 'woman', role: 'bystander2', skin: 1, hair: 'scarf', hairC: '#7aa6d6', bottom: 'longskirt', bottomC: '#5b5f78', sleeve: 'long' } as const;

/** bit: anne (topuz, siyah saç) ve kızı (uzun siyah saç) */
const BIT_ANNE = { who: 'woman', role: 'bystander', skin: 2, hair: 'bun', hairC: K.hair.black, bottomC: K.pants.dark, sleeve: 'long' } as const;
const BIT_KIZ = { who: 'girl', role: 'victim', skin: 2, hair: 'long', hairC: K.hair.black, bottomC: '#5a6fb0' } as const;

/** ateşli hasta: hasta adam ve bakıcı kadın (bakım kapağında da aynı) */
const ATES_H = { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark, bottomC: K.pants.grey } as const;
const ATES_B = { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.brown, bottomC: K.pants.dark, sleeve: 'long', top: K.role.helper } as const;
/** sıvı kaybı: başörtülü anne ve oğlu */
const SIVI_ANNE = { who: 'woman', role: 'bystander4', skin: 2, hair: 'scarf', hairC: '#6c9c5a', bottom: 'longskirt', bottomC: '#4b4f63', sleeve: 'long', top: K.role.bystander4 } as const;
const SIVI_COCUK = { who: 'boy', role: 'victim', skin: 2, hairC: K.hair.black } as const;
/** atel/değnek: koyu tenli adam */
const ATEL = { who: 'man', role: 'victim', skin: 3, hairC: K.hair.black, bottomC: K.pants.khaki } as const;
/** sedye: iki taşıyıcı ve hasta */
const SED_A = { who: 'man', role: 'helper', skin: 1, hairC: K.hair.dark, bottomC: K.pants.denim } as const;
const SED_B = { who: 'man', role: 'helper2', skin: 2, hairC: K.hair.black, bottomC: K.pants.dark } as const;
const SED_P = { who: 'man', role: 'victim', skin: 0, hairC: K.hair.brown } as const;
/** yatalak: yaşlı kadın hasta ve bakıcı adam */
const YAT_H = { who: 'oldwoman', role: 'victim', skin: 1 } as const;
const YAT_B = { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black, bottomC: K.pants.denim, sleeve: 'long' } as const;
/** gebelik: kadın */
const GEBE = { who: 'woman', role: 'bystander', skin: 1, hair: 'long', hairC: K.hair.dark, bottomC: K.pants.navy, sleeve: 'long', top: K.role.bystander } as const;
/** karantina: hasta adam, bakıcı kadın */
const KAR_H = { who: 'man', role: 'victim', skin: 2, hairC: K.hair.black } as const;
const KAR_B = { who: 'woman', role: 'helper', skin: 0, hair: 'ponytail', hairC: K.hair.auburn, bottomC: K.pants.dark, sleeve: 'long' } as const;

/* ─────────── çizim parçaları ─────────── */

/** Mavi eldiven filtresi (Hand'i lastik eldivene çevirir); sahnede bir kez <GloveDefs/> */
const GloveDefs = () => (
  <defs>
    <filter id="hs-glove" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="0.10 0.12 0.04 0 0.04  0.25 0.30 0.10 0 0.12  0.45 0.40 0.15 0 0.30  0 0 0 1 0" />
    </filter>
  </defs>
);
const Gloved = ({ children }: { children: ComponentChildren }) => <g filter="url(#hs-glove)">{children}</g>;

/** Kişinin eline eldiven (bilekten önkol yönünde) */
function GloveOn({ r, k }: { r: Rig; k: 'B' | 'F' }) {
  const s = r.s;
  const wr = k === 'B' ? r.wristB : r.wristF;
  const hd = k === 'B' ? r.handB : r.handF;
  const fa = Math.atan2(hd[1] - wr[1], hd[0] - wr[0]) / R;
  return (
    <OG
      sh={[
        { d: capsule(pol(wr, fa, -5 * s), 4.6 * s, pol(wr, fa, 9 * s), 4.4 * s), f: k === 'B' ? shade(GLOVE, 0.15) : GLOVE },
        { d: capsule(pol(wr, fa, -6 * s), 5 * s, pol(wr, fa, -2 * s), 5 * s), f: tint(GLOVE, 0.2) },
      ]}
    />
  );
}

/** Ağız-burun bezi (yüzün önünde) */
function Mask({ r, c = '#f1efe8' }: { r: Rig; c?: string }) {
  const m = r.mouth;
  const f = r.flip ? -1 : 1;
  const s = r.s;
  return <OG sh={[{ d: `M${m[0] - f * 9 * s} ${m[1] - 7 * s}Q${m[0] + f * 3 * s} ${m[1] - 9 * s} ${m[0] + f * 3.5 * s} ${m[1] - 2 * s}Q${m[0] + f * 3 * s} ${m[1] + 6 * s} ${m[0] - f * 4 * s} ${m[1] + 7 * s}L${m[0] - f * 10 * s} ${m[1] + 2 * s}Z`, f: c }]} />;
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
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff3a8" />
    </g>
  );
}

/** Sopa / dal */
/** Yastık: x,y = alt orta; a = eğim (pozitif: üstü sağa) */
function Pillow({ x, y, w = 38, h = 60, a = 0, c = '#f4f1ea' }: { x: number; y: number; w?: number; h?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[{ d: rrect(-w / 2, -h, w, h, w * 0.32), f: c }, { d: `M${-w / 2 + 6} ${-h / 2}Q0 ${-h / 2 + 4} ${w / 2 - 6} ${-h / 2}`, st: shade(c, 0.14), sw: 1.4 }]} />
    </G>
  );
}

function Stick({ a, b, w = 3.2, c = K.trunk }: { a: P; b: P; w?: number; c?: string }) {
  return <OG sh={[{ d: capsule(a, w, b, w * 0.85), f: c }]} />;
}

/** Çift başlı ölçü oku + etiket */
function Dim({ a, b, text, at, size = 14, w = 3 }: { a: P; b: P; text?: string; at?: P; size?: number; w?: number }) {
  const m = lerp(a, b, 0.5);
  const l = at ?? m;
  return (
    <g>
      <Arrow from={m} to={a} w={w} />
      <Arrow from={m} to={b} w={w} />
      {text && <Label x={l[0]} y={l[1]} text={text} size={size} />}
    </g>
  );
}

/** Ek resim çerçevesi (köşede küçük karşılaştırma). x,y = sol üst */
function Inset({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ComponentChildren }) {
  const id = `hs-in-${Math.round(x)}-${Math.round(y)}-${Math.round(w)}`;
  return (
    <g>
      <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={10} /></clipPath></defs>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#fbfaf7" />
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Toprak kesiti: y'den aşağısı toprak (üstte çim şeridi) */
function Soil({ y, x = 0, w = 320, grass = true, c = SOIL }: { y: number; x?: number; w?: number; grass?: boolean; c?: string }) {
  const dots: P[] = [];
  for (let i = 0; i < 40; i++) dots.push([x + ((i * 53) % w), y + 10 + ((i * 37) % Math.max(10, 240 - y - 12))]);
  return (
    <g>
      <rect x={x} y={y} width={w} height={240 - y} fill={c} />
      {dots.map((d, i) => <ellipse key={i} cx={d[0]} cy={d[1]} rx={i % 3 ? 2.4 : 3.6} ry={i % 3 ? 1.6 : 2.4} fill={shade(c, 0.18)} />)}
      {grass && <rect x={x} y={y - 3} width={w} height={6} fill={K.grass} stroke={K.out} stroke-width={1.2} />}
    </g>
  );
}

/** Taş kuyu (yandan). x = orta, y = zemin */
function Well({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-23, -76, 5, 50, 1.5), f: shade(WOOD, 0.15) },
          { d: rrect(18, -76, 5, 50, 1.5), f: WOOD },
          { d: 'M-31 -70L0 -94L31 -70L27 -67L0 -88L-27 -67Z', f: '#b5563f' },
          { d: rrect(-21, -66, 42, 4, 1.5), f: shade(WOOD, 0.2) },
          { d: 'M0 -64V-50', st: ROPE, sw: 1.6 },
          { d: 'M-6 -50H6L5 -40H-5Z', f: '#8aa0b2' },
          { d: rrect(-26, -30, 52, 30, 3), f: '#b9b4a8' },
          { d: 'M-26 -20H26M-26 -10H26M-12 -30V-20M8 -30V-20M-2 -20V-10M18 -20V-10M-16 -10V0M6 -10V0', st: shade('#b9b4a8', 0.3), sw: 1.2 },
          { d: ell([0, -30], 26, 4.5), f: '#cfcac0' },
          { d: ell([0, -30], 19, 2.6), f: '#3a4b5c', no: true },
        ]}
      />
    </G>
  );
}

/** Tahta tuvalet kulübesi (yandan-önden). x = orta, y = zemin */
function Hut({ x, y, s = 1, c = PLANK }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-25, -72, 50, 72, 1), f: c },
          { d: 'M-12 -72V0M0 -72V0M12 -72V0', st: shade(c, 0.25), sw: 1.2 },
          { d: rrect(-15, -60, 30, 60, 1), f: shade(c, 0.12) },
          { d: 'M-7 -60V0M7 -60V0', st: shade(c, 0.3), sw: 1.1 },
          { d: circ([10, -30], 2.2), f: '#e2c35a' },
          { d: 'M-33 -68L33 -84L34 -77L-32 -61Z', f: '#7d6a58' },
          { d: rrect(-6, -70, 12, 4, 1), f: '#2f2a28', no: true },
        ]}
      />
    </G>
  );
}

/** Plastik bidon (kapaklı, kulplu). x,y = taban ortası, a dönüş */
function Jerry({ x, y, s = 1, a = 0, c = '#e9e3cf', fill = 0 }: { x: number; y: number; s?: number; a?: number; c?: string; fill?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-14 -2V-34Q-14 -40 -8 -40H6L14 -32V-2Q14 0 12 0H-12Q-14 0 -14 -2Z', f: c },
          ...(fill > 0 ? [{ d: `M-14 ${-38 * fill}H14V-2Q14 0 12 0H-12Q-14 0 -14 -2Z`, f: tint(K.water, 0.35), no: true } as Sh] : []),
          { d: 'M-8 -40V-46H6V-40', f: 'none', st: K.out, sw: 2.2 },
          { d: rrect(9, -43, 8, 6, 1.5), f: K.safe, t: 'rotate(45 13 -40)' },
          { d: 'M-9 -30V-8', st: '#fff', sw: 2 },
        ]}
      />
    </G>
  );
}

/** Kapaklı kova (yandan). x,y = taban ortası */
function Pail({ x, y, s = 1, c = '#8aa0b2', lid = true, fillC, ajar }: { x: number; y: number; s?: number; c?: string; lid?: boolean; fillC?: string; ajar?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          ...(lid ? [] : [{ d: 'M-17 -34Q0 -56 17 -34', st: K.out, sw: 2.4 } as Sh]),
          { d: 'M-19 -34H19L15 0H-15Z', f: c },
          { d: 'M8 -34H19L15 0H6Z', f: shade(c, 0.15), no: true },
          { d: 'M-18 -26H18', st: shade(c, 0.3), sw: 1.2 },
          ...(fillC && !lid ? [{ d: ell([0, -34], 19, 4), f: fillC } as Sh] : []),
          ...(lid ? [{ d: rrect(-21, -39, 42, 6, 2), f: shade(c, 0.1), t: ajar ? 'rotate(-14 21 -36)' : undefined } as Sh, { d: rrect(-5, -43, 10, 4, 1.5), f: shade(c, 0.25), t: ajar ? 'rotate(-14 21 -36)' : undefined } as Sh] : []),
        ]}
      />
    </G>
  );
}

/** Leğen (yandan). x,y = taban ortası, w genişlik */
function Basin({ x, y, w = 80, h = 22, c = '#9fb3c4', water = K.water }: { x: number; y: number; w?: number; h?: number; c?: string; water?: string | null }) {
  const hw = w / 2;
  return (
    <OG
      sh={[
        { d: `M${x - hw} ${y - h}H${x + hw}L${x + hw - 8} ${y}H${x - hw + 8}Z`, f: c },
        { d: `M${x + hw * 0.5} ${y - h}H${x + hw}L${x + hw - 8} ${y}H${x + hw * 0.5 - 4}Z`, f: shade(c, 0.14), no: true },
        { d: ell([x, y - h], hw, 5), f: water ?? shade(c, 0.3) },
        { d: rrect(x - hw - 3, y - h - 2, w + 6, 4, 2), f: tint(c, 0.2) },
      ]}
    />
  );
}

/** Demir kazan + altında ateş. x,y = zemin ortası. content: içindeki görünen kısım rengi */
function Cauldron({ x, y, s = 1, boil = true, content = K.water }: { x: number; y: number; s?: number; boil?: boolean; content?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <Campfire x={0} y={0} s={1.1} />
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-30 -4L-24 -30M30 -4L24 -30', st: K.out, sw: 3 },
          { d: 'M-34 -70H34Q36 -36 22 -26Q0 -18 -22 -26Q-36 -36 -34 -70Z', f: IRON },
          { d: 'M14 -70H34Q36 -36 22 -26Q14 -23 8 -22Z', f: shade(IRON, 0.2), no: true },
          { d: ell([0, -70], 34, 6), f: content },
          { d: rrect(-37, -73, 74, 5, 2.5), f: tint(IRON, 0.15) },
        ]}
      />
      {boil && (
        <g>
          <g fill={tint(content, 0.5)}>
            <circle cx={-12} cy={-71} r={2.4} />
            <circle cx={6} cy={-70} r={3} />
            <circle cx={18} cy={-71} r={1.8} />
          </g>
          <g fill="none" stroke="#fff" stroke-width={2.6} stroke-linecap="round" opacity={0.9}>
            <path d="M-14 -80c-5-6 5-9 0-16" />
            <path d="M2 -82c-5-6 5-9 0-16" />
            <path d="M18 -80c-5-6 5-9 0-16" />
          </g>
        </g>
      )}
    </G>
  );
}

/** Çamaşır ipi: iki direk + ip. items: ipte asılı bezler [x, w, h, renk] */
function Line({ x1, x2, y, top, items }: { x1: number; x2: number; y: number; top: number; items: [number, number, number, string][] }) {
  const sag = (xx: number) => top + 6 * Math.sin(((xx - x1) / (x2 - x1)) * Math.PI);
  return (
    <g>
      <Stick a={[x1, y]} b={[x1, top - 8]} w={3.4} />
      <Stick a={[x2, y]} b={[x2, top - 8]} w={3.4} />
      <path d={`M${x1} ${top}Q${(x1 + x2) / 2} ${top + 12} ${x2} ${top}`} fill="none" stroke={K.out} stroke-width={1.6} />
      {items.map(([cx, w, h, c], i) => {
        const t = sag(cx);
        return (
          <g key={i}>
            <OG sh={[{ d: `M${cx - w / 2} ${t}H${cx + w / 2}L${cx + w / 2 + 1} ${t + h}Q${cx} ${t + h + 3} ${cx - w / 2 - 1} ${t + h}Z`, f: c }, { d: `M${cx - w / 2 + 3} ${t + h * 0.35}H${cx + w / 2 - 3}`, st: shade(c, 0.14), sw: 1.1 }]} />
            <rect x={cx - w / 2 + 2} y={t - 3} width={3} height={7} rx={1} fill="#c99b5a" stroke={K.out} stroke-width={1} />
            <rect x={cx + w / 2 - 5} y={t - 3} width={3} height={7} rx={1} fill="#c99b5a" stroke={K.out} stroke-width={1} />
          </g>
        );
      })}
    </g>
  );
}

/** Sinek (küçük). x,y merkez */
function Fly({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <ellipse cx={-1} cy={-4} rx={4} ry={2.4} fill="#e6eef5" stroke={K.out} stroke-width={0.8} transform="rotate(-30 -1 -4)" />
      <ellipse cx={3} cy={-4} rx={4} ry={2.4} fill="#e6eef5" stroke={K.out} stroke-width={0.8} transform="rotate(30 3 -4)" />
      <ellipse cx={0} cy={0} rx={4.4} ry={3} fill="#2b2d3a" />
      <circle cx={4} cy={-0.5} r={2.2} fill="#7a2a22" />
    </G>
  );
}

/** Fare (yandan, sağa bakar). x,y = taban ortası */
function Mouse({ x, y, s = 1, flip }: { x: number; y: number; s?: number; flip?: boolean }) {
  const c = '#8b8580';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-18 -6Q-34 -4 -38 6" fill="none" stroke={K.out} stroke-width={2.6} stroke-linecap="round" />
      <path d="M-18 -6Q-34 -4 -38 6" fill="none" stroke="#c99b9b" stroke-width={1.4} stroke-linecap="round" />
      <OG
        sh={[
          { d: 'M-20 0Q-22 -18 -2 -18Q14 -18 20 -6L24 -3Q22 0 18 0Z', f: c },
          { d: ell([6, -17], 5, 5), f: tint(c, 0.15) },
          { d: ell([6, -17], 2.6, 2.6), f: '#d9a6a6', no: true },
        ]}
      />
      <circle cx={15} cy={-9} r={1.4} fill={K.ink} />
      <circle cx={24} cy={-3} r={1.3} fill="#d07070" />
    </g>
  );
}

/** Kazma küreği. tip = ağzın ucu, top = sapın üst ucu */
function Shovel({ tip, top, load }: { tip: P; top: P; load?: string }) {
  const a = Math.atan2(top[1] - tip[1], top[0] - tip[0]) / R;
  const b0 = pol(tip, a, 26);
  const bl = (o: number, l: number) => pol(pol(tip, a, l), a + 90, o);
  const blade = `M${bl(-10, 4).join(' ')}Q${bl(-11, 20).join(' ')} ${bl(-5, 26).join(' ')}L${bl(5, 26).join(' ')}Q${bl(11, 20).join(' ')} ${bl(10, 4).join(' ')}Q${tip.join(' ')} ${bl(-10, 4).join(' ')}Z`;
  return (
    <g>
      <OG sh={[{ d: capsule(b0, 2.6, top, 2.4), f: WOOD }, { d: blade, f: K.metal }]} />
      {load && <OG sh={[{ d: ell(bl(0, 13), 9, 6), f: load }]} />}
    </g>
  );
}

/** Kum/çöp parçası benekleri (kesitlerde) */
function Bits({ x, y, w, h, cols, n = 14, seed = 1 }: { x: number; y: number; w: number; h: number; cols: string[]; n?: number; seed?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = i * 7 + seed * 13;
        const cx = x + 6 + ((k * 37) % Math.max(1, w - 12));
        const cy = y + 3 + ((k * 23) % Math.max(1, h - 6));
        return <rect key={i} x={cx - 4} y={cy - 2.5} width={8 + (k % 3) * 2} height={5} rx={1.5} fill={cols[i % cols.length]} stroke={K.out} stroke-width={0.8} transform={`rotate(${(k * 29) % 60 - 30} ${cx} ${cy})`} />;
      })}
    </g>
  );
}

/** Raf (duvarda). x = sol, y = raf üstü */
function Shelf({ x, y, w }: { x: number; y: number; w: number }) {
  return <OG sh={[{ d: rrect(x, y, w, 7, 1.5), f: WOOD }, { d: `M${x + 12} ${y + 7}L${x + 12} ${y + 24}L${x + 28} ${y + 7}Z`, f: shade(WOOD, 0.2) }, { d: `M${x + w - 12} ${y + 7}L${x + w - 12} ${y + 24}L${x + w - 28} ${y + 7}Z`, f: shade(WOOD, 0.2) }]} />;
}

/** Cam kavanoz (kapaklı). x,y taban ortası; içerik rengi */
function GlassJar({ x, y, w = 30, h = 38, fillC = '#e8c77a', level = 0.75, lid = '#c6574e' }: { x: number; y: number; w?: number; h?: number; fillC?: string; level?: number; lid?: string }) {
  const hw = w / 2;
  return (
    <OG
      sh={[
        { d: rrect(x - hw, y - h, w, h, 5), f: '#e3f0f5' },
        { d: `M${x - hw} ${y - h * level}H${x + hw}V${y - 5}Q${x + hw} ${y} ${x + hw - 5} ${y}H${x - hw + 5}Q${x - hw} ${y} ${x - hw} ${y - 5}Z`, f: fillC, no: true },
        { d: rrect(x - hw - 1, y - h - 7, w + 2, 8, 2), f: lid },
        { d: `M${x - hw + 5} ${y - h + 6}V${y - 8}`, st: '#fff', sw: 2.2 },
      ]}
    />
  );
}

/** Teneke kutu (kapaklı). x,y taban ortası */
function Tin({ x, y, w = 34, h = 40, c = '#a3adb8' }: { x: number; y: number; w?: number; h?: number; c?: string }) {
  const hw = w / 2;
  return <OG sh={[{ d: rrect(x - hw, y - h, w, h, 2), f: c }, { d: rrect(x + hw * 0.3, y - h, hw * 0.7, h, 1), f: shade(c, 0.14), no: true }, { d: `M${x - hw} ${y - h * 0.3}H${x + hw}M${x - hw} ${y - h * 0.7}H${x + hw}`, st: shade(c, 0.3), sw: 1.1 }, { d: rrect(x - hw - 2, y - h - 5, w + 4, 6, 2), f: tint(c, 0.15) }]} />;
}

/** Çuval. x,y taban ortası; open: ağzı açık, döküntü */
function Sack({ x, y, s = 1, c = '#d8c79a', open, spill = '#e8c77a' }: { x: number; y: number; s?: number; c?: string; open?: boolean; spill?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: open ? 'M-22 0Q-28 -26 -18 -42L-24 -50Q-2 -42 22 -50L18 -42Q28 -26 22 0Z' : 'M-22 0Q-28 -26 -16 -42Q-12 -46 -10 -52L10 -52Q12 -46 16 -42Q28 -26 22 0Z', f: c },
          { d: open ? ell([-1, -45], 17, 4) : rrect(-12, -50, 24, 4, 2), f: open ? spill : ROPE },
          { d: 'M-8 -30Q0 -26 8 -30', st: shade(c, 0.25), sw: 1.2 },
        ]}
      />
      {open && <OG ow={1.5 / s} sh={[{ d: 'M18 0Q30 -6 44 0Z', f: spill }]} />}
    </G>
  );
}

/** Sprey şişe. x,y taban ortası, a dönüş */
function Sprayer({ x, y, s = 1, a = 0, c = '#6fb7d8' }: { x: number; y: number; s?: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s} a={a}>
      <OG ow={1.5 / s} sh={[{ d: 'M-11 0V-30Q-11 -36 -5 -38H5Q11 -36 11 -30V0Z', f: c }, { d: rrect(-6, -48, 12, 11, 2), f: '#ececec' }, { d: 'M6 -46H16L15 -42H6Z', f: '#ececec' }, { d: 'M-2 -38L-6 -28H2Z', f: '#ececec' }]} />
    </G>
  );
}

/* ════════════════════════ sahneler ════════════════════════ */

/** eğimli arazide zemin y'si (tuvalet-yer / defin-yer) */
const slopeY = (x: number) => 112 + x * 0.3;

export const SCENES: Record<string, () => JSX.Element> = {
  /* ───────── kategori kapakları ───────── */
  'sf-hs-tuvalet-kapak': () => {
    const gy = 196;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d={`M0 ${gy - 30}H96Q130 ${gy - 30} 150 ${gy}H0Z`} fill={K.hill} stroke={K.out} stroke-width={1.2} />
        <Well x={58} y={gy - 30} s={0.7} />
        <Hut x={196} y={gy + 18} s={1.25} />
        <Tippy x={262} y={gy + 22} s={0.9} />
        <Dim a={[82, gy - 46]} b={[160, gy - 46]} text="30 m" at={[121, gy - 66]} />
      </Scene2>
    );
  },
  /* ───────── çukur tuvalet ───────── */
  'sf-hs-tuvalet-yer': () => {
    const s0 = slopeY(0), s1 = slopeY(320);
    return (
      <Scene2 bg="outdoor" gy={236}>
        <path d={`M0 ${s0}L320 ${s1}V240H0Z`} fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <path d={`M0 ${s0 + 6}L320 ${s1 + 6}`} stroke={K.grassShade} stroke-width={3} />
        <Well x={58} y={slopeY(58) + 3} s={1} />
        <Hut x={252} y={slopeY(252) + 4} s={1.05} />
        <Dim a={[96, slopeY(96) - 34]} b={[214, slopeY(214) - 34]} text="30 m" at={[150, slopeY(150) - 60]} />
        <Ok x={290} y={slopeY(290) - 104} />
      </Scene2>
    );
  },

  'sf-hs-tuvalet-kesit': () => {
    const gy = 62, x0 = 130, x1 = 190, bot = 142, wt = 202;
    const stones = (xa: number) => [0, 1, 2, 3].map((i) => <OG key={xa + '-' + i} sh={[{ d: rrect(xa, gy + 2 + i * 10, 9, 9, 2.5), f: i % 2 ? '#aaa59a' : '#bdb8ad' }]} />);
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Soil y={gy} />
        <path d={`M0 ${wt}Q40 ${wt - 4} 80 ${wt}T160 ${wt}T240 ${wt}T320 ${wt}V240H0Z`} fill={K.water} stroke={K.out} stroke-width={1.5} />
        <path d={`M30 ${wt + 14}h18M140 ${wt + 20}h22M250 ${wt + 12}h16`} stroke={K.waterLight} stroke-width={2.4} stroke-linecap="round" />
        <rect x={x0} y={gy - 1} width={x1 - x0} height={bot - gy + 1} fill="#4a3826" stroke={K.out} stroke-width={1.5} />
        {stones(x0)}
        {stones(x1 - 9)}
        <path d={`M30 ${gy}Q46 ${gy - 26} 76 ${gy - 28}Q104 ${gy - 24} 116 ${gy}Z`} fill={SOIL} stroke={K.out} stroke-width={1.5} />
        <Dim a={[222, gy + 2]} b={[222, bot]} text="2 m+" at={[262, (gy + bot) / 2]} />
        <Dim a={[x0 + 1, 44]} b={[x1 - 1, 44]} text="1,5 m" at={[160, 24]} />
      </Scene2>
    );
  },

  'sf-hs-tuvalet-zemin': () => {
    const gy = 150, top = 118;
    const logs = Array.from({ length: 10 }, (_, i) => 79 + i * 18);
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Soil y={gy} />
        <rect x={86} y={gy} width={148} height={90} fill="#4a3826" stroke={K.out} stroke-width={1.5} />
        {[0, 1, 2, 3, 4, 5].map((i) => <OG key={i} sh={[{ d: rrect(i % 2 ? 86 : 225, gy + 4 + i * 14, 9, 12, 2.5), f: '#b5b0a5' }]} />)}
        <path d={`M62 ${gy}Q70 ${top + 4} 88 ${top}H232Q250 ${top + 4} 258 ${gy}Z`} fill={SOILD} stroke={K.out} stroke-width={1.5} />
        {logs.map((x) => <OG key={x} sh={[{ d: circ([x, gy - 9], 9), f: WOOD }, { d: circ([x, gy - 9], 4.5), f: tint(WOOD, 0.25), ln: true }]} />)}
        <OG sh={[{ d: rrect(138, top - 7, 44, 8, 2), f: PLANK }, { d: rrect(154, top - 13, 12, 7, 2), f: shade(PLANK, 0.2) }]} />
        {[[60, 40], [120, 22], [200, 34], [270, 50], [160, 64], [96, 70], [236, 82]].map(([x, y], i) => <Drop key={i} x={x} y={y} s={0.8} />)}
        <Arrow from={[244, top + 6]} to={[284, gy + 12]} w={4.5} color={K.water} />
        <Arrow from={[76, top + 6]} to={[40, gy + 12]} w={4.5} color={K.water} />
        <Dim a={[300, gy]} b={[300, top]} />
        <Label x={286} y={top - 18} text="15 cm" size={14} />
      </Scene2>
    );
  },

  /* ───────── kompost tuvalet ───────── */
  'sf-hs-kompost-iki-hazne': () => {
    const gy = 208, ct = 150;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <OG sh={[{ d: rrect(66, 54, 196, 92, 1), f: tint(PLANK, 0.35) }, { d: 'M58 58L272 40L274 48L60 66Z', f: '#7d6a58' }]} />
        <path d="M100 54V146M140 54V146M180 54V146M220 54V146" stroke={shade(tint(PLANK, 0.35), 0.2)} stroke-width={1.2} />
        <OG sh={[{ d: rrect(48, ct, 224, gy - ct + 4, 2), f: '#b9b4a8' }]} />
        <path d={`M48 ${ct + 18}H272M48 ${ct + 36}H272M80 ${ct}V${ct + 18}M130 ${ct + 18}V${ct + 36}M200 ${ct}V${ct + 18}M240 ${ct + 18}V${ct + 36}`} stroke={shade('#b9b4a8', 0.28)} stroke-width={1.2} />
        <rect x={58} y={ct + 6} width={96} height={gy - ct - 6} fill="#3d2e22" stroke={K.out} stroke-width={1.5} />
        <rect x={166} y={ct + 6} width={96} height={gy - ct - 6} fill="#3d2e22" stroke={K.out} stroke-width={1.5} />
        <path d={`M58 ${ct + 10}H154V${gy}H58Z`} fill={DUNG} />
        <path d={`M58 ${ct + 22}H154M58 ${ct + 36}H154`} stroke={ASH} stroke-width={3} />
        <path d={`M166 ${gy}Q190 ${gy - 30} 214 ${gy - 32}Q240 ${gy - 30} 262 ${gy}Z`} fill={DUNG} stroke={K.out} stroke-width={1.2} />
        <path d={`M178 ${gy - 18}Q214 ${gy - 38} 252 ${gy - 18}`} stroke={ASH} stroke-width={4} fill="none" />
        <OG sh={[{ d: rrect(44, ct - 6, 232, 10, 2), f: '#9c978c' }]} />
        <OG sh={[{ d: rrect(86, ct - 14, 44, 9, 2), f: '#7f7a70' }]} />
        <OG sh={[{ d: rrect(186, ct - 34, 56, 28, 3), f: WOOD }, { d: rrect(184, ct - 38, 60, 6, 3), f: tint(WOOD, 0.2) }]} />
        <OG sh={[{ d: rrect(246, 26, 9, ct - 26, 2), f: '#4e5560' }, { d: rrect(243, 22, 15, 6, 2), f: '#3b4048' }]} />
        <OG sh={[{ d: 'M100 112V104A8 8 0 0 1 116 104V112', st: K.out, sw: 3.4 }, { d: rrect(95, 110, 26, 20, 3), f: '#e2b33a' }, { d: circ([108, 120], 3), f: K.out }]} />
      </Scene2>
    );
  },

  'sf-hs-kompost-idrar': () => {
    const fy = 214;
    return (
      <Scene2 bg="indoor" gy={150}>
        <rect x={40} y={150} width={240} height={90} fill="#3d2e22" />
        <path d={`M60 240Q90 200 128 198Q166 200 190 240Z`} fill={DUNG} stroke={K.out} stroke-width={1.2} />
        <rect x={0} y={146} width={320} height={8} fill="#9c978c" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(70, 86, 170, 62, 3), f: WOOD }, { d: rrect(64, 80, 182, 9, 3), f: tint(WOOD, 0.2) }]} />
        <rect x={104} y={84} width={42} height={70} fill="#2e231b" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: 'M178 84H228L210 112H196Z', f: '#f0c84a' }, { d: rrect(198, 110, 10, 12, 2), f: '#d9a92a' }]} />
        <OG sh={[{ d: 'M203 120Q204 132 228 132H262Q276 132 276 150', st: K.out, sw: 7 }]} />
        <path d="M203 120Q204 132 228 132H262Q276 132 276 150" stroke="#e8e0c8" stroke-width={4} fill="none" />
        <Jerry x={282} y={fy} s={1.3} c="#e9e3cf" />
        <Arrow from={[125, 60]} to={[125, 182]} w={4.5} />
        <Arrow from={[203, 46]} to={[203, 76]} w={5} color="#e2b33a" />
        <Arrow from={[234, 118]} to={[276, 118]} w={4} color="#e2b33a" />
      </Scene2>
    );
  },

  'sf-hs-kompost-agac': () => {
    const gy = 188;
    const fruit: P[] = [[78, 98], [104, 84], [122, 110], [92, 120], [62, 116], [116, 72]];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <path d={`M30 ${gy + 2}Q92 ${gy - 16} 154 ${gy + 2}Z`} fill="#5a3c25" stroke={K.out} stroke-width={1.5} />
        <Tree x={92} y={gy - 2} s={1.25} />
        {fruit.map(([x, y], i) => <OG key={i} sh={[{ d: circ([x, y], 5.5), f: K.red }]} />)}
        <Ok x={150} y={60} />
        <rect x={190} y={gy - 4} width={116} height={14} rx={4} fill="#5a3c25" stroke={K.out} stroke-width={1.5} />
        {[204, 240, 276].map((x) => <OG key={x} sh={[{ d: ell([x, gy - 14], 13, 10), f: '#7cc04f' }, { d: ell([x, gy - 18], 7, 6), f: '#a6dc6e', ln: true }]} />)}
        {[222, 258, 294].map((x) => <g key={x}><OG sh={[{ d: `M${x - 5} ${gy - 6}L${x + 5} ${gy - 6}L${x} ${gy + 14}Z`, f: '#f08a2a' }]} /><path d={`M${x} ${gy - 6}l-6 -16M${x} ${gy - 6}l0 -18M${x} ${gy - 6}l6 -16`} stroke="#3f8a3a" stroke-width={3} stroke-linecap="round" /></g>)}
        <No x={248} y={gy - 18} r={46} />
      </Scene2>
    );
  },

  /* ───────── kireç ───────── */
  'sf-hs-kirec-tanima': () => {
    const lumps: [number, number, number][] = [[-14, -40, 9], [2, -44, 11], [16, -40, 8], [-4, -52, 8], [10, -54, 7], [-18, -48, 6]];
    return (
      <Scene2 bg="closeup">
        <G x={88} y={210} s={1.8}>
          <Pail x={0} y={0} lid={false} c="#9aa6b2" fillC={LIME} />
          {lumps.map(([x, y, r], i) => <OG key={i} ow={1.5 / 1.8} sh={[{ d: `M${x - r} ${y + 2}L${x - r * 0.6} ${y - r * 0.8}L${x + r * 0.4} ${y - r}L${x + r} ${y - r * 0.2}L${x + r * 0.8} ${y + r * 0.6}L${x - r * 0.4} ${y + r * 0.7}Z`, f: i % 2 ? '#ecebe4' : LIME }]} />)}
        </G>
        <G x={232} y={210} s={1.8}>
          <Pail x={0} y={0} lid={false} c="#9aa6b2" fillC={LIME} />
          <OG sh={[{ d: 'M-17 -34Q-12 -50 0 -50Q12 -50 17 -34Z', f: LIME }, { d: 'M-8 -42Q0 -46 8 -42', st: '#d8d4c8', sw: 1.4 }]} />
        </G>
        <path d="M68 70c-5-7 5-11 0-18M88 66c-5-7 5-11 0-18M108 70c-5-7 5-11 0-18" fill="none" stroke={K.danger} stroke-width={3} stroke-linecap="round" />
        <Bad x={140} y={44} r={16} />
        <Ok x={284} y={44} r={16} />
      </Scene2>
    );
  },

  'sf-hs-kirec-sondurme': () => {
    const gy = 202;
    const tip: P = [190, 128], top: P = [116, 100];
    const pr: PersonProps = { ...KRC, x: 90, y: 226, pose: { spine: -78, chest: -70, head: -78, armF: { to: lerp(top, tip, 0.62) }, armB: { to: lerp(top, tip, 0.18) }, legB: [96, 92], legF: [80, 88], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <OG sh={[{ d: 'M150 150H262L254 214H158Z', f: '#9aa6b2' }, { d: 'M226 150H262L254 214H222Z', f: shade('#9aa6b2', 0.15), no: true }, { d: ell([206, 150], 56, 8), f: K.water }, { d: rrect(146, 146, 120, 6, 3), f: tint('#9aa6b2', 0.25) }]} />
        <path d="M184 140c-5-7 5-11 0-18M206 136c-5-7 5-11 0-18M228 140c-5-7 5-11 0-18" fill="none" stroke="#fff" stroke-width={3} stroke-linecap="round" />
        <Person {...pr} back={(r) => <GloveOn r={r} k="B" />} over={(r) => <g><GloveOn r={r} k="F" /><Mask r={r} /></g>} />
        <Shovel tip={tip} top={top} load={LIME} />
        <Arrow from={[200, 132]} to={[206, 148]} w={4} />
        <Inset x={200} y={8} w={112} h={96}>
          <path d="M214 106L226 84L242 78L254 86L268 74L284 82L304 106Z" fill={LIME} stroke={K.out} stroke-width={1.4} />
          <G x={220} y={24} a={120} s={1.1}><Pail x={0} y={0} lid={false} c="#9aa6b2" fillC={K.water} /></G>
          <path d="M255 46q5 14 4 30" stroke={K.water} stroke-width={5} fill="none" stroke-linecap="round" />
          <No x={258} y={58} r={38} />
        </Inset>
      </Scene2>
    );
  },

  'sf-hs-kirec-kova': () => {
    const stickTop: P = [214, 36], stickBot: P = [168, 150];
    const h = handAtP({ a: -158, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 12, arm: 120, sleeve: K.role.helper, skin: 2 }, 'grip', lerp(stickTop, stickBot, 0.12));
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <Sack x={58} y={214} s={1.15} c="#e9e4d4" />
        <OG sh={[{ d: rrect(44, 166, 30, 12, 3), f: '#f2f0e8', t: 'rotate(-8 58 172)' }]} />
        <G x={160} y={220} s={2.4}><Pail x={0} y={0} lid={false} c="#7f9bb3" fillC="#d9d6c8" /></G>
        <Stick a={stickBot} b={stickTop} w={4} c={WOOD} />
        <Gloved><Hand {...h} /></Gloved>
        <Arrow from={[120, 152]} to={[204, 150]} bend={-0.3} w={5} />
        <Timer x={40} y={40} r={16} text="2 saat" />
      </Scene2>
    );
  },

  /* ───────── çöp ───────── */
  'sf-hs-cop-ayirma': () => {
    const gy = 196, by = 222;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <G x={46} y={by} s={1.55}>
          <Pail x={0} y={0} lid={false} c="#6c9c5a" fillC="#5a3c25" />
          <OG ow={1} sh={[{ d: 'M-12 -36q6 -8 12 -2', st: '#f08a2a', sw: 3 }, { d: ell([6, -38], 6, 3), f: '#c8d870' }, { d: ell([-4, -40], 5, 2.6), f: '#e8c040' }]} />
        </G>
        <G x={124} y={by}>
          <OG sh={[{ d: rrect(-34, -50, 68, 50, 3), f: WOOD }, { d: 'M-34 -34H34M-34 -17H34', st: shade(WOOD, 0.3), sw: 1.4 }]} />
          <GlassJar x={-14} y={-46} w={20} h={26} fillC="#e3f0f5" level={0} lid="#c6574e" />
          <Tin x={12} y={-46} w={18} h={22} />
          <OG sh={[{ d: ell([0, -54], 12, 4), f: ROPE }]} />
        </G>
        <G x={202} y={by} s={1.55}>
          <Pail x={0} y={0} lid={false} c="#6d7480" fillC="#4a4e57" />
        </G>
        <Bits x={186} y={152} w={34} h={10} cols={['#d9d0bd', '#a8b2bd', '#c89f6a']} n={5} />
        <G x={280} y={by} s={1.55}>
          <Pail x={0} y={0} lid={false} c={K.danger} fillC="#7a2a22" />
          <OG ow={1} sh={[{ d: rrect(-12, -46, 7, 13, 1.5), f: '#3b3f4b' }, { d: rrect(-12, -46, 7, 4, 1), f: '#e2b33a', no: true }, { d: ell([5, -38], 6, 3.5), f: '#fff' }, { d: 'M5 -41.5V-34.5', st: K.danger, sw: 1.4 }]} />
        </G>
      </Scene2>
    );
  },

  'sf-hs-cop-ortme': () => {
    const gy = 84, x0 = 40, x1 = 252;
    const lay: [number, number, boolean][] = [[200, 240, false], [190, 200, true], [156, 190, false], [146, 156, true], [118, 146, false], [104, 118, true]];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Soil y={gy} />
        <rect x={x0} y={gy} width={x1 - x0} height={160} fill="#4a3826" stroke={K.out} stroke-width={1.5} />
        {lay.map(([a, b, soil], i) => (soil ? <rect key={i} x={x0} y={a} width={x1 - x0} height={b - a} fill={i === 5 ? SOILD : SOIL} stroke={K.out} stroke-width={1} /> : <g key={i}><rect x={x0} y={a} width={x1 - x0} height={b - a} fill="#6b5a4a" /><Bits x={x0} y={a} w={x1 - x0} h={b - a} cols={['#d9d0bd', '#a8b2bd', '#c89f6a', '#9fbf7a']} n={16} seed={i} /></g>))}
        <rect x={x0} y={gy} width={x1 - x0} height={160} fill="none" stroke={K.out} stroke-width={1.5} />
        <path d={`M${x1 + 6} ${gy}Q${x1 + 30} ${gy - 30} ${x1 + 54} ${gy - 26}Q${x1 + 72} ${gy - 20} 320 ${gy}Z`} fill={SOIL} stroke={K.out} stroke-width={1.5} />
        <Shovel tip={[170, 70]} top={[250, 26]} load={SOILD} />
        {[[152, 84], [160, 94], [146, 98], [166, 86]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={SOILD} stroke={K.out} stroke-width={0.8} />)}
        <path d={`M${x0 - 4} 104H${x0 - 14}V118H${x0 - 4}`} stroke={K.out} stroke-width={6.5} fill="none" stroke-linejoin="round" />
        <path d={`M${x0 - 4} 104H${x0 - 14}V118H${x0 - 4}`} stroke={K.action} stroke-width={3.5} fill="none" stroke-linejoin="round" />
        <Label x={52} y={68} text="10 cm" size={14} />
        <Arrow from={[44, 82]} to={[x0 - 18, 108]} w={2.6} />
      </Scene2>
    );
  },

  'sf-hs-cop-yakma-yasak': () => {
    const gy = 176;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Smoke x={70} y={10} w={180} h={64} kind="cloud" color="#3e3f46" op={0.95} />
        <Smoke x={104} y={58} w={112} h={44} kind="cloud" color="#4a4b52" op={0.95} />
        {/* lastik (yatık), içinden alev */}
        <OG sh={[{ d: ell([160, 200], 66, 20), f: '#2b2c31' }, { d: ell([160, 197], 34, 9), f: '#55565c' }]} />
        <path d="M104 200q8 -6 16 0t16 0M184 200q8 -6 16 0t16 0" stroke="#4a4b52" stroke-width={2} fill="none" />
        <Flame x={150} y={196} s={1.45} />
        <Flame x={176} y={198} s={1.0} />
        {/* plastik şişe */}
        <G x={88} y={214} a={-14}><OG sh={[{ d: 'M-24 -9H10Q16 -9 18 -5H26V5H18Q16 9 10 9H-24Q-28 9 -28 5V-5Q-28 -9 -24 -9Z', f: '#bfe0ee' }, { d: rrect(26, -6, 7, 12, 2), f: '#3d7fc4' }]} /></G>
        {/* kablo */}
        <path d="M206 222Q222 206 238 218T270 214" stroke={K.out} stroke-width={7} fill="none" stroke-linecap="round" />
        <path d="M206 222Q222 206 238 218T270 214" stroke="#d64b3c" stroke-width={4} fill="none" stroke-linecap="round" />
        <No x={160} y={142} r={86} />
      </Scene2>
    );
  },

  /* ───────── sinek ve kemirgen ───────── */
  'sf-hs-sinek-kapan': () => {
    const bx0 = 122, bx1 = 198, by0 = 98, by1 = 214;
    return (
      <Scene2 bg="outdoor" gy={226}>
        <OG sh={[{ d: capsule([0, 30], 6, [320, 18], 5), f: K.trunk }]} />
        {[[40, 22], [90, 36], [250, 14], [292, 30]].map(([x, y], i) => <OG key={i} sh={[{ d: ell([x, y], 13, 7), f: K.leaf, t: `rotate(${i % 2 ? 20 : -20} ${x} ${y})` }]} />)}
        <path d={`M${bx0} ${by0}L160 26L${bx1} ${by0}`} fill="none" stroke={K.out} stroke-width={1.6} />
        <OG sh={[{ d: rrect(bx0, by0, bx1 - bx0, by1 - by0, 10), f: '#d9eef8' }]} />
        <path d={`M${bx0 + 1} 176H${bx1 - 1}V${by1 - 10}Q${bx1 - 1} ${by1 - 1} ${bx1 - 10} ${by1 - 1}H${bx0 + 10}Q${bx0 + 1} ${by1 - 1} ${bx0 + 1} ${by1 - 10}Z`} fill="#d9a54a" opacity={0.9} />
        {[[140, 196, '#e8472d'], [168, 200, '#f6c344'], [182, 190, '#9cc94e'], [152, 186, '#e8472d']].map(([x, y, c], i) => <OG key={i} sh={[{ d: ell([x as number, y as number], 7, 5), f: c as string }]} />)}
        <OG sh={[{ d: `M${bx0} ${by0}H${bx1}L168 146H152Z`, f: '#c9e4f2', op: 0.95 }, { d: rrect(150, 144, 20, 8, 2), f: '#b7d6e6' }]} />
        <path d={`M${bx0 + 8} ${by0 + 10}V${by1 - 14}`} stroke="#fff" stroke-width={3} opacity={0.8} />
        <Fly x={110} y={60} s={1.4} a={20} />
        <Fly x={214} y={66} s={1.4} a={-20} />
        <Fly x={158} y={168} s={1.3} />
        <Fly x={176} y={160} s={1.2} a={30} />
        <Arrow from={[118, 70]} to={[148, 112]} w={4} />
        <Arrow from={[206, 76]} to={[172, 112]} w={4} />
      </Scene2>
    );
  },

  'sf-hs-fare-depo': () => (
    <Scene2 bg="indoor" gy={196}>
      <Shelf x={20} y={98} w={190} />
      <Tin x={50} y={98} w={36} h={44} />
      <GlassJar x={100} y={98} w={34} h={44} fillC="#e8c77a" />
      <GlassJar x={148} y={98} w={30} h={40} fillC="#c99b5a" lid="#3d7ad6" />
      <Shelf x={20} y={162} w={190} />
      <Pail x={64} y={162} s={1.2} c="#6c9c5a" />
      <Tin x={136} y={162} w={40} h={40} c="#c6574e" />
      <Sack x={262} y={222} s={1.2} open />
      <Mouse x={222} y={226} s={1.1} />
      <No x={258} y={190} r={46} />
      <Ok x={196} y={36} />
    </Scene2>
  ),

  'sf-hs-fare-temizlik': () => {
    const fy = 198;
    const drops = (x: number) => [0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={x + (i * 13) % 50} cy={fy - 3 - (i % 2) * 3} rx={3.6} ry={1.8} fill="#3b2a20" transform={`rotate(${i * 30} ${x + (i * 13) % 50} ${fy - 3})`} />);
    const h = { a: -30, s: 1.15, pose: 'hold' as const, side: 'R' as const, grip: 22, arm: 140, sleeve: K.role.helper, skin: 2 };
    const g: P = [250, 104];
    const hp = handAtP(h, 'grip', g);
    return (
      <Scene2 bg="closeup">
        <GloveDefs />
        <rect x={0} y={fy} width={320} height={42} fill={K.floor} />
        <rect x={0} y={fy} width={320} height={3} fill={K.floorShade} />
        <rect x={158} y={0} width={4} height={240} fill="#fff" />
        {drops(40)}
        <Stick a={[120, 20]} b={[64, 176]} w={3.4} c={WOOD} />
        <OG sh={[{ d: 'M50 172L82 184L74 200L36 196Z', f: '#d9b860' }]} />
        <Smoke x={20} y={120} w={110} h={50} kind="cloud" color="#a8a39a" op={0.85} />
        <No x={80} y={128} r={58} />
        {drops(200)}
        <Cloth x={268} y={fy - 6} w={40} h={12} wet />
        <g transform={`translate(${g[0]} ${g[1]}) rotate(-30) scale(-1.15 1.15)`}><Sprayer x={0} y={20} /></g>
        <Gloved><Hand {...hp} /></Gloved>
        {[[206, 92], [198, 106], [212, 112], [192, 126], [206, 134], [196, 152], [212, 158], [200, 176]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} fill={K.water} />)}
        <Ok x={296} y={30} />
      </Scene2>
    );
  },
  'sf-hs-temizlik-kapak': () => {
    const gy = 188;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Sun x={276} y={40} r={15} />
        <Line x1={24} x2={228} y={gy + 6} top={66} items={[[60, 36, 40, CLOTH], [108, 34, 46, '#7aa6d6'], [154, 38, 36, CLOTH], [198, 30, 44, '#e3a3a0']]} />
        <Basin x={232} y={226} w={110} h={30} water="#e8f2f8" />
        {[[200, 196], [214, 190], [230, 194], [246, 189], [262, 195], [222, 186]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6 + (i % 3)} fill="#fff" stroke={K.out} stroke-width={1} />)}
        {[[48, 222], [84, 222]].map(([x, y], i) => <OG key={i} sh={[{ d: rrect(x - 16, y - 16, 32, 16, 3), f: '#f3e3a6' }, { d: rrect(x - 16, y - 16, 32, 5, 2), f: tint('#f3e3a6', 0.4), no: true }]} />)}
        <OG sh={[{ d: rrect(50, 190, 32, 16, 3), f: '#f3e3a6' }]} />
      </Scene2>
    );
  },

  /* ───────── el yıkama yeri ───────── */
  'sf-hs-elyikama-bidon': () => {
    const jx = 140, jy = 228, js = 3.1;
    const cap: P = [jx + 12 * js, jy - 46 * js];
    const hole: P = [jx + 14 * js, jy - 28 * js];
    const h = handAtP({ a: -90, s: 1.1, pose: 'pinch' as const, side: 'R' as const, arm: 100, sleeve: K.role.bystander2, skin: 1 }, 'pinch', [hole[0] + 52, hole[1]]);
    return (
      <Scene2 bg="closeup">
        <Jerry x={jx} y={jy} s={js} c="#e9e3cf" />
        <OG sh={[{ d: capsule([hole[0] + 2, hole[1]], 1.6, [hole[0] + 50, hole[1]], 2), f: '#8a919a' }, { d: rrect(hole[0] + 48, hole[1] - 5, 5, 10, 1.5), f: '#6d747d' }]} />
        <circle cx={hole[0] + 4} cy={hole[1]} r={4} fill={K.fire} opacity={0.8} />
        <Hand {...h} />
        <Dim a={[cap[0] + 26, cap[1] + 2]} b={[cap[0] + 26, hole[1] - 2]} w={3} />
        <Label x={cap[0] + 66} y={cap[1] - 12} text="12 cm" size={15} />
      </Scene2>
    );
  },

  'sf-hs-elyikama-pedal': () => {
    const gy = 196, x = 130, y = 228, s = 1.8;
    const pe: P = [x + 18 * s, y - 15 * s];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Tippy x={x} y={y} s={s} soap={false} />
        <Arrow from={[pe[0] + 18, pe[1] - 46]} to={[pe[0] + 4, pe[1] - 6]} w={5} />
        <Dim a={[pe[0] + 34, y]} b={[pe[0] + 34, pe[1]]} w={2.5} />
        <Label x={pe[0] + 72} y={pe[1] + 14} text="15 cm" size={15} />
      </Scene2>
    );
  },

  'sf-hs-elyikama-kullanim': () => {
    const L = { a: 62, s: 1.2, pose: 'press' as const, side: 'L' as const, view: 'palm' as const, arm: 200, sleeve: K.role.bystander2, skin: 1 };
    const Rh = { a: -62, s: 1.2, pose: 'press' as const, side: 'R' as const, view: 'back' as const, arm: 200, sleeve: K.role.bystander2, skin: 1 };
    return (
      <Scene2 bg="closeup">
        <G x={96} y={-14} a={-34}><Jerry x={0} y={60} s={1.6} c="#e9e3cf" fill={0.5} /></G>
        <path d="M128 52Q138 70 142 118" fill="none" stroke={K.water} stroke-width={4} stroke-linecap="round" />
        <Hand x={92} y={196} {...L} />
        <Hand x={228} y={196} {...Rh} />
        {[[150, 136], [164, 128], [176, 140], [144, 152], [184, 126], [158, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 1.5} fill="#fff" stroke={K.out} stroke-width={1} />)}
        <Timer x={226} y={44} r={16} text="20 sn" />
      </Scene2>
    );
  },

  /* ───────── kül suyu ───────── */
  'sf-hs-kul-secim': () => {
    const pile = (x: number, c: string) => <OG sh={[{ d: `M${x - 62} 200Q${x - 40} 150 ${x} 140Q${x + 40} 150 ${x + 62} 200Z`, f: c }]} />;
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={198} width={320} height={42} fill="#d8d0c0" />
        <rect x={158} y={0} width={4} height={240} fill="#fff" />
        {pile(80, '#dcd8cf')}
        {[[60, 180], [92, 170], [104, 188]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill="#9a958c" />)}
        <OG sh={[{ d: capsule([30, 212], 9, [110, 216], 9), f: K.trunk }, { d: circ([110, 216], 9), f: '#d6b285' }]} />
        <Ok x={80} y={44} r={16} />
        {pile(240, '#3a3a3e')}
        <OG sh={[{ d: rrect(206, 152, 30, 13, 5), f: '#cfe6ef', t: 'rotate(-25 221 158)' }, { d: rrect(244, 160, 40, 10, 2), f: '#5a8ad0', t: 'rotate(12 264 165)' }, { d: rrect(266, 150, 8, 22, 2), f: '#e8a0a0', t: 'rotate(30 270 161)' }]} />
        <Bad x={240} y={44} r={16} />
      </Scene2>
    );
  },

  'sf-hs-kul-fici': () => {
    const x0 = 96, x1 = 216, top = 44, bot = 184;
    return (
      <Scene2 bg="closeup">
        <Rock x={110} y={212} s={1.2} />
        <Rock x={204} y={212} s={1.2} />
        <rect x={0} y={210} width={320} height={30} fill="#d8d0c0" />
        <OG sh={[{ d: `M${x0} ${top}H${x1}L${x1 - 6} ${bot}H${x0 + 6}Z`, f: shade(WOOD, 0.15) }]} />
        <path d={`M${x0 + 6} ${bot - 4}H${x1 - 6}L${x1 - 5} ${bot - 30}H${x0 + 5}Z`} fill="#9aa0a6" />
        <Bits x={x0 + 6} y={bot - 30} w={x1 - x0 - 12} h={26} cols={['#c9c4b8', '#8e8a80']} n={14} />
        <path d={`M${x0 + 5} ${bot - 30}H${x1 - 5}L${x1 - 4} ${bot - 54}H${x0 + 4}Z`} fill="#e3c66a" />
        <path d={`M${x0 + 10} ${bot - 34}l10 -16M${x0 + 30} ${bot - 34}l-8 -16M${x0 + 50} ${bot - 34}l10 -16M${x0 + 70} ${bot - 34}l-8 -16M${x0 + 90} ${bot - 34}l10 -16`} stroke="#b9952f" stroke-width={2} />
        <path d={`M${x0 + 4} ${bot - 54}H${x1 - 4}L${x1 - 2} ${top + 18}Q${(x0 + x1) / 2} ${top + 30} ${x0 + 2} ${top + 18}Z`} fill={ASH} />
        <OG sh={[{ d: `M${x0} ${top}H${x1}L${x1 - 6} ${bot}H${x0 + 6}Z`, f: 'none', st: K.out, sw: 3 }]} />
        <path d={`M${x0 + 1} ${top + 26}H${x1 - 1}M${x0 + 3} ${bot - 26}H${x1 - 3}`} stroke={IRON} stroke-width={4} />
        <OG sh={[{ d: rrect(150, bot - 2, 12, 12, 2), f: IRON }]} />
        <G x={156} y={226}><OG sh={[{ d: rrect(-22, -24, 44, 24, 5), f: '#e3f0f5' }, { d: rrect(-22, -12, 44, 12, 5), f: LYE, no: true }]} /></G>
      </Scene2>
    );
  },

  'sf-hs-kul-yumurta': () => {
    const jar = (x: number, egg: number) => (
      <G x={x} y={204}>
        <OG sh={[{ d: rrect(-40, -110, 80, 110, 8), f: '#e3f0f5' }, { d: rrect(-40, -86, 80, 86, 8), f: LYE, no: true, op: 0.92 }]} />
        <OG sh={[{ d: ell([0, egg], 15, 19), f: '#f6efe0', t: `rotate(-12 0 ${egg})` }]} />
        <path d={`M-40 -86H40`} stroke={shade(LYE, 0.2)} stroke-width={2} />
        <path d="M-32 -100V-14" stroke="#fff" stroke-width={3} opacity={0.6} />
      </G>
    );
    return (
      <Scene2 bg="closeup">
        {jar(92, -92)}
        <Ok x={92} y={44} r={16} />
        <Flame x={232} y={226} s={0.6} />
        {jar(232, -20)}
      </Scene2>
    );
  },

  /* ───────── sabun ───────── */
  'sf-hs-sabun-kazan': () => {
    const gy = 200;
    const top: P = [150, 64], bot: P = [214, 134];
    const pr: PersonProps = { ...SAB, x: 100, y: 226, pose: { spine: -82, chest: -76, head: -82, armF: { to: lerp(top, bot, 0.42) }, armB: { to: lerp(top, bot, 0.12) }, legB: [96, 92], legF: [80, 88], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Cauldron x={220} y={222} s={1.15} content="#d8b878" />
        <Stick a={bot} b={top} w={3.4} c={WOOD} />
        <Person {...pr} back={(r) => <GloveOn r={r} k="B" />} over={(r) => <GloveOn r={r} k="F" />} />
        <Arrow from={[184, 146]} to={[256, 146]} bend={-0.32} w={5} />
      </Scene2>
    );
  },

  'sf-hs-sabun-test': () => {
    const plate = (x: number) => <OG sh={[{ d: ell([x, 172], 46, 14), f: '#f6f6f2' }, { d: ell([x, 170], 30, 8), f: '#ecebe4', ln: true }]} />;
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={176} width={320} height={64} fill="#c9a77a" />
        {plate(58)}{plate(160)}{plate(262)}
        <OG sh={[{ d: ell([58, 166], 14, 7), f: '#e2c98a', op: 0.85 }]} />
        <path d="M50 163q6 -3 12 0" stroke="#fff" stroke-width={2} fill="none" />
        {[[150, 166], [160, 162], [170, 167], [156, 170], [166, 172]].map(([x, y], i) => <OG key={i} sh={[{ d: rrect(x - 5, y - 3, 9, 6, 1.5), f: '#f8f6ee' }]} />)}
        <path d="M244 166Q262 156 280 168Q262 176 246 170" fill="none" stroke={K.out} stroke-width={4} stroke-linecap="round" />
        <path d="M244 166Q262 156 280 168Q262 176 246 170" fill="none" stroke="#d9b870" stroke-width={2.4} stroke-linecap="round" />
        <Ok x={58} y={100} r={16} />
        <Drop x={152} y={102} s={1.8} color="#f2d36a" />
        <Label x={176} y={102} text="+" size={18} />
        <Drop x={254} y={102} s={1.8} color={LYE} />
        <Label x={278} y={102} text="+" size={18} />
      </Scene2>
    );
  },

  'sf-hs-sabun-kalip': () => {
    const h = handAtP({ a: -64, s: 1.15, pose: 'hold' as const, side: 'R' as const, grip: 12, arm: 160, sleeve: K.role.helper, skin: 0 }, 'grip', [222, 92]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={188} width={320} height={52} fill="#c9a77a" />
        <OG sh={[{ d: rrect(40, 140, 220, 52, 3), f: WOOD }, { d: rrect(50, 140, 200, 16, 2), f: '#f3e3a6' }]} />
        <path d="M96 140V156M144 140V156M192 140V156" stroke={shade('#f3e3a6', 0.3)} stroke-width={2} />
        <path d="M68 156V140" stroke={K.out} stroke-width={1} />
        <OG sh={[{ d: 'M202 150L196 146L226 92L232 96Z', f: '#c7ced6' }, { d: capsule([229, 94], 4, [252, 52], 4), f: '#5a3f2a' }]} />
        <Hand {...h} />
        <OG sh={[{ d: rrect(30, 70, 120, 6, 2), f: WOOD }]} />
        {[44, 72, 100, 128].map((x) => <OG key={x} sh={[{ d: rrect(x - 11, 54, 22, 16, 3), f: '#f3e3a6' }]} />)}
      </Scene2>
    );
  },

  /* ───────── çamaşır ───────── */
  'sf-hs-camasir-ayirma': () => (
    <Scene2 bg="indoor" gy={170}>
      <Basin x={90} y={214} w={130} h={40} c="#d9786f" water={null} />
      <OG sh={[{ d: 'M40 174Q60 150 90 156Q120 148 140 174Z', f: CLOTH }, { d: ell([72, 164], 9, 5), f: '#c9a77a' }, { d: ell([108, 160], 7, 4), f: '#c97a6a' }]} />
      <OG sh={[{ d: circ([90, 92], 22), f: K.danger }, { d: 'M90 78V96M90 102V104', st: '#fff', sw: 5 }]} />
      <Basin x={234} y={214} w={130} h={40} c="#7aa6d6" water={null} />
      <OG sh={[{ d: 'M184 174Q204 146 234 154Q262 146 284 174Z', f: '#d9a13a' }, { d: 'M196 168L214 152L230 160L246 150L268 166Z', f: '#6c9c5a' }]} />
      <rect x={158} y={64} width={4} height={150} rx={2} fill={shade(K.wall, 0.25)} />
    </Scene2>
  ),

  'sf-hs-camasir-kazan': () => {
    const gy = 200;
    const top: P = [128, 104], bot: P = [214, 140];
    const pr: PersonProps = { ...CAM, x: 92, y: 226, pose: { spine: -82, chest: -76, head: -84, armF: { to: lerp(top, bot, 0.42) }, armB: { to: lerp(top, bot, 0.2) }, legB: [96, 92], legF: [82, 88], face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Cauldron x={220} y={222} s={1.15} content="#dfe8ec" />
        <OG sh={[{ d: 'M196 140Q210 128 226 136Q240 128 252 140Z', f: CLOTH }]} />
        <Stick a={bot} b={top} w={3.4} c={WOOD} />
        <Person {...pr} />
        <Label x={262} y={34} text="55 °C+" size={15} />
      </Scene2>
    );
  },

  'sf-hs-camasir-gunes': () => {
    const gy = 200;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Sun x={46} y={42} r={16} />
        <Line x1={20} x2={300} y={gy + 10} top={84} items={[[70, 38, 44, CLOTH], [122, 40, 56, '#7aa6d6'], [176, 34, 40, '#e3a3a0'], [226, 40, 50, CLOTH], [272, 30, 38, '#d9a13a']]} />
        <Inset x={210} y={10} w={98} h={66}>
          <rect x={210} y={10} width={98} height={66} fill="#7d8a8f" />
          <OG sh={[{ d: 'M226 70Q240 46 262 52Q280 44 292 70Z', f: '#c9d3d6' }]} />
          <Drop x={246} y={44} s={0.7} />
          <No x={259} y={43} r={27} />
        </Inset>
      </Scene2>
    );
  },
  /* ───────── bit, pire, uyuz ───────── */
  'sf-hs-bit-sirke': () => {
    const c: P = [146, 112], r = 84;
    const strands = Array.from({ length: 9 }, (_, i) => 76 + i * 18);
    return (
      <Scene2 bg="closeup">
        <defs><clipPath id="hs-lens"><circle cx={c[0]} cy={c[1]} r={r} /></clipPath></defs>
        <OG sh={[{ d: capsule([c[0] + 60, c[1] + 60], 10, [268, 222], 12), f: '#3b3f4b' }]} />
        <circle cx={c[0]} cy={c[1]} r={r} fill="#f3d9c6" />
        <g clip-path="url(#hs-lens)">
          <rect x={c[0] - r} y={c[1] + 50} width={2 * r} height={60} fill={K.skin[2]} />
          {strands.map((x, i) => <path key={i} d={`M${x} ${c[1] + 54}Q${x + (i % 2 ? 14 : -10)} ${c[1] - 10} ${x + (i % 2 ? 4 : 12)} ${c[1] - 100}`} fill="none" stroke={K.hair.black} stroke-width={4} />)}
          {strands.map((x, i) => (i % 3 === 2 ? null : <ellipse key={'n' + i} cx={x + (i % 2 ? 3 : -2)} cy={c[1] + 34 - (i % 2) * 12} rx={4.2} ry={6.5} fill="#fbf6e6" stroke={K.out} stroke-width={1.2} transform={`rotate(${i % 2 ? 10 : -8} ${x} ${c[1] + 30})`} />))}
          <g transform={`translate(${c[0] + 16} ${c[1] - 26}) rotate(-20)`}>
            <path d="M-8 -6l-10 -6M-8 0l-12 0M-8 6l-10 6M8 -6l10 -6M8 0l12 0M8 6l10 6" stroke={K.out} stroke-width={2.2} stroke-linecap="round" />
            <ellipse cx={0} cy={4} rx={9} ry={13} fill="#a7764a" stroke={K.out} stroke-width={1.5} />
            <ellipse cx={0} cy={-12} rx={5} ry={5} fill="#8c5f38" stroke={K.out} stroke-width={1.5} />
          </g>
        </g>
        <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke="#3b3f4b" stroke-width={9} />
        <circle cx={c[0]} cy={c[1]} r={r - 5} fill="none" stroke="#fff" stroke-width={2} opacity={0.6} />
      </Scene2>
    );
  },

  'sf-hs-bit-tarama': () => {
    const girl: PersonProps = { ...BIT_KIZ, x: 200, y: 230, s: 1.25, pose: { ...POSE.sitChair, armB: [70, 10], armF: [66, 6], face: 'neutral' } };
    const g = rig(girl);
    const comb: P = [g.nape[0] - 12, g.head[1] - 2];
    const mom: PersonProps = { ...BIT_ANNE, x: 108, y: 230, s: 1.12, pose: { ...POSE.standSide, spine: -84, armF: { to: comb }, armB: { to: [g.nape[0] - 16, g.nape[1] + 26] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Window x={240} y={40} />
        <OG sh={[{ d: rrect(176, 222 - 44 * 1.25, 52, 8, 2), f: K.wood }, { d: rrect(180, 222 - 44 * 1.25 + 6, 6, 44 * 1.25 + 2, 1.5), f: shade(K.wood, 0.15) }, { d: rrect(218, 222 - 44 * 1.25 + 6, 6, 44 * 1.25 + 2, 1.5), f: K.wood }]} />
        <Person {...girl} />
        <Person {...mom} over={(r) => <OG sh={[{ d: rrect(r.handF[0] - 3, r.handF[1] - 14, 7, 28, 2), f: '#3b3f4b', t: `rotate(-6 ${r.handF[0]} ${r.handF[1]})` }]} />} />
        <Arrow from={[g.nape[0] - 24, g.head[1] - 6]} to={[g.nape[0] - 24, g.nape[1] + 40]} w={5} />
      </Scene2>
    );
  },

  'sf-hs-uyuz-yerler': () => {
    const kid: PersonProps = { ...BIT_KIZ, x: 90, y: 234, s: 1.6, sleeve: 'short', pose: { ...POSE.stand, armB: [104, 96], armF: [76, 84], face: 'neutral' } };
    const r = rig(kid);
    const dots = (p: P, n = 3) => Array.from({ length: n }, (_, i) => <circle key={i} cx={p[0] + ((i * 7) % 9) - 4} cy={p[1] + ((i * 5) % 7) - 3} r={2.6} fill={K.danger} stroke="#fff" stroke-width={0.8} />);
    const hx = 236, hy = 228, hs = 1.55;
    const hp = (x: number, y: number): P => [hx + x * hs, hy + y * hs];
    return (
      <Scene2 bg="closeup">
        <Person {...kid} />
        {dots(r.wristB)}{dots(r.wristF)}{dots(r.elbowB)}{dots(r.elbowF)}{dots(r.handB, 2)}{dots(r.handF, 2)}
        {dots([r.hip[0] - 14, r.hip[1] - 8])}{dots([r.hip[0] + 14, r.hip[1] - 8])}
        <Hand x={hx} y={hy} a={0} s={hs} pose="open" side="R" skin={2} arm={30} />
        {[hp(-6.5, -36), hp(0.2, -37.5), hp(7, -34), hp(-12, -30)].map((p, i) => <g key={i}>{dots(p, 2)}</g>)}
        <path d={`M${hp(-3, -46)[0]} ${hp(-3, -46)[1]}q4 -4 0 -8t0 -8`} fill="none" stroke="#9c3b30" stroke-width={2} />
        <circle cx={hp(0, -40)[0]} cy={hp(0, -40)[1]} r={34} fill="none" stroke={K.action} stroke-width={3} />
      </Scene2>
    );
  },

  /* ───────── diş ───────── */
  'sf-hs-dis-misvak-cigneme': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: capsule([26, 150], 10, [214, 132], 10), f: '#8a5a36' }, { d: capsule([206, 133], 9.6, [250, 128], 9.4), f: '#ecdcb3' }]} />
      <path d="M60 144l16 -2M110 140l20 -2M160 135l16 -2" stroke={shade('#8a5a36', 0.3)} stroke-width={2} stroke-linecap="round" />
      {Array.from({ length: 11 }, (_, i) => { const a = -26 + i * 5.2; const e = pol([248, 128], a, 36 + (i % 3) * 5); return <path key={i} d={`M248 ${128 + (i - 5) * 1.4}L${f1(e[0])} ${f1(e[1])}`} stroke="#e6d3a2" stroke-width={3} stroke-linecap="round" />; })}
      <path d="M252 116L284 104M252 140L284 152" stroke={K.out} stroke-width={1} opacity={0.4} />
      <Dim a={[206, 104]} b={[252, 100]} w={2.5} />
      <Label x={229} y={76} text="1 cm" size={15} />
    </Scene2>
  ),

  'sf-hs-dis-misvak-firca': () => {
    const gum = '#e58f95';
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M96 58Q92 120 104 176Q118 200 140 200Q160 198 168 176Q178 120 172 58Z', f: '#fbf8ef' }, { d: 'M150 70Q160 120 152 186Q164 178 168 160Q176 120 170 70Z', f: '#ece6d6', no: true }]} />
        <path d="M0 0H320V64Q240 84 160 72Q80 84 0 64Z" fill={gum} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: capsule([196, 118], 8, [320, 136], 9), f: '#8a5a36' }]} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M198 ${110 + i * 2}L${174 + (i % 2) * 2} ${104 + i * 4}`} stroke="#e6d3a2" stroke-width={3} stroke-linecap="round" />)}
        <Arrow from={[214, 84]} to={[214, 190]} w={6} />
        <Ok x={276} y={44} />
      </Scene2>
    );
  },

  'sf-hs-dis-bez': () => {
    const gum = '#e58f95';
    const teeth = [70, 104, 138, 172, 206, 240];
    const h = handAtP({ a: -18, s: 1.5, pose: 'point' as const, side: 'R' as const, skin: 1, arm: 140, sleeve: K.role.bystander3 }, 'tip', [154, 96]);
    const tip = handPoint(h, 'tip');
    return (
      <Scene2 bg="closeup">
        <path d="M30 20Q160 -10 290 20V60Q160 40 30 60Z" fill={gum} stroke={K.out} stroke-width={1.5} />
        {teeth.map((x) => <OG key={x} sh={[{ d: `M${x - 15} 48Q${x - 16} 92 ${x - 8} 106Q${x} 112 ${x + 8} 106Q${x + 16} 92 ${x + 15} 48Z`, f: '#fbf8ef' }]} />)}
        <path d="M30 52Q160 32 290 52" fill="none" stroke={gum} stroke-width={8} />
        <Hand {...h} />
        <OG sh={[{ d: rrect(-9, -4, 18, 30, 6), f: CLOTH, t: `translate(${f1(tip[0])} ${f1(tip[1])}) rotate(-18)` }, { d: 'M-9 6H9M-9 14H9', st: shade(CLOTH, 0.18), sw: 1.2, t: `translate(${f1(tip[0])} ${f1(tip[1])}) rotate(-18)` }]} />
      </Scene2>
    );
  },

  /* ───────── kadın hijyeni ───────── */
  'sf-hs-ped-dikis': () => {
    const c = '#6a5a9a';
    const h = handAtP({ a: -100, s: 1.15, pose: 'pinch' as const, side: 'R' as const, skin: 1, arm: 140, sleeve: K.role.bystander }, 'pinch', [262, 120]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#d8c3a2" opacity={0.6} />
        <OG sh={[{ d: 'M126 64Q150 48 174 64V176Q150 192 126 176Z', f: shade(c, 0.12) }, { d: rrect(60, 92, 180, 56, 28), f: c }]} />
        <circle cx={150} cy={66} r={5} fill="#ddd" stroke={K.out} stroke-width={1.2} />
        <circle cx={150} cy={174} r={5} fill="#ddd" stroke={K.out} stroke-width={1.2} />
        <rect x={68} y={100} width={164} height={40} rx={20} fill="none" stroke="#e8e2f4" stroke-width={2} stroke-dasharray="5 4" />
        <path d="M232 120Q246 112 262 120" fill="none" stroke="#e8e2f4" stroke-width={1.6} />
        <OG sh={[{ d: capsule([240, 122], 1.2, [270, 116], 1.2), f: '#c7ced6' }]} />
        <Hand {...h} />
      </Scene2>
    );
  },

  'sf-hs-ped-islatma': () => {
    const c = '#6a5a9a';
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={200} width={320} height={40} fill="#c9a77a" />
        <Basin x={116} y={214} w={160} h={44} water={null} />
        <OG sh={[{ d: rrect(60, 162, 60, 18, 9), f: c, t: 'rotate(-8 90 171)' }, { d: rrect(104, 164, 64, 18, 9), f: shade(c, 0.1), t: 'rotate(6 136 173)' }]} />
        <path d="M40 172Q76 166 116 172T192 172V176H40Z" fill={K.water} opacity={0.7} />
        <path d="M44 172Q80 166 116 172T188 172" fill="none" stroke={K.waterLight} stroke-width={2.4} />
        <Basin x={252} y={214} w={92} h={30} water={K.waterLight} />
        <OG sh={[{ d: rrect(232, 168, 34, 16, 4), f: '#f3e3a6' }]} />
      </Scene2>
    );
  },

  'sf-hs-ped-gunes': () => {
    const gy = 200, c = '#6a5a9a';
    const screen = (x: number, w: number) => <g><rect x={x} y={70} width={w} height={gy - 70 + 20} fill="#d9c27a" stroke={K.out} stroke-width={1.5} />{Array.from({ length: Math.floor(w / 8) }, (_, i) => <path key={i} d={`M${x + 4 + i * 8} 72V${gy + 18}`} stroke="#b9a25a" stroke-width={1.4} />)}</g>;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Sun x={160} y={36} r={15} />
        {screen(0, 54)}
        {screen(266, 54)}
        <Line x1={70} x2={250} y={gy + 14} top={96} items={[[104, 22, 46, c], [140, 22, 46, shade(c, 0.1)], [176, 22, 46, c], [212, 22, 46, shade(c, 0.1)]]} />
        <Inset x={220} y={10} w={92} h={64}>
          <rect x={220} y={10} width={92} height={64} fill="#7d8a8f" />
          <OG sh={[{ d: rrect(244, 46, 40, 12, 6), f: c }, { d: 'M232 56Q250 34 268 40Q288 34 300 58Z', f: '#7aa6d6' }]} />
          <No x={266} y={42} r={26} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── bebek bezi ───────── */
  'sf-hs-bez-katlama': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(24, 60, 112, 112, 3), f: CLOTH }]} />
      <path d="M28 168L132 64" stroke={K.action} stroke-width={2.4} stroke-dasharray="7 5" />
      <Arrow from={[146, 116]} to={[180, 116]} w={6} />
      <OG sh={[{ d: 'M190 70H302L246 176Z', f: CLOTH }, { d: 'M196 76H296L246 168Z', f: 'none', st: shade(CLOTH, 0.2), sw: 1.4 }]} />
    </Scene2>
  ),

  'sf-hs-bez-kova': () => {
    const baby: PersonProps = { x: 214, y: 228, s: 1.7, who: 'baby', pose: { ...POSE.crawl, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={190}>
        <Shelf x={40} y={86} w={140} />
        <Pail x={110} y={86} s={1.25} c="#7aa6d6" />
        <Person {...baby} />
        <Ok x={70} y={40} />
      </Scene2>
    );
  },

  'sf-hs-bez-kazan': () => {
    const gy = 196;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Cauldron x={150} y={226} s={1.5} content="#dfe8ec" />
        <OG sh={[{ d: 'M110 122Q128 106 146 116Q166 104 188 122Z', f: CLOTH }, { d: rrect(126, 108, 30, 12, 2), f: '#fff', t: 'rotate(-12 141 114)' }]} />
        <Stick a={[176, 126]} b={[240, 40]} w={3.6} c={WOOD} />
        <Basin x={272} y={224} w={70} h={24} water={K.waterLight} />
      </Scene2>
    );
  },
  /* ───────── uzun dönem bakım ───────── */
  'sf-hs-bakim-kapak': () => drinkScene(true),

  /* ───────── yara bakımı ───────── */
  'sf-hs-yara-tuzlu-su': () => {
    const h = handAtP({ a: -118, s: 1.15, pose: 'hold' as const, side: 'R' as const, grip: 8, arm: 160, sleeve: K.role.helper, skin: 2 }, 'grip', [214, 70]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={200} width={320} height={40} fill="#c9a77a" />
        <Campfire x={124} y={226} s={1.2} />
        <Pot x={124} y={206} s={1.9} />
        <OG sh={[{ d: capsule([166, 82], 2.4, [214, 70], 2.4), f: '#c7ced6' }, { d: ell([162, 84], 8, 4.6), f: '#c7ced6' }, { d: ell([162, 81], 6, 3), f: '#fff' }]} />
        <Hand {...h} />
        <OG sh={[{ d: 'M248 226V190Q248 182 256 182H282Q290 182 290 190V226Z', f: '#e3f0f5' }, { d: rrect(244, 172, 50, 12, 3), f: '#c6574e' }, { d: rrect(252, 196, 34, 22, 3), f: '#fff', ln: true }]} />
        <Label x={124} y={34} text="1 L" size={15} />
        <Label x={270} y={150} text="9 g" size={15} />
      </Scene2>
    );
  },

  'sf-hs-yara-yikama': () => {
    const cup = handAtP({ a: -150, s: 1.15, pose: 'hold' as const, side: 'R' as const, grip: 30, arm: 160, sleeve: K.role.helper, skin: 2 }, 'grip', [184, 58]);
    return (
      <Scene2 bg="closeup">
        <Basin x={160} y={238} w={200} h={30} water={K.waterLight} />
        <Leg y={150} />
        <Wound x={150} y={136} />
        <G x={184} y={58} a={-40}><OG sh={[{ d: rrect(-16, -18, 32, 38, 4), f: '#e3f0f5' }, { d: rrect(-16, -6, 32, 26, 4), f: K.water, no: true }]} /></G>
        <Hand {...cup} />
        <path d="M168 70Q160 92 154 124" fill="none" stroke={K.water} stroke-width={4} stroke-linecap="round" />
        <path d="M136 150Q128 176 126 206M176 152Q180 178 184 206" fill="none" stroke={K.water} stroke-width={3} stroke-linecap="round" opacity={0.85} />
        <Arrow from={[220, 150]} to={[214, 206]} w={4} />
      </Scene2>
    );
  },

  'sf-hs-yara-sarma': () => (
    <Scene2 bg="closeup">
      <Leg y={150} />
      <OG sh={[{ d: 'M98 122Q150 116 200 124V178Q150 186 98 178Z', f: CLOTH }]} />
      {[106, 128, 150, 172, 192].map((x) => <path key={x} d={`M${x} 120L${x + 14} 182`} stroke={shade(CLOTH, 0.2)} stroke-width={2} />)}
      <Ok x={150} y={60} r={16} />
    </Scene2>
  ),

  /* ───────── enfeksiyon ───────── */
  'sf-hs-enf-yerel': () => (
    <Scene2 bg="closeup">
      <Arm y={140} />
      <ellipse cx={160} cy={136} rx={58} ry={30} fill="#e86a5a" opacity={0.55} />
      <ellipse cx={160} cy={136} rx={36} ry={20} fill="#d84a3a" opacity={0.7} />
      <OG sh={[{ d: ell([160, 136], 14, 8), f: '#e8d06a' }]} />
      <path d="M118 96c-5-7 5-11 0-18M160 92c-5-7 5-11 0-18M202 96c-5-7 5-11 0-18" fill="none" stroke={K.danger} stroke-width={3} stroke-linecap="round" />
      <Warn x={276} y={46} />
    </Scene2>
  ),

  'sf-hs-enf-sinir-cizme': () => {
    const pen = handAtP({ a: -150, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 8, arm: 160, sleeve: K.role.helper, skin: 3 }, 'grip', [236, 96]);
    return (
      <Scene2 bg="closeup">
        <Arm y={150} />
        <ellipse cx={150} cy={146} rx={52} ry={26} fill="#e86a5a" opacity={0.6} />
        <OG sh={[{ d: ell([150, 146], 12, 7), f: '#d84a3a' }]} />
        <ellipse cx={150} cy={146} rx={56} ry={30} fill="none" stroke={K.ink} stroke-width={2.6} stroke-dasharray="6 4" />
        <OG sh={[{ d: capsule([204, 132], 2.6, [244, 88], 3.4), f: '#3d7ad6' }]} />
        <Hand {...pen} />
        <Label x={86} y={92} text="14:00" size={14} />
        <Inset x={14} y={164} w={110} h={66}>
          <rect x={14} y={164} width={110} height={66} fill={K.skin[1]} />
          <ellipse cx={69} cy={197} rx={46} ry={24} fill="#e86a5a" opacity={0.6} />
          <ellipse cx={64} cy={197} rx={28} ry={16} fill="none" stroke={K.ink} stroke-width={2} stroke-dasharray="5 3" />
          <Arrow from={[84, 197]} to={[112, 197]} w={3.5} />
        </Inset>
      </Scene2>
    );
  },

  'sf-hs-enf-nabiz': () => {
    const f = handAtP({ a: -150, s: 1.15, pose: 'press' as const, side: 'R' as const, view: 'back' as const, arm: 160, sleeve: K.role.helper, skin: 3 }, 'tip', [118, 136]);
    return (
      <Scene2 bg="closeup">
        <Hand x={84} y={150} a={-90} s={1.25} pose="open" side="L" view="palm" skin={1} arm={0} />
        <OG sh={[{ d: capsule([84, 150], 15, [330, 162], 18), f: K.skin[1] }, { d: capsule([200, 156], 20, [340, 166], 22), f: K.role.victim }]} />
        <Hand {...f} />
        <circle cx={112} cy={142} r={6} fill="none" stroke={K.danger} stroke-width={2} opacity={0.8} />
        <Timer x={232} y={46} r={16} text="30 sn" />
      </Scene2>
    );
  },

  /* ───────── ateşli hasta ───────── */
  'sf-hs-ates-sivi': () => drinkScene(false),

  'sf-hs-ates-ince-ortu': () => {
    const pat = (x: number): PersonProps => ({ ...ATES_H, x, y: 214, s: 0.9, pose: { ...POSE.lieBack, face: 'closed' } });
    return (
      <Scene2 bg="indoor" gy={168}>
        <rect x={158} y={0} width={4} height={240} fill="#fff" />
        <OG sh={[{ d: rrect(10, 206, 140, 12, 4), f: '#d9cfbe' }, { d: rrect(170, 206, 140, 12, 4), f: '#d9cfbe' }]} />
        <OG sh={[{ d: rrect(8, 190, 26, 14, 5), f: '#fff' }, { d: rrect(168, 190, 26, 14, 5), f: '#fff' }]} />
        <Person {...pat(80)} />
        <Blanket x1={44} x2={152} y={210} h={13} color="#e9eef2" />
        <Ok x={80} y={60} r={16} />
        <Person {...pat(240)} />
        <Blanket x1={196} x2={308} y={210} h={34} color="#c1554b" />
        <Blanket x1={202} x2={304} y={196} h={22} color="#7aa6d6" />
        {[[188, 172], [196, 160], [180, 186]].map(([x, y], i) => <Drop key={i} x={x} y={y} s={0.6} />)}
        <Bad x={240} y={60} r={16} />
      </Scene2>
    );
  },

  'sf-hs-ates-cizelge': () => {
    const pen = handAtP({ a: -140, s: 1.15, pose: 'hold' as const, side: 'R' as const, grip: 8, arm: 160, sleeve: ATES_B.top ?? K.role.helper, skin: 1 }, 'grip', [196, 150]);
    const rows = [74, 98, 122, 146, 170];
    return (
      <Scene2 bg="indoor" gy={236}>
        <OG sh={[{ d: rrect(56, 30, 180, 178, 3), f: '#fbfaf5' }]} />
        <circle cx={146} cy={38} r={4} fill={K.danger} stroke={K.out} stroke-width={1} />
        {rows.map((y) => <path key={y} d={`M64 ${y}H228`} stroke="#b7c4d2" stroke-width={1.4} />)}
        {[100, 140, 180].map((x) => <path key={x} d={`M${x} 52V194`} stroke="#b7c4d2" stroke-width={1.4} />)}
        <OG sh={[{ d: capsule([118, 64], 3, [118, 46], 3), f: '#fff' }, { d: circ([118, 66], 4.5), f: K.danger }]} />
        <Drop x={160} y={58} s={0.8} />
        <Drop x={200} y={58} s={0.8} color="#f2d36a" />
        {rows.slice(0, 4).map((y, i) => <path key={i} d={`M70 ${y + 14}h22M108 ${y + 14}q6 -6 12 0t12 0M150 ${y + 14}h18M188 ${y + 14}h14`} stroke={K.ink} stroke-width={1.8} fill="none" />)}
        <OG sh={[{ d: capsule([168, 150], 2.4, [198, 150], 2.4), f: '#3d7ad6' }]} />
        <Hand {...pen} />
        <OG sh={[{ d: capsule([270, 70], 5, [270, 170], 5), f: '#fff' }, { d: circ([270, 176], 9), f: K.danger }, { d: capsule([270, 100], 2, [270, 172], 2), f: K.danger, no: true }]} />
      </Scene2>
    );
  },

  /* ───────── sıvı kaybı ───────── */
  'sf-hs-ors-hazirlama': () => {
    const spoon = (x: number, y: number, half = false) => <OG key={x + '-' + y} sh={[{ d: capsule([x - 30, y], 2, [x - 6, y], 2), f: '#c7ced6' }, { d: ell([x + 4, y], 11, 6), f: '#c7ced6' }, { d: half ? `M${x - 4} ${y}A8 4 0 0 0 ${x + 12} ${y}Z` : ell([x + 4, y - 1], 8, 4.4), f: '#fff' }]} />;
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={200} width={320} height={40} fill="#c9a77a" />
        <OG sh={[{ d: 'M30 214V96Q30 86 40 86H102Q112 86 112 96V214Z', f: '#e3f0f5' }, { d: 'M30 214V112H112V214Z', f: tint(K.water, 0.4), no: true }, { d: 'M112 112Q132 112 132 136V164Q132 180 112 180', f: 'none', st: K.out, sw: 4 }]} />
        <Label x={71} y={64} text="1 L" size={16} />
        <OG sh={[{ d: rrect(160, 58, 44, 50, 6), f: '#fff' }, { d: rrect(156, 50, 52, 12, 4), f: '#d9a13a' }]} />
        {[0, 1, 2].map((i) => spoon(170, 128 + i * 20))}
        {[0, 1, 2].map((i) => spoon(222, 128 + i * 20))}
        <Label x={182} y={34} text="6" size={18} />
        <OG sh={[{ d: rrect(256, 58, 40, 50, 6), f: '#fff' }, { d: rrect(252, 50, 48, 12, 4), f: K.water }]} />
        {spoon(284, 148, true)}
        <Label x={276} y={34} text="½" size={18} />
      </Scene2>
    );
  },

  'sf-hs-ors-cimdik': () => {
    const h = handAtP({ a: -62, s: 1.5, pose: 'pinch' as const, side: 'R' as const, skin: 2, arm: 160, sleeve: SIVI_ANNE.top }, 'pinch', [166, 128]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={90} width={320} height={150} fill={K.skin[2]} />
        <rect x={0} y={60} width={320} height={34} fill={K.role.victim} stroke={K.out} stroke-width={1.5} />
        <ellipse cx={160} cy={196} rx={5} ry={7} fill={shade(K.skin[2], 0.25)} />
        <path d="M132 140Q160 76 188 140" fill={tint(K.skin[2], 0.08)} stroke={K.out} stroke-width={1.8} />
        <path d="M148 120Q160 98 172 120" fill="none" stroke={shade(K.skin[2], 0.3)} stroke-width={1.4} />
        <Hand {...h} />
        <Timer x={226} y={40} r={14} text="2 sn+" />
      </Scene2>
    );
  },

  'sf-hs-ors-kasik': () => {
    const gy = 200;
    const kid: PersonProps = { ...SIVI_COCUK, x: 214, y: 228, s: 1.35, flip: true, pose: { ...POSE.sitFloor, spine: -84, armB: { floor: -16 }, armF: [80, 60], face: 'neutral' } };
    const k = rig(kid);
    const sp: P = [k.mouth[0] + 6, k.mouth[1] + 2];
    const mom: PersonProps = { ...SIVI_ANNE, x: 96, y: 230, s: 1.3, pose: { ...POSE.kneelSit, spine: -82, armF: { to: [sp[0] - 26, sp[1] + 8] }, armB: { at: 'kneeF', d: [6, -6] }, face: 'calm' } };
    return (
      <Scene2 bg="indoor" gy={gy}>
        <Window x={236} y={30} />
        <Person {...kid} />
        <Person {...mom} over={(r) => <g><OG sh={[{ d: capsule(r.handF, 1.8, sp, 1.8), f: '#c7ced6' }, { d: ell(sp, 6, 3.6), f: '#c7ced6' }]} /><G x={r.handB[0] + 4} y={r.handB[1] + 4}><OG sh={[{ d: rrect(-10, -24, 20, 24, 3), f: '#e3f0f5' }, { d: rrect(-10, -16, 20, 16, 3), f: tint(K.water, 0.3), no: true }]} /></G></g>} />
      </Scene2>
    );
  },

  /* ───────── atel ve değnek ───────── */
  'sf-hs-atel-baglama': () => (
    <Scene2 bg="closeup">
      <Arm y={130} skin={3} sleeve={K.role.victim} />
      <OG sh={[{ d: rrect(40, 98, 210, 14, 3), f: WOOD }, { d: rrect(40, 148, 210, 14, 3), f: shade(WOOD, 0.12) }]} />
      <OG sh={[{ d: rrect(44, 108, 202, 6, 3), f: '#efe6d2' }, { d: rrect(44, 146, 202, 6, 3), f: '#efe6d2' }]} />
      {[86, 204].map((x) => <g key={x}><OG sh={[{ d: rrect(x - 8, 92, 16, 76, 4), f: CLOTH }]} /><OG sh={[{ d: ell([x, 98], 8, 6), f: shade(CLOTH, 0.08) }]} /></g>)}
      <path d="M140 118l6 6l-6 6l6 6l-6 6" fill="none" stroke={K.danger} stroke-width={2.6} stroke-linejoin="round" />
      <Ok x={150} y={52} r={16} />
    </Scene2>
  ),

  'sf-hs-atel-kontrol': () => {
    const finger = (x: number, nail: string) => <G x={x} y={0}><OG sh={[{ d: capsule([0, 230], 26, [0, 90], 22), f: K.skin[3] }, { d: ell([0, 102], 14, 18), f: nail }]} /></G>;
    const th = handAtP({ a: 20, s: 1.2, pose: 'point' as const, side: 'L' as const, skin: 1, arm: 140, sleeve: K.role.helper }, 'tip', [70, 104]);
    return (
      <Scene2 bg="closeup">
        {finger(80, '#f2f0ea')}
        <Hand {...th} />
        <Arrow from={[134, 120]} to={[178, 120]} w={6} />
        {finger(236, '#f0a9a4')}
        <Timer x={210} y={36} r={14} text="2 sn" />
      </Scene2>
    );
  },

  'sf-hs-degnek-olcu': () => {
    const S = 1.8;
    const b0: PersonProps = { ...ATEL, x: 168, y: 0, s: S, pose: { ...POSE.stand, face: 'neutral' } };
    const dy = 92 - rig(b0).shoulderF[1];
    const base: PersonProps = { ...b0, y: dy };
    const r0 = rig(base);
    const pit = r0.shoulderF[1] + 9 * S;
    const gap = 20;
    const top: P = [r0.shoulderF[0] - 4, pit + gap];
    const foot: P = [top[0] + 58, 300];
    const gy0 = r0.wristF[1] - 6;
    const grip: P = [lerp(top, foot, (gy0 - top[1]) / (foot[1] - top[1]))[0], gy0];
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [grip[0] + 2, grip[1]] }, handF: 'fist' } };
        return (
      <Scene2 bg="indoor" gy={260}>
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: capsule(foot, 4.4, top, 4.4), f: K.trunk }, { d: capsule(top, 4, [top[0] - 13, top[1] - 4], 3.6), f: K.trunk }, { d: capsule(top, 4, [top[0] + 13, top[1] - 4], 3.6), f: K.trunk }, { d: ell([top[0], top[1] - 6], 17, 6), f: '#d9c27a' }, { d: capsule([grip[0] - 12, grip[1]], 4, [grip[0] + 14, grip[1]], 4), f: shade(K.trunk, 0.1) }]} />
        <Person {...p} only={['armF']} />
        <path d={`M${top[0] - 22} ${pit}H${top[0] + 6}M${top[0] - 22} ${top[1] - 12}H${top[0] + 6}`} stroke={K.action} stroke-width={3} stroke-linecap="round" />
        <Label x={top[0] - 92} y={(pit + top[1] - 12) / 2} text="5 cm" size={16} />
        <Arrow from={[top[0] - 66, (pit + top[1] - 12) / 2]} to={[top[0] - 26, (pit + top[1] - 12) / 2]} w={2.6} />
      </Scene2>
    );
  },

  /* ───────── sedye ───────── */
  'sf-hs-sedye-battaniye': () => {
    const bl = '#c1554b', T = 46, B = 214;
    const pole = (x: number) => <OG sh={[{ d: rrect(x - 3.5, T - 16, 7, B - T + 30, 3.5), f: K.trunk }]} />;
    const sheet = (x: number, w: number, c: string) => <OG sh={[{ d: rrect(x, T, w, B - T, 3), f: c }]} />;
    const num = (x: number, t: string) => <Label x={x} y={20} text={t} size={14} />;
    return (
      <Scene2 bg="floor">
        {/* 1: battaniye serili, sırık üçte birde; sol kısım sırığın üstünden katlanır */}
        {sheet(10, 90, bl)}
        {pole(40)}
        <Arrow from={[18, 128]} to={[66, 128]} bend={-0.55} w={4} />
        {num(55, '1')}
        {/* 2: sol üçte bir katlandı (koyu); 2. sırık katlanan kenardan biraz içeride; sağ kısım üstüne katlanır */}
        {sheet(140, 60, bl)}
        {sheet(140, 30, shade(bl, 0.2))}
        {pole(140)}{pole(162)}
        <Arrow from={[194, 128]} to={[150, 128]} bend={0.55} w={4} />
        {num(170, '2')}
        {/* 3: bitmiş sedye: üç kat */}
        {sheet(242, 34, shade(bl, 0.32))}
        {pole(242)}{pole(276)}
        {num(259, '3')}
        <Ok x={296} y={226} r={11} />
      </Scene2>
    );
  },

  'sf-hs-sedye-ceket': () => {
    const jacket = (y: number, c: string) => <OG sh={[{ d: `M96 ${y}L132 ${y - 6}Q160 ${y + 8} 188 ${y - 6}L224 ${y}V${y + 52}H96Z`, f: c }, { d: `M142 ${y - 4}L160 ${y + 18}L178 ${y - 4}`, f: 'none', st: shade(c, 0.35), sw: 2 }, { d: `M160 ${y + 18}V${y + 52}`, st: shade(c, 0.35), sw: 1.6 }, { d: circ([166, y + 30], 2), f: '#e2c35a' }]} />;
    return (
      <Scene2 bg="floor">
        {jacket(26, '#3f5684')}
        {jacket(92, '#6c9c5a')}
        {jacket(158, '#8a5a36')}
        <OG sh={[{ d: rrect(100, 10, 7, 222, 3), f: K.trunk }, { d: rrect(213, 10, 7, 222, 3), f: K.trunk }]} />
      </Scene2>
    );
  },

  'sf-hs-sedye-yokus': () => {
    const gyAt = (x: number) => 146 + x * 0.2;
    const ang = Math.atan(0.2) / R;
    const s = 0.88;
    const back: PersonProps = { ...SED_A, x: 262, y: gyAt(262) + 4, s, flip: true, pose: { ...POSE.walk, spine: -94, armB: [100, 92], armF: [96, 88], face: 'neutral' } };
    const front: PersonProps = { ...SED_B, x: 56, y: gyAt(56) + 4, s, flip: true, pose: { ...POSE.walk, spine: -80, armB: [100, 96], armF: [80, 110], face: 'neutral' } };
    const rb = rig(back), rf = rig(front);
    const h1 = rb.handF, h0: P = [rf.handB[0] + 6, rf.handB[1]];
    const mid = lerp(h0, h1, 0.5);
    return (
      <Scene2 bg="outdoor" gy={238}>
        <path d={`M0 ${gyAt(0)}L320 ${gyAt(320)}V240H0Z`} fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <Person {...front} only={['legB', 'armB', 'torso', 'head']} />
        <Person {...back} only={['legB', 'armB', 'torso', 'head', 'legF']} />
        <OG sh={[{ d: capsule([h0[0] - 14, h0[1] - 14 * Math.tan(ang * R)], 2.6, [h1[0] + 10, h1[1] + 10 * Math.tan(ang * R)], 2.6), f: K.trunk }]} />
        <g transform={`rotate(${f1(ang)} ${f1(mid[0])} ${f1(mid[1])})`}>
          <OG sh={[{ d: rrect(mid[0] - 92, mid[1] - 6, 184, 8, 2), f: '#c1554b' }]} />
          <Person {...SED_P} x={mid[0] + 8} y={mid[1] - 4} s={0.95} pose={{ ...POSE.lieBack, face: 'neutral' }} shadow={false} />
          <Blanket x1={mid[0] - 46} x2={mid[0] + 80} y={mid[1] - 4} h={16} color="#7aa6d6" />
        </g>
        <Person {...front} only={['legF', 'armF']} />
        <Person {...back} only={['armF']} />
        <Arrow from={[220, 52]} to={[120, 32]} w={6} />
      </Scene2>
    );
  },

  /* ───────── yatalak hasta ───────── */
  'sf-hs-yatak-baski-noktalari': () => {
    const p: PersonProps = { ...YAT_H, x: 168, y: 196, s: 1.62, pose: { ...POSE.lieBack, face: 'closed' } };
    const r = rig(p);
    const spots: P[] = [[r.head[0] - 8, r.head[1] + 12], [r.back[0] + 8, r.back[1] + 6], [r.elbowB[0], r.elbowB[1] + 5], [r.hip[0], r.hip[1] + 9], [r.ankleB[0] + 2, r.ankleB[1] + 6]];
    return (
      <Scene2 bg="indoor" gy={150}>
        <OG sh={[{ d: rrect(14, 194, 292, 18, 6), f: '#d9cfbe' }]} />
        <OG sh={[{ d: rrect(10, 176, 46, 20, 8), f: '#fff' }]} />
        <Person {...p} />
        {spots.map((q, i) => <g key={i}><circle cx={q[0]} cy={q[1]} r={9} fill={K.danger} opacity={0.35} /><circle cx={q[0]} cy={q[1]} r={4.5} fill={K.danger} stroke="#fff" stroke-width={1.5} /></g>)}
      </Scene2>
    );
  },

  'sf-hs-yatak-topuk': () => {
    const sk = K.skin[1], cl = '#5b5f78';
    return (
      <Scene2 bg="indoor" gy={120}>
        <OG sh={[{ d: rrect(-10, 186, 340, 60, 8), f: '#d9cfbe' }, { d: rrect(-10, 186, 340, 10, 5), f: '#efe8dc' }]} />
        <OG sh={[{ d: 'M120 188Q118 150 170 148Q226 146 232 188Z', f: '#fff' }, { d: 'M136 168Q176 156 220 166', st: '#d8d4c8', sw: 1.4 }]} />
        <OG sh={[{ d: capsule([-20, 168], 26, [120, 160], 20), f: cl }, { d: capsule([110, 158], 19, [234, 146], 14), f: cl }]} />
        <OG sh={[{ d: capsule([228, 146], 11, [250, 146], 10), f: sk }, { d: 'M240 158Q232 156 236 132L248 104Q256 96 264 104Q270 114 262 134L258 152Q254 162 240 158Z', f: sk }]} />
        <path d="M244 166H258M244 182H258" stroke={K.action} stroke-width={3} stroke-linecap="round" />
        <Arrow from={[294, 136]} to={[264, 172]} w={4} />
        <Ok x={170} y={86} />
      </Scene2>
    );
  },

  'sf-hs-yatak-besleme': () => {
    const gy = 182;
    const pat: PersonProps = { ...YAT_H, x: 206, y: 218, s: 1.3, flip: true, pose: { ...POSE.sitFloor, spine: -70, head: -80, armB: [70, 10], armF: [76, 14], legB: [2, 2], legF: [-2, 2], face: 'neutral' } };
    const pr = rig(pat);
    const sp: P = [pr.mouth[0] - 8, pr.mouth[1] + 2];
    const cg: PersonProps = { ...YAT_B, x: 84, y: 232, s: 1.3, pose: { ...POSE.kneelSit, spine: -82, armF: { to: [sp[0] - 26, sp[1] + 10] }, armB: { at: 'kneeF', d: [8, -14] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={gy}>
        <OG sh={[{ d: rrect(110, 206, 214, 18, 6), f: '#d9cfbe' }]} />
        <Pillow x={262} y={208} w={42} h={70} a={10} c="#e6ebf0" />
        <Pillow x={242} y={208} w={40} h={62} a={14} />
        <Person {...pat} />
        <Blanket x1={104} x2={214} y={212} h={16} color="#9cc0e0" />
        <Person {...cg} over={(r) => <g><OG sh={[{ d: capsule(r.handF, 1.8, sp, 1.8), f: '#c7ced6' }, { d: ell(sp, 6, 3.6), f: '#c7ced6' }]} /><OG sh={[{ d: `M${r.handB[0] - 16} ${r.handB[1] + 2}H${r.handB[0] + 16}Q${r.handB[0] + 12} ${r.handB[1] + 16} ${r.handB[0]} ${r.handB[1] + 16}Q${r.handB[0] - 12} ${r.handB[1] + 16} ${r.handB[0] - 16} ${r.handB[1] + 2}Z`, f: '#f2e6c8' }]} /></g>} />
      </Scene2>
    );
  },

  /* ───────── gebelik ve doğum ───────── */
  'sf-hs-gebe-beslenme': () => {
    const gy = 196;
    const w: PersonProps = { ...GEBE, x: 124, y: 228, pose: { ...POSE.sitChair, armF: { to: [170, 150] }, armB: { to: [156, 158] }, face: 'calm' } };
    return (
      <Scene2 bg="indoor" gy={gy}>
        <Window x={20} y={40} />
        <Chair x={120} y={228} />
        <Person {...w} mid={(r) => { const c = lerp(r.chest, r.hip, 0.5); return <OG sh={[{ d: `M${c[0] - 4} ${c[1] - 14}Q${c[0] + 18} ${c[1] - 10} ${c[0] + 17} ${c[1] + 4}Q${c[0] + 14} ${c[1] + 14} ${c[0] - 4} ${c[1] + 12}Z`, f: GEBE.top }]} />; }} />
        <Table x={146} y={228} w={164} h={74} />
        <OG sh={[{ d: 'M156 154H204Q200 170 180 170Q160 170 156 154Z', f: '#f6f1e6' }, { d: ell([180, 154], 24, 4), f: '#d9a13a' }]} />
        <OG sh={[{ d: ell([226, 150], 8, 10), f: '#f6efe0' }, { d: ell([242, 152], 8, 10), f: '#f6efe0' }]} />
        <OG sh={[{ d: 'M252 154L262 128Q270 124 274 132L268 154Z', f: K.leaf }, { d: 'M262 154L276 134Q284 132 284 140L274 154Z', f: shade(K.leaf, 0.1) }]} />
        <OG sh={[{ d: 'M282 154V112Q282 106 288 106H298Q304 106 304 112V154Z', f: '#e3f0f5' }, { d: 'M282 154V124H304V154Z', f: tint(K.water, 0.3), no: true }]} />
        <OG sh={[{ d: capsule([168, 152], 1.6, [178, 140], 1.6), f: '#c7ced6' }]} />
      </Scene2>
    );
  },

  'sf-hs-dogum-seti': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: rrect(30, 30, 260, 184, 6), f: '#c9a26b' }, { d: rrect(40, 40, 240, 164, 4), f: '#e8d6b4' }]} />
      <OG sh={[{ d: rrect(50, 50, 80, 64, 3), f: '#cfe6ef' }, { d: 'M50 82H130M90 50V114', st: '#9cc4d4', sw: 1.6 }]} />
      <OG sh={[{ d: rrect(140, 50, 64, 30, 3), f: '#fff' }, { d: rrect(140, 84, 64, 30, 3), f: '#f4f1ea' }, { d: 'M140 62H204M140 96H204', st: '#d8d4c8', sw: 1.2 }]} />
      <OG sh={[{ d: rrect(214, 50, 56, 64, 3), f: '#f2c14e' }, { d: 'M228 50V114M256 50V114', st: shade('#f2c14e', 0.2), sw: 1.2 }]} />
      <OG sh={[{ d: rrect(52, 132, 40, 22, 5), f: '#f3e3a6' }]} />
      <OG sh={[{ d: rrect(104, 136, 34, 18, 2), f: '#fff' }, { d: rrect(110, 141, 22, 8, 1), f: '#c7ced6' }]} />
      <path d="M150 140q14 -8 28 0M150 152q14 -8 28 0" fill="none" stroke={K.out} stroke-width={4.2} stroke-linecap="round" />
      <path d="M150 140q14 -8 28 0M150 152q14 -8 28 0" fill="none" stroke={ROPE} stroke-width={2.4} stroke-linecap="round" />
      <OG sh={[{ d: 'M202 156Q200 130 222 128Q244 130 242 156Z', f: '#f2c14e' }, { d: rrect(199, 152, 46, 12, 5), f: shade('#f2c14e', 0.12) }, { d: circ([222, 126], 6), f: '#f2c14e' }]} />
      <path d="M207 154v8M214 154v8M221 154v8M228 154v8M235 154v8" stroke={shade('#f2c14e', 0.35)} stroke-width={1.3} />
      <OG sh={[{ d: rrect(52, 166, 120, 30, 4), f: '#fff' }, { d: 'M52 176H172M52 186H172', st: '#e2ded4', sw: 1.2 }]} />
      <OG sh={[{ d: rrect(186, 172, 84, 24, 4), f: '#b9d9ea' }]} />
    </Scene2>
  ),

  'sf-hs-dogum-ten-tene': () => {
    const gy = 168;
    const mom: PersonProps = { ...GEBE, x: 150, y: 214, pose: { spine: -132, chest: -122, head: -104, legB: [2, 2], legF: [-2, 2], armB: [60, -20], armF: [40, -40], face: 'calm' } };
    const m = rig(mom);
    const bh: P = [m.chest[0] + 6, m.chest[1] + 2];
    return (
      <Scene2 bg="indoor" gy={gy}>
        <Window x={230} y={30} />
        <OG sh={[{ d: rrect(20, 196, 290, 26, 6), f: '#d9cfbe' }, { d: rrect(14, 110, 12, 112, 3), f: K.wood }]} />
        <Pillow x={112} y={200} w={44} h={72} a={-40} c="#e6ebf0" />
        <Pillow x={134} y={202} w={40} h={56} a={-46} />
        <Person {...mom} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: ell(bh, 13, 12), f: K.skin[0] }, { d: `M${bh[0] - 13} ${bh[1] - 2}Q${bh[0] - 12} ${bh[1] - 16} ${bh[0]} ${bh[1] - 16}Q${bh[0] + 13} ${bh[1] - 16} ${bh[0] + 13} ${bh[1] - 2}Z`, f: '#f2c14e' }]} />
        <path d={`M${bh[0] - 5} ${bh[1] + 3}q2 2 4 0M${bh[0] + 3} ${bh[1] + 3}q2 2 4 0`} stroke={K.out} stroke-width={1.3} fill="none" />
        <OG sh={[{ d: `M${m.neck[0] - 4} ${bh[1] + 8}Q${bh[0] + 30} ${bh[1] + 2} ${bh[0] + 40} ${bh[1] + 30}L230 190Q240 196 236 206H${m.hip[0] - 20}Q${m.hip[0] - 34} ${m.hip[1] - 10} ${m.neck[0] - 4} ${bh[1] + 8}Z`, f: '#9cc0e0' }]} />
        <Person {...mom} only={['armF']} pose={{ ...mom.pose, armF: { to: [bh[0] + 10, bh[1] + 14] } }} />
      </Scene2>
    );
  },

  /* ───────── karantina ───────── */
  'sf-hs-karantina-plan': () => {
    const gy = 176;
    const zone = (x: number, w: number, c: string) => <rect x={x} y={gy} width={w} height={64} fill={c} opacity={0.55} />;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {zone(0, 104, K.danger)}{zone(110, 96, '#e2b33a')}{zone(212, 108, K.safe)}
        <path d={`M107 ${gy - 30}V240M209 ${gy - 30}V240`} stroke="#fff" stroke-width={3} stroke-dasharray="8 6" />
        <HouseExt x={14} y={gy + 26} w={80} h={56} roof={K.danger} />
        <OG sh={[{ d: `M118 ${gy + 26}L158 ${gy - 30}L198 ${gy + 26}Z`, f: '#e2b33a' }, { d: `M158 ${gy - 30}L148 ${gy + 26}H168Z`, f: shade('#e2b33a', 0.45) }]} />
        <HouseExt x={226} y={gy + 26} w={80} h={56} roof={K.safe} />
        <Tippy x={104} y={gy + 52} s={0.5} soap={false} />
        <Tippy x={208} y={gy + 52} s={0.5} soap={false} />
      </Scene2>
    );
  },

  'sf-hs-karantina-oda': () => {
    const gy = 200;
    const p: PersonProps = { ...KAR_H, x: 108, y: 180, s: 0.95, pose: { ...POSE.lieBack, face: 'closed' } };
    return (
      <Scene2 bg="indoor" gy={gy}>
        <OpenWindow x={36} y={40} />
        <OG sh={[{ d: rrect(20, 176, 170, 14, 3), f: K.wood }, { d: rrect(20, 190, 8, 20, 2), f: K.wood }, { d: rrect(182, 190, 8, 20, 2), f: K.wood }, { d: rrect(24, 164, 162, 14, 4), f: '#f4f1ea' }, { d: rrect(28, 154, 30, 12, 5), f: '#fff' }]} />
        <Person {...p} y={166} />
        <Blanket x1={66} x2={184} y={166} h={14} color="#9cc0e0" />
        <OG sh={[{ d: rrect(230, 84, 66, 124, 1), f: '#a8724a' }, { d: rrect(238, 94, 50, 44, 2), f: shade('#a8724a', 0.1) }, { d: rrect(238, 146, 50, 50, 2), f: shade('#a8724a', 0.1) }, { d: circ([240, 150], 3.4), f: '#e2c35a' }]} />
      </Scene2>
    );
  },

  'sf-hs-karantina-bakici': () => {
    const gy = 196;
    const p: PersonProps = { ...KAR_B, x: 176, y: 230, s: 1.2, pose: { ...POSE.stand, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" gy={gy}>
        <OG sh={[{ d: rrect(34, 70, 76, 138, 1), f: '#a8724a' }, { d: rrect(44, 82, 56, 50, 2), f: shade('#a8724a', 0.1) }, { d: rrect(44, 140, 56, 56, 2), f: shade('#a8724a', 0.1) }, { d: circ([100, 144], 3.4), f: '#e2c35a' }]} />
        <Person {...p} over={(r) => <g><GloveOn r={r} k="B" /><GloveOn r={r} k="F" /><MaskFront r={r} /></g>} />
        <Tippy x={268} y={232} s={1} />
      </Scene2>
    );
  },

  /* ───────── ölüm ve defin ───────── */
  'sf-hs-defin-kayit': () => {
    const pen = handAtP({ a: -140, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 8, arm: 160, sleeve: K.role.bystander, skin: 1 }, 'grip', [186, 140]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill="#c9a77a" />
        <OG sh={[{ d: 'M24 40H150V196H24Z', f: '#fbfaf5' }, { d: 'M150 40H276V196H150Z', f: '#f6f3ea' }, { d: 'M150 40V196', st: K.out, sw: 2 }]} />
        {[64, 88, 112, 136, 160].map((y) => <path key={y} d={`M32 ${y}H268`} stroke="#b7c4d2" stroke-width={1.2} />)}
        {[70, 104, 196, 236].map((x) => <path key={x} d={`M${x} 48V188`} stroke="#b7c4d2" stroke-width={1.2} />)}
        {[64, 88, 112].map((y, i) => <path key={i} d={`M36 ${y + 16}q8 -6 16 0t16 0M76 ${y + 16}h20M110 ${y + 16}q8 -5 16 0M158 ${y + 16}h26M200 ${y + 16}h26M240 ${y + 16}h20`} stroke={K.ink} stroke-width={1.6} fill="none" />)}
        <OG sh={[{ d: capsule([160, 158], 2.4, [186, 140], 2.4), f: K.ink }]} />
        <Hand {...pen} />
        <OG sh={[{ d: 'M250 228Q242 200 256 188L252 180H284L280 188Q296 200 288 228Z', f: '#d8c79a' }, { d: rrect(252, 178, 32, 5, 2), f: ROPE }]} />
        <OG sh={[{ d: rrect(286, 196, 26, 18, 3), f: '#fff' }]} />
        <text x={299} y={210} font-size={12} font-weight={700} text-anchor="middle" fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">12</text>
        <path d="M284 186L292 196" stroke={K.out} stroke-width={1.2} />
      </Scene2>
    );
  },

  'sf-hs-defin-yer': () => {
    const s0 = slopeY(0), s1 = slopeY(320);
    return (
      <Scene2 bg="outdoor" gy={236}>
        <path d={`M0 ${s0}L320 ${s1}V240H0Z`} fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <path d={`M0 ${s0 + 6}L320 ${s1 + 6}`} stroke={K.grassShade} stroke-width={3} />
        <Well x={58} y={slopeY(58) + 3} s={1} />
        {[226, 260, 294].map((x) => <g key={x}><OG sh={[{ d: `M${x - 16} ${slopeY(x) + 2}Q${x} ${slopeY(x) - 12} ${x + 16} ${slopeY(x) + 6}Z`, f: SOILD }]} /><OG sh={[{ d: `M${x - 6} ${slopeY(x) - 2}V${slopeY(x) - 26}Q${x} ${slopeY(x) - 34} ${x + 6} ${slopeY(x) - 26}V${slopeY(x) - 2}Z`, f: '#cfc9bb' }]} /></g>)}
        <Dim a={[96, slopeY(96) - 34]} b={[214, slopeY(214) - 34]} text="200 m+" at={[150, slopeY(150) - 62]} />
      </Scene2>
    );
  },

  'sf-hs-defin-derinlik': () => {
    const gy = 62, x0 = 70, x1 = 230, bot = 122, wt = 202;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Soil y={gy} />
        <path d={`M0 ${wt}Q40 ${wt - 4} 80 ${wt}T160 ${wt}T240 ${wt}T320 ${wt}V240H0Z`} fill={K.water} stroke={K.out} stroke-width={1.5} />
        <rect x={x0} y={gy} width={x1 - x0} height={bot - gy} fill={SOILD} stroke={K.out} stroke-width={1.5} />
        <path d={`M${x0} ${gy + 1}Q150 ${gy - 22} ${x1} ${gy + 1}Z`} fill={SOILD} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(x0 + 12, bot - 18, x1 - x0 - 24, 16, 8), f: '#f4f1ea' }, { d: `M${x0 + 50} ${bot - 18}V${bot - 2}M${x1 - 50} ${bot - 18}V${bot - 2}`, st: '#cfc9bb', sw: 1.6 }]} />
        <Dim a={[254, gy + 2]} b={[254, bot]} text="1,5 m" at={[290, (gy + bot) / 2]} />
        <Dim a={[150, bot + 2]} b={[150, wt - 2]} text="2 m+" at={[196, (bot + wt) / 2]} />
      </Scene2>
    );
  },
};

/** Ayakla çalışan el yıkama düzeneği (tippy tap). x = orta, y = zemin. press: pedal basılı */
function Tippy({ x, y, s = 1, press, soap = true }: { x: number; y: number; s?: number; press?: boolean; soap?: boolean }) {
  const tilt = press ? -32 : 0;
  const piv: P = [0, -80];
  const rot = (p: P): P => { const c = Math.cos(tilt * R), n = Math.sin(tilt * R); return [piv[0] + p[0] * c - p[1] * n, piv[1] + p[0] * n + p[1] * c]; };
  const cap = rot([6, 10]);
  const hole = rot([-9, 22]);
  const pedEnd: P = press ? [18, -4] : [18, -16];
  return (
    <G x={x} y={y} s={s}>
      <Stick a={[-26, 0]} b={[-26, -86]} w={3.2} />
      <Stick a={[26, 0]} b={[26, -86]} w={3.2} />
      <path d="M-26 -86l-6 -10M-26 -86l5 -10M26 -86l-5 -10M26 -86l6 -10" stroke={K.out} stroke-width={5} stroke-linecap="round" />
      <path d="M-26 -86l-6 -10M-26 -86l5 -10M26 -86l-5 -10M26 -86l6 -10" stroke={K.trunk} stroke-width={3} stroke-linecap="round" />
      <Stick a={[-34, -88]} b={[34, -88]} w={2.2} />
      <OG sh={[{ d: `M0 -88V${piv[1]}`, st: K.out, sw: 1.6 }]} />
      <G x={piv[0]} y={piv[1]} a={tilt}>
        <Jerry x={0} y={40} s={0.78} c="#e9e3cf" fill={0.6} />
      </G>
      {press && <path d={`M${f1(hole[0])} ${f1(hole[1])}Q${f1(hole[0] - 8)} ${f1(hole[1] + 10)} ${f1(hole[0] - 9)} -16`} fill="none" stroke={K.water} stroke-width={2.6} stroke-linecap="round" />}
      <path d={`M${f1(cap[0])} ${f1(cap[1])}L${pedEnd[0]} ${pedEnd[1]}`} stroke={K.out} stroke-width={1.5} />
      <Stick a={[-20, -1]} b={pedEnd} w={2.4} />
      {soap && (
        <g>
          <path d="M26 -70Q32 -60 33 -52" fill="none" stroke={K.out} stroke-width={1.2} />
          <OG sh={[{ d: rrect(28, -53, 12, 8, 3), f: '#f3e3a6' }]} />
        </g>
      )}
    </G>
  );
}

/** Ağız-burun bezi (önden görünüş) */
function MaskFront({ r }: { r: Rig }) {
  const m = r.mouth, s = r.s;
  return <OG sh={[{ d: rrect(m[0] - 9 * s, m[1] - 7 * s, 18 * s, 12 * s, 4 * s), f: '#f1efe8' }, { d: `M${m[0] - 9 * s} ${m[1] - 4 * s}L${m[0] - 13 * s} ${m[1] - 8 * s}M${m[0] + 9 * s} ${m[1] - 4 * s}L${m[0] + 13 * s} ${m[1] - 8 * s}`, st: K.out, sw: 1 }]} />;
}

/** Açık pencere (kanat dışarı açık). x,y = sol üst */
function OpenWindow({ x, y, w = 70, h = 58 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 2), f: '#f4f1ea' }, { d: rrect(x + 5, y + 5, w - 10, h - 10, 1), f: '#bfe3f5', ln: true }, { d: rrect(x - 5, y + h - 2, w + 10, 7, 2), f: '#f4f1ea' }]} />
      <OG sh={[{ d: `M${x + w - 5} ${y + 5}L${x + w + 18} ${y - 2}V${y + h + 2}L${x + w - 5} ${y + h - 5}Z`, f: '#d6eef8' }]} />
      <path d={`M${x + 14} ${y + 16}q8 -4 16 0M${x + 22} ${y + 28}q8 -4 16 0`} stroke="#fff" stroke-width={2} fill="none" />
    </g>
  );
}

/** Kırmızı uyarı üçgeni */
function Warn({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <path d={`M${x} ${y - r}L${x + r * 1.1} ${y + r * 0.8}H${x - r * 1.1}Z`} fill={K.danger} stroke="#fff" stroke-width={3} stroke-linejoin="round" />
      <path d={`M${x} ${y - r * 0.4}V${y + r * 0.2}M${x} ${y + r * 0.48}V${y + r * 0.5}`} stroke="#fff" stroke-width={3.6} stroke-linecap="round" />
    </g>
  );
}

/** Yatan bacak (yakın plan, soldan sağa; ayak sağda yukarı bakar). y = baldır ekseni */
function Leg({ y, skin = 0 }: { y: number; skin?: number }) {
  const sk = K.skin[skin];
  return (
    <OG
      sh={[
        { d: capsule([10, y - 2], 30, [236, y + 6], 19), f: sk },
        { d: `M226 ${y + 24}Q214 ${y + 10} 226 ${y - 10}L246 ${y - 52}Q256 ${y - 62} 266 ${y - 52}Q272 ${y - 40} 262 ${y - 20}L254 ${y + 14}Q246 ${y + 30} 226 ${y + 24}Z`, f: sk },
        { d: capsule([-30, y - 4], 38, [42, y - 2], 36), f: K.pants.denim },
        { d: `M42 ${y - 38}V${y + 34}`, st: shade(K.pants.denim, 0.3), sw: 2 },
      ]}
    />
  );
}

/** Yara (kırmızı) */
function Wound({ x, y }: { x: number; y: number }) {
  return <OG sh={[{ d: `M${x - 18} ${y}Q${x - 10} ${y - 8} ${x} ${y - 6}Q${x + 14} ${y - 8} ${x + 18} ${y + 1}Q${x + 8} ${y + 8} ${x - 4} ${y + 6}Q${x - 14} ${y + 6} ${x - 18} ${y}Z`, f: '#d0564a' }, { d: `M${x - 8} ${y}Q${x} ${y - 3} ${x + 8} ${y + 1}`, st: '#8e2a22', sw: 2 }]} />;
}

/** Ön kol (yakın plan, soldan sağa; el sağda) */
function Arm({ y, skin = 1, sleeve = K.role.victim }: { y: number; skin?: number; sleeve?: string }) {
  return (
    <g>
      <OG sh={[{ d: capsule([0, y], 28, [244, y + 2], 20), f: K.skin[skin] }, { d: capsule([-30, y], 34, [36, y], 33), f: sleeve }, { d: `M36 ${y - 32}V${y + 32}`, st: shade(sleeve, 0.3), sw: 2 }]} />
      <Hand x={244} y={y + 2} a={90} s={1.05} pose="open" side="R" view="back" skin={skin} arm={0} />
    </g>
  );
}

/** Hasta yer yatağında yarı oturur; bakıcı diz çökmüş bardakla su içiriyor. cover: kapak sürümü */
function drinkScene(cover: boolean) {
  const gy = 160;
  const pat: PersonProps = { ...ATES_H, x: 222, y: 222, s: 1.3, flip: true, pose: { ...POSE.sitFloor, spine: -72, chest: -76, head: -86, armB: { floor: -14 }, armF: [78, 20], legB: [2, 4], legF: [-2, 3], face: 'neutral' } };
  const pr = rig(pat);
  const cup: P = [pr.mouth[0] - 10, pr.mouth[1] + 6];
  const cg: PersonProps = { ...ATES_B, x: 96, y: 230, s: 1.3, pose: { ...POSE.kneelSit, spine: -80, armF: { to: [cup[0] - 6, cup[1] + 6] }, armB: { at: 'kneeF', d: [0, -4] }, face: cover ? 'calm' : 'neutral' } };
  return (
    <Scene2 bg="indoor" gy={gy}>
      <OpenWindow x={150} y={26} />
      {cover && (
        <g>
          <OG sh={[{ d: rrect(36, 40, 50, 64, 2), f: '#fbfaf5' }]} />
          <path d="M42 56H80M42 70H80M42 84H80M58 48V98" stroke="#b7c4d2" stroke-width={1.2} />
          <path d="M44 92L54 76L64 82L76 60" stroke={K.danger} stroke-width={2} fill="none" />
        </g>
      )}
      <OG sh={[{ d: rrect(110, 210, 214, 16, 6), f: '#d9cfbe' }]} />
      <Pillow x={276} y={212} w={40} h={66} a={10} c="#e6ebf0" />
      <Pillow x={258} y={212} w={40} h={60} a={14} />
      <Person {...pat} />
      <Blanket x1={100} x2={226} y={216} h={16} color="#e9eef2" />
      <Person {...cg} over={(r) => <G x={cup[0]} y={cup[1]} a={-30}><OG sh={[{ d: rrect(-8, -12, 16, 22, 3), f: '#e3f0f5' }, { d: rrect(-8, -4, 16, 14, 3), f: tint(K.water, 0.3), no: true }]} /></G>} />
          </Scene2>
  );
}
