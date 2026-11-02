// Kütüphane uçtan uca denetimi (gerçek ZIM + ikinci örnek ZIM ile):
//   npm run build
//   mkdir -p /tmp/kt-data && ln -s /home/claude/packs/wikipedia_tr_all_mini_2026-09.zim /tmp/kt-data/ \
//     && cp testdata/sample_med_en.zim /tmp/kt-data/
//   node server/server.mjs --data /tmp/kt-data --port 8098 &
//   node e2e/kutuphane-check.mjs [http://localhost:8098] [ekran-görüntüsü-klasörü]
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const BASE = process.argv[2] || 'http://localhost:8098';
const SHOTS = process.argv[3] || '/tmp/kutuphane-shots';
mkdirSync(SHOTS, { recursive: true });

const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
// İsteğe bağlı çevrim içi katalog bu ortamda erişilemez (kapsam dışı)
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED/.test(m.text())) errors.push('console: ' + m.text()); });
const tid = (id) => `[data-testid="${id}"]`;
const shot = (n) => page.screenshot({ path: `${SHOTS}/${n}.png` });
const timed = async (label, fn) => { const t = Date.now(); const r = await fn(); console.log(`${label}: ${Date.now() - t} ms`); return r; };

await page.goto(BASE + '/?tab=kutuphane', { waitUntil: 'networkidle' });
await page.waitForSelector(tid('lib-search'), { timeout: 30000 });

// 1) Kaynak seçici: Tümü + iki kaynak
const chips = await page.$$eval(tid('lib-src'), (b) => b.map((x) => x.textContent.trim()));
console.log('kaynaklar:', chips);
assert.deepEqual(chips, ['Vikipedi', 'WikiMed']);
assert.equal(await page.getAttribute(tid('lib-src-all'), 'aria-pressed'), 'true');
// Kaynak ayrıntısı (madde sayısı, dil) kaynak seçilince üstveri kartında gösterilir
assert.ok(await page.isVisible(tid('lib-status')));
await shot('01-tumu');

// 2) Türkçe duyarsız, kelime içi arama (Tümü)
// Sonuçlar, yazılan sorguya ait olana kadar bekle (data-q); tam=true ise tam metin de bitsin
const search = async (q, full = false) => {
  await page.fill(tid('lib-search'), q);
  await page.waitForFunction(
    ([q, full]) => {
      const v = document.querySelector('[data-testid="lib-view"]');
      return v && v.dataset.q === q && (!full || v.dataset.state === 'idle');
    },
    [q, full],
    { timeout: 30000 },
  );
};
await timed('arama "sicak carpmasi" (ilk, soğuk)', () => search('sicak carpmasi'));
let titles = await page.$$eval(tid('lib-result'), (b) => b.map((x) => x.querySelector('.kt-hit-title').textContent));
assert.equal(titles[0], 'Sıcak çarpması');
await timed('arama "anadolu fay"', () => search('anadolu fay'));
await timed('  + tam metin', () => search('anadolu fay', true));
titles = await page.$$eval(tid('lib-result'), (b) => b.map((x) => x.querySelector('.kt-hit-title').textContent));
assert.ok(titles.includes('Kuzey Anadolu Fay Hattı'), titles.join(', '));
// Tam metin bölümü
await page.waitForSelector(tid('lib-text-result'), { timeout: 20000 });
await shot('02-arama-anadolu-fay');

// 3) Yazım hatası + kaynak etiketi
await timed('arama "istanbl"', () => search('istanbl'));
titles = await page.$$eval(tid('lib-result'), (b) => b.map((x) => x.querySelector('.kt-hit-title').textContent));
assert.equal(titles[0], 'İstanbul');
assert.ok(await page.$(tid('lib-fuzzy-note')));
await shot('03-yazim-hatasi');

// 4) Kaynak seçimi: WikiMed (üstveri kartı arama kutusu boşken görünür)
await page.fill(tid('lib-search'), '');
await page.click(`${tid('lib-src')}[data-src="sample_med_en.zim"]`);
await page.waitForSelector(tid('lib-meta-title'));
assert.equal(await page.textContent(tid('lib-meta-count')), '12 madde');
assert.equal(await page.textContent(tid('lib-meta-lang')), 'İngilizce');
await shot('04a-wikimed-secili');
await timed('arama "dehydration" (WikiMed)', () => search('dehydration', true));
const srcs = await page.$$eval(tid('lib-result-src'), (b) => [...new Set(b.map((x) => x.textContent))]);
assert.deepEqual(srcs, ['WikiMed']);
await page.waitForSelector(tid('lib-text-result'), { timeout: 10000 });
await shot('04-wikimed');

// 5) WikiMed makalesi, bağlantı, geri/ileri
await page.click(tid('lib-result'));
await page.waitForSelector(tid('lib-article-title'));
assert.equal(await page.textContent(tid('lib-article-title')), 'Dehydration');
assert.equal(await page.textContent(tid('lib-article-src')), 'WikiMed');
assert.equal(await page.isDisabled(tid('lib-nav-back')), true);
await shot('04b-wikimed-makale');
await page.click('[data-testid="lib-article-body"] a[data-zim-path="Diarrhea"]');
await page.waitForFunction(() => document.querySelector('[data-testid="lib-article-title"]')?.textContent === 'Diarrhea');
assert.equal(await page.isDisabled(tid('lib-nav-back')), false);
await page.click(tid('lib-nav-back'));
await page.waitForFunction(() => document.querySelector('[data-testid="lib-article-title"]')?.textContent === 'Dehydration');
assert.equal(await page.isDisabled(tid('lib-nav-fwd')), false);
await page.click(tid('lib-nav-fwd'));
await page.waitForFunction(() => document.querySelector('[data-testid="lib-article-title"]')?.textContent === 'Diarrhea');
await page.click(tid('lib-back'));

// 6) Vikipedi makalesi: sayfada bul + büyük yazı + Fener'e sor
await page.click(`${tid('lib-src')}[data-src="wikipedia_tr_all_mini_2026-09.zim"]`);
await timed('arama "deprem" (Vikipedi)', () => search('deprem'));
await timed('makale aç "Deprem"', async () => {
  await page.click(tid('lib-result'));
  await page.waitForSelector(tid('lib-article-body'));
});
assert.equal(await page.textContent(tid('lib-article-title')), 'Deprem');
assert.equal(await page.textContent(tid('lib-article-src')), 'Vikipedi');
await page.click(tid('lib-find-toggle'));
await page.fill(tid('lib-find-input'), 'fay');
await page.waitForTimeout(150);
const cnt = await page.textContent(tid('lib-find-count'));
console.log('sayfada bul "fay":', cnt);
assert.match(cnt, /^1\/\d+$/);
await page.click(tid('lib-find-next'));
assert.match(await page.textContent(tid('lib-find-count')), /^2\/\d+$/);
const fs0 = await page.$eval(tid('lib-article-body'), (b) => getComputedStyle(b).fontSize);
await page.click(tid('lib-textsize'));
const fs1 = await page.$eval(tid('lib-article-body'), (b) => getComputedStyle(b).fontSize);
assert.ok(parseFloat(fs1) > parseFloat(fs0), `${fs0} → ${fs1}`);
await shot('05-makale-bul-buyuk');
await page.click(tid('lib-textsize'));
await page.click(tid('lib-textsize')); // tekrar normale
await page.click(tid('lib-find-close'));
assert.ok(await page.$(tid('lib-ask')));
await page.click(tid('lib-back'));

// 7) Geçmiş ve rastgele makale
await page.fill(tid('lib-search'), '');
await page.waitForSelector(tid('lib-history-item'));
const hist = await page.$$eval(tid('lib-history-item'), (b) => b.map((x) => x.textContent));
console.log('geçmiş:', hist);
assert.ok(hist.includes('deprem') && hist.includes('dehydration'));
await page.click(tid('lib-src-all'));
await timed('rastgele makale', async () => {
  await page.click(tid('lib-random'));
  await page.waitForSelector(tid('lib-article-title'), { timeout: 20000 });
});
console.log('rastgele:', await page.textContent(tid('lib-article-title')), '/', await page.textContent(tid('lib-article-src')));
await shot('06-rastgele');
await page.click(tid('lib-back'));
await page.click(tid('lib-history-clear'));
await page.click(tid('lib-history-clear-yes'));
assert.equal(await page.$(tid('lib-history-item')), null);

const mem = await page.evaluate(() => (performance).memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null);
console.log('JS yığın (MB):', mem);

console.log(errors.length ? 'KONSOL HATALARI:\n' + errors.join('\n') : 'konsol hatası yok');
assert.equal(errors.length, 0);
console.log('TÜMÜ OK');
await browser.close();
