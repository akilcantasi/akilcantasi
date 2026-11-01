// Kaynak araçları (çanta, hesap, stok, pil) akış denetimi:
//   node e2e/kaynak-check.mjs [http://localhost:5199/] [/tmp]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
const shots = process.argv[3] ?? '/tmp';
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };
const T = (id) => `[data-testid="${id}"]`;
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const plus = (n) => iso(new Date(Date.now() + n * 86400000));

const b = await pw.chromium.launch();

async function newPage(battery) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  if (battery !== undefined) {
    await p.addInitScript((cfg) => {
      if (cfg === null) { try { delete Navigator.prototype.getBattery; } catch {} navigator.getBattery = undefined; return; }
      const bm = new EventTarget();
      Object.assign(bm, cfg);
      window.__bat = bm;
      window.__setBat = (patch) => { Object.assign(bm, patch); bm.dispatchEvent(new Event('levelchange')); bm.dispatchEvent(new Event('chargingchange')); };
      navigator.getBattery = () => Promise.resolve(bm);
    }, battery);
  }
  return { p, ctx, errors };
}

async function shot(p, name, testid) {
  if (testid) await p.locator(T(testid)).scrollIntoViewIfNeeded();
  await p.waitForTimeout(150);
  await p.screenshot({ path: `${shots}/${name}.png` });
}

// ---------- Afet çantası ----------
{
  const { p, ctx, errors } = await newPage();
  await p.goto(base + '?tool=canta', { waitUntil: 'networkidle' });
  await p.waitForSelector(T('canta'));
  check((await p.textContent(T('canta-progress-text'))).includes('0 /'), 'çanta: başlangıçta %0');
  await p.click(T('canta-check-su'));
  await p.click(T('canta-check-fener'));
  const prog = await p.textContent(T('canta-progress-text'));
  check(/^2 \/ \d+/.test(prog.trim()), 'çanta: 2 öğe işaretli → ' + prog.trim());
  // son kullanma tarihleri
  await p.click(T('canta-date-btn-su'));
  await p.fill(T('canta-date-su'), plus(10));
  await p.click(T('canta-date-btn-ilkyardim'));
  await p.fill(T('canta-date-ilkyardim'), plus(-3));
  await p.waitForSelector(T('canta-alerts'));
  const al = await p.textContent(T('canta-alerts'));
  check(al.includes('1 geçmiş, 1 yaklaşan'), 'çanta: uyarı kutusu 1 geçmiş 1 yaklaşan');
  const order = await p.$$eval(`${T('canta-alerts')} li`, (ls) => ls.map((l) => l.getAttribute('data-testid')));
  check(order[0] === 'canta-alert-ilkyardim' && order[1] === 'canta-alert-su', 'çanta: en acil üstte');
  // özel öğe
  await p.fill(T('canta-add-name'), 'Yedek araba anahtarı');
  await p.selectOption(T('canta-add-group'), 'aletler');
  await p.click(T('canta-add-submit'));
  check((await p.textContent(T('canta-group-aletler'))).includes('Yedek araba anahtarı'), 'çanta: özel öğe eklendi');
  // seçenek
  check(!(await p.$(T('canta-group-bebek'))), 'çanta: bebek grubu kapalıyken gizli');
  await p.click(T('canta-opt-bebek'));
  check(!!(await p.$(T('canta-group-bebek'))), 'çanta: bebek grubu açıldı');
  await shot(p, 'kaynak-canta-top');
  // kalıcılık
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(T('canta'));
  check((await p.isChecked(T('canta-check-su'))) && (await p.isChecked(T('canta-check-fener'))), 'çanta: işaretler yeniden yüklemede kaldı');
  check(!!(await p.$(T('canta-alerts'))) && (await p.textContent(T('canta-group-aletler'))).includes('Yedek araba anahtarı'), 'çanta: tarih ve özel öğe kalıcı');
  // profiller ayrı
  await p.click(T('canta-profile-arac'));
  check((await p.textContent(T('canta-progress-text'))).trim().startsWith('0 /'), 'çanta: araç profili ayrı');
  check(!!(await p.$(T('canta-check-halat'))), 'çanta: araç profiline özgü öğe');
  await shot(p, 'kaynak-canta-arac');
  await p.click(T('canta-profile-ev'));
  // özel öğe silme (satır içi onay)
  const cid = (await p.$$eval('[data-testid^="canta-remove-"]', (els) => els.map((e) => e.getAttribute('data-testid')))).find((x) => !x.includes('-yes-') && !x.includes('-no-'));
  await p.click(T(cid));
  await shot(p, 'kaynak-canta-confirm', cid);
  await p.click(T(cid.replace('canta-remove-', 'canta-remove-yes-')));
  check(!(await p.textContent(T('canta-group-aletler'))).includes('Yedek araba anahtarı'), 'çanta: özel öğe silindi');
  // ortak modül
  const exp = await p.evaluate(async () => (await import('/src/tools/_kaynak/index.ts')).getExpiringSoon(30).map((x) => x.id + ':' + x.expired));
  check(JSON.stringify(exp) === JSON.stringify(['ilkyardim:true', 'su:false']), 'getExpiringSoon: ' + JSON.stringify(exp));
  check(errors.length === 0, 'çanta: konsol hatası yok ' + errors.join(' | '));
  await ctx.close();
}

// ---------- Hesap ----------
{
  const { p, ctx, errors } = await newPage();
  await p.goto(base + '?tool=hesap', { waitUntil: 'networkidle' });
  await p.waitForSelector(T('hesap'));
  // varsayılan 2 yetişkin, 3 gün
  check((await p.textContent(T('hesap-drink-total'))).trim() === '18 L', 'hesap: 2 yetişkin 3 gün içme 18 L');
  check((await p.textContent(T('hesap-water-total'))).trim() === '30 L', 'hesap: toplam 30 L');
  check((await p.textContent(T('hesap-kcal-total'))).trim() === '12.600', 'hesap: 12.600 kcal');
  await p.click(T('hesap-children-inc'));
  await p.click(T('hesap-babies-inc'));
  await p.fill(T('hesap-pets'), '1');
  await p.click(T('hesap-days-7'));
  await p.click(T('hesap-climate-sicak'));
  // içme: 3 kişi × 4,5 + bebek 1 = 14,5/gün → 101,5; toplam + 4×2 hijyen + 5,7 hayvan = 28,2/gün → 197,4
  check((await p.textContent(T('hesap-drink-total'))).trim() === '101,5 L', 'hesap: sıcak, 7 gün içme 101,5 L');
  check((await p.textContent(T('hesap-water-total'))).trim() === '197,4 L', 'hesap: toplam 197,4 L');
  check(!!(await p.$(T('hesap-baby-note'))) && !!(await p.$(T('hesap-pet-note'))), 'hesap: bebek ve hayvan notları');
  check((await p.$$('[data-testid^="hesap-src-"]')).length === 5, 'hesap: 5 kaynak gösteriliyor');
  await shot(p, 'kaynak-hesap-water', 'hesap-water');
  await shot(p, 'kaynak-hesap-food', 'hesap-food');
  await shot(p, 'kaynak-hesap-sources', 'hesap-sources');
  await p.click(T('hesap-climate-normal'));
  await p.click(T('hesap-days-3'));
  check(errors.length === 0, 'hesap: konsol hatası yok ' + errors.join(' | '));

  // ---------- Stok (aynı bağlam: hesap kaydı = 3 kişi + bebek + hayvan, normal, 3 gün) ----------
  await p.goto(base + '?tool=stok', { waitUntil: 'networkidle' });
  await p.waitForSelector(T('stok'));
  check(!!(await p.$(T('stok-empty'))), 'stok: boş durum');
  const add = async (o) => {
    await p.click(T('stok-add'));
    await p.click(T('stok-new-kind-' + o.kind));
    await p.fill(T('stok-new-name'), o.name);
    await p.fill(T('stok-new-qty'), o.qty);
    await p.selectOption(T('stok-new-unit'), o.unit);
    if (o.litre) await p.fill(T('stok-new-litre'), o.litre);
    if (o.kcal) await p.fill(T('stok-new-kcal'), o.kcal);
    if (o.loc) await p.fill(T('stok-new-location'), o.loc);
    if (o.exp) await p.fill(T('stok-new-expiry'), o.exp);
    await p.click(T('stok-new-save'));
  };
  await add({ kind: 'su', name: 'Damacana', qty: '3', unit: 'adet', litre: '19', loc: 'Kiler', exp: plus(200) });
  await add({ kind: 'gida', name: 'Makarna', qty: '2', unit: 'kg', kcal: '350', loc: 'Mutfak', exp: plus(400) });
  await add({ kind: 'gida', name: 'Ton balığı', qty: '6', unit: 'kutu', kcal: '190', loc: 'Kiler', exp: plus(5) });
  await add({ kind: 'diger', name: 'El feneri pili', qty: '8', unit: 'adet', loc: 'Çekmece' });
  check((await p.$$('[data-testid^="stok-item-"][data-testid*="s"]')).length >= 4, 'stok: 4 öğe eklendi');
  // hane: 2 yetişkin + 1 çocuk (içme 9) + bebek 1 = 10 L/gün içme; toplam 10 + 8 hijyen + 3,8 = 21,8
  check((await p.textContent(T('stok-water-days'))).includes('5,7'), 'stok: su 57 L / 10 L = 5,7 gün → ' + (await p.textContent(T('stok-water-days'))));
  // gıda: 7000 + 1140 = 8140 kcal / (3×2100) = 1,29 → 1,2
  check((await p.textContent(T('stok-food-days'))).includes('1,2'), 'stok: gıda 1,2 gün → ' + (await p.textContent(T('stok-food-days'))));
  const names = await p.$$eval(T('stok-item-name'), (e) => e.map((x) => x.textContent));
  check(names[0] === 'Ton balığı' && names[names.length - 1] === 'El feneri pili', 'stok: SKT sıralaması ' + names.join(','));
  await p.click(T('stok-sort-name'));
  const byName = await p.$$eval(T('stok-item-name'), (e) => e.map((x) => x.textContent));
  check(byName[0] === 'Damacana', 'stok: ada göre sıralama');
  await p.fill(T('stok-search'), 'kiler');
  check((await p.$$(T('stok-item-name'))).length === 2, 'stok: yer araması');
  await p.fill(T('stok-search'), 'tonbalik');
  check(!!(await p.$(T('stok-noresult'))), 'stok: sonuç yok durumu');
  await p.fill(T('stok-search'), 'balığı');
  check((await p.$$(T('stok-item-name'))).length === 1, 'stok: ad araması');
  await p.fill(T('stok-search'), '');
  await p.click(T('stok-sort-expiry'));
  await shot(p, 'kaynak-stok-list');
  // düzenle
  const mid = (await p.$$eval('[data-testid^="stok-edit-"]', (e) => e.map((x) => x.getAttribute('data-testid'))))[0];
  await p.click(T(mid));
  await p.fill(T('stok-edit-qty'), '12');
  await shot(p, 'kaynak-stok-edit', 'stok-edit-form');
  await p.click(T('stok-edit-save'));
  check((await p.$$eval(T('stok-item-qty'), (e) => e.map((x) => x.textContent))).includes('12 kutu'), 'stok: düzenleme kaydedildi');
  // sil (satır içi onay)
  const did = (await p.$$eval('[data-testid^="stok-del-"]', (e) => e.map((x) => x.getAttribute('data-testid')))).filter((x) => !/-yes-|-no-/.test(x)).pop();
  await p.click(T(did));
  await p.click(T(did.replace('stok-del-', 'stok-del-yes-')));
  check((await p.$$(T('stok-item-name'))).length === 3, 'stok: silindi');
  // dışa aktar
  await p.click(T('stok-export-toggle'));
  const txt = await p.textContent(T('stok-export'));
  check(txt.includes('Akıl Çantası — Stok listesi') && txt.includes('Damacana: 3 adet') && txt.includes('Su: 57 L'), 'stok: metin dışa aktarma');
  await shot(p, 'kaynak-stok-export', 'stok-export');
  // kalıcılık
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector(T('stok-list'));
  check((await p.$$(T('stok-item-name'))).length === 3, 'stok: yeniden yüklemede kaldı');
  await shot(p, 'kaynak-stok-coverage');
  // çanta ekranı stoktan gelen uyarıyı görmez, ortak modül görür
  const exp = await p.evaluate(async () => (await import('/src/tools/_kaynak/index.ts')).getExpiringSoon(30).map((x) => x.source + ':' + x.name));
  check(exp.includes('stok:Ton balığı'), 'getExpiringSoon stok öğesini içeriyor');
  check(errors.length === 0, 'stok: konsol hatası yok ' + errors.join(' | '));
  await ctx.close();
}

// ---------- Pil: API var ----------
{
  const { p, ctx, errors } = await newPage({ level: 0.62, charging: false, chargingTime: Infinity, dischargingTime: Infinity });
  // önceki 10 dakikalık ölçüm: %70 → %62 (dk'da %0,8) → %62 için ~78 dk
  await p.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    const now = Date.now();
    const s = [];
    for (let i = 0; i <= 10; i++) s.push({ t: now - (10 - i) * 60000 - 500, level: Math.round((0.7 - i * 0.008) * 1000) / 1000, charging: false });
    localStorage.setItem('ac.kaynak.pil.v1', JSON.stringify(s));
  });
  await p.goto(base + '?tool=pil', { waitUntil: 'networkidle' });
  await p.waitForSelector(T('pil-level'));
  check((await p.textContent(T('pil-level'))).trim() === '%62', 'pil: seviye %62');
  check((await p.textContent(T('pil-charging'))).trim() === 'Pilde', 'pil: şarj durumu');
  const rem = (await p.textContent(T('pil-remaining'))).trim();
  check(/^1 sa 1[5-9] dk$/.test(rem), 'pil: ölçümden kalan süre ~1 sa 17 dk → ' + rem);
  check((await p.textContent(T('pil-basis'))).includes('saatte'), 'pil: ölçüm açıklaması');
  await shot(p, 'kaynak-pil');
  await p.evaluate(() => window.__setBat({ charging: true, level: 0.63, chargingTime: 3600 }));
  await p.waitForTimeout(200);
  check((await p.textContent(T('pil-charging'))).trim() === 'Şarj oluyor', 'pil: şarja geçiş');
  check((await p.textContent(T('pil-remaining'))).trim() === '1 sa', 'pil: dolmaya kalan (sistem) 1 sa');
  // uygulama pil tasarrufu
  const before = await p.getAttribute(T('pil-saver-switch'), 'aria-checked');
  await p.click(T('pil-saver-switch'));
  check((await p.getAttribute(T('pil-saver-switch'), 'aria-checked')) !== before, 'pil: tasarruf anahtarı değişti');
  check(await p.evaluate(() => document.body.classList.contains('saver')) === (before !== 'true'), 'pil: body.saver sınıfı uygulandı');
  check(await p.evaluate(() => localStorage.getItem('ac.batterySaver')) === (before !== 'true' ? '1' : '0'), 'pil: store kaydetti');
  await shot(p, 'kaynak-pil-tips', 'pil-tips');
  await p.click(T('pil-saver-switch'));
  check(errors.length === 0, 'pil: konsol hatası yok ' + errors.join(' | '));
  await ctx.close();
}

// ---------- Pil: API yok ----------
{
  const { p, ctx, errors } = await newPage(null);
  await p.goto(base + '?tool=pil', { waitUntil: 'networkidle' });
  await p.waitForSelector(T('pil-unsupported'));
  check(true, 'pil: API yokken yedek mesaj');
  check(!!(await p.$(T('pil-saver-switch'))) && !!(await p.$(T('pil-tips'))), 'pil: yedekte anahtar ve ipuçları var');
  await shot(p, 'kaynak-pil-nobattery');
  check(errors.length === 0, 'pil yedek: konsol hatası yok ' + errors.join(' | '));
  await ctx.close();
}

await b.close();
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
