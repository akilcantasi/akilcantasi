// Android yerel indirici köprüsü: eklenti varken paketler uygulama klasöründen okunur,
// indirmeler yerel indiriciye verilir (window.Capacitor taklidiyle).
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const calls: { method: string; args: any }[] = [];
let jobs: any[] = [];
const files = [{ name: 'wikipedia_tr_all_mini_2026-09.zim', size: 1234 }];

function plugin() {
  const rec = (method: string, ret: (a: any) => any) => async (a: any) => {
    calls.push({ method, args: a });
    return ret(a);
  };
  return {
    paketDurumu: rec('paketDurumu', () => ({ available: true, allowed: true, free: 5e9, jobs })),
    paketIndir: rec('paketIndir', (a) => {
      const job = { file: a.file, status: 'checking', received: 0, total: a.size ?? 0, speed: 0, mirror: null, error: null };
      jobs = [job];
      return { ok: true, job };
    }),
    paketDuraklat: rec('paketDuraklat', () => ({ ok: true })),
    paketIptal: rec('paketIptal', () => ({ ok: true })),
    paketListesi: rec('paketListesi', () => ({ files })),
    paketSil: rec('paketSil', () => ({ ok: true })),
  };
}

beforeAll(() => {
  const win: any = {
    addEventListener() {},
    removeEventListener() {},
    Capacitor: { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { AkilCantasi: plugin() } },
  };
  vi.stubGlobal('window', win);
  vi.stubGlobal('location', new URL('https://localhost/'));
  vi.stubGlobal('localStorage', { getItem: () => null, setItem() {}, removeItem() {} });
});
afterAll(() => vi.unstubAllGlobals());

describe('Android yerel paketler', () => {
  it('eklenti algılanır, paket klasörü cihaz paketi olarak listelenir', async () => {
    const { nativePacks } = await import('../src/lib/native');
    expect(nativePacks.available()).toBe(true);
    const { listDevicePacks } = await import('../src/lib/packs');
    const l = await listDevicePacks();
    expect(l).toEqual([{ id: files[0].name, kind: 'zim', size: 1234, origin: 'device', url: '/_paket/' + files[0].name }]);
  });

  it('paket HEAD isteği olmadan parça parça okunur', async () => {
    const fetchMock = vi.fn(async (_u: string, init?: any) => {
      expect(init?.method).not.toBe('HEAD');
      return new Response(new Uint8Array([1, 2, 3, 4]), { status: 206 });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { openSource } = await import('../src/lib/packs');
    const src = await openSource({ id: 'a.zim', kind: 'zim', size: 1234, origin: 'device', url: '/_paket/a.zim' });
    expect(src.size).toBe(1234);
    expect(Array.from(await src.read(10, 4))).toEqual([1, 2, 3, 4]);
    expect(fetchMock.mock.calls[0][0]).toBe('/_paket/a.zim');
    expect(fetchMock.mock.calls[0][1].headers.Range).toBe('bytes=10-13');
  });

  it('indirme yerel indiriciye verilir; duraklat/iptal eklentiye gider', async () => {
    const d = await import('../src/lib/downloader');
    await d.startDownload({ file: 'kitap.zim', urls: ['https://download.kiwix.org/zim/x/kitap.zim'], size: 5000, sha256: 'ab' } as any);
    const start = calls.find((c) => c.method === 'paketIndir');
    expect(start?.args).toEqual({ file: 'kitap.zim', urls: ['https://download.kiwix.org/zim/x/kitap.zim'], size: 5000, sha256: 'ab' });
    d.pauseDownload('kitap.zim');
    await new Promise((r) => setTimeout(r, 0));
    expect(calls.some((c) => c.method === 'paketDuraklat' && c.args.file === 'kitap.zim')).toBe(true);
    await d.cancelDownload('kitap.zim');
    expect(calls.some((c) => c.method === 'paketIptal' && c.args.file === 'kitap.zim')).toBe(true);
  });

  it('boş yer cihazın gerçek boş alanından hesaplanır', async () => {
    const { storageInfo } = await import('../src/lib/downloader');
    const s = await storageInfo();
    expect(s.usage).toBe(1234);
    expect(s.quota).toBe(1234 + 5e9);
  });

  it('silme hem paket klasörüne hem OPFS\'e uygulanır', async () => {
    const { deleteDevicePack } = await import('../src/lib/packs');
    await deleteDevicePack('eski.zim');
    expect(calls.some((c) => c.method === 'paketSil' && c.args.file === 'eski.zim')).toBe(true);
  });
});
