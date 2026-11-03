// Enkaz modu ve enkaz arama (arayüz): sahte Capacitor köprüsüyle
//   • tarayıcı: hazırlık (bina), SMS bağlantısı, arama aracının açıklaması
//   • Android: arka plan seçenekleri, başlatma (etiket, kat, SMS), açık ekran, kapatma
//   • arama: duyulan işaretlerle sıcak-soğuk göstergesi; bildirimden açılış
//   node e2e/enkaz-check.mjs [taban-url] [ekran-klasörü]
import { createRequire } from 'module';
import assert from 'assert/strict';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:5199/';
const SHOTS = process.argv[3] ?? '/tmp/enkaz';
mkdirSync(SHOTS, { recursive: true });
const tid = (t) => `[data-testid="${t}"]`;
const browser = await pw.chromium.launch();
let fails = 0;
const errors = [];
async function step(name, fn) {
  try { await fn(); console.log('OK  ', name); } catch (e) { fails++; console.log('HATA', name, '\n     ', e.message.split('\n').slice(0, 4).join('\n      ')); }
}
const ortak = () => {
  try {
    localStorage.setItem('ac.kurulum', 'atla');
    localStorage.setItem('ac.yakinlar', JSON.stringify([{ id: 'm1', name: 'Mehmet', phone: '05550000000' }]));
  } catch {}
};

// ---------------------------------------------------------------- tarayıcı
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(ortak);
  await ctx.addInitScript(() => { window.__opened = []; window.__acSmsOpen = (h) => window.__opened.push(h); });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  await p.goto(base + '?tab=araclar');
  await step('Araçlar: Acil durum grubu en üstte', async () => {
    await p.waitForSelector('.tl-group');
    assert.equal((await p.textContent('.tl-group')).trim(), 'Acil durum');
    await p.click('text=Enkaz modu');
    await p.waitForSelector(tid('enkaz'));
  });
  await step('Hazırlık: ad ve bina eklenir, kalıcıdır', async () => {
    await p.fill(tid('ek-ad'), 'Ayşe');
    await p.click(tid('ek-bina-ekle'));
    await p.fill(tid('ek-bina-adres'), 'Örnek Mah. 5. Sokak No 3');
    await p.fill(tid('ek-bina-kat'), '3');
    await p.fill('[data-testid="ek-bina-form"] input[placeholder="B"]', 'B');
    await p.click(tid('ek-bina-kaydet'));
    await p.waitForSelector(tid('ek-bina'));
    assert.match(await p.textContent(tid('ek-bina')), /B blok, 3\. kat/);
    const kayit = await p.evaluate(() => JSON.parse(localStorage.getItem('ac.binalar')));
    assert.equal(kayit[0].kat, 3);
  });
  await step('Tarayıcı: başlatınca SMS hazırlanır, SOS ekranına gidilebilir', async () => {
    await p.click(tid('ek-baslat'));
    const href = await p.getAttribute(tid('ek-web-sms'), 'href');
    const body = decodeURIComponent(href.split('body=')[1]);
    assert.match(href, /^sms:112,05550000000\?/);
    assert.match(body, /ENKAZ ALTINDAYIM\. Adım Ayşe\. Bina: Örnek Mah\. 5\. Sokak No 3, B blok, 3\. kat\./);
    await p.screenshot({ path: SHOTS + '/1-tarayici-baslat.png', fullPage: true });
  });
  await step('Tarayıcı: enkaz arama Android gerektiğini söyler', async () => {
    await p.goto(base + '?tab=araclar');
    await p.click('text=Enkaz arama');
    await p.waitForSelector(tid('enkaz-arama'));
    assert.match(await p.textContent(tid('enkaz-arama')), /Android uygulaması gerekir/);
  });
  await step('İletişim: hızlı yardımda enkaz düğmeleri', async () => {
    await p.goto(base + '?tab=iletisim');
    await p.click(tid('quick-enkaz'));
    await p.waitForSelector(tid('enkaz'));
  });
  await ctx.close();
}

// ---------------------------------------------------------------- Android (sahte köprü)
function kopru() {
  try {
    localStorage.setItem('ac.kurulum', 'atla');
    localStorage.setItem('ac.yakinlar', JSON.stringify([{ id: 'm1', name: 'Mehmet', phone: '05550000000' }]));
    localStorage.setItem('ac.binalar', JSON.stringify([{ id: 'e', ad: 'Ev', adres: 'Örnek Mah. 5. Sokak No 3', blok: 'B', kat: 3, daire: '7', not: '', lat: 39.9208, lon: 32.8541 }]));
    localStorage.setItem('ac.comm.profile', JSON.stringify({ name: 'Ayşe Yılmaz' }));
  } catch {}
  const subs = {};
  const emit = (ev, d) => (subs[ev] || []).forEach((f) => f(d));
  window.__emit = emit;
  window.__calls = [];
  const log = (m, a) => window.__calls.push([m, a]);
  const izinler = { konum: 'tam', arkaPlanKonum: false, bluetooth: true, bluetoothVar: true, bluetoothAcik: true, bildirim: true, pilMuaf: false, sdk: 34 };
  const st = { aktif: false, istenen: false, otomatik: false, etiket: '', kat: -128, kimlik: 77, kod: 'AK-00004D', mesajlar: [], mesajDinleme: true, baslangic: 0, pil: 64, sesAraligiSn: 60, bluetoothAdi: false, gorunurBitis: 0, nobet: false, sarsinti: false, konumKaydiModu: 'kapali', izinler,
    sonKonum: { lat: 39.92085, lon: 32.85405, dogruluk: 12, zaman: Date.now() - 25 * 60000, kaynak: 'arka-plan' } };
  window.__st = st;
  const durum = () => JSON.parse(JSON.stringify(st));
  window.__hedef = window.__ilkHedef || null;
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    Plugins: {
      AkilCantasi: {
        async smsGonder(a) { log('smsGonder', a); return { queued: true, izin: true, ids: ['s1'] }; },
        async smsKutusu() { return { items: [], izin: true }; },
        async addListener() { return { remove() {} }; },
      },
      AkilEnkaz: {
        async durum() { return durum(); },
        async izinIste() { log('izinIste'); return { izinler }; },
        async arkaPlanKonumIzni() { log('arkaPlanKonumIzni'); izinler.arkaPlanKonum = true; return { izinler }; },
        async pilMuafiyeti() { log('pilMuafiyeti'); izinler.pilMuaf = true; return { acildi: true }; },
        async baslat(a) { log('baslat', a); Object.assign(st, { aktif: true, istenen: true, etiket: a.etiket, kat: a.kat ?? -128, baslangic: Date.now() - 65000, reklam: 'baslamadi' }); setTimeout(() => { st.reklam = 'yayiliyor'; st.sonSes = Date.now() - 20000; emit('enkazDurum', durum()); }, 300); return { izinler }; },
        async durdur() { log('durdur'); Object.assign(st, { aktif: false, istenen: false }); emit('enkazDurum', durum()); return {}; },
        async sesCal() { log('sesCal'); return {}; },
        async yanitVer(a) { log('yanitVer', a); st.yanit = { kod: a.kod, zaman: Date.now() }; setTimeout(() => emit('enkazDurum', durum()), 10); return {}; },
        async mesajGonder(a) { log('mesajGonder', a); window.__msjNo = (window.__msjNo || 0) + 1; return { no: window.__msjNo }; },
        async mesajDurdur() { log('mesajDurdur'); return {}; },
        async sesDuraklat(a) { log('sesDuraklat', a); st.sesDuraklatBitis = a.dk ? Date.now() + a.dk * 60000 : 0; emit('enkazDurum', durum()); return {}; },
        async gorunurOl(a) { log('gorunurOl', a); st.gorunurBitis = Date.now() + 3600000; setTimeout(() => emit('enkazDurum', durum()), 10); return { sn: 3600, ad: 'ENKAZ · ' + a.etiket }; },
        async hazirlik(a) { log('hazirlik', a); return {}; },
        async aramaBaslat() { log('aramaBaslat'); return { basladi: true, izinler }; },
        async aramaDurdur() { log('aramaDurdur'); return {}; },
        async duyulanlar() { return { liste: [{ kimlik: 9, rssi: -88, enkaz: true, otomatik: false, yasDk: 300, pil: 30, dogruluk: -1, guc: 3, etiket: 'Mehmet', son: Date.now() - 3600000, ilk: Date.now() - 7200000, sayi: 4 }] }; },
        async duyulanlariTemizle() { return {}; },
        async nobet(a) { log('nobet', a); st.nobet = a.ac; return { acik: a.ac }; },
        async sarsinti(a) { log('sarsinti', a); st.sarsinti = a.ac; return { acik: a.ac }; },
        async konumKaydi() { return { mod: st.konumKaydiModu, liste: [st.sonKonum], arkaPlanIzni: izinler.arkaPlanKonum }; },
        async konumKaydiModu(a) { log('konumKaydiModu', a); st.konumKaydiModu = a.mod; return { mod: a.mod, liste: [st.sonKonum], arkaPlanIzni: true }; },
        async konumEkle(a) { log('konumEkle', a); return {}; },
        async konumKaydiTemizle() { return {}; },
        async acilisHedefi() { const h = window.__hedef; window.__hedef = null; return h ? { arac: h } : {}; },
        async addListener(ev, fn) { (subs[ev] ||= []).push(fn); return { remove() { subs[ev] = subs[ev].filter((x) => x !== fn); } }; },
      },
    },
  };
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(kopru);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  const calls = (m) => p.evaluate((m) => window.__calls.filter((c) => c[0] === m).map((c) => c[1]), m);
  await p.goto(base + '?tab=araclar');
  await p.click('text=Enkaz modu');
  await p.waitForSelector(tid('ek-arkaplan'));

  await step('Arka plan: varsayılan kapalı; saatlik seçince önce izin istenir', async () => {
    assert.equal(await p.getAttribute(tid('ek-mod-kapali'), 'aria-pressed'), 'true');
    assert.equal(await p.getAttribute(tid('ek-nobet'), 'aria-checked'), 'false');
    assert.equal(await p.getAttribute(tid('ek-sarsinti'), 'aria-checked'), 'false');
    await p.click(tid('ek-mod-saatlik'));
    await p.waitForFunction(() => document.querySelector('[data-testid="ek-mod-saatlik"]')?.getAttribute('aria-pressed') === 'true');
    assert.equal((await calls('arkaPlanKonumIzni')).length, 1);
    assert.deepEqual(await calls('konumKaydiModu'), [{ mod: 'saatlik' }]);
    await p.waitForSelector(tid('ek-pil'));
    assert.match(await p.textContent(tid('ek-kayitlar')), /39\.9209, 32\.8541/);
  });
  await step('Arka plan: işaret dinleme ve sarsıntı açılır', async () => {
    await p.click(tid('ek-nobet'));
    await p.waitForFunction(() => document.querySelector('[data-testid="ek-nobet"]')?.getAttribute('aria-checked') === 'true');
    assert.deepEqual(await calls('nobet'), [{ ac: true }]);
    await p.click(tid('ek-sarsinti'));
    await p.waitForFunction(() => document.querySelector('[data-testid="ek-sarsinti"]')?.getAttribute('aria-checked') === 'true');
    const h = await calls('hazirlik');
    assert.equal(h.at(-1).etiket, 'Ayşe · B blok 3. kat D:7');
    await p.screenshot({ path: SHOTS + '/2-hazirlik-arkaplan.png', fullPage: true });
  });
  await step('Başlat: en yakın bina seçili, SMS 112 ve yakınlara, işaret etiketi ve kat', async () => {
    await p.click(tid('ek-baslat'));
    await p.waitForSelector(tid('ek-baslat-panel'));
    assert.equal(await p.isChecked('input[name="ek-bina"] >> nth=0'), true);
    assert.match(await p.textContent(tid('ek-sms-metin')), /B blok, 3\. kat, daire 7\. Son konum: 39\.92085, 32\.85405 \(±12 m, 25 dk önce\)/);
    await p.screenshot({ path: SHOTS + '/3-baslat.png', fullPage: true });
    await p.click(tid('ek-baslat-onay'));
    await p.waitForSelector(tid('ek-live'));
    assert.deepEqual(await calls('baslat'), [{ etiket: 'Ayşe · B blok 3. kat D:7', kat: 3 }]);
    const sms = await calls('smsGonder');
    assert.equal(sms.length, 2);
    assert.deepEqual(sms[0].to, ['112']);
    assert.deepEqual(sms[1].to, ['05550000000']);
    assert.match(sms[0].body, /^ENKAZ ALTINDAYIM\. Adım Ayşe Yılmaz\./);
    assert.match(sms[0].body, /İşaret kodu: AK-00004D\.$/);
  });
  await step('Açık ekran: işaret, ses, görünürlük', async () => {
    await p.waitForFunction(() => /Yakındaki uygulamalı telefonlar sizi duyabilir/.test(document.querySelector('[data-testid="ek-live"]')?.textContent || ''));
    await p.click(tid('ek-ses'));
    await p.click(tid('ek-sustur'));
    await p.waitForSelector(tid('ek-ses-ac'));
    assert.deepEqual(await calls('sesDuraklat'), [{ dk: 10 }]);
    await p.click(tid('ek-gorun'));
    await p.waitForFunction(() => /"ENKAZ" adıyla görünüyorsunuz/.test(document.querySelector('[data-testid="ek-live"]')?.textContent || ''));
    assert.equal((await calls('sesCal')).length, 1);
    await p.screenshot({ path: SHOTS + '/4-acik.png', fullPage: true });
  });
  await step('Mesajlaşma: kod görünür, gelen mesaj, hazır yanıt', async () => {
    assert.match(await p.textContent(tid('ek-kod')), /AK-00004D/);
    await p.evaluate(() => { window.__st.mesajlar = [{ no: 1, kod: 1, zaman: Date.now() - 30000, rssi: -70 }]; window.__emit('enkazDurum', JSON.parse(JSON.stringify(window.__st))); });
    await p.waitForSelector(tid('ek-gelen'));
    assert.match(await p.textContent(tid('ek-gelen')), /Sesini duyduk, geliyoruz\./);
    await p.click(tid('ek-yanit-3'));
    await p.waitForSelector(tid('ek-yanitim'));
    assert.deepEqual(await calls('yanitVer'), [{ kod: 3 }]);
    assert.equal(await p.getAttribute(tid('ek-yanit-3'), 'aria-pressed'), 'true');
    await p.locator(tid('ek-mesajlar')).screenshot({ path: SHOTS + '/4b-mesajlar.png' });
  });
  await step('Kapatma 2 sn basılı tutmayla; kısa dokunuş kapatmaz', async () => {
    await p.click(tid('ek-kapat'));
    assert.equal((await calls('durdur')).length, 0);
    const b = await p.$(tid('ek-kapat'));
    const box = await b.boundingBox();
    await p.mouse.move(box.x + 20, box.y + 10);
    await p.mouse.down();
    await p.waitForTimeout(2300);
    await p.mouse.up();
    await p.waitForSelector(tid('ek-baslat'));
    assert.equal((await calls('durdur')).length, 1);
  });
  await step('Enkaz arama: işaret yaklaşırken gösterge ve SMS', async () => {
    await p.click(tid('ek-arama-git'));
    await p.waitForSelector(tid('ea-bos'));
    // Aranan kişi: gelen SMS yapıştırılır (kimlik 5 → AK-000005)
    await p.click(tid('ea-hedef-ac'));
    await p.fill(tid('ea-hedef-metin'), 'ENKAZ ALTINDAYIM. Adım Ayşe. Bina: Örnek Mah. 5. Sokak No 3, B blok, 3. kat. Son konum: 39.92085, 32.85405 (±12 m, 25 dk önce). Telefonum enkaz işareti ve SOS sesi veriyor. İşaret kodu: AK-000005.');
    await p.click(tid('ea-hedef-ekle'));
    await p.waitForSelector(tid('ea-hedef'));
    assert.match(await p.textContent(tid('ea-hedef')), /AK-000005/);
    assert.match(await p.textContent(tid('ea-hedef')), /Örnek Mah\. 5\. Sokak No 3, B blok, 3\. kat/);
    for (let i = 0; i < 16; i++) {
      await p.evaluate((r) => window.__emit('enkazDuyuldu', { kimlik: 5, rssi: r, enkaz: true, otomatik: false, lat: 39.92085, lon: 32.85405, yasDk: 25, pil: 64, kat: 3, dogruluk: 12, guc: 3, etiket: 'Ayşe · B blok 3. kat D:7' }), -88 + i * 2);
      await p.evaluate((r) => window.__emit('enkazDuyuldu', { kimlik: 6, rssi: r, enkaz: true, otomatik: true, yasDk: -1, pil: 12, dogruluk: -1, guc: 3 }), -60);
      await p.waitForTimeout(400);
    }
    await p.waitForSelector(tid('ea-gosterge'));
    assert.match(await p.textContent(tid('ea-egilim')), /Yaklaşıyorsunuz/);
    assert.match(await p.textContent(tid('ea-yakinlik')), /Çok yakın|Yakın/);
    assert.equal(await p.locator(tid('ea-item')).count(), 2);
    // Aranan kişi daha zayıf duyulsa da seçili ve listede en üstte
    assert.match(await p.textContent(tid('ea-gosterge')), /Aranan kişi/);
    assert.match(await p.textContent(tid('ea-item') + ' >> nth=0'), /Aranan kişi/);
    assert.match(await p.textContent(tid('ea-hedef')), /işareti duyuluyor/);
    const href = await p.getAttribute(tid('ea-sms'), 'href');
    assert.match(decodeURIComponent(href), /İşaret: Ayşe · B blok 3\. kat D:7\./);
    assert.match(await p.textContent(tid('ea-gecmis')), /Mehmet/);
    // Mesaj gönder → işaret onaylar → ulaştı; yanıt görünür
    await p.click(tid('ea-msj-1'));
    await p.waitForFunction(() => /Gönderiliyor/.test(document.querySelector('[data-testid="ea-msj-durum"]')?.textContent || ''));
    const gm = await p.evaluate(() => window.__calls.filter((c) => c[0] === 'mesajGonder').map((c) => c[1]));
    assert.deepEqual(gm, [{ hedef: 5, kod: 1 }]);
    await p.evaluate(() => window.__emit('enkazDuyuldu', { kimlik: 5, rssi: -58, enkaz: true, otomatik: false, lat: 39.92085, lon: 32.85405, yasDk: 25, pil: 64, kat: 3, dogruluk: 12, guc: 3, etiket: 'Ayşe · B blok 3. kat D:7', onay: 1, yanit: 3, yanitSayac: 1 }));
    await p.waitForFunction(() => /Ulaştı/.test(document.querySelector('[data-testid="ea-msj-durum"]')?.textContent || ''));
    assert.match(await p.textContent(tid('ea-yanit')), /Yaralıyım/);
    const sms112 = decodeURIComponent(await p.getAttribute(tid('ea-sms'), 'href'));
    assert.match(sms112, /Yanıtı: Yaralıyım\./);
    assert.match(sms112, /İşaret kodu: AK-000005\./);
    await p.screenshot({ path: SHOTS + '/5-arama.png', fullPage: true });
  });
  await step('Aramadan çıkınca tarama durur', async () => {
    await p.click(tid('tool-back'));
    await p.waitForFunction(() => window.__calls.some((c) => c[0] === 'aramaDurdur'));
  });
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { window.__ilkHedef = 'enkaz-arama'; });
  await ctx.addInitScript(kopru);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(e.message));
  await step('Bildirimden açılış: enkaz aramaya gider', async () => {
    await p.goto(base);
    await p.waitForSelector(tid('enkaz-arama'), { timeout: 10000 });
  });
  await ctx.close();
}

await browser.close();
if (errors.length) { console.log('Sayfa hataları:', errors); fails++; }
console.log(fails ? `${fails} HATA` : 'Hepsi geçti');
process.exit(fails ? 1 : 0);
