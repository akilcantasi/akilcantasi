import { describe, expect, it } from 'vitest';
// @ts-ignore .mjs betiği
import { MONTHS, build, combine, parsePower, parseSeasonal } from '../tools/hava/hava-paketi.mjs';

const power = (t: number) => ({
  properties: {
    parameter: {
      T2M: Object.fromEntries([...MONTHS.map((m: string, i: number) => [m, t + i]), ['ANN', 0]]),
      T2M_MAX: Object.fromEntries(MONTHS.map((m: string, i: number) => [m, t + i + 6])),
      T2M_MIN: Object.fromEntries(MONTHS.map((m: string, i: number) => [m, i === 0 ? -999 : t + i - 6])),
      PRECTOTCORR: Object.fromEntries(MONTHS.map((m: string) => [m, 2])),
    },
  },
});
const seasonal = {
  monthly: {
    time: ['2026-11-01', '2026-12-01'],
    temperature_2m_anomaly: [1.24, -0.5],
    precipitation_mean: [3, 1],
    precipitation_anomaly: [1, -1],
  },
};

describe('hava ve iklim paketi', () => {
  it('NASA POWER normallerini ay ay çözer (yağış mm/ay, eksik -999)', () => {
    const n = parsePower(power(0));
    expect(n.t[0]).toBe(0);
    expect(n.t[11]).toBe(11);
    expect(n.tmin[0]).toBeNull();
    expect(n.yagis[0]).toBe(62);
    expect(n.yagis[3]).toBe(60);
  });

  it('mevsimsel tahmin: sıcaklık sapması ve modelin kendi iklimine göre yağış oranı', () => {
    const a = parseSeasonal(seasonal);
    expect(a).toEqual([
      { ay: '2026-11', tSapma: 1.2, yagisOran: 1.5 },
      { ay: '2026-12', tSapma: -0.5, yagisOran: 0.5 },
    ]);
    const c = combine(parsePower(power(5)), a);
    expect(c[0]).toEqual({ ay: '2026-11', t: 16.2, tSapma: 1.2, yagis: 90, yagisOran: 1.5 });
    expect(c[1].t).toBe(15.5);
  });

  it('paket: tahmin alınamazsa normallerle yine üretilir', async () => {
    const iller = [
      { plaka: 6, ad: 'Ankara', lat: 39.93, lon: 32.86 },
      { plaka: 7, ad: 'Antalya', lat: 36.89, lon: 30.71 },
    ];
    const ok = await build({ iller, log: () => {}, now: new Date('2026-11-06'), fetchJson: async (u: string) => (u.includes('power') ? power(3) : [seasonal, seasonal]) });
    expect(ok.tahmin.aylar).toEqual(['2026-11', '2026-12']);
    expect(ok.iller[1].aylar[0].t).toBe(14.2);
    const no = await build({ iller, log: () => {}, fetchJson: async (u: string) => { if (u.includes('power')) return power(3); throw new Error('kapalı'); } });
    expect(no.tahmin).toBeNull();
    expect(no.iller[0].aylar).toEqual([]);
    expect(no.iller[0].normal.t.length).toBe(12);
  });
});

describe('aylık katalog birleştirme', () => {
  it('yalnız işin güncellediği alanlar taşınır, yeni paketler korunur', async () => {
    // @ts-ignore .mjs
    const { merge } = await import('../tools/hf/katalog-birlestir.mjs');
    const job = { updated: '2026-12-06', packs: [{ id: 'hava-tr', urls: ['https://hf/x'], size: 81234, sizeApprox: false, sha256: 'ab', name: 'eski ad' }] };
    const cur = { updated: '2026-11-01', packs: [{ id: 'hava-tr', urls: ['https://hf/x'], size: 90000, sizeApprox: true, name: 'yeni ad' }, { id: 'yeni-paket', urls: [], size: 1 }] };
    expect(merge(job, cur)).toBe(3);
    expect(cur.packs[0]).toEqual({ id: 'hava-tr', urls: ['https://hf/x'], size: 81234, sizeApprox: false, sha256: 'ab', name: 'yeni ad' });
    expect(cur.packs[1].id).toBe('yeni-paket');
    expect(cur.updated).toBe('2026-12-06');
    const cur2 = { packs: [{ id: 'hava-tr', size: 1 }, { id: 'harita', size: 1 }] };
    expect(merge({ packs: [{ id: 'hava-tr', size: 2 }, { id: 'harita', size: 3 }] }, cur2, ['harita'])).toBe(1);
    expect(cur2.packs.map((p: any) => p.size)).toEqual([1, 3]);
  });
});
