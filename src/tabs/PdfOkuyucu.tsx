// Kütüphane: PDF belgelerini uygulamanın içinde açan okuyucu (pdf.js).
//  • Sayfalar ekrana yaklaştıkça çizilir (büyük kitaplarda bellek dostu)
//  • Kitabın içinde arama: Türkçe karakter ve büyük/küçük harf duyarsız, sonuçlar sayfa ve bağlamıyla
//  • Görünen sayfayı Fener ile Türkçeye çevirme (Türkçe olmayan belgelerde)
//  • Yakınlaştırma, sayfa gezinme
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { itemsToText, loadPdfjs, pageParagraphs, searchPages, type PdfHit } from '../lib/pdf';
import { ArticleTranslate, TRANSLATE_CSS, isTurkishLang } from './KutuphaneCeviri';

const CSS = `
.po { display: flex; flex-direction: column; gap: 10px; }
.po-top { position: sticky; top: 0; z-index: 4; background: var(--bg); padding: 6px 0 8px; display: flex; flex-direction: column; gap: 8px; border-bottom: 1px solid var(--line2); }
.po-row { display: flex; align-items: center; gap: 8px; }
.po-back { min-width: 44px; min-height: 44px; border-radius: 50%; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); font-size: 20px; flex-shrink: 0; }
.po-title { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.po-title b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.po-title span { font-size: 12px; color: var(--muted); }
.po-ib { min-width: 44px; min-height: 44px; border-radius: 12px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); font-size: 15px; font-weight: 600; flex-shrink: 0; }
.po-ib:disabled { opacity: 0.45; }
.po-search { flex: 1; min-width: 0; min-height: 44px; border-radius: 999px; border: 1px solid var(--line3); background: var(--card); color: var(--text); padding: 0 14px; font-size: 15px; }
.po-count { font-size: 12.5px; color: var(--text2); white-space: nowrap; min-width: 52px; text-align: center; }
.po-hits { display: flex; flex-direction: column; gap: 4px; max-height: 34vh; overflow-y: auto; }
.po-hit { text-align: left; min-height: 44px; border-radius: 10px; border: 1px solid var(--line2); background: var(--card); color: var(--text2); font-size: 13px; line-height: 1.4; padding: 6px 10px; }
.po-hit.on { border-color: var(--accent); }
.po-hit small { color: var(--accent2); font-weight: 600; margin-right: 6px; }
.po-hit mark { background: rgba(245,165,36,0.35); color: var(--text); border-radius: 3px; padding: 0 1px; }
.po-pages { display: flex; flex-direction: column; align-items: center; gap: 12px; padding-bottom: 20px; }
.po-page { position: relative; background: #fff; border-radius: 6px; box-shadow: 0 4px 18px rgba(0,0,0,0.35); max-width: 100%; }
.po-page canvas { display: block; width: 100%; height: 100%; border-radius: 6px; }
.po-page .po-pn { position: absolute; right: 8px; bottom: 6px; font-size: 11px; color: #555; background: rgba(255,255,255,0.8); border-radius: 6px; padding: 1px 6px; }
.po-page.hit { outline: 3px solid var(--accent); outline-offset: 2px; }
.po-msg { font-size: 14px; color: var(--text2); margin: 0; }
.po-err { font-size: 14px; color: #ffb4a8; margin: 0; }
`;

const ZOOMS = [0.75, 1, 1.25, 1.5, 2, 2.5];

export function PdfOkuyucu({ title, sub, language, load, onClose }: { title: string; sub?: string; language?: string; load: () => Promise<Uint8Array | null>; onClose: () => void }) {
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
  const wrap = useRef<HTMLDivElement>(null);
  const pageEls = useRef<(HTMLDivElement | null)[]>([]);
  const rendered = useRef(new Map<number, number>()); // sayfa → çizildiği ölçek
  const tasks = useRef(new Map<number, any>());

  // Belgeyi aç
  useEffect(() => {
    let alive = true;
    let d: any = null;
    (async () => {
      try {
        const data = await load();
        if (!data) throw new Error('Dosya arşivde bulunamadı');
        const pdfjs = await loadPdfjs();
        d = await pdfjs.getDocument({ data, isEvalSupported: false, disableFontFace: false }).promise;
        if (!alive) return void d.destroy();
        // Sayfa boyutları (çizmeden önce yer ayırmak için); ilk sayfanınki hepsine varsayılır, sonra düzeltilir
        const p1 = await d.getPage(1);
        const v = p1.getViewport({ scale: 1 });
        setSizes(Array.from({ length: d.numPages }, () => ({ w: v.width, h: v.height })));
        texts.current = new Array(d.numPages);
        setDoc(d);
      } catch (e: any) {
        if (alive) setErr(e?.message || 'PDF açılamadı');
      }
    })();
    return () => {
      alive = false;
      for (const t of tasks.current.values()) t?.cancel?.();
      d?.destroy?.();
    };
  }, []);

  // Genişlik (sayfaları ekrana sığdırmak için)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const upd = () => setWidth(Math.max(240, el.clientWidth));
    upd();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(upd) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [doc]);

  const zoom = ZOOMS[zoomI];
  const scaleFor = (i: number) => ((width - 4) / (sizes[i]?.w || 600)) * zoom;

  // Sayfayı çiz
  const draw = async (n: number) => {
    if (!doc) return;
    const el = pageEls.current[n - 1];
    if (!el) return;
    const s = scaleFor(n - 1);
    if (rendered.current.get(n) === s) return;
    rendered.current.set(n, s);
    try {
      const p = await doc.getPage(n);
      const vp1 = p.getViewport({ scale: 1 });
      if (Math.abs(vp1.width - sizes[n - 1].w) > 0.5 || Math.abs(vp1.height - sizes[n - 1].h) > 0.5) {
        setSizes((old) => old.map((x, i) => (i === n - 1 ? { w: vp1.width, h: vp1.height } : x)));
      }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const vp = p.getViewport({ scale: s * dpr });
      let canvas = el.querySelector('canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        el.prepend(canvas);
      }
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      tasks.current.get(n)?.cancel?.();
      const task = p.render({ canvasContext: canvas.getContext('2d')!, viewport: vp });
      tasks.current.set(n, task);
      await task.promise;
      // Metni de al (arama ve çeviri için)
      if (texts.current[n - 1] === undefined) texts.current[n - 1] = itemsToText((await p.getTextContent()).items);
    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') rendered.current.delete(n);
    }
  };

  // Ekrana yaklaşan sayfaları çiz, uzaklaşanları boşalt (bellek); görünen sayfayı izle
  useEffect(() => {
    if (!doc || typeof IntersectionObserver === 'undefined') return;
    const near = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          const n = Number((e.target as HTMLElement).dataset.page);
          if (e.isIntersecting) void draw(n);
          else if (rendered.current.has(n) && Math.abs(n - page) > 6) {
            tasks.current.get(n)?.cancel?.();
            rendered.current.delete(n);
            (e.target as HTMLElement).querySelector('canvas')?.remove();
          }
        }
      },
      { rootMargin: '900px 0px' },
    );
    const vis = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setPage(Number((e.target as HTMLElement).dataset.page));
      },
      { threshold: 0.5 },
    );
    pageEls.current.forEach((el) => el && (near.observe(el), vis.observe(el)));
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, [doc, sizes.length, zoomI, width]);

  // Yakınlaştırma ya da genişlik değişince yeniden çiz
  useEffect(() => {
    rendered.current.clear();
    for (let n = Math.max(1, page - 2); n <= Math.min(sizes.length, page + 2); n++) void draw(n);
  }, [zoomI, width]);

  const goTo = (n: number) => {
    const el = pageEls.current[n - 1];
    el?.scrollIntoView({ block: 'start' });
    void draw(n);
  };

  // Kitapta ara: metni henüz alınmamış sayfaları sırayla tarar
  useEffect(() => {
    if (!doc) return;
    const q = query.trim();
    if (q.length < 2) {
      setHits(null);
      setScan(null);
      return;
    }
    let alive = true;
    const t = setTimeout(async () => {
      const total = doc.numPages;
      let done = texts.current.filter((x) => x !== undefined).length;
      setHits(searchPages(texts.current, q));
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
          setHits(searchPages(texts.current, q));
        }
      }
      if (!alive) return;
      setScan(null);
      setHits(searchPages(texts.current, q));
      setHitI(0);
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
    let text = texts.current[page - 1];
    if (text === undefined && doc) {
      const p = await doc.getPage(page);
      text = texts.current[page - 1] = itemsToText((await p.getTextContent()).items);
    }
    setTrPage({ page, paras: pageParagraphs(text ?? '') });
  };

  const canTranslate = !isTurkishLang(language);
  const hitPages = useMemo(() => new Set((hits ?? []).map((h) => h.page)), [hits]);

  return (
    <div class="po" data-testid="pdf-reader" ref={wrap}>
      <style>{CSS + TRANSLATE_CSS}</style>
      <div class="po-top">
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
          <button class="po-ib" aria-label="Uzaklaştır" disabled={zoomI === 0} onClick={() => setZoomI(zoomI - 1)}>
            −
          </button>
          <button class="po-ib" aria-label="Yakınlaştır" disabled={zoomI === ZOOMS.length - 1} onClick={() => setZoomI(zoomI + 1)}>
            +
          </button>
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
            <>
              <span class="po-count" data-testid="pdf-count" aria-live="polite">
                {hits.length ? `${Math.min(hitI, hits.length - 1) + 1} / ${hits.length}${scan ? '+' : ''}` : scan ? 'aranıyor…' : 'yok'}
              </span>
              <button class="po-ib" aria-label="Önceki sonuç" disabled={!hits.length} onClick={() => stepHit(-1)}>
                ‹
              </button>
              <button class="po-ib" aria-label="Sonraki sonuç" disabled={!hits.length} onClick={() => stepHit(1)}>
                ›
              </button>
            </>
          )}
        </div>
        {scan && (
          <p class="po-msg" data-testid="pdf-scan">
            Kitap taranıyor: {scan.done} / {scan.total} sayfa
          </p>
        )}
        {hits && hits.length > 0 && (
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
      </div>

      {trPage && (
        <div>
          {trPage.paras.length ? (
            <ArticleTranslate key={'pdf:' + title + ':' + trPage.page} refStr={'pdf:' + title + ':' + trPage.page} paragraphs={trPage.paras} language={language ?? 'eng'} label={`Sayfa ${trPage.page}: Türkçeye çevir`} />
          ) : (
            <p class="po-msg">Bu sayfada çevrilecek metin yok (taranmış resim olabilir).</p>
          )}
          <button class="btn" style="margin-top:8px" data-testid="pdf-translate-close" onClick={() => setTrPage(null)}>
            Çeviriyi kapat
          </button>
        </div>
      )}

      {err && (
        <p class="po-err" role="alert" data-testid="pdf-error">
          PDF açılamadı: {err}
        </p>
      )}
      {!doc && !err && <p class="po-msg">Belge açılıyor…</p>}

      {doc && (
        <div class="po-pages" data-testid="pdf-pages">
          {sizes.map((s, i) => {
            const sc = scaleFor(i);
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
