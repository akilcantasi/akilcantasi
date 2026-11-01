// Pil ve şarj: Battery Status API (Chrome/Android WebView) ile seviye ve şarj
// durumu, zaman içinde ölçülen boşalma hızından kalan süre tahmini, afet anı için
// telefon tasarruf ipuçları ve uygulamanın kendi pil tasarrufu modu.
import { useEffect, useRef, useState } from 'preact/hooks';
import { setState, useAppState } from '../../lib/store';
import { addSample, estimate, formatMinutes, MIN_DROP, MIN_SPAN_MS, type Sample } from '../_kaynak/battery';
import { KEYS, loadJSON, saveJSON } from '../_kaynak/storage';
import { KAYNAK_CSS } from '../_kaynak/ui';

interface BatteryLike extends EventTarget {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

type Status = 'loading' | 'ok' | 'unsupported' | 'error';

// İpuçları: FCC "Tips for Communicating in an Emergency" (kısa arama, mümkünse SMS,
// ekran parlaklığını azaltma, uçak modu, kullanılmayan uygulamaları kapatma) ve
// Ready.gov (telefon şarj cihazı ve yedek batarya) genel önerilerine dayanır.
const TIPS: { b: string; t: string }[] = [
  { b: 'Düşük güç modunu açın.', t: 'Android: Ayarlar › Pil › Pil tasarrufu. iPhone: Ayarlar › Pil › Düşük Güç Modu.' },
  { b: 'Arama yerine SMS gönderin.', t: 'Kısa mesaj daha az pil harcar ve yoğun şebekede daha kolay iletilir. Aramaları kısa tutun.' },
  { b: 'Şebeke zayıfsa uçak moduna alın.', t: 'Telefon sinyal ararken çok pil yakar. Belirli saatlerde (ör. her saat başı 10 dk) açıp mesajlara bakın; bu saati ailenizle önceden konuşun.' },
  { b: 'Ekranı karartın.', t: 'Parlaklığı en aza, ekran zaman aşımını 15–30 saniyeye indirin; koyu tema kullanın.' },
  { b: 'Kullanmadığınızı kapatın.', t: 'Wi-Fi, Bluetooth, konum, NFC, otomatik güncelleme ve senkronizasyon. Arka plandaki uygulamaları kapatın.' },
  { b: 'Video, oyun ve sosyal medyadan uzak durun.', t: 'Haber için pilli radyo daha az enerjiyle günlerce çalışır.' },
  { b: 'Telefon flaşını uzun süre fener olarak kullanmayın.', t: 'Ayrı bir el feneri ve yedek pil daha verimlidir.' },
  { b: 'Telefonu ılık tutun.', t: 'Soğukta pil hızla düşer; iç cebinizde taşıyın. Güneşte ve sıcak araçta bırakmayın.' },
  { b: 'Powerbank\'i idareli kullanın.', t: 'Telefonu kapalıyken şarj etmek daha hızlıdır. Araçta şarj ederken motoru kapalı alanda çalıştırmayın (karbonmonoksit).' },
  { b: 'Pil çok azaldıysa telefonu kapatın.', t: 'Yalnız gerektiğinde açın; acil bir 112 araması için yedek bırakın.' },
];

function load(): Sample[] {
  const r = loadJSON<Sample[]>(KEYS.pil, []);
  if (!Array.isArray(r)) return [];
  const ok = r.filter((s) => s && typeof s.t === 'number' && typeof s.level === 'number');
  const last = ok[ok.length - 1];
  // 3 saatten eski ölçümler tahmini bozar
  return last && Date.now() - last.t < 3 * 3600 * 1000 ? ok : [];
}

export default function Pil() {
  const app = useAppState();
  const [status, setStatus] = useState<Status>('loading');
  const [bat, setBat] = useState<{ level: number; charging: boolean; chargingTime: number; dischargingTime: number } | null>(null);
  const [samples, setSamples] = useState<Sample[]>(load);
  const samplesRef = useRef(samples);
  samplesRef.current = samples;

  useEffect(() => {
    let alive = true;
    let b: BatteryLike | null = null;
    let timer: number | undefined;
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryLike> };
    const read = () => {
      if (!b || !alive) return;
      const snap = { level: b.level, charging: b.charging, chargingTime: b.chargingTime, dischargingTime: b.dischargingTime };
      setBat(snap);
      const next = addSample(samplesRef.current, { t: Date.now(), level: snap.level, charging: snap.charging });
      if (next !== samplesRef.current) {
        samplesRef.current = next;
        setSamples(next);
        saveJSON(KEYS.pil, next);
      }
    };
    if (typeof nav.getBattery !== 'function') {
      setStatus('unsupported');
      return;
    }
    nav
      .getBattery()
      .then((bm) => {
        if (!alive) return;
        b = bm;
        setStatus('ok');
        read();
        bm.addEventListener('levelchange', read);
        bm.addEventListener('chargingchange', read);
        timer = window.setInterval(read, 60000);
      })
      .catch(() => alive && setStatus('error'));
    return () => {
      alive = false;
      if (timer) clearInterval(timer);
      b?.removeEventListener('levelchange', read);
      b?.removeEventListener('chargingchange', read);
    };
  }, []);

  const est = bat ? estimate(samples, bat) : null;
  // Şarjda ve %100'de tarayıcı chargingTime=0 bildirir: "bilinmiyor" yerine "Dolu"
  const full = !!bat && bat.charging && bat.level >= 0.995;
  const pct = bat ? Math.round(bat.level * 100) : 0;
  const first = samples[0];
  const measuredMin = first && samples.length > 1 ? Math.round((samples[samples.length - 1].t - first.t) / 60000) : 0;

  return (
    <div class="kn" data-testid="pil">
      <style>{KAYNAK_CSS}</style>

      <section class="card" style="display:flex;flex-direction:column;gap:10px" data-testid="pil-status">
        {status === 'loading' && <p class="empty" data-testid="pil-loading">Pil bilgisi okunuyor…</p>}
        {(status === 'unsupported' || status === 'error') && (
          <div data-testid="pil-unsupported" style="display:flex;flex-direction:column;gap:6px">
            <b>Bu tarayıcı pil bilgisini paylaşmıyor.</b>
            <p class="kn-sub">
              {status === 'error' ? 'Pil bilgisi okunurken hata oluştu.' : 'Pil durumu yalnız Chrome tabanlı tarayıcılarda ve Android uygulamasında görünür.'} Seviyeyi telefonun durum çubuğundan izleyin; aşağıdaki ipuçları her telefonda geçerlidir.
            </p>
          </div>
        )}
        {status === 'ok' && bat && (
          <>
            <div class="row">
              <span class={'kn-big ' + (pct <= 15 ? 'kn-red' : pct <= 30 ? 'kn-amber' : '')} data-testid="pil-level">%{pct}</span>
              <span class="grow" />
              <span class="tag" data-testid="pil-charging">{bat.charging ? 'Şarj oluyor' : 'Pilde'}</span>
            </div>
            <div class={'kn-pbar' + (pct <= 15 ? ' bad' : pct >= 80 ? ' ok' : '')} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Pil seviyesi">
              <div style={`width:${pct}%`} />
            </div>
            <div class="kn-stat" data-testid="pil-estimate">
              <span class="label">{bat.charging ? 'Dolmaya kalan' : 'Tahmini kalan süre'}</span>
              <span class="kn-big" data-testid="pil-remaining" style="font-size:24px">
                {full ? 'Dolu' : est && est.minutes !== null ? (bat.charging && est.basis === 'olcum' ? '—' : formatMinutes(est.minutes)) : '—'}
              </span>
              <small data-testid="pil-basis">
                {bat.charging
                  ? full
                    ? 'Pil tam dolu. Şarj cihazını çıkarabilirsiniz.'
                    : est?.basis === 'sistem'
                    ? 'Tarayıcının bildirdiği süre.'
                    : 'Şarj süresi bilinmiyor. Fişten çekince boşalma ölçülmeye başlar.'
                  : est?.basis === 'olcum'
                    ? `Son ${measuredMin} dakikadaki ölçüme göre: saatte ~%${est.ratePctPerHour?.toLocaleString('tr-TR')} düşüş. Kullanıma göre değişir.`
                    : est?.basis === 'sistem'
                      ? `Tarayıcının bildirdiği süre. Ölçüm sürüyor (${measuredMin} dk); en az ${MIN_SPAN_MS / 60000} dk ve %${MIN_DROP * 100} düşüş gerekir.`
                      : `Ölçülüyor (${measuredMin} dk). Tahmin için bu ekran açıkken en az ${MIN_SPAN_MS / 60000} dk ve %${MIN_DROP * 100} düşüş gerekir.`}
              </small>
            </div>
          </>
        )}
      </section>

      <section class="card" data-testid="pil-saver">
        <div class="kn-switch">
          <div style="display:flex;flex-direction:column;gap:2px">
            <b id="pil-saver-l">Uygulamada pil tasarrufu</b>
            <span class="kn-sub">Fener'in yapay zekâ modeli kapanır (Fener rehberden yanıt verir), animasyonlar durur, harita daha az çizer.</span>
          </div>
          <button
            role="switch"
            class="kn-toggle"
            aria-checked={app.batterySaver}
            aria-labelledby="pil-saver-l"
            data-testid="pil-saver-switch"
            onClick={() => setState({ batterySaver: !app.batterySaver })}
          />
        </div>
        <p class="kn-sub" data-testid="pil-saver-state">{app.batterySaver ? 'Açık.' : 'Kapalı.'}</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:10px" data-testid="pil-tips">
        <h2 class="kn-h">Afette telefonun pilini uzatmak</h2>
        <ol class="kn-tips">
          {TIPS.map((t) => (
            <li key={t.b}>
              <b>{t.b}</b> <span class="muted">{t.t}</span>
            </li>
          ))}
        </ol>
        <p class="kn-sub">Kaynak: FCC "Acil durumda iletişim ipuçları", Ready.gov "Build a Kit" (şarj cihazı ve yedek batarya).</p>
      </section>
    </div>
  );
}
