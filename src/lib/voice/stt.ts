// "Sesli sor": mikrofon kaydı → cihaz üstünde Whisper → metin. Tamamen çevrimdışı.
// Ses modeli bir 'ses' paketinden (Whisper ONNX dosyalarını içeren .tar) gelir;
// paket yoksa düğme "kullanılamaz" durumunda kalır ve nedenini söyler.
//
// Test/QA için sahte arka uç: sayfa yüklenmeden önce
//   window.__acSttMock = { text: 'Enkaz altındayım', delayMs: 300, loadMs: 300 }
// tanımlanırsa paket ve model gerekmez; kayıt yine gerçek getUserMedia ile yapılır
// (Playwright'ta getUserMedia da sahtelenebilir; bkz. e2e/fener-voice-check.mjs).
import { listPacks, openBlob, type InstalledPack } from '../packs';
import { getState } from '../store';
import { hasSpeech, micErrorMessage, micSupported, normalizePeak, startRecording, type Recorder } from './audio';
import { cleanTranscript, initialVoiceState, isBusy, MAX_RECORD_MS, voiceReducer, type VoiceEvent, type VoiceState } from './state';
import { readTarFiles } from './tar';
import { chooseVoicePack, planWhisperPack, voicePackName } from './whisper-pack';
import type { SttIn, SttOut } from './stt.worker';

export interface SttMock {
  text: string;
  delayMs?: number;
  loadMs?: number;
  /** true ise yazıya çevirme hata verir */
  fail?: boolean;
}

/** Arka uç arayüzü: gerçek (Worker + transformers.js) ya da sahte. */
export interface SttBackend {
  name: string;
  isReady(): boolean;
  load(onProgress: (f: number | null) => void): Promise<void>;
  transcribe(audio: Float32Array): Promise<string>;
  dispose(): void;
}

function mockFromWindow(): SttMock | null {
  const m = typeof window !== 'undefined' ? (window as any).__acSttMock : null;
  return m && typeof m.text === 'string' ? m : null;
}

export function mockBackend(m: SttMock): SttBackend {
  let ready = false;
  const wait = (ms = 0) => new Promise((r) => setTimeout(r, ms));
  return {
    name: 'Sahte ses modeli',
    isReady: () => ready,
    async load(onProgress) {
      onProgress(0.3);
      await wait(m.loadMs ?? 0);
      onProgress(1);
      ready = true;
    },
    async transcribe() {
      await wait(m.delayMs ?? 0);
      if (m.fail) throw new Error('sahte hata');
      return m.text;
    },
    dispose() {
      ready = false;
    },
  };
}

function workerBackend(pack: InstalledPack): SttBackend {
  let worker: Worker | null = null;
  let ready = false;
  let loading: Promise<void> | null = null;
  let seq = 0;
  const pending = new Map<number, { resolve: (t: string) => void; reject: (e: Error) => void }>();
  let onProg: ((f: number | null) => void) | null = null;
  let loadWait: { resolve: () => void; reject: (e: Error) => void } | null = null;

  const ensureWorker = () => {
    if (worker) return worker;
    worker = new Worker(new URL('./stt.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (ev: MessageEvent<SttOut>) => {
      const m = ev.data;
      if (m.type === 'progress') onProg?.(m.progress);
      else if (m.type === 'ready') {
        ready = true;
        loadWait?.resolve();
        loadWait = null;
      } else if (m.type === 'result') {
        pending.get(m.id)?.resolve(m.text);
        pending.delete(m.id);
      } else if (m.type === 'error') {
        const err = new Error(m.message);
        if (m.id != null && pending.has(m.id)) {
          pending.get(m.id)!.reject(err);
          pending.delete(m.id);
        } else {
          loadWait?.reject(err);
          loadWait = null;
        }
      }
    };
    worker.onerror = (ev) => {
      const err = new Error(ev.message || 'Ses işçisi başlatılamadı');
      loadWait?.reject(err);
      loadWait = null;
      pending.forEach((p) => p.reject(err));
      pending.clear();
    };
    return worker;
  };

  return {
    name: voicePackName(pack.id),
    isReady: () => ready,
    load(onProgress) {
      if (ready) return Promise.resolve();
      onProg = onProgress;
      loading ??= (async () => {
        onProgress(0);
        const blob = await openBlob(pack, (l, t) => onProgress(t ? (l / t) * 0.5 : null));
        const files = await readTarFiles(blob);
        const plan = planWhisperPack([...files.keys()]);
        if (plan.missing.length) throw new Error('Ses paketi eksik: ' + plan.missing.join(', '));
        const w = ensureWorker();
        const isolated = typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated;
        const threads = isolated ? Math.max(1, Math.min(4, navigator.hardwareConcurrency || 1)) : 1;
        await new Promise<void>((resolve, reject) => {
          loadWait = { resolve, reject };
          onProg = (f) => onProgress(f == null ? null : 0.5 + f * 0.5);
          const msg: SttIn = { type: 'load', files: Object.fromEntries(files), root: plan.root, dtype: plan.dtype, threads };
          w.postMessage(msg);
        });
        onProgress(1);
      })().catch((e) => {
        loading = null;
        throw e;
      });
      return loading;
    },
    transcribe(audio) {
      const w = ensureWorker();
      const id = ++seq;
      return new Promise<string>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        const msg: SttIn = { type: 'transcribe', id, audio, language: 'turkish' };
        w.postMessage(msg, [audio.buffer]);
      });
    },
    dispose() {
      ready = false;
      loading = null;
      try {
        worker?.postMessage({ type: 'dispose' } satisfies SttIn);
      } catch {}
      const w = worker;
      worker = null;
      setTimeout(() => w?.terminate(), 2000);
    },
  };
}

// --- Denetleyici (modül düzeyinde durum) ---------------------------------------------
let st: VoiceState = initialVoiceState;
let backend: SttBackend | null = null;
let backendKey = '';
let recorder: Recorder | null = null;
let ticker: ReturnType<typeof setInterval> | null = null;
let autoStop: ReturnType<typeof setTimeout> | null = null;
let level = 0;
let onText: ((t: string) => void) | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<(s: VoiceState) => void>();

/** Güncel evre (TS daraltmasına takılmamak için işlev) */
const phase = (): VoiceState['phase'] => st.phase;

function dispatch(e: VoiceEvent) {
  const next = voiceReducer(st, e);
  if (next === st) return;
  st = next;
  listeners.forEach((l) => l(st));
  if (typeof window !== 'undefined') (window as any).__fenerVoice = st;
}

export const voice = {
  getState: () => st,
  subscribe(l: (s: VoiceState) => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  /** Arka uç adı (ör. "Whisper base"); yoksa null */
  backendName: () => backend?.name ?? null,
};

/** Ses paketi ve tarayıcı desteğini denetler; durumu AVAILABLE/UNAVAILABLE yapar. */
export async function refreshVoiceAvailability(): Promise<void> {
  if (!micSupported()) {
    dispatch({ type: 'UNAVAILABLE', reason: 'Bu tarayıcı mikrofon kaydını desteklemiyor (güvenli bağlantı gerekir).' });
    return;
  }
  const mock = mockFromWindow();
  if (mock) {
    if (backendKey !== 'mock') {
      backend?.dispose();
      backend = mockBackend(mock);
      backendKey = 'mock';
    }
    dispatch({ type: 'AVAILABLE' });
    return;
  }
  let packs: InstalledPack[] = [];
  try {
    packs = (await listPacks()).filter((p) => p.kind === 'ses');
  } catch {}
  const nav: any = typeof navigator !== 'undefined' ? navigator : {};
  const pack = chooseVoicePack(packs, { memGB: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null, cores: nav.hardwareConcurrency || 2 });
  if (!pack) {
    if (!isBusy(st)) {
      backend?.dispose();
      backend = null;
      backendKey = '';
    }
    dispatch({ type: 'UNAVAILABLE', reason: "Sesli soru için ses paketi (Whisper) gerekli; şu an yüklü değil." });
    return;
  }
  const key = pack.origin + ':' + pack.id;
  if (key !== backendKey && !isBusy(st)) {
    backend?.dispose();
    backend = workerBackend(pack);
    backendKey = key;
  }
  dispatch({ type: 'AVAILABLE' });
}

function clearTimers() {
  if (ticker) clearInterval(ticker);
  if (autoStop) clearTimeout(autoStop);
  ticker = null;
  autoStop = null;
}

/** Modeli bir süre kullanılmazsa (ya da pil tasarrufunda hemen) bellekten at. */
function scheduleIdleUnload() {
  if (idleTimer) clearTimeout(idleTimer);
  const ms = getState().batterySaver ? 0 : 120_000;
  idleTimer = setTimeout(() => {
    idleTimer = null;
    if (!isBusy(st) && backend && backendKey !== 'mock') {
      const b = backend;
      // Arka uç yeniden kullanılabilir: dispose yalnızca işçiyi kapatır
      b.dispose();
    }
  }, ms);
}

/** Kaydı başlatır; bitince metin onResult'a verilir. */
export async function startVoice(onResult: (text: string) => void): Promise<void> {
  if (!backend) await refreshVoiceAvailability();
  if (!backend || (st.phase !== 'idle' && st.phase !== 'error')) return;
  onText = onResult;
  if (idleTimer) clearTimeout(idleTimer);
  dispatch({ type: 'START' });
  try {
    recorder = await startRecording((l) => {
      level = l;
    });
  } catch (e) {
    dispatch({ type: 'DENIED', message: micErrorMessage(e) });
    return;
  }
  if (phase() !== 'requesting') {
    // bu arada iptal edildi
    recorder.cancel();
    recorder = null;
    return;
  }
  dispatch({ type: 'GRANTED', at: Date.now() });
  ticker = setInterval(() => dispatch({ type: 'TICK', at: Date.now(), level }), 100);
  autoStop = setTimeout(() => void stopVoice(), MAX_RECORD_MS);
  // Kayıt sürerken modeli arka planda hazırla (kullanıcı konuşurken yükleme biter)
  const b = backend;
  b.load((f) => dispatch({ type: 'MODEL_PROGRESS', progress: f })).catch(() => {
    /* hata, yazıya çevirme adımında yeniden denenip gösterilir */
  });
}

/** Kaydı bitirir ve yazıya çevirir. */
export async function stopVoice(): Promise<void> {
  if (st.phase !== 'recording' || !recorder || !backend) return;
  dispatch({ type: 'TICK', at: Date.now(), level: 0 });
  clearTimers();
  const rec = recorder;
  recorder = null;
  const b = backend;
  dispatch({ type: 'STOP', modelReady: b.isReady() });
  if (phase() === 'error') {
    rec.cancel();
    return;
  }
  let audio: Float32Array;
  try {
    audio = await rec.stop();
  } catch {
    dispatch({ type: 'FAIL', message: 'Kayıt okunamadı.' });
    return;
  }
  if (backendKey !== 'mock' && !hasSpeech(audio)) {
    dispatch({ type: 'FAIL', message: 'Ses algılanamadı. Mikrofona daha yakından konuşun.' });
    return;
  }
  try {
    if (!b.isReady()) {
      await b.load((f) => dispatch({ type: 'MODEL_PROGRESS', progress: f }));
      dispatch({ type: 'MODEL_READY' });
    }
    const raw = await b.transcribe(normalizePeak(audio));
    if (phase() !== 'transcribing' && phase() !== 'loading') return; // iptal edildi
    const text = cleanTranscript(raw);
    dispatch({ type: 'RESULT', text });
    if (text) onText?.(text);
  } catch (e: any) {
    console.warn('[ses]', String(e?.message ?? e).slice(0, 300));
    if (phase() === 'idle') return;
    dispatch({ type: 'FAIL', message: describeSttError(e) });
  } finally {
    scheduleIdleUnload();
  }
}

export function cancelVoice() {
  clearTimers();
  recorder?.cancel();
  recorder = null;
  dispatch({ type: 'CANCEL' });
}

export function describeSttError(e: unknown): string {
  const msg = String((e as any)?.message ?? e ?? '');
  if (/eksik/i.test(msg)) return msg;
  if (/memory|allocat|RangeError|OOM/i.test(msg) || (e as any)?.name === 'RangeError') return 'Cihaz belleği ses modeline yetmedi. Daha küçük bir ses paketi (Whisper base) kullanın.';
  if (/tar/i.test(msg)) return 'Ses paketi bozuk (tar okunamadı).';
  if (/wasm|WebAssembly|onnx|session/i.test(msg)) return 'Konuşma tanıma motoru başlatılamadı.';
  return 'Konuşma yazıya çevrilemedi' + (msg ? ': ' + msg.slice(0, 120) : '.');
}
