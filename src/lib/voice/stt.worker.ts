/// <reference lib="webworker" />
// Konuşma tanıma işçisi: transformers.js (ONNX Runtime Web, WASM) ile Whisper.
// Ana iş parçacığını kilitlememek için ayrı bir Worker'da çalışır.
// Model dosyaları ağdan DEĞİL, ana iş parçacığının verdiği Blob'lardan (ses paketi
// tar arşivinin dilimleri) okunur: env.fetch bu eşlemeye yönlendirilir. ONNX Runtime
// wasm dosyaları uygulamayla birlikte paketlenir (Vite ?url) — hiçbir CDN kullanılmaz.
import ortWasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.wasm?url';
import ortMjsUrl from 'onnxruntime-web/ort-wasm-simd-threaded.asyncify.mjs?url';

export type SttIn =
  | { type: 'load'; files: Record<string, Blob>; root: string; dtype: Record<string, string>; threads: number }
  | { type: 'transcribe'; id: number; audio: Float32Array; language: string }
  | { type: 'dispose' };

export type SttOut =
  | { type: 'progress'; progress: number | null }
  | { type: 'ready' }
  | { type: 'result'; id: number; text: string; ms: number }
  | { type: 'error'; id?: number; message: string };

const MODEL_ID = 'akilcantasi/whisper';
const LOCAL_PREFIX = '/__ses-paketi__/';

let asr: any = null;
let loading: Promise<void> | null = null;

const post = (m: SttOut) => (self as unknown as Worker).postMessage(m);

async function load(m: Extract<SttIn, { type: 'load' }>) {
  const T: any = await import('@huggingface/transformers');
  const env = T.env;
  env.allowRemoteModels = false;
  env.allowLocalModels = true;
  env.useBrowserCache = false;
  env.useWasmCache = false;
  env.useCustomCache = false;
  env.localModelPath = LOCAL_PREFIX;
  env.fetch = async (input: any) => {
    const url = typeof input === 'string' ? input : input?.url ?? String(input);
    const path = decodeURIComponent(new URL(url, 'http://x/').pathname);
    const prefix = LOCAL_PREFIX + MODEL_ID + '/';
    const rel = path.startsWith(prefix) ? path.slice(prefix.length) : null;
    const blob = rel != null ? m.files[m.root + rel] : undefined;
    if (!blob) return new Response('yok', { status: 404, statusText: 'Not Found' });
    return new Response(blob, { status: 200, headers: { 'content-length': String(blob.size), 'content-type': rel!.endsWith('.json') ? 'application/json' : 'application/octet-stream' } });
  };
  const wasm = env.backends?.onnx?.wasm;
  if (wasm) {
    wasm.wasmPaths = { wasm: new URL(ortWasmUrl, self.location.href).href, mjs: new URL(ortMjsUrl, self.location.href).href };
    wasm.numThreads = Math.max(1, m.threads);
    wasm.proxy = false;
  }
  const total = Object.values(m.files).reduce((s, b) => s + b.size, 0);
  const seen: Record<string, number> = {};
  asr = await T.pipeline('automatic-speech-recognition', MODEL_ID, {
    device: 'wasm',
    dtype: m.dtype,
    progress_callback: (p: any) => {
      if (p?.status === 'progress' && p.file) {
        seen[p.file] = p.loaded ?? 0;
        const loaded = Object.values(seen).reduce((s, v) => s + v, 0);
        post({ type: 'progress', progress: total ? Math.min(0.99, loaded / total) : null });
      }
    },
  });
}

self.onmessage = async (ev: MessageEvent<SttIn>) => {
  const m = ev.data;
  try {
    if (m.type === 'load') {
      if (!asr) {
        loading ??= load(m);
        await loading;
      }
      post({ type: 'ready' });
    } else if (m.type === 'transcribe') {
      if (loading) await loading;
      if (!asr) throw new Error('Model yüklü değil');
      const t0 = performance.now();
      const out = await asr(m.audio, { language: m.language, task: 'transcribe', return_timestamps: false });
      const text = Array.isArray(out) ? out.map((o: any) => o.text).join(' ') : out?.text ?? '';
      post({ type: 'result', id: m.id, text: String(text), ms: Math.round(performance.now() - t0) });
    } else if (m.type === 'dispose') {
      const a = asr;
      asr = null;
      loading = null;
      await a?.dispose?.().catch?.(() => {});
      self.close();
    }
  } catch (e: any) {
    loading = null;
    post({ type: 'error', id: (m as any).id, message: String(e?.message ?? e).slice(0, 300) });
  }
};
