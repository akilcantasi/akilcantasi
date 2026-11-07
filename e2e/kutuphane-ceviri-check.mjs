// Kütüphane: İngilizce makaleyi Fener ile Türkçeye çevirme akışı (küçük test modeliyle).
//   node e2e/kutuphane-ceviri-check.mjs [http://localhost:5199/]
// Test modeli anlamlı çeviri üretmez; yalnızca akışın (yükleme → parça parça çeviri → bitti) çalıştığı denetlenir.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try {
  pw = require('playwright');
} catch {
  pw = require('/opt/npm-tools/node_modules/playwright');
}
const base = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
const tid = (t) => `[data-testid="${t}"]`;
let fails = 0;
const check = (ok, msg) => {
  console.log((ok ? 'ok   ' : 'FAIL ') + msg);
  if (!ok) fails++;
};

const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto(base + '?tab=kutuphane&devzim=/testdata/sample_med_en.zim,/testdata/sample_tr.zim&devmodel=/testdata/tiny-test.gguf', { waitUntil: 'networkidle' });
await p.waitForSelector(tid('lib-search'), { timeout: 30000 });
// Mağaza ihtiyaca göre bölümlü; "Sağlık ve ilk yardım" bölümüne atlanır
await p.click(`${tid('lib-collections')} ${tid('lib-open-store')}`);
await p.waitForSelector(tid('lib-store'));
check((await p.$$(tid('lib-store-sec'))).length >= 5, 'mağaza ihtiyaca göre bölümlere ayrılmış');
await p.click(`${tid('lib-need')}[data-need="saglik"]`);
check(!!(await p.$(`${tid('lib-store-sec')}[data-need="saglik"] ${tid('lib-store-item')}`)), 'sağlık bölümünde içerik var');
await p.click(tid('lib-store-back'));
await p.click(tid('lib-search'));

// İngilizce kaynaktan bir makale aç
await p.fill(tid('lib-search'), 'Bleeding');
await p.waitForSelector(tid('lib-result'), { timeout: 15000 });
const refs = await p.$$eval(tid('lib-result'), (els) => els.map((e) => [e.dataset.ref, e.querySelector('[data-testid="lib-result-src"]')?.textContent]));
console.log('  sonuçlar:', JSON.stringify(refs.slice(0, 6)));
const en = refs.find(([, src]) => !/Vikipedi|Türkçe/i.test(src ?? '')) ?? refs[0];
await p.click(`${tid('lib-result')}[data-ref="${en[0]}"]`);
await p.waitForSelector(tid('lib-article-title'), { timeout: 15000 });
const btn = await p.$(tid('lib-translate'));
check(!!btn, 'İngilizce makalede "Türkçeye çevir" düğmesi');
if (btn) {
  await btn.click();
  await p.waitForSelector(`${tid('lib-translation')}[data-state="done"], ${tid('lib-translation')}[data-state="error"]`, { timeout: 180000 });
  const state = await p.getAttribute(tid('lib-translation'), 'data-state');
  check(state === 'done', 'çeviri tamamlandı (durum: ' + state + ')');
  const txt = (await p.textContent(tid('lib-translation-text')).catch(() => '')) ?? '';
  check(txt.trim().length > 0, 'çeviri metni ekranda (' + txt.trim().length + ' karakter)');
}
// Türkçe kaynakta düğme yok
await p.goto(base + '?tab=kutuphane&devzim=/testdata/sample_tr.zim', { waitUntil: 'networkidle' });
await p.waitForSelector(tid('lib-search'));
await p.click(tid('lib-search'));
await p.fill(tid('lib-search'), 'Ankara');
await p.waitForSelector(tid('lib-result'), { timeout: 15000 });
await p.click(tid('lib-result'));
await p.waitForSelector(tid('lib-article-title'));
check(!(await p.$(tid('lib-translate'))), 'Türkçe makalede çeviri düğmesi yok');
check(errors.length === 0, 'sayfa hatası yok ' + errors.join(' | '));
await b.close();
console.log(fails ? fails + ' HATA' : 'hepsi geçti');
process.exit(fails ? 1 : 0);
