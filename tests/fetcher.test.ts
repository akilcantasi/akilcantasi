// Sunucu tarafı paket indirici: ayna seçimi, paralel bölümler, sürdürme, doğrulama
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
// @ts-expect-error — düz JS modülü
import { createFetcher, expandMirrors, planSegments, remaining, KIWIX_MIRRORS, PART_DIR } from '../server/fetcher.mjs';

const SIZE = 5 * 1024 * 1024 + 123;
const DATA = crypto.randomBytes(SIZE);
const SHA = crypto.createHash('sha256').update(DATA).digest('hex');

type Mirror = { url: string; hits: number; close: () => Promise<void> };

/** Range destekli küçük dosya sunucusu. delayMs: her 64 KB'den sonra bekleme (yavaş ayna). */
async function mirror(opts: { delayMs?: number; missing?: boolean; failFirst?: number } = {}): Promise<Mirror> {
  let fails = opts.failFirst ?? 0;
  const m: Mirror = { url: '', hits: 0, close: async () => {} };
  const srv = http.createServer(async (req, res) => {
    m.hits++;
    if (opts.missing) {
      res.writeHead(404).end();
      return;
    }
    const r = /bytes=(\d+)-(\d*)/.exec(req.headers.range ?? '');
    const start = r ? Number(r[1]) : 0;
    const end = r && r[2] ? Math.min(Number(r[2]), SIZE - 1) : SIZE - 1;
    res.writeHead(r ? 206 : 200, {
      'Content-Length': end - start + 1,
      ...(r ? { 'Content-Range': `bytes ${start}-${end}/${SIZE}` } : {}),
      'Accept-Ranges': 'bytes',
    });
    if (fails > 0 && start > 0) {
      // Bağlantıyı yarıda kes
      fails--;
      res.write(DATA.subarray(start, Math.min(end + 1, start + 100_000)));
      res.destroy();
      return;
    }
    for (let p = start; p <= end; p += 65536) {
      if (res.destroyed) return;
      res.write(DATA.subarray(p, Math.min(end + 1, p + 65536)));
      if (opts.delayMs) await new Promise((x) => setTimeout(x, opts.delayMs));
    }
    res.end();
  });
  await new Promise<void>((r) => srv.listen(0, '127.0.0.1', () => r()));
  m.url = `http://127.0.0.1:${(srv.address() as any).port}/zim/test/paket.zim`;
  m.close = () =>
    new Promise((r) => {
      srv.closeAllConnections?.();
      srv.close(() => r());
    });
  return m;
}

let dir: string;
beforeAll(async () => {
  dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'akil-fetch-'));
});
afterAll(async () => {
  await fsp.rm(dir, { recursive: true, force: true });
});

function manifestWith(urls: string[], extra: Record<string, unknown> = {}) {
  return async () => ({ packs: [{ id: 'test-paket', kind: 'zim', file: 'paket.zim', size: SIZE, urls, ...extra }] });
}

async function waitFor(fetcher: any, file: string, statuses: string[], ms = 20000) {
  const t0 = Date.now();
  for (;;) {
    const j = fetcher.list().find((x: any) => x.file === file);
    if (j && statuses.includes(j.status)) return j;
    if (Date.now() - t0 > ms) throw new Error('zaman aşımı: ' + JSON.stringify(j));
    await new Promise((r) => setTimeout(r, 50));
  }
}

describe('ayna listesi ve bölümler', () => {
  it('Kiwix adresinden tüm aynalar üretilir, özgün adres korunur', () => {
    const u = 'https://mirror.download.kiwix.org/zim/wikipedia/wikipedia_tr_all_mini_2026-09.zim';
    const m = expandMirrors([u]);
    expect(m).toContain(u);
    expect(m.length).toBe(KIWIX_MIRRORS.length);
    expect(m).toContain('https://ftp.fau.de/kiwix/zim/wikipedia/wikipedia_tr_all_mini_2026-09.zim');
    expect(new Set(m).size).toBe(m.length);
  });

  it('Kiwix dışı adres olduğu gibi kalır', () => {
    expect(expandMirrors(['https://huggingface.co/x/y.gguf'])).toEqual(['https://huggingface.co/x/y.gguf']);
  });

  it('bölümler dosyayı boşluksuz ve çakışmasız kaplar', () => {
    const total = 100_000_007;
    const s = planSegments(total, 4, 1_000_000);
    expect(s.length).toBe(4);
    expect(s[0].start).toBe(0);
    expect(s.at(-1)!.end).toBe(total - 1);
    for (let i = 1; i < s.length; i++) expect(s[i].start).toBe(s[i - 1].end + 1);
    expect(remaining(s)).toBe(total);
  });

  it('küçük dosya tek bölüm', () => {
    expect(planSegments(1000, 4, 16 * 1024 * 1024)).toEqual([{ start: 0, end: 999, pos: 0 }]);
  });
});

describe('indirme', { timeout: 40000 }, () => {
  it('en hızlı aynayı seçer, paralel indirir, SHA-256 doğrular ve data/ klasörüne koyar', async () => {
    const slow = await mirror({ delayMs: 200 });
    const fast = await mirror();
    const gone = await mirror({ missing: true });
    const data = path.join(dir, 'a');
    const fetcher = createFetcher({
      dataDir: data,
      loadManifest: manifestWith([slow.url], { sha256: SHA }),
      mirrors: () => [gone.url, slow.url, fast.url],
      segments: 4,
      minSegment: 1024 * 1024,
      probeMs: 3000,
    });
    const r = await fetcher.start('test-paket');
    expect(r.ok).toBe(true);
    const j = await waitFor(fetcher, 'paket.zim', ['done', 'error']);
    expect(j.error).toBeNull();
    expect(j.status).toBe('done');
    const out = await fsp.readFile(path.join(data, 'paket.zim'));
    expect(out.equals(DATA)).toBe(true);
    expect(fs.existsSync(path.join(data, PART_DIR, 'paket.zim.part'))).toBe(false);
    // Yavaş ayna yalnızca ölçümde kullanıldı
    expect(fast.hits).toBeGreaterThan(slow.hits);
    await Promise.all([slow.close(), fast.close(), gone.close()]);
  });

  it('kopan bağlantı kaldığı yerden sürer', async () => {
    const flaky = await mirror({ failFirst: 3 });
    const data = path.join(dir, 'b');
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith([flaky.url]), mirrors: () => [flaky.url], segments: 4, minSegment: 1024 * 1024, probeMs: 3000 });
    await fetcher.start('paket.zim');
    const j = await waitFor(fetcher, 'paket.zim', ['done', 'error']);
    expect(j.status).toBe('done');
    expect((await fsp.readFile(path.join(data, 'paket.zim'))).equals(DATA)).toBe(true);
    await flaky.close();
  });

  it('duraklatılan indirme yeni oturumda kaldığı yerden sürer', async () => {
    const slow = await mirror({ delayMs: 100 });
    const data = path.join(dir, 'c');
    const opts = { dataDir: data, loadManifest: manifestWith([slow.url]), mirrors: () => [slow.url], segments: 2, minSegment: 1024 * 1024, probeMs: 3000 };
    const f1 = createFetcher(opts);
    await f1.start('paket.zim');
    await waitFor(f1, 'paket.zim', ['downloading']);
    await new Promise((r) => setTimeout(r, 600));
    f1.pause('paket.zim');
    const paused = await waitFor(f1, 'paket.zim', ['paused']);
    expect(paused.received).toBeGreaterThan(0);
    expect(paused.received).toBeLessThan(SIZE);

    const f2 = createFetcher(opts);
    await f2.restore();
    const restored = f2.list()[0];
    expect(restored.status).toBe('paused');
    expect(restored.received).toBeGreaterThan(0);
    const hitsBefore = slow.hits;
    await f2.start('paket.zim');
    const j = await waitFor(f2, 'paket.zim', ['done', 'error'], 30000);
    expect(j.status).toBe('done');
    expect((await fsp.readFile(path.join(data, 'paket.zim'))).equals(DATA)).toBe(true);
    expect(slow.hits).toBeGreaterThan(hitsBefore);
    await slow.close();
  });

  it('yanlış SHA-256 → hata, dosya silinir', async () => {
    const m = await mirror();
    const data = path.join(dir, 'd');
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith([m.url], { sha256: 'a'.repeat(64) }), mirrors: () => [m.url], probeMs: 3000 });
    await fetcher.start('paket.zim');
    const j = await waitFor(fetcher, 'paket.zim', ['done', 'error']);
    expect(j.status).toBe('error');
    expect(j.error).toMatch(/SHA-256/);
    expect(fs.existsSync(path.join(data, 'paket.zim'))).toBe(false);
    await m.close();
  });

  it('disk dolu (ENOSPC): yeniden denemeden hemen "Yer yetersiz" hatasıyla durur', async () => {
    // Gövde akışı ENOSPC koduyla hata verir (disk dolu yazma hatası aynı yoldan geçer)
    let calls = 0;
    const fetchImpl = async (_u: string, init: any) => {
      calls++;
      const range = /bytes=(\d+)-(\d*)/.exec(init?.headers?.Range ?? '');
      const start = range ? Number(range[1]) : 0;
      const body = new ReadableStream<Uint8Array>({
        pull(c) {
          if (init?.headers?.Range === `bytes=0-${3 * 1024 * 1024 - 1}`) {
            // ölçüm isteği: biraz veri ver, bitir
            c.enqueue(new Uint8Array(64 * 1024));
            c.close();
            return;
          }
          c.error(Object.assign(new Error('no space left on device'), { code: 'ENOSPC' }));
        },
      });
      return new Response(body, { status: 206, headers: { 'Content-Range': `bytes ${start}-${SIZE - 1}/${SIZE}` } });
    };
    const data = path.join(dir, 'nospc');
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith(['https://ayna.example/zim/x/paket.zim']), mirrors: () => ['https://ayna.example/zim/x/paket.zim'], fetch: fetchImpl as any, segments: 4, minSegment: 1024 * 1024, probeMs: 3000 });
    const t0 = Date.now();
    await fetcher.start('paket.zim');
    const j = await waitFor(fetcher, 'paket.zim', ['done', 'error'], 10000);
    expect(j.status).toBe('error');
    expect(j.error).toMatch(/Yer yetersiz/);
    // Eskiden her bölüm ayna sayısı × 3 kez, artan beklemelerle yeniden deniyordu
    expect(Date.now() - t0).toBeLessThan(5000);
    expect(calls).toBeLessThan(12);
  });

  it('boyut uyuşmazlığında yarım dosya silinir (her denemede aynı hataya takılmasın)', async () => {
    // Aralık desteklemeyen ayna: ölçümde tam boyutu bildirir, indirmede eksik gövdeyle düzgün biter
    let n = 0;
    const short = http.createServer((req, res) => {
      if (n++ === 0) {
        res.writeHead(200, { 'Content-Length': SIZE });
        res.end(DATA);
        return;
      }
      res.writeHead(200); // chunked: eksik gövde düzgün biter
      res.end(DATA.subarray(0, 1000));
    });
    await new Promise<void>((r) => short.listen(0, '127.0.0.1', () => r()));
    const url = `http://127.0.0.1:${(short.address() as any).port}/paket.zim`;
    const data = path.join(dir, 'kisa');
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith([url], { size: 0, sizeApprox: true }), mirrors: () => [url], probeMs: 3000 });
    await fetcher.start('paket.zim');
    const j = await waitFor(fetcher, 'paket.zim', ['done', 'error'], 15000);
    expect(j.status).toBe('error');
    expect(j.error).toMatch(/Boyut uyuşmuyor/);
    expect(fs.existsSync(path.join(data, PART_DIR, 'paket.zim.part'))).toBe(false);
    expect(fs.existsSync(path.join(data, PART_DIR, 'paket.zim.durum'))).toBe(false);
    await new Promise((r) => short.close(() => r(null)));
  });

  it('aralık desteklemeyen aynada kopan bağlantı baştan indirilir (dosya bozulmaz)', async () => {
    let n = 0;
    const flaky = http.createServer((req, res) => {
      n++;
      res.writeHead(200, { 'Content-Length': SIZE });
      if (n === 2) {
        // İlk gerçek indirme yarıda kopar
        res.write(DATA.subarray(0, 400_000));
        setTimeout(() => res.destroy(), 50);
        return;
      }
      res.end(DATA);
    });
    await new Promise<void>((r) => flaky.listen(0, '127.0.0.1', () => r()));
    const url = `http://127.0.0.1:${(flaky.address() as any).port}/paket.zim`;
    const data = path.join(dir, 'aralıksız');
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith([url], { sha256: SHA }), mirrors: () => [url], probeMs: 3000 });
    await fetcher.start('paket.zim');
    const j = await waitFor(fetcher, 'paket.zim', ['done', 'error'], 20000);
    expect(j.error).toBeNull();
    expect(j.status).toBe('done');
    expect((await fsp.readFile(path.join(data, 'paket.zim'))).equals(DATA)).toBe(true);
    flaky.closeAllConnections?.();
    await new Promise((r) => flaky.close(() => r(null)));
  });

  it('katalogda olmayan paket indirilemez', async () => {
    const fetcher = createFetcher({ dataDir: path.join(dir, 'e'), loadManifest: manifestWith(['https://x/zim/a.zim']) });
    const r = await fetcher.start('../../etc/passwd');
    expect(r.ok).toBe(false);
    expect(r.status).toBe(404);
  });

  it('iptal yarım dosyayı siler', async () => {
    const slow = await mirror({ delayMs: 50 });
    const data = path.join(dir, 'f');
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith([slow.url]), mirrors: () => [slow.url], probeMs: 3000 });
    await fetcher.start('paket.zim');
    await waitFor(fetcher, 'paket.zim', ['downloading']);
    await fetcher.cancel('paket.zim');
    for (let i = 0; i < 40 && fetcher.list().length; i++) await new Promise((r) => setTimeout(r, 50));
    expect(fetcher.list()).toEqual([]);
    expect(fs.existsSync(path.join(data, PART_DIR, 'paket.zim.part'))).toBe(false);
    await slow.close();
  });
});

describe('güncelleme', { timeout: 40000 }, () => {
  it('aynı adlı eski dosya, yeni sürüm inince yerine geçer', async () => {
    const m = await mirror();
    const data = path.join(dir, 'g');
    await fsp.mkdir(data, { recursive: true });
    await fsp.writeFile(path.join(data, 'paket.zim'), 'eski sürüm');
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith([m.url]), mirrors: () => [m.url], probeMs: 3000 });
    await fetcher.start('paket.zim');
    const j = await waitFor(fetcher, 'paket.zim', ['done', 'error']);
    expect(j.status).toBe('done');
    expect((await fsp.readFile(path.join(data, 'paket.zim'))).equals(DATA)).toBe(true);
    await m.close();
  });

  it('boyutu katalogla aynı dosya yeniden indirilmez', async () => {
    const data = path.join(dir, 'h');
    await fsp.mkdir(data, { recursive: true });
    await fsp.writeFile(path.join(data, 'paket.zim'), DATA);
    const fetcher = createFetcher({ dataDir: data, loadManifest: manifestWith(['http://127.0.0.1:9/yok.zim']) });
    const r = await fetcher.start('paket.zim');
    expect(r.job.status).toBe('done');
  });
});
