// Kütüphane yeni tasarımının saf yardımcıları: adlar, kategoriler, mağaza bölümleri, sığma ipucu,
// son okunanlar ve iç ekran kodları.
import { beforeEach, describe, expect, it } from 'vitest';
import {
  adDili,
  dosyadanAd,
  gorunum,
  ihtiyacOf,
  kalanSure,
  kategoriOf,
  okunanEkle,
  okunanKonum,
  okunanlar,
  okunanlariSil,
  okunanYuzde,
  sigmaIpucu,
  sonOkuma,
  temizAd,
  ustVeri,
  ustVeriYaz,
  zamanOnce,
} from '../src/tabs/kutuphane/veri';
import { ekranKodu, ekranOf, makaleMi } from '../src/tabs/kutuphane/durum';
import manifest from '../public/packs-manifest.json';

const mem = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => void mem.set(k, String(v)),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
};

describe('koleksiyon adları', () => {
  it('katalog adından dil ve resimli/resimsiz ayrıntısı atılır (Türkçe İ dahil)', () => {
    expect(temizAd('Vikipedi: Kimya (Türkçe, resimli)')).toBe('Vikipedi: Kimya');
    expect(temizAd('İlaç rehberi — NHS (İngilizce)')).toBe('İlaç rehberi — NHS');
    expect(temizAd('WikiMed tıp ansiklopedisi (İngilizce, özet)')).toBe('WikiMed tıp ansiklopedisi (özet)');
    expect(temizAd('Vikipedi Türkçe (özet)')).toBe('Vikipedi Türkçe (özet)');
    expect(adDili('Su arıtma kitaplığı (İngilizce)')).toBe('İngilizce');
    expect(adDili('Vikikitap (Türkçe)')).toBe('Türkçe');
  });
  it('görünüm: Türkçe koleksiyonda dil rozeti yok, İngilizcede var', () => {
    expect(gorunum('nhs.uk_en_medicines_2026-09b.zim', { name: 'İlaç rehberi — NHS (İngilizce)', shelf: 'saglik' })).toEqual({ ad: 'İlaç rehberi — NHS', dil: 'İngilizce', kategori: 'saglik' });
    expect(gorunum('wikipedia_tr_all_mini_2026-09.zim', { name: 'Vikipedi Türkçe (özet)', shelf: 'ansiklopedi' }).dil).toBe('');
    expect(gorunum('x_en_foo_2025-01.zim', null, { title: 'Water Treatment Library', lang: 'eng' })).toEqual({ ad: 'Water Treatment Library', dil: 'İngilizce', kategori: 'diger' });
  });
  it('katalogda ve üstveride yoksa dosya adından okunur ad', () => {
    expect(dosyadanAd('wikipedia_tr_all_mini_2026-09.zim')).toBe('Vikipedi');
    expect(dosyadanAd('wikibooks_tr_all_maxi_2026-09.zim')).toBe('Vikikitap');
    expect(dosyadanAd('wikipedia_en_all_nopic_2026-06.zim')).toBe('Wikipedia');
    expect(dosyadanAd('zimgit-knots_en_2024-08.zim')).toBe('Zimgit knots');
  });
  it('kategori dosya adından tahmin edilir', () => {
    expect(kategoriOf('mdwiki_en_all_maxi_2025-11.zim')).toBe('saglik');
    expect(kategoriOf('wiktionary_tr_all_nopic_2026-10.zim')).toBe('dil');
    expect(kategoriOf('zimgit-water_en_2024-08.zim')).toBe('hayatta');
    expect(kategoriOf('ifixit_tr_all_2026-03.zim')).toBe('pratik');
    expect(kategoriOf('bilinmeyen.zim')).toBe('diger');
  });
});

describe('mağaza', () => {
  it('her katalog kitaplığı bir ihtiyaç bölümüne düşer; su ve yemek ayrı', () => {
    const zims = manifest.packs.filter((p: any) => p.kind === 'zim') as any[];
    const by = (id: string) => ihtiyacOf(zims.find((z) => z.id === id));
    expect(by('kitap-su')).toBe('su-yemek');
    expect(by('kitap-gida')).toBe('su-yemek');
    expect(by('based-cooking')).toBe('su-yemek');
    expect(by('nhs-ilac')).toBe('saglik');
    expect(by('wikipedia-tr-mini')).toBe('genel');
    expect(by('readygov')).toBe('afet');
    expect(by('ifixit-tr')).toBe('onarim');
    expect(by('vikikaynak-tr')).toBe('kitap');
    expect(by('vikisozluk-tr')).toBe('dil');
  });
  it('sığma ipucu', () => {
    expect(sigmaIpucu(20e6, 2e9).duzey).toBe('kucuk');
    expect(sigmaIpucu(1.2e9, 10e9).duzey).toBe('orta');
    expect(sigmaIpucu(1.2e9, 2e9).duzey).toBe('buyuk');
    expect(sigmaIpucu(8e9, 100e9).duzey).toBe('buyuk');
    expect(sigmaIpucu(3e9, 2e9)).toEqual({ duzey: 'yer-yok', metin: 'Yer yetmez (2,0 GB boş)' });
    expect(sigmaIpucu(20e6, null).duzey).toBe('kucuk');
  });
  it('kalan süre', () => {
    expect(kalanSure(0, 100e6, 0)).toBe('');
    expect(kalanSure(0, 10e6, 1e6)).toBe('bir dakikadan az kaldı');
    expect(kalanSure(0, 600e6, 1e6)).toBe('~10 dk kaldı');
  });
});

describe('son okunanlar', () => {
  beforeEach(() => mem.clear());
  it('ekler, başa alır, konumu korur, siler', () => {
    okunanEkle({ ref: '@a.zim/Deprem', title: 'Deprem', src: 'a.zim', at: 1000 });
    okunanKonum('@a.zim/Deprem', { y: 0.5 });
    okunanEkle({ ref: '@b.zim/x.pdf', title: 'Kitap', src: 'b.zim', at: 2000 });
    okunanKonum('@b.zim/x.pdf', { page: 3, pages: 12 });
    okunanEkle({ ref: '@a.zim/Deprem', title: 'Deprem', src: 'a.zim', at: 3000 });
    const l = okunanlar();
    expect(l.map((o) => o.ref)).toEqual(['@a.zim/Deprem', '@b.zim/x.pdf']);
    expect(l[0].y).toBe(0.5);
    expect(okunanYuzde(l[0])).toBe(50);
    expect(okunanYuzde(l[1])).toBe(25);
    expect(sonOkuma(l, 'b.zim')).toBe(2000);
    okunanlariSil('a.zim');
    expect(okunanlar().map((o) => o.src)).toEqual(['b.zim']);
  });
  it('bozuk kayıt yok sayılır', () => {
    mem.set('ac.lib.okunan', '[{"ref":1},{"ref":"@a/x","title":"x","src":"a","at":1}]');
    expect(okunanlar()).toHaveLength(1);
    mem.set('ac.lib.okunan', 'bozuk');
    expect(okunanlar()).toEqual([]);
  });
  it('zaman ifadesi', () => {
    const now = 10 * 86400e3;
    expect(zamanOnce(now - 10e3, now)).toBe('az önce');
    expect(zamanOnce(now - 5 * 60e3, now)).toBe('5 dk önce');
    expect(zamanOnce(now - 3 * 3600e3, now)).toBe('3 saat önce');
    expect(zamanOnce(now - 86400e3, now)).toBe('dün');
    expect(zamanOnce(now - 4 * 86400e3, now)).toBe('4 gün önce');
  });
});

describe('üstveri önbelleği', () => {
  beforeEach(() => mem.clear());
  it('boyut değişince geçersiz', () => {
    ustVeriYaz([{ id: 'a.zim', size: 10, title: 'A', description: 'd', language: 'tur', articleCount: 5, hasFulltext: true, kind: 'wikipedia' }]);
    expect(ustVeri('a.zim', 10)?.count).toBe(5);
    expect(ustVeri('a.zim', 11)).toBeNull();
  });
});

describe('iç ekran kodları', () => {
  it('gidiş-dönüş', () => {
    for (const e of [{ ad: 'ana' }, { ad: 'ara' }, { ad: 'yonet' }, { ad: 'magaza' }, { ad: 'magaza', bolum: 'saglik' }, { ad: 'koleksiyon', id: 'wikipedia_tr_all_mini_2026-09.zim' }] as const) {
      expect(ekranOf(ekranKodu(e as any))).toEqual(e.ad === 'magaza' && !('bolum' in e) ? { ad: 'magaza', bolum: undefined } : e);
    }
  });
  it('makale referansları iç ekranla karışmaz', () => {
    expect(makaleMi('@a.zim/Deprem')).toBe(true);
    expect(makaleMi('A/Deprem')).toBe(true);
    expect(makaleMi('kt:magaza')).toBe(false);
    expect(makaleMi(null)).toBe(false);
  });
});
