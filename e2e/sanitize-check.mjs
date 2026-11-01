// ZIM makale temizleyicisinin gerçek tarayıcıda XSS denetimi:  node e2e/sanitize-check.mjs
import { createRequire } from 'module';
import { buildSync } from 'esbuild';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const code = buildSync({ entryPoints: [new URL('../src/lib/sanitize.ts', import.meta.url).pathname], bundle: true, format: 'iife', globalName: 'S', write: false }).outputFiles[0].text;
const P = [
  '<svg><a xlink:href="jav&#9;ascript:window.hit++"><text y="20">x</text></a></svg>',
  '<a href="jav&#9;ascript:window.hit++">a</a>',
  '<a href="  JaVaScRiPt:window.hit++">b</a>',
  '<map name="m"><area href="javascript:window.hit++" shape="rect" coords="0,0,500,500"></map><img usemap="#m">',
  '<img src=x onerror="window.hit++">',
  '<math><mtext><table><mglyph><style><img src=x onerror="window.hit++"></style></mglyph></table></mtext></math>',
  '<details open ontoggle="window.hit++">d</details>',
  '<a href="data:text/html,<script>parent.hit++</script>">c</a>',
  '<iframe srcdoc="<script>parent.hit++</script>"></iframe>',
  '<form><button formaction="javascript:window.hit++">f</button></form>',
  '<noscript><p title="</noscript><img src=x onerror=window.hit++>"></noscript>',
  '<div style="background:url(javascript:window.hit++)">s</div>',
  '<object data="javascript:window.hit++"></object>',
  '<a href="vbscript:msgbox(1)">v</a><a href="Kedi">ok-iç</a><a href="https://tr.wikipedia.org/">ok-dış</a>',
];
const b = await pw.chromium.launch();
const p = await b.newPage();
await p.setContent('<div id="out"></div>');
await p.addScriptTag({ content: code + ';window.hit=0;' });
const res = await p.evaluate((P) => {
  const lib = { resolveLink: (_p, h) => (/^[A-Za-zÇĞİÖŞÜçğıöşü_]+$/.test(h) ? 'A/' + h : null) };
  const out = document.getElementById('out');
  out.innerHTML = P.map((h) => S.sanitize(h, lib, 'A/X', 'X')).join('<hr>');
  return out.innerHTML;
}, P);
// Her öğeye tıkla (bağlantılar dahil), olası tetiklenmeleri bekle
const n = await p.evaluate(() => document.querySelectorAll('#out *').length);
for (let i = 0; i < n; i++) await p.evaluate((i) => { const e = document.querySelectorAll('#out *')[i]; e?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); try { if (e?.localName !== 'a' || !e.hasAttribute('data-ext')) e?.click?.(); } catch {} }, i).catch(() => {});
await p.waitForTimeout(500);
const hit = await p.evaluate(() => window.hit).catch(() => 'sayfa değişti');
console.log(res);
const bad = await p.evaluate(() => [...document.querySelectorAll('#out *')].some((e) =>
  /^(svg|math|iframe|object|area|map|script|style|form|button)$/i.test(e.localName) ||
  [...e.attributes].some((a) => /^on|^style$|^formaction$/i.test(a.name) || /^\s*(javascript|vbscript|data:text)/i.test(a.value.replace(/[\u0000-\u0020]/g, '')))));
const kept = res.includes('data-zim-path="A/Kedi"') && res.includes('href="https://tr.wikipedia.org/"');
console.log(hit === 0 && !bad && kept ? 'TÜMÜ OK' : `HATA hit=${hit} bad=${bad} kept=${kept}`);
await b.close();
process.exit(hit === 0 && !bad && kept ? 0 : 1);
