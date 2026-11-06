// İletişim sekmesi uçtan uca denemesi.
//   node e2e/iletisim-check.mjs [ekran-görüntüsü-klasörü] [--dist <derlenmiş-klasör>]
// Uygulamayı geçici bir klasöre derler (ya da --dist ile verilen klasörü kullanır),
// Node bilgi noktasını geçici veri klasörüyle başlatır ve iki (ve daha fazla)
// tarayıcı bağlamından pano akışlarını dener.
import { createRequire } from 'module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const di = args.indexOf('--dist');
let dist = di >= 0 ? path.resolve(args.splice(di, 2)[1]) : null;
const shots = args[0] ?? '/tmp/iletisim-shots';
fs.mkdirSync(shots, { recursive: true });

const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };

if (!dist) {
  dist = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-iletisim-dist-'));
  console.log('Derleniyor →', dist);
  execFileSync('npx', ['vite', 'build', '--outDir', dist, '--emptyOutDir', '--logLevel', 'warn'], { cwd: ROOT, stdio: 'inherit' });
}
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-iletisim-data-'));
const srv = await startServer({ port: 0, host: '127.0.0.1', data, dist, apkDirs: [data] });
const base = `http://127.0.0.1:${srv.port}/`;
console.log('Bilgi noktası:', base);

const b = await pw.chromium.launch();
const errors = [];
async function ctx(name, opts = {}, init) {
  const c = await b.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    permissions: ['geolocation'],
    geolocation: { latitude: 39.9208, longitude: 32.8541, accuracy: 15 },
    ...opts,
  });
  if (init) await c.addInitScript(init);
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(`${name} pageerror: ${e.message}`));
  p.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    // giden kutusu denemesinde bilerek kesilen istekler
    if (name === 'C' && /ERR_FAILED|Failed to load resource/.test(t)) return;
    errors.push(`${name} console: ${t}`);
  });
  return { c, p };
}
const tid = (id) => `[data-testid="${id}"]`;
/** Tüm içerik görünsün diye pencereyi kaydırılabilir alanın boyuna büyütüp çeker */
async function shot(p, name) {
  const vp = p.viewportSize();
  const h = await p.evaluate(() => {
    const m = document.getElementById('main');
    return m ? m.scrollHeight + (window.innerHeight - m.clientHeight) : document.body.scrollHeight;
  });
  if (h > vp.height) await p.setViewportSize({ width: vp.width, height: Math.min(h, 4000) });
  await p.screenshot({ path: path.join(shots, name + '.png') });
  if (h > vp.height) await p.setViewportSize(vp);
}
async function waitText(p, sel, text, timeout = 12000) {
  try {
    await p.waitForFunction(([s, t]) => [...document.querySelectorAll(s)].some((e) => e.textContent.includes(t)), [sel, text], { timeout });
    return true;
  } catch {
    return false;
  }
}

try {
  const A = await ctx('A');
  const B = await ctx('B');

  // --- Ana sayfa ve bağlantı durumu
  await A.p.goto(base + '?tab=iletisim', { waitUntil: 'networkidle' });
  await A.p.waitForSelector(tid('conn-status') + '[data-state="connected"]', { timeout: 10000 });
  check(true, 'A bilgi noktasına bağlandı');
  await shot(A.p, '01-home-connected');

  // --- Pano: A yazar, B görür; B yazar, A görür
  await A.p.click(tid('comm-card-pano'));
  await A.p.fill(tid('name-input'), 'Ayşe');
  await A.p.fill(tid('board-input'), 'Merhaba, okul bahçesinde su var.');
  await A.p.click(tid('board-send'));
  check(await waitText(A.p, tid('send-result'), 'Gönderildi'), 'A mesajı gönderildi');

  await B.p.goto(base + '?comm=pano', { waitUntil: 'networkidle' });
  check(await waitText(B.p, tid('board-text'), 'okul bahçesinde su var'), "B, A'nın mesajını görüyor");
  await B.p.fill(tid('name-input'), 'Bora');
  await B.p.fill(tid('board-input'), 'Teşekkürler <b>kalın değil</b>');
  await B.p.click(tid('board-send'));
  check(await waitText(A.p, tid('board-text'), 'Teşekkürler <b>kalın değil</b>'), "A, B'nin yanıtını otomatik yenilemeyle görüyor (HTML düz metin)");
  check((await A.p.$$('[data-testid="board-text"] b')).length === 0, 'HTML etiketi işlenmedi');
  await shot(A.p, '02-pano');

  // süzgeç
  await A.p.click(tid('board-filter-duyuru'));
  check(!!(await A.p.$(tid('board-empty'))), 'Duyuru süzgecinde boş durum');
  await A.p.click(tid('board-filter-hepsi'));

  // --- İyiyim: B yardım ister, konum ekler; A görür
  await B.p.click(tid('comm-back'));
  await B.p.click(tid('comm-card-iyiyim'));
  await B.p.click(tid('checkin-status-yardim'));
  await B.p.fill(tid('checkin-note'), 'Bacağım sıkıştı');
  await B.p.click(tid('checkin-geo'));
  check(await waitText(B.p, tid('checkin-geo-value'), '39.92080, 32.85410'), 'B konumu aldı');
  await B.p.fill(tid('family-input'), '0555 111 22 33');
  const href = await B.p.getAttribute(tid('checkin-sms'), 'href');
  check(href?.startsWith('sms:05551112233?body=') && decodeURIComponent(href).includes('Yardıma ihtiyacım var') && decodeURIComponent(href).includes('39.92080'), 'aileye SMS bağlantısı hazır: ' + href?.slice(0, 40));
  await B.p.click(tid('checkin-send'));
  check(await waitText(B.p, tid('send-result'), 'Gönderildi'), 'B durum bildirdi');
  await shot(B.p, '03-iyiyim');
  await A.p.goto(base + '?comm=iyiyim', { waitUntil: 'networkidle' });
  check(await A.p.waitForSelector('[data-testid="board-item"][data-kind="iyiyim"][data-status="yardim"]', { timeout: 10000 }).then(() => true, () => false), "A, B'nin 'Yardım lazım' bildirimini görüyor");
  check(await waitText(A.p, '[data-testid="board-item"][data-kind="iyiyim"]', 'Konum: 39.92080, 32.85410'), 'konum bildirimde görünüyor');

  // --- Kayıp kişi: A ilan verir; yalnız A (ilan sahibi) "bulundu" yapabilir
  await A.p.click(tid('comm-back'));
  await A.p.click(tid('comm-card-kayip'));
  await A.p.fill(tid('missing-name'), 'Mehmet Demir');
  await A.p.fill(tid('missing-age'), '72');
  await A.p.fill(tid('missing-desc'), 'Gri ceket, bastonlu');
  await A.p.fill(tid('missing-lastSeen'), 'Çarşı camii önü, 09.30');
  await A.p.click(tid('missing-send'));
  check(await waitText(A.p, tid('missing-item-name'), 'Mehmet Demir'), 'A kayıp ilanı verdi');
  await A.p.waitForSelector('[data-testid="board-item"][data-kind="kayip"][data-imza="gecerli"]', { timeout: 10000 }).catch(() => {});
  await shot(A.p, '04-kayip');
  await B.p.goto(base + '?comm=kayip', { waitUntil: 'networkidle' });
  check(await waitText(B.p, tid('missing-item-name'), 'Mehmet Demir'), 'B ilanı görüyor');
  check(await B.p.waitForSelector('[data-testid="board-item"][data-kind="kayip"][data-imza="gecerli"] [data-testid="item-verified"]', { timeout: 10000 }).then(() => true, () => false), 'B: ilan "doğrulandı" işaretli');
  check(await waitText(B.p, tid('missing-owner-note'), 'yalnızca ilanı veren telefon'), 'B: durumu kimin değiştirebileceği yazıyor');
  check((await B.p.$$('[data-testid^="missing-found-"]:not([data-testid="missing-found-result"])')).length === 0, 'B: "Bulundu olarak işaretle" düğmesi yok');
  const kid = await B.p.getAttribute('[data-testid="board-item"][data-kind="kayip"]', 'data-id');
  const sahte = await fetch(base + 'api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: kid, kind: 'kayip', from: 'Bora', text: 'x', status: 'bulundu' }) });
  check(sahte.status === 403, 'sahte "bulundu" isteği 403: ' + sahte.status);
  await shot(B.p, '05-kayip-baskasi');
  await A.p.click(tid('missing-found-' + kid));
  await shot(A.p, '05-kayip-onay');
  await A.p.click(tid('missing-found-confirm'));
  await B.p.click(tid('missing-show-all'));
  check(await B.p.waitForSelector('[data-testid="board-item"][data-kind="kayip"][data-status="bulundu"][data-imza="gecerli"]', { timeout: 12000 }).then(() => true, () => false), "B, ilanın 'Bulundu' olduğunu görüyor (imzalı güncelleme)");

  // --- Duyuru
  await A.p.goto(base + '?comm=duyuru', { waitUntil: 'networkidle' });
  await A.p.click(tid('ann-open'));
  await A.p.fill(tid('ann-text'), "Saat 15.00'te belediye önünde su dağıtılacak.");
  await A.p.click(tid('ann-send'));
  await B.p.goto(base + '?comm=duyuru', { waitUntil: 'networkidle' });
  check(await waitText(B.p, tid('board-text'), 'belediye önünde su'), 'B duyuruyu görüyor');
  check(await B.p.waitForSelector('[data-testid="board-item"][data-kind="duyuru"][data-bn="gecerli"] [data-testid="item-bn"]', { timeout: 10000 }).then(() => true, () => false), 'yerel duyuru "bu bilgi noktasından" (bilgi noktası imzası doğrulandı, anahtar sabitlendi)');
  // TOFU: aynı adreste başka anahtar görülürse etiket gösterilmez ve uyarı çıkar
  await B.p.evaluate(() => {
    const p = JSON.parse(localStorage.getItem('ac.comm.bnpin') || '{}');
    for (const k of Object.keys(p)) p[k] = 'A'.repeat(43);
    localStorage.setItem('ac.comm.bnpin', JSON.stringify(p));
  });
  await B.p.reload({ waitUntil: 'networkidle' });
  check(await B.p.waitForSelector('[data-testid="board-item"][data-kind="duyuru"][data-bn="gecersiz"] [data-testid="item-unverified"]', { timeout: 10000 }).then(() => true, () => false), 'anahtar değişince "doğrulanamadı" (kehribar) gösterilir');
  check(await B.p.waitForSelector(tid('bn-key-changed'), { timeout: 10000 }).then(() => true, () => false), 'bağlantı kartında anahtar değişti uyarısı');
  const uyariRenk = await B.p.$eval('[data-testid="item-unverified"]', (e) => getComputedStyle(e).color);
  check(!/rgb\(229, 72, 77\)/.test(uyariRenk), 'uyarı kırmızı değil: ' + uyariRenk);
  await shot(B.p, '06b-duyuru-anahtar-degisti');
  await B.p.goto(base + '?comm=baglan', { waitUntil: 'networkidle' });
  await B.p.click(tid('bn-key-accept'));
  await B.p.goto(base + '?comm=duyuru', { waitUntil: 'networkidle' });
  check(await B.p.waitForSelector('[data-testid="board-item"][data-kind="duyuru"][data-bn="gecerli"]', { timeout: 10000 }).then(() => true, () => false), 'yeni anahtar kabul edilince etiket geri geldi');
  await shot(B.p, '06-duyuru');

  // --- Giden kutusu: C'nin bağlantısı kesik; mesaj bekler, bağlantı gelince gider
  const C = await ctx('C');
  await C.p.route('**/api/**', (r) => r.abort());
  await C.p.goto(base + '?comm=pano', { waitUntil: 'domcontentloaded' });
  await C.p.waitForSelector(tid('conn-status') + '[data-state="offline"]', { timeout: 15000 });
  await C.p.fill(tid('name-input'), 'Cem');
  await C.p.fill(tid('board-input'), 'Şebeke yokken yazdım');
  await C.p.click(tid('board-send'));
  check(await waitText(C.p, tid('send-result'), 'bağlanınca gönderilecek'), 'C: mesaj giden kutusunda');
  check(await waitText(C.p, tid('outbox-count'), '1'), 'C: 1 kayıt bekliyor');
  check(await waitText(C.p, '[data-testid="board-item"]', 'gönderilmeyi bekliyor'), 'C: bekleyen kayıt panoda');
  await shot(C.p, '07-giden-kutusu');
  await C.p.goto(base + '?comm=baglan', { waitUntil: 'domcontentloaded' });
  await C.p.waitForSelector(tid('conn-status') + '[data-state="offline"]', { timeout: 15000 });
  await shot(C.p, '08-baglan-offline');
  await C.p.unroute('**/api/**');
  await C.p.fill(tid('server-input'), base);
  await C.p.click(tid('server-save'));
  await C.p.waitForSelector(tid('conn-status') + '[data-state="connected"]', { timeout: 15000 }).catch(() => {});
  await A.p.goto(base + '?comm=pano', { waitUntil: 'networkidle' });
  check(await waitText(A.p, tid('board-text'), 'Şebeke yokken yazdım'), 'giden kutusu bağlantı gelince gönderildi, A görüyor');
  const ob = await C.p.evaluate(() => JSON.parse(localStorage.getItem('ac.comm.outbox') || '[]').length);
  check(ob === 0, 'C giden kutusu boşaldı');
  // aynı kimlik ikinci kez gönderilince sunucuda çoğalmaz
  const list = await (await fetch(base + 'api/board')).json();
  check(list.items.filter((i) => i.text === 'Şebeke yokken yazdım').length === 1, 'sunucuda tek kopya');
  check(fs.existsSync(path.join(data, 'board.json')) || (await new Promise((r) => setTimeout(r, 400)), fs.existsSync(path.join(data, 'board.json'))), 'board.json yazıldı');

  // --- Şebekesiz araçlar
  await A.p.goto(base + '?comm=sos', { waitUntil: 'networkidle' });
  await shot(A.p, '09-sos');
  await A.p.click(tid('sos-start'));
  await A.p.waitForSelector(tid('sos-overlay'));
  const states = new Set();
  for (let i = 0; i < 20; i++) {
    states.add(await A.p.getAttribute(tid('sos-overlay'), 'data-on'));
    if (states.size === 2) break;
    await A.p.waitForTimeout(120);
  }
  check(states.size === 2, 'SOS ekranı yanıp sönüyor');
  await A.p.waitForFunction(() => document.querySelector('[data-testid="sos-overlay"]')?.getAttribute('data-on') === '1');
  await A.p.screenshot({ path: path.join(shots, '10-sos-ekran.png') }); // tam ekranda pencere boyu değişmez
  await A.p.click(tid('sos-stop'));
  check(!(await A.p.$(tid('sos-overlay'))), 'SOS ekranı kapandı');
  await A.p.click(tid('sos-whistle'));
  check((await A.p.getAttribute(tid('sos-whistle'), 'aria-pressed')) === 'true', 'düdük çalıyor');
  await A.p.waitForTimeout(300);
  await A.p.click(tid('sos-whistle'));
  check((await A.p.getAttribute(tid('sos-whistle'), 'aria-pressed')) === 'false', 'düdük durdu');

  await A.p.goto(base + '?comm=mors', { waitUntil: 'networkidle' });
  await A.p.fill(tid('morse-input'), 'SOS yardım');
  check((await A.p.textContent(tid('morse-output'))).trim() === '...---... / -.-- .- .-. -.. .. --', 'metin → Mors');
  await A.p.click(tid('morse-play-light'));
  await A.p.waitForFunction(() => document.querySelector('[data-testid="morse-lamp"]')?.getAttribute('data-on') === '1', null, { timeout: 2000 }).then(
    () => check(true, 'Mors ışığı yanıyor'),
    () => check(false, 'Mors ışığı yanıyor'),
  );
  await shot(A.p, '11-mors');
  await A.p.click(tid('morse-play-light'));
  await A.p.fill(tid('morse-input'), '-.-- .- .-. -.. .. -- / --. . .-..');
  check((await A.p.textContent(tid('morse-output'))).trim() === 'YARDIM GEL', 'Mors → metin');

  await A.p.goto(base + '?comm=sms', { waitUntil: 'networkidle' });
  await A.p.fill(tid('sms-place'), 'Kızılay');
  await A.p.click(tid('sms-geo'));
  await waitText(A.p, tid('sms-geo-value'), '39.92080');
  const iy = await A.p.inputValue(tid('sms-text'));
  check(iy.startsWith("İyiyim, Kızılay'dayım.") && iy.includes('Konum: 39.92080, 32.85410'), 'iyiyim şablonu: ' + iy);
  await A.p.click(tid('sms-template-acil112'));
  await A.p.fill(tid('sms-people'), '3');
  const ac = await A.p.inputValue(tid('sms-text'));
  check(ac.startsWith('ACİL.') && ac.includes('Kişi sayısı: 3.') && ac.includes('39.92080'), '112 şablonu konumlu');
  check(!!(await A.p.$(tid('sms-112-note'))), '112 uyarı notu');
  await A.p.fill(tid('sms-family'), '05551112233');
  check((await A.p.getAttribute(tid('sms-send-family'), 'href')).startsWith('sms:05551112233?body=ACİL'.replace('İ', '%C4%B0')), 'SMS bağlantısı');
  await shot(A.p, '12-sms');

  await A.p.goto(base + '?comm=baglan', { waitUntil: 'networkidle' });
  await shot(A.p, '13-baglan');

  // --- Android: fener eklentisi (Capacitor taklidi)
  const D = await ctx('D', {}, () => {
    const calls = (window.__torch = []);
    window.Capacitor = {
      getPlatform: () => 'android',
      isNativePlatform: () => true,
      Plugins: {
        AkilCantasi: {
          setTorch: async (o) => {
            calls.push(o.on);
            return { on: o.on, available: true };
          },
          getInfoPointStatus: async () => ({ running: false }),
        },
      },
    };
  });
  await D.p.goto(base + '?comm=sos', { waitUntil: 'networkidle' });
  check(await D.p.isChecked(tid('sos-torch')), 'Android: fener seçeneği açık');
  await D.p.click(tid('sos-start'));
  await D.p.waitForTimeout(1600);
  await D.p.click(tid('sos-stop'));
  await D.p.waitForTimeout(100);
  const torch = await D.p.evaluate(() => window.__torch);
  check(torch.includes(true) && torch.includes(false) && torch[torch.length - 1] === false, 'Android: fener SOS ritmiyle yanıp söndü ve kapandı: ' + torch.join(','));

  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ':\n  ' + errors.join('\n  ') : ''));
} catch (e) {
  check(false, 'beklenmeyen hata: ' + (e?.stack ?? e));
} finally {
  await b.close();
  await srv.close();
  fs.rmSync(data, { recursive: true, force: true });
}
console.log('Ekran görüntüleri:', shots);
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
