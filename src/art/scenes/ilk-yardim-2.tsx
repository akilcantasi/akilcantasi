// İlk yardım sahneleri (2. yarı): bebek KPR ve boğulma, suda boğulma, elektrik, şok, bayılma,
// kalp krizi, inme, astım, anafilaksi, şeker düşmesi.
import type { ComponentChildren, JSX } from 'preact';
import type { ArtFn } from '../registry';
import {
  Arrow, Bad, Blanket, Blood, Cloth, Chair, Drop, Hand, K, Label, No, OG, Ok, Person, Phone, POSE, Scene2, Shake, Table, Timer, Tree,
  Wall, Water, Waves, Window, Bubble, capsule, circ, ell, rrect, shade, smooth, tint, rig, handPoint,
} from '../kit2';
import type { P, PersonProps, Pose, Rig, Sh } from '../kit2';

/* ═══════════════ yardımcılar ═══════════════ */

const R = Math.PI / 180;
const pol = (p: P, a: number, l: number): P => [p[0] + Math.cos(a * R) * l, p[1] + Math.sin(a * R) * l];
const mid = (a: P, b: P, t = 0.5): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const ang = (a: P, b: P) => Math.atan2(b[1] - a[1], b[0] - a[0]) / R;
const add = (a: P, d: P): P => [a[0] + d[0], a[1] + d[1]];
const HS = K.skin[2];

let uid = 0;
/** Ek küçük çizim çerçevesi (sahne koordinatında içerik, kırpılır) */
function Inset({ x, y, w, h, bg = '#f6f2ea', children }: { x: number; y: number; w: number; h: number; bg?: string; children?: ComponentChildren }) {
  const id = 'iy2c' + ++uid;
  return (
    <g>
      <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={11} fill="#fff" stroke={K.out} stroke-width={1.6} />
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={9} />
      </clipPath>
      <g clip-path={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={bg} />
        {children}
      </g>
    </g>
  );
}

/** Profilden el (yakın plan): bilek w; hand = elin uzandığı yön; fa = bilekten dirseğe yön;
 *  lift = parmakların avuçtan kalkma açısı; palm: avuç hangi yanda (1 = elin sağ yanı / yön +90). */
function SideHand({ w, hand, fa, lift = 0, s = 1, skin = 2, sleeve, arm = 200, palm = 1, thumb = true }: { w: P; hand: number; fa: number; lift?: number; s?: number; skin?: number; sleeve?: string; arm?: number; palm?: 1 | -1; thumb?: boolean }) {
  const sk = K.skin[skin];
  const L = (lx: number, ly: number): P => {
    const c = Math.cos(hand * R), sn = Math.sin(hand * R);
    const y = ly * palm;
    return [w[0] + (lx * c - y * sn) * s, w[1] + (lx * sn + y * c) * s];
  };
  const tipA = hand - lift * palm;
  const kn = L(25, -1);
  const tip = pol(kn, tipA, 30 * s);
  const elbow = pol(w, fa, arm * s);
  const sh: Sh[] = [
    { d: capsule(elbow, 10 * s, w, 8 * s), f: sk },
    { d: capsule(L(2, 1), 8.5 * s, L(24, 0), 7 * s), f: sk },
    { d: circ(L(5, 5), 6 * s), f: sk },
    { d: capsule(kn, 6.2 * s, tip, 4.6 * s), f: sk },
  ];
  if (sleeve) sh.push({ d: capsule(pol(w, fa, 30 * s), 12 * s, pol(w, fa, arm * s + 20), 13 * s), f: sleeve });
  if (thumb) sh.push({ d: capsule(L(6, -4), 4.6 * s, L(22, -8), 3.8 * s), f: shade(sk, 0.08) });
  return (
    <g>
      <OG sh={sh} ow={1.5} />
      <path d={`M${pol(kn, tipA, 10 * s).join(' ')}L${pol(kn, tipA, 27 * s).join(' ')}`} stroke={shade(sk, 0.3)} stroke-width={1} />
    </g>
  );
}

/** Ayrıntılı elin yerel noktasını sahneye çevirir (Hand ile aynı dönüşüm) */
function hpt(h: { x: number; y: number; a?: number; s?: number; side?: 'L' | 'R'; view?: 'back' | 'palm' }, l: P): P {
  const m = (h.side === 'L') !== (h.view === 'palm') ? -1 : 1;
  const s = h.s ?? 1, a = (h.a ?? 0) * R;
  const x = l[0] * m * s, y = l[1] * s;
  return [h.x + x * Math.cos(a) - y * Math.sin(a), h.y + x * Math.sin(a) + y * Math.cos(a)];
}

/** Yandan, avucu aşağı bakan el (yakın plan). H = elin topuğunun değdiği nokta; dir = parmakların yönü;
 *  lift = parmakların yüzeyden kalkma açısı (+ = yukarı); fa = bilekten dirseğe yön. */
function ProfileHand({ H, dir, lift = 0, fa, s = 1, skin = 2, sleeve = K.role.helper, arm = 220 }: { H: P; dir: number; lift?: number; fa: number; s?: number; skin?: number; sleeve?: string; arm?: number }) {
  const sk = K.skin[skin];
  // "yukarı" = parmak yönünün avuç tersi yanı (dir 180 iken -90)
  const upA = dir + (Math.cos(dir * R) < 0 ? 90 : -90);
  const liftA = (Math.cos(dir * R) < 0 ? 1 : -1) * lift; // sola bakan elde açı artınca yukarı
  const Hc = pol(H, upA, 7 * s);
  const W = pol(pol(H, upA, 13 * s), dir + 180, 4 * s);
  const pd = dir + liftA * 0.35;
  const Kn = pol(Hc, pd, 20 * s);
  const fd = dir + liftA;
  const tip = pol(Kn, fd, 23 * s);
  const el = pol(W, fa, arm * s);
  const sh: Sh[] = [
    { d: capsule(el, 10 * s, W, 7.6 * s), f: sk },
    { d: capsule(W, 7.8 * s, Hc, 7.4 * s), f: sk },
    { d: capsule(Hc, 7.4 * s, Kn, 6.6 * s), f: sk },
    { d: capsule(Kn, 6 * s, tip, 4.4 * s), f: sk },
    { d: capsule(pol(pol(Hc, pd, 3 * s), upA + 180, 1.5 * s), 4 * s, pol(pol(Hc, pd, 15 * s), upA + 180, 2.5 * s), 3.3 * s), f: shade(sk, 0.1) },
    { d: capsule(pol(W, fa, 34 * s), 11.5 * s, pol(W, fa, arm * s + 24), 13 * s), f: sleeve },
  ];
  return (
    <g>
      <OG sh={sh} />
      <path d={`M${pol(pol(Kn, upA, 2 * s), fd, 4 * s).join(' ')}L${pol(pol(Kn, upA, 1.4 * s), fd, 19 * s).join(' ')}`} stroke={shade(sk, 0.3)} stroke-width={1} fill="none" />
    </g>
  );
}

/** Yüzü soluklaştıran gri örtü */
const Pale = ({ r, op = 0.32 }: { r: Rig; op?: number }) => <ellipse cx={r.head[0]} cy={r.head[1] + r.headR * 0.12} rx={r.headR * 0.9} ry={r.headR * 0.88} fill="#a9b4ba" opacity={op} />;

/** Alında ter damlaları */
const Sweat = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g>
    <Drop x={x - 10 * s} y={y - 2 * s} s={0.5 * s} color={K.waterLight} />
    <Drop x={x + 9 * s} y={y - 4 * s} s={0.46 * s} color={K.waterLight} />
    <Drop x={x + 1 * s} y={y - 6 * s} s={0.4 * s} color={K.waterLight} />
  </g>
);

/** Şimşek simgesi (sarı) */
const Bolt = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M3 -14L-8 2H-1L-4 14L8 -3H1Z" fill="#ffd23f" stroke={K.out} stroke-width={1.4 / s} stroke-linejoin="round" />
);

/** Kıvılcım */
const Spark = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke-linecap="round">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
      <path key={a} d={`M${Math.cos(a * R) * 5} ${Math.sin(a * R) * 5}L${Math.cos(a * R) * (i % 2 ? 11 : 16)} ${Math.sin(a * R) * (i % 2 ? 11 : 16)}`} stroke="#ffb300" stroke-width={3} />
    ))}
    <circle r={5} fill="#fff3a0" stroke="#ffb300" stroke-width={2} />
  </g>
);

/** Duvar saati (merkez) */
function Clock({ x, y, r = 40, h = 10, m = 10 }: { x: number; y: number; r?: number; h?: number; m?: number }) {
  const ha = (h % 12) * 30 + m * 0.5 - 90, ma = m * 6 - 90;
  return (
    <g>
      <OG sh={[{ d: circ([x, y], r), f: '#f4f1ea' }, { d: circ([x, y], r * 0.84), f: '#fff', ln: true }]} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30 * R;
        return <path key={i} d={`M${x + Math.cos(a) * r * 0.72} ${y + Math.sin(a) * r * 0.72}L${x + Math.cos(a) * r * 0.8} ${y + Math.sin(a) * r * 0.8}`} stroke={K.ink} stroke-width={i % 3 ? 1.4 : 2.6} stroke-linecap="round" />;
      })}
      <path d={`M${x} ${y}L${pol([x, y], ha, r * 0.42).join(' ')}`} stroke={K.ink} stroke-width={r * 0.08} stroke-linecap="round" />
      <path d={`M${x} ${y}L${pol([x, y], ma, r * 0.64).join(' ')}`} stroke={K.ink} stroke-width={r * 0.05} stroke-linecap="round" />
      <circle cx={x} cy={y} r={r * 0.07} fill={K.action} stroke={K.out} />
    </g>
  );
}

/** Bardak (taban ortası). fill 0..1 */
function Glass({ x, y, s = 1, fill = 0.75, color = '#ffa726', a = 0 }: { x: number; y: number; s?: number; fill?: number; color?: string; a?: number }) {
  const h = 40, top = -h, wl = -h * fill;
  const half = (yy: number) => 11 + ((yy - 0) / top) * 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: `M${-half(top)} ${top}L${-half(0)} 0H${half(0)}L${half(top)} ${top}Z`, f: '#e8f4fa' },
          { d: `M${-half(wl)} ${wl}L${-half(0)} 0H${half(0)}L${half(wl)} ${wl}Z`, f: color, no: true },
          { d: `M${-half(wl)} ${wl}H${half(wl)}`, st: shade(color, 0.2), sw: 1.4 },
          { d: `M${-8} ${top + 5}L${-7} -6`, st: '#fff', sw: 2.2 },
        ]}
      />
    </g>
  );
}

/** Küp şeker (taban ortası) */
const Cube = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <OG sh={[{ d: `M${x - 6 * s} ${y}V${y - 10 * s}L${x - 2 * s} ${y - 13 * s}H${x + 9 * s}V${y - 3 * s}L${x + 5 * s} ${y}Z`, f: '#fff' }, { d: `M${x - 6 * s} ${y - 10 * s}H${x + 5 * s}V${y}M${x + 5 * s} ${y - 10 * s}L${x + 9 * s} ${y - 13 * s}`, st: '#c9c4bb', sw: 1 }]} />
);

/** Glikoz tableti paketi (taban ortası) */
const Tabs = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g>
    <OG sh={[{ d: rrect(x - 16 * s, y - 13 * s, 32 * s, 13 * s, 3 * s), f: '#e04f7a' }, { d: rrect(x - 13 * s, y - 10 * s, 26 * s, 7 * s, 2 * s), f: '#fff', ln: true }]} />
    {[-8, 0, 8].map((d) => <circle key={d} cx={x + d * s} cy={y - 6.5 * s} r={2.6 * s} fill="#f7d7e2" stroke={K.out} stroke-width={0.8} />)}
  </g>
);

/** Mavi rahatlatıcı inhaler. (x,y) = ağızlığın ucu; ağızlık sola bakar */
function Inhaler({ x, y, s = 1, color = '#2f7fd8' }: { x: number; y: number; s?: number; color?: string }) {
  const X = (v: number) => x + v * s, Y = (v: number) => y + v * s;
  return (
    <OG
      sh={[
        { d: rrect(X(18), Y(-74), 17, 34, 4 * s), f: '#c9d3dc' },
        { d: rrect(X(14), Y(-48), 25, 60, 6 * s), f: color },
        { d: rrect(X(0), Y(-9), 22, 20, 4 * s), f: shade(color, 0.12) },
        { d: rrect(X(-1), Y(-7), 4, 16, 1.5 * s), f: shade(color, 0.35), no: true },
        { d: `M${X(19)} ${Y(-40)}V${Y(4)}`, st: tint(color, 0.45), sw: 2.4 * s },
      ]}
    />
  );
}

/** Adrenalin oto-enjektörü (dikey): (x,y) = turuncu iğne ucu (alt); cap: mavi güvenlik kapağı takılı mı */
function AutoInj({ x, y, s = 1, a = 0, cap = true, capOff = 0 }: { x: number; y: number; s?: number; a?: number; cap?: boolean; capOff?: number }) {
  const t = `translate(${x} ${y}) rotate(${a}) scale(${s})`;
  return (
    <g transform={t}>
      <OG
        ow={1.5 / s}
        sh={[
          { d: rrect(-10, -112, 20, 100, 6), f: '#eceff2' },
          { d: rrect(-10, -86, 20, 40, 2), f: '#f6d34a', no: true },
          { d: rrect(-9, -14, 18, 14, 5), f: K.action },
          ...(cap ? [{ d: rrect(-8, -128 - capOff, 16, 18, 4), f: '#2f6fd6' }] : []),
        ]}
      />
      <path d="M-10 -86H10M-10 -46H10" stroke={K.out} stroke-width={1.2 / s} />
    </g>
  );
}

/** Uzun dal */
const Branch = ({ a, b }: { a: P; b: P }) => {
  const m = mid(a, b, 0.45), n = mid(a, b, 0.7);
  const t1 = pol(m, ang(a, b) - 35, 18), t2 = pol(n, ang(a, b) + 30, 14);
  return (
    <g stroke-linecap="round">
      <path d={`M${a.join(' ')}L${b.join(' ')}M${m.join(' ')}L${t1.join(' ')}M${n.join(' ')}L${t2.join(' ')}`} stroke={K.out} stroke-width={8.5} />
      <path d={`M${a.join(' ')}L${b.join(' ')}M${m.join(' ')}L${t1.join(' ')}M${n.join(' ')}L${t2.join(' ')}`} stroke="#9a6a42" stroke-width={5.5} />
      <ellipse cx={t1[0]} cy={t1[1]} rx={5} ry={3} fill={K.leaf} stroke={K.out} stroke-width={1.2} transform={`rotate(${ang(a, b) - 35} ${t1[0]} ${t1[1]})`} />
    </g>
  );
};

/** Can simidi (merkez) */
const Buoy = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r * 0.72} fill="none" stroke={K.out} stroke-width={r * 0.56 + 3} />
    <circle cx={x} cy={y} r={r * 0.72} fill="none" stroke="#fff" stroke-width={r * 0.56} />
    <circle cx={x} cy={y} r={r * 0.72} fill="none" stroke={K.danger} stroke-width={r * 0.56} stroke-dasharray={`${r * 0.565} ${r * 0.565}`} />
  </g>
);

/** Ağrı bölgesi (yarı saydam kırmızı) */
const Pain = ({ x, y, rx, ry = rx, a = 0 }: { x: number; y: number; rx: number; ry?: number; a?: number }) => (
  <g transform={`rotate(${a} ${x} ${y})`}>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={K.danger} opacity={0.32} />
    <ellipse cx={x} cy={y} rx={rx * 0.55} ry={ry * 0.55} fill={K.danger} opacity={0.35} />
  </g>
);

/** Kurdeşen kabarıkları */
const Hives = ({ pts, s = 1 }: { pts: P[]; s?: number }) => (
  <g>
    {pts.map((p, i) => (
      <ellipse key={i} cx={p[0]} cy={p[1]} rx={(i % 3 === 0 ? 4.6 : 3.4) * s} ry={(i % 3 === 0 ? 3.4 : 2.6) * s} fill="#ef6f6c" stroke="#c43d3d" stroke-width={0.9} opacity={0.9} />
    ))}
  </g>
);

/** Turuncu vurgu halkası */
const Ring = ({ x, y, rx, ry = rx, dash }: { x: number; y: number; rx: number; ry?: number; dash?: boolean }) => (
  <g fill="none">
    <ellipse cx={x} cy={y} rx={rx} ry={ry} stroke="#fff" stroke-width={6} opacity={0.8} />
    <ellipse cx={x} cy={y} rx={rx} ry={ry} stroke={K.action} stroke-width={3.4} stroke-dasharray={dash ? '7 5' : undefined} />
  </g>
);

/** Kalp atışı çizgisi */
const Ecg = ({ x, y, w = 50, color = K.danger }: { x: number; y: number; w?: number; color?: string }) => {
  const k = w / 50;
  const d = `M${x} ${y}h${6 * k}l${3 * k} ${-10 * k}l${4 * k} ${20 * k}l${3 * k} ${-14 * k}l${2 * k} ${4 * k}h${4 * k}l${3 * k} ${-10 * k}l${4 * k} ${20 * k}l${3 * k} ${-14 * k}l${2 * k} ${4 * k}h${6 * k}`;
  return (
    <g fill="none" stroke-linejoin="round" stroke-linecap="round">
      <path d={d} stroke="#fff" stroke-width={5} />
      <path d={d} stroke={color} stroke-width={2.6} />
    </g>
  );
};

/* ═══════════════ oyuncular (rehber başına sabit) ═══════════════ */

type Cast = { victim: Partial<PersonProps>; helper: Partial<PersonProps> };
/** bebekte boğulma */
const BBG: Cast = {
  victim: { who: 'baby' },
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2, bottomC: '#4a4f6a' },
};

/** suda boğulma */
const SUD: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.black },
  helper: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.dark, bottomC: '#3b4a5e' },
};
/** elektrik çarpması */
const ELK: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark },
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2, shoes: '#2b2b2b' },
};
/** şok */
const SOK: Cast = {
  victim: { who: 'man', role: 'victim', skin: 0, hairC: K.hair.brown },
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.black, skin: 2 },
};
/** anafilaksi */
const ANA: Cast = {
  victim: { who: 'woman', role: 'victim', hair: 'ponytail', hairC: K.hair.brown, skin: 0, bottomC: K.pants.khaki },
  helper: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black },
};
/** astım */
const AST: Cast = {
  victim: { who: 'woman', role: 'victim', hair: 'ponytail', hairC: K.hair.dark, skin: 1 },
  helper: { who: 'man', role: 'helper', skin: 3, hairC: K.hair.black },
};
/** kalp krizi */
const KK: Cast = {
  victim: { who: 'oldman', role: 'victim', skin: 1 },
  helper: { who: 'woman', role: 'helper', hair: 'scarf', hairC: '#3f8f86', skin: 1 },
};
/** inme */
const INM: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.grey },
  helper: { who: 'woman', role: 'helper', hair: 'long', hairC: K.hair.black, skin: 2 },
};
/** şeker düşmesi */
const HIP: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hairC: K.hair.dark },
  helper: { who: 'woman', role: 'helper', hair: 'bun', hairC: K.hair.dark, skin: 2 },
};
/** bayılma */
const BAY: Cast = {
  victim: { who: 'woman', role: 'victim', hair: 'long', hairC: K.hair.auburn, skin: 0 },
  helper: { who: 'man', role: 'helper', skin: 2, hairC: K.hair.black },
};

/* ═══════════════ oyunculu genel sahneler (rehber başına kimlikle) ═══════════════ */

/** Yetişkin kalp masajı (yandan): yardımcı göğüs hizasında diz çökmüş, kollar kilitli, omuzlar ellerin üstünde. */
function kprScene(c: Cast) {
  const victim: PersonProps = { ...c.victim, x: 172, y: 230, s: 1.5, pose: POSE.lieBack } as PersonProps;
  const v = rig(victim);
  const ch: P = [v.chest[0], v.chest[1]];
  const resc: PersonProps = {
    ...c.helper, x: ch[0], ax: 'wristF', y: 226, s: 1.5, flip: true,
    pose: { spine: -60, chest: -58, head: -40, legB: [92, 182], legF: [86, 180], armB: [90, 90], armF: [90, 90], handB: { shape: 'flat', a: -90 }, handF: { shape: 'flat', a: -86 }, face: 'neutral' },
  } as PersonProps;
  const r = rig(resc);
  return (
    <Scene2 bg="indoor">
      <Person {...resc} />
      <Person {...victim} />
      <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${ch[1] - 4}`} stroke="#fff" stroke-width={3.4} stroke-dasharray="5 5" opacity={0.9} />
      <path d={`M${r.shoulderF[0]} ${r.shoulderF[1] - 30}V${ch[1] - 4}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="5 5" />
      <Arrow from={[ch[0] - 40, 118]} to={[ch[0] - 40, 172]} />
      <Label x={250} y={34} text="100–120/dk" size={15} />
    </Scene2>
  );
}

/** Kurtarıcı nefes (yandan): kişi sırtüstü, baş geride (çene yukarıda); yardımcı başının yanında diz çökmüş,
 *  bir eli alında (burnu sıkıyor), öbür elinin parmakları çenede; ağzı kişinin ağzını kapatmış. Göğüs yükseliyor. */
/** Başın yerel koordinatından (merkez 0,0; yarıçap 12; yüz +x, tepe -y) sahne noktası */
function headPt(r: Rig, lx: number, ly: number): P {
  const k = r.headR / 12;
  const fa = (r.headA + 90) * R, ta = r.headA * R;
  return [r.head[0] + k * (lx * Math.cos(fa) - ly * Math.cos(ta)), r.head[1] + k * (lx * Math.sin(fa) - ly * Math.sin(ta))];
}
/** Hand'i, el üstündeki bir noktası (tip/palm/pinch) hedefe gelecek şekilde yerleştirir */
function placeHand<T extends { x: number; y: number; a: number; s: number; pose: any; side: 'L' | 'R'; view?: 'back' | 'palm' }>(h: T, which: 'tip' | 'palm' | 'pinch', at: P): T {
  const q = handPoint(h, which);
  return { ...h, x: at[0] - (q[0] - h.x), y: at[1] - (q[1] - h.y) };
}
function nefesScene(c: Cast, n = '5') {
  // Yakın plan (yandan, baş-omuz): kişi sırtüstü, başı solda ve geride (çene kalkık). Yardımcı kişinin uzak yanında,
  // gövdesi sağ üstten çerçeve dışına çıkar; başı profilden aşağı bakar, ağzı kişinin ağzını kapatır.
  // Uzak el alında: başparmak ve işaret parmağı burnu sıkar. Yakın elin iki parmağı çene kemiğinin altında.
  const gy = 214;
  const vs = 3.0;
  const victim: PersonProps = { ...c.victim, x: 84, ax: 'head', y: gy + 2, s: vs, shadow: false, pose: { ...POSE.lieBack, head: 166, armB: [-4, -4], armF: [2, 2], face: 'closed' } } as PersonProps;
  const v = rig(victim);
  const nose = headPt(v, 13, 1.5);
  const underChin = headPt(v, 5, 12.5);
  const mouth = headPt(v, 11.6, 6.5);
  const sk = c.helper.skin ?? 1;
  const hs = 0.66;
  let helper: PersonProps = {
    ...c.helper, x: mouth[0] + 1, ax: 'mouth', y: mouth[1] - 1, ay: 'mouth', s: vs * 0.98, flip: true, shadow: false,
    pose: { spine: 84, chest: 64, head: -44, legB: [64, 180], legF: [58, 178], armB: [90, 90], armF: [90, 90], handB: 'none', handF: 'none', face: 'closed', behind: ['armB'] },
  } as PersonProps;
  // kolu IK ile, ayrıntılı elin belirli noktası hedefe gelecek şekilde yerleştir (parmaklar önkolun devamı + aOff)
  type HP = { x: number; y: number; a: number; s: number; pose: 'pinch' | 'press'; side: 'L' | 'R'; view: 'back' };
  const fitArm = (limb: 'armB' | 'armF', target: P, which: 'tip' | 'pinch', pose: 'pinch' | 'press', side: 'L' | 'R', aOff: number, bend: 1 | -1) => {
    let wt: P = target;
    let h: HP = { x: 0, y: 0, a: 0, s: hs, pose, side, view: 'back' };
    for (let i = 0; i < 6; i++) {
      helper = { ...helper, pose: { ...helper.pose, [limb]: { to: wt, bend } } } as PersonProps;
      const r = rig(helper);
      const fore = limb === 'armB' ? r.foreB : r.foreF;
      const w = limb === 'armB' ? r.wristB : r.wristF;
      h = { ...h, x: w[0], y: w[1], a: fore + 90 + aOff };
      const q = handPoint(h, which);
      wt = [wt[0] + (target[0] - q[0]), wt[1] + (target[1] - q[1])];
    }
    return h;
  };
  // alın eli (uzak kol, başın arkasından gelir): avuç alında, başparmak + işaret parmağı burnu sıkar
  const fh = fitArm('armB', nose, 'pinch', 'pinch', 'R', -20, -1);
  // çene eli (yakın kol): işaret ve orta parmak uçları çene kemiğinin altında
  const chH = fitArm('armF', underChin, 'tip', 'press', 'R', 10, 1);
  const ch = v.chest;
  const ax = ch[0] + 74;
  return (
    <Scene2 bg="indoor" gy={gy - 40}>
      <Person {...victim} />
      <Person {...helper} only={['armB']} />
      <Hand {...fh} arm={8} skin={sk} />
      <Person {...helper} only={['torso', 'head']} />
      <Person {...helper} only={['armF']} />
      <Hand {...chH} arm={8} skin={sk} />
      <Arrow from={[ax, ch[1] - 4]} to={[ax, ch[1] - 46]} />
      <Label x={282} y={34} text={n} size={20} />
    </Scene2>
  );
}

/** Derlenme (koma) pozisyonu: kişi yan yatmış, üstteki bacak dizden bükülü; nefes alıyor. */
function yanScene(c: Cast) {
  const p: PersonProps = { ...c.victim, x: 180, y: 230, s: 1.45, pose: { ...POSE.recovery, legF: [74, -6], legB: [2, 2] } } as PersonProps;
  const r = rig(p);
  return (
    <Scene2 bg="indoor">
      <Person {...p} />
      <Waves x={r.head[0] - 4} y={r.head[1] - 24} a={-110} n={3} r={6} color={K.water} />
    </Scene2>
  );
}

/** Bacaklar katlanmış battaniye yığınıyla ~30 cm yükseltilmiş, sırtüstü yatan kişi; yardımcı başının yanında. */
function bacakScene(c: Cast, face: 'closed' | 'worried') {
  const G = 220;
  const vic: PersonProps = { ...c.victim, x: 150, y: G, s: 1.28, pose: { ...POSE.lieBack, legB: [-17, -17], legF: [-16, -16], footB: -100, footF: -98, face } } as PersonProps;
  const v = rig(vic);
  const heel = v.ankleF;
  const top = heel[1] + 8;
  const bx = heel[0] - 30;
  const n = 4;
  const layers = Array.from({ length: n }, (_, i) => {
    const hh = (G - top) / n;
    return { d: rrect(bx, G - (i + 1) * hh, 60, hh, 4), f: i % 2 ? '#c1554b' : '#d46a5f' };
  });
  const helper: PersonProps = { ...c.helper, x: v.neck[0] + 6, y: G - 18, s: 1.2, pose: { ...POSE.kneelSit, spine: -80, chest: -74, head: -60, armB: { to: add(v.shoulderF, [6, -8]) }, armF: { to: add(v.shoulderF, [16, -8]) }, face: 'neutral' } } as PersonProps;
  return (
    <Scene2 bg="indoor" gy={G - 22}>
      <Person {...helper} />
      <OG sh={layers} />
      <Person {...vic} />
      <path d={`M${bx + 72} ${G}V${top + 4}M${bx + 66} ${G}h12M${bx + 66} ${top + 4}h12`} stroke={K.ink} stroke-width={2.2} />
      <Label x={bx + 30} y={top - 52} text="30 cm" size={14} />
    </Scene2>
  );
}

/** Kanamaya basınç (yakın plan): kişinin önkolundaki yaraya bez üstünden iki elle sert bastırma. */
function kanamaScene(c: Cast) {
  const vs = c.victim.skin ?? 1, hs = c.helper.skin ?? 1;
  const vc = c.victim.top ?? K.role.victim, hc = c.helper.top ?? K.role.helper;
  return (
    <Scene2 bg="closeup">
      <Hand x={70} y={170} a={-90} s={0.9} pose="open" side="L" arm={240} sleeve={vc} skin={vs} />
      <Blood x={212} y={186} s={1.1} />
      <Blood x={128} y={186} s={0.7} />
      <Cloth x={170} y={170} w={78} h={40} a={-3} />
      <Hand x={128} y={112} a={140} s={0.9} pose="press" side="L" arm={80} sleeve={hc} skin={hs} />
      <Hand x={212} y={112} a={220} s={0.9} pose="press" side="R" arm={80} sleeve={hc} skin={hs} />
      <Arrow from={[170, 34]} to={[170, 112]} w={7} />
    </Scene2>
  );
}

/* ═══════════════ bebek: sandalyede oturan yardımcının kucağında (yandan, tam boy) ═══════════════ */

type Lap = 'tutus' | 'sirt' | 'cevir';
function babyLap(kind: Lap) {
  const G = 318, s = 2.45;
  const sup = true;
  const base: PersonProps = {
    ...BBG.helper, x: 56, y: G, s,
    pose: { ...POSE.sitChair, spine: -74, chest: -56, head: -40, legB: [14, 96], legF: [10, 94], footB: 0, footF: 0, face: 'neutral' },
  };
  const r0 = rig(base);
  // uyluğun üst yüzeyi (uzak bacak)
  const thR = 11 * s;
  const kn = r0.kneeB, hp = r0.hipB;
  const ta = ang(hp, kn);
  const onThigh = (t: number, up = 0): P => pol(mid(hp, kn, t), ta - 90, thR + up);
  let helper: PersonProps = base;
  let baby: PersonProps = { ...BBG.victim, x: 0, y: 0 };
  let extra: JSX.Element | null = null;
  if (sup) {
    // uzak kol: önkol uyluğa dayalı, bileğe doğru hafif aşağı eğik; el bebeğin çenesini tutar
    const armB: [number, number] = [82, 20];
    const hb = rig({ ...base, pose: { ...base.pose, armB } });
    const E = hb.elbowB, W = hb.wristB;
    const fa = ang(E, W);
    const sp = fa + 6;
    const bpose: Pose = { spine: sp, chest: sp + 2, head: sp + 16, legB: [168, 128], legF: [158, 116], armB: [70, 110], armF: [62, 104], footB: 60, footF: 50, face: 'worried', behind: ['armB', 'armF'] };
    const b1 = rig({ ...BBG.victim, x: 0, y: 0, s: 1, pose: bpose });
    const len1 = Math.hypot(b1.mouth[0] - b1.hip[0], b1.mouth[1] - b1.hip[1]);
    const bs = (Math.hypot(W[0] - E[0], W[1] - E[1]) * 1.0) / len1;
    // çene elin içinde, gövde önkol boyunca (göğüs önkolun üstünde)
    const mo = pol(pol(W, fa, 9 * s), fa - 90, 4);
    baby = { ...BBG.victim, x: mo[0], y: mo[1], ax: 'mouth', ay: 'mouth', s: bs, shadow: false, pose: bpose };
    const b = rig(baby);
    helper = { ...base, pose: { ...base.pose, armB, handB: { shape: 'mitten', a: -20 } } };
    const upperBack = mid(b.back, b.nape, 0.4);
    if (kind === 'sirt') {
      // açık el (profilden, parmaklar düz ve bitişik) kürek kemiklerinin üstünde kalkmış; elin topuğu sırta iner
      const hand = pol(upperBack, sp - 104, 34);
      helper = { ...helper, pose: { ...helper.pose, armF: { to: hand, bend: 1 }, handF: 'none' } };
      const hr1 = rig(helper);
      const fo = hr1.foreF;
      const flen = Math.hypot(hr1.wristF[0] - hr1.elbowF[0], hr1.wristF[1] - hr1.elbowF[1]);
      extra = (
        <g>
          <Hand x={hr1.wristF[0]} y={hr1.wristF[1]} a={fo + 90 + 10} s={0.56} pose="open" side="R" view="palm" skin={BBG.helper.skin} arm={Math.min(30, flen / 0.56)} />
          <Arrow from={pol(pol(hr1.wristF, sp - 100, -8), sp + 180, 16)} to={pol(pol(upperBack, sp - 100, 4), sp + 180, 10)} w={6} />
          <Label x={276} y={34} text="5×" size={20} />
        </g>
      );
    } else if (kind === 'cevir') {
      const occ = pol(b.head, sp - 60, b.headR * 1.1);
      helper = { ...helper, pose: { ...helper.pose, armF: { to: occ, bend: -1 }, handF: { shape: 'flat', a: 60 } } };
      extra = <Arrow from={pol(b.head, -50, 56)} to={pol(b.head, 50, 56)} bend={-0.45} w={6} />;
    } else {
      helper = { ...helper, pose: { ...helper.pose, armF: { to: mid(b.hip, b.back, 0.5), bend: 1 }, handF: { shape: 'flat', a: 10 } } };
      extra = null;
    }
  }
  const hr = rig(helper);
  let jaw: JSX.Element | null = null;
  if (sup) {
    // tutan elin parmakları çenenin altında görünür (boğaz serbest)
    const b = rig(baby);
    const sp = ang(b.hip, b.neck);
    const chin = pol(b.mouth, sp + 90, b.headR * 0.32);
    jaw = <OG sh={[{ d: capsule(pol(chin, sp + 180, 12), 5, pol(chin, sp, 5), 4.2), f: K.skin[2] }]} ow={1.4} />;
  }
  return (
    <Scene2 bg="indoor" gy={226}>
      <Chair x={hr.hip[0] - 6} y={G} seat={G - hr.hip[1] - 6} s={1.25} />
      <Person {...helper} only={['legB', 'legF', 'torso', 'head', 'armB']} />
      <Person {...baby} />
      <Person {...helper} only={['armF']} />
      {jaw}
      {extra}
    </Scene2>
  );
}

/** Çevirme sonrası: bebek yardımcının uyluklarında SIRTÜSTÜ (yüz yukarı), başı dizlere doğru ve gövdeden aşağıda;
 *  yakın el başın arkasını destekler. Bebeğin üstünde çevirme yönünü gösteren yay ok. */
function babyLapUp() {
  const G = 318, s = 2.45;
  const base: PersonProps = {
    ...BBG.helper, x: 56, y: G, s,
    pose: { ...POSE.sitChair, spine: -78, chest: -64, head: -40, legB: [22, 98], legF: [20, 96], footB: 0, footF: 0, armB: [70, 30], handB: 'mitten', face: 'neutral' },
  };
  const r0 = rig(base);
  const thR = 11 * s;
  const hp = r0.hipF, kn = r0.kneeF;
  const ta = ang(hp, kn);
  const onThigh = (t: number, up = 0): P => pol(mid(hp, kn, t), ta - 90, thR + up);
  const tl = ta + 4; // bebeğin eğimi: baş dizlere doğru, aşağıda
  const bpose: Pose = { spine: 180 - tl, chest: 180 - tl, head: 180 - tl, armB: [-tl - 30, -tl + 40], armF: [-tl - 50, -tl + 20], legB: [-tl - 40, -tl + 40], legF: [-tl - 30, -tl + 50], face: 'worried' };
  const bb: PersonProps = { ...BBG.victim, x: 0, y: 0, ax: 'back', ay: 'back', s: 1.9, flip: true, shadow: false, pose: bpose };
  const at = onThigh(0.84, 2);
  const baby: PersonProps = { ...bb, x: at[0], y: at[1] };
  const b = rig(baby);
  const occ = pol(b.head, tl + 90, b.headR * 0.55);
  const under = pol(occ, tl, -2);
  const helper: PersonProps = { ...base, pose: { ...base.pose, armF: { to: pol(under, tl + 90, 4), bend: 1 }, handF: { shape: 'flat', a: -10 } } };
  const hr = rig(helper);
  return (
    <Scene2 bg="indoor" gy={226}>
      <Chair x={hr.hip[0] - 6} y={G} seat={G - hr.hip[1] - 6} s={1.25} />
      <Person {...helper} only={['legB', 'legF', 'torso', 'head', 'armB', 'armF']} />
      <Person {...baby} />
      <Arrow from={pol(b.hip, -95, 44)} to={pol(b.head, -70, b.headR + 24)} bend={-0.5} w={6} />
    </Scene2>
  );
}

/** Yukarıdan yakın plan: iki el bebeğin göğüs kafesini sarar, iki başparmak göğüs kemiğinin alt yarısında.
 *  lap: bebek yardımcının uyluklarında (bilinçli, boğulan bebek); değilse sert yüzeyde (KPR). */
function thumbsTop({ lap = false }: { lap?: boolean }) {
  // Yukarıdan bakış: bebek sırtüstü (baş yukarıda), yardımcı ayak ucunda. İki önkol alttan, bebeğin iki yanından
  // gelir; avuçlar göğüs kafesinin yanlarında (parmaklar sırtın altında), iki başparmak yan yana göğüs kemiğinin
  // alt yarısında, başa doğru.
  const bp: PersonProps = { ...BBG.victim, x: 160, y: 40, ax: 'head', ay: 'head', s: 2.9, shadow: false, pose: { view: 'front', armB: [200, -120], armF: [-20, -60], legB: [96, 90], legF: [84, 90], face: lap ? 'worried' : 'closed' } };
  const b = rig(bp);
  const cx = b.neck[0];
  const hw = (b.shoulderF[0] - b.shoulderB[0]) / 2;
  const nip = b.neck[1] + 26;
  const sk = HS, dk = shade(HS, 0.12);
  const side = (m: 1 | -1) => {
    const wr: P = [cx + m * (hw + 30), nip + 62];
    const palm: P = [cx + m * (hw + 13), nip + 6];
    const el: P = [cx + m * (hw + 96), 300];
    const tb: P = [cx + m * (hw + 2), nip + 30];
    const tt: P = [cx + m * 5, nip + 13];
    const sh: Sh[] = [
      { d: capsule(el, 17, wr, 12), f: sk },
      { d: capsule(wr, 13, palm, 12), f: sk },
      { d: capsule(pol(el, -90, -10), 19, pol(wr, ang(wr, el), 46), 15), f: K.role.helper },
      { d: capsule(tb, 8.4, mid(tb, tt, 0.55), 7.2), f: dk },
      { d: capsule(mid(tb, tt, 0.55), 7.2, tt, 6), f: sk },
    ];
    return { sh, tt, tb };
  };
  const L = side(-1), R = side(1);
  const nail = (t: P, a0: P) => {
    const c = pol(t, ang(a0, t), -3.4);
    return <ellipse cx={c[0]} cy={c[1]} rx={3.2} ry={2.3} fill={tint(HS, 0.45)} transform={`rotate(${ang(a0, t)} ${c[0]} ${c[1]})`} />;
  };
  return (
    <Scene2 bg="closeup">
      <rect x={0} y={0} width={320} height={240} fill={lap ? '#e8e0d2' : '#d9e2ea'} />
      {lap ? (
        <OG sh={[{ d: rrect(cx - 96, 60, 192, 220, 40), f: BBG.helper.bottomC! }, { d: `M${cx} 70V250`, st: shade(BBG.helper.bottomC!, 0.3), sw: 2 }]} />
      ) : (
        <OG sh={[{ d: rrect(cx - 110, 30, 220, 240, 10), f: '#c9d4de' }]} />
      )}
      <Person {...bp} />
      <path d={`M${cx - hw + 6} ${nip}H${cx + hw - 6}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="4 4" opacity={0.6} />
      <circle cx={cx - hw * 0.5} cy={nip} r={2.8} fill="#e79a8c" stroke={K.out} stroke-width={0.8} />
      <circle cx={cx + hw * 0.5} cy={nip} r={2.8} fill="#e79a8c" stroke={K.out} stroke-width={0.8} />
      <OG sh={[...L.sh, ...R.sh]} />
      {nail(L.tt, L.tb)}
      {nail(R.tt, R.tb)}
      <Arrow from={[cx + 118, nip - 34]} to={[cx + 16, nip + 8]} bend={-0.15} w={6} />
      {lap ? <Label x={276} y={34} text="5×" size={20} /> : <Label x={66} y={24} text="⅓ · 100–120/dk" size={12} />}
    </Scene2>
  );
}

/* ═══════════════ sahneler ═══════════════ */

export const SCENES: Record<string, ArtFn> = {
  /* ── Bebek KPR ── */
  'ilk-yardim-bebek-kpr-basparmak': () => thumbsTop({}),

  'ilk-yardim-bebek-kpr-tek-el': () => {
    // Yandan: sert yüzeyde sırtüstü bebek (baş solda, yüz tavana, baş nötr). Göğüs çıplak; meme ucu işaretli.
    // Göğüste yalnız BİR el: topuk göğüs kemiğinin alt yarısında, meme hizasının hemen altında; parmaklar kalkık.
    // Öbür el alında, başı düz tutuyor.
    const bp: PersonProps = {
      x: 196, y: 194, s: 3.1, who: 'baby', shadow: false, top: K.skin[0], sleeve: 'none', bottom: 'shorts', bottomC: '#f4f1ea',
      pose: { spine: 180, chest: 180, head: 182, armB: [-4, 6], armF: [-2, 4], legB: [-10, 6], legF: [-6, 10], footB: -80, footF: -76, face: 'closed', behind: ['armB', 'armF'] },
    };
    const b = rig(bp);
    // göğüs yüzeyi boyunca (başa doğru) nokta: t=0 göğüs(0.62), t=1 boyun
    const surf = (k: number): P => [b.chest[0] + (b.neck[0] - b.chest[0]) * k, b.chest[1] + (k > 0 ? -1 : 0)];
    const nip = surf(0.18);
    const st: P = [nip[0] + 16, b.chest[1] + 1]; // meme hizasının hemen altı (ayak tarafı)
    const fh: P = pol(b.head, -100, b.headR - 1);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(-4, 194, 328, 14, 3), f: '#9db4c8' }, { d: rrect(-4, 206, 328, 40, 0), f: '#7f97ac' }]} />
        <Person {...bp} />
        <circle cx={nip[0]} cy={nip[1] + 3} r={3.2} fill="#e79a8c" stroke={K.out} stroke-width={0.9} />
        <path d={`M${nip[0]} ${nip[1] - 60}V${nip[1] + 14}`} stroke={K.ink} stroke-width={1.4} stroke-dasharray="4 4" opacity={0.55} />
        {/* alındaki el: avuç alında, baş nötr */}
        <ProfileHand H={fh} dir={188} lift={-14} fa={-118} s={1.0} skin={2} />
        {/* bası yapan tek el: topuk göğüs kemiğinin alt yarısında, parmaklar kalkık (başa doğru) */}
        <ProfileHand H={st} dir={180} lift={52} fa={-80} s={1.1} skin={2} />
        <Arrow from={[st[0] + 46, st[1] - 104]} to={[st[0] + 46, st[1] - 40]} w={7} />
      </Scene2>
    );
  },

  /* ── Bebek boğulma ── */
  'ilk-yardim-bebek-tutus': () => babyLap('tutus'),
  'ilk-yardim-bebek-sirt-vurusu': () => babyLap('sirt'),
  'ilk-yardim-bebek-cevir': () => babyLapUp(),
  'ilk-yardim-bebek-gogus-basisi': () => thumbsTop({ lap: true }),

  /* ── Suda boğulma ── */
  'ilk-yardim-suda-nefes': () => nefesScene(SUD),
  'ilk-yardim-suda-kpr': () => kprScene(SUD),
  'ilk-yardim-suda-yan-yatir': () => yanScene(SUD),
  /* ── rehbere özel KPR / derlenme / bacak ── */
  'ilk-yardim-elektrik-kpr': () => kprScene(ELK),
  'ilk-yardim-sok-kanama': () => kanamaScene(SOK),
  'ilk-yardim-sok-yan-yatir': () => yanScene(SOK),
  'ilk-yardim-astim-kpr': () => kprScene(AST),
  'ilk-yardim-kalp-krizi-kpr': () => kprScene(KK),
  'ilk-yardim-inme-yan-yatir': () => yanScene(INM),
  'ilk-yardim-hipo-yan-yatir': () => yanScene(HIP),
  'ilk-yardim-bayilma-bacak': () => bacakScene(BAY, 'closed'),
  'ilk-yardim-bayilma-yan-yatir': () => yanScene(BAY),
  'ilk-yardim-suda-uzan': () => {
    const shoreEnd = 150;
    const resc: PersonProps = { ...SUD.helper, x: 70, y: 200, s: 0.95, pose: { spine: 2, chest: -2, head: -40, legB: [178, 182], legF: [182, 180], footB: -95, footF: -85, armB: [-16, -4], armF: [-12, -8], face: 'worried' } } as PersonProps;
    const rr = rig(resc);
    const hold: P = rr.wristF;
    const vic0: PersonProps = { ...SUD.victim, x: 262, y: 286, s: 0.95, pose: { view: 'front', armF: [-50, -100], face: 'worried' } } as PersonProps;
    const v0 = rig(vic0);
    const grip: P = [v0.shoulderB[0] - 24, v0.shoulderB[1] - 20];
    const vic: PersonProps = { ...vic0, pose: { ...vic0.pose, armB: { to: grip } } };
    const tipEnd: P = [grip[0] + 4, grip[1] - 2];
    const a0 = ang(hold, tipEnd);
    return (
      <Scene2 bg="outdoor">
        <Tree x={30} y={176} kind="pine" s={0.8} />
        <rect x={shoreEnd - 4} y={196} width={180} height={50} fill={K.water} />
        <Person {...vic} />
        <Water x={shoreEnd} y={194} w={180} h={50} />
        <Waves x={v0.hip[0] + 30} y={196} a={0} n={2} r={6} color={K.white} />
        <path d={`M0 200H${shoreEnd}Q${shoreEnd + 8} 206 ${shoreEnd + 2} 240H0Z`} fill={K.dirt} stroke={K.out} stroke-width={1.5} />
        <Person {...resc} />
        <Branch a={pol(hold, a0, -18)} b={tipEnd} />
        <Arrow from={pol(pol(hold, a0, 10), a0 - 90, 24)} to={pol(pol(tipEnd, a0, -18), a0 - 90, 24)} w={6} />
      </Scene2>
    );
  },

  'ilk-yardim-suda-at': () => {
    const shoreEnd = 150;
    const resc: PersonProps = { ...SUD.helper, x: 112, y: 214, s: 0.95, pose: { spine: -84, head: -86, legB: [104, 100], legF: [76, 86], armB: [84, 20], armF: [-38, -44], face: 'worried' } } as PersonProps;
    const r = rig(resc);
    const buoy: P = [282, 206];
    const coil: P = r.wristB;
    return (
      <Scene2 bg="outdoor">
        <rect x={shoreEnd} y={196} width={180} height={50} fill={K.water} />
        <Person {...SUD.victim} x={226} y={262} s={0.86} pose={{ view: 'front', armB: [-130, -150], armF: [-50, -30], face: 'worried' }} />
        <Water x={shoreEnd} y={194} w={180} h={50} />
        <path d={`M0 200H${shoreEnd}Q${shoreEnd + 8} 206 ${shoreEnd + 2} 240H0Z`} fill={K.dirt} stroke={K.out} stroke-width={1.5} />
        <path d={`M${coil[0]} ${coil[1]}Q${(coil[0] + buoy[0]) / 2} ${coil[1] + 40} ${buoy[0] - 14} ${buoy[1] - 4}`} fill="none" stroke="#f1e2b8" stroke-width={2.4} />
        <Person {...resc} />
        <circle cx={coil[0] + 2} cy={coil[1] + 2} r={7} fill="none" stroke="#e8d39d" stroke-width={3} />
        <Buoy x={buoy[0]} y={buoy[1]} r={15} />
        <Arrow from={add(r.wristF, [8, -6])} to={[buoy[0] - 2, buoy[1] - 24]} bend={0.28} />
        <Inset x={10} y={10} w={92} h={74} bg={K.sky}>
          <rect x={10} y={66} width={92} height={20} fill={K.water} />
          <Water x={10} y={66} w={92} h={20} />
          <Person x={58} y={74} s={0.42} who="man" role="bystander2" shadow={false} pose={{ spine: -24, chest: -18, head: -10, armB: [-26, -20], armF: [-34, -28], legB: [176, 160], legF: [168, 150], face: 'worried' }} />
          <No x={56} y={46} r={30} />
        </Inset>
      </Scene2>
    );
  },

  /* ── Elektrik ── */
  'ilk-yardim-elektrik-tahta-sopa': () => {
    // Kişi yerde doğal yatıyor (baş sağda), öne uzanmış eli yerdeki kabloya değiyor. Kurtarıcı kuru tahta
    // paletin üstünde, kuru süpürge sapıyla kabloyu elinden uzağa (sağa) itiyor; kişiye dokunmuyor.
    const vic: PersonProps = { ...ELK.victim, x: 200, y: 206, ay: 'back', s: 0.98, flip: true, pose: { ...POSE.lieBack, armF: [28, 44] } } as PersonProps;
    const v = rig(vic);
    const hand = v.handF;
    const tip: P = [hand[0] + 22, hand[1] + 3];
    const resc0: PersonProps = { ...ELK.helper, x: 62, y: 226, s: 1.02, pose: { spine: -70, chest: -62, head: -52, legB: [100, 96], legF: [78, 88], face: 'neutral' } } as PersonProps;
    const r0 = rig(resc0);
    const stickBack: P = [r0.chest[0] - 16, r0.chest[1] - 14];
    const along = (t: number): P => mid(stickBack, tip, t);
    const resc: PersonProps = { ...resc0, pose: { ...resc0.pose, armB: { to: along(0.17) }, armF: { to: along(0.34) }, handB: 'fist', handF: 'fist' } };
    const cable: P[] = [[300, 172], [300, 206], [288, 226], [tip[0] + 22, tip[1] + 2], [tip[0] + 2, tip[1] + 4], [hand[0] + 4, hand[1] + 3], [hand[0] - 26, hand[1] + 6]];
    return (
      <Scene2 bg="indoor" gy={196}>
        <rect x={291} y={150} width={18} height={24} rx={3} fill="#f4f1ea" stroke={K.out} stroke-width={1.4} />
        <path d={`M297 158v6M303 158v6`} stroke={K.out} stroke-width={1.6} />
        <Person {...vic} />
        <path d={smooth(cable)} fill="none" stroke={K.out} stroke-width={5.5} stroke-linecap="round" />
        <path d={smooth(cable)} fill="none" stroke="#4a4f5c" stroke-width={3} stroke-linecap="round" />
        <Person {...vic} only={['armF']} />
        {/* kuru tahta palet */}
        <OG sh={[{ d: rrect(18, 226, 92, 7, 1.5), f: '#d7b07a' }, { d: rrect(22, 233, 11, 7, 1), f: '#b98d58' }, { d: rrect(58, 233, 11, 7, 1), f: '#b98d58' }, { d: rrect(94, 233, 11, 7, 1), f: '#b98d58' }]} />
        <path d={`M${stickBack[0]} ${stickBack[1]}L${tip[0]} ${tip[1]}`} stroke={K.out} stroke-width={7.5} stroke-linecap="round" />
        <path d={`M${stickBack[0]} ${stickBack[1]}L${tip[0]} ${tip[1]}`} stroke="#c9945e" stroke-width={4.5} stroke-linecap="round" />
        <Person {...resc} />
        <Bolt x={hand[0] - 30} y={hand[1] - 8} s={0.85} />
        <Arrow from={[tip[0] + 26, tip[1] - 9]} to={[tip[0] + 58, tip[1] - 9]} w={5} />
      </Scene2>
    );
  },

  'ilk-yardim-elektrik-hat-uzak': () => {
    const end: P = [124, 214];
    return (
      <Scene2 bg="outdoor">
        <HouseLike />
        <OG sh={[{ d: rrect(44, 36, 9, 172, 2), f: '#8a6142' }, { d: rrect(26, 44, 46, 6, 2), f: '#8a6142' }]} />
        <path d={`M30 46Q0 70 -10 66M68 46Q80 60 120 56T340 50`} fill="none" stroke={K.out} stroke-width={2} />
        <path d={`M68 46C92 80 100 150 ${end[0] - 10} ${end[1] - 4}Q${end[0] - 4} ${end[1]} ${end[0]} ${end[1]}`} fill="none" stroke={K.out} stroke-width={2.4} />
        <ellipse cx={end[0]} cy={end[1]} rx={88} ry={20} fill={K.danger} opacity={0.12} />
        <ellipse cx={end[0]} cy={end[1]} rx={88} ry={20} fill="none" stroke={K.danger} stroke-width={3} stroke-dasharray="9 6" />
        <Spark x={end[0]} y={end[1]} s={1.1} />
        <Label x={end[0]} y={190} text="20 m" size={15} bg={K.danger} />
        <Person x={300} y={204} s={0.64} who="woman" role="bystander2" hair="long" hairC={K.hair.brown} pose={{ ...POSE.stand, face: 'worried' }} />
        {(() => {
          // yardımcı tehlike halkasının dışında durur; bir kolu tele doğru "yaklaşma", öbürü arkadakilere "dur" der
          const p: PersonProps = { ...ELK.helper, x: 232, y: 226, s: 0.98,
            pose: { view: 'front', armB: [176, 184], armF: [-6, -14], handB: { shape: 'flat', a: 0 }, handF: { shape: 'flat', a: -80 }, face: 'worried' } } as PersonProps;
          return <Person {...p} />;
        })()}
      </Scene2>
    );
  },

  'ilk-yardim-elektrik-yanik-sogut': () => {
    const h = { x: 266, y: 178, a: -84, s: 1.72, side: 'R' as const, view: 'palm' as const, pose: 'open' as const };
    const palm = hpt(h, [0, -24]);
    const sx = palm[0];
    return (
      <Scene2 bg="closeup">
        {/* musluk: ağız avucun tam üstünde */}
        <OG sh={[{ d: rrect(-10, 22, sx + 6, 22, 6), f: '#c3ccd5' }, { d: rrect(sx - 14, 30, 28, 44, 6), f: '#c3ccd5' }, { d: rrect(sx - 17, 68, 34, 10, 3), f: '#a7b2bd' }, { d: rrect(60, 6, 28, 18, 4), f: '#a7b2bd' }, { d: rrect(54, 2, 40, 7, 3), f: K.water }]} />
        <path d={`M${sx - 12} 78L${sx - 9} ${palm[1] - 4}H${sx + 9}L${sx + 12} 78Z`} fill={K.waterLight} stroke={K.water} stroke-width={1.5} opacity={0.9} />
        <path d={`M${sx - 4} 86V${palm[1] - 14}`} stroke="#fff" stroke-width={2.2} opacity={0.85} />
        <Hand {...h} skin={1} arm={110} sleeve={K.role.victim} />
        <ellipse cx={sx + 3} cy={palm[1] + 2} rx={7} ry={5} fill="#c6574e" stroke="#8e2f2a" stroke-width={1.2} />
        <ellipse cx={sx + 3} cy={palm[1] + 2} rx={3} ry={2} fill="#f0a08f" />
        <path d={`M${sx - 22} ${palm[1] - 2}q-8 4 -12 0M${sx + 24} ${palm[1] - 4}q8 4 12 0`} stroke={K.water} stroke-width={2.4} fill="none" stroke-linecap="round" />
        <Drop x={sx - 40} y={palm[1] + 34} s={0.8} />
        <Drop x={sx + 30} y={palm[1] + 40} s={0.7} />
        <Drop x={sx - 14} y={palm[1] + 52} s={0.75} />
        <Timer x={46} y={196} r={16} text="20 dk" />
      </Scene2>
    );
  },

  /* ── Şok ve bayılma ── */
  'ilk-yardim-sok-belirti': () => {
    // Yandan yakın plan: yerde sırtüstü YATAN kişi (soluk-gri yüz, alında ter); arkasında diz çökmüş
    // yardımcı iki parmağıyla bileğinde nabız yokluyor.
    const G = 228;
    const vic: PersonProps = { ...SOK.victim, x: 212, y: G, s: 2.0, pose: { ...POSE.lieBack, armF: [6, 0], face: 'worried' } } as PersonProps;
    const v = rig(vic);
    const wr = v.wristF;
    const help: PersonProps = { ...SOK.helper, x: 282, y: 202, s: 1.25, flip: true, pose: { ...POSE.kneel, spine: -46, chest: -40, head: -30, armF: { to: [wr[0] + 12, wr[1] - 5] }, armB: { to: [wr[0] + 22, wr[1] + 1] }, handF: 'mitten', handB: 'mitten', face: 'neutral' } } as PersonProps;
    const h = rig(help);
    const f0 = h.handF;
    const tips: P[] = [[wr[0] - 3, wr[1] - 3], [wr[0] + 3, wr[1] - 2]];
    const icon = (y: number, c: ComponentChildren) => (
      <g>
        <circle cx={34} cy={y} r={19} fill="#fff" stroke={K.out} stroke-width={1.5} />
        {c}
      </g>
    );
    return (
      <Scene2 bg="indoor" gy={196}>
        <Person {...help} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...vic} />
        <Pale r={v} op={0.42} />
        <Sweat x={v.head[0] + 2} y={v.head[1] - v.headR - 4} s={1.2} />
        <Person {...help} only={['armF']} />
        <OG sh={tips.map((t, k) => ({ d: capsule(add(f0, [k * 3 - 2, -1]), 3.4, t, 2.8), f: K.skin[2] }))} ow={1.3} />
        <Ring x={wr[0]} y={wr[1] - 2} rx={16} ry={11} />
        {icon(34, <Drop x={34} y={37} s={1.2} color={K.waterLight} />)}
        {icon(80, <Ecg x={18} y={80} w={32} />)}
        {icon(126, <Waves x={25} y={126} n={3} r={5} color={K.water} />)}
      </Scene2>
    );
  },

  'ilk-yardim-sok-battaniye': () => {
    // Yandan: yerde sırtüstü yatan kişi; altında yerden yalıtan serili battaniye, üstü boynuna kadar
    // ikinci battaniyeyle örtülü. Yakası açılmış; yardımcı yanında diz çökmüş.
    const G = 222;
    const vic: PersonProps = { ...SOK.victim, x: 176, y: G - 5, s: 1.55, pose: { ...POSE.lieBack, face: 'worried' } } as PersonProps;
    const v = rig(vic);
    const _help: PersonProps = { ...SOK.helper, x: 206, y: 204, s: 1.15, flip: true, pose: { ...POSE.kneel, spine: -44, chest: -36, head: -26, armF: { to: [v.neck[0] + 20, G - 34] }, armB: { to: [v.neck[0] + 34, G - 36] }, handF: { shape: 'flat', a: -80 }, handB: { shape: 'flat', a: -80 }, face: 'neutral' } } as PersonProps;
    const x1 = v.neck[0] + 2, x2 = v.toeF[0] + 10;
    return (
      <Scene2 bg="outdoor" gy={194} ground="grass">
        {/* alttaki battaniye (yerden yalıtır) */}
        <OG sh={[{ d: rrect(v.head[0] - 44, G - 6, x2 - v.head[0] + 60, 10, 3), f: '#5f86b8' }, { d: `M${v.head[0] - 38} ${G - 2}H${x2 + 10}`, st: tint('#5f86b8', 0.3), sw: 1.4 }]} />
        <Person {...vic} shadow={false} />
        {/* açılmış yaka */}
        <path d={`M${v.neck[0] - 2} ${v.neck[1] - 7}l6 7l6 -7`} stroke={K.out} stroke-width={1.6} fill={K.skin[0]} />
        <Blanket x1={x1} x2={x2} y={G - 4} h={38} color="#c1554b" />
        {void _help}
        <Arrow from={[20, 160]} to={[v.head[0] - 40, G - 7]} bend={0.25} w={5} />
        <Arrow from={[x2 - 36, 104]} to={[x2 - 38, G - 36]} w={5} />
      </Scene2>
    );
  },

  'ilk-yardim-bacak-kaldir': () => bacakScene(SOK, 'worried'),

  'ilk-yardim-bayilma-oturt': () => {
    // Başı dönen kişi yere oturtulmuş: bacaklar önde, bir eli alnında, başı hafif öne düşük. Arkasında diz çökmüş
    // yardımcı iki eliyle sırtını ve omzunu destekliyor (düşüp başını çarpmasın).
    const G = 226;
    const vic0: PersonProps = { ...BAY.victim, x: 168, y: G, s: 1.45, pose: { ...POSE.sitFloor, spine: -74, chest: -66, head: -62, legB: [-16, 22], legF: [-22, 18], armB: { at: 'kneeB', d: [-6, -4] }, face: 'closed' } };
    const v0 = rig(vic0);
    const vic: PersonProps = { ...vic0, pose: { ...vic0.pose, armF: { to: add(v0.head, [v0.headR * 0.8, -v0.headR * 0.35]) }, handF: { shape: 'flat', a: -40 } } };
    const v = rig(vic);
    const sh: P = add(v.shoulderF, [-4, -6]);
    const backP: P = mid(v.back, v.nape, 0.35);
    const help: PersonProps = { ...BAY.helper, x: v.hip[0] - 62, y: G - 4, s: 1.4, pose: { ...POSE.kneel, spine: -76, chest: -64, head: -50, armB: { to: sh }, armF: { to: backP }, handB: { shape: 'flat', a: -30 }, handF: { shape: 'flat', a: -60 }, face: 'worried' } } as PersonProps;
    return (
      <Scene2 bg="indoor">
        <Person {...help} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...vic} />
        <Person {...help} only={['armF']} />
        <g fill="none" stroke={K.ink} stroke-width={2.2} stroke-linecap="round">
          <path d={`M${v.head[0] - 18} ${v.top - 10}q7 -8 14 0t14 0t14 0`} />
        </g>
      </Scene2>
    );
  },

  'ilk-yardim-bayilma-kas-sik': () => {
    const G = 222;
    const sit: PersonProps = { ...BAY.victim, x: 40, y: G, s: 0.92, pose: { ...POSE.sitChair, legB: [6, 66], legF: [-4, 110], footB: 0, footF: 0, armB: [80, 20], armF: [74, 12], face: 'neutral' } };
    const s1 = rig(sit);
    const cr: PersonProps = { ...BAY.victim, x: 154, y: G, s: 0.9, pose: { ...POSE.crouch, armB: { at: 'kneeB', d: [4, -2] }, armF: { at: 'kneeF', d: [4, -2] } } };
    const s2 = rig(cr);
    const pu0: PersonProps = { ...BAY.victim, x: 266, y: G, s: 0.86, pose: { ...POSE.stand } } as PersonProps;
    const p0 = rig(pu0);
    const hc: P = [p0.chest[0], p0.chest[1] + 16];
    const pu: PersonProps = { ...pu0, pose: { ...pu0.pose, armB: [128, -4], armF: [52, 184], handB: 'fist', handF: 'fist', face: 'neutral' } };
    const s3 = rig(pu);
    const th1 = mid(s1.hipF, s1.kneeF), th2 = mid(s2.hipF, s2.kneeF);
    return (
      <Scene2 bg="closeup">
        {[8, 114, 220].map((x) => <rect key={x} x={x} y={10} width={92} height={220} rx={12} fill="#fff" stroke={K.out} stroke-width={1.5} />)}
        {[8, 114, 220].map((x) => <rect key={'f' + x} x={x + 1} y={G} width={90} height={7} fill={K.floor} />)}
        {[1, 2, 3].map((n, i) => <text key={n} x={20 + i * 106} y={32} font-size={15} font-weight={700} fill={K.ink}>{n}</text>)}
        <Chair x={s1.hip[0] - 6} y={G} seat={G - s1.hip[1] - 5} s={0.85} />
        <Person {...sit} />
        <ellipse cx={th1[0]} cy={th1[1] - 1} rx={18} ry={8} fill={K.action} opacity={0.5} transform={`rotate(${ang(s1.hipF, s1.kneeF)} ${th1[0]} ${th1[1] - 1})`} />
        <Arrow from={[s1.kneeF[0] + 4, s1.kneeF[1] - 34]} to={[s1.kneeF[0] + 4, s1.kneeF[1] - 10]} w={3.6} />
        <Arrow from={[s1.kneeF[0] + 4, s1.kneeF[1] + 34]} to={[s1.kneeF[0] + 4, s1.kneeF[1] + 10]} w={3.6} />
        <Person {...cr} />
        <ellipse cx={th2[0]} cy={th2[1]} rx={18} ry={8} fill={K.action} opacity={0.5} transform={`rotate(${ang(s2.hipF, s2.kneeF)} ${th2[0]} ${th2[1]})`} />
        <Arrow from={[s2.hip[0] - 4, s2.hip[1] - 46]} to={[s2.hip[0] - 4, s2.hip[1] - 16]} w={3.6} />
        <Arrow from={[s2.hip[0] - 4, G + 2]} to={[s2.hip[0] - 4, s2.hip[1] + 12]} w={3.6} />
        <Person {...pu} />
        <ellipse cx={mid(s3.elbowB, s3.wristB)[0]} cy={mid(s3.elbowB, s3.wristB)[1]} rx={13} ry={7} fill={K.action} opacity={0.5} />
        <ellipse cx={mid(s3.elbowF, s3.wristF)[0]} cy={mid(s3.elbowF, s3.wristF)[1]} rx={13} ry={7} fill={K.action} opacity={0.5} />
        <Arrow from={[s3.wristB[0] - 4, s3.wristB[1] - 22]} to={[s3.wristB[0] - 34, s3.wristB[1] - 22]} w={3.6} />
        <Arrow from={[s3.wristF[0] + 4, s3.wristF[1] - 22]} to={[s3.wristF[0] + 34, s3.wristF[1] - 22]} w={3.6} />
      </Scene2>
    );
  },

  /* ── Kalp krizi ── */
  'ilk-yardim-kalp-krizi-belirti': () => {
    const p0: PersonProps = { ...KK.victim, x: 160, y: 58, ax: 'head', ay: 'head', s: 1.62, pose: { view: 'front', armF: [96, 86], face: 'pain' } };
    const r0 = rig(p0);
    const ch: P = [r0.chest[0], r0.chest[1] - 6];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armB: { to: [ch[0] + 4, ch[1]], bend: 1 }, handB: 'fist' } };
    const r = rig(p);
    const jaw: P = [r.head[0], r.head[1] + r.headR * 1.05];
    const arm: P = mid(r.shoulderF, r.elbowF, 0.6);
    const back: P = [r.shoulderB[0] - 10, r.shoulderB[1] + 6];
    return (
      <Scene2 bg="indoor">
        <Window x={244} y={34} />
        <Pain x={back[0] - 4} y={back[1] + 6} rx={22} ry={18} />
        <Person {...p} />
        <Pain x={ch[0]} y={ch[1] + 6} rx={24} ry={20} />
        <Pain x={arm[0] + 2} y={arm[1] + 10} rx={10} ry={26} a={-4} />
        <Pain x={jaw[0]} y={jaw[1] + 2} rx={18} ry={10} />
        <Sweat x={r.head[0] + 2} y={r.head[1] - r.headR * 0.62} s={1.1} />
        {[arm, jaw, back].map((t, i) => {
          const a = ang(ch, t);
          return <Arrow key={i} from={pol(ch, a, 16)} to={pol(t, a + 180, 8)} w={2.6} color={K.danger} />;
        })}
      </Scene2>
    );
  },

  'ilk-yardim-kalp-krizi-oturt': () => {
    const G = 222;
    const pose: Pose = { spine: -66, chest: -76, head: -84, legB: [-50, 64], legF: [-44, 70], armF: [76, 4], face: 'pain' };
    const v0 = rig({ ...KK.victim, x: 0, y: G, s: 1.4, pose });
    const vic: PersonProps = { ...KK.victim, x: 66 - v0.back[0], y: G, s: 1.4, pose: { ...pose, armB: { at: 'kneeB', d: [-4, 2] } } };
    const v = rig(vic);
    const sh: P = add(mid(v.shoulderF, v.elbowF, 0.3), [4, -2]);
    const h0: PersonProps = { ...KK.helper, x: sh[0] + 96, y: G - 2, s: 1.3, flip: true, pose: { ...POSE.kneel, spine: -76, chest: -72, head: -70, face: 'speak' } };
    const helper: PersonProps = { ...h0, pose: { ...h0.pose, armF: { to: sh }, handF: { shape: 'flat', a: 10 }, armB: { at: 'kneeB', d: [-4, -6] } } };
    const hr = rig(helper);
    return (
      <Scene2 bg="indoor">
        <Wall x={-4} y={G - 12} w={30} h={160} />
        <OG sh={[{ d: rrect(14, G - 124, 52, 112, 16), f: '#6e8fb8' }, { d: rrect(19, G - 117, 42, 38, 12), f: tint('#6e8fb8', 0.2), ln: true }]} />
        <Person {...vic} />
        <Person {...helper} />
        <Waves x={hr.mouth[0] - 8} y={hr.mouth[1] - 4} a={180} n={3} r={5} />
      </Scene2>
    );
  },

  /* ── İnme ── */
  'ilk-yardim-inme-yuz': () => {
    const p: PersonProps = { ...INM.victim, x: 160, y: 100, ax: 'head', ay: 'head', s: 4.3, pose: { ...POSE.stand, face: 'neutral' } };
    const r = rig(p);
    const k = r.headR / 12;
    const L = (x: number, y: number): P => [r.head[0] + x * k, r.head[1] + y * k];
    const sk = K.skin[1];
    const lc = L(-4.6, 9.6), rc = L(4.4, 5.6);
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        {/* bıyık ve ağız yeniden: sağ yanı (ekranda sağ) gülüyor, sol yanı (ekranda sol) düşük */}
        <path d={`M${L(-5, 5.4).join(' ')}Q${L(0, 4.4).join(' ')} ${L(5, 5.4).join(' ')}L${L(5, 8.4).join(' ')}Q${L(0, 9.4).join(' ')} ${L(-5, 8.4).join(' ')}Z`} fill={sk} />
        <path d={`M${lc.join(' ')}Q${L(-1, 8.4).join(' ')} ${L(1, 7.8).join(' ')}Q${L(3.4, 7.6).join(' ')} ${rc.join(' ')}`} fill="none" stroke={shade(sk, 0.5)} stroke-width={2.6} stroke-linecap="round" />
        <path d={`M${L(-6.6, 2.6).join(' ')}Q${L(-5.6, 5.6).join(' ')} ${L(-4.4, 7).join(' ')}`} fill="none" stroke={shade(sk, 0.25)} stroke-width={1.6} stroke-linecap="round" />
        <path d={`M${L(-6.2, -1.2).join(' ')}Q${L(-4.4, 0.4).join(' ')} ${L(-2.6, -1.2).join(' ')}`} fill={sk} stroke={K.ink} stroke-width={1.4} />
        <path d={`M${L(6.8, 3.2).join(' ')}Q${L(5.6, 5.6).join(' ')} ${L(4.6, 6.4).join(' ')}`} fill="none" stroke={shade(sk, 0.25)} stroke-width={1.4} stroke-linecap="round" />
        <Arrow from={[lc[0] - 30, lc[1] - 16]} to={[lc[0] - 30, lc[1] + 22]} w={6} />
        <Label x={46} y={30} text="YÜZ" size={17} />
      </Scene2>
    );
  },

  'ilk-yardim-inme-kol': () => {
    const G = 226;
    const p: PersonProps = { ...INM.victim, x: 128, y: G, s: 1.08, sleeve: 'long', pose: { ...POSE.sitChair, armB: [-4, -4], armF: [22, 34], handB: { shape: 'flat', a: 0 }, handF: { shape: 'flat', a: 0 }, face: 'worried' } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor">
        <Window x={230} y={40} />
        <Chair x={r.hip[0] - 6} y={G} seat={G - r.hip[1] - 4} />
        <Person {...p} />
        <path d={`M${r.wristB[0] + 14} ${r.wristB[1]}H${r.wristB[0] + 50}`} stroke={K.ink} stroke-width={1.6} stroke-dasharray="5 4" opacity={0.6} />
        <Arrow from={[r.wristF[0] + 22, r.wristF[1] - 18]} to={[r.wristF[0] + 26, r.wristF[1] + 22]} bend={-0.2} w={6} />
        <Label x={40} y={30} text="KOL" size={16} />
      </Scene2>
    );
  },

  'ilk-yardim-inme-konusma': () => {
    const pa: PersonProps = { ...INM.victim, x: 74, y: 120, ax: 'head', ay: 'head', s: 2.3, pose: { ...POSE.standSide, head: -86, face: 'speak' } };
    const ra = rig(pa);
    const ph: PersonProps = { ...INM.helper, x: 262, y: 128, ax: 'head', ay: 'head', s: 2.2, flip: true, pose: { ...POSE.standSide, head: -96, face: 'neutral' } } as PersonProps;
    const bits: [string, number, number, number][] = [['k', 128, 54, -18], ['?', 156, 48, 12], ['ş', 178, 60, -6], ['a', 142, 80, 22], ['…', 172, 82, 0], ['m', 196, 76, -24]];
    return (
      <Scene2 bg="closeup">
        <Person {...pa} only={['torso', 'head']} />
        <Person {...ph} only={['torso', 'head']} />
        <Bubble x={112} y={30} w={104} h={68} tail={[ra.mouth[0] + 12, ra.mouth[1] - 6]}>
          {bits.map(([t, x, y, a], i) => (
            <text key={i} x={x} y={y} transform={`rotate(${a} ${x} ${y})`} font-size={20} font-weight={700} fill={i % 2 ? '#8a8f9c' : K.ink} text-anchor="middle" dominant-baseline="middle">{t}</text>
          ))}
        </Bubble>
        <Label x={160} y={222} text="KONUŞMA" size={14} />
      </Scene2>
    );
  },

  'ilk-yardim-inme-saat': () => {
    // Duvar saati ve yanında not kâğıdına yazılan saat (kalemi tutan el): "saati not edin".
    const nx = 176, ny = 96;
    const ph = { x: 290, y: 236, a: -28, s: 1.05, pose: 'hold' as const, side: 'R' as const, grip: 30 };
    const g = hpt(ph, [0, -38]);
    return (
      <Scene2 bg="indoor" gy={236}>
        <Clock x={88} y={104} r={58} h={10} m={10} />
        <g transform={`rotate(4 ${nx + 54} ${ny + 60})`}>
          <OG sh={[{ d: rrect(nx, ny, 108, 124, 6), f: '#fffdf4' }, { d: rrect(nx, ny, 108, 16, 6), f: '#f2c14e' }]} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${nx + 12} ${ny + 82 + i * 14}H${nx + 96}`} stroke="#c9d6e2" stroke-width={1.6} />)}
          <text x={nx + 54} y={ny + 66} text-anchor="middle" font-size={30} font-weight={700} fill={K.ink}>10:10</text>
        </g>
        <Hand {...ph} arm={60} sleeve={K.role.helper} skin={2}>
          <g transform={`translate(${g[0]} ${g[1]}) rotate(${-28 - 40})`}>
            <OG sh={[{ d: rrect(-4, -70, 8, 96, 2), f: '#f2c14e' }, { d: `M-4 -70L0 -84L4 -70Z`, f: '#e9c9a0' }]} />
          </g>
        </Hand>
        <Label x={250} y={30} text="ZAMAN" size={15} />
      </Scene2>
    );
  },

  /* ── Astım ── */
  'ilk-yardim-astim-oturus': () => {
    const G = 232;
    const sc = 1.38;
    const p0: PersonProps = { ...AST.victim, x: 96, y: G, s: sc, pose: { ...POSE.sitChair, spine: -72, chest: -68, head: -80, face: 'pain' } };
    const r0 = rig(p0);
    const th = 78;
    const top = G - th;
    const tableX = r0.chest[0] + 4;
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armB: { to: [r0.chest[0] + 50, top - 2] }, armF: { to: [r0.chest[0] + 42, top - 2] }, handB: { shape: 'flat', a: 0 }, handF: { shape: 'flat', a: 0 } } };
    const r = rig(p);
    return (
      <Scene2 bg="indoor">
        <Chair x={r.hip[0] - 8} y={G} seat={G - r.hip[1] - 5} s={1.15} />
        <Person {...p} />
        <Table x={tableX} y={G} w={150} h={th} />
        <Person {...p} only={['armF']} />
        <Waves x={r.mouth[0] + 6} y={r.mouth[1] + 1} a={0} n={3} r={5} color={K.water} />
        <Inset x={216} y={10} w={94} h={66}>
          <rect x={216} y={62} width={94} height={14} fill={K.floor} />
          <Person {...AST.victim} x={262} y={66} s={0.5} pose={{ ...POSE.lieBack, face: 'pain' }} />
          <No x={262} y={43} r={27} />
        </Inset>
      </Scene2>
    );
  },

  'ilk-yardim-astim-fisfis': () => {
    const p: PersonProps = { ...AST.victim, x: 104, y: 96, ax: 'head', ay: 'head', s: 2.5, pose: { ...POSE.standSide, head: -92, face: 'neutral' } };
    const r = rig(p);
    const ip: P = [r.mouth[0] - 5, r.mouth[1] + 1];
    const s = 1.05;
    const bc: P = [ip[0] + 26.5 * s, ip[1] - 16 * s];
    const hs = 0.8;
    const hold = { x: bc[0], y: bc[1] + 44 * hs, a: 0, s: hs, pose: 'hold' as const, side: 'R' as const, grip: (25 * s) / hs + 2 };
    const help0 = { x: 0, y: 0, a: -52, s: 0.82, side: 'L' as const, view: 'palm' as const, pose: 'open' as const };
    const pc = hpt(help0, [0, -26]);
    const tgt: P = [hold.x + 18, hold.y + 26];
    const help = { ...help0, x: tgt[0] - pc[0], y: tgt[1] - pc[1] };
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <Hand {...help} skin={3} arm={130} sleeve={K.role.helper} />
        <Hand {...hold} skin={1} arm={110} sleeve={K.role.victim}>
          <Inhaler x={ip[0]} y={ip[1]} s={s} />
        </Hand>
        <OG sh={[{ d: capsule([bc[0] + 13, bc[1] - 26], 4.4, [bc[0] + 3, ip[1] - 76 * s], 4), f: K.skin[1] }]} />
        <Arrow from={[ip[0] + 32, ip[1] - 58]} to={[ip[0] - 2, ip[1] + 1]} bend={0.4} w={5} />
      </Scene2>
    );
  },

  'ilk-yardim-astim-hazne': () => {
    const p: PersonProps = { ...AST.victim, x: 82, y: 104, ax: 'head', ay: 'head', s: 2.5, pose: { ...POSE.standSide, head: -92, face: 'neutral' } } as PersonProps;
    const r = rig(p);
    const m: P = [r.mouth[0] - 2, r.mouth[1] + 1];
    const x0 = m[0] + 4, x1 = 258, cy = m[1];
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head']} />
        <OG sh={[{ d: rrect(x0, cy - 9, 22, 18, 4), f: '#cfd8e0' }]} />
        <path d={`M${x0 + 18} ${cy - 9}C${x0 + 40} ${cy - 30} ${x1 - 30} ${cy - 30} ${x1} ${cy - 22}V${cy + 22}C${x1 - 30} ${cy + 30} ${x0 + 40} ${cy + 30} ${x0 + 18} ${cy + 9}Z`} fill="#d6eefa" fill-opacity={0.55} stroke={K.out} stroke-width={1.6} />
        {[[150, cy - 6, 9], [172, cy + 6, 11], [196, cy - 4, 12], [222, cy + 4, 12], [130, cy + 4, 6]].map(([x, y, rr], i) => (
          <circle key={i} cx={x} cy={y} r={rr} fill="#ffffff" opacity={0.85} stroke="#b9cbd8" stroke-width={1} />
        ))}
        <path d={`M${x0 + 30} ${cy - 15}C${x0 + 60} ${cy - 22} ${x1 - 40} ${cy - 22} ${x1 - 8} ${cy - 16}`} stroke="#fff" stroke-width={3} fill="none" opacity={0.9} />
        <Inhaler x={x1 - 2} y={cy} s={0.9} />
        <Arrow from={[x1 - 30, cy + 46]} to={[x0 + 30, cy + 46]} w={6} />
      </Scene2>
    );
  },

  /* ── Anafilaksi ── */
  'ilk-yardim-anafilaksi-belirti': () => {
    const p0: PersonProps = { ...ANA.victim, x: 150, y: 76, ax: 'head', ay: 'head', s: 2.9, sleeve: 'short', pose: { ...POSE.stand, face: 'worried' } };
    const r0 = rig(p0);
    const throat: P = [r0.neck[0] + 10, r0.neck[1] + 12];
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armF: { to: throat, bend: -1 }, armB: [100, 76], handF: { shape: 'mitten', a: -20, thumb: 1 } } };
    const r = rig(p);
    const k = r.headR / 12;
    const L = (x: number, y: number): P => [r.head[0] + x * k, r.head[1] + y * k];
    const lipC = '#d9666a';
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head', 'armB']} />
        {/* şiş göz kapakları */}
        <ellipse cx={L(-4.4, 1.6)[0]} cy={L(-4.4, 1.6)[1]} rx={4.6 * k} ry={2.6 * k} fill="#f0a39a" opacity={0.75} />
        <ellipse cx={L(4.4, 1.6)[0]} cy={L(4.4, 1.6)[1]} rx={4.6 * k} ry={2.6 * k} fill="#f0a39a" opacity={0.75} />
        {/* şiş dudaklar */}
        <path d={`M${L(-4.6, 7.6).join(' ')}Q${L(0, 4.2).join(' ')} ${L(4.6, 7.6).join(' ')}Q${L(0, 12.4).join(' ')} ${L(-4.6, 7.6).join(' ')}Z`} fill={lipC} stroke={K.out} stroke-width={1.4} />
        <path d={`M${L(-3.4, 7.8).join(' ')}Q${L(0, 8.8).join(' ')} ${L(3.4, 7.8).join(' ')}`} stroke="#8e2f35" stroke-width={1.4} fill="none" />
        <Hives pts={[add(r.neck, [-16, 2]), add(r.neck, [-9, 12]), add(r.neck, [-20, 18]), mid(r.shoulderB, r.elbowB, 0.75), add(mid(r.shoulderB, r.elbowB, 0.9), [3, 6]), add(r.elbowB, [-2, 12]), add(mid(r.elbowB, r.wristB, 0.4), [2, 0]), add(mid(r.elbowB, r.wristB, 0.7), [-3, 4])]} s={1.3} />
        <Person {...p} only={['armF']} />
        <Hives pts={[mid(r.elbowF, r.wristF, 0.4), add(mid(r.elbowF, r.wristF, 0.7), [0, 6]), add(r.elbowF, [-6, -2])]} s={1.3} />
        <Ring x={L(0, 8)[0]} y={L(0, 8)[1]} rx={8 * k} ry={4.6 * k} dash />
        <Ring x={r.neck[0]} y={r.neck[1] + 8} rx={30} ry={12} dash />
      </Scene2>
    );
  },

  'ilk-yardim-adrenalin-kapak': () => {
    const fist = { x: 86, y: 150, a: 90, s: 1.25, side: 'R' as const, view: 'back' as const, pose: 'fist' as const };
    const c = hpt(fist, [0, -26]);
    const penX = c[0] + 2;
    const tipY = c[1] + 72;
    const capY = tipY - 128 * 1.15 - 12;
    return (
      <Scene2 bg="closeup">
        <AutoInj x={penX} y={tipY} s={1.15} capOff={18} />
        <Hand {...fist} skin={ANA.helper.skin} arm={110} sleeve={K.role.helper} />
        <Hand x={penX + 4} y={capY - 52} a={180} s={0.9} pose="pinch" side="L" skin={ANA.helper.skin} arm={90} sleeve={K.role.helper} />
        <Arrow from={[penX + 34, capY + 10]} to={[penX + 34, capY - 36]} w={6} />
      </Scene2>
    );
  },

  'ilk-yardim-adrenalin-uyluk': () => {
    // Önden: sandalyede oturan kişi. Kalem yere paralel, yandan gelir; turuncu ucu sağ uyluğun
    // DIŞ YAN yüzüne, yüzeye dik bastırılmış.
    const cx = 116, hipY = 140, k = 1.2;
    const p: PersonProps = { ...ANA.victim, x: cx, y: hipY, ay: 'hip', s: 1.25 * k, pose: { view: 'front', armB: { to: [cx - 40 * k, hipY + 4 * k] }, armF: [84, 96], face: 'worried' } };
    const r = rig(p);
    const pc = K.pants.khaki, pd = shade(pc, 0.14);
    // sandalyede önden oturuş: uyluklar izleyiciye doğru (kısa görünür), baldırlar dik iner
    const leg = (sgn: 1 | -1): Sh[] => {
      const h: P = [cx + sgn * 12 * k, hipY - 2 * k], kn: P = [cx + sgn * 19 * k, hipY + 16 * k], a: P = [cx + sgn * 20 * k, hipY + 64 * k];
      return [
        { d: capsule(kn, 11.5 * k, a, 8.5 * k), f: pd },
        { d: capsule(h, 17 * k, kn, 15 * k), f: pc },
      ];
    };
    const shoe = (sgn: 1 | -1): Sh[] => [
      { d: ell([cx + sgn * 21 * k, hipY + 72 * k], 12 * k, 7 * k), f: K.shoe },
    ];
    const thighOut: P = [cx + (12 + 17 + 2) * k, hipY + 6 * k];
    const tip = thighOut;
    const pen = { x: tip[0], y: tip[1], s: 0.7, a: 90, cap: false };
    const grip: P = [tip[0] + 50, tip[1]];
    return (
      <Scene2 bg="indoor" gy={164}>
        <OG sh={[{ d: rrect(cx - 52 * k, hipY - 70 * k, 104 * k, 64 * k, 8), f: '#9b6a45' }, { d: rrect(cx - 56 * k, hipY - 4 * k, 112 * k, 12 * k, 4), f: '#b07a52' }, { d: rrect(cx - 50 * k, hipY + 6 * k, 8 * k, 70 * k, 2), f: '#8a5d3c' }, { d: rrect(cx + 42 * k, hipY + 6 * k, 8 * k, 70 * k, 2), f: '#8a5d3c' }]} />
        <Person {...p} only={['torso', 'head', 'armB', 'armF']} shadow={false} />
        <OG sh={[...leg(-1), ...leg(1)]} />
        <OG sh={[...shoe(-1), ...shoe(1)]} />
        <path d={`M${cx} ${hipY - 4}V${hipY + 10}`} stroke={K.out} stroke-width={1.4} />
        <Ring x={tip[0] - 4} y={tip[1]} rx={13} ry={22} />
        <AutoInj {...pen} />
        <Hand x={grip[0] + 22} y={grip[1] + 22} a={-48} s={0.72} pose="fist" side="R" skin={ANA.helper.skin} arm={220} sleeve={K.role.helper} />
        <Arrow from={[tip[0] + 82, tip[1] - 34]} to={[tip[0] + 14, tip[1] - 34]} w={6} />
        <Timer x={286} y={36} r={17} />
        {void r}
      </Scene2>
    );
  },

  'ilk-yardim-anafilaksi-pozisyon': () => {
    // Sol üst: sırtüstü yatış. Sol alt: nefes darlığında sırtı destekli, bacaklar uzalı oturuş.
    // Sağ: ayağa kalkan kişi yasak.
    const panel = (x: number, y: number, w: number, h: number) => <rect x={x} y={y} width={w} height={h} rx={12} fill="#fff" stroke={K.out} stroke-width={1.5} />;
    const G1 = 104, G2 = 220;
    const lie: PersonProps = { ...ANA.victim, x: 104, y: G1, s: 0.86, pose: { ...POSE.lieBack, face: 'worried' } } as PersonProps;
    const lr = rig(lie);
    const sit: PersonProps = { ...ANA.victim, x: 70, y: G2, s: 0.86, pose: { ...POSE.sitFloor, spine: -78, head: -84, face: 'pain' } };
    const sr = rig(sit);
    return (
      <Scene2 bg="closeup">
        {panel(8, 8, 200, 108)}
        {panel(8, 124, 200, 108)}
        {panel(214, 8, 98, 224)}
        <rect x={9} y={G1} width={198} height={11} fill={K.floor} />
        <rect x={9} y={G2} width={198} height={11} fill={K.floor} />
        <rect x={215} y={G2} width={96} height={11} fill={K.floor} />
        {void lr}
        <Person {...lie} />
        <OG sh={[{ d: rrect(sr.back[0] - 20, G2 - 70, 22, 70, 7), f: '#6e8fb8' }]} />
        <Person {...sit} />
        <Person {...ANA.victim} x={262} y={G2 + 4} s={0.8} pose={{ ...POSE.walk, face: 'pain' }} />
        <Ok x={186} y={30} r={14} />
        <Ok x={186} y={146} r={14} />
        <No x={262} y={140} r={36} />
      </Scene2>
    );
  },

  /* ── Şeker düşmesi ── */
  'ilk-yardim-hipo-belirti': () => {
    const p0: PersonProps = { ...HIP.victim, x: 160, y: 76, ax: 'head', ay: 'head', s: 2.1, pose: { ...POSE.stand, face: 'worried' } };
    const p: PersonProps = { ...p0, pose: { ...p0.pose, armB: [112, 168], armF: [68, 12], handB: { shape: 'mitten', a: 0 }, handF: { shape: 'mitten', a: 0 } } };
    const r = rig(p);
    const sensor: P = mid(r.shoulderB, r.elbowB, 0.45);
    return (
      <Scene2 bg="closeup">
        <Person {...p} />
        <Pale r={r} op={0.3} />
        <Sweat x={r.head[0]} y={r.head[1] - r.headR * 0.55} s={1.5} />
        <circle cx={sensor[0]} cy={sensor[1]} r={9} fill="#fff" stroke={K.out} stroke-width={1.6} />
        <circle cx={sensor[0]} cy={sensor[1]} r={4} fill="#cfd6dd" stroke={K.out} stroke-width={1} />
        <Shake x1={r.handB[0] - 16} x2={r.handB[0] + 16} y={r.handB[1] - 16} h={20} />
        <Shake x1={r.handF[0] - 16} x2={r.handF[0] + 16} y={r.handF[1] - 16} h={20} />
        <text x={r.head[0] + r.headR + 12} y={r.head[1] - r.headR} font-size={30} font-weight={700} fill={K.ink} opacity={0.8}>?</text>
      </Scene2>
    );
  },

  'ilk-yardim-hipo-seker-ver': () => {
    const G = 228;
    const vic: PersonProps = { ...HIP.victim, x: 70, y: G, s: 1.12, pose: { ...POSE.sitChair, armF: [70, -10], face: 'neutral' } };
    const v = rig(vic);
    const give: P = [v.mouth[0] + 66, v.mouth[1] + 36];
    const help: PersonProps = { ...HIP.helper, x: 196, y: G - 2, s: 1.1, flip: true, pose: { ...POSE.standSide, armF: { to: give }, handF: 'none', face: 'neutral' } } as PersonProps;
    const hr = rig(help);
    const gl: P = [hr.wristF[0] - 6, hr.wristF[1] + 18];
    return (
      <Scene2 bg="indoor">
        <Table x={222} y={G} w={94} h={70} />
        <Cube x={244} y={G - 70} s={1.15} />
        <Cube x={260} y={G - 70} s={1.15} />
        <Cube x={252} y={G - 84} s={1.15} />
        <Tabs x={292} y={G - 70} s={0.95} />
        <Chair x={v.hip[0] - 8} y={G} seat={G - v.hip[1] - 5} s={1.1} />
        <Person {...vic} />
        <Person {...help} only={['legB', 'armB', 'torso', 'legF', 'head']} />
        <Glass x={gl[0]} y={gl[1]} s={1} fill={0.8} />
        <Person {...help} only={['armF']} />
        <OG sh={[{ d: capsule(hr.wristF, 5.4, [gl[0] + 9, gl[1] - 22], 5), f: K.skin[2] }, { d: capsule([gl[0] + 4, gl[1] - 30], 4.4, [gl[0] - 10, gl[1] - 30], 3.8), f: K.skin[2] }]} />
        <Arrow from={[gl[0] - 14, gl[1] - 56]} to={[v.mouth[0] + 14, v.mouth[1] - 4]} bend={0.3} w={5} />
        <Inset x={220} y={10} w={92} h={64}>
          {(() => {
            const ip: PersonProps = { ...HIP.victim, x: 266, y: 66, s: 0.5, pose: POSE.lieBack } as PersonProps;
            const ir = rig(ip);
            return (
              <g>
                <rect x={220} y={62} width={92} height={14} fill={K.floor} />
                <Person {...ip} />
                <Cube x={ir.mouth[0] + 2} y={ir.mouth[1] - 3} s={0.75} />
                <No x={262} y={42} r={27} />
              </g>
            );
          })()}
        </Inset>
      </Scene2>
    );
  },

  'ilk-yardim-hipo-15dk': () => (
    <Scene2 bg="closeup">
      <Phone x={118} y={126} s={2.1} text="15:00" call={false} />
      <Glass x={236} y={206} s={1.7} fill={0.45} />
      <Label x={236} y={40} text="15 dk" size={20} />
    </Scene2>
  ),
};

/** Arka planda uzak ev siluetleri (elektrik sahnesi) */
function HouseLike() {
  return (
    <g opacity={0.9}>
      <OG sh={[{ d: rrect(180, 140, 70, 60, 2), f: '#f0dcc0' }, { d: 'M174 142L215 112L256 142Z', f: '#c2583e' }, { d: rrect(196, 156, 16, 16, 1), f: '#bfe3f5', ln: true }]} />
    </g>
  );
}

void Bad; void ell;
