// Gerçek modelle Fener: doğru rehber + kendi bilgisiyle cevap.
//   node server/server.mjs --data <paketler> --port 8094 ; node e2e/fener-real-check.mjs http://localhost:8094/ /tmp
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:8094/';
const shots = process.argv[3] ?? '/tmp';
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto(base, { waitUntil: 'networkidle' });
await p.waitForFunction(() => document.querySelector('[data-testid="fener-status"]')?.dataset.mode === 'model', null, { timeout: 60000 });
const waitDone = (n) => p.waitForFunction((n) => {
  const b = document.querySelectorAll('[data-testid="fener-msg-bot"]');
  return b.length >= n && b[n - 1].dataset.phase === 'done';
}, n, { timeout: 900000, polling: 1000 });
const lastText = () => p.evaluate(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.querySelector('[data-testid="fener-text"]')?.textContent ?? '');

await p.fill('[data-testid="fener-input"]', 'Ormanda kayboldum ne yapmalıyım?');
await p.press('[data-testid="fener-input"]', 'Enter');
let t = Date.now();
await waitDone(1);
const a1 = await lastText();
console.log(`1) kaynaklı cevap (${Math.round((Date.now() - t) / 1000)} sn):`, JSON.stringify(a1.slice(0, 500)));
const srcs = await p.$$eval('[data-testid="fener-source"]', (e) => e.map((x) => x.textContent.trim()));
console.log('   kaynaklar:', JSON.stringify(srcs));
check(srcs.some((s) => /kaybol/i.test(s)), 'kaynak: kaybolma rehberi');
check(!srcs.some((s) => /Yangın ve duman/i.test(s)), 'yangın rehberi kaynak değil');
const gb = await p.textContent('[data-testid="fener-verify"]').catch(() => '');
check(/kaybol/i.test(gb), 'büyük rehber düğmesi kaybolma rehberini açıyor: ' + gb.trim());
await p.screenshot({ path: shots + '/fener-kaybol.png', fullPage: true });

check(!!(await p.$('[data-testid="fener-free"]')), '"kendi bilgisiyle" düğmesi var');
await p.click('[data-testid="fener-free"]');
t = Date.now();
await waitDone(2);
const a2 = await lastText();
const lbl = await p.evaluate(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.querySelector('[data-testid="fener-label"]')?.textContent ?? '');
console.log(`2) kendi bilgisi (${Math.round((Date.now() - t) / 1000)} sn):`, JSON.stringify(a2.slice(0, 500)));
check(/kendi bilgisi/i.test(lbl), 'etiket: ' + lbl);
check(a2.length > 30, 'kendi bilgisiyle cevap üretti');
check(a2.slice(0, 60) !== a1.slice(0, 60), 'ilk cevabın kopyası değil');
await p.screenshot({ path: shots + '/fener-free.png', fullPage: true });
await b.close();
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
