// Konum ve yön akışı: pusula aracı, iz kaydı, yer işaretleri, başlangıca dönüş.
// Konum ve yön sensörü Playwright ile taklit edilir.
//   node e2e/konum-check.mjs [base] [ekran-görüntüsü-klasörü] [harita-sorgusu]
//   node e2e/konum-check.mjs http://localhost:5199/ /tmp
//   node e2e/konum-check.mjs http://localhost:8097/ /tmp ""      (gerçek paket: sunucu /api/packs)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const base = process.argv[2] ?? 'http://localhost:5199/';
const shots = process.argv[3] ?? '/tmp';
const mapQuery = process.argv[4] ?? 'devmap=/testdata/sample_ornek.pmtiles&devpoi=/testdata/sample_poi_ornek.geojson';
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const errors = [];

// Başlangıç noktası: KONUM_START="lat,lon" ile değiştirilebilir (gerçek haritada karada bir yer seçin)
const [sLat, sLon] = (process.env.KONUM_START ?? '39.9105,32.7900').split(',').map(Number);
const START = { latitude: sLat, longitude: sLon };
const M = 1 / 111195; // 1 m enlem (derece)
const mLon = (lat) => 1 / (111195 * Math.cos((lat * Math.PI) / 180));

const browser = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

// Yön sensörü taklidi: window.__setHeading(derece) Android'deki gibi deviceorientationabsolute gönderir
const orientationMock = () => {
  window.__heading = null;
  window.__setHeading = (h) => { window.__heading = h; };
  setInterval(() => {
    if (window.__heading == null) return;
    const e = new Event('deviceorientationabsolute');
    Object.assign(e, { alpha: (360 - window.__heading) % 360, beta: 5, gamma: 2, absolute: true });
    window.dispatchEvent(e);
  }, 50);
};

async function newPage(ctx) {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => {
    if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push('console: ' + m.text());
  });
  return p;
}

// ---------- 1) Pusula: sensör yok (masaüstü) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await newPage(ctx);
  await p.goto(base + '?tool=pusula', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3800);
  const st = await p.getAttribute('[data-testid="compass-status"]', 'data-status');
  check(st === 'no-sensor', 'sensörsüz cihazda "pusula yok" mesajı (' + st + ')');
  await p.fill('[data-testid="target-coord-input"]', 'merhaba');
  await p.click('[data-testid="target-coord-set"]');
  check(await p.isVisible('[data-testid="target-coord-err"]'), 'geçersiz koordinat hatası');
  await p.screenshot({ path: shots + '/konum-pusula-nosensor.png', fullPage: true });
  await ctx.close();
}

// ---------- 1b) Pusula: iOS izin akışı (webkitCompassHeading) ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  await ctx.addInitScript(() => {
    window.__asked = 0;
    DeviceOrientationEvent.requestPermission = async () => {
      window.__asked++;
      setInterval(() => {
        const e = new Event('deviceorientation');
        Object.assign(e, { alpha: 10, beta: 80, gamma: 0, webkitCompassHeading: 270, webkitCompassAccuracy: 40 });
        window.dispatchEvent(e);
      }, 50);
      return 'granted';
    };
  });
  const p = await newPage(ctx);
  await p.goto(base + '?tool=pusula', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3800);
  check((await p.getAttribute('[data-testid="compass-status"]', 'data-status')) === 'needs-permission', 'iOS: izin düğmesi bekliyor');
  await p.click('[data-testid="compass-permission"]');
  await p.waitForSelector('[data-testid="compass-heading"]', { timeout: 5000 });
  await p.waitForTimeout(1200);
  check((await p.textContent('[data-testid="compass-heading"]')).trim() === '270°B', 'iOS: webkitCompassHeading 270° B');
  check(!(await p.isVisible('[data-testid="compass-tilt"]')), 'iOS: eğim düzeltmeli, uyarı yok');
  check((await p.textContent('[data-testid="compass-calibration"]')).includes('doğruluğu düşük'), 'iOS: kalibrasyon uyarısı (± 40°)');
  await p.screenshot({ path: shots + '/konum-pusula-ios.png', fullPage: true });
  await ctx.close();
}

// ---------- 2) Pusula: sensör + konum + hedef ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    geolocation: { ...START, accuracy: 6 },
    permissions: ['geolocation'],
  });
  await ctx.addInitScript(orientationMock);
  const p = await newPage(ctx);
  await p.goto(base + '?tool=pusula', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.__setHeading(45));
  await p.waitForSelector('[data-testid="compass-heading"]', { timeout: 5000 });
  await p.waitForTimeout(1500); // yumuşatma otursun
  const h = (await p.textContent('[data-testid="compass-heading"]')).trim();
  check(/^4[4-6]°KD$/.test(h), 'baş açısı 45° KD: ' + h);
  // hedef: 500 m doğu
  const tgt = { lat: START.latitude, lon: START.longitude + 500 * mLon(START.latitude) };
  await p.fill('[data-testid="target-coord-input"]', `${tgt.lat.toFixed(6)}, ${tgt.lon.toFixed(6)}`);
  await p.click('[data-testid="target-coord-set"]');
  await p.waitForSelector('[data-testid="target-distance"]', { timeout: 8000 });
  const d = (await p.textContent('[data-testid="target-distance"]')).trim();
  check(d === '500 m', 'hedef mesafesi 500 m: ' + d);
  const b = (await p.textContent('[data-testid="target-bearing"]')).trim();
  check(/^D · (89|90)°$/.test(b), 'hedef yönü doğu: ' + b);
  const rot = Number(await p.getAttribute('[data-testid="target-arrow"]', 'data-rot'));
  check(Math.abs(rot - 45) < 3, 'ok telefona göre 45° sağda: ' + rot);
  check((await p.textContent('[data-testid="target-turn"]')).includes('Hafif sağa'), 'dönüş ipucu');
  await p.screenshot({ path: shots + '/konum-pusula.png', fullPage: true });
  // DMS ile giriş
  await p.click('[data-testid="target-clear"]');
  const dms = (v, h) => { const d = Math.floor(v); const m = Math.floor((v - d) * 60); const sec = ((v - d - m / 60) * 3600).toFixed(1).replace('.', ','); return `${d}° ${m}′ ${sec}″ ${h}`; };
  await p.fill('[data-testid="target-coord-input"]', `${dms(START.latitude, 'K')} ${dms(START.longitude, 'D')}`);
  await p.click('[data-testid="target-coord-set"]');
  await p.waitForSelector('[data-testid="target-distance"]');
  const d2 = (await p.textContent('[data-testid="target-distance"]')).trim();
  check(/^\d+ m$/.test(d2) && parseInt(d2) < 20, 'DMS girişi çözüldü (≈ aynı nokta): ' + d2);
  await p.click('[data-testid="target-clear"]');
  await ctx.close();
}

// ---------- 3) Harita: iz kaydı, yer işaretleri, koni, başlangıca dönüş ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    geolocation: { ...START, accuracy: 6 },
    permissions: ['geolocation'],
  });
  await ctx.addInitScript(orientationMock);
  const p = await newPage(ctx);
  const mapUrl = base + '?tab=harita' + (mapQuery ? '&' + mapQuery : '');
  await p.goto(mapUrl, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-testid="map"] canvas', { timeout: 20000 });
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.__setHeading(30));
  await p.click('[data-testid="map-locate"]');
  await p.waitForSelector('[data-testid="user-marker"]', { timeout: 8000 });
  await p.waitForTimeout(800);
  const cone = await p.$eval('[data-testid="heading-cone"]', (e) => ({ d: getComputedStyle(e).display, t: e.style.transform }));
  check(cone.d !== 'none' && /rotate\((2[89]|3[0-2])/.test(cone.t), 'konum noktasında yön konisi: ' + cone.t);

  // su filtresi
  await p.click('[data-testid="poi-filter"][data-filter="su"]');
  await p
    .waitForFunction(() => [...document.querySelectorAll('[data-testid="poi-marker"]')].every((e) => e.classList.contains('hidden') || e.dataset.type === 'su'), null, { timeout: 5000 })
    .catch(() => {});
  const vis = await p.$$eval('[data-testid="poi-marker"]', (els) => els.filter((e) => !e.classList.contains('hidden')).map((e) => e.dataset.type));
  const pressed = await p.getAttribute('[data-testid="poi-filter"][data-filter="su"]', 'aria-pressed');
  check(vis.length > 0 && vis.every((t) => t === 'su'), `su filtresi: ${vis.length} nokta (seçili: ${pressed})`);
  await p.click('[data-testid="poi-filter"][data-filter="hepsi"]');

  // iz kaydı başlat ve yürü: 200 m kuzey, 150 m doğu (8 m adımlarla) + gürültü
  await p.click('[data-testid="map-track"]');
  await p.click('[data-testid="track-start"]');
  await p.waitForTimeout(500);
  const walk = [];
  for (let i = 0; i <= 25; i++) walk.push({ latitude: START.latitude + i * 8 * M, longitude: START.longitude, accuracy: 5 });
  const top = walk[walk.length - 1];
  for (let i = 1; i <= 19; i++) walk.push({ latitude: top.latitude, longitude: top.longitude + i * 8 * mLon(top.latitude), accuracy: 5 });
  // kötü doğruluklu ve sıçrayan noktalar araya
  walk.splice(10, 0, { latitude: START.latitude + 2000 * M, longitude: START.longitude, accuracy: 5 });
  walk.splice(20, 0, { latitude: START.latitude + 150 * M, longitude: START.longitude + 0.01, accuracy: 120 });
  for (const w of walk) {
    await ctx.setGeolocation(w);
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(600);
  const pts = Number((await p.textContent('[data-testid="track-points"]')).trim());
  const dist = (await p.textContent('[data-testid="track-distance"]')).trim();
  // yüklü makinede/gerçek haritada tarayıcı bazı konum güncellemelerini birleştirebilir: alt sınır esnek
  check(pts >= 34 && pts <= 46, 'iz noktaları süzüldü: ' + pts);
  check(/^3[4-6]0 m$/.test(dist), 'iz mesafesi ≈ 350 m: ' + dist);
  check(await p.isVisible('[data-testid="track-badge"]'), 'kayıt rozeti haritada');

  // yer işareti: konumdan (su)
  await p.click('[data-testid="map-waypoints"]');
  await p.waitForSelector('[data-testid="wp-empty"]');
  await p.click('[data-testid="wp-add"]');
  await p.fill('[data-testid="wp-name"]', 'Kaynak suyu');
  await p.click('[data-testid="wp-type"][data-type="su"]');
  await p.click('[data-testid="wp-src-loc"]');
  await p.click('[data-testid="wp-save"]');
  await p.waitForSelector('[data-testid="wp-item"]');
  await p.click('[data-testid="wp-sheet-close"]');
  // yer işareti: sağ tık (uzun basma yerine) ile haritadan, çadır
  const box = await p.$eval('[data-testid="map"]', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  // rozetin (sol alt) ve konum düğmesinin (sağ üst) dışında boş bir nokta
  await p.mouse.click(box.x + box.w * 0.3, box.y + box.h * 0.4, { button: "right" });
  await p.waitForSelector('[data-testid="wp-form"]');
  check(await p.isVisible('[data-testid="wp-src-picked"]'), 'uzun basma/sağ tık noktası seçili');
  await p.click('[data-testid="wp-type"][data-type="cadir"]');
  await p.click('[data-testid="wp-save"]');
  await p.waitForSelector('[data-testid="wp-msg"]');
  // üçüncüsü: harita merkezi, tehlike
  await p.click('[data-testid="wp-add"]');
  await p.fill('[data-testid="wp-name"]', 'Yıkık duvar');
  await p.click('[data-testid="wp-type"][data-type="tehlike"]');
  await p.click('[data-testid="wp-src-center"]');
  await p.click('[data-testid="wp-save"]');
  await p.waitForTimeout(300);
  check((await p.$$('[data-testid="wp-item"]')).length === 3, '3 yer işareti listede');
  // paylaş
  await p.click('[data-testid="wp-item"]:has-text("Kaynak suyu") [data-testid="wp-share-toggle"]');
  const dec = (await p.textContent('[data-testid="wp-share-decimal"]')).trim();
  check(dec.startsWith(START.latitude.toFixed(2)) && /^-?\d+\.\d{6}, -?\d+\.\d{6}$/.test(dec), 'paylaşım ondalık: ' + dec);
  check((await p.textContent('[data-testid="wp-share-dms"]')).includes('″ K'), 'paylaşım DMS');
  const sms = await p.getAttribute('[data-testid="wp-share-sms"]', 'href');
  check(sms.startsWith('sms:?&body=') && decodeURIComponent(sms).includes('Su: Kaynak suyu'), 'SMS bağlantısı');
  await p.screenshot({ path: shots + '/konum-wp-sheet.png' });
  // sil (satır içi onay)
  await p.click('[data-testid="wp-item"]:has-text("Yıkık duvar") [data-testid="wp-delete"]');
  await p.click('[data-testid="wp-delete-confirm"]');
  await p.waitForTimeout(200);
  check((await p.$$('[data-testid="wp-item"]')).length === 2, 'silindi');
  await p.click('[data-testid="wp-sheet-close"]');
  check((await p.$$('[data-testid="wp-marker"]')).length === 2, 'haritada 2 yer işareti');

  // ---- yenile: iz ve işaretler kalıcı, kayıt sürüyor ----
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector('[data-testid="map"] canvas', { timeout: 20000 });
  await p.evaluate(() => window.__setHeading(200));
  await p.waitForTimeout(1500);
  check(await p.isVisible('[data-testid="track-badge"]'), 'yenilemeden sonra kayıt sürüyor');
  await p.click('[data-testid="map-track"]');
  const pts2 = Number((await p.textContent('[data-testid="track-points"]')).trim());
  check(pts2 >= pts, `yenilemeden sonra iz korunuyor (${pts2})`);
  check((await p.$$('[data-testid="wp-marker"]')).length === 2, 'yenilemeden sonra yer işaretleri');

  // biraz daha yürü (doğu), sonra durdur
  for (let i = 20; i <= 24; i++) {
    await ctx.setGeolocation({ latitude: top.latitude, longitude: top.longitude + i * 8 * mLon(top.latitude), accuracy: 5 });
    await p.waitForTimeout(250);
  }
  await p.click('[data-testid="track-stop"]');
  check((await p.textContent('[data-testid="track-status"]')).includes('durdu'), 'kayıt durdu');

  // başlangıca dön
  await p.click('[data-testid="track-goback"]');
  await p.waitForSelector('[data-testid="nav-card"]');
  check((await p.getAttribute('[data-testid="nav-mode-track"]', 'aria-pressed')) === 'true', 'iz boyunca varsayılan');
  const along = (await p.textContent('[data-testid="nav-distance"]')).trim();
  check(/^(3[89]0|4[0-2]0) m$/.test(along), 'iz boyunca başlangıca ≈ 390 m: ' + along);
  const nb = (await p.textContent('[data-testid="nav-bearing"]')).trim();
  check(nb.startsWith('B '), 'iz boyunca önce batıya: ' + nb);
  await p.click('[data-testid="nav-mode-straight"]');
  const straight = (await p.textContent('[data-testid="nav-distance"]')).trim();
  const sb = (await p.textContent('[data-testid="nav-bearing"]')).trim();
  check(/^2[89]0 m$/.test(straight) && sb.startsWith('GB'), `kuş uçuşu: ${straight} ${sb}`);
  await p.click('[data-testid="nav-mode-track"]');
  await p.click('[data-testid="track-card-close"]');
  await p.click('[data-testid="nav-fit"]');
  await p.waitForTimeout(1200);
  await p.screenshot({ path: shots + '/konum-harita-iz.png' });

  // yer işaretine git
  await p.click('[data-testid="map-waypoints"]');
  await p.click('[data-testid="wp-item"]:has-text("Kaynak suyu") [data-testid="wp-goto"]');
  await p.waitForTimeout(500);
  check((await p.textContent('[data-testid="nav-name"]')).includes('Kaynak suyu'), 'buraya git: hedef ad');
  check(!!(await p.$('[data-testid="nav-turn"]')), 'pusula ile dönüş ipucu');
  await p.click('[data-testid="nav-fit"]');
  await p.waitForTimeout(1000);
  await p.screenshot({ path: shots + '/konum-harita-hedef.png' });

  // mevcut özellikler: en yakın toplanma alanı, konumumu söyle
  await p.click('[data-testid="nav-end"]');
  await p.click('[data-testid="map-nearest"]');
  await p.waitForSelector('[data-testid="poi-card"]');
  check((await p.textContent('[data-testid="poi-dist"]')).includes('kuş uçuşu'), 'en yakın toplanma alanı çalışıyor');
  await p.click('[data-testid="map-saymyloc"]');
  await p.waitForSelector('[data-testid="loc-decimal"]');
  check((await p.textContent('[data-testid="loc-decimal"]')).startsWith(START.latitude.toFixed(2)), 'konumumu söyle çalışıyor');
  await p.click('[data-testid="map-loc-panel-close"]');

  // iz sil
  await p.click('[data-testid="map-track"]');
  await p.click('[data-testid="track-delete"]');
  await p.click('[data-testid="track-delete-confirm"]');
  check(await p.isVisible('[data-testid="track-start"]'), 'iz silindi');
  await ctx.close();
}

await browser.close();
check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ':\n  ' + errors.join('\n  ') : ''));
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
