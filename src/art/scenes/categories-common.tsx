// Kategori kutuları (rehber ana ekranı) ve ortak sahneler.
// Kategori kutuları hep aynı kalıpta: koyu zemin, ortada kategori renginde koyu bir daire,
// dairenin içinde tek, büyük, hemen okunan bir sembolik sahne.
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Blanket, Bubble, Campfire, Car, Chair, Cloth, Compass, Drop, FirstAidKit, Flame, Flashlight,
  Hand, HouseExt, K, Label, OG, Person, Phone, POSE, Pot, Radio, Scene2, Shake, Sign, Smoke, Stairs, Stove,
  Table, Tent, Timer, Tree, Water, Waves, Whistle, No, Cane, Bandage,
  capsule, circ, ell, handPoint, rig, rrect, shade, tint,
} from '../kit2';
import type { P, PersonProps } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

function smoothPath(pts: P[]): string {
  const n = pts.length;
  const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).join(' ')}`;
  for (let i = 0; i < n; i++) d += `Q${pts[i].join(' ')} ${mid(pts[i], pts[(i + 1) % n]).join(' ')}`;
  return d + 'Z';
}

function blend(a: string, b: string, f: number): string {
  const x = parseInt(a.slice(1), 16);
  const y = parseInt(b.slice(1), 16);
  const m = (sh: number) => Math.round(((x >> sh) & 255) * (1 - f) + ((y >> sh) & 255) * f);
  return '#' + ((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1);
}

const CX = 160, CY = 120, CR = 102;


/** Kategori kutusu çerçevesi: koyu zemin + kategori renginde koyu daire (+ isteğe bağlı zemin). */
let tileUid = 0;
function Tile({ c, children, floor, night, over }: { c: string; children?: ComponentChildren; floor?: string; night?: boolean; over?: ComponentChildren }) {
  const id = 'cat-clip-' + ++tileUid;
  const disc = night ? '#1d2a4a' : blend(c, K.dark, 0.78);
  return (
    <Scene2 bg="dark">
      <circle cx={CX} cy={CY} r={CR + 6} fill={blend(c, K.dark, 0.9)} />
      <circle cx={CX} cy={CY} r={CR} fill={disc} />
      <defs>
        <clipPath id={id}>
          <circle cx={CX} cy={CY} r={CR} />
        </clipPath>
      </defs>
      <g clip-path={`url(#${id})`}>
        {floor && <rect x={0} y={186} width={320} height={60} fill={floor} />}
        {children}
      </g>
      {over}
    </Scene2>
  );
}

/** Kızılay hilali (açık tarafı sağda). c = dış dairenin merkezi */
function Crescent({ x, y, r, color = K.red, ow = 1.5 }: { x: number; y: number; r: number; color?: string; ow?: number }) {
  const px = x + 0.689 * r, py = 0.7245 * r;
  const d = `M${px} ${y - py}A${r} ${r} 0 1 0 ${px} ${y + py}A${0.8 * r} ${0.8 * r} 0 1 1 ${px} ${y - py}Z`;
  return <OG ow={ow} sh={[{ d, f: color }]} />;
}

/** Kalp (merkez x,y; genişlik ≈ 2r) */
const heartD = (x: number, y: number, r: number) =>
  `M${x} ${y + r * 0.95}C${x - r * 0.4} ${y + r * 0.62} ${x - r * 1.05} ${y + r * 0.2} ${x - r * 1.05} ${y - r * 0.3}C${x - r * 1.05} ${y - r * 0.85} ${x - r * 0.45} ${y - r * 1.05} ${x} ${y - r * 0.55}C${x + r * 0.45} ${y - r * 1.05} ${x + r * 1.05} ${y - r * 0.85} ${x + r * 1.05} ${y - r * 0.3}C${x + r * 1.05} ${y + r * 0.2} ${x + r * 0.4} ${y + r * 0.62} ${x} ${y + r * 0.95}Z`;
function Heart({ x, y, r, color = K.danger }: { x: number; y: number; r: number; color?: string }) {
  return (
    <g>
      <OG sh={[{ d: heartD(x, y, r), f: color }, { d: `M${x - r * 0.62} ${y - r * 0.42}Q${x - r * 0.55} ${y - r * 0.72} ${x - r * 0.25} ${y - r * 0.7}`, st: tint(color, 0.5), sw: Math.max(2, r * 0.14) }]} />
    </g>
  );
}

/** Şimşek simgesi (merkez x,y, boy ≈ 2h) */
const boltD = (x: number, y: number, h: number) =>
  `M${x + h * 0.18} ${y - h}L${x - h * 0.42} ${y + h * 0.12}H${x - h * 0.02}L${x - h * 0.2} ${y + h}L${x + h * 0.46} ${y - h * 0.2}H${x + h * 0.04}L${x + h * 0.3} ${y - h}Z`;

/** Yangın söndürücü. x,y = taban ortası */
function Extinguisher({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
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
        ]}
      />
      <path d="M-6 -33H6M-6 -29H3" stroke={K.out} stroke-width={1.6} stroke-linecap="round" />
    </g>
  );
}

/** Radyasyon (trefoil) simgesi. Merkez x,y */
function Trefoil({ x, y, r }: { x: number; y: number; r: number }) {
  const blade = (a: number) => {
    const r0 = r * 0.22, r1 = r * 0.88;
    const p = (rad: number, deg: number) => `${(x + rad * Math.cos((deg * Math.PI) / 180)).toFixed(1)} ${(y + rad * Math.sin((deg * Math.PI) / 180)).toFixed(1)}`;
    return `M${p(r0, a - 30)}L${p(r1, a - 30)}A${r1} ${r1} 0 0 1 ${p(r1, a + 30)}L${p(r0, a + 30)}A${r0} ${r0} 0 0 0 ${p(r0, a - 30)}Z`;
  };
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#f5c518' }]} />
      <g fill={K.ink}>
        {[-90, 30, 150].map((a) => <path key={a} d={blade(a)} />)}
        <circle cx={x} cy={y} r={r * 0.14} />
      </g>
    </g>
  );
}

/** Gaz maskesi (karşıdan). Merkez x,y */
function GasMask({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const rub = '#4a5160';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-44 -30L-58 -40M44 -30L58 -40', st: K.out, sw: 7 / s + 2 },
          { d: 'M-44 -30L-58 -40M44 -30L58 -40', st: '#2f343e', sw: 7 },
          { d: 'M0 -58C30 -58 46 -40 46 -12C46 18 26 38 0 44C-26 38 -46 18 -46 -12C-46 -40 -30 -58 0 -58Z', f: rub },
          { d: 'M20 -54C38 -46 46 -32 46 -12C46 18 26 38 0 44C18 30 30 8 30 -16C30 -34 26 -46 20 -54Z', f: shade(rub, 0.2), no: true },
          { d: circ([-18, -18], 15), f: '#2f343e' },
          { d: circ([18, -18], 15), f: '#2f343e' },
          { d: circ([-18, -18], 11), f: '#9dd5f6', ln: true },
          { d: circ([18, -18], 11), f: '#9dd5f6', ln: true },
          { d: 'M-16 12H16L20 40Q20 50 10 50H-10Q-20 50 -20 40Z', f: '#6b7382' },
          { d: ell([0, 52], 22, 10), f: '#c9a24a' },
          { d: ell([0, 52], 15, 6), f: shade('#c9a24a', 0.25), ln: true },
        ]}
      />
      <path d="M-24 -24L-20 -28M12 -24L16 -28" stroke="#fff" stroke-width={2.4} stroke-linecap="round" opacity={0.8} />
      <path d="M-10 22H10M-10 30H10" stroke="#3b3f4b" stroke-width={2} stroke-linecap="round" />
    </g>
  );
}

/** Sarı uyarı üçgeni (ünlem). x,y = taban ortası, w genişlik */
function WarnTri({ x, y, w = 60, color = '#f5c518', mark = '!' }: { x: number; y: number; w?: number; color?: string; mark?: '!' | 'none' }) {
  const h = w * 0.88;
  return (
    <g>
      <OG sh={[{ d: `M${x} ${y - h}L${x + w / 2} ${y}H${x - w / 2}Z`, f: color }]} ow={2} />
      {mark === '!' && (
        <g fill={K.ink}>
          <path d={`M${x - w * 0.05} ${y - h * 0.68}H${x + w * 0.05}L${x + w * 0.03} ${y - h * 0.3}H${x - w * 0.03}Z`} />
          <circle cx={x} cy={y - h * 0.17} r={w * 0.055} />
        </g>
      )}
    </g>
  );
}

/** Reflektör (ikaz) üçgeni: kırmızı çerçeve, ayaklı. x,y = taban ortası */
function ReflectTri({ x, y, w = 56 }: { x: number; y: number; w?: number }) {
  const h = w * 0.88;
  const iw = w * 0.5, ih = iw * 0.88;
  return (
    <g>
      <OG sh={[{ d: `M${x - w * 0.36} ${y}L${x} ${y - 8}L${x + w * 0.36} ${y}`, st: K.out, sw: 4 }]} />
      <OG
        sh={[
          { d: `M${x} ${y - h - 6}L${x + w / 2} ${y - 6}H${x - w / 2}Z`, f: K.danger },
          { d: `M${x} ${y - 6 - h * 0.25 - ih}L${x + iw / 2} ${y - 6 - h * 0.25}H${x - iw / 2}Z`, f: blend(K.dark, '#ffffff', 0.12), ln: true },
        ]}
        ow={2}
      />
    </g>
  );
}

/** Termometre. x,y = hazne merkezi, a dönüş */
function Thermometer({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: capsule([0, -2], 7, [0, -56], 6), f: '#f4f1ea' }, { d: circ([0, 0], 10), f: K.danger }, { d: capsule([0, -4], 3, [0, -34], 3), f: K.danger, no: true }]} />
      <path d="M3 -16H7M3 -24H7M3 -32H7M3 -40H7M3 -48H7" stroke={K.out} stroke-width={1.4} stroke-linecap="round" />
    </g>
  );
}

/** Su bidonu (damacana / plastik bidon, karşıdan). x,y = taban ortası */
function Jerrycan({ x, y, s = 1, color = '#3a9be0' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-6, -96, 12, 10, 2), f: K.safe },
          { d: rrect(-9, -88, 18, 8, 2), f: tint(color, 0.35) },
          { d: 'M-9 -82Q-30 -78 -30 -60V-8Q-30 0 -22 0H22Q30 0 30 -8V-60Q30 -78 9 -82Z', f: tint(color, 0.25) },
          { d: 'M14 -79Q30 -74 30 -60V-8Q30 0 22 0H14Z', f: color, no: true },
          { d: 'M-30 -54H30M-30 -26H30', st: shade(color, 0.15), sw: 2 },
          { d: 'M-20 -66Q-22 -70 -16 -74', st: '#fff', sw: 3 },
        ]}
      />
    </g>
  );
}

/** Konserve kutusu. x,y = taban ortası */
function TinCan({ x, y, s = 1, label = '#e8a33a' }: { x: number; y: number; s?: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-24 -50V-4Q-24 0 -20 0H20Q24 0 24 -4V-50Z', f: K.metal },
          { d: rrect(-24, -42, 48, 30, 0), f: label },
          { d: rrect(10, -42, 14, 30, 0), f: shade(label, 0.15), no: true },
          { d: ell([0, -50], 24, 6), f: tint(K.metal, 0.25) },
          { d: ell([0, -50], 18, 3.6), f: K.metal, ln: true },
        ]}
      />
      <path d="M-12 -27c4-8 12-8 16 0" stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round" />
    </g>
  );
}

/** Kamp feneri (lamba). x,y = taban ortası */
function Lantern({ x, y, s = 1, glow = true }: { x: number; y: number; s?: number; glow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow && <circle cx={0} cy={-26} r={34} fill="#ffd64a" opacity={0.18} />}
      {glow && <circle cx={0} cy={-26} r={22} fill="#ffd64a" opacity={0.22} />}
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-8 -50Q0 -62 8 -50', st: K.out, sw: 2.4 },
          { d: rrect(-14, -6, 28, 6, 2), f: '#2f6b55' },
          { d: rrect(-11, -42, 22, 36, 3), f: '#fff1a8' },
          { d: rrect(-14, -50, 28, 9, 3), f: '#2f6b55' },
          { d: 'M-11 -24H11M0 -42V-6', st: tint('#e8c64a', 0.1), sw: 1.4 },
        ]}
      />
      <circle cx={0} cy={-24} r={5} fill="#fff" opacity={0.9} />
    </g>
  );
}

/** Ön görünüşte afet çantası (sırt çantası). x,y = taban ortası */
function GoBag({ x, y, s = 1, color = '#e0663c' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-14 -86Q-14 -98 0 -98Q14 -98 14 -86', st: K.out, sw: 7 / s + 2 },
          { d: 'M-14 -86Q-14 -98 0 -98Q14 -98 14 -86', st: shade(color, 0.3), sw: 7 },
          { d: 'M-36 -8V-62Q-36 -88 0 -88Q36 -88 36 -62V-8Q36 0 28 0H-28Q-36 0 -36 -8Z', f: color },
          { d: 'M18 -84Q36 -78 36 -62V-8Q36 0 28 0H18Z', f: shade(color, 0.15), no: true },
          { d: 'M-34 -62Q0 -74 34 -62', st: shade(color, 0.35), sw: 2 },
          { d: rrect(-24, -42, 48, 34, 7), f: shade(color, 0.1) },
          { d: 'M-24 -34H24', st: shade(color, 0.35), sw: 1.6 },
          { d: 'M-5 -62H5V-56H11V-46H5V-40H-5V-46H-11V-56H-5Z', f: '#fff' },
        ]}
      />
    </g>
  );
}

/** Jeneratör (yandan, çerçeveli). x,y = taban ortası */
function Generator({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const body = '#e2b23a';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-46, -12, 92, 12, 2), f: '#3b3f4b' },
          { d: circ([-34, -4], 7), f: '#2b2d3a' },
          { d: circ([34, -4], 7), f: '#2b2d3a' },
          { d: rrect(-40, -58, 80, 46, 6), f: body },
          { d: rrect(14, -58, 26, 46, 6), f: shade(body, 0.15), no: true },
          { d: rrect(-32, -50, 34, 30, 3), f: '#3b3f4b', ln: true },
          { d: rrect(8, -48, 24, 14, 2), f: '#e9ecef', ln: true },
          { d: 'M-44 -64H44', st: K.out, sw: 5 },
          { d: 'M-44 -64V-10M44 -64V-10', st: K.out, sw: 4 },
        ]}
      />
      <path d="M-27 -44H-3M-27 -37H-3M-27 -30H-3" stroke="#59606e" stroke-width={2.2} />
      <circle cx={14} cy={-24} r={3} fill={K.safe} stroke={K.out} />
      <circle cx={26} cy={-24} r={3} fill={K.danger} stroke={K.out} />
    </g>
  );
}

/** Bulut (beyaz / gri). x,y = taban ortası, w genişlik */
function CloudShape({ x, y, w = 100, color = '#e9eef3' }: { x: number; y: number; w?: number; color?: string }) {
  const k = w / 100;
  const d = `M${x - 46 * k} ${y}C${x - 62 * k} ${y} ${x - 62 * k} ${y - 26 * k} ${x - 42 * k} ${y - 28 * k}C${x - 40 * k} ${y - 48 * k} ${x - 14 * k} ${y - 54 * k} ${x - 4 * k} ${y - 40 * k}C${x + 6 * k} ${y - 62 * k} ${x + 40 * k} ${y - 58 * k} ${x + 40 * k} ${y - 30 * k}C${x + 60 * k} ${y - 30 * k} ${x + 62 * k} ${y} ${x + 46 * k} ${y}Z`;
  return <OG sh={[{ d, f: color }, { d: `M${x - 40 * k} ${y - 6 * k}H${x + 44 * k}`, st: shade(color, 0.12), sw: 3 * k }]} />;
}

/** Güneş. Merkez x,y */
function Sun({ x, y, r = 20 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke={K.out} stroke-width={8} stroke-linecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={x + Math.cos(a) * (r + 7)} y1={y + Math.sin(a) * (r + 7)} x2={x + Math.cos(a) * (r + 15)} y2={y + Math.sin(a) * (r + 15)} />;
        })}
      </g>
      <g stroke="#ffc83a" stroke-width={5} stroke-linecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={x + Math.cos(a) * (r + 7)} y1={y + Math.sin(a) * (r + 7)} x2={x + Math.cos(a) * (r + 15)} y2={y + Math.sin(a) * (r + 15)} />;
        })}
      </g>
      <OG sh={[{ d: circ([x, y], r), f: '#ffc83a' }, { d: `M${x + r * 0.2} ${y - r}A${r} ${r} 0 0 1 ${x + r * 0.2} ${y + r}A${r * 1.1} ${r * 1.1} 0 0 0 ${x + r * 0.2} ${y - r}Z`, f: '#f0a92a', no: true }]} />
    </g>
  );
}

/** Kar tanesi. Merkez x,y */
function Snowflake({ x, y, r = 16, color = '#e8f6ff' }: { x: number; y: number; r?: number; color?: string }) {
  const arms = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 2;
    const e: P = [x + Math.cos(a) * r, y + Math.sin(a) * r];
    const m: P = [x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55];
    const b1: P = [m[0] + Math.cos(a - 0.8) * r * 0.32, m[1] + Math.sin(a - 0.8) * r * 0.32];
    const b2: P = [m[0] + Math.cos(a + 0.8) * r * 0.32, m[1] + Math.sin(a + 0.8) * r * 0.32];
    return `M${x} ${y}L${e[0]} ${e[1]}M${m[0]} ${m[1]}L${b1[0]} ${b1[1]}M${m[0]} ${m[1]}L${b2[0]} ${b2[1]}`;
  }).join('');
  return (
    <g stroke-linecap="round">
      <path d={arms} stroke={K.out} stroke-width={r * 0.3 + 3} fill="none" />
      <path d={arms} stroke={color} stroke-width={r * 0.3} fill="none" />
    </g>
  );
}

/** Köpek (yandan, sağa bakar). x,y = arka ayaklar arası taban */
function Dog({ x, y, s = 1, color = '#b9814d', flip }: { x: number; y: number; s?: number; color?: string; flip?: boolean }) {
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

/** Kalkan. Merkez üst x,y; w genişlik */
function Shield({ x, y, w = 140, color = '#5b7fb6' }: { x: number; y: number; w?: number; color?: string }) {
  const h = w * 1.18;
  const hw = w / 2;
  const d = `M${x} ${y}C${x + hw * 0.5} ${y + h * 0.08} ${x + hw * 0.8} ${y + h * 0.08} ${x + hw} ${y + h * 0.04}C${x + hw} ${y + h * 0.5} ${x + hw * 0.8} ${y + h * 0.8} ${x} ${y + h}C${x - hw * 0.8} ${y + h * 0.8} ${x - hw} ${y + h * 0.5} ${x - hw} ${y + h * 0.04}C${x - hw * 0.8} ${y + h * 0.08} ${x - hw * 0.5} ${y + h * 0.08} ${x} ${y}Z`;
  const d2 = `M${x} ${y}C${x + hw * 0.5} ${y + h * 0.08} ${x + hw * 0.8} ${y + h * 0.08} ${x + hw} ${y + h * 0.04}C${x + hw} ${y + h * 0.5} ${x + hw * 0.8} ${y + h * 0.8} ${x} ${y + h}Z`;
  const k = 0.84;
  const ih = h * k, iw = hw * k, iy = y + h * 0.08;
  const d3 = `M${x} ${iy}C${x + iw * 0.5} ${iy + ih * 0.08} ${x + iw * 0.8} ${iy + ih * 0.08} ${x + iw} ${iy + ih * 0.04}C${x + iw} ${iy + ih * 0.5} ${x + iw * 0.8} ${iy + ih * 0.8} ${x} ${iy + ih}C${x - iw * 0.8} ${iy + ih * 0.8} ${x - iw} ${iy + ih * 0.5} ${x - iw} ${iy + ih * 0.04}C${x - iw * 0.8} ${iy + ih * 0.08} ${x - iw * 0.5} ${iy + ih * 0.08} ${x} ${iy}Z`;
  return <OG ow={2} sh={[{ d, f: color }, { d: d2, f: shade(color, 0.14), no: true }, { d: d3, f: 'none', st: tint(color, 0.45), sw: 3 }]} />;
}

/** Musluk (duvardan çıkan). x,y = ağız ucu (suyun aktığı nokta) */
function Faucet({ x, y, s = 1, flowTo }: { x: number; y: number; s?: number; flowTo?: number }) {
  const m = '#b7c1cb';
  return (
    <g>
      {flowTo !== undefined && (
        <g>
          <path d={`M${x - 7 * s} ${y}Q${x - 8 * s} ${(y + flowTo) / 2} ${x - 10 * s} ${flowTo}H${x + 10 * s}Q${x + 8 * s} ${(y + flowTo) / 2} ${x + 7 * s} ${y}Z`} fill={K.waterLight} stroke={K.out} stroke-width={1.3} opacity={0.95} />
          <path d={`M${x - 2 * s} ${y + 8}V${flowTo - 8}`} stroke="#fff" stroke-width={2} opacity={0.8} stroke-linecap="round" />
        </g>
      )}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <OG
          ow={1.5 / s}
          sh={[
            { d: rrect(-200, -46, 150, 18, 4), f: m },
            { d: 'M-56 -46H-6Q12 -46 12 -28V0H-12V-22H-56Z', f: m },
            { d: rrect(-15, -6, 30, 8, 2), f: shade(m, 0.15) },
            { d: rrect(-42, -64, 16, 20, 3), f: shade(m, 0.1) },
            { d: rrect(-52, -70, 36, 8, 4), f: K.danger },
            { d: 'M-50 -40H-12', st: '#fff', sw: 3 },
          ]}
        />
      </g>
    </g>
  );
}

/** Kalem pil. x,y merkez, a dönüş */
function Battery({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-24, -8, 48, 16, 3), f: '#2f3542' }, { d: rrect(4, -8, 20, 16, 3), f: '#e8a33a' }, { d: rrect(24, -4, 5, 8, 1.5), f: K.metal }]} />
      <path d="M-14 0H-8M-11 -3V3" stroke="#fff" stroke-width={1.6} stroke-linecap="round" />
    </g>
  );
}

/** Konuşma/ilaç şişesi (etiketli kahverengi şişe). x,y = taban ortası */
function MedBottle({ x, y, s = 1, a = 0, color = '#b56a2a', cap = '#f4f1ea', label = '#fbfaf7', mark = 'skull' }: { x: number; y: number; s?: number; a?: number; color?: string; cap?: string; label?: string; mark?: 'skull' | 'cross' | 'none' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: 'M-20 -4V-52Q-20 -60 -12 -62V-70H12V-62Q20 -60 20 -52V-4Q20 0 16 0H-16Q-20 0 -20 -4Z', f: color },
          { d: 'M8 -62Q20 -60 20 -52V-4Q20 0 16 0H8Z', f: shade(color, 0.18), no: true },
          { d: rrect(-15, -84, 30, 16, 3), f: cap },
          { d: rrect(-16, -46, 32, 32, 2), f: label },
        ]}
      />
      {mark === 'skull' && (
        <g>
          <path d="M0 -42C-7 -42 -9 -37 -9 -34C-9 -31 -7 -29 -5 -28V-25H5V-28C7 -29 9 -31 9 -34C9 -37 7 -42 0 -42Z" fill={K.ink} />
          <circle cx={-3.5} cy={-34} r={2} fill={label} />
          <circle cx={3.5} cy={-34} r={2} fill={label} />
          <path d="M-9 -22L9 -16M9 -22L-9 -16" stroke={K.ink} stroke-width={2.4} stroke-linecap="round" />
        </g>
      )}
      {mark === 'cross' && <path d="M-3 -38H3V-33H8V-27H3V-22H-3V-27H-8V-33H-3Z" fill={K.danger} />}
    </g>
  );
}

/** Çatlak zemin şeridi */
function CrackedGround({ x1, x2, y, h = 18, color = '#8d8a82' }: { x1: number; x2: number; y: number; h?: number; color?: string }) {
  const mid = x1 + (x2 - x1) * 0.42;
  return (
    <g>
      <OG sh={[{ d: `M${x1} ${y}H${x2}V${y + h}H${x1}Z`, f: color }, { d: `M${x1} ${y}H${x2}V${y + 4}H${x1}Z`, f: tint(color, 0.25), no: true }]} />
      <path d={`M${mid - 8} ${y - 1}L${mid + 2} ${y + 6}L${mid - 6} ${y + 11}L${mid + 6} ${y + h + 1}H${mid - 6}L${mid - 14} ${y + 11}L${mid - 6} ${y + 6}L${mid - 16} ${y - 1}Z`} fill={K.dark} stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />
    </g>
  );
}

/** Asansör kapısı (çelik, çift kanat) + çağrı düğmeleri. x = SOL, y = zemin */
function Elevator({ x, y, w = 92, h = 130 }: { x: number; y: number; w?: number; h?: number }) {
  const st = '#b9c2cc';
  return (
    <g>
      <OG
        sh={[
          { d: rrect(x - 8, y - h - 14, w + 16, h + 14, 2), f: '#8c96a2' },
          { d: rrect(x, y - h, w / 2, h, 1), f: st },
          { d: rrect(x + w / 2, y - h, w / 2, h, 1), f: shade(st, 0.08) },
          { d: rrect(x + w * 0.3, y - h - 11, w * 0.4, 8, 2), f: '#2f3542' },
          { d: rrect(x + w + 14, y - h * 0.55, 14, 28, 3), f: '#8c96a2' },
          { d: circ([x + w + 21, y - h * 0.55 + 8], 4), f: '#e9ecef', ln: true },
          { d: circ([x + w + 21, y - h * 0.55 + 20], 4), f: '#e9ecef', ln: true },
        ]}
      />
      <path d={`M${x + w * 0.42} ${y - h - 5}l4 -4l4 4M${x + w * 0.54} ${y - h - 9}l4 4l4 -4`} stroke="#ffd64a" stroke-width={1.6} fill="none" />
    </g>
  );
}

/** Sağlık çadırı (beyaz, kırmızı hilalli). x,y = taban ortası */
function HealthTent({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#f4f1ea';
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <OG
          ow={1.5 / s}
          sh={[
            { d: 'M-60 0V-46L-40 -76H40L60 -46V0Z', f: c },
            { d: 'M40 -76L60 -46V0H40Z', f: shade(c, 0.12), no: true },
            { d: 'M-60 -46H60', st: K.out, sw: 1.4 },
            { d: 'M-14 0V-34Q0 -42 14 -34V0Z', f: '#5a5f6b' },
          ]}
        />
      </g>
      <Crescent x={x - 6 * s} y={y - 60 * s} r={11 * s} />
    </g>
  );
}

/* ════════════════════════ kategori kutuları ════════════════════════ */

const CAT: Record<string, ArtFn> = {
  'cat-deprem': () => {
    const c = '#f5a524';
    const fig: PersonProps = { x: 190, y: 208, s: 0.8, who: 'woman', role: 'helper', hairC: K.hair.black, pose: { ...POSE.dropCover, armB: { floor: 18 } } };
    return (
      <Tile c={c}>
        <g transform="rotate(-7 140 174)">
          <HouseExt x={86} y={176} w={104} h={72} color="#e6d2b4" roof="#b9533c" />
          <path d="M122 114l6 14l-6 10l8 14l-4 10" stroke={K.out} stroke-width={2} fill="none" stroke-linejoin="round" />
        </g>
        <Shake x1={80} x2={222} y={118} h={34} color={c} />
        <CrackedGround x1={40} x2={280} y={174} h={70} />
        <Person {...fig} />
      </Tile>
    );
  },

  'cat-ilk-yardim': () => {
    const c = '#ef5350';
    return (
      <Tile c={c}>
        <Crescent x={124} y={112} r={84} color={blend(K.red, K.dark, 0.28)} ow={0} />
        <Heart x={160} y={170} r={50} />
        <OG sh={[{ d: capsule([142, -10], 15, [144, 104], 12.5), f: K.role.helper }, { d: capsule([144, 70], 12, [146, 116], 11), f: K.skin[1] }]} />
        <Hand x={146} y={118} a={96} s={1.05} pose="press" side="R" arm={0} skin={1} />
        <Hand x={146} y={108} a={92} s={1.05} pose="press" side="L" view="palm" arm={0} skin={1} />
        <Arrow from={[236, 62]} to={[236, 130]} w={7} />
      </Tile>
    );
  },

  'cat-yaralanma': () => {
    const c = '#fb7185';
    const h = { x: 196, y: 108, a: 35, s: 0.95 };
    // önkol yönü (bilekten geriye): a+90+90
    const fa = ((h.a + 90) * Math.PI) / 180;
    const along = (t: number): P => [h.x + Math.cos(fa) * t, h.y + Math.sin(fa) * t];
    const n = fa + Math.PI / 2;
    const wraps = [capsule(along(10), 14.5, along(84), 16)];
    const lines = [20, 34, 48, 62, 76].map((t) => { const p = along(t), q = along(t - 9); return `M${p[0] + Math.cos(n) * 15} ${p[1] + Math.sin(n) * 15}L${q[0] - Math.cos(n) * 15} ${q[1] - Math.sin(n) * 15}`; }).join('');
    return (
      <Tile c={c}>
        <FirstAidKit x={124} y={192} s={1.45} />
        <Hand {...h} pose="open" side="R" arm={150} sleeve={K.role.victim} skin={2} />
        <OG sh={wraps.map((d) => ({ d, f: K.cloth }))} />
        <path d={lines} stroke={shade(K.cloth, 0.25)} stroke-width={1.6} />
        <Thermometer x={226} y={190} s={0.95} a={18} />
      </Tile>
    );
  },

  'cat-yangin': () => {
    const c = '#ff7043';
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.7)}>
        <Smoke x={86} y={22} w={150} h={46} kind="cloud" op={0.95} />
        <Flame x={170} y={190} s={2.9} />
        <Extinguisher x={98} y={204} s={1.25} />
      </Tile>
    );
  },

  'cat-doga': () => {
    const c = '#4caf6a';
    const hiker: PersonProps = { x: 168, y: 186, s: 0.62, who: 'man', role: 'bystander4', pose: { ...POSE.walk, face: 'calm' } };
    return (
      <Tile c={c}>
        <OG sh={[{ d: 'M60 170L118 70L150 116L176 84L262 170Z', f: '#7d8aa0' }, { d: 'M118 70L104 94L114 92L122 100L132 90Z', f: '#f4f6f8', no: true }, { d: 'M176 84L166 98L176 96L186 100Z', f: '#f4f6f8', no: true }]} />
        <path d="M58 168H262V230H58Z" fill={blend(K.grass, K.dark, 0.25)} />
        <path d="M110 230C130 210 196 210 176 186C170 178 150 178 160 170" fill="none" stroke={K.dirt} stroke-width={14} stroke-linecap="round" />
        <Tree x={90} y={194} kind="pine" s={0.95} />
        <Tree x={238} y={196} kind="pine" s={0.85} />
        <Tree x={118} y={178} kind="pine" s={0.6} />
        <Person {...hiker} back={(r) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.1} color="#c0603e" />} />
      </Tile>
    );
  },

  'cat-hayatta-kalma': () => {
    const c = '#86efac';
    return (
      <Tile c={c} floor={blend(K.dirt, K.dark, 0.45)}>
        <Campfire x={160} y={186} s={2.0} />
        <Compass x={100} y={104} r={27} />
        <g transform="translate(222 108) scale(0.85)">
          <path d="M-30 -6C-40 -60 30 -70 30 -6" stroke={K.out} stroke-width={7} fill="none" />
          <path d="M-30 -6C-40 -60 30 -70 30 -6" stroke="#8a6a44" stroke-width={4} fill="none" />
          <OG sh={[{ d: rrect(-6, -38, 12, 8, 1), f: K.metal }, { d: rrect(-8, -46, 16, 10, 2), f: '#3b3f4b' }, { d: ell([0, 4], 32, 34), f: '#6c8c5a' }, { d: ell([0, 4], 24, 26), f: '#7fa36b', ln: true }]} />
          <path d="M-16 -8Q-14 -18 -4 -20" stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round" opacity={0.7} />
        </g>
      </Tile>
    );
  },

  'cat-nukleer': () => {
    const c = '#e6c229';
    return (
      <Tile c={c}>
        <Trefoil x={116} y={100} r={50} />
        <GasMask x={204} y={136} s={1.0} />
      </Tile>
    );
  },

  'cat-zehirlenme': () => {
    const c = '#ab7df8';
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.65)}>
        <WarnTri x={212} y={186} w={96} />
        <MedBottle x={118} y={190} s={1.55} color="#6b8f3e" cap="#e53935" />
        <Drop x={152} y={210} s={1.3} color="#7fd14a" />
        <Label x={214} y={66} text="114" size={20} />
      </Tile>
    );
  },

  'cat-sel': () => {
    const c = '#4fa3e0';
    return (
      <Tile c={c}>
        <g stroke={tint(c, 0.4)} stroke-width={2.4} stroke-linecap="round" opacity={0.7}>
          {[[80, 40], [110, 30], [210, 34], [240, 50], [130, 56], [190, 22]].map(([x, y], i) => <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 14} />)}
        </g>
        <HouseExt x={102} y={196} w={116} h={84} color="#e6d2b4" roof="#b9533c" />
        <Water x={54} y={150} w={212} h={90} />
        <path d="M62 178q14 -10 28 0t28 0t28 0M160 196q14 -10 28 0t28 0t28 0" stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round" opacity={0.85} />
      </Tile>
    );
  },

  'cat-hava': () => {
    const c = '#7dd3fc';
    return (
      <Tile c={c}>
        <Sun x={110} y={86} r={26} />
        <CloudShape x={176} y={134} w={130} color="#c9d3de" />
        <OG ow={2} sh={[{ d: boltD(158, 172, 34), f: '#ffd64a' }]} />
        <Snowflake x={222} y={182} r={22} />
      </Tile>
    );
  },

  'cat-su-gida': () => {
    const c = '#38bdf8';
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.65)}>
        <Jerrycan x={128} y={194} s={1.45} />
        <Drop x={128} y={118} s={2.2} color="#e9f6ff" />
        <TinCan x={210} y={196} s={1.35} />
      </Tile>
    );
  },

  'cat-barinma': () => {
    const c = '#a3a3a3';
    return (
      <Tile c={c} night floor="#2d3b36">
        <circle cx={210} cy={56} r={18} fill="#f4eccb" />
        <circle cx={202} cy={50} r={16} fill="#1d2a4a" />
        {[[96, 50], [130, 36], [160, 60], [240, 92], [80, 90], [252, 60]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 5}L${x + 1.6} ${y - 1.6}L${x + 5} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 5}L${x - 1.6} ${y + 1.6}L${x - 5} ${y}L${x - 1.6} ${y - 1.6}Z`} fill="#f4eccb" />
        ))}
        <Tent x={138} y={190} s={1.65} color="#e0813c" />
        <Lantern x={214} y={206} s={1.15} />
      </Tile>
    );
  },

  'cat-hazirlik': () => {
    const c = '#3ecf8e';
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.7)}>
        <GoBag x={128} y={190} s={1.32} />
        <Radio x={212} y={168} s={0.88} />
        <Flashlight x={150} y={204} s={1.5} a={-6} beam={false} />
      </Tile>
    );
  },

  'cat-ozel-gruplar': () => {
    const c = '#f472b6';
    const k = 0.78;
    const mom: PersonProps = { x: 150, y: 210, s: 1.22 * k, who: 'woman', role: 'bystander', hairC: K.hair.black, pose: { ...POSE.stand, head: -98, face: 'calm' } };
    const m = rig(mom);
    const elbow: P = [m.shoulderB[0] - 6 * k, m.shoulderB[1] + 30 * k];
    const baby: PersonProps = { x: elbow[0] + 40 * k, y: elbow[1] + 2 * k, ay: 'hip', s: 1.25 * k, who: 'baby', shadow: false, pose: { spine: 192, chest: 196, head: 206, legB: [-70, 10], legF: [-55, 20], armB: [-110, -40], armF: [-80, -20], face: 'closed' } };
    const b = rig(baby);
    const hold: PersonProps = { ...mom, pose: { ...mom.pose, armB: { to: [b.hip[0] + 4 * k, b.hip[1] + 8 * k], bend: 1 }, armF: { to: [b.chest[0] + 6 * k, b.chest[1] + 2 * k], bend: -1 } } };
    const elder: PersonProps = { x: 210, y: 210, s: 0.86, who: 'oldman', role: 'bystander4', pose: { spine: -84, chest: -72, head: -80, legB: [100, 100], legF: [80, 86], armB: [94, 84], armF: { to: [249, 144] } } };
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.72)}>
        <Person {...hold} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...baby} />
        <Person {...hold} only={['armF']} />
        <Cane top={[250, 145]} bottom={[256, 210]} />
        <Person {...elder} />
        <Dog x={84} y={208} s={0.74} />
      </Tile>
    );
  },

  'cat-psikoloji': () => {
    const c = '#c4b5fd';
    const A0: PersonProps = { x: 140, y: 208, s: 0.95, who: 'woman', role: 'bystander', hairC: K.hair.dark, pose: { ...POSE.standSide, spine: -82, head: -74, face: 'closed' } };
    const B0: PersonProps = { x: 186, y: 208, s: 0.95, flip: true, who: 'man', role: 'helper', skin: 2, hairC: K.hair.black, pose: { ...POSE.standSide, spine: -84, head: -80, face: 'closed' } };
    const ra = rig(A0), rb = rig(B0);
    const A: PersonProps = { ...A0, pose: { ...A0.pose, armF: { to: [rb.back[0] + 2, rb.back[1] - 4] }, armB: { to: [rb.back[0] - 2, rb.back[1] + 10] }, handF: 'flat' } };
    const B: PersonProps = { ...B0, pose: { ...B0.pose, armF: { to: [ra.back[0] - 2, ra.back[1] + 6] }, armB: { to: [ra.back[0] + 2, ra.back[1] - 6] }, handF: 'flat' } };
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.72)}>
        <Person {...A} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...B} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...A} only={['armF']} />
        <Person {...B} only={['armF']} />
        <Heart x={163} y={40} r={18} />
      </Tile>
    );
  },

  'cat-tesisat': () => {
    const c = '#fbbf24';
    const pipe = '#9aa4ae';
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.72)}>
        <Generator x={130} y={198} s={1.1} />
        <OG sh={[{ d: rrect(196, 40, 18, 170, 3), f: pipe }, { d: rrect(190, 112, 30, 26, 4), f: shade(pipe, 0.1) }, { d: rrect(214, 120, 40, 10, 4), f: '#f5c518' }]} />
        <OG ow={2} sh={[{ d: boltD(128, 74, 34), f: '#ffd64a' }]} />
        <Drop x={236} y={80} s={2.0} />
      </Tile>
    );
  },

  'cat-guvenlik': () => {
    const c = '#94a3b8';
    const hand: P = [160, 160];
    const adult: PersonProps = { x: 130, y: 214, s: 0.92, who: 'man', role: 'helper', skin: 1, pose: { ...POSE.stand, armF: { to: hand }, face: 'calm' } };
    const kid: PersonProps = { x: 190, y: 214, s: 1.05, who: 'girl', role: 'bystander2', pose: { ...POSE.stand, armB: { to: hand }, face: 'calm' } };
    return (
      <Tile c={c} floor={blend(c, K.dark, 0.72)}>
        <Shield x={160} y={22} w={170} color="#4f78b0" />
        <Person {...adult} />
        <Person {...kid} />
      </Tile>
    );
  },

  'cat-ulasim': () => {
    const c = '#60a5fa';
    const flash = (x: number, y: number, dir: number) => (
      <g stroke="#ffb21f" stroke-width={3.4} stroke-linecap="round">
        {[-35, 0, 35].map((a) => {
          const r = ((a + (dir < 0 ? 180 : 0)) * Math.PI) / 180;
          return <line key={a} x1={x + Math.cos(r) * 10} y1={y + Math.sin(r) * 10} x2={x + Math.cos(r) * 22} y2={y + Math.sin(r) * 22} />;
        })}
      </g>
    );
    return (
      <Tile c={c}>
        <path d="M40 160H280V240H40Z" fill="#4a4f5a" />
        <path d="M70 200H104M138 200H172M206 200H240" stroke="#e9ecef" stroke-width={4} stroke-linecap="round" />
        <Car x={184} y={176} s={1.2} color="#3d7ad6" />
        <rect x={110} y={140} width={8} height={8} rx={2} fill="#ffb21f" stroke={K.out} stroke-width={1.4} />
        <rect x={250} y={142} width={7} height={6} rx={2} fill="#ffb21f" stroke={K.out} stroke-width={1.4} />
        {flash(110, 144, -1)}
        {flash(259, 145, 1)}
        <ReflectTri x={84} y={192} w={46} />
      </Tile>
    );
  },
};

/* ════════════════════════ ortak sahneler ════════════════════════ */

/** Ortak sahnelerin oyuncuları: aynı rehberde birden çok ortak sahne kullanılınca kişi değişmesin. */
const CC = {
  victim: { who: 'man', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.brown } as const,
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2, bottomC: '#6b5a4e' } as const,
};

const COMMON: Record<string, ArtFn> = {
  'call-112': () => {
    const h = { x: 150, y: 240, a: 8, s: 1.55, pose: 'hold' as const, side: 'R' as const, grip: 38 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <circle cx={60} cy={60} r={30} fill="#d6dde5" />
        <circle cx={268} cy={170} r={40} fill="#d6dde5" />
        <Hand {...h} arm={40} sleeve={K.role.helper}>
          <Phone x={g[0]} y={g[1]} s={1.55} a={8} text="112" />
        </Hand>
        <Waves x={g[0] + 46} y={g[1] - 40} a={-20} n={3} r={9} />
      </Scene2>
    );
  },

  'call-114': () => {
    const h = { x: 128, y: 240, a: 6, s: 1.55, pose: 'hold' as const, side: 'R' as const, grip: 38 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={40} sleeve={K.role.bystander}>
          <Phone x={g[0]} y={g[1]} s={1.55} a={6} text="114" />
        </Hand>
        <Waves x={g[0] + 42} y={g[1] - 46} a={-30} n={3} r={8} />
        <MedBottle x={250} y={214} s={1.2} mark="skull" />
      </Scene2>
    );
  },

  'sms-send': () => {
    const px = 160, py = 112;
    return (
      <Scene2 bg="closeup">
        <Hand x={98} y={250} a={30} s={1.5} pose="open" side="L" view="palm" arm={60} sleeve={K.role.helper} skin={1} />
        <Hand x={222} y={250} a={-30} s={1.5} pose="open" side="R" view="palm" arm={60} sleeve={K.role.helper} skin={1} />
        <g transform={`translate(${px} ${py}) scale(2.3)`}>
          <OG ow={1.5 / 2.3} sh={[{ d: rrect(-24, -44, 48, 88, 8), f: '#2f3542' }]} />
          <rect x={-21} y={-39} width={42} height={76} rx={3} fill="#eaf4fb" />
          <path d="M-16 -32H12Q16 -32 16 -28V-20Q16 -16 12 -16H-6L-12 -11V-16H-16Q-18 -16 -18 -18V-30Q-18 -32 -16 -32Z" fill={K.water} />
          <path d="M-12 -26H8M-12 -21H2" stroke="#fff" stroke-width={1.6} stroke-linecap="round" />
          <rect x={-18} y={8} width={26} height={10} rx={5} fill="#fff" stroke="#c4ccd6" stroke-width={0.6} />
          <circle cx={14} cy={13} r={6} fill={K.action} stroke={K.out} stroke-width={0.6} />
          <path d="M11 13H17M14.5 10.5L17 13L14.5 15.5" stroke="#fff" stroke-width={1.3} fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <g fill="#c4ccd6">
            {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5].map((i) => <rect key={r + '-' + i} x={-19 + i * 6.4} y={21 + r * 5} width={5} height={4} rx={1} />))}
          </g>
        </g>
        <OG sh={[{ d: capsule([62, 214], 14, [116, 178], 10), f: K.skin[1] }, { d: capsule([258, 214], 14, [212, 186], 10), f: K.skin[1] }]} />
        <ellipse cx={112} cy={178} rx={6} ry={4.5} transform="rotate(-35 112 178)" fill={tint(K.skin[1], 0.45)} />
        <ellipse cx={216} cy={186} rx={6} ry={4.5} transform="rotate(30 216 186)" fill={tint(K.skin[1], 0.45)} />
      </Scene2>
    );
  },

  'cpr-adult': () => {
    // Kurtarıcı kişinin UZAK yanında, göğüs hizasında diz çökmüş (dizleri kişinin gövdesinin arkasında kalır);
    // kalça dizlerin üstünde, gövde öne eğik; kollar dirsekten kilitli, omuzlar ellerin tam dikey üstünde.
    const victim: PersonProps = { ...CC.victim, x: 172, y: 230, s: 1.5, pose: POSE.lieBack };
    const v = rig(victim);
    const c: P = [v.chest[0], v.chest[1]];
    const resc: PersonProps = {
      ...CC.helper, x: c[0], ax: 'wristF', y: 226, s: 1.5, flip: true,
      pose: { spine: -60, chest: -58, head: -40, legB: [92, 182], legF: [86, 180], armB: [90, 90], armF: [90, 90], handB: { shape: 'flat', a: -90 }, handF: { shape: 'flat', a: -86 }, face: 'neutral' },
    };
    const r = rig(resc);
    return (
      <Scene2 bg="indoor">
        <Person {...resc} />
        <Person {...victim} />
        <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${c[1] - 4}`} stroke="#fff" stroke-width={3.4} stroke-dasharray="5 5" opacity={0.9} />
        <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${c[1] - 4}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="5 5" />
        <Arrow from={[c[0] - 40, 118]} to={[c[0] - 40, 172]} />
        <Label x={250} y={34} text="100–120/dk" size={15} />
      </Scene2>
    );
  },

  'recovery-position': () => {
    // Üst bacak kalçadan ve dizden ~dik açıyla bükülü, dizi önde yerde; alttaki bacak düz.
    const base: PersonProps = { ...CC.victim, x: 192, y: 228, s: 1.62, pose: { ...POSE.recovery, legF: [74, -6], legB: [2, 2] } };
    const r0 = rig(base);
    // Üstteki elin sırtı yanağın altında: el başın alt (yere bakan) yanına gelir.
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [r0.head[0] + 2, r0.head[1] + r0.headR * 0.95] } } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor">
        <Person {...p} />
        <Waves x={r.head[0] - 4} y={r.head[1] - 24} a={-110} n={3} r={6} color={K.water} />
      </Scene2>
    );
  },

  'lie-cover-blanket': () => {
    // Sırtüstü yatan yaralı (bilinci açık, gözleri açık) boynuna kadar örtülü; yardımcı başının yanında diz çökmüş,
    // eli omzunda, onunla konuşuyor. Yer/bağlam detayı yok.
    const victim: PersonProps = { ...CC.victim, x: 186, y: 230, s: 1.35, pose: { ...POSE.lieBack, face: 'worried' } };
    const v = rig(victim);
    // yardımcı yaralının UZAK yanında, göğüs hizasında diz çökmüş, yüzü yaralının yüzüne dönük
    const helper: PersonProps = { ...CC.helper, x: v.chest[0] + 34, y: 214, s: 1.35, flip: true,
      pose: { ...POSE.kneelSit, spine: -72, chest: -56, head: -34, armF: { to: [v.shoulderF[0] + 4, v.shoulderF[1] - 6] }, armB: { at: 'kneeF', d: [8, -4] }, face: 'speak' } };
    const hr = rig(helper);
    return (
      <Scene2 bg="indoor">
        <Person {...helper} only={['legB', 'armB', 'legF', 'torso', 'head']} />
        <Person {...victim} />
        <Blanket x1={v.neck[0] + 4} x2={v.toeF[0] + 10} y={234} h={34} foil />
        <Person {...helper} only={['armF']} />
        <Waves x={hr.mouth[0] - 12} y={hr.mouth[1] + 2} a={160} n={2} r={6} />
      </Scene2>
    );
  },

  'watch-breathing': () => {
    // Derlenme pozisyonunda yan yatan, boynuna kadar örtülü kişi; yardımcı başının yanında diz çökmüş, yüzüne ve göğsüne bakıyor.
    const v0 = rig({ ...CC.victim, x: 222, y: 226, s: 1.18, pose: { ...POSE.recovery, legF: [74, -6], legB: [2, 2] } });
    const victim: PersonProps = { ...CC.victim, x: 222, y: 226, s: 1.18, pose: { ...POSE.recovery, legF: [74, -6], legB: [2, 2], armF: { to: [v0.head[0] + 2, v0.head[1] + v0.headR * 0.95] } } };
    const v = rig(victim);
    const fy = 226;
    const blanket = smoothPath([
      [v.neck[0] + 6, v.neck[1] - 8], [v.shoulderF[0] + 16, v.shoulderF[1] - 13], [v.hip[0] - 8, v.hip[1] - 20], [v.hip[0] + 30, v.hip[1] - 12],
      [v.ankleB[0] - 10, v.ankleB[1] - 10], [Math.max(v.ankleF[0], v.ankleB[0]) - 4, Math.min(v.ankleF[1], v.ankleB[1]) - 18], [Math.max(v.toeB[0], v.toeF[0]) + 12, v.ankleB[1] - 4], [Math.max(v.toeB[0], v.toeF[0]) + 12, fy - 6],
      [v.ankleF[0] + 8, fy - 2], [v.kneeF[0] + 4, v.kneeF[1] + 9], [v.kneeF[0] - 22, fy - 2], [v.neck[0] + 2, fy - 8],
    ]);
    const helper: PersonProps = { ...CC.helper, x: v.head[0] - 66, y: 220, s: 1.18,
      pose: { ...POSE.kneel, spine: -66, chest: -50, head: -22, armF: { to: [v.shoulderF[0] + 2, v.shoulderF[1] + 2] }, handF: 'flat', armB: { at: 'kneeF', d: [10, -4] }, face: 'neutral' } };
    const ch: P = [v.shoulderF[0] + 22, v.shoulderF[1] - 34];
    return (
      <Scene2 bg="indoor">
        <Person {...helper} />
        <Person {...victim} />
        <OG sh={[{ d: blanket, f: '#c1554b' }, { d: `M${v.hip[0] - 20} ${v.hip[1] - 12}l-6 22M${v.hip[0] + 34} ${v.hip[1] - 6}l4 18`, st: shade('#c1554b', 0.25), sw: 1.6 }]} />
        <Arrow from={[ch[0] - 10, ch[1] + 4]} to={[ch[0] - 10, ch[1] - 26]} w={5} />
        <Arrow from={[ch[0] + 10, ch[1] - 26]} to={[ch[0] + 10, ch[1] + 4]} w={5} />
      </Scene2>
    );
  },

  'cover-mouth-cloth': () => {
    // Yakın plan yüz: elle tutulan ıslak bez ağız ve burnu BİRLİKTE kapatıyor; maske yok, boyunda bez yok.
    const p: PersonProps = { x: 150, y: 96, ax: 'head', ay: 'head', s: 2.7, who: 'man', role: 'victim', skin: 1, hairC: K.hair.black, pose: { ...POSE.stand, face: 'worried' } };
    const r = rig(p);
    const m = r.mouth;
    const cy = m[1] + 5; // bez merkezi: burun ile çene arası (üst kenar gözlerin altında)
    const wet = '#a9c9de';
    const cloth = `M${m[0] - 40} ${cy - 18}Q${m[0] - 18} ${cy - 25} ${m[0] + 2} ${cy - 21}Q${m[0] + 24} ${cy - 26} ${m[0] + 42} ${cy - 16}Q${m[0] + 46} ${cy + 4} ${m[0] + 40} ${cy + 24}Q${m[0] + 18} ${cy + 30} ${m[0]} ${cy + 26}Q${m[0] - 22} ${cy + 31} ${m[0] - 40} ${cy + 22}Q${m[0] - 45} ${cy + 2} ${m[0] - 40} ${cy - 18}Z`;
    return (
      <Scene2 bg="closeup">
        <Smoke x={0} y={0} w={320} h={50} op={0.55} />
        <Person {...p} only={['torso', 'head']} />
        <OG sh={[{ d: cloth, f: wet }, { d: `M${m[0] - 30} ${cy - 10}q6 12 2 26M${m[0] + 26} ${cy - 12}q-4 14 2 28`, st: shade(wet, 0.2), sw: 1.6 }]} />
        <Drop x={m[0] - 26} y={cy + 40} s={0.8} />
        <Drop x={m[0] + 6} y={cy + 46} s={0.7} />
        <Drop x={m[0] + 32} y={cy + 38} s={0.6} />
        <Hand x={m[0] + 40} y={cy + 40} a={-42} s={0.82} pose="press" side="R" arm={230} sleeve={K.role.victim} skin={1} />
      </Scene2>
    );
  },

  'wash-hands': () => {
    const foam = [[150, 150, 9], [168, 142, 11], [184, 156, 8], [140, 168, 8], [176, 172, 10], [160, 186, 7], [196, 140, 7], [128, 150, 6]];
    return (
      <Scene2 bg="closeup">
        <Faucet x={166} y={66} s={1.1} flowTo={150} />
        <Hand x={98} y={226} a={50} s={1.25} pose="press" side="L" arm={140} sleeve={K.role.bystander3} skin={1} />
        <Hand x={234} y={226} a={-50} s={1.25} pose="press" side="R" arm={140} sleeve={K.role.bystander3} skin={1} />
        <g>
          {foam.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke="#b9c7d4" stroke-width={1.2} />)}
        </g>
        <Drop x={120} y={200} s={0.8} />
        <Drop x={210} y={204} s={0.7} />
      </Scene2>
    );
  },

  'flush-water-15': () => (
    <Scene2 bg="closeup">
      <Faucet x={150} y={82} s={1.1} flowTo={152} />
      <Hand x={104} y={164} a={-86} s={1.0} pose="open" side="R" view="palm" arm={260} skin={1} />
      {/* sıvanmış kol: su çıplak cilde akıyor */}
      <OG sh={[{ d: capsule([246, 174], 14, [350, 181], 14), f: K.role.victim }]} />
      <g fill="none" stroke={K.waterLight} stroke-width={3} stroke-linecap="round">
        <path d="M136 182q-6 10 -8 22M166 182q8 10 8 24" />
      </g>
      <Drop x={124} y={212} s={0.9} />
      <Drop x={178} y={218} s={0.8} />
      <Timer x={238} y={46} r={15} text="15 dk" />
    </Scene2>
  ),

  'cold-compress': () => {
    const wx = 186, wy = 150;
    return (
      <Scene2 bg="closeup">
        <Hand x={wx + 20} y={wy + 4} a={92} s={1.0} pose="open" side="L" view="back" arm={240} sleeve={K.role.victim} skin={2} />
        <Cloth x={wx - 4} y={wy - 8} w={84} h={46} a={-4} color="#7fb3e0" />
        <g>
          {[[-22, -24], [-6, -27], [10, -25]].map(([dx, dy], i) => (
            <path key={i} d={rrect(wx + dx - 7, wy + dy - 7, 14, 12, 2)} fill="#e6f6ff" stroke={K.out} stroke-width={1.3} />
          ))}
        </g>
        <Hand x={wx - 6} y={wy - 74} a={180} s={0.85} pose="press" side="R" arm={90} sleeve={K.role.helper} skin={0} />
        <Timer x={56} y={46} r={15} text="20 dk" />
      </Scene2>
    );
  },

  'remove-rings': () => {
    const hx = 160, hy = 188, s = 1.9;
    const ring: P = [hx + 4.8 * s, hy - 40 * s];
    return (
      <Scene2 bg="closeup">
        <Hand x={hx} y={hy} a={0} s={s} pose="open" side="R" arm={60} skin={1} />
        <ellipse cx={ring[0]} cy={ring[1]} rx={10} ry={4.5} fill="none" stroke={K.out} stroke-width={6} />
        <ellipse cx={ring[0]} cy={ring[1]} rx={10} ry={4.5} fill="none" stroke="#e8c64a" stroke-width={3.4} />
        <OG sh={[{ d: rrect(hx - 26, hy + 12, 52, 18, 4), f: '#5b4636' }, { d: circ([hx, hy + 21], 13), f: '#d8dde3' }, { d: circ([hx, hy + 21], 9.5), f: '#fbfaf7', ln: true }]} />
        <path d={`M${hx} ${hy + 21}V${hy + 14}M${hx} ${hy + 21}L${hx + 5} ${hy + 23}`} stroke={K.out} stroke-width={1.4} stroke-linecap="round" />
        <Arrow from={[ring[0] + 22, ring[1] - 10]} to={[ring[0] + 34, ring[1] - 62]} w={6} />
        <Arrow from={[hx + 50, hy + 22]} to={[hx + 104, hy + 22]} w={6} />
        <path d={`M${hx - 70} ${hy - 90}c-4 6 -4 12 0 18M${hx + 76} ${hy - 80}c4 6 4 12 0 18`} stroke={K.danger} stroke-width={2.6} fill="none" stroke-linecap="round" opacity={0.6} />
      </Scene2>
    );
  },

  'whistle-signal': () => {
    // Nötr arka planlı yakın plan: dudaklarda düdük, aralıklı kısa ses dalgaları; "6× / 1 dk" + dönen tekrar oku.
    const p: PersonProps = { x: 104, y: 112, ax: 'head', ay: 'head', s: 2.6, who: 'woman', role: 'helper', hair: 'ponytail', hairC: K.hair.dark, skin: 1, pose: { ...POSE.standSide, face: 'closed' } };
    const r = rig(p);
    const wx = r.mouth[0] + 22, wy = r.mouth[1] + 2;
    const rc: P = [262, 150], rr = 22;
    const arc = (a0: number, a1: number) => {
      const q = (a: number): P => [rc[0] + rr * Math.cos((a * Math.PI) / 180), rc[1] + rr * Math.sin((a * Math.PI) / 180)];
      const [x0, y0] = q(a0), [x1, y1] = q(a1);
      return `M${x0} ${y0}A${rr} ${rr} 0 1 1 ${x1} ${y1}`;
    };
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <Whistle x={wx} y={wy} s={1.3} />
        {[0, 1, 2].map((i) => (
          <Waves key={i} x={wx + 26 + i * 30} y={wy - 4 - i * 10} a={-12} n={2} r={7} w={3.6} />
        ))}
        <Label x={262} y={42} text="6× / 1 dk" size={17} />
        <path d={arc(-50, 206)} fill="none" stroke={K.action} stroke-width={5} stroke-linecap="round" />
        {(() => {
          const e: P = [rc[0] + rr * Math.cos((210 * Math.PI) / 180), rc[1] + rr * Math.sin((210 * Math.PI) / 180)];
          const d: P = [Math.cos((300 * Math.PI) / 180), Math.sin((300 * Math.PI) / 180)];
          const n: P = [-d[1], d[0]];
          const tip: P = [e[0] + d[0] * 19, e[1] + d[1] * 19];
          return <path d={`M${tip[0]} ${tip[1]}L${e[0] + n[0] * 9 - d[0] * 3} ${e[1] + n[1] * 9 - d[1] * 3}L${e[0] - n[0] * 9 - d[0] * 3} ${e[1] - n[1] * 9 - d[1] * 3}Z`} fill={K.action} stroke={K.out} stroke-width={1.4} stroke-linejoin="round" />;
        })()}
      </Scene2>
    );
  },

  'battery-radio': () => (
    <Scene2 bg="indoor">
      <Table x={34} y={232} w={252} h={68} />
      <Radio x={146} y={164} s={1.6} />
      <Battery x={238} y={156} s={0.9} />
      <Battery x={248} y={142} a={-12} s={0.9} />
    </Scene2>
  ),

  'boil-water': () => (
    <Scene2 bg="closeup">
      <Stove x={150} y={214} s={2.2} />
      <Pot x={150} y={214 - 26 * 2.2} s={2.2} />
      <Timer x={252} y={52} r={16} text="1 dk" />
    </Scene2>
  ),

  'stay-calm-talk': () => {
    // Endişeli kişi sandalyede oturuyor; yardımcı önünde diz çökmüş, göz hizasında, eli kişinin kolunda, sakin konuşuyor.
    const S = 1.35, fy = 226;
    const sitter: PersonProps = { ...CC.victim, x: 222, y: fy - 44 * S, ay: 'hip', s: S, flip: true,
      pose: { ...POSE.sitChair, spine: -84, chest: -76, head: -96, armB: { at: 'kneeB', d: [-4, -6] }, armF: { at: 'kneeF', d: [-10, -4] }, face: 'worried' } };
    const sr = rig(sitter);
    const helper: PersonProps = { ...CC.helper, x: 108, y: fy, s: S,
      pose: { ...POSE.kneel, spine: -80, chest: -74, head: -84, armF: { to: [sr.wristF[0] + 4, sr.wristF[1] - 2] }, handF: 'flat', armB: [96, 92], face: 'speak' } };
    const hr = rig(helper);
    return (
      <Scene2 bg="indoor">
        <Chair x={232} y={fy} seat={44 * S} s={S} flip />
        <Person {...sitter} />
        <Person {...helper} />
        <Bubble x={hr.mouth[0] - 6} y={hr.mouth[1] - 86} w={62} h={38} tail={[hr.mouth[0] + 6, hr.mouth[1] - 12]}>
          <Waves x={hr.mouth[0] + 10} y={hr.mouth[1] - 67} n={3} r={6} />
        </Bubble>
      </Scene2>
    );
  },

  'go-assembly-area': () => {
    const hand: P = [120, 146];
    const parent: PersonProps = { x: 84, y: 218, who: 'woman', role: 'bystander2', pose: { ...POSE.walk, armF: { to: hand }, face: 'neutral' } };
    const child: PersonProps = { x: 150, y: 218, who: 'boy', role: 'helper', pose: { ...POSE.walk, armB: { to: hand }, face: 'neutral' } };
    const pack = (c: string) => (r: ReturnType<typeof rig>) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} color={c} />;
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={192} kind="pine" s={0.8} />
        <Sign x={250} y={214} w={78} h={56} pole={70} icon="people" />
        <Person {...parent} back={pack('#c0603e')} />
        <Person {...child} back={(r) => <Backpack x={r.back[0] - 7} y={r.neck[1] + 4} s={0.72} color="#4f7fb0" />} />
        <Arrow from={[176, 120]} to={[206, 120]} w={5} />
      </Scene2>
    );
  },

  'no-elevator': () => {
    // Asansör yasak; yanında merdivenden AŞAĞI inen kişi: merdiven sağa doğru yükselir, kişi sola bakar,
    // öndeki ayağı bir alt basamağa iniyor, eli tırabzanda. Ok basamaklar boyunca aşağı-sola.
    const sx = 150, sy = 224, sw = 30, sh = 18, n = 5;
    const stepTop = (i: number) => sy - (i + 1) * sh; // i. basamağın üst yüzü
    const stepX = (i: number) => sx + (i + 0.5) * sw; // i. basamağın ortası
    const rail = (x: number): P => [x, stepTop(0) - 48 - ((x - stepX(0)) * sh) / sw];
    const hand: P = [stepX(2) - 4, rail(stepX(2) - 4)[1] - 3];
    const person: PersonProps = {
      x: stepX(2) - 6, y: stepTop(2) - 50, ay: 'hip', s: 0.95, flip: true, who: 'man', role: 'bystander3', skin: 2,
      pose: {
        spine: -84, chest: -82, head: -70,
        legF: { to: [stepX(1) + 2, stepTop(1) - 4] }, legB: { to: [stepX(2) + 10, stepTop(2) - 4] },
        footB: 180, footF: 180,
        armB: { to: hand }, armF: [100, 110], face: 'neutral',
      },
    };
    const r0 = rail(sx - 4), r1 = rail(sx + n * sw + 10);
    return (
      <Scene2 bg="indoor">
        <Elevator x={18} y={210} w={86} h={124} />
        <No x={61} y={146} r={48} />
        <Stairs x={sx} y={sy} n={n} sw={sw} sh={sh} />
        {/* tırabzan */}
        <path d={`M${stepX(0)} ${stepTop(0)}V${r0[1] + 6}M${stepX(4)} ${stepTop(4)}V${rail(stepX(4))[1]}`} stroke="#7b4e2e" stroke-width={4} stroke-linecap="round" />
        <path d={`M${r0[0]} ${r0[1]}L${r1[0]} ${r1[1]}`} stroke="#7b4e2e" stroke-width={6} stroke-linecap="round" />
        <Person {...person} />
        <Arrow from={[stepX(2) + 8, stepTop(0) - 6]} to={[sx - 30, sy + 6]} w={6} />
      </Scene2>
    );
  },

  'gas-valve-off': () => {
    const vx = 150, vy = 160;
    const h = { x: vx, y: 22, a: 180, s: 1.25, pose: 'hold' as const, side: 'R' as const, grip: 16 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(-10, vy - 13, 340, 26, 2), f: '#c9a24a' }, { d: rrect(-10, vy + 4, 340, 9, 0), f: shade('#c9a24a', 0.15), no: true }, { d: rrect(vx - 26, vy - 20, 52, 40, 6), f: '#d6a838' }, { d: circ([vx, vy - 18], 9), f: '#8d96a0' }]} />
        <path d={`M${vx + 22} ${vy - 18}h40`} stroke="#9aa3ad" stroke-width={10} stroke-linecap="round" stroke-dasharray="1 9" opacity={0.0} />
        <OG sh={[{ d: capsule([vx, vy - 18], 7.5, [g[0], g[1] - 18], 7), f: '#f5c518' }]} />
        <Hand {...h} arm={60} sleeve={K.role.helper} skin={1}>
          <OG sh={[{ d: rrect(g[0] - 8, g[1] - 36, 16, 50, 6), f: '#f5c518' }]} />
        </Hand>
        <path d={`M${vx + 92} ${vy - 22}H${vx + 30}`} stroke="#b8c0c9" stroke-width={14} stroke-linecap="round" opacity={0.55} />
        <Arrow from={[vx + 100, vy - 40]} to={[vx + 36, g[1] - 10]} bend={0.32} w={6} />
      </Scene2>
    );
  },

  'power-off': () => {
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
        <Hand x={mx + 34} y={my - 40} a={200} s={1.2} pose="point" side="L" arm={140} sleeve={K.role.helper} skin={2} />
        <Arrow from={[mx + 50, my + 4]} to={[mx + 50, my + 58]} w={6} />
      </Scene2>
    );
  },

  'first-aid-kit': () => {
    const kx = 34, ky = 70, kw = 252, kh = 150;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(kx + 6, ky - 58, kw - 12, 62, 10), f: shade(K.red, 0.12) }, { d: 'M148 30H172V36H178V42H172V48H148V42H142V36H148Z'.replace(/\d+/g, (n) => n), f: '#fff', no: true }]} />
        <path d="M154 16H166V26H176V38H166V48H154V38H144V26H154Z" fill="#fff" stroke={K.out} stroke-width={1.4} />
        <OG sh={[{ d: rrect(kx, ky, kw, kh, 10), f: K.red }, { d: rrect(kx + 10, ky + 10, kw - 20, kh - 20, 6), f: '#f4efe6' }]} />
        {/* folyo battaniye (katlı paket) */}
        <OG sh={[{ d: rrect(52, 88, 76, 50, 4), f: K.foil }, { d: 'M52 112H128', st: '#fff', sw: 2 }]} />
        <path d="M60 98l10 -4l8 6l12 -5" stroke="#fff" stroke-width={1.6} fill="none" />
        {/* sargı bezi */}
        <Bandage x={160} y={136} s={1.4} />
        {/* eldiven */}
        <OG sh={[{ d: 'M214 140V108Q214 100 220 98V86Q220 82 224 82Q228 82 228 86V96H230V82Q230 78 234 78Q238 78 238 82V96H240V86Q240 82 244 82Q248 82 248 86V100H250V94Q250 90 254 90Q258 90 258 94V116Q258 132 248 140Z', f: '#8fc7e8' }]} />
        {/* flaster */}
        <g transform="rotate(-18 92 176)">
          <OG sh={[{ d: rrect(56, 168, 72, 18, 9), f: '#e9c49a' }, { d: rrect(80, 170, 24, 14, 3), f: '#f7ecd9', ln: true }]} />
        </g>
        <g transform="rotate(8 96 196)">
          <OG sh={[{ d: rrect(66, 188, 64, 16, 8), f: '#e9c49a' }, { d: rrect(86, 190, 22, 12, 3), f: '#f7ecd9', ln: true }]} />
        </g>
        {/* makas */}
        <g transform="translate(206 180) rotate(-20)">
          <OG sh={[{ d: 'M-4 -2L50 -10L50 -6L-2 4Z', f: K.metal }, { d: 'M-4 2L50 10L50 6L-2 -4Z', f: tint(K.metal, 0.2) }, { d: circ([-14, -9], 9), f: K.danger }, { d: circ([-14, 9], 9), f: K.danger }, { d: circ([-14, -9], 4.5), f: '#f4efe6', ln: true }, { d: circ([-14, 9], 4.5), f: '#f4efe6', ln: true }]} />
        </g>
      </Scene2>
    );
  },

  'hospital-go': () => {
    // Yakını, kişiyi kolundan tutarak sağlık çadırına (kırmızı hilal) götürüyor.
    const pat: PersonProps = { ...CC.victim, x: 124, y: 220, s: 1.08, pose: { ...POSE.walk, spine: -86, head: -78, armF: [96, 70], face: 'worried' } };
    const pr = rig(pat);
    const helper: PersonProps = { ...CC.helper, x: 92, y: 228, s: 1.08,
      pose: { ...POSE.walk, armF: { to: [pr.elbowF[0] - 2, pr.elbowF[1] + 2] }, handF: 'mitten', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <HealthTent x={250} y={204} s={1.15} />
        <Person {...pat} />
        <Person {...helper} />
        <Arrow from={[160, 112]} to={[194, 112]} w={5} />
      </Scene2>
    );
  },
};

export const SCENES: Record<string, ArtFn> = { ...CAT, ...COMMON };

