// İndirilenler şeridi: inen, sırada bekleyen, duraklatılan ve hata veren içerikler.
// Kitaplığım'da özet (toplam ilerleme), mağazada ayrıntılı (her öğe için duraklat / devam / iptal).
import { cancelDownload, isActive, pauseDownload, type DlState } from '../../lib/downloader';
import { hepsiniDuraklat, useKuyruk } from '../../lib/indirme-kuyrugu';
import { pct, startRow, type RowModel } from '../../lib/packs-ui';
import { IcoPause, IcoPlay, IcoX, IcoDownload } from './ikonlar';
import { fmt, kalanSure, temizAd } from './veri';

export interface IndirmeOgesi {
  row: RowModel;
  dl?: DlState;
  durum: 'iniyor' | 'sirada' | 'duraklatildi' | 'hata';
}

/** Kütüphaneyi ilgilendiren (kitaplık ve rehber) indirmeler */
export function useIndirmeler(rows: RowModel[], dlFor: (r: RowModel) => DlState | undefined): IndirmeOgesi[] {
  const sira = useKuyruk();
  const out: IndirmeOgesi[] = [];
  for (const r of rows) {
    if (r.kind !== 'zim' && r.kind !== 'rehber') continue;
    const dl = dlFor(r);
    if (dl && isActive(dl)) out.push({ row: r, dl, durum: 'iniyor' });
    else if (sira.includes(r.file)) out.push({ row: r, dl, durum: 'sirada' });
    else if (dl?.status === 'paused') out.push({ row: r, dl, durum: 'duraklatildi' });
    else if (dl?.status === 'error') out.push({ row: r, dl, durum: 'hata' });
  }
  return out;
}

function toplamlar(list: IndirmeOgesi[]) {
  let total = 0;
  let done = 0;
  let speed = 0;
  for (const o of list) {
    total += o.dl?.total || o.row.size || 0;
    done += o.dl?.received ?? 0;
    if (o.durum === 'iniyor') speed += o.dl?.speed ?? 0;
  }
  return { total, done, speed, yuzde: total ? Math.min(100, Math.floor((done / total) * 100)) : 0 };
}

export const adOf = (r: RowModel) => (r.entry ? temizAd(r.entry.name) : r.name);

function durumMetni(o: IndirmeOgesi): string {
  const dl = o.dl;
  if (o.durum === 'sirada') return 'Sırada bekliyor';
  if (o.durum === 'hata') return 'Yarıda kaldı: ' + (dl?.error ?? 'bağlantı kesildi');
  if (!dl) return '';
  const p = pct(dl);
  if (o.durum === 'duraklatildi') return `Duraklatıldı · %${p} · kaldığı yerden sürer`;
  if (dl.status === 'hashing' || dl.status === 'verifying') return 'Bozuk olmadığı denetleniyor…';
  const kalan = kalanSure(dl.received, dl.total, dl.speed ?? 0);
  return `%${p} · ${fmt(dl.received)} / ${fmt(dl.total || o.row.size)}${kalan ? ' · ' + kalan : ''}`;
}

/** Kitaplığım'daki özet şerit */
export function IndirmeOzeti({ list, onOpen }: { list: IndirmeOgesi[]; onOpen: () => void }) {
  if (!list.length) return null;
  const t = toplamlar(list);
  const iniyor = list.filter((o) => o.durum === 'iniyor' || o.durum === 'sirada').length;
  const kalan = kalanSure(t.done, t.total, t.speed);
  return (
    <button class="kt-dl" style="text-align:left;color:var(--text)" data-testid="lib-dl-strip" onClick={onOpen}>
      <span class="kt-dl-head">
        <IcoDownload />
        <b>{iniyor ? `İndiriliyor · %${t.yuzde}` : `${list.length} indirme duraklatıldı`}</b>
        <span class="kt-link" aria-hidden="true">
          Gör →
        </span>
      </span>
      <span class="progress" style="display:block;width:100%" role="progressbar" aria-label="İndirme ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={t.yuzde}>
        <span style={{ display: 'block', height: '100%', width: t.yuzde + '%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))' }} />
      </span>
      <span class="kt-dl-st">
        {list.length === 1 ? adOf(list[0].row) : `${list.length} içerik`} · {fmt(t.done)} / {fmt(t.total)}
        {kalan ? ' · ' + kalan : ''}. Bitince Kitaplığım'da görünür.
      </span>
    </button>
  );
}

/** Mağazadaki ayrıntılı liste */
export function IndirmeListesi({ list }: { list: IndirmeOgesi[] }) {
  if (!list.length) return null;
  const t = toplamlar(list);
  const iniyor = list.some((o) => o.durum === 'iniyor' || o.durum === 'sirada');
  return (
    <section class="kt-dl" data-testid="lib-downloads" aria-label="İndirilenler">
      <div class="kt-dl-head">
        <b>{iniyor ? `İndiriliyor · %${t.yuzde}` : 'Duraklatılan indirmeler'}</b>
        {iniyor && (
          <button
            class="kt-ib"
            data-testid="lib-bar-pause"
            onClick={() => {
              hepsiniDuraklat();
              for (const o of list) if (o.dl && isActive(o.dl)) pauseDownload(o.dl.file);
            }}
          >
            <IcoPause />
            Hepsini duraklat
          </button>
        )}
      </div>
      {list.map((o) => (
        <div class="kt-dl-item" key={o.row.key} data-testid="lib-dl-item" data-pack={o.row.file} data-state={o.durum}>
          <div class="kt-dl-top">
            <span class="kt-dl-name">{adOf(o.row)}</span>
            {o.durum === 'iniyor' && o.dl && (
              <button class="kt-ib" aria-label={`Duraklat: ${adOf(o.row)}`} data-testid="lib-dl-pause" onClick={() => pauseDownload(o.dl!.file)}>
                <IcoPause />
              </button>
            )}
            {(o.durum === 'duraklatildi' || o.durum === 'hata') && (
              <button class="kt-ib" aria-label={`Devam et: ${adOf(o.row)}`} data-testid="lib-dl-resume" onClick={() => startRow(o.row)}>
                <IcoPlay />
              </button>
            )}
            {o.dl && (
              <button class="kt-ib" aria-label={`İptal: ${adOf(o.row)}`} data-testid="lib-dl-cancel" onClick={() => cancelDownload(o.dl!.file)}>
                <IcoX />
              </button>
            )}
          </div>
          {o.dl && o.durum !== 'hata' && (
            <div class="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct(o.dl)}>
              <div style={{ width: (o.dl.status === 'verifying' ? 100 : pct(o.dl)) + '%' }} />
            </div>
          )}
          <span class="kt-dl-st" data-testid="lib-dl-status">
            {durumMetni(o)}
          </span>
        </div>
      ))}
    </section>
  );
}
