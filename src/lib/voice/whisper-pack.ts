// "Sesli sor" ses paketi: Whisper'ın transformers.js (ONNX) biçimindeki dosyaları,
// tek bir .tar arşivinde. Paket türü 'ses' (packs.ts). Örnek içerik
// (https://huggingface.co/onnx-community/whisper-base):
//   config.json, generation_config.json, preprocessor_config.json,
//   tokenizer.json, tokenizer_config.json,
//   onnx/encoder_model_quantized.onnx, onnx/decoder_model_merged_quantized.onnx
// Dosyalar arşivin kökünde ya da tek bir üst klasörde (whisper-base/…) olabilir.
// Hazırlama talimatı: docs/FENER_MODELLER.md

export const REQUIRED_FILES = ['config.json', 'generation_config.json', 'preprocessor_config.json', 'tokenizer.json'] as const;

/** transformers.js dtype → ONNX dosya eki. Sıra = tercih sırası (WASM/işlemci için en uygunu önce). */
export const DTYPE_SUFFIX: [dtype: string, suffix: string][] = [
  ['q8', '_quantized'],
  ['int8', '_int8'],
  ['uint8', '_uint8'],
  ['q4', '_q4'],
  ['bnb4', '_bnb4'],
  ['fp16', '_fp16'],
  ['fp32', ''],
];

export interface WhisperPackPlan {
  /** Kök klasör öneki ("" ya da "whisper-base/") */
  root: string;
  dtype: { encoder_model: string; decoder_model_merged: string };
  /** Eksik zorunlu dosyalar (boşsa paket kullanılabilir) */
  missing: string[];
}

function detectRoot(paths: string[]): string {
  if (paths.includes('config.json')) return '';
  const c = paths.find((p) => /^[^/]+\/config\.json$/.test(p));
  return c ? c.slice(0, c.length - 'config.json'.length) : '';
}

function pickDtype(paths: Set<string>, root: string, module: string): string | null {
  for (const [dtype, suf] of DTYPE_SUFFIX) {
    if (paths.has(`${root}onnx/${module}${suf}.onnx`)) return dtype;
  }
  return null;
}

/** Arşivdeki dosya adlarından yükleme planı çıkarır (saf işlev). */
export function planWhisperPack(paths: string[]): WhisperPackPlan {
  const root = detectRoot(paths);
  const set = new Set(paths);
  const missing: string[] = REQUIRED_FILES.filter((f) => !set.has(root + f));
  const enc = pickDtype(set, root, 'encoder_model');
  const dec = pickDtype(set, root, 'decoder_model_merged');
  if (!enc) missing.push('onnx/encoder_model*.onnx');
  if (!dec) missing.push('onnx/decoder_model_merged*.onnx');
  return { root, dtype: { encoder_model: enc ?? 'q8', decoder_model_merged: dec ?? 'q8' }, missing };
}

/**
 * Birden çok ses paketi varsa: güçlü cihazda (≥6 GB, ≥6 çekirdek) 400 MB'a kadar olanların
 * en büyüğü (ör. whisper-small), diğerlerinde 120 MB'a kadar olanların en büyüğü
 * (whisper-base); hiçbiri sığmıyorsa en küçüğü.
 */
export function chooseVoicePack<T extends { id: string; size: number }>(packs: T[], p: { memGB: number | null; cores: number }): T | null {
  if (!packs.length) return null;
  const strong = (p.memGB ?? 4) >= 6 && p.cores >= 6;
  const limit = strong ? 400e6 : 120e6;
  const bySize = [...packs].sort((a, b) => a.size - b.size || a.id.localeCompare(b.id));
  const fit = bySize.filter((x) => x.size <= limit);
  return fit.length ? fit[fit.length - 1] : bySize[0];
}

/** "whisper-small-ses.tar" → "Whisper small" */
export function voicePackName(id: string): string {
  const m = id.toLowerCase().match(/whisper[-_ ]?(tiny|base|small|medium|large(?:[-_]v\d)?|turbo)?/);
  if (m) return 'Whisper' + (m[1] ? ' ' + m[1].replace(/[-_]/g, '-') : '');
  return id.replace(/\.tar$/i, '');
}
