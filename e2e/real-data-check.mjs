// Gerçek verilerle uçtan uca kontrol (Node bilgi noktası sunucusu üzerinden):
//   node server/server.mjs --data <paket-klasörü> --port 8090
//   node e2e/real-data-check.mjs http://localhost:8090/ /tmp/shots
// Beklenen paketler: Türkçe Wikipedia ZIM, Qwen GGUF, turkiye.pmtiles
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const base = process.argv[2] ?? 'http://localhost:8090/';
const shots = process.argv[3] ?? '/tmp';
const failures = [];
// Ekran görüntüsü yük altında zaman aşımına uğrayabilir; denetimi düşürmesin
const shot = (name, full = false) => page.screenshot({ path: shots + '/' + name, fullPage: full, timeout: 60000 }).catch((e) => console.log('  (ekran görüntüsü alınamadı: ' + name + ')'));
const check = (ok, msg) => { console.log((ok ? 'OK   ' : 'FAIL ') + msg); if (!ok) failures.push(msg); };

const browser = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, geolocation: { latitude: 39.92, longitude: 32.85 }, permissions: ['geolocation'] });
const page = await ctx.newPage();
const errors = [];
// Harita karoları ana sayfadan ya da işçiden (worker) okunabilir: tüm istekleri say
const pmtilesReqs = [];
ctx.on('request', (r) => { if (r.url().includes('turkiye.pmtiles')) pmtilesReqs.push(r.url()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('crash', () => errors.push('sekme çöktü (crash)'));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.goto(base, { waitUntil: 'networkidle' });
check(await page.evaluate(() => crossOriginIsolated), 'crossOriginIsolated');

// ---- Kütüphane ----
await page.click('[data-testid="nav-kutuphane"]');
await page.waitForSelector('[data-testid="lib-meta"]', { timeout: 30000 });
console.log('kütüphane:', (await page.textContent('[data-testid="lib-meta"]')).trim());
await page.fill('[data-testid="lib-search"]', 'Deprem');
await page.waitForSelector('[data-testid="lib-result"]', { timeout: 30000 });
const results = await page.$$eval('[data-testid="lib-result"]', (els) => els.slice(0, 5).map((e) => e.textContent.trim().slice(0, 50)));
check(results.length > 0, 'ZIM araması sonuç verdi: ' + JSON.stringify(results));
await page.click('[data-testid="lib-result"]');
await page.waitForSelector('[data-testid="lib-article"]', { timeout: 30000 });
await page.waitForTimeout(800);
const art = (await page.textContent('[data-testid="lib-article"]')) ?? '';
check(art.length > 300, 'makale açıldı (' + art.length + ' karakter): ' + JSON.stringify(art.slice(0, 80)));
await shot('real-kutuphane.png');

// ---- Harita ----
await page.click('[data-testid="nav-harita"]');
await page.waitForSelector('[data-testid="map"] canvas', { timeout: 30000 });
await page.waitForTimeout(6000);
const tileReqs = pmtilesReqs.length;
check(tileReqs > 0, 'harita turkiye.pmtiles\'tan okudu (' + tileReqs + ' istek)');
await shot('real-harita.png');

// ---- Rehber ----
await page.click('[data-testid="nav-rehber"]');
await page.fill('[data-testid="guide-search"]', 'deprem');
await page.waitForTimeout(400);
check((await page.$$('[data-testid="guide-card"]')).length > 0, 'rehber araması');
await shot('real-rehber.png');

// ---- Araçlar → Paketler ve paylaşım ----
await page.click('[data-testid="nav-araclar"]');
await page.click('[data-testid="tool-card-paylas"]');
await page.waitForSelector('[data-testid="pack-row"]', { timeout: 15000 }).catch(() => {});
const rows = await page.$$('[data-testid="pack-row"]');
check(rows.length > 0, 'paylaş: paket satırları (' + rows.length + ')');
await shot('real-paylas.png', true);

// ---- Fener (gerçek Qwen) ----
await page.click('[data-testid="nav-fener"]');
const st0 = await page.waitForSelector('[data-testid="fener-status"]');
await page.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.mode === 'model', null, { timeout: 120000 }).catch(() => {});
console.log('fener durum:', (await st0.textContent()).trim());
check((await st0.getAttribute('data-mode')) === 'model', 'Fener gerçek modeli seçti');
await page.fill('[data-testid="fener-input"]', 'Deprem anında ne yapmalıyım?');
try {
  await page.press('[data-testid="fener-input"]', 'Enter');
  const t0 = Date.now();
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop();
    return b?.dataset.phase === 'done';
  }, null, { timeout: 600000, polling: 1000 }).catch(() => {});
  const answer = await page.evaluate(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.querySelector('[data-testid="fener-text"]')?.textContent ?? '');
  const eng = await page.evaluate(() => window.__fener ? { status: window.__fener.status, threads: window.__fener.threads, tps: window.__fener.tokensPerSec } : null);
  console.log('cevap (' + Math.round((Date.now() - t0) / 1000) + ' sn):', JSON.stringify(answer.slice(0, 400)));
  console.log('motor:', JSON.stringify(eng));
  check(answer.length > 40, 'Fener cevap üretti');
  check(/[çğıöşüÇĞİÖŞÜ]/.test(answer), 'cevap Türkçe karakter içeriyor');
  const srcs = await page.$$eval('[data-testid="fener-source"]', (els) => els.map((e) => e.textContent.trim()));
  console.log('kaynaklar:', JSON.stringify(srcs));
  await shot('real-fener.png', true);
} catch (e) {
  check(false, 'Fener cevabı beklenirken hata (sekme çöktü mü? bellek yetersiz olabilir): ' + e.message.split('\n')[0]);
}

// İsteğe bağlı çevrimiçi katalog: internetsiz test ortamında başarısız olabilir
const relevant = errors.filter((e) => !/favicon/i.test(e) && !/ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED/.test(e));
check(relevant.length === 0, 'konsol hatası yok' + (relevant.length ? ': ' + relevant.slice(0, 5).join(' | ') : ''));
await browser.close();
console.log(failures.length ? `\n${failures.length} HATA` : '\nTÜMÜ OK');
process.exit(failures.length ? 1 : 0);
