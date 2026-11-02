// Fener uçtan uca kontrolü (gerçek tarayıcı, gerçek wllama):
//   node e2e/fener-check.mjs [taban-url] [ekran-görüntüsü-klasörü]
// Gerekenler: Vite dev sunucusu (COOP/COEP başlıklarıyla) ve
// /__dev/tiny-test.gguf (tools/make_tiny_gguf.py ile üretilir).
// 1) ?devmodel=… ile model modu: soru gönderilir, akış halinde token geldiği doğrulanır.
// 2) Model olmadan rehber modu: "kanama" sorusuna rehber cevabı gelir.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const base = process.argv[2] ?? 'http://localhost:5184/';
const shots = process.argv[3] ?? '/tmp';
const failures = [];
const check = (ok, msg) => { console.log((ok ? 'OK   ' : 'FAIL ') + msg); if (!ok) failures.push(msg); };

const browser = await pw.chromium.launch();

async function open(url) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  return { page, errors };
}

// ---- 1) Model modu --------------------------------------------------------
{
  const { page, errors } = await open(new URL('?devmodel=/__dev/tiny-test.gguf', base).href);
  const env = await page.evaluate(() => ({ isolated: crossOriginIsolated, cores: navigator.hardwareConcurrency, mem: navigator.deviceMemory }));
  console.log('ortam:', JSON.stringify(env));
  check(env.isolated === true, 'crossOriginIsolated = true');
  await page.waitForSelector('[data-testid="fener-status"][data-mode="model"]', { timeout: 10000 });
  const status = await page.textContent('[data-testid="fener-status"]');
  check(/Etkin model: tiny-test/.test(status), 'durum çubuğu model adını gösteriyor: ' + status.trim());
  await page.screenshot({ path: shots + '/fener-empty.png' });

  await page.fill('[data-testid="fener-input"]', 'Kanama nasıl durdurulur?');
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForSelector('[data-testid="fener-msg-user"]');
  check(await page.isDisabled('[data-testid="fener-send"]'), 'üretim sırasında gönder düğmesi kapalı');
  const t0 = Date.now();
  // Akış: metin büyümeli
  let lens = [];
  for (let i = 0; i < 400; i++) {
    const s = await page.evaluate(() => {
      const b = [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop();
      return { phase: b?.dataset.phase, len: b?.querySelector('[data-testid="fener-text"]')?.textContent.length ?? 0 };
    });
    lens.push(s.len);
    if (s.phase === 'write' && s.len > 0 && lens.filter((l) => l > 0).length === 1) await page.screenshot({ path: shots + '/fener-streaming.png' });
    if (s.phase === 'done') break;
    await page.waitForTimeout(50);
  }
  const distinct = new Set(lens.filter((l) => l > 0)).size;
  const st = await page.evaluate(() => window.__fener);
  const text = await page.textContent('[data-testid="fener-msg-bot"] [data-testid="fener-text"]').catch(() => '');
  console.log('üretilen metin:', JSON.stringify((text ?? '').slice(0, 160)));
  console.log('motor:', JSON.stringify({ status: st?.status, threads: st?.threads, multithread: st?.multithread, isolated: st?.isolated, tps: st?.tokensPerSec }), 'süre', Date.now() - t0, 'ms');
  check((text ?? '').length > 0, 'model token üretti');
  check(distinct >= 2, `metin akış halinde büyüdü (${distinct} ara uzunluk)`);
  check(st?.threads >= 1 && (st.threads === 1 || st.multithread), `iş parçacığı: ${st?.threads}, mt=${st?.multithread}`);
  check((await page.$$('[data-testid="fener-source"]')).length > 0, 'kaynak etiketleri gösterildi');
  check(!!(await page.$('[data-testid="fener-critical"]')), '"kanama" için hayati durum uyarısı');
  check(!(await page.$('[data-testid="fener-label"]')), 'model cevabında rehber modu etiketi yok');
  await page.screenshot({ path: shots + '/fener-model.png' });

  // Durdur düğmesi
  await page.fill('[data-testid="fener-input"]', 'Uzun bir cevap yaz');
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForSelector('[data-testid="fener-stop"]');
  await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'write', null, { timeout: 15000 });
  await page.waitForTimeout(150);
  await page.click('[data-testid="fener-stop"]').catch(() => {});
  await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'done', null, { timeout: 15000 });
  check(true, 'durdurma sonrası cevap tamamlandı');

  // Sekme değiştirince konuşma korunur
  await page.click('[data-testid="nav-rehber"]');
  await page.click('[data-testid="nav-fener"]');
  check((await page.$$('[data-testid="fener-msg-user"]')).length === 2, 'sekme değişiminde konuşma korundu');

  // Kaynak etiketine tıklayınca rehbere gider
  await page.click('[data-testid="fener-source"][data-kind="rehber"]');
  const tab = await page.textContent('[data-testid="tab-sub"]');
  check(/rehber/.test(tab), 'rehber kaynağı Rehber sekmesini açtı');
  const errs1 = errors.filter((e) => !/favicon/.test(e));
  check(errs1.length === 0, 'model modunda konsol hatası yok' + (errs1.length ? ':\n  ' + errs1.join('\n  ') : ''));
  await page.close();
}

// ---- 2) Rehber modu (model yok) -------------------------------------------
{
  const { page, errors } = await open(base);
  await page.waitForSelector('[data-testid="fener-status"]:not([data-mode="checking"])', { timeout: 10000 });
  const status = await page.textContent('[data-testid="fener-status"]');
  check(/Model yok — rehber modu/.test(status), 'durum: ' + status.trim());
  const sug = await page.$$('[data-testid="fener-suggest"]');
  check(sug.length === 4, 'dört hızlı soru');
  await sug[1].click(); // Kanaması olan birine…
  await page.waitForFunction(() => document.querySelector('[data-testid="fener-msg-bot"]')?.dataset.phase === 'done', null, { timeout: 10000 });
  const label = await page.textContent('[data-testid="fener-label"]');
  check(label === 'Model yüklü değil — rehberden yanıt', 'etiket: ' + label);
  const text = await page.textContent('[data-testid="fener-text"]');
  check(/İlk adımlar:/.test(text), 'rehberden ilk adımlar verildi');
  check(!!(await page.$('[data-testid="fener-critical"]')), 'hayati durum uyarısı gösterildi');
  const src = await page.$$eval('[data-testid="fener-source"]', (els) => els.map((e) => e.textContent));
  console.log('kaynaklar:', src.join(' | '));
  check(src.length > 0, 'kaynak etiketleri');
  await page.screenshot({ path: shots + '/fener-fallback.png' });

  // pendingQuestion: başka sekmeden soru gelirse otomatik gönderilir
  await page.click('[data-testid="fener-new"]');
  check((await page.$$('[data-testid="fener-msg-user"]')).length === 0, 'Yeni sohbet konuşmayı temizledi');
  const errs2 = errors.filter((e) => !/favicon/.test(e));
  check(errs2.length === 0, 'rehber modunda konsol hatası yok' + (errs2.length ? ':\n  ' + errs2.join('\n  ') : ''));
  await page.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} kontrol başarısız` : '\nTüm kontroller geçti');
process.exit(failures.length ? 1 : 0);
