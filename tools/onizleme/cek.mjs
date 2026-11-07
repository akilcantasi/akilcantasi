// README önizlemeleri — 1. adım: telefon ekran görüntüleri (390×844, deviceScaleFactor 2).
//   node tools/onizleme/cek.mjs [çıktı-klasörü] [bölüm ...]
//   bölümler: fener rehber harita iletisim kutuphane araclar enkaz (boşsa hepsi)
// Bilgi noktası sunucusu geçici bir veri klasörüyle başlatılır (testdata/ ZIM'leri ve haritası),
// uygulama dist/ klasöründen sunulur: önce `npm run build`.
// Harita: testdata/_turkiye.pmtiles varsa gerçek harita (Ankara/Kızılay), yoksa örnek harita.
// Bütün örnek veriler geneldir (Ayşe, Mehmet, Örnek Mahallesi, Ankara/Kızılay) — CLAUDE.md §1.
import { createRequire } from 'module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.resolve(process.argv[2] ?? path.join(os.tmpdir(), 'akil-onizleme', 'ham'));
const SEC = new Set(process.argv.slice(3));
const yap = (b) => SEC.size === 0 || SEC.has(b);
fs.mkdirSync(OUT, { recursive: true });

// Kızılay (CLAUDE.md'deki genel örnek konum)
const KONUM = { latitude: 39.9208, longitude: 32.8541, accuracy: 8 };
const tid = (t) => `[data-testid="${t}"]`;
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- veri klasörü ----------
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-onizleme-veri-'));
fs.mkdirSync(path.join(data, 'zim'));
fs.mkdirSync(path.join(data, 'maps'));
for (const z of ['sample_tr.zim', 'sample_med_en.zim', 'sample_kitap_en.zim']) fs.copyFileSync(path.join(ROOT, 'testdata', z), path.join(data, 'zim', z));
const gercek = path.join(ROOT, 'testdata', '_turkiye.pmtiles');
const gercekHarita = fs.existsSync(gercek);
if (gercekHarita) fs.symlinkSync(gercek, path.join(data, 'maps', 'turkiye.pmtiles'));
else fs.copyFileSync(path.join(ROOT, 'testdata', 'sample_yerler_ornek.pmtiles'), path.join(data, 'maps', 'ornek.pmtiles'));
// Örnek noktalar; "sentetik test noktası" notu önizlemede gereksiz kalabalık yapar
const poi = JSON.parse(fs.readFileSync(path.join(ROOT, 'testdata', 'sample_poi_ornek.geojson'), 'utf8'));
for (const f of poi.features) if (f.properties?.note) f.properties.note = f.properties.note.replace(/\s*—\s*sentetik test noktası/, '');
fs.writeFileSync(path.join(data, 'maps', 'afet-noktalari.geojson'), JSON.stringify(poi));

const srv = await startServer({ port: 0, host: '127.0.0.1', data, dist: path.join(ROOT, 'dist'), apkDirs: [data], quiet: true });
const BASE = `http://127.0.0.1:${srv.port}/`;
console.log('Bilgi noktası:', BASE, gercekHarita ? '(gerçek harita)' : '(örnek harita)');

const browser = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const hatalar = [];

/** Temiz ilk açılış: kurulum atlanmış, yakınlar listesi örnek */
async function sayfa({ profil, init, konum = true } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    ...(konum ? { geolocation: KONUM, permissions: ['geolocation'] } : {}),
  });
  ctx.setDefaultTimeout(120000);
  // Dış istekler (çevrimiçi katalog vb.) hemen düşsün: ekran görüntüsünde bekleme/hata olmasın
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await ctx.addInitScript((pr) => {
    try {
      localStorage.setItem('ac.kurulum', 'atla');
      localStorage.setItem('ac.yakinlar', JSON.stringify([{ id: 'm1', name: 'Mehmet', phone: '05550000000' }]));
      if (pr && !localStorage.getItem('ac.comm.profile')) localStorage.setItem('ac.comm.profile', JSON.stringify(pr));
    } catch {}
  }, profil ?? null);
  // İmleç yanıp sönmesi ve geçişler ekran görüntüsünü bozmasın
  await ctx.addInitScript(() => {
    addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = '*{caret-color:transparent!important}';
      document.head.appendChild(s);
    });
  });
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_TUNNEL|ERR_INTERNET|Failed to load resource/.test(m.text())) hatalar.push('console: ' + m.text()); });
  return { ctx, p };
}
async function cek(p, ad) {
  await p.evaluate(() => document.activeElement?.blur?.());
  await p.mouse.move(1, 1); // üzerine gelme (hover) görünümü kalmasın
  await bekle(400);
  await p.screenshot({ path: path.join(OUT, ad + '.png') });
  console.log('  ✓', ad);
}
/** Ana kaydırma alanını başa (ya da öğeye) getir */
const kaydir = (p, y) => p.evaluate((y) => { const m = document.querySelector('.app-main') ?? document.scrollingElement; m.scrollTop = y; }, y);
const ogeyeKaydir = (p, sel, ust = 70) => p.evaluate(([s, u]) => {
  const e = document.querySelector(s); const m = document.querySelector('.app-main');
  if (e && m) m.scrollTop += e.getBoundingClientRect().top - m.getBoundingClientRect().top - u;
}, [sel, ust]);

// ---------- Fener ----------
if (yap('fener')) {
  const { ctx, p } = await sayfa();
  await p.goto(BASE + '?tab=fener', { waitUntil: 'networkidle' });
  await cek(p, 'fener-bos');
  await p.fill(tid('fener-input'), 'Deprem anında ne yapmalıyım?');
  await cek(p, 'fener-soru');
  await p.click(tid('fener-send'));
  await p.waitForSelector(tid('fener-msg-bot'));
  await p.waitForFunction(() => document.querySelector('[data-testid="fener-msg-bot"]')?.getAttribute('aria-busy') !== 'true', null, { timeout: 60000 });
  await bekle(800);
  await cek(p, 'fener-cevap');
  // Cevabın sonu: kaynak etiketleri
  await p.evaluate(() => { const l = document.querySelector('.fener-list'); if (l) l.scrollTop = l.scrollHeight; });
  await bekle(600);
  await cek(p, 'fener-kaynak');
  await ctx.close();
}

// ---------- Rehber ----------
if (yap('rehber')) {
  const { ctx, p } = await sayfa();
  await p.goto(BASE + '?tab=rehber', { waitUntil: 'networkidle' });
  await bekle(800);
  await cek(p, 'rehber-ana');
  await p.goto(BASE + '?guide=deprem-aninda', { waitUntil: 'networkidle' });
  await p.waitForSelector(tid('guide-detail'));
  await bekle(800);
  await cek(p, 'rehber-detay');
  await ogeyeKaydir(p, tid('guide-step') + ':nth-of-type(2)', 20);
  await bekle(500);
  await cek(p, 'rehber-adimlar');
  await ctx.close();
}

// ---------- Harita ----------
async function haritaAc(p) {
  await p.goto(BASE + '?tab=harita', { waitUntil: 'domcontentloaded' });
  await p.waitForSelector(tid('map') + ' canvas', { timeout: 60000 });
  await p.click(tid('map-locate'));
  await p.waitForSelector(tid('user-marker'), { timeout: 20000 });
  // Üretim derlemesinde harita nesnesine erişim yok: görünüm düğme ve sürüklemeyle ayarlanır.
  // Kızılay ve güneyindeki örnek noktalar birlikte görünsün.
  await bekle(2500);
  await p.click('.maplibregl-ctrl-zoom-out');
  await bekle(900);
  await p.click('.maplibregl-ctrl-zoom-out');
  await bekle(1200);
  const k = await p.locator(tid('map') + ' canvas').boundingBox();
  const x = k.x + k.width / 2, y = k.y + k.height * 0.75;
  await p.mouse.move(x, y);
  await p.mouse.down();
  for (let i = 1; i <= 10; i++) await p.mouse.move(x + i * 2, y - i * 7);
  await p.mouse.up();
  await bekle(4000);
  await bekle(1500);
}
if (yap('harita')) {
  const { ctx, p } = await sayfa();
  await haritaAc(p);
  await cek(p, 'harita-ana');
  // Nokta kartı: en yakın toplanma alanı
  await p.click(tid('map-nearest'));
  await p.waitForSelector(tid('poi-card'));
  await bekle(4000);
  await cek(p, 'harita-nokta');
  await p.click(tid('poi-close'));
  // Yer adı araması
  const ara = tid('yer-ara');
  await p.click(ara);
  await p.waitForSelector(tid('yer-hazirlik'), { state: 'detached', timeout: 300000 }).catch(() => {});
  await p.fill(ara, gercekHarita ? 'dikmen' : 'isik');
  await p.waitForSelector(tid('yer-sonuc'));
  await bekle(600);
  await cek(p, 'harita-ara');
  // Çankaya'daki mahalleyi seç (aynı adlı başka yerler de listelenir)
  const sec = p.locator(tid('yer-sonuc'), { hasText: gercekHarita ? 'Çankaya' : '' }).first();
  await sec.click();
  await p.waitForSelector(tid('yer-card'));
  await bekle(4000);
  await cek(p, 'harita-yer');
  await p.click(tid('yer-direction'));
  await p.waitForSelector(tid('map-dir-panel') + ' ' + tid('dir-text'));
  await bekle(1200);
  await cek(p, 'harita-yon');
  await ctx.close();
}

// ---------- İletişim ----------
if (yap('iletisim')) {
  const A = await sayfa({ profil: { name: 'Ayşe', family: '', familyName: '', server: '' } });
  const B = await sayfa({ profil: { name: 'Mehmet', family: '', familyName: '', server: '' } });
  const bagli = (p) => p.waitForSelector(tid('conn-status') + '[data-state="connected"]', { timeout: 20000 }).catch(() => {});
  // A: pano mesajı ve kayıp ilanı
  await A.p.goto(BASE + '?comm=pano', { waitUntil: 'domcontentloaded' });
  await bagli(A.p);
  await A.p.fill(tid('board-input'), 'Örnek Mahallesi toplanma alanındayız. Ailecek iyiyiz, battaniye ve su var.');
  await A.p.click(tid('board-send'));
  await A.p.waitForSelector(tid('send-result'));
  await A.p.goto(BASE + '?comm=kayip', { waitUntil: 'domcontentloaded' });
  await bagli(A.p);
  await A.p.fill(tid('missing-name'), 'Zeynep');
  await A.p.fill(tid('missing-age'), '8');
  await A.p.fill(tid('missing-desc'), 'Mavi mont, kırmızı sırt çantası');
  await A.p.fill(tid('missing-lastSeen'), 'Okul bahçesi, 14.00');
  await A.p.click(tid('missing-send'));
  await A.p.waitForSelector(tid('missing-item-name'));
  // B: pano mesajı
  await B.p.goto(BASE + '?comm=pano', { waitUntil: 'domcontentloaded' });
  await bagli(B.p);
  await B.p.fill(tid('board-input'), 'Okul bahçesinde saat 18.00\'de sıcak yemek ve su dağıtılacak.');
  await B.p.click(tid('board-send'));
  await B.p.waitForSelector(tid('send-result'));
  await bekle(1500);
  // Ekranlar Mehmet'in telefonundan: Ayşe'nin kayıtları "doğrulandı"
  await B.p.goto(BASE + '?tab=iletisim', { waitUntil: 'networkidle' });
  await bagli(B.p);
  await bekle(1000);
  await cek(B.p, 'iletisim-ana');
  await B.p.goto(BASE + '?comm=kayip', { waitUntil: 'domcontentloaded' });
  await bagli(B.p);
  await B.p.waitForSelector(tid('item-verified'), { timeout: 20000 });
  await ogeyeKaydir(B.p, '[data-testid="board-item"][data-kind="kayip"]', 70);
  await bekle(800);
  await cek(B.p, 'iletisim-kayip');
  await B.p.goto(BASE + '?comm=pano', { waitUntil: 'domcontentloaded' });
  await bagli(B.p);
  await B.p.waitForSelector(tid('item-verified'), { timeout: 20000 });
  await ogeyeKaydir(B.p, '[data-testid="board-item"]', 150);
  await bekle(800);
  await cek(B.p, 'iletisim-pano');
  await A.ctx.close();
  await B.ctx.close();
}

// ---------- Kütüphane ----------
if (yap('kutuphane')) {
  const { ctx, p } = await sayfa();
  await p.goto(BASE + '?tab=kutuphane', { waitUntil: 'networkidle' });
  await p.waitForSelector(tid('lib-search'), { timeout: 60000 });
  await p.waitForFunction(() => !/hazırlanıyor/i.test(document.querySelector('[data-testid="lib-view"]')?.textContent ?? ''), null, { timeout: 60000 }).catch(() => {});
  await bekle(1500);
  await cek(p, 'kutuphane-ana');
  // Kısa sorgu: örnek arşivlerde birkaç kaynaktan sonuç gelsin (Deprem, Dehydration…)
  await p.fill(tid('lib-search'), 'de');
  await p.waitForFunction(() => document.querySelector('[data-testid="lib-view"]')?.dataset.state === 'idle', null, { timeout: 60000 }).catch(() => {});
  await p.waitForSelector(tid('lib-result'));
  await bekle(800);
  await cek(p, 'kutuphane-ara');
  await p.locator(tid('lib-result'), { hasText: 'Deprem' }).first().click();
  await p.waitForSelector(tid('lib-article'));
  await bekle(1500);
  await cek(p, 'kutuphane-makale');
  await ctx.close();
}

// ---------- Araçlar ----------
if (yap('araclar')) {
  const { ctx, p } = await sayfa();
  await p.goto(BASE + '?tab=araclar', { waitUntil: 'networkidle' });
  await bekle(800);
  await cek(p, 'araclar');
  await ctx.close();
}

// ---------- Enkaz (sahte Capacitor köprüsü, e2e/enkaz-check.mjs ile aynı yaklaşım) ----------
function kopru() {
  try {
    localStorage.setItem('ac.binalar', JSON.stringify([{ id: 'e', ad: 'Ev', adres: 'Örnek Mah. 5. Sokak No 3', blok: 'B', kat: 3, daire: '7', not: '', lat: 39.9208, lon: 32.8541 }]));
    localStorage.setItem('ac.comm.profile', JSON.stringify({ name: 'Ayşe' }));
  } catch {}
  const subs = {};
  const emit = (ev, d) => (subs[ev] || []).forEach((f) => f(d));
  window.__emit = emit;
  const izinler = { konum: 'tam', arkaPlanKonum: true, bluetooth: true, bluetoothVar: true, bluetoothAcik: true, bildirim: true, pilMuaf: true, sdk: 34 };
  const st = { aktif: false, istenen: false, otomatik: false, etiket: '', kat: -128, kimlik: 77, kod: 'AK-00004D', mesajlar: [], mesajDinleme: true, baslangic: 0, pil: 64, sesAraligiSn: 60, bluetoothAdi: false, gorunurBitis: 0, nobet: false, sarsinti: false, konumKaydiModu: 'kapali', izinler,
    sonKonum: { lat: 39.92085, lon: 32.85405, dogruluk: 12, zaman: Date.now() - 25 * 60000, kaynak: 'arka-plan' } };
  window.__st = st;
  const durum = () => JSON.parse(JSON.stringify(st));
  window.__hedef = null;
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    Plugins: {
      AkilCantasi: {
        async smsGonder() { return { queued: true, izin: true, ids: ['s1'] }; },
        async smsKutusu() { return { items: [], izin: true }; },
        async addListener() { return { remove() {} }; },
      },
      AkilEnkaz: {
        async durum() { return durum(); },
        async izinIste() { return { izinler }; },
        async arkaPlanKonumIzni() { return { izinler }; },
        async pilMuafiyeti() { return { acildi: true }; },
        async baslat(a) { Object.assign(st, { aktif: true, istenen: true, etiket: a.etiket, kat: a.kat ?? -128, baslangic: Date.now() - 65000, reklam: 'baslamadi' }); setTimeout(() => { st.reklam = 'yayiliyor'; st.sonSes = Date.now() - 20000; emit('enkazDurum', durum()); }, 300); return { izinler }; },
        async durdur() { Object.assign(st, { aktif: false, istenen: false }); emit('enkazDurum', durum()); return {}; },
        async sesCal() { return {}; },
        async yanitVer(a) { st.yanit = { kod: a.kod, zaman: Date.now() }; setTimeout(() => emit('enkazDurum', durum()), 10); return {}; },
        async mesajGonder() { window.__msjNo = (window.__msjNo || 0) + 1; return { no: window.__msjNo }; },
        async mesajDurdur() { return {}; },
        async sesDuraklat(a) { st.sesDuraklatBitis = a.dk ? Date.now() + a.dk * 60000 : 0; emit('enkazDurum', durum()); return {}; },
        async gorunurOl(a) { st.gorunurBitis = Date.now() + 3600000; setTimeout(() => emit('enkazDurum', durum()), 10); return { sn: 3600, ad: 'ENKAZ · ' + a.etiket }; },
        async hazirlik() { return {}; },
        async aramaBaslat() { return { basladi: true, izinler }; },
        async aramaDurdur() { return {}; },
        async duyulanlar() { return { liste: [] }; },
        async duyulanlariTemizle() { return {}; },
        async nobet(a) { st.nobet = a.ac; return { acik: a.ac }; },
        async sarsinti(a) { st.sarsinti = a.ac; return { acik: a.ac }; },
        async konumKaydi() { return { mod: st.konumKaydiModu, liste: [st.sonKonum], arkaPlanIzni: true }; },
        async konumKaydiModu(a) { st.konumKaydiModu = a.mod; return { mod: a.mod, liste: [st.sonKonum], arkaPlanIzni: true }; },
        async konumEkle() { return {}; },
        async konumKaydiTemizle() { return {}; },
        async acilisHedefi() { return {}; },
        async addListener(ev, fn) { (subs[ev] ||= []).push(fn); return { remove() { subs[ev] = subs[ev].filter((x) => x !== fn); } }; },
      },
    },
  };
}
if (yap('enkaz')) {
  const { ctx, p } = await sayfa({ init: kopru });
  await p.goto(BASE + '?tool=enkaz', { waitUntil: 'networkidle' });
  await p.waitForSelector(tid('ek-baslat'));
  await bekle(800);
  await cek(p, 'enkaz-hazirlik');
  await p.click(tid('ek-baslat'));
  await p.waitForSelector(tid('ek-baslat-panel'));
  await ogeyeKaydir(p, tid('ek-baslat-panel'), 12);
  await bekle(600);
  await cek(p, 'enkaz-baslat');
  await p.click(tid('ek-baslat-onay'));
  await p.waitForSelector(tid('ek-live'));
  await p.waitForFunction(() => /Yakındaki uygulamalı telefonlar sizi duyabilir/.test(document.querySelector('[data-testid="ek-live"]')?.textContent || ''));
  await kaydir(p, 0);
  await bekle(800);
  await cek(p, 'enkaz-acik');
  // Kurtarıcıdan mesaj gelir, hazır yanıt verilir
  await p.evaluate(() => { window.__st.mesajlar = [{ no: 1, kod: 1, zaman: Date.now() - 30000, rssi: -70 }]; window.__emit('enkazDurum', JSON.parse(JSON.stringify(window.__st))); });
  await p.waitForSelector(tid('ek-gelen'));
  await p.click(tid('ek-yanit-3'));
  await p.waitForSelector(tid('ek-yanitim'));
  await ogeyeKaydir(p, tid('ek-mesajlar'), 12);
  await bekle(600);
  await cek(p, 'enkaz-mesaj');
  await ctx.close();

  // Kurtarıcı: enkaz arama
  const K = await sayfa({ init: kopru });
  const q = K.p;
  await q.goto(BASE + '?tool=enkaz-arama', { waitUntil: 'networkidle' });
  await q.waitForSelector(tid('ea-bos'));
  await bekle(600);
  await cek(q, 'arama-bos');
  await q.click(tid('ea-hedef-ac'));
  await q.fill(tid('ea-hedef-metin'), 'ENKAZ ALTINDAYIM. Adım Ayşe. Bina: Örnek Mah. 5. Sokak No 3, B blok, 3. kat. Son konum: 39.92085, 32.85405 (±12 m, 25 dk önce). Telefonum enkaz işareti ve SOS sesi veriyor. İşaret kodu: AK-000005.');
  await q.click(tid('ea-hedef-ekle'));
  await q.waitForSelector(tid('ea-hedef'));
  for (let i = 0; i < 18; i++) {
    const r = -90 + i * 2 + Math.round(Math.sin(i * 1.7) * 3);
    await q.evaluate((r) => window.__emit('enkazDuyuldu', { kimlik: 5, rssi: r, enkaz: true, otomatik: false, lat: 39.92085, lon: 32.85405, yasDk: 25, pil: 64, kat: 3, dogruluk: 12, guc: 3, etiket: 'Ayşe · B blok 3. kat D:7' }), r);
    await bekle(350);
  }
  await q.waitForSelector(tid('ea-gosterge'));
  await kaydir(q, 0);
  await ogeyeKaydir(q, tid('ea-gosterge'), 12);
  await bekle(600);
  await cek(q, 'arama-iz');
  await q.click(tid('ea-msj-1'));
  await q.waitForFunction(() => /Gönderiliyor/.test(document.querySelector('[data-testid="ea-msj-durum"]')?.textContent || ''));
  await q.evaluate(() => window.__emit('enkazDuyuldu', { kimlik: 5, rssi: -56, enkaz: true, otomatik: false, lat: 39.92085, lon: 32.85405, yasDk: 25, pil: 64, kat: 3, dogruluk: 12, guc: 3, etiket: 'Ayşe · B blok 3. kat D:7', onay: 1, yanit: 3, yanitSayac: 1 }));
  await q.waitForFunction(() => /Ulaştı/.test(document.querySelector('[data-testid="ea-msj-durum"]')?.textContent || ''));
  await ogeyeKaydir(q, tid('ea-mesaj'), 12);
  await bekle(600);
  await cek(q, 'arama-mesaj');
  await K.ctx.close();
}

await browser.close();
await srv.close?.();
fs.rmSync(data, { recursive: true, force: true });
if (hatalar.length) console.log('Sayfa hataları:\n  ' + hatalar.join('\n  '));
console.log('Bitti →', OUT);
process.exit(0);
