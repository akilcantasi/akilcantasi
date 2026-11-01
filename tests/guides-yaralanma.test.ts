import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('yaralanma araması', () => {
  it.each([
    ['burnum kanıyor', 'burun-kanamasi'],
    ['elime kaynar su döküldü', 'yanik'],
    ['ayak bileğim burkuldu', 'kirik-burkulma'],
    ['ezilme sendromu', 'ezilme-yaralanmasi'],
    ['kafasını çarptı', 'yaralanma-bas-travmasi'],
    ['beyin sarsıntısı belirtileri', 'yaralanma-bas-travmasi'],
    ['boyun kırığı şüphesi', 'yaralanma-omurga'],
    ['sığ suya atladı bacaklarını hissetmiyor', 'yaralanma-omurga'],
    ['gözüme kimyasal kaçtı', 'yaralanma-goz'],
    ['gözüne cam battı', 'yaralanma-goz'],
    ['dişi yerinden çıktı', 'yaralanma-dis'],
    ['çocuğun ön dişi kırıldı', 'yaralanma-dis'],
    ['göğsünden bıçaklandı', 'yaralanma-gogus'],
    ['kaburga kırığı', 'yaralanma-gogus'],
    ['karnından yaralandı bağırsak dışarı çıktı', 'yaralanma-karin'],
    ['parmağı koptu', 'yaralanma-uzuv-kopmasi'],
    ['kopan parmak nasıl saklanır', 'yaralanma-uzuv-kopmasi'],
    ['bacağına demir saplandı', 'yaralanma-saplanan-cisim'],
    ['saplanmış bıçak çıkarılır mı', 'yaralanma-saplanan-cisim'],
    ['yara iltihaplandı', 'yaralanma-yara-temizleme'],
    ['yara nasıl temizlenir', 'yaralanma-yara-temizleme'],
    ['parmaklarım dondu', 'yaralanma-soguk-isirigi'],
    ['soğuk ısırığı', 'yaralanma-soguk-isirigi'],
    ['güneşte yandım', 'yaralanma-gunes-yanigi'],
    ['güneş yanığı', 'yaralanma-gunes-yanigi'],
    ['ishal oldum', 'yaralanma-ishal'],
    ['evde ors nasıl yapılır', 'yaralanma-ishal'],
    ['çocuğun ateşi var', 'yaralanma-yuksek-ates'],
    ['yüksek ateş', 'yaralanma-yuksek-ates'],
    ['köpek ısırdı', 'yaralanma-kuduz-isirik'],
    ['kedi tırmaladı kuduz', 'yaralanma-kuduz-isirik'],
    ['kene nasıl çıkarılır', 'yaralanma-kene'],
    ['kene ısırdı', 'yaralanma-kene'],
    ['ayağım su topladı', 'yaralanma-su-toplama'],
    ['bacağıma kramp girdi', 'yaralanma-kramp-zorlanma'],
    ['kas çekmesi', 'yaralanma-kramp-zorlanma'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
