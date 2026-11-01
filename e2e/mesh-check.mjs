// Şebekesiz mesh JS katmanının tarayıcıda uçtan uca denetimi.
// İki sayfa = iki "telefon". AkilMesh Capacitor eklentisi taklit edilir;
// Nearby yerine Node bu iki sayfa arasında baytları taşır.
//   node e2e/mesh-check.mjs http://localhost:5199/
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:5199/';
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const b = await pw.chromium.launch();
const errors = [];

// 1) Düz tarayıcı: eklenti yok → zarifçe kapalı
{
  const p = await b.newPage();
  p.on('pageerror', (e) => errors.push('plain: ' + e.message));
  await p.goto(base, { waitUntil: 'networkidle' });
  const r = await p.evaluate(async () => {
    const { mesh } = await import('/src/lib/mesh.ts');
    return { a: mesh.available(), s: await mesh.start('Ali'), send: await mesh.send({ id: 'abcdefgh12', kind: 'mesaj', from: 'Ali', text: 'x', time: Date.now() }), peers: mesh.peers() };
  });
  check(r.a === false && r.s === false && r.send === false && r.peers === 0, 'tarayıcıda available/start/send false');
  await p.close();
}

// 2) İki telefon, taklit Nearby
const phones = {};
async function phone(id) {
  const p = await b.newPage();
  p.on('pageerror', (e) => errors.push(id + ': ' + e.message));
  p.on('console', (m) => m.type() === 'error' && errors.push(id + ' console: ' + m.text()));
  await p.exposeFunction('__meshOut', (to, data) => {
    const other = id === 'A' ? 'B' : 'A';
    if (to && to !== 'EP_' + other) return 0;
    phones[other].evaluate(([from, data]) => window.__meshEmit('meshMessage', { from, data }), ['EP_' + id, data]);
    return 1;
  });
  await p.addInitScript(() => {
    const ls = {};
    window.__meshEmit = (ev, d) => (ls[ev] || []).forEach((cb) => cb(d));
    window.Capacitor = {
      getPlatform: () => 'android', isNativePlatform: () => true, isPluginAvailable: (n) => n === 'AkilMesh',
      Plugins: { AkilMesh: {
        isAvailable: async () => ({ available: true, gms: true, maxBytes: 32768, sdk: 34 }),
        start: async () => ({ started: true }),
        stop: async () => ({}),
        send: async (o) => ({ sent: await window.__meshOut(o.to, o.data) }),
        getPeers: async () => ({ peers: [] }),
        addListener: async (ev, cb) => { (ls[ev] ||= []).push(cb); return { remove() {} }; },
      } },
    };
  });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.evaluate(async (name) => {
    localStorage.removeItem('akil.mesh.store.v1');
    const { mesh } = await import('/src/lib/mesh.ts');
    window.__mesh = mesh;
    window.__got = [];
    mesh.onMessage((m) => window.__got.push(m));
    window.__started = await mesh.start(name);
  }, id === 'A' ? 'Ayşe' : 'Burak');
  phones[id] = p;
  return p;
}
const A = await phone('A');
const B = await phone('B');
check(await A.evaluate(() => window.__mesh.available() && window.__started), 'A: Android taklidinde başladı');

// A bağlantı yokken mesaj bırakır (biriktir)
await A.evaluate(() => window.__mesh.send({ id: window.__id = Date.now().toString(36) + '-offlineAAA', kind: 'iyiyim', from: 'Ayşe', text: 'Ailecek iyiyiz, toplanma alanındayız', time: Date.now() }));
// Bağlantı kurulur
await A.evaluate(() => window.__meshEmit('meshPeers', { peers: [{ id: 'EP_B', node: 'nodeB', name: 'Burak', connected: true }] }));
await B.evaluate(() => window.__meshEmit('meshPeers', { peers: [{ id: 'EP_A', node: 'nodeA', name: 'Ayşe', connected: true }] }));
await B.waitForFunction(() => window.__got.length >= 1, null, { timeout: 5000 }).catch(() => {});
const gotB = await B.evaluate(() => window.__got);
check(gotB.length === 1 && gotB[0].text.startsWith('Ailecek') && gotB[0].hops === 1, 'B, bağlanınca A\'nın bekleyen mesajını aldı (özet değişimi)');
check((await B.evaluate(() => window.__mesh.peers())) === 1, 'B: 1 komşu');

// Canlı mesaj B → A
await B.evaluate(() => window.__mesh.send({ id: Date.now().toString(36) + '-liveBBBBBB', kind: 'mesaj', from: 'Burak', text: 'Su dağıtımı okulda, saat 14:00', time: Date.now() }));
await A.waitForFunction(() => window.__got.length >= 1, null, { timeout: 5000 }).catch(() => {});
const gotA = await A.evaluate(() => window.__got);
check(gotA.length === 1 && gotA[0].from === 'Burak', 'A canlı mesajı aldı (eager push)');

// Yeniden bağlanma: kopya bildirilmez
for (const [p, ep] of [[A, 'EP_B'], [B, 'EP_A']]) await p.evaluate((ep) => { window.__meshEmit('meshPeers', { peers: [] }); window.__meshEmit('meshPeers', { peers: [{ id: ep, connected: true }] }); }, ep);
await A.waitForTimeout(500);
check((await A.evaluate(() => window.__got.length)) === 1 && (await B.evaluate(() => window.__got.length)) === 1, 'yeniden bağlanınca kopya yok');
await A.waitForTimeout(600);
check((await B.evaluate(() => JSON.parse(localStorage.getItem('akil.mesh.store.v1') || '[]').length)) === 2, 'B mesajları kalıcı kaydetti');

// Yalnızca mesh kaynaklı hatalar sayılır (başka ajanların yarım dosyaları bu denetimin konusu değil)
const meshErr = errors.filter((e) => /mesh/i.test(e));
if (errors.length > meshErr.length) console.log('(mesh dışı hatalar yok sayıldı: ' + (errors.length - meshErr.length) + ')');
check(meshErr.length === 0, 'mesh kaynaklı konsol hatası yok' + (meshErr.length ? ': ' + meshErr.join(' | ') : ''));
await b.close();
console.log(fails.length ? `\n${fails.length} HATA` : '\nHEPSİ TAMAM');
process.exit(fails.length ? 1 : 0);
