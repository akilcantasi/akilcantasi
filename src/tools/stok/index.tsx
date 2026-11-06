// Stok listesi: elinizdeki malzemeler, son kullanma tarihine göre sıralama,
// su ve gıda için "kaç gün yeter" tahmini, metin olarak dışa aktarma.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { go } from '../../lib/store';
import { expiryStatus, expiryText, formatDateTR } from '../_kaynak/expiry';
import { fmt } from '../_kaynak/hesap';
import { IEdit, IX } from '../_kaynak/icons';
import { coverage, DEFAULT_KCAL100, exportText, KINDS, loadHousehold, loadStok, normalizeItem, remove, saveStok, search, sortItems, UNITS, upsert, type SortKey, type StokItem, type StokKind, type Unit } from '../_kaynak/stok';
import { newId } from '../_kaynak/storage';
import { KAYNAK_CSS } from '../_kaynak/ui';

interface Draft {
  id?: string;
  name: string;
  qty: string;
  unit: Unit;
  kind: StokKind;
  location: string;
  expiry: string;
  kcal: string;
  litrePer: string;
}

const EMPTY: Draft = { name: '', qty: '1', unit: 'adet', kind: 'diger', location: '', expiry: '', kcal: '', litrePer: '' };

const toDraft = (i: StokItem): Draft => ({
  id: i.id,
  name: i.name,
  qty: String(i.qty),
  unit: i.unit,
  kind: i.kind,
  location: i.location ?? '',
  expiry: i.expiry ?? '',
  kcal: i.kcal ? String(i.kcal) : '',
  litrePer: i.litrePer ? String(i.litrePer) : '',
});

const num = (s: string) => Number(s.replace(',', '.'));
/** Elle girilen sayıların üst sınırı (yanlışlıkla fazladan sıfır, 1e9 gibi) */
const MAX_MIKTAR = 1_000_000;

function ItemForm({ initial, onSave, onCancel }: { initial: Draft; onSave: (i: StokItem) => void; onCancel: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [err, setErr] = useState('');
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView?.({ block: 'nearest' });
  }, []);
  const up = (p: Partial<Draft>) => setD({ ...d, ...p });
  const grams = d.unit === 'g' || d.unit === 'kg';
  const pieces = d.unit === 'adet' || d.unit === 'paket' || d.unit === 'kutu';
  const submit = (e: Event) => {
    e.preventDefault();
    if (!d.name.trim()) return setErr('Ad girin.');
    const q = num(d.qty.trim());
    if (!d.qty.trim() || !Number.isFinite(q) || q < 0) return setErr('Miktar 0 ya da daha büyük bir sayı olmalı.');
    if (q > MAX_MIKTAR) return setErr('Miktar çok büyük. Doğru birimi seçtiğinizden emin olun.');
    // İsteğe bağlı alanlar: yazıldıysa geçerli olmalı (yoksa sessizce yok sayılıp "hesaba katılamadı" görünürdü)
    const ek = (s: string) => s.trim() !== '' && !(num(s.trim()) > 0 && num(s.trim()) <= MAX_MIKTAR);
    if (d.kind === 'gida' && ek(d.kcal)) return setErr('Enerji 0\'dan büyük bir sayı olmalı (etiketteki kcal).');
    if (d.kind === 'su' && pieces && ek(d.litrePer)) return setErr('Litre 0\'dan büyük bir sayı olmalı (ör. 1,5).');
    const it = normalizeItem({ id: d.id ?? newId('s'), name: d.name, qty: q, unit: d.unit, kind: d.kind, location: d.location, expiry: d.expiry, kcal: d.kind === 'gida' ? num(d.kcal) : undefined, litrePer: d.kind === 'su' && pieces ? num(d.litrePer) : undefined });
    if (!it) return setErr('Kaydedilemedi.');
    onSave(it);
  };
  const p = d.id ? 'stok-edit' : 'stok-new';
  return (
    <form ref={ref} class="card kn-form" onSubmit={submit} data-testid={p + '-form'}>
      <b>{d.id ? 'Düzenle' : 'Yeni öğe'}</b>
      <div class="kn-seg" role="group" aria-label="Tür">
        {KINDS.map((k) => (
          <button
            type="button"
            key={k.id}
            class="chip"
            aria-pressed={d.kind === k.id}
            data-testid={`${p}-kind-${k.id}`}
            onClick={() => up({ kind: k.id, unit: k.id === 'su' && !['L', 'ml', 'adet', 'paket', 'kutu'].includes(d.unit) ? 'L' : d.unit })}
          >
            {k.title}
          </button>
        ))}
      </div>
      <label class="kn-field">
        <span>Ad</span>
        <input class="input" value={d.name} maxLength={80} placeholder="ör. Ton balığı konservesi" data-testid={p + '-name'} onInput={(e) => up({ name: (e.target as HTMLInputElement).value })} />
      </label>
      <div class="kn-grid2">
        <label class="kn-field">
          <span>Miktar</span>
          <input class="input" inputMode="decimal" value={d.qty} data-testid={p + '-qty'} onInput={(e) => up({ qty: (e.target as HTMLInputElement).value })} />
        </label>
        <label class="kn-field">
          <span>Birim</span>
          <select class="kn-select" value={d.unit} data-testid={p + '-unit'} onChange={(e) => up({ unit: (e.target as HTMLSelectElement).value as Unit })}>
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>
      </div>
      {d.kind === 'su' && pieces && (
        <label class="kn-field">
          <span>Bir {d.unit} kaç litre?</span>
          <input class="input" inputMode="decimal" placeholder="ör. 1,5" value={d.litrePer} data-testid={p + '-litre'} onInput={(e) => up({ litrePer: (e.target as HTMLInputElement).value })} />
        </label>
      )}
      {d.kind === 'gida' && (grams || pieces) && (
        <label class="kn-field">
          <span>{grams ? 'Enerji (kcal / 100 g, etiketten)' : `Enerji (kcal / ${d.unit}, etiketten)`}</span>
          <input class="input" inputMode="decimal" placeholder={grams ? `boş bırakılırsa ${DEFAULT_KCAL100}` : 'ör. 250'} value={d.kcal} data-testid={p + '-kcal'} onInput={(e) => up({ kcal: (e.target as HTMLInputElement).value })} />
        </label>
      )}
      <div class="kn-grid2">
        <label class="kn-field">
          <span>Yer</span>
          <input class="input" value={d.location} maxLength={60} placeholder="ör. Kiler" data-testid={p + '-location'} onInput={(e) => up({ location: (e.target as HTMLInputElement).value })} />
        </label>
        <label class="kn-field">
          <span>Son kullanma</span>
          <input class="input" type="date" value={d.expiry} data-testid={p + '-expiry'} onInput={(e) => up({ expiry: (e.target as HTMLInputElement).value })} />
        </label>
      </div>
      {err && <p class="warn kn-red" data-testid={p + '-error'}>{err}</p>}
      <div class="row">
        <button class="btn primary grow" type="submit" data-testid={p + '-save'}>Kaydet</button>
        <button class="btn" type="button" data-testid={p + '-cancel'} onClick={onCancel}>Vazgeç</button>
      </div>
    </form>
  );
}

function Days({ v, testid }: { v: number | null; testid: string }) {
  if (v === null) return <span class="kn-big" data-testid={testid}>—</span>;
  const cls = v < 3 ? 'kn-red' : v < 7 ? 'kn-amber' : 'kn-ok';
  return (
    <span class={'kn-big ' + cls} data-testid={testid}>
      {fmt(v)} <small style="font-size:14px">gün</small>
    </span>
  );
}

export default function Stok() {
  const [items, setItems0] = useState<StokItem[]>(loadStok);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('expiry');
  const [editing, setEditing] = useState<Draft | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState('');
  const [saveErr, setSaveErr] = useState(false);
  const hh = useMemo(loadHousehold, []);

  // Değişiklik hemen kaydedilir (çizimden sonra değil): hemen çıkılırsa kaybolmasın
  const setItems = (n: StokItem[]) => {
    setSaveErr(!saveStok(n));
    setItems0(n);
  };

  const shown = sortItems(search(items, q), sort);
  const cov = coverage(items, hh.input);
  const hasWF = items.some((i) => i.kind !== 'diger');
  const text = exportText(items, cov);
  const people = hh.input.adults + hh.input.children + hh.input.elderly + hh.input.babies;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Stok listesi', text });
        setCopied('Paylaşıldı.');
        return;
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied('Panoya kopyalandı.');
    } catch {
      setShowExport(true);
      setCopied('Kopyalanamadı; metni aşağıdan seçip kopyalayın.');
    }
  };

  return (
    <div class="kn" data-testid="stok">
      <style>{KAYNAK_CSS}</style>

      {hasWF && (
        <section class="card" style="display:flex;flex-direction:column;gap:10px" data-testid="stok-coverage">
          <h2 class="kn-h">Kaç gün yeter?</h2>
          <div class="kn-stats">
            <div class="kn-stat">
              <span class="label">Su · içme</span>
              <Days v={cov.waterDrinkDays} testid="stok-water-days" />
              <small>{fmt(cov.waterL)} L · içme + hijyen: {cov.waterTotalDays === null ? '—' : fmt(cov.waterTotalDays) + ' gün'}</small>
            </div>
            <div class="kn-stat">
              <span class="label">Gıda</span>
              <Days v={cov.foodDays} testid="stok-food-days" />
              <small>~{fmt(cov.kcal, 0)} kcal{cov.assumedKcal ? ' (bir kısmı tahmini)' : ''}</small>
            </div>
          </div>
          <p class="kn-sub" data-testid="stok-household">
            {hh.saved ? '' : 'Varsayılan: '}
            {people} kişi{hh.input.pets ? `, ${hh.input.pets} evcil hayvan` : ''}, {hh.input.climate === 'sicak' ? 'sıcak' : 'normal'} iklim. Su ve yiyecek hesabındaki kişi başı değerler kullanılır.
          </p>
          <button class="btn" style="align-self:flex-start" data-testid="stok-to-hesap" onClick={() => go.tool('hesap')}>Kişileri ayarla</button>
          {cov.skipped.length > 0 && <p class="warn" data-testid="stok-skipped">Hesaba katılamadı (litre veya kalori bilgisi yok): {cov.skipped.join(', ')}</p>}
          {cov.expiredSkipped.length > 0 && <p class="warn kn-red" data-testid="stok-expired-skipped">Tarihi geçtiği için sayılmadı: {cov.expiredSkipped.join(', ')}</p>}
        </section>
      )}

      {editing ? (
        <ItemForm
          key={editing.id ?? 'new'}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={(it) => {
            setItems(upsert(items, it));
            setEditing(null);
          }}
        />
      ) : (
        <button class="btn primary" data-testid="stok-add" onClick={() => setEditing({ ...EMPTY })}>+ Öğe ekle</button>
      )}

      {items.length > 0 && (
        <div class="kn-form">
          <label class="sr-only" for="stok-q">Ara</label>
          <input id="stok-q" class="input" type="search" placeholder="Ad veya yer ara" value={q} data-testid="stok-search" onInput={(e) => setQ((e.target as HTMLInputElement).value)} />
          <div class="kn-seg" role="group" aria-label="Sıralama">
            {([['expiry', 'Son kullanma'], ['name', 'Ad'], ['location', 'Yer']] as [SortKey, string][]).map(([k, t]) => (
              <button key={k} class="chip" aria-pressed={sort === k} data-testid={'stok-sort-' + k} onClick={() => setSort(k)}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p class="empty" data-testid="stok-empty">Liste boş. Evdeki su, gıda, ilaç ve pil gibi malzemeleri ekleyin; su ve gıda için kaç gün yeteceğini hesaplayalım.</p>
      ) : shown.length === 0 ? (
        <p class="empty" data-testid="stok-noresult">"{q}" için sonuç yok.</p>
      ) : (
        <ul style="margin:0;padding:0;display:flex;flex-direction:column;gap:6px" data-testid="stok-list">
          {shown.map((i) => {
            const st = expiryStatus(i.expiry);
            return (
              <li key={i.id} class={'kn-item' + (st === 'expired' ? ' exp-expired' : st === 'soon' ? ' exp-soon' : '')} style="list-style:none" data-testid={'stok-item-' + i.id}>
                <div class="row" style="padding:8px 4px 8px 12px;gap:4px">
                  <div class="grow" style="display:flex;flex-direction:column;gap:2px">
                    <b style="font-weight:500;font-size:15px" data-testid="stok-item-name">{i.name}</b>
                    <small class="muted" style="font-size:12.5px">
                      <span class="mono" data-testid="stok-item-qty">{fmt(i.qty, 2)} {i.unit}</span>
                      {i.kind !== 'diger' && ` · ${i.kind === 'su' ? 'su' : 'gıda'}`}
                      {i.location && ` · ${i.location}`}
                    </small>
                    {i.expiry && (
                      <small class={'kn-date ' + (st === 'expired' ? 'kn-red' : st === 'soon' ? 'kn-amber' : 'muted')} data-testid="stok-item-exp">
                        SKT {formatDateTR(i.expiry)} · {expiryText(i.expiry)}
                      </small>
                    )}
                  </div>
                  <button class="kn-icon" aria-label={`${i.name} düzenle`} data-testid={'stok-edit-' + i.id} onClick={() => setEditing(toDraft(i))}><IEdit /></button>
                  <button class="kn-icon" aria-label={`${i.name} sil`} data-testid={'stok-del-' + i.id} onClick={() => setDelId(i.id)}><IX /></button>
                </div>
                {delId === i.id && (
                  <div class="kn-confirm" style="padding:0 12px 10px">
                    <span>Silinsin mi?</span>
                    <button class="btn" data-testid={'stok-del-yes-' + i.id} onClick={() => { setItems(remove(items, i.id)); setDelId(null); }}>Sil</button>
                    <button class="btn" data-testid={'stok-del-no-' + i.id} onClick={() => setDelId(null)}>Vazgeç</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {items.length > 0 && (
        <div class="kn-form">
          <div class="row" style="flex-wrap:wrap">
            <button class="btn" data-testid="stok-share" onClick={share}>Metin olarak paylaş</button>
            <button class="btn" data-testid="stok-export-toggle" aria-expanded={showExport} onClick={() => setShowExport(!showExport)}>{showExport ? 'Metni gizle' : 'Metni göster'}</button>
          </div>
          {copied && <p class="warn" role="status" data-testid="stok-share-status">{copied}</p>}
          {showExport && <pre class="kn-pre" data-testid="stok-export">{text}</pre>}
        </div>
      )}
      {saveErr && <p class="warn kn-red" data-testid="stok-save-error">Kaydedilemedi: tarayıcı depolaması kapalı veya dolu.</p>}
      <p class="kn-sub">Gıdada kalori yazılmazsa {DEFAULT_KCAL100} kcal/100 g varsayılır (temkinli; konserve yemek düzeyi). Tarihi geçmiş su ve gıda hesaba katılmaz.</p>
    </div>
  );
}
