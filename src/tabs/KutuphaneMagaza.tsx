// Kütüphane sekmesindeki kitaplık bölümü (harman tasarım):
//  • Durum kartı: Temel setin yüzdesi, yüklü paket sayısı/boyutu, güncellemeler; "Yönet" ile yüklüler
//  • Hızlı seçim: Önerilenler / Yerimi doldur / Temizle
//  • Paket setleri: her setin ilerlemesi ve (yüklüler düşülmüş) kalan boyutu; dokununca seçilir
//  • Alt çubuk: seçilenlerin toplamı ve "İndir"; inerken toplu ilerleme, hız ve "Duraklat"
//  • Tek tek seçmek isteyene raflara ayrılmış tüm koleksiyon
// Paket satırları Araçlar → Paketler ile aynıdır (src/lib/packs-ui.tsx).
import { useMemo, useState } from 'preact/hooks';
import { SHELVES, SHELF_LABEL, SHELF_SHORT, type Shelf } from '../lib/manifest';
import { PackRow, UpdateBanner, usePackRows, type RowModel } from '../lib/packs-ui';
import { canSaveToDevice, isActive, pauseDownload } from '../lib/downloader';
import { formatSize } from '../lib/packs';
import { go } from '../lib/store';
import { hazir, kuyruk, setDurumu, setleriAl, sigdir, toplam } from '../lib/setler';
import { hepsiniDuraklat, kuyrugaEkle, useKuyruk } from '../lib/indirme-kuyrugu';

export const MAGAZA_CSS = `
.lm { display: flex; flex-direction: column; gap: 12px; }
.lm-list { display: flex; flex-direction: column; gap: 8px; }
.lm .sh-pack { background: var(--card); border-radius: 16px; gap: 6px; }
.lm .sh-pack.ready { border-color: rgba(79, 209, 165, 0.45); }
.lm-h { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; margin-top: 4px; }
.lm-h h2 { margin: 0; font-size: 16px; font-weight: 600; }
.lm-h span { font-size: 12.5px; color: var(--muted); }
/* durum kartı */
.lm-status { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; background: var(--card); border: 1px solid var(--line2); border-radius: 20px; padding: 12px 14px; }
.lm-ring { width: 62px; height: 62px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lm-ring b { width: 48px; height: 48px; border-radius: 50%; background: var(--card); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
.lm-status-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.lm-status-t b { font-size: 15.5px; font-weight: 600; }
.lm-status-t span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.lm-status-t span.upd { color: var(--ok); }
.lm-manage { min-height: 44px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--glass-line); background: transparent; color: var(--accent2); font-size: 13.5px; font-weight: 600; flex-shrink: 0; }
.lm-manage[aria-expanded='true'] { background: var(--glass); }
.lm-panel { display: flex; flex-direction: column; gap: 8px; }
/* hızlı seçim */
.lm-quick { display: flex; flex-wrap: wrap; gap: 8px; }
.lm-quick button { flex: 1 1 auto; min-height: 44px; border-radius: 999px; font-size: 13.5px; font-weight: 600; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); padding: 0 10px; }
.lm-quick button[aria-pressed='true'] { background: var(--accent); color: var(--on-accent); border-color: transparent; }
.lm-quick button.clear { flex: 0 0 auto; background: transparent; color: var(--text2); font-weight: 500; }
/* setler */
.lm-sets { display: flex; flex-direction: column; gap: 10px; }
@media (min-width: 600px) { .lm-sets, .lm-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; } }
.lm-set { background: var(--card); border: 1px solid var(--line2); border-radius: 20px; padding: 13px 14px; display: flex; flex-direction: column; gap: 9px; }
.lm-set.on { border: 2px solid var(--accent); padding: 12px 13px; }
.lm-set-top { display: flex; gap: 12px; align-items: center; }
.lm-set-ic { width: 42px; height: 42px; border-radius: 13px; background: var(--accent-soft); color: var(--accent2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; font-weight: 700; }
.lm-set-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.lm-set-t b { font-size: 15px; font-weight: 600; }
.lm-set-t span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.lm-prog { height: 5px; border-radius: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
.lm-prog i { display: block; height: 100%; border-radius: 3px; background: var(--ok); }
.lm-set-bottom { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.lm-set-bottom > span { flex: 1 1 150px; min-width: 0; font-size: 12.5px; color: var(--text2); }
.lm-pick { min-height: 44px; min-width: 108px; padding: 0 14px; border-radius: 999px; font-size: 13.5px; font-weight: 600; border: 1px solid rgba(245,165,36,0.55); background: transparent; color: var(--accent2); }
.lm-pick[aria-pressed='true'] { background: var(--accent); color: var(--on-accent); border-color: transparent; }
.lm-pick.done { background: rgba(79,209,165,0.14); color: var(--ok); border-color: transparent; }
/* alt çubuk */
.lm-bar { position: sticky; bottom: 10px; z-index: 6; margin-top: 4px; background: var(--accent); color: var(--on-accent); border-radius: 18px; padding: 8px 8px 8px 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
.lm-bar-fill { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(255,255,255,0.3); transition: width 0.4s; }
.lm-bar-t { position: relative; flex: 1 1 160px; min-width: 0; overflow-wrap: anywhere; display: flex; flex-direction: column; }
.lm-bar-t b { font-size: 14.5px; font-weight: 700; }
.lm-bar-t span { font-size: 12px; }
.lm-bar button { position: relative; background: #1a1206; color: var(--accent2); border: 0; border-radius: 999px; min-height: 44px; padding: 0 18px; font-size: 14px; font-weight: 600; flex-shrink: 0; }
.lm-bar button:disabled { opacity: 0.6; }
/* tüm koleksiyon */
.lm-toggle { overflow-wrap: anywhere; display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; min-height: 56px; padding: 0 16px; border-radius: 16px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); font-size: 15px; font-weight: 600; text-align: left; }
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

const LS_SEL = 'ac.lib.setler';
const LS_MODE = 'ac.lib.secimTuru';

function loadSel(): { sel: string[]; mode: 'rec' | 'fit' | 'manual' } {
  try {
    const s = JSON.parse(localStorage.getItem(LS_SEL) ?? 'null');
    const m = localStorage.getItem(LS_MODE) as any;
    if (Array.isArray(s)) return { sel: s.filter((x) => typeof x === 'string'), mode: m === 'fit' || m === 'manual' ? m : 'rec' };
  } catch {}
  return { sel: ['temel'], mode: 'rec' };
}

function shelfOf(r: RowModel): Shelf | 'diger' {
  return r.entry?.shelf ?? 'diger';
}

const fmt = (b: number) => formatSize(Math.max(0, b));

export function LibraryStore() {
  const { manifest, rows, dlFor, rec, storage, memGB } = usePackRows();
  const bekleyen = useKuyruk();
  const [{ sel, mode }, setChoice] = useState(loadSel);
  const [manage, setManage] = useState(false);
  const [open, setOpen] = useState(false);
  const [shelf, setShelf] = useState<Shelf | 'hepsi'>('hepsi');

  const zims = useMemo(() => rows.filter((r) => r.kind === 'zim'), [rows]);
  const byId = useMemo(() => new Map(zims.filter((r) => r.entry).map((r) => [r.entry!.id, r])), [zims]);
  const setler = useMemo(() => setleriAl(manifest?.sets, new Set(byId.keys())), [manifest, byId]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of zims) c[shelfOf(r)] = (c[shelfOf(r)] ?? 0) + 1;
    return c;
  }, [zims]);

  if (!manifest) return <p class="empty">İndirilebilir kitaplar yükleniyor…</p>;

  const free = storage && storage.quota ? storage.quota - storage.usage : null;
  const save = (s: string[], m: 'rec' | 'fit' | 'manual') => {
    setChoice({ sel: s, mode: m });
    try {
      localStorage.setItem(LS_SEL, JSON.stringify(s));
      localStorage.setItem(LS_MODE, m);
    } catch {}
  };
  const inQueue = (r: RowModel) => bekleyen.includes(r.file);
  const aktif = (r: RowModel) => isActive(dlFor(r)) || inQueue(r);

  const durum = setler.map((s) => setDurumu(s, byId));
  const temel = durum[0];
  const ringPct = temel && temel.total ? Math.round((temel.have / temel.total) * 100) : 0;
  const yuklu = zims.filter(hazir);
  const yukluBytes = yuklu.reduce((a, r) => a + (r.device?.size ?? r.server?.size ?? 0), 0);
  const guncel = zims.filter((r) => r.outdated && hazir(r)).length;

  const q = kuyruk(sel, setler, byId, aktif);
  const qBytes = toplam(q);
  const inen = zims.filter(aktif);
  const inenTotal = inen.reduce((a, r) => a + (dlFor(r)?.total || r.size || 0), 0);
  const inenDone = inen.reduce((a, r) => a + (dlFor(r)?.received ?? 0), 0);
  const speed = inen.reduce((a, r) => a + (dlFor(r)?.speed ?? 0), 0);
  const yerYok = free != null && qBytes > free;

  const groups: (Shelf | 'diger')[] = shelf === 'hepsi' ? [...SHELVES, 'diger'] : [shelf];
  const ringBg = `conic-gradient(var(--ok) 0 ${ringPct}%, rgba(255,255,255,0.1) ${ringPct}% 100%)`;

  return (
    <section class="lm" aria-label="Kitaplık" data-testid="lib-store">
      <div class="lm-status" data-testid="lib-status">
        <div class="lm-ring" style={{ background: ringBg }} aria-hidden="true">
          <b>%{ringPct}</b>
        </div>
        <div class="lm-status-t">
          <b>{ringPct === 100 ? 'Temel set hazır' : yuklu.length ? 'Kütüphanen hazırlanıyor' : 'Kütüphaneni kur'}</b>
          <span>
            {yuklu.length ? `${yuklu.length} paket yüklü · ${fmt(yukluBytes)}` : 'Henüz paket yok'}
            {free != null && free > 0 ? ` · ${fmt(free)} boş` : ''}
          </span>
          {yuklu.length > 0 && <span class={guncel ? 'upd' : ''}>{guncel ? `${guncel} paketin yeni sürümü var` : 'Hepsi güncel'}</span>}
        </div>
        {yuklu.length > 0 && (
          <button class="lm-manage" data-testid="lib-manage-toggle" aria-expanded={manage} aria-controls="lm-manage" onClick={() => setManage(!manage)}>
            Yönet
          </button>
        )}
      </div>

      {manage && (
        <div id="lm-manage" class="lm-panel" data-testid="lib-manage-panel">
          <UpdateBanner rows={zims} dlFor={dlFor} />
          <div class="lm-list">
            {yuklu.map((r) => (
              <PackRow key={r.key} row={r} dl={dlFor(r)} memGB={memGB} recommended={rec.tier} />
            ))}
          </div>
          <p class="lm-note">
            Dosyadan içe aktarmak ve haritalar, Fener modelleri için{' '}
            <button class="link-btn" style="display:inline;min-height:0;padding:0;color:var(--accent2)" onClick={() => go.tool('paylas')}>
              Araçlar → Paketler
            </button>
            .
          </p>
        </div>
      )}

      {!canSaveToDevice() && <p class="lm-note">Bu bağlantı güvenli değil (http); paketler cihaza kaydedilemez, bilgi noktasından okunur.</p>}

      <div class="lm-quick" role="group" aria-label="Hızlı seçim">
        <button aria-pressed={mode === 'rec'} data-testid="lib-pick-rec" onClick={() => save(['temel'], 'rec')}>
          Önerilenler
        </button>
        <button aria-pressed={mode === 'fit'} data-testid="lib-pick-fit" onClick={() => save(sigdir(setler, byId, free), 'fit')}>
          Yerimi doldur
        </button>
        <button class="clear" data-testid="lib-pick-none" onClick={() => save([], 'manual')}>
          Temizle
        </button>
      </div>

      <div class="lm-h">
        <h2>Paket setleri</h2>
        <span>yüklü olanlar düşülür</span>
      </div>
      <div class="lm-sets" data-testid="lib-sets">
        {durum.map((d) => {
          const on = sel.includes(d.set.id) && !d.complete;
          const inSet = d.rows.filter(aktif).length;
          return (
            <div class={'lm-set' + (on ? ' on' : '')} key={d.set.id} data-testid="lib-set" data-set={d.set.id}>
              <div class="lm-set-top">
                <span class="lm-set-ic" aria-hidden="true">
                  {d.set.title[0]}
                </span>
                <div class="lm-set-t">
                  <b>{d.set.title}</b>
                  <span>{d.set.desc}</span>
                </div>
              </div>
              <div class="lm-prog" aria-hidden="true">
                <i style={{ width: (d.total ? (d.have / d.total) * 100 : 0) + '%' }} />
              </div>
              <div class="lm-set-bottom">
                <span data-testid="lib-set-status">
                  {d.complete ? `Hepsi yüklü (${d.total} paket)` : `${d.have}/${d.total} yüklü · kalan ${fmt(d.leftBytes)}${inSet ? ` · ${inSet} iniyor` : ''}`}
                </span>
                {d.complete ? (
                  <span class="lm-pick done" style="display:flex;align-items:center;justify-content:center">
                    Tamam ✓
                  </span>
                ) : (
                  <button
                    class="lm-pick"
                    aria-pressed={on}
                    data-testid="lib-set-pick"
                    aria-label={`${on ? 'Seçildi' : '+ ' + fmt(d.leftBytes)}, ${d.set.title}`}
                    onClick={() => save(on ? sel.filter((x) => x !== d.set.id) : [...sel, d.set.id], 'manual')}
                  >
                    {on ? 'Seçildi' : '+ ' + fmt(d.leftBytes)}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button class="lm-toggle" data-testid="lib-catalog-toggle" aria-expanded={open} aria-controls="lm-catalog" onClick={() => setOpen(!open)}>
        <span>
          Tek tek seç: tüm koleksiyon ({zims.length})
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
          <p class="lm-note">İngilizce paketlerdeki makaleleri, makaleyi açtıktan sonra Fener ile Türkçeye çevirebilirsiniz.</p>
        </div>
      )}

      {(inen.length > 0 || q.length > 0) && (
        <div class="lm-bar" data-testid="lib-bar" role="status">
          {inen.length > 0 && <span class="lm-bar-fill" style={{ width: (inenTotal ? Math.min(100, (inenDone / inenTotal) * 100) : 0) + '%' }} aria-hidden="true" />}
          <div class="lm-bar-t">
            {inen.length > 0 ? (
              <>
                <b>İndiriliyor · %{inenTotal ? Math.floor((inenDone / inenTotal) * 100) : 0}</b>
                <span>
                  {inen.length} paket · {fmt(inenDone)} / {fmt(inenTotal)}
                  {speed > 0 ? ` · ${(speed / 1e6).toFixed(1).replace('.', ',')} MB/sn` : ''}
                </span>
              </>
            ) : (
              <>
                <b>
                  {q.length} paket · {fmt(qBytes)}
                </b>
                <span>{yerYok ? `Yer yetmez: ${fmt(free!)} boş` : free != null ? `İndirme sonrası ${fmt(free - qBytes)} boş kalır` : 'Yüklü olanlar düşüldü'}</span>
              </>
            )}
          </div>
          {inen.length > 0 ? (
            <button
              data-testid="lib-bar-pause"
              onClick={() => {
                hepsiniDuraklat();
                for (const r of inen) {
                  const d = dlFor(r);
                  if (d && isActive(d)) pauseDownload(d.file);
                }
              }}
            >
              Duraklat
            </button>
          ) : (
            <button data-testid="lib-bar-start" disabled={yerYok || !canSaveToDevice()} onClick={() => kuyrugaEkle(q)}>
              İndir
            </button>
          )}
        </div>
      )}
    </section>
  );
}
