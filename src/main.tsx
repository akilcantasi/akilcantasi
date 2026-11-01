import { render } from 'preact';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-ext-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-ext-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-ext-600.css';
import '@fontsource/poppins/latin-700.css';
import '@fontsource/poppins/latin-ext-700.css';
import '@fontsource/poppins/latin-500-italic.css';
import '@fontsource/poppins/latin-ext-500-italic.css';
// Çizimlerdeki SVG yazıları IBM Plex Sans ile ölçülendi; yalnız kalın ağırlığı yüklenir.
import '@fontsource/ibm-plex-sans/latin-700.css';
import '@fontsource/ibm-plex-sans/latin-ext-700.css';
import '@fontsource/ibm-plex-mono/400.css';
import './styles/app.css';
import './lib/settings';
import { App } from './App';
import { go, TAB_IDS, type TabId } from './lib/store';
import { TOOLS } from './tools/registry';

const root = document.getElementById('app')!;
if (new URLSearchParams(location.search).has('art')) {
  import('./art/Gallery').then(({ ArtGallery }) => render(<ArtGallery />, root));
} else {
  // Doğrudan bağlantılar (test ve paylaşım için): ?tab=… ?guide=… ?cat=… ?tool=… ?comm=…
  const q = new URLSearchParams(location.search);
  const tab = q.get('tab');
  // Bilinmeyen sekme kimliği uygulamayı çökertmesin (boş ekran): yok say.
  if (tab && (TAB_IDS as readonly string[]).includes(tab)) go.tab(tab as TabId);
  if (q.get('cat')) go.category(q.get('cat'));
  if (q.get('guide')) go.guide(q.get('guide'));
  if (q.get('tool')) go.tool(q.get('tool'));
  if (q.get('comm')) go.comm(q.get('comm'));
  render(<App />, root);
  prefetchLazyChunks();
}

/**
 * Tarayıcıdan (bilgi noktası) açılan uygulamada service worker yok: tembel yüklenen
 * parçalar ancak ilk kullanımda indirilir. Bağlantı sonradan koparsa (Wi-Fi'dan
 * çıkıldı) açılmamış araçlar "Yüklenemedi" der. Bu yüzden sayfa açıldıktan sonra,
 * boşta kalınca bütün araçlar ve harita/arama modülleri önceden yüklenir; modül
 * önbelleğinde kalırlar ve bağlantı kopsa da çalışırlar. Büyük model kütüphaneleri
 * (wllama, transformers) hariç: model zaten paket dosyası ister.
 */
function prefetchLazyChunks() {
  const run = () => {
    if (!navigator.onLine) return;
    const jobs: (() => Promise<unknown>)[] = [
      ...TOOLS.map((t) => t.load),
      () => import('./lib/map/maplibre'),
      () => import('./lib/map/pmtilesSource'),
      () => import('./lib/guides-search'),
      () => import('./lib/library'),
      () => import('fzstd'),
      () => import('xz-decompress'),
      () => import('hash-wasm'),
    ];
    // Sırayla: ilk açılışta ağı ve CPU'yu tıkamasın.
    jobs.reduce<Promise<unknown>>((p, job) => p.then(() => job().catch(() => null)), Promise.resolve());
  };
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 4000 }) : run()), 1500);
}
