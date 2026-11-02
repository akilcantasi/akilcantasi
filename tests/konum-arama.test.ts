import { describe, expect, it } from 'vitest';
import { sayilar, sinyalSinifi, sureYaz, webOzet, yerelOzet } from '../src/lib/map/konum-arama';
import type { KonumDurum, Uydu } from '../src/lib/native';

const u = (id: number, sinyal: number, o: Partial<Uydu> = {}): Uydu => ({ id, tur: 'GPS', sinyal, kullanilan: false, yorunge: false, az: id * 30, yukseklik: 40, ...o });
const d = (o: Partial<KonumDurum> = {}): KonumDurum => ({ izin: 'tam', gpsVar: true, konumAcik: true, gpsAcik: true, agAcik: false, gecenMs: 60_000, ilkKonumMs: -1, uydular: [], ...o });
const durumlar = (x: KonumDurum) => yerelOzet(x).adimlar.map((a) => a.durum);

describe('konum araması özeti', () => {
  it('izin yoksa uygulama ayarlarına yönlendirir', () => {
    const o = yerelOzet(d({ izin: 'yok' }));
    expect(o.adimlar[0].durum).toBe('hata');
    expect(o.eylem?.tur).toBe('uygulamaAyarlari');
  });
  it('yaklaşık izin GPS için yetmez', () => {
    const o = yerelOzet(d({ izin: 'yaklasik' }));
    expect(o.ipucu).toContain('Tam konum');
  });
  it('konum kapalıysa konum ayarlarını önerir', () => {
    const o = yerelOzet(d({ konumAcik: false, gpsAcik: false }));
    expect(o.eylem?.tur).toBe('konumAyarlari');
    expect(o.adimlar.slice(2).every((a) => a.durum === 'bekliyor')).toBe(true);
  });
  it('hiç uydu yoksa açık alana çıkmayı söyler', () => {
    const o = yerelOzet(d({ uydular: [u(1, 0)] }));
    expect(durumlar(d({ uydular: [] }))).toEqual(['tamam', 'tamam', 'suruyor', 'bekliyor', 'bekliyor']);
    expect(o.ipucu).toContain('açık alana');
  });
  it('zayıf sinyalde sayıları söyler', () => {
    const o = yerelOzet(d({ uydular: [u(1, 12), u(2, 25), u(3, 15)] }));
    expect(o.gorulen).toBe(3);
    expect(o.guclu).toBe(1);
    expect(o.ipucu).toMatch(/3 uydu duyuluyor ama yalnız 1/);
  });
  it('güçlü sinyal var, yörünge bekleniyor', () => {
    const o = yerelOzet(d({ uydular: [u(1, 30, { yorunge: true }), u(2, 31), u(3, 28), u(4, 33), u(5, 25)] }));
    expect(o.yorungeli).toBe(1);
    expect(o.adimlar[3].durum).toBe('suruyor');
    expect(o.ipucu).toContain('yörünge');
  });
  it('yörünge bilgisi gelmeyen eski Android güçlü sinyali sayar', () => {
    const uy = [1, 2, 3, 4].map((i) => { const x = u(i, 30); delete x.yorunge; return x; });
    const o = yerelOzet(d({ uydular: uy }));
    expect(o.yorungeBiliniyor).toBe(false);
    expect(o.adimlar[3].ad).toBe('Güçlü sinyal toplanıyor');
    expect(o.adimlar[4].durum).toBe('suruyor');
  });
  it('konum gelince tüm adımlar tamam', () => {
    const o = yerelOzet(d({ konum: { lat: 39.92, lon: 32.85, dogruluk: 8, zaman: 1, kaynak: 'gps' } }));
    expect(o.adimlar.every((a) => a.durum === 'tamam')).toBe(true);
  });
  it('tarayıcıda süreye göre anlatır', () => {
    expect(webOzet(5000).ipucu).toContain('dinliyor');
    expect(webOzet(60_000).ipucu).toContain('yörünge');
    expect(webOzet(200_000).ipucu).toContain('izni');
  });
  it('yardımcılar', () => {
    expect(sureYaz(83_400)).toBe('1:23');
    expect(sinyalSinifi(0)).toBe('yok');
    expect(sinyalSinifi(18)).toBe('zayif');
    expect(sinyalSinifi(27)).toBe('orta');
    expect(sinyalSinifi(38)).toBe('iyi');
    expect(sayilar([u(1, 30, { kullanilan: true })]).kullanilan).toBe(1);
  });
});
