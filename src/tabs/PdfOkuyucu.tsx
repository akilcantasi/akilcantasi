// Kütüphane: PDF belgelerini uygulamanın içinde açan okuyucu (pdf.js).
//  • Sayfalar ekrana yaklaştıkça çizilir (büyük kitaplarda bellek dostu)
//  • Kitabın içinde arama: Türkçe karakter ve büyük/küçük harf duyarsız, sonuçlar sayfa ve bağlamıyla
//  • Görünen sayfayı Fener ile Türkçeye çevirme (Türkçe olmayan belgelerde)
//  • Yakınlaştırma, sayfa gezinme
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { itemsToText, loadPdfjs, pageParagraphs, searchPages, type PdfHit } from '../lib/pdf';
import { ArticleTranslate, TRANSLATE_CSS, isTurkishLang } from './KutuphaneCeviri';
import { useGeriKapat } from '../gecmis';

const CSS = `
.po { display: flex; flex-direction: column; gap: 10px; }
/* Yapışkan üst çubuk ekrandan uzun olamaz (yoksa altı hiç görünmez): gerekirse kendi içinde kayar.
   vh, yazı boyutu yakınlaştırmasıyla (zoom) büyüdüğü için --ui-scale'e bölünür. */
.po-top { position: sticky; top: 0; z-index: 4; background: var(--bg); padding: 6px 4px 8px; margin: 0 -4px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid var(--line2); max-height: calc(78vh / var(--ui-scale, 1)); overflow-y: auto; overscroll-behavior: contain; }
.po-top > * { flex-shrink: 0; }
/* Dar ekranda / büyük yazıda düğme grupları alt satıra iner (başlık ve arama kutusu ezilmesin) */
.po-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.po-grp { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.po-back { min-width: 44px; min-height: 44px; border-radius: 50%; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); font-size: 20px; flex-shrink: 0; }
.po-title { flex: 1 1 140px; min-width: 0; display: flex; flex-direction: column; }
.po-title b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.po-title span { font-size: 12px; color: var(--muted); }
.po-ib { min-width: 44px; min-height: 44px; border-radius: 12px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); font-size: 15px; font-weight: 600; flex-shrink: 0; }
.po-ib:disabled { opacity: 0.45; }
.po-search { flex: 1 1 120px; min-width: 0; min-height: 44px; border-radius: 999px; border: 1px solid var(--line3); background: var(--card); color: var(--text); padding: 0 14px; font-size: 15px; }
.po-count { font-size: 12.5px; color: var(--text2); white-space: nowrap; min-width: 52px; text-align: center; }
.po-hits { display: flex; flex-direction: column; gap: 4px; max-height: calc(30vh / var(--ui-scale, 1)); overflow-y: auto; }
/* flex-shrink: 0 — yüksekliği sınırlı kaydırma sütununda düğmeler büzülüp yazı taşmasın */
.po-hit { flex-shrink: 0; text-align: left; min-height: 44px; border-radius: 10px; border: 1px solid var(--line2); background: var(--card); color: var(--text2); font-size: 13px; line-height: 1.4; padding: 6px 10px; }
.po-hit.on { border-color: var(--accent); }
.po-hit small { color: var(--accent2); font-weight: 600; margin-right: 6px; }
.po-hit mark { background: rgba(245,165,36,0.35); color: var(--text); border-radius: 3px; padding: 0 1px; }
.po-pages { display: flex; flex-direction: column; gap: 12px; padding: 0 0 20px; overflow-x: auto; overscroll-behavior-x: contain; }
.po-page { position: relative; background: #fff; border-radius: 6px; box-shadow: 0 4px 18px rgba(0,0,0,0.35); flex-shrink: 0; margin-inline: auto; }
.po-page canvas { display: block; width: 100%; height: 100%; border-radius: 6px; }
.po-page .po-pn { position: absolute; right: 8px; bottom: 6px; font-size: 11px; color: #555; background: rgba(255,255,255,0.8); border-radius: 6px; padding: 1px 6px; }
.po-page.hit { outline: 3px solid var(--accent); outline-offset: 2px; }
.po-tr { max-height: calc(34vh / var(--ui-scale, 1)); overflow-y: auto; overscroll-behavior: contain; padding-right: 2px; }
.po-msg { font-size: 14px; color: var(--text2); margin: 0; }
.po-tr-close { align-self: flex-start; }
.po-err { font-size: 14px; color: var(--danger); margin: 0; }
.po-ib.po-nav { font-size: 22px; line-height: 1; }
`;

const ZOOMS = [0.75, 1, 1.25, 1.5, 2, 2.5];
/** Şu anki sayfanın iki yanında tuvali tutulan sayfa sayısı (gerisi bırakılır) */
const KEEP_PAGES = 6;

/** Sayfa kutusundaki tuvali bırakır (tuval belleği boyut sıfırlanınca hemen geri verilir) */
function freeCanvas(el: HTMLElement | null | undefined) {
  el?.querySelectorAll('canvas').forEach((c) => {
    c.width = c.height = 0;
    c.remove();
  });
}

/** pdf.js hatalarını Türkçe iletiye çevirir */
export function pdfErrorText(e: any): string {
  const name = String(e?.name ?? '');
  const msg = String(e?.message ?? e ?? '');
  if (name === 'PasswordException' || /password/i.test(msg)) return 'Belge parolayla korunuyor; bu okuyucu açamıyor. "Başka uygulamada aç" ile deneyin.';
  if (name === 'InvalidPDFException' || /invalid pdf|structure/i.test(msg)) return 'Dosya geçerli bir PDF değil ya da bozuk.';
  if (/bulunamadı/.test(msg)) return msg;
  if (/memory|allocation/i.test(msg)) return 'Belge bu cihazın belleği için çok büyük. "Başka uygulamada aç" ile deneyin.';
  return 'Belge açılamadı. "Başka uygulamada aç" ile deneyebilirsiniz.';
}

export function PdfOkuyucu({
  title,
  sub,
  language,
  docKey,
  load,
  onClose,
}: {
  title: string;
  sub?: string;
  language?: string;
  /** Kaynak + yol: çeviri önbelleği için belgeye özgü anahtar */
  docKey?: string;
  load: () => Promise<Uint8Array | null>;
  onClose: () => void;
}) {
  // Android geri tuşu önce okuyucuyu kapatır (kitap listesine / makaleye döner)
  useGeriKapat(true, onClose);
  const [doc, setDoc] = useState<any>(null);
  const [err, setErr] = useState('');
  const [sizes, setSizes] = useState<{ w: number; h: number }[]>([]);
  const [zoomI, setZoomI] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<PdfHit[] | null>(null);
  const [hitI, setHitI] = useState(0);
  const [scan, setScan] = useState<{ done: number; total: number } | null>(null);
  const [trPage, setTrPage] = useState<{ page: number; paras: string[] } | null>(null);
  const [width, setWidth] = useState(360);
  const texts = useRef<(string | undefined)[]>([]);
  const folded = useRef<(string | undefined)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const pageEls = useRef<(HTMLDivElement | null)[]>([]);
  const rendered = useRef(new Map<number, number>()); // sayfa → çizildiği ölçek
  const tasks = useRef(new Map<number, any>());
  const gens = useRef(new Map<number, number>()); // sayfa → çizim kuşağı (eski çizimler iptal)
  // Gözlemcilerde ve eşzamansız çizimde hep güncel değerler okunsun
  const live = useRef({ doc: null as any, sizes: [] as { w: number; h: number }[], zoom: 1, width: 360, page: 1 });
  const key = docKey ?? title;

  // Belgeyi aç
  useEffect(() => {
    let alive = true;
    let d: any = null;
    (async () => {
      try {
        const data = await load();
        if (!data) throw new Error('Dosya arşivde bulunamadı');
        const pdfjs = await loadPdfjs();
        d = await pdfjs.getDocument({ data, isEvalSupported: false }).promise;
        if (!alive) return void d.destroy();
        // Sayfa boyutları (çizmeden önce yer ayırmak için); ilk sayfanınki hepsine varsayılır, çizerken düzeltilir
        const p1 = await d.getPage(1);
        const v = p1.getViewport({ scale: 1 });
        setSizes(Array.from({ length: d.numPages }, () => ({ w: v.width, h: v.height })));
        texts.current = new Array(d.numPages);
        folded.current = new Array(d.numPages);
        setDoc(d);
      } catch (e: any) {
        if (alive) setErr(pdfErrorText(e));
      }
    })();
    return () => {
      alive = false;
      for (const t of tasks.current.values()) t?.cancel?.();
      for (const el of pageEls.current) freeCanvas(el);
      d?.destroy?.();
    };
  }, []);

  // Genişlik (sayfaları ekrana sığdırmak için)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const upd = () => {
      const w = Math.max(240, el.clientWidth);
      // Ekran döndürülünce de okunan yer korunsun
      if (w !== live.current.width && live.current.doc && rendered.current.size) captureAnchor();
      setWidth(w);
    };
    upd();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(upd) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [doc]);

  const zoom = ZOOMS[zoomI];
  live.current = { doc, sizes, zoom, width, page };
  const scaleFor = (w: number) => ((live.current.width - 4) / (w || 600)) * live.current.zoom;

  /** Sayfanın tuvalini bırakır (bellek) */
  const evict = (n: number) => {
    gens.current.set(n, (gens.current.get(n) ?? 0) + 1);
    tasks.current.get(n)?.cancel?.();
    tasks.current.delete(n);
    rendered.current.delete(n);
    freeCanvas(pageEls.current[n - 1]);
  };

  // Sayfayı çiz (kuşak sayacı: bu arada sayfa bırakıldıysa ya da yeniden istendiyse eski çizim vazgeçer)
  const draw = async (n: number) => {
    const d = live.current.doc;
    const el = pageEls.current[n - 1];
    if (!d || !el) return;
    const want = scaleFor(live.current.sizes[n - 1]?.w);
    if (rendered.current.get(n) === want && el.querySelector('canvas')) return;
    const g = (gens.current.get(n) ?? 0) + 1;
    gens.current.set(n, g);
    const stale = () => gens.current.get(n) !== g;
    try {
      const p = await d.getPage(n);
      if (stale()) return;
      const vp1 = p.getViewport({ scale: 1 });
      const known = live.current.sizes[n - 1];
      if (!known || Math.abs(vp1.width - known.w) > 0.5 || Math.abs(vp1.height - known.h) > 0.5) {
        setSizes((old) => old.map((x, i) => (i === n - 1 ? { w: vp1.width, h: vp1.height } : x)));
      }
      const s = scaleFor(vp1.width); // ölçek sayfanın gerçek genişliğinden
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const vp = p.getViewport({ scale: s * dpr });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      tasks.current.get(n)?.cancel?.();
      const task = p.render({ canvasContext: canvas.getContext('2d')!, viewport: vp });
      tasks.current.set(n, task);
      await task.promise;
      // Bu arada sayfa bırakıldıysa ya da kullanıcı çok uzağa kaydırdıysa tuval eklenmez (bellek)
      if (stale() || Math.abs(n - live.current.page) > KEEP_PAGES + 2) {
        canvas.width = canvas.height = 0;
        if (!stale()) tasks.current.delete(n);
        return;
      }
      freeCanvas(el);
      el.prepend(canvas);
      rendered.current.set(n, s);
      tasks.current.delete(n);
      // Metni de al (arama ve çeviri için)
      if (texts.current[n - 1] === undefined) texts.current[n - 1] = itemsToText((await p.getTextContent()).items);
    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') rendered.current.delete(n);
    }
  };

  // Ekrana yaklaşan sayfaları çiz, uzaklaşanları boşalt (bellek)
  useEffect(() => {
    if (!doc || typeof IntersectionObserver === 'undefined') return;
    const near = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          const n = Number((e.target as HTMLElement).dataset.page);
          if (e.isIntersecting) void draw(n);
          else if (Math.abs(n - live.current.page) > KEEP_PAGES) evict(n);
        }
      },
      { rootMargin: '900px 0px' },
    );
    pageEls.current.forEach((el) => el && near.observe(el));
    return () => near.disconnect();
  }, [doc, sizes.length]);

  // "Şu anki sayfa": yapışkan çubuğun altında kalan görünür alanın üst üçte birini kesen sayfa.
  // (Ekranın ortası değil: arama sonuçları / çeviri açıkken çubuk ekranın ortasını örtüyor,
  // sonuca gidilen sayfa çubuğun hemen altında olduğu hâlde önceki sayfa "şu anki" sayılıyordu.)
  useEffect(() => {
    const main = document.getElementById('main');
    if (!doc || !main) return;
    let raf = 0;
    const upd = () => {
      raf = 0;
      const els = pageEls.current;
      if (!els.length) return;
      const top = readLine();
      const bottom = Math.min(window.innerHeight, main.getBoundingClientRect().bottom);
      const line = top + Math.max(0, bottom - top) * 0.35;
      // İkili arama: üst kenarı çizginin üstünde kalan son sayfa (400 sayfada ~9 ölçüm)
      let lo = 0;
      let hi = els.length - 1;
      let at = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const el = els[mid];
        if (el && el.getBoundingClientRect().top <= line) {
          at = mid;
          lo = mid + 1;
        } else hi = mid - 1;
      }
      setPage(at + 1);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(upd);
    };
    main.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    on();
    return () => {
      main.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [doc, sizes.length]);

  // Şu anki sayfadan uzak tuvalleri bırak. Gözlemci tek başına yetmiyor: hızlı kaydırmada sayfa
  // yakın bölgeden çıktığı anda "şu anki sayfa" henüz güncellenmemiş olabiliyor ve o tuval bir daha
  // hiç bırakılmıyordu (400 sayfalık belgede 70'ten çok tuval, yüzlerce MB bellek).
  useEffect(() => {
    if (!doc) return;
    const held = new Set<number>([...rendered.current.keys(), ...tasks.current.keys()]);
    for (const n of held) if (Math.abs(n - page) > KEEP_PAGES) evict(n);
    // Hızlı kaydırmada atlanmış olabilecek yakın sayfaları çiz (çizilmişse draw bir şey yapmaz)
    for (let n = Math.max(1, page - 1); n <= Math.min(sizes.length, page + 1); n++) void draw(n);
  }, [page, doc]);

  /** Sayfaların okunduğu çizgi: kaydırma kabının üstü + yapışkan çubuğun yüksekliği */
  const readLine = () => {
    const main = document.getElementById('main');
    return (main?.getBoundingClientRect().top ?? 0) + (topRef.current?.getBoundingClientRect().height ?? 0);
  };
  /**
   * n. sayfayı (frac: sayfa içindeki konum, 0..1) yapışkan çubuğun hemen altına getirir.
   * scrollIntoView yerine: o, sayfa üstünü yapışkan çubuğun altında bırakıyor ve iç kap sonuna
   * varınca kaydırmayı dış kaplara (belgeye) taşıyıp uygulama başlığını ekrandan itebiliyordu.
   */
  const scrollToPage = (n: number, frac = 0) => {
    const main = document.getElementById('main');
    const el = pageEls.current[n - 1];
    if (!main || !el) return;
    const r = el.getBoundingClientRect();
    main.scrollTop += r.top + frac * r.height - readLine() - (frac ? 0 : 8);
  };

  // Yakınlaştırmada okunan yer korunur: sayfa ve sayfa içindeki konum, değişimden önce alınır
  const anchor = useRef<{ n: number; frac: number } | null>(null);
  const captureAnchor = () => {
    const n = live.current.page;
    const el = pageEls.current[n - 1];
    if (!el) return;
    const r = el.getBoundingClientRect();
    anchor.current = { n, frac: Math.min(1, Math.max(0, (readLine() - r.top) / (r.height || 1))) };
  };
  const zoomTo = (i: number) => {
    captureAnchor();
    setZoomI(i);
  };
  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    if (a) scrollToPage(a.n, a.frac);
  }, [zoomI, width]);

  // Yakınlaştırma ya da genişlik değişince: tüm tuvalleri bırak, görünenleri yeniden çiz
  useEffect(() => {
    if (!doc) return;
    for (let n = 1; n <= sizes.length; n++) if (rendered.current.has(n) || pageEls.current[n - 1]?.querySelector('canvas')) evict(n);
    for (let n = Math.max(1, page - 2); n <= Math.min(sizes.length, page + 2); n++) void draw(n);
  }, [zoomI, width]);

  const goTo = (n: number) => {
    scrollToPage(n);
    void draw(n);
  };

  // Kitapta ara: metni henüz alınmamış sayfaları sırayla tarar
  useEffect(() => {
    if (!doc) return;
    const q = query.trim();
    setHitI(0);
    if (q.length < 2) {
      setHits(null);
      setScan(null);
      return;
    }
    let alive = true;
    const t = setTimeout(async () => {
      const total = doc.numPages;
      let done = texts.current.filter((x) => x !== undefined).length;
      setHits(searchPages(texts.current, q, 200, folded.current));
      for (let n = 1; n <= total && alive; n++) {
        if (texts.current[n - 1] !== undefined) continue;
        try {
          const p = await doc.getPage(n);
          texts.current[n - 1] = itemsToText((await p.getTextContent()).items);
        } catch {
          texts.current[n - 1] = '';
        }
        done++;
        if (done % 8 === 0 || done === total) {
          if (!alive) return;
          setScan({ done, total });
          setHits(searchPages(texts.current, q, 200, folded.current));
        }
      }
      if (!alive) return;
      setScan(null);
      setHits(searchPages(texts.current, q, 200, folded.current));
    }, 300);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query, doc]);

  const curHit = hits && hits.length ? hits[Math.min(hitI, hits.length - 1)] : null;
  const stepHit = (d: number) => {
    if (!hits?.length) return;
    const i = (hitI + d + hits.length) % hits.length;
    setHitI(i);
    goTo(hits[i].page);
  };

  const translateHere = async () => {
    const at = page;
    let text = texts.current[at - 1];
    try {
      if (text === undefined && doc) {
        const p = await doc.getPage(at);
        text = texts.current[at - 1] = itemsToText((await p.getTextContent()).items);
      }
    } catch {
      text = '';
    }
    setTrPage({ page: at, paras: pageParagraphs(text ?? '') });
  };

  const canTranslate = !isTurkishLang(language);
  const hitPages = useMemo(() => new Set((hits ?? []).map((h) => h.page)), [hits]);

  return (
    <div class="po" data-testid="pdf-reader" ref={wrap}>
      <style>{CSS + TRANSLATE_CSS}</style>
      <div class="po-top" ref={topRef}>
        <div class="po-row">
          <button class="po-back" aria-label="Geri" data-testid="pdf-back" onClick={onClose}>
            ←
          </button>
          <div class="po-title">
            <b>{title}</b>
            <span data-testid="pdf-page">
              {sub ? sub + ' · ' : ''}
              {doc ? `sayfa ${page} / ${doc.numPages}` : 'açılıyor…'}
            </span>
          </div>
          <span class="po-grp">
            <button class="po-ib po-nav" aria-label="Uzaklaştır" data-testid="pdf-zoom-out" disabled={zoomI === 0} onClick={() => zoomTo(zoomI - 1)}>
              −
            </button>
            <button class="po-ib po-nav" aria-label="Yakınlaştır" data-testid="pdf-zoom-in" disabled={zoomI === ZOOMS.length - 1} onClick={() => zoomTo(zoomI + 1)}>
              +
            </button>
          </span>
        </div>
        <div class="po-row">
          <input
            class="po-search"
            type="search"
            placeholder="Bu kitapta ara…"
            aria-label="Bu kitapta ara"
            data-testid="pdf-search"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && stepHit(e.shiftKey ? -1 : 1)}
            disabled={!doc}
          />
          {hits && (
            <span class="po-grp">
              <span class="po-count" data-testid="pdf-count" aria-live="polite">
                {hits.length ? `${Math.min(hitI, hits.length - 1) + 1} / ${hits.length}${scan ? '+' : ''}` : scan ? 'aranıyor…' : 'yok'}
              </span>
              <button class="po-ib po-nav" aria-label="Önceki sonuç" data-testid="pdf-prev" disabled={!hits.length} onClick={() => stepHit(-1)}>
                ‹
              </button>
              <button class="po-ib po-nav" aria-label="Sonraki sonuç" data-testid="pdf-next" disabled={!hits.length} onClick={() => stepHit(1)}>
                ›
              </button>
            </span>
          )}
        </div>
        {scan && (
          <p class="po-msg" data-testid="pdf-scan">
            Kitap taranıyor: {scan.done} / {scan.total} sayfa
          </p>
        )}
        {/* Çeviri açıkken sonuç listesi gizlenir (ikisi birlikte küçük ekranı kaplıyordu); ‹ › ile gezinme sürer */}
        {hits && hits.length > 0 && !trPage && (
          <div class="po-hits" data-testid="pdf-hits">
            {hits.slice(0, 50).map((h, i) => (
              <button
                key={h.page + ':' + h.at}
                class={'po-hit' + (h === curHit ? ' on' : '')}
                data-testid="pdf-hit"
                onClick={() => {
                  setHitI(i);
                  goTo(h.page);
                }}
              >
                <small>s. {h.page}</small>…{h.before}
                <mark>{h.match}</mark>
                {h.after}…
              </button>
            ))}
            {hits.length > 50 && <p class="po-msg">İlk 50 sonuç gösteriliyor; ‹ › ile hepsinde gezinebilirsiniz.</p>}
          </div>
        )}
        {doc && canTranslate && !trPage && (
          <button class="btn tr-btn" data-testid="pdf-translate" onClick={translateHere}>
            Bu sayfayı Türkçeye çevir (s. {page})
          </button>
        )}
        {trPage && (
          // Üst çubukta kalır: hangi sayfada olunursa olunsun çeviri görünür, kendi içinde kayar.
          // "Çeviriyi kapat" kayan kutunun dışında: uzun çeviride de hep görünür.
          <>
            <div class="po-tr" data-testid="pdf-translation-box">
              {trPage.paras.length ? (
                <ArticleTranslate
                  key={'pdf:' + key + ':' + trPage.page}
                  refStr={'pdf:' + key + ':' + trPage.page}
                  paragraphs={trPage.paras}
                  language={language ?? 'eng'}
                  label={`Sayfa ${trPage.page}: Türkçeye çevir`}
                  autoStart
                />
              ) : (
                <p class="po-msg">Bu sayfada çevrilecek metin yok (taranmış resim olabilir).</p>
              )}
            </div>
            <button class="btn po-tr-close" data-testid="pdf-translate-close" onClick={() => setTrPage(null)}>
              Çeviriyi kapat
            </button>
          </>
        )}
      </div>

      {err && (
        <p class="po-err" role="alert" data-testid="pdf-error">
          {err}
        </p>
      )}
      {!doc && !err && <p class="po-msg">Belge açılıyor…</p>}

      {doc && (
        <div class="po-pages" data-testid="pdf-pages">
          {sizes.map((s, i) => {
            const sc = scaleFor(s.w);
            return (
              <div
                key={i}
                class={'po-page' + (curHit && curHit.page === i + 1 ? ' hit' : '')}
                data-page={i + 1}
                data-hit={hitPages.has(i + 1) ? '1' : undefined}
                ref={(el) => {
                  pageEls.current[i] = el;
                }}
                style={{ width: Math.round(s.w * sc) + 'px', height: Math.round(s.h * sc) + 'px' }}
              >
                <span class="po-pn">{i + 1}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
