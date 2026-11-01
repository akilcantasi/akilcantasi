// "Sıfırdan" rehber paketlerinin kaynak biçimi.
// Her paket: packs-src/sifirdan/<paket-klasörü>/guides.ts (+ spec.ts, scenes.tsx)
import type { CategoryMeta, Guide } from '../../src/content/types';

export interface PackMeta {
  /** Paket kimliği, ör. 'sifirdan-yiyecek-saklama' */
  id: string;
  /** Kütüphane'de görünen ad */
  name: string;
  /** Bir-iki cümlelik açıklama */
  desc: string;
  version: number;
}

/** Paket rehberi: hangi kategoride olduğu `category` ile belirtilir. */
export type PackGuide = Guide & { category: string };

export type { CategoryMeta, Guide };
