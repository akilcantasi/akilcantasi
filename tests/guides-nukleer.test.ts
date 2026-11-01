import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('nukleer araması', () => {
  it.each([
    ['nükleer santralde kaza oldu', 'nukleer-radyasyon'],
    ['radyasyon yayıldı ne yapmalıyım', 'nukleer-radyasyon'],
    ['fabrikadan zehirli gaz sızıyor', 'kimyasal-sizinti'],
    ['kimyasal sizinti', 'kimyasal-sizinti'],
    ['salgın hastalık yayılıyor', 'nukleer-salgin'],
    ['zarfta beyaz toz var', 'nukleer-salgin'],
    ['evde sığınak odası nasıl hazırlanır', 'nukleer-korunma-odasi'],
    ['pencereyi naylonla kapatma', 'nukleer-korunma-odasi'],
    ['patlama oldu ne yapmalıyım', 'nukleer-patlama-sonrasi'],
    ['bombalı saldırı sonrası', 'nukleer-patlama-sonrasi'],
    ['n95 maske nasıl takılır', 'nukleer-maske-kullanimi'],
    ['maske hava kaçırıyor', 'nukleer-maske-kullanimi'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
