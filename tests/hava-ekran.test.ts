import { describe, expect, it } from 'vitest';
import { ayEtiketi, enYakinIl, gelecekAylar, isHavaPaketi, sicaklikYorum, tahminYasi, yagisYorum } from '../src/lib/hava';
import { kindOf } from '../src/lib/packs';

const il = (plaka: number, ad: string, lat: number, lon: number) => ({ plaka, ad, lat, lon, normal: { t: Array(12).fill(10), tmax: Array(12).fill(15), tmin: Array(12).fill(5), yagis: Array(12).fill(40) }, aylar: [] as any[] });

describe('hava ekranı yardımcıları', () => {
  it('paket türü adından ayırt edilir', () => {
    expect(kindOf('hava-iklim-tr.json')).toBe('hava');
    expect(kindOf('turkiye-afet-noktalari.geojson')).toBe('poi');
    expect(kindOf('noktalar.json')).toBe('poi');
  });
  it('yorumlar', () => {
    expect(sicaklikYorum(0.3)?.yon).toBe('normal');
    expect(sicaklikYorum(1.24)?.metin).toBe('normalden 1,2° sıcak');
    expect(sicaklikYorum(-2)?.metin).toBe('normalden 2,0° soğuk');
    expect(yagisYorum(0.6)?.metin).toBe('normalden kurak (~%60)');
    expect(yagisYorum(1.0)?.yon).toBe('normal');
    expect(yagisYorum(1.5)?.yon).toBe('yagisli');
    expect(ayEtiketi('2027-01')).toBe('Ocak 2027');
  });
  it('en yakın il ve geçmiş ayların atılması', () => {
    const iller = [il(6, 'Ankara', 39.93, 32.86), il(35, 'İzmir', 38.42, 27.14)];
    expect(enYakinIl(iller, 38.5, 27.3).plaka).toBe(35);
    const x = { ...iller[0], aylar: [{ ay: '2026-10' }, { ay: '2026-11' }, { ay: '2026-12' }] as any };
    expect(gelecekAylar(x, new Date('2026-11-15')).map((a) => a.ay)).toEqual(['2026-11', '2026-12']);
    expect(tahminYasi('2026-11-06', new Date('2026-12-26T10:00:00Z'))).toBe(50);
    expect(isHavaPaketi({ v: 1, iller })).toBe(true);
    expect(isHavaPaketi({ v: 1, iller: [] })).toBe(false);
  });
});
