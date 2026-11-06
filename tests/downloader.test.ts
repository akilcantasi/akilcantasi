import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createSHA256 } from 'hash-wasm';
import {
  DownloadError,
  MemoryStore,
  buildRangeHeader,
  mirrorOrder,
  parseContentRange,
  planResponse,
  runDownload,
  type Hasher,
} from '../src/lib/download-core';
import { startServer, type RunningServer } from '../server/server.mjs';

const H = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null });

async function createHasher(): Promise<Hasher> {
  const h = await createSHA256();
  h.init();
  return { update: (d) => void h.update(d), digest: () => h.digest('hex') };
}

describe('saf yardımcılar', () => {
  it('Range başlığı', () => {
    expect(buildRangeHeader(0)).toEqual({});
    expect(buildRangeHeader(1234)).toEqual({ Range: 'bytes=1234-' });
  });
  it('Content-Range çözümü', () => {
    expect(parseContentRange('bytes 100-199/1000')).toEqual({ start: 100, end: 199, total: 1000 });
    expect(parseContentRange('bytes 0-9/*')).toEqual({ start: 0, end: 9, total: 0 });
    expect(parseContentRange('garip')).toBeNull();
  });
  it('yanıt planı', () => {
    expect(planResponse(206, H({ 'content-range': 'bytes 10-99/100' }), 10)).toEqual({ action: 'append', total: 100 });
    expect(planResponse(206, H({ 'content-range': 'bytes 0-99/100' }), 10).action).toBe('fail');
    expect(planResponse(200, H({ 'content-length': '100' }), 0)).toEqual({ action: 'append', total: 100 });
    expect(planResponse(200, H({ 'content-length': '100' }), 50)).toEqual({ action: 'restart', total: 100 });
    expect(planResponse(416, H({ 'content-range': 'bytes */100' }), 100)).toEqual({ action: 'complete', total: 100 });
    expect(planResponse(416, H({ 'content-range': 'bytes */80' }), 100)).toEqual({ action: 'retry-from-zero' });
    expect(planResponse(404, H({}), 0)).toEqual({ action: 'fail', reason: 'HTTP 404' });
    // Range'siz istekte 416: baştan yeniden denemek sonsuz döngü olurdu
    expect(planResponse(416, H({}), 0)).toEqual({ action: 'fail', reason: 'HTTP 416' });
  });
  it('ayna sırası', () => {
    expect(mirrorOrder(3, 0)).toEqual([0, 1, 2]);
    expect(mirrorOrder(3, 2)).toEqual([2, 0, 1]);
    expect(mirrorOrder(3, 7)).toEqual([1, 2, 0]);
    expect(mirrorOrder(0, 0)).toEqual([]);
  });
});

describe('runDownload (gerçek sunucuya karşı)', () => {
  let srv: RunningServer;
  let tmp: string;
  let base: string;
  const data = crypto.randomBytes(3 * 1024 * 1024 + 123);
  const sha = crypto.createHash('sha256').update(data).digest('hex');
  const ranges: (string | undefined)[] = [];

  beforeAll(async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-dl-'));
    fs.writeFileSync(path.join(tmp, 'paket.zim'), data);
    srv = await startServer({
      port: 0,
      host: '127.0.0.1',
      data: tmp,
      dist: tmp,
      onRequest: (req) => {
        if (req.url?.startsWith('/data/')) ranges.push(req.headers.range as string | undefined);
      },
    });
    base = `http://127.0.0.1:${srv.port}`;
  });
  afterAll(async () => {
    await srv?.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('baştan indirir ve SHA-256 doğrular', async () => {
    const store = new MemoryStore();
    const r = await runDownload({ urls: [base + '/data/paket.zim'], store, sha256: sha, createHasher, chunkBytes: 256 * 1024 });
    expect(r.sha256).toBe(sha);
    expect(store.finalized).toBe(true);
    expect(Buffer.from(store.bytes()).equals(data)).toBe(true);
  });

  it('erişilemeyen aynayı atlayıp sıradakini kullanır', async () => {
    const store = new MemoryStore();
    const r = await runDownload({
      urls: ['http://127.0.0.1:9/yok.zim', base + '/data/olmayan.zim', base + '/data/paket.zim'],
      store,
      sha256: sha,
      createHasher,
      passes: 1,
    });
    expect(r.mirror).toBe(2);
    expect(store.finalized).toBe(true);
  });

  it('hiçbir ayna çalışmazsa hata', async () => {
    const store = new MemoryStore();
    await expect(runDownload({ urls: ['http://127.0.0.1:9/a', base + '/data/yok.zim'], store, passes: 1 })).rejects.toBeInstanceOf(DownloadError);
    expect(store.finalized).toBe(false);
  });

  it('yarım parçadan Range ile devam eder ve özeti baştan kurar', async () => {
    const store = new MemoryStore();
    const half = 1_500_000;
    await store.write(0, new Uint8Array(data.subarray(0, half)));
    ranges.length = 0;
    const phases = new Set<string>();
    const r = await runDownload({ urls: [base + '/data/paket.zim'], store, sha256: sha, createHasher, onProgress: (p) => phases.add(p.phase) });
    expect(ranges).toEqual([`bytes=${half}-`]);
    expect(phases.has('hashing')).toBe(true);
    expect(r.sha256).toBe(sha);
    expect(Buffer.from(store.bytes()).equals(data)).toBe(true);
  });

  it('takılan bağlantıyı algılar ve kaldığı yerden yeniden bağlanır', async () => {
    const store = new MemoryStore();
    const src = new Uint8Array(300_000).map((_, i) => i % 251);
    const calls: string[] = [];
    const fakeFetch = (async (_u: string, init: any) => {
      const range = init?.headers?.Range ?? '';
      calls.push(range);
      const start = range ? Number(/bytes=(\d+)-/.exec(range)![1]) : 0;
      const first = calls.length === 1;
      const body = new ReadableStream<Uint8Array>({
        start(c) {
          c.enqueue(src.subarray(start, first ? 100_000 : src.length));
          if (!first) c.close(); // ilk bağlantı 100 KB'den sonra sessizce takılır
        },
      });
      const headers = new Headers(start ? { 'content-range': `bytes ${start}-${src.length - 1}/${src.length}`, 'content-length': String(src.length - start) } : { 'content-length': String(src.length) });
      return new Response(body, { status: start ? 206 : 200, headers });
    }) as unknown as typeof fetch;
    const r = await runDownload({ urls: ['https://ornek/paket.zim'], store, fetch: fakeFetch, stallMs: 150, chunkBytes: 32 * 1024 });
    expect(r.size).toBe(src.length);
    expect(calls).toEqual(['', 'bytes=100000-']);
    expect(Buffer.from(store.bytes()).equals(Buffer.from(src))).toBe(true);
  });

  it('iptal edilince durur, sonra kaldığı yerden sürer', async () => {
    const store = new MemoryStore();
    const ctrl = new AbortController();
    const p = runDownload({
      urls: [base + '/data/paket.zim'],
      store,
      sha256: sha,
      createHasher,
      chunkBytes: 64 * 1024,
      progressMs: 0,
      signal: ctrl.signal,
      onProgress: (pr) => {
        if (pr.received > 500_000) ctrl.abort();
      },
    });
    await expect(p).rejects.toMatchObject({ code: 'aborted' });
    const got = await store.size();
    expect(got).toBeGreaterThan(0);
    expect(got).toBeLessThan(data.length);
    ranges.length = 0;
    const r = await runDownload({ urls: [base + '/data/paket.zim'], store, sha256: sha, createHasher });
    expect(ranges[0]).toBe(`bytes=${got}-`);
    expect(r.sha256).toBe(sha);
  });

  it('SHA-256 uyuşmazsa parçayı siler ve hata verir', async () => {
    const store = new MemoryStore();
    await expect(runDownload({ urls: [base + '/data/paket.zim'], store, sha256: '0'.repeat(64), createHasher })).rejects.toMatchObject({ code: 'hash' });
    expect(store.removed).toBe(true);
    expect(store.finalized).toBe(false);
  });

  it('parça zaten tamsa (416) yeniden indirmeden bitirir', async () => {
    const store = new MemoryStore();
    await store.write(0, new Uint8Array(data));
    const r = await runDownload({ urls: [base + '/data/paket.zim'], store, sha256: sha, createHasher });
    expect(r.size).toBe(data.length);
    expect(store.finalized).toBe(true);
  });

  it('kesin boyut farklıysa reddeder', async () => {
    const store = new MemoryStore();
    await expect(runDownload({ urls: [base + '/data/paket.zim'], store, expectedSize: 10, passes: 1 })).rejects.toBeInstanceOf(DownloadError);
  });

  it('Range desteklemeyen sunucuda (200) baştan başlar', async () => {
    const store = new MemoryStore();
    await store.write(0, new Uint8Array(1000).fill(9)); // bozuk parça
    const noRange: typeof fetch = (u, init) => fetch(u, { ...init, headers: {} });
    const r = await runDownload({ urls: [base + '/data/paket.zim'], store, sha256: sha, createHasher, fetch: noRange });
    expect(r.sha256).toBe(sha);
    expect(Buffer.from(store.bytes()).equals(data)).toBe(true);
  });

  it('özet varken doğrulayıcı yoksa başlamaz (sessizce doğrulamasız inmez)', async () => {
    const store = new MemoryStore();
    await expect(runDownload({ urls: [base + '/data/paket.zim'], store, sha256: sha })).rejects.toMatchObject({ code: 'hash' });
    expect(store.len).toBe(0);
  });

  it('beklenen boyuttan fazla veri gönderen ayna diski dolduramaz; yarım dosya silinir', async () => {
    const store = new MemoryStore();
    // Boyut bilgisi vermeden sonsuz veri akıtan ayna
    let sent = 0;
    const flood: typeof fetch = async () =>
      new Response(
        new ReadableStream<Uint8Array>({
          pull(c) {
            sent += 65536;
            c.enqueue(new Uint8Array(65536));
            if (sent > 64 * 1024 * 1024) c.close();
          },
        }),
        { status: 200 },
      );
    await expect(runDownload({ urls: ['https://ayna.example/x.zim'], store, expectedSize: 1_000_000, fetch: flood, passes: 1, chunkBytes: 256 * 1024 })).rejects.toMatchObject({ code: 'size' });
    expect(sent).toBeLessThan(4 * 1024 * 1024);
    expect(store.removed).toBe(true);
  });
});
