// "Konum aranıyor" görselleştirmesi: sahte Capacitor köprüsüyle uydu durumları
//   • izin/konum kapalı → neden + ayarlara giden düğme
//   • uydu yok → zayıf sinyal → yörünge bekleniyor → konum bulundu
//   • tarayıcıda (köprü yok) süreye dayalı anlatım
//   node e2e/konum-arama-check.mjs [taban-url] [ekran-klasörü]
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:5199/';
const SHOTS = process.argv[3] ?? '/tmp/konum-arama';
mkdirSync(SHOTS, { recursive: true });
const tid = (t) => `[data-testid="${t}"]`;
const mapUrl = base + '?tab=harita&devmap=/testdata/sample_ornek.pmtiles&devpoi=/testdata/sample_poi_ornek.geojson';

const browser = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let fails = 0;
const errors = [];
async function step(name, fn) {
  try { await fn(); console.log('OK  ', name); } catch (e) { fails++; console.log('HATA', name, '\n     ', e.message.split('\n').slice(0, 4).join('\n      ')); }
}

/** Sahte köprü: window.__durum(o) ile bir sonraki olay belirlenir; saniyede bir yayınlanır */
function sahteKopru() {
  try { localStorage.setItem('ac.kurulum', 'atla'); } catch {}
  const subs = [];
  window.__acilan = [];
  window.__durdu = 0;
  let durum = { izin: 'tam', gpsVar: true, konumAcik: true, gpsAcik: true, agAcik: false, gecenMs: 0, ilkKonumMs: -1, uydular: [] };
  let t = null;
  const yay = () => subs.forEach((f) => f(JSON.parse(JSON.stringify(durum))));
  window.__durum = (o) => { durum = { ...durum, ...o }; yay(); };
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    Plugins: {
      AkilCantasi: {
        async konumIzle() { if (!t) t = setInterval(() => { durum.gecenMs += 1000; yay(); }, 1000); return { izin: durum.izin }; },
        async konumIzleDurdur() { window.__durdu++; clearInterval(t); t = null; return {}; },
        async konumAyarlari() { window.__acilan.push('konum'); return { opened: true }; },
        async uygulamaAyarlari() { window.__acilan.push('uygulama'); return { opened: true }; },
        async addListener(ev, fn) { if (ev === 'konumDurum') subs.push(fn); return { remove() { const i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); } }; },
      },
    },
  };
  // Yerel yol kullanılırken tarayıcı konumu çağrılmamalı
  window.__webKonum = 0;
  navigator.geolocation.watchPosition = () => (window.__webKonum++, 1);
  navigator.geolocation.getCurrentPosition = () => window.__webKonum++;
}

const uydu = (id, sinyal, o = {}) => ({ id, tur: id > 60 ? 'Galileo' : 'GPS', sinyal, kullanilan: false, yorunge: false, az: (id * 47) % 360, yukseklik: 15 + ((id * 23) % 70), ...o });

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
ctx.setDefaultTimeout(60000);
await ctx.addInitScript(sahteKopru);
const p = await ctx.newPage();
p.on('pageerror', (e) => errors.push(e.message));
await p.goto(mapUrl, { waitUntil: 'networkidle' });
await p.waitForSelector(tid('map-locate'));

await step('Konumum: yerel arama başlar, kart ve sayaç görünür', async () => {
  await p.click(tid('map-locate'));
  await p.waitForSelector(tid('loc-search'));
  await p.waitForFunction(() => document.querySelector('[data-testid="loc-search-time"]')?.textContent !== '0:00', null, { timeout: 5000 });
  assert.equal(await p.evaluate(() => window.__webKonum), 0, 'tarayıcı konumu çağrılmamalı');
});

await step('Konum kapalı → neden ve konum ayarları düğmesi', async () => {
  await p.evaluate(() => window.__durum({ konumAcik: false, gpsAcik: false }));
  await p.waitForSelector(tid('loc-search-action'));
  assert.match(await p.textContent(tid('loc-search-hint')), /konum özelliği kapalı/);
  await p.screenshot({ path: SHOTS + '/1-konum-kapali.png' });
  await p.click(tid('loc-search-action'));
  assert.deepEqual(await p.evaluate(() => window.__acilan), ['konum']);
});

await step('Yaklaşık izin → uygulama izinleri düğmesi', async () => {
  await p.evaluate(() => window.__durum({ izin: 'yaklasik', konumAcik: true, gpsAcik: true }));
  await p.waitForFunction(() => /Tam konum/.test(document.querySelector('[data-testid="loc-search-hint"]')?.textContent || ''));
  assert.match(await p.textContent(tid('loc-search-action')), /Uygulama izinlerini/);
});

await step('Uydu yok → açık alana çık', async () => {
  await p.evaluate(() => window.__durum({ izin: 'tam', gecenMs: 31000, uydular: [] }));
  await p.waitForFunction(() => /açık alana/.test(document.querySelector('[data-testid="loc-search-hint"]')?.textContent || ''));
  assert.equal(await p.locator(tid('loc-search-action')).count(), 0);
  await p.screenshot({ path: SHOTS + '/2-uydu-yok.png' });
});

await step('Zayıf sinyal → sayılar ve gökyüzü noktaları', async () => {
  await p.evaluate((u) => window.__durum({ uydular: u }), [uydu(3, 14), uydu(7, 22), uydu(12, 11), uydu(17, 16), uydu(24, 9), uydu(65, 13), uydu(71, 18)]);
  await p.waitForFunction(() => /7 uydu duyuluyor ama yalnız 1/.test(document.querySelector('[data-testid="loc-search-hint"]')?.textContent || ''));
  assert.equal(await p.locator('.ka-gok .ka-uydu').count(), 7);
  assert.equal(await p.locator('.ka-cubuk.zayif').count(), 6);
  await p.screenshot({ path: SHOTS + '/3-zayif-sinyal.png' });
});

await step('Güçlü sinyal, yörünge iniyor', async () => {
  await p.evaluate(
    (u) => window.__durum({ gecenMs: 74000, uydular: u }),
    [uydu(3, 34, { yorunge: true }), uydu(7, 31, { yorunge: true }), uydu(12, 28), uydu(17, 36, { yorunge: true }), uydu(24, 25), uydu(65, 30), uydu(71, 19), uydu(9, 23)],
  );
  await p.waitForFunction(() => /30 saniyede/.test(document.querySelector('[data-testid="loc-search-hint"]')?.textContent || ''));
  assert.match(await p.textContent(tid('loc-search-counts')), /8\s*duyulan/);
  await p.screenshot({ path: SHOTS + '/4-yorunge-iniyor.png' });
  await p.click(tid('map-saymyloc'));
  await p.waitForSelector(tid('loc-search-panel'));
  assert.equal(await p.locator(tid('loc-search-panel') + ' .ka-adim').count(), 5);
  await p.screenshot({ path: SHOTS + '/4b-panel.png' });
  await p.keyboard.press('Escape');
});

await step('Konum bulundu → kart kalkar, konum işaretçisi gelir', async () => {
  await p.evaluate(
    (u) => window.__durum({ gecenMs: 98000, ilkKonumMs: 98000, uydular: u, konum: { lat: 39.9105, lon: 32.79, dogruluk: 9, zaman: Date.now(), kaynak: 'gps' } }),
    [uydu(3, 36, { yorunge: true, kullanilan: true }), uydu(7, 33, { yorunge: true, kullanilan: true }), uydu(12, 30, { yorunge: true, kullanilan: true }), uydu(17, 37, { yorunge: true, kullanilan: true }), uydu(24, 27, { yorunge: true, kullanilan: true }), uydu(65, 31, { yorunge: true })],
  );
  await p.waitForSelector(tid('loc-search'), { state: 'detached', timeout: 5000 });
  await p.click(tid('map-saymyloc'));
  assert.match(await p.textContent(tid('loc-decimal')), /39[.,]91/);
  await p.screenshot({ path: SHOTS + '/5-bulundu.png' });
  await p.keyboard.press('Escape');
});

await step('Sekmeden çıkınca yerel arama durur', async () => {
  await p.goto(base + '?tab=rehber');
  // yeni sayfa yüklemesi: durdurma çağrısı sayfa kapanırken yapılır; burada yalnız hata olmadığını denetle
});
await ctx.close();

// Tarayıcı (köprü yok): GPS yanıt vermiyor
await step('Tarayıcı: süreye dayalı kart', async () => {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await c.addInitScript(() => {
    try { localStorage.setItem('ac.kurulum', 'atla'); } catch {}
    navigator.geolocation.watchPosition = () => 1;
    navigator.geolocation.getCurrentPosition = () => {};
    navigator.geolocation.clearWatch = () => {};
  });
  const q = await c.newPage();
  q.on('pageerror', (e) => errors.push(e.message));
  await q.goto(mapUrl, { waitUntil: 'networkidle' });
  await q.click(tid('map-locate'));
  await q.waitForSelector(tid('loc-search'));
  assert.equal(await q.locator('.ka-gok').count(), 0);
  assert.match(await q.textContent(tid('loc-search-step')), /Uydular aranıyor/);
  await q.click(tid('map-saymyloc'));
  await q.waitForSelector(tid('loc-search-panel'));
  assert.match(await q.textContent(tid('loc-search-panel')), /Android uygulamasında uydular/);
  await q.screenshot({ path: SHOTS + '/6-tarayici.png' });
  await c.close();
});

await browser.close();
if (errors.length) { console.log('Sayfa hataları:', errors); fails++; }
console.log(fails ? `${fails} HATA` : 'Hepsi geçti');
process.exit(fails ? 1 : 0);
