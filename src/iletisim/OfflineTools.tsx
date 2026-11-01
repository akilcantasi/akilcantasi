// İletişim: şebekesiz araçlar — SOS ışık/ses/fener, Mors çevirici, hazır SMS.
import { useEffect, useRef, useState } from 'preact/hooks';
import { native } from '../lib/native';
import { GeoButton, NameField, Section, useGeo, useProfile } from './common';
import { looksLikeMorse, morseToSteps, morseToText, textToMorse, unitMs } from './morse';
import { cleanPhone } from './outbox';
import { SOS_STEPS, WHISTLE_STEPS, keepAwake, play, steady, type Player, type SoundKind } from './signal';
import { TEMPLATE_TITLE, buildTemplate, isIOS, smsHref, smsParts, type TemplateId } from './sms';

/** Işık için birim: 250 ms (saniyede en çok 2 parlama; ışığa duyarlılık sınırı olan 3/sn'nin altında) */
const LIGHT_UNIT = 250;

type Mode = 'sos' | 'steady' | 'morse';

interface FlashProps {
  mode: Mode;
  color: 'white' | 'red';
  torch: boolean;
  sound: boolean;
  morse?: string;
  onClose: () => void;
}

/** Tam ekran ışık. Ekrana ya da "Durdur"a dokununca kapanır. */
export function FlashOverlay({ mode, color, torch, sound, morse, onClose }: FlashProps) {
  const [on, setOn] = useState(mode === 'steady');
  const [torchFail, setTorchFail] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let release: () => void = () => {};
    keepAwake().then((r) => (release = r));
    const el = ref.current as any;
    try {
      el?.requestFullscreen?.({ navigationUI: 'hide' })?.catch?.(() => {});
    } catch {}
    let p: Player;
    if (mode === 'steady') p = steady({ torch, onChange: setOn });
    else {
      const steps = mode === 'sos' ? SOS_STEPS : [...morseToSteps(morse ?? ''), [false, 7] as [boolean, number]];
      p = play({ steps, unitMs: LIGHT_UNIT, loop: true, torch, sound: sound ? 'tone' : null, toneHz: 750, onChange: setOn });
    }
    const t = setInterval(() => setTorchFail(p.torchFailed()), 1000);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => {
      p.stop();
      release();
      clearInterval(t);
      window.removeEventListener('keydown', esc);
      try {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      } catch {}
    };
  }, []);
  const bg = on ? (color === 'white' ? '#ffffff' : '#ff1a1a') : '#000000';
  return (
    <div ref={ref} class="cm-flash" style={{ background: bg }} data-testid="sos-overlay" data-on={on ? '1' : '0'} onClick={onClose} role="dialog" aria-label="Tam ekran ışık">
      {torchFail && <small>Telefon feneri açılamadı; yalnızca ekran kullanılıyor.</small>}
      <small>{mode === 'sos' ? 'SOS  · · ·  − − −  · · ·' : mode === 'steady' ? 'Sürekli ışık' : 'Mors gönderiliyor'}</small>
      <button
        class="btn"
        data-testid="sos-stop"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        Durdur
      </button>
    </div>
  );
}

function useSound() {
  const [kind, setKind] = useState<SoundKind | null>(null);
  const p = useRef<Player | null>(null);
  const start = (k: SoundKind) => {
    p.current?.stop();
    if (kind === k) {
      setKind(null);
      p.current = null;
      return;
    }
    p.current = k === 'whistle' ? play({ steps: WHISTLE_STEPS, unitMs: 100, loop: true, sound: 'whistle' }) : play({ steps: [[true, 1]], unitMs: 3600_000, loop: true, sound: 'siren' });
    setKind(k);
  };
  useEffect(() => () => p.current?.stop(), []);
  return { kind, start };
}

const SvgI = ({ d, size = 26 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />
);
const I_TORCH = '<path d="M8 3h8l-1 5H9z"/><path d="M9 8v11a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8"/><path d="M12 12v2"/>';
const I_BEEP = '<path d="M4 10v4h3l5 4V6l-5 4z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"/>';
const I_LIGHT = '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>';
const I_WHISTLE = '<path d="M3 12h9a4 4 0 1 0 4-4H8"/><path d="M3 8v8"/>';
const I_SIREN = '<path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 18h14v3H5z"/><path d="M12 2v2M4.2 5.2l1.4 1.4M19.8 5.2l-1.4 1.4"/>';
const I_PHONE = '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>';

export function Sos() {
  const [flash, setFlash] = useState<Mode | null>(null);
  const [color, setColor] = useState<'white' | 'red'>('white');
  const [useTorch, setUseTorch] = useState(native.isAndroid());
  const [beep, setBeep] = useState(false);
  const snd = useSound();
  const android = native.isAndroid();
  return (
    <Section id="sos" title="SOS ışık ve ses" sub="Sakin olun. Işık ve sesle yerinizi gösterin; şebeke ve internet gerekmez.">
      <div class="sos-wrap">
        <button class="sos-big" data-testid="sos-start" onClick={() => setFlash('sos')}>
          <SvgI d={I_LIGHT} size={40} />
          <b>SOS</b>
          <span>Işığı başlat</span>
        </button>
        <a class="sos-call" href="tel:112">
          <SvgI d={I_PHONE} size={18} />
          Telefon çekiyorsa 112'yi arayın
        </a>

        <div class="sos-tiles">
          <div class="sos-tile" aria-disabled={!android}>
            <SvgI d={I_TORCH} />
            <span id="sos-torch-l">
              Telefon
              <br />
              flaşı
            </span>
            <button
              type="button"
              class="sw"
              role="switch"
              data-testid="sos-torch"
              aria-labelledby="sos-torch-l"
              aria-checked={useTorch}
              disabled={!android}
              onClick={() => setUseTorch(!useTorch)}
            />
          </div>
          <div class="sos-tile">
            <SvgI d={I_BEEP} />
            <span id="sos-beep-l">
              Işıkla
              <br />
              bip sesi
            </span>
            <button type="button" class="sw" role="switch" data-testid="sos-beep" aria-labelledby="sos-beep-l" aria-checked={beep} onClick={() => setBeep(!beep)} />
          </div>
          <button class="sos-tile" data-testid="sos-steady" onClick={() => setFlash('steady')}>
            <SvgI d={I_LIGHT} />
            <span>
              Sürekli ışık
              <br />
              (el feneri)
            </span>
            <span class="sos-tile-go" aria-hidden="true">
              Aç ›
            </span>
          </button>
        </div>

        <div class="sos-seg" role="group" aria-label="Ekran rengi">
          <button data-testid="sos-color-white" aria-pressed={color === 'white'} onClick={() => setColor('white')}>
            Beyaz ekran
          </button>
          <button data-testid="sos-color-red" aria-pressed={color === 'red'} onClick={() => setColor('red')}>
            Kırmızı ekran
          </button>
        </div>
        {!android && <p class="cm-note">Telefon flaşı yalnızca Android uygulamasında kullanılabilir; tarayıcıda ekran ışığı kullanılır.</p>}

        <h2 class="sos-head">Ses</h2>
        <div class="sos-row2">
          <button class="sos-btn" data-testid="sos-whistle" aria-pressed={snd.kind === 'whistle'} onClick={() => snd.start('whistle')}>
            <SvgI d={I_WHISTLE} />
            {snd.kind === 'whistle' ? 'Düdüğü durdur' : 'Düdük'}
            <small>Üç kısa ses</small>
          </button>
          <button class="sos-btn" data-testid="sos-siren" aria-pressed={snd.kind === 'siren'} onClick={() => snd.start('siren')}>
            <SvgI d={I_SIREN} />
            {snd.kind === 'siren' ? 'Sireni durdur' : 'Siren'}
            <small>Sürekli, yükselip alçalan</small>
          </button>
        </div>
        <p class="cm-note">
          Ses düzeyini ve ekran parlaklığını sonuna kadar açın. Gece en iyi görünen beyaz ışıktır. SOS: üç kısa, üç uzun, üç kısa. Yanıp sönen ışık içerir. Enkaz altındaysanız sesi
          aralıklı kullanın, pili ve nefesinizi koruyun; yakında ses duyarsanız vurarak ya da düdükle karşılık verin.
        </p>
      </div>
      {flash && <FlashOverlay mode={flash} color={color} torch={useTorch && android} sound={beep} onClose={() => setFlash(null)} />}
    </Section>
  );
}

export function Mors() {
  const [input, setInput] = useState('SOS');
  const [playing, setPlaying] = useState<'light' | 'sound' | null>(null);
  const [lit, setLit] = useState(false);
  const [wpm, setWpm] = useState(10);
  const [full, setFull] = useState(false);
  const p = useRef<Player | null>(null);
  const isMorse = looksLikeMorse(input);
  const conv = isMorse ? morseToText(input) : textToMorse(input);
  const morse = isMorse ? input.trim() : (conv as { morse: string }).morse;
  const output = isMorse ? (conv as { text: string }).text : morse;
  const stop = () => {
    p.current?.stop();
    p.current = null;
    setPlaying(null);
  };
  useEffect(() => stop, []);
  const start = (how: 'light' | 'sound') => {
    stop();
    if (!morse) return;
    const torch = how === 'light' && native.isAndroid();
    p.current = play({
      steps: morseToSteps(morse),
      unitMs: how === 'light' ? LIGHT_UNIT : unitMs(wpm),
      sound: how === 'sound' ? 'tone' : null,
      toneHz: 700,
      torch,
      onChange: setLit,
      onEnd: () => setPlaying(null),
    });
    setPlaying(how);
  };
  return (
    <Section id="mors" title="Mors çevirici" sub="Metni Mors koduna, Mors kodunu metne çevirir. Işık ya da ses olarak gönderin.">
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <label class="cm-field">
          <span class="label">Metin ya da Mors (. ve - ; kelime arası /)</span>
          <textarea class="input" data-testid="morse-input" value={input} maxLength={300} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} />
        </label>
        <span class="label">{isMorse ? 'Metin' : 'Mors'}</span>
        <p class="cm-mono" data-testid="morse-output" aria-live="polite">
          {output || '—'}
        </p>
        {conv.unknown.length > 0 && (
          <p class="cm-note" data-testid="morse-unknown">
            Çevrilemeyen: {conv.unknown.join(' ')}
          </p>
        )}
        <p class="cm-note">Ç, Ğ, İ, Ö, Ş, Ü uluslararası tabloda yoktur; C, G, I, O, S, U olarak gönderilir.</p>
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <div
            data-testid="morse-lamp"
            data-on={lit ? '1' : '0'}
            aria-hidden="true"
            style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0, background: lit ? '#fff7d6' : '#222831', boxShadow: lit ? '0 0 24px #f5a524' : 'none', border: '1px solid var(--line3)' }}
          />
          <label class="cm-field" style="flex:1">
            <span class="label">Ses hızı: {wpm} kelime/dk</span>
            <input type="range" min={5} max={20} value={wpm} data-testid="morse-wpm" aria-label="Ses hızı" onInput={(e) => setWpm(Number((e.target as HTMLInputElement).value))} />
          </label>
        </div>
        <div class="cm-btns">
          <button class="btn primary" data-testid="morse-play-light" disabled={!morse} onClick={() => (playing === 'light' ? stop() : start('light'))}>
            {playing === 'light' ? 'Durdur' : 'Işıkla gönder'}
          </button>
          <button class="btn primary" data-testid="morse-play-sound" disabled={!morse} onClick={() => (playing === 'sound' ? stop() : start('sound'))}>
            {playing === 'sound' ? 'Durdur' : 'Sesle gönder'}
          </button>
        </div>
        <button class="btn" data-testid="morse-fullscreen" disabled={!morse} onClick={() => (stop(), setFull(true))}>
          Tam ekran ışıkla gönder (tekrarlı)
        </button>
        <p class="cm-note">Zamanlama ITU standardı: nokta 1, çizgi 3 birim; harf arası 3, kelime arası 7 birim. Işıkta birim 0,25 sn{native.isAndroid() ? '; telefon flaşı da yanar' : ''}.</p>
      </div>
      {full && <FlashOverlay mode="morse" morse={morse} color="white" torch={native.isAndroid()} sound={false} onClose={() => setFull(false)} />}
    </Section>
  );
}

const TEMPLATES: TemplateId[] = ['iyiyim', 'acil112', 'yardim'];

export function Sms() {
  const [p, update] = useProfile();
  const geo = useGeo();
  const [tpl, setTpl] = useState<TemplateId>('iyiyim');
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');
  const [people, setPeople] = useState('');
  /** Elle düzenleme, üzerine yazıldığı şablon metnine bağlıdır: şablon/alanlar değişince düşer */
  const [edited, setEdited] = useState<{ base: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const generated = buildTemplate(tpl, { name: p.name, place, note, people, pos: geo.pos });
  const body = edited && edited.base === generated ? edited.text : generated;
  const parts = smsParts(body);
  const fam = cleanPhone(p.family);
  const ios = isIOS();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <Section id="sms" title="Hazır SMS" sub="İnternet yokken de kısa mesaj çoğu zaman gider. Konumunuz eklenmiş hazır metinler.">
      <div class="cm-chips" role="group" aria-label="Şablon">
        {TEMPLATES.map((t) => (
          <button key={t} class="cm-chip" data-testid={'sms-template-' + t} aria-pressed={tpl === t} onClick={() => setTpl(t)}>
            {TEMPLATE_TITLE[t]}
          </button>
        ))}
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <NameField />
        <label class="cm-field">
          <span class="label">{tpl === 'acil112' ? 'Adres / tarif' : 'Bulunduğunuz yer'}</span>
          <input class="input" data-testid="sms-place" value={place} maxLength={120} placeholder={tpl === 'acil112' ? 'Mahalle, sokak, bina, kat' : 'Ör. okul bahçesi, toplanma alanı'} onInput={(e) => setPlace((e.target as HTMLInputElement).value)} />
        </label>
        <label class="cm-field">
          <span class="label">{tpl === 'iyiyim' ? 'Ek not (isteğe bağlı)' : 'Ne oldu / ne lazım'}</span>
          <input class="input" data-testid="sms-note" value={note} maxLength={160} placeholder={tpl === 'iyiyim' ? 'Ör. Çocuklar yanımda' : 'Ör. Enkaz altında 2 kişi var'} onInput={(e) => setNote((e.target as HTMLInputElement).value)} />
        </label>
        {tpl === 'acil112' && (
          <label class="cm-field">
            <span class="label">Kişi sayısı</span>
            <input class="input" data-testid="sms-people" inputMode="numeric" value={people} maxLength={10} onInput={(e) => setPeople((e.target as HTMLInputElement).value)} />
          </label>
        )}
        <GeoButton geo={geo} testid="sms-geo" />
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:10px">
        <span class="label" id="sms-text-l">Mesaj (düzenleyebilirsiniz)</span>
        <textarea class="input" aria-labelledby="sms-text-l" data-testid="sms-text" value={body} onInput={(e) => setEdited({ base: generated, text: (e.target as HTMLTextAreaElement).value })} style="min-height:120px" />
        <span class="cm-note" data-testid="sms-count">
          {parts.chars} karakter · yaklaşık {parts.parts} SMS{parts.unicode ? ' (Türkçe karakterler SMS başına 70 karakter)' : ''}
        </span>
        <label class="cm-field">
          <span class="label">Aile / yakın numarası</span>
          <input class="input" data-testid="sms-family" type="tel" inputMode="tel" value={p.family} placeholder="05xx xxx xx xx" onInput={(e) => update({ family: (e.target as HTMLInputElement).value })} />
        </label>
        <div class="cm-btns">
          {fam ? (
            <a class="btn primary" data-testid="sms-send-family" href={smsHref(fam, body, ios)}>
              Aileye SMS
            </a>
          ) : null}
          <a class="btn" data-testid="sms-send-other" href={smsHref('', body, ios)}>
            Başka numaraya
          </a>
          <button class="btn" data-testid="sms-copy" onClick={copy}>
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>
        </div>
        {tpl === 'acil112' && (
          <p class="cm-note" data-testid="sms-112-note">
            112 Türkiye'de tek acil çağrı numarasıdır. 112'ye SMS ulaşmayabilir: mümkünse <a href="tel:112" data-testid="sms-call-112">112'yi arayın</a> ve bu metni okuyun; arama bağlanmazsa
            mesajı yakınınıza gönderip 112'ye bildirmesini isteyin.
          </p>
        )}
        <p class="cm-note">AFAD önerisi: afet sonrası hayati durumlar dışında arama yapmayın, SMS kullanın.</p>
      </div>
    </Section>
  );
}
