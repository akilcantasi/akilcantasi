// Sıfırdan paketi sahneleri (b): süt ürünleri, tahıl-ekmek-kiler rehberleri. Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { JSX, ComponentChildren } from 'preact';
import {
  Arrow, Bad, No, Flame, Hand, K, Label, Ok, OG, OW, Person, POSE, Scene2, Timer, Waves, Drop, Tree, Rock, Water,
  capsule, circ, ell, rrect, smooth, shade, tint, rig, handPoint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═════════════════════ OYUNCULAR ═════════════════════
 * SUT  — süt ürünleri rehberlerinin hepsi (süt, yoğurt, kurut, peynir, lor, tereyağı): başörtülü kadın.
 * FIRIN — ekşi maya, ekmek, yufka, erişte, bal: topuzlu esmer kadın, hardal üst.
 * AMBAR — bulgur, öğütme, tahıl saklama, kiler, kum, buzhane, tuz: bıyıklı adam, yeşil üst.
 * YARDIM — buz kesmede ikinci kişi.
 */
const CAST = {
  SUT: { who: 'woman', skin: 1, hair: 'scarf', hairC: '#b8455a', top: '#8f6fc2', sleeve: 'long', bottom: 'longskirt', bottomC: '#4f5873' },
  FIRIN: { who: 'woman', skin: 2, hair: 'bun', hairC: K.hair.black, top: '#d9a13a', sleeve: 'long', bottom: 'longskirt', bottomC: '#7a4b3a' },
  AMBAR: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.dark, mustache: true, top: '#6c9c5a', sleeve: 'long', bottom: 'pants', bottomC: '#6b4f3a' },
  YARDIM: { who: 'man', skin: 3, hair: 'short', hairC: K.hair.black, top: '#c6574e', sleeve: 'long', bottom: 'pants', bottomC: '#3b3f4b' },
} as const satisfies Record<string, Partial<PersonProps>>;
/** yakın plan elleri: oyuncunun teni ve kol rengi */
const HAND = {
  SUT: { skin: 1, sleeve: CAST.SUT.top },
  FIRIN: { skin: 2, sleeve: CAST.FIRIN.top },
  AMBAR: { skin: 1, sleeve: CAST.AMBAR.top },
} as const;

/* ═════════════════════ MALZEME RENKLERİ (paket geneli) ═════════════════════ */
const C = {
  metal: '#9aa5b1',
  milk: '#fbf8ef',
  milkShade: '#ece6d6',
  yogurt: '#f6f1e2',
  whey: '#e6e7b8',
  cheese: '#fbf6e6',
  butter: '#f4d35e',
  ghee: '#e8b23a',
  wood: K.wood,
  woodDark: '#8a5a35',
  clay: '#c0704a',
  glaze: '#4f7f8f',
  glass: '#dff0f7',
  cloth: '#f3eee2',
  wool: '#b5473f',
  wheat: '#d9a94a',
  bulgur: '#c98f3c',
  flour: '#f5efe2',
  dough: '#f1dcae',
  crust: '#b86b2c',
  salt: '#ffffff',
  honey: '#e8a01c',
  honeyCrys: '#f1dca2',
  sand: '#e2c98f',
  soil: '#8a6345',
  straw: '#e7c766',
  ice: '#cde9f6',
  stone: '#a8a59c',
  sea: K.water,
  ember: '#e8472d',
};

/* ═════════════════════ YARDIMCILAR ═════════════════════ */
const STEAM = '#a9b8c8';
const BRINE = '#c4dde8';
const f1 = (n: number) => Math.round(n * 10) / 10;
const pt = (p: P) => `${f1(p[0])} ${f1(p[1])}`;
const poly = (ps: P[]) => 'M' + ps.map(pt).join('L') + 'Z';
const line = (a: P, b: P) => `M${pt(a)}L${pt(b)}`;

/** Gaz ocağı (yakın plan, önden): üstte ızgara, önde düğme. x = orta, y = üst yüzey. */
function Ocak({ x, y, w = 190, flame = 'high', knob, children }: { x: number; y: number; w?: number; flame?: 'high' | 'low' | 'off'; knob?: P; children?: ComponentChildren }) {
  const kx = knob ?? [x + w / 2 - 30, y + 26];
  const fl = flame === 'off' ? [] : [-40, -24, -8, 8, 24, 40];
  const fh = flame === 'high' ? 9 : 4;
  return (
    <g>
      <OG
        sh={[
          { d: rrect(x - w / 2, y, w, 52, 6), f: '#3d4250' },
          { d: rrect(x - w / 2, y, w, 8, 3), f: '#555b6b' },
          { d: rrect(x - 52, y - 6, 104, 6, 2), f: '#2b2d3a' },
          { d: circ(kx, 9), f: '#d6d9de' },
          { d: line([kx[0], kx[1] - 7], [kx[0], kx[1] - 1]), st: K.out, sw: 2.4 },
        ]}
      />
      {children}
      {fl.map((dx) => (
        <path key={dx} d={`M${x + dx - 4} ${y - 5}Q${x + dx} ${y - 5 - fh * 2} ${x + dx + 4} ${y - 5}Z`} fill="#4aa8ff" stroke="#2f6fd0" stroke-width={1} />
      ))}
    </g>
  );
}

/** Tencere (yandan). x = orta, y = taban. fill = içerik rengi (ağızda görünür). */
function Tencere({ x, y, w = 120, h = 66, body = C.metal, fill = C.milk, lid, handles = true, foam = 0, steam, ry = 6 }: { x: number; y: number; w?: number; h?: number; body?: string; fill?: string | null; lid?: boolean; handles?: boolean; foam?: number; steam?: boolean; ry?: number }) {
  const l = x - w / 2, r = x + w / 2, top = y - h;
  const sh: Sh[] = [];
  if (handles) sh.push({ d: capsule([l - 12, top + 12], 4, [l - 2, top + 12], 4), f: shade(body, 0.25) }, { d: capsule([r + 2, top + 12], 4, [r + 12, top + 12], 4), f: shade(body, 0.25) });
  sh.push({ d: `M${l} ${top}H${r}L${r - 2} ${y - 5}Q${r - 2} ${y} ${r - 7} ${y}H${l + 7}Q${l + 2} ${y} ${l + 2} ${y - 5}Z`, f: body });
  sh.push({ d: `M${x + w * 0.22} ${top}H${r}L${r - 2} ${y - 5}Q${r - 2} ${y} ${r - 7} ${y}H${x + w * 0.22}Z`, f: shade(body, 0.12), no: true });
  if (fill && !lid) sh.push({ d: ell([x, top], w / 2, ry), f: fill });
  if (lid) sh.push({ d: ell([x, top], w / 2 + 2, 6), f: tint(body, 0.1) }, { d: `M${x - w / 2 - 1} ${top}Q${x} ${top - 16} ${x + w / 2 + 1} ${top}Z`, f: tint(body, 0.15) }, { d: ell([x, top - 12], 8, 4), f: '#2b2d3a' });
  return (
    <g>
      <OG sh={sh} />
      {foam > 0 && fill && (
        <OG
          sh={[
            { d: smooth([[l - 3, top + 2], [l + w * 0.08, top - foam * 0.7], [x - w * 0.2, top - foam], [x, top - foam * 0.8], [x + w * 0.22, top - foam * 1.05], [r - w * 0.06, top - foam * 0.6], [r + 3, top + 2]]) + `L${l - 3} ${top + 2}Z`, f: fill },
            { d: smooth([[r + 2, top], [r + 4, top + 10], [r + 2, top + 18]]) , st: K.out, sw: 0 },
          ]}
        />
      )}
      {foam > 0 && fill && <path d={`M${r - 2} ${top + 1}Q${r + 4} ${top + 8} ${r + 1} ${top + 20}Q${r - 3} ${top + 24} ${r - 2} ${top + 14}Z`} fill={fill} stroke={K.out} stroke-width={1.3} />}
      {steam && (
        <g fill="none" stroke={STEAM} stroke-width={3} stroke-linecap="round">
          <path d={`M${x - w * 0.2} ${top - 10 - foam}c-6-7 6-11 0-20`} />
          <path d={`M${x + 2} ${top - 14 - foam}c-6-7 6-11 0-20`} />
          <path d={`M${x + w * 0.22} ${top - 10 - foam}c-6-7 6-11 0-20`} />
        </g>
      )}
    </g>
  );
}

/** Kadranlı saplama termometre. (x,y) = kadran merkezi, a = sapın yönü (derece, 90 = aşağı) */
function Termo({ x, y, a = 100, len = 70, r = 15, val = 0.6 }: { x: number; y: number; a?: number; len?: number; r?: number; val?: number }) {
  const rad = (a * Math.PI) / 180;
  const tip: P = [x + Math.cos(rad) * len, y + Math.sin(rad) * len];
  const na = Math.PI * (0.8 + 1.4 * val);
  const nd: P = [x + Math.cos(na) * r * 0.75, y + Math.sin(na) * r * 0.75];
  return (
    <g>
      <OG sh={[{ d: capsule([x, y], 2.6, tip, 2), f: '#c9d0d8' }, { d: circ([x, y], r), f: '#ffffff' }]} />
      <path d={`M${x} ${y}L${pt(nd)}`} stroke={K.danger} stroke-width={2.4} stroke-linecap="round" />
      {[0, 0.25, 0.5, 0.75, 1].map((v) => {
        const q = Math.PI * (0.8 + 1.4 * v);
        return <path key={v} d={line([x + Math.cos(q) * r * 0.82, y + Math.sin(q) * r * 0.82], [x + Math.cos(q) * r * 0.98, y + Math.sin(q) * r * 0.98])} stroke={K.out} stroke-width={1.2} />;
      })}
      <circle cx={x} cy={y} r={2} fill={K.out} />
    </g>
  );
}

/** Tahta kaşık: a = baştan sapa (kepçe ucu) ; from = sap ucu, to = kaşık başı merkezi */
function Kasik({ from, to, c = C.wood, r = 8 }: { from: P; to: P; c?: string; r?: number }) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]) * (180 / Math.PI);
  return <OG sh={[{ d: capsule(from, 3, to, 3), f: c }, { d: ell([0, 0], r * 1.4, r), t: `translate(${pt(to)}) rotate(${f1(a)})`, f: c }]} />;
}

/** Bıçak: from = sap ucu, to = uç */
function Bicak({ from, to, w = 9 }: { from: P; to: P; w?: number }) {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const hEnd: P = [from[0] + ux * L * 0.36, from[1] + uy * L * 0.36];
  const b0: P = [hEnd[0] + nx * w * 0.5, hEnd[1] + ny * w * 0.5];
  const b1: P = [hEnd[0] - nx * w * 0.5, hEnd[1] - ny * w * 0.5];
  const b2: P = [to[0] - nx * 1, to[1] - ny * 1];
  return <OG sh={[{ d: capsule(from, 4, hEnd, 4), f: '#3b3537' }, { d: `M${pt(b0)}L${pt(to)}Q${pt([b2[0] - ux * L * 0.2 - nx * w * 0.2, b2[1] - uy * L * 0.2 - ny * w * 0.2])} ${pt(b1)}Z`, f: '#dfe4ea' }]} />;
}

/** Tülbent bohçası (asılı, yandan). (x,y) = bağ noktası; h = boy; drip = damlayan sıvı rengi */
function Bohca({ x, y, w = 70, h = 78, c = C.cloth, fill, drip }: { x: number; y: number; w?: number; h?: number; c?: string; fill?: string; drip?: string }) {
  const b: P[] = [[x - 5, y + 10], [x - w * 0.42, y + h * 0.45], [x - w * 0.5, y + h * 0.78], [x - w * 0.2, y + h], [x + w * 0.2, y + h], [x + w * 0.5, y + h * 0.78], [x + w * 0.42, y + h * 0.45], [x + 5, y + 10]];
  return (
    <g>
      <OG
        sh={[
          { d: smooth(b, true, 0.9), f: fill ?? c },
          { d: `M${x - 6} ${y + 12}L${x - 12} ${y - 2}L${x - 2} ${y + 4}L${x + 3} ${y - 4}L${x + 6} ${y + 12}Z`, f: c },
          { d: line([x - w * 0.18, y + h * 0.3], [x - w * 0.26, y + h * 0.82]), st: shade(c, 0.18), sw: 1.4 },
          { d: line([x + w * 0.12, y + h * 0.32], [x + w * 0.2, y + h * 0.84]), st: shade(c, 0.18), sw: 1.4 },
          { d: capsule([x - 6, y + 9], 2.4, [x + 6, y + 9], 2.4), f: '#c9a77a' },
        ]}
      />
      {drip && (
        <g>
          <Drop x={x - 4} y={y + h + 14} s={0.8} color={drip} />
          <Drop x={x + 6} y={y + h + 34} s={0.7} color={drip} />
        </g>
      )}
    </g>
  );
}

/** Leğen / kâse (yandan): x = orta, y = taban. fill: içerik (ağızdaki elips) */
function Kase({ x, y, w = 110, h = 40, c = '#c9d3dc', fill, rim = 5 }: { x: number; y: number; w?: number; h?: number; c?: string; fill?: string; rim?: number }) {
  const l = x - w / 2, r = x + w / 2, top = y - h;
  return (
    <OG
      sh={[
        { d: `M${l} ${top}Q${l + 4} ${y} ${x - w * 0.25} ${y}H${x + w * 0.25}Q${r - 4} ${y} ${r} ${top}Z`, f: c },
        { d: `M${x + w * 0.15} ${top}H${r}Q${r - 4} ${y} ${x + w * 0.25} ${y}H${x + w * 0.15}Z`, f: shade(c, 0.12), no: true },
        { d: ell([x, top], w / 2, rim), f: fill ?? shade(c, 0.2) },
      ]}
    />
  );
}

/** Cam kavanoz (yandan, içi görünür). x = orta, y = taban. lvl = 0..1 doluluk */
function Kavanoz({ x, y, w = 70, h = 96, fill = C.milk, lvl = 0.7, lid = 'metal', children }: { x: number; y: number; w?: number; h?: number; fill?: string | null; lvl?: number; lid?: 'metal' | 'cloth' | null; children?: ComponentChildren }) {
  const l = x - w / 2, r = x + w / 2, top = y - h;
  const neck = 8;
  const body = `M${l + 6} ${top + neck}H${r - 6}Q${r} ${top + neck + 4} ${r} ${top + neck + 14}V${y - 8}Q${r} ${y} ${r - 8} ${y}H${l + 8}Q${l} ${y} ${l} ${y - 8}V${top + neck + 14}Q${l} ${top + neck + 4} ${l + 6} ${top + neck}Z`;
  const fy = y - (h - neck - 4) * lvl;
  return (
    <g>
      <OG sh={[{ d: body, f: C.glass }]} />
      {fill && lvl > 0 && <path d={`M${l + 1.5} ${fy}H${r - 1.5}V${y - 8}Q${r - 1.5} ${y - 1.5} ${r - 8} ${y - 1.5}H${l + 8}Q${l + 1.5} ${y - 1.5} ${l + 1.5} ${y - 8}Z`} fill={fill} />}
      {fill && lvl > 0 && <path d={line([l + 1.5, fy], [r - 1.5, fy])} stroke={shade(fill, 0.25)} stroke-width={1.4} />}
      {children}
      <path d={line([l + 8, top + neck + 16], [l + 8, y - 14])} stroke="#ffffff" stroke-width={4} stroke-linecap="round" opacity={0.7} />
      <path d={body} fill="none" stroke={K.out} stroke-width={2} />
      {lid === 'metal' && <OG sh={[{ d: rrect(l + 3, top - 4, w - 6, 13, 3), f: '#c8ced6' }, { d: line([l + 6, top + 2], [r - 6, top + 2]), st: shade('#c8ced6', 0.3), sw: 1.2 }]} />}
      {lid === 'cloth' && (
        <OG
          sh={[
            { d: `M${l - 4} ${top + 14}Q${l - 2} ${top - 6} ${x} ${top - 8}Q${r + 2} ${top - 6} ${r + 4} ${top + 14}Q${r - 6} ${top + 10} ${r - 10} ${top + 18}Q${x} ${top + 12} ${l + 10} ${top + 18}Q${l + 6} ${top + 10} ${l - 4} ${top + 14}Z`, f: C.cloth },
            { d: capsule([l + 1, top + 8], 2.4, [r - 1, top + 8], 2.4), f: '#c0603e' },
          ]}
        />
      )}
    </g>
  );
}

/** Odun ateşi (yandan): taşlar + odun + alev; üstüne tencere/kazan y - 18 */
function Ates({ x, y, w = 110, s = 1, low }: { x: number; y: number; w?: number; s?: number; low?: boolean }) {
  return (
    <g>
      {!low && [-0.28, 0, 0.28].map((k, i) => <Flame key={i} x={x + k * w} y={y - 6} s={(i === 1 ? 0.75 : 0.55) * s} />)}
      {low && [-0.2, 0.2].map((k, i) => <Flame key={i} x={x + k * w} y={y - 6} s={0.32 * s} />)}
      <OG
        sh={[
          { d: capsule([x - w * 0.35, y - 5], 5, [x + w * 0.3, y - 9], 5), f: K.trunk },
          { d: capsule([x - w * 0.3, y - 9], 5, [x + w * 0.35, y - 4], 5), f: shade(K.trunk, 0.15) },
          { d: rrect(x - w / 2 - 6, y - 20, 22, 20, 6), f: C.stone },
          { d: rrect(x + w / 2 - 16, y - 20, 22, 20, 6), f: shade(C.stone, 0.1) },
        ]}
      />
    </g>
  );
}

/** Ahşap tahta (önden düz şerit). x,y = sol üst */
function Tahta({ x, y, w, h = 10, c = C.wood }: { x: number; y: number; w: number; h?: number; c?: string }) {
  return <OG sh={[{ d: rrect(x, y, w, h, 2), f: c }, { d: line([x + 6, y + h * 0.45], [x + w - 6, y + h * 0.45]), st: shade(c, 0.18), sw: 1 }]} />;
}

/** Kesit kap (önü kesilmiş): dış duvar + iç katmanlar. x,y = sol üst, w×h. layers: alttan üste [renk, kalınlık] */
function KesitKap({ x, y, w, h, wall = 7, c = C.metal, children }: { x: number; y: number; w: number; h: number; wall?: number; c?: string; children?: ComponentChildren }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, h, 4), f: c }]} />
      <rect x={x + wall} y={y + 2} width={w - wall * 2} height={h - wall - 2} fill={tint(c, 0.55)} />
      {children}
      <path d={`M${x + wall} ${y}V${y + h - wall}H${x + w - wall}V${y}`} fill="none" stroke={K.out} stroke-width={1.6} />
    </g>
  );
}

/** Kum saati yerine kısa süre işareti (Timer + yazı) */
const Sure = Timer;

/** Kalın yün battaniye bohçası (bir şeyi sarmış). x = orta, y = taban */
function Battaniye({ x, y, w = 130, h = 92, c = C.wool }: { x: number; y: number; w?: number; h?: number; c?: string }) {
  const l = x - w / 2, r = x + w / 2, t = y - h;
  return (
    <OG
      sh={[
        { d: smooth([[l, y], [l - 4, y - h * 0.5], [l + w * 0.12, t + 6], [x - 10, t - 4], [x + w * 0.3, t + 2], [r + 2, y - h * 0.55], [r, y]], false) + 'Z', f: c },
        { d: smooth([[l + w * 0.18, t + 10], [l + w * 0.28, y - h * 0.45], [l + w * 0.24, y - 4]]), st: shade(c, 0.25), sw: 1.6 },
        { d: smooth([[x + w * 0.2, t + 8], [x + w * 0.1, y - h * 0.5], [x + w * 0.18, y - 4]]), st: shade(c, 0.25), sw: 1.6 },
        { d: `M${l + 6} ${y - h * 0.3}H${r - 8}`, st: tint(c, 0.4), sw: 3 },
        { d: `M${l + 4} ${y - h * 0.2}H${r - 6}`, st: tint(c, 0.4), sw: 3 },
      ]}
    />
  );
}

/** Odun sobası (yandan). x = orta, y = zemin */
function Soba({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <OG
        sh={[
          { d: rrect(x - 7, 10, 14, y - 100, 2), f: '#5a5f6b' },
          { d: rrect(x - 30, y - 96, 60, 84, 8), f: '#3d4250' },
          { d: rrect(x - 34, y - 100, 68, 8, 3), f: '#555b6b' },
          { d: rrect(x - 18, y - 70, 36, 26, 4), f: '#2b2d3a' },
          { d: capsule([x - 22, y - 12], 3, [x - 24, y], 3), f: '#2b2d3a' },
          { d: capsule([x + 22, y - 12], 3, [x + 24, y], 3), f: '#2b2d3a' },
        ]}
      />
      <path d={`M${x - 12} ${y - 47}Q${x - 6} ${y - 62} ${x} ${y - 50}Q${x + 6} ${y - 64} ${x + 12} ${y - 47}Z`} fill={K.fire} />
    </g>
  );
}

/** Delikli kepçe: from = sap ucu, c = kepçe merkezi */
function Kevgir({ from, c, r = 20 }: { from: P; c: P; r?: number }) {
  return (
    <g>
      <OG sh={[{ d: capsule(from, 3, c, 3), f: C.metal }, { d: ell(c, r, r * 0.42), f: tint(C.metal, 0.2) }]} />
      {[-0.5, 0, 0.5].map((k) => <circle key={k} cx={c[0] + k * r} cy={c[1]} r={1.8} fill={K.out} />)}
    </g>
  );
}

/** Kesilmiş teleme/peynir kalıbı (önden, hafif üstten). x,y = sol üst */
function Blok({ x, y, w = 40, h = 30, c = C.cheese, top = 7 }: { x: number; y: number; w?: number; h?: number; c?: string; top?: number }) {
  return (
    <OG
      sh={[
        { d: `M${x} ${y + top}L${x + top} ${y}H${x + w + top}V${y + h}L${x + w} ${y + h + top}H${x}Z`, f: c },
        { d: `M${x} ${y + top}L${x + top} ${y}H${x + w + top}L${x + w} ${y + top}Z`, f: tint(c, 0.5), ln: true },
        { d: `M${x + w} ${y + top}L${x + w + top} ${y}V${y + h}L${x + w} ${y + h + top}Z`, f: shade(c, 0.1), ln: true },
      ]}
    />
  );
}

/** Taş (ağırlık) */
const Tas = ({ x, y, w = 40, h = 24, c = C.stone }: { x: number; y: number; w?: number; h?: number; c?: string }) => (
  <OG sh={[{ d: smooth([[x - w / 2, y], [x - w / 2 + 3, y - h * 0.7], [x - w * 0.1, y - h], [x + w * 0.3, y - h * 0.85], [x + w / 2, y - h * 0.3], [x + w / 2 - 2, y]], true, 0.8), f: c }, { d: smooth([[x - w * 0.2, y - h * 0.7], [x + w * 0.1, y - h * 0.8]]), st: tint(c, 0.4), sw: 2 }]} />
);


/** Tahıl taneleri: dikdörtgen alan içine dağınık küçük elipsler (rastgele değil, sabit dizi) */
function Taneler({ x, y, w, h, c = C.wheat, n = 40, r = 3 }: { x: number; y: number; w: number; h: number; c?: string; n?: number; r?: number }) {
  const out: JSX.Element[] = [];
  for (let i = 0; i < n; i++) {
    const u = (i * 0.618034) % 1, v = (i * 0.414214 + (i % 7) * 0.13) % 1;
    const px = x + u * w, py = y + v * h, a = (i * 47) % 180;
    out.push(<ellipse key={i} cx={f1(px)} cy={f1(py)} rx={r} ry={r * 0.6} transform={`rotate(${a} ${f1(px)} ${f1(py)})`} fill={c} stroke={shade(c, 0.35)} stroke-width={0.8} />);
  }
  return <g>{out}</g>;
}

/** Ekşi maya (kavanoz içeriği) rengi */
const MAYA = '#ead9b4';

/** Kabarcıklar (dairecikler) */
const Kabarcik = ({ pts, c = shade(MAYA, 0.3) }: { pts: [number, number, number][]; c?: string }) => (
  <g fill="none" stroke={c} stroke-width={1.3}>{pts.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>
);

/** Sırlı küp (yandan). x = orta, y = taban */
function Kup({ x, y, w = 76, h = 100, c = C.glaze, lid = true }: { x: number; y: number; w?: number; h?: number; c?: string; lid?: boolean }) {
  const t = y - h;
  return (
    <OG
      sh={[
        { d: smooth([[x - w * 0.28, t + 8], [x - w * 0.5, t + h * 0.4], [x - w * 0.36, y - 4], [x, y], [x + w * 0.36, y - 4], [x + w * 0.5, t + h * 0.4], [x + w * 0.28, t + 8]]) + 'Z', f: c },
        { d: smooth([[x + w * 0.12, t + 12], [x + w * 0.4, t + h * 0.42], [x + w * 0.22, y - 6]]) + `L${x + w * 0.36} ${y - 4}` + '', f: shade(c, 0.12), no: true },
        { d: rrect(x - w * 0.3, t, w * 0.6, 10, 3), f: tint(c, 0.15) },
        ...(lid ? [{ d: `M${x - w * 0.32} ${t + 2}Q${x} ${t - 14} ${x + w * 0.32} ${t + 2}Z`, f: C.wood }, { d: ell([x, t - 8], 6, 3), f: C.woodDark }] : []),
        { d: smooth([[x - w * 0.3, t + h * 0.3], [x - w * 0.34, t + h * 0.55]]), st: tint(c, 0.5), sw: 4 },
      ]}
    />
  );
}

/** Çuval (yandan). x = orta, y = taban */
function Cuval({ x, y, w = 70, h = 84, c = '#d8c39a' }: { x: number; y: number; w?: number; h?: number; c?: string }) {
  const t = y - h;
  return (
    <OG
      sh={[
        { d: smooth([[x - w * 0.3, t + 12], [x - w * 0.5, t + h * 0.5], [x - w * 0.46, y - 2], [x, y + 1], [x + w * 0.46, y - 2], [x + w * 0.5, t + h * 0.5], [x + w * 0.3, t + 12]]) + 'Z', f: c },
        { d: `M${x - w * 0.3} ${t + 13}L${x - w * 0.22} ${t}L${x - 4} ${t + 6}L${x + 6} ${t - 2}L${x + w * 0.3} ${t + 13}Z`, f: tint(c, 0.15) },
        { d: capsule([x - w * 0.28, t + 13], 2.5, [x + w * 0.28, t + 13], 2.5), f: '#9a6a34' },
        { d: smooth([[x - w * 0.15, t + 24], [x - w * 0.2, y - 12]]), st: shade(c, 0.2), sw: 1.4 },
      ]}
    />
  );
}

/** Ekmek somunu (yandan). x = orta, y = taban */
const Somun = ({ x, y, w = 120, h = 56, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) => (
  <g transform={a ? `rotate(${a} ${x} ${y})` : undefined}>
    <OG sh={[{ d: `M${x - w / 2} ${y}Q${x - w / 2 - 4} ${y - h} ${x} ${y - h}Q${x + w / 2 + 4} ${y - h} ${x + w / 2} ${y}Z`, f: C.crust }, { d: `M${x - w * 0.22} ${y - h * 0.7}Q${x - w * 0.1} ${y - h * 0.85} ${x + w * 0.02} ${y - h * 0.72}M${x + w * 0.06} ${y - h * 0.74}Q${x + w * 0.18} ${y - h * 0.88} ${x + w * 0.3} ${y - h * 0.7}`, st: tint(C.dough, 0.2), sw: 3 }]} />
  </g>
);

/** Oklava: iki uç */
const Oklava = ({ a, b, r = 4 }: { a: P; b: P; r?: number }) => <OG sh={[{ d: capsule(a, r, b, r), f: '#d6a873' }]} />;

/** Sac (kubbeli demir levha, yandan). x = orta, y = alt kenar */
const Sac = ({ x, y, w = 200 }: { x: number; y: number; w?: number }) => (
  <OG sh={[{ d: `M${x - w / 2} ${y}Q${x} ${y - 34} ${x + w / 2} ${y}Q${x} ${y - 24} ${x - w / 2} ${y}Z`, f: '#4a4f5c' }]} />
);

/* ═════════════════════ SAHNELER ═════════════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ─── Süt kaynatma ─── */
  'sf-ys-sut-kaynatma': () => {
    const h = { x: 296, y: 232, a: -50, s: 0.9, pose: 'pinch' as const, side: 'R' as const };
    const knob = handPoint(h, 'pinch');
    return (
      <Scene2 bg="closeup">
        <Ocak x={140} y={164} w={220} flame="low" knob={knob}>
          <Tencere x={140} y={160} w={150} h={70} foam={22} steam />
        </Ocak>
        <Kasik from={[60, 52]} to={[112, 84]} />
        <Hand {...h} arm={60} {...HAND.SUT} />
        <Arrow from={[knob[0] + 4, knob[1] - 34]} to={[knob[0] - 30, knob[1] - 6]} bend={0.35} w={5} />
      </Scene2>
    );
  },
  'sf-ys-sut-termometre': () => (
    <Scene2 bg="closeup">
      <Ocak x={150} y={170} w={220} flame="low" knob={[236, 196]}>
        <Tencere x={140} y={166} w={160} h={74} ry={9} />
      </Ocak>
      <Termo x={200} y={62} a={118} len={34} />
      <ellipse cx={184} cy={92} rx={8} ry={2.5} fill="none" stroke={C.milkShade} stroke-width={1.5} />
      <Label x={262} y={42} text="63 °C" size={17} />
      <Timer x={42} y={44} r={15} text="30 dk" />
    </Scene2>
  ),
  'sf-ys-sut-sogutma': () => {
    const basin: P[] = [[34, 140], [286, 140], [264, 218], [56, 218]];
    const water: P[] = [[37, 152], [283, 152], [264, 216], [56, 216]];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: poly(basin), f: '#c9d3dc' }]} />
        <path d={poly(water)} fill={K.water} />
        <Tencere x={160} y={204} w={124} h={92} steam />
        <path d={poly(water)} fill={K.waterLight} opacity={0.55} />
        <path d={line([37, 152], [283, 152])} stroke="#ffffff" stroke-width={2} opacity={0.8} />
        <path d={poly(basin)} fill="none" stroke={K.out} stroke-width={2} />
        <Arrow from={[94, 182]} to={[56, 182]} w={5} />
        <Arrow from={[226, 182]} to={[264, 182]} w={5} />
      </Scene2>
    );
  },

  /* ─── Yoğurt ─── */
  'sf-ys-yogurt-parmak-testi': () => {
    const wx = 156, wy = 70, s = 1.25;
    // yumruk aşağı bakar; serçe parmak süte uzanır
    const tf = `translate(${wx} ${wy}) rotate(180) scale(${s})`;
    return (
      <Scene2 bg="closeup">
        <Tencere x={160} y={262} w={260} h={110} ry={18} />
        <Hand x={wx} y={wy} a={180} s={s} pose="fist" side="R" arm={80} {...HAND.SUT} />
        <g transform={tf}>
          <OG sh={[{ d: capsule([11.6, -28], 3.2, [13.6, -42], 3), f: K.skin[1] }, { d: capsule([13.6, -42], 3, [15, -55], 2.7), f: K.skin[1] }]} ow={OW / s} />
        </g>
        <ellipse cx={wx - 18} cy={wy + 70} rx={12} ry={3.5} fill={C.milk} stroke={C.milkShade} stroke-width={1.5} />
        <Label x={252} y={42} text="40–45 °C" size={15} />
        <Timer x={40} y={44} r={15} text="10 sn" />
      </Scene2>
    );
  },
  'sf-ys-yogurt-maya': () => {
    const h = { x: 286, y: 150, a: -62, s: 0.9, pose: 'hold' as const, side: 'R' as const, grip: 10 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Tencere x={70} y={214} w={130} h={84} />
        <Kase x={214} y={214} w={130} h={50} c="#e9e3d3" fill={C.yogurt} rim={9} />
        <Hand {...h} arm={70} {...HAND.SUT}>
          <Kasik from={[g[0] + 14, g[1] - 10]} to={[206, 160]} />
        </Hand>
        <path d="M190 160q-14 6 2 12q22 6 40 -2q12 -7 -4 -12" fill="none" stroke={K.action} stroke-width={3} stroke-linecap="round" />
        <Arrow from={[176, 108]} to={[96, 112]} bend={0.35} />
      </Scene2>
    );
  },
  'sf-ys-yogurt-sarma': () => (
    <Scene2 bg="indoor">
      <Soba x={64} y={214} />
      <Tencere x={200} y={204} w={110} h={64} lid fill={null} />
      <OG sh={[
        { d: 'M128 216Q120 184 132 154Q166 144 200 150Q236 144 270 154Q282 184 274 216Z', f: C.wool },
        { d: 'M134 168Q200 160 270 168', st: tint(C.wool, 0.45), sw: 3 },
        { d: 'M130 196Q200 188 274 196', st: tint(C.wool, 0.45), sw: 3 },
        { d: 'M168 152V214M232 152V214', st: shade(C.wool, 0.22), sw: 2 },
        { d: 'M132 156Q138 128 172 122Q192 120 202 130Q188 150 150 160Z', f: shade(C.wool, 0.06) },
        { d: 'M146 140Q170 128 194 130', st: tint(C.wool, 0.45), sw: 3 },
        { d: ell([270, 160], 10, 8), f: shade(C.wool, 0.1) },
        { d: 'M266 166Q262 182 270 192M274 166Q282 180 280 190', st: shade(C.wool, 0.3), sw: 3 },
      ]} />
      <Timer x={226} y={52} r={16} text="4–8 sa" />
    </Scene2>
  ),

  /* ─── Kurut ─── */
  'sf-ys-kurut-suzme': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: capsule([30, 34], 5, [290, 34], 5), f: C.woodDark }, { d: rrect(24, 24, 10, 24, 2), f: '#5a5f6b' }, { d: rrect(286, 24, 10, 24, 2), f: '#5a5f6b' }]} />
      <path d={line([160, 38], [160, 52])} stroke={K.out} stroke-width={2} />
      <Bohca x={160} y={52} w={92} h={96} fill={C.yogurt} drip={C.whey} />
      <Kase x={160} y={218} w={130} h={34} c="#c9d3dc" fill={C.whey} />
    </Scene2>
  ),
  'sf-ys-kurut-top': () => {
    const h = { x: 238, y: 236, a: -18, s: 1.1, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g = handPoint(h, 'grip');
    const balls: P[] = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) balls.push([46 + c * 34 + r * 10, 168 + r * 30]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(20, 150, 190, 76, 8), f: '#c9d3dc' }, { d: rrect(28, 156, 174, 64, 6), f: tint('#c9d3dc', 0.3) }]} />
        {balls.map((b, i) => <OG key={i} sh={[{ d: circ(b, 13), f: C.yogurt }, { d: ell([b[0] - 4, b[1] - 5], 4, 2.6), f: '#ffffff', no: true }]} />)}
        <Hand {...h} arm={50} {...HAND.SUT}>
          <OG sh={[{ d: circ(g, 15), f: C.yogurt }]} />
        </Hand>
        <Drop x={g[0] - 34} y={g[1] + 26} s={0.8} color={K.waterLight} />
      </Scene2>
    );
  },
  'sf-ys-kurut-kurutma': () => {
    const balls = [74, 104, 134, 164, 194, 224, 254];
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <circle cx={46} cy={44} r={20} fill={K.fireCore} stroke={K.action} stroke-width={3} />
        <OG
          sh={[
            { d: rrect(56, 150, 12, 64, 2), f: C.woodDark },
            { d: rrect(252, 150, 12, 64, 2), f: C.woodDark },
            { d: rrect(44, 140, 232, 14, 3), f: C.wood },
          ]}
        />
        {balls.map((x) => <OG key={x} sh={[{ d: ell([x, 131], 12, 10), f: C.yogurt }]} />)}
        <path d="M40 141Q42 104 160 104Q278 104 280 141Z" fill="#ffffff" opacity={0.45} stroke={K.out} stroke-width={1.5} />
        {[70, 100, 130, 160, 190, 220, 250].map((x) => <path key={x} d={line([x, 106], [x, 140])} stroke="#ffffff" stroke-width={1} opacity={0.8} />)}
        <Waves x={296} y={110} a={180} n={3} r={7} color="#7a9bb5" />
      </Scene2>
    );
  },

  /* ─── Peynir 1 ─── */
  'sf-ys-kesim-testi': () => {
    const h = { x: 250, y: 60, a: -110, s: 0.9, pose: 'fist' as const, side: 'R' as const };
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: ell([160, 162], 150, 66), f: C.metal }, { d: ell([160, 160], 138, 56), f: C.cheese }]} />
         <path d="M116 128Q148 150 136 176Q128 196 146 212L164 210Q148 194 156 176Q168 150 136 124Z" fill={C.whey} stroke={K.out} stroke-width={1.5} />
        <Bicak from={[232, 56]} to={[150, 128]} w={12} />
        <Hand {...h} arm={70} {...HAND.SUT} />
        <Arrow from={[176, 96]} to={[198, 74]} w={5} />
        <Ok x={58} y={50} r={15} />
      </Scene2>
    );
  },
  'sf-ys-pihti-kesme': () => {
    const xs = [70, 106, 142, 178, 214, 250];
    const ys = [96, 126, 156, 186];
    return (
      <Scene2 bg="closeup">
        <defs>
          <clipPath id="ys-pihti">
            <path d={ell([160, 142], 132, 92)} />
          </clipPath>
        </defs>
        <OG sh={[{ d: ell([160, 142], 146, 104), f: C.metal }, { d: ell([160, 142], 132, 92), f: C.cheese }]} />
        <g clip-path="url(#ys-pihti)" stroke={C.whey} stroke-width={4}>
          {xs.map((x) => <path key={x} d={line([x, 40], [x, 250])} />)}
          {ys.map((y) => <path key={y} d={line([20, y], [300, y])} />)}
        </g>
        <g clip-path="url(#ys-pihti)" stroke={shade(C.whey, 0.3)} stroke-width={1}>
          {xs.map((x) => <path key={x} d={line([x, 40], [x, 250])} />)}
          {ys.map((y) => <path key={y} d={line([20, y], [300, y])} />)}
        </g>
        <Label x={124} y={141} text="1–2 cm" size={13} />
      </Scene2>
    );
  },
  'sf-ys-teleme-baski': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: rrect(46, 206, 228, 14, 3), f: '#c9d3dc' }]} />
      <Tahta x={70} y={192} w={180} h={12} />
      <OG sh={[{ d: smooth([[80, 192], [84, 160], [160, 152], [236, 160], [240, 192]]) + 'Z', f: C.cloth }, { d: smooth([[110, 160], [118, 176], [112, 190]]), st: shade(C.cloth, 0.2), sw: 1.4 }, { d: smooth([[200, 158], [206, 174], [198, 190]]), st: shade(C.cloth, 0.2), sw: 1.4 }]} />
      <Tahta x={66} y={142} w={188} h={12} />
      <Tas x={124} y={142} w={56} h={34} />
      <Tas x={190} y={142} w={50} h={30} c={shade(C.stone, 0.1)} />
      <Arrow from={[160, 40]} to={[160, 92]} />
      <Drop x={92} y={204} s={0.7} color={C.whey} />
      <Drop x={228} y={204} s={0.7} color={C.whey} />
    </Scene2>
  ),

  /* ─── Peynir 2 ─── */
  'sf-ys-peynir-tuzlama': () => {
    const h = { x: 250, y: 40, a: -150, s: 0.9, pose: 'pinch' as const, side: 'R' as const };
    const p = handPoint(h, 'pinch');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(24, 150, 272, 70, 8), f: C.wood }]} />
        {[40, 112, 184].map((x) => <Blok key={x} x={x} y={150} w={58} h={42} top={10} />)}
        <Hand {...h} arm={60} {...HAND.SUT} />
        <g fill="#ffffff" stroke={K.out} stroke-width={0.8}>
          {[[0, 14], [-6, 30], [5, 44], [-3, 58], [8, 72], [-8, 84], [2, 96]].map(([dx, dy], i) => <rect key={i} x={p[0] + dx - 2} y={p[1] + dy} width={4} height={4} transform={`rotate(20 ${p[0] + dx} ${p[1] + dy})`} />)}
        </g>
        <g fill="#ffffff">{[[214, 162], [226, 158], [236, 166], [204, 168], [244, 158]].map(([x, y], i) => <rect key={i} x={x} y={y} width={3} height={3} />)}</g>
      </Scene2>
    );
  },
  'sf-ys-peynir-teneke': () => (
    <Scene2 bg="closeup">
      <KesitKap x={70} y={56} w={180} h={170} c="#c3cbd3">
        <rect x={77} y={88} width={166} height={131} fill={BRINE} />
        <path d={line([77, 88], [243, 88])} stroke="#6f9fb8" stroke-width={2.4} />
        {[[86, 168], [164, 168], [86, 124], [164, 124]].map(([x, y], i) => <Blok key={i} x={x} y={y} w={62} h={36} top={6} />)}
        <OG sh={[{ d: rrect(80, 100, 160, 8, 3), f: '#e9eef2' }]} />
        <Tas x={160} y={100} w={50} h={26} />
      </KesitKap>
      <Arrow from={[288, 72]} to={[252, 88]} w={5} />
    </Scene2>
  ),
  'sf-ys-peynir-masa': () => {
    return (
      <Scene2 bg="closeup">
        <KesitKap x={20} y={120} w={196} h={110} c="#c3cbd3">
          <rect x={27} y={140} width={182} height={83} fill={BRINE} />
          <Blok x={40} y={170} w={60} h={36} top={6} />
          <Blok x={120} y={176} w={60} h={34} top={6} />
        </KesitKap>
        {/* maşa: iki kol, uçları peyniri tutuyor */}
        <Blok x={98} y={86} w={56} h={34} top={6} />
        <OG sh={[{ d: capsule([210, 20], 4, [104, 92], 3), f: C.metal }, { d: capsule([222, 30], 4, [156, 112], 3), f: C.metal }, { d: circ([216, 24], 7), f: C.metal }]} />
        <Hand x={262} y={-8} a={-122} s={0.85} pose="fist" side="R" arm={50} {...HAND.SUT} />
        <Ok x={58} y={44} r={15} />
        <g>
          <circle cx={262} cy={170} r={44} fill="#ffffff" stroke={K.out} stroke-width={2} />
          <rect x={220} y={176} width={84} height={34} fill={BRINE} />
          <Hand x={282} y={110} a={-160} s={0.62} pose="open" side="R" arm={40} {...HAND.SUT} />
          <No x={262} y={170} r={38} />
        </g>
      </Scene2>
    );
  },

  /* ─── Lor, çökelek ─── */
  'sf-ys-lor-kumeler': () => {
    const blobs: [number, number, number][] = [[110, 112, 16], [146, 104, 13], [186, 114, 17], [222, 106, 12], [130, 130, 12], [200, 132, 14], [164, 124, 10]];
    return (
      <Scene2 bg="closeup">
        <Ocak x={160} y={182} w={220} flame="low" knob={[248, 208]}>
          <Tencere x={160} y={178} w={200} h={64} ry={34} fill={C.whey} steam />
        </Ocak>
        {blobs.map(([x, y, r], i) => <OG key={i} sh={[{ d: smooth([[x - r, y], [x - r * 0.6, y - r * 0.6], [x, y - r * 0.7], [x + r * 0.7, y - r * 0.5], [x + r, y + 1], [x + r * 0.3, y + r * 0.45], [x - r * 0.5, y + r * 0.4]], true), f: '#ffffff' }]} />)}
        <Label x={266} y={40} text="90 °C" size={16} />
      </Scene2>
    );
  },
  'sf-ys-lor-kepce': () => {
    const h = { x: 306, y: 132, a: -70, s: 0.8, pose: 'fist' as const, side: 'R' as const };
    const gp = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Tencere x={80} y={226} w={130} h={56} ry={22} fill={C.whey} />
        {/* tülbentli süzgeç */}
        <OG sh={[{ d: 'M176 176Q182 222 232 222Q282 222 288 176Z', f: '#c9d3dc' }, { d: ell([232, 176], 56, 14), f: C.cloth }, { d: 'M190 176Q200 200 232 200Q264 200 274 176Z', f: '#ffffff' }]} />
        <Kevgir from={gp} c={[214, 112]} r={24} />
        {[[208, 104], [222, 100], [234, 106]].map(([x, y], i) => <OG key={i} sh={[{ d: circ([x, y], 8), f: '#ffffff' }]} />)}
        <Hand {...h} arm={50} {...HAND.SUT} />
        <Arrow from={[96, 150]} to={[178, 104]} bend={-0.3} w={5} />
      </Scene2>
    );
  },
  'sf-ys-cokelek-suzme': () => (
    <Scene2 bg="indoor">
      <OG sh={[{ d: capsule([30, 34], 5, [290, 34], 5), f: C.woodDark }, { d: rrect(24, 24, 10, 24, 2), f: '#5a5f6b' }, { d: rrect(286, 24, 10, 24, 2), f: '#5a5f6b' }]} />
      <path d={line([134, 38], [134, 52])} stroke={K.out} stroke-width={2} />
      <Bohca x={134} y={52} w={86} h={88} fill={C.cheese} drip={C.whey} />
      <Kase x={134} y={218} w={120} h={32} c="#c9d3dc" fill={C.whey} />
      <Kase x={256} y={218} w={60} h={26} c={C.clay} fill="#ffffff" rim={5} />
    </Scene2>
  ),

  /* ─── Tereyağı ─── */
  'sf-ys-yayik': () => {
    const pp: PersonProps = { ...CAST.SUT, x: 96, y: 224, s: 1.4, pose: { ...POSE.kneelSit, spine: -80, face: 'neutral' } };
    const r0 = rig(pp);
    const cL: P = [r0.kneeF[0] + 18, 204];
    const cR: P = [cL[0] + 96, cL[1]];
    const p2: PersonProps = { ...pp, pose: { ...pp.pose, armB: { to: [cL[0] + 30, cL[1] - 17] }, armF: { to: [cL[0] + 2, cL[1] - 10] }, handF: 'fist', handB: 'fist' } };
    return (
      <Scene2 bg="indoor">
        <Person {...p2} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG
          sh={[
            { d: capsule(cL, 18, cR, 18), f: C.wood },
            { d: line([cL[0] + 24, cL[1] - 17], [cL[0] + 24, cL[1] + 17]), st: '#5a5f6b', sw: 3 },
            { d: line([cR[0] - 18, cR[1] - 17], [cR[0] - 18, cR[1] + 17]), st: '#5a5f6b', sw: 3 },
            { d: ell([cR[0] + 18, cR[1]], 3.5, 10), f: C.woodDark },
          ]}
        />
        <Person {...p2} only={['armF']} />
        <Arrow from={[cR[0] - 30, cR[1] - 34]} to={[cR[0] + 20, cR[1] - 34]} w={5} />
        <Arrow from={[cR[0] - 40, cR[1] - 34]} to={[cR[0] - 90, cR[1] - 34]} w={5} />
      </Scene2>
    );
  },
  'sf-ys-tereyagi-yikama': () => (
    <Scene2 bg="closeup">
      <Kase x={110} y={214} w={190} h={64} c="#c9d3dc" fill="#e9e6d6" rim={16} />
      <OG sh={[{ d: ell([110, 150], 50, 18), f: C.butter }]} />
      <Hand x={44} y={104} a={118} s={0.85} pose="press" side="L" arm={90} {...HAND.SUT} />
      <Hand x={176} y={104} a={-118} s={0.85} pose="press" side="R" arm={90} {...HAND.SUT} />
      <Kase x={262} y={214} w={92} h={40} c="#c9d3dc" fill={K.waterLight} rim={9} />
      <Ok x={262} y={140} r={13} />
    </Scene2>
  ),
  'sf-ys-sadeyag-kivam': () => (
    <Scene2 bg="closeup">
      <KesitKap x={60} y={60} w={200} h={150} c={C.metal}>
        <rect x={67} y={98} width={186} height={105} fill={C.ghee} />
        <rect x={67} y={190} width={186} height={13} fill="#9a6a34" />
        <path d="M67 98q12 -6 24 0t24 0t24 0t24 0t24 0t24 0t24 0t18 0V104H67Z" fill="#fff6d8" stroke={K.out} stroke-width={1} />
        <path d={line([80, 120], [80, 176])} stroke="#ffffff" stroke-width={4} opacity={0.5} stroke-linecap="round" />
      </KesitKap>
      <Arrow from={[300, 220]} to={[262, 198]} w={5} />
      <Ok x={290} y={60} r={15} />
    </Scene2>
  ),
  /* ─── Ekşi maya ─── */
  'sf-ys-maya-besleme': () => (
    <Scene2 bg="closeup">
      <Kavanoz x={160} y={214} w={84} h={120} fill={MAYA} lvl={0.42} lid={null}>
        <Kabarcik pts={[[140, 186, 3], [168, 196, 2.5], [182, 180, 3]]} />
      </Kavanoz>
      <Kase x={52} y={214} w={70} h={30} c="#c9d3dc" fill={MAYA} rim={6} />
      <Arrow from={[124, 150]} to={[66, 172]} bend={0.3} w={5} />
      <OG sh={[{ d: smooth([[220, 140], [212, 176], [214, 214], [264, 214], [266, 176], [258, 140]]) + 'Z', f: '#e9e2d3' }, { d: `M220 140L226 130H252L258 140Z`, f: tint('#e9e2d3', 0.3) }]} />
      <path d="M226 180h32M226 190h32" stroke={shade('#e9e2d3', 0.3)} stroke-width={2} />
      <Kavanoz x={292} y={214} w={36} h={56} fill={K.water} lvl={0.7} lid={null} />
      <Arrow from={[250, 112]} to={[196, 118]} bend={0.3} w={5} />
      <Label x={160} y={36} text="50 + 50 + 50 g" size={15} />
    </Scene2>
  ),
  'sf-ys-maya-iki-kat': () => (
    <Scene2 bg="closeup">
      <Kavanoz x={84} y={214} w={80} h={130} fill={MAYA} lvl={0.35} lid={null} />
      <path d="M44 177H124" stroke="#c0603e" stroke-width={4} />
      <Kavanoz x={236} y={214} w={80} h={130} fill={MAYA} lvl={0.78} lid={null}>
        <Kabarcik pts={[[214, 120, 4], [236, 108, 3], [252, 130, 4.5], [222, 150, 3], [248, 166, 3.5], [230, 190, 3], [210, 176, 2.5], [254, 196, 3]]} />
      </Kavanoz>
      <path d="M196 177H276" stroke="#c0603e" stroke-width={4} />
      <Arrow from={[132, 130]} to={[184, 130]} w={6} />
      <Timer x={140} y={64} r={14} text="6–8 sa" />
      <Ok x={290} y={60} r={14} />
    </Scene2>
  ),
  'sf-ys-maya-bozuk': () => (
    <Scene2 bg="closeup">
      <Kavanoz x={150} y={218} w={110} h={150} fill={MAYA} lvl={0.62} lid={null}>
        <path d="M100 150q20 10 40 0t40 4M102 176q24 -8 44 4t46 -2" fill="none" stroke="#e86a8a" stroke-width={4} stroke-linecap="round" />
        <path d="M104 132q10 -14 22 -4q8 -14 22 -4q12 -12 22 0q10 -10 24 2" fill="#c7d3b4" stroke="#7a8a64" stroke-width={1.5} />
        <path d="M110 128l-2 -8M124 124l0 -9M140 126l2 -9M158 122l0 -10M174 126l3 -8M188 128l2 -8" stroke="#7a8a64" stroke-width={1.5} />
      </Kavanoz>
      <Bad x={250} y={70} r={20} />
    </Scene2>
  ),

  /* ─── Ekmek ─── */
  'sf-ys-ekmek-yogurma': () => {
    const dough: P = [214, 156];
    const pp: PersonProps = {
      ...CAST.FIRIN, x: 130, y: 226, s: 1.25,
      pose: { ...POSE.standSide, spine: -70, chest: -58, head: -50, armB: { to: [dough[0] - 6, dough[1] - 10] }, armF: { to: [dough[0] + 4, dough[1] - 6] }, handB: { shape: 'flat', a: -70 }, handF: { shape: 'flat', a: -70 }, face: 'neutral' },
    };
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: rrect(170, 160, 140, 12, 3), f: C.wood }, { d: rrect(184, 172, 10, 54, 2), f: C.woodDark }, { d: rrect(286, 172, 10, 54, 2), f: C.woodDark }]} />
        <OG sh={[{ d: `M${dough[0] - 30} 160Q${dough[0] - 26} 134 ${dough[0] + 6} 136Q${dough[0] + 40} 136 ${dough[0] + 42} 160Z`, f: C.dough }]} />
        <Person {...pp} />
        <Arrow from={[236, 112]} to={[290, 112]} w={5} />
      </Scene2>
    );
  },
  'sf-ys-parmak-testi': () => {
    const h = { x: 266, y: 40, a: -146, s: 1.15, pose: 'point' as const, side: 'R' as const };
    const tip = handPoint(h, 'tip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M30 170Q34 226 160 226Q286 226 290 170Z', f: '#c9a26a' }, { d: smooth([[38, 172], [60, 104], [160, 90], [262, 104], [282, 172]]) + 'Z', f: C.dough }]} />
        <OG sh={[{ d: ell([96, 138], 13, 7), f: shade(C.dough, 0.12) }]} />
        <Arrow from={[96, 172]} to={[96, 146]} w={4} />
        <OG sh={[{ d: ell([tip[0], tip[1] + 2], 13, 7), f: shade(C.dough, 0.12) }]} />
        <Hand {...h} arm={70} {...HAND.FIRIN} />
        <Ok x={46} y={50} r={15} />
      </Scene2>
    );
  },
  'sf-ys-bazlama-sac': () => {
    const h = { x: 300, y: 104, a: -96, s: 0.85, pose: 'fist' as const, side: 'R' as const };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Ates x={160} y={232} w={170} />
        <Sac x={160} y={200} w={260} />
        <OG sh={[{ d: smooth([[78, 176], [86, 150], [150, 142], [214, 148], [226, 172]]) + 'Z', f: '#eccf98' }, { d: ell([150, 162], 40, 8), f: '#d9a35a', no: true }]} />
        <OG sh={[{ d: capsule(g, 3.5, [196, 150], 3.5), f: C.wood }, { d: poly([[196, 144], [150, 150], [150, 160], [196, 158]]), f: '#c9d0d8' }]} />
        <Hand {...h} arm={50} {...HAND.FIRIN} />
        <Arrow from={[120, 120]} to={[176, 96]} bend={-0.4} w={5} />
      </Scene2>
    );
  },
  /* ─── Yufka ─── */
  'sf-ys-yufka-acma': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: rrect(14, 14, 292, 212, 12), f: '#d9b58a' }]} />
      <OG sh={[{ d: ell([160, 116], 124, 92), f: '#f6ead0' }]} />
      <path d={ell([160, 116], 124, 92)} fill="none" stroke="#ffffff" stroke-width={5} opacity={0.6} />
      <g fill="#ffffff">{[[60, 70], [250, 60], [90, 190], [240, 180], [200, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} />)}</g>
      <Oklava a={[24, 150]} b={[296, 150]} r={5} />
      <Hand x={78} y={200} a={-6} s={0.75} pose="press" side="L" arm={80} {...HAND.FIRIN} />
      <Hand x={242} y={200} a={6} s={0.75} pose="press" side="R" arm={80} {...HAND.FIRIN} />
      <Arrow from={[160, 136]} to={[160, 96]} w={5} />
    </Scene2>
  ),
  'sf-ys-yufka-sac': () => (
    <Scene2 bg="dark">
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => {
        const r = (a * Math.PI) / 180;
        return <Flame key={a} x={160 + Math.cos(r) * 112} y={128 + Math.sin(r) * 98 + 12} s={0.6} />;
      })}
      <OG sh={[{ d: ell([160, 128], 116, 100), f: '#4a4f5c' }, { d: ell([160, 128], 90, 76), f: '#555b6b', no: true }]} />
      <OG sh={[{ d: `M66 92Q160 84 254 92L250 180Q160 196 70 180Z`, f: '#f6ead0' }]} />
      <path d="M90 120q8 4 4 10M200 150q8 4 4 10M150 112q6 4 2 8" stroke={shade('#f6ead0', 0.2)} stroke-width={1.6} fill="none" />
      <OG sh={[{ d: capsule([40, 86], 9, [280, 86], 9), f: '#f6ead0' }]} />
      <Oklava a={[18, 86]} b={[302, 86]} r={5} />
      <Hand x={34} y={44} a={168} s={0.75} pose="press" side="L" arm={60} {...HAND.FIRIN} />
      <Hand x={286} y={44} a={-168} s={0.75} pose="press" side="R" arm={60} {...HAND.FIRIN} />
      <Arrow from={[160, 120]} to={[160, 176]} w={5} />
    </Scene2>
  ),
  'sf-ys-yufka-islatma': () => (
    <Scene2 bg="closeup">
      {[0, 1, 2, 3, 4].map((i) => <OG key={i} sh={[{ d: ell([150, 200 - i * 7], 120, 22), f: i % 2 ? '#f0dfba' : '#f4e6c6' }]} />)}
      <Hand x={204} y={40} a={-160} s={0.95} pose="open" side="R" arm={60} {...HAND.FIRIN} />
      {[[150, 112], [176, 128], [128, 136], [196, 150], [158, 152]].map(([x, y], i) => <Drop key={i} x={x} y={y} s={0.85} />)}
    </Scene2>
  ),

  /* ─── Bulgur ─── */
  'sf-ys-bulgur-serme': () => {
    const rake: [P, P] = [[170, 96], [234, 210]];
    const pp: PersonProps = { ...CAST.AMBAR, x: 118, y: 222, s: 1.2, pose: { ...POSE.standSide, spine: -78, chest: -66, head: -55, armB: { to: [182, 118] }, armF: { to: [204, 156] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <circle cx={286} cy={40} r={18} fill={K.fireCore} stroke={K.action} stroke-width={3} />
        <OG sh={[{ d: poly([[30, 196], [300, 196], [316, 236], [10, 236]]), f: C.cloth }]} />
        <Taneler x={30} y={202} w={276} h={30} c={C.bulgur} n={90} r={2.6} />
        <Person {...pp} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: capsule(rake[0], 3, rake[1], 3), f: C.wood }, { d: capsule([214, 212], 3, [256, 206], 3), f: C.woodDark }]} />
        <Person {...pp} only={['armF']} />
      </Scene2>
    );
  },
  'sf-ys-tane-kirma-testi': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M134 26Q160 18 186 26Q196 40 190 60Q186 84 178 84Q170 84 168 66Q160 60 152 66Q150 84 142 84Q134 84 130 60Q124 40 134 26Z', f: '#ffffff' }]} />
      <Arrow from={[160, 92]} to={[160, 110]} w={5} />
      <g transform="translate(86 158)">
        <OG sh={[{ d: 'M-46 0Q-44 -20 -8 -18L-4 -10L-10 -2L-4 8L-8 18Q-44 20 -46 0Z', f: C.wheat }, { d: 'M8 -18Q44 -20 46 0Q44 20 8 18L12 8L6 -2L12 -10Z', f: C.wheat }]} />
        <path d="M-2 -30l4 -10M10 -28l8 -8M-14 -28l-6 -9" stroke={K.out} stroke-width={2} stroke-linecap="round" />
      </g>
      <Ok x={86} y={214} r={14} />
      <OG sh={[{ d: smooth([[188, 160], [204, 146], [236, 150], [262, 144], [282, 160], [262, 172], [232, 168], [204, 174]], true), f: shade(C.wheat, 0.1) }]} />
      <Bad x={236} y={214} r={14} />
    </Scene2>
  ),
  'sf-ys-dibek': () => {
    const top: P = [222, 62], bot: P = [222, 150];
    const pp: PersonProps = { ...CAST.AMBAR, x: 140, y: 226, s: 1.2, pose: { ...POSE.standSide, spine: -86, armB: { to: [214, 88] }, armF: { to: [216, 106] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <OG sh={[{ d: 'M180 160H264L256 214Q252 224 222 224Q192 224 188 214Z', f: C.stone }, { d: ell([222, 160], 42, 8), f: shade(C.stone, 0.35) }]} />
        <Taneler x={190} y={154} w={64} h={8} c={C.wheat} n={14} r={2.6} />
        <Person {...pp} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: capsule(top, 6, bot, 9), f: C.woodDark }]} />
        <Person {...pp} only={['armF']} />
        <Arrow from={[268, 76]} to={[268, 136]} w={6} />
      </Scene2>
    );
  },

  /* ─── Erişte ─── */
  'sf-ys-eriste-kesme': () => {
    const h = { x: 246, y: 30, a: -168, s: 0.9, pose: 'fist' as const, side: 'R' as const };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(14, 30, 292, 200, 12), f: '#d9b58a' }]} />
        <OG sh={[{ d: rrect(44, 66, 128, 134, 8), f: C.dough }, { d: rrect(48, 70, 120, 126, 6), f: tint(C.dough, 0.25), no: true }]} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <OG key={i} sh={[{ d: rrect(184 + i * 15, 66, 9, 134, 4), f: C.dough }]} />)}
        <Bicak from={[g[0], g[1]]} to={[172, 210]} w={14} />
        <Hand {...h} arm={50} {...HAND.FIRIN} />
      </Scene2>
    );
  },
  'sf-ys-eriste-kurutma': () => (
    <Scene2 bg="floor">
      <OG sh={[{ d: rrect(26, 30, 268, 184, 6), f: C.cloth }]} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 46 + (i % 8) * 30, y = 50 + Math.floor(i / 8) * 80, a = ((i * 37) % 30) - 15;
        return <path key={i} d={`M${x} ${y}q${8 + (i % 3) * 3} 20 ${-2} 40t${4} 30`} transform={`rotate(${a} ${x} ${y + 35})`} fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" />;
      })}
      {Array.from({ length: 16 }, (_, i) => {
        const x = 46 + (i % 8) * 30, y = 50 + Math.floor(i / 8) * 80, a = ((i * 37) % 30) - 15;
        return <path key={i} d={`M${x} ${y}q${8 + (i % 3) * 3} 20 ${-2} 40t${4} 30`} transform={`rotate(${a} ${x} ${y + 35})`} fill="none" stroke="#f2d48a" stroke-width={4} stroke-linecap="round" />;
      })}
    </Scene2>
  ),
  'sf-ys-eriste-kirma-testi': () => {
    const hl = { x: 44, y: 210, a: 50, s: 1, pose: 'pinch' as const, side: 'R' as const };
    const hr = { x: 276, y: 210, a: -50, s: 1, pose: 'pinch' as const, side: 'L' as const };
    const pl = handPoint(hl, 'pinch'), pr = handPoint(hr, 'pinch');
    return (
      <Scene2 bg="closeup">
        <Hand {...hl} arm={60} {...HAND.FIRIN} />
        <Hand {...hr} arm={60} {...HAND.FIRIN} />
        <OG sh={[{ d: capsule([pl[0] - 4, pl[1] + 2], 5, [150, 112], 5), f: '#f2d48a' }, { d: capsule([170, 112], 5, [pr[0] + 4, pr[1] + 2], 5), f: '#f2d48a' }]} />
        <path d="M160 92l0 -14M146 96l-8 -10M174 96l8 -10" stroke={K.out} stroke-width={2.4} stroke-linecap="round" />
        <Ok x={160} y={190} r={15} />
      </Scene2>
    );
  },
  /* ─── Öğütme ─── */
  'sf-ys-el-degirmeni': () => {
    const fist = { x: 230, y: 122, a: -90, s: 0.85, pose: 'fist' as const, side: 'R' as const };
    const gp = handPoint(fist, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: ell([150, 206], 140, 22), f: C.cloth }]} />
        <OG sh={[{ d: 'M60 176H240V192Q240 202 150 202Q60 202 60 192Z', f: C.stone }, { d: ell([150, 176], 90, 14), f: tint(C.stone, 0.2) }]} />
        <OG sh={[{ d: 'M70 150H230V170Q230 180 150 180Q70 180 70 170Z', f: shade(C.stone, 0.08) }, { d: ell([150, 150], 80, 13), f: tint(C.stone, 0.25) }, { d: ell([150, 150], 14, 4), f: '#5a5852' }]} />
        <OG sh={[{ d: capsule([gp[0], 150], 5, [gp[0], gp[1] - 22], 5), f: C.woodDark }]} />
        <Hand {...fist} arm={50} {...HAND.AMBAR} />
        <Taneler x={140} y={100} w={20} h={40} n={10} />
        <Hand x={100} y={40} a={150} s={0.8} pose="pinch" side="L" arm={60} {...HAND.AMBAR} />
        <path d="M58 196q-10 6 -2 12q14 6 30 0" fill={C.flour} stroke={K.out} stroke-width={1.2} />
        <path d="M242 196q10 6 2 12q-14 6 -30 0" fill={C.flour} stroke={K.out} stroke-width={1.2} />
        <Arrow from={[60, 136]} to={[120, 124]} bend={-0.25} w={5} />
      </Scene2>
    );
  },
  'sf-ys-surtme-tasi': () => {
    const st: P = [196, 170];
    const pp: PersonProps = { ...CAST.AMBAR, x: 104, y: 226, s: 1.3, pose: { ...POSE.kneel, spine: -50, chest: -40, head: -40, armB: { to: [st[0] - 8, st[1] - 10] }, armF: { to: [st[0] + 8, st[1] - 8] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        <OG sh={[{ d: 'M150 196L160 180H284L296 196V214H150Z', f: C.stone }, { d: 'M160 180H284L280 186H164Z', f: tint(C.stone, 0.3), no: true }]} />
        <OG sh={[{ d: 'M296 198q10 0 12 12q-10 6 -14 0Z', f: C.flour }]} />
        <Person {...pp} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: ell([st[0], st[1]], 26, 11), f: shade(C.stone, 0.1) }]} />
        <Person {...pp} only={['armF']} />
        <Arrow from={[200, 140]} to={[264, 140]} w={5} />
        <Arrow from={[190, 140]} to={[150, 140]} w={5} />
      </Scene2>
    );
  },
  'sf-ys-un-eleme': () => (
    <Scene2 bg="closeup">
      <Kase x={190} y={226} w={150} h={46} c="#c9d3dc" fill={C.flour} rim={10} />
      <OG sh={[{ d: 'M116 116H264V130Q264 138 190 138Q116 138 116 130Z', f: C.wood }, { d: ell([190, 116], 74, 12), f: '#e6dcc6' }]} />
      <Taneler x={140} y={110} w={90} h={10} c={C.bulgur} n={16} r={3} />
      <g fill={C.flour} opacity={0.95}>{[[150, 150], [170, 160], [190, 146], [210, 158], [230, 150], [160, 172], [200, 172], [222, 170]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} stroke={K.out} stroke-width={0.6} />)}</g>
      <Hand x={104} y={158} a={24} s={0.75} pose="fist" side="R" arm={90} {...HAND.AMBAR} />
      <Hand x={276} y={158} a={-24} s={0.75} pose="fist" side="L" arm={90} {...HAND.AMBAR} />
    </Scene2>
  ),

  /* ─── Tahıl saklama ─── */
  'sf-ys-kup-varil': () => (
    <Scene2 bg="indoor">
      <Kup x={66} y={222} w={92} h={128} />
      <OG
        sh={[
          { d: rrect(124, 92, 84, 130, 6), f: '#5f7f9a' },
          { d: rrect(120, 84, 92, 14, 4), f: '#4c6a84' },
          { d: line([124, 132], [208, 132]), st: shade('#5f7f9a', 0.3), sw: 3 },
          { d: line([124, 178], [208, 178]), st: shade('#5f7f9a', 0.3), sw: 3 },
          { d: capsule([206, 91], 3, [216, 98], 3), f: '#3b3f4b' },
        ]}
      />
      <Kavanoz x={264} y={222} w={70} h={104} fill={C.wheat} lvl={1} lid="metal">
        <Taneler x={234} y={130} w={60} h={86} n={40} r={2.6} />
      </Kavanoz>
    </Scene2>
  ),
  'sf-ys-ambar-yuksek': () => (
    <Scene2 bg="indoor" wall="#d9cfbf">
      <rect x={0} y={200} width={320} height={40} fill="#b7b2a6" />
      {[0, 64, 128, 192, 256].map((x) => <path key={x} d={line([x, 200], [x - 20, 240])} stroke="#9c978b" stroke-width={2} />)}
      <OG sh={[{ d: rrect(82, 152, 14, 58, 2), f: C.woodDark }, { d: rrect(278, 152, 14, 58, 2), f: C.woodDark }, { d: rrect(180, 152, 14, 58, 2), f: C.woodDark }, { d: rrect(74, 144, 226, 12, 3), f: C.wood }]} />
      <Cuval x={128} y={146} w={78} h={92} />
      <Cuval x={202} y={146} w={74} h={86} c="#cdb48a" />
      <Kup x={264} y={146} w={58} h={78} lid />
      <OG sh={[{ d: capsule([40, 152], 2.5, [40, 200], 2.5), f: K.action }, { d: poly([[34, 158], [40, 146], [46, 158]]), f: K.action }, { d: poly([[34, 194], [40, 206], [46, 194]]), f: K.action }]} />
      <Label x={40} y={120} text="40–50 cm" size={13} />
    </Scene2>
  ),

  /* ─── Kiler ─── */
  'sf-ys-kiler-havalandirma': () => (
    <Scene2 bg="outdoor">
      <rect x={0} y={96} width={320} height={144} fill={C.soil} />
      <rect x={0} y={96} width={320} height={6} fill={K.grass} />
      <OG sh={[{ d: rrect(50, 108, 220, 120, 4), f: '#e7dccb' }]} />
      <OG sh={[{ d: rrect(66, 150, 120, 6, 2), f: C.wood }, { d: rrect(66, 192, 120, 6, 2), f: C.wood }]} />
      {[80, 104, 128].map((x) => <Kavanoz key={x} x={x} y={150} w={20} h={28} fill="#c0603e" lvl={0.8} lid="metal" />)}
      {[86, 118, 150].map((x) => <OG key={x} sh={[{ d: rrect(x - 14, 170, 28, 22, 3), f: C.wood }]} />)}
      {[210, 236].map((x) => <OG key={x} sh={[{ d: ell([x, 136], 9, 8), f: '#c98a45' }, { d: ell([x, 158], 9, 8), f: '#c98a45' }, { d: ell([x, 180], 9, 8), f: '#c98a45' }, { d: line([x, 112], [x, 128]), st: K.out, sw: 2 }]} />)}
      <OG sh={[{ d: poly([[20, 60], [32, 60], [32, 208], [50, 208], [50, 220], [20, 220]]), f: '#8f8a80' }]} />
      <OG sh={[{ d: rrect(244, 50, 14, 60, 2), f: '#8f8a80' }, { d: rrect(238, 44, 26, 8, 2), f: '#6f6a60' }]} />
      <Arrow from={[26, 40]} to={[26, 90]} color={K.water} w={5} />
      <Arrow from={[40, 214]} to={[72, 214]} color={K.water} w={5} />
      <Arrow from={[251, 100]} to={[251, 18]} color={K.danger} w={5} />
    </Scene2>
  ),
  'sf-ys-sogan-orgu': () => {
    const braid = (x: number, n: number, c: string, r: number) =>
      Array.from({ length: n }, (_, i) => {
        const y = 66 + i * r * 1.55, dx = i % 2 ? 7 : -7;
        return <OG key={i} sh={[{ d: smooth([[x + dx, y - r - 6], [x + dx + r * 0.9, y], [x + dx, y + r], [x + dx - r * 0.9, y]], true, 0.9), f: c }, { d: line([x + dx, y - r - 6], [x + dx * 0.2, y - r - 14]), st: '#b99a5e', sw: 3 }, { d: smooth([[x + dx - r * 0.3, y - r * 0.6], [x + dx - r * 0.4, y + r * 0.5]]), st: shade(c, 0.25), sw: 1.2 }]} />;
      });
    return (
      <Scene2 bg="indoor" wall="#e3d6bf">
        <OG sh={[{ d: capsule([30, 46], 5, [290, 46], 5), f: C.woodDark }]} />
        {[80, 160, 240].map((x) => <path key={x} d={line([x, 46], [x, 220])} stroke="#b99a5e" stroke-width={4} />)}
        {braid(80, 7, '#c98a45', 13)}
        {braid(160, 8, '#f0e6d8', 11)}
        {braid(240, 7, '#a2402e', 13)}
      </Scene2>
    );
  },
  'sf-ys-toprak-yigini': () => (
    <Scene2 bg="outdoor" ground="grass">
      <rect x={0} y={200} width={320} height={40} fill={C.soil} />
      <OG sh={[{ d: 'M20 204Q160 40 300 204Z', f: '#7a5838' }]} />
      <OG sh={[{ d: 'M46 204Q160 76 274 204Z', f: C.straw }]} />
      <g stroke={shade(C.straw, 0.25)} stroke-width={1.2}>{Array.from({ length: 14 }, (_, i) => <path key={i} d={line([70 + i * 13, 196], [78 + i * 13, 150 - Math.abs(7 - i) * -4])} />)}</g>
      <OG sh={[{ d: 'M72 204Q160 112 248 204Z', f: '#e8d8b8' }]} />
      {[[96, 192], [124, 194], [152, 192], [180, 194], [208, 192], [110, 172], [138, 170], [166, 170], [194, 172], [126, 150], [154, 150], [180, 152], [150, 132]].map(([x, y], i) => <OG key={i} sh={[{ d: ell([x, y], 14, 10), f: '#c9a165' }]} />)}
      <OG sh={[{ d: rrect(152, 66, 16, 54, 2), f: C.straw }]} />
      <Label x={286} y={100} text="toprak" size={12} />
      <path d="M262 108L236 150" stroke={K.out} stroke-width={2} />
      <Label x={40} y={92} text="saman" size={12} />
      <path d="M50 100L64 188" stroke={K.out} stroke-width={2} />
    </Scene2>
  ),

  /* ─── Kumda saklama ─── */
  'sf-ys-yaprak-kesme': () => {
    const h = { x: 222, y: 20, a: 180, s: 0.9, pose: 'fist' as const, side: 'R' as const };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(14, 150, 292, 70, 8), f: C.wood }]} />
        <OG sh={[{ d: 'M30 176Q30 160 50 158L176 162Q186 170 176 178L50 186Q30 190 30 176Z', f: '#e8782a' }, { d: 'M60 166h10M90 172h12M128 168h10', st: shade('#e8782a', 0.3), sw: 1.5 }]} />
        <g fill="#5aa84f" stroke={K.out} stroke-width={1.3}>
          <path d="M176 168Q220 140 270 128Q232 156 182 172Z" />
          <path d="M178 170Q230 160 296 162Q236 176 180 174Z" />
          <path d="M176 172Q220 190 280 204Q226 196 178 176Z" />
        </g>
        <OG sh={[{ d: capsule([g[0], g[1]], 4, [g[0], 70], 4), f: '#3b3537' }, { d: poly([[g[0] - 5, 70], [g[0] + 5, 70], [g[0] + 4, 160], [g[0] - 3, 150]]), f: '#dfe4ea' }]} />
        <Hand {...h} arm={30} {...HAND.AMBAR} />
        <OG sh={[{ d: capsule([176, 132], 2, [g[0], 132], 2), f: K.action }]} />
        <Label x={200} y={112} text="2–3 cm" size={12} />
      </Scene2>
    );
  },
  'sf-ys-kum-nem-testi': () => {
    const h = { x: 96, y: 236, a: 50, s: 2, pose: 'open' as const, side: 'R' as const, view: 'palm' as const };
    const pm = handPoint(h, 'palm');
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={50} {...HAND.AMBAR} />
        <OG sh={[{ d: smooth([[pm[0] - 10, pm[1] - 30], [pm[0] + 40, pm[1] - 26], [pm[0] + 64, pm[1] - 10], [pm[0] + 50, pm[1] + 8], [pm[0] + 8, pm[1] + 4], [pm[0] - 18, pm[1] - 10]], true), f: C.sand }]} />
        <path d={`M${pm[0] + 6} ${pm[1] - 22}q4 10 0 18M${pm[0] + 22} ${pm[1] - 22}q4 10 0 20M${pm[0] + 38} ${pm[1] - 18}q4 10 0 18`} fill="none" stroke={shade(C.sand, 0.3)} stroke-width={2} />
        <Ok x={256} y={60} r={16} />
      </Scene2>
    );
  },
  'sf-ys-kum-katman': () => (
    <Scene2 bg="closeup">
      <KesitKap x={40} y={40} w={240} h={184} wall={10} c={C.wood}>
        <rect x={50} y={52} width={220} height={162} fill={C.sand} />
        {[150, 108, 66].map((y) => <path key={y} d={line([50, y + 26], [270, y + 26])} stroke={shade(C.sand, 0.12)} stroke-width={2} stroke-dasharray="6 6" />)}
        {[0, 1, 2].map((row) => {
          const y = 192 - row * 46;
          return (
            <g key={row}>
              {[70, 160].map((x) => <OG key={x} sh={[{ d: `M${x} ${y}Q${x} ${y - 9} ${x + 10} ${y - 9}L${x + 62} ${y - 4}Q${x + 68} ${y} ${x + 62} ${y + 4}L${x + 10} ${y + 9}Q${x} ${y + 9} ${x} ${y}Z`, f: '#e8782a' }]} />)}
              <OG sh={[{ d: circ([254, y], 9), f: '#8e2a4e' }]} />
            </g>
          );
        })}
      </KesitKap>
    </Scene2>
  ),

  /* ─── Buzhane ─── */
  'sf-ys-buzhane-yer': () => (
    <Scene2 bg="outdoor" gy={170}>
      <path d="M0 170L320 96V240H0Z" fill={K.grassShade} />
      <Tree x={232} y={128} kind="leaf" s={1.2} />
      <Tree x={292} y={112} kind="pine" s={1.1} />
      <Tree x={60} y={184} kind="leaf" s={0.9} />
      <OG sh={[{ d: 'M98 196Q100 120 170 118Q240 120 242 178Z', f: '#b3ada0' }]} />
      <g stroke={shade('#b3ada0', 0.25)} stroke-width={1.4} fill="none">
        <path d="M110 170Q170 150 236 160M118 146Q170 130 226 140M140 126Q170 120 200 124" />
      </g>
      <OG sh={[{ d: 'M150 190V160Q150 146 166 146Q182 146 182 160V184Z', f: '#2b2d3a' }]} />
      <path d="M90 200Q170 150 250 176V196Z" fill="#1c1830" opacity={0.18} />
      <Label x={78} y={40} text="kuzey yamacı" size={13} />
    </Scene2>
  ),
  'sf-ys-buzhane-kesit': () => (
    <Scene2 bg="outdoor" gy={70}>
      <rect x={0} y={70} width={320} height={170} fill={C.soil} />
      <OG sh={[{ d: 'M52 72Q160 6 268 72Z', f: '#c9a24f' }]} />
      <OG sh={[{ d: 'M70 72H250V200L160 226L70 200Z', f: '#9a958a' }, { d: 'M82 72H238V194L160 214L82 194Z', f: C.straw }]} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          {[96, 142, 188].map((x) => <OG key={x} sh={[{ d: rrect(x, 166 - r * 40, 40, 28, 3), f: C.ice }]} />)}
        </g>
      ))}
      <OG sh={[{ d: 'M156 214L170 222H320V232H166Z', f: '#6f6a60' }]} />
      <Arrow from={[190, 228]} to={[300, 228]} color={K.water} w={4} />
    </Scene2>
  ),
  'sf-ys-buz-kesme': () => {
    const saw: [P, P] = [[232, 146], [240, 222]];
    const cut: PersonProps = { ...CAST.AMBAR, x: 176, y: 210, s: 1.05, pose: { ...POSE.kneelOne, spine: -58, chest: -46, head: -30, armB: { to: [saw[0][0] - 2, saw[0][1] + 4] }, armF: { to: [saw[0][0] + 4, saw[0][1] + 10] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    const cr = rig(cut);
    const holder: PersonProps = { ...CAST.YARDIM, x: 54, y: 224, s: 1.05, pose: { ...POSE.standSide, spine: -96, armB: { to: [86, 160] }, armF: { to: [96, 164] }, handB: 'fist', handF: 'fist', face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="snow" gy={190}>
        <path d="M110 190H320V240H90Z" fill={C.ice} />
        <path d="M110 190L90 240" stroke="#9fc4d8" stroke-width={2} />
        <OG sh={[{ d: poly([[226, 206], [290, 206], [296, 224], [232, 224]]), f: '#2a5d85' }]} />
        <OG sh={[{ d: rrect(236, 196, 50, 12, 2), f: tint(C.ice, 0.3) }]} />
        <Person {...cut} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <OG sh={[{ d: capsule(saw[0], 3, saw[1], 3), f: C.woodDark }, { d: poly([[saw[0][0] + 4, saw[0][1] + 20], [saw[1][0] + 2, saw[1][1]], [saw[1][0] + 12, saw[1][1] - 2], [saw[0][0] + 12, saw[0][1] + 20]]), f: '#c9d0d8' }]} />
        <Person {...cut} only={['armF']} />
        <path d={`M96 162Q140 200 ${cr.belly[0]} ${cr.belly[1]}`} fill="none" stroke="#c0603e" stroke-width={3} />
        <Person {...holder} />
        <OG sh={[{ d: rrect(14, 214, 30, 8, 3), f: C.wood }]} />
      </Scene2>
    );
  },

  /* ─── Bal ─── */
  'sf-ys-bal-kuru-kasik': () => (
    <Scene2 bg="closeup">
      <Kavanoz x={98} y={220} w={110} h={120} fill={C.honey} lvl={0.82} lid={null} />
      <OG sh={[{ d: capsule([150, 30], 4, [114, 108], 4), f: C.metal }, { d: ell([108, 118], 14, 9), t: 'rotate(-64 108 118)', f: C.metal }]} />
      <Ok x={60} y={52} r={15} />
      <OG sh={[{ d: capsule([300, 60], 4, [240, 150], 4), f: C.metal }, { d: ell([234, 160], 15, 10), t: 'rotate(-56 234 160)', f: C.metal }]} />
      <Drop x={238} y={182} s={0.9} />
      <Drop x={226} y={200} s={0.7} />
      <Drop x={244} y={146} s={0.6} />
      <Bad x={270} y={210} r={15} />
    </Scene2>
  ),
  'sf-ys-bal-kristal': () => (
    <Scene2 bg="closeup">
      <Kavanoz x={92} y={214} w={96} h={130} fill={C.honey} lvl={0.86} lid="metal" />
      <Kavanoz x={228} y={214} w={96} h={130} fill={C.honeyCrys} lvl={0.86} lid="metal">
        <g fill="#ffffff" opacity={0.7}>{[[206, 130], [222, 150], [244, 138], [214, 176], [240, 186], [232, 162], [252, 166], [206, 196]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} />)}</g>
      </Kavanoz>
      <Ok x={92} y={52} r={15} />
      <Ok x={228} y={52} r={15} />
    </Scene2>
  ),
  'sf-ys-bal-benmari': () => {
    const h = { x: 290, y: 60, a: -130, s: 0.9, pose: 'point' as const, side: 'R' as const };
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(10, 214, 300, 20, 4), f: C.wood }]} />
        <Tencere x={150} y={214} w={210} h={92} ry={10} fill={K.waterLight} />
        <Kavanoz x={140} y={196} w={70} h={96} fill={C.honeyCrys} lvl={0.7} lid={null} />
        <path d="M46 126H254" stroke={K.waterLight} stroke-width={3} opacity={0.0} />
        <Hand {...h} arm={60} {...HAND.FIRIN} />
        <Waves x={226} y={118} a={-90} n={2} r={6} color={K.action} />
      </Scene2>
    );
  },

  /* ─── Tuz ─── */
  'sf-ys-deniz-suyu-alma': () => {
    const pp: PersonProps = { ...CAST.AMBAR, x: 140, y: 214, s: 1.15, pose: { ...POSE.crouch, armB: { to: [204, 186] }, armF: { to: [210, 196] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={150}>
        <Water x={150} y={150} w={170} h={90} />
        <OG sh={[{ d: 'M0 150H180Q200 180 190 212L200 240H0Z', f: '#b9a98c' }]} />
        <Rock x={60} y={214} s={1.2} />
        <Rock x={176} y={232} s={0.9} />
        <OG sh={[{ d: rrect(196, 182, 34, 40, 4), f: '#e6e8eb' }, { d: rrect(200, 176, 10, 8, 2), f: '#e6e8eb' }]} />
        <Person {...pp} />
        <OG sh={[{ d: rrect(24, 108, 40, 30, 2), f: '#a39a8c' }, { d: rrect(48, 80, 8, 30, 1), f: '#8a8174' }]} />
        <path d="M52 76q-6 -10 4 -16q10 -6 4 -16" fill="none" stroke="#5a5f6b" stroke-width={5} stroke-linecap="round" />
        <Bad x={66} y={70} r={13} />
      </Scene2>
    );
  },
  'sf-ys-tuz-kristal': () => (
    <Scene2 bg="closeup">
      <Ates x={160} y={232} w={180} low />
      <OG sh={[{ d: 'M40 140H280L270 196Q268 202 260 202H60Q52 202 50 196Z', f: '#8e99a6' }]} />
      <path d="M50 162H270L266 194H54Z" fill={K.waterLight} opacity={0.0} />
      <OG sh={[{ d: smooth([[56, 194], [70, 168], [110, 158], [160, 162], [210, 156], [250, 166], [264, 194]]) + 'Z', f: C.salt }]} />
      <g fill="#e2e8ee">{[[90, 176], [130, 170], [170, 174], [210, 168], [240, 178], [110, 186], [190, 186]].map(([x, y], i) => <rect key={i} x={x} y={y} width={6} height={6} transform={`rotate(30 ${x} ${y})`} stroke={K.out} stroke-width={0.6} />)}</g>
      <path d="M53 176H267L264 196H56Z" fill={K.water} opacity={0.55} />
      <path d={line([53, 176], [267, 176])} stroke={K.water} stroke-width={2} />
      <Arrow from={[300, 150]} to={[262, 188]} w={5} />
      <Label x={256} y={116} text="1 parmak" size={13} />
    </Scene2>
  ),
  'sf-ys-tuz-ayirma': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: capsule([30, 22], 5, [250, 22], 5), f: C.woodDark }]} />
      <path d={line([140, 26], [140, 40])} stroke={K.out} stroke-width={2} />
      <Bohca x={140} y={40} w={96} h={104} fill={C.cloth} drip="#c9b35a" />
      <g fill="#ffffff">{[[112, 96], [132, 84], [152, 100], [166, 116], [124, 120], [146, 128]].map(([x, y], i) => <rect key={i} x={x} y={y} width={7} height={7} transform={`rotate(30 ${x} ${y})`} stroke={K.out} stroke-width={0.7} />)}</g>
      <Kase x={140} y={226} w={120} h={34} c="#c9d3dc" fill="#c9b35a" rim={7} />
      <Bad x={236} y={204} r={15} />
    </Scene2>
  ),

};
