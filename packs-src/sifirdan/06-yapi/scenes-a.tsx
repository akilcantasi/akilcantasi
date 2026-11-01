// Sıfırdan paketi sahneleri (a): yer, temel, deprem, döşeme, yalıtım, bakım, toprak yapı, kütük seçme/geçme
// ve kategori kapakları. Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { JSX } from 'preact';
import {
  Arrow, Hand, K, Label, No, OG, Timer, Ok, Bad, Person, POSE, Scene2, Tree, Rock, Tent, Drop, Waves, Flame,
  capsule, circ, ell, rrect, smooth, shade, tint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Sh } from '../../../src/art/kit2';

/* ═════════════ Malzeme renkleri (paket geneli) ═════════════ */
const M = {
  kerpic: '#c98b5a', // kerpiç blok
  harc: '#a8754c', // kerpiç çamuru / derz
  camur: '#8f6440', // ıslak çamur
  kil: '#b5876a',
  toprakUst: '#5e4632', // bitkisel kara toprak
  toprak: '#b98e62', // genel toprak kesiti
  sert: '#d2b07c', // sert, sıkı katman
  tas: K.rock,
  tasHarc: '#d9d3c4',
  odun: K.wood,
  kabuk: '#7a5236',
  soyuk: '#dcb684', // kabuğu soyulmuş kütük
  su: K.water,
  saman: '#e6c65c',
  kirec: '#f4f1ea',
  naylon: '#2f3340',
  cakil: '#b9b2a4',
  kum: '#e6d29e',
  sindil: '#9a7b5a',
  cam: '#bfe3f5',
  isik: '#ffe27a',
};

/* ═════════════ Oyuncular ═════════════ */
// Paket kadrosu: USTA (erkek, bıyıklı) çoğu rehberde; YARDIMCI (başörtülü kadın) iki kişilik işlerde.
const CAST = {
  usta: { who: 'man', role: 'helper', skin: 1, hair: 'short', hairC: K.hair.dark, mustache: true, bottomC: K.pants.khaki, sleeve: 'long', face: 'neutral' },
  yardimci: { who: 'woman', role: 'bystander3', skin: 2, hair: 'scarf', hairC: '#7a6aa8', bottomC: K.pants.dark, sleeve: 'long', face: 'neutral' },
} satisfies Record<string, Partial<PersonProps>>;
const USTA = CAST.usta as Partial<PersonProps>;
const YARD = CAST.yardimci as Partial<PersonProps>;
const USTA_SKIN = 1;
const YARD_SKIN = 2;

/* ═════════════ Yardımcılar ═════════════ */
const poly = (ps: P[]) => 'M' + ps.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L') + 'Z';
const box = (x: number, y: number, w: number, h: number) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
/** basit tohumlu rastgele */
const rnd = (seed: number) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

/** Düz metin (beyaz haleli), ölçü yazıları için */
function T({ x, y, text, size = 13, anchor = 'middle', color = K.ink }: { x: number; y: number; text: string; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string }) {
  return (
    <text x={x} y={y + size * 0.36} font-size={size} font-weight={700} text-anchor={anchor} fill={color} stroke="#fff" stroke-width={3.5} paint-order="stroke" stroke-linejoin="round">
      {text}
    </text>
  );
}

/** Ölçü çizgisi: a→b arası ince çizgi, uçlarda dik çentik, ortada etiket */
function Dim({ a, b, text, size = 13, off = [0, 0] as P, color = K.ink }: { a: P; b: P; text: string; size?: number; off?: P; color?: string }) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L * 5, ny = dx / L * 5;
  const m: P = [(a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1]];
  return (
    <g stroke-linecap="round">
      <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}M${a[0] - nx} ${a[1] - ny}L${a[0] + nx} ${a[1] + ny}M${b[0] - nx} ${b[1] - ny}L${b[0] + nx} ${b[1] + ny}`} stroke="#fff" stroke-width={4.5} fill="none" />
      <path d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}M${a[0] - nx} ${a[1] - ny}L${a[0] + nx} ${a[1] + ny}M${b[0] - nx} ${b[1] - ny}L${b[0] + nx} ${b[1] + ny}`} stroke={color} stroke-width={1.8} fill="none" />
      <Label x={m[0]} y={m[1]} text={text} size={size} bg="#fff" />
    </g>
  );
}

/** Kerpiç blok sıraları (önden görünüş). x,y sol üst; w×h alan; bw×bh blok; şaşırtmalı */
function AdobeRows({ x, y, w, h, bw = 30, bh = 14, color = M.kerpic, joint = M.harc, offset = true }: { x: number; y: number; w: number; h: number; bw?: number; bh?: number; color?: string; joint?: string; offset?: boolean }) {
  const sh: Sh[] = [{ d: box(x, y, w, h), f: joint }];
  let row = 0;
  for (let yy = y + h; yy > y + 0.1; yy -= bh) {
    const top = Math.max(y, yy - bh);
    const sx = offset && row % 2 ? -bw / 2 : 0;
    for (let xx = x + sx; xx < x + w; xx += bw) {
      const x0 = Math.max(x, xx) + 1, x1 = Math.min(x + w, xx + bw) - 1;
      if (x1 - x0 > 1) sh.push({ d: rrect(x0, top + 1, x1 - x0, yy - top - 2, 1.2), f: color, no: true });
    }
    row++;
  }
  return <OG sh={sh} />;
}

/** Harçlı moloz taş örgü (önden). x,y sol üst */
function StoneWall({ x, y, w, h, seed = 3, mortar = M.tasHarc, color = M.tas, rows }: { x: number; y: number; w: number; h: number; seed?: number; mortar?: string; color?: string; rows?: number }) {
  const r = rnd(seed);
  const n = rows ?? Math.max(1, Math.round(h / 16));
  const rh = h / n;
  const sh: Sh[] = [{ d: box(x, y, w, h), f: mortar }];
  for (let i = 0; i < n; i++) {
    let xx = x + 1.5 - (i % 2) * 8;
    const y0 = y + i * rh;
    while (xx < x + w - 2) {
      const sw = 14 + r() * 16;
      const x0 = Math.max(x + 1.5, xx), x1 = Math.min(x + w - 1.5, xx + sw);
      if (x1 - x0 > 4) {
        const c = r() > 0.5 ? color : shade(color, 0.1);
        sh.push({ d: rrect(x0, y0 + 1.5, x1 - x0, rh - 3, Math.min(5, rh / 3)), f: c, ln: true });
      }
      xx += sw + 2.5;
    }
  }
  return <OG sh={sh} />;
}

/** Güneş */
function Sun({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return <path key={i} d={`M${x + Math.cos(a) * (r + 4)} ${y + Math.sin(a) * (r + 4)}L${x + Math.cos(a) * (r + 11)} ${y + Math.sin(a) * (r + 11)}`} stroke="#f2b01e" stroke-width={3} stroke-linecap="round" />;
      })}
      <circle cx={x} cy={y} r={r} fill="#ffd23f" stroke={K.out} stroke-width={1.5} />
    </g>
  );
}

/** Kesitte toprak katmanları dolgu deseni (noktalar) */
function Dots({ x, y, w, h, color, n = 30, seed = 7, rmax = 2.2 }: { x: number; y: number; w: number; h: number; color: string; n?: number; seed?: number; rmax?: number }) {
  const r = rnd(seed);
  return (
    <g fill={color}>
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={x + r() * w} cy={y + r() * h} r={0.8 + r() * rmax} />)}
    </g>
  );
}

/** Taş kırığı / çakıl yığını (dolgu) */
function Rubble({ x, y, w, h, seed = 5, color = M.tas, size = 7 }: { x: number; y: number; w: number; h: number; seed?: number; color?: string; size?: number }) {
  const r = rnd(seed);
  const sh: Sh[] = [];
  const cols = Math.max(1, Math.round(w / size)), rws = Math.max(1, Math.round(h / size));
  for (let j = 0; j < rws; j++)
    for (let i = 0; i < cols; i++) {
      const cx = x + (i + 0.5 + (r() - 0.5) * 0.5) * (w / cols), cy = y + (j + 0.5 + (r() - 0.5) * 0.4) * (h / rws);
      sh.push({ d: ell([cx, cy], (w / cols) * (0.38 + r() * 0.14), (h / rws) * (0.36 + r() * 0.12)), f: r() > 0.5 ? color : shade(color, 0.12), ln: true });
    }
  return <OG sh={sh} ow={1} />;
}

/* ── Eğik (kabinet) izdüşüm: u = boy (sağa), v = derinlik (0..1, sağ-yukarı), w = yükseklik ── */
type Obl = { ox: number; oy: number; dx: number; dy: number };
const op = (o: Obl, u: number, v: number, w: number): P => [o.ox + u + v * o.dx, o.oy - w + v * o.dy];
/** Prizma: ön, üst ve sağ yüz */
function prism(o: Obl, u0: number, u1: number, v0: number, v1: number, w0: number, w1: number, f: string, faces = 'fts'): Sh[] {
  const sh: Sh[] = [];
  if (faces.includes('s')) sh.push({ d: poly([op(o, u1, v0, w0), op(o, u1, v1, w0), op(o, u1, v1, w1), op(o, u1, v0, w1)]), f: shade(f, 0.18) });
  if (faces.includes('t')) sh.push({ d: poly([op(o, u0, v0, w1), op(o, u1, v0, w1), op(o, u1, v1, w1), op(o, u0, v1, w1)]), f: tint(f, 0.18) });
  if (faces.includes('f')) sh.push({ d: poly([op(o, u0, v0, w0), op(o, u1, v0, w0), op(o, u1, v0, w1), op(o, u0, v0, w1)]), f });
  return sh;
}

/** Kerpiç ev (önden görünüş, taş subasman + kerpiç + hafif kırma çatı). x sol, y zemin */
function AdobeHouse({ x, y, w = 130, h = 70, plinth = 16, roof = '#8d6a4c', door = true, win = 2 }: { x: number; y: number; w?: number; h?: number; plinth?: number; roof?: string; door?: boolean; win?: number }) {
  const top = y - h;
  return (
    <g>
      <StoneWall x={x} y={y - plinth} w={w} h={plinth} rows={1} seed={11} />
      <AdobeRows x={x} y={top} w={w} h={h - plinth} bw={20} bh={9} />
      <OG sh={[{ d: box(x, top + (h - plinth) * 0.5 - 2, w, 4), f: M.odun }, { d: box(x, top, w, 4), f: M.odun }]} ow={1} />
      {door && <OG sh={[{ d: rrect(x + w * 0.42, y - plinth - (h - plinth) * 0.72, w * 0.16, (h - plinth) * 0.72, 1), f: '#7a5236' }]} />}
      {Array.from({ length: win }, (_, i) => {
        const wx = win === 1 ? x + w * 0.16 : i === 0 ? x + w * 0.14 : x + w * 0.7;
        return <OG key={i} sh={[{ d: rrect(wx, top + (h - plinth) * 0.22, w * 0.15, (h - plinth) * 0.3, 1), f: M.cam }, { d: `M${wx + w * 0.075} ${top + (h - plinth) * 0.22}V${top + (h - plinth) * 0.52}`, st: K.out, sw: 1.4 }]} />;
      })}
      <OG sh={[{ d: poly([[x - 12, top + 2], [x + w * 0.22, top - h * 0.42], [x + w * 0.78, top - h * 0.42], [x + w + 12, top + 2]]), f: roof }, { d: poly([[x + w * 0.5, top - h * 0.42], [x + w * 0.78, top - h * 0.42], [x + w + 12, top + 2], [x + w * 0.5, top + 2]]), f: shade(roof, 0.12), no: true }]} />
    </g>
  );
}

/** Kürek (sap üstte). x,y = ağız ucu */
function Shovel({ x, y, a = -90, len = 90, s = 1 }: { x: number; y: number; a?: number; len?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a + 90}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-2.2, -len, 4.4, len - 14, 2), f: M.odun }, { d: rrect(-7, -len - 3, 14, 5, 2), f: M.odun }, { d: 'M-10 -16H10L9 -2Q0 6 -9 -2Z', f: '#8d97a3' }]} />
    </g>
  );
}

/** Yandan kütük (gövde + uç halkaları). x1..x2 boy, cy merkez, r yarıçap; bark: kabuklu mu */
function LogSide({ x1, x2, cy, r, bark = false, end = 'R' }: { x1: number; x2: number; cy: number; r: number; bark?: boolean; end?: 'L' | 'R' | 'none' }) {
  const c = bark ? M.kabuk : M.soyuk;
  const ex = end === 'L' ? x1 : x2;
  const sh: Sh[] = [
    { d: rrect(x1, cy - r, x2 - x1, 2 * r, r * 0.3), f: c },
    { d: box(x1 + 2, cy + r * 0.35, x2 - x1 - 4, r * 0.6), f: shade(c, 0.12), no: true },
  ];
  if (end !== 'none') {
    sh.push({ d: ell([ex, cy], r * 0.42, r), f: '#e8c896' });
    sh.push({ d: ell([ex, cy], r * 0.25, r * 0.6), f: 'none', ln: true });
  }
  return <OG sh={sh} />;
}

/** Kütük ucu (kesit dairesi) */
function LogEnd({ cx, cy, r, bark = false }: { cx: number; cy: number; r: number; bark?: boolean }) {
  return (
    <OG sh={[
      { d: circ([cx, cy], r), f: bark ? M.kabuk : '#c99c66' },
      { d: circ([cx, cy], r * (bark ? 0.86 : 0.94)), f: '#e8c896', ln: bark },
      { d: circ([cx, cy], r * 0.6), f: 'none', ln: true },
      { d: circ([cx, cy], r * 0.3), f: 'none', ln: true },
    ]} />
  );
}

/** Ağır tahta tokmak (sap + kütük baş). x,y = baş alt ortası; a = sap yönü (yukarı -90) */
function Tamper({ x, y, len = 80, a = -90 }: { x: number; y: number; len?: number; a?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a + 90})`}>
      <OG sh={[{ d: rrect(-2.5, -len, 5, len, 2), f: M.odun }, { d: rrect(-8, -len, 16, 5, 2), f: M.odun }, { d: rrect(-10, -18, 20, 18, 2), f: shade(M.odun, 0.1) }]} />
    </g>
  );
}

/** Kova (taban ortası) */
function Bucket({ x, y, s = 1, fill = M.su, color = '#8d97a3' }: { x: number; y: number; s?: number; fill?: string | null; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-15 -30H15L12 0H-12Z', f: color },
        { d: ell([0, -30], 15, 4), f: fill ?? shade(color, 0.25), ln: true },
        { d: 'M-15 -30Q0 -52 15 -30', st: K.out, sw: 1.6 },
      ]} />
    </g>
  );
}

/** Saman demeti / kıyılmış saman çöpleri */
function StrawBits({ x, y, w, h, n = 16, seed = 4, color = M.saman }: { x: number; y: number; w: number; h: number; n?: number; seed?: number; color?: string }) {
  const r = rnd(seed);
  return (
    <g stroke-linecap="round">
      {Array.from({ length: n }, (_, i) => {
        const cx = x + r() * w, cy = y + r() * h, a = r() * Math.PI, l = 4 + r() * 5;
        const d = `M${cx - Math.cos(a) * l} ${cy - Math.sin(a) * l}L${cx + Math.cos(a) * l} ${cy + Math.sin(a) * l}`;
        return (
          <g key={i}>
            <path d={d} stroke={K.out} stroke-width={3.4} />
            <path d={d} stroke={color} stroke-width={1.8} />
          </g>
        );
      })}
    </g>
  );
}

/* ═════════════ SAHNELER ═════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ─────────── Kategori kapakları ─────────── */
  'sf-yp-kapak-yer': () => (
    <Scene2 bg="outdoor">
      <Sun x={52} y={44} r={17} />
      <OG sh={[{ d: 'M0 172Q60 150 110 160H222Q262 168 320 204V240H0Z', f: K.grass }, { d: 'M0 184Q60 162 110 172H222Q262 180 320 216V240H0Z', f: M.toprak, no: true }]} />
      <AdobeHouse x={104} y={162} w={114} h={66} />
      <Tree x={268} y={186} s={0.8} />
    </Scene2>
  ),

  'sf-yp-kapak-toprak': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <AdobeRows x={176} y={92} w={124} h={108} bw={31} bh={15} />
      {/* güneşte kuruyan kerpiçler ve boş kalıp */}
      {[0, 1, 2].map((r) => [0, 1, 2].map((i) => {
        const x = 26 + i * 46 + r * 8, y = 176 + r * 20, w = 36 - r * 0, h = 12;
        return <OG key={r + '-' + i} sh={[{ d: rrect(x, y, w, h, 2), f: M.kerpic }, { d: box(x, y + h - 4, w, 4), f: shade(M.kerpic, 0.15), no: true }]} />;
      }))}
      <OG sh={[{ d: rrect(190, 208, 100, 22, 2) + rrect(197, 212, 39, 14, 1) + rrect(244, 212, 39, 14, 1), f: M.odun, fr: 'evenodd' }]} />
      <Sun x={60} y={46} r={15} />
    </Scene2>
  ),

  'sf-yp-kapak-ahsap': () => {
    const logs = [0, 1, 2, 3, 4, 5];
    return (
      <Scene2 bg="outdoor">
        <Tree x={36} y={196} kind="pine" s={1} />
        <StoneWall x={70} y={176} w={190} h={22} rows={1} seed={2} />
        {logs.map((i) => <LogSide key={i} x1={66} x2={264} cy={166 - i * 19} r={9.5} end="none" />)}
        {logs.map((i) => <LogEnd key={'e' + i} cx={262} cy={166 - i * 19 - 9} r={9} />)}
        {logs.map((i) => <LogEnd key={'l' + i} cx={70} cy={166 - i * 19 - 9} r={9} />)}
        <OG sh={[{ d: rrect(140, 120, 40, 56, 1), f: '#7a5236' }]} />
        <OG sh={[{ d: poly([[52, 64], [160, 18], [278, 64]]), f: M.sindil }, { d: poly([[160, 18], [278, 64], [160, 64]]), f: shade(M.sindil, 0.12), no: true }]} />
      </Scene2>
    );
  },

  'sf-yp-kapak-cati': () => (
    <Scene2 bg="outdoor">
      <Tree x={286} y={198} s={0.9} />
      <StoneWall x={80} y={182} w={160} h={18} rows={1} seed={9} />
      <OG sh={[{ d: box(84, 112, 152, 70), f: '#e3cfae' }, { d: box(196, 112, 40, 70), f: shade('#e3cfae', 0.08), no: true }]} />
      <OG sh={[{ d: rrect(146, 128, 30, 54, 1), f: '#7a5236' }, { d: circ([170, 156], 2), f: K.ink, no: true }]} />
      <OG sh={[{ d: rrect(100, 128, 30, 26, 1), f: M.cam }, { d: 'M115 128V154M100 141H130', st: K.out, sw: 1.4 }]} />
      <OG sh={[{ d: poly([[66, 116], [160, 36], [254, 116]]), f: M.sindil }]} />
      {[0, 1, 2, 3, 4].map((i) => {
        const yy = 52 + i * 14, half = ((yy - 36) / 80) * 94;
        return <path key={i} d={`M${160 - half} ${yy}H${160 + half}`} stroke={shade(M.sindil, 0.35)} stroke-width={1.6} />;
      })}
    </Scene2>
  ),

  /* ─────────── Yer seçimi ─────────── */
  'sf-yp-yer-taskin': () => (
    <Scene2 bg="outdoor">
      {/* yüksek seki */}
      <OG sh={[{ d: 'M176 240V206L214 150H320V240Z', f: M.toprak }, { d: 'M214 150H320V158H210Z', f: K.grass, no: true }]} />
      <AdobeHouse x={228} y={152} w={80} h={50} />
      {/* düzlük: çakıllı yatak */}
      <rect x={0} y={200} width={190} height={40} fill={M.cakil} />
      <Dots x={4} y={204} w={178} h={32} color={shade(M.cakil, 0.25)} n={40} seed={3} />
      {/* eski taşkın çizgisi */}
      <path d="M4 168H200" stroke={K.water} stroke-width={2.4} stroke-dasharray="8 6" />
      <Tree x={44} y={204} s={1.05} />
      <rect x={38} y={162} width={12} height={10} fill={M.toprakUst} />
      <Tent x={124} y={208} s={0.95} />
      <Bad x={160} y={156} r={14} />
      <Ok x={268} y={70} r={14} />
    </Scene2>
  ),

  'sf-yp-yer-heyelan': () => (
    <Scene2 bg="outdoor">
      <OG sh={[{ d: 'M0 44Q50 40 80 58Q150 108 214 184L232 198H320V240H0Z', f: K.grass }]} />
      {/* kaşık biçimli oyuk: kopma basamağı */}
      <OG sh={[{ d: 'M22 46Q60 30 104 70Q92 92 66 90Q40 84 22 46Z', f: M.toprak }, { d: 'M66 90Q92 92 104 70Q96 98 70 100Z', f: shade(K.grass, 0.1) }]} />
      {/* çatlaklar */}
      <path d="M110 108l10 -8l5 10l10 -9l5 8M140 140l8 -10l6 9l10 -8M86 124l9 -6l4 9l10 -6" fill="none" stroke={K.ink} stroke-width={3.2} stroke-linecap="round" stroke-linejoin="round" />
      {/* sızıntı */}
      <OG sh={[{ d: ell([178, 168], 24, 9), f: shade(K.grass, 0.4) }]} />
      <Drop x={170} y={186} s={0.9} />
      <Drop x={188} y={190} s={0.8} />
      <g transform="rotate(14 158 128)"><Tree x={158} y={128} s={0.5} /></g>
      <AdobeHouse x={238} y={200} w={70} h={46} />
      <Bad x={300} y={140} r={14} />
      <Arrow from={[52, 156]} to={[82, 132]} w={5} />
    </Scene2>
  ),

  'sf-yp-yer-cukur': () => {
    const gy = 118;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={240 - gy} fill={M.sert} />
        <Dots x={0} y={gy + 34} w={320} h={100} color={shade(M.sert, 0.18)} n={60} seed={5} />
        <rect x={0} y={gy} width={320} height={30} fill={M.toprakUst} />
        <rect x={0} y={gy - 4} width={320} height={6} fill={K.grass} />
        {/* çukur (arka duvarı) */}
        <OG sh={[{ d: box(150, gy, 84, 30), f: shade(M.toprakUst, 0.3) }, { d: box(150, gy + 30, 84, 66), f: shade(M.sert, 0.25) }]} />
        {/* kazı yığını */}
        <OG sh={[{ d: `M248 ${gy}Q274 ${gy - 30} 304 ${gy}Z`, f: M.toprakUst }]} />
        <Shovel x={128} y={gy + 2} a={-92} len={84} />
        <Person {...USTA} x={100} y={gy + 2} s={0.62} pose={{ ...POSE.standSide, armF: { to: [128, gy - 62] }, armB: { to: [126, gy - 44] } }} />
        <Dim a={[244, gy]} b={[244, gy + 96]} text="1 m" off={[22, 20]} />
      </Scene2>
    );
  },

  /* ─────────── Güneş yönü ─────────── */
  'sf-yp-gunes-cubuk': () => (
    <Scene2 bg="outdoor" ground="dirt" gy={176}>
      <Sun x={104} y={36} r={18} />
      <path d="M118 52L157 88" stroke="#f2b01e" stroke-width={2.2} stroke-dasharray="5 5" />
      <path d="M157 88L214 176" stroke="#f2b01e" stroke-width={1.6} stroke-dasharray="3 5" />
      <path d="M160 173L214 175L214 181L160 181Z" fill={shade(K.dirt, 0.45)} />
      <OG sh={[{ d: rrect(155, 86, 8, 92, 2), f: M.odun }]} />
      <Arrow from={[222, 200]} to={[278, 200]} w={6} />
      <Label x={296} y={200} text="K" size={18} />
      <T x={140} y={210} text="öğle" size={14} />
    </Scene2>
  ),

  'sf-yp-gunes-plan': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill="#cfe3b8" />
      {/* ev planı: duvar halkası */}
      <OG sh={[{ d: box(60, 76, 200, 78) + box(70, 86, 180, 58), f: M.kerpic, fr: 'evenodd' }]} />
      <rect x={70} y={86} width={180} height={58} fill="#efe4cf" />
      {/* güney pencereleri (altta) */}
      {[82, 122, 162, 202].map((x) => <OG key={x} sh={[{ d: box(x, 144, 30, 10), f: M.cam }]} />)}
      {/* kuzeyde tek küçük pencere */}
      <OG sh={[{ d: box(150, 76, 16, 10), f: M.cam }]} />
      <Sun x={160} y={208} r={14} />
      <Arrow from={[160, 186]} to={[160, 164]} w={5} />
      <Arrow from={[284, 70]} to={[284, 22]} w={5} />
      <Label x={284} y={86} text="K" size={15} />
    </Scene2>
  ),

  'sf-yp-gunes-sacak': () => {
    // Yan kesit. 1,5 m = 120 birim. Pencere altı (176,180), saçak ucu (216,60): 50 cm = 40 birim dışarı.
    // Yaz güneşi (dik) saçak ucunu sıyırıp pencere altına düşer; kış güneşi (alçak) pencereden içeri girer.
    const gy = 215, wx = 150, wf = 176, sill = 180, wtop = 86;
    const tip: P = [216, 60];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={0} width={wx} height={gy} fill="#efe4cf" />
        <rect x={0} y={gy} width={wx} height={25} fill={K.floor} />
        {/* kış güneşi lekesi */}
        <path d={`M${wf} ${wtop}L${wf} ${sill}L106 ${gy}L0 ${gy}L0 ${wtop + 88}Z`} fill={M.isik} opacity={0.6} />
        <OG sh={[{ d: box(wx, 40, wf - wx, wtop - 40), f: M.kerpic }, { d: box(wx, sill, wf - wx, gy - sill), f: M.kerpic }, { d: box(wx + 10, wtop, 6, sill - wtop), f: M.cam }]} />
        {/* çatı ve saçak */}
        <OG sh={[{ d: poly([[-4, 0], [tip[0], tip[1] - 9], [tip[0], tip[1]], [-4, 9]]), f: M.sindil }]} />
        {/* ölçü yardımcı çizgileri */}
        <path d={`M${tip[0] + 4} ${tip[1]}H240M${wf + 4} ${sill}H240`} stroke={K.ink} stroke-width={1.2} stroke-dasharray="4 3" />
        <Dim a={[234, tip[1]]} b={[234, sill]} text="1,5 m" size={12} off={[0, 30]} />
        <Dim a={[wf, 34]} b={[tip[0], 34]} text="50 cm" size={12} off={[0, -14]} />
        {/* güneş ışınları */}
        <Arrow from={[236, 0]} to={[wf + 3, sill - 4]} w={4} color="#e0a21a" />
        <T x={258} y={14} text="yaz" size={13} />
        <Arrow from={[318, 70]} to={[70, 192]} w={5} />
        <T x={296} y={52} text="kış" size={13} />
      </Scene2>
    );
  },

  /* ─────────── Temel ─────────── */
  'sf-yp-temel-hendek': () => {
    const gy = 84;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={240 - gy} fill={M.sert} />
        <Dots x={0} y={gy + 30} w={320} h={130} color={shade(M.sert, 0.18)} n={60} seed={9} />
        {/* bitkisel toprak: kenarlarda duruyor, ortada kaldırılmış */}
        <rect x={0} y={gy} width={70} height={22} fill={M.toprakUst} />
        <rect x={250} y={gy} width={70} height={22} fill={M.toprakUst} />
        <rect x={0} y={gy - 4} width={70} height={5} fill={K.grass} />
        <rect x={250} y={gy - 4} width={70} height={5} fill={K.grass} />
        {/* hendek */}
        <OG sh={[{ d: box(116, gy + 22, 88, 112), f: shade(M.sert, 0.3) }]} />
        {/* gelecek duvar (kesik çizgi) */}
        <rect x={138} y={14} width={44} height={gy + 6} fill="none" stroke={K.ink} stroke-width={1.8} stroke-dasharray="6 5" />
        <T x={160} y={40} text="duvar" size={12} />
        <Dim a={[116, gy + 70]} b={[204, gy + 70]} text="2 kat" size={12} off={[0, 0]} />
        <Dim a={[222, gy + 22]} b={[222, gy + 134]} text="80 cm" off={[22, 0]} />
      </Scene2>
    );
  },

  'sf-yp-temel-subasman': () => {
    const gy = 186;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={60} fill={M.toprak} />
        <rect x={0} y={gy - 3} width={320} height={6} fill={K.grass} />
        {/* taş temel: toprak altında ve 50 cm üstünde */}
        <StoneWall x={112} y={120} w={84} h={120} seed={6} rows={7} />
        <rect x={112} y={gy} width={84} height={2} fill={K.ink} opacity={0.4} />
        {/* nem kesici + hatıl */}
        <OG sh={[{ d: box(110, 116, 88, 4), f: M.naylon }, { d: box(112, 102, 84, 14), f: M.odun }]} />
        <AdobeRows x={122} y={10} w={64} h={92} bw={32} bh={15} />
        <Dim a={[222, gy]} b={[222, 120]} text="50 cm" off={[26, 0]} />
        <Ok x={60} y={130} r={14} />
        <Drop x={70} y={170} s={0.7} />
        <Drop x={86} y={178} s={0.6} />
      </Scene2>
    );
  },

  'sf-yp-temel-hatil': () => {
    const o: Obl = { ox: 24, oy: 196, dx: 66, dy: -44 };
    const L = 228; // 50 cm = 57 birim
    const sh: Sh[] = [];
    // taş temel bloğu
    const base = prism(o, 0, L, 0, 1, 0, 70, M.tas);
    // naylon
    const nay = prism(o, 0, L, 0, 1, 70, 73, M.naylon);
    // arka kadron
    const back = prism(o, 0, L, 0.8, 1, 73, 92, M.odun);
    const front = prism(o, 0, L, 0, 0.2, 73, 92, M.odun);
    const cross = [0, 57, 114, 171, 228 - 12].map((u) => prism(o, u, u + 12, 0, 1, 92, 100, shade(M.odun, 0.06)));
    sh.push(...base, ...nay);
    return (
      <Scene2 bg="outdoor">
        <OG sh={sh} />
        <StoneWall x={24} y={126} w={L} h={70} rows={4} seed={13} />
        <OG sh={back} />
        {/* taş kırığı dolgu */}
        <g>
          {Array.from({ length: 16 }, (_, i) => {
            const p = op(o, 8 + i * 14, 0.5, 88);
            return <OG key={i} sh={[{ d: ell(p, 7, 5), f: i % 2 ? M.tas : shade(M.tas, 0.12) }]} ow={1} />;
          })}
        </g>
        <OG sh={front} />
        {cross.map((c, i) => <OG key={i} sh={c} />)}
        <Dim a={op(o, 6, 0, 108)} b={op(o, 63, 0, 108)} text="50 cm" size={12} off={[-2, -14]} />
      </Scene2>
    );
  },

  /* ─────────── Deprem ─────────── */
  'sf-yp-deprem-cati': () => (
    <Scene2 bg="outdoor">
      {/* ağır toprak dam */}
      <StoneWall x={22} y={186} w={118} h={14} rows={1} seed={4} />
      <AdobeRows x={22} y={128} w={118} h={58} bw={20} bh={10} />
      <OG sh={[{ d: box(14, 120, 134, 8), f: M.odun }, { d: rrect(10, 88, 142, 32, 3), f: M.toprakUst }, { d: box(10, 86, 142, 5), f: K.grass, no: true }]} />
      <Arrow from={[60, 26]} to={[60, 78]} w={7} color={K.danger} />
      <Arrow from={[102, 26]} to={[102, 78]} w={7} color={K.danger} />
      <Bad x={130} y={150} r={16} />
      {/* hafif makaslı çatı */}
      <StoneWall x={180} y={186} w={118} h={14} rows={1} seed={8} />
      <AdobeRows x={180} y={128} w={118} h={58} bw={20} bh={10} />
      <OG sh={[{ d: box(176, 124, 126, 5), f: M.odun }, { d: poly([[166, 128], [239, 78], [312, 128]]), f: M.sindil }, { d: poly([[239, 78], [312, 128], [239, 128]]), f: shade(M.sindil, 0.12), no: true }]} />
      <Ok x={239} y={154} r={16} />
    </Scene2>
  ),

  'sf-yp-deprem-hatil': () => {
    const o: Obl = { ox: 36, oy: 220, dx: 84, dy: -46 };
    const U = 170;
    const lev = [[24, 32], [64, 72], [104, 112], [130, 138]] as const; // hatıl seviyeleri
    const wall = (w0: number, w1: number) => prism(o, 0, U, 0, 1, w0, w1, M.kerpic, 'fs');
    const bands = lev.map(([a, b]) => prism(o, 0, U, 0, 1, a, b, K.action, 'fs'));
    const winF = (u: number) => poly([op(o, u, 0, 74), op(o, u + 26, 0, 74), op(o, u + 26, 0, 102), op(o, u, 0, 102)]);
    const sideWin = poly([op(o, U, 0.38, 74), op(o, U, 0.62, 74), op(o, U, 0.62, 102), op(o, U, 0.38, 102)]);
    const ridgeA = op(o, -6, 0.5, 164), ridgeB = op(o, U + 6, 0.5, 164);
    return (
      <Scene2 bg="outdoor">
        <OG sh={prism(o, 0, U, 0, 1, 0, 24, M.tas, 'fs')} />
        <OG sh={[...wall(32, 64), ...wall(72, 104), ...wall(112, 130)]} />
        <OG sh={[{ d: winF(30), f: M.cam }, { d: winF(112), f: M.cam }, { d: sideWin, f: M.cam }]} />
        {bands.map((b, i) => <OG key={i} sh={b} />)}
        <OG sh={[
          { d: poly([op(o, -6, -0.08, 138), op(o, U + 6, -0.08, 138), ridgeB, ridgeA]), f: M.sindil },
          { d: poly([op(o, U + 6, -0.08, 138), op(o, U + 6, 1.08, 138), ridgeB]), f: shade(M.sindil, 0.15) },
        ]} />
      </Scene2>
    );
  },

  'sf-yp-deprem-bosluk': () => {
    // ölçek 1 m = 56 birim
    const gy = 204, x0 = 24, top = 58;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <StoneWall x={x0} y={gy - 22} w={290} h={22} rows={1} seed={21} />
        <AdobeRows x={x0} y={top} w={290} h={gy - 22 - top} bw={28} bh={13} />
        {/* kapı 1,00 m, köşeden 1 m */}
        <OG sh={[{ d: box(x0 + 56, 64, 56, 118), f: '#7a5236' }, { d: box(x0 + 52, 58, 64, 8), f: M.odun }]} />
        {/* pencere 0,90 m, kapıdan 1 m */}
        <OG sh={[{ d: box(x0 + 168, 84, 50, 56), f: M.cam }, { d: `M${x0 + 193} 84V140`, st: K.out, sw: 1.5 }, { d: box(x0 + 164, 76, 58, 8), f: M.odun }]} />
        <OG sh={[{ d: box(x0 - 6, top - 10, 302, 10), f: M.odun }]} />
        <Dim a={[x0, 156]} b={[x0 + 56, 156]} text="1 m" off={[0, 0]} />
        <Dim a={[x0 + 112, 112]} b={[x0 + 168, 112]} text="1 m" off={[0, 0]} />
      </Scene2>
    );
  },
  /* ─────────── Döşeme ─────────── */
  'sf-yp-doseme-katlar': () => {
    // Taban çukurunun kesiti: en alt kat 10 cm çakıl (1 cm = 5 birim), tokmakla sıkıştırılıyor.
    const L = 100, R = 320, top = 150, bot = 200;
    return (
      <Scene2 bg="outdoor" gy={136}>
        <rect x={0} y={136} width={60} height={104} fill={M.toprak} />
        <rect x={0} y={133} width={60} height={5} fill={K.grass} />
        <rect x={L} y={bot} width={R - L} height={40} fill={shade(M.sert, 0.05)} />
        <rect x={L} y={18} width={R - L} height={top - 18} fill="#efe4cf" />
        <StoneWall x={56} y={92} w={44} h={148} rows={9} seed={31} />
        <AdobeRows x={60} y={0} w={36} h={92} bw={36} bh={15} />
        <OG sh={[{ d: box(L, top, R - L, bot - top), f: M.cakil }]} ow={1.2} />
        <Rubble x={L + 2} y={top + 2} w={R - L - 4} h={bot - top - 4} seed={2} color={M.cakil} size={10} />
        <Tamper x={250} y={top} len={110} />
        <Arrow from={[284, 70]} to={[284, 128]} w={5} />
        <Dim a={[136, top]} b={[136, bot]} text="10 cm" size={12} off={[30, 0]} />
        <T x={196} y={top - 12} text="çakıl" size={12} />
      </Scene2>
    );
  },

  'sf-yp-doseme-tokmak': () => (
    <Scene2 bg="indoor">
      <rect x={0} y={200} width={320} height={40} fill={M.toprak} />
      <rect x={0} y={208} width={320} height={10} fill={shade(M.toprak, 0.12)} />
      <Dots x={210} y={200} w={110} h={8} color={shade(M.toprak, 0.3)} n={14} rmax={1.2} />
      <Tamper x={196} y={184} len={94} a={-94} />
      <Person {...USTA} x={130} y={226} s={1.05} pose={{ ...POSE.standSide, spine: -84, chest: -70, head: -70, legB: [100, 96], legF: [72, 100], armF: { to: [193, 120] }, armB: { to: [191, 104] }, handF: 'fist', handB: 'fist' }} />
      <Arrow from={[228, 120]} to={[228, 178]} w={6} />
    </Scene2>
  ),

  'sf-yp-doseme-ahsap': () => {
    const gy = 206; // 45 cm = 70 birim → kiriş altı y=136
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={20} y={gy} width={300} height={34} fill={M.toprak} />
        <rect x={60} y={80} width={260} height={46} fill="#efe4cf" />
        <rect x={60} y={136} width={260} height={70} fill={shade('#efe4cf', 0.35)} />
        <StoneWall x={20} y={86} w={40} h={154} rows={10} seed={41} />
        {/* havalandırma deliği + tel */}
        <OG sh={[{ d: box(24, 156, 32, 22), f: '#3b3f4b' }]} />
        <path d="M30 156V178M38 156V178M46 156V178M24 163H56M24 170H56" stroke="#c7ccd3" stroke-width={1.3} />
        {[150, 250].map((x) => <StoneWall key={x} x={x - 16} y={136} w={32} h={70} rows={4} seed={x} />)}
        <OG sh={[{ d: box(60, 124, 260, 12), f: M.odun }, { d: box(60, 118, 260, 6), f: tint(M.odun, 0.2) }]} />
        <Waves x={64} y={167} a={0} n={3} r={6} color="#7fa7c9" />
        <Dim a={[110, gy]} b={[110, 136]} text="45 cm" size={12} off={[0, 0]} />
      </Scene2>
    );
  },

  /* ─────────── Yalıtım ─────────── */
  'sf-yp-yalitim-tavan': () => (
    <Scene2 bg="indoor" gy={210}>
      <rect x={0} y={0} width={320} height={40} fill={K.sky} />
      <OG sh={[{ d: box(0, 42, 320, 8), f: M.camur }]} />
      <OG sh={[{ d: box(0, 50, 320, 36), f: M.saman }]} />
      <StrawBits x={4} y={54} w={312} h={28} n={60} seed={6} color={shade(M.saman, 0.2)} />
      <OG sh={[{ d: box(0, 86, 320, 7), f: tint(M.odun, 0.15) }]} />
      {[20, 80, 140, 200, 260].map((x) => <OG key={x} sh={[{ d: box(x, 93, 20, 14), f: M.odun }]} />)}
      <OG sh={[{ d: box(0, 42, 18, 168), f: M.kerpic }, { d: box(302, 42, 18, 168), f: M.kerpic }]} />
      {[90, 160, 230].map((x) => <Arrow key={x} from={[x, 186]} to={[x, 118]} w={5} />)}
      <T x={160} y={68} text="saman" size={14} />
    </Scene2>
  ),

  'sf-yp-yalitim-cift-duvar': () => {
    // düşey kesit: solda iç, sağda dış; iki dal örgü yüz, arası saman
    const face = (x: number) => (
      <g>
        <OG sh={[{ d: box(x, 20, 12, 200), f: M.odun }]} />
        {Array.from({ length: 13 }, (_, i) => <OG key={i} sh={[{ d: ell([x + (i % 2 ? 10 : 2), 28 + i * 15], 6, 6), f: tint(M.odun, 0.12) }]} ow={1.2} />)}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={110} height={240} fill="#efe4cf" />
        <rect x={238} y={0} width={82} height={240} fill={K.sky} />
        <OG sh={[{ d: box(124, 20, 84, 200), f: M.saman }]} />
        <StrawBits x={126} y={24} w={80} h={192} n={50} seed={8} color={shade(M.saman, 0.22)} />
        <OG sh={[{ d: box(102, 20, 10, 200), f: M.camur }, { d: box(220, 20, 18, 200), f: M.camur }]} />
        {face(112)}
        {face(208)}
        <rect x={0} y={220} width={320} height={20} fill={M.tas} />
        <T x={166} y={120} text="saman" size={14} />
        <T x={54} y={36} text="iç" size={14} />
        <T x={280} y={36} text="dış" size={14} />
        <path d="M252 168H234" stroke={K.ink} stroke-width={1.6} />
        <T x={280} y={168} text="çamur" size={12} />
      </Scene2>
    );
  },

  'sf-yp-yalitim-baca': () => {
    const ceil = (x0: number, x1: number) => (
      <g>
        <OG sh={[{ d: box(x0, 80, x1 - x0, 32), f: M.saman }]} />
        <StrawBits x={x0 + 2} y={83} w={x1 - x0 - 4} h={26} n={Math.round((x1 - x0) / 6)} seed={x0 + 3} color={shade(M.saman, 0.2)} />
        <OG sh={[{ d: box(x0, 112, x1 - x0, 7), f: tint(M.odun, 0.15) }]} />
      </g>
    );
    const pipe = (x: number) => <OG sh={[{ d: box(x - 7, 14, 14, 170), f: '#59606b' }]} />;
    const stove = (x: number) => <OG sh={[{ d: rrect(x - 24, 176, 48, 26, 3), f: '#3b3f4b' }, { d: box(x - 20, 202, 5, 10) + box(x + 15, 202, 5, 10), f: '#3b3f4b' }, { d: rrect(x - 12, 184, 18, 10, 2), f: K.fire, ln: true }]} />;
    return (
      <Scene2 bg="indoor" gy={210}>
        {/* doğru */}
        {ceil(0, 70)}
        {ceil(130, 196)}
        {pipe(100)}
        <OG sh={[{ d: box(70, 78, 60, 41), f: M.tas }]} />
        <StoneWall x={70} y={78} w={22} h={41} rows={3} seed={4} />
        <StoneWall x={108} y={78} w={22} h={41} rows={3} seed={5} />
        {pipe(100)}
        {stove(100)}
        <Ok x={38} y={150} r={15} />
        {/* yanlış */}
        <rect x={204} y={0} width={4} height={240} fill="#fff" />
        {ceil(208, 320)}
        {pipe(264)}
        <Flame x={252} y={86} s={0.55} />
        {stove(264)}
        <Bad x={296} y={150} r={15} />
      </Scene2>
    );
  },

  /* ─────────── Bakım ─────────── */
  'sf-yp-bakim-dip': () => (
    <Scene2 bg="outdoor" gy={196}>
      <AdobeRows x={30} y={0} w={170} h={196} bw={34} bh={16} />
      {/* dipte oyulma */}
      <OG sh={[{ d: 'M200 196V168Q180 182 150 178Q110 186 70 176Q46 182 30 174V196Z', f: shade(M.harc, 0.15) }]} />
      {[[60, 150], [110, 160], [170, 146], [86, 132]].map(([x, y], i) => <OG key={i} sh={[{ d: ell([x, y], 12, 7), f: '#6f8f4a' }]} ow={1.1} />)}
      {/* birikinti */}
      <OG sh={[{ d: ell([214, 204], 46, 8), f: K.water }]} />
      <circle cx={214} cy={198} r={40} fill="none" stroke={K.danger} stroke-width={4} />
      <Arrow from={[230, 184]} to={[300, 216]} w={5} />
    </Scene2>
  ),

  'sf-yp-bakim-curuk': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: box(10, 120, 300, 70), f: M.odun }, { d: box(10, 168, 300, 22), f: shade(M.odun, 0.12), no: true }]} />
      {[40, 80, 230, 270].map((x) => <path key={x} d={`M${x} 132Q${x + 30} 138 ${x + 60} 130`} stroke={shade(M.odun, 0.3)} stroke-width={1.5} fill="none" />)}
      {/* çürük, süngerimsi bölge */}
      <OG sh={[{ d: smooth([[110, 122], [160, 116], [214, 124], [222, 160], [196, 186], [130, 184], [104, 158]], true), f: '#5c3f2a' }]} />
      <Dots x={118} y={128} w={92} h={50} color="#3d2a1c" n={30} seed={3} rmax={2} />
      {/* bıçak */}
      <OG sh={[{ d: 'M156 96L168 96L166 150L161 160L157 150Z', f: '#c9d0d8' }, { d: rrect(152, 44, 20, 54, 4), f: '#3b3f4b' }]} />
      <Hand x={162} y={22} a={180} s={1.0} pose="fist" side="R" arm={60} sleeve={K.role.helper} skin={USTA_SKIN} />
      <circle cx={162} cy={152} r={58} fill="none" stroke={K.danger} stroke-width={4} />
    </Scene2>
  ),

  'sf-yp-bakim-dikme': () => {
    // Çürük kirişin iki yanına geçici dikme: kiriş taşınıyor, sonra çürük parça değişecek.
    const by = 66, gy = 206;
    const prop = (x: number) => (
      <OG sh={[
        { d: box(x - 7, by + 18, 14, gy - by - 26), f: tint(M.odun, 0.12) },
        { d: poly([[x - 16, gy - 8], [x + 16, gy - 8], [x + 16, gy], [x - 16, gy]]), f: M.odun },
        { d: poly([[x - 12, by + 18], [x + 12, by + 18], [x + 12, by + 12], [x - 12, by + 12]]), f: M.odun },
      ]} />
    );
    return (
      <Scene2 bg="indoor" gy={gy}>
        <OG sh={[{ d: box(0, 30, 24, gy - 30), f: '#d9c7a6' }, { d: box(296, 30, 24, gy - 30), f: '#d9c7a6' }]} />
        <OG sh={[{ d: box(0, by - 12, 320, 24), f: M.odun }]} />
        <OG sh={[{ d: smooth([[132, by - 10], [160, by - 13], [190, by - 9], [196, by + 6], [184, by + 13], [150, by + 12], [128, by + 4]], true), f: '#4e3524' }]} ow={1.2} />
        <Dots x={136} y={by - 8} w={54} h={18} color="#2e1f15" n={14} rmax={1.4} />
        {prop(104)}
        {prop(222)}
        <Arrow from={[104, 170]} to={[104, 108]} w={5} />
        <Arrow from={[222, 170]} to={[222, 108]} w={5} />
      </Scene2>
    );
  },

  /* ─────────── Toprak testi ─────────── */
  'sf-yp-test-katlar': () => {
    const x0 = 100, w = 110;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(x0, 40, w, 170, 10), f: '#e8f4fb' }]} />
        <rect x={x0 + 3} y={162} width={w - 6} height={45} rx={7} fill={M.kum} />
        <Dots x={x0 + 6} y={166} w={w - 12} h={38} color={shade(M.kum, 0.3)} n={50} rmax={1.6} />
        <rect x={x0 + 3} y={130} width={w - 6} height={32} fill="#c7b59a" />
        <rect x={x0 + 3} y={112} width={w - 6} height={18} fill="#9c7a5e" />
        <rect x={x0 + 3} y={60} width={w - 6} height={52} fill="#cfe6f3" opacity={0.9} />
        <OG sh={[{ d: rrect(x0 - 4, 30, w + 8, 14, 4), f: '#8d97a3' }]} />
        <path d={`M${x0 + 3} 60H${x0 + w - 3}`} stroke={K.water} stroke-width={2} />
        {/* cetvel */}
        <OG sh={[{ d: box(x0 + w + 14, 60, 18, 148), f: '#f2d27a' }]} />
        {Array.from({ length: 15 }, (_, i) => <path key={i} d={`M${x0 + w + 14} ${208 - i * 10}h${i % 5 ? 6 : 11}`} stroke={K.ink} stroke-width={1.2} />)}
        <T x={x0 - 30} y={121} text="kil" size={14} />
        <T x={x0 - 30} y={146} text="silt" size={14} />
        <T x={x0 - 30} y={185} text="kum" size={14} />
        {[121, 146, 185].map((y) => <path key={y} d={`M${x0 - 14} ${y}H${x0 + 8}`} stroke={K.ink} stroke-width={1.6} />)}
      </Scene2>
    );
  },

  'sf-yp-test-cubuk': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: box(20, 96, 280, 48), f: M.odun }, { d: box(28, 104, 264, 32), f: shade(M.odun, 0.3), ln: true }]} />
      <OG sh={[{ d: rrect(28, 105, 236, 30, 2), f: M.kil }]} />
      {[90, 150, 210].map((x) => <path key={x} d={`M${x} 106l3 8l-3 7l4 13`} stroke={shade(M.kil, 0.4)} stroke-width={1.4} fill="none" />)}
      <Dim a={[20, 74]} b={[300, 74]} text="60 cm" off={[0, 0]} />
      <Arrow from={[264, 168]} to={[292, 168]} w={4} head={0.6} />
      <Arrow from={[292, 168]} to={[264, 168]} w={4} head={0.6} />
      <path d="M264 140V176M292 140V176" stroke={K.ink} stroke-width={1.4} stroke-dasharray="3 3" />
    </Scene2>
  ),

  'sf-yp-test-dusurme': () => {
    const gy = 206, hand: P = [196, 146];
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <OG sh={[{ d: rrect(150, gy - 4, 120, 16, 3), f: M.tas }]} />
        <Person {...USTA} x={150} y={226} s={1.0} pose={{ ...POSE.standSide, spine: -86, armF: { to: hand }, armB: [96, 96], handF: 'mitten' }} />
        <OG sh={[{ d: rrect(hand[0] + 4, hand[1] - 6, 26, 15, 2), f: M.kerpic }]} />
        <Arrow from={[217, 168]} to={[217, 196]} w={5} />
        <Dim a={[284, gy - 4]} b={[284, hand[1] + 9]} text="60 cm" size={12} off={[0, 0]} />
      </Scene2>
    );
  },

  /* ─────────── Kerpiç 1 ─────────── */
  'sf-yp-kerpic-cigneme': () => {
    const gy = 206;
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={gy}>
        <Person {...YARD} x={252} y={210} s={0.95} flip pose={{ ...POSE.standSide, spine: -84, armF: { to: [214, 140] }, armB: { to: [228, 124] } }} />
        <g transform="rotate(-62 214 140)"><Bucket x={214} y={150} s={0.9} /></g>
        <Drop x={190} y={168} s={0.9} />
        <Drop x={196} y={186} s={0.8} />
        <OG sh={[{ d: ell([140, 222], 112, 14), f: M.camur }]} />
        <Dots x={50} y={214} w={170} h={14} color={shade(M.camur, 0.3)} n={20} rmax={2.5} />
        <Person {...USTA} x={110} y={226} s={1.0} bottom="shorts" pose={{ ...POSE.walk, legF: [50, 100], legB: [110, 96], armF: [70, 40], armB: [110, 120] }} />
        <path d="M44 226Q140 216 236 226Q140 236 44 226Z" fill={M.camur} stroke={K.out} stroke-width={1.5} />
      </Scene2>
    );
  },

  'sf-yp-kerpic-saman': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M0 150Q160 136 320 150V240H0Z', f: M.camur }]} />
      <Dots x={10} y={160} w={300} h={70} color={shade(M.camur, 0.25)} n={40} rmax={3} />
      <StrawBits x={40} y={150} w={200} h={40} n={30} seed={5} />
      <StrawBits x={110} y={100} w={70} h={44} n={12} seed={9} />
      <Hand x={196} y={30} a={-150} s={1.2} pose="open" side="R" arm={160} sleeve={K.role.helper} skin={USTA_SKIN} />
      <OG sh={[{ d: 'M250 150L300 90L314 98L270 156Z', f: M.saman }]} />
      <StrawBits x={252} y={96} w={56} h={56} n={14} seed={2} color={shade(M.saman, 0.15)} />
    </Scene2>
  ),

  'sf-yp-kerpic-kivam': () => (
    <Scene2 bg="closeup">
      <Hand x={150} y={262} a={0} s={2.1} pose="open" side="R" view="palm" arm={40} sleeve={K.role.helper} skin={USTA_SKIN} />
      <OG sh={[{ d: smooth([[112, 176], [140, 160], [178, 162], [196, 180], [182, 200], [140, 204], [116, 196]], true), f: M.camur }]} />
      {[134, 152, 170].map((x) => <path key={x} d={`M${x} 166Q${x + 4} 182 ${x} 198`} stroke={shade(M.camur, 0.35)} stroke-width={2} fill="none" />)}
      <Ok x={252} y={70} r={18} />
    </Scene2>
  ),

  /* ─────────── Kerpiç 2 ─────────── */
  'sf-yp-kerpic-kalip': () => (
    <Scene2 bg="closeup">
      {/* üstten iki gözlü kalıp; her göz 30 × 25 cm → 110 × 92 birim. İki ölçü de AYNI gözün iç kenarlarında. */}
      <OG sh={[{ d: box(35, 64, 250, 112) + box(45, 74, 110, 92) + box(165, 74, 110, 92), f: M.odun, fr: 'evenodd' }, { d: rrect(10, 104, 27, 32, 4), f: M.odun }, { d: rrect(283, 104, 27, 32, 4), f: M.odun }]} />
      <rect x={45} y={74} width={110} height={92} fill={K.dirt} />
      <rect x={165} y={74} width={110} height={92} fill={K.dirt} />
      <path d="M45 74h110v92h-110z" fill="none" stroke={K.out} stroke-width={1.2} />
      <path d="M165 74h110v92h-110z" fill="none" stroke={K.out} stroke-width={1.2} />
      <Dim a={[46, 92]} b={[154, 92]} text="30 cm" size={12} />
      <Dim a={[72, 75]} b={[72, 165]} text="25 cm" size={12} off={[0, 22]} />
    </Scene2>
  ),

  'sf-yp-kerpic-cekme': () => (
    <Scene2 bg="closeup">
      <rect x={0} y={196} width={320} height={44} fill={K.dirt} />
      <StrawBits x={0} y={196} w={320} h={10} n={20} seed={11} />
      {/* ıslak kerpiç */}
      <OG sh={[{ d: rrect(96, 152, 128, 46, 3), f: M.camur }, { d: box(96, 186, 128, 12), f: shade(M.camur, 0.15), no: true }]} />
      {/* kaldırılan kalıp */}
      <OG sh={[{ d: box(88, 84, 144, 50) + box(98, 90, 124, 44), f: M.odun, fr: 'evenodd' }, { d: rrect(62, 94, 28, 18, 4), f: M.odun }, { d: rrect(230, 94, 28, 18, 4), f: M.odun }]} />
      <Hand x={70} y={68} a={170} s={0.85} pose="fist" side="L" arm={110} sleeve={K.role.helper} skin={USTA_SKIN} />
      <Hand x={250} y={68} a={-170} s={0.85} pose="fist" side="R" arm={110} sleeve={K.role.helper} skin={USTA_SKIN} />
      <Arrow from={[160, 74]} to={[160, 22]} w={6} />
    </Scene2>
  ),

  'sf-yp-kerpic-dikine': () => (
    <Scene2 bg="outdoor" ground="dirt" gy={150}>
      <Sun x={270} y={40} r={15} />
      {[0, 1].map((r) => {
        const y = r ? 168 : 216, s = r ? 0.75 : 1;
        return Array.from({ length: r ? 12 : 9 }, (_, i) => {
          const x = (r ? 24 : 20) + i * (r ? 24 : 32);
          return <OG key={r + '-' + i} sh={[{ d: rrect(x, y - 40 * s, 16 * s, 40 * s, 2), f: M.kerpic }, { d: box(x + 10 * s, y - 40 * s, 6 * s, 40 * s), f: shade(M.kerpic, 0.15), no: true }]} />;
        });
      })}
      <Label x={70} y={60} text="10 gün" size={16} />
    </Scene2>
  ),
  /* ─────────── Kerpiç duvar ─────────── */
  'sf-yp-kerpic-kalinlik': () => {
    // üstten kesit, 1 cm = 2 birim. Dış duvar: 30'luk kerpiç enine + 15'lik kerpiç = 47 cm (94 birim). İç duvar 30 cm.
    const sh: Sh[] = [{ d: box(10, 40, 300, 94) + box(140, 134, 60, 106), f: M.harc }];
    for (let x = 12; x < 308; x += 53) sh.push({ d: rrect(x, 42, Math.min(50, 308 - x), 58, 1.5), f: M.kerpic, no: true });
    for (let x = 30; x < 308; x += 63) sh.push({ d: rrect(Math.max(12, x - 30), 104, Math.min(60, 308 - Math.max(12, x - 30)), 28, 1.5), f: shade(M.kerpic, 0.06), no: true });
    for (let y = 137; y < 240; y += 53) sh.push({ d: rrect(142, y, 56, 50, 1.5), f: M.kerpic, no: true });
    return (
      <Scene2 bg="closeup">
        <OG sh={sh} />
        <T x={70} y={20} text="dış duvar" size={13} />
        <T x={252} y={190} text="iç duvar" size={13} />
        <Dim a={[294, 40]} b={[294, 134]} text="47 cm" size={12} off={[-6, 0]} />
        <Dim a={[140, 222]} b={[200, 222]} text="30 cm" size={12} />
      </Scene2>
    );
  },

  'sf-yp-kerpic-sasirtma': () => (
    <Scene2 bg="outdoor" ground="dirt" gy={210}>
      <AdobeRows x={20} y={50} w={180} h={160} bw={48} bh={20} />
      <Ok x={110} y={30} r={15} />
      <AdobeRows x={222} y={110} w={84} h={100} bw={42} bh={20} offset={false} />
      <path d="M264 110V210" stroke={K.danger} stroke-width={3} />
      <Bad x={264} y={92} r={14} />
    </Scene2>
  ),

  'sf-yp-kerpic-hatil': () => {
    const o: Obl = { ox: 24, oy: 186, dx: 66, dy: -44 };
    const L = 228;
    const back = prism(o, 0, L, 0.8, 1, 0, 19, M.odun);
    const front = prism(o, 0, L, 0, 0.2, 0, 19, M.odun);
    const cross = [0, 57, 114, 171, L - 12].map((u) => prism(o, u, u + 12, 0, 1, 19, 27, shade(M.odun, 0.06)));
    const wall = prism(o, 0, L, 0, 1, -200, 0, M.kerpic, 'ts');
    return (
      <Scene2 bg="outdoor">
        <OG sh={wall} />
        <AdobeRows x={24} y={186} w={L} h={60} bw={38} bh={16} />
        <OG sh={back} />
        {Array.from({ length: 16 }, (_, i) => <OG key={i} sh={[{ d: ell(op(o, 8 + i * 14, 0.5, 14), 7, 5), f: i % 2 ? M.tas : shade(M.tas, 0.12) }]} ow={1} />)}
        <OG sh={front} />
        {cross.map((c, i) => <OG key={i} sh={c} />)}
        <Dim a={op(o, 6, 0, 36)} b={op(o, 63, 0, 36)} text="50 cm" size={12} off={[-2, -14]} />
      </Scene2>
    );
  },

  /* ─────────── Yığma toprak (cob) ─────────── */
  'sf-yp-cob-topak': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M30 240V160Q90 150 160 156T290 160V240Z', f: M.camur }]} />
      <StrawBits x={40} y={170} w={240} h={60} n={30} seed={3} />
      <OG sh={[{ d: smooth([[110, 160], [130, 122], [160, 112], [196, 120], [214, 156], [190, 168], [134, 168]], true), f: tint(M.camur, 0.08) }]} />
      <StrawBits x={124} y={124} w={80} h={36} n={10} seed={7} />
      <Hand x={70} y={60} a={120} s={1.0} pose="press" side="L" arm={120} sleeve={K.role.helper} skin={USTA_SKIN} />
      <Hand x={254} y={60} a={-120} s={1.0} pose="press" side="R" arm={120} sleeve={K.role.helper} skin={USTA_SKIN} />
      <Arrow from={[162, 30]} to={[162, 96]} w={6} />
    </Scene2>
  ),

  'sf-yp-cob-kat': () => {
    const gy = 206;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy} width={320} height={34} fill={M.toprak} />
        <StoneWall x={100} y={146} w={100} h={94} rows={6} seed={17} />
        <OG sh={[{ d: 'M104 146V70Q150 62 196 70V146Z', f: M.camur }]} />
        <StrawBits x={108} y={76} w={86} h={66} n={22} seed={12} />
        {/* naylon örtü */}
        <OG sh={[{ d: 'M92 82Q96 62 150 58Q204 62 208 82L212 100L202 96L198 76Q150 70 102 76L98 98L88 102Z', f: M.naylon }]} />
        <Dim a={[230, 146]} b={[230, 66]} text="60 cm" off={[26, 0]} />
        <Timer x={36} y={44} text="1 gün" />
      </Scene2>
    );
  },

  'sf-yp-cob-kasa': () => (
    <Scene2 bg="outdoor" gy={206}>
      <StoneWall x={14} y={176} w={292} h={30} rows={2} seed={23} />
      <OG sh={[{ d: 'M14 176V96Q60 88 100 98L100 176ZM220 176V100Q262 90 306 96V176Z', f: M.camur }, { d: box(100, 128, 120, 48), f: M.camur }]} />
      <StrawBits x={20} y={104} w={280} h={68} n={40} seed={21} />
      {/* tahta pencere kasası */}
      <OG sh={[{ d: box(104, 60, 112, 72) + box(114, 70, 92, 52), f: M.odun, fr: 'evenodd' }]} />
      <path d="M160 70V122" stroke={K.out} stroke-width={1.5} />
    </Scene2>
  ),

  /* ─────────── Sıkıştırma toprak ─────────── */
  'sf-yp-sikistirma-avuc': () => (
    <Scene2 bg="closeup">
      <Hand x={150} y={262} a={0} s={2.1} pose="open" side="R" view="palm" arm={40} sleeve={K.role.helper} skin={USTA_SKIN} />
      <OG sh={[{ d: smooth([[112, 176], [140, 160], [178, 162], [196, 180], [182, 200], [140, 204], [116, 196]], true), f: '#a98458' }]} />
      {[134, 152, 170].map((x) => <path key={x} d={`M${x} 166Q${x + 4} 182 ${x} 198`} stroke={shade('#a98458', 0.35)} stroke-width={2} fill="none" />)}
      <path d="M128 172Q146 164 166 168" stroke="#fff" stroke-width={3} opacity={0.7} fill="none" stroke-linecap="round" />
      <Ok x={252} y={70} r={18} />
    </Scene2>
  ),

  'sf-yp-sikistirma-tokmak': () => {
    // kalıp kesiti: solda gevşek 10 cm kat, sağda dövülmüş 5 cm
    const lx = 40, rx = 280;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: box(lx + 14, 150, rx - lx - 28, 90), f: '#b0895c' }]} />
        {[166, 182, 198, 214, 230].map((y) => <path key={y} d={`M${lx + 14} ${y}H${rx - 14}`} stroke={shade('#b0895c', 0.25)} stroke-width={1.4} />)}
        <OG sh={[{ d: box(lx + 14, 110, 110, 40), f: '#c9a77a' }, { d: box(lx + 124, 130, rx - lx - 138, 20), f: '#ad875a' }]} />
        <Dots x={lx + 16} y={112} w={106} h={36} color={shade('#c9a77a', 0.3)} n={40} rmax={2.2} />
        <OG sh={[{ d: box(lx, 40, 14, 200), f: M.odun }, { d: box(rx - 14, 40, 14, 200), f: M.odun }]} />
        <Tamper x={226} y={130} len={130} a={-90} />
        <Arrow from={[262, 56]} to={[262, 104]} w={5} />
        <Dim a={[lx + 30, 110]} b={[lx + 30, 150]} text="10 cm" size={12} off={[28, 0]} />
        <Dim a={[lx + 140, 130]} b={[lx + 140, 150]} text="5 cm" size={12} off={[-2, -26]} />
      </Scene2>
    );
  },

  'sf-yp-sikistirma-hatil': () => {
    // tek duvar parçası (eğik görünüş): köşelerde ve pencere kenarlarında dikme, üstte kesintisiz hatıl
    const o: Obl = { ox: 24, oy: 212, dx: 60, dy: -36 };
    const U = 210, H = 132, V = 0.42;
    const earth = '#b98e62';
    const wall = prism(o, 0, U, 0, V, 16, H, earth, 'fs');
    const posts = [0, 80, 128, U - 9].map((u) => prism(o, u, u + 9, -0.03, 0.06, 16, H, M.odun, 'fs'));
    const band = prism(o, -3, U + 3, -0.04, V + 0.04, H, H + 11, M.odun);
    const win = poly([op(o, 89, 0, 56), op(o, 128, 0, 56), op(o, 128, 0, 104), op(o, 89, 0, 104)]);
    return (
      <Scene2 bg="outdoor">
        <OG sh={prism(o, 0, U, 0, V, 0, 16, M.tas, 'fs')} />
        <OG sh={wall} />
        {[36, 56, 76, 96, 116].map((w) => <path key={w} d={`M${op(o, 0, 0, w).join(' ')}L${op(o, U, 0, w).join(' ')}L${op(o, U, V, w).join(' ')}`} stroke={shade(earth, 0.25)} stroke-width={1.3} fill="none" />)}
        <OG sh={[{ d: win, f: M.cam }]} />
        {posts.map((p, i) => <OG key={i} sh={p} />)}
        <OG sh={band} />
      </Scene2>
    );
  },

  /* ─────────── Dal örgü ─────────── */
  'sf-yp-dal-cubuk': () => (
    <Scene2 bg="outdoor">
      <OG sh={[{ d: box(20, 30, 22, 186), f: M.odun }, { d: box(278, 30, 22, 186), f: M.odun }, { d: box(20, 30, 280, 18), f: M.odun }, { d: box(20, 196, 280, 20), f: M.odun }]} />
      {[66, 98, 130, 162, 194, 226, 258].map((x) => <OG key={x} sh={[{ d: rrect(x - 3, 40, 6, 162, 3), f: tint(M.odun, 0.25) }]} />)}
      <path d="M42 200H278" stroke={shade(M.odun, 0.4)} stroke-width={3} />
    </Scene2>
  ),

  'sf-yp-dal-orme': () => {
    const xs = [56, 96, 136, 176, 216, 256];
    const row = (y: number, k: number, x1 = 300) => {
      const pts: P[] = [[20, y]];
      xs.forEach((x, i) => pts.push([x, y + ((i + k) % 2 ? 5 : -5)]));
      pts.push([x1, y]);
      return pts;
    };
    return (
      <Scene2 bg="outdoor">
        {xs.map((x) => <OG key={x} sh={[{ d: rrect(x - 4, 20, 8, 200, 4), f: tint(M.odun, 0.2) }]} />)}
        {[200, 186, 172, 158, 144, 130].map((y, i) => (
          <g key={y}>
            <path d={smooth(row(y, i))} stroke={K.out} stroke-width={9} fill="none" stroke-linecap="round" />
            <path d={smooth(row(y, i))} stroke="#8c6b3e" stroke-width={6} fill="none" stroke-linecap="round" />
          </g>
        ))}
        {xs.map((x, i) => (i % 2 ? <OG key={'f' + x} sh={[{ d: rrect(x - 4, 120, 8, 100, 4), f: tint(M.odun, 0.2) }]} /> : null))}
        {/* örülen yeni dal */}
        <path d={smooth([[20, 110], [56, 116], [96, 104], [136, 116], [160, 112]])} stroke={K.out} stroke-width={9} fill="none" stroke-linecap="round" />
        <path d={smooth([[20, 110], [56, 116], [96, 104], [136, 116], [160, 112]])} stroke="#7aa04a" stroke-width={6} fill="none" stroke-linecap="round" />
        {[56, 136].map((x) => <OG key={'g' + x} sh={[{ d: rrect(x - 4, 96, 8, 30, 4), f: tint(M.odun, 0.2) }]} />)}
        <Arrow from={[166, 112]} to={[200, 100]} bend={0.35} w={5} />
        <Arrow from={[210, 98]} to={[244, 116]} bend={0.35} w={5} />
      </Scene2>
    );
  },

  'sf-yp-dal-sivama': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <OG sh={[{ d: box(150, 30, 20, 186), f: M.camur }]} />
      {Array.from({ length: 12 }, (_, i) => <OG key={i} sh={[{ d: ell([i % 2 ? 163 : 157, 40 + i * 15], 5, 5), f: '#8c6b3e' }]} ow={1} />)}
      <OG sh={[{ d: box(156, 30, 8, 186), f: tint(M.odun, 0.2) }]} />
      <OG sh={[{ d: box(140, 110, 12, 106), f: M.camur }, { d: box(168, 130, 12, 86), f: M.camur }]} />
      <Person {...USTA} x={86} y={226} s={0.98} pose={{ ...POSE.standSide, spine: -82, armF: { to: [138, 126] }, armB: { to: [138, 108] }, handF: { shape: 'flat', a: -90 }, handB: { shape: 'flat', a: -90 } }} />
      <Person {...YARD} x={234} y={226} s={0.95} flip pose={{ ...POSE.standSide, spine: -84, armF: { to: [182, 140] }, armB: { to: [182, 122] }, handF: { shape: 'flat', a: -90 }, handB: { shape: 'flat', a: -90 } }} />
      <Arrow from={[96, 70]} to={[136, 70]} w={5} />
      <Arrow from={[224, 70]} to={[184, 70]} w={5} />
    </Scene2>
  ),

  /* ─────────── Sıva ─────────── */
  'sf-yp-siva-kaba': () => (
    <Scene2 bg="closeup">
      <AdobeRows x={0} y={0} w={320} h={240} bw={64} bh={30} />
      <OG sh={[{ d: smooth([[0, 70], [80, 60], [170, 84], [214, 140], [190, 210], [120, 240], [0, 240]], true), f: M.camur }]} />
      <Dots x={10} y={90} w={180} h={140} color={shade(M.camur, 0.3)} n={60} rmax={2.5} />
      <StrawBits x={10} y={90} w={180} h={140} n={30} seed={13} />
      <Hand x={250} y={250} a={-40} s={1.5} pose="press" side="R" arm={80} sleeve={K.role.helper} skin={USTA_SKIN} />
    </Scene2>
  ),

  'sf-yp-siva-kirec': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: 'M60 170H260L246 222H74Z', f: '#8d6a4c' }, { d: ell([160, 170], 100, 10), f: '#d9cdb3', ln: true }]} />
      <Bucket x={50} y={120} s={0.95} fill={M.kirec} color="#9aa3ad" />
      {[130, 190, 250].map((x) => <Bucket key={x} x={x} y={120} s={0.95} fill={M.kum} color="#9aa3ad" />)}
      <T x={50} y={136} text="kireç" size={12} />
      <T x={190} y={136} text="kum" size={12} />
      <Label x={160} y={36} text="1 : 3" size={20} />
    </Scene2>
  ),

  'sf-yp-siva-nemleme': () => {
    const hand: P = [196, 128];
    return (
      <Scene2 bg="outdoor" gy={214}>
        <Sun x={40} y={36} r={14} />
        <OG sh={[{ d: box(236, 50, 84, 164), f: M.kirec }]} />
        <OG sh={[{ d: poly([[212, 40], [320, 34], [320, 46], [212, 50]]), f: M.saman }]} />
        <StrawBits x={216} y={36} w={100} h={12} n={14} seed={4} color={shade(M.saman, 0.25)} />
        <Person {...USTA} x={130} y={226} s={1.0} pose={{ ...POSE.standSide, armF: { to: hand }, armB: { to: [118, 160] } }} />
        <Bucket x={106} y={228} s={0.8} />
        {[[214, 116], [222, 128], [216, 140], [228, 112], [230, 136]].map(([x, y], i) => <Drop key={i} x={x} y={y} s={0.55} />)}
      </Scene2>
    );
  },

  /* ─────────── Gömük ev ─────────── */
  'sf-yp-gomuk-set': () => {
    const gy = 196;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <Sun x={292} y={36} r={14} />
        <StoneWall x={80} y={86} w={150} h={110} rows={6} seed={29} />
        <OG sh={[{ d: poly([[70, 90], [160, 62], [250, 90]]), f: M.sindil }]} />
        <OG sh={[{ d: box(202, 112, 28, 40), f: M.cam }]} />
        {/* kuzeyde toprak set */}
        <OG sh={[{ d: `M0 ${gy}Q40 ${gy - 30} 80 96V${gy}Z`, f: M.toprak }, { d: `M0 ${gy - 2}Q40 ${gy - 32} 80 94`, st: K.grass, sw: 5 }]} />
        <rect x={0} y={gy} width={320} height={44} fill={M.toprak} />
        <Ok x={156} y={160} r={15} />
      </Scene2>
    );
  },

  'sf-yp-gomuk-tonoz': () => (
    <Scene2 bg="outdoor" gy={200}>
      {/* doğru: taş tonoz, ince toprak */}
      <OG sh={[{ d: 'M14 200V118Q80 40 146 118V200H134V122Q80 62 26 122V200Z', f: M.tas }]} />
      <OG sh={[{ d: 'M8 118Q80 30 152 118L146 118Q80 40 14 118Z', f: M.toprakUst }]} />
      <path d="M10 114Q80 32 150 114" stroke={K.grass} stroke-width={4} fill="none" />
      <rect x={26} y={150} width={108} height={50} fill="#efe4cf" />
      <Ok x={80} y={170} r={15} />
      {/* yanlış: düz tahta tavan, kalın toprak */}
      <rect x={160} y={0} width={4} height={240} fill="#fff" />
      <OG sh={[{ d: box(186, 110, 12, 90) + box(282, 110, 12, 90), f: M.tas }, { d: box(180, 102, 120, 8), f: M.odun }, { d: 'M176 102V70Q240 52 304 70V102Z', f: M.toprakUst }]} />
      <path d="M176 70Q240 50 304 70" stroke={K.grass} stroke-width={4} fill="none" />
      <Arrow from={[214, 8]} to={[214, 46]} w={6} color={K.danger} />
      <Arrow from={[266, 8]} to={[266, 46]} w={6} color={K.danger} />
      <rect x={198} y={110} width={84} height={90} fill="#efe4cf" />
      <Bad x={240} y={160} r={15} />
    </Scene2>
  ),

  'sf-yp-gomuk-hava': () => {
    const gy = 196;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <OG sh={[{ d: `M0 ${gy}V100Q60 90 110 78H230Q280 90 320 100V${gy}Z`, f: M.toprak }, { d: `M0 98Q60 88 110 76H230Q280 88 320 98`, st: K.grass, sw: 5 }]} />
        <OG sh={[{ d: box(70, 110, 180, 86), f: '#efe4cf' }]} />
        <rect x={70} y={196} width={180} height={44} fill={M.toprak} />
        <OG sh={[{ d: box(80, 40, 18, 72), f: M.tas }, { d: box(222, 26, 18, 86), f: M.tas }]} />
        <Arrow from={[89, 30]} to={[89, 150]} w={5} />
        <Arrow from={[100, 170]} to={[214, 150]} bend={0.15} w={5} />
        <Arrow from={[231, 120]} to={[231, 8]} w={5} />
      </Scene2>
    );
  },

  /* ─────────── Kütük seçme ─────────── */
  'sf-yp-kutuk-agac': () => (
    <Scene2 bg="outdoor" ground="snow" gy={206}>
      {/* düz gövdeli çam */}
      <OG sh={[{ d: poly([[86, 206], [90, 40], [96, 40], [102, 206]]), f: K.trunk }]} />
      <OG sh={[{ d: 'M93 12L66 64H120Z', f: K.pine }, { d: 'M93 34L60 92H126Z', f: K.pine }]} />
      <Ok x={130} y={150} r={16} />
      {/* eğri, çok dallı ağaç */}
      <OG sh={[{ d: 'M218 206Q210 160 232 130Q250 104 236 70L244 68Q262 106 240 134Q222 160 230 206Z', f: K.trunk }, { d: 'M228 150L196 122L200 118L232 142ZM238 120L270 98L273 103L240 128ZM226 172L196 160L198 155L228 166Z', f: K.trunk }]} />
      <OG sh={[{ d: circ([240, 62], 22), f: K.leaf }, { d: circ([196, 116], 14), f: K.leaf }, { d: circ([272, 96], 14), f: K.leaf }]} />
      <Bad x={286} y={150} r={16} />
    </Scene2>
  ),

  'sf-yp-kutuk-soyma': () => {
    const cy = 150, r = 22;
    return (
      <Scene2 bg="outdoor" gy={210}>
        {[150, 260].map((x) => <OG key={x} sh={[{ d: poly([[x - 22, 212], [x - 6, cy + r], [x + 6, cy + r], [x + 22, 212], [x + 14, 212], [x, cy + r + 10], [x - 14, 212]]), f: M.odun }]} />)}
        <LogSide x1={90} x2={312} cy={cy} r={r} end="none" />
        <OG sh={[{ d: rrect(196, cy - r, 116, 2 * r, 6), f: M.kabuk }]} />
        <OG sh={[{ d: 'M196 128Q186 104 170 108Q180 116 190 132Z', f: M.kabuk }]} />
        {/* soyma bıçağı */}
        <OG sh={[{ d: box(176, 122, 30, 5), f: '#c9d0d8' }, { d: rrect(168, 112, 8, 20, 3), f: M.odun }]} />
        <Person {...USTA} x={70} y={228} s={1.0} pose={{ ...POSE.standSide, spine: -74, chest: -64, head: -66, legB: [104, 92], legF: [74, 96], armF: { to: [172, 124] }, armB: { to: [170, 116] }, handF: 'fist', handB: 'fist' }} />
        <Arrow from={[230, 96]} to={[190, 96]} w={5} />
      </Scene2>
    );
  },

  'sf-yp-kutuk-istif': () => (
    <Scene2 bg="outdoor" gy={212}>
      <OG sh={[{ d: box(36, 70, 8, 142) + box(276, 70, 8, 142), f: M.odun }, { d: poly([[20, 74], [160, 50], [300, 74], [300, 82], [160, 58], [20, 82]]), f: '#5d7d8f' }]} />
      {[60, 260].map((x) => <OG key={x} sh={[{ d: box(x - 16, 178, 32, 34), f: M.tas }, { d: box(30, 170, 260, 8), f: M.odun }]} />)}
      {[56, 108, 160, 212, 264].map((x) => <LogEnd key={x} cx={x} cy={148} r={21} />)}
      <Label x={160} y={104} text="6 ay" size={16} />
    </Scene2>
  ),

  /* ─────────── Köşe geçme ─────────── */
  'sf-yp-gecme-pergel': () => {
    const c: P = [160, 186], R = 40;
    const uy = 112, ur = 32; // üst kütük merkezi ve yarıçapı
    const arcY = (x: number) => c[1] - R - Math.sqrt(Math.max(0, R * R - (x - c[0]) ** 2)) + R; // R yukarı kaydırılmış daire üst yayı
    const pts: P[] = [];
    for (let x = c[0] - 38; x <= c[0] + 38; x += 4) pts.push([x, arcY(x) - R + R]);
    const tipL: P = [196, c[1] - Math.sqrt(R * R - 36 * 36)];
    const tipU: P = [196, tipL[1] - R];
    const hinge: P = [262, 40];
    return (
      <Scene2 bg="closeup">
        <LogEnd cx={c[0]} cy={c[1]} r={R} bark={false} />
        <LogSide x1={20} x2={300} cy={uy} r={ur} end="none" />
        <path d={smooth(pts.map(([x]) => [x, c[1] - R - Math.sqrt(Math.max(0, R * R - (x - c[0]) ** 2))] as P))} stroke={K.action} stroke-width={3.4} fill="none" stroke-dasharray="6 4" />
        <path d={`M${c[0]} ${c[1]}L${c[0] - R} ${c[1]}`} stroke={K.ink} stroke-width={1.6} stroke-dasharray="3 3" />
        <T x={c[0] - 20} y={c[1] + 10} text="r" size={14} />
        <g stroke-linecap="round">
          <path d={`M${hinge[0]} ${hinge[1]}L${tipU[0]} ${tipU[1]}M${hinge[0]} ${hinge[1]}L${tipL[0]} ${tipL[1]}`} stroke={K.out} stroke-width={6} />
          <path d={`M${hinge[0]} ${hinge[1]}L${tipU[0]} ${tipU[1]}M${hinge[0]} ${hinge[1]}L${tipL[0]} ${tipL[1]}`} stroke="#a3adb8" stroke-width={3.5} />
          <circle cx={hinge[0]} cy={hinge[1]} r={6} fill="#a3adb8" stroke={K.out} stroke-width={1.5} />
        </g>
        <Dim a={[214, tipU[1]]} b={[214, tipL[1]]} text="r" size={12} off={[14, 0]} />
      </Scene2>
    );
  },

  'sf-yp-gecme-oyma': () => {
    const c: P = [130, 166], R = 40, uy = 104, ur = 34;
    // üst kütüğün alt yüzünde alt kütüğe oturan yarım ay oyuk
    const half = Math.sqrt(R * R - (uy + ur - c[1]) ** 2);
    const notch: P[] = [];
    for (let x = c[0] - half; x <= c[0] + half + 0.1; x += 4) notch.push([x, c[1] - Math.sqrt(Math.max(0, R * R - (x - c[0]) ** 2))]);
    const upper = `M30 ${uy - ur}H230V${uy + ur}H${c[0] + half}` + notch.reverse().map((p) => `L${p[0]} ${p[1]}`).join('') + `L${c[0] - half} ${uy + ur}H30Z`;
    return (
      <Scene2 bg="closeup">
        <LogEnd cx={c[0]} cy={c[1]} r={R} />
        <OG sh={[{ d: upper, f: M.soyuk }, { d: box(32, uy + 8, 196, 12), f: shade(M.soyuk, 0.1), no: true }]} />
        <path d={smooth(notch.map((p) => [p[0], p[1] - 0.5] as P))} stroke={K.action} stroke-width={3} fill="none" />
        <Ok x={130} y={40} r={15} />
        {/* yanlış: oyuk alttaki kütüğün üstünde, su toplar */}
        <rect x={244} y={0} width={4} height={240} fill="#fff" />
        <OG sh={[{ d: 'M256 170A28 28 0 1 0 312 170L300 150Q284 172 268 150Z', f: '#e8c896' }, { d: 'M268 150Q284 172 300 150Z', f: K.water }]} />
        <Drop x={284} y={130} s={0.9} />
        <Bad x={284} y={102} r={14} />
      </Scene2>
    );
  },

  'sf-yp-gecme-oturma': () => {
    const logs = Array.from({ length: 9 }, (_, i) => 206 - i * 22);
    return (
      <Scene2 bg="outdoor" gy={218}>
        <StoneWall x={10} y={218} w={300} h={22} rows={1} seed={33} />
        {logs.map((y) => <LogSide key={y} x1={10} x2={310} cy={y} r={11} end="none" />)}
        {/* kapı açıklığı */}
        <rect x={120} y={40} width={80} height={178} fill="#efe4cf" />
        <OG sh={[{ d: box(120, 74, 12, 144) + box(188, 74, 12, 144) + box(120, 74, 80, 12), f: M.odun }]} />
        <OG sh={[{ d: rrect(132, 86, 56, 132, 1), f: '#7a5236' }]} />
        <LogSide x1={10} x2={310} cy={40} r={11} end="none" />
        <rect x={120} y={51} width={80} height={23} fill="#f6efe0" />
        <Dim a={[214, 51]} b={[214, 74]} text="6–10 cm" size={12} off={[40, 0]} />
      </Scene2>
    );
  },
};
