// Rehber adımlarına karşılık gelen çizimler artık her rehberin `art` alanında.
import { GUIDES } from './guides';

export const GUIDE_ART: Record<string, (string | null)[]> = Object.fromEntries(GUIDES.map((g) => [g.id, g.art ?? []]));

/** Rehberin küçük resmi: ilk çizimli adım */
export function guideThumb(id: string): string | null {
  return (GUIDE_ART[id] ?? []).find((x) => !!x) ?? null;
}
