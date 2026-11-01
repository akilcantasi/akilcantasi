// Güvenlik ve düzen (kayıp çocuk, dolandırıcılık, çadır kent, boş ev, yanlış bilgi) ile
// araç ve yolda (kaza, kar, suya düşen araç, arıza/akü, tahliye, tünel/köprü) sahneleri (kit v2).
import type { ComponentChildren } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Backpack, Bad, Blanket, Bubble, Car, Door, Flashlight, Hand, K, Label, No, OG, Ok, Person, POSE, Rock,
  Scene2, Shake, Sign, Smoke, Tent, Timer, Tree, Waves, Wall, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps, Rig, Sh } from '../kit2';

/* ════════════════════════ yardımcılar ════════════════════════ */

const R = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;
const G = ({ x = 0, y = 0, s = 1, a = 0, children }: { x?: number; y?: number; s?: number; a?: number; children?: ComponentChildren }) => (
  <g transform={`translate(${f1(x)} ${f1(y)})${a ? ` rotate(${f1(a)})` : ''}${s !== 1 ? ` scale(${s})` : ''}`}>{children}</g>
);
const lerpP = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const WARN = '#f6c431';
const VEST = '#e7d22e';
const POLICE = '#2f3d63';
const JANDARMA = '#5f6f3f';
const ASPH = '#5d6068';
const ASPH_L = '#6d7078';
const SNOW = '#f2f6f9';
const MUD = '#9c7a52';
const TUNNEL = '#4a4e57';
const NIGHT_PATH = '#4b5a52';
const SCREEN_BG = '#f4f7fb';
const BLUE_UI = '#2f74c8';

/** Bir el sahnede belirli bir noktaya (tip/grip/pinch) gelsin diye bilek konumunu hesaplar */
function handAt(h: Omit<HandProps, 'x' | 'y'>, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): HandProps {
  const p = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - p[0], y: target[1] - p[1] };
}

/** Kırpılmış içerik */
let clipN = 0;
function Clip({ d, children }: { d: string; children?: ComponentChildren }) {
  const id = 'gu-clip-' + ++clipN;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clip-path={`url(#${id})`}>{children}</g>
    </g>
  );
}

/** Ayrıntı balonu (SOL ÜST x,y) */
function Inset({ x, y, w, h, children, bg = '#fff', tail }: { x: number; y: number; w: number; h: number; children?: ComponentChildren; bg?: string; tail?: P }) {
  return (
    <g>
      {tail && <OG sh={[{ d: `M${x + w * 0.4} ${y + h * 0.5}L${tail[0]} ${tail[1]}L${x + w * 0.6} ${y + h * 0.5}Z`, f: bg }]} />}
      <rect x={x + 2} y={y + 3} width={w} height={h} rx={9} fill="#000" opacity={0.15} />
      <rect x={x} y={y} width={w} height={h} rx={9} fill={bg} stroke={K.out} stroke-width={2} />
      <Clip d={rrect(x + 1, y + 1, w - 2, h - 2, 8)}>{children}</Clip>
      <rect x={x} y={y} width={w} height={h} rx={9} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Sarı uyarı üçgeni (MERKEZ) */
function WarnTri({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  const h = r * 1.7;
  const d = `M${x} ${y - h * 0.62}L${x + r} ${y + h * 0.38}H${x - r}Z`;
  return (
    <g>
      <path d={d} fill="#fff" stroke="#fff" stroke-width={5} stroke-linejoin="round" opacity={0.9} />
      <path d={d} fill={WARN} stroke={K.out} stroke-width={1.8} stroke-linejoin="round" />
      <path d={`M${x} ${y - h * 0.3}V${y + h * 0.06}`} stroke={K.ink} stroke-width={r * 0.2} stroke-linecap="round" />
      <circle cx={x} cy={y + h * 0.22} r={r * 0.11} fill={K.ink} />
    </g>
  );
}

/** Numara rozeti */
function Num({ x, y, n, r = 11, c = K.action }: { x: number; y: number; n: number | string; r?: number; c?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 2} fill="#fff" />
      <circle cx={x} cy={y} r={r} fill={c} stroke={K.out} stroke-width={1.6} />
      <text x={x} y={y + r * 0.38} text-anchor="middle" font-size={r * 1.12} font-weight={800} fill={c === K.action ? K.ink : '#fff'} font-family="'IBM Plex Sans', system-ui, sans-serif">
        {n}
      </text>
    </g>
  );
}

/** Ölçü çizgisi (uçlarda dik çentikler) + etiket */
function Dim({ a, b, text, lab, size = 13, c = K.ink, bg = K.white }: { a: P; b: P; text?: string; lab?: P; size?: number; c?: string; bg?: string }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const nx = -Math.sin(ang) * 7, ny = Math.cos(ang) * 7;
  const m = lab ?? lerpP(a, b, 0.5);
  return (
    <g>
      <g stroke="#fff" stroke-width={5.5} stroke-linecap="round" opacity={0.7}>
        <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} />
      </g>
      <g stroke={c} stroke-width={2.4} stroke-linecap="round">
        <path d={`M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`} stroke-dasharray="6 4" />
        <path d={`M${f1(a[0] - nx)} ${f1(a[1] - ny)}L${f1(a[0] + nx)} ${f1(a[1] + ny)}M${f1(b[0] - nx)} ${f1(b[1] - ny)}L${f1(b[0] + nx)} ${f1(b[1] + ny)}`} />
      </g>
      {text && <Label x={m[0]} y={m[1]} text={text} size={size} bg={bg} />}
    </g>
  );
}

/** Gövde üstüne yansıtıcı yelek şeritleri (yan ya da ön görünüş) */
function VestStripes({ r, front }: { r: Rig; front?: boolean }) {
  const half = front ? Math.abs(r.shoulderF[0] - r.shoulderB[0]) * 0.42 : Math.hypot(r.chest[0] - r.back[0], r.chest[1] - r.back[1]) * 0.47;
  const ax = Math.atan2(r.neck[1] - r.hip[1], r.neck[0] - r.hip[0]);
  const px = Math.cos(ax + Math.PI / 2), py = Math.sin(ax + Math.PI / 2);
  const mid = front ? null : lerpP(r.chest, r.back, 0.5);
  const lines = [0.38, 0.62].map((t) => {
    const c0 = lerpP(r.hip, r.neck, t);
    const c = mid ? [c0[0] + (mid[0] - lerpP(r.hip, r.neck, 0.62)[0]) * 0.9, c0[1] + (mid[1] - lerpP(r.hip, r.neck, 0.62)[1]) * 0.9] : c0;
    return `M${f1(c[0] - px * half)} ${f1(c[1] - py * half)}L${f1(c[0] + px * half)} ${f1(c[1] + py * half)}`;
  });
  return (
    <g stroke-linecap="round">
      {lines.map((d, i) => (
        <path key={i} d={d} stroke="#eef1f4" stroke-width={3.2 * r.s} />
      ))}
      {lines.map((d, i) => (
        <path key={'o' + i} d={d} stroke="#9aa3ad" stroke-width={0.8 * r.s} opacity={0.6} />
      ))}
    </g>
  );
}

/** Kasket (polis/jandarma) — ön ya da yan */
function Cap({ r, c = POLICE, front }: { r: Rig; c?: string; front?: boolean }) {
  const H = r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})${r.flip ? ' scale(-1 1)' : ''}`;
  if (front)
    return (
      <g transform={t}>
        <OG ow={1.4} sh={[
          { d: `M${f1(-1.2 * H)} ${f1(-0.78 * H)}Q0 ${f1(-1.62 * H)} ${f1(1.2 * H)} ${f1(-0.78 * H)}L${f1(0.98 * H)} ${f1(-0.5 * H)}H${f1(-0.98 * H)}Z`, f: c },
          { d: rrect(-1.0 * H, -0.62 * H, 2.0 * H, 0.22 * H, 0.08 * H), f: '#1f2533' },
          { d: `M${f1(-0.9 * H)} ${f1(-0.42 * H)}Q0 ${f1(-0.18 * H)} ${f1(0.9 * H)} ${f1(-0.42 * H)}Z`, f: '#1f2533' },
          { d: circ([0, -1.02 * H], 0.16 * H), f: '#e2c35a' },
        ]} />
      </g>
    );
  return (
    <g transform={t}>
      <OG ow={1.4} sh={[
        { d: `M${f1(-1.1 * H)} ${f1(-0.55 * H)}Q${f1(-0.6 * H)} ${f1(-1.5 * H)} ${f1(0.9 * H)} ${f1(-1.05 * H)}L${f1(0.95 * H)} ${f1(-0.5 * H)}Z`, f: c },
        { d: rrect(-1.05 * H, -0.68 * H, 2.0 * H, 0.22 * H, 0.08 * H), f: '#1f2533' },
        { d: `M${f1(0.7 * H)} ${f1(-0.5 * H)}L${f1(1.45 * H)} ${f1(-0.36 * H)}L${f1(0.8 * H)} ${f1(-0.32 * H)}Z`, f: '#1f2533' },
      ]} />
    </g>
  );
}

/** Kafa feneri (yan görünüş, alnın önünde) + huzme */
function HeadLamp({ r, beam = 120 }: { r: Rig; beam?: number }) {
  const H = r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})${r.flip ? ' scale(-1 1)' : ''}`;
  return (
    <g transform={t}>
      <path d={`M${f1(1.15 * H)} ${f1(-0.48 * H)}L${beam} ${f1(-0.4 * H + beam * 0.75)}L${f1(beam * 0.7)} ${f1(-0.4 * H + beam * 1.25)}Z`} fill="#fff3b0" opacity={0.45} />
      <path d={`M${f1(-1.02 * H)} ${f1(-0.42 * H)}L${f1(1.0 * H)} ${f1(-0.62 * H)}`} stroke="#2b2d3a" stroke-width={3} />
      <OG ow={1.2} sh={[{ d: rrect(0.82 * H, -0.82 * H, 0.42 * H, 0.42 * H, 0.08 * H), f: '#3d4250' }, { d: rrect(1.15 * H, -0.76 * H, 0.12 * H, 0.3 * H, 0.04 * H), f: '#fff7c2' }]} />
    </g>
  );
}

/** Büyük akıllı telefon (MERKEZ x,y; w×h). children ekran koordinatında (sahne koordinatı) ekrana kırpılır */
function BigPhone({ x, y, w = 120, h = 200, a = 0, children, screen = SCREEN_BG }: { x: number; y: number; w?: number; h?: number; a?: number; children?: ComponentChildren; screen?: string }) {
  const x0 = x - w / 2, y0 = y - h / 2;
  return (
    <g transform={a ? `rotate(${a} ${x} ${y})` : undefined}>
      <OG sh={[{ d: rrect(x0, y0, w, h, 14), f: '#2f3542' }, { d: rrect(x0 + w - 3, y0 + 40, 4, 22, 1.5), f: '#262b36' }]} />
      <rect x={x0 + 6} y={y0 + 8} width={w - 12} height={h - 16} rx={8} fill={screen} />
      <Clip d={rrect(x0 + 6, y0 + 8, w - 12, h - 16, 8)}>{children}</Clip>
      <rect x={x - 12} y={y0 + 3} width={24} height={3} rx={1.5} fill="#596273" />
    </g>
  );
}
/** Telefonun ekran kutusu */
const scr = (x: number, y: number, w: number, h: number) => ({ x0: x - w / 2 + 6, y0: y - h / 2 + 8, w: w - 12, h: h - 16 });

/** Metin satırı yerine gri çizgiler */
function Lines({ x, y, w, n = 3, gap = 8, c = '#c3cad4', wd = 4, last = 0.6 }: { x: number; y: number; w: number; n?: number; gap?: number; c?: string; wd?: number; last?: number }) {
  return (
    <g stroke={c} stroke-width={wd} stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x} ${y + i * gap}h${f1(i === n - 1 ? w * last : w * (0.92 - (i % 2) * 0.12))}`} />
      ))}
    </g>
  );
}

/** Mesaj balonu (SOL ÜST), sol altında kuyruk */
function Msg({ x, y, w, h, c = '#fff', tailR }: { x: number; y: number; w: number; h: number; c?: string; tailR?: boolean }) {
  const t = tailR ? `M${x + w - 14} ${y + h - 2}L${x + w + 6} ${y + h + 6}L${x + w - 4} ${y + h - 10}Z` : `M${x + 14} ${y + h - 2}L${x - 6} ${y + h + 6}L${x + 4} ${y + h - 10}Z`;
  return <OG ow={1.2} sh={[{ d: rrect(x, y, w, h, 9), f: c }, { d: t, f: c }]} />;
}

/** Profil avatarı (MERKEZ) */
function Avatar({ x, y, r = 9, c = '#8f6fc2', skin = 1 }: { x: number; y: number; r?: number; c?: string; skin?: number }) {
  return (
    <g>
      <Clip d={circ([x, y], r)}>
        <circle cx={x} cy={y} r={r} fill={tint(c, 0.6)} />
        <circle cx={x} cy={y + r * 1.05} r={r * 0.75} fill={c} />
        <circle cx={x} cy={y - r * 0.18} r={r * 0.38} fill={K.skin[skin]} />
      </Clip>
      <circle cx={x} cy={y} r={r} fill="none" stroke={K.out} stroke-width={1.2} />
    </g>
  );
}

/** Çocuk fotoğrafı (SOL ÜST, w×h): gülümseyen çocuk portresi */
function KidPhoto({ x, y, w, h, bg = '#bfe3f5' }: { x: number; y: number; w: number; h: number; bg?: string }) {
  const cx = x + w / 2, cy = y + h * 0.5, r = Math.min(w, h) * 0.24;
  return (
    <g>
      <Clip d={rrect(x, y, w, h, 4)}>
        <rect x={x} y={y} width={w} height={h} fill={bg} />
        <rect x={x} y={y + h * 0.75} width={w} height={h * 0.25} fill={tint(K.grass, 0.2)} />
        <path d={`M${cx - r * 1.7} ${y + h}Q${cx - r * 1.6} ${cy + r * 0.9} ${cx} ${cy + r * 0.95}Q${cx + r * 1.6} ${cy + r * 0.9} ${cx + r * 1.7} ${y + h}Z`} fill={K.role.bystander4} stroke={K.out} stroke-width={1.2} />
        <circle cx={cx} cy={cy} r={r} fill={K.skin[1]} stroke={K.out} stroke-width={1.2} />
        <path d={`M${cx - r * 1.02} ${cy - r * 0.05}Q${cx - r * 0.9} ${cy - r * 1.25} ${cx} ${cy - r * 1.1}Q${cx + r * 1.0} ${cy - r * 1.2} ${cx + r * 1.02} ${cy - r * 0.05}Q${cx + r * 0.4} ${cy - r * 0.75} ${cx - r * 1.02} ${cy - r * 0.05}Z`} fill={K.hair.brown} stroke={K.out} stroke-width={1.1} />
        <circle cx={cx - r * 0.36} cy={cy + r * 0.05} r={r * 0.1} fill={K.ink} />
        <circle cx={cx + r * 0.36} cy={cy + r * 0.05} r={r * 0.1} fill={K.ink} />
        <path d={`M${cx - r * 0.35} ${cy + r * 0.4}Q${cx} ${cy + r * 0.68} ${cx + r * 0.35} ${cy + r * 0.4}`} fill="none" stroke={K.ink} stroke-width={1.3} stroke-linecap="round" />
      </Clip>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke={K.out} stroke-width={1.2} />
    </g>
  );
}

/** Kilit simgesi (MERKEZ) */
function Lock({ x, y, s = 1, c = K.safe, open }: { x: number; y: number; s?: number; c?: string; open?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <path d={open ? 'M-5 -3V-9A5 5 0 0 1 5 -9V-8' : 'M-5 -3V-8A5 5 0 0 1 5 -8V-3'} fill="none" stroke={K.out} stroke-width={3.6 / s + 1.6} stroke-linecap="round" />
      <path d={open ? 'M-5 -3V-9A5 5 0 0 1 5 -9V-8' : 'M-5 -3V-8A5 5 0 0 1 5 -8V-3'} fill="none" stroke={tint(c, 0.15)} stroke-width={2.6} stroke-linecap="round" />
      <OG ow={1.2 / s} sh={[{ d: rrect(-8, -4, 16, 13, 2.5), f: c }]} />
      <circle cx={0} cy={2} r={1.8} fill="#fff" />
    </G>
  );
}

/** Kızılay hilali (MERKEZ) */
function Crescent({ x, y, r = 12, c = K.danger }: { x: number; y: number; r?: number; c?: string }) {
  const ox = x + r * 0.42, rr = r * 0.82;
  const dy = Math.sqrt(Math.max(0, r * r - ((r * r - rr * rr + (ox - x) ** 2) / (2 * (ox - x))) ** 2));
  const ix = x + (r * r - rr * rr + (ox - x) ** 2) / (2 * (ox - x));
  return <path d={`M${f1(ix)} ${f1(y - dy)}A${r} ${r} 0 1 0 ${f1(ix)} ${f1(y + dy)}A${rr} ${rr} 0 1 1 ${f1(ix)} ${f1(y - dy)}Z`} fill={c} stroke={K.out} stroke-width={1} />;
}

/** Mavi doğrulama rozeti (MERKEZ) */
function Verified({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  const pts: P[] = Array.from({ length: 16 }, (_, i) => {
    const rr = i % 2 ? r * 0.8 : r;
    return [x + rr * Math.cos((i * 22.5 - 90) * R), y + rr * Math.sin((i * 22.5 - 90) * R)];
  });
  return (
    <g>
      <path d={`M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')}Z`} fill={BLUE_UI} stroke={K.out} stroke-width={1} />
      <path d={`M${x - r * 0.42} ${y}L${x - r * 0.08} ${y + r * 0.35}L${x + r * 0.45} ${y - r * 0.32}`} fill="none" stroke="#fff" stroke-width={r * 0.26} stroke-linecap="round" stroke-linejoin="round" />
    </g>
  );
}

/** Paylaş simgesi (üç düğüm) MERKEZ */
function ShareIcon({ x, y, r = 8, c = '#fff' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g stroke={c} stroke-width={r * 0.22} fill={c}>
      <path d={`M${x + r * 0.55} ${y - r * 0.6}L${x - r * 0.55} ${y}L${x + r * 0.55} ${y + r * 0.6}`} fill="none" />
      <circle cx={x + r * 0.55} cy={y - r * 0.6} r={r * 0.3} />
      <circle cx={x - r * 0.55} cy={y} r={r * 0.3} />
      <circle cx={x + r * 0.55} cy={y + r * 0.6} r={r * 0.3} />
    </g>
  );
}
/** İlet (sağa dönen ok) simgesi MERKEZ */
function ForwardIcon({ x, y, r = 9, c = '#fff' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g>
      <path d={`M${x - r * 0.8} ${y + r * 0.7}Q${x - r * 0.8} ${y - r * 0.15} ${x + r * 0.2} ${y - r * 0.15}`} fill="none" stroke={c} stroke-width={r * 0.28} stroke-linecap="round" />
      <path d={`M${x + r * 0.05} ${y - r * 0.7}L${x + r * 0.85} ${y - r * 0.15}L${x + r * 0.05} ${y + r * 0.4}Z`} fill={c} />
    </g>
  );
}

/** Kalem (uç noktası x,y; a = kalemin gövdesinin uca göre yönü) */
function Pen({ x, y, a = -120, len = 70, c = BLUE_UI }: { x: number; y: number; a?: number; len?: number; c?: string }) {
  const tip: P = [x, y];
  const d = [Math.cos(a * R), Math.sin(a * R)];
  const p1: P = [x + d[0] * 9, y + d[1] * 9];
  const p2: P = [x + d[0] * len, y + d[1] * len];
  return (
    <OG ow={1.3} sh={[
      { d: capsule(p1, 4.5, p2, 4.5), f: c },
      { d: `M${f1(tip[0])} ${f1(tip[1])}L${f1(p1[0] - d[1] * 4.3)} ${f1(p1[1] + d[0] * 4.3)}L${f1(p1[0] + d[1] * 4.3)} ${f1(p1[1] - d[0] * 4.3)}Z`, f: '#e8d6b0' },
      { d: capsule(lerpP(p1, p2, 0.75), 4.8, p2, 4.8), f: shade(c, 0.25) },
    ]} />
  );
}

/** Not defteri (MERKEZ) */
function Notepad({ x, y, w = 26, h = 32, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG ow={1.2} sh={[{ d: rrect(-w / 2, -h / 2, w, h, 2), f: '#fbfaf5' }, { d: rrect(-w / 2, -h / 2, w, 5, 1.5), f: K.danger }]} />
      <Lines x={-w / 2 + 4} y={-h / 2 + 11} w={w - 8} n={3} gap={6} wd={2} c="#9aa6b5" />
    </G>
  );
}

/** Banka kartı (MERKEZ) */
function BankCard({ x, y, w = 50, h = 32, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG ow={1.3} sh={[{ d: rrect(-w / 2, -h / 2, w, h, 4), f: '#2f74c8' }, { d: `M${-w / 2} ${-h / 2 + 8}H${w / 2}V${-h / 2 + 14}H${-w / 2}Z`, f: '#24303f', no: true }]} />
      <rect x={-w / 2 + 6} y={-1} width={10} height={8} rx={1.5} fill="#e2c35a" stroke={K.out} stroke-width={0.8} />
      <path d={`M${-w / 2 + 6} ${h / 2 - 6}h${w * 0.5}`} stroke="#cfe0f5" stroke-width={2.4} stroke-linecap="round" />
    </G>
  );
}

/** Dizüstü bilgisayar (yan-ön; x = taban ortası, y = masa) children ekranın içine */
function Laptop({ x, y, w = 130, h = 84, children }: { x: number; y: number; w?: number; h?: number; children?: ComponentChildren }) {
  const x0 = x - w / 2, y0 = y - h - 8;
  return (
    <g>
      <OG sh={[
        { d: rrect(x0, y0, w, h, 6), f: '#3a3f4c' },
        { d: `M${x0 - 12} ${y - 8}H${x0 + w + 12}L${x0 + w + 4} ${y}H${x0 - 4}Z`, f: '#b8c0ca' },
      ]} />
      <rect x={x0 + 6} y={y0 + 6} width={w - 12} height={h - 12} rx={3} fill={SCREEN_BG} />
      <Clip d={rrect(x0 + 6, y0 + 6, w - 12, h - 12, 3)}>{children}</Clip>
    </g>
  );
}

/** Saat simgesi (MERKEZ), büyük */
function ClockIcon({ x, y, r = 14, c = '#fff' }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c} stroke={K.out} stroke-width={1.8} />
      <path d={`M${x} ${y - r * 0.6}V${y}L${x + r * 0.45} ${y + r * 0.25}`} fill="none" stroke={K.danger} stroke-width={2.2} stroke-linecap="round" stroke-linejoin="round" />
    </g>
  );
}

/** Takvim simgesi (MERKEZ) */
function Calendar({ x, y, w = 30, h = 30, text }: { x: number; y: number; w?: number; h?: number; text?: string }) {
  return (
    <g>
      <OG ow={1.3} sh={[{ d: rrect(x - w / 2, y - h / 2, w, h, 3), f: '#fff' }, { d: rrect(x - w / 2, y - h / 2, w, h * 0.3, 3), f: K.danger }]} />
      <path d={`M${x - w * 0.25} ${y - h / 2 - 3}v6M${x + w * 0.25} ${y - h / 2 - 3}v6`} stroke={K.out} stroke-width={2.4} stroke-linecap="round" />
      {text && (
        <text x={x} y={y + h * 0.33} text-anchor="middle" font-size={h * 0.36} font-weight={800} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">
          {text}
        </text>
      )}
    </g>
  );
}

/** Harita iğnesi (uç x,y) */
function Pin({ x, y, s = 1, c = K.danger }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.4 / s} sh={[{ d: 'M0 0C-4 -8 -12 -14 -12 -22A12 12 0 0 1 12 -22C12 -14 4 -8 0 0Z', f: c }, { d: circ([0, -22], 4.5), f: '#fff', ln: true }]} />
    </G>
  );
}

/** Lamba direği (taban x,y) */
function LampPost({ x, y, h = 120, glow = true, night = true }: { x: number; y: number; h?: number; glow?: boolean; night?: boolean }) {
  return (
    <g>
      {glow && (
        <g>
          <circle cx={x} cy={y - h + 6} r={36} fill="#fff3b0" opacity={night ? 0.22 : 0.15} />
          <path d={`M${x - 8} ${y - h + 10}L${x - 48} ${y}H${x + 48}L${x + 8} ${y - h + 10}Z`} fill="#fff3b0" opacity={night ? 0.16 : 0.08} />
        </g>
      )}
      <OG sh={[
        { d: rrect(x - 3, y - h, 6, h, 1.5), f: '#5a6170' },
        { d: rrect(x - 7, y - 4, 14, 5, 1.5), f: '#5a6170' },
        { d: `M${x - 11} ${y - h + 2}H${x + 11}L${x + 7} ${y - h - 8}H${x - 7}Z`, f: '#3d4250' },
        { d: ell([x, y - h + 4], 7, 3.5), f: glow ? '#fff2a8' : '#c9ccd2' },
      ]} />
    </g>
  );
}

/** Beyaz afet çadırı (AFAD tipi, yandan) taban ortası */
function WhiteTent({ x, y, s = 1, c = '#eef0f2', dark }: { x: number; y: number; s?: number; c?: string; dark?: boolean }) {
  const cc = dark ? '#8e98a6' : c;
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-34 0V-26L-20 -40H20L34 -26V0Z', f: cc },
        { d: 'M20 -40L34 -26V0H22V-26Z', f: shade(cc, 0.14), no: true },
        { d: 'M-34 -26H34', st: shade(cc, 0.3), sw: 1.4 },
        { d: rrect(-8, -22, 16, 22, 1), f: shade(cc, 0.35), ln: true },
        { d: ell([0, -32], 5, 2), f: '#3d7ad6', no: true },
      ]} />
    </G>
  );
}

/** Seyyar tuvalet konteyneri (taban sol x, y) */
function ToiletBox({ x, y, w = 62, h = 92, c = '#3f8fb8', icon }: { x: number; y: number; w?: number; h?: number; c?: string; icon?: 'w' | 'm' }) {
  return (
    <g>
      <OG sh={[
        { d: rrect(x, y - h, w, h, 3), f: c },
        { d: rrect(x - 3, y - h - 6, w + 6, 8, 2), f: shade(c, 0.2) },
        { d: rrect(x + 8, y - h + 12, w - 16, h - 14, 2), f: tint(c, 0.15), ln: true },
        { d: rrect(x + w - 17, y - h * 0.5, 5, 12, 1.5), f: '#d6dbe1', ln: true },
      ]} />
      {icon && <Pictogram x={x + w / 2} y={y - h + 32} s={0.9} kind={icon} />}
    </g>
  );
}

/** Kadın/erkek simgesi (MERKEZ, beyaz plaka) */
function Pictogram({ x, y, s = 1, kind }: { x: number; y: number; s?: number; kind: 'w' | 'm' }) {
  const c = kind === 'w' ? '#c6574e' : '#2f5fa8';
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.3 / s} sh={[{ d: circ([0, 0], 15), f: '#fff' }]} />
      <circle cx={0} cy={-8} r={3.4} fill={c} />
      {kind === 'w' ? (
        <path d="M-3.4 -3.6H3.4L7 6H3V11H-3V6H-7Z" fill={c} />
      ) : (
        <path d="M-4.6 -3.6H4.6V4H2.8V11H-2.8V4H-4.6Z" fill={c} />
      )}
    </G>
  );
}

/** Kar yağışı */
function SnowFall({ x1 = 0, x2 = 320, y1 = 0, y2 = 200, n = 34, seed = 5, wind = 0, r = 2.2 }: { x1?: number; x2?: number; y1?: number; y2?: number; n?: number; seed?: number; wind?: number; r?: number }) {
  const out = [];
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    const x = x1 + rnd() * (x2 - x1), y = y1 + rnd() * (y2 - y1), rr = r * (0.6 + rnd() * 0.8);
    out.push(wind ? <path key={i} d={`M${f1(x)} ${f1(y)}l${wind} ${f1(wind * 0.35)}`} stroke="#fff" stroke-width={rr} stroke-linecap="round" opacity={0.9} /> : <circle key={i} cx={f1(x)} cy={f1(y)} r={f1(rr)} fill="#fff" opacity={0.9} />);
  }
  return <g>{out}</g>;
}

/** Kar yığını (düz alt) */
const snowPile = (x1: number, x2: number, y: number, h: number) =>
  `M${x1} ${y}C${x1 + (x2 - x1) * 0.15} ${y - h} ${x1 + (x2 - x1) * 0.45} ${y - h * 1.1} ${x1 + (x2 - x1) * 0.6} ${y - h * 0.9}C${x1 + (x2 - x1) * 0.8} ${y - h * 0.8} ${x2 - 4} ${y - h * 0.4} ${x2} ${y}Z`;

/** Dörtlü (sarı yanıp sönen ışık) ışınları */
function Flash({ x, y, r = 6, n = 5, c = '#ffc928' }: { x: number; y: number; r?: number; n?: number; c?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.2} fill={c} opacity={0.28} />
      <g stroke={c} stroke-width={2.4} stroke-linecap="round">
        {Array.from({ length: n }, (_, i) => {
          const a = (-90 + (i - (n - 1) / 2) * (180 / n)) * R;
          return <path key={i} d={`M${f1(x + Math.cos(a) * r * 1.5)} ${f1(y + Math.sin(a) * r * 1.5)}L${f1(x + Math.cos(a) * r * 2.6)} ${f1(y + Math.sin(a) * r * 2.6)}`} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r * 0.75} fill={c} stroke={K.out} stroke-width={1.2} />
    </g>
  );
}

/** Yandan araba (kit Car) + dörtlüler. dir=-1 sola bakar */
function SideCar({ x, y, s = 1, color = '#d0473d', hazard, flip, door, inside }: { x: number; y: number; s?: number; color?: string; hazard?: boolean; flip?: boolean; door?: boolean; inside?: ComponentChildren }) {
  return (
    <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <Car x={x} y={y} s={s} color={color} />
      {inside}
      {door && (
        <OG sh={[{ d: `M${x + 2 * s} ${y - 34 * s}L${x - 6 * s} ${y - 60 * s}L${x - 34 * s} ${y - 48 * s}L${x - 30 * s} ${y - 12 * s}L${x + 2 * s} ${y - 14 * s}Z`, f: shade(color, 0.08) }, { d: `M${x - 3 * s} ${y - 36 * s}L${x - 8 * s} ${y - 54 * s}L${x - 30 * s} ${y - 45 * s}L${x - 28 * s} ${y - 34 * s}Z`, f: '#bfe3f5', ln: true }]} />
      )}
      {hazard && (
        <g>
          <Flash x={x - 60 * s} y={y - 27 * s} r={6 * s} />
          <Flash x={x + 60 * s} y={y - 27 * s} r={6 * s} />
        </g>
      )}
    </g>
  );
}

/** Yukarıdan araba (MERKEZ; a = burnun yönü, 0 = yukarı). L ≈ 64·s */
function TopCar({ x, y, a = 0, s = 1, color = '#d0473d', hazard, amb, brake }: { x: number; y: number; a?: number; s?: number; color?: string; hazard?: boolean; amb?: boolean; brake?: boolean }) {
  const c = amb ? '#f4f4f0' : color;
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG ow={OW_(s)} sh={[
        { d: rrect(-16, -32, 32, 64, 9), f: c },
        { d: `M-13 -14Q0 -20 13 -14L11 -4H-11Z`, f: '#9ccbe6', ln: true },
        { d: `M-11 16H11L13 23Q0 27 -13 23Z`, f: '#9ccbe6', ln: true },
        { d: rrect(-11, -4, 22, 20, 3), f: shade(c, 0.1), ln: true },
        { d: rrect(-19, -18, 4, 7, 1.5), f: shade(c, 0.2) },
        { d: rrect(15, -18, 4, 7, 1.5), f: shade(c, 0.2) },
      ]} />
      <rect x={-13} y={-32} width={7} height={3} rx={1.2} fill="#fff6c4" />
      <rect x={6} y={-32} width={7} height={3} rx={1.2} fill="#fff6c4" />
      <rect x={-13} y={29} width={7} height={3} rx={1.2} fill={brake ? '#ff3b30' : '#b8322c'} />
      <rect x={6} y={29} width={7} height={3} rx={1.2} fill={brake ? '#ff3b30' : '#b8322c'} />
      {brake && (
        <g>
          <circle cx={-9.5} cy={33} r={6} fill="#ff3b30" opacity={0.3} />
          <circle cx={9.5} cy={33} r={6} fill="#ff3b30" opacity={0.3} />
        </g>
      )}
      {amb && (
        <g>
          <path d="M-4 -1H4M0 -5V3" stroke={K.danger} stroke-width={3.2} stroke-linecap="round" transform="translate(0 6)" />
          <rect x={-10} y={-8} width={9} height={4} rx={1.5} fill="#ff3b30" stroke={K.out} stroke-width={0.8} />
          <rect x={1} y={-8} width={9} height={4} rx={1.5} fill="#3a7bff" stroke={K.out} stroke-width={0.8} />
          <circle cx={-5} cy={-6} r={9} fill="#ff3b30" opacity={0.22} />
          <circle cx={6} cy={-6} r={9} fill="#3a7bff" opacity={0.22} />
          <rect x={-16} y={-32} width={32} height={6} rx={3} fill={K.danger} opacity={0.85} />
        </g>
      )}
      {hazard && (
        <g>
          {[[-14, -30], [14, -30], [-14, 30], [14, 30]].map(([hx, hy], i) => (
            <g key={i}>
              <circle cx={hx} cy={hy} r={8} fill="#ffc928" opacity={0.35} />
              <circle cx={hx} cy={hy} r={3.2} fill="#ffc928" stroke={K.out} stroke-width={0.9} />
            </g>
          ))}
        </g>
      )}
    </G>
  );
}
const OW_ = (s: number) => 1.5 / s;

/** Kırmızı üçgen reflektör (taban ortası) */
function Reflector({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <path d="M-12 0L-9 3M12 0L9 3" stroke={K.out} stroke-width={2} />
      <OG ow={1.4 / s} sh={[{ d: 'M0 -24L14 0H-14Z', f: '#e53935' }, { d: 'M0 -14L6 -4H-6Z', f: '#f7e6e4' }]} />
    </G>
  );
}

/** Asfalt yol (yukarıdan, yatay) */
function RoadH({ y, h, lanes = 2, shoulder = 0, dash = true }: { y: number; h: number; lanes?: number; shoulder?: number; dash?: boolean }) {
  const lw = (h - shoulder) / lanes;
  return (
    <g>
      <rect x={0} y={y} width={320} height={h} fill={ASPH} />
      <rect x={0} y={y + 2} width={320} height={2.5} fill="#f4f1ea" />
      <rect x={0} y={y + h - lanes * 0 - shoulder - 1.2} width={320} height={2.5} fill="#f4f1ea" />
      {dash && Array.from({ length: lanes - 1 }, (_, i) => (
        <path key={i} d={`M0 ${f1(y + lw * (i + 1))}H320`} stroke="#f4f1ea" stroke-width={2.5} stroke-dasharray="16 12" />
      ))}
      {shoulder > 0 && <rect x={0} y={y + h - 4} width={320} height={2.5} fill="#f4f1ea" />}
    </g>
  );
}

/** Direksiyon (MERKEZ) */
function Wheel({ x, y, r = 50 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <OG sh={[
        { d: `${circ([x, y], r)}${circ([x, y], r - 9)}`, f: '#2f333d', fr: 'evenodd' },
        { d: capsule([x - r + 6, y + 4], 5, [x - 12, y + 6], 7), f: '#2f333d' },
        { d: capsule([x + r - 6, y + 4], 5, [x + 12, y + 6], 7), f: '#2f333d' },
        { d: capsule([x, y + 16], 6, [x, y + r - 6], 5), f: '#2f333d' },
        { d: ell([x, y + 6], 17, 14), f: '#3c414c' },
      ]} />
      <circle cx={x} cy={y + 6} r={5} fill="#596273" />
    </g>
  );
}

/** Araba anahtarı (tutamak ortası x,y; a = metal ucun yönü) */
function CarKey({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <G x={x} y={y} a={a} s={s}>
      <OG ow={1.3 / s} sh={[
        { d: 'M8 -3H26L28 -1L26 1H22V3H18V1H8Z', f: '#c9ccd2' },
        { d: rrect(-12, -8, 22, 16, 6), f: '#2f333d' },
      ]} />
      <circle cx={-4} cy={0} r={2.5} fill="#596273" />
    </G>
  );
}

/** Kum saati (MERKEZ) */
function Hourglass({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={1.4 / s} sh={[
        { d: 'M-12 -18L12 -18L2 0L12 18H-12L-2 0Z', f: '#eaf4fb' },
        { d: 'M-6 -9H6L1 -1H-1Z', f: '#e2b65a', no: true },
        { d: 'M0 2L8 15H-8Z', f: '#e2b65a', no: true },
        { d: rrect(-15, -22, 30, 5, 2), f: K.wood },
        { d: rrect(-15, 17, 30, 5, 2), f: K.wood },
      ]} />
      <path d="M0 0V12" stroke="#e2b65a" stroke-width={1.4} />
    </G>
  );
}

/** Akü (yukarıdan; MERKEZ). full: dolu (yeşil gösterge) */
function Battery({ x, y, full, w = 98, h = 62 }: { x: number; y: number; full?: boolean; w?: number; h?: number }) {
  const x0 = x - w / 2, y0 = y - h / 2;
  return (
    <g>
      <OG sh={[
        { d: rrect(x0, y0, w, h, 6), f: '#3a3f4c' },
        { d: rrect(x0 + 6, y0 + 6, w - 12, h - 12, 4), f: '#454b59', ln: true },
        { d: circ([x0 + 18, y0 + 18], 9), f: '#c9a24a' },
        { d: circ([x0 + w - 18, y0 + 18], 9), f: '#9aa3ad' },
      ]} />
      <circle cx={x0 + 18} cy={y0 + 18} r={4} fill="#a6822f" />
      <circle cx={x0 + w - 18} cy={y0 + 18} r={4} fill="#7b838d" />
      <text x={x0 + 18} y={y0 + 46} text-anchor="middle" font-size={18} font-weight={800} fill={K.danger} font-family="'IBM Plex Sans', system-ui, sans-serif">+</text>
      <text x={x0 + w - 18} y={y0 + 46} text-anchor="middle" font-size={18} font-weight={800} fill="#e8edf3" font-family="'IBM Plex Sans', system-ui, sans-serif">−</text>
      <g transform={`translate(${x} ${y + 10})`}>
        <rect x={-13} y={-7} width={24} height={14} rx={2} fill="none" stroke="#fff" stroke-width={1.8} />
        <rect x={11} y={-3} width={3} height={6} fill="#fff" />
        {full ? (
          <rect x={-10.5} y={-4.5} width={19} height={9} fill={K.safe} />
        ) : (
          <rect x={-10.5} y={-4.5} width={4} height={9} fill={K.danger} />
        )}
      </g>
    </g>
  );
}

/** Takviye kablosu maşası (ağız x,y; a = sapın yönü) */
function Clamp({ x, y, a = 90, c = K.danger, s = 1 }: { x: number; y: number; a?: number; c?: string; s?: number }) {
  return (
    <G x={x} y={y} a={a - 90} s={s}>
      <OG ow={1.3 / s} sh={[
        { d: 'M-7 0L-9 12L-6 34H6L9 12L7 0Z', f: c },
        { d: 'M-8 -6H8L6 2H-6Z', f: '#c9a24a' },
        { d: 'M0 12V30', st: shade(c, 0.3), sw: 1.6 },
      ]} />
    </G>
  );
}

/** Kablo (yumuşak) */
function Cable({ pts, c = K.danger, w = 5 }: { pts: P[]; c?: string; w?: number }) {
  const d = smooth(pts);
  return (
    <g fill="none" stroke-linecap="round">
      <path d={d} stroke={K.out} stroke-width={w + 3} />
      <path d={d} stroke={c} stroke-width={w} />
    </g>
  );
}

/** Kıvılcım (MERKEZ) */
function Spark({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  const pts: P[] = Array.from({ length: 16 }, (_, i) => {
    const rr = i % 2 ? r * 0.42 : r;
    return [x + rr * Math.cos((i * 22.5 - 90) * R), y + rr * Math.sin((i * 22.5 - 90) * R)];
  });
  return <path d={`M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L')}Z`} fill={K.fireCore} stroke={K.fire} stroke-width={1.6} stroke-linejoin="round" />;
}

/** Elektrik direği (taban x,y; a eğiklik) */
function PowerPole({ x, y, h = 150, a = 0 }: { x: number; y: number; h?: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG sh={[
        { d: rrect(-4, -h, 8, h, 2), f: '#8a6a4a' },
        { d: rrect(-26, -h + 12, 52, 6, 2), f: '#8a6a4a' },
        { d: rrect(-24, -h + 6, 4, 7, 1), f: '#dfe4ea' },
        { d: rrect(20, -h + 6, 4, 7, 1), f: '#dfe4ea' },
      ]} />
    </G>
  );
}

/** Bariyer (otoyol çelik korkuluk, yandan/önden; x1..x2, y = zemin) */
function GuardRail({ x1, x2, y, h = 34 }: { x1: number; x2: number; y: number; h?: number }) {
  const posts = [];
  for (let x = x1 + 10; x < x2; x += 40) posts.push(<path key={x} d={rrect(x - 3, y - h + 6, 6, h - 6, 1)} />);
  return (
    <g>
      <g fill="#8e98a3" stroke={K.out} stroke-width={1.4}>{posts}</g>
      <OG sh={[{ d: rrect(x1, y - h, x2 - x1, 14, 3), f: '#c7ced6' }, { d: `M${x1} ${y - h + 7}H${x2}`, st: '#9aa3ad', sw: 1.6 }]} />
    </g>
  );
}

/** Kürek (sap a → ağız b) */
function Shovel({ a, b, c = '#d84a3a' }: { a: P; b: P; c?: string }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const deg = ang / R;
  return (
    <g>
      <OG sh={[{ d: capsule(a, 2.6, b, 2.6), f: K.wood }]} />
      <G x={b[0]} y={b[1]} a={deg - 90}>
        <OG sh={[{ d: 'M-12 0H12L10 24Q0 30 -10 24Z', f: c }]} />
      </G>
    </g>
  );
}

/** Cam kırıcı çekiç (sap ucu a → baş b) */
function Breaker({ a, b }: { a: P; b: P }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  return (
    <g>
      <OG sh={[{ d: capsule(a, 6, b, 6), f: K.danger }]} />
      <G x={b[0]} y={b[1]} a={ang + 90}>
        <OG sh={[{ d: 'M-22 -6H14L24 0L14 6H-22Z', f: '#9aa3ad' }, { d: 'M14 -6L24 0L14 6Z', f: '#d6dbe1' }]} />
      </G>
    </g>
  );
}

/** Kask (motosiklet; baş üstüne, rig ile, yan görünüş) */
function MotoHelmet({ r, c = '#2f5fa8' }: { r: Rig; c?: string }) {
  const H = r.headR;
  const t = `translate(${f1(r.head[0])} ${f1(r.head[1])}) rotate(${f1(r.headA + 90)})${r.flip ? ' scale(-1 1)' : ''}`;
  return (
    <g transform={t}>
      <OG ow={1.4} sh={[
        { d: smooth([[-1.3 * H, 0.9 * H], [-1.45 * H, -0.3 * H], [-0.6 * H, -1.4 * H], [0.7 * H, -1.35 * H], [1.4 * H, -0.3 * H], [1.4 * H, 0.75 * H], [0.5 * H, 1.15 * H], [-0.6 * H, 1.15 * H]], true, 0.9), f: c },
        { d: smooth([[0.25 * H, -0.45 * H], [1.38 * H, -0.42 * H], [1.4 * H, 0.35 * H], [0.35 * H, 0.3 * H]], true, 0.7), f: '#2b3946' },
        { d: `M${f1(-0.9 * H)} ${f1(-0.9 * H)}Q${f1(-0.2 * H)} ${f1(-1.3 * H)} ${f1(0.5 * H)} ${f1(-1.15 * H)}`, st: tint(c, 0.4), sw: 2.6 },
      ]} />
    </g>
  );
}

/** Akan çamurlu su (SOL ÜST) */
function Flood({ x, y, w, h, c = MUD, flow = 3 }: { x: number; y: number; w: number; h: number; c?: string; flow?: number }) {
  let top = `M${x} ${y}`;
  for (let xx = x; xx < x + w - 0.1; xx += 20) top += 'q5 -3 10 0t10 0';
  const lc = tint(c, 0.42);
  return (
    <g>
      <OG sh={[{ d: `${top}V${y + h}H${x}Z`, f: c }]} />
      <g fill="none" stroke={lc} stroke-width={2.4} stroke-linecap="round">
        {Array.from({ length: flow }, (_, i) => {
          const yy = y + 8 + (i * (h - 12)) / Math.max(1, flow);
          const x0 = x + 10 + ((i * 53) % Math.max(10, w - 60));
          return <path key={i} d={`M${x0} ${yy}q8 -4 16 0t16 0M${x0 + 26} ${yy - 4}l6 4l-6 4`} />;
        })}
      </g>
    </g>
  );
}

/** U-dönüş oku (turuncu) — başlangıç a, geri dönüş */
function UArrow({ x, y, w = 50, h = 40, dir = -1, color = K.action }: { x: number; y: number; w?: number; h?: number; dir?: 1 | -1; color?: string }) {
  // x,y = başlangıç noktası, önce yukarı çıkar, kıvrılır, aşağı iner
  const x2 = x + dir * w;
  const d = `M${x} ${y}V${y - h + w / 2}A${w / 2} ${w / 2} 0 0 ${dir < 0 ? 0 : 1} ${x2} ${y - h + w / 2}V${y - 8}`;
  const hp = `M${x2} ${y + 4}L${x2 - 9} ${y - 10}H${x2 + 9}Z`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={9} />
      <path d={hp} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} fill="none" stroke={color} stroke-width={6} />
      <path d={hp} fill={color} />
    </g>
  );
}

/** Tehlikeli/ şüpheli arayan simgesi (şapkalı silüet) MERKEZ */
function Shady({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#3b3f4b" stroke={K.out} stroke-width={1.4} />
      <circle cx={x} cy={y - r * 0.1} r={r * 0.38} fill="#20232b" />
      <path d={`M${x - r * 0.62} ${y - r * 0.3}H${x + r * 0.62}`} stroke="#20232b" stroke-width={3} stroke-linecap="round" />
      <path d={`M${x - r * 0.38} ${y - r * 0.3}Q${x} ${y - r * 0.95} ${x + r * 0.38} ${y - r * 0.3}Z`} fill="#20232b" />
      <path d={`M${x - r * 0.55} ${y + r * 0.85}Q${x} ${y + r * 0.2} ${x + r * 0.55} ${y + r * 0.85}`} fill="#20232b" />
      <text x={x + r * 0.95} y={y - r * 0.4} font-size={r * 1.1} font-weight={800} fill={K.danger} font-family="'IBM Plex Sans', system-ui, sans-serif">?</text>
    </g>
  );
}

/** Şeritli "girilemez" bandı (a→b) */
function Tape({ a, b, w = 9 }: { a: P; b: P; w?: number }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
  const n = Math.ceil(len / 12);
  return (
    <G x={a[0]} y={a[1]} a={ang}>
      <rect x={0} y={-w / 2} width={len} height={w} fill="#fff" stroke={K.out} stroke-width={1.2} />
      {Array.from({ length: n }, (_, i) => (i % 2 ? null : <path key={i} d={`M${i * 12} ${-w / 2}h8l-4 ${w}h-8z`} fill={K.danger} />))}
      <rect x={0} y={-w / 2} width={len} height={w} fill="none" stroke={K.out} stroke-width={1.2} />
    </G>
  );
}

/** Belge poşeti (MERKEZ) */
function DocPouch({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <rect x={-24} y={-18} width={44} height={32} rx={2} fill="#fbfaf5" stroke={K.out} stroke-width={1.2} transform="rotate(-4)" />
      <Lines x={-18} y={-10} w={30} n={3} gap={6} wd={2} c="#9aa6b5" />
      <OG ow={1.2} sh={[{ d: rrect(-28, -20, 56, 40, 3), f: '#bfe3f5', op: 0.55 }, { d: rrect(-28, -20, 56, 7, 2), f: '#3d7ad6' }]} />
    </G>
  );
}
/** İlaç kutusu (MERKEZ) */
function PillBox({ x, y, a = 0 }: { x: number; y: number; a?: number }) {
  return (
    <G x={x} y={y} a={a}>
      <OG ow={1.2} sh={[{ d: rrect(-20, -13, 40, 26, 2), f: '#fbfaf5' }, { d: rrect(-20, -13, 12, 26, 2), f: K.safe }]} />
      <path d="M2 -5V5M-3 0H7" stroke={K.danger} stroke-width={3} stroke-linecap="round" />
    </G>
  );
}
/** Büzgülü küçük kese (MERKEZ) */
function Pouch({ x, y, a = 0, c = '#8f6fc2' }: { x: number; y: number; a?: number; c?: string }) {
  return (
    <G x={x} y={y} a={a}>
      <OG ow={1.2} sh={[{ d: 'M-8 -12Q-20 -2 -16 10Q-10 16 0 16Q10 16 16 10Q20 -2 8 -12Z', f: c }, { d: 'M-9 -12Q0 -17 9 -12L6 -9Q0 -12 -6 -9Z', f: shade(c, 0.2) }]} />
      <path d="M-5 -15l-3 -6M5 -15l3 -6" stroke={K.out} stroke-width={1.6} stroke-linecap="round" />
    </G>
  );
}

/** Açık sırt çantası (önden; taban ortası) */
function OpenPack({ x, y, c = '#c0603e' }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <OG sh={[
        { d: `M${x - 70} ${y - 78}Q${x} ${y - 98} ${x + 70} ${y - 78}L${x + 64} ${y - 4}Q${x + 62} ${y} ${x + 56} ${y}H${x - 56}Q${x - 62} ${y} ${x - 64} ${y - 4}Z`, f: c },
        { d: rrect(x - 40, y - 52, 80, 40, 8), f: shade(c, 0.1), ln: true },
      ]} />
      <path d={`M${x - 66} ${y - 76}Q${x} ${y - 66} ${x + 66} ${y - 76}`} fill="none" stroke={K.out} stroke-width={1.6} />
      <path d={`M${x - 62} ${y - 74}Q${x} ${y - 62} ${x + 62} ${y - 74}`} fill="none" stroke="#3a2a22" stroke-width={5} opacity={0.7} />
    </g>
  );
}

/** Önden apartman cephesi (SOL x, zemin y) */
function Apartment({ x, y, w = 150, h = 170, c = '#e6d8c0', crack, door = true }: { x: number; y: number; w?: number; h?: number; c?: string; crack?: boolean; door?: boolean }) {
  const sh: Sh[] = [{ d: rrect(x, y - h, w, h, 2), f: c }, { d: rrect(x + w - 14, y - h, 14, h, 2), f: shade(c, 0.1), no: true }];
  const rows = Math.floor((h - 60) / 44);
  for (let r = 0; r < rows; r++)
    for (const fx of [0.12, 0.62]) sh.push({ d: rrect(x + w * fx, y - h + 16 + r * 44, w * 0.26, 26, 1), f: '#bfe3f5', ln: true });
  if (door) sh.push({ d: rrect(x + w * 0.36, y - 58, w * 0.28, 58, 1), f: '#7a5034', ln: true });
  return (
    <g>
      <OG sh={sh} />
      {crack && <path d={`M${x + w * 0.3} ${y - h}l8 26l-10 18l12 22l-8 20l10 18M${x + w * 0.78} ${y - h + 50}l-6 18l8 14l-7 20`} fill="none" stroke={K.out} stroke-width={2.2} stroke-linejoin="round" />}
    </g>
  );
}

/** Dur eli simgesi (kırmızı daire içinde beyaz el), MERKEZ */
function StopHand({ x, y, r = 30 }: { x: number; y: number; r?: number }) {
  const k = r / 30;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 3} fill="#fff" />
      <circle cx={x} cy={y} r={r} fill={K.danger} stroke={K.out} stroke-width={1.8} />
      <G x={x} y={y + 2 * k} s={k}>
        <path d="M-12 16C-15 10 -15 2 -14 -4V-12A3 3 0 0 1 -8 -12V-3V-18A3 3 0 0 1 -2 -18V-4V-21A3 3 0 0 1 4 -21V-4V-17A3 3 0 0 1 10 -17V0L13 -6A3 3 0 0 1 18 -3L12 12C10 17 6 19 0 19C-6 19 -10 18 -12 16Z" fill="#fff" stroke={K.out} stroke-width={1.2} stroke-linejoin="round" />
      </G>
    </g>
  );
}

/** Sismograf zikzağı (sol x, orta y) */
const seismo = (x: number, y: number, w: number, amp: number) => {
  const pts = [0, 0.15, 0.22, 0.3, 0.36, 0.42, 0.48, 0.55, 0.62, 0.7, 0.85, 1];
  const ys = [0, 0, -0.3, 0.4, -1, 1, -0.7, 0.6, -0.3, 0.15, 0, 0];
  return 'M' + pts.map((t, i) => `${f1(x + t * w)} ${f1(y + ys[i] * amp)}`).join('L');
};

/** Yıkık bina fotoğrafı (SOL ÜST, w×h) */
function DisasterPhoto({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <Clip d={rrect(x, y, w, h, 4)}>
        <rect x={x} y={y} width={w} height={h} fill="#c9b9a0" />
        <rect x={x} y={y} width={w} height={h * 0.5} fill="#d9d2c4" />
        <path d={`M${x + w * 0.1} ${y + h}V${y + h * 0.35}L${x + w * 0.32} ${y + h * 0.28}L${x + w * 0.42} ${y + h * 0.5}L${x + w * 0.48} ${y + h}Z`} fill="#a89a84" stroke={K.out} stroke-width={1.1} />
        <path d={`M${x + w * 0.5} ${y + h}L${x + w * 0.55} ${y + h * 0.62}L${x + w * 0.7} ${y + h * 0.5}L${x + w * 0.92} ${y + h * 0.66}L${x + w * 0.96} ${y + h}Z`} fill="#8f8270" stroke={K.out} stroke-width={1.1} />
        <path d={`M${x} ${y + h}Q${x + w * 0.3} ${y + h * 0.72} ${x + w * 0.6} ${y + h * 0.86}T${x + w} ${y + h * 0.8}V${y + h}Z`} fill="#7c6f5e" />
        <rect x={x + w * 0.16} y={y + h * 0.45} width={w * 0.08} height={h * 0.1} fill="#5d564b" />
        <rect x={x + w * 0.3} y={y + h * 0.45} width={w * 0.06} height={h * 0.1} fill="#5d564b" />
      </Clip>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke={K.out} stroke-width={1.2} />
    </g>
  );
}

/** Büyüteç (sap ucu x,y; a yön; mercek merkezine doğru) */
function Magnifier({ x, y, a = -135, r = 22, len = 46 }: { x: number; y: number; a?: number; r?: number; len?: number }) {
  const c: P = [x + Math.cos(a * R) * (len + r), y + Math.sin(a * R) * (len + r)];
  const e: P = [x + Math.cos(a * R) * len, y + Math.sin(a * R) * len];
  return (
    <g>
      <OG sh={[{ d: capsule([x, y], 6, e, 5), f: '#3d4250' }]} />
      <circle cx={c[0]} cy={c[1]} r={r} fill="#d8eefa" opacity={0.45} />
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={K.out} stroke-width={8} />
      <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke="#7d8696" stroke-width={5} />
      <path d={`M${c[0] - r * 0.5} ${c[1] - r * 0.25}A${r * 0.6} ${r * 0.6} 0 0 1 ${c[0] - r * 0.1} ${c[1] - r * 0.55}`} stroke="#fff" stroke-width={2.4} fill="none" stroke-linecap="round" />
    </g>
  );
}


/** Arkadan araba (taban ortası x,y; genişlik ≈ 130·s) */
function RearCar({ x, y, s = 1, color = '#d0473d', hazard }: { x: number; y: number; s?: number; color?: string; hazard?: boolean }) {
  return (
    <G x={x} y={y} s={s}>
      <OG ow={OW_(s)} sh={[
        { d: rrect(-58, -16, 20, 18, 4), f: '#30333b' },
        { d: rrect(38, -16, 20, 18, 4), f: '#30333b' },
        { d: 'M-64 -14V-46Q-64 -54 -56 -56L-44 -58L-34 -84Q-32 -90 -24 -90H24Q32 -90 34 -84L44 -58L56 -56Q64 -54 64 -46V-14Q64 -8 58 -8H-58Q-64 -8 -64 -14Z', f: color },
        { d: 'M-38 -60L-30 -82H30L38 -60Z', f: '#9ccbe6', ln: true },
        { d: 'M-64 -30H64V-14Q64 -8 58 -8H-58Q-64 -8 -64 -14Z', f: shade(color, 0.15), no: true },
        { d: rrect(-18, -40, 36, 12, 2), f: '#fbfaf5', ln: true },
        { d: rrect(-60, -52, 18, 10, 3), f: '#b8322c', ln: true },
        { d: rrect(42, -52, 18, 10, 3), f: '#b8322c', ln: true },
      ]} />
      <path d="M-12 -34h24" stroke={K.ink} stroke-width={2.4} stroke-dasharray="4 2" />
      {hazard && (
        <g>
          <Flash x={-51} y={-47} r={5} />
          <Flash x={51} y={-47} r={5} />
        </g>
      )}
    </G>
  );
}

/** Koşan insan simgesi (acil çıkış), MERKEZ */
function RunIcon({ x, y, s = 1, c = '#fff' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <G x={x} y={y} s={s}>
      <circle cx={3} cy={-14} r={3.6} fill={c} />
      <path d="M1 -8L-3 4L-10 10M-3 4L4 8L6 16M0 -6L-8 -2M1 -7L8 -2L12 -6" fill="none" stroke={c} stroke-width={3.4} stroke-linecap="round" stroke-linejoin="round" />
    </G>
  );
}

/** Tünel kemeri (yan kesit): tavan, lambalar, duvar */
function TunnelBg({ gy = 200, lights = true }: { gy?: number; lights?: boolean }) {
  return (
    <g>
      <rect x={0} y={0} width={320} height={240} fill="#30343c" />
      <rect x={0} y={30} width={320} height={gy - 30} fill="#8a8f98" />
      <rect x={0} y={gy - 34} width={320} height={34} fill="#d8d3c4" />
      <path d={`M0 ${gy - 34}H320`} stroke={K.out} stroke-width={1.5} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${i * 52 + 10} ${gy - 34}V${gy}`} stroke="#b9b3a2" stroke-width={2} />)}
      <rect x={0} y={20} width={320} height={12} fill="#4a4e57" />
      {lights && Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x={i * 58 + 14} y={32} width={30} height={7} rx={2} fill="#ffe9a0" stroke={K.out} stroke-width={1.2} />
          <path d={`M${i * 58 + 14} 39L${i * 58 + 2} 70H${i * 58 + 56}L${i * 58 + 44} 39Z`} fill="#fff3b0" opacity={0.18} />
        </g>
      ))}
      <rect x={0} y={gy} width={320} height={240 - gy} fill={ASPH} />
      <path d={`M0 ${gy}H320`} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Sürücü bakışı: perspektif yol (ufuk hy, yol alt genişliği) + gösterge paneli alt kenarı */
function DriverView({ hy = 110, road = '#6d7078', dash = true, children }: { hy?: number; road?: string; dash?: boolean; children?: ComponentChildren }) {
  return (
    <g>
      <rect x={0} y={0} width={320} height={hy} fill={K.sky} />
      <path d={`M0 ${hy}Q80 ${hy - 20} 160 ${hy - 6}T320 ${hy - 14}V${hy}Z`} fill={K.hill} />
      <rect x={0} y={hy} width={320} height={240 - hy} fill={K.grass} />
      <path d={`M150 ${hy}H170L300 240H20Z`} fill={road} />
      <path d={`M160 ${hy + 4}L160 240`} stroke="#f4f1ea" stroke-width={3} stroke-dasharray="12 12" />
      {children}
      {dash && (
        <g>
          <path d="M0 210Q160 192 320 210V240H0Z" fill="#2f333d" stroke={K.out} stroke-width={1.5} />
          <path d="M90 240A70 40 0 0 1 230 240" fill="none" stroke="#3c414c" stroke-width={14} />
          <path d="M90 240A70 40 0 0 1 230 240" fill="none" stroke={K.out} stroke-width={1.5} />
        </g>
      )}
    </g>
  );
}

/** Araç içi koltuk (yan; sırt solda) taban x,y */
function Seat({ x, y, s = 1, c = '#4a505f', flip }: { x: number; y: number; s?: number; c?: string; flip?: boolean }) {
  return (
    <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <G x={x} y={y} s={s}>
        <OG ow={OW_(s)} sh={[
          { d: 'M-24 0V-14H30Q36 -14 36 -8V0Z', f: c },
          { d: 'M-24 -10L-30 -70Q-30 -78 -22 -78H-16Q-10 -78 -10 -70L-8 -12Z', f: c },
          { d: rrect(-30, -92, 18, 14, 5), f: c },
        ]} />
      </G>
    </g>
  );
}

/* ════════════════════════ rehber oyuncuları (CAST) ════════════════════════
 * Her rehberde bütün adımlarda aynı kişiler görünür. Sahnelerde {...CAST.x, …} ile yayılır. */
type Cast = Omit<PersonProps, 'x' | 'y'>;
/** kayıp çocuk: anne/bulan kişi + çocuk (fotoğraftakiyle aynı) */
const KC: Record<'parent' | 'child', Cast> = {
  parent: { who: 'woman', role: 'bystander', skin: 1, hair: 'scarf', hairC: '#b2506a' },
  child: { who: 'boy', role: 'bystander4', skin: 1, hair: 'short', hairC: K.hair.brown },
};
/** yardım dolandırıcılığı */
const YD: Record<'you', Cast> = { you: { who: 'woman', role: 'bystander3', skin: 2, hair: 'bun', hairC: K.hair.black } };
/** çadır kent */
const CK: Record<'you' | 'friend' | 'kid', Cast> = {
  you: { who: 'woman', role: 'bystander', skin: 1, hair: 'scarf', hairC: '#5e7fb0' },
  friend: { who: 'woman', role: 'bystander4', skin: 0, hair: 'long', hairC: K.hair.dark },
  kid: { who: 'boy', role: 'bystander2', skin: 2, hair: 'short', hairC: K.hair.black },
};
/** boş ev */
const BE: Record<'you', Cast> = { you: { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown } };
const BE_PACK = '#4f7fb0';
/** yanlış bilgi (yalnızca eller) */
const YB = { sleeve: K.role.bystander, skin: 1 };
/** trafik kazası */
const TK: Record<'you' | 'helper2' | 'victim', Cast> = {
  you: { who: 'man', role: 'helper', top: VEST, bottomC: K.pants.dark, skin: 1, hair: 'short', hairC: K.hair.dark },
  helper2: { who: 'woman', role: 'bystander3', skin: 0, hair: 'ponytail', hairC: K.hair.brown },
  victim: { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown },
};
/** karda mahsur */
const KM: Record<'you', Cast> = { you: { who: 'man', role: 'victim', top: '#c1554b', skin: 1, hair: 'short', hairC: K.hair.black } };
/** suya düşen araç */
const SU: Record<'you' | 'big' | 'small', Cast> = {
  you: { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.dark },
  big: { who: 'girl', role: 'bystander3', skin: 1, hair: 'ponytail', hairC: K.hair.brown },
  small: { who: 'boy', role: 'bystander2', skin: 1, hair: 'short', hairC: K.hair.dark },
};
/** arıza ve akü */
const AA: Record<'you' | 'wife' | 'kid', Cast> = {
  you: { who: 'man', role: 'helper', top: VEST, bottomC: K.pants.dark, skin: 1, hair: 'short', hairC: K.hair.dark },
  wife: { who: 'woman', role: 'helper', top: VEST, bottomC: K.pants.dark, skin: 1, hair: 'scarf', hairC: '#5e7fb0' },
  kid: { who: 'boy', role: 'helper', top: VEST, bottomC: K.pants.denim, skin: 1, hair: 'short', hairC: K.hair.dark },
};
/** tünel ve köprü */
const TN: Record<'you', Cast> = { you: { who: 'man', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.dark } };

/* ════════════════════════ sahneler ════════════════════════ */

const ORANGE_CLOTH = '#ff7a1a';

/** Yukarıdan yol: sağ şeritte duran araç(lar), arkasında ve önünde aynı şeritte birer üçgen reflektör, aralarda ölçü. */
function ReflectorScene({ crash }: { crash?: boolean }) {
  const lane = 150; // sağ şerit ortası (trafik soldan sağa)
  const rear = 78, front = 272;
  const carA = crash ? 140 : 162, carB = 184;
  return (
    <Scene2 bg="dark">
      <rect x={0} y={0} width={320} height={240} fill={K.grass} />
      <Tree x={40} y={30} s={0.3} />
      <Tree x={286} y={32} s={0.34} kind="pine" />
      <rect x={0} y={44} width={320} height={136} fill={ASPH} />
      <rect x={0} y={47} width={320} height={2.5} fill="#f4f1ea" />
      <rect x={0} y={174} width={320} height={2.5} fill="#f4f1ea" />
      <path d="M0 112H320" stroke="#f4f1ea" stroke-width={2.5} stroke-dasharray="16 12" />
      {/* karşı şeritte sola giden araç */}
      <TopCar x={298} y={80} a={-90} s={0.6} color="#8f6fc2" />
      {crash ? (
        <g>
          <TopCar x={carA} y={lane + 2} a={78} s={0.62} color="#3d7ad6" hazard />
          <TopCar x={carB} y={lane - 6} a={120} s={0.62} color="#e0b23a" />
        </g>
      ) : (
        <TopCar x={carA} y={lane + 4} a={90} s={0.62} color="#3d7ad6" hazard />
      )}
      {/* aynı şeritte, arkada ve önde birer reflektör */}
      <Reflector x={rear} y={lane + 12} s={0.9} />
      <Reflector x={front} y={lane + 12} s={0.9} />
      {/* arkadan gelen, fren yapan araç */}
      <TopCar x={24} y={lane} a={90} s={0.6} color="#d0473d" brake />
      <path d={`M${rear} 182V198M${carA - 24} 172V198M${(crash ? carB : carA) + 24} 172V198M${front} 182V198`} stroke={K.ink} stroke-width={1.5} stroke-dasharray="3 3" />
      <Dim a={[rear, 198]} b={[carA - 24, 198]} />
      <Dim a={[(crash ? carB : carA) + 24, 198]} b={[front, 198]} />
      <Label x={160} y={222} text="30 m / 150 m" size={13} />
    </Scene2>
  );
}

/** Battaniyeyle örtülen yaralı (trafik kazası rehberinin oyuncularıyla) */
function BlanketScene() {
  const victim: PersonProps = { ...TK.victim, x: 196, y: 226, s: 1.05, face: 'pain', pose: POSE.lieBack };
  const v = rig(victim);
  const helper: PersonProps = { ...TK.you, x: v.chest[0] + 26, y: 214, s: 1.05, flip: true, face: 'speak', pose: { ...POSE.kneelSit, spine: -74, chest: -62, head: -50, armF: { to: [v.shoulderF[0] + 2, v.shoulderF[1] - 8] }, armB: [80, 30] } };
  return (
    <Scene2 bg="outdoor" ground="pavement">
      <Person {...helper} mid={(r) => <VestStripes r={r} />} />
      <Person {...victim} />
      <Blanket x1={v.neck[0] + 2} x2={v.toeF[0] + 12} y={230} h={30} color="#c1554b" />
      <Waves x={rig(helper).mouth[0] - 6} y={rig(helper).mouth[1] - 2} a={160} n={2} r={6} />
    </Scene2>
  );
}

export const SCENES: Record<string, ArtFn> = {
  /* ─────────── kayıp çocuk ─────────── */

  'guvenlik-cocuk-tarif': () => {
    const phoneC: P = [150, 104];
    const mom: PersonProps = { ...KC.parent, x: 78, y: 230, s: 1.18, face: 'worried', pose: { ...POSE.stand, armF: { to: [phoneC[0] - 8, phoneC[1] + 22] } } };
    const offc: PersonProps = { x: 246, y: 230, s: 1.18, who: 'man', role: 'helper', top: '#c9d93a', bottom: 'pants', bottomC: POLICE, skin: 2, hairC: K.hair.black, mustache: true,
      face: 'neutral', pose: { ...POSE.stand, armB: { to: [222, 140] }, armF: { to: [232, 132] } } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Tent x={30} y={176} s={0.7} color="#3f8fb8" />
        <Person {...mom} />
        <Person {...offc} mid={(r) => <g><VestStripes r={r} front /></g>} over={(r) => <g><Cap r={r} front /><Notepad x={222} y={146} w={24} h={30} a={-8} /><Pen x={226} y={140} a={-50} len={34} c="#2f333d" /></g>} />
        <BigPhone x={phoneC[0]} y={phoneC[1]} w={50} h={88} a={8}>
          <KidPhoto x={phoneC[0] - 19} y={phoneC[1] - 30} w={38} h={52} />
        </BigPhone>
        <Arrow from={[150, 22]} to={[150, 52]} />
      </Scene2>
    );
  },

  'guvenlik-cocuk-gorevliye': () => {
    const handHold: P = [118, 168];
    const adult: PersonProps = { ...KC.parent, x: 82, y: 230, s: 1.15, face: 'neutral', pose: { ...POSE.walk, armF: { to: handHold } } };
    const kid: PersonProps = { ...KC.child, x: 140, y: 230, s: 0.85, face: 'worried', pose: { ...POSE.standSide, armB: { to: handHold }, armF: [70, 40] } };
    const offc: PersonProps = { x: 236, y: 230, s: 1.15, flip: true, who: 'man', role: 'helper', top: JANDARMA, bottomC: shade(JANDARMA, 0.2), skin: 1, hairC: K.hair.black,
      pose: { ...POSE.crouch, armB: [70, 40], armF: { to: [182, 170] }, handF: 'mitten', face: 'calm' } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Tree x={300} y={190} s={0.8} />
        <Person {...adult} />
        <Person {...kid} />
        <Person {...offc} over={(r) => <Cap r={r} c={JANDARMA} />} />
        <Label x={276} y={34} text="183" size={18} />
      </Scene2>
    );
  },

  'guvenlik-paylasma-yasak': () => {
    const ph: P = [150, 122];
    const btn: P = [184, 196];
    const s = scr(ph[0], ph[1], 140, 230);
    const h = handAt({ a: -20, s: 1.15, pose: 'point', side: 'R', arm: 220, sleeve: K.role.bystander, skin: 1 }, 'tip', [btn[0] + 4, btn[1] + 6]);
    return (
      <Scene2 bg="closeup">
        <BigPhone x={ph[0]} y={ph[1]} w={140} h={230}>
          <rect x={s.x0} y={s.y0} width={s.w} height={24} fill={BLUE_UI} />
          <Avatar x={s.x0 + 16} y={s.y0 + 38} r={9} />
          <Lines x={s.x0 + 32} y={s.y0 + 36} w={60} n={1} wd={4} />
          <KidPhoto x={s.x0 + 8} y={s.y0 + 54} w={s.w - 16} h={104} />
          <rect x={btn[0] - 26} y={btn[1] - 13} width={52} height={26} rx={13} fill={BLUE_UI} stroke={K.out} stroke-width={1.2} />
          <ShareIcon x={btn[0]} y={btn[1]} r={8} />
          <Lines x={s.x0 + 10} y={btn[1] - 4} w={40} n={2} wd={3} />
        </BigPhone>
        <Hand {...h} />
        <No x={btn[0]} y={btn[1]} r={30} />
      </Scene2>
    );
  },

  'guvenlik-cocuk-bileklik': () => {
    // çocuğun ön kolu yatay (soldan gelir), annenin eli kalemle yazıyor
    const writeAt: P = [150, 132];
    const pen = { a: -150, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 30, arm: 220, sleeve: K.role.bystander, skin: 1 };
    const pg = handPoint({ ...pen, x: 0, y: 0 }, 'grip');
    const tipDir = -150 + 90 + 90; // kalem ucu el yönüne göre
    void tipDir;
    const hx = writeAt[0] + 44 - pg[0], hy = writeAt[1] - 46 - pg[1];
    return (
      <Scene2 bg="closeup">
        {/* çocuğun tişörtü ve cebi (altta) */}
        <OG sh={[{ d: `M0 176Q80 166 160 172T320 170V240H0Z`, f: K.role.bystander4 }, { d: rrect(30, 190, 52, 42, 4), f: shade(K.role.bystander4, 0.12), ln: true }]} />
        <OG sh={[{ d: rrect(40, 180, 32, 22, 2), f: '#fbfaf5' }]} />
        <path d="M44 188h18M44 194h12" stroke="#9aa6b5" stroke-width={2} stroke-linecap="round" />
        <OG sh={[{ d: rrect(30, 190, 52, 12, 3), f: shade(K.role.bystander4, 0.06) }]} />
        {/* çocuğun ön kolu */}
        <Hand x={226} y={132} a={90} s={1.05} pose="open" side="L" view="back" arm={250} skin={1} />
        <rect x={-10} y={116} width={36} height={34} rx={6} fill={K.role.bystander4} stroke={K.out} stroke-width={1.5} />
        <g stroke={BLUE_UI} stroke-width={3} stroke-linecap="round">
          <path d="M108 128h12M124 128h8M136 128h10" />
          <path d="M112 138h10M126 138h8" />
        </g>
        <Pen x={writeAt[0]} y={writeAt[1] + 6} a={-58} len={74} c="#2f333d" />
        <Hand x={hx} y={hy} a={pen.a} s={pen.s} pose="hold" side="R" grip={30} arm={220} sleeve={K.role.bystander} skin={1} />
        <Arrow from={[96, 72]} to={[116, 116]} bend={0.2} />
      </Scene2>
    );
  },

  /* ─────────── dolandırıcılık ─────────── */

  'guvenlik-resmi-bagis': () => {
    const ph: P = [150, 122];
    const s = scr(ph[0], ph[1], 150, 230);
    const key: P = [176, 206];
    const h = handAt({ a: -15, s: 1.05, pose: 'point', side: 'R', arm: 220, sleeve: K.role.bystander3, skin: 2 }, 'tip', [key[0], key[1] + 2]);
    return (
      <Scene2 bg="closeup">
        <BigPhone x={ph[0]} y={ph[1]} w={150} h={230}>
          {/* adres çubuğu */}
          <rect x={s.x0} y={s.y0} width={s.w} height={30} fill="#e3e8ef" />
          <rect x={s.x0 + 6} y={s.y0 + 6} width={s.w - 12} height={20} rx={10} fill="#fff" stroke="#9aa6b5" stroke-width={1} />
          <Lock x={s.x0 + 18} y={s.y0 + 17} s={0.75} />
          <path d={`M${s.x0 + 30} ${s.y0 + 16}h40`} stroke="#5a6170" stroke-width={4} stroke-linecap="round" />
          <path d={`M${s.x0 + 74} ${s.y0 + 10}v12`} stroke={BLUE_UI} stroke-width={1.6} />
          {/* bağış sayfası */}
          <Crescent x={ph[0] - 4} y={s.y0 + 62} r={20} />
          <Lines x={s.x0 + 22} y={s.y0 + 96} w={s.w - 44} n={2} gap={9} wd={4} />
          <rect x={s.x0 + 26} y={s.y0 + 116} width={s.w - 52} height={18} rx={9} fill={K.danger} stroke={K.out} stroke-width={1} />
          {/* klavye */}
          <rect x={s.x0} y={s.y0 + 144} width={s.w} height={s.h - 144} fill="#d3d9e1" />
          {Array.from({ length: 3 }, (_, r) => Array.from({ length: 6 }, (_, c) => (
            <rect key={r + '-' + c} x={s.x0 + 6 + c * 22 + (r === 1 ? 6 : 0)} y={s.y0 + 150 + r * 20} width={18} height={16} rx={3} fill="#fff" />
          )))}
        </BigPhone>
        <Hand {...h} />
        <Ok x={268} y={40} r={18} />
      </Scene2>
    );
  },

  'guvenlik-izin-sorgu': () => {
    // Bağış toplayan kişiye, valilik/kaymakamlıktan aldığı yardım toplama iznini (mühürlü belge) soruyorsun.
    const you: PersonProps = { ...YD.you, x: 70, y: 230, s: 1.15, face: 'speak', pose: { ...POSE.standSide, armF: [-20, -40], handF: { shape: 'flat', a: -60 } } };
    const box: P = [222, 150];
    const coll: PersonProps = { x: 252, y: 230, s: 1.15, flip: true, who: 'man', role: 'bystander4', skin: 1, hair: 'short', hairC: K.hair.black, face: 'neutral', pose: { ...POSE.standSide, armF: { to: [box[0] + 8, box[1] + 6] }, armB: { to: [box[0] + 20, box[1] + 10] } } };
    const doc = { x: 118, y: 26, w: 70, h: 64 };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Person {...you} />
        <Person {...coll} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: rrect(box[0] - 26, box[1] - 22, 52, 44, 4), f: '#f2c14e' }, { d: rrect(box[0] - 12, box[1] - 18, 24, 5, 2), f: K.ink }]} />
        <Person {...coll} only={['armF']} />
        <Bubble x={doc.x - 16} y={doc.y - 10} w={doc.w + 64} h={doc.h + 20} tail={[100, 100]}>
          <OG sh={[{ d: rrect(doc.x, doc.y, 52, doc.h, 3), f: '#fbfaf5' }]} />
          <Lines x={doc.x + 8} y={doc.y + 12} w={36} n={3} gap={8} wd={3} c="#9aa6b5" />
          <circle cx={doc.x + 36} cy={doc.y + 48} r={9} fill="none" stroke={K.danger} stroke-width={3} />
          <text x={doc.x + 76} y={doc.y + 50} text-anchor="middle" font-size={40} font-weight={800} fill={K.action} stroke={K.out} stroke-width={1.4} font-family="'IBM Plex Sans', system-ui, sans-serif">?</text>
        </Bubble>
      </Scene2>
    );
  },

  'guvenlik-iban-yasak': () => {
    const ph: P = [160, 122];
    const s = scr(ph[0], ph[1], 160, 226);
    return (
      <Scene2 bg="closeup">
        <BigPhone x={ph[0]} y={ph[1]} w={160} h={226}>
          <rect x={s.x0} y={s.y0} width={s.w} height={30} fill="#e3e8ef" />
          <Avatar x={s.x0 + 18} y={s.y0 + 15} r={10} c="#7d8696" />
          <Lines x={s.x0 + 36} y={s.y0 + 15} w={60} n={1} wd={5} c="#7d8696" />
          <Msg x={s.x0 + 10} y={s.y0 + 48} w={s.w - 30} h={104} />
          <Avatar x={s.x0 + 32} y={s.y0 + 70} r={11} c={K.role.bystander4} />
          <Lines x={s.x0 + 50} y={s.y0 + 68} w={60} n={1} wd={5} c="#5a6170" />
          <text x={s.x0 + 20} y={s.y0 + 108} font-size={15} font-weight={800} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">TR</text>
          <g stroke="#5a6170" stroke-width={5} stroke-linecap="round" stroke-dasharray="10 6">
            <path d={`M${s.x0 + 44} ${s.y0 + 103}h66`} />
            <path d={`M${s.x0 + 20} ${s.y0 + 120}h90`} />
          </g>
          <Label x={s.x0 + 50} y={s.y0 + 138} text="ACİL" size={13} bg={K.danger} />
        </BigPhone>
        <No x={ph[0] - 4} y={s.y0 + 100} r={56} />
      </Scene2>
    );
  },

  'guvenlik-sahte-link': () => {
    const ph: P = [146, 122];
    const s = scr(ph[0], ph[1], 150, 226);
    const link: P = [ph[0] - 2, s.y0 + 104];
    const h = handAt({ a: -30, s: 1.1, pose: 'point', side: 'R', arm: 220, sleeve: K.role.bystander3, skin: 2 }, 'tip', [link[0] + 30, link[1] + 34]);
    return (
      <Scene2 bg="closeup">
        <BigPhone x={ph[0]} y={ph[1]} w={150} h={226}>
          <rect x={s.x0} y={s.y0} width={s.w} height={30} fill="#e3e8ef" />
          <Avatar x={s.x0 + 18} y={s.y0 + 15} r={10} c="#7d8696" />
          <Lines x={s.x0 + 36} y={s.y0 + 15} w={50} n={1} wd={5} c="#7d8696" />
          <Msg x={s.x0 + 10} y={s.y0 + 46} w={s.w - 26} h={86} c="#e9edf2" />
          <Lines x={s.x0 + 20} y={s.y0 + 62} w={s.w - 50} n={3} gap={10} wd={4} c="#9aa6b5" />
          <path d={`M${s.x0 + 20} ${link[1]}h${s.w - 50}`} stroke={BLUE_UI} stroke-width={5} stroke-linecap="round" />
          <path d={`M${s.x0 + 20} ${link[1] + 7}h${s.w - 50}`} stroke={BLUE_UI} stroke-width={1.8} />
        </BigPhone>
        <Hand {...h} />
        <No x={link[0]} y={link[1]} r={40} />
        <WarnTri x={270} y={56} r={22} />
      </Scene2>
    );
  },

  'guvenlik-kod-paylasma': () => {
    // Telefonda gelen 6 haneli doğrulama kodu; kodu soran şüpheli kişiye giden ok yasak.
    const px = 104, py = 124, pw = 124, ph = 204;
    const sc = scr(px, py, pw, ph);
    return (
      <Scene2 bg="closeup">
        <BigPhone x={px} y={py} w={pw} h={ph}>
          <rect x={sc.x0} y={sc.y0} width={sc.w} height={30} fill={BLUE_UI} opacity={0.18} />
          <Lock x={px} y={py - 46} s={1.5} c={BLUE_UI} />
          <Lines x={sc.x0 + 14} y={py - 12} w={sc.w - 28} n={1} wd={5} />
          <rect x={sc.x0 + 8} y={py + 6} width={sc.w - 16} height={34} rx={7} fill="#fff" stroke={K.out} stroke-width={1.6} />
          <g fill={K.ink}>{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={sc.x0 + 20 + i * ((sc.w - 40) / 5)} cy={py + 23} r={5} />)}</g>
          <Lines x={sc.x0 + 14} y={py + 56} w={sc.w - 28} n={2} wd={4} />
        </BigPhone>
        <Shady x={262} y={84} r={30} />
        <Arrow from={[172, 136]} to={[246, 112]} w={7} />
        <No x={208} y={124} r={30} />
      </Scene2>
    );
  },

  'guvenlik-banka-ara': () => {
    const card: P = [96, 140];
    const p: PersonProps = { ...YD.you, x: 172, y: 236, s: 1.3, face: 'speak', pose: { ...POSE.stand, armB: { to: [card[0] + 14, card[1] + 10] } } };
    const r0 = rig(p);
    const phone: P = [r0.head[0] + 15, r0.head[1] + 4];
    const p2: PersonProps = { ...p, pose: { ...p.pose, armF: { to: [phone[0] + 2, phone[1] + 18], bend: 1 }, handF: 'fist' } };
    return (
      <Scene2 bg="indoor">
        <Person {...p2} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <BankCard x={card[0]} y={card[1]} w={60} h={38} a={-10} />
        <Lock x={card[0] + 2} y={card[1] - 2} s={1.3} c={K.safe} />
        <OG sh={[{ d: rrect(phone[0] - 6, phone[1] - 18, 12, 36, 3), f: '#2f3542' }]} />
        <Person {...p2} only={['armF']} />
        <Waves x={phone[0] + 14} y={phone[1] - 8} a={-30} n={3} r={6} color={K.water} />
        <Arrow from={[56, 64]} to={[84, 112]} bend={-0.2} />
      </Scene2>
    );
  },

  /* ─────────── çadır kent ─────────── */

  'guvenlik-kamp-birlikte': () => {
    const w1: PersonProps = { ...CK.you, x: 128, y: 220, s: 1.0, face: 'neutral', pose: { ...POSE.walk, armF: [40, 20], handF: 'fist' } };
    const w2: PersonProps = { ...CK.friend, x: 92, y: 214, s: 0.96, face: 'neutral', pose: { ...POSE.walk, armF: [40, 20], handF: 'fist' } };
    const lamp = (r: Rig) => <g><path d={`M${r.handF[0]} ${r.handF[1]}L${r.handF[0] + 120} ${r.handF[1] + 10}L${r.handF[0] + 120} ${r.handF[1] + 60}Z`} fill="#fff3b0" opacity={0.3} /><OG sh={[{ d: rrect(r.handF[0] - 4, r.handF[1] - 4, 14, 8, 2), f: '#3d4250' }]} /></g>;
    return (
      <Scene2 bg="night">
        {[20, 80, 140, 200].map((x) => <WhiteTent key={x} x={x} y={190} s={0.72} />)}
        {[50, 110, 170].map((x) => <WhiteTent key={x} x={x} y={200} s={0.8} />)}
        <rect x={0} y={204} width={320} height={36} fill={NIGHT_PATH} />
        <rect x={0} y={204} width={320} height={2} fill="#5f7067" />
        <LampPost x={40} y={222} h={130} />
        <ToiletBox x={244} y={226} w={58} h={96} />
        <Person {...w2} over={lamp} />
        <Person {...w1} over={lamp} />
        <Ok x={290} y={34} r={16} />
      </Scene2>
    );
  },

  'guvenlik-kamp-fener': () => {
    const w: PersonProps = { ...CK.you, x: 176, y: 228, s: 1.14, flip: true, face: 'neutral', pose: { ...POSE.walk, armF: [62, 14], handF: 'fist' } };
    const r = rig(w);
    const h = r.handF;
    const fa = 158; // fener yönü (sola, hafif aşağı)
    const dx = Math.cos(fa * R), dy = Math.sin(fa * R);
    const fs = 1.1;
    const back: P = [h[0] - dx * 14 * fs, h[1] - dy * 14 * fs];
    const lens: P = [back[0] + dx * 40 * fs, back[1] + dy * 40 * fs];
    const nx = -dy, ny = dx;
    const spot: P = [lens[0] - 52, 220];
    return (
      <Scene2 bg="night">
        {/* aydınlık ana yol */}
        <path d="M0 196H320V240H0Z" fill="#5c6c63" />
        <path d="M0 196H320" stroke="#6f8077" stroke-width={2} />
        {/* sağda karanlık, ıssız çadır arası yol */}
        <path d="M226 196L262 120H280L310 196Z" fill="#2b332f" stroke="#1d2320" stroke-width={1.5} />
        <WhiteTent x={226} y={196} s={0.9} dark />
        <WhiteTent x={306} y={196} s={0.9} dark />
        <WhiteTent x={270} y={120} s={0.36} dark />
        {/* solda aydınlık yol boyunca direkler ve çadırlar */}
        <WhiteTent x={66} y={168} s={0.55} />
        <WhiteTent x={130} y={168} s={0.55} />
        <LampPost x={22} y={204} h={128} />
        {/* fener ışığı: fenerin ucundan yere */}
        <path d={`M${f1(lens[0] + nx * 4)} ${f1(lens[1] + ny * 4)}L${f1(spot[0] - 34)} ${f1(spot[1])}A34 9 0 0 0 ${f1(spot[0] + 34)} ${f1(spot[1])}L${f1(lens[0] - nx * 4)} ${f1(lens[1] - ny * 4)}Z`} fill="#fff3b0" opacity={0.5} />
        <path d={ell(spot, 34, 9)} fill="#fff3b0" opacity={0.55} />
        <Person {...w} mid={() => <Flashlight x={back[0]} y={back[1]} s={fs} a={fa} beam={false} />} />
        <circle cx={lens[0]} cy={lens[1]} r={7} fill="#fff7c2" opacity={0.8} />
        <No x={268} y={164} r={34} />
      </Scene2>
    );
  },

  'guvenlik-kamp-tuvalet': () => (
    <Scene2 bg="night">
      <rect x={0} y={200} width={320} height={40} fill={NIGHT_PATH} />
      <LampPost x={160} y={222} h={150} />
      <ToiletBox x={36} y={224} w={78} h={124} c="#3f8fb8" icon="w" />
      <ToiletBox x={206} y={224} w={78} h={124} c="#3f8fb8" icon="m" />
      <Inset x={196} y={16} w={112} h={70} tail={[260, 140]}>
        <rect x={196} y={16} width={112} height={70} fill={tint('#3f8fb8', 0.35)} />
        <OG sh={[{ d: rrect(214, 40, 60, 22, 3), f: '#c9ccd2' }, { d: rrect(280, 36, 14, 30, 2), f: '#c9ccd2' }, { d: rrect(236, 44, 46, 14, 4), f: '#e2e6eb' }, { d: rrect(250, 34, 8, 14, 2), f: '#e2e6eb' }]} />
      </Inset>
      <Arrow from={[222, 104]} to={[240, 66]} w={5} />
    </Scene2>
  ),

  'guvenlik-kamp-cocuk-yetiskin': () => {
    const hand: P = [228, 172];
    const adult: PersonProps = { ...CK.you, x: 206, y: 230, s: 1.1, flip: true, face: 'neutral', pose: { ...POSE.walk, armB: { to: hand } } };
    const kid: PersonProps = { ...CK.kid, x: 250, y: 232, s: 0.8, flip: true, face: 'neutral', pose: { ...POSE.walk, armF: { to: hand } } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* dağıtım noktası */}
        <OG sh={[{ d: 'M8 120L70 96L132 120V128H8Z', f: K.danger }, { d: rrect(12, 128, 4, 74, 1), f: '#9aa3ad' }, { d: rrect(124, 128, 4, 74, 1), f: '#9aa3ad' }]} />
        <Crescent x={70} y={113} r={8} c="#fff" />
        <Person x={56} y={204} s={0.82} who="woman" role="helper2" skin={0} hairC={K.hair.brown} hair="ponytail" pose={{ ...POSE.standSide, armF: { to: [86, 164] } }} />
        <OG sh={[{ d: rrect(18, 166, 106, 10, 2), f: K.wood }, { d: rrect(28, 146, 22, 20, 2), f: '#d9b27a' }, { d: rrect(84, 150, 24, 16, 2), f: '#d9b27a' }]} />
        <Person x={116} y={226} s={1.02} flip who="oldwoman" role="bystander4" skin={1} pose={{ ...POSE.standSide }} />
        <Person x={156} y={228} s={1.05} flip who="man" role="bystander3" skin={2} hairC={K.hair.black} pose={{ ...POSE.standSide }} />
        <Person {...kid} />
        <Person {...adult} />
        <Ok x={290} y={36} r={16} />
      </Scene2>
    );
  },

  /* ─────────── boş ev ─────────── */

  'guvenlik-ev-degerli': () => {
    const hL = handAt({ a: 50, s: 0.95, pose: 'hold', side: 'L', grip: 30, arm: 220, sleeve: K.role.victim, skin: 0 }, 'grip', [96, 136]);
    const hR = handAt({ a: -45, s: 0.95, pose: 'hold', side: 'R', grip: 30, arm: 220, sleeve: K.role.victim, skin: 0 }, 'grip', [222, 128]);
    return (
      <Scene2 bg="closeup">
        <Pouch x={160} y={150} a={-6} />
        <OpenPack x={160} y={236} c={BE_PACK} />
        <Hand {...hL}><DocPouch x={104} y={122} a={-20} /></Hand>
        <Hand {...hR}><PillBox x={214} y={116} a={18} /></Hand>
        <Arrow from={[160, 50]} to={[160, 112]} w={5} />
      </Scene2>
    );
  },

  'guvenlik-ev-kilit': () => {
    const keyhole: P = [228, 136];
    const p: PersonProps = { ...BE.you, x: 156, y: 232, s: 1.2, face: 'neutral', pose: { ...POSE.standSide, armF: { to: [keyhole[0] - 14, keyhole[1] + 2] }, handF: 'fist' } };
    return (
      <Scene2 bg="indoor" wall="#d9d2c2">
        <Door x={212} y={212} w={80} h={160} color="#8a5a3a" />
        <rect x={222} y={128} width={14} height={20} rx={3} fill="#d9c27a" stroke={K.out} stroke-width={1.3} />
        <CarKey x={keyhole[0] - 18} y={keyhole[1]} a={0} s={0.8} />
        <Person {...p} back={(r) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} color={BE_PACK} />} />
        <Inset x={14} y={16} w={88} h={80}>
          <rect x={14} y={16} width={88} height={80} fill="#a8724a" />
          <rect x={48} y={30} width={22} height={52} rx={5} fill="#d9c27a" stroke={K.out} stroke-width={1.4} />
          <CarKey x={56} y={56} a={-90} s={1.1} />
          <Arrow from={[30, 70]} to={[38, 32]} bend={-0.5} w={4.5} />
        </Inset>
      </Scene2>
    );
  },

  'guvenlik-ev-komsu': () => {
    const fam1: PersonProps = { ...BE.you, x: 70, y: 230, s: 1.08, face: 'speak', pose: { ...POSE.standSide, armF: [-10, -16] } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Apartment x={8} y={200} w={150} h={180} />
        <Person {...fam1} back={(r) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} color={BE_PACK} />} />
        <Person x={116} y={232} s={1.02} who="woman" role="bystander" hair="scarf" hairC="#b2506a" skin={1} pose={{ ...POSE.standSide, armF: [70, 70] }} back={(r) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.0} color="#c0603e" />} />
        <Person x={150} y={234} s={0.78} who="girl" role="bystander2" skin={1} hairC={K.hair.dark} pose={{ ...POSE.standSide }} />
        <Person x={246} y={232} s={1.1} flip who="oldman" role="bystander4" skin={1} pose={{ ...POSE.standSide, face: 'calm' }} />
        <Bubble x={196} y={20} w={64} h={52} tail={[236, 96]}>
          <Pin x={228} y={64} s={1.2} />
        </Bubble>
      </Scene2>
    );
  },

  'guvenlik-ev-girilemez': () => (
    <Scene2 bg="outdoor" ground="pavement">
      <Apartment x={70} y={200} w={170} h={190} crack />
      <Tape a={[118, 150]} b={[194, 186]} />
      <Tape a={[118, 186]} b={[194, 150]} />
      <OG sh={[{ d: rrect(96, 146, 4, 56, 1), f: '#9aa3ad' }]} />
      <WarnTri x={98} y={136} r={18} />
      <Person {...BE.you} x={270} y={234} s={1.1} flip face="neutral" pose={POSE.walk} />
      <No x={222} y={168} r={24} />
      <Person x={44} y={234} s={1.12} who="man" role="helper" top={VEST} bottomC={K.pants.navy} skin={2} hairC={K.hair.black} pose={{ ...POSE.wave, armF: [-40, -80], handF: { shape: 'flat', a: 0 }, face: 'speak' }} mid={(r) => <VestStripes r={r} front />} />
    </Scene2>
  ),

  /* ─────────── yanlış bilgi ─────────── */

  'guvenlik-paylasmadan-dur': () => {
    const ph: P = [146, 136];
    const s = scr(ph[0], ph[1], 140, 210);
    const btn: P = [ph[0] + 30, s.y0 + 150];
    return (
      <Scene2 bg="closeup">
        <BigPhone x={ph[0]} y={ph[1]} w={140} h={210}>
          <Msg x={s.x0 + 8} y={s.y0 + 46} w={s.w - 22} h={76} c="#e9edf2" />
          <Lines x={s.x0 + 18} y={s.y0 + 62} w={s.w - 44} n={4} gap={11} wd={4} c="#9aa6b5" />
          <rect x={btn[0] - 24} y={btn[1] - 14} width={48} height={28} rx={14} fill={BLUE_UI} stroke={K.out} stroke-width={1.2} />
          <ForwardIcon x={btn[0]} y={btn[1]} r={10} />
        </BigPhone>
        <Hand x={btn[0] + 70} y={btn[1] + 70} a={-40} s={1.0} pose="point" side="R" arm={200} {...YB} />
        <StopHand x={ph[0] - 20} y={46} r={30} />
        <text x={ph[0] + 36} y={64} font-size={42} font-weight={800} fill={K.action} stroke={K.out} stroke-width={1.6} font-family="'IBM Plex Sans', system-ui, sans-serif">?</text>
      </Scene2>
    );
  },

  'guvenlik-resmi-kaynak': () => {
    const ph: P = [150, 124];
    const s = scr(ph[0], ph[1], 140, 220);
    return (
      <Scene2 bg="closeup">
        <g opacity={0.45}>
          <Msg x={18} y={40} w={70} h={34} c="#cfd6df" />
          <Msg x={240} y={70} w={66} h={30} c="#cfd6df" tailR />
          <Msg x={24} y={150} w={60} h={30} c="#cfd6df" />
          <Msg x={244} y={170} w={60} h={34} c="#cfd6df" tailR />
        </g>
        <BigPhone x={ph[0]} y={ph[1]} w={140} h={220}>
          <rect x={s.x0} y={s.y0} width={s.w} height={56} fill={tint(BLUE_UI, 0.55)} />
          <circle cx={ph[0]} cy={s.y0 + 58} r={22} fill="#fff" stroke={K.out} stroke-width={1.5} />
          <path d={`M${ph[0] - 11} ${s.y0 + 48}H${ph[0] + 11}V${s.y0 + 60}Q${ph[0] + 11} ${s.y0 + 70} ${ph[0]} ${s.y0 + 74}Q${ph[0] - 11} ${s.y0 + 70} ${ph[0] - 11} ${s.y0 + 60}Z`} fill={K.action} stroke={K.out} stroke-width={1.2} />
          <path d={`M${ph[0] - 34} ${s.y0 + 94}h52`} stroke="#3b3f4b" stroke-width={6} stroke-linecap="round" />
          <Verified x={ph[0] + 30} y={s.y0 + 94} r={8} />
          <Lines x={s.x0 + 12} y={s.y0 + 116} w={s.w - 24} n={2} gap={9} wd={4} />
          <rect x={s.x0 + 8} y={s.y0 + 140} width={s.w - 16} height={50} rx={6} fill="#e9edf2" />
          <Lines x={s.x0 + 16} y={s.y0 + 152} w={s.w - 40} n={3} gap={9} wd={3.5} c="#9aa6b5" />
        </BigPhone>
        <Ok x={250} y={130} r={22} />
      </Scene2>
    );
  },

  'guvenlik-deprem-tahmin-yasak': () => {
    const ph: P = [160, 124];
    const s = scr(ph[0], ph[1], 160, 220);
    return (
      <Scene2 bg="closeup">
        <BigPhone x={ph[0]} y={ph[1]} w={160} h={220}>
          <rect x={s.x0} y={s.y0} width={s.w} height={28} fill="#e3e8ef" />
          <Msg x={s.x0 + 10} y={s.y0 + 46} w={s.w - 28} h={112} c="#fff" />
          <ClockIcon x={s.x0 + 44} y={s.y0 + 80} r={20} />
          <Lines x={s.x0 + 72} y={s.y0 + 72} w={46} n={2} gap={10} wd={4} />
          <path d={seismo(s.x0 + 18, s.y0 + 128, s.w - 50, 14)} fill="none" stroke={K.danger} stroke-width={3} stroke-linejoin="round" stroke-linecap="round" />
        </BigPhone>
        <No x={ph[0] - 4} y={s.y0 + 102} r={60} />
      </Scene2>
    );
  },

  'guvenlik-eski-foto': () => {
    const ph: P = [128, 126];
    const s = scr(ph[0], ph[1], 150, 216);
    const photo = { x: s.x0 + 8, y: s.y0 + 40, w: s.w - 16, h: 100 };
    return (
      <Scene2 bg="closeup">
        <BigPhone x={ph[0]} y={ph[1]} w={150} h={216}>
          <Avatar x={s.x0 + 16} y={s.y0 + 20} r={9} />
          <Lines x={s.x0 + 32} y={s.y0 + 20} w={60} n={1} wd={4} />
          <DisasterPhoto {...photo} />
          <Lines x={s.x0 + 12} y={s.y0 + 156} w={s.w - 24} n={3} gap={10} wd={4} />
        </BigPhone>
        <Calendar x={photo.x + photo.w - 14} y={photo.y + 18} w={40} h={36} text="2011" />
        <Hand x={292} y={232} a={-40} s={0.9} pose="hold" side="R" grip={26} arm={120} {...YB} />
        <Magnifier x={262} y={206} a={-128} r={30} len={34} />
        <WarnTri x={262} y={48} r={22} />
      </Scene2>
    );
  },

  /* ─────────── ortak / trafik kazası ─────────── */

  'ulasim-reflektor-mesafe': () => <ReflectorScene />,

  'ulasim-kaza-reflektor': () => <ReflectorScene crash />,

  'ulasim-kaza-dortlu': () => {
    const drv: PersonProps = { ...TK.you, x: 110, y: 234, s: 1.02, face: 'neutral', pose: { ...POSE.standSide, armB: { to: [92, 160] } } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <path d="M0 214H320" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="18 12" />
        <G x={248} y={206} a={-10}><Car x={0} y={0} s={0.82} color="#3d7ad6" /></G>
        <G x={298} y={208} a={6}><Car x={0} y={0} s={0.82} color="#e0b23a" /></G>
        <Smoke x={240} y={120} w={60} h={34} kind="cloud" op={0.75} />
        <SideCar x={84} y={210} s={1.05} color="#6c9c5a" hazard />
        <Person {...drv} mid={(r) => <VestStripes r={r} />} />
      </Scene2>
    );
  },

  'ulasim-kaza-oynatma-yasak': () => {
    // İki kare: solda yaralıyı kollarından sürüklemek (✗), sağda yanında diz çöküp yerinde bırakmak ve konuşmak (✓).
    const panel = (x0: number, good: boolean) => {
      const vy = 196;
      const victim: PersonProps = good
        ? { ...TK.victim, x: x0 + 82, y: vy, s: 0.62, face: 'pain', pose: POSE.lieBack }
        : { ...TK.victim, x: x0 + 92, y: vy, s: 0.62, face: 'pain', pose: { ...POSE.lieBack, armB: { to: [x0 + 30, vy - 40] }, armF: { to: [x0 + 32, vy - 37] } } };
      const v = rig(victim);
      const helper: PersonProps = good
        ? { ...TK.you, x: v.chest[0] + 22, y: vy - 8, s: 0.66, flip: true, face: 'speak', pose: { ...POSE.kneelSit, spine: -74, chest: -62, head: -50, armF: { to: [v.shoulderF[0] + 2, v.shoulderF[1] - 6] }, armB: [80, 30] } }
        : { ...TK.you, x: x0 + 24, y: vy, s: 0.66, face: 'worried', pose: { spine: -112, chest: -100, head: -86, legB: [118, 96], legF: [70, 100], armB: { to: [x0 + 30, vy - 40] }, armF: { to: [x0 + 32, vy - 37] } } };
      return (
        <Inset x={x0} y={14} w={146} h={212}>
          <rect x={x0} y={14} width={146} height={212} fill={K.sky} />
          <rect x={x0} y={150} width={146} height={76} fill="#b9b7b0" />
          <path d={`M${x0} 214H${x0 + 146}`} stroke="#f4f1ea" stroke-width={3} stroke-dasharray="14 10" />
          {good ? <><Person {...helper} mid={(r) => <VestStripes r={r} />} /><Person {...victim} /></> : <><Person {...victim} /><Person {...helper} mid={(r) => <VestStripes r={r} />} /></>}
          {good && <Waves x={rig(helper).mouth[0] - 4} y={rig(helper).mouth[1] - 4} a={200} n={2} r={5} />}
          {good ? <Ok x={x0 + 124} y={36} r={14} /> : <Bad x={x0 + 124} y={36} r={14} />}
        </Inset>
      );
    };
    return (
      <Scene2 bg="dark">
        {panel(8, false)}
        {panel(166, true)}
      </Scene2>
    );
  },

  'ulasim-kask-cikarma': () => {
    // Kask yerinde kalır: yardımcı yaralının başucunda diz çökmüş, iki eliyle kaskı iki yandan sabit tutuyor.
    const victim: PersonProps = { ...TK.victim, x: 196, y: 222, s: 1.2, pose: { ...POSE.lieBack } };
    const v = rig(victim);
    const H = v.headR;
    const hc = v.head;
    const r1: PersonProps = { ...TK.you, x: 44, y: 226, s: 1.2, face: 'neutral', pose: { ...POSE.kneel, spine: -60, chest: -44, head: -30, armB: { to: [hc[0] - H * 0.4, hc[1] - H * 1.2] }, armF: { to: [hc[0] - H * 0.2, hc[1] + H * 1.1] }, handB: 'flat', handF: 'flat' } };
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <Person {...victim} over={(r) => <MotoHelmet r={r} />} />
        <Person {...r1} mid={(r) => <VestStripes r={r} />} />
      </Scene2>
    );
  },

  /* ─────────── karda mahsur ─────────── */

  'ulasim-kar-aracta-kal': () => (
    <Scene2 bg="outdoor" ground="snow">
      <rect x={0} y={0} width={320} height={200} fill="#9fb2c2" opacity={0.75} />
      <G x={196} y={214} s={1.3}>
        <Car x={0} y={0} color="#3d7ad6" />
        <Clip d="M-32 -35L-20 -48H-2V-35Z">
          <circle cx={-14} cy={-40} r={5} fill={K.skin[1]} stroke={K.out} stroke-width={0.8} />
          <path d="M-26 -30Q-14 -44 -2 -30Z" fill="#c1554b" stroke={K.out} stroke-width={0.8} />
          <path d="M-20 -42Q-14 -50 -8 -42" fill={K.hair.black} />
        </Clip>
        <Clip d="M3 -35V-48H17Q21 -48 24 -45L33 -35Z">
          <circle cx={14} cy={-40} r={5} fill={K.skin[2]} stroke={K.out} stroke-width={0.8} />
          <path d="M2 -30Q14 -44 26 -30Z" fill="#7aa6d6" stroke={K.out} stroke-width={0.8} />
          <path d="M8 -43Q14 -51 20 -43" fill={K.hair.dark} />
        </Clip>
      </G>
      <OG sh={[{ d: snowPile(90, 300, 226, 44), f: SNOW }, { d: 'M116 148Q190 136 266 146L262 150H120Z', f: SNOW }]} />
      <SnowFall n={46} wind={10} seed={4} />
      <Person {...KM.you} x={58} y={206} s={0.62} flip face="worried" pose={{ ...POSE.walk, spine: -76, chest: -70 }} />
      <No x={58} y={160} r={34} />
    </Scene2>
  ),

  'ulasim-kar-egzoz-temizle': () => {
    const blade: P = [106, 214];
    const grip: P = [214, 120];
    const h = handAt({ a: -150, s: 0.95, pose: 'hold', side: 'R', grip: 30, arm: 200, sleeve: KM.you.top, skin: 1 }, 'grip', grip);
    return (
      <Scene2 bg="outdoor" ground="snow">
        <rect x={0} y={0} width={320} height={200} fill="#b9c8d4" opacity={0.6} />
        <OG sh={[
          { d: 'M20 196V96Q20 80 36 76L80 66L104 26Q108 18 120 18H200Q212 18 216 26L240 66L284 76Q300 80 300 96V196Z', f: '#c6574e' },
          { d: 'M90 70L110 32H210L230 70Z', f: '#9ccbe6', ln: true },
          { d: rrect(20, 150, 280, 46, 8), f: shade('#c6574e', 0.15) },
          { d: rrect(126, 112, 68, 22, 3), f: '#fbfaf5', ln: true },
          { d: rrect(28, 92, 40, 20, 5), f: '#b8322c', ln: true },
          { d: rrect(252, 92, 40, 20, 5), f: '#b8322c', ln: true },
        ]} />
        <path d="M134 123h52" stroke={K.ink} stroke-width={3} stroke-dasharray="6 3" />
        <OG sh={[{ d: rrect(66, 188, 30, 16, 6), f: '#9aa3ad' }]} />
        <ellipse cx={81} cy={196} rx={10} ry={6} fill="#20232b" />
        <OG sh={[{ d: snowPile(0, 62, 232, 40), f: SNOW }, { d: snowPile(150, 320, 234, 34), f: SNOW }, { d: 'M0 212H320V240H0Z', f: SNOW }]} />
        <Shovel a={grip} b={blade} c="#3d7ad6" />
        <Hand {...h} />
        <SnowFall n={24} seed={8} y2={180} />
        <Arrow from={[40, 128]} to={[70, 178]} bend={0.2} />
      </Scene2>
    );
  },

  'ulasim-kar-motor-10dk': () => {
    const key: P = [262, 176];
    const kh = handAt({ a: 20, s: 0.95, pose: 'pinch', side: 'R', arm: 200, sleeve: KM.you.top, skin: 1 }, 'pinch', [key[0] - 6, key[1]]);
    return (
      <Scene2 bg="dark">
        {/* ön cam: kar */}
        <rect x={0} y={0} width={320} height={150} fill="#cfdbe4" />
        <SnowFall n={30} seed={2} y2={150} />
        {/* yan cam (solda), üstten hafif aralık */}
        <path d="M0 0H70L40 150H0Z" fill="#3a3f4c" stroke={K.out} stroke-width={1.5} />
        <path d="M4 22H52L30 140H4Z" fill="#b9c8d4" stroke={K.out} stroke-width={1.5} />
        <path d="M4 14H54L52 22H4Z" fill="#22252d" />
        <Arrow from={[22, 6]} to={[30, 40]} w={3} color={K.water} />
        <Arrow from={[40, 6]} to={[44, 40]} w={3} color={K.water} />
        {/* gösterge paneli */}
        <path d="M0 150Q160 120 320 150V240H0Z" fill="#2f333d" stroke={K.out} stroke-width={1.5} />
        <rect x={84} y={152} width={52} height={30} rx={6} fill="#20232b" stroke={K.out} stroke-width={1.2} />
        <g transform="translate(110 167)">
          <circle r={11} fill={K.action} opacity={0.25} />
          <path d="M-6 6V-1M0 6V-6M6 6V-1" stroke={K.action} stroke-width={2.4} stroke-linecap="round" />
          <path d="M-8 8H8" stroke={K.action} stroke-width={2.4} stroke-linecap="round" />
        </g>
        <Wheel x={178} y={196} r={56} />
        <circle cx={key[0]} cy={key[1]} r={10} fill="#596273" stroke={K.out} stroke-width={1.4} />
        <CarKey x={key[0] + 18} y={key[1]} a={180} s={0.9} />
        <Hand {...kh} />
        <Timer x={128} y={30} r={16} text="10 dk / saat" />
      </Scene2>
    );
  },

  'ulasim-kar-anten-bez': () => {
    const base: P = [150, 136];
    const top: P = [140, 50];
    const knot: P = [141.5, 60];
    return (
      <Scene2 bg="outdoor" ground="snow">
        <rect x={0} y={0} width={320} height={200} fill="#a9bccb" opacity={0.6} />
        <G x={176} y={214} s={1.4}>
          <Car x={0} y={0} color="#6d7480" />
          {/* iç lamba yanıyor: sarı camlar ve tavan lambası */}
          <path d="M-32 -35L-20 -48H-2V-35Z" fill="#ffe7a3" stroke={K.out} stroke-width={1} />
          <path d="M3 -35V-48H17Q21 -48 24 -45L33 -35Z" fill="#ffe7a3" stroke={K.out} stroke-width={1} />
          <circle cx={0} cy={-40} r={22} fill="#fff3b0" opacity={0.35} />
          <rect x={-5} y={-50} width={10} height={4} rx={2} fill="#fff7c2" stroke={K.out} stroke-width={0.8} />
        </G>
        <OG sh={[{ d: 'M126 140Q176 124 226 140L222 144H130Z', f: SNOW }, { d: snowPile(80, 280, 228, 30), f: SNOW }]} />
        {/* ince tel anten (tavanın arka ucunda, kardan çıkıyor) */}
        <path d={`M${base[0]} ${base[1]}Q${base[0] - 2} ${(base[1] + top[1]) / 2} ${top[0]} ${top[1]}`} fill="none" stroke="#23262d" stroke-width={2.2} stroke-linecap="round" />
        <path d={ell([base[0], base[1] + 1], 6, 3.5)} fill="#23262d" stroke={K.out} stroke-width={1} />
        <circle cx={top[0]} cy={top[1]} r={2.2} fill="#23262d" />
        {/* antene bağlı, rüzgârda dalgalanan parlak turuncu bez */}
        <path d={`M${knot[0]} ${knot[1] - 6}Q${knot[0] + 22} ${knot[1] - 14} ${knot[0] + 40} ${knot[1] - 4}T${knot[0] + 82} ${knot[1] - 2}L${knot[0] + 76} ${knot[1] + 14}Q${knot[0] + 58} ${knot[1] + 6} ${knot[0] + 40} ${knot[1] + 16}T${knot[0]} ${knot[1] + 10}Z`} fill={ORANGE_CLOTH} stroke={K.out} stroke-width={1.5} stroke-linejoin="round" />
        <path d={`M${knot[0] + 26} ${knot[1] - 6}Q${knot[0] + 40} ${knot[1] + 2} ${knot[0] + 56} ${knot[1] + 2}`} fill="none" stroke={shade(ORANGE_CLOTH, 0.2)} stroke-width={1.4} />
        <path d={`M${knot[0] - 3} ${knot[1] - 6}L${knot[0] + 3} ${knot[1] - 4}M${knot[0] - 3} ${knot[1] + 8}L${knot[0] + 3} ${knot[1] + 10}`} stroke={K.out} stroke-width={2} stroke-linecap="round" />
        <SnowFall n={40} wind={9} seed={11} />
      </Scene2>
    );
  },

  /* ─────────── suya düşen araç ─────────── */

  'ulasim-su-zaman': () => (
    <Scene2 bg="outdoor" gy={120}>
      <G x={180} y={170} a={24} s={1.35}><Car x={0} y={0} color="#d0473d" /></G>
      <rect x={0} y={150} width={320} height={90} fill={K.water} opacity={0.88} />
      <path d="M0 150q10 -3 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none" stroke={K.out} stroke-width={1.5} />
      <path d="M80 160h18M240 172h22M140 200h16M200 214h20" stroke={K.waterLight} stroke-width={2.4} stroke-linecap="round" />
      <path d="M244 150q6 -8 12 0M262 150q6 -10 12 0M100 150q6 -6 12 0" fill="none" stroke="#fff" stroke-width={2.4} stroke-linecap="round" />
      <Hourglass x={42} y={46} s={1.2} />
      <Label x={96} y={46} text="< 1 dk" size={16} />
    </Scene2>
  ),

  'ulasim-su-kemer': () => {
    const btn: P = [204, 186];
    const h = handAt({ a: -30, s: 1.0, pose: 'point', side: 'R', arm: 200, sleeve: K.role.helper, skin: 1 }, 'tip', [btn[0] + 2, btn[1] + 2]);
    return (
      <Scene2 bg="dark">
        <rect x={0} y={0} width={320} height={240} fill="#4a505f" />
        {/* yan cam: dışarıda su */}
        <path d="M0 10H120L96 96H0Z" fill="#b9dcf0" stroke={K.out} stroke-width={1.5} />
        <path d="M0 52Q30 46 60 52T110 50L96 96H0Z" fill={K.water} />
        <path d="M0 52Q30 46 60 52T110 50" fill="none" stroke={K.waterLight} stroke-width={2} />
        {/* koltuk */}
        <OG sh={[{ d: rrect(130, 40, 120, 210, 20), f: '#3b3f4b' }, { d: rrect(150, 30, 80, 40, 14), f: '#3b3f4b' }]} />
        {/* kemer kayışı */}
        <path d="M240 30L180 120" stroke={K.out} stroke-width={20} stroke-linecap="butt" />
        <path d="M240 30L180 120" stroke="#2b2d34" stroke-width={17} />
        <path d="M180 120Q170 150 178 168" stroke={K.out} stroke-width={20} fill="none" />
        <path d="M180 120Q170 150 178 168" stroke="#2b2d34" stroke-width={17} fill="none" />
        <path d="M150 96l-12 -6M148 110l-14 0" stroke="#fff" stroke-width={2.4} stroke-linecap="round" />
        {/* toka */}
        <OG sh={[{ d: rrect(170, 166, 20, 18, 3), f: '#c9ccd2' }, { d: rrect(180, 172, 52, 34, 8), f: '#2f333d' }, { d: rrect(196, 178, 18, 14, 4), f: K.danger }]} />
        <Hand {...h} />
        <Arrow from={[268, 120]} to={[226, 170]} bend={-0.2} />
      </Scene2>
    );
  },

  'ulasim-su-cam-ac': () => {
    const sw: P = [210, 172];
    const h = handAt({ a: 0, s: 1.0, pose: 'point', side: 'R', arm: 200, sleeve: K.role.helper, skin: 1 }, 'tip', [sw[0] - 4, sw[1] - 2]);
    return (
      <Scene2 bg="dark">
        {/* dışarısı */}
        <rect x={0} y={0} width={320} height={140} fill={K.sky} />
        <rect x={0} y={112} width={320} height={30} fill={K.water} />
        <path d="M0 112q10 -3 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none" stroke={K.waterLight} stroke-width={2} />
        {/* inen cam */}
        <rect x={30} y={78} width={260} height={62} fill="#bfe3f5" opacity={0.55} stroke={K.out} stroke-width={1.5} />
        <path d="M30 78H290" stroke="#fff" stroke-width={3} />
        {/* kapı çerçevesi */}
        <path d="M0 0H320V240H0ZM30 18H290V140H30Z" fill="#3b3f4b" fill-rule="evenodd" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(0, 140, 320, 16, 3), f: '#2f333d' }, { d: rrect(120, 160, 140, 30, 8), f: '#2f333d' }, { d: rrect(196, 162, 30, 18, 4), f: '#596273' }, { d: rrect(232, 162, 24, 18, 4), f: '#596273' }]} />
        <Hand {...h} />
        <Arrow from={[90, 34]} to={[90, 74]} w={7} />
        <Arrow from={[150, 34]} to={[150, 74]} w={7} />
      </Scene2>
    );
  },

  'ulasim-su-cam-kir': () => {
    const hit: P = [280, 150];
    return (
      <Scene2 bg="dark">
        <rect x={0} y={0} width={320} height={240} fill="#3b3f4b" />
        {/* ön cam (solda, eğik) */}
        <path d="M0 20L110 40L96 170H0Z" fill="#9ccbe6" stroke={K.out} stroke-width={1.5} />
        <path d="M0 120Q50 112 100 118L96 170H0Z" fill={K.water} opacity={0.8} />
        {/* yan cam */}
        <path d="M128 40H300V170H128Z" fill="#b9dcf0" stroke={K.out} stroke-width={1.5} />
        <path d="M128 120Q200 112 300 120V170H128Z" fill={K.water} opacity={0.8} />
        <g stroke="#fff" stroke-width={2} fill="none" stroke-linejoin="round">
          <path d={`M${hit[0]} ${hit[1]}l-26 -18l-14 -24M${hit[0]} ${hit[1]}l-34 4l-22 12M${hit[0]} ${hit[1]}l-8 -36l6 -20M${hit[0]} ${hit[1]}l-20 14`} />
        </g>
        <path d="M0 170H320V240H0Z" fill="#2f333d" />
        <Breaker a={[196, 236]} b={[hit[0] - 14, hit[1] + 22]} />
        <Hand x={180} y={250} a={30} s={0.95} pose="fist" side="R" arm={120} sleeve={K.role.helper} skin={1} />
        <Spark x={hit[0]} y={hit[1]} r={10} />
        <No x={52} y={92} r={36} />
      </Scene2>
    );
  },

  'ulasim-su-cocuk': () => {
    const win = { x: 30, y: 62, w: 92, h: 52 };
    const buckle: P = [118, 172];
    const adult: PersonProps = { ...SU.you, x: 196, y: 206, s: 1.0, flip: true, shadow: false, face: 'worried',
      pose: { ...POSE.kneel, spine: -62, chest: -44, head: -30, armB: { to: [buckle[0] + 8, buckle[1] - 6] }, armF: { to: [buckle[0], buckle[1]] }, handB: 'fist', handF: 'fist' } };
    // Sıra numaraları çocukların ÜSTÜNDE: 1 = büyük çocuk (önce çıkar), 2 = küçük çocuk.
    const small: PersonProps = { ...SU.small, x: 70, y: 192, ax: 'hip', ay: 'hip', s: 0.58, shadow: false, face: 'worried', pose: POSE.sitChair };
    const big: PersonProps = { ...SU.big, x: 104, y: 192, ax: 'hip', ay: 'hip', s: 0.76, shadow: false, face: 'worried', pose: { ...POSE.sitChair, armF: { to: [buckle[0] - 2, buckle[1] - 4] } } };
    const rs = rig(small), rb = rig(big);
    return (
      <Scene2 bg="dark">
        <rect x={0} y={0} width={320} height={240} fill="#1c3550" />
        <path d="M0 150H320V240H0Z" fill={K.water} opacity={0.6} />
        {/* araç kesiti */}
        <OG sh={[{ d: 'M6 210V70Q6 50 26 46L80 36Q150 26 220 36L276 60Q306 70 312 96V210Z', f: '#d9d4c8' }]} />
        <path d={rrect(win.x, win.y, win.w, win.h, 6)} fill={K.sky} stroke={K.out} stroke-width={1.5} />
        <path d={`M${win.x} ${win.y + 38}Q${win.x + 46} ${win.y + 34} ${win.x + win.w} ${win.y + 38}V${win.y + win.h}H${win.x}Z`} fill={K.water} />
        <path d="M168 62H278L292 112H168Z" fill="#b9dcf0" stroke={K.out} stroke-width={1.5} />
        <path d="M168 96Q220 92 292 96V112H168Z" fill={K.water} />
        <Seat x={92} y={206} s={1.0} c="#5a6170" />
        <Seat x={262} y={206} s={1.0} c="#5a6170" />
        <Person {...small} />
        <Person {...big} />
        <Person {...adult} />
        <Arrow from={[rb.head[0] + 20, rb.top - 4]} to={[win.x + 40, win.y + 24]} bend={0.3} w={5} />
        <Num x={rb.head[0]} y={rb.top - 13} n={1} />
        <Num x={rs.head[0]} y={rs.top - 13} n={2} />
      </Scene2>
    );
  },

  'ulasim-su-cik': () => {
    // Araç neredeyse batmış; anne ve çocuklar camdan çıkıp tavana tutunmuş; ok kıyıyı gösteriyor.
    const wl = 160; // su çizgisi
    const roofY = 146;
    return (
      <Scene2 bg="outdoor" gy={120}>
        <path d="M236 128Q262 118 320 120V240H226Z" fill={K.grass} stroke={K.out} stroke-width={1.5} />
        <Tree x={290} y={130} s={0.62} />
        <G x={108} y={roofY + 53 * 1.5} s={1.5}><Car x={0} y={0} color="#d0473d" /></G>
        <rect x={0} y={wl} width={232} height={80} fill={K.water} opacity={0.88} />
        <path d={`M0 ${wl}q10 -3 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t12 0`} fill="none" stroke={K.out} stroke-width={1.5} />
        <Person {...SU.big} x={80} y={roofY + 1} s={0.72} shadow={false} face="worried" pose={{ ...POSE.sitFloor, armB: { floor: -8 }, armF: { floor: 4 } }} />
        <Person {...SU.you} x={120} y={roofY + 1} s={0.95} shadow={false} face="worried" pose={{ ...POSE.kneelSit, armB: { floor: -20 }, armF: { to: [140, roofY - 26] }, handF: 'mitten' }} />
        <Person {...SU.small} x={150} y={roofY + 1} s={0.56} shadow={false} face="worried" pose={{ ...POSE.sitFloor, armB: { floor: -6 }, armF: { floor: 6 } }} />
        <Arrow from={[174, 104]} to={[262, 100]} bend={0.15} />
      </Scene2>
    );
  },

  /* ─────────── arıza ve akü ─────────── */

  'ulasim-ariza-sag-cek': () => (
    <Scene2 bg="dark">
      <rect x={0} y={0} width={320} height={240} fill={K.grass} />
      <rect x={60} y={0} width={196} height={240} fill={ASPH} />
      <path d="M64 0V240M194 0V240" stroke="#f4f1ea" stroke-width={3} />
      <path d="M129 0V240" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="18 14" />
      <rect x={256} y={0} width={8} height={240} fill="#c7ced6" stroke={K.out} stroke-width={1.4} />
      <TopCar x={96} y={60} a={0} s={0.8} color="#6c9c5a" />
      <TopCar x={210} y={110} a={18} s={0.8} color="#3d7ad6" hazard />
      <Arrow from={[160, 220]} to={[222, 60]} bend={0.2} />
    </Scene2>
  ),

  'ulasim-ariza-yelek-in': () => (
    <Scene2 bg="outdoor" ground="pavement">
      <rect x={0} y={200} width={320} height={40} fill={ASPH} />
      <path d="M0 236L60 200" stroke="#f4f1ea" stroke-width={3} />
      <rect x={278} y={186} width={42} height={54} fill={K.grass} />
      <GuardRail x1={270} x2={330} y={210} h={30} />
      <RearCar x={150} y={222} s={1.15} color="#6d7480" hazard />
      <g opacity={0.4}>
        <Person {...AA.you} x={58} y={226} s={0.95} face="neutral" pose={POSE.stand} />
      </g>
      <No x={58} y={162} r={32} />
      <Person {...AA.you} x={240} y={230} s={1.0} face="neutral" pose={POSE.stand} mid={(r) => <VestStripes r={r} front />} />
    </Scene2>
  ),

  'ulasim-ariza-bariyer': () => (
    <Scene2 bg="outdoor" gy={150}>
      <rect x={0} y={112} width={320} height={46} fill={ASPH} />
      <path d="M0 128H320" stroke="#f4f1ea" stroke-width={2} stroke-dasharray="14 10" />
      <SideCar x={230} y={156} s={0.7} color="#3d7ad6" hazard />
      <GuardRail x1={0} x2={320} y={186} h={28} />
      <Person {...AA.you} x={84} y={230} s={1.0} face="neutral" pose={POSE.stand} mid={(r) => <VestStripes r={r} front />} />
      <Person {...AA.wife} x={136} y={232} s={0.96} face="neutral" pose={POSE.stand} mid={(r) => <VestStripes r={r} front />} />
      <Person {...AA.kid} x={178} y={234} s={0.7} face="neutral" pose={POSE.stand} mid={(r) => <VestStripes r={r} front />} />
      <Ok x={42} y={110} r={16} />
    </Scene2>
  ),

  'ulasim-aku-kirmizi': () => {
    const fullP: P = [53, 137];
    const emptyP: P = [217, 137];
    const hh = handAt({ a: 150, s: 0.9, pose: 'hold', side: 'L', grip: 28, arm: 200, sleeve: VEST, skin: 1 }, 'grip', [fullP[0] + 2, fullP[1] - 46]);
    return (
      <Scene2 bg="dark">
        <rect x={4} y={60} width={150} height={176} rx={6} fill="#3a3f4c" stroke="#3d7ad6" stroke-width={6} />
        <rect x={166} y={60} width={150} height={176} rx={6} fill="#3a3f4c" stroke="#c6574e" stroke-width={6} />
        <Battery x={84} y={150} full />
        <Battery x={248} y={150} />
        <Cable pts={[[emptyP[0], emptyP[1] - 18], [emptyP[0] - 10, 70], [150, 40], [100, 34], [fullP[0] + 6, fullP[1] - 62]]} />
        <Clamp x={emptyP[0]} y={emptyP[1] - 4} a={-90} c={K.danger} />
        <Hand {...hh}>
          <Clamp x={fullP[0]} y={fullP[1] - 22} a={-90} c={K.danger} />
        </Hand>
        <Arrow from={[fullP[0] - 30, fullP[1] - 30]} to={[fullP[0] - 10, fullP[1] - 10]} w={5} />
        <Num x={fullP[0] - 28} y={fullP[1] + 40} n={1} />
        <Num x={emptyP[0] - 28} y={emptyP[1] + 40} n={2} />
      </Scene2>
    );
  },

  'ulasim-aku-siyah': () => {
    const fullM: P = [117, 137];
    const emptyM: P = [281, 137];
    const bolt: P = [250, 212];
    const hh = handAt({ a: -150, s: 0.9, pose: 'hold', side: 'R', grip: 28, arm: 200, sleeve: VEST, skin: 1 }, 'grip', [fullM[0] - 2, fullM[1] - 46]);
    return (
      <Scene2 bg="dark">
        <rect x={4} y={60} width={150} height={176} rx={6} fill="#3a3f4c" stroke="#3d7ad6" stroke-width={6} />
        <rect x={166} y={60} width={150} height={176} rx={6} fill="#3a3f4c" stroke="#c6574e" stroke-width={6} />
        <OG sh={[{ d: rrect(196, 192, 104, 38, 6), f: '#6d7480' }, { d: circ(bolt, 7), f: '#d6dbe1' }]} />
        <Battery x={84} y={140} full h={56} />
        <Battery x={248} y={140} h={56} />
        <Cable pts={[[53, 112], [80, 70], [190, 64], [217, 112]]} c={K.danger} w={4} />
        <Clamp x={53} y={128} a={-90} c={K.danger} s={0.8} />
        <Clamp x={217} y={128} a={-90} c={K.danger} s={0.8} />
        <Cable pts={[[bolt[0] - 6, bolt[1] - 14], [190, 186], [160, 80], [fullM[0] - 4, fullM[1] - 62]]} c="#2b2d34" />
        <Clamp x={bolt[0]} y={bolt[1] - 2} a={-130} c="#2b2d34" />
        <Hand {...hh}>
          <Clamp x={fullM[0]} y={fullM[1] - 22} a={-90} c="#2b2d34" />
        </Hand>
        <No x={emptyM[0]} y={emptyM[1] - 4} r={20} />
        <Num x={fullM[0] + 26} y={fullM[1] + 46} n={3} />
        <Num x={bolt[0] + 32} y={bolt[1] - 2} n={4} />
      </Scene2>
    );
  },

  /* ─────────── tahliye ─────────── */

  'ulasim-tahliye-tabela': () => (
    <Scene2 bg="dark">
      <DriverView hy={104}>
        <path d="M146 112L60 140L36 148L90 148L150 120Z" fill={K.dirt} stroke={K.out} stroke-width={1} />
        <Sign x={262} y={182} w={92} h={60} pole={56} icon="arrow" />
        <text x={262} y={84} text-anchor="middle" font-size={13} font-weight={700} fill="#fff" font-family="'IBM Plex Sans', system-ui, sans-serif">TAHLİYE</text>
        <Person x={206} y={196} s={0.62} flip who="man" role="helper" top={VEST} bottomC={K.pants.navy} skin={2} hairC={K.hair.black} pose={{ ...POSE.standSide, armF: [-160, -170], face: 'speak' }} mid={(r) => <VestStripes r={r} />} />
        <No x={80} y={140} r={24} />
      </DriverView>
    </Scene2>
  ),

  'ulasim-su-yola-girme': () => (
    <Scene2 bg="outdoor" ground="pavement" gy={204}>
      <Flood x={150} y={186} w={170} h={54} flow={3} />
      <g opacity={0.35}>
        <SideCar x={246} y={212} s={0.75} color="#6d7480" />
      </g>
      <No x={246} y={186} r={30} />
      <Dim a={[300, 212]} b={[300, 188]} text="30 cm" lab={[284, 160]} size={13} />
      <SideCar x={74} y={222} s={0.95} color="#3d7ad6" />
      <UArrow x={110} y={150} w={54} h={70} dir={-1} />
    </Scene2>
  ),

  'ulasim-kablo-uzak': () => (
    <Scene2 bg="dark">
      <DriverView hy={104}>
        <PowerPole x={250} y={150} h={110} a={-62} />
        <path d="M150 150Q120 136 140 124T190 132Q210 150 180 158T130 168Q100 170 112 156" fill="none" stroke={K.out} stroke-width={5} />
        <path d="M150 150Q120 136 140 124T190 132Q210 150 180 158T130 168Q100 170 112 156" fill="none" stroke="#2b2d34" stroke-width={3} />
        <Spark x={112} y={156} r={14} />
        <No x={154} y={146} r={34} />
        <UArrow x={226} y={200} w={44} h={60} dir={1} />
      </DriverView>
    </Scene2>
  ),

  'ulasim-tahliye-yol-ac': () => (
    <Scene2 bg="dark">
      <rect x={0} y={0} width={320} height={240} fill={K.grass} />
      <rect x={40} y={0} width={230} height={240} fill={ASPH} />
      <path d="M44 0V240M210 0V240" stroke="#f4f1ea" stroke-width={3} />
      <path d="M127 0V240" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="18 14" />
      {[[94, 30, '#6c9c5a'], [96, 110, '#d9a13a'], [92, 190, '#8f6fc2'], [176, 46, '#c6574e'], [178, 126, '#3d7ad6'], [176, 206, '#6d7480']].map(([x, y, c], i) => (
        <TopCar key={i} x={x as number} y={y as number} s={0.78} color={c as string} />
      ))}
      <TopCar x={240} y={160} s={0.78} amb />
      <Arrow from={[240, 120]} to={[240, 40]} />
    </Scene2>
  ),

  /* ─────────── tünel ve köprü ─────────── */

  'ulasim-tunel-mesafe': () => {
    const s = 0.9;
    const rearX = 72, frontX = 248;
    return (
      <Scene2 bg="dark">
        <TunnelBg gy={204} />
        <SideCar x={frontX} y={212} s={s} color="#3d7ad6" />
        <SideCar x={rearX} y={212} s={s} color="#d0473d" hazard />
        <Dim a={[rearX + 63 * s + 4, 226]} b={[frontX - 62 * s - 4, 226]} text="5 m" lab={[160, 120]} size={16} />
        <path d={`M${rearX + 63 * s + 4} 220V140M${frontX - 62 * s - 4} 220V140`} stroke="#fff" stroke-width={1.5} stroke-dasharray="4 4" opacity={0.7} />
      </Scene2>
    );
  },

  'ulasim-tunel-u-donus-yasak': () => (
    <Scene2 bg="dark">
      <rect x={0} y={0} width={320} height={240} fill="#30343c" />
      <rect x={50} y={0} width={220} height={240} fill={ASPH} />
      <rect x={34} y={0} width={16} height={240} fill="#b9b3a2" stroke={K.out} stroke-width={1.4} />
      <rect x={270} y={0} width={16} height={240} fill="#b9b3a2" stroke={K.out} stroke-width={1.4} />
      <path d="M160 0V240" stroke="#f4f1ea" stroke-width={3} stroke-dasharray="18 14" />
      <Smoke x={50} y={0} w={220} h={50} kind="cloud" op={0.9} />
      <TopCar x={92} y={150} a={-120} s={0.78} color="#d0473d" />
      <path d="M100 196V120A26 26 0 0 0 48 120" fill="none" stroke={K.action} stroke-width={5} opacity={0.0} />
      <Arrow from={[110, 196]} to={[78, 102]} bend={-0.55} w={5} />
      <No x={92} y={146} r={34} />
      <TopCar x={192} y={110} s={0.78} color="#6d7480" />
      <Arrow from={[192, 142]} to={[192, 186]} w={5} />
      <No x={192} y={140} r={30} />
      <TopCar x={246} y={196} s={0.7} color="#3d7ad6" hazard />
      <Ok x={296} y={200} r={13} />
    </Scene2>
  ),

  'ulasim-tunel-acil-cikis': () => (
    <Scene2 bg="dark">
      <TunnelBg gy={206} />
      <Smoke x={0} y={36} w={90} h={110} kind="cloud" op={0.85} />
      <SideCar x={60} y={214} s={0.6} color="#6d7480" />
      <SideCar x={130} y={216} s={0.6} color="#d0473d" />
      <g>
        <rect x={238} y={84} width={70} height={108} rx={3} fill={K.safe} opacity={0.3} />
        <OG sh={[{ d: rrect(244, 92, 58, 112, 2), f: K.safe }, { d: rrect(252, 104, 42, 30, 3), f: '#fff', ln: true }]} />
        <RunIcon x={273} y={120} s={1.0} c={K.safe} />
        <rect x={288} y={150} width={6} height={14} rx={2} fill="#d6dbe1" stroke={K.out} stroke-width={1} />
      </g>
      <Person {...TN.you} x={150} y={232} s={1.0} face="worried" pose={POSE.walk} />
      <Arrow from={[186, 70]} to={[236, 100]} bend={-0.2} />
    </Scene2>
  ),

  'ulasim-kopru-deprem': () => (
    <Scene2 bg="outdoor" gy={170}>
      <rect x={0} y={170} width={320} height={70} fill={K.water} />
      <rect x={0} y={136} width={250} height={20} fill={ASPH} stroke={K.out} stroke-width={1.5} />
      <rect x={0} y={156} width={250} height={10} fill="#a7a59e" stroke={K.out} stroke-width={1.5} />
      {[40, 150].map((x) => <rect key={x} x={x} y={166} width={20} height={74} fill="#a7a59e" stroke={K.out} stroke-width={1.5} />)}
      <path d="M0 116H250M0 136V116" stroke="#8e98a3" stroke-width={3} />
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${i * 20} 116V136`} stroke="#8e98a3" stroke-width={2} />)}
      <path d="M250 136L320 128V240H250Z" fill={K.grass} stroke={K.out} stroke-width={1.5} />
      <SideCar x={74} y={144} s={0.72} color="#3d7ad6" door />
      <Person {...TN.you} x={200} y={146} s={0.62} face="neutral" pose={POSE.walk} />
      <Arrow from={[222, 70]} to={[290, 92]} bend={-0.2} />
      <Shake x1={20} x2={236} y={176} h={18} />
      <Inset x={16} y={14} w={96} h={62} tail={[60, 116]}>
        <rect x={16} y={14} width={96} height={62} fill="#2f333d" />
        <circle cx={58} cy={46} r={12} fill="#596273" stroke={K.out} stroke-width={1.4} />
        <CarKey x={76} y={46} a={180} s={1.1} />
      </Inset>
    </Scene2>
  ),

  'ulasim-kaza-battaniye': () => <BlanketScene />,

  'ulasim-tunel-deprem': () => {
    // Deprem sırasında tünelde: aracın yanında yerde yan yatmış, dizler karna çekili, kollar başı ve enseyi sarıyor.
    const p: PersonProps = {
      ...TN.you, x: 150, y: 230, s: 1.2, face: 'closed',
      pose: { ...POSE.recovery, spine: 181, chest: 184, head: 196, legB: [172, 8], legF: [164, 2], footB: -90, footF: -90, armB: { at: 'nape', d: [-2, -2] }, armF: { at: 'head', d: [2, -8] }, handB: 'mitten', handF: 'mitten' },
    };
    return (
      <Scene2 bg="dark">
        <TunnelBg gy={196} />
        <SideCar x={250} y={208} s={0.95} color="#d0473d" />
        <Person {...p} />
        <Shake x1={20} x2={300} y={120} h={14} />
      </Scene2>
    );
  },

};
