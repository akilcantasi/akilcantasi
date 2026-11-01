import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('hazirlik araması', () => {
  it.each([
    ['deprem çantasında ne olmalı', 'afet-cantasi'],
    ['acil durum çantası listesi', 'afet-cantasi'],
    ['telefon çekmiyor ne yapayım', 'iletisim'],
    ['hatlar meşgul sms', 'iletisim'],
    ['dolabı duvara nasıl sabitlerim', 'hazirlik-ev-sabitleme'],
    ['mobilya sabitleme deprem', 'hazirlik-ev-sabitleme'],
    ['aile afet planı nasıl yapılır', 'hazirlik-aile-afet-plani'],
    ['şehir dışı irtibat kişisi', 'hazirlik-aile-afet-plani'],
    ['arabada bulunması zorunlu ekipman', 'hazirlik-arac-kiti'],
    ['bagajda ne olmalı', 'hazirlik-arac-kiti'],
    ['tapu ve kimlik fotokopisi nerede saklanır', 'hazirlik-belgeler'],
    ['önemli belgeleri koruma', 'hazirlik-belgeler'],
    ['evde ilk yardım çantasında ne olmalı', 'hazirlik-ilk-yardim-cantasi'],
    ['ecza dolabı', 'hazirlik-ilk-yardim-cantasi'],
    ['işyerinde deprem hazırlığı', 'hazirlik-is-okul'],
    ['okul afet planı', 'hazirlik-is-okul'],
    ['kedi köpek için afet hazırlığı', 'hazirlik-evcil-hayvan'],
    ['evcil hayvan afet çantası', 'hazirlik-evcil-hayvan'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
