// Rehber paketleri (.rehber.json): biçim doğrulama, uzantı/tür eşlemesi, arama dizini, SVG temizleme.
import { describe, expect, it } from 'vitest';
import { REHBER_FORMAT, isRehberFile, sanitizeSvg, svgDataUri, validateRehberPack } from '../src/content/rehber-pack';
import { kindOf } from '../src/lib/packs';
import { fileMatchesKind, validateManifest } from '../src/lib/manifest';
import { getPackCategories, getPackGuide, packArtUri, parseRehberPack, setLoadedPacks } from '../src/content/pack-guides';
import { getAllGuides, getGuide, guideToText, searchGuides } from '../src/lib/guides-search';
import { GUIDES } from '../src/content/guides';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><rect width="320" height="240" fill="#abc"/></svg>';

function samplePack(over: Record<string, unknown> = {}) {
  return {
    format: REHBER_FORMAT,
    version: 1,
    pack: { id: 'sifirdan-test', name: 'Test paketi', desc: 'deneme', version: 1 },
    categories: [{ id: 'sf-test', title: 'Test', hint: 'ipucu', art: 'sf-t-kapak', color: '#000', order: 900 }],
    guides: [
      {
        id: 'sf-t-cakmaktasi',
        category: 'sf-test',
        title: 'Çakmaktaşıyla kıvılcım',
        tag: 'ATEŞ',
        summary: 'Çakmaktaşını çeliğe sürterek kav tutuşturun.',
        note: 'Yalnız hayatta kalma durumunda.',
        steps: ['Kavı hazırlayın.', 'Taşı çeliğe sürtün.', 'Kıvılcımı kava düşürün.', 'Üfleyerek alevlendirin.'],
        art: ['sf-t-kav', null, 'sf-t-yok', null],
        keywords: ['çakmaktaşı', 'kav', 'kıvılcım', 'ateş yakma'],
        sources: ['Deneme'],
        reviewed: false,
      },
    ],
    art: { 'sf-t-kav': SVG },
    ...over,
  };
}

describe('rehber paketi biçimi', () => {
  it('geçerli paketi kabul eder', () => {
    const r = validateRehberPack(samplePack());
    expect(r.ok).toBe(true);
    expect(r.pack!.guides).toHaveLength(1);
    expect(r.pack!.art['sf-t-kav']).toContain('<rect');
  });

  it('yanlış biçimi ve bozuk paket bilgisini reddeder', () => {
    expect(validateRehberPack(null).pack).toBeNull();
    expect(validateRehberPack({ ...samplePack(), format: 'baska' }).ok).toBe(false);
    expect(validateRehberPack(samplePack({ pack: { id: 'X Y', name: '', version: 1 } })).pack).toBeNull();
    expect(validateRehberPack(samplePack({ version: 99 })).pack).toBeNull();
  });

  it('bozuk rehberi ve SVG olmayan çizimi atar, gerisini kullanır', () => {
    const p = samplePack();
    (p.guides as any[]).push({ id: 'sf-t-bozuk', category: 'yok', title: 'x', steps: [] });
    (p.art as any)['sf-t-html'] = '<div>merhaba</div>';
    const r = validateRehberPack(p);
    expect(r.ok).toBe(false);
    expect(r.pack!.guides.map((g) => g.id)).toEqual(['sf-t-cakmaktasi']);
    expect(r.pack!.art['sf-t-html']).toBeUndefined();
    expect(r.errors.some((e) => e.includes('sf-t-bozuk'))).toBe(true);
  });

  it('JSON olmayan ya da rehbersiz dosyada hata fırlatır', () => {
    expect(() => parseRehberPack('{bozuk')).toThrow();
    expect(() => parseRehberPack(JSON.stringify(samplePack({ guides: [] })))).toThrow();
  });
});

describe('uzantı ve tür eşlemesi', () => {
  it('.rehber.json rehber, sıradan .json harita noktasıdır', () => {
    expect(kindOf('sifirdan-yiyecek.rehber.json')).toBe('rehber');
    expect(kindOf('SIFIRDAN.REHBER.JSON')).toBe('rehber');
    expect(kindOf('noktalar.json')).toBe('poi');
    expect(kindOf('noktalar.geojson')).toBe('poi');
    expect(isRehberFile('a.rehber.json')).toBe(true);
    expect(isRehberFile('a.json')).toBe(false);
  });

  it('katalog doğrulaması rehber türünü ve uzantısını denetler', () => {
    expect(fileMatchesKind('a.rehber.json', 'rehber')).toBe(true);
    expect(fileMatchesKind('a.rehber.json', 'poi')).toBe(false);
    expect(fileMatchesKind('a.json', 'rehber')).toBe(false);
    const base = { name: 'n', desc: '', size: 10, tier: 'temel', urls: ['https://x/a'], license: 'l', source: 's' };
    const r = validateManifest({
      version: 1,
      updated: '2026-11-02',
      packs: [
        { ...base, id: 'r1', kind: 'rehber', file: 'r1.rehber.json' },
        { ...base, id: 'r2', kind: 'rehber', file: 'r2.json' },
        { ...base, id: 'p1', kind: 'poi', file: 'p1.rehber.json' },
        { ...base, id: 'p2', kind: 'poi', file: 'p2.json' },
      ],
    });
    expect(r.manifest.packs.map((p) => p.id)).toEqual(['r1', 'p2']);
  });
});

describe('SVG temizleme', () => {
  it('betik, foreignObject, olay öznitelikleri ve dış bağlantıları atar', () => {
    const dirty =
      '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script>' +
      '<foreignObject><div>x</div></foreignObject><rect ONCLICK=\'x()\' width="5"/>' +
      '<a href="javascript:alert(3)"><circle r="2"/></a><a xlink:href="https://kotu.example"/>' +
      '<g clip-path="url(#ic)"/><rect fill="url(https://kotu.example/x.svg)"/><style>*{}</style><use href="#a"/></svg>';
    const s = sanitizeSvg(dirty)!;
    expect(s).not.toMatch(/script|foreignObject|onload|onclick|javascript|kotu\.example|<style|<use/i);
    expect(s).toContain('url(#ic)');
    expect(s).toContain('<circle r="2"/>');
  });

  it('SVG olmayan metni reddeder', () => {
    expect(sanitizeSvg('<div/>')).toBeNull();
    expect(sanitizeSvg('<svg><rect/>')).toBeNull();
    expect(sanitizeSvg(SVG)).toBe(SVG);
  });

  it('veri adresi üretir', () => {
    expect(svgDataUri(SVG)).toMatch(/^data:image\/svg\+xml;charset=utf-8,%3Csvg/);
  });
});

describe('paket rehberleri ve arama', () => {
  it('yüklenen paket rehberleri arama dizinine, getGuide ve kategorilere eklenir', () => {
    setLoadedPacks([]);
    expect(searchGuides('çakmaktaşı kav', 5).some((r) => r.guide.id === 'sf-t-cakmaktasi')).toBe(false);
    expect(getGuide('sf-t-cakmaktasi')).toBeUndefined();

    const { pack } = parseRehberPack(JSON.stringify(samplePack()));
    setLoadedPacks([{ file: 'sifirdan-test.rehber.json', pack }]);

    expect(searchGuides('çakmaktaşı kav', 5)[0]?.guide.id).toBe('sf-t-cakmaktasi');
    expect(getGuide('sf-t-cakmaktasi')?.title).toBe('Çakmaktaşıyla kıvılcım');
    expect(getAllGuides()).toHaveLength(GUIDES.length + 1);
    expect(guideToText(getGuide('sf-t-cakmaktasi')!)).toContain('Uyarı: Yalnız hayatta kalma durumunda.');
    const cats = getPackCategories();
    expect(cats.map((c) => c.id)).toEqual(['sf-test']);
    expect(cats[0].guides).toEqual(['sf-t-cakmaktasi']);
    // Kapak pakette yok: ilk çizimli adım kullanılır
    expect(cats[0].art).toBe('sf-t-kav');
    expect(packArtUri('sf-t-kav')).toMatch(/^data:image\/svg\+xml/);
    expect(packArtUri('sf-t-yok')).toBeNull();

    setLoadedPacks([]);
    expect(getGuide('sf-t-cakmaktasi')).toBeUndefined();
    expect(searchGuides('çakmaktaşı kav', 5).some((r) => r.guide.id === 'sf-t-cakmaktasi')).toBe(false);
  });

  it('yerleşik rehberlerle çakışan kimlik yok sayılır', () => {
    const builtin = GUIDES[0];
    const p = samplePack();
    (p.guides as any[]).push({ ...(p.guides as any[])[0], id: builtin.id, title: 'Sahte' });
    setLoadedPacks([{ file: 'x.rehber.json', pack: parseRehberPack(JSON.stringify(p)).pack }]);
    expect(getGuide(builtin.id)?.title).toBe(builtin.title);
    expect(getPackGuide(builtin.id)).toBeUndefined();
    setLoadedPacks([]);
  });
});
