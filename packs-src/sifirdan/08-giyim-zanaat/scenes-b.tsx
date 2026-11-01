// Sıfırdan paketi sahneleri (b). Bkz. docs/agents/SIFIRDAN_CIZIM.md
// Rehberler: kaşık/kase, sepet, torna, çömlek (kil, şekil, pişirme, sır), tutkal, reçine, katran,
// demircilik (ocak, dövme, su verme, hurda, döküm), tekerlek, el arabası/kağnı, kızak, sal, kürek, bisiklet.
import type { JSX } from 'preact';
import {
  Arrow, Bad, Campfire, Cloth, Flame, GY, Hand, K, Label, No, Ok, Person, POSE, Rock, Scene2, Tree, Water, Waves,
  OG, capsule, circ, ell, rrect, smooth, shade, tint, rig, handPoint,
} from '../../../src/art/kit2';
import type { P, PersonProps, Rig, Sh } from '../../../src/art/kit2';

/* ═══════════════ Paket malzeme renkleri (paket genelinde aynı) ═══════════════ */
const M = {
  clay: '#a9846a', // ham/yaş kil
  clayDry: '#cfae8e', // kurumuş kil
  fired: '#c4683f', // pişmiş toprak
  slip: '#b38f73', // kil çamuru
  wood: K.wood,
  woodL: '#d6a774',
  bark: '#7a5236',
  willow: '#c9a66b',
  iron: '#5b6270',
  ironL: '#8b94a1',
  hot: '#ff6a2a',
  hotY: '#ffcf4a',
  coal: '#38323a',
  ember: '#ff5a2a',
  leather: '#8a5a36',
  rope: '#d8bd84',
  glove: '#c7965a',
  vest: '#f0532a',
  resin: '#e2a62a',
  tar: '#2b2220',
  glue: '#c98f2e',
  sand: '#e2c78e',
  mud: '#8a7360',
  rubber: '#2f3238',
  steel: '#c3cad3',
};

/* ═══════════════ Oyuncular (rehber başına sabit) ═══════════════ */
const CAST = {
  /** kaşık/kase oyan */
  carver: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.brown, top: K.role.bystander3, sleeve: 'long', bottomC: K.pants.khaki },
  /** sepetçi */
  basket: { who: 'oldwoman', skin: 1, top: K.role.bystander4 },
  /** tornacı */
  turner: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, mustache: true, top: K.role.bystander2, sleeve: 'long', bottomC: K.pants.brown },
  /** çömlekçi (kil, şekil, pişirme, sır) */
  potter: { who: 'woman', skin: 1, hair: 'bun', hairC: K.hair.black, top: K.role.bystander, sleeve: 'long', bottomC: K.pants.dark },
  /** tutkal/reçine/katran yapan */
  maker: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.auburn, top: K.role.bystander4, sleeve: 'long', bottomC: K.pants.grey },
  /** demirci (ocak, dövme, su verme, hurda, döküm): pamuklu uzun kol, deri önlük, gözlük, eldiven */
  smith: { who: 'man', skin: 2, hair: 'short', hairC: K.hair.black, top: '#5f7d96', sleeve: 'long', bottomC: K.pants.dark, mustache: true },
  /** tekerlek, el arabası, kağnı */
  cart: { who: 'man', skin: 0, hair: 'short', hairC: K.hair.blond, top: K.role.bystander3, sleeve: 'long', bottomC: K.pants.denim },
  /** kızak */
  sled: { who: 'woman', skin: 0, hair: 'long', hairC: K.hair.auburn, top: '#3f6fb0', sleeve: 'long', bottomC: K.pants.dark },
  /** sal ve kürek */
  raft: { who: 'man', skin: 1, hair: 'short', hairC: K.hair.dark, top: K.role.bystander2, sleeve: 'long', bottomC: K.pants.khaki },
  /** bisiklet */
  bike: { who: 'woman', skin: 3, hair: 'ponytail', hairC: K.hair.black, top: K.role.helper, sleeve: 'long', bottomC: K.pants.denim },
} as const;
type CastK = keyof typeof CAST;
const cast = (k: CastK) => CAST[k] as unknown as Partial<PersonProps>;
/** Yakın plan eller için: ten ve kol rengi */
const HANDS = (k: CastK) => ({ skin: (CAST[k] as any).skin as number, sleeve: (CAST[k] as any).top as string });

/* ═══════════════ Geometri yardımcıları ═══════════════ */
const R = Math.PI / 180;
const dv = (a: number): P => [Math.cos(a * R), Math.sin(a * R)];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];
const pol = (p: P, a: number, l: number): P => add(p, mul(dv(a), l));
const ang = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Çubuk / dal / sap */
const St = ({ a, b, r = 3, r2, c = M.wood }: { a: P; b: P; r?: number; r2?: number; c?: string }) => (
  <OG sh={[{ d: capsule(a, r, b, r2 ?? r), f: c }]} />
);
/** Kalın renkli çizgi (ip, kablo, sicim): dış hatlı */
const Line = ({ d, c = M.rope, w = 3 }: { d: string; c?: string; w?: number }) => (
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d={d} stroke={K.out} stroke-width={w + 3} />
    <path d={d} stroke={c} stroke-width={w} />
  </g>
);
const Dash = ({ d, c = K.ink, w = 2 }: { d: string; c?: string; w?: number }) => (
  <path d={d} fill="none" stroke={c} stroke-width={w} stroke-dasharray="6 5" stroke-linecap="round" />
);

/** Çömlek/kap profili (yerel; taban ortası 0,0). w genişlik, h yükseklik, m ağız oranı */
function vesselD(w: number, h: number, m = 0.62, foot = 0.34): string {
  const pts: P[] = [
    [-w * foot, 0], [-w * 0.5, -h * 0.42], [-w * m * 0.5, -h * 0.9], [-w * m * 0.5 - 2.5, -h],
    [w * m * 0.5 + 2.5, -h], [w * m * 0.5, -h * 0.9], [w * 0.5, -h * 0.42], [w * foot, 0],
  ];
  return smooth(pts, true, 0.9);
}
/** Çömlek: x,y taban ortası; a dönme (derece, taban ortası çevresinde) */
function Vessel({ x, y, w = 60, h = 64, m = 0.62, c = M.fired, a = 0, glaze, inner = true }: { x: number; y: number; w?: number; h?: number; m?: number; c?: string; a?: number; glaze?: boolean; inner?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <OG
        sh={[
          { d: vesselD(w, h, m), f: c },
          { d: `M${w * 0.1} ${-h * 0.95}C${w * 0.42} ${-h * 0.75} ${w * 0.5} ${-h * 0.3} ${w * 0.3} 0H${w * 0.34}C${w * 0.55} ${-h * 0.3} ${w * 0.5} ${-h * 0.8} ${w * 0.32} ${-h * 0.92}Z`, f: shade(c, 0.12), no: true },
          ...(inner ? [{ d: ell([0, -h], w * m * 0.5 + 1.5, 4), f: shade(c, 0.35) }] : []),
        ]}
      />
      {glaze && <path d={`M${-w * 0.32} ${-h * 0.62}Q${-w * 0.36} ${-h * 0.4} ${-w * 0.26} ${-h * 0.2}`} stroke="#fff" stroke-width={4} fill="none" stroke-linecap="round" opacity={0.75} />}
    </g>
  );
}
/** Kova: x,y taban ortası */
function Bucket({ x, y, w = 40, h = 40, c = '#8e99a6', fill, handle = true, a = 0 }: { x: number; y: number; w?: number; h?: number; c?: string; fill?: string; handle?: boolean; a?: number }) {
  const t = w / 2, b = w * 0.38;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      {handle && <path d={`M${-t} ${-h + 2}Q0 ${-h - w * 0.7} ${t} ${-h + 2}`} fill="none" stroke={K.out} stroke-width={2.4} />}
      <OG
        sh={[
          { d: `M${-t} ${-h}L${-b} 0H${b}L${t} ${-h}Z`, f: c },
          { d: `M${t * 0.35} ${-h}L${b * 0.35} 0H${b}L${t} ${-h}Z`, f: shade(c, 0.12), no: true },
          { d: ell([0, -h], t, 4.5), f: fill ?? shade(c, 0.3) },
        ]}
      />
    </g>
  );
}
/** Kor yığını: x,y taban ortası, w genişlik */
function Coals({ x, y, w = 80, h = 14, glow = 1 }: { x: number; y: number; w?: number; h?: number; glow?: number }) {
  const n = Math.max(4, Math.round(w / 11));
  const lumps = Array.from({ length: n * 2 - 1 }, (_, i) => {
    const row = i < n ? 0 : 1;
    const j = row ? i - n + 0.5 : i;
    const px = x - w / 2 + (j + 0.5) * (w / n);
    const py = y - 5 - row * (h * 0.55);
    return { px, py, r: (w / n) * 0.55, i };
  });
  return (
    <g>
      <OG sh={lumps.map((l) => ({ d: ell([l.px, l.py], l.r, l.r * 0.75), f: l.i % 3 === 0 && glow ? M.ember : l.i % 3 === 1 ? M.coal : shade(M.coal, -0.1) }))} />
      {glow ? lumps.filter((l) => l.i % 2 === 0).map((l) => <ellipse key={l.i} cx={l.px - 1} cy={l.py - 1} rx={l.r * 0.45} ry={l.r * 0.3} fill={M.hotY} opacity={0.8} />) : null}
    </g>
  );
}
/** Isı dalgaları (kırmızımsı) */
const Heat = ({ x, y, n = 3, c = K.danger }: { x: number; y: number; n?: number; c?: string }) => (
  <g fill="none" stroke={c} stroke-width={2.4} stroke-linecap="round" opacity={0.85}>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M${x + (i - (n - 1) / 2) * 11} ${y}c-5-6 5-9 0-15c-5-6 5-9 0-15`} />
    ))}
  </g>
);
/** Buhar */
const Steam = ({ x, y, n = 3, gap = 10, op = 0.9 }: { x: number; y: number; n?: number; gap?: number; op?: number }) => (
  <g fill="none" stroke="#fff" stroke-width={2.6} stroke-linecap="round" opacity={op}>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M${x + (i - (n - 1) / 2) * gap} ${y}c-4-5 4-8 0-13c-4-5 4-8 0-12`} />
    ))}
  </g>
);
/** Ay simgesi */
const Moon = ({ x, y, r = 14 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#f4dd8a" stroke={K.out} stroke-width={1.5} />
    <circle cx={x + r * 0.5} cy={y - r * 0.35} r={r * 0.85} fill={K.closeup} />
  </g>
);
/** Panel ayıracı (iki karelik sahnelerde) */
const Divider = ({ x = 160, y0 = 14 }: { x?: number; y0?: number }) => <rect x={x - 1.5} y={y0} width={3} height={226 - y0} rx={1.5} fill={K.out} opacity={0.35} />;
/** Elin ucu belli bir noktaya gelsin diye bilek konumu */
function wristFor(tip: P, a: number, s: number, pose: 'point' | 'press' | 'open' | 'fist' | 'pinch' | 'hold', side: 'L' | 'R'): { x: number; y: number } {
  const t = handPoint({ x: 0, y: 0, a, s, pose, side }, 'tip');
  return { x: tip[0] - t[0], y: tip[1] - t[1] };
}

/* ═══════════════ Koruyucu donanım (kişiye eklenir) ═══════════════ */
const fwdOf = (r: Rig): P => (r.flip ? dv(r.headA - 90) : dv(r.headA + 90));
const upOf = (r: Rig): P => dv(r.headA);
/** Koruyucu gözlük (yan görünüş) */
function Goggles(r: Rig) {
  const f = fwdOf(r), u = upOf(r), s = r.s;
  const eye = add(r.head, add(mul(f, 7.6 * s), mul(u, 1.2 * s)));
  const back = add(r.head, add(mul(f, -9 * s), mul(u, 2.5 * s)));
  return (
    <g>
      <path d={`M${back[0]} ${back[1]}L${eye[0]} ${eye[1]}`} stroke={K.out} stroke-width={3.2 * s} stroke-linecap="round" />
      <ellipse cx={eye[0]} cy={eye[1]} rx={3.9 * s} ry={3.4 * s} fill="#bfe6f5" stroke={K.out} stroke-width={1.6 * s} />
      <ellipse cx={eye[0] - 1 * s} cy={eye[1] - 1 * s} rx={1.3 * s} ry={1 * s} fill="#fff" />
    </g>
  );
}
/** Koruyucu gözlük (ön görünüş) */
function GogglesFront(r: Rig) {
  const s = r.s, [hx, hy] = r.head;
  return (
    <g stroke={K.out} stroke-width={1.5 * s}>
      <path d={`M${hx - 12 * s} ${hy}H${hx + 12 * s}`} stroke-width={3 * s} />
      <rect x={hx - 9 * s} y={hy - 3.6 * s} width={18 * s} height={7.4 * s} rx={3.4 * s} fill="#bfe6f5" />
      <path d={`M${hx} ${hy - 3.4 * s}V${hy + 3.6 * s}`} />
    </g>
  );
}
/** Eldiven: bilekten el ucuna */
function Glove(r: Rig, k: 'B' | 'F') {
  const w = r[k === 'B' ? 'wristB' : 'wristF'], h = r[k === 'B' ? 'handB' : 'handF'];
  const s = r.s;
  const a = ang(w, h);
  const tip = pol(h, a, 3 * s);
  const cuff = pol(w, a + 180, 5 * s);
  return <OG sh={[{ d: capsule(cuff, 5.4 * s, w, 5 * s), f: shade(M.glove, 0.12) }, { d: capsule(w, 4.8 * s, tip, 5.4 * s), f: M.glove }]} />;
}
/** Deri önlük (yan görünüş): göğüsten dize */
function Apron(r: Rig) {
  const s = r.s;
  const f: P = r.flip ? [-1, 0] : [1, 0];
  const knee = r.kneeF;
  const pts: P[] = [
    add(r.neck, [f[0] * 2 * s, 6 * s]),
    add(r.chest, [f[0] * 2 * s, 0]),
    add(r.belly, [f[0] * 3 * s, 0]),
    add(knee, [f[0] * 5 * s, 8 * s]),
    add(knee, [-f[0] * 9 * s, 10 * s]),
    add(r.hip, [-f[0] * 2 * s, 0]),
    add(lerp(r.chest, r.back, 0.45), [0, 0]),
  ];
  return <OG sh={[{ d: smooth(pts, true, 0.6), f: M.leather }, { d: smooth([add(r.neck, [-f[0] * 4 * s, 2 * s]), add(r.neck, [f[0] * 2 * s, 7 * s])]), st: shade(M.leather, 0.3), sw: 2.4 * s }]} />;
}
/** Deri önlük (ön görünüş) */
function ApronFront(r: Rig) {
  const s = r.s;
  const cx = (r.hipB[0] + r.hipF[0]) / 2;
  const top = r.chest[1] - 4 * s, bot = (r.kneeB[1] + r.kneeF[1]) / 2 + 10 * s;
  return (
    <OG
      sh={[
        { d: `M${cx - 9 * s} ${top}H${cx + 9 * s}L${cx + 11 * s} ${r.belly[1] - 6 * s}L${cx + 19 * s} ${r.belly[1]}L${cx + 18 * s} ${bot}H${cx - 18 * s}L${cx - 19 * s} ${r.belly[1]}L${cx - 11 * s} ${r.belly[1] - 6 * s}Z`, f: M.leather },
        { d: `M${cx - 8 * s} ${top}L${r.neck[0] - 5 * s} ${r.neck[1]}M${cx + 8 * s} ${top}L${r.neck[0] + 5 * s} ${r.neck[1]}`, st: K.out, sw: 2.2 * s },
      ]}
    />
  );
}
/** Can yeleği (yan görünüş) */
function Vest(r: Rig) {
  const s = r.s;
  const f = r.flip ? -1 : 1;
  const pts: P[] = [
    add(r.neck, [f * 4 * s, 1 * s]),
    add(r.chest, [f * 4 * s, -2 * s]),
    add(r.belly, [f * 4 * s, -1 * s]),
    add(lerp(r.belly, r.hip, 0.5), [-f * 2 * s, 2 * s]),
    add(lerp(r.back, r.hip, 0.45), [-f * 4 * s, 0]),
    add(r.back, [-f * 4 * s, 0]),
    add(r.nape, [-f * 1 * s, 1 * s]),
  ];
  const m1 = lerp(r.chest, r.belly, 0.35), m2 = lerp(r.chest, r.belly, 0.75);
  return (
    <g>
      <OG sh={[{ d: smooth(pts, true, 0.7), f: M.vest }]} />
      <path d={`M${m1[0] + f * 3 * s} ${m1[1]}L${m1[0] - f * 10 * s} ${m1[1] + 1 * s}M${m2[0] + f * 3 * s} ${m2[1]}L${m2[0] - f * 10 * s} ${m2[1] + 1 * s}`} stroke="#2b2d3a" stroke-width={2.2 * s} />
      <path d={`M${r.neck[0] + f * 2 * s} ${r.neck[1] + 4 * s}L${m2[0] + f * 1 * s} ${m2[1] + 6 * s}`} stroke={shade(M.vest, 0.25)} stroke-width={1.4 * s} />
    </g>
  );
}
/** Demirci: kişiyi önlük, gözlük, eldivenle çizer */
function Smith(p: PersonProps & { front?: boolean }) {
  const { front, ...pp } = p;
  return (
    <Person
      {...(cast('smith') as PersonProps)}
      {...pp}
      back={(r) => <g>{Glove(r, 'B')}</g>}
      mid={(r) => (front ? ApronFront(r) : Apron(r))}
      over={(r) => <g>{front ? GogglesFront(r) : Goggles(r)}{Glove(r, 'F')}{pp.over?.(r)}</g>}
    />
  );
}

/* ═══════════════ Ortak nesneler ═══════════════ */
/** Örs: x,y taban ortası, s ölçek. Üst yüz y - 58·s */
function Anvil({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const S = (px: number, py: number): string => `${x + px * s} ${y + py * s}`;
  return (
    <OG
      sh={[
        { d: `M${S(-16, 0)}L${S(-12, -30)}L${S(12, -30)}L${S(16, 0)}Z`, f: M.wood },
        { d: `M${S(-22, -30)}L${S(-14, -38)}L${S(-10, -46)}L${S(-26, -50)}L${S(-26, -58)}L${S(22, -58)}C${S(34, -58)} ${S(44, -55)} ${S(54, -52)}C${S(40, -48)} ${S(30, -47)} ${S(18, -46)}L${S(12, -38)}L${S(20, -30)}Z`, f: M.iron },
        { d: `M${S(-26, -58)}L${S(22, -58)}C${S(34, -58)} ${S(44, -55)} ${S(54, -52)}L${S(46, -53)}C${S(36, -55)} ${S(26, -56)} ${S(18, -56)}L${S(-26, -56)}Z`, f: M.ironL, no: true },
      ]}
    />
  );
}
/** Çekiç: el noktasından a yönünde sap, ucunda baş */
function Hammer({ at, a, s = 1, len = 34 }: { at: P; a: number; s?: number; len?: number }) {
  const end = pol(at, a, len * s);
  const back = pol(at, a + 180, 6 * s);
  const h1 = pol(end, a + 90, 9 * s), h2 = pol(end, a - 90, 7 * s);
  return <OG sh={[{ d: capsule(back, 2.4 * s, end, 2.6 * s), f: M.woodL }, { d: capsule(h1, 5 * s, h2, 4.6 * s), f: M.iron }]} />;
}
/** Maşa: el noktasından uca */
function Tongs({ from, to, s = 1, c = M.iron }: { from: P; to: P; s?: number; c?: string }) {
  const a = ang(from, to);
  const j = lerp(from, to, 0.72);
  const t1 = pol(to, a + 90, 2.5 * s), t2 = pol(to, a - 90, 2.5 * s);
  const f1 = pol(from, a + 90, 3 * s), f2 = pol(from, a - 90, 3 * s);
  return (
    <g fill="none" stroke-linecap="round">
      <path d={`M${f1[0]} ${f1[1]}L${j[0]} ${j[1]}L${t2[0]} ${t2[1]}M${f2[0]} ${f2[1]}L${j[0]} ${j[1]}L${t1[0]} ${t1[1]}`} stroke={K.out} stroke-width={5 * s} />
      <path d={`M${f1[0]} ${f1[1]}L${j[0]} ${j[1]}L${t2[0]} ${t2[1]}M${f2[0]} ${f2[1]}L${j[0]} ${j[1]}L${t1[0]} ${t1[1]}`} stroke={c} stroke-width={2.4 * s} />
      <circle cx={j[0]} cy={j[1]} r={2.4 * s} fill={K.out} />
    </g>
  );
}
/** Demir çubuk: a'dan b'ye, ısı rengiyle */
const Bar = ({ a, b, r = 3.5, c = M.iron, hot }: { a: P; b: P; r?: number; c?: string; hot?: number }) => {
  if (!hot) return <St a={a} b={b} r={r} c={c} />;
  const m = lerp(b, a, hot);
  return (
    <g>
      <St a={a} b={m} r={r} c={c} />
      <OG sh={[{ d: capsule(m, r, b, r), f: M.hot }]} />
      <path d={`M${lerp(m, b, 0.35)[0]} ${lerp(m, b, 0.35)[1]}L${b[0]} ${b[1]}`} stroke={M.hotY} stroke-width={r * 0.8} stroke-linecap="round" />
    </g>
  );
};
/** Kütük (yatay, önden kesit yüzü solda görünür) */
function LogSide({ x, y, w, r, c = M.bark, end = true }: { x: number; y: number; w: number; r: number; c?: string; end?: boolean }) {
  return (
    <g>
      <OG sh={[{ d: rrect(x, y - r, w, r * 2, r), f: c }, { d: `M${x + r} ${y + r * 0.35}H${x + w - r}`, st: shade(c, 0.25), sw: 1.4 }]} />
      {end && <OG sh={[{ d: ell([x + r * 0.45, y], r * 0.5, r), f: M.woodL }, { d: ell([x + r * 0.45, y], r * 0.22, r * 0.45), st: shade(M.woodL, 0.3), sw: 1 }]} />}
    </g>
  );
}

/* ═══════════════ SAHNELER ═══════════════ */
export const SCENES: Record<string, () => JSX.Element> = {};
const S = SCENES;

/* ───── Kaşık, kase ───── */
S['sf-gz-kasik-cizim'] = () => {
  const spoon = smooth([[52, 122], [70, 114], [150, 116], [176, 112], [196, 96], [232, 90], [262, 104], [270, 122], [262, 140], [232, 154], [196, 148], [176, 132], [150, 128], [70, 130]], true, 0.8);
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(24, 62, 272, 120, 30), f: M.bark }, { d: rrect(30, 68, 260, 108, 26), f: M.woodL }]} />
      {[86, 104, 140, 158].map((yy) => <path key={yy} d={`M44 ${yy}Q160 ${yy + 4} 280 ${yy - 2}`} stroke={shade(M.woodL, 0.18)} stroke-width={1.4} fill="none" />)}
      <path d={spoon} fill="none" stroke={K.ink} stroke-width={4} stroke-linejoin="round" />
      <OG sh={[{ d: capsule([206, 206], 5, [262, 186], 5.5), f: M.coal }]} />
    </Scene2>
  );
};
S['sf-gz-kasik-oyma'] = () => {
  const bowl: P = [196, 118];
  return (
    <Scene2 bg="closeup">
      <OG sh={[
        { d: smooth([[24, 126], [40, 118], [120, 118], [140, 112], [160, 84], [200, 72], [244, 82], [262, 118], [244, 154], [200, 164], [160, 152], [140, 126], [40, 134]], true, 0.8), f: M.woodL },
        { d: ell(bowl, 46, 32), f: shade(M.woodL, 0.22) },
      ]} />
      <ellipse cx={bowl[0]} cy={bowl[1]} rx={54} ry={39} fill="none" stroke={K.ink} stroke-width={1.8} stroke-dasharray="5 4" opacity={0.7} />
      {/* talaşlar */}
      <OG sh={[
        { d: 'M218 96c8-14 22-14 26-4c-6-4-14-2-18 6z', f: tint(M.woodL, 0.3) },
        { d: 'M232 70c10-8 22-4 22 6c-6-6-14-6-20 0z', f: tint(M.woodL, 0.3) },
      ]} />
      {/* kaşık bıçağı: sap sağ altta, kıvrık ağız kepçede */}
      <OG sh={[{ d: capsule([292, 214], 7, [246, 150], 6), f: M.wood }]} />
      <path d="M246 150C240 140 222 128 206 128C196 128 194 140 204 144" fill="none" stroke={K.out} stroke-width={7} stroke-linecap="round" />
      <path d="M246 150C240 140 222 128 206 128C196 128 194 140 204 144" fill="none" stroke={M.steel} stroke-width={4} stroke-linecap="round" />
      {/* tutan el sapın ucunda, bıçağın yolunun dışında */}
      <Hand x={60} y={160} a={-8} s={0.85} pose="fist" side="L" arm={140} {...HANDS('carver')} />
      <Hand x={292} y={222} a={-36} s={0.85} pose="fist" side="R" arm={120} {...HANDS('carver')} />
      <Arrow from={[168, 98]} to={[226, 102]} bend={-0.35} w={5} />
    </Scene2>
  );
};
S['sf-gz-kase-kor'] = () => {
  const c: P = [160, 124];
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: ell(c, 128, 82), f: M.bark }, { d: ell(c, 118, 74), f: M.woodL }]} />
      {[0.55, 0.8].map((k) => <ellipse key={k} cx={c[0]} cy={c[1]} rx={118 * k} ry={74 * k} fill="none" stroke={shade(M.woodL, 0.15)} stroke-width={1.3} />)}
      {/* ıslak çamur halkası, kömürleşmiş çukur, kor */}
      <OG sh={[{ d: ell(c, 66, 44), f: M.mud }, { d: ell(c, 44, 29), f: '#2c2426' }]} />
      <path d={`M${c[0] - 58} ${c[1] - 12}q6 -6 12 0M${c[0] + 48} ${c[1] + 18}q6 -6 12 0M${c[0] + 30} ${c[1] - 36}q6 -6 12 0`} stroke={tint(M.mud, 0.4)} stroke-width={2} fill="none" />
      <Coals x={c[0]} y={c[1] + 14} w={56} h={18} />
      {/* üfleme kamışı */}
      <OG sh={[{ d: capsule([300, 40], 5, [200, 98], 4), f: '#b9a35a' }]} />
      <Waves x={190} y={104} a={150} n={3} r={6} />
    </Scene2>
  );
};

/* ───── Sepet ───── */
S['sf-gz-sepet-taban'] = () => (
  <Scene2 bg="closeup">
    {/* yarılmış üç çubuk (yatay) */}
    {[100, 120, 140].map((yy) => (
      <g key={yy}>
        <OG sh={[{ d: capsule([40, yy], 6, [280, yy], 6), f: M.willow }]} />
        <path d={`M138 ${yy}H182`} stroke={K.out} stroke-width={2.2} />
      </g>
    ))}
    {/* yarıklardan geçen üç çubuk (dikey) */}
    {[148, 160, 172].map((xx) => (
      <OG key={xx} sh={[{ d: capsule([xx, 30], 5.5, [xx, 178], 5.5), f: shade(M.willow, 0.08) }]} />
    ))}
    {[100, 120, 140].map((yy) => (
      <g key={'o' + yy}>
        <OG sh={[{ d: capsule([132, yy - 3.5], 2.6, [188, yy - 3.5], 2.6), f: M.willow }]} />
      </g>
    ))}
    <path d="M138 188V200M182 188V200M138 194H182" stroke={K.action} stroke-width={3} />
    <Label x={160} y={216} text="5 cm" />
  </Scene2>
);
S['sf-gz-sepet-ikili-orgu'] = () => {
  const xs = [56, 116, 176, 236];
  const yA = (i: number) => (i % 2 ? 136 : 112), yB = (i: number) => (i % 2 ? 112 : 136);
  const path = (yf: (i: number) => number, x0: number, x1: number) => {
    const pts: P[] = [[x0, yf(-1) + (yf(0) - yf(-1)) / 2]];
    xs.forEach((x, i) => pts.push([x, yf(i)]));
    pts.push([x1, (yf(3) + yf(4)) / 2]);
    return smooth(pts, false, 1);
  };
  const A = '#9a6b34', B = '#e3c58a';
  return (
    <Scene2 bg="closeup">
      {/* arka kalan örgü parçaları için dikmeleri önce çiz, sonra örgüleri, sonra öndeki dikme bölümleri */}
      <Line d={path(yB, 24, 270)} c={B} w={8} />
      <Line d={path(yA, 24, 270)} c={A} w={8} />
      {xs.map((x, i) => (
        <g key={x}>
          <OG sh={[{ d: capsule([x, 40], 7, [x, 206], 7), f: M.willow }]} />
          {/* öndeki örgü bu dikmenin üstünden geçer */}
          <Line d={`M${x - 14} ${i % 2 ? yB(i) + 2 : yA(i) - 2}L${x + 14} ${i % 2 ? yB(i) - 2 : yA(i) + 2}`} c={i % 2 ? B : A} w={8} />
        </g>
      ))}
      <Arrow from={[262, 82]} to={[300, 82]} w={6} />
    </Scene2>
  );
};
S['sf-gz-sepet-dikme'] = () => {
  const top: P = [160, 34];
  const n = 13;
  const stakes = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const bx = 60 + t * 200;
    const by = 196 + Math.sin(t * Math.PI) * 12;
    return { b: [bx, by] as P, k: [bx + (160 - bx) * 0.08, by - 14] as P };
  });
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: ell([160, 200], 104, 22), f: shade(M.willow, 0.1) }, { d: ell([160, 198], 94, 17), f: M.willow }]} />
      {[0.35, 0.6, 0.85].map((k) => <ellipse key={k} cx={160} cy={198} rx={94 * k} ry={17 * k} fill="none" stroke={shade(M.willow, 0.3)} stroke-width={1.6} />)}
      {stakes.map((s, i) => (
        <Line key={i} d={`M${s.b[0]} ${s.b[1]}L${s.k[0]} ${s.k[1]}L${top[0] + (i - 6) * 1.2} ${top[1] + 8}`} c={tint(M.willow, 0.15)} w={4.5} />
      ))}
      <OG sh={[{ d: rrect(146, 32, 28, 16, 6), f: M.rope }]} />
      <path d="M150 40H170" stroke={shade(M.rope, 0.35)} stroke-width={1.5} />
      <Arrow from={[40, 170]} to={[66, 110]} bend={-0.2} w={5} />
      <Arrow from={[280, 170]} to={[254, 110]} bend={0.2} w={5} />
    </Scene2>
  );
};

/* ───── Yay tornası ───── */
/** Uçtan görünen iş parçası (yıllık halkalı) */
const WorkEnd = ({ c, r }: { c: P; r: number }) => (
  <g>
    <OG sh={[{ d: circ(c, r), f: M.woodL }]} />
    {[0.66, 0.36].map((k) => <circle key={k} cx={c[0]} cy={c[1]} r={r * k} fill="none" stroke={shade(M.woodL, 0.25)} stroke-width={1.3} />)}
    <circle cx={c[0]} cy={c[1]} r={Math.max(2.5, r * 0.09)} fill={K.out} />
  </g>
);
S['sf-gz-torna-yay'] = () => {
  const c: P = [150, 100];
  const r = 28;
  const bowL: P = [30, 168], bowR: P = [292, 168];
  const bow = smooth([bowL, [90, 194], [160, 202], [230, 194], bowR]);
  const str = `M${bowL[0]} ${bowL[1]}L${c[0] - r + 2} ${c[1] + 8}A${r} ${r} 0 1 1 ${c[0] + r - 2} ${c[1] + 8}L${bowR[0]} ${bowR[1]}`;
  return (
    <Scene2 bg="indoor" gy={214}>
      <OG sh={[{ d: rrect(10, 206, 300, 14, 3), f: M.wood }, { d: rrect(136, 92, 28, 116, 3), f: shade(M.wood, 0.1) }]} />
      <WorkEnd c={c} r={r} />
      {/* yay: esnek dal; ipi parçaya bir tur sarılı */}
      <OG sh={[{ d: bow, st: K.out, sw: 9 }, { d: bow, st: M.bark, sw: 6 }]} />
      <path d={str} fill="none" stroke={K.out} stroke-width={4.5} />
      <path d={str} fill="none" stroke={M.rope} stroke-width={2.2} />
      {/* alet dayaması; keski dayamanın üstünde, sağ elde */}
      <OG sh={[{ d: rrect(186, 112, 14, 96, 2), f: shade(M.wood, 0.1) }]} />
      <OG sh={[{ d: capsule([200, 108], 3.2, [176, 98], 2.6), f: M.steel }, { d: capsule([200, 108], 5, [266, 136], 5.5), f: M.woodL }]} />
      <Hand {...wristFor([250, 128], -66, 0.85, 'fist', 'R')} a={-66} s={0.85} pose="fist" side="R" arm={120} {...HANDS('turner')} />
      {/* sol el yayın ucunu ileri geri çekiyor */}
      <Hand x={4} y={196} a={52} s={0.85} pose="fist" side="L" arm={90} {...HANDS('turner')} />
      <Arrow from={[124, 52]} to={[178, 52]} bend={-0.5} w={5} />
      <Arrow from={[100, 230]} to={[44, 230]} w={5} />
      <Arrow from={[124, 230]} to={[180, 230]} w={5} />
    </Scene2>
  );
};
S['sf-gz-torna-direk'] = () => {
  const c: P = [208, 124];
  const r = 13;
  const p: PersonProps = {
    ...(cast('turner') as PersonProps), x: 108, y: 224,
    pose: { ...POSE.standSide, spine: -84, head: -84, legF: { to: [150, 212] }, armF: { to: [182, 120] }, armB: { to: [168, 124] }, face: 'neutral' },
  };
  return (
    <Scene2 bg="indoor" gy={206}>
      <rect x={0} y={0} width={320} height={14} fill={shade(M.wood, 0.15)} />
      <OG sh={[{ d: rrect(282, 6, 16, 26, 3), f: M.bark }]} />
      {/* esnek sırık */}
      <OG sh={[{ d: smooth([[296, 18], [260, 22], [214, 30]]), st: K.out, sw: 9 }, { d: smooth([[296, 18], [260, 22], [214, 30]]), st: M.bark, sw: 6 }]} />
      {/* torna sehpası */}
      <OG sh={[
        { d: rrect(184, 140, 50, 14, 2), f: M.wood },
        { d: rrect(188, 154, 9, 70, 2), f: shade(M.wood, 0.12) },
        { d: rrect(222, 154, 9, 70, 2), f: shade(M.wood, 0.12) },
        { d: rrect(201, 104, 14, 38, 2), f: shade(M.wood, 0.08) },
      ]} />
      {/* ayaklık */}
      <OG sh={[{ d: `M128 214L258 222L258 228L128 220Z`, f: M.woodL }]} />
      <path d={`M216 30V${c[1]}A${r} ${r} 0 1 1 ${c[0] - r} ${c[1]}L${c[0] - r} 216`} fill="none" stroke={K.out} stroke-width={4.5} />
      <path d={`M216 30V${c[1]}A${r} ${r} 0 1 1 ${c[0] - r} ${c[1]}L${c[0] - r} 216`} fill="none" stroke={M.rope} stroke-width={2.2} />
      <WorkEnd c={c} r={r} />
      <Person {...p} over={(rr) => <OG sh={[{ d: capsule(lerp(rr.handB, rr.handF, -0.4), 3.4, rr.handF, 3.4), f: M.woodL }, { d: capsule(rr.handF, 2.4, [c[0] - r + 1, c[1] - 6], 2.4), f: M.steel }]} />} />
      <Arrow from={[150, 176]} to={[150, 206]} w={5} />
      <Arrow from={[240, 66]} to={[240, 36]} w={5} />
    </Scene2>
  );
};
S['sf-gz-torna-kesme'] = () => {
  const c: P = [196, 108];
  const r = 64;
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(176, 116, 70, 120, 4), f: shade(M.wood, 0.1) }]} />
      <WorkEnd c={c} r={r} />
      {/* alet dayaması */}
      <OG sh={[{ d: rrect(96, 146, 24, 94, 3), f: M.wood }]} />
      {/* keski */}
      <OG sh={[{ d: capsule([20, 196], 7, [92, 154], 6), f: M.woodL }, { d: capsule([92, 154], 4, [136, 128], 3), f: M.steel }]} />
      {/* talaş */}
      <OG sh={[{ d: 'M128 118c-6-16 6-28 18-22c-10 0-14 10-10 20z', f: tint(M.woodL, 0.35) }, { d: 'M112 104c-10-10-4-24 8-22c-8 4-8 12-2 20z', f: tint(M.woodL, 0.35) }]} />
      <Hand x={14} y={236} a={30} s={0.85} pose="fist" side="R" arm={60} {...HANDS('turner')} />
      <Arrow from={[176, 30]} to={[118, 70]} bend={0.25} w={6} />
    </Scene2>
  );
};

/* ───── Kil hazırlama ───── */
const knot = (x: number, y: number) =>
  `M${x - 62} ${y + 34}C${x - 22} ${y + 34} ${x + 34} ${y - 6} ${x + 28} ${y - 30}C${x + 22} ${y - 58} ${x - 22} ${y - 58} ${x - 28} ${y - 30}C${x - 34} ${y - 6} ${x + 22} ${y + 34} ${x + 62} ${y + 34}`;
/** düğümün üstten geçen parçası (alt-üst izlenimi) */
const knotOver = (x: number, y: number) => `M${x - 26} ${y + 22}C${x - 14} ${y + 14} ${x - 4} ${y + 8} ${x + 8} ${y - 2}`;
S['sf-gz-kil-dugum-testi'] = () => (
  <Scene2 bg="closeup">
    <Divider />
    <Line d={knot(80, 118)} c={M.clay} w={13} />
    <Line d={knotOver(80, 118)} c={M.clay} w={13} />
    <g>
      <Line d={`M178 152C218 152 274 112 268 88C265 76 258 68 250 64`} c={M.clay} w={13} />
      <Line d={`M228 62C214 66 208 76 212 88C206 112 262 152 302 152`} c={M.clay} w={13} />
      <path d="M222 128l6-6M262 120l-6-7M266 96l-8 2M214 100l8 0" stroke={K.out} stroke-width={2.2} />
    </g>
    <Ok x={80} y={196} r={18} />
    <Bad x={240} y={196} r={18} />
  </Scene2>
);
S['sf-gz-kil-suzme'] = () => {
  const p: PersonProps = {
    ...(cast('potter') as PersonProps), x: 96, y: 224,
    pose: { ...POSE.standSide, spine: -86, head: -74, armB: { to: [128, 112] }, armF: { to: [154, 106] }, face: 'neutral' },
  };
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Person {...p} only={['legB', 'legF', 'armB', 'torso', 'head']} />
      <Bucket x={130} y={112} w={40} h={40} a={112} c="#8e99a6" handle={false} />
      <Person {...p} only={['armF']} />
      {/* çamur akışı */}
      <OG sh={[{ d: `M160 124C184 118 214 130 228 170L218 170C210 140 190 134 162 138Z`, f: M.slip }]} />
      <Bucket x={232} y={226} w={66} h={56} c="#6f8fa8" handle={false} fill={M.slip} />
      {/* bez süzgeç, içinde taş ve kök */}
      <OG sh={[{ d: `M196 170Q232 202 268 170Q232 182 196 170Z`, f: '#efe6d2' }, { d: ell([232, 170], 36, 5), f: '#f6efe0' }]} />
      <OG sh={[{ d: ell([224, 176], 6, 4), f: K.rock }, { d: ell([240, 178], 5, 3.5), f: shade(K.rock, 0.15) }]} />
      <path d="M216 172q8 6 18 2" stroke={M.bark} stroke-width={2.4} fill="none" />
    </Scene2>
  );
};
S['sf-gz-kil-yogurma'] = () => (
  <Scene2 bg="closeup">
    <Divider x={196} />
    <OG sh={[{ d: rrect(14, 176, 172, 50, 6), f: M.woodL }]} />
    <OG sh={[{ d: smooth([[40, 186], [50, 150], [100, 134], [150, 146], [166, 186]], true, 0.8), f: M.clay }]} />
    <Hand x={74} y={212} a={8} s={0.82} pose="press" side="L" view="back" arm={60} {...HANDS('potter')} />
    <Hand x={134} y={212} a={-8} s={0.82} pose="press" side="R" view="back" arm={60} {...HANDS('potter')} />
    <Arrow from={[104, 112]} to={[104, 74]} w={5} />
    {/* kesit: hava delikli */}
    <OG sh={[{ d: `M214 170A44 44 0 0 1 302 170Z`, f: shade(M.clay, 0.1) }, { d: ell([258, 170], 44, 10), f: tint(M.clay, 0.15) }]} />
    {[[240, 168], [262, 172], [282, 167], [252, 164]].map(([hx, hy], i) => <ellipse key={i} cx={hx} cy={hy} rx={4} ry={2.4} fill={K.out} />)}
    <Bad x={258} y={110} r={16} />
  </Scene2>
);

/* ───── Çömlek şekillendirme ───── */
S['sf-gz-comlek-sucuk'] = () => (
  <Scene2 bg="closeup">
    <OG sh={[{ d: rrect(-10, 112, 340, 140, 8), f: M.woodL }]} />
    {[132, 148].map((yy, i) => <OG key={yy} sh={[{ d: capsule([30 + i * 10, yy], 6, [130 + i * 6, yy], 6), f: M.clay }]} />)}
    <OG sh={[{ d: capsule([26, 194], 7, [292, 194], 7), f: M.clay }]} />
    <Hand x={104} y={228} a={4} s={0.8} pose="press" side="L" arm={60} {...HANDS('potter')} />
    <Hand x={204} y={228} a={-4} s={0.8} pose="press" side="R" arm={60} {...HANDS('potter')} />
    <Arrow from={[250, 150]} to={[250, 122]} w={4} />
    <Arrow from={[250, 156]} to={[250, 180]} w={4} />
    <path d="M298 184H310M298 204H310M304 184V204" stroke={K.action} stroke-width={2.6} />
    <Label x={262} y={78} text="1–1,5 cm" size={15} />
  </Scene2>
);
S['sf-gz-comlek-sivama'] = () => {
  // Önden yarım çömlek: altı sıvanmış düz duvar, üstte yeni eklenen iki sucuk; parmak birleşimi aşağı sıvıyor
  const wall = M.clay;
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(20, 222, 280, 22, 4), f: M.woodL }]} />
      <OG sh={[{ d: 'M66 112C44 150 48 200 96 224H224C272 200 276 150 254 112Z', f: wall }]} />
      <path d="M232 128C246 160 242 196 214 216" stroke={shade(wall, 0.18)} stroke-width={10} fill="none" opacity={0.6} />
      {/* yeni sucuklar */}
      <OG sh={[{ d: capsule([72, 101], 9, [248, 101], 9), f: tint(wall, 0.08) }]} />
      <OG sh={[{ d: capsule([78, 83], 9, [242, 83], 9), f: tint(wall, 0.12) }]} />
      {/* solda sıvanmış: birleşim çizgisini örten dikey izler */}
      <g stroke={shade(wall, 0.3)} stroke-width={2} stroke-linecap="round" fill="none">
        {[80, 98, 116, 134].map((x) => <path key={x} d={`M${x} 96Q${x + 3} 112 ${x} 128`} />)}
      </g>
      <OG sh={[{ d: 'M70 92H146V112H66Z', f: wall, no: true }]} />
      <g stroke={shade(wall, 0.3)} stroke-width={2} stroke-linecap="round" fill="none">
        {[80, 98, 116, 134].map((x) => <path key={x} d={`M${x} 94Q${x + 3} 110 ${x} 126`} />)}
      </g>
      {/* işaret parmağı birleşimde */}
      <Hand {...wristFor([166, 108], -160, 1.2, 'point', 'R')} a={-160} s={1.2} pose="point" side="R" arm={200} {...HANDS('potter')} />
      <Arrow from={[166, 132]} to={[166, 184]} w={6} />
    </Scene2>
  );
};
S['sf-gz-comlek-tokmak'] = () => {
  const base: P = [150, 222];
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(10, 220, 300, 30, 4), f: M.woodL }]} />
      <Vessel x={base[0]} y={base[1]} w={150} h={136} m={0.62} c={M.clayDry} />
      <Hand x={128} y={60} a={176} s={0.95} pose="fist" side="L" arm={160} {...HANDS('potter')} />
      {/* çömlek gövdesi elin önünde (el içeride) */}
      <Vessel x={base[0]} y={base[1]} w={150} h={136} m={0.62} c={M.clayDry} inner={false} />
      <circle cx={196} cy={150} r={20} fill="none" stroke={K.ink} stroke-width={2.4} stroke-dasharray="5 4" />
      {/* tokmak tahtası */}
      <OG sh={[{ d: rrect(222, 116, 14, 70, 3), f: M.woodL }, { d: capsule([236, 158], 4, [284, 184], 4.5), f: M.wood }]} />
      <Hand x={306} y={206} a={-62} s={0.8} pose="fist" side="R" arm={60} {...HANDS('potter')} />
      <Arrow from={[286, 112]} to={[246, 130]} bend={0.2} w={5} />
    </Scene2>
  );
};

/* ───── Çömlek pişirme ───── */
const PitSection = ({ gy, children }: { gy: number; children?: any }) => (
  <g>
    <rect x={0} y={gy} width={320} height={240 - gy} fill="#9c7552" />
    <path d={`M0 ${gy}H320`} stroke={shade('#9c7552', 0.3)} stroke-width={3} />
    <path d={`M64 ${gy}L86 228H234L256 ${gy}Z`} fill="#4b3b33" stroke={K.out} stroke-width={2} />
    {children}
  </g>
);
S['sf-gz-pisirme-on-isitma'] = () => {
  const p: PersonProps = {
    ...(cast('potter') as PersonProps), x: 58, y: 224,
    pose: { ...POSE.standSide, spine: -82, head: -70, armF: { to: [96, 142] }, armB: { to: [84, 136] }, face: 'neutral' },
  };
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Campfire x={186} y={214} s={1.4} />
      <Vessel x={126} y={220} w={36} h={38} c={M.clayDry} />
      <Vessel x={246} y={220} w={36} h={38} c={M.clayDry} />
      <Vessel x={288} y={224} w={30} h={32} c={M.clayDry} />
      <Person {...p} mid={() => <St a={[78, 130]} b={[124, 192]} r={2.6} c={M.bark} />} />
      <Arrow from={[132, 168]} to={[150, 168]} w={5} />
      <Arrow from={[240, 168]} to={[222, 168]} w={5} />
      <Label x={186} y={40} text="1–2 saat" />
    </Scene2>
  );
};
S['sf-gz-pisirme-dizme'] = () => {
  const gy = 112;
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <PitSection gy={gy}>
        <Coals x={160} y={228} w={144} h={14} />
        <Vessel x={124} y={170} w={52} h={48} a={180} c={M.clayDry} inner={false} />
        <Vessel x={196} y={170} w={52} h={48} a={180} c={M.clayDry} inner={false} />
        {[[92, 214, 108, 130], [228, 214, 212, 130], [160, 214, 160, 126], [102, 214, 96, 150], [218, 214, 226, 150]].map(([x1, y1, x2, y2], i) => (
          <St key={i} a={[x1, y1]} b={[x2, y2]} r={2} c={M.bark} />
        ))}
      </PitSection>
      <Bucket x={286} y={110} w={34} h={34} fill={K.water} />
      <St a={[30, 112]} b={[40, 40]} r={3} c={M.wood} />
      <OG sh={[{ d: `M18 108L28 132H44L44 108Z`, f: M.ironL }]} />
    </Scene2>
  );
};
S['sf-gz-pisirme-ates'] = () => {
  const gy = 112;
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <PitSection gy={gy}>
        <Coals x={160} y={228} w={144} h={14} />
        <Vessel x={124} y={170} w={52} h={48} a={180} c="#b8402a" inner={false} />
        <Vessel x={196} y={170} w={52} h={48} a={180} c="#b8402a" inner={false} />
        <ellipse cx={124} cy={196} rx={16} ry={10} fill={M.hotY} opacity={0.35} />
        <ellipse cx={196} cy={196} rx={16} ry={10} fill={M.hotY} opacity={0.35} />
        {[[72, 120, 150, 150], [248, 120, 170, 150], [80, 160, 240, 130], [84, 140, 236, 168], [98, 200, 150, 112], [222, 200, 172, 112]].map(([x1, y1, x2, y2], i) => (
          <St key={i} a={[x1, y1]} b={[x2, y2]} r={5} c={i % 2 ? M.bark : shade(M.bark, 0.12)} />
        ))}
      </PitSection>
      <Flame x={124} y={124} s={1.4} />
      <Flame x={168} y={120} s={1.8} />
      <Flame x={210} y={124} s={1.3} />
      <Label x={264} y={40} text="600 °C+" />
    </Scene2>
  );
};

/* ───── Sır ───── */
S['sf-gz-sir-kursun-yasak'] = () => (
  <Scene2 bg="closeup">
    <Vessel x={140} y={212} w={112} h={124} c="#e0662f" glaze />
    <OG sh={[
      { d: `M220 212L226 192H262L268 212Z`, f: K.metal },
      { d: `M232 192L236 178H258L262 192Z`, f: shade(K.metal, 0.1) },
    ]} />
    <OG sh={[{ d: ell([50, 208], 16, 7), f: M.steel }, { d: capsule([62, 206], 3, [98, 196], 3), f: M.steel }]} />
    <No x={150} y={136} r={74} />
  </Scene2>
);
S['sf-gz-sir-perdah'] = () => {
  const stone: P = [170, 150];
  return (
    <Scene2 bg="closeup">
      <Vessel x={130} y={232} w={180} h={196} m={0.56} c={M.clayDry} />
      {/* parlatılmış bölge */}
      <OG sh={[{ d: ell([112, 140], 46, 40), f: '#c99a74', no: true }]} />
      {[[84, 122, 134, 114], [80, 144, 144, 136], [88, 164, 136, 160]].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1}Q${(x1 + x2) / 2} ${y1 - 8} ${x2} ${y2}`} stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round" opacity={0.85} />
      ))}
      {/* düz yuvarlak taş, parmaklar üstünde bastırıyor */}
      <OG sh={[{ d: ell(stone, 24, 17), f: '#9aa0a6' }]} />
      <path d={`M${stone[0] - 12} ${stone[1] - 8}q10 -5 20 0`} stroke="#c3c8cd" stroke-width={2} fill="none" />
      <Hand {...wristFor([stone[0] - 4, stone[1] - 4], -80, 1.0, 'press', 'R')} a={-80} s={1.0} pose="press" side="R" arm={200} {...HANDS('potter')} />
      <Arrow from={[150, 90]} to={[90, 96]} bend={0.5} w={5} />
    </Scene2>
  );
};
S['sf-gz-sir-deneme'] = () => (
  <Scene2 bg="closeup">
    <Divider y0={60} />
    <Moon x={160} y={34} r={14} />
    <Vessel x={80} y={200} w={86} h={100} c={M.fired} />
    <ellipse cx={80} cy={100} rx={27} ry={3.5} fill={K.water} />
    <Vessel x={240} y={200} w={86} h={100} c={M.fired} />
    <ellipse cx={240} cy={100} rx={27} ry={3.5} fill={K.water} />
    {[[214, 150, 14, 18], [256, 170, 12, 14], [230, 182, 16, 10]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={shade(M.fired, 0.35)} opacity={0.75} />)}
    <ellipse cx={244} cy={206} rx={52} ry={7} fill={K.water} opacity={0.75} stroke={K.out} stroke-width={1.2} />
    <Ok x={80} y={224} r={13} />
    <Bad x={300} y={176} r={13} />
  </Scene2>
);

/* ───── Tutkal ───── */
/** Metal tencere (kulplu), x,y taban ortası; içi görünür: fill sıvı rengi */
function Kettle({ x, y, w = 90, h = 54, c = '#8e99a6', fill = K.water, a = 0 }: { x: number; y: number; w?: number; h?: number; c?: string; fill?: string; a?: number }) {
  const t = w / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <OG sh={[
        { d: capsule([-t - 8, -h + 6], 3, [-t + 2, -h + 6], 3), f: shade(c, 0.2) },
        { d: capsule([t - 2, -h + 6], 3, [t + 8, -h + 6], 3), f: shade(c, 0.2) },
        { d: `M${-t} ${-h}H${t}L${t - 3} -3Q${t - 3} 0 ${t - 6} 0H${-t + 6}Q${-t + 3} 0 ${-t + 3} -3Z`, f: c },
        { d: `M${t * 0.4} ${-h}H${t}L${t - 3} -3Q${t - 3} 0 ${t - 6} 0H${t * 0.4}Z`, f: shade(c, 0.12), no: true },
        { d: ell([0, -h], t, 6), f: fill },
      ]} />
    </g>
  );
}
S['sf-gz-tutkal-pisirme'] = () => (
  <Scene2 bg="closeup">
    {[-60, -30, 30, 60].map((dx) => <Rock key={dx} x={160 + dx} y={222} s={0.55} />)}
    <Coals x={160} y={222} w={96} h={12} />
    <Kettle x={160} y={196} w={124} h={72} fill="#d9c49a" />
    {[[-30, -2], [-8, 3], [14, -3], [34, 2]].map(([dx, dy], i) => (
      <OG key={i} sh={[{ d: ell([160 + dx, 124 + dy], 9, 3.5), f: '#efe0c4' }]} />
    ))}
    <Steam x={160} y={110} n={3} gap={18} op={0.7} />
    {/* kaynayan kap küçük, yasak */}
    <circle cx={268} cy={58} r={40} fill={K.white} stroke={K.out} stroke-width={1.5} />
    <Kettle x={268} y={78} w={48} h={28} fill={K.water} />
    <g fill={K.waterLight} stroke={K.out} stroke-width={1}>
      <circle cx={258} cy={48} r={3.5} /><circle cx={270} cy={44} r={4} /><circle cx={280} cy={49} r={3} />
    </g>
    <No x={268} y={58} r={40} />
  </Scene2>
);
S['sf-gz-tutkal-suzme'] = () => (
  <Scene2 bg="closeup">
    <Kettle x={200} y={226} w={130} h={66} fill={M.glue} />
    <OG sh={[{ d: `M134 162Q200 214 266 162Q200 176 134 162Z`, f: '#efe6d2' }]} />
    {[[184, 176], [200, 180], [216, 175], [196, 172]].map(([x, y], i) => <OG key={i} sh={[{ d: ell([x, y], 7, 3), f: '#d8c39a' }]} />)}
    <path d="M136 98C158 116 182 140 198 168" stroke={K.out} stroke-width={10} fill="none" stroke-linecap="round" />
    <path d="M136 98C158 116 182 140 198 168" stroke={M.glue} stroke-width={7} fill="none" stroke-linecap="round" />
    <Kettle x={78} y={70} w={86} h={50} a={128} fill={M.glue} />
    <Hand x={30} y={116} a={48} s={0.85} pose="fist" side="L" arm={80} {...HANDS('maker')} />
  </Scene2>
);
S['sf-gz-tutkal-su-banyosu'] = () => (
  <Scene2 bg="closeup">
    <Coals x={160} y={234} w={150} h={12} />
    {/* büyük kap kesiti */}
    <OG sh={[{ d: `M60 96H260V214Q260 222 252 222H68Q60 222 60 214Z`, f: '#8e99a6' }, { d: `M68 100H252V214H68Z`, f: '#cfd6dd' }]} />
    <rect x={68} y={134} width={184} height={80} fill={K.water} opacity={0.85} />
    <path d="M68 134H252" stroke={K.waterLight} stroke-width={3} />
    {/* küçük kap */}
    <OG sh={[{ d: rrect(118, 84, 84, 104, 6), f: '#b8bec6' }, { d: rrect(124, 92, 72, 30, 4), f: M.glue }]} />
    <OG sh={[{ d: rrect(100, 188, 120, 14, 3), f: K.rock }]} />
    <OG sh={[{ d: capsule([174, 104], 4, [214, 34], 4), f: M.wood }, { d: `M168 96L180 96L178 112L170 112Z`, f: '#d9b77a' }]} />
    <Steam x={88} y={124} n={2} gap={12} op={0.8} />
    <Steam x={234} y={124} n={2} gap={12} op={0.8} />
    <Label x={76} y={40} text="55–65 °C" />
  </Scene2>
);

/** Yakın plan iş eldiveni: x,y bilek, a yön (Hand gibi: 0 = parmaklar yukarı), side L/R */
function Mitt({ x, y, a = 0, s = 1, side = 'R', arm = 60, sleeve = CAST.smith.top }: { x: number; y: number; a?: number; s?: number; side?: 'L' | 'R'; arm?: number; sleeve?: string }) {
  const m = side === 'L' ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s * m} ${s})`}>
      <OG ow={OW_ / s} sh={[
        { d: rrect(-11, 14, 22, arm, 4), f: sleeve },
        { d: rrect(-13, -4, 26, 22, 5), f: shade(M.glove, 0.12) },
        { d: 'M-12 -2C-13 -24 -10 -44 0 -46C10 -46 13 -30 12 -2Z', f: M.glove },
        { d: capsule([-10, -10], 5.5, [-22, -28], 5), f: M.glove },
        { d: 'M-4 -40V-20M4 -40V-20', st: shade(M.glove, 0.35), sw: 1.4 },
      ]} />
    </g>
  );
}
const OW_ = 1.5;
/** Eldivende tutulan noktanın konumu (avuç ortası) */
const mittPoint = (x: number, y: number, a: number, s = 1): P => pol([x, y], a - 90, 28 * s);

/* ───── Reçine ───── */
/** Teneke kutu: x,y taban ortası */
const Can = ({ x, y, w = 34, h = 38, fill = M.resin, wire = true }: { x: number; y: number; w?: number; h?: number; fill?: string; wire?: boolean }) => (
  <g>
    {wire && <path d={`M${x - w / 2} ${y - h + 4}Q${x} ${y - h - w * 0.8} ${x + w / 2} ${y - h + 4}`} fill="none" stroke={K.out} stroke-width={2.2} />}
    <OG sh={[
      { d: rrect(x - w / 2, y - h, w, h, 2), f: '#b9c2cc' },
      { d: rrect(x + w * 0.15, y - h, w * 0.35, h, 0), f: shade('#b9c2cc', 0.1), no: true },
      { d: ell([x, y - h], w / 2, 4), f: fill },
    ]} />
  </g>
);
S['sf-gz-recine-guvenlik'] = () => {
  const can: P = [148, 214];
  const p: PersonProps = {
    ...(cast('maker') as PersonProps), x: 238, y: 222, flip: true,
    pose: { ...POSE.kneelOne, spine: -80, head: -70, armF: { to: [196, 158] }, armB: { to: [206, 154] }, face: 'neutral' },
  };
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Coals x={124} y={222} w={96} h={12} />
      <Flame x={96} y={212} s={1.2} />
      <Can x={can[0]} y={can[1]} />
      <Person {...p} mid={() => <St a={[208, 152]} b={[can[0] + 4, can[1] - 60]} r={2.4} c={M.bark} />} />
      <path d={`M${can[0] + 4} ${can[1] - 60}L${can[0]} ${can[1] - 56}`} stroke={K.out} stroke-width={3} />
      <Bucket x={290} y={230} w={34} h={30} c={K.red} fill={M.sand} />
      <OG sh={[{ d: ell([196, 230], 16, 4), f: '#9aa3ad' }]} />
      {/* alevin üstünde kutu: yasak */}
      <circle cx={56} cy={62} r={42} fill={K.white} stroke={K.out} stroke-width={1.5} />
      <Flame x={56} y={96} s={0.9} />
      <Can x={56} y={74} w={26} h={26} wire={false} />
      <No x={56} y={62} r={42} />
    </Scene2>
  );
};
S['sf-gz-recine-komur'] = () => (
  <Scene2 bg="closeup">
    <OG sh={[{ d: circ([66, 78], 34), f: '#9aa3ad' }, { d: circ([66, 78], 27), f: M.resin }]} />
    <OG sh={[{ d: circ([66, 170], 34), f: '#9aa3ad' }, { d: circ([66, 170], 27), f: '#4a454c' }]} />
    {[[56, 162], [72, 176], [62, 180], [78, 160], [54, 172]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill="#7d7880" />)}
    <Arrow from={[106, 84]} to={[150, 112]} w={5} />
    <Arrow from={[106, 164]} to={[150, 138]} w={5} />
    <OG sh={[{ d: circ([222, 126], 72), f: '#9aa3ad' }, { d: circ([222, 126], 62), f: M.tar }]} />
    <path d="M190 104q20-14 44-6" stroke="#fff" stroke-width={3} fill="none" opacity={0.5} stroke-linecap="round" />
    <OG sh={[{ d: capsule([226, 130], 4, [292, 30], 4), f: M.wood }]} />
    <Label x={66} y={226} text="1 : 1" />
  </Scene2>
);
S['sf-gz-recine-cubuk'] = () => (
  <Scene2 bg="closeup">
    {/* alet: taş uç, ahşap sap */}
    <OG sh={[{ d: capsule([20, 176], 8, [170, 176], 8), f: M.wood }, { d: 'M160 162L250 176L160 190Z', f: '#8c8f96' }]} />
    <OG sh={[{ d: `M146 166Q160 160 172 166L172 186Q160 192 146 186Z`, f: M.tar }]} />
    {/* reçine çubuğu */}
    <OG sh={[{ d: capsule([168, 156], 4, [276, 28], 4), f: M.bark }, { d: ell([168, 152], 14, 11), f: M.tar }]} />
    <Hand x={286} y={74} a={-50} s={0.8} pose="fist" side="R" arm={80} {...HANDS('maker')} />
    <Coals x={250} y={236} w={90} h={14} />
    <Heat x={250} y={208} n={3} />
    <Arrow from={[200, 120]} to={[176, 150]} w={5} />
  </Scene2>
);

/* ───── Odun katranı ───── */
S['sf-gz-katran-kaplar'] = () => (
  <Scene2 bg="closeup">
    {/* üst kap ters çevrilmiş: dibi ve delikler görünür */}
    <Vessel x={90} y={86} w={110} h={120} m={0.7} a={180} c={M.fired} inner={false} />
    <OG sh={[{ d: ell([90, 86], 38, 11), f: shade(M.fired, 0.15) }]} />
    {[[-22, 0], [-8, -5], [8, -5], [22, 0], [-8, 5], [8, 5]].map(([dx, dy], i) => <ellipse key={i} cx={90 + dx} cy={86 + dy} rx={3.6} ry={2.4} fill={K.out} />)}
    {/* toplama kabı */}
    <Vessel x={236} y={214} w={96} h={96} m={0.8} c={M.fired} />
  </Scene2>
);
/** Katran düzeneği: üst kap toplama kabının ağzına oturmuş (gy = toprak çizgisi) */
const TarRig = ({ x, gy, mud }: { x: number; gy: number; mud?: boolean }) => (
  <g>
    <Vessel x={x} y={gy + 70} w={74} h={70} m={0.9} c={M.fired} />
    <Vessel x={x} y={gy} w={96} h={96} m={0.6} c={M.fired} inner={false} />
    <OG sh={[{ d: ell([x, gy - 96], 34, 7), f: shade(M.fired, 0.1) }, { d: capsule([x - 6, gy - 104], 4, [x + 6, gy - 104], 4), f: shade(M.fired, 0.1) }]} />
    {mud && <OG sh={[{ d: rrect(x - 38, gy - 6, 76, 12, 6), f: M.mud }, { d: rrect(x - 36, gy - 102, 72, 10, 5), f: M.mud }]} />}
  </g>
);
S['sf-gz-katran-sivama'] = () => (
  <Scene2 bg="outdoor" gy={170} ground="dirt">
    <rect x={0} y={170} width={320} height={70} fill="#9c7552" />
    <path d="M0 170H320" stroke={shade('#9c7552', 0.3)} stroke-width={3} />
    <TarRig x={150} gy={170} mud />
    <Hand {...wristFor([194, 168], -110, 0.85, 'press', 'L')} a={-110} s={0.85} pose="press" side="L" arm={160} {...HANDS('maker')} />
    <Bucket x={276} y={176} w={44} h={36} c="#7f8c99" fill={M.mud} />
  </Scene2>
);
S['sf-gz-katran-ates'] = () => {
  const gy = 150;
  return (
    <Scene2 bg="outdoor" gy={gy} ground="dirt">
      <rect x={0} y={gy} width={320} height={240 - gy} fill="#9c7552" />
      <path d={`M0 ${gy}H320`} stroke={shade('#9c7552', 0.3)} stroke-width={3} />
      <TarRig x={160} gy={gy} mud />
      {/* gömülü kap serin: içinde katran damlaları */}
      <ellipse cx={160} cy={212} rx={24} ry={6} fill={M.tar} />
      {[176, 190, 202].map((yy, i) => <ellipse key={yy} cx={152 + i * 8} cy={yy} rx={2.6} ry={3.6} fill={M.tar} />)}
      {[[86, 144, 120, 86], [234, 144, 200, 86], [96, 146, 226, 146], [104, 120, 128, 60], [216, 120, 192, 60]].map(([x1, y1, x2, y2], i) => (
        <St key={i} a={[x1, y1]} b={[x2, y2]} r={5} c={i % 2 ? M.bark : shade(M.bark, 0.12)} />
      ))}
      <Flame x={100} y={146} s={1.5} />
      <Flame x={222} y={146} s={1.5} />
      <Flame x={124} y={100} s={0.9} />
      <Flame x={198} y={100} s={0.9} />
      <path d="M160 166V214" stroke={K.water} stroke-width={2} opacity={0} />
      <path d={`M118 ${gy + 8}Q160 ${gy + 2} 202 ${gy + 8}L196 ${gy + 64}Q160 ${gy + 72} 124 ${gy + 64}Z`} fill={K.waterLight} opacity={0.25} />
    </Scene2>
  );
};

/* ───── Demirci ocağı ───── */
S['sf-gz-ocak-kesit'] = () => (
  <Scene2 bg="outdoor" ground="dirt">
    {/* taş masa kesiti */}
    <OG sh={[{ d: rrect(24, 108, 220, 120, 4), f: '#b9b0a3' }]} />
    {[[24, 148, 244], [24, 188, 244]].map(([x1, y, x2], i) => <path key={i} d={`M${x1} ${y}H${x2}`} stroke={shade('#b9b0a3', 0.2)} stroke-width={1.5} />)}
    {[[70, 108, 148], [180, 148, 188], [110, 188, 228]].map(([x, y1, y2], i) => <path key={i} d={`M${x} ${y1}V${y2}`} stroke={shade('#b9b0a3', 0.2)} stroke-width={1.5} />)}
    <path d="M78 108Q86 174 134 176Q182 174 190 108Z" fill="#4b3b33" stroke={K.out} stroke-width={2} />
    {/* hava borusu */}
    <OG sh={[{ d: rrect(130, 166, 190, 12, 2), f: M.ironL }]} />
    <Coals x={134} y={170} w={92} h={22} />
    <Coals x={134} y={146} w={104} h={22} />
    <Coals x={134} y={122} w={110} h={16} />
    {/* körük ucu */}
    <OG sh={[{ d: 'M262 150L312 138V206L262 194Z', f: M.leather }, { d: rrect(250, 160, 14, 24, 2), f: M.wood }]} />
    <Arrow from={[236, 152]} to={[196, 166]} w={5} />
    <path d="M82 96V86M186 96V86M82 91H186" stroke={K.action} stroke-width={3} />
    <Label x={134} y={70} text="30 cm" />
  </Scene2>
);
S['sf-gz-ocak-ors-yukseklik'] = () => {
  const p: PersonProps = { ...(cast('smith') as PersonProps), x: 132, y: 226, s: 1.05, pose: { ...POSE.stand, armF: [86, 90], armB: [96, 92], handF: 'fist', face: 'neutral' } };
  const r = rig(p);
  const knuckle = r.handF[1];
  const as = (226 - knuckle) / 58;
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Anvil x={226} y={226} s={as} />
      <Smith {...p} front />
      <path d={`M${r.handF[0] - 6} ${knuckle}H300`} stroke={K.action} stroke-width={2.6} stroke-dasharray="7 5" />
    </Scene2>
  );
};
S['sf-gz-ocak-koruyucu'] = () => {
  const p: PersonProps = { ...(cast('smith') as PersonProps), x: 160, y: 228, s: 1.15, pose: { ...POSE.stand, armF: [70, 96], armB: [104, 94], face: 'neutral' } };
  const r = rig(p);
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Bucket x={64} y={226} w={46} h={42} fill={K.water} />
      <Smith {...p} front over={() => <Tongs from={r.handF} to={[r.handF[0] + 34, r.handF[1] + 40]} s={1.1} />} />
    </Scene2>
  );
};

/* ───── Dövme ───── */
S['sf-gz-dovme-renkler'] = () => {
  const cs = ['#8e1c1c', '#cf2f24', '#ff7a1a', '#ffd84a'];
  const tx = ['650', '750–800', '900–1000', '1100+'];
  return (
    <Scene2 bg="dark">
      {cs.map((c, i) => (
        <g key={c}>
          <OG sh={[{ d: rrect(18 + i * 72, 92, 68, 40, i === 0 ? 10 : 2), f: c }]} />
          <text x={52 + i * 72} y={164} fill="#fff" font-size={14} font-weight={700} text-anchor="middle">{tx[i]}</text>
        </g>
      ))}
      <text x={160} y={196} fill="#cfd6dd" font-size={14} text-anchor="middle">°C</text>
    </Scene2>
  );
};
S['sf-gz-dovme-vurus'] = () => {
  const anvilX = 214, as = 1.15, top = 226 - 58 * as;
  const p: PersonProps = {
    ...(cast('smith') as PersonProps), x: 120, y: 226,
    pose: { ...POSE.standSide, spine: -84, head: -72, armF: { to: [168, 78] }, armB: { to: [172, 140] }, handF: 'fist', handB: 'fist', face: 'neutral' },
  };
  const r = rig(p);
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Anvil x={anvilX} y={226} s={as} />
      <Bar a={[186, top - 4]} b={[246, top - 4]} r={4} hot={0.55} />
      <Smith {...p} over={(rr) => <g><Tongs from={rr.handB} to={[190, top - 4]} /><Hammer at={rr.handF} a={-20} len={30} /></g>} />
      <Arrow from={[222, 70]} to={[226, top - 26]} bend={-0.25} w={5} />
    </Scene2>
  );
};
S['sf-gz-dovme-siyah-sicak'] = () => (
  <Scene2 bg="closeup">
    <OG sh={[{ d: rrect(-10, 150, 240, 100, 4), f: M.iron }, { d: rrect(-10, 150, 240, 8, 2), f: M.ironL }]} />
    <Bar a={[30, 138]} b={[200, 138]} r={8} c="#2f3138" />
    <Heat x={80} y={118} n={3} />
    <Heat x={150} y={118} n={3} />
    <Hand x={306} y={170} a={-80} s={1} pose="open" side="L" view="palm" arm={60} skin={CAST.smith.skin} sleeve={CAST.smith.top} />
    <Bad x={282} y={44} r={18} />
  </Scene2>
);

/* ───── Su verme ───── */
/** Bıçak (sırt üstte): x,y sap tarafı uç ortası, l uzunluk */
const bladeD = (x: number, y: number, l: number, w: number) =>
  `M${x} ${y - w / 2}H${x + l * 0.8}Q${x + l * 0.95} ${y - w / 2} ${x + l} ${y + w / 2}H${x}Z`;
S['sf-gz-suverme-miknatis'] = () => {
  const m1 = { x: 30, y: 226, a: 60, s: 0.95 };
  const g1 = mittPoint(m1.x, m1.y, m1.a, m1.s);
  const mg: P = [190, 92];
  const m2 = { x: 284, y: 60, a: -96, s: 0.85 };
  return (
    <Scene2 bg="dark">
      <OG sh={[{ d: bladeD(118, 150, 130, 30), f: '#d8322a' }]} />
      <path d={`M128 142H220`} stroke="#ff8a5a" stroke-width={4} opacity={0.6} stroke-linecap="round" />
      <Tongs from={g1} to={[124, 150]} s={1.2} />
      <Mitt {...m1} side="L" />
      {/* at nalı mıknatıs: bıçağı çekmiyor */}
      <OG sh={[
        { d: `M${mg[0] - 24} ${mg[1]}V${mg[1] - 18}A24 24 0 0 1 ${mg[0] + 24} ${mg[1] - 18}V${mg[1]}H${mg[0] + 12}V${mg[1] - 18}A12 12 0 0 0 ${mg[0] - 12} ${mg[1] - 18}V${mg[1]}Z`, f: K.red },
        { d: rrect(mg[0] - 24, mg[1], 12, 12, 1), f: M.steel },
        { d: rrect(mg[0] + 12, mg[1], 12, 12, 1), f: M.steel },
        { d: capsule([mg[0] + 22, mg[1] - 24], 3, [252, mg[1] - 30], 3), f: M.wood },
      ]} />
      <Mitt {...m2} side="R" />
      <path d={`M${mg[0]} ${mg[1] + 18}V${mg[1] + 40}`} stroke="#cfd6dd" stroke-width={2} stroke-dasharray="4 4" />
      <Label x={86} y={44} text="770 °C" />
    </Scene2>
  );
};
S['sf-gz-suverme-daldirma'] = () => {
  const pot: P = [214, 224];
  const p: PersonProps = {
    ...(cast('smith') as PersonProps), x: 106, y: 224,
    pose: { ...POSE.standSide, spine: -80, head: -74, armF: { to: [168, 118] }, armB: { to: [160, 124] }, handF: 'fist', handB: 'fist', face: 'neutral' },
  };
  return (
    <Scene2 bg="outdoor" ground="dirt">
      {/* kap arkası ve yağ */}
      <OG sh={[{ d: `M${pot[0] - 40} ${pot[1] - 80}H${pot[0] + 40}V${pot[1]}H${pot[0] - 40}Z`, f: '#7f8995' }]} />
      <ellipse cx={pot[0]} cy={pot[1] - 80} rx={40} ry={7} fill="#c99a2e" stroke={K.out} stroke-width={1.5} />
      {/* bıçak dik, yağa giriyor */}
      <OG sh={[{ d: `M${pot[0] - 6} ${pot[1] - 130}H${pot[0] + 6}V${pot[1] - 70}L${pot[0]} ${pot[1] - 58}L${pot[0] - 6} ${pot[1] - 70}Z`, f: '#d8322a' }]} />
      <OG sh={[{ d: `M${pot[0] - 40} ${pot[1] - 78}H${pot[0] + 40}V${pot[1]}H${pot[0] - 40}Z`, f: '#8e99a6' }, { d: `M${pot[0] + 14} ${pot[1] - 78}H${pot[0] + 40}V${pot[1]}H${pot[0] + 14}Z`, f: shade('#8e99a6', 0.12), no: true }]} />
      <Smith {...p} over={(r) => <Tongs from={r.handF} to={[pot[0], pot[1] - 126]} s={1.1} />} />
      <OG sh={[{ d: ell([284, 226], 22, 5), f: '#9aa3ad' }]} />
      <Bucket x={290} y={212} w={30} h={28} c={K.red} fill={M.sand} />
      <Arrow from={[252, 96]} to={[252, 56]} w={5} />
      <Arrow from={[252, 104]} to={[252, 144]} w={5} />
    </Scene2>
  );
};
S['sf-gz-suverme-menevis-renk'] = () => {
  const bands = ['#3d5fa8', '#7a4a9c', '#9a6a3a', '#c8963c', '#e8cf86'];
  const x0 = 40, l = 240, yS = 170, w = 80;
  return (
    <Scene2 bg="closeup">
      <defs>
        <clipPath id="sfgz-blade"><path d={`M${x0} ${yS}H${x0 + l * 0.8}Q${x0 + l * 0.95} ${yS} ${x0 + l} ${yS - w}H${x0}Z`} /></clipPath>
      </defs>
      {/* ısıtan kızgın demir, sırtın altında */}
      <Bar a={[20, yS + 12]} b={[300, yS + 12]} r={8} hot={1} />
      <g clip-path="url(#sfgz-blade)">
        {bands.map((c, i) => <rect key={c} x={0} y={yS - (i + 1) * (w / 5)} width={320} height={w / 5 + 0.5} fill={c} />)}
      </g>
      <path d={`M${x0} ${yS}H${x0 + l * 0.8}Q${x0 + l * 0.95} ${yS} ${x0 + l} ${yS - w}H${x0}Z`} fill="none" stroke={K.out} stroke-width={2} />
      <Arrow from={[300, 150]} to={[300, 92]} w={5} />
      <Label x={160} y={40} text="205–310 °C" />
    </Scene2>
  );
};

/* ───── Hurdadan alet ───── */
S['sf-gz-hurda-secim'] = () => (
  <Scene2 bg="closeup">
    <Divider />
    {/* sert çelik: yaprak yay, helezon yay, eğe, aks */}
    {[0, 9, 18].map((d) => <path key={d} d={`M${24 + d} ${70 + d * 0.3}Q80 ${38 + d} ${136 - d} ${70 + d * 0.3}`} fill="none" stroke={K.out} stroke-width={8} stroke-linecap="round" />)}
    {[0, 9, 18].map((d) => <path key={'i' + d} d={`M${24 + d} ${70 + d * 0.3}Q80 ${38 + d} ${136 - d} ${70 + d * 0.3}`} fill="none" stroke={M.iron} stroke-width={5} stroke-linecap="round" />)}
    <Line d="M30 128l10-18l10 18l10-18l10 18l10-18l10 18l10-18l10 18" c={M.ironL} w={5} />
    <OG sh={[{ d: rrect(40, 146, 96, 14, 2), f: '#7b828d' }, { d: capsule([136, 153], 3, [150, 153], 3), f: M.iron }]} />
    {[48, 58, 68, 78, 88, 98, 108, 118, 128].map((x) => <path key={x} d={`M${x} 147l6 12`} stroke={shade('#7b828d', 0.3)} stroke-width={1.2} />)}
    <OG sh={[{ d: capsule([30, 182], 8, [140, 182], 8), f: M.iron }]} />
    {/* yumuşak demir: çivi, inşaat demiri, cıvata, sac */}
    {[0, 1, 2].map((i) => <OG key={i} sh={[{ d: capsule([186 + i * 16, 50], 2.2, [196 + i * 16, 96], 1.4), f: M.ironL }, { d: ell([186 + i * 16, 50], 6, 2.6), f: M.ironL }]} />)}
    <OG sh={[{ d: capsule([180, 124], 5, [296, 116], 5), f: '#9a6b4a' }]} />
    {[192, 206, 220, 234, 248, 262, 276].map((x) => <path key={x} d={`M${x} 115l3 9`} stroke={shade('#9a6b4a', 0.35)} stroke-width={1.4} />)}
    <OG sh={[{ d: 'M262 52l12-7l12 7v14l-12 7l-12-7z', f: M.ironL }, { d: rrect(268, 66, 12, 34, 2), f: M.ironL }]} />
    <OG sh={[{ d: 'M186 150L284 144L292 186L194 194Z', f: '#b8c0c8' }]} />
    <Label x={86} y={218} text="sert çelik" size={14} bg={M.iron} color="#fff" />
    <Label x={238} y={218} text="yumuşak demir" size={14} bg={M.ironL} color={K.ink} />
  </Scene2>
);
/** Taş ocak (önden): x orta, y zemin */
const Forge = ({ x, y, w = 120, h = 70 }: { x: number; y: number; w?: number; h?: number }) => (
  <g>
    <OG sh={[{ d: rrect(x - w / 2, y - h, w, h, 4), f: '#b9b0a3' }]} />
    {[0.33, 0.66].map((k) => <path key={k} d={`M${x - w / 2} ${y - h + h * k}H${x + w / 2}`} stroke={shade('#b9b0a3', 0.2)} stroke-width={1.5} />)}
    <Coals x={x} y={y - h + 6} w={w - 20} h={16} />
  </g>
);
S['sf-gz-hurda-galvaniz-yasak'] = () => {
  const p: PersonProps = { ...(cast('smith') as PersonProps), x: 58, y: 226, flip: true, pose: { ...POSE.walk, head: -96, face: 'worried' } };
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Forge x={200} y={222} w={130} h={66} />
      {/* galvanizli boru: pullu desen */}
      <OG sh={[{ d: rrect(146, 140, 108, 18, 8), f: '#c9d0d6' }]} />
      {[[160, 146], [178, 150], [196, 145], [214, 151], [232, 146]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l6 -3l5 4l-5 3z`} fill="#e9eef2" stroke="#9aa3ad" stroke-width={0.8} />)}
      {/* kalın beyaz duman */}
      <g fill="#f4f5f6" stroke="#b9bfc6" stroke-width={1.5}>
        <circle cx={186} cy={112} r={20} /><circle cx={212} cy={96} r={24} /><circle cx={190} cy={74} r={22} /><circle cx={226} cy={60} r={20} /><circle cx={160} cy={92} r={16} />
      </g>
      <Smith {...p} />
      <Arrow from={[106, 90]} to={[70, 90]} w={5} />
      <No x={200} y={110} r={62} />
    </Scene2>
  );
};
S['sf-gz-hurda-kapali-kap-yasak'] = () => (
  <Scene2 bg="outdoor" ground="dirt">
    <Campfire x={160} y={218} s={1.5} />
    {/* gaz tüpü */}
    <OG sh={[{ d: rrect(28, 120, 44, 92, 18), f: K.red }, { d: rrect(42, 108, 16, 14, 3), f: M.ironL }]} />
    {/* sprey */}
    <OG sh={[{ d: rrect(100, 150, 26, 62, 6), f: '#3d7ad6' }, { d: rrect(106, 140, 14, 12, 3), f: K.white }]} />
    {/* kapalı boru */}
    <OG sh={[{ d: rrect(196, 186, 64, 22, 4), f: M.ironL }, { d: rrect(190, 182, 10, 30, 3), f: M.iron }, { d: rrect(256, 182, 10, 30, 3), f: M.iron }]} />
    {/* amortisör */}
    <OG sh={[{ d: rrect(276, 110, 22, 60, 4), f: '#4a4f58' }, { d: rrect(282, 168, 10, 44, 2), f: M.steel }, { d: circ([287, 104], 8), f: '#4a4f58' }]} />
    <No x={50} y={164} r={30} />
    <No x={113} y={180} r={24} />
    <No x={228} y={197} r={24} />
    <No x={287} y={156} r={28} />
  </Scene2>
);

/* ───── Döküm ───── */
/** Pota: x,y taban ortası */
const Crucible = ({ x, y, s = 1, a = 0 }: { x: number; y: number; s?: number; a?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    <OG ow={1.5 / s} sh={[
      { d: 'M-26 -54H26L18 -4Q16 0 12 0H-12Q-16 0 -18 -4Z', f: '#5d6068' },
      { d: ell([0, -54], 26, 6), f: '#eef3f8' },
    ]} />
    <ellipse cx={-6} cy={-55} rx={12} ry={2.4} fill="#fff" />
    <ellipse cx={0} cy={-54} rx={22} ry={4} fill={M.hot} opacity={0.25} />
  </g>
);
S['sf-gz-dokum-su-patlama'] = () => (
  <Scene2 bg="closeup">
    <Coals x={160} y={232} w={160} h={14} />
    <Crucible x={160} y={214} s={1.6} />
    {/* sıçrayan metal */}
    {[[-60, -40], [-40, -66], [-10, -80], [24, -74], [52, -56], [70, -30], [-74, -16]].map(([dx, dy], i) => (
      <OG key={i} sh={[{ d: ell([160 + dx, 122 + dy], 6, 5), f: i % 2 ? '#eef3f8' : M.hotY }]} />
    ))}
    <path d="M160 126l-14-30M160 126l16-32M160 126l-34-14M160 126l34-12" stroke={M.hot} stroke-width={3} stroke-linecap="round" />
    <path d="M230 40c-6 10-9 15-9 19a9 9 0 0 0 18 0c0-4-3-9-9-19z" fill={K.water} stroke={K.out} stroke-width={1.5} />
    <Arrow from={[220, 74]} to={[188, 110]} w={4} />
    <Bad x={284} y={44} r={18} />
    <Label x={60} y={40} text="1600×" />
  </Scene2>
);
S['sf-gz-dokum-kalip'] = () => (
  <Scene2 bg="closeup">
    {/* kalın kum tabakası */}
    <OG sh={[{ d: rrect(10, 196, 300, 40, 4), f: M.sand }]} />
    {[[40, 210], [90, 222], [150, 212], [220, 224], [270, 210]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} fill={shade(M.sand, 0.3)} />)}
    {/* kum kutusu kesiti */}
    <OG sh={[{ d: rrect(52, 92, 176, 104, 3), f: M.wood }, { d: rrect(62, 96, 156, 96, 2), f: tint(M.sand, 0.1) }]} />
    <path d="M110 96L118 150H162L170 96Z" fill="#5b4a3c" stroke={K.out} stroke-width={2} />
    <path d="M132 150V168M148 150V168M132 168H148" stroke="#5b4a3c" stroke-width={0} />
    {[[80, 120], [196, 130], [90, 170], [190, 176], [140, 176]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} fill={shade(M.sand, 0.3)} />)}
    {/* beton zemin: yasak */}
    <circle cx={268} cy={66} r={42} fill={K.white} stroke={K.out} stroke-width={1.5} />
    <OG sh={[{ d: rrect(236, 64, 64, 26, 2), f: '#a9aaa8' }]} />
    <path d="M250 64l6 10l-4 8M282 64l-4 12" stroke={K.out} stroke-width={1.5} fill="none" />
    <No x={268} y={66} r={42} />
  </Scene2>
);
S['sf-gz-dokum-koruyucu'] = () => {
  const p: PersonProps = { ...(cast('smith') as PersonProps), x: 120, y: 226, s: 1.1, pose: { ...POSE.stand, armF: { to: [182, 142] }, armB: { to: [168, 150] }, face: 'neutral' } };
  const r = rig(p);
  const cr: P = [230, 162];
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <OG sh={[{ d: rrect(222, 204, 82, 22, 3), f: M.sand }, { d: ell([262, 206], 14, 4), f: '#5b4a3c' }]} />
      <path d="M274 158Q280 176 266 204" stroke={K.out} stroke-width={7} fill="none" stroke-linecap="round" />
      <path d="M274 158Q280 176 266 204" stroke="#eef3f8" stroke-width={4} fill="none" stroke-linecap="round" />
      <Smith {...p} front over={() => <g>
        <Tongs from={lerp(r.handB, r.handF, 0.5)} to={[cr[0] + 16, cr[1] - 4]} s={1.3} />
      </g>} />
      <Crucible x={cr[0]} y={cr[1]} s={0.8} a={75} />
    </Scene2>
  );
};

/* ───── Tekerlek ───── */
const Planks = ({ x, y, h = 150 }: { x: number; y: number; h?: number }) => (
  <g>
    <OG sh={[
      { d: rrect(x, y, 44, h, 2), f: M.woodL },
      { d: rrect(x + 44, y, 66, h, 2), f: shade(M.woodL, 0.05) },
      { d: rrect(x + 110, y, 44, h, 2), f: M.woodL },
    ]} />
    {[x + 14, x + 30, x + 64, x + 88, x + 126, x + 140].map((xx) => <path key={xx} d={`M${xx} ${y + 8}Q${xx + 3} ${y + h / 2} ${xx} ${y + h - 8}`} stroke={shade(M.woodL, 0.18)} stroke-width={1.2} fill="none" />)}
  </g>
);
S['sf-gz-tekerlek-kalas'] = () => (
  <Scene2 bg="closeup">
    <Planks x={22} y={44} />
    {[82, 154].map((yy) => (
      <g key={yy}>
        <OG sh={[{ d: rrect(14, yy, 170, 16, 3), f: M.wood }]} />
        {[40, 99, 158].map((xx) => <circle key={xx} cx={xx} cy={yy + 8} r={3} fill={shade(M.wood, 0.4)} stroke={K.out} stroke-width={1} />)}
      </g>
    ))}
    {/* enine kütük dilimi: çatlak */}
    <OG sh={[{ d: circ([254, 120], 48), f: M.bark }, { d: circ([254, 120], 42), f: M.woodL }]} />
    {[0.66, 0.33].map((k) => <circle key={k} cx={254} cy={120} r={42 * k} fill="none" stroke={shade(M.woodL, 0.2)} stroke-width={1.2} />)}
    <path d="M254 120L290 98M254 120L230 160M254 120L262 80" stroke={K.out} stroke-width={3} fill="none" />
    <Bad x={290} y={170} r={16} />
  </Scene2>
);
S['sf-gz-tekerlek-pergel'] = () => {
  const c: P = [150, 122];
  const r = 92;
  const ca = 30;
  const tip = pol(c, ca, r);
  return (
    <Scene2 bg="closeup">
      <g transform="translate(-12 -2)"><Planks x={84} y={30} h={188} /></g>
      <path d={`M${pol(c, ca, r)[0]} ${pol(c, ca, r)[1]}A${r} ${r} 0 1 1 ${pol(c, 300, r)[0]} ${pol(c, 300, r)[1]}`} fill="none" stroke={K.ink} stroke-width={3.5} transform="scale(1)" />
      <path d={`M${pol(c, 300, r)[0]} ${pol(c, 300, r)[1]}A${r} ${r} 0 0 1 ${tip[0]} ${tip[1]}`} fill="none" stroke={K.ink} stroke-width={2} stroke-dasharray="4 6" opacity={0.5} />
      <Line d={`M${c[0]} ${c[1]}L${tip[0]} ${tip[1]}`} c={M.rope} w={2.4} />
      <OG sh={[{ d: circ(c, 5), f: M.ironL }]} />
      <OG sh={[{ d: capsule(tip, 5, pol(tip, ca + 20, 18), 5), f: M.coal }]} />
      <Arrow from={pol(c, -30, r + 18)} to={pol(c, 20, r + 18)} bend={0.2} w={5} />
    </Scene2>
  );
};
S['sf-gz-tekerlek-pim'] = () => (
  <Scene2 bg="closeup">
    {/* tekerlek kenardan, göbek, aks, pim */}
    <OG sh={[{ d: rrect(60, 16, 34, 216, 6), f: M.woodL }, { d: rrect(94, 92, 34, 66, 4), f: M.wood }]} />
    <OG sh={[{ d: rrect(100, 108, 180, 34, 10), f: shade(M.wood, 0.15) }]} />
    <OG sh={[{ d: rrect(232, 84, 14, 82, 4), f: M.woodL }]} />
    <path d="M128 112H226M128 138H226" stroke={shade(M.wood, 0.35)} stroke-width={1} />
    <Arrow from={[239, 40]} to={[239, 76]} w={5} />
  </Scene2>
);

/* ───── El arabası ve kağnı ───── */
/** El arabası (yandan, tekerlek sağda): x tekerlek merkezi, y zemin; load: yükün konumu 0 (tekerlekte) .. 1 (elde) */
function barrowGeo(x: number, y: number) {
  const r = 18;
  const ax: P = [x, y - r];
  const hd: P = [x - 124, y - 52];
  const at = (t: number): P => lerp(ax, hd, t);
  const a = ang(hd, ax);
  const up = (p: P, d: number): P => pol(p, a - 90, d);
  return { r, ax, hd, at, up, a };
}
function Barrow({ x, y, load, tray = true }: { x: number; y: number; load?: number; tray?: boolean }) {
  const g = barrowGeo(x, y);
  const t0 = g.at(0.1), t1 = g.at(0.62);
  const lp = load === undefined ? null : g.at(0.2 + load * 0.36);
  return (
    <g>
      <OG sh={[
        { d: capsule(g.at(0.66), 2.5, [x - 86, y], 2.5), f: M.wood },
        ...(tray ? [{ d: `M${t0[0]} ${t0[1]}L${t1[0]} ${t1[1]}L${g.up(t1, 26)[0] - 8} ${g.up(t1, 26)[1]}L${g.up(t0, 26)[0] + 12} ${g.up(t0, 26)[1]}Z`, f: M.woodL }] : []),
        { d: capsule(g.ax, 3, g.hd, 3), f: M.wood },
      ]} />
      <OG sh={[{ d: circ(g.ax, g.r), f: M.wood }, { d: circ(g.ax, g.r * 0.3), f: shade(M.wood, 0.3) }]} />
      {lp && <g transform={`rotate(${g.a} ${lp[0]} ${lp[1]})`}><OG sh={[{ d: rrect(lp[0] - 16, lp[1] - 46, 32, 34, 6), f: '#b49a6a' }]} /></g>}
    </g>
  );
}
S['sf-gz-elarabasi-yuk'] = () => {
  const one = (x0: number, load: number, good: boolean) => {
    const wx = x0 + 136, gy = 190;
    const g = barrowGeo(wx, gy);
    return (
      <g>
        <Barrow x={wx} y={gy} load={load} />
        <Arrow from={[wx, gy - 96]} to={[wx, gy - 44]} w={good ? 10 : 4} />
        <Arrow from={[g.hd[0] + 4, g.hd[1] - 52]} to={[g.hd[0] + 4, g.hd[1] - 10]} w={good ? 4 : 10} />
        {good ? <Ok x={x0 + 76} y={220} r={13} /> : <Bad x={x0 + 76} y={220} r={13} />}
      </g>
    );
  };
  return (
    <Scene2 bg="closeup">
      <Divider />
      {one(0, 0.05, true)}
      {one(160, 0.95, false)}
    </Scene2>
  );
};
S['sf-gz-elarabasi-kaldirma'] = () => {
  const g = barrowGeo(280, 224);
  const grip = g.hd;
  const p: PersonProps = {
    ...(cast('cart') as PersonProps), x: 108, y: 224,
    pose: { spine: -76, chest: -80, head: -86, legB: [-26, 100], legF: [-12, 104], footB: 0, footF: 0, armB: { to: [grip[0] - 4, grip[1]] }, armF: { to: grip }, handB: 'fist', handF: 'fist', face: 'neutral' },
  };
  return (
    <Scene2 bg="outdoor" ground="dirt">
      <Barrow x={280} y={224} load={0.1} />
      <Person {...p} />
      <Arrow from={[196, 150]} to={[196, 112]} w={5} />
    </Scene2>
  );
};
S['sf-gz-kagni-parcalar'] = () => (
  <Scene2 bg="outdoor" ground="dirt">
    {/* arka tekerlek */}
    <OG sh={[{ d: circ([116, 162], 56), f: shade(M.wood, 0.2) }]} />
    {/* şasi ve yan parmaklıklar */}
    <OG sh={[{ d: rrect(30, 100, 190, 14, 3), f: M.wood }]} />
    {[44, 82, 120, 158, 196].map((x) => <OG key={x} sh={[{ d: capsule([x, 100], 3, [x - 4, 62], 3), f: M.woodL }]} />)}
    <OG sh={[{ d: capsule([36, 66], 3, [200, 66], 3), f: M.woodL }]} />
    {/* ok (uzun çeki ağacı) */}
    <OG sh={[{ d: capsule([180, 110], 6, [312, 150], 5), f: M.wood }]} />
    {/* dingil yatağı ve öndeki tekerlek */}
    <OG sh={[{ d: circ([132, 168], 56), f: M.woodL }]} />
    <path d="M104 120V216M160 120V216" stroke={shade(M.woodL, 0.3)} stroke-width={1.5} />
    <OG sh={[{ d: circ([132, 168], 14), f: M.wood }, { d: rrect(110, 104, 44, 12, 2), f: M.bark }]} />
  </Scene2>
);

/* ───── Kızak ───── */
const runner = (x: number, y: number, l: number) => `M${x} ${y}H${x + l}C${x + l + 30} ${y} ${x + l + 38} ${y - 30} ${x + l + 22} ${y - 40}`;
S['sf-gz-kizak-cati'] = () => {
  const A: P = [26, 196], B: P = [70, 146], L = 200;
  const xs = [0.06, 0.28, 0.5, 0.72, 0.94];
  return (
    <Scene2 bg="outdoor" ground="snow">
      <Line d={runner(B[0], B[1], L)} c={M.wood} w={8} />
      {xs.map((t) => {
        const a: P = [A[0] + t * L, A[1] - 16], b: P = [B[0] + t * L, B[1] - 16];
        return (
          <g key={t}>
            <St a={[B[0] + t * L, B[1]]} b={b} r={3} c={shade(M.wood, 0.1)} />
            <St a={a} b={b} r={4.5} c={M.woodL} />
          </g>
        );
      })}
      {xs.map((t) => <St key={'p' + t} a={[A[0] + t * L, A[1]]} b={[A[0] + t * L, A[1] - 16]} r={3} c={shade(M.wood, 0.1)} />)}
      <Line d={runner(A[0], A[1], L)} c={M.wood} w={9} />
      {/* patenler arası genişlik: traversin boyunca ölçü */}
      <path d={`M${A[0] + 0.61 * L} ${A[1] - 8}L${B[0] + 0.61 * L} ${B[1] - 8}M${A[0] + 0.61 * L - 7} ${A[1] - 14}L${A[0] + 0.61 * L + 7} ${A[1] - 2}M${B[0] + 0.61 * L - 7} ${B[1] - 14}L${B[0] + 0.61 * L + 7} ${B[1] - 2}`} stroke={K.out} stroke-width={5.5} stroke-linecap="round" />
      <path d={`M${A[0] + 0.61 * L} ${A[1] - 8}L${B[0] + 0.61 * L} ${B[1] - 8}M${A[0] + 0.61 * L - 7} ${A[1] - 14}L${A[0] + 0.61 * L + 7} ${A[1] - 2}M${B[0] + 0.61 * L - 7} ${B[1] - 14}L${B[0] + 0.61 * L + 7} ${B[1] - 2}`} stroke={K.action} stroke-width={3} stroke-linecap="round" />
      <Label x={B[0] + 0.61 * L + 6} y={102} text="50–60 cm" size={14} />
    </Scene2>
  );
};
S['sf-gz-kizak-baglama'] = () => (
  <Scene2 bg="closeup">
    <Divider x={204} />
    <OG sh={[{ d: rrect(84, 70, 30, 160, 6), f: shade(M.wood, 0.08) }]} />
    <OG sh={[{ d: capsule([14, 100], 16, [190, 100], 16), f: M.woodL }]} />
    {[-12, -4, 4, 12].map((d) => <Line key={'a' + d} d={`M${80 + d} ${80}L${118 + d} ${122}`} c={M.leather} w={4} />)}
    {[-12, -4, 4, 12].map((d) => <Line key={'b' + d} d={`M${118 + d} ${78}L${80 + d} ${122}`} c={tint(M.leather, 0.1)} w={4} />)}
    {/* çivili, çatlamış */}
    <OG sh={[{ d: rrect(244, 110, 22, 120, 4), f: shade(M.wood, 0.08) }, { d: capsule([216, 128], 12, [306, 128], 12), f: M.woodL }]} />
    <circle cx={255} cy={128} r={4} fill={M.iron} stroke={K.out} stroke-width={1.2} />
    <path d="M259 126l14-6l10 4M252 138l-8 10l-12 2" stroke={K.out} stroke-width={2} fill="none" />
    <Bad x={262} y={66} r={16} />
    <Ok x={100} y={40} r={16} />
  </Scene2>
);
S['sf-gz-kizak-cekme'] = () => {
  const p: PersonProps = {
    ...(cast('sled') as PersonProps), x: 220, y: 222,
    pose: { ...POSE.walk, spine: -74, chest: -76, head: -82, armB: [100, 70], armF: [70, 60], face: 'neutral' },
  };
  const r = rig(p);
  const waist = lerp(r.hip, r.belly, 0.5);
  return (
    <Scene2 bg="outdoor" ground="snow">
      <Tree x={36} y={194} kind="pine" s={0.8} />
      {/* kızak ve yük */}
      <OG sh={[{ d: rrect(40, 176, 104, 12, 3), f: M.woodL }, { d: rrect(50, 146, 84, 30, 8), f: '#7a8a5a' }]} />
      <path d="M58 160H126M92 148V174" stroke={M.rope} stroke-width={2.4} />
      <Line d={`M36 196H138C156 196 160 180 152 172`} c={M.wood} w={6} />
      <Line d={`M152 176L${waist[0]} ${waist[1] + 2}`} c={M.rope} w={2.6} />
      <Person {...p} mid={(rr) => (
        <g>
          <path d={`M${rr.hip[0] - 10} ${rr.hip[1] - 6}L${rr.belly[0] + 4} ${rr.belly[1] + 2}`} stroke={M.leather} stroke-width={5} stroke-linecap="round" />
          <path d={`M${rr.back[0]} ${rr.back[1] - 4}L${rr.chest[0] + 2} ${rr.chest[1]}`} stroke={M.leather} stroke-width={5} stroke-linecap="round" />
        </g>
      )} />
      <Arrow from={[262, 120]} to={[300, 120]} w={5} />
    </Scene2>
  );
};

/* ───── Sal ───── */
/** Kütük sal (yandan): x sol, y su çizgisi */
const RaftSide = ({ x, y, w = 150 }: { x: number; y: number; w?: number }) => (
  <g>
    <OG sh={[{ d: rrect(x, y - 16, w, 22, 11), f: M.bark }, { d: rrect(x + 6, y - 22, w - 12, 8, 3), f: shade(M.wood, 0.1) }]} />
    <OG sh={[{ d: ell([x + 11, y - 5], 8, 11), f: M.woodL }]} />
    <path d={`M${x + 20} ${y - 2}H${x + w - 14}`} stroke={shade(M.bark, 0.3)} stroke-width={1.5} />
  </g>
);
S['sf-gz-sal-yasak-akinti'] = () => (
  <Scene2 bg="outdoor" gy={120}>
    {/* sol: köpüklü akıntı */}
    <rect x={0} y={120} width={160} height={120} fill="#4f8fbf" />
    {[[20, 140], [70, 160], [30, 196], [110, 186], [90, 140], [130, 220], [50, 226]].map(([x, y], i) => (
      <path key={i} d={`M${x} ${y}q8 -8 16 0q8 -8 16 0`} stroke="#fff" stroke-width={3} fill="none" stroke-linecap="round" />
    ))}
    <g transform="rotate(-14 80 172)"><RaftSide x={30} y={178} w={100} /></g>
    <Arrow from={[24, 212]} to={[136, 212]} w={5} color="#fff" />
    <No x={80} y={168} r={52} />
    {/* sağ: durgun sığ göl kıyısı */}
    <rect x={160} y={120} width={160} height={120} fill={K.grass} />
    <path d="M160 160Q220 150 320 158V240H160Z" fill={K.waterLight} />
    <path d="M160 178Q230 168 320 176V240H160Z" fill={K.water} opacity={0.6} />
    <RaftSide x={196} y={188} w={100} />
    <Ok x={296} y={136} r={14} />
    <rect x={158.5} y={0} width={3} height={240} fill={K.out} opacity={0.5} />
  </Scene2>
);
S['sf-gz-sal-capraz-sirik'] = () => {
  const xs = [52, 88, 124, 160, 196, 232, 268];
  return (
    <Scene2 bg="closeup">
      <rect x={0} y={150} width={320} height={90} fill={K.waterLight} opacity={0.6} />
      {xs.map((x) => <OG key={x} sh={[{ d: circ([x, 136], 18), f: M.woodL }, { d: circ([x, 136], 9), st: shade(M.woodL, 0.3), sw: 1.2 }]} />)}
      <OG sh={[{ d: capsule([22, 112], 6, [298, 112], 6), f: M.bark }, { d: capsule([22, 160], 6, [298, 160], 6), f: M.bark }]} />
      {[22, 298].map((x) => (
        <g key={x}>
          {[-6, 0, 6].map((d) => <Line key={d} d={`M${x + d} 104V168`} c={M.rope} w={3} />)}
        </g>
      ))}
      <Arrow from={[160, 60]} to={[160, 96]} w={5} />
      <Arrow from={[160, 214]} to={[160, 178]} w={5} />
    </Scene2>
  );
};
S['sf-gz-sal-oturma'] = () => {
  const wy = 178;
  const p: PersonProps = {
    ...(cast('raft') as PersonProps), x: 156, y: wy - 22,
    pose: { ...POSE.sitFloor, spine: -82, head: -86, legB: [-22, 58], legF: [-32, 52], armF: { to: [196, 112] }, armB: { to: [190, 128] }, face: 'neutral' },
  };
  return (
    <Scene2 bg="outdoor" gy={150}>
      <Water x={0} y={150} w={320} h={90} />
      <path d="M0 214Q160 204 320 214V240H0Z" fill="#c9b48a" opacity={0.6} />
      <RaftSide x={60} y={wy} w={190} />
      <OG sh={[{ d: rrect(96, wy - 40, 40, 20, 6), f: '#7a8a5a' }]} />
      <Person {...p} mid={(r) => Vest(r)} over={() => <St a={[204, 64]} b={[236, 222]} r={2.8} c={M.wood} />} />
      <rect x={0} y={wy - 6} width={320} height={4} fill={K.waterLight} opacity={0.7} />
      {/* ayakta duran: yasak */}
      <circle cx={276} cy={58} r={38} fill={K.white} stroke={K.out} stroke-width={1.5} />
      <Person {...(cast('raft') as PersonProps)} x={276} y={86} s={0.32} pose={{ ...POSE.stand, face: 'neutral' }} mid={(r) => Vest(r)} shadow={false} />
      <rect x={256} y={86} width={40} height={6} rx={2} fill={M.bark} stroke={K.out} stroke-width={1} />
      <No x={276} y={58} r={38} />
    </Scene2>
  );
};

/* ───── Kürek ───── */
S['sf-gz-kurek-olcu'] = () => {
  const p: PersonProps = { ...(cast('raft') as PersonProps), x: 130, y: 226, s: 1.12, pose: { ...POSE.stand, armF: { to: [188, 104] }, face: 'neutral' } };
  const r = rig(p);
  const chin = r.mouth[1] + 6;
  return (
    <Scene2 bg="outdoor" ground="grass">
      <OG sh={[{ d: capsule([196, chin], 4, [196, 170], 4), f: M.woodL }, { d: rrect(184, chin - 6, 24, 8, 3), f: M.woodL }, { d: `M186 160Q196 152 206 160L204 222Q196 228 188 222Z`, f: M.wood }]} />
      <Person {...p} />
      <path d={`M${r.mouth[0] + 10} ${chin}H260`} stroke={K.action} stroke-width={2.4} stroke-dasharray="6 5" />
      <path d={`M250 ${chin}V224`} stroke={K.action} stroke-width={2.4} />
      <Label x={274} y={(chin + 224) / 2} text="1,3–1,5 m" size={13} />
    </Scene2>
  );
};
S['sf-gz-kurek-cizim'] = () => (
  <Scene2 bg="closeup">
    <OG sh={[{ d: rrect(10, 70, 300, 100, 4), f: M.woodL }]} />
    {[86, 102, 138, 154].map((yy) => <path key={yy} d={`M18 ${yy}Q160 ${yy + 3} 302 ${yy - 1}`} stroke={shade(M.woodL, 0.15)} stroke-width={1.2} fill="none" />)}
    <path d="M28 98H44V114H52V126H44V142H28ZM52 114H176C196 114 204 94 226 94H290Q300 94 300 104V136Q300 146 290 146H226C204 146 196 126 176 126H52" fill="none" stroke={K.ink} stroke-width={3.2} stroke-linejoin="round" />
    <path d="M308 94V146" stroke={K.action} stroke-width={2.6} />
    <path d="M220 182H300M220 176V188M300 176V188" stroke={K.action} stroke-width={2.6} />
    <text x={260} y={206} font-size={15} font-weight={700} fill={K.ink} text-anchor="middle">50–60 cm</text>
    <text x={300} y={60} font-size={15} font-weight={700} fill={K.ink} text-anchor="end">15 cm</text>
  </Scene2>
);
S['sf-gz-kurek-kesit'] = () => (
  <Scene2 bg="closeup">
    {/* pala kesiti: ortada kalın, kenarda ince */}
    <OG sh={[{ d: 'M30 70C80 52 240 52 290 70C240 88 80 88 30 70Z', f: M.woodL }]} />
    <path d="M160 52V88" stroke={K.action} stroke-width={2.4} />
    <text x={160} y={42} font-size={14} font-weight={700} fill={K.ink} text-anchor="middle">1,5–2 cm</text>
    <path d="M52 64V76" stroke={K.action} stroke-width={2.4} />
    <path d="M52 78L58 92" stroke={K.ink} stroke-width={1.2} />
    <text x={40} y={106} font-size={14} font-weight={700} fill={K.ink} text-anchor="start">6–8 mm</text>
    {/* sap–pala geçişi: yumuşak (doğru) ve ani (yanlış) */}
    <rect x={158.5} y={120} width={3} height={110} rx={1.5} fill={K.out} opacity={0.35} />
    <OG sh={[{ d: 'M14 168H70C96 168 106 148 130 148H150V196H130C106 196 96 176 70 176H14Z', f: M.woodL }]} />
    <OG sh={[{ d: 'M172 168H244V148H306V196H244V176H172Z', f: M.woodL }]} />
    <path d="M244 176l6 -8" stroke={K.danger} stroke-width={2.4} />
    <Ok x={80} y={216} r={13} />
    <Bad x={240} y={216} r={13} />
  </Scene2>
);

/* ───── Bisiklet ───── */
S['sf-gz-bisiklet-sokme'] = () => {
  const c: P = [160, 268];
  const arcD = (r: number, a0: number, a1: number) => `M${pol(c, a0, r)[0]} ${pol(c, a0, r)[1]}A${r} ${r} 0 0 1 ${pol(c, a1, r)[0]} ${pol(c, a1, r)[1]}`;
  return (
    <Scene2 bg="closeup">
      {/* teker: lastik (siyah), jant (gri), teller */}
      {[-150, -130, -110, -90, -70, -50, -30].map((a) => <path key={a} d={`M${c[0]} ${c[1]}L${pol(c, a, 150)[0]} ${pol(c, a, 150)[1]}`} stroke={M.ironL} stroke-width={1.6} />)}
      <path d={arcD(178, 195, 345)} fill="none" stroke={K.out} stroke-width={34} />
      <path d={arcD(178, 195, 345)} fill="none" stroke={M.rubber} stroke-width={30} />
      <path d={arcD(156, 195, 345)} fill="none" stroke={K.out} stroke-width={18} />
      <path d={arcD(156, 195, 345)} fill="none" stroke={M.steel} stroke-width={14} />
      {/* iki sökücü arasında jantın dışına çıkarılmış lastik kenarı */}
      <path d={arcD(150, 245, 295)} fill="none" stroke={K.out} stroke-width={12} />
      <path d={arcD(150, 245, 295)} fill="none" stroke={shade(M.rubber, -0.3)} stroke-width={8} />
      {[245, 295].map((a) => <OG key={a} sh={[{ d: capsule(pol(c, a, 160), 6, pol(c, a + (a < 270 ? -12 : 12), 70), 8), f: '#2f6fd6' }]} />)}
      <Arrow from={pol(c, 270, 116)} to={pol(c, 270, 142)} w={5} />
      {/* tornavida: yasak */}
      <circle cx={268} cy={56} r={38} fill={K.white} stroke={K.out} stroke-width={1.5} />
      <OG sh={[{ d: capsule([238, 76], 7, [264, 58], 7), f: '#e0b23a' }, { d: capsule([264, 58], 2.5, [296, 36], 2), f: M.steel }]} />
      <No x={268} y={56} r={38} />
    </Scene2>
  );
};
S['sf-gz-bisiklet-delik-bulma'] = () => (
  <Scene2 bg="closeup">
    <OG sh={[{ d: 'M24 120H296L280 220Q278 228 270 228H50Q42 228 40 220Z', f: '#8e99a6' }]} />
    <path d="M30 132H290L278 218H42Z" fill={K.water} opacity={0.85} />
    {/* iç lastik halkası */}
    <ellipse cx={160} cy={120} rx={108} ry={52} fill="none" stroke={K.out} stroke-width={17} />
    <ellipse cx={160} cy={120} rx={108} ry={52} fill="none" stroke={M.rubber} stroke-width={13} />
    <path d="M24 120H296" stroke={K.waterLight} stroke-width={3} opacity={0.9} />
    <rect x={30} y={134} width={260} height={84} fill={K.water} opacity={0.35} />
    {[[200, 120, 5], [204, 104, 4], [198, 92, 3.5], [206, 80, 3]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y + 50} r={r} fill="#fff" stroke={K.out} stroke-width={1} />)}
    <Hand {...wristFor([214, 168], -140, 0.85, 'point', 'L')} a={-140} s={0.85} pose="point" side="L" arm={140} {...HANDS('bike')} />
  </Scene2>
);
S['sf-gz-bisiklet-yama'] = () => {
  const panel = (cx: number, k: 0 | 1 | 2) => (
    <g>
      <OG sh={[{ d: rrect(cx - 46, 70, 92, 100, 18), f: M.rubber }]} />
      {k === 0 && <rect x={cx - 26} y={98} width={52} height={44} rx={8} fill="#6a6e76" />}
      {k === 0 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${cx - 22 + i * 12} 102l8 34`} stroke="#8a8e96" stroke-width={1.4} />)}
      {k === 1 && <rect x={cx - 26} y={98} width={52} height={44} rx={8} fill="#7b7f88" stroke="#c9ced6" stroke-width={2} />}
      {k === 2 && <OG sh={[{ d: rrect(cx - 24, 100, 48, 40, 8), f: '#d9732e' }]} />}
      <circle cx={cx} cy={120} r={3} fill="#fff" stroke={K.out} stroke-width={1} />
    </g>
  );
  return (
    <Scene2 bg="closeup">
      <Divider x={108} />
      <Divider x={212} />
      {panel(54, 0)}
      {panel(160, 1)}
      {panel(266, 2)}
      <Hand {...wristFor([266, 128], 0, 0.62, 'press', 'R')} a={0} s={0.62} pose="press" side="R" arm={60} {...HANDS('bike')} />
      <text x={54} y={60} font-size={20} font-weight={700} fill={K.ink} text-anchor="middle">1</text>
      <text x={160} y={60} font-size={20} font-weight={700} fill={K.ink} text-anchor="middle">2</text>
      <text x={266} y={60} font-size={20} font-weight={700} fill={K.ink} text-anchor="middle">3</text>
    </Scene2>
  );
};

const Bike = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => {
  const P_ = (px: number, py: number): P => [x + px * s, y + py * s];
  const wr = 46 * s;
  const rw = P_(-80, -46), fw = P_(80, -46), bb = P_(-6, -46), seat = P_(-26, -112), head = P_(58, -110);
  const tube = (a: P, b: P, c = '#d0473d') => ({ d: capsule(a, 3.2 * s, b, 3.2 * s), f: c });
  return (
    <g>
      {[rw, fw].map((w, i) => (
        <g key={i}>
          <circle cx={w[0]} cy={w[1]} r={wr} fill="none" stroke={K.out} stroke-width={11 * s} />
          <circle cx={w[0]} cy={w[1]} r={wr} fill="none" stroke={M.rubber} stroke-width={8 * s} />
          <circle cx={w[0]} cy={w[1]} r={wr - 6 * s} fill="none" stroke={M.steel} stroke-width={2.5 * s} />
          {[0, 30, 60, 90, 120, 150].map((a) => <path key={a} d={`M${pol(w, a, wr - 6 * s)[0]} ${pol(w, a, wr - 6 * s)[1]}L${pol(w, a + 180, wr - 6 * s)[0]} ${pol(w, a + 180, wr - 6 * s)[1]}`} stroke={M.steel} stroke-width={1} />)}
          <circle cx={w[0]} cy={w[1]} r={4 * s} fill={M.ironL} stroke={K.out} stroke-width={1.2} />
        </g>
      ))}
      <OG sh={[tube(rw, bb), tube(rw, seat), tube(bb, seat), tube(seat, P_(54, -96)), tube(bb, P_(54, -96)), tube(head, fw), tube(P_(-30, -120), seat)]} />
      <OG sh={[{ d: capsule(P_(-44, -124), 5 * s, P_(-14, -124), 4 * s), f: '#2b2d3a' }, { d: capsule(head, 2.6 * s, P_(54, -124), 2.6 * s), f: M.ironL }, { d: capsule(P_(42, -126), 3 * s, P_(70, -126), 3 * s), f: '#2b2d3a' }]} />
      <OG sh={[{ d: circ(bb, 9 * s), f: M.ironL }, { d: capsule(bb, 2.4 * s, P_(10, -26), 2.4 * s), f: M.iron }]} />
    </g>
  );
};
S['sf-gz-bisiklet-kontrol'] = () => {
  const x = 160, y = 214;
  const pts: [number, number, number][] = [[x - 80, y - 92, 14], [x + 80, y - 92, 14], [x - 80, y - 46, 12], [x + 80, y - 46, 12], [x - 29, y - 124, 14], [x + 56, y - 126, 16]];
  return (
    <Scene2 bg="outdoor" ground="pavement">
      <Bike x={x} y={y} />
      {pts.map(([px, py, r], i) => <circle key={i} cx={px} cy={py} r={r} fill="none" stroke={K.action} stroke-width={3.4} />)}
    </Scene2>
  );
};
S['sf-gz-bisiklet-zincir-yag'] = () => {
  const cr: P = [196, 120];
  return (
    <Scene2 bg="closeup">
      {/* zincir: üst ve alt kol, arkaya (sola) uzanıyor */}
      <path d={`M${cr[0]} ${cr[1] - 54}H10M${cr[0]} ${cr[1] + 54}H10`} stroke={K.out} stroke-width={11} />
      <path d={`M${cr[0]} ${cr[1] - 54}H10M${cr[0]} ${cr[1] + 54}H10`} stroke="#7b828d" stroke-width={7} stroke-dasharray="7 3" />
      <OG sh={[{ d: circ(cr, 54), f: '#9aa3ad' }, { d: circ(cr, 30), f: K.closeup }, { d: circ(cr, 12), f: M.ironL }]} />
      <OG sh={[{ d: capsule(cr, 6, [262, 196], 6), f: M.iron }, { d: rrect(244, 192, 50, 14, 3), f: '#2b2d3a' }]} />
      {/* yağ kabı, damla alt kolun iç yüzüne */}
      <OG sh={[{ d: `M84 120L110 120L104 70H90Z`, f: '#e0b23a' }, { d: capsule([97, 120], 2, [97, 140], 1.4), f: '#e0b23a' }]} />
      <path d="M97 150c-3 5-4 7-4 9a4 4 0 0 0 8 0c0-2-1-4-4-9z" fill="#c99a2e" stroke={K.out} stroke-width={1.2} />
      <Hand x={70} y={46} a={164} s={0.75} pose="fist" side="L" arm={60} {...HANDS('bike')} />
      <Arrow from={[268, 64]} to={[234, 36]} bend={0.3} w={5} />
      <Cloth x={60} y={212} w={60} h={24} color="#e7e2d6" />
    </Scene2>
  );
};
S['sf-gz-bisiklet-fren-pabuc'] = () => {
  const one = (cx: number, good: boolean) => (
    <g>
      {/* yakın plan, yandan: lastik üstte, jant yan yüzü altta */}
      <OG sh={[{ d: rrect(cx - 70, 60, 140, 44, 20), f: M.rubber }]} />
      <OG sh={[{ d: rrect(cx - 70, 104, 140, 36, 3), f: M.steel }, { d: rrect(cx - 70, 104, 140, 6, 2), f: tint(M.steel, 0.3) }]} />
      <OG sh={[{ d: rrect(cx - 70, 140, 140, 10, 2), f: shade(M.steel, 0.2) }]} />
      <OG sh={[{ d: rrect(cx - 30, good ? 108 : 70, 60, 26, 5), f: '#3a3d44' }, { d: capsule([cx, good ? 134 : 96], 4, [cx, 196], 4), f: M.ironL }]} />
      {good ? <Ok x={cx} y={214} r={14} /> : <Bad x={cx} y={214} r={14} />}
    </g>
  );
  return (
    <Scene2 bg="closeup">
      <Divider />
      {one(80, true)}
      {one(240, false)}
    </Scene2>
  );
};
