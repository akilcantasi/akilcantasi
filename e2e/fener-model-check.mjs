// Fener model yönetimi uçtan uca kontrolü (gerçek wllama, gerçek model):
//   npm run build && node server/server.mjs --data <paketler> --port 8099
//   node e2e/fener-model-check.mjs http://localhost:8099/ /tmp [--no-answer]
// <paketler> klasöründe şunlar beklenir:
//   - qwen2.5-0.5b-instruct-q4_k_m.gguf (tek dosya)
//   - qwen2.5-0.5b-split-q4_k_m-0000N-of-0000M.gguf (aynı modelin gguf-split parçaları)
//   - fake-2b-q4_k_m-00001-of-00002.gguf (eksik parçalı sahte model) ve mmproj-F16.gguf (yardımcı dosya)
// Kontroller: seçicide modeller gruplanmış, eksik model seçilemez, mmproj listede yok,
// elle seçim kalıcı (yenilemeden sonra), parçalı modelle gerçek bir cevap üretilir.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:8099/';
const shots = process.argv[3] ?? '/tmp';
const answer = !process.argv.includes('--no-answer');
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };

const b = await pw.chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const errors = [];
const external = [];
p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); if (m.type() === 'warning') console.log('  [uyarı]', m.text().slice(0, 200)); });
p.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && !u.protocol.startsWith('blob') && !u.protocol.startsWith('data')) external.push(r.url()); });

await p.goto(base + '?tab=fener', { waitUntil: 'networkidle' });
await p.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.mode === 'model', null, { timeout: 30000 });
const auto = await p.getAttribute('[data-testid="fener-status"]', 'data-model');
check(/qwen2\.5-0\.5b/.test(auto), 'otomatik seçim bir 0.5B model: ' + auto);
check((await p.getAttribute('[data-testid="fener-status"]', 'data-manual')) === 'false', 'otomatik modda');

await p.click('[data-testid="fener-model-btn"]');
await p.waitForSelector('[data-testid="fener-model-opt"]');
const opts = await p.$$eval('[data-testid="fener-model-opt"]', (els) => els.map((e) => ({ id: e.dataset.id, fit: e.dataset.fit, disabled: e.disabled, text: e.textContent })));
console.log('seçenekler:', JSON.stringify(opts.map((o) => [o.id, o.fit, o.disabled])));
check(opts.length === 3, '3 model listeleniyor (mmproj hariç, parçalar gruplanmış)');
check(!opts.some((o) => /mmproj/i.test(o.id)), 'mmproj listede yok');
const split = opts.find((o) => o.id === 'qwen2.5-0.5b-split-q4_k_m.gguf');
check(!!split && /3 parça/.test(split.text) && !split.disabled, 'parçalı model tek seçenek, 3 parça: ' + split?.text);
const fake = opts.find((o) => o.id === 'fake-2b-q4_k_m.gguf');
check(!!fake && fake.disabled && fake.fit === 'incomplete', 'eksik parçalı model seçilemez');
check(/491 MB/.test(split?.text ?? ''), 'boyut gösteriliyor');
await p.screenshot({ path: shots + '/fener-model-panel.png' });

// Elle seçim: tek dosyalı modele geç, kalıcı mı?
await p.click('[data-testid="fener-model-opt"][data-id="qwen2.5-0.5b-instruct-q4_k_m.gguf"]');
await p.click('[data-testid="fener-model-close"]');
await p.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.model === 'qwen2.5-0.5b-instruct-q4_k_m.gguf');
check((await p.getAttribute('[data-testid="fener-status"]', 'data-manual')) === 'true', 'elle seçim durum çubuğunda');
check(/elle seçildi/.test(await p.textContent('[data-testid="fener-model-meta"]')), 'çubukta "elle seçildi"');
await p.reload({ waitUntil: 'networkidle' });
await p.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.mode === 'model');
check((await p.getAttribute('[data-testid="fener-status"]', 'data-model')) === 'qwen2.5-0.5b-instruct-q4_k_m.gguf', 'seçim yenilemeden sonra korunuyor');

// Parçalı modele geç ve onunla gerçek cevap üret
await p.click('[data-testid="fener-model-btn"]');
await p.click('[data-testid="fener-model-opt"][data-id="qwen2.5-0.5b-split-q4_k_m.gguf"]');
await p.click('[data-testid="fener-model-close"]');
await p.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.model === 'qwen2.5-0.5b-split-q4_k_m.gguf');
await p.screenshot({ path: shots + '/fener-model-split.png' });

if (answer) {
  await p.fill('[data-testid="fener-input"]', 'Kanama nasıl durdurulur?');
  await p.press('[data-testid="fener-input"]', 'Enter');
  const t = Date.now();
  const tick = setInterval(async () => {
    const s = await p.evaluate(() => {
      const m = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop();
      return { phase: m?.dataset.phase, len: m?.querySelector('[data-testid="fener-text"]')?.textContent.length ?? 0, eng: window.__fener?.status, prog: window.__fener?.progress };
    }).catch(() => null);
    console.log(`  … ${Math.round((Date.now() - t) / 1000)} sn`, JSON.stringify(s));
  }, 30000);
  await p.waitForFunction(() => {
    const m = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop();
    return m && m.dataset.phase === 'done';
  }, null, { timeout: 1500000, polling: 2000 });
  clearInterval(tick);
  const res = await p.evaluate(() => {
    const m = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop();
    return {
      text: m.querySelector('[data-testid="fener-text"]')?.textContent ?? '',
      label: m.querySelector('[data-testid="fener-label"]')?.textContent ?? '',
      err: m.querySelector('.fener-error')?.textContent ?? '',
      engine: window.__fener,
    };
  });
  console.log(`cevap (${Math.round((Date.now() - t) / 1000)} sn):`, JSON.stringify(res.text.slice(0, 400)));
  console.log('motor:', JSON.stringify({ model: res.engine?.model?.id, status: res.engine?.status, tps: res.engine?.tokensPerSec }));
  check(res.engine?.model?.id === 'qwen2.5-0.5b-split-q4_k_m.gguf', 'parçalı model yüklendi');
  check(!res.label && !res.err, 'rehber yedeğine düşmedi: ' + (res.label || res.err));
  check(res.text.length > 20, 'modelden cevap geldi');
  check(!/<think>|KAYNAKLAR:/.test(res.text), 'cevap temiz');
  await p.screenshot({ path: shots + '/fener-model-answer.png' });
}

check(external.length === 0, 'dış ağ isteği yok' + (external.length ? ': ' + external.slice(0, 3).join(', ') : ''));
check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
await b.close();
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
