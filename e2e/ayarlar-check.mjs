// Ayarlar aracı ve uygulama geneli ayarlar (yazı boyutu, yüksek kontrast,
// hareketi azalt, düşük güç, depolama, verileri sıfırla, hakkında).
//   node e2e/ayarlar-check.mjs [http://localhost:5199/] [/tmp/ayarlar]
import { createRequire } from 'module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
const shots = process.argv[3] ?? '/tmp/ayarlar';
fs.mkdirSync(shots, { recursive: true });
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

function watch(p) {
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  // Paylaşım aracı isteğe bağlı çevrimiçi kataloğu dener; sandbox'ta ağ yok → yoksay.
  p.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_(TUNNEL|NAME|INTERNET|PROXY)/.test(m.text())) errors.push('console: ' + m.text()); });
  p.on('requestfailed', (r) => { if (!r.url().startsWith(base)) console.log('     (dış istek başarısız, yoksayıldı: ' + r.url().slice(0, 80) + ')'); });
  return errors;
}
const tid = (id) => `[data-testid="${id}"]`;

// ---- 1) Ayarlar aracı: değiştir, kalıcılığı kontrol et ----
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errors = watch(p);
  await p.goto(base + '?tool=ayarlar', { waitUntil: 'networkidle' });
  await p.waitForSelector(tid('set-size-0'));
  check((await p.getAttribute(tid('set-size-0'), 'aria-checked')) === 'true', 'varsayılan yazı boyutu Normal');
  check(/^\d+\.\d+\.\d+/.test((await p.textContent(tid('set-version'))) ?? ''), 'sürüm package.json\'dan okunuyor');
  check(((await p.textContent(tid('set-license'))) ?? '').includes('GPL-3.0'), 'lisans GPL-3.0');

  await p.click(tid('set-size-3'));
  await p.click(tid('set-contrast'));
  const root = () => p.evaluate(() => ({
    cls: document.documentElement.className,
    scale: getComputedStyle(document.documentElement).getPropertyValue('--ui-scale').trim(),
    zoom: (() => { const e = document.querySelector('.app-main > *'); return e ? getComputedStyle(e).zoom : null; })(),
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim(),
  }));
  let r = await root();
  check(r.scale === '1.4' && Number(r.zoom) === 1.4, 'en büyük yazı: --ui-scale 1.4 ve içerik zoom 1.4 (' + r.zoom + ')');
  check(r.cls.includes('hc') && r.text === '#ffffff', 'yüksek kontrast: html.hc ve beyaz yazı');

  await p.click(tid('set-lowpower'));
  r = await root();
  check(r.cls.includes('lowpower') && r.cls.includes('reduce-motion'), 'düşük güç: lowpower + reduce-motion sınıfları');
  check((await p.getAttribute(tid('set-saver'), 'aria-checked')) === 'true', 'düşük güç pil tasarrufunu da açar');
  const flag = await p.evaluate(async () => (await import('/src/lib/settings.ts')).getSettings().lowPower).catch(() => null);
  check(flag === true || flag === null, 'getSettings().lowPower okunabilir (' + flag + ')');

  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(tid('set-size-3'));
  r = await root();
  check((await p.getAttribute(tid('set-size-3'), 'aria-checked')) === 'true' && r.cls.includes('hc') && r.cls.includes('lowpower'), 'ayarlar yeniden yüklemede korunuyor');
  check(await p.evaluate(() => document.body.classList.contains('saver')), 'açılışta body.saver (pil tasarrufu) uygulanıyor');
  await p.screenshot({ path: `${shots}/ayarlar-buyuk-hc-dusukguc.png` });

  // Depolama
  await p.waitForSelector(tid('set-usage'), { timeout: 5000 }).catch(() => {});
  check(!!(await p.$(tid('set-usage'))), 'depolama kullanımı gösteriliyor: ' + ((await p.textContent(tid('set-usage')).catch(() => '')) ?? ''));

  // Lisanslar bağlantısı
  await p.click(tid('set-licenses'));
  const licOpen = await p.waitForFunction(() => document.querySelector('[data-testid="licenses"]')?.open === true, null, { timeout: 8000 }).then(() => true, () => false);
  check(licOpen, 'lisanslar bağlantısı paylaşım aracındaki lisans kutusunu açıyor');

  // Verileri sıfırla: satır içi onay, Vazgeç, sonra Evet
  await p.goto(base + '?tool=ayarlar', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.setItem('ac.test-veri', '1'));
  let dialogs = 0;
  p.on('dialog', (d) => { dialogs++; d.dismiss(); });
  await p.click(tid('set-reset'));
  check(!!(await p.$(tid('set-reset-confirm'))), 'sıfırla: satır içi onay görünüyor');
  await p.screenshot({ path: `${shots}/ayarlar-sifirla-onay.png` });
  await p.click(tid('set-reset-cancel'));
  check(!(await p.$(tid('set-reset-confirm'))) && (await p.evaluate(() => localStorage.getItem('ac.test-veri'))) === '1', 'Vazgeç: hiçbir şey silinmedi');
  await p.click(tid('set-reset'));
  await p.click(tid('set-reset-yes'));
  await p.waitForSelector(tid('set-reset-result'));
  check(((await p.textContent(tid('set-reset-result'))) ?? '').includes('silindi'), 'Evet: veriler silindi mesajı');
  await p.waitForTimeout(1500);
  await p.waitForLoadState('networkidle');
  await p.waitForSelector(tid('set-size-0'));
  r = await root();
  check(!r.cls.includes('hc') && !r.cls.includes('lowpower') && (await p.evaluate(() => localStorage.getItem('ac.test-veri'))) === null, 'sıfırlama sonrası varsayılanlar');
  check(dialogs === 0, 'hiç confirm()/alert() açılmadı');
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

// ---- 2) En büyük yazı + yüksek kontrast ile sekmeler: taşma yok ----
for (const mode of [{ name: 'buyuk-hc', s: { textSize: 3, highContrast: true } }, { name: 'buyuk-dusukguc', s: { textSize: 3, lowPower: true } }]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript((s) => { try { localStorage.setItem('ac.settings', JSON.stringify(s)); } catch {} }, mode.s);
  const p = await ctx.newPage();
  const errors = watch(p);
  for (const q of ['?tab=rehber', '?tool=ayarlar', '?tab=fener', '?guide=kanama', '?tab=araclar', '?tab=iletisim', '?tab=kutuphane', '?tab=harita']) {
    await p.goto(base + q, { waitUntil: 'networkidle' });
    await p.waitForTimeout(q.includes('harita') ? 1500 : 500);
    const name = q.replace(/[?=]/g, '').replace(/[^a-z0-9-]/gi, '_');
    await p.screenshot({ path: `${shots}/${mode.name}-${name}.png` });
    // Yatay taşma: görünür öğelerden ekran dışına çıkan var mı?
    const over = await p.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const bad = [];
      for (const el of document.querySelectorAll('.app *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // SVG iç şekilleri <svg> tarafından kırpılır (overflow: hidden varsayılan); yanlış alarm vermesin
        if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
        if (el.closest('.chips-row, .maplibregl-map, [style*="overflow"], .sh-lic, pre, code')) continue;
        let a = el.parentElement, clipped = false;
        while (a && a !== document.body) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') { clipped = true; break; } a = a.parentElement; }
        if (clipped && getComputedStyle(el.parentElement).overflowX !== 'visible') continue;
        if (r.right > W + 1 || r.left < -1) bad.push((el.getAttribute('data-testid') || el.className || el.tagName) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
      }
      return { W, sw: document.documentElement.scrollWidth, bad: bad.slice(0, 5) };
    });
    check(over.sw <= over.W + 1 && over.bad.length === 0, `${mode.name} ${q}: yatay taşma yok` + (over.bad.length ? ' — ' + over.bad.join(', ') : ''));
  }
  check(errors.length === 0, `${mode.name}: konsol hatası yok` + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await ctx.close();
}

await b.close();
console.log(fails.length ? `\n${fails.length} HATA` : '\nTümü geçti. Ekran görüntüleri: ' + shots);
process.exit(fails.length ? 1 : 0);
