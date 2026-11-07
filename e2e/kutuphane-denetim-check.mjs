// Kütüphane denetimi regresyon kontrolü (yeni tasarım 2026-11) — Vite dev sunucusunda (?devzim=) çalışır:
//   node e2e/kutuphane-denetim-check.mjs [http://localhost:5199/] [ekran-klasörü]
// Denetlenenler: PDF okuyucunun tek çubukla tam ekran açılması, büyük yazıda çubuklar, arama
// sonuçlarının taşmaması, çeviri açıkken kapat düğmesinin ekranda kalması, makaledeki PDF
// bağlantısının uygulama içinde açılması, SVG'nin metin olarak gösterilmemesi, büyük PDF'te tuval
// sınırı / yakınlaştırmada yerin korunması, mağazada başlangıç seti / indir / duraklat / devam /
// iptal / yer yetmez, inen içeriğin Kitaplığım'da görünmesi, silme, gizlenen çevirinin baştan
// çevrilmemesi. Ekran görüntüleri: indirme sürerken mağaza (magaza-iniyor.png) dahil.
// Büyük PDF'li sınama arşivi python3 + libzim + reportlab ile üretilir (yoksa o adım atlanır).
import { createRequire } from 'module';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/server.mjs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
const SHOTS = process.argv[3] ?? '/tmp/kutuphane-denetim';
fs.mkdirSync(SHOTS, { recursive: true });
const tid = (id) => `[data-testid="${id}"]`;
const ZIMS = '/testdata/sample_kitap_en.zim,/testdata/sample_med_en.zim,/testdata/sample_tr.zim';
let fails = 0;
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'HATA ') + m); if (!ok) fails++; };
const IGNORE = /ERR_TUNNEL|ERR_INTERNET|ERR_NAME|raw\.githubusercontent|Failed to load resource/;
const browser = await pw.chromium.launch();

async function open(query, { vp = { width: 390, height: 844 }, large = false, setup } = {}) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, acceptDownloads: true });
  if (setup) await setup(ctx);
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !IGNORE.test(m.text())) errors.push('console: ' + m.text()); });
  if (large) await p.addInitScript(() => localStorage.setItem('ac.settings', JSON.stringify({ textSize: 3 })));
  await p.goto(BASE + query, { waitUntil: 'networkidle' });
  return { ctx, p, errors };
}
const small = (p) => p.$$eval('#main button, #main input', (els) => els.filter((e) => e.offsetParent && !e.closest('.kt-body')).map((e) => ({ id: e.dataset.testid || e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20), r: e.getBoundingClientRect() })).filter((x) => x.r.width > 0 && (x.r.width < 43.5 || x.r.height < 43.5)).map((x) => `${x.id} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`));
const hOverflow = (p) => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);

// ---- 1) PDF okuyucu: makale çubuğu, arama sonuçları, çeviri kutusu ----------------------------
const ONLY = process.env.ONLY; // ör. ONLY=360-buyuk,dosya,magaza,ceviri
const want = (n) => !ONLY || ONLY.split(',').includes(n);
for (const [vp, large, tag] of [[{ width: 390, height: 844 }, false, '390'], [{ width: 360, height: 640 }, false, '360'], [{ width: 360, height: 640 }, true, '360-buyuk']].filter((x) => want(x[2]))) {
  const { ctx, p, errors } = await open(`?tab=kutuphane&devzim=${ZIMS}`, { vp, large });
  await p.waitForSelector(`${tid('lib-coll')}[data-src="sample_kitap_en.zim"]`, { timeout: 30000 });
  await p.click(`${tid('lib-coll')}[data-src="sample_kitap_en.zim"]`);
  await p.waitForSelector(tid('lib-books'), { timeout: 30000 });
  check(!(await p.$(tid('lib-main'))), `${tag}: kitap kitaplığında kitaplar doğrudan koleksiyon ekranında`);
  await p.click(`${tid('lib-book')}:has-text("Water Storage") ${tid('lib-book-open')}`);
  await p.waitForSelector('[data-page="1"] canvas', { timeout: 30000 });
  check(!(await p.$(tid('lib-bar-top'))) && !(await p.$(tid('lib-coll-home'))), `${tag}: PDF tam ekran, tek çubukla açılır`);
  await p.evaluate(() => document.getElementById('main').scrollTo(0, 700));
  await p.waitForTimeout(400);
  const bars = await p.evaluate(() => {
    const b = document.querySelector('.po-top').getBoundingClientRect();
    return { poTop: Math.round(b.top), mainTop: Math.round(document.getElementById('main').getBoundingClientRect().top) };
  });
  check(bars.poTop === bars.mainTop, `${tag}: kaydırınca PDF çubuğu yapışık kalır ` + JSON.stringify(bars));
  await p.fill(tid('pdf-search'), 'water');
  await p.waitForSelector(tid('pdf-hit'), { timeout: 20000 });
  await p.waitForFunction(() => !document.querySelector('[data-testid="pdf-scan"]'));
  const squeezed = await p.$$eval(tid('pdf-hit'), (b) => b.filter((x) => x.scrollHeight > x.clientHeight + 1).length);
  check(squeezed === 0, `${tag}: arama sonucu düğmelerinde yazı taşmıyor (${squeezed})`);
  await p.screenshot({ path: `${SHOTS}/pdf-arama-${tag}.png` });
  await p.click(tid('pdf-translate'));
  await p.waitForSelector(tid('lib-translation'));
  await p.waitForTimeout(400);
  check(!(await p.$(tid('pdf-hits'))), `${tag}: çeviri açıkken sonuç listesi gizli`);
  await p.evaluate(() => document.getElementById('main').scrollBy(0, 1500));
  await p.waitForTimeout(300);
  const tr = await p.evaluate(() => {
    const c = document.querySelector('[data-testid="pdf-translate-close"]').getBoundingClientRect();
    const t = document.querySelector('.po-top');
    const nav = document.querySelector('.app-nav').getBoundingClientRect();
    return { closeBottom: Math.round(c.bottom), navTop: Math.round(nav.top), topScrolls: t.scrollHeight > t.clientHeight };
  });
  check(tr.closeBottom <= tr.navTop || tr.topScrolls, `${tag}: "Çeviriyi kapat" ekranda ya da çubuk kendi içinde kayıyor ` + JSON.stringify(tr));
  await p.screenshot({ path: `${SHOTS}/pdf-ceviri-${tag}.png` });
  check((await small(p)).length === 0, `${tag}: PDF okuyucuda dokunma alanları ≥44px ` + (await small(p)).join(', '));
  check(!(await hOverflow(p)), `${tag}: yatay taşma yok`);
  await p.click(tid('pdf-translate-close'));
  await p.click(tid('pdf-back'));
  await p.waitForSelector(tid('lib-books'));
  check(!!(await p.$(tid('lib-coll-home'))), `${tag}: PDF kapanınca koleksiyon ekranına dönülür`);
  await p.click(tid('lib-coll-back'));
  // Makale: büyük yazıda geri düğmesi ezilmez, araç düğmeleri ekrana sığar
  await p.waitForSelector(tid('lib-search'));
  await p.click(tid('lib-search'));
  await p.fill(tid('lib-search'), 'bleeding');
  await p.waitForSelector(tid('lib-result'));
  await p.click(`${tid('lib-result')} >> nth=0`);
  await p.waitForSelector(tid('lib-article-title'));
  // ‹ › yalnız geçmiş varken görünür: ölçüm için bir iç bağlantı izlenir, sonra geri
  const il = await p.$(`${tid('lib-article-body')} a[data-zim-path]`);
  if (il) {
    await il.click();
    await p.waitForSelector(tid('lib-nav-back'));
    await p.click(tid('lib-nav-back'));
    await p.waitForFunction(() => /Bleeding/i.test(document.querySelector('[data-testid="lib-article-title"]')?.textContent || ''));
  }
  await p.click(tid('lib-find-toggle'));
  await p.fill(tid('lib-find-input'), 'blood');
  await p.waitForTimeout(300);
  const geo = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const back = r('[data-testid="lib-back"]');
    const ibtn = r(document.querySelector('[data-testid="lib-nav-back"]') ? '[data-testid="lib-nav-back"]' : '[data-testid="lib-textsize"]');
    const out = [...document.querySelectorAll('.kt-bar button, .kt-bar input')].filter((e) => e.getBoundingClientRect().right > vw + 1).length;
    return { back: Math.round(back.width), backH: Math.round(back.height), ibtnH: Math.round(ibtn.height), find: Math.round(r('[data-testid="lib-find-input"]').width), out };
  });
  check(geo.back >= 80 && geo.backH <= geo.ibtnH + 2 && geo.find >= 100 && geo.out === 0, `${tag}: makale çubuğu sığıyor (geri tek satır, bulma kutusu geniş) ` + JSON.stringify(geo));
  await p.screenshot({ path: `${SHOTS}/makale-bul-${tag}.png` });
  check((await small(p)).length === 0, `${tag}: makalede dokunma alanları ≥44px ` + (await small(p)).join(', '));
  check(errors.length === 0, `${tag}: konsol hatası yok` + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

// ---- 2) Makaledeki dosya bağlantıları + büyük PDF ------------------------------------------
const zimOut = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'kt-denetim-')), 'denetim_en.zim');
const py = `
import sys, os
sys.path.insert(0, ${JSON.stringify(path.join(ROOT, 'tools'))})
import make_sample_zim as m
from libzim.writer import Creator, Item, StringProvider, Hint, Compression
class It(Item):
    def __init__(self, p, t, data, mime, front=False):
        super().__init__(); self.p, self.t, self.data, self.mime, self.front = p, t, data, mime, front
    def get_path(self): return self.p
    def get_title(self): return self.t
    def get_mimetype(self): return self.mime
    def get_contentprovider(self): return StringProvider(self.data)
    def get_hints(self): return {Hint.FRONT_ARTICLE: self.front}
pages = [[f"Chapter {i+1}", "", f"This is page {i+1} of a long manual about shelters.", f"Unique marker zebra{i+1:03d}."] for i in range(400)]
body = '<ul><li><a href="files/big-manual.pdf">Big manual</a></li><li><a href="files/drawing.svg">Drawing</a></li><li><a href="files/photo.png">Photo</a></li><li><a href="files/guide.epub">Guide</a></li></ul>'
import base64
png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
with Creator(sys.argv[1]).config_indexing(False, "eng").config_compression(Compression.zstd) as c:
    c.set_mainpath("Index")
    for k, v in {"Title": "Denetim Files", "Description": "File links test", "Language": "eng", "Name": "denetim_en", "Date": "2026-01-01"}.items():
        c.add_metadata(k, v)
    c.add_item(It("Index", "Index", m.page("Index", body), "text/html", True))
    c.add_item(It("files/big-manual.pdf", "Big manual", m.make_pdf(pages), "application/pdf"))
    c.add_item(It("files/drawing.svg", "Drawing", '<svg xmlns="http://www.w3.org/2000/svg"><circle r="4"/></svg>', "image/svg+xml"))
    c.add_item(It("files/photo.png", "Photo", png, "image/png"))
    c.add_item(It("files/guide.epub", "Guide", b"PK\x03\x04epub", "application/epub+zip"))
`;
const made = want('dosya') ? spawnSync('python3', ['-c', py, zimOut], { cwd: os.tmpdir(), encoding: 'utf8' }) : null;
if (!made) {
  // ONLY ile atlandı
} else if (made.status !== 0 || !fs.existsSync(zimOut)) {
  console.log('ATLANDI büyük PDF / dosya bağlantıları (python3 + libzim + reportlab yok): ' + (made.stderr || '').split('\n').filter(Boolean).pop());
} else {
  const buf = fs.readFileSync(zimOut);
  const serveZim = (ctx) => ctx.route((u) => u.pathname === '/__kt/denetim_en.zim', (r) => {
    const h = { 'accept-ranges': 'bytes', 'content-type': 'application/octet-stream' };
    const m = (r.request().headers()['range'] || '').match(/bytes=(\d+)-(\d*)/);
    if (!m) return r.fulfill({ status: 200, headers: h, body: buf });
    const s = +m[1];
    const e = m[2] ? Math.min(+m[2], buf.length - 1) : buf.length - 1;
    return r.fulfill({ status: 206, headers: { ...h, 'content-range': `bytes ${s}-${e}/${buf.length}` }, body: buf.subarray(s, e + 1) });
  });
  const { ctx, p, errors } = await open('?tab=kutuphane&devzim=/__kt/denetim_en.zim', { setup: serveZim });
  const popups = [];
  ctx.on('page', (np) => popups.push(np));
  const state = () => p.evaluate(() => ({ docTop: document.scrollingElement.scrollTop, page: document.querySelector('[data-testid="pdf-page"]')?.textContent ?? '' }));
  await p.waitForSelector(tid('lib-coll'), { timeout: 30000 });
  await p.click(tid('lib-coll'));
  await p.waitForSelector(tid('lib-main'), { timeout: 30000 });
  await p.click(tid('lib-main'));
  await p.waitForSelector(`${tid('lib-article-body')} a:has-text("Drawing")`);
  await p.click(`${tid('lib-article-body')} a:has-text("Drawing")`);
  await p.waitForSelector(`${tid('lib-file')}, ${tid('lib-article-body')} pre`, { timeout: 10000 });
  check(!!(await p.$(tid('lib-file'))), 'SVG kaynak kodu olarak değil dosya kartıyla gösterilir');
  await p.click(tid('lib-nav-back'));
  await p.waitForSelector(`${tid('lib-article-body')} a:has-text("Big manual")`);
  await p.click(`${tid('lib-article-body')} a:has-text("Big manual")`);
  await p.waitForSelector('[data-page="1"] canvas', { timeout: 60000 });
  check(popups.length === 0, 'makaledeki PDF bağlantısı uygulama içi okuyucuda açıldı (yeni pencere yok)');
  check(/sayfa 1 \/ 400/.test((await state()).page), 'büyük PDF açıldı (400 sayfa)');
  for (let i = 0; i < 30; i++) { await p.evaluate(() => document.getElementById('main').scrollBy(0, 3000)); await p.waitForTimeout(60); }
  await p.waitForTimeout(1000);
  const canv = await p.$$eval('[data-testid="pdf-pages"] canvas', (c) => c.length);
  check(canv <= 15, `hızlı kaydırmadan sonra tuval sayısı sınırlı: ${canv} (önceden 70'ten çok)`);
  const cur = await p.evaluate(() => { const n = Number((document.querySelector('[data-testid="pdf-page"]').textContent.match(/sayfa (\d+)/) || [])[1]); return !!document.querySelector(`[data-page="${n}"] canvas`); });
  check(cur, 'kaydırma durunca görünen sayfa çizili');
  const before = (await state()).page.match(/sayfa (\d+)/)[1];
  await p.click(tid('pdf-zoom-in'));
  await p.waitForTimeout(600);
  const after = (await state()).page.match(/sayfa (\d+)/)[1];
  check(before === after, `yakınlaştırınca okunan sayfa korunur: ${before} → ${after}`);
  await p.click(tid('pdf-zoom-out'));
  await p.fill(tid('pdf-search'), 'zebra400');
  await p.waitForSelector(tid('pdf-hit'), { timeout: 60000 });
  await p.waitForFunction(() => !document.querySelector('[data-testid="pdf-scan"]'), null, { timeout: 60000 });
  await p.click(tid('pdf-hit'));
  await p.waitForTimeout(600);
  const end = await state();
  check(/sayfa 400/.test(end.page) && end.docTop === 0, 'son sayfadaki sonuca gidince belge (uygulama başlığı) kaymaz ' + JSON.stringify(end));
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
  // Android (Capacitor taklidi): yeni pencere / blob indirme çalışmaz → resim uygulama içinde, desteklenmeyen tür için açıklama
  const nat = await open('?tab=kutuphane&devzim=/__kt/denetim_en.zim', {
    setup: async (c) => {
      await serveZim(c);
      await c.addInitScript(() => { window.Capacitor = { getPlatform: () => 'android', isNativePlatform: () => true, Plugins: {} }; });
    },
  });
  const np = nat.p;
  await np.waitForSelector(tid('lib-coll'), { timeout: 30000 });
  await np.click(tid('lib-coll'));
  await np.click(tid('lib-main'));
  await np.click(`${tid('lib-article-body')} a:has-text("Photo")`);
  await np.waitForSelector(`img${tid('lib-file-view')}`, { timeout: 10000 });
  check(!(await np.$(tid('lib-file-save'))) && !(await np.$(tid('lib-file-open'))), "Android: resim uygulama içinde gösterilir, çalışmayan 'Kaydet/Aç' düğmeleri yok");
  await np.click(tid('lib-nav-back'));
  await np.click(`${tid('lib-article-body')} a:has-text("Guide")`);
  await np.waitForSelector(tid('lib-file-unsupported'));
  check(/gösterilemiyor/.test(await np.textContent(tid('lib-file-unsupported'))), 'Android: desteklenmeyen dosya türü için açık ileti');
  check(nat.errors.length === 0, 'Android dosya görüntüleyici: konsol hatası yok' + (nat.errors.length ? ': ' + nat.errors.join(' | ') : ''));
  await nat.ctx.close();
}

// ---- 3) Mağaza: indir / duraklat / devam / iptal / sil / yer yetmez ---------------------------
if (want('magaza')) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kt-magaza-'));
  const mk = (n, size) => { const b = crypto.randomBytes(size); fs.writeFileSync(path.join(tmp, n), b); return crypto.createHash('sha256').update(b).digest('hex'); };
  const A = 6 * 1024 * 1024;
  const B = 3 * 1024 * 1024;
  const shaA = mk('kt-a.zim', A);
  const shaB = mk('kt-b.zim', B);
  const slow = await startServer({ port: 0, host: '127.0.0.1', data: tmp, dist: tmp, throttleBps: 1024 * 1024, quiet: true });
  const entry = (id, file, size, sha, shelf) => ({ id, kind: 'zim', name: 'Deneme ' + id, desc: 'deneme paketi', file, size, sha256: sha, tier: 'temel', urls: [`http://127.0.0.1:${slow.port}/data/${file}`], license: 'CC0', source: 'e2e', shelf });
  const manifest = { version: 99, updated: '2099-01-01', packs: [entry('kta', 'kt-a.zim', A, shaA, 'ansiklopedi'), entry('ktb', 'kt-b.zim', B, shaB, 'saglik')], sets: [{ id: 'temel', title: 'Temel set', desc: 'Deneme seti', ids: ['kta', 'ktb'] }] };
  const setup = (quota) => async (ctx) => {
    await ctx.route('**/packs-manifest.json', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify(manifest) }));
    await ctx.route('**/api/packs', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ files: [{ name: 'sample_tr.zim', size: 1, url: '/testdata/sample_tr.zim' }] }) }));
    if (quota != null) await ctx.addInitScript((q) => { const est = navigator.storage.estimate.bind(navigator.storage); navigator.storage.estimate = async () => ({ ...(await est()), quota: q, usage: 0 }); }, quota);
  };
  const q = '?tab=kutuphane&browserdl=1&devzim=/testdata/sample_tr.zim';
  const items = (p) => p.$$eval(tid('lib-store-item'), (r) => r.filter((x) => /kt-[ab]\.zim/.test(x.dataset.pack)).map((x) => ({ f: x.dataset.pack, s: x.dataset.state, t: x.textContent })));
  const { ctx, p, errors } = await open(q, { setup: setup(null) });
  await p.evaluate(async () => { try { const r = await navigator.storage.getDirectory(); for await (const [n] of r.entries()) await r.removeEntry(n, { recursive: true }); } catch {} localStorage.clear(); });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(tid('lib-coll'), { timeout: 30000 });
  await p.click(`${tid('lib-collections')} ${tid('lib-open-store')}`);
  await p.waitForSelector(tid('lib-starter'), { timeout: 30000 });
  check(/9 MB/.test(await p.textContent(tid('lib-starter-dl'))), 'başlangıç seti düğmesi toplam boyutu gösterir: ' + (await p.textContent(tid('lib-starter-dl'))));
  check((await p.$$(tid('lib-store-sec'))).length === 2, 'mağaza ihtiyaca göre bölümlere ayrılmış (2 bölüm)');
  check(/Telefona rahat sığar/.test(await p.textContent(tid('lib-store-item'))), 'öğede telefona sığma ipucu');
  await p.click(tid('lib-starter-dl'));
  await p.waitForFunction(() => /İndiriliyor · %\d+/.test(document.querySelector('[data-testid="lib-downloads"]')?.textContent || ''), null, { timeout: 15000 });
  await p.waitForTimeout(1500);
  check(!(await p.$(tid('lib-starter'))), 'indirme başlayınca başlangıç kartı gizlenir');
  const st = await p.textContent(tid('lib-downloads'));
  check(/%\d+ · \d+ (MB|KB) \/ \d+ MB/.test(st), 'indirme listesi yüzde ve boyut gösterir: ' + st.replace(/\s+/g, ' ').slice(0, 120));
  check((await items(p)).some((x) => x.s === 'iniyor' && /İndiriliyor %\d+/.test(x.t)), 'mağaza öğesi de ilerlemeyi yerinde gösterir');
  await p.screenshot({ path: `${SHOTS}/magaza-iniyor.png` });
  await p.click(tid('lib-store-back'));
  await p.waitForSelector(tid('lib-dl-strip'));
  check(/İndiriliyor · %\d+/.test(await p.textContent(tid('lib-dl-strip'))), "Kitaplığım'da indirme şeridi");
  await p.click(tid('lib-dl-strip'));
  await p.waitForSelector(tid('lib-downloads'));
  await p.click(tid('lib-bar-pause'));
  await p.waitForFunction(() => !/İndiriliyor/.test(document.querySelector('[data-testid="lib-downloads"]')?.textContent || ''), null, { timeout: 10000 });
  await p.waitForTimeout(400);
  let r = await items(p);
  check(r.some((x) => x.s === 'duraklatildi' && /Duraklatıldı %\d+/.test(x.t)), 'duraklatılan öğe "Duraklatıldı %NN": ' + r.map((x) => x.s).join(','));
  check(/Duraklatıldı · %\d+/.test(await p.textContent(tid('lib-downloads'))), 'indirme listesi de duraklatıldı der');
  await p.click(`${tid('lib-store-item')}[data-state="duraklatildi"] ${tid('lib-store-resume')} >> nth=0`);
  await p.waitForSelector(`${tid('lib-store-item')}[data-state="iniyor"]`, { timeout: 10000 });
  await p.click(`${tid('lib-store-item')}[data-state="iniyor"] ${tid('lib-store-cancel')} >> nth=0`);
  await p.waitForTimeout(800);
  r = await items(p);
  check(r.some((x) => x.s === 'yok'), 'iptal edilen içerik indirilmemiş duruma döndü: ' + r.map((x) => x.s).join(','));
  await p.waitForSelector(tid('lib-starter-dl'));
  check(/Kalanları indir|Başlangıç setini indir/.test(await p.textContent(tid('lib-starter-dl'))), 'başlangıç kartı geri geldi');
  await p.click(tid('lib-starter-dl'));
  await p.waitForFunction(() => [...document.querySelectorAll('[data-testid="lib-store-item"]')].filter((x) => /kt-[ab]\.zim/.test(x.dataset.pack) && x.dataset.state === 'telefonda').length === 2, null, { timeout: 90000 }).catch(() => {});
  r = await items(p);
  check(r.filter((x) => x.s === 'telefonda').length === 2, 'iki içerik indi ve "✓ Telefonda": ' + r.map((x) => x.s).join(','));
  check(!!(await p.$(tid('lib-store'))), 'indirme bitince mağaza ekranı yerinde kaldı');
  await p.click(`${tid('lib-store-item')}[data-pack="kt-a.zim"] ${tid('lib-store-read')}`);
  await p.waitForSelector(`${tid('lib-coll-home')}[data-src="kt-a.zim"]`);
  check(true, '"Oku" koleksiyon ekranını açar');
  await p.click(tid('lib-coll-back'));
  const cards = await p.$$eval(tid('lib-coll'), (b) => b.map((x) => x.dataset.src));
  check(cards.includes('kt-a.zim') && cards.includes('kt-b.zim'), "inenler Kitaplığım'da: " + cards.join(', '));
  await p.click(tid('lib-open-manage'));
  await p.click(`${tid('lib-manage-panel')} ${tid('pack-row')}[data-pack="kt-b.zim"] ${tid('pack-delete')}`);
  check(/3 MB yer açılır/.test(await p.textContent(tid('pack-delete-q'))), 'silme onayı ne kadar yer açılacağını söyler');
  await p.click(tid('pack-delete-yes'));
  await p.waitForFunction(() => !document.querySelector('[data-testid="lib-manage-panel"] [data-pack="kt-b.zim"]'), null, { timeout: 10000 }).catch(() => {});
  check(!(await p.$(`${tid('lib-manage-panel')} [data-pack="kt-b.zim"]`)) && !!(await p.$(tid('lib-manage-panel'))), 'silinen içerik listeden kalktı, ekran açık kaldı');
  check(errors.length === 0, 'mağaza: konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await p.evaluate(async () => { try { const r = await navigator.storage.getDirectory(); for await (const [n] of r.entries()) await r.removeEntry(n, { recursive: true }); } catch {} });
  await ctx.close();
  const o = await open(q, { setup: setup(5 * 1024 * 1024) });
  await o.p.waitForSelector(tid('lib-coll'), { timeout: 30000 });
  await o.p.click(`${tid('lib-collections')} ${tid('lib-open-store')}`);
  await o.p.waitForSelector(tid('lib-starter'), { timeout: 30000 });
  await o.p.waitForTimeout(400);
  check(/Yer yetmez \(5 MB boş\)/.test(await o.p.textContent(tid('lib-starter-fit'))) && (await o.p.isDisabled(tid('lib-starter-dl'))), 'yer yetmezse uyarı ve "İndir" kapalı');
  await o.p.screenshot({ path: `${SHOTS}/magaza-yer-yok.png` });
  await o.ctx.close();
  await slow.close?.();
}

// ---- 4) Çeviri: gizlenen bitmiş çeviri baştan çevrilmez ---------------------------------------
if (want('ceviri')) {
  const { ctx, p, errors } = await open('?tab=kutuphane&devzim=/testdata/sample_med_en.zim&devmodel=/testdata/tiny-test.gguf');
  await p.waitForSelector(tid('lib-search'), { timeout: 30000 });
  await p.click(tid('lib-search'));
  await p.fill(tid('lib-search'), 'bleeding');
  await p.waitForSelector(tid('lib-result'));
  await p.click(`${tid('lib-result')} >> nth=0`);
  await p.click(tid('lib-translate'));
  await p.waitForSelector(`${tid('lib-translation')}[data-state="done"]`, { timeout: 240000 });
  await p.click(tid('lib-translate-hide'));
  await p.click(tid('lib-translate'));
  const st = await p.getAttribute(tid('lib-translation'), 'data-state');
  check(st === 'done', 'gizlenen çeviri yeniden açılınca hemen gösterilir (model baştan çevirmez): ' + st);
  check(errors.length === 0, 'çeviri: konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

await browser.close();
console.log(fails ? `\n${fails} kontrol başarısız` : '\nTüm kontroller geçti');
process.exit(fails ? 1 : 0);
