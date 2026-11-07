// Kütüphane sekmesinin biçemi ("Şafak": gece mavisi zemin, kehribar vurgu; kırmızı yok).
// Uygulamanın değişkenleri (src/styles/app.css) ve sınıfları (.btn, .card, .chip, .tag…) kullanılır.

/** Kategori renkleri: sakin, birbirinden ayırt edilir, beyaz yazı ≥ 7:1 */
export const KATEGORI_RENK: Record<string, [string, string]> = {
  ansiklopedi: ['#2f4f7d', '#213a5e'],
  saglik: ['#1d6560', '#154b47'],
  kitap: ['#6e4e22', '#523a18'],
  hayatta: ['#3b6141', '#2a472f'],
  pratik: ['#56407a', '#3e2e59'],
  dil: ['#2b5a78', '#1e425a'],
  diger: ['#3a4b64', '#2a384c'],
};

const renkler = Object.entries(KATEGORI_RENK)
  .map(([k, [a, b]]) => `.kt-k-${k} { --k1: ${a}; --k2: ${b}; }`)
  .join('\n');

export const KT_CSS = `
${renkler}
.kt { display: flex; flex-direction: column; gap: 16px; }
.kt-h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; }
.kt-sub { margin: 2px 0 0; font-size: 13.5px; color: var(--muted); line-height: 1.45; }
.kt-h2 { margin: 6px 0 0; font-size: 16px; font-weight: 600; display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.kt-h2 small { font-size: 12.5px; font-weight: 400; color: var(--muted); }
.kt-note { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5; }
.kt-link { min-height: 44px; display: inline-flex; align-items: center; gap: 6px; background: none; border: 0; padding: 0 2px; color: var(--accent2); font-size: 14px; font-weight: 500; text-align: left; }
.kt-links { display: flex; flex-wrap: wrap; gap: 4px 18px; }

/* Arama kutusu */
.kt-search { position: relative; display: flex; align-items: center; gap: 8px; }
.kt-search-box { position: relative; flex: 1; min-width: 0; }
.kt-search-box > svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.kt-search .input { padding-left: 44px; height: 50px; border-radius: 999px; font-size: 16px; }
.kt-search .input::-webkit-search-cancel-button { display: none; }
.kt-search-x { position: absolute; right: 4px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; border: 0; background: transparent; color: var(--muted); display: flex; align-items: center; justify-content: center; }
.kt-cancel { min-height: 44px; background: none; border: 0; color: var(--accent2); font-size: 14.5px; font-weight: 500; padding: 0 4px; flex-shrink: 0; }

/* Kaldığın yerden devam et */
.kt-cont { display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; padding: 14px; border-radius: 20px; border: 1px solid rgba(245, 165, 36, 0.4); background: linear-gradient(135deg, rgba(245, 165, 36, 0.16), rgba(245, 165, 36, 0.05)); color: var(--text); }
.kt-cont-ic { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(160deg, var(--k1), var(--k2)); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kt-cont-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.kt-cont-t small { font-size: 12px; font-weight: 600; color: var(--accent2); letter-spacing: 0.02em; }
.kt-cont-t b { font-size: 16px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.kt-cont-t span { font-size: 12.5px; color: var(--muted); }
.kt-cont-go { flex-shrink: 0; color: var(--accent2); }
.kt-bar5 { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.1); overflow: hidden; margin-top: 4px; }
.kt-bar5 i { display: block; height: 100%; background: var(--accent); border-radius: 2px; }

/* Koleksiyon kartları */
.kt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 10px; }
.kt-card { position: relative; min-height: 132px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; padding: 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: linear-gradient(160deg, var(--k1), var(--k2)); color: #fff; text-align: left; overflow: hidden; }
.kt-card:hover { border-color: rgba(255, 200, 97, 0.55); }
.kt-card-ic { width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.14); display: flex; align-items: center; justify-content: center; }
.kt-card-t { font-size: 15px; font-weight: 600; line-height: 1.28; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.kt-card-m { font-size: 12px; line-height: 1.35; color: rgba(255,255,255,0.86); display: flex; flex-direction: column; gap: 1px; }
.kt-card-badge { position: absolute; top: 12px; right: 12px; display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 999px; background: rgba(0,0,0,0.28); color: #fff; }
.kt-card.add { background: transparent; border: 1.5px dashed var(--line3); color: var(--accent2); align-items: flex-start; }
.kt-card.add .kt-card-ic { background: var(--accent-soft); }
.kt-card.err { opacity: 0.75; }

/* Satır listesi (son okunanlar, sonuçlar) */
.kt-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.kt-row { width: 100%; min-height: 56px; display: flex; align-items: center; gap: 12px; text-align: left; padding: 10px 12px; border-radius: 16px; border: 1px solid var(--line2); background: var(--card); color: var(--text); }
.kt-row:hover { border-color: var(--line3); }
.kt-dot { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(160deg, var(--k1), var(--k2)); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kt-row-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.kt-row-t b { font-size: 15px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; }
.kt-row-t span { font-size: 12.5px; color: var(--muted); line-height: 1.35; overflow-wrap: anywhere; }
.kt-row-t .kt-hl { color: var(--accent2); }
.kt-more { align-self: center; }

/* İndirme şeridi */
.kt-dl { display: flex; flex-direction: column; gap: 10px; padding: 14px; border-radius: 20px; background: var(--card); border: 1px solid var(--line2); }
.kt-dl-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.kt-dl-head b { flex: 1 1 150px; font-size: 15px; font-weight: 600; }
.kt-dl-item { display: flex; flex-direction: column; gap: 6px; }
.kt-dl-top { display: flex; align-items: center; gap: 10px; }
.kt-dl-name { flex: 1; min-width: 0; font-size: 14px; font-weight: 500; overflow-wrap: anywhere; }
.kt-dl-st { font-size: 12.5px; color: var(--muted); }
.kt-ib { min-width: 44px; min-height: 44px; border-radius: 999px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 12px; font-size: 14px; font-weight: 600; flex-shrink: 0; }
.kt-ib:disabled { opacity: 0.35; }
.kt-ib[aria-pressed='true'] { border-color: var(--accent); color: var(--accent2); }

/* Boş durum */
.kt-empty { display: flex; flex-direction: column; gap: 8px; padding: 2px 0; }
.kt-empty-row { display: flex; align-items: center; gap: 12px; }
.kt-empty-ic { width: 64px; height: 64px; border-radius: 20px; background: var(--accent-soft); color: var(--accent2); display: flex; align-items: center; justify-content: center; }
.kt-starter { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: 22px; background: var(--card); border: 1px solid rgba(245, 165, 36, 0.45); }
.kt-starter-top { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
.kt-starter-top > div { flex: 1 1 170px; min-width: 0; }
@media (max-width: 380px) { .kt-starter-top > .kt-empty-ic { display: none; } }
.kt-starter-top b { display: block; font-size: 16.5px; font-weight: 600; }
.kt-starter-top span { font-size: 13px; color: var(--muted); line-height: 1.45; }
.kt-starter ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
.kt-starter li { display: flex; align-items: center; gap: 10px; font-size: 14px; line-height: 1.35; }
.kt-starter li .kt-dot { width: 28px; height: 28px; border-radius: 8px; }
.kt-starter li > span:not(.kt-dot) { flex: 1; min-width: 0; }
.kt-starter li small { color: var(--muted); font-size: 12px; white-space: nowrap; }
.kt-big { min-height: 52px; border-radius: 16px; font-size: 15.5px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; }
.kt-skel { height: 132px; border-radius: 20px; background: linear-gradient(90deg, var(--card), var(--bg2), var(--card)); background-size: 200% 100%; animation: kt-sk 1.4s ease-in-out infinite; }
@keyframes kt-sk { from { background-position: 100% 0; } to { background-position: -100% 0; } }
@media (prefers-reduced-motion: reduce) { .kt-skel { animation: none; } }

/* Üst gezinme (geri) */
.kt-top { display: flex; align-items: center; gap: 8px; min-height: 44px; }
.kt-back { min-height: 44px; max-width: 100%; display: inline-flex; align-items: center; gap: 6px; background: var(--glass); border: 1px solid var(--glass-line); border-radius: 999px; color: var(--accent2); font-size: 14px; font-weight: 500; padding: 0 14px 0 10px; min-width: 0; }
.kt-back span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Koleksiyon ekranı */
.kt-banner { display: flex; flex-direction: column; gap: 10px; padding: 18px; border-radius: 22px; background: linear-gradient(160deg, var(--k1), var(--k2)); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
.kt-banner-top { display: flex; align-items: center; gap: 12px; }
.kt-banner .kt-card-ic { width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0; }
.kt-banner h1 { margin: 0; font-size: 21px; font-weight: 600; line-height: 1.25; overflow-wrap: anywhere; }
.kt-banner p { margin: 0; font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,0.9); }
.kt-banner-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.kt-banner-tags span { font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 999px; background: rgba(0,0,0,0.24); }
.kt-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.kt-actions .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; flex: 1 1 140px; }
.kt-details { border: 1px solid var(--line2); border-radius: 16px; background: var(--bg2); }
.kt-details > summary { min-height: 48px; display: flex; align-items: center; gap: 8px; padding: 0 14px; font-size: 14px; font-weight: 500; color: var(--text2); cursor: pointer; list-style: none; }
.kt-details > summary::-webkit-details-marker { display: none; }
.kt-details > summary::after { content: '›'; margin-left: auto; font-size: 20px; color: var(--muted); transition: transform 0.15s; }
.kt-details[open] > summary::after { transform: rotate(90deg); }
.kt-details-in { padding: 0 14px 14px; display: flex; flex-direction: column; gap: 10px; }
.kt-dl-list { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; font-size: 13px; }
.kt-dl-list dt { color: var(--muted); }
.kt-dl-list dd { margin: 0; color: var(--text2); overflow-wrap: anywhere; min-width: 0; }
.kt-confirm { display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 14px; background: var(--card); border: 1px solid var(--line3); }
.kt-confirm p { margin: 0; font-size: 14px; line-height: 1.45; }

/* Arama sonuçları */
.kt-chips { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; margin: 0 calc(-1 * var(--pad-x, 18px)); padding: 2px var(--pad-x, 18px); }
.kt-chips::-webkit-scrollbar { display: none; }
.kt-chips .chip { min-height: 44px; display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; }
.kt-chip-n { font-size: 11px; opacity: 0.75; }
.kt-hist { display: flex; flex-wrap: wrap; gap: 8px; }
.kt-hist .chip { min-height: 44px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.kt .empty, .kt .kt-note { overflow-wrap: anywhere; }
.kt-section { display: flex; align-items: center; justify-content: space-between; gap: 8px; }

/* Mağaza */
.kt-store-free { display: flex; flex-direction: column; gap: 6px; }
.kt-store-free div { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; color: var(--text2); flex-wrap: wrap; }
.kt-meter { height: 8px; border-radius: 4px; background: rgba(255,255,255,0.09); overflow: hidden; display: flex; }
.kt-meter i { display: block; height: 100%; background: var(--line3); }
.kt-meter i.on { background: var(--accent); }
.kt-needs { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; margin: 0 calc(-1 * var(--pad-x, 18px)); padding: 2px var(--pad-x, 18px); }
.kt-needs::-webkit-scrollbar { display: none; }
.kt-needs .chip { min-height: 44px; flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; }
.kt-sec { display: flex; flex-direction: column; gap: 10px; scroll-margin-top: 12px; }
.kt-sec-h { display: flex; align-items: center; gap: 12px; }
.kt-sec-h .kt-dot { width: 40px; height: 40px; border-radius: 12px; }
.kt-sec-h div { flex: 1; min-width: 0; }
.kt-sec-h b { display: block; font-size: 16px; font-weight: 600; }
.kt-sec-h span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.kt-item { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 18px; background: var(--card); border: 1px solid var(--line2); }
.kt-item.ready { border-color: rgba(79, 209, 165, 0.45); }
.kt-item-t { display: flex; flex-direction: column; gap: 3px; }
.kt-item-t b { font-size: 15px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; }
.kt-item-t span { font-size: 13px; color: var(--text2); line-height: 1.45; }
.kt-item-m { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 12.5px; color: var(--muted); }
.kt-item-m .tag { font-size: 11.5px; padding: 2px 8px; }
.kt-fit-kucuk, .kt-fit-orta { color: var(--ok); }
.kt-fit-buyuk, .kt-fit-yer-yok { color: var(--accent2); }
.kt-item-b { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 46px; }
.kt-item-b .btn { display: inline-flex; align-items: center; gap: 8px; }
.kt-item-b .grow { min-width: 0; font-size: 12.5px; color: var(--muted); }
.kt-item-b .ok { color: var(--ok); font-weight: 600; font-size: 13px; }
.kt-item .progress { height: 6px; }
.kt-item .kt-details { background: transparent; border: 0; border-top: 1px solid var(--line2); border-radius: 0; margin: 0 -14px -14px; }
.kt-item .kt-details > summary { min-height: 44px; font-size: 13px; color: var(--muted); }
.kt-sets { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
.kt-set { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 18px; background: var(--card); border: 1px solid var(--line2); }
.kt-set b { font-size: 15px; font-weight: 600; }
.kt-set p { margin: 0; font-size: 13px; color: var(--text2); line-height: 1.45; }
.kt-set .kt-item-b span { flex: 1 1 120px; font-size: 12.5px; color: var(--muted); }

/* Yönet */
.kt-man { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 16px; background: var(--card); border: 1px solid var(--line2); }
.kt-man-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.kt-man-t b { font-size: 14.5px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; }
.kt-man-t span { font-size: 12.5px; color: var(--muted); }
.kt-man-wrap { display: flex; flex-direction: column; gap: 8px; }
.kt-toast { position: sticky; bottom: 12px; z-index: 8; align-self: center; max-width: 100%; background: #2a3d57; color: var(--text); border: 1px solid var(--line3); border-radius: 14px; padding: 10px 14px; font-size: 13.5px; line-height: 1.4; box-shadow: 0 8px 24px rgba(0,0,0,0.35); }
`;

/** Okuyucu (makale) biçemi */
export const OKUYUCU_CSS = `
.kt-bar { position: sticky; top: 0; z-index: 5; background: var(--bg); display: flex; flex-direction: column; gap: 8px; padding: 8px var(--pad-x, 18px); margin: -14px calc(-1 * var(--pad-x, 18px)) 0; border-bottom: 1px solid var(--line); }
.kt-bar.kt-bar-flat { position: relative; }
.kt-bar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.kt-bar-row .kt-back { flex: 1 1 96px; }
.kt-bar-tools { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.kt-panel { display: flex; flex-direction: column; gap: 8px; padding: 2px 0 4px; }
.kt-panel-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 13px; color: var(--muted); font-weight: 600; }
.kt-size { display: flex; align-items: center; gap: 10px; }
.kt-size .kt-ib { font-weight: 700; }
.kt-size-dots { flex: 1; display: flex; justify-content: space-between; align-items: center; gap: 4px; }
.kt-size-dots { justify-content: space-evenly; min-height: 44px; }
.kt-size-dots i { display: block; width: 10px; height: 10px; border-radius: 50%; background: var(--line3); flex-shrink: 0; }
.kt-size-dots i.on { background: var(--accent); width: 16px; height: 16px; }
.kt-toc { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; max-height: calc(46vh / var(--ui-scale, 1)); overflow-y: auto; overscroll-behavior: contain; }
.kt-toc button { width: 100%; min-height: 44px; text-align: left; background: none; border: 0; border-bottom: 1px solid var(--line); color: var(--text2); font-size: 14.5px; padding: 6px 4px; line-height: 1.35; }
.kt-toc button.sub { padding-left: 20px; font-size: 13.5px; color: var(--muted); }
.kt-find { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.kt-find .input { height: 44px; flex: 1 1 110px; }
.kt-find-n { font-size: 12px; color: var(--muted); min-width: 52px; text-align: center; }
.kt-src-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.kt-src-chip { display: inline-flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 12px 0 4px; border-radius: 999px; background: var(--glass); border: 1px solid var(--glass-line); color: var(--text2); font-size: 12.5px; font-weight: 500; }
.kt-src-chip .kt-dot { width: 24px; height: 24px; border-radius: 50%; }
.kt-title { font-size: 26px; font-weight: 600; line-height: 1.25; margin: 0; letter-spacing: -0.01em; overflow-wrap: anywhere; }
.kt-tools { display: flex; flex-wrap: wrap; gap: 8px; }
.kt-tools .btn { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; font-size: 13.5px; padding: 0 14px; border-radius: 999px; }
.kt-body { font-size: var(--kt-fs, 17px); line-height: 1.65; color: var(--text2); overflow-wrap: anywhere; }
.kt-body > :first-child { margin-top: 0; }
.kt-body p { margin: 0 0 0.85em; }
.kt-body h1 { display: none; }
.kt-body h2, .kt-body h3, .kt-body h4 { color: var(--text); line-height: 1.3; margin: 1.4em 0 0.5em; }
.kt-body h2 { font-size: 1.22em; padding-bottom: 6px; border-bottom: 1px solid var(--line2); }
.kt-body h3 { font-size: 1.07em; }
.kt-body h4 { font-size: 0.95em; }
.kt-body a { color: var(--accent2); text-decoration: none; }
.kt-body a[data-ext] { color: var(--blue); }
.kt-body a:not([href]) { color: inherit; }
.kt-body a:hover { text-decoration: underline; }
.kt-body [id] { scroll-margin-top: 140px; }
.kt-body ul, .kt-body ol { padding-left: 22px; margin: 0 0 0.85em; }
.kt-body li { margin-bottom: 4px; }
.kt-body img { max-width: 100%; height: auto; border-radius: 8px; background: var(--bg2); }
.kt-body figure { margin: 12px 0; padding: 10px; background: var(--card); border: 1px solid var(--line2); border-radius: 12px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.kt-body figcaption { font-size: 0.82em; color: var(--muted); line-height: 1.4; }
.kt-body .kt-table { overflow-x: auto; margin: 0 0 12px; }
.kt-body table { border-collapse: collapse; font-size: 0.86em; }
.kt-body th, .kt-body td { border: 1px solid var(--line2); padding: 6px 8px; text-align: left; vertical-align: top; overflow-wrap: break-word; }
.kt-body th { background: var(--card); color: var(--text); }
.kt-body blockquote { margin: 0 0 12px; padding: 4px 12px; border-left: 3px solid var(--line3); color: var(--muted); }
.kt-body sup, .kt-body sub { line-height: 0; }
.kt-body pre, .kt-body code { font-family: var(--code); font-size: 0.82em; background: var(--bg2); border-radius: 6px; }
.kt-body pre { padding: 10px; overflow-x: auto; white-space: pre-wrap; }
.kt-body .mw-editsection, .kt-body .noprint, .kt-body .subpages { display: none; }
.kt-body details > summary { cursor: pointer; }
/* Çok büyük sayfalar (Okuyucu.tsx ArticleBody): ekran dışındaki bölümlerin yerleşimi atlanır;
   "auto" bir kez çizilen bölümün gerçek yüksekliğini hatırlar (kaydırma çubuğu oturur) */
.kt-body.kt-buyuk .kt-blok { content-visibility: auto; contain-intrinsic-size: auto 3.5em; }
.kt-body mark.kt-mark { background: rgba(245, 165, 36, 0.28); color: inherit; border-radius: 3px; }
.kt-body mark.kt-mark.cur { background: var(--accent); color: var(--on-accent); }
.kt-end { display: flex; flex-direction: column; gap: 10px; padding-top: 14px; border-top: 1px solid var(--line2); }
.kt-file, .kt-books { display: flex; flex-direction: column; gap: 10px; }
.kt-file > p, .kt-books > p { margin: 0; }
.kt-file .row, .kt-book .row { flex-wrap: wrap; }
.kt-book-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.kt-book { padding: 14px; border-radius: 16px; background: var(--card); border: 1px solid var(--line2); display: flex; flex-direction: column; gap: 6px; }
.kt-book-title { font-weight: 600; font-size: 15px; line-height: 1.3; }
.kt-book-meta { font-size: 12.5px; color: var(--muted); }
.kt-book-desc { font-size: 13.5px; line-height: 1.5; color: var(--text2); }
.kt-book .btn, .kt-file .btn { min-height: 44px; display: inline-flex; align-items: center; gap: 8px; }
.kt-small { font-size: 12.5px; }
.kt-media { display: block; max-width: 100%; border-radius: 12px; background: var(--bg2); }
audio.kt-media { width: 100%; }
.kt-pre { padding: 12px; white-space: pre-wrap; overflow-wrap: anywhere; font-family: var(--code); font-size: 13px; color: var(--text2); max-height: 70vh; overflow: auto; }
/* Koleksiyon dizini (Dizin.tsx): harf şeridi ve "devamını göster" */
.kt-harfler .chip { min-width: 44px; justify-content: center; padding: 0 12px; }
.kt-dizin-alt { display: flex; justify-content: center; padding: 4px 0 8px; }
`;
