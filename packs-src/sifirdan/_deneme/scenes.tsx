// Deneme sahnesi: kit2 ile çizilir, derlemede sabit SVG metnine çevrilir.
import type { JSX } from 'preact';
import { GY, Label, Rock, Flame, Scene2, Tree } from '../../../src/art/kit2';

export const SCENES: Record<string, () => JSX.Element> = {
  'sf-dn-tas-cember': () => (
    <Scene2 bg="outdoor" ground="dirt">
      <Tree x={60} y={GY} s={1.1} />
      {[-58, -36, -12, 12, 36, 58].map((dx) => (
        <Rock key={dx} x={180 + dx} y={GY + 14 + Math.abs(dx) * -0.08} s={0.55} />
      ))}
      <Flame x={180} y={GY + 6} s={1.3} />
      <Label x={180} y={44} text="Taş çember" size={15} />
    </Scene2>
  ),
};
