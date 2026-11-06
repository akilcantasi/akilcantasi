// Service worker (tarayıcı / bilgi noktası) denetimi:
//   • derlemede sw.js üretildi; önceden önbellek listesi paket, /data/, /api/, wasm içermiyor
//   • server/server.mjs ile açılan sayfa SW'yi kaydeder, crossOriginIsolated (COOP/COEP) kalır
//   • bir kez açıldıktan sonra çevrimdışı (context.setOffline) yeniden yüklenince uygulama açılır,
//     COOP/COEP başlıkları önbellekten gelen sayfada da geçerli (crossOriginIsolated)
//   • önbellekte /data/ ve /api/ yanıtı yok
//   • yeni sürüm: SW bekler, "Yeni sürüm hazır" notu çıkar, "Yenile" ile geçilir, eski önbellek silinir
//   • Android (Capacitor) taklidinde SW kaydedilmez
//
//   npm run build            (ya da: npx vite build --outDir /tmp/akil-sw-dist)
//   node e2e/sw-check.mjs [dist-klasörü]
// Çıkış kodu: hata varsa 1. dist kopyalanır (sürüm denemesi sw.js'yi değiştirir; asıl dist'e dokunulmaz).
import { createRequire } from 'module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kaynak = path.resolve(process.argv[2] ?? path.join(ROOT, 'dist'));
const fails = [];
const check = (ok, msg) => { console.log((ok ? 'OK   ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };

if (!fs.existsSync(path.join(kaynak, 'sw.js'))) {
  console.log(`FAIL ${kaynak}/sw.js yok: önce "npm run build" çalıştırın`);
  process.exit(1);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-sw-'));
const dist = path.join(tmp, 'dist');
const data = path.join(tmp, 'data');
fs.cpSync(kaynak, dist, { recursive: true });
fs.mkdirSync(data);
fs.writeFileSync(path.join(data, 'ornek.zim'), Buffer.alloc(4096, 1));

const swSrc = fs.readFileSync(path.join(dist, 'sw.js'), 'utf8');
const liste = JSON.parse(swSrc.match(/const ONCEDEN = (.*);/)[1]);
check(liste[0] === 'index.html', 'önceden önbellekte index.html');
check(liste.some((f) => /^assets\/index-.*\.js$/.test(f)) && liste.some((f) => /\.css$/.test(f)), 'giriş betiği ve CSS önceden önbellekte');
check(!liste.some((f) => /\.(wasm|zim|gguf|pmtiles)$|^data\/|^api\/|packs-manifest/.test(f)), 'önceden önbellekte paket/veri/wasm yok');
const toplam = liste.reduce((n, f) => n + fs.statSync(path.join(dist, f)).size, 0);
check(toplam < 6.5e6, `önceden önbellek ${(toplam / 1e6).toFixed(2)} MB (< 6,5 MB)`);
const csp = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').match(/Content-Security-Policy" content="([^"]+)"/)?.[1] ?? '';
check(/worker-src 'self'/.test(csp), "derleme CSP'si worker-src 'self' içeriyor (SW kaydı serbest)");

const srv = await startServer({ port: 0, host: '127.0.0.1', dist, data });
const base = `http://localhost:${srv.port}/`;
const browser = await pw.chromium.launch();
try {
  // --- 1) İlk açılış, kayıt, çevrimdışı yeniden açılış ---------------------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.addInitScript(() => { try { localStorage.setItem('ac.kurulum', 'atla'); } catch {} });
    await page.goto(base + '?tab=rehber', { waitUntil: 'load' });
    await page.waitForSelector('.app-nav', { timeout: 20000 });
    const kayit = await page.evaluate(async () => {
      const r = await navigator.serviceWorker.ready;
      return { scope: r.scope, active: !!r.active };
    });
    check(kayit.active && kayit.scope === base, 'SW kaydedildi ve etkin: ' + kayit.scope);
    check(await page.evaluate(() => crossOriginIsolated), 'ilk açılışta crossOriginIsolated');
    // clients.claim sonrası sayfa SW yönetiminde; araç parçalarının önceden yüklenmesi beklenir
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 10000 });
    await page.waitForTimeout(9000);
    // Veri ve API istekleri (SW önbelleğe almamalı)
    await page.evaluate(async (b) => {
      await fetch(b + 'api/packs').then((r) => r.text()).catch(() => {});
      await fetch(b + 'data/ornek.zim', { headers: { Range: 'bytes=0-99' } }).then((r) => r.arrayBuffer()).catch(() => {});
      await fetch(b + 'data/ornek.zim').then((r) => r.arrayBuffer()).catch(() => {});
    }, base);
    const onbellek = await page.evaluate(async () => {
      const out = [];
      for (const k of await caches.keys()) {
        const c = await caches.open(k);
        for (const r of await c.keys()) out.push(k + ' ' + new URL(r.url).pathname);
      }
      return out;
    });
    check(onbellek.length >= liste.length, `önbellekte ${onbellek.length} kayıt (önceden ${liste.length})`);
    check(!onbellek.some((u) => /\/(data|api)\//.test(u) || /\.(zim|gguf|wasm)$/.test(u)), 'önbellekte /data/, /api/, wasm yok');
    check(onbellek.every((u) => u.startsWith('akil-kabuk-')), 'tek sürümlü önbellek adı');

    await ctx.setOffline(true);
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector('.app-nav', { timeout: 15000 });
    check(true, 'çevrimdışı yeniden yüklemede uygulama açıldı');
    check(await page.evaluate(() => crossOriginIsolated), 'çevrimdışı (önbellekten) sayfada da crossOriginIsolated');
    await page.screenshot({ path: '/tmp/sw-cevrimdisi.png' });
    // Başka bir adres (SPA) ve tembel yüklenen bir araç da çevrimdışı açılsın
    await page.goto(base + '?tool=pusula', { waitUntil: 'load' });
    await page.waitForSelector('.app-nav', { timeout: 15000 });
    await page.waitForTimeout(1500);
    const metin = await page.evaluate(() => document.getElementById('main')?.innerText ?? document.body.innerText);
    check(!/Yüklenemedi/.test(metin), 'çevrimdışı tembel araç (pusula) açıldı');
    // Paket isteği çevrimdışıyken önbellekten gelmez (ağ hatası)
    const paket = await page.evaluate(async (b) => fetch(b + 'data/ornek.zim').then((r) => 'durum ' + r.status, () => 'ag-hatasi'), base);
    check(paket === 'ag-hatasi', 'çevrimdışıyken paket önbellekten verilmiyor: ' + paket);
    await ctx.setOffline(false);
    const beklenmeyen = errors.filter((e) => !/Failed to load resource|net::ERR_INTERNET_DISCONNECTED|Failed to fetch/.test(e));
    check(beklenmeyen.length === 0, 'konsol hatası yok' + (beklenmeyen.length ? ': ' + beklenmeyen.join(' | ') : ''));

    // --- 2) Yeni sürüm: bekler, not çıkar, Yenile ile geçilir --------------------------
    const eskiOnbellek = (await page.evaluate(() => caches.keys()))[0];
    fs.writeFileSync(path.join(dist, 'index.html'), fs.readFileSync(path.join(dist, 'index.html'), 'utf8') + '\n<!-- yeni sürüm denemesi -->\n');
    fs.writeFileSync(path.join(dist, 'sw.js'), swSrc.replace(/const SURUM = "[^"]+";/, 'const SURUM = "denemesurum1";'));
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
    await page.waitForSelector('[data-testid="sw-update"]', { timeout: 20000 });
    check(true, '"Yeni sürüm hazır" notu çıktı');
    const durum = await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return { waiting: !!r.waiting, active: r.active?.scriptURL }; });
    check(durum.waiting, 'yeni SW kendiliğinden devralmadı (bekliyor)');
    const h = await page.$eval('[data-testid="sw-update-reload"]', (e) => e.getBoundingClientRect().height);
    check(h >= 44, 'Yenile düğmesi ≥44px: ' + h);
    await page.screenshot({ path: '/tmp/sw-yeni-surum.png' });
    await Promise.all([page.waitForNavigation({ timeout: 15000 }), page.click('[data-testid="sw-update-reload"]')]);
    await page.waitForSelector('.app-nav', { timeout: 15000 });
    await page.waitForFunction(async () => (await caches.keys()).length === 1 && (await caches.keys())[0] === 'akil-kabuk-denemesurum1', null, { timeout: 10000, polling: 300 }).catch(() => {});
    const yeniKeys = await page.evaluate(() => caches.keys());
    check(yeniKeys.length === 1 && yeniKeys[0] === 'akil-kabuk-denemesurum1' && yeniKeys[0] !== eskiOnbellek, 'yeni sürüme geçildi, eski önbellek silindi: ' + yeniKeys.join(','));
    check(!(await page.$('[data-testid="sw-update"]')), 'yenilemeden sonra not yok');
    await ctx.close();
  }

  // --- 3) Android (Capacitor) taklidi: SW kaydedilmez ----------------------------------
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      try { localStorage.setItem('ac.kurulum', 'atla'); } catch {}
      window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: {} };
    });
    await page.goto(base, { waitUntil: 'load' });
    await page.waitForSelector('.app-nav', { timeout: 20000 });
    await page.waitForTimeout(1500);
    const n = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length);
    check(n === 0, 'Capacitor (Android) içinde SW kaydedilmedi');
    await ctx.close();
  }
} finally {
  await browser.close();
  await srv.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(fails.length ? `${fails.length} hata` : 'hepsi geçti');
process.exit(fails.length ? 1 : 0);
