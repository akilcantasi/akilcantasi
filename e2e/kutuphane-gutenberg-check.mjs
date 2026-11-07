// Kütüphane: Project Gutenberg (ve betikle çizilen öteki giriş sayfaları) + okuyucuda sabit kabuk.
//   npm run build   (ya da QA_DIST=/tmp/kt-dist)
//   node e2e/kutuphane-gutenberg-check.mjs [ekran-klasörü]
// Sunucuyu kendisi başlatır (geçici veri klasörü): testdata/sample_gutenberg_en.zim (gutenberg2zim
// düzeni: JS ile çizilen index.html + "loading" GIF'i, "<Başlık>_cover.<no>.html", "<Başlık>.<no>.html"),
// testdata/sample_kitap_en.zim (PDF kitaplığı) ve python-libzim varsa tek sayfası ~4 MB büyük bir kitap.
// Denetimler (sahibin hatası: "Gutenberg'i açtım, çirkin bir loading gif gözüküyor ama sayfa açılmıyor"):
//  • koleksiyon ekranında boş giriş sayfası yerine uygulamanın kendi alfabetik kitap listesi; kapaklar yok,
//    yazarlar var; harfe atlama; koleksiyonda arama yalnız kitapları getirir; kitap açılır, GIF yok
//  • eski "Okumaya başla" kaydı (giriş sayfası) okuyucuda da listeye döner; süzme çalışır
//  • büyük kitap: ilk görünüm hızlı, uzun donma yok (4× yavaşlatılmış işlemci), okuma konumu korunur
//  • Android öykünmesi (412×915, dokunmatik): okuyucuda ve PDF okuyucuda sonuna kadar kaydırınca
//    alttaki menü yerinde kalır
// Çıkış kodu: hata varsa 1.
import { createRequire } from 'module';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = process.argv[2] || '/tmp/kutuphane-gutenberg';
fs.mkdirSync(SHOTS, { recursive: true });
const dist = process.env.QA_DIST ?? path.join(ROOT, 'dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/index.html yok: önce `npm run build`');
  process.exit(2);
}

const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const tid = (id) => `[data-testid="${id}"]`;

// Veri klasörü (sunucu içine anahtar dosyası yazar: gerçek dosyalar kopyalanır)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kt-gutenberg-'));
const data = path.join(tmp, 'data');
fs.mkdirSync(data);
fs.copyFileSync(path.join(ROOT, 'testdata/sample_gutenberg_en.zim'), path.join(data, 'sample_gutenberg_en.zim'));
fs.copyFileSync(path.join(ROOT, 'testdata/sample_kitap_en.zim'), path.join(data, 'sample_kitap_en.zim'));
const buyuk = path.join(tmp, 'gutenberg_en_buyuk.zim');
const py = spawnSync('python3', ['-I', path.join(ROOT, 'tools/make_sample_zim.py'), 'gutenberg-buyuk', buyuk, '4000000'], { encoding: 'utf8' });
const buyukVar = py.status === 0 && fs.existsSync(buyuk);
if (buyukVar) fs.renameSync(buyuk, path.join(data, 'gutenberg_en_buyuk.zim'));
else console.log('     (bilgi: python-libzim yok, büyük kitap denetimi atlandı)');

const srv = await startServer({ port: 0, host: '127.0.0.1', data, dist, apkDirs: [data] });
const base = `http://127.0.0.1:${srv.port}`;
const browser = await pw.chromium.launch();
const errors = [];

async function yeni(opts = { viewport: { width: 390, height: 844 } }) {
  const ctx = await browser.newContext(opts);
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED|ERR_FAILED|ERR_PROXY/.test(m.text())) errors.push('console: ' + m.text()); });
  return { ctx, page };
}
/** Son okunanlara bir kayıt koyup Kitaplığım'dan açar (okuyucuya doğrudan bağlantı yok) */
async function kayittanAc(page, ref, src, y) {
  await page.goto(base + '/?tab=kutuphane', { waitUntil: 'domcontentloaded' });
  await page.evaluate(([ref, src, y]) => localStorage.setItem('ac.lib.okunan', JSON.stringify([{ ref, title: 'Kayıt', src, at: Date.now(), ...(y ? { y } : {}) }])), [ref, src, y]);
  await page.goto(base + '/?tab=kutuphane', { waitUntil: 'networkidle' });
  await page.click(tid('lib-continue'));
}
async function koleksiyonuAc(page, id) {
  await page.goto(base + '/?tab=kutuphane', { waitUntil: 'networkidle' });
  await page.click(`${tid('lib-coll')}[data-src="${id}"]`);
  await page.waitForSelector(tid('lib-coll-home'));
}
const gifGorunur = (page) => page.evaluate(() => [...document.querySelectorAll('#main img')].some((i) => !i.hidden && /load|spinner/i.test(i.src + i.alt)));

// ---------------------------------------------------------------- 1) koleksiyon ekranı: kendi kitap listemiz
{
  const { ctx, page } = await yeni({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await koleksiyonuAc(page, 'sample_gutenberg_en.zim');
  await page.waitForSelector(`${tid('lib-dizin')} ${tid('lib-dizin-item')}`, { timeout: 30000 });
  await page.waitForTimeout(300);
  check(!(await page.$(tid('lib-main'))), 'Gutenberg: boş giriş sayfasına giden "Okumaya başla" yok, onun yerine kitap listesi');
  const kitaplar = await page.$$eval(tid('lib-dizin-item'), (x) => x.map((e) => ({ path: e.dataset.path, t: e.querySelector('b').textContent, a: e.querySelector('span span')?.textContent ?? '' })));
  check(kitaplar.length === 40 && !kitaplar.some((k) => /_cover\.|index\.html/.test(k.path)), `40 kitap, kapak ve giriş sayfası yok (${kitaplar.length})`);
  const adlar = kitaplar.map((k) => k.t);
  check(adlar.join('|') === [...adlar].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).join('|'), 'kitaplar alfabetik');
  check(kitaplar.find((k) => k.t === 'Pride and Prejudice')?.a === 'Jane Austen', 'yazar adı JS veri dosyasından geliyor');
  await page.screenshot({ path: path.join(SHOTS, 'gutenberg-koleksiyon.png') });
  // Harfe atla
  await page.click('[aria-label="P harfi"]');
  await page.waitForFunction(() => document.querySelector('[data-testid="lib-dizin-item"] b')?.textContent.startsWith('P'), null, { timeout: 10000 }).catch(() => {});
  check((await page.textContent(`${tid('lib-dizin-item')} b`))?.startsWith('P'), 'harfe atlama: "P" ile başlayan ilk kitaptan devam');
  // Koleksiyonda arama: yalnız kitaplar (kapak sayfası ikinci kez görünmez)
  await page.fill(tid('lib-search'), 'dracula');
  await page.waitForFunction(() => { const v = document.querySelector('[data-testid="lib-view"]'); return v && v.dataset.state === 'idle'; }, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(400);
  const sonuc = await page.$$eval(`${tid('lib-results')} li`, (x) => x.map((e) => e.textContent.trim()).filter((t) => /Dracula/.test(t)));
  check(sonuc.length === 1, 'koleksiyonda arama: "Dracula" bir kez (kapak sayfası elendi) → ' + JSON.stringify(sonuc));
  await page.fill(tid('lib-search'), '');
  // Kitabı aç
  await page.locator('.kt-harfler .chip').first().click();
  await page.waitForSelector(tid('lib-dizin-item'));
  await page.click(`${tid('lib-dizin-item')}[data-path="Pride and Prejudice.1342.html"]`).catch(() => page.locator(tid('lib-dizin-item'), { hasText: 'Pride and Prejudice' }).first().click());
  await page.waitForSelector(`${tid('lib-article')}[data-hazir="1"]`, { timeout: 30000 });
  check((await page.textContent(tid('lib-article-title'))) === 'Pride and Prejudice', 'kitap açılıyor');
  check((await page.textContent(tid('lib-article-body'))).includes('Chapter 1'), 'kitabın metni görünüyor');
  check(!(await gifGorunur(page)), 'kitapta "loading" görseli yok');
  await page.screenshot({ path: path.join(SHOTS, 'gutenberg-kitap.png') });
  // Geri: koleksiyon listesine
  await page.click(tid('lib-back'));
  await page.waitForSelector(tid('lib-dizin-item'));
  check(true, 'kitaptan geri dönünce liste yerinde');
  await ctx.close();
}

// ---------------------------------------------------------------- 2) okuyucuda giriş sayfası (eski kayıt)
{
  const { ctx, page } = await yeni();
  await kayittanAc(page, '@sample_gutenberg_en.zim/index.html', 'sample_gutenberg_en.zim');
  await page.waitForSelector(`${tid('lib-dizin-sayfa')} ${tid('lib-dizin-item')}`, { timeout: 30000 });
  check(!(await gifGorunur(page)) && !(await page.$(tid('lib-article-body'))), 'okuyucu: betikli giriş sayfası yerine kitap listesi, GIF yok');
  await page.fill(`${tid('lib-dizin-sayfa')} input[type=search]`, 'austen');
  await page.waitForTimeout(900);
  const s = await page.$$eval(tid('lib-dizin-item'), (x) => x.map((e) => e.querySelector('b').textContent));
  check(s.includes('Pride and Prejudice') && s.includes('Emma') && s.length === 3, 'okuyucu: süzme yazar adıyla da çalışıyor → ' + s.join(', '));
  await ctx.close();
}

// ---------------------------------------------------------------- 3) büyük kitap: hız ve okuma konumu
if (buyukVar) {
  const { ctx, page } = await yeni();
  await ctx.addInitScript(() => {
    window.__kare = [];
    try {
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__kare.push(Math.round(e.duration)))).observe({ type: 'long-animation-frame', buffered: true });
    } catch {}
  });
  const ref = '@gutenberg_en_buyuk.zim/Pride and Prejudice.1342.html';
  await page.goto(base + '/?tab=kutuphane', { waitUntil: 'domcontentloaded' });
  await page.evaluate((ref) => localStorage.setItem('ac.lib.okunan', JSON.stringify([{ ref, title: 'Kayıt', src: 'gutenberg_en_buyuk.zim', at: Date.now() }])), ref);
  await page.goto(base + '/?tab=kutuphane', { waitUntil: 'networkidle' });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => (window.__kare = []));
  const t0 = Date.now();
  await page.click(tid('lib-continue'));
  await page.waitForSelector(`${tid('lib-article-body')} p`, { timeout: 60000 });
  const ilk = Date.now() - t0;
  await page.waitForSelector(`${tid('lib-article')}[data-hazir="1"]`, { timeout: 120000 });
  const kare = await page.evaluate(() => window.__kare);
  const boy = await page.evaluate(() => document.querySelector('[data-testid="lib-article-body"]').textContent.length);
  console.log(`     büyük kitap (${(boy / 1e6).toFixed(1)} M karakter, 4× yavaş işlemci): ilk görünüm ${ilk} ms, uzun kareler ${JSON.stringify(kare)}`);
  // Önceden tek seferde ~14 s donuyordu (metin çıkarımı + tek parça innerHTML)
  check(ilk < 6000, `büyük kitap: ilk metin ${ilk} ms içinde görünüyor (< 6 s, 4× yavaş işlemci)`);
  // Yalnız açılış karesi (temizleme + ilk parça) uzun olabilir; kalanı kısa dilimler
  const uzun = kare.filter((d) => d >= 400);
  check(uzun.length <= 1 && Math.max(0, ...kare) < 1500, 'büyük kitap: açılış karesi < 1,5 s, sonrasında 400 ms üstü donma yok (parça parça yerleşiyor)');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  // Okuma konumu
  const gorunen = () => page.evaluate(() => { const top = document.getElementById('main').getBoundingClientRect().top + 80; return [...document.querySelectorAll('.kt-blok')].find((e) => e.getBoundingClientRect().bottom > top)?.textContent.slice(0, 70); });
  await page.evaluate(() => { const m = document.getElementById('main'); m.scrollTop = m.scrollHeight * 0.42; });
  await page.mouse.move(200, 400);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(1000);
  const once = await gorunen();
  await page.goto(base + '/?tab=kutuphane', { waitUntil: 'networkidle' });
  await page.click(tid('lib-continue'));
  await page.waitForSelector(`${tid('lib-article')}[data-hazir="1"]`, { timeout: 120000 });
  await page.waitForTimeout(600);
  const sonra = await gorunen();
  check(!!once && once === sonra, `büyük kitap: kaldığın yerden devam aynı paragrafa dönüyor (${once?.slice(0, 50)} → ${sonra?.slice(0, 50)})`);
  // Sayfada bul tam metinde çalışır
  await page.click(tid('lib-find-toggle'));
  await page.fill(tid('lib-find-input'), 'chapter 2000 of');
  await page.waitForTimeout(800);
  check(/^1\/\d+/.test(await page.textContent(tid('lib-find-count'))), 'büyük kitap: sayfada bul sondaki bölümleri de buluyor');
  await ctx.close();
}

// ---------------------------------------------------------------- 4) Android öykünmesi: okuyucuda menü yerinde
{
  const { ctx, page } = await yeni({ ...pw.devices['Galaxy S9+'], viewport: { width: 412, height: 915 } });
  const cdp = await ctx.newCDPSession(page);
  const kutu = () => page.evaluate(() => { const r = document.querySelector('.app-nav').getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round).join(','); });
  const sonaKadar = async () => {
    for (let i = 0; i < 4; i++) await cdp.send('Input.synthesizeScrollGesture', { x: 200, y: 640, yDistance: -3000, speed: 6000, gestureSourceType: 'touch' }).catch(() => {});
    await page.mouse.move(200, 500);
    for (let i = 0; i < 8; i++) await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(300);
  };
  const durum = () => page.evaluate(() => ({ belge: document.scrollingElement.scrollTop + document.body.scrollTop + document.getElementById('app').scrollTop, main: document.getElementById('main').scrollTop }));
  const ekranlar = [
    ['okuyucu (uzun kitap)', '@sample_gutenberg_en.zim/War and Peace.2600.html', 'sample_gutenberg_en.zim', `${tid('lib-article')}[data-hazir="1"]`],
    ['okuyucu (kitap listesi)', '@sample_gutenberg_en.zim/index.html', 'sample_gutenberg_en.zim', tid('lib-dizin-item')],
  ];
  if (buyukVar) ekranlar.push(['okuyucu (4 MB kitap)', '@gutenberg_en_buyuk.zim/Pride and Prejudice.1342.html', 'gutenberg_en_buyuk.zim', `${tid('lib-article')}[data-hazir="1"]`]);
  for (const [ad, ref, src, bekle] of ekranlar) {
    await kayittanAc(page, ref, src);
    await page.waitForSelector(bekle, { timeout: 60000 });
    const n0 = await kutu();
    await sonaKadar();
    const n1 = await kutu();
    const d = await durum();
    check(n0 === n1 && d.belge === 0, `kabuk, ${ad}: sonuna kadar kaydırınca menü yerinde (${n0} → ${n1}, belge ${d.belge}, içerik ${d.main})`);
  }
  // PDF okuyucu (kitap kitaplığı)
  await koleksiyonuAc(page, 'sample_kitap_en.zim');
  await page.waitForSelector(tid('lib-book-open'), { timeout: 30000 });
  await page.locator(tid('lib-book-open')).first().click();
  await page.waitForSelector('.po-page canvas, [data-testid="po-page"], .po-pages canvas', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(800);
  const p0 = await kutu();
  await sonaKadar();
  const p1 = await kutu();
  const pd = await durum();
  check(p0 === p1 && pd.belge === 0, `kabuk, PDF okuyucu: sonuna kadar kaydırınca menü yerinde (${p0} → ${p1})`);
  await ctx.close();
}

check(errors.length === 0, 'konsol/sayfa hatası yok' + (errors.length ? ' → ' + errors.slice(0, 5).join(' | ') : ''));
await browser.close();
await srv.close?.();
fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails.length ? `\n${fails.length} HATA` : '\nHepsi geçti');
process.exit(fails.length ? 1 : 0);
