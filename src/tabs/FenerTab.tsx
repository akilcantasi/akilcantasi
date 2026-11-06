import { Fragment } from 'preact';
// Fener — çevrimdışı asistan. Soruyu önce rehberlerde ve Vikipedi'de arar;
// cihazda model varsa kaynaklara dayalı cevap üretir, yoksa doğrudan
// rehberden yanıt verir. Konuşma modül düzeyinde tutulur (sekme değişince kaybolmaz).
import { memo } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { go, setState, useAppState, getState } from '../lib/store';
import { IconChip, IconFener, IconSend, IconWarn } from '../icons';
import { formatSize } from '../lib/packs';
import { assemblePrompt, cleanAnswer, contextBudget, retrieve, type ChatMsg, type FenerSource, type PendingContext } from '../lib/fener/rag';
import { fallbackAnswer, type FallbackReason } from '../lib/fener/fallback';
import {
  describeError,
  engine,
  isContextOverflow,
  pickModel,
  unsupportedReason,
  canRunNative,
  type ModelChoice,
  type PromptProfile,
} from '../lib/fener/engine';
import { cancelVoice, refreshVoiceAvailability, startVoice, stopVoice, voice } from '../lib/voice/stt';
import { formatElapsed, isBusy as voiceBusy, MAX_RECORD_MS, type VoiceState } from '../lib/voice/state';
import { initTts, speak, stopSpeaking, tts, type TtsState } from '../lib/voice/tts';
import { Art } from '../art';
import { guideThumb } from '../content/guide-art';
import { ModelPanel } from './FenerModels';
import { copyText, formatLines, plainText } from '../lib/fener/format';
import { sohbetiYaz, sohbetiYukle, type BotMsg, type Msg, type UserMsg } from '../lib/fener/sohbet-kayit';
import './fener.css';
import { useGeriKapat } from '../gecmis';

export const QUICK_QUESTIONS = [
  'Enkaz altındaysam ne yapmalıyım?',
  'Kanaması olan birine nasıl ilk yardım yaparım?',
  'Suyu nasıl içilebilir hâle getiririm?',
  'Artçı depremde ne yapmalıyım?',
];

// --- Modül düzeyinde konuşma deposu -------------------------------------------------
// Sohbet ve yazılmakta olan soru localStorage'a da yazılır (sohbet-kayit.ts): Android arka
// plandaki uygulamayı kapatıp yeniden açtığında sohbet kaldığı yerden sürer (12 saat).
const kayit = sohbetiYukle();
let conv: Msg[] = kayit?.msgs ?? [];
/** Giriş kutusundaki yazı (bileşen yeniden kurulsa da, uygulama kapansa da korunur) */
let draft = kayit?.input ?? '';
let busy = false;
let abortCtl: AbortController | null = null;
let nextId = conv.reduce((n, m) => Math.max(n, m.id), 0) + 1;
const convListeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;
function saveNow() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  sohbetiYaz(conv, draft);
}
/** Akış sırasında her token yazılmasın: en geç ~1 sn'de bir */
function scheduleSave() {
  if (!saveTimer) saveTimer = setTimeout(saveNow, 1000);
}
// Arka plana geçerken hemen yaz: Android süreci bu andan sonra uyarmadan kapatabilir
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveNow();
  });
  window.addEventListener('pagehide', saveNow);
}
const emit = () => {
  scheduleSave();
  convListeners.forEach((l) => l());
};
function setDraft(v: string) {
  if (v === draft) return;
  draft = v;
  scheduleSave();
}

function patchBot(id: number, p: Partial<BotMsg>) {
  conv = conv.map((m) => (m.id === id && m.role === 'bot' ? { ...m, ...p } : m));
  emit();
}

function historyForModel(): ChatMsg[] {
  const out: ChatMsg[] = [];
  for (const m of conv) {
    if (m.role === 'user') out.push({ role: 'user', content: m.text });
    else if (m.phase === 'done' && m.text && m.fromModel && !m.interrupted) out.push({ role: 'assistant', content: m.text });
  }
  return out;
}

export function resetConversation() {
  abortCtl?.abort();
  conv = [];
  emit();
  // Kayıt hemen silinsin (yazılmakta olan soru kalır)
  saveNow();
}

/** Yarım kalan cevabı yeniden sor: yarım soru-cevap çıkarılır, soru yeniden gönderilir */
function retryInterrupted(id: number) {
  if (busy) return;
  const i = conv.findIndex((m) => m.id === id);
  const m = conv[i];
  if (!m || m.role !== 'bot') return;
  const prev = conv[i - 1];
  const drop = new Set([m.id]);
  if (prev?.role === 'user' && prev.text === m.question) drop.add(prev.id);
  conv = conv.filter((x) => !drop.has(x.id));
  emit();
  void send(m.question, m.questionContext ?? null, { free: !!m.freeAsked });
}

export function stopGeneration() {
  abortCtl?.abort();
}

/** Profil için KAYNAKLAR bütçesi (karakter): n_ctx'e sığan ile profil üst sınırının küçüğü */
export function budgetFor(p: PromptProfile, divisor = 1): number {
  const fit = contextBudget(p.nCtx, p.maxTokens, p.historyChars);
  return Math.floor((p.maxContextChars ? Math.min(fit, p.maxContextChars) : fit) / divisor);
}

async function send(text: string, context?: PendingContext | null, opts: { free?: boolean } = {}) {
  const q = text.trim();
  if (!q || busy) return;
  busy = true;
  // Kendi bilgisiyle yeniden sorarken önceki (kaynaklı) cevabı görmesin; yoksa onu tekrarlar
  const history = opts.free ? [] : historyForModel();
  const userMsg: UserMsg = { id: nextId++, role: 'user', text: q, contextTitle: context?.title };
  const bot: BotMsg = {
    id: nextId++,
    role: 'bot',
    text: '',
    phase: 'search',
    progress: null,
    sources: [],
    critical: false,
    topGuideId: null,
    topGuideTitle: null,
    question: q,
    questionContext: context ?? null,
    freeAsked: !!opts.free || undefined,
  };
  conv = [...conv, userMsg, bot];
  emit();
  const ctl = new AbortController();
  abortCtl = ctl;

  try {
    // Model (varsa) arama derinliğini ve istemi belirler; pil tasarrufunda model aranmaz
    let model: ModelChoice | null = null;
    if (!getState().batterySaver) {
      try {
        model = await pickModel();
      } catch {
        model = null;
      }
    }
    const prof = model?.profile;
    const r = await retrieve(q, { context, maxGuides: prof?.maxGuides, maxArticles: prof?.maxArticles, articleChars: prof?.articleChars });
    patchBot(bot.id, {
      critical: r.critical,
      topGuideId: r.topGuideId,
      topGuideTitle: r.guides[0]?.guide.title ?? null,
    });

    const useFallback = (reason: FallbackReason, error?: string) => {
      const fb = fallbackAnswer(r, reason);
      patchBot(bot.id, { text: fb.text, label: fb.label, sources: fb.sources, phase: 'done', error });
    };

    if (ctl.signal.aborted) return useFallback('stopped');
    if (getState().batterySaver) return useFallback('battery');
    if (!model) return useFallback('no-model');
    // Yerel motorla açılacak modelde WebAssembly desteği aranmaz
    if (!canRunNative(model) && unsupportedReason()) return useFallback('unsupported');

    const pp = model.profile;
    const prompt = assemblePrompt(r, { history, free: opts.free, rich: pp.rich, maxContextChars: budgetFor(pp), maxHistoryChars: pp.historyChars });
    patchBot(bot.id, {
      sources: prompt.sources,
      free: prompt.free,
      label: prompt.free
        ? opts.free
          ? "Fener'in kendi bilgisi — kaynak kullanılmadı, doğrulayın"
          : "Uygun rehber bulunamadı — Fener'in kendi bilgisi, doğrulayın"
        : undefined,
      phase: engine.isLoaded() ? 'write' : 'load',
      progress: null,
    });
    try {
      // Yükleme (büyük modelde dakikalar sürebilir) "Durdur"u beklemesin: durdurulunca hemen
      // rehberden yanıt verilir; yükleme arkada sürer, model bir sonraki soruya hazır olur.
      const load = engine.ensureLoaded(model, (f) => {
        if (!ctl.signal.aborted) patchBot(bot.id, { progress: f });
      });
      const stopped = new Promise<'stopped'>((res) => {
        if (ctl.signal.aborted) res('stopped');
        else ctl.signal.addEventListener('abort', () => res('stopped'), { once: true });
      });
      if ((await Promise.race([load, stopped])) === 'stopped') {
        load.catch(() => {});
        return useFallback('stopped');
      }
    } catch (e: any) {
      return useFallback(e?.unsupported ? 'unsupported' : 'error', e?.unsupported ? undefined : describeError(e));
    }
    if (ctl.signal.aborted) return useFallback('stopped');
    patchBot(bot.id, { phase: 'write' });

    let out = '';
    try {
      // İstem modelin bağlamına sığmazsa (tokenizer'a göre değişir) kaynakları
      // kısaltıp geçmişi atarak yeniden dene.
      let res!: Awaited<ReturnType<typeof engine.chat>>;
      let messages = prompt.messages;
      for (let attempt = 0; ; attempt++) {
        try {
          res = await engine.chat(messages, {
            signal: ctl.signal,
            onToken: (_p, full) => {
              out = full;
              patchBot(bot.id, { text: cleanAnswer(full) });
            },
          });
          break;
        } catch (e) {
          if (attempt >= 2 || out || !isContextOverflow(e)) throw e;
          const smaller = assemblePrompt(r, { maxContextChars: budgetFor(pp, 2 << attempt), free: opts.free, rich: pp.rich });
          messages = smaller.messages;
          patchBot(bot.id, { sources: smaller.sources });
        }
      }
      res = { ...res, text: cleanAnswer(res.text) };
      out = res.text;
      if (!res.text.trim() && !res.aborted) {
        // Model boş döndüyse yine de rehberden yardım et
        const fb = fallbackAnswer(r, 'error');
        patchBot(bot.id, {
          text: fb.text,
          label: fb.label,
          sources: fb.sources,
          phase: 'done',
          error: 'Model boş yanıt verdi.',
        });
        return;
      }
      patchBot(bot.id, { text: res.text, phase: 'done', aborted: res.aborted, tps: res.tokensPerSec, fromModel: true });
    } catch (e) {
      if (out.trim()) patchBot(bot.id, { phase: 'done', error: describeError(e), fromModel: true });
      else useFallback('error', describeError(e));
    }
  } catch (e) {
    patchBot(bot.id, { phase: 'done', error: describeError(e) });
  } finally {
    busy = false;
    if (abortCtl === ctl) abortCtl = null;
    emit();
  }
}

function useConversation() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    convListeners.add(l);
    return () => {
      convListeners.delete(l);
    };
  }, []);
  return { conv, busy };
}

function useEngineState() {
  const [s, set] = useState(engine.getState());
  useEffect(() => engine.subscribe(set), []);
  return s;
}

// --- Bileşenler -------------------------------------------------------------------
/** Model cevabı: **kalın** ve madde işaretleri düzgün görünsün (HTML üretmeden). */
function RichText({ text }: { text: string }) {
  const lines = formatLines(text);
  return (
    <>
      {lines.map((spans, i) => (
        <Fragment key={i}>
          {spans.map((s, j) => (s.bold ? <strong key={j}>{s.text}</strong> : s.text))}
          {i < lines.length - 1 ? '\n' : null}
        </Fragment>
      ))}
    </>
  );
}

function SourceTags({ sources }: { sources: FenerSource[] }) {
  if (!sources.length) return null;
  return (
    <div class="fener-sources" aria-label="Kaynaklar">
      {sources.map((s) => {
        const kindLabel = s.kind === 'rehber' ? 'Rehber' : s.kind === 'vikipedi' ? s.label || 'Vikipedi' : 'Bağlam';
        const onClick =
          s.kind === 'rehber' && s.id
            ? () => go.guide(s.id!)
            : s.kind === 'vikipedi' && s.path
              ? () => go.article(s.path!)
              : undefined;
        return (
          <button
            key={s.n + s.title}
            type="button"
            class={'tag fener-tag fener-tag-' + s.kind}
            data-testid="fener-source"
            data-kind={s.kind}
            disabled={!onClick}
            onClick={onClick}
            title={onClick ? kindLabel + ' kaynağını aç' : undefined}
          >
            <span class="fener-tag-n">{s.n}</span>
            <span class="fener-tag-kind">{kindLabel}</span>
            <span class="fener-tag-title">{s.title}</span>
          </button>
        );
      })}
    </div>
  );
}

function Thinking({ m, eng }: { m: BotMsg; eng: ReturnType<typeof useEngineState> }) {
  let text = "Rehberlerde ve Vikipedi'de aranıyor…";
  if (m.phase === 'load') {
    const pct = m.progress != null ? ` %${Math.round(m.progress * 100)}` : '';
    text = `Fener yazıyor… model yükleniyor${pct}`;
  } else if (m.phase === 'write') text = 'Fener yazıyor…';
  return (
    <div class="fener-thinking" role="status" data-testid="fener-thinking">
      <span class="fener-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>{text}</span>
      {m.phase === 'load' && (
        <div class="progress fener-progress">
          <div style={{ width: `${Math.round((m.progress ?? 0.05) * 100)}%` }} />
        </div>
      )}
      {m.phase === 'load' && eng.model?.size ? <span class="muted mono fener-small">{formatSize(eng.model.size)}</span> : null}
    </div>
  );
}

function BotBubbleView({ m, eng, canFree, busyNow, ttsState }: { m: BotMsg; eng: ReturnType<typeof useEngineState>; canFree: boolean; busyNow: boolean; ttsState: TtsState }) {
  const streaming = m.phase !== 'done';
  return (
    <div class="fener-msg fener-msg-bot" data-testid="fener-msg-bot" data-phase={m.phase} aria-busy={streaming}>
      <div class="fener-avatar" aria-hidden="true">
        <IconFener size={16} color="#0B0E13" />
      </div>
      <div class="fener-bubble card">
        {m.critical && (
          <div class="fener-critical" data-testid="fener-critical" role="alert">
            <div class="row">
              <IconWarn size={18} />
              <strong class="grow">Hayati durum olabilir: önce 112'yi arayın</strong>
            </div>
            <a class="btn fener-call" href="tel:112">
              112'yi ara
            </a>
          </div>
        )}
        {m.topGuideId && (
          <button type="button" class="fener-guide-btn" data-testid="fener-verify" onClick={() => go.guide(m.topGuideId!)}>
            <Art id={guideThumb(m.topGuideId)} />
            <span class="fener-guide-btn-body">
              <span class="fener-guide-btn-k">{streaming ? 'Adım adım rehber' : m.fromModel ? 'Doğrulanmış adımlar' : 'Rehberin tamamı'}</span>
              <span class="fener-guide-btn-t">{m.topGuideTitle ?? 'Rehberi aç'}</span>
              <span class="fener-guide-btn-go">Rehberi aç →</span>
            </span>
          </button>
        )}
        {m.label && (
          <div class="fener-label mono" data-testid="fener-label">
            {m.label}
          </div>
        )}
        {m.text ? (
          <div class={'fener-text' + (streaming ? ' streaming' : '')} data-testid="fener-text">
            <RichText text={m.text} />
          </div>
        ) : null}
        {streaming && <Thinking m={m} eng={eng} />}
        {m.interrupted && (
          <div class="fener-yarim" data-testid="fener-interrupted" role="status">
            <span class="grow">
              {m.text ? 'Cevap yarım kaldı' : 'Cevap yazılamadı'}: uygulama arka plandayken kapandı.
            </span>
            <button type="button" class="btn fener-retry" data-testid="fener-retry" disabled={busyNow} onClick={() => retryInterrupted(m.id)}>
              Yeniden sor
            </button>
          </div>
        )}
        {m.aborted && <div class="warn">(durduruldu)</div>}
        {m.error && <div class="fener-error">{m.error}</div>}
        {m.phase === 'done' && <SourceTags sources={m.sources} />}
        {m.phase === 'done' && (
          <div class="row fener-foot">
            {canFree && !m.free && !m.interrupted ? (
              <button type="button" class="btn fener-free" data-testid="fener-free" disabled={busyNow} onClick={() => void send(m.question, m.questionContext ?? null, { free: true })}>
                Fener kendi bilgisiyle cevaplasın
              </button>
            ) : !m.topGuideId ? (
              <button type="button" class="link-btn" data-testid="fener-browse" onClick={() => go.category(null)}>
                Rehberlere göz at
              </button>
            ) : null}
            {/* Sağdaki grup birlikte kalır; satır kırılınca da sağa yaslı */}
            <span class="fener-foot-r">
              {m.text ? <CopyButton text={copyText(m.text, m.sources)} /> : null}
              {m.text && ttsState.supported ? <SpeakButton id={m.id} text={plainText(m.text)} speaking={ttsState.speakingId === m.id} /> : null}
            </span>
          </div>
        )}
        {m.phase === 'done' && m.fromModel && (
          <div class="fener-disclaimer">
            <span>Yapay zekâ hata yapabilir. Hayati durumda rehberdeki adımlara uyun.</span>
            {m.tps ? <span class="mono fener-small fener-tps">{m.tps.toFixed(1).replace('.', ',')} token/sn</span> : null}
          </div>
        )}
      </div>
    </div>
  );
}

// Akış sırasında her token yalnızca son baloncuğu yeniden çizsin (uzun sohbette yavaşlamasın):
// patchBot değişmeyen mesajların nesnesini korur, motor durumu da token başına değişmez.
const BotBubble = memo(BotBubbleView);

type Mode = { kind: 'checking' } | { kind: 'model'; model: ModelChoice } | { kind: 'guide'; why: string };

// --- Küçük satır içi ikonlar (src/icons.tsx ile aynı çizgi stili) ---------------------
const svgBase = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
  'aria-hidden': 'true' as const,
});
const IconMic = ({ size = 20 }: { size?: number }) => (
  <svg {...svgBase(size)}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </svg>
);
const IconStopSq = ({ size = 18 }: { size?: number }) => (
  <svg {...svgBase(size)}>
    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
  </svg>
);
const IconSpeaker = ({ size = 16 }: { size?: number }) => (
  <svg {...svgBase(size)}>
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M16 9a4 4 0 0 1 0 6" />
    <path d="M18.5 6.5a8 8 0 0 1 0 11" />
  </svg>
);
const IconCopy = ({ size = 16 }: { size?: number }) => (
  <svg {...svgBase(size)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
);
const IconCaret = ({ size = 14, open }: { size?: number; open?: boolean }) => (
  <svg {...svgBase(size)} style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

function useVoiceState() {
  const [s, set] = useState<VoiceState>(voice.getState());
  useEffect(() => voice.subscribe(set), []);
  return s;
}
function useTtsState() {
  const [s, set] = useState<TtsState>(tts.getState());
  useEffect(() => {
    initTts();
    set(tts.getState());
    return tts.subscribe(set);
  }, []);
  return s;
}

/** Panoya yazar; güvenli olmayan bağlantıda (http bilgi noktası) eski yönteme düşer */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyButton({ text }: { text: string }) {
  const [st, setSt] = useState<'idle' | 'ok' | 'fail'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  return (
    <button
      type="button"
      class={'btn fener-speak' + (st === 'ok' ? ' on' : '')}
      data-testid="fener-copy"
      data-state={st}
      aria-label={st === 'ok' ? 'Cevap kopyalandı' : st === 'fail' ? 'Kopyalanamadı' : 'Cevabı kopyala'}
      onClick={async () => {
        const ok = await writeClipboard(text);
        setSt(ok ? 'ok' : 'fail');
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setSt('idle'), 2000);
      }}
    >
      <IconCopy />
      <span aria-live="polite">{st === 'ok' ? 'Kopyalandı' : st === 'fail' ? 'Kopyalanamadı' : 'Kopyala'}</span>
    </button>
  );
}

function SpeakButton({ id, text, speaking }: { id: number; text: string; speaking: boolean }) {
  return (
    <button
      type="button"
      class={'btn fener-speak' + (speaking ? ' on' : '')}
      data-testid="fener-speak"
      data-speaking={String(speaking)}
      aria-pressed={speaking}
      aria-label={speaking ? 'Sesli okumayı durdur' : 'Cevabı sesli oku'}
      onClick={() => (speaking ? stopSpeaking() : void speak(id, text))}
    >
      {speaking ? <IconStopSq size={14} /> : <IconSpeaker />}
      <span>{speaking ? 'Durdur' : 'Sesli oku'}</span>
    </button>
  );
}


function VoiceButton({ vs, disabled, onInfo }: { vs: VoiceState; disabled: boolean; onInfo: () => void }) {
  const recording = vs.phase === 'recording';
  const working = vs.phase === 'loading' || vs.phase === 'transcribing' || vs.phase === 'requesting';
  const unavailable = vs.phase === 'unavailable';
  const label = recording
    ? 'Kaydı bitir ve yazıya çevir'
    : working
      ? 'Sesli soruyu iptal et'
      : unavailable
        ? 'Sesli soru kullanılamıyor'
        : 'Sesli sor';
  return (
    <button
      type="button"
      class={'btn fener-mic' + (recording ? ' rec' : '') + (working ? ' busy' : '') + (unavailable ? ' off' : '')}
      data-testid="fener-mic"
      data-phase={vs.phase}
      aria-label={label}
      title={label}
      aria-pressed={recording}
      disabled={disabled && !recording && !working}
      style={recording ? { '--lvl': String(0.15 + vs.level * 0.85) } : undefined}
      onClick={() => {
        if (unavailable) return onInfo();
        if (recording) return void stopVoice();
        if (working) return cancelVoice();
        onInfo();
      }}
    >
      {recording ? <IconStopSq /> : working ? <span class="fener-spin" aria-hidden="true" /> : <IconMic />}
    </button>
  );
}

function VoiceNote({ vs, onDismiss }: { vs: VoiceState; onDismiss: () => void }) {
  let text: string | null = null;
  let kind = 'info';
  if (vs.phase === 'requesting') text = 'Mikrofon açılıyor…';
  else if (vs.phase === 'recording') text = `Dinleniyor ${formatElapsed(vs.elapsed)} / ${formatElapsed(MAX_RECORD_MS)} — bitince kare düğmeye basın`;
  else if (vs.phase === 'loading') text = `Ses modeli yükleniyor${vs.progress != null ? ` %${Math.round(vs.progress * 100)}` : '…'}`;
  else if (vs.phase === 'transcribing') text = 'Konuşma yazıya çevriliyor…';
  else if (vs.phase === 'error') {
    text = vs.error;
    kind = 'error';
  } else if (vs.phase === 'unavailable') {
    text = vs.reason;
    kind = 'warn';
  }
  if (!text) return null;
  const dismissable = vs.phase === 'error' || vs.phase === 'unavailable';
  return (
    <div class={'fener-voice-note ' + kind} data-testid="fener-voice-note" data-phase={vs.phase} role={kind === 'error' ? 'alert' : 'status'}>
      {vs.phase === 'recording' && (
        <span class="fener-rec-dot" aria-hidden="true" style={{ transform: `scale(${0.7 + vs.level * 0.8})` }} />
      )}
      <span class="grow">{text}</span>
      {vs.phase === 'unavailable' && /paket/i.test(text) && (
        <button type="button" class="link-btn" data-testid="fener-voice-get" onClick={() => go.tool('paylas')}>
          Paket ekle
        </button>
      )}
      {dismissable && (
        <button type="button" class="link-btn" data-testid="fener-voice-dismiss" aria-label="Uyarıyı kapat" onClick={onDismiss}>
          Kapat
        </button>
      )}
    </div>
  );
}

export function FenerTab() {
  const app = useAppState();
  const { conv: msgs, busy: isBusy } = useConversation();
  const eng = useEngineState();
  const vs = useVoiceState();
  const ttsState = useTtsState();
  const [input, setInputState] = useState(draft);
  // Yazı modül düzeyinde de tutulur ve kaydedilir (uygulama kapanınca kaybolmasın)
  const setInput = (v: string | ((cur: string) => string)) =>
    setInputState((cur) => {
      const n = typeof v === 'function' ? v(cur) : v;
      setDraft(n);
      return n;
    });
  const [mode, setMode] = useState<Mode>({ kind: 'checking' });
  const [panel, setPanel] = useState(false);
  // Model paneli açıkken geri tuşu önce paneli kapatır
  useGeriKapat(panel, () => setPanel(false));
  const [modelEpoch, setModelEpoch] = useState(0);
  const [voiceInfo, setVoiceInfo] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hangi modda çalışılacağını belirle (paketler / seçim değişince yeniden)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (app.batterySaver) return setMode({ kind: 'guide', why: 'Pil tasarrufu — rehber modu' });
      const m = await pickModel().catch(() => null);
      if (!alive) return;
      if (!m) return setMode({ kind: 'guide', why: 'Model yok — rehber modu' });
      if (!canRunNative(m) && unsupportedReason()) return setMode({ kind: 'guide', why: 'Cihaz desteklemiyor — rehber modu' });
      setMode({ kind: 'model', model: m });
    })();
    return () => {
      alive = false;
    };
  }, [app.packsVersion, app.batterySaver, modelEpoch]);

  // Ses paketi var mı?
  useEffect(() => {
    void refreshVoiceAvailability();
  }, [app.packsVersion]);

  // Sekmeden çıkınca okumayı ve kaydı durdur
  useEffect(
    () => () => {
      stopSpeaking();
      if (voiceBusy(voice.getState())) cancelVoice();
    },
    [],
  );

  // Dışarıdan gelen soru (harita / kütüphane "Fener'e sor")
  useEffect(() => {
    const pq = app.pendingQuestion;
    if (!pq || isBusy) return;
    setState({ pendingQuestion: null });
    void send(pq.text, pq.context ?? null);
  }, [app.pendingQuestion, isBusy]);

  // Kullanıcı en alttaysa (ya da yakınındaysa) yeni içerik onu aşağıda tutar; uzun bir cevabı
  // okumak için yukarı kaydırdıysa akan her token onu en alta geri çekmesin.
  const stick = useRef(true);
  const lastTop = useRef(0);
  const prevCount = useRef(msgs.length);
  const onListScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    // Liste kısalınca (klavye) da scroll olayı gelir; konum değişmediyse kullanıcı kaydırmamıştır
    if (atBottom || el.scrollTop !== lastTop.current) stick.current = atBottom;
    lastTop.current = el.scrollTop;
    el.dataset.stick = String(stick.current);
  };
  // Liste kısalınca (ör. telefonda klavye açılınca) en alttaysa en altta kalsın
  useEffect(() => {
    const el = listRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (stick.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Yeni içerikte en alta kaydır
  const last = msgs[msgs.length - 1];
  const lastLen = last ? (last.role === 'bot' ? last.text.length + last.phase : last.text.length) : 0;
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const added = msgs.length !== prevCount.current;
    prevCount.current = msgs.length;
    if (!added && !stick.current) return;
    // Rehberden (akışsız) gelen ya da hayati durum içeren uzun cevapta en alta değil
    // sorunun başına kaydır: 112 kutusu ve ilk adımlar görünsün.
    if (last?.role === 'bot' && last.phase === 'done' && (!last.fromModel || last.critical)) {
      const bot = el.lastElementChild as HTMLElement | null;
      const q = (bot?.previousElementSibling as HTMLElement | null) ?? bot;
      if (bot && q) {
        const top = el.getBoundingClientRect().top;
        const qTop = q.getBoundingClientRect().top - top + el.scrollTop;
        if (bot.getBoundingClientRect().bottom - top + el.scrollTop - qTop > el.clientHeight) {
          el.scrollTop = Math.max(0, qTop - 8);
          return;
        }
      }
    }
    el.scrollTop = el.scrollHeight;
  }, [msgs.length, lastLen]);

  const submit = (e?: Event) => {
    e?.preventDefault();
    if (isBusy || !input.trim()) return;
    const t = input;
    setInput('');
    stopSpeaking();
    // Panel açıkken liste gizli: cevap görünsün diye panel kapanır
    setPanel(false);
    void send(t);
  };

  const onMic = () => {
    if (vs.phase === 'unavailable') {
      setVoiceInfo((v) => !v);
      return;
    }
    setVoiceInfo(false);
    stopSpeaking();
    void startVoice((text) => {
      setInput((cur) => (cur.trim() ? cur.trim() + ' ' + text : text));
      setTimeout(() => inputRef.current?.focus(), 0);
    });
  };

  const model = mode.kind === 'model' ? mode.model : null;
  const statusText =
    mode.kind === 'checking' ? 'Model aranıyor…' : mode.kind === 'model' ? `Etkin model: ${mode.model.name}` : mode.why;
  const showNote = vs.phase !== 'idle' && (vs.phase !== 'unavailable' || voiceInfo);

  return (
    <div class={'fener' + (panel ? ' panel-open' : '')}>
      <div
        class="fener-bar"
        data-testid="fener-status"
        data-mode={mode.kind}
        data-model={model?.id ?? ''}
        data-manual={String(!!model?.manual)}
        data-engine={eng.status}
        data-threads={eng.threads}
        data-mt={String(eng.multithread)}
        data-isolated={String(eng.isolated)}
        data-backend={eng.backend ?? ''}
        data-gpu={String(eng.gpu)}
        title={
          model
            ? `Model cihazda çalışır, internet gerekmez. ${eng.status === 'ready' || eng.status === 'generating' ? `${eng.backend === 'yerel' ? (eng.gpu ? 'Yerel motor, GPU ile' : 'Yerel motor') + ', ' : ''}${eng.threads} iş parçacığı.` : ''}`
            : 'Yapay zekâ modeli olmadan, doğrulanmış rehberlerden yanıt verilir.'
        }
      >
        <span class={'fener-bar-icon' + (model ? ' on' : '')}>
          <IconChip size={16} />
        </span>
        <button
          type="button"
          class="grow fener-bar-text fener-bar-pick"
          data-testid="fener-model-btn"
          aria-expanded={panel}
          onClick={() => setPanel((v) => !v)}
        >
          <span class="fener-bar-model">
            <span class="fener-bar-name">{statusText}</span>
            <IconCaret open={panel} />
            <span class="sr-only">, modeli değiştir</span>
          </span>
          <span class="fener-bar-src mono" data-testid="fener-model-meta">
            {model
              ? [model.size ? formatSize(model.size) : null, model.parts.length > 1 ? `${model.parts.length} parça` : null, model.manual ? 'elle seçildi' : 'otomatik']
                  .filter(Boolean)
                  .join(' · ') + ' · Rehber + Vikipedi'
              : 'Kaynak: Rehber + Vikipedi'}
          </span>
        </button>
        {msgs.length > 0 && (
          <button
            type="button"
            class="btn fener-new"
            data-testid="fener-new"
            onClick={() => {
              stopSpeaking();
              resetConversation();
            }}
          >
            Yeni sohbet
          </button>
        )}
      </div>

      {panel && (
        <ModelPanel
          batterySaver={app.batterySaver}
          onChange={() => setModelEpoch((n) => n + 1)}
          onClose={() => {
            setPanel(false);
            setModelEpoch((n) => n + 1);
          }}
        />
      )}

      <div class="fener-list" ref={listRef} aria-live="polite" onScroll={onListScroll} data-testid="fener-list">
        {msgs.length === 0 && (
          <div class="fener-empty">
            <div class="fener-hero">
              <div class="fener-hero-icon">
                <IconFener size={26} color="#0B0E13" />
              </div>
              <div>
                <div class="fener-hero-title">Fener'e sorun</div>
                <p class="empty">
                  İnternet olmadan çalışır. Cevaplar cihazdaki rehberlere ve Vikipedi'ye dayanır.
                  Hayati bir durumda önce <strong>112</strong>'yi arayın.
                </p>
              </div>
            </div>
            <div class="label">Hızlı sorular</div>
            <div class="fener-suggests">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} type="button" class="list-btn" data-testid="fener-suggest" onClick={() => void send(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} class="fener-msg fener-msg-user" data-testid="fener-msg-user">
              <div class="fener-bubble-user">
                {m.contextTitle && <div class="fener-ctx mono">Bağlam: {m.contextTitle}</div>}
                {m.text}
              </div>
            </div>
          ) : (
            <BotBubble key={m.id} m={m} eng={eng} canFree={mode.kind === 'model'} busyNow={isBusy} ttsState={ttsState} />
          ),
        )}
      </div>

      {showNote && (
        <VoiceNote
          vs={vs}
          onDismiss={() => {
            setVoiceInfo(false);
            if (vs.phase === 'error') cancelVoice();
          }}
        />
      )}
      <form class="fener-input" onSubmit={submit}>
        <VoiceButton vs={vs} disabled={isBusy} onInfo={onMic} />
        <input
          ref={inputRef}
          class="input grow"
          data-testid="fener-input"
          placeholder={vs.phase === 'recording' ? 'Dinleniyor…' : "Fener'e bir soru yazın…"}
          aria-label="Fener'e soru"
          enterKeyHint="send"
          autoComplete="off"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
        />
        {isBusy && (
          <button type="button" class="btn fener-stop" data-testid="fener-stop" onClick={stopGeneration}>
            Durdur
          </button>
        )}
        <button
          type="submit"
          class="btn primary fener-send"
          data-testid="fener-send"
          aria-label="Gönder"
          disabled={isBusy || !input.trim()}
        >
          <IconSend size={20} />
        </button>
      </form>
    </div>
  );
}
