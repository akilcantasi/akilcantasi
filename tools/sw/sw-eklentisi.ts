// Service worker üreten Vite eklentisi (yalnız üretim derlemesi; npm bağımlılığı yok).
//
// Amaç: bilgi noktasından (Windows / Raspberry Pi, tarayıcı) bir kez açılan uygulama, bağlantı
// kopsa da yeniden açılabilsin. Derleme sonunda dist/sw.js yazılır:
//   • Uygulama kabuğu önceden önbelleğe alınır: index.html, giriş betiği ve onun doğrudan
//     içe aktardığı parçalar, CSS, yazı tipleri (woff2), simgeler, manifest.
//   • Diğer /assets/ parçaları (araçlar, harita…) ilk kullanıldıklarında önbelleğe girer
//     (main.tsx açılıştan sonra hepsini önceden yükler, böylece hepsi çevrimdışı açılır).
//   • Paketler, /data/, /api/, /download/, Range istekleri ve büyük dosyalar ASLA önbelleğe
//     alınmaz (GB'larca ZIM/model tarayıcı kotasını doldurmasın).
//   • Sayfa gezinmeleri önce ağdan istenir (sunucunun COOP/COEP başlıkları olduğu gibi gelir;
//     Fener'in crossOriginIsolated'ı bozulmaz); ağ yoksa önbellekteki index.html verilir.
//     Önbellekteki yanıt da aynı başlıklarla saklanmıştır.
//   • Sürümlü önbellek: her derlemenin adı içerikten türetilir; yeni sürüm etkinleşince eski
//     önbellekler silinir. Yeni sürüm hemen devralmaz (bekler); uygulama "Yeni sürüm hazır —
//     yenile" notu gösterir, ya da sekme kapanıp açılınca kendiliğinden geçilir.
// Android uygulamasında (Capacitor) service worker kaydedilmez (src/sw-kayit.ts).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/** Bundan büyük dosya hiç önbelleğe alınmaz (wllama/ort wasm, pdf.js işçisi önceden alınmaz) */
export const EN_BUYUK_BAYT = 3 * 1024 * 1024;
/** Önceden önbelleğe alınacak dosyaların toplam sınırı */
export const ONCEDEN_SINIR_BAYT = 6 * 1024 * 1024;
export const SW_DOSYA = 'sw.js';

/**
 * Bu yol (kapsama göre göreli, başında "/" ile) önbelleğe ALINMAZ mı?
 * Service worker'ın içine de aynen gömülür (toString), bu yüzden kendi kendine yeter olmalı.
 */
export function onbellegeAlinmaz(yol: string): boolean {
  const y = yol.toLowerCase();
  if (/^\/(data|api|download|_paket|_capacitor_file_)(\/|$)/.test(y)) return true;
  if (y === '/packs-manifest.json' || y === '/sw.js') return true;
  return /\.(zim|gguf|pmtiles|tar|apk|wasm|geojson|zst|xz)$/.test(y);
}

/** Kapsam altında önbelleğe alınabilecek statik varlık mı (gezinme dışı istekler için) */
export function statikVarlik(yol: string): boolean {
  if (onbellegeAlinmaz(yol)) return false;
  return /^\/(assets|fonts)\//.test(yol) || /^\/[^/]+\.(svg|png|webmanifest|ico)$/.test(yol);
}

interface ParcaBilgisi {
  type: 'chunk' | 'asset';
  fileName: string;
  isEntry?: boolean;
  imports?: string[];
  viteMetadata?: { importedCss?: Set<string>; importedAssets?: Set<string> };
}

/**
 * Önceden önbelleğe alınacak dosyalar (dist'e göre göreli). boyut: dosya adı → bayt.
 * Giriş parçası ve onun statik içe aktarımları (özyinelemeli), onların CSS'i, woff2 yazı
 * tipleri ve kök simgeler. Büyük dosyalar ve toplam sınırı aşanlar atlanır.
 */
export function oncedenListesi(bundle: Record<string, ParcaBilgisi>, kokDosyalar: string[], boyut: (f: string) => number): string[] {
  const secilen = new Set<string>(['index.html']);
  const ziyaret = new Set<string>();
  const gez = (ad: string) => {
    if (ziyaret.has(ad)) return;
    ziyaret.add(ad);
    const c = bundle[ad];
    if (!c || c.type !== 'chunk') return;
    secilen.add(c.fileName);
    for (const css of c.viteMetadata?.importedCss ?? []) secilen.add(css);
    // Yazı tipleri aşağıda ayrıca seçilir (CSS hepsini anar: woff, kiril, vietnam…)
    for (const a of c.viteMetadata?.importedAssets ?? []) if (!/\.(woff2?|ttf|otf)$/.test(a)) secilen.add(a);
    for (const i of c.imports ?? []) gez(i);
  };
  for (const [ad, c] of Object.entries(bundle)) if (c.type === 'chunk' && c.isEntry) gez(ad);
  // Yazı tipleri: yalnız woff2 (tüm güncel tarayıcılar); latin ve latin-ext Türkçe için yeter
  for (const c of Object.values(bundle)) {
    if (c.type === 'asset' && /\.woff2$/.test(c.fileName) && /latin/.test(c.fileName)) secilen.add(c.fileName);
  }
  for (const f of kokDosyalar) if (/^(icon[^/]*\.(svg|png)|manifest\.webmanifest)$/.test(f)) secilen.add(f);
  const out: string[] = [];
  let toplam = 0;
  // index.html önce, sonra küçükten büyüğe: sınıra takılırsa en büyükler dışarıda kalır
  const sirali = [...secilen].sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : boyut(a) - boyut(b) || a.localeCompare(b)));
  for (const f of sirali) {
    if (onbellegeAlinmaz('/' + f)) continue;
    const b = boyut(f);
    if (b < 0 || b > EN_BUYUK_BAYT) continue;
    if (f !== 'index.html' && toplam + b > ONCEDEN_SINIR_BAYT) continue;
    toplam += b;
    out.push(f);
  }
  return out.sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
}

/** Sürüm: önbelleğe alınan dosyaların adları ve içerik özetinden (index.html dâhil) */
export function surumHesapla(liste: string[], icerik: (f: string) => Buffer | string): string {
  const h = createHash('sha256');
  for (const f of liste) {
    h.update(f + '\0');
    // Adında özet olan (assets/x-HASH.js) dosyalar için ad yeter; diğerlerinin içeriği katılır
    if (!/^assets\//.test(f)) h.update(icerik(f));
  }
  return h.digest('hex').slice(0, 12);
}

/** Service worker kaynağı (düz JS, modül değil: her tarayıcıda klasik betik olarak çalışır) */
export function swKaynagi(surum: string, liste: string[]): string {
  // Yardımcılar SW'ye kaynak metinleriyle gömülür; derleyici adlarını değiştirdiyse dur
  for (const [f, ad] of [[onbellegeAlinmaz, 'onbellegeAlinmaz'], [statikVarlik, 'statikVarlik']] as const) {
    if (!f.toString().startsWith(`function ${ad}(`)) throw new Error(`sw: ${ad} kaynağı beklenmedik biçimde: ${f.toString().slice(0, 40)}`);
  }
  return `// OTOMATİK ÜRETİLDİ (tools/sw/sw-eklentisi.ts) — elle düzenlemeyin.
// Akıl Çantası service worker'ı: uygulama kabuğunu çevrimdışı açılabilsin diye saklar.
// Paketler, /data/, /api/ ve Range istekleri hiç önbelleğe alınmaz.
'use strict';
const SURUM = ${JSON.stringify(surum)};
const ONEK = 'akil-kabuk-';
const ONBELLEK = ONEK + SURUM;
const ONCEDEN = ${JSON.stringify(liste)};
const EN_BUYUK_BAYT = ${EN_BUYUK_BAYT};
const GEZINME_BEKLEME_MS = 4000;
const KAPSAM = new URL(self.registration.scope);
const KABUK = new URL('index.html', KAPSAM).href;
${onbellegeAlinmaz.toString()}
${statikVarlik.toString()}

/** Kapsama göre yol ("/assets/x.js"); kapsam dışıysa null */
function goreliYol(url) {
  if (url.origin !== KAPSAM.origin || !url.pathname.startsWith(KAPSAM.pathname)) return null;
  return '/' + url.pathname.slice(KAPSAM.pathname.length);
}

self.addEventListener('install', (e) => {
  // Yeni sürüm kendiliğinden devralmaz: açık sayfa eski parçalarla karışmasın.
  // Sayfa "Yenile"ye basınca (SKIP_WAITING) ya da tüm sekmeler kapanınca geçilir.
  e.waitUntil(
    caches.open(ONBELLEK).then((c) =>
      c.addAll(ONCEDEN.map((f) => new Request(new URL(f, KAPSAM).href, { cache: 'reload' }))),
    ),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith(ONEK) && k !== ONBELLEK).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.tip === 'SKIP_WAITING') self.skipWaiting();
});

function zamanAsimi(ms) {
  return new Promise((_, red) => setTimeout(() => red(new Error('zaman aşımı')), ms));
}

async function gezinme(req) {
  try {
    // Ağ önce: sunucunun yanıtı (COOP/COEP başlıklarıyla) olduğu gibi döner
    return await Promise.race([fetch(req), zamanAsimi(GEZINME_BEKLEME_MS)]);
  } catch (err) {
    const c = await caches.open(ONBELLEK);
    const r = await c.match(KABUK);
    if (r) return r;
    throw err;
  }
}

async function varlik(req, yol) {
  const c = await caches.open(ONBELLEK);
  const hazir = await c.match(req, { ignoreSearch: true });
  if (hazir) return hazir;
  const r = await fetch(req);
  const boy = Number(r.headers.get('Content-Length') || '-1');
  // Yalnız tam (200), aynı kökenden ve boyu bilinen küçük yanıtlar saklanır
  if (r.status === 200 && r.type === 'basic' && boy >= 0 && boy <= EN_BUYUK_BAYT && statikVarlik(yol)) {
    c.put(req, r.clone()).catch(() => {});
  }
  return r;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  const yol = goreliYol(url);
  if (yol === null || onbellegeAlinmaz(yol)) return;
  if (req.mode === 'navigate') {
    e.respondWith(gezinme(req));
    return;
  }
  if (statikVarlik(yol)) e.respondWith(varlik(req, yol));
});
`;
}

function kokDosyalari(dir: string): string[] {
  try {
    return readdirSync(dir).filter((f) => {
      try {
        return statSync(path.join(dir, f)).isFile();
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

/** Vite eklentisi: derleme yazıldıktan sonra dist/sw.js üretir */
export function swEklentisi() {
  let outDir = 'dist';
  return {
    name: 'akil-sw',
    apply: 'build' as const,
    configResolved(c: { build: { outDir: string }; root: string }) {
      outDir = path.resolve(c.root, c.build.outDir);
    },
    writeBundle(opts: { dir?: string }, bundle: Record<string, ParcaBilgisi>) {
      const dir = opts.dir ?? outDir;
      const boyut = (f: string) => {
        try {
          return statSync(path.join(dir, f)).size;
        } catch {
          return -1;
        }
      };
      const liste = oncedenListesi(bundle, kokDosyalari(dir), boyut);
      const surum = surumHesapla(liste, (f) => readFileSync(path.join(dir, f)));
      writeFileSync(path.join(dir, SW_DOSYA), swKaynagi(surum, liste));
    },
  };
}
