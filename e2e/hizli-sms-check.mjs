// Hızlı SMS: 112'ye konumlu SMS tek dokunuş, yakın ekleme, yakınlara iyiyim/yardım.
//   node e2e/hizli-sms-check.mjs [taban-url] [ekran-klasörü]
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] ?? 'http://localhost:5199/';
const SHOTS = process.argv[3] ?? '/tmp/hizli-sms';
mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['geolocation'], geolocation: { latitude: 39.9208, longitude: 32.8541, accuracy: 15 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => {
  window.__opened = [];
  window.__acSmsOpen = (h) => window.__opened.push(h);
  try { localStorage.setItem('ac.kurulum', 'atla'); } catch {}
});
const tid = (t) => `[data-testid="${t}"]`;
await page.goto(base + '?tab=iletisim');
await page.waitForSelector(tid('quick-help'));
await page.screenshot({ path: `${SHOTS}/1-bos.png` });

// 112: tek dokunuş
await page.click(tid('quick-112-sms'));
await page.waitForFunction(() => window.__opened.length === 1);
let h = await page.evaluate(() => window.__opened[0]);
assert.match(h, /^sms:112\?body=/);
const body = decodeURIComponent(h.split('body=')[1]);
assert.match(body, /ACİL\./);
assert.match(body, /Konum: 39\.92080, 32\.85410 \(±15 m\)/);
assert.match(await page.textContent(tid('quick-status')), /Konum eklendi/);
console.log('OK   112 tek dokunuşla konumlu açılıyor');

// yakın ekle
await page.click(tid('quick-add'));
await page.fill(tid('name-input'), 'Ayşe');
for (const [n, p] of [['Annem', '0555 111 22 33'], ['Mehmet', '0532 000 00 00']]) {
  await page.fill(tid('yakin-name'), n);
  await page.fill(tid('yakin-phone'), p);
  await page.click(tid('yakin-add'));
}
assert.equal(await page.locator(tid('yakin-row')).count(), 2);
await page.screenshot({ path: `${SHOTS}/2-yakinlar.png`, fullPage: true });
console.log('OK   yakın eklendi');

// ana ekrana dön (alt menü: aynı sekmeye dokunma ana ekrana döner)
await page.click('nav >> text=İletişim');
await page.waitForSelector(tid('quick-person'));
await page.screenshot({ path: `${SHOTS}/3-hazir.png` });
await page.click(tid('quick-person'));
await page.waitForFunction(() => window.__opened.length === 2);
h = await page.evaluate(() => window.__opened[1]);
assert.match(h, /^sms:05551112233\?body=/);
assert.match(decodeURIComponent(h.split('body=')[1]), /^İyiyim\.[\s\S]*— Ayşe\nhttps:\/\/www\.openstreetmap\.org/);
await page.click(tid('quick-durum-yardim'));
await page.click(tid('quick-all'));
await page.waitForFunction(() => window.__opened.length === 3);
h = await page.evaluate(() => window.__opened[2]);
assert.match(h, /^sms:05551112233,05320000000\?body=Yard%C4%B1ma/);
console.log('OK   yakınlara tek/çok alıcı');

// kalıcı
await page.reload();
await page.waitForSelector(tid('quick-person'));
assert.equal(await page.locator(tid('quick-person')).count(), 2);
console.log('OK   yeniden açılışta yakınlar duruyor');

// dokunma hedefleri ve taşma
const small = await page.evaluate(() => [...document.querySelectorAll('[data-testid="quick-help"] button, [data-testid="quick-help"] a')].filter((e) => { const r = e.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).map((e) => e.textContent));
assert.deepEqual(small, []);
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
assert.deepEqual(errors, []);
console.log('OK   hedefler ≥44px, taşma yok, konsol hatası yok');
await browser.close();
console.log('TÜMÜ OK');
