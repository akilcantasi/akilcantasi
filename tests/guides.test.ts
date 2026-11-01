import { describe, expect, it } from 'vitest';
import { GUIDES } from '../src/content/guides';
import { searchGuides, guideToText, getGuide, normalizeTr } from '../src/lib/guides-search';

const nonEmpty = (s: unknown) => typeof s === 'string' && s.trim().length > 0;

describe('rehber içeriği', () => {
  it('en az 18 rehber var ve id\'ler benzersiz', () => {
    expect(GUIDES.length).toBeGreaterThanOrEqual(18);
    const ids = GUIDES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(GUIDES.map((g) => [g.id, g] as const))('%s zorunlu alanları taşır', (_id, g) => {
    expect(g.id).toMatch(/^[a-z0-9-]+$/);
    for (const f of [g.title, g.tag, g.summary]) expect(nonEmpty(f)).toBe(true);
    expect(g.tag).toBe(g.tag.toLocaleUpperCase('tr'));
    expect(g.steps.length).toBeGreaterThanOrEqual(4);
    expect(g.steps.length).toBeLessThanOrEqual(10);
    for (const s of g.steps) expect(nonEmpty(s)).toBe(true);
    for (const d of g.dont ?? []) expect(nonEmpty(d)).toBe(true);
    expect(g.keywords.length).toBeGreaterThan(0);
    for (const k of g.keywords) expect(nonEmpty(k)).toBe(true);
    expect(g.sources.length).toBeGreaterThan(0);
    for (const s of g.sources) expect(nonEmpty(s)).toBe(true);
    expect(g.reviewed).toBe(false);
  });
});

describe('normalizeTr', () => {
  it('Türkçe harfleri ve büyük/küçük harfi eşitler', () => {
    expect(normalizeTr('ISINMA')).toBe('isinma');
    expect(normalizeTr('İçilebilir Şu!')).toBe('icilebilir su');
    expect(normalizeTr('Boğuluyor?')).toBe('boguluyor');
  });
});

describe('searchGuides', () => {
  const first = (q: string) => searchGuides(q)[0]?.guide.id;

  it.each([
    ['enkaz', 'enkaz-altinda'],
    ['kanıyor', 'kanama'],
    ['kanama', 'kanama'],
    ['kalp masajı', 'temel-yasam-destegi'],
    ['su içilebilir', 'su-aritma'],
    ['ISINMA', 'hipotermi'],
    ['üşüme', 'hipotermi'],
    ['boğuluyor', 'hava-yolu-tikanmasi'],
    ['yangin', 'yangin'],
    ['karbonmonoksit', 'karbonmonoksit'],
    ['deprem çantası', 'afet-cantasi'],
    ['sel', 'sel'],
    ['koma pozisyonu', 'derlenme-pozisyonu'],
    ['crush', 'ezilme-yaralanmasi'],
  ])('"%s" → %s', (q, id) => {
    expect(first(q)).toBe(id);
  });

  it('boş sorgu boş sonuç döner, limit uygulanır', () => {
    expect(searchGuides('')).toEqual([]);
    expect(searchGuides('   ?! ')).toEqual([]);
    expect(searchGuides('deprem', 2).length).toBeLessThanOrEqual(2);
  });

  it('alakasız sorgu sonuç vermez', () => {
    expect(searchGuides('xyzqwe')).toEqual([]);
  });
});

describe('getGuide / guideToText', () => {
  it('id ile rehber bulur', () => {
    expect(getGuide('kanama')?.title).toBe('Ciddi kanama');
    expect(getGuide('yok-boyle')).toBeUndefined();
    expect(getGuide(null)).toBeUndefined();
  });

  it('düz metin adımları, yapmayın listesini ve 112 notunu içerir', () => {
    const t = guideToText(getGuide('temel-yasam-destegi')!);
    expect(t).toContain('1. ');
    expect(t).toContain('Yapmayın:');
    expect(t).toContain("112'yi arayın");
    expect(t).toContain('incelenmedi');
  });
});

import { CATEGORIES } from '../src/content/categories';
import { GUIDE_ART } from '../src/content/guide-art';
import { SPEC as ART_SPEC } from '../src/art/spec-index';
import { GUIDES as ALL_GUIDES } from '../src/content/guides';

describe('kategoriler ve çizimler', () => {
  it('her rehber en az bir kategoride', () => {
    for (const g of ALL_GUIDES) expect(CATEGORIES.some((c) => c.guides.includes(g.id)), g.id).toBe(true);
  });
  it('kategorilerdeki kimlikler gerçek rehber', () => {
    const ids = new Set(ALL_GUIDES.map((g) => g.id));
    for (const c of CATEGORIES) for (const id of c.guides) expect(ids.has(id), `${c.id}/${id}`).toBe(true);
  });
  it('adım-çizim eşlemesi rehber adım sayısıyla aynı uzunlukta ve tanımlı çizimlere işaret ediyor', () => {
    for (const g of ALL_GUIDES) {
      expect(GUIDE_ART[g.id]?.length, g.id).toBe(g.steps.length);
      for (const a of GUIDE_ART[g.id]) if (a) expect(ART_SPEC[a], `${g.id}: ${a}`).toBeTruthy();
    }
    for (const c of CATEGORIES) expect(ART_SPEC[c.art], c.art).toBeTruthy();
  });
});
