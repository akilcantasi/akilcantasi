// Kütüphane: Türkçe olmayan makaleyi cihazdaki Fener modeliyle Türkçeye çevirir.
// Çeviri parça parça, akış halinde ekrana gelir; durdurulabilir. Sonuç oturum boyunca saklanır.
import { useEffect, useRef, useState } from 'preact/hooks';
import { extractParagraphs } from '../lib/zim';
import { engine, pickModel, describeError } from '../lib/fener/engine';
import { cleanTranslation, planChunks, translateMessages } from '../lib/fener/translate';
import { go } from '../lib/store';

export const TRANSLATE_CSS = `
.tr-box { display: flex; flex-direction: column; gap: 10px; background: rgba(245, 165, 36, 0.07); border: 1px solid rgba(245, 165, 36, 0.35); border-radius: 18px; padding: 14px; }
.tr-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.tr-head b { font-size: 15px; flex: 1; min-width: 160px; }
.tr-head .btn { min-height: 40px; font-size: 13px; }
.tr-warn { margin: 0; font-size: 12.5px; color: var(--muted); line-height: 1.45; }
.tr-body p { margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: var(--text); white-space: pre-wrap; }
.tr-body p.wait { color: var(--muted); }
.tr-progress { font-size: 12.5px; color: var(--muted); }
.tr-btn { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; }
`;

type Para = { src: string; tr: string; done: boolean };
type St =
  | { k: 'idle' }
  | { k: 'nomodel' }
  | { k: 'loading'; progress: number | null }
  | { k: 'run'; i: number }
  | { k: 'done'; stopped: boolean }
  | { k: 'error'; msg: string };

/** Oturum içi önbellek: aynı makale ikinci kez çevrilmez */
const cache = new Map<string, { paras: Para[]; truncated: boolean }>();

export function isTurkishLang(lang: string | undefined): boolean {
  return /^(tur|tr)\b/i.test((lang ?? '').trim());
}

/** html (makale) ya da paragraphs (ör. PDF sayfası metni) verilir */
export function ArticleTranslate({
  refStr,
  html,
  paragraphs,
  language,
  label = 'Türkçeye çevir (Fener)',
  autoStart = false,
}: {
  refStr: string;
  html?: string;
  paragraphs?: string[];
  language: string;
  label?: string;
  /** Düğmeyi beklemeden hemen çevirmeye başla (kullanıcı zaten "çevir" dedi) */
  autoStart?: boolean;
}) {
  const cached = cache.get(refStr);
  const [paras, setParas] = useState<Para[]>(cached?.paras ?? []);
  const [truncated, setTruncated] = useState(cached?.truncated ?? false);
  const [st, setSt] = useState<St>(cached ? { k: 'done', stopped: false } : { k: 'idle' });
  const [shown, setShown] = useState(!!cached);
  const abort = useRef<AbortController | null>(null);

  const runRef = useRef<(() => Promise<void>) | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (autoStart && !cached) void runRef.current?.();
  }, []);

  if (isTurkishLang(language)) return null;

  const run = async () => {
    setShown(true);
    if (engine.getState().status === 'generating') {
      setSt({ k: 'error', msg: "Fener şu anda başka bir cevap yazıyor. Bitince tekrar deneyin." });
      return;
    }
    let model;
    try {
      model = await pickModel();
    } catch {
      model = null;
    }
    if (!model) return setSt({ k: 'nomodel' });

    const { chunks, truncated: tr } = planChunks(paragraphs ?? extractParagraphs(html ?? '', 100000));
    if (!chunks.length) return setSt({ k: 'error', msg: 'Bu sayfada çevrilecek metin bulunamadı.' });
    setTruncated(tr);
    let list: Para[] = chunks.map((c) => ({ src: c, tr: '', done: false }));
    setParas(list);

    const ctl = new AbortController();
    abort.current = ctl;
    try {
      setSt({ k: 'loading', progress: 0 });
      await engine.ensureLoaded(model, (f) => setSt({ k: 'loading', progress: f }));
      for (let i = 0; i < list.length; i++) {
        if (ctl.signal.aborted) break;
        setSt({ k: 'run', i });
        const res = await engine.chat(translateMessages(list[i].src), {
          signal: ctl.signal,
          maxTokens: Math.min(1100, Math.ceil(list[i].src.length * 0.9) + 60),
          onToken: (_p, full) => {
            list = list.map((x, j) => (j === i ? { ...x, tr: full } : x));
            setParas(list);
          },
        });
        list = list.map((x, j) => (j === i ? { ...x, tr: cleanTranslation(res.text), done: !res.aborted } : x));
        setParas(list);
        if (res.aborted) break;
      }
      const stopped = ctl.signal.aborted;
      setSt({ k: 'done', stopped });
      if (!stopped) cache.set(refStr, { paras: list, truncated: tr });
    } catch (e) {
      setSt({ k: 'error', msg: describeError(e) });
    } finally {
      abort.current = null;
    }
  };

  runRef.current = run;
  const busy = st.k === 'loading' || st.k === 'run';

  if (!shown)
    return (
      <button class="btn tr-btn" data-testid="lib-translate" onClick={run}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 5h8M8 3v2M10 5c0 4-3 7-6 8M6 9c1 2 3 3.5 5 4" />
          <path d="M13 21l4-9 4 9M14.5 18h5" />
        </svg>
        {label}
      </button>
    );

  return (
    <section class="tr-box" aria-labelledby="tr-title" data-testid="lib-translation" data-state={st.k}>
      <div class="tr-head">
        <b id="tr-title">Türkçe çeviri</b>
        {busy ? (
          <button class="btn" data-testid="lib-translate-stop" onClick={() => abort.current?.abort()}>
            Durdur
          </button>
        ) : st.k === 'done' && st.stopped ? (
          <button class="btn" data-testid="lib-translate" onClick={run}>
            Baştan çevir
          </button>
        ) : null}
        <button class="btn" data-testid="lib-translate-hide" onClick={() => (busy ? (abort.current?.abort(), setShown(false)) : setShown(false))}>
          Gizle
        </button>
      </div>

      {st.k === 'nomodel' && (
        <>
          <p class="tr-warn">Çeviri için cihazda bir Fener modeli olmalı. Modeli bir kez indirin; çeviri sonra internetsiz çalışır.</p>
          <button class="btn primary tr-btn" data-testid="lib-translate-getmodel" onClick={() => go.tool('paylas')}>
            Fener modeli indir
          </button>
        </>
      )}
      {st.k === 'error' && <p class="tr-warn" style="color:var(--danger)">{st.msg}</p>}
      {st.k === 'loading' && (
        <p class="tr-progress" data-testid="lib-translate-loading">
          Fener hazırlanıyor{st.progress != null ? ` · %${Math.round(st.progress * 100)}` : '…'}
        </p>
      )}
      {st.k === 'run' && (
        <p class="tr-progress">
          Çevriliyor · {st.i + 1} / {paras.length} bölüm
        </p>
      )}

      {paras.some((p) => p.tr) && (
        <div class="tr-body" lang="tr" data-testid="lib-translation-text">
          {paras.map((p, i) => (p.tr ? <p key={i}>{p.tr}</p> : st.k === 'run' && i === st.i ? <p key={i} class="wait">…</p> : null))}
        </div>
      )}
      {truncated && st.k === 'done' && <p class="tr-warn">Makale çok uzun; yalnızca ilk bölümleri çevrildi.</p>}
      {(paras.length > 0 || busy) && (
        <p class="tr-warn">
          Bu, cihazdaki yapay zekânın yaptığı bir makine çevirisidir ve hata içerebilir. İlaç adlarını, dozları ve sayıları aşağıdaki orijinal metinden
          kontrol edin.
        </p>
      )}
    </section>
  );
}
