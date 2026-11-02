// Uygulama içi PDF okuyucu: nautilus kitaplığından PDF açma, kitapta arama, sayfa çevirisi.
//   npm run build
//   D=/tmp/qa-pdf; rm -rf $D; mkdir -p $D && cp testdata/sample_kitap_en.zim $D/
//   node server/server.mjs --data $D --port 8099 &
//   node e2e/pdf-okuyucu-check.mjs [ekran-klasörü]
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const BASE = process.env.QA_PDF || 'http://localhost:8099';
const SHOTS = process.argv[2] || '/tmp/qa-pdf';
mkdirSync(SHOTS, { recursive: true });
const tid = (id) => `[data-testid="${id}"]`;
const browser = await pw.chromium.launch();
const errors = [];
let fails = 0;
async function step(name, fn) {
  try {
    await fn();
    console.log('OK  ', name);
  } catch (e) {
    fails++;
    console.log('HATA', name, '\n     ', e.message.split('\n').slice(0, 4).join('\n      '));
  }
}
const smallTargets = (p) =>
  p.$$eval('#main button, #main input', (els) =>
    els
      .filter((e) => e.offsetParent)
      .map((e) => ({ id: e.dataset.testid || e.textContent.trim().slice(0, 15), r: e.getBoundingClientRect() }))
      .filter((x) => x.r.width < 44 || x.r.height < 44)
      .map((x) => `${x.id} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`),
  );

for (const vp of [{ width: 360, height: 740 }, { width: 1280, height: 800 }]) {
  const ctx = await browser.newContext({ viewport: vp });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED/.test(m.text())) errors.push(`console: ${m.text()}`); });
  await p.goto(BASE + '/?tab=kutuphane', { waitUntil: 'networkidle' });

  await step(`${vp.width}px: kitap listesinden PDF uygulama içinde açılır`, async () => {
    await p.waitForSelector(tid('lib-main'), { timeout: 30000 });
    await p.click(`${tid('lib-main')}:has-text("Sample Library")`);
    await p.waitForSelector(tid('lib-books'));
    await p.click(`${tid('lib-book')}:has-text("Water Storage") ${tid('lib-book-open')}`);
    await p.waitForSelector(tid('pdf-reader'));
    await p.waitForFunction(() => /sayfa 1 \/ 3/.test(document.querySelector('[data-testid="pdf-page"]')?.textContent || ''), null, { timeout: 30000 });
    // İlk sayfa gerçekten çizildi mi (beyaz olmayan piksel var mı)
    await p.waitForSelector('[data-page="1"] canvas');
    const ink = await p.$eval('[data-page="1"] canvas', async (c) => {
      for (let i = 0; i < 50; i++) {
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let n = 0;
        for (let j = 0; j < d.length; j += 4) if (d[j] < 128) n++;
        if (n > 50) return n;
        await new Promise((r) => setTimeout(r, 100));
      }
      return 0;
    });
    assert.ok(ink > 50, 'sayfa çizilmedi');
    await p.screenshot({ path: `${SHOTS}/okuyucu-${vp.width}.png` });
  });

  await step(`${vp.width}px: kitapta arama sayfayı ve bağlamı bulur, sonuca gider`, async () => {
    await p.fill(tid('pdf-search'), 'BOİL');
    await p.waitForSelector(tid('pdf-hit'), { timeout: 20000 });
    await p.waitForFunction(() => !document.querySelector('[data-testid="pdf-scan"]'));
    const hits = await p.$$eval(tid('pdf-hit'), (x) => x.map((e) => e.textContent));
    assert.equal(hits.length, 2, hits.join(' | '));
    assert.ok(hits.every((h) => /s\. 2/.test(h)), hits.join(' | '));
    assert.match(await p.textContent(tid('pdf-count')), /1 \/ 2/);
    await p.click(`${tid('pdf-hit')} >> nth=1`);
    await p.waitForSelector('[data-page="2"].hit');
    await p.waitForFunction(() => /sayfa 2 \/ 3/.test(document.querySelector('[data-testid="pdf-page"]')?.textContent || ''), null, { timeout: 10000 });
    await p.fill(tid('pdf-search'), 'yokböyleşey');
    await p.waitForFunction(() => /yok/.test(document.querySelector('[data-testid="pdf-count"]')?.textContent || ''));
    await p.fill(tid('pdf-search'), '');
  });

  await step(`${vp.width}px: görünen sayfa çeviriye gönderilir`, async () => {
    await p.click(tid('pdf-translate'));
    // Çeviri üst çubukta açılır ve düğme beklemeden başlar (bu sunucuda model yok → model yok iletisi)
    await p.waitForSelector(`${tid('pdf-translation-box')} ${tid('lib-translation')}`);
    const st = await p.getAttribute(tid('lib-translation'), 'data-state');
    assert.ok(st !== 'idle', 'çeviri kendiliğinden başlamadı: ' + st);
    const box = await p.$eval(tid('pdf-translation-box'), (e) => e.getBoundingClientRect().top);
    assert.ok(box >= 0 && box < 600, 'çeviri ekranda değil: ' + box);
    await p.click(tid('pdf-translate-close'));
    await p.waitForSelector(tid('pdf-translate'));
  });

  await step(`${vp.width}px: yakınlaştırma sayfayı büyütür, tuval sayısı sınırlı`, async () => {
    const w0 = await p.$eval('[data-page="1"]', (e) => e.getBoundingClientRect().width);
    await p.click('[aria-label="Yakınlaştır"]');
    await p.waitForFunction((w) => document.querySelector('[data-page="1"]').getBoundingClientRect().width > w * 1.15, w0);
    await p.waitForFunction(() => {
      const c = document.querySelector('[data-page="1"] canvas, [data-page="2"] canvas');
      return c && c.width > 0;
    });
    assert.ok((await p.$$('[data-testid="pdf-pages"] canvas')).length <= 3);
    await p.click('[aria-label="Uzaklaştır"]');
  });

  await step(`${vp.width}px: dokunma hedefleri ve taşma`, async () => {
    assert.deepEqual(await smallTargets(p), []);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  });

  await step(`${vp.width}px: geri dönünce kitap listesi`, async () => {
    await p.click(tid('pdf-back'));
    await p.waitForSelector(tid('lib-books'));
  });
  await ctx.close();
}
await browser.close();
if (errors.length) {
  fails++;
  console.log('HATA konsol:\n  ' + [...new Set(errors)].join('\n  '));
}
console.log(fails ? `${fails} hata` : 'hepsi geçti');
process.exit(fails ? 1 : 0);
