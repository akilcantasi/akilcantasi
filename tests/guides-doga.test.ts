import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('doga araması', () => {
  it.each([
    ['ormanda kayboldum', 'doga-kaybolma'],
    ['dağda yolumu kaybettim', 'doga-kaybolma'],
    ['titremesi durdu çok üşüdü', 'hipotermi'],
    ['yılan soktu', 'hayvan-isirigi'],
    ['arı soktu', 'hayvan-isirigi'],
    ['dağda sis bastı', 'doga-hava-degisimi'],
    ['dağda hava aniden bozuldu', 'doga-hava-degisimi'],
    ['tek başıma yaralandım', 'doga-yalniz-yaralanma'],
    ['yürüyüşte düştüm yalnızım', 'doga-yalniz-yaralanma'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
