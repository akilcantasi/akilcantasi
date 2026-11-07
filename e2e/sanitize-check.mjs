// ZIM makale temizleyicisinin gerçek tarayıcıda XSS denetimi:  node e2e/sanitize-check.mjs
// Ayrıca: "yükleniyor" göstergelerinin atılması ve betiksiz kabuk giriş sayfası algısı (src/lib/zim/dizin.ts).
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
  // --- Denetim 2026-11: ek vektörler ---
  // Ad alanı karışıklığı / mXSS
  '<svg></p><style><a id="</style><img src=1 onerror=window.hit++>">',
  '<math><mtext><table><mglyph><style><!--</style><img title="--&gt;&lt;img src=1 onerror=window.hit++&gt;">',
  '<form><math><mtext></form><form><mglyph><style></math><img src onerror=window.hit++>',
  '<select><template><style><img src=x onerror=window.hit++></style></template></select>',
  '<table><caption><svg><foreignObject><img src=x onerror=window.hit++></foreignObject></svg></caption></table>',
  '<noembed><img src=x onerror=window.hit++></noembed><noframes><img src=x onerror=window.hit++></noframes><xmp><img src=x onerror=window.hit++></xmp>',
  '<template><img src=x onerror=window.hit++></template><image src=x onerror=window.hit++>',
  // Belge düzeyi: base, meta yenileme, link, stil enjeksiyonu
  '<base href="javascript:window.hit++//"><a href="goreli">base</a>',
  '<meta http-equiv="refresh" content="0;url=javascript:window.hit++"><link rel="stylesheet" href="https://example.invalid/x.css">',
  '<style>@import url("https://example.invalid/x.css"); body{background:url(javascript:window.hit++)}</style>',
  '<p style="behavior:url(x.htc);width:expression(window.hit++)">css</p>',
  // Gömülü içerik ve formlar
  '<embed src="javascript:window.hit++"><iframe src="javascript:window.hit++"></iframe><object data="data:text/html,<script>parent.hit++</script>"></object>',
  '<input autofocus onfocus="window.hit++"><keygen autofocus onfocus="window.hit++"><video><source onerror="window.hit++"></video>',
  '<form action="javascript:window.hit++"><button>gönder</button></form><isindex action="javascript:window.hit++">',
  // Adres hileleri
  '<a href="&#106;avascript:window.hit++">e1</a><a href="java&#x09;script:window.hit++">e2</a><a href="javascript&colon;window.hit++">e3</a>',
  '<a href="&#1;javascript:window.hit++">e4</a><a href=" &#14; javascript:window.hit++">e5</a><a href="JAVASCRIPT:window.hit++">e6</a>',
  '<img srcset="javascript:window.hit++ 1x" src="data:image/svg+xml,<svg onload=window.hit++>"><a ping="https://example.invalid/" download href="https://example.invalid/">ping</a>',
  '<a href="data:text/html;base64,PHNjcmlwdD5wYXJlbnQuaGl0Kys8L3NjcmlwdD4=">d64</a><a href="blob:https://x/y">blob</a>',
  // DOM clobbering: kimlikler önekli olmalı, name atılmalı
  '<p id="Capacitor">c</p><div id="main">m</div><img name="getElementById"><a id="location" name="location">l</a><form name="cookie"></form>',
  '<h2 id="bolum">Bölüm</h2><a href="#bolum">çapa</a><a href="#yok">ölü çapa</a><table><tr><th id="t1">a</th><td headers="t1">b</td></tr></table>',
  // Sınıf çakışması: uygulamanın tam ekran katmanları
  '<div class="ku cm-flash sz-big btn primary mw-editsection noprint">sınıf</div>',
];
const b = await pw.chromium.launch();
const p = await b.newPage();
await p.setContent('<main id="main"><div id="out"></div></main>');
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
const bad = await p.evaluate(() => [...document.querySelectorAll('#out *')].filter((e) =>
  /^(svg|math|iframe|object|embed|area|map|script|style|form|button|input|base|meta|link|template|noscript|select|video|source|image|keygen|isindex|noembed|noframes|xmp)$/i.test(e.localName) ||
  [...e.attributes].some((a) =>
    /^on|^style$|^formaction$|^action$|^srcset$|^ping$|^download$|^name$|^xlink:|^src$/i.test(a.name) ||
    /^\s*(javascript|vbscript|data:|blob:)/i.test(a.value.replace(/[\u0000- ]/g, '')) ||
    (a.name === 'id' && !a.value.startsWith('zim-')) ||
    (a.name === 'headers' && a.value.split(/\s+/).some((x) => !x.startsWith('zim-'))) ||
    (a.name === 'class' && a.value.split(/\s+/).some((c) => !/^mw-|^noprint$|^kt-table$/.test(c))) ||
    (a.name === 'target' && !e.hasAttribute('data-ext')))).map((e) => e.outerHTML.slice(0, 120)));
// DOM clobbering: uygulamanın kimlikleri ve genel adları makaleden etkilenmemeli
const clob = await p.evaluate(() => ({
  capacitor: typeof window.Capacitor,
  main: document.getElementById('main')?.localName,
  // document.cookie okunamıyor (about:blank); ezilmişse belgenin kendi özelliği olarak görünür
  cookie: Object.getOwnPropertyDescriptor(document, 'cookie') === undefined ? 'string' : 'ezildi',
  gebi: typeof document.getElementById,
  location: window.location instanceof Location,
  anchor: document.querySelector('#out a[href^="#zim-"]')?.getAttribute('href') ?? null,
  anchorTarget: !!document.getElementById('zim-bolum'),
  dead: [...document.querySelectorAll('#out a[href^="#"]:not([data-zim-path])')].filter((a) => !document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).length,
  cls: document.querySelector('#out .mw-editsection')?.className ?? null,
}));
const clobOk = clob.capacitor === 'undefined' && clob.main === 'main' && clob.cookie === 'string' && clob.gebi === 'function' && clob.location &&
  clob.anchor === '#zim-bolum' && clob.anchorTarget && clob.dead === 0 && clob.cls === 'mw-editsection noprint';
const kept = res.includes('data-zim-path="A/Kedi"') && res.includes('href="https://tr.wikipedia.org/"');
console.log('clobbering:', JSON.stringify(clob));
if (bad.length) console.log('yasak öğe/öznitelik:', bad);
// "Yükleniyor" göstergeleri ve betiksiz kabuk sayfalar (Gutenberg giriş sayfası: dönen GIF görünüyor,
// sayfa hiç açılmıyordu). Madde görselleri ve "Loading" adlı bölüm başlıkları korunmalı.
const dizinKod = buildSync({ entryPoints: [new URL('../src/lib/zim/dizin.ts', import.meta.url).pathname], bundle: true, format: 'iife', globalName: 'D', write: false }).outputFiles[0].text;
await p.addScriptTag({ content: dizinKod });
const gut = `<html><head><script src="jquery.js"></script><script src="full_by_popularity.js"></script></head><body><h1>Project Gutenberg Library</h1>
<select><option>All languages</option></select><div id="spinner" class="loading"><img src="images/load.gif" alt="Loading..."></div>
<table id="books_table"><thead><tr><th>Title</th><th>Author</th></tr></thead><tbody></tbody></table><script>init()</script></body></html>`;
const yuk = await p.evaluate((gut) => {
  const lib = { resolveLink: (_f, h) => (/^https?:/.test(h) ? null : h) };
  const temiz = S.sanitize(gut, lib, 'index.html', 'x');
  const madde = S.sanitize('<h2 id="Loading">Loading</h2><p>Loading a muzzle-loader takes time.</p><figure><img src="Loading_dock.gif" alt="Loading"><figcaption>Bir yükleme rampası</figcaption></figure><p><img src="ajax-loader.gif"> <img src="img/spinner.svg" alt=""> <img src="Kedi.jpg" alt="Kedi"></p><div class="lds-ring"></div><span class="dataTables_processing">Processing...</span>', lib, 'a', 'b');
  const uzunMetin = '<p>' + 'Uzun bir madde metni. '.repeat(30) + '</p>';
  return {
    gifYok: !/load\.gif|spinner/.test(temiz),
    kabuk: D.sayfaKabukMu(gut),
    maddeBaslikVar: /<h2 id="zim-Loading">Loading<\/h2>/.test(madde),
    figurVar: madde.includes('data-zim-src="Loading_dock.gif"'),
    kediVar: madde.includes('data-zim-src="Kedi.jpg"'),
    gostergeYok: !/ajax-loader|spinner\.svg|lds-ring|Processing/.test(madde),
    // Kabuk sayılmamalı: betiksiz sayfa; betikli ama içerikli sayfa; çok bağlantılı giriş sayfası
    betiksiz: D.sayfaKabukMu('<body><p>Kısa.</p></body>'),
    icerikli: D.sayfaKabukMu('<script src="a.js"></script><body>' + uzunMetin + '</body>'),
    baglantili: D.sayfaKabukMu('<script src="a.js"></script><body>' + Array.from({ length: 20 }, (_, i) => `<a href="s${i}.html">S${i}</a>`).join(' ') + '</body>'),
    // Kabuk: betikli, neredeyse boş gövde (SPA)
    bos: D.sayfaKabukMu('<head><script src="app.js"></script></head><body><div id="app"></div></body>'),
  };
}, gut);
console.log('yükleniyor/kabuk:', JSON.stringify(yuk));
const yukOk = yuk.gifYok && yuk.kabuk && yuk.maddeBaslikVar && yuk.figurVar && yuk.kediVar && yuk.gostergeYok && !yuk.betiksiz && !yuk.icerikli && !yuk.baglantili && yuk.bos;
const ok = hit === 0 && !bad.length && kept && clobOk && yukOk;
console.log(ok ? 'TÜMÜ OK' : `HATA hit=${hit} bad=${bad.length} kept=${kept} clobbering=${clobOk} yükleniyor=${yukOk}`);
await b.close();
process.exit(ok ? 0 : 1);
