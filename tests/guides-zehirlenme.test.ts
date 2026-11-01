import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('zehirlenme araması', () => {
  it.each([
    ['sobadan zehirlendik', 'karbonmonoksit'],
    ['jeneratör zehirlenmesi', 'karbonmonoksit'],
    ['zehirlenme', 'zehirlenme'],
    ['çamaşır suyu içti', 'zehirlenme'],
    ['mantar yedik kusuyoruz', 'zehirlenme-mantar'],
    ['yabani mantar zehirlenmesi', 'zehirlenme-mantar'],
    ['gıda zehirlenmesi', 'zehirlenme-gida'],
    ['yemekten zehirlendik ishal', 'zehirlenme-gida'],
    ['çocuk ilaç yuttu', 'zehirlenme-cocuk-yutma'],
    ['bebek düğme pil yuttu', 'zehirlenme-cocuk-yutma'],
    ['sahte içki içtim gözüm bulanık', 'zehirlenme-metanol'],
    ['metil alkol zehirlenmesi', 'zehirlenme-metanol'],
    ['tarım ilacı zehirlenmesi', 'zehirlenme-tarim-ilaci'],
    ['böcek ilacı bulaştı', 'zehirlenme-tarim-ilaci'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
