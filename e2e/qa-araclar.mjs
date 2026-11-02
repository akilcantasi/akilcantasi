// QA: Araçlar sekmesi — tüm araçlar ve düğmeler, kalıcılık, Paketler (katalog, indirme
// başlat/duraklat/devam/iptal, dosyadan içe aktarma, silme, bilgi noktası tarayıcı + Android
// taklidi), Ayarlar (yazı boyutu tüm sekmelerde, kontrast, hareket, düşük güç, sıfırlama),
// çocuk oyunları, cümle sözlüğü büyük gösterim + RTL, radyo tablosu, dokunma hedefleri.
//   node e2e/qa-araclar.mjs [http://localhost:5199/] [/tmp/qa-araclar]
import { createRequire } from 'module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startServer } from '../server/server.mjs';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
const shots = process.argv[3] ?? '/tmp/qa-araclar';
fs.mkdirSync(shots, { recursive: true });

const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const tid = (id) => `[data-testid="${id}"]`;
const TOOLS = ['canta', 'hesap', 'stok', 'pil', 'pusula', 'cocuk', 'sozluk', 'radyo', 'paylas', 'ayarlar'];

// Uzak paket sunucusu (farklı köken, yavaşlatılmış): indirme duraklat/devam/iptal için
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-araclar-'));
const SIZE = 24 * 1024 * 1024;
const buf = crypto.randomBytes(SIZE);
fs.writeFileSync(path.join(tmp, 'qa-dl.zim'), buf);
const SHA = crypto.createHash('sha256').update(buf).digest('hex');
const ranges = [];
const remote = await startServer({
  port: 0, host: '127.0.0.1', data: tmp, dist: tmp, throttleBps: 3 * 1024 * 1024,
  onRequest: (req) => req.url?.startsWith('/data/') && req.method === 'GET' && ranges.push(req.headers.range ?? '(yok)'),
});
const realManifest = JSON.parse(fs.readFileSync(new URL('../public/packs-manifest.json', import.meta.url)));
const manifest = {
  ...realManifest,
  packs: [
    ...realManifest.packs,
    { id: 'qa-dl', kind: 'zim', name: 'QA indirme', desc: 'deneme', file: 'qa-dl.zim', size: SIZE, sha256: SHA, tier: 'temel', urls: [`http://127.0.0.1:${remote.port}/data/qa-dl.zim`], license: 'CC0', source: 'qa' },
  ],
};

const b = await pw.chromium.launch();
async function newPage(opts = {}) {
  const ctx = await b.newContext({ viewport: opts.viewport ?? { width: 390, height: 844 }, deviceScaleFactor: 1 });
  if (opts.init) await ctx.addInitScript(opts.init, opts.initArg);
  // Katalog: yerel + çevrimiçi istek → sahte katalog (çevrimiçi isteğin ağ hatası konsolu kirletmesin)
  const body = JSON.stringify(manifest);
  const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'cross-origin-resource-policy': 'cross-origin' };
  await ctx.route('**/packs-manifest.json', (r) => r.fulfill({ status: 200, headers, body }));
  // Bilgi noktası sunucusu yokmuş gibi (uygulama server.mjs'den sunulsa da): tarayıcı durumu test edilir
  await ctx.route(/\/api\/(status|packs)/, (r) => r.fulfill({ status: 200, headers: { 'content-type': 'text/html' }, body: '<!doctype html>' }));
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  return { ctx, p, errors };
}
const goto = async (p, q) => { await p.goto(base + q, { waitUntil: 'networkidle' }); await p.waitForTimeout(400); };

// Dokunma hedefleri < 44 px ve yatay taşma
async function audit(p, label) {
  const r = await p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const small = [], over = [];
    for (const el of document.querySelectorAll('#main button, #main a[href], #main input, #main select, #main summary, #main [role=switch], .sz-big button')) {
      const rc = el.getBoundingClientRect();
      if (!rc.width || !rc.height || getComputedStyle(el).visibility === 'hidden') continue;
      if ((el.type === 'checkbox' || el.type === 'radio') && el.closest('label')?.getBoundingClientRect().height >= 44) continue;
      if (el.tagName === 'A' && el.closest('p, li') && !el.classList.contains('btn')) continue;
      if (el.closest('canvas')) continue;
      if (rc.height < 43.5 || rc.width < 43.5) small.push(`${el.getAttribute('data-testid') || el.className || el.tagName} ${Math.round(rc.width)}x${Math.round(rc.height)}`);
    }
    for (const el of document.querySelectorAll('#main *')) {
      if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
      const rc = el.getBoundingClientRect();
      if (!rc.width) continue;
      let a = el.parentElement, clipped = false;
      while (a && a.id !== 'main') { if (getComputedStyle(a).overflowX !== 'visible') { clipped = true; break; } a = a.parentElement; }
      if (!clipped && rc.right > W + 1) over.push(`${el.getAttribute('data-testid') || el.className || el.tagName} →${Math.round(rc.right)}`);
    }
    return { small: [...new Set(small)], over: over.slice(0, 5) };
  });
  check(r.small.length === 0, `${label}: dokunma hedefleri ≥44px` + (r.small.length ? ' — ' + r.small.slice(0, 8).join(', ') : ''));
  check(r.over.length === 0, `${label}: yatay taşma yok` + (r.over.length ? ' — ' + r.over.join(', ') : ''));
}
async function tallShot(p, file) {
  const vp = p.viewportSize();
  const H = await p.evaluate(() => { const m = document.getElementById('main'); return m ? m.scrollHeight + (innerHeight - m.clientHeight) : innerHeight; });
  await p.setViewportSize({ width: vp.width, height: Math.min(H, 6000) });
  await p.waitForTimeout(150);
  await p.screenshot({ path: `${shots}/${file}.png` });
  await p.setViewportSize(vp);
}

try {
  // ---------- 1) Araç listesi: her kart açılır, başlık, geri; 3 ekran boyutu ----------
  for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 640 }, { width: 1280, height: 800 }]) {
    const { ctx, p, errors } = await newPage({ viewport: vp });
    const tag = vp.width + 'px';
    await goto(p, '?tab=araclar');
    for (const t of TOOLS) {
      await p.click(tid('tool-card-' + t));
      await p.waitForSelector(tid('tool-' + t));
      await p.waitForFunction((t) => !document.querySelector(`[data-testid="tool-${t}"] .empty`)?.textContent?.startsWith('Yükleniyor'), t, { timeout: 10000 }).catch(() => {});
      await p.waitForTimeout(250);
      const h1 = await p.textContent(`${tid('tool-' + t)} h1.tl-title`).catch(() => '');
      check(!!h1?.trim(), `${tag} ${t}: başlık "${h1?.trim()}"`);
      await p.evaluate(() => document.querySelectorAll('#main details').forEach((d) => (d.open = true)));
      await audit(p, `${tag} ${t}`);
      if (vp.width !== 390) await tallShot(p, `${tag}-${t}`);
      await p.click(tid('tool-back'));
      await p.waitForSelector(tid('tool-card-' + t));
    }
    check(errors.length === 0, `${tag}: konsol hatası yok` + (errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // ---------- 2) Kalıcılık (yeniden yüklemeden sonra) ----------
  {
    const { ctx, p, errors } = await newPage();
    await goto(p, '?tool=canta');
    const first = await p.getAttribute('[data-testid^="canta-check-"]', 'data-testid');
    await p.check(tid(first));
    await p.click('[data-testid^="canta-opt-"]');
    await goto(p, '?tool=hesap');
    await p.click(tid('hesap-adults-inc'));
    await p.click(tid('hesap-days-7'));
    await p.click(tid('hesap-climate-sicak'));
    await p.fill(tid('hesap-children'), '3');
    await goto(p, '?tool=stok');
    await p.click(tid('stok-add'));
    await p.fill(tid('stok-new-name'), 'QA su');
    await p.fill(tid('stok-new-qty'), '4');
    await p.click(tid('stok-new-save'));
    await p.waitForSelector('[data-testid^="stok-item-"]');
    await goto(p, '?tool=pil');
    await p.click(tid('pil-saver-switch'));
    await goto(p, '?tool=ayarlar');
    await p.click(tid('set-size-2'));
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    check((await p.getAttribute('html', 'data-text-size')) === '2', 'kalıcı: yazı boyutu');
    check((await p.getAttribute(tid('set-saver'), 'aria-checked')) === 'true', 'kalıcı: pil tasarrufu (Pil → Ayarlar)');
    await p.click(tid('set-size-0'));
    await goto(p, '?tool=canta');
    check(await p.isChecked(tid(first)), 'kalıcı: çanta işareti');
    check((await p.getAttribute('[data-testid^="canta-opt-"]', 'aria-pressed')) === 'true', 'kalıcı: çanta seçeneği');
    await goto(p, '?tool=hesap');
    check((await p.inputValue(tid('hesap-adults'))) === '3', 'kalıcı: hesap yetişkin');
    check((await p.inputValue(tid('hesap-children'))) === '3', 'kalıcı: hesap çocuk (elle yazılan)');
    check((await p.inputValue(tid('hesap-days'))) === '7', 'kalıcı: hesap gün');
    check((await p.getAttribute(tid('hesap-climate-sicak'), 'aria-pressed')) === 'true', 'kalıcı: hesap iklim');
    await goto(p, '?tool=stok');
    check((await p.textContent(tid('stok-list'))).includes('QA su'), 'kalıcı: stok öğesi');
    await goto(p, '?tool=pil');
    check((await p.getAttribute(tid('pil-saver-switch'), 'aria-checked')) === 'true', 'kalıcı: pil anahtarı');
    check(await p.evaluate(() => document.body.classList.contains('saver')), 'pil tasarrufu: body.saver');
    await p.click(tid('pil-saver-switch'));
    // Paylaş içindeki aynı anahtar senkron
    await goto(p, '?tool=paylas');
    check((await p.getAttribute(tid('saver-switch'), 'aria-checked')) === 'false', 'Paylaş pil anahtarı senkron');
    check(errors.length === 0, 'kalıcılık: konsol hatası yok' + (errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // ---------- 3) Paketler: katalog, içe aktar, sil, indirme duraklat/devam/iptal ----------
  {
    const { ctx, p, errors } = await newPage();
    await goto(p, '?tool=paylas');
    await p.waitForFunction((n) => document.querySelectorAll('[data-testid="pack-row"]').length >= n, manifest.packs.length, { timeout: 10000 }).catch(() => {});
    const labels = await p.$$eval('.sh-group > .label', (els) => els.map((e) => e.textContent.trim()));
    check(labels.some((l) => /Sesli soru/.test(l)), 'katalog: "Sesli soru" (ses) grubu: ' + labels.join(' / '));
    const nRows = await p.$$eval(tid('pack-row'), (els) => els.length);
    // yalnizYerel paketler (Android yerel motoru gerektiren büyük modeller) tarayıcıda listelenmez
    const gorunen = manifest.packs.filter((x) => !x.yalnizYerel).length;
    check(nRows === gorunen, `katalog: ${nRows} satır (${gorunen} paket)`);
    check(await p.isVisible('[data-pack="whisper-base.tar"], [data-testid="pack-row"]:has-text("Whisper base")'), 'katalog: Whisper base satırı');
    check((await p.textContent(tid('share-status'))).includes('kapalı'), 'tarayıcı: bilgi noktası kapalı');
    check(await p.isDisabled(tid('infopoint-switch')), 'tarayıcı: "Bu telefondan yayınla" devre dışı');
    check((await p.getAttribute(tid('pack-import-input'), 'accept')).includes('.tar'), 'içe aktarma .tar (ses) kabul eder');

    // İçe aktar: geçerli .geojson + .tar, geçersiz .txt
    await p.setInputFiles(tid('pack-import-input'), [
      { name: 'qa-noktalar.geojson', mimeType: 'application/json', buffer: Buffer.from('{"type":"FeatureCollection","features":[]}') },
      { name: 'qa-ses.tar', mimeType: 'application/x-tar', buffer: Buffer.alloc(4096) },
      { name: 'bozuk.txt', mimeType: 'text/plain', buffer: Buffer.from('x') },
    ]);
    await p.waitForSelector('[data-pack="qa-ses.tar"]', { timeout: 10000 });
    const msg = await p.textContent('.sh-card:has(#sh-pk)');
    check(/2 paket içe aktarıldı/.test(msg) && /Desteklenmeyen dosya türü: bozuk\.txt/.test(msg), 'içe aktarma: 2 başarılı + hata mesajı');
    check((await p.textContent('[data-pack="qa-ses.tar"]')).includes('Hazır · cihazda'), 'içe aktarılan .tar hazır');
    const sesGroup = await p.$eval('[data-pack="qa-ses.tar"]', (e) => e.closest('.sh-group').querySelector('.label').textContent);
    check(/Sesli soru/.test(sesGroup), '.tar "Sesli soru" grubunda');
    await audit(p, 'paketler (içe aktarma sonrası)');
    // Sil: satır içi onay
    await p.click('[data-pack="qa-ses.tar"] ' + tid('pack-delete'));
    check(await p.isVisible('[data-pack="qa-ses.tar"] ' + tid('pack-delete-q')), 'silme: onay soruluyor (confirm yok)');
    await audit(p, 'paketler (silme onayı)');
    await p.click('[data-pack="qa-ses.tar"] ' + tid('pack-delete-no'));
    check(await p.isVisible('[data-pack="qa-ses.tar"] ' + tid('pack-delete')), 'silme: Vazgeç paketi korur');
    await p.click('[data-pack="qa-ses.tar"] ' + tid('pack-delete'));
    await p.click('[data-pack="qa-ses.tar"] ' + tid('pack-delete-yes'));
    await p.waitForSelector('[data-pack="qa-ses.tar"]', { state: 'detached', timeout: 5000 });
    check(true, 'silme: paket kaldırıldı');
    await p.click('[data-pack="qa-noktalar.geojson"] ' + tid('pack-delete'));
    await p.click('[data-pack="qa-noktalar.geojson"] ' + tid('pack-delete-yes'));

    // İndirme: başlat → duraklat → yeniden yükle → devam (Range) → iptal → tekrar indir → doğrula
    const row = '[data-pack="qa-dl.zim"]';
    await p.click(`${row} ${tid('pack-download')}`);
    await p.waitForFunction((r) => Number(document.querySelector(r + ' [role="progressbar"]')?.getAttribute('aria-valuenow')) >= 15, row, { timeout: 30000 });
    check(/İndiriliyor/.test(await p.textContent(row)), 'indirme: "İndiriliyor" ve ilerleme');
    await audit(p, 'paketler (indirme sürüyor)');
    await p.click(`${row} ${tid('pack-pause')}`);
    await p.waitForSelector(`${row}[data-state="paused"]`, { timeout: 10000 });
    check(/Duraklatıldı/.test(await p.textContent(row)), 'indirme: duraklatıldı');
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForSelector(`${row}[data-state="paused"]`, { timeout: 10000 });
    check(true, 'indirme: yeniden yüklemeden sonra duraklatılmış');
    const before = ranges.length;
    await p.click(`${row} ${tid('pack-resume')}`);
    await p.waitForFunction((n) => true, before);
    await p.waitForTimeout(1500);
    const rr = ranges.slice(before)[0] ?? '';
    check(/^bytes=[1-9]\d*-$/.test(rr), 'devam isteği Range ile: ' + rr);
    await p.click(`${row} ${tid('pack-cancel')}`);
    await p.waitForFunction((r) => document.querySelector(r)?.getAttribute('data-state') === 'none', row, { timeout: 10000 });
    const parts = await p.evaluate(async () => {
      const d = await (await navigator.storage.getDirectory()).getDirectoryHandle('packs');
      const n = [];
      for await (const [k] of d.entries()) n.push(k);
      return n;
    });
    check(!parts.some((n) => n.startsWith('qa-dl')), 'iptal: .part silindi (' + parts.join(',') + ')');
    await p.click(`${row} ${tid('pack-download')}`);
    await p.waitForSelector(`${row}[data-state="ready"]`, { timeout: 60000 });
    check((await p.textContent(row)).includes('Hazır · cihazda'), 'tekrar indirme tamamlandı ve doğrulandı');
    await p.click(`${row} ${tid('pack-delete')}`);
    await p.click(`${row} ${tid('pack-delete-yes')}`);
    await p.waitForSelector(`${row} ${tid('pack-download')}`, { timeout: 5000 });
    check(true, 'indirilen paket silindi');
    // Lisanslar
    await p.click(`${tid('licenses')} summary`);
    const lic = await p.textContent(tid('licenses'));
    check(/Whisper/.test(lic) && /Gemma/.test(lic) && /Qwen3\.5/.test(lic) && !/Qwen Research/.test(lic), 'lisanslar katalogla uyumlu');
    await audit(p, 'paketler (lisanslar açık)');
    // İnternetsiz yay panelleri
    await p.click(tid('share-app'));
    check(await p.isVisible(tid('share-app-panel')), 'uygulamayı aktar paneli');
    await p.click(tid('share-packs'));
    check(await p.isVisible(tid('share-packs-panel')), 'paketleri paylaş paneli');
    await tallShot(p, 'paylas-tarayici');
    check(errors.length === 0, 'paketler: konsol hatası yok' + (errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // ---------- 4) Bilgi noktası: Android taklidi ----------
  {
    const { ctx, p, errors } = await newPage({
      init: () => {
        let running = false;
        const calls = (window.__calls = []);
        const st = () => (running ? { running: true, port: 8080, addresses: ['192.168.43.1'], clients: 3 } : { running: false });
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
      },
    });
    await goto(p, '?tool=paylas');
    check(await p.isEnabled(tid('infopoint-switch')), 'Android: anahtar etkin');
    await p.click(tid('infopoint-switch'));
    await p.waitForSelector(tid('share-url'), { timeout: 5000 });
    check((await p.textContent(tid('share-url'))).trim() === 'http://192.168.43.1:8080', 'Android: adres');
    check((await p.textContent(tid('share-clients'))).trim() === '3', 'Android: bağlı cihaz');
    check(await p.isVisible(tid('infopoint-packs-hint')), 'Android: paket klasörü ipucu');
    check(!(await p.textContent('.sh-card:has(#sh-ip)')).includes('Bilgisayarda:'), 'Android: bilgisayar adımı gizli');
    await audit(p, 'Android bilgi noktası açık');
    await tallShot(p, 'paylas-android');
    await p.click(tid('share-app'));
    await p.click(tid('infopoint-stop'));
    await p.waitForFunction(() => document.querySelector('[data-testid="share-status"]')?.textContent?.includes('kapalı'));
    const calls = await p.evaluate(() => window.__calls);
    check(calls.includes('start:8080') && calls.includes('stop'), 'Android: eklenti çağrıları ' + calls.join(','));
    await p.click(tid('share-app'));
    await p.waitForTimeout(200);
    check((await p.evaluate(() => window.__calls)).includes('share'), 'Android: APK paylaşımı (Quick Share)');
    check(errors.length === 0, 'Android: konsol hatası yok' + (errors.length ? ' — ' + errors.join(' | ') : ''));
    await ctx.close();
  }

  // ---------- 5) Ayarlar: yazı boyutu tüm sekmelerde, kontrast, hareket, düşük güç, sıfırlama ----------
  {
    const { ctx, p, errors } = await newPage();
    await goto(p, '?tool=ayarlar');
    for (const i of [0, 1, 2, 3]) {
      await p.click(tid('set-size-' + i));
      check((await p.getAttribute('html', 'data-text-size')) === String(i), `yazı boyutu ${i}`);
    }
    for (const q of ['?tab=fener', '?tab=rehber', '?tab=harita', '?tab=iletisim', '?tab=kutuphane', '?tab=araclar', ...TOOLS.map((t) => '?tool=' + t)]) {
      await goto(p, q);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(sw <= 1, `en büyük yazı ${q}: sayfa taşmıyor`);
    }
    await goto(p, '?tool=sozluk');
    await p.click('[data-testid^="sz-big-"]');
    const bigBox = await p.$eval(tid('sz-bigview'), (e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height, innerWidth, innerHeight]; });
    check(bigBox[0] <= 0 && bigBox[1] <= 0 && bigBox[2] >= bigBox[4] - 1 && bigBox[3] >= bigBox[5] - 1, 'en büyük yazıda büyük gösterim tüm ekranı kaplar ' + bigBox.map(Math.round).join(','));
    await p.screenshot({ path: `${shots}/sozluk-big-buyukyazi.png` });
    await p.click(tid('sz-big-close'));
    await goto(p, '?tool=ayarlar');
    await p.click(tid('set-size-0'));
    await p.click(tid('set-contrast'));
    check(await p.evaluate(() => document.documentElement.classList.contains('hc')), 'yüksek kontrast: html.hc');
    await tallShot(p, 'ayarlar-hc');
    await p.click(tid('set-contrast'));
    await p.click(tid('set-motion'));
    check(await p.evaluate(() => document.documentElement.classList.contains('reduce-motion')), 'hareketi azalt: html.reduce-motion');
    await p.click(tid('set-motion'));
    await p.click(tid('set-lowpower'));
    const lp = await p.evaluate(() => ({ c: document.documentElement.classList.contains('lowpower'), bg: getComputedStyle(document.body).backgroundColor, saver: document.body.classList.contains('saver') }));
    check(lp.c && lp.bg === 'rgb(0, 0, 0)' && lp.saver, 'düşük güç: siyah zemin + pil tasarrufu ' + JSON.stringify(lp));
    check((await p.getAttribute(tid('set-saver'), 'aria-checked')) === 'true', 'düşük güç → pil tasarrufu anahtarı açık');
    await p.click(tid('set-saver'));
    check((await p.getAttribute(tid('set-lowpower'), 'aria-checked')) === 'false', 'pil tasarrufu kapatınca düşük güç de kapanır');
    // Sıfırlama: veri var, paketler kalsın
    await p.evaluate(async () => {
      localStorage.setItem('ac.test', '1');
      const d = await (await navigator.storage.getDirectory()).getDirectoryHandle('packs', { create: true });
      const w = await (await d.getFileHandle('kalsin.geojson', { create: true })).createWritable();
      await w.write('{}'); await w.close();
    });
    await p.click(tid('set-size-1'));
    await p.click(tid('set-reset'));
    await audit(p, 'ayarlar sıfırlama onayı');
    await p.click(tid('set-reset-cancel'));
    check(await p.isVisible(tid('set-reset')), 'sıfırla: Vazgeç');
    await p.click(tid('set-reset'));
    await p.click(tid('set-reset-yes'));
    // Başarılıysa 0,9 sn sonra sayfa yeniden yüklenir; hata varsa mesaj kalır
    await p.waitForTimeout(2500);
    await p.waitForLoadState('networkidle');
    const resErr = await p.$eval('[data-testid="set-reset-result"]', (e) => e.textContent).catch(() => '');
    check(!resErr, 'sıfırla: yeniden başladı' + (resErr ? ' — ' + resErr : ''));
    const after = await p.evaluate(async () => {
      const d = await (await navigator.storage.getDirectory()).getDirectoryHandle('packs', { create: true });
      const n = [];
      for await (const [k] of d.entries()) n.push(k);
      return { ls: localStorage.getItem('ac.test'), ts: document.documentElement.dataset.textSize, files: n };
    });
    check(after.ls === null && after.ts === '0', 'sıfırla: ayarlar ve kayıtlar silindi');
    check(after.files.includes('kalsin.geojson'), 'sıfırla: paketler korundu');
    check(errors.length === 0, 'ayarlar: konsol hatası yok' + (errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // ---------- 6) Çocuk köşesi oyunları ----------
  {
    const { ctx, p, errors } = await newPage({
      init: () => {
        window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
        const s = window.speechSynthesis;
        s.getVoices = () => [{ lang: 'tr-TR', name: 'tr', default: true, localService: true, voiceURI: 'tr' }];
        s.speak = (u) => setTimeout(() => u.onend && u.onend(), 5);
        s.cancel = () => {};
      },
    });
    await goto(p, '?tool=cocuk');
    for (const g of ['masal', 'hafiza', 'boya', 'nefes', 'bilgi']) {
      await p.click(tid('ck-open-' + g));
      await p.waitForTimeout(300);
      await audit(p, 'çocuk/' + g);
      if (g === 'masal') {
        await p.click('[data-testid="masal-list"] > button');
        await p.click(tid('masal-bigger'));
        await p.click(tid('masal-read'));
        await p.waitForTimeout(100);
        await p.click(tid('masal-stop'), { timeout: 2000 }).catch(() => {});
        await audit(p, 'çocuk/masal okuyucu');
        await p.click(tid('masal-back'));
      }
      if (g === 'hafiza') {
        await p.click('[data-testid^="hafiza-level-"]');
        const cards = await p.$$('[data-testid^="hafiza-card-"]');
        check(cards.length >= 4, `hafıza: ${cards.length} kart`);
        await cards[0].click(); await cards[1].click();
        await p.waitForTimeout(1200);
        check(Number((await p.textContent(tid('hafiza-moves'))).replace(/\D/g, '')) >= 1, 'hafıza: hamle sayılıyor');
        await audit(p, 'çocuk/hafıza oyun');
        await p.click(tid('hafiza-restart'));
        await p.click(tid('hafiza-levelback')).catch(() => {});
      }
      if (g === 'boya') {
        await p.click('[data-testid^="boya-pic-"]');
        const c = await p.$(tid('boya-canvas'));
        const bb = await c.boundingBox();
        await p.click('[data-testid^="boya-color-"] >> nth=2');
        await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
        await p.click(tid('boya-tool-brush'));
        await p.mouse.move(bb.x + 20, bb.y + 20); await p.mouse.down(); await p.mouse.move(bb.x + 80, bb.y + 80, { steps: 5 }); await p.mouse.up();
        check(await p.isEnabled(tid('boya-undo')), 'boyama: geri al etkin');
        await p.click(tid('boya-undo'));
        await p.click(tid('boya-clear'));
        await audit(p, 'çocuk/boyama temizle onayı');
        await p.click(tid('boya-clear-yes'));
        await p.click(tid('boya-back'));
      }
      if (g === 'nefes') {
        await p.click(tid('nefes-start'));
        await p.waitForTimeout(1200);
        check(!!(await p.textContent(tid('nefes-phase'))).trim(), 'nefes: evre yazısı');
        await audit(p, 'çocuk/nefes çalışırken');
      }
      if (g === 'bilgi') {
        for (let i = 0; i < 30 && !(await p.$(tid('quiz-done'))); i++) {
          await p.click('[data-testid^="quiz-opt-"]');
          await p.click(tid('quiz-next'));
        }
        check(!!(await p.$(tid('quiz-done'))), 'bilgi yarışması sonuna ulaşıldı: ' + (await p.textContent(tid('quiz-score')).catch(() => '')));
        await audit(p, 'çocuk/bilgi sonuç');
        await p.click(tid('quiz-restart'));
      }
      await p.click(tid('ck-home'));
    }
    check(errors.length === 0, 'çocuk köşesi: konsol hatası yok' + (errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // ---------- 7) Cümle sözlüğü: büyük gösterim ve RTL ----------
  {
    const { ctx, p, errors } = await newPage({ viewport: { width: 360, height: 640 } });
    await goto(p, '?tool=sozluk');
    await p.click(tid('sz-lang-ar'));
    const t = await p.$('[data-testid^="sz-t-"]');
    check((await t.getAttribute('dir')) === 'rtl' && (await t.evaluate((e) => getComputedStyle(e).direction)) === 'rtl', 'Arapça: dir=rtl');
    await p.click('[data-testid^="sz-big-"]');
    const big = await p.$(tid('sz-big-text'));
    check((await big.getAttribute('dir')) === 'rtl', 'büyük gösterim: RTL');
    const sb = await p.$eval(tid('sz-bigview'), (e) => e.scrollWidth <= e.clientWidth + 1);
    check(sb, 'büyük gösterim: yatay taşma yok');
    await audit(p, 'sözlük büyük gösterim');
    await p.screenshot({ path: `${shots}/sozluk-big-ar.png` });
    await p.keyboard.press('Escape');
    await p.waitForTimeout(150);
    if (await p.$(tid('sz-bigview'))) await p.click(tid('sz-big-close'));
    check(!(await p.$(tid('sz-bigview'))), 'büyük gösterim kapandı');
    await p.click(tid('sz-lang-fa'));
    check((await p.getAttribute('[data-testid^="sz-t-"]', 'dir')) === 'rtl', 'Farsça: dir=rtl');
    await p.click(tid('sz-lang-en'));
    check((await p.getAttribute('[data-testid^="sz-t-"]', 'dir')) !== 'rtl', 'İngilizce: LTR');
    await p.fill(tid('sz-search'), 'zzzqqq');
    check(await p.isVisible(tid('sz-empty')), 'arama: boş sonuç');
    check(errors.length === 0, 'sözlük: konsol hatası yok' + (errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // ---------- 8) Radyo tablosu ----------
  {
    const { ctx, p, errors } = await newPage({ viewport: { width: 360, height: 640 } });
    await goto(p, '?tool=radyo');
    await p.evaluate(() => document.querySelectorAll('#main details').forEach((d) => (d.open = true)));
    await p.click('text=TRT frekansları').catch(() => {});
    await p.waitForTimeout(300);
    // İl seçici: her il için Radyo 1 ve Haber satırı var, FM bandında; seçim kalıcı
    const cities = await p.$$eval('[data-testid="rd-city"] option', (o) => o.map((x) => x.value));
    check(cities.length >= 13, 'radyo: ' + cities.length + ' il seçilebilir');
    let bad = [];
    for (const c of cities) {
      await p.selectOption(tid('rd-city'), c);
      const r = await p.evaluate(() => {
        const t = document.querySelector('[data-testid="rd-freq-table"]');
        const f = [...t.querySelectorAll('td[data-testid]')].map((td) => td.textContent);
        const nums = f.join(' ').match(/\d+\.\d/g)?.map(Number) ?? [];
        return { has1: !!t.querySelector('[data-testid="rd-f-trt-radyo-1"]'), hasH: !!t.querySelector('[data-testid="rd-f-trt-radyo-haber"]'), band: nums.every((n) => n >= 87.5 && n <= 108), fits: t.getBoundingClientRect().right <= innerWidth + 1 };
      });
      if (!(r.has1 && r.hasH && r.band && r.fits)) bad.push(c + JSON.stringify(r));
    }
    check(bad.length === 0, 'radyo: tüm illerde Radyo 1 + Haber, 87,5–108 MHz, ekrana sığar' + (bad.length ? ' — ' + bad.join(' ') : ''));
    await p.selectOption(tid('rd-city'), 'ankara');
    check((await p.textContent(tid('rd-f-trt-radyo-1'))).includes('93.3'), 'radyo: Ankara Radyo 1 93.3');
    await p.reload({ waitUntil: 'networkidle' });
    await p.click('text=TRT frekansları');
    check((await p.inputValue(tid('rd-city'))) === 'ankara', 'radyo: il seçimi kalıcı');
    check(/Kaynak: TRT/.test(await p.textContent(tid('rd-source'))), 'radyo: kaynak satırı');
    await audit(p, 'radyo (tüm bölümler açık)');
    await tallShot(p, 'radyo-360');
    check(errors.length === 0, 'radyo: konsol hatası yok' + (errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }
} catch (e) {
  check(false, 'beklenmeyen hata: ' + e.message.split('\n').slice(0, 3).join(' '));
} finally {
  await b.close();
  await remote.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(fails.length ? `\n${fails.length} HATA` : '\nTÜMÜ OK — ekran görüntüleri: ' + shots);
process.exit(fails.length ? 1 : 0);
