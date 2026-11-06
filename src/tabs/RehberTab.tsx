// Rehber sekmesi: elle hazırlanmış, yapay zekâ kullanmayan acil durum rehberleri.
// Gezinme: ana ekran (kategori kutuları) → kategori (rehber listesi) → rehber (çizimli adımlar).
// Kurulu rehber paketlerinin (ör. "Kendine Yetmek") kategorileri ana kategorilerden sonra ayrı bölümde.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useAppState, go } from '../lib/store';
import { GUIDES, type Guide } from '../content/guides';
import { CATEGORIES, categoryOf, type GuideCategory } from '../content/categories';
import { GUIDE_ART, guideArt, guideThumb } from '../content/guide-art';
import { getPackCategories, isPackGuide, packCategoryOf, usePackGuides } from '../content/pack-guides';
import { getGuide, searchGuides } from '../lib/guides-search';
import { Art } from '../art';
import { IconChat, IconWarn } from '../icons';
import { KendineYetmek } from './KendineYetmek';

/** Ana ekranın üstündeki sahne: Çök-Kapan-Tutun */
const HERO_ART = GUIDE_ART['deprem-aninda']?.find(Boolean) ?? null;

const CSS = `
.rh-intro { font-size: 14px; color: var(--muted); line-height: 1.45; margin: 0; }
.rh-h { font-size: 15px; color: var(--text); margin: 8px 0 0; font-weight: 600; }

/* ana ekran: üstte çizim sahnesi, üstüne yumuşak gece mavisi geçiş */
.rh-home { position: relative; overflow-x: clip; }
/* Yükseklik çizimin kendisinden gelir (en çok 310 px): geçiş, çizimin alt kenarından önce
   zemine karışır. Sabit 310 px'te dar ekranda çizim kutudan önce bitiyor, alt kenarı
   arama/kısayol düğmelerinin arkasında yuvarlak köşeli bir çizgi olarak görünüyordu. */
.rh-hero-bg { position: absolute; left: 0; right: 0; top: 0; max-height: 310px; overflow: hidden; pointer-events: none; }
.rh-hero-bg .art-box { border-radius: 0; background: none; }
.rh-hero-bg .art { width: 100%; transform: translateY(-14%); }
.rh-hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, var(--bg) 0%, rgba(14,27,44,0.62) 24%, rgba(14,27,44,0.84) 58%, var(--bg) 84%); }
.rh-hero-glow { position: absolute; left: -15%; right: -15%; top: 150px; height: 240px; border-radius: 999px; background: radial-gradient(closest-side, rgba(245,165,36,0.2), rgba(245,165,36,0)); pointer-events: none; }
.rh-home > .pad { position: relative; padding-top: 22px; }
.rh-hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; padding: 4px 0 4px; }
.rh-hero-title { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; text-shadow: 0 2px 16px rgba(14,27,44,0.6); }
.rh-hero-sub { margin: 0; font-size: 14px; line-height: 1.45; color: var(--text2); max-width: 300px; }
.rh-search { display: flex; align-items: center; background: rgba(255,255,255,0.12); border: 1px solid var(--line-input); border-radius: 16px; -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); padding: 0 6px 0 16px; min-height: 56px; }
.rh-search:focus-within { border-color: var(--focus); box-shadow: 0 0 0 1px var(--focus); }
.rh-search input { flex: 1; min-width: 0; height: 52px; background: transparent; border: 0; outline: none; color: var(--text); font-size: 15px; font-weight: 500; }
.rh-search input::placeholder { color: rgba(255,255,255,0.72); }
.rh-search input::-webkit-search-cancel-button { filter: invert(1); }
.rh-search-btn { width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px; background: var(--accent); border: 0; color: var(--on-accent); display: flex; align-items: center; justify-content: center; }

/* hayati durum kısayolları: sakin, yuvarlak düğmeler */
.rh-sos-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.rh-sos-chip { min-height: 46px; border-radius: 999px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); font-size: 13.5px; font-weight: 600; line-height: 1.2; padding: 6px 8px; text-align: center; }
.rh-sos-chip:hover { border-color: rgba(255,200,97,0.6); }
.rh-sos-chip:active { background: var(--accent-soft); }

/* kategori kutuları: yuvarlak madalyon çizim + başlık */
.rh-cats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (min-width: 600px) {
  .rh-cats { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
  .rh-cat { padding: 20px 12px 18px; gap: 12px; }
  .rh-cats .rh-medal { width: 116px; height: 116px; }
  .rh-cat-title { font-size: 16.5px; }
  .rh-cat-count { font-size: 13px; }
}
.rh-cat { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; background: var(--glass); border: 1px solid rgba(255,255,255,0.11); border-radius: 20px; padding: 14px 10px 14px; color: var(--text); }
.rh-cat:hover { border-color: rgba(255,200,97,0.45); background: rgba(255,255,255,0.09); }
.rh-cat:active { transform: scale(0.985); }
.rh-medal { position: relative; width: 92px; height: 92px; flex-shrink: 0; border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 3px rgba(255,255,255,0.08), 0 8px 18px rgba(3,9,18,0.35); }
.rh-medal .art-box { position: absolute; inset: 0; border-radius: 0; background: #1a2b40; }
.rh-medal .art { position: absolute; top: 0; left: 50%; width: auto; height: 100%; transform: translateX(-50%); }
.rh-cat-text { display: flex; flex-direction: column; gap: 2px; }
.rh-cat-title { font-size: 15px; font-weight: 600; line-height: 1.25; }
.rh-cat-count { font-size: 12px; color: var(--muted); }

/* rehber listesi */
.rh-list { display: flex; flex-direction: column; gap: 10px; }
.rh-row { display: flex; gap: 12px; align-items: center; width: 100%; text-align: left; background: var(--glass); border: 1px solid rgba(255,255,255,0.11); border-radius: 18px; padding: 8px; color: var(--text); }
.rh-row:hover { border-color: rgba(255,200,97,0.45); }
.rh-row .art-box { width: 112px; flex-shrink: 0; border-radius: 12px; }
.rh-row-thumb-empty { width: 112px; aspect-ratio: 4 / 3; flex-shrink: 0; border-radius: 12px; background: #1a2b40; }
.rh-row-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding-right: 4px; }
.rh-row-title { font-size: 16px; font-weight: 600; line-height: 1.3; }
.rh-row-sum { font-size: 13px; color: var(--muted); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rh-tag { font-size: 12px; font-weight: 600; color: var(--accent2); letter-spacing: 0.02em; }
.rh-crit { font-size: 10.5px; font-weight: 600; letter-spacing: 0.03em; color: var(--on-accent); background: var(--accent2); border-radius: 999px; padding: 1px 8px; flex-shrink: 0; align-self: flex-start; }

.rh-back { align-self: flex-start; min-height: 44px; background: var(--glass); border: 1px solid var(--glass-line); border-radius: 999px; color: var(--accent2); font-size: 14px; font-weight: 500; padding: 0 14px; }
.rh-cat-head { display: flex; align-items: center; gap: 12px; }
.rh-cat-head .rh-medal { width: 76px; height: 76px; }
.rh-title { font-size: 25px; font-weight: 600; line-height: 1.25; margin: 0; letter-spacing: -0.01em; }
.rh-summary { font-size: 16px; color: var(--text2); line-height: 1.5; margin: 0; }
.rh-sos { display: flex; align-items: center; gap: 12px; background: rgba(229,72,77,0.1); border: 1px solid rgba(229,72,77,0.45); border-radius: 18px; padding: 12px 14px; }
.rh-sos-text { flex: 1; font-size: 16px; font-weight: 600; color: var(--text); line-height: 1.35; }
.rh-sos-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; min-width: 92px; padding: 0 16px; border-radius: 999px; background: var(--sos); color: #fff; font-weight: 700; font-size: 17px; text-decoration: none; box-shadow: 0 6px 18px rgba(229,72,77,0.35); }

/* çizimli adımlar */
.rh-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.rh-step { background: var(--card); border: 1px solid var(--line2); border-radius: 20px; overflow: hidden; }
.rh-step .art-box { border-radius: 0; }
.rh-step-row { display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px 14px; }
.rh-num { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--accent); color: var(--on-accent); font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; }
.rh-step-text { font-size: 16px; line-height: 1.5; padding-top: 4px; color: var(--text); }
.rh-step.plain { background: transparent; border-style: dashed; }

.rh-dont { list-style: none; margin: 0; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; background: var(--bg2); border: 1px solid var(--line2); border-radius: 18px; }
.rh-dont li { display: flex; gap: 10px; font-size: 15px; line-height: 1.45; color: var(--text2); }
.rh-x { flex-shrink: 0; color: var(--danger); font-weight: 700; }
.rh-src { font-size: 13px; color: var(--muted); line-height: 1.45; margin: 0; }
.rh-review { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; color: var(--text2); line-height: 1.45; background: rgba(245,165,36,0.08); border: 1px solid rgba(245,165,36,0.35); border-radius: 14px; padding: 10px 12px; margin: 0; }
.rh-review svg { flex-shrink: 0; color: var(--accent); margin-top: 1px; }
.rh-note { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; font-weight: 500; color: var(--text); line-height: 1.45; background: rgba(245,165,36,0.14); border: 1px solid rgba(245,165,36,0.6); border-left-width: 5px; border-radius: 14px; padding: 12px 14px; margin: 0; }
.rh-note svg { flex-shrink: 0; color: var(--accent); margin-top: 2px; }
.rh-pack-sub { margin-top: 18px; }
.rh-ask { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; }
.rh-none { display: flex; flex-direction: column; gap: 10px; }
.rh-none .empty { margin: 0; }
`;

/** Hayati durumlar için ana ekrandaki hızlı erişim */
const SOS: { id: string; label: string }[] = [
  { id: 'temel-yasam-destegi', label: 'Kalp masajı' },
  { id: 'kanama', label: 'Kanama' },
  { id: 'hava-yolu-tikanmasi', label: 'Boğulma' },
];

function scrollTop() {
  document.getElementById('main')?.scrollTo({ top: 0 });
}

function GuideRow({ g, onOpen }: { g: Guide; onOpen?: (id: string) => void }) {
  const thumb = guideThumb(g.id);
  return (
    <button class="rh-row" data-testid="guide-card" data-guide-id={g.id} onClick={() => (onOpen ?? go.guide)(g.id)}>
      {thumb ? <Art id={thumb} /> : <span class="rh-row-thumb-empty" />}
      <span class="rh-row-body">
        {g.critical && <span class="rh-crit">HAYATİ</span>}
        <span class="rh-row-title">{g.title}</span>
        <span class="rh-row-sum">{g.summary}</span>
      </span>
    </button>
  );
}

function CategoryTile({ c }: { c: GuideCategory & { packId?: string } }) {
  return (
    <button class="rh-cat" data-testid="guide-category" data-category-id={c.id} data-pack-id={c.packId} onClick={() => go.category(c.id)} title={c.hint}>
      <span class="rh-medal" aria-hidden="true">
        <Art id={c.art} />
      </span>
      <span class="rh-cat-text">
        <span class="rh-cat-title">{c.title}</span>
        <span class="rh-cat-count">{c.guides.length} rehber</span>
      </span>
    </button>
  );
}

function CategoryView({ c }: { c: GuideCategory }) {
  const guides = c.guides.map((id) => getGuide(id)).filter((g): g is Guide => !!g);
  return (
    <div class="pad" data-testid="category-detail">
      <button class="rh-back" data-testid="category-back" onClick={() => go.category(null)}>
        ← Rehber
      </button>
      <div class="rh-cat-head">
        <span class="rh-medal" aria-hidden="true">
          <Art id={c.art} />
        </span>
        <div>
          <h1 class="rh-title">{c.title}</h1>
          <p class="rh-intro">{c.hint}</p>
        </div>
      </div>
      <div class="rh-list" role="list">
        {guides.map((g) => (
          <div role="listitem" key={g.id}>
            <GuideRow g={g} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Rehberin nereden açıldığı: arama sonuçlarından ya da ana ekrandaki hayati durum kısayolundan */
type Origin = { id: string; from: 'search' | 'home' } | null;

function GuideDetail({ g, fromCategory, origin }: { g: Guide; fromCategory: GuideCategory | undefined; origin: Origin }) {
  // Kategoriden açıldıysa o kategoriye, aramadan ya da kısayoldan açıldıysa ana ekrana döner
  const back = fromCategory ?? (origin ? undefined : categoryOf(g.id) ?? packCategoryOf(g.id));
  const art = guideArt(g.id);
  const fromPack = isPackGuide(g.id);
  return (
    <article class="pad" aria-labelledby="rh-title" data-testid="guide-detail">
      <button class="rh-back" data-testid="guide-back" onClick={() => go.category(back?.id ?? null)}>
        ← {back ? back.title : origin?.from === 'search' ? 'Arama sonuçları' : 'Rehber'}
      </button>
      <div class="row" style="gap:8px">
        <span class="rh-tag">{g.tag}</span>
        {g.critical && <span class="rh-crit">HAYATİ</span>}
      </div>
      <h1 class="rh-title" id="rh-title">{g.title}</h1>
      <p class="rh-summary">{g.summary}</p>

      {g.note && (
        <p class="rh-note" role="note" data-testid="guide-note">
          <IconWarn size={18} />
          <span>{g.note}</span>
        </p>
      )}

      {g.callEmergency && (
        <div class="rh-sos" role="note" data-testid="guide-112">
          <span class="rh-sos-text">Mümkünse hemen 112'yi arayın</span>
          <a class="rh-sos-btn" href="tel:112" aria-label="112 acil çağrı numarasını ara">112</a>
        </div>
      )}

      <h2 class="rh-h">Adımlar</h2>
      <ol class="rh-steps">
        {g.steps.map((s, i) => (
          <li class={'rh-step' + (art[i] ? '' : ' plain')} key={i} data-testid="guide-step">
            {art[i] && <Art id={art[i]} />}
            <div class="rh-step-row">
              <span class="rh-num" aria-hidden="true">{i + 1}</span>
              <span class="rh-step-text">
                <span class="sr-only">Adım {i + 1}: </span>
                {s}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {g.dont && g.dont.length > 0 && (
        <>
          <h2 class="rh-h">Yapmayın</h2>
          <ul class="rh-dont">
            {g.dont.map((d, i) => (
              <li key={i}>
                <span class="rh-x" aria-hidden="true">✕</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p class="rh-src">Kaynaklar: {g.sources.join(' · ')}</p>

      {!g.reviewed && (
        <p class="rh-review" data-testid="guide-review">
          <IconWarn size={16} />
          <span>Bu rehber henüz bir {fromPack ? 'uzman' : 'sağlık profesyoneli'} tarafından incelenmedi.</span>
        </p>
      )}

      <button class="btn rh-ask" data-testid="guide-ask" onClick={() => go.ask(`${g.title}: ne yapmalıyım?`)}>
        <IconChat size={18} />
        Fener'e bu konuda soru sor
      </button>
    </article>
  );
}

export function RehberTab() {
  const s = useAppState();
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState<Origin>(null);
  // Rehber paketi yüklenince/silinince yeniden çizilir (paket rehberleri, arama dizini)
  const packV = usePackGuides();
  const packCats = getPackCategories();
  const open = getGuide(s.openGuideId);
  const cat: GuideCategory | undefined = CATEGORIES.find((c) => c.id === s.openCategoryId) ?? packCats.find((c) => c.id === s.openCategoryId);

  // Kaydırma konumu: ileri gidişte (ana ekran → kategori → rehber) en üstten başlar; geri
  // dönüşte (rehber → liste, kategori → ana ekran) listede kalınan yere dönülür.
  const view = open ? 'g:' + open.id : cat ? 'c:' + cat.id : 'h';
  const depth = open ? 2 : cat ? 1 : 0;
  const scrollMem = useRef(new Map<string, number>());
  const viewRef = useRef(view);
  const depthRef = useRef(depth);
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    const onScroll = () => scrollMem.current.set(viewRef.current, main.scrollTop);
    main.addEventListener('scroll', onScroll, { passive: true });
    return () => main.removeEventListener('scroll', onScroll);
  }, []);
  useLayoutEffect(() => {
    if (viewRef.current === view) return;
    const back = depth < depthRef.current;
    viewRef.current = view;
    depthRef.current = depth;
    const top = back ? scrollMem.current.get(view) ?? 0 : 0;
    document.getElementById('main')?.scrollTo({ top });
  }, [view]);

  // Alt menüden Rehber'e dokununca arama da temizlenir: ana ekran açılır
  const [tap] = useState(s.homeTap);
  useEffect(() => {
    if (s.homeTap !== tap) {
      setQuery('');
      setOrigin(null);
      scrollTop();
    }
  }, [s.homeTap]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const res = searchGuides(query, 50);
    // Yalnızca gövde metnindeki tesadüfi eşleşmeleri gizle ("dolar kaç tl" gibi)
    const top = res[0]?.score ?? 0;
    return res.filter((r) => r.score >= Math.max(2, top * 0.2)).map((r) => r.guide);
  }, [query, packV]);

  let body;
  if (open) {
    const fromCategory = cat && cat.guides.includes(open.id) ? cat : undefined;
    body = <GuideDetail g={open} fromCategory={fromCategory} origin={!fromCategory && origin?.id === open.id ? origin : null} />;
  } else if (cat) {
    body = <CategoryView c={cat} />;
  } else {
    body = (
      <div class="rh-home">
        <div class="rh-hero-bg" aria-hidden="true">
          <Art id={HERO_ART} />
        </div>
        <div class="rh-hero-glow" aria-hidden="true" />
        <div class="pad">
        <div class="rh-hero">
          <h2 class="rh-hero-title">Birlikte üstesinden geliriz</h2>
          <p class="rh-hero-sub">{GUIDES.length} rehber, adım adım ve çizimli. İnternet ve yapay zekâ gerekmez.</p>
        </div>
        <form
          class="rh-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            (e.currentTarget.querySelector('input') as HTMLInputElement | null)?.blur();
          }}
        >
          <label class="sr-only" for="guide-search">Rehberlerde ara</label>
          <input
            id="guide-search"
            type="search"
            data-testid="guide-search"
            placeholder="Ne oldu? Yazın…"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            autocomplete="off"
            enterKeyHint="search"
          />
          <button type="submit" class="rh-search-btn" aria-label="Ara">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
        </form>
        <div class="rh-sos-row" role="group" aria-label="Hayati durumlar">
          {SOS.map((x) => (
            <button
              key={x.id}
              class="rh-sos-chip"
              data-testid="guide-sos"
              data-guide-id={x.id}
              onClick={() => {
                setOrigin({ id: x.id, from: 'home' });
                go.guide(x.id);
              }}
            >
              {x.label}
            </button>
          ))}
        </div>
        {results ? (
          results.length ? (
            <div class="rh-list" role="list" aria-label="Arama sonuçları">
              {results.map((g) => (
                <div role="listitem" key={g.id}>
                  <GuideRow
                    g={g}
                    onOpen={(id) => {
                      setOrigin({ id, from: 'search' });
                      go.guide(id);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div class="rh-none" data-testid="guide-search-empty">
              <p class="empty">"{query.trim()}" için rehber bulunamadı. Başka bir kelime deneyin ya da Fener'e sorun.</p>
              <button class="btn rh-ask" data-testid="guide-search-ask" onClick={() => go.ask(query.trim())}>
                <IconChat size={18} />
                Fener'e sor
              </button>
            </div>
          )
        ) : (
          <div class="rh-cats" role="group" aria-label="Rehber kategorileri">
            {CATEGORIES.map((c) => (
              <CategoryTile key={c.id} c={c} />
            ))}
          </div>
        )}
        {!results && (
          <KendineYetmek installed={packCats.length > 0}>
            <div class="rh-cats" role="group" aria-label="Kendine Yetmek rehber kategorileri">
              {packCats.map((c) => (
                <CategoryTile key={c.id} c={c} />
              ))}
            </div>
          </KendineYetmek>
        )}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      {body}
    </>
  );
}
