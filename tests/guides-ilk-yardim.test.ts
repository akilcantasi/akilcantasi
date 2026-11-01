import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('ilk-yardim araması', () => {
  it.each([
    ['yaralıya ilk ne yapılır', 'ilk-yardim-ilk-degerlendirme'],
    ['olay yeri güvenliği', 'ilk-yardim-ilk-degerlendirme'],
    ['kan durmuyor', 'kanama'],
    ['turnike nasıl takılır', 'kanama'],
    ['kalp masajı nasıl yapılır', 'temel-yasam-destegi'],
    ['nefes almıyor', 'temel-yasam-destegi'],
    ['çocuk kalp masajı', 'ilk-yardim-cocuk-kpr'],
    ['cocuk nefes almiyor', 'ilk-yardim-cocuk-kpr'],
    ['bebek kalp masajı', 'ilk-yardim-bebek-kpr'],
    ['bebek nefes almıyor', 'ilk-yardim-bebek-kpr'],
    ['defibrilatör nasıl kullanılır', 'ilk-yardim-oed'],
    ['oed', 'ilk-yardim-oed'],
    ['baygın ama nefes alıyor', 'derlenme-pozisyonu'],
    ['boğazına lokma kaçtı', 'hava-yolu-tikanmasi'],
    ['bebek boğuluyor', 'ilk-yardim-bebek-bogulma'],
    ['bebeğin boğazına kaçtı', 'ilk-yardim-bebek-bogulma'],
    ['denizde boğuluyor', 'ilk-yardim-suda-bogulma'],
    ['suya düştü', 'ilk-yardim-suda-bogulma'],
    ['elektrik çarptı', 'ilk-yardim-elektrik-carpmasi'],
    ['cereyan carpti', 'ilk-yardim-elektrik-carpmasi'],
    ['şoka girdi', 'ilk-yardim-sok'],
    ['soğuk terleme beti benzi attı', 'ilk-yardim-sok'],
    ['alerjik şok', 'ilk-yardim-anafilaksi'],
    ['adrenalin kalemi', 'ilk-yardim-anafilaksi'],
    ['astım krizi', 'ilk-yardim-astim'],
    ['fısfıs', 'ilk-yardim-astim'],
    ['kalp krizi', 'ilk-yardim-kalp-krizi'],
    ['göğüs ağrısı', 'ilk-yardim-kalp-krizi'],
    ['inme belirtileri', 'ilk-yardim-inme'],
    ['ağzı kaydı', 'ilk-yardim-inme'],
    ['şekeri düştü', 'ilk-yardim-seker-dusmesi'],
    ['hipoglisemi', 'ilk-yardim-seker-dusmesi'],
    ['sara krizi', 'nobet'],
    ['bayıldı', 'ilk-yardim-bayilma'],
    ['gözüm kararıyor', 'ilk-yardim-bayilma'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
