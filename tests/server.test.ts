import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { parseRange, safeJoin, startServer, unsafeSegment, type RunningServer } from '../server/server.mjs';
import net from 'node:net';

let srv: RunningServer;
let tmp: string;
let base: string;
const bytes = new Uint8Array(100_000).map((_, i) => (i * 7 + 3) & 255);

/** fetch yolu normalleştirir; ham istek için http.request */
function raw(p: string, baseUrl?: string): Promise<{ status: number; body: string }> {
  const port = baseUrl ? Number(new URL(baseUrl).port) : srv.port;
  return new Promise((res, rej) => {
    const req = http.request({ host: '127.0.0.1', port, path: p, method: 'GET' }, (r) => {
      let b = '';
      r.on('data', (c) => (b += c));
      r.on('end', () => res({ status: r.statusCode!, body: b }));
    });
    req.on('error', rej);
    req.end();
  });
}

beforeAll(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-srv-'));
  const data = path.join(tmp, 'data');
  const dist = path.join(tmp, 'dist');
  fs.mkdirSync(data);
  fs.mkdirSync(path.join(dist, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(data, 'test.zim'), bytes);
  fs.writeFileSync(path.join(data, 'harita.pmtiles'), new Uint8Array(10));
  fs.writeFileSync(path.join(data, 'notlar.txt'), 'gizli');
  fs.writeFileSync(path.join(data, 'yarim.gguf.part'), 'x');
  fs.writeFileSync(path.join(tmp, 'secret.zim'), 'gizli');
  fs.mkdirSync(path.join(data, 'models'));
  fs.writeFileSync(path.join(data, 'models', 'fener.gguf'), new Uint8Array(7));
  fs.mkdirSync(path.join(data, 'ses'));
  fs.writeFileSync(path.join(data, 'ses', 'whisper-base-ses.tar'), new Uint8Array(1024));
  fs.mkdirSync(path.join(data, '_gecici'));
  fs.writeFileSync(path.join(data, '_gecici', 'gizli.zim'), 'x');
  fs.writeFileSync(path.join(dist, 'index.html'), '<!doctype html><title>Akıl</title>');
  fs.writeFileSync(path.join(dist, 'assets', 'a.wasm'), new Uint8Array([0, 97, 115, 109]));
  fs.writeFileSync(path.join(dist, 'assets', 'app.js'), 'console.log(1)');
  srv = await startServer({ port: 0, host: '127.0.0.1', data, dist, apkDirs: [data] });
  base = `http://127.0.0.1:${srv.port}`;
});

afterAll(async () => {
  await srv?.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe('parseRange / safeJoin', () => {
  it('aralıkları çözer', () => {
    expect(parseRange(undefined, 100)).toBeNull();
    expect(parseRange('bytes=0-9', 100)).toEqual({ start: 0, end: 9 });
    expect(parseRange('bytes=90-', 100)).toEqual({ start: 90, end: 99 });
    expect(parseRange('bytes=-10', 100)).toEqual({ start: 90, end: 99 });
    expect(parseRange('bytes=50-500', 100)).toEqual({ start: 50, end: 99 });
    expect(parseRange('bytes=100-', 100)).toBe('invalid');
    expect(parseRange('bytes=9-1', 100)).toBe('invalid');
    expect(parseRange('bytes=0-1,5-6', 100)).toBeNull();
  });
  it('kök dışına çıkmayı engeller', () => {
    expect(safeJoin('/srv/data', 'a.zim')).toBe(path.resolve('/srv/data/a.zim'));
    expect(safeJoin('/srv/data', '../x')).toBeNull();
    expect(safeJoin('/srv/data', '..%2F..%2Fetc%2Fpasswd')).toBeNull();
    expect(safeJoin('/srv/data', 'a%00.zim')).toBeNull();
  });

  it('Windows yolları: ters bölü, sürücü, UNC, aygıt adları, akış ve sondaki nokta/boşluk', () => {
    const W = path.win32;
    const root = 'D:\\paketler\\data';
    expect(safeJoin(root, 'zim/a.zim', W)).toBe('D:\\paketler\\data\\zim\\a.zim');
    for (const bad of [
      '..\\..\\gizli.zim',
      '..%5C..%5Cgizli.zim',
      'zim%5C..%5C..%5Cgizli.zim',
      'C:%5CWindows%5Cwin.ini',
      'C:gizli.zim',
      '\\\\?\\C:\\gizli.zim',
      'CON',
      'nul.zim',
      'Com1.json',
      'LPT9.zim',
      'aux.tar',
      'zim/con.zim',
      'board.json.',
      'board.json%20',
      'board.json%2E',
      'x.zim::$DATA',
      'x.zim:gizli.zim',
      'a%00.zim',
    ])
      expect(safeJoin(root, bad, W), bad).toBeNull();
    // UNC biçimi kökün altına iner (dışarı çıkamaz)
    expect(safeJoin(root, '%5C%5Csunucu%5Cpay%5Cx.zim', W)).toBe('D:\\paketler\\data\\sunucu\\pay\\x.zim');
    expect(unsafeSegment('normal.zim')).toBe(false);
    expect(unsafeSegment('console.zim')).toBe(false);
  });
});

describe('bilgi noktası sunucusu', () => {
  it('Range isteğine 206 ve doğru baytlarla yanıt verir', async () => {
    const r = await fetch(base + '/data/test.zim', { headers: { Range: 'bytes=1000-1999' } });
    expect(r.status).toBe(206);
    expect(r.headers.get('content-range')).toBe(`bytes 1000-1999/${bytes.length}`);
    expect(r.headers.get('content-length')).toBe('1000');
    expect(r.headers.get('accept-ranges')).toBe('bytes');
    const got = new Uint8Array(await r.arrayBuffer());
    expect(Buffer.from(got).equals(Buffer.from(bytes.subarray(1000, 2000)))).toBe(true);
  });

  it('açık uçlu ve sondan aralıklar', async () => {
    const a = await fetch(base + '/data/test.zim', { headers: { Range: 'bytes=99990-' } });
    expect(a.status).toBe(206);
    expect(new Uint8Array(await a.arrayBuffer())).toEqual(bytes.subarray(99990));
    const b = await fetch(base + '/data/test.zim', { headers: { Range: 'bytes=-5' } });
    expect(b.headers.get('content-range')).toBe(`bytes ${bytes.length - 5}-${bytes.length - 1}/${bytes.length}`);
  });

  it('karşılanamayan aralığa 416', async () => {
    const r = await fetch(base + '/data/test.zim', { headers: { Range: `bytes=${bytes.length}-` } });
    expect(r.status).toBe(416);
    expect(r.headers.get('content-range')).toBe(`bytes */${bytes.length}`);
  });

  it('HEAD boyutu döndürür, gövde göndermez', async () => {
    const r = await fetch(base + '/data/test.zim', { method: 'HEAD' });
    expect(r.status).toBe(200);
    expect(r.headers.get('content-length')).toBe(String(bytes.length));
    expect(r.headers.get('content-type')).toBe('application/octet-stream');
    expect((await r.arrayBuffer()).byteLength).toBe(0);
  });

  it('tam dosya GET', async () => {
    const r = await fetch(base + '/data/test.zim');
    expect(r.status).toBe(200);
    expect(new Uint8Array(await r.arrayBuffer())).toEqual(bytes);
  });

  it('/api/packs yalnızca bilinen uzantıları listeler', async () => {
    const r = await fetch(base + '/api/packs');
    expect(r.headers.get('content-type')).toContain('application/json');
    const d = await r.json();
    expect(d.files).toEqual([
      { name: 'harita.pmtiles', size: 10, url: './data/harita.pmtiles' },
      { name: 'fener.gguf', size: 7, url: './data/models/fener.gguf' },
      { name: 'whisper-base-ses.tar', size: 1024, url: './data/ses/whisper-base-ses.tar' },
      { name: 'test.zim', size: bytes.length, url: './data/test.zim' },
    ]);
  });

  it('alt klasördeki paket indirilebilir', async () => {
    const r = await fetch(base + '/data/models/fener.gguf');
    expect(r.status).toBe(200);
    expect((await r.arrayBuffer()).byteLength).toBe(7);
  });

  it('data/ses/*.tar ses paketi Range ile indirilebilir', async () => {
    const r = await fetch(base + '/data/ses/whisper-base-ses.tar', { headers: { Range: 'bytes=512-' } });
    expect(r.status).toBe(206);
    expect(r.headers.get('content-range')).toBe('bytes 512-1023/1024');
    expect((await r.arrayBuffer()).byteLength).toBe(512);
  });

  it('/api/status biçimi', async () => {
    const d = await (await fetch(base + '/api/status')).json();
    expect(d.server).toBe(true);
    expect(d.name).toBe('Akıl Çantası Bilgi Noktası');
    expect(Array.isArray(d.addresses)).toBe(true);
    expect(d.port).toBe(srv.port);
    expect(typeof d.clients).toBe('number');
    expect(d.apk).toBe(false);
  });

  it('APK varsa durumda görünür ve indirilir', async () => {
    fs.writeFileSync(path.join(srv.dataDir, 'akil-cantasi.apk'), 'PK');
    const d = await (await fetch(base + '/api/status')).json();
    expect(d.apk).toBe(true);
    const r = await fetch(base + '/download/akil-cantasi.apk');
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('application/vnd.android.package-archive');
    expect(r.headers.get('content-disposition')).toContain('attachment');
  });

  it('dizin dışına çıkma engellenir', async () => {
    for (const p of ['/data/../secret.zim', '/data/..%2Fsecret.zim', '/data/%2e%2e/secret.zim', '/../secret.zim', '/data/..%5Csecret.zim']) {
      const r = await raw(p);
      expect(r.status, p).not.toBe(200);
      expect(r.body).not.toContain('gizli');
    }
    // bilinmeyen uzantı data/ altından sunulmaz
    expect((await raw('/data/notlar.txt')).status).not.toBe(200);
  });

  it('COOP/COEP/CORP ve CSP başlıkları tüm yanıtlarda', async () => {
    for (const p of ['/', '/api/status', '/data/test.zim', '/yok-boyle-bir-sey.js']) {
      const r = await fetch(base + p);
      expect(r.headers.get('content-security-policy'), p).toContain("script-src 'self' 'wasm-unsafe-eval'");
      expect(r.headers.get('cross-origin-opener-policy'), p).toBe('same-origin');
      expect(r.headers.get('cross-origin-embedder-policy'), p).toBe('require-corp');
      expect(r.headers.get('cross-origin-resource-policy'), p).toBe('cross-origin');
    }
  });

  it('MIME türleri (wasm) ve SPA geri dönüşü', async () => {
    const w = await fetch(base + '/assets/a.wasm');
    expect(w.headers.get('content-type')).toBe('application/wasm');
    const js = await fetch(base + '/assets/app.js');
    expect(js.headers.get('content-type')).toContain('text/javascript');
    const spa = await fetch(base + '/harita/istanbul');
    expect(spa.status).toBe(200);
    expect(await spa.text()).toContain('Akıl');
    expect((await fetch(base + '/yok.js')).status).toBe(404);
  });

  it('data/packs-manifest.json varsa onu sunar', async () => {
    fs.writeFileSync(path.join(srv.dataDir, 'packs-manifest.json'), '{"version":9}');
    const d = await (await fetch(base + '/packs-manifest.json')).json();
    expect(d.version).toBe(9);
  });

  it('OPTIONS ön isteği', async () => {
    const r = await fetch(base + '/data/test.zim', { method: 'OPTIONS' });
    expect(r.status).toBe(204);
    expect(r.headers.get('access-control-allow-headers')).toContain('Range');
  });
});

describe('mesaj panosu /api/board', () => {
  let bsrv: RunningServer;
  let bdir: string;
  let bbase: string;
  const post = (body: unknown, headers: Record<string, string> = { 'Content-Type': 'application/json' }) =>
    fetch(bbase + '/api/board', { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });

  beforeAll(async () => {
    bdir = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-board-'));
    bsrv = await startServer({ port: 0, host: '127.0.0.1', data: bdir, dist: bdir, apkDirs: [bdir], board: { maxItems: 5, ratePerMin: 40 } });
    bbase = `http://127.0.0.1:${bsrv.port}`;
  });
  afterAll(async () => {
    await bsrv?.close();
    fs.rmSync(bdir, { recursive: true, force: true });
  });

  it('boş pano', async () => {
    const r = await fetch(bbase + '/api/board');
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toContain('application/json');
    expect(r.headers.get('cross-origin-opener-policy')).toBe('same-origin');
    expect(r.headers.get('cross-origin-embedder-policy')).toBe('require-corp');
    expect(r.headers.get('content-security-policy')).toContain("default-src 'self'");
    expect(r.headers.get('access-control-allow-origin')).toBe('*');
    const d = await r.json();
    expect(d.items).toEqual([]);
    expect(typeof d.now).toBe('number');
  });

  it('kayıt ekler, temizler, tekilleştirir ve since ile süzer', async () => {
    const t0 = Date.now() - 1;
    const r = await post({ id: 'abc123-1', kind: 'mesaj', from: ' Ayşe\u0007 ', text: 'Merhaba‮ <b>x</b>\r\nikinci', lat: 39.923456789, lon: 32.85 });
    expect(r.status).toBe(201);
    const { item } = await r.json();
    expect(item.from).toBe('Ayşe');
    expect(item.text).toBe('Merhaba <b>x</b>\nikinci');
    expect(item.lat).toBe(39.92346);
    expect(item.local).toBe(true); // loopback = bilgi noktası cihazının kendisi
    expect(item.time).toBeGreaterThanOrEqual(t0);
    const dup = await post({ id: 'abc123-1', kind: 'mesaj', from: 'Başka', text: 'değişti' });
    expect(dup.status).toBe(200);
    const dd = await dup.json();
    expect(dd.duplicate).toBe(true);
    expect(dd.item.text).toBe('Merhaba <b>x</b>\nikinci');
    const all = await (await fetch(bbase + '/api/board')).json();
    expect(all.items).toHaveLength(1);
    const later = await (await fetch(bbase + '/api/board?since=' + item.rev)).json();
    expect(later.items).toHaveLength(0);
  });

  it('geçersiz kayıtları reddeder', async () => {
    const bad = [
      { id: 'x', kind: 'mesaj', from: 'A', text: 'kısa kimlik' },
      { id: 'abcdef-2', kind: 'spam', from: 'A', text: 't' },
      { id: 'abcdef-3', kind: 'mesaj', from: '', text: 't' },
      { id: 'abcdef-4', kind: 'mesaj', from: 'A', text: '' },
      { id: 'abcdef-5', kind: 'iyiyim', from: 'A', text: '', status: 'harika' },
      { id: 'abcdef-6', kind: 'mesaj', from: 'A', text: 't', lat: 200, lon: 0 },
      { id: 'abcdef-7', kind: 'mesaj', from: 'A', text: 't', status: 'bulundu' },
      [1, 2],
    ];
    for (const b of bad) {
      const r = await post(b);
      expect(r.status, JSON.stringify(b)).toBe(400);
      expect((await r.json()).error).toBeTruthy();
    }
    expect((await post('{bozuk')).status).toBe(400);
    expect((await post({ id: 'abcdef-8', kind: 'mesaj', from: 'A', text: 't' }, { 'Content-Type': 'text/plain' })).status).toBe(415);
    expect((await post({ id: 'abcdef-9', kind: 'mesaj', from: 'A', text: 'x'.repeat(5000) })).status).toBe(413);
  });

  it('uzun metni kısaltır; kayıp ilanı bulundu olarak işaretlenir', async () => {
    const long = await post({ id: 'uzun-01', kind: 'mesaj', from: 'B'.repeat(80), text: 'ç'.repeat(900) });
    const li = (await long.json()).item;
    expect(Array.from(li.from)).toHaveLength(40);
    expect(Array.from(li.text)).toHaveLength(600);
    const k = await post({ id: 'kayip-01', kind: 'kayip', from: 'C', text: 'Ad: Ali' });
    const ki = (await k.json()).item;
    expect(ki.status).toBe('araniyor');
    const f = await post({ id: 'kayip-01', kind: 'kayip', from: 'D', text: 'farklı', status: 'bulundu' });
    expect(f.status).toBe(200);
    const fi = (await f.json()).item;
    expect(fi.status).toBe('bulundu');
    expect(fi.text).toBe('Ad: Ali');
    expect(fi.rev).toBeGreaterThan(ki.rev);
    const since = await (await fetch(bbase + '/api/board?since=' + ki.rev)).json();
    expect(since.items.map((i: any) => i.id)).toEqual(['kayip-01']);
  });

  it('toplam kayıt sayısı sınırlı (en eskiler düşer) ve board.json paket sayılmaz', async () => {
    for (let i = 0; i < 4; i++) expect((await post({ id: 'dolu-0' + i, kind: 'duyuru', from: 'E', text: 'd' + i })).status).toBe(201);
    const d = await (await fetch(bbase + '/api/board')).json();
    expect(d.items).toHaveLength(5);
    expect(d.items.map((i: any) => i.id)).not.toContain('abc123-1');
    await bsrv.close();
    bsrv = await startServer({ port: 0, host: '127.0.0.1', data: bdir, dist: bdir, apkDirs: [bdir], board: { maxItems: 5, ratePerMin: 40 } });
    bbase = `http://127.0.0.1:${bsrv.port}`;
    expect(fs.existsSync(path.join(bdir, 'board.json'))).toBe(true);
    const again = await (await fetch(bbase + '/api/board')).json();
    expect(again.items).toHaveLength(5);
    const packs = await (await fetch(bbase + '/api/packs')).json();
    expect(packs.files.map((f: any) => f.name)).not.toContain('board.json');
    expect((await fetch(bbase + '/data/board.json')).status).toBe(404);
    // Kodlanmış ya da çift eğik çizgili yollarla da board.json okunamaz
    expect((await raw('/data/board%2Ejson', bbase)).status).toBe(404);
    expect((await raw('/data//board.json', bbase)).status).toBe(404);
  });

  it('IP başına hız sınırı (429) ve CORS ön isteği', async () => {
    let got429 = false;
    for (let i = 0; i < 50 && !got429; i++) {
      const r = await post({ id: 'hiz-' + String(i).padStart(3, '0'), kind: 'mesaj', from: 'F', text: 'h' });
      if (r.status === 429) {
        got429 = true;
        expect(Number(r.headers.get('retry-after'))).toBeGreaterThan(0);
      }
    }
    expect(got429).toBe(true);
    const o = await fetch(bbase + '/api/board', { method: 'OPTIONS' });
    expect(o.status).toBe(204);
    expect(o.headers.get('access-control-allow-methods')).toContain('POST');
    expect(o.headers.get('access-control-allow-headers')).toContain('Content-Type');
    expect((await fetch(bbase + '/api/board', { method: 'DELETE' })).status).toBe(405);
    // diğer yollarda POST hâlâ yasak
    expect((await fetch(bbase + '/api/status', { method: 'POST' })).status).toBe(405);
  });
});

describe('güvenlik sertleştirmesi', () => {
  let s: RunningServer;
  let dir: string;
  let b: string;
  const post = (p: string, body: unknown, headers: Record<string, string> = { 'Content-Type': 'application/json' }) =>
    fetch(b + p, { method: 'POST', headers, body: JSON.stringify(body) });
  const istek = (p: string, headers: Record<string, string>, method = 'GET', body?: string): Promise<{ status: number; body: string }> =>
    new Promise((res, rej) => {
      const req = http.request({ host: '127.0.0.1', port: s.port, path: p, method, headers }, (r) => {
        let t = '';
        r.on('data', (c) => (t += c));
        r.on('end', () => res({ status: r.statusCode!, body: t }));
      });
      req.on('error', rej);
      req.end(body);
    });

  beforeAll(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-guv-'));
    fs.writeFileSync(path.join(dir, '.gizli.json'), '{}');
    fs.mkdirSync(path.join(dir, 'a', 'b'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'a', 'b', 'derin.zim'), 'x');
    fs.mkdirSync(path.join(dir, '.gizlidizin'));
    fs.writeFileSync(path.join(dir, '.gizlidizin', 'x.zim'), 'x');
    fs.mkdirSync(path.join(dir, '_ozel'));
    fs.writeFileSync(path.join(dir, '_ozel', 'y.zim'), 'x');
    s = await startServer({ port: 0, host: '127.0.0.1', data: dir, dist: dir, apkDirs: [dir], board: { maxItems: 3, ratePerMin: 100 } });
    b = `http://127.0.0.1:${s.port}`;
  });
  afterAll(async () => {
    await s?.close();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('yabancı alan adıyla gelen istek (DNS yeniden bağlama) reddedilir', async () => {
    expect((await istek('/api/status', { Host: 'kotu.example' })).status).toBe(421);
    expect((await istek('/api/status', { Host: `127.0.0.1:${s.port}` })).status).toBe(200);
    expect((await istek('/api/status', { Host: `192.168.43.1:${s.port}` })).status).toBe(200);
    expect((await istek('/api/status', { Host: `localhost:${s.port}` })).status).toBe(200);
  });

  it('başka sitenin gönderdiği pano kaydı "bilgi noktasından" sayılmaz', async () => {
    const r = await post('/api/board', { id: 'guv000-1', kind: 'duyuru', from: 'Sahte', text: 'Tahliye' }, { 'Content-Type': 'application/json', Origin: 'https://kotu.example' });
    expect((await r.json()).item.local).toBeUndefined();
    const k = await post('/api/board', { id: 'guv000-2', kind: 'duyuru', from: 'Nokta', text: 'Su dağıtımı' }, { 'Content-Type': 'application/json', Origin: b });
    expect((await k.json()).item.local).toBe(true);
  });

  it('indirme denetimi: düz metin ve başka köken reddedilir', async () => {
    const duz = await istek('/api/fetch', { 'Content-Type': 'text/plain', Host: `127.0.0.1:${s.port}` }, 'POST', '{"action":"cancel","file":"x.zim"}');
    expect(duz.status).toBe(415);
    const yabanci = await istek('/api/fetch', { 'Content-Type': 'application/json', Origin: 'https://kotu.example', Host: `127.0.0.1:${s.port}` }, 'POST', '{"action":"cancel","file":"x.zim"}');
    expect(yabanci.status).toBe(403);
  });

  it('gizli dosya ve derin klasör sunulmaz', async () => {
    expect((await fetch(b + '/data/.gizli.json')).status).not.toBe(200);
    expect((await fetch(b + '/data/a/b/derin.zim')).status).not.toBe(200);
  });

  it('kodlanmış yol parçalarıyla gizli/_ klasör ve derinlik denetimi atlatılamaz', async () => {
    for (const p of [
      '/data/%2Egizlidizin/x.zim',
      '/data/%2egizlidizin/x.zim',
      '/data/%5Fozel/y.zim',
      '/data/a%2Fb%2Fderin.zim',
      '/data/a%2Fb/derin.zim',
      '/data/board%2Ejson',
      '/data/CON.json',
      '/data/x.zim%3A%3A%24DATA',
    ]) {
      const r = await istek(p, { Host: `127.0.0.1:${s.port}` });
      expect(r.status, p).not.toBe(200);
    }
  });

  /** Ham soket: gövde sınırını aşan istek 413 alır ve sunucu bağlantıyı kapatır */
  const hamIstek = (head: string, chunks: string[]): Promise<{ text: string; closed: boolean }> =>
    new Promise((res, rej) => {
      const so = net.connect(s.port, '127.0.0.1');
      let text = '';
      const t = setTimeout(() => {
        so.destroy();
        res({ text, closed: false });
      }, 4000);
      so.on('data', (d) => (text += d));
      so.on('error', () => {});
      so.on('close', () => {
        clearTimeout(t);
        res({ text, closed: true });
      });
      so.on('connect', () => {
        so.write(head);
        for (const c of chunks) so.write(c);
      });
      so.on('timeout', rej);
    });

  it('büyük gövde: Content-Length sınırı aşıyorsa okunmadan 413 ve bağlantı kapanır', async () => {
    const r = await hamIstek(
      `POST /api/board HTTP/1.1\r\nHost: 127.0.0.1:${s.port}\r\nContent-Type: application/json\r\nContent-Length: 100000000\r\n\r\n`,
      ['{"id":'],
    );
    expect(r.text).toMatch(/^HTTP\/1\.1 413/);
    expect(r.text.toLowerCase()).toContain('connection: close');
    expect(r.closed).toBe(true);
  });

  it('büyük gövde: parça parça (chunked) gönderilen fazla veri 413 ve bağlantı kapanır', async () => {
    const parca = 'x'.repeat(3000);
    const chunk = `${parca.length.toString(16)}\r\n${parca}\r\n`;
    const r = await hamIstek(
      `POST /api/board HTTP/1.1\r\nHost: 127.0.0.1:${s.port}\r\nContent-Type: application/json\r\nTransfer-Encoding: chunked\r\n\r\n`,
      [chunk, chunk, chunk],
    );
    expect(r.text).toMatch(/^HTTP\/1\.1 413/);
    expect(r.closed).toBe(true);
  });

  it('indirme ucu: büyük gövde 400 değil 413', async () => {
    const r = await istek('/api/fetch', { 'Content-Type': 'application/json', Host: `127.0.0.1:${s.port}` }, 'POST', JSON.stringify({ action: 'cancel', file: 'x'.repeat(5000) }));
    expect(r.status).toBe(413);
  });

  it('pano dolunca önce sıradan kayıtlar silinir; kayıp ilanı kalır', async () => {
    await post('/api/board', { id: 'kayip0-1', kind: 'kayip', from: 'Ayşe', text: 'Mehmet aranıyor', status: 'araniyor' }, { 'Content-Type': 'application/json', Origin: 'https://kotu.example' });
    for (let i = 0; i < 6; i++) await post('/api/board', { id: `spam00-${i}`, kind: 'mesaj', from: 'X', text: 'dolgu ' + i }, { 'Content-Type': 'application/json', Origin: 'https://kotu.example' });
    const ids = (await (await fetch(b + '/api/board')).json()).items.map((i: any) => i.id);
    expect(ids).toContain('kayip0-1');
    expect(ids).toHaveLength(3);
  });

  it('kayıtlar eskiden yeniye gelir', async () => {
    const it = (await (await fetch(b + '/api/board')).json()).items;
    for (let i = 1; i < it.length; i++) expect(it[i].rev).toBeGreaterThan(it[i - 1].rev);
  });

  it('500 yanıtı iç ayrıntı sızdırmaz', async () => {
    // Yol çözümünde hata çıkaran bozuk kodlama
    const r = await istek('/%E0%A4%A', { Host: `127.0.0.1:${s.port}` });
    expect(r.body).not.toMatch(/\/tmp|Error:|at /);
  });
});
