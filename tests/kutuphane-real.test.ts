// Gerçek Türkçe Vikipedi mini ZIM'i (1,2 GB) ile arama kalitesi ve süre
// denetimi. Dosya yoksa atlanır:  AC_REAL_ZIM=/yol/x.zim npx vitest run tests/kutuphane-real.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, openSync, readSync, fstatSync } from 'node:fs';
import type { RandomAccessSource } from '../src/lib/source';
import { ZimArchive } from '../src/lib/zim';
import { searchArchive, searchFulltext, Rank } from '../src/lib/zim/search';
import { setLibrariesForTests, searchLibraryForContext } from '../src/lib/library';

const REAL = process.env.AC_REAL_ZIM || '/home/claude/packs/wikipedia_tr_all_mini_2026-09.zim';

class FileSource implements RandomAccessSource {
  private fd: number;
  readonly size: number;
  readonly name = 'real.zim';
  constructor(p: string) {
    this.fd = openSync(p, 'r');
    this.size = fstatSync(this.fd).size;
  }
  async read(o: number, l: number) {
    const b = Buffer.alloc(Math.max(0, Math.min(l, this.size - o)));
    readSync(this.fd, b, 0, b.length, o);
    return new Uint8Array(b.buffer, b.byteOffset, b.length);
  }
}

// Zaman aşımı: 1,2 GB'lık dosya işletim sisteminin önbelleğinde değilken (ilk koşu ya da tam
// takımda öteki test dosyalarıyla aynı anda diskten okunurken) ilk arama testi tek başına 5 sn'yi
// aşabiliyordu; varsayılan 5 sn'lik süre bu yüzden "başlık araması"nı ara sıra kırıyordu.
// Hız ayrı ve açık bir bütçeyle ("süre bütçesi", ısınmış önbellek) ölçülür.
describe.skipIf(!existsSync(REAL))('gerçek Vikipedi ZIM', { timeout: 60000 }, () => {
  let zim: ZimArchive;
  beforeAll(async () => {
    zim = await ZimArchive.open(new FileSource(REAL));
  });

  it('Xapian dizinleri var ve okunuyor', async () => {
    const t = await zim.xapian('title');
    const f = await zim.xapian('fulltext');
    expect(t?.docCount).toBe(zim.articleCount);
    expect(f!.docCount).toBeGreaterThan(500000);
    expect(await f!.metadata('language')).toBe('tur');
  });

  it('başlık araması: sıralama ve Türkçe duyarsızlık', async () => {
    const top = async (q: string) => (await searchArchive(zim, q, { limit: 10 }))[0];
    expect(await top('deprem')).toMatchObject({ title: 'Deprem', rank: Rank.EXACT });
    expect(await top('istanbul')).toMatchObject({ title: 'İstanbul', rank: Rank.EXACT });
    expect(await top('sicak carpmasi')).toMatchObject({ title: 'Sıcak çarpması' });
    expect(await top('cadir')).toMatchObject({ title: 'Çadır' });
    expect(await top('ataturk')).toMatchObject({ title: 'Atatürk' });
    expect(await top('istanbl')).toMatchObject({ title: 'İstanbul', rank: Rank.FUZZY });
    expect(await top('depem')).toMatchObject({ title: 'Deprem', rank: Rank.FUZZY });
    expect((await top('depremde'))?.title).toBe('Deprem');
    // İngilizce klavye / noktasız ı ile yazılan büyük I: "Istanbul" yönlendirmesi değil İstanbul
    for (const q of ['Istanbul', 'ISTANBUL', 'ıstanbul']) expect((await top(q))?.title, q).toBe('İstanbul');
    expect((await top('Izmir'))?.title).toBe('İzmir');
    const af = await searchArchive(zim, 'anadolu fay', { limit: 10 });
    expect(af.map((h) => h.title)).toContain('Kuzey Anadolu Fay Hattı');
    expect(af[0].rank).toBe(Rank.WORDS);
  });

  it('tam metin araması', async () => {
    const h = await searchFulltext(zim, 'hipotermi', { limit: 5 });
    expect(h[0].title).toBe('Hipotermi');
    const k = await searchFulltext(zim, 'kalp krizi', { limit: 5 });
    expect(k[0].title).toBe('Kalp krizi');
  });

  it('asistan bağlamı gerçek makalelerden metin döndürür', async () => {
    setLibrariesForTests([{ id: 'real.zim', zim }]);
    try {
      const d = await searchLibraryForContext('Deprem sırasında ne yapmalıyım?', 2, 400);
      expect(d[0]).toMatchObject({ title: 'Deprem', path: '@real.zim/Deprem' });
      expect(d[0].text).toMatch(/^Deprem, yer sarsıntısı/);
      const s = await searchLibraryForContext('Su nasıl arıtılır', 1);
      expect(s[0]?.title).toBe('Su');
    } finally {
      setLibrariesForTests(undefined);
    }
  });

  it('süre bütçesi (yerel dosya, ısınmış önbellek)', async () => {
    const qs = ['deprem', 'kuzey anadolu', 'sicak carpmasi', 'istanbl', 'su aritma'];
    for (const q of qs) await searchArchive(zim, q); // ısınma
    const t = performance.now();
    for (const q of qs) {
      await searchArchive(zim, q);
      await searchFulltext(zim, q, { limit: 12 });
    }
    const per = (performance.now() - t) / qs.length;
    console.log(`gerçek ZIM: sorgu başına başlık+tam metin ortalama ${per.toFixed(0)} ms`);
    expect(per).toBeLessThan(1500);
  });
});
