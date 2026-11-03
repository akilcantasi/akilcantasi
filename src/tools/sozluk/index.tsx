// Acil durum cümleleri: kurtarma ekipleri ve barınaklarda Türkçe bilmeyen kişilerle konuşmak için.
// Kaynak notları: ./phrases.ts başındaki açıklama.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { CATS, LANGS, searchPhrases, type Cat, type Lang, type Phrase } from './phrases';
import { findVoice, speak, stopSpeaking, useVoices } from './speech';

const CSS = `
.sz-note { font-size: 13px; color: var(--muted); line-height: 1.45; margin: 0; }
.sz-langs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
.sz-langs::-webkit-scrollbar { display: none; }
.sz-lang { min-height: 44px; white-space: nowrap; border-radius: 12px; padding: 0 12px; border: 1px solid var(--line3); background: var(--card); color: var(--text); font-weight: 600; font-size: 14px; display: flex; flex-direction: column; justify-content: center; line-height: 1.1; }
.sz-lang small { font-weight: 400; font-size: 11px; color: var(--muted); }
.sz-lang[aria-pressed='true'] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.sz-lang[aria-pressed='true'] small { color: #3a2a06; }
.sz-cats { display: flex; gap: 6px; flex-wrap: wrap; }
.sz-cats .chip { min-height: 44px; }
.sz-list { display: flex; flex-direction: column; gap: 10px; }
.sz-item { background: var(--card); border: 1px solid var(--line2); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.sz-tr { font-size: 15px; color: var(--text2); }
.sz-t { font-size: 22px; font-weight: 600; line-height: 1.3; color: var(--text); word-break: break-word; }
.sz-t[dir='rtl'] { text-align: right; font-size: 26px; }
.sz-p { font-size: 15px; color: var(--accent); font-family: var(--mono); line-height: 1.35; }
.sz-acts { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px; }
.sz-acts .btn { min-width: 44px; }
.sz-flag { align-self: flex-start; font-size: 11.5px; color: #ffcf7a; border: 1px solid rgba(245,165,36,0.45); border-radius: 6px; padding: 2px 6px; }
.sz-all { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--line2); padding-top: 8px; }
.sz-all-row { display: flex; flex-direction: column; gap: 2px; }
.sz-all-row b { font-size: 12px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.sz-all-row span { font-size: 17px; }
.sz-big { position: fixed; inset: 0; z-index: 1000; background: #fff; color: #000; display: flex; flex-direction: column; padding: 18px; padding-top: calc(18px + var(--sa-top)); gap: 16px; overflow-y: auto; }
.sz-big-t { font-size: clamp(34px, 11vw, 72px); font-weight: 700; line-height: 1.2; word-break: break-word; flex: 1; display: flex; align-items: center; }
.sz-big-t[dir='rtl'] { justify-content: flex-end; text-align: right; }
.sz-big-p { font-size: 22px; color: #333; font-family: var(--mono); }
.sz-big-tr { font-size: 18px; color: #555; }
.sz-big-bar { display: flex; gap: 10px; }
.sz-big-bar button { min-height: 56px; flex: 1; border-radius: 12px; font-size: 17px; font-weight: 600; border: 2px solid #000; background: #fff; color: #000; }
.sz-big-bar button.primary { background: #000; color: #fff; }
`;

const LS_KEY = 'akil.sozluk.lang';

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LS_KEY) as Lang | null;
    if (v && LANGS.some((l) => l.id === v)) return v;
  } catch {
    /* yok say */
  }
  return 'en';
}

export default function Sozluk() {
  const [lang, setLang] = useState<Lang>(loadLang);
  const [cat, setCat] = useState<Cat | 'all'>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [big, setBig] = useState<Phrase | null>(null);
  const voices = useVoices();
  const L = LANGS.find((l) => l.id === lang)!;
  const voice = findVoice(L.speech, voices);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, lang);
    } catch {
      /* yok say */
    }
  }, [lang]);
  useEffect(() => () => stopSpeaking(), []);

  const list = useMemo(() => searchPhrases(q, cat), [q, cat]);

  return (
    <div style="display:flex;flex-direction:column;gap:12px" data-testid="sozluk">
      <style>{CSS}</style>
      <p class="sz-note">
        Cümleye dokunun, karşınızdakine <b>büyük göster</b> ile ekranı çevirin. Okunuş satırı Türkçe harflerle yazılmıştır.
      </p>
      <div class="sz-langs" role="group" aria-label="Dil seçimi">
        {LANGS.map((l) => (
          <button key={l.id} class="sz-lang" aria-pressed={lang === l.id} data-testid={'sz-lang-' + l.id} onClick={() => setLang(l.id)}>
            {l.name}
            <small>{l.native}</small>
          </button>
        ))}
      </div>
      <input
        class="input"
        type="search"
        placeholder="Ara: su, doktor, aile…"
        value={q}
        onInput={(e) => setQ((e.target as HTMLInputElement).value)}
        data-testid="sz-search"
        aria-label="Cümle ara"
      />
      <div class="sz-cats" role="group" aria-label="Kategori">
        <button class="chip" aria-pressed={cat === 'all'} data-testid="sz-cat-all" onClick={() => setCat('all')}>
          Tümü
        </button>
        {CATS.map((c) => (
          <button key={c.id} class="chip" aria-pressed={cat === c.id} data-testid={'sz-cat-' + c.id} onClick={() => setCat(c.id)}>
            {c.name}
          </button>
        ))}
      </div>
      <div class="label" data-testid="sz-count">
        {list.length} cümle · {L.name}
        {!voice && ' · bu cihazda sesli okuma yok'}
      </div>
      {list.length === 0 && (
        <p class="empty" data-testid="sz-empty">
          “{q}” için cümle bulunamadı. Daha kısa bir kelime deneyin.
        </p>
      )}
      <div class="sz-list">
        {list.map((p) => {
          const t = p.l[lang];
          const isOpen = open === p.id;
          return (
            <div class="sz-item" key={p.id} data-testid={'sz-item-' + p.id}>
              <div class="sz-tr">{p.tr}</div>
              {t ? (
                <>
                  <div class="sz-t" dir={L.rtl ? 'rtl' : 'auto'} lang={lang} data-testid={'sz-t-' + p.id}>
                    {t.t}
                  </div>
                  {t.p && <div class="sz-p">{t.p}</div>}
                  {t.verified === false && (
                    <span class="sz-flag" title="Bu çeviri bir kaynakla birebir doğrulanamadı">
                      kontrol edilmedi
                    </span>
                  )}
                </>
              ) : (
                <div class="empty">Bu dilde çeviri yok.</div>
              )}
              <div class="sz-acts">
                <button class="btn primary" disabled={!t} data-testid={'sz-big-' + p.id} onClick={() => setBig(p)}>
                  Büyük göster
                </button>
                <button
                  class="btn"
                  disabled={!t || !voice}
                  aria-label="Sesli oku"
                  title={voice ? 'Sesli oku' : 'Bu cihazda bu dil için ses yok'}
                  data-testid={'sz-say-' + p.id}
                  onClick={() => t && voice && speak(t.t, voice)}
                >
                  <Speaker />
                </button>
                <button class="btn" aria-expanded={isOpen} data-testid={'sz-all-' + p.id} onClick={() => setOpen(isOpen ? null : p.id)}>
                  {isOpen ? 'Kapat' : 'Tüm diller'}
                </button>
              </div>
              {isOpen && (
                <div class="sz-all" data-testid={'sz-alllist-' + p.id}>
                  {LANGS.map((l) => {
                    const x = p.l[l.id];
                    return (
                      <div class="sz-all-row" key={l.id}>
                        <b>{l.name}</b>
                        <span dir={l.rtl ? 'rtl' : 'auto'} lang={l.id}>
                          {x ? x.t : '—'}
                        </span>
                        {x?.p && <span class="sz-p">{x.p}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p class="sz-note">
        Kaynaklar: Boğaziçi Üniversitesi TermQuake afet terimleri sözlüğü, 50LANGUAGES (Goethe Verlag) dersleri, Omniglot.
        “Kontrol edilmedi” etiketli çeviriler bir kaynakla birebir doğrulanamadı; kısa tutun, işaret ve el hareketiyle destekleyin.
        Arapça: Standart Arapça. Farsça: İran Farsçası (Dari konuşanlar genelde anlar). Kürtçe: Kurmancî.
      </p>
      {big && big.l[lang] && (
        <div class="sz-big" role="dialog" aria-label="Büyük gösterim" data-testid="sz-bigview">
          <div class="sz-big-bar">
            <button class="primary" data-testid="sz-big-close" onClick={() => setBig(null)}>
              Kapat
            </button>
            {voice && (
              <button data-testid="sz-big-say" onClick={() => speak(big.l[lang]!.t, voice)}>
                <Speaker /> Oku
              </button>
            )}
          </div>
          <div class="sz-big-t" dir={L.rtl ? 'rtl' : 'auto'} lang={lang} data-testid="sz-big-text">
            {big.l[lang]!.t}
          </div>
          {big.l[lang]!.p && <div class="sz-big-p">{big.l[lang]!.p}</div>}
          <div class="sz-big-tr">Türkçe: {big.tr}</div>
        </div>
      )}
    </div>
  );
}


function Speaker() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="vertical-align:-5px">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>
  );
}
