import { describe, expect, it } from 'vitest';
import { fold, itemsToText, pageParagraphs, searchPages } from '../src/lib/pdf';

describe('PDF okuyucu yardımcıları', () => {
  it('Türkçe duyarsız katlama uzunluğu korur', () => {
    expect(fold('İÇME SUYU Şişe')).toBe('icme suyu sise');
    expect(fold('Işık').length).toBe('Işık'.length);
  });
  it('sayfa metni satır sonlarıyla birleşir', () => {
    expect(itemsToText([{ str: 'Boil' }, { str: 'water', hasEOL: true }, { str: '' , hasEOL: true }, { str: 'for one minute.' }])).toBe('Boil water\n\nfor one minute.');
  });
  it('arama: sayfa, konum ve bağlam', () => {
    const hits = searchPages(['Kaynatın. Su güvenli olur.', undefined, 'Bring water to a boil; boil again.'], 'BOIL');
    expect(hits.map((h) => [h.page, h.match])).toEqual([
      [3, 'boil'],
      [3, 'boil'],
    ]);
    expect(searchPages(['İçme suyu'], 'icme')[0].match).toBe('İçme');
    expect(searchPages(['abc'], 'a')).toEqual([]);
  });
  it('paragraflara bölme', () => {
    expect(pageParagraphs('Bir\nsatır devam.\n\nİkinci paragraf.')).toEqual(['Bir satır devam.', 'İkinci paragraf.']);
  });
});
