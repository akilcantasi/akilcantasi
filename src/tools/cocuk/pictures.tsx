// Basit çizimler (100×100 görünüm kutusu). Hafıza kartları dolgulu çizer; boyama sayfası aynı
// yolları yalnızca çizgi olarak kullanır (kapalı yollar boya kovası için bölge oluşturur).

export interface Shape {
  d: string;
  fill?: string;
  /** yalnızca çizgi (dolgu yok) */
  line?: boolean;
  w?: number;
}

const c = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const e = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

function star(cx: number, cy: number, R: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r : R;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return 'M' + pts.join(' L') + ' Z';
}

function rays(cx: number, cy: number, r1: number, r2: number, n: number): string {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i * 2 * Math.PI) / n;
    d += `M${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)} L${(cx + r2 * Math.cos(a)).toFixed(1)} ${(cy + r2 * Math.sin(a)).toFixed(1)} `;
  }
  return d.trim();
}

export const PICS: Record<string, { name: string; shapes: Shape[] }> = {
  sun: {
    name: 'Güneş',
    shapes: [
      { d: rays(50, 50, 28, 42, 8), line: true, fill: '#ffb000', w: 5 },
      { d: c(50, 50, 21), fill: '#ffc93c' },
      { d: c(43, 46, 2.5), fill: '#1d2430' },
      { d: c(57, 46, 2.5), fill: '#1d2430' },
      { d: 'M41 56 Q50 64 59 56', line: true, w: 2.5 },
    ],
  },
  moon: {
    name: 'Ay',
    shapes: [{ d: 'M60 12 A38 38 0 1 0 88 66 A30 30 0 1 1 60 12 Z', fill: '#ffe08a' }, { d: star(80, 24, 7, 3), fill: '#fff3b0' }],
  },
  star: { name: 'Yıldız', shapes: [{ d: star(50, 54, 42, 18), fill: '#ffd23f' }] },
  heart: {
    name: 'Kalp',
    shapes: [
      { d: 'M50 86 C20 64 10 48 10 33 C10 19 21 11 32 11 C41 11 47 17 50 24 C53 17 59 11 68 11 C79 11 90 19 90 33 C90 48 80 64 50 86 Z', fill: '#ff5d73' },
    ],
  },
  apple: {
    name: 'Elma',
    shapes: [
      { d: 'M50 30 C40 22 18 24 18 50 C18 72 34 88 44 88 C48 88 49 86 50 86 C51 86 52 88 56 88 C66 88 82 72 82 50 C82 24 60 22 50 30 Z', fill: '#e63946' },
      { d: 'M50 30 L52 13', line: true, w: 4 },
      { d: 'M53 21 C59 11 71 10 77 14 C71 22 61 25 53 21 Z', fill: '#52b788' },
    ],
  },
  fish: {
    name: 'Balık',
    shapes: [
      { d: 'M70 50 L92 32 L92 68 Z', fill: '#4895ef' },
      { d: e(45, 50, 30, 20), fill: '#4cc9f0' },
      { d: 'M36 31 Q46 16 58 32', line: true, w: 3 },
      { d: c(29, 46, 4), fill: '#1d2430' },
      { d: 'M48 40 Q54 50 48 60', line: true, w: 3 },
    ],
  },
  flower: {
    name: 'Çiçek',
    shapes: [
      { d: 'M50 52 L50 94', line: true, w: 4 },
      { d: 'M50 78 C58 64 74 64 78 68 C70 80 58 82 50 78 Z', fill: '#52b788' },
      ...[0, 1, 2, 3, 4].map((i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return { d: c(+(50 + 15 * Math.cos(a)).toFixed(1), +(38 + 15 * Math.sin(a)).toFixed(1), 11), fill: '#ff8fab' };
      }),
      { d: c(50, 38, 9), fill: '#ffd23f' },
    ],
  },
  house: {
    name: 'Ev',
    shapes: [
      { d: 'M22 48 H78 V88 H22 Z', fill: '#f4a261' },
      { d: 'M12 50 L50 14 L88 50 Z', fill: '#e76f51' },
      { d: 'M46 88 V66 H60 V88 Z', fill: '#8d5b3e' },
      { d: 'M28 56 H40 V68 H28 Z', fill: '#a8dadc' },
      { d: 'M64 24 H72 V38 L64 31 Z', fill: '#9a8c98' },
    ],
  },
  tree: {
    name: 'Ağaç',
    shapes: [
      { d: 'M44 58 H56 V92 H44 Z', fill: '#8d5b3e' },
      { d: c(32, 50, 16), fill: '#40916c' },
      { d: c(68, 50, 16), fill: '#40916c' },
      { d: c(50, 34, 22), fill: '#52b788' },
    ],
  },
  balloon: {
    name: 'Balon',
    shapes: [
      { d: 'M50 76 Q42 84 52 90 Q58 94 50 99', line: true, w: 2.5 },
      { d: 'M45 70 L55 70 L50 77 Z', fill: '#e63946' },
      { d: e(50, 40, 25, 31), fill: '#ff6b6b' },
      { d: 'M38 24 Q34 32 35 40', line: true, w: 3, fill: '#ffffff' },
    ],
  },
  turtle: {
    name: 'Kaplumbağa',
    shapes: [
      { d: c(84, 56, 9), fill: '#95d5b2' },
      { d: e(28, 68, 9, 7), fill: '#95d5b2' },
      { d: e(68, 68, 9, 7), fill: '#95d5b2' },
      { d: 'M14 64 C14 36 32 24 50 24 C68 24 80 36 80 64 Z', fill: '#2d6a4f' },
      { d: 'M38 42 L56 42 L63 53 L56 64 L38 64 L31 53 Z', fill: '#74c69d' },
      { d: c(87, 54, 1.8), fill: '#1d2430' },
    ],
  },
  cat: {
    name: 'Kedi',
    shapes: [
      { d: 'M24 42 L26 12 L46 28 Z', fill: '#f6a04d' },
      { d: 'M76 42 L74 12 L54 28 Z', fill: '#f6a04d' },
      { d: c(50, 56, 30), fill: '#f6a04d' },
      { d: c(39, 52, 4.5), fill: '#1d2430' },
      { d: c(61, 52, 4.5), fill: '#1d2430' },
      { d: 'M45 63 L55 63 L50 69 Z', fill: '#ff8fab' },
      { d: 'M50 69 Q44 76 38 72 M50 69 Q56 76 62 72', line: true, w: 2.5 },
      { d: 'M30 62 L12 58 M30 67 L12 70 M70 62 L88 58 M70 67 L88 70', line: true, w: 2 },
    ],
  },
  bird: {
    name: 'Kuş',
    shapes: [
      { d: e(46, 58, 28, 19), fill: '#90e0ef' },
      { d: c(70, 40, 13), fill: '#90e0ef' },
      { d: 'M81 37 L94 42 L81 47 Z', fill: '#f4a261' },
      { d: 'M30 54 Q46 36 58 58 Z', fill: '#48cae4' },
      { d: c(72, 37, 2.4), fill: '#1d2430' },
    ],
  },
  cloud: {
    name: 'Bulut',
    shapes: [
      { d: 'M26 70 C12 70 10 52 24 50 C24 36 42 30 50 40 C56 28 76 30 76 46 C90 46 92 70 76 70 Z', fill: '#dfe7fd' },
      { d: 'M34 78 L30 88 M50 78 L46 88 M66 78 L62 88', line: true, w: 3, fill: '#4da3ff' },
    ],
  },
};

export const MEMORY_PICS = ['sun', 'moon', 'star', 'heart', 'apple', 'fish', 'flower', 'house'];
export const COLORING_PICS = ['house', 'fish', 'flower', 'turtle', 'cat', 'balloon', 'sun', 'tree'];

export function Pic({ id, size = 64, outline = false }: { id: string; size?: number | string; outline?: boolean }) {
  const p = PICS[id];
  if (!p) return null;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={p.name}>
      {p.shapes.map((s, i) =>
        s.line ? (
          <path key={i} d={s.d} fill="none" stroke={outline ? '#1d2430' : s.fill ?? '#1d2430'} stroke-width={s.w ?? 2.5} stroke-linecap="round" />
        ) : (
          <path key={i} d={s.d} fill={outline ? '#fff' : s.fill} stroke="#1d2430" stroke-width="2.5" stroke-linejoin="round" />
        ),
      )}
    </svg>
  );
}
