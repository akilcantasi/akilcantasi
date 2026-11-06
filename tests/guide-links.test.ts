// Rehberler arası bağlantılar: [[kimlik|metin]] işaretlemesi, hedeflerin varlığı,
// arama/Fener/düz metin çıktılarında işaretlemenin atılması ve tırnaklı başlıkların
// (yeniden derlenmemiş paketler için) kendiliğinden bağlantıya çevrilmesi.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { GUIDES } from '../src/content/guides';
import {
  buildTitleIndex,
  guideLinkTargets,
  guideTextFields,
  linkQuotedTitles,
  parseGuideLinks,
  stripGuideLinks,
} from '../src/content/guide-links';
import { guideToText, searchGuides } from '../src/lib/guides-search';
import { stepToText } from '../src/lib/fener/rag';

const ids = new Set(GUIDES.map((g) => g.id));

describe('bağlantı işaretlemesi', () => {
  it('ayrıştırır ve atar', () => {
    const s = 'Çekmeyin; [[ezilme-yaralanmasi|"Ezilme yaralanması" rehberine]] bakın.';
    expect(parseGuideLinks(s)).toEqual(['Çekmeyin; ', { id: 'ezilme-yaralanmasi', text: '"Ezilme yaralanması" rehberine' }, ' bakın.']);
    expect(stripGuideLinks(s)).toBe('Çekmeyin; "Ezilme yaralanması" rehberine bakın.');
    expect(guideLinkTargets(s)).toEqual(['ezilme-yaralanmasi']);
    expect(parseGuideLinks('düz metin')).toEqual(['düz metin']);
    expect(stripGuideLinks('[[a|x]] ve [[b-c|y]]')).toBe('x ve y');
    // bozuk işaretleme olduğu gibi kalır
    expect(stripGuideLinks('[[Büyük Harf|x]]')).toBe('[[Büyük Harf|x]]');
  });

  it('yerleşik rehberlerdeki her bağlantı var olan başka bir rehbere gider', () => {
    let n = 0;
    for (const g of GUIDES)
      for (const t of guideTextFields(g)) {
        for (const id of guideLinkTargets(t)) {
          n++;
          expect(ids.has(id), `${g.id} → ${id}`).toBe(true);
          expect(id, g.id).not.toBe(g.id);
        }
        // işaretleme dışında "[[" ya da "]]" kalmamalı (yazım hatası)
        expect(/\[\[|\]\]/.test(stripGuideLinks(t)), `${g.id}: ${t}`).toBe(false);
      }
    expect(n).toBeGreaterThanOrEqual(6);
  });

  it('bilinen 6 gönderme bağlantıya çevrildi', () => {
    const links = (id: string) => guideTextFields(GUIDES.find((g) => g.id === id)!).flatMap(guideLinkTargets);
    expect(links('enkaz-kurtarma')).toContain('ezilme-yaralanmasi');
    expect(links('hayatta-kalma-soguk-gece')).toContain('hipotermi');
    expect(links('ozel-gruplar-acil-dogum')).toContain('ilk-yardim-bebek-kpr');
    expect(links('yangin-duman-solunmasi')).toEqual(expect.arrayContaining(['temel-yasam-destegi', 'yanik']));
    expect(links('yaralanma-saplanan-cisim')).toContain('yaralanma-goz');
    // bağlantısız "… rehberine bakın / geçin" göndermesi kalmadı
    for (const g of GUIDES)
      for (const t of guideTextFields(g)) {
        const bare = parseGuideLinks(t).filter((p): p is string => typeof p === 'string').join(' ');
        expect(/rehberine (bakın|geçin)|" rehberi\)/.test(bare), `${g.id}: ${t}`).toBe(false);
      }
  });

  it('arama dizini, düz metin ve Fener işaretlemeyi görmez', () => {
    for (const g of GUIDES) expect(guideToText(g).includes('[['), g.id).toBe(false);
    expect(stepToText('Bakın: [[yanik|"Yanık" rehberi]].')).toBe('Bakın: "Yanık" rehberi.');
    // kimlikteki tireli sözcükler ("yasam-destegi") aramada gövde eşleşmesi üretmez:
    // görünen metin aranabilir, kimlik değil
    const r = searchGuides('duman solunması', 3).map((x) => x.guide.id);
    expect(r).toContain('yangin-duman-solunmasi');
  });
});

describe('tırnaklı başlıklar (işaretlemesiz eski metin)', () => {
  const ix = buildTitleIndex([
    { id: 'hipotermi', title: 'Hipotermi (aşırı üşüme)' },
    { id: 'cam', title: 'Çam: fıstık, iç kabuk unu' },
    { id: 'a1', title: 'Aynı' },
    { id: 'a2', title: 'Aynı' },
  ]);
  it('tek rehbere denk gelen başlığı bağlar, belirsizi ve kendini bağlamaz', () => {
    expect(linkQuotedTitles(["Bkz. 'Çam' rehberinde."], ix)).toEqual(['Bkz. ', { id: 'cam', text: "'Çam'" }, ' rehberinde.']);
    expect(linkQuotedTitles(['"Hipotermi" rehberi'], ix)).toEqual([{ id: 'hipotermi', text: '"Hipotermi"' }, ' rehberi']);
    expect(linkQuotedTitles(["'Aynı' rehberi"], ix)).toEqual(["'Aynı' rehberi"]);
    expect(linkQuotedTitles(["'Çam' rehberi"], ix, 'cam')).toEqual(["'Çam' rehberi"]);
    // ardından "rehber" gelmeyen tırnak bağlanmaz
    expect(linkQuotedTitles(["'Çam' ağacı"], ix)).toEqual(["'Çam' ağacı"]);
  });

  const packFile = path.join(__dirname, '..', 'data', 'rehber', 'kendine-yetmek.rehber.json');
  it.skipIf(!fs.existsSync(packFile))('yayımlanmış Kendine Yetmek paketinde göndermeler doğru rehbere bağlanır', () => {
    const pack = JSON.parse(fs.readFileSync(packFile, 'utf8')) as { guides: { id: string; title: string }[] };
    const all = [...GUIDES, ...pack.guides];
    const known = new Set(all.map((g) => g.id));
    const index = buildTitleIndex(all);
    let n = 0;
    for (const g of pack.guides as any[])
      for (const t of guideTextFields(g)) {
        for (const id of guideLinkTargets(t)) expect(known.has(id), `${g.id} → ${id}`).toBe(true);
        for (const p of linkQuotedTitles(parseGuideLinks(t), index, g.id))
          if (typeof p !== 'string') {
            n++;
            expect(known.has(p.id)).toBe(true);
          }
      }
    expect(n).toBeGreaterThanOrEqual(40);
  });
});
