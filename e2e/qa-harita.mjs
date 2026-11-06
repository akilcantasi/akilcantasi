// QA: Harita sekmesi + Pusula aracı (konum-check.mjs akışını da çalıştırır).
//   node e2e/qa-harita.mjs [base] [ekran-görüntüsü-klasörü] [harita-sorgusu]
//   node e2e/qa-harita.mjs http://localhost:5199/ /tmp/qa-harita
//   gerçek Türkiye haritası (bilgi noktası sunucusu, data/ içinde turkiye.pmtiles):
//   KONUM_START=39.9208,32.8541 node e2e/qa-harita.mjs http://localhost:8460/ /tmp/qa-harita-real ""
// Ek ortam değişkeni: QA_SKIP_KONUM=1 → konum-check.mjs akışını atla.
import { createRequire } from 'module';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const base = process.argv[2] ?? 'http://localhost:5199/';
const shots = process.argv[3] ?? '/tmp';
const mapQuery = process.argv[4] ?? 'devmap=/testdata/sample_ornek.pmtiles&devpoi=/testdata/sample_poi_ornek.geojson';
const realMap = mapQuery === '';
const [sLat, sLon] = (process.env.KONUM_START ?? '39.9105,32.7900').split(',').map(Number);
const START = { latitude: sLat, longitude: sLon };
const mapUrl = (extra = '') => base + '?tab=harita' + (mapQuery ? '&' + mapQuery : '') + extra;

const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const errors = [];
const browser = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function open(opts = {}, init) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ...opts });
  if (init) await ctx.addInitScript(init);
  ctx.setDefaultTimeout(90000); // yazılım GL + yüklü makinede yavaş olabilir
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => {
    // ERR_TUNNEL/ERR_INTERNET: Paketler sayfasının isteğe bağlı çevrimiçi kataloğu (test ortamında internet yok)
    if (m.type() === 'error' && !/favicon|ERR_TUNNEL_CONNECTION_FAILED|ERR_INTERNET_DISCONNECTED/.test(m.text())) errors.push('console: ' + m.text());
  });
  return { ctx, p };
}
/** Ekran görüntüsü: gerçek haritada yazılım GL yavaş; zaman aşımı testi düşürmez */
const shot = (p, file) => p.screenshot({ path: file, timeout: 90000 }).catch((e) => console.log('  (ekran görüntüsü alınamadı: ' + file + ')'));
const waitMap = async (p) => {
  await p.waitForSelector('[data-testid="map"] canvas', { timeout: 30000 });
  await p.waitForTimeout(1500);
};
/** Sayfa (app-main) taşıyor mu? */
const pageOverflow = (p) => p.evaluate(() => { const m = document.querySelector('.app-main'); return m.scrollHeight - m.clientHeight; });
/** Görünür etkileşimli öğelerden 44 px'ten küçük olanlar */
const smallTargets = (p, sel) =>
  p.$$eval(sel, (els) =>
    els
      .filter((e) => e.offsetParent !== null)
      .map((e) => { const r = e.getBoundingClientRect(); return { t: (e.dataset.testid || e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; })
      .filter((r) => r.h < 44 || r.w < 44),
  );

// ---------- 1) Paket yok: boş durum ve Araçlar → Paketler bağlantısı ----------
// (gerçek paket sunucusunda paketler hep bulunur; bu durum yalnızca dev sunucusunda)
if (!realMap) {
  const { ctx, p } = await open({ viewport: { width: 360, height: 640 } });
  await p.goto(base + '?tab=harita', { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-testid="map-get-packs"]', { timeout: 10000 });
  const txt = await p.textContent('.map-empty');
  check(txt.includes('Araçlar → Paketler') && !txt.includes('Paylaş sekmesinden'), 'paket yok: doğru yönlendirme metni');
  // Hazır paket listesiyle sayfa dikeyde kayabilir; yatay taşma olmamalı, konum düğmeleri ilk ekranda olmalı
  check(await p.evaluate(() => { const m = document.querySelector('.app-main'); return m.scrollWidth <= m.clientWidth; }), 'paket yok: 360 px yatay taşma yok');
  check(await p.$eval('[data-testid="map-saymyloc"]', (e) => e.getBoundingClientRect().bottom <= document.querySelector('.app-main').getBoundingClientRect().bottom), 'paket yok: "Konumumu söyle" ilk ekranda');
  await shot(p, shots + '/qa-harita-nopack-360.png');
  await p.click('[data-testid="map-get-packs"]');
  await p.waitForTimeout(800);
  const u = new URL(p.url());
  check(u.searchParams.get('tool') === 'paylas' || (await p.$('[data-testid="nav-araclar"][aria-current="page"], [data-testid="nav-araclar"].on')) !== null || (await p.textContent('body')).includes('Paket'), 'Paket ekle → Araçlar / Paketler ve paylaşım');
  await ctx.close();
}

// ---------- 2) Yalnızca nokta / yalnızca harita bildirimi ----------
if (!realMap) {
  for (const [q, want] of [
    ['devpoi=/testdata/sample_poi_ornek.geojson', 'Harita paketi yüklü değil'],
    ['devmap=/testdata/sample_ornek.pmtiles', 'Nokta paketi yüklü değil'],
  ]) {
    const { ctx, p } = await open();
    await p.goto(base + '?tab=harita&' + q, { waitUntil: 'networkidle' });
    await waitMap(p);
    check((await p.textContent('.map-notice')).includes(want), 'bildirim: ' + want);
    check(await p.isVisible('[data-testid="map-notice-packs"]'), 'bildirimde "Paket ekle" bağlantısı');
    if (q.startsWith('devmap')) check(await p.isDisabled('[data-testid="map-nearest"]'), 'nokta yokken "En yakın toplanma alanı" pasif');
    await ctx.close();
  }
}

// ---------- 3) Harita yükleme, yakınlaştırma, filtreler, nokta kartı, Su harfi ----------
{
  const { ctx, p } = await open({ geolocation: { ...START, accuracy: 8 }, permissions: ['geolocation', 'clipboard-read', 'clipboard-write'] });
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await waitMap(p);
  const z0 = await p.evaluate(() => window.__acMap?.getZoom());
  await p.click('.maplibregl-ctrl-zoom-in');
  await p.waitForTimeout(700);
  const z1 = await p.evaluate(() => window.__acMap?.getZoom());
  if (z0 != null) check(z1 > z0, `yakınlaştır düğmesi (${z0?.toFixed(1)} → ${z1?.toFixed(1)})`);
  check((await p.getAttribute('.maplibregl-ctrl-zoom-in', 'aria-label')) === 'Yakınlaştır', 'yakınlaştır düğmesi Türkçe etiket');
  await p.click('.maplibregl-ctrl-zoom-out');
  const markers = await p.$$('[data-testid="poi-marker"]');
  check(markers.length > 0, 'nokta işaretçileri: ' + markers.length);
  const suLetter = await p.$eval('[data-testid="poi-marker"][data-type="su"]', (e) => e.textContent).catch(() => null);
  if (suLetter != null) check(suLetter === 'Su', 'su noktası harfi Türkçe "Su": ' + suLetter);
  for (const f of ['toplanma', 'saglik', 'eczane', 'su', 'barinma']) {
    await p.click(`[data-testid="poi-filter"][data-filter="${f}"]`);
    await p.waitForTimeout(150);
    const vis = await p.$$eval('[data-testid="poi-marker"]', (els) => els.filter((e) => !e.classList.contains('hidden')).map((e) => e.dataset.type));
    check(vis.every((t) => t === f), `filtre ${f}: ${vis.length} nokta`);
  }
  await p.click('[data-testid="poi-filter"][data-filter="hepsi"]');
  // nokta kartı
  await p.click('[data-testid="map-locate"]');
  await p.waitForSelector('[data-testid="user-marker"]', { timeout: 10000 });
  await p.evaluate(() => document.querySelector('[data-testid="poi-marker"][data-type="toplanma"]')?.click());
  await p.waitForSelector('[data-testid="poi-card"]');
  check(/m|km/.test(await p.textContent('[data-testid="poi-dist"]')), 'nokta kartı: mesafe');
  await p.click('[data-testid="poi-direction"]');
  await p.waitForSelector('[data-testid="dir-text"]');
  check(/°$/.test((await p.textContent('[data-testid="dir-text"]')).trim()), 'yön paneli: derece');
  await p.click('[data-testid="map-dir-panel-close"]');
  await p.click('[data-testid="poi-card"] .poi-close');
  check(!(await p.isVisible('[data-testid="poi-card"]')), 'nokta kartı kapandı');

  // en yakın toplanma alanı
  await p.click('[data-testid="poi-filter"][data-filter="saglik"]');
  await p.click('[data-testid="map-nearest"]');
  await p.waitForSelector('[data-testid="poi-card"]');
  check((await p.getAttribute('[data-testid="poi-filter"][data-filter="toplanma"]', 'aria-pressed')) === 'true', 'en yakın: filtre toplanmaya geçti');
  check((await p.textContent('[data-testid="poi-card"] .label')).includes('Toplanma'), 'en yakın: toplanma alanı seçildi');

  // konumumu söyle: kopyala, SMS, DMS/ondalık
  await p.click('[data-testid="map-saymyloc"]');
  await p.waitForSelector('[data-testid="loc-decimal"]');
  const dec = (await p.textContent('[data-testid="loc-decimal"]')).trim();
  check(/^\d+\.\d{6}, \d+\.\d{6}$/.test(dec) && Math.abs(parseFloat(dec) - START.latitude) < 1e-5, 'ondalık koordinat: ' + dec);
  const dms = (await p.textContent('[data-testid="loc-dms"]')).trim();
  check(/° \d\d′ \d\d,\d″ K/.test(dms) && /″ D$/.test(dms), 'DMS: ' + dms);
  await p.click('[data-testid="loc-copy"]');
  await p.waitForTimeout(300);
  check((await p.textContent('[data-testid="loc-copy"]')).trim() === 'Kopyalandı', 'kopyala düğmesi geri bildirimi');
  const clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
  check(clip.includes(dec.replace(' ', '')), 'panoya ondalık koordinat kopyalandı: ' + clip);
  const sms = decodeURIComponent(await p.getAttribute('[data-testid="loc-sms"]', 'href'));
  check(sms.startsWith('sms:') && sms.includes(dec.replace(' ', '')), 'SMS bağlantısı koordinat içeriyor');
  await shot(p, shots + '/qa-harita-konum.png');
  await p.click('[data-testid="map-loc-panel-close"]');
  check(await p.isVisible('[data-testid="map-panels"]'), 'kart alanı mevcut');
  await ctx.close();
}

// ---------- 4) Konum izni yok / konum alınamıyor ----------
{
  const { ctx, p } = await open(); // izin verilmedi
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await waitMap(p);
  await p.click('[data-testid="map-locate"]');
  await p.waitForSelector('[data-testid="loc-msg"].bad', { timeout: 10000 });
  check((await p.textContent('[data-testid="loc-msg"]')).includes('izni verilmedi'), 'izin reddi mesajı');
  await p.click('[data-testid="map-saymyloc"]');
  check((await p.textContent('[data-testid="map-loc-panel"]')).includes('izni verilmedi'), 'konumumu söyle: izin reddi');
  check(await p.isEnabled('[data-testid="map-loc-panel"] .btn.primary'), 'konumumu söyle: tekrar dene düğmesi');
  await p.keyboard.press('Escape');
  await p.click('[data-testid="map-track"]');
  await p.click('[data-testid="track-start"]');
  await p.waitForSelector('[data-testid="track-error"]', { timeout: 5000 });
  check((await p.textContent('[data-testid="track-error"]')).includes('izni'), 'iz kaydı: izin reddi mesajı');
  await p.click('[data-testid="track-stop"]');
  await shot(p, shots + '/qa-harita-denied.png');
  await ctx.close();
}
{
  const { ctx, p } = await open({}, () => {
    const err = (cb) => setTimeout(() => cb && cb({ code: 2, message: 'unavailable', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }), 100);
    navigator.geolocation.watchPosition = (ok, bad) => (err(bad), 1);
    navigator.geolocation.getCurrentPosition = (ok, bad) => err(bad);
    navigator.geolocation.clearWatch = () => {};
  });
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await waitMap(p);
  await p.click('[data-testid="map-nearest"]');
  await p.waitForSelector('[data-testid="loc-msg"].bad', { timeout: 10000 });
  check((await p.textContent('[data-testid="loc-msg"]')).includes('GPS'), 'konum alınamadı mesajı');
  check(await p.isVisible('[data-testid="poi-card"]'), 'konum yokken harita merkezine en yakın toplanma alanı');
  check((await p.textContent('[data-testid="poi-dist"]')).includes('Konum bilinmiyor'), 'nokta kartı: konum bilinmiyor');
  check(!(await p.isVisible('.map-toast')) || !(await p.textContent('.map-toast')).includes('Konum aranıyor'), 'hata sonrası "konum aranıyor" bildirimi kalkıyor');
  await ctx.close();
}

// ---------- 5) Yer işareti düzenleme + haritada dokununca listede öne çıkma ----------
{
  const { ctx, p } = await open({ geolocation: { ...START, accuracy: 6 }, permissions: ['geolocation'] });
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.removeItem('ac.map.waypoints.v1'); localStorage.removeItem('ac.map.nav.v1'); localStorage.removeItem('ac.map.track.v1'); });
  await p.reload({ waitUntil: 'networkidle' });
  await waitMap(p);
  await p.click('[data-testid="map-locate"]');
  await p.waitForSelector('[data-testid="user-marker"]');
  await p.click('[data-testid="map-waypoints"]');
  await p.click('[data-testid="wp-add"]');
  check((await p.$$('[data-testid="wp-src-loc"]')).length === 1, 'ekleme formunda konum kaynağı');
  await p.click('[data-testid="wp-save"]'); // ad boş → tür adı
  await p.waitForSelector('[data-testid="wp-item"]');
  check((await p.textContent('[data-testid="wp-item"] .wp-name')).trim() === 'Çadır', 'boş ad → "Çadır"');
  await p.click('[data-testid="wp-goto"]');
  await p.waitForSelector('[data-testid="nav-card"]');
  await p.click('[data-testid="map-waypoints"]');
  await p.click('[data-testid="wp-edit"]');
  await p.waitForSelector('[data-testid="wp-form"][data-mode="edit"]');
  check((await p.inputValue('[data-testid="wp-name"]')) === 'Çadır', 'düzenleme formu dolu');
  check((await p.$$('[data-testid="wp-src-loc"]')).length === 0, 'düzenlemede konum değişmiyor');
  await p.fill('[data-testid="wp-name"]', 'Mavi çadır');
  await p.click('[data-testid="wp-type"][data-type="bulusma"]');
  await p.click('[data-testid="wp-save"]');
  await p.waitForSelector('[data-testid="wp-msg"]');
  check((await p.textContent('[data-testid="wp-msg"]')).includes('güncellendi'), 'düzenleme kaydedildi');
  check((await p.textContent('[data-testid="wp-item"] .wp-meta')).includes('Buluşma'), 'tür güncellendi');
  await p.click('[data-testid="wp-sheet-close"]');
  check((await p.textContent('[data-testid="nav-name"]')).includes('Mavi çadır'), 'hedef kartı yeni adı gösteriyor');
  check((await p.getAttribute('[data-testid="wp-marker"]', 'aria-label')).includes('Buluşma noktası: Mavi çadır'), 'haritadaki işaretçi güncellendi');
  await p.reload({ waitUntil: 'networkidle' });
  await waitMap(p);
  check((await p.getAttribute('[data-testid="wp-marker"]', 'aria-label')).includes('Mavi çadır'), 'düzenleme yenilemeden sonra kalıcı');
  await p.evaluate(() => document.querySelector('[data-testid="wp-marker"]').click());
  await p.waitForSelector('[data-testid="wp-item"].focus');
  check(true, 'haritadaki yer işaretine dokununca listede öne çıkıyor');
  await shot(p, shots + '/qa-harita-wp-focus.png');
  await p.click('[data-testid="wp-sheet-close"]');
  await p.click('[data-testid="nav-end"]');
  await ctx.close();
}

// ---------- 6) Düzen: 360×640'ta hedef + iz kartları açıkken sayfa kaymaz ----------
for (const vp of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 800 }]) {
  const { ctx, p } = await open({ viewport: vp, deviceScaleFactor: 1, geolocation: { ...START, accuracy: 6 }, permissions: ['geolocation'] });
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.removeItem('ac.map.track.v1'); localStorage.removeItem('ac.map.nav.v1'); });
  await p.reload({ waitUntil: 'networkidle' });
  await waitMap(p);
  check((await pageOverflow(p)) <= 0, `${vp.width}×${vp.height}: temel görünüm taşmıyor`);
  await p.click('[data-testid="map-locate"]');
  await p.click('[data-testid="map-track"]');
  await p.click('[data-testid="track-start"]');
  for (let i = 0; i < 6; i++) {
    await ctx.setGeolocation({ latitude: START.latitude + i * 0.0001, longitude: START.longitude, accuracy: 5 });
    await p.waitForTimeout(250);
  }
  await p.click('[data-testid="track-goback"]');
  await p.waitForSelector('[data-testid="nav-card"]');
  await p.click('[data-testid="map-nearest"]');
  await p.waitForSelector('[data-testid="poi-card"]');
  await p.waitForTimeout(500);
  const ov = await pageOverflow(p);
  const mapH = await p.$eval('[data-testid="map"]', (e) => e.getBoundingClientRect().height);
  check(ov <= 0, `${vp.width}×${vp.height}: nokta + hedef + iz kartları açıkken sayfa kaymıyor (taşma ${ov})`);
  check(mapH >= 140, `${vp.width}×${vp.height}: harita görünür kalıyor (${Math.round(mapH)} px)`);
  const actions = await p.$eval('[data-testid="map-waypoints"]', (e) => { const r = e.getBoundingClientRect(); return r.bottom <= document.querySelector('.app-main').getBoundingClientRect().bottom + 1; });
  check(actions, `${vp.width}×${vp.height}: alt düğmeler ekranda`);
  const small = await smallTargets(p, '.harita .btn, .harita .chip, .map-fab, .poi-close, .rec-badge, .maplibregl-ctrl-group button');
  check(small.length === 0, `${vp.width}×${vp.height}: dokunma hedefleri ≥ 44 px` + (small.length ? ' ' + JSON.stringify(small) : ''));
  await shot(p, `${shots}/qa-harita-panels-${vp.width}.png`);
  // iz kartı kaydırma alanında görünür hale getirilebiliyor
  await p.$eval('[data-testid="track-stop"]', (e) => e.scrollIntoView({ block: 'nearest' }));
  await p.click('[data-testid="track-stop"]');
  check((await p.textContent('[data-testid="track-status"]')).includes('durdu'), `${vp.width}: kart alanında iz durduruldu`);
  await p.click('[data-testid="track-continue"]');
  check((await p.textContent('[data-testid="track-status"]')).includes('kaydediliyor'), `${vp.width}: kayda devam`);
  await p.click('[data-testid="track-stop"]');
  // Yer işaretleri sayfası 360'ta taşmasın
  await p.click('[data-testid="nav-end"]');
  await p.click('[data-testid="map-waypoints"]');
  await p.click('[data-testid="wp-add"]');
  await p.click('[data-testid="wp-save"]');
  await p.waitForSelector('[data-testid="wp-item"]');
  const wpOverflow = await p.$eval('[data-testid="wp-sheet"]', (e) => e.scrollWidth - e.clientWidth);
  check(wpOverflow <= 0, `${vp.width}: yer işareti sayfası yatay taşmıyor`);
  await shot(p, `${shots}/qa-harita-wp-${vp.width}.png`);
  await p.evaluate(() => { localStorage.removeItem('ac.map.track.v1'); localStorage.removeItem('ac.map.waypoints.v1'); localStorage.removeItem('ac.map.nav.v1'); });
  await ctx.close();
}

// ---------- 7) Düşük güç: piksel oranı 1, tek seferlik konum ----------
{
  const { ctx, p } = await open({ geolocation: { ...START, accuracy: 6 }, permissions: ['geolocation'] }, () => {
    if (!sessionStorage.getItem('qaInit')) {
      localStorage.setItem('ac.settings', JSON.stringify({ lowPower: true }));
      sessionStorage.setItem('qaInit', '1');
    }
    window.__geo = { watch: 0, once: 0 };
    const g = navigator.geolocation;
    const w = g.watchPosition.bind(g);
    const o = g.getCurrentPosition.bind(g);
    g.watchPosition = (...a) => { window.__geo.watch++; return w(...a); };
    g.getCurrentPosition = (...a) => { window.__geo.once++; return o(...a); };
  });
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await waitMap(p);
  const r = await p.$eval('[data-testid="map"] canvas', (c) => c.width / c.clientWidth);
  check(Math.abs(r - 1) < 0.01, 'düşük güç: harita piksel oranı 1 (' + r + ')');
  await p.click('[data-testid="map-locate"]');
  await p.waitForSelector('[data-testid="user-marker"]', { timeout: 10000 });
  const g = await p.evaluate(() => window.__geo);
  check(g.once >= 1 && g.watch === 0, 'düşük güç: tek seferlik konum ' + JSON.stringify(g));
  // Ayarlar'dan kapatılınca harita yeniden 2x çizer, konum sürekli izlenir
  await p.goto(base + '?tool=ayarlar', { waitUntil: 'networkidle' });
  check((await p.getAttribute('[data-testid="set-lowpower"]', 'aria-checked')) === 'true', 'Ayarlar: düşük güç açık görünüyor');
  await p.click('[data-testid="set-lowpower"]');
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await waitMap(p);
  const r2 = await p.$eval('[data-testid="map"] canvas', (c) => c.width / c.clientWidth);
  check(Math.abs(r2 - 2) < 0.01, 'düşük güç kapatıldı: piksel oranı 2 (' + r2 + ')');
  await p.click('[data-testid="map-locate"]');
  await p.waitForTimeout(500);
  const g2 = await p.evaluate(() => window.__geo);
  check(g2.watch >= 1, 'düşük güç kapalı: sürekli konum takibi ' + JSON.stringify(g2));
  await ctx.close();
}

// ---------- 9) Denetim 2026-11 ----------
// 9a) Paket yokken hazır harita ve nokta paketleri doğrudan Harita sekmesinden iner
if (!realMap) {
  const fs = await import('fs');
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
  const sample = fs.readFileSync(path.join(root, 'testdata/sample_ornek.pmtiles'));
  const crypto = await import('crypto');
  const man = JSON.parse(fs.readFileSync(path.join(root, 'public/packs-manifest.json'), 'utf8'));
  const genel = man.packs.find((x) => x.id === 'harita-tr-genel');
  const realSize = genel.size;
  // Katalogdaki genel harita yerine küçük örnek dosya (aynı ad, kendi boyutu ve özeti)
  Object.assign(genel, { size: sample.length, sha256: crypto.createHash('sha256').update(sample).digest('hex') });
  const { ctx, p } = await open({ viewport: { width: 390, height: 844 } });
  const ext = [];
  await ctx.route('**/packs-manifest.json', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(man) }));
  await ctx.route(/huggingface\.co\/.*turkiye-genel-z10\.pmtiles/, (r) => r.fulfill({ status: 200, headers: { 'content-length': String(sample.length), 'access-control-allow-origin': '*' }, body: sample }));
  p.on('request', (r) => { if (!/^https?:\/\/(127\.0\.0\.1|localhost)/.test(r.url()) && !/^(data|blob):/.test(r.url())) ext.push(r.url()); });
  await p.goto(base + '?tab=harita', { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-testid="map-ready-packs"] [data-testid="pack-row"]', { timeout: 15000 });
  const rows = await p.$$eval('[data-testid="map-ready-packs"] [data-testid="pack-row"]', (els) => els.map((e) => [e.dataset.pack, e.querySelector('.tag')?.textContent, !!e.querySelector('[data-testid="pack-download"]')]));
  check(rows.length === 3, 'hazır paketler: 2 harita + 1 nokta paketi listelenir ' + JSON.stringify(rows));
  check(rows.every((r) => r[2]), 'hazır paketler: her satırda "İndir"');
  check(rows.some((r) => r[0] === 'turkiye.pmtiles' && /MB|GB/.test(r[1])) && rows.some((r) => r[0] === 'turkiye-afet-noktalari.geojson' && /MB/.test(r[1])), 'hazır paketler: boyutlar gösterilir');
  await shot(p, shots + '/qa-harita-hazir-paketler.png');
  await p.click('[data-testid="map-ready-packs"] [data-pack="turkiye-genel-z10.pmtiles"] [data-testid="pack-download"]');
  await p.waitForSelector('[data-testid="map"] canvas', { timeout: 60000 });
  check(true, 'hazır harita indirildi → harita kendiliğinden açıldı');
  check((await p.textContent('.map-notice')).includes('Nokta paketi yüklü değil'), 'harita var, nokta yok: bildirim');
  check(realSize > sample.length, 'katalog boyutu örnek dosyadan büyük (sahte veriyle test)');
  // 9f) Harita kullanımında dış ağa istek yok (katalog tazeleme ve yönlendirilmiş indirme hariç)
  await p.click('.maplibregl-ctrl-zoom-in');
  await p.waitForTimeout(800);
  const extMap = ext.filter((u) => !/packs-manifest\.json|turkiye-genel-z10\.pmtiles/.test(u));
  check(extMap.length === 0, 'harita dış ağa istek yapmıyor ' + extMap.slice(0, 3).join(' '));
  await ctx.close();
}

// 9b) Sekme değişimi: harita kaynağı ve harita tuvali birikmez; 9c) yön değişimi; 9d) seçilen nokta ortada
{
  const { ctx, p } = await open({ geolocation: { ...START, accuracy: 8 }, permissions: ['geolocation'] });
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await waitMap(p);
  const count0 = await p.evaluate(async () => (await import('/src/lib/map/pmtilesSource.ts')).pmtilesSourceCount());
  for (let i = 0; i < 4; i++) {
    await p.click('[data-testid="nav-rehber"]');
    await p.waitForSelector('[data-testid="guide-search"]');
    await p.click('[data-testid="nav-harita"]');
    await waitMap(p);
  }
  const count1 = await p.evaluate(async () => (await import('/src/lib/map/pmtilesSource.ts')).pmtilesSourceCount());
  if (!realMap) check(count1 === count0 && count1 <= 1, `sekme değişimi: harita kaynağı birikmiyor (${count0} → ${count1})`);
  check((await p.$$('.maplibregl-canvas')).length === 1, 'sekme değişimi: tek harita tuvali');
  // Başka bir paketin indirmesi bitince (paket listesi değişti) harita yeniden kurulmaz
  await p.evaluate(() => { window.__acMap.__qaIsaret = 1; });
  await p.evaluate(async () => (await import('/src/lib/packs.ts')).invalidatePacks());
  await p.waitForTimeout(1500);
  check(await p.evaluate(() => window.__acMap?.__qaIsaret === 1), 'paket listesi değişince harita yeniden kurulmuyor');
  // seçilen nokta, kart açılıp harita küçüldükten sonra ortada
  await p.evaluate(() => document.querySelectorAll('[data-testid="poi-marker"][data-type="toplanma"]')[1]?.click());
  await p.waitForSelector('[data-testid="poi-card"]');
  await p.waitForTimeout(1200);
  const off = await p.evaluate(() => {
    const m = document.querySelector('[data-testid="map"]').getBoundingClientRect();
    const s = document.querySelector('.poi-mk.sel')?.getBoundingClientRect();
    return s ? Math.hypot(s.x + s.width / 2 - (m.x + m.width / 2), s.y + s.height / 2 - (m.y + m.height / 2)) : -1;
  });
  if (!realMap) check(off >= 0 && off < 12, `seçilen nokta kart açıldıktan sonra haritanın ortasında (${Math.round(off)} px)`);
  // yatay ↔ dikey
  await p.setViewportSize({ width: 844, height: 390 });
  await p.waitForTimeout(800);
  const land = await p.evaluate(() => {
    const c = document.querySelector('[data-testid="map"] canvas');
    const w = document.querySelector('[data-testid="map"]');
    const m = document.querySelector('.app-main');
    return { dw: Math.abs(c.clientWidth - w.clientWidth), dh: Math.abs(c.clientHeight - w.clientHeight), hx: m.scrollWidth - m.clientWidth };
  });
  check(land.dw <= 1 && land.dh <= 1 && land.hx <= 0, 'yatay ekran: harita tuvali kutuya uyuyor, yatay taşma yok ' + JSON.stringify(land));
  const cardH = await p.$eval('[data-testid="poi-card"]', (e) => { e.scrollIntoView({ block: 'nearest' }); return Math.min(e.getBoundingClientRect().height, e.closest('.map-panels').getBoundingClientRect().height); });
  check(cardH > 100, `yatay ekran: seçili nokta kartı görünür (${Math.round(cardH)} px)`);
  await shot(p, shots + '/qa-harita-yatay.png');
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(600);
  const port = await p.$eval('[data-testid="map"] canvas', (c) => Math.abs(c.clientWidth - c.parentElement.parentElement.clientWidth));
  check(port <= 1, 'dikeye dönüş: harita tuvali yeniden boyutlandı');
  // kayıt göstergesi kırmızı değil (Şafak: kırmızı yalnız SOS/112)
  await p.click('[data-testid="map-track"]');
  await p.click('[data-testid="track-start"]');
  const recColor = await p.$eval('[data-testid="track-badge"] .rec-dot', (e) => getComputedStyle(e).backgroundColor);
  check(recColor === 'rgb(245, 165, 36)', 'iz kaydı göstergesi kehribar: ' + recColor);
  await p.click('[data-testid="track-stop"]');
  await p.evaluate(() => { localStorage.removeItem('ac.map.track.v1'); localStorage.removeItem('ac.map.nav.v1'); });
  await ctx.close();
}

// 9e) En büyük yazı 360×640: yatay taşma yok, nokta kartının düğmeleri görünür
{
  const { ctx, p } = await open({ viewport: { width: 360, height: 640 }, geolocation: { ...START, accuracy: 8 }, permissions: ['geolocation'] }, () => {
    localStorage.setItem('ac.settings', JSON.stringify({ textSize: 3 }));
  });
  await p.goto(mapUrl(), { waitUntil: 'networkidle' });
  await waitMap(p);
  check(await p.evaluate(() => { const m = document.querySelector('.app-main'); return m.scrollWidth <= m.clientWidth; }), 'en büyük yazı: çip satırı yatay taşma yapmıyor');
  await p.evaluate(() => document.querySelector('[data-testid="poi-marker"][data-type="toplanma"]')?.click());
  await p.waitForSelector('[data-testid="poi-direction"]');
  await p.waitForTimeout(700);
  const vis = await p.$eval('[data-testid="poi-direction"]', (e) => {
    const r = e.getBoundingClientRect();
    const panel = e.closest('.map-panels').getBoundingClientRect();
    return r.bottom <= panel.bottom + 1 && r.height >= 44;
  });
  check(vis, 'en büyük yazı: "Yön göster" kart alanında kırpılmıyor');
  await shot(p, shots + '/qa-harita-buyuk-yazi.png');
  await ctx.close();
}

await browser.close();
check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ':\n  ' + errors.join('\n  ') : ''));

// ---------- 8) Konum akışı: pusula (iOS / sensörsüz / hedef), iz, yer işaretleri, koni ----------
if (!process.env.QA_SKIP_KONUM) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const r = spawnSync(process.execPath, [path.join(here, 'konum-check.mjs'), base, shots, mapQuery], { stdio: 'inherit', env: process.env });
  check(r.status === 0, 'konum-check.mjs akışı');
}

console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
