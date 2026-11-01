// Rehber sekmesi QA regresyon betiği:
//   node e2e/qa-rehber.mjs [http://localhost:5199/] [/tmp/qa-rehber]
// Ana ekran (18 kategori, 3 hayati kısayol, arama), her kategori ve her rehber
// (adımlar, çizimler, 112 bandı, Yapmayın, kaynaklar, inceleme notu, Fener'e sor),
// doğrudan bağlantılar, geri dönüş, yerleşim (390×844, 360×640, 1280×800) ve konsol hataları.
import { createRequire } from 'module';
import { mkdirSync } from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const base = (process.argv[2] ?? 'http://localhost:5199/').replace(/\/?$/, '/');
const shots = process.argv[3] ?? '/tmp/qa-rehber';
mkdirSync(shots, { recursive: true });
const fails = [];
let oks = 0;
const check = (ok, m) => {
  if (ok) oks++;
  else { console.log('FAIL ' + m); fails.push(m); }
};
const b = await pw.chromium.launch();
const errors = [];
async function newPage(vp = { width: 390, height: 844 }) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 1 });
  p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  return p;
}
const T = (id) => `[data-testid="${id}"]`;

const p = await newPage();
await p.goto(base + '?tab=rehber', { waitUntil: 'networkidle' });
// Uygulamanın kullandığı modüllerin aynısını (Vite) sayfada yükleyip beklenen veriyi al
const data = await p.evaluate(async () => {
  const c = await import('/src/content/categories.ts');
  const g = await import('/src/content/guides.ts');
  const a = await import('/src/content/guide-art.ts');
  return {
    cats: c.CATEGORIES.map((x) => ({ id: x.id, title: x.title, guides: x.guides })),
    guides: Object.fromEntries(
      g.GUIDES.map((x) => [x.id, {
        title: x.title, steps: x.steps.length, dont: x.dont?.length ?? 0, call: !!x.callEmergency,
        reviewed: !!x.reviewed, sources: x.sources, art: (a.GUIDE_ART[x.id] ?? []).filter(Boolean).length,
      }]),
    ),
  };
});
const ids = Object.keys(data.guides);
check(ids.length === 168, `168 rehber (${ids.length})`);
check(data.cats.length === 18, `18 kategori (${data.cats.length})`);

// --- Ana ekran -----------------------------------------------------------------
const tiles = await p.$$eval(T('guide-category'), (els) => els.map((e) => [e.dataset.categoryId, e.querySelector('.rh-cat-count')?.textContent]));
check(tiles.length === 18, `ana ekranda 18 kutu (${tiles.length})`);
for (const c of data.cats) {
  const t = tiles.find((x) => x[0] === c.id);
  check(t && t[1] === `${c.guides.length} rehber`, `kutu sayacı ${c.id}: ${t?.[1]}`);
}
const sos = await p.$$eval(T('guide-sos'), (els) => els.map((e) => [e.dataset.guideId, e.textContent.trim()]));
check(JSON.stringify(sos) === JSON.stringify([['temel-yasam-destegi', 'Kalp masajı'], ['kanama', 'Kanama'], ['hava-yolu-tikanmasi', 'Boğulma']]), 'üç hayati kısayol: ' + JSON.stringify(sos));
await p.screenshot({ path: shots + '/home-390.png', fullPage: true });
for (const [id] of sos) {
  await p.click(`${T('guide-sos')}[data-guide-id="${id}"]`);
  check((await p.textContent('#rh-title')) === data.guides[id].title, `kısayol ${id} rehberi açar`);
  check((await p.textContent(T('guide-back'))).trim() === '← Rehber', `kısayoldan açılan ${id}: geri "← Rehber"`);
  await p.click(T('guide-back'));
  check((await p.$$(T('guide-category'))).length === 18, `kısayol ${id}: geri ana ekrana döner`);
}

// --- Arama -----------------------------------------------------------------------
const firstCard = async () => p.$eval(T('guide-card'), (e) => e.dataset.guideId).catch(() => null);
const SEARCH = [
  ['kanama', 'kanama'], ['tüp', 'tesisat-tup-guvenligi'], ['şarj', 'tesisat-gunes-powerbank'], ['powerbank', 'tesisat-gunes-powerbank'],
  ['sel', 'sel'], ['dolu arabada', 'hava-dolu'], ['insülin', 'ozel-gruplar-kronik-hastalik'], ['kene', 'yaralanma-kene'],
  ['köpek ısırdı', 'yaralanma-kuduz-isirik'], ['deprm oluyo', 'deprem-aninda'], ['ORMANDA KAYBOLDUM', 'doga-kaybolma'],
];
for (const [q, id] of SEARCH) {
  await p.fill(T('guide-search'), q);
  check((await firstCard()) === id, `arama "${q}" → ${id} (${await firstCard()})`);
  check((await p.$$(T('guide-category'))).length === 0, `arama "${q}": kutular gizlenir`);
}
for (const q of ['qwerty', 'dolar kaç tl', 'bugün hava nasıl']) {
  await p.fill(T('guide-search'), q);
  const empty = await p.$('.empty');
  check(!!empty && (await empty.textContent()).includes('için rehber bulunamadı'), `arama "${q}": boş durum`);
  check((await p.$$(T('guide-card'))).length === 0, `arama "${q}": sonuç yok`);
}
await p.fill(T('guide-search'), 'kanama');
await p.screenshot({ path: shots + '/search-390.png', fullPage: true });
await p.click(`${T('guide-card')}[data-guide-id="kanama"]`);
check((await p.textContent(T('guide-back'))).trim() === '← Arama sonuçları', 'aramadan açılan rehber: geri "← Arama sonuçları"');
await p.click(T('guide-back'));
check((await p.inputValue(T('guide-search'))) === 'kanama' && (await firstCard()) === 'kanama', 'geri: arama sonuçları korunur');
await p.fill(T('guide-search'), '');
check((await p.$$(T('guide-category'))).length === 18, 'arama temizlenince kutular geri gelir');

// --- Her kategori, her rehber ---------------------------------------------------------
const seen = new Set();
for (const c of data.cats) {
  await p.click(`${T('guide-category')}[data-category-id="${c.id}"]`);
  await p.waitForSelector(T('category-detail'));
  check((await p.textContent('.rh-title')) === c.title, `kategori başlığı ${c.id}`);
  const list = await p.$$eval(T('guide-card'), (els) => els.map((e) => e.dataset.guideId));
  check(JSON.stringify(list) === JSON.stringify(c.guides), `kategori ${c.id}: tüm rehberler listelenir (${list.length}/${c.guides.length})`);
  for (const id of c.guides) {
    const g = data.guides[id];
    await p.click(`${T('guide-card')}[data-guide-id="${id}"]`);
    await p.waitForSelector(T('guide-detail'));
    check((await p.textContent('#rh-title')) === g.title, `${id}: başlık`);
    if (!seen.has(id)) {
      seen.add(id);
      const d = await p.evaluate(() => {
        const steps = [...document.querySelectorAll('[data-testid="guide-step"]')];
        const hs = [...document.querySelectorAll('.rh-h')].map((h) => h.textContent);
        return {
          steps: steps.length,
          art: steps.filter((s) => s.querySelector('.art-box svg')).length,
          emptyStep: steps.some((s) => !s.querySelector('.rh-step-text')?.textContent.trim()),
          call: !!document.querySelector('[data-testid="guide-112"] a[href="tel:112"]'),
          dont: hs.includes('Yapmayın') ? document.querySelectorAll('.rh-dont li').length : 0,
          src: document.querySelector('.rh-src')?.textContent ?? '',
          review: !!document.querySelector('[data-testid="guide-review"]'),
          ask: !!document.querySelector('[data-testid="guide-ask"]'),
        };
      });
      check(d.steps === g.steps && !d.emptyStep, `${id}: ${g.steps} adım (${d.steps})`);
      check(d.art === g.art, `${id}: ${g.art} çizimli adım (${d.art})`);
      check(d.call === g.call, `${id}: 112 bandı ${g.call}`);
      check(d.dont === g.dont, `${id}: Yapmayın ${g.dont} (${d.dont})`);
      check(g.sources.length > 0 && g.sources.every((s) => d.src.includes(s)), `${id}: kaynaklar`);
      check(d.review === !g.reviewed, `${id}: inceleme notu`);
      check(d.ask, `${id}: Fener'e sor düğmesi`);
    }
    check((await p.textContent(T('guide-back'))).trim() === '← ' + c.title, `${id}: geri düğmesi "${c.title}"`);
    await p.click(T('guide-back'));
    await p.waitForSelector(T('category-detail'));
    check((await p.textContent('.rh-title')) === c.title, `${id}: geri ${c.id} kategorisine döner`);
  }
  await p.click(T('category-back'));
  check((await p.$$(T('guide-category'))).length === 18, `kategori ${c.id}: geri ana ekran`);
}
check(seen.size === 168, `168 rehberin hepsi açıldı (${seen.size})`);

// --- Fener'e sor ------------------------------------------------------------------------
await p.goto(base + '?guide=yaralanma-kene', { waitUntil: 'networkidle' });
await p.click(T('guide-ask'));
await p.waitForSelector(T('fener-msg-user'), { timeout: 5000 }).catch(() => {});
check((await p.getAttribute(T('nav-fener'), 'aria-current')) === 'page', "Fener'e sor: Fener sekmesi açılır");
const asked = await p.$$eval(T('fener-msg-user'), (els) => els.map((e) => e.textContent));
check(asked.some((t) => t.includes('Kene tutunması ve KKKA')), "Fener'e sor: soru rehber başlığıyla gönderilir");
await p.waitForSelector(`${T('fener-msg-bot')}[data-phase="done"]`, { timeout: 15000 }).catch(() => {});
const src = await p.$$eval(T('fener-source'), (els) => els.map((e) => e.textContent)).catch(() => []);
check(src.some((t) => t.includes('Kene')), "Fener'e sor: kaynak olarak aynı rehber gösterilir (" + src.join(' | ') + ')');
await p.screenshot({ path: shots + '/fener-ask.png', fullPage: false });

// --- Doğrudan bağlantılar ------------------------------------------------------------------
const deep = async (qs) => {
  await p.goto(base + qs, { waitUntil: 'load', timeout: 60000 });
  await p.waitForSelector('[data-testid="guide-detail"], [data-testid="category-detail"], [data-testid="guide-category"]', { timeout: 30000 });
};
await deep('?guide=kanama');
check((await p.textContent('#rh-title')) === data.guides.kanama.title, '?guide=kanama');
check((await p.textContent(T('guide-back'))).trim() === '← Hayati ilk yardım', '?guide=kanama: geri ana kategoriye');
await p.click(T('guide-back'));
check((await p.textContent('.rh-title')) === 'Hayati ilk yardım', '?guide=kanama: geri → ilk yardım kategorisi');
await deep('?cat=hava');
check((await p.$(T('category-detail'))) && (await p.textContent('.rh-title')) === data.cats.find((c) => c.id === 'hava').title, '?cat=hava');
await deep('?cat=hava&guide=hipotermi');
check((await p.textContent(T('guide-back'))).trim() === '← ' + data.cats.find((c) => c.id === 'hava').title, '?cat=hava&guide=hipotermi: geri hava kategorisine (alsoIn)');
await deep('?cat=deprem&guide=kanama');
check((await p.textContent(T('guide-back'))).trim() === '← Hayati ilk yardım', '?cat=deprem&guide=kanama: rehber o kategoride değilse ana kategorisine');
await deep('?guide=boyle-bir-rehber-yok');
check((await p.$$(T('guide-category'))).length === 18, '?guide=geçersiz → ana ekran');
await deep('?cat=yok');
check((await p.$$(T('guide-category'))).length === 18, '?cat=geçersiz → ana ekran');
await deep('?tab=rehber');
check((await p.$$(T('guide-category'))).length === 18, '?tab=rehber → ana ekran');

// --- Yerleşim: taşma ve dokunma hedefleri -----------------------------------------------------
const longest = ids.reduce((a, x) => (data.guides[x].title.length > data.guides[a].title.length ? x : a), ids[0]);
const VIEWS = [['390', { width: 390, height: 844 }], ['360', { width: 360, height: 640 }], ['1280', { width: 1280, height: 800 }]];
for (const [name, vp] of VIEWS) {
  const q = await newPage(vp);
  for (const [label, qs] of [['home', '?tab=rehber'], ['cat', '?cat=yaralanma'], ['guide', '?guide=' + longest], ['guide2', '?guide=temel-yasam-destegi']]) {
    await q.goto(base + qs, { waitUntil: 'load', timeout: 60000 });
    await q.waitForSelector('#main .pad', { timeout: 30000 });
    await q.waitForTimeout(300);
    const r = await q.evaluate(() => {
      const main = document.getElementById('main');
      const out = { hscroll: main.scrollWidth > main.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth + 1, overflow: [], small: [] };
      for (const el of main.querySelectorAll('button, a, input')) {
        const b = el.getBoundingClientRect();
        if (b.width && (b.height < 44 || b.width < 44)) out.small.push((el.dataset.testid || el.className) + ` ${Math.round(b.width)}×${Math.round(b.height)}`);
      }
      for (const el of main.querySelectorAll('.rh-title, .rh-row-title, .rh-cat-title, .rh-cat-hint, .rh-step-text, .rh-sos-chip, .rh-back, .rh-src, .rh-dont li, .rh-summary')) {
        if (el.scrollWidth > el.clientWidth + 1) out.overflow.push(el.className + ': ' + el.textContent.slice(0, 30));
      }
      return out;
    });
    check(!r.hscroll, `${name} ${label}: yatay kaydırma yok`);
    check(!r.overflow.length, `${name} ${label}: metin taşması yok ${r.overflow.join('; ')}`);
    check(!r.small.length, `${name} ${label}: dokunma hedefleri ≥44px ${r.small.slice(0, 5).join('; ')}`);
    await q.screenshot({ path: `${shots}/${label}-${name}.png`, fullPage: label !== 'guide2' });
  }
  await q.close();
}

await b.close();
const errs = errors.filter((e) => !/Failed to load resource.*(404|net::ERR)/.test(e));
check(!errs.length, 'konsol hatası yok: ' + errs.slice(0, 5).join(' | '));
console.log(`${oks} OK, ${fails.length} HATA`);
process.exit(fails.length ? 1 : 0);
