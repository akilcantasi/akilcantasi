// Enkaz modu: enkaz altında kalan telefon kendini bulunur kılar (Bluetooth işareti, SOS ses
// ve ışık, aralıklı GPS, SMS). Altta hazırlık: bina bilgisi, arka planda son konum kaydı,
// yakındaki işaretleri dinleme ve sarsıntı sorusu (hepsi isteğe bağlı, varsayılan kapalı).
// Ayrıntı: docs/ENKAZ.md
import { useEffect, useRef, useState } from 'preact/hooks';
import { go } from '../../lib/store';
import { nativeSms } from '../../lib/native';
import { KAYNAK_CSS } from '../_kaynak/ui';
import { nativeEnkaz, type EnkazDurum, type KayitliKonum, type KonumKaydiModu } from '../../lib/enkaz/native';
import { ACIL_YANIT, MESAJLAR, YANITLAR } from '../../lib/enkaz/mesajlar';
import {
  MAX_BINA,
  binaYeri,
  enYakinBina,
  enkazSms,
  isaretEtiketi,
  loadBinalar,
  saveBinalar,
  sonKonumlarWeb,
  sonKonumlarWebTemizle,
  sure,
  sureOnce,
  type Bina,
} from '../../lib/enkaz/enkaz';
import { quickPosition, useProfile } from '../../iletisim/common';
import { GidenKutusu, useYakinlar } from '../../iletisim/HizliSms';
import { multiSmsHref } from '../../iletisim/yakinlar';
import { isIOS } from '../../iletisim/sms';

const CSS = `
.ek-start { width: 100%; min-height: 96px; border: 0; border-radius: 22px; padding: 14px 18px; color: #fff; background: linear-gradient(160deg, #d44046, var(--sos)); box-shadow: 0 10px 26px rgba(229,72,77,0.35); display: flex; flex-direction: column; align-items: flex-start; gap: 4px; text-align: left; }
.ek-start b { font-size: 20px; line-height: 1.2; }
.ek-start span { font-size: 13px; opacity: 0.95; line-height: 1.35; }
.ek-live { border-color: var(--sos); display: flex; flex-direction: column; gap: 12px; }
.ek-live-h { display: flex; align-items: center; gap: 10px; }
.ek-dot { width: 14px; height: 14px; border-radius: 50%; background: var(--sos); box-shadow: 0 0 0 0 rgba(229,72,77,0.6); animation: ek-nabiz 1.6s infinite; flex: none; }
@keyframes ek-nabiz { 70% { box-shadow: 0 0 0 12px rgba(229,72,77,0); } 100% { box-shadow: 0 0 0 0 rgba(229,72,77,0); } }
html.reduce-motion .ek-dot { animation: none; }
.ek-row { display: flex; gap: 10px; align-items: flex-start; padding: 10px 0; border-top: 1px solid var(--line2); }
.ek-row:first-of-type { border-top: 0; }
.ek-ic { width: 22px; height: 22px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 12px; font-weight: 700; margin-top: 1px; }
.ek-ic.ok { background: var(--ok); color: #06231a; }
.ek-ic.bad { background: var(--danger); color: #2a0703; }
.ek-ic.wait { border: 1.5px solid var(--line3); }
.ek-row .t { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.ek-row .t b { font-size: 15px; font-weight: 600; }
.ek-row .t span { font-size: 13px; color: var(--muted); line-height: 1.4; overflow-wrap: anywhere; }
.ek-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.ek-btns .btn { flex: 1 1 140px; }
/* Kapatma tehlikeli bir eylem değil: kırmızı değil, sakin çerçeve; basılı tutarken kehribar dolar */
.ek-hold { position: relative; overflow: hidden; width: 100%; min-height: 52px; border-radius: 14px; border: 1px solid var(--line3); background: var(--glass); color: var(--text2); font-weight: 600; font-size: 14px; padding: 6px 12px; }
.ek-hold i { position: absolute; inset: 0; width: 0; background: var(--accent-soft); box-shadow: inset -2px 0 var(--accent); }
.ek-hold span { position: relative; }
.ek-tips { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; line-height: 1.45; color: var(--text2); }
.ek-pick { display: flex; flex-direction: column; gap: 6px; }
.ek-opt { display: flex; gap: 10px; align-items: center; min-height: 52px; padding: 8px 12px; border-radius: 12px; border: 1px solid var(--line2); background: var(--bg2); cursor: pointer; }
.ek-opt input { width: 22px; height: 22px; accent-color: var(--accent); flex: none; margin: 0; }
.ek-opt .t { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ek-opt .t b { font-size: 15px; font-weight: 500; }
.ek-opt .t small { font-size: 12.5px; color: var(--muted); overflow-wrap: anywhere; }
.ek-b { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--line2); background: var(--bg2); }
.ek-b .t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ek-b .t b { font-size: 15px; }
.ek-b .t small { font-size: 12.5px; color: var(--muted); overflow-wrap: anywhere; }
.ek-seg { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.ek-seg button { min-height: 52px; border-radius: 12px; border: 1px solid var(--line3); background: var(--bg2); color: var(--text); font-size: 13px; padding: 4px; line-height: 1.25; }
.ek-seg button[aria-pressed='true'] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); font-weight: 600; }
.ek-sw { width: 100%; min-height: 56px; display: flex; align-items: center; gap: 12px; text-align: left; background: transparent; border: none; color: var(--text); padding: 6px 0; }
.ek-sw .t { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.ek-sw .t b { font-size: 15px; font-weight: 600; }
.ek-sw .t span { font-size: 12.5px; color: var(--muted); line-height: 1.4; }
.ek-track { width: 52px; height: 30px; border-radius: 999px; border: 1px solid var(--line3); background: var(--line2); position: relative; flex-shrink: 0; }
.ek-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: var(--muted); transition: transform 0.15s; }
.ek-sw[aria-checked='true'] .ek-track { background: var(--accent); border-color: var(--accent); }
.ek-sw[aria-checked='true'] .ek-track::after { transform: translateX(22px); background: #0b0e13; }
.ek-msg { margin: 0; font-size: 13px; line-height: 1.45; color: var(--text2); }
.ek-msg.bad { color: var(--danger); }
.ek-kayit { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.ek-kayit li { display: flex; justify-content: space-between; gap: 8px; color: var(--text2); }
.ek-kayit .mono { font-size: 12.5px; }
.ek-kod { font-size: 13px; color: var(--text2); margin: 0; }
.ek-kod b { font-family: var(--code); letter-spacing: 0.04em; color: var(--text); font-size: 15px; }
.ek-msj { display: flex; flex-direction: column; gap: 10px; border-color: var(--accent); }
.ek-gelen { background: var(--accent-soft); border: 1px solid var(--accent); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.ek-gelen b { font-size: 19px; line-height: 1.3; }
.ek-gelen small { font-size: 12.5px; color: var(--muted); }
.ek-eski { margin: 0; padding-left: 18px; font-size: 13px; color: var(--muted); display: flex; flex-direction: column; gap: 2px; }
.ek-yanitlar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.ek-yanitlar button { min-height: 52px; border-radius: 12px; border: 1px solid var(--line3); background: var(--bg2); color: var(--text); font-size: 13.5px; padding: 6px 8px; line-height: 1.25; text-align: left; }
.ek-yanitlar button.acil { border-color: var(--danger); }
.ek-yanitlar button[aria-pressed='true'] { background: var(--accent); border-color: var(--accent); color: var(--on-accent); font-weight: 600; }
`;

const REKLAM_YAZI: Record<string, string> = {
  yayiliyor: 'Yakındaki uygulamalı telefonlar sizi duyabilir.',
  'izin-yok': 'Bluetooth izni verilmedi.',
  'bluetooth-kapali': 'Bluetooth kapalı.',
  'bluetooth-yok': 'Bu telefonda Bluetooth yok.',
  desteklenmiyor: 'Bu telefon Bluetooth işareti yayamıyor.',
  baslamadi: 'Başlatılıyor…',
};

function useNow(ms = 1000) {
  const [n, set] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => set(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return n;
}

/** Yanlışlıkla kapanmasın: 2 sn basılı tut */
function HoldButton({ label, onDone, testid }: { label: string; onDone: () => void; testid: string }) {
  const [p, setP] = useState(0);
  const t = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = () => {
    if (t.current) clearInterval(t.current);
    t.current = null;
    setP(0);
  };
  const start = () => {
    stop();
    const bas = Date.now();
    t.current = setInterval(() => {
      const x = Math.min(1, (Date.now() - bas) / 2000);
      setP(x);
      if (x >= 1) {
        stop();
        onDone();
      }
    }, 50);
  };
  useEffect(() => stop, []);
  return (
    <button
      type="button"
      class="ek-hold"
      data-testid={testid}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !t.current && start()}
      onKeyUp={stop}
    >
      <i style={{ width: `${p * 100}%` }} aria-hidden="true" />
      <span>{p > 0 ? 'Bırakmayın…' : label}</span>
    </button>
  );
}

function Row({ ok, title, text, children }: { ok: boolean | null; title: string; text: string; children?: any }) {
  return (
    <div class="ek-row">
      <span class={'ek-ic ' + (ok === null ? 'wait' : ok ? 'ok' : 'bad')} aria-hidden="true">
        {ok === null ? '' : ok ? '✓' : '!'}
      </span>
      <div class="t">
        <b>{title}</b>
        <span>{text}</span>
        {children}
      </div>
    </div>
  );
}

function konumYazi(k: KayitliKonum | null | undefined, simdi: number) {
  if (!k) return 'Kayıtlı konum yok. Bina bilginiz SMS ve işarette yer alır.';
  return `${k.lat.toFixed(5)}, ${k.lon.toFixed(5)}${k.dogruluk > 0 ? ` (±${Math.round(k.dogruluk)} m)` : ''} · ${sureOnce(simdi - k.zaman)}`;
}

// ---------------------------------------------------------------- açık enkaz modu

function Aktif({ d, bina, ad, yenile }: { d: EnkazDurum; bina: Bina | null; ad: string; yenile: () => void }) {
  const simdi = useNow();
  const [msg, setMsg] = useState<{ t: string; bad?: boolean } | null>(null);
  // "Şimdi ses çal"a basıldığı an: servisin bildirimi gecikse de düğme hemen tepki versin
  const [basildi, setBasildi] = useState(0);
  const reklamOk = d.reklam === 'yayiliyor';
  const susturuldu = (d.sesDuraklatBitis ?? 0) > simdi;
  const gorunur = d.gorunurBitis > simdi;
  // Bir SOS turu ~8 sn sürer: düğme bu sırada "Çalıyor…" der (basınca bir şey olduğu görülsün)
  const caliyor = (!!d.sonSes && simdi - d.sonSes < 8500) || simdi - basildi < 8500;
  /** İzin/Bluetooth penceresinden dönünce durum hemen yenilensin (yalnız olaya güvenilmez) */
  const sonra = () => {
    yenile();
    setTimeout(yenile, 1200);
  };
  const aralik = d.sesAraligiSn >= 60 ? `${Math.round(d.sesAraligiSn / 60)} dakikada bir` : `${d.sesAraligiSn} saniyede bir`;

  const gorun = async () => {
    const r = await nativeEnkaz.gorunurOl(d.etiket || isaretEtiketi(ad, bina));
    if (r?.sn) setMsg({ t: `Bluetooth adınız "${r.ad}" oldu; ${Math.round(r.sn / 60)} dakika boyunca her telefonun Bluetooth listesinde görünürsünüz.` });
    else setMsg({ t: r?.hata === 'izin-yok' ? 'Bluetooth izni verilmedi.' : 'Görünürlük açılmadı.', bad: true });
  };

  return (
    <section class="card ek-live" data-testid="ek-live" aria-live="polite">
      <div class="ek-live-h">
        <span class="ek-dot" aria-hidden="true" />
        <b class="grow" style="font-size:17px">Enkaz modu açık</b>
        <span class="mono" data-testid="ek-sure">
          {sure(simdi - (d.baslangic || simdi))}
        </span>
      </div>
      {d.kod && (
        <p class="ek-kod" data-testid="ek-kod">
          İşaret kodunuz <b>{d.kod}</b> · SMS'e eklendi; kurtarıcı bu kodla sizi arar.
        </p>
      )}
      {d.otomatik && <p class="ek-msg">Sarsıntıdan sonra yanıt gelmediği için kendiliğinden açıldı. İyiyseniz aşağıdan kapatın.</p>}
      {!d.aktif && (
        <div class="ek-row" style="border-top:0" data-testid="ek-calismiyor">
          <span class="ek-ic wait" aria-hidden="true" />
          <div class="t">
            <b>Başlatılıyor…</b>
            <span>Birkaç saniye içinde başlamazsa dokunun.</span>
            <button class="btn" data-testid="ek-yeniden" onClick={() => nativeEnkaz.baslat(d.etiket, d.kat === -128 ? null : d.kat)}>
              Yeniden başlat
            </button>
          </div>
        </div>
      )}
      <div>
        <Row ok={reklamOk} title="Bluetooth işareti" text={REKLAM_YAZI[d.reklam ?? 'baslamadi'] ?? `Yayılamadı (${d.reklam}).`}>
          {d.reklam === 'bluetooth-kapali' && (
            <button
              class="btn"
              data-testid="ek-bt-ac"
              onClick={async () => {
                setMsg(null);
                const r = await nativeEnkaz.bluetoothAc();
                if (r && !r.izinler.bluetoothAcik) setMsg({ t: "Bluetooth açılmadı. Bildirim panelinden Bluetooth'u açabilirsiniz; işaret kendiliğinden başlar.", bad: true });
                sonra();
              }}
            >
              Bluetooth'u aç
            </button>
          )}
          {d.reklam === 'izin-yok' && (
            <button
              class="btn"
              data-testid="ek-izin"
              onClick={async () => {
                setMsg(null);
                const r = await nativeEnkaz.izinIste();
                if (r && !r.izinler.bluetooth) setMsg({ t: 'Bluetooth izni verilmedi. Ayarlar → Uygulamalar → Akıl Çantası → İzinler → "Yakındaki cihazlar"dan izin verin.', bad: true });
                sonra();
              }}
            >
              İzin ver
            </button>
          )}
        </Row>
        <Row
          ok={!susturuldu}
          title="SOS ses ve ışık"
          text={
            susturuldu
              ? `Susturuldu, ${Math.max(1, Math.round(((d.sesDuraklatBitis ?? 0) - simdi) / 60000))} dk sonra yeniden başlar.`
              : `${aralik} çalar (pil azaldıkça seyrekleşir).${d.sonSes ? ' Son: ' + sureOnce(simdi - d.sonSes) + '.' : ''}`
          }
        >
          <div class="ek-btns">
            <button
              class="btn primary"
              data-testid="ek-ses"
              disabled={caliyor}
              onClick={async () => {
                setBasildi(Date.now());
                await nativeEnkaz.sesCal();
                yenile();
              }}
            >
              {caliyor ? 'Çalıyor…' : 'Şimdi ses çal'}
            </button>
            {susturuldu ? (
              <button class="btn" data-testid="ek-ses-ac" onClick={() => nativeEnkaz.sesDuraklat(0)}>
                Sesi yeniden aç
              </button>
            ) : (
              <button class="btn" data-testid="ek-sustur" onClick={() => nativeEnkaz.sesDuraklat(10)}>
                10 dk sustur
              </button>
            )}
          </div>
        </Row>
        <Row
          ok={gorunur ? true : null}
          title="Uygulaması olmayanlara görün"
          text={
            gorunur
              ? `Bluetooth listesinde "ENKAZ" adıyla görünüyorsunuz. Kalan: ${Math.max(1, Math.round((d.gorunurBitis - simdi) / 60000))} dk.`
              : 'Telefonunuz 1 saat boyunca her telefonun Bluetooth eşleştirme listesinde "ENKAZ" adıyla görünür. Bitince bildirimle hatırlatılır.'
          }
        >
          {!gorunur && (
            <button class="btn" data-testid="ek-gorun" onClick={gorun}>
              Bluetooth'ta görünür ol (1 saat)
            </button>
          )}
        </Row>
        <Row ok={d.sonKonum ? true : null} title="Son konum" text={(d.gpsDeneniyor ? 'GPS deneniyor… ' : '') + konumYazi(d.sonKonum, simdi)} />
        <Row ok={d.pil < 0 || d.pil >= 20} title="Pil" text={d.pil >= 0 ? `%${d.pil}. Ekranı kapatın; işaret ve ses ekran kapalıyken de sürer.` : 'Bilinmiyor.'} />
      </div>
      {msg && (
        <p class={'ek-msg' + (msg.bad ? ' bad' : '')} role="status">
          {msg.t}
        </p>
      )}
      <Mesajlasma d={d} simdi={simdi} />
      <GidenKutusu />
      <section class="card" style="background:var(--bg2)">
        <h2 class="kn-h">Enerjinizi koruyun</h2>
        <ol class="ek-tips">
          <li>Bağırmayın; telefonun sesi sizin yerinize çağırır. Yakında ses duyarsanız seslenin.</li>
          <li>Boru ya da duvara sert bir cisimle üç kez vurun, bekleyin, tekrarlayın.</li>
          <li>Ağzınızı ve burnunuzu bezle kapatın (toz).</li>
          <li>Yaklaşan sesleri dinlemek için sesi 10 dakika susturabilirsiniz.</li>
        </ol>
      </section>
      <HoldButton label="Enkaz modunu kapat (2 sn basılı tutun)" testid="ek-kapat" onDone={() => nativeEnkaz.durdur()} />
    </section>
  );
}

/** Kurtarıcıdan gelen hazır mesajlar ve hazır yanıtlar (Bluetooth işaretiyle) */
function Mesajlasma({ d, simdi }: { d: EnkazDurum; simdi: number }) {
  const [son, ...eski] = d.mesajlar ?? [];
  const yanit = d.yanit?.kod ?? 0;
  return (
    <section class="card ek-msj" data-testid="ek-mesajlar">
      <h2 class="kn-h">Kurtarıcılarla mesaj</h2>
      {son ? (
        <div class="ek-gelen" role="alert" data-testid="ek-gelen">
          <small>Kurtarıcılardan · {sureOnce(simdi - son.zaman)}</small>
          <b>{MESAJLAR[son.kod] ?? '?'}</b>
        </div>
      ) : (
        <p class="kn-sub">
          Henüz mesaj yok. Yakına gelen bir kurtarıcı uygulamadan kısa mesaj gönderebilir; gelince telefon titrer ve sesli okur.
          {d.aktif && d.mesajDinleme === false ? " Mesajları duymak için Bluetooth açık olmalı." : ''}
        </p>
      )}
      {eski.length > 0 && (
        <ol class="ek-eski">
          {eski.map((m) => (
            <li key={m.no + '-' + m.zaman}>
              {MESAJLAR[m.kod]} <span>· {sureOnce(simdi - m.zaman)}</span>
            </li>
          ))}
        </ol>
      )}
      <p class="kn-sub">Yanıt verin; kurtarıcının ekranında görünür:</p>
      <div class="ek-yanitlar" role="group" aria-label="Hazır yanıtlar">
        {YANITLAR.map((t, i) =>
          i === 0 ? null : (
            <button key={i} class={ACIL_YANIT.has(i) ? 'acil' : ''} aria-pressed={yanit === i} data-testid={'ek-yanit-' + i} onClick={() => nativeEnkaz.yanitVer(i)}>
              {t}
            </button>
          ),
        )}
      </div>
      {yanit > 0 && (
        <p class="kn-sub" data-testid="ek-yanitim">
          Son yanıtınız: <b>{YANITLAR[yanit]}</b> ({sureOnce(simdi - (d.yanit?.zaman ?? simdi))}). İşaretinizle yayılıyor.
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- başlatma

/** SMS uygulamasını hazır mesajla açar (uçtan uca testler bağlantıyı yakalayabilsin) */
function smsAc(href: string) {
  const hook = (window as any).__acSmsOpen;
  if (typeof hook === 'function') return void hook(href);
  location.href = href;
}

function Baslat({ binalar, ad, sonKonum, kod, onBasladi }: { binalar: Bina[]; ad: string; sonKonum: KayitliKonum | null; kod?: string; onBasladi: () => void }) {
  const [acik, setAcik] = useState(false);
  // Kullanıcı seçmediyse: son konuma en yakın kayıtlı bina, yoksa ilki (bina sonradan eklenirse de)
  const [secim, setBinaId] = useState<string | null>(null);
  const binaId = secim ?? (enYakinBina(binalar, sonKonum) ?? binalar[0])?.id ?? '';
  const [yakinlar] = useYakinlar();
  const [sms112, setSms112] = useState(true);
  const [smsYakin, setSmsYakin] = useState(yakinlar.length > 0);
  const [msg, setMsg] = useState<{ t: string; bad?: boolean } | null>(null);
  const yerel = nativeEnkaz.available();
  const bina = binalar.find((b) => b.id === binaId) ?? null;
  const metin = enkazSms({ ad, bina, konum: sonKonum, simdi: Date.now(), kod: yerel ? kod : undefined });

  const baslat = async () => {
    const r = await nativeEnkaz.baslat(isaretEtiketi(ad, bina), bina?.kat ?? null);
    if (!r) {
      setMsg({ t: 'Enkaz modu başlatılamadı.', bad: true });
      return;
    }
    // Uygulama SMS'i kendisi gönderemezse (SMS izni verilmedi) SMS uygulaması hazır açılır;
    // yoksa kullanıcı SMS'in gittiğini sanır.
    const gitmeyen: string[] = [];
    if (sms112 && !(await nativeSms.send(['112'], ['112'], metin)).queued) gitmeyen.push('112');
    if (smsYakin && yakinlar.length) {
      const r = await nativeSms.send(
        yakinlar.map((y) => y.phone),
        yakinlar.map((y) => y.name),
        metin,
      );
      if (!r.queued) gitmeyen.push(...yakinlar.map((y) => y.phone));
    }
    if (gitmeyen.length) smsAc(multiSmsHref(gitmeyen, metin, isIOS()));
    onBasladi();
  };

  if (!acik)
    return (
      <button class="ek-start" data-testid="ek-baslat" onClick={() => setAcik(true)}>
        <b>Enkaz altındayım</b>
        <span>Telefon kendini bulunur kılar: Bluetooth işareti, SOS ses ve ışık, SMS. Günlerce sürecek şekilde pili korur.</span>
      </button>
    );

  return (
    <section class="card kn-form" data-testid="ek-baslat-panel">
      <h2 class="kn-h">Neredesiniz?</h2>
      <div class="ek-pick" role="radiogroup">
        {binalar.map((b) => (
          <label class="ek-opt" key={b.id}>
            <input type="radio" name="ek-bina" checked={binaId === b.id} onChange={() => setBinaId(b.id)} />
            <span class="t">
              <b>{b.ad}</b>
              <small>{[b.adres, binaYeri(b)].filter(Boolean).join(' · ') || 'Ayrıntı girilmemiş'}</small>
            </span>
          </label>
        ))}
        <label class="ek-opt">
          <input type="radio" name="ek-bina" checked={!bina} onChange={() => setBinaId('')} data-testid="ek-bina-yok" />
          <span class="t">
            <b>Başka bir yer</b>
            <small>Yalnız son konum gönderilir</small>
          </span>
        </label>
      </div>
      {yerel ? (
        <>
          <label class="ek-opt">
            <input type="checkbox" checked={sms112} onChange={(e) => setSms112((e.target as HTMLInputElement).checked)} data-testid="ek-sms112" />
            <span class="t">
              <b>112'ye SMS</b>
              <small>Şebeke yoksa gelene kadar yeniden denenir. 112 SMS'i her yerde almayabilir; şebeke gelirse arayın.</small>
            </span>
          </label>
          <label class="ek-opt">
            <input type="checkbox" checked={smsYakin} disabled={!yakinlar.length} onChange={(e) => setSmsYakin((e.target as HTMLInputElement).checked)} data-testid="ek-smsyakin" />
            <span class="t">
              <b>Yakınlarıma SMS{yakinlar.length ? ` (${yakinlar.length} kişi)` : ''}</b>
              <small>{yakinlar.length ? yakinlar.map((y) => y.name).join(', ') : 'Kayıtlı yakın yok (İletişim → Yakınlarım).'}</small>
            </span>
          </label>
          <p class="kn-sub" data-testid="ek-sms-metin">
            Mesaj: {metin}
          </p>
          <button class="btn primary" style="min-height:56px;font-size:16px" data-testid="ek-baslat-onay" onClick={baslat}>
            Enkaz modunu başlat
          </button>
        </>
      ) : (
        <>
          <p class="ek-msg">
            Tarayıcıda Bluetooth işareti ve arka planda ses yok; bunlar Android uygulamasında çalışır. Burada SMS'i hazırlayabilir, ekran açıkken SOS ses ve ışık verebilirsiniz.
          </p>
          <a class="btn primary" style="display:flex;align-items:center;justify-content:center" data-testid="ek-web-sms" href={multiSmsHref(['112', ...yakinlar.map((y) => y.phone)], metin, isIOS())}>
            SMS'i hazırla (112{yakinlar.length ? ' ve yakınlar' : ''})
          </a>
          <button class="btn" data-testid="ek-web-sos" onClick={() => go.comm('sos')}>
            SOS ses ve ışık (ekran açık kalmalı)
          </button>
        </>
      )}
      {msg && <p class={'ek-msg' + (msg.bad ? ' bad' : '')}>{msg.t}</p>}
      <button class="btn" onClick={() => setAcik(false)}>
        Vazgeç
      </button>
    </section>
  );
}

// ---------------------------------------------------------------- hazırlık

const BOS: Omit<Bina, 'id'> = { ad: '', adres: '', blok: '', kat: null, daire: '', not: '' };

function BinaFormu({ b, onKaydet, onSil, onVazgec }: { b: Bina; onKaydet: (b: Bina) => void; onSil?: () => void; onVazgec: () => void }) {
  const [f, setF] = useState<Bina>(b);
  const [konumMsg, setKonumMsg] = useState('');
  const set = (k: keyof Bina) => (e: Event) => setF({ ...f, [k]: (e.target as HTMLInputElement).value } as Bina);
  const konum = async () => {
    setKonumMsg('Konum alınıyor…');
    const p = await quickPosition(15000, 60000);
    if (!p) return setKonumMsg('Konum alınamadı. Bina içindeyseniz pencereye yaklaşın.');
    setF({ ...f, lat: p.lat, lon: p.lon });
    setKonumMsg(`Eklendi (±${Math.round(p.acc ?? 0)} m). Enkaz modunda bu binaya yakınsanız kendiliğinden seçilir.`);
  };
  return (
    <div class="kn-form card" data-testid="ek-bina-form">
      <label class="kn-field">
        <span>Adı (Ev, İş…)</span>
        <input class="input" maxLength={24} value={f.ad} onInput={set('ad')} data-testid="ek-bina-ad" placeholder="Ev" />
      </label>
      <label class="kn-field">
        <span>Adres ya da tarif</span>
        <input class="input" maxLength={120} value={f.adres} onInput={set('adres')} data-testid="ek-bina-adres" placeholder="Örnek Mah. 5. Sokak No 3" />
      </label>
      <div class="kn-grid2">
        <label class="kn-field">
          <span>Blok</span>
          <input class="input" maxLength={12} value={f.blok} onInput={set('blok')} placeholder="B" />
        </label>
        <label class="kn-field">
          <span>Kat (zemin 0)</span>
          <input
            class="input"
            type="number"
            inputMode="numeric"
            value={f.kat ?? ''}
            data-testid="ek-bina-kat"
            onInput={(e) => {
              const v = (e.target as HTMLInputElement).value;
              setF({ ...f, kat: v === '' ? null : Math.round(Number(v)) });
            }}
          />
        </label>
      </div>
      <div class="kn-grid2">
        <label class="kn-field">
          <span>Daire</span>
          <input class="input" maxLength={12} value={f.daire} onInput={set('daire')} />
        </label>
        <div class="kn-field">
          <span>Binanın konumu</span>
          <button class="btn" type="button" onClick={konum} data-testid="ek-bina-konum">
            {f.lat != null ? 'Konumu yenile' : 'Buradayım, ekle'}
          </button>
        </div>
      </div>
      {konumMsg && <p class="kn-sub">{konumMsg}</p>}
      <label class="kn-field">
        <span>Not (kurtarıcıya ipucu)</span>
        <input class="input" maxLength={120} value={f.not} onInput={set('not')} placeholder="Yatak odası arka cephede" />
      </label>
      <div class="ek-btns">
        <button class="btn primary" data-testid="ek-bina-kaydet" onClick={() => onKaydet({ ...f, ad: f.ad.trim() || 'Bina' })}>
          Kaydet
        </button>
        <button class="btn" onClick={onVazgec}>
          Vazgeç
        </button>
        {onSil && (
          <button class="btn" style="color:var(--danger);border-color:var(--danger)" onClick={onSil}>
            Sil
          </button>
        )}
      </div>
    </div>
  );
}

function Hazirlik({ binalar, setBinalar }: { binalar: Bina[]; setBinalar: (b: Bina[]) => void }) {
  const [p, setP] = useProfile();
  const [duzenle, setDuzenle] = useState<Bina | null>(null);
  return (
    <section class="card kn-form" data-testid="ek-hazirlik">
      <h2 class="kn-h">Hazırlık: kurtarıcı sizi nerede arasın?</h2>
      <p class="kn-sub">Enkaz altında yeni konum bulmak zordur. Bina, kat ve daire bilgisi koordinattan değerlidir. Yalnız bu telefonda saklanır; enkaz modunda SMS'e ve işarete eklenir.</p>
      <label class="kn-field">
        <span>Adınız</span>
        <input class="input" maxLength={30} value={p.name} onInput={(e) => setP({ name: (e.target as HTMLInputElement).value })} data-testid="ek-ad" placeholder="Ayşe" />
      </label>
      {binalar.map((b) =>
        duzenle?.id === b.id ? (
          <BinaFormu
            key={b.id}
            b={b}
            onKaydet={(n) => {
              setBinalar(binalar.map((x) => (x.id === b.id ? n : x)));
              setDuzenle(null);
            }}
            onSil={() => {
              setBinalar(binalar.filter((x) => x.id !== b.id));
              setDuzenle(null);
            }}
            onVazgec={() => setDuzenle(null)}
          />
        ) : (
          <div class="ek-b" key={b.id} data-testid="ek-bina">
            <span class="t">
              <b>{b.ad}</b>
              <small>{[b.adres, binaYeri(b), b.lat != null ? 'konum kayıtlı' : ''].filter(Boolean).join(' · ') || 'Ayrıntı girilmemiş'}</small>
            </span>
            <button class="btn" onClick={() => setDuzenle(b)}>
              Düzenle
            </button>
          </div>
        ),
      )}
      {duzenle && !binalar.some((b) => b.id === duzenle.id) ? (
        <BinaFormu
          b={duzenle}
          onKaydet={(n) => {
            setBinalar([...binalar, n]);
            setDuzenle(null);
          }}
          onVazgec={() => setDuzenle(null)}
        />
      ) : (
        binalar.length < MAX_BINA && (
          <button
            class="btn"
            data-testid="ek-bina-ekle"
            onClick={() => setDuzenle({ ...BOS, id: Math.random().toString(36).slice(2, 10), ad: binalar.length ? 'İş' : 'Ev' })}
          >
            + Bina ekle (ev, iş, okul…)
          </button>
        )
      )}
    </section>
  );
}

function Switch({ id, title, desc, on, onChange }: { id: string; title: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button class="ek-sw" role="switch" aria-checked={on ? 'true' : 'false'} data-testid={'ek-' + id} onClick={() => onChange(!on)}>
      <span class="t">
        <b>{title}</b>
        <span>{desc}</span>
      </span>
      <span class="ek-track" aria-hidden="true" />
    </button>
  );
}

const MODLAR: { id: KonumKaydiModu; t: string }[] = [
  { id: 'kapali', t: 'Kapalı' },
  { id: 'saatlik', t: 'Saatte bir' },
  { id: 'hareketli', t: 'Hareketliyken sık' },
];

function ArkaPlan({ d, yenile }: { d: EnkazDurum | null; yenile: () => void }) {
  const simdi = useNow(30000);
  const [liste, setListe] = useState<KayitliKonum[]>([]);
  const [msg, setMsg] = useState<{ t: string; bad?: boolean } | null>(null);
  // Son konum kayıtları kurtarma için değerli: tek dokunuşla silinmesin
  const [silSor, setSilSor] = useState(false);
  const iz = d?.izinler;
  const mod = d?.konumKaydiModu ?? 'kapali';
  useEffect(() => {
    nativeEnkaz.konumKaydi().then((r) => r && setListe(r.liste));
  }, [d?.konumKaydiModu]);

  /** Arka plan konum izni ister; verilmezse false */
  const arkaIzin = async () => {
    if (iz?.arkaPlanKonum) return true;
    const r = await nativeEnkaz.arkaPlanKonumIzni();
    if (r?.izinler.arkaPlanKonum) return true;
    setMsg({ t: 'Arka planda konum için Ayarlar → Konum → "Her zaman izin ver" seçilmeli. Açılan sayfadan seçip geri dönün.', bad: true });
    yenile();
    return false;
  };
  const pilUyar = () => !iz?.pilMuaf && setMsg({ t: 'Bazı telefonlar arka plan işlerini durdurur. Aşağıdan pil kısıtlamasını kaldırın.' });

  const modSec = async (m: KonumKaydiModu) => {
    setMsg(null);
    if (m !== 'kapali' && !(await arkaIzin())) return;
    await nativeEnkaz.konumKaydiModu(m);
    if (m !== 'kapali') pilUyar();
    yenile();
  };
  const nobet = async (on: boolean) => {
    setMsg(null);
    if (on) {
      const iz2 = (await nativeEnkaz.izinIste())?.izinler;
      if (!iz2?.bluetooth) return setMsg({ t: 'Bluetooth izni gerekli.', bad: true });
      if (!(await arkaIzin())) return;
    }
    const r = await nativeEnkaz.nobet(on);
    if (on && r?.hata) setMsg({ t: r.hata === 'bluetooth-kapali' ? "Bluetooth kapalı; açıp yeniden deneyin." : `Açılamadı (${r.hata}).`, bad: true });
    else if (on) pilUyar();
    yenile();
  };
  const sarsinti = async (on: boolean) => {
    setMsg(null);
    if (on) await nativeEnkaz.izinIste();
    const r = await nativeEnkaz.sarsinti(on);
    if (on && !r?.acik)
      setMsg({
        t: r?.hata === 'bildirim-kapali' ? 'Bildirimler kapalı: "İyi misiniz?" sorusu görünmezse iptal edilemez. Bildirim iznini açıp yeniden deneyin.' : 'Sarsıntı nöbeti başlatılamadı.',
        bad: true,
      });
    // Arka plandan enkaz modunu açabilmesi için pil kısıtlaması kaldırılmalı (Android 12+)
    else if (on && !iz?.pilMuaf) await nativeEnkaz.pilMuafiyeti();
    yenile();
  };

  return (
    <section class="card kn-form" data-testid="ek-arkaplan">
      <h2 class="kn-h">Arka planda (isteğe bağlı)</h2>
      <div class="kn-field">
        <span>Son konumu arka planda kaydet</span>
        <div class="ek-seg" role="group" aria-label="Son konum kaydı">
          {MODLAR.map((m) => (
            <button key={m.id} aria-pressed={mod === m.id} data-testid={'ek-mod-' + m.id} onClick={() => modSec(m.id)}>
              {m.t}
            </button>
          ))}
        </div>
        <p class="kn-sub">
          Uygulama kapalıyken de yaklaşık saatte bir konum yazılır (hareket halindeyken 15 dakikada bir). Pil etkisi çok küçüktür. Kayıtlar yalnız bu telefonda tutulur, hiçbir yere gönderilmez; son 24 kayıt saklanır.
        </p>
      </div>
      <Switch
        id="nobet"
        title="Yakındaki enkaz işaretlerini dinle"
        desc="Uygulama kapalıyken de yakında bir enkaz işareti duyulursa bildirim çıkar. Sistemin düşük güçlü Bluetooth taramasını kullanır."
        on={!!d?.nobet}
        onChange={nobet}
      />
      <Switch
        id="sarsinti"
        title="Sarsıntıdan sonra sor (deneysel)"
        desc="Güçlü sarsıntıdan sonra telefon hareketsiz kalırsa 'İyi misiniz?' diye sorar; 3 dk yanıt yoksa enkaz modunu açar (SMS göndermez). Kalıcı bildirim gösterir, pili biraz daha çok kullanır."
        on={!!d?.sarsinti}
        onChange={sarsinti}
      />
      {msg && (
        <p class={'ek-msg' + (msg.bad ? ' bad' : '')} role="status" data-testid="ek-arka-msg">
          {msg.t}
        </p>
      )}
      {iz && !iz.pilMuaf && (mod !== 'kapali' || d?.nobet || d?.sarsinti) && (
        <button class="btn" data-testid="ek-pil" onClick={async () => (await nativeEnkaz.pilMuafiyeti(), yenile())}>
          Pil kısıtlamasını kaldır
        </button>
      )}
      <div class="kn-field">
        <span>Son kayıtlar</span>
        {liste.length ? (
          <>
            <ul class="ek-kayit" data-testid="ek-kayitlar">
              {liste.slice(0, 5).map((k) => (
                <li key={k.zaman}>
                  <span class="mono">
                    {k.lat.toFixed(4)}, {k.lon.toFixed(4)}
                  </span>
                  <span>{sureOnce(simdi - k.zaman)}</span>
                </li>
              ))}
            </ul>
            {silSor ? (
              <div class="kn-confirm">
                <span>Konum kayıtları silinsin mi?</span>
                <button
                  class="btn"
                  data-testid="ek-kayit-sil-evet"
                  onClick={async () => {
                    await nativeEnkaz.konumKaydiTemizle();
                    setListe([]);
                    setSilSor(false);
                  }}
                >
                  Sil
                </button>
                <button class="btn" data-testid="ek-kayit-sil-hayir" onClick={() => setSilSor(false)}>
                  Vazgeç
                </button>
              </div>
            ) : (
              <button class="btn" data-testid="ek-kayit-sil" onClick={() => setSilSor(true)}>
                Kayıtları sil
              </button>
            )}
          </>
        ) : (
          <p class="kn-sub">Henüz kayıt yok.</p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- araç

/** EnkazServisi.durum(): yalnız servis çalışırken gelen ve kaybolabilen alanlar */
const SERVIS_ALANLARI = ['reklam', 'sonSes', 'sesSayisi', 'sesDuraklatBitis', 'sonGps', 'gpsDeneniyor', 'mesajDinleme', 'yanit', 'sonKonum'] as const;

export default function EnkazTool() {
  const yerel = nativeEnkaz.available();
  const [d, setD] = useState<EnkazDurum | null>(null);
  const [binalar, setB] = useState<Bina[]>(() => loadBinalar());
  const [p] = useProfile();
  const [webKonum, setWebKonum] = useState<KayitliKonum | null>(() => sonKonumlarWeb()[0] ?? null);

  const yenile = () => {
    if (yerel) nativeEnkaz.durum().then((x) => x && setD(x));
  };
  useEffect(() => {
    yenile();
    // Olay yalnız servisin durumunu taşır (izinler, nöbet vb. durum() çağrısından gelir, korunur).
    // Servis çalışmıyorsa servise ait alanlar olayda yoktur: eskisi kalmasın (ör. "Bluetooth
    // kapalı" yazısı ve "Bluetooth'u aç" düğmesi açıldıktan sonra da görünmesin).
    const off = nativeEnkaz.onDurum((x) =>
      setD((o) => {
        const n: EnkazDurum = { ...(o ?? {}), ...x };
        for (const k of SERVIS_ALANLARI) if (!(k in x)) delete n[k];
        return n;
      }),
    );
    const vis = () => document.visibilityState === 'visible' && yenile();
    document.addEventListener('visibilitychange', vis);
    return () => {
      off();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  const setBinalar = (l: Bina[]) => {
    setB(l);
    saveBinalar(l);
  };
  // Sarsıntıdan sonra otomatik açılışta kullanılacak etiket: ilk bina
  useEffect(() => {
    if (yerel) void nativeEnkaz.hazirlik(isaretEtiketi(p.name, binalar[0] ?? null), binalar[0]?.kat ?? null);
  }, [p.name, binalar]);

  const sonKonum = yerel ? (d?.sonKonum ?? null) : webKonum;
  const aktif = !!d?.istenen;
  const bina = enYakinBina(binalar, sonKonum) ?? binalar[0] ?? null;

  return (
    <div class="kn" data-testid="enkaz">
      <style>{KAYNAK_CSS + CSS}</style>
      {aktif && d ? (
        <Aktif d={d} bina={bina} ad={p.name} yenile={yenile} />
      ) : (
        <>
          <Baslat binalar={binalar} ad={p.name} sonKonum={sonKonum} kod={d?.kod} onBasladi={yenile} />
          <button class="btn" data-testid="ek-arama-git" onClick={() => go.tool('enkaz-arama')}>
            Kurtarıcıysanız: enkaz arama
          </button>
        </>
      )}
      <Hazirlik binalar={binalar} setBinalar={setBinalar} />
      {yerel ? (
        <ArkaPlan d={d} yenile={yenile} />
      ) : (
        <section class="card kn-form">
          <h2 class="kn-h">Son konum</h2>
          <p class="kn-sub">
            {webKonum ? `Son bilinen: ${konumYazi(webKonum, Date.now())}` : 'Kayıtlı konum yok.'} Uygulama konum bulduğunda bu telefona yazılır. Arka planda kayıt Android uygulamasında var.
          </p>
          {webKonum && (
            <button
              class="btn"
              onClick={() => {
                sonKonumlarWebTemizle();
                setWebKonum(null);
              }}
            >
              Kaydı sil
            </button>
          )}
        </section>
      )}
    </div>
  );
}
