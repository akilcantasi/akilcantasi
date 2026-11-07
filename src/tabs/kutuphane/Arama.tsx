// Birleşik arama: indirilen tüm koleksiyonlarda (ya da tek koleksiyonda) başlık + tam metin.
// Sonuçlar gelmeden Enter'a basılırsa yeni sorgunun ilk sonucu açılır (eski sorgununki değil).
import { useEffect, useRef, useState } from 'preact/hooks';
import { searchLibrary, searchLibraryText, randomLibraryArticle, type LibraryHit, type LibrarySource, type LibraryTextHit } from '../../lib/library';
import { acMakale } from './gezinme';
import { IcoDice, IcoFind, IcoX, KategoriIkon } from './ikonlar';
import { loadHistory, lsSet, LS_HISTORY, pushHistory } from './veri';
import type { Koleksiyon } from './durum';

/** Son sonuçlar (makaleden dönünce yeniden aranmasın) */
const onbellek = new Map<string, { hits: LibraryHit[]; text: LibraryTextHit[] }>();

export function AramaKutusu({
  value,
  onInput,
  onEnter,
  onFocus,
  onCancel,
  placeholder,
  autoFocus,
}: {
  value: string;
  onInput: (v: string) => void;
  onEnter?: () => void;
  onFocus?: () => void;
  onCancel?: () => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return (
    <div class="kt-search" role="search">
      <div class="kt-search-box">
        <IcoFind />
        <input
          ref={ref}
          id="lib-search"
          class="input"
          type="search"
          data-testid="lib-search"
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          onInput={(e) => onInput((e.target as HTMLInputElement).value)}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEnter?.();
            if (e.key === 'Escape') onCancel?.();
          }}
          autocomplete="off"
          autocapitalize="off"
          spellcheck={false}
          enterKeyHint="search"
        />
        {value && (
          <button
            class="kt-search-x"
            aria-label="Aramayı temizle"
            data-testid="lib-search-clear"
            onClick={() => {
              onInput('');
              ref.current?.focus();
            }}
          >
            <IcoX />
          </button>
        )}
      </div>
      {onCancel && (
        <button class="kt-cancel" data-testid="lib-search-cancel" onClick={onCancel}>
          Vazgeç
        </button>
      )}
    </div>
  );
}

/**
 * Sonuç listesi. scope verilirse yalnız o koleksiyonda aranır (süzgeç çipleri gösterilmez).
 * enterSignal her arttığında Enter'a basılmış sayılır.
 */
export function AramaSonuclari({
  sources,
  query,
  scope,
  koleksiyonlar,
  enterSignal,
  onStore,
}: {
  sources: LibrarySource[] | undefined;
  query: string;
  scope?: string;
  koleksiyonlar: Koleksiyon[];
  enterSignal: number;
  onStore?: () => void;
}) {
  const [filter, setFilter] = useState<string>('all');
  const effective = scope ?? (filter !== 'all' && sources?.some((x) => x.id === filter) ? filter : 'all');
  const key = `${effective}\u0000${query.trim()}`;
  const cached = onbellek.get(key);
  const [hits, setHits] = useState<LibraryHit[]>(cached?.hits ?? []);
  const [text, setText] = useState<LibraryTextHit[]>(cached?.text ?? []);
  const [searching, setSearching] = useState(!cached && !!query.trim());
  const [textLoading, setTextLoading] = useState(false);
  const [doneQ, setDoneQ] = useState(cached ? query.trim() : '');
  /** Gösterilen sonuçların süzgeç + sorgu anahtarı (süzgeç değişince eski sonuçlar "aranıyor" sayılır) */
  const [doneKey, setDoneKey] = useState(cached ? key : '');
  const [shown, setShown] = useState(12);
  const seq = useRef(0);
  const pendingEnter = useRef<string | null>(null);
  const q = query.trim();

  const ad = (id: string) => koleksiyonlar.find((k) => k.id === id);
  /** Süzgeç çipleri Kitaplığım'daki sırayla (son okunan önce) */
  const sira = (id: string) => {
    const i = koleksiyonlar.findIndex((k) => k.id === id);
    const c = koleksiyonlar[i];
    return i < 0 ? 1e15 : -(c?.sonOkuma ?? 0) / 1e3 + i;
  };

  useEffect(() => {
    const my = ++seq.current;
    setShown(12);
    if (!q) {
      setHits([]);
      setText([]);
      setDoneQ('');
      setSearching(false);
      setTextLoading(false);
      return;
    }
    const c = onbellek.get(key);
    if (c) {
      setHits(c.hits);
      setText(c.text);
      setDoneQ(q);
      setDoneKey(key);
      setSearching(false);
      return;
    }
    if (!sources) {
      setSearching(true);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const r = await searchLibrary(q, { sourceId: effective, limit: 30 });
        if (my !== seq.current) return;
        setHits(r);
        setText([]);
        setDoneQ(q);
        setDoneKey(key);
        setSearching(false);
        if (pendingEnter.current === q) {
          pendingEnter.current = null;
          pushHistory(q);
          if (r[0]) return acMakale(r[0].ref, { yeni: true });
        }
        let tx: LibraryTextHit[] = [];
        if (q.length >= 3 && sources.some((x) => x.hasFulltext && (effective === 'all' || x.id === effective))) {
          setTextLoading(true);
          const seen = new Set(r.map((h) => h.ref));
          tx = (await searchLibraryText(q, { sourceId: effective, limit: 12 })).filter((h) => !seen.has(h.ref));
          if (my !== seq.current) return;
          setText(tx);
        }
        onbellek.set(key, { hits: r, text: tx });
        if (onbellek.size > 20) onbellek.delete(onbellek.keys().next().value!);
      } catch (e) {
        console.warn('Arama hatası', e);
        if (my === seq.current) {
          setHits([]);
          setText([]);
          setDoneQ(q);
          setDoneKey(key);
        }
      } finally {
        if (my === seq.current) {
          setSearching(false);
          setTextLoading(false);
        }
      }
    }, 160);
    return () => clearTimeout(t);
  }, [key, sources]);

  // Enter: gösterilen sonuçlar bu sorgunun ise ilki açılır; değilse sonuç beklenir
  const firstEnter = useRef(enterSignal);
  useEffect(() => {
    if (enterSignal === firstEnter.current) return;
    if (!q) return;
    if (doneKey !== key || searching) pendingEnter.current = q;
    else if (hits[0]) open(hits[0].ref);
    else pushHistory(q);
  }, [enterSignal]);

  const open = (ref: string) => {
    if (q) pushHistory(q);
    acMakale(ref, { yeni: true });
  };

  const fuzzyOnly = hits.length > 0 && hits.every((h) => h.rank === 5);
  const multi = !scope && (sources?.length ?? 0) > 1;

  return (
    <div class="kt" data-testid="lib-view" data-q={doneKey === key ? doneQ : ''} data-filter={effective} data-state={searching || doneKey !== key ? 'searching' : textLoading ? 'text' : 'idle'}>
      {multi && (
        <div class="kt-chips" role="group" aria-label="Hangi koleksiyonda" data-testid="lib-sources">
          <button class="chip" aria-pressed={effective === 'all'} data-testid="lib-src-all" onClick={() => setFilter('all')}>
            Hepsinde <span class="kt-chip-n">{sources!.length}</span>
          </button>
          {[...sources!].sort((a, b) => sira(a.id) - sira(b.id)).map((src) => (
            <button key={src.id} class="chip" aria-pressed={effective === src.id} data-testid="lib-src" data-src={src.id} onClick={() => setFilter(src.id)}>
              {ad(src.id)?.ad ?? src.label}
            </button>
          ))}
        </div>
      )}

      {!sources || (searching && !hits.length) ? (
        <p class="empty" data-testid="lib-searching" role="status">
          {sources ? 'Aranıyor…' : 'Kitaplık hazırlanıyor…'}
        </p>
      ) : hits.length ? (
        <>
          {fuzzyOnly && (
            <p class="kt-note" data-testid="lib-fuzzy-note">
              "{q}" için tam eşleşme yok; benzer yazılışlar gösteriliyor.
            </p>
          )}
          <ul class="kt-list" aria-label="Başlıkta geçenler" data-testid="lib-results">
            {hits.slice(0, shown).map((h) => (
              <li key={h.ref}>
                <SonucSatiri title={h.title} k={ad(h.sourceId)} label={h.sourceLabel} fuzzy={h.rank === 5 && !fuzzyOnly} testid="lib-result" ref_={h.ref} onOpen={open} showSrc={!scope} />
              </li>
            ))}
          </ul>
          {hits.length > shown && (
            <button class="btn kt-more" data-testid="lib-more" onClick={() => setShown(shown + 18)}>
              Daha fazla göster ({hits.length - shown})
            </button>
          )}
        </>
      ) : (
        <div class="kt" data-testid="lib-noresult">
          <p class="empty" style="margin:0">
            "{q}" başlıklı bir madde bulunamadı.
            {textLoading ? ' Metinlerde aranıyor…' : text.length ? ' Metinde geçenler aşağıda.' : ' Daha kısa ya da farklı bir kelime deneyin.'}
          </p>
          {onStore && !textLoading && !text.length && (
            <button class="kt-link" data-testid="lib-noresult-store" onClick={onStore}>
              Aradığınız konu için yeni içerik indirin →
            </button>
          )}
        </div>
      )}

      {(text.length > 0 || (textLoading && hits.length > 0)) && (
        <>
          <div class="kt-section">
            <h2 class="kt-h2">Metinde geçenler</h2>
            {textLoading && (
              <span class="warn" role="status">
                aranıyor…
              </span>
            )}
          </div>
          <ul class="kt-list" aria-label="Metinde geçenler" data-testid="lib-text-results">
            {text.map((h) => (
              <li key={h.ref}>
                <SonucSatiri title={h.title} k={ad(h.sourceId)} label={h.sourceLabel} testid="lib-text-result" ref_={h.ref} onOpen={open} showSrc={!scope} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function SonucSatiri({
  title,
  k,
  label,
  fuzzy,
  testid,
  ref_,
  onOpen,
  showSrc,
}: {
  title: string;
  k?: Koleksiyon;
  label: string;
  fuzzy?: boolean;
  testid: string;
  ref_: string;
  onOpen: (ref: string) => void;
  showSrc: boolean;
}) {
  return (
    <button class={'kt-row kt-k-' + (k?.kategori ?? 'diger')} data-testid={testid} data-ref={ref_} onClick={() => onOpen(ref_)}>
      <span class="kt-dot" aria-hidden="true">
        <KategoriIkon k={k?.kategori ?? 'diger'} size={18} />
      </span>
      <span class="kt-row-t">
        <b>{title}</b>
        {(showSrc || fuzzy) && (
          <span>
            {showSrc && <span data-testid="lib-result-src">{k?.ad ?? label}</span>}
            {showSrc && fuzzy && ' · '}
            {fuzzy && <span class="kt-hl">benzer yazılış</span>}
          </span>
        )}
      </span>
    </button>
  );
}

/** Arama kutusu boşken: son aramalar ve rastgele madde */
export function AramaBaslangic({ onPick, sourceId }: { onPick: (q: string) => void; sourceId?: string }) {
  const [history, setHistory] = useState<string[]>(loadHistory);
  const [confirmClear, setConfirmClear] = useState(false);
  const [random, setRandom] = useState<'idle' | 'busy' | 'none'>('idle');
  const rastgele = async () => {
    setRandom('busy');
    const r = await randomLibraryArticle(sourceId ?? 'all').catch(() => null);
    if (!r) return setRandom('none');
    setRandom('idle');
    acMakale(r.ref, { yeni: true });
  };
  return (
    <div class="kt">
      {history.length > 0 && (
        <>
          <div class="kt-section">
            <h2 class="kt-h2">Son aramalar</h2>
            {confirmClear ? (
              <span class="row">
                <button
                  class="kt-link"
                  data-testid="lib-history-clear-yes"
                  onClick={() => {
                    lsSet(LS_HISTORY, null);
                    setHistory([]);
                    setConfirmClear(false);
                  }}
                >
                  Evet, temizle
                </button>
                <button class="kt-link" style="color:var(--muted)" data-testid="lib-history-clear-no" onClick={() => setConfirmClear(false)}>
                  Vazgeç
                </button>
              </span>
            ) : (
              <button class="kt-link" style="color:var(--muted)" data-testid="lib-history-clear" onClick={() => setConfirmClear(true)}>
                Temizle
              </button>
            )}
          </div>
          <div class="kt-hist" data-testid="lib-history">
            {history.map((h) => (
              <button key={h} class="chip" data-testid="lib-history-item" onClick={() => onPick(h)}>
                {h}
              </button>
            ))}
          </div>
        </>
      )}
      <p class="kt-note">Bir kelime yazın: başlıklarda ve metinlerde aranır. Türkçe karakterler ve küçük yazım hataları sorun olmaz.</p>
      <button class="btn" style="align-self:flex-start;display:inline-flex;align-items:center;gap:8px" data-testid="lib-random" disabled={random === 'busy'} onClick={rastgele}>
        <IcoDice />
        {random === 'busy' ? 'Seçiliyor…' : 'Rastgele bir madde'}
      </button>
      {random === 'none' && <p class="kt-note">Açılabilecek bir madde bulunamadı.</p>}
    </div>
  );
}
