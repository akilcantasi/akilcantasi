import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('tesisat araması', () => {
  it.each([
    ['evde gaz kokusu var', 'tesisat-gaz-kacagi'],
    ['doğalgaz kaçağı ne yapmalı', 'tesisat-gaz-kacagi'],
    ['elektrikler gitti', 'tesisat-elektrik-kesintisi'],
    ['cereyan kesildi', 'tesisat-elektrik-kesintisi'],
    ['jeneratör nereye konur', 'tesisat-jenerator'],
    ['jeneratörü prize takmak', 'tesisat-jenerator'],
    ['su borusu patladı', 'tesisat-boru-patlamasi'],
    ['tavandan su akıyor', 'tesisat-boru-patlamasi'],
    ['arabadan telefon şarj etmek', 'tesisat-arabada-sarj'],
    ['aküden telefon şarjı', 'tesisat-arabada-sarj'],
    ['güneş paneli ile şarj', 'tesisat-gunes-powerbank'],
    ['powerbank şişti', 'tesisat-gunes-powerbank'],
    ['tüp kokuyor', 'tesisat-tup-guvenligi'],
    ['lpg tüpü güvenliği', 'tesisat-tup-guvenligi'],
    ['su bastı elektrik çarpar mı', 'tesisat-hasarli-elektrik'],
    ['düşen elektrik teli', 'tesisat-hasarli-elektrik'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
