import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('ozel-gruplar araması', () => {
  it.each([
    ['afette bebek bakımı', 'ozel-gruplar-bebek-bakimi'],
    ['bebek üşüyor ne yapmalı', 'ozel-gruplar-bebek-bakimi'],
    ['emzirmeye devam edebilir miyim', 'ozel-gruplar-bebek-beslenme'],
    ['bebek maması nasıl hazırlanır', 'ozel-gruplar-bebek-beslenme'],
    ['hamileyim kanama var', 'ozel-gruplar-hamile'],
    ['hamile kadin deprem', 'ozel-gruplar-hamile'],
    ['doğum başladı ambulans yok', 'ozel-gruplar-acil-dogum'],
    ['çadırda doğum', 'ozel-gruplar-acil-dogum'],
    ['yaşlı annem için ne yapmalıyım', 'ozel-gruplar-yasli'],
    ['tekerlekli sandalyede deprem', 'ozel-gruplar-engelli-hareket'],
    ['yatalak hasta tahliye', 'ozel-gruplar-engelli-hareket'],
    ['görme engelli birine nasıl yardım ederim', 'ozel-gruplar-engelli-gorme-isitme'],
    ['sağır biriyle nasıl anlaşırım', 'ozel-gruplar-engelli-gorme-isitme'],
    ['otizmli çocuk deprem', 'ozel-gruplar-engelli-zihinsel'],
    ['alzheimer hasta babam', 'ozel-gruplar-engelli-zihinsel'],
    ['insülin buzdolabı yok', 'ozel-gruplar-kronik-hastalik'],
    ['diyalize giremiyorum', 'ozel-gruplar-kronik-hastalik'],
    ['kedimi nasıl tahliye ederim', 'ozel-gruplar-evcil-hayvan'],
    ['köpeğim kayboldu', 'ozel-gruplar-evcil-hayvan'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
