// Kendine Yetmek kategori grupları: her kategori tek başlıkta, yayımlanmış paketin
// bütün kategorileri eşlenmiş, bilinmeyen kategori "Diğer"e düşer.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { KY_GROUPS, groupKyCategories, kyGroupOf } from '../src/content/ky-groups';

describe('Kendine Yetmek grupları', () => {
  it('yaklaşık 12 başlık, kimlikler benzersiz, kategori iki başlıkta değil', () => {
    expect(KY_GROUPS.length).toBeGreaterThanOrEqual(10);
    expect(KY_GROUPS.length).toBeLessThanOrEqual(14);
    expect(new Set(KY_GROUPS.map((g) => g.id)).size).toBe(KY_GROUPS.length);
    const all = KY_GROUPS.flatMap((g) => g.cats);
    expect(new Set(all).size).toBe(all.length);
    expect(all.length).toBe(57);
    for (const g of KY_GROUPS) {
      expect(g.title.trim().length).toBeGreaterThan(2);
      expect(g.hint.trim().length).toBeGreaterThan(5);
    }
  });

  it('bilinmeyen kategori "Diğer" başlığına düşer, boş başlık gösterilmez, sıra korunur', () => {
    const r = groupKyCategories([{ id: 'sf-ap-firin' }, { id: 'yeni-kategori' }, { id: 'sf-ap-ates' }, { id: 'sf-yb-yabani' }]);
    expect(r.map((x) => x.group.id)).toEqual(['bitki', 'ates', 'diger']);
    expect(r[1].cats.map((c) => c.id)).toEqual(['sf-ap-ates', 'sf-ap-firin']);
    expect(r[2].cats.map((c) => c.id)).toEqual(['yeni-kategori']);
    expect(kyGroupOf('yeni-kategori')).toBe('diger');
    expect(groupKyCategories([])).toEqual([]);
  });

  const packFile = path.join(__dirname, '..', 'data', 'rehber', 'kendine-yetmek.rehber.json');
  it.skipIf(!fs.existsSync(packFile))('yayımlanmış paketin bütün kategorileri bir başlıkta', () => {
    const pack = JSON.parse(fs.readFileSync(packFile, 'utf8')) as { categories: { id: string }[] };
    const missing = pack.categories.filter((c) => kyGroupOf(c.id) === 'diger').map((c) => c.id);
    expect(missing).toEqual([]);
    const known = new Set(pack.categories.map((c) => c.id));
    const stale = KY_GROUPS.flatMap((g) => g.cats).filter((id) => !known.has(id));
    expect(stale).toEqual([]);
    const groups = groupKyCategories(pack.categories);
    expect(groups.reduce((a, g) => a + g.cats.length, 0)).toBe(pack.categories.length);
  });
});
