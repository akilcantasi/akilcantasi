// "Sesli sor" durum makinesi (saf; arayüz ve testler aynı kuralları kullanır).
//
//   idle ──START──▶ requesting ──GRANTED──▶ recording ──STOP──▶ transcribing ──RESULT──▶ idle
//                       │                       │  (model hazır değilse loading → transcribing)
//                       └──DENIED──▶ error ◀────┴──FAIL
//   CANCEL her durumda idle'a döner (kayıt atılır).

export type VoicePhase = 'unavailable' | 'idle' | 'requesting' | 'recording' | 'loading' | 'transcribing' | 'error';

export interface VoiceState {
  phase: VoicePhase;
  /** Kayıt başlangıcı (ms) */
  startedAt: number | null;
  /** Geçen kayıt süresi (ms) */
  elapsed: number;
  /** 0..1 anlık ses düzeyi */
  level: number;
  /** Model yükleme ilerlemesi 0..1 (bilinmiyorsa null) */
  progress: number | null;
  /** Son başarılı metin */
  text: string | null;
  error: string | null;
  /** Kullanılamıyorsa nedeni */
  reason: string | null;
}

export type VoiceEvent =
  | { type: 'AVAILABLE' }
  | { type: 'UNAVAILABLE'; reason: string }
  | { type: 'START' }
  | { type: 'GRANTED'; at: number }
  | { type: 'DENIED'; message?: string }
  | { type: 'TICK'; at: number; level?: number }
  | { type: 'STOP'; modelReady: boolean }
  | { type: 'MODEL_PROGRESS'; progress: number | null }
  | { type: 'MODEL_READY' }
  | { type: 'RESULT'; text: string }
  | { type: 'FAIL'; message: string }
  | { type: 'CANCEL' };

/** Whisper en çok 30 sn'lik pencereyle çalışır; kayıt bu sürede kendiliğinden biter. */
export const MAX_RECORD_MS = 30_000;
/** Bundan kısa kayıt yazıya çevrilmez */
export const MIN_RECORD_MS = 400;

export const initialVoiceState: VoiceState = {
  phase: 'idle',
  startedAt: null,
  elapsed: 0,
  level: 0,
  progress: null,
  text: null,
  error: null,
  reason: null,
};

export function voiceReducer(s: VoiceState, e: VoiceEvent): VoiceState {
  switch (e.type) {
    case 'AVAILABLE':
      return s.phase === 'unavailable' ? { ...s, phase: 'idle', reason: null } : s;
    case 'UNAVAILABLE':
      // Sürmekte olan bir işi kesme; boştaysa kullanılamaz yap
      return s.phase === 'idle' || s.phase === 'error' || s.phase === 'unavailable' ? { ...initialVoiceState, phase: 'unavailable', reason: e.reason } : s;
    case 'START':
      if (s.phase !== 'idle' && s.phase !== 'error') return s;
      return { ...initialVoiceState, phase: 'requesting' };
    case 'GRANTED':
      if (s.phase !== 'requesting') return s;
      return { ...s, phase: 'recording', startedAt: e.at, elapsed: 0, level: 0 };
    case 'DENIED':
      if (s.phase !== 'requesting') return s;
      return { ...initialVoiceState, phase: 'error', error: e.message ?? 'Mikrofon izni verilmedi.' };
    case 'TICK':
      if (s.phase !== 'recording' || s.startedAt == null) return s;
      return { ...s, elapsed: Math.max(0, e.at - s.startedAt), level: e.level ?? s.level };
    case 'STOP':
      if (s.phase !== 'recording') return s;
      if (s.elapsed < MIN_RECORD_MS) return { ...initialVoiceState, phase: 'error', error: 'Kayıt çok kısa. Düğmeye basıp sorunuzu söyleyin, bitince yeniden basın.' };
      return { ...s, phase: e.modelReady ? 'transcribing' : 'loading', level: 0 };
    case 'MODEL_PROGRESS':
      return s.phase === 'loading' ? { ...s, progress: e.progress } : s;
    case 'MODEL_READY':
      return s.phase === 'loading' ? { ...s, phase: 'transcribing', progress: 1 } : s;
    case 'RESULT':
      if (s.phase !== 'transcribing' && s.phase !== 'loading') return s;
      if (!e.text.trim()) return { ...initialVoiceState, phase: 'error', error: 'Konuşma anlaşılamadı. Daha yakından ve yavaşça yeniden deneyin.' };
      return { ...initialVoiceState, phase: 'idle', text: e.text.trim() };
    case 'FAIL':
      if (s.phase === 'unavailable') return s;
      return { ...initialVoiceState, phase: 'error', error: e.message };
    case 'CANCEL':
      if (s.phase === 'unavailable') return s;
      return { ...initialVoiceState, phase: 'idle' };
  }
}

export function isBusy(s: VoiceState): boolean {
  return s.phase === 'requesting' || s.phase === 'recording' || s.phase === 'loading' || s.phase === 'transcribing';
}

/** "0:07" */
export function formatElapsed(ms: number): string {
  const sec = Math.floor(ms / 1000);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

/**
 * Whisper sessizlikte ya da gürültüde eğitim verisindeki altyazı kalıplarını "uydurur"
 * (Türkçede bilinen örnek: "Altyazı M.K."). Bu kalıpları ve köşeli/yuvarlak parantezli
 * ses etiketlerini ([Müzik], (alkış)) atar.
 */
const HALLUCINATIONS = [
  /altyaz[ıi]\s*m\.?\s*k\.?/gi,
  /abone\s+ol(may[ıi]|un)?[^.!?]*[.!?]?/gi,
  /[iİ]zledi[ğg]iniz\s+i[çc]in\s+te[şs]ekk[üu]r(ler|\s*ederim)?[.!]?/gi,
  /bir\s+sonraki\s+videoda\s+g[öo]r[üu][şs]mek\s+[üu]zere[.!]?/gi,
  /\[[^\]]{1,40}\]|\((?:m[üu]zik|alk[ıi][şs]|g[üu]l[üu][şs]meler|sessizlik)[^)]*\)|♪+/gi,
];

export function cleanTranscript(t: string): string {
  let s = t;
  for (const re of HALLUCINATIONS) s = s.replace(re, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  // Yalnızca noktalama kaldıysa boş say
  if (!/[\p{L}\p{N}]/u.test(s)) return '';
  return s;
}
