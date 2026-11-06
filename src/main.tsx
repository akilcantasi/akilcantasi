// İLK içe aktarım olmalı: localStorage engelliyse diğer modüller yüklenirken çökmesin
import './depolama-koruma';
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
import { initPackGuides } from './content/pack-guides';
import { initGecmis } from './gecmis';
import { swKaydet } from './sw-kayit';

/**
 * Doğrudan bağlantıdaki kimlik kullanılabilir mi? Adres herkesin elinde: `__proto__`,
 * `constructor` gibi nesne anahtarları bölüm tablolarında "bulunur" ve ekranı çökertiyordu
 * (?comm=__proto__ → boş ekran). Bunlar ve aşırı uzun değerler yok sayılır.
 */
function gecerliKimlik(v: string | null): v is string {
  return !!v && v.length <= 200 && !v.startsWith('__') && !(v in Object.prototype);
}

/**
 * Kaydırma çubuğu yer kaplıyor mu (masaüstü tarayıcı)? Öyleyse html.kaydirma-cubugu: içerik ve
 * üst çubuk iki yanda eşit pay alır (app.css). Telefonlarda çubuk içeriğin üstünde kayar (0 px).
 */
function kaydirmaCubugunuDenetle() {
  try {
    const d = document.createElement('div');
    d.style.cssText = 'position:absolute;top:-999px;width:100px;height:50px;overflow-y:scroll';
    document.body.appendChild(d);
    const w = d.offsetWidth - d.clientWidth;
    d.remove();
    document.documentElement.classList.toggle('kaydirma-cubugu', w > 0);
  } catch {
    /* ölçülemedi: pay yok */
  }
}

const root = document.getElementById('app')!;
kaydirmaCubugunuDenetle();
// index.html'deki açılış ekranı (betik inene kadar logo): uygulama çizilmeden kaldırılır
document.getElementById('acilis')?.remove();
if (new URLSearchParams(location.search).has('art')) {
  import('./art/Gallery').then(({ ArtGallery }) => render(<ArtGallery />, root));
} else {
  // Doğrudan bağlantılar (test ve paylaşım için): ?tab=… ?guide=… ?cat=… ?tool=… ?comm=…
  const q = new URLSearchParams(location.search);
  const tab = q.get('tab');
  // Bilinmeyen sekme kimliği uygulamayı çökertmesin (boş ekran): yok say.
  if (tab && (TAB_IDS as readonly string[]).includes(tab)) go.tab(tab as TabId);
  const cat = q.get('cat');
  const guide = q.get('guide');
  const tool = q.get('tool');
  const comm = q.get('comm');
  if (gecerliKimlik(cat)) go.category(cat);
  if (gecerliKimlik(guide)) go.guide(guide);
  if (gecerliKimlik(tool)) go.tool(TOOLS.some((t) => t.id === tool) ? tool : null);
  else if (tool) go.tab('araclar'); // bilinmeyen araç: Araçlar listesi açılır
  if (gecerliKimlik(comm)) go.comm(comm);
  else if (comm) go.tab('iletisim');
  initGecmis();
  render(<App />, root);
  // Kurulu rehber paketlerini (.rehber.json) yükle; ?guide= paket rehberi ise yüklenince açılır
  initPackGuides();
  prefetchLazyChunks();
  // Tarayıcıda (bilgi noktası, masaüstü) uygulama kabuğu çevrimdışı açılabilsin; Android'de yok
  swKaydet();
}

/**
 * Tarayıcıdan (bilgi noktası) açılan uygulamada tembel yüklenen parçalar ancak ilk
 * kullanımda indirilir; telefondan http://192.168.x.x ile girilince service worker da
 * çalışmaz (güvenli bağlam değil). Ayrıca SW varsa (localhost/https) bu ön yükleme
 * parçaları SW önbelleğine de koyar. Bağlantı sonradan koparsa (Wi-Fi'dan
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
      // Rehber çizimleri en sonda (en büyük parça): bağlantı koparsa rehber resimleri de açılsın
      () => import('./art').then((m) => m.loadArt()),
    ];
    // Sırayla: ilk açılışta ağı ve CPU'yu tıkamasın.
    jobs.reduce<Promise<unknown>>((p, job) => p.then(() => job().catch(() => null)), Promise.resolve());
  };
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  setTimeout(() => (w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 4000 }) : run()), 1500);
}
