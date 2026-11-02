// Fener yerel motoru (Android llama.cpp) — arayüz sözleşmesi, sahte Capacitor köprüsüyle:
//   • paket klasöründeki model yerel motorla açılır (fenerYukle), WebAssembly hiç yüklenmez
//   • cevap "fenerParca" olaylarıyla akar; durum çubuğu backend=yerel, gpu=true gösterir
//   • Durdur, üretim başlamadan önce bile kaybolmaz (kimlikli fenerDurdur)
//   • yerel motor açamazsa ve model WebView'a sığmıyorsa Türkçe hata (WebAssembly denenmez)
//   • 12 GB RAM bildiren telefonda büyük model "Bu cihaza uygun"
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
  return ({ files, yukleOk, ram }) => {
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
      async fenerDurumu() { return { var: true, ram: ram, cores: 8, threads: 6, yuklu: null, arkaUclar: { gpu: true, devices: 'CPU,GPUOpenCL' } }; },
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
await browser.close();
console.log(fails ? `${fails} hata` : 'hepsi geçti');
process.exit(fails ? 1 : 0);
