// Bilgi ve eğlence araçları uçtan uca kontrol (Çocuk köşesi, Acil durum cümleleri, Radyo rehberi):
//   node e2e/eglence-check.mjs [http://localhost:5199/] [/tmp/ekran-klasoru]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:5199/';
const shots = process.argv[3] ?? '/tmp';
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };

const b = await pw.chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

// speechSynthesis taklidi: Türkçe ve Arapça ses var, okunan metinler kaydedilir
await p.addInitScript(() => {
  const voices = [
    { lang: 'tr-TR', name: 'Türkçe', default: true, localService: true, voiceURI: 'tr' },
    { lang: 'ar-SA', name: 'Arabic', default: false, localService: true, voiceURI: 'ar' },
  ];
  window.__spoken = [];
  window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  const s = window.speechSynthesis;
  s.getVoices = () => voices;
  s.speak = (u) => { window.__spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 5); };
  s.cancel = () => {};
});

const tid = (id) => `[data-testid="${id}"]`;
const go = async (q) => { await p.goto(base + q, { waitUntil: 'networkidle' }); await p.waitForTimeout(300); };

// ---------------- Çocuk köşesi ----------------
await go('?tool=cocuk');
check(!!(await p.$(tid('ck-open-masal'))), 'çocuk köşesi ana ekranı');
await p.screenshot({ path: shots + '/eg-cocuk-home.png' });

// Masallar
await p.click(tid('ck-open-masal'));
const nStories = (await p.$$('[data-testid="masal-list"] > button')).length;
check(nStories >= 12, `en az 12 masal kartı (${nStories})`);
await p.click(tid('masal-tospi'));
await p.waitForSelector(tid('masal-reader'));
const txt = await p.textContent(tid('masal-text'));
check(txt.includes('Tospi') && txt.split(/\s+/).length > 250, 'masal metni açıldı');
const fs0 = await p.$eval(tid('masal-text'), (e) => parseFloat(getComputedStyle(e).fontSize));
await p.click(tid('masal-bigger'));
const fs1 = await p.$eval(tid('masal-text'), (e) => parseFloat(getComputedStyle(e).fontSize));
check(fs1 > fs0 && fs0 >= 20, `yazı büyütme (${fs0} → ${fs1}px)`);
await p.click(tid('masal-read'));
await p.waitForTimeout(400);
const spoken = await p.evaluate(() => window.__spoken);
check(spoken.length > 3 && spoken[0].includes('Tospi'), `sesli oku: ${spoken.length} parça okundu`);
await p.screenshot({ path: shots + '/eg-masal.png' });
await p.click(tid('masal-back'));
await p.click(tid('ck-home'));

// Hafıza: önce yanlış eşleşme, sonra tüm eşleri bul
await p.click(tid('ck-open-hafiza'));
await p.click(tid('hafiza-level-1')); // 6 çift
const cards = await p.$$eval('[data-testid^="hafiza-card-"]', (els) => els.map((e) => e.getAttribute('data-pic')));
check(cards.length === 12, `orta seviye 12 kart (${cards.length})`);
const a = 0, bad = cards.findIndex((c, i) => i > 0 && c !== cards[0]);
await p.click(tid('hafiza-card-' + a));
await p.click(tid('hafiza-card-' + bad));
check((await p.getAttribute(tid('hafiza-card-' + bad), 'data-state')) === 'open', 'yanlış kart kısa süre açık');
await p.screenshot({ path: shots + '/eg-hafiza-mismatch.png' });
await p.waitForTimeout(1100);
check((await p.getAttribute(tid('hafiza-card-' + a), 'data-state')) === 'closed', 'yanlış eşleşme kapandı');
const done = new Set();
for (let i = 0; i < cards.length; i++) {
  if (done.has(i)) continue;
  const j = cards.findIndex((c, k) => k !== i && c === cards[i]);
  await p.click(tid('hafiza-card-' + i));
  await p.click(tid('hafiza-card-' + j));
  done.add(i); done.add(j);
  await p.waitForTimeout(80);
}
check(!!(await p.$(tid('hafiza-win'))), 'hafıza oyunu kazanıldı');
check((await p.textContent(tid('hafiza-moves'))).trim() === '7', 'hamle sayısı 7 (1 yanlış + 6 doğru)');
await p.screenshot({ path: shots + '/eg-hafiza-win.png', fullPage: true });
await p.click(tid('ck-home'));

// Boyama: kova ile ev duvarını boya, fırçayla çiz, geri al, sil
await p.click(tid('ck-open-boya'));
await p.click(tid('boya-pic-house'));
await p.waitForSelector(tid('boya-canvas'));
const px = (x, y) => p.$eval(tid('boya-canvas'), (c, [x, y]) => Array.from(c.getContext('2d').getImageData(x, y, 1, 1).data), [x, y]);
const box = await (await p.$(tid('boya-canvas'))).boundingBox();
const at = async (u, v) => { const bb = await (await p.$(tid('boya-canvas'))).boundingBox(); return { x: bb.x + (u / 100) * bb.width, y: bb.y + (v / 100) * bb.height }; };
check((await px(420, 480)).slice(0, 3).join() === '255,255,255', 'boş sayfa beyaz');
await p.click(tid('boya-color-3a86ff'));
let pt = await at(70, 80);
await p.mouse.click(pt.x, pt.y);
await p.waitForTimeout(150);
check((await px(420, 480)).slice(0, 3).join() === '58,134,255', 'kova duvarı maviye boyadı');
check((await px(200, 200)).slice(0, 3).join() === '255,255,255', 'çatı/dış bölge boyanmadı (çizgi sınırı)');
check((await px(300, 30)).slice(0, 3).join() === '255,255,255', 'dış alan boyanmadı');
await p.click(tid('boya-color-e63946'));
pt = await at(50, 40);
await p.mouse.click(pt.x, pt.y);
await p.waitForTimeout(150);
check((await px(300, 240)).slice(0, 3).join() === '230,57,70', 'çatı kırmızı');
await p.click(tid('boya-tool-brush'));
await p.click(tid('boya-color-52b788'));
const box2 = await (await p.$(tid('boya-canvas'))).boundingBox();
const s0 = { x: box2.x + 0.1 * box2.width, y: box2.y + 0.95 * box2.height }, s1 = { x: box2.x + 0.9 * box2.width };
await p.mouse.move(s0.x, s0.y);
await p.mouse.down();
for (let k = 1; k <= 10; k++) await p.mouse.move(s0.x + ((s1.x - s0.x) * k) / 10, s0.y);
await p.mouse.up();
await p.waitForTimeout(150);
check((await px(300, 570)).slice(0, 3).join() === '82,183,136', 'fırça yeşil çizgi çizdi');
await p.screenshot({ path: shots + '/eg-boyama.png' });
await p.click(tid('boya-undo'));
check((await px(300, 570)).slice(0, 3).join() === '255,255,255', 'geri al fırçayı sildi');
check((await px(300, 240)).slice(0, 3).join() === '230,57,70', 'geri al sonrası çatı kırmızı kaldı');
await p.click(tid('boya-clear'));
check(!!(await p.$(tid('boya-clear-yes'))), 'silme onayı satır içi');
await p.click(tid('boya-clear-yes'));
check((await px(420, 480)).slice(0, 3).join() === '255,255,255', 'sil: sayfa temizlendi');
await p.click(tid('boya-back'));
const nPics = (await p.$$('[data-testid^="boya-pic-"]')).length;
check(nPics >= 6, `en az 6 boyama resmi (${nPics})`);
await p.click(tid('ck-home'));

// Bilgi yarışması: her soruda ilk seçeneği seç, doğru sayısını say
await p.click(tid('ck-open-bilgi'));
let right = 0, total = 0;
while (await p.$(tid('quiz-q'))) {
  await p.click(tid('quiz-opt-0'));
  const cls = await p.getAttribute(tid('quiz-feedback'), 'class');
  if (cls.includes('ok')) right++;
  total++;
  if (total === 2) await p.screenshot({ path: shots + '/eg-quiz.png' });
  await p.click(tid('quiz-next'));
}
check(total >= 10, `quiz ${total} soru`);
const sc = (await p.textContent(tid('quiz-score'))).replace(/\s/g, '');
check(sc === `${right}/${total}`, `skor doğru (${sc})`);
await p.screenshot({ path: shots + '/eg-quiz-done.png' });
await p.click(tid('ck-home'));

// Nefes
await p.click(tid('ck-open-nefes'));
await p.click(tid('nefes-start'));
await p.waitForTimeout(1500);
check((await p.textContent(tid('nefes-phase'))).includes('Nefes al'), 'nefes al evresi');
const sc1 = parseFloat(await p.getAttribute(tid('nefes-balloon'), 'data-scale'));
await p.waitForTimeout(1800);
const sc2 = parseFloat(await p.getAttribute(tid('nefes-balloon'), 'data-scale'));
check(sc2 > sc1, `balon şişiyor (${sc1} → ${sc2})`);
await p.waitForTimeout(1500);
check((await p.textContent(tid('nefes-phase'))).includes('Nefes ver'), 'nefes ver evresi (4 sn sonra)');
await p.screenshot({ path: shots + '/eg-nefes.png' });
await p.click(tid('nefes-start'));

// ---------------- Acil durum cümleleri ----------------
await go('?tool=sozluk');
check((await p.textContent(tid('sz-count'))).includes('İngilizce'), 'varsayılan İngilizce');
await p.click(tid('sz-lang-ar'));
check((await p.getAttribute(tid('sz-t-t01'), 'dir')) === 'rtl', 'Arapça sağdan sola');
check((await p.textContent(tid('sz-t-t01'))).includes('طبيب'), 'Arapça doktor cümlesi');
await p.click(tid('sz-say-t01'));
await p.waitForTimeout(100);
check((await p.evaluate(() => window.__spoken)).some((t) => t.includes('طبيب')), 'Arapça sesli okuma');
await p.screenshot({ path: shots + '/eg-sozluk-ar.png' });
await p.click(tid('sz-lang-ku'));
check(await p.isDisabled(tid('sz-say-t01')), 'Kürtçe ses yoksa oku düğmesi pasif');
await p.fill(tid('sz-search'), 'su');
const found = await p.$$('[data-testid^="sz-item-"]');
check(found.length > 0 && !!(await p.$(tid('sz-item-i01'))), `"su" araması (${found.length})`);
await p.click(tid('sz-cat-aile'));
check(!(await p.$(tid('sz-item-i01'))), 'kategori filtresi');
await p.fill(tid('sz-search'), 'qqzz');
check(!!(await p.$(tid('sz-empty'))), 'boş sonuç durumu');
await p.fill(tid('sz-search'), '');
await p.click(tid('sz-cat-all'));
await p.click(tid('sz-lang-ru'));
await p.click(tid('sz-all-k01'));
const all = await p.textContent(tid('sz-alllist-k01'));
check(['Help!', 'ساعدوني', 'کمک', 'Hawar', 'Помогите', 'Допоможіть', 'Hilfe'].every((w) => all.includes(w)), 'tüm diller listesi');
await p.click(tid('sz-big-k01'));
await p.waitForSelector(tid('sz-bigview'));
check((await p.textContent(tid('sz-big-text'))).includes('Помогите'), 'büyük göster Rusça');
await p.screenshot({ path: shots + '/eg-sozluk-big.png' });
await p.click(tid('sz-big-close'));
check(!(await p.$(tid('sz-bigview'))), 'büyük gösterim kapandı');
await p.click(tid('sz-lang-fa'));
await p.screenshot({ path: shots + '/eg-sozluk-fa.png' });

// ---------------- Radyo rehberi ----------------
await go('?tool=radyo');
check(!!(await p.$(tid('rd-hero'))), 'radyo: özet kartı');
for (const s of ['ne', 'duyuru', 'ayar', 'anten', 'arac', 'pil']) {
  await p.click(tid('rd-sec-' + s));
  check(!!(await p.$(tid('rd-body-' + s))), 'bölüm açılıyor: ' + s);
}
await p.click(tid('rd-sec-frekans'));
await p.selectOption(tid('rd-city'), 'ankara');
check((await p.textContent(tid('rd-f-trt-radyo-1'))).includes('93.3'), 'Ankara Radyo 1 93.3');
check((await p.textContent(tid('rd-source'))).includes('radyo.trt.net.tr'), 'kaynak satırı');
await p.$eval(tid('rd-freq-table'), (e) => e.scrollIntoView({ block: 'center' }));
await p.screenshot({ path: shots + '/eg-radyo-frekans.png' });

check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
await b.close();
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
