// Bir rehberin her adım kartını (çizim + metin) ayrı ayrı görüntüler.
//   node e2e/guide-shot.mjs <taban-url> <rehber-id> <çıktı-klasörü>
// Çıktı: <klasör>/<id>-00-ust.png (başlık), <id>-01.png … (adımlar), <id>-99-yapmayin.png
import { createRequire } from 'module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const [base = 'http://localhost:5199/', id, out = '/tmp/guide-shots'] = process.argv.slice(2);
if (!id) { console.error('rehber kimliği gerekli'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.goto(new URL('?guide=' + encodeURIComponent(id), base).href, { waitUntil: 'networkidle' });
await p.waitForSelector('[data-testid="guide-detail"]', { timeout: 15000 });
await p.waitForTimeout(400);
await p.screenshot({ path: `${out}/${id}-00-ust.png` });
const steps = await p.$$('[data-testid="guide-step"]');
for (let i = 0; i < steps.length; i++) await steps[i].screenshot({ path: `${out}/${id}-${String(i + 1).padStart(2, '0')}.png` });
const dont = await p.$('.rh-dont');
if (dont) await dont.screenshot({ path: `${out}/${id}-99-yapmayin.png` });
console.log(`${steps.length} adım → ${out}` + (errs.length ? '\nHATALAR: ' + errs.join(' | ') : ''));
await b.close();
