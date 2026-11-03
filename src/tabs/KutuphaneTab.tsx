// Kütüphane sekmesi: cihazdaki (ya da bağlı sunucudaki) tüm ZIM paketlerinde
// (Vikipedi, WikiMed, Vikikitap, Vikisözlük, Vikigezgin, Gutenberg…)
// çevrimdışı başlık + tam metin araması ve makale okuyucu.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { useAppState, go, setState } from '../lib/store';
import {
  getLibraries,
  getLibraryError,
  searchLibrary,
  searchLibraryText,
  randomLibraryArticle,
  resolveRef,
  makeRef,
  type LibrarySource,
  type LibraryHit,
  type LibraryTextHit,
} from '../lib/library';
import { extractParagraphs, foldCharwise } from '../lib/zim';
import { formatSize } from '../lib/packs';
import { IconBook, IconChat } from '../icons';
import { sanitize } from '../lib/sanitize';
import { loadNautilus, type NautilusBook } from '../lib/zim/nautilus';
import { LibraryStore, MAGAZA_CSS } from './KutuphaneMagaza';
import { ArticleTranslate, TRANSLATE_CSS } from './KutuphaneCeviri';
import { PdfOkuyucu } from './PdfOkuyucu';

const CSS_BASE = `
.kt-meta { display: flex; flex-direction: column; gap: 6px; }
.kt-meta-top { display: flex; align-items: center; gap: 10px; }
.kt-meta-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--bg2); border: 1px solid var(--line2); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
.kt-meta-title { font-size: 16px; font-weight: 600; line-height: 1.3; }
.kt-meta-desc { font-size: 13px; color: var(--muted); line-height: 1.4; margin: 0; }
.kt-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.kt-srclist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.kt-srcrow { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; border-top: 1px solid var(--line2); }
.kt-srcrow:first-child { border-top: none; padding-top: 0; }
.kt-srcrow-top { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.kt-srcrow-name { font-weight: 600; font-size: 15px; }
.kt-srcrow-sub { font-size: 12px; color: var(--muted); }
.kt-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; margin: 0 -18px; padding-left: 18px; padding-right: 18px; }
.kt-chips::-webkit-scrollbar { display: none; }
.kt-chips .chip { min-height: 44px; display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; }
.kt-chip-n { font-family: var(--mono); font-size: 11px; opacity: 0.75; }
/* Rafım: yüklü kaynaklar kapak kutucukları olarak (dokununca arama o kaynakla sınırlanır) */
.kt-covers { gap: 10px; }
.kt-covers .chip { min-height: 76px; width: 108px; flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: 2px; border-radius: 14px; padding: 10px 11px; white-space: normal; text-align: left; font-size: 13.5px; font-weight: 600; line-height: 1.2; color: #fff; border: 1px solid rgba(255,255,255,0.1); background: linear-gradient(160deg, #2f4a72, #22385a); }
.kt-covers .chip:nth-child(5n+2) { background: linear-gradient(160deg, #1f5f5b, #174845); }
.kt-covers .chip:nth-child(5n+3) { background: linear-gradient(160deg, #7a3b2e, #5c2c22); }
.kt-covers .chip:nth-child(5n+4) { background: linear-gradient(160deg, #3d5a3a, #2c432a); }
.kt-covers .chip:nth-child(5n) { background: linear-gradient(160deg, #6b4c8a, #4f3866); }
.kt-covers .chip:first-child { background: linear-gradient(160deg, rgba(245,165,36,0.28), rgba(245,165,36,0.1)); color: var(--text); }
.kt-covers .chip[aria-pressed='true'] { outline: 2px solid var(--accent); outline-offset: 2px; }
.kt-covers .kt-chip-n { font-family: inherit; font-size: 11px; font-weight: 500; opacity: 0.85; }
.kt-field { display: flex; flex-direction: column; gap: 8px; }
.kt-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.kt-actions .btn { display: inline-flex; align-items: center; gap: 8px; }
.kt-results { display: flex; flex-direction: column; gap: 8px; list-style: none; margin: 0; padding: 0; }
.kt-hit-title { font-size: 15px; font-weight: 600; line-height: 1.3; }
.kt-hit-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
.kt-hit-src { font-size: 11px; padding: 2px 6px; }
.kt-hit-fuzzy { font-size: 11px; padding: 2px 6px; color: var(--accent); }
.kt-section { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px; }
.kt-hist { display: flex; flex-wrap: wrap; gap: 8px; }
.kt-hist .chip { min-height: 44px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.kt-back { min-height: 44px; background: var(--glass); border: 1px solid var(--glass-line); border-radius: 999px; color: var(--accent2); font-size: 14px; font-weight: 500; padding: 0 14px; text-align: left; }
.kt-bar { position: sticky; top: 0; z-index: 5; background: var(--bg); display: flex; flex-direction: column; gap: 8px; padding: 8px 18px; margin: -14px -18px 0; border-bottom: 1px solid var(--line); }
.kt-bar-row { display: flex; align-items: center; gap: 6px; }
.kt-ibtn { min-width: 44px; min-height: 44px; border-radius: 999px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); display: inline-flex; align-items: center; justify-content: center; padding: 0 10px; font-size: 14px; font-weight: 600; }
.kt-ibtn:disabled { opacity: 0.35; }
.kt-ibtn[aria-pressed='true'] { border-color: var(--accent); color: var(--accent); }
.kt-find { display: flex; align-items: center; gap: 6px; }
.kt-find .input { height: 44px; }
.kt-find-n { font-family: var(--mono); font-size: 12px; color: var(--muted); min-width: 52px; text-align: center; }
.kt-title { font-size: 26px; font-weight: 600; line-height: 1.25; margin: 0; letter-spacing: -0.01em; }
.kt-ask { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; }
.kt-hero { display: flex; flex-direction: column; gap: 6px; padding: 4px 2px; }
.kt-hero h2 { margin: 0; font-size: 22px; font-weight: 600; }
.kt-hero p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--text2); }
.kt-manage { color: var(--accent2); font-weight: 500; }
.kt-store { margin-top: 10px; padding-top: 16px; border-top: 1px solid var(--line2); }
.kt-store-top { margin-top: 0; padding-top: 0; border-top: 0; }
.kt-body { font-size: 16px; line-height: 1.6; color: var(--text2); overflow-wrap: anywhere; }
.kt-body.kt-size-1 { font-size: 18.5px; }
.kt-body.kt-size-2 { font-size: 21px; line-height: 1.65; }
.kt-body > :first-child { margin-top: 0; }
.kt-body p { margin: 0 0 12px; }
.kt-body h1 { display: none; }
.kt-body h2, .kt-body h3, .kt-body h4 { color: var(--text); line-height: 1.3; margin: 22px 0 8px; }
.kt-body h2 { font-size: 1.2em; padding-bottom: 6px; border-bottom: 1px solid var(--line2); }
.kt-body h3 { font-size: 1.07em; }
.kt-body h4 { font-size: 0.95em; }
.kt-body a { color: var(--accent2); text-decoration: none; }
.kt-body a[data-ext] { color: var(--blue); }
.kt-body a:not([href]) { color: inherit; }
.kt-file, .kt-books { display: flex; flex-direction: column; gap: 10px; }
.kt-book-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.kt-book { padding: 12px; border-radius: 12px; background: var(--bg2); border: 1px solid var(--line2); display: flex; flex-direction: column; gap: 4px; }
.kt-book-title { font-weight: 700; font-size: 15px; }
.kt-book-meta { font-size: 12px; color: var(--text2); }
.kt-book-desc { font-size: 13px; line-height: 1.45; }
.kt-book .btn, .kt-file .btn { min-height: 44px; }
.kt-small { font-size: 12px; }
.kt-body [id] { scroll-margin-top: 140px; }
.kt-body a:hover { text-decoration: underline; }
.kt-body ul, .kt-body ol { padding-left: 22px; margin: 0 0 12px; }
.kt-body li { margin-bottom: 4px; }
.kt-body img { max-width: 100%; height: auto; border-radius: 8px; background: var(--bg2); }
.kt-body figure { margin: 12px 0; padding: 10px; background: var(--card); border: 1px solid var(--line2); border-radius: 12px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.kt-body figcaption { font-size: 0.82em; color: var(--muted); line-height: 1.4; }
.kt-body .kt-table { overflow-x: auto; margin: 0 0 12px; }
.kt-body table { border-collapse: collapse; font-size: 0.88em; }
.kt-body th, .kt-body td { border: 1px solid var(--line2); padding: 6px 8px; text-align: left; vertical-align: top; overflow-wrap: break-word; }
.kt-body th { background: var(--card); color: var(--text); }
.kt-body blockquote { margin: 0 0 12px; padding: 4px 12px; border-left: 3px solid var(--line3); color: var(--muted); }
.kt-body sup, .kt-body sub { line-height: 0; }
.kt-body pre, .kt-body code { font-family: var(--mono); font-size: 0.82em; background: var(--bg2); border-radius: 6px; }
.kt-body pre { padding: 10px; overflow-x: auto; white-space: pre-wrap; }
.kt-body .mw-editsection, .kt-body .noprint { display: none; }
.kt-body details > summary { cursor: pointer; }
.kt-body mark.kt-mark { background: rgba(245, 165, 36, 0.28); color: inherit; border-radius: 3px; }
.kt-body mark.kt-mark.cur { background: var(--accent); color: var(--on-accent); }
`;
const CSS = CSS_BASE + MAGAZA_CSS + TRANSLATE_CSS;

// ---------------------------------------------------------------------------
// Kalıcı küçük durum (sekmeler arası ve oturumlar arası)
// ---------------------------------------------------------------------------

const LS_HISTORY = 'ac.lib.history';
const LS_SOURCE = 'ac.lib.source';
const LS_SIZE = 'ac.lib.textSize';

function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* depolama yok */
  }
}

function loadHistory(): string[] {
  try {
    const v = JSON.parse(lsGet(LS_HISTORY) || '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 12) : [];
  } catch {
    return [];
  }
}

function pushHistory(q: string): string[] {
  q = q.trim();
  if (!q) return loadHistory();
  const low = q.toLocaleLowerCase('tr');
  const h = [q, ...loadHistory().filter((x) => x.toLocaleLowerCase('tr') !== low)].slice(0, 12);
  lsSet(LS_HISTORY, JSON.stringify(h));
  return h;
}

let lastQuery = '';
let lastHits: LibraryHit[] = [];
let lastText: LibraryTextHit[] = [];

/** Makaleler arası geri/ileri geçmişi (yalnızca bu oturum). */
const nav = { stack: [] as string[], idx: -1 };

function syncNav(ref: string) {
  if (nav.stack[nav.idx] === ref) return;
  if (nav.stack[nav.idx - 1] === ref) nav.idx--;
  else if (nav.stack[nav.idx + 1] === ref) nav.idx++;
  else {
    nav.stack = nav.stack.slice(0, nav.idx + 1);
    nav.stack.push(ref);
    if (nav.stack.length > 50) nav.stack.shift();
    nav.idx = nav.stack.length - 1;
  }
}

/** Sonuç listesinin kaydırma konumu (makaleden dönünce geri yüklenir) */
let listScroll = 0;

/** Sonuç listesinden açılış: geçmiş bu makaleyle yeniden başlar. */
function openFromList(ref: string) {
  listScroll = document.getElementById('main')?.scrollTop ?? 0;
  nav.stack = [ref];
  nav.idx = 0;
  go.article(ref);
}

function scrollTop() {
  document.getElementById('main')?.scrollTo({ top: 0 });
}

// Küçük satır içi simgeler (icons.tsx paylaşımlı olduğundan burada)
const svg = (d: JSX.Element) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const IcoLeft = () => svg(<path d="M15 18l-6-6 6-6" />);
const IcoRight = () => svg(<path d="M9 18l6-6-6-6" />);
const IcoUp = () => svg(<path d="M18 15l-6-6-6 6" />);
const IcoDown = () => svg(<path d="M6 9l6 6 6-6" />);
const IcoX = () => svg(<path d="M18 6L6 18M6 6l12 12" />);
const IcoFind = () =>
  svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>,
  );
const IcoDice = () =>
  svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>,
  );

// ---------------------------------------------------------------------------
// Ana bileşen
// ---------------------------------------------------------------------------

export function KutuphaneTab() {
  const s = useAppState();
  const [sources, setSources] = useState<LibrarySource[] | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    setSources(undefined);
    getLibraries()
      .then((l) => alive && setSources(l))
      .catch(() => alive && setSources([]));
    return () => {
      alive = false;
    };
  }, [s.packsVersion]);

  if (sources === undefined) {
    return (
      <div class="pad">
        <style>{CSS}</style>
        <p class="empty" data-testid="lib-loading">
          Kütüphane açılıyor…
        </p>
      </div>
    );
  }

  if (!sources.length) {
    const err = getLibraryError();
    return (
      <div class="pad">
        <style>{CSS}</style>
        <div class="kt-hero" data-testid="lib-empty">
          <h2>Çevrimdışı kütüphane</h2>
          <p>
            Ansiklopediler, ilaç rehberleri, telifsiz kitaplar ve sözlükler. Bir kez indirin, internet olmadan her yerde okuyun.
            Yakındaki bir Akıl Çantası bilgi noktasına bağlanarak da kullanabilirsiniz.
          </p>
          {err && <p class="warn" style="margin:0">Paket açılamadı: {err}</p>}
          <button class="link-btn kt-manage" data-testid="lib-manage" onClick={() => go.tool('paylas')}>
            Dosyadan içe aktar ya da tüm paketleri yönet →
          </button>
        </div>
        <LibraryStore />
      </div>
    );
  }

  if (s.openArticlePath) {
    return (
      <>
        <style>{CSS}</style>
        <ArticleView key="article" refStr={s.openArticlePath} />
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <SearchView sources={sources} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Arama görünümü
// ---------------------------------------------------------------------------

function SearchView({ sources }: { sources: LibrarySource[] }) {
  const [sourceId, setSourceId] = useState<string>(() => {
    const v = lsGet(LS_SOURCE);
    return v && sources.some((x) => x.id === v) ? v : 'all';
  });
  const [query, setQuery] = useState(lastQuery);
  const [hits, setHits] = useState<LibraryHit[]>(lastHits);
  const [text, setText] = useState<LibraryTextHit[]>(lastText);
  const [searching, setSearching] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  /** Gösterilen sonuçların ait olduğu sorgu (testler ve eski sonuç ayrımı için) */
  const [doneQ, setDoneQ] = useState(lastQuery.trim());
  const [history, setHistory] = useState<string[]>(loadHistory);
  const [confirmClear, setConfirmClear] = useState(false);
  const [mains, setMains] = useState<{ src: LibrarySource; path: string; title: string }[]>([]);
  const [randomState, setRandomState] = useState<'idle' | 'busy' | 'none'>('idle');
  const seq = useRef(0);
  /** Sonuçlar gelmeden Enter'a basıldıysa o sorgu (sonuç gelince ilki açılır) */
  const pendingEnter = useRef<string | null>(null);
  const err = getLibraryError();

  // Makaleden dönünce listenin kaldığı yere kaydır
  useEffect(() => {
    const y = listScroll;
    listScroll = 0;
    if (y) requestAnimationFrame(() => document.getElementById('main')?.scrollTo({ top: y }));
  }, []);

  const effective = sources.length === 1 ? sources[0].id : sourceId;
  const selected = sources.find((x) => x.id === effective) ?? null;

  const chooseSource = (id: string) => {
    setSourceId(id);
    setRandomState('idle');
    lsSet(LS_SOURCE, id === 'all' ? null : id);
  };

  // Ana sayfalar
  useEffect(() => {
    let alive = true;
    const list = selected ? [selected] : sources;
    Promise.all(
      list.map(async (src) => {
        const m = await src.zim.getMainPage().catch(() => null);
        return m ? { src, path: m.path, title: m.title } : null;
      }),
    ).then((r) => alive && setMains(r.filter((x): x is NonNullable<typeof x> => !!x)));
    return () => {
      alive = false;
    };
  }, [sources, effective]);

  // Arama (kısa gecikmeli): önce başlıklar, ardından tam metin
  useEffect(() => {
    lastQuery = query;
    const q = query.trim();
    const my = ++seq.current;
    if (!q) {
      setHits((lastHits = []));
      setText((lastText = []));
      setDoneQ('');
      setSearching(false);
      setTextLoading(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const r = await searchLibrary(q, { sourceId: effective, limit: 30 });
        if (my !== seq.current) return;
        setHits((lastHits = r));
        setDoneQ(q);
        setSearching(false);
        if (pendingEnter.current === q) {
          pendingEnter.current = null;
          setHistory(pushHistory(q));
          if (r[0]) {
            setText((lastText = []));
            openFromList(r[0].ref);
            return;
          }
        }
        if (q.length >= 3 && sources.some((x) => x.hasFulltext && (effective === 'all' || x.id === effective))) {
          setTextLoading(true);
          const seen = new Set(r.map((h) => h.ref));
          const tx = (await searchLibraryText(q, { sourceId: effective, limit: 12 })).filter((h) => !seen.has(h.ref));
          if (my !== seq.current) return;
          setText((lastText = tx));
        } else setText((lastText = []));
      } catch (e) {
        console.warn('Arama hatası', e);
        if (my === seq.current) {
          setHits([]);
          setText([]);
        }
      } finally {
        if (my === seq.current) {
          setSearching(false);
          setTextLoading(false);
        }
      }
    }, 160);
    return () => clearTimeout(t);
  }, [query, effective]);

  const open = (ref: string) => {
    if (query.trim()) setHistory(pushHistory(query));
    openFromList(ref);
  };

  const random = async () => {
    setRandomState('busy');
    const r = await randomLibraryArticle(effective).catch(() => null);
    if (!r) return setRandomState('none');
    setRandomState('idle');
    openFromList(r.ref);
  };

  const placeholder = selected ? `${selected.label} içinde ara…` : 'Tüm kaynaklarda ara…';
  const q = query.trim();
  const fuzzyOnly = hits.length > 0 && hits.every((h) => h.rank === 5);

  return (
    <div
      class="pad"
      data-testid="lib-view"
      data-q={doneQ}
      data-state={searching ? 'searching' : textLoading ? 'text' : 'idle'}
    >
      <div class="kt-field">
        <label class="label" for="lib-search">
          Çevrimdışı ara
        </label>
        <input
          id="lib-search"
          class="input"
          type="search"
          data-testid="lib-search"
          placeholder={placeholder}
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Gösterilen sonuçlar eski bir sorguya aitse yanlış makaleyi açma; sonucu bekle
              if (q && doneQ !== q) pendingEnter.current = q;
              else if (hits[0]) open(hits[0].ref);
              else if (q) setHistory(pushHistory(q));
            }
          }}
          autocomplete="off"
          autocapitalize="off"
          spellcheck={false}
          enterKeyHint="search"
        />
      </div>

      {sources.length > 1 && (
        <div class="kt-chips kt-covers" role="group" aria-label="Rafım: aranacak kaynak" data-testid="lib-sources">
          <button class="chip" aria-pressed={effective === 'all'} data-testid="lib-src-all" onClick={() => chooseSource('all')}>
            Tümü <span class="kt-chip-n">{sources.length}</span>
          </button>
          {sources.map((src) => (
            <button
              key={src.id}
              class="chip"
              aria-pressed={effective === src.id}
              data-testid="lib-src"
              data-src={src.id}
              title={src.title}
              onClick={() => chooseSource(src.id)}
            >
              {src.label}
            </button>
          ))}
        </div>
      )}

      {!q && selected && <SourceCard src={selected} />}
      {err && (
        <p class="warn" style="margin:0" data-testid="lib-error">
          Bazı paketler açılamadı: {err}
        </p>
      )}


      {q ? (
        <>
          {searching && !hits.length ? (
            <p class="empty" data-testid="lib-searching">
              Aranıyor…
            </p>
          ) : hits.length ? (
            <>
              {fuzzyOnly && (
                <p class="empty" style="margin:0" data-testid="lib-fuzzy-note">
                  "{q}" için tam eşleşme yok; benzer yazılışlar gösteriliyor.
                </p>
              )}
              <ul class="kt-results" aria-label="Başlık sonuçları" data-testid="lib-results">
                {hits.map((h) => (
                  <li key={h.ref}>
                    <button class="list-btn" data-testid="lib-result" data-ref={h.ref} onClick={() => open(h.ref)}>
                      <span class="kt-hit-title">{h.title}</span>
                      <span class="kt-hit-meta">
                        <span class="tag kt-hit-src" data-testid="lib-result-src">
                          {h.sourceLabel}
                        </span>
                        {h.rank === 5 && !fuzzyOnly && <span class="tag kt-hit-fuzzy">benzer</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p class="empty" data-testid="lib-noresult">
              "{q}" başlıklı bir madde bulunamadı.
              {textLoading ? ' Metinlerde aranıyor…' : text.length ? ' Metinde geçenler aşağıda.' : ' Daha kısa ya da farklı bir kelime deneyin.'}
            </p>
          )}

          {(text.length > 0 || (textLoading && hits.length > 0)) && (
            <>
              <div class="kt-section">
                <span class="label">Metinde geçenler</span>
                {textLoading && <span class="warn">aranıyor…</span>}
              </div>
              <ul class="kt-results" aria-label="Tam metin sonuçları" data-testid="lib-text-results">
                {text.map((h) => (
                  <li key={h.ref}>
                    <button class="list-btn" data-testid="lib-text-result" data-ref={h.ref} onClick={() => open(h.ref)}>
                      <span class="kt-hit-title">{h.title}</span>
                      <span class="kt-hit-meta">
                        <span class="tag kt-hit-src">{h.sourceLabel}</span>
                        <span class="tag kt-hit-src">metinde</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <>
          <div class="kt-store kt-store-top">
            <LibraryStore />
          </div>
          <div class="kt-actions">
            <button class="btn" data-testid="lib-random" disabled={randomState === 'busy'} onClick={random}>
              <IcoDice />
              {randomState === 'busy' ? 'Seçiliyor…' : 'Rastgele makale'}
            </button>
          </div>
          {randomState === 'none' && <p class="warn">Bu kaynakta açılabilecek makale bulunamadı.</p>}

          {history.length > 0 && (
            <>
              <div class="kt-section">
                <span class="label">Son aramalar</span>
                {confirmClear ? (
                  <span class="row">
                    <button
                      class="link-btn"
                      style="min-height:44px;color:var(--danger)"
                      data-testid="lib-history-clear-yes"
                      onClick={() => {
                        lsSet(LS_HISTORY, null);
                        setHistory([]);
                        setConfirmClear(false);
                      }}
                    >
                      Evet, temizle
                    </button>
                    <button class="link-btn" style="min-height:44px" data-testid="lib-history-clear-no" onClick={() => setConfirmClear(false)}>
                      Vazgeç
                    </button>
                  </span>
                ) : (
                  <button class="link-btn" style="min-height:44px" data-testid="lib-history-clear" onClick={() => setConfirmClear(true)}>
                    Temizle
                  </button>
                )}
              </div>
              <div class="kt-hist" data-testid="lib-history">
                {history.map((h) => (
                  <button key={h} class="chip" data-testid="lib-history-item" onClick={() => setQuery(h)}>
                    {h}
                  </button>
                ))}
              </div>
            </>
          )}


          <p class="empty" style="margin:0">
            Madde başlığının herhangi bir kelimesini yazın; Türkçe karakterler ve küçük yazım hataları sorun olmaz.
            Sonuçlar internet olmadan, bu cihazdaki paketlerden gelir.
          </p>
          {mains.map((m) => (
            <button key={m.src.id} class="list-btn" data-testid="lib-main" onClick={() => openFromList(makeRef(m.src.id, m.path))}>
              <span class="kt-hit-title">{m.src.label} ana sayfası</span>
              <span class="kt-hit-meta">
                <span class="tag kt-hit-src">{m.src.title}</span>
              </span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function SourceCard({ src }: { src: LibrarySource }) {
  return (
    <div class="card kt-meta" data-testid="lib-meta">
      <div class="kt-meta-top">
        <div class="kt-meta-icon">
          <IconBook size={18} />
        </div>
        <div class="grow">
          <div class="kt-meta-title" data-testid="lib-meta-title">
            {src.title}
          </div>
          {src.description && <p class="kt-meta-desc">{src.description}</p>}
        </div>
      </div>
      <div class="kt-tags">
        <span class="tag" data-testid="lib-meta-count">
          {src.articleCount.toLocaleString('tr-TR')} madde
        </span>
        {src.languageName && (
          <span class="tag" data-testid="lib-meta-lang">
            {src.languageName}
          </span>
        )}
        {src.size > 0 && <span class="tag">{formatSize(src.size)}</span>}
        {src.hasFulltext && <span class="tag">tam metin dizini</span>}
        <span class="tag">çevrimdışı</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Makale görünümü
// ---------------------------------------------------------------------------

type ArticleState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ok'; src: LibrarySource; title: string; html: string; text: string; path: string }
  | { status: 'file'; src: LibrarySource; title: string; path: string; mime: string }
  | { status: 'books'; src: LibrarySource; title: string; path: string; books: NautilusBook[] };

/** HTML olmayan dosya uzantıları (PDF, belge, ses/görüntü): sayfa olarak değil dosya olarak açılır */
const FILE_EXT = /\.(pdf|epub|djvu|docx?|xlsx?|pptx?|odt|ods|zip|mp3|m4a|ogg|oga|wav|mp4|webm|m4v|mov)$/i;

export function isFilePath(p: string): boolean {
  return FILE_EXT.test(p.split(/[?#]/)[0]);
}

/**
 * Arşivdeki dosyayı tarayıcının kendi görüntüleyicisinde (PDF, video…) açar; olmazsa indirir.
 * Pencere tıklamayla aynı anda açılır (açılır pencere izni dokunmadan sonraki birkaç saniyeyle
 * sınırlıdır; büyük PDF arşivden bundan uzun sürede okunabilir), dosya hazır olunca içine yüklenir.
 */
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

async function openZimFile(zim: LibrarySource['zim'], path: string, download = false): Promise<boolean> {
  const name = decodeURIComponent(path.split('/').pop() || 'dosya');
  // Güvenli türde değilse açılmaz, indirilir (bkz. guvenliAcmaTuru)
  const peek = await zim.getResource(path).catch(() => null);
  const tur = peek ? guvenliAcmaTuru(peek.mime, path) : null;
  if (!tur) download = true;
  let w: Window | null = null;
  if (!download) {
    try {
      w = window.open('', '_blank');
      if (w) {
        w.document.title = name;
        w.document.body.style.cssText = 'font:16px system-ui,sans-serif;background:#0b0e13;color:#e8eaed;padding:24px';
        w.document.body.textContent = name + ' hazırlanıyor…';
      }
    } catch {
      w = null;
    }
  }
  const r = peek;
  if (!r) {
    if (w) w.document.body.textContent = 'Dosya arşivde bulunamadı.';
    return false;
  }
  const url = URL.createObjectURL(new Blob([r.data as BlobPart], { type: download || !tur ? 'application/octet-stream' : tur }));
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

function ArticleView({ refStr }: { refStr: string }) {
  const [state, setLocal] = useState<ArticleState>({ status: 'loading' });
  const [size, setSize] = useState(() => Math.min(2, Math.max(0, Number(lsGet(LS_SIZE)) || 0)));
  const [findOpen, setFindOpen] = useState(false);
  // Arama kutusu açılınca odak kutuya (DOM'a eklendiği anda; boyamayı beklemeden)
  useLayoutEffect(() => {
    if (findOpen) findRef.current?.focus();
  }, [findOpen]);
  const [findQ, setFindQ] = useState('');
  const [findCur, setFindCur] = useState(0);
  const [findN, setFindN] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const findRef = useRef<HTMLInputElement>(null);
  const marks = useRef<HTMLElement[]>([]);

  syncNav(refStr);
  const canBack = nav.idx > 0;
  const canFwd = nav.idx < nav.stack.length - 1;

  useEffect(() => {
    let alive = true;
    setLocal({ status: 'loading' });
    setFindQ('');
    scrollTop();
    (async () => {
      const r = await resolveRef(refStr);
      if (!r) return null;
      // PDF gibi dosyalar metin olarak çözülmez; dosya kartı gösterilir
      if (isFilePath(r.path)) return { r, a: null, books: null };
      const a = await r.source.zim.getArticle(r.path);
      if (!a) return null;
      // Nautilus kitaplığının ana sayfası: kitap listesini kendimiz çizeriz
      let books: NautilusBook[] | null = null;
      if (a.mime.startsWith('text/html') && /\bhome(\.html)?$|^index\.html$/i.test(a.path)) books = await loadNautilus(r.source.zim);
      return { r, a, books };
    })()
      .then((x) => {
        if (!alive) return;
        if (!x) return setLocal({ status: 'missing' });
        const { r, a, books } = x;
        if (!a) {
          const name = decodeURIComponent(r.path.split('/').pop() || r.path);
          return setLocal({ status: 'file', src: r.source, title: name, path: r.path, mime: '' });
        }
        if (books) return setLocal({ status: 'books', src: r.source, title: r.source.title, path: a.path, books });
        if (!a.mime.startsWith('text/') && !/json|xml|javascript/.test(a.mime)) {
          return setLocal({ status: 'file', src: r.source, title: a.title || a.path, path: a.path, mime: a.mime });
        }
        const isHtml = a.mime.startsWith('text/html');
        const html = isHtml
          ? sanitize(a.html, r.source.zim, a.path, a.title)
          : `<pre>${a.html.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)}</pre>`;
        const text = isHtml ? extractParagraphs(a.html, 1500).join('\n\n') : a.html.slice(0, 1500);
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

  // Görselleri arşivden yükle
  useEffect(() => {
    if (state.status !== 'ok' || !bodyRef.current) return;
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
    return () => {
      alive = false;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [state]);

  // Sayfada bul: eşleşmeleri işaretle
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || state.status !== 'ok') return;
    clearMarks(root);
    marks.current = findOpen ? markMatches(root, findQ) : [];
    setFindN(marks.current.length);
    setFindCur(0);
  }, [findQ, findOpen, state]);

  useEffect(() => {
    marks.current.forEach((m, i) => m.classList.toggle('cur', i === findCur));
    const m = marks.current[findCur];
    if (m) m.scrollIntoView({ block: 'center' });
  }, [findCur, findN]);

  // Bulma kapanınca işaretler hemen kalksın (efekti beklemeden)
  const closeFind = () => {
    if (bodyRef.current) clearMarks(bodyRef.current);
    marks.current = [];
    setFindN(0);
    setFindOpen(false);
  };

  const step = (d: number) => {
    if (!findN) return;
    setFindCur((c) => (c + d + findN) % findN);
  };

  const changeSize = () => {
    const n = (size + 1) % 3;
    setSize(n);
    lsSet(LS_SIZE, String(n));
  };

  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || state.status !== 'ok') return;
    const zp = a.getAttribute('data-zim-path');
    if (zp) {
      e.preventDefault();
      if (isFilePath(zp)) void openZimFile(state.src.zim, zp);
      else go.article(makeRef(state.src.id, zp));
      return;
    }
    const href = a.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // bozuk % kodlaması: olduğu gibi aranır
      }
      if (id) bodyRef.current?.querySelector(`[id="${CSS_escape(id)}"]`)?.scrollIntoView({ block: 'start' });
    }
  };

  const close = () => setState({ openArticlePath: null });
  const back = () => canBack && go.article(nav.stack[nav.idx - 1]);
  const fwd = () => canFwd && go.article(nav.stack[nav.idx + 1]);
  const sizeLabel = ['Normal', 'Büyük', 'Çok büyük'][size];

  return (
    <article class="pad" data-testid="lib-article" aria-labelledby="kt-title">
      <div class="kt-bar">
        <div class="kt-bar-row">
          <button class="kt-back grow" data-testid="lib-back" onClick={close}>
            ← Sonuçlara dön
          </button>
          <button class="kt-ibtn" data-testid="lib-nav-back" aria-label="Önceki makale" disabled={!canBack} onClick={back}>
            <IcoLeft />
          </button>
          <button class="kt-ibtn" data-testid="lib-nav-fwd" aria-label="Sonraki makale" disabled={!canFwd} onClick={fwd}>
            <IcoRight />
          </button>
          <button
            class="kt-ibtn"
            data-testid="lib-find-toggle"
            aria-label="Sayfada bul"
            aria-pressed={findOpen}
            onClick={() => {
              setFindOpen(!findOpen);
            }}
          >
            <IcoFind />
          </button>
          <button
            class="kt-ibtn"
            data-testid="lib-textsize"
            aria-label={`Yazı boyutu: ${sizeLabel}`}
            title={`Yazı boyutu: ${sizeLabel}`}
            aria-pressed={size > 0}
            onClick={changeSize}
          >
            Aa{size === 0 ? '' : size === 1 ? '+' : '++'}
          </button>
        </div>
        {findOpen && (
          <div class="kt-find" role="search">
            <input
              ref={findRef}
              class="input grow"
              type="search"
              data-testid="lib-find-input"
              placeholder="Sayfada bul…"
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
            <button class="kt-ibtn" data-testid="lib-find-prev" aria-label="Önceki eşleşme" disabled={!findN} onClick={() => step(-1)}>
              <IcoUp />
            </button>
            <button class="kt-ibtn" data-testid="lib-find-next" aria-label="Sonraki eşleşme" disabled={!findN} onClick={() => step(1)}>
              <IcoDown />
            </button>
            <button class="kt-ibtn" data-testid="lib-find-close" aria-label="Bulmayı kapat" onClick={closeFind}>
              <IcoX />
            </button>
          </div>
        )}
      </div>

      {state.status === 'loading' && (
        <p class="empty" data-testid="lib-article-loading">
          Makale açılıyor…
        </p>
      )}
      {state.status === 'missing' && (
        <p class="empty" data-testid="lib-article-missing">
          Bu madde arşivde bulunamadı.
        </p>
      )}
      {state.status === 'ok' && (
        <>
          <div class="row">
            <span class="tag" data-testid="lib-article-src">
              {state.src.label}
            </span>
            {state.src.languageName && <span class="tag">{state.src.languageName}</span>}
          </div>
          <h1 class="kt-title" id="kt-title" data-testid="lib-article-title">
            {state.title}
          </h1>
          <button
            class="btn kt-ask"
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
            Bu makale hakkında Fener'e sor
          </button>
          <ArticleTranslate key={refStr} refStr={refStr} html={state.html} language={state.src.language} />
          <ArticleBody html={state.html} size={size} bodyRef={bodyRef} onClick={onClick} />
        </>
      )}
      {state.status === 'file' && <FileCard src={state.src} title={state.title} path={state.path} />}
      {state.status === 'books' && <BookList src={state.src} books={state.books} />}
    </article>
  );
}

function FileCard({ src, title, path }: { src: LibrarySource; title: string; path: string }) {
  const [msg, setMsg] = useState('');
  const pdf = /\.pdf$/i.test(path);
  const [reading, setReading] = useState(pdf);
  const run = async (download: boolean) => {
    setMsg('Hazırlanıyor…');
    const ok = await openZimFile(src.zim, path, download);
    setMsg(ok ? '' : 'Dosya arşivde bulunamadı.');
  };
  if (pdf && reading) {
    return <PdfOkuyucu title={title} sub={src.label} language={src.language} docKey={src.id + '/' + path} load={() => readZimFile(src.zim, path)} onClose={() => setReading(false)} />;
  }
  return (
    <div class="kt-file" data-testid="lib-file">
      <div class="row">
        <span class="tag">{src.label}</span>
        {pdf && <span class="tag">PDF</span>}
      </div>
      <h1 class="kt-title" id="kt-title">
        {title}
      </h1>
      <p class="muted">
        {pdf ? 'Bu bir PDF belgesi. Uygulamanın içinde okuyabilir, içinde arama yapabilir ve sayfaları çevirebilirsiniz.' : 'Bu bir dosya. Telefonunuzun ya da bilgisayarınızın kendi görüntüleyicisinde açılır.'}
      </p>
      <div class="row">
        <button class="btn primary" data-testid="lib-file-open" onClick={() => (pdf ? setReading(true) : run(false))}>
          {pdf ? 'Okumaya başla' : 'Aç'}
        </button>
        {pdf && (
          <button class="btn" data-testid="lib-file-external" onClick={() => run(false)}>
            Başka uygulamada aç
          </button>
        )}
        <button class="btn" data-testid="lib-file-save" onClick={() => run(true)}>
          Cihaza kaydet
        </button>
      </div>
      {msg && <p class="muted" role="status">{msg}</p>}
    </div>
  );
}

/** Nautilus kitaplığı (zimgit) kitap listesi: başlık, yazar, açıklama; PDF'ler dosya olarak açılır. */
function BookList({ src, books }: { src: LibrarySource; books: NautilusBook[] }) {
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [reading, setReading] = useState<{ book: NautilusBook; file: string } | null>(null);
  const fq = foldCharwise(q.trim());
  const shown = fq
    ? books.filter((b) => foldCharwise(`${b.title} ${b.author} ${b.description}`).includes(fq))
    : books;
  const open = async (b: NautilusBook, f: string) => {
    if (/\.pdf$/i.test(f)) {
      setReading({ book: b, file: f });
      return;
    }
    setBusy(b.id + f);
    await openZimFile(src.zim, f);
    setBusy(null);
  };
  if (reading) {
    return (
      <PdfOkuyucu
        key={reading.file}
        title={reading.book.title}
        sub={reading.book.author || src.label}
        language={src.language}
        docKey={src.id + '/' + reading.file}
        load={() => readZimFile(src.zim, reading.file)}
        onClose={() => setReading(null)}
      />
    );
  }
  return (
    <div class="kt-books" data-testid="lib-books">
      <div class="row">
        <span class="tag">{src.label}</span>
        {src.languageName && <span class="tag">{src.languageName}</span>}
      </div>
      <h1 class="kt-title" id="kt-title">
        {src.title}
      </h1>
      {src.description && <p class="muted">{src.description}</p>}
      <input
        class="input"
        type="search"
        placeholder={`${books.length} kitapta ara…`}
        aria-label="Kitaplarda ara"
        data-testid="lib-books-q"
        value={q}
        onInput={(e) => setQ((e.target as HTMLInputElement).value)}
      />
      <ul class="kt-book-list">
        {shown.map((b) => (
          <li key={b.id} class="kt-book" data-testid="lib-book">
            <div class="kt-book-title">{b.title}</div>
            {b.author && <div class="kt-book-meta">{b.author}</div>}
            {b.description && <div class="kt-book-desc">{b.description}</div>}
            <div class="row">
              {b.files.map((f, i) => (
                <button key={f} class="btn" data-testid="lib-book-open" disabled={busy === b.id + f} onClick={() => open(b, f)}>
                  {busy === b.id + f ? 'Açılıyor…' : b.files.length > 1 ? `Aç (${i + 1})` : /\.pdf$/i.test(f) ? 'PDF\'i aç' : 'Aç'}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {!shown.length && <p class="empty">Eşleşen kitap yok.</p>}
      <p class="muted kt-small">Kitaplar İngilizce PDF belgeleridir; uygulamanın içinde açılır, içlerinde arama yapılabilir ve sayfalar Fener ile Türkçeye çevrilebilir.</p>
    </div>
  );
}

/** HTML yalnızca değişince yeniden yazılır (sayfada bul işaretleri korunur). */
function ArticleBody({
  html,
  size,
  bodyRef,
  onClick,
}: {
  html: string;
  size: number;
  bodyRef: { current: HTMLDivElement | null };
  onClick: (e: MouseEvent) => void;
}) {
  const inner = useMemo(() => ({ __html: html }), [html]);
  return (
    <div
      class={`kt-body kt-size-${size}`}
      data-testid="lib-article-body"
      ref={bodyRef}
      onClick={onClick}
      dangerouslySetInnerHTML={inner}
    />
  );
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
