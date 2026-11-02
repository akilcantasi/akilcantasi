// QA: İletişim sekmesi regresyon denetimi.
//   node e2e/qa-iletisim.mjs [http://localhost:5199/] [ekran-klasörü]
// Uygulama Vite sunucusundan açılır; Node bilgi noktası geçici veri klasörüyle
// başlatılır ve profildeki "bilgi noktası adresi" ile bağlanılır (farklı köken).
// Kapsam: tüm ?comm= bölümleri, iki tarayıcı bağlamı, bilgi noktası yokken
// giden kutusu, taklit mesh eklentisi, oturum ortasında sunucunun düşmesi,
// uzun/Türkçe metin, hız sınırı, kayıp → bulundu, SOS/düdük/Mors (taklit
// AudioContext), SMS (konumlu/izinsiz), Android fener taklidi, yerleşim.
import { createRequire } from 'module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const app = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
// Uygulama bir bilgi noktasından (server.mjs) sunuluyorsa istemci kendi kökenine bağlanır ve
// "bağlı değil" senaryoları sınanamaz: Vite sunucusu gerekir.
try {
  const r = await fetch(app + 'api/status');
  if (r.ok && /json/.test(r.headers.get('content-type') || '')) {
    console.log('HATA: ' + app + ' bir bilgi noktası (server.mjs). Bu denetim Vite sunucusuyla çalışır: npx vite --port 5199');
    process.exit(2);
  }
} catch {}
const shots = process.argv[3] ?? '/tmp/qa-iletisim';
fs.mkdirSync(shots, { recursive: true });

const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const tid = (id) => `[data-testid="${id}"]`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const data = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-qa-il-'));
const data2 = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-qa-il2-'));
const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'akil-qa-il-dist-'));
fs.writeFileSync(path.join(dist, 'index.html'), '<!doctype html><title>x</title>');
let srv = await startServer({ port: 0, host: '127.0.0.1', data, dist, apkDirs: [data], quiet: true });
const PORT = srv.port;
const SRV = `http://127.0.0.1:${PORT}`;
// Hız sınırı denemesi için ayrı sunucu: dakikada 3 gönderim
const srvRate = await startServer({ port: 0, host: '127.0.0.1', data: data2, dist, apkDirs: [data2], quiet: true, board: { ratePerMin: 3 } });
const SRV_RATE = `http://127.0.0.1:${srvRate.port}`;
console.log('Uygulama:', app, '· bilgi noktası:', SRV, '· hız sınırlı:', SRV_RATE);

const b = await pw.chromium.launch();
const errors = [];
const IGNORE = /ERR_CONNECTION_REFUSED|ERR_FAILED|Failed to load resource|net::ERR|status of 429/;

/** profile: localStorage'a ilk açılışta yazılır (yeniden yüklemede korunur) */
async function ctx(name, { profile, init, opts = {} } = {}) {
  const c = await b.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['geolocation', 'clipboard-read', 'clipboard-write'],
    geolocation: { latitude: 39.9334, longitude: 32.8597, accuracy: 12 },
    ...opts,
  });
  if (profile) await c.addInitScript((p) => { if (!localStorage.getItem('ac.comm.profile')) localStorage.setItem('ac.comm.profile', JSON.stringify(p)); }, profile);
  if (init) await c.addInitScript(init);
  // Paylaşılan makinede yük yüksek olabilir: cömert zaman aşımları
  c.setDefaultNavigationTimeout(120000);
  c.setDefaultTimeout(60000);
  const p = await c.newPage();
  p.on('pageerror', (e) => errors.push(`${name} pageerror: ${e.message}`));
  p.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (IGNORE.test(t)) return;
    errors.push(`${name} console: ${t}`);
  });
  return { c, p };
}
async function waitText(p, sel, text, timeout = 12000) {
  try {
    await p.waitForFunction(([s, t]) => [...document.querySelectorAll(s)].some((e) => e.textContent.includes(t)), [sel, text], { timeout });
    return true;
  } catch {
    return false;
  }
}
const waitSel = (p, sel, timeout = 12000) => p.waitForSelector(sel, { timeout }).then(() => true, () => false);
async function shot(p, name) {
  const vp = p.viewportSize();
  const h = await p.evaluate(() => {
    const m = document.getElementById('main');
    return m ? m.scrollHeight + (window.innerHeight - m.clientHeight) : document.body.scrollHeight;
  });
  if (h > vp.height) await p.setViewportSize({ width: vp.width, height: Math.min(h, 5000) });
  await p.screenshot({ path: path.join(shots, name + '.png') });
  if (h > vp.height) await p.setViewportSize(vp);
}
/** yatay taşma ve 44 px altı dokunma hedefleri (#main içinde, görünür olanlar) */
async function layout(p) {
  return p.evaluate(() => {
    const root = document.getElementById('main') ?? document.body;
    const W = document.documentElement.clientWidth;
    const over = [];
    for (const el of root.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > W + 1 && getComputedStyle(el).position !== 'fixed') over.push((el.getAttribute('data-testid') || el.tagName) + ':' + Math.round(r.right));
    }
    const small = [];
    for (const el of root.querySelectorAll('button, a[href], input:not([type=range]), textarea, select')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (el.matches('input[type=checkbox]')) {
        const l = el.closest('label')?.getBoundingClientRect();
        if (l && l.height >= 44) continue;
      }
      // metin içi bağlantı (paragraf içindeki tel: bağlantısı) hariç
      if (el.tagName === 'A' && el.closest('p')) continue;
      if (r.height < 44 - 0.5) small.push((el.getAttribute('data-testid') || el.tagName) + ':' + Math.round(r.height));
    }
    return { over: over.slice(0, 6), small: small.slice(0, 8), sw: document.documentElement.scrollWidth, W };
  });
}

// Taklit AudioContext: kazanç açma/kapama ve osilatörleri kaydeder
const AUDIO_MOCK = () => {
  const A = (window.__audio = { gains: [], osc: [], stops: 0, created: 0 });
  class N { connect(n) { return n; } disconnect() {} }
  class Param { constructor(v) { this.value = v; } setTargetAtTime(v) { this.__main && A.gains.push(v); } cancelScheduledValues() {} }
  class Gain extends N { constructor() { super(); this.gain = new Param(1); } }
  class Osc extends N { constructor() { super(); this.type = 'sine'; this.frequency = new Param(440); } start() { A.osc.push({ type: this.type, f: this.frequency.value }); } stop() { A.stops++; } }
  window.AudioContext = class {
    constructor() { A.created++; this.state = 'running'; this.currentTime = 0; this.destination = new N(); }
    createGain() { const g = new Gain(); g.gain.__main = true; return g; }
    createOscillator() { return new Osc(); }
    createDynamicsCompressor() { return new N(); }
    resume() { return Promise.resolve(); }
  };
  // derinlik (LFO) kazançları kayda girmesin: yalnızca ana kazanç setTargetAtTime alır
};

// Android taklidi: fener çağrıları kaydedilir; __torchFail ile flaş yok
const ANDROID_MOCK = () => {
  const calls = (window.__torch = []);
  window.Capacitor = {
    getPlatform: () => 'android',
    isNativePlatform: () => true,
    isPluginAvailable: (n) => n === 'AkilCantasi',
    Plugins: {
      AkilCantasi: {
        setTorch: async (o) => { calls.push(o.on); return window.__torchFail ? { on: false, available: false } : { on: o.on, available: true }; },
        getInfoPointStatus: async () => ({ running: false }),
        openHotspotSettings: async () => { window.__hotspot = true; return { opened: true }; },
      },
    },
  };
};

const SECTIONS = ['pano', 'iyiyim', 'kayip', 'duyuru', 'sos', 'mors', 'sms', 'baglan'];

try {
  // =========================================================================
  // 1) Bilgi noktası VAR: iki bağlam
  // =========================================================================
  const A = await ctx('A', { profile: { name: 'Ayşe Öztürk', family: '', familyName: '', server: SRV } });
  const B = await ctx('B', { profile: { name: 'Barış Çelik', family: '', familyName: '', server: SRV } });
  await A.p.goto(app + '?tab=iletisim', { waitUntil: 'domcontentloaded' });
  check(await waitSel(A.p, tid('conn-status') + '[data-state="connected"]', 15000), 'A: profildeki adresle bilgi noktasına bağlandı');

  // uzun Türkçe metin (600 sınırı)
  const TR = 'Çığ düştü; Şükrü, Ömer ve İlkay Ünlü güvende. Iğdır yolu kapalı! ';
  const long = (TR.repeat(12)).slice(0, 700);
  await A.p.goto(app + '?comm=pano', { waitUntil: 'domcontentloaded' });
  await waitSel(A.p, tid('conn-status') + '[data-state="connected"]');
  await A.p.fill(tid('board-input'), long);
  const typed = await A.p.inputValue(tid('board-input'));
  check(typed.length === 600, 'mesaj alanı 600 karakterle sınırlı (' + typed.length + ')');
  await A.p.click(tid('board-send'));
  check(await waitText(A.p, tid('send-result'), 'Gönderildi'), 'A: uzun Türkçe mesaj gönderildi');
  await B.p.goto(app + '?comm=pano', { waitUntil: 'domcontentloaded' });
  check(await waitText(B.p, tid('board-text'), 'Iğdır yolu kapalı'), "B: A'nın uzun mesajını görüyor");
  const bt = await B.p.evaluate(() => document.querySelector('[data-testid="board-text"]')?.textContent ?? '');
  check(bt === typed.trim().replace(/ {2,}/g, ' '), 'Türkçe karakterler bozulmadan geldi');
  // 360 px'te taşma yok
  await B.p.setViewportSize({ width: 360, height: 640 });
  const lb = await layout(B.p);
  check(lb.sw <= lb.W && lb.over.length === 0, '360px pano: yatay taşma yok ' + JSON.stringify(lb.over));
  await shot(B.p, 'pano-360-uzun');
  await B.p.setViewportSize({ width: 390, height: 844 });

  // boş metin / ad yok
  check(await B.p.isDisabled(tid('board-send')), 'boş mesajda gönder pasif');
  await B.p.fill(tid('name-input'), '');
  await B.p.fill(tid('board-input'), 'x');
  check(await B.p.isDisabled(tid('board-send')), 'ad yokken gönder pasif');
  await B.p.fill(tid('name-input'), 'Barış Çelik');

  // ana sayfa sayaçları
  await A.p.goto(app + '?tab=iletisim', { waitUntil: 'domcontentloaded' });
  check(await waitText(A.p, tid('comm-card-pano'), '1'), 'ana sayfa: pano sayacı');

  // --- kayıp → bulundu (A ilan verir, B işaretler) ---
  await A.p.goto(app + '?comm=kayip', { waitUntil: 'domcontentloaded' });
  await waitSel(A.p, tid('conn-status') + '[data-state="connected"]');
  check(await A.p.isDisabled(tid('missing-send')), 'kayıp: ad boşken gönder pasif');
  await A.p.fill(tid('missing-name'), 'Gülşen Işık');
  await A.p.fill(tid('missing-age'), '8');
  await A.p.fill(tid('missing-desc'), 'Pembe mont, örgülü saç');
  await A.p.fill(tid('missing-lastSeen'), 'Şehit Öğretmen İlkokulu, 14.00');
  await A.p.click(tid('missing-send'));
  check(await waitText(A.p, tid('missing-item-name'), 'Gülşen Işık'), 'kayıp ilanı verildi');
  check(await A.p.waitForFunction(() => document.querySelector('[data-testid="missing-name"]')?.value === '', null, { timeout: 8000 }).then(() => true, () => false), 'form temizlendi');
  await B.p.goto(app + '?comm=kayip', { waitUntil: 'domcontentloaded' });
  check(await waitText(B.p, tid('missing-item-name'), 'Gülşen Işık'), 'B ilanı görüyor');
  const fid = await B.p.getAttribute('[data-testid="board-item"][data-kind="kayip"]', 'data-id').catch(() => null);
  const foundSel = fid ? tid('missing-found-' + fid) : '[data-testid^="missing-found-"]';
  await B.p.click(foundSel);
  await B.p.click(tid('missing-found-cancel'));
  check(!!(await B.p.$(foundSel)), 'vazgeç: onay kapandı');
  await B.p.click(foundSel);
  await B.p.click(tid('missing-found-confirm'));
  check(await waitText(B.p, tid('missing-found-result'), 'Gönderildi'), 'B: bulundu gönderildi');
  check(await waitText(B.p, tid('board-empty'), 'açık kayıp ilanı'), 'B: "Aranıyor" süzgecinde ilan kalmadı');
  await A.p.click(tid('missing-show-all'));
  check(await waitSel(A.p, '[data-testid="board-item"][data-kind="kayip"][data-status="bulundu"]', 12000), 'A: ilan "Bulundu" görünüyor');
  check(await waitText(A.p, '[data-testid="board-item"][data-kind="kayip"]', 'Ayşe Öztürk'), 'bulundu işareti ilan sahibinin adını korudu');
  await shot(A.p, 'kayip-bulundu');
  // sunucu tarafı: bulundu → aranıyor geri alınamaz
  const pr = await fetch(SRV + '/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: fid ?? 'xxxxxx', kind: 'kayip', from: 'Kötü', text: 'x', status: 'araniyor' }) }).then((r) => r.json());
  check(pr.item?.status === 'bulundu' && pr.duplicate === true, 'sunucu: bulundu → aranıyor geri alınamaz');

  // --- iyiyim + duyuru ---
  await B.p.goto(app + '?comm=iyiyim', { waitUntil: 'domcontentloaded' });
  await B.p.click(tid('checkin-status-yarali'));
  check((await B.p.getAttribute(tid('checkin-status-yarali'), 'aria-pressed')) === 'true', 'iyiyim: yaralıyım seçildi');
  check(await waitText(B.p, tid('checkin-send'), '“Yaralıyım” olarak panoya gönder'), 'gönder düğmesi seçili durumu söylüyor');
  check(await waitText(B.p, tid('checkin-sms-text'), 'Yaralıyım'), 'SMS önizleme yaralı durumunu içeriyor');
  await B.p.click(tid('checkin-send'));
  check(await waitText(B.p, tid('send-result'), 'Gönderildi'), 'iyiyim (boş not) gönderildi');
  await B.c.close();
  await A.p.goto(app + '?comm=duyuru', { waitUntil: 'domcontentloaded' });
  check(await waitText(A.p, tid('board-empty'), 'Henüz duyuru yok'), 'duyuru: boş durum');
  await A.p.click(tid('ann-open'));
  await A.p.fill(tid('ann-text'), 'Toplanma alanı: Örnek Mahallesi parkı.\n\n\n\nSu dağıtımı 16.00.');
  await A.p.click(tid('ann-send'));
  check(await waitText(A.p, tid('board-text'), 'Örnek Mahallesi parkı'), 'duyuru gönderildi');
  const annTxt = await A.p.textContent(tid('board-text'));
  check(!/\n{3,}/.test(annTxt), 'fazla boş satırlar sıkıştırıldı');

  // --- kalıcılık: yeniden yükle ---
  await A.p.reload({ waitUntil: 'domcontentloaded' });
  check(await waitText(A.p, tid('board-text'), 'Örnek Mahallesi parkı'), 'yeniden yüklemede duyuru görünüyor');
  check((await A.p.evaluate(() => JSON.parse(localStorage.getItem('ac.comm.profile')).name)) === 'Ayşe Öztürk', 'profil (ad) kalıcı');

  // =========================================================================
  // 2) Oturum ortasında sunucu düşer
  // =========================================================================
  await A.p.goto(app + '?comm=pano', { waitUntil: 'domcontentloaded' });
  await waitSel(A.p, tid('conn-status') + '[data-state="connected"]');
  await srv.close();
  await A.p.fill(tid('board-input'), 'Sunucu düştükten sonra yazıldı');
  await A.p.click(tid('board-send'));
  check(await waitText(A.p, tid('send-result'), 'yeniden denenecek', 15000) || (await waitText(A.p, tid('send-result'), 'bağlanınca gönderilecek', 1000)), 'sunucu düşünce kayıt giden kutusunda: ' + (await A.p.textContent(tid('send-result')).catch(() => '')));
  check(await waitSel(A.p, tid('conn-status') + '[data-state="offline"]', 20000), 'bağlantı durumu "bağlı değil"e döndü');
  check(await waitText(A.p, tid('outbox-count'), '1'), '1 kayıt bekliyor');
  check(await waitText(A.p, tid('board-text'), 'Örnek Mahallesi parkı'), 'sunucu yokken önbellekteki kayıtlar görünüyor');
  await shot(A.p, 'sunucu-dustu');
  await A.p.reload({ waitUntil: 'domcontentloaded' });
  check(await waitText(A.p, '[data-testid="board-item"]', 'gönderilmeyi bekliyor'), 'yeniden yüklemede bekleyen kayıt duruyor');
  // aynı veri klasörü ve portla geri gelir
  srv = await startServer({ port: PORT, host: '127.0.0.1', data, dist, apkDirs: [data], quiet: true });
  await A.p.goto(app + '?comm=baglan', { waitUntil: 'domcontentloaded' });
  await A.p.click(tid('server-save')); // "Kaydet ve dene": hemen yoklar
  check(await waitSel(A.p, tid('conn-status') + '[data-state="connected"]', 15000), 'sunucu geri gelince yeniden bağlandı');
  check(await waitText(A.p, tid('server-saved'), 'Bağlantı kuruldu'), '"Kaydedildi. Bağlantı kuruldu."');
  let got = false;
  for (let i = 0; i < 30 && !got; i++) {
    const l = await fetch(SRV + '/api/board').then((r) => r.json());
    got = l.items.some((x) => x.text === 'Sunucu düştükten sonra yazıldı');
    if (!got) await sleep(500);
  }
  check(got, 'bekleyen kayıt sunucuya ulaştı');
  const l2 = await fetch(SRV + '/api/board').then((r) => r.json());
  check(l2.items.some((x) => x.kind === 'duyuru'), 'sunucu yeniden başlayınca board.json yüklendi');

  // =========================================================================
  // 3) Hız sınırı
  // =========================================================================
  const R = await ctx('R', { profile: { name: 'Rıza', family: '', familyName: '', server: SRV_RATE } });
  await R.p.goto(app + '?comm=pano', { waitUntil: 'domcontentloaded' });
  await waitSel(R.p, tid('conn-status') + '[data-state="connected"]', 15000);
  let res = '';
  for (let i = 1; i <= 4; i++) {
    await R.p.fill(tid('board-input'), 'Hız denemesi ' + i);
    await R.p.click(tid('board-send'));
    await R.p.waitForFunction(() => document.querySelector('[data-testid="board-send"]')?.textContent?.includes('Panoya'));
    res = await R.p.textContent(tid('send-result'));
  }
  check(/Çok sık gönderim/.test(res) && /yeniden denenecek/.test(res), 'hız sınırı: kullanıcıya açık mesaj: ' + res);
  check(await waitText(R.p, '[data-testid="board-item"]', 'gönderilmeyi bekliyor'), 'hız sınırındaki kayıt bekliyor olarak görünüyor');
  check(await waitText(R.p, tid('conn-status'), '1 kayıt gönderiliyor'), 'bağlantı kartı bekleyen kaydı sayıyor');
  await shot(R.p, 'hiz-siniri');
  const rl = await fetch(SRV_RATE + '/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  check(rl.status === 429 && rl.headers.get('retry-after'), 'sunucu 429 + Retry-After döndü');
  await R.c.close();

  // =========================================================================
  // 4) Bilgi noktası YOK
  // =========================================================================
  const E = await ctx('E');
  await E.p.goto(app + '?tab=iletisim', { waitUntil: 'domcontentloaded' });
  check(await waitSel(E.p, tid('conn-status') + '[data-state="offline"]', 20000), 'bilgi noktası yokken "bağlı değilsiniz"');
  check(await waitText(E.p, tid('conn-status'), 'bilgi noktasına bağlanınca kendiliğinden gönderilir'), 'açıklama metni');
  await E.p.click(tid('conn-help'));
  check(await waitSel(E.p, tid('comm-baglan')), '"Nasıl bağlanırım?" bağlantı bölümünü açtı');
  await E.p.fill(tid('server-input'), 'http://');
  await E.p.click(tid('server-save'));
  check(await waitText(E.p, '.cm-err', 'Adres anlaşılamadı'), 'geçersiz adres uyarısı');
  await E.p.fill(tid('server-input'), '192.168.43.1:8080/');
  await E.p.click(tid('server-save'));
  check((await E.p.inputValue(tid('server-input'))) === 'http://192.168.43.1:8080', 'adres düzeltildi');
  check(await waitText(E.p, tid('server-saved'), 'Bağlantı deneniyor'), 'kaydedildi notu');
  await E.p.click(tid('server-clear'));
  check((await E.p.inputValue(tid('server-input'))) === '' && !(await E.p.$(tid('server-clear'))), 'adres silindi');
  check(!(await E.p.$(tid('open-hotspot'))), 'tarayıcıda erişim noktası düğmesi yok');
  await E.p.goto(app + '?comm=pano', { waitUntil: 'domcontentloaded' });
  check(await waitText(E.p, tid('board-empty'), 'Bilgi noktasına bağlanınca'), 'boş pano açıklaması');
  await E.p.fill(tid('name-input'), 'Elif');
  await E.p.fill(tid('board-input'), 'Çevrimdışı yazdım');
  await E.p.click(tid('board-send'));
  check(await waitText(E.p, tid('send-result'), 'bağlanınca gönderilecek'), 'çevrimdışı: giden kutusuna alındı');
  check(await waitText(E.p, tid('outbox-count'), '1'), 'çevrimdışı: 1 kayıt bekliyor');
  await E.p.goto(app + '?comm=kayip', { waitUntil: 'domcontentloaded' });
  await E.p.fill(tid('missing-name'), 'Ali');
  await E.p.click(tid('missing-send'));
  check(await waitText(E.p, tid('missing-item-name'), 'Ali'), 'çevrimdışı kayıp ilanı listede');
  await E.p.click('[data-testid^="missing-found-"]');
  await E.p.click(tid('missing-found-confirm'));
  await E.p.click(tid('missing-show-all'));
  check(await waitSel(E.p, '[data-testid="board-item"][data-kind="kayip"][data-status="bulundu"]'), 'çevrimdışı: bulundu işareti giden kutusunda güncellendi');
  check((await E.p.evaluate(() => JSON.parse(localStorage.getItem('ac.comm.outbox')).length)) === 2, 'giden kutusunda aynı ilan tek kayıt');
  await E.p.goto(app + '?tab=iletisim', { waitUntil: 'domcontentloaded' });
  check(await waitText(E.p, tid('outbox-count'), '2'), 'ana sayfa: 2 kayıt bekliyor');
  await shot(E.p, 'home-offline');
  await E.c.close();

  // =========================================================================
  // 5) Taklit mesh eklentisi (iki telefon, bilgi noktası yok)
  // =========================================================================
  const phones = {};
  async function meshPhone(id, name) {
    const M = await ctx('M' + id, {
      profile: { name, family: '', familyName: '', server: '' },
      init: () => {
        const ls = {};
        window.__meshEmit = (ev, d) => (ls[ev] || []).forEach((cb) => cb(d));
        window.__meshReady = () => !!ls.meshPeers;
        window.Capacitor = {
          getPlatform: () => 'android', isNativePlatform: () => true,
          isPluginAvailable: (n) => n === 'AkilMesh' || n === 'AkilCantasi',
          Plugins: {
            AkilCantasi: { getInfoPointStatus: async () => ({ running: false }), setTorch: async (o) => ({ on: o.on, available: true }) },
            AkilMesh: {
              isAvailable: async () => ({ available: true, gms: true, maxBytes: 32768 }),
              start: async () => ({ started: true }),
              stop: async () => ({}),
              send: async (o) => ({ sent: await window.__meshOut(o.to, o.data) }),
              getPeers: async () => ({ peers: [] }),
              addListener: async (ev, cb) => { (ls[ev] ||= []).push(cb); return { remove() {} }; },
            },
          },
        };
      },
    });
    await M.p.exposeFunction('__meshOut', (to, d) => {
      const other = id === '1' ? '2' : '1';
      if (to && to !== 'EP_' + other) return 0;
      phones[other].p.evaluate(([from, d]) => window.__meshEmit('meshMessage', { from, data: d }), ['EP_' + id, d]).catch(() => {});
      return 1;
    });
    phones[id] = M;
    return M;
  }
  const M1 = await meshPhone('1', 'Mert');
  const M2 = await meshPhone('2', 'Nur');
  for (const M of [M1, M2]) {
    await M.p.goto(app + '?comm=kayip', { waitUntil: 'domcontentloaded' });
    await M.p.waitForFunction(() => window.__meshReady && window.__meshReady(), null, { timeout: 10000 });
  }
  await M1.p.evaluate(() => window.__meshEmit('meshPeers', { peers: [{ id: 'EP_2', node: 'n2', name: 'Nur', connected: true }] }));
  await M2.p.evaluate(() => window.__meshEmit('meshPeers', { peers: [{ id: 'EP_1', node: 'n1', name: 'Mert', connected: true }] }));
  check(await waitText(M1.p, tid('conn-status'), 'Yakın cihaz ağı açık · 1 cihaz', 8000), 'mesh: bağlantı kartı yakın cihaz sayısını gösteriyor');
  await M1.p.fill(tid('missing-name'), 'Hüseyin Şahin');
  await M1.p.click(tid('missing-send'));
  check(await waitText(M2.p, tid('missing-item-name'), 'Hüseyin Şahin', 8000), 'mesh: ilan bilgi noktası olmadan diğer telefona ulaştı');
  check(await waitText(M2.p, '[data-testid="board-item"]', 'yakın cihazdan'), 'mesh: "yakın cihazdan" etiketi');
  await M2.p.click('[data-testid^="missing-found-"]');
  await M2.p.click(tid('missing-found-confirm'));
  await M1.p.click(tid('missing-show-all'));
  check(await waitSel(M1.p, '[data-testid="board-item"][data-kind="kayip"][data-status="bulundu"]', 8000), 'mesh: "bulundu" işareti ilan sahibine ulaştı');
  const ob1 = await M1.p.evaluate(() => JSON.parse(localStorage.getItem('ac.comm.outbox') || '[]'));
  check(ob1.length === 1 && ob1[0].draft.status === 'bulundu' && ob1[0].draft.from === 'Mert', 'mesh: ilan sahibinin giden kutusu "bulundu"ya güncellendi');
  await shot(M1.p, 'mesh-bulundu');
  // köprü: M2 bilgi noktasına bağlanınca mesh'ten gelen kaydı sunucuya aktarır
  await M2.p.goto(app + '?comm=baglan', { waitUntil: 'domcontentloaded' });
  await M2.p.fill(tid('server-input'), SRV);
  await M2.p.click(tid('server-save'));
  check(await waitSel(M2.p, tid('conn-status') + '[data-state="connected"]', 15000), 'mesh telefonu bilgi noktasına bağlandı');
  check(!!(await M2.p.$(tid('open-hotspot'))), 'Android: erişim noktası ayarları düğmesi var');
  let bridged = null;
  for (let i = 0; i < 30 && !bridged; i++) {
    const l = await fetch(SRV + '/api/board').then((r) => r.json());
    bridged = l.items.find((x) => x.text.includes('Hüseyin Şahin'));
    if (!bridged) await sleep(500);
  }
  check(bridged?.from === 'Mert', 'bulundu işareti ilan sahibinin adını korudu (mesh): ' + bridged?.from);
  check(bridged?.status === 'bulundu', 'mesh kaydı bilgi noktasına "bulundu" olarak aktarıldı: ' + (bridged?.status ?? 'yok'));
  await M1.c.close();
  await M2.c.close();

  // =========================================================================
  // 6) SOS, düdük, Mors (taklit AudioContext) ve Android fener
  // =========================================================================
  const S = await ctx('S', { init: AUDIO_MOCK });
  await S.p.goto(app + '?comm=sos', { waitUntil: 'domcontentloaded' });
  await S.p.waitForSelector(tid('comm-sos'));
  check(await S.p.isDisabled(tid('sos-torch')), 'tarayıcıda flaş seçeneği pasif');
  await S.p.click(tid('sos-color-red'));
  await S.p.click(tid('sos-beep'));
  await S.p.click(tid('sos-start'));
  await S.p.waitForSelector(tid('sos-overlay'));
  const seen = new Set();
  const t0 = Date.now();
  while (Date.now() - t0 < 4000 && seen.size < 2) {
    seen.add(await S.p.evaluate(() => { const o = document.querySelector('[data-testid="sos-overlay"]'); return o?.getAttribute('data-on') + '|' + getComputedStyle(o).backgroundColor; }));
    await sleep(60);
  }
  check([...seen].some((s) => s === '1|rgb(255, 26, 26)') && [...seen].some((s) => s.startsWith('0|rgb(0, 0, 0)')), 'SOS: kırmızı ekran yanıp sönüyor ' + [...seen].join(' '));
  const beepG = await S.p.evaluate(() => window.__audio.gains.slice());
  check(beepG.includes(0.9) && beepG.includes(0), 'SOS bip sesi ışıkla açılıp kapanıyor');
  // SOS zamanlaması: ilk üç kısa parlama ~250 ms
  await S.p.keyboard.press('Escape');
  check(!(await S.p.$(tid('sos-overlay'))), 'Esc ile SOS ekranı kapandı');
  await S.p.click(tid('sos-steady'));
  check((await S.p.getAttribute(tid('sos-overlay'), 'data-on')) === '1', 'sürekli ışık açık');
  await S.p.click(tid('sos-overlay'));
  check(!(await S.p.$(tid('sos-overlay'))), 'ekrana dokununca kapandı');
  await S.p.evaluate(() => { window.__audio.gains.length = 0; window.__audio.osc.length = 0; });
  await S.p.click(tid('sos-whistle'));
  await sleep(2100); // 0,5 sn ses + 0,4 sn ara: üçüncü ses 1,8 sn'de başlar
  const wh = await S.p.evaluate(() => ({ g: window.__audio.gains.slice(), o: window.__audio.osc.slice() }));
  check(wh.o.some((o) => o.type === 'square' && o.f === 2900) && wh.o.some((o) => o.f === 3150), 'düdük: ~3 kHz kare dalga osilatörler');
  check(wh.g.filter((v) => v > 0).length === 3, 'düdük: 2,1 sn içinde üç kısa ses (' + wh.g.join(',') + ')');
  await S.p.click(tid('sos-siren'));
  check((await S.p.getAttribute(tid('sos-whistle'), 'aria-pressed')) === 'false' && (await S.p.getAttribute(tid('sos-siren'), 'aria-pressed')) === 'true', 'siren düdüğün yerini aldı');
  const sir = await S.p.evaluate(() => window.__audio.osc.some((o) => o.type === 'sawtooth'));
  check(sir, 'siren osilatörü');
  await S.p.click(tid('sos-siren'));
  check((await S.p.getAttribute(tid('sos-siren'), 'aria-pressed')) === 'false', 'siren durdu');
  // sayfadan çıkınca ses durur
  await S.p.click(tid('sos-whistle'));
  const st0 = await S.p.evaluate(() => window.__audio.stops);
  await S.p.click(tid('comm-back'));
  check((await S.p.evaluate(() => window.__audio.stops)) > st0, 'bölümden çıkınca düdük durdu');

  // Mors: ses ve ITU dışı yazımlar
  await S.p.goto(app + '?comm=mors', { waitUntil: 'domcontentloaded' });
  await S.p.fill(tid('morse-input'), 'Çağrı İŞÜ ı');
  check((await S.p.textContent(tid('morse-output'))).trim() === '-.-. .- --. .-. .. / .. ... ..- / ..', 'Türkçe harfler sadeleştirildi');
  await S.p.fill(tid('morse-input'), 'A#B');
  check(await waitText(S.p, tid('morse-unknown'), '#'), 'çevrilemeyen karakter bildirildi');
  await S.p.fill(tid('morse-input'), '··· −−− ···');
  check((await S.p.textContent(tid('morse-output'))).trim() === 'SOS', 'nokta (·) ve eksi (−) ile yazılan Mors çevrildi');
  await S.p.click(tid('morse-play-light'));
  check(await S.p.waitForFunction(() => document.querySelector('[data-testid="morse-lamp"]')?.getAttribute('data-on') === '1', null, { timeout: 2000 }).then(() => true, () => false), '·/− ile yazılan Mors ışıkla oynatılıyor');
  await S.p.click(tid('morse-play-light'));
  check((await S.p.textContent(tid('morse-play-light'))).includes('Işıkla gönder'), 'Mors ışığı durdu');
  await S.p.fill(tid('morse-input'), 'E');
  await S.p.evaluate(() => { window.__audio.gains.length = 0; });
  await S.p.click(tid('morse-play-sound'));
  check((await S.p.textContent(tid('morse-play-sound'))).includes('Durdur'), 'Mors sesi çalıyor');
  check(await S.p.waitForFunction(() => document.querySelector('[data-testid="morse-play-sound"]')?.textContent.includes('Sesle'), null, { timeout: 3000 }).then(() => true, () => false), 'Mors sesi bitince düğme eski haline döndü');
  const mg = await S.p.evaluate(() => window.__audio.gains.slice());
  check(mg[0] === 0.9 && mg[mg.length - 1] === 0, 'Mors "E": bir ton aç/kapa (' + mg.join(',') + ')');
  await S.p.fill(tid('morse-input'), '');
  check(await S.p.isDisabled(tid('morse-play-light')) && (await S.p.textContent(tid('morse-output'))).trim() === '—', 'boş girdide oynatma pasif');
  await S.p.fill(tid('morse-input'), 'SOS');
  await S.p.click(tid('morse-fullscreen'));
  check(await waitSel(S.p, tid('sos-overlay'), 3000), 'Mors tam ekran');
  check(await waitText(S.p, tid('sos-overlay'), 'Mors gönderiliyor'), 'tam ekran Mors etiketi');
  await S.p.click(tid('sos-stop'));
  await S.c.close();

  // Android fener
  const D = await ctx('D', { init: ANDROID_MOCK });
  await D.p.goto(app + '?comm=sos', { waitUntil: 'domcontentloaded' });
  await D.p.waitForSelector(tid('comm-sos'));
  check(await D.p.isChecked(tid('sos-torch')), 'Android: flaş seçeneği açık');
  await D.p.click(tid('sos-steady'));
  await sleep(200);
  await D.p.click(tid('sos-stop'));
  await sleep(100);
  check(JSON.stringify(await D.p.evaluate(() => window.__torch)) === '[true,false]', 'Android: sürekli ışıkta fener açılıp kapandı');
  await D.p.evaluate(() => { window.__torch.length = 0; window.__torchFail = true; });
  await D.p.click(tid('sos-start'));
  check(await waitText(D.p, tid('sos-overlay'), 'Telefon feneri açılamadı', 4000), 'Android: flaş yoksa uyarı');
  await D.p.click(tid('sos-stop'));
  await D.p.evaluate(() => { window.__torch.length = 0; window.__torchFail = false; });
  await D.p.click(tid('sos-torch'));
  await D.p.click(tid('sos-start'));
  await sleep(700);
  await D.p.click(tid('sos-stop'));
  check((await D.p.evaluate(() => window.__torch.length)) === 0, 'Android: flaş seçeneği kapalıyken fener yanmıyor');
  await D.p.goto(app + '?comm=mors', { waitUntil: 'domcontentloaded' });
  await D.p.fill(tid('morse-input'), 'E');
  await D.p.click(tid('morse-play-light'));
  await sleep(600);
  check(JSON.stringify(await D.p.evaluate(() => window.__torch)) === '[true,false]', 'Android: Mors ışığı feneri yaktı ve söndürdü');
  check(await waitText(D.p, '.cm-note', 'telefon flaşı da yanar'), 'Android: Mors notunda flaş bilgisi');
  await D.p.goto(app + '?comm=baglan', { waitUntil: 'domcontentloaded' });
  await D.p.click(tid('open-hotspot'));
  check(await D.p.evaluate(() => window.__hotspot === true), 'Android: erişim noktası ayarları açıldı');
  await D.c.close();

  // =========================================================================
  // 7) SMS: konumlu ve konum izni yok
  // =========================================================================
  await A.p.goto(app + '?comm=sms', { waitUntil: 'domcontentloaded' });
  await A.p.fill(tid('sms-place'), 'okul');
  await A.p.click(tid('sms-geo'));
  check(await waitText(A.p, tid('sms-geo-value'), '39.93340, 32.85970 · ±12 m'), 'SMS: konum alındı');
  const s1 = await A.p.inputValue(tid('sms-text'));
  check(s1 === 'İyiyim, okuldayım. Konum: 39.93340, 32.85970 (±12 m). — Ayşe Öztürk', 'iyiyim şablonu: ' + s1);
  check(await waitText(A.p, tid('sms-count'), 'Türkçe karakterler'), 'SMS sayacı Türkçe karakter uyarısı');
  await A.p.click(tid('sms-geo-clear'));
  check(!(await A.p.inputValue(tid('sms-text'))).includes('Konum'), 'konum çıkarıldı');
  await A.p.click(tid('sms-template-yardim'));
  await A.p.fill(tid('sms-note'), 'Enkaz altında 2 kişi var...');
  const s2 = await A.p.inputValue(tid('sms-text'));
  check(s2.startsWith('Yardıma ihtiyacım var. Enkaz altında 2 kişi var. Bulunduğum yer: okul.') && s2.includes("112'ye bildir"), 'yardım şablonu: ' + s2);
  await A.p.fill(tid('sms-text'), 'Elle düzenledim');
  check((await A.p.getAttribute(tid('sms-send-other'), 'href')) === 'sms:?body=Elle%20d%C3%BCzenledim', 'düzenlenen metin bağlantıya geçti');
  await A.p.click(tid('sms-copy'));
  check(await waitText(A.p, tid('sms-copy'), 'Kopyalandı'), 'kopyala');
  check((await A.p.evaluate(() => navigator.clipboard.readText())) === 'Elle düzenledim', 'pano içeriği doğru');
  await A.p.click(tid('sms-template-acil112'));
  check((await A.p.inputValue(tid('sms-text'))).startsWith('ACİL.'), 'şablon değişince düzenleme sıfırlandı');
  check(!(await A.p.$(tid('sms-send-family'))), 'aile numarası yokken "Aileye SMS" gizli');
  await A.p.fill(tid('sms-family'), '+90 (555) 111-22-33');
  check((await A.p.getAttribute(tid('sms-send-family'), 'href')).startsWith('sms:+905551112233?body='), 'numara temizlendi');
  check((await A.p.getAttribute(tid('sms-call-112'), 'href')) === 'tel:112', '112 arama bağlantısı');

  const N = await ctx('N', { opts: { permissions: [] } });
  await N.p.goto(app + '?comm=sms', { waitUntil: 'domcontentloaded' });
  await N.p.click(tid('sms-geo'));
  check(await waitText(N.p, '.cm-err', 'Konum izni verilmedi', 8000), 'konum izni yok: açık hata mesajı');
  const s3 = await N.p.inputValue(tid('sms-text'));
  check(s3 === 'İyiyim.', 'izin yokken şablon konumsuz: ' + s3);
  check((await N.p.textContent(tid('sms-geo'))).includes('Konumumu ekle'), 'konum düğmesi yeniden denenebilir');
  await shot(N.p, 'sms-izin-yok');
  await N.c.close();

  // iOS: &body=
  const I = await ctx('I', { opts: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148' } });
  await I.p.goto(app + '?comm=sms', { waitUntil: 'domcontentloaded' });
  check((await I.p.getAttribute(tid('sms-send-other'), 'href')).startsWith('sms:&body='), 'iOS: sms:&body= biçimi');
  await I.c.close();

  // =========================================================================
  // 8) Yerleşim: üç genişlikte her bölüm
  // =========================================================================
  for (const [w, h] of [[360, 640], [390, 844], [1280, 800]]) {
    await A.p.setViewportSize({ width: w, height: h });
    for (const s of ['home', ...SECTIONS]) {
      await A.p.goto(app + (s === 'home' ? '?tab=iletisim' : '?comm=' + s), { waitUntil: 'domcontentloaded' });
      await A.p.waitForSelector(s === 'home' ? tid('comm-home') : tid('comm-' + s));
      await sleep(150);
      const l = await layout(A.p);
      check(l.sw <= l.W && l.over.length === 0 && l.small.length === 0, `${w}px ${s}: taşma yok, hedefler ≥44px` + (l.over.length || l.small.length ? ' ' + JSON.stringify(l) : ''));
      if (w !== 390) await shot(A.p, `${w}-${s}`);
    }
  }

  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ':\n  ' + errors.join('\n  ') : ''));
} catch (e) {
  check(false, 'beklenmeyen hata: ' + (e?.stack ?? e));
} finally {
  await b.close();
  await srv.close().catch(() => {});
  await srvRate.close().catch(() => {});
  for (const d of [data, data2, dist]) fs.rmSync(d, { recursive: true, force: true });
}
console.log('Ekran görüntüleri:', shots);
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
