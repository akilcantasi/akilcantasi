// Sıfırdan paketi sahneleri (a): Onarım ve teknik. Bkz. docs/agents/SIFIRDAN_CIZIM.md
import type { ComponentChildren, JSX } from 'preact';
import {
  Scene2, Person, POSE, K, OG, Arrow, Label, Ok, Bad, No, Hand, Tree, Waves, Timer, Rock, Table, Window, Chair,
  smooth, capsule, rrect, ell, circ, shade, tint, rig, handPoint,
} from '../../../src/art/kit2';
import type { PersonProps, P } from '../../../src/art/kit2';

/* ═══════════════ Oyuncu kadrosu (rehber içinde aynı kişi) ═══════════════ */
const CAST = {
  /** sap, eğe, pas, zincir-rulman: Rıza usta */
  riza: { who: 'man', role: 'helper', skin: 1, hair: 'short', hairC: K.hair.dark, mustache: true, bottomC: K.pants.khaki, sleeve: 'long' } as const,
  /** ayakkabı, çanta, yapıştırma: Zeynep (çoğu yakın plan el) */
  zeynep: { who: 'woman', role: 'bystander', skin: 2, hair: 'bun', hairC: K.hair.black, bottomC: K.pants.navy, sleeve: 'long' } as const,
  /** cihaz arızası 1–2: Emre */
  emre: { who: 'man', role: 'bystander2', skin: 0, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.grey, sleeve: 'long' } as const,
  /** kristal radyo, anten: Selin */
  selin: { who: 'woman', role: 'bystander3', skin: 1, hair: 'ponytail', hairC: K.hair.auburn, bottomC: K.pants.denim, sleeve: 'long' } as const,
  /** yelken, kıyı: Kemal ve kızı Ela */
  kemal: { who: 'man', role: 'helper', skin: 2, hair: 'short', hairC: K.hair.black, bottomC: K.pants.dark } as const,
  ela: { who: 'girl', role: 'bystander4', skin: 2, hair: 'ponytail', hairC: K.hair.black } as const,
};
/** el yakın planları için ten ve kol rengi */
const HAND = {
  riza: { skin: 1, sleeve: K.role.helper },
  zeynep: { skin: 2, sleeve: K.role.bystander },
  emre: { skin: 0, sleeve: K.role.bystander2 },
  selin: { skin: 1, sleeve: K.role.bystander3 },
} as const;

/* ═══════════════ Paket malzeme renkleri ═══════════════ */
const WOOD = K.wood; // ahşap (sap, tezgâh, takoz)
const WOOD2 = '#d6a46e'; // açık ahşap (yeni sap, kama)
const STEEL = '#8f9aa6'; // çelik / demir
const STEEL_L = '#c9d1d9'; // parlak (bilenmiş, temiz) çelik
const RUST = '#b4583a'; // pas
const COPPER = '#c8743a'; // bakır tel
const ROPE = '#d9b36c';
const PLASTIC_B = '#4f86c6'; // mavi plastik
const RUBBER = '#3b3537';
const VEST = '#ff7a1a'; // can yeleği
const SAND = '#d9bd84';
const SEA = '#3a9be0';
const SEA_D = '#2c7fbf';

/* ═══════════════ Yardımcılar ═══════════════ */
const f1 = (n: number) => Math.round(n * 10) / 10;
const pl = (pts: P[]) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
const rad = (a: number) => (a * Math.PI) / 180;
const onC = (c: P, r: number, a: number): P => [c[0] + r * Math.cos(rad(a)), c[1] + r * Math.sin(rad(a))];
const tr = (x: number, y: number, s = 1, a = 0) => `translate(${f1(x)} ${f1(y)}) rotate(${f1(a)}) scale(${s})`;

/** Dış hatlı çizgi (ip, kablo, tel, çubuk) */
function Ln({ d, c, w = 4, dash, out = true, op }: { d: string; c: string; w?: number; dash?: string; out?: boolean; op?: number }) {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity={op}>
      {out && <path d={d} stroke={K.out} stroke-width={w + 3} />}
      <path d={d} stroke={c} stroke-width={w} stroke-dasharray={dash} />
    </g>
  );
}
/** Düz yazı (beyaz haleli) */
function T({ x, y, t, s = 13, c = K.ink, a = 'middle', w = 700 }: { x: number; y: number; t: string; s?: number; c?: string; a?: 'start' | 'middle' | 'end'; w?: number }) {
  return (
    <text x={x} y={y} font-size={s} font-weight={w} fill={c} text-anchor={a} stroke="#fff" stroke-width={3.2} paint-order="stroke" stroke-linejoin="round" font-family="'IBM Plex Sans', system-ui, sans-serif">
      {t}
    </text>
  );
}
/** Yay ok: merkez c, yarıçap r, a0'dan a1'e (derece; a1 > a0 saat yönü) */
function ArcArrow({ c, r, a0, a1, color = K.action, w = 5 }: { c: P; r: number; a0: number; a1: number; color?: string; w?: number }) {
  const dir = a1 > a0 ? 1 : -1;
  const hl = w * 2.3 + 4;
  const aEnd = a1 - dir * ((hl * 0.6) / r) * (180 / Math.PI);
  const s = onC(c, r, a0), e = onC(c, r, aEnd), tip = onC(c, r, a1);
  const d = `M${f1(s[0])} ${f1(s[1])}A${r} ${r} 0 ${Math.abs(aEnd - a0) > 180 ? 1 : 0} ${dir > 0 ? 1 : 0} ${f1(e[0])} ${f1(e[1])}`;
  const t = rad(a1 + dir * 90 - dir * ((hl * 0.4) / r) * (180 / Math.PI));
  const base: P = [tip[0] - Math.cos(t) * hl * 0.8, tip[1] - Math.sin(t) * hl * 0.8];
  const n: P = [-Math.sin(t) * hl * 0.62, Math.cos(t) * hl * 0.62];
  const hp = `M${f1(tip[0])} ${f1(tip[1])}L${f1(base[0] + n[0])} ${f1(base[1] + n[1])}L${f1(base[0] - n[0])} ${f1(base[1] - n[1])}Z`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={w + 3} />
      <path d={hp} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} fill="none" stroke={color} stroke-width={w} />
      <path d={hp} fill={color} />
    </g>
  );
}
/** Ölçü çizgisi: uçlarda dik çentik, ortada yazı */
function Dim({ a, b, t, c = K.ink, off = [0, 0] as P, s = 13, w = 2.2 }: { a: P; b: P; t: string; c?: string; off?: P; s?: number; w?: number }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const n: P = [-Math.sin(ang) * 5, Math.cos(ang) * 5];
  const d = `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}M${f1(a[0] - n[0])} ${f1(a[1] - n[1])}L${f1(a[0] + n[0])} ${f1(a[1] + n[1])}M${f1(b[0] - n[0])} ${f1(b[1] - n[1])}L${f1(b[0] + n[0])} ${f1(b[1] + n[1])}`;
  return (
    <g>
      <path d={d} stroke="#fff" stroke-width={w + 2.5} stroke-linecap="round" fill="none" />
      <path d={d} stroke={c} stroke-width={w} stroke-linecap="round" fill="none" />
      {t && <T x={(a[0] + b[0]) / 2 + off[0]} y={(a[1] + b[1]) / 2 + off[1]} t={t} s={s} c={c} />}
    </g>
  );
}
/** Köşede küçük karşılaştırma çerçevesi. x,y = sol üst */
let insetN = 0;
function Inset({ x, y, w, h, children, bg = '#fbfaf7' }: { x: number; y: number; w: number; h: number; children: ComponentChildren; bg?: string }) {
  const id = `ot-in-${++insetN}`;
  return (
    <g>
      <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={10} /></clipPath></defs>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={bg} />
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}
/** İki panelli karşılaştırma zemini */
function Panels({ split = 160, f = '#f7f4ec' }: { split?: number; f?: string }) {
  return (
    <g>
      <rect x={10} y={10} width={split - 15} height={220} rx={12} fill={f} stroke={K.out} stroke-width={1.5} />
      <rect x={split + 5} y={10} width={305 - split} height={220} rx={12} fill={f} stroke={K.out} stroke-width={1.5} />
    </g>
  );
}
/** Eldiven (Person elinin üstüne) */
const GLOVE = '#5b6b7c';
const gloveAt = (h: P, k = 1) => <OG sh={[{ d: circ(h, 6.6 * k), f: GLOVE }]} />;

/** Tezgâh (yandan). x = sol, y = üst yüzey, w genişlik, h yükseklik (zemine) */
function Bench({ x, y, w = 180, h = 60 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <OG sh={[
      { d: rrect(x + 10, y + 8, 10, h - 8, 2), f: shade(WOOD, 0.15) },
      { d: rrect(x + w - 20, y + 8, 10, h - 8, 2), f: shade(WOOD, 0.15) },
      { d: rrect(x, y, w, 10, 2), f: WOOD },
      { d: `M${x + 4} ${y + 5}H${x + w - 4}`, st: shade(WOOD, 0.25), sw: 1.2 },
    ]} />
  );
}

/** Mengene (yandan). x = gövde ortası, y = tezgâh üstü; çeneler yukarıda, ağız aralığı gap */
function Vise({ x, y, gap = 10, col = '#3f6d9e' }: { x: number; y: number; gap?: number; col?: string }) {
  const jh = 38;
  return (
    <g>
      <OG sh={[
        { d: rrect(x - 26, y - 12, 52, 12, 2), f: shade(col, 0.15) },
        { d: rrect(x - gap / 2 - 18, y - jh, 18, jh - 10, 2), f: col },
        { d: rrect(x + gap / 2, y - jh, 18, jh - 10, 2), f: col },
        { d: rrect(x - gap / 2 - 4, y - jh, 4, 12, 1), f: '#6b7280' },
        { d: rrect(x + gap / 2, y - jh, 4, 12, 1), f: '#6b7280' },
        { d: rrect(x + gap / 2 + 18, y - 24, 24, 5, 2), f: '#9aa3ad' },
        { d: rrect(x + gap / 2 + 40, y - 34, 5, 26, 2), f: '#9aa3ad' },
      ]} />
    </g>
  );
}

/** Balta başı (yandan profil). Göz merkezi (x,y), göz dikey; ağız +x yönünde.
 *  cut: gözü kesit olarak göster (içindeki tahtayla); eyeTop/eyeBot: göz yarı genişliği üstte/altta */
function AxeHead({ x, y, s = 1, flipX = false, cut = false, eyeTop = 7, eyeBot = 5, wood = true, plugDy = 0 }: { x: number; y: number; s?: number; flipX?: boolean; cut?: boolean; eyeTop?: number; eyeBot?: number; wood?: boolean; plugDy?: number }) {
  const body = `M-20 -14H8C22 -14 32 -22 42 -32Q56 0 42 32C32 22 22 14 8 14H-20Q-23 14 -23 11V-11Q-23 -14 -20 -14Z`;
  const bevel = `M30 -20Q40 0 30 20L42 32Q56 0 42 -32Z`;
  const eye = `M${-eyeTop} -14H${eyeTop}L${eyeBot} 14H${-eyeBot}Z`;
  const plug = `M${-eyeTop + 1} ${-14 + plugDy}H${eyeTop - 1}L${eyeBot - 1} ${14 + plugDy}H${-eyeBot + 1}Z`;
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${flipX ? -s : s} ${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: body, f: STEEL },
        { d: bevel, f: STEEL_L, no: true },
        { d: `M-20 -9H6`, st: tint(STEEL, 0.35), sw: 2 / s },
      ]} />
      {cut && (
        <g>
          <path d={eye} fill="#3b3f4b" stroke={K.out} stroke-width={1.4 / s} />
          {wood && <path d={plug} fill={WOOD} stroke={K.out} stroke-width={1.2 / s} />}
          {wood && <path d={`M0 ${-13 + plugDy}V${12 + plugDy}`} stroke={shade(WOOD, 0.3)} stroke-width={1.6 / s} />}
        </g>
      )}
    </g>
  );
}

/** Çekiç: sap ucu (x,y), a yön (0 = sağa doğru sap, baş sağ uçta) */
function Hammer({ x, y, a = 0, s = 1, len = 70 }: { x: number; y: number; a?: number; s?: number; len?: number }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(0, -4, len, 8, 3), f: WOOD },
        { d: rrect(len - 6, -16, 16, 32, 2), f: '#5d6672' },
        { d: rrect(len - 8, -18, 20, 8, 2), f: '#6f7884' },
      ]} />
    </g>
  );
}

/** Eğe: sap ucu (x,y), a yön (0 = sağa), len ağız uzunluğu */
function FileTool({ x, y, a = 0, s = 1, len = 110 }: { x: number; y: number; a?: number; s?: number; len?: number }) {
  const teeth = Array.from({ length: Math.floor((len - 8) / 6) }, (_, i) => `M${40 + i * 6} -5l4 10`).join('');
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={1.5 / s} sh={[
        { d: capsule([0, 0], 6, [34, 0], 7), f: '#a8613a' },
        { d: `M34 -5H${34 + len}L${38 + len} 0L${34 + len} 5H34Z`, f: '#7c8590' },
        { d: teeth, st: '#555d68', sw: 1.2 },
      ]} />
    </g>
  );
}

/** Çapa (yandan): bıçak plakası + sap. Ağız ucu (x,y); bıçak a yönünde uzanır (0 = ağız sağda) */
function Hoe({ x, y, a = 0, s = 1, handle = 120, rust = 0 }: { x: number; y: number; a?: number; s?: number; handle?: number; rust?: number }) {
  // yerel: ağız (0,0)'da, plaka sola doğru 70 birim, sap plakanın sonundan aşağı-sola
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={1.5 / s} sh={[
        { d: capsule([-70, 2], 4, [-70 - handle * 0.8, 2 + handle * 0.6], 5), f: WOOD },
        { d: rrect(-80, -8, 16, 16, 4), f: '#6f7884' },
        { d: `M-70 -6H-6L0 0L-6 6H-70Z`, f: rust ? RUST : STEEL },
        { d: `M-14 -6H-6L0 0L-6 6H-14Z`, f: STEEL_L, no: true },
      ]} />
    </g>
  );
}


/** Bot (yandan, burnu sağda). gap: taban burundan ayrılmış; glue: iki yüzde sarı ince kat */
function Boot({ gap = false, glue = false }: { gap?: boolean; glue?: boolean }) {
  const up = `M58 34H138Q142 34 142 40V104Q150 122 196 134Q262 146 280 168Q286 178 278 184H52Q44 184 44 176V60Q44 34 58 34Z`;
  const soleBack = `M42 184H${gap ? 168 : 286}Q${gap ? 168 : 292} 184 ${gap ? 168 : 290} 194L${gap ? 168 : 286} 200H110V212H46Q40 212 40 206V188Q40 184 42 184Z`;
  const soleF = `M166 184L284 210Q292 214 288 222L284 226L166 200Z`;
  return (
    <g>
      <OG sh={[
        { d: up, f: '#8a5a36' },
        { d: `M142 104Q150 122 196 134Q262 146 280 168Q286 178 278 184H200Q210 150 142 128Z`, f: shade('#8a5a36', 0.12), no: true },
        { d: `M60 50H128M60 66H128M60 82H128`, st: '#e8d7b0', sw: 2 },
        { d: `M46 176H278`, st: '#e8d7b0', sw: 1.6 },
      ]} />
      {glue && <path d="M170 182L280 182" stroke="#f5d76e" stroke-width={4} stroke-linecap="round" />}
      <OG sh={[{ d: soleBack, f: RUBBER }]} />
      {gap && <OG sh={[{ d: soleF, f: RUBBER }]} />}
      {gap && glue && <path d="M172 188L280 212" stroke="#f5d76e" stroke-width={4} stroke-linecap="round" />}
      {gap && <OG sh={[{ d: rrect(242, 178, 10, 28, 2), f: WOOD2, t: 'rotate(8 247 192)' }]} />}
    </g>
  );
}

/** Açık fermuar: sürgü c'de (en altta), üstte açılmış iki diş sırası */
function ZipperOpen({ c }: { c: P }) {
  const tape = '#2f3d63';
  const teeth: JSX.Element[] = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const yy = c[1] - 26 - i * 16;
    const dx = 8 + t * 40;
    teeth.push(<rect key={'l' + i} x={c[0] - dx - 10} y={yy} width={12} height={8} rx={2} fill="#d9b25a" stroke={K.out} stroke-width={1.2} />);
    teeth.push(<rect key={'r' + i} x={c[0] + dx - 2} y={yy + 8} width={12} height={8} rx={2} fill="#d9b25a" stroke={K.out} stroke-width={1.2} />);
  }
  return (
    <g>
      <OG sh={[
        { d: `M${c[0] - 20} ${c[1] + 90}V${c[1] - 20}L${c[0] - 64} ${c[1] - 170}H${c[0] - 140}V${c[1] + 90}Z`, f: tape },
        { d: `M${c[0] + 20} ${c[1] + 90}V${c[1] - 20}L${c[0] + 64} ${c[1] - 170}H${c[0] + 140}V${c[1] + 90}Z`, f: tape },
      ]} />
      {teeth}
      {/* sürgü */}
      <OG sh={[
        { d: `M${c[0] - 24} ${c[1] - 30}H${c[0] + 24}Q${c[0] + 26} ${c[1] - 30} ${c[0] + 24} ${c[1] - 20}L${c[0] + 12} ${c[1] + 28}H${c[0] - 12}L${c[0] - 24} ${c[1] - 20}Q${c[0] - 26} ${c[1] - 30} ${c[0] - 24} ${c[1] - 30}Z`, f: '#b8c0c8' },
        { d: rrect(c[0] - 7, c[1] - 26, 14, 50, 6), f: '#9aa3ad' },
        { d: `M${c[0] - 12} ${c[1] + 14}H${c[0] + 12}L${c[0] + 12} ${c[1] + 28}H${c[0] - 12}Z`, f: '#ffe08a', no: true },
      ]} />
    </g>
  );
}

/** Pense: çene ucu jaw'da, a = sapların yönü (derece, 0 = sağa) */
function Pliers({ jaw, a = 20 }: { jaw: P; a?: number }) {
  return (
    <g transform={tr(jaw[0], jaw[1], 1, a)}>
      <OG sh={[
        { d: `M-6 -9H34L40 -4H-6Z`, f: '#6f7884' },
        { d: `M-6 9H34L40 4H-6Z`, f: '#5d6672' },
        { d: circ([46, 0], 9), f: '#6f7884' },
        { d: `M52 -6L170 -22L172 -10L54 4Z`, f: '#d0473d' },
        { d: `M52 6L170 22L172 10L54 -4Z`, f: '#b83b33' },
      ]} />
    </g>
  );
}

/** Kapalı zincir halkası: iki dişli arasında */
function ChainLoop({ a, ra, b, rb }: { a: P; ra: number; b: P; rb: number }) {
  const gear = (c: P, r: number) => {
    const n = Math.round(r / 3.2);
    const pts: P[] = [];
    for (let i = 0; i < n * 2; i++) pts.push(onC(c, i % 2 ? r : r + 7, (i * 180) / n));
    return [{ d: pl(pts) + 'Z', f: '#8f9aa6' }, { d: circ(c, r * 0.5), f: '#6f7884' }, { d: circ(c, 5), f: K.out }];
  };
  const top = `M${a[0]} ${a[1] - ra - 4}L${b[0]} ${b[1] - rb - 4}`;
  const bot = `M${a[0]} ${a[1] + ra + 4}L${b[0]} ${b[1] + rb + 4}`;
  return (
    <g>
      <OG sh={[...gear(a, ra), ...gear(b, rb)]} />
      <g fill="none" stroke-linecap="round">
        {[top, bot].map((d, i) => <path key={i} d={d} stroke={K.out} stroke-width={12} />)}
        <path d={`${top}`} stroke="#5d6672" stroke-width={9} stroke-dasharray="10 4" />
        <path d={`${bot}`} stroke="#5d6672" stroke-width={9} stroke-dasharray="10 4" />
        <path d={`M${a[0]} ${a[1] - ra - 4}A${ra + 4} ${ra + 4} 0 0 0 ${a[0]} ${a[1] + ra + 4}`} stroke={K.out} stroke-width={12} />
        <path d={`M${a[0]} ${a[1] - ra - 4}A${ra + 4} ${ra + 4} 0 0 0 ${a[0]} ${a[1] + ra + 4}`} stroke="#5d6672" stroke-width={9} stroke-dasharray="10 4" />
        <path d={`M${b[0]} ${b[1] - rb - 4}A${rb + 4} ${rb + 4} 0 0 1 ${b[0]} ${b[1] + rb + 4}`} stroke={K.out} stroke-width={12} />
        <path d={`M${b[0]} ${b[1] - rb - 4}A${rb + 4} ${rb + 4} 0 0 1 ${b[0]} ${b[1] + rb + 4}`} stroke="#5d6672" stroke-width={9} stroke-dasharray="10 4" />
      </g>
    </g>
  );
}

/** Düz makaralı zincir (yandan): x sol, y orta çizgi */
function ChainStraight({ x, y, n, pitch }: { x: number; y: number; n: number; pitch: number }) {
  const els: JSX.Element[] = [];
  for (let i = 0; i < n; i++) {
    const px = x + i * pitch;
    els.push(<rect key={'p' + i} x={px - 3} y={y - 10} width={pitch + 6} height={20} rx={9} fill={i % 2 ? '#9aa3ad' : '#7f8a97'} stroke={K.out} stroke-width={1.4} />);
  }
  for (let i = 0; i <= n; i++) els.push(<circle key={'r' + i} cx={x + i * pitch} cy={y} r={5.5} fill="#c9d1d9" stroke={K.out} stroke-width={1.4} />);
  return <g>{els}</g>;
}

/** Bilyalı rulman (önden): c merkez, r dış yarıçap; ortada mil */
function BearingFace({ c, r }: { c: P; r: number }) {
  const balls = Array.from({ length: 9 }, (_, i) => onC(c, r * 0.68, i * 40));
  return (
    <g>
      <OG sh={[{ d: circ(c, r), f: '#9aa3ad' }, { d: circ(c, r * 0.84), f: '#3b3f4b' }]} />
      <OG sh={balls.map((b) => ({ d: circ(b, r * 0.12), f: '#d7dde3' }))} />
      <OG sh={[{ d: circ(c, r * 0.52), f: '#b8c0c8' }, { d: circ(c, r * 0.3), f: '#7f8a97' }, { d: rrect(c[0] - 4, c[1] - r * 0.3, 8, 8, 1), f: '#3b3f4b' }]} />
    </g>
  );
}

/** Priz (duvarda, önden). x,y = merkez */
function Socket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-18, -18, 36, 36, 6), f: '#f4f1ea' }, { d: circ([0, 0], 12), f: '#e2ddd2' }, { d: circ([-5, 0], 2.4), f: K.out }, { d: circ([5, 0], 2.4), f: K.out }]} />
    </g>
  );
}

/** Fiş + kablo. plug = fişin gövde merkezi; a = bacakların yönü (0 = sağa... -90 = yukarı) */
function PlugCord({ plug, a = -90, cordFrom, s = 1 }: { plug: P; a?: number; cordFrom: P; s?: number }) {
  const back = onC(plug, 14 * s, a + 180);
  return (
    <g>
      <Ln d={smooth([back, [(back[0] + cordFrom[0]) / 2, Math.max(back[1], cordFrom[1]) + 8], cordFrom])} c="#3b3f4b" w={3.4 * s} />
      <g transform={tr(plug[0], plug[1], s, a + 90)}>
        <OG ow={1.5 / s} sh={[
          { d: rrect(-4.5, -26, 3, 12, 1.5), f: '#c9d1d9' },
          { d: rrect(1.5, -26, 3, 12, 1.5), f: '#c9d1d9' },
          { d: `M-12 -14H12V4Q12 12 4 14H-4Q-12 12 -12 4Z`, f: '#2b2d3a' },
        ]} />
      </g>
    </g>
  );
}

/** Bez parçası (bezli el için) */
function Cloth_({ x, y }: { x: number; y: number }) {
  return <OG sh={[{ d: smooth([[x - 26, y - 4], [x - 10, y - 16], [x + 16, y - 12], [x + 24, y + 6], [x + 4, y + 14], [x - 20, y + 10]], true), f: '#f4f1ea' }]} />;
}

/** Geri dönüşüm üçgeni (içinde numara) */
function RecTri({ x, y, n, s = 1 }: { x: number; y: number; n: string; s?: number }) {
  return (
    <g transform={tr(x, y, s)}>
      <path d="M0 -15L14 10H-14Z" fill="#fff" stroke={K.ink} stroke-width={2.4} stroke-linejoin="round" />
      <text x={0} y={7} font-size={13} font-weight={800} text-anchor="middle" fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">{n}</text>
    </g>
  );
}

/** Seramik kupa (önden). x = alt orta, y = taban. broken: kulp ve bir parça ayrı; taped: kâğıt bantla tutturulmuş */
function Mug({ x, y, broken = false, taped = false }: { x: number; y: number; broken?: boolean; taped?: boolean }) {
  const body = `M${x - 30} ${y - 76}H${x + 30}V${y - 8}Q${x + 30} ${y} ${x + 22} ${y}H${x - 22}Q${x - 30} ${y} ${x - 30} ${y - 8}Z`;
  const col = '#e9eef2';
  return (
    <g>
      <OG sh={[
        { d: `M${x + 28} ${y - 64}Q${x + 54} ${y - 64} ${x + 54} ${y - 44}Q${x + 54} ${y - 22} ${x + 28} ${y - 22}`, st: K.out, sw: 13, t: broken ? `translate(14 4) rotate(14 ${x + 40} ${y - 44})` : undefined },
      ]} />
      <path d={`M${x + 28} ${y - 64}Q${x + 54} ${y - 64} ${x + 54} ${y - 44}Q${x + 54} ${y - 22} ${x + 28} ${y - 22}`} fill="none" stroke={col} stroke-width={8} transform={broken ? `translate(14 4) rotate(14 ${x + 40} ${y - 44})` : undefined} />
      <OG sh={[{ d: body, f: col }, { d: `M${x - 30} ${y - 60}H${x + 30}V${y - 52}H${x - 30}Z`, f: '#3d7ad6', no: true }]} />
      <path d={`M${x - 30} ${y - 76}H${x + 30}V${y - 8}Q${x + 30} ${y} ${x + 22} ${y}H${x - 22}Q${x - 30} ${y} ${x - 30} ${y - 8}Z`} fill="none" stroke={K.out} stroke-width={2} />
      <path d={`M${x - 6} ${y - 76}L${x + 2} ${y - 50}L${x - 10} ${y - 30}L${x - 2} ${y}`} fill="none" stroke={K.out} stroke-width={1.8} />
      {taped && (
        <g opacity={0.92}>
          {[[-40, -70, 60, -20], [-40, -30, 60, -66], [-8, -86, -8, 4]].map(([a, b, c2, d], i) => (
            <path key={i} d={`M${x + a} ${y + b}L${x + c2} ${y + d}`} stroke={K.out} stroke-width={13} stroke-linecap="butt" />
          ))}
          {[[-40, -70, 60, -20], [-40, -30, 60, -66], [-8, -86, -8, 4]].map(([a, b, c2, d], i) => (
            <path key={'t' + i} d={`M${x + a} ${y + b}L${x + c2} ${y + d}`} stroke="#f0dfae" stroke-width={10} stroke-linecap="butt" />
          ))}
        </g>
      )}
    </g>
  );
}

/** İki bileşenli epoksi şırıngası (yatay). x = sol, y = taban */
function Epoxy({ x, y }: { x: number; y: number }) {
  return (
    <OG sh={[
      { d: rrect(x, y - 18, 50, 8, 3), f: '#f4f1ea' },
      { d: rrect(x, y - 9, 50, 8, 3), f: '#f4f1ea' },
      { d: rrect(x + 50, y - 16, 10, 13, 2), f: '#6f7884' },
      { d: rrect(x - 12, y - 19, 12, 19, 2), f: '#2f6fd0' },
    ]} />
  );
}


/** Tornavida: sap ucu (x,y), a yön (0 = uç sağda) */
function Screwdriver({ x, y, a = 0, s = 1 }: { x: number; y: number; a?: number; s?: number }) {
  return (
    <g transform={tr(x, y, s, a)}>
      <OG ow={1.5 / s} sh={[{ d: rrect(36, -2.5, 40, 5, 1), f: '#c9d1d9' }, { d: `M76 -2.5L82 -1V1L76 2.5Z`, f: '#9aa3ad' }, { d: capsule([0, 0], 7, [36, 0], 6), f: '#e2b33c' }, { d: `M6 -3H30M6 3H30`, st: shade('#e2b33c', 0.3), sw: 1.4 }]} />
    </g>
  );
}

/** Su ısıtıcısı (yandan). x = taban ortası, y = taban; kablo ucu c */
function Kettle({ x, y, s = 1, lidOpen = false }: { x: number; y: number; s?: number; lidOpen?: boolean }) {
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(-34, -8, 68, 8, 3), f: '#3b3f4b' },
        { d: `M28 -60Q44 -64 50 -76L44 -78Q38 -70 26 -70Z`, f: '#c9d1d9' },
        { d: `M-26 -84H26L32 -8H-32Z`, f: '#c9d1d9' },
        { d: `M-30 -36H30`, st: tint('#8f9aa6', 0.2), sw: 2 },
        { d: `M-26 -74Q-50 -74 -50 -50Q-50 -26 -30 -22`, st: K.out, sw: 9 },
        { d: lidOpen ? `M-24 -86L18 -112L22 -106L-20 -82Z` : rrect(-24, -90, 48, 7, 3), f: '#3b3f4b' },
      ]} />
      <path d="M-26 -74Q-50 -74 -50 -50Q-50 -26 -30 -22" fill="none" stroke="#3b3f4b" stroke-width={6} />
      <path d="M-14 -76V-16" stroke="#fff" stroke-width={4} stroke-linecap="round" opacity={0.6} />
    </g>
  );
}

/** Ölçü aleti (önden). x,y = sol üst; mode: dönen anahtarın gösterdiği simge */
function Meter({ x, y, s = 1, mode = 'beep', disp = '', leads = true }: { x: number; y: number; s?: number; mode?: 'beep' | 'ohm'; disp?: string; leads?: boolean }) {
  const ang = mode === 'beep' ? 60 : -40;
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(0, 0, 100, 160, 14), f: '#f2c94c' },
        { d: rrect(8, 8, 84, 144, 10), f: '#3b3f4b' },
        { d: rrect(16, 16, 68, 32, 4), f: '#c9e3c0' },
        { d: circ([50, 86], 22), f: '#5d6672' },
        { d: circ([20, 140], 7), f: '#2b2d3a' },
        { d: circ([50, 140], 7), f: '#2b2d3a' },
        { d: circ([80, 140], 7), f: '#2b2d3a' },
      ]} />
      <path d={`M50 86L${f1(50 + 20 * Math.sin(rad(ang)))} ${f1(86 - 20 * Math.cos(rad(ang)))}`} stroke="#fff" stroke-width={4} stroke-linecap="round" />
      <text x={50} y={40} font-size={20} font-weight={800} text-anchor="middle" fill={K.ink} font-family="monospace">{disp}</text>
      {/* anahtar çevresindeki simgeler */}
      <text x={20} y={78} font-size={11} font-weight={700} fill="#fff" text-anchor="middle">V</text>
      <text x={30} y={62} font-size={11} font-weight={700} fill="#fff" text-anchor="middle">Ω</text>
      <Waves x={74} y={70} a={-30} n={2} r={3} color="#fff" w={1.6} />
      <text x={20} y={127} font-size={10} font-weight={700} fill="#fff" text-anchor="middle">A</text>
      <text x={50} y={127} font-size={10} font-weight={700} fill="#fff" text-anchor="middle">COM</text>
      <text x={80} y={127} font-size={10} font-weight={700} fill="#fff" text-anchor="middle">VΩ</text>
      {leads && <circle cx={50} cy={140} r={5} fill="#111" />}
      {leads && <circle cx={80} cy={140} r={5} fill={K.red} />}
    </g>
  );
}
/** Ölçü ucu (prob) + kablo: uç tip'te, a = probun yönü (uca doğru), kablo from'dan gelir */
function Probe({ tip, a, from, col }: { tip: P; a: number; from: P; col: string }) {
  const back = onC(tip, 46, a + 180);
  return (
    <g>
      <Ln d={smooth([back, [(back[0] + from[0]) / 2, Math.max(back[1], from[1]) + 14], from])} c={col} w={3.2} />
      <g transform={tr(tip[0], tip[1], 1, a)}>
        <OG sh={[{ d: rrect(-12, -1.5, 12, 3, 1), f: '#c9d1d9' }, { d: `M-46 -5H-14L-12 -3V3L-14 5H-46Z`, f: col }, { d: rrect(-20, -7, 4, 14, 1), f: col }]} />
      </g>
    </g>
  );
}

/** Şimşek tehlike simgesi (sarı üçgen) */
function Zap({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={tr(x, y, s)}>
      <path d="M0 -16L16 12H-16Z" fill="#ffd23f" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
      <path d="M2 -8L-5 3H1L-2 10L6 -1H0Z" fill={K.out} />
    </g>
  );
}

/** Bobin: boru üzerine sarılmış tel (yatay). x,y = sol uç ortası, w boy, r yarıçap (yükseklik/2), n görünen sarım */
function Coil({ x, y, w, r, n = 26, taps = [] as number[], vertical = false }: { x: number; y: number; w: number; r: number; n?: number; taps?: number[]; vertical?: boolean }) {
  const lines: JSX.Element[] = [];
  const wx0 = x + w * 0.1, wx1 = x + w * 0.9;
  for (let i = 0; i < n; i++) {
    const xx = wx0 + ((wx1 - wx0) * (i + 0.5)) / n;
    lines.push(<path key={i} d={`M${f1(xx - 1.5)} ${y - r}L${f1(xx + 1.5)} ${y + r}`} stroke={shade(COPPER, 0.35)} stroke-width={1.3} />);
  }
  return (
    <g transform={vertical ? `rotate(-90 ${x} ${y})` : undefined}>
      <OG sh={[{ d: rrect(x, y - r, w, r * 2, 4), f: '#e8e3d6' }, { d: rrect(wx0, y - r - 1, wx1 - wx0, r * 2 + 2, 2), f: COPPER }]} />
      {lines}
      {taps.map((t, i) => {
        const xx = wx0 + (wx1 - wx0) * t;
        const d = `M${xx - 3} ${y - r}C${xx - 14} ${y - r - 26} ${xx + 14} ${y - r - 26} ${xx + 3} ${y - r}`;
        return <g key={'t' + i}><path d={d} fill="none" stroke={K.out} stroke-width={6} /><path d={d} fill="none" stroke={COPPER} stroke-width={3.4} /></g>;
      })}
    </g>
  );
}

/** Değişken kondansatör (yukarıdan/önden): x,y merkez */
function VarCap({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={tr(x, y, s)}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(-26, -22, 52, 44, 4), f: '#c9d1d9' },
        { d: `M-20 -16H20M-20 -8H20M-20 0H20M-20 8H20M-20 16H20`, st: '#7f8a97', sw: 2 },
        { d: smooth([[-14, -18], [8, -14], [16, 0], [8, 14], [-14, 18]]) , st: '#5d6672', sw: 2.2 },
        { d: circ([0, 0], 11), f: '#2b2d3a' },
        { d: `M0 0V-9`, st: '#fff', sw: 2 },
      ]} />
    </g>
  );
}

/** Germanyum diyot (cam gövde, katot bandı sağda). a ile 0..b arası */
function Diode({ a, b }: { a: P; b: P }) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return (
    <g transform={tr(a[0], a[1], 1, ang)}>
      <path d={`M0 0H${L}`} stroke={K.out} stroke-width={4.5} />
      <path d={`M0 0H${L}`} stroke="#c9d1d9" stroke-width={2.4} />
      <OG sh={[{ d: rrect(L / 2 - 16, -7, 32, 14, 6), f: '#f0d7a6', op: 0.95 }, { d: rrect(L / 2 + 8, -7, 6, 14, 1), f: K.out }]} />
    </g>
  );
}

/** Kristal kulaklık (önden): c merkez */
function Earpiece({ c, s = 1 }: { c: P; s?: number }) {
  return (
    <g transform={tr(c[0], c[1], s)}>
      <OG ow={1.5 / s} sh={[{ d: circ([0, 0], 16), f: '#2b2d3a' }, { d: circ([0, 0], 9), f: '#5d6672' }, { d: rrect(-5, 14, 10, 14, 3), f: '#2b2d3a' }]} />
    </g>
  );
}

/** Vida terminali (yukarıdan) */
function Screw({ c }: { c: P }) {
  return <OG sh={[{ d: circ(c, 9), f: '#c9d1d9' }, { d: `M${c[0] - 5} ${c[1]}H${c[0] + 5}`, st: K.out, sw: 2 }]} />;
}
/** Bağlantı noktası */
const Dot = ({ c }: { c: P }) => <circle cx={c[0]} cy={c[1]} r={4.5} fill={K.out} />;

/** Kulübe (yandan, önden duvar). x = sol, y = zemin */
function Hut({ x, y, w = 90, h = 70, win = true }: { x: number; y: number; w?: number; h?: number; win?: boolean }) {
  return (
    <g>
      <OG sh={[
        { d: rrect(x, y - h, w, h, 2), f: '#c99a62' },
        { d: `M${x - 10} ${y - h + 2}L${x + w / 2} ${y - h - 36}L${x + w + 10} ${y - h + 2}Z`, f: '#9a5a3e' },
        ...(win ? [{ d: rrect(x + 14, y - h + 16, 28, 24, 2), f: '#3b4a5e' }] : []),
        { d: rrect(x + w - 34, y - 46, 22, 46, 2), f: '#8a5a36' },
      ]} />
      {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${x} ${y - h + 14 + i * 14}H${x + w}`} stroke={shade('#c99a62', 0.2)} stroke-width={1.2} />)}
    </g>
  );
}

/** Cam şişe boynundan yalıtkan (yatay) */
function Insul({ c }: { c: P }) {
  return <OG sh={[{ d: rrect(c[0] - 9, c[1] - 5, 18, 10, 4), f: '#7fc1a8' }, { d: `M${c[0] - 3} ${c[1] - 5}V${c[1] + 5}M${c[0] + 3} ${c[1] - 5}V${c[1] + 5}`, st: shade('#7fc1a8', 0.3), sw: 1.2 }]} />;
}

/** Elektrik direği + hatlar. x = direk ortası, y = zemin */
function PowerPole({ x, y, h = 120 }: { x: number; y: number; h?: number }) {
  return (
    <OG sh={[
      { d: rrect(x - 4, y - h, 8, h, 2), f: '#8a6a4a' },
      { d: rrect(x - 26, y - h + 8, 52, 6, 2), f: '#6b4f3a' },
      { d: circ([x - 20, y - h + 6], 3.4), f: '#e8e3d6' },
      { d: circ([x + 20, y - h + 6], 3.4), f: '#e8e3d6' },
      { d: circ([x, y - h + 6], 3.4), f: '#e8e3d6' },
    ]} />
  );
}


/** Can yeleği (Person 'mid' katmanı için). front: önden görünüş; yoksa yandan */
function vest(r: ReturnType<typeof rig>, front: boolean) {
  const s = r.s;
  if (front) {
    const xl = Math.min(r.shoulderB[0], r.shoulderF[0]), xr = Math.max(r.shoulderB[0], r.shoulderF[0]);
    const yt = Math.min(r.shoulderB[1], r.shoulderF[1]) - 2 * s;
    const yb = r.hip[1] - 6 * s;
    const n = r.neck;
    const body = `M${f1(xl + 2 * s)} ${f1(yt)}L${f1(n[0] - 6 * s)} ${f1(yt - 2 * s)}L${f1(n[0])} ${f1(yt + 16 * s)}L${f1(n[0] + 6 * s)} ${f1(yt - 2 * s)}L${f1(xr - 2 * s)} ${f1(yt)}L${f1(xr + 1 * s)} ${f1(yb)}H${f1(xl - 1 * s)}Z`;
    const sy = yt + (yb - yt) * 0.62;
    return (
      <g>
        <OG sh={[{ d: body, f: VEST }, { d: `M${f1(n[0])} ${f1(yt + 16 * s)}V${f1(yb)}`, st: shade(VEST, 0.35), sw: 1.4 }]} />
        <path d={`M${f1(xl)} ${f1(sy)}H${f1(xr)}`} stroke={K.out} stroke-width={4 * s} />
        <rect x={f1(n[0] - 4 * s)} y={f1(sy - 3.5 * s)} width={f1(8 * s)} height={f1(7 * s)} rx={1.5} fill="#2b2d3a" />
      </g>
    );
  }
  const pts: P[] = [
    [r.nape[0] - 2 * s, r.nape[1] + 5 * s],
    [r.neck[0] + 6 * s, r.neck[1] + 3 * s],
    [r.chest[0] + 4 * s, r.chest[1]],
    [r.belly[0] + 4 * s, r.belly[1] + 2 * s],
    [r.belly[0] - 2 * s, r.belly[1] + 8 * s],
    [r.back[0] - 3 * s, r.back[1] + 10 * s],
    [r.back[0] - 4 * s, r.back[1] - 4 * s],
  ];
  return <OG sh={[{ d: smooth(pts, true, 0.6), f: VEST }, { d: `M${f1(r.back[0] - 3 * s)} ${f1(r.back[1] + 2 * s)}L${f1(r.chest[0] + 4 * s)} ${f1(r.chest[1] + 6 * s)}`, st: K.out, sw: 3 * s }]} />;
}

/** Sal (yandan): x sol, y güverte üstü, w boy */
function Raft({ x, y, w = 200 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, w, 16, 8), f: '#a36f45' }, { d: rrect(x + 4, y + 9, w - 8, 12, 6), f: shade('#a36f45', 0.18) }]} />
      <path d={`M${x + 10} ${y + 6}H${x + w - 10}`} stroke={shade('#a36f45', 0.3)} stroke-width={1.4} />
      {[0.15, 0.5, 0.85].map((t) => <path key={t} d={`M${f1(x + w * t)} ${y - 1}V${y + 20}`} stroke={ROPE} stroke-width={3.2} />)}
    </g>
  );
}

/** Deniz yüzeyi: y'den aşağısı su */
function Sea({ y, x = 0, w = 320, h = 240 }: { y: number; x?: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h - y} fill={SEA} />
      <rect x={x} y={y} width={w} height={6} fill={tint(SEA, 0.35)} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${x + 20 + i * 52} ${y + 22 + (i % 3) * 18}q8 -5 16 0t16 0`} stroke={tint(SEA, 0.4)} stroke-width={2} fill="none" />)}
    </g>
  );
}

/** Kare yelken: yard (üst sırık) y0'da x0..x1, alt kenar y1 */
function SquareSail({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const m = (x0 + x1) / 2;
  return (
    <g>
      <OG sh={[
        { d: `M${x0 + 4} ${y0 + 3}H${x1 - 4}Q${x1 + 6} ${(y0 + y1) / 2} ${x1 - 2} ${y1}Q${m} ${y1 + 10} ${x0 + 2} ${y1}Q${x0 - 6} ${(y0 + y1) / 2} ${x0 + 4} ${y0 + 3}Z`, f: '#efe6cf' },
        { d: `M${m} ${y0 + 4}Q${m + 6} ${(y0 + y1) / 2} ${m} ${y1 + 4}`, st: shade('#efe6cf', 0.2), sw: 1.4 },
        { d: capsule([x0 - 8, y0], 3.2, [x1 + 8, y0], 3.2), f: WOOD },
      ]} />
    </g>
  );
}

/* ═══════════════ Sahneler ═══════════════ */
export const SCENES: Record<string, () => JSX.Element> = {
  /* ───────── Onarım kategori kapağı ───────── */
  'sf-ot-onarim-kapak': () => {
    const p: PersonProps = { ...CAST.riza, x: 112, y: 228, s: 1.12, pose: { ...POSE.standSide, spine: -84, chest: -78, head: -70, armF: { to: [204, 132] }, armB: { to: [170, 140] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor" wall="#e6dccb">
        {/* duvarda alet panosu */}
        <rect x={150} y={26} width={150} height={66} rx={4} fill="#c9a272" stroke={K.out} stroke-width={1.5} />
        <Hammer x={162} y={74} a={-90} s={0.6} len={60} />
        <g transform="translate(200 40)"><OG sh={[{ d: capsule([0, 0], 3, [0, 40], 4), f: '#d0473d' }, { d: capsule([8, 0], 3, [8, 40], 4), f: '#d0473d' }, { d: `M-2 -16L4 2L10 -16L6 -18L4 -6L2 -18Z`, f: '#6f7884' }]} /></g>
        <g transform="translate(240 36)"><OG sh={[{ d: rrect(-3, 0, 6, 26, 2), f: '#a8613a' }, { d: rrect(-2.5, 26, 5, 24, 1), f: '#7c8590' }]} /></g>
        <g transform="translate(270 34)"><OG sh={[{ d: capsule([0, 0], 3, [0, 46], 3.5), f: WOOD2 }]} /><AxeHead x={0} y={6} s={0.5} /></g>
        <Bench x={120} y={170} w={190} h={60} />
        <Vise x={196} y={170} gap={6} />
        <Hoe x={250} y={134} a={0} s={0.9} handle={30} />
        <FileTool x={170} y={142} a={-12} s={0.82} len={90} />
        <Person {...p} over={(r) => <g>{gloveAt(r.handF, 0.9)}{gloveAt(r.handB, 0.9)}</g>} />
      </Scene2>
    );
  },

  /* ───────── Sap değiştirme ───────── */
  // 2: kırık sap kesilmiş; gözde kalan tahta matkapla deliniyor
  'sf-ot-sap-delme': () => {
    const ax: P = [120, 158];
    const s = 1.75;
    const h0 = { x: 0, y: 0, a: -66, s: 1.05, pose: 'fist' as const, side: 'R' as const, ...HAND.riza };
    const g0 = handPoint(h0, 'grip');
    const h = { ...h0, x: ax[0] + 44 - g0[0], y: ax[1] - 100 - g0[1] };
    return (
      <Scene2 bg="closeup">
        <Bench x={20} y={190} w={280} h={60} />
        {/* takozlar */}
        <OG sh={[{ d: rrect(ax[0] - 66, ax[1] + 32, 40, 8, 1), f: WOOD2 }, { d: rrect(ax[0] + 26, ax[1] + 32, 40, 8, 1), f: WOOD2 }]} />
        <AxeHead x={ax[0]} y={ax[1]} s={s} cut eyeTop={8} eyeBot={6} />
        {/* gözdeki tahtada açılmış delikler */}
        <path d={`M${ax[0] - 7} ${ax[1] - 22}V${ax[1] - 2}M${ax[0] + 7} ${ax[1] - 22}V${ax[1] - 6}`} stroke="#3b2a1e" stroke-width={3.6} stroke-linecap="round" />
        {/* kesilmiş sap parçası tezgâhta */}
        <OG sh={[{ d: capsule([214, 182], 7, [296, 182], 8), f: WOOD }, { d: ell([214, 182], 4, 7), f: WOOD2 }]} />
        {/* matkap: uç gözün ortasında */}
        <g>
          <path d={`M${ax[0]} ${ax[1] - 18}V${ax[1] - 60}`} stroke={K.out} stroke-width={5} />
          <path d={`M${ax[0]} ${ax[1] - 18}V${ax[1] - 60}`} stroke="#c9d1d9" stroke-width={3} />
          <OG sh={[
            { d: rrect(ax[0] - 8, ax[1] - 76, 16, 18, 3), f: '#3b3f4b' },
            { d: rrect(ax[0] - 15, ax[1] - 132, 30, 58, 7), f: '#3e6aa8' },
            { d: `M${ax[0] + 10} ${ax[1] - 124}L${ax[0] + 76} ${ax[1] - 92}L${ax[0] + 68} ${ax[1] - 76}L${ax[0] + 8} ${ax[1] - 100}Z`, f: '#3e6aa8' },
          ]} />
        </g>
        <Hand {...h} arm={160} />
        <Arrow from={[ax[0] - 46, ax[1] - 110]} to={[ax[0] - 46, ax[1] - 62]} />
      </Scene2>
    );
  },

  // 3: baş ters, iki takoz üstünde; dar ağızdan çubukla vurulur, tahta alttaki geniş ağızdan düşer
  'sf-ot-sap-cakma': () => {
    const ax: P = [150, 150];
    const s = 2.0;
    const rodTop: P = [ax[0], 46];
    const hF = { x: 0, y: 0, a: 84, s: 1.0, pose: 'fist' as const, side: 'R' as const, ...HAND.riza };
    const g0 = handPoint(hF, 'grip');
    const hx = ax[0] - g0[0], hy = 82 - g0[1];
    return (
      <Scene2 bg="closeup">
        <Bench x={14} y={212} w={292} h={40} />
        {/* iki takoz, arada boşluk */}
        <OG sh={[{ d: rrect(ax[0] - 84, ax[1] + 28, 58, 34, 2), f: WOOD2 }, { d: rrect(ax[0] + 26, ax[1] + 28, 58, 34, 2), f: WOOD2 }]} />
        <AxeHead x={ax[0]} y={ax[1]} s={s} cut eyeTop={5} eyeBot={8} plugDy={9} />
        {/* düşen tahta parçası */}
        <OG sh={[{ d: rrect(ax[0] - 12, ax[1] + 36, 24, 20, 2), f: WOOD, t: `rotate(10 ${ax[0]} ${ax[1] + 46})` }]} />
        {/* zımba çubuğu */}
        <OG sh={[{ d: rrect(ax[0] - 7, rodTop[1], 14, ax[1] - 28 - rodTop[1], 2), f: '#8a5a36' }]} />
        <Hand {...hF} x={hx} y={hy} arm={200} />
        {/* çekiç çubuğun tepesine */}
        <Hammer x={280} y={12} a={168} s={1} len={130} />
        {(() => { const h2 = { x: 0, y: 0, a: -128, s: 1.0, pose: 'fist' as const, side: 'L' as const, ...HAND.riza }; const g2 = handPoint(h2, 'grip'); return <Hand {...h2} x={264 - g2[0]} y={16 - g2[1]} arm={120} />; })()}
        <Arrow from={[ax[0] + 40, 24]} to={[ax[0] + 40, 70]} />
      </Scene2>
    );
  },

  // 7: baş sapın ucuna geçirilmiş; sapın alt ucu kütüğe vurulur; yanda çekiçle başa vurma yasak
  'sf-ot-sap-oturtma': () => {
    const hx = 200;
    const top = 70, bot = 196;
    const p: PersonProps = { ...CAST.riza, x: 140, y: 228, s: 1.12, pose: { ...POSE.standSide, spine: -86, head: -82, armF: { to: [hx - 3, 150] }, armB: { to: [hx - 3, 128] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* kütük */}
        <OG sh={[{ d: rrect(hx - 30, bot, 60, 30, 3), f: '#9a6a44' }, { d: ell([hx, bot], 30, 6), f: '#d9b07e' }, { d: ell([hx, bot], 18, 3.6), f: 'none', ln: true }]} />
        {/* sap */}
        <OG sh={[{ d: capsule([hx, top - 4], 5, [hx, bot - 1], 6.5), f: WOOD2 }]} />
        <AxeHead x={hx} y={top + 10} s={1.05} />
        <Person {...p} />
        <Arrow from={[hx + 52, 54]} to={[hx + 52, 96]} />
        <Waves x={hx + 34} y={bot - 2} a={-20} n={2} r={6} />
        <Inset x={14} y={12} w={96} h={80}>
          <AxeHead x={58} y={66} s={0.8} />
          <OG sh={[{ d: capsule([58, 50], 4, [58, 98], 4.5), f: WOOD2 }]} />
          <AxeHead x={58} y={66} s={0.8} />
          <Hammer x={98} y={20} a={140} s={0.65} len={60} />
          <No x={62} y={52} r={26} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── Eğe ile bileme ───────── */
  // 1: çapa mengenede, ağız karşıya; yasak: dizde
  'sf-ot-ege-sabitleme': () => {
    const vx = 232;
    const p: PersonProps = { ...CAST.riza, x: 160, y: 228, s: 1.1, pose: { ...POSE.standSide, spine: -86, armF: { to: [vx + 44, 150] }, armB: { to: [vx - 12, 160] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Bench x={182} y={170} w={130} h={60} />
        <Vise x={vx} y={170} gap={6} />
        <Hoe x={vx + 60} y={124} a={0} s={0.9} handle={0} />
        <OG sh={[{ d: capsule([vx - 12, 132], 4, [vx - 26, 112], 4.5), f: WOOD }]} />
        <Person {...p} over={(r) => <g>{gloveAt(r.handF, 0.95)}{gloveAt(r.handB, 0.95)}</g>} />
        <Ok x={vx + 50} y={96} />
        <Inset x={10} y={10} w={118} h={124}>
          <OG sh={[{ d: rrect(30, 104, 40, 7, 2), f: WOOD }, { d: rrect(46, 111, 8, 30, 1), f: WOOD }]} />
          <Person {...CAST.riza} x={52} y={136} s={0.62} pose={{ ...POSE.sitChair, armF: { to: [100, 92] }, armB: { to: [86, 96] }, face: 'neutral' }} shadow={false} />
          <Hoe x={122} y={92} a={0} s={0.6} handle={0} />
          <No x={74} y={74} r={40} />
        </Inset>
      </Scene2>
    );
  },

  // 4: eğe pahın üstünde, eski açıyla; yalnız ileri vuruş
  'sf-ot-ege-vurus': () => {
    const e: P = [236, 160]; // ağız
    const top = 134, bot = 162;
    const bx = 198; // pah başlangıcı (üst yüz); pah ~36°
    const ang = Math.atan2(e[1] - top, e[0] - bx) * 180 / Math.PI;
    const ux = Math.cos(rad(ang)), uy = Math.sin(rad(ang));
    const nx = Math.sin(rad(ang)), ny = -Math.cos(rad(ang));
    // eğe pahın üstüne yatık: sapı geride (sol üstte), ucu ağzın ötesinde
    const st: P = [bx - ux * 110 + nx * 6, top - uy * 110 + ny * 6];
    const hand1 = { x: 0, y: 0, a: 90 + ang, s: 0.95, pose: 'fist' as const, side: 'R' as const, ...HAND.riza };
    const g1 = handPoint(hand1, 'grip');
    const hp: P = [st[0] + ux * 18, st[1] + uy * 18];
    const R = 62;
    const a0 = 180, a1 = 180 + ang;
    const arc = `M${f1(e[0] + R * Math.cos(rad(a0)))} ${f1(e[1] + R * Math.sin(rad(a0)))}A${R} ${R} 0 0 1 ${f1(e[0] + R * Math.cos(rad(a1)))} ${f1(e[1] + R * Math.sin(rad(a1)))}`;
    return (
      <Scene2 bg="closeup">
        {/* çapa plakası (kesit), solda mengene çenelerinde */}
        <OG sh={[
          { d: `M20 ${top}H${bx}L${e[0]} ${e[1]}L${e[0] - 3} ${bot}H20Z`, f: STEEL },
          { d: `M${bx} ${top}L${e[0]} ${e[1]}L${e[0] - 5} ${bot - 1}L${bx + 3} ${top + 3}Z`, f: STEEL_L, no: true },
        ]} />
        <OG sh={[{ d: rrect(20, top - 34, 80, 34, 3), f: '#3f6d9e' }, { d: rrect(20, bot, 80, 50, 3), f: '#3f6d9e' }]} />
        {/* alt yüzün uzantısı (açının kolu) */}
        <path d={`M${e[0] - R - 8} ${bot}H${e[0] + 30}`} stroke={K.ink} stroke-width={1.6} stroke-dasharray="4 3" />
        <FileTool x={st[0]} y={st[1]} a={ang} s={1} len={150} />
        {/* açı yayı: alt yüz ile pah arası */}
        <path d={arc} fill="none" stroke="#fff" stroke-width={6.5} />
        <path d={arc} fill="none" stroke={K.ink} stroke-width={3} />
        <T x={e[0] - 70} y={bot + 34} t="30–45°" s={20} />
        <Hand {...hand1} x={hp[0] - g1[0]} y={hp[1] - g1[1]} arm={200} />
        <Arrow from={[bx - ux * 60 + nx * 40, top - uy * 60 + ny * 40]} to={[bx + ux * 4 + nx * 40, top + uy * 4 + ny * 40]} w={6} />
      </Scene2>
    );
  },

  // 7: balta ağzı ~25°, ağızdan 5–7 cm geriye yelpaze; eğe ağızdan sapa doğru itilir
  'sf-ot-ege-balta': () => {
    const e: P = [282, 120];
    const fan = 196;
    // ağız açısı ~25°: pah çizgileri ağızdan ±12,5°
    const tU: P = [fan, 101], tD: P = [fan, 139];
    const body = `M40 74Q120 76 ${tU[0]} ${tU[1]}Q244 108 ${e[0]} ${e[1]}Q244 132 ${tD[0]} ${tD[1]}Q120 164 40 166Z`;
    const bev = `M${tU[0]} ${tU[1]}Q244 108 ${e[0]} ${e[1]}Q244 132 ${tD[0]} ${tD[1]}Z`;
    const R = 62;
    const aU = Math.atan2(tU[1] - e[1], tU[0] - e[0]) * 180 / Math.PI;
    const aD = Math.atan2(tD[1] - e[1], tD[0] - e[0]) * 180 / Math.PI;
    const arc = `M${f1(e[0] + R * Math.cos(rad(aD)))} ${f1(e[1] + R * Math.sin(rad(aD)))}A${R} ${R} 0 0 1 ${f1(e[0] + R * Math.cos(rad(aU)))} ${f1(e[1] + R * Math.sin(rad(aU)))}`;
    // eğe üst pahın üstüne yatık; sapı ağız tarafında, ağızdan sapa doğru itilir
    const fa = aU; // eğe yönü: ağızdan geriye
    const ux = Math.cos(rad(fa)), uy = Math.sin(rad(fa));
    const nx = Math.sin(rad(fa)), ny = -Math.cos(rad(fa));
    const st: P = [e[0] - ux * 40 - nx * 6, e[1] - uy * 40 - ny * 6];
    const h0 = { x: 0, y: 0, a: fa - 90 - 180, s: 0.9, pose: 'fist' as const, side: 'R' as const, ...HAND.riza };
    const g0 = handPoint(h0, 'grip');
    const hp: P = [st[0] + ux * 18, st[1] + uy * 18];
    return (
      <Scene2 bg="closeup">
        <OG sh={[
          { d: body, f: STEEL },
          { d: bev, f: STEEL_L, no: true },
          { d: rrect(28, 68, 24, 104, 6), f: shade(STEEL, 0.1) },
        ]} />
        <path d={`M${fan} ${tU[1]}V${tD[1]}`} stroke={K.ink} stroke-width={1.6} stroke-dasharray="4 3" />
        <Dim a={[fan, 190]} b={[e[0], 190]} t="" />
        <Label x={(fan + e[0]) / 2} y={210} text="5–7 cm" size={15} bg={K.white} />
        {/* açı */}
        <path d={arc} fill="none" stroke="#fff" stroke-width={6} />
        <path d={arc} fill="none" stroke={K.ink} stroke-width={2.8} />
        <T x={166} y={127} t="25°" s={18} />
        <FileTool x={st[0]} y={st[1]} a={fa} s={0.95} len={150} />
        <Hand {...h0} x={hp[0] - g0[0]} y={hp[1] - g0[1]} arm={160} />
        <Arrow from={[230, 66]} to={[150, 40]} />
        <T x={44} y={196} t="sap tarafı" s={13} c="#5d6672" a="start" />
        <T x={e[0] + 2} y={154} t="ağız" s={14} c="#5d6672" />
      </Scene2>
    );
  },

  /* ───────── Pas ───────── */
  // 2: yarı sirke yarı suda bekletme; yasak: sirke + çamaşır suyu
  'sf-ot-pas-sirke': () => {
    const lv = 146;
    const basin = `M72 124H252L240 210Q238 214 232 214H92Q86 214 84 210Z`;
    return (
      <Scene2 bg="indoor">
        {/* leğenin arka yüzü */}
        <path d={basin} fill="#d7e6f2" />
        {/* kürek (sapı dışarıda) ve pense leğende */}
        <OG sh={[{ d: capsule([122, 172], 4, [74, 60], 4.5), f: WOOD }]} />
        <OG sh={[{ d: `M110 170L152 160Q172 178 164 200L126 206Q108 192 110 170Z`, f: RUST }]} />
        <OG sh={[{ d: capsule([186, 190], 3, [222, 170], 3), f: RUST }, { d: capsule([186, 194], 3, [224, 186], 3), f: RUST }, { d: capsule([160, 200], 4, [188, 192], 4), f: '#c6574e' }, { d: capsule([160, 204], 4, [188, 196], 4), f: '#c6574e' }]} />
        {/* sıvı */}
        <path d={`M78 ${lv}H246L237 210Q236 212 232 212H92Q88 212 87 210Z`} fill="#e3cf86" opacity={0.55} />
        <path d={`M78 ${lv}H246`} stroke="#b89f4e" stroke-width={2.4} />
        <path d={basin} fill="none" stroke={K.out} stroke-width={3} />
        <OG sh={[{ d: rrect(66, 118, 192, 9, 4), f: PLASTIC_B }]} />
        {/* sirke şişesi ve su testisi */}
        <OG sh={[{ d: `M268 214V150Q268 140 276 136V118H286V136Q294 140 294 150V214Z`, f: '#f2e6b4' }, { d: rrect(274, 112, 14, 8, 2), f: '#c0392b' }, { d: rrect(270, 162, 22, 26, 2), f: '#fff' }]} />
        <OG sh={[{ d: `M20 214V160Q20 146 34 142H46Q60 146 60 160V214Z`, f: '#9dd5f6' }, { d: `M58 156Q72 160 66 178Q62 190 58 192`, f: 'none', st: K.out, sw: 4 }]} />
        <Timer x={32} y={40} r={18} text="24 saat" />
        <Inset x={204} y={10} w={106} h={88}>
          <OG sh={[{ d: `M220 90V50Q220 44 226 42V30H234V42Q240 44 240 50V90Z`, f: '#f2e6b4' }, { d: rrect(224, 26, 12, 6, 2), f: '#c0392b' }]} />
          <OG sh={[{ d: `M260 90V46Q260 38 270 36H288Q298 38 298 46V90Z`, f: '#fbfaf7' }, { d: rrect(272, 26, 12, 10, 2), f: '#2f6fd0' }, { d: `M279 54l-8 13h16z`, f: '#f5b400' }]} />
          <T x={250} y={68} t="+" s={22} />
          <No x={257} y={58} r={34} />
        </Inset>
      </Scene2>
    );
  },

  // 3: çelik yünle küçük daireler; yarısı paslı yarısı parlak
  'sf-ot-pas-ovma': () => {
    const blade = `M70 60Q160 40 250 60L254 150Q240 210 160 222Q80 210 66 150Z`;
    const pad: P = [160, 134];
    return (
      <Scene2 bg="closeup">
        <defs><clipPath id="ot-pas-l"><rect x={0} y={0} width={160} height={240} /></clipPath></defs>
        {/* sap yuvası */}
        <OG sh={[{ d: rrect(140, 10, 40, 50, 6), f: '#6f7884' }, { d: rrect(148, -10, 24, 26, 4), f: WOOD }]} />
        <OG sh={[{ d: blade, f: STEEL_L }]} />
        <g clip-path="url(#ot-pas-l)">
          <path d={blade} fill={RUST} />
          {[[100, 90], [120, 170], [90, 140], [136, 110], [110, 200]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={5} fill={shade(RUST, 0.2)} />)}
        </g>
        <path d={blade} fill="none" stroke={K.out} stroke-width={2} />
        <path d="M206 80Q214 140 200 196" stroke="#fff" stroke-width={4} stroke-linecap="round" opacity={0.7} />
        {/* çelik yün */}
        <OG sh={[{ d: smooth([[pad[0] - 30, pad[1]], [pad[0] - 20, pad[1] - 18], [pad[0] + 6, pad[1] - 22], [pad[0] + 28, pad[1] - 10], [pad[0] + 30, pad[1] + 12], [pad[0] + 4, pad[1] + 22], [pad[0] - 24, pad[1] + 16]], true), f: '#b9bec6' }]} />
        <path d={`M${pad[0] - 20} ${pad[1] - 6}q8 -6 16 0t16 0M${pad[0] - 18} ${pad[1] + 6}q8 -6 16 0t16 0`} fill="none" stroke="#7f8790" stroke-width={1.3} />
        {(() => { const h0 = { x: 0, y: 0, a: -40, s: 0.95, pose: 'press' as const, side: 'R' as const }; const q = handPoint(h0, 'palm'); return <Hand {...h0} x={pad[0] + 14 - q[0]} y={pad[1] + 8 - q[1]} arm={160} {...HAND.riza} />; })()}
        <ArcArrow c={pad} r={52} a0={200} a1={330} />
      </Scene2>
    );
  },

  // 7: yağla nemlendirilmiş kum kovası; temiz alet batırılıp çıkarılır
  'sf-ot-pas-kum-kovasi': () => {
    const bx = 206;
    const p: PersonProps = { ...CAST.riza, x: 140, y: 228, s: 1.12, pose: { ...POSE.standSide, spine: -84, head: -76, armF: { to: [bx - 3, 112] }, armB: { to: [bx - 3, 86] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" ground="dirt">
        {/* kova (arka kenar), yağlı kum */}
        <OG sh={[{ d: ell([bx, 184], 40, 8), f: '#9c8250' }]} />
        {/* kürek: sap dik, temiz ağız kumun üstünde, batırılmak üzere */}
        <OG sh={[{ d: capsule([bx, 40], 4.5, [bx, 150], 5), f: WOOD }, { d: rrect(bx - 10, 30, 20, 10, 4), f: WOOD }]} />
        <OG sh={[{ d: `M${bx - 20} 146H${bx + 20}L${bx + 18} 180Q${bx} 192 ${bx - 18} 180Z`, f: STEEL_L }, { d: rrect(bx - 6, 140, 12, 12, 2), f: '#6f7884' }]} />
        <path d={`M${bx + 10} 154Q${bx + 12} 168 ${bx + 8} 178`} stroke="#fff" stroke-width={3} stroke-linecap="round" opacity={0.7} />
        {/* kova (ön yüz) */}
        <OG sh={[{ d: `M${bx - 40} 184Q${bx} 198 ${bx + 40} 184L${bx + 34} 224H${bx - 34}Z`, f: '#7f8a97' }]} />
        <path d={`M${bx - 37} 204H${bx + 37}`} stroke={shade('#7f8a97', 0.2)} stroke-width={2} />
        <Arrow from={[bx + 58, 128]} to={[bx + 58, 182]} head={1} />
        <Arrow from={[bx + 58, 150]} to={[bx + 58, 100]} head={1} />
        {/* tel fırça ve yağ şişesi */}
        <OG sh={[{ d: rrect(256, 212, 46, 9, 3), f: WOOD }, { d: rrect(256, 206, 30, 6, 1), f: '#8f9aa6' }]} />
        <OG sh={[{ d: `M286 212V186Q286 180 292 178V168H298V178Q304 180 304 186V212Z`, f: '#e2b33c' }]} />
        <Person {...p} />
      </Scene2>
    );
  },

  /* ───────── Ayakkabı ───────── */
  // 2: burnundan ayrılan taban; aralık bir takozla açık; iç yüz zımparalanır
  'sf-ot-ayakkabi-zimpara': () => {
    const h0 = { x: 0, y: 0, a: -92, s: 0.8, pose: 'press' as const, side: 'L' as const, view: 'back' as const };
    const q = handPoint(h0, 'palm');
    return (
      <Scene2 bg="closeup">
        <Boot gap />
        {/* zımpara kâğıdı aralıkta */}
        <OG sh={[{ d: `M196 190L268 196L266 204L194 198Z`, f: '#d9b77a' }]} />
        <path d="M204 194l2 1M220 196l2 0M236 197l2 1M252 199l2 0" stroke="#8a6a3a" stroke-width={2} stroke-linecap="round" />
        <Hand {...h0} x={262 - q[0]} y={186 - q[1]} arm={120} {...HAND.zeynep} />
        <Arrow from={[200, 120]} to={[150, 120]} w={5} />
        <Arrow from={[180, 120]} to={[236, 120]} w={5} />
      </Scene2>
    );
  },

  // 3: iki yüze ince kat kontak yapıştırıcı; 10–15 dk bekle; havalandırma
  'sf-ot-ayakkabi-yapistirici': () => {
    const h0 = { x: 0, y: 0, a: -100, s: 0.8, pose: 'fist' as const, side: 'L' as const };
    const q = handPoint(h0, 'grip');
    const g: P = [266, 168];
    return (
      <Scene2 bg="closeup">
        <Boot gap glue />
        {/* fırça: kıllar aralıkta */}
        <OG sh={[{ d: capsule([g[0] - 26, 196], 4, [g[0] + 44, 150], 5), f: WOOD }, { d: `M${g[0] - 30} 190L${g[0] - 50} 204L${g[0] - 44} 210L${g[0] - 22} 198Z`, f: '#f2c94c' }]} />
        <Hand {...h0} x={g[0] + 30 - q[0]} y={g[1] - 8 - q[1]} arm={130} {...HAND.zeynep} />
      </Scene2>
    );
  },

  // 6: kenarları hizalayıp burundan topuğa doğru bastırarak birleştir
  'sf-ot-ayakkabi-bastirma': () => {
    const h0 = { x: 0, y: 0, a: 196, s: 0.9, pose: 'press' as const, side: 'R' as const };
    const q = handPoint(h0, 'palm');
    return (
      <Scene2 bg="closeup">
        <Boot />
        <Hand {...h0} x={244 - q[0]} y={146 - q[1]} arm={200} {...HAND.zeynep} />
        <Arrow from={[262, 226]} to={[84, 226]} w={6} />
      </Scene2>
    );
  },

  /* ───────── Çanta ───────── */
  // 2: sürgü en altta; pense sürgünün arka kısmını hafifçe sıkar
  'sf-ot-canta-fermuar-pense': () => {
    const c: P = [140, 112];
    const tape = '#2f3d63';
    const tooth = (x: number, y: number, k: string) => <rect key={k} x={f1(x)} y={f1(y)} width={13} height={8} rx={2} fill="#d9b25a" stroke={K.out} stroke-width={1.2} />;
    const teeth: JSX.Element[] = [];
    // açık kısım: sürgünün üstünde iki ayrı sıra
    for (let i = 0; i < 8; i++) {
      const yy = c[1] - 40 - i * 15;
      const dx = 10 + i * 6.5;
      teeth.push(tooth(c[0] - dx - 13, yy, 'l' + i));
      teeth.push(tooth(c[0] + dx, yy + 7, 'r' + i));
    }
    // kapalı kısım: sürgünün altında birbirine geçmiş dişler
    for (let i = 0; i < 9; i++) {
      const yy = c[1] + 34 + i * 9;
      teeth.push(tooth(i % 2 ? c[0] - 10 : c[0] - 3, yy, 'c' + i));
    }
    const jaw: P = [c[0] + 4, c[1] + 22];
    const A = 26;
    const u: P = [Math.cos(rad(A)), Math.sin(rad(A))], n: P = [-Math.sin(rad(A)), Math.cos(rad(A))];
    const m: P = [jaw[0] + u[0] * 14, jaw[1] + u[1] * 14];
    return (
      <Scene2 bg="closeup">
        {/* kumaş ve fermuarın açık ağzı */}
        <rect x={0} y={0} width={320} height={240} fill={tape} />
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${i * 21} 0V240`} stroke={tint(tape, 0.08)} stroke-width={1.2} />)}
        <path d={`M${c[0] - 12} ${c[1] - 30}L${c[0] - 70} -2H${c[0] + 70}L${c[0] + 12} ${c[1] - 30}Z`} fill="#e9edf2" stroke={K.out} stroke-width={1.6} />
        {teeth}
        {/* sürgü: üstü geniş (iki sıra girer), altı dar (arka: kapanmış dişler çıkar) */}
        <OG sh={[
          { d: `M${c[0] - 28} ${c[1] - 34}H${c[0] + 28}Q${c[0] + 30} ${c[1] - 34} ${c[0] + 28} ${c[1] - 24}L${c[0] + 14} ${c[1] + 32}H${c[0] - 14}L${c[0] - 28} ${c[1] - 24}Q${c[0] - 30} ${c[1] - 34} ${c[0] - 28} ${c[1] - 34}Z`, f: '#b8c0c8' },
          { d: rrect(c[0] - 8, c[1] - 28, 16, 34, 6), f: '#9aa3ad' },
          { d: `M${c[0] - 15} ${c[1] + 16}H${c[0] + 15}L${c[0] + 14} ${c[1] + 32}H${c[0] - 14}Z`, f: '#ffe08a', no: true },
        ]} />
        <Pliers jaw={jaw} a={A} />
        {(() => { const h0 = { x: 0, y: 0, a: A - 90, s: 0.95, pose: 'fist' as const, side: 'R' as const, ...HAND.zeynep }; const g = handPoint(h0, 'grip'); const t: P = [jaw[0] + u[0] * 150, jaw[1] + u[1] * 150]; return <Hand {...h0} x={t[0] - g[0]} y={t[1] - g[1]} arm={90} />; })()}
        {/* hafif sık: iki yandan çenelere doğru küçük oklar */}
        <Arrow from={[m[0] - n[0] * 50, m[1] - n[1] * 50]} to={[m[0] - n[0] * 22, m[1] - n[1] * 22]} w={4} />
        <Arrow from={[m[0] + n[0] * 50, m[1] + n[1] * 50]} to={[m[0] + n[0] * 22, m[1] + n[1] * 22]} w={4} />
      </Scene2>
    );
  },

  // 6: 4–5 cm bindirme; kare + çarpı dikiş
  'sf-ot-canta-kutu-dikis': () => {
    const x0 = 112, x1 = 202, y0 = 92, y1 = 148;
    const thr = '#2b2d3a';
    return (
      <Scene2 bg="closeup">
        {/* alttaki kayış ucu (sağdan gelir, biraz daha geniş) */}
        <OG sh={[{ d: rrect(x0 - 6, y0 - 9, 310 - x0 + 6, y1 - y0 + 18, 3), f: '#2f3d63' }]} />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${x1 + 14 + i * 9} ${y0 - 7}V${y1 + 7}`} stroke={tint('#2f3d63', 0.12)} stroke-width={1.2} />)}
        {/* üstteki kayış ucu (soldan gelir), 4–5 cm bindirilmiş */}
        <OG sh={[{ d: rrect(10, y0, x1 + 6 - 10, y1 - y0, 3), f: '#5a77b0' }]} />
        {Array.from({ length: 21 }, (_, i) => <path key={'u' + i} d={`M${16 + i * 9} ${y0 + 2}V${y1 - 2}`} stroke={tint('#5a77b0', 0.15)} stroke-width={1.2} />)}
        {/* alttaki ucun gizli kenarı */}
        <path d={`M${x0 - 6} ${y0 - 9}V${y1 + 9}`} stroke={K.ink} stroke-width={1.6} stroke-dasharray="4 3" />
        <path d={`M${x0 + 6} ${y0 + 6}H${x1 - 6}V${y1 - 6}H${x0 + 6}ZM${x0 + 6} ${y0 + 6}L${x1 - 6} ${y1 - 6}M${x1 - 6} ${y0 + 6}L${x0 + 6} ${y1 - 6}`} fill="none" stroke="#f5d76e" stroke-width={3.4} stroke-dasharray="7 4" stroke-linejoin="round" />
        <path d={`M${x0 - 6} ${y1 + 12}V${y1 + 30}M${x1 + 6} ${y1 + 12}V${y1 + 30}`} stroke={K.ink} stroke-width={1.4} />
        <Dim a={[x0 - 6, 176]} b={[x1 + 6, 176]} t="" />
        <Label x={(x0 + x1) / 2} y={198} text="4–5 cm" size={15} bg={K.white} />
        {/* yüksük ve iğne */}
        <OG sh={[{ d: `M40 214V194Q40 182 52 182Q64 182 64 194V214Z`, f: '#c9d1d9' }]} />
        {[188, 196, 204].map((y) => <path key={y} d={`M44 ${y}H60`} stroke="#8f9aa6" stroke-width={1.5} stroke-dasharray="2 2" />)}
        <path d="M80 50L170 30" stroke={K.out} stroke-width={4.5} stroke-linecap="round" />
        <path d="M80 50L170 30" stroke="#c9d1d9" stroke-width={2.5} stroke-linecap="round" />
        <path d="M170 30Q200 26 214 50Q226 72 196 82" fill="none" stroke="#f5d76e" stroke-width={2.4} />
      </Scene2>
    );
  },

  /* ───────── Zincir ve rulman ───────── */
  // 1: çalışan zincire elle/bezle uzanma yasak; fişi çekilmiş makine doğru
  'sf-ot-zincir-yasak-el': () => {
    const a: P = [88, 150], b: P = [236, 150];
    return (
      <Scene2 bg="closeup">
        <ChainLoop a={a} ra={22} b={b} rb={40} />
        {[[160, 100], [170, 206]].map(([x, y], i) => <path key={i} d={`M${x - 20} ${y}h14M${x} ${y}h14`} stroke={K.ink} stroke-width={2.4} stroke-linecap="round" />)}
        <ArcArrow c={b} r={58} a0={-60} a1={30} w={4} color={K.ink} />
        {/* bezli el zincire uzanıyor */}
        <Cloth_ x={166} y={204} />
        <Hand x={176} y={252} a={-8} s={0.8} pose="press" side="R" arm={60} {...HAND.riza} />
        <No x={168} y={196} r={40} />
        <Inset x={208} y={10} w={102} h={72}>
          <Socket x={236} y={22} />
          <PlugCord plug={[262, 50]} a={0} cordFrom={[300, 66]} />
          <Ok x={290} y={26} r={10} />
        </Inset>
      </Scene2>
    );
  },

  // 2: gergin zincirde 1 m pim merkezinden pim merkezine; 15–20 mm uzamışsa değiştir
  'sf-ot-zincir-olcme': () => {
    const y = 96, p0 = 34, pitch = 21, n = 12;
    const p1 = p0 + pitch * n;
    return (
      <Scene2 bg="closeup">
        <ChainStraight x={p0 - 20} y={y} n={n + 2} pitch={pitch} />
        {/* şerit metre */}
        <OG sh={[{ d: rrect(p0 - 10, y + 30, p1 - p0 + 40, 18, 2), f: '#f5d76e' }]} />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${p0 + i * 9} ${y + 30}v${i % 5 ? 5 : 9}`} stroke={K.ink} stroke-width={1.2} />)}
        <path d={`M${p0} ${y - 2}V${y + 48}M${p1} ${y - 2}V${y + 48}`} stroke={K.danger} stroke-width={2.4} stroke-dasharray="4 3" />
        <Dim a={[p0, y + 64]} b={[p1, y + 64]} t="" />
        <Label x={(p0 + p1) / 2} y={y + 84} text="1 m" size={16} bg={K.white} />
        <Arrow from={[p0 + 40, y - 46]} to={[p0, y - 46]} w={4} />
        <Arrow from={[p1 - 40, y - 46]} to={[p1, y - 46]} w={4} />
      </Scene2>
    );
  },

  // 6: mili elle çevir ve iki yana oynat; takılma, hışırtı, boşluk = bozuk
  'sf-ot-rulman-yoklama': () => {
    const c: P = [146, 118];
    return (
      <Scene2 bg="closeup">
        <BearingFace c={c} r={74} />
        {(() => { const h0 = { x: 0, y: 0, a: 40, s: 0.95, pose: 'fist' as const, side: 'R' as const }; const q = handPoint(h0, 'grip'); const t = onC(c, 70, 128); return <Hand {...h0} x={t[0] - q[0]} y={t[1] - q[1]} arm={120} {...HAND.riza} />; })()}
        <ArcArrow c={c} r={96} a0={-150} a1={-40} />
        <Arrow from={[c[0] - 20, c[1]]} to={[c[0] - 54, c[1]]} w={5} />
        <Arrow from={[c[0] + 20, c[1]]} to={[c[0] + 54, c[1]]} w={5} />
        <Waves x={c[0] + 104} y={c[1] + 10} a={0} n={3} r={7} color={K.ink} />
      </Scene2>
    );
  },

  /* ───────── Yapıştırma ───────── */
  // 3: 2, 4, 5 numaralı plastik yapıştırıcı tutmaz; seramik ve cam epoksiyle olur
  'sf-ot-yapistirma-plastik-kod': () => (
    <Scene2 bg="closeup">
      <Panels split={176} />
      {/* bidon */}
      <OG sh={[{ d: `M24 196V120Q24 112 32 112H62L72 122V196Q72 200 68 200H28Q24 200 24 196Z`, f: '#e8e3d6' }, { d: rrect(30, 102, 14, 12, 2), f: '#2f6fd0' }, { d: rrect(52, 112, 12, 6, 3), f: '#e8e3d6' }]} />
      <RecTri x={48} y={164} n="2" />
      {/* kova */}
      <OG sh={[{ d: `M84 132H150L144 200H90Z`, f: PLASTIC_B }, { d: ell([117, 132], 33, 6), f: shade(PLASTIC_B, 0.2) }]} />
      <path d="M86 132Q117 92 148 132" fill="none" stroke={K.out} stroke-width={3} />
      <RecTri x={117} y={168} n="5" />
      {/* şişe kapağı */}
      <OG sh={[{ d: circ([92, 66], 22), f: '#d0473d' }, { d: circ([92, 66], 17), f: shade('#d0473d', 0.12) }]} />
      <RecTri x={92} y={68} n="4" s={0.8} />
      <Bad x={150} y={34} r={14} />
      {/* kırık kupa ve epoksi */}
      <Mug x={226} y={186} broken />
      <Epoxy x={206} y={222} />
      <Ok x={290} y={34} r={14} />
    </Scene2>
  ),

  // 4: polietilen kaynağı: ısıtılmış metal uç çatlakta gezdirilir, aynı plastikten şerit bastırılır
  'sf-ot-yapistirma-kaynak': () => {
    const tip: P = [168, 124];
    const crackR = pl([[tip[0], tip[1]], [184, 118], [202, 128], [222, 120], [242, 130], [262, 122], [300, 128]]);
    const bead = smooth([[26, 126], [60, 122], [96, 128], [130, 122], [tip[0] - 4, tip[1]]]);
    // ısıtılmış metal uç: sağ alttan gelir
    const rodEnd: P = [236, 196];
    // plastik şerit: yukarıdan gelir, ucu kaynak noktasında
    const stripTop: P = [214, 38];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(14, 40, 292, 168, 10), f: PLASTIC_B }]} />
        {/* henüz kaynatılmamış çatlak (sağda) */}
        <path d={crackR} stroke={K.out} stroke-width={4} fill="none" stroke-linejoin="round" />
        {/* kaynatılmış dikiş: kabarık şerit (solda) */}
        <path d={bead} stroke={K.out} stroke-width={15} stroke-linecap="round" fill="none" />
        <path d={bead} stroke={tint(PLASTIC_B, 0.22)} stroke-width={11} stroke-linecap="round" fill="none" />
        {[40, 62, 84, 106, 128, 150].map((x) => <path key={x} d={`M${x} ${tip[1] - 3}q4 4 8 0`} stroke={shade(PLASTIC_B, 0.25)} stroke-width={1.6} fill="none" />)}
        {/* aynı plastikten ince şerit */}
        <Ln d={smooth([[tip[0] + 2, tip[1] - 6], [186, 80], stripTop])} c={tint(PLASTIC_B, 0.22)} w={6} />
        {(() => { const h0 = { x: 0, y: 0, a: 160, s: 0.85, pose: 'fist' as const, side: 'L' as const, ...HAND.zeynep }; const g = handPoint(h0, 'grip'); return <Hand {...h0} x={stripTop[0] - g[0]} y={stripTop[1] + 4 - g[1]} arm={90} />; })()}
        {/* metal uç: kızarmış ucu kaynak noktasında */}
        <Ln d={`M${tip[0] + 4} ${tip[1] + 6}L${rodEnd[0]} ${rodEnd[1]}`} c="#8f9aa6" w={4} />
        <Ln d={`M${tip[0] + 4} ${tip[1] + 6}L${tip[0] + 16} ${tip[1] + 18}`} c={K.fireRed} w={4} out={false} />
        <OG sh={[{ d: capsule([rodEnd[0] - 4, rodEnd[1] - 4], 6, [rodEnd[0] + 30, rodEnd[1] + 30], 7.5), f: WOOD }]} />
        {(() => { const h0 = { x: 0, y: 0, a: -45, s: 0.85, pose: 'fist' as const, side: 'R' as const, ...HAND.zeynep }; const g = handPoint(h0, 'grip'); return <Hand {...h0} x={rodEnd[0] + 18 - g[0]} y={rodEnd[1] + 18 - g[1]} arm={90} />; })()}
        <Arrow from={[226, 96]} to={[288, 96]} w={5} />
        <path d={`M${tip[0] - 8} ${tip[1] - 14}q-8 -10 2 -20t2 -22`} stroke={K.smoke} stroke-width={3} fill="none" stroke-linecap="round" opacity={0.85} />
      </Scene2>
    );
  },

  // 6: parçalar kâğıt bantla tutturulmuş; kum kabında dik; 24 saat
  'sf-ot-yapistirma-bant': () => (
    <Scene2 bg="closeup">
      {/* kum kabı */}
      <OG sh={[{ d: `M50 150H226L214 218H62Z`, f: '#9a6a44' }, { d: ell([138, 150], 88, 12), f: SAND }]} />
      <Mug x={138} y={164} taped />
      <OG sh={[{ d: `M50 150Q138 176 226 150L214 218H62Z`, f: '#9a6a44' }]} />
      <Epoxy x={234} y={210} />
      <OG sh={[{ d: capsule([236, 222], 2, [290, 214], 2), f: '#e8c98a' }, { d: circ([291, 214], 3.6), f: '#c0392b' }]} />
    </Scene2>
  ),

  /* ───────── Cihaz arızası 1 ───────── */
  // 1: fiş prizden çekilmiş, kişinin önünde masada; sonra tornavida. Yasak: prize takılıyken açmak
  'sf-ot-cihaz-fis-cekme': () => {
    const plug: P = [184, 144];
    const sd: P = [206, 150];
    const p: PersonProps = { ...CAST.emre, x: 92, y: 226, s: 1.05, pose: { ...POSE.sitChair, spine: -88, armF: { to: [sd[0] + 4, sd[1] - 1] }, armB: { to: [plug[0] - 10, plug[1] + 4] }, face: 'neutral' } };
    return (
      <Scene2 bg="indoor">
        <Socket x={292} y={56} />
        <Table x={140} y={224} w={170} h={74} />
        <Chair x={86} y={226} s={1.05} />
        <Kettle x={262} y={150} s={0.72} />
        <PlugCord plug={plug} a={180} cordFrom={[238, 148]} />
        <Screwdriver x={sd[0]} y={sd[1]} a={-6} s={0.8} />
        <Person {...p} />
        <Arrow from={[272, 56]} to={[204, 116]} bend={0.3} w={4} />
        <Ok x={176} y={112} r={12} />
        <Inset x={10} y={10} w={116} h={92}>
          <Socket x={100} y={34} s={0.8} />
          <PlugCord plug={[100, 34]} a={-90} cordFrom={[62, 88]} s={0.75} />
          <Kettle x={46} y={92} s={0.55} lidOpen />
          <Screwdriver x={112} y={74} a={200} s={0.55} />
          <No x={66} y={56} r={36} />
        </Inset>
      </Scene2>
    );
  },

  // 4: kablo fişin hemen arkasında bükülüp yoklanır; açılmış yalıtım, görünen bakır. Fiş prizde değil
  'sf-ot-cihaz-kablo-yoklama': () => {
    const plug: P = [70, 150];
    const pts: P[] = [[84, 150], [112, 146], [146, 128], [190, 112], [240, 118], [330, 140]];
    const dmg: P = [112, 146];
    const h1 = { x: 0, y: 0, a: 10, s: 0.95, pose: 'fist' as const, side: 'L' as const };
    const q1 = handPoint(h1, 'grip');
    const h2 = { x: 0, y: 0, a: -14, s: 0.95, pose: 'fist' as const, side: 'R' as const };
    const q2 = handPoint(h2, 'grip');
    return (
      <Scene2 bg="closeup">
        <Socket x={282} y={40} />
        <Ln d={smooth(pts)} c="#3b3f4b" w={9} />
        {/* yalıtımı açılmış yer */}
        <g>
          <ellipse cx={dmg[0]} cy={dmg[1]} rx={10} ry={6} fill={COPPER} stroke={K.out} stroke-width={1.4} transform={`rotate(-20 ${dmg[0]} ${dmg[1]})`} />
          <path d={`M${dmg[0] - 6} ${dmg[1] + 2}l12 -6M${dmg[0] - 4} ${dmg[1] + 5}l11 -6M${dmg[0] - 7} ${dmg[1] - 2}l5 -2`} stroke="#f0b27a" stroke-width={1.4} />
        </g>
        <PlugCord plug={plug} a={180} cordFrom={[84, 150]} s={1.4} />
        <Hand {...h1} x={plug[0] - 2 - q1[0]} y={plug[1] + 2 - q1[1]} arm={120} {...HAND.emre} />
        <Hand {...h2} x={176 - q2[0]} y={118 - q2[1]} arm={120} {...HAND.emre} />
        <circle cx={dmg[0]} cy={dmg[1]} r={24} fill="none" stroke="#fff" stroke-width={7} />
        <circle cx={dmg[0]} cy={dmg[1]} r={24} fill="none" stroke={K.action} stroke-width={4} />
        <ArcArrow c={[176, 150]} r={56} a0={-150} a1={-100} w={4} />
      </Scene2>
    );
  },

  // 7: mikrodalga fırın ve tüplü televizyon açılmaz
  'sf-ot-cihaz-yasak-mikrodalga': () => (
    <Scene2 bg="indoor">
      <Table x={14} y={226} w={292} h={70} />
      {/* mikrodalga */}
      <OG sh={[
        { d: rrect(28, 82, 124, 74, 6), f: '#e8e3d6' },
        { d: rrect(36, 90, 82, 58, 4), f: '#3b4a5e' },
        { d: rrect(124, 92, 22, 54, 3), f: '#c9d1d9' },
      ]} />
      {[0, 1, 2].map((i) => <rect key={i} x={128} y={100 + i * 14} width={14} height={8} rx={2} fill="#5d6672" />)}
      {/* tüplü televizyon */}
      <OG sh={[
        { d: `M188 70H292V156H188Z`, f: '#6f7884' },
        { d: `M262 74H298L302 150H262Z`, f: shade('#6f7884', 0.2) },
        { d: rrect(196, 78, 70, 58, 12), f: '#2f3d4f' },
        { d: rrect(198, 142, 66, 8, 2), f: '#5d6672' },
      ]} />
      <path d="M204 88Q214 82 226 86" stroke="#fff" stroke-width={3} fill="none" opacity={0.5} stroke-linecap="round" />
      <No x={90} y={118} r={50} />
      <No x={240} y={112} r={50} />
      <Zap x={90} y={40} s={1.2} />
      <Zap x={240} y={34} s={1.2} />
    </Scene2>
  ),

  /* ───────── Cihaz arızası 2: ölçü aleti ───────── */
  // 2: siyah uç COM, kırmızı uç VΩ; A soketi değil
  'sf-ot-olcum-soket': () => {
    const s = 1.3, mx = 70, my = 14;
    const sk = (i: number): P => [mx + (20 + i * 30) * s, my + 140 * s];
    return (
      <Scene2 bg="closeup">
        <Meter x={mx} y={my} s={s} mode="beep" />
        <Ln d={smooth([sk(1), [sk(1)[0] + 6, 236], [260, 250]])} c="#1f1f24" w={5} />
        <Ln d={smooth([sk(2), [sk(2)[0] + 30, 206], [320, 220]])} c={K.red} w={5} />
        <Ok x={sk(2)[0] + 34} y={sk(2)[1] - 30} r={13} />
        <Bad x={sk(0)[0] - 28} y={sk(0)[1] - 22} r={12} />
        <circle cx={sk(0)[0]} cy={sk(0)[1]} r={13} fill="none" stroke={K.danger} stroke-width={3} />
      </Scene2>
    );
  },

  // 4: kablo sürekliliği: bir uç fiş bacağında, öbürü cihaz içindeki bağlantıda; kablo bükülür
  'sf-ot-olcum-kablo': () => {
    const plug: P = [52, 112];
    const pin: P = [24, 115];
    const term: P = [256, 128];
    const cab: P[] = [[66, 112], [92, 96], [124, 70], [150, 62], [182, 76], [212, 100], [226, 108]];
    const bend: P = [146, 64];
    const h = { x: 0, y: 0, a: 180, s: 0.85, pose: 'fist' as const, side: 'R' as const };
    const q = handPoint(h, 'grip');
    const ms = 0.55, mx = 118, my = 148;
    const sock = (i: number): P => [mx + (20 + i * 30) * ms, my + 140 * ms];
    return (
      <Scene2 bg="closeup">
        {/* kapağı açık cihaz: içte vidalı bağlantı */}
        <OG sh={[{ d: rrect(214, 52, 98, 120, 8), f: '#c9d1d9' }, { d: rrect(226, 64, 76, 96, 5), f: '#3b3f4b' }, { d: rrect(240, 112, 40, 32, 3), f: '#e8e3d6' }]} />
        <Ln d={smooth(cab)} c="#3b3f4b" w={7} />
        <Ln d={smooth([[226, 108], [238, 112], [term[0] - 4, term[1] - 2]])} c={COPPER} w={3} />
        <Screw c={term} />
        <PlugCord plug={plug} a={180} cordFrom={[66, 112]} s={1.1} />
        <Hand {...h} x={bend[0] - q[0]} y={bend[1] - q[1]} arm={120} {...HAND.emre} />
        <ArcArrow c={[bend[0], bend[1] - 4]} r={40} a0={150} a1={30} w={4} />
        <Meter x={mx} y={my} s={ms} mode="beep" />
        <Probe tip={[pin[0] + 2, pin[1] + 4]} a={-80} from={sock(1)} col="#1f1f24" />
        <Probe tip={[term[0] - 5, term[1] + 5]} a={-40} from={sock(2)} col={K.red} />
        <Waves x={mx + 62} y={my + 24} a={0} n={3} r={6} />
      </Scene2>
    );
  },

  // 8: güvenlik denetimi: fiş bacakları kıskaçla birleşik; bir uç bacaklarda, öbürü metal gövdede; OL = iyi
  'sf-ot-olcum-govde': () => {
    const plug: P = [60, 108];
    const ms = 0.62, mx = 92, my = 100;
    const com: P = [mx + 50 * ms, my + 140 * ms], vo: P = [mx + 80 * ms, my + 140 * ms];
    const blackTip: P = [46, 78], redTip: P = [216, 112];
    const probeBody = (tip: P, a: number, col: string) => (
      <g transform={tr(tip[0], tip[1], 1, a)}>
        <OG sh={[{ d: rrect(-12, -1.5, 12, 3, 1), f: '#c9d1d9' }, { d: `M-46 -5H-14L-12 -3V3L-14 5H-46Z`, f: col }, { d: rrect(-20, -7, 4, 14, 1), f: col }]} />
      </g>
    );
    const bBack = onC(blackTip, 46, -30 + 180), rBack = onC(redTip, 46, 180);
    return (
      <Scene2 bg="closeup">
        {/* metal gövdeli cihaz; düğmesi açık (I) */}
        <Ln d={`M250 176Q254 210 246 240`} c="#3b3f4b" w={4} />
        <OG sh={[{ d: rrect(214, 60, 96, 116, 10), f: '#b8c0c8' }, { d: rrect(224, 70, 76, 50, 6), f: '#9aa3ad' }, { d: rrect(232, 134, 26, 30, 4), f: '#2b2d3a' }, { d: rrect(236, 138, 18, 12, 2), f: K.safe }]} />
        {[82, 94, 106].map((y) => <path key={y} d={`M232 ${y}H292`} stroke="#7f8a97" stroke-width={3} stroke-linecap="round" />)}
        <T x={245} y={148} t="I" s={11} c="#fff" />
        {/* fiş: iki bacak kırmızı kıskaçla birleşik */}
        <Ln d={`M${plug[0]} ${plug[1] + 18}Q${plug[0] + 4} 190 ${plug[0] - 14} 240`} c="#3b3f4b" w={4} />
        <PlugCord plug={plug} a={-90} cordFrom={[plug[0], plug[1] + 20]} s={1.3} />
        <OG sh={[{ d: rrect(plug[0] - 15, plug[1] - 36, 30, 10, 3), f: '#d0473d' }]} />
        {/* ölçü aleti en yüksek Ω'da, ekranda OL */}
        <Meter x={mx} y={my} s={ms} mode="ohm" disp="OL" />
        <Ok x={mx + 70} y={my + 4} r={13} />
        {/* siyah uç kıskaçta, kırmızı uç metal gövdede */}
        <Ln d={smooth([com, [com[0] - 8, 230], [40, 228], [10, 170], bBack])} c="#1f1f24" w={3.2} />
        <Ln d={smooth([vo, [vo[0] + 10, 226], [rBack[0] + 6, 190], rBack])} c={K.red} w={3.2} />
        {probeBody(blackTip, -30, '#1f1f24')}
        {probeBody(redTip, 0, K.red)}
      </Scene2>
    );
  },

  /* ───────── Kristal radyo 1 ───────── */
  // 4: 9 cm boruya 60 bitişik sarım; 20. ve 40. sarımda ara uç
  'sf-ot-kristal-bobin': () => {
    const x = 50, y = 118, w = 230, r = 46;
    const wx0 = x + w * 0.1, wx1 = x + w * 0.9;
    const tap = (t: number) => wx0 + (wx1 - wx0) * t;
    return (
      <Scene2 bg="closeup">
        <Coil x={x} y={y} w={w} r={r} n={40} taps={[1 / 3, 2 / 3]} />
        <Ln d={`M${wx0 + 2} ${y + r}Q${wx0 - 10} ${y + r + 26} ${wx0 - 34} ${y + r + 30}`} c={COPPER} w={3} />
        <Ln d={`M${wx1 - 2} ${y + r}Q${wx1 + 10} ${y + r + 26} ${wx1 + 30} ${y + r + 30}`} c={COPPER} w={3} />
        <circle cx={wx0 + 4} cy={y + r - 6} r={3} fill={K.out} />
        <circle cx={wx1 - 4} cy={y + r - 6} r={3} fill={K.out} />
        <Label x={tap(1 / 3)} y={y - r - 34} text="20" size={15} bg={K.white} />
        <Label x={tap(2 / 3)} y={y - r - 34} text="40" size={15} bg={K.white} />
        <Dim a={[x - 18, y - r]} b={[x - 18, y + r]} t="" />
        <T x={x - 4} y={y - r - 12} t="9 cm" s={15} a="start" />
        <Label x={160} y={212} text="60 sarım" size={16} bg={K.white} />
      </Scene2>
    );
  },

  // 6: parçalar
  'sf-ot-kristal-parcalar': () => (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(10, 14, 300, 212, 10), f: '#e3c79a' }]} />
      <Coil x={22} y={74} w={110} r={26} n={20} />
      <VarCap x={186} y={72} s={1.1} />
      <T x={186} y={116} t="365 pF" s={14} />
      <Earpiece c={[272, 66]} s={1.1} />
      <Ln d={smooth([[272, 96], [266, 120], [288, 132], [296, 110]])} c="#2b2d3a" w={2.6} />
      {/* tel makarası */}
      <OG sh={[{ d: rrect(26, 150, 54, 46, 6), f: '#8a5a36' }, { d: rrect(32, 156, 42, 34, 3), f: COPPER }]} />
      {[162, 170, 178, 186].map((yy) => <path key={yy} d={`M34 ${yy}H72`} stroke={shade(COPPER, 0.3)} stroke-width={1.3} />)}
      <Diode a={[102, 170]} b={[196, 170]} />
      <T x={149} y={200} t="1N34A" s={14} />
      <g>
        <path d="M214 170H300" stroke={K.out} stroke-width={4.5} />
        <path d="M214 170H300" stroke="#c9d1d9" stroke-width={2.4} />
        <OG sh={[{ d: rrect(238, 162, 38, 16, 7), f: '#e8cfa2' }]} />
        {[246, 254, 262].map((xx, i) => <rect key={xx} x={xx} y={162} width={4} height={16} fill={['#8a5a36', K.out, '#e3a23a'][i]} />)}
      </g>
      <T x={257} y={200} t="10–100 kΩ" s={13} />
    </Scene2>
  ),

  // 9: devre: kondansatör bobine paralel; bobin üstü antene, altı toprağa; diyot üst uçtan kulaklığa; kulaklığın öbür ucu toprağa
  'sf-ot-kristal-devre': () => {
    const yT = 56, yB = 192;
    const ant: P = [40, yT], gnd: P = [40, yB];
    const cx = 104, kx = 172, e1: P = [254, 96], e2: P = [254, 160];
    const W = '#4b4f5c';
    const wire = (pts: P[]) => <Ln d={pl(pts)} c={W} w={3.2} />;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(12, 24, 296, 196, 10), f: '#e3c79a' }]} />
        {/* dış anten ve toprak telleri */}
        <Ln d={`M${ant[0]} ${ant[1]}L14 30`} c={COPPER} w={3} />
        <Ln d={`M${gnd[0]} ${gnd[1]}L14 214`} c={COPPER} w={3} />
        {/* üst hat (anten düğümü) */}
        {wire([ant, [cx, yT], [cx, 76]])}
        {wire([[cx, yT], [kx, yT], [kx, 98]])}
        {wire([[kx, yT], [200, yT]])}
        <Diode a={[200, yT]} b={[e1[0], yT]} />
        {wire([[e1[0], yT], e1])}
        {/* alt hat (toprak) */}
        {wire([gnd, [cx, yB], [cx, 172]])}
        {wire([[cx, yB], [kx, yB], [kx, 140]])}
        {wire([[kx, yB], [e2[0], yB], e2])}
        {/* bobin (dik) */}
        <g>
          <OG sh={[{ d: rrect(cx - 24, 76, 48, 96, 4), f: '#e8e3d6' }, { d: rrect(cx - 25, 84, 50, 80, 2), f: COPPER }]} />
          {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${cx - 25} ${86 + i * 5}L${cx + 25} ${88 + i * 5}`} stroke={shade(COPPER, 0.35)} stroke-width={1.2} />)}
        </g>
        <VarCap x={kx} y={119} s={0.95} />
        {/* kulaklık uçları ve kulaklık */}
        <Screw c={e1} />
        <Screw c={e2} />
        <Ln d={smooth([e1, [276, 104], [284, 118]])} c="#2b2d3a" w={2.6} />
        <Ln d={smooth([e2, [276, 152], [284, 140]])} c="#2b2d3a" w={2.6} />
        <Earpiece c={[288, 120]} s={0.85} />
        {[[cx, yT], [kx, yT], [cx, yB], [kx, yB]].map((c, i) => <Dot key={i} c={c as P} />)}
        <Screw c={ant} />
        <Screw c={gnd} />
        <T x={54} y={44} t="ANTEN" s={13} a="start" />
        <T x={54} y={212} t="TOPRAK" s={13} a="start" />
      </Scene2>
    );
  },

  /* ───────── Kristal radyo 2 ───────── */
  // 1: iki ağaç arasında yüksekte gerili 30 m+ tel; uçlarda yalıtkan; inen tel kulübeye
  'sf-ot-kristal-anten-germe': () => {
    const L: P = [52, 48], R: P = [212, 52];
    return (
      <Scene2 bg="outdoor">
        <Tree x={30} y={206} s={1.55} kind="pine" />
        <Tree x={232} y={204} s={1.45} kind="pine" />
        <Hut x={240} y={214} w={74} h={56} />
        <Ln d={`M30 ${L[1]}L${L[0] - 9} ${L[1]}`} c={ROPE} w={2.4} />
        <Ln d={`M232 ${R[1]}L${R[0] + 9} ${R[1]}`} c={ROPE} w={2.4} />
        <Ln d={`M${L[0] + 9} ${L[1]}Q${(L[0] + R[0]) / 2} ${L[1] + 12} ${R[0] - 9} ${R[1]}`} c={COPPER} w={2.6} />
        <Insul c={L} />
        <Insul c={R} />
        <Ln d={smooth([[R[0] - 12, R[1] + 2], [R[0] - 8, 120], [250, 168], [264, 182]])} c={COPPER} w={2.4} />
        <Label x={132} y={82} text="30 m+" size={16} />
      </Scene2>
    );
  },

  // 5: toprağa 1 m'den derin çakılmış metal çubuk; kıskaçlı tel radyoya; çevresi sulanır
  'sf-ot-kristal-toprak': () => {
    const gy = 150, rx = 160;
    const p: PersonProps = { ...CAST.selin, x: 96, y: 157, s: 0.84, pose: { ...POSE.standSide, spine: -80, chest: -70, head: -60, armF: { to: [132, 96] }, armB: { to: [122, 104] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={gy}>
        <rect x={0} y={gy + 6} width={320} height={84} fill="#8a6342" />
        {Array.from({ length: 24 }, (_, i) => <ellipse key={i} cx={(i * 53) % 320} cy={gy + 16 + ((i * 29) % 64)} rx={3} ry={2} fill={shade('#8a6342', 0.2)} />)}
        <rect x={0} y={gy} width={320} height={8} fill={K.grass} stroke={K.out} stroke-width={1.2} />
        <ellipse cx={rx} cy={gy + 22} rx={34} ry={14} fill="#5e4430" opacity={0.7} />
        <Hut x={244} y={gy + 4} w={76} h={70} />
        <OG sh={[{ d: rrect(rx - 4, 112, 8, 120, 2), f: STEEL }, { d: rrect(rx - 9, 118, 18, 8, 2), f: '#c0a040' }]} />
        <Ln d={smooth([[rx + 9, 122], [210, 112], [250, 108], [262, 100]])} c={COPPER} w={2.6} />
        <Dim a={[rx - 24, gy + 4]} b={[rx - 24, 230]} t="" />
        <Label x={rx - 56} y={196} text="1 m+" size={14} bg={K.white} />
        {/* sürahi ve su */}
        <Person {...p} mid={(r) => (
          <g>
            <g transform={`rotate(-50 ${r.handF[0]} ${r.handF[1]})`}>
              <OG sh={[
                { d: `M${r.handF[0] - 12} ${r.handF[1] - 22}H${r.handF[0] + 10}L${r.handF[0] + 14} ${r.handF[1] + 14}Q${r.handF[0]} ${r.handF[1] + 20} ${r.handF[0] - 14} ${r.handF[1] + 14}Z`, f: '#7fb2d9' },
                { d: `M${r.handF[0] - 12} ${r.handF[1] - 22}L${r.handF[0] - 22} ${r.handF[1] - 28}L${r.handF[0] - 10} ${r.handF[1] - 16}Z`, f: '#7fb2d9' },
              ]} />
            </g>
          </g>
        )} />
        <path d="M146 92Q152 118 152 148" stroke={SEA} stroke-width={4} fill="none" stroke-linecap="round" />
      </Scene2>
    );
  },

  /* ───────── Anten ───────── */
  // 3: dipol: iki eşit kol; toplam = 143 ÷ MHz; FM 71,5 + 71,5 cm
  'sf-ot-anten-dipol': () => {
    const y = 104, c = 160, L = 26, R = 294;
    return (
      <Scene2 bg="closeup">
        <Ln d={`M14 ${y}H${L}`} c={ROPE} w={2.4} />
        <Ln d={`M${R} ${y}H306`} c={ROPE} w={2.4} />
        <Ln d={`M${L + 6} ${y}H${c - 10}`} c={COPPER} w={3.4} />
        <Ln d={`M${c + 10} ${y}H${R - 6}`} c={COPPER} w={3.4} />
        <Insul c={[L, y]} />
        <Insul c={[R, y]} />
        <OG sh={[{ d: rrect(c - 12, y - 12, 24, 24, 4), f: '#e8e3d6' }]} />
        <Ln d={`M${c} ${y + 12}V236`} c="#2b2d3a" w={7} />
        <Dim a={[c - 10, y - 26]} b={[L + 6, y - 26]} t="" />
        <Dim a={[c + 10, y - 26]} b={[R - 6, y - 26]} t="" />
        <Label x={(c + L) / 2} y={y - 44} text="71,5 cm" size={14} bg={K.white} />
        <Label x={(c + R) / 2} y={y - 44} text="71,5 cm" size={14} bg={K.white} />
        <Label x={160} y={26} text="toplam = 143 ÷ MHz" size={15} />
        <T x={196} y={168} t="FM 100 MHz" s={14} a="start" c="#5d6672" />
      </Scene2>
    );
  },

  // 4–5: orta yalıtkan: orta tel bir kola, örgü öbür kola; kollar birbirine değmez; silikonla kapatılır
  'sf-ot-anten-orta-yalitkan': () => {
    const y = 96;
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(112, 70, 96, 54, 6), f: '#e8e3d6' }]} />
        <Ln d={`M10 ${y}H128`} c={COPPER} w={5} />
        <Ln d={`M310 ${y}H192`} c={COPPER} w={5} />
        <OG sh={[{ d: circ([128, y], 7), f: '#c9d1d9' }, { d: circ([192, y], 7), f: '#c9d1d9' }]} />
        {/* koaksiyel: dış kılıf, örgü, orta yalıtım ve iletken */}
        <Ln d={`M160 240V170`} c="#2b2d3a" w={16} />
        <Ln d={smooth([[154, 170], [140, 140], [128, 104]])} c="#aab3bd" w={6} dash="3 2" />
        <Ln d={`M166 170V150`} c="#f4f1ea" w={8} />
        <Ln d={smooth([[166, 150], [176, 126], [190, 104]])} c={COPPER} w={3} />
        {/* silikon */}
        <ellipse cx={190} cy={100} rx={14} ry={10} fill="#ffffff" opacity={0.85} stroke={K.out} stroke-width={1.2} />
        <OG sh={[{ d: `M204 92L236 60L250 72L214 100Z`, f: '#f4f1ea' }, { d: rrect(236, 40, 40, 30, 6, ), f: '#3d7ad6', t: 'rotate(-42 256 55)' }]} />
        <Hand x={300} y={30} a={-130} s={0.8} pose="fist" side="L" arm={80} {...HAND.selin} />
      </Scene2>
    );
  },

  // 7: direk devrilse bile hatta değmesin: uzaklık ≥ 2 × boy. Yasak: hattın altında direk
  'sf-ot-anten-hat-uzaklik': () => {
    const mx = 96, top = 82, gy = 204;
    const H = gy - top;
    return (
      <Scene2 bg="outdoor" gy={gy}>
        {/* direk ve gergiler */}
        <OG sh={[{ d: rrect(mx - 3, top, 6, H, 2), f: '#9aa3ad' }, { d: rrect(mx - 26, top - 3, 52, 5, 2), f: COPPER }]} />
        <path d={`M${mx} ${top + 30}L${mx - 40} ${gy}M${mx} ${top + 30}L${mx + 40} ${gy}`} stroke={ROPE} stroke-width={2} />
        {/* devrilme yayı */}
        <path d={`M${mx} ${top}A${H} ${H} 0 0 1 ${mx + H} ${gy}`} fill="none" stroke={K.ink} stroke-width={2.2} stroke-dasharray="6 5" />
        <Dim a={[mx - 46, top]} b={[mx - 46, gy]} t="" />
        <T x={mx - 54} y={top + H / 2 + 5} t="boy" s={13} a="end" />
        {/* elektrik direkleri ve hatlar */}
        <PowerPole x={292} y={gy} h={104} />
        <path d={`M240 ${gy - 98}L320 ${gy - 99}M240 ${gy - 90}L320 ${gy - 91}`} stroke={K.out} stroke-width={1.8} />
        <Dim a={[mx, 222]} b={[292, 222]} t="" />
        <Label x={181} y={208} text="≥ 2 × boy" size={14} />
        <Ok x={mx + H + 20} y={gy - 30} r={12} />
        <Inset x={186} y={10} w={124} h={72}>
          <path d="M186 28H310M186 36H310" stroke={K.out} stroke-width={2} />
          <OG sh={[{ d: rrect(246, 30, 5, 52, 1), f: '#9aa3ad' }]} />
          <Zap x={286} y={60} s={0.8} />
          <No x={248} y={46} r={30} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── Yelkenli sal ───────── */
  // 1: salda herkes can yeleği giyer; çocuk da
  'sf-ot-yelken-can-yelegi': () => {
    const ry = 182;
    const k: PersonProps = { ...CAST.kemal, x: 178, y: ry + 2, s: 1.0, pose: { ...POSE.stand, armB: { at: 'belly', d: [-4, -6] }, armF: { at: 'belly', d: [4, -6] }, face: 'neutral' } };
    const e: PersonProps = { ...CAST.ela, x: 252, y: ry + 2, s: 1.0, pose: { ...POSE.stand, armB: { at: 'belly', d: [-3, -4] }, armF: { at: 'belly', d: [3, -4] }, face: 'neutral' } };
    return (
      <Scene2 bg="outdoor" gy={150}>
        <Sea y={150} />
        <path d="M0 150H96Q120 170 104 240H0Z" fill={SAND} stroke={K.out} stroke-width={1.5} />
        <Raft x={128} y={ry} w={180} />
        <Person {...k} mid={(r) => vest(r, true)} />
        <Person {...e} mid={(r) => vest(r, true)} />
        <Person who="woman" role="bystander" skin={1} hair="scarf" hairC="#6c9c5a" x={48} y={214} s={0.95} pose={{ ...POSE.wave, face: 'calm' }} />
        <Ok x={290} y={36} r={14} />
      </Scene2>
    );
  },

  // 2: öğleden sonra deniz meltemi karaya (çık); gece/sabah kara meltemi açığa (çıkma)
  'sf-ot-yelken-ruzgar-yonu': () => {
    const land = (x: number, w: number) => <path d={`M${x} 12H${x + w}V64Q${x + w * 0.7} 74 ${x + w * 0.4} 66Q${x + w * 0.2} 60 ${x} 70Z`} fill={K.grass} stroke={K.out} stroke-width={1.5} />;
    const raftTop = (x: number, y: number) => <OG sh={[{ d: rrect(x - 12, y - 8, 24, 16, 3), f: '#a36f45' }, { d: `M${x - 4} ${y - 8}V${y + 8}M${x + 4} ${y - 8}V${y + 8}`, st: shade('#a36f45', 0.3), sw: 1.2 }]} />;
    return (
      <Scene2 bg="closeup">
        <defs>
          <clipPath id="ot-rz-l"><rect x={10} y={10} width={145} height={220} rx={12} /></clipPath>
          <clipPath id="ot-rz-r"><rect x={165} y={10} width={145} height={220} rx={12} /></clipPath>
        </defs>
        <g clip-path="url(#ot-rz-l)">
          <rect x={10} y={10} width={145} height={220} fill={SEA} />
          {land(10, 145)}
          {[40, 82, 124].map((x) => <Arrow key={x} from={[x, 196]} to={[x, 130]} w={5} color="#e8f4ff" />)}
          {raftTop(96, 92)}
        </g>
        <g clip-path="url(#ot-rz-r)">
          <rect x={165} y={10} width={145} height={220} fill={SEA_D} />
          {land(165, 145)}
          {[196, 238, 280].map((x) => <Arrow key={x} from={[x, 84]} to={[x, 150]} w={5} color="#e8f4ff" />)}
          <path d="M226 82Q236 140 252 186" stroke="#fff" stroke-width={2.4} stroke-dasharray="5 4" fill="none" />
          {raftTop(254, 198)}
        </g>
        <rect x={10} y={10} width={145} height={220} rx={12} fill="none" stroke={K.out} stroke-width={1.5} />
        <rect x={165} y={10} width={145} height={220} rx={12} fill="none" stroke={K.out} stroke-width={1.5} />
        <OG sh={[{ d: circ([36, 36], 13), f: '#ffd23f' }]} />
        <path d="M296 24A13 13 0 1 0 300 50A10 10 0 1 1 296 24Z" fill="#f4f1ea" stroke={K.out} stroke-width={1.5} />
        <Ok x={132} y={34} r={13} />
        <Bad x={192} y={208} r={13} />
      </Scene2>
    );
  },

  // 5: yelkenin iki alt köşe ipi elde; hiçbir yere bağlanmaz
  'sf-ot-yelken-ip-elde': () => {
    const ry = 176, mast = 214;
    const k: PersonProps = { ...CAST.kemal, x: 112, y: ry, s: 0.95, pose: { ...POSE.sitFloor, spine: -82, armB: { to: [146, 128] }, armF: { to: [150, 136] }, legB: [6, 30], legF: [2, 36], face: 'neutral' } };
    const cL: P = [192, 140], cR: P = [250, 132];
    const kr = rig(k);
    return (
      <Scene2 bg="outdoor" gy={170}>
        <Sea y={170} />
        {/* dümen küreği */}
        <OG sh={[{ d: capsule([70, 150], 3.2, [34, 216], 3.6), f: WOOD }, { d: `M30 206L44 212L36 232L22 226Z`, f: WOOD }]} />
        <Raft x={56} y={ry} w={240} />
        {/* direk ve gergiler */}
        <OG sh={[{ d: rrect(mast - 3, 40, 6, ry - 40, 2), f: WOOD }]} />
        <path d={`M${mast} 44L60 ${ry}M${mast} 44L292 ${ry}`} stroke={ROPE} stroke-width={1.8} />
        {/* kare yelken, rüzgârla dolmuş (yarı yandan): üst sırık eğik, yelken sağa şişkin */}
        <OG sh={[
          { d: `M${mast - 22} 60L${mast + 30} 50Q${mast + 62} 92 ${cR[0]} ${cR[1]}Q${mast + 4} ${cR[1] + 14} ${cL[0]} ${cL[1]}Q${mast - 2} 100 ${mast - 22} 60Z`, f: '#efe6cf' },
          { d: `M${mast + 4} 56Q${mast + 30} 96 ${mast + 10} ${cL[1] + 6}`, st: shade('#efe6cf', 0.2), sw: 1.4 },
          { d: capsule([mast - 30, 61], 3.2, [mast + 38, 48], 3.2), f: WOOD },
        ]} />
        <Person {...k} mid={(r) => vest(r, false)} />
        <Ln d={`M${cL[0]} ${cL[1]}L${kr.handB[0] + 2} ${kr.handB[1]}`} c={ROPE} w={2.2} />
        <Ln d={`M${cR[0]} ${cR[1]}Q${(cR[0] + kr.handF[0]) / 2} ${cR[1] + 16} ${kr.handF[0] + 2} ${kr.handF[1]}`} c={ROPE} w={2.2} />
        <Arrow from={[20, 92]} to={[70, 92]} color={K.water} w={5} />
        <Arrow from={[20, 116]} to={[70, 116]} color={K.water} w={5} />
        <Inset x={222} y={160} w={90} h={72}>
          <OG sh={[{ d: rrect(222, 210, 90, 24, 4), f: '#a36f45' }, { d: rrect(262, 186, 10, 26, 2), f: WOOD }]} />
          <Ln d="M226 166Q250 178 262 192" c={ROPE} w={2.6} />
          <Ln d="M262 192Q276 194 272 202Q262 206 262 198" c={ROPE} w={2.6} />
          <No x={266} y={196} r={28} />
        </Inset>
      </Scene2>
    );
  },

  /* ───────── Kıyı seyri ───────── */
  // 5: önde alçak kaya, arkada tepedeki ağaç üst üste görünüyor; çizgi sala kadar uzanıyor
  'sf-ot-kiyi-hizalama': () => {
    const x = 166;
    return (
      <Scene2 bg="outdoor" gy={128}>
        <path d="M0 128Q80 70 160 84Q240 70 320 112V140H0Z" fill={K.hill} stroke={K.out} stroke-width={1.5} />
        <Tree x={x} y={92} s={0.5} kind="leaf" />
        <rect x={0} y={128} width={320} height={10} fill={SAND} />
        <Sea y={136} />
        <Rock x={x} y={140} s={0.75} />
        <path d={`M${x} 64L${x} 214`} stroke="#fff" stroke-width={6} stroke-dasharray="10 7" opacity={0.85} />
        <path d={`M${x} 64L${x} 214`} stroke={K.action} stroke-width={3.4} stroke-dasharray="10 7" />
        {/* sal (bakan kişinin güvertesi, önde) */}
        <OG sh={[{ d: `M60 214H272L300 240H32Z`, f: '#a36f45' }]} />
        {[110, 160, 210, 250].map((xx) => <path key={xx} d={`M${xx} 214L${xx + (xx - 166) * 0.15} 240`} stroke={shade('#a36f45', 0.3)} stroke-width={1.6} />)}
        <Ok x={x + 34} y={180} r={13} />
      </Scene2>
    );
  },

  // 6: durunca iki işaret ayrılıyorsa akıntı kaydırıyor; kürekle kıyıya yaklaş
  'sf-ot-kiyi-surukleme': () => {
    const panel = (x0: number, tx: number, rx: number, ok: boolean) => (
      <g>
        <rect x={x0} y={10} width={145} height={220} fill={K.sky} />
        <path d={`M${x0} 110Q${x0 + 70} 60 ${x0 + 145} 96V120H${x0}Z`} fill={K.hill} stroke={K.out} stroke-width={1.5} />
        <Tree x={tx} y={84} s={0.42} kind="leaf" />
        <rect x={x0} y={114} width={145} height={10} fill={SAND} />
        <Sea y={122} x={x0} w={145} h={240} />
        <Rock x={rx} y={128} s={0.6} />
        <OG sh={[{ d: `M${x0 + 20} 212H${x0 + 125}L${x0 + 140} 240H${x0 + 5}Z`, f: '#a36f45' }]} />
        {ok ? <Ok x={x0 + 120} y={36} r={12} /> : <Bad x={x0 + 120} y={36} r={12} />}
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <defs>
          <clipPath id="ot-sk-l"><rect x={10} y={10} width={145} height={220} rx={12} /></clipPath>
          <clipPath id="ot-sk-r"><rect x={165} y={10} width={145} height={220} rx={12} /></clipPath>
        </defs>
        <g clip-path="url(#ot-sk-l)">{panel(10, 82, 82, true)}
          <path d="M82 60V200" stroke={K.action} stroke-width={3} stroke-dasharray="8 6" />
        </g>
        <g clip-path="url(#ot-sk-r)">{panel(165, 278, 206, false)}
          {[[176, 160], [200, 186], [230, 158]].map(([x, y], i) => <Arrow key={i} from={[x, y]} to={[x + 40, y]} w={4} color="#e8f4ff" />)}
          <Arrow from={[238, 210]} to={[238, 168]} w={6} />
        </g>
        <rect x={10} y={10} width={145} height={220} rx={12} fill="none" stroke={K.out} stroke-width={1.5} />
        <rect x={165} y={10} width={145} height={220} rx={12} fill="none" stroke={K.out} stroke-width={1.5} />
      </Scene2>
    );
  },

  // 7: ucunda taş, her metrede düğüm olan iple derinlik; dalgaların kırıldığı açık renk sığlıktan uzak dur
  'sf-ot-kiyi-iskandil': () => {
    const sy = 108;
    const lx = 142;
    const k: PersonProps = { ...CAST.kemal, x: 108, y: sy - 2, s: 0.72, pose: { ...POSE.kneel, spine: -70, chest: -55, head: -40, armF: { to: [lx - 2, sy - 8] }, armB: { to: [lx - 6, sy - 18] }, face: 'neutral' } };
    const bed = `M0 226L120 222L200 200L250 140L280 126L320 124V240H0Z`;
    return (
      <Scene2 bg="outdoor" gy={sy}>
        <rect x={0} y={sy} width={320} height={148} fill={SEA_D} />
        <path d={`M214 ${sy}H320V124L280 126L250 140Z`} fill={tint(SEA, 0.35)} />
        <rect x={0} y={sy} width={320} height={5} fill={tint(SEA, 0.35)} />
        <path d={bed} fill="#c9a77a" stroke={K.out} stroke-width={1.5} />
        <Rock x={262} y={132} s={0.6} />
        <Rock x={296} y={126} s={0.5} />
        {/* kırılan dalgalar */}
        {[236, 266, 296].map((x) => <path key={x} d={`M${x - 16} ${sy}Q${x - 6} ${sy - 16} ${x + 8} ${sy - 10}Q${x} ${sy - 4} ${x + 4} ${sy}Z`} fill="#fff" stroke={K.out} stroke-width={1.2} />)}
        <Raft x={22} y={sy - 6} w={114} />
        <Person {...k} mid={(r) => vest(r, false)} />
        {/* iskandil ipi: her metrede düğüm, dipte taş */}
        <Ln d={`M${lx} ${sy - 24}V206`} c={ROPE} w={2.4} />
        {[132, 152, 172, 192].map((y) => <circle key={y} cx={lx} cy={y} r={3.6} fill={ROPE} stroke={K.out} stroke-width={1.3} />)}
        <OG sh={[{ d: ell([lx, 212], 10, 7), f: K.rock }]} />
        <Bad x={262} y={64} r={14} />
      </Scene2>
    );
  },

  /* ───────── Teknik kategori kapağı ───────── */
  'sf-ot-teknik-kapak': () => {
    const k: PersonProps = { ...CAST.kemal, x: 204, y: 186, s: 0.66, pose: { ...POSE.sitFloor, spine: -84, armB: { to: [228, 160] }, armF: { to: [232, 164] }, legB: [6, 30], legF: [2, 36], face: 'neutral' } };
    const kr = rig(k);
    const cL: P = [246, 160], cR: P = [292, 154];
    const mast = 262;
    return (
      <Scene2 bg="outdoor" gy={176}>
        <Sea y={168} x={150} w={170} />
        <path d="M156 168C146 190 158 214 172 240H146C132 214 128 192 138 176L140 168Z" fill={SAND} />
        <path d="M156 168C146 190 158 214 172 240" fill="none" stroke={K.out} stroke-width={1.5} />
        <Tree x={26} y={182} s={1.3} kind="pine" />
        <Hut x={70} y={192} w={70} h={54} />
        {/* kulübe çatısında kısa direk; çamla direk arasında gergin anten teli */}
        <OG sh={[{ d: rrect(103, 70, 5, 34, 1.5), f: WOOD }]} />
        <Ln d="M34 62L46 63" c={ROPE} w={2} />
        <Insul c={[54, 64]} />
        <Ln d="M63 64Q84 70 99 72" c={COPPER} w={2.4} />
        <Insul c={[106, 72]} />
        <Ln d="M108 78Q118 92 112 104" c={COPPER} w={2.2} />
        {/* yelkenli sal ve can yelekli kişi */}
        <Raft x={186} y={186} w={116} />
        <OG sh={[{ d: rrect(mast - 2.5, 92, 5, 96, 2), f: WOOD }]} />
        <OG sh={[
          { d: `M${mast - 18} 104L${mast + 24} 96Q${mast + 44} 128 ${cR[0]} ${cR[1]}Q${mast + 6} ${cR[1] + 10} ${cL[0]} ${cL[1]}Q${mast - 4} 130 ${mast - 18} 104Z`, f: '#efe6cf' },
          { d: capsule([mast - 24, 105], 2.6, [mast + 30, 95], 2.6), f: WOOD },
        ]} />
        <Person {...k} mid={(r) => vest(r, false)} />
        <Ln d={`M${cL[0]} ${cL[1]}L${kr.handB[0] + 2} ${kr.handB[1]}`} c={ROPE} w={1.8} />
        <Ln d={`M${cR[0]} ${cR[1]}Q${(cR[0] + kr.handF[0]) / 2} ${cR[1] + 12} ${kr.handF[0] + 2} ${kr.handF[1]}`} c={ROPE} w={1.8} />
      </Scene2>
    );
  },
};
