// speechSynthesis yardımcıları (Çocuk köşesi ve Acil durum cümleleri ortak kullanır).
// Cihazda ilgili dilde ses yoksa hiçbir şey okunmaz; arayüz düğmeyi pasif gösterir.
import { useEffect, useState } from 'preact/hooks';

function synth(): SpeechSynthesis | null {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  } catch {
    return null;
  }
}

/** "tr", "ar", "fa"… ile başlayan ilk sesi bulur. */
export function findVoice(lang: string, voices?: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const list = voices ?? synth()?.getVoices() ?? [];
  const l = lang.toLowerCase();
  return list.find((v) => v.lang.toLowerCase().replace('_', '-').split('-')[0] === l) ?? null;
}

/** Ses listesi asenkron gelir; değiştikçe yeniden çizmek için kanca. */
export function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => synth()?.getVoices() ?? []);
  useEffect(() => {
    const s = synth();
    if (!s) return;
    const upd = () => setVoices(s.getVoices());
    upd();
    s.addEventListener?.('voiceschanged', upd);
    return () => s.removeEventListener?.('voiceschanged', upd);
  }, []);
  return voices;
}

export function speak(text: string, voice: SpeechSynthesisVoice, opts: { rate?: number; onEnd?: () => void } = {}): boolean {
  const s = synth();
  if (!s) return false;
  try {
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = opts.rate ?? 0.9;
    if (opts.onEnd) {
      u.onend = opts.onEnd;
      u.onerror = opts.onEnd;
    }
    s.speak(u);
    return true;
  } catch {
    return false;
  }
}

/**
 * Uzun metni parça parça okur (Chrome uzun tek cümleyi yarıda kesebilir).
 * Dönen fonksiyon okumayı durdurur.
 */
export function speakAll(parts: string[], voice: SpeechSynthesisVoice, opts: { rate?: number; onEnd?: () => void; onPart?: (i: number) => void } = {}): () => void {
  const s = synth();
  let stopped = false;
  if (!s) {
    opts.onEnd?.();
    return () => {};
  }
  s.cancel();
  const next = (i: number) => {
    if (stopped) return;
    if (i >= parts.length) {
      opts.onEnd?.();
      return;
    }
    opts.onPart?.(i);
    try {
      const u = new SpeechSynthesisUtterance(parts[i]);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = opts.rate ?? 0.9;
      u.onend = () => next(i + 1);
      u.onerror = () => {
        if (!stopped) opts.onEnd?.();
      };
      s.speak(u);
    } catch {
      opts.onEnd?.();
    }
  };
  next(0);
  return () => {
    stopped = true;
    try {
      s.cancel();
    } catch {
      /* yok say */
    }
  };
}

export function stopSpeaking() {
  try {
    synth()?.cancel();
  } catch {
    /* yok say */
  }
}
