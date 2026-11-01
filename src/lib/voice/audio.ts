// Mikrofon kaydı: getUserMedia → AudioContext → ham PCM (Float32), sonra Whisper'ın
// beklediği 16 kHz tek kanala dönüştürülür. MediaRecorder/codec gerekmez; Chrome,
// Android WebView ve Firefox'ta aynı şekilde çalışır.

export const WHISPER_RATE = 16_000;

/** Doğrusal ara değerlemeli yeniden örnekleme (aşağı örneklemede basit ortalama süzgeçle). */
export function resample(input: Float32Array, fromRate: number, toRate = WHISPER_RATE): Float32Array {
  if (!input.length || fromRate <= 0) return new Float32Array(0);
  if (fromRate === toRate) return input.slice();
  const ratio = fromRate / toRate;
  const outLen = Math.max(1, Math.floor(input.length / ratio));
  const out = new Float32Array(outLen);
  if (ratio > 1) {
    // Aşağı örnekleme: her çıktı örneği, kapsadığı giriş aralığının ortalaması (örtüşmeyi azaltır)
    for (let i = 0; i < outLen; i++) {
      const start = i * ratio;
      const end = Math.min(input.length, start + ratio);
      let sum = 0;
      let n = 0;
      for (let j = Math.floor(start); j < Math.ceil(end); j++) {
        sum += input[j];
        n++;
      }
      out[i] = n ? sum / n : 0;
    }
  } else {
    for (let i = 0; i < outLen; i++) {
      const pos = i * ratio;
      const j = Math.floor(pos);
      const f = pos - j;
      const a = input[j];
      const b = j + 1 < input.length ? input[j + 1] : a;
      out[i] = a + (b - a) * f;
    }
  }
  return out;
}

export function concatFloat32(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Float32Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

export function rms(a: Float32Array): number {
  if (!a.length) return 0;
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * a[i];
  return Math.sqrt(s / a.length);
}

/** Konuşma var mı? Tüm kaydın en yüksek 50 ms'lik pencere RMS'i eşiği geçmeli. */
export function hasSpeech(a: Float32Array, rate = WHISPER_RATE, threshold = 0.01): boolean {
  const win = Math.max(1, Math.floor(rate * 0.05));
  for (let i = 0; i + win <= a.length; i += win) {
    if (rms(a.subarray(i, i + win)) >= threshold) return true;
  }
  return false;
}

/** Sesi tepe 0,95'e normalleştirir (çok kısık kayıtlar için; zaten yüksekse dokunmaz). */
export function normalizePeak(a: Float32Array, target = 0.95): Float32Array {
  let peak = 0;
  for (let i = 0; i < a.length; i++) peak = Math.max(peak, Math.abs(a[i]));
  if (peak <= 0 || peak >= target * 0.5) return a;
  const g = Math.min(8, target / peak);
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] * g;
  return out;
}

export interface Recorder {
  /** Kaydı bitirir ve 16 kHz tek kanal PCM döndürür */
  stop(): Promise<Float32Array>;
  /** Kaydı atar */
  cancel(): void;
}

export function micSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof (globalThis as any).AudioContext !== 'undefined';
}

/** Mikrofon izni hatalarını Türkçe iletiye çevirir. */
export function micErrorMessage(e: unknown): string {
  const name = (e as any)?.name ?? '';
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError')
    return 'Mikrofon izni verilmedi. Tarayıcı ya da uygulama ayarlarından mikrofona izin verin.';
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'Mikrofon bulunamadı.';
  if (name === 'NotReadableError' || name === 'TrackStartError') return 'Mikrofon başka bir uygulama tarafından kullanılıyor.';
  return 'Mikrofon açılamadı.';
}

/**
 * Kaydı başlatır. onLevel ~10 kez/sn 0..1 düzey verir (gösterge için).
 * İzin reddedilirse hata fırlatır (micErrorMessage ile iletiye çevrilir).
 */
export async function startRecording(onLevel?: (level: number) => void): Promise<Recorder> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  const AC: typeof AudioContext = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
  const ctx = new AC();
  if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
  const src = ctx.createMediaStreamSource(stream);
  // ScriptProcessorNode eskimiş sayılsa da her yerde (WebView dahil) çalışır ve ek dosya gerektirmez
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let lastLevel = 0;
  proc.onaudioprocess = (ev) => {
    const ch = ev.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(ch));
    const now = performance.now();
    if (onLevel && now - lastLevel > 90) {
      lastLevel = now;
      onLevel(Math.min(1, rms(ch) * 6));
    }
  };
  // Bazı tarayıcılar çıkışa bağlanmayan işlemciyi çalıştırmaz; sessiz bir kazançla bağla
  const mute = ctx.createGain();
  mute.gain.value = 0;
  src.connect(proc);
  proc.connect(mute);
  mute.connect(ctx.destination);

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    try {
      proc.disconnect();
      src.disconnect();
      mute.disconnect();
    } catch {}
    stream.getTracks().forEach((t) => t.stop());
    void ctx.close().catch(() => {});
  };
  return {
    async stop() {
      const rate = ctx.sampleRate;
      close();
      return resample(concatFloat32(chunks), rate, WHISPER_RATE);
    },
    cancel() {
      close();
      chunks.length = 0;
    },
  };
}
