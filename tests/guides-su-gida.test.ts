import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('su-gida araması', () => {
  it.each([
    ['çamaşır suyu ile su nasıl arıtılır', 'su-aritma'],
    ['musluk suyu içilir mi', 'su-aritma'],
    ['elektrik gitti buzdolabındaki et bozuldu mu', 'gida-guvenligi'],
    ['şişmiş konserve', 'gida-guvenligi'],
    ['kişi başı kaç litre su stoklamalıyım', 'su-gida-su-depolama'],
    ['su bidonu kaç ay saklanır', 'su-gida-su-depolama'],
    ['sular kesildi termosifondaki su içilir mi', 'su-gida-evdeki-gizli-su'],
    ['kalorifer suyu içilir mi', 'su-gida-evdeki-gizli-su'],
    ['ocak yok pişirmeden ne yenir', 'su-gida-pisirmeden-beslenme'],
    ['konserveyi soğuk yiyebilir miyim', 'su-gida-pisirmeden-beslenme'],
    ['yemek sıcakta kaç saat dışarıda kalabilir', 'su-gida-sicakta-gida'],
    ['soğutma çantası', 'su-gida-sicakta-gida'],
    ['kamp mutfağında toplu yemek', 'su-gida-toplu-mutfak'],
    ['aşevi hijyen kuralları', 'su-gida-toplu-mutfak'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
