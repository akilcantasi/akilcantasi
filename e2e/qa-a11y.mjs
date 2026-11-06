// QA: erişilebilirlik ve uygulama kabuğu (App.tsx, main.tsx, app.css, store.ts).
//   npm run build && node e2e/qa-a11y.mjs              (dist/'i server/server.mjs ile kendisi sunar)
//   node e2e/qa-a11y.mjs http://localhost:8080/       (çalışan bir sunucuya karşı)
// Kontroller: axe-core (tüm sekmeler ve alt ekranlar, 360 px, normal ve en büyük yazı),
// yatay taşma, dokunma alanı ≥ 44 px, adsız düğmeler, başlık yapısı, altı sekmeli
// gezinme (360 px + en büyük yazı), klavye sırası ve görünür odak, çevrimiçi/çevrimdışı
// rozeti, doğrudan bağlantılar, pil tasarrufu / düşük güç, yük sonrası çevrimdışı çalışma
// (tek izinli dış istek: isteğe bağlı çevrim içi katalog).
// Denetim 2026-11 ekleri: altı sekmede ve 4 ekran boyutunda sol/sağ boşluk eşitliği, güvenli alan,
// yatay telefon + çentik, büyük yazıda menü ve üst çubuk, masaüstü kaydırma çubuğu, hata sınırı
// (?qa-cokme=<sekme>), bozuk doğrudan bağlantılar, bozuk/engelli localStorage, geri tuşu (popstate),
// Kurulum penceresinde odak/inert/geri, açılış ekranı ve çevrimiçi gezintide dış istekler.
import { createRequire } from 'module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AXE = fs.readFileSync(path.join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8');
const SHOTS = process.env.QA_SHOTS ?? '/tmp';
let base = process.argv[2];
let server = null;
if (!base) {
  const port = 8791 + Math.floor(Math.random() * 100);
  const dist = process.env.QA_DIST ?? path.join(ROOT, 'dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('dist/index.html yok: önce `npm run build`');
    process.exit(2);
  }
  server = spawn(process.execPath, [path.join(ROOT, 'server/server.mjs'), '--port', String(port), '--dist', dist, '--host', '127.0.0.1'], { stdio: 'ignore' });
  base = `http://127.0.0.1:${port}/`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
}
if (!base.endsWith('/')) base += '/';
const ORIGIN = new URL(base).origin;
// İsteğe bağlı çevrim içi katalog (src/lib/manifest.ts REMOTE_MANIFEST_URL; packs-ui.tsx usePackRows ister)
const ALLOWED_EXTERNAL = ['https://huggingface.co/datasets/akilcantasi/paketler/resolve/main/packs-manifest.json', 'https://akilcantasi.com/packs/packs-manifest.json'];

const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
// İzinli dış isteğin (katalog) çevrimdışı/proxy hatası konsol hatası sayılmaz.
// "a|b": seçeneklerden biri yeterli (ör. harita: paket varsa tuval, yoksa "Paket ekle")
const sel = (tid) => tid.split('|').map((t) => `[data-testid="${t}"]`).join(', ');
const benign = (t) => /ERR_INTERNET_DISCONNECTED|ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_PROXY|ERR_CONNECTION|packs-manifest|Failed to load resource/.test(t);

const COMM = ['pano', 'iyiyim', 'kayip', 'duyuru', 'sos', 'mors', 'sms', 'baglan'];
const TOOLS = ['canta', 'hesap', 'stok', 'pil', 'pusula', 'cocuk', 'sozluk', 'radyo', 'paylas', 'ayarlar'];
const SCREENS = [
  ['?tab=fener', 'fener-model-btn'],
  ['?tab=rehber', 'guide-category'],
  ['?cat=deprem', 'category-detail'],
  ['?guide=deprem-aninda', 'guide-detail'],
  ['?tab=harita', 'map|map-get-packs'],
  ['?tab=iletisim', 'comm-home'],
  ...COMM.map((c) => ['?comm=' + c, null]),
  ['?tab=kutuphane', null],
  ['?tab=araclar', 'tool-card-canta'],
  ...TOOLS.map((t) => ['?tool=' + t, 'tool-' + t]),
];

const browser = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function newCtx({ w = 360, h = 640, textSize = 0, extra = {}, saver = false } = {}) {
  // bypassCSP: axe-core betiği sayfaya eklenebilsin (sunucu CSP'si satır içi betiği engeller)
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, bypassCSP: true });
  await ctx.addInitScript(([ts, ex, sv]) => {
    try {
      if (!sessionStorage.getItem('qa-init')) {
        sessionStorage.setItem('qa-init', '1');
        localStorage.setItem('ac.settings', JSON.stringify({ textSize: ts, ...ex }));
        localStorage.setItem('ac.batterySaver', sv ? '1' : '0');
      }
    } catch {}
  }, [textSize, extra, saver]);
  // Dış istekler (yalnız isteğe bağlı katalog) beklenmeden kesilir: test hızlı ve
  // deterministik kalır; 'request' olayı yine de tetiklenir, denetlenebilir.
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
  return ctx;
}

function watch(page) {
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !benign(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  return errs;
}

/** Sayfadaki erişilebilirlik ve düzen ölçümleri */
async function audit(page) {
  if (!(await page.evaluate(() => typeof window.axe !== 'undefined'))) await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'] });
    const violations = r.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
    const vw = document.documentElement.clientWidth;
    const main = document.getElementById('main');
    const overflow = [];
    if (document.scrollingElement.scrollWidth > vw + 1) overflow.push('document ' + document.scrollingElement.scrollWidth);
    if (main && main.scrollWidth > main.clientWidth + 1) overflow.push('main ' + main.scrollWidth);
    // Kırpılmamış (overflow:auto/hidden kabı dışında kalan) taşan öğeler
    document.querySelectorAll('#app *').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (!b.width || b.right <= vw + 1) return;
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o !== 'visible') { if (p.getBoundingClientRect().right <= vw + 1) return; break; }
      }
      overflow.push((el.dataset.testid || el.className || el.tagName) + '@' + Math.round(b.right));
    });
    // Dokunma alanı: görünür etkileşimli öğeler en az 44×44 (metin içi bağlantılar hariç)
    const small = [];
    document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=switch], [role=tab]').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || el.closest('[hidden],[aria-hidden=true]')) return;
      if (el.tagName === 'A' && s.display === 'inline' && el.closest('p,li')) return;
      if (['checkbox', 'radio'].includes(el.type) && el.closest('label')?.getBoundingClientRect().height >= 43.5) return;
      if (el.type === 'range' && b.width >= 44) return;
      if (b.width < 43.5 || b.height < 43.5) small.push((el.dataset.testid || el.getAttribute('aria-label') || el.textContent.trim().slice(0, 24) || el.tagName) + ` ${Math.round(b.width)}x${Math.round(b.height)}`);
    });
    const noName = [];
    document.querySelectorAll('button, a[href]').forEach((el) => {
      if (!el.textContent.trim() && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.title) noName.push(el.dataset.testid || el.className || el.tagName);
    });
    const h1 = document.querySelectorAll('#main h1').length;
    return { violations, overflow: [...new Set(overflow)].slice(0, 6), small: [...new Set(small)].slice(0, 10), noName, h1 };
  });
}

// ---------------------------------------------------------------- 1) tarama
for (const textSize of [0, 3]) {
  const ctx = await newCtx({ textSize });
  for (const [u, tid] of SCREENS) {
    const page = await ctx.newPage();
    const errs = watch(page);
    await page.goto(base + u, { waitUntil: 'networkidle' }).catch(() => {});
    if (tid) await page.waitForSelector(sel(tid), { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(400);
    const a = await audit(page);
    const tag = `[${u} yazı=${textSize}]`;
    check(a.violations.length === 0, `${tag} axe ihlali yok${a.violations.length ? ' → ' + a.violations.join(' ; ') : ''}`);
    check(a.overflow.length === 0, `${tag} 360 px'te yatay taşma yok${a.overflow.length ? ' → ' + a.overflow.join(', ') : ''}`);
    check(a.small.length === 0, `${tag} dokunma alanları ≥ 44 px${a.small.length ? ' → ' + a.small.join(', ') : ''}`);
    check(a.noName.length === 0, `${tag} adsız düğme yok${a.noName.length ? ' → ' + a.noName.join(', ') : ''}`);
    check(a.h1 === 1, `${tag} tam olarak bir h1 (${a.h1})`);
    check(errs.length === 0, `${tag} konsol hatası yok${errs.length ? ' → ' + errs.slice(0, 2).join(' | ') : ''}`);
    await page.close();
  }
  await ctx.close();
}

// ---------------------------------------------------------------- 2) gezinme çubuğu 360 px
for (const textSize of [0, 3]) {
  const ctx = await newCtx({ textSize });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  const nav = await page.evaluate(() => [...document.querySelectorAll('.app-nav .nav-btn')].map((b) => {
    const r = b.getBoundingClientRect();
    const sp = b.querySelector('span');
    return { id: b.dataset.testid, w: r.width, h: r.height, l: r.left, r: r.right, clipped: sp.scrollWidth > sp.clientWidth + 1, spR: sp.getBoundingClientRect().right, spL: sp.getBoundingClientRect().left };
  }));
  check(nav.length === 6, `[nav yazı=${textSize}] altı sekme`);
  check(nav.every((n) => n.h >= 44 && n.w >= 44), `[nav yazı=${textSize}] sekme düğmeleri ≥ 44 px (${nav.map((n) => Math.round(n.w) + 'x' + Math.round(n.h)).join(' ')})`);
  check(nav.every((n) => n.l >= 0 && n.r <= 360.5 && n.spL >= -0.5 && n.spR <= 360.5), `[nav yazı=${textSize}] tüm sekmeler ve etiketleri ekranda`);
  // Komşu etiketler çakışmasın
  const sorted = [...nav].sort((a, b) => a.l - b.l);
  // Komşu etiketler arasında en az 5 px (App.tsx navSigdir gerekirse etiketleri küçültür, kesmez)
  const araliklar = sorted.slice(1).map((n, i) => n.spL - sorted[i].spR);
  check(araliklar.every((g) => g >= 5) && nav.every((n) => !n.clipped), `[nav yazı=${textSize}] sekme etiketleri çakışmıyor, kesilmiyor (en dar ${Math.min(...araliklar).toFixed(1)} px)`);
  await page.screenshot({ path: `${SHOTS}/qa-a11y-nav-${textSize}.png` });
  await ctx.close();
}

// ---------------------------------------------------------------- 3) klavye, odak, başlık, durum rozeti
{
  const ctx = await newCtx({ w: 390, h: 844 });
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base + '?tab=araclar', { waitUntil: 'networkidle' });
  // Sekme ana ekranında görünmez sekme başlığı (h1)
  check((await page.textContent('[data-testid="tab-title"]'))?.trim() === 'Araçlar', 'ana ekranda sekme başlığı h1 (ekran okuyucu)');
  // Tab sırası: içerik → gezinme çubuğu, her durakta görünür odak
  const order = [];
  let noOutline = [];
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const s = getComputedStyle(a);
      const visible = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 1) || (s.boxShadow && s.boxShadow !== 'none');
      return { id: a.dataset.testid || a.tagName, visible, inNav: !!a.closest('.app-nav') };
    });
    if (!f) continue;
    order.push(f);
    if (!f.visible) noOutline.push(f.id);
    if (f.id === 'nav-araclar') break;
  }
  const firstNav = order.findIndex((o) => o.inNav);
  check(order.some((o) => o.id === 'tool-card-canta'), 'klavye ile araç kartlarına ulaşılıyor');
  check(firstNav > 0 && order.slice(firstNav).every((o) => o.inNav), 'odak sırası: içerik sonra gezinme çubuğu');
  check(order.filter((o) => o.inNav).map((o) => o.id).join(',') === 'nav-fener,nav-rehber,nav-harita,nav-iletisim,nav-kutuphane,nav-araclar', 'gezinme düğmeleri soldan sağa sırada');
  check(noOutline.length === 0, 'her odak durağında görünür odak çerçevesi' + (noOutline.length ? ' → ' + noOutline.join(',') : ''));
  // Klavyeyle sekme değiştir: odak düğmede kalır, aria-current güncellenir
  await page.focus('[data-testid="nav-rehber"]');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-testid="guide-category"]');
  check((await page.getAttribute('[data-testid="nav-rehber"]', 'aria-current')) === 'page', 'Enter ile sekme değişiyor, aria-current=page');
  check(await page.evaluate(() => document.activeElement?.dataset.testid === 'nav-rehber'), 'sekme değişince odak gezinme düğmesinde kalıyor');
  // Alt ekran açılınca odak kaybolmaz → yeni ekranın başlığına taşınır
  await page.focus('[data-testid="guide-category"]');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-testid="category-detail"]');
  await page.waitForTimeout(250);
  check(await page.evaluate(() => document.activeElement?.tagName === 'H1'), 'kategori açılınca odak başlıkta (body\'ye düşmüyor)');
  await page.click('[data-testid="nav-araclar"]');
  await page.focus('[data-testid="tool-card-hesap"]');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-testid="tool-hesap"]');
  await page.waitForTimeout(400);
  check(await page.evaluate(() => document.activeElement?.tagName === 'H1' && document.activeElement.closest('#main')), 'araç açılınca odak aracın başlığında');
  check(await page.evaluate(() => document.querySelectorAll('#main h1').length === 1), 'alt ekranda tek h1 (gizli sekme başlığı kalkıyor)');
  // Sekme değişince kaydırma en üste
  await page.click('[data-testid="nav-araclar"]');
  await page.evaluate(() => document.getElementById('main').scrollTo(0, 9999));
  await page.click('[data-testid="nav-iletisim"]');
  await page.waitForTimeout(200);
  check(await page.evaluate(() => document.getElementById('main').scrollTop === 0), 'sekme değişince içerik en üstten başlıyor');
  // Durum rozeti
  const pill = '[data-testid="net-status"]';
  check((await page.getAttribute(pill, 'role')) === 'status', 'çevrimiçi rozeti role=status (değişim duyurulur)');
  check((await page.textContent(pill)).includes('Çevrimiçi'), 'rozet: Çevrimiçi');
  await ctx.setOffline(true);
  await page.waitForTimeout(200);
  check((await page.textContent(pill)).includes('Çevrimdışı'), 'bağlantı kesilince rozet: Çevrimdışı');
  check(!(await page.$eval(pill + ' .dot', (d) => d.classList.contains('on'))), 'çevrimdışında yeşil nokta yok');
  await page.screenshot({ path: `${SHOTS}/qa-a11y-offline-pill.png` });
  await ctx.setOffline(false);
  await page.waitForTimeout(200);
  check((await page.textContent(pill)).includes('Çevrimiçi'), 'bağlantı gelince rozet: Çevrimiçi');
  const pc = await page.$eval(pill, (el) => { const r = el.getBoundingClientRect(); return r.right <= window.innerWidth; });
  check(pc, 'rozet ekranda');
  check(errs.length === 0, 'klavye/rozet akışında konsol hatası yok' + (errs.length ? ' → ' + errs.join(' | ') : ''));
  await ctx.close();
}

// ---------------------------------------------------------------- 4) doğrudan bağlantılar
{
  const ctx = await newCtx({ w: 390, h: 844 });
  const cases = [
    ['?tab=harita', 'nav-harita', 'map|map-get-packs'],
    ['?tab=kutuphane', 'nav-kutuphane', null],
    ['?cat=deprem', 'nav-rehber', 'category-detail'],
    ['?guide=deprem-aninda', 'nav-rehber', 'guide-detail'],
    ['?tool=pusula', 'nav-araclar', 'tool-pusula'],
    ['?comm=mors', 'nav-iletisim', 'morse-input'],
    ['?tab=bilinmeyen', 'nav-fener', 'fener-model-btn'],
    ['?tool=yok', 'nav-araclar', null],
    ['?guide=yok', 'nav-rehber', null],
    ['?comm=yok', 'nav-iletisim', null],
    ['?cat=yok', 'nav-rehber', null],
  ];
  for (const [u, nav, tid] of cases) {
    const page = await ctx.newPage();
    const errs = watch(page);
    await page.goto(base + u, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const cur = await page.getAttribute(`[data-testid="${nav}"]`, 'aria-current').catch(() => null);
    const okTid = tid ? !!(await page.waitForSelector(sel(tid), { timeout: 6000 }).catch(() => null)) : true;
    const txt = (await page.textContent('#main').catch(() => '')) ?? '';
    check(cur === 'page' && okTid && txt.trim().length > 0 && errs.length === 0, `doğrudan bağlantı ${u} → ${nav}${tid ? ' / ' + tid : ''}${errs.length ? ' → ' + errs[0] : ''}`);
    await page.close();
  }
  await ctx.close();
}

// ---------------------------------------------------------------- 5) pil tasarrufu / düşük güç
for (const mode of ['saver', 'lowpower']) {
  const ctx = mode === 'saver' ? await newCtx({ w: 390, h: 844, saver: true }) : await newCtx({ w: 390, h: 844, extra: { lowPower: true } });
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  check(await page.evaluate(() => document.body.classList.contains('saver')), `[${mode}] body.saver sınıfı`);
  if (mode === 'lowpower') {
    check(await page.evaluate(() => document.documentElement.classList.contains('lowpower') && document.documentElement.classList.contains('reduce-motion')), '[lowpower] html.lowpower + reduce-motion');
    check(await page.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgb(0, 0, 0)'), '[lowpower] OLED siyahı zemin');
  }
  for (const t of ['fener', 'rehber', 'harita', 'iletisim', 'kutuphane', 'araclar']) {
    await page.click(`[data-testid="nav-${t}"]`);
    await page.waitForTimeout(t === 'harita' ? 800 : 300);
    const st = await page.evaluate(() => {
      const anim = [...document.querySelectorAll('#app *')].filter((e) => { const s = getComputedStyle(e); return s.animationName !== 'none' && parseFloat(s.animationDuration) > 0.01 && s.animationPlayState === 'running'; }).map((e) => e.className);
      return { anim, text: document.getElementById('main').innerText.trim().length };
    });
    check(st.text > 0 && st.anim.length === 0, `[${mode}] ${t}: içerik var, çalışan animasyon yok${st.anim.length ? ' → ' + st.anim.slice(0, 3).join(',') : ''}`);
  }
  await page.click('[data-testid="nav-fener"]');
  const fenerTxt = await page.textContent('#main');
  check(/rehber/i.test(fenerTxt), `[${mode}] Fener rehber modunda`);
  await page.click('[data-testid="nav-araclar"]');
  await page.click('[data-testid="tool-card-pil"]');
  await page.waitForSelector('[data-testid="pil-saver-switch"]');
  check((await page.getAttribute('[data-testid="pil-saver-switch"]', 'aria-checked')) === 'true', `[${mode}] Pil aracında anahtar açık görünüyor`);
  check(errs.length === 0, `[${mode}] konsol hatası yok` + (errs.length ? ' → ' + errs.join(' | ') : ''));
  await ctx.close();
}
// Pil tasarrufu yeniden yüklemede kalıcı
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(base + '?tool=pil', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="pil-saver-switch"]');
  const before = await page.getAttribute('[data-testid="pil-saver-switch"]', 'aria-checked');
  await page.click('[data-testid="pil-saver-switch"]');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="pil-saver-switch"]');
  const after = await page.getAttribute('[data-testid="pil-saver-switch"]', 'aria-checked');
  check(before === 'false' && after === 'true' && (await page.evaluate(() => document.body.classList.contains('saver'))), 'pil tasarrufu yeniden yüklemede kalıcı');
  await ctx.close();
}

// ---------------------------------------------------------------- 6) masaüstü 1280
{
  const ctx = await newCtx({ w: 1280, h: 800 });
  const page = await ctx.newPage();
  const errs = watch(page);
  for (const t of ['fener', 'rehber', 'harita', 'iletisim', 'kutuphane', 'araclar']) {
    await page.goto(base + '?tab=' + t, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const a = await audit(page);
    check(a.violations.length === 0 && a.overflow.length === 0, `[1280 ${t}] axe ve taşma temiz${a.violations.length || a.overflow.length ? ' → ' + [...a.violations, ...a.overflow].join(' ; ') : ''}`);
  }
  await page.screenshot({ path: `${SHOTS}/qa-a11y-desktop.png` });
  check(errs.length === 0, '[1280] konsol hatası yok' + (errs.length ? ' → ' + errs.join(' | ') : ''));
  await ctx.close();
}

// ---------------------------------------------------------------- 7) yük sonrası çevrimdışı
{
  const ctx = await newCtx({ w: 390, h: 844 });
  const external = [];
  ctx.on('request', (r) => { const u = r.url(); if (!u.startsWith(ORIGIN) && !/^(data|blob):/.test(u)) external.push(u); });
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  // Gerçekçi senaryo: sayfa bir kez açılır, hiçbir araca dokunulmadan bağlantı kopar.
  // main.tsx boşta tembel parçaları önceden yükler; bunun bitmesi beklenir.
  await page.waitForTimeout(4000);
  await page.waitForLoadState('networkidle');
  await ctx.setOffline(true);
  await page.waitForTimeout(200);
  check((await page.textContent('[data-testid="net-status"]')).includes('Çevrimdışı'), '[çevrimdışı] rozet Çevrimdışı');
  const steps = [
    ['nav-fener', 'fener-model-btn'],
    ['nav-rehber', 'guide-category'],
    ['guide-category', 'category-detail'],
    ['guide-card', 'guide-detail'],
    ['nav-harita', 'map|map-get-packs'],
    ['nav-iletisim', 'comm-home'],
    ...COMM.flatMap((c) => [['nav-iletisim', 'comm-home'], ['comm-card-' + c, null]]),
    ['nav-kutuphane', null],
    ['nav-araclar', 'tool-card-canta'],
    ...TOOLS.flatMap((t) => [['nav-araclar', 'tool-card-' + t], ['tool-card-' + t, 'tool-' + t]]),
  ];
  for (const [click, expect] of steps) {
    // Bir sekme içinde alt ekrandaysak, gezinme düğmesi ana ekrana dönmez; geri düğmesi yoksa önce go.* ile sıfırlanır
    if (click === 'nav-iletisim' || click === 'nav-araclar') {
      await page.click(`[data-testid="${click}"]`);
      const back = click === 'nav-iletisim' ? '[data-testid="comm-back"], .cm-back' : '[data-testid="tool-back"]';
      const b = await page.$(back);
      if (b) await b.click();
    } else {
      await page.click(`[data-testid="${click}"]`, { timeout: 5000 }).catch((e) => fails.push('[çevrimdışı] tıklanamadı ' + click));
    }
    if (expect) {
      const ok = await page.waitForSelector(sel(expect), { timeout: 6000 }).catch(() => null);
      await page.waitForTimeout(150);
      const failed = /Yüklenemedi|Failed to fetch dynamically imported/.test((await page.textContent('#main')) ?? '');
      check(!!ok && !failed, `[çevrimdışı] ${click} → ${expect}${failed ? ' (parça yüklenemedi)' : ''}`);
    } else {
      await page.waitForTimeout(300);
      check(((await page.textContent('#main')) ?? '').trim().length > 0, `[çevrimdışı] ${click} içerik gösteriyor`);
    }
  }
  const bad = external.filter((u) => !ALLOWED_EXTERNAL.some((a) => u.startsWith(a)));
  check(bad.length === 0, 'dış istek yok (katalog hariç)' + (bad.length ? ' → ' + [...new Set(bad)].slice(0, 5).join(', ') : ''));
  check(errs.length === 0, '[çevrimdışı] konsol hatası yok' + (errs.length ? ' → ' + errs.slice(0, 3).join(' | ') : ''));
  await page.screenshot({ path: `${SHOTS}/qa-a11y-offline.png` });
  await ctx.close();
}

// ---------------------------------------------------------------- 8) kabuk düzeni: yan boşluklar, güvenli alan, yatay, büyük yazı
// Yan boşluk ölçümü: #main içindeki geniş kutuların (kart, düğme, başlık) sol ve sağ boşluğu;
// en sık görülen çift eşit olmalı. Üst çubukta logo ile rozetin kenar boşlukları eşit olmalı.
async function yanBosluk(page) {
  return page.evaluate(() => {
    const main = document.getElementById('main');
    const mr = main.getBoundingClientRect();
    const iL = mr.left + main.clientLeft;
    const iR = iL + main.clientWidth;
    const say = {};
    for (const el of main.querySelectorAll('*')) {
      const b = el.getBoundingClientRect();
      if (b.width < (iR - iL) * 0.5 || b.height < 8 || b.bottom < 0 || b.top > innerHeight) continue;
      const st = getComputedStyle(el);
      const kutu = (st.backgroundColor !== 'rgba(0, 0, 0, 0)') || parseFloat(st.borderLeftWidth) > 0 || ['BUTTON', 'INPUT', 'H1', 'H2', 'P'].includes(el.tagName);
      if (!kutu) continue;
      const L = Math.round(b.left - mr.left), R = Math.round(mr.right - b.right);
      // Tam genişlik (harita) ve yatay kayan şeritlerin taşan öğeleri sayılmaz
      if (L < 0 || R < 0 || (L === 0 && R === 0)) continue;
      const k = L + '/' + R;
      say[k] = (say[k] ?? 0) + 1;
    }
    // Sayfanın yan boşluğunu en geniş kutular belirler (en küçük L+R)
    const enCok = Object.keys(say).sort((a, b) => eval(a.replace('/', '+')) - eval(b.replace('/', '+')))[0] ?? '0/0';
    const h = document.querySelector('.app-header').getBoundingClientRect();
    const logo = document.querySelector('.brand-logo').getBoundingClientRect();
    const pill = document.querySelector('.pill').getBoundingClientRect();
    const nav = document.querySelector('.app-nav').getBoundingClientRect();
    return { enCok, hL: Math.round(logo.left - h.left), hR: Math.round(h.right - pill.right), nL: Math.round(nav.left), nR: Math.round(innerWidth - nav.right), nB: Math.round(innerHeight - nav.bottom), logoTop: Math.round(logo.top), navH: Math.round(nav.height), hdrH: Math.round(h.height), hdrBg: getComputedStyle(document.querySelector('.app-header')).backgroundColor };
  });
}
const esit = (pair, tol = 1) => { const [l, r] = pair.split('/').map(Number); return Math.abs(l - r) <= tol; };
{
  const VPS = [[360, 640], [390, 844], [412, 915], [1280, 800]];
  for (const [w, h] of VPS) {
    const ctx = await newCtx({ w, h });
    const page = await ctx.newPage();
    const bad = [];
    for (const t of ['fener', 'rehber', 'harita', 'iletisim', 'kutuphane', 'araclar']) {
      await page.goto(base + '?tab=' + t, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const m = await yanBosluk(page);
      if (!esit(m.enCok) || !esit(m.hL + '/' + m.hR) || !esit(m.nL + '/' + m.nR)) bad.push(`${t} içerik ${m.enCok} başlık ${m.hL}/${m.hR} menü ${m.nL}/${m.nR}`);
      if (t === 'fener') check(m.hdrBg === 'rgba(0, 0, 0, 0)', `[${w}] üst çubuk saydam (şafak parıltısında kesik çizgi yok)`);
    }
    check(bad.length === 0, `[${w}×${h}] altı sekmede sol ve sağ boşluk eşit` + (bad.length ? ' → ' + bad.join(' ; ') : ''));
    await ctx.close();
  }
  // Güvenli alan (Capacitor 8 SystemBars değişkenleri)
  {
    const ctx = await newCtx({ w: 390, h: 844 });
    await ctx.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = ':root{--safe-area-inset-top:32px;--safe-area-inset-bottom:24px}'; document.head.appendChild(s); }));
    const page = await ctx.newPage();
    await page.goto(base + '?tab=rehber', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const m = await yanBosluk(page);
    check(m.logoTop >= 32 && m.nB >= 24 + 6, `güvenli alan: başlık durum çubuğunun altında (logo ${m.logoTop}), menü sistem çubuğunun üstünde (alt boşluk ${m.nB})`);
    await page.screenshot({ path: `${SHOTS}/qa-a11y-guvenli-alan.png` });
    await ctx.close();
  }
  // Yatay telefon, solda çentik (32 px): içerik, başlık ve menü ortalı kalır; çubuklar incelir
  {
    const ctx = await newCtx({ w: 844, h: 390 });
    await ctx.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = ':root{--safe-area-inset-left:32px}'; document.head.appendChild(s); }));
    const page = await ctx.newPage();
    const bad = [];
    for (const u of ['?tab=rehber', '?guide=deprem-aninda', '?tab=araclar', '?tool=ayarlar']) {
      await page.goto(base + u, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const m = await yanBosluk(page);
      if (!esit(m.enCok) || !esit(m.hL + '/' + m.hR) || !esit(m.nL + '/' + m.nR)) bad.push(`${u} içerik ${m.enCok} başlık ${m.hL}/${m.hR} menü ${m.nL}/${m.nR}`);
      if (u === '?tab=rehber') check(m.navH <= 56 && m.hdrH <= 50, `yatay: üst çubuk (${m.hdrH}) ve menü (${m.navH}) inceliyor`);
    }
    check(bad.length === 0, 'yatay 844×390 + çentik: sol ve sağ boşluk eşit' + (bad.length ? ' → ' + bad.join(' ; ') : ''));
    await page.screenshot({ path: `${SHOTS}/qa-a11y-yatay.png` });
    await ctx.close();
  }
  // Android büyük yazı (WebView metin yakınlaştırması) taklidi: menü etiketleri ×1,5, başlık ×1,6
  for (const [w, k] of [[360, 1.5], [320, 1.3]]) {
    const ctx = await newCtx({ w, h: 640 });
    await ctx.addInitScript((k) => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = `html{--nav-scale:${k} !important}`; document.head.appendChild(s); }), k);
    const page = await ctx.newPage();
    await page.goto(base + '?tab=kutuphane', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const r = await page.evaluate(async () => {
      const nav = document.querySelector('.app-nav');
      const sp = [...nav.querySelectorAll('.nav-btn span')].map((s) => s.getBoundingClientRect());
      const nr = nav.getBoundingClientRect();
      let gap = 99;
      for (let i = 1; i < sp.length; i++) gap = Math.min(gap, sp[i].left - sp[i - 1].right);
      // Üst çubuk: yazılar ×1,6 (metin yakınlaştırması gibi), sonra yeniden sığdırma
      const els = [...document.querySelectorAll('.app-header *')];
      const fs = els.map((e) => parseFloat(getComputedStyle(e).fontSize));
      els.forEach((e, i) => e.style.setProperty('font-size', fs[i] * 1.6 + 'px'));
      window.dispatchEvent(new Event('resize'));
      await new Promise((r) => setTimeout(r, 200));
      const ad = document.querySelector('.brand-name').getBoundingClientRect();
      const pill = document.querySelector('.pill').getBoundingClientRect();
      return { gap, inside: sp[0].left >= nr.left && sp[5].right <= nr.right, fit: nav.style.getPropertyValue('--nav-fit'), adR: ad.right, pillL: pill.left, pillR: pill.right };
    });
    check(r.gap >= 5 && r.inside, `[${w} px, etiket ×${k}] menü etiketleri çakışmıyor (en dar aralık ${r.gap.toFixed(1)} px, --nav-fit ${r.fit || 1})`);
    check(r.adR <= r.pillL + 0.5 && r.pillR <= w, `[${w} px, büyük yazı] uygulama adı rozetle çakışmıyor`);
    await page.screenshot({ path: `${SHOTS}/qa-a11y-buyuk-yazi-${w}.png` });
    await ctx.close();
  }
  // Masaüstü tarayıcı (kaydırma çubuğu yer kaplar): iki yan eşit, başlık kartlarla hizalı
  {
    const b2 = await pw.chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
    const ctx = await b2.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
    const page = await ctx.newPage();
    await page.goto(base + '?tab=araclar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const main = document.getElementById('main'); const mr = main.getBoundingClientRect();
      const g = document.querySelector('.tl-group, .card, .list-btn').getBoundingClientRect();
      const logo = document.querySelector('.brand-logo').getBoundingClientRect();
      return { sb: main.offsetWidth - main.clientWidth, L: Math.round(g.left - mr.left), R: Math.round(mr.right - g.right), logoL: Math.round(logo.left), gL: Math.round(g.left) };
    });
    check(Math.abs(r.L - r.R) <= 1 && Math.abs(r.logoL - r.gL) <= 1, `[1280, görünür kaydırma çubuğu ${r.sb} px] içerik ${r.L}/${r.R}, başlık kartlarla hizalı (${r.logoL}/${r.gL})`);
    await b2.close();
  }
}

// ---------------------------------------------------------------- 9) kabuk dayanıklılığı
const tidSel = (t) => `[data-testid="${t}"]`;
const ayakta = (page) => page.evaluate(() => !!document.querySelector('.app-nav') && (document.getElementById('main')?.innerText.trim().length ?? 0) > 0);
// a) Hata sınırı: bir sekme çökünce yalnız o sekmede sakin kart, gezinme çalışır, "Yeniden dene" kurtarır
{
  const ctx = await newCtx({ w: 360, h: 640 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(base + '?tab=harita&qa-cokme=harita', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  check(!!(await page.$(tidSel('hata-siniri'))) && !!(await page.$('.app-nav')), 'hata sınırı: çöken sekmede "Bu bölüm şu an açılamadı" kartı, menü yerinde');
  await page.screenshot({ path: `${SHOTS}/qa-a11y-hata-siniri.png` });
  await page.click(tidSel('nav-rehber'));
  check(!!(await page.waitForSelector(tidSel('guide-category'), { timeout: 5000 }).catch(() => null)), 'hata sınırı: diğer sekmeler çalışıyor');
  await page.click(tidSel('nav-harita'));
  await page.click(tidSel('hata-yeniden'));
  await page.waitForTimeout(400);
  check(!(await page.$(tidSel('hata-siniri'))) && (await ayakta(page)), 'hata sınırı: "Yeniden dene" bölümü yeniden açıyor');
  check(errs.length === 0, 'hata sınırı: yakalanan hata sayfayı düşürmüyor' + (errs.length ? ' → ' + errs.join(' | ') : ''));
  await ctx.close();
}
// b) Kötü niyetli / bozuk doğrudan bağlantılar
{
  const ctx = await newCtx({ w: 390, h: 844 });
  const bad = [];
  for (const u of ['?comm=__proto__', '?comm=toString', '?tool=constructor', '?tool=__proto__', '?cat=__proto__', '?guide=constructor', '?tab=__proto__', '?guide=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E', '?tool=' + 'a'.repeat(3000)]) {
    const page = await ctx.newPage();
    const errs = watch(page);
    let dialog = false;
    page.on('dialog', (d) => { dialog = true; d.dismiss(); });
    await page.goto(base + u, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    if (!(await ayakta(page)) || errs.length || dialog) bad.push(u.slice(0, 40) + (errs[0] ? ' ' + errs[0] : ''));
    await page.close();
  }
  check(bad.length === 0, 'bozuk doğrudan bağlantılar boş ekran ya da hata vermiyor' + (bad.length ? ' → ' + bad.join(' ; ') : ''));
  await ctx.close();
}
// c) Bozuk localStorage: bütün ac.* anahtarlarına çöp yazılınca uygulama yine açılır
{
  // Önce gerçek anahtarları topla: her ekranı bir kez gez
  const ctx0 = await newCtx({ w: 390, h: 844 });
  const p0 = await ctx0.newPage();
  const ekranlar = ['?tab=fener', '?tab=rehber', '?tab=harita', '?tab=iletisim', '?tab=kutuphane', '?tab=araclar', ...TOOLS.map((t) => '?tool=' + t), '?tool=enkaz', '?tool=enkaz-arama', '?tool=hava', ...COMM.map((c) => '?comm=' + c)];
  for (const u of ekranlar) { await p0.goto(base + u, { waitUntil: 'networkidle' }); await p0.waitForTimeout(150); }
  const keys = await p0.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('ac.')));
  await ctx0.close();
  const sabit = ['ac.settings', 'ac.downloads', 'ac.batterySaver', 'ac.yakinlar', 'ac.sonkonum', 'ac.map.waypoints.v1', 'ac.map.track.v1', 'ac.map.nav.v1', 'ac.lib.textSize', 'ac.lib.source', 'ac.lib.setler', 'ac.lib.secimTuru', 'ac.lib.history', 'ac.kurulum', 'ac.kaynak.stok.v1', 'ac.kaynak.pil.v1', 'ac.kaynak.hesap.v1', 'ac.kaynak.canta.v1', 'ac.hava.il', 'ac.guncelleme.ertele', 'ac.fenerModel', 'ac.enkaz.hedef', 'ac.comm.profile', 'ac.comm.outbox', 'ac.comm.cache', 'ac.binalar'];
  const hepsi = [...new Set([...sabit, ...keys])];
  for (const cop of ['{bozuk', 'null', '[1,"a",null,{}]', '{"items":5,"list":"x","v":99}']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(([ks, c]) => { if (sessionStorage.getItem('cop')) return; sessionStorage.setItem('cop', '1'); for (const k of ks) localStorage.setItem(k, c); }, [hepsi, cop]);
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    const bos = [];
    for (const u of ekranlar) {
      await page.goto(base + u, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(150);
      if (!(await ayakta(page)) || (await page.$(tidSel('hata-siniri')))) bos.push(u);
    }
    check(bos.length === 0 && errs.length === 0, `bozuk localStorage (${hepsi.length} anahtar = ${JSON.stringify(cop)}): bütün ekranlar açılıyor` + (bos.length ? ' → boş/çöken: ' + bos.join(',') : '') + (errs.length ? ' → ' + [...new Set(errs)].slice(0, 2).join(' | ') : ''));
    await ctx.close();
  }
}
// d) Site verileri engelli (localStorage erişimi bile hata fırlatır): uygulama açılır, uyarı görünür
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 } });
  await ctx.addInitScript(() => {
    const at = () => { throw new DOMException('The operation is insecure.', 'SecurityError'); };
    Object.defineProperty(window, 'localStorage', { get: at, configurable: true });
    Object.defineProperty(window, 'sessionStorage', { get: at, configurable: true });
  });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(base + '?tab=rehber', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const uyari = await page.getAttribute(tidSel('storage-warning'), 'data-problem').catch(() => null);
  let gez = true;
  for (const t of ['fener', 'harita', 'iletisim', 'kutuphane', 'araclar']) {
    await page.click(tidSel('nav-' + t), { timeout: 3000 }).catch(() => (gez = false));
    await page.waitForTimeout(200);
    if (!(await ayakta(page))) gez = false;
  }
  await page.screenshot({ path: `${SHOTS}/qa-a11y-depo-engelli.png` });
  check(uyari === 'blocked' && gez && errs.length === 0, `site verileri engelli: uygulama açılıyor, "veri saklamaya izin vermiyor" uyarısı (${uyari})` + (errs.length ? ' → ' + errs[0] : ''));
  await ctx.close();
}
// e) Geri tuşu (tarayıcı geri / Android WebView.goBack → popstate): uygulama içinde geri gider
{
  const ctx = await newCtx({ w: 390, h: 844 });
  const page = await ctx.newPage();
  const errs = watch(page);
  const ekran = () => page.evaluate(() => ({ tab: document.querySelector('[aria-current=page]')?.dataset.testid, h1: document.querySelector('#main h1')?.textContent.trim() }));
  await page.goto(base + '?tab=fener', { waitUntil: 'networkidle' });
  await page.click(tidSel('nav-rehber'));
  await page.click(tidSel('guide-category'));
  await page.waitForSelector(tidSel('category-detail'));
  await page.click(tidSel('guide-card'));
  await page.waitForSelector(tidSel('guide-detail'));
  await page.goBack();
  check(!!(await page.waitForSelector(tidSel('category-detail'), { timeout: 3000 }).catch(() => null)), 'geri: rehberden kategoriye');
  await page.goBack();
  await page.waitForTimeout(200);
  check((await ekran()).h1 === 'Rehber' && (await ekran()).tab === 'nav-rehber', 'geri: kategoriden Rehber ana ekranına');
  await page.goBack();
  await page.waitForTimeout(200);
  check((await ekran()).tab === 'nav-fener', 'geri: önceki sekmeye (Fener)');
  await page.goForward();
  await page.waitForTimeout(200);
  check((await ekran()).tab === 'nav-rehber', 'ileri: yeniden Rehber');
  // Uygulama içi "← Araçlar" geçmişe yeni kayıt eklemez; ardından geri araca değil önceki ekrana gider
  await page.click(tidSel('nav-araclar'));
  await page.click(tidSel('tool-card-pusula'));
  await page.waitForSelector(tidSel('tool-pusula'));
  const uz = await page.evaluate(() => history.length);
  await page.click(tidSel('tool-back'));
  await page.waitForTimeout(300);
  check((await page.evaluate(() => history.length)) === uz && !(await page.$(tidSel('tool-pusula'))), 'uygulama içi geri düğmesi geçmişte geri gider (yeni kayıt yok)');
  await page.goBack();
  await page.waitForTimeout(200);
  check((await ekran()).tab === 'nav-rehber' && !(await page.$(tidSel('tool-pusula'))), 'ardından geri: araca dönmüyor, önceki sekmeye gidiyor');
  check(errs.length === 0, 'geri tuşu akışında konsol hatası yok' + (errs.length ? ' → ' + errs.join(' | ') : ''));
  await ctx.close();
}
// e2) Katmanlar (büyük gösterim, harita sayfası, PDF okuyucu, model paneli): geri tuşu önce katmanı kapatır
{
  const ctx = await newCtx({ w: 390, h: 844 });
  const page = await ctx.newPage();
  const errs = watch(page);
  const durum = () => page.evaluate(() => ({ big: !!document.querySelector('[data-testid="sz-bigview"]'), tab: document.querySelector('[aria-current=page]')?.dataset.testid, sozluk: !!document.querySelector('[data-testid^="sz-big-"]') }));
  // İlk ekranda (geride kayıt yok): koruma kaydı sayesinde geri uygulamadan çıkmaz
  await page.goto(base + '?tool=sozluk', { waitUntil: 'networkidle' });
  await page.click('[data-testid^="sz-big-"]');
  await page.waitForSelector(tidSel('sz-bigview'));
  await page.evaluate(() => history.back());
  await page.waitForTimeout(400);
  let d = await durum();
  check(!d.big && d.sozluk && d.tab === 'nav-araclar', 'geri: ilk ekranda büyük gösterim kapanır, sözlükte kalınır ' + JSON.stringify(d));
  // Düğmeyle kapatınca koruma kaydı kalmaz
  const L = await page.evaluate(() => history.length);
  await page.click('[data-testid^="sz-big-"]');
  await page.waitForSelector(tidSel('sz-bigview'));
  await page.click(tidSel('sz-big-close'));
  await page.waitForTimeout(400);
  check((await page.evaluate(() => history.length)) <= L + 1 && !(await durum()).big, 'büyük gösterim düğmeyle kapanır');
  // Başka ekranda katman: geri ekranı değiştirmez, sonraki geri önceki ekrana döner
  // (yeni sayfa: Rehber → Araçlar listesi → Sözlük; önceki ekranlar farklı)
  const page2 = await ctx.newPage();
  page2.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  const durum2 = () => page2.evaluate(() => ({ big: !!document.querySelector('[data-testid="sz-bigview"]'), tab: document.querySelector('[aria-current=page]')?.dataset.testid, sozluk: !!document.querySelector('[data-testid^="sz-big-"]'), liste: !!document.querySelector('[data-testid="tool-card-sozluk"]') }));
  await page2.goto(base + '?tab=rehber', { waitUntil: 'networkidle' });
  await page2.click(tidSel('nav-araclar'));
  await page2.click(tidSel('tool-card-sozluk'));
  await page2.click('[data-testid^="sz-big-"]');
  await page2.waitForSelector(tidSel('sz-bigview'));
  await page2.evaluate(() => history.back());
  await page2.waitForTimeout(400);
  d = await durum2();
  check(!d.big && d.sozluk, 'geri: büyük gösterim kapanır, ekran değişmez ' + JSON.stringify(d));
  await page2.evaluate(() => history.back());
  await page2.waitForTimeout(400);
  d = await durum2();
  check(!d.sozluk && d.liste && d.tab === 'nav-araclar', 'sonraki geri: araç listesine ' + JSON.stringify(d));
  check(errs.length === 0, 'katman geri akışında konsol hatası yok' + (errs.length ? ' → ' + errs.join(' | ') : ''));
  await ctx.close();
}
// f) Kurulum ("Hazırlanalım") penceresi: odak içeride, arka plan erişilmez, geri tuşu kapatır
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 } });
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base + '?kurulum=1', { waitUntil: 'networkidle' });
  await page.waitForSelector(tidSel('kurulum'));
  await page.waitForTimeout(300);
  check(await page.evaluate(() => document.activeElement?.id === 'ku-title'), 'kurulum: açılınca odak pencere başlığında');
  check(await page.evaluate(() => document.getElementById('main').inert === true && document.querySelector('.app-nav').inert === true), 'kurulum: arkadaki uygulama inert');
  let disari = 0;
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => { const a = document.activeElement; return !!a && a !== document.body && !a.closest('[data-testid="kurulum"]'); })) disari++;
  }
  check(disari === 0, 'kurulum: Tab tuşu pencerenin dışına çıkmıyor');
  await page.goBack();
  await page.waitForTimeout(300);
  check(!(await page.$(tidSel('kurulum'))) && (await page.evaluate(() => localStorage.getItem('ac.kurulum'))) === '1' && (await page.evaluate(() => document.getElementById('main').inert === false)), 'kurulum: geri tuşu pencereyi kapatıyor, bir daha kendiliğinden açılmıyor');
  check(errs.length === 0, 'kurulum akışında konsol hatası yok' + (errs.length ? ' → ' + errs.join(' | ') : ''));
  await ctx.close();
}
// g) Açılış ekranı ve dış istekler (çevrimiçi gezinti)
{
  const html = await (await fetch(base)).text();
  check(/id="acilis"/.test(html) && /name="color-scheme" content="dark"/.test(html) && /viewport-fit=cover/.test(html), 'index.html: açılış ekranı, koyu renk düzeni, viewport-fit=cover');
  const ctx = await newCtx({ w: 390, h: 844 });
  const external = [];
  ctx.on('request', (r) => { const u = r.url(); if (!u.startsWith(ORIGIN) && !/^(data|blob):/.test(u)) external.push(u); });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  check(!(await page.$('#acilis')), 'açılış ekranı uygulama çizilince kalkıyor');
  for (const t of ['fener', 'rehber', 'harita', 'iletisim', 'kutuphane', 'araclar']) { await page.click(tidSel('nav-' + t)); await page.waitForTimeout(600); }
  const bad = external.filter((u) => !ALLOWED_EXTERNAL.some((a) => u.startsWith(a)));
  check(bad.length === 0, 'çevrimiçi gezintide katalog dışında dış istek yok' + (bad.length ? ' → ' + [...new Set(bad)].join(', ') : ''));
  if (external.length) console.log('     (bilgi: kendiliğinden dış istek — src/lib/packs-ui.tsx usePackRows → refreshRemoteManifest: ' + [...new Set(external)].join(', ') + ')');
  await ctx.close();
}

await browser.close();
server?.kill();
console.log(fails.length ? `\n${fails.length} HATA` : '\nHepsi geçti');
process.exit(fails.length ? 1 : 0);
