// Rehber paketlerini derler:  npx -y tsx tools/build-rehber-packs.ts [--include-test] [--base-url=URL] [paket-klasörü ...]
//
// packs-src/sifirdan/<klasör>/ altındaki her paketi (guides.ts + isteğe bağlı scenes.tsx) okur,
// sahneleri preact-render-to-string ile sabit SVG metnine çevirir ve
//   data/rehber/<paket-id>.rehber.json
//   data/rehber/manifest-girdileri.json   (public/packs-manifest.json'a eklenecek girdiler)
// dosyalarını yazar. "_" ile başlayan klasörler (ör. _deneme) yalnız --include-test ile derlenir.
// Biçim ve akış: docs/REHBER_PAKETLERI.md
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { render } from 'preact-render-to-string';
import { h } from 'preact';
import { REHBER_FORMAT, REHBER_FORMAT_VERSION, validateRehberPack, type RehberPack } from '../src/content/rehber-pack';
import { validateManifest } from '../src/lib/manifest';

const ROOT = 'packs-src/sifirdan';
const OUT = 'data/rehber';
const args = process.argv.slice(2);
const includeTest = args.includes('--include-test');
const baseUrl = (args.find((a) => a.startsWith('--base-url='))?.slice(11) ?? 'https://huggingface.co/datasets/akilcantasi/paketler/resolve/main/rehber/').replace(/\/?$/, '/');
const want = args.filter((a) => !a.startsWith('--'));

const dirs = fs
  .readdirSync(ROOT)
  .filter((d) => fs.existsSync(path.join(ROOT, d, 'guides.ts')))
  .filter((d) => (want.length ? want.includes(d) : includeTest || !d.startsWith('_')))
  .sort();

if (!dirs.length) {
  console.log('Derlenecek paket yok (packs-src/sifirdan/<klasör>/guides.ts).');
  process.exit(0);
}

const imp = (f: string) => import(pathToFileURL(path.resolve(f)).href);

/**
 * scenes.tsx'i (ve kit2'yi) esbuild ile tek modüle derleyip yükler. tsx, tsconfig'in
 * "include" dışındaki packs-src/ dosyalarında Preact JSX ayarını uygulamaz; ayrıca
 * preact dışarıda bırakılır ki render-to-string ile aynı kopya kullanılsın.
 */
async function importScenes(file: string): Promise<any> {
  const tmp = path.resolve('node_modules/.cache/rehber-build');
  fs.mkdirSync(tmp, { recursive: true });
  const out = path.join(tmp, path.basename(path.dirname(file)) + '-scenes.mjs');
  await build({
    entryPoints: [file],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    jsx: 'automatic',
    jsxImportSource: 'preact',
    external: ['preact', 'preact/*'],
    logLevel: 'error',
  });
  return import(pathToFileURL(out).href + '?t=' + Date.now());
}

/** Sahne bileşenini tek başına durabilen SVG metnine çevirir. */
function sceneToSvg(id: string, fn: () => unknown): string {
  let svg = render(h(fn as any, null)).trim();
  if (!svg.startsWith('<svg')) throw new Error(`${id}: sahne <svg> üretmiyor (Scene2 ile sarılmalı)`);
  // <img> içinde gösterilecek: ad alanı şart; sayfa sınıfları ve erişilebilirlik öznitelikleri gereksiz
  if (!/^<svg[^>]*\sxmlns=/.test(svg)) svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  svg = svg.replace(/^(<svg[^>]*?)\sclass="art"/, '$1');
  return svg;
}

let warnings = 0;
let failed = 0;
const warn = (d: string, m: string) => {
  warnings++;
  console.log(`  UYARI ${d}: ${m}`);
};

fs.mkdirSync(OUT, { recursive: true });
const entries: any[] = [];

for (const d of dirs) {
  const dir = path.join(ROOT, d);
  const mod = await imp(path.join(dir, 'guides.ts'));
  const { PACK, CATEGORIES, GUIDES } = mod;
  if (!PACK?.id || !Array.isArray(GUIDES)) {
    console.log(`HATA ${d}: guides.ts PACK ve GUIDES dışa aktarmalı`);
    failed++;
    continue;
  }

  // Sahneler → SVG
  const svgs: Record<string, string> = {};
  const scenesFile = path.join(dir, 'scenes.tsx');
  if (fs.existsSync(scenesFile)) {
    const SCENES: Record<string, () => unknown> = (await importScenes(scenesFile)).SCENES ?? {};
    for (const [id, fn] of Object.entries(SCENES)) {
      try {
        svgs[id] = sceneToSvg(id, fn);
      } catch (e) {
        warn(d, `sahne çizilemedi: ${id} (${(e as Error).message})`);
      }
    }
  }

  // Rehberlerde geçen ama sahnesi olmayan çizimler null olur
  const used = new Set<string>();
  const missing = new Set<string>();
  const guides = GUIDES.map((g: any) => {
    if (!Array.isArray(g.art)) return g;
    const art = g.art.map((a: string | null) => {
      if (!a) return null;
      if (svgs[a]) {
        used.add(a);
        return a;
      }
      missing.add(a);
      return null;
    });
    return { ...g, art };
  });
  for (const c of CATEGORIES ?? []) {
    if (c.art && svgs[c.art]) used.add(c.art);
    else if (c.art && Object.keys(svgs).length) warn(d, `kategori kapağı çizilmemiş: ${c.art} (ilk rehber çizimi kullanılır)`);
  }
  if (missing.size) warn(d, `${missing.size} çizimin sahnesi yok, null yapıldı: ${[...missing].slice(0, 8).join(', ')}${missing.size > 8 ? ' …' : ''}`);
  const unused = Object.keys(svgs).filter((k) => !used.has(k));
  if (unused.length) warn(d, `${unused.length} sahne hiçbir rehberde kullanılmıyor (pakete girmedi): ${unused.slice(0, 8).join(', ')}`);

  const art: Record<string, string> = {};
  for (const k of [...used].sort()) art[k] = svgs[k];

  const out: RehberPack = {
    format: REHBER_FORMAT,
    version: REHBER_FORMAT_VERSION,
    pack: { id: PACK.id, name: PACK.name, desc: PACK.desc ?? '', version: PACK.version ?? 1 },
    categories: CATEGORIES ?? [],
    guides,
    art,
  };
  const v = validateRehberPack(JSON.parse(JSON.stringify(out)));
  if (!v.ok) {
    console.log(`HATA ${d}: paket doğrulanamadı:\n    ${v.errors.slice(0, 20).join('\n    ')}`);
    failed++;
    continue;
  }

  const file = `${PACK.id}.rehber.json`;
  const buf = Buffer.from(JSON.stringify(out));
  fs.writeFileSync(path.join(OUT, file), buf);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  console.log(`${d} → ${path.join(OUT, file)}`);
  console.log(`  ${guides.length} rehber, ${out.categories.length} kategori, ${Object.keys(art).length} çizim · ${(buf.length / 1024).toFixed(1)} KB · sha256 ${sha256}`);

  entries.push({
    id: PACK.id,
    kind: 'rehber',
    name: PACK.name,
    desc: PACK.desc ?? '',
    file,
    size: buf.length,
    sizeApprox: false,
    sha256,
    tier: 'temel',
    urls: [baseUrl + file],
    license: PACK.license ?? 'GPL-3.0-or-later (Akıl Çantası)',
    source: `Akıl Çantası — ${ROOT}/${d}`,
  });
}

const mv = validateManifest({ version: 1, updated: new Date().toISOString().slice(0, 10), packs: entries });
if (!mv.ok) {
  console.log('HATA manifest girdileri:\n  ' + mv.errors.join('\n  '));
  failed++;
}
fs.writeFileSync(path.join(OUT, 'manifest-girdileri.json'), JSON.stringify(entries, null, 2) + '\n');
console.log(`\n${entries.length} paket · ${warnings} uyarı · ${failed} hata → ${path.join(OUT, 'manifest-girdileri.json')}`);
process.exit(failed ? 1 : 0);
