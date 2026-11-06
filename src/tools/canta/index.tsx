// Afet çantası: AFAD / Ready.gov listesine dayalı kontrol listesi, profiller,
// son kullanma tarihleri ve özel öğeler. Durum src/tools/_kaynak/canta.ts.
import { useState } from 'preact/hooks';
import { go } from '../../lib/store';
import { GROUPS, PROFILES, type GroupId, type OptionId } from '../_kaynak/canta-data';
import { addCustom, alerts, loadCanta, progress, removeCustom, resetChecks, saveCanta, setExpiry, toggleItem, viewItems, type CantaState, type ViewItem } from '../_kaynak/canta';
import { expiryText, formatDateTR } from '../_kaynak/expiry';
import { KAYNAK_CSS } from '../_kaynak/ui';
import { ICal, IX } from '../_kaynak/icons';

const OPTS: { id: OptionId; title: string }[] = [
  { id: 'bebek', title: 'Bebek var' },
  { id: 'yasli', title: 'Yaşlı / kronik hasta var' },
  { id: 'evcil', title: 'Evcil hayvan var' },
];

function Item({ it, onToggle, onDate, onRemove }: { it: ViewItem; onToggle: () => void; onDate: (d: string) => void; onRemove?: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const cls = it.status === 'expired' ? ' exp-expired' : it.status === 'soon' ? ' exp-soon' : '';
  return (
    <li class={'kn-item' + cls} data-testid={'canta-item-' + it.id} style="list-style:none">
      <div class="row" style="gap:0;padding-right:4px">
        <label class={'kn-check grow' + (it.checked ? ' done' : '')}>
          <input type="checkbox" checked={it.checked} onChange={onToggle} data-testid={'canta-check-' + it.id} />
          <span class="t">
            <b>{it.name}</b>
            {it.note && <small>{it.note}</small>}
            {it.expiry && (
              <small class={'kn-date ' + (it.status === 'expired' ? 'kn-red' : it.status === 'soon' ? 'kn-amber' : '')} data-testid={'canta-exp-' + it.id}>
                SKT {formatDateTR(it.expiry)} · {expiryText(it.expiry)}
              </small>
            )}
          </span>
        </label>
        {(it.perishable || it.expiry) && (
          <button
            class={'kn-icon' + (it.expiry ? ' has' : '')}
            aria-label={`${it.name} için son kullanma tarihi`}
            aria-expanded={open}
            data-testid={'canta-date-btn-' + it.id}
            onClick={() => setOpen(!open)}
          >
            <ICal />
          </button>
        )}
        {onRemove && (
          <button class="kn-icon" aria-label={`${it.name} öğesini sil`} data-testid={'canta-remove-' + it.id} onClick={() => setConfirm(true)}>
            <IX />
          </button>
        )}
      </div>
      {open && (
        <div class="kn-exp">
          <label class="sr-only" for={'d-' + it.id}>Son kullanma tarihi</label>
          <input id={'d-' + it.id} type="date" class="input" value={it.expiry ?? ''} data-testid={'canta-date-' + it.id} onInput={(e) => onDate((e.target as HTMLInputElement).value)} />
          {it.expiry && (
            <button class="btn" data-testid={'canta-date-clear-' + it.id} onClick={() => onDate('')}>
              Temizle
            </button>
          )}
        </div>
      )}
      {confirm && onRemove && (
        <div class="kn-exp kn-confirm">
          <span>Silinsin mi?</span>
          <button class="btn" data-testid={'canta-remove-yes-' + it.id} onClick={onRemove}>Sil</button>
          <button class="btn" data-testid={'canta-remove-no-' + it.id} onClick={() => setConfirm(false)}>Vazgeç</button>
        </div>
      )}
    </li>
  );
}

export default function Canta() {
  const [s, setS0] = useState<CantaState>(loadCanta);
  const [name, setName] = useState('');
  const [group, setGroup] = useState<GroupId>('su-gida');
  const [confirmReset, setConfirmReset] = useState(false);
  const [saveErr, setSaveErr] = useState(false);

  // Değişiklik hemen kaydedilir (çizimden sonra değil): hemen çıkılırsa kaybolmasın
  const setS = (n: CantaState) => {
    setSaveErr(!saveCanta(n));
    setS0(n);
  };

  const items = viewItems(s);
  const pr = progress(items);
  const al = alerts(items);
  const prof = PROFILES.find((p) => p.id === s.profile)!;
  const groups = GROUPS.filter((g) => !g.option || s.opts[g.option]);

  const add = (e: Event) => {
    e.preventDefault();
    if (!name.trim()) return;
    setS(addCustom(s, name, group));
    setName('');
  };

  return (
    <div class="kn" data-testid="canta">
      <style>{KAYNAK_CSS}</style>
      <div class="kn-seg" role="group" aria-label="Çanta profili">
        {PROFILES.map((p) => (
          <button key={p.id} class="chip" aria-pressed={s.profile === p.id} data-testid={'canta-profile-' + p.id} onClick={() => setS({ ...s, profile: p.id })}>
            {p.title}
          </button>
        ))}
      </div>
      <p class="kn-sub">{prof.hint}</p>

      {al.length > 0 && (
        <div class={'kn-alert ' + (al.some((a) => a.status === 'expired') ? 'bad' : 'soon')} data-testid="canta-alerts" role="status">
          <b>Son kullanma tarihi: {al.filter((a) => a.status === 'expired').length} geçmiş, {al.filter((a) => a.status === 'soon').length} yaklaşan</b>
          <ul>
            {al.map((a) => (
              <li key={a.id} data-testid={'canta-alert-' + a.id}>
                {a.name} — <span class={a.status === 'expired' ? 'kn-red' : 'kn-amber'}>{formatDateTR(a.expiry)} ({expiryText(a.expiry)})</span>
              </li>
            ))}
          </ul>
          <span class="kn-sub">Yaklaşan: 30 gün içinde. Süresi dolanları yenileyin; suyu en geç 6 ayda bir değiştirin.</span>
        </div>
      )}

      <div class="card" style="display:flex;flex-direction:column;gap:8px">
        <div class="row">
          <b class="grow">Hazırlık</b>
          <span class="mono" data-testid="canta-progress-text">
            {pr.done} / {pr.total} · %{pr.pct}
          </span>
        </div>
        <div class={'kn-pbar' + (pr.pct === 100 ? ' ok' : '')} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pr.pct} aria-label="Çanta hazırlık oranı" data-testid="canta-progress">
          <div style={`width:${pr.pct}%`} />
        </div>
        {pr.pct === 100 && <span class="kn-ok">Çantanız tamam. Tarihleri 6 ayda bir kontrol edin.</span>}
      </div>

      <div class="kn-seg" role="group" aria-label="Ek ihtiyaçlar">
        {OPTS.map((o) => (
          <button key={o.id} class="chip" aria-pressed={s.opts[o.id]} data-testid={'canta-opt-' + o.id} onClick={() => setS({ ...s, opts: { ...s.opts, [o.id]: !s.opts[o.id] } })}>
            {o.title}
          </button>
        ))}
      </div>

      {groups.map((g) => {
        const gi = items.filter((i) => i.group === g.id);
        if (!gi.length) return null;
        const gp = progress(gi);
        return (
          <section key={g.id} class="kn-group" data-testid={'canta-group-' + g.id}>
            <h2>
              <span>{g.title}</span>
              <span class="mono">{gp.done}/{gp.total}</span>
            </h2>
            <ul style="margin:0;padding:0;display:flex;flex-direction:column;gap:6px">
              {gi.map((it) => (
                <Item
                  key={it.id}
                  it={it}
                  onToggle={() => setS(toggleItem(s, it.id))}
                  onDate={(d) => setS(setExpiry(s, it.id, d))}
                  onRemove={it.custom ? () => setS(removeCustom(s, it.id)) : undefined}
                />
              ))}
            </ul>
          </section>
        );
      })}

      <form class="card kn-form" onSubmit={add} data-testid="canta-add-form">
        <b>Kendi öğenizi ekleyin</b>
        <label class="kn-field">
          <span>Öğe adı</span>
          <input class="input" value={name} maxLength={80} placeholder="ör. Yedek araba anahtarı" data-testid="canta-add-name" onInput={(e) => setName((e.target as HTMLInputElement).value)} />
        </label>
        <label class="kn-field">
          <span>Grup</span>
          <select class="kn-select" value={group} data-testid="canta-add-group" onChange={(e) => setGroup((e.target as HTMLSelectElement).value as GroupId)}>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.title}</option>
            ))}
          </select>
        </label>
        <button class="btn primary" type="submit" disabled={!name.trim()} data-testid="canta-add-submit">
          Ekle
        </button>
      </form>

      <div class="row" style="flex-wrap:wrap">
        <button class="btn" data-testid="canta-to-hesap" onClick={() => go.tool('hesap')}>Su ve yiyecek hesabı</button>
        {!confirmReset ? (
          <button class="btn" data-testid="canta-reset" onClick={() => setConfirmReset(true)} disabled={pr.done === 0}>İşaretleri temizle</button>
        ) : (
          <span class="kn-confirm">
            <span>Bu profildeki tüm işaretler kalksın mı?</span>
            <button class="btn" data-testid="canta-reset-yes" onClick={() => { setS(resetChecks(s)); setConfirmReset(false); }}>Evet</button>
            <button class="btn" data-testid="canta-reset-no" onClick={() => setConfirmReset(false)}>Vazgeç</button>
          </span>
        )}
      </div>
      {saveErr && <p class="warn kn-red" data-testid="canta-save-error">Kaydedilemedi: tarayıcı depolaması kapalı veya dolu. Değişiklikler bu oturumla sınırlı.</p>}

      <div class="kn-src" data-testid="canta-sources">
        <b>Kaynak</b>
        <span>AFAD "Afet ve Acil Durum Çantası Nasıl Hazırlanmalı?" listesi; Türk Kızılay "Afette İlk 72 Saat"; Ready.gov "Build a Kit". Liste ilk 72 saat içindir; çantayı evde, iş yerinde ve araçta ulaşılabilir tutun, içindeki yiyecek ve içecekleri düzenli kontrol edin.</span>
      </div>
    </div>
  );
}
