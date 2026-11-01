import type { ArtFn } from '../registry';
import * as KIT from '../kit2';
import { Scene2, Person, POSE, K, Hand, Arrow, Label, Ok, No, Bad, Waves, Car, Smoke, Table, Window, Door, Timer, Phone, Cloth, Blood, Bandage, rig, handPoint, OG, rrect, ell, circ, smooth, shade, tint } from '../kit2';
import type { PersonProps, P } from '../kit2';

const dv = (a: number): P => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
const off = (p: P, a: number, l: number): P => [p[0] + dv(a)[0] * l, p[1] + dv(a)[1] * l];
/** Başın yerel koordinatından (merkez 0,0; yarıçap 12; yüz +x, tepe -y) sahne noktası */
function headPt(r: ReturnType<typeof rig>, lx: number, ly: number): P {
  const k = r.headR / 12;
  const fa = r.headA + 90;
  const a = dv(fa), t = dv(r.headA);
  return [r.head[0] + k * (lx * a[0] - ly * t[0]), r.head[1] + k * (lx * a[1] - ly * t[1])];
}
function headPts(pp: PersonProps) {
  const r = rig(pp);
  return {
    r,
    forehead: headPt(r, 9.5, -8),
    nose: headPt(r, 13, 1.5),
    mouth: headPt(r, 11.4, 6.5),
    chin: headPt(r, 8.5, 11),
    underChin: headPt(r, 4, 12.5),
    throat: headPt(r, 0, 18),
    face: r.headA + 90,
    h: r.headA,
  };
}

/* ───────────── OYUNCULAR (rehber başına sabit) ───────────── */
type Look = Pick<PersonProps, 'who' | 'role' | 'skin' | 'hair' | 'hairC' | 'top' | 'bottom' | 'bottomC' | 'sleeve'>;
interface Cast { victim: Look; helper: Look }
/** Yetişkin TYD / ilk değerlendirme / OED / kanama */
const ADULT: Cast = {
  victim: { who: 'man', role: 'victim', skin: 0, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.denim },
  helper: { who: 'woman', role: 'helper', skin: 2, hair: 'bun', hairC: K.hair.dark, bottomC: K.pants.dark },
};
/** Çocukta TYD */
const CHILD: Cast = {
  victim: { who: 'boy', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.black, bottomC: K.pants.navy },
  helper: { who: 'man', role: 'helper', skin: 0, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.brown },
};
/** Bebekte TYD (bebek sarı tulumlu; yardımcının yalnızca elleri/kolları görünür) */
const BABY: Cast = {
  victim: { who: 'baby', skin: 0, hair: 'baby', hairC: K.hair.brown, top: '#f2c14e', bottomC: '#f2c14e' },
  helper: { who: 'woman', role: 'helper', skin: 2, hair: 'bun', hairC: K.hair.dark, bottomC: K.pants.dark },
};
/** Derlenme (koma) pozisyonu */
const DER: Cast = {
  victim: { who: 'man', role: 'victim', skin: 1, hair: 'short', hairC: K.hair.dark, bottomC: K.pants.denim },
  helper: { who: 'woman', role: 'helper', skin: 3, hair: 'ponytail', hairC: K.hair.black, bottomC: K.pants.dark },
};
/** Hava yolu tıkanması (boğulma) */
const HYT: Cast = {
  victim: { who: 'man', role: 'victim', skin: 2, hair: 'short', hairC: K.hair.black, bottomC: K.pants.denim },
  helper: { who: 'woman', role: 'helper', skin: 0, hair: 'bun', hairC: K.hair.auburn, bottomC: K.pants.dark },
};
/** Nöbet */
const NOB: Cast = {
  victim: { who: 'man', role: 'victim', skin: 3, hair: 'short', hairC: K.hair.black, bottomC: K.pants.grey },
  helper: { who: 'man', role: 'helper', skin: 1, hair: 'short', hairC: K.hair.brown, bottomC: K.pants.navy },
};

/** pose parametresini tarayıp eklemin y'sini hedefe en yakın yapan kişiyi döndürür */
function fit(make: (v: number) => PersonProps, joint: keyof ReturnType<typeof rig>, ty: number, lo: number, hi: number, step = 0.5): PersonProps {
  let best = make(lo), bd = Infinity;
  for (let v = lo; v <= hi; v += step) {
    const pp = make(v);
    const y = (rig(pp)[joint] as P)[1];
    const d = Math.abs(y - ty);
    if (d < bd) { bd = d; best = pp; }
  }
  return best;
}

type SideMode = 'shout' | 'tilt' | 'breath';
/** Yandan yakın-orta plan: sırtüstü yatan kişi (baş solda, ayaklar çerçeve dışında) ve onun UZAK yanında,
 *  omuz hizasında diz çökmüş, sola dönük yardımcı (derinlik için biraz yukarıda; dizleri kişinin gövdesinin arkasında).
 *  shout: iki el omuzlarda, seslenir. tilt: uzak el alında, yakın elin parmakları çene altında.
 *  breath: uzak el alında burnu sıkar, yakın el çeneyi kaldırır, ağız ağıza. */
function SideHead({ c, mode, kid = false, n }: { c: Cast; mode: SideMode; kid?: boolean; n?: string }) {
  const gy = 222;
  const vs = kid ? 2.6 : 2.0;
  const hs = 1.85;
  const tilt = mode === 'shout' ? 178 : kid ? 168 : 160;
  const victim: PersonProps = { ...c.victim, x: 62, ax: 'head', y: gy + 2, s: vs, pose: { ...POSE.lieBack, head: tilt, armB: [-4, -4], armF: [2, 2] } };
  const v = rig(victim);
  const hp = headPts(victim);
  const forehead: P = [hp.forehead[0] + 1, hp.forehead[1] - 1];
  const chin: P = [hp.underChin[0] + 3, hp.underChin[1] + 2];
  const nose: P = [hp.nose[0] - 1, hp.nose[1] - 1];
  const mouth = hp.mouth;
  let helper: PersonProps;
  if (mode === 'breath') {
    helper = {
      ...c.helper, x: mouth[0] + 6, ax: 'mouth', y: mouth[1] - 3, ay: 'mouth', s: hs, flip: true,
      pose: { spine: 5, chest: 25, head: 45, legB: [100, 182], legF: [94, 180],
        armB: { to: nose, bend: 1 }, handB: { shape: 'mitten', a: -50 }, armF: { to: chin, bend: 1 }, handF: { shape: 'mitten', a: -20 }, face: 'closed' },
    };
  } else {
    const tgtB: P = mode === 'shout' ? [v.shoulderB[0] + 8, v.shoulderB[1] - 4] : forehead;
    const tgtF: P = mode === 'shout' ? [v.shoulderF[0] + 2, v.shoulderF[1] - 4] : chin;
    helper = {
      ...c.helper, x: v.neck[0] + (kid ? 70 : 80), y: gy - 34, ay: 'kneeF', s: hs, flip: true,
      pose: { spine: -42, chest: -26, head: mode === 'shout' ? 4 : -4, legB: [98, 182], legF: [92, 180],
        armF: { to: tgtF, bend: 1 }, handF: { shape: mode === 'tilt' ? 'mitten' : 'flat', a: mode === 'shout' ? -70 : -30 },
        armB: { to: tgtB, bend: 1 }, handB: { shape: 'flat', a: mode === 'shout' ? -70 : -20 },
        face: mode === 'shout' ? 'speak' : 'neutral' },
    };
  }
  const h = rig(helper);
  const ch = v.chest;
  const ax = Math.max(ch[0] + 16, h.kneeF[0] + 30);
  return (
    <Scene2 bg="indoor" gy={gy - 40}>
      <Person {...helper} only={['legB', 'legF', 'torso']} shadow={false} />
      <Person {...victim} />
      <Person {...helper} only={['armB']} shadow={false} />
      <Person {...helper} only={['head', 'armF']} shadow={false} />
      {mode === 'shout' && <Waves x={h.mouth[0] - 12} y={h.mouth[1] + 6} a={145} n={3} r={9} />}
      {mode === 'shout' && [v.shoulderF].map((t, i) => <path key={i} d={`M${t[0] - 14} ${t[1] - 22}l-6 -8M${t[0] + 10} ${t[1] - 26}l4 -9`} stroke={K.action} stroke-width={3} stroke-linecap="round" />)}
      {mode === 'tilt' && <Arrow from={off(forehead, -60, 10)} to={off(forehead, 205, 34)} bend={-0.35} w={5} />}
      {mode === 'tilt' && <Arrow from={[chin[0] + 8, chin[1] + 34]} to={[chin[0] + 2, chin[1] + 2]} w={5} />}
      {mode === 'breath' && <path d={`M${ch[0] - 10} ${ch[1] - 8}Q${ax - 4} ${ch[1] - 26} ${ax + 34} ${ch[1] - 6}`} fill="none" stroke={K.action} stroke-width={2.6} stroke-dasharray="5 5" />}
      {mode === 'breath' && <Arrow from={[ax, ch[1] - 20]} to={[ax, ch[1] - 62]} />}
      {n && <Label x={282} y={34} text={n} size={20} />}
    </Scene2>
  );
}

/** YAKIN PLAN (yandan, baş-omuz): sırtüstü yatan kişinin başı solda, büyük. Yardımcının bedeni çizilmez (tilt);
 *  iki önkol üst kenardan girer, kesişmez: sol önkol alına (avuç alında), sağ önkol çeneye (iki parmak çene kemiğinin altında).
 *  breath: yardımcının başı ve omuzları sağ üstten eğilir, ağzı yaralının ağzında; alındaki elin başparmak+işaret parmağı burnu sıkar. */
function CloseHead({ c, mode, kid = false, n, dbg = false }: { c: Cast; mode: 'tilt' | 'breath'; kid?: boolean; n?: string; dbg?: boolean }) {
  const gy = 182;
  const vs = kid ? 4.0 : 3.4;
  const tilt = mode === 'breath' ? (kid ? 174 : 170) : kid ? 166 : 158;
  const vx = mode === 'breath' ? 96 : 104;
  const victim: PersonProps = { ...c.victim, x: vx, ax: 'head', y: 218, s: vs, shadow: false, pose: { ...POSE.lieBack, head: tilt, armB: [-4, -4], armF: [2, 2], face: 'closed' } };
  const v = rig(victim);
  const hp = headPts(victim);
  const hs = 0.9;
  const sk = c.helper.skin ?? 1;
  const sleeve = c.helper.top ?? K.role.helper;
  // alın eli
  const fhA = mode === 'breath' ? 128 : 196;
  const fh0 = { x: 0, y: 0, a: fhA, s: hs, pose: (mode === 'breath' ? 'pinch' : 'press') as any, side: 'L' as const };
  const fh = mode === 'breath' ? placeHand(fh0, 'pinch', [hp.nose[0] - 1, hp.nose[1] + 1]) : placeHand(fh0, 'palm', headPt(v, 8, -10));
  // çene eli: parmak uçları çene kemiğinin altında, parmaklar sola-yukarı; önkol sağ-aşağı
  const chA = -42;
  const ch0 = { x: 0, y: 0, a: chA, s: hs, pose: 'press' as any, side: 'R' as const };
  const chT = headPt(v, 8, 13.5);
  const chH = placeHand(ch0, 'tip', chT);
  const ch = v.chest;
  let helper: PersonProps | null = null;
  if (mode === 'breath') {
    helper = { ...c.helper, x: hp.mouth[0] + 1, ax: 'mouth', y: hp.mouth[1] - 1, ay: 'mouth', s: vs * 0.88, shadow: false,
      pose: { spine: 30, chest: 18, head: 8, legB: [100, 182], legF: [94, 180], armB: [60, 60], armF: [60, 60], handB: 'none', handF: 'none', face: 'closed' } };
  }
  const hr = helper ? rig(helper) : null;
  return (
    <Scene2 bg="indoor" gy={gy}>
      <Person {...victim} />
      <Forearm at={[fh.x, fh.y]} ang={mode === 'breath' ? -142 : fhA + 90} s={hs} skin={sk} sleeve={sleeve} />
      {helper && <Person {...helper} only={['torso', 'head']} />}
      <Hand {...fh} view="back" arm={0} skin={sk} />
      <Forearm at={[chH.x, chH.y]} ang={chA + 90} s={hs} skin={sk} sleeve={sleeve} />
      <Hand {...chH} view="back" arm={0} skin={sk} />
      {mode === 'tilt' && <Arrow from={off(hp.forehead, -150, 22)} to={off(hp.forehead, 160, 52)} bend={0.35} w={6} />}
      {mode === 'tilt' && <Arrow from={[chT[0] + 34, chT[1] + 6]} to={[chT[0] + 22, chT[1] - 34]} w={6} />}
      {mode === 'breath' && <Arrow from={[ch[0] + 40, ch[1] - 14]} to={[ch[0] + 40, ch[1] - 58]} />}
      {n && <Label x={282} y={34} text={n} size={20} />}
      {dbg && [hp.forehead, hp.nose, hp.mouth, hp.chin, hp.underChin, chT, ...(hr ? [hr.mouth] : [])].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={2.5} fill={['red', 'blue', 'green', 'magenta', 'cyan', 'black', 'yellow'][i]} />)}
    </Scene2>
  );
}

/** Yandan kalp masajı: yardımcı kişinin uzak yanında göğüs hizasında diz çökmüş, kollar dümdüz, omuzlar ellerin dikey üstünde. */
function Cpr({ c }: { c: Cast }) {
  const victim: PersonProps = { ...c.victim, x: 172, y: 230, s: 1.5, pose: POSE.lieBack };
  const v = rig(victim);
  const ch: P = [v.chest[0], v.chest[1]];
  const resc: PersonProps = {
    ...c.helper, x: ch[0], ax: 'wristF', y: 226, s: 1.5, flip: true,
    pose: { spine: -60, chest: -58, head: -40, legB: [92, 182], legF: [86, 180], armB: [90, 90], armF: [90, 90], handB: { shape: 'flat', a: -90 }, handF: { shape: 'flat', a: -86 }, face: 'neutral' },
  };
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

/** Derlenme pozisyonu (son hali): yan yatmış, üst el yanağın altında, üst diz önde yerde; ağız yere dönük. */
function recoveryProps(c: Cast, x: number, y: number, s: number): PersonProps {
  const base: PersonProps = { ...c.victim, x, y, s, pose: { ...POSE.recovery, legF: [74, -6], legB: [2, 2] } };
  const r0 = rig(base);
  return { ...base, pose: { ...base.pose, armF: { to: [r0.head[0] + 2, r0.head[1] + r0.headR * 0.95] } } };
}
function Recovery({ c, tilt = false }: { c: Cast; tilt?: boolean }) {
  const p = recoveryProps(c, 192, 228, 1.62);
  const r = rig(p);
  const top = headPt(r, 0, -13);
  return (
    <Scene2 bg="indoor">
      <Person {...p} />
      <Waves x={r.head[0] - 4} y={r.head[1] - 26} a={-110} n={3} r={6} color={K.water} />
      {tilt && <Arrow from={[top[0] + 22, top[1] - 26]} to={[top[0] - 18, top[1] - 6]} bend={0.35} w={5} />}
    </Scene2>
  );
}
/** Derlenme pozisyonunda, örtülü; yardımcı başının yanında diz çökmüş, nefesini izliyor. */
function WatchBreath({ c }: { c: Cast }) {
  const victim = recoveryProps(c, 222, 226, 1.18);
  const v = rig(victim);
  const fy = 226;
  const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const pts: P[] = [
    [v.neck[0] + 6, v.neck[1] - 8], [v.shoulderF[0] + 16, v.shoulderF[1] - 13], [v.hip[0] - 8, v.hip[1] - 20], [v.hip[0] + 30, v.hip[1] - 12],
    [v.ankleB[0] - 10, v.ankleB[1] - 10], [Math.max(v.ankleF[0], v.ankleB[0]) - 4, Math.min(v.ankleF[1], v.ankleB[1]) - 18], [Math.max(v.toeB[0], v.toeF[0]) + 12, v.ankleB[1] - 4], [Math.max(v.toeB[0], v.toeF[0]) + 12, fy - 6],
    [v.ankleF[0] + 8, fy - 2], [v.kneeF[0] + 4, v.kneeF[1] + 9], [v.kneeF[0] - 22, fy - 2], [v.neck[0] + 2, fy - 8],
  ];
  let blanket = `M${mid(pts[pts.length - 1], pts[0]).join(' ')}`;
  for (let i = 0; i < pts.length; i++) blanket += `Q${pts[i].join(' ')} ${mid(pts[i], pts[(i + 1) % pts.length]).join(' ')}`;
  blanket += 'Z';
  const helper: PersonProps = { ...c.helper, x: v.head[0] - 66, y: 220, s: 1.18,
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
}
/** Sırtüstü yatan, boynuna kadar örtülü yaralı; yardımcı uzak yanında diz çökmüş, eli omzunda, onunla konuşuyor. */
function CoverWatch({ c }: { c: Cast }) {
  const victim: PersonProps = { ...c.victim, x: 186, y: 230, s: 1.35, pose: { ...POSE.lieBack, face: 'worried' } };
  const v = rig(victim);
  const helper: PersonProps = { ...c.helper, x: v.chest[0] + 34, y: 214, s: 1.35, flip: true,
    pose: { ...POSE.kneelSit, spine: -72, chest: -56, head: -34, armF: { to: [v.shoulderF[0] + 4, v.shoulderF[1] - 6] }, armB: { at: 'kneeF', d: [8, -4] }, face: 'speak' } };
  const hr = rig(helper);
  return (
    <Scene2 bg="indoor">
      <Person {...helper} only={['legB', 'armB', 'legF', 'torso', 'head']} />
      <Person {...victim} />
      <KIT.Blanket x1={v.neck[0] + 4} x2={v.toeF[0] + 10} y={234} h={34} />
      <Person {...helper} only={['armF']} />
      <Waves x={hr.mouth[0] - 12} y={hr.mouth[1] + 2} a={160} n={2} r={6} />
    </Scene2>
  );
}

/** Hand a (0 = parmaklar yukarı) → parmak yönü (sahne açısı) dönüşümü: θ = a - 90 */
const handA = (theta: number) => theta + 90;

/** Bilekten farklı açıyla çıkan önkol (Hand arm=0 ile birlikte; elden ÖNCE çizilir) */
function Forearm({ at, ang, s = 1, skin = 1, sleeve = K.role.helper, len = 320 }: { at: P; ang: number; s?: number; skin?: number; sleeve?: string; len?: number }) {
  const sk = K.skin[skin];
  const b = off(at, ang, len);
  const c0 = off(at, ang, 22 * s);
  const { capsule } = KIT;
  return <OG ow={1.5 * (0.6 + 0.4 * s)} sh={[{ d: capsule(off(at, ang, -4 * s), 11.6 * s, b, 13.2 * s), f: sk }, { d: capsule(c0, 14.4 * s, b, 15.4 * s), f: sleeve }]} />;
}

/** Bebek masada sırtüstü (baş solda, baş düz); yardımcı masanın arkasında ayakta, öne eğilmiş:
 *  ağzı bebeğin ağzını VE burnunu birlikte kapatıyor, bir eli alında, bir parmak çene altında. */
function BabyBreath({ n, dbg = false }: { n?: string; dbg?: boolean }) {
  // Yakın plan yandan: bebek sert yüzeyde sırtüstü, baş düz (nötr), yüzü yukarı. Yardımcının başı ve omzu sol üstten iner,
  // yüzü aşağı; ağzı bebeğin ağzını VE burnunu birlikte kapatıyor. Bir el alında (sol üstten), bir parmak çene altında (sağ alttan).
  const surf = 200;
  const baby: PersonProps = { ...BABY.victim, x: 92, ax: 'head', y: surf, s: 3.4, shadow: false, pose: { ...POSE.lieBack, head: 180, legB: [-12, -8], legF: [-16, -4], face: 'closed' } };
  const b = rig(baby);
  const hp = headPts(baby);
  const seal: P = [(hp.mouth[0] + hp.nose[0]) / 2, (hp.mouth[1] + hp.nose[1]) / 2];
  const sk = BABY.helper.skin ?? 2;
  const helper: PersonProps = { ...BABY.helper, x: seal[0] + 2, ax: 'mouth', y: seal[1] - 2, ay: 'mouth', s: 2.5, shadow: false,
    pose: { spine: 30, chest: 18, head: 6, legB: [100, 182], legF: [94, 180], armB: [60, 60], armF: [60, 60], handB: 'none', handF: 'none', face: 'closed' } };
  const hr = rig(helper);
  const fhA = 210;
  const fh = placeHand({ x: 0, y: 0, a: fhA, s: 0.72, pose: 'press', side: 'L' }, 'palm', headPt(b, 4, -11));
  const chA = -40;
  const chT = headPt(b, 6, 13.5);
  const fing = placeHand({ x: 0, y: 0, a: chA, s: 0.72, pose: 'point', side: 'R' }, 'tip', chT);
  const ch = b.chest;
  return (
    <Scene2 bg="indoor" gy={150}>
      <OG sh={[{ d: rrect(-10, surf - 2, 340, 90, 4), f: K.wood }, { d: rrect(-10, surf - 2, 340, 10, 3), f: tint(K.wood, 0.15) }]} />
      <Person {...baby} />
      <Forearm at={[fh.x, fh.y]} ang={-150} s={0.72} skin={sk} />
      <Hand {...fh} view="back" arm={0} skin={sk} />
      <Person {...helper} only={['torso', 'head']} />
      <Forearm at={[fing.x, fing.y]} ang={chA + 90} s={0.72} skin={sk} />
      <Hand {...fing} view="back" arm={0} skin={sk} />
      <Arrow from={[ch[0] + 30, ch[1] - 14]} to={[ch[0] + 30, ch[1] - 56]} />
      {n && <Label x={282} y={34} text={n} size={20} />}
      {dbg && [hp.forehead, hp.nose, hp.mouth, hp.chin, chT, hr.mouth].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={2.5} fill={['red', 'blue', 'green', 'magenta', 'black', 'yellow'][i]} />)}
    </Scene2>
  );
}

/** Köşede küçük ek çizim çerçevesi (TL x,y). İçerik kırpılır. */
let insetId = 0;
function Inset({ x, y, w, h, children, bg = '#fff' }: { x: number; y: number; w: number; h: number; children: any; bg?: string }) {
  const id = 'iy1-inset-' + ++insetId;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={10} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={bg} />
      <g clip-path={`url(#${id})`}>{children}</g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={K.out} stroke-width={2} />
    </g>
  );
}

/** Kurtarıcının diz çöküp yatan kişinin üstüne eğildiği duruş (sola bakar). */
function kneelOver(at: P, y: number, s: number, extra: Partial<PersonProps['pose']> & object, rest: Partial<PersonProps> = {}): PersonProps {
  return {
    x: at[0], ax: 'shoulderF', y, s, flip: true, who: 'man', role: 'helper',
    ...rest,
    pose: { spine: -58, chest: -56, head: -30, legB: [70, 178], legF: [66, 176], ...extra },
  } as PersonProps;
}

/** Göğüste derinlik işareti: dikey ölçü çizgisi ve "⅓" */
function DepthMark({ x, y1, y2, text }: { x: number; y1: number; y2: number; text: string }) {
  return (
    <g>
      <path d={`M${x - 6} ${y1}H${x + 6}M${x} ${y1}V${y2}M${x - 6} ${y2}H${x + 6}`} stroke={K.out} stroke-width={2.4} stroke-linecap="round" />
      <Label x={x + 10} y={(y1 + y2) / 2} text={text} size={14} anchor="start" />
    </g>
  );
}

function OlayYeri() {
  const victim: PersonProps = { ...ADULT.victim, x: 196, y: 214, s: 0.95, pose: POSE.lieBack };
  const helper: PersonProps = { ...ADULT.helper, x: 62, y: 230, s: 1.05, pose: { ...POSE.stand, armB: [-160, -95], handB: { shape: 'flat' }, face: 'worried' } };
  const hr = rig(helper);
  const eye: P = [hr.head[0] + 10, hr.head[1] - 2];
  const hz: { c: P; r: number }[] = [
    { c: [262, 150], r: 34 }, // araç
    { c: [196, 58], r: 30 }, // duman
    { c: [282, 62], r: 26 }, // kablo
  ];
  return (
    <Scene2 bg="outdoor" gy={170} ground="pavement">
      <rect x={0} y={182} width={320} height={4} fill="#fff" opacity={0.7} />
      <Car x={262} y={178} s={0.62} color="#d0473d" />
      <path d="M248 158h-14M246 166h-12M250 150h-10" stroke={K.ink} stroke-width={2} stroke-linecap="round" opacity={0.6} />
      <Smoke x={162} y={30} w={70} h={50} kind="cloud" op={0.85} />
      <rect x={300} y={20} width={8} height={160} fill="#8a8f98" stroke={K.out} stroke-width={1.5} />
      <path d="M304 30Q290 40 282 74" fill="none" stroke={K.out} stroke-width={3} />
      <path d="M282 74l-5 6l7 -1l-4 7" fill="none" stroke="#ffd64a" stroke-width={2.4} stroke-linejoin="round" />
      <Person {...victim} />
      <Person {...helper} />
      {hz.map((z, i) => (
        <circle key={i} cx={z.c[0]} cy={z.c[1]} r={z.r} fill="none" stroke={K.action} stroke-width={3.4} stroke-dasharray="7 5" />
      ))}
      <Arrow from={[eye[0] + 18, eye[1] - 8]} to={[hz[1].c[0] - 30, hz[1].c[1] + 14]} w={4} bend={-0.1} />
      <Arrow from={[eye[0] + 22, eye[1] + 2]} to={[hz[0].c[0] - 36, hz[0].c[1] - 4]} w={4} bend={0.08} />
      <Arrow from={[eye[0] + 24, eye[1] - 4]} to={[hz[2].c[0] - 28, hz[2].c[1] + 4]} w={4} bend={-0.12} />
    </Scene2>
  );
}

function CocukKpr() {
  // Kurtarıcı çocuğun YANINDA (uzak tarafında) diz çöker: uylukları dik, dizleri yerde çocuğun gövdesinin arkasında
  // (üstünde değil). Omzu elin tam üstünde, bası yapan kol dümdüz; el topuğu göğüs kemiğinin alt yarısında; öbür el alında.
  const victim: PersonProps = { ...CHILD.victim, x: 160, y: 232, s: 1.75, pose: { ...POSE.lieBack, behind: ['armF'] } };
  const v = rig(victim);
  const c: P = [v.chest[0] + 0.45 * (v.belly[0] - v.chest[0]), v.chest[1] + 3];
  const helper: PersonProps = {
    ...CHILD.helper, x: c[0], ax: 'wristF', y: c[1] - 6, ay: 'wristF', s: 1.25, flip: true, shadow: false,
    pose: {
      spine: -72, chest: -62, head: -30,
      legB: [96, 182], legF: [92, 180],
      armF: [90, 90], handF: { shape: 'flat', a: -88 },
      armB: { to: [v.head[0] + 11, v.head[1] - 21] }, handB: { shape: 'flat', a: -10 },
      face: 'neutral',
    },
  };
  return (
    <Scene2 bg="indoor" gy={182}>
      <Person {...helper} />
      <Person {...victim} />
      <Arrow from={[c[0] + 46, 64]} to={[c[0] + 46, 112]} />
      <Label x={c[0] + 64} y={88} text="⅓" size={16} anchor="start" />
      <Label x={262} y={34} text="100–120/dk" size={14} />
    </Scene2>
  );
}

function KprElYeri() {
  const vsk = ADULT.victim.skin ?? 0;
  // Yukarıdan çıplak göğüs. Alttaki elin topuğu göğüs kemiğinin alt yarısında, meme uçları hizasında (ksifoidin üstünde);
  // üstteki el onun üstünde, parmakları alttakinin parmaklarının arasına kenetlenmiş; alttaki parmaklar göğüsten kalkık.
  const sk = K.skin[vsk];
  const ln = shade(sk, 0.25);
  const nipY = 96;
  const heel: P = [160, nipY + 6];
  const h1 = placeHand({ x: 0, y: 0, a: -62, s: 1.2, pose: 'press', side: 'R' }, 'palm', [heel[0] + 1, heel[1] - 2]);
  const h2 = { ...h1, x: h1.x - 1, y: h1.y - 4, a: -66, pose: 'fist' as const, side: 'L' as const };
  return (
    <Scene2 bg="closeup">
      <OG sh={[
        { d: 'M-10 -10H330V250H-10Z', f: '#d8dee6' },
        { d: smooth([[30, 250], [42, 150], [28, 60], [36, 18], [100, 6], [160, 14], [220, 6], [284, 18], [292, 60], [278, 150], [290, 250]], false, 1) + 'Z', f: sk },
      ]} />
      <path d="M70 84Q110 106 152 86M168 86Q210 106 250 84" fill="none" stroke={ln} stroke-width={2} />
      <circle cx={112} cy={nipY} r={3.6} fill={shade(sk, 0.3)} />
      <circle cx={208} cy={nipY} r={3.6} fill={shade(sk, 0.3)} />
      <path d="M100 26Q160 40 220 26" fill="none" stroke={ln} stroke-width={2} />
      <path d={`M160 34V150`} stroke={shade(sk, 0.3)} stroke-width={3} stroke-dasharray="6 5" stroke-linecap="round" />
      <path d="M152 150L160 166L168 150" fill={tint(sk, 0.1)} stroke={shade(sk, 0.35)} stroke-width={2.4} stroke-linejoin="round" />
      <path d="M66 140Q110 176 152 152M254 140Q210 176 168 152" fill="none" stroke={shade(sk, 0.3)} stroke-width={2.6} />
      <path d={`M120 ${nipY}H200`} stroke={K.action} stroke-width={1.6} stroke-dasharray="3 4" opacity={0.8} />
      <Hand {...h1} arm={300} sleeve={K.role.helper} skin={2} />
      <Hand {...h2} arm={300} sleeve={K.role.helper} skin={2} />
      <Ok x={heel[0] - 34} y={heel[1] + 28} r={13} />
    </Scene2>
  );
}

function BebekBasNotr() {
  // Bebek sert düz yüzeyde sırtüstü; bir el alnında başı nötr tutuyor, öbür elin bir-iki parmak ucu çene kemiğinin altında
  // çeneyi hafifçe kaldırıyor. Göğüste el yok. Ek çizimde aşırı geriye bükülmüş baş yasak.
  const surf = 178;
  const b: PersonProps = { ...BABY.victim, x: 86, ax: 'head', y: surf, s: 3.0, shadow: false, pose: { ...POSE.lieBack, head: 180, legB: [-10, -10], legF: [-14, -6] } };
  const p = headPts(b);
  // alındaki el: avuç alında, parmaklar başın tepesine doğru; önkol yukarı-sola
  const fh = placeHand({ x: 0, y: 0, a: handA(p.h + 18), s: 0.62, pose: 'press', side: 'R' }, 'palm', [p.forehead[0] - 5, p.forehead[1] - 3]);
  // çenedeki el: işaret parmağı ucu çene kemiğinin altında; el yukarıda, önkol dik yukarı-sağa (göğsün üstünden geçmez)
  const fing = placeHand({ x: 0, y: 0, a: handA(112), s: 0.6, pose: 'point', side: 'L' }, 'tip', [p.underChin[0] + 2, p.underChin[1] + 2]);
  const bad: PersonProps = { ...BABY.victim, x: 226, y: 62, ax: 'head', ay: 'head', s: 1.5, pose: { ...POSE.lieBack, head: 128 } };
  return (
    <Scene2 bg="closeup">
      <OG sh={[{ d: rrect(-10, surf, 340, 80, 4), f: K.wood }, { d: rrect(-10, surf, 340, 10, 3), f: tint(K.wood, 0.15) }]} />
      <Person {...b} />
      <Forearm at={[fh.x, fh.y]} ang={-118} s={fh.s} skin={BABY.helper.skin} />
      <Hand {...fh} arm={0} skin={BABY.helper.skin} />
      <Forearm at={[fing.x, fing.y]} ang={-62} s={fing.s} skin={BABY.helper.skin} />
      <Hand {...fing} arm={0} skin={BABY.helper.skin} />
      <Ok x={30} y={150} r={13} />
      <Inset x={196} y={14} w={112} h={92}>
        <rect x={196} y={82} width={112} height={30} fill={K.wood} />
        <Person {...bad} y={82} ay="ground" shadow={false} />
        <No x={252} y={58} r={34} />
      </Inset>
    </Scene2>
  );
}

/* ───────────── OED (AED) ───────────── */

const AED_C = '#3aa76d';
/** Kalp + şimşek simgesi (MERKEZ x,y, boyut r) */
function HeartBolt({ x, y, r = 10, heart = K.safe, bolt = '#fff' }: { x: number; y: number; r?: number; heart?: string; bolt?: string }) {
  const k = r / 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M0 9C-4 5 -11 1 -11 -4.5C-11 -8.5 -8 -10.5 -5 -10.5C-2.6 -10.5 -1 -9 0 -7.4C1 -9 2.6 -10.5 5 -10.5C8 -10.5 11 -8.5 11 -4.5C11 1 4 5 0 9Z" fill={heart} stroke={K.out} stroke-width={1.4 / k} />
      <path d="M1.5 -8L-4 -1H0L-2 6L4 -2H0Z" fill={bolt} stroke={bolt === '#fff' ? 'none' : K.out} stroke-width={0.8} stroke-linejoin="round" />
    </g>
  );
}
/** Şimşek simgesi (MERKEZ) */
function Bolt({ x, y, s = 1, color = '#fff' }: { x: number; y: number; s?: number; color?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M2 -10L-6 1H-0.5L-3 10L6 -2H0.5Z" fill={color} stroke={K.out} stroke-width={1.2 / s} stroke-linejoin="round" />;
}
/** Açık OED cihazı (üstten/önden). MERKEZ x,y; s ölçek. ecg: ekranda ritim; lit: şok düğmesi yanıyor */
function Aed({ x, y, s = 1, ecg = false, lit = false, power = true }: { x: number; y: number; s?: number; ecg?: boolean; lit?: boolean; power?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <OG ow={1.5 / s} sh={[
        { d: rrect(-46, -34, 92, 68, 12), f: AED_C },
        { d: rrect(-40, -28, 80, 56, 8), f: '#eef1f3' },
        { d: rrect(-34, -22, 38, 22, 3), f: K.screen },
        { d: circ([-15, 14], 8), f: power ? K.safe : '#bbb' },
        { d: circ([22, 4], 13), f: lit ? K.action : '#f3a25a' },
      ]} />
      {ecg && <path d="M-32 -11h7l3 -7l4 14l3 -10l2 3h11" fill="none" stroke="#4be38a" stroke-width={1.6} stroke-linejoin="round" />}
      <path d="M-15 8.5v5M-18.6 10.4a5 5 0 1 0 7.2 0" fill="none" stroke="#fff" stroke-width={1.8} stroke-linecap="round" />
      <Bolt x={22} y={4} s={0.9} color="#fff" />
      {[0, 1, 2].map((i) => <rect key={i} x={10 + i * 8} y={-22} width={4} height={14} rx={2} fill="#9aa3ad" />)}
    </g>
  );
}
/** Elektrot pedi (MERKEZ x,y; a dönüş). icon: kişi simgesi türü */
function Pad({ x, y, w = 40, h = 30, a = 0, icon = 'heart', frame = true }: { x: number; y: number; w?: number; h?: number; a?: number; icon?: 'heart' | 'child' | 'baby'; frame?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      {frame && <rect x={-w / 2 - 7} y={-h / 2 - 7} width={w + 14} height={h + 14} rx={8} fill="none" stroke={K.action} stroke-width={3.4} />}
      <OG sh={[{ d: rrect(-w / 2, -h / 2, w, h, 6), f: '#fbfaf7' }, { d: rrect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 4), f: '#e9eef2', no: true }]} />
      {icon === 'heart' && <HeartBolt x={0} y={1} r={Math.min(w, h) * 0.26} heart={K.danger} />}
      {icon !== 'heart' && <Glyph x={0} y={0} k={Math.min(w, h) / 30} baby={icon === 'baby'} />}
    </g>
  );
}
/** Küçük kişi simgesi (çocuk / bebek) */
function Glyph({ x, y, k = 1, baby }: { x: number; y: number; k?: number; baby?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} fill={K.ink}>
      {baby ? (
        <g>
          <circle cx={0} cy={-5} r={5.5} />
          <path d="M-4.5 1Q0 -1 4.5 1L4 9Q0 11 -4 9Z" />
        </g>
      ) : (
        <g>
          <circle cx={0} cy={-7} r={4} />
          <path d="M-5 -2H5V5H3V10H-3V5H-5Z" />
        </g>
      )}
    </g>
  );
}

/** Yukarıdan çıplak gövde (göğüs). cx, top = omuz hizası; w = omuzda yarı genişlik; L = boy. back: sırt */
function Torso({ cx, top, w, L, skin = 1, kind = 'adult', back = false, armR = true }: { cx: number; top: number; w: number; L: number; skin?: number; kind?: 'adult' | 'child' | 'baby'; back?: boolean; armR?: boolean }) {
  const sk = K.skin[skin];
  const ln = shade(sk, 0.25);
  const waist = kind === 'adult' ? 0.8 : kind === 'child' ? 0.85 : 0.95;
  const body = smooth([
    [cx - w * 0.24, top - L * 0.16], [cx - w * 0.26, top - L * 0.04], [cx - w * 0.85, top], [cx - w, top + L * 0.12], [cx - w * 0.92, top + L * 0.42],
    [cx - w * waist, top + L * 0.75], [cx - w * waist, top + L * 1.2], [cx + w * waist, top + L * 1.2], [cx + w * waist, top + L * 0.75],
    [cx + w * 0.92, top + L * 0.42], [cx + w, top + L * 0.12], [cx + w * 0.85, top], [cx + w * 0.26, top - L * 0.04], [cx + w * 0.24, top - L * 0.16],
  ], false, 0.8) + 'Z';
  const arm = (sgn: number) => capsuleK([cx + sgn * w * 1.0, top + L * 0.14], w * 0.24, [cx + sgn * w * 1.08, top + L * 1.2], w * 0.2);
  const nip = top + L * 0.36;
  return (
    <g>
      <OG sh={[{ d: arm(-1), f: shade(sk, 0.08) }, ...(armR ? [{ d: arm(1), f: shade(sk, 0.08) }] : []), { d: body, f: sk }]} />
      {!back ? (
        <g fill="none" stroke={ln} stroke-width={1.8} stroke-linecap="round">
          <path d={`M${cx - w * 0.75} ${top + L * 0.06}Q${cx - w * 0.35} ${top + L * 0.12} ${cx - 3} ${top + L * 0.06}M${cx + 3} ${top + L * 0.06}Q${cx + w * 0.35} ${top + L * 0.12} ${cx + w * 0.75} ${top + L * 0.06}`} />
          {kind === 'adult' && <path d={`M${cx - w * 0.78} ${top + L * 0.32}Q${cx - w * 0.4} ${top + L * 0.48} ${cx - 4} ${top + L * 0.36}M${cx + 4} ${top + L * 0.36}Q${cx + w * 0.4} ${top + L * 0.48} ${cx + w * 0.78} ${top + L * 0.32}`} />}
          <circle cx={cx - w * 0.45} cy={nip} r={2.6} fill={shade(sk, 0.3)} stroke="none" />
          <circle cx={cx + w * 0.45} cy={nip} r={2.6} fill={shade(sk, 0.3)} stroke="none" />
          <circle cx={cx} cy={top + L * 1.0} r={2.4} fill={shade(sk, 0.35)} stroke="none" />
        </g>
      ) : (
        <g fill="none" stroke={ln} stroke-width={1.8} stroke-linecap="round">
          <path d={`M${cx} ${top - L * 0.02}V${top + L * 1.1}`} stroke-dasharray="2 5" />
          <path d={`M${cx - w * 0.2} ${top + L * 0.12}Q${cx - w * 0.6} ${top + L * 0.1} ${cx - w * 0.66} ${top + L * 0.3}Q${cx - w * 0.5} ${top + L * 0.48} ${cx - w * 0.22} ${top + L * 0.5}`} />
          <path d={`M${cx + w * 0.2} ${top + L * 0.12}Q${cx + w * 0.6} ${top + L * 0.1} ${cx + w * 0.66} ${top + L * 0.3}Q${cx + w * 0.5} ${top + L * 0.48} ${cx + w * 0.22} ${top + L * 0.5}`} />
        </g>
      )}
    </g>
  );
}
const capsuleK = (a: P, ra: number, b: P, rb: number) => KIT.capsule(a, ra, b, rb);

/** Yukarıdan baş (gövdenin üstünde; MERKEZ) */
function TopHead({ x, y, r, skin = 1, hairC = K.hair.dark, back = false, baby = false }: { x: number; y: number; r: number; skin?: number; hairC?: string; back?: boolean; baby?: boolean }) {
  const sk = K.skin[skin];
  return (
    <g>
      <OG sh={[{ d: ell([x, y], r * 0.92, r), f: back ? hairC : sk }, ...(back || baby ? [] : [{ d: `M${x - r * 0.92} ${y + 1}C${x - r} ${y - r * 1.3} ${x + r} ${y - r * 1.3} ${x + r * 0.92} ${y + 1}C${x + r * 0.6} ${y - r * 0.5} ${x - r * 0.6} ${y - r * 0.5} ${x - r * 0.92} ${y + 1}Z`, f: hairC }])]} />
      {!back && (
        <g fill="none" stroke={K.ink} stroke-width={1.5} stroke-linecap="round">
          <path d={`M${x - r * 0.45} ${y + r * 0.15}q${r * 0.15} ${r * 0.12} ${r * 0.3} 0M${x + r * 0.15} ${y + r * 0.15}q${r * 0.15} ${r * 0.12} ${r * 0.3} 0`} />
          <path d={`M${x - r * 0.18} ${y + r * 0.62}h${r * 0.36}`} stroke={shade(sk, 0.5)} />
        </g>
      )}
    </g>
  );
}

function OedPedYetiskin() {
  // Yukarıdan: yerde sırtüstü yatan yetişkinin çıplak gövdesi (baş üstte, kollar yanlarda). Ekranda SOL = kişinin SAĞI.
  // Ped 1: sağ köprücük kemiğinin hemen altı, göğüs kemiğinin sağı. Ped 2: sol koltuk altının biraz altı, göğsün YAN yüzü
  // (o kol hafifçe yana açılmış). İki kablo tek fişte birleşip başın yanındaki OED'ye gider.
  const sk = K.skin[ADULT.victim.skin ?? 0];
  const cx = 156, top = 76, w = 62, L = 136;
  const p1: P = [cx - w * 0.42, top + 26];
  const p2: P = [cx + w * 0.8, top + L * 0.5];
  const aed: P = [52, 50];
  const armL = KIT.capsule([cx - w * 0.9, top + 14], w * 0.22, [cx - w * 1.12, top + L * 1.2], w * 0.17);
  const armR = KIT.capsule([cx + w * 0.92, top + 14], w * 0.22, [cx + w * 2.0, top + L * 0.95], w * 0.17);
  const plug: P = [cx - w * 0.2, top - 6];
  return (
    <Scene2 bg="floor">
      <OG sh={[{ d: armL, f: shade(sk, 0.06) }, { d: armR, f: shade(sk, 0.06) }]} />
      <OG sh={[{ d: rrect(cx - w * 0.82, top + L * 1.02, w * 1.64, 80, 6), f: ADULT.victim.bottomC ?? K.pants.denim }]} />
      <Torso cx={cx} top={top} w={w} L={L} skin={ADULT.victim.skin ?? 0} armR={false} />
      <path d={`M${cx} ${top + 6}V${top + L * 0.72}`} stroke={shade(sk, 0.28)} stroke-width={2} stroke-dasharray="4 5" />
      <TopHead x={cx} y={top - 32} r={30} skin={ADULT.victim.skin ?? 0} hairC={ADULT.victim.hairC} />
      <Aed x={aed[0]} y={aed[1]} s={0.62} ecg />
      <path d={`M${p1[0] - 6} ${p1[1] - 16}Q${p1[0] - 8} ${top - 6} ${plug[0]} ${plug[1]}`} fill="none" stroke={K.out} stroke-width={3} />
      <path d={`M${p2[0] + 2} ${p2[1] - 26}C${p2[0] + 18} ${top - 10} ${cx + 30} ${top - 26} ${plug[0]} ${plug[1]}`} fill="none" stroke={K.out} stroke-width={3} />
      <path d={`M${plug[0]} ${plug[1]}C${plug[0] - 30} ${plug[1] - 30} ${aed[0] + 60} ${aed[1] + 10} ${aed[0] + 26} ${aed[1] + 12}`} fill="none" stroke={K.out} stroke-width={3.4} />
      <circle cx={plug[0]} cy={plug[1]} r={4} fill={K.out} />
      <Pad x={p1[0]} y={p1[1]} w={40} h={30} a={-8} />
      <Pad x={p2[0]} y={p2[1]} w={28} h={40} a={-10} />
    </Scene2>
  );
}

function OedPedIki({ kind }: { kind: 'child' | 'baby' }) {
  const baby = kind === 'baby';
  const look = baby ? BABY.victim : CHILD.victim;
  const vsk = look.skin ?? 0, vhc = look.hairC ?? K.hair.brown;
  const w = baby ? 44 : 54, L = baby ? 80 : 104, top = baby ? 92 : 78;
  const icon = baby ? 'baby' : 'child';
  const ps = baby ? 26 : 32;
  return (
    <Scene2 bg="closeup">
      {baby && <rect x={0} y={34} width={320} height={190} fill="#c9b79c" />}
      {baby && <rect x={0} y={34} width={320} height={6} fill={shade('#c9b79c', 0.15)} />}
      <TopHead x={80} y={top - (baby ? 26 : 28)} r={baby ? 24 : 22} skin={vsk} hairC={vhc} baby={baby} />
      <Torso cx={80} top={top} w={w} L={L} skin={vsk} kind={kind} />
      <Pad x={80} y={top + L * 0.4} w={ps} h={ps} icon={icon} />
      <TopHead x={240} y={top - (baby ? 26 : 28)} r={baby ? 24 : 22} skin={vsk} hairC={vhc} back />
      <Torso cx={240} top={top} w={w} L={L} skin={vsk} kind={kind} back />
      <Pad x={240} y={top + L * 0.32} w={ps} h={ps} icon={icon} />
      <Arrow from={[158, 128]} to={[184, 128]} w={6} />
      <Arrow from={[162, 128]} to={[136, 128]} w={6} />
    </Scene2>
  );
}

function AedCabinet({ x, y }: { x: number; y: number }) {
  // x,y = SOL ÜST
  return (
    <g>
      <OG sh={[{ d: rrect(x, y, 62, 74, 6), f: '#fbfaf7' }, { d: rrect(x + 6, y + 30, 50, 38, 4), f: '#dfe9e4' }]} />
      <OG sh={[{ d: rrect(x + 6, y + 6, 50, 22, 4), f: K.safe }]} />
      <HeartBolt x={x + 31} y={y + 17} r={9} heart="#fff" bolt={K.safe} />
    </g>
  );
}
function AedBag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // MERKEZ
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 -16Q0 -24 8 -16" fill="none" stroke={K.out} stroke-width={3 / s} />
      <OG ow={1.5 / s} sh={[{ d: rrect(-20, -16, 40, 32, 6), f: K.safe }]} />
      <HeartBolt x={0} y={0} r={9} heart="#fff" bolt={K.safe} />
    </g>
  );
}

function OedGetir() {
  // Ön planda OED çantasıyla koşan kişi; arkada sırtını duvara yaslamış, bilinci açık hasta ve yanında diz çökmüş biri (masaj YOK).
  const run: PersonProps = { x: 132, y: 230, s: 1.15, who: 'man', role: 'helper', skin: 2, hairC: K.hair.black, pose: { ...POSE.run, armF: [84, 70], face: 'worried' } };
  const rr = rig(run);
  const sit: PersonProps = { x: 270, y: 194, s: 0.68, who: 'oldman', role: 'victim', shadow: false, pose: { view: 'front', spine: -90, legB: [-128, 96], legF: [-52, 84], footB: 0, footF: 0, armB: [100, 40], armF: [80, 140], face: 'calm' } };
  const sr = rig(sit);
  const kn: PersonProps = { x: sr.hip[0] - 46, y: 198, s: 0.64, flip: false, who: 'woman', role: 'bystander2', hair: 'bun', hairC: K.hair.dark, pose: { ...POSE.kneelSit, spine: -80, head: -70, armF: { to: [sr.shoulderB[0] + 2, sr.shoulderB[1] + 2] }, armB: [80, 20], face: 'speak' } };
  return (
    <Scene2 bg="indoor" gy={190}>
      <AedCabinet x={24} y={70} />
      <Person {...kn} />
      <Person {...sit} />
      <Person {...run} mid={() => <AedBag x={rr.handF[0] + 2} y={rr.handF[1] + 18} s={1.1} />} />
      <Arrow from={[186, 64]} to={[236, 64]} />
    </Scene2>
  );
}

function OedAc() {
  // Yukarıdan: yerde sırtüstü yatan yetişkin (baş solda), başının yanında YERE konmuş açık OED; parmak yeşil açma düğmesinde.
  const vp: PersonProps = { ...ADULT.victim, x: 160, y: 226, s: 1.3, shadow: false, pose: { ...POSE.stand, face: 'closed' } };
  const aed: P = [84, 120];
  const s = 1.1;
  const btn: P = [aed[0] - 15 * s, aed[1] + 14 * s];
  const fing = placeHand({ x: 0, y: 0, a: handA(-120), s: 0.82, pose: 'point', side: 'R' }, 'tip', [btn[0] + 1, btn[1] + 2]);
  return (
    <Scene2 bg="floor">
      <g transform="translate(98 34) rotate(-90 160 120)">
        <Person {...vp} />
      </g>
      <ellipse cx={aed[0] + 4} cy={aed[1] + 8} rx={62} ry={48} fill="#000" opacity={0.14} />
      <Aed x={aed[0]} y={aed[1]} s={s} />
      <Waves x={aed[0] + 40 * s} y={aed[1] - 26 * s} a={-50} n={3} r={7} />
      <circle cx={btn[0]} cy={btn[1]} r={18} fill="none" stroke={K.action} stroke-width={4} />
      <Hand {...fing} arm={260} sleeve={K.role.helper} skin={2} />
    </Scene2>
  );
}

function OedCekilin() {
  const victim: PersonProps = { ...ADULT.victim, x: 168, y: 214, s: 0.98, pose: POSE.lieBack, top: K.skin[ADULT.victim.skin ?? 0], sleeve: 'none' };
  const v = rig(victim);
  const c = v.chest;
  const helper: PersonProps = { ...ADULT.helper, x: 34, y: 228, s: 1.0, pose: { ...POSE.stand, armB: [-150, -120], armF: [-30, -60], handB: 'flat', handF: 'flat', face: 'worried' } };
  const by: PersonProps = { x: 288, y: 226, s: 0.96, who: 'man', role: 'bystander', skin: 0, pose: { ...POSE.stand, armB: [-130, -100], armF: [-50, -80], handB: 'flat', handF: 'flat', face: 'worried' } };
  return (
    <Scene2 bg="indoor" gy={186}>
      <Person {...by} />
      <Person {...victim} />
      <rect x={c[0] - 22} y={c[1] - 4} width={13} height={8} rx={2} fill="#fbfaf7" stroke={K.out} stroke-width={1.3} />
      <rect x={c[0] + 2} y={c[1] - 3} width={13} height={8} rx={2} fill="#fbfaf7" stroke={K.out} stroke-width={1.3} />
      <path d={`M${c[0] - 16} ${c[1] - 4}Q${c[0] - 30} ${c[1] - 30} ${v.head[0] - 30} ${214 - 10}M${c[0] + 8} ${c[1] - 3}Q${c[0] - 10} ${c[1] - 38} ${v.head[0] - 26} ${214 - 10}`} fill="none" stroke={K.out} stroke-width={1.6} />
      <ellipse cx={164} cy={204} rx={100} ry={30} fill="none" stroke={K.danger} stroke-width={3.4} stroke-dasharray="9 6" />
      <Person {...helper} />
      <Aed x={v.head[0] - 30} y={214} s={0.42} ecg />
    </Scene2>
  );
}

function OedSok() {
  const s = 2.6;
  const aed: P = [150, 150];
  const btn: P = [aed[0] + 22 * s, aed[1] + 4 * s];
  const fing = { x: 0, y: 0, a: handA(-130), s: 1.0, pose: 'point' as const, side: 'R' as const };
  const tp = handPoint(fing, 'tip');
  fing.x = btn[0] - tp[0] + 2;
  fing.y = btn[1] - tp[1] + 4;
  const blur = 'iy1-blur';
  return (
    <Scene2 bg="indoor" gy={150}>
      <defs>
        <filter id={blur} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.6" /></filter>
      </defs>
      <g filter={`url(#${blur})`} opacity={0.75}>
        <Person x={40} y={170} s={0.75} who="woman" role="bystander2" pose={{ ...POSE.stand, armB: [-150, -110], armF: [-30, -70] }} />
        <Person x={278} y={168} s={0.75} who="man" role="bystander" pose={{ ...POSE.stand, armB: [-150, -110], armF: [-30, -70] }} />
      </g>
      <Aed x={aed[0]} y={aed[1]} s={s} lit ecg />
      <g stroke={K.action} stroke-width={3.4} stroke-linecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const p1 = off(btn, a, 42), p2 = off(btn, a, 54);
          return <line key={a} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
        })}
      </g>
      <Hand {...fing} arm={260} sleeve={K.role.helper} skin={2} />
    </Scene2>
  );
}

/* ───────────── KANAMA ───────────── */

const GLOVE = 'iy1-glove';
function GloveDefs() {
  return (
    <defs>
      <filter id={GLOVE} color-interpolation-filters="sRGB">
        <feColorMatrix type="hueRotate" values="180" />
        <feColorMatrix type="saturate" values="1.25" />
      </filter>
    </defs>
  );
}
/** Eldivenli el: önkol (kollu) + eldiven (mavi). h: Hand prop'ları (arm yok sayılır) */
function GHand({ h, armAng, sleeve = K.role.helper, skin = ADULT.helper.skin ?? 2 }: { h: { x: number; y: number; a: number; s: number; pose: 'press' | 'open' | 'hold' | 'point' | 'fist' | 'pinch'; side: 'L' | 'R'; view?: 'back' | 'palm' }; armAng?: number; sleeve?: string; skin?: number }) {
  const ang = armAng ?? h.a - 90 + 180;
  return (
    <g>
      <Forearm at={[h.x, h.y]} ang={ang} s={h.s} skin={skin} sleeve={sleeve} />
      <g filter={`url(#${GLOVE})`}>
        <Hand {...h} arm={18} skin={skin} />
      </g>
    </g>
  );
}

/** Kurbanın yatay önkolu: el solda (parmaklar sola), önkol sağa uzanır. */
function VictimArm({ y = 172, s = 1.1, x = 92, skin = 0 }: { y?: number; s?: number; x?: number; skin?: number }) {
  return <Hand x={x} y={y} a={-90} s={s} pose="open" side="L" arm={300} skin={skin} />;
}

function KanamaBastir() {
  const wound: P = [184, 160];
  const h1 = { x: 0, y: 0, a: 150, s: 0.95, pose: 'press' as const, side: 'L' as const };
  const pl = handPoint(h1, 'palm');
  h1.x = wound[0] - 4 - (pl[0] - h1.x); h1.y = wound[1] - 6 - (pl[1] - h1.y);
  const h2 = { ...h1, a: 205, side: 'R' as const };
  const pl2 = handPoint(h2, 'palm');
  h2.x = wound[0] + 6 - (pl2[0] - h2.x); h2.y = wound[1] - 10 - (pl2[1] - h2.y);
  return (
    <Scene2 bg="closeup">
      <GloveDefs />
      <VictimArm y={176} />
      <Blood x={wound[0] - 46} y={190} s={0.7} />
      <Blood x={wound[0] + 40} y={192} s={0.6} />
      <Cloth x={wound[0]} y={wound[1] + 8} w={84} h={34} a={-2} />
      <GHand h={h1} />
      <GHand h={h2} />
      <Arrow from={[wound[0] - 2, 16]} to={[wound[0] - 2, 70]} w={9} />
    </Scene2>
  );
}

const BLOODY = '#e3a49c';
function KanamaBezEkle() {
  const wound: P = [150, 164];
  const h1 = { x: 0, y: 0, a: 170, s: 0.95, pose: 'press' as const, side: 'R' as const };
  const pl = handPoint(h1, 'palm');
  h1.x = wound[0] - (pl[0] - h1.x); h1.y = wound[1] - 14 - (pl[1] - h1.y);
  return (
    <Scene2 bg="closeup">
      <GloveDefs />
      <VictimArm y={180} x={86} />
      <Cloth x={wound[0] + 4} y={wound[1] + 12} w={92} h={36} a={2} color={BLOODY} />
      <Blood x={wound[0] - 24} y={wound[1] + 16} s={0.55} />
      <Blood x={wound[0] + 22} y={wound[1] + 18} s={0.5} />
      <Cloth x={wound[0] - 2} y={wound[1] - 2} w={78} h={30} a={-4} />
      <GHand h={h1} />
      <Ok x={58} y={120} r={15} />
      <Inset x={208} y={12} w={102} h={86}>
        <g opacity={0.55}>
          <rect x={200} y={78} width={120} height={26} fill={K.skin[0]} stroke={K.out} stroke-width={1.5} />
          <Cloth x={262} y={56} w={50} h={20} a={-25} color={BLOODY} />
          <Hand x={290} y={20} a={-120} s={0.5} pose="pinch" side="R" arm={80} sleeve={K.role.helper} skin={ADULT.helper.skin} />
        </g>
        <No x={259} y={55} r={32} />
      </Inset>
    </Scene2>
  );
}

/** Uyluk yakın planı (yatan kişi, kalça solda, diz sağda). Döndürür: üst kenar y fonksiyonu */
const THIGH = { y: 150, hipX: -30, kneeX: 262, r0: 46, r1: 34 };
const thighTop = (x: number) => THIGH.y - (THIGH.r0 + ((THIGH.r1 - THIGH.r0) * (x - THIGH.hipX)) / (THIGH.kneeX - THIGH.hipX));
const thighR = (x: number) => THIGH.r0 + ((THIGH.r1 - THIGH.r0) * (x - THIGH.hipX)) / (THIGH.kneeX - THIGH.hipX);
function Thigh({ wound }: { wound: number }) {
  const pc = K.pants.denim;
  const wy = THIGH.y - thighR(wound) * 0.35;
  return (
    <g>
      <OG sh={[
        { d: capsuleK([THIGH.kneeX, THIGH.y], 30, [380, THIGH.y + 30], 26), f: shade(pc, 0.08) },
        { d: capsuleK([THIGH.hipX, THIGH.y], THIGH.r0, [THIGH.kneeX, THIGH.y], THIGH.r1), f: pc },
        { d: ell([wound, wy], 22, 13), f: K.skin[ADULT.victim.skin ?? 0] },
      ]} />
      <path d={`M${THIGH.kneeX - 6} ${THIGH.y - 26}q10 26 0 52`} fill="none" stroke={shade(pc, 0.3)} stroke-width={2} />
      <path d={`M${wound - 12} ${wy}q6 -3 12 0t12 0`} fill="none" stroke={K.blood} stroke-width={4} stroke-linecap="round" />
      <Blood x={wound + 6} y={wy + 20} s={0.7} />
      <path d={`M${wound + 10} ${THIGH.y + thighR(wound) - 4}q4 14 -2 24`} stroke={K.blood} stroke-width={5} fill="none" stroke-linecap="round" />
    </g>
  );
}
function TourniquetBand({ x, rod = true, rodA = -30 }: { x: number; rod?: boolean; rodA?: number }) {
  const r = thighR(x) + 3;
  const top = THIGH.y - r;
  return (
    <g>
      <OG sh={[{ d: rrect(x - 11, top, 22, r * 2, 5), f: '#2f3440' }, { d: rrect(x - 11, top + r * 0.9, 22, 10, 2), f: '#5b6270' }]} />
      <OG sh={[{ d: rrect(x - 9, top - 6, 18, 12, 3), f: '#3d4350' }]} />
      {rod && (
        <g transform={`translate(${x} ${top}) rotate(${rodA})`}>
          <OG sh={[{ d: rrect(-34, -5, 68, 10, 5), f: K.red }]} />
        </g>
      )}
    </g>
  );
}

function TurnikeTak() {
  const wound = 198, band = 128;
  const top = thighTop(band) - 3;
  const rodEnd = off([band, top], -30, 30);
  const h = { x: 0, y: 0, a: 30, s: 0.8, pose: 'hold' as const, side: 'R' as const, grip: 16 };
  const g = handPoint(h, 'grip');
  h.x = rodEnd[0] - (g[0] - h.x); h.y = rodEnd[1] - (g[1] - h.y);
  const dy = THIGH.y + thighR(wound) + 18;
  return (
    <Scene2 bg="closeup">
      <Thigh wound={wound} />
      <TourniquetBand x={band} />
      <Hand {...h} arm={240} sleeve={K.role.helper} skin={ADULT.helper.skin} />
      <Arrow from={[band - 46, top + 6]} to={[band + 10, top - 54]} bend={-0.5} w={5} />
      <path d={`M${band + 12} ${dy}H${wound - 22}M${band + 12} ${dy - 7}v14M${wound - 22} ${dy - 7}v14`} stroke={K.out} stroke-width={2.6} stroke-linecap="round" />
      <Label x={(band + wound - 10) / 2} y={dy + 20} text="5–7 cm" size={14} />
      <Label x={THIGH.kneeX + 4} y={THIGH.y + 64} text="diz" size={12} bg="#fff" />
    </Scene2>
  );
}

function TurnikeSaat() {
  const band = 118;
  const top = thighTop(band) - 3;
  const tag: P = [band + 8, top - 70];
  const h = { x: 0, y: 0, a: -20, s: 0.85, pose: 'hold' as const, side: 'R' as const, grip: 10 };
  const g = handPoint(h, 'grip');
  const penTip: P = [tag[0] + 92, tag[1] + 34];
  const penA = -60;
  const penMid = off(penTip, penA, 26);
  h.x = penMid[0] - (g[0] - h.x); h.y = penMid[1] - (g[1] - h.y);
  return (
    <Scene2 bg="closeup">
      <Thigh wound={196} />
      <TourniquetBand x={band} rodA={0} />
      <path d={`M${band} ${top}L${tag[0] + 6} ${tag[1] + 44}`} stroke={K.out} stroke-width={2} />
      <OG sh={[{ d: rrect(tag[0], tag[1], 100, 46, 6), f: '#fbfaf7' }]} />
      <text x={tag[0] + 50} y={tag[1] + 32} text-anchor="middle" font-size={24} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">14:20</text>
      <Hand {...h} arm={240} sleeve={K.role.helper} skin={2}>
        <g transform={`translate(${penTip[0]} ${penTip[1]}) rotate(${penA})`}>
          <OG sh={[{ d: rrect(6, -4, 70, 8, 3), f: '#3c6fd1' }, { d: 'M0 0L7 -4V4Z', f: '#e8d9b8' }]} />
        </g>
      </Hand>
      <Timer x={36} y={42} r={18} />
    </Scene2>
  );
}

function KanamaSargi() {
  const y = 170, x0 = 100, x1 = 236, R = 17;
  const strips: string[] = [];
  for (let x = x1 - 26; x >= x0; x -= 20) strips.push(`M${x} ${y - R - 2}L${x + 28} ${y - R - 2}Q${x + 22} ${y} ${x + 14} ${y + R + 2}L${x - 14} ${y + R + 2}Q${x - 6} ${y} ${x} ${y - R - 2}Z`);
  return (
    <Scene2 bg="closeup">
      <VictimArm y={y} x={90} s={1.15} skin={ADULT.victim.skin} />
      <circle cx={-2} cy={y - 50} r={1} fill="none" />
      {strips.map((d, i) => <OG key={i} sh={[{ d, f: i % 2 ? K.cloth : shade(K.cloth, 0.05) }]} />)}
      <OG sh={[{ d: `M${x1 - 4} ${y - R - 2}L${x1 + 22} ${y - R - 2}L${x1 + 46} ${y - 62}L${x1 + 22} ${y - 62}Z`, f: K.cloth }, { d: circ([x1 + 36, y - 68], 18), f: K.cloth }, { d: circ([x1 + 36, y - 68], 6), f: shade(K.cloth, 0.15), ln: true }]} />
      <Arrow from={[x1 - 10, y + 40]} to={[x1 + 2, y - 52]} bend={0.55} w={5} />
      {[[-6, -4], [-10, 8], [-6, 20]].map(([dx, dy], i) => <circle key={i} cx={-2 + dx + 14} cy={y - 26 + dy} r={0} />)}
      <Ok x={46} y={y - 52} r={12} />
    </Scene2>
  );
}

/* ───────────── DERLENME POZİSYONU (yukarıdan) ───────────── */

/** Alttan (kurtarıcının yanından) giren el; wrist/fingers hedefe göre yerleştirilir */
function placeHand(h: { x: number; y: number; a: number; s: number; pose: any; side: 'L' | 'R'; grip?: number }, which: 'tip' | 'palm' | 'grip' | 'pinch', at: P) {
  const q = handPoint(h, which);
  return { ...h, x: at[0] - (q[0] - h.x), y: at[1] - (q[1] - h.y) };
}

/** Yukarıdan görünüş, genel: dik çizilen kişi -90° döndürülür (baş solda); s ölçek, Xf ayak ucu x, Yc gövde ekseni y. */
function topView(s: number, Xf: number, Yc: number) {
  const T = `translate(${Xf - 266} ${Yc - 120}) rotate(-90 160 120)`;
  const P_ = (p: P): P => [160 + (p[1] - 120) + Xf - 266, 120 - (p[0] - 160) + Yc - 120];
  const props = (extra: object): PersonProps => ({ ...DER.victim, x: 160, y: 226, s, shadow: false, pose: { ...POSE.stand, face: 'closed', ...extra } } as PersonProps);
  return { T, P: P_, props };
}
/** Alt kenardan giren önkol + büyük el. at = elin değdiği nokta (which), a = parmak yönü (Hand), arm = önkolun açısı (90 = dik aşağı). */
type BH = { at: P; a: number; arm: number; pose: 'press' | 'hold' | 'point' | 'open'; which: 'palm' | 'tip' | 'grip'; side: 'L' | 'R'; grip?: number; view?: 'back' | 'palm' };
function BottomHand({ h, s }: { h: BH; s: number }) {
  const hp = placeHand({ x: 0, y: 0, a: h.a, s, pose: h.pose, side: h.side, grip: h.grip ?? 30 }, h.which, h.at);
  return (
    <g>
      <Forearm at={[hp.x, hp.y]} ang={h.arm} s={s} skin={DER.helper.skin} />
      <Hand {...hp} view={h.view ?? 'back'} arm={0} skin={DER.helper.skin} />
    </g>
  );
}

function DerlenmeKol() {
  // Yukarıdan yakın plan (üst gövde): sırtüstü yatan kişi, baş solda. Yardımcı alt kenarda (kişinin yakın yanında);
  // yalnızca iki önkolu ve elleri görünür. Kişinin yakın kolu omuzdan dik açıyla yana açılmış, dirsekten bükülü,
  // önkol başa doğru, avuç yukarı. Yardımcının bir eli bilekte, öbürü dirsekte; kavisli ok kolun konacağı yönü gösterir.
  const tv = topView(2.5, 470, 66);
  const vp = tv.props({ armB: [180, -90], handB: { shape: 'flat' } });
  const v = rig(vp);
  const elbow = tv.P(v.elbowB), wrist = tv.P(v.wristB), hand = tv.P(v.handB);
  return (
    <Scene2 bg="floor">
      <g transform={tv.T}><Person {...vp} /></g>
      <Arrow from={[hand[0] + 34, hand[1] - 40]} to={[hand[0] - 2, hand[1] - 30]} bend={0.4} w={5} />
      <BottomHand s={0.72} h={{ at: [wrist[0] + 2, wrist[1]], a: -8, arm: 98, pose: 'hold', which: 'grip', side: 'L', grip: 18 }} />
      <BottomHand s={0.72} h={{ at: [elbow[0] + 4, elbow[1] + 2], a: 6, arm: 82, pose: 'hold', which: 'grip', side: 'R', grip: 22 }} />
    </Scene2>
  );
}

function DerlenmeElYanak() {
  // Yukarıdan yakın plan: uzak kol göğsün üzerinden getirilmiş, elinin sırtı yardımcıya yakın yanakta.
  // Yardımcının bir eli (alt kenardan) o eli avuç avuca yanağa bastırıp tutuyor. Yakın kol başın yanında bükülü duruyor.
  const tv = topView(2.5, 470, 66);
  const base = tv.props({});
  const b0 = rig(base);
  const cheek: P = [b0.head[0] - b0.headR * 0.9, b0.head[1] + b0.headR * 0.3];
  const vp = tv.props({ armB: [180, -90], handB: { shape: 'flat' }, armF: { to: cheek, bend: -1 }, handF: { shape: 'flat' } });
  const v = rig(vp);
  const hb = tv.P(v.handF);
  const ck = tv.P(cheek);
  return (
    <Scene2 bg="floor">
      <g transform={tv.T}><Person {...vp} /></g>
      <circle cx={ck[0] + 1} cy={ck[1] + 1} r={30} fill="none" stroke={K.action} stroke-width={3.6} />
      <BottomHand s={0.72} h={{ at: [hb[0] + 2, hb[1] + 12], a: 8, arm: 96, pose: 'press', which: 'tip', side: 'L', view: 'back' }} />
    </Scene2>
  );
}

function DerlenmeCevir() {
  // Yukarıdan, bütün beden: uzak bacak dizden bükülü (ayak tabanı yerde, yakın dizin yanında). Yardımcının sağ eli
  // bükülü dizde, sol eli yanaktaki eli tutuyor; ikisi de alt kenardan. Dizden yardımcıya doğru kavisli çekme oku.
  const tv = topView(1.62, 306, 98);
  const base = tv.props({});
  const b0 = rig(base);
  const cheek: P = [b0.head[0] - b0.headR * 0.9, b0.head[1] + b0.headR * 0.3];
  const vp = tv.props({ armB: [180, -90], handB: { shape: 'flat' }, armF: { to: cheek, bend: -1 }, handF: { shape: 'flat' }, legF: [34, 156] });
  const v = rig(vp);
  const hb = tv.P(v.handF);
  const knee = tv.P(v.kneeF);
  return (
    <Scene2 bg="floor">
      <g transform={tv.T}><Person {...vp} /></g>
      <circle cx={knee[0]} cy={knee[1]} r={19} fill="none" stroke={K.action} stroke-width={3.6} />
      <Arrow from={[knee[0] + 24, knee[1] + 8]} to={[knee[0] + 30, knee[1] + 92]} bend={-0.35} w={6} />
      <BottomHand s={0.46} h={{ at: [hb[0] + 2, hb[1] + 9], a: 6, arm: 96, pose: 'press', which: 'tip', side: 'R' }} />
      <BottomHand s={0.46} h={{ at: [knee[0] - 2, knee[1] + 2], a: -4, arm: 94, pose: 'hold', which: 'grip', side: 'L', grip: 16 }} />
    </Scene2>
  );
}

/* ───────────── BOĞULMA ───────────── */

function BogulmaIsaret() {
  const base: PersonProps = { ...HYT.victim, x: 124, y: 230, s: 1.25, pose: { ...POSE.stand } };
  const b = rig(base);
  const n = b.neck;
  const vp: PersonProps = { ...base, pose: { ...POSE.stand, armB: { to: [n[0] - 4, n[1] + 12], bend: 1 }, armF: { to: [n[0] + 4, n[1] + 12], bend: -1 }, face: 'pain' } };
  const v = rig(vp);
  const by: PersonProps = { ...HYT.helper, x: 248, y: 228, s: 1.12, flip: true, pose: { ...POSE.standSide, armF: [20, -10], face: 'speak' } };
  return (
    <Scene2 bg="indoor" gy={184}>
      <Window x={22} y={36} />
      <Table x={150} y={196} w={140} h={60} />
      <ellipse cx={196} cy={134} rx={16} ry={4} fill="#fff" stroke={K.out} stroke-width={1.5} />
      <Person {...by} />
      <Person {...vp} />
      <ellipse cx={v.head[0]} cy={v.head[1] + 3} rx={13} ry={9} fill={K.danger} opacity={0.22} />
      <g transform={`translate(${n[0] + 34} ${n[1] - 4})`}>
        <path d="M0 -13L12 8H-12Z" fill={K.action} stroke={K.out} stroke-width={1.8} stroke-linejoin="round" />
        <path d="M0 -6V1" stroke={K.ink} stroke-width={2.6} stroke-linecap="round" />
        <circle cx={0} cy={5} r={1.6} fill={K.ink} />
      </g>
    </Scene2>
  );
}

function SirtVurusu() {
  // Boğulan yetişkin belinden belirgin öne eğilmiş (üst gövde yere yakın yatay). Yardımcı YANINDA ve biraz arkasında:
  // bir kolu göğsünü önden destekliyor, öbür elin AÇIK topuğuyla kürek kemiklerinin arasına vuruyor.
  const vp: PersonProps = { ...HYT.victim, x: 170, y: 228, s: 1.25, pose: { spine: -10, chest: -2, head: 20, legB: [96, 92], legF: [90, 88], armB: [100, 96], armF: [96, 92], face: 'pain' } };
  const v = rig(vp);
  const hit: P = [(v.back[0] + v.nape[0]) / 2 - 2, (v.back[1] + v.nape[1]) / 2 - 1];
  const sup: P = [v.chest[0] + 2, v.chest[1] + 4];
  const hp: PersonProps = { ...HYT.helper, x: v.hip[0] - 18, y: 220, s: 1.16,
    pose: { spine: -72, chest: -58, head: -44, legB: [100, 92], legF: [80, 90], armF: { to: [hit[0] - 10, hit[1] - 11] }, handF: 'none', armB: { to: sup }, handB: { shape: 'flat', a: -20 }, face: 'neutral' } };
  return (
    <Scene2 bg="indoor">
      <Person {...hp} only={['legB', 'legF', 'torso', 'head']} />
      <Person {...vp} only={['legB', 'legF', 'torso', 'head', 'armB']} />
      <Person {...hp} only={['armB']} />
      <Person {...vp} only={['armF']} />
      <Person {...hp} only={['armF']} />
      {(() => {
        const r = rig(hp);
        const wr = r.wristF;
        // açık el: avuç topuğu sırta değiyor, parmaklar açık (yumruk değil)
        return <Hand x={wr[0]} y={wr[1]} a={handA(r.foreF + 34)} s={0.34} pose="open" side="L" view="palm" arm={0} skin={HYT.helper.skin} />;
      })()}
      <Arrow from={[hit[0] + 40, hit[1] - 40]} to={[hit[0] + 14, hit[1] - 8]} w={5} />
      <Label x={276} y={36} text="5×" size={20} />
    </Scene2>
  );
}

function YumrukYeri() {
  const cx = 160, top = -86, w = 126, L = 236;
  const fistC: P = [cx, top + L * 0.84];
  const fist = placeHand({ x: 0, y: 0, a: 90, s: 1.0, pose: 'fist', side: 'R' }, 'grip', [fistC[0] + 6, fistC[1]]);
  const cover = placeHand({ x: 0, y: 0, a: -90, s: 1.0, pose: 'hold', side: 'R', grip: 34 }, 'grip', [fistC[0] + 6, fistC[1]]);
  const sk = K.skin[HYT.victim.skin ?? 2];
  return (
    <Scene2 bg="closeup">
      <Torso cx={cx} top={top} w={w} L={L} skin={HYT.victim.skin} />
      <OG sh={[{ d: rrect(cx - w * 0.84, top + L * 1.13, w * 1.68, 60, 4), f: K.pants.denim }]} />
      <path d={`M${cx - 18} ${top + L * 0.5}L${cx} ${top + L * 0.58}L${cx + 18} ${top + L * 0.5}`} fill="none" stroke={shade(sk, 0.35)} stroke-width={2.6} stroke-dasharray="4 4" stroke-linecap="round" />
      <circle cx={cx} cy={top + L * 1.0} r={6} fill="none" stroke={shade(sk, 0.35)} stroke-width={2.4} stroke-dasharray="3 3" />
      <circle cx={fistC[0]} cy={fistC[1]} r={40} fill="none" stroke={K.action} stroke-width={4} />
      <Hand {...cover} arm={300} sleeve={K.role.helper} skin={HYT.helper.skin}>
        <Hand {...fist} arm={300} sleeve={K.role.helper} skin={HYT.helper.skin} />
      </Hand>
    </Scene2>
  );
}

function KarinBasisi() {
  // Kazazede belinden BELİRGİN öne eğik (~45°); yardımcı arkasında, bir ayağı önde, kollarını beline dolamış;
  // yumruk göbeğin hemen üstünde, öbür el yumruğu kavramış. İçeri ve yukarı kavisli ok.
  const vp: PersonProps = { ...HYT.victim, x: 190, y: 230, s: 1.3, pose: { spine: -46, chest: -40, head: -30, legB: [94, 90], legF: [88, 90], armB: [66, 84], armF: [60, 80], face: 'pain' } };
  const v = rig(vp);
  const belly: P = [v.belly[0] - 2, v.belly[1] + 2];
  const hp: PersonProps = { ...HYT.helper, x: v.hip[0] - 26, y: 230, s: 1.32, pose: { spine: -66, chest: -54, head: -56, legB: [104, 96], legF: [72, 92], armF: { to: belly }, handF: 'fist', armB: { to: [belly[0] - 4, belly[1] - 2] }, handB: 'fist', face: 'neutral' } };
  return (
    <Scene2 bg="indoor">
      <Person {...hp} only={['legB', 'armB', 'torso', 'legF', 'head']} />
      <Person {...vp} />
      <Person {...hp} only={['armF']} />
      <Arrow from={[belly[0] + 20, belly[1] + 40]} to={[belly[0] + 8, belly[1] - 4]} bend={0.4} w={5} />
      <Label x={276} y={36} text="5×" size={20} />
    </Scene2>
  );
}

/* ───────────── NÖBET ───────────── */

/** Nöbet geçiren kişi (yerde, kollar-bacaklar kasılmış) */
function seizer(x: number, y: number, s: number): PersonProps {
  return { ...NOB.victim, x, y, s, pose: { ...POSE.lieBack, armB: [-70, -140], armF: [-30, 20], legB: [-20, 20], legF: [8, -10], face: 'closed' } };
}
function JerkLines({ v }: { v: ReturnType<typeof rig> }) {
  return (
    <g stroke={K.ink} stroke-width={2.4} fill="none" stroke-linecap="round" opacity={0.65}>
      <path d={`M${v.head[0] - 26} ${v.head[1] - 8}q-6 8 0 16M${v.head[0] - 34} ${v.head[1] - 14}q-9 14 0 28`} />
      <path d={`M${v.handB[0] - 4} ${v.handB[1] - 14}q8 -6 16 0M${v.kneeB[0] - 6} ${v.kneeB[1] - 18}q8 -6 16 0`} />
    </g>
  );
}

function NobetCevre() {
  // Yandan: yerde kasılma geçiren kişi. Yardımcı (NOB) sehpayı yerde KAYDIRARAK kişiden uzağa, sağa çekiyor;
  // kişiye dokunmuyor, onu taşımıyor. Kayma yönünde turuncu ok.
  const vp = seizer(104, 222, 1.05);
  const v = rig(vp);
  const tx = 178, tw = 58, th = 36, ty = 222 - th; // sehpa sol üst
  const helper: PersonProps = { ...NOB.helper, x: 286, y: 226, s: 1.2, flip: true,
    pose: { ...POSE.kneelOne, spine: -62, chest: -52, head: -40, armF: { to: [tx + tw - 2, ty + 4] }, armB: { to: [tx + tw - 8, ty + 8] }, handF: 'mitten', face: 'neutral' } };
  return (
    <Scene2 bg="indoor" gy={180}>
      <Person {...vp} />
      <JerkLines v={v} />
      <g stroke={K.floorShade} stroke-width={2.6} stroke-linecap="round">
        <path d={`M${tx - 30} ${ty + th - 4}H${tx - 8}M${tx - 22} ${ty + th - 14}H${tx - 8}`} />
      </g>
      <OG sh={[{ d: rrect(tx, ty, tw, 9, 3), f: '#9c6a42' }, { d: rrect(tx + 5, ty + 8, 7, th - 8, 2), f: shade('#9c6a42', 0.15) }, { d: rrect(tx + tw - 12, ty + 8, 7, th - 8, 2), f: shade('#9c6a42', 0.15) }]} />
      <Person {...helper} />
      <Arrow from={[tx + 8, ty - 18]} to={[tx + 58, ty - 18]} w={5} />
    </Scene2>
  );
}

function NobetYastik() {
  // Yandan: nöbet geçiren kişi (NOB) yerde; yardımcı başının ucunda diz çökmüş, katlanmış ceketi iki eliyle
  // başının altına yerleştiriyor. Ek çizimde ağza bir şey sokmak yasak.
  const gy = 224;
  const vp: PersonProps = { ...NOB.victim, x: 188, y: gy, s: 1.3, pose: { ...POSE.lieBack, spine: 186, chest: 186, head: 184, armB: [-50, -110], armF: [-22, -70], legB: [-8, 8], legF: [6, -6], face: 'closed' } };
  const v = rig(vp);
  const jx0 = v.head[0] - 34, jx1 = v.head[0] + 34, jy = v.head[1] + v.headR - 3;
  const helper: PersonProps = { ...NOB.helper, x: 30, y: gy - 8, s: 1.3,
    pose: { ...POSE.kneel, spine: -40, chest: -30, head: -24, legB: [104, 182], legF: [96, 180],
      armB: { to: [jx0 + 2, jy + 10] }, armF: { to: [jx0 + 4, jy + 12] }, handB: 'mitten', handF: 'mitten', face: 'neutral' } };
  return (
    <Scene2 bg="indoor" gy={gy - 40}>
      <Person {...helper} only={['legB', 'legF', 'armB', 'torso', 'head']} />
      <OG sh={[{ d: rrect(jx0, jy, jx1 - jx0, gy - jy, 7), f: '#c49a5c' }, { d: rrect(jx0 + 4, jy + 8, jx1 - jx0 - 8, 6, 3), f: shade('#c49a5c', 0.15), no: true }]} />
      <Person {...vp} />
      <JerkLines v={v} />
      <Person {...helper} only={['armF']} />
      <Arrow from={[jx0 - 30, gy + 8]} to={[jx0 + 30, gy + 8]} w={5} />
      <Inset x={208} y={12} w={102} h={84}>
        <g opacity={0.55}>
          <Person x={236} y={66} ax="head" ay="head" s={1.1} {...NOB.victim} pose={{ ...POSE.lieBack, head: 182 }} only={['torso', 'head']} />
          <Hand x={290} y={30} a={-125} s={0.5} pose="hold" side="R" grip={8} arm={60} sleeve={K.role.helper} skin={NOB.helper.skin}>
            <rect x={245} y={36} width={40} height={6} rx={3} fill={K.metal} stroke={K.out} transform="rotate(35 265 39)" />
          </Hand>
        </g>
        <No x={259} y={54} r={32} />
      </Inset>
    </Scene2>
  );
}

function NobetSaat() {
  const h = { x: 130, y: 250, a: 6, s: 1.5, pose: 'hold' as const, side: 'L' as const, grip: 38 };
  const g = handPoint(h, 'grip');
  const btn: P = [g[0] + 2, g[1] + 20];
  const f = placeHand({ x: 0, y: 0, a: -50, s: 0.9, pose: 'point', side: 'R' }, 'tip', [btn[0] + 2, btn[1] + 2]);
  const blur = 'iy1-blur2';
  return (
    <Scene2 bg="indoor" gy={170}>
      <defs><filter id={blur} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4" /></filter></defs>
      <g filter={`url(#${blur})`} opacity={0.8}>
        <Person {...seizer(250, 204, 0.85)} />
        <path d="M200 166q-6 8 0 16M300 160q8 8 0 18" stroke={K.ink} stroke-width={2.4} fill="none" />
      </g>
      <Hand {...h} arm={40} sleeve={K.role.helper} skin={NOB.helper.skin}>
        <g transform={`translate(${g[0]} ${g[1]}) rotate(${h.a}) scale(${h.s})`}>
          <OG ow={1.5 / h.s} sh={[{ d: rrect(-19, -36, 38, 72, 7), f: '#2f3542' }]} />
          <rect x={-16} y={-31} width={32} height={58} rx={3} fill="#eaf4fb" />
          <text x={1.5} y={-6} text-anchor="middle" font-size={9} font-weight={700} fill={K.ink} font-family="'IBM Plex Sans', system-ui, sans-serif">00:00</text>
          <circle cx={0} cy={13} r={7.5} fill={K.safe} />
          <path d="M-2.4 9.4L4 13L-2.4 16.6Z" fill="#fff" />
        </g>
      </Hand>
      <Hand {...f} arm={260} sleeve={K.role.helper} skin={NOB.helper.skin} />
      <Label x={272} y={34} text="5 dk" size={18} />
    </Scene2>
  );
}

export const SCENES: Record<string, ArtFn> = {
  // Yetişkin (ADULT oyuncuları): ilk değerlendirme, TYD, OED, kanama
  'ilk-yardim-olay-yeri-guvenlik': () => <OlayYeri />,
  'ilk-yardim-omuz-seslen': () => <SideHead c={ADULT} mode="shout" />,
  'ilk-yardim-bas-geri-cene': () => <CloseHead c={ADULT} mode="tilt" />,
  'ilk-yardim-kurtarici-nefes': () => <CloseHead c={ADULT} mode="breath" />,
  'ilk-yardim-kpr-el-yeri': () => <KprElYeri />,
  'ilk-yardim-kpr-yetiskin': () => <Cpr c={ADULT} />,
  'ilk-yardim-derlenme-sonuc': () => <Recovery c={ADULT} />,
  'ilk-yardim-oed-ped-yetiskin': () => <OedPedYetiskin />,
  'ilk-yardim-oed-getir': () => <OedGetir />,
  'ilk-yardim-oed-ac': () => <OedAc />,
  'ilk-yardim-oed-cekilin': () => <OedCekilin />,
  'ilk-yardim-oed-sok-dugme': () => <OedSok />,
  'ilk-yardim-kanama-bastir': () => <KanamaBastir />,
  'ilk-yardim-kanama-bez-ekle': () => <KanamaBezEkle />,
  'ilk-yardim-turnike-tak': () => <TurnikeTak />,
  'ilk-yardim-turnike-saat': () => <TurnikeSaat />,
  'ilk-yardim-kanama-sargi': () => <KanamaSargi />,
  'ilk-yardim-kanama-ortu': () => <CoverWatch c={ADULT} />,
  // Çocuk (CHILD)
  'ilk-yardim-cocuk-bas-geri': () => <CloseHead c={CHILD} mode="tilt" kid />,
  'ilk-yardim-cocuk-nefes': () => <CloseHead c={CHILD} mode="breath" kid n="5" />,
  'ilk-yardim-cocuk-kpr-tek-el': () => <CocukKpr />,
  'ilk-yardim-oed-ped-cocuk': () => <OedPedIki kind="child" />,
  // Bebek (BABY)
  'ilk-yardim-bebek-bas-notr': () => <BebekBasNotr />,
  'ilk-yardim-bebek-nefes': () => <BabyBreath n="5" />,
  'ilk-yardim-oed-ped-bebek': () => <OedPedIki kind="baby" />,
  // Derlenme pozisyonu (DER)
  'ilk-yardim-derlenme-kol': () => <DerlenmeKol />,
  'ilk-yardim-derlenme-el-yanak': () => <DerlenmeElYanak />,
  'ilk-yardim-derlenme-cevir': () => <DerlenmeCevir />,
  'ilk-yardim-derlenme-son': () => <Recovery c={DER} tilt />,
  'ilk-yardim-derlenme-izle': () => <WatchBreath c={DER} />,
  'ilk-yardim-derlenme-kpr': () => <Cpr c={DER} />,
  // Hava yolu tıkanması (HYT)
  'ilk-yardim-bogulma-isaret': () => <BogulmaIsaret />,
  'ilk-yardim-sirt-vurusu': () => <SirtVurusu />,
  'ilk-yardim-yumruk-yeri': () => <YumrukYeri />,
  'ilk-yardim-karin-basisi': () => <KarinBasisi />,
  'ilk-yardim-bogulma-kpr': () => <Cpr c={HYT} />,
  // Nöbet (NOB)
  'ilk-yardim-nobet-cevre': () => <NobetCevre />,
  'ilk-yardim-nobet-yastik': () => <NobetYastik />,
  'ilk-yardim-nobet-saat': () => <NobetSaat />,
  'ilk-yardim-nobet-derlenme': () => <Recovery c={NOB} />,
};
