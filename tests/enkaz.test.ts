import { describe, expect, it } from 'vitest';
import {
  SinyalIzi,
  binaYeri,
  duyulanSms,
  enYakinBina,
  enkazSms,
  isaretEtiketi,
  katYazi,
  kayitEkle,
  loadBinalar,
  mesafeTahmini,
  normalizeBina,
  saveBinalar,
  sureOnce,
  yakinlik,
  yakinlikYazi,
  type Bina,
} from '../src/lib/enkaz/enkaz';

const kv = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};
const ev: Bina = { id: 'e', ad: 'Ev', adres: 'Örnek Mah. 5. Sokak No 3', blok: 'B', kat: 3, daire: '7', not: 'Yatak odası arka cephede', lat: 39.9208, lon: 32.8541 };

describe('bina bilgisi', () => {
  it('kaydedip okur, bozuk kaydı düzeltir', () => {
    const s = kv();
    saveBinalar([ev, { ...ev, id: 'i', ad: 'İş', kat: null, lat: undefined, lon: undefined }], s);
    const l = loadBinalar(s);
    expect(l).toHaveLength(2);
    expect(l[1].kat).toBeNull();
    expect(l[1].lat).toBeUndefined();
    expect(normalizeBina({ ad: '', kat: '5', lat: 200, lon: 1 })).toMatchObject({ ad: 'Bina', kat: 5 });
    expect(normalizeBina({ lat: 200, lon: 1 })?.lat).toBeUndefined();
    s.setItem('ac.binalar', '{bozuk');
    expect(loadBinalar(s)).toEqual([]);
  });
  it('yer tarifi ve kat yazımı', () => {
    expect(binaYeri(ev)).toBe('B blok, 3. kat, daire 7');
    expect(binaYeri({ ...ev, blok: 'B blok' })).toBe('B blok, 3. kat, daire 7');
    expect(katYazi(0)).toBe('zemin kat');
    expect(katYazi(-1)).toBe('1. bodrum');
  });
  it('işaret etiketi kısa', () => {
    expect(isaretEtiketi('Ayşe Yılmaz', ev)).toBe('Ayşe · B blok 3. kat D:7');
    expect(isaretEtiketi('', null)).toBe('');
    expect(isaretEtiketi('Mehmet', { ...ev, blok: '', daire: '', kat: 0 })).toBe('Mehmet · zemin kat');
  });
  it('son konuma 150 m içindeki en yakın bina', () => {
    const is: Bina = { ...ev, id: 'i', ad: 'İş', lat: 39.93, lon: 32.86 };
    expect(enYakinBina([ev, is], { lat: 39.9209, lon: 32.8542 })?.id).toBe('e');
    expect(enYakinBina([ev, is], { lat: 39.95, lon: 32.9 })).toBeNull();
    expect(enYakinBina([ev], null)).toBeNull();
  });
});

describe('enkaz SMS', () => {
  const simdi = 1_700_000_000_000;
  it('bina, not, konum ve yaşı', () => {
    const m = enkazSms({ ad: 'Ayşe', bina: ev, konum: { lat: 39.9208, lon: 32.8541, dogruluk: 9, zaman: simdi - 12 * 60000, kaynak: 'gps' }, simdi });
    expect(m).toBe(
      'ENKAZ ALTINDAYIM. Adım Ayşe. Bina: Örnek Mah. 5. Sokak No 3, B blok, 3. kat, daire 7. Yatak odası arka cephede. Son konum: 39.92080, 32.85410 (±9 m, 12 dk önce). Telefonum enkaz işareti ve SOS sesi veriyor.',
    );
  });
  it('hiçbir bilgi yoksa söyler', () => {
    expect(enkazSms({ ad: '', bina: null, konum: null, simdi })).toContain('Konumum bilinmiyor.');
  });
  it('duyulan işaret bildirimi', () => {
    const m = duyulanSms({ etiket: 'Ayşe · B blok 3. kat', kat: 3, lat: 39.9208, lon: 32.8541, yasDk: 90, pil: 41 }, { lat: 39.921, lon: 32.854 });
    expect(m).toContain('İşaret: Ayşe · B blok 3. kat.');
    expect(m).not.toContain('Kat:');
    expect(m).toContain('(1 sa önce)');
    expect(m).toContain('Duyduğum yer: 39.92100, 32.85400.');
    expect(duyulanSms({ kat: -1, yasDk: -1, pil: -1 }, null)).toContain('Kat: 1. bodrum.');
  });
  it('zaman yazımı', () => {
    expect(sureOnce(30_000)).toBe('az önce');
    expect(sureOnce(5 * 60000)).toBe('5 dk önce');
    expect(sureOnce(3 * 3600000)).toBe('3 sa önce');
    expect(sureOnce(3 * 86400000)).toBe('3 gün önce');
  });
});

describe('son konum kaydı (tarayıcı)', () => {
  const k = (lat: number, zaman: number, dogruluk = 20) => ({ lat, lon: 32.85, dogruluk, zaman, kaynak: 'uygulama' });
  it('aynı yer ve yakın zamanda yalnız daha doğruysa günceller', () => {
    let l = kayitEkle([], k(39.92, 1000));
    l = kayitEkle(l, k(39.9201, 2000, 50));
    expect(l).toHaveLength(1);
    expect(l[0].zaman).toBe(1000);
    l = kayitEkle(l, k(39.9201, 3000, 8));
    expect(l).toHaveLength(1);
    expect(l[0].dogruluk).toBe(8);
  });
  it('uzaklaşınca ya da 50 dk geçince yeni kayıt; en çok 24; eskisi yazılmaz', () => {
    let l = kayitEkle([], k(39.92, 0));
    l = kayitEkle(l, k(39.93, 60000));
    l = kayitEkle(l, k(39.93, 60000 + 51 * 60000));
    expect(l).toHaveLength(3);
    expect(kayitEkle(l, k(40, 5))).toBe(l);
    for (let i = 0; i < 30; i++) l = kayitEkle(l, k(39 + i * 0.01, 10_000_000 + i));
    expect(l).toHaveLength(24);
  });
});

describe('sinyal (arama modu)', () => {
  it('yakınlık ve yazı', () => {
    expect(yakinlik(-100)).toBe(0);
    expect(yakinlik(-40)).toBe(1);
    expect(yakinlikYazi(-55)).toBe('Çok yakın');
    expect(yakinlikYazi(-90)).toBe('Uzak ya da engel arkasında');
  });
  it('kaba mesafe sınırlı ve monoton', () => {
    expect(mesafeTahmini(-59, 3)).toBeCloseTo(1, 5);
    expect(mesafeTahmini(-89, 3)).toBeCloseTo(10, 5);
    expect(mesafeTahmini(-20, 3)).toBe(0.5);
    expect(mesafeTahmini(-140, 3)).toBe(100);
  });
  it('eğilim: yaklaşma, uzaklaşma, sabit', () => {
    const iz = new SinyalIzi();
    expect(iz.egilim(0)).toBe('bilinmiyor');
    for (let t = 0; t <= 8000; t += 500) iz.ekle(-90 + t / 400, t);
    expect(iz.egilim(8000)).toBe('yaklasiyor');
    const uz = new SinyalIzi();
    for (let t = 0; t <= 8000; t += 500) uz.ekle(-60 - t / 400, t);
    expect(uz.egilim(8000)).toBe('uzaklasiyor');
    const sb = new SinyalIzi();
    for (let t = 0; t <= 8000; t += 500) sb.ekle(-70 + (t % 1000 ? 1 : -1), t);
    expect(sb.egilim(8000)).toBe('sabit');
  });
});
