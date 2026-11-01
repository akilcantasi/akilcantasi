// Çocuk köşesi oyunlarının saf mantığı (DOM'suz, test edilir).

// ---------------- Hafıza oyunu ----------------
export interface Card {
  /** kart sırası (0..n-1) */
  id: number;
  pic: string;
  open: boolean;
  matched: boolean;
}

export interface MemoryGame {
  cards: Card[];
  /** açık ama henüz eşleşmemiş kartların indeksleri (en çok 2) */
  picked: number[];
  moves: number;
  matches: number;
  /** iki yanlış kart açıkken true; hideMismatch ile kapanır */
  locked: boolean;
}

/** Fisher–Yates karıştırma (rng enjekte edilebilir). Yeni dizi döner. */
export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newMemoryGame(pics: readonly string[], rng: () => number = Math.random): MemoryGame {
  const deck = shuffle([...pics, ...pics], rng);
  return { cards: deck.map((pic, id) => ({ id, pic, open: false, matched: false })), picked: [], moves: 0, matches: 0, locked: false };
}

export function flip(g: MemoryGame, i: number): MemoryGame {
  const card = g.cards[i];
  if (!card || g.locked || card.open || card.matched || g.picked.length >= 2) return g;
  const cards = g.cards.map((c, k) => (k === i ? { ...c, open: true } : c));
  const picked = [...g.picked, i];
  if (picked.length < 2) return { ...g, cards, picked };
  const [a, b] = picked;
  const moves = g.moves + 1;
  if (cards[a].pic === cards[b].pic) {
    cards[a] = { ...cards[a], matched: true };
    cards[b] = { ...cards[b], matched: true };
    return { cards, picked: [], moves, matches: g.matches + 1, locked: false };
  }
  return { ...g, cards, picked, moves, locked: true };
}

export function hideMismatch(g: MemoryGame): MemoryGame {
  if (!g.locked) return g;
  const cards = g.cards.map((c, k) => (g.picked.includes(k) ? { ...c, open: false } : c));
  return { ...g, cards, picked: [], locked: false };
}

export function isWon(g: MemoryGame): boolean {
  return g.cards.length > 0 && g.cards.every((c) => c.matched);
}

// ---------------- Boyama: boya kovası ----------------
/**
 * Dört yönlü taşma dolgusu. `data` RGBA piksel dizisidir (yerinde değişir).
 * `wall[i] = 1` olan pikseller (çizgiler) sınırdır ve boyanmaz.
 * Başlangıç pikselinin rengine `tol` farkıyla yakın pikseller boyanır. Boyanan piksel sayısını döner.
 */
export function floodFill(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x: number,
  y: number,
  rgba: [number, number, number, number],
  wall?: Uint8Array,
  tol = 40,
): number {
  x = Math.floor(x);
  y = Math.floor(y);
  if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  const start = y * w + x;
  if (wall && wall[start]) return 0;
  const p0 = start * 4;
  const r0 = data[p0], g0 = data[p0 + 1], b0 = data[p0 + 2], a0 = data[p0 + 3];
  if (Math.abs(r0 - rgba[0]) <= 2 && Math.abs(g0 - rgba[1]) <= 2 && Math.abs(b0 - rgba[2]) <= 2 && Math.abs(a0 - rgba[3]) <= 2) return 0;
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let sp = 0;
  stack[sp++] = start;
  seen[start] = 1;
  let n = 0;
  const near = (i: number) => {
    const p = i * 4;
    return Math.abs(data[p] - r0) <= tol && Math.abs(data[p + 1] - g0) <= tol && Math.abs(data[p + 2] - b0) <= tol && Math.abs(data[p + 3] - a0) <= tol;
  };
  while (sp > 0) {
    const i = stack[--sp];
    const p = i * 4;
    data[p] = rgba[0];
    data[p + 1] = rgba[1];
    data[p + 2] = rgba[2];
    data[p + 3] = rgba[3];
    n++;
    const px = i % w;
    const py = (i - px) / w;
    const nb = [px > 0 ? i - 1 : -1, px < w - 1 ? i + 1 : -1, py > 0 ? i - w : -1, py < h - 1 ? i + w : -1];
    for (const j of nb) {
      if (j < 0 || seen[j] || (wall && wall[j])) continue;
      seen[j] = 1;
      if (near(j)) stack[sp++] = j;
    }
  }
  return n;
}

export function hexToRgba(hex: string): [number, number, number, number] {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16), 255];
}

// ---------------- Nefes oyunu ----------------
export const BREATH_MS = 4000;

/** Döngü: 4 sn nefes al (balon şişer), 4 sn nefes ver (balon söner). */
export function breathPhase(ms: number, step = BREATH_MS): { phase: 'in' | 'out'; t: number; count: number; scale: number; cycle: number } {
  const m = Math.max(0, ms);
  const cycle = Math.floor(m / (2 * step));
  const inCycle = m % (2 * step);
  const phase = inCycle < step ? 'in' : 'out';
  const t = (inCycle % step) / step;
  const count = Math.min(4, Math.floor(t * 4) + 1);
  // yumuşak geçiş (ease-in-out)
  const ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
  const scale = phase === 'in' ? 0.55 + 0.45 * ease : 1 - 0.45 * ease;
  return { phase, t, count, scale, cycle };
}
