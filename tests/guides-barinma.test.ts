import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('barinma araması', () => {
  it.each([
    ['çadır nereye kurulur', 'cadir-barinma'],
    ['en yakın toplanma alanı nerede', 'toplanma-alani'],
    ['e-devlet toplanma alanı sorgulama', 'toplanma-alani'],
    ['tuvalet yok nereye yapacağız', 'barinma-acil-tuvalet'],
    ['depremden sonra sifon çekebilir miyim', 'barinma-acil-tuvalet'],
    ['çadırda soba nasıl güvenli yakılır', 'barinma-guvenli-isitma'],
    ['konteynerde elektrikli ısıtıcı', 'barinma-guvenli-isitma'],
    ['kışın çadırda nasıl kalınır', 'barinma-kis-cadir'],
    ['çadıra kar yağdı', 'barinma-kis-cadir'],
    ['kampta bulaşıcı hastalık salgını', 'barinma-kamp-hijyen'],
    ['çadırkentte ishal salgını', 'barinma-kamp-hijyen'],
    ['kalorifer yok evde çok soğuk', 'barinma-sicak-kalma'],
    ['battaniye yok nasıl sıcak kalırım', 'barinma-sicak-kalma'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
