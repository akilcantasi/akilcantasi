// Çizim kiti v2 örnek sahneleri — yeni sahneler yazarken kopyalanacak kalıplar.
import type { JSX } from 'preact';
import {
  Arrow, Backpack, Bottle, Cane, Cloth, Blood, Door, Flame, GY, Hand, K, Label, Person, Phone, POSE, Rock,
  Scene2, Smoke, Table, Tree, Water, Waves, Window, handPoint, rig,
} from '../kit2';
import type { PersonProps } from '../kit2';

export const SCENES: Record<string, () => JSX.Element> = {
  'ornek-ayakta': () => (
    <Scene2 bg="indoor">
      <Window x={30} y={60} />
      <Person x={176} y={230} s={1.25} who="man" role="bystander" pose={{ ...POSE.stand, face: 'calm' }} />
    </Scene2>
  ),

  'ornek-kpr': () => {
    const victim: PersonProps = { x: 146, y: 226, s: 1.15, who: 'man', role: 'victim', pose: POSE.lieBack, skin: 0, hairC: K.hair.brown };
    const v = rig(victim);
    const c: [number, number] = [v.chest[0] - 2, v.chest[1] + 1];
    const resc: PersonProps = {
      x: c[0], ax: 'shoulderF', y: 217, s: 1.15, flip: true, who: 'man', role: 'helper',
      pose: { spine: -58, chest: -56, head: -30, legB: [70, 178], legF: [66, 176], armB: { to: [c[0] + 1, c[1]] }, armF: { to: c }, handB: { shape: 'flat', a: -95 }, handF: { shape: 'flat', a: -88 }, face: 'calm' },
    };
    return (
      <Scene2 bg="indoor">
        <Person {...resc} />
        <Person {...victim} />
        <Arrow from={[c[0] + 50, 96]} to={[c[0] + 50, 150]} />
        <Label x={262} y={40} text="100–120/dk" size={15} />
      </Scene2>
    );
  },

  'ornek-derlenme': () => {
    const p: PersonProps = { x: 186, y: 222, who: 'man', role: 'victim', pose: POSE.recovery };
    const r = rig(p);
    return (
      <Scene2 bg="indoor">
        <Person {...p} />
        <Waves x={r.head[0] + 2} y={r.head[1] - 22} a={-90} n={3} r={5} color={K.water} />
      </Scene2>
    );
  },

  'ornek-kanama': () => (
    <Scene2 bg="closeup">
      <Hand x={70} y={170} a={-90} s={0.9} pose="open" side="L" arm={240} sleeve={K.role.victim} skin={0} />
      <Blood x={212} y={186} s={1.1} />
      <Blood x={128} y={186} s={0.7} />
      <Cloth x={170} y={170} w={78} h={40} a={-3} />
      <Hand x={128} y={112} a={140} s={0.9} pose="press" side="L" arm={80} sleeve={K.role.helper} skin={2} />
      <Hand x={212} y={112} a={220} s={0.9} pose="press" side="R" arm={80} sleeve={K.role.helper} skin={2} />
      <Arrow from={[170, 34]} to={[170, 112]} w={7} />
    </Scene2>
  ),

  'ornek-cok-kapan': () => {
    const leg: [number, number] = [250, 188];
    return (
      <Scene2 bg="indoor">
        <Table x={50} y={224} w={220} h={100} />
        <Person x={154} y={224} s={1.2} who="man" role="helper" pose={{ ...POSE.dropCover, armB: { to: leg } }} />
      </Scene2>
    );
  },

  'ornek-duman': () => (
    <Scene2 bg="indoor">
      <Door x={248} y={212} />
      <Flame x={40} y={208} s={1.1} />
      <Smoke x={0} y={0} w={320} h={120} />
      <Person x={130} y={224} who="woman" role="victim" pose={POSE.crawl} />
      <Arrow from={[186, 196]} to={[236, 196]} />
    </Scene2>
  ),

  'ornek-telefon': () => {
    const h = { x: 150, y: 240, a: 8, s: 1.55, pose: 'hold' as const, side: 'R' as const, grip: 38 };
    const g = handPoint(h, 'grip');
    return (
      <Scene2 bg="closeup">
        <Hand {...h} arm={40} sleeve={K.role.helper}>
          <Phone x={g[0]} y={g[1]} s={1.55} a={8} text="112" />
        </Hand>
        <Waves x={g[0] + 46} y={g[1] - 40} a={-20} n={3} r={9} />
      </Scene2>
    );
  },

  'ornek-dere': () => {
    const grip: [number, number] = [222, 200];
    return (
      <Scene2 bg="outdoor">
        <Tree x={36} y={188} kind="pine" s={1.1} />
        <Tree x={292} y={190} kind="leaf" s={0.95} />
        <Tree x={84} y={186} kind="pine" s={0.8} />
        <Water x={0} y={214} w={320} h={30} />
        <Rock x={300} y={216} s={0.7} />
        <Bottle x={grip[0] - 4} y={grip[1] - 6} a={122} s={1.1} fill={0.6} />
        <rect x={236} y={216} width={50} height={24} fill={K.water} opacity={0.55} />
        <ellipse cx={252} cy={216} rx={16} ry={3.5} fill="none" stroke={K.waterLight} stroke-width={2} />
        <Person x={146} y={210} who="man" role="helper" pose={{ ...POSE.kneelOne, spine: -40, chest: -30, head: -10, legF: [-10, 88], armF: { to: grip }, armB: { at: 'kneeF', d: [-4, -6] } }} />
      </Scene2>
    );
  },

  'ornek-aile': () => {
    const hand: [number, number] = [176, 146];
    const parent: PersonProps = { x: 140, y: 218, who: 'woman', role: 'bystander2', pose: { ...POSE.walk, armF: { to: hand }, face: 'calm' } };
    const child: PersonProps = { x: 206, y: 218, who: 'boy', role: 'helper', pose: { ...POSE.walk, armB: { to: hand }, face: 'calm' } };
    const pack = (c: string) => (r: ReturnType<typeof rig>) => <Backpack x={r.back[0] - 9 * r.s} y={r.neck[1] + 6 * r.s} s={r.s * 1.05} color={c} />;
    return (
      <Scene2 bg="outdoor">
        <Tree x={40} y={196} s={0.9} />
        <Tree x={292} y={194} kind="pine" s={0.9} />
        <Person {...parent} back={pack('#c0603e')} />
        <Person {...child} s={1} back={(r) => <Backpack x={r.back[0] - 7} y={r.neck[1] + 4} s={0.72} color="#4f7fb0" />} />
      </Scene2>
    );
  },

  'ornek-yasli': () => {
    const elder: PersonProps = { x: 190, y: 220, who: 'oldman', role: 'bystander4', pose: { spine: -84, chest: -70, head: -78, legB: [104, 104], legF: [76, 86], armB: [92, 80], armF: { to: [236, 150] } } };
    const e = rig(elder);
    return (
      <Scene2 bg="outdoor">
        <Tree x={300} y={194} s={0.9} />
        <Cane top={[238, 152]} bottom={[248, 220]} />
        <Person {...elder} />
        <Person x={128} y={218} who="woman" role="helper" hair="bun" hairC={K.hair.black} pose={{ ...POSE.walk, armF: { to: e.back }, armB: [70, 40], face: 'calm' }} />
      </Scene2>
    );
  },

  'ornek-islak-bez': () => {
    const p: PersonProps = { x: 160, y: 92, ax: 'head', ay: 'head', s: 2.7, who: 'woman', role: 'victim', hair: 'bun', hairC: K.hair.dark, pose: { ...POSE.stand, face: 'worried' } };
    const r = rig(p);
    return (
      <Scene2 bg="closeup">
        <Smoke x={0} y={0} w={320} h={56} op={0.6} />
        <Person {...p} only={['torso', 'head', 'armB']} />
        <Cloth x={r.mouth[0]} y={r.mouth[1] + 2} w={62} h={26} wet a={-3} />
        <Hand x={190} y={150} a={-50} s={0.8} pose="press" side="R" arm={230} sleeve={K.role.victim} skin={1} />
      </Scene2>
    );
  },

  'ornek-bebek': () => {
    // Beşik tutuşu: bebeğin başı annenin sol dirseğinde, sol önkol bebeğin altında, sağ el karnında.
    const mom: PersonProps = { x: 156, y: 230, s: 1.22, who: 'woman', role: 'bystander', hairC: K.hair.black, pose: { ...POSE.stand, head: -98, face: 'calm' } };
    const m = rig(mom);
    const elbow: [number, number] = [m.shoulderB[0] - 6, m.shoulderB[1] + 30];
    const baby: PersonProps = { x: elbow[0] + 40, y: elbow[1] + 2, ay: 'hip', s: 1.25, who: 'baby', shadow: false, pose: { spine: 192, chest: 196, head: 206, legB: [-70, 10], legF: [-55, 20], armB: [-110, -40], armF: [-80, -20], face: 'closed' } };
    const b = rig(baby);
    const hold: PersonProps = { ...mom, pose: { ...mom.pose, armB: { to: [b.hip[0] + 4, b.hip[1] + 8], bend: 1 }, armF: { to: [b.chest[0] + 6, b.chest[1] + 2], bend: -1 } } };
    return (
      <Scene2 bg="indoor">
        <Window x={238} y={56} />
        <Person {...hold} only={['legB', 'legF', 'torso', 'head', 'armB']} />
        <Person {...baby} />
        <Person {...hold} only={['armF']} />
      </Scene2>
    );
  },
};
