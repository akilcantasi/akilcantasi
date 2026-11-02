// Android SMS giden kutusu (arayüz): sahte Capacitor köprüsüyle
//   • 112 ve yakın SMS'i uygulama kendisi kuyruğa verir (SMS uygulaması açılmaz)
//   • 3 sn içinde "Vazgeç" gönderimi durdurur
//   • şebeke yok → giden kutusunda neden ve sonraki deneme, "Şimdi dene", "İptal", "Gidenleri temizle"
//   • SMS izni verilmezse SMS uygulamasına düşer
//   node e2e/sms-kutusu-check.mjs [taban-url] [ekran-klasörü]
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:8099/';
const SHOTS = process.argv[3] ?? '/tmp/sms-kutusu';
mkdirSync(SHOTS, { recursive: true });
const tid = (t) => `[data-testid="${t}"]`;

const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, permissions: ['geolocation'], geolocation: { latitude: 39.9208, longitude: 32.8541, accuracy: 15 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => {
  window.__opened = [];
  window.__acSmsOpen = (h) => window.__opened.push(h);
  window.__izin = true;
  window.__sent = [];
  try {
    localStorage.setItem('ac.kurulum', 'atla');
    localStorage.setItem('ac.yakinlar', JSON.stringify([{ id: 'a1', name: 'Ayşe', phone: '05320000000' }, { id: 'm1', name: 'Mehmet', phone: '05550000000' }]));
  } catch {}
  // Sahte giden kutusu: şebeke yok, ilk deneme başarısız
  const items = [];
  const subs = [];
  const emit = () => subs.forEach((f) => f({ items: items.slice().reverse() }));
  let n = 0;
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    Plugins: {
      AkilCantasi: {
        async smsGonder({ to, names, body }) {
          if (!window.__izin) return { queued: false, izin: false };
          window.__sent.push({ to, names, body });
          const ids = to.map((t, i) => {
            const id = 's' + ++n;
            items.push({ id, to: t, name: names[i] || '', body, state: 'bekliyor', error: 'Şebeke yok', created: Date.now(), nextTry: Date.now() + 15000, tried: Date.now(), sentAt: 0, deliveredAt: 0, attempts: 1, parts: 1 });
            return id;
          });
          setTimeout(emit, 50);
          return { queued: true, izin: true, ids };
        },
        async smsKutusu() { return { items: items.slice().reverse(), izin: true }; },
        async smsSimdiDene({ id }) {
          for (const m of items) if (!id || m.id === id) Object.assign(m, { state: 'gitti', error: '', attempts: m.attempts + 1, sentAt: Date.now() });
          emit();
        },
        async smsIptal({ id }) { const i = items.findIndex((m) => m.id === id); if (i >= 0) items.splice(i, 1); emit(); return { removed: i >= 0 }; },
        async smsTemizle() { for (let i = items.length - 1; i >= 0; i--) if (!['bekliyor', 'gonderiliyor'].includes(items[i].state)) items.splice(i, 1); emit(); },
        async addListener(ev, fn) { if (ev === 'smsDurum') subs.push(fn); return { remove() { const i = subs.indexOf(fn); if (i >= 0) subs.splice(i, 1); } }; },
      },
    },
  };
});
await page.goto(base + '?tab=iletisim');
await page.waitForSelector(tid('quick-help'));
let fails = 0;
async function step(name, fn) {
  try { await fn(); console.log('OK  ', name); } catch (e) { fails++; console.log('HATA', name, '\n     ', e.message.split('\n').slice(0, 4).join('\n      ')); }
}

await step('Android: 112 düğmesi doğrudan gönderimi anlatır', async () => {
  assert.match(await page.textContent(tid('quick-112-sms')), /SMS kendiliğinden gider/);
});

await step('Vazgeç: 3 sn içinde gönderim durur', async () => {
  await page.click(tid('quick-person') + ' >> nth=0');
  await page.waitForSelector(tid('quick-cancel'));
  assert.match(await page.textContent(tid('quick-status')), /Ayşe kişisine SMS: konum alınıyor/);
  await page.click(tid('quick-cancel'));
  await page.waitForFunction(() => /iptal edildi/.test(document.querySelector('[data-testid="quick-status"]').textContent));
  assert.equal(await page.evaluate(() => window.__sent.length), 0);
  assert.equal(await page.evaluate(() => window.__opened.length), 0);
});

await step('112: konumlu SMS kuyruğa verilir, SMS uygulaması açılmaz', async () => {
  await page.click(tid('quick-112-sms'));
  await page.waitForFunction(() => window.__sent.length === 1, null, { timeout: 15000 });
  const s = await page.evaluate(() => window.__sent[0]);
  assert.deepEqual(s.to, ['112']);
  assert.match(s.body, /ACİL\./);
  assert.match(s.body, /Konum: 39\.92080, 32\.85410/);
  assert.equal(await page.evaluate(() => window.__opened.length), 0);
  assert.match(await page.textContent(tid('quick-status')), /otomatik yeniden denenecek/);
});

await step('Hepsine: her yakın ayrı mesaj, giden kutusunda neden ve sonraki deneme', async () => {
  await page.click(tid('quick-durum-yardim'));
  await page.click(tid('quick-all'));
  await page.waitForFunction(() => window.__sent.length === 2, null, { timeout: 15000 });
  const s = await page.evaluate(() => window.__sent[1]);
  assert.deepEqual(s.to, ['05320000000', '05550000000']);
  assert.deepEqual(s.names, ['Ayşe', 'Mehmet']);
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="sms-item"]').length === 3);
  const rows = await page.$$eval(tid('sms-item'), (x) => x.map((e) => e.innerText.replace(/\s+/g, ' ')));
  assert.ok(rows.some((r) => /112 .*Şebeke yok\. \d+ sn sonra yeniden denenecek/.test(r)), rows.join(' | '));
  assert.match(await page.textContent(tid('sms-outbox')), /telefon yeniden başlasa da/);
  await page.screenshot({ path: `${SHOTS}/giden-kutusu.png`, fullPage: true });
});

await step('Şimdi dene → gönderildi; İptal; Gidenleri temizle', async () => {
  await page.click(`${tid('sms-item')}:has-text("Ayşe") ${tid('sms-retry')}`);
  await page.waitForSelector(`${tid('sms-item')}[data-state="gitti"]:has-text("Ayşe")`);
  assert.match(await page.textContent(`${tid('sms-item')}:has-text("Ayşe")`), /Gönderildi \(2\. denemede\)/);
  await page.click(`${tid('sms-item')}:has-text("Mehmet") ${tid('sms-cancel')}`);
  await page.waitForFunction(() => !/Mehmet/.test(document.querySelector('[data-testid="sms-outbox"]').innerText));
  await page.click(tid('sms-clear'));
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="sms-item"]').length === 1);
});

await step('dokunma hedefleri ≥ 44 px, taşma yok', async () => {
  const small = await page.$$eval('#main button', (els) => els.filter((e) => e.offsetParent).map((e) => ({ t: e.dataset.testid || e.textContent.trim().slice(0, 15), r: e.getBoundingClientRect() })).filter((x) => x.r.width < 44 || x.r.height < 44).map((x) => x.t));
  assert.deepEqual(small, []);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
});

await step('SMS izni verilmezse SMS uygulaması açılır', async () => {
  await page.evaluate(() => (window.__izin = false));
  await page.click(tid('quick-person') + ' >> nth=1');
  await page.waitForFunction(() => window.__opened.length === 1, null, { timeout: 15000 });
  assert.match(await page.evaluate(() => window.__opened[0]), /^sms:05550000000\?body=/);
  assert.match(await page.textContent(tid('quick-status')), /SMS izni verilmediği için/);
});

await browser.close();
if (errors.length) { fails++; console.log('HATA sayfa:', errors.join(' | ')); }
console.log(fails ? `${fails} hata` : 'hepsi geçti');
process.exit(fails ? 1 : 0);
