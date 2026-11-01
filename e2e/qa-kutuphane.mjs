// Kütüphane QA regresyon denetimi (docs/qa/kutuphane.md). Dört veri kurulumu:
//   npm run build            (ya da: npx vite build --outDir /tmp/kt-dist)
//   D=/tmp/qa-kt; rm -rf $D; mkdir -p $D/bos $D/ornek $D/tek $D/coklu
//   cp testdata/*.zim $D/ornek/
//   ln -s /home/claude/packs/wikipedia_tr_all_mini_2026-09.zim $D/tek/
//   ln -s /home/claude/packs/wikipedia_tr_all_mini_2026-09.zim $D/coklu/ && cp testdata/sample_med_en.zim $D/coklu/
//   for x in "bos 8096" "ornek 8095" "tek 8097" "coklu 8098"; do set -- $x
//     node server/server.mjs --data $D/$1 --port $2 [--dist /tmp/kt-dist] & done
//   node e2e/qa-kutuphane.mjs [ekran-klasörü]
// Portlar QA_BOS / QA_ORNEK / QA_TEK / QA_COKLU ortam değişkenleriyle değiştirilebilir.
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const URL = {
  bos: process.env.QA_BOS || 'http://localhost:8096',
  ornek: process.env.QA_ORNEK || 'http://localhost:8095',
  tek: process.env.QA_TEK || 'http://localhost:8097',
  coklu: process.env.QA_COKLU || 'http://localhost:8098',
};
const SHOTS = process.argv[2] || '/tmp/qa-kutuphane';
mkdirSync(SHOTS, { recursive: true });
const tid = (id) => `[data-testid="${id}"]`;
const browser = await pw.chromium.launch();
const errors = [];
let fails = 0;

async function page(base, vp = { width: 390, height: 844 }) {
  const ctx = await browser.newContext({ viewport: vp });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`${base} pageerror: ${e.message}`));
  // Paketler aracının çevrimiçi katalog isteği bu kum havuzunda tünel hatası verir (kapsam dışı)
  p.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED/.test(m.text())) errors.push(`${base} console: ${m.text()}`); });
  await p.goto(base + '/?tab=kutuphane', { waitUntil: 'networkidle' });
  await p.waitForSelector(`${tid('lib-search')},${tid('lib-empty')}`, { timeout: 30000 });
  return p;
}
async function step(name, fn) {
  try {
    await fn();
    console.log('OK  ', name);
  } catch (e) {
    fails++;
    console.log('HATA', name, '\n     ', e.message.split('\n').slice(0, 4).join('\n      '));
  }
}
const search = async (p, q, full = false) => {
  await p.fill(tid('lib-search'), q);
  await p.waitForFunction(
    ([q, full]) => {
      const v = document.querySelector('[data-testid="lib-view"]');
      return v && v.dataset.q === q.trim() && (!full || v.dataset.state === 'idle');
    },
    [q, full],
    { timeout: 60000 },
  ).catch((e) => {
    throw new Error(`arama "${q.slice(0, 30)}" bitmedi: ${e.message}`);
  });
};
const titles = (p, id = 'lib-result') => p.$$eval(`${tid(id)} .kt-hit-title`, (x) => x.map((e) => e.textContent));
/** Görünür etkileşimli öğelerden 44 px'ten küçük olanlar (makale içi metin bağlantıları hariç) */
const smallTargets = (p) =>
  p.$$eval('#main button, #main input', (els) =>
    els
      .filter((e) => e.offsetParent)
      .map((e) => ({ id: e.dataset.testid || e.textContent.trim().slice(0, 15), r: e.getBoundingClientRect() }))
      .filter((x) => x.r.width < 44 || x.r.height < 44)
      .map((x) => `${x.id} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`),
  );
const hOverflow = (p) => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);

// ---------------------------------------------------------------------------
// 1) Paket yok
// ---------------------------------------------------------------------------
for (const vp of [{ width: 360, height: 640 }, { width: 1280, height: 800 }]) {
  await step(`paket yok: boş durum ${vp.width}px`, async () => {
    const p = await page(URL.bos, vp);
    await p.waitForSelector(tid('lib-empty'));
    assert.match(await p.textContent(tid("lib-empty")), /Çevrimdışı kütüphane/);
    assert.deepEqual(await smallTargets(p), []);
    assert.equal(await hOverflow(p), false);
    await p.screenshot({ path: `${SHOTS}/bos-${vp.width}.png` });
    await p.click(tid('lib-manage'));
    await p.waitForFunction(() => /← Araçlar/.test(document.getElementById('main')?.innerText || ''));
    await p.context().close();
  });
}

// ---------------------------------------------------------------------------
// 2) Örnek ZIM'ler: aynı adlı iki Vikipedi ayırt edilir, görsel yüklenir
// ---------------------------------------------------------------------------
await step('örnek ZIM: aynı adlı kaynaklar ayırt edilir', async () => {
  const p = await page(URL.ornek, { width: 360, height: 640 });
  const chips = await p.$$eval(tid('lib-src'), (b) => b.map((x) => x.textContent.trim()));
  assert.equal(new Set(chips).size, chips.length, chips.join(', '));
  assert.ok(chips.some((c) => /^Vikipedi \(/.test(c)), chips.join(', '));
  await p.screenshot({ path: `${SHOTS}/ornek-360.png` });
  assert.deepEqual(await smallTargets(p), []);
  await p.context().close();
});
await step('örnek ZIM: makale görseli arşivden yüklenir, iç bağlantı çalışır', async () => {
  const p = await page(URL.ornek);
  await search(p, 'deprem');
  await p.click(tid('lib-result'));
  await p.waitForSelector(tid('lib-article-body'));
  await p.waitForFunction(() => [...document.querySelectorAll('[data-testid="lib-article-body"] img')].some((i) => !i.hidden && i.naturalWidth > 0), null, { timeout: 10000 });
  const src = await p.$eval('[data-testid="lib-article-body"] img', (i) => i.src);
  assert.match(src, /^blob:/);
  await p.context().close();
});

// ---------------------------------------------------------------------------
// 3) Tek kaynak (gerçek Vikipedi): seçici yok, üstveri kartı, arama kalitesi
// ---------------------------------------------------------------------------
await step('tek kaynak: seçici gizli, üstveri kartı', async () => {
  const p = await page(URL.tek, { width: 360, height: 640 });
  assert.equal(await p.$(tid('lib-sources')), null);
  assert.equal(await p.textContent(tid('lib-meta-count')), '700.883 madde');
  assert.equal(await p.textContent(tid('lib-meta-lang')), 'Türkçe');
  assert.deepEqual(await smallTargets(p), []);
  await p.screenshot({ path: `${SHOTS}/tek-360.png` });
  // Türkçe duyarsız: büyük I / noktasız ı ile yazılan İstanbul
  for (const q of ['Istanbul', 'ISTANBUL', 'ıstanbul', 'istanbul', 'İSTANBUL']) {
    await search(p, q);
    assert.equal((await titles(p))[0], 'İstanbul', q);
  }
  await search(p, 'cig kofte');
  assert.equal((await titles(p))[0], 'Çiğ köfte');
  await search(p, 'Izmir');
  assert.equal((await titles(p))[0], 'İzmir');
  // yazım hatası
  await search(p, 'hipotremi');
  assert.equal((await titles(p))[0], 'Hipotermi');
  assert.ok(await p.$(tid('lib-fuzzy-note')));
  // boş sonuç + özel karakterler
  for (const q of ['qzxqzxqzx', '(', '*', '"']) {
    await search(p, q, true);
    assert.ok(await p.$(tid('lib-noresult')), q);
  }
  assert.match(await p.textContent(tid('lib-noresult')), /bulunamadı/);
  // çok uzun sorgu taşmaz
  await search(p, 'x'.repeat(200), true);
  assert.equal(await hOverflow(p), false);
  await p.context().close();
});

await step('Enter: sonuç gelmeden basılırsa eski sonucu değil yeni sorgunun ilkini açar', async () => {
  const p = await page(URL.tek);
  await search(p, 'hipotermi');
  assert.equal((await titles(p))[0], 'Hipotermi');
  await p.fill(tid('lib-search'), 'deprem');
  await p.press(tid('lib-search'), 'Enter'); // hemen: sonuçlar hâlâ "hipotermi"ye ait
  await p.waitForSelector(tid('lib-article-title'), { timeout: 30000 });
  assert.equal(await p.textContent(tid('lib-article-title')), 'Deprem');
  await p.click(tid('lib-back'));
  await p.waitForFunction(() => document.querySelector('[data-testid="lib-view"]')?.dataset.q === 'deprem');
  assert.equal((await titles(p))[0], 'Deprem');
  await p.context().close();
});

await step('makale: ölü çapalar ve eksik maddeye bağlantılar tıklanabilir görünmez; tablo başlığı harf harf kırılmaz', async () => {
  const p = await page(URL.tek, { width: 360, height: 640 });
  await search(p, 'hipotermi');
  await p.click(tid('lib-result'));
  await p.waitForSelector(tid('lib-article-body'));
  const dead = await p.$$eval('[data-testid="lib-article-body"] a[href^="#"]:not([data-zim-path])', (as) =>
    as.filter((a) => !document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).length,
  );
  assert.equal(dead, 0);
  const col = await p.$$eval('[data-testid="lib-article-body"] a:not([href])', (as) => [...new Set(as.map((a) => getComputedStyle(a).color))]);
  const accent = await p.evaluate(() => getComputedStyle(document.querySelector('[data-testid="lib-article-body"] a[data-zim-path]')).color);
  assert.ok(!col.includes(accent), `ölü bağlantı rengi ${col} / ${accent}`);
  // Olimpiyat bilgi kutusu: "IOC kodu" başlığı kelime ortasından bölünmemeli
  await p.click(tid('lib-back'));
  await search(p, "Olimpiyat Oyunları'nda Laos");
  await p.click(tid('lib-result'));
  await p.waitForSelector(tid('lib-article-body'));
  const th = await p.$$eval('[data-testid="lib-article-body"] th', (t) => t.filter((x) => /IOC/.test(x.textContent)).map((x) => x.getBoundingClientRect().height));
  if (th.length) assert.ok(th[0] < 40, `IOC başlığı ${th[0]}px (kırılmış)`);
  assert.equal(await hOverflow(p), false);
  await p.screenshot({ path: `${SHOTS}/makale-tablo-360.png` });
  await p.context().close();
});

// ---------------------------------------------------------------------------
// 4) Çok kaynak: Tümü, seçim, kalıcılık, makale, bul, yazı boyutu, Fener
// ---------------------------------------------------------------------------
await step('çoklu: Tümü + kaynak seçici + üstveri kartı + yeniden yüklemede kalıcılık', async () => {
  const p = await page(URL.coklu);
  await p.evaluate(() => localStorage.clear());
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(tid('lib-search'));
  assert.deepEqual(await p.$$eval(tid('lib-src'), (b) => b.map((x) => x.textContent.trim())), ['Vikipedi', 'WikiMed']);
  assert.equal(await p.getAttribute(tid('lib-src-all'), 'aria-pressed'), 'true');
  // Yüklü kaynaklar büyük liste yerine kapak kutucukları; durum kartı ve setler görünür
  assert.ok(await p.isVisible(tid('lib-status')));
  assert.equal((await p.$$(tid('lib-set'))).length, 5);
  assert.equal((await p.$$(tid('lib-main'))).length, 2);
  await p.click(`${tid('lib-src')}[data-src="sample_med_en.zim"]`);
  assert.equal(await p.textContent(tid('lib-meta-count')), '12 madde');
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(tid('lib-search'));
  assert.equal(await p.getAttribute(`${tid('lib-src')}[data-src="sample_med_en.zim"]`, 'aria-pressed'), 'true');
  assert.match(await p.getAttribute(tid('lib-search'), 'placeholder'), /WikiMed içinde ara/);
  await search(p, 'kalp', true);
  assert.ok((await p.$$eval(tid('lib-result-src'), (b) => b.map((x) => x.textContent))).every((x) => x === 'WikiMed'));
  await p.click(tid('lib-src-all'));
  await search(p, 'anadolu fay', true);
  assert.ok((await titles(p)).includes('Kuzey Anadolu Fay Hattı'));
  await p.waitForSelector(tid('lib-text-result'));
  for (const vp of [{ width: 360, height: 640 }, { width: 1280, height: 800 }]) {
    await p.setViewportSize(vp);
    assert.deepEqual(await smallTargets(p), [], `${vp.width}px`);
    assert.equal(await hOverflow(p), false);
    await p.screenshot({ path: `${SHOTS}/coklu-arama-${vp.width}.png` });
  }
  await p.context().close();
});

await step('çoklu: makale, geri/ileri, sayfada bul, yazı boyutu, listeye dönüşte kaydırma', async () => {
  const p = await page(URL.coklu, { width: 360, height: 640 });
  await p.click(tid('lib-src-all'));
  await search(p, 'deprem', true);
  // listeyi aşağı kaydır, sondan bir sonucu aç, dönünce aynı yerde olmalı
  const last = (await p.$$(tid('lib-result'))).at(-1);
  await last.scrollIntoViewIfNeeded();
  const y0 = await p.evaluate(() => document.getElementById('main').scrollTop);
  assert.ok(y0 > 200, `kaydırma ${y0}`);
  await last.click();
  await p.waitForSelector(tid('lib-article-body'));
  assert.ok((await p.evaluate(() => document.getElementById('main').scrollTop)) < 10);
  await p.click(tid('lib-back'));
  await p.waitForSelector(tid('lib-results'));
  await p.waitForTimeout(100);
  const y1 = await p.evaluate(() => document.getElementById('main').scrollTop);
  assert.ok(Math.abs(y1 - y0) < 5, `dönüş kaydırma ${y1} ≠ ${y0}`);

  await p.click(`${tid('lib-result')}[data-ref="@wikipedia_tr_all_mini_2026-09.zim/Deprem"]`);
  await p.waitForSelector(tid('lib-article-body'));
  assert.equal(await p.textContent(tid('lib-article-title')), 'Deprem');
  assert.equal(await p.isDisabled(tid('lib-nav-back')), true);
  assert.equal(await p.isDisabled(tid('lib-nav-fwd')), true);
  const link = await p.$('[data-testid="lib-article-body"] a[data-zim-path]');
  await link.click();
  await p.waitForFunction(() => document.querySelector('[data-testid="lib-article-title"]')?.textContent !== 'Deprem');
  const second = await p.textContent(tid('lib-article-title'));
  await p.click(tid('lib-nav-back'));
  await p.waitForFunction(() => document.querySelector('[data-testid="lib-article-title"]')?.textContent === 'Deprem');
  await p.click(tid('lib-nav-fwd'));
  await p.waitForFunction((t) => document.querySelector('[data-testid="lib-article-title"]')?.textContent === t, second);
  await p.click(tid('lib-nav-back'));
  await p.waitForFunction(() => document.querySelector('[data-testid="lib-article-title"]')?.textContent === 'Deprem');

  // Sayfada bul: Türkçe duyarsız, Enter / Shift+Enter, Escape
  await p.click(tid('lib-find-toggle'));
  assert.equal(await p.evaluate(() => document.activeElement?.dataset.testid), 'lib-find-input');
  await p.fill(tid('lib-find-input'), 'DEPREM');
  await p.waitForTimeout(100);
  const n = Number((await p.textContent(tid('lib-find-count'))).split('/')[1]);
  assert.ok(n > 3, `eşleşme ${n}`);
  await p.fill(tid('lib-find-input'), 'depr');
  await p.waitForTimeout(100);
  assert.equal(Number((await p.textContent(tid('lib-find-count'))).split('/')[1]), n);
  await p.press(tid('lib-find-input'), 'Enter');
  assert.equal(await p.textContent(tid('lib-find-count')), `2/${n}`);
  await p.press(tid('lib-find-input'), 'Shift+Enter');
  await p.press(tid('lib-find-input'), 'Shift+Enter');
  assert.equal(await p.textContent(tid('lib-find-count')), `${n}/${n}`);
  await p.fill(tid('lib-find-input'), 'zzzqqq');
  await p.waitForTimeout(100);
  assert.equal(await p.textContent(tid('lib-find-count')), '0');
  assert.equal(await p.isDisabled(tid('lib-find-next')), true);
  await p.fill(tid('lib-find-input'), 'fay');
  await p.waitForTimeout(100);
  assert.ok((await p.$$('mark.kt-mark')).length > 0);
  // yazı boyutu: işaretler korunur, 3 kademe döner, kalıcıdır
  const f0 = parseFloat(await p.$eval(tid('lib-article-body'), (b) => getComputedStyle(b).fontSize));
  await p.click(tid('lib-textsize'));
  assert.ok((await p.$$('mark.kt-mark')).length > 0);
  await p.click(tid('lib-textsize'));
  const f2 = parseFloat(await p.$eval(tid('lib-article-body'), (b) => getComputedStyle(b).fontSize));
  assert.ok(f2 > f0);
  assert.equal(await p.getAttribute(tid('lib-textsize'), 'aria-label'), 'Yazı boyutu: Çok büyük');
  await p.screenshot({ path: `${SHOTS}/makale-bul-360.png` });
  await p.press(tid('lib-find-input'), 'Escape');
  assert.equal((await p.$$('mark.kt-mark')).length, 0);
  assert.deepEqual(await smallTargets(p), []);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(tid('lib-search'));
  await search(p, 'deprem');
  await p.click(tid('lib-result'));
  await p.waitForSelector(tid('lib-article-body'));
  assert.match(await p.$eval(tid('lib-article-body'), (b) => b.className), /kt-size-2/);
  await p.click(tid('lib-textsize')); // normale dön
  await p.context().close();
});

await step("çoklu: Bu makale hakkında Fener'e sor", async () => {
  const p = await page(URL.coklu);
  await search(p, 'hipotermi');
  await p.click(tid('lib-result'));
  await p.waitForSelector(tid('lib-ask'));
  await p.click(tid('lib-ask'));
  await p.waitForFunction(() => /"Hipotermi" hakkında kısaca bilgi verir misin\?/.test(document.getElementById('main')?.textContent || ''), null, { timeout: 30000 });
  await p.screenshot({ path: `${SHOTS}/fener-sor.png` });
  // Kütüphane'ye dönünce makale açık kalır
  await p.click('nav >> text=Kütüphane');
  await p.waitForSelector(tid('lib-article-title'));
  assert.equal(await p.textContent(tid('lib-article-title')), 'Hipotermi');
  await p.context().close();
});

await step('çoklu: geçmiş (kalıcı, uzun sorgu taşmaz), temizle/vazgeç, rastgele makale', async () => {
  const p = await page(URL.coklu, { width: 360, height: 640 });
  await p.evaluate(() => localStorage.removeItem('ac.lib.history'));
  await search(p, 'dehydration');
  await p.press(tid('lib-search'), 'Enter');
  await p.waitForSelector(tid('lib-article-title'));
  await p.click(tid('lib-back'));
  const long = 'çok uzun bir arama ' + 'kelimesi '.repeat(12);
  await search(p, long, true);
  await p.press(tid('lib-search'), 'Enter');
  await p.fill(tid('lib-search'), '');
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(tid('lib-search'));
  await p.fill(tid('lib-search'), '');
  const hist = await p.$$eval(tid('lib-history-item'), (b) => b.map((x) => x.textContent));
  assert.equal(hist[0], long.trim());
  assert.ok(hist.includes('dehydration'));
  assert.equal(await hOverflow(p), false);
  await p.screenshot({ path: `${SHOTS}/gecmis-360.png` });
  await p.click(`${tid('lib-history-item')} >> text=dehydration`);
  await p.waitForFunction(() => document.querySelector('[data-testid="lib-view"]')?.dataset.q === 'dehydration');
  assert.equal((await titles(p))[0], 'Dehydration');
  await p.fill(tid('lib-search'), '');
  await p.click(tid('lib-history-clear'));
  await p.click(tid('lib-history-clear-no'));
  assert.ok(await p.$(tid('lib-history-item')));
  await p.click(tid('lib-history-clear'));
  await p.click(tid('lib-history-clear-yes'));
  assert.equal(await p.$(tid('lib-history-item')), null);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(tid('lib-search'));
  assert.equal(await p.$(tid('lib-history-item')), null);
  for (const src of ['sample_med_en.zim', 'wikipedia_tr_all_mini_2026-09.zim']) {
    await p.click(`${tid('lib-src')}[data-src="${src}"]`);
    await p.click(tid('lib-random'));
    await p.waitForSelector(tid('lib-article-title'), { timeout: 30000 });
    assert.equal(await p.textContent(tid('lib-article-src')), src.startsWith('sample') ? 'WikiMed' : 'Vikipedi');
    await p.click(tid('lib-back'));
  }
  await p.click(tid('lib-src-all'));
  await p.click(`${tid('lib-main')} >> nth=0`);
  await p.waitForSelector(tid('lib-article-body'), { timeout: 30000 });
  await p.context().close();
});

await browser.close();
console.log(errors.length ? 'KONSOL HATALARI:\n' + errors.join('\n') : 'konsol hatası yok');
if (errors.length) fails++;
console.log(fails ? `${fails} HATA` : 'TÜMÜ OK');
process.exit(fails ? 1 : 0);
