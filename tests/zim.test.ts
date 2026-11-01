import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { BytesSource, type RandomAccessSource } from '../src/lib/source';
import { ZimArchive, htmlToText, extractParagraphs, normalizeForSearch } from '../src/lib/zim';
import { searchLibraryForContext, setLibraryForTests, keywordsOf, wordForms } from '../src/lib/library';

const here = dirname(fileURLToPath(import.meta.url));
const ZSTD = join(here, '..', 'testdata', 'sample_tr.zim');
const XZ = join(here, '..', 'testdata', 'sample_xz_oldns.zim');

/** Okuma sayısını sayan kaynak — aramanın tüm arşivi taramadığını doğrulamak için. */
class CountingSource implements RandomAccessSource {
  reads = 0;
  constructor(private inner: RandomAccessSource) {}
  get size() {
    return this.inner.size;
  }
  get name() {
    return this.inner.name;
  }
  read(o: number, l: number) {
    this.reads++;
    return this.inner.read(o, l);
  }
}

describe('normalizeForSearch', () => {
  it('Türkçe i/ı/İ/I aynı kabul edilir', () => {
    expect(normalizeForSearch('İSTANBUL')).toBe('istanbul');
    expect(normalizeForSearch('ISI')).toBe('isi');
    expect(normalizeForSearch('ısı')).toBe('isi');
    expect(normalizeForSearch('Isı_çarpması')).toBe('isi çarpmasi');
  });
});

describe('ZIM (zstd, yeni ad alanı)', () => {
  let zim: ZimArchive;
  let src: CountingSource;
  beforeAll(async () => {
    src = new CountingSource(new BytesSource(new Uint8Array(readFileSync(ZSTD)), 'sample_tr.zim'));
    zim = await ZimArchive.open(src);
  });

  it('başlık ve üstveri', async () => {
    expect(zim.header.majorVersion).toBe(6);
    expect(zim.isNewNamespace).toBe(true);
    expect(zim.entryCount).toBeGreaterThan(18);
    expect(zim.articleCount).toBe(18); // 16 makale + 2 yönlendirme
    expect(await zim.getMetadata('Title')).toBe('Örnek Vikipedi');
    expect(await zim.getMetadata('Description')).toBe('Örnek test arşivi');
    expect(await zim.getMetadata('Language')).toBe('tur');
    expect(await zim.getMetadata('YokBöyle')).toBeNull();
    expect(zim.mimeTypes).toContain('text/html');
  });

  it('ana sayfa', async () => {
    const main = await zim.getMainPage();
    expect(main?.path).toBe('Deprem');
    expect(main?.title).toBe('Deprem');
  });

  it('arama: harf duyarsız önek', async () => {
    for (const q of ['deprem', 'DEPREM', 'Deprem', 'dep']) {
      const hits = await zim.searchTitles(q);
      expect(hits[0], q).toEqual({ path: 'Deprem', title: 'Deprem' });
    }
    const kuz = await zim.searchTitles('kuzey anadolu');
    expect(kuz.map((h) => h.title)).toContain('Kuzey Anadolu Fay Hattı');
    const kuz2 = await zim.searchTitles('KUZEY_ANADOLU_FAY');
    expect(kuz2[0].path).toBe('Kuzey_Anadolu_Fay_Hattı');
  });

  it('arama: Türkçe ı/I/i/İ', async () => {
    for (const q of ['ısı', 'ıs', 'ISI', 'isi', 'İsı']) {
      const hits = await zim.searchTitles(q);
      expect(hits.map((h) => h.title), q).toContain('Isı çarpması');
    }
    const h = await zim.searchTitles('hİpotermİ');
    expect(h[0].title).toBe('Hipotermi');
    const c = await zim.searchTitles('çadir');
    expect(c[0].title).toBe('Çadır');
  });

  it('arama: içerir yedeği ve limit', async () => {
    const hits = await zim.searchTitles('fay');
    expect(hits.map((h) => h.title)).toContain('Kuzey Anadolu Fay Hattı');
    const two = await zim.searchTitles('a', 2);
    expect(two.length).toBe(2);
    expect(await zim.searchTitles('   ')).toEqual([]);
    expect(await zim.searchTitles('qqqzzz')).toEqual([]);
    // Görseller/stil dosyaları arama sonuçlarında çıkmaz
    expect((await zim.searchTitles('img')).length).toBe(0);
  });

  it('yönlendirme çözülür', async () => {
    const hits = await zim.searchTitles('zelzele');
    expect(hits[0].path).toBe('Zelzele');
    const a = await zim.getArticle('Zelzele');
    expect(a?.path).toBe('Deprem');
    expect(a?.title).toBe('Deprem');
    const k = await zim.getArticle('KAF');
    expect(k?.title).toBe('Kuzey Anadolu Fay Hattı');
  });

  it('makale HTML ve bağlantı çözümleme', async () => {
    const a = await zim.getArticle('Kuzey_Anadolu_Fay_Hattı');
    expect(a?.mime).toBe('text/html');
    expect(a?.html).toContain('<b>Kuzey Anadolu Fay Hattı</b>');
    expect(await zim.getArticle('Yok_Böyle_Makale')).toBeNull();
    expect(zim.resolveLink('Deprem', 'Kuzey_Anadolu_Fay_Hatt%C4%B1')).toBe('Kuzey_Anadolu_Fay_Hattı');
    expect(zim.resolveLink('Deprem', './Tsunami#Belirtiler')).toBe('Tsunami');
    expect(zim.resolveLink('Deprem', 'img/deprem_diyagram.png')).toBe('img/deprem_diyagram.png');
    expect(zim.resolveLink('a/b/Sayfa', '../_assets_/x.png')).toBe('a/_assets_/x.png');
    expect(zim.resolveLink('Deprem', 'https://tr.wikipedia.org/')).toBeNull();
    expect(zim.resolveLink('Deprem', '#cite_note-1')).toBeNull();
  });

  it('görsel kaynağı', async () => {
    const r = await zim.getResource('img/deprem_diyagram.png');
    expect(r?.mime).toBe('image/png');
    expect(Array.from(r!.data.subarray(0, 4))).toEqual([0x89, 0x50, 0x4e, 0x47]);
    expect(await zim.getResource('img/yok.png')).toBeNull();
  });

  it('arama tüm arşivi okumaz (önbellek sayesinde az okuma)', async () => {
    const before = src.reads;
    await zim.searchTitles('sel');
    await zim.searchTitles('sel');
    expect(src.reads - before).toBeLessThan(10);
  });
});

describe('htmlToText / extractParagraphs', () => {
  it('betik, kaynakça ve dipnotları atar', async () => {
    const zim = await ZimArchive.open(new BytesSource(new Uint8Array(readFileSync(ZSTD))));
    const a = (await zim.getArticle('Deprem'))!;
    const t = htmlToText(a.html);
    expect(t).toContain('Deprem, yer kabuğunda biriken gerilimin');
    expect(t).toContain('Büyüklük ve şiddet');
    expect(t).not.toContain('alert');
    expect(t).not.toContain('[1]');
    expect(t).not.toContain('Örnek kaynak');
    expect(t).not.toContain('Kaynakça');
    expect(t).not.toContain('<');
    expect(t).not.toContain('Sismik dalgaların basit şeması'); // figür altyazısı
    const ps = extractParagraphs(a.html, 300);
    expect(ps.length).toBeGreaterThan(0);
    expect(ps.join('\n\n').length).toBeLessThanOrEqual(300);
    expect(ps[0].startsWith('Deprem, yer kabuğunda')).toBe(true);
  });

  it('elle verilen HTML', () => {
    const html =
      '<html><head><style>p{}</style><title>X</title></head><body><p>Bir &amp; iki&nbsp;üç &#x130;zmir &#252;</p>' +
      '<table><tr><td>tablo</td></tr></table><div class="navbox"><div>gezinti</div></div><ul><li>madde</li></ul>' +
      '<p>Son<sup class="reference">[3]</sup>.</p><h2>Dış bağlantılar</h2><p>link</p></body></html>';
    const t = htmlToText(html);
    expect(t).toBe('Bir & iki üç İzmir ü\n\n• madde\n\nSon.');
  });
});

describe('ZIM (xz, eski ad alanı, extended küme)', () => {
  it('okur', async () => {
    if (!existsSync(XZ)) return; // tools/make_sample_zim.py ile üretilir
    const zim = await ZimArchive.open(new BytesSource(new Uint8Array(readFileSync(XZ))));
    expect(zim.header.majorVersion).toBe(5);
    expect(zim.isNewNamespace).toBe(false);
    expect(await zim.getMetadata('Description')).toBe('Örnek test arşivi');
    expect((await zim.getMainPage())?.title).toBe('Deprem');
    const hits = await zim.searchTitles('DEPREM');
    expect(hits[0]).toEqual({ path: 'Deprem', title: 'Deprem' });
    expect((await zim.searchTitles('ısı'))[0].title).toBe('Isı çarpması');
    expect((await zim.getArticle('Zelzele'))?.path).toBe('Deprem');
    expect((await zim.getArticle('A/Çankaya'))?.title).toBe('Çankaya');
    // Görsel eski düzende I/ ad alanında, extended (64 bit) sıkıştırmasız kümede
    const src = zim.resolveLink('Deprem', '../I/deprem_diyagram.png');
    expect(src).toBe('I/deprem_diyagram.png');
    const img = await zim.getResource(src!);
    expect(img?.mime).toBe('image/png');
    expect(img?.data[1]).toBe(0x50);
    expect((await zim.getResource('-/style.css'))?.mime).toBe('text/css');
    expect(zim.resolveLink('Deprem', 'Tsunami')).toBe('Tsunami');
  });
});

describe('library.searchLibraryForContext', () => {
  beforeAll(async () => {
    setLibraryForTests(await ZimArchive.open(new BytesSource(new Uint8Array(readFileSync(ZSTD)))));
  });
  afterAll(() => setLibraryForTests(undefined));

  it('anahtar kelimeler ve ek atımı', () => {
    expect(keywordsOf('Deprem sırasında ne yapmalıyım?')).toEqual(['deprem', 'sirasinda']);
    expect(wordForms('depremde')).toContain('deprem');
    expect(wordForms('yanığı')).toContain('yanik');
  });

  it('ilgili makaleleri döndürür', async () => {
    const r = await searchLibraryForContext('Depremde ne yapmalıyım?');
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].title).toBe('Deprem');
    expect(r[0].text.length).toBeLessThanOrEqual(1500);
    expect(r[0].text).toContain('yer kabuğunda');

    const k = await searchLibraryForContext('Kuzey Anadolu fay hattı nereden geçer?', 1);
    expect(k.map((x) => x.title)).toEqual(['Kuzey Anadolu Fay Hattı']);

    const h = await searchLibraryForContext('hipotermi belirtileri nelerdir', 2, 400);
    expect(h[0].title).toBe('Hipotermi');
    expect(h[0].text.length).toBeLessThanOrEqual(400);

    const y = await searchLibraryForContext('yanığa ne iyi gelir');
    expect(y[0]?.title).toBe('Yanık');

    const z = await searchLibraryForContext('zelzele');
    expect(z[0]?.path).toBe('@bytes/Deprem'); // yönlendirme çözülür (kütüphane referansı)

    expect(await searchLibraryForContext('ne nasıl')).toEqual([]);
  });

  it('paket yoksa boş', async () => {
    setLibraryForTests(null);
    expect(await searchLibraryForContext('deprem')).toEqual([]);
  });
});
