// Çizim galerisinin ekran görüntüsü:  node e2e/art-gallery.mjs <taban-url> <çıktı.png> [f:<spec-dosyası> | new | todo | kimlik-öneki]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const [base = 'http://localhost:5199/', out = '/tmp/art.png', prefix = ''] = process.argv.slice(2);
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 980, height: 800 }, deviceScaleFactor: 1.5 });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.goto(new URL('?art=' + encodeURIComponent(prefix), base).href, { waitUntil: 'networkidle' });
await p.waitForSelector('.art-gallery figure', { timeout: 15000 }).catch(() => {});
await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true });
const missing = await p.$$eval('.art-missing', (e) => e.length);
console.log(errs.length ? 'HATALAR:\n' + errs.join('\n') : 'hata yok', '| eksik çizim:', missing);
await b.close();
