import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('psikoloji araması', () => {
  it.each([
    ['psikolojik ilk yardım', 'psikoloji-ilk-yardim'],
    ['şoktaki birine nasıl destek olurum', 'psikoloji-ilk-yardim'],
    ['panik atak geçiriyorum', 'psikoloji-panik-atak'],
    ['arkadaşım panik oldu', 'psikoloji-panik-atak'],
    ['çocuğa depremi nasıl anlatırım', 'psikoloji-cocukla-konusma'],
    ['çocuğum soruyor ne diyeyim', 'psikoloji-cocukla-konusma'],
    ['çocuğum altını ıslatıyor', 'psikoloji-cocuk-stres-belirtileri'],
    ['ergen içine kapandı', 'psikoloji-cocuk-stres-belirtileri'],
    ['annemi kaybettim', 'psikoloji-yas'],
    ['yas tutan birine ne denir', 'psikoloji-yas'],
    ['uyuyamıyorum', 'psikoloji-uyku-stres'],
    ['kabus görüyorum', 'psikoloji-uyku-stres'],
    ['gönüllüyüm tükendim', 'psikoloji-gonullu-tukenmislik'],
    ['travma sonrası normal mi', 'psikoloji-travma-tepkileri'],
    ['aklımdan çıkmıyor sürekli irkiliyorum', 'psikoloji-travma-tepkileri'],
    ['arkadaşım intihar etmek istiyor', 'psikoloji-intihar-dusuncesi'],
    ['yaşamak istemiyorum', 'psikoloji-intihar-dusuncesi'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
