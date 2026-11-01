// Kütüphane: eşleştirme/sıralama fonksiyonları, saf-TS Xapian okuyucusu,
// çok kaynaklı arama ve asistan bağlamı.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { BytesSource } from '../src/lib/source';
import { ZimArchive, htmlToText, extractParagraphs } from '../src/lib/zim';
import {
  foldTr,
  foldCharwise,
  editDistance,
  typoBudget,
  matchRank,
  rankTitles,
  mergeRanked,
  termVariants,
  xapianFold,
  wordForms,
  searchArchive,
  searchFulltext,
  Rank,
} from '../src/lib/zim/search';
import { packUintSort, unpackUintSort, packStringSort, Unpacker } from '../src/lib/zim/xapian';
import {
  setLibrariesForTests,
  getLibraries,
  getLibrary,
  searchLibrary,
  searchLibraryText,
  searchLibraryForContext,
  randomLibraryArticle,
  resolveRef,
  makeRef,
  parseRef,
  detectKind,
  medicalTermsOf,
  isMedicalQuestion,
  languageName,
  htmlCount,
  disambiguateLabels,
} from '../src/lib/library';

const here = dirname(fileURLToPath(import.meta.url));
const load = (n: string) => ZimArchive.open(new BytesSource(new Uint8Array(readFileSync(join(here, '..', 'testdata', n))), n));

describe('katlama', () => {
  it('Türkçe harfler ve aksanlar katlanır', () => {
    expect(foldTr('İSTANBUL')).toBe('istanbul');
    expect(foldTr('Isı çarpması')).toBe('isi carpmasi');
    expect(foldTr('ŞİŞLİ_Çağlayan')).toBe('sisli caglayan');
    expect(foldTr('Gölcük (Kocaeli)')).toBe('golcuk kocaeli');
    expect(foldTr('Âşık Veysel')).toBe('asik veysel');
    expect(foldTr('Café-Crème')).toBe('cafe creme');
    expect(foldTr('  ')).toBe('');
  });

  it('karakter karakter katlama uzunluğu korur', () => {
    for (const s of ['İstanbul Ağzı', 'IŞIK ışık', 'Ünlü çöl', 'naïve İİ']) {
      const f = foldCharwise(s);
      expect(f.length).toBe(s.length);
    }
    expect(foldCharwise('İstanbul Işığı')).toBe('istanbul isigi');
  });
});

describe('htmlToText (gerçek mwoffliner sayfa yapısı)', () => {
  it('<html> sınıfı ve head betiği metni yutmaz; uyarı kutuları atlanır', () => {
    const html =
      '<!DOCTYPE html><html class="client-nojs vector-toc-not-available" lang="tr"><head><title>Deprem</title>' +
      '<script>RLCONF={"a":"<b", x: 1 < 2, y:"\'"}</script><style>p{}</style></head>' +
      '<body class="mediawiki"><main id="content"><h1>Deprem</h1><div class="preview-warning">Önizleme uyarısı: x</div>' +
      '<section><p>Deprem, yer kabuğunda ani sarsıntıdır ve uzun bir açıklama cümlesidir.</p></section>' +
      '<div class="toc">İçindekiler</div></main></body></html>';
    const t = htmlToText(html);
    expect(t).toContain('Deprem, yer kabuğunda ani sarsıntıdır');
    expect(t).not.toContain('Önizleme');
    expect(t).not.toContain('İçindekiler');
    expect(t).not.toContain('RLCONF');
    expect(extractParagraphs(html, 300)[0]).toMatch(/^Deprem, yer kabuğunda/);
  });
});

describe('yazım hatası mesafesi', () => {
  it('Damerau-Levenshtein', () => {
    expect(editDistance('deprem', 'deprem')).toBe(0);
    expect(editDistance('depem', 'deprem')).toBe(1); // eksik harf
    expect(editDistance('dperem', 'deprem')).toBe(1); // yer değiştirme
    expect(editDistance('deprwm', 'deprem')).toBe(1); // yanlış harf
    expect(editDistance('istanbl', 'istanbul')).toBe(1);
    expect(editDistance('hipotremi', 'hipotermi')).toBe(1);
    expect(editDistance('abc', 'xyz', 1)).toBe(2); // erken çıkış: max+1
    expect(editDistance('a', 'abcdef', 2)).toBe(3);
  });
  it('bütçe kelime uzunluğuna göre', () => {
    expect(typoBudget(3)).toBe(0);
    expect(typoBudget(5)).toBe(1);
    expect(typoBudget(9)).toBe(2);
  });
});

describe('matchRank / sıralama', () => {
  it('sınıflar: tam > önek > kelime > kelime öneki > içerir > benzer', () => {
    expect(matchRank('deprem', 'Deprem')).toBe(Rank.EXACT);
    expect(matchRank('ISI CARPMASI', 'Isı çarpması')).toBe(Rank.EXACT);
    expect(matchRank('dep', 'Deprem')).toBe(Rank.PREFIX);
    expect(matchRank('deprem', 'Deprem (film)')).toBe(Rank.PREFIX);
    expect(matchRank('fay', 'Kuzey Anadolu Fay Hattı')).toBe(Rank.WORDS);
    expect(matchRank('hattı anadolu', 'Kuzey Anadolu Fay Hattı')).toBe(Rank.WORDS);
    expect(matchRank('anad fay', 'Kuzey Anadolu Fay Hattı')).toBe(Rank.WORD_PREFIX);
    expect(matchRank('dolu', 'Kuzey Anadolu Fay Hattı')).toBe(Rank.SUBSTRING);
    expect(matchRank('hipotremi', 'Hipotermi')).toBe(Rank.FUZZY);
    expect(matchRank('istanbl', 'İstanbul')).toBe(Rank.FUZZY);
    expect(matchRank('istanbl', 'İstanbul Boğazı')).toBe(Rank.FUZZY);
    expect(matchRank('xyz', 'Deprem')).toBeNull();
    expect(matchRank('ab', 'Deprem')).toBeNull(); // kısa kelimede hata toleransı yok
  });

  it('rankTitles sıralar ve harf farkı olan kopyaları birleştirir', () => {
    const hits = [
      { path: 'Kuzey_Anadolu_Fay_Hattı', title: 'Kuzey Anadolu Fay Hattı' },
      { path: 'Fay_bloğu', title: 'Fay bloğu' },
      { path: 'Fay', title: 'Fay' },
      { path: 'Fayda', title: 'Fayda' },
      { path: 'Kalp_Krizi', title: 'Kalp Krizi', redirect: true },
      { path: 'Kalp_krizi', title: 'Kalp krizi', redirect: false },
    ];
    const r = rankTitles('fay', hits);
    expect(r.map((h) => h.title)).toEqual(['Fay', 'Fayda', 'Fay bloğu', 'Kuzey Anadolu Fay Hattı']);
    expect(r.map((h) => h.rank)).toEqual([Rank.EXACT, Rank.PREFIX, Rank.PREFIX, Rank.WORDS]);
    const k = rankTitles('kalp krizi', hits);
    expect(k.map((h) => h.path)).toEqual(['Kalp_krizi']); // yönlendirme olmayan kalır
    // Noktalama ile başlayan başlık, eşdeğer tam eşleşmenin ardından gelir
    const i = rankTitles('istanbul', [
      { path: '.istanbul', title: '.istanbul' },
      { path: 'İstanbul', title: 'İstanbul' },
    ]);
    expect(i[0].path).toBe('İstanbul');
  });

  it('mergeRanked aynı yolu bir kez tutar', () => {
    const a = rankTitles('deprem', [{ path: 'Deprem', title: 'Deprem' }]);
    const b = rankTitles('deprem', [{ path: 'Deprem', title: 'Deprem' }, { path: 'Ana_deprem', title: 'Ana deprem' }]);
    const m = mergeRanked(a, b);
    expect(m.map((h) => h.path)).toEqual(['Deprem', 'Ana_deprem']);
  });

  it('ek atımı uzun ekten başlar', () => {
    expect(wordForms('depremde').slice(0, 2)).toEqual(['depremde', 'deprem']);
    expect(wordForms('kitabı')).toContain('kitap');
    expect(wordForms('yanığı')).toContain('yanik');
  });

  it('Xapian terim varyantları (ı korunur)', () => {
    expect(xapianFold('Isı')).toBe('isı');
    expect(xapianFold('İSTANBUL')).toBe('istanbul');
    expect(xapianFold('Çadır')).toBe('cadır');
    expect(termVariants('isi')).toEqual(['isi', 'ısi', 'isı', 'ısı']);
    expect(termVariants('deprem')).toEqual(['deprem']);
    expect(termVariants('iiiiii', 4).length).toBe(4);
  });
});

describe('Xapian pack kodlamaları', () => {
  it('sıralı sayı gidiş-dönüş ve sıra korunumu', () => {
    const vals = [0, 1, 255, 0x7fff, 0x8000, 70000, 2 ** 22, 2 ** 22 + 1, 123456789, 2 ** 32 - 1];
    let prev: Uint8Array | null = null;
    for (const v of vals) {
      const b = packUintSort(v);
      expect(unpackUintSort(new Unpacker(b))).toBe(v);
      if (prev) {
        // bayt sırası sayı sırasıyla aynı olmalı
        const n = Math.min(prev.length, b.length);
        let c = 0;
        for (let i = 0; i < n && !c; i++) c = prev[i] - b[i];
        if (!c) c = prev.length - b.length;
        expect(c).toBeLessThan(0);
      }
      prev = b;
    }
  });
  it('sıralı dize', () => {
    expect([...packStringSort('ab', true)]).toEqual([97, 98]);
    expect([...packStringSort('a\0b', false)]).toEqual([97, 0, 0xff, 98, 0]);
  });
});

describe('Xapian glass okuyucu (sample_med_en.zim)', () => {
  let zim: ZimArchive;
  beforeAll(async () => {
    zim = await load('sample_med_en.zim');
  });

  it('dizinleri açar ve üstveriyi okur', async () => {
    const t = await zim.xapian('title');
    const f = await zim.xapian('fulltext');
    expect(t && f).toBeTruthy();
    expect(await t!.metadata('kind')).toBe('title');
    expect(await f!.metadata('kind')).toBe('fulltext');
    expect(await f!.metadata('language')).toBe('eng');
    expect(f!.docCount).toBe(12);
    expect(t!.docCount).toBe(14); // 12 makale + 2 yönlendirme
  });

  it('terimler, kayıt listeleri, belge verisi ve değerler', async () => {
    const t = (await zim.xapian('title'))!;
    expect(await t.termFreq('fracture')).toBe(1);
    expect(await t.termFreq('yokboyle')).toBe(0);
    const pl = await t.postings('fracture');
    expect(pl.list.length).toBe(1);
    const did = pl.list[0].did;
    expect(await t.docData(did)).toBe('C/Bone_fracture');
    expect(await t.value(0, did)).toBe('Bone fracture');
    const pre = await t.termsWithPrefix('he');
    expect(pre.map((x) => x.term)).toContain('heat');
    const f = (await zim.xapian('fulltext'))!;
    const dl = await f.doclens((await f.postings('dehydr')).list.map((p) => p.did));
    expect(dl.size).toBeGreaterThan(0);
    for (const v of dl.values()) expect(v).toBeGreaterThan(3);
  });

  it('başlık araması: kelime, kelime öneki, yazım hatası, yönlendirme', async () => {
    expect((await searchArchive(zim, 'fracture'))[0]).toMatchObject({ title: 'Bone fracture', rank: Rank.WORDS });
    expect((await searchArchive(zim, 'resusc'))[0]).toMatchObject({ title: 'Cardiopulmonary resuscitation', rank: Rank.WORD_PREFIX });
    expect((await searchArchive(zim, 'hypotermia'))[0]).toMatchObject({ title: 'Hypothermia', rank: Rank.FUZZY });
    expect((await searchArchive(zim, 'circulatory'))[0].path).toBe('Shock_(circulatory)');
    const h = await searchArchive(zim, 'haemorrhage');
    expect(h[0].path).toBe('Haemorrhage');
    expect((await zim.getArticle(h[0].path))?.title).toBe('Bleeding');
    expect(await searchArchive(zim, 'qqqzzz')).toEqual([]);
  });

  it('tam metin araması (libzim ile aynı ilk sonuç)', async () => {
    // libzim Searcher('dehydration') → Dehydration, Shock_(circulatory), Diarrhea, Heat_stroke
    const r = await searchFulltext(zim, 'dehydration');
    expect(r[0].path).toBe('Dehydration');
    expect(new Set(r.map((x) => x.path))).toEqual(new Set(['Dehydration', 'Shock_(circulatory)', 'Diarrhea', 'Heat_stroke']));
    const w = await searchFulltext(zim, 'contaminated water');
    expect(w[0].path).toBe('Diarrhea');
    expect(w[0].matched).toBe(2);
    expect(await searchFulltext(zim, 'zzzqqq')).toEqual([]);
  });

  it('rastgele makale bir HTML makalesidir', async () => {
    let n = 0;
    const r = await zim.randomArticle(() => (n++ * 0.37) % 1);
    expect(r).toBeTruthy();
    expect((await zim.getArticle(r!.path))?.mime).toBe('text/html');
  });
});

describe('Türkçe başlık dizini (sample_tr.zim) ve dizinsiz arşiv (sample_xz_oldns.zim)', () => {
  let zim: ZimArchive;
  let old: ZimArchive;
  beforeAll(async () => {
    zim = await load('sample_tr.zim');
    old = await load('sample_xz_oldns.zim');
  });
  it('dizinsiz eski arşivde tam tarama ile aynı sıralama', async () => {
    expect(await old.xapian('title')).toBeNull();
    expect((await searchArchive(old, 'fay'))[0].title).toBe('Kuzey Anadolu Fay Hattı');
    expect((await searchArchive(old, 'cadir'))[0]).toMatchObject({ title: 'Çadır', rank: Rank.EXACT });
    expect((await searchArchive(old, 'hipotremi'))[0]).toMatchObject({ title: 'Hipotermi', rank: Rank.FUZZY });
    expect((await searchArchive(old, 'carpmasi'))[0].title).toBe('Isı çarpması');
  });
  it('başlığın herhangi bir kelimesi, Türkçe duyarsız ve yazım hatalı', async () => {
    // libzim başlık dizinini her zaman ekler; tam metin dizini kapalıydı
    expect(await zim.xapian('title')).toBeTruthy();
    expect(await zim.xapian('fulltext')).toBeNull();
    expect((await searchArchive(zim, 'fay'))[0].title).toBe('Kuzey Anadolu Fay Hattı');
    expect((await searchArchive(zim, 'cadir'))[0]).toMatchObject({ title: 'Çadır', rank: Rank.EXACT });
    expect((await searchArchive(zim, 'SICAK'))[0]?.title).not.toBe('Isı çarpması');
    expect((await searchArchive(zim, 'carpmasi'))[0].title).toBe('Isı çarpması');
    expect((await searchArchive(zim, 'hipotremi'))[0]).toMatchObject({ title: 'Hipotermi', rank: Rank.FUZZY });
    expect((await searchArchive(zim, 'yasam'))[0].title).toBe('Temel yaşam desteği');
    // eski önek araması da Türkçe duyarsız
    expect((await zim.searchTitles('cadir'))[0]?.title).toBe('Çadır');
    expect((await zim.searchTitles('sel'))[0]?.title).toBe('Sel');
  });
});

describe('çok kaynaklı kütüphane', () => {
  beforeAll(async () => {
    setLibrariesForTests([
      { id: 'sample_med_en.zim', zim: await load('sample_med_en.zim') },
      { id: 'sample_tr.zim', zim: await load('sample_tr.zim') },
    ]);
  });
  afterAll(() => setLibrariesForTests(undefined));

  it('kaynaklar: tür, ad, dil, madde sayısı; Vikipedi önce', async () => {
    const s = await getLibraries();
    expect(s.map((x) => [x.id, x.kind, x.label])).toEqual([
      ['sample_tr.zim', 'wikipedia', 'Vikipedi'],
      ['sample_med_en.zim', 'wikimed', 'WikiMed'],
    ]);
    expect(s[0].languageName).toBe('Türkçe');
    expect(s[1].languageName).toBe('İngilizce');
    expect(s[1].articleCount).toBe(12); // M/Counter text/html
    expect(s[1].titleCount).toBe(14); // + 2 yönlendirme
    expect(s[1].hasFulltext && s[1].hasTitleIndex).toBe(true);
    expect(s[0].hasFulltext).toBe(false);
    expect(await getLibrary()).toBe(s[0].zim);
  });

  it('Tümü ve kaynak seçimi', async () => {
    const all = await searchLibrary('hipotermi');
    expect(all[0]).toMatchObject({ title: 'Hipotermi', sourceLabel: 'Vikipedi', ref: '@sample_tr.zim/Hipotermi' });
    const hy = await searchLibrary('hypothermia');
    expect(hy[0]).toMatchObject({ title: 'Hypothermia', sourceLabel: 'WikiMed' });
    const only = await searchLibrary('hipotermi', { sourceId: 'sample_med_en.zim' });
    expect(only.every((h) => h.sourceId === 'sample_med_en.zim')).toBe(true);
    const text = await searchLibraryText('dehydration');
    expect(text[0]).toMatchObject({ path: 'Dehydration', sourceLabel: 'WikiMed' });
    const r = await randomLibraryArticle('sample_tr.zim');
    expect(r?.sourceId).toBe('sample_tr.zim');
  });

  it('referanslar', async () => {
    expect(makeRef('a.zim', 'X/Y')).toBe('@a.zim/X/Y');
    expect(parseRef('@a.zim/X/Y')).toEqual({ sourceId: 'a.zim', path: 'X/Y' });
    expect(parseRef('Deprem')).toEqual({ sourceId: null, path: 'Deprem' });
    expect((await resolveRef('@sample_med_en.zim/Burn'))?.source.label).toBe('WikiMed');
    expect((await resolveRef('Burn'))?.source.label).toBe('WikiMed'); // öneksiz: kaynaklarda aranır
    expect((await resolveRef('Deprem'))?.source.label).toBe('Vikipedi');
    expect(await resolveRef('@yok.zim/Yok_Böyle')).toBeNull();
  });

  it('tıbbi soru tespiti ve terim çevirisi', () => {
    expect(medicalTermsOf('Kanama nasıl durdurulur?')).toEqual(['Bleeding']);
    expect(medicalTermsOf('Yanığa ne iyi gelir')).toEqual(['Burn']);
    expect(medicalTermsOf('Sıcak çarpması belirtileri')).toEqual(['Heat stroke']);
    expect(isMedicalQuestion('Deprem sırasında ne yapmalıyım?')).toBe(false);
  });

  it('asistan bağlamı: tıbbi soruda WikiMed öne, diğerinde Vikipedi', async () => {
    const k = await searchLibraryForContext('Kanama nasıl durdurulur?', 2);
    expect(k.map((x) => x.title)).toEqual(['Bleeding', 'Kanama']);
    expect(k[0].path).toBe('@sample_med_en.zim/Bleeding');
    expect(k[0].text).toContain('direct pressure');
    const d = await searchLibraryForContext('Depremde ne yapmalıyım?', 2);
    expect(d[0].title).toBe('Deprem');
    expect(d.every((x) => x.path.startsWith('@sample_tr.zim/'))).toBe(true);
    const h = await searchLibraryForContext('hipotermi belirtileri nelerdir', 1, 300);
    expect(h[0].title).toBe('Hypothermia');
    expect(h[0].text.length).toBeLessThanOrEqual(300);
  });

  it('aynı adlı kaynaklar ayırt edilir', () => {
    const l = disambiguateLabels([
      { id: 'wikipedia_tr_all_mini_2026-09.zim', label: 'Vikipedi' },
      { id: 'wikipedia_tr_all_maxi_2025-12.zim', label: 'Vikipedi' },
      { id: 'mdwiki_en_all_2026-01.zim', label: 'WikiMed' },
    ]).map((x) => x.label);
    expect(l).toEqual(['Vikipedi (mini 2026-09)', 'Vikipedi (maxi 2025-12)', 'WikiMed']);
    expect(disambiguateLabels([{ id: 'a.zim', label: 'X' }, { id: 'b.zim', label: 'X' }]).map((x) => x.label)).toEqual(['X (a)', 'X (b)']);
  });

  it('yardımcılar', () => {
    expect(detectKind('wikipedia_tr_all', 'Vikipedi', 'x.zim')).toBe('wikipedia');
    expect(detectKind('mdwiki_en_all', 'MDWiki', 'x.zim')).toBe('wikimed');
    expect(detectKind('wikipedia_en_medicine', 'Wikipedia Medicine', 'x.zim')).toBe('wikimed');
    expect(detectKind('wiktionary_tr_all', 'Vikisözlük', 'x.zim')).toBe('wiktionary');
    expect(detectKind('wikibooks_tr_all', '', 'x.zim')).toBe('wikibooks');
    expect(detectKind('wikivoyage_en_all', '', 'x.zim')).toBe('wikivoyage');
    expect(detectKind('gutenberg_tr_all', '', 'x.zim')).toBe('gutenberg');
    expect(detectKind('', 'Bir şey', 'ted_talks.zim')).toBe('other');
    expect(htmlCount('application/javascript=4;text/html=700883;image/png=5')).toBe(700883);
    expect(htmlCount('image/png=5')).toBeNull();
    expect(htmlCount(null)).toBeNull();
    expect(languageName('tur')).toBe('Türkçe');
    expect(languageName('eng,tur')).toBe('İngilizce, Türkçe');
  });
});
