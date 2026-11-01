import { describe, expect, it } from 'vitest';
import { listTar, makeTar, normalizeTarPath, readTarFiles } from '../src/lib/voice/tar';
import { chooseVoicePack, planWhisperPack, voicePackName } from '../src/lib/voice/whisper-pack';
import { cleanTranscript, formatElapsed, initialVoiceState, isBusy, voiceReducer, type VoiceEvent, type VoiceState } from '../src/lib/voice/state';
import { hasSpeech, normalizePeak, resample } from '../src/lib/voice/audio';
import { pickTurkishVoice, speechText, splitForSpeech } from '../src/lib/voice/tts';
import { describeSttError, mockBackend } from '../src/lib/voice/stt';
import { kindOf } from '../src/lib/packs';

const run = (events: VoiceEvent[], s: VoiceState = initialVoiceState) => events.reduce(voiceReducer, s);

describe('ses durum makinesi', () => {
  it('mutlu yol: başlat → izin → kayıt → bitir → yükle → yazıya çevir', () => {
    let s = run([{ type: 'START' }]);
    expect(s.phase).toBe('requesting');
    expect(isBusy(s)).toBe(true);
    s = run([{ type: 'GRANTED', at: 1000 }, { type: 'TICK', at: 3500, level: 0.4 }], s);
    expect(s).toMatchObject({ phase: 'recording', elapsed: 2500, level: 0.4 });
    s = voiceReducer(s, { type: 'STOP', modelReady: false });
    expect(s.phase).toBe('loading');
    s = voiceReducer(s, { type: 'MODEL_PROGRESS', progress: 0.5 });
    expect(s.progress).toBe(0.5);
    s = voiceReducer(s, { type: 'MODEL_READY' });
    expect(s.phase).toBe('transcribing');
    s = voiceReducer(s, { type: 'RESULT', text: '  Enkaz altındayım  ' });
    expect(s).toMatchObject({ phase: 'idle', text: 'Enkaz altındayım', error: null });
    expect(isBusy(s)).toBe(false);
  });

  it('model hazırsa doğrudan yazıya çevirir', () => {
    const s = run([{ type: 'START' }, { type: 'GRANTED', at: 0 }, { type: 'TICK', at: 2000 }, { type: 'STOP', modelReady: true }]);
    expect(s.phase).toBe('transcribing');
  });

  it('izin reddi ve kısa kayıt hata verir', () => {
    expect(run([{ type: 'START' }, { type: 'DENIED', message: 'izin yok' }])).toMatchObject({ phase: 'error', error: 'izin yok' });
    const short = run([{ type: 'START' }, { type: 'GRANTED', at: 0 }, { type: 'TICK', at: 100 }, { type: 'STOP', modelReady: true }]);
    expect(short.phase).toBe('error');
    expect(short.error).toMatch(/kısa/);
  });

  it('boş sonuç hata, hatadan sonra yeniden başlatılabilir', () => {
    let s = run([{ type: 'START' }, { type: 'GRANTED', at: 0 }, { type: 'TICK', at: 2000 }, { type: 'STOP', modelReady: true }, { type: 'RESULT', text: '  ' }]);
    expect(s.phase).toBe('error');
    s = voiceReducer(s, { type: 'START' });
    expect(s.phase).toBe('requesting');
  });

  it('geçersiz geçişleri yok sayar, iptal her zaman boşa döner', () => {
    expect(voiceReducer(initialVoiceState, { type: 'STOP', modelReady: true })).toBe(initialVoiceState);
    expect(voiceReducer(initialVoiceState, { type: 'GRANTED', at: 1 })).toBe(initialVoiceState);
    const rec = run([{ type: 'START' }, { type: 'GRANTED', at: 0 }]);
    expect(voiceReducer(rec, { type: 'START' })).toBe(rec);
    expect(voiceReducer(rec, { type: 'CANCEL' }).phase).toBe('idle');
  });

  it('kullanılabilirlik: paket yoksa kullanılamaz, gelince boşa döner; süren kaydı bozmaz', () => {
    let s = voiceReducer(initialVoiceState, { type: 'UNAVAILABLE', reason: 'paket yok' });
    expect(s).toMatchObject({ phase: 'unavailable', reason: 'paket yok' });
    expect(voiceReducer(s, { type: 'START' })).toBe(s);
    s = voiceReducer(s, { type: 'AVAILABLE' });
    expect(s.phase).toBe('idle');
    const rec = run([{ type: 'START' }, { type: 'GRANTED', at: 0 }]);
    expect(voiceReducer(rec, { type: 'UNAVAILABLE', reason: 'x' })).toBe(rec);
  });

  it('süre biçimi', () => {
    expect(formatElapsed(0)).toBe('0:00');
    expect(formatElapsed(7_900)).toBe('0:07');
    expect(formatElapsed(65_000)).toBe('1:05');
  });

  it('Whisper uydurmalarını temizler', () => {
    expect(cleanTranscript(' Altyazı M.K.')).toBe('');
    expect(cleanTranscript('Enkaz altındayım. Altyazı M.K.')).toBe('Enkaz altındayım.');
    expect(cleanTranscript('[Müzik] Su nasıl arıtılır?')).toBe('Su nasıl arıtılır?');
    expect(cleanTranscript('İzlediğiniz için teşekkürler.')).toBe('');
    expect(cleanTranscript(' ... ')).toBe('');
    expect(cleanTranscript('Kanama nasıl durdurulur?')).toBe('Kanama nasıl durdurulur?');
  });
});

describe('tar okuyucu', () => {
  const files = [
    { path: 'config.json', data: '{"a":1}' },
    { path: 'onnx/encoder_model_quantized.onnx', data: new Uint8Array(1500).fill(7) },
    { path: './tokenizer.json', data: '{}' },
  ];
  it('dosyaları kopyasız dilimler olarak verir', async () => {
    const blob = new Blob([makeTar(files)]);
    const entries = await listTar(blob);
    expect(entries.map((e) => e.path)).toEqual(['config.json', 'onnx/encoder_model_quantized.onnx', 'tokenizer.json']);
    const m = await readTarFiles(blob);
    expect(await m.get('config.json')!.text()).toBe('{"a":1}');
    const enc = new Uint8Array(await m.get('onnx/encoder_model_quantized.onnx')!.arrayBuffer());
    expect(enc.length).toBe(1500);
    expect(enc.every((b) => b === 7)).toBe(true);
  });
  it('bozuk başlığı reddeder', async () => {
    const raw = makeTar(files);
    raw[0] ^= 0xff;
    await expect(listTar(new Blob([raw]))).rejects.toThrow(/tar/);
  });
  it('yol normalleştirme', () => {
    expect(normalizeTarPath('./a/b.json')).toBe('a/b.json');
    expect(normalizeTarPath('a\\b.onnx')).toBe('a/b.onnx');
  });
});

describe('Whisper paketi', () => {
  const base = ['config.json', 'generation_config.json', 'preprocessor_config.json', 'tokenizer.json', 'tokenizer_config.json'];
  it('nicemlenmiş dosyaları seçer', () => {
    const p = planWhisperPack([...base, 'onnx/encoder_model_quantized.onnx', 'onnx/decoder_model_merged_quantized.onnx']);
    expect(p).toEqual({ root: '', dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' }, missing: [] });
  });
  it('karışık hassasiyet ve üst klasör', () => {
    const p = planWhisperPack([...base.map((f) => 'whisper-small/' + f), 'whisper-small/onnx/encoder_model.onnx', 'whisper-small/onnx/decoder_model_merged_q4.onnx']);
    expect(p.root).toBe('whisper-small/');
    expect(p.dtype).toEqual({ encoder_model: 'fp32', decoder_model_merged: 'q4' });
    expect(p.missing).toEqual([]);
  });
  it('eksikleri bildirir', () => {
    const p = planWhisperPack(['config.json', 'onnx/encoder_model_quantized.onnx']);
    expect(p.missing).toContain('tokenizer.json');
    expect(p.missing).toContain('onnx/decoder_model_merged*.onnx');
  });
  it('cihaza göre paket seçer', () => {
    const packs = [
      { id: 'whisper-base-ses.tar', size: 80e6 },
      { id: 'whisper-small-ses.tar', size: 252e6 },
    ];
    expect(chooseVoicePack(packs, { memGB: 4, cores: 8 })!.id).toBe('whisper-base-ses.tar');
    expect(chooseVoicePack(packs, { memGB: 8, cores: 8 })!.id).toBe('whisper-small-ses.tar');
    expect(chooseVoicePack([packs[1]], { memGB: 2, cores: 4 })!.id).toBe('whisper-small-ses.tar');
    expect(chooseVoicePack([], { memGB: 8, cores: 8 })).toBeNull();
  });
  it('ad ve paket türü', () => {
    expect(voicePackName('whisper-small-ses.tar')).toBe('Whisper small');
    expect(kindOf('whisper-base-ses.tar')).toBe('ses');
    expect(kindOf('Qwen3.5-4B-Q4_K_M-00001-of-00002.gguf')).toBe('model');
  });
});

describe('ses işleme', () => {
  it('48 kHz → 16 kHz yeniden örnekleme', () => {
    const n = 48_000;
    const sine = new Float32Array(n).map((_, i) => Math.sin((2 * Math.PI * 440 * i) / 48_000));
    const out = resample(sine, 48_000, 16_000);
    expect(out.length).toBe(16_000);
    // 440 Hz korunur: 16 kHz'de 1/4 periyot sonrası ~ sin(π/2·...) — ilk tepe yakınında
    const peakIdx = out.slice(0, 40).reduce((bi, v, i, a) => (v > a[bi] ? i : bi), 0);
    expect(Math.abs(peakIdx - 16_000 / 440 / 4)).toBeLessThan(2);
    expect(resample(new Float32Array([1, 2, 3]), 16_000)).toEqual(new Float32Array([1, 2, 3]));
    expect(resample(new Float32Array(0), 44_100).length).toBe(0);
  });
  it('konuşma algılama ve normalleştirme', () => {
    expect(hasSpeech(new Float32Array(16_000))).toBe(false);
    const loud = new Float32Array(16_000).map((_, i) => 0.6 * Math.sin(i / 3));
    expect(hasSpeech(loud)).toBe(true);
    const quiet = new Float32Array(100).map((_, i) => 0.05 * Math.sin(i));
    const n = normalizePeak(quiet);
    expect(Math.max(...n)).toBeGreaterThan(0.3);
    expect(normalizePeak(loud)).toBe(loud);
  });
});

describe('sesli okuma', () => {
  const v = (name: string, lang: string, localService: boolean) => ({ name, lang, localService });
  it('Türkçe ses seçer; çevrimdışıyken yalnızca cihaz üstü', () => {
    const voices = [v('Google US English', 'en-US', false), v('Google Türkçe', 'tr-TR', false), v('Yelda', 'tr-TR', true)];
    expect(pickTurkishVoice(voices, true)!.name).toBe('Yelda');
    expect(pickTurkishVoice([voices[0], voices[1]], true)!.name).toBe('Google Türkçe');
    expect(pickTurkishVoice([voices[0], voices[1]], false)).toBeNull();
    expect(pickTurkishVoice([v('tr', 'tr', true)], false)!.name).toBe('tr');
    expect(pickTurkishVoice([], true)).toBeNull();
  });
  it('okunacak metni temizler ve böler', () => {
    expect(speechText("Önce 112'yi arayın [1].\n• Yarayı bastırın [2, 3]\n**Kalkmayın**")).toBe("Önce 112'yi arayın.\nYarayı bastırın\nKalkmayın");
    const long = 'Bu bir cümle. '.repeat(40);
    const parts = splitForSpeech(long, 100);
    expect(parts.length).toBeGreaterThan(4);
    expect(parts.every((p) => p.length <= 100)).toBe(true);
    expect(parts.join(' ').replace(/\s+/g, ' ')).toBe(long.trim());
    expect(splitForSpeech('a\n\n…\nb')).toEqual(['a', 'b']);
  });
});

describe('sahte konuşma tanıma arka ucu', () => {
  it('yükler ve sabit metni döndürür', async () => {
    const b = mockBackend({ text: 'Merhaba' });
    const prog: (number | null)[] = [];
    expect(b.isReady()).toBe(false);
    await b.load((f) => prog.push(f));
    expect(b.isReady()).toBe(true);
    expect(prog.at(-1)).toBe(1);
    expect(await b.transcribe(new Float32Array(10))).toBe('Merhaba');
    await expect(mockBackend({ text: '', fail: true }).transcribe(new Float32Array(1))).rejects.toThrow();
  });
  it('hata iletileri', () => {
    expect(describeSttError(new Error('Ses paketi eksik: tokenizer.json'))).toContain('eksik');
    expect(describeSttError(new RangeError('Array buffer allocation failed'))).toContain('belleği');
  });
});
