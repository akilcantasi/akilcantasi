// Ayarlar: yazı boyutu, yüksek kontrast, hareketi azalt, düşük güç,
// depolama özeti, verileri sıfırlama ve uygulama hakkında.
// Ayarların kendisi src/lib/settings.ts'de; burada yalnızca arayüz var.
import { useEffect, useState } from 'preact/hooks';
import { AppLogo } from '../../Logo';
import { GuncellemeKarti } from '../../Guncelleme';
import { HATA_YAZI, guncelleme, useGuncelleme } from '../../lib/guncelleme';
import { version } from '../../../package.json';
import { go, setState, useAppState } from '../../lib/store';
import {
  TEXT_LABELS,
  TEXT_SCALES,
  formatBytes,
  getSettings,
  onSettingsChange,
  resetData,
  setSettings,
  usagePercent,
  type Settings,
  type TextSize,
} from '../../lib/settings';

const CSS = `
.st-sec { display: flex; flex-direction: column; gap: 12px; }
.st-h { font-size: 17px; font-weight: 700; margin: 0; }
.st-p { margin: 0; font-size: 13.5px; line-height: 1.45; color: var(--muted); }
.st-sizes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
.st-size { min-height: 56px; border-radius: 12px; border: 1px solid var(--line3); background: var(--bg2); color: var(--text); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 4px 2px; }
.st-size b { line-height: 1; font-weight: 700; }
.st-size span { font-size: 11px; color: var(--muted); text-align: center; line-height: 1.15; overflow-wrap: anywhere; }
.st-size[aria-checked='true'] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.st-size[aria-checked='true'] span { color: var(--on-accent); }
.st-sample { margin: 0; font-size: 15px; line-height: 1.5; color: var(--text2); background: var(--bg2); border: 1px solid var(--line2); border-radius: 12px; padding: 10px 12px; }
.st-sw { width: 100%; min-height: 56px; display: flex; align-items: center; gap: 12px; text-align: left; background: transparent; border: none; color: var(--text); padding: 6px 0; }
.st-sw + .st-sw { border-top: 1px solid var(--line2); padding-top: 12px; }
.st-sw-t { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.st-sw-t b { font-size: 15.5px; font-weight: 600; }
.st-sw-t span { font-size: 12.5px; color: var(--muted); line-height: 1.4; }
.st-track { width: 52px; height: 30px; border-radius: 999px; border: 1px solid var(--line3); background: var(--line2); position: relative; flex-shrink: 0; }
.st-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: var(--muted); transition: transform 0.15s; }
.st-sw[aria-checked='true'] .st-track { background: var(--accent); border-color: var(--accent); }
.st-sw[aria-checked='true'] .st-track::after { transform: translateX(22px); background: #0b0e13; }
.st-kv { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; font-size: 14px; margin: 0; }
.st-kv dt { color: var(--muted); }
.st-kv dd { margin: 0; color: var(--text); font-family: var(--mono); font-size: 13px; text-align: right; overflow-wrap: anywhere; }
.st-bar { height: 8px; background: var(--line2); border-radius: 4px; overflow: hidden; }
.st-bar > div { height: 100%; background: var(--accent); min-width: 2px; }
.st-confirm { display: flex; flex-direction: column; gap: 10px; background: var(--bg2); border: 1px solid var(--danger); border-radius: 12px; padding: 12px; }
.st-confirm p { margin: 0; font-size: 14px; line-height: 1.45; }
.st-check { display: flex; align-items: center; gap: 10px; min-height: 44px; font-size: 14px; }
.st-check input { width: 22px; height: 22px; accent-color: var(--danger); flex-shrink: 0; }
.st-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.st-btns .btn { flex: 1; min-width: 120px; }
.btn.st-danger { border-color: var(--danger); color: var(--danger); }
.btn.st-danger-fill { background: var(--danger); border-color: var(--danger); color: var(--on-accent); font-weight: 600; }
.st-err { margin: 0; color: var(--danger); font-size: 13px; }
.st-ok { margin: 0; color: var(--ok); font-size: 13px; }
`;

function useSettings(): Settings {
  const [s, set] = useState(getSettings());
  useEffect(() => onSettingsChange(set), []);
  return s;
}

function Switch(props: { id: string; title: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      class="st-sw"
      role="switch"
      aria-checked={props.on ? 'true' : 'false'}
      data-testid={'set-' + props.id}
      onClick={() => props.onChange(!props.on)}
    >
      <span class="st-sw-t">
        <b>{props.title}</b>
        <span>{props.desc}</span>
      </span>
      <span class="st-track" aria-hidden="true" />
    </button>
  );
}

function Display() {
  const s = useSettings();
  return (
    <section class="card st-sec" aria-labelledby="st-disp">
      <h2 class="st-h" id="st-disp">
        Görünüm
      </h2>
      <div class="label" id="st-size-l">
        Yazı boyutu
      </div>
      <div class="st-sizes" role="radiogroup" aria-labelledby="st-size-l">
        {TEXT_SCALES.map((sc, i) => (
          <button
            key={i}
            class="st-size"
            role="radio"
            aria-checked={s.textSize === i ? 'true' : 'false'}
            aria-label={TEXT_LABELS[i]}
            data-testid={'set-size-' + i}
            onClick={() => setSettings({ textSize: i as TextSize })}
          >
            <b style={{ fontSize: Math.round(15 * sc) + 'px' }}>Aa</b>
            <span>{TEXT_LABELS[i]}</span>
          </button>
        ))}
      </div>
      <p class="st-sample" data-testid="set-sample">
        Deprem anında: Çök, kapan, tutun. Sarsıntı bitene kadar yerinizden ayrılmayın.
      </p>
      <div>
        <Switch
          id="contrast"
          title="Yüksek kontrast"
          desc="Saf beyaz yazı, belirgin kenarlar. Güneş altında ya da az görenler için."
          on={s.highContrast}
          onChange={(v) => setSettings({ highContrast: v })}
        />
        <Switch
          id="motion"
          title="Hareketi azalt"
          desc="Geçiş ve kayma animasyonlarını kapatır."
          on={s.reduceMotion}
          onChange={(v) => setSettings({ reduceMotion: v })}
        />
      </div>
    </section>
  );
}

function Power() {
  const s = useSettings();
  const app = useAppState();
  return (
    <section class="card st-sec" aria-labelledby="st-pow">
      <h2 class="st-h" id="st-pow">
        Güç
      </h2>
      <div>
        <Switch
          id="lowpower"
          title="Düşük güç"
          desc="Tam siyah zemin (OLED ekranda daha az pil), animasyon yok, harita daha az çizer, Fener asistanı kapanır."
          on={s.lowPower}
          onChange={(v) => setSettings({ lowPower: v })}
        />
        <Switch
          id="saver"
          title="Pil tasarrufu"
          desc={s.lowPower ? 'Düşük güç açıkken bu da açık kalır.' : 'Fener modeli ve animasyonlar kapanır, harita daha az çizer; görünüm değişmez.'}
          on={app.batterySaver}
          onChange={(v) => {
            if (!v && s.lowPower) setSettings({ lowPower: false });
            setState({ batterySaver: v });
          }}
        />
      </div>
    </section>
  );
}

interface Est {
  status: 'loading' | 'ok' | 'none' | 'error';
  usage?: number;
  quota?: number;
  persisted?: boolean | null;
}

function Storage() {
  const [est, setEst] = useState<Est>({ status: 'loading' });
  const [msg, setMsg] = useState('');
  const refresh = async () => {
    const st: any = (navigator as any).storage;
    if (!st?.estimate) return setEst({ status: 'none' });
    try {
      const e = await st.estimate();
      const persisted = st.persisted ? await st.persisted().catch(() => null) : null;
      setEst({ status: 'ok', usage: e.usage, quota: e.quota, persisted });
    } catch {
      setEst({ status: 'error' });
    }
  };
  useEffect(() => {
    void refresh();
  }, []);
  const askPersist = async () => {
    try {
      const ok = await (navigator as any).storage.persist();
      setMsg(ok ? 'Depolama kalıcı yapıldı.' : 'Tarayıcı izin vermedi. Uygulamayı ana ekrana eklemek yardımcı olabilir.');
    } catch {
      setMsg('Bu tarayıcıda desteklenmiyor.');
    }
    void refresh();
  };
  const pct = usagePercent(est.usage, est.quota);
  return (
    <section class="card st-sec" aria-labelledby="st-sto" data-testid="set-storage">
      <h2 class="st-h" id="st-sto">
        Depolama
      </h2>
      {est.status === 'loading' && <p class="empty">Hesaplanıyor…</p>}
      {est.status === 'none' && <p class="empty">Bu tarayıcı depolama bilgisini göstermiyor.</p>}
      {est.status === 'error' && <p class="st-err">Depolama bilgisi okunamadı.</p>}
      {est.status === 'ok' && (
        <>
          <dl class="st-kv">
            <dt>Kullanılan</dt>
            <dd data-testid="set-usage">{formatBytes(est.usage)}</dd>
            <dt>Kullanılabilir</dt>
            <dd data-testid="set-quota">{formatBytes(est.quota)}</dd>
            <dt>Kalıcı depolama</dt>
            <dd data-testid="set-persisted">{est.persisted == null ? 'bilinmiyor' : est.persisted ? 'evet' : 'hayır'}</dd>
          </dl>
          {pct != null && (
            <div
              class="st-bar"
              role="progressbar"
              aria-label="Depolama doluluğu"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
            >
              <div style={{ width: pct.toFixed(1) + '%' }} />
            </div>
          )}
          <p class="st-p">Paketler (Vikipedi, harita, model) en çok yeri kaplar. Tek tek silmek için "Paketler ve paylaşım" aracını kullanın.</p>
          {est.persisted === false && (
            <button class="btn" data-testid="set-persist" onClick={askPersist}>
              Kalıcı depolama iste
            </button>
          )}
          {msg && <p class="st-p">{msg}</p>}
        </>
      )}
    </section>
  );
}

function Reset() {
  const [step, setStep] = useState<'idle' | 'confirm' | 'busy' | 'done'>('idle');
  const [packs, setPacks] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const run = async () => {
    setStep('busy');
    const errs = await resetData({ packs });
    setErrors(errs);
    setStep('done');
    if (!errs.length) setTimeout(() => location.reload(), 900);
  };
  return (
    <section class="card st-sec" aria-labelledby="st-reset">
      <h2 class="st-h" id="st-reset">
        Verileri sıfırla
      </h2>
      <p class="st-p">Ayarlar, kontrol listeleri, stok listesi ve sohbet geçmişi silinir. İndirilen paketler isterseniz kalır.</p>
      {step === 'idle' && (
        <button class="btn st-danger" data-testid="set-reset" onClick={() => setStep('confirm')}>
          Verileri sıfırla
        </button>
      )}
      {(step === 'confirm' || step === 'busy') && (
        <div class="st-confirm" role="group" aria-labelledby="st-reset-q" data-testid="set-reset-confirm">
          <p id="st-reset-q">
            <b>Emin misiniz?</b> Bu işlem geri alınamaz.
          </p>
          <label class="st-check">
            <input type="checkbox" checked={packs} data-testid="set-reset-packs" onChange={(e) => setPacks((e.target as HTMLInputElement).checked)} />
            İndirilen paketleri de sil (Vikipedi, harita, model)
          </label>
          <div class="st-btns">
            <button class="btn" data-testid="set-reset-cancel" disabled={step === 'busy'} onClick={() => setStep('idle')}>
              Vazgeç
            </button>
            <button class="btn st-danger-fill" data-testid="set-reset-yes" disabled={step === 'busy'} onClick={run}>
              {step === 'busy' ? 'Siliniyor…' : 'Evet, sil'}
            </button>
          </div>
        </div>
      )}
      {step === 'done' &&
        (errors.length ? (
          <>
            <p class="st-err" data-testid="set-reset-result">
              Bazı veriler silinemedi: {errors.join(', ')}. Uygulamayı kapatıp yeniden deneyin.
            </p>
            <button class="btn" onClick={() => location.reload()} data-testid="set-reload">
              Yeniden başlat
            </button>
          </>
        ) : (
          <p class="st-ok" data-testid="set-reset-result">
            Veriler silindi. Uygulama yeniden başlıyor…
          </p>
        ))}
    </section>
  );
}

function openLicenses() {
  go.tool('paylas');
  // Paylaşım aracı tembel yüklenir; lisans kutusu görününce aç ve kaydır.
  let n = 0;
  const t = setInterval(() => {
    const el = document.querySelector('[data-testid="licenses"]') as HTMLDetailsElement | null;
    if (el || ++n > 100) {
      clearInterval(t);
      if (el) {
        el.open = true;
        el.scrollIntoView({ block: 'start' });
        (el.querySelector('summary') as HTMLElement | null)?.focus();
      }
    }
  }, 75);
}

function Guncelleme() {
  const s = useSettings();
  const d = useGuncelleme();
  if (!guncelleme.available() || !d) return null;
  const son = d.sonDenetim ? new Date(d.sonDenetim).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : 'hiç';
  return (
    <section class="card st-sec" aria-labelledby="st-upd" data-testid="set-update">
      <h2 class="st-h" id="st-upd">
        Uygulama güncellemesi
      </h2>
      <Switch
        id="update-check"
        title="Yeni sürümü denetle"
        desc="İnternet varken günde bir kez GitHub'a yeni sürüm var mı diye sorulur (telefonun IP adresi GitHub'a görünür). Wi-Fi'dayken yeni sürüm kendiliğinden indirilir; kurulum her zaman yalnız siz düğmeye basınca olur."
        on={s.updateCheck}
        onChange={(v) => setSettings({ updateCheck: v })}
      />
      <p class="st-p">
        Kurulu sürüm {d.kurulu || '?'} · son denetim {son}
        {d.is === 'denetleniyor' ? ' · denetleniyor…' : ''}
      </p>
      {d.yeni ? (
        <GuncellemeKarti d={d} />
      ) : (
        <>
          {d.hata && <p class="st-err">{HATA_YAZI[d.hata] ?? d.hata}</p>}
          {d.sonDenetim > 0 && !d.hata && d.is === '' && <p class="st-ok">Güncel.</p>}
        </>
      )}
      <button class="btn" data-testid="set-update-now" disabled={d.is !== ''} onClick={() => guncelleme.denetle(false)}>
        Şimdi denetle
      </button>
    </section>
  );
}

function About() {
  return (
    <section class="card st-sec" aria-labelledby="st-about" data-testid="set-about">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <AppLogo size={56} class="st-logo" />
        <h2 class="st-h" id="st-about">
          Uygulama hakkında
        </h2>
      </div>
      <dl class="st-kv">
        <dt>Uygulama</dt>
        <dd>Akıl Çantası</dd>
        <dt>Sürüm</dt>
        <dd data-testid="set-version">{version}</dd>
        <dt>Lisans</dt>
        <dd data-testid="set-license">GPL-3.0</dd>
      </dl>
      <p class="st-p">
        Akıl Çantası özgür yazılımdır (GNU GPL 3.0 ya da sonrası): kaynak kodunu kullanabilir, değiştirebilir ve aynı lisansla paylaşabilirsiniz. Tüm içerik
        cihazda çalışır; kişisel veri dışarı gönderilmez. (Güncelleme denetimi açıksa GitHub'a yalnız sürüm sorulur.)
      </p>
      <button class="btn" data-testid="set-licenses" onClick={openLicenses}>
        Kaynaklar ve lisanslar
      </button>
    </section>
  );
}

export default function Tool() {
  return (
    <>
      <style>{CSS}</style>
      <Display />
      <Power />
      <Storage />
      <Reset />
      <Guncelleme />
      <About />
    </>
  );
}
