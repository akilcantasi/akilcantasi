// Android yerel bilgi noktası akışı (Capacitor eklentisi taklit edilerek):
//   node e2e/native-infopoint-check.mjs http://localhost:8090/
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:8090/';
const shots = process.argv[3] ?? '/tmp';
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.addInitScript(() => {
  let running = false;
  const calls = (window.__calls = []);
  const st = () => (running ? { running: true, port: 8080, addresses: ['192.168.43.1'], clients: 2 } : { running: false });
  window.Capacitor = {
    getPlatform: () => 'android', isNativePlatform: () => true,
    Plugins: { AkilCantasi: {
      startInfoPoint: async (o) => { calls.push('start:' + o.port); running = true; return st(); },
      stopInfoPoint: async () => { calls.push('stop'); running = false; return { running: false }; },
      getInfoPointStatus: async () => st(),
      openHotspotSettings: async () => { calls.push('hotspot'); return { opened: true }; },
      shareApk: async () => { calls.push('share'); return { shared: true }; },
    } },
  };
});
await p.goto(base, { waitUntil: 'networkidle' });
await p.click('[data-testid="nav-araclar"]');
await p.click('[data-testid="tool-card-paylas"]');
await p.waitForTimeout(800);
check((await p.textContent('[data-testid="share-status"]')).includes('kapalı'), 'başlangıçta kapalı');
check(await p.isEnabled('[data-testid="infopoint-switch"]'), 'anahtar Android\'de etkin');
await p.click('[data-testid="infopoint-switch"]');
await p.waitForSelector('[data-testid="share-url"]', { timeout: 5000 });
check((await p.textContent('[data-testid="share-url"]')).trim() === 'http://192.168.43.1:8080', 'telefon adresi gösteriliyor');
check((await p.textContent('[data-testid="share-clients"]')).trim() === '2', 'bağlı cihaz sayısı');
check(!!(await p.$('[data-testid="share-qr"]')), 'QR kod');
await p.screenshot({ path: shots + '/native-infopoint-on.png', fullPage: true });
await p.click('[data-testid="infopoint-stop"]');
await p.waitForTimeout(800);
check((await p.textContent('[data-testid="share-status"]')).includes('kapalı'), 'durdurulunca kapalı');
const calls = await p.evaluate(() => window.__calls);
check(calls.includes('start:8080') && calls.includes('stop'), 'eklenti çağrıları: ' + calls.join(','));
await b.close();
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
