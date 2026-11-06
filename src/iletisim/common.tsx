// İletişim sekmesi: ortak bileşenler, profil ve konum.
import type { ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { go } from '../lib/store';
import { KIND_LABEL, STATUS_LABEL, formatCoords, parseMissing, timeAgo, type BoardItem } from './board';
import { loadProfile, saveProfile, type Profile } from './outbox';
import { board, type ServiceState } from './client';
import type { Pos } from './sms';
import { sonKonumKaydet } from '../lib/enkaz/enkaz';

export const CSS = `
.cm-back { align-self: flex-start; min-height: 44px; background: var(--glass); border: 1px solid var(--glass-line); border-radius: 999px; color: var(--accent2); font-size: 14px; font-weight: 500; padding: 0 14px; }
.cm-title { font-size: 24px; font-weight: 600; margin: 0; }
.cm-sub { margin: -6px 0 0; color: var(--muted); font-size: 14px; line-height: 1.45; }
.cm-group { font-size: 15px; color: var(--text); margin: 6px 0 0; font-weight: 600; }
.cm-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.cm-card { text-align: left; background: var(--card); border: 1px solid var(--line2); border-radius: 18px; padding: 14px 12px; color: var(--text); display: flex; flex-direction: column; gap: 4px; min-height: 84px; position: relative; }
.cm-card:hover { border-color: var(--line3); }
.cm-card b { font-size: 16px; line-height: 1.25; }
.cm-card span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
/* ana ekran */
.cm-hero { display: flex; flex-direction: column; gap: 4px; padding: 4px 2px 2px; }
.cm-hero-title { margin: 0; font-size: 22px; font-weight: 600; line-height: 1.25; }
.cm-hero-sub { margin: 0; font-size: 14px; color: var(--text2); line-height: 1.45; }
.cm-group-sub { margin: -8px 0 0; font-size: 13px; color: var(--muted); line-height: 1.4; }
.cm-ic, .cm-card .cm-ic { width: 44px; height: 44px; flex-shrink: 0; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); color: var(--accent2); }
.cm-quick { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.cm-quick .cm-card { min-height: 150px; gap: 6px; padding: 16px 14px; border-radius: 20px; }
.cm-quick .cm-card .cm-ic { margin-bottom: 6px; }
.cm-quick .cm-card b { font-size: 17px; }
.cm-sos-card { background: linear-gradient(160deg, rgba(229,72,77,0.22), rgba(229,72,77,0.08)) !important; border-color: rgba(229,72,77,0.5) !important; }
.cm-sos-card .cm-ic { background: var(--sos); color: #fff; box-shadow: 0 6px 16px rgba(229,72,77,0.4); }
.cm-sms-card { background: linear-gradient(160deg, rgba(79,209,165,0.16), rgba(79,209,165,0.05)) !important; border-color: rgba(79,209,165,0.4) !important; }
.cm-sms-card .cm-ic { background: var(--ok); color: #0e1b2c; }
.cm-rows { display: flex; flex-direction: column; gap: 8px; }
.cm-card.cm-row { flex-direction: row; align-items: center; gap: 12px; min-height: 72px; padding: 12px 14px; }
.cm-row-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.cm-row .cm-count { position: static; flex-shrink: 0; }
.cm-card .cm-count { color: var(--on-accent); font-size: 12px; }
/* .cm-card span (12,5 px) bunu ezmesin: ok işareti okunur boyutta kalsın */
.cm-card .cm-chev { font-size: 26px; line-height: 1; color: var(--muted); flex-shrink: 0; padding-left: 2px; display: flex; }

/* SOS ekranı */
.sos-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.sos-big { width: 196px; height: 196px; margin: 20px 0 16px; border-radius: 50%; border: 0; background: radial-gradient(circle at 50% 35%, #ff6b6f, var(--sos) 62%); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-shadow: 0 0 0 14px rgba(229,72,77,0.12), 0 0 0 30px rgba(229,72,77,0.05), 0 18px 50px rgba(229,72,77,0.45); }
.sos-big:active { transform: scale(0.97); }
.sos-big b { font-size: 34px; font-weight: 700; letter-spacing: 0.06em; }
.sos-big span { font-size: 13px; font-weight: 500; opacity: 0.95; }
.sos-call { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1px solid rgba(229,72,77,0.6); color: #ffd1cb; text-decoration: none; font-weight: 600; font-size: 15px; background: rgba(229,72,77,0.1); }
.sos-tiles { width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.sos-tile { background: var(--glass); border: 1px solid var(--glass-line); border-radius: 18px; padding: 12px 6px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; font-size: 12.5px; font-weight: 500; line-height: 1.25; color: var(--text); }
.sos-tile svg { color: var(--accent2); }
.sos-tile[aria-disabled='true'] { opacity: 0.55; }
button.sos-tile { min-height: 100%; }
button.sos-tile:hover { border-color: rgba(255,200,97,0.5); }
.sos-tile-go { font-size: 12.5px; font-weight: 600; color: var(--accent2); min-height: 28px; display: flex; align-items: center; }
/* Anahtar: dokunma alanı 56×44, görünen ray 50×28 */
.sw { position: relative; width: 56px; height: 44px; border: 0; padding: 0; background: transparent; flex-shrink: 0; }
.sw::before { content: ''; position: absolute; left: 3px; top: 8px; width: 50px; height: 28px; border-radius: 999px; background: rgba(255,255,255,0.24); }
.sw::after { content: ''; position: absolute; left: 6px; top: 11px; width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: left 0.15s; }
/* Uygulamanın diğer anahtarlarıyla aynı: açıkken kehribar */
.sw[aria-checked='true']::before { background: var(--accent); }
.sw[aria-checked='true']::after { left: 28px; background: #0b0e13; }
.sw:disabled { cursor: default; }
.sos-seg { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; border-radius: 999px; background: var(--glass); border: 1px solid var(--glass-line); }
.sos-seg button { min-height: 44px; border-radius: 999px; border: 0; background: transparent; color: var(--text2); font-size: 14px; font-weight: 500; }
.sos-seg button[aria-pressed='true'] { background: var(--accent); color: var(--on-accent); font-weight: 600; }
.sos-row2 { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sos-btn { min-height: 92px; border-radius: 20px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 15px; font-weight: 600; padding: 10px; }
.sos-btn svg { color: var(--accent2); }
.sos-btn small { font-size: 12px; font-weight: 500; color: var(--muted); }
.sos-btn[aria-pressed='true'] { background: var(--sos); border-color: var(--sos); color: #fff; }
.sos-btn[aria-pressed='true'] svg, .sos-btn[aria-pressed='true'] small { color: #fff; }
.sos-head { width: 100%; font-size: 15px; font-weight: 600; margin: 6px 0 -6px; }
.sos-wrap .cm-note { width: 100%; }
.cm-count { position: absolute; top: 10px; right: 10px; min-width: 22px; height: 22px; border-radius: 11px; background: var(--accent); color: var(--on-accent); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 6px; }
.cm-conn { display: flex; gap: 12px; align-items: flex-start; }
.cm-conn .dot { margin-top: 7px; flex-shrink: 0; }
.cm-conn .dot.warn { background: var(--accent); }
.cm-conn b { font-size: 15px; }
.cm-conn p { margin: 4px 0 0; font-size: 13.5px; color: var(--text2); line-height: 1.45; }
.cm-field { display: flex; flex-direction: column; gap: 6px; }
.cm-field textarea.input { height: auto; min-height: 92px; padding: 12px 14px; resize: vertical; line-height: 1.45; }
.cm-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.cm-chip { min-height: 44px; padding: 0 14px; border-radius: 22px; border: 1px solid var(--glass-line); background: var(--glass); color: var(--text2); font-size: 14px; }
.cm-chip[aria-pressed='true'] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); font-weight: 600; }
.cm-status { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.cm-status button { min-height: 64px; border-radius: 16px; border: 2px solid var(--line3); background: var(--bg2); color: var(--text); font-size: 15px; font-weight: 600; padding: 6px; }
.cm-status button[aria-pressed='true'].iyiyim { border-color: var(--ok); background: #10261c; }
.cm-status button[aria-pressed='true'].yardim { border-color: var(--accent); background: #2a2010; }
.cm-status button[aria-pressed='true'].yarali { border-color: var(--danger); background: rgba(229,72,77,0.14); }
.cm-list { display: flex; flex-direction: column; gap: 10px; }
.cm-item { background: var(--card); border: 1px solid var(--line2); border-radius: 18px; padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; }
.cm-item.pending { border-style: dashed; }
.cm-item-head { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 12.5px; color: var(--muted); }
.cm-item-head b { color: var(--text); font-size: 14.5px; }
.cm-item-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 15px; line-height: 1.45; color: var(--text); margin: 0; }
.cm-tag { font-size: 11.5px; padding: 2px 8px; border-radius: 8px; border: 1px solid var(--line3); color: var(--text2); white-space: nowrap; }
.cm-tag.iyiyim, .cm-tag.bulundu { border-color: #2a6b4c; color: var(--ok); }
.cm-tag.yardim, .cm-tag.araniyor, .cm-tag.pending { border-color: #6b5320; color: var(--accent); }
.cm-tag.yarali { border-color: #7a3a33; color: var(--danger); }
.cm-tag.local { border-color: #2a4f7a; color: var(--blue); }
.cm-coords { font-family: var(--mono); font-size: 12.5px; color: var(--muted); }
.cm-kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; font-size: 14.5px; margin: 0; }
.cm-kv dt { color: var(--muted); }
.cm-kv dd { margin: 0; overflow-wrap: anywhere; }
.cm-note { font-size: 13px; color: var(--muted); line-height: 1.45; margin: 0; }
.cm-ok { color: var(--ok); font-size: 14px; margin: 0; }
.cm-err { color: var(--danger); font-size: 14px; margin: 0; }
.cm-steps { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 14.5px; line-height: 1.5; color: var(--text2); overflow-wrap: anywhere; }
.cm-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.cm-btns .btn { flex: 1 1 140px; }
a.btn { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
.cm-mono { font-family: var(--mono); font-size: 15px; line-height: 1.6; overflow-wrap: anywhere; white-space: pre-wrap; margin: 0; letter-spacing: 0.04em; }
.cm-check { display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 15px; }
.cm-check input { width: 22px; height: 22px; accent-color: var(--accent); }
.cm-big { min-height: 64px; font-size: 18px; font-weight: 700; border-radius: 18px; }
.cm-big.danger { background: var(--sos); border-color: var(--sos); color: #fff; }
.cm-flash { position: fixed; inset: 0; z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding: 24px 24px calc(32px + var(--sa-bottom)); gap: 10px; }
.cm-flash .btn { min-height: 64px; min-width: 200px; font-size: 18px; font-weight: 700; background: rgba(0,0,0,0.75); color: #fff; border-color: #fff; }
.cm-flash small { background: rgba(0,0,0,0.6); color: #fff; padding: 4px 10px; border-radius: 8px; font-size: 13px; }
`;

export function Back() {
  return (
    <button class="cm-back" data-testid="comm-back" onClick={() => go.comm(null)}>
      ← İletişim
    </button>
  );
}

export function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ComponentChildren }) {
  useEffect(() => {
    document.getElementById('main')?.scrollTo({ top: 0 });
  }, [id]);
  return (
    <div class="pad" data-testid={'comm-' + id}>
      <Back />
      <h1 class="cm-title">{title}</h1>
      {sub && <p class="cm-sub">{sub}</p>}
      {children}
    </div>
  );
}

// ---- Profil (ad, aile numarası, bilgi noktası adresi): yerelde saklanır ----

const profListeners = new Set<(p: Profile) => void>();
let prof: Profile | null = null;

export function useProfile(): [Profile, (p: Partial<Profile>) => void] {
  const [p, set] = useState<Profile>(() => (prof ??= loadProfile()));
  useEffect(() => {
    profListeners.add(set);
    return () => void profListeners.delete(set);
  }, []);
  const update = (patch: Partial<Profile>) => {
    prof = saveProfile(patch);
    profListeners.forEach((l) => l(prof!));
    if ('server' in patch) board.refreshNow();
  };
  return [p, update];
}

export function NameField({ label = 'Adınız' }: { label?: string }) {
  const [p, update] = useProfile();
  return (
    <label class="cm-field">
      <span class="label">{label}</span>
      <input
        class="input"
        data-testid="name-input"
        value={p.name}
        maxLength={40}
        autocomplete="name"
        placeholder="Ör. Ayşe Yılmaz"
        onInput={(e) => update({ name: (e.target as HTMLInputElement).value })}
      />
    </label>
  );
}

// ---- Konum (GPS internetsiz çalışır) ----

let lastPos: (Pos & { at: number }) | null = null;

/** Son bilinen konum yeterince tazeyse hemen, değilse en çok timeoutMs bekleyerek konum verir; alınamazsa null. */
export function quickPosition(timeoutMs = 7000, maxAgeMs = 10 * 60 * 1000): Promise<Pos | null> {
  if (lastPos && Date.now() - lastPos.at < maxAgeMs) return Promise.resolve(lastPos);
  if (typeof navigator === 'undefined' || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    let done = false;
    const finish = (p: Pos | null) => {
      if (!done) {
        done = true;
        resolve(p);
      }
    };
    setTimeout(() => finish(lastPos), timeoutMs + 300);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        lastPos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, at: Date.now() };
        sonKonumKaydet(lastPos);
        finish(lastPos);
      },
      () => finish(lastPos),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: maxAgeMs },
    );
  });
}

/** Konum izni zaten verilmişse konumu arka planda ısıtır (dokununca beklemeden gitsin). */
export async function warmPosition() {
  try {
    const st = await (navigator as any).permissions?.query?.({ name: 'geolocation' });
    if (st?.state === 'granted') void quickPosition(15000);
  } catch {}
}

export function useGeo() {
  const [pos, setPos] = useState<Pos | null>(lastPos);
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>(lastPos ? 'ok' : 'idle');
  const [error, setError] = useState('');
  const request = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState('error');
      setError('Bu cihazda konum desteklenmiyor.');
      return;
    }
    setState('loading');
    setError('');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        lastPos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, at: Date.now() };
        setPos(lastPos);
        setState('ok');
      },
      (e) => {
        setState('error');
        setError(
          e.code === 1
            ? 'Konum izni verilmedi. Tarayıcı/telefon ayarlarından izin verin.'
            : e.code === 3
              ? 'Konum zamanında alınamadı. Açık alana çıkıp yeniden deneyin.'
              : 'Konum alınamadı. Konum (GPS) açık mı?',
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 },
    );
  };
  const clear = () => {
    setPos(null);
    setState('idle');
  };
  return { pos, state, error, request, clear };
}

export function GeoButton({ geo, testid }: { geo: ReturnType<typeof useGeo>; testid: string }) {
  return (
    <div class="cm-field">
      <div class="cm-btns">
        <button class="btn" data-testid={testid} onClick={geo.request} disabled={geo.state === 'loading'}>
          {geo.state === 'loading' ? 'Konum alınıyor…' : geo.pos ? 'Konumu yenile' : 'Konumumu ekle'}
        </button>
        {geo.pos && (
          <button class="btn" data-testid={testid + '-clear'} onClick={geo.clear}>
            Konumu çıkar
          </button>
        )}
      </div>
      {geo.pos && (
        <span class="cm-coords" data-testid={testid + '-value'}>
          {formatCoords(geo.pos.lat, geo.pos.lon)}
          {geo.pos.acc != null ? ` · ±${Math.round(geo.pos.acc)} m` : ''}
        </span>
      )}
      {geo.error && <p class="cm-err">{geo.error}</p>}
      <p class="cm-note">Konum GPS ile alınır; internet gerekmez. Kapalı alanda uzun sürebilir.</p>
    </div>
  );
}

// ---- Bağlantı durumu ----

export function ConnCard({ s, compact }: { s: ServiceState; compact?: boolean }) {
  if (s.conn === 'checking')
    return (
      <div class="card cm-conn" data-testid="conn-status" data-state="checking">
        <span class="dot" />
        <div>
          <b>Bilgi noktası aranıyor…</b>
        </div>
      </div>
    );
  if (s.conn === 'connected')
    return (
      <div class="card cm-conn" data-testid="conn-status" data-state="connected">
        <span class="dot on" />
        <div>
          <b>Bilgi noktasına bağlı</b>
          <p>
            {s.serverName || 'Akıl Çantası bilgi noktası'}
            {s.clients ? ` · ${s.clients} cihaz` : ''}
            {s.outbox ? ` · ${s.outbox} kayıt gönderiliyor` : ''}
          </p>
          {s.meshOn && <p>Yakın cihaz ağı açık · {s.meshPeers} cihaz</p>}
        </div>
      </div>
    );
  return (
    <div class="card cm-conn" data-testid="conn-status" data-state="offline">
      <span class="dot warn" />
      <div>
        <b>Bilgi noktasına bağlı değilsiniz</b>
        <p>
          Yazdıklarınız bu telefonda saklanır, bir bilgi noktasına bağlanınca kendiliğinden gönderilir.
          {s.outbox ? (
            <>
              {' '}
              <span data-testid="outbox-count">{s.outbox}</span> kayıt bekliyor.
            </>
          ) : null}
        </p>
        {s.meshOn && <p>Yakın cihaz ağı açık · {s.meshPeers} cihaz</p>}
        {!compact && (
          <button class="link-btn" style="color:var(--accent);min-height:44px" data-testid="conn-help" onClick={() => go.comm('baglan')}>
            Nasıl bağlanırım? →
          </button>
        )}
      </div>
    </div>
  );
}

// ---- Pano kaydı ----

export function ItemCard({ it, now, actions }: { it: BoardItem; now: number; actions?: ComponentChildren }) {
  const st = it.status;
  const missing = it.kind === 'kayip' ? parseMissing(it.text) : null;
  return (
    <article class={'cm-item' + (it.pending ? ' pending' : '')} data-testid="board-item" data-kind={it.kind} data-id={it.id} data-status={st ?? ''}>
      <div class="cm-item-head">
        <span class="cm-tag">{KIND_LABEL[it.kind]}</span>
        {st && <span class={'cm-tag ' + st}>{STATUS_LABEL[st]}</span>}
        <b>{it.from}</b>
        <span>{it.pending ? '' : timeAgo(it.time, now)}</span>
        {it.pending && <span class="cm-tag pending">gönderilmeyi bekliyor</span>}
        {it.local && <span class="cm-tag local">bilgi noktasından</span>}
        {it.viaMesh && <span class="cm-tag">yakın cihazdan</span>}
      </div>
      {missing ? (
        <dl class="cm-kv">
          {missing.name && (
            <>
              <dt>Ad</dt>
              <dd data-testid="missing-item-name">{missing.name}</dd>
            </>
          )}
          {missing.age && (
            <>
              <dt>Yaş</dt>
              <dd>{missing.age}</dd>
            </>
          )}
          {missing.desc && (
            <>
              <dt>Tarif</dt>
              <dd>{missing.desc}</dd>
            </>
          )}
          {missing.lastSeen && (
            <>
              <dt>Son görülme</dt>
              <dd>{missing.lastSeen}</dd>
            </>
          )}
        </dl>
      ) : (
        it.text && (
          <p class="cm-item-text" data-testid="board-text">
            {it.text}
          </p>
        )
      )}
      {it.lat != null && it.lon != null && <span class="cm-coords">Konum: {formatCoords(it.lat, it.lon)}</span>}
      {actions}
    </article>
  );
}

/** Dakikada bir "x dk önce" yazılarını tazeler */
export function useNow(ms = 30000) {
  const [now, set] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => set(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function Empty({ s, what }: { s: ServiceState; what: string }) {
  return (
    <p class="empty" data-testid="board-empty">
      {s.conn === 'checking'
        ? 'Yükleniyor…'
        : s.conn === 'offline'
          ? `Henüz ${what} yok. Bilgi noktasına bağlanınca diğer telefonlardan gelenler burada görünür.`
          : `Henüz ${what} yok.`}
    </p>
  );
}
