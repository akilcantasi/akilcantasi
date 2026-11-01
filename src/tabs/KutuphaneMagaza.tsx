// Kütüphane sekmesindeki indirme bölümü: önerilen paketler + raflara ayrılmış tam koleksiyon.
// Paket satırları Araçlar → Paketler ile aynıdır (src/lib/packs-ui.tsx).
import { useMemo, useState } from 'preact/hooks';
import { SHELVES, SHELF_LABEL, SHELF_SHORT, type Shelf } from '../lib/manifest';
import { PackRow, UpdateBanner, usePackRows, type RowModel } from '../lib/packs-ui';
import { canSaveToDevice } from '../lib/downloader';
import { formatSize } from '../lib/packs';
import { go } from '../lib/store';

export const MAGAZA_CSS = `
.lm { display: flex; flex-direction: column; gap: 12px; }
.lm-head { display: flex; flex-direction: column; gap: 2px; }
.lm-head h2 { margin: 0; font-size: 18px; font-weight: 600; }
.lm-head p { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.45; }
.lm-list { display: flex; flex-direction: column; gap: 8px; }
.lm .sh-pack { background: var(--card); border-radius: 16px; gap: 6px; }
.lm .sh-pack[data-state='none'] .sh-pack-state { display: none; }
.lm .sh-pack[data-state='none'] .sh-pack-bottom { justify-content: flex-end; min-height: 0; margin-top: -40px; pointer-events: none; }
.lm .sh-pack[data-state='none'] .sh-pack-bottom .btn { pointer-events: auto; min-width: 88px; }
.lm .sh-pack[data-state='none'] .sh-tags { min-height: 44px; align-items: center; padding-right: 100px; }
.lm-item { display: flex; flex-direction: column; gap: 4px; }
@media (min-width: 600px) { .lm-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; } }
.lm .sh-pack.ready { border-color: rgba(79, 209, 165, 0.45); }
.lm-shelf-tag { display: inline-flex; align-self: flex-start; font-size: 11.5px; font-weight: 600; color: var(--accent2); }
.lm-toggle { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; min-height: 56px; padding: 0 16px; border-radius: 16px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); font-size: 15px; font-weight: 600; text-align: left; }
.lm-toggle:hover { border-color: rgba(255, 200, 97, 0.5); }
.lm-toggle small { display: block; font-size: 12.5px; font-weight: 400; color: var(--muted); }
.lm-toggle .lm-chev { font-size: 22px; color: var(--accent2); transition: transform 0.15s; }
.lm-toggle[aria-expanded='true'] .lm-chev { transform: rotate(90deg); }
.lm-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.lm-chips .chip { min-height: 40px; display: inline-flex; align-items: center; gap: 6px; }
.lm-chips .chip span { font-size: 11.5px; opacity: 0.75; }
.lm-group { display: flex; flex-direction: column; gap: 8px; }
.lm-group h3 { margin: 6px 0 0; font-size: 15px; font-weight: 600; }
.lm-note { margin: 0; font-size: 12.5px; color: var(--muted); line-height: 1.45; }
`;

function shelfOf(r: RowModel): Shelf | 'diger' {
  return r.entry?.shelf ?? 'diger';
}

export function LibraryStore({ startOpen = false }: { startOpen?: boolean }) {
  const { manifest, rows, dlFor, rec, storage, memGB } = usePackRows();
  const [open, setOpen] = useState(startOpen);
  const [shelf, setShelf] = useState<Shelf | 'hepsi'>('hepsi');

  const zims = useMemo(() => rows.filter((r) => r.kind === 'zim'), [rows]);
  const isMine = (r: RowModel) => !!r.device || !!r.server;
  const featured = zims.filter((r) => r.entry?.featured && (!isMine(r) || !!dlFor(r)));
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of zims) {
      const k = shelfOf(r);
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [zims]);
  const free = storage && storage.quota ? storage.quota - storage.usage : null;

  if (!manifest) return <p class="empty">İndirilebilir kitaplar yükleniyor…</p>;

  const groups: (Shelf | 'diger')[] = shelf === 'hepsi' ? [...SHELVES, 'diger'] : [shelf];

  return (
    <section class="lm" aria-labelledby="lm-title" data-testid="lib-store">
      <UpdateBanner rows={zims} dlFor={dlFor} />
      <div class="lm-head">
        <h2 id="lm-title">Önerilen indirmeler</h2>
        <p>
          İnternet varken indirin, sonra her yerde çevrimdışı okuyun.
          {free != null && free > 0 ? ` Cihazda yaklaşık ${formatSize(free)} boş yer var.` : ''}
        </p>
      </div>
      {!canSaveToDevice() && <p class="lm-note">Bu bağlantı güvenli değil (http); paketler cihaza kaydedilemez, bilgi noktasından okunur.</p>}

      {featured.length ? (
        <div class="lm-list" data-testid="lib-featured">
          {featured.map((r) => {
            const sh = shelfOf(r);
            return (
              <div key={r.key} class="lm-item">
                {sh !== 'diger' && <span class="lm-shelf-tag">{SHELF_SHORT[sh]}</span>}
                <PackRow row={r} dl={dlFor(r)} memGB={memGB} recommended={rec.tier} />
              </div>
            );
          })}
        </div>
      ) : (
        <p class="lm-note" data-testid="lib-featured-done">
          Önerilen paketlerin hepsi kurulu. Daha fazlası için tüm koleksiyona göz atın.
        </p>
      )}

      <button class="lm-toggle" data-testid="lib-catalog-toggle" aria-expanded={open} aria-controls="lm-catalog" onClick={() => setOpen(!open)}>
        <span>
          Tüm koleksiyon ({zims.length})
          <small>Ansiklopediler, ilaç rehberleri, telifsiz kitaplar, sözlükler…</small>
        </span>
        <span class="lm-chev" aria-hidden="true">
          ›
        </span>
      </button>

      {open && (
        <div id="lm-catalog" class="lm" data-testid="lib-catalog">
          <div class="lm-chips" role="group" aria-label="Raf">
            <button class="chip" aria-pressed={shelf === 'hepsi'} data-testid="lib-shelf" data-shelf="hepsi" onClick={() => setShelf('hepsi')}>
              Tümü <span>{zims.length}</span>
            </button>
            {SHELVES.filter((s) => counts[s]).map((s) => (
              <button key={s} class="chip" aria-pressed={shelf === s} data-testid="lib-shelf" data-shelf={s} onClick={() => setShelf(s)}>
                {SHELF_SHORT[s]} <span>{counts[s]}</span>
              </button>
            ))}
          </div>
          {groups.map((g) => {
            const list = zims.filter((r) => shelfOf(r) === g);
            if (!list.length) return null;
            return (
              <div class="lm-group" key={g} data-testid="lib-catalog-group" data-shelf={g}>
                <h3>{g === 'diger' ? 'Diğer paketler' : SHELF_LABEL[g]}</h3>
                {list.map((r) => (
                  <PackRow key={r.key} row={r} dl={dlFor(r)} memGB={memGB} recommended={rec.tier} />
                ))}
              </div>
            );
          })}
          <p class="lm-note">
            İngilizce paketlerdeki makaleleri, makaleyi açtıktan sonra Fener ile Türkçeye çevirebilirsiniz. Haritalar ve Fener modelleri için{' '}
            <button class="link-btn" style="display:inline;min-height:0;padding:0;color:var(--accent2)" onClick={() => go.tool('paylas')}>
              Araçlar → Paketler
            </button>
            .
          </p>
        </div>
      )}
    </section>
  );
}
