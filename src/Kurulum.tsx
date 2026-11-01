// İlk açılış: "Hazırlanalım" ekranı. Cihazın boş yerine ve belleğine göre önerilen paketleri
// seçili getirir; tek dokunuşla hepsi indirilmeye başlar (indirmeler arka planda sürer).
// Hiç paket yoksa ilk açılışta kendiliğinden, sonra Araçlar → Paketler'den açılır.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { listPacks, formatSize } from './lib/packs';
import { PackRow, startRow, usePackRows, type RowModel } from './lib/packs-ui';
import { canSaveToDevice, isActive } from './lib/downloader';
import { getState, setState, useAppState } from './lib/store';

const LS_DONE = 'ac.kurulum';
const GB = 1024 ** 3;

const CSS = `
.ku { position: fixed; inset: 0; z-index: 60; background: radial-gradient(130% 55% at 50% -12%, rgba(245,165,36,0.16), rgba(245,165,36,0) 62%), var(--bg); overflow-y: auto; }
.ku-in { max-width: 640px; margin: 0 auto; padding: calc(24px + env(safe-area-inset-top)) 18px calc(28px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 16px; }
.ku-hero { display: flex; flex-direction: column; gap: 6px; }
.ku-hero h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.01em; }
.ku-hero p { margin: 0; font-size: 15px; line-height: 1.5; color: var(--text2); }
.ku-space { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted); }
.ku-bar { height: 8px; border-radius: 999px; background: var(--line2); overflow: hidden; display: flex; }
.ku-bar .u { background: var(--muted2); }
.ku-bar .s { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
.ku-group { display: flex; flex-direction: column; gap: 8px; }
.ku-group h2 { margin: 6px 0 0; font-size: 15px; font-weight: 600; }
.ku-item { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 64px; padding: 12px 14px; border-radius: 18px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); text-align: left; }
.ku-item[aria-checked='true'] { border-color: rgba(255,200,97,0.6); background: var(--accent-soft); }
.ku-item:disabled { opacity: 0.6; cursor: default; }
.ku-box { width: 26px; height: 26px; flex-shrink: 0; border-radius: 8px; border: 2px solid var(--line-input); display: flex; align-items: center; justify-content: center; color: var(--on-accent); }
.ku-item[aria-checked='true'] .ku-box { background: var(--accent); border-color: var(--accent); }
.ku-txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ku-txt b { font-size: 15px; font-weight: 600; }
.ku-txt span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.ku-size { font-size: 12.5px; color: var(--text2); white-space: nowrap; }
.ku-actions { position: sticky; bottom: 0; display: flex; flex-direction: column; gap: 8px; padding: 12px 0 4px; background: linear-gradient(180deg, rgba(14,27,44,0), var(--bg) 30%); }
.ku-actions .btn { min-height: 52px; font-size: 16px; }
.ku-note { margin: 0; font-size: 12.5px; color: var(--muted); line-height: 1.45; }
.ku .sh-pack { background: var(--card); border-radius: 16px; }
`;

type Item = { id: string; title: string; desc: string; group: 'hayati' | 'bilgi' | 'asistan'; on: boolean };

/** Cihaza göre önerilen seçimler (saf işlev; test edilir). */
export function recommendSetup(o: { freeBytes: number | null; memGB: number | null }): Item[] {
  const free = o.freeBytes ?? 8 * GB; // bilinmiyorsa orta halli bir cihaz varsay
  const mem = o.memGB ?? 4;
  const bigModel = mem >= 6 && free >= 10 * GB;
  return [
    { id: 'poi-tr-afet', group: 'hayati', title: 'Afet noktaları', desc: 'Toplanma alanı, hastane, eczane, su ve barınma noktaları', on: true },
    { id: 'harita-tr-genel', group: 'hayati', title: 'Türkiye haritası — genel', desc: 'İl, ilçe ve ana yollar', on: true },
    { id: 'harita-tr-detay', group: 'hayati', title: 'Türkiye haritası — sokak ayrıntılı', desc: 'Sokaklar ve binalar; yolunuzu bulmak için', on: free >= 6 * GB },
    { id: 'hava-tr', group: 'bilgi', title: 'Hava ve iklim', desc: 'Önümüzdeki ayların eğilimi ve il il iklim normalleri', on: true },
    { id: 'nhs-ilac', group: 'bilgi', title: 'İlaç rehberi', desc: 'Ne işe yarar, nasıl kullanılır, yan etkiler (İngilizce)', on: true },
    { id: 'kitap-su', group: 'bilgi', title: 'Su arıtma kitaplığı', desc: 'İçme suyu bulma, arıtma ve saklama (İngilizce)', on: true },
    { id: 'wikipedia-tr-mini', group: 'bilgi', title: 'Türkçe Vikipedi (özet)', desc: 'Tüm maddelerin giriş bölümleri', on: free >= 5 * GB },
    { id: 'wikimed-en-mini', group: 'bilgi', title: 'Tıp ansiklopedisi (özet)', desc: 'WikiMed, İngilizce', on: free >= 4 * GB },
    {
      id: bigModel ? 'fener-qwen3.5-2b' : 'fener-qwen3.5-0.8b',
      group: 'asistan',
      title: 'Fener — cihaz içi asistan',
      desc: bigModel ? 'Sorularınızı internetsiz yanıtlar (bu cihaz için daha yetenekli model)' : 'Sorularınızı internetsiz yanıtlar (bu cihaza uygun hafif model)',
      on: free >= 3 * GB,
    },
  ];
}

const GROUP_LABEL = { hayati: 'Hayati: harita ve noktalar', bilgi: 'Bilgi: kütüphane', asistan: 'Asistan' } as const;

/** Kurulum ekranı ilk açılışta gösterilmeli mi? (otomatik tarayıcı testlerinde gösterilmez) */
async function shouldAutoOpen(): Promise<boolean> {
  try {
    if (localStorage.getItem(LS_DONE)) return false;
    const q = new URLSearchParams(location.search);
    if (q.get('kurulum') === '1') return true;
    if ((navigator as any).webdriver || q.has('devmap') || q.has('devzim') || q.has('devmodel') || q.has('tab') || q.has('tool') || q.has('comm')) return false;
    return (await listPacks()).length === 0;
  } catch {
    return false;
  }
}

export function KurulumHost() {
  const s = useAppState();
  useEffect(() => {
    void shouldAutoOpen().then((yes) => yes && setState({ kurulum: true }));
  }, []);
  return s.kurulum ? <Kurulum /> : null;
}

function close() {
  try {
    localStorage.setItem(LS_DONE, '1');
  } catch {}
  setState({ kurulum: false });
}

function Kurulum() {
  const { manifest, rows, dlFor, rec, storage, memGB } = usePackRows();
  const free = storage && storage.quota ? storage.quota - storage.usage : null;
  const base = useMemo(() => recommendSetup({ freeBytes: free, memGB }), [free === null, memGB]);
  const [chosen, setChosen] = useState<Record<string, boolean> | null>(null);
  const [started, setStarted] = useState<string[] | null>(null);
  useEffect(() => {
    if (!chosen && storage) setChosen(Object.fromEntries(base.map((i) => [i.id, i.on])));
  }, [storage, base]);

  // Esc ile kapanır
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  const rowOf = (id: string): RowModel | undefined => rows.find((r) => r.entry?.id === id);
  const items = base.filter((i) => rowOf(i.id));
  const installed = (r?: RowModel) => !!r && (!!r.device || !!r.server);
  const sel = items.filter((i) => chosen?.[i.id] && !installed(rowOf(i.id)));
  const total = sel.reduce((a, i) => a + (rowOf(i.id)?.size ?? 0), 0);
  const tooBig = free !== null && total > free * 0.95;
  const saveable = canSaveToDevice();

  const start = () => {
    const ids = sel.map((i) => i.id);
    for (const id of ids) {
      const r = rowOf(id);
      if (r) void startRow(r);
    }
    setStarted(ids);
    try {
      localStorage.setItem(LS_DONE, '1');
    } catch {}
  };

  return (
    <div class="ku" role="dialog" aria-modal="true" aria-labelledby="ku-title" data-testid="kurulum">
      <style>{CSS}</style>
      <div class="ku-in">
        <div class="ku-hero">
          <h1 id="ku-title">Hazırlanalım</h1>
          <p>
            {started
              ? 'İndirmeler arka planda sürüyor. Uygulamayı şimdiden kullanabilirsiniz; ilerlemeyi Araçlar → Paketler\'den de izleyebilirsiniz.'
              : 'İnternet varken birkaç paketi indirin; afet anında harita, rehberler ve kütüphane internetsiz çalışır. Cihazınıza uygun olanları seçtik, isterseniz değiştirin.'}
          </p>
        </div>

        {!manifest || !chosen ? (
          <p class="empty">Hazırlanıyor…</p>
        ) : started ? (
          <div class="ku-group" data-testid="kurulum-progress">
            {started.map((id) => {
              const r = rowOf(id);
              return r ? <PackRow key={id} row={r} dl={dlFor(r)} memGB={memGB} recommended={rec.tier} /> : null;
            })}
          </div>
        ) : (
          <>
            {free !== null && (
              <div class="ku-space" data-testid="kurulum-space">
                <span>
                  Seçilenler: <b style="color:var(--text)">{formatSize(total)}</b> · Boş yer: {formatSize(free)}
                </span>
                <div class="ku-bar" aria-hidden="true">
                  <div class="s" style={{ width: Math.min(100, (total / Math.max(free, 1)) * 100) + '%' }} />
                </div>
              </div>
            )}
            {(['hayati', 'bilgi', 'asistan'] as const).map((g) => {
              const list = items.filter((i) => i.group === g);
              if (!list.length) return null;
              return (
                <div class="ku-group" key={g}>
                  <h2>{GROUP_LABEL[g]}</h2>
                  {list.map((i) => {
                    const r = rowOf(i.id)!;
                    const done = installed(r);
                    const dl = dlFor(r);
                    const on = done || !!chosen[i.id];
                    return (
                      <button
                        key={i.id}
                        class="ku-item"
                        role="checkbox"
                        aria-checked={on}
                        disabled={done || isActive(dl)}
                        data-testid="kurulum-item"
                        data-pack={i.id}
                        onClick={() => setChosen({ ...chosen, [i.id]: !chosen[i.id] })}
                      >
                        <span class="ku-box" aria-hidden="true">
                          {on && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M5 12l5 5 9-10" />
                            </svg>
                          )}
                        </span>
                        <span class="ku-txt">
                          <b>{i.title}</b>
                          <span>{done ? 'Kurulu' : isActive(dl) ? 'İndiriliyor…' : i.desc}</span>
                        </span>
                        <span class="ku-size">{(r.sizeApprox ? '~' : '') + formatSize(r.size)}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
            {tooBig && <p class="ku-note" style="color:var(--danger)">Seçilenler cihazdaki boş yerden büyük; birkaçını kaldırın.</p>}
            {!saveable && <p class="ku-note">Bu bağlantıda paketler cihaza kaydedilemiyor (güvenli bağlantı gerekli). Bilgi noktasındaki paketler yine de kullanılabilir.</p>}
            {!getState().online && <p class="ku-note">Şu an internet yok. İnternet ya da bir bilgi noktası bulunca bu ekrana Araçlar → Paketler'den dönebilirsiniz.</p>}
          </>
        )}

        <div class="ku-actions">
          {started ? (
            <button class="btn primary" data-testid="kurulum-close" onClick={close}>
              Uygulamaya geç
            </button>
          ) : (
            <>
              <button class="btn primary" data-testid="kurulum-start" disabled={!sel.length || tooBig || !saveable} onClick={start}>
                {sel.length ? `İndirmeye başla · ${formatSize(total)}` : 'Seçili paket yok'}
              </button>
              <button class="btn" data-testid="kurulum-skip" onClick={close}>
                Şimdilik geç
              </button>
            </>
          )}
          <p class="ku-note">Paketler Hugging Face ve Kiwix'ten indirilir; açık lisanslıdır. Daha fazlası: Kütüphane ve Araçlar → Paketler.</p>
        </div>
      </div>
    </div>
  );
}
