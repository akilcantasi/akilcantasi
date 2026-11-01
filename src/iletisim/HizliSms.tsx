// İletişim: tek dokunuşla acil SMS.
//  • 112'ye konumlu SMS: dokununca konum alınır (en çok birkaç saniye), SMS uygulaması
//    mesaj ve numara hazır açılır; kullanıcı yalnızca Gönder'e basar.
//  • Yakınlarıma haber ver: kayıtlı kişilere "iyiyim" ya da "yardım lazım" (konum ve harita
//    bağlantısıyla), tek kişiye ya da hepsine birden.
// Yakınlar ve ad yalnızca bu cihazda saklanır (yakinlar.ts, outbox.ts profil).
import { useEffect, useState } from 'preact/hooks';
import { go } from '../lib/store';
import { NameField, Section, quickPosition, useProfile, warmPosition } from './common';
import { cleanPhone } from './outbox';
import { buildTemplate, isIOS, mapLink, smsHref, type Pos } from './sms';
import { MAX_YAKIN, initials, loadYakinlar, multiSmsHref, newId, saveYakinlar, type Yakin } from './yakinlar';

export const QUICK_CSS = `
.qs { display: flex; flex-direction: column; gap: 10px; }
.qs-112 { display: flex; gap: 8px; align-items: stretch; }
.qs-112-btn { flex: 1; min-height: 76px; border: 0; border-radius: 20px; padding: 12px 16px; text-align: left; color: #fff; background: linear-gradient(160deg, #f0565b, var(--sos)); box-shadow: 0 10px 26px rgba(229,72,77,0.35); display: flex; align-items: center; gap: 14px; }
.qs-112-btn:active { transform: scale(0.985); }
.qs-112-btn:disabled { opacity: 0.85; }
.qs-112-ic { width: 46px; height: 46px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.qs-112-t { display: flex; flex-direction: column; gap: 2px; }
.qs-112-t b { font-size: 17px; line-height: 1.25; }
.qs-112-t small { font-size: 12.5px; opacity: 0.95; line-height: 1.35; }
.qs-call { width: 76px; flex-shrink: 0; border-radius: 20px; border: 1px solid rgba(229,72,77,0.55); background: rgba(229,72,77,0.1); color: #ffd1cb; text-decoration: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 13px; font-weight: 600; }
.qs-status { font-size: 13px; color: var(--text2); margin: 0; min-height: 18px; }
.qs-status.bad { color: #ffb4a8; }
.qs-fam { background: var(--card); border: 1px solid var(--line2); border-radius: 20px; padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.qs-fam-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.qs-fam-head b { font-size: 16px; }
.qs-edit { min-height: 44px; padding: 0 4px; background: none; border: 0; color: var(--accent2); font-size: 13.5px; font-weight: 600; }
.qs-seg { display: flex; background: rgba(255,255,255,0.05); border-radius: 999px; padding: 4px; }
.qs-seg button { flex: 1; min-height: 44px; border: 0; border-radius: 999px; background: transparent; color: var(--text2); font-size: 14px; font-weight: 500; }
.qs-seg button[aria-pressed='true'] { background: var(--ok); color: #0e1b2c; font-weight: 600; }
.qs-seg button.help[aria-pressed='true'] { background: var(--accent); color: var(--on-accent); }
.qs-people { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 8px; }
.qs-person { min-height: 92px; border-radius: 16px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 8px 4px; }
.qs-person:active { transform: scale(0.97); }
.qs-av { width: 40px; height: 40px; border-radius: 50%; background: var(--accent-soft); color: var(--accent2); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 15px; }
.qs-person span { font-size: 13px; font-weight: 500; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 4px; }
.qs-all { width: 100%; }
.qs-empty { display: flex; flex-direction: column; gap: 10px; }
.qs-empty p { margin: 0; font-size: 13.5px; color: var(--text2); line-height: 1.45; }
.yk-list { display: flex; flex-direction: column; gap: 8px; }
.yk-row { display: flex; align-items: center; gap: 12px; background: var(--card); border: 1px solid var(--line2); border-radius: 16px; padding: 8px 8px 8px 12px; }
.yk-row .grow { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.yk-row .grow b { font-size: 15px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.yk-row .grow span { font-size: 13px; color: var(--muted); font-family: var(--mono); }
.yk-del { min-width: 44px; min-height: 44px; border-radius: 12px; border: 1px solid var(--glass-line); background: transparent; color: #ffb4a8; font-size: 13px; }
.yk-form { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; }
`;

const PHONE_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
const SMS_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M12 8v3M12 13.5v.01" />
  </svg>
);

const yakinListeners = new Set<(l: Yakin[]) => void>();
let yakinCache: Yakin[] | null = null;

export function useYakinlar(): [Yakin[], (l: Yakin[]) => void] {
  const [l, set] = useState<Yakin[]>(() => (yakinCache ??= loadYakinlar()));
  useEffect(() => {
    yakinListeners.add(set);
    return () => void yakinListeners.delete(set);
  }, []);
  const update = (next: Yakin[]) => {
    yakinCache = next.slice(0, MAX_YAKIN);
    saveYakinlar(yakinCache);
    yakinListeners.forEach((f) => f(yakinCache!));
  };
  return [l, update];
}

export type Durum = 'iyiyim' | 'yardim';

/** Yakınlara gidecek metin: şablon + harita bağlantısı */
export function familyMessage(durum: Durum, name: string, pos: Pos | null): string {
  const base = buildTemplate(durum, { name, place: '', note: '', people: '', pos });
  const link = mapLink(pos);
  return link ? `${base}\n${link}` : base;
}

/** 112'ye gidecek metin (kısa tutulur: Türkçe karakterli SMS 70 karakterde bölünür) */
export function emergencyMessage(name: string, pos: Pos | null): string {
  const base = buildTemplate('acil112', { name, place: '', note: '', people: '', pos });
  return pos ? base : base + ' Konumum alınamadı.';
}

function open(href: string) {
  // Uçtan uca testler açılan bağlantıyı yakalayabilsin
  const hook = (window as any).__acSmsOpen;
  if (typeof hook === 'function') return void hook(href);
  location.href = href;
}

/** İletişim ana ekranındaki hızlı yardım bloğu */
export function QuickHelp() {
  const [p] = useProfile();
  const [yakinlar] = useYakinlar();
  const [durum, setDurum] = useState<Durum>('iyiyim');
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<{ text: string; bad?: boolean } | null>(null);
  const ios = isIOS();

  useEffect(() => {
    void warmPosition();
  }, []);

  const withPos = async (key: string, send: (pos: Pos | null) => void) => {
    if (busy) return;
    setBusy(key);
    setStatus({ text: 'Konum alınıyor… (birkaç saniye)' });
    const pos = await quickPosition(7000);
    setBusy(null);
    setStatus(
      pos
        ? { text: `Konum eklendi (±${Math.round(pos.acc ?? 0)} m). SMS uygulamasında Gönder'e basın.` }
        : { text: "Konum alınamadı; mesaj konumsuz açıldı. Mümkünse adresinizi ekleyip Gönder'e basın.", bad: true },
    );
    send(pos);
  };

  const send112 = () => withPos('112', (pos) => open(smsHref('112', emergencyMessage(p.name, pos), ios)));
  const sendTo = (list: Yakin[], key: string) =>
    withPos(key, (pos) => open(multiSmsHref(list.map((y) => y.phone), familyMessage(durum, p.name, pos), ios)));

  return (
    <div class="qs" data-testid="quick-help">
      <style>{QUICK_CSS}</style>
      <div class="qs-112">
        <button class="qs-112-btn" data-testid="quick-112-sms" onClick={send112} disabled={busy === '112'}>
          <span class="qs-112-ic">{SMS_ICON}</span>
          <span class="qs-112-t">
            <b>{busy === '112' ? 'Konum alınıyor…' : "112'ye konumlu SMS"}</b>
            <small>Tek dokunuş: konumunuz eklenir, mesaj hazır açılır</small>
          </span>
        </button>
        <a class="qs-call" href="tel:112" data-testid="quick-112-call">
          {PHONE_ICON}
          112'yi ara
        </a>
      </div>
      <p class={'qs-status' + (status?.bad ? ' bad' : '')} role="status" data-testid="quick-status">
        {status?.text ?? ''}
      </p>

      <section class="qs-fam" aria-labelledby="qs-fam-t">
        <div class="qs-fam-head">
          <b id="qs-fam-t">Yakınlarıma haber ver</b>
          <button class="qs-edit" data-testid="quick-edit" onClick={() => go.comm('yakinlar')}>
            {yakinlar.length ? 'Düzenle' : 'Kişi ekle'}
          </button>
        </div>
        {yakinlar.length ? (
          <>
            <div class="qs-seg" role="group" aria-label="Mesaj">
              <button aria-pressed={durum === 'iyiyim'} data-testid="quick-durum-iyiyim" onClick={() => setDurum('iyiyim')}>
                İyiyim
              </button>
              <button class="help" aria-pressed={durum === 'yardim'} data-testid="quick-durum-yardim" onClick={() => setDurum('yardim')}>
                Yardım lazım
              </button>
            </div>
            <div class="qs-people">
              {yakinlar.map((y) => (
                <button key={y.id} class="qs-person" data-testid="quick-person" onClick={() => sendTo([y], y.id)} aria-label={`${y.name} kişisine "${durum === 'iyiyim' ? 'İyiyim' : 'Yardım lazım'}" SMS'i`}>
                  <span class="qs-av" aria-hidden="true">
                    {busy === y.id ? '…' : initials(y.name)}
                  </span>
                  <span>{y.name}</span>
                </button>
              ))}
            </div>
            {yakinlar.length > 1 && (
              <button class="btn primary qs-all" data-testid="quick-all" onClick={() => sendTo(yakinlar, 'all')}>
                Hepsine gönder ({yakinlar.length} kişi)
              </button>
            )}
          </>
        ) : (
          <div class="qs-empty">
            <p>Acil durumda tek dokunuşla "iyiyim" ya da "yardım lazım" (konumunuzla) gönderebilmek için yakınlarınızı şimdiden ekleyin. Numaralar yalnızca bu cihazda saklanır.</p>
            <button class="btn primary" data-testid="quick-add" onClick={() => go.comm('yakinlar')}>
              Yakınlarımı ekle
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/** Yakınlar listesini düzenleme ekranı */
export function Yakinlar() {
  const [list, setList] = useYakinlar();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const canPick = typeof navigator !== 'undefined' && 'contacts' in navigator && typeof (navigator as any).contacts?.select === 'function';

  const add = (n: string, ph: string) => {
    const clean = cleanPhone(ph);
    if (clean.replace(/\D/g, '').length < 3) {
      setErr('Geçerli bir telefon numarası girin.');
      return false;
    }
    if (list.some((y) => y.phone === clean)) {
      setErr('Bu numara zaten listede.');
      return false;
    }
    if (list.length >= MAX_YAKIN) {
      setErr(`En çok ${MAX_YAKIN} kişi eklenebilir.`);
      return false;
    }
    setList([...list, { id: newId(), name: n.trim() || clean, phone: clean }]);
    setErr('');
    return true;
  };

  const pick = async () => {
    try {
      const res = await (navigator as any).contacts.select(['name', 'tel'], { multiple: true });
      for (const c of res ?? []) if (c.tel?.[0]) add(c.name?.[0] ?? '', c.tel[0]);
    } catch {}
  };

  return (
    <Section id="yakinlar" title="Yakınlarım" sub="Hızlı SMS'in gideceği kişiler. Numaralar yalnızca bu cihazda saklanır, hiçbir yere gönderilmez.">
      <NameField label="Adınız (mesajların sonuna eklenir)" />
      {list.length > 0 && (
        <div class="yk-list" data-testid="yakin-list">
          {list.map((y) => (
            <div class="yk-row" key={y.id} data-testid="yakin-row">
              <span class="qs-av" aria-hidden="true">
                {initials(y.name)}
              </span>
              <div class="grow">
                <b>{y.name}</b>
                <span>{y.phone}</span>
              </div>
              <button class="yk-del" data-testid="yakin-del" aria-label={`${y.name} kişisini sil`} onClick={() => setList(list.filter((x) => x.id !== y.id))}>
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
      {list.length < MAX_YAKIN && (
        <form
          class="card yk-form"
          data-testid="yakin-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (add(name, phone)) {
              setName('');
              setPhone('');
            }
          }}
        >
          <label class="cm-field">
            <span class="label">Ad</span>
            <input class="input" data-testid="yakin-name" value={name} maxLength={30} placeholder="Ör. Annem" onInput={(e) => setName((e.target as HTMLInputElement).value)} />
          </label>
          <label class="cm-field">
            <span class="label">Telefon</span>
            <input class="input" data-testid="yakin-phone" type="tel" inputMode="tel" value={phone} placeholder="05xx xxx xx xx" onInput={(e) => setPhone((e.target as HTMLInputElement).value)} />
          </label>
          {err && <p class="cm-err">{err}</p>}
          <div class="cm-btns">
            <button class="btn primary" type="submit" data-testid="yakin-add">
              Ekle
            </button>
            {canPick && (
              <button class="btn" type="button" onClick={pick} data-testid="yakin-pick">
                Rehberden seç
              </button>
            )}
          </div>
        </form>
      )}
      <p class="cm-note">Mesajlar SMS uygulamanızda hazır açılır; göndermek için Gönder'e basmanız yeterli. İnternet gerekmez, şebeke zayıfken de SMS çoğu zaman ulaşır.</p>
    </Section>
  );
}
