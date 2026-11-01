// Sıfırdan paketi sahneleri (a): Giyim ve zanaat — lif, deri, ağaç/taş rehberleri ve kategori kapakları.
// Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { JSX } from 'preact';
import {
  Arrow, Bad, Campfire, Drop, Flame, Hand, K, Label, No, OG, Ok, Person, POSE, Rock, Scene2, Timer, Tree, Water, Waves,
  capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../../../src/art/kit2';
import type { HandProps, P, PersonProps, Sh } from '../../../src/art/kit2';

/* ══════════════ MALZEME RENKLERİ (paket geneli) ══════════════ */
const M = {
  wool: '#f2ead8',
  woolDirty: '#cbbd98',
  wood: K.wood,
  woodL: '#dcb07c',
  woodCut: '#e8cc9c',
  bark: '#7b634b',
  fiber: '#ddd1a6',
  stalk: '#a59a5a',
  green: '#6f9a48',
  leather: '#9c6238',
  raw: '#dcc59c',
  hair: '#d8cbb0',
  flint: '#5c6370',
  iron: '#6e7682',
  rope: '#c7a564',
  reed: '#b8ad5c',
  ash: '#b9b5ab',
  water: K.water,
  tan: '#7a3a22',
  salt: '#ffffff',
};

/* ══════════════ OYUNCULAR ══════════════ */
type Look = Pick<PersonProps, 'who' | 'skin' | 'hair' | 'hairC' | 'top' | 'role' | 'bottom' | 'bottomC' | 'sleeve' | 'mustache'>;
const CAST = {
  // Ayşe: yün, eğirme, dokuma, boya, hasır-kilim
  ayse: { who: 'woman', skin: 1, hair: 'scarf', hairC: '#b5485a', role: 'bystander', sleeve: 'long', bottom: 'longskirt', bottomC: '#5b6b8a' } as Look,
  // Elif: ısırgan lifi, örgü, dikiş, keçe, halat yardımcısı
  elif: { who: 'woman', skin: 0, hair: 'ponytail', hairC: K.hair.brown, role: 'bystander2', sleeve: 'long', bottom: 'pants', bottomC: K.pants.denim } as Look,
  // Mehmet: ıhlamur, halat, çarık, kış giysisi, sap, bileme, geçme
  mehmet: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, role: 'bystander3', sleeve: 'long', bottom: 'pants', bottomC: K.pants.khaki, mustache: true } as Look,
  // Can: deri, tabaklama, taş, kemik, oyma
  can: { who: 'man', skin: 3, hair: 'short', hairC: K.hair.black, role: 'bystander4', sleeve: 'long', bottom: 'pants', bottomC: K.pants.dark } as Look,
};
const topOf = (c: Look) => c.top ?? K.role[c.role ?? 'helper'];

/* ══════════════ YARDIMCILAR ══════════════ */
type HP = Omit<HandProps, 'children'>;
/** El: oyuncunun teni ve kolu ile. */
function H({ c, ...h }: HP & { c: Look; children?: JSX.Element | JSX.Element[] | false }) {
  return <Hand skin={c.skin} sleeve={topOf(c)} arm={200} {...h} />;
}
/** Elin bir noktası (grip/pinch/tip) verilen sahne noktasına gelsin diye bilek konumu. */
function wristFor(h: Pick<HandProps, 'a' | 's' | 'side' | 'view' | 'pose' | 'grip'>, which: 'tip' | 'grip' | 'palm' | 'pinch', at: P): P {
  const o = handPoint({ ...h, x: 0, y: 0 }, which);
  return [at[0] - o[0], at[1] - o[1]];
}
/** Yumruk: kavrama noktası `at`'ta (sap elin arkasından geçer gibi görünür). */
function Fist({ c, at, a = 0, s = 1.2, side = 'R', view = 'back', arm = 200, gloved }: { c: Look; at: P; a?: number; s?: number; side?: 'L' | 'R'; view?: 'back' | 'palm'; arm?: number; gloved?: boolean }) {
  const w = wristFor({ a, s, side, view, pose: 'fist' }, 'grip', at);
  const el = <Hand x={w[0]} y={w[1]} a={a} s={s} side={side} view={view} pose="fist" skin={c.skin} sleeve={gloved ? undefined : topOf(c)} arm={gloved ? 60 : arm} />;
  return gloved ? <g><Sleeve w={w} a={a} s={s} c={c} />{glove(el)}</g> : el;
}
/** Çimdik: çimdik noktası `at`'ta. */
function Pinch({ c, at, a = 0, s = 1.2, side = 'R', view = 'back', arm = 200, gloved }: { c: Look; at: P; a?: number; s?: number; side?: 'L' | 'R'; view?: 'back' | 'palm'; arm?: number; gloved?: boolean }) {
  const w = wristFor({ a, s, side, view, pose: 'pinch' }, 'pinch', at);
  const el = <Hand x={w[0]} y={w[1]} a={a} s={s} side={side} view={view} pose="pinch" skin={c.skin} sleeve={gloved ? undefined : topOf(c)} arm={gloved ? 60 : arm} />;
  return gloved ? <g><Sleeve w={w} a={a} s={s} c={c} />{glove(el)}</g> : el;
}
/** Eldivenli elin arkasındaki kol yeni (eldiven bileğin 60 birim gerisine kadar). */
function Sleeve({ w, a, s, c }: { w: P; a: number; s: number; c: Look }) {
  const r = (a * Math.PI) / 180;
  const dir: P = [-Math.sin(r), Math.cos(r)]; // bilekten dirseğe
  const p1: P = [w[0] + dir[0] * 50 * s, w[1] + dir[1] * 50 * s];
  const p2: P = [w[0] + dir[0] * 300 * s, w[1] + dir[1] * 300 * s];
  return <OG sh={[{ d: capsule(p1, 15 * s, p2, 16 * s), f: topOf(c) }]} />;
}
/** Eldiven rengine boyar (kauçuk eldiven). */
const GLOVE_ID = 'gza-eldiven';
function glove(el: JSX.Element) {
  return (
    <g>
      <defs>
        <filter id={GLOVE_ID} color-interpolation-filters="sRGB">
          <feColorMatrix type="matrix" values="0.13 0.25 0.05 0 0  0.26 0.5 0.09 0 0  0.32 0.62 0.11 0 0  0 0 0 1 0" />
        </filter>
      </defs>
      <g filter={`url(#${GLOVE_ID})`}>{el}</g>
    </g>
  );
}
/** Dış hatlı kapsül çubuk */
const stick = (a: P, b: P, r: number, f: string): Sh => ({ d: capsule(a, r, b, r), f });
function Stk({ a, b, r = 3, f = M.wood, r2 }: { a: P; b: P; r?: number; f?: string; r2?: number }) {
  return <OG sh={[{ d: capsule(a, r, b, r2 ?? r), f }]} />;
}
/** İnce çizgi demeti */
function Lines({ ls, c = K.out, w = 1, op }: { ls: [P, P][]; c?: string; w?: number; op?: number }) {
  return <g stroke={c} stroke-width={w} stroke-linecap="round" opacity={op}>{ls.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)}</g>;
}
/** Dairesel (eliptik) eylem oku. Açılar derece; artan açı ekranda saat yönü. */
function Spin({ cx, cy, rx, ry, from = 200, to = 470, w = 5, color = K.action }: { cx: number; cy: number; rx: number; ry: number; from?: number; to?: number; w?: number; color?: string }) {
  const pts: P[] = [];
  const n = 30;
  for (let i = 0; i <= n; i++) {
    const t = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    pts.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
  }
  const e = pts[n];
  const p = pts[n - 3];
  const ang = Math.atan2(e[1] - p[1], e[0] - p[0]);
  const hl = w * 2.2 + 4;
  const bx = e[0] - Math.cos(ang) * hl * 0.8, by = e[1] - Math.sin(ang) * hl * 0.8;
  const hw = hl * 0.6;
  const head = `M${e[0] + Math.cos(ang) * 2} ${e[1] + Math.sin(ang) * 2}L${bx + Math.cos(ang + Math.PI / 2) * hw} ${by + Math.sin(ang + Math.PI / 2) * hw}L${bx - Math.cos(ang + Math.PI / 2) * hw} ${by - Math.sin(ang + Math.PI / 2) * hw}Z`;
  const body = smooth(pts.slice(0, n - 2));
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={body} fill="none" stroke={K.out} stroke-width={w + 3} />
      <path d={head} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={body} fill="none" stroke={color} stroke-width={w} />
      <path d={head} fill={color} />
    </g>
  );
}
/** Bükülmüş ip/halat: a→b boyunca eğik bükümler. */
function Rope({ a, b, w = 10, c = M.rope, n }: { a: P; b: P; w?: number; c?: string; n?: number }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  const k = n ?? Math.max(2, Math.round(len / (w * 0.95)));
  const step = len / k;
  const sh: Sh[] = [{ d: rrect(0, -w / 2, len, w, w / 2), f: shade(c, 0.12) }];
  const det: JSX.Element[] = [];
  for (let i = 0; i < k; i++) {
    const x = i * step + step / 2;
    sh.push({ d: ell([x, 0], step * 0.62, w * 0.42), f: i % 2 ? c : tint(c, 0.12), t: `rotate(-38 ${x} 0)`, no: true });
  }
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <OG sh={sh} ow={1.2} />
      {det}
      <g stroke={shade(c, 0.35)} stroke-width={1} stroke-linecap="round">
        {Array.from({ length: k }, (_, i) => {
          const x = i * step + step;
          return <line key={i} x1={x - w * 0.32} y1={-w * 0.42} x2={x + w * 0.32 - step * 0.4} y2={w * 0.42} />;
        })}
      </g>
    </g>
  );
}
/** Yün tutamı / bulutu: merkez, genişlik, yükseklik. */
function Fluff({ x, y, w, h, c = M.wool, seed = 1 }: { x: number; y: number; w: number; h: number; c?: string; seed?: number }) {
  const n = Math.max(6, Math.round(w / 9));
  const pts: P[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const j = 1 + 0.13 * Math.sin(i * 2.7 + seed) + 0.08 * Math.cos(i * 5.1 + seed * 2);
    pts.push([x + (w / 2) * Math.cos(t) * j, y + (h / 2) * Math.sin(t) * j]);
  }
  return (
    <g>
      <OG sh={[{ d: smooth(pts, true), f: c }]} ow={1.2} />
      <g stroke={shade(c, 0.18)} stroke-width={1} fill="none" stroke-linecap="round">
        {Array.from({ length: Math.round(n / 2) }, (_, i) => {
          const px = x - w * 0.35 + ((i * 0.71 * w) / (n / 2)) % (w * 0.7);
          const py = y - h * 0.2 + ((i * 7) % 5) * (h * 0.08);
          return <path key={i} d={`M${px} ${py}q4 -3 8 0`} />;
        })}
      </g>
    </g>
  );
}
/** Güneş simgesi */
function Sun({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <g stroke="#f2b51f" stroke-width={3} stroke-linecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const t = (i * Math.PI) / 4;
          return <line key={i} x1={x + Math.cos(t) * (r + 4)} y1={y + Math.sin(t) * (r + 4)} x2={x + Math.cos(t) * (r + 10)} y2={y + Math.sin(t) * (r + 10)} />;
        })}
      </g>
      <OG sh={[{ d: circ([x, y], r), f: '#ffd34d' }]} />
    </g>
  );
}
/** Buhar kıvrımları */
function Steam({ x, y, n = 3, h = 30, gap = 18 }: { x: number; y: number; n?: number; h?: number; gap?: number }) {
  return (
    <g fill="none" stroke="#ffffff" stroke-width={3} stroke-linecap="round" opacity={0.9}>
      {Array.from({ length: n }, (_, i) => {
        const sx = x + (i - (n - 1) / 2) * gap;
        return <path key={i} d={`M${sx} ${y}c-6 -${h / 4} 6 -${h / 4} 0 -${h / 2}s6 -${h / 4} 0 -${h / 2}`} />;
      })}
    </g>
  );
}
/** Kesit kap (kazan/kova): sol üst x,y; içi sıvı. */
function Vat({ x, y, w, h, liquid, lc = M.water, c = '#8e99a6', top }: { x: number; y: number; w: number; h: number; liquid?: number; lc?: string; c?: string; top?: number }) {
  const t = 7;
  const ly = y + h - (liquid ?? 0) * (h - t);
  return (
    <g>
      <OG sh={[{ d: `M${x} ${y}H${x + w}V${y + h - 10}Q${x + w} ${y + h} ${x + w - 10} ${y + h}H${x + 10}Q${x} ${y + h} ${x} ${y + h - 10}Z`, f: c }]} />
      <path d={`M${x + t} ${top ?? y}H${x + w - t}V${y + h - t - 6}Q${x + w - t} ${y + h - t} ${x + w - t - 6} ${y + h - t}H${x + t + 6}Q${x + t} ${y + h - t} ${x + t} ${y + h - t - 6}Z`} fill={tint(c, 0.55)} />
      {liquid ? <path d={`M${x + t} ${ly}H${x + w - t}V${y + h - t - 6}Q${x + w - t} ${y + h - t} ${x + w - t - 6} ${y + h - t}H${x + t + 6}Q${x + t} ${y + h - t} ${x + t} ${y + h - t - 6}Z`} fill={lc} /> : null}
      {liquid ? <line x1={x + t} y1={ly} x2={x + w - t} y2={ly} stroke={tint(lc, 0.4)} stroke-width={2.5} /> : null}
      <OG sh={[{ d: rrect(x - 5, y - 4, w + 10, 8, 4), f: shade(c, 0.05) }]} />
    </g>
  );
}


/** İplik (dış hatlı kalın çizgi). */
function Yarn({ d, c = '#4f86c6', w = 4.5, dash }: { d: string; c?: string; w?: number; dash?: string }) {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} stroke={K.out} stroke-width={w + 2.6} stroke-dasharray={dash} />
      <path d={d} stroke={c} stroke-width={w} stroke-dasharray={dash} />
    </g>
  );
}
/** Sivri uçlu çubuk (şiş, biz): a = arka uç, b = sivri uç. */
function Pointed({ a, b, r = 4, f = M.woodL, knob = 0, hook }: { a: P; b: P; r?: number; f?: string; knob?: number; hook?: boolean }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  const t = Math.min(L * 0.12, r * 5);
  const body = hook
    ? `M0 ${-r}H${L - r * 3}Q${L} ${-r} ${L} ${r * 0.2}L${L - r * 1.6} ${r * 0.2}Q${L - r * 1.6} ${-r * 0.2} ${L - r * 2.6} ${r * 0.2}V${r}H0Z`
    : `M0 ${-r}H${L - t}L${L} 0L${L - t} ${r}H0Z`;
  const sh: Sh[] = [{ d: body, f }];
  if (knob) sh.push({ d: circ([0, 0], knob), f: shade(f, 0.15) });
  return <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}><OG sh={sh} /></g>;
}
/** Dikiş iğnesi: a = göz ucu, b = sivri uç. */
function SewNeedle({ a, b }: { a: P; b: P }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <OG sh={[{ d: `M0 -2.6H${L - 12}L${L} 0L${L - 12} 2.6H0Q-3 0 0 -2.6Z`, f: '#c9d0d8' }]} ow={1.1} />
      <path d="M3 0H11" stroke={K.out} stroke-width={1.6} stroke-linecap="round" />
    </g>
  );
}
/** Dokuma: dikey çözgü iplikleri */
function Warp({ x0, x1, n, y0, y1, c = M.wool, w = 3.4 }: { x0: number; x1: number; n: number; y0: number; y1: number; c?: string; w?: number }) {
  return (
    <g stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + ((x1 - x0) * i) / (n - 1);
        return (
          <g key={i}>
            <line x1={x} y1={y0} x2={x} y2={y1} stroke={K.out} stroke-width={w + 2} />
            <line x1={x} y1={y0} x2={x} y2={y1} stroke={c} stroke-width={w} />
          </g>
        );
      })}
    </g>
  );
}
/** Dokuma çerçevesi (dış ölçü) */
function LoomFrame({ x, y, w, h, t = 12 }: { x: number; y: number; w: number; h: number; t?: number }) {
  const fr = `M${x} ${y}H${x + w}V${y + h}H${x}Z M${x + t} ${y + t}V${y + h - t}H${x + w - t}V${y + t}Z`;
  return <OG sh={[{ d: fr, f: M.wood, fr: 'evenodd' }]} />;
}
/** Kirkit (dişli tahta tokmak): dişlerin alt ucu y'de, ortası x'te */
function Kirkit({ x, y, w = 110, teeth = 9 }: { x: number; y: number; w?: number; teeth?: number }) {
  const sh: Sh[] = [{ d: rrect(x - w / 2, y - 50, w, 20, 5), f: M.wood }];
  for (let i = 0; i < teeth; i++) {
    const tx = x - w / 2 + 8 + ((w - 16) * i) / (teeth - 1);
    sh.push({ d: rrect(tx - 3, y - 32, 6, 32, 2.5), f: M.wood });
  }
  sh.push({ d: capsule([x, y - 50], 7, [x, y - 100], 8), f: M.woodL });
  return <OG sh={sh} />;
}


/** Eğik kütük üstünde deri kazıma (yandan). hairUp: kıl yüzü üstte (tabaklama), değilse et yüzü üstte. */
function BeamScrape({ hairUp }: { hairUp?: boolean }) {
  const a: P = [36, 228], b: P = [232, 134];
  const at = (t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const nrm: P = [Math.sin(ang), -Math.cos(ang)];
  const off = (p: P, d: number): P => [p[0] + nrm[0] * d, p[1] + nrm[1] * d];
  const hideC = hairUp ? '#cbbfae' : '#ecd2b4';
  const h0 = at(0.42), h1 = at(1.04);
  const hide = smooth([off(h0, 14), off(at(0.6), 15), off(at(0.85), 15), off(h1, 14), [h1[0] + 8, h1[1] + 30], [h1[0] + 2, h1[1] + 58], off(at(0.98), -16), off(at(0.6), -14), [h0[0] - 4, h0[1] + 18]], true);
  const sp = at(0.66); // kazıyıcının değdiği yer
  const hand = off(sp, 30);
  const person: PersonProps = {
    x: 262, y: 228, ...C, flip: true,
    pose: { spine: -60, chest: -48, head: -40, legB: [96, 92], legF: [80, 96], armB: { to: [hand[0] + 4, hand[1] - 2] }, armF: { to: hand }, face: 'neutral' },
  };
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Stk a={[140, 228]} b={[176, 172]} r={5} f={K.trunk} />
      <Stk a={[188, 228]} b={[176, 172]} r={5} f={shade(K.trunk, 0.1)} />
      <OG sh={[{ d: capsule(a, 13, b, 13), f: K.trunk }]} />
      <OG sh={[{ d: hide, f: hideC }]} />
      {hairUp ? (
        <g stroke={shade('#8a7a66', 0.1)} stroke-width={1.6}>
          {Array.from({ length: 9 }, (_, i) => { const p = off(at(0.7 + i * 0.035), 15); return <line key={i} x1={p[0]} y1={p[1]} x2={p[0] - 3} y2={p[1] - 7} />; })}
        </g>
      ) : (
        <g fill="#f6e7c6" stroke={shade('#ecd2b4', 0.25)} stroke-width={1}>
          {[0.72, 0.8, 0.9].map((t, i) => { const p = off(at(t), 15); return <ellipse key={i} cx={p[0]} cy={p[1] - 2} rx={7} ry={3.4} />; })}
        </g>
      )}
      {/* kazıyıcı */}
      <Stk a={off(sp, 14)} b={hand} r={3} f={M.iron} />
      <OG sh={[{ d: capsule([hand[0] - 6, hand[1] + 2], 4, [hand[0] + 6, hand[1] - 2], 4), f: M.wood }]} />
      <Person {...person} />
      <Arrow from={off(at(0.6), 46)} to={off(at(0.38), 46)} w={6} />
    </Scene2>
  );
}
/** Sırık çerçeveye gerilmiş deri (önden). */
function HideFrame({ c, op = 1, sunNo }: { c: string; op?: number; sunNo?: boolean }) {
  const fx0 = 64, fx1 = 256, fy0 = 34, fy1 = 206;
  const cx = 160, cy = 120;
  const pts: P[] = [];
  const n = 16;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const tab = [1, 3, 5, 7].some((k) => Math.abs(t - (k * Math.PI) / 4) < 0.2) ? 1.22 : 1;
    pts.push([cx + Math.cos(t) * 66 * tab, cy + Math.sin(t) * 58 * tab]);
  }
  const lace = pts.map((p, i) => {
    const dx = p[0] - cx, dy = p[1] - cy;
    const q: P = Math.abs(dx) / 96 > Math.abs(dy) / 86 ? [dx > 0 ? fx1 : fx0, p[1]] : [p[0], dy > 0 ? fy1 : fy0];
    return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={shade(M.rope, 0.2)} stroke-width={2} />;
  });
  return (
    <Scene2 bg="outdoor">
      <ellipse cx={160} cy={214} rx={150} ry={18} fill="#5e8c3f" opacity={0.5} />
      <Tree x={292} y={206} s={1.3} />
      {lace}
      <g opacity={op}><OG sh={[{ d: smooth(pts, true), f: c }]} /></g>
      {pts.map((p, i) => <circle key={i} cx={p[0] + (cx - p[0]) * 0.07} cy={p[1] + (cy - p[1]) * 0.07} r={2} fill={K.out} />)}
      <Stk a={[fx0, 20]} b={[fx0, 226]} r={5} f={K.trunk} />
      <Stk a={[fx1, 20]} b={[fx1, 226]} r={5} f={K.trunk} />
      <Stk a={[48, fy0]} b={[272, fy0]} r={5} f={shade(K.trunk, 0.06)} />
      <Stk a={[48, fy1]} b={[272, fy1]} r={5} f={shade(K.trunk, 0.06)} />
      {sunNo ? <g><Sun x={34} y={40} r={11} /><No x={34} y={40} r={22} /></g> : null}
    </Scene2>
  );
}
/** Yandan ayak (çorap) ve çarık. stage: 'gather' toplama, 'done' bağlı. */
function CarikFoot({ stage }: { stage: 'gather' | 'done' }) {
  const sock = M.wool;
  const lea = '#b98a5a';
  const leg = 'M96 0H150L152 128H98Z';
  const foot = 'M96 120C96 150 92 186 98 204H262C270 204 274 194 266 186C248 172 214 162 170 152C158 138 154 128 152 118Z';
  const holes: P[] = [[112, 176], [138, 170], [166, 166], [194, 170], [222, 176], [248, 184]];
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: leg, f: ME.bottomC! }]} />
      <OG sh={[{ d: foot, f: sock }]} />
      {stage === 'done' && (
        <g>
          <OG sh={[{ d: 'M98 96H152V150H98Z', f: sock }]} />
          <g stroke={shade(sock, 0.25)} stroke-width={1.4}>{[104, 114, 124, 134, 144].map((y) => <line key={y} x1={99} y1={y} x2={151} y2={y + 6} />)}</g>
        </g>
      )}
      {/* çarık: taban + yanlar */}
      <OG sh={[{ d: 'M84 196C84 182 92 168 104 166C150 160 210 164 246 176C266 182 276 192 272 204C270 212 262 214 254 214H96C88 214 84 206 84 196Z', f: lea }]} />
      <path d="M90 206H268" stroke={shade(lea, 0.3)} stroke-width={2} />
      {holes.map((h, i) => <circle key={i} cx={h[0]} cy={h[1] + 4} r={2.6} fill={K.out} />)}
      {/* sırım */}
      {stage === 'gather' ? (
        <g>
          <Yarn d={`M${holes[0][0]} ${holes[0][1] + 4}L${holes[1][0] + 4} 150L${holes[2][0]} ${holes[2][1] + 4}L${holes[3][0] + 4} 152L${holes[4][0]} ${holes[4][1] + 4}`} c={M.raw} w={4} />
          <Yarn d={`M${holes[0][0]} ${holes[0][1] + 4}C110 150 112 110 110 70`} c={M.raw} w={4} />
          <Yarn d={`M${holes[4][0]} ${holes[4][1] + 4}C200 140 160 110 140 70`} c={M.raw} w={4} />
          <Arrow from={[110, 64]} to={[104, 22]} w={5} />
          <Arrow from={[146, 64]} to={[166, 24]} w={5} />
        </g>
      ) : (
        <g>
          <Yarn d={`M${holes[0][0]} ${holes[0][1] + 4}L${holes[2][0]} 152L${holes[4][0]} ${holes[4][1] + 4}`} c={M.raw} w={4} />
          <Yarn d={`M${holes[2][0]} 152L150 132L98 112L150 100L98 130`} c={M.raw} w={4} />
          <Ok x={262} y={60} r={16} />
        </g>
      )}
    </Scene2>
  );
}
/** Önden giysi (gömlek/kazak/ceket) silueti, x orta, y yaka */
function Garment({ x, y, c, s = 1, kind }: { x: number; y: number; c: string; s?: number; kind: 'thin' | 'knit' | 'coat' }) {
  const w = 34 * s, h = 92 * s, sl = 74 * s;
  const body = `M${x - w} ${y}L${x - w - sl * 0.55} ${y + sl * 0.85}L${x - w - sl * 0.38} ${y + sl * 0.95}L${x - w} ${y + 30 * s}V${y + h}H${x + w}V${y + 30 * s}L${x + w + sl * 0.38} ${y + sl * 0.95}L${x + w + sl * 0.55} ${y + sl * 0.85}L${x + w} ${y}Q${x} ${y + 16 * s} ${x - w} ${y}Z`;
  return (
    <g>
      <OG sh={[{ d: body, f: c }]} />
      {kind === 'knit' && <g stroke={shade(c, 0.25)} stroke-width={1.6} fill="none">{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x - w + 6} ${y + 24 * s + i * 11 * s}${Array.from({ length: 6 }, () => `l${(w * 2 - 12) / 12} 5l${(w * 2 - 12) / 12} -5`).join('')}`} />)}</g>}
      {kind === 'coat' && <g><path d={`M${x} ${y + 10 * s}V${y + h}`} stroke={shade(c, 0.35)} stroke-width={2} />{[0.4, 0.6, 0.8].map((t) => <circle key={t} cx={x + 6 * s} cy={y + h * t} r={2.4 * s} fill={shade(c, 0.4)} />)}<path d={`M${x - w + 4} ${y}L${x} ${y + 26 * s}L${x + w - 4} ${y}`} fill="none" stroke={shade(c, 0.35)} stroke-width={2} /></g>}
      {kind === 'thin' && <path d={`M${x - 10 * s} ${y + 4 * s}Q${x} ${y + 12 * s} ${x + 10 * s} ${y + 4 * s}`} fill="none" stroke={shade(c, 0.3)} stroke-width={1.5} />}
    </g>
  );
}
/** Numara rozeti */
function Num({ x, y, n }: { x: number; y: number; n: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill={K.action} stroke={K.out} stroke-width={1.5} />
      <text x={x} y={y + 5.5} text-anchor="middle" font-size={16} font-weight={700} fill={K.ink}>{n}</text>
    </g>
  );
}
/** Keçe kalıbı: eldiven (tek parmak + başparmak), merkez ve ölçek */
const mittenPath = (x: number, y: number, s = 1) =>
  smooth([[x - 30 * s, y + 70 * s], [x - 34 * s, y], [x - 26 * s, y - 52 * s], [x, y - 66 * s], [x + 26 * s, y - 52 * s], [x + 32 * s, y - 14 * s], [x + 58 * s, y - 24 * s], [x + 62 * s, y - 6 * s], [x + 36 * s, y + 26 * s], [x + 30 * s, y + 70 * s]], true);


/** Bıçak (alet), yandan: a = sap ucu, b = uç; edge: ağız hangi yanda (1 = alt/sağ). */
function Knife({ a, b, w = 14, edge = 1 }: { a: P; b: P; w?: number; edge?: 1 | -1 }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  const hl = L * 0.4;
  const e = edge;
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <OG sh={[
        { d: `M${hl - 2} ${-w / 2 * e}H${L - w}Q${L} ${-w / 2 * e} ${L} ${w / 2 * e}H${hl - 2}Z`, f: '#c9d0d8' },
        { d: rrect(0, -w * 0.45, hl, w * 0.9, w * 0.4), f: '#5b3f2a' },
      ]} />
      <path d={`M${hl + 2} ${w / 2 * e - 2 * e}H${L - 6}`} stroke="#ffffff" stroke-width={1.6} />
    </g>
  );
}
/** Kemik (uzun bacak kemiği) */
function Bone({ x0, x1, y, r = 15 }: { x0: number; x1: number; y: number; r?: number }) {
  const c = '#efe6cf';
  return <OG sh={[
    { d: capsule([x0, y], r, [x1, y], r), f: c },
    { d: circ([x0 - 4, y - r * 0.8], r * 1.05), f: c }, { d: circ([x0 - 4, y + r * 0.8], r * 1.05), f: c },
    { d: circ([x1 + 4, y - r * 0.8], r * 1.05), f: c }, { d: circ([x1 + 4, y + r * 0.8], r * 1.05), f: c },
  ]} />;
}
/** Tahta lif çizgileri (bir dikdörtgen içinde) */
function Grain({ x, y, w, h, dir = 0, n = 6, c = shade(M.wood, 0.3), knot }: { x: number; y: number; w: number; h: number; dir?: number; n?: number; c?: string; knot?: P }) {
  const id = `gza-gr-${x}-${y}`;
  return (
    <g>
      <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={6} /></clipPath></defs>
      <g clip-path={`url(#${id})`} stroke={c} stroke-width={1.6} fill="none">
        {Array.from({ length: n + 4 }, (_, i) => {
          const t = (i - 2) / n;
          if (dir === 0) { const xx = x + t * w; return <path key={i} d={`M${xx} ${y - 4}C${xx + 4} ${y + h * 0.3} ${xx - 4} ${y + h * 0.7} ${xx} ${y + h + 4}`} />; }
          if (dir === 1) { const yy = y + t * h; return <path key={i} d={`M${x - 4} ${yy}C${x + w * 0.3} ${yy + 3} ${x + w * 0.7} ${yy - 3} ${x + w + 4} ${yy}`} />; }
          const xx = x + t * w * 1.6 - w * 0.3; return <path key={i} d={`M${xx} ${y - 4}L${xx + w * 0.8} ${y + h + 4}`} />;
        })}
        {knot ? <g><ellipse cx={knot[0]} cy={knot[1]} rx={9} ry={6} fill={shade(M.wood, 0.35)} /><ellipse cx={knot[0]} cy={knot[1]} rx={15} ry={11} /></g> : null}
      </g>
    </g>
  );
}
/** Balta başı (demir), yandan; sap deliği (x,y) merkezde, ağız sağda */
function AxeHead({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <OG sh={[{ d: `M${x - 26 * s} ${y - 16 * s}H${x + 20 * s}L${x + 62 * s} ${y - 34 * s}Q${x + 70 * s} ${y} ${x + 62 * s} ${y + 34 * s}L${x + 20 * s} ${y + 16 * s}H${x - 26 * s}Z`, f: M.iron }]} />;
}

/* ══════════════ SAHNELER ══════════════ */
const A = CAST.ayse, E = CAST.elif, ME = CAST.mehmet, C = CAST.can;

export const SCENES: Record<string, () => JSX.Element> = {
  /* ───── Yün yıkama ───── */
  'sf-gz-yun-bekletme': () => {
    const clip = 'gza-file';
    const bag = smooth([[110, 150], [160, 136], [212, 150], [218, 186], [160, 200], [104, 188]], true);
    return (
      <Scene2 bg="indoor">
        <Steam x={160} y={58} n={3} h={34} gap={34} />
        <Vat x={72} y={70} w={176} h={150} liquid={0.82} lc="#7fb7dc" />
        <defs><clipPath id={clip}><path d={bag} /></clipPath></defs>
        <OG sh={[{ d: bag, f: M.wool }]} />
        <g clip-path={`url(#${clip})`} stroke={shade(M.wool, 0.4)} stroke-width={1.4}>
          {Array.from({ length: 14 }, (_, i) => <line key={'a' + i} x1={90 + i * 11} y1={130} x2={60 + i * 11} y2={210} />)}
          {Array.from({ length: 14 }, (_, i) => <line key={'b' + i} x1={60 + i * 11} y1={130} x2={90 + i * 11} y2={210} />)}
        </g>
        <path d="M80 92q10 -4 20 0t20 0t20 0t20 0t20 0t20 0t20 0t18 0" fill="none" stroke="#ffffff" stroke-width={2} opacity={0.7} />
        <Timer x={214} y={40} r={16} text="20–30 dk" />
      </Scene2>
    );
  },
  'sf-gz-yun-kurutma': () => (
    <Scene2 bg="outdoor">
      <Tree x={196} y={200} s={1.75} />
      <ellipse cx={196} cy={216} rx={112} ry={16} fill="#3f6a2c" opacity={0.45} />
      <Rock x={128} y={222} s={0.75} />
      <Rock x={262} y={222} s={0.75} />
      <OG sh={[{ d: rrect(104, 196, 182, 8, 2), f: '#9aa3ad' }]} />
      <g stroke={shade('#9aa3ad', 0.3)} stroke-width={1}>
        {Array.from({ length: 17 }, (_, i) => <line key={i} x1={110 + i * 10.5} y1={197} x2={110 + i * 10.5} y2={203} />)}
      </g>
      <Fluff x={150} y={189} w={70} h={14} seed={1} />
      <Fluff x={205} y={190} w={62} h={12} seed={3} />
      <Fluff x={252} y={189} w={50} h={13} seed={5} />
      <Sun x={44} y={44} r={13} />
      <No x={44} y={44} r={26} />
    </Scene2>
  ),
  'sf-gz-yun-tarama': () => {
    const pinsUp = Array.from({ length: 16 }, (_, i): [P, P] => [[86 + i * 9, 158], [83 + i * 9, 150]]);
    const pinsDn = Array.from({ length: 16 }, (_, i): [P, P] => [[136 + i * 9, 112], [139 + i * 9, 120]]);
    return (
      <Scene2 bg="closeup">
        {/* alttaki tarak: sapı solda */}
        <Stk a={[26, 164]} b={[84, 164]} r={6} f={M.woodL} />
        <OG sh={[{ d: rrect(80, 158, 150, 14, 3), f: M.wood }]} />
        <Lines ls={pinsUp} c="#59606b" w={1.6} />
        {/* lifler: iki tarak arasında yan yana düz */}
        <g stroke={shade(M.wool, 0.25)} stroke-width={2} stroke-linecap="round">
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={96 + (i % 3) * 6} y1={124 + i * 3.6} x2={258 - (i % 2) * 8} y2={124 + i * 3.6} />)}
        </g>
        <path d="M92 122H262V152H92Z" fill={M.wool} opacity={0.55} />
        {/* üstteki tarak: sapı sağda */}
        <OG sh={[{ d: rrect(130, 98, 150, 14, 3), f: M.wood }]} />
        <Lines ls={pinsDn} c="#59606b" w={1.6} />
        <Stk a={[278, 105]} b={[316, 105]} r={6} f={M.woodL} />
        <Fist c={A} at={[44, 164]} a={90} s={1.05} side="R" />
        <Fist c={A} at={[300, 105]} a={-90} s={1.05} side="L" />
        <Arrow from={[150, 72]} to={[250, 72]} />
      </Scene2>
    );
  },

  /* ───── Kirmen ───── */
  'sf-gz-kirmen-yapisi': () => (
    <Scene2 bg="closeup">
      {/* takılı kirmen */}
      <Stk a={[104, 26]} b={[104, 218]} r={4.5} f={M.woodL} />
      <path d="M104 24q0 -10 7 -10q6 0 4 7" fill="none" stroke={K.out} stroke-width={3} stroke-linecap="round" />
      <Stk a={[48, 190]} b={[160, 172]} r={6} f={M.wood} />
      <Stk a={[66, 168]} b={[142, 196]} r={6} f={shade(M.wood, 0.08)} />
      <Stk a={[104, 150]} b={[104, 218]} r={4.5} f={M.woodL} />
      {/* ölçü */}
      <g stroke={K.ink} stroke-width={1.5}>
        <line x1={22} y1={26} x2={22} y2={150} /><line x1={16} y1={26} x2={28} y2={26} />
      </g>
      <Label x={60} y={70} text="30–40 cm" size={12} />
      {/* ayrık parçalar: ortası oyuk iki kol */}
      <OG sh={[{ d: `M190 92H236V84H252V92H298V104H190Z`, f: M.wood }]} />
      <OG sh={[{ d: `M190 132H298V144H252V152H236V144H190Z`, f: shade(M.wood, 0.08) }]} />
      <Arrow from={[244, 112]} to={[244, 126]} w={4} />
      <Arrow from={[176, 118]} to={[138, 168]} w={5} bend={0.15} />
    </Scene2>
  ),
  'sf-gz-kirmen-cevirme': () => {
    const sx = 186;
    return (
      <Scene2 bg="closeup">
        {/* sol el yukarıda yün şeridini tutuyor */}
        <path d={`M96 30C120 36 150 40 ${sx - 4} 62L${sx + 2} 64C160 46 130 24 104 18Z`} fill={M.wool} stroke={K.out} stroke-width={1.5} />
        <Fist c={A} at={[100, 26]} a={110} s={1.05} side="L" />
        <path d={`M${sx - 1} 62L${sx} 78`} stroke={shade(M.wool, 0.4)} stroke-width={2.5} />
        <path d={`M${sx} 72q4 2 0 4`} stroke={K.out} stroke-width={1} fill="none" />
        {/* kirmen */}
        <Stk a={[sx, 80]} b={[sx, 236]} r={4.5} f={M.woodL} />
        <path d={`M${sx} 80q0 -8 6 -8q5 0 3 6`} fill="none" stroke={K.out} stroke-width={3} stroke-linecap="round" />
        <Fluff x={sx} y={210} w={70} h={28} c={tint(M.wool, 0.1)} seed={2} />
        <Stk a={[sx - 62, 218]} b={[sx + 62, 202]} r={5} f={M.wood} />
        <Spin cx={sx} cy={150} rx={44} ry={12} from={160} to={450} />
        {/* sağ el mili çevirip bırakıyor */}
        <Pinch c={A} at={[sx + 6, 118]} a={-70} s={1.0} side="R" />
      </Scene2>
    );
  },
  'sf-gz-kirmen-durdur-cek': () => {
    const sx = 160;
    return (
      <Scene2 bg="closeup">
        {/* dizler arasında duran kirmen */}
        <Stk a={[sx, 150]} b={[sx, 250]} r={4.5} f={M.woodL} />
        <Fluff x={sx} y={222} w={56} h={22} seed={4} />
        {/* iki diz (etekli), önden: yuvarlak diz kapağı, aşağı inen baldır */}
        {[[96, 1], [224, -1]].map(([kx, d]) => (
          <g key={kx}>
            <OG sh={[{ d: `M${kx - 46} 250V206C${kx - 46} 168 ${kx + 46} 168 ${kx + 46} 206V250Z`, f: A.bottomC! }]} />
            <path d={`M${kx - 24} 196Q${kx} 184 ${kx + 24} 196`} fill="none" stroke={shade(A.bottomC!, 0.3)} stroke-width={2} />
            <path d={`M${kx + d * 30} 210L${kx + d * 34} 248`} stroke={shade(A.bottomC!, 0.3)} stroke-width={2} />
          </g>
        ))}
        {/* bükülmüş ip */}
        <path d={`M${sx} 150L${sx} 112`} stroke={shade(M.wool, 0.45)} stroke-width={3} />
        {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${sx - 2} ${146 - i * 7}l4 -3`} stroke={K.out} stroke-width={1} />)}
        {/* inceltilen lifler: alttaki el bükümü tutuyor, üstteki el şeridi geri çekiyor */}
        <path d={`M${sx - 2} 112C150 90 120 66 92 52L112 30C130 50 156 84 ${sx + 3} 110Z`} fill={M.wool} stroke={K.out} stroke-width={1.3} />
        <g stroke={shade(M.wool, 0.3)} stroke-width={1}>
          <line x1={sx} y1={108} x2={104} y2={42} /><line x1={sx} y1={108} x2={112} y2={50} /><line x1={sx} y1={108} x2={98} y2={36} />
        </g>
        <Pinch c={A} at={[sx + 1, 114]} a={-40} s={1.0} side="R" />
        <Fist c={A} at={[98, 42]} a={140} s={1.0} side="L" />
        <Arrow from={[96, 92]} to={[54, 70]} w={5} />
      </Scene2>
    );
  },

  /* ───── Isırgan ve kenevir ───── */
  'sf-gz-isirgan-soyma': () => (
    <Scene2 bg="closeup">
      {/* içteki odun */}
      <Stk a={[20, 120]} b={[300, 120]} r={6} f="#efe6c8" />
      {/* dıştaki yeşil şerit: solda gövdeye yapışık, sağda soyuluyor */}
      <OG sh={[{ d: rrect(16, 110, 150, 20, 8), f: M.green }]} />
      <g stroke={shade(M.green, 0.3)} stroke-width={1}><line x1={24} y1={116} x2={160} y2={116} /><line x1={24} y1={124} x2={160} y2={124} /></g>
      <OG sh={[{ d: `M160 112C200 118 226 150 252 196L238 204C214 162 192 132 160 130Z`, f: M.green }]} />
      <Fist c={E} at={[70, 120]} a={0} s={1.15} side="L" gloved />
      <Pinch c={E} at={[244, 200]} a={-50} s={1.1} side="R" gloved />
      <Arrow from={[212, 214]} to={[276, 226]} w={5} bend={-0.1} />
    </Scene2>
  ),
  'sf-gz-lif-havuzlama': () => {
    const rows = [210, 222, 234];
    return (
      <Scene2 bg="outdoor">
        {rows.map((y, r) => (
          <g key={r}>
            {Array.from({ length: 9 }, (_, i) => <Stk key={i} a={[120 + r * 6 + i * 3, y - 5 + (i % 4) * 1.5]} b={[312 - r * 4 - i * 2, y - 7 + (i % 3) * 2]} r={1.2} f={i % 2 ? M.stalk : shade(M.stalk, 0.12)} />)}
          </g>
        ))}
        <Person x={76} y={226} {...E} pose={{ ...POSE.kneelOne, spine: -55, chest: -45, head: -30, armF: { to: [128, 222] }, armB: { at: 'kneeF', d: [-2, -6] }, face: 'neutral' }} />
        <Timer x={204} y={40} r={16} text="2–3 hafta" />
      </Scene2>
    );
  },
  'sf-gz-lif-tarama': () => {
    const nails = Array.from({ length: 14 }, (_, i): [P, P] => [[74 + i * 12, 182], [74 + i * 12, 140]]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(56, 180, 186, 26, 4), f: M.wood }]} />
        <Lines ls={nails} c="#59606b" w={2.6} />
        {/* çivilerde kalan kısa lifler */}
        <g stroke={shade(M.fiber, 0.25)} stroke-width={1.5} fill="none">
          <path d="M80 160q8 -6 14 2t14 -2" /><path d="M128 168q8 -6 14 2t14 -2" /><path d="M170 156q8 -6 14 2" /><path d="M200 166q8 -6 14 2" />
        </g>
        {/* uzun lif demeti çivilerin arasından çekiliyor */}
        <path d="M60 150C120 146 200 140 268 96L276 110C210 154 130 162 60 164Z" fill={M.fiber} stroke={K.out} stroke-width={1.5} />
        <g stroke={shade(M.fiber, 0.3)} stroke-width={1}><path d="M64 156C130 152 200 144 270 102" fill="none" /></g>
        <Lines ls={Array.from({ length: 13 }, (_, i): [P, P] => [[80 + i * 12, 190], [80 + i * 12, 150]])} c="#4a505a" w={2.6} />
        <Fist c={E} at={[274, 102]} a={-120} s={1.1} side="R" />
        <Arrow from={[176, 92]} to={[230, 62]} w={5} />
      </Scene2>
    );
  },

  /* ───── Ihlamur ───── */
  'sf-gz-ihlamur-soyma': () => (
    <Scene2 bg="closeup">
      {/* sürgün: kabuğu kalkan yerde açık renkli iç */}
      <OG sh={[{ d: rrect(10, 136, 300, 32, 16), f: M.bark }]} />
      <path d="M150 138H306V152H150Z" fill="#efe2c4" />
      <g stroke={shade(M.bark, 0.35)} stroke-width={1.6}><line x1={20} y1={139} x2={300} y2={139} /><line x1={20} y1={153} x2={300} y2={153} /></g>
      {/* soyulan şerit */}
      <OG sh={[{ d: 'M150 138C190 132 230 104 250 62L264 68C246 112 200 146 150 152Z', f: '#a08566' }]} />
      <path d="M156 142C196 136 232 108 254 66" fill="none" stroke="#efe2c4" stroke-width={3} />
      <Fist c={ME} at={[60, 152]} a={-10} s={1.15} side="L" />
      <Pinch c={ME} at={[258, 64]} a={40} s={1.05} side="R" />
      <Arrow from={[204, 86]} to={[226, 40]} w={5} />
      {/* ilkbahar yaprağı */}
      <OG sh={[{ d: 'M300 136C292 116 270 112 262 120C270 132 286 138 300 136Z', f: K.leaf }]} />
    </Scene2>
  ),
  'sf-gz-ihlamur-batirma': () => (
    <Scene2 bg="outdoor" gy={168}>
      <Water x={120} y={168} w={200} h={72} />
      <path d="M120 168C126 196 140 226 170 240H120Z" fill={K.grass} />
      <Stk a={[78, 150]} b={[80, 196]} r={4} f={M.wood} />
      <path d="M80 158C110 160 140 190 190 220" fill="none" stroke={K.out} stroke-width={3.4} />
      <path d="M80 158C110 160 140 190 190 220" fill="none" stroke={M.rope} stroke-width={2} />
      {[0, 1, 2].map((i) => <OG key={i} sh={[{ d: rrect(186, 212 + i * 6, 112, 7, 3), f: i % 2 ? '#a08566' : M.bark }]} />)}
      <Rock x={244} y={214} s={0.9} />
      {/* demet ve taş suyun altında */}
      <path d="M132 176H320V240H176Q150 214 132 176Z" fill={K.water} opacity={0.55} />
      <Label x={254} y={40} text="6–7 hafta" />
    </Scene2>
  ),
  'sf-gz-ihlamur-ayirma': () => (
    <Scene2 bg="closeup">
      {/* alt: kaba dış kabuk */}
      <OG sh={[{ d: rrect(10, 150, 220, 18, 4), f: M.bark }]} />
      <g stroke={shade(M.bark, 0.3)} stroke-width={1.2}>{[30, 70, 110, 150, 190].map((x) => <path key={x} d={`M${x} 156l14 6`} />)}</g>
      {/* lif tabakaları */}
      {[0, 1, 2].map((i) => <OG key={i} sh={[{ d: rrect(10, 138 + i * 4, 170, 6, 2), f: tint('#e3cfa5', i * 0.1) }]} />)}
      <OG sh={[{ d: 'M176 138C210 134 236 110 250 80L262 86C248 118 220 144 180 148Z', f: '#ecdcb6' }]} />
      <OG sh={[{ d: 'M176 144C214 144 248 132 270 112L276 122C254 144 218 154 178 152Z', f: '#e3cfa5' }]} />
      <Fist c={ME} at={[60, 156]} a={-10} s={1.1} side="L" />
      <Pinch c={ME} at={[256, 82]} a={30} s={1.05} side="R" />
      <Arrow from={[216, 92]} to={[240, 48]} w={5} />
    </Scene2>
  ),

  /* ───── Halat ───── */
  'sf-gz-ters-burma': () => (
    <Scene2 bg="closeup">
      {/* lif demetinin serbest uçları */}
      <Lines ls={[[[14, 146], [70, 148]], [[18, 154], [70, 152]], [[22, 150], [70, 150]], [[250, 148], [306, 144]], [[250, 152], [302, 156]], [[250, 150], [298, 150]]]} c={shade(M.fiber, 0.35)} w={3} />
      {/* elller arasında burulmuş kısım */}
      <Rope a={[74, 150]} b={[146, 150]} w={14} c={M.fiber} />
      <Rope a={[174, 150]} b={[246, 150]} w={14} c={M.fiber} />
      {/* ortada kendiliğinden kıvrılan küçük halka */}
      <path d="M144 150C136 112 184 112 176 150" fill="none" stroke={K.out} stroke-width={15} stroke-linecap="round" />
      <path d="M144 150C136 112 184 112 176 150" fill="none" stroke={M.fiber} stroke-width={11} stroke-linecap="round" />
      <path d="M150 140C148 124 172 124 170 140" fill="none" stroke={shade(M.fiber, 0.35)} stroke-width={1.4} />
      <Fist c={ME} at={[84, 152]} a={-14} s={1.15} side="L" />
      <Fist c={ME} at={[236, 152]} a={14} s={1.15} side="R" />
      {/* ters yönlere burma */}
      <Spin cx={84} cy={70} rx={30} ry={12} from={160} to={420} w={5} />
      <Spin cx={236} cy={70} rx={30} ry={12} from={20} to={-240} w={5} />
    </Scene2>
  ),
  'sf-gz-halat-kurulum': () => {
    const hook: P = [52, 142];
    const ys = [126, 138, 150];
    const bx = 228;
    const turner: PersonProps = { x: 268, y: 226, ...ME, flip: true, pose: { ...POSE.standSide, armF: { to: [bx + 10, 136] }, armB: { to: [bx + 10, 142] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor">
        <Tree x={30} y={206} s={1.2} />
        <path d={`M${hook[0] - 8} ${hook[1]}h12`} stroke={K.out} stroke-width={3} />
        {ys.map((y, i) => <path key={i} d={`M${hook[0]} ${hook[1]}L${bx} ${y}`} stroke={K.out} stroke-width={4} />)}
        {ys.map((y, i) => <path key={'c' + i} d={`M${hook[0]} ${hook[1]}L${bx} ${y}`} stroke={M.rope} stroke-width={2.2} />)}
        <OG sh={[{ d: rrect(bx - 4, 116, 10, 44, 3), f: M.wood }]} />
        <Person {...turner} />
        <Spin cx={bx} cy={98} rx={18} ry={8} from={160} to={440} w={4} />
      </Scene2>
    );
  },
  'sf-gz-halat-ayrac': () => {
    const bx = 150;
    const ys = [100, 132, 164];
    return (
      <Scene2 bg="closeup">
        <Rope a={[10, 132]} b={[bx - 4, 132]} w={20} />
        {ys.map((y, i) => (
          <g key={i}>
            <path d={`M${bx} ${y}L316 ${y}`} stroke={K.out} stroke-width={11} />
            <path d={`M${bx} ${y}L316 ${y}`} stroke={M.rope} stroke-width={8} />
          </g>
        ))}
        <OG sh={[{ d: `M${bx - 8} 74H${bx + 8}V190H${bx - 8}Z`, f: M.wood }]} />
        {ys.map((y, i) => <path key={'n' + i} d={`M${bx - 8} ${y - 5}h16v10h-16z`} fill={shade(M.wood, 0.35)} />)}
        <Stk a={[bx, 188]} b={[bx, 236]} r={6} f={M.wood} />
        <Fist c={E} at={[bx, 218]} a={0} s={1.1} side="R" />
        <Arrow from={[bx + 30, 48]} to={[bx + 110, 48]} />
      </Scene2>
    );
  },

  /* ───── Dokuma ───── */
  'sf-gz-dokuma-cozgu': () => {
    const xs = Array.from({ length: 10 }, (_, i) => 88 + i * 12);
    return (
      <Scene2 bg="closeup">
        <LoomFrame x={60} y={26} w={210} h={196} t={14} />
        {/* çiviler */}
        {Array.from({ length: 15 }, (_, i) => 82 + i * 12).map((x) => <g key={x}><circle cx={x} cy={34} r={2.6} fill="#59606b" stroke={K.out} /><circle cx={x} cy={214} r={2.6} fill="#59606b" stroke={K.out} /></g>)}
        {/* bağlanmış uç + zikzak çözgü */}
        <path d={`M82 34 ${xs.map((x, i) => `L${x} ${i % 2 ? 214 : 34}`).join(' ')}`} fill="none" stroke={K.out} stroke-width={4.4} stroke-linejoin="round" />
        <path d={`M82 34 ${xs.map((x, i) => `L${x} ${i % 2 ? 214 : 34}`).join(' ')}`} fill="none" stroke={M.wool} stroke-width={2.4} stroke-linejoin="round" />
        <circle cx={82} cy={34} r={5} fill={M.wool} stroke={K.out} stroke-width={1.5} />
        {/* çekilen ip yumağa gidiyor */}
        <Yarn d="M196 34C210 70 230 130 262 190" c={M.wool} w={2.4} />
        <Fluff x={274} y={204} w={40} h={34} seed={3} />
        <Arrow from={[212, 196]} to={[212, 72]} w={5} />
      </Scene2>
    );
  },
  'sf-gz-dokuma-kirkit': () => {
    const xs = Array.from({ length: 11 }, (_, i) => 50 + i * 22);
    const weft = '#c0603e';
    return (
      <Scene2 bg="closeup">
        <Warp x0={50} x1={270} n={11} y0={0} y1={240} />
        {/* düz dokuma: atkı bir alttan bir üstten */}
        {Array.from({ length: 6 }, (_, r) => {
          const y = 170 + r * 11;
          return (
            <g key={r}>
              <OG sh={[{ d: rrect(36, y, 248, 7, 3), f: weft }]} ow={1} />
              {xs.map((x, i) => ((i + r) % 2 ? <rect key={i} x={x - 2.4} y={y - 0.5} width={4.8} height={8} fill={M.wool} stroke={K.out} stroke-width={0.8} /> : null))}
            </g>
          );
        })}
        {/* son atkı: hafif yay */}
        <Yarn d="M36 150Q160 132 284 150" c={weft} w={5} />
        <Kirkit x={160} y={140} w={150} teeth={7} />
        <Fist c={A} at={[160, 64]} a={180} s={1.05} side="R" />
        <Arrow from={[268, 70]} to={[268, 140]} w={6} />
      </Scene2>
    );
  },

  /* ───── Örgü ───── */
  'sf-gz-orgu-sis-yapma': () => (
    <Scene2 bg="closeup">
      <Pointed a={[30, 70]} b={[290, 52]} r={5} knob={8} />
      <Pointed a={[30, 104]} b={[290, 86]} r={5} knob={8} />
      <Pointed a={[150, 170]} b={[290, 160]} r={6} hook />
      <g stroke={K.ink} stroke-width={1.5}><line x1={22} y1={28} x2={290} y2={28} /><line x1={22} y1={22} x2={22} y2={34} /><line x1={290} y1={22} x2={290} y2={34} /></g>
      <Label x={156} y={28} text="30 cm" size={13} />
      <Label x={110} y={170} text="tığ" size={13} bg={K.white} />
      <Rock x={84} y={226} s={1.1} />
    </Scene2>
  ),
  'sf-gz-orgu-tig': () => {
    const yarnC = '#4f86c6';
    const links = Array.from({ length: 6 }, (_, i) => 30 + i * 26);
    return (
      <Scene2 bg="closeup">
        {/* zincir */}
        {links.map((x, i) => <Yarn key={i} d={ell([x, 190], 15, 8)} c={i % 2 ? yarnC : tint(yarnC, 0.15)} />)}
        {/* tığ */}
        <Pointed a={[290, 36]} b={[160, 194]} r={5} hook />
        {/* son zincir halkası tığın önünde */}
        <Yarn d={`M${links[5] - 15} 190A15 8 0 0 0 ${links[5] + 15} 190`} c={tint(yarnC, 0.15)} />
        {/* tığdaki iki halka */}
        <Yarn d={ell([212, 132], 14, 6)} c={yarnC} />
        <Yarn d={ell([198, 149], 14, 6)} c={tint(yarnC, 0.15)} />
        {/* kancaya takılan ip */}
        <Yarn d="M300 214C250 214 200 210 172 202C164 199 160 194 166 190" c={yarnC} />
        <Arrow from={[176, 104]} to={[222, 52]} w={5} />
      </Scene2>
    );
  },

  /* ───── Bitki boyası ───── */
  'sf-gz-boya-ceviz': () => {
    const nut = (x: number, y: number, r = 9) => <OG sh={[{ d: ell([x, y], r, r * 0.9), f: '#7d9b3e' }]} />;
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Campfire x={140} y={226} s={0.85} />
        <Stk a={[56, 206]} b={[224, 206]} r={3} f={M.iron} />
        <Vat x={72} y={98} w={136} h={106} liquid={0.82} lc="#5b3a24" />
        {nut(100, 124)}{nut(126, 120, 8)}{nut(152, 125)}{nut(178, 121, 8)}{nut(140, 132, 7)}
        <Steam x={140} y={84} n={3} h={26} gap={26} />
        {/* toplanmış yeşil kabuk yığını */}
        {[[252, 214], [270, 214], [288, 214], [261, 202], [279, 202], [270, 191]].map(([x, y], i) => <g key={i}>{nut(x, y, 10)}</g>)}
        <Timer x={70} y={40} text="1 saat" />
      </Scene2>
    );
  },
  'sf-gz-boya-isitma': () => {
    const red = '#a3263a';
    const yarnC = M.wool;
    // yün çileleri: kabın üstündeki çubuktan boya banyosuna sarkıyor
    const skein = (x: number) => (
      <g>
        <OG sh={[{ d: `M${x - 12} 92C${x - 16} 130 ${x - 14} 168 ${x} 182C${x + 14} 168 ${x + 16} 130 ${x + 12} 92Z`, f: yarnC }]} />
        <g stroke={shade(yarnC, 0.3)} stroke-width={1.2}>{[-6, 0, 6].map((d) => <line key={d} x1={x + d} y1={96} x2={x + d * 0.6} y2={176} />)}</g>
      </g>
    );
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Campfire x={128} y={226} s={0.95} />
        <Stk a={[44, 206]} b={[212, 206]} r={3} f={M.iron} />
        <Vat x={60} y={100} w={136} h={104} liquid={0} lc={red} />
        {skein(98)}{skein(128)}{skein(158)}
        {/* boya banyosu (çilelerin önünde, yarı saydam) */}
        <path d="M67 122H189V190Q189 197 182 197H74Q67 197 67 190Z" fill={red} opacity={0.82} />
        <line x1={67} y1={122} x2={189} y2={122} stroke={tint(red, 0.4)} stroke-width={2.5} />
        <Stk a={[48, 92]} b={[208, 92]} r={4} f={M.wood} />
        <Steam x={128} y={80} n={3} h={22} gap={30} />
        <Label x={128} y={36} text="75 °C" size={18} />
        {/* kaynayan kap: yanlış */}
        <Vat x={232} y={130} w={64} h={52} liquid={0.85} lc={red} />
        {[[248, 150], [262, 142], [276, 152], [256, 162], [282, 140]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#d65468" stroke="#fff" stroke-width={1.2} />)}
        <No x={264} y={156} r={34} />
      </Scene2>
    );
  },
  'sf-gz-boya-kurutma': () => {
    const sk = (x: number, c: string, len = 70) => (
      <g>
        <OG sh={[{ d: rrect(x - 13, 66, 26, len + 14, 12), f: c }]} />
        <g stroke={shade(c, 0.3)} stroke-width={1.3}>{[-7, -2, 3, 8].map((d) => <line key={d} x1={x + d} y1={84} x2={x + d} y2={66 + len} />)}</g>
        <OG sh={[{ d: rrect(x - 14, 96, 28, 7, 3), f: shade(c, 0.15) }]} />
        <Drop x={x} y={82 + len + 18} s={0.7} />
      </g>
    );
    return (
      <Scene2 bg="outdoor">
        <ellipse cx={170} cy={214} rx={160} ry={18} fill="#5e8c3f" opacity={0.5} />
        <Tree x={36} y={206} s={1.5} />
        <Stk a={[40, 78]} b={[306, 70]} r={5} f={K.trunk} />
        {sk(110, '#7a4b2a')}
        {sk(160, '#e08a2c', 76)}
        {sk(210, '#b0303c', 66)}
        {sk(258, '#d8b13a', 72)}
      </Scene2>
    );
  },

  /* ───── Hasır ve kilim ───── */
  'sf-gz-hasir-orme': () => {
    const xs = Array.from({ length: 10 }, (_, i) => 52 + i * 24);
    const ys = [70, 90, 110, 130];
    const reed = M.reed;
    const vert = (x: number, y0: number, y1: number, k: string) => <OG key={k} sh={[{ d: rrect(x - 8, y0, 16, y1 - y0, 3), f: shade(reed, 0.06) }]} ow={1.1} />;
    return (
      <Scene2 bg="closeup">
        <Stk a={[24, 40]} b={[296, 40]} r={6} f={M.wood} />
        {xs.map((x) => vert(x, 36, 230, 'v' + x))}
        {ys.map((y, r) => (
          <g key={y}>
            <OG sh={[{ d: rrect(36, y - 8, 248, 16, 3), f: reed }]} ow={1.1} />
            {xs.map((x, i) => ((i + r) % 2 ? vert(x, y - 9, y + 9, 'u' + y + x) : null))}
          </g>
        ))}
        {/* yeni sıra: soldan yarıya kadar geçirildi */}
        <OG sh={[{ d: rrect(36, 142, 280, 16, 3), f: tint(reed, 0.15) }]} ow={1.1} />
        {xs.map((x, i) => (i % 2 === 0 ? vert(x, 141, 159, 'n' + x) : null))}
        <Pinch c={A} at={[300, 150]} a={-80} s={1.0} side="R" />
        <Arrow from={[240, 190]} to={[120, 190]} w={6} />
      </Scene2>
    );
  },
  'sf-gz-kilim-kirkit': () => {
    const red = '#a3263a';
    return (
      <Scene2 bg="closeup">
        <Warp x0={40} x1={280} n={13} y0={0} y1={150} />
        {/* çözgüyü tamamen örten sık atkı */}
        <OG sh={[{ d: rrect(24, 150, 272, 100, 2), f: red }]} />
        <g stroke={shade(red, 0.25)} stroke-width={1.2}>{Array.from({ length: 16 }, (_, i) => <line key={i} x1={26} y1={156 + i * 6} x2={294} y2={156 + i * 6} />)}</g>
        <OG sh={[{ d: `M24 ${150}h272v12h-272z`, f: '#e8b84a' }]} />
        <g stroke={shade('#e8b84a', 0.25)} stroke-width={1.2}><line x1={26} y1={156} x2={294} y2={156} /></g>
        <Yarn d="M24 132Q160 112 296 132" c="#e8b84a" w={6} />
        <Kirkit x={160} y={122} w={180} teeth={12} />
        <Fist c={A} at={[160, 46]} a={180} s={1.05} side="R" />
        <Arrow from={[284, 50]} to={[284, 118]} w={6} />
      </Scene2>
    );
  },
  'sf-gz-kilim-desen': () => {
    const red = '#a3263a', yel = '#e8b84a';
    // sınır: satır gruplarına göre x
    const bands = [{ y0: 30, y1: 90, bx: 150 }, { y0: 90, y1: 150, bx: 172 }, { y0: 150, y1: 210, bx: 150 }];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(30, 30, 260, 180, 3), f: red }]} />
        {bands.map((b, i) => <rect key={i} x={b.bx} y={b.y0} width={290 - b.bx} height={b.y1 - b.y0} fill={yel} />)}
        <g stroke={K.out} stroke-width={0.8} opacity={0.35}>{Array.from({ length: 29 }, (_, i) => <line key={i} x1={31} y1={36 + i * 6} x2={289} y2={36 + i * 6} />)}</g>
        {/* yarıklar */}
        {bands.map((b, i) => <line key={'s' + i} x1={b.bx} y1={b.y0 + 6} x2={b.bx} y2={b.y1 - 6} stroke={K.out} stroke-width={3} />)}
        <rect x={30} y={30} width={260} height={180} rx={3} fill="none" stroke={K.out} stroke-width={3} />
        {/* atkıların dönüşü */}
        <Yarn d="M100 66H144Q150 66 150 72Q150 78 144 78H100" c={tint(red, 0.15)} w={3.6} />
        <Yarn d="M210 66H156Q150 66 150 72Q150 78 156 78H210" c={tint(yel, 0.1)} w={3.6} />
        <Arrow from={[220, 228]} to={[176, 182]} w={5} />
      </Scene2>
    );
  },

  /* ───── Dikiş ───── */
  'sf-gz-dikis-geri': () => {
    const cloth = '#6f93b8';
    const th = '#f2d24a';
    const pts = [40, 70, 100, 130, 160];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(10, 96, 300, 90, 6), f: cloth }]} />
        {/* kesintisiz geri dikiş */}
        <Yarn d={`M${pts[0]} 140H${pts[pts.length - 1]}`} c={th} w={4} />
        {pts.map((x) => <circle key={x} cx={x} cy={140} r={2} fill={K.out} />)}
        {/* ip bir ilmek ileriden çıkmış (190), iğne geri 160'a girip 220'den çıkıyor */}
        <circle cx={190} cy={140} r={2.4} fill={K.out} />
        <Yarn d="M190 140C192 104 130 96 108 132" c={th} w={3} />
        <SewNeedle a={[104, 134]} b={[162, 140]} />
        <path d="M162 140H220" stroke={K.out} stroke-width={3} stroke-dasharray="5 4" />
        <SewNeedle a={[198, 141]} b={[262, 143]} />
        <rect x={190} y={134} width={30} height={12} fill="#6f93b8" />
        <path d="M190 140H220" stroke={K.out} stroke-width={3} stroke-dasharray="5 4" />
        <circle cx={190} cy={140} r={2.4} fill={K.out} />
        <Arrow from={[188, 82]} to={[160, 120]} w={4} bend={0.3} />
        <Arrow from={[166, 206]} to={[226, 206]} w={5} />
      </Scene2>
    );
  },
  'sf-gz-dikis-yama': () => {
    const denim = '#4a6a96';
    const patch = '#8b6a4a';
    const st = (x1: number, y1: number, x2: number, y2: number, n: number) =>
      Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
        return <line key={x1 + '-' + y1 + '-' + i} x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} stroke="#f2d24a" stroke-width={2.4} stroke-linecap="round" />;
      });
    return (
      <Scene2 bg="closeup">
        {/* pantolon paçası */}
        <OG sh={[{ d: 'M80 0H244L256 240H68Z', f: denim }]} />
        <path d="M162 0V240" stroke={shade(denim, 0.25)} stroke-width={1.5} stroke-dasharray="4 3" />
        {/* yama */}
        <OG sh={[{ d: rrect(104, 74, 116, 96, 4), f: patch }]} />
        <rect x={110} y={80} width={104} height={84} fill="none" stroke={shade(patch, 0.3)} stroke-width={1.5} />
        {st(104, 74, 220, 74, 12)}{st(104, 170, 220, 170, 12)}{st(104, 74, 104, 170, 10)}{st(220, 74, 220, 170, 10)}
        {/* altta kalan delik (kesik çizgi) */}
        <path d="M132 100Q162 92 192 104Q198 124 188 144Q160 150 134 142Q126 120 132 100Z" fill="none" stroke={K.white} stroke-width={2} stroke-dasharray="5 4" />
        <g stroke={K.ink} stroke-width={1.4}><line x1={192} y1={186} x2={220} y2={186} /><line x1={192} y1={180} x2={192} y2={192} /><line x1={220} y1={180} x2={220} y2={192} /></g>
        <Label x={206} y={210} text="1–2 cm" size={14} />
      </Scene2>
    );
  },
  'sf-gz-dikis-deri': () => {
    const th = '#e9e2cf';
    const holes = Array.from({ length: 9 }, (_, i) => 40 + i * 26);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(10, 150, 300, 60, 4), f: shade(M.leather, 0.1) }]} />
        <OG sh={[{ d: rrect(10, 112, 300, 56, 4), f: M.leather }]} />
        {holes.map((x) => <circle key={x} cx={x} cy={140} r={3} fill={K.out} />)}
        {holes.slice(0, 5).map((x, i) => <line key={'s' + i} x1={x + 3} y1={140} x2={x + 23} y2={140} stroke={th} stroke-width={3.4} stroke-linecap="round" />)}
        {/* son delik (x=170): bir iğne önden giriyor, öbürü aynı delikten çıkıyor */}
        <Yarn d="M144 140C150 110 152 86 150 72" c={th} w={2.6} />
        <SewNeedle a={[150, 70]} b={[166, 134]} />
        <Yarn d="M170 140C190 150 214 168 236 196" c={th} w={2.6} />
        <SewNeedle a={[232, 192]} b={[260, 222]} />
        <Arrow from={[124, 70]} to={[150, 118]} w={4} />
        {/* balmumu */}
        <OG sh={[{ d: ell([266, 76], 26, 16), f: '#e8c45a' }]} />
        <path d="M250 70q10 -6 24 0" stroke={tint('#e8c45a', 0.5)} stroke-width={3} fill="none" />
      </Scene2>
    );
  },

  /* ───── Deri yüzme ───── */
  'sf-gz-deri-kazima': () => <BeamScrape />,
  'sf-gz-deri-tuzlama': () => {
    const pts: P[] = [[60, 70], [110, 52], [160, 60], [210, 52], [262, 72], [276, 120], [266, 172], [214, 190], [160, 180], [104, 192], [54, 172], [44, 120]];
    const salt = Array.from({ length: 70 }, (_, i): P => [70 + ((i * 53) % 190), 72 + ((i * 37) % 104)]);
    return (
      <Scene2 bg="floor">
        <OG sh={[{ d: smooth(pts, true), f: '#ecd2b4' }]} />
        {salt.map(([x, y], i) => <rect key={i} x={x} y={y} width={3.4} height={3.4} fill={M.salt} stroke={shade('#ecd2b4', 0.2)} stroke-width={0.5} transform={`rotate(${i * 23} ${x + 1.7} ${y + 1.7})`} />)}
        <path d="M220 150q16 -6 30 4q-6 14 -26 10z" fill={M.salt} opacity={0.95} />
        <Hand x={276} y={214} a={-40} s={1.0} pose="press" side="R" skin={C.skin} arm={200} sleeve={topOf(C)} />
        <Label x={66} y={214} text="2 kg tuz" size={14} bg={K.white} />
      </Scene2>
    );
  },
  'sf-gz-deri-cerceve': () => <HideFrame c="#ecd2b4" sunNo />,

  /* ───── Tabaklama 1 ───── */
  'sf-gz-tabak-kul-suyu': () => {
    const grey = '#a9a69e';
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* beyaz odun külü yığını */}
        <OG sh={[{ d: 'M14 222C20 196 44 180 62 180C80 180 100 198 106 222Z', f: '#e4e1da' }]} />
        <path d="M34 204q10 -6 20 -2M60 196q10 -2 18 4" stroke={shade('#e4e1da', 0.2)} stroke-width={1.6} fill="none" />
        <Vat x={112} y={112} w={110} h={106} liquid={0.78} lc={grey} c="#9aa4ae" />
        <Arrow from={[56, 168]} to={[128, 104]} bend={-0.3} w={5} />
        <Stk a={[150, 206]} b={[198, 76]} r={3.6} f={M.woodL} />
        {/* boyalı, çivili tahta ve kömür: kullanma */}
        <OG sh={[{ d: rrect(238, 176, 66, 14, 2), f: '#4f86c6' }]} />
        <circle cx={254} cy={183} r={2.6} fill={M.iron} stroke={K.out} stroke-width={1} />
        <OG sh={[{ d: 'M250 210l12 -10l16 2l8 12l-14 8z', f: '#2f3238' }]} />
        <No x={270} y={196} r={32} />
      </Scene2>
    );
  },
  'sf-gz-tabak-kil-cekme': () => {
    const hide = '#cbbfae';
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M0 150C80 140 180 146 320 136V240H0Z', f: hide }]} />
        <path d="M0 158C80 148 180 154 320 144" stroke={shade(hide, 0.2)} stroke-width={2} fill="none" />
        <g stroke="#8a7a66" stroke-width={2} stroke-linecap="round">
          {Array.from({ length: 30 }, (_, i) => { const x = 8 + i * 10.5; if (x > 130 && x < 186) return null; return <line key={i} x1={x} y1={146 - (x / 320) * 10} x2={x - 4} y2={132 - (x / 320) * 10} />; })}
        </g>
        {/* çekilen tutam */}
        <g stroke="#8a7a66" stroke-width={2} stroke-linecap="round">{[0, 1, 2, 3, 4].map((i) => <line key={i} x1={152 + i * 3} y1={90} x2={150 + i * 3.6} y2={72} />)}</g>
        <Pinch c={C} at={[158, 80]} a={160} s={1.1} side="R" gloved />
        <g stroke="#8a7a66" stroke-width={2} stroke-linecap="round"><line x1={196} y1={110} x2={192} y2={98} /><line x1={120} y1={118} x2={116} y2={106} /></g>
        <Arrow from={[204, 128]} to={[204, 74]} w={5} />
        <Ok x={262} y={56} r={18} />
      </Scene2>
    );
  },
  'sf-gz-tabak-kazima': () => <BeamScrape hairUp />,

  /* ───── Tabaklama 2 ───── */
  'sf-gz-mese-fici': () => {
    const liq = '#6b2f1c';
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Vat x={70} y={100} w={150} h={122} liquid={0.8} lc={liq} c={M.wood} />
        <g stroke={shade(M.wood, 0.3)} stroke-width={1.4}>{[92, 120, 148, 176, 204].map((x) => <line key={x} x1={x} y1={98} x2={x} y2={104} />)}</g>
        <rect x={66} y={118} width={158} height={6} fill={M.iron} stroke={K.out} stroke-width={1} />
        <rect x={66} y={196} width={158} height={6} fill={M.iron} stroke={K.out} stroke-width={1} />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={84 + ((i * 37) % 120)} y={150 + ((i * 17) % 50)} width={9} height={5} fill={M.bark} transform={`rotate(${i * 31} ${88 + ((i * 37) % 120)} ${152 + ((i * 17) % 50)})`} />)}
        {/* çaydanlıktan kaynar su */}
        <path d="M206 68Q170 70 160 124" fill="none" stroke={K.waterLight} stroke-width={6} stroke-linecap="round" />
        <OG sh={[{ d: 'M214 36H276Q286 62 276 92H214Q204 62 214 36Z', f: '#8e99a6' }, { d: 'M216 62L194 54L198 70L214 76Z', f: '#8e99a6' }]} />
        <path d="M226 30q18 -12 36 0" fill="none" stroke={K.out} stroke-width={3} />
        <Steam x={246} y={30} n={2} h={22} gap={16} />
        <Label x={118} y={40} text="2–3 hafta" size={15} />
      </Scene2>
    );
  },
  'sf-gz-mese-guclendirme': () => {
    const cs = ['#d9a46a', '#b9713f', '#8c4628', '#5e2a17'];
    return (
      <Scene2 bg="closeup">
        {cs.map((c, i) => <Vat key={i} x={16 + i * 78} y={110} w={58} h={78} liquid={0.8} lc={c} c={M.wood} />)}
        {cs.map((_, i) => <Num key={'n' + i} x={45 + i * 78} y={212} n={String(i + 1)} />)}
        {[0, 1, 2].map((i) => <Arrow key={'a' + i} from={[60 + i * 78, 88]} to={[106 + i * 78, 88]} w={5} bend={0.25} />)}
        <Label x={160} y={36} text="her hafta" size={15} bg={K.white} />
      </Scene2>
    );
  },
  'sf-gz-mese-kesit': () => {
    const br = '#7a4426';
    const band = (x: number, mid: boolean) => (
      <g>
        <OG sh={[{ d: rrect(x, 96, 120, 52, 6), f: br }]} />
        {mid && <rect x={x + 3} y={114} width={114} height={16} fill="#e6c9a2" />}
        <rect x={x} y={96} width={120} height={52} rx={6} fill="none" stroke={K.out} stroke-width={3} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {band(26, true)}
        {band(174, false)}
        <Bad x={86} y={180} r={18} />
        <Ok x={234} y={180} r={18} />
      </Scene2>
    );
  },

  /* ───── Ham deri ───── */
  'sf-gz-hamderi-cerceve': () => <HideFrame c="#e7cf9e" op={0.82} />,
  'sf-gz-hamderi-sirim': () => {
    const cx = 140, cy = 128, R = 92, wd = 12;
    const pts: P[] = [];
    for (let t = 0; t < Math.PI * 2 * 3.2; t += 0.12) {
      const r = R - (wd * t) / (Math.PI * 2);
      pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
    }
    const h = { a: -120, s: 1.05, side: 'R' as const, pose: 'fist' as const };
    const w = wristFor(h, 'grip', [258, 46]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: circ([cx, cy], R), f: '#e7cf9e' }]} />
        <path d={smooth(pts)} fill="none" stroke={shade('#e7cf9e', 0.4)} stroke-width={2} />
        {/* ayrılan şerit */}
        <OG sh={[{ d: `M${cx + R} ${cy}C${cx + R + 20} ${cy - 30} 270 120 304 118L304 130C272 132 ${cx + R + 24} ${cy + 4} ${cx + R - wd} ${cy}Z`, f: '#e7cf9e' }]} />
        {/* bıçak: kesim noktasında */}
        <OG sh={[{ d: `M${cx + R - wd / 2} ${cy + 2}L${cx + R + 14} ${cy - 60}L${cx + R + 22} ${cy - 56}Z`, f: '#c9d0d8' }]} />
        <Stk a={[cx + R + 18, cy - 58]} b={[258, 46]} r={5} f={M.wood} />
        <Hand x={w[0]} y={w[1]} {...h} skin={ME.skin} arm={200} sleeve={topOf(ME)} />
        <Label x={286} y={150} text="1 cm" size={13} />
      </Scene2>
    );
  },
  'sf-gz-hamderi-baglama': () => {
    const raw = '#d9c08f';
    return (
      <Scene2 bg="closeup">
        <Stk a={[12, 140]} b={[246, 140]} r={11} f={M.wood} />
        <OG sh={[{ d: 'M206 54L236 50L248 140L236 226L206 222L218 140Z', f: M.flint }]} />
        <Stk a={[230, 140]} b={[280, 140]} r={11} f={M.wood} />
        {/* çapraz sırım sargısı */}
        {[0, 1, 2, 3].map((i) => <Yarn key={'a' + i} d={`M${184 + i * 6} ${116 + i * 4}L${256 - i * 6} ${164 - i * 4}`} c={raw} w={5} />)}
        {[0, 1, 2, 3].map((i) => <Yarn key={'b' + i} d={`M${184 + i * 6} ${164 - i * 4}L${256 - i * 6} ${116 + i * 4}`} c={tint(raw, 0.1)} w={5} />)}
        {[0, 1, 2].map((i) => <Yarn key={'c' + i} d={`M${170 + i * 8} 124V156`} c={raw} w={5} />)}
        <Arrow from={[176, 80]} to={[188, 110]} w={5} />
        <Arrow from={[176, 200]} to={[188, 170]} w={5} />
        <Arrow from={[290, 80]} to={[268, 108]} w={5} />
        <Arrow from={[290, 200]} to={[268, 172]} w={5} />
      </Scene2>
    );
  },

  /* ───── Çarık ───── */
  'sf-gz-carik-cizim': () => {
    const foot = smooth([[160, 210], [134, 200], [126, 160], [124, 110], [130, 66], [150, 40], [176, 42], [190, 66], [194, 110], [190, 160], [184, 200]], true);
    const out = smooth([[160, 236], [104, 220], [94, 160], [94, 104], [104, 46], [140, 14], [182, 14], [216, 46], [226, 104], [224, 160], [214, 220]], true);
    return (
      <Scene2 bg="floor">
        <OG sh={[{ d: rrect(72, 4, 176, 236, 16), f: M.leather }]} />
        <path d={out} fill="none" stroke="#1d1d22" stroke-width={3.4} stroke-dasharray="9 5" />
        <OG sh={[{ d: foot, f: M.wool }]} />
        <g stroke={K.ink} stroke-width={1.5}><line x1={194} y1={110} x2={226} y2={110} /></g>
        <Label x={270} y={110} text="4–5 cm" size={13} />
        <g stroke={K.ink} stroke-width={1.5}><line x1={160} y1={16} x2={160} y2={40} /><line x1={166} y1={28} x2={232} y2={28} /></g>
        <Label x={270} y={28} text="5–6 cm" size={13} />
      </Scene2>
    );
  },
  'sf-gz-carik-toplama': () => <CarikFoot stage="gather" />,
  'sf-gz-carik-baglama': () => <CarikFoot stage="done" />,

  /* ───── Keçe ───── */
  'sf-gz-kece-yun-yayma': () => {
    const clip1 = 'gza-kece-1', clip2 = 'gza-kece-2';
    return (
      <Scene2 bg="floor">
        <OG sh={[{ d: mittenPath(150, 126, 1.45), f: '#3c4a5c' }]} />
        <defs>
          <clipPath id={clip1}><path d={mittenPath(150, 126, 1.6)} /></clipPath>
          <clipPath id={clip2}><rect x={0} y={0} width={320} height={120} /></clipPath>
        </defs>
        <g clip-path={`url(#${clip1})`}>
          {Array.from({ length: 30 }, (_, i) => <rect key={i} x={40 + i * 8} y={0} width={9} height={240} rx={4} fill={i % 2 ? M.wool : tint(M.wool, 0.3)} stroke={shade(M.wool, 0.2)} stroke-width={0.8} />)}
          <g clip-path={`url(#${clip2})`}>
            {Array.from({ length: 16 }, (_, i) => <rect key={i} x={0} y={i * 8} width={320} height={9} rx={4} fill={i % 2 ? '#fbf6ea' : M.wool} stroke={shade(M.wool, 0.25)} stroke-width={0.8} />)}
          </g>
        </g>
        <path d={mittenPath(150, 126, 1.45)} fill="none" stroke="#3c4a5c" stroke-width={2} stroke-dasharray="6 4" />
        <Arrow from={[276, 150]} to={[276, 216]} w={5} />
        <Arrow from={[30, 40]} to={[96, 40]} w={5} />
      </Scene2>
    );
  },
  'sf-gz-kece-ovma': () => {
    const clip = 'gza-tul';
    return (
      <Scene2 bg="floor">
        <OG sh={[{ d: mittenPath(150, 130, 1.55), f: '#e9e0cb' }]} />
        <defs><clipPath id={clip}><path d={mittenPath(150, 130, 1.55)} /></clipPath></defs>
        <g clip-path={`url(#${clip})`} stroke="#ffffff" stroke-width={1.2} opacity={0.8}>
          {Array.from({ length: 40 }, (_, i) => <line key={'a' + i} x1={i * 10} y1={0} x2={i * 10 - 120} y2={240} />)}
          {Array.from({ length: 40 }, (_, i) => <line key={'b' + i} x1={i * 10 - 120} y1={0} x2={i * 10} y2={240} />)}
        </g>
        {[[96, 70], [104, 82], [210, 176], [222, 168], [120, 200], [200, 64]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5 + (i % 3)} fill="#ffffff" stroke={K.waterLight} stroke-width={1.2} />)}
        <Hand x={196} y={234} a={-20} s={1.25} pose="press" side="R" skin={E.skin} arm={200} sleeve={topOf(E)} />
        <Spin cx={168} cy={150} rx={56} ry={40} from={200} to={480} />
      </Scene2>
    );
  },
  'sf-gz-kece-cimdik': () => {
    const felt = '#d8cdb4';
    return (
      <Scene2 bg="closeup">
        <line x1={160} y1={20} x2={160} y2={220} stroke={K.out} stroke-width={2} opacity={0.3} />
        <OG sh={[{ d: rrect(18, 150, 128, 60, 6), f: felt }]} />
        <OG sh={[{ d: rrect(174, 150, 128, 60, 6), f: shade(felt, 0.06) }]} />
        {/* solda lif kalkıyor */}
        <g stroke={shade(felt, 0.35)} stroke-width={1.4} fill="none">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${72 + i * 3} 152C${70 + i * 4} 130 ${76 + i * 2} 110 ${78 + i} 96`} />)}</g>
        <Pinch c={E} at={[80, 94]} a={170} s={0.95} side="R" />
        <Pinch c={E} at={[238, 150]} a={170} s={0.95} side="R" />
        <Bad x={40} y={46} r={17} />
        <Ok x={288} y={46} r={17} />
      </Scene2>
    );
  },

  /* ───── Kış giysisi ───── */
  'sf-gz-kis-katman': () => (
    <Scene2 bg="closeup">
      <Garment x={58} y={84} c="#efe4cc" s={0.5} kind="thin" />
      <Garment x={158} y={78} c="#a3263a" s={0.56} kind="knit" />
      <Garment x={260} y={72} c="#7a4b2a" s={0.62} kind="coat" />
      <Num x={60} y={196} n="1" />
      <Num x={160} y={196} n="2" />
      <Num x={262} y={196} n="3" />
      <Arrow from={[96, 214]} to={[124, 214]} w={4} />
      <Arrow from={[196, 214]} to={[226, 214]} w={4} />
    </Scene2>
  ),
  'sf-gz-kis-pamuk-yasak': () => (
    <Scene2 bg="closeup">
      <line x1={160} y1={20} x2={160} y2={220} stroke={K.out} stroke-width={2} opacity={0.3} />
      <Garment x={80} y={64} c="#d9e4ee" s={0.72} kind="thin" />
      <path d="M62 110q18 -10 34 4q10 26 -6 40q-26 8 -32 -14q-6 -18 4 -30z" fill="#9db6cc" opacity={0.8} />
      {[[52, 96], [110, 120], [64, 168], [104, 160]].map(([x, y], i) => <Drop key={i} x={x} y={y} s={0.7} />)}
      <Garment x={240} y={64} c="#efe4cc" s={0.72} kind="knit" />
      <Label x={80} y={208} text="pamuk" size={14} bg={K.white} />
      <Label x={240} y={208} text="yün" size={14} bg={K.white} />
      <Bad x={130} y={50} r={16} />
      <Ok x={290} y={50} r={16} />
    </Scene2>
  ),
  'sf-gz-kis-uc-koruma': () => {
    const p: PersonProps = { x: 160, y: 212, s: 1.05, ...ME, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const hat = '#7d5a8a';
    const mit = '#7a4b2a';
    const ring = (x: number, y: number, rr: number) => <circle cx={x} cy={y} r={rr} fill="none" stroke={K.action} stroke-width={3} stroke-dasharray="7 5" />;
    return (
      <Scene2 bg="outdoor" ground="snow">
        <Person {...p} />
        {/* keçe başlık */}
        <OG sh={[{ d: `M${r.head[0] - r.headR * 1.05} ${r.head[1] - 1}C${r.head[0] - r.headR} ${r.head[1] - r.headR * 1.9} ${r.head[0] + r.headR} ${r.head[1] - r.headR * 1.9} ${r.head[0] + r.headR * 1.05} ${r.head[1] - 1}Z`, f: hat }]} />
        {/* boyunluk */}
        <OG sh={[{ d: rrect(r.neck[0] - 15, r.neck[1] - 4, 30, 12, 6), f: '#c6574e' }]} />
        {/* eldivenler */}
        <OG sh={[{ d: ell(r.handB, 8, 10), f: mit }, { d: ell(r.handF, 8, 10), f: mit }]} />
        {/* çarık + yün dolak */}
        <OG sh={[{ d: rrect(r.ankleB[0] - 14, r.ankleB[1] - 6, 22, 14, 6), f: M.leather }, { d: rrect(r.ankleF[0] - 8, r.ankleF[1] - 6, 22, 14, 6), f: M.leather }]} />
        {ring(r.head[0], r.head[1] + 4, 32)}
        {ring(r.handB[0], r.handB[1], 18)}
        {ring(r.handF[0], r.handF[1], 18)}
        {ring((r.ankleB[0] + r.ankleF[0]) / 2, r.ankleB[1], 30)}
      </Scene2>
    );
  },

  /* ───── Taş alet ───── */
  'sf-gz-tas-secme': () => (
    <Scene2 bg="closeup">
      <line x1={160} y1={30} x2={160} y2={210} stroke={K.out} stroke-width={2} opacity={0.3} />
      {/* çakmaktaşı */}
      <OG sh={[{ d: smooth([[30, 150], [40, 106], [78, 96], [104, 122], [96, 156]], true), f: '#5c6370' }]} />
      <path d="M50 120q12 -8 26 0M48 132q16 -10 34 0M52 144q14 -8 30 0" stroke={tint('#5c6370', 0.3)} stroke-width={1.6} fill="none" />
      {/* obsidyen */}
      <OG sh={[{ d: smooth([[100, 156], [108, 128], [138, 118], [152, 140], [140, 160]], true), f: '#22242b' }]} />
      <path d="M116 134l12 -6" stroke="#ffffff" stroke-width={2.4} stroke-linecap="round" opacity={0.8} />
      {/* kumtaşı */}
      <OG sh={[{ d: smooth([[172, 156], [178, 112], [214, 104], [232, 136], [218, 160]], true), f: '#d6b98a' }]} />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={184 + ((i * 13) % 40)} cy={118 + ((i * 7) % 36)} r={1.3} fill={shade('#d6b98a', 0.35)} />)}
      <circle cx={226} cy={166} r={2.2} fill="#d6b98a" stroke={K.out} /><circle cx={214} cy={170} r={1.8} fill="#d6b98a" stroke={K.out} />
      {/* çatlaklı taş */}
      <OG sh={[{ d: smooth([[238, 158], [244, 112], [278, 104], [298, 132], [286, 162]], true), f: '#9a9d98' }]} />
      <path d="M262 106L270 126L262 138L274 160" stroke={K.out} stroke-width={2.2} fill="none" />
      <Ok x={66} y={196} r={16} /><Ok x={128} y={196} r={16} />
      <Bad x={204} y={196} r={16} /><Bad x={268} y={196} r={16} />
    </Scene2>
  ),
  'sf-gz-tas-vurma': () => {
    const core: P[] = [[106, 174], [102, 110], [142, 82], [200, 98], [212, 170]];
    return (
      <Scene2 bg="closeup">
        {/* oturan kişinin uyluğu (yandan), dizden aşağı inen baldır; üstünde deri */}
        <OG sh={[{ d: 'M-10 176H230C262 176 280 194 278 220L274 250H226L228 226C200 222 100 224 -10 228Z', f: C.bottomC! }]} />
        <path d="M236 200q14 6 18 22" stroke={shade(C.bottomC!, 0.4)} stroke-width={2} fill="none" />
        <OG sh={[{ d: 'M30 178C100 166 200 164 248 176L250 190C200 180 100 182 32 192Z', f: M.leather }]} />
        <OG sh={[{ d: `M${core.map((p) => p.join(' ')).join('L')}Z`, f: M.flint }]} />
        <path d="M130 130q20 -10 44 0M124 150q26 -10 56 0" stroke={tint(M.flint, 0.25)} stroke-width={1.6} fill="none" />
        {/* kopan yonga */}
        <OG sh={[{ d: 'M206 102L222 110L232 170L216 174Z', f: tint(M.flint, 0.12) }]} />
        <path d="M236 150l10 4M236 166l12 2" stroke={K.out} stroke-width={1.6} />
        {/* platform açısı */}
        <path d="M142 82L142 42" stroke={K.out} stroke-width={1.4} stroke-dasharray="4 3" />
        <path d="M142 56A26 26 0 0 1 165 70" fill="none" stroke={K.action} stroke-width={3} />
        <Label x={112} y={44} text="40°" size={14} />
        {/* çekiç taşı */}
        <OG sh={[{ d: ell([248, 56], 24, 20), f: '#8f8b84' }]} />
        <Fist c={C} at={[262, 50]} a={-120} s={1.0} side="R" />
        <Arrow from={[232, 82]} to={[208, 98]} w={5} />
        <Fist c={C} at={[84, 150]} a={80} s={1.0} side="L" />
      </Scene2>
    );
  },
  'sf-gz-tas-bastirma': () => {
    const horn = '#e9dcc0';
    return (
      <Scene2 bg="closeup">
        <Hand x={20} y={196} a={80} s={1.6} pose="open" side="R" view="palm" skin={C.skin} arm={200} sleeve={topOf(C)} />
        <OG sh={[{ d: ell([118, 172], 66, 26), f: M.leather }]} />
        <OG sh={[{ d: 'M70 168C90 150 150 146 176 156L170 170C140 166 98 170 74 178Z', f: M.flint }]} />
        <path d="M80 166C106 156 146 152 172 160" stroke={tint(M.flint, 0.3)} stroke-width={1.4} fill="none" />
        {/* boynuz uç */}
        <OG sh={[{ d: 'M150 152C170 120 220 76 296 44L304 58C236 92 184 132 160 158Z', f: horn }]} />
        <Fist c={C} at={[268, 66]} a={-150} s={1.05} side="R" />
        <OG sh={[{ d: 'M178 160l8 6l-6 6z', f: tint(M.flint, 0.2) }]} />
        <Arrow from={[204, 128]} to={[172, 150]} w={5} />
      </Scene2>
    );
  },

  /* ───── Kemik ve boynuz ───── */
  'sf-gz-kemik-oluk': () => (
    <Scene2 bg="closeup">
      <Bone x0={60} x1={260} y={150} r={18} />
      <path d="M78 144H242M78 158H242" stroke={shade('#efe6cf', 0.45)} stroke-width={3} />
      <OG sh={[{ d: 'M148 92H174L164 146H158Z', f: M.woodL }]} />
      <Arrow from={[161, 34]} to={[161, 84]} w={6} />
      <path d="M176 140l14 -6M144 140l-14 -6" stroke={K.out} stroke-width={1.8} />
    </Scene2>
  ),
  'sf-gz-kemik-surtme': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <OG sh={[{ d: 'M20 240C24 196 60 176 160 172C260 168 300 194 306 240Z', f: '#cdb48a' }]} />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={40 + ((i * 41) % 250)} cy={190 + ((i * 13) % 44)} r={1.4} fill={shade('#cdb48a', 0.3)} />)}
      <path d="M90 178q40 -6 120 -2" stroke={K.water} stroke-width={4} opacity={0.6} fill="none" />
      <Stk a={[132, 172]} b={[222, 110]} r={5} f="#efe6cf" />
      <Fist c={C} at={[206, 120]} a={-130} s={1.05} side="R" />
      <Arrow from={[150, 132]} to={[96, 150]} w={5} />
      <Arrow from={[150, 112]} to={[204, 92]} w={5} />
      <Drop x={84} y={164} s={0.8} /><Drop x={246} y={170} s={0.7} />
    </Scene2>
  ),
  'sf-gz-kemik-igne': () => (
    <Scene2 bg="closeup">
      <g transform="translate(40 96)">
        <OG sh={[{ d: 'M0 -7H200L246 0L200 7H0Q-8 0 0 -7Z', f: '#efe6cf' }]} />
        <ellipse cx={16} cy={0} rx={7} ry={2.6} fill={K.out} />
      </g>
      <g transform="translate(40 168)">
        <OG sh={[{ d: 'M0 -14H120L236 0L120 14H0Q-10 0 0 -14Z', f: '#e6dbbf' }]} />
      </g>
      <Label x={70} y={66} text="iğne" size={14} bg={K.white} />
      <Label x={70} y={210} text="biz" size={14} bg={K.white} />
    </Scene2>
  ),

  /* ───── Alet sapı ───── */
  'sf-gz-sap-lif-yonu': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(76, 20, 46, 196, 18), f: M.woodL }]} />
      <Grain x={76} y={20} w={46} h={196} dir={0} n={4} />
      <OG sh={[{ d: rrect(200, 20, 46, 196, 18), f: M.woodL }]} />
      <Grain x={200} y={20} w={46} h={196} dir={2} n={5} knot={[222, 120]} />
      <Ok x={99} y={224} r={14} />
      <Bad x={223} y={224} r={14} />
    </Scene2>
  ),
  'sf-gz-sap-oturtma': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <OG sh={[{ d: 'M70 206H250V240H70Z', f: K.trunk }]} />
      <OG sh={[{ d: ell([160, 206], 90, 14), f: M.woodCut }]} />
      <path d="M160 206m-60 0a60 9 0 1 0 120 0a60 9 0 1 0 -120 0" fill="none" stroke={shade(M.woodCut, 0.25)} stroke-width={1.4} />
      <Stk a={[160, 40]} b={[160, 200]} r={9} f={M.wood} />
      <AxeHead x={160} y={52} s={1} />
      {/* iki el aynı yandan, sapı dik tutuyor */}
      <Fist c={ME} at={[160, 112]} a={-90} s={1.05} side="L" />
      <Fist c={ME} at={[160, 152]} a={-90} s={1.05} side="R" />
      <Arrow from={[64, 110]} to={[64, 176]} w={6} />
      <path d="M136 196l-14 -8M184 196l14 -8M130 204h-16M190 204h16" stroke={K.out} stroke-width={2} stroke-linecap="round" />
    </Scene2>
  ),
  'sf-gz-sap-kama': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(130, 150, 60, 100, 6), f: M.wood }]} />
      <OG sh={[{ d: 'M70 120H250V174H70Z', f: M.iron }]} />
      <OG sh={[{ d: rrect(130, 80, 60, 44, 6), f: M.wood }]} />
      <path d="M160 82V120" stroke={K.out} stroke-width={3} />
      <OG sh={[{ d: 'M150 34H170L162 112H158Z', f: M.woodL }]} />
      <Arrow from={[220, 30]} to={[220, 86]} w={6} />
      <Arrow from={[136, 98]} to={[112, 98]} w={4} />
      <Arrow from={[184, 98]} to={[208, 98]} w={4} />
    </Scene2>
  ),

  /* ───── Bileme ───── */
  'sf-gz-bileme-aci': () => {
    const contact: P = [116, 150];
    const ang = -20;
    const r = (ang * Math.PI) / 180;
    const tip: P = [contact[0] + Math.cos(r) * 150, contact[1] + Math.sin(r) * 150];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(10, 172, 300, 20, 6), f: '#6f93b8' }]} />
        <OG sh={[{ d: rrect(30, 150, 260, 26, 4), f: '#8d9096' }]} />
        <g transform={`translate(${contact[0]} ${contact[1]}) rotate(${ang})`}>
          <OG sh={[{ d: 'M0 0L150 -9H160V9H150Z', f: '#c9d0d8' }]} />
        </g>
        <path d={`M${contact[0] + 110} ${contact[1]}A110 110 0 0 0 ${contact[0] + 110 * Math.cos(r)} ${contact[1] + 110 * Math.sin(r)}`} fill="none" stroke={K.action} stroke-width={4} />
        <Label x={130} y={112} text="20–25°" size={15} />
        <Hand x={tip[0] + 28} y={tip[1] - 64} a={-150} s={0.95} pose="press" side="R" skin={ME.skin} arm={200} sleeve={topOf(ME)} />
      </Scene2>
    );
  },
  'sf-gz-bileme-surme': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(40, 70, 240, 110, 8), f: '#8d9096' }]} />
      <path d="M60 90h200M60 160h200" stroke={tint('#8d9096', 0.25)} stroke-width={2} />
      <Knife a={[318, 150]} b={[96, 134]} w={24} edge={1} />
      <Fist c={ME} at={[300, 149]} a={-90} s={1.0} side="L" />
      <Arrow from={[176, 166]} to={[134, 84]} w={6} />
    </Scene2>
  ),
  'sf-gz-bileme-kayis': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(10, 96, 300, 60, 6), f: M.wood }]} />
      <OG sh={[{ d: rrect(10, 104, 300, 44, 4), f: '#8a5a34' }]} />
      <Knife a={[200, 236]} b={[176, 64]} w={26} edge={1} />
      <Fist c={ME} at={[198, 220]} a={-90} s={1.0} side="R" />
      <Arrow from={[150, 126]} to={[70, 126]} w={6} />
    </Scene2>
  ),

  /* ───── Ağaç oyma ───── */
  'sf-gz-oyma-yarma': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <OG sh={[{ d: 'M100 96H220V226H100Z', f: K.trunk }]} />
      <OG sh={[{ d: ell([160, 96], 60, 14), f: M.woodCut }]} />
      <path d="M160 96m-38 0a38 9 0 1 0 76 0a38 9 0 1 0 -76 0M160 96m-18 0a18 4 0 1 0 36 0a18 4 0 1 0 -36 0" fill="none" stroke={shade(M.woodCut, 0.25)} stroke-width={1.3} />
      <path d="M160 100L156 140L164 170L158 210" stroke={K.out} stroke-width={3} fill="none" />
      <OG sh={[{ d: 'M148 56H172L164 104H156Z', f: M.iron }]} />
      {/* tokmak */}
      <OG sh={[{ d: rrect(118, 14, 84, 34, 12), f: M.woodL }]} />
      <Stk a={[200, 32]} b={[290, 66]} r={5} f={M.wood} />
      <Fist c={C} at={[274, 60]} a={-70} s={1.0} side="R" />
      <Arrow from={[96, 22]} to={[96, 62]} w={6} />
    </Scene2>
  ),
  'sf-gz-oyma-guvenli-yon': () => {
    const hold: P = [186, 132], cut: P = [222, 150];
    const p: PersonProps = {
      x: 112, y: 228, s: 1.1, ...C,
      pose: { ...POSE.sitChair, spine: -80, chest: -66, head: -50, armB: { to: hold }, armF: { to: [cut[0] - 4, cut[1] - 8] }, face: 'neutral' },
    };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <OG sh={[{ d: 'M84 184H140V230H84Z', f: K.trunk }, { d: ell([112, 184], 28, 6), f: M.woodCut }]} />
        <Person {...p} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Stk a={[176, 126]} b={[276, 176]} r={5} f={M.woodL} />
        <Knife a={[cut[0] - 26, cut[1] - 18]} b={[cut[0] + 12, cut[1] + 6]} w={9} />
        <Person {...p} only={['armF']} />
        <Arrow from={[236, 136]} to={[292, 164]} w={6} />
        <Ok x={290} y={40} r={16} />
      </Scene2>
    );
  },
  'sf-gz-oyma-lif-yonu': () => (
    <Scene2 bg="closeup">
      <line x1={160} y1={20} x2={160} y2={220} stroke={K.out} stroke-width={2} opacity={0.3} />
      {/* sol: lif boyunca, düzgün talaş */}
      <OG sh={[{ d: rrect(20, 120, 124, 50, 6), f: M.woodL }]} />
      <Grain x={20} y={120} w={124} h={50} dir={1} n={4} />
      <OG sh={[{ d: 'M60 120C60 96 84 86 100 98C90 100 82 108 84 120Z', f: tint(M.woodL, 0.2) }]} />
      <Knife a={[30, 76]} b={[96, 114]} w={10} />
      <Ok x={124} y={56} r={16} />
      {/* sağ: lifin içine dalıp yırtıyor */}
      <OG sh={[{ d: rrect(176, 120, 124, 50, 6), f: M.woodL }]} />
      <Grain x={176} y={120} w={124} h={50} dir={2} n={4} />
      <path d="M232 120L240 134L248 128L256 144L250 150" fill={shade(M.woodL, 0.3)} stroke={K.out} stroke-width={1.6} />
      <Knife a={[186, 76]} b={[244, 132]} w={10} />
      <Bad x={284} y={56} r={16} />
    </Scene2>
  ),

  /* ───── Çivisiz birleştirme ───── */
  'sf-gz-gecme-kuru-yas': () => {
    const wet = '#8f7a4a', dry = '#e4c48e';
    return (
      <Scene2 bg="closeup">
        <line x1={160} y1={20} x2={160} y2={220} stroke={K.out} stroke-width={2} opacity={0.3} />
        <OG sh={[{ d: 'M70 30H120V96H70Z M70 144H120V210H70Z', f: wet }]} />
        <rect x={70} y={96} width={50} height={48} fill={shade(wet, 0.35)} stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: rrect(18, 104, 92, 32, 4), f: dry }]} />
        <OG sh={[{ d: 'M232 36H276V100H232Z M232 140H276V204H232Z', f: shade(wet, 0.05) }]} />
        <OG sh={[{ d: rrect(180, 102, 92, 36, 4), f: dry }]} />
        <rect x={232} y={100} width={44} height={40} fill="none" stroke={K.out} stroke-width={1.5} />
        <Arrow from={[254, 16]} to={[254, 34]} w={4} />
        <Arrow from={[254, 226]} to={[254, 208]} w={4} />
        <Arrow from={[140, 120]} to={[176, 120]} w={4} />
        <Label x={44} y={156} text="kuru" size={12} bg={K.white} />
        <Label x={95} y={16} text="yaş" size={12} bg={K.white} />
        <Ok x={300} y={30} r={14} />
      </Scene2>
    );
  },
  'sf-gz-gecme-kama': () => {
    const board = (ox: number, ok: boolean) => (
      <g>
        <OG sh={[{ d: rrect(ox, 70, 132, 100, 6), f: M.woodL }]} />
        <Grain x={ox} y={70} w={132} h={100} dir={1} n={6} />
        <OG sh={[{ d: circ([ox + 66, 120], 26), f: M.woodCut }]} />
        <path d={`M${ox + 66} 120m-14 0a14 14 0 1 0 28 0a14 14 0 1 0 -28 0`} fill="none" stroke={shade(M.woodCut, 0.25)} stroke-width={1.2} />
        {ok ? <OG sh={[{ d: rrect(ox + 62, 92, 8, 56, 2), f: M.wood }]} /> : <OG sh={[{ d: rrect(ox + 38, 116, 56, 8, 2), f: M.wood }]} />}
        {!ok && <path d={`M${ox + 94} 120L${ox + 108} 116L${ox + 118} 124L${ox + 132} 120`} stroke={K.out} stroke-width={2.4} fill="none" />}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        {board(14, true)}
        {board(174, false)}
        <Ok x={80} y={200} r={16} />
        <Bad x={240} y={200} r={16} />
      </Scene2>
    );
  },
  'sf-gz-gecme-kavela': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M90 20H150V220H90Z', f: shade(M.wood, 0.05) }]} />
      <OG sh={[{ d: 'M150 84H310V156H150Z', f: M.woodL }]} />
      <OG sh={[{ d: 'M96 98H150V142H96Z', f: M.woodL }]} />
      <circle cx={120} cy={120} r={11} fill="none" stroke={K.out} stroke-width={2} stroke-dasharray="4 3" />
      <circle cx={128} cy={120} r={11} fill={shade(M.wood, 0.4)} stroke={K.out} stroke-width={2} />
      <path d="M120 100V86M128 100V86" stroke={K.ink} stroke-width={1.4} />
      <Label x={124} y={70} text="2–3 mm" size={12} />
      <Arrow from={[250, 120]} to={[190, 120]} w={6} />
    </Scene2>
  ),

  /* ───── Kategori kapakları ───── */
  'sf-gz-lif-kapak': () => (
    <Scene2 bg="indoor">
      <LoomFrame x={36} y={60} w={110} h={146} t={10} />
      <Warp x0={56} x1={126} n={7} y0={70} y1={196} w={2.4} />
      {Array.from({ length: 6 }, (_, r) => <OG key={r} sh={[{ d: rrect(48, 150 + r * 8, 86, 6, 3), f: r % 2 ? '#c0603e' : '#a3263a' }]} ow={1} />)}
      {/* kirmen: dik mil, altta çapraz kollar, üstünde sarılı ip yumağı */}
      <Stk a={[188, 64]} b={[188, 222]} r={4} f={M.woodL} />
      <Stk a={[150, 200]} b={[226, 200]} r={4.5} f={M.wood} />
      <OG sh={[{ d: ell([188, 200], 8, 6), f: shade(M.wood, 0.15) }]} />
      <OG sh={[{ d: smooth([[188, 120], [204, 150], [206, 180], [188, 192], [170, 180], [172, 150]], true), f: M.wool }]} />
      <g stroke={shade(M.wool, 0.25)} stroke-width={1.2}>{[140, 152, 164, 176].map((y) => <line key={y} x1={177} y1={y} x2={199} y2={y + 4} />)}</g>
      <Fluff x={250} y={196} w={52} h={46} c="#4f86c6" seed={4} />
      <Fluff x={284} y={206} w={38} h={32} c="#d8b13a" seed={6} />
    </Scene2>
  ),
  'sf-gz-deri-kapak': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: smooth([[40, 50], [130, 36], [200, 50], [190, 130], [130, 150], [50, 132]], true), f: M.leather }]} />
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${196 + i * 54} ${96 + i * 12})`}>
          <OG sh={[{ d: smooth([[0, 0], [22, -6], [42, 4], [44, 70], [22, 96], [2, 80]], true), f: '#b98a5a' }]} />
          <path d="M8 18L34 30M8 34L34 22M10 48L32 58" stroke={M.raw} stroke-width={3} />
        </g>
      ))}
      <SewNeedle a={[50, 200]} b={[170, 176]} />
      <Yarn d="M50 200C30 204 24 220 44 226C70 232 110 210 140 218" c="#e9e2cf" w={2.6} />
    </Scene2>
  ),
  'sf-gz-agac-kapak': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <OG sh={[{ d: 'M70 140H190V226H70Z', f: K.trunk }]} />
      <OG sh={[{ d: ell([130, 140], 60, 14), f: M.woodCut }]} />
      <path d="M130 140m-36 0a36 8 0 1 0 72 0a36 8 0 1 0 -72 0" fill="none" stroke={shade(M.woodCut, 0.25)} stroke-width={1.3} />
      <Stk a={[130, 30]} b={[130, 118]} r={6} f={M.wood} />
      <g transform="rotate(90 130 112)"><AxeHead x={130} y={112} s={0.7} /></g>
      <OG sh={[{ d: `${ell([238, 196], 22, 14)}`, f: M.woodL }, { d: capsule([256, 192], 4, [304, 176], 5), f: M.woodL }]} />
      <path d={ell([238, 196], 14, 8)} fill={shade(M.woodL, 0.2)} />
      <OG sh={[{ d: 'M206 214L236 204L248 220L216 228Z', f: M.flint }]} />
    </Scene2>
  ),
  'sf-gz-comlek-kapak': () => {
    const clay = '#c8774a';
    const pot = (x: number, y: number, s: number) => <OG sh={[{ d: `M${x - 18 * s} ${y - 70 * s}H${x + 18 * s}C${x + 14 * s} ${y - 60 * s} ${x + 40 * s} ${y - 50 * s} ${x + 38 * s} ${y - 24 * s}C${x + 36 * s} ${y - 6 * s} ${x + 22 * s} ${y} ${x} ${y}C${x - 22 * s} ${y} ${x - 36 * s} ${y - 6 * s} ${x - 38 * s} ${y - 24 * s}C${x - 40 * s} ${y - 50 * s} ${x - 14 * s} ${y - 60 * s} ${x - 18 * s} ${y - 70 * s}Z`, f: clay }, { d: rrect(x - 22 * s, y - 76 * s, 44 * s, 8 * s, 3), f: shade(clay, 0.1) }]} />;
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <Campfire x={232} y={222} s={1.1} />
        {pot(80, 222, 1.3)}
        {pot(150, 224, 0.95)}
        <path d="M60 170q20 -6 40 0" stroke={shade(clay, 0.3)} stroke-width={2} fill="none" />
      </Scene2>
    );
  },
  'sf-gz-metal-kapak': () => (
    <Scene2 bg="dark">
      <OG sh={[{ d: 'M70 120H250Q262 120 266 128L286 132Q250 140 232 148H200V196H230V214H90V196H120V148H90C80 140 70 132 70 120Z', f: '#4b525c' }]} />
      <OG sh={[{ d: rrect(100, 106, 120, 12, 4), f: '#ff7b1c' }]} />
      <rect x={104} y={108} width={60} height={4} fill="#ffd64a" />
      <Stk a={[230, 30]} b={[180, 96]} r={4} f={M.wood} />
      <OG sh={[{ d: rrect(214, 14, 44, 24, 4), f: M.iron }]} />
      {[[150, 92, 120, 70], [170, 90, 196, 66], [140, 96, 104, 86]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#ffd64a" stroke-width={2.4} stroke-linecap="round" />)}
    </Scene2>
  ),
  'sf-gz-tasit-kapak': () => (
    <Scene2 bg="outdoor">
      {/* el arabası */}
      <OG sh={[{ d: 'M60 128H200L186 172H86Z', f: M.wood }]} />
      <Stk a={[80, 172]} b={[42, 214]} r={4} f={shade(M.wood, 0.1)} />
      <Stk a={[180, 150]} b={[270, 140]} r={4.5} f={M.wood} />
      <OG sh={[{ d: circ([60, 196], 26), f: M.woodL }]} />
      <path d="M60 196m-14 0a14 14 0 1 0 28 0a14 14 0 1 0 -28 0" fill="none" stroke={K.out} stroke-width={1.6} />
      <Stk a={[170, 172]} b={[178, 214]} r={3.5} f={shade(M.wood, 0.1)} />
      {/* kızak */}
      <path d="M196 214H286Q306 214 306 194" fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" />
      <path d="M196 214H286Q306 214 306 194" fill="none" stroke={M.woodL} stroke-width={4} stroke-linecap="round" />
      <OG sh={[{ d: rrect(202, 194, 86, 8, 3), f: M.wood }]} />
      <Stk a={[214, 202]} b={[214, 212]} r={2} f={M.wood} /><Stk a={[276, 202]} b={[276, 212]} r={2} f={M.wood} />
    </Scene2>
  ),
};
