// Kütüphane uçtan uca denetimi: gerçek ZIM'lerle bir kullanıcının yolculukları (yeni tasarım, 2026-11).
//   npm run build            (ya da: npx vite build --outDir /tmp/kt-dist)
//   D=/tmp/kt-data; mkdir -p $D && ln -sf /home/claude/packs/wikipedia_tr_all_mini_2026-09.zim $D/ \
//     && cp testdata/sample_med_en.zim testdata/sample_kitap_en.zim $D/
//   (ya da sahibin indirdiği gerçek paketlerin klasörü)
//   node server/server.mjs --data $D --port 8098 [--dist /tmp/kt-dist] &
//   node e2e/kutuphane-check.mjs [http://localhost:8098] [ekran-görüntüsü-klasörü]
// Gereken: bir Türkçe Vikipedi paketi. İsteğe bağlı: bir PDF kitaplığı (zimgit / sample_kitap) ve İngilizce bir paket.
// Yolculuklar: Kitaplığım → koleksiyon → okumaya başla; birleşik arama (Türkçe harf duyarsız), süzgeç;
// makale (yazı boyutu, sayfada bul, iç bağlantı, geri/ileri, Fener'e sor); kaldığın yerden devam;
// son okunanlar; kitap kitaplığı → PDF → son sayfa hatırlanır; tarayıcı/Android geri tuşu.
import { createRequire } from 'module';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const BASE = process.argv[2] || 'http://localhost:8098';
const SHOTS = process.argv[3] || '/tmp/kutuphane-shots';
mkdirSync(SHOTS, { recursive: true });

const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED|ERR_FAILED/.test(m.text())) errors.push('console: ' + m.text()); });
const tid = (id) => `[data-testid="${id}"]`;
const shot = (n) => page.screenshot({ path: `${SHOTS}/${n}.png` });
let fails = 0;
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'HATA ') + m); if (!ok) fails++; };
const timed = async (label, fn) => { const t = Date.now(); const r = await fn(); console.log(`     ${label}: ${Date.now() - t} ms`); return r; };
const testids = () => page.evaluate(() => [...document.querySelectorAll('#main [data-testid]')].map((e) => e.dataset.testid));
const hOverflow = () => page.evaluate(() => document.getElementById('main').scrollWidth > document.getElementById('main').clientWidth + 1);
const small = () => page.$$eval('#main button, #main input, #main summary', (els) => els.filter((e) => e.offsetParent && !e.closest('.kt-body') && !e.closest('.kt-note')).map((e) => ({ id: e.dataset.testid || e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20), r: e.getBoundingClientRect() })).filter((x) => x.r.width > 0 && (x.r.width < 43.5 || x.r.height < 43.5)).map((x) => `${x.id} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`));

await page.goto(BASE + '/?tab=kutuphane', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.clear());

// ---- Kitaplığım: kartlar arşivler açılmadan gelir ------------------------------------------------
await timed('Kitaplığım kartları', async () => {
  await page.goto(BASE + '/?tab=kutuphane', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(tid('lib-coll'), { timeout: 30000 });
});
const cards = await page.$$eval(tid('lib-coll'), (els) => els.map((e) => ({ id: e.dataset.src, t: e.querySelector('.kt-card-t').textContent })));
console.log('     kartlar:', cards.map((c) => c.t).join(' | '));
const wiki = cards.find((c) => /^wikipedia_tr_all/.test(c.id));
check(!!wiki, 'Türkçe Vikipedi kartı var');
check(cards.every((c) => !/\.zim|_\d{4}-\d{2}/.test(c.t)), 'kart adlarında dosya adı / tarih yok');
check(!!(await page.$(tid('lib-open-store'))), '"Yeni içerik indir" kartı var');
check(!(await hOverflow()), 'Kitaplığım: yatay taşma yok');
check((await small()).length === 0, 'Kitaplığım: dokunma alanları ≥44px ' + (await small()).join(', '));
await shot('01-kitapligim');

// ---- Koleksiyon → Okumaya başla ---------------------------------------------------------------------
await page.click(`${tid('lib-coll')}[data-src="${wiki.id}"]`);
await page.waitForSelector(tid('lib-coll-home'));
check(/Vikipedi/.test(await page.textContent(tid('lib-meta-title'))), 'koleksiyon başlığı insan dilinde: ' + (await page.textContent(tid('lib-meta-title'))));
await page.waitForSelector(tid('lib-meta-count'), { timeout: 30000 });
check(/\d{3}\.\d{3} sayfa/.test(await page.textContent(tid('lib-meta-count'))), 'sayfa sayısı: ' + (await page.textContent(tid('lib-meta-count'))));
await page.waitForSelector(tid('lib-main'), { timeout: 30000 });
await shot('02-koleksiyon');
await page.click(tid('lib-main'));
await page.waitForSelector(tid('lib-article-title'), { timeout: 30000 });
const anaBaslik = await page.textContent(tid('lib-article-title'));
check(!/Kullanıcı:|Landing|Main Page/.test(anaBaslik), 'ana sayfa başlığı teknik değil: ' + anaBaslik);
check(/Vikipedi/.test(await page.textContent(tid('lib-back'))), 'okuyucudaki geri düğmesi koleksiyonun adını taşır');
await page.goBack();
await page.waitForSelector(tid('lib-coll-home'));
check(true, 'tarayıcı/Android geri tuşu makaleden koleksiyona döner');
await page.goBack();
await page.waitForSelector(tid('lib-home'));
check(true, 'ikinci geri Kitaplığım\'a döner');

// ---- Birleşik arama ---------------------------------------------------------------------------------
await page.click(tid('lib-search'));
await page.waitForSelector(tid('lib-search-cancel'));
await page.fill(tid('lib-search'), 'deprem');
await timed('arama "deprem"', () => page.waitForFunction(() => document.querySelector('[data-testid="lib-view"]')?.dataset.q === 'deprem' && document.querySelector('[data-testid="lib-result"]'), null, { timeout: 60000 }));
const first = (await page.textContent(`${tid('lib-result')} b`)).trim();
check(first === 'Deprem', 'ilk sonuç "Deprem": ' + first);
for (const [q, want] of [['İSTANBUL', 'İstanbul'], ['ıstanbul', 'İstanbul'], ['cig kofte', 'Çiğ köfte']]) {
  await page.fill(tid('lib-search'), q);
  await page.waitForFunction((q) => document.querySelector('[data-testid="lib-view"]')?.dataset.q === q.trim(), q, { timeout: 60000 });
  const top = await page.$$eval(`${tid('lib-result')} b`, (e) => e.slice(0, 4).map((x) => x.textContent));
  check(top.includes(want), `Türkçe duyarsız "${q}" → ${want} (${top.join(', ')})`);
}
if (cards.length > 1) check(!!(await page.$(tid('lib-src-all'))), 'birden çok koleksiyonda süzgeç çipleri');
await page.fill(tid('lib-search'), 'deprem');
await page.waitForFunction(() => document.querySelector('[data-testid="lib-view"]')?.dataset.state === 'idle', null, { timeout: 60000 });
await shot('03-arama');
check(!(await hOverflow()), 'arama: yatay taşma yok');

// ---- Makale ------------------------------------------------------------------------------------------
await page.click(`${tid('lib-result')} >> nth=0`);
await page.waitForSelector(tid('lib-article-body'), { timeout: 30000 });
check((await page.textContent(tid('lib-article-title'))) === 'Deprem', 'makale açıldı');
check(/Sonuçlar/.test(await page.textContent(tid('lib-back'))), 'geri düğmesi "Sonuçlar"');
const fs0 = await page.$eval(tid('lib-article-body'), (e) => parseFloat(getComputedStyle(e).fontSize));
await page.click(tid('lib-textsize'));
await page.waitForSelector(tid('lib-size-panel'));
await page.click(tid('lib-size-up'));
await page.click(tid('lib-size-up'));
const fs1 = await page.$eval(tid('lib-article-body'), (e) => parseFloat(getComputedStyle(e).fontSize));
check(fs1 > fs0 + 3, `yazı büyüdü: ${fs0} → ${fs1}`);
await shot('04-makale-yazi');
await page.click(tid('lib-size-down'));
await page.click(tid('lib-size-down'));
await page.click(tid('lib-find-toggle'));
await page.fill(tid('lib-find-input'), 'DEPR');
await page.waitForFunction(() => /\d+\/\d+/.test(document.querySelector('[data-testid="lib-find-count"]')?.textContent || ''));
check(true, 'sayfada bul (Türkçe duyarsız): ' + (await page.textContent(tid('lib-find-count'))));
await page.click(tid('lib-find-close'));
// İç bağlantı → geri/ileri
const link = await page.$(`${tid('lib-article-body')} a[data-zim-path]`);
if (link) {
  const lt = (await link.textContent()).trim();
  await link.click();
  await page.waitForFunction((t) => document.querySelector('[data-testid="lib-article-title"]')?.textContent !== 'Deprem', lt, { timeout: 30000 });
  check(!!(await page.$(tid('lib-nav-back'))), 'iç bağlantıdan sonra ‹ düğmesi: ' + (await page.textContent(tid('lib-article-title'))));
  await page.click(tid('lib-nav-back'));
  await page.waitForFunction(() => document.querySelector('[data-testid="lib-article-title"]')?.textContent === 'Deprem', null, { timeout: 30000 });
  check(!(await page.isDisabled(tid('lib-nav-fwd'))), 'geri sonrası › etkin');
}
// Okuma konumu kaydedilir
await page.evaluate(() => document.getElementById('main').scrollTo({ top: (document.getElementById('main').scrollHeight - document.getElementById('main').clientHeight) * 0.5 }));
await page.waitForTimeout(900);
check(!(await hOverflow()), 'makale: yatay taşma yok');
check((await small()).length === 0, 'makale: dokunma alanları ≥44px ' + (await small()).join(', '));
await page.click(tid('lib-back'));
await page.waitForSelector(tid('lib-view'));
check((await page.inputValue(tid('lib-search'))) === 'deprem', 'makaleden dönünce arama ve sonuçlar yerinde');
await page.click(tid('lib-search-cancel'));
await page.waitForSelector(tid('lib-continue'));
const cont = await page.textContent(tid('lib-continue'));
check(/KALDIĞIN YERDEN DEVAM ET/.test(cont) && /Deprem/.test(cont), 'Kitaplığım\'da "Kaldığın yerden devam et": Deprem');
check((await page.inputValue(tid('lib-search'))) === '', 'Kitaplığım\'a dönünce arama kutusu boş');
await shot('05-devam');
await page.click(tid('lib-continue'));
await page.waitForSelector(tid('lib-article-body'));
await page.waitForTimeout(500);
const y = await page.evaluate(() => { const m = document.getElementById('main'); return m.scrollTop / (m.scrollHeight - m.clientHeight); });
check(y > 0.3, `kaldığı yere kaydırıldı (oran ${y.toFixed(2)})`);
// Fener'e sor
await page.click(tid('lib-ask'));
await page.waitForFunction(() => new URLSearchParams(location.search) && document.querySelector('[data-testid="nav-fener"][aria-current="page"], [data-testid="nav-fener"].on, [data-testid="nav-fener"][aria-selected="true"]') || !document.querySelector('[data-testid="lib-article"]'), null, { timeout: 10000 });
check(!(await page.$(tid('lib-article'))), '"Fener\'e sor" Fener sekmesine geçti');
await page.click(tid('nav-kutuphane'));
await page.waitForSelector(tid('lib-article'));
check(true, 'Kütüphane\'ye dönünce makale açık kaldı');
await page.click(tid('nav-kutuphane'));
await page.waitForSelector(tid('lib-home'));
check(true, 'açık sekmeye yeniden dokununca Kitaplığım');

// ---- Kitap kitaplığı (PDF) ---------------------------------------------------------------------------
const kitap = (await page.$$eval(tid('lib-coll'), (els) => els.map((e) => e.dataset.src))).find((s) => /zimgit|kitap/.test(s));
if (kitap) {
  await page.click(`${tid('lib-coll')}[data-src="${kitap}"]`);
  await page.waitForSelector(tid('lib-book'), { timeout: 30000 });
  check(!(await page.$(tid('lib-main'))), 'kitap kitaplığında kitap listesi doğrudan koleksiyon ekranında');
  const bt = (await page.textContent(`${tid('lib-book')} .kt-book-title`)).trim();
  await page.click(`${tid('lib-book-open')} >> nth=0`);
  await page.waitForSelector('[data-testid="pdf-pages"] canvas', { timeout: 60000 });
  check(!(await page.$(tid('lib-bar-top'))), 'PDF okuyucuda tek çubuk (makale çubuğu gizli)');
  await shot('06-pdf');
  const pages = Number(((await page.textContent(tid('pdf-page'))).match(/\/ (\d+)/) || [])[1]);
  if (pages >= 2) {
    await page.evaluate(() => document.getElementById('main').scrollBy(0, document.querySelector('[data-page="2"]').getBoundingClientRect().top - 120));
    await page.waitForFunction(() => /sayfa 2/.test(document.querySelector('[data-testid="pdf-page"]').textContent), null, { timeout: 10000 });
    await page.waitForTimeout(900);
  }
  await page.click(tid('pdf-back'));
  await page.waitForSelector(tid('lib-coll-home'));
  check(true, 'PDF geri düğmesi koleksiyona döner');
  await page.click(tid('lib-coll-back'));
  const c2 = await page.textContent(tid('lib-continue'));
  check(c2.includes(bt), `"Kaldığın yerden devam et" kitabın adını gösterir (${bt})`);
  if (pages >= 2) {
    check(/2\. sayfa/.test(c2), 'son okunan sayfa: ' + c2);
    await page.click(tid('lib-continue'));
    await page.waitForFunction(() => /sayfa 2/.test(document.querySelector('[data-testid="pdf-page"]')?.textContent || ''), null, { timeout: 30000 });
    check(true, 'devam edince PDF 2. sayfadan açılır');
    await page.click(tid('pdf-back'));
  }
  await page.waitForSelector(tid('lib-home'));
}
check(!!(await page.$(tid('lib-recent'))) || !kitap, 'Son okunanlar listesi');

// ---- Yer aç ve yönet --------------------------------------------------------------------------------
await page.click(tid('lib-open-manage'));
await page.waitForSelector(tid('lib-manage-panel'));
check(/Yer aç ve yönet/.test(await page.textContent(tid('lib-manage-panel'))), '"Yer aç ve yönet" ekranı');
await page.goBack();
await page.waitForSelector(tid('lib-home'));

check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
await browser.close();
console.log(fails ? `\n${fails} kontrol başarısız` : '\nTÜMÜ OK');
process.exit(fails ? 1 : 0);
