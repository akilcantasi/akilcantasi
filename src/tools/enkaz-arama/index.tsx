// Enkaz arama (kurtarıcı): yakındaki enkaz işaretlerini duyar; seçilen işaret için sinyal
// gücünden sıcak-soğuk göstergesi ve yaklaştıkça sıklaşan bip sesi. Duyulan işaretin
// bilgisini 112'ye ya da birine SMS ile iletir. Ayrıntı: docs/ENKAZ.md
import { useEffect, useRef, useState } from 'preact/hooks';
import { go } from '../../lib/store';
import { KAYNAK_CSS } from '../_kaynak/ui';
import { nativeEnkaz, type Duyulan } from '../../lib/enkaz/native';
import {
  SinyalIzi,
  duyulanSms,
  hedefMi,
  isaretKodu,
  katYazi,
  mesafeTahmini,
  smsCoz,
  sureOnce,
  yakinlik,
  yakinlikYazi,
  type AramaHedefi,
  type Egilim,
} from '../../lib/enkaz/enkaz';
import { ACIL_YANIT, MESAJLAR, YANITLAR } from '../../lib/enkaz/mesajlar';
import { bearingDeg, compassLong, distanceM, formatDistance } from '../../lib/map/geo';
import { setNavTarget } from '../../lib/map/nav';
import { isIOS, smsHref } from '../../iletisim/sms';
import { quickPosition } from '../../iletisim/common';

const CSS = `
.ea-meter { display: flex; flex-direction: column; gap: 10px; align-items: stretch; border-color: var(--accent); }
.ea-big { font-size: 30px; font-weight: 700; line-height: 1.1; }
.ea-bar { height: 22px; border-radius: 11px; background: var(--line2); overflow: hidden; }
.ea-bar > div { height: 100%; border-radius: 11px; transition: width 0.4s, background 0.4s; }
.ea-egilim { font-size: 18px; font-weight: 600; }
.ea-egilim.yaklasiyor { color: var(--ok); }
/* Uzaklaşmak tehlike değil, yön bilgisi: kehribar */
.ea-egilim.uzaklasiyor { color: var(--accent2); }
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
.ea-btns > * { flex: 1 1 140px; display: flex; align-items: center; justify-content: center; text-align: center; line-height: 1.25; padding: 6px 12px; text-decoration: none; }
.ea-hedef { display: flex; flex-direction: column; gap: 8px; border-color: var(--blue); }
.ea-hedef textarea { min-height: 84px; resize: vertical; }
.ea-aranan { display: inline-block; font-size: 12px; font-weight: 600; color: #04210f; background: var(--ok); border-radius: 999px; padding: 2px 8px; }
.ea-yanit { border-radius: 12px; padding: 10px 12px; background: var(--bg2); border: 1px solid var(--line3); font-size: 15px; }
.ea-yanit.acil { border-color: var(--danger); color: var(--danger); font-weight: 600; }
.ea-msjlar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.ea-msjlar button { min-height: 48px; border-radius: 12px; border: 1px solid var(--line3); background: var(--bg2); color: var(--text); font-size: 13px; padding: 6px 8px; line-height: 1.25; text-align: left; }
.ea-msjlar button[aria-pressed='true'] { border-color: var(--accent); background: var(--accent-soft); }
.ea-durum { font-size: 13px; margin: 0; }
.ea-blok { display: flex; flex-direction: column; gap: 8px; }
.ea-bildir { border-top: 1px solid var(--line2); padding-top: 12px; }
.ea-durum.ok { color: var(--ok); font-weight: 600; }
`;

const HEDEF_KEY = 'ac.enkaz.hedef';

function hedefOku(): AramaHedefi | null {
  try {
    const o = JSON.parse(localStorage.getItem(HEDEF_KEY) || 'null');
    if (!o || typeof o !== 'object') return null;
    // Kayıt bozulmuşsa ekran çökmesin: alanlar tek tek, türüne göre alınır
    const yazi = (v: unknown, n: number) => (typeof v === 'string' && v ? v.slice(0, n) : undefined);
    const enlem = Number.isFinite(o.lat) && Math.abs(o.lat) <= 90 ? (o.lat as number) : undefined;
    const boylam = Number.isFinite(o.lon) && Math.abs(o.lon) <= 180 ? (o.lon as number) : undefined;
    const h: AramaHedefi = {
      kod: typeof o.kod === 'string' && /^AK-[0-9A-F]{6}$/.test(o.kod) ? o.kod : undefined,
      lat: enlem !== undefined && boylam !== undefined ? enlem : undefined,
      lon: enlem !== undefined && boylam !== undefined ? boylam : undefined,
      ad: yazi(o.ad, 60),
      bina: yazi(o.bina, 200),
      yas: yazi(o.yas, 40),
      zaman: Number.isFinite(o.zaman) ? o.zaman : Date.now(),
    };
    return h.kod || h.lat !== undefined ? h : null;
  } catch {
    return null;
  }
}

function hedefYaz(h: AramaHedefi | null) {
  try {
    if (h) localStorage.setItem(HEDEF_KEY, JSON.stringify(h));
    else localStorage.removeItem(HEDEF_KEY);
  } catch {}
}

/** Aranan kişi: enkazdan gelen SMS'i yapıştırınca kod, konum ve bina çıkarılır */
function Hedef({ h, setH, ben, duyuluyor }: { h: AramaHedefi | null; setH: (h: AramaHedefi | null) => void; ben: { lat: number; lon: number } | null; duyuluyor: boolean }) {
  const [metin, setMetin] = useState('');
  const [hata, setHata] = useState('');
  const [acik, setAcik] = useState(false);
  if (!h)
    return acik ? (
      <section class="card ea-hedef" data-testid="ea-hedef-form">
        <b>Aranan kişi</b>
        <p class="kn-sub">Enkazdaki kişiden gelen SMS'i ya da işaret kodunu (ör. AK-34ABCD) yapıştırın. Kod, konum ve bina bilgisi kendiliğinden okunur.</p>
        <textarea class="input" value={metin} data-testid="ea-hedef-metin" onInput={(e) => setMetin((e.target as HTMLTextAreaElement).value)} placeholder="ENKAZ ALTINDAYIM. … İşaret kodu: AK-…" />
        {hata && <p class="kn-sub" style="color:var(--danger)">{hata}</p>}
        <div class="ea-btns">
          <button
            class="btn primary"
            data-testid="ea-hedef-ekle"
            onClick={() => {
              const x = smsCoz(metin);
              if (!x) return setHata('Bu metinde işaret kodu ya da koordinat bulunamadı.');
              setH(x);
              setMetin('');
              setHata('');
            }}
          >
            Ekle
          </button>
          <button class="btn" onClick={() => setAcik(false)}>
            Vazgeç
          </button>
        </div>
      </section>
    ) : (
      <button class="btn" data-testid="ea-hedef-ac" onClick={() => setAcik(true)}>
        Belirli birini mi arıyorsunuz? SMS'ini yapıştırın
      </button>
    );
  const konumVar = h.lat != null && h.lon != null;
  const uzak = konumVar && ben ? distanceM(ben, { lat: h.lat!, lon: h.lon! }) : null;
  return (
    <section class="card ea-hedef" data-testid="ea-hedef">
      <div class="row">
        <b class="grow">Aranan kişi{h.ad ? `: ${h.ad}` : ''}</b>
        {duyuluyor && <span class="ea-aranan">işareti duyuluyor</span>}
      </div>
      <dl class="ea-kv">
        {h.kod && (
          <>
            <dt>İşaret kodu</dt>
            <dd class="mono">{h.kod}</dd>
          </>
        )}
        {h.bina && (
          <>
            <dt>Bina</dt>
            <dd>{h.bina}</dd>
          </>
        )}
        {konumVar && (
          <>
            <dt>Son konumu</dt>
            <dd class="mono">
              {h.lat!.toFixed(5)}, {h.lon!.toFixed(5)}
              {h.yas ? ` (${h.yas}, SMS'teki haliyle)` : ''}
            </dd>
          </>
        )}
        {uzak != null && (
          <>
            <dt>Size göre</dt>
            <dd data-testid="ea-hedef-uzaklik">
              {formatDistance(uzak)} · {compassLong(bearingDeg(ben!, { lat: h.lat!, lon: h.lon! }))} yönünde
            </dd>
          </>
        )}
      </dl>
      <p class="kn-sub">{duyuluyor ? 'İşareti duyuluyor: aşağıdaki göstergeyle yaklaşın.' : konumVar ? 'Önce haritayla bu noktaya gidin; yaklaşınca işareti burada duyulur ve kendiliğinden seçilir.' : 'İşareti duyulunca kendiliğinden seçilir.'}</p>
      <div class="ea-btns">
        {konumVar && (
          <button
            class="btn primary"
            data-testid="ea-hedef-harita"
            onClick={() => {
              setNavTarget({ kind: 'coord', name: `Enkaz${h.ad ? ' · ' + h.ad : ''}${h.kod ? ' · ' + h.kod : ''}`, lat: h.lat!, lon: h.lon! });
              go.tab('harita');
            }}
          >
            Haritada yön göster
          </button>
        )}
        <button class="btn" data-testid="ea-hedef-sil" onClick={() => setH(null)}>
          Kaldır
        </button>
      </div>
    </section>
  );
}

/** Seçili işarete hazır mesaj gönderir; ulaştığını işaretteki onaydan anlar */
function MesajGonder({ d, gonderilen, gonder }: { d: Duyulan; gonderilen: { no: number; kod: number; zaman: number } | null; gonder: (kod: number) => void }) {
  const simdi = Date.now();
  const ulasti = !!gonderilen && d.onay === gonderilen.no;
  const suruyor = !!gonderilen && !ulasti && simdi - gonderilen.zaman < 3 * 60000;
  return (
    <div class="ea-blok" data-testid="ea-mesaj">
      <b style="font-size:15px">Enkazdaki telefona mesaj</b>
      <p class="kn-sub">Bluetooth ile, şebekesiz. Dokunduğunuz mesaj o telefonda yazılır ve sesli okunur.</p>
      <div class="ea-msjlar" role="group" aria-label="Enkazdaki telefona hazır mesajlar">
        {MESAJLAR.map((t, i) =>
          i === 0 ? null : (
            <button key={i} aria-pressed={gonderilen?.kod === i} data-testid={'ea-msj-' + i} onClick={() => gonder(i)}>
              {t}
            </button>
          ),
        )}
      </div>
      {gonderilen && (
        <p class={'ea-durum' + (ulasti ? ' ok' : '')} data-testid="ea-msj-durum">
          {ulasti
            ? `✓ Ulaştı: "${MESAJLAR[gonderilen.kod]}" (telefonu titredi ve sesli okudu)`
            : suruyor
              ? `Gönderiliyor: "${MESAJLAR[gonderilen.kod]}"… 3 dakika boyunca yayılır.`
              : 'Ulaştığı görülmedi. Daha yaklaşıp yeniden gönderin.'}
        </p>
      )}
    </div>
  );
}

const EGILIM_YAZI: Record<Egilim, string> = {
  yaklasiyor: '↑ Yaklaşıyorsunuz',
  uzaklasiyor: '↓ Uzaklaşıyorsunuz',
  sabit: '→ Sinyal sabit',
  bilinmiyor: 'Biraz bekleyin…',
};

/** Yakınlık çubuğu: uzakta soluk kehribar, yaklaştıkça kehribar, dibinde yeşil (kırmızı yok) */
function renk(x: number) {
  return x > 0.7 ? 'var(--ok)' : x > 0.4 ? 'var(--accent)' : 'rgba(245,165,36,0.55)';
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
  const [hedef, setHedefS] = useState<AramaHedefi | null>(() => hedefOku());
  const setHedef = (h: AramaHedefi | null) => {
    setHedefS(h);
    hedefYaz(h);
  };
  const hedefRef = useRef(hedef);
  hedefRef.current = hedef;
  /** kimlik → son gönderilen mesaj */
  const [gonderilen, setGonderilen] = useState<Map<number, { no: number; kod: number; zaman: number }>>(new Map());
  const [msjHata, setMsjHata] = useState('');
  const [gecmisSil, setGecmisSil] = useState(false);

  const [hataTur, setHataTur] = useState('');
  const baslat = async () => {
    const r = await nativeEnkaz.aramaBaslat();
    if (r?.basladi) {
      setDurum('tariyor');
      setHata('');
      setHataTur('');
    } else {
      setDurum('hata');
      setHataTur(r?.hata ?? '');
      setHata(
        r?.hata === 'bluetooth-kapali'
          ? 'Bluetooth kapalı. Açınca tarama kendiliğinden başlar.'
          : r?.hata === 'izin-yok'
            ? 'Bluetooth ve konum izni gerekli (işaretleri duymak için Android bu izinleri ister).'
            : 'Tarama başlatılamadı.',
      );
    }
  };
  /** Hata düğmesi: önce engeli kaldırmayı dener (Bluetooth'u aç / izin iste), sonra yeniden başlatır */
  const coz = async () => {
    if (hataTur === 'bluetooth-kapali') await nativeEnkaz.bluetoothAc();
    else if (hataTur === 'izin-yok') await nativeEnkaz.izinIste();
    await baslat();
  };
  // Ayarlardan (izin, Bluetooth) dönünce uygulamayı yeniden açmaya gerek kalmasın
  const durumRef = useRef(durum);
  durumRef.current = durum;
  const hataTurRef = useRef(hataTur);
  hataTurRef.current = hataTur;
  useEffect(() => {
    if (!yerel) return;
    const vis = async () => {
      if (document.visibilityState !== 'visible' || durumRef.current !== 'hata') return;
      // İzin eksikken aramaBaslat izin penceresi açar: yalnız izin ayarlardan verildiyse yeniden dene
      if (hataTurRef.current === 'izin-yok') {
        const iz = (await nativeEnkaz.durum())?.izinler;
        if (!iz?.bluetooth || iz.konum === 'yok') return;
      }
      void baslat();
    };
    document.addEventListener('visibilitychange', vis);
    // Bluetooth açılırsa (bildirim panelinden) tarama birkaç saniye içinde kendiliğinden başlasın
    const t = setInterval(() => durumRef.current === 'hata' && hataTurRef.current === 'bluetooth-kapali' && void baslat(), 4000);
    return () => {
      document.removeEventListener('visibilitychange', vis);
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (!yerel) return;
    nativeEnkaz.duyulanlar().then(setGecmis);
    const off = nativeEnkaz.onDuyuldu((d) => {
      const t = Date.now();
      let iz = izler.current.get(d.kimlik);
      if (!iz) izler.current.set(d.kimlik, (iz = new SinyalIzi()));
      iz.ekle(d.rssi, t);
      setCanli((m) => new Map(m).set(d.kimlik, { ...d, zaman: t }));
      // Aranan kişinin işareti duyulunca kendiliğinden seçilir
      setSecili((s) => (hedefMi(hedefRef.current, d.kimlik) ? d.kimlik : (s ?? d.kimlik)));
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
  // Aranan kişi en üstte, sonra sinyal gücüne göre
  const liste = [...canli.values()].sort((a, b) => Number(hedefMi(hedef, b.kimlik)) - Number(hedefMi(hedef, a.kimlik)) || b.rssi - a.rssi);
  const hedefDuyuluyor = liste.some((d) => hedefMi(hedef, d.kimlik) && simdi - (d.zaman ?? 0) < 10000);
  const gonder = async (kimlik: number, kod: number) => {
    setMsjHata('');
    const r = await nativeEnkaz.mesajGonder(kimlik, kod);
    if (r?.no) setGonderilen((m) => new Map(m).set(kimlik, { no: r.no!, kod, zaman: Date.now() }));
    else setMsjHata(r?.hata === 'bluetooth-kapali' ? "Bluetooth kapalı." : r?.hata === 'izin-yok' ? 'Bluetooth izni gerekli.' : 'Gönderilemedi.');
  };
  const sec = secili != null ? canli.get(secili) : undefined;
  const iz = secili != null ? izler.current.get(secili) : undefined;
  const taze = sec && simdi - (sec.zaman ?? 0) < 10000;
  const ort = iz?.ort ?? null;
  const yk = ort != null && taze ? yakinlik(ort) : null;
  useBip(bip, yk);
  const bildirim = sec ? duyulanSms({ ...sec, kod: isaretKodu(sec.kimlik) }, ben, (sec.yanit ?? 0) > 0 ? YANITLAR[sec.yanit!] : '') : '';

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
          <button class="btn primary" data-testid="ea-coz" onClick={coz}>
            {hataTur === 'bluetooth-kapali' ? "Bluetooth'u aç" : hataTur === 'izin-yok' ? 'İzin ver' : 'Yeniden dene'}
          </button>
        </section>
      )}
      <Hedef h={hedef} setH={setHedef} ben={ben} duyuluyor={hedefDuyuluyor} />
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
            <b class="grow" style="font-size:16px">{sec.etiket || isaretKodu(sec.kimlik)}</b>
            {hedefMi(hedef, sec.kimlik) && <span class="ea-aranan">Aranan kişi</span>}
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
          {(sec.yanit ?? 0) > 0 && (
            <div class={'ea-yanit' + (ACIL_YANIT.has(sec.yanit!) ? ' acil' : '')} data-testid="ea-yanit">
              Enkazdaki kişinin yanıtı: <b>{YANITLAR[sec.yanit!] ?? '?'}</b>
            </div>
          )}
          <dl class="ea-kv">
            <dt>İşaret kodu</dt>
            <dd class="mono">{isaretKodu(sec.kimlik)}</dd>
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
          <button class="btn" aria-pressed={bip} data-testid="ea-bip" onClick={() => setBip(!bip)}>
            {bip ? 'Bipi kapat' : 'Yaklaştıkça sıklaşan bip sesi'}
          </button>
          <MesajGonder d={sec} gonderilen={gonderilen.get(sec.kimlik) ?? null} gonder={(k) => gonder(sec.kimlik, k)} />
          {msjHata && (
            <p class="ea-durum" style="color:var(--danger)" data-testid="ea-msj-hata">
              {msjHata}
            </p>
          )}
          {/* Şebeke üzerinden bildirme: enkazdaki telefona değil, 112'ye ya da bir yakına gider */}
          <div class="ea-blok ea-bildir" data-testid="ea-bildir">
            <b style="font-size:15px">Bu işareti bildirin (şebeke gerekir)</b>
            <p class="kn-sub">SMS'e işaret kodu, kat, son konum ve kişinin yanıtı eklenir.</p>
            <div class="ea-btns">
              <a class="btn primary" data-testid="ea-sms" href={smsHref('112', bildirim, isIOS())}>
                112'ye SMS gönder
              </a>
              <a class="btn" data-testid="ea-ara" href="tel:112">
                112'yi telefonla ara
              </a>
              <a class="btn" data-testid="ea-sms-baska" href={smsHref('', bildirim, isIOS())}>
                Başka numaraya SMS
              </a>
            </div>
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
                  <b>{d.etiket || isaretKodu(d.kimlik)}</b>
                  <small>
                    {hedefMi(hedef, d.kimlik) ? 'Aranan kişi · ' : ''}
                    {yakinlikYazi(izler.current.get(d.kimlik)?.ort ?? d.rssi)} · {sureOnce(simdi - (d.zaman ?? simdi))}
                    {(d.yanit ?? 0) > 0 ? ` · "${YANITLAR[d.yanit!]}"` : ''}
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
            {/* Kurtarma kaydı: tek dokunuşla silinmesin, satır içi onay */}
            {gecmisSil ? (
              <span class="kn-confirm" style="font-weight:500">
                <button
                  class="btn"
                  data-testid="ea-gecmis-sil-evet"
                  onClick={async () => {
                    await nativeEnkaz.duyulanlariTemizle();
                    setGecmis([]);
                    setGecmisSil(false);
                  }}
                >
                  Sil
                </button>
                <button class="btn" data-testid="ea-gecmis-sil-hayir" onClick={() => setGecmisSil(false)}>
                  Vazgeç
                </button>
              </span>
            ) : (
              <button class="link-btn" style="color:var(--accent2)" data-testid="ea-gecmis-sil" onClick={() => setGecmisSil(true)}>
                Temizle
              </button>
            )}
          </h2>
          <div class="ea-list">
            {gecmis.map((d) => (
              <div key={d.kimlik} class="ea-item">
                <span class="t">
                  <b>{d.etiket || isaretKodu(d.kimlik)}</b>
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
