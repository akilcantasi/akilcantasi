// Android uygulaması: rehber paketi uygulamanın paket klasörüne iner ve /_paket/ yolundan okunur.
// (Önceki hata: yükleyici yalnız tarayıcı deposuna bakıyor, paketi sessizce atlıyordu.)
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { REHBER_FORMAT } from '../src/content/rehber-pack';

const pack = {
  format: REHBER_FORMAT,
  version: 1,
  pack: { id: 'kendine-yetmek', name: 'Kendine Yetmek', desc: 'deneme', version: 1 },
  categories: [{ id: 'sf-test', title: 'Test', hint: 'ipucu', art: 'sf-t-kapak', color: '#000', order: 900 }],
  guides: [
    {
      id: 'sf-t-deneme',
      category: 'sf-test',
      title: 'Deneme rehberi',
      tag: 'TEST',
      summary: 'Özet.',
      steps: ['Bir.', 'İki.'],
      art: [null, null],
      keywords: ['deneme'],
      sources: ['Deneme'],
      reviewed: false,
    },
  ],
  art: {},
};

beforeAll(() => {
  vi.stubGlobal('window', {
    addEventListener() {},
    removeEventListener() {},
    Capacitor: {
      isNativePlatform: () => true,
      getPlatform: () => 'android',
      Plugins: {
        AkilCantasi: {
          paketDurumu: async () => ({ jobs: [], free: 1e9 }),
          paketListesi: async () => ({ files: [{ name: 'kendine-yetmek.rehber.json', size: 1234 }] }),
        },
      },
    },
  });
  vi.stubGlobal('location', new URL('https://localhost/'));
  vi.stubGlobal('localStorage', { getItem: () => null, setItem() {}, removeItem() {} });
  vi.stubGlobal('fetch', async (u: string) => {
    if (u === '/_paket/kendine-yetmek.rehber.json') return new Response(JSON.stringify(pack));
    if (String(u).includes('api/packs')) return new Response('{"files":[]}');
    return new Response('', { status: 404 });
  });
});
afterAll(() => vi.unstubAllGlobals());

describe('Android: Kendine Yetmek paketi', () => {
  it('uygulama klasöründeki paket okunur ve kategorileri görünür', async () => {
    const { reloadPackGuides, getPackCategories, packErrors } = await import('../src/content/pack-guides');
    await reloadPackGuides();
    expect(packErrors).toEqual({});
    expect(getPackCategories().map((c) => c.id)).toEqual(['sf-test']);
  });
});
