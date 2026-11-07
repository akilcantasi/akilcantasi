// Okuyucu: makale (HTML), dosya (PDF ve öteki), Nautilus kitap listesi.
//  • Üst çubuk: ← geldiği ekran · ‹ › · Sayfada bul · İçindekiler · Aa (5 kademe)
//  • Fener'e sor, Paylaş, Türkçeye çevir (Türkçe değilse)
//  • Okunan yer kaydedilir ("Kaldığın yerden devam et"); PDF'te son sayfa
//  • Dış bağlantıya çevrimdışıyken dokunulursa kısa bilgi (yalnız orada)
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { go, setState } from '../../lib/store';
import { native } from '../../lib/native';
import { resolveRef, makeRef, type LibrarySource } from '../../lib/library';
import { extractParagraphs, foldCharwise } from '../../lib/zim';
import { IconChat } from '../../icons';
import { sanitize } from '../../lib/sanitize';
import { loadNautilus, type NautilusBook } from '../../lib/zim/nautilus';
import { sayfaKabukMu } from '../../lib/zim/dizin';
import { KoleksiyonDizini } from './Dizin';
import { ArticleTranslate, isTurkishLang } from '../KutuphaneCeviri';
import { PdfOkuyucu } from '../PdfOkuyucu';
import { nav, syncNav, bekleyenKonumuAl, acMakale } from './gezinme';
import { IcoBack, IcoDown, IcoFind, IcoLeft, IcoRight, IcoShare, IcoToc, IcoUp, IcoX, IcoFile, KategoriIkon } from './ikonlar';
import { lsGet, lsSet, okunanEkle, okunanKonum, okunanlar, ustVeri, anaSayfaYaz } from './veri';
import { sonEkranKodu, type Koleksiyon } from './durum';

// ---------------------------------------------------------------------------
// Yazı boyutu (5 kademe; eski 3 kademeli ayar taşınır)
// ---------------------------------------------------------------------------

const LS_SIZE = 'ac.lib.yazi';
const LS_SIZE_OLD = 'ac.lib.textSize';
export const YAZI_PX = [15, 17, 19, 21.5, 24];
const YAZI_AD = ['Küçük', 'Normal', 'Büyük', 'Daha büyük', 'En büyük'];

function yaziOku(): number {
  const v = lsGet(LS_SIZE);
  if (v !== null) return Math.min(4, Math.max(0, Number(v) || 0));
  const old = lsGet(LS_SIZE_OLD);
  if (old !== null) return Math.min(4, Math.max(0, (Number(old) || 0) + 1));
  return 1;
}

// ---------------------------------------------------------------------------
// Dosyalar
// ---------------------------------------------------------------------------

/** HTML olmayan dosya uzantıları (PDF, belge, ses/görüntü): sayfa olarak değil dosya olarak açılır */
const FILE_EXT = /\.(pdf|epub|djvu|docx?|xlsx?|pptx?|odt|ods|zip|mp3|m4a|ogg|oga|wav|mp4|webm|m4v|mov)$/i;

export function isFilePath(p: string): boolean {
  return FILE_EXT.test(p.split(/[?#]/)[0]);
}

/** Bozuk % kodlamasında hata atmayan decodeURIComponent */
function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** Arşivdeki dosyanın baytlarını okur (uygulama içi PDF okuyucu için) */
async function readZimFile(zim: LibrarySource['zim'], path: string): Promise<Uint8Array | null> {
  const r = await zim.getResource(path).catch(() => null);
  // pdf.js veriyi işçisine devreder (arabellek ayrılır): arşiv önbelleğindeki veri bozulmasın diye kopya
  return r ? new Uint8Array(r.data as Uint8Array) : null;
}

/**
 * Arşivdeki dosyanın tarayıcıda açılabilecek güvenli türü; değilse null (indirilir).
 * Blob adresleri uygulamanın kökenini taşır: arşivin bildirdiği türe güvenilip HTML, SVG ya da
 * XML açılırsa arşivdeki kod uygulamanın içinde (Android'de yerel eklentilere erişerek) çalışır.
 * Bu yüzden yalnız betik çalıştıramayan türler açılır, tür de arşivden değil buradan gelir.
 */
export function guvenliAcmaTuru(mime: string | undefined, path: string): string | null {
  const m = (mime || '').toLowerCase().split(';')[0].trim();
  const ext = (path.split('.').pop() || '').toLowerCase();
  if (m === 'application/pdf' || ext === 'pdf') return 'application/pdf';
  const resim: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
  if (resim[ext] && (m === '' || m === resim[ext] || m.startsWith('image/')) && m !== 'image/svg+xml') return resim[ext];
  const ses: Record<string, string> = { mp3: 'audio/mpeg', ogg: 'audio/ogg', oga: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4', opus: 'audio/ogg' };
  if (ses[ext]) return ses[ext];
  const video: Record<string, string> = { mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg' };
  if (video[ext]) return video[ext];
  if (ext === 'txt' || ext === 'csv') return 'text/plain;charset=utf-8';
  return null;
}

/**
 * Arşivdeki dosyayı tarayıcının kendi görüntüleyicisinde (PDF, video…) açar; güvenli türde
 * değilse ya da yeni pencere açılamazsa indirir.
 */
async function openZimFile(zim: LibrarySource['zim'], path: string, download = false): Promise<boolean> {
  const name = safeDecode(path.split('/').pop() || 'dosya');
  const peek = await zim.getResource(path).catch(() => null);
  const tur = peek ? guvenliAcmaTuru(peek.mime, path) : null;
  if (!tur) download = true;
  let w: Window | null = null;
  if (!download) {
    try {
      w = window.open('', '_blank');
      if (w) {
        w.document.title = name;
        w.document.body.style.cssText = 'font:16px system-ui,sans-serif;background:#0e1b2c;color:#f4f7fb;padding:24px';
        w.document.body.textContent = name + ' hazırlanıyor…';
      }
    } catch {
      w = null;
    }
  }
  if (!peek) {
    if (w) w.document.body.textContent = 'Dosya arşivde bulunamadı.';
    return false;
  }
  const url = URL.createObjectURL(new Blob([peek.data as BlobPart], { type: download || !tur ? 'application/octet-stream' : tur }));
  setTimeout(() => URL.revokeObjectURL(url), 10 * 60 * 1000);
  if (w && !w.closed) {
    w.location.href = url;
    return true;
  }
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}

function scrollTop() {
  document.getElementById('main')?.scrollTo({ top: 0 });
}

// ---------------------------------------------------------------------------
// Makale görünümü
// ---------------------------------------------------------------------------

type ArticleState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ok'; src: LibrarySource; title: string; html: string; text: string; path: string }
  | { status: 'file'; src: LibrarySource; title: string; path: string; mime: string }
  | { status: 'books'; src: LibrarySource; title: string; path: string; books: NautilusBook[] }
  /** Giriş sayfası betikle çiziliyor (Gutenberg vb.): onun yerine uygulamanın kendi dizini */
  | { status: 'dizin'; src: LibrarySource; title: string; path: string };

type Panel = null | 'find' | 'toc' | 'size';

export function Okuyucu({ refStr, geriAdi, koleksiyonlar }: { refStr: string; geriAdi: string; koleksiyonlar: Koleksiyon[] }) {
  const [state, setLocal] = useState<ArticleState>({ status: 'loading' });
  const [size, setSize] = useState(yaziOku);
  const [panel, setPanel] = useState<Panel>(null);
  /** PDF okuyucu açık mı (FileCard / BookList bildirir) */
  const [reader, setReader] = useState(false);
  const [findQ, setFindQ] = useState('');
  const [findCur, setFindCur] = useState(0);
  const [findN, setFindN] = useState(0);
  const [toc, setToc] = useState<{ id: string; text: string; sub: boolean }[]>([]);
  const [toast, setToast] = useState('');
  /** Gövdesi tamamen yerleşen HTML (büyük sayfalar parça parça eklenir; bkz. ArticleBody) */
  const [hazirHtml, setHazirHtml] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const findRef = useRef<HTMLInputElement>(null);
  const marks = useRef<HTMLElement[]>([]);
  const findOpen = panel === 'find';

  syncNav(refStr);
  const canBack = nav.idx > 0;
  const canFwd = nav.idx < nav.stack.length - 1;

  useLayoutEffect(() => {
    if (findOpen) findRef.current?.focus();
  }, [findOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let alive = true;
    setLocal({ status: 'loading' });
    setFindQ('');
    setPanel((p) => (p === 'size' ? p : null));
    setToc([]);
    scrollTop();
    (async () => {
      const r = await resolveRef(refStr);
      if (!r) return null;
      // PDF gibi dosyalar metin olarak çözülmez; dosya kartı gösterilir
      if (isFilePath(r.path)) return { r, a: null, books: null, dizin: false };
      const a = await r.source.zim.getArticle(r.path);
      if (!a) return null;
      // Nautilus kitaplığının ana sayfası: kitap listesini kendimiz çizeriz
      let books: NautilusBook[] | null = null;
      if (a.mime.startsWith('text/html') && /\bhome(\.html)?$|^index\.html$/i.test(a.path)) books = await loadNautilus(r.source.zim);
      // Betikle çizilen giriş sayfası (betik çalıştırılmaz, boş kalır): yalnız koleksiyonun ana sayfası
      let dizin = false;
      if (!books && a.mime.startsWith('text/html') && (r.source.kind === 'gutenberg' || /<script/i.test(a.html))) {
        const anaYol = ustVeri(r.source.id)?.main ?? (await r.source.zim.getMainPage().catch(() => null))?.path;
        dizin = anaYol === a.path && (r.source.kind === 'gutenberg' || sayfaKabukMu(a.html));
      }
      return { r, a, books, dizin };
    })()
      .then((x) => {
        if (!alive) return;
        if (!x) return setLocal({ status: 'missing' });
        const { r, a, books, dizin } = x;
        if (!a) {
          // Kitap listesinden açılmış bir PDF'in adı (dosya adı yerine kitabın adı) son okunanlarda
          const name = okunanlar().find((o) => o.ref === refStr)?.title ?? safeDecode(r.path.split('/').pop() || r.path);
          return setLocal({ status: 'file', src: r.source, title: name, path: r.path, mime: '' });
        }
        if (books) return setLocal({ status: 'books', src: r.source, title: r.source.title, path: a.path, books });
        if (dizin) return setLocal({ status: 'dizin', src: r.source, title: r.source.title, path: a.path });
        // Görseller (SVG dahil: türünde "xml" geçer) metin olarak değil dosya olarak gösterilir
        if (a.mime.startsWith('image/') || (!a.mime.startsWith('text/') && !/json|xml|javascript/.test(a.mime))) {
          return setLocal({ status: 'file', src: r.source, title: a.title || a.path, path: a.path, mime: a.mime });
        }
        const isHtml = a.mime.startsWith('text/html');
        const html = isHtml
          ? sanitize(a.html, r.source.zim, a.path, a.title)
          : `<pre>${a.html.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)}</pre>`;
        // Fener'e sor / Paylaş için ilk 1500 karakter yeter: çok büyük sayfalarda (Gutenberg'de
        // birkaç MB'lık tek sayfalık kitaplar) bütün metni çıkarmak saniyelerce donduruyordu
        const text = isHtml ? extractParagraphs(a.html.length > METIN_ONEK ? a.html.slice(0, METIN_ONEK) : a.html, 1500).join('\n\n') : a.html.slice(0, 1500);
        setLocal({ status: 'ok', src: r.source, title: a.title, html, text, path: a.path });
      })
      .catch((e) => {
        console.warn('Makale açılamadı', e);
        if (alive) setLocal({ status: 'missing' });
      });
    return () => {
      alive = false;
    };
  }, [refStr]);

  /** Makale gövdesi tamamen yerleşti mi (konum geri yükleme, içindekiler, sayfada bul bunu bekler) */
  const hazir = state.status === 'ok' && hazirHtml === state.html;
  const kol = state.status !== 'loading' && state.status !== 'missing' ? koleksiyonlar.find((k) => k.id === state.src.id) : undefined;
  const kolAd = kol?.ad ?? (state.status !== 'loading' && state.status !== 'missing' ? state.src.label : '');
  const kategori = kol?.kategori ?? 'diger';
  /** Koleksiyonun ana sayfasıysa arşivdeki teknik başlık ("Kullanıcı:…/Landing") yerine koleksiyonun adı */
  const anaSayfa = state.status === 'ok' && ustVeri(state.src.id)?.main === state.path;
  const title = state.status === 'ok' ? (anaSayfa ? kolAd : state.title) : state.status === 'file' ? state.title : '';

  // Son okunanlara ekle (makale ve dosya; kitap listesi değil)
  useEffect(() => {
    if (state.status === 'ok' || state.status === 'file') okunanEkle({ ref: refStr, title, src: state.src.id });
  }, [state]);

  // Okunan oranı kaydet + "kaldığın yerden" konuma git
  useEffect(() => {
    if (state.status !== 'ok' || !hazir) return;
    const main = document.getElementById('main');
    if (!main) return;
    const y = bekleyenKonumuAl(refStr);
    if (y) requestAnimationFrame(() => bodyRef.current && konumaGit(main, bodyRef.current, y));
    let t = 0;
    const on = () => {
      if (t) return;
      t = window.setTimeout(() => {
        t = 0;
        const v = bodyRef.current ? konumOku(main, bodyRef.current) : null;
        if (v !== null) okunanKonum(refStr, { y: v });
      }, 500);
    };
    main.addEventListener('scroll', on, { passive: true });
    return () => {
      main.removeEventListener('scroll', on);
      if (t) clearTimeout(t);
    };
  }, [state, hazir]);

  // Görselleri arşivden yükle + içindekiler
  useEffect(() => {
    if (state.status !== 'ok' || !hazir || !bodyRef.current) return;
    const urls: string[] = [];
    let alive = true;
    const zim = state.src.zim;
    bodyRef.current.querySelectorAll<HTMLImageElement>('img[data-zim-src]').forEach((img) => {
      const p = img.getAttribute('data-zim-src')!;
      zim
        .getResource(p)
        .then((r) => {
          if (!alive || !r || !r.mime.startsWith('image/')) return;
          const url = URL.createObjectURL(new Blob([r.data as BlobPart], { type: r.mime }));
          urls.push(url);
          img.onload = () => img.removeAttribute('hidden');
          img.src = url;
        })
        .catch(() => {});
    });
    bodyRef.current.querySelectorAll<HTMLElement>('figure').forEach((f) => {
      if (!f.querySelector('img[data-zim-src]') && !f.textContent?.trim()) f.hidden = true;
    });
    const list: { id: string; text: string; sub: boolean }[] = [];
    bodyRef.current.querySelectorAll<HTMLElement>('h2, h3').forEach((h, i) => {
      const text = (h.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (!text || h.closest('[hidden], table, figure')) return;
      if (!h.id) h.id = 'kt-b-' + i;
      list.push({ id: h.id, text: text.length > 80 ? text.slice(0, 78) + '…' : text, sub: h.tagName === 'H3' });
    });
    setToc(list.slice(0, 120));
    return () => {
      alive = false;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [state, hazir]);

  // Sayfada bul: eşleşmeleri işaretle
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || state.status !== 'ok' || !hazir) return;
    clearMarks(root);
    marks.current = findOpen ? markMatches(root, findQ) : [];
    setFindN(marks.current.length);
    setFindCur(0);
  }, [findQ, findOpen, state, hazir]);

  useEffect(() => {
    marks.current.forEach((m, i) => m.classList.toggle('cur', i === findCur));
    const m = marks.current[findCur];
    if (m) m.scrollIntoView({ block: 'center' });
  }, [findCur, findN]);

  const closeFind = () => {
    if (bodyRef.current) clearMarks(bodyRef.current);
    marks.current = [];
    setFindN(0);
    setPanel(null);
  };
  const toggle = (p: Panel) => {
    if (panel === 'find' && p !== 'find') closeFind();
    setPanel(panel === p ? null : p);
  };

  const step = (d: number) => {
    if (!findN) return;
    setFindCur((c) => (c + d + findN) % findN);
  };

  const setYazi = (n: number) => {
    const v = Math.min(4, Math.max(0, n));
    setSize(v);
    lsSet(LS_SIZE, String(v));
  };

  const jump = (id: string) => {
    setPanel(null);
    requestAnimationFrame(() => bodyRef.current?.querySelector(`[id="${CSS_escape(id)}"]`)?.scrollIntoView({ block: 'start' }));
  };

  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || state.status !== 'ok') return;
    const zp = a.getAttribute('data-zim-path');
    if (zp) {
      e.preventDefault();
      // PDF'ler uygulama içi okuyucuda açılır (Android WebView'da yeni pencere açılmıyordu)
      const bare = zp.split(/[?#]/)[0];
      // Öteki dosyalar da (ses, görüntü, resim) uygulamanın içindeki görüntüleyicide açılır:
      // Android WebView'da yeni pencere ve blob indirme çalışmıyor
      if (isFilePath(bare)) go.article(makeRef(state.src.id, bare));
      else go.article(makeRef(state.src.id, zp));
      return;
    }
    if (a.hasAttribute('data-ext') && typeof navigator !== 'undefined' && navigator.onLine === false) {
      e.preventDefault();
      setToast('Bu bağlantı internet ister; şu an çevrimdışısınız. Kütüphanedeki her şey internetsiz okunur.');
      return;
    }
    const href = a.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const id = safeDecode(href.slice(1));
      if (id) bodyRef.current?.querySelector(`[id="${CSS_escape(id)}"]`)?.scrollIntoView({ block: 'start' });
    }
  };

  const share = async () => {
    if (state.status !== 'ok') return;
    const ozet = state.text.split('\n\n')[0]?.slice(0, 600) ?? '';
    const metin = `${title}\n\n${ozet}${ozet.length >= 600 ? '…' : ''}\n\n— ${kolAd} (Akıl Çantası çevrimdışı kütüphanesi)`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title, text: metin });
        return;
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(metin);
      setToast('Maddenin özeti panoya kopyalandı; mesaja yapıştırabilirsiniz.');
    } catch {
      setToast('Paylaşılamadı: bu cihaz panoya yazmaya izin vermiyor.');
    }
  };

  const close = () => setState({ openArticlePath: sonEkranKodu() });
  const back = () => canBack && go.article(nav.stack[nav.idx - 1]);
  const fwd = () => canFwd && go.article(nav.stack[nav.idx + 1]);
  const isText = state.status === 'ok';

  return (
    <article class="pad" data-testid="lib-article" data-hazir={hazir ? '1' : undefined} aria-labelledby="kt-title" style={{ '--kt-fs': YAZI_PX[size] + 'px' } as any}>
      {/* PDF okuyucunun kendi çubuğu var (geri, sayfa, yakınlaştırma): okuyucu açıkken bu çubuk gizlenir */}
      {!reader && (
      <div class="kt-bar" data-testid="lib-bar-top">
        <div class="kt-bar-row">
          <button class="kt-back" data-testid="lib-back" aria-label={`Geri: ${geriAdi}`} onClick={close}>
            <IcoBack />
            <span>{geriAdi}</span>
          </button>
          <span class="kt-bar-tools">
            {(canBack || canFwd) && (
              <>
                <button class="kt-ib" data-testid="lib-nav-back" aria-label="Önceki madde" disabled={!canBack} onClick={back}>
                  <IcoLeft />
                </button>
                <button class="kt-ib" data-testid="lib-nav-fwd" aria-label="Sonraki madde" disabled={!canFwd} onClick={fwd}>
                  <IcoRight />
                </button>
              </>
            )}
            {isText && (
              <button class="kt-ib" data-testid="lib-find-toggle" aria-label="Sayfada bul" aria-pressed={findOpen} onClick={() => toggle('find')}>
                <IcoFind />
              </button>
            )}
            {isText && toc.length >= 2 && (
              <button class="kt-ib" data-testid="lib-toc-toggle" aria-label="İçindekiler" aria-pressed={panel === 'toc'} onClick={() => toggle('toc')}>
                <IcoToc />
              </button>
            )}
            {isText && (
              <button
                class="kt-ib"
                data-testid="lib-textsize"
                aria-label={`Yazı boyutu: ${YAZI_AD[size]}`}
                title={`Yazı boyutu: ${YAZI_AD[size]}`}
                aria-pressed={panel === 'size'}
                onClick={() => toggle('size')}
              >
                Aa
              </button>
            )}
          </span>
        </div>
        {findOpen && isText && (
          <div class="kt-find" role="search">
            <input
              ref={findRef}
              class="input grow"
              type="search"
              data-testid="lib-find-input"
              placeholder="Bu sayfada bul…"
              aria-label="Sayfada bul"
              value={findQ}
              onInput={(e) => setFindQ((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') step(e.shiftKey ? -1 : 1);
                if (e.key === 'Escape') closeFind();
              }}
              autocomplete="off"
              spellcheck={false}
            />
            <span class="kt-find-n" data-testid="lib-find-count" aria-live="polite">
              {findQ.trim() ? (findN ? `${findCur + 1}/${findN}` : '0') : ''}
            </span>
            <span class="kt-bar-tools">
              <button class="kt-ib" data-testid="lib-find-prev" aria-label="Önceki eşleşme" disabled={!findN} onClick={() => step(-1)}>
                <IcoUp />
              </button>
              <button class="kt-ib" data-testid="lib-find-next" aria-label="Sonraki eşleşme" disabled={!findN} onClick={() => step(1)}>
                <IcoDown />
              </button>
              <button class="kt-ib" data-testid="lib-find-close" aria-label="Bulmayı kapat" onClick={closeFind}>
                <IcoX />
              </button>
            </span>
          </div>
        )}
        {panel === 'size' && isText && (
          <div class="kt-panel" data-testid="lib-size-panel">
            <div class="kt-panel-h">
              <span>Yazı boyutu: {YAZI_AD[size]}</span>
            </div>
            <div class="kt-size">
              <button class="kt-ib" data-testid="lib-size-down" aria-label="Yazıyı küçült" disabled={size === 0} onClick={() => setYazi(size - 1)}>
                A−
              </button>
              <div class="kt-size-dots" aria-hidden="true">
                {YAZI_PX.map((_, i) => (
                  <i key={i} class={i === size ? 'on' : ''} />
                ))}
              </div>
              <button class="kt-ib" data-testid="lib-size-up" aria-label="Yazıyı büyüt" disabled={size === 4} onClick={() => setYazi(size + 1)} style="font-size:18px">
                A+
              </button>
            </div>
          </div>
        )}
        {panel === 'toc' && isText && (
          <div class="kt-panel" data-testid="lib-toc">
            <div class="kt-panel-h">
              <span>İçindekiler</span>
            </div>
            <ul class="kt-toc">
              {toc.map((h) => (
                <li key={h.id}>
                  <button class={h.sub ? 'sub' : ''} data-testid="lib-toc-item" onClick={() => jump(h.id)}>
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      )}

      {state.status === 'loading' && (
        <p class="empty" data-testid="lib-article-loading" role="status">
          Açılıyor…
        </p>
      )}
      {state.status === 'missing' && (
        <div class="kt" data-testid="lib-article-missing">
          <p class="empty" style="margin:0">
            Bu sayfa açılamadı. Bağlantısı bu koleksiyonda olmayan bir sayfaya gidiyor ya da koleksiyon artık bu cihazda değil.
          </p>
          <button class="btn" style="align-self:flex-start" onClick={close}>
            {geriAdi} ekranına dön
          </button>
        </div>
      )}
      {state.status === 'ok' && (
        <>
          <div class={'kt-src-line kt-k-' + kategori}>
            <span class="kt-src-chip" data-testid="lib-article-src">
              <span class="kt-dot" aria-hidden="true">
                <KategoriIkon k={kategori} size={14} />
              </span>
              {kolAd}
            </span>
            {!isTurkishLang(state.src.language) && state.src.languageName && <span class="tag">{state.src.languageName}</span>}
          </div>
          <h1 class="kt-title" id="kt-title" data-testid="lib-article-title">
            {title}
          </h1>
          <div class="kt-tools">
            <button
              class="btn"
              data-testid="lib-ask"
              onClick={() =>
                go.ask(`"${state.title}" hakkında kısaca bilgi verir misin?`, {
                  title: state.title,
                  text: state.text,
                  source: `${state.src.label}: ${state.title}`,
                })
              }
            >
              <IconChat size={18} />
              Fener'e sor
            </button>
            <button class="btn" data-testid="lib-share" onClick={share}>
              <IcoShare />
              Paylaş
            </button>
          </div>
          <ArticleTranslate key={refStr} refStr={refStr} html={state.html} language={state.src.language} />
          <ArticleBody html={state.html} bodyRef={bodyRef} onClick={onClick} onHazir={setHazirHtml} />
          <div class="kt-end">
            <p class="kt-note">
              Bu sayfa "{kolAd}" koleksiyonundan, bu cihazdan okunuyor; internet gerekmez.
            </p>
            <button class="btn" style="align-self:flex-start" data-testid="lib-top" onClick={() => scrollTop()}>
              Başa dön
            </button>
          </div>
        </>
      )}
      {state.status === 'file' && <FileCard key={state.path} src={state.src} title={state.title} path={state.path} refStr={refStr} kolAd={kolAd} onReader={setReader} onClose={() => (canBack ? back() : close())} />}
      {state.status === 'books' && <BookList key={state.path} src={state.src} kolAd={kolAd} books={state.books} onReader={setReader} />}
      {state.status === 'dizin' && (
        <div class="kt" style="gap:12px" data-testid="lib-dizin-sayfa">
          <h1 class="kt-title" id="kt-title" data-testid="lib-article-title">
            {kolAd || state.title}
          </h1>
          <KoleksiyonDizini key={state.src.id} src={state.src} anaYol={state.path} ara />
        </div>
      )}
      {toast && (
        <div class="kt-toast" role="status" data-testid="lib-toast">
          {toast}
        </div>
      )}
    </article>
  );
}

/** PDF okuyucunun açık olduğunu üst bileşene bildirir (kapanınca ve bileşen gidince false) */
function useReaderFlag(open: boolean, onReader?: (open: boolean) => void) {
  useEffect(() => {
    onReader?.(open);
    return () => onReader?.(false);
  }, [open]);
}

/** Son okunan PDF sayfası (Kaldığın yerden devam et) */
function sonSayfa(ref: string): number | undefined {
  return okunanlar().find((o) => o.ref === ref)?.page;
}

function FileCard({
  src,
  title,
  path,
  refStr,
  kolAd,
  onReader,
  onClose,
}: {
  src: LibrarySource;
  title: string;
  path: string;
  refStr: string;
  kolAd: string;
  onReader?: (open: boolean) => void;
  /** PDF okuyucunun geri düğmesi: önceki maddeye ya da geldiği ekrana döner */
  onClose: () => void;
}) {
  const [msg, setMsg] = useState('');
  const pdf = /\.pdf$/i.test(path);
  const [reading, setReading] = useState(pdf);
  useReaderFlag(pdf && reading, onReader);
  const run = async (download: boolean) => {
    setMsg('Hazırlanıyor…');
    const ok = await openZimFile(src.zim, path, download);
    setMsg(ok ? '' : 'Dosya arşivde bulunamadı.');
  };
  if (pdf && reading) {
    return (
      <PdfOkuyucu
        title={title}
        sub={kolAd}
        language={src.language}
        docKey={src.id + '/' + path}
        startPage={sonSayfa(refStr)}
        onPage={(page, pages) => okunanKonum(refStr, { page, pages })}
        load={() => readZimFile(src.zim, path)}
        onClose={onClose}
        hataEki={
          <div class="row" style="flex-wrap:wrap">
            <button class="btn" data-testid="lib-file-external" onClick={() => run(false)}>
              Başka uygulamada aç
            </button>
            <button class="btn" data-testid="lib-file-save" onClick={() => run(true)}>
              Cihaza kaydet
            </button>
            {msg && <span class="muted">{msg}</span>}
          </div>
        }
      />
    );
  }
  const yerel = native.isNative();
  return (
    <div class="kt-file" data-testid="lib-file">
      <div class="row">
        <span class="tag">{kolAd}</span>
        {pdf && <span class="tag">PDF</span>}
      </div>
      <h1 class="kt-title" id="kt-title">
        {title}
      </h1>
      {pdf ? (
        <p class="muted">Bu bir PDF belgesi. Uygulamanın içinde okuyabilir, içinde arama yapabilir ve sayfaları çevirebilirsiniz.</p>
      ) : (
        <DosyaGosterici src={src} path={path} yerel={yerel} />
      )}
      <div class="row">
        {pdf && (
          <button class="btn primary" data-testid="lib-file-open" onClick={() => setReading(true)}>
            Okumaya başla
          </button>
        )}
        {!yerel && !pdf && (
          <button class="btn" data-testid="lib-file-open" onClick={() => run(false)}>
            Yeni pencerede aç
          </button>
        )}
        {!yerel && pdf && (
          <button class="btn" data-testid="lib-file-external" onClick={() => run(false)}>
            Başka uygulamada aç
          </button>
        )}
        {!yerel && (
          <button class="btn" data-testid="lib-file-save" onClick={() => run(true)}>
            Cihaza kaydet
          </button>
        )}
      </div>
      {msg && (
        <p class="muted" role="status">
          {msg}
        </p>
      )}
    </div>
  );
}

/**
 * Arşivdeki resim, ses, görüntü ve düz metin dosyalarını uygulamanın içinde gösterir (tür arşivden
 * değil uzantıdan: guvenliAcmaTuru). Başka türler için sakin bir açıklama.
 */
function DosyaGosterici({ src, path, yerel }: { src: LibrarySource; path: string; yerel: boolean }) {
  const [g, setG] = useState<{ k: 'yukleniyor' } | { k: 'yok' } | { k: 'desteksiz'; ext: string } | { k: 'img' | 'audio' | 'video'; url: string } | { k: 'text'; text: string }>({ k: 'yukleniyor' });
  useEffect(() => {
    let alive = true;
    let url = '';
    src.zim
      .getResource(path)
      .then((r) => {
        if (!alive) return;
        if (!r) return setG({ k: 'yok' });
        const tur = guvenliAcmaTuru(r.mime, path);
        const ext = (path.split(/[?#]/)[0].split('.').pop() || '').toLowerCase();
        if (!tur || tur === 'application/pdf') return setG({ k: 'desteksiz', ext });
        if (tur.startsWith('text/')) return setG({ k: 'text', text: new TextDecoder().decode(r.data as Uint8Array).slice(0, 200000) });
        url = URL.createObjectURL(new Blob([r.data as BlobPart], { type: tur }));
        setG({ k: tur.startsWith('image/') ? 'img' : tur.startsWith('audio/') ? 'audio' : 'video', url });
      })
      .catch(() => alive && setG({ k: 'yok' }));
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [src, path]);
  switch (g.k) {
    case 'yukleniyor':
      return (
        <p class="muted" role="status">
          Açılıyor…
        </p>
      );
    case 'yok':
      return <p class="muted">Dosya arşivde bulunamadı.</p>;
    case 'img':
      return <img class="kt-media" data-testid="lib-file-view" src={g.url} alt="" />;
    case 'audio':
      return <audio class="kt-media" data-testid="lib-file-view" src={g.url} controls preload="metadata" />;
    case 'video':
      return <video class="kt-media" data-testid="lib-file-view" src={g.url} controls playsInline preload="metadata" />;
    case 'text':
      return (
        <pre class="kt-media kt-pre" data-testid="lib-file-view">
          {g.text}
        </pre>
      );
    case 'desteksiz':
      return (
        <p class="muted" data-testid="lib-file-unsupported">
          Bu dosya türü{g.ext ? ` (.${g.ext})` : ''} uygulamanın içinde gösterilemiyor.
          {yerel
            ? ' Bir bilgisayarda Akıl Çantası bilgi noktasından ya da Kiwix ile açabilirsiniz.'
            : ' Aşağıdan cihazınıza kaydedip uygun bir uygulamayla açabilirsiniz.'}
        </p>
      );
  }
}

/** Nautilus kitaplığı (zimgit) kitap listesi: başlık, yazar, açıklama; PDF'ler uygulama içinde açılır. */
export function BookList({
  src,
  kolAd,
  books,
  onReader,
  baslik = true,
}: {
  src: LibrarySource;
  kolAd: string;
  books: NautilusBook[];
  onReader?: (open: boolean) => void;
  /** Başlık ve açıklama gösterilsin mi (koleksiyon ekranında üstte zaten var) */
  baslik?: boolean;
}) {
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [reading, setReading] = useState<{ book: NautilusBook; file: string } | null>(null);
  const [shown, setShown] = useState(20);
  useReaderFlag(!!reading, onReader);
  /** Kitap açılırken listenin kaydırma konumu (okuyucu kapanınca geri dönülür) */
  const listY = useRef(0);
  const fq = foldCharwise(q.trim());
  const shownBooks = useMemo(() => (fq ? books.filter((b) => foldCharwise(`${b.title} ${b.author} ${b.description}`).includes(fq)) : books), [books, fq]);
  const allPdf = books.length > 0 && books.every((b) => b.files.every((f) => /\.pdf$/i.test(f)));
  const turkish = isTurkishLang(src.language);
  const open = async (b: NautilusBook, f: string) => {
    if (/\.pdf$/i.test(f)) {
      okunanEkle({ ref: makeRef(src.id, f), title: b.title, src: src.id });
      // Koleksiyon ekranında: okuyucu tam ekran açılır, geri ile koleksiyona dönülür
      if (!baslik) return acMakale(makeRef(src.id, f), { yeni: true });
      listY.current = document.getElementById('main')?.scrollTop ?? 0;
      setReading({ book: b, file: f });
      scrollTop();
      return;
    }
    // Öteki dosyalar uygulama içi görüntüleyicide (Android'de dış pencere açılmıyor)
    setBusy(b.id + f);
    okunanEkle({ ref: makeRef(src.id, f), title: b.title, src: src.id });
    acMakale(makeRef(src.id, f), { yeni: true });
    setBusy(null);
  };
  if (reading) {
    const ref = makeRef(src.id, reading.file);
    return (
      <PdfOkuyucu
        key={reading.file}
        title={reading.book.title}
        sub={reading.book.author || kolAd}
        language={src.language}
        docKey={src.id + '/' + reading.file}
        startPage={sonSayfa(ref)}
        onPage={(page, pages) => okunanKonum(ref, { page, pages })}
        load={() => readZimFile(src.zim, reading.file)}
        onClose={() => {
          const y = listY.current;
          setReading(null);
          requestAnimationFrame(() => document.getElementById('main')?.scrollTo({ top: y }));
        }}
      />
    );
  }
  return (
    <div class="kt-books" data-testid="lib-books">
      {baslik && (
        <>
          <div class="row">
            <span class="tag">{kolAd}</span>
            {src.languageName && !turkish && <span class="tag">{src.languageName}</span>}
          </div>
          <h1 class="kt-title" id="kt-title">
            {kolAd || src.title}
          </h1>
          {src.description && <p class="muted">{src.description}</p>}
        </>
      )}
      {books.length > 6 && (
        <input
          class="input"
          type="search"
          placeholder={`${books.length} kitapta ara…`}
          aria-label="Kitaplarda ara"
          data-testid="lib-books-q"
          value={q}
          onInput={(e) => setQ((e.target as HTMLInputElement).value)}
        />
      )}
      <ul class="kt-book-list">
        {shownBooks.slice(0, shown).map((b) => (
          <li key={b.id} class="kt-book" data-testid="lib-book">
            <div class="kt-book-title">{b.title}</div>
            {b.author && <div class="kt-book-meta">{b.author}</div>}
            {b.description && <div class="kt-book-desc">{b.description}</div>}
            <div class="row">
              {b.files.map((f, i) => (
                <button key={f} class="btn" data-testid="lib-book-open" disabled={busy === b.id + f} onClick={() => open(b, f)}>
                  <IcoFile />
                  {busy === b.id + f ? 'Açılıyor…' : b.files.length > 1 ? `Oku (${i + 1})` : 'Oku'}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {shownBooks.length > shown && (
        <button class="btn kt-more" data-testid="lib-books-more" onClick={() => setShown(shown + 30)}>
          Daha fazla göster ({shownBooks.length - shown})
        </button>
      )}
      {!shownBooks.length && <p class="empty">Eşleşen kitap yok.</p>}
      {allPdf && (
        <p class="muted kt-small">
          {src.languageName && !turkish ? `Kitaplar ${src.languageName} PDF belgeleridir` : 'Kitaplar PDF belgeleridir'}; uygulamanın içinde açılır ve içlerinde arama
          yapılabilir{turkish ? '.' : '; sayfalar Fener ile Türkçeye çevrilebilir.'}
        </p>
      )}
    </div>
  );
}

type BuyukGovde = HTMLElement & { bloklar?: HTMLElement[] };

/**
 * Okunan yer (0..1). Küçük sayfalarda kaydırma oranı. Büyük sayfalarda ekran dışındaki bloklar
 * yerleştirilmediği için (content-visibility) toplam yükseklik tahminidir; oran blok sırasıyla
 * tutulur: (ekranın üstündeki blok + bloğun okunan kısmı) / blok sayısı. Aynı sayfa hep aynı
 * yolla açıldığından kaydedilen ve geri yüklenen değer tutarlıdır.
 */
export function konumOku(main: HTMLElement, body: HTMLElement): number | null {
  const bl = (body as BuyukGovde).bloklar;
  if (bl?.length) {
    const ust = main.getBoundingClientRect().top;
    let a = 0;
    let b = bl.length - 1;
    // Alt kenarı ekranın üstünden aşağıda olan ilk blok (ikili arama)
    while (a < b) {
      const m = (a + b) >> 1;
      if (bl[m].getBoundingClientRect().bottom <= ust) a = m + 1;
      else b = m;
    }
    const r = bl[a].getBoundingClientRect();
    const pay = r.height > 0 ? Math.min(1, Math.max(0, (ust - r.top) / r.height)) : 0;
    return Math.min(1, (a + pay) / bl.length);
  }
  const max = main.scrollHeight - main.clientHeight;
  return max > 0 ? Math.min(1, main.scrollTop / max) : null;
}

/** konumOku'nun tersi: okunan yere kaydırır */
export function konumaGit(main: HTMLElement, body: HTMLElement, y: number) {
  const bl = (body as BuyukGovde).bloklar;
  if (bl?.length) {
    const t = Math.min(bl.length - 1e-6, Math.max(0, y * bl.length));
    const i = Math.floor(t);
    const hedef = bl[i];
    const r0 = hedef.getBoundingClientRect();
    main.scrollTop += r0.top - main.getBoundingClientRect().top;
    // content-visibility: blok ekrana gelince gerçek yüksekliği ölçülür; okunan kısım ona göre
    requestAnimationFrame(() => {
      const r = hedef.getBoundingClientRect();
      main.scrollTop += r.top - main.getBoundingClientRect().top + (t - i) * r.height;
    });
    return;
  }
  const max = main.scrollHeight - main.clientHeight;
  if (max > 0) main.scrollTo({ top: y * max });
}

/** Bu boyuttan büyük sayfalarda Fener/Paylaş özeti yalnız baştan çıkarılır */
const METIN_ONEK = 150_000;
/** Bu boyuttan büyük gövdeler parça parça yerleştirilir */
const PARCALI_ESIK = 200_000;
/** Bir karede gövdeye eklenen en çok iş süresi (ms) */
const KARE_BUTCE = 12;

/**
 * Makale gövdesi. HTML yalnızca değişince yeniden yazılır (sayfada bul işaretleri korunur).
 * Büyük sayfalar (Gutenberg'in tek sayfalık kitapları birkaç MB olabilir) tek seferde
 * yazılınca telefon saniyelerce donuyordu: önce ilk parça gösterilir, kalanı her karede kısa
 * dilimlerle eklenir (kaydırma ve dokunma bu sırada çalışır). Bitince onHazir(html) çağrılır;
 * okuma konumu, içindekiler ve sayfada bul tam gövdeyi bekler.
 */
function ArticleBody({
  html,
  bodyRef,
  onClick,
  onHazir,
}: {
  html: string;
  bodyRef: { current: HTMLDivElement | null };
  onClick: (e: MouseEvent) => void;
  onHazir: (html: string) => void;
}) {
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (html.length <= PARCALI_ESIK) {
      el.classList.remove('kt-buyuk');
      (el as BuyukGovde).bloklar = undefined;
      el.innerHTML = html;
      onHazir(html);
      return;
    }
    let alive = true;
    el.textContent = '';
    el.classList.add('kt-buyuk');
    // <template> içinde ayrıştırılır: henüz belgeye bağlı değil, yerleşim/çizim maliyeti yok
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    // Yığın: [hedef, sıradaki düğümler]. Çok büyük tek kap (kitabın tamamını saran <div>)
    // bölünür: kabın sığ kopyası eklenir, çocukları onun içine sırayla taşınır.
    const yigin: [Node, Node[]][] = [[el, Array.from(tpl.content.childNodes)]];
    const BUYUK = 40_000;
    /** Eklenen bloklar (okuma konumu bunlara göre tutulur; bkz. konumOku) */
    const bloklar: HTMLElement[] = [];
    (el as BuyukGovde).bloklar = bloklar;
    const ekle = (butce: number) => {
      const bas = performance.now();
      while (yigin.length && performance.now() - bas < butce) {
        const ust = yigin[yigin.length - 1];
        const n = ust[1].shift();
        if (!n) {
          yigin.pop();
          continue;
        }
        if (n.nodeType === 1 && n.childNodes.length > 1 && (n.textContent?.length ?? 0) > BUYUK) {
          const kab = n.cloneNode(false);
          ust[0].appendChild(kab);
          yigin.push([kab, Array.from(n.childNodes)]);
        } else {
          ust[0].appendChild(n);
          if (n.nodeType === 1) {
            (n as HTMLElement).classList.add('kt-blok');
            bloklar.push(n as HTMLElement);
          }
        }
      }
      return !yigin.length;
    };
    // İlk ekran: hemen (bu karede) biraz daha geniş bütçeyle
    if (ekle(30)) {
      onHazir(html);
      return;
    }
    let raf = 0;
    const adim = () => {
      if (!alive) return;
      if (ekle(KARE_BUTCE)) onHazir(html);
      else raf = requestAnimationFrame(adim);
    };
    raf = requestAnimationFrame(adim);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [html]);
  return <div class="kt-body" data-testid="lib-article-body" ref={bodyRef} onClick={onClick} />;
}

/** Koleksiyonun ana sayfa yolunu önbelleğe yazar (okuyucuda başlık için) */
export function anaSayfaKaydet(id: string, path: string) {
  anaSayfaYaz(id, path);
}

// ---------------------------------------------------------------------------
// Sayfada bul
// ---------------------------------------------------------------------------

function clearMarks(root: HTMLElement) {
  const ms = root.querySelectorAll('mark.kt-mark');
  if (!ms.length) return;
  ms.forEach((m) => m.replaceWith(...Array.from(m.childNodes)));
  root.normalize();
}

/** Türkçe/aksan duyarsız eşleşmeleri <mark> ile sarar (en fazla 500). */
function markMatches(root: HTMLElement, q: string): HTMLElement[] {
  const fq = foldCharwise(q.trim());
  if (fq.length < 1) return [];
  const out: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = n.parentElement;
      if (!p || p.closest('[hidden]')) return NodeFilter.FILTER_REJECT;
      return n.nodeValue && n.nodeValue.length >= fq.length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
  for (const node of nodes) {
    if (out.length >= 500) break;
    const text = node.nodeValue!;
    const f = foldCharwise(text);
    let i = f.indexOf(fq);
    if (i < 0) continue;
    const frag = document.createDocumentFragment();
    let last = 0;
    while (i >= 0 && out.length < 500) {
      if (i > last) frag.appendChild(document.createTextNode(text.slice(last, i)));
      const m = document.createElement('mark');
      m.className = 'kt-mark';
      m.textContent = text.slice(i, i + fq.length);
      frag.appendChild(m);
      out.push(m);
      last = i + fq.length;
      i = f.indexOf(fq, last);
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.replaceWith(frag);
  }
  return out;
}

function CSS_escape(s: string) {
  const esc = (globalThis as any).CSS?.escape as ((v: string) => string) | undefined;
  return esc ? esc(s) : s.replace(/["\\]/g, '\\$&');
}
