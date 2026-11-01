import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('guvenlik araması', () => {
  it.each([
    ['çocuğum kayboldu', 'guvenlik-kayip-cocuk'],
    ['yalnız çocuk buldum ne yapmalıyım', 'guvenlik-kayip-cocuk'],
    ['sahte bağış kampanyası', 'guvenlik-yardim-dolandiriciligi'],
    ['yardım diye iban gönderdiler dolandırıcı mı', 'guvenlik-yardim-dolandiriciligi'],
    ['çadır kentte kadın güvenliği', 'guvenlik-cadir-kent'],
    ['gece tuvalete gitmek güvenli mi', 'guvenlik-cadir-kent'],
    ['evden ayrılırken yağma olmasın', 'guvenlik-bos-ev'],
    ['boş eve hırsız girer mi', 'guvenlik-bos-ev'],
    ['bu haber doğru mu yalan haber', 'guvenlik-yanlis-bilgi'],
    ['büyük deprem geliyor mesajı', 'guvenlik-yanlis-bilgi'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
