import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('sel araması', () => {
  it.each([
    ['evi su bastı', 'sel'],
    ['dere taştı', 'sel'],
    ['heyelan', 'heyelan'],
    ['toprak kayması', 'heyelan'],
    ['tsunami', 'sel-tsunami'],
    ['deniz çekildi', 'sel-tsunami'],
    ['sele kapıldım', 'sel-akintiya-kapilma'],
    ['akıntıya kapıldı ne yapmalı', 'sel-akintiya-kapilma'],
    ['sel sonrası temizlik', 'sel-sonrasi-temizlik'],
    ['selden sonra eve dönüş', 'sel-sonrasi-temizlik'],
    ['çamur akışı', 'sel-camur-akisi'],
    ['dereden çamur geliyor', 'sel-camur-akisi'],
    ['arabayla sele kapıldım', 'sel-arac'],
    ['alt geçit su doldu', 'sel-arac'],
    ['sel uyarısı', 'sel-uyarisi'],
    ['meteoroloji turuncu uyarı verdi', 'sel-uyarisi'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
