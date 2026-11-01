import { describe, expect, it } from 'vitest';
import { searchGuides } from '../src/lib/guides-search';

describe('hayatta-kalma araması', () => {
  it.each([
    ['ormanda su nasıl bulunur', 'hayatta-kalma-su-bulma'],
    ['susuz kaldım ormanda', 'hayatta-kalma-su-bulma'],
    ['dere suyu içilir mi', 'hayatta-kalma-su-aritma'],
    ['güneşle su arıtma', 'hayatta-kalma-su-aritma'],
    ['güneşle yön bulma', 'hayatta-kalma-yon-gunes'],
    ['yosun kuzeyi gösterir mi', 'hayatta-kalma-yon-gunes'],
    ['kutup yıldızı nasıl bulunur', 'hayatta-kalma-yon-yildiz'],
    ['gece yıldızlarla yön bulma', 'hayatta-kalma-yon-yildiz'],
    ['kol saatiyle yön bulma', 'hayatta-kalma-yon-saat'],
    ['pusula nasıl kullanılır', 'hayatta-kalma-pusula-harita'],
    ['harita ve pusula ile yön', 'hayatta-kalma-pusula-harita'],
    ['kamp ateşi nasıl yakılır', 'hayatta-kalma-ates'],
    ['kamp ateşi söndürme', 'hayatta-kalma-ates'],
    ['ormanda barınak yapma', 'hayatta-kalma-barinak'],
    ['helikoptere işaret vermek', 'hayatta-kalma-isaret'],
    ['yere sos yazmak', 'hayatta-kalma-isaret'],
    ['ormanda ne yenir', 'hayatta-kalma-yabani-yiyecek'],
    ['yabani bitki yenir mi', 'hayatta-kalma-yabani-yiyecek'],
    ['dışarıda soğukta gece geçirmek', 'hayatta-kalma-soguk-gece'],
    ['gölgesiz sıcakta hayatta kalma', 'hayatta-kalma-sicak'],
    ['dereden karşıya nasıl geçerim', 'hayatta-kalma-dere-gecme'],
    ['ayı gördüm', 'hayatta-kalma-vahsi-hayvan'],
    ['sokak köpekleri saldırdı', 'hayatta-kalma-vahsi-hayvan'],
    ['düğüm nasıl atılır', 'hayatta-kalma-dugumler'],
    ['iki ipi birleştirmek', 'hayatta-kalma-dugumler'],
  ])('"%s" → %s', (q, id) => {
    expect(searchGuides(q, 3)[0]?.guide.id).toBe(id);
  });
});
