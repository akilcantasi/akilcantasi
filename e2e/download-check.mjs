// Uçtan uca indirme denetimi (gerçek tarayıcı + server/server.mjs):
//  A) Uygulama sunucusu: dist/ + data/packs-manifest.json (sahte katalog)
//  B) "Uzak" paket sunucusu (farklı köken → CORS/CORP denenir): 30 MB rastgele dosya
//  C) Yavaşlatılmış paket sunucusu: indirme yarıda sayfa yeniden yüklenir, sonra devam
// Kullanım: node e2e/download-check.mjs [--dist <klasör>] [--headed]
import { createRequire } from 'module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require('playwright');
} catch {
  pw = require('/opt/npm-tools/node_modules/playwright');
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const distArg = argv.includes('--dist') ? argv[argv.indexOf('--dist') + 1] : path.join(ROOT, 'dist');
const headed = argv.includes('--headed');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-e2e-dl-'));
const dirs = { app: path.join(tmp, 'app'), remote: path.join(tmp, 'remote'), slow: path.join(tmp, 'slow') };
Object.values(dirs).forEach((d) => fs.mkdirSync(d));

function makeFile(dir, name, size) {
  const buf = crypto.randomBytes(size);
  fs.writeFileSync(path.join(dir, name), buf);
  return crypto.createHash('sha256').update(buf).digest('hex');
}
const A_SIZE = 30 * 1024 * 1024;
const B_SIZE = 40 * 1024 * 1024;
const shaA = makeFile(dirs.remote, 'e2e-a.zim', A_SIZE);
const shaB = makeFile(dirs.slow, 'e2e-b.zim', B_SIZE);

const slowRanges = [];
const remote = await startServer({ port: 0, host: '127.0.0.1', data: dirs.remote, dist: dirs.remote });
const slow = await startServer({
  port: 0,
  host: '127.0.0.1',
  data: dirs.slow,
  dist: dirs.slow,
  throttleBps: 8 * 1024 * 1024,
  onRequest: (req) => req.url?.startsWith('/data/') && req.method === 'GET' && slowRanges.push(req.headers.range ?? '(yok)'),
});

const entry = (id, file, size, sha, urls) => ({
  id,
  kind: 'zim',
  name: 'E2E ' + id,
  desc: 'deneme paketi',
  file,
  size,
  sha256: sha,
  tier: 'temel',
  urls,
  license: 'CC0',
  source: 'e2e',
});
fs.writeFileSync(
  path.join(dirs.app, 'packs-manifest.json'),
  JSON.stringify({
    version: 99,
    updated: '2099-01-01',
    packs: [
      // ilk ayna erişilemez → yedeğe geçmeli
      entry('e2e-a', 'e2e-a.zim', A_SIZE, shaA, ['http://127.0.0.1:9/e2e-a.zim', `http://127.0.0.1:${remote.port}/data/e2e-a.zim`]),
      entry('e2e-b', 'e2e-b.zim', B_SIZE, shaB, [`http://127.0.0.1:${slow.port}/data/e2e-b.zim`]),
    ],
  }),
);
const app = await startServer({ port: 0, host: '127.0.0.1', data: dirs.app, dist: distArg });
const url = `http://localhost:${app.port}/`;

const results = [];
const ok = (name, cond, extra = '') => {
  results.push({ name, ok: !!cond });
  console.log(`${cond ? 'GEÇTİ ' : 'KALDI '} ${name}${extra ? ' — ' + extra : ''}`);
};

const browser = await pw.chromium.launch({ headless: !headed });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && process.env.E2E_DEBUG) console.log('[konsol]', m.text()); });

// Paketler artık Araçlar → "Paketler ve paylaşım" aracında (?tool=paylas)
const openPacks = async () => {
  await page.click('[data-testid="nav-araclar"]');
  const el = await page.waitForSelector('[data-testid="tool-card-paylas"], [data-testid="tool-paylas"]');
  if ((await el.getAttribute('data-testid')) === 'tool-card-paylas') await el.click();
  await page.waitForSelector('[data-testid="tool-paylas"]');
};
const row = (file) => page.locator(`[data-testid="pack-row"][data-pack="${file}"]`);
const opfsSha = (file) =>
  page.evaluate(async (f) => {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('packs');
    const names = [];
    for await (const [n] of dir.entries()) names.push(n);
    try {
      const file = await (await dir.getFileHandle(f)).getFile();
      const d = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      return { names, size: file.size, sha: [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('') };
    } catch (e) {
      return { names, size: -1, sha: '' };
    }
  }, file);

try {
  // Bu denetim tarayıcı indiricisini sınar; sunucu tarafı indirme e2e/sunucu-indirme-check.mjs'te
  await page.goto(url + (url.includes('?') ? '&' : '?') + 'browserdl=1', { waitUntil: 'networkidle' });
  ok('uygulama crossOriginIsolated', await page.evaluate(() => self.crossOriginIsolated));
  await openPacks();
  await row('e2e-a.zim').waitFor({ timeout: 10000 });
  ok('bilgi noktası durumu "açık"', (await page.textContent('[data-testid="share-status"]'))?.includes('açık'));
  ok('QR kod çizildi', await page.locator('[data-testid="share-qr"]').evaluate((e) => e.tagName === 'IMG' && e.src.startsWith('data:image/png')));

  // --- A: tam indirme, ayna yedeği, sha doğrulama ---
  const t0 = Date.now();
  await row('e2e-a.zim').locator('[data-testid="pack-download"]').click();
  await page.waitForSelector('[data-testid="pack-row"][data-pack="e2e-a.zim"][data-state="ready"]', { timeout: 60000 });
  const txtA = await row('e2e-a.zim').textContent();
  ok('A: "Hazır · cihazda" görünür', txtA.includes('Hazır · cihazda'), `${((Date.now() - t0) / 1000).toFixed(1)} sn`);
  const a = await opfsSha('e2e-a.zim');
  ok('A: OPFS dosyası doğru boyut', a.size === A_SIZE, String(a.size));
  ok('A: OPFS dosyası SHA-256 eşleşir', a.sha === shaA);
  ok('A: .part kalmadı', !a.names.includes('e2e-a.zim.part'), a.names.join(','));

  // --- B: yarıda yeniden yükle, devam et ---
  await row('e2e-b.zim').locator('[data-testid="pack-download"]').click();
  await page.waitForFunction(
    () => {
      const r = document.querySelector('[data-testid="pack-row"][data-pack="e2e-b.zim"] [role="progressbar"]');
      return r && Number(r.getAttribute('aria-valuenow')) >= 30;
    },
    null,
    { timeout: 30000 },
  );
  await page.reload({ waitUntil: 'networkidle' });
  await openPacks();
  await page.waitForSelector('[data-testid="pack-row"][data-pack="e2e-b.zim"][data-state="paused"]', { timeout: 10000 });
  const pausedTxt = await row('e2e-b.zim').textContent();
  const partSize = await page.evaluate(async () => {
    const dir = await (await navigator.storage.getDirectory()).getDirectoryHandle('packs');
    return (await (await dir.getFileHandle('e2e-b.zim.part')).getFile()).size;
  });
  ok('B: yeniden yüklemeden sonra "Duraklatıldı"', /Duraklatıldı/.test(pausedTxt), pausedTxt.match(/Duraklatıldı[^A-Z]*/)?.[0]);
  ok('B: .part dosyasında veri var', partSize > 0 && partSize < B_SIZE, String(partSize));
  const before = slowRanges.length;
  await row('e2e-b.zim').locator('[data-testid="pack-resume"]').click();
  await page.waitForSelector('[data-testid="pack-row"][data-pack="e2e-b.zim"][data-state="ready"]', { timeout: 60000 });
  const resumeRange = slowRanges.slice(before)[0];
  ok('B: devam isteği Range ile', resumeRange === `bytes=${partSize}-`, resumeRange);
  const b = await opfsSha('e2e-b.zim');
  ok('B: SHA-256 eşleşir', b.sha === shaB && b.size === B_SIZE);
  ok('B: .part kalmadı', !b.names.includes('e2e-b.zim.part'));
  ok('indirme kaydı temizlendi', await page.waitForFunction(() => {
    const d = JSON.parse(localStorage.getItem('ac.downloads') || '{}');
    return Object.keys(d).length === 0;
  }, null, { timeout: 5000 }).then(() => true, () => false));

  // --- sil ---
  await row('e2e-a.zim').locator('[data-testid="pack-delete"]').click();
  await row('e2e-a.zim').locator('[data-testid="pack-delete-yes"]').click();
  await page.waitForSelector('[data-testid="pack-row"][data-pack="e2e-a.zim"] [data-testid="pack-download"]', { timeout: 5000 });
  ok('silme sonrası tekrar "İndir"', true);
  await page.screenshot({ path: '/tmp/download-check.png', fullPage: false });
  ok('sayfa hatası yok', errors.length === 0, errors.join(' | '));
} catch (e) {
  ok('beklenmeyen hata', false, e.message);
  await page.screenshot({ path: '/tmp/download-check-fail.png' }).catch(() => {});
} finally {
  await browser.close();
  await Promise.all([app.close(), remote.close(), slow.close()]);
  fs.rmSync(tmp, { recursive: true, force: true });
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} denetim geçti`);
process.exit(failed ? 1 : 0);
