// İmzalı katalog (Ed25519) uçtan uca denetimi — Vite dev sunucusunda, gerçek tarayıcıda:
//   node e2e/katalog-imza-check.mjs [http://localhost:5199/]
// Hugging Face'teki merkezi katalog ve imzası (packs-manifest.json[.sig]) Playwright ile taklit edilir;
// gerçek siteye hiç gidilmez. Denetlenenler:
//   - depodaki public/packs-manifest.json.sig tarayıcıda (@noble/ed25519) geçerli
//   - imzası olmayan daha yeni katalog yok sayılır, console.warn yazılır, uygulama gömülü katalogla sürer
//   - imzası tutmayan (başka katalogun imzası) katalog yok sayılır
//   - yerelde _gizli/katalog-imza-anahtari.txt varsa: projenin anahtarıyla imzalanmış yeni katalog kabul edilir
//     ve Kütüphane mağazasında yeni paket görünür (anahtar yoksa bu adım atlanır)
// Hata olursa çıkış kodu 1.
import { createRequire } from 'module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gizliAnahtarBul, imzala } from '../tools/katalog-imzala.mjs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
const UZAK = 'https://huggingface.co/datasets/akilcantasi/paketler/resolve/main/packs-manifest.json';
let fails = 0;
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'HATA ') + m); if (!ok) fails++; };

const gomulu = fs.readFileSync(path.join(ROOT, 'public', 'packs-manifest.json'));
const gomuluImza = fs.readFileSync(path.join(ROOT, 'public', 'packs-manifest.json.sig'), 'utf8');
const yeni = JSON.parse(gomulu.toString('utf8'));
yeni.updated = '2099-01-01';
yeni.packs.push({
  id: 'imza-deneme', kind: 'zim', name: 'İmza deneme paketi', desc: 'Yalnız sınama için', file: 'imza-deneme_2099-01.zim',
  size: 1000, sha256: '', tier: 'temel', urls: ['https://download.kiwix.org/zim/other/imza-deneme_2099-01.zim'],
  license: 'CC0', source: 'sınama', shelf: 'pratik', featured: true,
});
const yeniBayt = Buffer.from(JSON.stringify(yeni, null, 2) + '\n');

const browser = await pw.chromium.launch();

/** sig: string → 200, null → 404 */
async function senaryo(govde, sig) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route(UZAK, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: govde }));
  await ctx.route(UZAK + '.sig', (r) => (sig === null ? r.fulfill({ status: 404, body: 'Entry not found' }) : r.fulfill({ status: 200, contentType: 'text/plain', body: sig })));
  const p = await ctx.newPage();
  const uyarilar = [];
  const hatalar = [];
  p.on('console', (m) => { if (m.type() === 'warning') uyarilar.push(m.text()); });
  p.on('pageerror', (e) => hatalar.push(e.message));
  await p.goto(BASE + '?tab=kutuphane', { waitUntil: 'networkidle' });
  const sonuc = await p.evaluate(async () => {
    const m = await import('/src/lib/manifest.ts');
    const r = await m.refreshRemoteManifest();
    return r ? { updated: r.updated, ids: r.packs.map((x) => x.id) } : null;
  });
  return { ctx, p, sonuc, uyarilar, hatalar };
}

try {
  // 1) Depodaki imza tarayıcıda geçerli
  {
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await p.goto(BASE + '?tab=kutuphane', { waitUntil: 'networkidle' });
    const ok = await p.evaluate(async () => {
      const { katalogImzasiGecerli } = await import('/src/lib/katalog-imza.ts');
      const g = new Uint8Array(await (await fetch('/packs-manifest.json', { cache: 'no-store' })).arrayBuffer());
      const s = await (await fetch('/packs-manifest.json.sig', { cache: 'no-store' })).text();
      const bozuk = g.slice();
      bozuk[5] ^= 1;
      return { gecerli: katalogImzasiGecerli(g, s), bozuk: katalogImzasiGecerli(bozuk, s) };
    });
    check(ok.gecerli === true, 'depodaki katalog imzası tarayıcıda geçerli');
    check(ok.bozuk === false, 'tek baytı değişen katalog tarayıcıda reddedilir');
    await ctx.close();
  }

  // 2) İmzasız yeni katalog
  {
    const s = await senaryo(yeniBayt, null);
    check(s.sonuc === null, 'imzası olmayan daha yeni katalog kabul edilmez');
    check(s.uyarilar.some((u) => /imzası yok/.test(u)), 'console.warn: imza yok');
    check(s.hatalar.length === 0, 'sayfa hatası yok ' + s.hatalar.join(' | '));
    await s.ctx.close();
  }

  // 3) Başka katalogun imzası (değiştirilmiş katalog)
  {
    const s = await senaryo(yeniBayt, gomuluImza);
    check(s.sonuc === null, 'imzası tutmayan katalog kabul edilmez');
    check(s.uyarilar.some((u) => /imzası geçersiz/.test(u)), 'console.warn: imza geçersiz');
    const magaza = await s.p.locator('text=İmza deneme paketi').count();
    check(magaza === 0, 'değiştirilmiş katalogdaki paket arayüzde görünmez');
    await s.ctx.close();
  }

  // 4) Projenin anahtarıyla imzalı yeni katalog (yalnız anahtar yerelde varsa)
  let gizli = null;
  try { gizli = gizliAnahtarBul(); } catch { gizli = null; }
  if (gizli) {
    const s = await senaryo(yeniBayt, imzala(yeniBayt, gizli));
    check(s.sonuc?.updated === '2099-01-01' && s.sonuc.ids.includes('imza-deneme'), 'geçerli imzalı yeni katalog kabul edilir');
    check(!s.uyarilar.some((u) => /\[katalog\]/.test(u)), 'geçerli katalogda uyarı yok');
    await s.ctx.close();
  } else {
    console.log('ATLANDI geçerli imzalı yeni katalog (imza anahtarı bu bilgisayarda yok)');
  }
} finally {
  await browser.close();
}

console.log(fails ? `\n${fails} HATA` : '\nTÜMÜ OK');
process.exit(fails ? 1 : 0);
