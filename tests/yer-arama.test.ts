// Harita yer adı araması: Türkçe sadeleştirme, sıralama, PMTiles "places" katmanından dizin kurma.
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BytesSource, type RandomAccessSource } from '../src/lib/source';
import { ILLER, ara, aramaDizini, eslesme, placeAdi, placeTuru, sadelestir, yerleriTamamla, type Yer } from '../src/lib/map/yer-arama';
import { dizinKur, dizinOku, dizinYaz, YerToplayici } from '../src/lib/map/yer-dizini';
import { hazirla, paketAc, paketle } from '../src/lib/map/yer-toplayici';
import { basligiOku, karolariListele, okumaGruplari, dizinCoz } from '../src/lib/map/pmtiles-dizin';
import { readLayerPoints } from '../src/lib/map/mvt';
import { parsePoiGeoJSON } from '../src/lib/map/poi';

const td = (f: string) => fileURLToPath(new URL('../testdata/' + f, import.meta.url));
const yerlerPm = new Uint8Array(readFileSync(td('sample_yerler_ornek.pmtiles')));
const ornekPm = new Uint8Array(readFileSync(td('sample_ornek.pmtiles')));
const noktalar = parsePoiGeoJSON(readFileSync(td('sample_poi_ornek.geojson'), 'utf8'));
const KIZILAY = { lat: 39.9208, lon: 32.8541 };

describe('sadelestir', () => {
  it('Türkçe harfleri katlar, büyük/küçük harf duyarsızdır', () => {
    expect(sadelestir('IŞIKLAR')).toBe('isiklar');
    expect(sadelestir('İĞDECİK')).toBe('igdecik');
    expect(sadelestir('Çağlayan Köyü')).toBe('caglayan koyu');
    expect(sadelestir('Gökçeören')).toBe('gokceoren');
    expect(sadelestir('Üçpınar')).toBe(sadelestir('ucpinar'));
    expect(sadelestir('  Hâkimiyet-i  Millîye ')).toBe('hakimiyet i milliye');
    expect(sadelestir('Şahinler')).toBe('sahinler');
  });
});

describe('eslesme', () => {
  it('tam > baştan > kelime başı > içinde', () => {
    expect(eslesme('kizilay', 'kizilay')).toBe(0);
    expect(eslesme('kizilay', 'kizi')).toBe(1);
    expect(eslesme('ornek mahallesi', 'mah')).toBe(2);
    expect(eslesme('ornekcay', 'cay')).toBe(3);
    expect(eslesme('ornek mahallesi', 'mahallesi ornek')).toBe(3);
    expect(eslesme('kizilay', 'xyz')).toBe(-1);
    expect(eslesme('kizilay', '')).toBe(-1);
  });
});

describe('placeTuru / placeAdi', () => {
  it('Protomaps türlerini Türkçe yer türlerine çevirir', () => {
    expect(placeTuru({ kind: 'locality', kind_detail: 'village' })).toBe('koy');
    expect(placeTuru({ kind: 'locality', kind_detail: 'town' })).toBe('ilce');
    expect(placeTuru({ kind: 'locality', kind_detail: 'hamlet' })).toBe('mezra');
    expect(placeTuru({ kind: 'neighbourhood', kind_detail: 'suburb' })).toBe('mahalle');
    expect(placeTuru({ kind: 'macrohood', kind_detail: 'quarter' })).toBe('mahalle');
    expect(placeTuru({ kind: 'country' })).toBeNull();
    expect(placeTuru({ kind: 'locality', kind_detail: 'allotments' })).toBeNull();
  });
  it('Türkçe ad önce; Latin olmayan yazı Türkçe adı yoksa atlanır', () => {
    expect(placeAdi({ name: 'Αλεξανδρούπολη', 'name:tr': 'Dedeağaç' })).toBe('Dedeağaç');
    expect(placeAdi({ name: 'Αλεξανδρούπολη' })).toBeNull();
    expect(placeAdi({ name: ' Örnek ' })).toBe('Örnek');
    expect(placeAdi({})).toBeNull();
  });
});

describe('sıralama', () => {
  const yerler: Yer[] = [
    { ad: 'Yeniköy', tur: 'koy', lat: 39.0, lon: 32.0 },
    { ad: 'Yeniköy', tur: 'koy', lat: 39.92, lon: 32.85 },
    { ad: 'Yenimahalle', tur: 'ilce', lat: 39.97, lon: 32.8 },
    { ad: 'Yeni Mahalle', tur: 'mahalle', lat: 39.921, lon: 32.854 },
    { ad: 'Eskiyeni', tur: 'koy', lat: 39.9, lon: 32.8 },
    { ad: 'Yeni', tur: 'yer', lat: 41, lon: 30 },
  ];
  const d = aramaDizini(yerler, noktalar);
  it('tam eşleşme önce, sonra baştan, sonra içinde', () => {
    const r = ara(d, 'yeni', KIZILAY).map((s) => s.ad);
    expect(r[0]).toBe('Yeni');
    expect(r.indexOf('Eskiyeni')).toBe(r.length - 1);
  });
  it('aynı sınıfta il > ilçe > mahalle > köy, sonra uzaklık', () => {
    const r = ara(d, 'yeni', KIZILAY).filter((s) => s.sinif === 1);
    expect(r.map((s) => s.tur)).toEqual(['ilce', 'mahalle', 'koy', 'koy']);
    // Merkeze yakın Yeniköy uzaktakinden önce
    expect(r[2].lat).toBeCloseTo(39.92, 2);
  });
  it('Türkçe harfsiz yazım bulur', () => {
    expect(ara(d, 'YENIKOY', KIZILAY)[0].ad).toBe('Yeniköy');
  });
  it('nokta adları ve tür adı ("eczane") aranır, en yakın önce', () => {
    const r = ara(d, 'toplanma', KIZILAY);
    expect(r.length).toBeGreaterThan(5);
    expect(r.every((s) => s.tur === 'toplanma')).toBe(true);
    expect(r[0].etiket).toBe('Toplanma alanı');
    for (let i = 1; i < r.length; i++) if (r[i].sinif === r[i - 1].sinif) expect(r[i].uzaklik).toBeGreaterThanOrEqual(r[i - 1].uzaklik);
    // "hastane" adında geçmese de sağlık noktaları
    const h = ara(d, 'hastane', KIZILAY);
    expect(h.length).toBeGreaterThan(0);
    expect(h.every((s) => s.tur === 'saglik' && s.poiId)).toBe(true);
    // "su" yalnız tam yazılınca tür araması
    expect(ara(d, 'su', KIZILAY).some((s) => s.tur === 'su')).toBe(true);
  });
  it('boş sorgu boş sonuç; limit uygulanır', () => {
    expect(ara(d, '   ', KIZILAY)).toEqual([]);
    expect(ara(d, 'örnek', KIZILAY, 5)).toHaveLength(5);
  });
});

describe('yerleriTamamla', () => {
  it('il merkezini işaretler, haritada olmayan ili listeden ekler, bağlam yazar', () => {
    const y = yerleriTamamla(
      [
        { ad: 'Ankara', tur: 'ilce', lat: 39.92, lon: 32.85 },
        { ad: 'Örnekçay', tur: 'ilce', lat: 39.9, lon: 32.7 },
        { ad: 'Şahinler', tur: 'koy', lat: 39.96, lon: 32.76 },
      ],
      [32.5, 39.8, 33, 40],
    );
    expect(y.find((v) => v.ad === 'Ankara')!.tur).toBe('il');
    expect(y.filter((v) => v.tur === 'il')).toHaveLength(1); // sınır dışındaki iller eklenmez
    expect(y.find((v) => v.ad === 'Örnekçay')!.ust).toBe('Ankara');
    expect(y.find((v) => v.ad === 'Şahinler')!.ust).toBeTruthy();
    expect(ILLER).toHaveLength(81);
    // Sınır yoksa 81 il de aranabilir
    expect(yerleriTamamla([], null).filter((v) => v.tur === 'il')).toHaveLength(81);
  });
});

describe('PMTiles dizini', () => {
  it('dizin girdileri pmtiles kütüphanesiyle aynı çözülür, z12 karoları listelenir', async () => {
    const src = new BytesSource(yerlerPm, 'sample_yerler_ornek.pmtiles');
    const { header, root } = await basligiOku(src);
    expect(header.maxZoom).toBe(15);
    expect(root.length).toBeGreaterThan(0);
    expect(dizinCoz(new Uint8Array([1, 5, 1, 10, 1]))).toEqual([{ tileId: 5, offset: 0, length: 10, runLength: 1 }]);
    const list = await karolariListele(src, header, root, 12);
    expect(list.length).toBeGreaterThan(4);
    expect(list.every((k) => k.z === 12)).toBe(true);
    const g = okumaGruplari(list, 4096);
    expect(g.flat()).toHaveLength(list.length);
  });

  it('örnek haritanın (yer adlı) "places" katmanından dizin kurulur', async () => {
    const oranlar: number[] = [];
    const hd = await dizinKur(new BytesSource(yerlerPm, 'sample_yerler_ornek.pmtiles'), { ilerleme: (o) => oranlar.push(o), parca: 2048 });
    const yerler = hd.yerler;
    expect(hd.adlar).toEqual(yerler.map((y) => sadelestir(y.ad)));
    const ad = (n: string) => yerler.find((y) => y.ad === n);
    expect(ad('Kızılay')?.tur).toBe('mahalle');
    expect(ad('Işıklar Mahallesi')?.tur).toBe('mahalle');
    expect(ad('İğdecik')?.tur).toBe('koy');
    expect(ad('Söğütlü')?.tur).toBe('mezra');
    expect(ad('Yeşil Vadi')?.tur).toBe('yer');
    expect(ad('Örnekçay')?.tur).toBe('ilce');
    expect(ad('Ankara')?.tur).toBe('il');
    expect(ad('Kızılay')!.lat).toBeCloseTo(39.9208, 3);
    expect(ad('Kızılay')!.lon).toBeCloseTo(32.8541, 3);
    // Her yer bir kez (karo kenarı tamponundaki kopyalar atılır)
    expect(yerler.filter((y) => y.ad === 'Şahinler')).toHaveLength(1);
    expect(oranlar[0]).toBe(0);
    expect(oranlar.at(-1)).toBe(1);
    expect(oranlar.every((o, i) => i === 0 || o >= oranlar[i - 1])).toBe(true);
    // Uçtan uca: "isiklar" yazınca Işıklar Mahallesi ilk sırada
    const d = aramaDizini(yerler, noktalar, hd.adlar);
    expect(ara(d, 'isiklar', KIZILAY)[0].ad).toBe('Işıklar Mahallesi');
    expect(ara(d, 'igde', KIZILAY)[0].ad).toBe('İğdecik');
    expect(ara(d, 'kizilay', KIZILAY)[0]).toMatchObject({ ad: 'Kızılay', etiket: 'Mahalle' });
  });

  it('"places" katmanı olmayan pakette yalnız il listesi (sınır içi) döner', async () => {
    const { yerler } = await dizinKur(new BytesSource(ornekPm, 'sample_ornek.pmtiles'));
    expect(yerler.map((y) => y.ad)).toEqual(['Ankara']);
  });

  it('bozuk karo dizini durdurmaz; PMTiles olmayan dosya hata verir', async () => {
    const t = new YerToplayici();
    t.grup(new Uint8Array([1, 2, 3, 4]), 0, [{ z: 12, x: 0, y: 0, offset: 0, length: 4 }], 2);
    expect(t.yerler).toEqual([]);
    expect(readLayerPoints(new Uint8Array([]), 'places')).toBeNull();
    await expect(dizinKur(new BytesSource(new Uint8Array(200), 'bos.pmtiles'))).rejects.toThrow();
  });

  it('iptal edilen kurma IptalEdildi ile biter', async () => {
    await expect(dizinKur(new BytesSource(yerlerPm, 'x'), { iptal: () => true })).rejects.toThrow(/iptal/);
  });

  it('saklama biçimi gidip gelir; anahtar ya da sürüm farklıysa kullanılmaz', () => {
    const y: Yer[] = [
      { ad: 'Örnek', tur: 'koy', lat: 39.12345, lon: 32.54321, ust: 'Ankara' },
      { ad: 'Ankara', tur: 'il', lat: 39.92, lon: 32.85 },
    ];
    const f = JSON.parse(JSON.stringify(dizinYaz('a', y)));
    expect(dizinOku(f, 'a')).toEqual(y);
    expect(dizinOku(f, 'b')).toBeNull();
    expect(dizinOku({ ...f, v: 0 }, 'a')).toBeNull();
    expect(dizinOku(null, 'a')).toBeNull();
  });

  it('sütunlu paket (işçiden aktarım) gidip gelir', () => {
    const y: Yer[] = [
      { ad: 'Örnek', tur: 'koy', lat: 39.12345, lon: 32.54321, ust: 'Ankara' },
      { ad: 'Ankara', tur: 'il', lat: 39.92, lon: 32.85 },
      { ad: 'Satır\nsonu', tur: 'yer', lat: -1.5, lon: 2.25 },
    ];
    const g = paketAc(paketle(hazirla(y)));
    expect(g.yerler.slice(0, 2)).toEqual(y.slice(0, 2));
    expect(g.yerler[2].ad).toBe('Satır sonu');
    expect(g.adlar).toEqual(['ornek', 'ankara', 'satir sonu']);
    expect(paketAc(paketle(hazirla([])))).toEqual({ yerler: [], adlar: [] });
  });
});

// Gerçek Türkiye haritasıyla süre ve kapsam ölçümü (aylık harita iş akışı da bunu çalıştırır):
//   YER_GERCEK_OLC=1 [YER_GERCEK=<turkiye.pmtiles>] npx vitest run tests/yer-arama.test.ts -t "gerçek harita"
const GERCEK = process.env.YER_GERCEK ?? td('_turkiye.pmtiles');
describe.runIf(process.env.YER_GERCEK_OLC === '1' && existsSync(GERCEK))('gerçek harita', () => {
  it('Türkiye paketinden dizin', async () => {
    const fs = await import('node:fs');
    const fd = fs.openSync(GERCEK, 'r');
    const size = fs.fstatSync(fd).size;
    const src: RandomAccessSource = {
      name: 'turkiye.pmtiles',
      size,
      async read(o, l) {
        const b = Buffer.alloc(l);
        fs.readSync(fd, b, 0, l, o);
        return new Uint8Array(b.buffer, b.byteOffset, l);
      },
    };
    const t0 = Date.now();
    const { yerler } = await dizinKur(src);
    const ms = Date.now() - t0;
    const say: Record<string, number> = {};
    for (const y of yerler) say[y.tur] = (say[y.tur] ?? 0) + 1;
    const json = JSON.stringify(dizinYaz('x', yerler)).length;
    const d = aramaDizini(yerler, []);
    const t1 = performance.now();
    for (const q of ['ankara', 'kizilay', 'yeni', 'cam', 'merkez', 'izmit', 'kocaeli']) ara(d, q, KIZILAY);
    const araMs = (performance.now() - t1) / 7;
    console.log(JSON.stringify({ ms, adet: yerler.length, say, jsonMB: +(json / 1e6).toFixed(2), araMs: +araMs.toFixed(1) }));
    console.log(ara(d, 'kocaeli', KIZILAY).slice(0, 3).map((s) => `${s.ad} ${s.etiket} ${s.ust ?? ''}`));
    console.log(ara(d, 'kizilay', KIZILAY).slice(0, 3).map((s) => `${s.ad} ${s.etiket} ${s.ust ?? ''}`));
    expect(new Set(yerler.filter((y) => y.tur === 'il').map((y) => y.ad)).size).toBeGreaterThanOrEqual(81);
    expect(yerler.length).toBeGreaterThan(50000);
  }, 300_000);
});

describe('işçi çalışmazsa', () => {
  it('ölü işçi: iş ana iş parçacığında tamamlanır, "hazırlanıyor"da takılmaz', async () => {
    const { dizinHazirla, dizinDinle, isciUreticisiKoy, IsciOldu } = await import('../src/lib/map/yer-dizini');
    // Betiği yüklenemeyen işçi taklidi: her çağrı IsciOldu ile reddedilir
    isciUreticisiKoy(() => ({
      yukle: () => Promise.reject(new IsciOldu()),
      grup: () => Promise.reject(new IsciOldu()),
      bitir: () => Promise.reject(new IsciOldu()),
      kapat: () => {},
    }) as any);
    try {
      const src = new BytesSource(yerlerPm, 'olu-isci.pmtiles');
      const sonuc = await new Promise<any>((res) => {
        const birak = dizinDinle((d) => {
          if (d.durum === 'hazir' || d.durum === 'hata') {
            birak();
            res(d);
          }
        });
        dizinHazirla(src);
      });
      expect(sonuc.durum).toBe('hazir');
      expect(sonuc.dizin.yerler.length).toBeGreaterThan(0);
    } finally {
      isciUreticisiKoy(null);
    }
  });
});

describe('bozuk PMTiles dizini', () => {
  it('saçma girdi sayısı ve yarıda kalan sayı hata verir (bellek ayrılmaz, döngü yok)', () => {
    // 0xff 0xff 0xff 0x0f → ~4 milyar girdi
    expect(() => dizinCoz(new Uint8Array([0xff, 0xff, 0xff, 0x0f, 1, 2]))).toThrow(/bozuk/);
    // devam biti açık ama tampon bitiyor
    expect(() => dizinCoz(new Uint8Array([0x81]))).toThrow(/bozuk/);
    expect(() => dizinCoz(new Uint8Array([2, 1]))).toThrow(/bozuk/);
  });
});
