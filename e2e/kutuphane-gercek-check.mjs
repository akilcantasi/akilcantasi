// Kütüphane: gerçek ZIM dosyalarını üç okuma yolundan da baştan sona okur.
//
//   node e2e/kutuphane-gercek-check.mjs [zim-klasörü]        (varsayılan /home/claude/realzim)
//
// Klasör yoksa ya da içinde .zim yoksa atlanır (çıkış kodu 0).
//
// Yollar:
//   android    — Android uygulaması: paketler /_paket/<dosya>?aralik=bas-son ile okunur. Sunucu,
//                MainActivity.packResponse'un BİREBİR taklidi (aynı durum kodları, başlıklar, aralık
//                anlamı, yalnız "localhost" adı); Capacitor eklentisi taklit edilir (paketListesi).
//   bilgi      — Bilgisayar / bilgi noktası: gerçek server/server.mjs (/api/packs, /data/ Range).
//   opfs       — Tarayıcı deposu (OPFS): dosyalar içe aktarılır, BlobSource ile okunur.
//                (AC_OPFS_MAX bayttan büyük dosyalar bu yolda atlanır; varsayılan 200 MB.)
// Seçenekler (ortam değişkeni): AC_YOLLAR=android,bilgi,opfs  AC_DOSYA=<dosya adı düzenli ifadesi>
//
// Her dosya ve yol için: kaynak açılır, ana sayfa (ya da Nautilus kitap listesi), görseller,
// iç bağlantılar, başlık ve tam metin araması, PDF'ler (sayfa çizilir ve BOŞ olmadığı denetlenir).
// Kütüphane katmanı Vite geliştirme sunucusundan, uygulamanın kendi modülleriyle (src/lib) çalışır;
// arayüz yeniden tasarlanırken de geçerli kalsın diye düğme kimliklerine bağlı değildir.
// Ek olarak üretim derlemesi (dist/, CSP'li) Android taklidiyle açılır ve kaynakların listelendiği
// ile sayfa hatası olmadığı denetlenir (dist yoksa bu adım atlanır).
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZIM_DIR = process.argv[2] || process.env.AC_REAL_ZIM_DIR || '/home/claude/realzim';
const OPFS_MAX = Number(process.env.AC_OPFS_MAX || 200e6);
const YOLLAR = (process.env.AC_YOLLAR || 'android,bilgi,opfs').split(',');

const SUZGEC = process.env.AC_DOSYA ? new RegExp(process.env.AC_DOSYA, 'i') : null;
const zimler = fs.existsSync(ZIM_DIR) ? fs.readdirSync(ZIM_DIR).filter((n) => /\.zim$/i.test(n) && !n.startsWith('.') && (!SUZGEC || SUZGEC.test(n))).sort() : [];
if (!zimler.length) {
  console.log(`atlandı: ${ZIM_DIR} içinde .zim yok`);
  process.exit(0);
}

let pw;
try {
  pw = require('playwright');
} catch {
  pw = require('/opt/npm-tools/node_modules/playwright');
}

// Paket klasörü: bağlantılar (bilgi noktası sunucusu klasöre kendi anahtar dosyasını yazar;
// özgün klasör kirlenmesin)
const PAKET = fs.mkdtempSync(path.join(os.tmpdir(), 'kt-gercek-'));
for (const n of zimler) fs.symlinkSync(fs.realpathSync(path.join(ZIM_DIR, n)), path.join(PAKET, n));
const dosyalar = zimler.map((name) => ({ name, size: fs.statSync(path.join(PAKET, name)).size }));

// ---------------------------------------------------------------------------
// MainActivity.packResponse taklidi (android/app/src/main/java/org/akilcantasi/app/MainActivity.java)
// ---------------------------------------------------------------------------
const PACK_EXT = ['.zim', '.gguf', '.pmtiles', '.geojson', '.json', '.tar'];
/** PaketIndirici.isPackName */
function isPackName(n) {
  if (!n || n.startsWith('.') || n.includes('/') || n.includes('\\') || n.includes('..')) return false;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(n)) return false;
  return PACK_EXT.some((e) => n.toLowerCase().endsWith(e));
}
const ORTAK = { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp', 'Cross-Origin-Resource-Policy': 'cross-origin' };
let paketIstek = 0;
function packResponse(req, res, u) {
  paketIstek++;
  // getUrl().getPath() çözülmüş yoldur
  let name = u.pathname.slice('/_paket/'.length);
  try {
    name = decodeURIComponent(name);
  } catch {}
  const h = { ...ORTAK, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
  const head = req.method === 'HEAD';
  const yanit = (status, extra, file, start, end) => {
    res.writeHead(status, { ...h, ...extra });
    if (!file || head) return res.end();
    fs.createReadStream(file, { start, end }).pipe(res);
  };
  const metin = { 'Content-Type': 'text/plain' };
  if (!isPackName(name)) return yanit(404, metin);
  const f = path.join(PAKET, name);
  if (!fs.existsSync(f) || !fs.statSync(f).isFile()) return yanit(404, metin);
  const size = fs.statSync(f).size;
  const mime = name.endsWith('.json') || name.endsWith('.geojson') ? 'application/json' : 'application/octet-stream';
  const rangeError = () => yanit(416, { ...metin, 'Content-Range': 'bytes */' + size });
  const q = u.searchParams.get('aralik');
  if (q != null) {
    const qm = /^(\d+)-(\d+)$/.exec(q);
    if (!qm) return rangeError();
    const start = Number(qm[1]);
    const end = Math.min(size - 1, Number(qm[2]));
    if (start >= size || start > end) return rangeError();
    return yanit(200, { 'Content-Type': mime, 'Content-Length': String(end - start + 1), 'X-Aralik': `${start}-${end}/${size}` }, f, start, end);
  }
  const range = req.headers.range;
  if (range == null) return yanit(200, { 'Content-Type': mime, 'Content-Length': String(size) }, f, 0, size - 1);
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) return rangeError();
  let start, end;
  if (m[1] === '') {
    const n = m[2] === '' ? 0 : Number(m[2]);
    start = Math.max(0, size - n);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(size - 1, Number(m[2]));
  }
  if (start >= size || start > end) return rangeError();
  return yanit(206, { 'Content-Type': mime, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) }, f, start, end);
}

// ---------------------------------------------------------------------------
// Sunucular
// ---------------------------------------------------------------------------
const bosPort = () =>
  new Promise((ok) => {
    const s = http.createServer().listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => ok(p));
    });
  });

const BN_PORT = await bosPort();
const DIST = path.join(KOK, 'dist');
const bn = spawn(process.execPath, [path.join(KOK, 'server/server.mjs'), '--data', PAKET, '--dist', fs.existsSync(DIST) ? DIST : PAKET, '--port', String(BN_PORT)], { stdio: ['ignore', 'pipe', 'pipe'] });
let bnLog = '';
bn.stdout.on('data', (d) => (bnLog += d));
bn.stderr.on('data', (d) => (bnLog += d));
for (let i = 0; i < 100; i++) {
  const ok = await fetch(`http://127.0.0.1:${BN_PORT}/api/packs`).then((r) => r.ok).catch(() => false);
  if (ok) break;
  await new Promise((r) => setTimeout(r, 100));
}

/** Bilgi noktasına aktarım: sayfa ile aynı kökenden (gerçek bilgi noktasındaki gibi) */
function aktar(req, res) {
  const p = http.request({ host: '127.0.0.1', port: BN_PORT, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${BN_PORT}` } }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  p.on('error', () => {
    res.writeHead(502);
    res.end();
  });
  req.pipe(p);
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.json': 'application/json', '.pfb': 'application/octet-stream' };
/** Üretim derlemesi /prod/ altında (Capacitor'ün yerel sunucusu gibi düz dosya) */
function prod(req, res, u) {
  let p = path.join(DIST, decodeURIComponent(u.pathname.slice('/prod'.length)) || '/');
  if (!p.startsWith(DIST)) {
    res.writeHead(403);
    return res.end();
  }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) {
    res.writeHead(404, ORTAK);
    return res.end();
  }
  res.writeHead(200, { ...ORTAK, 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}

const { createServer: viteSunucusu } = await import(path.join(KOK, 'node_modules/vite/dist/node/index.js'));
const vite = await viteSunucusu({ root: KOK, configFile: path.join(KOK, 'vite.config.ts'), server: { middlewareMode: true, hmr: false }, appType: 'spa', logLevel: 'error' });
const PORT = await bosPort();
const sunucu = http
  .createServer((req, res) => {
    const u = new URL(req.url, 'http://localhost');
    const host = String(req.headers.host || '').split(':')[0];
    // MainActivity: yalnız uygulamanın kendi adı ("localhost") paket klasöründen yanıtlanır
    if (u.pathname.startsWith('/_paket/') && host === 'localhost') return packResponse(req, res, u);
    if (u.pathname === '/api/packs' || u.pathname.startsWith('/data/')) {
      if (req.headers['x-yol'] === 'android') {
        res.writeHead(404, ORTAK);
        return res.end();
      }
      return aktar(req, res);
    }
    if (u.pathname === '/prod' || u.pathname.startsWith('/prod/')) return prod(req, res, u);
    for (const [k, v] of Object.entries(ORTAK)) res.setHeader(k, v);
    vite.middlewares(req, res);
  })
  .listen(PORT, '127.0.0.1');
const BASE = `http://localhost:${PORT}`;

// ---------------------------------------------------------------------------
// Tarayıcıda çalışan denetim (uygulamanın kendi modülleriyle)
// ---------------------------------------------------------------------------
/* global document */
async function kaynakDenetle(id) {
  const L = await import('/src/lib/library.ts');
  const { sanitize } = await import('/src/lib/sanitize.ts');
  const { loadNautilus } = await import('/src/lib/zim/nautilus.ts');
  const { loadPdfjs } = await import('/src/lib/pdf.ts');
  const out = { id, sorunlar: [], notlar: [] };
  const sorun = (m) => out.sorunlar.push(m);
  const t0 = performance.now();
  const all = await L.getLibraries();
  const src = all.find((s) => s.id === id);
  if (!src) {
    sorun('kaynak açılamadı: ' + (L.getLibraryError() || 'listede yok'));
    return out;
  }
  out.ad = src.label;
  out.acilisMs = Math.round(performance.now() - t0);
  const zim = src.zim;

  const metin = (html) => {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d;
  };
  /** Sayfanın görsellerinden ilk birkaçı arşivden okunup gerçekten çözülebiliyor mu */
  const gorseller = async (div) => {
    let n = 0;
    let iyi = 0;
    for (const img of [...div.querySelectorAll('img[data-zim-src]')].slice(0, 4)) {
      n++;
      const r = await zim.getResource(img.getAttribute('data-zim-src')).catch((e) => (sorun('görsel okunamadı: ' + e.message), null));
      if (!r) continue;
      if (!r.mime.startsWith('image/')) {
        sorun(`görsel türü beklenmedik: ${img.getAttribute('data-zim-src')} ${r.mime}`);
        continue;
      }
      const url = URL.createObjectURL(new Blob([r.data], { type: r.mime }));
      const im = new Image();
      im.src = url;
      const ok = await im.decode().then(() => im.naturalWidth > 0, () => false);
      URL.revokeObjectURL(url);
      if (ok) iyi++;
      else sorun('görsel çözülemedi: ' + img.getAttribute('data-zim-src'));
    }
    return [iyi, n];
  };
  /** PDF: belge açılır, ilk sayfalar çizilir; boş (beyaz) sayfa = görseller çözülemedi */
  const pdfDenetle = async (p) => {
    const r = await zim.getResource(p).catch(() => null);
    if (!r) return sorun('PDF okunamadı: ' + p);
    const pdfjs = await loadPdfjs();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(r.data), isEvalSupported: false }).promise;
    let enAz = 1;
    const sayfalar = [1, Math.min(doc.numPages, 3)].filter((x, i, a) => a.indexOf(x) === i);
    for (const s of sayfalar) {
      const page = await doc.getPage(s);
      const vp = page.getViewport({ scale: 0.6 });
      const c = document.createElement('canvas');
      c.width = Math.ceil(vp.width);
      c.height = Math.ceil(vp.height);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: ctx, canvas: c, viewport: vp }).promise;
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let dolu = 0;
      for (let i = 0; i < d.length; i += 16) if (d[i] < 200 || d[i + 1] < 200 || d[i + 2] < 200) dolu++;
      enAz = Math.min(enAz, dolu / (d.length / 16));
    }
    out.pdf = (out.pdf || 0) + 1;
    if (enAz < 0.003) sorun(`PDF sayfası boş çizildi: ${p} (dolu oran ${(enAz * 100).toFixed(2)}%)`);
    await doc.cleanup?.();
  };

  // 1) Ana sayfa (Nautilus kitaplığıysa kitap listesi)
  const ana = await zim.getMainPage().catch((e) => (sorun('ana sayfa: ' + e.message), null));
  if (!ana) sorun('ana sayfa yok');
  const kitaplar = await loadNautilus(zim);
  const pdfler = [];
  let html = null;
  let anaYol = ana?.path;
  if (kitaplar) {
    out.kitap = kitaplar.length;
    for (const b of kitaplar) for (const f of b.files) if (/\.pdf$/i.test(f)) pdfler.push(f);
  } else if (ana) {
    if (!ana.mime.startsWith('text/html')) sorun('ana sayfa HTML değil: ' + ana.mime);
    html = metin(sanitize(ana.html, zim, ana.path, ana.title));
    if (html.textContent.trim().length < 50) sorun('ana sayfa metni boş');
    const [g, n] = await gorseller(html);
    out.gorsel = `${g}/${n}`;
  }

  // 2) İç bağlantılar: ana sayfadan ve oradan bir adım öteye
  const okunan = [];
  if (html) {
    const yollar = [...new Set([...html.querySelectorAll('a[data-zim-path]')].map((a) => a.getAttribute('data-zim-path')))];
    for (const y of yollar) if (/\.pdf$/i.test(y.split(/[?#]/)[0])) pdfler.push(y.split(/[?#]/)[0]);
    const sayfa = yollar.filter((y) => !/\.(pdf|epub|zip|mp3|mp4|webm|ogg)$/i.test(y.split(/[?#]/)[0]));
    const secim = sayfa.filter((_, i) => i % Math.max(1, Math.floor(sayfa.length / 5)) === 0).slice(0, 5);
    out.baglanti = `${secim.length}/${sayfa.length}`;
    for (const y of secim) {
      const r = await L.resolveRef(L.makeRef(id, y));
      const a = r && (await r.source.zim.getArticle(r.path).catch((e) => (sorun(`makale ${y}: ${e.message}`), null)));
      if (!a) {
        sorun('bağlantı açılmadı: ' + y);
        continue;
      }
      if (!a.mime.startsWith('text/html')) continue;
      const d = metin(sanitize(a.html, zim, a.path, a.title));
      if (d.textContent.trim().length < 20) sorun('makale metni boş: ' + y);
      okunan.push({ a, d });
      // Bir adım öte: makaleden ilk bağlantı
      const ileri = d.querySelector('a[data-zim-path]')?.getAttribute('data-zim-path');
      if (ileri && !/\.(pdf|epub|zip)$/i.test(ileri.split(/[?#]/)[0])) {
        const r2 = await L.resolveRef(L.makeRef(id, ileri));
        const a2 = r2 && (await r2.source.zim.getArticle(r2.path).catch(() => null));
        if (!a2) sorun('ikinci adım bağlantısı açılmadı: ' + ileri);
      }
    }
    let gi = 0;
    let gn = 0;
    for (const { d } of okunan) {
      const [g, n] = await gorseller(d);
      gi += g;
      gn += n;
    }
    out.makaleGorsel = `${gi}/${gn}`;
  }
  // Küçük arşivlerde PDF'ler doğrudan girdilerden de bulunur
  if (zim.entryCount < 5000 && !pdfler.length) {
    for (let i = 0; i < zim.entryCount; i++) {
      const d = await zim.direntAt(i);
      if (d.mime < 0xfffd && zim.mimeTypes[d.mime] === 'application/pdf') pdfler.push(zim.publicPath(d));
    }
  }

  // 3) Başlık araması: okunan bir makalenin başlığı bulunmalı
  const hedef = okunan.find((x) => x.a.title && x.a.title.length >= 3 && !/[:/]/.test(x.a.title))?.a ?? (ana && !kitaplar ? ana : null);
  if (hedef) {
    const hits = await L.searchLibrary(hedef.title, { sourceId: id, limit: 20 });
    out.baslikArama = hits.length;
    if (!hits.some((h) => h.title === hedef.title || h.path === hedef.path)) {
      (src.hasTitleIndex || src.titleCount > 1 ? sorun : (m) => out.notlar.push(m))(`başlık araması "${hedef.title}" bulamadı (${hits.length} sonuç)`);
    }
  }
  // 4) Tam metin araması: okunan bir makalenin başlığı (başlık kelimeleri tam metin dizinindedir);
  //    Nautilus kitaplıklarında dizin yalnız ana sayfayı kapsar (yalnız not düşülür)
  if (src.hasFulltext) {
    const sorgu = hedef && !kitaplar ? hedef.title : kitaplar?.[0]?.title;
    if (sorgu) {
      const t = await L.searchLibraryText(sorgu, { sourceId: id, limit: 10 });
      out.tamMetin = t.length;
      if (!t.length) (kitaplar ? (m) => out.notlar.push(m) : sorun)(`tam metin "${sorgu}" sonuç vermedi`);
    }
  }
  // 5) PDF'ler (en çok 3: ilk, orta, son)
  const secPdf = [...new Set(pdfler)];
  const pdfOrnek = [secPdf[0], secPdf[Math.floor(secPdf.length / 2)], secPdf[secPdf.length - 1]].filter((x, i, a) => x && a.indexOf(x) === i);
  for (const p of pdfOrnek) await pdfDenetle(p).catch((e) => sorun(`PDF açılamadı ${p}: ${e.message}`));
  out.sureMs = Math.round(performance.now() - t0);
  return out;
}

// ---------------------------------------------------------------------------
const browser = await pw.chromium.launch();
const sonuc = [];
let hata = 0;

for (const yol of YOLLAR) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: { 'x-yol': yol } });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('pageerror', (e) => konsol.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    const t = m.text();
    if (/Jbig2|JpxError|OpenJPEG|wasmUrl|nowasm|Unable to decode image/i.test(t)) konsol.push('pdf.js: ' + t.slice(0, 160));
  });
  let liste = dosyalar;
  if (yol === 'android') {
    await page.addInitScript((files) => {
      window.Capacitor = {
        getPlatform: () => 'android',
        isNativePlatform: () => true,
        Plugins: { AkilCantasi: { paketDurumu: async () => ({ jobs: [], free: 50e9 }), paketListesi: async () => ({ files }) } },
      };
    }, dosyalar);
  }
  await page.goto(BASE + '/?tab=araclar', { waitUntil: 'load' });
  if (yol === 'opfs') {
    liste = dosyalar.filter((f) => f.size <= OPFS_MAX);
    for (const f of liste) {
      await page.evaluate(async (n) => {
        const root = await navigator.storage.getDirectory();
        const dir = await root.getDirectoryHandle('packs', { create: true });
        const w = await (await dir.getFileHandle(n, { create: true })).createWritable();
        const r = await fetch('/data/' + encodeURIComponent(n));
        await r.body.pipeTo(w);
      }, f.name);
    }
    // OPFS yolunda bilgi noktası listesi kapalı: yalnız cihazdaki kopya okunsun
    await page.route('**/api/packs', (r) => r.fulfill({ status: 404, body: '' }));
    await page.reload({ waitUntil: 'load' });
  }
  for (const f of dosyalar) {
    if (!liste.includes(f)) {
      sonuc.push({ yol, id: f.name, atlandi: true });
      continue;
    }
    paketIstek = 0;
    const r = await page.evaluate(kaynakDenetle, f.name).catch((e) => ({ id: f.name, sorunlar: ['denetim çöktü: ' + e.message] }));
    r.yol = yol;
    if (yol === 'android') r.istek = paketIstek;
    sonuc.push(r);
    const durum = r.sorunlar.length ? 'FAIL' : 'OK  ';
    if (r.sorunlar.length) hata++;
    console.log(
      `${durum} [${yol}] ${f.name}: ${r.ad ?? '?'} açılış=${r.acilisMs ?? '-'}ms ana-görsel=${r.gorsel ?? '-'} bağlantı=${r.baglanti ?? '-'} makale-görsel=${r.makaleGorsel ?? '-'} kitap=${r.kitap ?? '-'} başlık=${r.baslikArama ?? '-'} tam-metin=${r.tamMetin ?? '-'} pdf=${r.pdf ?? 0}${r.istek != null ? ' istek=' + r.istek : ''} süre=${r.sureMs ?? '-'}ms`,
    );
    for (const s of r.sorunlar) console.log('       - ' + s);
    for (const s of r.notlar ?? []) console.log('       · ' + s);
  }
  const pdfUyari = [...new Set(konsol.filter((k) => k.startsWith('pdf.js')))];
  if (pdfUyari.length) {
    hata++;
    console.log(`FAIL [${yol}] pdf.js görsel çözemedi: ${pdfUyari.slice(0, 3).join(' | ')}`);
  }
  const sayfaHatasi = konsol.filter((k) => k.startsWith('pageerror'));
  if (sayfaHatasi.length) {
    hata++;
    console.log(`FAIL [${yol}] sayfa hatası: ${sayfaHatasi.slice(0, 3).join(' | ')}`);
  }
  await ctx.close();
}

// Üretim derlemesi (CSP'li) + Android taklidi: kaynaklar listeleniyor, sayfa hatası yok
if (fs.existsSync(path.join(DIST, 'index.html'))) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const hatalar = [];
  page.on('pageerror', (e) => hatalar.push(e.message));
  await page.addInitScript((files) => {
    window.Capacitor = {
      getPlatform: () => 'android',
      isNativePlatform: () => true,
      Plugins: { AkilCantasi: { paketDurumu: async () => ({ jobs: [], free: 50e9 }), paketListesi: async () => ({ files }) } },
    };
  }, dosyalar);
  await page.goto(BASE + '/prod/?tab=kutuphane', { waitUntil: 'load' });
  // Paket klasörünün listelendiğini ve en az bir arşivin /_paket/ üzerinden okunduğunu bekle
  paketIstek = 0;
  for (let i = 0; i < 60 && paketIstek === 0; i++) await page.waitForTimeout(250);
  await page.waitForTimeout(1500);
  const ok = paketIstek > 0 && !hatalar.length;
  if (!ok) hata++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} [üretim/android] arayüz açıldı, /_paket/ okuması=${paketIstek}${hatalar.length ? ' hatalar: ' + hatalar.join(' | ') : ''}`);
  await ctx.close();
} else console.log('atlandı: dist/ yok (önce npx vite build)');

await browser.close();
sunucu.close();
await vite.close();
bn.kill();
fs.rmSync(PAKET, { recursive: true, force: true });
console.log(hata ? `${hata} HATA` : 'TÜMÜ OK');
process.exit(hata ? 1 : 0);
