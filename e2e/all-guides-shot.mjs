// Tüm rehberlerin adım kartlarını tek tarayıcıyla çeker ve rehber başına bir pafta üretir.
//   node e2e/all-guides-shot.mjs <taban-url> <çıktı-klasörü> [id-öneki|f:kategori ...]
import { createRequire } from 'module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const pw = require('playwright');
const [base, out, ...filters] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 });
await p.goto(base, { waitUntil: 'networkidle' });
const ids = JSON.parse(fs.readFileSync(out + '/../ids.json', 'utf8'));
const pick = ids.filter(([id, cat]) => !filters.length || filters.some((f) => f.startsWith('f:') ? cat === f.slice(2) : id.startsWith(f)));
for (const [id] of pick) {
  await p.goto(new URL('?guide=' + encodeURIComponent(id), base).href, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-testid="guide-detail"]', { timeout: 15000 });
  await p.waitForTimeout(150);
  const steps = await p.$$('[data-testid="guide-step"]');
  const files = [];
  for (let i = 0; i < steps.length; i++) {
    const hasArt = await steps[i].$('svg');
    if (!hasArt) continue;
    const f = `${out}/${id}-${String(i + 1).padStart(2, '0')}.png`;
    await steps[i].screenshot({ path: f });
    files.push(f);
  }
  console.log(id, files.length);
}
await b.close();
