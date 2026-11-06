import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { swEklentisi } from './tools/sw/sw-eklentisi';

// Uygulama tamamen çevrimdışı çalışmalı: tüm varlıklar dist/ içine kopyalanır,
// hiçbir CDN kullanılmaz. Göreli base sayesinde dist/ hem yerel sunucudan
// hem de Capacitor (file/https://localhost) içinden açılabilir.
/**
 * İçerik güvenlik politikası (yalnız üretim derlemesine): arşiv, paket ya da pano verisi bir
 * şekilde sayfaya HTML/JS sızdırsa bile satır içi betik, javascript: bağlantısı, eklenti
 * nesnesi ve <base> çalışmaz. Android'de sayfa yerel eklentilere (SMS, indirme…) erişebildiği
 * için bu ikinci savunma hattıdır. Bağlantılar geniş tutulur: bilgi noktası adresi kullanıcıya
 * bağlı (http://192.168.x.x:8080), paket aynaları değişebilir.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval' blob:",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "media-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self' https: http: blob: data:",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-src 'none'",
  "form-action 'none'",
].join('; ');

const cspPlugin = {
  name: 'akil-csp',
  apply: 'build' as const,
  transformIndexHtml(html: string) {
    return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}">`);
  },
};

export default defineConfig({
  base: './',
  plugins: [preact(), cspPlugin, swEklentisi()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // .mjs varlıklar (pdf.js işçisi) .js adıyla yazılır: Android WebView'ın yerel
        // sunucusu .mjs için JavaScript MIME türü vermeyebilir, modül işçisi de reddedilir.
        assetFileNames: (a: { name?: string; names?: string[] }) =>
          /\.mjs$/.test(a.names?.[0] ?? a.name ?? '') ? 'assets/[name]-[hash].js' : 'assets/[name]-[hash][extname]',
      },
    },
  },
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@wllama/wllama'] },
  server: {
    headers: {
      // wllama'nın çok iş parçacıklı sürümü için gerekli
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
} as any);
