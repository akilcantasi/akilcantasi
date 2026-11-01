// Rehber adımlarına karşılık gelen çizimler artık her rehberin `art` alanında.
import { GUIDES } from './guides';
import { getPackGuide } from './pack-guides';

export const GUIDE_ART: Record<string, (string | null)[]> = Object.fromEntries(GUIDES.map((g) => [g.id, g.art ?? []]));

/** Rehberin adım çizimleri (yerleşik ya da kurulu rehber paketinden) */
export function guideArt(id: string): (string | null)[] {
  return GUIDE_ART[id] ?? getPackGuide(id)?.art ?? [];
}

/** Rehberin küçük resmi: ilk çizimli adım */
export function guideThumb(id: string): string | null {
  return guideArt(id).find((x) => !!x) ?? null;
}
