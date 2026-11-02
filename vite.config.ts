import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// Uygulama tamamen çevrimdışı çalışmalı: tüm varlıklar dist/ içine kopyalanır,
// hiçbir CDN kullanılmaz. Göreli base sayesinde dist/ hem yerel sunucudan
// hem de Capacitor (file/https://localhost) içinden açılabilir.
export default defineConfig({
  base: './',
  plugins: [preact()],
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
