import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('deprem araması', () => {
  it.each([
    ['deprem oluyor ne yapmalıyım', 'deprem-aninda'],
    ['zelzele', 'deprem-aninda'],
    ['deprem bitti şimdi ne yapacağım', 'deprem-sonrasi'],
    ['artçı deprem', 'deprem-sonrasi'],
    ['enkaz altında kaldım', 'enkaz-altinda'],
    ['enkazdan insan nasıl çıkarılır', 'enkaz-kurtarma'],
    ['avmde deprem olursa', 'deprem-kalabalik-alan'],
    ['metroda deprem olursa ne yapmalı', 'deprem-kalabalik-alan'],
    ['hasarlı binaya girebilir miyim', 'deprem-hasarli-bina'],
    ['evde kolonda çatlak var', 'deprem-hasarli-bina'],
    ['depremde bebeğimi nasıl korurum', 'deprem-cocuklar'],
    ['depremde çocuk', 'deprem-cocuklar'],
    ['yüksek katta deprem', 'deprem-yuksek-bina'],
    ['asansörde deprem olursa', 'deprem-yuksek-bina'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
