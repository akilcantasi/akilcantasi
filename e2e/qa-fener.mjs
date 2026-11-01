// Fener QA regresyon kontrolü (sahte paket listesi + sahte mikrofon/konuşma sentezi):
//   node e2e/qa-fener.mjs [taban-url] [ekran-görüntüsü-klasörü]
// Taban: Vite dev sunucusu (ör. http://localhost:5199/). Gerçek model gerekmez:
// /api/packs Playwright ile taklit edilir; "model" olarak testdata/tiny-test.gguf
// (rastgele ağırlıklı küçük GGUF, gerçek wllama ile hızlı akış) sunulur, ZIM'ler
// testdata'dan HTTP Range ile verilir.
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] ?? 'http://localhost:5199/';
const shots = process.argv[3] ?? '/tmp';
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };

const DATA = {
  tiny: readFileSync(path.join(root, 'testdata/tiny-test.gguf')),
  tr: readFileSync(path.join(root, 'testdata/sample_tr.zim')),
  med: readFileSync(path.join(root, 'testdata/sample_med_en.zim')),
};
const ZIMS = [
  { name: 'sample_tr.zim', data: 'tr' },
  { name: 'sample_med_en.zim', data: 'med' },
];
const MB = 1e6;

const browser = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });

const INIT = ({ stt, deny, mem, cores, noTts }) => {
  try { if (mem != null) Object.defineProperty(navigator, 'deviceMemory', { get: () => mem }); } catch {}
  try { if (cores != null) Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => cores }); } catch {}
  if (stt) window.__acSttMock = stt;
  if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = async () => {
    if (deny) throw new DOMException('Permission denied', 'NotAllowedError');
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 220;
    const g = ctx.createGain();
    g.gain.value = 0.3;
    const dst = ctx.createMediaStreamDestination();
    osc.connect(g).connect(dst);
    osc.start();
    return dst.stream;
  };
  if (noTts) {
    try { delete window.speechSynthesis; } catch {}
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
    return;
  }
  const spoken = [];
  window.__spoken = spoken;
  window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; this.lang = ''; this.voice = null; } };
  const q = [];
  let t = null;
  const fake = {
    speaking: false,
    getVoices: () => [
      { name: 'Test English', lang: 'en-US', localService: true, default: true },
      { name: 'Test Türkçe', lang: 'tr-TR', localService: true, default: false },
    ],
    speak(u) {
      spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name ?? null });
      q.push(u);
      clearTimeout(t);
      t = setTimeout(() => q.splice(0).forEach((x) => x.onend?.({})), 1500);
    },
    cancel() { clearTimeout(t); q.splice(0).forEach((x) => x.onerror?.({ error: 'canceled' })); },
    addEventListener() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
};

/** packs: [{name, size?, data}] — data: DATA anahtarı */
async function open({ packs = [], query = '?tab=fener', viewport = { width: 390, height: 844 }, init = {}, zims = true, mockEngine = false } = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const all = [...(zims ? ZIMS : []), ...packs];
  await ctx.route('**/api/packs', (r) =>
    r.fulfill({ contentType: 'application/json', body: JSON.stringify({ files: all.map((p) => ({ name: p.name, size: p.size ?? DATA[p.data].length, url: '/__qa/' + p.name })) }) }),
  );
  await ctx.route('**/__qa/**', (r) => {
    const name = decodeURIComponent(r.request().url().split('/__qa/')[1].split('?')[0]);
    const p = all.find((x) => x.name === name);
    if (!p) return r.fulfill({ status: 404, body: '' });
    const buf = DATA[p.data];
    const h = { 'accept-ranges': 'bytes', 'content-type': 'application/octet-stream', 'cross-origin-resource-policy': 'same-origin' };
    if (r.request().method() === 'HEAD') return r.fulfill({ status: 200, headers: { ...h, 'content-length': String(buf.length) }, body: '' });
    const range = r.request().headers()['range'];
    const m = range && range.match(/bytes=(\d+)-(\d*)/);
    if (m) {
      const s = +m[1];
      const e = m[2] ? Math.min(+m[2], buf.length - 1) : buf.length - 1;
      return r.fulfill({ status: 206, headers: { ...h, 'content-range': `bytes ${s}-${e}/${buf.length}` }, body: buf.subarray(s, e + 1) });
    }
    return r.fulfill({ status: 200, headers: h, body: buf });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.addInitScript(INIT, init);
  await page.goto(new URL(query, base).href, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="fener-status"]:not([data-mode="checking"])', { timeout: 15000 }).catch(() => {});
  if (mockEngine) await installEngineMock(page);
  return { ctx, page, errors };
}

/**
 * Sahte dil modeli: engine nesnesinin yükle/sohbet yöntemleri değiştirilir (Vite dev
 * modülü uygulamayla aynı örnek). Adında "bozuk" geçen model yüklenemez.
 * window.__qaAnswer: üretilecek metin; window.__qaTokenMs: token arası gecikme.
 */
async function installEngineMock(page) {
  await page.evaluate(async () => {
    // Uygulamanın yüklediği modül adresini (HMR ?t= eki dahil) kullan: aynı örnek olsun
    const mod = (path) => performance.getEntriesByType('resource').map((e) => e.name).filter((n) => new URL(n).pathname === path).pop() ?? path;
    const { engine } = await import(mod('/src/lib/fener/engine.ts'));
    let loaded = null;
    window.__qaPrompts = [];
    engine.isLoaded = () => !!loaded;
    engine.ensureLoaded = async (choice, onProgress) => {
      if (loaded === choice.id) return;
      for (let i = 1; i <= 5; i++) { await new Promise((r) => setTimeout(r, 80)); onProgress?.(i / 5); }
      if (/bozuk/.test(choice.id)) throw Object.assign(new Error('failed to load model'), { type: 'load_error' });
      loaded = choice.id;
    };
    engine.chat = async (messages, opts = {}) => {
      window.__qaPrompts.push(messages);
      const words = (window.__qaAnswer ?? 'Yaranın üzerine temiz bir bezle bastırın [1]. Hemen 112\'yi arayın.').split(/(?<= )/);
      let text = '';
      for (const w of words) {
        if (opts.signal?.aborted) return { text, aborted: true, tokens: 0, tokensPerSec: null };
        await new Promise((r) => setTimeout(r, window.__qaTokenMs ?? 25));
        text += w;
        opts.onToken?.(w, text);
      }
      return { text, aborted: false, tokens: words.length, tokensPerSec: 12.5 };
    };
  });
}
const nBots = (p) => p.$$eval('[data-testid="fener-msg-bot"]', (e) => e.length);
const waitDone = (p, n, timeout = 60000) =>
  p.waitForFunction((n) => { const b = document.querySelectorAll('[data-testid="fener-msg-bot"]'); return b.length >= n && b[n - 1].dataset.phase === 'done'; }, n, { timeout })
    .catch(async (e) => {
      console.log('  [hata ayıklama]', JSON.stringify(await p.evaluate(() => ({ bots: [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].map((b) => [b.dataset.phase, b.textContent.slice(0, 120)]), prompts: window.__qaPrompts?.length, eng: window.__fener?.status }))));
      throw e;
    });
const lastBot = (p) => p.evaluate(() => {
  const b = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop();
  if (!b) return null;
  const q = (s) => b.querySelector(s)?.textContent ?? null;
  return {
    phase: b.dataset.phase, text: q('[data-testid="fener-text"]'), label: q('[data-testid="fener-label"]'),
    critical: !!b.querySelector('[data-testid="fener-critical"]'), verify: q('[data-testid="fener-verify"]'),
    free: !!b.querySelector('[data-testid="fener-free"]'), speak: !!b.querySelector('[data-testid="fener-speak"]'),
    sources: [...b.querySelectorAll('[data-testid="fener-source"]')].map((s) => ({ kind: s.dataset.kind, text: s.textContent, disabled: s.disabled })),
  };
});
async function ask(p, text) {
  const n = await nBots(p);
  await p.fill('[data-testid="fener-input"]', text);
  await p.press('[data-testid="fener-input"]', 'Enter');
  await waitDone(p, n + 1);
  return lastBot(p);
}
/** Görünür etkileşimli öğelerden 44px'ten küçük olanlar */
const smallTargets = (p, min = 44) => p.evaluate((min) => [...document.querySelectorAll('.fener button, .fener a, .fener input')]
  .filter((e) => e.offsetParent && !e.closest('.fener-sources'))
  .map((e) => ({ id: e.dataset.testid || e.className, r: e.getBoundingClientRect() }))
  .filter((x) => x.r.width > 0 && (x.r.height < min - 0.5 || x.r.width < min - 0.5))
  .map((x) => `${x.id} ${Math.round(x.r.width)}×${Math.round(x.r.height)}`), min);
/** Yatay taşma */
const overflowX = (p) => p.evaluate(() => {
  const out = [];
  const vw = document.documentElement.clientWidth;
  for (const e of document.querySelectorAll('.fener *')) {
    const r = e.getBoundingClientRect();
    if (r.width && r.right > vw + 1 && e.offsetParent) out.push((e.dataset.testid || e.className || e.tagName) + ' →' + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > vw + 1) out.push('document ' + document.documentElement.scrollWidth);
  return out.slice(0, 8);
});
const run = (name) => !only || only.includes(name);


// ---- A) Model yok: rehber modu, hızlı sorular, 112 kutusu, kaynaklar ------------------
if (run('guide')) {
  const { ctx, page, errors } = await open();
  const st = await page.textContent('[data-testid="fener-status"]');
  check(/Model yok — rehber modu/.test(st), 'durum: model yok → rehber modu');
  check((await page.$$('[data-testid="fener-suggest"]')).length === 4, 'dört hızlı soru');
  check(!(await page.$('[data-testid="fener-new"]')), 'boşken "Yeni sohbet" yok');
  check(await page.isDisabled('[data-testid="fener-send"]'), 'boş girişte gönder kapalı');
  await page.screenshot({ path: shots + '/qaf-empty-390.png' });
  check((await smallTargets(page)).length === 0, 'boş ekranda dokunma alanları ≥44px: ' + (await smallTargets(page)).join(', '));

  await page.click('[data-testid="fener-suggest"] >> nth=1');
  await waitDone(page, 1);
  let b = await lastBot(page);
  check(b.label === 'Model yüklü değil — rehberden yanıt', 'etiket: ' + b.label);
  check(/İlk adımlar:/.test(b.text ?? ''), 'rehber ilk adımları');
  check(b.critical, 'kanama → 112 kutusu');
  check(!!(await page.$('[data-testid="fener-critical"] a[href="tel:112"]')), '112 bağlantısı tel:112');
  check(await page.evaluate(() => {
    const bot = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].at(-1);
    const c = bot.querySelector('[data-testid="fener-critical"]'), v = bot.querySelector('[data-testid="fener-verify"]'), t = bot.querySelector('[data-testid="fener-text"]');
    return !!(c && v && t) && c.getBoundingClientRect().top < v.getBoundingClientRect().top && v.getBoundingClientRect().top < t.getBoundingClientRect().top;
  }), 'sıra: 112 kutusu → büyük rehber düğmesi → cevap metni');
  check(!!b.verify && /Rehberin tamamı/.test(b.verify), 'büyük rehber düğmesi (rehber modunda "Rehberin tamamı"): ' + b.verify);
  check(!b.free, 'model yokken "kendi bilgisiyle" düğmesi yok');
  console.log('  kaynaklar:', b.sources.map((s) => s.kind + ':' + s.text).join(' | '));
  check(b.sources.some((s) => s.kind === 'rehber' && /^1Rehber/.test(s.text)), 'Rehber kaynak etiketi');
  const vis = await page.evaluate(() => {
    const l = document.querySelector('.fener-list').getBoundingClientRect();
    const c = document.querySelector('[data-testid="fener-critical"]').getBoundingClientRect();
    return c.top >= l.top - 1 && c.bottom <= l.bottom + 1;
  });
  check(vis, 'uzun rehber cevabında 112 kutusu görünür (başa kaydırıldı)');
  check(b.sources.some((s) => s.kind === 'vikipedi' && /WikiMed/.test(s.text)), 'tıbbi kaynakta WikiMed etiketi');
  await page.screenshot({ path: shots + '/qaf-fallback-390.png', fullPage: false });
  await page.locator('[data-testid="fener-verify"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: shots + '/qaf-fallback-390-b.png' });
  check((await overflowX(page)).length === 0, 'yatay taşma yok: ' + (await overflowX(page)).join(', '));
  const small = await smallTargets(page);
  check(small.length === 0, 'cevapta dokunma alanları ≥44px: ' + small.join(', '));

  // Tıbbi soru → WikiMed etiketi
  b = await ask(page, 'Hipotermi nedir, belirtileri nelerdir?');
  console.log('  kaynaklar:', b.sources.map((s) => s.kind + ':' + s.text).join(' | '));
  console.log('  metin:', JSON.stringify((b.text ?? '').slice(0, 200)));
  const wm = b.sources.find((s) => s.kind === 'vikipedi');
  check(!!wm, 'kütüphane kaynağı var');

  // Vikipedi soru
  b = await ask(page, 'Türkiye nerededir?');
  console.log('  kaynaklar:', b.sources.map((s) => s.kind + ':' + s.text).join(' | '));
  console.log('  metin:', JSON.stringify((b.text ?? '').slice(0, 300)));

  // Eşleşmeyen soru
  b = await ask(page, 'qwzx plorf');
  check(/eşleşen bir rehber ya da makale bulamadım/.test(b.text ?? ''), 'eşleşme yok iletisi');
  check(!!(await page.$('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-browse"]')), '"Rehberlere göz at" bağlantısı');
  await page.screenshot({ path: shots + '/qaf-nomatch.png' });
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

// ---- B) Model seçici, kalıcılık, parçalı/büyük/eksik modeller, model cevabı ------------
const MODEL_PACKS = [
  { name: 'tiny-0.5b-q4_k_m.gguf', data: 'tiny' },
  { name: 'orta-bozuk-1.5b-q4_k_m-00001-of-00002.gguf', size: 600 * MB, data: 'tiny' },
  { name: 'orta-bozuk-1.5b-q4_k_m-00002-of-00002.gguf', size: 500 * MB, data: 'tiny' },
  { name: 'agir-7b-q4_k_m-00001-of-00003.gguf', size: 1900 * MB, data: 'tiny' },
  { name: 'agir-7b-q4_k_m-00002-of-00003.gguf', size: 1900 * MB, data: 'tiny' },
  { name: 'agir-7b-q4_k_m-00003-of-00003.gguf', size: 900 * MB, data: 'tiny' },
  { name: 'kocaman-8b-q4_k_m.gguf', size: 5000 * MB, data: 'tiny' },
  { name: 'eksik-3b-q4_k_m-00001-of-00003.gguf', size: 900 * MB, data: 'tiny' },
  { name: 'eksik-3b-q4_k_m-00003-of-00003.gguf', size: 900 * MB, data: 'tiny' },
  { name: 'mmproj-F16.gguf', size: 300 * MB, data: 'tiny' },
];
if (run('model')) {
  const { ctx, page, errors } = await open({ packs: MODEL_PACKS, init: { mem: 4, cores: 4 }, mockEngine: true });
  await page.waitForSelector('[data-testid="fener-status"][data-mode="model"]', { timeout: 15000 }).catch(async () => console.log("DBG", await page.textContent("body"), errors));
  let st = await page.evaluate(() => ({ ...document.querySelector('[data-testid="fener-status"]').dataset, text: document.querySelector('[data-testid="fener-status"]').textContent }));
  check(st.model === 'orta-bozuk-1.5b-q4_k_m.gguf' && st.manual === 'false', 'otomatik: cihaza sığan en büyük (parçalı 1,5B): ' + st.model);
  check(/2 parça/.test(st.text) && /otomatik/.test(st.text), 'çubukta parça sayısı ve "otomatik": ' + st.text);
  await page.click('[data-testid="fener-model-btn"]');
  await page.waitForSelector('[data-testid="fener-model-opt"]');
  const opts = await page.$$eval('[data-testid="fener-model-opt"]', (els) => els.map((e) => ({ id: e.dataset.id, fit: e.dataset.fit, dis: e.disabled, text: e.textContent })));
  console.log('  seçenekler:', opts.map((o) => `${o.id}[${o.fit}${o.dis ? ',kapalı' : ''}]`).join(' '));
  check(opts.length === 5, '5 model (mmproj hariç, parçalar gruplu)');
  check(!opts.some((o) => /mmproj/.test(o.id)), 'mmproj listede yok');
  const f = (id) => opts.find((o) => o.id === id) ?? {};
  check(f('orta-bozuk-1.5b-q4_k_m.gguf').fit === 'ok' && /2 parça/.test(f('orta-bozuk-1.5b-q4_k_m.gguf').text), 'parçalı model tek seçenek, uygun');
  check(f('agir-7b-q4_k_m.gguf').fit === 'heavy' && !f('agir-7b-q4_k_m.gguf').dis, 'büyük model: belleğe ağır (seçilebilir)');
  check(f('kocaman-8b-q4_k_m.gguf').fit !== 'incomplete' && !f('kocaman-8b-q4_k_m.gguf').dis, '2 GB üstü tek dosya da seçilebilir (yüklerken bölünür)');
  check(f('eksik-3b-q4_k_m.gguf').fit === 'incomplete' && f('eksik-3b-q4_k_m.gguf').dis && /2\/3 parça var — eksik: 2/.test(f('eksik-3b-q4_k_m.gguf').text), 'eksik parçalı model kapalı: ' + f('eksik-3b-q4_k_m.gguf').text);
  check((await page.getAttribute('[data-testid="fener-model-auto"]', 'aria-checked')) === 'true', 'Otomatik seçili');
  await page.screenshot({ path: shots + '/qaf-model-panel.png' });
  const small = await smallTargets(page);
  check(small.length === 0, 'model panelinde dokunma alanları ≥44px: ' + small.join(', '));
  check((await overflowX(page)).length === 0, 'model panelinde yatay taşma yok: ' + (await overflowX(page)).join(', '));
  // Panel ekranı kaplamasın, mesaj listesi/giriş görünsün
  await page.click('[data-testid="fener-model-opt"][data-id="tiny-0.5b-q4_k_m.gguf"]');
  check((await page.getAttribute('[data-testid="fener-model-opt"][data-id="tiny-0.5b-q4_k_m.gguf"]', 'aria-checked')) === 'true', 'elle seçim işaretlendi');
  await page.click('[data-testid="fener-model-close"]');
  await page.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.model === 'tiny-0.5b-q4_k_m.gguf');
  check(/elle seçildi/.test(await page.textContent('[data-testid="fener-model-meta"]')), 'çubukta "elle seçildi"');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="fener-status"][data-mode="model"]');
  await installEngineMock(page);
  check((await page.getAttribute('[data-testid="fener-status"]', 'data-model')) === 'tiny-0.5b-q4_k_m.gguf', 'seçim yenilemeden sonra korunuyor');

  // Model cevabı (akış), kaynaklar, rehber düğmesi, kendi bilgisi, durdur
  await page.fill('[data-testid="fener-input"]', 'Kanama nasıl durdurulur?');
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForSelector('[data-testid="fener-stop"]');
  check(await page.isDisabled('[data-testid="fener-send"]'), 'üretimde gönder kapalı');
  check(await page.isDisabled('[data-testid="fener-suggest"]').catch(() => true), 'üretimde hızlı sorular yok/kapalı');
  await waitDone(page, 1);
  let b = await lastBot(page);
  check(!b.label, 'model cevabında rehber etiketi yok');
  check((b.text ?? '').length > 0, 'model metin üretti');
  check(b.critical, 'model cevabında da 112 kutusu');
  check(/Doğrulanmış adımlar/.test(b.verify ?? ''), 'büyük rehber düğmesi "Doğrulanmış adımlar"');
  check(b.free, '"Fener kendi bilgisiyle cevaplasın" düğmesi');
  check(!!(await page.$('.fener-disclaimer')), 'yapay zekâ uyarısı');
  console.log('  kaynaklar:', b.sources.map((s) => s.kind + ':' + s.text).join(' | '));
  await page.screenshot({ path: shots + '/qaf-model-answer.png' });

  await page.click('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-free"]');
  await waitDone(page, 2);
  b = await lastBot(page);
  check(/kendi bilgisi/.test(b.label ?? ''), 'kendi bilgisi etiketi: ' + b.label);
  check(b.sources.length === 0, 'kendi bilgisi cevabında kaynak yok');
  check(!b.free, 'kendi bilgisi cevabında tekrar düğme yok');
  const userMsgs = await page.$$eval('[data-testid="fener-msg-user"]', (e) => e.map((x) => x.textContent));
  check(userMsgs.length === 2 && userMsgs[1] === 'Kanama nasıl durdurulur?', 'aynı soru yeniden soruldu');

  // Durdur
  await page.evaluate(() => { window.__qaTokenMs = 150; });
  await page.fill('[data-testid="fener-input"]', 'Uzun bir cevap yaz lütfen');
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForFunction(() => { const b = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop(); return b?.dataset.phase === 'write' && (b.querySelector('[data-testid="fener-text"]')?.textContent.length ?? 0) > 0; }, null, { timeout: 30000 });
  await page.click('[data-testid="fener-stop"]');
  await waitDone(page, 3, 15000);
  await page.evaluate(() => { window.__qaTokenMs = 25; });
  b = await lastBot(page);
  check(await page.$eval('[data-testid="fener-msg-bot"]:last-child', (e) => /durduruldu/.test(e.textContent)), '"(durduruldu)" gösterildi');
  check(!(await page.$('[data-testid="fener-stop"]')), 'durdurma sonrası Durdur düğmesi gitti');
  // Gönder yeniden çalışır
  b = await ask(page, 'Su nasıl arıtılır?');
  check((b.text ?? '').length > 0, 'durdurmadan sonra yeni soru cevaplandı');

  // Yeni sohbet
  await page.click('[data-testid="fener-new"]');
  check((await page.$$('[data-testid="fener-msg-bot"]')).length === 0 && (await page.$$('[data-testid="fener-suggest"]')).length === 4, 'Yeni sohbet: boş ekran ve hızlı sorular');
  // Üretim sırasında Yeni sohbet: durdurur, eski cevap geri gelmez
  await page.fill('[data-testid="fener-input"]', 'Deprem çantasına ne koymalıyım?');
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'write', null, { timeout: 30000 });
  await page.click('[data-testid="fener-new"]');
  await page.waitForTimeout(1500);
  check((await page.$$('[data-testid="fener-msg-user"]')).length === 0, 'üretim sırasında Yeni sohbet konuşmayı temizledi');
  check(!(await page.$('[data-testid="fener-stop"]')), 'Yeni sohbetten sonra meşgul değil');
  b = await ask(page, 'Artçı depremde ne yapmalıyım?');
  check((b.text ?? '').length > 0, 'Yeni sohbetten sonra soru cevaplandı');

  // Otomatik'e dön → parçalı sahte model yüklenemez → hata ve rehber cevabı
  await page.click('[data-testid="fener-model-btn"]');
  await page.click('[data-testid="fener-model-auto"]');
  await page.click('[data-testid="fener-model-close"]');
  await page.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.model === 'orta-bozuk-1.5b-q4_k_m.gguf');
  b = await ask(page, 'Enkaz altındaysam ne yapmalıyım?');
  check(/Model çalışmadı — rehberden yanıt/.test(b.label ?? ''), 'model yüklenemezse rehber cevabı: ' + b.label);
  const err = await page.$eval('[data-testid="fener-msg-bot"]:last-child', (e) => e.querySelector('.fener-error')?.textContent ?? '');
  console.log('  hata:', err);
  check(err.length > 0, 'Türkçe hata iletisi');
  await page.screenshot({ path: shots + '/qaf-model-error.png' });
  const e2 = errors.filter((e) => !/Model dosyası|gguf|\[fener\]/i.test(e));
  check(e2.length === 0, 'konsol hatası yok' + (e2.length ? ': ' + e2.join(' | ') : ''));
  await ctx.close();
}

// ---- C) Pil tasarrufu ------------------------------------------------------------------
if (run('battery')) {
  const { ctx, page, errors } = await open({ packs: MODEL_PACKS.slice(0, 1) });
  await page.waitForSelector('[data-testid="fener-status"][data-mode="model"]');
  await page.evaluate(async () => (await import(performance.getEntriesByType('resource').map((e) => e.name).filter((n) => new URL(n).pathname === '/src/lib/store.ts').pop() ?? '/src/lib/store.ts')).setState({ batterySaver: true }));
  await page.waitForSelector('[data-testid="fener-status"][data-mode="guide"]');
  check(/Pil tasarrufu — rehber modu/.test(await page.textContent('[data-testid="fener-status"]')), 'durum: pil tasarrufu');
  const b = await ask(page, 'Suyu nasıl içilebilir hale getiririm?');
  check(b.label === 'Pil tasarrufu açık — rehberden yanıt', 'etiket: ' + b.label);
  check(!b.free, 'pil tasarrufunda "kendi bilgisi" yok');
  await page.click('[data-testid="fener-model-btn"]');
  check(/Pil tasarrufu açık/.test(await page.textContent('[data-testid="fener-model-panel"]')), 'panelde pil tasarrufu notu');
  await page.screenshot({ path: shots + '/qaf-battery.png' });
  await page.click('[data-testid="fener-model-close"]');
  await page.evaluate(async () => (await import(performance.getEntriesByType('resource').map((e) => e.name).filter((n) => new URL(n).pathname === '/src/lib/store.ts').pop() ?? '/src/lib/store.ts')).setState({ batterySaver: false }));
  await page.waitForSelector('[data-testid="fener-status"][data-mode="model"]');
  check(true, 'pil tasarrufu kapanınca model moduna dönüldü');
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

// ---- D) Model paketi yok paneli ----------------------------------------------------------
if (run('nomodel')) {
  const { ctx, page, errors } = await open();
  await page.click('[data-testid="fener-model-btn"]');
  await page.waitForSelector('[data-testid="fener-model-empty"]');
  await page.screenshot({ path: shots + '/qaf-model-empty.png' });
  await page.click('[data-testid="fener-model-get"]');
  check(/paylas|araclar/.test(await page.evaluate(() => document.querySelector('[data-testid="tab-sub"]')?.textContent ?? '')) || !!(await page.$('[data-testid="nav-araclar"][aria-current="page"], [data-testid="nav-araclar"].on')), '"Model paketi ekle" Araçlar/Paylaş açtı');
  await page.screenshot({ path: shots + '/qaf-model-get.png' });
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

const storeCall = (page, fn, arg) => page.evaluate(async ([fn, arg]) => {
  const u = performance.getEntriesByType('resource').map((e) => e.name).filter((n) => new URL(n).pathname === '/src/lib/store.ts').pop() ?? '/src/lib/store.ts';
  const m = await import(u);
  if (fn === 'ask') m.go.ask(arg.text, arg.context);
  else m.setState(arg);
}, [fn, arg]);
const tabSub = (page) => page.evaluate(() => document.querySelector('[data-testid="tab-sub"]')?.textContent ?? '');

// ---- E) Kaynak etiketleri, büyük rehber düğmesi, Kütüphane/Harita'dan "Fener'e sor" ------
if (run('nav')) {
  const { ctx, page, errors } = await open({ packs: MODEL_PACKS.slice(0, 1), mockEngine: true });
  let b = await ask(page, 'Kanama nasıl durdurulur?');
  // Rehber etiketi → Rehber sekmesi, doğru rehber
  await page.click('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-source"][data-kind="rehber"] >> nth=0');
  await page.waitForTimeout(300);
  check(/rehber/i.test(await tabSub(page)), 'Rehber etiketi Rehber sekmesini açtı: ' + (await tabSub(page)));
  check(/Ciddi kanama/.test(await page.textContent('main, #app')), 'doğru rehber açıldı');
  await page.click('[data-testid="nav-fener"]');
  // Büyük rehber düğmesi
  await page.click('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-verify"]');
  await page.waitForTimeout(300);
  check(/rehber/i.test(await tabSub(page)) && /Ciddi kanama/.test(await page.textContent('#app')), 'büyük rehber düğmesi rehberi açtı');
  await page.click('[data-testid="nav-fener"]');
  check((await page.$$('[data-testid="fener-msg-bot"]')).length === 1, 'sekme değişiminde konuşma korundu');
  // WikiMed etiketi → Kütüphane, doğru kaynaktan makale
  await page.click('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-source"][data-kind="vikipedi"]:has-text("WikiMed")');
  await page.waitForSelector('[data-testid="lib-article-title"]', { timeout: 10000 });
  check((await page.textContent('[data-testid="lib-article-title"]')).trim() === 'Bleeding', 'WikiMed etiketi doğru makaleyi açtı');
  // Kütüphane'den "Fener'e sor" → bağlamlı soru otomatik gönderilir
  await page.click('[data-testid="lib-ask"]');
  await page.waitForSelector('[data-testid="fener-status"]');
  await waitDone(page, 2);
  const u = await page.$$eval('[data-testid="fener-msg-user"]', (e) => e.map((x) => x.textContent));
  console.log('  kullanıcı:', u[1]);
  check(/Bağlam: Bleeding/.test(u[1]) && /"Bleeding" hakkında/.test(u[1]), 'Kütüphane sorusu bağlamla geldi');
  b = await lastBot(page);
  check(b.sources.some((s) => s.kind === 'baglam'), 'Bağlam kaynak etiketi: ' + b.sources.map((s) => s.text).join(' | '));
  check(!b.sources.some((s) => /Çocukla afet/.test(s.text)), 'soru kalıbı ("hakkında … bilgi") ilgisiz rehber getirmedi');
  const prompt = await page.evaluate(() => JSON.stringify(window.__qaPrompts.at(-1)));
  check(/Bleeding/.test(prompt), 'bağlam metni isteme eklendi');
  await page.screenshot({ path: shots + '/qaf-context.png' });

  // Meşgulken dışarıdan soru gelirse cevap bitince sırayla gönderilir
  await page.evaluate(() => { window.__qaTokenMs = 120; });
  await page.fill('[data-testid="fener-input"]', 'Su nasıl arıtılır?');
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForSelector('[data-testid="fener-stop"]');
  await storeCall(page, 'ask', { text: 'Toplanma alanına giderken nelere dikkat etmeliyim?' });
  await waitDone(page, 4, 30000);
  const u2 = await page.$$eval('[data-testid="fener-msg-user"]', (e) => e.map((x) => x.textContent));
  check(u2.length === 4 && /Toplanma alanına/.test(u2[3]), 'meşgulken gelen soru sonra gönderildi');
  await page.evaluate(() => { window.__qaTokenMs = 25; });

  // Başka sekmedeyken soru gelir (Harita "Fener'e sor" ile aynı yol)
  await page.click('[data-testid="nav-harita"]');
  await storeCall(page, 'ask', { text: 'Devlet hastanesine giderken nelere dikkat etmeliyim?' });
  await waitDone(page, 5);
  check((await page.$$('[data-testid="fener-msg-user"]')).length === 5, 'Harita sekmesinden gelen soru Fener\'de cevaplandı');
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

// ---- F) Sesli sor (sahte mikrofon + sahte STT) ve sesli oku (sahte speechSynthesis) -------
const micPhase = (p) => p.getAttribute('[data-testid="fener-mic"]', 'data-phase');
const waitMic = (p, ph, timeout = 15000) => p.waitForFunction((ph) => document.querySelector('[data-testid="fener-mic"]')?.dataset.phase === ph, ph, { timeout });
if (run('voice')) {
  // Kayıt → yazıya çevirme → metin girişe eklenir
  {
    const { ctx, page, errors } = await open({ init: { stt: { text: 'Enkaz altındayım', delayMs: 700, loadMs: 700 } } });
    await waitMic(page, 'idle');
    await page.fill('[data-testid="fener-input"]', 'Yardım');
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'recording');
    check((await page.getAttribute('[data-testid="fener-mic"]', 'aria-label')) === 'Kaydı bitir ve yazıya çevir', 'kayıtta düğme etiketi');
    check((await page.getAttribute('[data-testid="fener-input"]', 'placeholder')) === 'Dinleniyor…', 'giriş yer tutucusu "Dinleniyor…"');
    await page.waitForTimeout(1200);
    check(/Dinleniyor 0:01 \/ 0:30/.test(await page.textContent('[data-testid="fener-voice-note"]')), 'kayıt süresi notu');
    await page.screenshot({ path: shots + '/qaf-voice-rec.png' });
    await page.click('[data-testid="fener-mic"]');
    await page.waitForFunction(() => ['loading', 'transcribing'].includes(document.querySelector('[data-testid="fener-mic"]')?.dataset.phase));
    const ph = await micPhase(page);
    const note = await page.textContent('[data-testid="fener-voice-note"]');
    check(/Ses modeli yükleniyor|yazıya çevriliyor/.test(note), `${ph}: ${note}`);
    await page.screenshot({ path: shots + '/qaf-voice-busy.png' });
    await waitMic(page, 'idle');
    check((await page.inputValue('[data-testid="fener-input"]')) === 'Yardım Enkaz altındayım', 'metin mevcut girişe eklendi');
    check(!(await page.$('[data-testid="fener-voice-note"]')), 'bitince not kayboldu');
    // Yazıya çevirirken iptal
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'recording');
    await page.waitForTimeout(600);
    await page.click('[data-testid="fener-mic"]');
    await page.waitForFunction(() => ['loading', 'transcribing'].includes(document.querySelector('[data-testid="fener-mic"]')?.dataset.phase));
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'idle');
    await page.waitForTimeout(1000);
    check((await page.inputValue('[data-testid="fener-input"]')) === 'Yardım Enkaz altındayım', 'iptal edilen kayıt girişe yazılmadı');
    // Çok kısa kayıt
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'recording');
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'error');
    check(/Kayıt çok kısa/.test(await page.textContent('[data-testid="fener-voice-note"]')), 'çok kısa kayıt uyarısı');
    await page.click('[data-testid="fener-voice-dismiss"]');
    await waitMic(page, 'idle');
    // Kayıttayken sekme değişirse kayıt iptal
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'recording');
    await page.click('[data-testid="nav-rehber"]');
    await page.waitForTimeout(300);
    const vph = await page.evaluate(() => window.__fenerVoice?.phase);
    check(vph === 'idle', 'sekme değişince kayıt iptal: ' + vph);
    await page.click('[data-testid="nav-fener"]');
    check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
    await ctx.close();
  }
  // Yazıya çevirme hatası
  {
    const { ctx, page, errors } = await open({ init: { stt: { text: 'x', fail: true, delayMs: 200 } } });
    await waitMic(page, 'idle');
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'recording');
    await page.waitForTimeout(700);
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'error');
    const note = await page.textContent('[data-testid="fener-voice-note"]');
    check(/Konuşma yazıya çevrilemedi/.test(note), 'çeviri hatası iletisi: ' + note);
    check((await page.getAttribute('[data-testid="fener-voice-note"]', 'role')) === 'alert', 'hata notu role=alert');
    await page.screenshot({ path: shots + '/qaf-voice-error.png' });
    // Hatadan sonra yeniden kayıt başlar
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'recording');
    check(true, 'hatadan sonra mikrofon yeniden çalışıyor');
    await page.click('[data-testid="fener-mic"]');
    await ctx.close();
  }
  // Boş çeviri → "anlaşılamadı"
  {
    const { ctx, page } = await open({ init: { stt: { text: '[Müzik]', delayMs: 100 } } });
    await waitMic(page, 'idle');
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'recording');
    await page.waitForTimeout(700);
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'error');
    check(/anlaşılamadı/.test(await page.textContent('[data-testid="fener-voice-note"]')), 'yalnızca "[Müzik]" → anlaşılamadı');
    await ctx.close();
  }
  // İzin reddi
  {
    const { ctx, page, errors } = await open({ init: { stt: { text: 'x' }, deny: true } });
    await waitMic(page, 'idle');
    await page.click('[data-testid="fener-mic"]');
    await waitMic(page, 'error');
    const note = await page.textContent('[data-testid="fener-voice-note"]');
    check(/Mikrofon izni/.test(note), 'izin reddi: ' + note);
    await page.screenshot({ path: shots + '/qaf-voice-denied.png' });
    await page.click('[data-testid="fener-voice-dismiss"]');
    await waitMic(page, 'idle');
    check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
    await ctx.close();
  }
  // Ses paketi yok
  {
    const { ctx, page, errors } = await open({});
    await waitMic(page, 'unavailable');
    check(!(await page.$('[data-testid="fener-voice-note"]')), 'paket yokken not kendiliğinden açılmıyor');
    await page.click('[data-testid="fener-mic"]');
    const note = await page.textContent('[data-testid="fener-voice-note"]');
    check(/ses paketi \(Whisper\) gerekli/.test(note), 'paket yok nedeni: ' + note);
    check(!!(await page.$('[data-testid="fener-voice-get"]')), '"Paket ekle" bağlantısı');
    await page.screenshot({ path: shots + '/qaf-voice-nopack.png' });
    await page.click('[data-testid="fener-mic"]');
    check(!(await page.$('[data-testid="fener-voice-note"]')), 'ikinci basışta not kapandı');
    await page.click('[data-testid="fener-mic"]');
    await page.click('[data-testid="fener-voice-get"]');
    await page.waitForTimeout(300);
    check(!(await page.$('[data-testid="fener-input"]')), '"Paket ekle" Fener\'den çıkıp paket ekranını açtı');
    check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
    await ctx.close();
  }
}

if (run('tts')) {
  const { ctx, page, errors } = await open({ packs: MODEL_PACKS.slice(0, 1), mockEngine: true });
  await page.evaluate(() => { window.__qaAnswer = 'Birinci cümle [1]. İkinci cümle [2] burada.'; });
  await ask(page, 'Kanama nasıl durdurulur?');
  await page.click('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-speak"]');
  await page.waitForSelector('[data-testid="fener-speak"][data-speaking="true"]');
  const spoken = await page.evaluate(() => window.__spoken);
  console.log('  okunan:', JSON.stringify(spoken.map((x) => x.text)));
  check(spoken.length > 0 && spoken.every((x) => x.lang === 'tr-TR' && x.voice === 'Test Türkçe'), 'tr-TR sesle okunuyor');
  check(!spoken.some((x) => /\[\d+\]/.test(x.text)), 'kaynak numaraları okunmuyor');
  check(!spoken.some((x) => / [.,]/.test(x.text)), 'numara silinince noktadan önce boşluk kalmıyor');
  check((await page.getAttribute('[data-testid="fener-speak"]', 'aria-label')) === 'Sesli okumayı durdur', 'okurken aria-label');
  // Okurken yeni soru → okuma durur
  await page.fill('[data-testid="fener-input"]', 'Su nasıl arıtılır?');
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForTimeout(200);
  check(!(await page.$('[data-testid="fener-speak"][data-speaking="true"]')), 'yeni soru gönderilince okuma durdu');
  await waitDone(page, 2);
  // Kendiliğinden biter
  await page.click('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-speak"]');
  await page.waitForSelector('[data-testid="fener-speak"][data-speaking="true"]');
  await page.waitForSelector('[data-testid="fener-speak"][data-speaking="true"]', { state: 'detached', timeout: 10000 });
  check(true, 'okuma bitince düğme "Sesli oku"ya döndü');
  // Okurken Yeni sohbet → okuma durur
  await page.click('[data-testid="fener-msg-bot"]:last-child [data-testid="fener-speak"]');
  await page.waitForSelector('[data-testid="fener-speak"][data-speaking="true"]');
  await page.click('[data-testid="fener-new"]');
  await page.waitForTimeout(200);
  const sp = await page.evaluate(() => window.__fenerTts?.speakingId ?? null);
  check(sp == null, 'Yeni sohbet okumayı durdurdu: ' + sp);
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
  // speechSynthesis yok → düğme yok
  {
    const { ctx, page } = await open({ init: { noTts: true } });
    await ask(page, 'Kanama nasıl durdurulur?');
    check(!(await page.$('[data-testid="fener-speak"]')), 'speechSynthesis yokken "Sesli oku" yok');
    await ctx.close();
  }
}

// ---- G) Düzen: küçük ekran, masaüstü, uzun cevap, çok mesaj ---------------------------
if (run('layout')) {
  for (const vp of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    const tag = `${vp.width}x${vp.height}`;
    const { ctx, page, errors } = await open({ packs: MODEL_PACKS.slice(0, 1), viewport: vp, mockEngine: true, init: { stt: { text: 'x' } } });
    await page.screenshot({ path: `${shots}/qaf-layout-empty-${tag}.png` });
    check((await overflowX(page)).length === 0, `${tag} boş: yatay taşma yok ` + (await overflowX(page)).join(', '));
    await page.evaluate(() => {
      window.__qaTokenMs = 1;
      window.__qaAnswer = Array.from({ length: 40 }, (_, i) => `${i + 1}. Çok uzun bir adım açıklaması: yaranın üzerine temiz bir bezle kesintisiz bastırın ve 112'yi arayın [1]. ÇokUzunBirSözcükBölünmedenTaşmamalıAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`).join('\n');
    });
    await ask(page, 'Kanama nasıl durdurulur? '.repeat(6) + 'https://ornek.example/çok/uzun/bir/adres/bölünmeden/taşmamalı/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    for (let i = 0; i < 6; i++) { const t0 = Date.now(); await ask(page, ['Su nasıl arıtılır?', 'Artçı depremde ne yapmalıyım?', 'Hipotermi', 'Yangında ne yapmalı?', 'qwzx', 'Deprem çantası'][i]); console.log(`  ${tag} cevap ${i + 2}: ${Date.now() - t0} ms`); }
    check((await page.$$('[data-testid="fener-msg-bot"]')).length === 7, `${tag}: 7 cevap`);
    check((await overflowX(page)).length === 0, `${tag} uzun/çok mesaj: yatay taşma yok ` + (await overflowX(page)).join(', '));
    // Liste kaydırılabilir, giriş görünür kalır
    const geo = await page.evaluate(() => {
      const l = document.querySelector('.fener-list');
      const i = document.querySelector('[data-testid="fener-input"]').getBoundingClientRect();
      return { scroll: l.scrollHeight > l.clientHeight, atBottom: l.scrollHeight - l.scrollTop - l.clientHeight < 4, inputVisible: i.bottom <= innerHeight && i.top >= 0, listH: l.clientHeight };
    });
    check(geo.scroll && geo.inputVisible && geo.listH > 150, `${tag}: liste kayar, giriş görünür (liste ${geo.listH}px)`);
    await page.screenshot({ path: `${shots}/qaf-layout-many-${tag}.png` });
    const small = await smallTargets(page);
    check(small.length === 0, `${tag}: dokunma alanları ≥44px ` + small.join(', '));
    // Model paneli küçük ekranda: Kapat ve giriş erişilebilir
    await page.click('[data-testid="fener-model-btn"]');
    await page.waitForSelector('[data-testid="fener-model-opt"]');
    const pg = await page.evaluate(() => {
      const c = document.querySelector('[data-testid="fener-model-close"]').getBoundingClientRect();
      const l = document.querySelector('.fener-list').getBoundingClientRect();
      return { closeVisible: c.top >= 0 && c.bottom <= innerHeight, listH: l.height };
    });
    check(pg.closeVisible, `${tag}: model panelinde Kapat görünür`);
    await page.screenshot({ path: `${shots}/qaf-layout-panel-${tag}.png` });
    check(errors.length === 0, `${tag}: konsol hatası yok` + (errors.length ? ': ' + errors.join(' | ') : ''));
    await ctx.close();
  }
}

await browser.close();
console.log(fails.length ? `\n${fails.length} kontrol başarısız` : '\nTüm kontroller geçti');
process.exit(fails.length ? 1 : 0);
