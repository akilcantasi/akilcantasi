// Tüm rehberler: src/content/guides/*.ts dosyalarından kendiliğinden toplanır.
// Elle hazırlanmış içeriktir; çalışma anında yapay zekâ tarafından üretilmez.
// ÖNEMLİ: `reviewed: false` olan rehberler henüz bir uzman tarafından incelenmedi.
import type { CategoryMeta, Guide } from './types';

export type { Guide, CategoryMeta } from './types';

const mods = import.meta.glob<{ CATEGORY: CategoryMeta; GUIDES: Guide[] }>('./guides/*.ts', { eager: true });

export const CATEGORY_LIST: (CategoryMeta & { primary: Guide[] })[] = Object.values(mods)
  .map((m) => ({ ...m.CATEGORY, primary: m.GUIDES }))
  .sort((a, b) => a.order - b.order);

export const GUIDES: Guide[] = CATEGORY_LIST.flatMap((c) => c.primary);
