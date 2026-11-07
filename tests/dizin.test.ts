// Koleksiyon dizini (src/lib/zim/dizin.ts): Gutenberg benzeri kitaplıkta betiksiz kitap listesi.
// DOM gerektiren kısımlar (sayfaKabukMu, yükleniyor görselleri) e2e/sanitize-check.mjs'de sınanır.
import { describe, expect, it } from 'vitest';
import { fstatSync, openSync, readSync } from 'node:fs';
import path from 'node:path';
import { ZimArchive } from '../src/lib/zim';
import { DizinOkuyucu, dizinGirdisiMi, gutenbergNo, gutenbergVerisiniOku, yoldanAd } from '../src/lib/zim/dizin';
import { detectKind } from '../src/lib/library';

class FileSource {
  private fd: number;
  readonly size: number;
  constructor(p: string, readonly name = path.basename(p)) {
    this.fd = openSync(p, 'r');
    this.size = fstatSync(this.fd).size;
  }
  async read(o: number, l: number) {
    const b = Buffer.alloc(Math.max(0, Math.min(l, this.size - o)));
    readSync(this.fd, b, 0, b.length, o);
    return new Uint8Array(b.buffer, b.byteOffset, b.length);
  }
}

const ORNEK = path.resolve(__dirname, '../testdata/sample_gutenberg_en.zim');

describe('gutenberg yolları', () => {
  it('kitap sayfası numarası; kapak ve öteki dosyalar kitap değil', () => {
    expect(gutenbergNo('Pride and Prejudice.1342.html')).toBe('1342');
    expect(gutenbergNo('A/Pride and Prejudice.1342.html')).toBe('1342');
    expect(gutenbergNo('Pride%20and%20Prejudice.1342.html')).toBe('1342');
    expect(gutenbergNo('Pride and Prejudice_cover.1342.html')).toBeNull();
    expect(gutenbergNo('Pride and Prejudice.1342.epub')).toBeNull();
    expect(gutenbergNo('index.html')).toBeNull();
    expect(gutenbergNo('full_by_popularity.js')).toBeNull();
    expect(yoldanAd('Pride and Prejudice.1342.html')).toBe('Pride and Prejudice');
    expect(yoldanAd('foo/Some_Page.html')).toBe('Some Page');
  });

  it('dizin süzgeci: gutenberg yalnız kitaplar; genelde HTML sayfalar, giriş sayfası ve dosyalar hariç', () => {
    expect(dizinGirdisiMi('gutenberg', { path: 'Emma.158.html' }, 'index.html')).toBe(true);
    expect(dizinGirdisiMi('gutenberg', { path: 'Emma_cover.158.html' }, 'index.html')).toBe(false);
    expect(dizinGirdisiMi('gutenberg', { path: 'Emma.158.html', redirect: true }, 'index.html')).toBe(false);
    expect(dizinGirdisiMi('genel', { path: 'index.html', mime: 'text/html' }, 'index.html')).toBe(false);
    expect(dizinGirdisiMi('genel', { path: 'docs/intro.html', mime: 'text/html' }, 'index.html')).toBe(true);
    expect(dizinGirdisiMi('genel', { path: 'app.js', mime: 'application/javascript' }, null)).toBe(false);
    expect(dizinGirdisiMi('genel', { path: '_/app.html', mime: 'text/html' }, null)).toBe(false);
  });

  it('JS veri dosyasından yazarlar (dizi ve nesne biçimleri, bozuk veri)', () => {
    const m = gutenbergVerisiniOku('var json_data = [["Emma", "Jane Austen", 158, "110"], ["Beowulf", "Anonymous", "16328"]];');
    expect(m.get('158')).toBe('Jane Austen');
    expect(m.has('16328')).toBe(false);
    const o = gutenbergVerisiniOku("var x = [{'id': 84, 'author': 'Mary Shelley'}];");
    expect(o.get('84')).toBe('Mary Shelley');
    expect(gutenbergVerisiniOku('var json_data = [[[').size).toBe(0);
    expect(gutenbergVerisiniOku('').size).toBe(0);
  });

  it('kaynak türü: Kiwix gutenberg paket adları', () => {
    expect(detectKind('gutenberg_en_lcc-t', 'Project Gutenberg Library', 'gutenberg_en_lcc-t_2025-01.zim')).toBe('gutenberg');
    expect(detectKind('', '', 'gutenberg_en_lcc-r_2025-01.zim')).toBe('gutenberg');
  });
});

describe('DizinOkuyucu (örnek Gutenberg ZIM)', () => {
  it('alfabetik kitap listesi, kapaklar ve giriş sayfası yok, yazarlar var', async () => {
    const zim = await ZimArchive.open(new FileSource(ORNEK));
    const ana = await zim.getMainPage();
    expect(ana?.path).toBe('index.html');
    const o = new DizinOkuyucu(zim, 'gutenberg', ana!.path);
    const hepsi = [];
    while (!o.bitti) hepsi.push(...(await o.sonraki(15)));
    expect(hepsi.length).toBe(40);
    expect(hepsi.some((g) => /_cover\./.test(g.path) || g.path === 'index.html')).toBe(false);
    const adlar = hepsi.map((g) => g.title);
    expect([...adlar].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))).toEqual(adlar);
    expect(hepsi.find((g) => g.title === 'Pride and Prejudice')?.author).toBe('Jane Austen');
    expect(hepsi.find((g) => g.title === 'Beowulf')?.author).toBeUndefined();
  });

  it('harfe atlama ve parça sınırı', async () => {
    const zim = await ZimArchive.open(new FileSource(ORNEK));
    const o = new DizinOkuyucu(zim, 'gutenberg', 'index.html');
    await o.atla('M');
    const m = await o.sonraki(2);
    expect(m[0].title.startsWith('M')).toBe(true);
    // Az sayıda istense de bir parçadaki girdilerin hiçbiri kaybolmaz: sıradaki çağrı kaldığı yerden
    const sonra = await o.sonraki(100);
    expect(new Set([...m, ...sonra].map((g) => g.path)).size).toBe(m.length + sonra.length);
    await o.atla('Zz');
    expect(await o.sonraki(5)).toEqual([]);
  });
});
