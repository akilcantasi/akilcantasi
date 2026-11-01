# Akıl Çantası

İnternet ve şebeke yokken de çalışan, açık kaynak afet bilgi uygulaması. Telefonda
(Android APK ya da tarayıcı), bilgisayarda ya da bir Raspberry Pi'de çalışır. Altı sekme:

- **Fener** — cihazda çalışan yapay zekâ asistanı (GGUF modeli, wllama/llama.cpp). Rehberlerden ve
  Kütüphane'deki ZIM arşivlerinden kaynak göstererek cevap verir. Model yoksa rehberden cevap verir.
  İsteğe bağlı **sesli sor** (Whisper, cihazda) ve **sesli oku**.
- **Rehber** — 18 kategoride **168 resimli rehber** (deprem, ilk yardım, yangın, sel, su ve gıda,
  barınma, psikolojik destek, özel gruplar…). Yapay zekâ kullanmaz; arama ve kategori listesiyle çalışır.
- **Harita** — çevrimdışı Türkiye haritası (PMTiles), GPS konumu, toplanma alanı / sağlık / eczane
  noktaları, en yakın toplanma alanı, pusula ile hedefe yön, iz kaydı, yer işaretleri, "konumumu söyle".
- **İletişim** — aynı ağdaki herkesle **mesaj panosu**, **iyiyim bildirimi**, **kayıp kişi** ilanları,
  **duyurular**; SOS ışık ve ses, Mors çevirici, konumlu hazır SMS. Bilgi noktası yokken mesajlar
  giden kutusunda bekler. Android'de **şebekesiz mesh** (yakın telefonlar arasında biriktir-ilet).
- **Kütüphane** — birden çok ZIM arşivi tek yerde (Vikipedi, WikiMed, Vikikitap, Vikisözlük,
  Vikikaynak, zimgit afet/su/tıp/düğüm/yemek arşivleri…): başlık ve tam metin araması, makale okuma,
  "bu makale hakkında Fener'e sor".
- **Araçlar** — afet çantası kontrol listesi, su ve yiyecek hesabı, stok listesi, pil ve şarj, pusula,
  çocuk köşesi, acil durum cümleleri (çok dilli), radyo rehberi, **Paketler ve paylaşım**
  (indirme, içe aktarma, bilgi noktası), ayarlar.

Lisans: GPL-3.0-or-later. İçerik lisansları uygulamada *Araçlar → Paketler ve paylaşım → Kaynaklar
ve lisanslar* bölümündedir.

> **Uyarı:** Rehber metinleri kaynaklarla karşılaştırıldı (`docs/dogrulama/`) ama henüz bir ilk yardım
> eğitmeni / AFAD gönüllüsü tarafından onaylanmadı. Yayından önce uzman okumasından geçmelidir
> (aşağıdaki listeye bakın).

---

## Klasör yapısı

```
Akıl Çantası/
├─ data/                    ← paketler (bilgi noktası buradan sunar)
│   ├─ zim/                 ← Kütüphane arşivleri (*.zim)
│   ├─ models/              ← Fener modelleri (*.gguf)
│   ├─ ses/                 ← Fener ses paketleri (whisper-*-ses.tar)
│   └─ maps/                ← harita (*.pmtiles) ve noktalar (*.geojson)
├─ dist/                    ← derlenmiş uygulama
├─ server/                  ← bilgi noktası sunucusu (Node.js, bağımlılıksız)
├─ android/                 ← Android projesi (Capacitor 8)
├─ src/                     ← uygulama kaynak kodu (TypeScript + Preact)
├─ tools/                   ← Windows yardımcı betikleri, Raspberry Pi kurulumu (tools/pi)
├─ docs/                    ← Fener modelleri, mesh, doğrulama notları
├─ tests/, e2e/             ← birim ve tarayıcı testleri
├─ onizle.cmd               ← Windows: tek tıkla önizleme
├─ harita-uret.cmd          ← Windows: güncel Türkiye haritası (z15) ve afet noktaları
├─ apk-derle.cmd            ← Windows: Android Studio olmadan APK
└─ paketleri-yerlestir.cmd  ← Windows: İndirilenler'deki paketleri data\ içine taşır
```

Paket dosyaları: `.zim` (Kütüphane), `.gguf` (Fener modeli; 2 GB üstü parçalı), `.tar` (Fener ses
paketi), `.pmtiles` (harita), `.geojson` (harita noktaları). `data/` içinde ve bir alt düzey
klasörde (`data/zim`, `data/models`…) aranır; adı `_` ya da `.` ile başlayanlar atlanır.

---

## 0) Windows yardımcı betikleri

| Betik | Ne yapar |
| --- | --- |
| `onizle.cmd [port]` | Node.js yoksa taşınabilir sürümünü indirir (~30 MB, bir kez), bilgi noktasını `data\` ile başlatır, tarayıcıda `http://localhost:8080` açar. Telefon görünümü: F12 → Ctrl+Shift+M. |
| `harita-uret.cmd` | Güncel **Türkiye haritasını** (Protomaps günlük derlemesinden yalnızca Türkiye + KKTC sınırı içi, sokak/bina numarası/eczane ayrıntısıyla z15, ~1,5–2,5 GB) `data\maps\turkiye.pmtiles` olarak indirir (eskisi `data\maps\_eski\` içine taşınır) ve **afet noktalarını** OpenStreetMap'ten `data\maps\turkiye-afet-noktalari.geojson` olarak toplar. Yarıda kalırsa tekrar çalıştırın, kaldığı yerden sürer. Seçenekler: `-SadeceHarita`, `-SadeceNoktalar`, `-MaxZoom 14`. go-pmtiles (~10 MB) ve gerekirse Node.js bir kez indirilir. |
| `hf-yukle.cmd` | Geliştirici aracı. Önerilen ve Türkçe kütüphane paketlerini, haritaları ve afet noktalarını Hugging Face'teki `akilcantasi/paketler` deposuna yükler; katalogdaki ilk indirme adresini Hugging Face yapar. Böylece telefonlar da paketleri hızlı ve kesintisiz indirir. Paket listesi: `tools/hf/paketler.json`. Token bir kez sorulur, isterseniz Windows şifrelemesiyle saklanır (`-TokenSil` ile silinir). `-Deneme` yalnızca planı gösterir. |
| `paketleri-yerlestir.cmd` | İndirilenler klasöründeki bilinen paketleri `data\zim`, `data\models`, `data\ses` içine **taşır**; Whisper dosyalarından ses paketini (`.tar`) Windows'un `tar.exe`'siyle hazırlar ve özet yazar. |
| `apk-derle.cmd` | Java 21, Node.js ve Android SDK'yı `%LOCALAPPDATA%\AkilCantasi-build` içine indirip APK derler → `data\akil-cantasi.apk` (ayrıntı: bölüm 2). |
| `server\start-windows.cmd` | Yalnızca bilgi noktası sunucusu (Node.js kurulu olmalı). |

### Paketleri yerleştirme

`paketleri-yerlestir.cmd` şu dosyaları tanır (tarayıcıyla İndirilenler'e indirdiğiniz hâlleriyle):

| Dosya | Hedef |
| --- | --- |
| `qwen2.5-3b-instruct-q4_k_m.gguf`, `Qwen3.5-2B-Q4_K_M.gguf` | `data\models\` |
| `wikibooks_tr_all_maxi_2026-09.zim`, `wikisource_tr_all_nopic_2026-10.zim`, `wiktionary_tr_all_nopic_2026-10.zim` | `data\zim\` |
| `mdwiki_en_all_maxi_2025-11.zim` (WikiMed) | `data\zim\` |
| `zimgit-post-disaster_en_2024-05.zim`, `zimgit-water_en_2024-08.zim`, `zimgit-medicine_en_2024-08.zim`, `zimgit-knots_en_2024-08.zim`, `zimgit-food-preparation_en_2025-04.zim` | `data\zim\` |
| Whisper: `config.json`, `generation_config.json`, `preprocessor_config.json`, `tokenizer.json`, `tokenizer_config.json`, `encoder_model_quantized.onnx`, `decoder_model_merged_quantized.onnx` | `data\ses\whisper-base-ses.tar` |

- Hedefte aynı adlı dosya varsa üzerine yazmaz, indirileni yerinde bırakır. Başka hiçbir şeyi silmez.
- Whisper dosyaları yalnızca 7'si de varsa ve `config.json` gerçekten bir Whisper modeline aitse
  paketlenir (whisper-small dosyaları `whisper-small-ses.tar` olur). Arşiv düzeni: json'lar kökte,
  modeller `onnx/` altında (`docs/FENER_MODELLER.md`).
- Seçenekler: `paketleri-yerlestir.cmd -Deneme` (hiçbir şey taşımadan göster),
  `-Kaynak D:\indirilenler`, `-Hedef E:\paketler`.

> **Lisans notu — Qwen2.5-3B:** `qwen2.5-3b-instruct` Apache-2.0 değil, **Qwen Research License**
> ile yayımlanır: araştırma ve ticari olmayan kullanım içindir. Kişisel kullanım ve gönüllü/ücretsiz
> dağıtım için uygundur; uygulamayı ya da paketleri ticari bir ürünle birlikte dağıtacaksanız bunun
> yerine Apache-2.0 lisanslı **Qwen3.5 2B / 4B** modellerini kullanın.

Fener modelleri, cihaza göre otomatik seçim, 2 GB'tan büyük modelleri bölme ve ses paketleri:
[docs/FENER_MODELLER.md](docs/FENER_MODELLER.md).

---

## 1) Bilgisayarda çalıştırma — bilgi noktası (Windows / macOS / Linux)

Gerekli: [Node.js](https://nodejs.org) 18+ (LTS). Başka kurulum gerekmez.

**Windows:** `onizle.cmd` ya da `server\start-windows.cmd`. **macOS / Linux:** `./server/start.sh`

- Güvenlik duvarı sorarsa **Özel ağlar**'a izin verin.
- Pencerede `http://192.168.x.x:8080` adresi ve QR kod çıkar. Aynı Wi-Fi'daki / erişim noktasındaki
  telefonlar bu adresi tarayıcıda açar; uygulama kurmaya gerek yok (iPhone dahil).
- İletişim sekmesindeki mesaj panosu bu sunucuda tutulur (`data/board.json`).
- APK'yı `data/akil-cantasi.apk` olarak koyarsanız telefonlar uygulamayı bilgi noktasından indirebilir.

Seçenekler: `--port 8081`, `--data D:\paketler`. Ayrıntılar ve uç noktalar:
[server/README.md](server/README.md) (Windows'ta mobil etkin nokta açma dahil).

### Raspberry Pi bilgi noktası

`tools/pi/` bir Raspberry Pi'yi kendi Wi-Fi ağını yayan, açılışta başlayan bir bilgi noktasına
çevirir (`kur.sh --hotspot`, isteğe bağlı captive portal). Güç/güneş paneli ve SD kart ipuçları:
[tools/pi/README.md](tools/pi/README.md). Betikler gerçek bir Pi'de henüz denenmedi.

---

## 2) Android APK derleme

### Kolay yol: Android Studio olmadan (Windows)

`apk-derle.cmd` dosyasına çift tıklayın. Betik yönetici izni istemeden gerekenleri (Java 21,
Node.js, Android komut satırı araçları) `%LOCALAPPDATA%\AkilCantasi-build` içine indirir, projeyi
oraya kopyalayıp derler (Gradle, Türkçe karakterli yollarda sorun çıkarabildiği için) ve sonucu
**`data\akil-cantasi.apk`** olarak bırakır. İlk çalıştırma ~1,5 GB indirir ve 10–20 dakika sürer;
sonrakiler birkaç dakika. Kayıt: `apk-derle.log`. Kullanıcı adınızda Türkçe karakter varsa betik
uyarır; derleme hata verirse `%LOCALAPPDATA%` yerine ASCII bir yol gerekir.

Bu APK hata ayıklama (debug) anahtarıyla imzalıdır: kendi telefonlarınıza kurmak ve elden dağıtmak
için yeterlidir. Mağaza ya da uzun süreli dağıtım için imzalı derleme kullanın.

### Android Studio ile

Gerekli: [Android Studio](https://developer.android.com/studio) (JDK 21 dahil), Node.js 22+ (Capacitor 8 CLI bunu ister).

```bash
npm install
npm run build          # tür denetimi + web uygulamasını dist/ içine derler
npx cap sync android   # dist/ → android/app/src/main/assets/public, eklentileri bağlar
```

Sonra Android Studio → **Open** → `android/`; ▶ **Run** ya da **Build → Generate Signed App
Bundle / APK**. Komut satırından: `cd android && ./gradlew assembleRelease`.

Paket adı `org.akilcantasi.app`, en düşük Android 7 (API 24), hedef API 36. Eklentiler:
`AkilCantasi` (bilgi noktası, APK paylaşma), `AkilMesh` (Nearby Connections mesh; Google Play
Hizmetleri gerekir), `@capacitor-community/text-to-speech` (sesli oku). İzinler: mikrofon (sesli
sor), konum (harita, mesh), Bluetooth / Yakındaki cihazlar / Wi-Fi (mesh), uyanık kalma kilidi
(bilgi noktası).

### APK'da paketler

- **Araçlar → Paketler ve paylaşım → Dosyadan içe aktar:** telefona USB ile kopyalanmış
  `.zim/.gguf/.tar/.pmtiles/.geojson` dosyasını seçin; uygulamanın deposuna kopyalanır.
- **… → İndir:** internet varken katalogdan indirir (kaldığı yerden devam eder, SHA-256 doğrular).
- **Bilgi noktası:** telefon tarayıcısından bilgisayarın / Pi'nin adresini açmak yeterli.

### Telefonu bilgi noktası yapma

*Araçlar → Paketler ve paylaşım → Bilgi noktası* anahtarı telefonda küçük bir sunucu başlatır
(port 8080) ve erişim noktası ayarlarını açar. Diğer telefonlar `http://<telefon-ip>:8080`
adresinden uygulamayı açar, APK'yı indirir ve mesaj panosunu kullanır. Paylaşılacak paketleri
telefonda şu klasöre koyun (USB ile): `Android/data/org.akilcantasi.app/files/packs/`

### Şebekesiz mesh

Android'de İletişim mesajları yakın telefonlar arasında Bluetooth/Wi-Fi ile (Google Nearby
Connections) biriktir-ilet yöntemiyle taşınır. Tasarım ve iki telefonla test planı:
[docs/MESH.md](docs/MESH.md).

---

## 3) Geliştirme

```bash
npm install
npm run dev            # http://localhost:5173 (COOP/COEP başlıklı)
npm test               # birim testleri (vitest)
npm run typecheck      # tsc --noEmit
npm run build          # tür denetimi + üretim derlemesi
npm run serve          # dist/ + data/ ile bilgi noktası (port 8080)
```

Derinden bağlantılar: `?tab=<sekme>`, `?guide=<rehber>`, `?cat=<kategori>`, `?tool=<araç>`,
`?comm=<bölüm>`. Geliştirme bayrakları: `?devzim=<url>[,<url>…]`, `?devmodel=<url>`, `?art`
(çizim galerisi).

Uçtan uca testler (Playwright):

```bash
node server/server.mjs --data <paket-klasörü> --port 8090
node e2e/real-data-check.mjs http://localhost:8090/ ./ekranlar   # gerçek ZIM, model, harita
node e2e/download-check.mjs                                       # indirme / devam / SHA-256 / silme
node e2e/native-infopoint-check.mjs http://localhost:8090/        # Android bilgi noktası (taklit)
node e2e/qa-platform.mjs                                          # sunucu, başlıklar, paketler
```

Diğerleri: `e2e/*-check.mjs` ve `e2e/qa-*.mjs`.

---

## Paketlerin barındırılması ve aylık güncelleme

- İçerik paketlerinin hızlı kopyaları Hugging Face'teki **akilcantasi/paketler** deposundadır
  (her cihazdan, tarayıcıdan da, hızlı ve kesintisiz indirilir). Uygulama internet varken oradaki
  `packs-manifest.json` kataloğunu okuyup yeni sürümleri öğrenir.
- **Aylık güncelleme:** `.github/workflows/aylik-harita.yml` her ayın 3'ünde Türkiye haritasını
  (Protomaps günlük derlemesinden, OpenStreetMap verisi) ve afet noktalarını (Overpass) yeniden
  üretip Hugging Face'e yükler, güncellenen kataloğu bu depoya işler. Elle çalıştırmak için
  GitHub'da Actions → "Aylık harita ve afet noktaları" → Run workflow. Gizli değişken: `HF_TOKEN`.
- Kütüphane paketlerini elle yansılamak için Windows'ta `hf-yukle.cmd` (bkz. yukarı).

## Bilinen sınırlamalar

- **http ile bağlanan telefonlar** "güvenli bağlam" sayılmaz: paketler telefona kaydedilemez
  (sunucudan okunur), Fener tek iş parçacığında daha yavaştır. Kalıcı kullanım için APK önerilir.
- Harita yazıları yalnızca Latin harfleriyle çizilir (gömülü Noto Sans: Türkçe karakterler dahil);
  sınır ötesindeki Arapça, Yunanca, Gürcüce adlar görünmez.
- Tarayıcılar tek dosyada ~2 GB üstünü belleğe alamaz; büyük modeller **parçalı GGUF** olmalıdır.
  Fener için ~1,2 GB'lık Qwen3.5 2B telefonlarda, 4B bilgi noktasında önerilir.
- Sesli sor kayıtları en çok 30 sn'dir; Android WebView'de sesli oku için TTS eklentisi kullanılır,
  cihazda Türkçe ses yoksa okunmaz.
- Telefondaki bilgi noktası yalnızca `packs/` klasöründeki dosyaları paylaşır (uygulama içine
  aktarılanları değil); ön plan servisi yoktur, uygulamayı açık ve telefonu şarjda tutun.
- **Android uygulaması, mesh ve Raspberry Pi betikleri gerçek cihazda denenmedi** (bu ortamda
  Android SDK ve Pi yok). Java kodu taklit sınıflara karşı derlendi, bilgi noktası masaüstünde canlı
  HTTP testlerinden geçti.
- Windows betikleri (`*.cmd`, `tools/*.ps1`) Windows'ta çalıştırılarak değil, okunarak denetlendi.
- Katalogdaki bazı boyutlar yaklaşıktır (`sizeApprox`); büyük parçalı modeller için ayna adresi
  henüz yüklenmedi.
- İlk açılışta yüklenen JavaScript ~1,6 MB'tır (gzip ~500 KB); bunun çoğu rehber çizimleri ve
  metinleridir. Harita, Fener motoru, ses tanıma ve araçlar ihtiyaç olunca yüklenir.

## Uzman onayı gereken rehber noktaları

Ezilme (crush) sendromu, turnike kullanımı, çamaşır suyuyla su arıtma damla oranları, gıda saklama
süreleri, sıcak çarpması, hipotermi, burun kanaması, jeneratör mesafesi (karbonmonoksit), düdük
işaretleri ve 112 yönlendirmeleri, ilaç ve zehirlenme rehberleri, kaynak gösterimleri. Rehberler:
`src/content/guides/*.ts`; kaynak karşılaştırmaları: `docs/dogrulama/`.

## Teşekkür

Kiwix / openZIM, Wikimedia, OpenStreetMap, Protomaps, MapLibre, llama.cpp / wllama, Qwen,
Hugging Face transformers.js / ONNX Runtime, OpenAI Whisper, Capacitor.
