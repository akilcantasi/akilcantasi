import { describe, expect, it } from 'vitest';
import vm from 'node:vm';
import { EN_BUYUK_BAYT, onbellegeAlinmaz, oncedenListesi, statikVarlik, surumHesapla, swKaynagi } from '../tools/sw/sw-eklentisi';

describe('service worker önbellek kuralları', () => {
  it('paketler, veri, API ve büyük ikili dosyalar önbelleğe alınmaz', () => {
    for (const y of [
      '/data/wikipedia_tr.zim',
      '/data/',
      '/api/packs',
      '/api/status',
      '/download/akil-cantasi.apk',
      '/packs-manifest.json',
      '/sw.js',
      '/assets/wllama-abc.wasm',
      '/x/model.GGUF',
      '/harita.pmtiles',
      '/_capacitor_file_/a',
    ]) {
      expect(onbellegeAlinmaz(y), y).toBe(true);
    }
    for (const y of ['/', '/index.html', '/assets/index-abc.js', '/fonts/NotoSans-Regular/0-255.pbf', '/icon.svg']) {
      expect(onbellegeAlinmaz(y), y).toBe(false);
    }
  });

  it('yalnız statik varlıklar çalışma anında saklanır', () => {
    expect(statikVarlik('/assets/index-abc.js')).toBe(true);
    expect(statikVarlik('/assets/index-abc.css')).toBe(true);
    expect(statikVarlik('/fonts/NotoSans-Regular/0-255.pbf')).toBe(true);
    expect(statikVarlik('/icon-192.png')).toBe(true);
    expect(statikVarlik('/manifest.webmanifest')).toBe(true);
    expect(statikVarlik('/assets/ort-x.wasm')).toBe(false);
    expect(statikVarlik('/data/a.png')).toBe(false);
    expect(statikVarlik('/index.html')).toBe(false); // gezinme ayrı yoldan
    expect(statikVarlik('/baska/sayfa.js')).toBe(false);
  });

  it('önceden önbellek: giriş ve statik içe aktarımları, CSS, woff2 (latin), simgeler; büyükler hariç', () => {
    const bundle: any = {
      'assets/index-a.js': { type: 'chunk', fileName: 'assets/index-a.js', isEntry: true, imports: ['assets/ortak-b.js'], viteMetadata: { importedCss: new Set(['assets/index-a.css']), importedAssets: new Set() } },
      'assets/ortak-b.js': { type: 'chunk', fileName: 'assets/ortak-b.js', imports: ['assets/index-a.js'] },
      'assets/tembel-c.js': { type: 'chunk', fileName: 'assets/tembel-c.js' },
      'assets/dev-d.js': { type: 'chunk', fileName: 'assets/dev-d.js', isEntry: true },
      'assets/index-a.css': { type: 'asset', fileName: 'assets/index-a.css' },
      'assets/poppins-latin-400.woff2': { type: 'asset', fileName: 'assets/poppins-latin-400.woff2' },
      'assets/poppins-latin-400.woff': { type: 'asset', fileName: 'assets/poppins-latin-400.woff' },
      'assets/mono-cyrillic-400.woff2': { type: 'asset', fileName: 'assets/mono-cyrillic-400.woff2' },
      'assets/wllama.wasm': { type: 'asset', fileName: 'assets/wllama.wasm' },
      'index.html': { type: 'asset', fileName: 'index.html' },
    };
    const boy: Record<string, number> = { 'assets/dev-d.js': EN_BUYUK_BAYT + 1 };
    const liste = oncedenListesi(bundle, ['index.html', 'icon.svg', 'icon-192.png', 'manifest.webmanifest', 'packs-manifest.json', 'sw.js'], (f) => boy[f] ?? 1000);
    expect(liste[0]).toBe('index.html');
    expect(liste).toContain('assets/index-a.js');
    expect(liste).toContain('assets/ortak-b.js');
    expect(liste).toContain('assets/index-a.css');
    expect(liste).toContain('assets/poppins-latin-400.woff2');
    expect(liste).toContain('icon.svg');
    expect(liste).toContain('manifest.webmanifest');
    for (const yok of ['assets/tembel-c.js', 'assets/dev-d.js', 'assets/poppins-latin-400.woff', 'assets/mono-cyrillic-400.woff2', 'assets/wllama.wasm', 'packs-manifest.json', 'sw.js']) {
      expect(liste, yok).not.toContain(yok);
    }
  });

  it('sürüm içerik değişince değişir, aynıysa aynı kalır', () => {
    const l = ['index.html', 'assets/a-1.js'];
    const a = surumHesapla(l, (f) => (f === 'index.html' ? '<html>1' : 'x'));
    expect(surumHesapla(l, (f) => (f === 'index.html' ? '<html>1' : 'y'))).toBe(a); // özetli ad yeter
    expect(surumHesapla(l, (f) => (f === 'index.html' ? '<html>2' : 'x'))).not.toBe(a);
    expect(surumHesapla(['index.html', 'assets/a-2.js'], (f) => (f === 'index.html' ? '<html>1' : 'x'))).not.toBe(a);
  });

  it('üretilen SW betiği çalışır ve doğru isteklere yanıt verir', async () => {
    const src = swKaynagi('abc123', ['index.html', 'assets/index-a.js']);
    const dinleyici: Record<string, (e: any) => void> = {};
    const ctx: any = {
      self: { registration: { scope: 'http://localhost:8080/' }, addEventListener: (t: string, f: any) => (dinleyici[t] = f), skipWaiting: () => (ctx.atlandi = true), clients: { claim: async () => {} } },
      URL,
      Request: class { constructor(public url: string, public o: any) {} },
      caches: { open: async () => ({ match: async () => undefined, addAll: async (r: any[]) => (ctx.eklenen = r.map((x) => x.url)), put: async () => {} }), keys: async () => [] },
      fetch: async () => new Response('ag', { status: 200 }),
      setTimeout,
      Promise,
    };
    vm.runInNewContext(src, ctx);
    expect(Object.keys(dinleyici).sort()).toEqual(['activate', 'fetch', 'install', 'message']);
    // Kurulum: önceden önbellek mutlak adreslerle
    let bekle: Promise<unknown> | null = null;
    dinleyici.install({ waitUntil: (p: Promise<unknown>) => (bekle = p) });
    await bekle;
    expect(ctx.eklenen).toEqual(['http://localhost:8080/index.html', 'http://localhost:8080/assets/index-a.js']);
    // SKIP_WAITING yalnız mesajla
    expect(ctx.atlandi).toBeUndefined();
    dinleyici.message({ data: { tip: 'SKIP_WAITING' } });
    expect(ctx.atlandi).toBe(true);
    // Hangi isteklere karışılır
    const karisir = (url: string, o: { method?: string; mode?: string; range?: boolean } = {}) => {
      let r = false;
      dinleyici.fetch({ request: { url, method: o.method ?? 'GET', mode: o.mode ?? 'no-cors', headers: { has: (h: string) => h === 'range' && !!o.range } }, respondWith: () => (r = true) });
      return r;
    };
    expect(karisir('http://localhost:8080/assets/index-a.js')).toBe(true);
    expect(karisir('http://localhost:8080/?tab=fener', { mode: 'navigate' })).toBe(true);
    expect(karisir('http://localhost:8080/data/vikipedi.zim')).toBe(false);
    expect(karisir('http://localhost:8080/data/vikipedi.zim', { mode: 'navigate' })).toBe(false);
    expect(karisir('http://localhost:8080/api/packs')).toBe(false);
    expect(karisir('http://localhost:8080/assets/index-a.js', { range: true })).toBe(false);
    expect(karisir('http://localhost:8080/assets/index-a.js', { method: 'POST' })).toBe(false);
    expect(karisir('http://192.168.1.5:8080/assets/x.js')).toBe(false);
    expect(karisir('http://localhost:8080/assets/wllama.wasm')).toBe(false);
  });
});
