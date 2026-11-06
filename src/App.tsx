import { Component, type ComponentChildren } from 'preact';
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { AppLogo } from './Logo';
import { useAppState, go, setState, type TabId } from './lib/store';
import { onSettingsChange } from './lib/settings';
import { IconBook, IconChat, IconMap, IconShield, IconSignal, IconTools } from './icons';
import { FenerTab } from './tabs/FenerTab';
import { HaritaTab } from './tabs/HaritaTab';
import { KutuphaneTab } from './tabs/KutuphaneTab';
import { RehberTab } from './tabs/RehberTab';
import { IletisimTab } from './tabs/IletisimTab';
import { AraclarTab } from './tabs/AraclarTab';
import { StorageWarning } from './StorageWarning';
import { KurulumHost, kurulumuKapat } from './Kurulum';
import { nativeEnkaz } from './lib/enkaz/native';
import { useGuncelleme } from './lib/guncelleme';
import { GuncellemeKarti } from './Guncelleme';

const TABS: { id: TabId; label: string; sub: string; Icon: typeof IconChat }[] = [
  { id: 'fener', label: 'Fener', sub: 'asistan · çevrimdışı', Icon: IconChat },
  { id: 'rehber', label: 'Rehber', sub: 'rehber · yapay zekâsız', Icon: IconShield },
  { id: 'harita', label: 'Harita', sub: 'harita · OpenStreetMap', Icon: IconMap },
  { id: 'iletisim', label: 'İletişim', sub: 'iletişim · şebekesiz', Icon: IconSignal },
  { id: 'kutuphane', label: 'Kütüphane', sub: 'kütüphane · çevrimdışı', Icon: IconBook },
  { id: 'araclar', label: 'Araçlar', sub: 'araçlar · paketler', Icon: IconTools },
];

/**
 * Hata sınırı: bir bölüm (sekme, kurulum, uyarı bandı) çizilirken hata verirse bütün uygulama
 * boş ekrana dönmesin. Sekmelerde sakin bir kart ve "Yeniden dene"; `sessiz` olanlarda hiçbir
 * şey gösterilmez (ör. güncelleme bandı). Gezinme çubuğu her durumda çalışır.
 */
class HataSiniri extends Component<{ ad: string; sessiz?: boolean; onHata?: () => void; sifirla?: string; children?: ComponentChildren }, { hata: boolean; deneme: number }> {
  state = { hata: false, deneme: 0 };
  static getDerivedStateFromError() {
    return { hata: true };
  }
  /** Sekme içinde başka ekrana geçilince (geri tuşu, "← Araçlar"…) hata kartı kalmasın */
  componentDidUpdate(onceki: { sifirla?: string }) {
    if (this.state.hata && onceki.sifirla !== this.props.sifirla) this.setState({ hata: false, deneme: this.state.deneme + 1 });
  }
  componentDidCatch(hata: unknown) {
    console.error(`[${this.props.ad}] bölüm çizilemedi:`, hata);
    this.setState({ hata: true });
    this.props.onHata?.();
  }
  render() {
    if (!this.state.hata) return <QaCokme ad={this.props.ad} deneme={this.state.deneme}>{this.props.children}</QaCokme>;
    if (this.props.sessiz) return null;
    return (
      <div class="pad">
        <div class="card hata-kart" role="alert" data-testid="hata-siniri" data-bolum={this.props.ad}>
          <h2>Bu bölüm şu an açılamadı</h2>
          <p>Bir sorun oldu, ama verileriniz yerinde ve diğer sekmeler çalışıyor. Yeniden deneyebilir ya da alttaki menüden başka bir bölüme geçebilirsiniz.</p>
          <div class="row">
            <button class="btn primary" data-testid="hata-yeniden" onClick={() => this.setState({ hata: false, deneme: this.state.deneme + 1 })}>
              Yeniden dene
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Sınama kancası: ?qa-cokme=<bölüm> adresiyle o bölüm ilk çiziminde bir kez hata verir
 * (e2e/qa-a11y.mjs hata sınırını böyle sınar). "Yeniden dene"de (deneme > 0) hata vermez.
 */
const QA_COKME = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('qa-cokme') : null;
function QaCokme({ ad, deneme, children }: { ad: string; deneme: number; children?: ComponentChildren }) {
  if (QA_COKME && QA_COKME === ad && deneme === 0) throw new Error('qa-cokme: ' + ad);
  return <>{children}</>;
}

/**
 * Gezinme etiketleri sığmıyorsa küçültür (--nav-fit). Dar ekranda Android'in büyük yazı
 * ayarı (WebView metin yakınlaştırması) "Kütüphane" gibi etiketleri komşusunun üstüne
 * taşırıyordu. Etiketler düğme ortasında durduğundan komşu iki etiketin yarı genişlikleri
 * toplamı (+ 6 px boşluk) düğme merkezleri arasındaki uzaklığı aşmamalı. Kesilmez (…), küçülür.
 */
function navSigdir(nav: HTMLElement) {
  nav.style.removeProperty('--nav-fit');
  const btns = [...nav.querySelectorAll<HTMLElement>('.nav-btn')];
  if (!btns.length) return;
  const row = getComputedStyle(btns[0]).flexDirection === 'row';
  const navR = nav.getBoundingClientRect();
  const items = btns.map((b) => {
    const r = b.getBoundingClientRect();
    const sp = b.querySelector('span')!;
    const svg = b.querySelector('svg');
    // Yan yana düzende (yatay telefon) simge ve aralık da etiketle birlikte ortalanır
    const sabit = row && svg ? svg.getBoundingClientRect().width + (parseFloat(getComputedStyle(b).columnGap) || 0) : 0;
    return { c: r.left + r.width / 2, w: sp.getBoundingClientRect().width, sabit };
  });
  let f = 1;
  for (let k = 0; k < items.length; k++) {
    const a = items[k];
    if (k + 1 < items.length) {
      const b = items[k + 1];
      const yer = b.c - a.c - 6 - (a.sabit + b.sabit) / 2;
      if (a.w + b.w > 0) f = Math.min(f, (2 * yer) / (a.w + b.w));
    }
    // Kenarlar: ilk ve son etiket çubuğun içinde kalsın
    const sol = 2 * (a.c - navR.left - 4) - a.sabit;
    const sag = 2 * (navR.right - a.c - 4) - a.sabit;
    if (a.w > 0) f = Math.min(f, sol / a.w, sag / a.w);
  }
  if (f < 0.995) nav.style.setProperty('--nav-fit', String(Math.max(0.5, Math.floor(f * 100) / 100)));
}

/**
 * Üst çubuk: büyük yazıda (Android yazı boyutu) uygulamanın adı ile bağlantı rozeti dar ekrana
 * sığmazsa önce rozet sıkışır, yine sığmazsa yalnız noktaya iner (yazısı ekran okuyucuda kalır).
 */
function basligiSigdir(header: HTMLElement) {
  header.classList.remove('sik', 'dar');
  const ad = header.querySelector<HTMLElement>('.brand-name');
  const tasiyor = () => !!ad && ad.scrollWidth > ad.clientWidth + 1;
  // Önce rozet sıkışır, yetmezse yalnız nokta kalır
  if (tasiyor()) header.classList.add('sik');
  if (tasiyor()) header.classList.add('dar');
}

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

  // Uygulama güncellemesi (Android): denetim kendiliğinden, kurulum yalnız "Kur" düğmesiyle
  const guncel = useGuncelleme();

  // Bildirimden açılış (enkaz işareti duyuldu, görünürlük bitti, sarsıntı sorusu): ilgili araca git
  useEffect(() => {
    const git = (arac: string | null) => {
      if (arac === 'enkaz' || arac === 'enkaz-arama') go.tool(arac);
    };
    if (!nativeEnkaz.available()) return;
    void nativeEnkaz.acilisHedefi().then(git);
    return nativeEnkaz.onAcilisHedefi(git);
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

  // Gezinme etiketleri ve üst çubuk: ekran boyutu, yazı boyutu ayarı, yazı tipi yüklenmesi ya da
  // rozet yazısı (Çevrimiçi/Çevrimdışı) değişince yeniden sığdır
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sigdir = () => {
    if (navRef.current) navSigdir(navRef.current);
    if (headerRef.current) basligiSigdir(headerRef.current);
  };
  useLayoutEffect(() => {
    let raf = 0;
    const fit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sigdir);
    };
    sigdir();
    window.addEventListener('resize', fit);
    const off = onSettingsChange(fit);
    void document.fonts?.ready.then(fit);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      off();
    };
  }, []);
  useLayoutEffect(() => {
    if (headerRef.current) basligiSigdir(headerRef.current);
  }, [s.online]);

  // Kurulum ekranı açıkken arkadaki uygulama klavye ve ekran okuyucu için erişilmez olur
  const arka = s.kurulum;

  return (
    <div class="app">
      <header class="app-header" ref={headerRef} inert={arka}>
        <div class="brand-row">
          <AppLogo size={34} class="brand-logo" />
          <div class="brand">
            <span class="brand-name">
              <span aria-hidden="true">
                AKIL<em>çantası</em>
              </span>
              <span class="sr-only">Akıl Çantası</span>
            </span>
            <span class="brand-sub" data-testid="tab-sub">{cur.sub}</span>
          </div>
        </div>
        <div
          class="pill"
          role="status"
          data-testid="net-status"
          title={s.online ? 'İnternet bağlantısı var' : 'İnternet yok — her şey cihazda çalışıyor'}
        >
          <span class={'dot' + (s.online ? ' on' : '')} aria-hidden="true" />
          <span class="pill-txt">{s.online ? 'Çevrimiçi' : 'Çevrimdışı'}</span>
        </div>
      </header>

      <HataSiniri ad="depolama" sessiz>
        <StorageWarning inert={arka} />
      </HataSiniri>
      {/* Kurulum ekranı çökerse kapanır (arkadaki uygulama erişilmez kalmasın) */}
      <HataSiniri key={'kurulum-' + s.kurulum} ad="kurulum" sessiz onHata={kurulumuKapat}>
        <KurulumHost />
      </HataSiniri>
      <main class="app-main" id="main" ref={mainRef} inert={arka}>
        {!hasOwnH1 && (
          <h1 class="sr-only app-tab-title" data-testid="tab-title">
            {cur.label}
          </h1>
        )}
        {guncel && !(s.tab === 'araclar' && s.openTool === 'ayarlar') && (
          <HataSiniri ad="guncelleme" sessiz>
            <div class="app-banner">
              <GuncellemeKarti d={guncel} bant />
            </div>
          </HataSiniri>
        )}
        <HataSiniri key={s.tab} ad={s.tab} sifirla={navKey}>
          {s.tab === 'fener' && <FenerTab />}
          {s.tab === 'harita' && <HaritaTab />}
          {s.tab === 'kutuphane' && <KutuphaneTab />}
          {s.tab === 'rehber' && <RehberTab />}
          {s.tab === 'iletisim' && <IletisimTab />}
          {s.tab === 'araclar' && <AraclarTab />}
        </HataSiniri>
      </main>

      <nav class="app-nav" aria-label="Ana menü" ref={navRef} inert={arka}>
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
