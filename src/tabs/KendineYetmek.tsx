// Rehber sekmesinin en altı: "Kendine Yetmek" rehber paketi.
// Yüklüyse kategorileri gösterir; değilse tek düğmeyle (hepsi tek dosya) indirilir.
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { isActive } from '../lib/downloader';
import { deleteDevicePack, formatSize } from '../lib/packs';
import { pct, speedText, startRow, usePackRows } from '../lib/packs-ui';
import { packErrors, reloadPackGuides } from '../content/pack-guides';

export const KY_ID = 'kendine-yetmek';

const CSS = `
.ky { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
/* Şafak: kehribar vurgu (uygulamanın diğer birincil düğmeleriyle aynı) */
.ky-card { background: linear-gradient(160deg, rgba(245,165,36,0.13), rgba(245,165,36,0.03)); border: 1px solid rgba(245,165,36,0.4); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.ky-card h2 { margin: 0; font-size: 18px; font-weight: 600; }
.ky-card p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--text2); }
.ky-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.ky-tags span { font-size: 12px; color: var(--text2); background: rgba(255,255,255,0.06); border-radius: 999px; padding: 4px 10px; }
.ky-btn { min-height: 52px; border-radius: 999px; border: 0; background: var(--accent); color: var(--on-accent); font-size: 16px; font-weight: 600; padding: 0 20px; }
.ky-btn:hover { background: var(--accent2); }
.ky-btn:disabled { opacity: 0.7; }
.ky-btn2 { background: var(--glass); border: 1px solid var(--line3); color: var(--text); font-weight: 500; }
.ky-btn2:hover { background: rgba(255,255,255,0.1); }
.ky-prog { height: 8px; border-radius: 4px; background: rgba(255,255,255,0.1); overflow: hidden; }
.ky-prog i { display: block; height: 100%; background: var(--accent); transition: width 0.3s; }
/* .ky-card p'den daha belirgin seçici: yoksa not ve hata yazısı düz paragraf gibi görünüyordu */
.ky-card .ky-note { font-size: 12.5px; color: var(--muted); margin: 0; line-height: 1.45; }
.ky-card .ky-err { font-size: 13px; color: var(--danger); margin: 0; line-height: 1.45; }
`;

/** Paket yüklüyse children (kategoriler), değilse indirme kartı */
export function KendineYetmek({ installed, children }: { installed: boolean; children: ComponentChildren }) {
  const { rows, dlFor } = usePackRows();
  const row = rows.find((r) => r.entry?.id === KY_ID);
  const dl = row ? dlFor(row) : undefined;
  const busy = isActive(dl);
  const [retrying, setRetrying] = useState(false);
  // Dosya cihazda (ya da bilgi noktasında) ama rehberler henüz okunmadı / okunamadı
  const onDevice = !!row?.device || !!row?.server;
  const openErr = onDevice ? packErrors[(row!.device ?? row!.server)!.id] : undefined;

  if (installed) {
    return (
      <section class="ky rh-pack-sub" aria-labelledby="rh-ky" data-testid="guide-pack-section">
        <style>{CSS}</style>
        <h2 class="rh-h" id="rh-ky">
          Kendine Yetmek
        </h2>
        <p class="rh-intro" style="margin:2px 0 10px">
          Uzun süre dışarıdan yardım gelmezse: yiyecek, su, barınak, ateş, giyim, enerji, tarım ve topluluk.
        </p>
        {children}
      </section>
    );
  }
  if (!row) return null;

  const size = formatSize(row.size);
  return (
    <section class="ky" data-testid="ky-card">
      <style>{CSS}</style>
      <div class="ky-card">
        <h2>Kendine Yetmek</h2>
        <p>
          Uzun süre dışarıdan yardım gelmezse yaşamı sürdürmek için adım adım, çizimli rehberler: yiyecek bulma ve saklama, su, hijyen ve sağlık, barınak, ateş ve
          pişirme, giyim ve zanaat, enerji, tarım ve hayvancılık, bilgi ve topluluk.
        </p>
        <div class="ky-tags" aria-hidden="true">
          <span>467 rehber</span>
          <span>1411 çizim</span>
          <span>{size}</span>
        </div>
        {onDevice && !busy ? (
          <>
            {openErr ? (
              <p class="ky-err" role="alert" data-testid="ky-open-error">
                Paket indi ama açılamadı: {openErr.slice(0, 2).join('; ')}
              </p>
            ) : (
              <p class="ky-note" data-testid="ky-opening">
                Paket indi, rehberler açılıyor…
              </p>
            )}
            {openErr && row.device && (
              // Bozuk dosya yeniden okumakla düzelmez: silip katalogdan yeniden indir
              <button
                class="ky-btn"
                data-testid="ky-redownload"
                disabled={retrying}
                onClick={async () => {
                  setRetrying(true);
                  try {
                    await deleteDevicePack(row.device!.id);
                    void startRow({ ...row, device: undefined, server: undefined });
                  } finally {
                    setRetrying(false);
                  }
                }}
              >
                Silip yeniden indir ({size})
              </button>
            )}
            <button
              class={'ky-btn' + (openErr && row.device ? ' ky-btn2' : '')}
              data-testid="ky-retry"
              disabled={retrying}
              onClick={() => {
                setRetrying(true);
                void reloadPackGuides().finally(() => setRetrying(false));
              }}
            >
              {retrying ? 'Açılıyor…' : 'Yeniden dene'}
            </button>
          </>
        ) : busy && dl ? (
          <>
            <div class="ky-prog" role="progressbar" aria-label="İndirme" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct(dl)}>
              <i style={{ width: pct(dl) + '%' }} />
            </div>
            <p class="ky-note" data-testid="ky-progress">
              {dl.status === 'verifying'
                ? 'İndi, doğrulanıyor…'
                : dl.status === 'hashing'
                  ? `Önceki kısım doğrulanıyor · %${pct(dl)}`
                  : `İndiriliyor · %${pct(dl)}${speedText(dl)}`}
            </p>
          </>
        ) : (
          <button class="ky-btn" data-testid="ky-download" onClick={() => void startRow(row)}>
            {dl?.status === 'paused' ? 'İndirmeye devam et' : dl?.status === 'error' ? `Yeniden dene (${size})` : `Hepsini indir (${size})`}
          </button>
        )}
        {dl?.status === 'error' && !onDevice && (
          <p class="ky-err" role="alert" data-testid="ky-download-error">
            İndirilemedi{dl.error ? ` (${dl.error})` : ''}. İnternet bağlantısını kontrol edip yeniden deneyin.
          </p>
        )}
        <p class="ky-note">Bir kez indirin, internet olmadan okuyun. Rehberler henüz uzmanlarca incelenmedi; her birinde bu uyarı görünür.</p>
      </div>
    </section>
  );
}
