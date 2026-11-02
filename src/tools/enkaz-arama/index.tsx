// Enkaz arama (kurtarıcı): yakındaki enkaz işaretlerini duyar; seçilen işaret için sinyal
// gücünden sıcak-soğuk göstergesi ve yaklaştıkça sıklaşan bip sesi. Duyulan işaretin
// bilgisini 112'ye ya da birine SMS ile iletir. Ayrıntı: docs/ENKAZ.md
import { useEffect, useRef, useState } from 'preact/hooks';
import { go } from '../../lib/store';
import { KAYNAK_CSS } from '../_kaynak/ui';
import { nativeEnkaz, type Duyulan } from '../../lib/enkaz/native';
import { SinyalIzi, duyulanSms, katYazi, mesafeTahmini, sureOnce, yakinlik, yakinlikYazi, type Egilim } from '../../lib/enkaz/enkaz';
import { isIOS, smsHref } from '../../iletisim/sms';
import { quickPosition } from '../../iletisim/common';

const CSS = `
.ea-meter { display: flex; flex-direction: column; gap: 10px; align-items: stretch; border-color: var(--accent); }
.ea-big { font-size: 30px; font-weight: 700; line-height: 1.1; }
.ea-bar { height: 22px; border-radius: 11px; background: var(--line2); overflow: hidden; }
.ea-bar > div { height: 100%; border-radius: 11px; transition: width 0.4s, background 0.4s; }
.ea-egilim { font-size: 18px; font-weight: 600; }
.ea-egilim.yaklasiyor { color: var(--ok); }
.ea-egilim.uzaklasiyor { color: var(--danger); }
.ea-list { display: flex; flex-direction: column; gap: 6px; }
.ea-item { display: flex; gap: 10px; align-items: center; min-height: 60px; padding: 8px 12px; border-radius: 12px; border: 1px solid var(--line2); background: var(--bg2); color: var(--text); text-align: left; width: 100%; }
.ea-item[aria-pressed='true'] { border-color: var(--accent); background: var(--accent-soft); }
.ea-item .t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ea-item .t b { font-size: 15px; }
.ea-item .t small { font-size: 12.5px; color: var(--muted); overflow-wrap: anywhere; }
.ea-sig { width: 46px; flex: none; display: flex; gap: 2px; align-items: flex-end; height: 22px; }
.ea-sig i { flex: 1; background: var(--line3); border-radius: 2px; }
.ea-sig i.on { background: var(--accent); }
.ea-kv { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin: 0; font-size: 14px; }
.ea-kv dt { color: var(--muted); }
.ea-kv dd { margin: 0; overflow-wrap: anywhere; }
.ea-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.ea-btns > * { flex: 1 1 140px; display: flex; align-items: center; justify-content: center; text-decoration: none; }
`;

const EGILIM_YAZI: Record<Egilim, string> = {
  yaklasiyor: '↑ Yaklaşıyorsunuz',
  uzaklasiyor: '↓ Uzaklaşıyorsunuz',
  sabit: '→ Sinyal sabit',
  bilinmiyor: 'Biraz bekleyin…',
};

function renk(x: number) {
  return x > 0.7 ? 'var(--ok)' : x > 0.4 ? 'var(--accent)' : 'var(--danger)';
}

function Cubuk({ rssi }: { rssi: number }) {
  const n = Math.round(yakinlik(rssi) * 4);
  return (
    <span class="ea-sig" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <i key={i} class={i <= n ? 'on' : ''} style={{ height: `${i * 25}%` }} />
      ))}
    </span>
  );
}

/** Yaklaştıkça sıklaşan bip (eller doluyken ekrana bakmadan) */
function useBip(acik: boolean, yakin: number | null) {
  const ref = useRef<{ ctx: AudioContext | null; t: ReturnType<typeof setTimeout> | null; yakin: number | null }>({ ctx: null, t: null, yakin: null });
  ref.current.yakin = yakin;
  useEffect(() => {
    if (!acik) return;
    const r = ref.current;
    try {
      const C = (window as any).AudioContext || (window as any).webkitAudioContext;
      r.ctx ??= C ? new C() : null;
      void r.ctx?.resume?.();
    } catch {}
    let alive = true;
    const bip = () => {
      if (!alive) return;
      const y = r.yakin;
      if (y != null && r.ctx) {
        const o = r.ctx.createOscillator();
        const g = r.ctx.createGain();
        o.frequency.value = 600 + y * 900;
        g.gain.setValueAtTime(0.25, r.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, r.ctx.currentTime + 0.08);
        o.connect(g).connect(r.ctx.destination);
        o.start();
        o.stop(r.ctx.currentTime + 0.09);
      }
      // Uzakta 1,5 sn, dibinde 0,12 sn
      r.t = setTimeout(bip, y == null ? 1000 : 1500 - y * 1380);
    };
    bip();
    return () => {
      alive = false;
      if (r.t) clearTimeout(r.t);
    };
  }, [acik]);
}

export default function EnkazArama() {
  const yerel = nativeEnkaz.available();
  const [durum, setDurum] = useState<'bekliyor' | 'tariyor' | 'hata'>('bekliyor');
  const [hata, setHata] = useState('');
  const [canli, setCanli] = useState<Map<number, Duyulan>>(new Map());
  const [gecmis, setGecmis] = useState<Duyulan[]>([]);
  const [secili, setSecili] = useState<number | null>(null);
  const [bip, setBip] = useState(false);
  const [, tik] = useState(0);
  const izler = useRef(new Map<number, SinyalIzi>());
  const [ben, setBen] = useState<{ lat: number; lon: number } | null>(null);

  const baslat = async () => {
    const r = await nativeEnkaz.aramaBaslat();
    if (r?.basladi) {
      setDurum('tariyor');
      setHata('');
    } else {
      setDurum('hata');
      setHata(
        r?.hata === 'bluetooth-kapali'
          ? "Bluetooth kapalı. Açıp yeniden deneyin."
          : r?.hata === 'izin-yok'
            ? 'Bluetooth ve konum izni gerekli (işaretleri duymak için Android bu izinleri ister).'
            : 'Tarama başlatılamadı.',
      );
    }
  };

  useEffect(() => {
    if (!yerel) return;
    nativeEnkaz.duyulanlar().then(setGecmis);
    const off = nativeEnkaz.onDuyuldu((d) => {
      const t = Date.now();
      let iz = izler.current.get(d.kimlik);
      if (!iz) izler.current.set(d.kimlik, (iz = new SinyalIzi()));
      iz.ekle(d.rssi, t);
      setCanli((m) => new Map(m).set(d.kimlik, { ...d, zaman: t }));
      setSecili((s) => s ?? d.kimlik);
    });
    void baslat();
    quickPosition(10000).then((p) => p && setBen({ lat: p.lat, lon: p.lon }));
    const tk = setInterval(() => tik((n) => n + 1), 1000);
    return () => {
      off();
      clearInterval(tk);
      void nativeEnkaz.aramaDurdur();
    };
  }, []);

  const simdi = Date.now();
  // 10 sn'dir duyulmayan işaret "kayıp" sayılır
  const liste = [...canli.values()].sort((a, b) => b.rssi - a.rssi);
  const sec = secili != null ? canli.get(secili) : undefined;
  const iz = secili != null ? izler.current.get(secili) : undefined;
  const taze = sec && simdi - (sec.zaman ?? 0) < 10000;
  const ort = iz?.ort ?? null;
  const yk = ort != null && taze ? yakinlik(ort) : null;
  useBip(bip, yk);

  if (!yerel)
    return (
      <div class="kn" data-testid="enkaz-arama">
        <style>{KAYNAK_CSS + CSS}</style>
        <section class="card kn-form">
          <p class="kn-sub">
            Enkaz işaretlerini duymak için Android uygulaması gerekir (tarayıcılar Bluetooth işaretlerini dinleyemez). Uygulaması olmayan bir telefonla da Bluetooth ayarlarında "ENKAZ" adlı cihazları arayabilirsiniz.
          </p>
          <button class="btn" onClick={() => go.tool('enkaz')}>
            Enkaz modu
          </button>
        </section>
      </div>
    );

  return (
    <div class="kn" data-testid="enkaz-arama">
      <style>{KAYNAK_CSS + CSS}</style>
      {durum === 'hata' && (
        <section class="card kn-form">
          <p class="kn-sub" style="color:var(--danger)" data-testid="ea-hata">
            {hata}
          </p>
          <button class="btn primary" onClick={baslat}>
            Yeniden dene
          </button>
        </section>
      )}
      {durum !== 'hata' && !liste.length && (
        <section class="card kn-form" data-testid="ea-bos">
          <b>İşaret aranıyor…</b>
          <p class="kn-sub">
            Enkaz modundaki telefonlar Bluetooth işareti yayar. Enkaz çevresinde yavaşça dolaşın; telefonu yere yakın ve boşluklara doğru tutun. Beton sinyali çok zayıflatır, menzil birkaç metreye inebilir.
          </p>
        </section>
      )}
      {sec && (
        <section class="card ea-meter" data-testid="ea-gosterge" aria-live="polite">
          <div class="row">
            <b class="grow" style="font-size:16px">{sec.etiket || `İşaret #${(sec.kimlik >>> 0).toString(16).slice(-4)}`}</b>
            <span class="tag">{taze ? 'duyuluyor' : 'kayboldu'}</span>
          </div>
          <div class="ea-big" data-testid="ea-yakinlik">
            {ort != null ? yakinlikYazi(ort) : '…'}
          </div>
          <div class="ea-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((yk ?? 0) * 100)} aria-label="Yakınlık">
            <div style={{ width: `${Math.round((yk ?? 0) * 100)}%`, background: renk(yk ?? 0) }} />
          </div>
          <div class={'ea-egilim ' + (iz?.egilim(simdi) ?? '')} data-testid="ea-egilim">
            {taze ? EGILIM_YAZI[iz?.egilim(simdi) ?? 'bilinmiyor'] : 'Sinyal kayboldu; son duyulduğu yere dönün.'}
          </div>
          <p class="kn-sub">
            Kabaca {ort != null ? `${Math.round(mesafeTahmini(ort, sec.guc))} m` : '?'} (beton ve moloz bunu büyük ölçüde değiştirir; yönü yaklaşma/uzaklaşmadan bulun). Sinyal {ort != null ? Math.round(ort) : '?'} dBm.
          </p>
          <dl class="ea-kv">
            {sec.kat != null && (
              <>
                <dt>Kat</dt>
                <dd>{katYazi(sec.kat)}</dd>
              </>
            )}
            {sec.pil >= 0 && (
              <>
                <dt>Pili</dt>
                <dd>%{sec.pil}</dd>
              </>
            )}
            {sec.lat != null && sec.lon != null && (
              <>
                <dt>Son konumu</dt>
                <dd class="mono">
                  {sec.lat.toFixed(5)}, {sec.lon.toFixed(5)}
                  {sec.yasDk >= 0 ? ` (${sureOnce(sec.yasDk * 60000)})` : ''}
                </dd>
              </>
            )}
            {sec.otomatik && (
              <>
                <dt>Not</dt>
                <dd>Sarsıntıdan sonra kendiliğinden açılmış; kişi yanıt vermemiş olabilir.</dd>
              </>
            )}
          </dl>
          <div class="ea-btns">
            <button class="btn" aria-pressed={bip} data-testid="ea-bip" onClick={() => setBip(!bip)}>
              {bip ? 'Bipi kapat' : 'Sesli ipucu (bip)'}
            </button>
            <a class="btn primary" data-testid="ea-sms" href={smsHref('112', duyulanSms(sec, ben), isIOS())}>
              112'ye SMS ile bildir
            </a>
            <a class="btn" href="tel:112">
              112'yi ara
            </a>
          </div>
        </section>
      )}
      {liste.length > 1 && (
        <section class="kn-group">
          <h2>Duyulan işaretler ({liste.length})</h2>
          <div class="ea-list">
            {liste.map((d) => (
              <button key={d.kimlik} class="ea-item" aria-pressed={d.kimlik === secili} data-testid="ea-item" onClick={() => setSecili(d.kimlik)}>
                <Cubuk rssi={izler.current.get(d.kimlik)?.ort ?? d.rssi} />
                <span class="t">
                  <b>{d.etiket || `İşaret #${(d.kimlik >>> 0).toString(16).slice(-4)}`}</b>
                  <small>
                    {yakinlikYazi(izler.current.get(d.kimlik)?.ort ?? d.rssi)} · {sureOnce(simdi - (d.zaman ?? simdi))}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      {gecmis.length > 0 && (
        <section class="kn-group" data-testid="ea-gecmis">
          <h2>
            Son 72 saatte duyulanlar
            <button
              class="link-btn"
              onClick={async () => {
                await nativeEnkaz.duyulanlariTemizle();
                setGecmis([]);
              }}
            >
              Temizle
            </button>
          </h2>
          <div class="ea-list">
            {gecmis.map((d) => (
              <div key={d.kimlik} class="ea-item">
                <span class="t">
                  <b>{d.etiket || `İşaret #${(d.kimlik >>> 0).toString(16).slice(-4)}`}</b>
                  <small>
                    Son duyuluş {sureOnce(simdi - (d.son ?? simdi))} · {d.sayi ?? 1} kez
                    {d.duyulanYer ? ` · duyulduğu yer ${d.duyulanYer.lat.toFixed(4)}, ${d.duyulanYer.lon.toFixed(4)}` : ''}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      <p class="kn-sub">
        Uygulaması olmayan kurtarıcılar telefonlarının Bluetooth ayarlarında "ENKAZ" adlı cihazları görebilir (enkazdaki kişi görünürlüğü açtıysa).
      </p>
    </div>
  );
}
