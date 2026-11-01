import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { useAppState, go, type TabId } from './lib/store';
import { IconBook, IconChat, IconMap, IconShield, IconSignal, IconTools } from './icons';
import { FenerTab } from './tabs/FenerTab';
import { HaritaTab } from './tabs/HaritaTab';
import { KutuphaneTab } from './tabs/KutuphaneTab';
import { RehberTab } from './tabs/RehberTab';
import { IletisimTab } from './tabs/IletisimTab';
import { AraclarTab } from './tabs/AraclarTab';
import { StorageWarning } from './StorageWarning';
import { KurulumHost } from './Kurulum';

const TABS: { id: TabId; label: string; sub: string; Icon: typeof IconChat }[] = [
  { id: 'fener', label: 'Fener', sub: 'asistan · çevrimdışı', Icon: IconChat },
  { id: 'rehber', label: 'Rehber', sub: 'rehber · yapay zekâsız', Icon: IconShield },
  { id: 'harita', label: 'Harita', sub: 'harita · OpenStreetMap', Icon: IconMap },
  { id: 'iletisim', label: 'İletişim', sub: 'iletişim · şebekesiz', Icon: IconSignal },
  { id: 'kutuphane', label: 'Kütüphane', sub: 'kütüphane · çevrimdışı', Icon: IconBook },
  { id: 'araclar', label: 'Araçlar', sub: 'araçlar · paketler', Icon: IconTools },
];

export function App() {
  const s = useAppState();
  const cur = TABS.find((t) => t.id === s.tab) ?? TABS[0];
  const mainRef = useRef<HTMLElement>(null);
  // Ekranda kendi <h1>'i olmayan sekmelerde (ana ekranlar) ekran okuyucu için
  // görünmez bir sekme başlığı gösterilir; alt ekranların kendi h1'i varsa gizlenir.
  const [hasOwnH1, setHasOwnH1] = useState(false);
  const navKey = [s.tab, s.openTool, s.openComm, s.openGuideId, s.openCategoryId, s.openArticlePath].join('|');
  const prevKey = useRef(navKey);
  const prevTab = useRef(s.tab);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const check = () => setHasOwnH1(!!el.querySelector('h1:not(.app-tab-title)'));
    check();
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  // Sekme değişince içerik en üstten başlasın (önceki sekmenin kaydırma konumu kalmasın).
  useLayoutEffect(() => {
    if (prevTab.current !== s.tab) {
      prevTab.current = s.tab;
      mainRef.current?.scrollTo({ top: 0 });
    }
  }, [s.tab]);

  // Klavye/ekran okuyucu: alt ekran açılınca tıklanan düğme DOM'dan kalkar ve odak
  // <body>'ye düşer. Odak kaybolduysa yeni ekranın başlığına taşınır (gezinme
  // çubuğundan sekme değiştirildiyse odak düğmede kalır, dokunulmaz).
  useEffect(() => {
    if (prevKey.current === navKey) return;
    prevKey.current = navKey;
    let tries = 0;
    let timer = 0;
    const lost = () => {
      const a = document.activeElement;
      return !a || a === document.body || !a.isConnected;
    };
    const move = () => {
      if (!lost()) return;
      const main = mainRef.current;
      const h = main?.querySelector<HTMLElement>('h1:not(.app-tab-title)') ?? main?.querySelector<HTMLElement>('h1, h2');
      if (h) {
        if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      } else if (tries++ < 10) {
        timer = window.setTimeout(move, 100); // tembel yüklenen araçlar
      }
    };
    timer = window.setTimeout(move, 0);
    return () => clearTimeout(timer);
  }, [navKey]);

  useEffect(() => {
    document.body.classList.toggle('saver', s.batterySaver);
  }, [s.batterySaver]);

  return (
    <div class="app">
      <header class="app-header">
        <div class="brand">
          <span class="brand-name">
            <span aria-hidden="true">
              AKIL<em>çantası</em>
            </span>
            <span class="sr-only">Akıl Çantası</span>
          </span>
          <span class="brand-sub" data-testid="tab-sub">{cur.sub}</span>
        </div>
        <div
          class="pill"
          role="status"
          data-testid="net-status"
          title={s.online ? 'İnternet bağlantısı var' : 'İnternet yok — her şey cihazda çalışıyor'}
        >
          <span class={'dot' + (s.online ? ' on' : '')} aria-hidden="true" />
          <span>{s.online ? 'Çevrimiçi' : 'Çevrimdışı'}</span>
        </div>
      </header>

      <StorageWarning />
      <KurulumHost />
      <main class="app-main" id="main" ref={mainRef}>
        {!hasOwnH1 && (
          <h1 class="sr-only app-tab-title" data-testid="tab-title">
            {cur.label}
          </h1>
        )}
        {s.tab === 'fener' && <FenerTab />}
        {s.tab === 'harita' && <HaritaTab />}
        {s.tab === 'kutuphane' && <KutuphaneTab />}
        {s.tab === 'rehber' && <RehberTab />}
        {s.tab === 'iletisim' && <IletisimTab />}
        {s.tab === 'araclar' && <AraclarTab />}
      </main>

      <nav class="app-nav" aria-label="Ana menü">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            class="nav-btn"
            data-testid={'nav-' + id}
            aria-current={s.tab === id ? 'page' : undefined}
            onClick={() => go.home(id)}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
