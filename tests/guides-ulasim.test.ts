import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('ulasim araması', () => {
  it.each([
    ['trafik kazası gördüm', 'ulasim-trafik-kazasi'],
    ['motosiklet kazası kask çıkarılır mı', 'ulasim-trafik-kazasi'],
    ['arabada karda mahsur kaldık', 'ulasim-karda-mahsur'],
    ['tipide yolda kaldım', 'ulasim-karda-mahsur'],
    ['araba suya düştü', 'ulasim-suya-dusen-arac'],
    ['araba batıyor nasıl çıkarım', 'ulasim-suya-dusen-arac'],
    ['akü bitti takviye nasıl yapılır', 'ulasim-ariza-aku'],
    ['araba bozuldu reflektör kaç metre', 'ulasim-ariza-aku'],
    ['araçla tahliye', 'ulasim-tahliye-surus'],
    ['tahliyede araba kullanma', 'ulasim-tahliye-surus'],
    ['tünelde yangın', 'ulasim-tunel-kopru'],
    ['köprüdeyken deprem olursa', 'ulasim-tunel-kopru'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
