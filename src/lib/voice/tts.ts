// "Sesli oku": Fener cevaplarını cihazın konuşma sentezleyicisiyle okur.
//  - Tarayıcıda Web Speech API (speechSynthesis); tr-TR ses varsa o seçilir,
//    çevrimdışıyken yalnızca cihaz üstü (localService) sesler kullanılır.
//  - Android uygulamasında (Capacitor) WebView speechSynthesis'i desteklemez; uygulamaya
//    @capacitor-community/text-to-speech eklentisi kuruluysa o kullanılır.
//  - Uzun metin cümle cümle sıraya konur (Chrome uzun tek parçayı yarıda kesebiliyor).

export interface VoiceLike {
  name: string;
  lang: string;
  localService: boolean;
  default?: boolean;
}

/** Türkçe ses seçimi: tr-TR > tr-*; çevrimdışıyken yalnızca cihaz üstü sesler; cihaz üstü öncelikli. */
export function pickTurkishVoice<V extends VoiceLike>(voices: V[], online: boolean): V | null {
  const tr = voices.filter((v) => /^tr([-_]|$)/i.test(v.lang));
  const usable = online ? tr : tr.filter((v) => v.localService);
  const score = (v: V) => (/^tr[-_]tr$/i.test(v.lang) ? 2 : 0) + (v.localService ? 1 : 0) + (v.default ? 0.5 : 0);
  return [...usable].sort((a, b) => score(b) - score(a))[0] ?? null;
}

/** Okumaya uygun metin: kaynak numaraları, madde işaretleri, biçim işaretleri atılır. */
export function speechText(text: string): string {
  return text
    .replace(/[ \t]*\[\d+(?:\s*[,–-]\s*\d+)*\]/g, '')
    .replace(/[*_`#>]+/g, '')
    .replace(/^\s*[•\-–]\s+/gm, '')
    .replace(/^\s*(\d+)[.)]\s+/gm, '$1. ')
    .replace(/→/g, ', ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

/** Metni ≤max karakterlik, mümkünse cümle sonunda biten parçalara böler. */
export function splitForSpeech(text: string, max = 220): string[] {
  const out: string[] = [];
  for (const para of text.split(/\n+/)) {
    let rest = para.trim();
    while (rest.length > max) {
      const win = rest.slice(0, max);
      let cut = Math.max(win.lastIndexOf('. '), win.lastIndexOf('! '), win.lastIndexOf('? '), win.lastIndexOf('; '));
      if (cut < max * 0.4) cut = win.lastIndexOf(', ');
      if (cut < max * 0.4) cut = win.lastIndexOf(' ');
      if (cut <= 0) cut = max - 1;
      out.push(rest.slice(0, cut + 1).trim());
      rest = rest.slice(cut + 1).trim();
    }
    if (rest) out.push(rest);
  }
  return out.filter((s) => /[\p{L}\p{N}]/u.test(s));
}

// --- Oynatıcı ---------------------------------------------------------------------------
export interface TtsState {
  supported: boolean;
  /** Okunan mesajın kimliği; okunmuyorsa null */
  speakingId: number | null;
  /** Seçilen sesin adı (bilgi için) */
  voiceName: string | null;
  error: string | null;
}

let st: TtsState = { supported: false, speakingId: null, voiceName: null, error: null };
const listeners = new Set<(s: TtsState) => void>();
function set(p: Partial<TtsState>) {
  st = { ...st, ...p };
  listeners.forEach((l) => l(st));
  if (typeof window !== 'undefined') (window as any).__fenerTts = st;
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof (window as any).SpeechSynthesisUtterance !== 'undefined' ? window.speechSynthesis : null;
}

function nativePlugin(): any {
  const cap = typeof window !== 'undefined' ? (window as any).Capacitor : null;
  try {
    if (cap?.isNativePlatform?.() && cap.isPluginAvailable?.('TextToSpeech')) return cap.Plugins?.TextToSpeech ?? null;
  } catch {}
  return null;
}

let voicesCache: SpeechSynthesisVoice[] = [];
function loadVoices(): SpeechSynthesisVoice[] {
  const s = synth();
  if (!s) return [];
  try {
    const v = s.getVoices();
    if (v.length) voicesCache = v;
  } catch {}
  return voicesCache;
}

export function initTts() {
  const s = synth();
  const supported = !!s || !!nativePlugin();
  set({ supported });
  if (s) {
    loadVoices();
    try {
      s.addEventListener?.('voiceschanged', () => loadVoices());
    } catch {}
  }
}

export const tts = {
  getState: () => st,
  subscribe(l: (s: TtsState) => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

let runToken = 0;

/** Metni okur. Aynı kimlik zaten okunuyorsa durdurur (aç/kapa). */
export async function speak(id: number, text: string): Promise<void> {
  if (st.speakingId === id) return stopSpeaking();
  stopSpeaking();
  const parts = splitForSpeech(speechText(text));
  if (!parts.length) return;
  const token = ++runToken;
  const plugin = nativePlugin();
  if (plugin) {
    set({ speakingId: id, error: null, voiceName: 'Cihaz sesi' });
    try {
      for (const p of parts) {
        if (token !== runToken) return;
        await plugin.speak({ text: p, lang: 'tr-TR', rate: 1.0, pitch: 1.0, volume: 1.0, category: 'playback' });
      }
    } catch {
      if (token === runToken) set({ error: 'Sesli okuma başlatılamadı.' });
    }
    if (token === runToken) set({ speakingId: null });
    return;
  }
  const s = synth();
  if (!s) {
    set({ error: 'Bu cihaz sesli okumayı desteklemiyor.' });
    return;
  }
  const voice = pickTurkishVoice(loadVoices(), typeof navigator === 'undefined' || navigator.onLine !== false);
  set({ speakingId: id, error: null, voiceName: voice?.name ?? null });
  try {
    s.cancel();
  } catch {}
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    u.lang = voice?.lang ?? 'tr-TR';
    if (voice) u.voice = voice;
    u.rate = 1;
    if (i === parts.length - 1) u.onend = () => token === runToken && set({ speakingId: null });
    u.onerror = (e: any) => {
      if (token !== runToken) return;
      if (e?.error !== 'interrupted' && e?.error !== 'canceled') set({ error: 'Sesli okuma yarıda kaldı.' });
      set({ speakingId: null });
    };
    s.speak(u);
  });
}

export function stopSpeaking() {
  runToken++;
  const s = synth();
  try {
    s?.cancel();
  } catch {}
  try {
    nativePlugin()?.stop?.();
  } catch {}
  if (st.speakingId !== null) set({ speakingId: null });
}
