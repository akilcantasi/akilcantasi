import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('yangın araması', () => {
  it.each([
    ['evde yangın çıktı', 'yangin'],
    ['her yer duman', 'yangin'],
    ['orman yanıyor', 'orman-yangini'],
    ['yangın tüpü nasıl kullanılır', 'yangin-sondurucu'],
    ['yangın söndürücü', 'yangin-sondurucu'],
    ['tavada yağ alev aldı', 'yangin-yag'],
    ['yağ yangını', 'yangin-yag'],
    ['priz yanıyor', 'yangin-elektrik'],
    ['elektrik yangını', 'yangin-elektrik'],
    ['arabadan duman çıkıyor', 'yangin-arac'],
    ['araba yanıyor', 'yangin-arac'],
    ['apartmanda yangın merdiven duman dolu', 'yangin-yuksek-bina'],
    ['duman soludu', 'yangin-duman-solunmasi'],
    ['dumandan zehirlenme', 'yangin-duman-solunmasi'],
    ['giysim tutuştu', 'yangin-giysi-tutustu'],
    ['duman dedektörü', 'yangin-kacis-plani'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
