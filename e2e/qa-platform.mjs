// QA (platform): bilgi noktası sunucusu, derleme çıktısı, Android yapılandırması,
// Windows betikleri ve uygulamanın sunucu üzerinden açılışı.
//   npm run build   (dist/ güncel olmalı)
//   node e2e/qa-platform.mjs [--shots /tmp/qa-platform]
// Çıkış kodu: hata varsa 1.
import { createRequire } from 'module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const shots = argv.includes('--shots') ? argv[argv.indexOf('--shots') + 1] : '/tmp/qa-platform';
fs.mkdirSync(shots, { recursive: true });

const fails = [];
const check = (ok, msg) => { console.log((ok ? 'OK   ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };
const read = (p) => fs.readFileSync(path.join(ROOT, p));
const readText = (p) => read(p).toString('utf8');

// ---------------------------------------------------------------------------
// 1) Derleme çıktısı: ilk yükleme ve kod bölme
{
  const html = readText('dist/index.html');
  const entries = [...html.matchAll(/<script[^>]*type="module"[^>]*src="\.\/assets\/([^"]+)"/g)].map((m) => m[1]);
  const preloads = [...html.matchAll(/rel="modulepreload"[^>]*href="\.\/assets\/([^"]+)"/g)].map((m) => m[1]);
  check(entries.length === 1, 'dist/index.html tek giriş betiği: ' + entries.join(','));
  const entry = read('dist/assets/' + entries[0]);
  const initial = entry.length + preloads.reduce((n, f) => n + read('dist/assets/' + f).length, 0);
  check(initial < 1.8e6, `ilk yüklenen JS ${(initial / 1e6).toFixed(2)} MB (< 1,8 MB)`);
  const s = entry.toString('utf8');
  check(!/maplibre-gl|ort-wasm|transformers\.web/.test(preloads.join(' ')), 'harita / ONNX / transformers ön yüklenmiyor');
  check(!s.includes('Yandan görünüş: oturma odasında yetişkin'), 'çizim şartnamesi (SPEC) ana pakette değil');
  check(!s.includes('Örnek sahne') && !s.includes('_ornek'), 'örnek sahneler ana pakette değil');
  const assets = fs.readdirSync(path.join(ROOT, 'dist/assets'));
  check(assets.some((f) => /^ort-wasm.*\.wasm$/.test(f)), 'ONNX Runtime wasm paketlendi (çevrimdışı ses tanıma)');
  check(assets.some((f) => /^wllama.*\.wasm$/.test(f)), 'wllama wasm paketlendi');
  check(assets.some((f) => /^maplibre-[^w].*\.js$/.test(f)), 'maplibre ayrı parça');
  // PWA / web derlemesi (bilgi noktası: Windows, Raspberry Pi, telefon tarayıcısı)
  const css = readText('src/styles/app.css');
  const bg = (css.match(/--bg:\s*(#[0-9a-f]{6})/i) ?? [])[1]?.toLowerCase();
  check(/name="viewport"[^>]*viewport-fit=cover/.test(html), 'index.html: viewport-fit=cover (çentik / güvenli alan)');
  check((html.match(/name="theme-color" content="(#[0-9a-fA-F]{6})"/) ?? [])[1]?.toLowerCase() === bg, 'index.html: theme-color gece mavisi zeminle aynı (' + bg + ')');
  check(/name="color-scheme" content="dark"/.test(html) && /id="acilis"/.test(html) && /<noscript>/.test(html), 'index.html: koyu renk düzeni, açılış ekranı ve noscript notu');
  const man = JSON.parse(readText('dist/manifest.webmanifest'));
  check(man.theme_color.toLowerCase() === bg && man.background_color.toLowerCase() === bg && man.display === 'standalone' && man.lang === 'tr', 'manifest: renkler, standalone, tr');
  for (const [n, purpose] of [[192, 'any'], [512, 'any'], [192, 'maskable'], [512, 'maskable']]) {
    const ic = man.icons.find((i) => i.sizes === `${n}x${n}` && i.purpose === purpose && i.type === 'image/png');
    const buf = ic && fs.existsSync(path.join(ROOT, 'dist', ic.src)) ? read('dist/' + ic.src) : null;
    check(!!buf && buf.readUInt32BE(16) === n && buf.readUInt32BE(20) === n, `manifest: ${n}×${n} ${purpose} PNG simge var ve boyutu doğru`);
  }
}

// ---------------------------------------------------------------------------
// 2) Android yapılandırması
{
  const man = readText('android/app/src/main/AndroidManifest.xml');
  for (const p of ['INTERNET', 'RECORD_AUDIO', 'WAKE_LOCK', 'ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'ACCESS_WIFI_STATE',
    'CHANGE_WIFI_STATE', 'BLUETOOTH_SCAN', 'BLUETOOTH_ADVERTISE', 'BLUETOOTH_CONNECT', 'NEARBY_WIFI_DEVICES', 'BLUETOOTH', 'BLUETOOTH_ADMIN']) {
    check(man.includes(`android.permission.${p}"`), 'manifest izni: ' + p);
  }
  const plugins = fs.existsSync(path.join(ROOT, 'android/app/src/main/assets/capacitor.plugins.json'))
    ? readText('android/app/src/main/assets/capacitor.plugins.json') : '';
  check(plugins.includes('@capacitor-community/text-to-speech'), 'TTS eklentisi capacitor.plugins.json içinde (npx cap sync android)');
  check(readText('android/capacitor.settings.gradle').includes(':capacitor-community-text-to-speech'), 'TTS eklentisi Gradle ayarlarında');
  const main = readText('android/app/src/main/java/org/akilcantasi/app/MainActivity.java');
  check(/registerPlugin\(AkilCantasiPlugin\.class\)/.test(main) && /registerPlugin\(AkilMeshPlugin\.class\)/.test(main), 'yerel eklentiler kayıtlı');
  const ips = readText('android/app/src/main/java/org/akilcantasi/app/InfoPointServer.java');
  check(ips.includes('".tar"') && ips.includes('Content-Security-Policy'), 'telefon bilgi noktası .tar ve CSP destekli');
}

// ---------------------------------------------------------------------------
// 3) Windows betikleri (Windows'ta çalıştırılamadığı için yapısal denetim)
{
  for (const f of ['onizle.cmd', 'apk-derle.cmd', 'paketleri-yerlestir.cmd', 'server/start-windows.cmd']) {
    const b = read(f).toString('latin1');
    check(b.includes('\r\n') && !/[^\r]\n/.test(b), f + ': CRLF satır sonları');
    check(!/[\x80-\xff]/.test(b), f + ': yalnızca ASCII (cmd.exe kod sayfası sorunları olmasın)');
    const m = b.match(/tools\\([\w-]+\.ps1)/);
    if (m) check(fs.existsSync(path.join(ROOT, 'tools', m[1])), f + ' → tools/' + m[1] + ' var');
  }
  for (const f of ['tools/onizle.ps1', 'tools/apk-derle.ps1', 'tools/paketleri-yerlestir.ps1']) {
    const b = read(f);
    check(b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf, f + ': UTF-8 BOM (Windows PowerShell 5.1 Türkçe karakterleri doğru okusun)');
    const t = b.toString('utf8');
    // "$degisken:" çift tırnak içinde PowerShell'de sürücü/kapsam sanılır → ayrıştırma hatası
    const bad = [...t.matchAll(/"[^"\n]*\$(?!env:|global:|script:|using:)[A-Za-z_]\w*:[^"\n]*"/g)].map((x) => x[0]);
    check(bad.length === 0, f + ': "$ad:" kalıbı yok' + (bad.length ? ' → ' + bad.join(' | ') : ''));
    let depth = 0;
    for (const ch of t.replace(/'[^'\n]*'/g, '').replace(/#.*$/gm, '')) { if (ch === '{') depth++; if (ch === '}') depth--; }
    check(depth === 0, f + ': süslü parantezler dengeli');
  }
  const py = readText('tools/paketleri-yerlestir.ps1');
  const want = ['qwen2.5-3b-instruct-q4_k_m.gguf', 'Qwen3.5-2B-Q4_K_M.gguf', 'wiktionary_tr_all_nopic_2026-10.zim', 'mdwiki_en_all_maxi_2025-11.zim',
    'zimgit-post-disaster_en_2024-05.zim', 'zimgit-water_en_2024-08.zim', 'zimgit-medicine_en_2024-08.zim', 'zimgit-knots_en_2024-08.zim',
    'zimgit-food-preparation_en_2025-04.zim', 'wikibooks_tr_all_maxi_2026-09.zim', 'wikisource_tr_all_nopic_2026-10.zim',
    "'onnx/encoder_model_quantized.onnx'", "'onnx/decoder_model_merged_quantized.onnx'", "'tokenizer_config.json'", "'preprocessor_config.json'"];
  for (const w of want) check(py.includes(w), 'paketleri-yerlestir.ps1 tanır: ' + w);
  check(/--format', 'ustar'|--format ustar/.test(py), 'ses paketi ustar biçiminde');
  check(!/Remove-Item[^\n]*\$Kaynak/.test(py), 'paketleri-yerlestir.ps1 kaynak klasörden silmez (yalnızca taşır)');
  check(readText('tools/apk-derle.ps1').includes("-ge 22"), 'apk-derle.ps1 Node 22+ ister (Capacitor 8 CLI)');
  check(readText('README.md').includes('Qwen Research'), 'README Qwen2.5-3B lisans notu');
}

// ---------------------------------------------------------------------------
// 4) Sunucu uç noktaları (gerçek dist/ + geçici data/)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-platform-'));
const data = path.join(tmp, 'data');
for (const d of ['zim', 'models', 'ses', '_gecici']) fs.mkdirSync(path.join(data, d), { recursive: true });
const zimBytes = Buffer.alloc(64 * 1024, 7);
fs.writeFileSync(path.join(data, 'zim', 'Türkçe sözlük.zim'), zimBytes);
fs.writeFileSync(path.join(data, 'models', 'Qwen3.5-2B-Q4_K_M.gguf'), Buffer.alloc(4096, 1));
fs.writeFileSync(path.join(data, 'ses', 'whisper-base-ses.tar'), Buffer.alloc(10240, 0));
fs.writeFileSync(path.join(data, '_gecici', 'gizli.zim'), 'x');
fs.writeFileSync(path.join(data, 'notlar.txt'), 'gizli');
const srv = await startServer({ port: 0, host: '127.0.0.1', data, apkDirs: [data] });
const base = `http://127.0.0.1:${srv.port}`;
const raw = (p, method = 'GET', headers = {}) => new Promise((res, rej) => {
  const r = http.request({ host: '127.0.0.1', port: srv.port, path: p, method, headers }, (x) => {
    const chunks = []; x.on('data', (c) => chunks.push(c)); x.on('end', () => res({ status: x.statusCode, headers: x.headers, body: Buffer.concat(chunks) }));
  });
  r.on('error', rej); r.end();
});

try {
  const st = await (await fetch(base + '/api/status')).json();
  check(st.server === true && typeof st.port === 'number' && Array.isArray(st.addresses) && st.apk === false, '/api/status biçimi');
  const packs = (await (await fetch(base + '/api/packs')).json()).files;
  const names = packs.map((f) => f.name);
  check(names.includes('Türkçe sözlük.zim') && names.includes('Qwen3.5-2B-Q4_K_M.gguf') && names.includes('whisper-base-ses.tar'), '/api/packs alt klasörleri listeler: ' + names.join(', '));
  check(!names.includes('gizli.zim') && !names.includes('notlar.txt') && !names.includes('board.json'), '/api/packs gizli/geçersiz dosyaları listelemez');
  const tz = packs.find((f) => f.name === 'Türkçe sözlük.zim');
  check(tz?.url === './data/zim/' + encodeURIComponent('Türkçe sözlük.zim'), 'Türkçe adlı paketin adresi kodlanmış: ' + tz?.url);
  const r1 = await fetch(base + tz.url.slice(1), { headers: { Range: 'bytes=100-199' } });
  check(r1.status === 206 && r1.headers.get('content-range') === `bytes 100-199/${zimBytes.length}` && (await r1.arrayBuffer()).byteLength === 100, 'Türkçe adlı ZIM Range 206');
  const r2 = await fetch(base + '/data/ses/whisper-base-ses.tar', { method: 'HEAD' });
  check(r2.status === 200 && r2.headers.get('content-length') === '10240' && r2.headers.get('accept-ranges') === 'bytes', 'ses .tar HEAD');
  check((await raw('/data/ses/whisper-base-ses.tar', 'GET', { Range: 'bytes=20000-' })).status === 416, 'karşılanamayan aralık 416');
  check((await raw('/data/notlar.txt')).status === 404, 'bilinmeyen uzantı sunulmaz');
  check((await raw('/data/..%2F..%2Fetc%2Fpasswd')).status === 403, 'dizin dışına çıkma 403');
  // Pano
  const post = (o) => fetch(base + '/api/board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) });
  const p1 = await post({ id: 'qa-plat-0001', kind: 'mesaj', from: 'QA', text: 'Merhaba, su dağıtımı saat 15:00’te.' });
  check(p1.status === 201, 'pano kaydı eklendi (201)');
  const bl = await (await fetch(base + '/api/board?since=0')).json();
  check(bl.items.some((i) => i.id === 'qa-plat-0001' && i.text.includes('dağıtımı')), 'pano GET Türkçe metni döndürür');
  check((await post({ id: 'x', kind: 'mesaj', from: 'QA', text: 'a' })).status === 400, 'geçersiz pano kaydı 400');
  await srv.close(); // board.json diske yazılsın
  check(fs.existsSync(path.join(data, 'board.json')), 'data/board.json yazıldı');
} catch (e) {
  check(false, 'sunucu denetimi: ' + e.message);
}
const srv2 = await startServer({ port: 0, host: '127.0.0.1', data, apkDirs: [data] });
const base2 = `http://127.0.0.1:${srv2.port}`;
const raw2 = (p) => new Promise((res, rej) => {
  http.request({ host: '127.0.0.1', port: srv2.port, path: p }, (x) => { x.resume(); x.on('end', () => res(x.statusCode)); }).on('error', rej).end();
});
try {
  for (const p of ['/data/board.json', '/data//board.json', '/data/board%2Ejson', '/data/zim/../board.json']) {
    check((await raw2(p)) === 404, 'board.json paket gibi okunamaz: ' + p);
  }
  // APK
  check((await fetch(base2 + '/download/akil-cantasi.apk')).status === 404, 'APK yokken 404');
  fs.writeFileSync(path.join(data, 'akil-cantasi.apk'), Buffer.alloc(2048, 3));
  const apk = await fetch(base2 + '/download/akil-cantasi.apk');
  check(apk.status === 200 && apk.headers.get('content-type') === 'application/vnd.android.package-archive' && /attachment/.test(apk.headers.get('content-disposition') ?? ''), 'APK indirilir');
  check((await (await fetch(base2 + '/api/status')).json()).apk === true, '/api/status apk: true');
  // Başlıklar
  for (const p of ['/', '/api/status', '/api/packs', '/data/ses/whisper-base-ses.tar', '/index.html', '/?tab=fener', '/olmayan-yol']) {
    const r = await fetch(base2 + p, { method: 'HEAD' });
    const h = (k) => r.headers.get(k) ?? '';
    check(h('cross-origin-opener-policy') === 'same-origin' && h('cross-origin-embedder-policy') === 'require-corp' && h('cross-origin-resource-policy') === 'cross-origin' &&
      h('content-security-policy').includes("script-src 'self' 'wasm-unsafe-eval'") && h('content-security-policy').includes("object-src 'none'"), 'COOP/COEP/CORP/CSP: ' + p);
  }
  const wasm = fs.readdirSync(path.join(ROOT, 'dist/assets')).find((f) => f.endsWith('.wasm'));
  const wr = await fetch(base2 + '/assets/' + wasm, { method: 'HEAD' });
  check(wr.headers.get('content-type') === 'application/wasm' && /immutable/.test(wr.headers.get('cache-control') ?? ''), 'wasm MIME ve uzun önbellek');
  check((await fetch(base2 + '/assets/yok.js')).status === 404, 'eksik varlık 404 (SPA geri dönüşü yok)');
} catch (e) {
  check(false, 'sunucu denetimi 2: ' + e.message);
}

// ---------------------------------------------------------------------------
// 5) Uygulama bilgi noktası üzerinden açılır (CSP altında hata yok, paketler görünür)
const browser = await pw.chromium.launch();
try {
  for (const vp of [{ w: 390, h: 844 }, { w: 360, h: 640 }, { w: 1280, h: 800 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    const failed = [];
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    let jsBytes = 0;
    page.on('response', async (r) => { if (r.url().endsWith('.js') && r.request().resourceType() === 'script') jsBytes += Number(r.headers()['content-length'] ?? 0); });
    await page.goto(base2 + '/?tool=paylas', { waitUntil: 'networkidle' });
    check(await page.evaluate(() => crossOriginIsolated), `${vp.w}px: crossOriginIsolated`);
    await page.waitForSelector('[data-testid="pack-row"][data-pack="whisper-base-ses.tar"]', { timeout: 15000 }).catch(() => {});
    const rows = await page.$$eval('[data-testid="pack-row"]', (els) => els.map((e) => e.getAttribute('data-pack')));
    check(['Türkçe sözlük.zim', 'Qwen3.5-2B-Q4_K_M.gguf', 'whisper-base-ses.tar'].every((n) => rows.includes(n)), `${vp.w}px: Paketler aracı sunucu paketlerini gösteriyor`);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(ov <= 0, `${vp.w}px: yatay taşma yok (${ov})`);
    await page.screenshot({ path: `${shots}/paketler-${vp.w}.png` });
    // Ses paketi Fener'de tanınır mı (ad etiketi)
    if (vp.w === 390) {
      check(jsBytes < 2.5e6, `açılışta indirilen JS ${(jsBytes / 1e6).toFixed(2)} MB`);
      await page.goto(base2 + '/?tab=fener', { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${shots}/fener-390.png` });
    }
    // Bu test ortamında internet yok: isteğe bağlı çevrimiçi katalog (https://…) isteği başarısız olur
    const external = failed.filter((u) => !u.startsWith(base2));
    if (external.length) console.log('     (dış istek başarısız, beklenen: ' + [...new Set(external)].join(', ') + ')');
    const relevant = errs.filter((e) => !/favicon/i.test(e) && !(external.length && /ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED/.test(e)));
    check(failed.filter((u) => u.startsWith(base2)).length === 0, `${vp.w}px: yerel istekler başarılı`);
    check(relevant.length === 0, `${vp.w}px: konsol hatası / CSP ihlali yok` + (relevant.length ? ': ' + relevant.slice(0, 4).join(' | ') : ''));
    await ctx.close();
  }
} catch (e) {
  check(false, 'tarayıcı denetimi: ' + e.message);
} finally {
  await browser.close();
  await srv2.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(fails.length ? `\n${fails.length} HATA` : '\nTÜMÜ OK');
process.exit(fails.length ? 1 : 0);
