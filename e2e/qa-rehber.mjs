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

// --- Denetim 2026-11 ----------------------------------------------------------------------------
// Ana ekran sahnesi: geçiş, çizimin alt kenarından önce zemine karışmalı (kenar çizgisi görünmesin)
for (const vp of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 800 }]) {
  const q = await newPage(vp);
  await q.goto(base + '?tab=rehber', { waitUntil: 'networkidle' });
  await q.waitForSelector('.rh-hero-bg .art-box svg', { timeout: 15000 });
  const r = await q.evaluate(() => {
    const bg = document.querySelector('.rh-hero-bg').getBoundingClientRect();
    const svg = document.querySelector('.rh-hero-bg .art-box svg').getBoundingClientRect();
    // ::after geçişi --bg'ye %84'te ulaşır (RehberTab CSS)
    return { fadeEnd: bg.top + bg.height * 0.84, artBottom: svg.bottom };
  });
  check(r.fadeEnd <= r.artBottom + 1, `${vp.width}: sahne çizimi geçişten önce bitmiyor (${Math.round(r.fadeEnd)} ≤ ${Math.round(r.artBottom)})`);
  await q.close();
}
// Geri dönüşte liste kaydırma konumu korunur
{
  const q = await newPage({ width: 360, height: 640 });
  await q.goto(base + '?cat=yaralanma', { waitUntil: 'networkidle' });
  await q.waitForSelector(T('guide-card'));
  await q.evaluate(() => document.getElementById('main').scrollTo({ top: 900 }));
  await q.waitForTimeout(200);
  const y0 = await q.evaluate(() => document.getElementById('main').scrollTop);
  const id = await q.evaluate(() => {
    const m = document.getElementById('main').getBoundingClientRect();
    const c = [...document.querySelectorAll('[data-testid="guide-card"]')].find((e) => { const r = e.getBoundingClientRect(); return r.top > m.top && r.bottom < m.bottom; });
    return c?.dataset.guideId;
  });
  await q.click(`${T('guide-card')}[data-guide-id="${id}"]`);
  await q.waitForSelector(T('guide-detail'));
  check((await q.evaluate(() => document.getElementById('main').scrollTop)) === 0, 'rehber en üstten açılır');
  await q.click(T('guide-back'));
  await q.waitForSelector(T('category-detail'));
  await q.waitForTimeout(150);
  const y1 = await q.evaluate(() => document.getElementById('main').scrollTop);
  check(y0 > 300 && Math.abs(y1 - y0) <= 4, `rehberden kategoriye dönünce kaydırma konumu korunur (${y0} → ${y1})`);
  await q.click(T('category-back'));
  await q.waitForSelector(T('guide-category'));
  await q.evaluate(() => document.getElementById('main').scrollTo({ top: 700 }));
  await q.waitForTimeout(200);
  const h0 = await q.evaluate(() => document.getElementById('main').scrollTop);
  await q.click(`${T('guide-category')}[data-category-id="yangin"]`);
  await q.waitForSelector(T('category-detail'));
  check((await q.evaluate(() => document.getElementById('main').scrollTop)) === 0, 'kategori en üstten açılır');
  await q.click(T('category-back'));
  await q.waitForTimeout(150);
  const h1 = await q.evaluate(() => document.getElementById('main').scrollTop);
  check(Math.abs(h1 - h0) <= 4, `kategoriden ana ekrana dönünce kaydırma konumu korunur (${h0} → ${h1})`);
  // Sonuçsuz aramada sorgu tek dokunuşla Fener'e sorulur
  await q.fill(T('guide-search'), 'qwerty asdf');
  await q.waitForSelector(T('guide-search-ask'));
  await q.click(T('guide-search-ask'));
  await q.waitForSelector(T('fener-msg-user'), { timeout: 5000 }).catch(() => {});
  check((await q.getAttribute(T('nav-fener'), 'aria-current')) === 'page', 'sonuçsuz arama: "Fener\'e sor" Fener sekmesini açar');
  const asked = await q.$$eval(T('fener-msg-user'), (els) => els.map((e) => e.textContent));
  check(asked.some((t) => t.includes('qwerty asdf')), 'sonuçsuz arama: sorgu Fener\'e gönderilir');
  await q.close();
}
// Kendine Yetmek paketi: kurulu değil → indir → kategoriler → paket rehberi; bozuk paket → silip yeniden indir
{
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const packFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'rehber', 'kendine-yetmek.rehber.json');
  if (!fs.existsSync(packFile)) console.log('  (data/rehber/kendine-yetmek.rehber.json yok: paket testi atlandı)');
  else {
    const body = fs.readFileSync(packFile);
    for (const broken of [false, true]) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
      let hits = 0;
      await ctx.route(/huggingface\.co\/.*kendine-yetmek\.rehber\.json/, (r) => {
        hits++;
        r.fulfill({ status: 200, headers: { 'content-length': String(body.length), 'access-control-allow-origin': '*' }, body });
      });
      const q = await ctx.newPage();
      q.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
      q.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
      await q.goto(base + '?tab=rehber', { waitUntil: 'networkidle' });
      await q.waitForSelector(T('ky-download'), { timeout: 15000 });
      if (!broken) {
        check(/^Hepsini indir \(\d+ MB\)$/.test((await q.textContent(T('ky-download'))).trim()), 'Kendine Yetmek: indirme düğmesi boyutu gösterir');
        const bg = await q.$eval(T('ky-download'), (e) => getComputedStyle(e).backgroundColor);
        check(bg === 'rgb(245, 165, 36)', 'Kendine Yetmek: düğme Şafak kehribarı ' + bg);
        await q.click(T('ky-download'));
      } else {
        // Bozuk dosya cihazda: açılamadı uyarısı görünmeli ("açılıyor…" yazısında kalmamalı)
        await q.evaluate(async () => {
          const root = await navigator.storage.getDirectory();
          const dir = await root.getDirectoryHandle('packs', { create: true });
          const w = await (await dir.getFileHandle('kendine-yetmek.rehber.json', { create: true })).createWritable();
          await w.write('{bozuk');
          await w.close();
          (await import('/src/lib/packs.ts')).invalidatePacks();
        });
        await q.waitForSelector(T('ky-open-error'), { timeout: 15000 }).catch(() => {});
        check(!!(await q.$(T('ky-open-error'))), 'bozuk paket: "açılamadı" uyarısı görünür');
        await q.screenshot({ path: shots + '/ky-bozuk.png' });
        await q.click(T('ky-redownload'));
      }
      await q.waitForSelector(T('guide-pack-section'), { timeout: 60000 }).catch(() => {});
      const packCats = await q.$$eval(`${T('guide-category')}[data-pack-id]`, (els) => els.map((e) => e.dataset.categoryId));
      check(hits >= 1 && packCats.length > 10, `Kendine Yetmek${broken ? ' (silip yeniden indir)' : ''}: indi, ${packCats.length} kategori`);
      if (!broken && packCats.length) {
        await q.screenshot({ path: shots + '/ky-kurulu.png', fullPage: false });
        await q.click(`${T('guide-category')}[data-category-id="${packCats[0]}"]`);
        await q.waitForSelector(T('guide-card'));
        const gid = await q.$eval(T('guide-card'), (e) => e.dataset.guideId);
        await q.click(T('guide-card'));
        await q.waitForSelector(T('guide-detail'));
        check(((await q.textContent(T('guide-review'))) ?? '').includes('uzman'), 'paket rehberi: "henüz incelenmedi" uyarısı (uzman)');
        check((await q.$$('[data-testid="guide-step"] img[data-pack-art]')).length > 0, 'paket rehberi: çizimler görünür');
        await q.screenshot({ path: shots + '/ky-rehber.png', fullPage: true });
        await q.click(T('guide-back'));
        check(!!(await q.$(`${T('guide-card')}[data-guide-id="${gid}"]`)), 'paket rehberinden geri: paket kategorisine döner');
        // aramada paket rehberleri de çıkar
        await q.click(T('category-back'));
        await q.fill(T('guide-search'), 'kav');
        check((await q.$$(T('guide-card'))).length > 0, 'arama paket rehberlerini de bulur');
      }
      await ctx.close();
    }
  }
}

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
