# Fener modelleri ve ses paketleri

Fener, cihazda çalışan bir dil modeli (GGUF, wllama/llama.cpp) ve isteğe bağlı bir
konuşma tanıma modeli (Whisper, transformers.js/ONNX) kullanır. İkisi de "paket"
olarak gelir: cihazın deposuna (OPFS) indirilir/içe aktarılır ya da bilgi noktası
sunucusunun `data/` klasöründen okunur. Hiçbiri olmadan Fener rehberden yanıt verir.

## 1. Önerilen dil modelleri (Kasım 2026)

| Paket | Dosya | Boyut | Lisans | Nerede |
|---|---|---|---|---|
| Qwen2.5 0.5B | `qwen2.5-0.5b-instruct-q4_k_m.gguf` | 491 400 032 B | Apache-2.0 | 2 GB RAM'li eski telefon |
| Qwen3.5 0.8B | `Qwen3.5-0.8B-Q4_K_M.gguf` | 532 517 120 B | Apache-2.0 | 3–4 GB RAM'li telefon |
| **Qwen3.5 2B** | `Qwen3.5-2B-Q4_K_M.gguf` | 1 280 835 840 B | Apache-2.0 | **telefonlar için öneri** (4–6 GB) |
| **Qwen3.5 4B** | `Qwen3.5-4B-Q4_K_M.gguf` → 2 parça | 2 740 937 888 B | Apache-2.0 | **bilgi noktası için öneri** (8 GB+) |
| Gemma 4 E2B | `gemma-4-E2B-it-Q4_K_M.gguf` → 2 parça | 3 106 738 272 B | Apache-2.0 | bilgi noktası, ikinci seçenek |

Kaynak adresleri (tek dosya, HuggingFace):

- https://huggingface.co/unsloth/Qwen3.5-0.8B-GGUF/resolve/main/Qwen3.5-0.8B-Q4_K_M.gguf
- https://huggingface.co/unsloth/Qwen3.5-2B-GGUF/resolve/main/Qwen3.5-2B-Q4_K_M.gguf
  (SHA-256 `aaf42c8b7c3cab2bf3d69c355048d4a0ee9973d48f16c731c0520ee914699223`)
- https://huggingface.co/unsloth/Qwen3.5-4B-GGUF/resolve/main/Qwen3.5-4B-Q4_K_M.gguf
- https://huggingface.co/unsloth/gemma-4-E2B-it-GGUF/resolve/main/gemma-4-E2B-it-Q4_K_M.gguf

Notlar:
- Aynı depolardaki `mmproj-*.gguf` (görsel kodlayıcı) ve `mtp-*.gguf` dosyaları
  gerekmez; Fener bunları model saymaz.
- Qwen3.5 ve Gemma 4 "düşünme" kipini destekler; Fener her istekte
  `enable_thinking: false` gönderir ve kalan `<think>` bölümlerini cevaptan atar.
- Qwen3.5 2B/4B Gated DeltaNet karma mimarisindedir; wllama 3.8.1'in llama.cpp'si
  `qwen35` ve `gemma4` mimarilerini içerir.
- Gemma 4 E2B "2B etkin parametre" hızında çalışır ama katman başı gömme tabloları
  yüzünden 3,1 GB bellek ister.

## 2. Otomatik seçim ve elle seçim

`src/lib/fener/models.ts` → `chooseModel`:
1. Fener durum çubuğundaki model adına dokunup elle seçilen model (kalıcıdır,
   `localStorage: ac.fenerModel`). "Otomatik" seçeneği elle seçimi kaldırır.
2. Yoksa cihaza sığan en büyük model. Bellek ihtiyacı ≈ dosya × 1,1 + KV önbelleği
   (0,15–0,3 GB) + 0,15 GB; bütçe `navigator.deviceMemory` × %50 (≤4 GB) / %55.
   4 çekirdeğe kadar ≤2,5B, 2 çekirdekte ≤1B parametre.
3. Hiçbiri sığmıyorsa en küçük model.

Eksik parçalı modeller ve 2 GB'tan büyük **bölünmemiş** dosyalar otomatik seçilmez.

Model boyutuna göre istem (`promptProfile`): 1,2B altı eski davranış (2048 bağlam,
384 token cevap, kısa istem); 1,2B ve üstü 4096 bağlam, 512–640 token cevap,
daha çok Vikipedi metni, daha uzun geçmiş ve ayrıntılı sistem istemi.

## 3. 2 GB'tan büyük modelleri bölme

Tarayıcılar tek dosyayı ~2 GB'tan büyük bir ArrayBuffer'a alamaz. wllama bölünmüş
GGUF'ları (`Blob[]`) yükler. llama.cpp'nin `llama-gguf-split` aracını
(https://github.com/ggml-org/llama.cpp/releases adresindeki hazır Windows/Linux/macOS arşivlerinde bulunur) kullanın:

```
llama-gguf-split --split --split-max-size 1600M Qwen3.5-4B-Q4_K_M.gguf Qwen3.5-4B-Q4_K_M
# → Qwen3.5-4B-Q4_K_M-00001-of-00002.gguf, Qwen3.5-4B-Q4_K_M-00002-of-00002.gguf

llama-gguf-split --split --split-max-size 1600M gemma-4-E2B-it-Q4_K_M.gguf gemma-4-E2B-it-Q4_K_M
```

- Parçalar aynı klasöre (bilgi noktasında `data/` ya da `data/models/`) konur ya da
  hepsi içe aktarılır. Ad kalıbı `<ad>-0000N-of-0000M.gguf` korunmalıdır.
- Fener parçaları tek model olarak gösterir ("2 parça"); eksik parça varsa model
  listede görünür ama seçilemez.
- Katalogda (`public/packs-manifest.json`) parçalar aynı `group` değerini taşır ve
  `https://akilcantasi.com/packs/` aynasını gösterir; parçaları oraya yükleyince
  `size` değerlerini gerçek boyutla güncelleyip `sizeApprox: false` yapın.
- Birleştirme gerekirse: `llama-gguf-split --merge <ad>-00001-of-00002.gguf birlesik.gguf`.

## 4. "Sesli sor" ses paketi (Whisper)

Konuşma tanıma tamamen cihazda, transformers.js 4.3 (ONNX Runtime Web, WASM) ile
çalışır; ayrı bir Web Worker'da. ONNX Runtime wasm dosyası uygulamayla paketlenir.
Model dosyaları tek bir **.tar** arşivi olarak gelir (paket türü `ses`).

Neden bu yol: whisper.cpp'nin tarayıcı derlemeleri (ör. @transcribe/transcriber)
SharedArrayBuffer ve COOP/COEP ister; Android WebView'de bu yoktur. ONNX Runtime
Web tek iş parçacığıyla da çalışır.

### whisper-base (telefonlar için, ~80 MB)

```
mkdir whisper-base && cd whisper-base && mkdir onnx
set R=https://huggingface.co/onnx-community/whisper-base/resolve/main
curl -L -O %R%/config.json
curl -L -O %R%/generation_config.json
curl -L -O %R%/preprocessor_config.json
curl -L -O %R%/tokenizer.json
curl -L -O %R%/tokenizer_config.json
curl -L -o onnx/encoder_model_quantized.onnx %R%/onnx/encoder_model_quantized.onnx
curl -L -o onnx/decoder_model_merged_quantized.onnx %R%/onnx/decoder_model_merged_quantized.onnx
tar -cf ..\whisper-base-ses.tar config.json generation_config.json preprocessor_config.json tokenizer.json tokenizer_config.json onnx
```

(Linux/macOS'ta `set R=…` yerine `R=…` ve `%R%` yerine `$R`.) Windows 10+ içindeki
`tar.exe` yeterlidir.

| Dosya | Bayt |
|---|---|
| config.json | 2 243 |
| generation_config.json | 3 832 |
| preprocessor_config.json | 339 |
| tokenizer.json | 2 480 466 |
| tokenizer_config.json | 282 682 |
| onnx/encoder_model_quantized.onnx | 23 201 314 |
| onnx/decoder_model_merged_quantized.onnx | 53 693 315 |

### whisper-small (bilgi noktası / güçlü telefon, ~252 MB, daha doğru Türkçe)

Aynı komutlar, `R=https://huggingface.co/onnx-community/whisper-small/resolve/main`,
çıktı `whisper-small-ses.tar`. Boyutlar: config.json 2 227, generation_config.json 3 893,
preprocessor_config.json 339, tokenizer.json 2 480 466, tokenizer_config.json 282 683,
encoder_model_quantized.onnx 92 326 160, decoder_model_merged_quantized.onnx 156 750 845.

Notlar:
- Tar içinde dosyalar kökte ya da tek bir üst klasörde (`whisper-base/…`) olabilir.
- Başka hassasiyetler de tanınır (`_q4`, `_fp16`, ekisiz fp32 …); Fener bulduğunu kullanır.
- İki paket de kuruluysa güçlü cihazda (≥6 GB, ≥6 çekirdek) small, diğerlerinde base seçilir.
- Kayıt en çok 30 sn (Whisper penceresi). Whisper'ın sessizlikte uydurduğu bilinen
  altyazı kalıpları ("Altyazı M.K." vb.) atılır.

## 5. "Sesli oku"

Tarayıcının `speechSynthesis` API'si; cihazda tr-TR ses varsa o seçilir, çevrimdışıyken
yalnızca cihaz üstü sesler kullanılır. Android WebView `speechSynthesis` sağlamaz:
APK'da sesli okuma için `@capacitor-community/text-to-speech` eklentisi kurulmalıdır
(kuruluysa Fener onu kendiliğinden kullanır).
