// İletişim: bilgi noktası panosu bölümleri (Pano, İyiyim, Kayıp kişi, Duyurular, Bağlantı).
import { useState } from 'preact/hooks';
import { go } from '../lib/store';
import { native } from '../lib/native';
import { KIND_LABEL, LIMITS, missingToText, newId, type BoardDraft, type BoardKind, type CheckinStatus } from './board';
import { board, useBoard } from './client';
import { ConnCard, Empty, GeoButton, ItemCard, NameField, Section, useGeo, useNow, useProfile } from './common';
import { cleanPhone, normalizeServer } from './outbox';
import { buildTemplate, isIOS, smsHref } from './sms';

type SendState = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok'; queued: boolean; reason?: string } | { kind: 'error'; msg: string };

function useSender() {
  const [st, set] = useState<SendState>({ kind: 'idle' });
  const send = async (d: Omit<BoardDraft, 'id'> & { id?: string }) => {
    set({ kind: 'busy' });
    const r = await board.submit({ ...d, id: d.id ?? newId() } as BoardDraft);
    set(r.ok ? { kind: 'ok', queued: !!r.queued, reason: r.reason } : { kind: 'error', msg: r.error ?? 'Gönderilemedi' });
    return r.ok;
  };
  return { st, send, reset: () => set({ kind: 'idle' }) };
}

function SendResult({ st, testid = 'send-result' }: { st: SendState; testid?: string }) {
  if (st.kind === 'ok')
    return (
      <p class="cm-ok" data-testid={testid} role="status">
        {!st.queued
          ? 'Gönderildi.'
          : st.reason
            ? `Henüz gönderilemedi (${st.reason.replace(/\.$/, '')}). Kayıt bu telefonda saklandı; kendiliğinden yeniden denenecek.`
            : 'Kaydedildi. Bilgi noktasına bağlanınca gönderilecek.'}
      </p>
    );
  if (st.kind === 'error')
    return (
      <p class="cm-err" data-testid={testid} role="alert">
        {st.msg}
      </p>
    );
  return null;
}

const FILTERS: (BoardKind | 'hepsi')[] = ['hepsi', 'mesaj', 'iyiyim', 'kayip', 'duyuru'];

export function Pano() {
  const s = useBoard();
  const now = useNow();
  const [p] = useProfile();
  const [filter, setFilter] = useState<BoardKind | 'hepsi'>('hepsi');
  const [text, setText] = useState('');
  const { st, send } = useSender();
  const items = s.items.filter((i) => filter === 'hepsi' || i.kind === filter);
  const submit = async () => {
    if (!p.name.trim()) return;
    if (await send({ kind: 'mesaj', from: p.name, text })) setText('');
  };
  return (
    <Section id="pano" title="Mesaj panosu" sub="Aynı Wi-Fi ya da erişim noktasındaki herkesin gördüğü ortak pano. Herkese açıktır; özel bilgi yazmayın.">
      <ConnCard s={s} />
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <NameField />
        <label class="cm-field">
          <span class="label">Mesaj</span>
          <textarea
            class="input"
            data-testid="board-input"
            maxLength={LIMITS.text}
            value={text}
            placeholder="Ör. Okul bahçesinde su dağıtılıyor."
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          />
        </label>
        <button class="btn primary" data-testid="board-send" disabled={!p.name.trim() || !text.trim() || st.kind === 'busy'} onClick={submit}>
          {st.kind === 'busy' ? 'Gönderiliyor…' : 'Panoya gönder'}
        </button>
        {!p.name.trim() && <p class="cm-note">Göndermek için önce adınızı yazın.</p>}
        <SendResult st={st} />
      </div>
      <div class="cm-chips" role="group" aria-label="Türe göre süz">
        {FILTERS.map((f) => (
          <button key={f} class="cm-chip" data-testid={'board-filter-' + f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'hepsi' ? 'Tümü' : KIND_LABEL[f]}
          </button>
        ))}
      </div>
      <div class="cm-list" data-testid="board-list" aria-live="polite">
        {items.length ? items.map((it) => <ItemCard key={it.id} it={it} now={now} />) : <Empty s={s} what="kayıt" />}
      </div>
      {s.conn === 'connected' && s.lastSync > 0 && <p class="cm-note">Her 5 saniyede bir kendiliğinden yenilenir.</p>}
    </Section>
  );
}

const CHECKIN: { id: CheckinStatus; label: string }[] = [
  { id: 'iyiyim', label: 'İyiyim' },
  { id: 'yardim', label: 'Yardım lazım' },
  { id: 'yarali', label: 'Yaralıyım' },
];

export function Iyiyim() {
  const s = useBoard();
  const now = useNow();
  const [p, update] = useProfile();
  const [status, setStatus] = useState<CheckinStatus>('iyiyim');
  const [note, setNote] = useState('');
  const geo = useGeo();
  const { st, send } = useSender();
  const mine = s.items.filter((i) => i.kind === 'iyiyim');
  const statusText = CHECKIN.find((c) => c.id === status)!.label;
  const smsBody = (() => {
    if (status === 'iyiyim') return buildTemplate('iyiyim', { name: p.name, place: '', note, people: '', pos: geo.pos });
    return buildTemplate('yardim', { name: p.name, place: '', note: (status === 'yarali' ? 'Yaralıyım. ' : '') + note, people: '', pos: geo.pos });
  })();
  const fam = cleanPhone(p.family);
  return (
    <Section id="iyiyim" title="İyiyim bildirimi" sub="Durumunuzu panoya bırakın; yakınlarınız ve ekipler görsün. Aile numaranıza hazır SMS de gönderebilirsiniz.">
      <ConnCard s={s} />
      <div class="card" style="display:flex;flex-direction:column;gap:12px">
        <NameField />
        <div class="cm-field">
          <span class="label">Durumunuz</span>
          <div class="cm-status" role="group" aria-label="Durum">
            {CHECKIN.map((c) => (
              <button key={c.id} class={c.id} data-testid={'checkin-status-' + c.id} aria-pressed={status === c.id} onClick={() => setStatus(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <label class="cm-field">
          <span class="label">Kısa not (isteğe bağlı)</span>
          <input
            class="input"
            data-testid="checkin-note"
            maxLength={200}
            value={note}
            placeholder="Ör. Çadır kentteyim, 3 kişiyiz"
            onInput={(e) => setNote((e.target as HTMLInputElement).value)}
          />
        </label>
        <GeoButton geo={geo} testid="checkin-geo" />
        <button
          class="btn primary"
          data-testid="checkin-send"
          disabled={!p.name.trim() || st.kind === 'busy'}
          onClick={() => send({ kind: 'iyiyim', from: p.name, text: note, status, lat: geo.pos?.lat, lon: geo.pos?.lon })}
        >
          “{statusText}” olarak panoya gönder
        </button>
        <SendResult st={st} />
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <span class="label">Aileye SMS</span>
        <label class="cm-field">
          <span class="cm-note">Aile / yakın telefon numarası (bu telefonda saklanır)</span>
          <input
            class="input"
            data-testid="family-input"
            type="tel"
            inputMode="tel"
            value={p.family}
            placeholder="05xx xxx xx xx"
            onInput={(e) => update({ family: (e.target as HTMLInputElement).value })}
          />
        </label>
        <p class="cm-item-text" data-testid="checkin-sms-text" style="font-size:14px;color:var(--text2)">
          {smsBody}
        </p>
        {fam ? (
          <a class="btn primary" data-testid="checkin-sms" href={smsHref(fam, smsBody, isIOS())}>
            SMS uygulamasında aç
          </a>
        ) : (
          <p class="cm-note">SMS göndermek için numara girin.</p>
        )}
        <p class="cm-note">AFAD önerisi: afet sonrası hayati durumlar dışında arama yerine SMS kullanın; şebeke rahatlar, mesaj sırayla iletilir.</p>
      </div>
      <h2 class="cm-group">Son durum bildirimleri</h2>
      <div class="cm-list" data-testid="board-list">
        {mine.length ? mine.map((it) => <ItemCard key={it.id} it={it} now={now} />) : <Empty s={s} what="durum bildirimi" />}
      </div>
    </Section>
  );
}

export function Kayip() {
  const s = useBoard();
  const now = useNow();
  const [p] = useProfile();
  const [f, setF] = useState({ name: '', age: '', desc: '', lastSeen: '' });
  const [confirm, setConfirm] = useState<string | null>(null);
  const [show, setShow] = useState<'araniyor' | 'hepsi'>('araniyor');
  const { st, send } = useSender();
  const marker = useSender();
  const list = s.items.filter((i) => i.kind === 'kayip' && (show === 'hepsi' || i.status === 'araniyor'));
  const field = (k: keyof typeof f, label: string, ph: string, max = 120) => (
    <label class="cm-field">
      <span class="label">{label}</span>
      <input class="input" data-testid={'missing-' + k} maxLength={max} value={f[k]} placeholder={ph} onInput={(e) => setF({ ...f, [k]: (e.target as HTMLInputElement).value })} />
    </label>
  );
  const submit = async () => {
    if (await send({ kind: 'kayip', from: p.name, text: missingToText(f), status: 'araniyor' })) setF({ name: '', age: '', desc: '', lastSeen: '' });
  };
  return (
    <Section id="kayip" title="Kayıp kişi" sub="Aradığınız kişiyi panoya yazın. Bulunduğunda “Bulundu” olarak işaretleyin ki arama boşa sürmesin.">
      <ConnCard s={s} />
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <span class="label">Yeni ilan</span>
        {field('name', 'Aranan kişinin adı', 'Ör. Mehmet Demir')}
        {field('age', 'Yaşı', 'Ör. 72', 20)}
        {field('desc', 'Tarif', 'Boy, kıyafet, belirgin özellik', 300)}
        {field('lastSeen', 'Son görüldüğü yer ve saat', 'Ör. Çarşı camii önü, 09.30')}
        <NameField label="İlanı veren (sizin adınız)" />
        <button class="btn primary" data-testid="missing-send" disabled={!p.name.trim() || !f.name.trim() || st.kind === 'busy'} onClick={submit}>
          İlanı panoya gönder
        </button>
        <SendResult st={st} />
      </div>
      <div class="cm-chips" role="group" aria-label="İlanlar">
        <button class="cm-chip" data-testid="missing-show-open" aria-pressed={show === 'araniyor'} onClick={() => setShow('araniyor')}>
          Aranıyor
        </button>
        <button class="cm-chip" data-testid="missing-show-all" aria-pressed={show === 'hepsi'} onClick={() => setShow('hepsi')}>
          Tümü (bulunanlar dahil)
        </button>
      </div>
      <div class="cm-list" data-testid="board-list">
        {list.length ? (
          list.map((it) => (
            <ItemCard
              key={it.id}
              it={it}
              now={now}
              actions={
                it.status === 'araniyor' &&
                (confirm === it.id ? (
                  <div class="cm-field">
                    <p class="cm-note">Bu kişi bulundu mu? Herkes için “Bulundu” görünecek.</p>
                    <div class="cm-btns">
                      <button
                        class="btn primary"
                        data-testid="missing-found-confirm"
                        disabled={!p.name.trim()}
                        onClick={async () => {
                          // İlan sahibinin adı korunur (sunucu da güncellemede adı değiştirmez)
                          await marker.send({ id: it.id, kind: 'kayip', from: it.from, text: it.text, status: 'bulundu' });
                          setConfirm(null);
                        }}
                      >
                        Evet, bulundu
                      </button>
                      <button class="btn" data-testid="missing-found-cancel" onClick={() => setConfirm(null)}>
                        Vazgeç
                      </button>
                    </div>
                    {!p.name.trim() && <p class="cm-note">Önce yukarıya adınızı yazın.</p>}
                  </div>
                ) : (
                  <button class="btn" data-testid={'missing-found-' + it.id} onClick={() => setConfirm(it.id)}>
                    Bulundu olarak işaretle
                  </button>
                ))
              }
            />
          ))
        ) : (
          <Empty s={s} what={show === 'araniyor' ? 'açık kayıp ilanı' : 'kayıp ilanı'} />
        )}
      </div>
      <SendResult st={marker.st} testid="missing-found-result" />
    </Section>
  );
}

export function Duyurular() {
  const s = useBoard();
  const now = useNow();
  const [p] = useProfile();
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const { st, send } = useSender();
  const list = s.items.filter((i) => i.kind === 'duyuru').sort((a, b) => Number(!!b.local) - Number(!!a.local) || b.time - a.time);
  return (
    <Section id="duyuru" title="Duyurular" sub="Toplanma alanı, su/yemek dağıtımı, sağlık noktası gibi herkesi ilgilendiren bilgiler.">
      <ConnCard s={s} />
      <p class="cm-note">“Bilgi noktasından” etiketi, duyurunun bilgi noktasını çalıştıran cihazdan yazıldığını gösterir. Diğer duyuruları herkes yazabilir; önemli kararlardan önce doğrulayın.</p>
      <div class="cm-list" data-testid="board-list">
        {list.length ? list.map((it) => <ItemCard key={it.id} it={it} now={now} />) : <Empty s={s} what="duyuru" />}
      </div>
      {open ? (
        <div class="card" style="display:flex;flex-direction:column;gap:10px">
          <NameField label="Duyuran (ad / kurum)" />
          <label class="cm-field">
            <span class="label">Duyuru</span>
            <textarea class="input" data-testid="ann-text" maxLength={LIMITS.text} value={text} placeholder="Ör. Saat 15.00'te belediye önünde su dağıtılacak." onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
          </label>
          <button
            class="btn primary"
            data-testid="ann-send"
            disabled={!p.name.trim() || !text.trim() || st.kind === 'busy'}
            onClick={async () => {
              if (await send({ kind: 'duyuru', from: p.name, text })) setText('');
            }}
          >
            Duyuruyu gönder
          </button>
          <SendResult st={st} />
        </div>
      ) : (
        <button class="btn" data-testid="ann-open" onClick={() => setOpen(true)}>
          Duyuru yaz
        </button>
      )}
    </Section>
  );
}

export function Baglan() {
  const s = useBoard();
  const [p, update] = useProfile();
  const [addr, setAddr] = useState(p.server);
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState(false);
  const save = () => {
    const n = normalizeServer(addr);
    if (n === null) {
      setErr('Adres anlaşılamadı. Örnek: 192.168.43.1:8080');
      return;
    }
    setErr('');
    setAddr(n);
    update({ server: n });
    setSaved(true);
  };
  return (
    <Section id="baglan" title="Bilgi noktasına bağlan" sub="Mobil şebeke ve internet yokken telefonlar aynı Wi-Fi ağı üzerinden haberleşir. Bunun için bir “bilgi noktası” gerekir.">
      <ConnCard s={s} compact />
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <span class="label">Nasıl bağlanılır</span>
        <ol class="cm-steps">
          <li>
            Bir kişi bilgi noktası açar: Android uygulamasında <b>Araçlar › Paketler ve paylaşım › Bilgi noktası</b>, ya da bir bilgisayarda <span class="mono">node server/server.mjs</span>.
          </li>
          <li>Bilgi noktası telefonu Mobil erişim noktasını (hotspot) açar. Mobil veri gerekmez; erişim noktası internetsiz de çalışır.</li>
          <li>Diğer telefonlar Wi-Fi ayarlarından o ağa bağlanır.</li>
          <li>
            Tarayıcıda bilgi noktasının gösterdiği adresi açın (ör. <span class="mono">http://192.168.43.1:8080</span>) ya da QR kodu okutun. Akıl Çantası uygulaması kuruluysa adresi aşağıya yazın.
          </li>
        </ol>
        <div class="cm-btns">
          <button class="btn" data-testid="open-infopoint" onClick={() => go.tool('paylas')}>
            Bilgi noktası ayarları
          </button>
          {native.isAndroid() && (
            <button class="btn" data-testid="open-hotspot" onClick={() => native.openHotspotSettings()}>
              Erişim noktası ayarları
            </button>
          )}
        </div>
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <label class="cm-field">
          <span class="label">Bilgi noktası adresi (isteğe bağlı)</span>
          <input class="input" data-testid="server-input" inputMode="url" value={addr} placeholder="192.168.43.1:8080" onInput={(e) => (setAddr((e.target as HTMLInputElement).value), setSaved(false))} />
        </label>
        <div class="cm-btns">
          <button class="btn primary" data-testid="server-save" onClick={save}>
            Kaydet ve dene
          </button>
          {p.server && (
            <button
              class="btn"
              data-testid="server-clear"
              onClick={() => {
                setAddr('');
                update({ server: '' });
              }}
            >
              Adresi sil
            </button>
          )}
        </div>
        {err && <p class="cm-err">{err}</p>}
        {saved && !err && <p class="cm-note" data-testid="server-saved">Kaydedildi. {s.conn === 'connected' ? 'Bağlantı kuruldu.' : 'Bağlantı deneniyor…'}</p>}
        <p class="cm-note">Boş bırakırsanız, uygulamayı açtığınız bilgi noktası ya da bu telefonun kendi bilgi noktası kullanılır.</p>
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <span class="label">Bilgileriniz (yalnızca bu telefonda)</span>
        <NameField />
        <label class="cm-field">
          <span class="label">Aile / yakın numarası</span>
          <input class="input" data-testid="family-input-settings" type="tel" inputMode="tel" value={p.family} placeholder="05xx xxx xx xx" onInput={(e) => update({ family: (e.target as HTMLInputElement).value })} />
        </label>
      </div>
      <p class="cm-note">Bağlı değilken de el feneri, düdük, Mors ve hazır SMS araçları çalışır.</p>
    </Section>
  );
}
