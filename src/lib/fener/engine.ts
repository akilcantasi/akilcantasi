// Fener'in cihaz üstü dil modeli motoru.
// - Android uygulamasında, model uygulamanın indiricisiyle indirilmişse yerel llama.cpp motoru
//   (nativeFener: ARM vektör komutları, varsa GPU) kullanılır; kat kat hızlıdır.
// - Diğer her yerde wllama (llama.cpp → WebAssembly).
// - Tembel başlatma: yalnızca Fener bir soruyu modelle yanıtlayacağı zaman yüklenir.
// - Kullanıcı Fener sekmesinden 60 sn'den uzun ayrılırsa ya da pil tasarrufu
//   açılırsa model bellekten atılır.
// - wasm dosyası Vite ile paketlenir (?url) — hiçbir CDN kullanılmaz.
import wasmUrl from '@wllama/wllama/esm/wasm/wllama.wasm?url';
import type { Wllama } from '@wllama/wllama';
import { listPacks, openBlob, type InstalledPack } from '../packs';
import { NATIVE_PACK_PATH, nativeFener, type NativeFenerDurum } from '../native';
import {
  chooseModel,
  estimateParamsB,
  groupModels,
  prettyModelName,
  promptProfile,
  type DeviceProfile,
  type ModelGroup,
  type PromptProfile,
} from './models';
import { getState, subscribe } from '../store';
import type { ChatMsg } from './rag';

// Safari/iOS gibi Memory64/JSPI olmayan tarayıcılar için wllama'nın "compat"
// derlemesi. @wllama/wllama-compat paketi kuruluysa yerel olarak paketlenir;
// kurulu değilse bu nesne boş kalır ve o tarayıcılarda Fener rehber moduna düşer.
const compatAssets = import.meta.glob('/node_modules/@wllama/wllama-compat/wasm/wllama.{js,wasm}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Küçük (0,5B) modelin bağlam uzunluğu; büyük modeller promptProfile'dan alır */
export const N_CTX = 2048;
export const MAX_TOKENS = 384;
export const UNLOAD_AFTER_MS = 60_000;
const OVERRIDE_KEY = 'ac.fenerModel';

export {
  chooseModel,
  effectiveMemGB,
  estimateParamsB,
  fitFor,
  groupModels,
  prettyModelName,
  promptProfile,
  type DeviceProfile,
  type ModelGroup,
  type PromptProfile,
} from './models';

/** Yerel motorun bildirdiği cihaz bilgisi (Android; gerçek RAM, 8 GB sınırı yok) */
let nativeInfo: NativeFenerDurum | null = null;
let nativeInfoReq: Promise<NativeFenerDurum | null> | null = null;

/** Yerel motor bilgisini (bir kez) alır. Motor yoksa null. */
export function loadNativeInfo(): Promise<NativeFenerDurum | null> {
  if (!nativeFener.available()) return Promise.resolve(null);
  nativeInfoReq ??= nativeFener.durum().then((d) => (nativeInfo = d?.var ? d : null));
  return nativeInfoReq;
}

export function getNativeInfo(): NativeFenerDurum | null {
  return nativeInfo;
}

export function deviceProfile(): DeviceProfile {
  const nav: any = typeof navigator !== 'undefined' ? navigator : {};
  if (nativeInfo && nativeInfo.ram > 0) {
    // Yerel motor: telefonun gerçek RAM'i (WebView'ın 8 GB bildirim sınırı yok)
    return { memGB: Math.round((nativeInfo.ram / 1e9) * 10) / 10, cores: Math.max(1, nativeInfo.cores || Number(nav.hardwareConcurrency) || 1) };
  }
  const mem = typeof nav.deviceMemory === 'number' && nav.deviceMemory > 0 ? nav.deviceMemory : null;
  return { memGB: mem, cores: Math.max(1, Number(nav.hardwareConcurrency) || 1) };
}

/** Bu model yerel motorla açılabilir mi (tüm parçalar uygulamanın paket klasöründe) */
export function canRunNative(choice: ModelChoice | null): boolean {
  return !!choice && !!nativeInfo && choice.origin === 'device' && choice.parts.length > 0 && choice.parts.every((p) => p.url?.startsWith(NATIVE_PACK_PATH));
}

/** İş parçacığı: crossOriginIsolated ise min(4, çekirdek), değilse 1. */
export function threadCount(isolated: boolean, cores: number): number {
  return isolated ? Math.max(1, Math.min(4, cores)) : 1;
}

export function getModelOverride(): string | null {
  try {
    return localStorage.getItem(OVERRIDE_KEY);
  } catch {
    return null;
  }
}
/** Elle model seçimi (null = otomatik). Seçim kalıcıdır (localStorage). */
export function setModelOverride(id: string | null) {
  try {
    if (id) localStorage.setItem(OVERRIDE_KEY, id);
    else localStorage.removeItem(OVERRIDE_KEY);
  } catch {}
  if (loadedId && loadedId !== id) void engine.unload();
  modelEpoch++;
  notify();
}
let modelEpoch = 0;
/** Model seçimi değiştikçe artar (arayüz yeniden hesaplasın diye) */
export const getModelEpoch = () => modelEpoch;

// --- Geliştirici/masaüstü: ?devmodel=<url> --------------------------------------------
/** URL'deki devmodel parametresi (yalnızca geliştirme sunucusu ya da aynı köken). Virgülle ayrılmış parça listesi olabilir. */
export function devModelUrls(): string[] | null {
  if (typeof location === 'undefined') return null;
  const u = new URLSearchParams(location.search).get('devmodel');
  if (!u) return null;
  const out: string[] = [];
  for (const part of u.split(',')) {
    try {
      const abs = new URL(part.trim(), location.href);
      if (import.meta.env.DEV || abs.origin === location.origin) out.push(abs.href);
    } catch {}
  }
  return out.length ? out : null;
}

export interface ModelChoice {
  id: string;
  name: string;
  size: number;
  origin: InstalledPack['origin'] | 'dev';
  /** Model parçaları (tek dosyada 1 eleman), sıralı */
  parts: InstalledPack[];
  /** dev: parça adresleri */
  urls?: string[];
  paramsB: number;
  profile: PromptProfile;
  quant: string | null;
  /** Elle mi seçildi */
  manual: boolean;
}

function toChoice(g: ModelGroup<InstalledPack>, manual: boolean): ModelChoice {
  return {
    id: g.id,
    name: g.name,
    size: g.size,
    origin: g.parts.every((p) => p.origin === 'device') ? 'device' : 'server',
    parts: g.parts,
    paramsB: g.paramsB,
    profile: promptProfile(g.paramsB),
    quant: g.quant,
    manual,
  };
}

/** Kurulu tüm modeller (bölünmüş dosyalar gruplanmış, yardımcı GGUF'lar hariç). */
export async function listModels(): Promise<ModelGroup<InstalledPack>[]> {
  return groupModels((await listPacks()).filter((p) => p.kind === 'model'));
}

/** Kullanılacak modeli belirler (yükleme yapmaz). Model yoksa null. */
export async function pickModel(): Promise<ModelChoice | null> {
  const dev = devModelUrls();
  if (dev) {
    const names = dev.map((u) => decodeURIComponent(u.split('/').pop()!.split('?')[0]) || 'dev.gguf');
    const id = names.length > 1 ? prettyModelName(names[0]) + '.gguf' : names[0];
    const paramsB = estimateParamsB({ id, size: 0 });
    return { id, name: prettyModelName(id), size: 0, origin: 'dev', parts: [], urls: dev, paramsB, profile: promptProfile(paramsB), quant: null, manual: false };
  }
  await loadNativeInfo().catch(() => null);
  const groups = await listModels();
  const override = getModelOverride();
  const g = chooseModel(groups, deviceProfile(), override);
  if (!g) return null;
  return toChoice(g, !!override && g.id === override);
}

// --- Tarayıcı desteği ----------------------------------------------------------------
export function hasLocalCompat(): boolean {
  return Object.keys(compatAssets).length >= 2;
}

export function supportsMem64(): boolean {
  try {
    new WebAssembly.Memory({ address: 'i64', initial: 1n } as any);
    return true;
  } catch {
    return false;
  }
}

/** null = destekleniyor; aksi halde Türkçe neden. */
export function unsupportedReason(): string | null {
  if (typeof WebAssembly === 'undefined') return 'Bu tarayıcı WebAssembly desteklemiyor.';
  if (typeof Worker === 'undefined') return 'Bu tarayıcı arka plan işçisi (Web Worker) desteklemiyor.';
  const needCompat = !(WebAssembly as any).Suspending || !supportsMem64();
  if (needCompat && !supportsMem64() && !hasLocalCompat()) {
    return 'Bu tarayıcı modeli çalıştırmak için gereken WebAssembly özelliklerini (Memory64) desteklemiyor.';
  }
  return null;
}

// --- Motor durumu --------------------------------------------------------------------
export type EngineStatus = 'idle' | 'loading' | 'ready' | 'generating' | 'error';
export interface EngineState {
  status: EngineStatus;
  model: ModelChoice | null;
  /** 0..1 yükleme ilerlemesi; bilinmiyorsa null */
  progress: number | null;
  error: string | null;
  threads: number;
  multithread: boolean;
  isolated: boolean;
  /** Son üretimin hızı */
  tokensPerSec: number | null;
  /** 'yerel' = Android llama.cpp, 'wasm' = WebView'da WebAssembly */
  backend: 'yerel' | 'wasm' | null;
  /** Yerel motor GPU kullanıyor mu */
  gpu: boolean;
}

let st: EngineState = {
  status: 'idle',
  model: null,
  progress: null,
  error: null,
  threads: 1,
  multithread: false,
  isolated: typeof crossOriginIsolated !== 'undefined' ? crossOriginIsolated : false,
  tokensPerSec: null,
  backend: null,
  gpu: false,
};
const listeners = new Set<(s: EngineState) => void>();
function set(p: Partial<EngineState>) {
  st = { ...st, ...p };
  notify();
}
function notify() {
  listeners.forEach((l) => l(st));
  if (typeof window !== 'undefined') (window as any).__fener = st;
}

let wllama: Wllama | null = null;
/** Yerel motorda yüklü model (wllama yerine) */
let nativeLoaded = false;
let loadedId: string | null = null;
let loadedProfile: PromptProfile = promptProfile(0.5);
let loading: Promise<void> | null = null;
let unloadTimer: ReturnType<typeof setTimeout> | null = null;
let busy = false;

/** İstem n_ctx'i aştı mı? (llama-server: exceed_context_size_error) */
export function isContextOverflow(e: unknown): boolean {
  const err = e as any;
  const msg = String(err?.message ?? err ?? '');
  return /exceed_context_size|exceeds the available context|context size/i.test(msg) || err?.type === 'kv_cache_full';
}

/** wllama hata nesnelerini kullanıcıya gösterilecek Türkçe iletiye çevirir. */
export function describeError(e: unknown): string {
  const err = e as any;
  const msg = String(err?.message ?? err ?? '');
  const type = err?.type as string | undefined;
  if (/memory|OOM|allocate|Array buffer allocation|RangeError/i.test(msg) || err?.name === 'RangeError')
    return 'Cihaz belleği modele yetmedi. Daha küçük bir model seçin ya da diğer uygulamaları kapatın.';
  if (isContextOverflow(e) || /kv cache/i.test(msg))
    return "Sohbet modelin belleğine sığmayacak kadar uzadı. 'Yeni sohbet' ile yeniden başlayın.";
  if (type === 'load_error' || /gguf|magic|load model|failed to load/i.test(msg))
    return 'Model dosyası açılamadı (bozuk ya da desteklenmeyen GGUF dosyası).';
  if (type === 'download_error' || /fetch|network|indirilemedi/i.test(msg))
    return 'Model dosyası okunamadı (bağlantı ya da dosya hatası).';
  if (/wasm|WebAssembly|CompileError|instantiate/i.test(msg))
    return 'Yapay zekâ motoru bu tarayıcıda başlatılamadı.';
  return 'Fener modeli çalıştırırken bir sorun oluştu' + (msg ? ': ' + msg.slice(0, 160) : '.');
}

async function fetchDevBlob(url: string, onProgress: (f: number | null) => void): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw Object.assign(new Error('Model indirilemedi: ' + url), { type: 'download_error' });
  const total = Number(res.headers.get('content-length') ?? 0);
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    onProgress(total ? loaded / total : null);
  }
  return new Blob(chunks as BlobPart[]);
}

/**
 * Model parçalarını sıralı Blob listesi olarak açar. İlerleme toplam bayta göre.
 * Parçalara gerçek dosya adı verilir; wllama bölünmüş GGUF'ları ada göre sıralar.
 */
async function openModelBlobs(choice: ModelChoice, onProgress: (f: number | null) => void): Promise<Blob[]> {
  if (choice.origin === 'dev') {
    const urls = choice.urls ?? [];
    const out: Blob[] = [];
    for (let i = 0; i < urls.length; i++) {
      const b = await fetchDevBlob(urls[i], (f) => onProgress(f == null ? null : (i + f) / urls.length));
      out.push(asNamedFile(b, decodeURIComponent(urls[i].split('/').pop()!.split('?')[0])));
    }
    return out;
  }
  const total = choice.parts.reduce((s, p) => s + p.size, 0);
  let done = 0;
  const out: Blob[] = [];
  for (const part of choice.parts) {
    const b = await openBlob(part, (l) => onProgress(total ? Math.min(1, (done + l) / total) : null));
    done += part.size;
    onProgress(total ? done / total : null);
    out.push(asNamedFile(b, part.id));
  }
  // 2 GB'a yaklaşan tek dosya tarayıcıda tek parça yüklenemez: kopyalamadan parçalara böl
  if (out.length === 1 && out[0].size > SPLIT_THRESHOLD) {
    const { splitGguf } = await import('./gguf-split');
    return splitGguf(out[0], undefined, prettyModelName(choice.parts[0].id));
  }
  return out;
}

/** Bu boyutun üstündeki tek GGUF dosyası yüklenmeden önce sanal parçalara bölünür */
const SPLIT_THRESHOLD = 1.5 * 1024 ** 3;

function asNamedFile(b: Blob, name: string): Blob {
  if (typeof File !== 'undefined' && b instanceof File && b.name === name) return b;
  try {
    return new File([b], name);
  } catch {
    return b;
  }
}

const quietLogger = {
  debug: () => {},
  log: () => {},
  warn: (...a: unknown[]) => console.warn('[fener]', ...a),
  error: (...a: unknown[]) => console.warn('[fener]', ...a), // kullanıcıya zaten Türkçe ileti gösterilir
};

export const engine = {
  getState: () => st,
  subscribe(l: (s: EngineState) => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  isLoaded: () => (!!wllama || nativeLoaded) && loadedId !== null,

  /** Modeli (gerekirse) yükler. İlerleme 0..1 ya da bilinmiyorsa null. */
  async ensureLoaded(choice: ModelChoice, onProgress?: (f: number | null) => void): Promise<void> {
    this.cancelUnload();
    if ((wllama || nativeLoaded) && loadedId === choice.id) return;
    if (loading) {
      await loading;
      if ((wllama || nativeLoaded) && loadedId === choice.id) return;
    }
    await loadNativeInfo().catch(() => null);
    const useNative = canRunNative(choice);
    const why = useNative ? null : unsupportedReason();
    if (why) throw Object.assign(new Error(why), { unsupported: true });

    loading = (async () => {
      await this.unload();
      const prog = (f: number | null) => {
        set({ progress: f });
        onProgress?.(f);
      };
      set({ status: 'loading', model: choice, progress: 0, error: null });
      if (useNative) {
        // Yerel motor: dosya diskten doğrudan (bellek eşlemeli) açılır; ilerleme bilinmez
        prog(null);
        const r = await nativeFener.yukle(choice.parts[0].id, choice.profile.nCtx, true);
        if (r.ok) {
          nativeLoaded = true;
          loadedId = choice.id;
          loadedProfile = choice.profile;
          set({ status: 'ready', progress: 1, threads: r.bilgi?.threads ?? nativeInfo?.threads ?? 1, multithread: true, isolated: false, backend: 'yerel', gpu: !!r.gpu });
          return;
        }
        console.warn('[fener] yerel motor açamadı, WebAssembly deneniyor:', r.hata);
        const why2 = unsupportedReason();
        if (why2) {
          set({ status: 'error', error: r.hata ?? why2, progress: null });
          throw Object.assign(new Error(r.hata ?? why2), { unsupported: true });
        }
        prog(0);
      }
      try {
        const blobs = await openModelBlobs(choice, (f) => prog(f == null ? null : f * 0.9));
        prog(0.92);

        const { Wllama } = await import('@wllama/wllama');
        const isolated = typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated;
        const threads = threadCount(isolated, deviceProfile().cores);
        const w = new Wllama({ default: wasmUrl }, { logger: quietLogger, suppressNativeLog: true });
        const compatJs = Object.entries(compatAssets).find(([k]) => k.endsWith('.js'))?.[1];
        const compatWasm = Object.entries(compatAssets).find(([k]) => k.endsWith('.wasm'))?.[1];
        w.setCompat(compatJs && compatWasm ? { worker: compatJs, wasm: compatWasm } : null);

        const params = { n_ctx: choice.profile.nCtx, n_threads: threads, n_batch: 256 };
        try {
          await w.loadModel(blobs, params);
        } catch (e) {
          // WebGPU kaynaklı sorunlarda yalnızca işlemciyle bir kez daha dene
          if (w.isSupportWebGPU()) {
            await w.exit().catch(() => {});
            const w2 = new Wllama({ default: wasmUrl }, { logger: quietLogger, suppressNativeLog: true });
            w2.setCompat(compatJs && compatWasm ? { worker: compatJs, wasm: compatWasm } : null);
            await w2.loadModel(blobs, { ...params, n_gpu_layers: 0 });
            wllama = w2;
          } else throw e;
        }
        wllama ??= w;
        loadedId = choice.id;
        loadedProfile = choice.profile;
        set({
          status: 'ready',
          progress: 1,
          threads: wllama.getNumThreads(),
          multithread: wllama.isMultithread(),
          isolated,
          backend: 'wasm',
          gpu: false,
        });
      } catch (e) {
        wllama = null;
        loadedId = null;
        set({ status: 'error', error: describeError(e), progress: null });
        throw e;
      }
    })();
    try {
      await loading;
    } finally {
      loading = null;
    }
  },

  /**
   * Akış halinde sohbet tamamlaması. onToken her parçada çağrılır.
   * Durdurulursa (signal) o ana kadar üretilen metin döner, hata atılmaz.
   */
  async chat(
    messages: ChatMsg[],
    opts: { onToken?: (piece: string, full: string) => void; signal?: AbortSignal; maxTokens?: number } = {},
  ): Promise<{ text: string; aborted: boolean; tokens: number; tokensPerSec: number | null }> {
    if (nativeLoaded) return this.chatNative(messages, opts);
    if (!wllama) throw new Error('Model yüklü değil');
    this.cancelUnload();
    busy = true;
    set({ status: 'generating' });
    let text = '';
    let tokens = 0;
    let first = 0;
    const t0 = performance.now();
    let aborted = false;
    try {
      const stream = await wllama.createChatCompletion({
        messages,
        stream: true,
        max_tokens: opts.maxTokens ?? loadedProfile.maxTokens,
        temperature: loadedProfile.temperature,
        // Qwen3/Qwen3.5/Gemma 4 gibi "düşünen" modellerde düşünme bölümünü kapat:
        // işlemcide yüzlerce gereksiz token demek. (Şablon tanımıyorsa yok sayılır.)
        chat_template_kwargs: { enable_thinking: false },
        top_k: 40,
        top_p: 0.9,
        penalty_repeat: 1.1,
        abortSignal: opts.signal,
      });
      for await (const chunk of stream) {
        const piece = chunk?.choices?.[0]?.delta?.content ?? '';
        if (!piece) continue;
        if (!tokens) first = performance.now();
        tokens++;
        text += piece;
        opts.onToken?.(piece, text);
      }
    } catch (e: any) {
      if (opts.signal?.aborted || e?.name === 'AbortError' || e?.name === 'WllamaAbortError') aborted = true;
      else {
        busy = false;
        set({ status: 'ready' });
        throw e;
      }
    }
    busy = false;
    const dt = (performance.now() - (first || t0)) / 1000;
    const tps = tokens > 1 && dt > 0 ? (tokens - 1) / dt : null;
    set({ status: 'ready', tokensPerSec: tps });
    if (!getState().batterySaver && getState().tab !== 'fener') this.scheduleUnload();
    if (getState().batterySaver) void this.unload();
    return { text, aborted, tokens, tokensPerSec: tps };
  },

  /** Yerel motorla akışlı sohbet (chat ile aynı sözleşme) */
  async chatNative(
    messages: ChatMsg[],
    opts: { onToken?: (piece: string, full: string) => void; signal?: AbortSignal; maxTokens?: number },
  ): Promise<{ text: string; aborted: boolean; tokens: number; tokensPerSec: number | null }> {
    this.cancelUnload();
    busy = true;
    set({ status: 'generating' });
    let text = '';
    const onAbort = () => void nativeFener.durdur();
    opts.signal?.addEventListener('abort', onAbort);
    let r;
    try {
      if (opts.signal?.aborted) onAbort();
      r = await nativeFener.sohbet(
        messages.map((m) => ({ role: m.role, content: m.content })),
        { maxTokens: opts.maxTokens ?? loadedProfile.maxTokens, temperature: loadedProfile.temperature, topK: 40, topP: 0.9, repeat: 1.1 },
        (piece) => {
          text += piece;
          opts.onToken?.(piece, text);
        },
      );
    } finally {
      opts.signal?.removeEventListener('abort', onAbort);
      busy = false;
    }
    const aborted = !!r.aborted || !!opts.signal?.aborted;
    if (r.error && !aborted) {
      set({ status: 'ready' });
      throw new Error(r.error);
    }
    const tokens = r.tokens ?? 0;
    const tps = tokens > 1 && r.genMs ? (tokens / r.genMs) * 1000 : null;
    set({ status: 'ready', tokensPerSec: tps });
    if (!getState().batterySaver && getState().tab !== 'fener') this.scheduleUnload();
    if (getState().batterySaver) void this.unload();
    return { text, aborted, tokens, tokensPerSec: tps };
  },

  async unload() {
    this.cancelUnload();
    if (nativeLoaded) {
      nativeLoaded = false;
      loadedId = null;
      try {
        await nativeFener.bosalt();
      } catch {}
    }
    const w = wllama;
    wllama = null;
    loadedId = null;
    if (w) {
      try {
        await w.exit();
      } catch {}
    }
    if (st.status !== 'idle' && st.status !== 'loading') set({ status: 'idle', progress: null });
  },

  scheduleUnload(ms = UNLOAD_AFTER_MS) {
    this.cancelUnload();
    if (!wllama && !nativeLoaded) return;
    unloadTimer = setTimeout(() => {
      unloadTimer = null;
      if (busy) return this.scheduleUnload(ms); // üretim sürüyorsa bekle
      void this.unload();
    }, ms);
  },

  cancelUnload() {
    if (unloadTimer) clearTimeout(unloadTimer);
    unloadTimer = null;
  },
};

// Sekme değişimi ve pil tasarrufu: modeli bellekte gereksiz tutma
if (typeof window !== 'undefined') {
  let lastTab = getState().tab;
  let lastSaver = getState().batterySaver;
  subscribe((s) => {
    if (s.batterySaver && !lastSaver && !busy) void engine.unload();
    if (s.tab !== lastTab) {
      if (s.tab === 'fener') engine.cancelUnload();
      else engine.scheduleUnload();
    }
    lastTab = s.tab;
    lastSaver = s.batterySaver;
  });
}
