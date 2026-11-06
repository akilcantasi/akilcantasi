// Fener yerel motoru (Android llama.cpp) — arayüz sözleşmesi, sahte Capacitor köprüsüyle:
//   • paket klasöründeki model yerel motorla açılır (fenerYukle), WebAssembly hiç yüklenmez
//   • cevap "fenerParca" olaylarıyla akar; durum çubuğu backend=yerel, gpu=true gösterir
//   • Durdur, üretim başlamadan önce bile kaybolmaz (kimlikli fenerDurdur)
//   • yerel motor açamazsa ve model WebView'a sığmıyorsa Türkçe hata (WebAssembly denenmez)
//   • 12 GB RAM bildiren telefonda büyük model "Bu cihaza uygun"
//   • GPU çökme sonrası kapalıysa model panelinde sakin not ve "GPU'yu yeniden dene" (fenerGpuSifirla)
//   • sohbet uygulama yeniden açılınca (Android süreci kapattı) geri gelir; yazılırken kalan
//     cevap "yarım kaldı" ve "Yeniden sor" ile döner; taslak soru korunur; "Yeni sohbet" kaydı siler
//   node e2e/fener-yerel-check.mjs [taban-url]
import { createRequire } from 'module';
import assert from 'assert/strict';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:8099/';
const tid = (t) => `[data-testid="${t}"]`;
const browser = await pw.chromium.launch();
let fails = 0;
async function step(name, fn) {
  try { await fn(); console.log('OK  ', name); } catch (e) { fails++; console.log('HATA', name, '\n     ', e.message.split('\n').slice(0, 4).join('\n      ')); }
}

/** Sahte köprü: model dosyaları, yerel motor ve olaylar */
function fake(opts) {
  return ({ files, yukleOk, ram, gpuKapali, yenidenBaslat }) => {
    window.__calls = [];
    window.__wasm = 0;
    const subs = {};
    const emit = (ev, data) => (subs[ev] || []).forEach((f) => f(data));
    let stopId = null;
    try { localStorage.setItem('ac.kurulum', 'atla'); } catch {}
    const P = {
      async addListener(ev, fn) { (subs[ev] ||= []).push(fn); return { remove() { subs[ev] = subs[ev].filter((x) => x !== fn); } }; },
      async paketDurumu() { return { jobs: [], free: 50e9 }; },
      async paketListesi() { return { files }; },
      async fenerDurumu() { return { var: true, ram: ram, cores: 8, threads: 6, yuklu: null, arkaUclar: { gpu: !gpuKapali, devices: 'CPU,GPUOpenCL' }, gpuKapali: !!gpuKapali }; },
      async fenerGpuSifirla() { window.__calls.push(['gpuSifirla']); gpuKapali = false; return { ok: true, yenidenBaslat: !!yenidenBaslat }; },
      async fenerYukle(a) { window.__calls.push(['yukle', a.dosya, a.nCtx, a.gpu]); return yukleOk ? { ok: true, gpu: true, bilgi: { threads: 6 } } : { ok: false, hata: 'Model belleğe sığmadı (bağlam oluşturulamadı)' }; },
      async fenerSohbet(a) {
        window.__calls.push(['sohbet', a.messages.length]);
        const words = 'Kanayan yere temiz bir bezle bastırın ve yaralıyı sıcak tutun. Gerekirse 112’yi arayın. 🙂'.split(' ');
        let n = 0;
        for (const w of words) {
          if (stopId === a.id) return { tokens: n, aborted: true };
          await new Promise((r) => setTimeout(r, window.__slow ? 400 : 20));
          emit('fenerParca', { id: a.id, text: (n ? ' ' : '') + w });
          n++;
        }
        return { tokens: n, promptTokens: 120, promptMs: 300, genMs: 400, aborted: false, error: '' };
      },
      async fenerDurdur(a) { window.__calls.push(['durdur', a?.id]); if (a?.id) stopId = a.id; return {}; },
      async fenerBosalt() { window.__calls.push(['bosalt']); return {}; },
    };
    window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { AkilCantasi: P } };
    // WebAssembly motoru yüklenirse say (yerel yolda hiç yüklenmemeli)
    const origFetch = window.fetch;
    window.fetch = (u, ...r) => { if (String(u).includes('wllama')) window.__wasm++; return origFetch(u, ...r); };
  };
}

async function open(args) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(fake(), args);
  // Paket klasörü adresleri sahte: model dosyasının içeriği yerel motorda okunur, burada istenmez
  await page.route('**/_paket/**', (r) => r.fulfill({ status: 200, body: '' }));
  await page.goto(base + '?tab=fener', { waitUntil: 'networkidle' });
  return { page, errors };
}

const BIG = 'Qwen3.5-9B-Q4_K_M.gguf';
{
  const { page, errors } = await open({ files: [{ name: BIG, size: 5680522464 }], yukleOk: true, ram: 12.5e9 });
  await step('büyük model yerel motorla seçilir ve "Bu cihaza uygun"', async () => {
    await page.waitForSelector(`${tid('fener-status')}[data-mode="model"]`, { timeout: 15000 });
    assert.equal(await page.getAttribute(tid('fener-status'), 'data-model'), BIG);
    await page.click(tid('fener-model-btn'));
    await page.waitForSelector(tid('fener-model-opt'));
    assert.equal(await page.getAttribute(tid('fener-model-opt'), 'data-fit'), 'ok');
    assert.match(await page.textContent(tid('fener-native')), /13 GB RAM, 6 iş parçacığı, GPU var/);
    await page.click(tid('fener-model-close'));
  });
  await step('soru yerel motorla akışlı yanıtlanır, WebAssembly yüklenmez', async () => {
    await page.fill(tid('fener-input'), 'Kanama nasıl durdurulur?');
    await page.press(tid('fener-input'), 'Enter');
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'done', null, { timeout: 30000 });
    const text = await page.evaluate(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop().textContent);
    assert.match(text, /temiz bir bezle bastırın/);
    assert.match(text, /🙂/);
    const calls = await page.evaluate(() => window.__calls);
    assert.deepEqual(calls[0].slice(0, 2), ['yukle', BIG]);
    assert.ok(calls.some((c) => c[0] === 'sohbet'));
    assert.equal(await page.getAttribute(tid('fener-status'), 'data-backend'), 'yerel');
    assert.equal(await page.getAttribute(tid('fener-status'), 'data-gpu'), 'true');
    assert.equal(await page.evaluate(() => window.__wasm), 0);
  });
  await step('Durdur yerel üretimi keser (kimlikli durdurma)', async () => {
    await page.evaluate(() => (window.__slow = true));
    await page.fill(tid('fener-input'), 'Yaralıyı nasıl taşırım?');
    await page.press(tid('fener-input'), 'Enter');
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'write', null, { timeout: 15000 });
    const stopBtn = await page.$('[data-testid="fener-stop"]');
    assert.ok(stopBtn, 'durdur düğmesi yok');
    await stopBtn.click();
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'done', null, { timeout: 15000 });
    const calls = await page.evaluate(() => window.__calls);
    assert.ok(calls.some((c) => c[0] === 'durdur' && c[1]), 'kimlikli durdurma yok: ' + JSON.stringify(calls));
    await page.evaluate(() => (window.__slow = false));
  });
  await step('konsol hatası yok', async () => assert.deepEqual(errors, []));
  await page.close();
}
{
  const { page } = await open({ files: [{ name: BIG, size: 5680522464 }], yukleOk: false, ram: 12.5e9 });
  await step('yerel motor açamazsa ve model WebView\'a sığmazsa Türkçe hata, WebAssembly denenmez', async () => {
    await page.waitForSelector(`${tid('fener-status')}[data-mode="model"]`, { timeout: 15000 });
    await page.fill(tid('fener-input'), 'Kanama nasıl durdurulur?');
    await page.press(tid('fener-input'), 'Enter');
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'done', null, { timeout: 30000 });
    const text = await page.evaluate(() => document.getElementById('main').innerText);
    assert.match(text, /belleğine sığmadı|Daha küçük bir model/);
    assert.ok(!/\/data\//.test(text), 'iç dosya yolu gösterildi');
    assert.equal(await page.evaluate(() => window.__wasm), 0);
  });
  await page.close();
}
for (const yenidenBaslat of [true, false]) {
  const { page, errors } = await open({ files: [{ name: BIG, size: 5680522464 }], yukleOk: true, ram: 12.5e9, gpuKapali: true, yenidenBaslat });
  await step(`GPU kapalıysa panelde not ve "GPU'yu yeniden dene" (yenidenBaslat=${yenidenBaslat})`, async () => {
    await page.waitForSelector(`${tid('fener-status')}[data-mode="model"]`, { timeout: 15000 });
    await page.click(tid('fener-model-btn'));
    await page.waitForSelector(tid('fener-gpu-note'));
    assert.match(await page.textContent(tid('fener-gpu-note')), /sorun çıkardığı için kapatıldı/);
    assert.doesNotMatch(await page.textContent(tid('fener-native')), /GPU var/);
    const box = await page.$eval(tid('fener-gpu-retry'), (e) => e.getBoundingClientRect().height);
    assert.ok(box >= 44, 'düğme 44px altında: ' + box);
    const color = await page.$eval(tid('fener-gpu-note'), (e) => getComputedStyle(e).color);
    assert.ok(!/rgb\(2[0-9]{2}, [0-9]{1,2}, [0-9]{1,2}\)/.test(color), 'kırmızı not: ' + color);
    await page.screenshot({ path: '/tmp/fener-gpu-not.png' });
    await page.click(tid('fener-gpu-retry'));
    await page.waitForSelector(`${tid('fener-gpu-note')}[data-state="${yenidenBaslat ? 'yeniden-ac' : 'hemen'}"]`);
    assert.match(await page.textContent(tid('fener-gpu-note')), yenidenBaslat ? /kapatıp yeniden açınca GPU denenecek/ : /bir sonraki yüklenişinde GPU denenecek/);
    assert.ok((await page.evaluate(() => window.__calls)).some((c) => c[0] === 'gpuSifirla'));
    await page.screenshot({ path: '/tmp/fener-gpu-sonra.png' });
    await page.click(tid('fener-model-close'));
    // Panel yeniden açılınca not kalmaz (gpuKapali artık false)
    await page.click(tid('fener-model-btn'));
    await page.waitForSelector(tid('fener-native'));
    assert.equal(await page.$(tid('fener-gpu-note')), null);
    await page.click(tid('fener-model-close'));
  });
  await step('GPU notu varken konsol hatası yok', async () => assert.deepEqual(errors, []));
  await page.close();
}
{
  // Android'in süreci kapatması: sayfa yeniden yüklenir, localStorage kalır
  const { page, errors } = await open({ files: [{ name: BIG, size: 5680522464 }], yukleOk: true, ram: 12.5e9 });
  const bots = () => page.$$eval(tid('fener-msg-bot'), (e) => e.map((x) => ({ phase: x.dataset.phase, text: x.querySelector('[data-testid="fener-text"]')?.textContent ?? '', yarim: !!x.querySelector('[data-testid="fener-interrupted"]'), src: x.querySelectorAll('[data-testid="fener-source"]').length })));
  await step('tamamlanmış sohbet ve taslak yeniden açılışta geri gelir', async () => {
    await page.waitForSelector(`${tid('fener-status')}[data-mode="model"]`, { timeout: 15000 });
    await page.fill(tid('fener-input'), 'Kanama nasıl durdurulur?');
    await page.press(tid('fener-input'), 'Enter');
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'done', null, { timeout: 30000 });
    const once = await bots();
    await page.fill(tid('fener-input'), 'Yarım kalan taslak');
    // Arka plana geçiş: kayıt hemen yazılır
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector(tid('fener-msg-bot'));
    const sonra = await bots();
    assert.equal(sonra.length, 1);
    assert.equal(sonra[0].text, once[0].text);
    assert.equal(sonra[0].src, once[0].src);
    assert.ok(sonra[0].src > 0, 'kaynak yok');
    assert.equal(sonra[0].yarim, false);
    assert.equal(await page.inputValue(tid('fener-input')), 'Yarım kalan taslak');
    assert.equal((await page.$$(tid('fener-msg-user'))).length, 1);
  });
  await step('yazılırken kapanan cevap "yarım kaldı" + Yeniden sor', async () => {
    await page.fill(tid('fener-input'), '');
    await page.evaluate(() => (window.__slow = true));
    await page.fill(tid('fener-input'), 'Yaralıyı nasıl taşırım?');
    await page.press(tid('fener-input'), 'Enter');
    await page.waitForFunction(() => { const b = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop(); return b?.dataset.phase === 'write' && (b.querySelector('[data-testid="fener-text"]')?.textContent.length ?? 0) > 0; }, null, { timeout: 15000 });
    // Kayıt en geç 1 sn'de bir: bekle, sonra "süreç ölür"
    await page.waitForTimeout(1300);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector(tid('fener-interrupted'));
    const b = await bots();
    assert.equal(b.length, 2);
    assert.ok(b[1].yarim && b[1].phase === 'done' && b[1].text.length > 0, JSON.stringify(b[1]));
    assert.match(await page.textContent(tid('fener-interrupted')), /Cevap yarım kaldı/);
    assert.equal(await page.$(tid('fener-stop')), null);
    await page.screenshot({ path: '/tmp/fener-yarim.png' });
    await page.evaluate(() => (window.__slow = false));
    await page.click(tid('fener-retry'));
    await page.waitForFunction(() => { const b = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')]; return b.length === 2 && b[1].dataset.phase === 'done' && !b[1].querySelector('[data-testid="fener-interrupted"]'); }, null, { timeout: 30000 });
    const users = await page.$$eval(tid('fener-msg-user'), (e) => e.map((x) => x.textContent));
    assert.deepEqual(users, ['Kanama nasıl durdurulur?', 'Yaralıyı nasıl taşırım?']);
    assert.match((await bots())[1].text, /temiz bir bezle/);
  });
  await step('Yeni sohbet kaydı siler; yeniden açılışta boş', async () => {
    await page.click(tid('fener-new'));
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => localStorage.getItem('ac.fener.sohbet')), null);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector(tid('fener-suggest'));
    assert.equal((await page.$$(tid('fener-msg-bot'))).length, 0);
  });
  await step('12 saatten eski kayıt yüklenmez', async () => {
    await page.evaluate(() => localStorage.setItem('ac.fener.sohbet', JSON.stringify({ v: 1, t: Date.now() - 13 * 3600e3, input: 'eski', msgs: [{ id: 1, role: 'user', text: 'Eski soru' }] })));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector(tid('fener-suggest'));
    assert.equal((await page.$$(tid('fener-msg-user'))).length, 0);
    assert.equal(await page.inputValue(tid('fener-input')), '');
    assert.equal(await page.evaluate(() => localStorage.getItem('ac.fener.sohbet')), null);
  });
  await step('kalıcılıkta konsol hatası yok', async () => assert.deepEqual(errors, []));
  await page.close();
}
await browser.close();
console.log(fails ? `${fails} hata` : 'hepsi geçti');
process.exit(fails ? 1 : 0);
