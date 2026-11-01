// Fener "Sesli sor" / "Sesli oku" uçtan uca kontrolü (getUserMedia ve speechSynthesis sahte):
//   node e2e/fener-voice-check.mjs [taban-url] [ekran-görüntüsü-klasörü]
// Taban: Vite dev sunucusu (ör. http://localhost:5199/). Model ya da ses paketi gerekmez.
// 1) Sahte STT (window.__acSttMock): mikrofon → kayıt göstergesi → yazıya çevirme → metin girişe gelir.
// 2) Cevabı sesli oku: tr-TR ses seçilir, Durdur ile kesilir.
// 3) Mikrofon izni reddi → Türkçe hata notu.
// 4) Ses paketi yok → düğme "kullanılamaz", nedeni gösterir.
// 5) Gerçek işçi yolu: OPFS'e sahte (bozuk ONNX'li) bir ses paketi yazılır; kayıt bitince
//    transformers.js + ONNX Runtime yerel dosyalardan yüklenir ve bozuk modeli reddeder.
//    Dış ağa (CDN, huggingface) hiç istek gitmediği doğrulanır.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const base = process.argv[2] ?? 'http://localhost:5199/';
const shots = process.argv[3] ?? '/tmp';
const fails = [];
const check = (ok, m) => { console.log((ok ? 'OK   ' : 'FAIL ') + m); if (!ok) fails.push(m); };

const browser = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });

const MOCKS = ({ stt, deny }) => {
  if (stt) window.__acSttMock = stt;
  // Sahte mikrofon: 220 Hz ton (konuşma eşiğini geçer)
  navigator.mediaDevices.getUserMedia = async () => {
    if (deny) throw new DOMException('Permission denied', 'NotAllowedError');
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 220;
    const g = ctx.createGain();
    g.gain.value = 0.3;
    const dst = ctx.createMediaStreamDestination();
    osc.connect(g).connect(dst);
    osc.start();
    return dst.stream;
  };
  // Sahte konuşma sentezi: söylenenleri kaydeder, 1,5 sn sonra biter
  const spoken = [];
  window.__spoken = spoken;
  window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; this.lang = ''; this.voice = null; } };
  const q = [];
  let t = null;
  const fake = {
    speaking: false,
    getVoices: () => [
      { name: 'Test English', lang: 'en-US', localService: true, default: true },
      { name: 'Test Türkçe', lang: 'tr-TR', localService: true, default: false },
    ],
    speak(u) {
      spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name ?? null });
      q.push(u);
      clearTimeout(t);
      t = setTimeout(() => q.splice(0).forEach((x) => x.onend?.({})), 1500);
    },
    cancel() {
      clearTimeout(t);
      q.splice(0).forEach((x) => x.onerror?.({ error: 'canceled' }));
    },
    addEventListener() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
};

async function open(opts) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  const warns = [];
  const external = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
    if (m.type() === 'warning') warns.push(m.text());
  });
  page.on('worker', (w) => w.on('console', (m) => process.env.DEBUG && console.log('  [işçi]', m.text().slice(0, 300))));
  page.on('response', (r) => { if (r.status() >= 400 && process.env.DEBUG) console.log('  [http]', r.status(), r.url()); });
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (/^https?:$/.test(u.protocol) && !['localhost', '127.0.0.1'].includes(u.hostname)) external.push(r.url());
  });
  await page.addInitScript(MOCKS, opts);
  await page.goto(new URL('?tab=fener', base).href, { waitUntil: 'networkidle' });
  return { ctx, page, errors, warns, external };
}
const micPhase = (p) => p.getAttribute('[data-testid="fener-mic"]', 'data-phase');
const waitPhase = (p, ph, timeout = 15000) =>
  p.waitForFunction((ph) => document.querySelector('[data-testid="fener-mic"]')?.dataset.phase === ph, ph, { timeout });

// ---- 1+2) Sahte STT ve sesli okuma -------------------------------------------------
{
  const { ctx, page, errors, external } = await open({ stt: { text: 'Kanama nasıl durdurulur?', delayMs: 600, loadMs: 600 } });
  await waitPhase(page, 'idle');
  check(true, 'mikrofon düğmesi hazır (sahte ses modeli)');
  check((await page.getAttribute('[data-testid="fener-mic"]', 'aria-label')) === 'Sesli sor', 'aria-label: Sesli sor');
  const box = await page.locator('[data-testid="fener-mic"]').boundingBox();
  check(box.width >= 44 && box.height >= 44, `dokunma alanı ≥44px (${Math.round(box.width)}×${Math.round(box.height)})`);
  await page.click('[data-testid="fener-mic"]');
  await waitPhase(page, 'recording');
  await page.waitForTimeout(1600);
  const note = await page.textContent('[data-testid="fener-voice-note"]');
  check(/Dinleniyor 0:01/.test(note), 'kayıt göstergesi ve süre: ' + note.trim());
  const lvl = await page.evaluate(() => window.__fenerVoice?.level ?? 0);
  check(lvl > 0.05, 'ses düzeyi ölçülüyor: ' + lvl.toFixed(2));
  await page.screenshot({ path: shots + '/fener-voice-recording.png' });
  await page.click('[data-testid="fener-mic"]');
  await page.waitForFunction(() => ['loading', 'transcribing'].includes(document.querySelector('[data-testid="fener-mic"]')?.dataset.phase));
  await page.screenshot({ path: shots + '/fener-voice-transcribing.png' });
  await waitPhase(page, 'idle');
  const val = await page.inputValue('[data-testid="fener-input"]');
  check(val === 'Kanama nasıl durdurulur?', 'metin girişe yazıldı: ' + val);
  await page.screenshot({ path: shots + '/fener-voice-done.png' });

  // Cevap (model yok → rehber) ve sesli okuma
  await page.press('[data-testid="fener-input"]', 'Enter');
  await page.waitForFunction(() => [...document.querySelectorAll('[data-testid="fener-msg-bot"]')].pop()?.dataset.phase === 'done', null, { timeout: 30000 });
  await page.click('[data-testid="fener-speak"]');
  await page.waitForSelector('[data-testid="fener-speak"][data-speaking="true"]');
  const spoken = await page.evaluate(() => window.__spoken);
  check(spoken.length > 0 && spoken.every((s) => s.lang === 'tr-TR' && s.voice === 'Test Türkçe'), `tr-TR sesle okunuyor (${spoken.length} parça)`);
  check(!spoken.some((s) => /\[\d+\]/.test(s.text)), 'kaynak numaraları okunmuyor');
  check((await page.textContent('[data-testid="fener-speak"]')).includes('Durdur'), 'düğme Durdur oldu');
  await page.locator('[data-testid="fener-speak"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: shots + '/fener-voice-speaking.png' });
  await page.click('[data-testid="fener-speak"]');
  await page.waitForSelector('[data-testid="fener-speak"][data-speaking="false"]');
  check(true, 'Durdur ile okuma kesildi');
  check(external.length === 0, 'dış ağ isteği yok');
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await ctx.close();
}

// ---- 3) İzin reddi -------------------------------------------------------------------
{
  const { ctx, page, errors } = await open({ stt: { text: 'x' }, deny: true });
  await waitPhase(page, 'idle');
  await page.click('[data-testid="fener-mic"]');
  await waitPhase(page, 'error');
  const note = await page.textContent('[data-testid="fener-voice-note"]');
  check(/Mikrofon izni verilmedi/.test(note), 'izin reddi iletisi: ' + note.trim());
  await page.screenshot({ path: shots + '/fener-voice-denied.png' });
  await page.click('[data-testid="fener-voice-dismiss"]');
  await waitPhase(page, 'idle');
  check(!(await page.$('[data-testid="fener-voice-note"]')), 'uyarı kapatıldı');
  check(errors.length === 0, 'konsol hatası yok');
  await ctx.close();
}

// ---- 4+5) Paket yok → kullanılamaz; sahte paketle gerçek işçi yolu --------------------
{
  const { ctx, page, errors, warns, external } = await open({});
  await waitPhase(page, 'unavailable');
  await page.click('[data-testid="fener-mic"]');
  const note = await page.textContent('[data-testid="fener-voice-note"]');
  check(/ses paketi/i.test(note), 'paket yok iletisi: ' + note.trim());
  check(!!(await page.$('[data-testid="fener-voice-get"]')), '"Paket ekle" düğmesi var');
  await page.screenshot({ path: shots + '/fener-voice-unavailable.png' });

  // Sahte ses paketi (geçerli tar, bozuk ONNX) → OPFS
  await page.evaluate(async () => {
    const enc = new TextEncoder();
    const files = {
      'config.json': JSON.stringify({ model_type: 'whisper', architectures: ['WhisperForConditionalGeneration'], d_model: 8, encoder_layers: 1, decoder_layers: 1, encoder_attention_heads: 1, decoder_attention_heads: 1, num_mel_bins: 80, vocab_size: 51865, max_source_positions: 1500, max_target_positions: 448 }),
      'generation_config.json': JSON.stringify({ decoder_start_token_id: 50258, eos_token_id: 50257, lang_to_id: { '<|tr|>': 50268 }, task_to_id: { transcribe: 50359 }, is_multilingual: true, no_timestamps_token_id: 50363 }),
      'preprocessor_config.json': JSON.stringify({ feature_extractor_type: 'WhisperFeatureExtractor', feature_size: 80, sampling_rate: 16000, hop_length: 160, chunk_length: 30, n_fft: 400, n_samples: 480000, nb_max_frames: 3000, padding_value: 0, return_attention_mask: false }),
      'tokenizer.json': JSON.stringify({ version: '1.0', added_tokens: [], normalizer: null, pre_tokenizer: { type: 'ByteLevel', add_prefix_space: false, trim_offsets: true, use_regex: true }, post_processor: null, decoder: { type: 'ByteLevel' }, model: { type: 'BPE', vocab: { a: 0, b: 1 }, merges: [] } }),
      'tokenizer_config.json': JSON.stringify({ tokenizer_class: 'WhisperTokenizer' }),
      'onnx/encoder_model_quantized.onnx': 'bu bir onnx dosyası değil',
      'onnx/decoder_model_merged_quantized.onnx': 'bu da değil',
    };
    const BLOCK = 512;
    const chunks = [];
    for (const [path, text] of Object.entries(files)) {
      const data = enc.encode(text);
      const h = new Uint8Array(BLOCK);
      h.set(enc.encode(path), 0);
      const oct = (v, len) => enc.encode(v.toString(8).padStart(len - 1, '0') + '\0');
      h.set(oct(0o644, 8), 100); h.set(oct(0, 8), 108); h.set(oct(0, 8), 116); h.set(oct(data.length, 12), 124); h.set(oct(0, 12), 136);
      h[156] = 48; h.set(enc.encode('ustar\0'), 257); h.set(enc.encode('00'), 263);
      for (let i = 148; i < 156; i++) h[i] = 32;
      let sum = 0; for (let i = 0; i < BLOCK; i++) sum += h[i];
      h.set(enc.encode(sum.toString(8).padStart(6, '0') + '\0 '), 148);
      chunks.push(h, data, new Uint8Array((BLOCK - (data.length % BLOCK)) % BLOCK));
    }
    chunks.push(new Uint8Array(BLOCK * 2));
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('packs', { create: true });
    const fh = await dir.getFileHandle('whisper-test-ses.tar', { create: true });
    const w = await fh.createWritable();
    await w.write(new Blob(chunks));
    await w.close();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await waitPhase(page, 'idle');
  check(true, 'ses paketi bulunca düğme etkin');
  await page.click('[data-testid="fener-mic"]');
  await waitPhase(page, 'recording');
  await page.waitForTimeout(1200);
  await page.click('[data-testid="fener-mic"]');
  await waitPhase(page, 'error', 90000).catch(async (e) => { console.log('durum:', JSON.stringify(await page.evaluate(() => window.__fenerVoice)), 'uyarılar:', JSON.stringify(warns)); throw e; });
  const err = await page.textContent('[data-testid="fener-voice-note"]');
  const raw = warns.filter((w) => w.startsWith('[ses]'));
  console.log('işçi hatası:', JSON.stringify(raw), '→', err.trim());
  check(/onnx|protobuf|model|session|parse/i.test(raw.join(' ')), 'ONNX Runtime yerel wasm ile başladı, bozuk modeli reddetti');
  check(!/fetch|network|cdn|jsdelivr|huggingface/i.test(raw.join(' ')), 'dosyalar ağdan istenmedi');
  check(external.length === 0, 'dış ağ isteği yok' + (external.length ? ': ' + external.slice(0, 3).join(', ') : ''));
  await page.screenshot({ path: shots + '/fener-voice-badpack.png' });
  check(errors.length === 0, 'konsol hatası yok' + (errors.length ? ': ' + errors.join(' | ') : ''));
  // Temizlik
  await page.evaluate(async () => {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('packs', { create: true });
    await dir.removeEntry('whisper-test-ses.tar').catch(() => {});
  });
  await ctx.close();
}

await browser.close();
console.log(fails.length ? fails.length + ' HATA' : 'TÜMÜ OK');
process.exit(fails.length ? 1 : 0);
