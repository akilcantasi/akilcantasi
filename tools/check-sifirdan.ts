// Sıfırdan paketlerinin yapı denetimi:  npx -y tsx tools/check-sifirdan.ts [paket-klasörü ...]
import fs from 'node:fs';
import path from 'node:path';
const root = 'packs-src/sifirdan';
const want = process.argv.slice(2).map((a) => path.basename(a.replace(/\/+$/, '')));
const dirs = fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'guides.ts')) && (!want.length || want.includes(d)));
const appIds = new Set<string>();
for (const f of fs.readdirSync('src/content/guides')) {
  for (const m of fs.readFileSync(path.join('src/content/guides', f), 'utf8').matchAll(/\n    "id": "([^"]+)"/g)) appIds.add(m[1]);
}
if (want.length && dirs.length !== want.length) { console.log('HATA: paket klasörü bulunamadı: ' + want.filter((w) => !dirs.includes(w)).join(', ')); process.exit(1); }
const allIds = new Map<string, string>();
const allCats = new Map<string, string>();
let errs = 0;
const err = (d: string, m: string) => { errs++; console.log(`HATA ${d}: ${m}`); };
for (const d of dirs) {
  const mod = await import(path.resolve(root, d, 'guides.ts'));
  let spec: Record<string, string> = {};
  if (fs.existsSync(path.join(root, d, 'spec.ts'))) spec = (await import(path.resolve(root, d, 'spec.ts'))).SPEC ?? {};
  const { PACK, CATEGORIES, GUIDES } = mod;
  if (!PACK?.id?.startsWith('sifirdan-')) err(d, 'PACK.id sifirdan- ile başlamalı');
  const cats = new Set<string>();
  for (const c of CATEGORIES ?? []) {
    if (!c.id.startsWith('sf-')) err(d, `kategori ${c.id} sf- ile başlamalı`);
    if (allCats.has(c.id)) err(d, `kategori ${c.id} başka pakette de var (${allCats.get(c.id)})`);
    allCats.set(c.id, d); cats.add(c.id);
  }
  for (const g of GUIDES ?? []) {
    const w = (m: string) => err(d, `${g.id}: ${m}`);
    if (!g.id.startsWith('sf-')) w('id sf- ile başlamalı');
    if (appIds.has(g.id) || allIds.has(g.id)) w('id çakışıyor');
    allIds.set(g.id, d);
    if (!cats.has(g.category)) w(`kategori yok: ${g.category}`);
    if (!g.title || !g.summary || !g.tag) w('title/summary/tag eksik');
    if (!(g.steps?.length >= 4 && g.steps.length <= 10)) w(`adım sayısı ${g.steps?.length}`);
    if (!g.sources?.length) w('kaynak yok');
    if (!(g.keywords?.length >= 6)) w('anahtar kelime az');
    if (g.reviewed !== false) w('reviewed false olmalı');
    if (!g.checked?.date) w('checked yok');
    if (g.art) {
      if (g.art.length !== g.steps.length) w('art uzunluğu steps ile aynı değil');
      for (const a of g.art) if (a && !spec[a]) w(`art spec'te yok: ${a}`);
    }
  }
  console.log(`${d}: ${GUIDES?.length ?? 0} rehber, ${CATEGORIES?.length ?? 0} kategori`);
}
console.log(errs ? `${errs} hata` : 'hata yok');
process.exit(errs ? 1 : 0);
