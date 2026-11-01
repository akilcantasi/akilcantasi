// Rehber ana ekranındaki kategori kutuları. Kategoriler src/content/guides/*.ts
// dosyalarından gelir; bir rehber `alsoIn` ile birden çok kategoride görünebilir.
import { CATEGORY_LIST, GUIDES } from './guides';
import type { CategoryMeta } from './types';

export interface GuideCategory extends CategoryMeta {
  guides: string[];
}

export const CATEGORIES: GuideCategory[] = CATEGORY_LIST.map(({ primary, ...meta }) => ({
  ...meta,
  guides: [...primary.map((g) => g.id), ...GUIDES.filter((g) => g.alsoIn?.includes(meta.id)).map((g) => g.id)],
})).filter((c) => c.guides.length > 0);

export function categoryOf(guideId: string): GuideCategory | undefined {
  return CATEGORIES.find((c) => c.guides.includes(guideId));
}
