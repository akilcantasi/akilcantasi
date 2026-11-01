// Yaralanma ve hastalık sahneleri (ikinci yarı): saplanan cisim, yara bakımı, donma, güneş,
// sıvı kaybı, ateş, ısırık, kene, ayak bakımı, kramp.
import type { JSX } from 'preact';
import {
  Arrow, Backpack, Bandage, Blanket, Blood, Bottle, Cloth, Drop, Hand, K, Label, No, OG, Ok, Bad, Person, Phone, POSE, Rock,
  Scene2, Sign, Table, Timer, Tree, Waves, Window, capsule, circ, ell, handPoint, rig, rrect, shade, smooth, tint,
} from '../kit2';
import type { HandProps, P, PersonProps } from '../kit2';
import type { ArtFn } from '../registry';

/* ───────────────────────── yardımcılar ───────────────────────── */

type HP = Omit<HandProps, 'children'>;

/** Elin istenen noktası (tip/grip/palm/pinch) hedefe gelecek şekilde bilek konumunu ayarlar. */
function at(h: HP, which: 'tip' | 'grip' | 'palm' | 'pinch', target: P): HP {
  const p = handPoint({ ...h, x: 0, y: 0 }, which);
  return { ...h, x: target[0] - p[0], y: target[1] - p[1] };
}
/** Ayrıntılı elin yerel koordinat dönüşümü (Hand ile aynı). Elin üstüne yerel çizim için. */
function hT(h: HP) {
  const m = (h.side === 'L') !== (h.view === 'palm') ? -1 : 1;
  const s = h.s ?? 1;
  return `translate(${h.x} ${h.y}) rotate(${h.a ?? 0}) scale(${m * s} ${s})`;
}
const rotP = (p: P, a: number): P => {
  const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c];
};
const f = (n: number) => Math.round(n * 10) / 10;
const addP = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];

/** Eldiven / kızarıklık için renk filtresi tanımları */
function Filters() {
  return (
    <defs>
      <filter id="y2-glove" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="0.12 0.14 0.05 0 0  0.22 0.32 0.1 0 0  0.32 0.45 0.3 0 0.02  0 0 0 1 0" />
      </filter>
      <filter id="y2-red" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0.04  0 0.7 0 0 0  0 0 0.68 0 0  0 0 0 1 0" />
      </filter>
    </defs>
  );
}

/** Yatay uyluk yakın planı (sol kenarda şort paçası). y0 üst kenar, y1 alt kenar. */
function Thigh({ y0 = 96, y1 = 206, skin = 1, shorts = '#3f5684' }: { y0?: number; y1?: number; skin?: number; shorts?: string }) {
  const sk = K.skin[skin];
  const d = `M-20 ${y0 - 6}C80 ${y0 - 10} 200 ${y0} 340 ${y0 + 14}V${y1 - 6}C200 ${y1 + 4} 80 ${y1 + 6} -20 ${y1 + 8}Z`;
  return (
    <g>
      <OG sh={[{ d, f: sk }, { d: `M-20 ${y1 - 14}C80 ${y1 - 10} 200 ${y1 - 14} 340 ${y1 - 18}V${y1 - 6}C200 ${y1 + 4} 80 ${y1 + 6} -20 ${y1 + 8}Z`, f: shade(sk, 0.1), no: true }]} />
      <OG sh={[{ d: `M-20 ${y0 - 16}H44Q54 ${(y0 + y1) / 2} 46 ${y1 + 16}H-20Z`, f: shorts }, { d: `M38 ${y0 - 10}Q46 ${(y0 + y1) / 2} 40 ${y1 + 10}`, st: shade(shorts, 0.3), sw: 1.4 }]} />
    </g>
  );
}

/** Saplanmış metal çubuk: base deride, tip dışarıda. */
function Rod({ base, tip, r = 6 }: { base: P; tip: P; r?: number }) {
  return (
    <g>
      <path d={ell([base[0], base[1] + 2], r + 9, 6)} fill={K.blood} opacity={0.9} />
      <path d={`M${base[0] - 4} ${base[1] + 6}q-3 12 1 20`} stroke={K.blood} stroke-width={4} fill="none" stroke-linecap="round" />
      <OG sh={[{ d: capsule(base, r, tip, r * 0.9), f: '#8f9aa6' }, { d: capsule([base[0] + 2, base[1] - 2], 1.8, [tip[0] + 2, tip[1]], 1.6), f: '#d3dae1', no: true }]} />
      <path d={ell([base[0], base[1] + 1], r + 2, 3.5)} fill={shade(K.blood, 0.3)} />
    </g>
  );
}

/** Dairesel ok (küçük, turuncu). c merkez, r yarıçap, a0→a1 derece. */
function CircArrow({ c, r, a0 = -200, a1 = 60, w = 4, color = K.action }: { c: P; r: number; a0?: number; a1?: number; w?: number; color?: string }) {
  const p = (a: number): P => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  const s = p(a0), e = p(a1 - 14);
  const large = Math.abs(a1 - 14 - a0) > 180 ? 1 : 0;
  const tip = p(a1);
  const tang = a1 + 90;
  const hl = w * 2.2 + 3;
  const base = addP(tip, rotP([-hl, 0], tang));
  const l = addP(base, rotP([0, hl * 0.6], tang)), rr = addP(base, rotP([0, -hl * 0.6], tang));
  const d = `M${s[0]} ${s[1]}A${r} ${r} 0 ${large} 1 ${e[0]} ${e[1]}`;
  const hp = `M${tip[0]} ${tip[1]}L${l[0]} ${l[1]}L${rr[0]} ${rr[1]}Z`;
  return (
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d={d} fill="none" stroke={K.out} stroke-width={w + 3} />
      <path d={hp} fill={K.out} stroke={K.out} stroke-width={3} />
      <path d={d} fill="none" stroke={color} stroke-width={w} />
      <path d={hp} fill={color} />
    </g>
  );
}

/** Uyarı üçgeni (kırmızı kenarlı, ünlem) */
function Warn({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -16L15 11H-15Z" fill="#fff" stroke={K.danger} stroke-width={4} stroke-linejoin="round" />
      <path d="M0 -6V3" stroke={K.ink} stroke-width={3.2} stroke-linecap="round" />
      <circle cx={0} cy={7.5} r={1.9} fill={K.ink} />
    </g>
  );
}

/** Sabun kalıbı (taban ortası) */
function Soap({ x, y, s = 1, color = '#f2b8c6' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[{ d: rrect(-22, -16, 44, 16, 7), f: color }, { d: rrect(-22, -16, 44, 6, 5), f: tint(color, 0.35), no: true }]} />
      {[[-10, -22, 4], [-2, -26, 3], [6, -21, 3.5]].map(([bx, by, br], i) => (
        <circle key={i} cx={bx} cy={by} r={br} fill="#fff" stroke={K.waterLight} stroke-width={1.2} />
      ))}
    </g>
  );
}

/** Köpük kümesi */
function Foam({ x, y, w = 40, s = 1 }: { x: number; y: number; w?: number; s?: number }) {
  const n = Math.max(3, Math.round(w / 9));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const bx = x - w / 2 + (w / (n - 1)) * i;
        const by = y + ((i * 37) % 7) - 3;
        const r = (4 + ((i * 13) % 4)) * s;
        return <circle key={i} cx={bx} cy={by} r={r} fill="#fff" stroke="#b8d6e8" stroke-width={1.2} />;
      })}
    </g>
  );
}

/** Dijital termometre ekranı (alından ölçen). x,y = ekran ortası */
function ThermoGun({ x, y, s = 1, text }: { x: number; y: number; s?: number; text: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(18, -2, 22, 58, 9), f: '#e8ecf0' },
        { d: rrect(-50, -20, 92, 36, 14), f: '#f6f8fa' },
        { d: rrect(-62, -12, 16, 20, 5), f: '#9fb3c4' },
      ]} />
      <rect x={-38} y={-14} width={58} height={24} rx={4} fill="#26364a" />
      <text x={-9} y={3.5} text-anchor="middle" font-size={13} font-weight={700} fill="#ffd54a" font-family="'IBM Plex Sans', system-ui, sans-serif">{text}</text>
    </g>
  );
}

/** Basit dijital çubuk termometre (MERKEZ) */
function ThermoStick({ x, y, s = 1, a = 0, text }: { x: number; y: number; s?: number; a?: number; text: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: 'M-12 -46Q-12 -52 -6 -52H6Q12 -52 12 -46V22L4 44Q0 50 -4 44L-12 22Z', f: '#f6f8fa' },
        { d: capsule([0, 40], 3, [0, 54], 2.4), f: '#a9b4bf' },
        { d: circ([0, 12], 4), f: K.water, ln: true },
      ]} />
      <rect x={-9} y={-44} width={18} height={44} rx={3} fill="#26364a" />
      <text transform="rotate(-90)" x={22} y={4.5} text-anchor="middle" font-size={12} font-weight={700} fill="#ffd54a" font-family="'IBM Plex Sans', system-ui, sans-serif">{text}</text>
    </g>
  );
}

/** Kene (yandan). head = ağız parçalarının deriye girdiği nokta, a = gövde yönü (deriden yukarı) */
function Tick({ head, a = -60, s = 1 }: { head: P; a?: number; s?: number }) {
  return (
    <g transform={`translate(${head[0]} ${head[1]}) rotate(${a + 90}) scale(${s})`}>
      <g stroke={K.out} stroke-width={2.6 / s} stroke-linecap="round" fill="none">
        <path d="M-8 -20l-14 -2l-6 8M-9 -28l-16 -6l-6 6M8 -20l14 -2l6 8M9 -28l16 -6l6 6M-7 -36l-12 -10M7 -36l12 -10" />
      </g>
      <OG ow={1.5 / s} sh={[
        { d: capsule([0, -2], 2.2, [0, -10], 3.2), f: '#6b4a32' },
        { d: ell([0, -14], 7, 6), f: '#5a3c28' },
        { d: ell([0, -32], 13, 18), f: '#7a4a2c' },
        { d: ell([0, -26], 9, 9), f: '#3d2a1e', no: true },
      ]} />
    </g>
  );
}

/** Cımbız: tip = uçların buluştuğu nokta, a = uçtan sapa doğru yön (derece) */
function Tweezers({ tip, a = -60, len = 150, open = 2 }: { tip: P; a?: number; len?: number; open?: number }) {
  return (
    <g transform={`translate(${tip[0]} ${tip[1]}) rotate(${a})`}>
      <OG sh={[
        { d: `M0 ${-open - 1.5}L${len} ${-9}L${len} ${-2}L2 ${-open + 1}Z`, f: '#b9c3cc' },
        { d: `M0 ${open + 1.5}L${len} 9L${len} 2L2 ${open - 1}Z`, f: '#98a3ae' },
        { d: rrect(len - 34, -11, 34, 22, 4), f: '#a8b2bc' },
      ]} />
    </g>
  );
}

/** Yandan ayak (sağa bakar, topuk solda). x,y = topuğun alt arka noktası, s ölçek */
function FootSide({ x, y, s = 1, skin = 1 }: { x: number; y: number; s?: number; skin?: number }) {
  const sk = K.skin[skin];
  const pts: P[] = [[10, -240], [62, -240], [64, -120], [76, -70], [120, -52], [175, -32], [196, -20], [198, -6], [182, 0], [90, -4], [60, 0], [14, 0], [-4, -22], [-4, -60], [6, -110]];
  const d = smooth(pts.map(([px, py]) => [x + px * s, y + py * s] as P), true, 0.9);
  const toe = (tx: number, ty: number, r: number) => ({ d: circ([x + tx * s, y + ty * s], r * s), f: sk });
  return (
    <g>
      <OG sh={[{ d, f: sk }, toe(186, -14, 10), { d: smooth([[x + 30 * s, y - 2 * s], [x + 100 * s, y - 8 * s], [x + 180 * s, y - 4 * s]]), st: shade(sk, 0.25), sw: 1.2 }]} />
      <path d={`M${x + 50 * s} ${y - 110 * s}Q${x + 44 * s} ${y - 82 * s} ${x + 56 * s} ${y - 70 * s}`} fill="none" stroke={shade(sk, 0.2)} stroke-width={1.4} />
      <circle cx={x + 52 * s} cy={y - 76 * s} r={6 * s} fill={shade(sk, 0.1)} />
    </g>
  );
}

/** Yukarıdan ayak (parmaklar yukarı). x,y = topuk altı, s ölçek */
function FootTop({ x, y, s = 1, skin = 1, wet }: { x: number; y: number; s?: number; skin?: number; wet?: boolean }) {
  const sk = K.skin[skin];
  const P_ = (px: number, py: number): P => [x + px * s, y + py * s];
  const body = smooth([P_(0, 0), P_(-30, -20), P_(-36, -80), P_(-40, -140), P_(-44, -168), P_(-20, -184), P_(20, -180), P_(44, -160), P_(38, -110), P_(28, -40), P_(24, -10)], true, 0.9);
  const toes: [number, number, number, number][] = [[-30, -192, 13, 16], [-4, -200, 9, 11], [14, -196, 8, 10], [29, -186, 7, 9], [41, -172, 6, 8]];
  return (
    <g>
      <OG sh={[{ d: body, f: sk }, ...toes.map(([tx, ty, rx, ry]) => ({ d: ell(P_(tx, ty), rx * s, ry * s), f: sk })), { d: smooth([P_(-14, -60), P_(-20, -120), P_(-24, -160)]), st: shade(sk, 0.15), sw: 1.2 }]} />
      {toes.map(([tx, ty, rx, ry], i) => (
        <path key={i} d={ell(P_(tx, ty - ry * 0.35), rx * 0.55 * s, ry * 0.38 * s)} fill={tint(sk, 0.45)} />
      ))}
      {wet && [[-10, -100], [16, -60], [-20, -150], [20, -130]].map(([dx, dy], i) => <Drop key={i} x={x + dx * s} y={y + dy * s} s={0.55} color={K.waterLight} />)}
    </g>
  );
}

/** Yandan baldır/alt bacak yakın planı: diz solda, ayak bileği sağda */
function Calf({ skin = 2 }: { skin?: number }) {
  const sk = K.skin[skin];
  const d = smooth([[-20, 70], [80, 64], [170, 80], [260, 104], [340, 112], [340, 150], [250, 156], [170, 182], [90, 196], [-20, 180]], true, 0.8);
  return (
    <g>
      <OG sh={[{ d: `M-20 70L340 112V150L-20 180Z`, f: sk, no: true }, { d, f: sk }, { d: smooth([[30, 186], [110, 190], [180, 176], [260, 152]]), st: shade(sk, 0.18), sw: 1.4 }]} />
      <OG sh={[{ d: `M-20 56H34Q44 125 34 196H-20Z`, f: K.pants.navy }]} />
    </g>
  );
}

/* ───────────────────────── oyuncular (rehber başına sabit) ───────────────────────── */

type Cast = Omit<PersonProps, 'x' | 'y' | 'pose'>;
/** Kişinin kol/giysi rengi (yakın plan ellerin manşeti için) */
const sleeveOf = (c: Cast) => c.top ?? K.role[c.role ?? 'victim'];
const skinOf = (c: Cast) => c.skin ?? 1;

/** Saplanan cisim: şortlu açık tenli adam (uyluğunda çubuk) + uzun saçlı yardımcı kadın */
const SAP = {
  victim: { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown, bottom: 'shorts', bottomC: '#3f5684' },
  helper: { who: 'woman', role: 'helper', skin: 1, hair: 'long', hairC: K.hair.dark, bottomC: K.pants.dark },
} satisfies Record<string, Cast>;
/** Yara temizliği: dizi sıyrılmış çocuk + esmer yardımcı adam */
const YARA = {
  victim: { who: 'boy', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.black, bottom: 'shorts', bottomC: K.pants.khaki },
  helper: { who: 'man', role: 'helper', skin: 2, hair: 'short', hairC: K.hair.black, bottomC: K.pants.denim },
} satisfies Record<string, Cast>;
/** Soğuk ısırığı: açık tenli kadın (mavi mont) + yardımcı adam */
const DON = {
  victim: { who: 'woman', role: 'victim', skin: 0, hair: 'bun', hairC: K.hair.dark, sleeve: 'long', bottomC: K.pants.dark },
  helper: { who: 'man', role: 'helper', skin: 1, hair: 'short', hairC: K.hair.black, sleeve: 'long', bottomC: K.pants.denim },
} satisfies Record<string, Cast>;
/** Güneş yanığı: omuzları kızarmış şortlu adam + topuzlu yardımcı kadın */
const GUN = {
  victim: { who: 'man', role: 'victim', top: '#f2a088', sleeve: 'none', skin: 0, hair: 'short', hairC: K.hair.black, bottom: 'shorts', bottomC: '#2f8cc0' },
  helper: { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.brown, bottomC: K.pants.dark },
} satisfies Record<string, Cast>;
/** İshal: yaşlı adam + yardımcı kadın */
const ISH = {
  victim: { who: 'oldman', role: 'victim', glasses: false },
  helper: { who: 'woman', role: 'helper', skin: 1, hair: 'bun', hairC: K.hair.black, bottomC: K.pants.dark },
} satisfies Record<string, Cast>;
/** Yüksek ateş: kız çocuk (hardal tişört) + başörtülü esmer anne */
const ATS = {
  victim: { who: 'girl', role: 'bystander2', skin: 1, hair: 'ponytail', hairC: K.hair.dark },
  helper: { who: 'woman', role: 'helper', skin: 2, hair: 'scarf', hairC: '#6a8fb0', bottomC: K.pants.dark },
} satisfies Record<string, Cast>;
/** Kuduz: köpek ısırmış, at kuyruklu esmer kadın (kiremit üst) */
const KUD = {
  victim: { who: 'woman', role: 'bystander4', skin: 2, hair: 'ponytail', hairC: K.hair.black, bottomC: K.pants.dark },
} satisfies Record<string, Cast>;
/** Kene: açık renkli kapalı giysili yürüyüşçü adam (kendi çıkarıyor) */
const KEN = {
  victim: { who: 'man', top: '#ece6d6', sleeve: 'long', skin: 1, hair: 'short', hairC: K.hair.brown, bottomC: '#d8d0bc' },
} satisfies Record<string, Cast>;
/** Su toplama: at kuyruklu yürüyüşçü kadın (yeşil üst, haki pantolon), kendi bakıyor */
const SU = {
  victim: { who: 'woman', role: 'bystander3', skin: 1, hair: 'ponytail', hairC: K.hair.dark, bottomC: K.pants.khaki },
} satisfies Record<string, Cast>;
/** Kramp/zorlanma: şortlu esmer adam (mavi tişört), kendi uyguluyor */
const KRA = {
  victim: { who: 'man', role: 'victim', skin: 2, hair: 'short', hairC: K.hair.black, bottom: 'shorts', bottomC: K.pants.navy },
} satisfies Record<string, Cast>;

/* ───────────────────────── rehbere özel ortak sahne kalıpları ───────────────────────── */

/** Musluk (sol kenardan gelen boru, ağız x,y) ve akan su */
function Tap({ x, y, flowTo }: { x: number; y: number; flowTo: number }) {
  const m = '#b7c1cb';
  return (
    <g>
      <path d={`M${x - 7} ${y}Q${x - 8} ${(y + flowTo) / 2} ${x - 10} ${flowTo}H${x + 10}Q${x + 8} ${(y + flowTo) / 2} ${x + 7} ${y}Z`} fill={K.waterLight} stroke={K.out} stroke-width={1.3} opacity={0.95} />
      <path d={`M${x - 2} ${y + 8}V${flowTo - 8}`} stroke="#fff" stroke-width={2} opacity={0.8} stroke-linecap="round" />
      <OG sh={[
        { d: `M-20 ${y - 46}H${x - 50}V${y - 28}H-20Z`, f: m },
        { d: `M${x - 56} ${y - 46}H${x - 6}Q${x + 12} ${y - 46} ${x + 12} ${y - 28}V${y}H${x - 12}V${y - 22}H${x - 56}Z`, f: m },
        { d: rrect(x - 15, y - 6, 30, 8, 2), f: shade(m, 0.15) },
        { d: rrect(x - 42, y - 64, 16, 20, 3), f: shade(m, 0.1) },
      ]} />
    </g>
  );
}

/** Sabunlu el yıkama: ellerin sahibi c (manşet rengi ve ten aynı) */
function WashScene({ c }: { c: Cast }) {
  const foam = [[150, 150, 9], [168, 142, 11], [184, 156, 8], [140, 168, 8], [176, 172, 10], [160, 186, 7], [196, 140, 7], [128, 150, 6]];
  return (
    <Scene2 bg="closeup">
      <Tap x={166} y={66} flowTo={150} />
      <Hand x={98} y={226} a={50} s={1.25} pose="press" side="L" arm={140} sleeve={sleeveOf(c)} skin={skinOf(c)} />
      <Hand x={234} y={226} a={-50} s={1.25} pose="press" side="R" arm={140} sleeve={sleeveOf(c)} skin={skinOf(c)} />
      {foam.map(([fx, fy, r], i) => <circle key={i} cx={fx} cy={fy} r={r} fill="#fff" stroke="#b9c7d4" stroke-width={1.2} />)}
      <Drop x={120} y={200} s={0.8} />
      <Drop x={210} y={204} s={0.7} />
      <Timer x={244} y={42} r={15} text="20 sn" />
    </Scene2>
  );
}

/** 112'yi arayan el (arayan kişinin manşeti ve teni) */
function CallScene({ c }: { c: Cast }) {
  const h = { x: 150, y: 240, a: 8, s: 1.55, pose: 'hold' as const, side: 'R' as const, grip: 38 };
  const g = handPoint(h, 'grip');
  return (
    <Scene2 bg="closeup">
      <circle cx={60} cy={60} r={30} fill="#d6dde5" />
      <circle cx={268} cy={170} r={40} fill="#d6dde5" />
      <Hand {...h} arm={40} sleeve={sleeveOf(c)} skin={skinOf(c)}>
        <Phone x={g[0]} y={g[1]} s={1.55} a={8} text="112" />
      </Hand>
      <Waves x={g[0] + 46} y={g[1] - 40} a={-20} n={3} r={9} />
    </Scene2>
  );
}

/** Kızılay hilalli sağlık çadırı (taban ortası) */
function Clinic({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const c = '#f4f1ea';
  const r = 11 * s, cx = x - 6 * s, cy = y - 60 * s;
  const px = cx + 0.689 * r, py = 0.7245 * r;
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <OG ow={1.5 / s} sh={[
          { d: 'M-60 0V-46L-40 -76H40L60 -46V0Z', f: c },
          { d: 'M40 -76L60 -46V0H40Z', f: shade(c, 0.12), no: true },
          { d: 'M-60 -46H60', st: K.out, sw: 1.4 },
          { d: 'M-14 0V-34Q0 -42 14 -34V0Z', f: '#5a5f6b' },
        ]} />
      </g>
      <OG sh={[{ d: `M${px} ${cy - py}A${r} ${r} 0 1 0 ${px} ${cy + py}A${0.8 * r} ${0.8 * r} 0 1 1 ${px} ${cy - py}Z`, f: K.red }]} />
    </g>
  );
}

/** Sağlık kuruluşuna gitme: hasta (v) yürüyor; yardımcı (h) varsa sırtından destekliyor ya da (child) çocuğun elinden tutuyor. */
function GoClinicScene({ v, h, child, vFace = 'worried' }: { v: Cast; h?: Cast; child?: boolean; vFace?: PersonProps['face'] }) {
  if (h && child) {
    const hand: P = [150, 150];
    const mom: PersonProps = { ...h, x: 112, y: 222, s: 1.12, pose: { ...POSE.walk, armF: { to: hand }, face: 'neutral' } };
    const kid: PersonProps = { ...v, x: 176, y: 222, s: 1.15, pose: { ...POSE.walk, armB: { to: hand }, face: vFace } };
    return (
      <Scene2 bg="outdoor">
        <Clinic x={262} y={206} s={1.05} />
        <Person {...mom} />
        <Person {...kid} />
        <Arrow from={[196, 96]} to={[232, 96]} w={5} />
      </Scene2>
    );
  }
  const pat: PersonProps = { ...v, x: 132, y: 222, s: 1.08, pose: { ...POSE.walk, spine: -84, chest: -82, head: -82, face: vFace } };
  if (!h) {
    return (
      <Scene2 bg="outdoor">
        <Clinic x={252} y={206} s={1.1} />
        <Person {...pat} />
        <Arrow from={[166, 100]} to={[200, 100]} w={5} />
      </Scene2>
    );
  }
  const pr = rig(pat);
  const hp: PersonProps = { ...h, x: 98, y: 224, s: 1.08, pose: { ...POSE.walk, armF: { to: [pr.back[0] + 2, pr.back[1] - 4] }, face: 'neutral' } };
  return (
    <Scene2 bg="outdoor">
      <Clinic x={256} y={206} s={1.1} />
      <Person {...hp} only={['legB', 'armB', 'legF', 'torso', 'head']} />
      <Person {...pat} />
      <Person {...hp} only={['armF']} />
      <Arrow from={[168, 100]} to={[204, 100]} w={5} />
    </Scene2>
  );
}

/** Önden, bardaktan küçük yudumlarla su içen kişi */
function DrinkScene({ c, face = 'neutral' }: { c: Cast; face?: PersonProps['face'] }) {
  const p: PersonProps = { ...c, x: 132, y: 196, ay: 'hip', s: 1.8, pose: { ...POSE.stand, face } };
  const r = rig(p);
  const rim: P = [r.mouth[0] + 4, r.mouth[1] + 2];
  const ga = 18, gw = 30, gh = 44, fill = 0.55;
  const pp: PersonProps = { ...p, pose: { ...p.pose, armF: { to: [rim[0] + 22, rim[1] + 40], bend: 1 }, armB: [96, 10], handF: 'mitten' } };
  return (
    <Scene2 bg="indoor">
      <Window x={236} y={30} />
      <Person {...pp} />
      <g transform={`translate(${rim[0]} ${rim[1]}) rotate(${-ga})`}>
        <path d={`M${-gw / 2} 0H${gw / 2}L${gw / 2 - 3} ${gh}H${-gw / 2 + 3}Z`} fill="#eef8fd" fill-opacity={0.85} />
        <path d={`M${-gw / 2 + 0.6} ${gh * (1 - fill)}H${gw / 2 - 0.6}L${gw / 2 - 3} ${gh}H${-gw / 2 + 3}Z`} fill={K.water} opacity={0.75} />
        <path d={`M${-gw / 2 + 0.6} ${gh * (1 - fill)}H${gw / 2 - 0.6}`} stroke="#fff" stroke-width={1.6} opacity={0.9} />
        <path d={`M${-gw / 2} 0H${gw / 2}L${gw / 2 - 3} ${gh}H${-gw / 2 + 3}Z`} fill="none" stroke={K.out} stroke-width={2} stroke-linejoin="round" />
        <path d={`M${-gw / 2 + 5} 5V${gh - 6}`} stroke="#fff" stroke-width={3} opacity={0.85} stroke-linecap="round" />
        <path d={capsule([gw / 2 + 3, gh * 0.62], 5, [gw / 2 - 6, gh * 0.4], 4.4)} fill={K.skin[skinOf(c)]} stroke={K.out} stroke-width={1.5} />
      </g>
      <Table x={10} y={260} w={300} h={70} />
      <g transform="translate(10 22)"><OG sh={[{ d: 'M236 170H268L272 152Q262 146 270 142H240Q236 150 236 170Z', f: '#e2f2fa' }, { d: 'M238 170H266L268 160H238Z', f: K.waterLight, no: true }, { d: 'M268 150Q284 152 278 164L270 166', st: K.out, sw: 3 }]} /></g>
      <Arrow from={[rim[0] + 42, rim[1] + 10]} to={[rim[0] + 14, rim[1] - 10]} bend={0.4} w={3.5} />
    </Scene2>
  );
}

/** Yara temizliği: bükülü diz yakın planı (sol kenarda şort), dizde sıyrık. Sıyrık merkezi WOUND. */
const WOUND: P = [186, 118];
function Knee({ skin = 1, shorts = K.pants.khaki, wound = true }: { skin?: number; shorts?: string; wound?: boolean }) {
  const sk = K.skin[skin];
  const leg = smooth([[-20, 90], [100, 86], [168, 92], [200, 120], [214, 170], [232, 250], [150, 250], [140, 190], [120, 160], [60, 158], [-20, 160]], true, 0.8);
  return (
    <g>
      <OG sh={[{ d: leg, f: sk }, { d: `M-20 70H40Q50 125 40 172H-20Z`, f: shorts }]} />
      {wound && (
        <g>
          <path d={smooth([[176, 104], [196, 112], [200, 130], [184, 132], [172, 118]], true)} fill="#d9645a" stroke={shade('#d9645a', 0.3)} stroke-width={1} />
          <path d="M178 112l8 4M182 122l10 2M176 118l6 6" stroke="#a83a33" stroke-width={1.6} stroke-linecap="round" />
        </g>
      )}
    </g>
  );
}

/** Kanepe (taban sol x, zemin y) */
function Sofa({ x, y, w = 260, color = '#7d8fb3' }: { x: number; y: number; w?: number; color?: string }) {
  const sd = shade(color, 0.16);
  return (
    <OG sh={[
      { d: rrect(x + 16, y - 14, 8, 14, 2), f: K.wood },
      { d: rrect(x + w - 24, y - 14, 8, 14, 2), f: K.wood },
      { d: rrect(x + 14, y - 100, w - 28, 62, 12), f: sd },
      { d: rrect(x + 10, y - 50, w - 20, 38, 7), f: color },
      { d: `M${x + 14} ${y - 38}H${x + w - 14}`, st: shade(color, 0.28), sw: 1.4 },
      { d: rrect(x, y - 70, 30, 58, 10), f: tint(color, 0.08) },
      { d: rrect(x + w - 30, y - 70, 30, 58, 10), f: tint(color, 0.08) },
    ]} />
  );
}
function Pillow({ x, y, w = 54, h = 18, color = '#f4f1ea' }: { x: number; y: number; w?: number; h?: number; color?: string }) {
  return <OG sh={[{ d: rrect(x - w / 2, y - h / 2, w, h, h / 2.2), f: color }, { d: `M${x - w / 2 + 8} ${y + 1}H${x + w / 2 - 8}`, st: shade(color, 0.12), sw: 1.1 }]} />;
}
/** Beze sarılı buz paketi (merkez) */
function IcePack({ x, y, w = 70, h = 34, a = 0 }: { x: number; y: number; w?: number; h?: number; a?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <OG sh={[
        { d: rrect(-w / 2 + 6, -h / 2 - 5, w - 12, h, 5), f: '#9dd5f6' },
        { d: `M${-w / 2} ${-h / 2 + 3}Q${-w / 4} ${-h / 2 - 1} 0 ${-h / 2 + 2}T${w / 2} ${-h / 2 + 2}V${h / 2 - 1}Q${w / 4} ${h / 2 + 3} 0 ${h / 2}T${-w / 2} ${h / 2}Z`, f: K.cloth },
        { d: `M${-w / 2 + 4} ${h / 6}H${w / 2 - 4}`, st: shade(K.cloth, 0.14), sw: 1.2 },
      ]} />
      <g stroke={K.water} stroke-width={2} stroke-linecap="round">
        <path d="M0 -8V6M-6 -4.5L6 2.5M6 -4.5L-6 2.5" />
      </g>
    </g>
  );
}

/* ───────────────────────── sahneler ───────────────────────── */

const ROD_BASE: P = [176, 146];
const ROD_TIP: P = [214, 54];

export const SCENES: Record<string, ArtFn> = {
  /* ── Saplanan cisim ── */
  'yaralanma-saplanan-cikarma-yasak': () => {
    const g: P = [204, 80];
    const h = at({ x: 0, y: 0, a: 112, s: 1.05, pose: 'fist', side: 'R', skin: skinOf(SAP.helper), arm: 200, sleeve: sleeveOf(SAP.helper) }, 'grip', g);
    return (
      <Scene2 bg="closeup">
        <Thigh skin={skinOf(SAP.victim)} shorts={SAP.victim.bottomC} />
        <Rod base={ROD_BASE} tip={ROD_TIP} />
        <Hand {...h} />
        <Arrow from={[222, 40]} to={[236, 8]} color={K.danger} w={6} />
        <No x={198} y={96} r={62} />
      </Scene2>
    );
  },

  'yaralanma-saplanan-iki-yandan': () => {
    const hl = at({ x: 0, y: 0, a: 160, s: 0.95, pose: 'press', side: 'L', skin: skinOf(SAP.helper), arm: 200, sleeve: sleeveOf(SAP.helper) }, 'tip', [136, 152]);
    const hr = at({ x: 0, y: 0, a: 200, s: 0.95, pose: 'press', side: 'R', skin: skinOf(SAP.helper), arm: 200, sleeve: sleeveOf(SAP.helper) }, 'tip', [218, 152]);
    return (
      <Scene2 bg="closeup">
        <Thigh skin={skinOf(SAP.victim)} shorts={SAP.victim.bottomC} />
        <Cloth x={126} y={150} w={50} h={32} a={-4} />
        <Cloth x={228} y={152} w={50} h={32} a={4} />
        <Rod base={ROD_BASE} tip={[180, 40]} />
        <Hand {...hl} />
        <Hand {...hr} />
        <Arrow from={[70, 40]} to={[86, 88]} w={6} />
        <Arrow from={[284, 40]} to={[268, 88]} w={6} />
      </Scene2>
    );
  },

  'yaralanma-saplanan-sabitleme': () => {
    const roll = (x0: number, x1: number) => (
      <OG sh={[{ d: rrect(x0, 130, x1 - x0, 32, 15), f: K.cloth }, { d: `M${x0 + 10} 140H${x1 - 10}M${x0 + 10} 152H${x1 - 10}`, st: shade(K.cloth, 0.18), sw: 1.4 }, { d: ell([x1 - 16, 146], 9, 14), f: shade(K.cloth, 0.06), ln: true }]} />
    );
    const band = (x: number, w: number) => (
      <OG sh={[{ d: `M${x} 86L${x + w} 90L${x + w + 8} 218L${x + 8} 214Z`, f: '#f7f4ee' }, { d: `M${x + 3} 120L${x + w + 3} 124M${x + 5} 160L${x + w + 5} 164`, st: shade(K.cloth, 0.12), sw: 1.2 }]} />
    );
    return (
      <Scene2 bg="closeup">
        <Thigh skin={skinOf(SAP.victim)} shorts={SAP.victim.bottomC} />
        <Rod base={ROD_BASE} tip={[182, 40]} />
        {roll(84, 164)}
        {roll(188, 268)}
        {band(104, 30)}
        {band(220, 30)}
        <Ok x={276} y={40} r={16} />
      </Scene2>
    );
  },

  'yaralanma-saplanan-ortme': () => {
    // Yakın plan: sırtüstü yatan, bilinci açık yaralı (baş solda); uyluğundaki kısa çubuk rulo bezlerle sabit.
    // Battaniye göğüsten kalçaya kadar; bacak ve çubuk açıkta. Yardımcı başın arkasında diz çökmüş,
    // elleri dizlerinde, konuşuyor. Ayaklar çerçeve dışında.
    const S = 1.62;
    const victim: PersonProps = { ...SAP.victim, x: 210, y: 230, s: S, pose: { ...POSE.lieBack, face: 'pain', armF: [6, -24], armB: [2, -20] } };
    const v = rig(victim);
    const fl = 230;
    const t = 0.55;
    const base: P = [v.hipF[0] + (v.kneeF[0] - v.hipF[0]) * t, v.hipF[1] + (v.kneeF[1] - v.hipF[1]) * t - 6 * S];
    const sx = v.shoulderF[0] + 4 * S;
    const ty = v.chest[1] - 3 * S;
    const x1 = v.hip[0] + 13 * S;
    const BL = '#c1554b';
    const blanket = `M${sx - 3} ${fl}Q${sx - 6} ${ty + 6} ${sx} ${ty + 1}Q${(sx + x1) / 2} ${ty - 3} ${x1 - 4} ${ty + 3}Q${x1 + 6} ${ty + 10} ${x1 + 5} ${fl}Z`;
    const helper: PersonProps = {
      ...SAP.helper, x: v.head[0] - 52 * S, y: 232, s: S,
      pose: { ...POSE.kneelSit, spine: -78, chest: -64, head: -48, legB: [8, 180], legF: [4, 178], armF: [96, 24], armB: [92, 28], face: 'speak' },
    };
    const hr = rig(helper);
    return (
      <Scene2 bg="indoor" gy={150}>
        <Person {...helper} />
        <Person {...victim} />
        <OG sh={[{ d: blanket, f: BL }, { d: `M${f(v.chest[0] + 6 * S)} ${f(ty + 4)}l3 ${f(fl - ty - 8)}`, st: shade(BL, 0.25), sw: 1.8 }]} />
        <OG sh={[{ d: rrect(sx - 3, ty - 3, 13 * S, fl - ty + 2, 6), f: tint(BL, 0.18) }]} />
        <OG sh={[{ d: rrect(base[0] - 30, base[1] - 4, 20, 12, 5), f: K.cloth }, { d: rrect(base[0] + 10, base[1] - 4, 20, 12, 5), f: K.cloth }]} />
        <OG sh={[{ d: capsule(base, 3.4, [base[0] + 4, base[1] - 36], 3.1), f: '#8f9aa6' }]} />
        <path d={ell([base[0], base[1] + 1], 7, 3)} fill={K.blood} />
        <Waves x={hr.mouth[0] + 10} y={hr.mouth[1] + 2} a={20} n={2} r={6} />
      </Scene2>
    );
  },

  /* ── Yara temizliği ── */
  'yaralanma-yara-el-yikama': () => <WashScene c={YARA.helper} />,

  'yaralanma-yara-bastirma': () => {
    const h = at({ x: 0, y: 0, a: 214, s: 1.0, pose: 'press', side: 'R', skin: skinOf(YARA.helper), arm: 220, sleeve: sleeveOf(YARA.helper) }, 'palm', [WOUND[0] + 4, WOUND[1] + 2]);
    return (
      <Scene2 bg="closeup">
        <Knee skin={skinOf(YARA.victim)} shorts={YARA.victim.bottomC} />
        <path d="M200 140q4 14 0 26" stroke={K.blood} stroke-width={4} fill="none" stroke-linecap="round" />
        <Cloth x={WOUND[0] + 2} y={WOUND[1] + 2} w={62} h={40} a={58} />
        <Hand {...h} />
        <Arrow from={[120, 30]} to={[150, 84]} w={6} />
      </Scene2>
    );
  },

  'yaralanma-yara-yikama': () => {
    const A = -122;
    const h = at({ x: 0, y: 0, a: A, s: 1.1, pose: 'hold', side: 'R', grip: 30, skin: skinOf(YARA.helper), arm: 200, sleeve: sleeveOf(YARA.helper) }, 'grip', [258, 60]);
    const g = handPoint(h, 'grip');
    const base = addP(g, rotP([0, 26 * 1.1], A));
    const mouth = addP(base, rotP([0, -48 * 1.1], A));
    return (
      <Scene2 bg="closeup">
        <Knee skin={skinOf(YARA.victim)} shorts={YARA.victim.bottomC} />
        <path d={`M${mouth[0]} ${mouth[1]}Q${mouth[0] - 18} ${mouth[1] + 10} 192 112L196 130Q204 170 208 236`} fill="none" stroke={K.water} stroke-width={7} stroke-linecap="round" opacity={0.85} />
        <path d="M200 140Q206 180 210 236" fill="none" stroke={K.waterLight} stroke-width={2} />
        <Drop x={224} y={226} s={0.9} />
        <Drop x={240} y={212} s={0.7} />
        <Hand {...h}>
          <Bottle x={base[0]} y={base[1]} s={1.1} a={A} fill={0.55} />
        </Hand>
        <Soap x={70} y={218} s={1.2} />
      </Scene2>
    );
  },

  'yaralanma-yara-bandi': () => {
    const ang = 62;
    const e1 = addP(WOUND, rotP([-34, 0], ang)), e2 = addP(WOUND, rotP([34, 0], ang));
    const hl = at({ x: 0, y: 0, a: 236, s: 0.8, pose: 'press', side: 'R', skin: skinOf(YARA.helper), arm: 220, sleeve: sleeveOf(YARA.helper) }, 'tip', e2);
    const hr = at({ x: 0, y: 0, a: 222, s: 0.8, pose: 'press', side: 'R', skin: skinOf(YARA.helper), arm: 220, sleeve: sleeveOf(YARA.helper) }, 'tip', e1);
    return (
      <Scene2 bg="closeup">
        <Knee skin={skinOf(YARA.victim)} shorts={YARA.victim.bottomC} wound={false} />
        <g transform={`translate(${WOUND[0]} ${WOUND[1]}) rotate(${ang})`}>
          <OG sh={[{ d: rrect(-40, -15, 80, 30, 12), f: '#e3b788' }, { d: rrect(-14, -11, 28, 22, 4), f: '#f7f1e6', ln: true }]} />
          <g fill={shade('#e3b788', 0.2)}>
            {[-32, -24, 24, 32].map((dx) => [-6, 6].map((dy) => <circle key={dx + '-' + dy} cx={dx} cy={dy} r={1.2} />))}
          </g>
        </g>
        <Hand {...hl} />
        <Hand {...hr} />
        <g transform="translate(70 218) rotate(-8)">
          <OG sh={[{ d: rrect(-34, -20, 68, 26, 3), f: '#f4f6f8' }, { d: 'M-34 -20L-20 -36L18 -32L34 -20Z', f: '#dde3ea' }, { d: rrect(-8, -14, 16, 14, 2), f: '#fff', ln: true }]} />
          <path d="M-3 -7h6M0 -10v6" stroke={K.danger} stroke-width={2} />
        </g>
      </Scene2>
    );
  },

  'yaralanma-yara-saglik': () => <GoClinicScene v={YARA.victim} h={YARA.helper} />,

  'yaralanma-yara-enfeksiyon': () => {
    const sk = K.skin[1];
    const panel = (x: number) => <OG sh={[{ d: rrect(x, 36, 136, 164, 14), f: sk }]} />;
    return (
      <Scene2 bg="closeup">
        {panel(16)}
        {panel(168)}
        {/* temiz, iyileşen */}
        <path d="M62 118Q84 112 104 120" fill="none" stroke="#d98a7e" stroke-width={7} stroke-linecap="round" />
        <path d="M62 118Q84 112 104 120" fill="none" stroke="#c0675c" stroke-width={2.4} stroke-linecap="round" />
        <Ok x={84} y={172} r={16} />
        {/* enfekte */}
        <ellipse cx={236} cy={118} rx={52} ry={44} fill={K.danger} opacity={0.22} />
        <ellipse cx={236} cy={118} rx={36} ry={30} fill={K.danger} opacity={0.35} />
        <OG sh={[{ d: ell([236, 118], 22, 18), f: '#d5554a' }, { d: ell([236, 116], 11, 8), f: '#efd25a', ln: true }]} />
        <path d="M232 113a4 3 0 0 1 6 0" stroke="#fff" stroke-width={1.5} fill="none" opacity={0.8} />
        <Warn x={204} y={176} s={1.05} />
        <ThermoStick x={266} y={176} s={0.48} a={70} text="39°" />
      </Scene2>
    );
  },

  /* ── Soğuk ısırığı ── */
  'yaralanma-donma-belirti': () => {
    const h: HP = { x: 156, y: 196, a: -4, s: 1.75, pose: 'open', side: 'R', skin: skinOf(DON.victim), arm: 0 };
    const fingers: [P, P, number][] = [[[-11.6, -48], [-14.6, -60], 3.4], [[-3.8, -54], [-4, -66], 3.6], [[5.6, -51], [6.8, -62], 3.4], [[13.5, -42], [15.8, -51], 3], [[-23, -30], [-27, -34], 3.4]];
    const coat = sleeveOf(DON.victim);
    return (
      <Scene2 bg="outdoor" ground="snow" gy={170}>
        <Filters />
        <Tree x={40} y={172} kind="pine" s={0.8} color="#3f7d63" />
        <Tree x={290} y={174} kind="pine" s={0.7} color="#3f7d63" />
        <path d="M24 154l8 -7l8 7M268 152l8 -7l8 7" fill="#fff" />
        <g fill="#fff">{[[30, 30], [80, 60], [250, 40], [300, 100], [120, 24], [210, 80], [60, 120]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={2.6} />)}</g>
        <g filter="url(#y2-red)"><Hand {...h} /></g>
        <g transform={hT(h)}>
          {fingers.map(([a, b, r], i) => <path key={i} d={capsule(a, r * 0.95, b, r * 0.9)} fill="#e6e9ee" stroke="#9aa4b0" stroke-width={0.8} />)}
        </g>
        <OG sh={[{ d: capsule([156, 196], 26, [166, 260], 30), f: coat }, { d: rrect(126, 186, 62, 18, 8), f: '#e9e4d8' }]} />
      </Scene2>
    );
  },

  'yaralanma-donma-ilik-su': () => {
    const h: HP = { x: 152, y: 128, a: 180, s: 1.15, pose: 'open', side: 'L', skin: skinOf(DON.victim), arm: 200, sleeve: sleeveOf(DON.victim) };
    return (
      <Scene2 bg="indoor" gy={168}>
        <OG sh={[{ d: 'M60 150H260L240 226Q238 232 230 232H90Q82 232 80 226Z', f: '#5ea0c8' }, { d: ell([160, 150], 100, 12), f: '#3f80a8' }]} />
        <path d={ell([160, 156], 88, 9)} fill={K.water} />
        <Hand {...h} />
        <path d="M74 158L246 158L232 222H88Z" fill={K.waterLight} opacity={0.22} />
        <path d="M100 172h20M190 190h24M120 206h16" stroke="#fff" stroke-width={2} opacity={0.8} stroke-linecap="round" />
        <OG sh={[{ d: 'M60 150H260', st: K.out, sw: 3 }]} />
        <path d={ell([160, 150], 100, 12)} fill="none" stroke={K.out} stroke-width={2.5} />
        {/* mutfak termometresi */}
        <OG sh={[{ d: capsule([228, 128], 2.6, [214, 196], 2.2), f: '#a3adb8' }, { d: circ([232, 110], 18), f: '#f6f8fa' }]} />
        <rect x={220} y={104} width={24} height={12} rx={2} fill="#26364a" />
        <text x={232} y={113.5} text-anchor="middle" font-size={9} font-weight={700} fill="#ffd54a" font-family="'IBM Plex Sans', system-ui, sans-serif">38°</text>
        <Label x={250} y={34} text="37–39 °C" size={14} />
      </Scene2>
    );
  },

  'yaralanma-donma-sarma': () => {
    // Özel yakın plan el: parmaklar açık, parmak ARALARINDA katlanmış gazlı bez; sargı bilek değil avuç+parmak diplerinde.
    const sk = K.skin[skinOf(DON.victim)];
    const gauze = '#fbfbf8';
    const crepe = '#f3efe6';
    const fingers: [P, P, number][] = [[[84, 124], [58, 56], 9.5], [[106, 118], [98, 38], 10], [[128, 118], [140, 40], 9.8], [[148, 126], [178, 66], 8.8]];
    const webs: [P, number][] = [[[95, 112], -10], [[117, 108], 0], [[139, 112], 14]];
    return (
      <Scene2 bg="closeup">
        {/* önkol + kol (bilek açıkta) */}
        <OG sh={[{ d: 'M84 252L90 196H150L156 252Z', f: sk }, { d: 'M80 262L84 226H156L160 262Z', f: sleeveOf(DON.victim) }]} />
        {/* parmaklar */}
        <OG sh={fingers.map(([a, b, rr]) => ({ d: capsule(a, rr, b, rr * 0.85), f: sk }))} />
        {fingers.map(([, b], i) => {
          const [a] = fingers[i];
          const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
          const nx = b[0] - Math.cos(ang) * 5, ny = b[1] - Math.sin(ang) * 5;
          return <ellipse key={i} cx={nx} cy={ny} rx={4.4} ry={3.2} transform={`rotate(${(ang * 180) / Math.PI} ${nx} ${ny})`} fill={tint(sk, 0.45)} />;
        })}
        {/* avuç */}
        <OG sh={[{ d: smooth([[78, 200], [72, 160], [76, 122], [100, 110], [130, 110], [154, 120], [160, 160], [152, 200]], true, 0.9), f: sk }]} />
        {/* başparmak */}
        <OG sh={[{ d: capsule([80, 176], 11, [44, 132], 9), f: sk }]} />
        {/* gazlı bez parçaları parmak aralarında */}
        {webs.map(([c, a], i) => (
          <g key={i} transform={`translate(${c[0]} ${c[1]}) rotate(${a})`}>
            <OG sh={[{ d: 'M-6 10L-7 -24Q0 -28 7 -24L6 10Z', f: gauze }, { d: 'M0 -24V8', st: '#cfd6dc', sw: 1.2 }, { d: 'M-6 -8H6', st: '#dfe4e8', sw: 1 }]} />
          </g>
        ))}
        {/* gevşek sargı: avuç ve parmak diplerini birlikte sarıyor (bilek açık) */}
        <OG sh={[
          { d: 'M70 168Q116 160 164 166L162 192Q116 186 72 196Z', f: crepe },
          { d: 'M70 140Q116 128 164 142L164 170Q116 158 70 170Z', f: tint(crepe, 0.2) },
          { d: 'M74 118Q116 104 160 120L164 146Q116 132 70 144Z', f: crepe },
        ]} />
        <path d="M80 130Q116 120 154 130M78 156Q116 146 156 156M78 182Q116 174 156 180" stroke={shade(crepe, 0.12)} stroke-width={1.1} fill="none" />
        {/* sargı ucu sarkıyor */}
        <OG sh={[{ d: 'M162 170Q184 176 196 200Q200 214 194 226L180 224Q186 210 180 198Q172 186 160 184Z', f: crepe }]} />
      </Scene2>
    );
  },

  'yaralanma-donma-yuzuk': () => {
    const hx = 160, hy = 188, s = 1.9;
    const ring: P = [hx + 4.8 * s, hy - 40 * s];
    return (
      <Scene2 bg="closeup">
        <Hand x={hx} y={hy} a={0} s={s} pose="open" side="R" arm={90} skin={skinOf(DON.victim)} sleeve={sleeveOf(DON.victim)} />
        <ellipse cx={ring[0]} cy={ring[1]} rx={10} ry={4.5} fill="none" stroke={K.out} stroke-width={6} />
        <ellipse cx={ring[0]} cy={ring[1]} rx={10} ry={4.5} fill="none" stroke="#e8c64a" stroke-width={3.4} />
        <OG sh={[{ d: rrect(hx - 26, hy + 12, 52, 18, 4), f: '#5b4636' }, { d: circ([hx, hy + 21], 13), f: '#d8dde3' }, { d: circ([hx, hy + 21], 9.5), f: '#fbfaf7', ln: true }]} />
        <path d={`M${hx} ${hy + 21}V${hy + 14}M${hx} ${hy + 21}L${hx + 5} ${hy + 23}`} stroke={K.out} stroke-width={1.4} stroke-linecap="round" />
        <Arrow from={[ring[0] + 22, ring[1] - 10]} to={[ring[0] + 34, ring[1] - 62]} w={6} />
        <Arrow from={[hx + 50, hy + 22]} to={[hx + 104, hy + 22]} w={6} />
      </Scene2>
    );
  },

  'yaralanma-donma-saglik': () => <GoClinicScene v={DON.victim} h={DON.helper} />,

  /* ── Güneş yanığı ── */
  'yaralanma-gunes-golge': () => {
    return (
      <Scene2 bg="outdoor" gy={160}>
        <rect y={140} width={320} height={20} fill={K.water} />
        <path d="M20 148h22M120 152h30M230 146h26" stroke={K.waterLight} stroke-width={2} stroke-linecap="round" />
        <rect y={160} width={320} height={80} fill="#ecd29a" />
        <circle cx={46} cy={40} r={20} fill="#ffd64a" stroke="#f2a93a" stroke-width={2} />
        <g stroke="#f2a93a" stroke-width={3} stroke-linecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
            return <path key={a} d={`M${46 + c * 27} ${40 + s * 27}L${46 + c * 35} ${40 + s * 35}`} />;
          })}
        </g>
        <ellipse cx={262} cy={222} rx={58} ry={9} fill="#000" opacity={0.15} />
        <OG sh={[{ d: 'M262 222V70', st: K.out, sw: 5 }]} />
        <path d="M262 222V70" stroke="#e8e4da" stroke-width={2.6} />
        <OG sh={[{ d: 'M200 92Q262 34 324 92Q308 86 293 92Q278 84 262 92Q246 84 231 92Q216 86 200 92Z', f: K.danger }, { d: 'M231 92Q246 84 262 92Q262 50 262 52Q240 62 231 92Z', f: '#fff', no: true }, { d: 'M293 92Q278 84 262 92Q262 50 262 52Q286 62 293 92Z', f: '#fff', no: true }]} />
        <Person {...GUN.victim} x={128} y={226} s={1.15} shoes={null} pose={{ ...POSE.walk, face: 'pain' }} />
        <Arrow from={[166, 120]} to={[218, 120]} />
      </Scene2>
    );
  },

  'yaralanma-gunes-serin-bez': () => {
    // İçeride sandalyede oturan yanık kişi; yardımcı arkasından ıslak serin bezi omzuna koyuyor. Yerde su leğeni.
    const v: PersonProps = { ...GUN.victim, x: 170, y: 228, s: 1.15, shoes: null, pose: { ...POSE.sitChair, spine: -92, face: 'neutral' } };
    const r = rig(v);
    const spot: P = [r.shoulderF[0] + 2, r.shoulderF[1] + 2];
    const helper: PersonProps = { ...GUN.helper, x: 112, y: 230, s: 1.15,
      pose: { ...POSE.standSide, spine: -84, chest: -74, head: -60, armF: { to: [spot[0] - 4, spot[1] - 6], bend: 1 }, armB: [100, 96], handF: { shape: 'flat', a: 10 }, face: 'neutral' } };
    const cx = r.hip[0] - 30;
    return (
      <Scene2 bg="indoor">
        <Window x={226} y={34} />
        <OG sh={[{ d: rrect(cx, 168, 56, 8, 2), f: K.wood }, { d: rrect(cx, 96, 8, 132, 2), f: K.wood }, { d: rrect(cx + 48, 172, 7, 56, 2), f: shade(K.wood, 0.2) }]} />
        <Person {...helper} only={['legB', 'legF', 'armB', 'torso', 'head']} />
        <Person {...v} />
        <Cloth x={spot[0]} y={spot[1] + 4} w={38} h={22} a={-10} color="#a9d3ee" wet />
        <Person {...helper} only={['armF']} />
        <OG sh={[{ d: 'M236 206H302L294 230H244Z', f: '#7fb4d6' }, { d: ell([269, 206], 33, 6), f: K.water }]} />
      </Scene2>
    );
  },

  'yaralanma-gunes-su-icme': () => <DrinkScene c={GUN.victim} />,

  'yaralanma-gunes-saglik': () => <GoClinicScene v={{ ...GUN.victim, shoes: K.shoe }} h={GUN.helper} />,

  'yaralanma-su-icme': () => <DrinkScene c={ISH.victim} />,

  /* ── İshal ── */
  'yaralanma-ors-paket': () => {
    // Paketin arkasındaki tarife bakılıyor; litre yazısı yok. Ölçülü kap + temiz su.
    const pk: P = [196, 104];
    const h = at({ x: 0, y: 0, a: -28, s: 1.0, pose: 'pinch', side: 'R', skin: skinOf(ISH.helper), arm: 200, sleeve: sleeveOf(ISH.helper) }, 'pinch', [pk[0] + 30, pk[1] + 44]);
    const font = "'IBM Plex Sans', system-ui, sans-serif";
    return (
      <Scene2 bg="indoor" gy={160}>
        <Table x={-10} y={262} w={340} h={84} />
        {/* ölçülü kap: dereceler var, sayı yok */}
        <OG sh={[{ d: 'M34 112H102L106 206Q106 216 96 216H40Q30 216 30 206Z', f: '#eaf6fc' }, { d: 'M32 146H104L106 206Q106 216 96 216H40Q30 216 30 206Z', f: K.waterLight, no: true }, { d: 'M102 122Q126 128 120 162L104 170', st: K.out, sw: 4 }, { d: 'M34 112L24 104H46Z', f: '#eaf6fc' }]} />
        {[128, 146, 164, 182, 200].map((yy, i) => <path key={yy} d={`M36 ${yy}h${i % 2 ? 8 : 14}`} stroke={K.ink} stroke-width={1.8} />)}
        <path d="M40 154Q46 150 52 154" stroke="#fff" stroke-width={2} fill="none" opacity={0.8} />
        {/* paket (arka yüz: tarif satırları) */}
        <g transform={`translate(${pk[0]} ${pk[1]}) rotate(-6)`}>
          <OG sh={[
            { d: rrect(-40, -54, 80, 108, 4), f: '#f7f8fa' },
            { d: 'M-40 -50L-44 -44L-40 -38L-44 -32L-40 -26', st: K.out, sw: 1.2 },
            { d: rrect(-40, -54, 80, 26, 4), f: K.water, no: true },
          ]} />
          <text x={0} y={-35} text-anchor="middle" font-size={15} font-weight={700} fill="#fff" font-family={font}>ORS</text>
          {/* tarif adımları: küçük simge + çizgi */}
          {[-12, 6, 24].map((yy, i) => (
            <g key={i}>
              <circle cx={-28} cy={yy} r={5} fill={K.action} />
              <text x={-28} y={yy + 3.5} text-anchor="middle" font-size={8} font-weight={700} fill="#fff" font-family={font}>{i + 1}</text>
              <path d={`M-18 ${yy - 2}H${28 - i * 6}M-18 ${yy + 3}H${16 + i * 4}`} stroke="#8a93a0" stroke-width={2.2} stroke-linecap="round" />
            </g>
          ))}
          <path d="M-28 40H28" stroke="#c4cad2" stroke-width={2} stroke-linecap="round" />
        </g>
        <Hand {...h} />
        {/* göz simgesi + bakış */}
        <g transform="translate(118 50)">
          <path d="M-20 0Q0 -16 20 0Q0 16 -20 0Z" fill="#fff" stroke={K.out} stroke-width={2.2} />
          <circle cx={2} cy={0} r={7} fill="#4f6d8f" stroke={K.out} stroke-width={1.6} />
          <circle cx={3} cy={0} r={3} fill={K.ink} />
          <circle cx={5} cy={-2.5} r={1.4} fill="#fff" />
        </g>
        <path d="M140 58L166 84" stroke={K.action} stroke-width={3} stroke-dasharray="4 5" stroke-linecap="round" />
      </Scene2>
    );
  },

  'yaralanma-ors-ev-tarifi': () => {
    const spoon = (x: number, y: number, fill: number, c: string) => (
      <g>
        <OG sh={[{ d: capsule([x + 12, y - 2], 2.4, [x + 42, y - 12], 3), f: K.metal }, { d: `M${x - 14} ${y - 2}H${x + 14}A14 11 0 0 1 ${x - 14} ${y - 2}Z`, f: tint(K.metal, 0.25) }]} />
        <path d={fill >= 1 ? `M${x - 13} ${y - 1}H${x + 13}A13 10 0 0 1 ${x - 13} ${y - 1}Z` : `M${x - 11} ${y + 4}H${x + 11}A13 10 0 0 1 ${x - 11} ${y + 4}Z`} fill={c} stroke={K.out} stroke-width={1} />
      </g>
    );
    const sugar = '#fbfaf7';
    const font = "'IBM Plex Sans', system-ui, sans-serif";
    return (
      <Scene2 bg="indoor" gy={120}>
        <Table x={-10} y={250} w={340} h={130} />
        <OG sh={[{ d: 'M30 72H88L94 196Q94 208 82 208H36Q24 208 24 196Z', f: '#e6f4fb' }, { d: 'M26 92H92L94 196Q94 208 82 208H36Q24 208 24 196Z', f: K.waterLight, no: true }, { d: 'M88 84Q112 90 108 130L94 140', st: K.out, sw: 4 }]} />
        {[120, 145, 170].map((yy) => <path key={yy} d={`M28 ${yy}h12`} stroke={K.ink} stroke-width={1.6} />)}
        <Label x={59} y={50} text="1 L" size={14} />
        {[0, 1, 2].map((i) => spoon(132 + i * 52, 150, 1, sugar))}
        {[0, 1, 2].map((i) => spoon(132 + i * 52, 196, 1, sugar))}
        <text x={184} y={118} text-anchor="middle" font-size={17} font-weight={700} fill={K.ink} font-family={font}>6 şeker</text>
        {spoon(250, 226, 0.5, '#e9eef2')}
        <text x={176} y={232} text-anchor="middle" font-size={17} font-weight={700} fill={K.ink} font-family={font}>½ tuz</text>
      </Scene2>
    );
  },

  'yaralanma-ishal-el-yikama': () => <WashScene c={ISH.victim} />,

  'yaralanma-ishal-saglik': () => <GoClinicScene v={ISH.victim} h={ISH.helper} />,

  /* ── Ateş ── */
  'yaralanma-ates-olcme': () => {
    const p: PersonProps = { ...ATS.victim, x: 134, y: 112, ax: 'head', ay: 'head', s: 2.4, pose: { ...POSE.stand, face: 'worried' } };
    const r = rig(p);
    const gun: P = [r.head[0] + 100, r.head[1] - 28];
    const h = at({ x: 0, y: 0, a: -8, s: 1.05, pose: 'hold', side: 'R', grip: 22, skin: skinOf(ATS.helper), arm: 200, sleeve: sleeveOf(ATS.helper) }, 'grip', [gun[0] + 29, gun[1] + 34]);
    return (
      <Scene2 bg="closeup">
        <Person {...p} only={['torso', 'head', 'armB']} />
        <path d={ell([r.head[0] - 4, r.head[1] + 12], 9, 5)} fill={K.danger} opacity={0.25} />
        <path d={ell([r.head[0] + 18, r.head[1] + 12], 9, 5)} fill={K.danger} opacity={0.25} />
        <Hand {...h}>
          <ThermoGun x={gun[0]} y={gun[1]} s={1} text="38,5 °C" />
        </Hand>
        <Waves x={gun[0] - 64} y={gun[1] - 2} a={180} n={2} r={6} color={K.water} />
      </Scene2>
    );
  },

  'yaralanma-ates-bebek': () => {
    // Kundaklı, birkaç haftalık bebek; başı annenin koluna dayalı.
    const mom: PersonProps = { ...ATS.helper, x: 96, y: 230, s: 1.12, pose: { ...POSE.stand, head: -96, face: 'worried' } };
    const m = rig(mom);
    const bh: P = [m.shoulderB[0] + 2, m.chest[1] + 12]; // bebeğin başı (annenin sol kolunda)
    const bf: P = [m.shoulderF[0] + 22, m.chest[1] + 26]; // kundağın ayak ucu
    const hold: PersonProps = { ...mom, pose: { ...mom.pose, armB: { to: [bh[0] + 6, bh[1] + 14], bend: 1 }, armF: { to: [bf[0] - 10, bf[1] + 6], bend: -1 } } };
    const ang = (Math.atan2(bf[1] - bh[1], bf[0] - bh[0]) * 180) / Math.PI;
    const len = Math.hypot(bf[0] - bh[0], bf[1] - bh[1]);
    const sw = '#f6d6e2';
    const sk = K.skin[0];
    return (
      <Scene2 bg="outdoor" ground="pavement">
        <OG sh={[{ d: rrect(206, 70, 112, 134, 2), f: '#f1ebe0' }, { d: rrect(196, 62, 132, 12, 2), f: '#cfc6b6' }, { d: rrect(246, 150, 34, 54, 1), f: '#8fb8d0', ln: true }, { d: rrect(216, 106, 22, 22, 1), f: '#bfe3f5', ln: true }, { d: rrect(288, 106, 22, 22, 1), f: '#bfe3f5', ln: true }, { d: circ([263, 92], 14), f: '#fff' }]} />
        <circle cx={260} cy={92} r={10} fill={K.danger} />
        <circle cx={264} cy={90} r={8.4} fill="#fff" />
        <Person {...hold} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        {/* kundak */}
        <g transform={`translate(${bh[0]} ${bh[1]}) rotate(${ang})`}>
          <OG sh={[
            { d: smooth([[-4, -13], [len * 0.45, -14], [len + 4, -9], [len + 8, 0], [len + 4, 9], [len * 0.45, 13], [-4, 13], [-14, 0]], true), f: sw },
            { d: `M${len * 0.3} -13Q${len * 0.42} 0 ${len * 0.3} 13`, st: shade(sw, 0.2), sw: 1.2 },
            { d: `M${len * 0.62} -12Q${len * 0.7} 0 ${len * 0.6} 12`, st: shade(sw, 0.2), sw: 1.2 },
            { d: ell([-1, 0], 13, 13.5), f: tint(sw, 0.3) },
          ]} />
        </g>
        {/* minik yüz (başlık içinde) */}
        <OG sh={[{ d: ell([bh[0] + 1, bh[1] - 1], 8.5, 9), f: sk }]} />
        <path d={`M${bh[0] - 3.5} ${bh[1] - 2}q2 1.4 3.4 0M${bh[0] + 2} ${bh[1] - 2}q2 1.4 3.4 0`} stroke={K.ink} stroke-width={1.1} fill="none" stroke-linecap="round" />
        <circle cx={bh[0] + 1} cy={bh[1] + 3.5} r={1.1} fill="#c9746a" />
        <circle cx={bh[0] - 4} cy={bh[1] + 1.5} r={1.8} fill="#f2a7a0" opacity={0.6} />
        <Person {...hold} only={['armF']} />
        <Label x={180} y={112} text="38 °C" size={15} />
        <Arrow from={[160, 150]} to={[204, 150]} />
      </Scene2>
    );
  },

  'yaralanma-ates-ince-giysi': () => {
    // İki kare, yakın plan yatakta yatan aynı çocuk: solda kalın yorgan + bere (yasak), sağda ince tişört, çarşaf belde (doğru).
    const GYb = 156;
    const kid = (x: number): PersonProps => ({ ...ATS.victim, x, y: GYb, s: 1.9, shadow: false, pose: { ...POSE.lieBack, armF: [10, 6], face: 'worried' } });
    const L = kid(150);
    const R = kid(302);
    const lr = rig(L), rr = rig(R);
    const panel = (x: number, id: string) => (
      <clipPath id={id}><path d={rrect(x, 30, 144, 176, 14)} /></clipPath>
    );
    const bed = (x: number, hx: number) => <OG sh={[{ d: rrect(x - 10, GYb, 170, 60, 4), f: '#f4f1ea' }, { d: rrect(x - 10, GYb + 22, 170, 4, 1), f: '#e2ddd2' }, { d: rrect(hx - 30, GYb - 20, 60, 22, 10), f: '#fff' }]} />;
    return (
      <Scene2 bg="indoor">
        <defs>{panel(12, 'y2-p1')}{panel(164, 'y2-p2')}</defs>
        <g clip-path="url(#y2-p1)">
          <rect x={12} y={30} width={144} height={176} fill="#e9dfcf" />
          {bed(12, lr.head[0])}
          <Person {...L} />
          <Blanket x1={lr.neck[0] - 4} x2={176} y={GYb + 4} h={62} color="#a7473d" />
          <Blanket x1={lr.neck[0] + 6} x2={176} y={GYb + 4} h={44} color="#c98a3e" />
          <Drop x={lr.head[0] + 8} y={lr.head[1] - 30} s={0.75} />
          <Drop x={lr.head[0] + 26} y={lr.head[1] - 22} s={0.6} />
        </g>
        <g clip-path="url(#y2-p2)">
          <rect x={164} y={30} width={144} height={176} fill="#e9dfcf" />
          {bed(164, rr.head[0])}
          <Person {...R} />
          <Blanket x1={rr.hip[0] - 26} x2={330} y={GYb + 4} h={22} color="#dfeaf2" />
        </g>
        <path d={rrect(12, 30, 144, 176, 14)} fill="none" stroke={K.out} stroke-width={2} />
        <path d={rrect(164, 30, 144, 176, 14)} fill="none" stroke={K.out} stroke-width={2} />
        <Bad x={36} y={54} r={16} />
        <Ok x={284} y={54} r={16} />
      </Scene2>
    );
  },

  'yaralanma-ates-bardak-testi': () => {
    // Bardak yan yatırılmış: YAN yüzü deriye bastırılıyor. Noktalar camın altında da aynı koyulukta.
    const sk = K.skin[skinOf(ATS.victim)];
    const dots: P[] = [[34, 84], [58, 120], [44, 168], [72, 206], [96, 92], [112, 150], [128, 118], [140, 176], [158, 96], [170, 140], [186, 190], [196, 112], [212, 160], [230, 128], [244, 196], [262, 100], [276, 150], [290, 206], [104, 214], [150, 220], [224, 216], [84, 182], [252, 168], [300, 120], [40, 128]];
    const dot = ([dx, dy]: P, i: number) => <circle key={i} cx={dx} cy={dy} r={i % 3 ? 3.6 : 4.6} fill={i % 2 ? '#a3243f' : '#7e2152'} />;
    // cam gövde (yan yatık): dip solda (x=96), ağız sağda (x=246)
    const body = 'M96 112L246 98V206L96 190Z';
    const h = at({ x: 0, y: 0, a: 62, s: 1.2, pose: 'press', side: 'R', view: 'back', skin: skinOf(ATS.helper), arm: 200, sleeve: sleeveOf(ATS.helper) }, 'tip', [100, 140]);
    return (
      <Scene2 bg="closeup">
        <rect x={0} y={0} width={320} height={240} fill={sk} />
        <path d="M0 0H320V40Q160 30 0 46Z" fill={shade(sk, 0.06)} />
        {/* camın gölgesi (deri üstünde, noktaların altında) */}
        <path d="M100 196L250 212V216L100 200Z" fill="#000" opacity={0.08} />
        {dots.map(dot)}
        {/* cam: çok saydam dolgu, sonra noktalar AYNI renkte tekrar üstte */}
        <path d={body} fill="#e8f6fc" opacity={0.12} />
        <path d={ell([96, 151], 12, 39)} fill="#e8f6fc" opacity={0.18} />
        {dots.filter(([dx, dy]) => dx > 84 && dx < 250 && dy > 96 && dy < 208).map((d, i) => dot(d, i + 1))}
        <path d={body} fill="none" stroke={K.out} stroke-width={2.4} stroke-linejoin="round" />
        <path d={ell([96, 151], 12, 39)} fill="none" stroke={K.out} stroke-width={2.2} />
        <path d={ell([246, 152], 15, 54)} fill="#e8f6fc" fill-opacity={0.1} stroke={K.out} stroke-width={2.6} />
        <path d="M112 118L232 106" stroke="#fff" stroke-width={4} opacity={0.85} stroke-linecap="round" />
        <path d="M112 184L232 198" stroke="#fff" stroke-width={2.5} opacity={0.6} stroke-linecap="round" />
        <Hand {...h} />
        <Arrow from={[150, 40]} to={[150, 86]} w={5} />
        <Label x={278} y={30} text="112" size={18} bg={K.danger} />
      </Scene2>
    );
  },

  'yaralanma-ates-112': () => <CallScene c={ATS.helper} />,

  'yaralanma-ates-saglik': () => <GoClinicScene v={ATS.victim} h={ATS.helper} child />,

  /* ── Kuduz ── */
  'yaralanma-isirik-yikama': () => {
    const h: HP = { x: 264, y: 170, a: 96, s: 1.05, pose: 'open', side: 'L', view: 'palm', skin: skinOf(KUD.victim), arm: 260 };
    const wound = (x: number, y: number) => (
      <g fill="#b0303a">
        {[-14, -5, 5, 14].map((dx, i) => <ellipse key={'t' + i} cx={x + dx} cy={y - 7 + Math.abs(dx) * 0.2} rx={2.4} ry={2.8} />)}
        {[-11, -2, 8].map((dx, i) => <ellipse key={'b' + i} cx={x + dx} cy={y + 8 - Math.abs(dx) * 0.2} rx={2.4} ry={2.8} />)}
      </g>
    );
    return (
      <Scene2 bg="indoor" wall="#dce8ee">
        <OG sh={[{ d: rrect(96, 22, 26, 26, 4), f: K.metal }, { d: 'M100 40H160Q172 40 172 52V60H158V54H100Z', f: K.metal }, { d: rrect(104, 12, 10, 12, 2), f: '#5e7ea0' }]} />
        <path d="M165 60V240" stroke={K.water} stroke-width={14} opacity={0.8} />
        <path d="M162 66V240" stroke={K.waterLight} stroke-width={3} opacity={0.9} />
        <Hand {...h} />
        {wound(184, 170)}
        <Foam x={210} y={156} w={40} />
        <Foam x={140} y={162} w={36} s={0.9} />
        <Drop x={150} y={210} s={0.9} />
        <Drop x={186} y={218} s={0.8} />
        <Timer x={238} y={44} r={15} text="15 dk" />
        <Soap x={56} y={226} s={1.1} />
      </Scene2>
    );
  },

  'yaralanma-asi-takvimi': () => {
    // Yakın plan duvar takvimi: aşı günleri turuncu çerçeveli ve içinde şırınga; geçmiş iki aşı günü yeşil tikli.
    // Rakam yok (takvimi hekim verir). Takvim dışında süzülen nesne yok.
    const x0 = 46, y0 = 70, cw = 46, ch = 36;
    const marks = [0, 6, 13, 16];
    const Syr = ({ x, y }: { x: number; y: number }) => (
      <g transform={`translate(${x} ${y}) rotate(-35)`}>
        <OG ow={1.2} sh={[{ d: rrect(-11, -4, 20, 8, 2), f: '#e8f4fb' }, { d: rrect(-9, -2.4, 10, 4.8, 1), f: K.waterLight, no: true }, { d: rrect(9, -2, 4, 4, 1), f: K.metal }, { d: 'M13 0H21', st: K.out, sw: 1.3 }, { d: rrect(-15, -1.6, 4, 3.2, 1), f: K.metal }, { d: rrect(-18, -5, 3, 10, 1), f: K.metal }]} />
      </g>
    );
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(x0 - 16, y0 - 48, cw * 5 + 32, ch * 4 + 62, 8), f: '#fff' }, { d: rrect(x0 - 16, y0 - 48, cw * 5 + 32, 34, 8), f: K.danger }, { d: `M${x0 - 16} ${y0 - 22}H${x0 + cw * 5 + 16}`, st: shade(K.danger, 0.3), sw: 1.4 }]} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={x0 + 22 + i * 58} y={y0 - 58} width={8} height={20} rx={4} fill={K.metal} stroke={K.out} stroke-width={1.6} />)}
        {Array.from({ length: 20 }, (_, i) => {
          const x = x0 + (i % 5) * cw + 3, y = y0 + Math.floor(i / 5) * ch;
          const m = marks.indexOf(i);
          return (
            <g key={i}>
              <rect x={x} y={y} width={cw - 6} height={ch - 6} rx={4} fill={m >= 0 ? '#fff4e2' : '#e9edf2'} stroke={m >= 0 ? K.action : 'none'} stroke-width={3} />
              {m >= 0 && <Syr x={x + (cw - 6) / 2} y={y + (ch - 6) / 2} />}
            </g>
          );
        })}
        <Ok x={x0 + 0 * cw + 36} y={y0 + 2} r={10} />
        <Ok x={x0 + 1 * cw + 36} y={y0 + ch + 2} r={10} />
      </Scene2>
    );
  },

  'yaralanma-isirik-bastirma': () => {
    // Kendi ön kolundaki ısırık yarasına diğer eliyle katlanmış temiz bezi bastırıyor.
    const sk = K.skin[skinOf(KUD.victim)];
    const arm = smooth([[-20, 132], [120, 128], [230, 136], [262, 138], [262, 180], [230, 182], [120, 186], [-20, 190]], true, 0.6);
    const h = at({ x: 0, y: 0, a: 205, s: 1.0, pose: 'press', side: 'R', skin: skinOf(KUD.victim), arm: 220, sleeve: sleeveOf(KUD.victim) }, 'palm', [150, 150]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: arm, f: sk }, { d: 'M-20 118H40Q50 160 40 204H-20Z', f: sleeveOf(KUD.victim) }]} />
        <Hand x={262} y={158} a={90} s={0.95} pose="fist" side="L" skin={skinOf(KUD.victim)} arm={0} />
        <Blood x={176} y={196} s={0.6} />
        <Cloth x={150} y={156} w={86} h={50} a={-3} />
        <Hand {...h} />
        <Arrow from={[96, 40]} to={[118, 100]} w={6} />
      </Scene2>
    );
  },

  'yaralanma-kuduz-saglik': () => <GoClinicScene v={KUD.victim} />,

  /* ── Kene ── */
  'yaralanma-kene-eldiven': () => {
    const hl: HP = { x: 70, y: 220, a: 14, s: 1.05, pose: 'open', side: 'L', skin: 0, arm: 60 };
    const hr: HP = { x: 150, y: 220, a: -6, s: 1.05, pose: 'open', side: 'R', skin: 0, arm: 60 };
    const touch = at({ x: 0, y: 0, a: -30, s: 0.75, pose: 'point', side: 'R', skin: skinOf(KEN.victim), arm: 60 }, 'tip', [252, 120]);
    return (
      <Scene2 bg="closeup">
        <Filters />
        <g filter="url(#y2-glove)">
          <Hand {...hl} />
          <Hand {...hr} />
        </g>
        <Ok x={112} y={44} r={16} />
        <circle cx={256} cy={124} r={50} fill={K.skin[1]} stroke={K.out} stroke-width={1.5} />
        <Tick head={[258, 128]} a={-110} s={0.55} />
        <Hand {...touch} />
        <No x={256} y={124} r={50} />
      </Scene2>
    );
  },

  'yaralanma-kene-cimbiz': () => {
    const sk = K.skin[1];
    const head: P = [150, 168];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M-20 170Q160 162 340 172V260H-20Z', f: sk }, { d: 'M-20 196Q160 190 340 198V260H-20Z', f: shade(sk, 0.12), no: true }]} />
        <Tick head={head} a={-120} s={1.6} />
        <Tweezers tip={[154, 164]} a={-40} len={190} open={2.5} />
        <Ok x={60} y={56} r={18} />
      </Scene2>
    );
  },

  'yaralanma-kene-cekme': () => {
    const sk = K.skin[1];
    const head: P = [118, 176];
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: 'M-20 180Q118 170 340 180V260H-20Z', f: sk }, { d: 'M-20 208Q118 202 340 210V260H-20Z', f: shade(sk, 0.12), no: true }]} />
        {/* deri hafifçe kalkmış (çekiş) */}
        <path d="M96 178Q112 168 118 166Q124 168 140 178" fill={sk} stroke={K.out} stroke-width={1.4} />
        <Tick head={head} a={-90} s={1.7} />
        {/* cımbız ağız/baş kısmını deriye en yakın yerden tutuyor; gövde dışarıda */}
        <Tweezers tip={[121, 166]} a={-172} len={170} open={1.6} />
        <Arrow from={[176, 150]} to={[176, 62]} w={6} />
        {/* yasak: döndürme + kolonya */}
        <g>
          <circle cx={262} cy={92} r={46} fill="#fff" opacity={0.75} />
          <CircArrow c={[244, 92]} r={19} a0={-170} a1={120} w={4} color={K.danger} />
          <OG sh={[{ d: 'M272 128V86Q272 78 280 76V66H292V76Q300 78 300 86V128Z', f: '#d5ecd2' }, { d: rrect(278, 56, 16, 11, 2), f: '#e2c35a' }, { d: rrect(274, 94, 24, 20, 2), f: '#fff', no: true }]} />
          <No x={262} y={92} r={46} />
        </g>
      </Scene2>
    );
  },

  'yaralanma-kene-kontrol': () => {
    const sil = '#cdd6e0';
    const S = (x: number, y: number) => {
      const sh = [
        { d: circ([x, y], 13), f: sil },
        { d: rrect(x - 17, y + 16, 34, 54, 10), f: sil },
        { d: capsule([x - 16, y + 22], 6, [x - 28, y + 76], 4.5), f: sil },
        { d: capsule([x + 16, y + 22], 6, [x + 28, y + 76], 4.5), f: sil },
        { d: capsule([x - 9, y + 66], 8, [x - 12, y + 140], 5.5), f: sil },
        { d: capsule([x + 9, y + 66], 8, [x + 12, y + 140], 5.5), f: sil },
      ];
      const spots: P[] = [[x, y - 12], [x + 14, y + 2], [x - 19, y + 26], [x + 19, y + 26], [x, y + 72], [x - 11, y + 104], [x + 11, y + 104]];
      return (
        <g>
          <OG sh={sh} />
          {spots.map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={7} fill="none" stroke={K.action} stroke-width={3} />)}
        </g>
      );
    };
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={196} kind="pine" s={0.8} />
        <Person {...KEN.victim} x={100} y={228} s={1.1} pose={{ ...POSE.stand, face: 'calm' }}
          over={(r) => (
            <g>
              <OG sh={[{ d: rrect(r.ankleB[0] - 8, r.ankleB[1] - 16, 16, 14, 3), f: '#5d7d5a' }, { d: rrect(r.ankleF[0] - 8, r.ankleF[1] - 16, 16, 14, 3), f: '#5d7d5a' }]} />
            </g>
          )} />
        {S(222, 52)}
      </Scene2>
    );
  },

  'yaralanma-kene-el-yikama': () => <WashScene c={KEN.victim} />,

  'yaralanma-kene-saglik': () => <GoClinicScene v={KEN.victim} />,

  /* ── Ayak bakımı ── */
  'yaralanma-ayak-kontrol': () => {
    const sitY = 168;
    const hiker: PersonProps = {
      ...SU.victim, x: 150, y: sitY, ay: 'hip', s: 1.25, shoes: null,
      pose: { spine: -70, chest: -55, head: -40, legB: [40, 96], legF: [-12, 40], footF: -10, armF: { at: 'ankleF', d: [-8, 4] }, armB: { at: 'kneeF', d: [-6, -2] }, face: 'worried' },
    };
    const r = rig(hiker);
    return (
      <Scene2 bg="outdoor" ground="dirt" gy={190}>
        <Tree x={30} y={196} kind="pine" s={0.9} />
        <Tree x={300} y={196} kind="leaf" s={0.8} />
        <Rock x={146} y={226} s={2.7} />
        <Backpack x={70} y={182} s={1.2} color="#c0603e" />
        <Person {...hiker} shoes={K.shoe} only={['legB']} />
        <Person {...hiker} only={['legF', 'torso', 'head', 'armB', 'armF']} />
        <circle cx={r.ankleF[0] - 5} cy={r.ankleF[1] + 7} r={6} fill={K.danger} opacity={0.8} />
        <OG sh={[{ d: 'M236 226Q234 208 248 206L266 208Q272 216 288 216Q298 218 296 226Z', f: K.shoe }, { d: 'M250 220Q272 200 294 212L300 226H254Z', f: '#e8e2d4' }]} />
      </Scene2>
    );
  },

  'yaralanma-ayak-bantlama': () => {
    const fx = 120, fy = 228;
    const tape = smooth([[fx + 8, fy - 108], [fx - 2, fy - 60], [fx + 2, fy - 18], [fx + 26, fy - 2]]);
    const hl = at({ x: 0, y: 0, a: 115, s: 0.8, pose: 'press', side: 'L', skin: skinOf(SU.victim), arm: 200, sleeve: sleeveOf(SU.victim) }, 'tip', [fx + 6, fy - 100]);
    const hr = at({ x: 0, y: 0, a: 70, s: 0.8, pose: 'press', side: 'L', skin: skinOf(SU.victim), arm: 200, sleeve: sleeveOf(SU.victim) }, 'tip', [fx + 4, fy - 30]);
    return (
      <Scene2 bg="closeup">
        <FootSide x={fx} y={fy} s={1} skin={skinOf(SU.victim)} />
        <ellipse cx={fx + 4} cy={fy - 50} rx={16} ry={26} fill={K.danger} opacity={0.3} />
        <path d={tape} fill="none" stroke={K.out} stroke-width={27} stroke-linecap="round" />
        <path d={tape} fill="none" stroke="#e8c6a0" stroke-width={24} stroke-linecap="round" />
        <path d={tape} fill="none" stroke={tint('#e8c6a0', 0.3)} stroke-width={4} stroke-linecap="round" stroke-dasharray="1 9" />
        <Hand {...hl} />
        <Hand {...hr} />
        <Ok x={268} y={56} r={16} />
      </Scene2>
    );
  },

  'yaralanma-kabarcik-bant': () => {
    const fx = 104, fy = 228;
    const blister: P = [fx + 2, fy - 46];
    const pad: P = [blister[0] - 44, blister[1] - 34];
    const h = at({ x: 0, y: 0, a: 140, s: 0.8, pose: 'pinch', side: 'L', skin: skinOf(SU.victim), arm: 200, sleeve: sleeveOf(SU.victim) }, 'pinch', [pad[0] - 6, pad[1] - 16]);
    const needleH = at({ x: 0, y: 0, a: -30, s: 0.5, pose: 'pinch', side: 'R', skin: 1, arm: 60 }, 'pinch', [272, 72]);
    return (
      <Scene2 bg="closeup">
        <FootSide x={fx} y={fy} s={1} skin={skinOf(SU.victim)} />
        <ellipse cx={blister[0] + 2} cy={blister[1]} rx={12} ry={18} fill={K.danger} opacity={0.3} />
        <ellipse cx={blister[0]} cy={blister[1]} rx={9} ry={13} fill="#f7efdc" stroke={K.out} stroke-width={1.6} />
        <path d={`M${blister[0] - 4} ${blister[1] - 6}a5 6 0 0 1 4 -4`} stroke="#fff" stroke-width={2} fill="none" />
        <g transform={`translate(${pad[0]} ${pad[1]}) rotate(70)`}>
          <OG sh={[{ d: rrect(-30, -15, 60, 30, 12), f: '#e8c6a0' }, { d: ell([0, 0], 15, 10), f: '#f6efe4', ln: true }]} />
        </g>
        <Hand {...h} />
        <Arrow from={[pad[0] + 4, pad[1] + 28]} to={[blister[0] - 14, blister[1] + 2]} w={4.5} />
        {/* yasak: iğne */}
        <g>
          <circle cx={258} cy={100} r={48} fill="#fff" opacity={0.75} />
          <OG sh={[{ d: circ([254, 118], 16), f: K.skin[skinOf(SU.victim)] }]} />
          <path d={ell([254, 112], 10, 9)} fill="#f4ecd8" stroke={K.out} stroke-width={1.2} />
          <path d="M256 108L278 72" stroke={K.out} stroke-width={2.4} stroke-linecap="round" />
          <Hand {...needleH} />
          <No x={258} y={100} r={48} />
        </g>
      </Scene2>
    );
  },

  'yaralanma-ayak-kurulama': () => {
    // Yıkanmış ıslak ayak (üstten) havlunun üstünde; kişinin kendi eli katlanmış kuru bezle parmak diplerini kuruluyor.
    const towel = '#5aa0c8';
    const pad: P = [150, 84];
    const h = at({ x: 0, y: 0, a: 214, s: 0.95, pose: 'press', side: 'R', skin: skinOf(SU.victim), arm: 220, sleeve: sleeveOf(SU.victim) }, 'palm', [pad[0] + 6, pad[1] - 2]);
    return (
      <Scene2 bg="closeup">
        <OG sh={[{ d: rrect(20, 196, 280, 40, 8), f: towel }, { d: 'M30 206H290', st: tint(towel, 0.35), sw: 2 }]} />
        <FootTop x={120} y={226} s={0.95} skin={skinOf(SU.victim)} wet />
        <Cloth x={pad[0]} y={pad[1]} w={64} h={32} a={-24} />
        <Hand {...h} />
      </Scene2>
    );
  },

  'yaralanma-ayak-saglik': () => <GoClinicScene v={SU.victim} />,

  /* ── Kramp ── */
  'yaralanma-kramp-germe': () => {
    const base: PersonProps = { ...KRA.victim, x: 84, y: 222, s: 1.6, shoes: null, pose: { ...POSE.sitFloor, spine: -62, chest: -48, head: -52, legB: [-50, 70], legF: [0, 0], footF: -75, face: 'pain' } };
    const r = rig(base);
    const toe = r.toeF;
    const p: PersonProps = { ...base, pose: { ...base.pose, armF: { to: [toe[0] - 2, toe[1] + 2] }, armB: { to: [toe[0] - 8, toe[1] + 6] }, handF: 'fist' } };
    return (
      <Scene2 bg="indoor">
        <Window x={230} y={30} />
        <Person {...p} />
        <CircArrow c={[r.ankleF[0] - 2, r.ankleF[1] - 2]} r={34} a0={-10} a1={-120} w={5} />
      </Scene2>
    );
  },

  'yaralanma-kramp-ovma': () => {
    const hl = at({ x: 0, y: 0, a: 170, s: 0.9, pose: 'press', side: 'L', skin: skinOf(KRA.victim), arm: 200, sleeve: sleeveOf(KRA.victim) }, 'palm', [116, 134]);
    const hr = at({ x: 0, y: 0, a: 196, s: 0.9, pose: 'press', side: 'R', skin: skinOf(KRA.victim), arm: 200, sleeve: sleeveOf(KRA.victim) }, 'palm', [206, 146]);
    return (
      <Scene2 bg="closeup">
        <Calf skin={skinOf(KRA.victim)} />
        <Hand {...hl} />
        <Hand {...hr} />
        <CircArrow c={[66, 140]} r={15} a0={-150} a1={150} w={4} />
        <CircArrow c={[262, 140]} r={15} a0={-150} a1={150} w={4} />
      </Scene2>
    );
  },

  'yaralanma-kas-sargi': () => {
    // Tek parça elastik sargı: dizden kalçaya doğru spiral, her tur öncekinin yarısını örtüyor.
    const crepe = '#e9c9a0';
    const y0 = 98, y1 = 200;
    const W = 46, step = 23, sl = 34; // tur genişliği, kayma (yarı örtüşme), eğim
    const xs = [232, 209, 186, 163, 140]; // sağdan (diz) sola (kalça)
    const turn = (x: number, i: number) => {
      const top0 = x + sl, top1 = x + sl + W, bot0 = x - sl, bot1 = x - sl + W;
      const my = (y0 + y1) / 2;
      // yanlar hafif kavisli (bacağın etrafından dönüyor), üst/alt uç bacak hattını biraz aşıyor
      const d = `M${top0} ${y0 - 4}Q${(top0 + top1) / 2} ${y0 - 8} ${top1} ${y0 - 3}Q${x + W - 6} ${my} ${bot1} ${y1 + 3}Q${(bot0 + bot1) / 2} ${y1 + 7} ${bot0} ${y1 + 4}Q${x - 6} ${my} ${top0} ${y0 - 4}Z`;
      return (
        <g key={i}>
          {/* alttaki tura düşen gölge */}
          <path d={`M${top0 - 1} ${y0 - 2}Q${x - 9} ${my} ${bot0 - 1} ${y1 + 2}L${bot0 - 6} ${y1 + 2}Q${x - 14} ${my} ${top0 - 6} ${y0 - 2}Z`} fill={shade(crepe, 0.22)} opacity={0.6} />
          <OG sh={[{ d, f: crepe }]} />
          {[0.3, 0.55, 0.8].map((t, k) => (
            <path key={k} d={`M${top0 + W * t} ${y0 + 2}Q${x + W * t - 4} ${my} ${bot0 + W * t} ${y1 - 2}`} stroke={shade(crepe, 0.1)} stroke-width={0.9} fill="none" />
          ))}
        </g>
      );
    };
    const finger = at({ x: 0, y: 0, a: -40, s: 0.85, pose: 'point', side: 'R', skin: skinOf(KRA.victim), arm: 200, sleeve: sleeveOf(KRA.victim) }, 'tip', [218, 186]);
    const rh = at({ x: 0, y: 0, a: 196, s: 0.9, pose: 'hold', side: 'R', grip: 34, skin: skinOf(KRA.victim), arm: 200, sleeve: sleeveOf(KRA.victim) }, 'grip', [100, 48]);
    const g = handPoint(rh, 'grip');
    const last = xs[xs.length - 1];
    return (
      <Scene2 bg="closeup">
        <Thigh skin={skinOf(KRA.victim)} y0={y0} y1={y1} shorts={KRA.victim.bottomC} />
        <Hand {...finger} />
        {xs.map((x, i) => turn(x, i))}
        {/* son turdan rulo yukarı: aynı tek parça sargı */}
        <OG sh={[{ d: `M${last + sl} ${y0 - 2}L${last + sl + W} ${y0 - 1}L${g[0] + 16} ${g[1] + 8}L${g[0] - 14} ${g[1] + 12}Z`, f: tint(crepe, 0.12) }]} />
        <Hand {...rh}>
          <g transform={`translate(${g[0]} ${g[1]}) rotate(16)`}>
            <OG sh={[{ d: rrect(-17, -24, 34, 48, 9), f: crepe }, { d: ell([0, -24], 17, 5), f: shade(crepe, 0.1) }, { d: ell([0, -24], 5, 1.8), f: shade(crepe, 0.4), no: true }]} />
          </g>
        </Hand>
        <Arrow from={[150, 26]} to={[184, 64]} bend={-0.3} w={5} />
      </Scene2>
    );
  },

  'yaralanma-kas-soguk': () => {
    // Uyluğa beze sarılı buz paketi; kişinin kendi eli bastırıyor.
    const pk: P = [170, 150];
    const h = at({ x: 0, y: 0, a: 196, s: 0.95, pose: 'press', side: 'R', skin: skinOf(KRA.victim), arm: 220, sleeve: sleeveOf(KRA.victim) }, 'palm', [pk[0] + 4, pk[1] - 6]);
    return (
      <Scene2 bg="closeup">
        <Thigh skin={skinOf(KRA.victim)} shorts={KRA.victim.bottomC} />
        <IcePack x={pk[0]} y={pk[1]} w={96} h={48} a={3} />
        <Hand {...h} />
        <Timer x={56} y={46} r={15} text="20 dk" />
      </Scene2>
    );
  },

  'yaralanma-kas-yukari': () => {
    // Kanepede sırtüstü uzanan aynı kişi; sargılı baldırı iki yastıkla kalp hizasının üstünde.
    const seat = 224 - 48;
    const pil: P = [262, seat - 18];
    const ank: P = [pil[0] - 4, pil[1] - 28];
    const v: PersonProps = { ...KRA.victim, x: 160, y: seat, s: 1.15, shoes: null,
      pose: { ...POSE.lieBack, head: 172, chest: 182, face: 'neutral', legB: { to: [ank[0] + 2, ank[1]], bend: 1 }, legF: { to: ank, bend: 1 } } };
    const r = rig(v);
    const k = r.kneeF, a = r.ankleF;
    const lp = (t: number): P => [k[0] + (a[0] - k[0]) * t, k[1] + (a[1] - k[1]) * t];
    return (
      <Scene2 bg="indoor">
        <Window x={40} y={26} />
        <Sofa x={8} y={224} w={304} />
        <Pillow x={pil[0]} y={pil[1] + 8} w={58} h={18} color="#e9d9a8" />
        <Pillow x={pil[0]} y={pil[1] - 8} w={54} h={18} color="#f4f1ea" />
        <Pillow x={54} y={seat - 8} w={50} h={18} color="#e9d9a8" />
        <Person {...v} />
        <OG sh={[{ d: capsule(lp(0.2), 7.6, lp(0.85), 6.4), f: '#e9c9a0' }]} />
        <path d={`M${lp(0.4)[0]} ${lp(0.4)[1] - 7}l-2 14M${lp(0.6)[0]} ${lp(0.6)[1] - 7}l-2 14`} stroke={shade('#e9c9a0', 0.25)} stroke-width={1.1} />
        <Arrow from={[a[0] - 10, a[1] - 22]} to={[a[0] - 10, a[1] - 70]} />
      </Scene2>
    );
  },
};
