// Sıfırdan paket çizimlerini rehber başına pafta olarak görüntüler (inceleme için).
//   node tools/sifirdan-sheet.mjs <paket-json> <çıktı-klasörü> [rehber-id ...]
// Önce: npx -y tsx tools/build-rehber-packs.ts <paket-klasörü>
import fs from 'node:fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pw = require('playwright');
const [file, out, ...ids] = process.argv.slice(2);
const pack = JSON.parse(fs.readFileSync(file, 'utf8'));
fs.mkdirSync(out, { recursive: true });
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
const font = 'IBM Plex Sans, Noto Sans, sans-serif';
for (const g of pack.guides) {
  if (ids.length && !ids.includes(g.id)) continue;
  const cards = g.steps.map((s, i) => {
    const a = g.art?.[i];
    if (!a) return '';
    const svg = pack.art[a] ?? '<div style="padding:40px;color:red">EKSİK: ' + esc(a) + '</div>';
    return `<div class="c"><div class="im">${svg}</div><div class="t"><b>${i + 1}</b> ${esc(s)}<div class="id">${esc(a)}</div></div></div>`;
  }).filter(Boolean);
  if (!cards.length) continue;
  const html = `<html><head><style>body{margin:0;background:#fff;font-family:${font}}h1{font-size:18px;margin:8px 12px}.g{display:grid;grid-template-columns:repeat(3,380px);gap:8px;padding:0 8px 8px}.c{background:#1b2738;border-radius:12px;overflow:hidden}.im svg{width:380px;height:285px;display:block}.t{color:#fff;font-size:14px;padding:8px 10px;line-height:1.35}.t b{background:#f5a524;color:#000;border-radius:50%;padding:1px 7px;margin-right:6px}.id{color:#8aa;font-size:11px;margin-top:4px}</style></head><body><h1>${esc(g.id)} — ${esc(g.title)}</h1><div class="g">${cards.join('')}</div></body></html>`;
  await p.setContent(html);
  await p.screenshot({ path: `${out}/${g.id}.png`, fullPage: true });
}
await b.close();
console.log('ok');
