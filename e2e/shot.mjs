// Hızlı görsel kontrol: node e2e/shot.mjs <url> <çıktı.png> [tıklanacak test-id'ler...]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const [url, out, ...clicks] = process.argv.slice(2);
const browser = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.goto(url, { waitUntil: 'networkidle' });
for (const c of clicks) {
  if (c.startsWith('wait:')) { await page.waitForTimeout(Number(c.slice(5))); continue; }
  if (c.startsWith('type:')) { const [sel, ...t] = c.slice(5).split('='); await page.fill(`[data-testid="${sel}"]`, t.join('=')); continue; }
  await page.click(`[data-testid="${c}"]`);
  await page.waitForTimeout(300);
}
await page.screenshot({ path: out });
console.log(errors.length ? errors.join('\n') : 'hata yok');
await browser.close();
