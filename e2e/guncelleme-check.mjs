// Uygulama güncellemesi (arayüz): sahte AkilGuncelleme köprüsüyle
//   • zamanı gelince kendiliğinden denetim; KURULUM KENDİLİĞİNDEN ASLA olmaz
//   • "Kur" yalnız düğmeyle; izin yoksa izin sayfası; enkaz modu açıkken kurulmaz
//   • "Sonra" bandı 24 saat gizler; Ayarlar'da denetim kapatılınca denetim yapılmaz
//   node e2e/guncelleme-check.mjs [taban-url] [ekran-klasörü]
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:5199/';
const SHOTS = process.argv[3] ?? '/tmp/guncelleme';
mkdirSync(SHOTS, { recursive: true });
const tid = (t) => `[data-testid="${t}"]`;
const browser = await pw.chromium.launch();
let fails = 0;
const errors = [];
async function step(name, fn) {
  try { await fn(); console.log('OK  ', name); } catch (e) { fails++; console.log('HATA', name, '\n     ', e.message.split('\n').slice(0, 4).join('\n      ')); }
}

function kopru() {
  try { localStorage.setItem('ac.kurulum', 'atla'); } catch {}
  const o = window.__opt || {};
  const subs = [];
  window.__calls = [];
  const st = { kurulu: '0.2.4', sonDenetim: o.sonDenetim ?? 0, is: '', alinan: 0, toplam: 0, kurulumIzni: o.izin ?? true, olculuAg: false, enkazAcik: !!o.enkaz };
  const emit = () => subs.forEach((f) => f(JSON.parse(JSON.stringify(st))));
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    Plugins: {
      AkilGuncelleme: {
        async durum() { return JSON.parse(JSON.stringify(st)); },
        async denetle(a) {
          window.__calls.push(['denetle', a]);
          st.sonDenetim = Date.now();
          st.yeni = { surum: '0.2.5', boyut: 28400000, notlar: '', sayfa: '', hazir: false };
          if (a.kendiliginden) {
            st.is = 'indiriliyor'; st.toplam = 28400000; st.alinan = 9000000;
            setTimeout(emit, 50);
            setTimeout(() => { st.is = ''; st.yeni.hazir = true; emit(); }, 600);
          } else setTimeout(emit, 50);
          return JSON.parse(JSON.stringify(st));
        },
        async indir() { window.__calls.push(['indir']); st.yeni.hazir = true; setTimeout(emit, 50); return st; },
        async kur() { window.__calls.push(['kur']); if (st.enkazAcik) return { hata: 'enkaz-acik' }; if (!st.kurulumIzni) return { hata: 'izin-gerekli' }; st.is = 'kuruluyor'; setTimeout(emit, 20); return {}; },
        async kurSistem() { window.__calls.push(['kurSistem']); return {}; },
        async kurulumIzni() { window.__calls.push(['kurulumIzni']); st.kurulumIzni = true; return { acildi: true }; },
        async addListener(ev, fn) { subs.push(fn); return { remove() {} }; },
      },
    },
  };
}
const yeni = async (opt) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript((o) => { window.__opt = o; }, opt);
  await ctx.addInitScript(kopru);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  return { ctx, p, calls: (m) => p.evaluate((m) => window.__calls.filter((c) => c[0] === m), m) };
};

{
  const { ctx, p, calls } = await yeni({});
  await step('Açılışta denetler, Wi-Fi\'da indirir, kendiliğinden KURMAZ', async () => {
    await p.goto(base + '?tab=rehber');
    await p.waitForSelector(tid('gn-bant'));
    assert.deepEqual((await calls('denetle'))[0][1], { kendiliginden: true });
    await p.waitForSelector(tid('gn-kur'));
    await p.waitForTimeout(1500);
    assert.equal((await calls('kur')).length, 0, 'kur kendiliğinden çağrılmamalı');
    assert.match(await p.textContent(tid('gn-bant')), /0\.2\.5 kurulmaya hazır/);
    await p.screenshot({ path: SHOTS + '/1-bant.png' });
  });
  await step('"Kur"a basınca kurulum başlar', async () => {
    await p.click(tid('gn-kur'));
    await p.waitForFunction(() => /Kuruluyor/.test(document.querySelector('[data-testid="gn-bant"]')?.textContent || ''));
    assert.equal((await calls('kur')).length, 1);
  });
  await step('Onay ekranı açılmazsa yedek "Sistem yükleyicisiyle kur" çıkar ve yalnız basınca çağrılır', async () => {
    await p.waitForSelector(tid('gn-kur-sistem'), { timeout: 12000 });
    assert.equal((await calls('kurSistem')).length, 0, 'yedek kendiliğinden çağrılmamalı');
    await p.click(tid('gn-kur-sistem'));
    await p.waitForFunction(() => window.__calls.some((c) => c[0] === 'kurSistem'));
    assert.match(await p.textContent(tid('gn-bant')), /Güncelle/);
  });
  await step('Ayarlar: bölüm görünür, bant orada gizlenir', async () => {
    await p.goto(base + '?tab=araclar&tool=ayarlar');
    await p.waitForSelector(tid('set-update'));
    assert.equal(await p.locator(tid('gn-bant')).count(), 0);
    assert.equal(await p.getAttribute(tid('set-update-check'), 'aria-checked'), 'true');
  });
  await ctx.close();
}
{
  const { ctx, p, calls } = await yeni({ izin: false });
  await step('Kurulum izni yoksa önce izin sayfası, kurmaz', async () => {
    await p.goto(base + '?tab=rehber');
    await p.waitForSelector(tid('gn-kur'));
    await p.click(tid('gn-kur'));
    await p.waitForFunction(() => /Bu kaynaktan izin ver/.test(document.querySelector('[data-testid="gn-bant"]')?.textContent || ''));
    assert.equal((await calls('kurulumIzni')).length, 1);
    assert.equal((await calls('kur')).length, 0);
  });
  await step('"Sonra" bandı gizler, yeniden açılışta da gizli', async () => {
    await p.click(tid('gn-sonra'));
    assert.equal(await p.locator(tid('gn-bant')).count(), 0);
    await p.reload();
    await p.waitForTimeout(1200);
    assert.equal(await p.locator(tid('gn-bant')).count(), 0);
  });
  await ctx.close();
}
{
  const { ctx, p } = await yeni({ enkaz: true });
  await step('Enkaz modu açıkken "Kur" devre dışı', async () => {
    await p.goto(base + '?tab=rehber');
    await p.waitForSelector(tid('gn-kur'));
    assert.equal(await p.isDisabled(tid('gn-kur')), true);
    assert.match(await p.textContent(tid('gn-bant')), /Enkaz modu açıkken kurulmaz/);
  });
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('ac.settings', JSON.stringify({ updateCheck: false })); } catch {} });
  await ctx.addInitScript((o) => { window.__opt = o; }, { sonDenetim: 0 });
  await ctx.addInitScript(kopru);
  const p = await ctx.newPage();
  await step('Denetim kapalıysa kendiliğinden denetlenmez', async () => {
    await p.goto(base + '?tab=rehber');
    await p.waitForTimeout(1500);
    assert.equal(await p.evaluate(() => window.__calls.filter((c) => c[0] === 'denetle').length), 0);
  });
  await step('Son denetim yakınsa yeniden denetlenmez', async () => {
    const c2 = await browser.newContext();
    await c2.addInitScript((o) => { window.__opt = o; }, { sonDenetim: Date.now() - 3600000 });
    await c2.addInitScript(kopru);
    const q = await c2.newPage();
    await q.goto(base + '?tab=rehber');
    await q.waitForTimeout(1500);
    assert.equal(await q.evaluate(() => window.__calls.filter((c) => c[0] === 'denetle').length), 0);
    await c2.close();
  });
  await ctx.close();
}
{
  // Denetim 2026-11: elle "İndir", görünürlük değişimi ve ayar değişimi de kurmaz; çift dokunuş tek kurulum
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 } });
  await ctx.addInitScript((o) => { window.__opt = o; }, { sonDenetim: Date.now() - 3600000 });
  await ctx.addInitScript(kopru);
  await ctx.addInitScript(() => {
    const G = window.Capacitor.Plugins.AkilGuncelleme;
    // Yavaş yerel kur(): durum 400 ms sonra "kuruluyor" olur
    G.kur = async () => { window.__calls.push(['kur']); await new Promise((r) => setTimeout(r, 400)); return {}; };
  });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  const n = (m) => p.evaluate((m) => window.__calls.filter((c) => c[0] === m).length, m);
  await step('Elle denetle → İndir → hazır: hiçbir yol kendiliğinden kurmaz', async () => {
    await p.goto(base + '?tool=ayarlar');
    await p.waitForSelector(tid('set-update-now'));
    await p.click(tid('set-update-now'));
    await p.waitForSelector(tid('gn-indir'));
    await p.click(tid('gn-indir'));
    await p.waitForSelector(tid('gn-kur'));
    // Uygulama arka plana gidip geri gelir, ayar açılıp kapanır
    await p.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await p.click(tid('set-update-check'));
    await p.click(tid('set-update-check'));
    await p.waitForTimeout(1200);
    assert.equal(await n('kur'), 0, 'kur kendiliğinden çağrılmamalı');
  });
  await step('"Kur"a çift dokunuş tek kurulum başlatır', async () => {
    await p.dblclick(tid('gn-kur'));
    await p.waitForTimeout(700);
    assert.equal(await n('kur'), 1);
  });
  await ctx.close();
}
await browser.close();
if (errors.length) { console.log('Sayfa hataları:', errors); fails++; }
console.log(fails ? `${fails} HATA` : 'Hepsi geçti');
process.exit(fails ? 1 : 0);
