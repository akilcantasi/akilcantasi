// Bilgi noktası sunucusunun paketi kendisi indirmesi (tarayıcı yerine), uçtan uca.
//   npm run build && node e2e/sunucu-indirme-check.mjs
// Yerel bir sahte "ayna" açılır; katalogda yalnız o adres vardır. Uygulama sunucudan açılır,
// Araçlar → Paketler'de İndir'e basılır; dosyanın sunucunun data/ klasörüne indiği,
// ilerlemenin "bilgi noktası indiriyor" olarak göründüğü ve sonunda paketin hazır olduğu denetlenir.
import { createRequire } from 'module';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require('playwright');
} catch {
  pw = require('/opt/npm-tools/node_modules/playwright');
}

let fails = 0;
const check = (ok, msg) => {
  console.log((ok ? 'ok   ' : 'FAIL ') + msg);
  if (!ok) fails++;
};

const SIZE = 48 * 1024 * 1024;
const DATA = crypto.randomBytes(SIZE);
const SHA = crypto.createHash('sha256').update(DATA).digest('hex');

// Yavaşça (bağlantı başına ≈2 MB/sn) veren sahte ayna; ilerleme ekranda görülebilsin
const mirror = http.createServer(async (req, res) => {
  const r = /bytes=(\d+)-(\d*)/.exec(req.headers.range ?? '');
  const start = r ? Number(r[1]) : 0;
  const end = r && r[2] ? Math.min(Number(r[2]), SIZE - 1) : SIZE - 1;
  res.writeHead(r ? 206 : 200, { 'Content-Length': end - start + 1, ...(r ? { 'Content-Range': `bytes ${start}-${end}/${SIZE}` } : {}), 'Accept-Ranges': 'bytes' });
  for (let p = start; p <= end && !res.destroyed; p += 256 * 1024) {
    res.write(DATA.subarray(p, Math.min(end + 1, p + 256 * 1024)));
    await new Promise((x) => setTimeout(x, 120));
  }
  res.end();
});
await new Promise((r) => mirror.listen(0, '127.0.0.1', r));
const mirrorUrl = `http://127.0.0.1:${mirror.address().port}/zim/test/paket-test.zim`;

const dataDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'akil-sunucu-'));
await fsp.writeFile(
  path.join(dataDir, 'packs-manifest.json'),
  JSON.stringify({
    version: 1,
    updated: '2026-11-01',
    packs: [{ id: 'paket-test', kind: 'zim', name: 'Deneme paketi', desc: 'Sunucu indirme denemesi', file: 'paket-test.zim', size: SIZE, sha256: SHA, tier: 'temel', urls: [mirrorUrl], license: 'test', source: 'test', shelf: 'ansiklopedi', featured: true }],
  }),
);
const srv = await startServer({ data: dataDir, port: 0, host: '127.0.0.1', quiet: true });
const base = `http://localhost:${srv.port}/`;

const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto(base + '?tool=paylas', { waitUntil: 'networkidle' });
const row = '[data-testid="pack-row"][data-pack="paket-test.zim"]';
await p.waitForSelector(row + ' [data-testid="pack-download"]', { timeout: 20000 });
await p.click(row + ' [data-testid="pack-download"]');
await p.waitForSelector(row + ' [data-testid="pack-progress"]', { timeout: 15000 });
let sawRemote = false;
let sawSpeed = false;
for (let i = 0; i < 120; i++) {
  const t = (await p.textContent(row).catch(() => '')) ?? '';
  if (/bilgi noktası indiriyor/.test(t)) sawRemote = true;
  if (/MB\/sn|KB\/sn/.test(t) && /kaldı/.test(t)) sawSpeed = true;
  if ((await p.getAttribute(row, 'data-state')) === 'ready') break;
  await p.waitForTimeout(250);
}
check(sawRemote, 'ilerleme "bilgi noktası indiriyor" olarak göründü');
check(sawSpeed, 'hız ve kalan süre gösterildi');
check((await p.getAttribute(row, 'data-state')) === 'ready', 'paket hazır');
check(/bilgi noktasında/.test((await p.textContent(row)) ?? ''), 'satırda "Hazır · bilgi noktasında"');
const out = path.join(dataDir, 'paket-test.zim');
check(fs.existsSync(out) && (await fsp.readFile(out)).equals(DATA), 'dosya sunucunun data/ klasöründe ve içeriği doğru');
check(!fs.existsSync(path.join(dataDir, '_indiriliyor', 'paket-test.zim.part')), 'yarım dosya kalmadı');
const packs = await (await fetch(base + 'api/packs')).json();
check(packs.files.some((f) => f.name === 'paket-test.zim'), '/api/packs yeni paketi listeliyor');
check(errors.length === 0, 'sayfa hatası yok ' + errors.join(' | '));

await b.close();
await srv.close();
mirror.closeAllConnections?.();
mirror.close();
await fsp.rm(dataDir, { recursive: true, force: true });
console.log(fails ? fails + ' HATA' : 'hepsi geçti');
process.exit(fails ? 1 : 0);
