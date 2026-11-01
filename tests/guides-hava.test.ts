import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('hava araması', () => {
  it.each([
    ['sıcak çarpması', 'sicak-carpmasi'],
    ['güneş çarpması bayıldı', 'sicak-carpmasi'],
    ['yıldırım', 'firtina-yildirim'],
    ['gök gürültüsü var dışarıdayım', 'firtina-yildirim'],
    ['kar fırtınası evde ne yapmalı', 'hava-kar-firtinasi'],
    ['karda mahsur kaldık', 'hava-kar-firtinasi'],
    ['çığ düştü', 'hava-cig'],
    ['çığ altında kaldı', 'hava-cig'],
    ['toz fırtınası', 'hava-toz-firtinasi'],
    ['kum fırtınası araba', 'hava-toz-firtinasi'],
    ['hortum geliyor', 'hava-hortum'],
    ['tornado', 'hava-hortum'],
    ['sıcak hava dalgası', 'hava-sicak-dalgasi'],
    ['aşırı sıcaklarda ne yapmalı', 'hava-sicak-dalgasi'],
    ['dolu yağıyor', 'hava-dolu'],
    ['dolu arabada', 'hava-dolu'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
